import { defineHelper } from "@njinlabs/njin";

export default defineHelper("waLink", (number: string, message = "") => {
  const digits = String(number ?? "").replace(/\D/g, "");
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
});
