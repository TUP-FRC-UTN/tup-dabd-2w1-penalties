import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalComplaintsListComponent } from "../modal-complaints-list/modal-complaints-list.component";
import { PutReportDTO } from '../../models/PutReportDTO';
import { ComplaintService } from '../../services/complaint.service';
import { PenaltiesSanctionsServicesService } from '../../services/penalties-sanctions-services/penalties-sanctions-services.service';

@Component({
  selector: 'app-report-modify',
  standalone: true,
  imports: [FormsModule, RouterLink, ModalComplaintsListComponent],
  templateUrl: './report-modify.component.html',
  styleUrl: './report-modify.component.scss'
})
export class ReportModifyComponent implements OnInit {
  reportId: number = 0;
  reportState = '';
  selectedDate = '';
  plotId: number = 0;
  infractorPlaceholder: string = '';
  textareaPlaceholder = 'Ingrese su mensaje aquí...';
  description = '';
  selectedComplaints: any[] = [];
  private route: ActivatedRoute;

  constructor(private complaintService: ComplaintService, private reportService: PenaltiesSanctionsServicesService, private router: Router, route: ActivatedRoute) {
    this.route = route;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.reportId = params['id'] || '';
        this.reportState = params['reportState'] || '';
        this.selectedDate = this.formatDate(params['createdDate'] || '');
        this.description = params['description'] || '';
        this.plotId = params['plotId'] || '';
        if (this.plotId) {
          this.infractorPlaceholder = 'Lote ' + this.plotId;
        }
        console.log(params);
      }
    });
  }

  development(): void {
    (window as any).Swal.fire({
      title: 'Función en desarrollo',
      text: 'Esta funcionalidad aún está en desarrollo.',
      icon: 'info',
      confirmButtonText: 'Aceptar'
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const [datePart] = dateString.split(' ');
    return datePart;
  }

  handleSelectedComplaints(selectedComplaints: any[]): void {
    this.selectedComplaints = selectedComplaints;
  }

  updateReport(): void {
    const userId = 1;

    const complaintsIds = this.selectedComplaints.length > 0
      ? this.selectedComplaints.map(complaint => complaint.id)
      : [];

    const reportDTO: PutReportDTO = {
      id: this.reportId,
      userId: userId,
      description: this.description,
      complaintsIds: complaintsIds,
    };

    (window as any).Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas confirmar la actualización del informe?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'No, cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.reportService.updateReport(reportDTO).subscribe(res => {
          (window as any).Swal.fire({
            title: '¡Actualización exitosa!',
            text: 'El informe ha sido actualizado correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        }, error => {
          console.error('Error al actualizar el informe', error);
          (window as any).Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar el informe. Inténtalo de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
      }
    });
  }

  openModal(): void {
    const modalElement = document.getElementById('complaintModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
