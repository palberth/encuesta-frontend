import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EncuestaService } from '../../../services/encuesta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta-form',
  templateUrl: './encuesta-form.component.html',
  styleUrls: ['./encuesta-form.component.css']
})
export class EncuestaFormComponent implements OnInit {
  encuestaForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  editMode = false;
  currentEncuestaId: number | null = null;

  viajaConOptions = ['Solo', 'Amigos', 'Familia', 'Compañeros de trabajo', 'Otro'];
  motivoViajeOptions = [
    'Vacaciones (recreación, ocio, sol y playa)',
    'Convenciones',
    'Compras',
    'Turismo Cultural',
    'Asistencia a eventos artísticos y/o deportivos',
    'Estudio y/o formación',
    'Tratamiento de salud y belleza',
    'Religioso',
    'Trabajo remunerado en destino',
    'Trabajo o negocios (no remunerado en destino)',
    'Participación en eventos artísticos y/o deportivos',
    'Tránsito',
    'Otro'
  ];
  organizacionViajeOptions = [
    'Paquete turístico organizado por una agencia de viajes en Colombia',
    'Paquete turístico organizado por una agencia de viajes en el país de visita',
    'Paquete turístico organizado por terceros que no sean agencias de viajes',
    'Viaje organizado por cuenta propia',
    'Otro'
  ];
  serviciosPaqueteOptions = [
    'Alojamiento',
    'Transporte internacional',
    'Alimentos y bebidas (No incluidos en el alojamiento)',
    'Servicios culturales y de entretenimiento',
    'Servicios deportivos y recreacionales',
    'Tours en destino (con servicio de guía)',
    'Transporte aéreo interno en el destino',
    'Otro transporte interno',
    'Otro servicio'
  ];

  constructor(
    private fb: FormBuilder,
    private encuestaService: EncuestaService,
    private router: Router
  ) {
    this.encuestaForm = this.fb.group({
      paisResidencia: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      sexo: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
      viajaCon: ['', Validators.required],
      viajaConOtro: [''],
      cantidadPersonas: [''],
      motivoViaje: ['', Validators.required],
      motivoViajeOtro: [''],
      organizacionViaje: ['', Validators.required],
      organizacionViajeOtro: [''],
      serviciosPaquete: this.fb.array([]),
      serviciosPaqueteOtro: [''],
      gastosPaquete: this.fb.group({
        huboGasto: [false],
        pagadoPorUsted: this.fb.group({
          valor: [''],
          tipoMoneda: ['']
        }),
        tercerosNoGrupo: this.fb.group({
          valor: [''],
          tipoMoneda: ['']
        }),
        tercerosSiGrupo: this.fb.group({
          valor: [''],
          tipoMoneda: ['']
        }),
        paraCuantasPersonas: ['']
      }),
      gastosTransporte: this.fb.group({
        huboGasto: [false],
        pagadoPorUsted: this.fb.group({
          valor: [''],
          tipoMoneda: ['']
        }),
        tercerosNoGrupo: this.fb.group({
          valor: [''],
          tipoMoneda: ['']
        }),
        tercerosSiGrupo: this.fb.group({
          valor: [''],
          tipoMoneda: ['']
        }),
        paraCuantasPersonas: ['']
      }),
      paisesVisita: this.fb.array([
        this.fb.group({
          pais: [''],
          viviendaPropia: [''],
          hotelApartahotel: [''],
          viviendaFamiliar: [''],
          viviendaAlquiler: [''],
          otroTipoVivienda: ['']
        })
      ])
    });
  }

  ngOnInit(): void {
    // Verificar si estamos en modo edición
    const state = history.state;
    if (state && state.encuesta) {
      this.editMode = true;
      this.currentEncuestaId = state.encuesta.id;
      this.loadEncuestaData(state.encuesta);
    }
  }

  loadEncuestaData(encuesta: any): void {
    // Lógica para cargar los datos de la encuesta en el formulario
    this.encuestaForm.patchValue({
      paisResidencia: encuesta.paisResidencia,
      nacionalidad: encuesta.nacionalidad,
      sexo: encuesta.sexo,
      edad: encuesta.edad,
      viajaCon: encuesta.viajaCon,
      viajaConOtro: encuesta.viajaConOtro,
      cantidadPersonas: encuesta.cantidadPersonas,
      motivoViaje: encuesta.motivoViaje,
      motivoViajeOtro: encuesta.motivoViajeOtro,
      organizacionViaje: encuesta.organizacionViaje,
      organizacionViajeOtro: encuesta.organizacionViajeOtro
    });

    // Cargar servicios del paquete
    const servicios = encuesta.serviciosPaquete ? JSON.parse(encuesta.serviciosPaquete) : [];
    servicios.forEach((servicio: string) => {
      this.onServicioPaqueteChange(servicio, true);
    });

    // Cargar gastos
    if (encuesta.gastosPaquete) {
      const gastosPaquete = JSON.parse(encuesta.gastosPaquete);
      this.encuestaForm.get('gastosPaquete')?.patchValue(gastosPaquete);
    }

    if (encuesta.gastosTransporte) {
      const gastosTransporte = JSON.parse(encuesta.gastosTransporte);
      this.encuestaForm.get('gastosTransporte')?.patchValue(gastosTransporte);
    }

    // Cargar países de visita
    const paisesVisitaArray = this.encuestaForm.get('paisesVisita') as FormArray;
    paisesVisitaArray.clear();
    
    if (encuesta.paisesVisita) {
      const paisesVisita = JSON.parse(encuesta.paisesVisita);
      paisesVisita.forEach((pais: any) => {
        paisesVisitaArray.push(this.fb.group({
          pais: [pais.pais],
          viviendaPropia: [pais.viviendaPropia],
          hotelApartahotel: [pais.hotelApartahotel],
          viviendaFamiliar: [pais.viviendaFamiliar],
          viviendaAlquiler: [pais.viviendaAlquiler],
          otroTipoVivienda: [pais.otroTipoVivienda]
        }));
      });
    }
  }

  get serviciosPaqueteArray(): FormArray {
    return this.encuestaForm.get('serviciosPaquete') as FormArray;
  }

  onServicioPaqueteChange(servicio: string, isChecked: boolean): void {
    const serviciosArray = this.serviciosPaqueteArray;
    
    if (isChecked) {
      serviciosArray.push(this.fb.control(servicio));
    } else {
      const index = serviciosArray.controls.findIndex(x => x.value === servicio);
      serviciosArray.removeAt(index);
    }
  }

  get paisesVisitaArray(): FormArray {
    return this.encuestaForm.get('paisesVisita') as FormArray;
  }

  addPaisVisita(): void {
    this.paisesVisitaArray.push(this.fb.group({
      pais: [''],
      viviendaPropia: [''],
      hotelApartahotel: [''],
      viviendaFamiliar: [''],
      viviendaAlquiler: [''],
      otroTipoVivienda: ['']
    }));
  }

  removePaisVisita(index: number): void {
    this.paisesVisitaArray.removeAt(index);
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.encuestaForm.invalid) {
      return;
    }

    const formData = this.encuestaForm.value;
    
    // Preparar datos para enviar
    const encuestaData = {
      ...formData,
      serviciosPaquete: JSON.stringify(formData.serviciosPaquete),
      gastosPaquete: JSON.stringify(formData.gastosPaquete),
      gastosTransporte: JSON.stringify(formData.gastosTransporte),
      paisesVisita: JSON.stringify(formData.paisesVisita)
    };

    if (this.editMode && this.currentEncuestaId) {
      this.encuestaService.updateEncuesta(this.currentEncuestaId, encuestaData).subscribe({
        next: () => {
          this.successMessage = 'Encuesta actualizada con éxito';
          setTimeout(() => this.router.navigate(['/encuestas']), 2000);
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar la encuesta';
          console.error(err);
        }
      });
    } else {
      this.encuestaService.createEncuesta(encuestaData).subscribe({
        next: () => {
          this.successMessage = 'Encuesta creada con éxito';
          setTimeout(() => this.router.navigate(['/encuestas']), 2000);
        },
        error: (err) => {
          this.errorMessage = 'Error al crear la encuesta';
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/encuestas']);
  }
}
