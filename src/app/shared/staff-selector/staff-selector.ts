import { Component, effect, inject, signal } from '@angular/core';
import { SupabaseService } from '../../core/supabase';
import { SelectionState } from '../../core/selection-state';
import { Staff } from '../../core/models';

@Component({
  selector: 'app-staff-selector',
  imports: [],
  templateUrl: './staff-selector.html',
  styleUrl: './staff-selector.css'
})
export class StaffSelector {
  private supabase = inject(SupabaseService);
  protected selectionState = inject(SelectionState);

  protected staff = signal<Staff[]>([]);
  protected loading = signal(false);
  protected error = signal<string | null>(null);

  constructor() {
    // Re-fetch whenever the selected salon changes
    effect(() => {
      const salon = this.selectionState.salon();
      if (!salon) {
        this.staff.set([]);
        return;
      }
      this.loadStaff(salon.id);
    });
  }

  private async loadStaff(salonId: string) {
    this.loading.set(true);
    const { data, error } = await this.supabase.client
      .from('staff')
      .select('*')
      .eq('salon_id', salonId)
      .order('full_name');

    if (error) {
      this.error.set(error.message);
    } else {
      this.staff.set(data ?? []);
    }
    this.loading.set(false);
  }

  onSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const staff = this.staff().find(s => s.id === select.value) ?? null;
    this.selectionState.setStaff(staff);
  }
}