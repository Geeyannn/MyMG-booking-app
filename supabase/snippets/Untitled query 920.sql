select * from get_available_slots(
  'aaaaaaa1-0000-0000-0000-000000000002',  -- Josh Petrov
  'ccccccc3-0000-0000-0000-000000000001',  -- Fringe Trim (15 min)
  (date_trunc('week', now() at time zone 'Australia/Brisbane')::date + 9)  -- next Wednesday
);