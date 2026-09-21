import { makeVars, numeric } from "@njinlabs/njin";
import z from "zod";

const stats = makeVars("stats", {
  name: "Angka Pencapaian",
  schema: z.object({
    cooperatives: numeric({ label: "Koperasi Dibina" }, (z) => z.default(500)),
    participants: numeric({ label: "Peserta Terlatih" }, (z) => z.default(1200)),
    facilitators: numeric({ label: "Fasilitator Aktif" }, (z) => z.default(80)),
  }),
});

export default stats;
