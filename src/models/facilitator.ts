import { makeModel, text, richtext, numeric, select, array, file } from "@njinlabs/njin";
import z from "zod";

const facilitator = makeModel("facilitator", {
  name: "Fasilitator",
  searchFields: ["name", "title", "city"],
  schema: z.object({
    name: text({ label: "Nama" }),
    slug: text({ label: "Slug", unique: true }),
    title: text({ label: "Jabatan / Gelar Profesi" }),
    photo: file({ label: "Foto" }, (z) => z.optional()),
    bio: richtext({ label: "Bio" }, (z) => z.optional()),
    expertise: array({ label: "Keahlian" }, text({ label: "Keahlian" }), (z) => z.default([])),
    city: text({ label: "Kota / Domisili" }, (z) => z.optional()),
    status: select({ label: "Status" }, ["DRAFT", "PUBLISH"], (z) => z.default("PUBLISH")),
    sortOrder: numeric({ label: "Urutan Tampil" }, (z) => z.default(0)),
  }),
});

export default facilitator;
