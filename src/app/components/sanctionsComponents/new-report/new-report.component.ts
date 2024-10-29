import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, Routes } from '@angular/router';
import { ModalComplaintsListComponent } from '../../modal-complaints-list/modal-complaints-list.component';
// import { MockapiService } from '../../../services/mock/mockapi.service';
import { PostReportDTO } from '../../../models/PostReportDTO';
import { ReportReasonDto } from '../../../models/ReportReasonDTO';
import { ReportService } from '../../../services/report.service';
import { error } from 'jquery';
import { routes } from '../sanctionRouting.routing';


@Component({
  selector: 'app-new-report',
  standalone: true,
  imports: [FormsModule, RouterLink, ModalComplaintsListComponent],
  templateUrl: './new-report.component.html',
  styleUrl: './new-report.component.scss'
})
export class NewReportComponent {

  selectedReasonId = 0;
  selectedDate = '';
  dateView = '';
  textareaPlaceholder = 'Ingrese su mensaje aquí...';
  description = '';
  reportReasons: ReportReasonDto[] = [];
  complaintsList: any[] = [];
  selectedComplaints: any[] = [];

  constructor(private reportService: ReportService, private router: Router) {
    this.dateView = this.setTodayDate();
  }

  setTodayDate(): string {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.getReportReasons();
  }

  getReportReasons(): void {
    this.reportService.getAllReportReasons().subscribe(
      (reasons: ReportReasonDto[]) => {
        reasons.forEach((reason) => this.reportReasons.push(reason))
        console.log("Reports: " + this.reportReasons)
      },
      (error) => {
        console.error('Error al cargar report reasons: ', error);
      }
    );

  }

  handleSelectedComplaints(selectedComplaints: any[]): void {
    console.log('Denuncias recibidas del modal:', selectedComplaints);
    this.complaintsList = selectedComplaints;
  }

  onSubmit(): void {
    console.log("Submit");
    const userId = 1;
    const plotId = 1;

    const complaintsIds = this.complaintsList.length > 0
      ? this.complaintsList.map(complaint => complaint.id)
      : [];

    if (this.validateParams()) {
      const reportDTO: PostReportDTO = {
        reportReasonId: this.selectedReasonId,
        plotId: plotId,
        description: this.description,
        complaints: complaintsIds,
        userId: userId,
      };
      console.log(reportDTO);
      this.reportService.postReport(reportDTO).subscribe({
        next: (response) => {
          (window as any).Swal.fire({
            title: '¡Informe creado!',
            text: 'El informe ha sido creado correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          this.router.navigate(["home/sanctions/reportList"]);
        },
        error: (error) => {
          console.error('Error al enviar la denuncia', error);
        }
      });
    }

    else {
      console.log("Los campos no estab validados")
    }

  }

  validateParams(): boolean {
    if (this.selectedReasonId == 0 || this.selectedReasonId == null) {
      return false
    }
    /*
    if (this.plotId == 0 || this.plotId == null) {
      return false
    }*/
    if (this.description == null || this.description == '') {
      return false
    }
    if (this.reportReasons == null || this.reportReasons[0] == null) {
      return false;
    }
    return true;
  }

  openSelectComplaints(): void {
    const modalElement = document.getElementById('complaintModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

}
