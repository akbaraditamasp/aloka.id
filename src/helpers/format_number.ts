import { defineHelper } from "@njinlabs/njin";

const formatter = new Intl.NumberFormat("id-ID");

export default defineHelper("formatNumber", (value: number | string | null | undefined) => {
  const n = Number(value ?? 0);
  return formatter.format(Number.isFinite(n) ? n : 0);
});
