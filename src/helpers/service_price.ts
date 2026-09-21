import { defineHelper } from "@njinlabs/njin";

const formatter = new Intl.NumberFormat("id-ID");

// "Mulai Rp2.000.000 / orang" — or a neutral fallback when the service row doesn't exist
// (e.g. not created in the admin yet), so a page never renders an empty price slot.
export default defineHelper(
  "servicePrice",
  (item: { price?: number; priceUnit?: string } | null | undefined) => {
    if (!item || typeof item.price !== "number") return "Hubungi kami";
    return `Mulai Rp${formatter.format(item.price)}${item.priceUnit ? ` ${item.priceUnit}` : ""}`;
  },
);
