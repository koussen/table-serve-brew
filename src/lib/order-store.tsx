import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, OrderDetails, OrderStatus } from "./types";
import { shop } from "./shop";

const CART_KEY = "kk.cart";
const DETAILS_KEY = "kk.details";

const emptyDetails: OrderDetails = {
  type: "dineIn",
  customerName: "",
  tableNumber: "",
  phone: "",
  address: "",
  notes: "",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — the cart continues in memory */
  }
}

type Ctx = {
  hydrated: boolean;
  lines: CartLine[];
  details: OrderDetails;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addLine: (line: Omit<CartLine, "lineId" | "subtotal">) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  updateDetails: (patch: Partial<OrderDetails>) => void;
};

const OrderContext = createContext<Ctx | null>(null);

const statusFlow: OrderStatus[] = ["received", "preparing", "ready", "served"];

export function OrderProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [details, setDetails] = useState<OrderDetails>(emptyDetails);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setLines(read<CartLine[]>(CART_KEY, []));
    setDetails(read<OrderDetails>(DETAILS_KEY, emptyDetails));

    // QR table ordering: /any-route?table=12 pre-fills the table number.
    const table = new URLSearchParams(window.location.search).get("table");
    if (table) {
      setDetails((prev) => ({ ...prev, type: "dineIn", tableNumber: table }));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) write(CART_KEY, lines);
  }, [lines, hydrated]);
  useEffect(() => {
    if (hydrated) write(DETAILS_KEY, details);
  }, [details, hydrated]);

  const addLine = useCallback((line: Omit<CartLine, "lineId" | "subtotal">) => {
    setLines((prev) => {
      const signature = `${line.itemId}|${line.sizeId ?? ""}|${line.options
        .map((o) => o.choiceId)
        .sort()
        .join(",")}`;
      const existing = prev.find(
        (l) =>
          `${l.itemId}|${l.sizeId ?? ""}|${l.options
            .map((o) => o.choiceId)
            .sort()
            .join(",")}` === signature,
      );
      if (existing) {
        return prev.map((l) =>
          l.lineId === existing.lineId
            ? {
                ...l,
                quantity: l.quantity + line.quantity,
                subtotal: (l.quantity + line.quantity) * l.unitPrice,
              }
            : l,
        );
      }
      return [
        ...prev,
        {
          ...line,
          lineId: `${line.itemId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          subtotal: line.unitPrice * line.quantity,
        },
      ];
    });
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.lineId !== lineId)
        : prev.map((l) =>
            l.lineId === lineId
              ? { ...l, quantity, subtotal: quantity * l.unitPrice }
              : l,
          ),
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const updateDetails = useCallback((patch: Partial<OrderDetails>) => {
    setDetails((prev) => ({ ...prev, ...patch }));
  }, []);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.subtotal, 0),
    [lines],
  );
  const deliveryFee = details.type === "delivery" && lines.length > 0 ? shop.deliveryFee : 0;
  const total = subtotal + deliveryFee;
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  const value: Ctx = {
    hydrated,
    lines,
    details,
    itemCount,
    subtotal,
    deliveryFee,
    total,
    cartOpen,
    setCartOpen,
    addLine,
    setQuantity,
    removeLine,
    clearCart,
    updateDetails,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
}

export const orderStatusFlow = statusFlow;

export const orderTypeCopy: Record<
  OrderDetails["type"],
  { label: string; blurb: string }
> = {
  dineIn: {
    label: "Dine in",
    blurb: "Order from your table and we'll serve it to you.",
  },
  takeout: {
    label: "Takeout",
    blurb: "Order ahead and pick it up at the café.",
  },
  delivery: {
    label: "Delivery",
    blurb: "Have your order delivered to your location.",
  },
};
