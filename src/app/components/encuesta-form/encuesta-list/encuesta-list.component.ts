import { Component, OnInit } from '@angular/core';
import { EncuestaService } from '../../../services/encuesta.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-encuesta-list',
  templateUrl: './encuesta-list.component.html',
  styleUrls: ['./encuesta-list.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class EncuestaListComponent implements OnInit {
  encuestas: any[] = [];
  loading: boolean = true;

  constructor(
    private encuestaService: EncuestaService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadEncuestas();
  }

  loadEncuestas(): void {
    this.loading = true;
    this.encuestaService.getAllEncuestas().subscribe({
      next: (data) => {
        this.encuestas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar encuestas:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las encuestas'
        });
        this.loading = false;
      }
    });
  }

  editEncuesta(id: number): void {
    this.router.navigate(['/encuestas/editar', id]);
  }

  deleteEncuesta(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar esta encuesta?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.encuestaService.deleteEncuesta(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Encuesta eliminada correctamente'
            });
            this.loadEncuestas();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la encuesta'
            });
          }
        });
      }
    });
  }

  createNew(): void {
    this.router.navigate(['/encuestas/nueva']);
  }
}