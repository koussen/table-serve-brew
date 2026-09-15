import type { CartLine } from "@/lib/types";
import { peso } from "@/lib/format";
import { useOrder } from "@/lib/order-store";

export function CartLineRow({ line }: { line: CartLine }) {
  const { setQuantity, removeLine } = useOrder();
  const detail = [line.sizeLabel, ...line.options.map((o) => o.choiceLabel)]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="flex gap-3 py-4">
      <img
        src={line.image}
        alt={line.name}
        loading="lazy"
        width={816}
        height={816}
        className="h-16 w-16 shrink-0 rounded-[min(1vw,10px)] object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-sm font-medium">{line.name}</p>
          <span className="shrink-0 text-sm font-medium">{peso(line.subtotal)}</span>
        </div>
        {detail && <p className="mt-0.5 text-xs text-foreground/50">{detail}</p>}
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center rounded-[min(1vw,10px)] ring-1 ring-foreground/10">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity(line.lineId, line.quantity - 1)}
              className="grid h-9 w-9 place-items-center text-foreground/70 transition-colors hover:bg-foreground/5"
            >
              −
            </button>
            <span className="w-7 text-center text-sm">{line.quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity(line.lineId, line.quantity + 1)}
              className="grid h-9 w-9 place-items-center text-foreground/70 transition-colors hover:bg-foreground/5"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeLine(line.lineId)}
            className="text-xs text-foreground/45 underline-offset-4 transition-colors hover:text-clay hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
