"use client";

import { HeartHandshake, MapPin, Package, Shirt, Utensils } from "lucide-react";

import { useStore } from "@/lib/store";
import type { Category, DonationRequest } from "@/lib/types";
import {
  CATEGORY_BADGE,
  CATEGORY_LABEL,
  URGENCY_BADGE,
  URGENCY_LABEL,
} from "@/lib/ui";
import ProgressBar from "./ProgressBar";

const CATEGORY_ICON: Record<Category, typeof Utensils> = {
  meals: Utensils,
  clothing: Shirt,
  supplies: Package,
};

interface RequestCardProps {
  request: DonationRequest;
  /** When provided, renders a "Pledge" CTA (donor feed). */
  onPledge?: (request: DonationRequest) => void;
}

/** Card used in the Donor needs feed. */
export default function RequestCard({ request, onPledge }: RequestCardProps) {
  const { shelterById, pledgedQty } = useStore();
  const shelter = shelterById(request.shelter_id);
  const pledged = pledgedQty(request.id);
  const Icon = CATEGORY_ICON[request.category];
  const remaining = Math.max(0, request.quantity_needed - pledged);
  const fulfilled = request.status === "fulfilled";

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-gray-900">
              {request.item_name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5 flex-none" />
              <span className="truncate">{shelter?.name ?? "Unknown shelter"}</span>
            </p>
          </div>
        </div>
        <span
          className={`flex-none rounded-full px-2.5 py-1 text-xs font-medium ${URGENCY_BADGE[request.urgency]}`}
        >
          {URGENCY_LABEL[request.urgency]}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_BADGE[request.category]}`}
        >
          {CATEGORY_LABEL[request.category]}
        </span>
        {fulfilled ? (
          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
            Fulfilled
          </span>
        ) : (
          <span className="text-xs text-gray-500">{remaining} still needed</span>
        )}
      </div>

      <div className="mt-4">
        <ProgressBar
          value={pledged}
          max={request.quantity_needed}
          unit={CATEGORY_LABEL[request.category]}
        />
      </div>

      {onPledge && (
        <button
          type="button"
          onClick={() => onPledge(request)}
          disabled={fulfilled}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <HeartHandshake className="h-4 w-4" />
          {fulfilled ? "Goal Met — Thank You!" : "Pledge a Donation"}
        </button>
      )}
    </article>
  );
}
