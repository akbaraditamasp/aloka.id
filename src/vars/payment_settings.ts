import { makeVars, boolean, numeric, select, array } from "@njinlabs/njin";
import z from "zod";

// Behaviour settings only. Gateway credentials (client id / secret key / webhook token) are NOT stored
// here — they stay in .env and are read from config.ts.
const paymentSettings = makeVars("payment_settings", {
  name: "Pembayaran",
  schema: z.object({
    enabled: boolean({ label: "Aktifkan Pembayaran Online" }, (z) => z.default(false)),
    defaultProvider: select({ label: "Gateway Default" }, ["DOKU", "XENDIT"], (z) => z.default("XENDIT")),
    invoiceExpiryHours: numeric({ label: "Masa Berlaku Invoice (jam)" }, (z) => z.default(24)),
    adminFee: numeric({ label: "Biaya Admin per Transaksi (Rp)" }, (z) => z.default(0)),
    methods: array(
      { label: "Metode Pembayaran Aktif" },
      select({ label: "Metode" }, ["VA", "QRIS", "EWALLET", "CARD", "RETAIL"]),
      (z) => z.default(["VA", "QRIS", "EWALLET"]),
    ),
  }),
});

export default paymentSettings;
