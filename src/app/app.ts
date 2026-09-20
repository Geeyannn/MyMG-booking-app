import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SalonSelector } from './shared/salon-selector/salon-selector';
import { StaffSelector } from './shared/staff-selector/staff-selector';
import { ServiceSelector } from './shared/service-selector/service-selector';
import { SlotList } from './shared/slot-list/slot-list';
import { DatePicker } from './shared/date-picker/date-picker';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SalonSelector, StaffSelector, ServiceSelector, SlotList, DatePicker],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-mg-booking-app');
}