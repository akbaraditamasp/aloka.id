import { defineHelper } from "@njinlabs/njin";

// `code` is stored in inquiry.topic; the contact form's <select> renders `label`.
const topics = [
  { code: "KONSULTASI", label: "Konsultasi koperasi (ART, Persus, SOP, RAT)" },
  { code: "KONSULTAN_PAJAK", label: "Konsultan pajak" },
  { code: "LAPORAN_KEUANGAN", label: "Laporan keuangan" },
  { code: "LEGALITAS", label: "Legalitas & pendirian koperasi" },
  { code: "IZIN_KSP_USP", label: "Izin operasional KSP/USP" },
  { code: "PEMBIAYAAN", label: "Akses pembiayaan" },
  { code: "AKADEMI", label: "Kelas, sertifikasi & webinar" },
  { code: "LAINNYA", label: "Lainnya" },
];

export default defineHelper("inquiryTopics", () => topics);
