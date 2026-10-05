import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useOrder } from "@/lib/order-store";
import { peso } from "@/lib/format";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryTabs } from "@/components/CategoryTabs";
import { MenuCard } from "@/components/MenuCard";
import { OrderSetup } from "@/components/OrderSetup";
import { menu } from "@/data/menu";
import { categories } from "@/lib/shop";
import type { CategoryId } from "@/lib/types";

export const Route = createFileRoute("/menu/")({
  head: () => ({
    meta: [
      { title: "Menu — Coffee, Pastries & Rice Bowls | Kape & Klase" },
      {
        name: "description",
        content:
          "Browse the full Kape & Klase menu: espresso drinks, non-coffee, day-baked pastries and rice bowls, with prices in pesos.",
      },
      { property: "og:title", content: "Menu — Kape & Klase, Batangas City" },
      {
        property: "og:description",
        content:
          "Espresso drinks, non-coffee, day-baked pastries and rice bowls. Order for dine-in, takeout or delivery.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [active, setActive] = useState<CategoryId>("coffee");
  const { itemCount, total } = useOrder();
  const items = menu.filter((i) => i.category === active);
  const label = categories.find((c) => c.id === active)?.label ?? "";

  return (
    <SiteLayout>
      <section className="pt-10 pb-6">
        <p className="eyebrow">The full list</p>
        <h1 className="mt-3 max-w-[16ch] text-3xl font-semibold text-balance sm:text-5xl">
          Everything we're serving today.
        </h1>
        <p className="mt-4 max-w-[52ch] text-[15px] text-pretty text-foreground/70">
          Prices include all sizes listed on each item. Tap any item for ingredients and
          customisation.
        </p>
      </section>

      <div className="sticky top-20 z-20 -mx-5 bg-cream/80 px-5 py-3 backdrop-blur-sm">
        <CategoryTabs active={active} onChange={setActive} />
      </div>

      <section className="py-6">
        <h2 className="sr-only">{label}</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="pb-16">
        <div className="glass rounded-[min(1.4vw,20px)] p-6 ring-1 ring-white/40 sm:p-8">
          <p className="eyebrow mb-3">Before you order</p>
          <h2 className="max-w-[24ch] text-2xl font-semibold text-balance sm:text-3xl">
            Tell us how you'd like it served.
          </h2>
          <div className="mt-6">
            <OrderSetup />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-5">
            <span className="text-sm text-foreground/70">
              {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
              <span className="font-semibold text-foreground">{peso(total)}</span>
            </span>
            {itemCount > 0 ? (
              <Link
                to="/checkout"
                className="rounded-[min(1vw,10px)] bg-espresso px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-espresso/90"
              >
                Proceed to payment
              </Link>
            ) : (
              <span className="text-sm text-foreground/50">Add items to continue</span>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
