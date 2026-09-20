import { Component, OnInit, inject, signal } from '@angular/core';
import { SupabaseService } from '../../core/supabase';
import { SelectionState } from '../../core/selection-state';
import { Salon } from '../../core/models';

@Component({
  selector: 'app-salon-selector',
  imports: [],
  templateUrl: './salon-selector.html',
  styleUrl: './salon-selector.css'
})
export class SalonSelector implements OnInit {
  private supabase = inject(SupabaseService);
  protected selectionState = inject(SelectionState);

  protected salons = signal<Salon[]>([]);
  protected loading = signal(true);
  protected error = signal<string | null>(null);

  async ngOnInit() {
    const { data, error } = await this.supabase.client
      .from('salons')
      .select('*')
      .order('name');

    if (error) {
      this.error.set(error.message);
    } else {
      this.salons.set(data ?? []);
    }
    this.loading.set(false);
  }

  onSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const salon = this.salons().find(s => s.id === select.value) ?? null;
    this.selectionState.setSalon(salon);
  }
}