export type FulfilmentType = "DINE_IN" | "PICKUP" | "DELIVERY";
export type OrderStatus = "NEW" | "ACCEPTED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
export interface Money { amount: number; currency: "NGN"; }
export interface OrderLine { menuItemId: string; name: string; quantity: number; unitPrice: Money; notes?: string; }
export interface Order { id: string; tenantId: string; branchId: string; tableId?: string; fulfilment: FulfilmentType; status: OrderStatus; lines: OrderLine[]; createdAt: string; }
export const orderTotal = (order: Order): Money => ({ amount: order.lines.reduce((sum, line) => sum + line.unitPrice.amount * line.quantity, 0), currency: "NGN" });
