import { Component, inject } from '@angular/core';
import { SelectionState } from '../../core/selection-state';

@Component({
  selector: 'app-date-picker',
  imports: [],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css'
})
export class DatePicker {
  protected selectionState = inject(SelectionState);

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectionState.setDate(input.value);
  }
}