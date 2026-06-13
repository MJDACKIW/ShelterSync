"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import DonorDashboard from "@/components/DonorDashboard";
import { useStore } from "@/lib/store";

export default function DonorPage() {
  const { currentUser, hydrated } = useStore();
  const router = useRouter();

  // Redirect users who aren't signed-in donors back to the appropriate screen.
  useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) {
      router.replace("/");
    } else if (currentUser.role !== "donor") {
      router.replace("/shelter");
    }
  }, [hydrated, currentUser, router]);

  if (!hydrated || !currentUser || currentUser.role !== "donor") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-400">
        Loading…
      </div>
    );
  }

  return <DonorDashboard />;
}
