import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOffList } from './time-off-list';

describe('TimeOffList', () => {
  let component: TimeOffList;
  let fixture: ComponentFixture<TimeOffList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeOffList],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeOffList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
