import { makeModel, text, richtext, numeric, select, array, file, relation } from "@njinlabs/njin";
import z from "zod";
import facilitator from "./facilitator";

export const COURSE_CATEGORIES = ["TATA_KELOLA", "KEUANGAN", "LEGALITAS", "DIGITALISASI"] as const;
export const COURSE_LEVELS = ["PEMULA", "MENENGAH", "SULIT"] as const;

const course = makeModel("course", {
  name: "Kelas Online",
  searchFields: ["title", "summary"],
  schema: z.object({
    title: text({ label: "Judul" }),
    slug: text({ label: "Slug", unique: true }),
    category: select({ label: "Kategori" }, COURSE_CATEGORIES),
    level: select({ label: "Level" }, COURSE_LEVELS),
    summary: text({ label: "Ringkasan (1–2 kalimat)" }),
    description: richtext({ label: "Deskripsi Lengkap" }, (z) => z.optional()),
    outcomes: array({ label: "Yang Akan Dipelajari" }, text({ label: "Poin" }), (z) => z.default([])),
    thumbnail: file({ label: "Thumbnail (16:9)" }, (z) => z.optional()),
    price: numeric({ label: "Harga (Rp)" }, (z) => z.min(0)),
    durationMinutes: numeric({ label: "Durasi (menit)" }, (z) => z.min(0)),
    facilitator: relation({ label: "Fasilitator", labelKey: "name" }, facilitator, (z) => z.optional()),
    featured: select({ label: "Tampil di Kelas Populer Beranda?" }, ["NO", "YES"], (z) => z.default("NO")),
    status: select({ label: "Status" }, ["DRAFT", "PUBLISH"], (z) => z.default("PUBLISH")),
    sortOrder: numeric({ label: "Urutan Tampil" }, (z) => z.default(0)),
  }),
});

export default course;
