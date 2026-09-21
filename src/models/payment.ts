import { makeModel, text, numeric, select, date, relation } from "@njinlabs/njin";
import z from "zod";
import order from "./order";

export const PAYMENT_PROVIDERS = ["DOKU", "XENDIT", "MANUAL"] as const;
export const PAYMENT_METHODS = ["VA", "QRIS", "EWALLET", "CARD", "RETAIL", "TRANSFER"] as const;
export const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "EXPIRED", "REFUNDED"] as const;

// One payment *attempt* against an order — an order can have several (invoice expired and was
// re-issued, or the payer switched from VA to QRIS). Gateway-agnostic: DOKU / Xendit differ only in
// the adapter that fills providerRef / paymentUrl / rawResponse, not in this shape.
const payment = makeModel("payment", {
  name: "Pembayaran",
  searchFields: ["providerRef", "channel"],
  schema: z.object({
    order: relation({ label: "Pesanan", labelKey: "code" }, order),
    provider: select({ label: "Penyedia" }, PAYMENT_PROVIDERS),
    // Transaction / invoice id issued by the gateway.
    providerRef: text({ label: "ID Transaksi Gateway" }, (z) => z.optional()),
    method: select({ label: "Metode" }, PAYMENT_METHODS),
    channel: text({ label: "Kanal (mis. BCA, OVO)" }, (z) => z.optional()),
    amount: numeric({ label: "Nominal (Rp)" }, (z) => z.min(0)),
    currency: text({ label: "Mata Uang" }, (z) => z.default("IDR")),
    paymentUrl: text({ label: "Link Pembayaran" }, (z) => z.optional()),
    status: select({ label: "Status" }, PAYMENT_STATUSES, (z) => z.default("PENDING")),
    paidAt: date({ label: "Dibayar Pada" }, (z) => z.optional()),
    expiresAt: date({ label: "Kedaluwarsa Pada" }, (z) => z.optional()),
    // Raw gateway response (JSON string), kept for debugging and reconciliation.
    rawResponse: text({ label: "Respons Gateway (JSON)" }, (z) => z.optional()),
  }),
});

export default payment;
