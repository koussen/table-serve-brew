import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { MenuCard } from "@/components/MenuCard";
import { OrderSetup } from "@/components/OrderSetup";
import { featuredItems } from "@/data/menu";
import { shop } from "@/lib/shop";
import { peso } from "@/lib/format";
import { useOrder } from "@/lib/order-store";
import { ArrowRightIcon } from "@/components/Icons";

import heroLatte from "@/assets/hero-latte.jpg";
import croissants from "@/assets/croissants.jpg";
import espressoPour from "@/assets/espresso-pour.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kape & Klase — Specialty Coffee in Batangas City" },
      {
        name: "description",
        content:
          "Small-batch coffee, pastries and rice bowls in Batangas City. Order from your table and we'll serve it to your seat.",
      },
      { property: "og:title", content: "Kape & Klase — Specialty Coffee in Batangas City" },
      {
        property: "og:description",
        content:
          "Small-batch coffee, pastries and rice bowls in Batangas City. Order from your table and we'll serve it to your seat.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { lines, subtotal, total, details } = useOrder();

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="pt-10 pb-14 sm:pt-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <p className="eyebrow mb-4">Independent roastery · Est. 2019</p>
            <h1 className="max-w-[20ch] text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-balance sm:text-6xl">
              Good coffee, slow mornings, made for your table.
            </h1>
            <p className="mt-5 max-w-[46ch] text-[15px] text-pretty text-foreground/70">
              Small-batch beans from Batangas, roasted in-house each week. Order from your seat
              and we bring it straight to you.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/menu"
                className="rounded-[min(1vw,10px)] bg-clay px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-clay/90"
              >
                Order Now
              </Link>
              <Link
                to="/menu"
                className="rounded-[min(1vw,10px)] px-5 py-3 text-sm font-medium text-foreground/80 ring-1 ring-foreground/15 transition-colors hover:bg-foreground/5"
              >
                View Menu
              </Link>
            </div>
            <div className="mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[min(1vw,10px)] bg-espresso px-4 py-3 text-paper">
              <span className="text-sm font-medium">Skip the cashier.</span>
              <span className="text-sm text-paper/60">Order from your table.</span>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="grid grid-cols-3 gap-3">
              <img
                src={heroLatte}
                alt="Latte with hand-poured art on a wooden café table"
                width={768}
                height={1024}
                className="col-span-2 row-span-2 aspect-4/5 w-full rounded-[min(1vw,12px)] object-cover"
              />
              <img
                src={croissants}
                alt="Freshly baked butter croissants on a ceramic plate"
                loading="lazy"
                width={816}
                height={816}
                className="aspect-square w-full rounded-[min(1vw,12px)] object-cover"
              />
              <img
                src={espressoPour}
                alt="Barista pulling an espresso shot into a glass"
                loading="lazy"
                width={816}
                height={816}
                className="aspect-square w-full rounded-[min(1vw,12px)] object-cover"
              />
            </div>
            <div className="soft -mt-6 ml-auto w-[85%] rounded-[min(1vw,12px)] p-4 ring-1 ring-white/40 sm:w-[60%]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.15em] text-foreground/50">
                    Popular this week
                  </p>
                  <p className="truncate font-serif text-lg font-medium">Spanish Latte</p>
                </div>
                <span className="shrink-0 text-base font-semibold text-clay">{peso(150)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            On the counter
          </h2>
          <Link
            to="/menu"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-clay transition-colors hover:text-clay/70"
          >
            View full menu
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featuredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* DINE-IN */}
      <section className="pb-16">
        <div className="glass rounded-[min(1.4vw,20px)] p-6 ring-1 ring-white/40 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow mb-3">Order from your table</p>
              <h2 className="max-w-[20ch] text-2xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-4xl">
                Where should we serve your order?
              </h2>
              <p className="mt-4 max-w-[44ch] text-[15px] text-pretty text-foreground/70">
                Enter your details and we'll bring it to your seat. No lines, no waiting at the
                counter.
              </p>
              <div className="mt-6">
                <OrderSetup />
              </div>
              <Link
                to="/menu"
                className="mt-5 inline-block rounded-[min(1vw,10px)] bg-clay px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-clay/90"
              >
                Browse the menu
              </Link>
            </div>

            <div className="soft rounded-[min(1vw,14px)] p-5 ring-1 ring-white/40">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-foreground/10 pb-3">
                <span className="text-xs uppercase tracking-[0.15em] text-foreground/50">
                  {details.type === "dineIn" && details.tableNumber
                    ? `Table ${details.tableNumber}`
                    : "Your order"}
                  {details.customerName ? ` · ${details.customerName}` : ""}
                </span>
                <span className="text-xs text-foreground/40">
                  {lines.length} {lines.length === 1 ? "item" : "items"}
                </span>
              </div>

              {lines.length === 0 ? (
                <p className="py-8 text-center text-sm text-foreground/50">
                  Your order appears here as you add items.
                </p>
              ) : (
                <ul className="divide-y divide-foreground/10 py-1 text-sm">
                  {lines.map((l) => (
                    <li key={l.lineId} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="min-w-0 truncate">
                        {l.quantity} × {l.name}
                        {l.sizeLabel && (
                          <span className="text-foreground/40"> ({l.sizeLabel})</span>
                        )}
                      </span>
                      <span className="shrink-0 font-medium">{peso(l.subtotal)}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center justify-between border-t border-foreground/10 pt-3 text-sm">
                <span className="text-foreground/60">Subtotal</span>
                <span>{peso(subtotal)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-serif text-lg font-medium">Total</span>
                <span className="font-serif text-lg font-semibold text-clay">{peso(total)}</span>
              </div>
              <Link
                to="/checkout"
                className="mt-4 block rounded-[min(1vw,10px)] bg-espresso py-3 text-center text-sm font-medium text-paper transition-colors hover:bg-espresso/90"
              >
                Proceed to payment
              </Link>
              <p className="mt-2 text-center text-[11px] text-foreground/40">
                GCash · Card · Cash
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="pb-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow">Our story</p>
            <h2 className="mt-3 max-w-[18ch] text-2xl font-semibold text-balance sm:text-3xl">
              A corner shop built around one roast a week.
            </h2>
            <p className="mt-4 max-w-[46ch] text-[15px] text-pretty text-foreground/70">
              {shop.name} began as a two-table space on Rizal Avenue. We buy green beans from
              farms in Lipa and Amadeo, roast every Tuesday, and serve until the batch runs out.
            </p>
            <Link
              to="/about"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-clay transition-colors hover:text-clay/70"
            >
              Read our story
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="lg:col-span-7">
            <img
              src={espressoPour}
              alt="Espresso being pulled at the café counter"
              loading="lazy"
              width={816}
              height={816}
              className="aspect-16/9 w-full rounded-[min(1.4vw,16px)] object-cover"
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
