import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SalonSelector } from './shared/salon-selector/salon-selector';
import { StaffSelector } from './shared/staff-selector/staff-selector';
import { ServiceSelector } from './shared/service-selector/service-selector';
import { DatePicker } from './shared/date-picker/date-picker';
import { SlotList } from './shared/slot-list/slot-list';
import { BookingsList } from './shared/bookings-list/bookings-list';
import { TimeOffList } from './shared/time-off-list/time-off-list';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SalonSelector,
    StaffSelector,
    ServiceSelector,
    DatePicker,
    SlotList,
    BookingsList,
    TimeOffList
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-mg-booking-app');
}