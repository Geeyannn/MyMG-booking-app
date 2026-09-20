import { Component, effect, inject, signal } from '@angular/core';
import { SupabaseService } from '../../core/supabase';
import { SelectionState } from '../../core/selection-state';

interface BookingRow {
  id: string;
  starts_at: string;
  ends_at: string;
  customer_name: string;
  service_name: string;
  status: string;
}

@Component({
  selector: 'app-bookings-list',
  imports: [],
  templateUrl: './bookings-list.html',
  styleUrl: './bookings-list.css'
})
export class BookingsList {
  private supabase = inject(SupabaseService);
  protected selectionState = inject(SelectionState);

  protected bookings = signal<BookingRow[]>([]);
  protected loading = signal(false);
  protected error = signal<string | null>(null);
  protected cancelling = signal<string | null>(null); // id of booking being cancelled

  constructor() {
    effect(() => {
      const staff = this.selectionState.staff();
      const date = this.selectionState.date();
      this.selectionState.refreshTrigger();

      if (!staff || !date) {
        this.bookings.set([]);
        return;
      }
      this.loadBookings(staff.id, date);
    });
  }

  private async loadBookings(staffId: string, date: string) {
    this.loading.set(true);
    const { data, error } = await this.supabase.client.rpc('get_staff_bookings_for_date', {
      p_staff_id: staffId,
      p_date: date
    });

    if (error) {
      this.error.set(error.message);
    } else {
      this.bookings.set(data ?? []);
    }
    this.loading.set(false);
  }

  async cancelBooking(bookingId: string) {
    this.cancelling.set(bookingId);

    const { error } = await this.supabase.client
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) {
      this.error.set(error.message);
    } else {
      this.selectionState.triggerRefresh(); // refreshes both this table AND the slot list
    }
    this.cancelling.set(null);
  }

  formatTime(ts: string): string {
    const salon = this.selectionState.salon();
    if (!salon) return ts;
    return new Date(ts).toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: salon.timezone
    });
  }
}