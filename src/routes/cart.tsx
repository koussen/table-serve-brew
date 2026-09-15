import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { CartLineRow } from "@/components/CartItem";
import { OrderSetup } from "@/components/OrderSetup";
import { useOrder, orderTypeCopy } from "@/lib/order-store";
import { peso } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Order — Kape & Klase" },
      {
        name: "description",
        content: "Review your Kape & Klase order, adjust quantities and continue to payment.",
      },
      { property: "og:title", content: "Your Order — Kape & Klase" },
      {
        property: "og:description",
        content: "Review your order, adjust quantities and continue to payment.",
      },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotal, deliveryFee, total, details } = useOrder();

  return (
    <SiteLayout>
      <section className="pt-10 pb-8">
        <p className="eyebrow">{orderTypeCopy[details.type].label}</p>
        <h1 className="mt-3 text-3xl font-semibold text-balance sm:text-4xl">Your order</h1>
      </section>

      {lines.length === 0 ? (
        <div className="rounded-[min(1.4vw,16px)] bg-paper p-10 text-center ring-1 ring-foreground/5">
          <p className="text-sm text-foreground/60">Your order is empty.</p>
          <Link
            to="/menu"
            className="mt-5 inline-block rounded-[min(1vw,10px)] bg-espresso px-6 py-3 text-sm font-medium text-paper"
          >
            Browse the menu
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 pb-16 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <ul className="divide-y divide-foreground/10 rounded-[min(1.4vw,16px)] bg-paper px-5 ring-1 ring-foreground/5">
              {lines.map((line) => (
                <CartLineRow key={line.lineId} line={line} />
              ))}
            </ul>

            <div className="mt-6 glass rounded-[min(1.4vw,16px)] p-6 ring-1 ring-white/40">
              <p className="eyebrow mb-4">Serving details</p>
              <OrderSetup />
            </div>
          </div>

          <aside className="soft rounded-[min(1.4vw,16px)] p-6 ring-1 ring-white/40 lg:col-span-5 lg:sticky lg:top-28">
            <div className="flex items-center justify-between text-sm text-foreground/60">
              <span>Subtotal</span>
              <span className="text-foreground">{peso(subtotal)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="mt-2 flex items-center justify-between text-sm text-foreground/60">
                <span>Delivery fee</span>
                <span className="text-foreground">{peso(deliveryFee)}</span>
              </div>
            )}
            <div className="mt-4 flex items-baseline justify-between border-t border-foreground/10 pt-4">
              <span className="font-serif text-lg font-medium">Total</span>
              <span className="font-serif text-lg font-semibold text-clay">{peso(total)}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-5 block rounded-[min(1vw,10px)] bg-espresso py-3 text-center text-sm font-medium text-paper transition-colors hover:bg-espresso/90"
            >
              Proceed to payment
            </Link>
            <Link
              to="/menu"
              className="mt-2 block py-2 text-center text-sm text-foreground/60 transition-colors hover:text-foreground"
            >
              Add more items
            </Link>
          </aside>
        </div>
      )}
    </SiteLayout>
  );
}
