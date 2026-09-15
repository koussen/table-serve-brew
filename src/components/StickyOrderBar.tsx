import { useOrder } from "@/lib/order-store";
import { peso } from "@/lib/format";
import { BagIcon } from "./Icons";

export function StickyOrderBar() {
  const { itemCount, total, setCartOpen, cartOpen } = useOrder();
  if (itemCount === 0 || cartOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 md:hidden">
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="flex w-full items-center justify-between rounded-[min(2vw,14px)] bg-espresso px-5 py-4 text-paper shadow-lg"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <BagIcon className="h-5 w-5" />
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        <span className="text-sm font-semibold">View order · {peso(total)}</span>
      </button>
    </div>
  );
}
