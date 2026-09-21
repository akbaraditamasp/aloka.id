import { makeVars, text } from "@njinlabs/njin";
import z from "zod";

const seo = makeVars("seo", {
  name: "SEO",
  schema: z.object({
    metaTitle: text({ label: "Meta Title Default" }, (z) => z.default("Aloka — Koperasi Naik Kelas, Bareng Aloka")),
    metaDescription: text(
      { label: "Meta Description Default" },
      (z) =>
        z.default(
          "Kelas online, sertifikasi, konsultasi, legalitas, dan akses pembiayaan koperasi dalam satu platform.",
        ),
    ),
    ogImage: text({ label: "OG Image (URL, 1200×630)" }, (z) => z.default("")),
  }),
});

export default seo;
