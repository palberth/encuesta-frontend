import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncuestaListComponent } from './encuesta-list.component';
import { EncuestaService } from '../../../services/encuesta.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { of, throwError } from 'rxjs';

describe('EncuestaListComponent', () => {
  let component: EncuestaListComponent;
  let fixture: ComponentFixture<EncuestaListComponent>;
  let encuestaService: EncuestaService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EncuestaListComponent],
      imports: [
        HttpClientTestingModule,
        TableModule,
        ToastModule,
        ConfirmDialogModule
      ],
      providers: [
        EncuestaService,
        { provide: Router, useValue: { navigate: jest.fn() } },
        ConfirmationService,
        MessageService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EncuestaListComponent);
    component = fixture.componentInstance;
    encuestaService = TestBed.inject(EncuestaService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load encuestas on init', () => {
    const mockData = [{ id: 1, paisResidencia: 'Colombia' }];
    jest.spyOn(encuestaService, 'getAllEncuestas').mockReturnValue(of(mockData));
    
    component.ngOnInit();
    
    expect(component.encuestas).toEqual(mockData);
    expect(component.loading).toBeFalsy();
  });

  it('should handle error when loading encuestas', () => {
    jest.spyOn(encuestaService, 'getAllEncuestas').mockReturnValue(throwError(() => new Error('Error')));
    
    component.ngOnInit();
    
    expect(component.loading).toBeFalsy();
  });

  it('should navigate to edit', () => {
    const id = 1;
    component.editEncuesta(id);
    expect(router.navigate).toHaveBeenCalledWith(['/encuestas/editar', id]);
  });

  it('should navigate to create', () => {
    component.createNew();
    expect(router.navigate).toHaveBeenCalledWith(['/encuestas/nueva']);
  });
});