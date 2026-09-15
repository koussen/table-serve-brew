import { orderStatusFlow } from "@/lib/order-store";
import type { OrderStatus } from "@/lib/types";
import { CheckIcon } from "./Icons";

const labels: Record<OrderStatus, string> = {
  received: "Received",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
};

export function OrderStatusTrack({ status }: { status: OrderStatus }) {
  const index = orderStatusFlow.indexOf(status);

  return (
    <ol className="grid gap-2 sm:grid-cols-4">
      {orderStatusFlow.map((s, i) => {
        const done = i <= index;
        return (
          <li
            key={s}
            className={`rounded-[min(1vw,12px)] px-4 py-3 ring-1 transition-colors ${
              done ? "bg-espresso text-paper ring-espresso" : "bg-paper ring-foreground/10"
            }`}
          >
            <span className="flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
              {done ? (
                <CheckIcon className="h-3.5 w-3.5" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
              )}
              {labels[s]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
