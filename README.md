# ShelterSync

A mobile-first web app that connects **donors** with **regional shelters** to track
donations, manage inventory, and coordinate meals — so urgent needs are met efficiently.

Built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **lucide-react**.
The database/auth layer (Supabase / PostgreSQL) is **mocked in front-end state**
(`lib/mockData.ts` → `lib/store.tsx`) so the entire UI is interactive immediately,
no backend required. State persists to `localStorage` and survives reloads.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open the app
#    http://localhost:3000
```

Other scripts: `npm run build` (production build) · `npm run start` (serve build) · `npm run lint`.

## Try it

On the landing screen choose **Log in as Donor** or **Log in as Shelter Staff**
(no password — demo mode). Use the **Profile → Reset Demo Data** button to restore
the seed data at any time.

- **Donor** (`/donor`) — browse & filter open needs by shelter, category, or urgency;
  pledge a quantity; track your pledges and mark them **Dropped Off**.
- **Shelter Staff** (`/shelter`, seeded as *Embry Rucker Community Shelter*) — post new
  needs, watch live progress bars, and mark incoming pledges as **Received**.

## Project structure

```
app/
  layout.tsx          Root layout (StoreProvider + responsive Navbar)
  page.tsx            Mocked login / logged-in home overview
  donor/page.tsx      Donor dashboard route (role-guarded)
  shelter/page.tsx    Shelter staff dashboard route (role-guarded)
  profile/page.tsx    Profile, impact stats, logout, reset
  globals.css         Tailwind + base styles
components/
  Navbar.tsx          Desktop top-bar + mobile bottom-tab nav
  DonorDashboard.tsx  Needs feed, filters, My Pledges
  ShelterDashboard.tsx Requests manager, stats, incoming pledges
  RequestCard.tsx     Donor-facing need card
  PledgeModal.tsx     Donor pledge flow
  CreateRequestModal.tsx  Staff "post a need" form
  ProgressBar.tsx     "20 / 50 Meals pledged" indicator
  Modal.tsx           Accessible modal shell
lib/
  types.ts            Domain interfaces (User, Shelter, DonationRequest, Pledge)
  mockData.ts         Seed data (3 shelters, requests, pledges)
  store.tsx           React Context store + mocked Supabase mutations
  ui.ts               Badge/label/color helpers
```

## Wiring in real Supabase later

Every mutation in `lib/store.tsx` (`createRequest`, `createPledge`,
`setPledgeStatus`) is the single place to swap the in-memory update for a
`supabase.from(...).insert()/update()` call. The `User`, `Shelter`,
`DonationRequest`, and `Pledge` interfaces in `lib/types.ts` map 1:1 to the
intended PostgreSQL tables.

> **Schema note:** `Pledge.status` extends the base `'pending' | 'delivered'` with
> an intermediate `'dropped_off'` state to model the two-sided hand-off the product
> requires (donor marks *Dropped Off* → staff confirms *Received*).
# ShelterSync
