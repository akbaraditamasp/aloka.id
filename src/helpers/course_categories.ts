import { defineHelper } from "@njinlabs/njin";

// `code` is what's stored in the DB (course.category); `slug` is what appears in URLs.
const categories = [
  { code: "TATA_KELOLA", slug: "tata-kelola", label: "Tata Kelola" },
  { code: "KEUANGAN", slug: "keuangan", label: "Keuangan" },
  { code: "LEGALITAS", slug: "legalitas", label: "Legalitas" },
  { code: "DIGITALISASI", slug: "digitalisasi", label: "Digitalisasi" },
];

export default defineHelper("courseCategories", () => categories);
