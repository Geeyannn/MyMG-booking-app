import { Injectable, signal } from '@angular/core';
import { Salon, Staff, Service } from './models';

@Injectable({
  providedIn: 'root'
})
export class SelectionState {
  readonly salon = signal<Salon | null>(null);
  readonly staff = signal<Staff | null>(null);
  readonly service = signal<Service | null>(null);
  readonly date = signal<string>(new Date().toISOString().slice(0, 10)); // 'YYYY-MM-DD'
  readonly refreshTrigger = signal(0);

  setSalon(salon: Salon | null) {
    this.salon.set(salon);
    // Changing salon invalidates staff/service, since they belong to a salon
    this.staff.set(null);
    this.service.set(null);
  }

  setStaff(staff: Staff | null) {
    this.staff.set(staff);
  }

  setService(service: Service | null) {
    this.service.set(service);
  }

  setDate(date: string) {
    this.date.set(date);
  }

  triggerRefresh() {
  this.refreshTrigger.update(v => v + 1);
  }
}