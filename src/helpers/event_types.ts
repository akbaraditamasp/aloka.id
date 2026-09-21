import { defineHelper } from "@njinlabs/njin";

// `code` is what's stored in the DB (event.type); `slug` is what appears in URLs.
const types = [
  { code: "WEBINAR", slug: "webinar", label: "Webinar" },
  { code: "WORKSHOP", slug: "workshop", label: "Workshop" },
  { code: "PELATIHAN", slug: "pelatihan", label: "Pelatihan" },
];

export default defineHelper("eventTypes", () => types);
