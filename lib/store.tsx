"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEMO_DONOR,
  DEMO_STAFF,
  donationRequests as seedRequests,
  pledges as seedPledges,
  shelters as seedShelters,
  users as seedUsers,
} from "./mockData";
import type {
  Category,
  DonationRequest,
  Pledge,
  PledgeStatus,
  Role,
  Shelter,
  Urgency,
  User,
} from "./types";

// ---------------------------------------------------------------------------
// In-memory application store. Every mutation below is the place a real
// Supabase call would live, e.g.
//   await supabase.from("pledges").insert({ ... })
// For this build we mutate React state directly and persist to localStorage so
// the prototype survives reloads.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "sheltersync:v1";

interface NewRequestInput {
  item_name: string;
  category: Category;
  quantity_needed: number;
  urgency: Urgency;
}

interface StoreValue {
  // data
  currentUser: User | null;
  users: User[];
  shelters: Shelter[];
  requests: DonationRequest[];
  pledges: Pledge[];
  hydrated: boolean;

  // auth (mocked)
  loginAs: (role: Role) => void;
  logout: () => void;

  // mutations
  createRequest: (input: NewRequestInput) => void;
  createPledge: (requestId: string, quantity: number) => void;
  setPledgeStatus: (pledgeId: string, status: PledgeStatus) => void;
  resetDemo: () => void;

  // lookups / derived helpers
  shelterById: (id: string | null | undefined) => Shelter | undefined;
  userById: (id: string) => User | undefined;
  pledgedQty: (requestId: string) => number;
  deliveredQty: (requestId: string) => number;
  pledgesForRequest: (requestId: string) => Pledge[];
}

const StoreContext = createContext<StoreValue | null>(null);

let idCounter = 0;
function uid(prefix: string): string {
  idCounter += 1;
  // Unique across sessions: only ever called from event handlers (never during
  // render/SSR), so Date.now() is safe and avoids id collisions after reloads.
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

function sum(items: Pledge[]): number {
  return items.reduce((total, p) => total + p.quantity_pledged, 0);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<DonationRequest[]>(seedRequests);
  const [pledges, setPledges] = useState<Pledge[]>(seedPledges);
  const [hydrated, setHydrated] = useState(false);

  // Shelters + users are static reference data for this prototype.
  const shelters = seedShelters;
  const users = seedUsers;

  // --- Hydrate persisted state on first mount (client only) --------------
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as {
          currentUser?: User | null;
          requests?: DonationRequest[];
          pledges?: Pledge[];
        };
        if (data.currentUser !== undefined) setCurrentUser(data.currentUser);
        if (Array.isArray(data.requests)) setRequests(data.requests);
        if (Array.isArray(data.pledges)) setPledges(data.pledges);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // --- Persist on change --------------------------------------------------
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currentUser, requests, pledges })
      );
    } catch {
      /* storage may be unavailable (private mode) — non-fatal */
    }
  }, [hydrated, currentUser, requests, pledges]);

  // --- Keep request.status in sync with delivered pledges ----------------
  // A request is "fulfilled" once received (delivered) quantity meets the need.
  useEffect(() => {
    setRequests((prev) => {
      let changed = false;
      const next = prev.map((req) => {
        const delivered = sum(
          pledges.filter(
            (p) => p.request_id === req.id && p.status === "delivered"
          )
        );
        const status = delivered >= req.quantity_needed ? "fulfilled" : "open";
        if (status !== req.status) {
          changed = true;
          return { ...req, status };
        }
        return req;
      });
      return changed ? next : prev;
    });
  }, [pledges]);

  // --- Auth (mocked) ------------------------------------------------------
  const loginAs = useCallback((role: Role) => {
    setCurrentUser(role === "donor" ? DEMO_DONOR : DEMO_STAFF);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // --- Mutations ----------------------------------------------------------
  const createRequest = useCallback(
    (input: NewRequestInput) => {
      if (!currentUser?.shelter_id) return;
      const req: DonationRequest = {
        id: uid("req"),
        shelter_id: currentUser.shelter_id,
        item_name: input.item_name.trim(),
        category: input.category,
        quantity_needed: Math.max(1, Math.round(input.quantity_needed)),
        urgency: input.urgency,
        status: "open",
        created_at: new Date().toISOString(),
      };
      setRequests((prev) => [req, ...prev]);
    },
    [currentUser]
  );

  const createPledge = useCallback(
    (requestId: string, quantity: number) => {
      if (!currentUser) return;
      const qty = Math.max(1, Math.round(quantity));
      const pledge: Pledge = {
        id: uid("pl"),
        request_id: requestId,
        donor_id: currentUser.id,
        quantity_pledged: qty,
        status: "pending",
        created_at: new Date().toISOString(),
      };
      setPledges((prev) => [pledge, ...prev]);
    },
    [currentUser]
  );

  const setPledgeStatus = useCallback(
    (pledgeId: string, status: PledgeStatus) => {
      setPledges((prev) =>
        prev.map((p) => (p.id === pledgeId ? { ...p, status } : p))
      );
    },
    []
  );

  const resetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setRequests(seedRequests);
    setPledges(seedPledges);
    setCurrentUser(null);
  }, []);

  // --- Lookups / derived --------------------------------------------------
  const shelterById = useCallback(
    (id: string | null | undefined) => shelters.find((s) => s.id === id),
    [shelters]
  );

  const userById = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users]
  );

  const pledgesForRequest = useCallback(
    (requestId: string) => pledges.filter((p) => p.request_id === requestId),
    [pledges]
  );

  const pledgedQty = useCallback(
    (requestId: string) => sum(pledges.filter((p) => p.request_id === requestId)),
    [pledges]
  );

  const deliveredQty = useCallback(
    (requestId: string) =>
      sum(
        pledges.filter(
          (p) => p.request_id === requestId && p.status === "delivered"
        )
      ),
    [pledges]
  );

  const value = useMemo<StoreValue>(
    () => ({
      currentUser,
      users,
      shelters,
      requests,
      pledges,
      hydrated,
      loginAs,
      logout,
      createRequest,
      createPledge,
      setPledgeStatus,
      resetDemo,
      shelterById,
      userById,
      pledgedQty,
      deliveredQty,
      pledgesForRequest,
    }),
    [
      currentUser,
      users,
      shelters,
      requests,
      pledges,
      hydrated,
      loginAs,
      logout,
      createRequest,
      createPledge,
      setPledgeStatus,
      resetDemo,
      shelterById,
      userById,
      pledgedQty,
      deliveredQty,
      pledgesForRequest,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within a <StoreProvider>");
  }
  return ctx;
}
