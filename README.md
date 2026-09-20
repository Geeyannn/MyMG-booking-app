# MyMG Booking Slot Picker

Angular + Supabase implementation of the MyMG intern take-home.

## Node version

v22.21.0

## What's built

**Part 1 — Book a slot**: salon, staff, and service selectors (each filtered
  by the previous selection — staff by salon, services by staff qualification),
  a date picker, and a live list of bookable start times shown in the salon's
  local time zone. Clicking a time books it and refreshes the list.
  
**Part 2 — Bookings list**: a table of the selected staff member's bookings
  for the selected date, with a Cancel button that sets status to `cancelled`
  and frees the slot up again.
  
**Part 3 — Time off**: a table of the selected staff member's time off,
  with Add, Edit, and Delete, all working in the salon's local time. Adding
  or editing time off immediately removes the slots it covers from the
  available list; deleting or editing it away restores them.

All six slot-availability rules are enforced entirely inside a single Postgres function, `get_available_slots` (see `supabase/migrations/..._available_slots.sql`), so both "show me available
times" and the actual booking flow share one source of truth. A second function, `get_staff_bookings_for_date`, and a third, `save_time_off`, handle
the timezone-aware date-scoping and local-time-to-UTC conversion for Parts 2 and 3 respectively.

## What I'd do with another four hours 
note: (still would need external help in implementing in the future)

- Add real form validation on the time-off form (e.g. reject an end time
  before the start time client-side, rather than relying only on the
  database's `check (ends_at > starts_at)` constraint to surface an error).
- Add visual feedback when booking a slot or saving time off — right now the
  UI updates correctly but silently; a brief loading state or success message
  on the clicked element would make it clearer something happened.
- Add a race-condition guard on booking: two people clicking the same slot
  at nearly the same time could both succeed today, since the slot list
  isn't re-validated at insert time. 
- Write automated tests for `get_available_slots` covering each of the six
  rules individually and in combination (currently verified manually against
  seed data through Supabase Studio and the running app).
- Consider consolidating the three selector components' near-identical
  fetch/loading/error pattern into a small reusable helper, since it's
  repeated four times (salon, staff, service, and similarly in bookings/time
  off) with only the table and filter differing.
- Further visual polish (e.g. Tailwind, which is scaffolded but not used).

## What I knowingly left broken / incomplete

- No loading spinners or button-press feedback — clicking "book" or "save"
  works correctly but gives no visual confirmation beyond the list updating.
- Styling is minimal rather than a polished design.
- No client-side race-condition protection on booking (see above).
- No automated tests.

## How I used AI

I used Claude (Anthropic) throughout this project for:
- Debugging environment/setup issues (an npm install bug unrelated to this
  project, Angular CLI prompts, a broken `.gitignore`/README merge during
  `ng new`, and a couple of accidental file-edit mistakes on my end that
  broke the build).
- Designing the `get_available_slots` Postgres function together — working
  through how to combine wall-clock business hours with `timestamptz`
  bookings/time-off across time zones, and how staff-specific hours should
  override salon defaults.
- Generating the initial code for each Angular component (selectors, slot
  list, bookings list, time-off management).
- Explaining Angular concepts I was less familiar with along the way
  (signals, `effect()`, standalone component `imports`, Supabase RPC calls).

I tested every rule (1–6) against the actual seed data through Supabase
Studio and the running app before trusting the logic, not just by reading
the generated code.
