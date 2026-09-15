import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { OrderSetup } from "@/components/OrderSetup";
import { useOrder, orderTypeCopy } from "@/lib/order-store";
import { peso } from "@/lib/format";
import type { PaymentMethod } from "@/lib/types";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Kape & Klase" },
      {
        name: "description",
        content:
          "Confirm your serving details and choose GCash, card or cash. Demo checkout — no real payment is processed.",
      },
      { property: "og:title", content: "Checkout — Kape & Klase" },
      {
        property: "og:description",
        content: "Confirm your serving details and choose GCash, card or cash.",
      },
    ],
  }),
  component: CheckoutPage,
});

const methods: { id: PaymentMethod; label: string; note: string }[] = [
  { id: "gcash", label: "GCash", note: "Most used at the café" },
  { id: "card", label: "Card", note: "Visa, Mastercard" },
  { id: "cash", label: "Cash", note: "Pay the staff on arrival" },
];

export function validateOrder(details: {
  type: string;
  customerName: string;
  tableNumber: string;
  phone: string;
  address: string;
}) {
  if (!details.customerName.trim()) return "Please enter your name.";
  if (details.type === "dineIn" && !details.tableNumber.trim())
    return "Please enter your table number.";
  if (details.type !== "dineIn" && details.phone.trim().length < 7)
    return "Please enter a valid phone number.";
  if (details.type === "delivery" && details.address.trim().length < 8)
    return "Please enter your full delivery address.";
  return null;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, subtotal, deliveryFee, total, details, placeOrder } = useOrder();
  const [method, setMethod] = useState<PaymentMethod>("gcash");
  const [processing, setProcessing] = useState(false);

  const pay = () => {
    const error = validateOrder(details);
    if (error) {
      toast.error(error);
      return;
    }
    if (lines.length === 0) {
      toast.error("Your order is empty.");
      return;
    }
    setProcessing(true);
    // Demo only: this simulates the provider round-trip. Swap this block for a
    // real payment intent call (GCash/Stripe/Paddle) without touching the UI.
    window.setTimeout(() => {
      const order = placeOrder(method);
      setProcessing(false);
      navigate({ to: "/order/$orderId", params: { orderId: order.id } });
    }, 900);
  };

  return (
    <SiteLayout>
      <section className="pt-10 pb-8">
        <p className="eyebrow">Step 3 of 3</p>
        <h1 className="mt-3 text-3xl font-semibold text-balance sm:text-4xl">
          Review and pay
        </h1>
      </section>

      {lines.length === 0 ? (
        <div className="rounded-[min(1.4vw,16px)] bg-paper p-10 text-center ring-1 ring-foreground/5">
          <p className="text-sm text-foreground/60">There's nothing to pay for yet.</p>
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
            <div className="glass rounded-[min(1.4vw,16px)] p-6 ring-1 ring-white/40">
              <p className="eyebrow mb-4">Serving details</p>
              <OrderSetup />
            </div>

            <div className="mt-6 rounded-[min(1.4vw,16px)] bg-paper p-6 ring-1 ring-foreground/5">
              <p className="eyebrow mb-4">Payment method</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`rounded-[min(1vw,12px)] p-4 text-left ring-1 transition-colors ${
                      method === m.id
                        ? "bg-espresso text-paper ring-espresso"
                        : "ring-foreground/10 hover:bg-foreground/5"
                    }`}
                  >
                    <span className="block text-sm font-medium">{m.label}</span>
                    <span
                      className={`mt-1 block text-xs ${
                        method === m.id ? "text-paper/65" : "text-foreground/50"
                      }`}
                    >
                      {m.note}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-foreground/50">
                Demonstration checkout. No payment provider is connected, so nothing is charged
                and no card or GCash details are collected.
              </p>
            </div>
          </div>

          <aside className="soft rounded-[min(1.4vw,16px)] p-6 ring-1 ring-white/40 lg:col-span-5 lg:sticky lg:top-28">
            <p className="text-xs uppercase tracking-[0.15em] text-foreground/50">
              {orderTypeCopy[details.type].label}
              {details.type === "dineIn" && details.tableNumber
                ? ` · Table ${details.tableNumber}`
                : ""}
            </p>
            <ul className="mt-3 divide-y divide-foreground/10 text-sm">
              {lines.map((l) => (
                <li key={l.lineId} className="flex items-start justify-between gap-3 py-2.5">
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
              <span className="text-foreground">{peso(subtotal)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="mt-1 flex items-center justify-between text-sm text-foreground/60">
                <span>Delivery fee</span>
                <span className="text-foreground">{peso(deliveryFee)}</span>
              </div>
            )}
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-serif text-lg font-medium">Total</span>
              <span className="font-serif text-lg font-semibold text-clay">{peso(total)}</span>
            </div>
            <button
              type="button"
              onClick={pay}
              disabled={processing}
              className="mt-5 w-full rounded-[min(1vw,10px)] bg-clay py-3.5 text-sm font-medium text-paper transition-colors hover:bg-clay/90 disabled:opacity-70"
            >
              {processing
                ? "Confirming…"
                : `Place order · ${methods.find((m) => m.id === method)?.label}`}
            </button>
          </aside>
        </div>
      )}
    </SiteLayout>
  );
}
