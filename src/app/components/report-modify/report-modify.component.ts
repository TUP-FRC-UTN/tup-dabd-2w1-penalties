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
  complaintTypes: { key: string; value: string }[] = [];
  files?: File[];
  description: string;
  complaints: any[];

  constructor(private mockService: MockapiService, private router: Router) {
    this.selectedOption = '';
    this.maxDate = '';
    this.textareaPlaceholder = 'Ingrese su mensaje aquí...';
    this.selectedDate = '';
    this.setTodayDate();
    this.files = [];
    this.description = '';
    this.complaints = [];
  }

  ngOnInit(): void {
    this.getComplaints();
  }

  setTodayDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();

    this.selectedDate = `${year}-${month}-${day}`;
  }

  updateDescription() {
    const newDescription = this.description;

    this.mockService.updateReportDescription(newDescription).subscribe(res => {
      console.log('Informe actualizado', res);
    }, error => {
      console.error('Error al actualizar', error);
    })
  }

  getComplaints() {
    this.mockService.getAllComplaints().subscribe(res => {
      this.complaints = res.map(complaint => ({
        ...complaint,
        selected: false
      }));
      console.log('Denuncias:', this.complaints);
    }, error => {
      console.error('Error al obtener denuncias', error);
    })
  }

  openModal() {
    const modalElement = document.getElementById('complaintModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

}
