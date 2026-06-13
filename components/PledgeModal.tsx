"use client";

import { useEffect, useState } from "react";
import { HeartHandshake, Minus, Plus } from "lucide-react";

import { useStore } from "@/lib/store";
import type { DonationRequest } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/ui";
import Modal from "./Modal";
import ProgressBar from "./ProgressBar";

interface PledgeModalProps {
  request: DonationRequest | null;
  onClose: () => void;
}

/** Lets a donor commit a quantity toward a specific request. */
export default function PledgeModal({ request, onClose }: PledgeModalProps) {
  const { createPledge, pledgedQty } = useStore();
  const [quantity, setQuantity] = useState(1);

  const remaining = request
    ? Math.max(0, request.quantity_needed - pledgedQty(request.id))
    : 0;

  // Reset the input each time a new request is opened, defaulting to a
  // sensible amount (whatever is still needed, capped at 10).
  useEffect(() => {
    if (request) {
      setQuantity(Math.max(1, Math.min(10, remaining || 1)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.id]);

  if (!request) return null;

  const unit = CATEGORY_LABEL[request.category].toLowerCase();

  const clamp = (n: number) => Math.max(1, Math.min(9999, n));

  const submit = () => {
    createPledge(request.id, quantity);
    onClose();
  };

  return (
    <Modal open={!!request} title="Pledge a Donation" onClose={onClose}>
      <p className="text-sm text-gray-600">
        You&apos;re pledging toward{" "}
        <span className="font-semibold text-gray-900">{request.item_name}</span>.
      </p>

      <div className="mt-4">
        <ProgressBar
          value={pledgedQty(request.id)}
          max={request.quantity_needed}
          unit={CATEGORY_LABEL[request.category]}
        />
      </div>

      <label className="mt-5 block text-sm font-medium text-gray-700">
        How many {unit} can you bring?
      </label>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setQuantity((q) => clamp(q - 1))}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-gray-300 text-gray-600 transition hover:bg-gray-50"
          aria-label="Decrease"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(clamp(Number(e.target.value) || 1))}
          className="h-11 w-full rounded-xl border border-gray-300 text-center text-lg font-semibold text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="button"
          onClick={() => setQuantity((q) => clamp(q + 1))}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-gray-300 text-gray-600 transition hover:bg-gray-50"
          aria-label="Increase"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setQuantity(remaining)}
          className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          Cover the full remaining need ({remaining})
        </button>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          className="flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <HeartHandshake className="h-4 w-4" />
          Confirm Pledge
        </button>
      </div>
    </Modal>
  );
}
