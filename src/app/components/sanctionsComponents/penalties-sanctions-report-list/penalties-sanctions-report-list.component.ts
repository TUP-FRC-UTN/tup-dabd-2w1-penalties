import { Component, OnInit } from '@angular/core';
import { PenaltiesSanctionsServicesService } from '../../../services/penalties-sanctions-services/penalties-sanctions-services.service';
import { ReportDTO } from '../../../models/reportDTO';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PenaltiesModalReportComponent } from '../modals/penalties-modal-report/penalties-modal-report.component';

@Component({
  selector: 'app-penalties-sanctions-report-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbModule],
  templateUrl: './penalties-sanctions-report-list.component.html',
  styleUrl: './penalties-sanctions-report-list.component.scss'
})
export class PenaltiesSanctionsReportListComponent implements OnInit {
  reportfilter : ReportDTO[]=[];
  report : ReportDTO[]=[];

  
  filterDateStart: Date = new Date();
  filterDateEnd: Date = new Date();

  constructor(private reportServodes: PenaltiesSanctionsServicesService,private _modal:NgbModal){
    //Esto es importante para llamar los funciones dentro del data table con onClick
     (window as any).viewComplaint = (id: number) => this.viewComplaint(id);
    // (window as any).selectState = (state: string, id: number, userId: number) =>
    //   this.selectState(state, id, userId);
  }

  ngOnInit(): void {
    this.refreshData()
    
  }

  refreshData(){
    this.reportServodes.getAllComplains().subscribe(
      response=>{
        this.report = response;
        this.reportfilter=response;
        this.CreateDataTable()
      },error=>{
        alert(error)
      }
    )
  }

  CreateDataTable(){
    if ($.fn.dataTable.isDataTable('#reportsTable')) {//creo que es por la funcion
      $('#reportsTable').DataTable().clear().destroy();
    }

  let table = $('#reportsTable').DataTable({
      data: this.reportfilter,
      columns: [
        {data: 'createdDate',
          render: (data) => this.reportServodes.formatDate(data),
        },
          {
              data: 'reportState',
              render: (data) => `<div class="d-flex justify-content-center"><div class="${this.getStatusClass(data)} btn w-75 text-center border rounded-pill" >${data}</div></div>`
          },
          { data: 'plotId', render : (data)=> ` <div class="text-start">Nro: ${data}</div>`},
          { data: 'description' },
          {
              data: null,
              render: (data) => `
               <div class="btn-group gap-2">
                    <div class="dropdown">
                        <button type="button" class="btn btn-light border border-2 bi-three-dots-vertical" data-bs-toggle="dropdown"></button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" onclick="viewComplaint(${data.id})">Ver más</a> </li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" onclick="selectState('ATTACHED', ${data.id}, ${data.userId})">Marcar como Anexada</a></li>
                            <li><a class="dropdown-item" onclick="selectState('REJECTED', ${data.id}, ${data.userId})">Marcar como Rechazada</a></li>
                            <li><a class="dropdown-item" onclick="selectState('PENDING', ${data.id}, ${data.userId})">Marcar como Pendiente</a></li>
                        </ul>
                    </div>
                </div>`,
          }
      ],
      paging: true, 
      pageLength: 10, 
      lengthMenu: [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "All"] ], 
      dom: 't<"d-flex justify-content-between"<lf>"d-flex justify-content-between"p>', 
      searching: false,
      language: {
          lengthMenu: '<select class="form-select">'+ 
                      '<option value="5">5</option>'+
                      '<option value="10">10</option>'+
                      '<option value="25">25</option>'+
                      '<option value="50">50</option>'+
                      '<option value="-1">All</option>'+
                      '</select>'
      },
      buttons: [
        {
            extend: 'excel',
            text: 'Excel',
            Class: 'btn btn-success export-excel-btn',
        },
        {
            extend: 'pdf',
            text: 'PDF',
            className: 'btn btn-danger export-pdf-btn'
        }
    ]
  });
 
  $('#exportExcelBtn').on('click', function() {
    table.button('.buttons-excel').trigger(); 
  });

  $('#exportPdfBtn').on('click', function() {
    table.button('.buttons-pdf').trigger(); 
  });
  }

  filterDate() {
    const startDate = this.filterDateStart
      ? new Date(this.filterDateStart)
      : null;
    const endDate = this.filterDateEnd ? new Date(this.filterDateEnd) : null;

    this.reportfilter = this.report.filter((report) => {
      let complaintDate;

      complaintDate = new Date(report.createdDate);

      if (isNaN(complaintDate.getTime())) {
        console.warn(`Fecha de queja no válida: ${report.createdDate}`);
        return false;
      }

      console.log(`Fecha de queja: ${complaintDate}`);

      if (startDate && endDate) {
        return complaintDate >= startDate && complaintDate <= endDate;
      } else if (startDate) {
        return complaintDate >= startDate;
      } else if (endDate) {
        return complaintDate <= endDate;
      }

      return true;
    });

    this.CreateDataTable();
  }


  viewComplaint(i: number) {
    const modal = this._modal.open(PenaltiesModalReportComponent, {
      size: 'xl',
      keyboard: false,
    });
    modal.componentInstance.id = i;
    modal.result
      .then((result) => {})
      .catch((error) => {
        console.log('Modal dismissed with error:', error);
      });
  }




  getStatusClass(estado: string): string {
    switch (estado) {
      case 'Pendiente':
        return 'text-bg-warning text-white';
      case 'Abierto':
        return 'text-bg-success';
      case 'Cerrado':
        return 'text-bg-danger';
      case 'Rechazado':
        return 'text-bg-secondary';
      case 'Finalizado':
        return 'text-bg-secondary';
      default:
        return '';
    }
  }



}
