import { makeModel, text, richtext, numeric, select, array } from "@njinlabs/njin";
import z from "zod";

const certification = makeModel("certification", {
  name: "Skema Sertifikasi",
  searchFields: ["name", "targetRole", "summary"],
  schema: z.object({
    name: text({ label: "Nama Skema" }),
    slug: text({ label: "Slug", unique: true }),
    targetRole: text({ label: "Untuk Peran (mis. Bendahara & staf keuangan)" }),
    summary: text({ label: "Ringkasan (1–2 kalimat)" }),
    description: richtext({ label: "Deskripsi Lengkap" }, (z) => z.optional()),
    competencyUnits: array({ label: "Unit Kompetensi" }, text({ label: "Unit" }), (z) => z.default([])),
    requirements: array({ label: "Persyaratan Peserta" }, text({ label: "Syarat" }), (z) => z.default([])),
    price: numeric({ label: "Biaya (Rp)" }, (z) => z.min(0)),
    status: select({ label: "Status" }, ["DRAFT", "PUBLISH"], (z) => z.default("PUBLISH")),
    sortOrder: numeric({ label: "Urutan Tampil" }, (z) => z.default(0)),
  }),
});

export default certification;
