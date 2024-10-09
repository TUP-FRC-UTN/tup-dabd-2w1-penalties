import { Component } from '@angular/core';
import { Complaint, EstadoDenuncia, TipoDenuncia } from '../../models/complaint';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInfoComplaintComponent } from '../modal-info-complaint/modal-info-complaint.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-get-all-complaints',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './get-all-complaints.component.html',
  styleUrl: './get-all-complaints.component.scss'
})
export class GetAllComplaintsComponent {
  complaints: Complaint[] = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      detalle: 'Incumplimiento de horario en el área de producción.',
      tipo: TipoDenuncia.IncumplimientoDeVelocidad,
      estado: EstadoDenuncia.Pendiente,
      fecha: new Date
    },
    {
      id: 2,
      nombre: 'Ana Gómez',
      detalle: 'Daño en el equipo de limpieza en el área de mantenimiento.',
      tipo: TipoDenuncia.Daño,
      estado: EstadoDenuncia.Rechazada,
      fecha: new Date
    },
    {
      id: 3,
      nombre: 'Carlos Martínez',
      detalle: 'Infracción de volumen en la carga de materiales.',
      tipo: TipoDenuncia.InfracciónDeinquilino,
      estado: EstadoDenuncia.Aprobada,
      fecha: new Date
    },
    {
      id: 4,
      nombre: 'Lucía Fernández',
      detalle: 'No se realizó el mantenimiento de limpieza programado.',
      tipo: TipoDenuncia.NoMantenimientoDeLimpieza,
      estado: EstadoDenuncia.Ignorada,
      fecha: new Date
    },
    {
      id: 5,
      nombre: 'Pedro Morales',
      detalle: 'Incumplimiento de seguridad en el área de producción.',
      tipo: TipoDenuncia.IncumplimientoDeVelocidad,
      estado: EstadoDenuncia.Pendiente,
      fecha: new Date
    },
    {
      id: 6,
      nombre: 'María Rodríguez',
      detalle: 'Daño en la maquinaria de la línea de montaje.',
      tipo: TipoDenuncia.Daño,
      estado: EstadoDenuncia.Rechazada,
      fecha: new Date
    },
    {
      id: 7,
      nombre: 'Luis Hernández',
      detalle: 'Infracción de volumen en la entrega de productos.',
      tipo: TipoDenuncia.Daño,
      estado: EstadoDenuncia.Aprobada,
      fecha: new Date
    }
  ];

  constructor(private router: Router, private _modal: NgbModal) {

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue != "") {
      this.complaints = this.complaints.filter((p) => {
        const idProyectoStr = p.estado.toString().toLowerCase();
        const clienteStr = p.nombre.toLowerCase();
        const filterValueLower = filterValue.toLocaleLowerCase();

        return idProyectoStr.indexOf(filterValueLower) >= 0 || clienteStr.indexOf(filterValueLower) >= 0;
      });
    } else {
      this.complaints
    }

  }

  mostrar(denuncia: Complaint) {
    const modal = this._modal.open(ModalInfoComplaintComponent, { size: 'lg', keyboard: false });
    modal.componentInstance.denuncia = denuncia;
    modal.result.then((result) => {

    }).catch((error) => {
      console.log('Modal dismissed with error:', error);
    });
  }


  getEstadoClase(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'ignorada':
        return 'btn-secondary';
      //return 'text-bg-secondary';
      case 'aprobada':
        return 'btn-success';
      //return 'text-bg-success';
      case 'pendiente':
        return 'btn-warning';
      case 'rechazada':
        return 'btn-danger';
      //return 'text-bg-danger';
      default:
        return '';
    }
  }
  onButtonClick() {
    this.router.navigate(['/nuevaDenuncia']);
  }
}
