import { makeVars, text, richtext, array } from "@njinlabs/njin";
import z from "zod";

const about = makeVars("about", {
  name: "Tentang Aloka",
  schema: z.object({
    headline: text({ label: "Judul" }, (z) => z.default("Teman koperasi menuju legal, sehat, dan bankable")),
    vision: text(
      { label: "Visi" },
      (z) =>
        z.default(
          "Menjadi platform pendamping perkoperasian yang objektif, kredibel, dan akuntabel bagi koperasi di seluruh Indonesia.",
        ),
    ),
    missions: array(
      { label: "Misi" },
      text({ label: "Poin Misi" }),
      (z) =>
        z.default([
          "Menyediakan edukasi dan sertifikasi perkoperasian yang mudah diakses secara online.",
          "Mendampingi koperasi dalam tata kelola, pelaporan keuangan, dan legalitas.",
          "Membuka akses pembiayaan yang layak bagi koperasi yang sehat dan tertib administrasi.",
        ]),
    ),
    story: richtext(
      { label: "Cerita Singkat" },
      (z) =>
        z.default(
          "<p>Aloka lahir dari kebutuhan pengurus koperasi akan pendamping yang paham perkoperasian sekaligus praktis di lapangan.</p>",
        ),
    ),
  }),
});

export default about;
