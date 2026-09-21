import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

function verifySignature(payload: string, header: string, secret: string) {
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k ?? "", v ?? ""];
    }),
  ) as { t?: string; v1?: string };

  if (!parts.t || !parts.v1) return false;

  const expected = createHmac("sha256", secret)
    .update(`${parts.t}.${payload}`)
    .digest("hex");
  const a = Buffer.from(parts.v1);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/webhooks/stripe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_WEBHOOK_SECRET"];
        if (!secret) return new Response("Not configured", { status: 500 });

        const signature = request.headers.get("stripe-signature") ?? "";
        const payload = await request.text();

        if (!verifySignature(payload, signature, secret)) {
          return new Response("Invalid signature", { status: 401 });
        }

        const event = JSON.parse(payload) as {
          type: string;
          data: { object: { id?: string; metadata?: { order_id?: string } } };
        };

        const orderId = event.data.object?.metadata?.order_id;
        if (!orderId) return new Response("ok");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (event.type === "checkout.session.completed") {
          await supabaseAdmin
            .from("orders")
            .update({ payment_status: "paid" })
            .eq("id", orderId);
        } else if (
          event.type === "checkout.session.expired" ||
          event.type === "checkout.session.async_payment_failed"
        ) {
          await supabaseAdmin
            .from("orders")
            .update({ payment_status: "failed", status: "cancelled" })
            .eq("id", orderId);
        }

        return new Response("ok");
      },
    },
  },
});
