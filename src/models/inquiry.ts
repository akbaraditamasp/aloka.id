import { makeModel, text, email, select } from "@njinlabs/njin";
import z from "zod";

export const INQUIRY_TOPICS = [
  "KONSULTASI",
  "KONSULTAN_PAJAK",
  "LAPORAN_KEUANGAN",
  "LEGALITAS",
  "IZIN_KSP_USP",
  "PEMBIAYAAN",
  "AKADEMI",
  "LAINNYA",
] as const;

const inquiry = makeModel("inquiry", {
  name: "Pesan Masuk",
  searchFields: ["name", "organization", "message"],
  schema: z.object({
    name: text({ label: "Nama" }),
    whatsapp: text({ label: "WhatsApp" }),
    email: email({ label: "Email" }, (z) => z.optional()),
    organization: text({ label: "Nama Koperasi" }, (z) => z.optional()),
    topic: select({ label: "Topik" }, INQUIRY_TOPICS, (z) => z.default("LAINNYA")),
    message: text({ label: "Pesan" }),
    source: text({ label: "Asal Halaman" }, (z) => z.optional()),
    status: select({ label: "Status" }, ["NEW", "IN_PROGRESS", "DONE", "SPAM"], (z) => z.default("NEW")),
    notes: text({ label: "Catatan Internal" }, (z) => z.optional()),
  }),
});

export default inquiry;
