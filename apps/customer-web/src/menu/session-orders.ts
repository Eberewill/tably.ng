import { menu } from "./data";
import type { PastOrder } from "./types";

const storageKey = "tably.guest-order-history";
const sampleOrders: PastOrder[] = [
  {
    id: "ZUMA-4830",
    createdAt: "2026-08-10T19:42:00.000Z",
    status: "Served",
    items: [
      {
        id: "sample-ribeye",
        item: menu[0]!,
        selections: ["Medium Rare", "Jollof Rice"],
        quantity: 1,
      },
      {
        id: "sample-okra",
        item: menu[1]!,
        selections: [],
        quantity: 1,
      },
    ],
    total: 36787.5,
  },
  {
    id: "ZUMA-4829",
    createdAt: "2026-08-10T18:15:00.000Z",
    status: "Preparing",
    items: [
      {
        id: "sample-snails",
        item: menu[2]!,
        selections: [],
        quantity: 1,
      },
      {
        id: "sample-zobo",
        item: menu[6]!,
        selections: [],
        quantity: 2,
      },
    ],
    total: 19800,
  },
];

export function loadOrderHistory(): PastOrder[] {
  try {
    const value = localStorage.getItem(storageKey);
    const orders = value ? (JSON.parse(value) as PastOrder[]) : [];
    return [
      ...sampleOrders,
      ...orders.filter(
        (order) => !sampleOrders.some((sample) => sample.id === order.id),
      ),
    ];
  } catch {
    return sampleOrders;
  }
}

export function saveOrderHistory(orders: PastOrder[]) {
  localStorage.setItem(storageKey, JSON.stringify(orders));
}
