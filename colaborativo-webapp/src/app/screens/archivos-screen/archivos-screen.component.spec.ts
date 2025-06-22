import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosScreenComponent } from './archivos-screen.component';

describe('ArchivosScreenComponent', () => {
  let component: ArchivosScreenComponent;
  let fixture: ComponentFixture<ArchivosScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivosScreenComponent]
    });
    fixture = TestBed.createComponent(ArchivosScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
