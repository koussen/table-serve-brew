import { Link } from "@tanstack/react-router";
import { useOrder, orderTypeCopy } from "@/lib/order-store";
import { peso } from "@/lib/format";
import { CloseIcon } from "./Icons";
import { CartLineRow } from "./CartItem";

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, subtotal, deliveryFee, total, details } = useOrder();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close order panel"
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 bg-espresso/30 backdrop-blur-[2px]"
      />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-paper shadow-xl duration-300 animate-in slide-in-from-right">
        <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-serif text-lg font-semibold">Your order</h2>
            <p className="truncate text-xs text-foreground/50">
              {orderTypeCopy[details.type].label}
              {details.type === "dineIn" && details.tableNumber
                ? ` · Table ${details.tableNumber}`
                : ""}
              {details.customerName ? ` · ${details.customerName}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[min(1vw,10px)] text-foreground/60 transition-colors hover:bg-foreground/5"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
              <p className="text-sm text-foreground/55">Nothing here yet.</p>
              <Link
                to="/menu"
                onClick={() => setCartOpen(false)}
                className="rounded-[min(1vw,10px)] bg-espresso px-5 py-2.5 text-sm font-medium text-paper"
              >
                Browse the menu
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-foreground/10">
              {lines.map((line) => (
                <CartLineRow key={line.lineId} line={line} />
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-foreground/10 px-5 py-4">
            <div className="flex items-center justify-between text-sm text-foreground/60">
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
            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              className="mt-4 block rounded-[min(1vw,10px)] bg-espresso py-3 text-center text-sm font-medium text-paper transition-colors hover:bg-espresso/90"
            >
              Review &amp; pay
            </Link>
            <p className="mt-2 text-center text-[11px] text-foreground/40">GCash · Card · Cash</p>
          </div>
        )}
      </aside>
    </div>
  );
}
