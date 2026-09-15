export type Review = {
  id: string;
  name: string;
  rating: number;
  body: string;
  date: string;
};

export const seedReviews: Review[] = [
  {
    id: "r1",
    name: "Maria S.",
    rating: 5,
    body: "Really good Spanish latte and the staff were friendly. Love that you can order directly from the table — no queueing on a Saturday.",
    date: "2026-08-21",
  },
  {
    id: "r2",
    name: "Paolo R.",
    rating: 5,
    body: "The cold brew is the best I've had in Batangas. Quiet in the mornings, good spot to work before the lunch crowd.",
    date: "2026-08-14",
  },
  {
    id: "r3",
    name: "Kaye D.",
    rating: 4,
    body: "Chicken rice bowl was generous and still warm when it reached our table. Croissants sell out early though, come before 10.",
    date: "2026-07-30",
  },
  {
    id: "r4",
    name: "Jomar T.",
    rating: 5,
    body: "Ordered from table 7 on my phone and it arrived in under fifteen minutes. Tablea chocolate tastes like the real thing.",
    date: "2026-07-18",
  },
  {
    id: "r5",
    name: "Angela V.",
    rating: 5,
    body: "Brought my parents for merienda. They liked that the menu prices are clear and the space isn't loud.",
    date: "2026-07-02",
  },
  {
    id: "r6",
    name: "Nico B.",
    rating: 4,
    body: "Solid matcha, not too sweet. Delivery took a bit longer than quoted but the drinks were still cold.",
    date: "2026-06-25",
  },
];

export const ratingSummary = {
  average: 4.8,
  count: 128,
  distribution: [
    { stars: 5, percent: 92 },
    { stars: 4, percent: 6 },
    { stars: 3, percent: 2 },
    { stars: 2, percent: 0 },
    { stars: 1, percent: 0 },
  ],
};
