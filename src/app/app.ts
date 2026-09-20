import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SalonSelector } from './shared/salon-selector/salon-selector';
import { StaffSelector } from './shared/staff-selector/staff-selector';
import { ServiceSelector } from './shared/service-selector/service-selector';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SalonSelector, StaffSelector, ServiceSelector],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-mg-booking-app');
}