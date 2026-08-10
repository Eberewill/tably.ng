import type { Order } from "@tably/order-domain";
export type PrintWidth = "58mm" | "80mm" | "A5" | "A4";
export interface KitchenTicket { width: PrintWidth; station: "KITCHEN" | "BAR"; order: Order; }
export interface TableQrCard { width: "A5" | "A4"; restaurantName: string; tableLabel: string; signedUrl: string; }
