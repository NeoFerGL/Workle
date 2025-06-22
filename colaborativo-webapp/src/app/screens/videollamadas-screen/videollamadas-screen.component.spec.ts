import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideollamadasScreenComponent } from './videollamadas-screen.component';

describe('VideollamadasScreenComponent', () => {
  let component: VideollamadasScreenComponent;
  let fixture: ComponentFixture<VideollamadasScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideollamadasScreenComponent]
    });
    fixture = TestBed.createComponent(VideollamadasScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
