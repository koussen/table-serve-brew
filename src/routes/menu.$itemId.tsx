import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { MenuCard } from "@/components/MenuCard";
import { getMenuItem, menu } from "@/data/menu";
import { peso } from "@/lib/format";
import { useOrder } from "@/lib/order-store";
import type { SelectedOption } from "@/lib/types";
import { ArrowRightIcon } from "@/components/Icons";

export const Route = createFileRoute("/menu/$itemId")({
  loader: ({ params }) => {
    const item = getMenuItem(params.itemId);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Item unavailable — Kape & Klase" }, { name: "robots", content: "noindex" }],
      };
    }
    const { item } = loaderData;
    const title = `${item.name} — ${peso(item.price)} | Kape & Klase`;
    return {
      meta: [
        { title },
        { name: "description", content: item.description },
        { property: "og:title", content: title },
        { property: "og:description", content: item.description },
      ],
    };
  },
  component: ItemPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="py-24 text-center">
        <h1 className="font-serif text-2xl font-semibold">We can't find that item.</h1>
        <Link to="/menu" className="mt-4 inline-block text-sm font-medium text-clay">
          Back to the menu
        </Link>
      </div>
    </SiteLayout>
  ),
});

function ItemPage() {
  const { item } = Route.useLoaderData();
  const { addLine, setCartOpen } = useOrder();

  const [sizeId, setSizeId] = useState(item.sizes?.[0]?.id ?? "");
  const [selected, setSelected] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    item.options?.forEach((g) => {
      initial[g.id] = g.type === "single" && g.choices[0] ? [g.choices[0].id] : [];
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(1);

  const size = item.sizes?.find((s) => s.id === sizeId);
  const chosen: SelectedOption[] = (item.options ?? []).flatMap((g) =>
    (selected[g.id] ?? []).flatMap((choiceId) => {
      const choice = g.choices.find((c) => c.id === choiceId);
      return choice
        ? [
            {
              groupId: g.id,
              groupLabel: g.label,
              choiceId: choice.id,
              choiceLabel: choice.label,
              priceDelta: choice.priceDelta,
            },
          ]
        : [];
    }),
  );

  const unitPrice =
    item.price + (size?.priceDelta ?? 0) + chosen.reduce((sum, o) => sum + o.priceDelta, 0);

  const toggle = (groupId: string, type: "single" | "multi", choiceId: string) => {
    setSelected((prev) => {
      const current = prev[groupId] ?? [];
      if (type === "single") return { ...prev, [groupId]: [choiceId] };
      return {
        ...prev,
        [groupId]: current.includes(choiceId)
          ? current.filter((c) => c !== choiceId)
          : [...current, choiceId],
      };
    });
  };

  const add = () => {
    addLine({
      itemId: item.id,
      name: item.name,
      image: item.image,
      quantity,
      ...(size ? { sizeId: size.id, sizeLabel: size.label } : {}),
      options: chosen,
      unitPrice,
    });
    toast.success(`${quantity} × ${item.name} added to your order`, {
      action: { label: "View order", onClick: () => setCartOpen(true) },
    });
  };

  const related = menu.filter((m) => m.category === item.category && m.id !== item.id).slice(0, 4);

  return (
    <SiteLayout>
      <nav className="pt-8 text-sm text-foreground/50">
        <Link to="/menu" className="transition-colors hover:text-foreground">
          Menu
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground/70">{item.name}</span>
      </nav>

      <section className="grid gap-8 py-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-6">
          <img
            src={item.image}
            alt={item.name}
            width={816}
            height={816}
            className="aspect-square w-full rounded-[min(1.4vw,16px)] object-cover"
          />
        </div>

        <div className="lg:col-span-6">
          <p className="eyebrow">{item.category === "riceBowls" ? "Rice bowl" : "From the menu"}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {item.name}
          </h1>
          <p className="mt-3 max-w-[48ch] text-[15px] text-pretty text-foreground/70">
            {item.description}
          </p>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.15em] text-foreground/45">Ingredients</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {item.ingredients.map((ing) => (
                <li
                  key={ing}
                  className="rounded-[min(1vw,8px)] bg-paper px-3 py-1.5 text-xs text-foreground/70 ring-1 ring-foreground/10"
                >
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {item.sizes && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.15em] text-foreground/45">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSizeId(s.id)}
                    className={`rounded-[min(1vw,10px)] px-4 py-2.5 text-sm transition-colors ring-1 ${
                      sizeId === s.id
                        ? "bg-espresso text-paper ring-espresso"
                        : "bg-paper ring-foreground/10 hover:bg-foreground/5"
                    }`}
                  >
                    {s.label}
                    {s.priceDelta > 0 && (
                      <span className="ml-1.5 opacity-70">+{peso(s.priceDelta)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.options?.map((g) => (
            <div key={g.id} className="mt-6">
              <p className="text-xs uppercase tracking-[0.15em] text-foreground/45">{g.label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {g.choices.map((c) => {
                  const on = (selected[g.id] ?? []).includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggle(g.id, g.type, c.id)}
                      className={`rounded-[min(1vw,10px)] px-4 py-2.5 text-sm transition-colors ring-1 ${
                        on
                          ? "bg-espresso text-paper ring-espresso"
                          : "bg-paper ring-foreground/10 hover:bg-foreground/5"
                      }`}
                    >
                      {c.label}
                      {c.priceDelta > 0 && (
                        <span className="ml-1.5 opacity-70">+{peso(c.priceDelta)}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-[min(1vw,10px)] bg-paper ring-1 ring-foreground/10">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="grid h-12 w-12 place-items-center text-foreground/70 transition-colors hover:bg-foreground/5"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="grid h-12 w-12 place-items-center text-foreground/70 transition-colors hover:bg-foreground/5"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={add}
              className="flex-1 rounded-[min(1vw,10px)] bg-clay px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-clay/90 sm:flex-none"
            >
              Add to order · {peso(unitPrice * quantity)}
            </button>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Goes well with</h2>
            <Link
              to="/menu"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-clay"
            >
              Full menu
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((r) => (
              <MenuCard key={r.id} item={r} />
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
