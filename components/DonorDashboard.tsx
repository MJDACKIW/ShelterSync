"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Filter,
  Inbox,
  PackageCheck,
  Search,
  Truck,
} from "lucide-react";

import { useStore } from "@/lib/store";
import type { Category, DonationRequest, Urgency } from "@/lib/types";
import {
  CATEGORY_LABEL,
  PLEDGE_STATUS_BADGE,
  PLEDGE_STATUS_LABEL,
  formatDate,
} from "@/lib/ui";
import PledgeModal from "./PledgeModal";
import RequestCard from "./RequestCard";

const URGENCY_RANK: Record<Urgency, number> = { high: 0, medium: 1, low: 2 };

export default function DonorDashboard() {
  const {
    currentUser,
    requests,
    pledges,
    shelters,
    shelterById,
    setPledgeStatus,
  } = useStore();

  const [shelterFilter, setShelterFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | Category>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<"all" | Urgency>("all");
  const [search, setSearch] = useState("");
  const [activeRequest, setActiveRequest] = useState<DonationRequest | null>(
    null
  );

  // --- Needs feed (open requests across all shelters) -------------------
  const feed = useMemo(() => {
    return requests
      .filter((r) => r.status === "open")
      .filter((r) => shelterFilter === "all" || r.shelter_id === shelterFilter)
      .filter((r) => categoryFilter === "all" || r.category === categoryFilter)
      .filter((r) => urgencyFilter === "all" || r.urgency === urgencyFilter)
      .filter((r) =>
        search.trim()
          ? r.item_name.toLowerCase().includes(search.trim().toLowerCase())
          : true
      )
      .sort((a, b) => URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency]);
  }, [requests, shelterFilter, categoryFilter, urgencyFilter, search]);

  // --- This donor's pledges ---------------------------------------------
  const myPledges = useMemo(
    () =>
      pledges
        .filter((p) => p.donor_id === currentUser?.id)
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1)),
    [pledges, currentUser?.id]
  );

  const requestForPledge = (requestId: string) =>
    requests.find((r) => r.id === requestId);

  const categories: ("all" | Category)[] = [
    "all",
    "meals",
    "clothing",
    "supplies",
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Find a Need to Fill
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse urgent requests from local shelters and pledge what you can.
        </p>
      </header>

      {/* My Pledges -------------------------------------------------------- */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <PackageCheck className="h-5 w-5 text-blue-600" />
          My Pledges
        </h2>

        {myPledges.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
            You haven&apos;t made any pledges yet. Pick a need below to get
            started.
          </div>
        ) : (
          <ul className="space-y-3">
            {myPledges.map((pledge) => {
              const req = requestForPledge(pledge.request_id);
              const shelter = shelterById(req?.shelter_id);
              return (
                <li
                  key={pledge.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                      {pledge.quantity_pledged}× {req?.item_name ?? "Request"}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {shelter?.name} · Pledged {formatDate(pledge.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${PLEDGE_STATUS_BADGE[pledge.status]}`}
                    >
                      {PLEDGE_STATUS_LABEL[pledge.status]}
                    </span>

                    {pledge.status === "pending" && (
                      <button
                        type="button"
                        onClick={() =>
                          setPledgeStatus(pledge.id, "dropped_off")
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        Mark Dropped Off
                      </button>
                    )}
                    {pledge.status === "dropped_off" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
                        <Truck className="h-3.5 w-3.5" />
                        Awaiting shelter
                      </span>
                    )}
                    {pledge.status === "delivered" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Received
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Filters ----------------------------------------------------------- */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Inbox className="h-5 w-5 text-blue-600" />
          Open Needs
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
            {feed.length}
          </span>
        </h2>

        <div className="mb-4 space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search needs…"
              className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Filter className="h-3.5 w-3.5" /> Shelter
              </span>
              <select
                value={shelterFilter}
                onChange={(e) => setShelterFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All shelters</option>
                {shelters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Filter className="h-3.5 w-3.5" /> Urgency
              </span>
              <select
                value={urgencyFilter}
                onChange={(e) =>
                  setUrgencyFilter(e.target.value as "all" | Urgency)
                }
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">Any urgency</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoryFilter(c)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  categoryFilter === c
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c === "all" ? "All" : CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Feed ------------------------------------------------------------ */}
        {feed.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
            No open needs match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {feed.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onPledge={setActiveRequest}
              />
            ))}
          </div>
        )}
      </section>

      <PledgeModal
        request={activeRequest}
        onClose={() => setActiveRequest(null)}
      />
    </div>
  );
}
