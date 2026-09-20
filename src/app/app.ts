import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './core/supabase';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-mg-booking-app');
  private supabase = inject(SupabaseService);

  constructor() {
    this.supabase.client
      .from('salons')
      .select('*')
      .then(res => console.log('salons:', res));
  }
}