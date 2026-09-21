import { makeModel, text, numeric, select } from "@njinlabs/njin";
import z from "zod";

const testimonial = makeModel("testimonial", {
  name: "Testimoni",
  searchFields: ["name", "organization", "quote"],
  schema: z.object({
    name: text({ label: "Nama" }),
    position: text({ label: "Jabatan (mis. Ketua)" }),
    organization: text({ label: "Koperasi & Wilayah (mis. Koperasi Tani Makmur — Jawa Tengah)" }),
    quote: text({ label: "Kutipan" }),
    status: select({ label: "Status" }, ["DRAFT", "PUBLISH"], (z) => z.default("PUBLISH")),
    sortOrder: numeric({ label: "Urutan Tampil" }, (z) => z.default(0)),
  }),
});

export default testimonial;
