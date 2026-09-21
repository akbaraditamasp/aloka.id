import { makeVars, text } from "@njinlabs/njin";
import z from "zod";

const general = makeVars("general", {
  name: "Umum",
  schema: z.object({
    siteName: text({ label: "Nama Situs" }, (z) => z.default("Aloka")),
    // Canonical origin for SEO (canonical tags, Open Graph, sitemap.xml) — no trailing slash needed.
    siteUrl: text({ label: "URL Situs (mis. https://aloka.id)" }, (z) => z.default("https://aloka.id")),
    tagline: text({ label: "Tagline" }, (z) => z.default("Koperasi Naik Kelas, Bareng Aloka")),
    motto: text({ label: "Motto" }, (z) => z.default("Lebih Objektif, Kredibel & Akuntabel")),
    description: text(
      { label: "Deskripsi Singkat" },
      (z) =>
        z.default(
          "Platform digital konsultan & edukasi perkoperasian — menemani koperasi Anda menuju legal, sehat keuangan, dan bankable.",
        ),
    ),
    whatsapp: text({ label: "Nomor WhatsApp (format 62…, tanpa + / spasi)" }, (z) => z.default("6281234567890")),
    email: text({ label: "Email" }, (z) => z.default("halo@aloka.id")),
    address: text({ label: "Alamat" }, (z) => z.default("")),
    instagram: text({ label: "Instagram (URL)" }, (z) => z.default("")),
    youtube: text({ label: "YouTube (URL)" }, (z) => z.default("")),
    linkedin: text({ label: "LinkedIn (URL)" }, (z) => z.default("")),
  }),
});

export default general;
