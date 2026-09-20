-- Returns a staff member's bookings on a given LOCAL calendar date
-- (using the salon's timezone), joined with the service name for display.

create or replace function get_staff_bookings_for_date(
  p_staff_id uuid,
  p_date date
)
returns table (
  id uuid,
  starts_at timestamptz,
  ends_at timestamptz,
  customer_name text,
  service_name text,
  status text
)
language sql
stable
as $$
  select b.id, b.starts_at, b.ends_at, b.customer_name, s.name as service_name, b.status
  from bookings b
  join services s on s.id = b.service_id
  join staff st on st.id = b.staff_id
  join salons sal on sal.id = st.salon_id
  where b.staff_id = p_staff_id
    and (b.starts_at at time zone sal.timezone)::date = p_date
  order by b.starts_at;
$$;

grant execute on function get_staff_bookings_for_date(uuid, date) to anon, authenticated;