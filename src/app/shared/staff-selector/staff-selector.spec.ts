import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffSelector } from './staff-selector';

describe('StaffSelector', () => {
  let component: StaffSelector;
  let fixture: ComponentFixture<StaffSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(StaffSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
