import { notifyAdmin, sendOrderConfirmation } from "./email";
import { submitFulfillment } from "./fulfillment";
import { getOrder } from "./orders";

/** Everything that happens once, right after a payment is confirmed. */
export async function afterPayment(orderId, extraNote = "") {
  let order = await getOrder(orderId);
  const note = await submitFulfillment(order);
  order = await getOrder(orderId);
  await sendOrderConfirmation(order);
  await notifyAdmin(order, [extraNote, note].filter(Boolean).join(" "));
}
