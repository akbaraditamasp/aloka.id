import { route } from "@njinlabs/njin";
import z from "zod";
import inquiry, { INQUIRY_TOPICS } from "../models/inquiry";

// Public contact-form endpoint (no auth — /api/inquiry stays admin-only). Plain HTML form POST that
// answers with a 303 back to /kontak, so it works without any client-side JS.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

// In-memory per-IP limit: resets on restart and isn't shared across instances — enough to blunt a
// naive spam loop; put a real limiter / captcha in front if abuse shows up.
const isLimited = (ip: string) => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
};

const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

// 0812… / +62812… / 62812… -> 62812…
const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
};

const form = z.object({
  name: z.string().trim().min(2).max(100),
  whatsapp: z.string().transform(normalizePhone).pipe(z.string().min(9).max(15)),
  email: z.union([z.literal(""), z.string().trim().max(150).pipe(z.email())]).optional(),
  organization: z.string().trim().max(150).optional(),
  topic: z.enum(INQUIRY_TOPICS).catch("LAINNYA"),
  message: z.string().trim().min(10).max(2000),
  source: z.string().trim().max(200).optional(),
  // Honeypot: hidden from humans, bots fill it in.
  website: z.string().optional(),
});

const back = (status: "sent" | "invalid" | "busy") =>
  new Response(null, { status: 303, headers: { Location: `/kontak?status=${status}#form` } });

export default route().post("/form/inquiry", async ({ body, request }) => {
  const parsed = form.safeParse(body ?? {});
  if (!parsed.success) return back("invalid");

  const { website, email, organization, source, ...data } = parsed.data;
  if (website) return back("sent"); // pretend success, store nothing

  if (isLimited(clientIp(request))) return back("busy");

  await inquiry.create({
    ...data,
    ...(email ? { email } : {}),
    ...(organization ? { organization } : {}),
    ...(source ? { source } : {}),
    status: "NEW",
  } as Parameters<typeof inquiry.create>[0]);

  return back("sent");
});
