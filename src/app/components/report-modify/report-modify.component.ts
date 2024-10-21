import { Component } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { MockapiService } from '../../services/mock/mockapi.service';
import { ModalComplaintsListComponent } from "../modal-complaints-list/modal-complaints-list.component";

@Component({
  selector: 'app-report-modify',
  standalone: true,
  imports: [FormsModule, RouterLink, FileUploadComponent, ModalComplaintsListComponent],
  templateUrl: './report-modify.component.html',
  styleUrl: './report-modify.component.scss'
})
export class ReportModifyComponent {
  selectedOption = '';
  selectedDate = '';
  maxDate: string;
  textareaPlaceholder = 'Ingrese su mensaje aquí...';
  description = '';
  complaintTypes: any[] = [];
  selectedComplaints: any[] = [];
  selectedComplaintsToDetach: any[] = [];
  modalMode: 'anexar' | 'desanexar' = 'anexar';

  constructor(private mockService: MockapiService, private router: Router) {
    this.maxDate = this.setTodayDate();
  }

  setTodayDate(): string {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }

  handleSelectedComplaints(selectedComplaints: any[]): void {
    console.log('Denuncias recibidas en handleSelectedComplaints:', selectedComplaints);
    if (this.modalMode === 'anexar') {
      this.selectedComplaints = selectedComplaints;
      console.log('Denuncias para anexar:', this.selectedComplaints);
    } else if (this.modalMode === 'desanexar') {
      this.selectedComplaintsToDetach = selectedComplaints;
      console.log('Denuncias seleccionadas para desanexar:', this.selectedComplaintsToDetach);
    }
  }


  updateReport(): void {
    this.mockService.updateReportDescription(this.description).subscribe(res => {
      console.log('Informe actualizado', res);

      if (this.modalMode === 'anexar') {
        this.updateComplaintsState('ANEXADA', 1);
      } else if (this.modalMode === 'desanexar') {
        console.log('Denuncias a desanexar:', this.selectedComplaintsToDetach);
        this.updateDetachedComplaintsState();
      }
    }, error => {
      console.error('Error al actualizar el informe', error);
    });
  }

  private updateComplaintsState(newState: string, reportId: number): void {
    this.selectedComplaints.forEach(complaint => {
      const updatedComplaint = {
        ...complaint,
        report_id: reportId,
        complaint_state: newState
      };

      this.mockService.updateComplaintState(updatedComplaint).subscribe(res => {
        console.log(`Denuncia ${complaint.id} actualizada`, res);
      }, error => {
        console.error(`Error al actualizar la denuncia ${complaint.id}`, error);
      });
    });
  }

  private updateDetachedComplaintsState(): void {
    console.log('Iniciando desanexado de denuncias:', this.selectedComplaintsToDetach);

    this.selectedComplaintsToDetach.forEach(complaint => {
      const updatedComplaint = {
        ...complaint,
        report_id: 10,
        complaint_state: 'PENDIENTE'
      };

      console.log('Actualizando denuncia para desanexar:', updatedComplaint);

      this.mockService.updateComplaintState(updatedComplaint).subscribe(res => {
        console.log(`Denuncia ${complaint.id} desanexada`, res);
      }, error => {
        console.error(`Error al desanexar la denuncia ${complaint.id}`, error);
      });
    });
  }

  openModal(mode: 'anexar' | 'desanexar'): void {
    this.modalMode = mode;
    const modalElement = document.getElementById('complaintModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
