import { Component } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { MockapiService } from '../../services/mock/mockapi.service';
import { ModalComplaintsListComponent } from "../modal-complaints-list/modal-complaints-list.component";
import { PutReportDTO } from '../../models/PutReportDTO';

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
    this.selectedComplaints = selectedComplaints;
  }

  updateReport(): void {
    const reportId = 1;
    const userId = 1;
    const complaintsIds = this.selectedComplaints.map(complaint => complaint.id);

    const reportDTO: PutReportDTO = {
      id: reportId,
      userId: userId,
      description: this.description,
      complaintsIds: complaintsIds,
    };

    this.mockService.updateReport(reportDTO).subscribe(res => {
      console.log('Informe actualizado', res);
    }, error => {
      console.error('Error al actualizar el informe', error);
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
