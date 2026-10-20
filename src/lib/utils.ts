export type ClassValue = string | number | bigint | boolean | undefined | null | { [key: string]: any } | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === "object") {
      for (const [key, val] of Object.entries(input)) {
        if (val) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}

/**
 * Format price in paisa to BDT currency string.
 * All prices stored as integers in paisa (smallest BDT unit).
 * ৳1,200 = 120000 paisa.
 */
export function formatPrice(paisa: number): string {
  const taka = Math.floor(paisa / 100);
  const formatted = new Intl.NumberFormat("en-US").format(taka);
  return `৳${formatted}`;
}

export function paisaToNumber(paisa: number): number {
  return paisa / 100;
}

export function numberToPaisa(taka: number): number {
  return Math.round(taka * 100);
}

export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DH-${dateStr}-${randomChars}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str || "";
  return str.slice(0, length) + "...";
}

export function getStockStatusLabel(status: string): { label: string; color: string } {
  switch (status) {
    case "IN_STOCK":
      return { label: "In Stock", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
    case "LOW_STOCK":
      return { label: "Low Stock", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" };
    case "OUT_OF_STOCK":
      return { label: "Out of Stock", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" };
    case "UNLIMITED":
    default:
      return { label: "Available", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" };
  }
}

export function getOrderStatusLabel(status: string): { label: string; color: string } {
  switch (status) {
    case "PENDING":
      return { label: "Pending", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
    case "AWAITING_PAYMENT":
      return { label: "Awaiting Payment", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" };
    case "PAYMENT_UNDER_REVIEW":
      return { label: "Payment Under Review", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
    case "PAID":
      return { label: "Paid", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
    case "PROCESSING":
      return { label: "Processing", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
    case "COMPLETED":
      return { label: "Completed", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" };
    case "CANCELLED":
      return { label: "Cancelled", color: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
    case "REFUNDED":
      return { label: "Refunded", color: "text-slate-400 bg-slate-500/10 border-slate-500/30" };
    case "FAILED":
      return { label: "Failed", color: "text-red-500 bg-red-500/10 border-red-500/30" };
    default:
      return { label: status, color: "text-slate-300 bg-slate-700/20 border-slate-600/30" };
  }
}

export function getPaymentStatusLabel(status: string): { label: string; color: string } {
  switch (status) {
    case "VERIFIED":
      return { label: "Verified", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
    case "REJECTED":
      return { label: "Rejected", color: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
    case "PENDING":
    default:
      return { label: "Pending Verification", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
  }
}
