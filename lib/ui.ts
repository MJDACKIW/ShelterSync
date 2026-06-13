import type { Category, PledgeStatus, Urgency } from "./types";

// Shared presentational helpers (badge colors + labels) so styling stays
// consistent across the donor and shelter dashboards.

export const CATEGORY_LABEL: Record<Category, string> = {
  meals: "Meals",
  clothing: "Clothing",
  supplies: "Supplies",
};

export const CATEGORY_BADGE: Record<Category, string> = {
  meals: "bg-orange-100 text-orange-700 ring-1 ring-inset ring-orange-200",
  clothing: "bg-purple-100 text-purple-700 ring-1 ring-inset ring-purple-200",
  supplies: "bg-teal-100 text-teal-700 ring-1 ring-inset ring-teal-200",
};

export const URGENCY_LABEL: Record<Urgency, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const URGENCY_BADGE: Record<Urgency, string> = {
  low: "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200",
  medium: "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200",
  high: "bg-red-100 text-red-700 ring-1 ring-inset ring-red-200",
};

export const PLEDGE_STATUS_LABEL: Record<PledgeStatus, string> = {
  pending: "Pledged",
  dropped_off: "Dropped Off",
  delivered: "Received",
};

export const PLEDGE_STATUS_BADGE: Record<PledgeStatus, string> = {
  pending: "bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200",
  dropped_off: "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200",
  delivered: "bg-green-100 text-green-700 ring-1 ring-inset ring-green-200",
};

/** Human-friendly relative-ish date label, e.g. "Jun 8, 2026". */
export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
