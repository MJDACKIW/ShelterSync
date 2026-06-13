"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  HandHeart,
  LogOut,
  Mail,
  MapPin,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import { useStore } from "@/lib/store";

export default function ProfilePage() {
  const {
    currentUser,
    hydrated,
    shelterById,
    logout,
    resetDemo,
    requests,
    pledges,
    deliveredQty,
  } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !currentUser) router.replace("/");
  }, [hydrated, currentUser, router]);

  if (!hydrated || !currentUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-400">
        Loading…
      </div>
    );
  }

  const isDonor = currentUser.role === "donor";
  const shelter = shelterById(currentUser.shelter_id);

  // Role-specific stats.
  const myPledges = pledges.filter((p) => p.donor_id === currentUser.id);
  const itemsPledged = myPledges.reduce(
    (sum, p) => sum + p.quantity_pledged,
    0
  );
  const itemsDelivered = myPledges
    .filter((p) => p.status === "delivered")
    .reduce((sum, p) => sum + p.quantity_pledged, 0);

  const shelterRequests = requests.filter(
    (r) => r.shelter_id === currentUser.shelter_id
  );
  const shelterReceived = shelterRequests.reduce(
    (sum, r) => sum + deliveredQty(r.id),
    0
  );

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleReset = () => {
    resetDemo();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Profile
      </h1>

      {/* Identity card */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
            {currentUser.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-gray-900">
              {currentUser.name}
            </h2>
            <p className="flex items-center gap-1.5 text-sm text-gray-500">
              <Mail className="h-3.5 w-3.5" />
              {currentUser.email}
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {isDonor ? (
                <HandHeart className="h-3.5 w-3.5" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5" />
              )}
              {isDonor ? "Donor" : "Shelter Staff"}
            </span>
          </div>
        </div>

        {!isDonor && shelter && (
          <div className="mt-5 rounded-2xl bg-gray-50 p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <Building2 className="h-4 w-4 text-blue-600" />
              {shelter.name}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              {shelter.location} · {shelter.contact_info}
            </p>
          </div>
        )}
      </section>

      {/* Impact stats */}
      <section className="grid grid-cols-2 gap-3">
        {isDonor ? (
          <>
            <ProfileStat label="Pledges Made" value={myPledges.length} />
            <ProfileStat label="Items Pledged" value={itemsPledged} />
            <ProfileStat label="Items Delivered" value={itemsDelivered} />
            <ProfileStat
              label="Active"
              value={
                myPledges.filter((p) => p.status !== "delivered").length
              }
            />
          </>
        ) : (
          <>
            <ProfileStat label="Requests Posted" value={shelterRequests.length} />
            <ProfileStat
              label="Open"
              value={
                shelterRequests.filter((r) => r.status === "open").length
              }
            />
            <ProfileStat
              label="Fulfilled"
              value={
                shelterRequests.filter((r) => r.status === "fulfilled").length
              }
            />
            <ProfileStat label="Items Received" value={shelterReceived} />
          </>
        )}
      </section>

      {/* Actions */}
      <section className="space-y-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:text-red-600"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Demo Data
        </button>
      </section>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{label}</p>
    </div>
  );
}
