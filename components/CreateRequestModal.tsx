"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { useStore } from "@/lib/store";
import type { Category, Urgency } from "@/lib/types";
import { CATEGORY_LABEL, URGENCY_LABEL } from "@/lib/ui";
import Modal from "./Modal";

interface CreateRequestModalProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES: Category[] = ["meals", "clothing", "supplies"];
const URGENCIES: Urgency[] = ["low", "medium", "high"];

/** Form used by shelter staff to post a new donation need. */
export default function CreateRequestModal({
  open,
  onClose,
}: CreateRequestModalProps) {
  const { createRequest } = useStore();

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState<Category>("meals");
  const [quantity, setQuantity] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("medium");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setItemName("");
    setCategory("meals");
    setQuantity("");
    setUrgency("medium");
    setError(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!itemName.trim()) {
      setError("Please describe the item or need.");
      return;
    }
    if (!qty || qty < 1) {
      setError("Enter a quantity of at least 1.");
      return;
    }
    createRequest({
      item_name: itemName,
      category,
      quantity_needed: qty,
      urgency,
    });
    close();
  };

  return (
    <Modal open={open} title="Post a New Need" onClose={close}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label
            htmlFor="item_name"
            className="block text-sm font-medium text-gray-700"
          >
            What do you need?
          </label>
          <input
            id="item_name"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. 50 Hot Meals for Friday"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700">
            Category
          </span>
          <div className="mt-1 grid grid-cols-3 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  category === c
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity needed
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 50"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700">
            Urgency
          </span>
          <div className="mt-1 grid grid-cols-3 gap-2">
            {URGENCIES.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUrgency(u)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium capitalize transition ${
                  urgency === u
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {URGENCY_LABEL[u]}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={close}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4" />
            Post Need
          </button>
        </div>
      </form>
    </Modal>
  );
}
