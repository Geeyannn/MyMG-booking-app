import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSelector } from './service-selector';

describe('ServiceSelector', () => {
  let component: ServiceSelector;
  let fixture: ComponentFixture<ServiceSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
