-- Returns bookable start times for a given staff member, service, and date.
-- Each row is a timestamptz on a 15-minute boundary of the salon's local clock.

create or replace function get_available_slots(
  p_staff_id uuid,
  p_service_id uuid,
  p_date date
)
returns table (slot_start timestamptz)
language plpgsql
stable
as $$
declare
  v_salon_id  uuid;
  v_is_active boolean;
  v_qualified boolean;
  v_tz        text;
  v_duration  int;
  v_dow       int;
  v_opens     time;
  v_closes    time;
begin
  -- Staff must exist and be active (rule 5)
  select s.salon_id, s.is_active
    into v_salon_id, v_is_active
  from staff s
  where s.id = p_staff_id;

  if not found or not v_is_active then
    return;
  end if;

  -- Staff must be qualified for this service (rule 4)
  select exists (
    select 1 from staff_services ss
    where ss.staff_id = p_staff_id and ss.service_id = p_service_id
  ) into v_qualified;

  if not v_qualified then
    return;
  end if;

  select sal.timezone into v_tz from salons sal where sal.id = v_salon_id;
  select svc.duration_minutes into v_duration from services svc where svc.id = p_service_id;

  v_dow := extract(dow from p_date);

  -- Staff-specific hours override the salon default for that day
  select bh.opens_at, bh.closes_at
    into v_opens, v_closes
  from business_hours bh
  where bh.salon_id = v_salon_id
    and bh.staff_id = p_staff_id
    and bh.day_of_week = v_dow
  limit 1;

  if not found then
    select bh.opens_at, bh.closes_at
      into v_opens, v_closes
    from business_hours bh
    where bh.salon_id = v_salon_id
      and bh.staff_id is null
      and bh.day_of_week = v_dow
    limit 1;
  end if;

  -- No hours at all that day (e.g. Sunday, or an override with no row)
  if v_opens is null then
    return;
  end if;

  return query
  with candidates as (
    select (t)::timestamp at time zone v_tz as slot_start
    from generate_series(
      (p_date + v_opens)::timestamp,
      (p_date + v_closes)::timestamp - (v_duration || ' minutes')::interval,
      interval '15 minutes'
    ) as t
  )
  select c.slot_start
  from candidates c
  where c.slot_start > now()
    and not exists (
      select 1 from bookings b
      where b.staff_id = p_staff_id
        and b.status <> 'cancelled'
        and c.slot_start < b.ends_at
        and c.slot_start + (v_duration || ' minutes')::interval > b.starts_at
    )
    and not exists (
      select 1 from time_off t2
      where t2.staff_id = p_staff_id
        and c.slot_start < t2.ends_at
        and c.slot_start + (v_duration || ' minutes')::interval > t2.starts_at
    )
  order by c.slot_start;
end;
$$;

-- Let the browser call this function with the anon/publishable key
grant execute on function get_available_slots(uuid, uuid, date) to anon, authenticated;