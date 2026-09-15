import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { MenuItem } from "@/lib/types";
import { peso } from "@/lib/format";
import { useOrder } from "@/lib/order-store";

export function MenuCard({ item }: { item: MenuItem }) {
  const { addLine, setCartOpen } = useOrder();

  const quickAdd = () => {
    const size = item.sizes?.[0];
    addLine({
      itemId: item.id,
      name: item.name,
      image: item.image,
      quantity: 1,
      ...(size ? { sizeId: size.id, sizeLabel: size.label } : {}),
      options: [],
      unitPrice: item.price + (size?.priceDelta ?? 0),
    });
    toast.success(`${item.name} added to your order`, {
      action: { label: "View order", onClick: () => setCartOpen(true) },
    });
  };

  return (
    <article className="group flex flex-col rounded-[min(1vw,14px)] bg-paper p-3 ring-1 ring-foreground/5 transition-transform duration-300 hover:-translate-y-1">
      <Link
        to="/menu/$itemId"
        params={{ itemId: item.id }}
        className="mb-3 block overflow-hidden rounded-[min(1vw,10px)]"
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          width={816}
          height={816}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </Link>
      <Link to="/menu/$itemId" params={{ itemId: item.id }} className="min-w-0">
        <h3 className="font-serif text-base font-medium">{item.name}</h3>
      </Link>
      <p className="mt-0.5 line-clamp-2 text-xs text-pretty text-foreground/55">
        {item.description}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{peso(item.price)}</span>
        <button
          type="button"
          onClick={quickAdd}
          className="rounded-full bg-foreground/5 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-foreground/10"
        >
          Add
        </button>
      </div>
    </article>
  );
}
