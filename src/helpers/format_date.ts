import { defineHelper } from "@njinlabs/njin";

const presets: Record<string, Intl.DateTimeFormatOptions> = {
  long: { day: "numeric", month: "long", year: "numeric" },
  short: { day: "numeric", month: "short", year: "numeric" },
  time: { hour: "2-digit", minute: "2-digit" },
  day: { day: "2-digit" },
  month: { month: "short" },
  full: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  datetime: { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" },
};

export default defineHelper("formatDate", (date: string | Date | null | undefined, preset = "long") => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", ...(presets[preset] ?? presets.long) }).format(d);
});
