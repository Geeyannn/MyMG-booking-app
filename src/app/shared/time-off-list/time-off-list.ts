import { Component, effect, inject, signal } from '@angular/core';
import { SupabaseService } from '../../core/supabase';
import { SelectionState } from '../../core/selection-state';
import { TimeOff } from '../../core/models';

@Component({
  selector: 'app-time-off-list',
  imports: [],
  templateUrl: './time-off-list.html',
  styleUrl: './time-off-list.css'
})
export class TimeOffList {
  private supabase = inject(SupabaseService);
  protected selectionState = inject(SelectionState);

  protected timeOffs = signal<TimeOff[]>([]);
  protected loading = signal(false);
  protected error = signal<string | null>(null);
  protected saving = signal(false);

  // Form state: null means "not editing/adding right now"
  protected editingId = signal<string | null>(null); // null id = new entry being added
  protected showForm = signal(false);
  protected formDate = signal('');
  protected formStart = signal('');
  protected formEnd = signal('');
  protected formReason = signal('');

  constructor() {
    effect(() => {
      const staff = this.selectionState.staff();
      this.selectionState.refreshTrigger();

      if (!staff) {
        this.timeOffs.set([]);
        return;
      }
      this.loadTimeOff(staff.id);
    });
  }

  private async loadTimeOff(staffId: string) {
    this.loading.set(true);
    const { data, error } = await this.supabase.client
      .from('time_off')
      .select('*')
      .eq('staff_id', staffId)
      .order('starts_at');

    if (error) {
      this.error.set(error.message);
    } else {
      this.timeOffs.set(data ?? []);
    }
    this.loading.set(false);
  }

  // --- Display formatting (salon-local time, read-only) ---

  formatDate(ts: string): string {
    const salon = this.selectionState.salon();
    if (!salon) return ts;
    return new Date(ts).toLocaleDateString('en-AU', { timeZone: salon.timezone });
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

  // --- Form handling ---

  openAddForm() {
    this.editingId.set(null);
    this.formDate.set(this.selectionState.date());
    this.formStart.set('09:00');
    this.formEnd.set('10:00');
    this.formReason.set('');
    this.showForm.set(true);
  }

  openEditForm(row: TimeOff) {
    const salon = this.selectionState.salon();
    if (!salon) return;

    // Convert the stored timestamptz back into local date/time strings
    // for the <input type="date"> and <input type="time"> fields.
    const dateFmt = new Intl.DateTimeFormat('en-CA', { timeZone: salon.timezone }); // YYYY-MM-DD
    const timeFmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: salon.timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }); // HH:mm

    const start = new Date(row.starts_at);
    const end = new Date(row.ends_at);

    this.editingId.set(row.id);
    this.formDate.set(dateFmt.format(start));
    this.formStart.set(timeFmt.format(start));
    this.formEnd.set(timeFmt.format(end));
    this.formReason.set(row.reason ?? '');
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
  }

  async saveForm() {
    const staff = this.selectionState.staff();
    if (!staff) return;

    this.saving.set(true);
    this.error.set(null);

    try {
      const { error } = await this.supabase.client.rpc('save_time_off', {
        p_id: this.editingId(),
        p_staff_id: staff.id,
        p_date: this.formDate(),
        p_start_time: this.formStart(),
        p_end_time: this.formEnd(),
        p_reason: this.formReason() || null
      });

      if (error) {
        this.error.set(error.message);
      } else {
        this.showForm.set(false);
        this.selectionState.triggerRefresh(); // reloads this table AND the slot list
      }
    } catch (err: any) {
      this.error.set(err?.message ?? 'Something went wrong saving this time off.');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteTimeOff(id: string) {
    this.saving.set(true);
    const { error } = await this.supabase.client.from('time_off').delete().eq('id', id);

    if (error) {
      this.error.set(error.message);
    } else {
      this.selectionState.triggerRefresh();
    }
    this.saving.set(false);
  }
}