import { makeEvent } from "@njinlabs/njin";

// Dispatched by the (future) payment-gateway engine when a webhook / status check settles a payment.
// Listeners (receipt email, WhatsApp notice, granting course access, ...) hang off these without the
// engine knowing about them.
type PaymentPayload = { orderId: string; paymentId: string; provider: string; amount: number };

export const paymentPaid = makeEvent<PaymentPayload>();
export const paymentFailed = makeEvent<PaymentPayload>();
export const paymentExpired = makeEvent<PaymentPayload>();
