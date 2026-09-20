import { Component, effect, inject, signal } from '@angular/core';
import { SupabaseService } from '../../core/supabase';
import { SelectionState } from '../../core/selection-state';

@Component({
  selector: 'app-slot-list',
  imports: [],
  templateUrl: './slot-list.html',
  styleUrl: './slot-list.css'
})
export class SlotList {
  private supabase = inject(SupabaseService);
  protected selectionState = inject(SelectionState);

  protected slots = signal<string[]>([]);
  protected loading = signal(false);
  protected error = signal<string | null>(null);
  protected booking = signal(false);

  constructor() {
    effect(() => {
      const staff = this.selectionState.staff();
      const service = this.selectionState.service();
      const date = this.selectionState.date();
      this.selectionState.refreshTrigger();

      if (!staff || !service || !date) {
        this.slots.set([]);
        return;
      }
      this.loadSlots(staff.id, service.id, date);
    });
  }

  private async loadSlots(staffId: string, serviceId: string, date: string) {
    this.loading.set(true);
    this.error.set(null);

    const { data, error } = await this.supabase.client.rpc('get_available_slots', {
      p_staff_id: staffId,
      p_service_id: serviceId,
      p_date: date
    });

    if (error) {
      this.error.set(error.message);
    } else {
      this.slots.set((data ?? []).map((row: any) => row.slot_start));
    }
    this.loading.set(false);
  }

  async bookSlot(slotStart: string) {
    const staff = this.selectionState.staff();
    const service = this.selectionState.service();
    if (!staff || !service) return;

    this.booking.set(true);
    this.error.set(null);

    try {
      const startDate = new Date(slotStart);
      const endDate = new Date(startDate.getTime() + service.duration_minutes * 60_000);

      const { error } = await this.supabase.client.from('bookings').insert({
        salon_id: staff.salon_id,
        staff_id: staff.id,
        service_id: service.id,
        customer_name: 'Walk-in Customer',
        starts_at: startDate.toISOString(),
        ends_at: endDate.toISOString(),
        status: 'confirmed'
      });

      if (error) {
        this.error.set(error.message);
      } else {
        this.selectionState.triggerRefresh();
      }
    } catch (err: any) {
      this.error.set(err?.message ?? 'Something went wrong booking this slot.');
    } finally {
      this.booking.set(false);
    }
  }

  formatSlot(slotStart: string): string {
    const salon = this.selectionState.salon();
    if (!salon) return slotStart;

    return new Date(slotStart).toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: salon.timezone
    });
  }
}