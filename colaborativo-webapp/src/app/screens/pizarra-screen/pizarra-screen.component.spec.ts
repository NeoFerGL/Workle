import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PizarraScreenComponent } from './pizarra-screen.component';

describe('PizarraScreenComponent', () => {
  let component: PizarraScreenComponent;
  let fixture: ComponentFixture<PizarraScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PizarraScreenComponent]
    });
    fixture = TestBed.createComponent(PizarraScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
