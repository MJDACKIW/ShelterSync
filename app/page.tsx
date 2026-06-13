"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  HandHeart,
  HeartHandshake,
  Soup,
  Sparkles,
} from "lucide-react";

import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import { URGENCY_BADGE, URGENCY_LABEL } from "@/lib/ui";

export default function HomePage() {
  const { currentUser, loginAs, requests, shelters, pledges, hydrated } =
    useStore();
  const router = useRouter();

  const handleLogin = (role: Role) => {
    loginAs(role);
    router.push(role === "donor" ? "/donor" : "/shelter");
  };

  // Avoid a flash of the wrong UI before localStorage hydration completes.
  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-400">
        Loading ShelterSync…
      </div>
    );
  }

  // ----- Logged out: mocked login screen --------------------------------
  if (!currentUser) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center text-center">
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <HeartHandshake className="h-8 w-8" />
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          ShelterSync
        </h1>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Connecting donors with regional shelters to meet urgent needs —
          donations, inventory, and meals, all in sync.
        </p>

        <div className="mt-8 w-full space-y-3">
          <button
            type="button"
            onClick={() => handleLogin("donor")}
            className="group flex w-full items-center justify-between rounded-2xl bg-blue-600 px-5 py-4 text-left text-white shadow-sm transition hover:bg-blue-700"
          >
            <span className="flex items-center gap-3">
              <HandHeart className="h-6 w-6" />
              <span>
                <span className="block font-semibold">Log in as Donor</span>
                <span className="block text-xs text-blue-100">
                  Browse needs and pledge donations
                </span>
              </span>
            </span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={() => handleLogin("shelter_staff")}
            className="group flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left text-gray-900 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
          >
            <span className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span>
                <span className="block font-semibold">
                  Log in as Shelter Staff
                </span>
                <span className="block text-xs text-gray-500">
                  Post needs and track incoming pledges
                </span>
              </span>
            </span>
            <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Demo mode · no password required
        </p>
      </div>
    );
  }

  // ----- Logged in: home overview ---------------------------------------
  const openRequests = requests.filter((r) => r.status === "open");
  const urgent = [...openRequests]
    .filter((r) => r.urgency === "high")
    .slice(0, 3);
  const dashboardHref = currentUser.role === "donor" ? "/donor" : "/shelter";

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-600/20 sm:p-8">
        <p className="flex items-center gap-2 text-sm font-medium text-blue-100">
          <Sparkles className="h-4 w-4" />
          Welcome back
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          {currentUser.name}
        </h1>
        <p className="mt-2 max-w-md text-sm text-blue-100">
          {currentUser.role === "donor"
            ? "Thank you for showing up for your community. Here's where help is needed most right now."
            : "Here's a snapshot of community needs. Post requests and track pledges from your dashboard."}
        </p>
        <Link
          href={dashboardHref}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-3 gap-3">
        <Stat label="Open Needs" value={openRequests.length} />
        <Stat label="Shelters" value={shelters.length} />
        <Stat label="Total Pledges" value={pledges.length} />
      </section>

      {/* Urgent needs preview */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Soup className="h-5 w-5 text-blue-600" />
            Most Urgent
          </h2>
          <Link
            href={dashboardHref}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        {urgent.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
            No high-urgency needs right now. 🎉
          </p>
        ) : (
          <ul className="space-y-3">
            {urgent.map((req) => {
              const shelter = shelters.find((s) => s.id === req.shelter_id);
              return (
                <li
                  key={req.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                      {req.item_name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {shelter?.name} · needs {req.quantity_needed}
                    </p>
                  </div>
                  <span
                    className={`flex-none rounded-full px-2.5 py-1 text-xs font-medium ${URGENCY_BADGE[req.urgency]}`}
                  >
                    {URGENCY_LABEL[req.urgency]}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{label}</p>
    </div>
  );
}
