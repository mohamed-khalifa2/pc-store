import type { z } from "zod";

import type {
  orderItemRowSchema,
  orderRowSchema,
  orderWithItemsSchema,
} from "@/features/orders/schemas/order";

export type OrderSummary = z.infer<typeof orderRowSchema>;
export type OrderItem = z.infer<typeof orderItemRowSchema>;
export type OrderDetailData = z.infer<typeof orderWithItemsSchema>;
