export interface Salon {
  id: string;
  name: string;
  timezone: string;
}

export interface Staff {
  id: string;
  salon_id: string;
  full_name: string;
  is_active: boolean;
}

export interface Service {
  id: string;
  salon_id: string;
  name: string;
  duration_minutes: number;
  price_cents: number;
}

export interface Booking {
  id: string;
  salon_id: string;
  staff_id: string;
  service_id: string;
  customer_name: string;
  starts_at: string;   // ISO timestamptz string
  ends_at: string;
  status: 'confirmed' | 'cancelled' | 'no_show';
}

export interface TimeOff {
  id: string;
  staff_id: string;
  starts_at: string;
  ends_at: string;
  reason: string | null;
}