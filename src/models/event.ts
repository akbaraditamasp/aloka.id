import { makeModel, text, richtext, numeric, select, date, file, relation } from "@njinlabs/njin";
import z from "zod";
import facilitator from "./facilitator";

export const EVENT_TYPES = ["WEBINAR", "WORKSHOP", "PELATIHAN"] as const;
export const EVENT_MODES = ["ONLINE", "OFFLINE"] as const;

const event = makeModel("event", {
  name: "Event",
  searchFields: ["title", "summary", "venue"],
  schema: z.object({
    title: text({ label: "Judul" }),
    slug: text({ label: "Slug", unique: true }),
    type: select({ label: "Tipe" }, EVENT_TYPES),
    mode: select({ label: "Format" }, EVENT_MODES),
    summary: text({ label: "Ringkasan (1–2 kalimat)" }),
    description: richtext({ label: "Deskripsi Lengkap" }, (z) => z.optional()),
    thumbnail: file({ label: "Thumbnail (16:9)" }, (z) => z.optional()),
    startAt: date({ label: "Mulai" }),
    endAt: date({ label: "Selesai" }, (z) => z.optional()),
    venue: text({ label: "Tempat (mis. Zoom / Jakarta)" }, (z) => z.optional()),
    price: numeric({ label: "Harga (Rp, 0 = gratis)" }, (z) => z.default(0)),
    quota: numeric({ label: "Kuota Peserta" }, (z) => z.optional()),
    facilitator: relation({ label: "Fasilitator", labelKey: "name" }, facilitator, (z) => z.optional()),
    status: select({ label: "Status" }, ["DRAFT", "PUBLISH"], (z) => z.default("PUBLISH")),
  }),
});

export default event;
