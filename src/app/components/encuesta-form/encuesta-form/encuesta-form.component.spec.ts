import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaFormComponent } from '../encuesta-form/encuesta-form.component';

describe('EncuestaFormComponent', () => {
  let component: EncuestaFormComponent;
  let fixture: ComponentFixture<EncuestaFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncuestaFormComponent]
    });
    fixture = TestBed.createComponent(EncuestaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
