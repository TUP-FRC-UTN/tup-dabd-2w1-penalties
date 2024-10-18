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
  selectedOption: string;
  selectedDate: string;
  maxDate: string;
  textareaPlaceholder: string;
  description: string;
  complaintTypes: any[];
  selectedComplaints: any[] = [];
  complaints: any[];

  constructor(private mockService: MockapiService, private router: Router) {
    this.selectedOption = '';
    this.maxDate = this.setTodayDate();
    this.textareaPlaceholder = 'Ingrese su mensaje aquí...';
    this.selectedDate = '';
    this.complaintTypes = [];
    this.complaints = [];
    this.description = '';
  }

  setTodayDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // Recibir las denuncias seleccionadas del modal
  handleSelectedComplaints(selectedComplaints: any[]) {
    this.selectedComplaints = selectedComplaints;
    console.log('Denuncias seleccionadas para anexar:', this.selectedComplaints);
  }

  updateReport() {
    // Primero, actualiza la descripción del informe
    this.mockService.updateReportDescription(this.description).subscribe(res => {
      console.log('Informe actualizado', res);
  
      // Luego, actualiza el estado de las denuncias seleccionadas
      this.selectedComplaints.forEach(complaint => {
        const updatedComplaint = {
          ...complaint,
          report_id: 1, // Ajusta según sea necesario
          complaint_state: 'ANEXADA'
        };
  
        this.mockService.updateComplaintState(updatedComplaint).subscribe(res => {
          console.log(`Denuncia ${complaint.id} actualizada`, res);
        }, error => {
          console.error(`Error al actualizar la denuncia ${complaint.id}`, error);
        });
      });
  
    }, error => {
      console.error('Error al actualizar el informe', error);
    });
  }

  openModal() {
    const modalElement = document.getElementById('complaintModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

}
