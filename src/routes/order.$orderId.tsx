import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { OrderStatusTrack } from "@/components/OrderStatusTrack";
import { useOrder, orderTypeCopy } from "@/lib/order-store";
import { peso } from "@/lib/format";
import { shop } from "@/lib/shop";

export const Route = createFileRoute("/order/$orderId")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Kape & Klase" },
      {
        name: "description",
        content: "Your Kape & Klase order is confirmed. Track its status from received to served.",
      },
      { property: "og:title", content: "Order Confirmed — Kape & Klase" },
      {
        property: "og:description",
        content: "Your order is confirmed. Track its status from received to served.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

const methodLabel = { gcash: "GCash", card: "Card", cash: "Cash" } as const;

function OrderPage() {
  const { orderId } = Route.useParams();
  const { getOrder, advanceStatus, hydrated } = useOrder();
  const order = getOrder(orderId);

  if (!hydrated) {
    return (
      <SiteLayout>
        <div className="py-24 text-center text-sm text-foreground/50">Loading your order…</div>
      </SiteLayout>
    );
  }

  if (!order) {
    return (
      <SiteLayout>
        <div className="py-24 text-center">
          <h1 className="font-serif text-2xl font-semibold">We can't find that order.</h1>
          <p className="mt-2 text-sm text-foreground/60">
            Demo orders are kept on this device only.
          </p>
          <Link to="/menu" className="mt-5 inline-block text-sm font-medium text-clay">
            Start a new order
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const served = order.status === "served";

  return (
    <SiteLayout>
      <section className="pt-10 pb-8">
        <p className="eyebrow">Order confirmed</p>
        <h1 className="mt-3 text-3xl font-semibold text-balance sm:text-5xl">
          Order #{order.number}
        </h1>
        <p className="mt-4 max-w-[46ch] text-[15px] text-pretty text-foreground/70">
          {order.type === "dineIn"
            ? `Thanks, ${order.customerName}. Your order has been sent to the café and will be served to Table ${order.tableNumber}.`
            : order.type === "takeout"
              ? `Thanks, ${order.customerName}. We'll have your order packed and ready at the counter.`
              : `Thanks, ${order.customerName}. We'll deliver your order to ${order.address}.`}
        </p>
        <p className="mt-2 text-sm text-foreground/55">
          Estimated preparation time: {shop.prepTime}
        </p>
      </section>

      <section className="pb-8">
        <OrderStatusTrack status={order.status} />
        <button
          type="button"
          onClick={() => advanceStatus(order.id)}
          disabled={served}
          className="mt-3 rounded-[min(1vw,10px)] px-4 py-2.5 text-xs font-medium ring-1 ring-foreground/15 transition-colors hover:bg-foreground/5 disabled:opacity-50"
        >
          {served ? "Order served" : "Simulate next status"}
        </button>
      </section>

      <section className="grid gap-6 pb-16 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <div className="rounded-[min(1.4vw,16px)] bg-paper p-6 ring-1 ring-foreground/5">
            <p className="eyebrow mb-4">Items</p>
            <ul className="divide-y divide-foreground/10 text-sm">
              {order.items.map((l) => (
                <li key={l.lineId} className="flex items-start justify-between gap-3 py-3">
                  <span className="min-w-0">
                    {l.quantity} × {l.name}
                    {(l.sizeLabel || l.options.length > 0) && (
                      <span className="block text-xs text-foreground/45">
                        {[l.sizeLabel, ...l.options.map((o) => o.choiceLabel)]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-medium">{peso(l.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-foreground/10 pt-3 text-sm text-foreground/60">
              <span>Subtotal</span>
              <span className="text-foreground">{peso(order.subtotal)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="mt-1 flex items-center justify-between text-sm text-foreground/60">
                <span>Delivery fee</span>
                <span className="text-foreground">{peso(order.deliveryFee)}</span>
              </div>
            )}
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-serif text-lg font-medium">Total</span>
              <span className="font-serif text-lg font-semibold text-clay">
                {peso(order.total)}
              </span>
            </div>
          </div>
        </div>

        <aside className="soft rounded-[min(1.4vw,16px)] p-6 ring-1 ring-white/40 lg:col-span-5">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-foreground/55">Order number</dt>
              <dd className="font-medium">#{order.number}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-foreground/55">Name</dt>
              <dd className="min-w-0 truncate font-medium">{order.customerName}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-foreground/55">Type</dt>
              <dd className="font-medium">{orderTypeCopy[order.type].label}</dd>
            </div>
            {order.type === "dineIn" && (
              <div className="flex justify-between gap-3">
                <dt className="text-foreground/55">Table</dt>
                <dd className="font-medium">Table {order.tableNumber}</dd>
              </div>
            )}
            {order.type !== "dineIn" && order.phone && (
              <div className="flex justify-between gap-3">
                <dt className="text-foreground/55">Phone</dt>
                <dd className="font-medium">{order.phone}</dd>
              </div>
            )}
            {order.type === "delivery" && (
              <div className="flex justify-between gap-3">
                <dt className="shrink-0 text-foreground/55">Address</dt>
                <dd className="text-right font-medium">{order.address}</dd>
              </div>
            )}
            {order.notes && (
              <div className="flex justify-between gap-3">
                <dt className="shrink-0 text-foreground/55">Notes</dt>
                <dd className="text-right font-medium">{order.notes}</dd>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <dt className="text-foreground/55">Payment</dt>
              <dd className="font-medium">{methodLabel[order.paymentMethod]} · demo</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-foreground/55">Placed</dt>
              <dd className="font-medium">
                {new Date(order.createdAt).toLocaleString("en-PH", {
                  hour: "numeric",
                  minute: "2-digit",
                  day: "numeric",
                  month: "short",
                })}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-foreground/45">
            No payment provider is connected to this demo, so no money has changed hands.
          </p>
          <Link
            to="/menu"
            className="mt-5 block rounded-[min(1vw,10px)] bg-espresso py-3 text-center text-sm font-medium text-paper"
          >
            Order something else
          </Link>
        </aside>
      </section>
    </SiteLayout>
  );
}
