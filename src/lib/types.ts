export type CategoryId = "coffee" | "nonCoffee" | "pastries" | "riceBowls";

export type SizeOption = {
  id: string;
  label: string;
  priceDelta: number;
};

export type OptionChoice = {
  id: string;
  label: string;
  priceDelta: number;
};

export type OptionGroup = {
  id: string;
  label: string;
  type: "single" | "multi";
  choices: OptionChoice[];
};

export type MenuItem = {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  ingredients: string[];
  price: number;
  image: string;
  sizes?: SizeOption[];
  options?: OptionGroup[];
  available: boolean;
  featured?: boolean;
};

export type SelectedOption = {
  groupId: string;
  groupLabel: string;
  choiceId: string;
  choiceLabel: string;
  priceDelta: number;
};

export type CartLine = {
  lineId: string;
  itemId: string;
  name: string;
  image: string;
  quantity: number;
  sizeId?: string;
  sizeLabel?: string;
  options: SelectedOption[];
  unitPrice: number;
  subtotal: number;
};

export type OrderType = "dineIn" | "takeout" | "delivery";

export type PaymentMethod = "gcash" | "card" | "cash";

export type OrderStatus = "received" | "preparing" | "ready" | "served" | "cancelled";

export type OrderDetails = {
  type: OrderType;
  customerName: string;
  tableNumber: string;
  phone: string;
  address: string;
  notes: string;
};

export type Order = {
  id: string;
  number: number;
  type: OrderType;
  customerName: string;
  phone: string;
  tableNumber: string;
  address: string;
  notes: string;
  items: CartLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "demo_unpaid" | "demo_confirmed";
  status: OrderStatus;
  createdAt: string;
};
