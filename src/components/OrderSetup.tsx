import { orderTypeCopy, useOrder } from "@/lib/order-store";
import type { OrderType } from "@/lib/types";

const types: OrderType[] = ["dineIn", "takeout", "delivery"];

const fieldClass =
  "w-full rounded-[min(1vw,10px)] bg-paper px-4 py-2.5 text-sm ring-1 ring-foreground/10 focus:outline-none focus:ring-2 focus:ring-clay/50";
const labelClass = "mb-1.5 block text-xs font-medium text-foreground/60";

export function OrderSetup() {
  const { details, updateDetails } = useOrder();

  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-3">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => updateDetails({ type: t })}
            className={`rounded-[min(1vw,12px)] p-4 text-left ring-1 transition-colors ${
              details.type === t
                ? "bg-espresso text-paper ring-espresso"
                : "bg-paper ring-foreground/10 hover:bg-foreground/5"
            }`}
          >
            <span className="block text-sm font-medium">{orderTypeCopy[t].label}</span>
            <span
              className={`mt-1 block text-xs ${
                details.type === t ? "text-paper/65" : "text-foreground/50"
              }`}
            >
              {orderTypeCopy[t].blurb}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="customerName">
            {details.type === "delivery" ? "Full name" : "Customer name"}
          </label>
          <input
            id="customerName"
            className={fieldClass}
            value={details.customerName}
            maxLength={60}
            onChange={(e) => updateDetails({ customerName: e.target.value })}
            placeholder="Juan Dela Cruz"
          />
        </div>

        {details.type === "dineIn" && (
          <div>
            <label className={labelClass} htmlFor="tableNumber">
              Table number
            </label>
            <input
              id="tableNumber"
              className={fieldClass}
              value={details.tableNumber}
              maxLength={4}
              inputMode="numeric"
              onChange={(e) =>
                updateDetails({ tableNumber: e.target.value.replace(/\D/g, "") })
              }
              placeholder="12"
            />
          </div>
        )}

        {details.type !== "dineIn" && (
          <div>
            <label className={labelClass} htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              className={fieldClass}
              value={details.phone}
              maxLength={20}
              inputMode="tel"
              onChange={(e) => updateDetails({ phone: e.target.value })}
              placeholder="0917 412 8806"
            />
          </div>
        )}

        {details.type === "delivery" && (
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="address">
              Delivery address
            </label>
            <input
              id="address"
              className={fieldClass}
              value={details.address}
              maxLength={160}
              onChange={(e) => updateDetails({ address: e.target.value })}
              placeholder="Blk 4 Lot 12, Kumintang Ibaba, Batangas City"
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="notes">
            {details.type === "delivery" ? "Delivery instructions (optional)" : "Notes (optional)"}
          </label>
          <input
            id="notes"
            className={fieldClass}
            value={details.notes}
            maxLength={160}
            onChange={(e) => updateDetails({ notes: e.target.value })}
            placeholder={
              details.type === "delivery"
                ? "Gate is on the left, please call on arrival"
                : "Less sugar on the drinks, please"
            }
          />
        </div>
      </div>
    </div>
  );
}
