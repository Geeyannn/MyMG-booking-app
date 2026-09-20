import { Component, effect, inject, signal } from '@angular/core';
import { SupabaseService } from '../../core/supabase';
import { SelectionState } from '../../core/selection-state';
import { Service } from '../../core/models';

@Component({
  selector: 'app-service-selector',
  imports: [],
  templateUrl: './service-selector.html',
  styleUrl: './service-selector.css'
})
export class ServiceSelector {
  private supabase = inject(SupabaseService);
  protected selectionState = inject(SelectionState);

  protected services = signal<Service[]>([]);
  protected loading = signal(false);
  protected error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const staff = this.selectionState.staff();
      if (!staff) {
        this.services.set([]);
        return;
      }
      this.loadServices(staff.id);
    });
  }

  private async loadServices(staffId: string) {
    this.loading.set(true);

    // staff_services is a join table with no columns of its own beyond the
    // two foreign keys, so we ask Supabase to pull the related services row
    // through it in one query rather than doing two round trips.
    const { data, error } = await this.supabase.client
      .from('staff_services')
      .select('services(*)')
      .eq('staff_id', staffId);

    if (error) {
      this.error.set(error.message);
    } else {
      // data looks like [{ services: {...} }, { services: {...} }]
      const services = (data ?? [])
        .map((row: any) => row.services as Service)
        .sort((a, b) => a.name.localeCompare(b.name));
      this.services.set(services);
    }
    this.loading.set(false);
  }

  onSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const service = this.services().find(s => s.id === select.value) ?? null;
    this.selectionState.setService(service);
  }
}