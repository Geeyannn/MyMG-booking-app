-- Creates or updates a time_off row from LOCAL date/start/end values,
-- converting them to timestamptz using the staff member's salon timezone.
-- Pass p_id = null to insert a new row; pass an existing id to update it.

create or replace function save_time_off(
  p_id uuid,
  p_staff_id uuid,
  p_date date,
  p_start_time time,
  p_end_time time,
  p_reason text
)
returns time_off
language plpgsql
as $$
declare
  v_tz      text;
  v_starts  timestamptz;
  v_ends    timestamptz;
  v_row     time_off;
begin
  select sal.timezone into v_tz
  from staff st
  join salons sal on sal.id = st.salon_id
  where st.id = p_staff_id;

  v_starts := (p_date + p_start_time)::timestamp at time zone v_tz;
  v_ends   := (p_date + p_end_time)::timestamp at time zone v_tz;

  if p_id is null then
    insert into time_off (staff_id, starts_at, ends_at, reason)
    values (p_staff_id, v_starts, v_ends, p_reason)
    returning * into v_row;
  else
    update time_off
    set starts_at = v_starts,
        ends_at = v_ends,
        reason = p_reason
    where id = p_id
    returning * into v_row;
  end if;

  return v_row;
end;
$$;

grant execute on function save_time_off(uuid, uuid, date, time, time, text) to anon, authenticated;