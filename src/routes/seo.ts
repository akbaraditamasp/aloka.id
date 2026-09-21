import { route } from "@njinlabs/njin";
import general from "../vars/general";
import course from "../models/course";
import certification from "../models/certification";
import facilitator from "../models/facilitator";
import event from "../models/event";

// robots.txt + sitemap.xml. The sitemap is built per request from published records (cheap at this
// catalog size); static pages are listed by hand and must be kept in sync with src/views/pages.

const STATIC_PATHS = [
  "/",
  "/kelas-elearning",
  "/sertifikasi-bnsp",
  "/konsultasi",
  "/konsultan-pajak",
  "/laporan-keuangan",
  "/legalitas",
  "/izin-ksp-usp",
  "/pembiayaan",
  "/fasilitator",
  "/event",
  "/tentang",
  "/kontak",
];

// Keep in sync with helpers/course_categories.ts and helpers/event_types.ts.
const CATEGORY_SLUGS = ["tata-kelola", "keuangan", "legalitas", "digitalisasi"];
const EVENT_TYPE_SLUGS = ["webinar", "workshop", "pelatihan"];

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Entry = { path: string; lastmod?: string };

const published = { status: "PUBLISH" };

export default route()
  .get("/robots.txt", async () => {
    const { siteUrl } = await general.get();
    const body = [
      "User-agent: *",
      "Disallow: /_admin",
      "Disallow: /api/",
      "Disallow: /form/",
      "Allow: /",
      "",
      `Sitemap: ${siteUrl.replace(/\/+$/, "")}/sitemap.xml`,
      "",
    ].join("\n");
    return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
  })
  .get("/sitemap.xml", async () => {
    const { siteUrl } = await general.get();
    const origin = siteUrl.replace(/\/+$/, "");

    const [courses, certifications, facilitators, events] = await Promise.all([
      course.read({ filters: published, limit: 100, populate: "none" }),
      certification.read({ filters: published, limit: 100, populate: "none" }),
      facilitator.read({ filters: published, limit: 100, populate: "none" }),
      event.read({ filters: published, limit: 100, sort: "startAt", order: "desc", populate: "none" }),
    ]);

    const entries: Entry[] = [
      ...STATIC_PATHS.map((path) => ({ path })),
      ...CATEGORY_SLUGS.map((slug) => ({ path: `/kelas-elearning/kategori/${slug}` })),
      ...EVENT_TYPE_SLUGS.map((slug) => ({ path: `/event/tipe/${slug}` })),
      ...courses.data.map((c) => ({ path: `/kelas-elearning/${c.slug}`, lastmod: c.updatedAt })),
      ...certifications.data.map((c) => ({ path: `/sertifikasi-bnsp/${c.slug}`, lastmod: c.updatedAt })),
      ...facilitators.data.map((f) => ({ path: `/fasilitator/${f.slug}`, lastmod: f.updatedAt })),
      ...events.data.map((e) => ({ path: `/event/${e.slug}`, lastmod: e.updatedAt })),
    ];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...entries.map(
        ({ path, lastmod }) =>
          `  <url><loc>${escapeXml(origin + path)}</loc>${lastmod ? `<lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : ""}</url>`,
      ),
      "</urlset>",
      "",
    ].join("\n");

    return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
  });
