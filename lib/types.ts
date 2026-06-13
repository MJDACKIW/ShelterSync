// ---------------------------------------------------------------------------
// ShelterSync — domain model
// These interfaces mirror the Supabase (PostgreSQL) schema. For this build they
// are populated from lib/mockData.ts and mutated in lib/store.tsx so the UI is
// fully interactive without a live backend.
// ---------------------------------------------------------------------------

export type Role = "donor" | "shelter_staff";

export type Category = "meals" | "clothing" | "supplies";

export type Urgency = "low" | "medium" | "high";

export type RequestStatus = "open" | "fulfilled";

/**
 * Pledge lifecycle.
 * The base schema specifies 'pending' | 'delivered'. We add an intermediate
 * 'dropped_off' state so we can model the two-sided hand-off the product
 * requires: the donor marks a pledge "Dropped Off", and shelter staff then
 * confirm it as "Received" (delivered). 'delivered' === received by shelter.
 */
export type PledgeStatus = "pending" | "dropped_off" | "delivered";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  shelter_id: string | null;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  contact_info: string;
}

export interface DonationRequest {
  id: string;
  shelter_id: string;
  item_name: string;
  category: Category;
  quantity_needed: number;
  urgency: Urgency;
  status: RequestStatus;
  created_at: string;
}

export interface Pledge {
  id: string;
  request_id: string;
  donor_id: string;
  quantity_pledged: number;
  status: PledgeStatus;
  created_at: string;
}
