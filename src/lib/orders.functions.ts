import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getMenuItem } from "@/data/menu";
import { shop } from "@/lib/shop";
import type { CartLine, Order, OrderStatus, SelectedOption } from "@/lib/types";

const lineSchema = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1).max(20),
  sizeId: z.string().optional(),
  choiceIds: z.array(z.string()).default([]),
});

const placeSchema = z.object({
  type: z.enum(["dineIn", "takeout", "delivery"]),
  customerName: z.string().trim().min(1).max(80),
  tableNumber: z.string().trim().max(10).default(""),
  phone: z.string().trim().max(30).default(""),
  address: z.string().trim().max(200).default(""),
  notes: z.string().trim().max(300).default(""),
  paymentMethod: z.enum(["gcash", "card", "cash"]),
  lines: z.array(lineSchema).min(1).max(40),
});

type PlaceInput = z.infer<typeof placeSchema>;

/** Prices are always recalculated here from the menu — never trusted from the browser. */
function priceLines(lines: PlaceInput["lines"]) {
  const priced: CartLine[] = [];

  lines.forEach((line, index) => {
    const item = getMenuItem(line.itemId);
    if (!item || !item.available) throw new Error("One of the items is no longer available.");

    const size = item.sizes?.find((s) => s.id === line.sizeId);
    const options: SelectedOption[] = [];
    let unitPrice = item.price + (size?.priceDelta ?? 0);

    for (const group of item.options ?? []) {
      for (const choice of group.choices) {
        if (!line.choiceIds.includes(choice.id)) continue;
        unitPrice += choice.priceDelta;
        options.push({
          groupId: group.id,
          groupLabel: group.label,
          choiceId: choice.id,
          choiceLabel: choice.label,
          priceDelta: choice.priceDelta,
        });
      }
    }

    priced.push({
      lineId: `${item.id}-${index}`,
      itemId: item.id,
      name: item.name,
      image: item.image,
      quantity: line.quantity,
      ...(size ? { sizeId: size.id, sizeLabel: size.label } : {}),
      options,
      unitPrice,
      subtotal: unitPrice * line.quantity,
    });
  });

  return priced;
}

function validateDetails(input: PlaceInput) {
  if (input.type === "dineIn" && !input.tableNumber) throw new Error("Table number is required.");
  if (input.type !== "dineIn" && input.phone.length < 7)
    throw new Error("A contact number is required.");
  if (input.type === "delivery" && input.address.length < 8)
    throw new Error("A full delivery address is required.");
}

function originFromRequest() {
  const request = getRequest();
  const origin = request?.headers.get("origin");
  if (origin) return origin;
  return new URL(request?.url ?? "http://localhost:8080").origin;
}

async function createStripeSession(params: {
  secretKey: string;
  orderNumber: number;
  amount: number;
  method: "card" | "gcash";
  successUrl: string;
  cancelUrl: string;
  orderId: string;
}) {
  const body = new URLSearchParams({
    mode: "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    client_reference_id: params.orderId,
    "metadata[order_id]": params.orderId,
    "payment_method_types[0]": params.method,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "php",
    "line_items[0][price_data][unit_amount]": String(Math.round(params.amount * 100)),
    "line_items[0][price_data][product_data][name]": `${shop.name} order #${params.orderNumber}`,
  });

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const json = (await res.json()) as { id?: string; url?: string; error?: { message?: string } };
  if (!res.ok || !json.url || !json.id) {
    console.error("Stripe session error", json.error);
    throw new Error("We couldn't start the payment. Please try again or pay at the counter.");
  }
  return { id: json.id, url: json.url };
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => placeSchema.parse(data))
  .handler(async ({ data }) => {
    validateDetails(data);

    const items = priceLines(data.lines);
    const subtotal = items.reduce((sum, l) => sum + l.subtotal, 0);
    const deliveryFee = data.type === "delivery" ? shop.deliveryFee : 0;
    const total = subtotal + deliveryFee;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        type: data.type,
        customer_name: data.customerName,
        phone: data.phone,
        table_number: data.tableNumber,
        address: data.address,
        notes: data.notes,
        items: items as unknown as never,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        payment_method: data.paymentMethod,
        payment_status: data.paymentMethod === "cash" ? "pay_on_arrival" : "pending",
      })
      .select("id, number, access_token")
      .single();

    if (error || !order) {
      console.error("Order insert failed", error);
      throw new Error("We couldn't send your order to the café. Please try again.");
    }

    const trackUrl = `/order/${order.id}?t=${order.access_token}`;

    if (data.paymentMethod === "cash") {
      return { orderId: order.id, token: order.access_token, checkoutUrl: null, trackUrl };
    }

    const secretKey = process.env["STRIPE_SECRET_KEY"];
    if (!secretKey) {
      await supabaseAdmin.from("orders").update({ payment_status: "failed" }).eq("id", order.id);
      throw new Error(
        "Card and GCash payments aren't connected yet. Please choose cash for now.",
      );
    }

    const origin = originFromRequest();
    const session = await createStripeSession({
      secretKey,
      orderId: order.id,
      orderNumber: order.number,
      amount: total,
      method: data.paymentMethod,
      successUrl: `${origin}${trackUrl}&paid=1`,
      cancelUrl: `${origin}/checkout?cancelled=1`,
    });

    await supabaseAdmin
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return {
      orderId: order.id,
      token: order.access_token,
      checkoutUrl: session.url,
      trackUrl,
    };
  });

export type PublicOrder = Pick<
  Order,
  | "id"
  | "number"
  | "type"
  | "customerName"
  | "phone"
  | "tableNumber"
  | "address"
  | "notes"
  | "items"
  | "subtotal"
  | "deliveryFee"
  | "total"
  | "paymentMethod"
  | "status"
  | "createdAt"
> & { paymentStatus: string };

/** A customer can only see the single order whose secret link they hold. */
export const getOrderByToken = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ orderId: z.string().uuid(), token: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }): Promise<PublicOrder | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", data.orderId)
      .eq("access_token", data.token)
      .maybeSingle();

    if (!row) return null;

    return {
      id: row.id,
      number: row.number,
      type: row.type as PublicOrder["type"],
      customerName: row.customer_name,
      phone: row.phone,
      tableNumber: row.table_number,
      address: row.address,
      notes: row.notes,
      items: row.items as unknown as CartLine[],
      subtotal: Number(row.subtotal),
      deliveryFee: Number(row.delivery_fee),
      total: Number(row.total),
      paymentMethod: row.payment_method as PublicOrder["paymentMethod"],
      paymentStatus: row.payment_status,
      status: row.status as OrderStatus,
      createdAt: row.created_at,
    };
  });

/* ----------------------------- staff side ----------------------------- */

export type StaffOrder = PublicOrder & {
  acceptedAt: string | null;
  updatedAt: string;
};

async function assertStaff(context: { supabase: { rpc: Function }; userId: string }) {
  const { data, error } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
  if (error || !data) throw new Error("Forbidden: staff access only.");
}

export const getStaffStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    return { isStaff: Boolean(data) };
  });

export const listOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StaffOrder[]> => {
    await assertStaff(context);
    const { data, error } = await context.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      id: row.id,
      number: row.number,
      type: row.type as PublicOrder["type"],
      customerName: row.customer_name,
      phone: row.phone,
      tableNumber: row.table_number,
      address: row.address,
      notes: row.notes,
      items: row.items as unknown as CartLine[],
      subtotal: Number(row.subtotal),
      deliveryFee: Number(row.delivery_fee),
      total: Number(row.total),
      paymentMethod: row.payment_method as PublicOrder["paymentMethod"],
      paymentStatus: row.payment_status,
      status: row.status as OrderStatus,
      createdAt: row.created_at,
      acceptedAt: row.accepted_at,
      updatedAt: row.updated_at,
    }));
  });

export const acceptOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ orderId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await context.supabase
      .from("orders")
      .update({
        accepted_at: new Date().toISOString(),
        accepted_by: context.userId,
        status: "preparing",
      })
      .eq("id", data.orderId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        status: z.enum(["received", "preparing", "ready", "served", "cancelled"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.orderId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const markOrderPaidOnArrival = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ orderId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await context.supabase
      .from("orders")
      .update({ payment_status: "paid" })
      .eq("id", data.orderId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
