import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComplaintService } from '../../../services/complaint.service';
import { ComplaintDto } from '../../../models/complaint';
//dataTable
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
//
import { PenaltiesModalStateReasonComponent } from '../modals/penalties-modal-state-reason/penalties-modal-state-reason.component';
import { PenaltiesModalConsultComplaintComponent } from '../modals/penalties-modal-consult-complaint/penalties-modal-consult-complaint.component';

@Component({
  selector: 'app-penalties-list-complaint',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbModule],
  templateUrl: './penalties-list-complaint.component.html',
  styleUrl: './penalties-list-complaint.component.scss',
})
export class PenaltiesListComplaintComponent {
  Complaint: ComplaintDto[] = [];
  complaintState: String = '';
  filterComplaint: ComplaintDto[] = [];
  selectedValue: string = '';
  filterDateStart: Date = new Date();
  filterDateEnd: Date = new Date();
  states : { key: string; value: string }[] = [];

  constructor(
    private router: Router,
    private _modal: NgbModal,
    private complServ: ComplaintService
  ) {
    (window as any).viewComplaint = (id: number) => this.viewComplaint(id);
    (window as any).selectState = (state: string, id: number, userId: number) =>
      this.selectState(state, id, userId);
  }

  ngOnInit(): void {
    this.refreshData();
    this.getTypes()
    
  }

  //filtro de la descripcion
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .toLowerCase()
      .trim(); // Añadido trim()

    if (filterValue) {
      this.filterComplaint = this.Complaint.filter((p) => {
        const descriptionStr = p.description.toLowerCase().trim();
        return descriptionStr.includes(filterValue);
      });
    } else {
      this.filterComplaint = [...this.Complaint];
    }

    this.updateDataTable();
  }

  //filtro de los estados
  search(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log(this.filterComplaint);

    this.filterComplaint = this.Complaint.filter(
      (c) => c.complaintState == selectedValue
    );
    if (selectedValue == '') {
      this.filterComplaint = this.Complaint;
    }
    // alert(this.filterComplaint)
    console.log(this.filterComplaint);
    this.updateDataTable();
  }

  refreshData() {
    this.complServ.getAllComplaints().subscribe((data) => {
      this.Complaint = data;
      this.filterComplaint = [...data];
      this.updateDataTable();
    });
  }

  updateDataTable() {
    if ($.fn.dataTable.isDataTable('#complaintsTable')) {
      $('#complaintsTable').DataTable().clear().destroy();
    }

    let table = $('#complaintsTable').DataTable({
      data: this.filterComplaint,
      columns: [
        {
          data: 'createdDate',
          render: (data) => this.complServ.formatDate(data),
        },
        {
          data: 'complaintState',
          render: (data) =>
            `<div class="btn ${this.getStatusClass(data)} text-center border rounded-pill w-75">${data}</div>`,
        },
        { data: 'description' },
        {
          data: 'fileQuantity',
          render: (data) =>
            `<i class="bi bi-paperclip"></i> ${data} Archivo adjunto`,
        },
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
        },
      ],
      paging: true,
      pageLength: 10,
      lengthMenu: [
        [5, 10, 25, 50, -1],
        [5, 10, 25, 50, 'All'],
      ],
      dom: 't<"d-flex justify-content-between"<lf>"d-flex justify-content-between"p>',
      searching: false,
      language: {
        lengthMenu:
          '<select class="form-select">' +
          '<option value="5">5</option>' +
          '<option value="10">10</option>' +
          '<option value="25">25</option>' +
          '<option value="50">50</option>' +
          '<option value="-1">All</option>' +
          '</select>',
      },
      buttons: [
        {
          extend: 'excel',
          text: 'Excel',
          Class: 'btn btn-success export-excel-btn',
          title: 'Listado de Denuncias',
          exportOptions: {
            columns: [0, 1, 2, 3],
          },
        },
        {
          extend: 'pdf',
          text: 'PDF',
          className: 'btn btn-danger export-pdf-btn',
          title: 'Listado de denuncias',
          exportOptions: {
            columns: [0, 1, 2, 3],
          },
        },
      ],
    });

    $('#exportExcelBtn').on('click', function () {
      table.button('.buttons-excel').trigger();
    });

    $('#exportPdfBtn').on('click', function () {
      table.button('.buttons-pdf').trigger();
    });
  }

  filterDate() {
    const startDate = this.filterDateStart
      ? new Date(this.filterDateStart)
      : null;
    const endDate = this.filterDateEnd ? new Date(this.filterDateEnd) : null;

    this.filterComplaint = this.Complaint.filter((complaint) => {
      let complaintDate;

      complaintDate = new Date(complaint.createdDate);

      if (isNaN(complaintDate.getTime())) {
        console.warn(`Fecha de queja no válida: ${complaint.createdDate}`);
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

    this.updateDataTable();
  }

  getTypes(): void {
    this.complServ.getState().subscribe({
      next: (data) => {
        this.states = Object.keys(data).map(key => ({
          key,
          value: data[key]

        }));
        console.log(this.states)
      },
      error: (error) => {
        console.error('error: ', error);
      }
    })
  }
  

  // Metodo para obtener el estado de la denuncia y mostrar el modal
  selectState(option: string, idComplaint: number, userId: number) {
    this.complaintState = option;
    this.openModal(idComplaint, userId);
  }

  openModal(idComplaint: number, userId: number) {
    const modal = this._modal.open(PenaltiesModalStateReasonComponent, {
      size: 'md',
      keyboard: false,
    });
    modal.componentInstance.idComplaint = idComplaint;
    console.log(idComplaint, this.complaintState);
    modal.componentInstance.complaintState = this.complaintState;
    modal.componentInstance.userId = userId;
    modal.result
      .then((result) => {
        this.refreshData();
      })
      .catch((error) => {
        console.log('Modal dismissed with error:', error);
      });
  }

  viewComplaint(i: number) {
    const modal = this._modal.open(PenaltiesModalConsultComplaintComponent, {
      size: 'xl',
      keyboard: false,
    });
    modal.componentInstance.denunciaId = i;
    modal.result
      .then((result) => {})
      .catch((error) => {
        console.log('Modal dismissed with error:', error);
      });
  }

  getStatusClass(estado: string): string {
    switch (estado) {
      case 'Anexada':
        return 'text-bg-secondary';
      case 'Nueva':
        return 'text-bg-success';
      case 'Pendiente':
        return 'text-bg-warning text-white';
      case 'Rechazada':
        return 'text-bg-danger';
      default:
        return '';
    }
  }

}

