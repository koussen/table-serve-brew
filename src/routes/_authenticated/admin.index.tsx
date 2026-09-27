import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  listOrders,
  acceptOrder,
  setOrderStatus,
  markOrderPaidOnArrival,
  type StaffOrder,
} from "@/lib/orders.functions";
import { orderStatusFlow, orderTypeCopy } from "@/lib/order-store";
import { peso } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import type { OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: OrdersBoard,
});

const statusLabel: Record<string, string> = {
  received: "Received",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  cancelled: "Cancelled",
};

const paymentLabel: Record<string, string> = {
  pending: "Awaiting payment",
  paid: "Paid",
  pay_on_arrival: "Pay at café",
  failed: "Payment failed",
};

function OrdersBoard() {
  const queryClient = useQueryClient();
  const fetchOrders = useServerFn(listOrders);
  const accept = useServerFn(acceptOrder);
  const setStatus = useServerFn(setOrderStatus);
  const markPaid = useServerFn(markOrderPaidOnArrival);
  const [filter, setFilter] = useState<"active" | "all">("active");

  const { data: orders = [], isPending } = useQuery({
    queryKey: ["staff-orders"],
    queryFn: () => fetchOrders({ data: undefined }),
    refetchInterval: 20000,
  });

  // Live updates straight from the database when a new order lands.
  useEffect(() => {
    const channel = supabase
      .channel("orders-board")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        queryClient.invalidateQueries({ queryKey: ["staff-orders"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["staff-orders"] });

  const run = async (fn: () => Promise<unknown>, message: string) => {
    try {
      await fn();
      refresh();
      toast.success(message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "That didn't work.");
    }
  };

  const visible =
    filter === "active"
      ? orders.filter((o) => o.status !== "served" && o.status !== "cancelled")
      : orders;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Live counter</p>
          <h1 className="mt-2 text-2xl font-semibold">Incoming orders</h1>
        </div>
        <div className="flex gap-2 text-sm">
          {(["active", "all"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-[min(1vw,10px)] px-4 py-2 ring-1 transition-colors ${
                filter === f
                  ? "bg-espresso text-paper ring-espresso"
                  : "ring-foreground/15 hover:bg-foreground/5"
              }`}
            >
              {f === "active" ? "Active" : "All orders"}
            </button>
          ))}
        </div>
      </div>

      {isPending ? (
        <p className="py-16 text-center text-sm text-foreground/50">Loading orders…</p>
      ) : visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-foreground/50">
          No {filter === "active" ? "active " : ""}orders right now.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {visible.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={() =>
                run(() => accept({ data: { orderId: order.id } }), `Order #${order.number} accepted`)
              }
              onStatus={(status) =>
                run(
                  () => setStatus({ data: { orderId: order.id, status } }),
                  `Order #${order.number} · ${statusLabel[status]}`,
                )
              }
              onMarkPaid={() =>
                run(() => markPaid({ data: { orderId: order.id } }), "Marked as paid")
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onAccept,
  onStatus,
  onMarkPaid,
}: {
  order: StaffOrder;
  onAccept: () => void;
  onStatus: (status: OrderStatus | "cancelled") => void;
  onMarkPaid: () => void;
}) {
  const placed = new Date(order.createdAt).toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <li className="rounded-[min(1.4vw,16px)] bg-paper p-5 ring-1 ring-foreground/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-lg font-semibold">#{order.number}</p>
          <p className="text-xs uppercase tracking-[0.15em] text-foreground/50">
            {orderTypeCopy[order.type].label}
            {order.type === "dineIn" && order.tableNumber ? ` · Table ${order.tableNumber}` : ""}
            {" · "}
            {placed}
          </p>
        </div>
        <span className="rounded-[min(1vw,10px)] bg-espresso px-3 py-1 text-xs text-paper">
          {statusLabel[order.status] ?? order.status}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium">{order.customerName}</p>
      {order.phone && <p className="text-xs text-foreground/55">{order.phone}</p>}
      {order.type === "delivery" && (
        <p className="text-xs text-foreground/55">{order.address}</p>
      )}

      <ul className="mt-3 space-y-1 text-sm">
        {order.items.map((l) => (
          <li key={l.lineId} className="flex justify-between gap-3">
            <span>
              {l.quantity} × {l.name}
              {(l.sizeLabel || l.options.length > 0) && (
                <span className="block text-xs text-foreground/45">
                  {[l.sizeLabel, ...l.options.map((o) => o.choiceLabel)]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              )}
            </span>
            <span className="shrink-0 text-foreground/70">{peso(l.subtotal)}</span>
          </li>
        ))}
      </ul>

      {order.notes && (
        <p className="mt-3 rounded-[min(1vw,10px)] bg-foreground/5 px-3 py-2 text-xs">
          Note: {order.notes}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-foreground/10 pt-3 text-sm">
        <span className="text-foreground/55">
          {paymentLabel[order.paymentStatus] ?? order.paymentStatus} ·{" "}
          {order.paymentMethod === "gcash"
            ? "GCash"
            : order.paymentMethod === "card"
              ? "Card"
              : "Cash"}
        </span>
        <span className="font-serif text-base font-semibold text-clay">{peso(order.total)}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!order.acceptedAt && order.status === "received" && (
          <button
            type="button"
            onClick={onAccept}
            className="rounded-[min(1vw,10px)] bg-clay px-4 py-2 text-xs font-medium text-paper"
          >
            Accept order
          </button>
        )}
        {orderStatusFlow.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onStatus(s)}
            disabled={order.status === s}
            className="rounded-[min(1vw,10px)] px-3 py-2 text-xs ring-1 ring-foreground/15 transition-colors hover:bg-foreground/5 disabled:opacity-40"
          >
            {statusLabel[s]}
          </button>
        ))}
        {order.paymentStatus === "pay_on_arrival" && (
          <button
            type="button"
            onClick={onMarkPaid}
            className="rounded-[min(1vw,10px)] px-3 py-2 text-xs ring-1 ring-foreground/15 hover:bg-foreground/5"
          >
            Mark paid
          </button>
        )}
        {order.status !== "cancelled" && (
          <button
            type="button"
            onClick={() => onStatus("cancelled")}
            className="rounded-[min(1vw,10px)] px-3 py-2 text-xs text-clay ring-1 ring-clay/30 hover:bg-clay/10"
          >
            Cancel
          </button>
        )}
      </div>
    </li>
  );
}
