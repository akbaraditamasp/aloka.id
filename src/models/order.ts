import { makeModel, text, numeric, select, date } from "@njinlabs/njin";
import z from "zod";

export const ORDER_TYPES = ["COURSE", "CERTIFICATION", "EVENT", "SERVICE"] as const;
export const ORDER_STATUSES = ["PENDING", "PAID", "CANCELLED", "EXPIRED", "REFUNDED"] as const;

// Parent of every transaction (course/certification/event registration and service bookings).
// Price fields are a snapshot taken when the order is created, so later catalog price changes never
// rewrite history. Payment attempts live in the separate `payment` model.
const order = makeModel("order", {
  name: "Pesanan",
  searchFields: ["code", "itemName", "customerName", "customerEmail"],
  schema: z.object({
    // Also the reference sent to the gateway (external_id / invoice number), e.g. ALK-20260922-0001.
    code: text({ label: "Kode Pesanan", unique: true }),
    type: select({ label: "Jenis" }, ORDER_TYPES),
    itemSlug: text({ label: "Slug Item" }),
    itemName: text({ label: "Nama Item" }),

    quantity: numeric({ label: "Jumlah" }, (z) => z.default(1)),
    unitPrice: numeric({ label: "Harga Satuan (Rp)" }, (z) => z.min(0)),
    discount: numeric({ label: "Diskon (Rp)" }, (z) => z.default(0)),
    fee: numeric({ label: "Biaya Admin (Rp)" }, (z) => z.default(0)),
    total: numeric({ label: "Total (Rp)" }, (z) => z.min(0)),

    customerName: text({ label: "Nama Pemesan" }),
    customerEmail: text({ label: "Email Pemesan" }),
    customerWhatsapp: text({ label: "WhatsApp Pemesan" }),
    customerOrganization: text({ label: "Nama Koperasi" }, (z) => z.optional()),

    // Only used by bookings (online consultation / Panggil Pelatih).
    schedule: date({ label: "Jadwal" }, (z) => z.optional()),
    location: text({ label: "Lokasi" }, (z) => z.optional()),
    notes: text({ label: "Catatan" }, (z) => z.optional()),

    status: select({ label: "Status" }, ORDER_STATUSES, (z) => z.default("PENDING")),
    paidAt: date({ label: "Dibayar Pada" }, (z) => z.optional()),
    expiresAt: date({ label: "Batas Pembayaran" }, (z) => z.optional()),
  }),
});

export default order;
