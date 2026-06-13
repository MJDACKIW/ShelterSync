"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Inbox,
  MapPin,
  PlusCircle,
} from "lucide-react";

import { useStore } from "@/lib/store";
import {
  CATEGORY_BADGE,
  CATEGORY_LABEL,
  PLEDGE_STATUS_BADGE,
  PLEDGE_STATUS_LABEL,
  URGENCY_BADGE,
  URGENCY_LABEL,
  formatDate,
} from "@/lib/ui";
import CreateRequestModal from "./CreateRequestModal";
import ProgressBar from "./ProgressBar";

export default function ShelterDashboard() {
  const {
    currentUser,
    requests,
    pledges,
    shelterById,
    userById,
    pledgedQty,
    deliveredQty,
    setPledgeStatus,
  } = useStore();

  const [createOpen, setCreateOpen] = useState(false);

  const shelterId = currentUser?.shelter_id ?? "";
  const shelter = shelterById(shelterId);

  // Requests owned by this shelter.
  const myRequests = useMemo(
    () =>
      requests
        .filter((r) => r.shelter_id === shelterId)
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1)),
    [requests, shelterId]
  );

  // Incoming pledges across this shelter's requests.
  const incoming = useMemo(() => {
    const requestIds = new Set(myRequests.map((r) => r.id));
    return pledges
      .filter((p) => requestIds.has(p.request_id))
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  }, [pledges, myRequests]);

  const awaitingReceipt = incoming.filter((p) => p.status === "dropped_off");

  const openCount = myRequests.filter((r) => r.status === "open").length;
  const fulfilledCount = myRequests.filter(
    (r) => r.status === "fulfilled"
  ).length;

  const requestById = (id: string) => requests.find((r) => r.id === id);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {shelter?.name ?? "Shelter Dashboard"}
          </h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            {shelter?.location} · {shelter?.contact_info}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4" />
          New Request
        </button>
      </header>

      {/* Stats ------------------------------------------------------------- */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Open Needs" value={openCount} tone="blue" />
        <StatCard
          label="Awaiting Receipt"
          value={awaitingReceipt.length}
          tone="amber"
        />
        <StatCard label="Fulfilled" value={fulfilledCount} tone="green" />
      </div>

      {/* Requests manager -------------------------------------------------- */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <ClipboardList className="h-5 w-5 text-blue-600" />
          Requests
        </h2>

        {myRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            No requests yet. Click “New Request” to post your first need.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Item</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Urgency</th>
                    <th className="px-4 py-3 font-medium">Progress</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myRequests.map((req) => (
                    <tr key={req.id} className="align-top">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {req.item_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(req.created_at)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_BADGE[req.category]}`}
                        >
                          {CATEGORY_LABEL[req.category]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${URGENCY_BADGE[req.urgency]}`}
                        >
                          {URGENCY_LABEL[req.urgency]}
                        </span>
                      </td>
                      <td className="w-56 px-4 py-3">
                        <ProgressBar
                          value={pledgedQty(req.id)}
                          max={req.quantity_needed}
                          unit={CATEGORY_LABEL[req.category]}
                        />
                        <p className="mt-1 text-xs text-gray-400">
                          {deliveredQty(req.id)} received
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {req.status === "fulfilled" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Fulfilled
                          </span>
                        ) : (
                          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                            Open
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900">
                      {req.item_name}
                    </p>
                    {req.status === "fulfilled" ? (
                      <span className="flex-none rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Fulfilled
                      </span>
                    ) : (
                      <span className="flex-none rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Open
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_BADGE[req.category]}`}
                    >
                      {CATEGORY_LABEL[req.category]}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${URGENCY_BADGE[req.urgency]}`}
                    >
                      {URGENCY_LABEL[req.urgency]}
                    </span>
                  </div>
                  <div className="mt-3">
                    <ProgressBar
                      value={pledgedQty(req.id)}
                      max={req.quantity_needed}
                      unit={CATEGORY_LABEL[req.category]}
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      {deliveredQty(req.id)} received
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Incoming pledges -------------------------------------------------- */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Inbox className="h-5 w-5 text-blue-600" />
          Incoming Pledges
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
            {incoming.length}
          </span>
        </h2>

        {incoming.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            No pledges yet. They&apos;ll appear here as donors commit.
          </div>
        ) : (
          <ul className="space-y-3">
            {incoming.map((pledge) => {
              const req = requestById(pledge.request_id);
              const donor = userById(pledge.donor_id);
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
                      {donor?.name ?? "A donor"} · {formatDate(pledge.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${PLEDGE_STATUS_BADGE[pledge.status]}`}
                    >
                      {PLEDGE_STATUS_LABEL[pledge.status]}
                    </span>
                    {pledge.status === "dropped_off" ? (
                      <button
                        type="button"
                        onClick={() => setPledgeStatus(pledge.id, "delivered")}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Mark Received
                      </button>
                    ) : pledge.status === "pending" ? (
                      <span className="text-xs text-gray-400">
                        In transit soon
                      </span>
                    ) : (
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

      <CreateRequestModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "blue" | "amber" | "green";
}) {
  const tones: Record<typeof tone, string> = {
    blue: "text-blue-600",
    amber: "text-amber-600",
    green: "text-green-600",
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
      <p className={`text-2xl font-bold ${tones[tone]}`}>{value}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{label}</p>
    </div>
  );
}
