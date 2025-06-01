import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-encuesta-form',
  templateUrl: './encuesta-form.component.html',
  styleUrls: ['./encuesta-form.component.css']
})
export class EncuestaFormComponent implements OnInit {
  encuestaForm!: FormGroup;
  submitted = false;
  editMode = false;
  successMessage = '';
  errorMessage = '';

  // Opciones para los selectores
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
    'Alimentos y bebidas',
    'Servicios culturales y de entretenimiento',
    'Servicios deportivos y recreacionales',
    'Tours en destino (con servicio de guía)',
    'Transporte aéreo interno en el destino',
    'Otro transporte interno',
    'Otro servicio'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
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
        this.createPaisVisitaGroup()
      ])
    });
  }

  createPaisVisitaGroup() {
    return this.fb.group({
      pais: [''],
      viviendaPropia: [''],
      hotelApartahotel: [''],
      viviendaFamiliar: [''],
      viviendaAlquiler: [''],
      otroTipoVivienda: ['']
    });
  }

  get serviciosPaqueteArray(): FormArray {
    return this.encuestaForm.get('serviciosPaquete') as FormArray;
  }

  get paisesVisitaArray(): FormArray {
    return this.encuestaForm.get('paisesVisita') as FormArray;
  }

  onViajaConChange(event: any): void {
    const viajaConValue = event?.target?.value || event;
    
    if (viajaConValue === 'Solo') {
      this.encuestaForm.get('cantidadPersonas')?.reset();
      this.encuestaForm.get('cantidadPersonas')?.clearValidators();
    } else {
      this.encuestaForm.get('cantidadPersonas')?.setValidators([
        Validators.required,
        Validators.min(1)
      ]);
    }
    
    this.encuestaForm.get('cantidadPersonas')?.updateValueAndValidity();
    
    if (viajaConValue === 'Otro') {
      this.encuestaForm.get('viajaConOtro')?.setValidators([Validators.required]);
    } else {
      this.encuestaForm.get('viajaConOtro')?.clearValidators();
      this.encuestaForm.get('viajaConOtro')?.reset();
    }
    this.encuestaForm.get('viajaConOtro')?.updateValueAndValidity();
  }

  onMotivoViajeChange(event: any): void {
    const motivoValue = event?.target?.value || event;
    
    if (motivoValue === 'Otro') {
      this.encuestaForm.get('motivoViajeOtro')?.setValidators([Validators.required]);
    } else {
      this.encuestaForm.get('motivoViajeOtro')?.clearValidators();
      this.encuestaForm.get('motivoViajeOtro')?.reset();
    }
    this.encuestaForm.get('motivoViajeOtro')?.updateValueAndValidity();
  }

  onOrganizacionViajeChange(event: any): void {
    const organizacionValue = event?.target?.value || event;
    
    if (organizacionValue === 'Otro') {
      this.encuestaForm.get('organizacionViajeOtro')?.setValidators([Validators.required]);
    } else {
      this.encuestaForm.get('organizacionViajeOtro')?.clearValidators();
      this.encuestaForm.get('organizacionViajeOtro')?.reset();
    }
    this.encuestaForm.get('organizacionViajeOtro')?.updateValueAndValidity();
  }

  onServicioPaqueteChange(servicio: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const serviciosArray = this.serviciosPaqueteArray;
    
    if (checked) {
      serviciosArray.push(this.fb.control(servicio));
    } else {
      const index = serviciosArray.controls.findIndex(x => x.value === servicio);
      serviciosArray.removeAt(index);
    }
  }

  addPaisVisita(): void {
    this.paisesVisitaArray.push(this.createPaisVisitaGroup());
  }

  removePaisVisita(index: number): void {
    this.paisesVisitaArray.removeAt(index);
  }

  onCancel(): void {
    // Implementa la lógica de cancelación
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.encuestaForm.invalid) {
      return;
    }
    
    console.log('Formulario válido:', this.encuestaForm.value);
    this.successMessage = 'Encuesta guardada correctamente';
  }
}