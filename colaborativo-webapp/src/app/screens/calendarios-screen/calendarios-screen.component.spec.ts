import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendariosScreenComponent } from './calendarios-screen.component';

describe('CalendariosScreenComponent', () => {
  let component: CalendariosScreenComponent;
  let fixture: ComponentFixture<CalendariosScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendariosScreenComponent]
    });
    fixture = TestBed.createComponent(CalendariosScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
