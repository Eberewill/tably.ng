import { z } from "zod";
export const fulfilmentSchema = z.enum(["DINE_IN", "PICKUP", "DELIVERY"]);
export const tableTokenSchema = z.string().min(20).max(512);
export const createOrderSchema = z.object({ branchId:z.string().min(1), tableToken:tableTokenSchema.optional(), fulfilment:fulfilmentSchema, items:z.array(z.object({ menuItemId:z.string().min(1), quantity:z.number().int().positive(), notes:z.string().max(240).optional() })).min(1) });
