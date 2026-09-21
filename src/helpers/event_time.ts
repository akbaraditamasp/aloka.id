import { defineHelper } from "@njinlabs/njin";

const time = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit" });

// "19.00–21.00 WIB" (or just "19.00 WIB" when there's no end time).
export default defineHelper("eventTime", (start: string | null | undefined, end?: string | null) => {
  if (!start) return "";
  const s = new Date(start);
  if (Number.isNaN(s.getTime())) return "";
  const e = end ? new Date(end) : null;
  const from = time.format(s);
  return e && !Number.isNaN(e.getTime()) ? `${from}–${time.format(e)} WIB` : `${from} WIB`;
});
