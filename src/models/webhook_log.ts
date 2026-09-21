import { makeModel, text, select } from "@njinlabs/njin";
import z from "zod";

// Every callback received from a payment gateway, stored before it is processed. Gives idempotency
// (skip a providerRef+eventType already PROCESSED), an audit trail, and a place to see rejected
// signatures when debugging.
const webhookLog = makeModel("webhook_log", {
  name: "Log Webhook",
  searchFields: ["providerRef", "eventType"],
  schema: z.object({
    provider: select({ label: "Penyedia" }, ["DOKU", "XENDIT", "MANUAL"]),
    eventType: text({ label: "Jenis Event" }, (z) => z.optional()),
    providerRef: text({ label: "ID Transaksi Gateway" }, (z) => z.optional()),
    payload: text({ label: "Payload (JSON mentah)" }),
    verified: select({ label: "Signature Valid?" }, ["YES", "NO"], (z) => z.default("NO")),
    processStatus: select({ label: "Status Proses" }, ["RECEIVED", "PROCESSED", "IGNORED", "FAILED"], (z) => z.default("RECEIVED")),
    error: text({ label: "Error" }, (z) => z.optional()),
  }),
});

export default webhookLog;
