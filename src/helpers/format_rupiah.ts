import { defineHelper } from "@njinlabs/njin";

const formatter = new Intl.NumberFormat("id-ID");

export default defineHelper("formatRupiah", (amount: number | string | null | undefined) => {
  const value = Number(amount ?? 0);
  return `Rp${formatter.format(Number.isFinite(value) ? value : 0)}`;
});
