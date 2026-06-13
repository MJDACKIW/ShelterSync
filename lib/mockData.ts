import type {
  DonationRequest,
  Pledge,
  Shelter,
  User,
} from "./types";

// ---------------------------------------------------------------------------
// Mock dataset. In production these rows live in Supabase; here they seed the
// in-memory store (lib/store.tsx). All ids are stable strings so relationships
// resolve deterministically and there are no SSR/client hydration mismatches.
// ---------------------------------------------------------------------------

export const shelters: Shelter[] = [
  {
    id: "s-embry",
    name: "Embry Rucker Community Shelter",
    location: "Reston, VA",
    contact_info: "(703) 555-0142 · intake@embryrucker.org",
  },
  {
    id: "s-newhope",
    name: "New Hope Housing",
    location: "Alexandria, VA",
    contact_info: "(703) 555-0198 · donations@newhopehousing.org",
  },
  {
    id: "s-shelterhouse",
    name: "Shelter House",
    location: "Fairfax, VA",
    contact_info: "(571) 555-0123 · help@shelterhouse.org",
  },
];

export const users: User[] = [
  {
    id: "u-donor",
    name: "Alex Donor",
    email: "alex@example.com",
    role: "donor",
    shelter_id: null,
  },
  {
    id: "u-donor2",
    name: "Jordan Lee",
    email: "jordan@example.com",
    role: "donor",
    shelter_id: null,
  },
  {
    id: "u-staff",
    name: "Sam Rivera",
    email: "sam@embryrucker.org",
    role: "shelter_staff",
    shelter_id: "s-embry",
  },
];

// Convenience handles for the mocked "Log in as…" buttons.
export const DEMO_DONOR: User = users[0];
export const DEMO_STAFF: User = users[2];

export const donationRequests: DonationRequest[] = [
  {
    id: "req-1",
    shelter_id: "s-embry",
    item_name: "Hot Meals for Friday Dinner",
    category: "meals",
    quantity_needed: 50,
    urgency: "high",
    status: "open",
    created_at: "2026-06-08T14:00:00.000Z",
  },
  {
    id: "req-2",
    shelter_id: "s-embry",
    item_name: "Winter Coats (Adult M / L)",
    category: "clothing",
    quantity_needed: 40,
    urgency: "medium",
    status: "open",
    created_at: "2026-06-07T16:30:00.000Z",
  },
  {
    id: "req-3",
    shelter_id: "s-embry",
    item_name: "Toiletry & Hygiene Kits",
    category: "supplies",
    quantity_needed: 100,
    urgency: "low",
    status: "open",
    created_at: "2026-06-05T09:15:00.000Z",
  },
  {
    id: "req-4",
    shelter_id: "s-newhope",
    item_name: "Breakfast Sandwiches",
    category: "meals",
    quantity_needed: 30,
    urgency: "high",
    status: "open",
    created_at: "2026-06-09T11:45:00.000Z",
  },
  {
    id: "req-5",
    shelter_id: "s-newhope",
    item_name: "Children's Shoes (sizes 10-3)",
    category: "clothing",
    quantity_needed: 25,
    urgency: "medium",
    status: "open",
    created_at: "2026-06-06T13:20:00.000Z",
  },
  {
    id: "req-6",
    shelter_id: "s-newhope",
    item_name: "Diapers (Size 4)",
    category: "supplies",
    quantity_needed: 60,
    urgency: "high",
    status: "open",
    created_at: "2026-06-08T08:05:00.000Z",
  },
  {
    id: "req-7",
    shelter_id: "s-shelterhouse",
    item_name: "Bagged Lunches",
    category: "meals",
    quantity_needed: 80,
    urgency: "medium",
    status: "open",
    created_at: "2026-06-04T10:00:00.000Z",
  },
  {
    id: "req-8",
    shelter_id: "s-shelterhouse",
    item_name: "Warm Blankets",
    category: "supplies",
    quantity_needed: 35,
    urgency: "high",
    status: "open",
    created_at: "2026-06-07T19:10:00.000Z",
  },
  {
    id: "req-9",
    shelter_id: "s-shelterhouse",
    item_name: "Women's Rain Jackets",
    category: "clothing",
    quantity_needed: 20,
    urgency: "low",
    status: "open",
    created_at: "2026-06-03T12:30:00.000Z",
  },
];

export const pledges: Pledge[] = [
  {
    id: "pl-1",
    request_id: "req-1",
    donor_id: "u-donor",
    quantity_pledged: 20,
    status: "pending",
    created_at: "2026-06-09T15:00:00.000Z",
  },
  {
    id: "pl-2",
    request_id: "req-1",
    donor_id: "u-donor2",
    quantity_pledged: 15,
    status: "dropped_off",
    created_at: "2026-06-10T09:30:00.000Z",
  },
  {
    id: "pl-3",
    request_id: "req-2",
    donor_id: "u-donor2",
    quantity_pledged: 10,
    status: "dropped_off",
    created_at: "2026-06-10T10:00:00.000Z",
  },
  {
    id: "pl-4",
    request_id: "req-7",
    donor_id: "u-donor",
    quantity_pledged: 15,
    status: "dropped_off",
    created_at: "2026-06-08T17:45:00.000Z",
  },
  {
    id: "pl-5",
    request_id: "req-6",
    donor_id: "u-donor2",
    quantity_pledged: 30,
    status: "delivered",
    created_at: "2026-06-09T14:20:00.000Z",
  },
];
