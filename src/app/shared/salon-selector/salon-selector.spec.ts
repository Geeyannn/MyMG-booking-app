import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonSelector } from './salon-selector';

describe('SalonSelector', () => {
  let component: SalonSelector;
  let fixture: ComponentFixture<SalonSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalonSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(SalonSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
