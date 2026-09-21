import { defineHelper } from "@njinlabs/njin";

const labels: Record<string, Record<string, string>> = {
  courseCategory: {
    TATA_KELOLA: "Tata Kelola",
    KEUANGAN: "Keuangan",
    LEGALITAS: "Legalitas",
    DIGITALISASI: "Digitalisasi",
  },
  eventType: {
    WEBINAR: "Webinar",
    WORKSHOP: "Workshop",
    PELATIHAN: "Pelatihan",
  },
  eventMode: {
    ONLINE: "Online",
    OFFLINE: "Tatap Muka",
  },
  courseLevel: {
    PEMULA: "Pemula",
    MENENGAH: "Menengah",
    SULIT: "Sulit",
  },
};

export default defineHelper("optionLabel", (group: string, code: string | null | undefined) => {
  if (!code) return "";
  return labels[group]?.[code] ?? code;
});
