import { defineConfig } from "@njinlabs/njin/config";
import s3Adapter from "@njinlabs/njin/adapters/s3";

export default defineConfig({
  port: Number(process.env.PORT ?? 3000),
  db: {
    path: process.env.DB_PATH ?? "rocksdb://data",
    namespace: process.env.DB_NAMESPACE ?? "general",
    database: process.env.DB_DATABASE ?? "general",
    auth: process.env.DB_TOKEN
      ? process.env.DB_TOKEN
      : process.env.DB_USERNAME && process.env.DB_PASSWORD
        ? { username: process.env.DB_USERNAME, password: process.env.DB_PASSWORD }
        : undefined,
  },
  img: {
    hosts: process.env.IMG_HOSTS
      ? process.env.IMG_HOSTS.split(",").map((h) => h.trim()).filter(Boolean)
      : [],
  },
  adapters: {
    file: s3Adapter({
      bucket: process.env.S3_BUCKET!,
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      endpoint: process.env.S3_ENDPOINT,
      publicUrl: process.env.S3_PUBLIC_URL,
    }),
  },
  models: [
    () => import("./src/models/facilitator"),
    () => import("./src/models/testimonial"),
    () => import("./src/models/course"),
    () => import("./src/models/certification"),
    () => import("./src/models/event"),
    () => import("./src/models/service"),
    () => import("./src/models/inquiry"),
    () => import("./src/models/order"),
    () => import("./src/models/payment"),
    () => import("./src/models/webhook_log"),
  ],
  vars: [
    () => import("./src/vars/general"),
    () => import("./src/vars/stats"),
    () => import("./src/vars/about"),
    () => import("./src/vars/seo"),
    () => import("./src/vars/payment_settings"),
  ],
  helpers: [
    () => import("./src/helpers/format_rupiah"),
    () => import("./src/helpers/format_number"),
    () => import("./src/helpers/format_date"),
    () => import("./src/helpers/wa_link"),
    () => import("./src/helpers/option_label"),
    () => import("./src/helpers/course_categories"),
    () => import("./src/helpers/event_types"),
    () => import("./src/helpers/event_time"),
    () => import("./src/helpers/service_price"),
    () => import("./src/helpers/inquiry_topics"),
  ],
  hooks: [
    // Model hooks that fan out to the event bus (inquiry/order created).
    () => import("./src/events/hooks/dispatch"),
  ],
  events: [
    // Listener files — imported here so their .listen() calls run at boot, e.g.:
    // () => import("./src/events/listeners/send_receipt"),
  ],
  routes: [() => import("./src/routes/inquiry")],
  plugins: [
    // Installable bundles of models/vars/hooks/events/routes, e.g.:
    // myPlugin({ apiKey: process.env.MY_PLUGIN_KEY! }),
  ],
});
