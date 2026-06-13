"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import ShelterDashboard from "@/components/ShelterDashboard";
import { useStore } from "@/lib/store";

export default function ShelterPage() {
  const { currentUser, hydrated } = useStore();
  const router = useRouter();

  // Only signed-in shelter staff may view this dashboard.
  useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) {
      router.replace("/");
    } else if (currentUser.role !== "shelter_staff") {
      router.replace("/donor");
    }
  }, [hydrated, currentUser, router]);

  if (!hydrated || !currentUser || currentUser.role !== "shelter_staff") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-400">
        Loading…
      </div>
    );
  }

  return <ShelterDashboard />;
}
