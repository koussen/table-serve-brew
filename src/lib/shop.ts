export const shop = {
  name: "Kape & Klase",
  tagline: "Small-batch coffee, Batangas.",
  addressLine: "24 Rizal Avenue, Poblacion, Batangas City, Batangas 4200",
  shortAddress: "Batangas City, Batangas",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=24+Rizal+Avenue+Poblacion+Batangas+City",
  phoneDisplay: "+63 917 412 8806",
  phoneHref: "tel:+639174128806",
  email: "hello@kapeklase.ph",
  facebook: "https://www.facebook.com/kapeklase",
  instagram: "https://www.instagram.com/kapeklase",
  hours: [
    { days: "Monday — Thursday", time: "8:00 AM — 9:00 PM" },
    { days: "Friday — Sunday", time: "8:00 AM — 10:00 PM" },
  ],
  deliveryFee: 59,
  prepTime: "15–20 minutes",
} as const;

export const categories = [
  { id: "coffee", label: "Coffee" },
  { id: "nonCoffee", label: "Non-coffee" },
  { id: "pastries", label: "Pastries" },
  { id: "riceBowls", label: "Rice bowls" },
] as const;
