import { makeModel, text, richtext, numeric, select, array } from "@njinlabs/njin";
import z from "zod";

// Which pillar page the service is listed on (pages are still hand-written; only the packages/prices
// on them come from this model).
export const SERVICE_CATEGORIES = [
  "KONSULTASI",
  "KONSULTAN_PAJAK",
  "LAPORAN_KEUANGAN",
  "LEGALITAS",
  "IZIN_KSP_USP",
  "PEMBIAYAAN",
] as const;

const service = makeModel("service", {
  name: "Layanan & Paket",
  searchFields: ["name", "summary"],
  schema: z.object({
    name: text({ label: "Nama Layanan" }),
    // Templates look services up by slug (e.g. "art", "sop", "akta"), so treat it as a stable key.
    slug: text({ label: "Slug (kunci unik, dipakai template — jangan diubah sembarangan)", unique: true }),
    category: select({ label: "Ditampilkan di Halaman" }, SERVICE_CATEGORIES),
    summary: text({ label: "Ringkasan" }, (z) => z.optional()),
    description: richtext({ label: "Deskripsi Lengkap" }, (z) => z.optional()),
    features: array({ label: "Yang Termasuk" }, text({ label: "Poin" }), (z) => z.default([])),
    price: numeric({ label: "Harga Mulai Dari (Rp)" }, (z) => z.min(0)),
    priceUnit: text({ label: "Satuan Harga (mis. / orang, / dokumen, /bulan)" }, (z) => z.optional()),
    status: select({ label: "Status" }, ["DRAFT", "PUBLISH"], (z) => z.default("PUBLISH")),
    sortOrder: numeric({ label: "Urutan Tampil" }, (z) => z.default(0)),
  }),
});

export default service;
