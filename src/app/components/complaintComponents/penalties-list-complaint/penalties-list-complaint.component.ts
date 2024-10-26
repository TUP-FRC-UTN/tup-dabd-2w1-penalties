import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Imports de DataTable
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';

//Imports propios de multas
import { PenaltiesModalConsultComplaintComponent } from '../modals/penalties-modal-consult-complaint/penalties-modal-consult-complaint.component';
import { PenaltiesModalStateReasonComponent } from '../modals/penalties-modal-state-reason/penalties-modal-state-reason.component';
import { ComplaintService } from '../../../services/complaint.service';
import { ComplaintDto } from '../../../models/complaint';

@Component({
  selector: 'app-penalties-list-complaint',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbModule],
  templateUrl: './penalties-list-complaint.component.html',
  styleUrl: './penalties-list-complaint.component.scss',
})
export class PenaltiesListComplaintComponent implements OnInit {
  //Variables
  Complaint: ComplaintDto[] = [];
  complaintState: String = '';
  filterComplaint: ComplaintDto[] = [];
  selectedValue: string = '';
  filterDateStart: Date = new Date();
  filterDateEnd: Date = new Date();
  states: { key: string; value: string }[] = [];
  table: any;
  searchTerm: string = '';


  //Init
  ngOnInit(): void {
    this.refreshData();
    this.getTypes()
  }


  //Constructor
  constructor(
    private router: Router,
    private _modal: NgbModal,
    private complaintService: ComplaintService
  ) {
    (window as any).viewComplaint = (id: number) => this.viewComplaint(id);
    (window as any).changeState = (state: string, id: number, userId: number) =>
      this.changeState(state, id, userId);
  }


  //Combo de filtrado de estado
  onFilter(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    this.filterComplaint = this.Complaint.filter(
      (c) => c.complaintState == selectedValue
    );
    if (selectedValue == '') {
      this.filterComplaint = this.Complaint;
    }

    this.updateDataTable();
  }

  //Manejo del Datatable
  updateDataTable() {
    if ($.fn.dataTable.isDataTable('#complaintsTable')) {
      $('#complaintsTable').DataTable().clear().destroy();
    }

    let table = this.table = $('#complaintsTable').DataTable({
      //Atributos de la tabla
      paging: true,
      searching: true,
      ordering: true,
      lengthChange: true,
      order: [0, 'asc'],
      lengthMenu: [10, 25, 50],
      pageLength: 10,
      data: this.filterComplaint, //Fuente de datos
      //Columnas de la tabla
      columns: [
        {
          data: 'createdDate',
          render: (data) =>
            this.complaintService.formatDate(data)
        },
        {
          data: 'complaintState',
          render: (data) =>
            `<div class="btn ${this.getStatusClass(data)} border rounded-pill w-75">${data}</div>`
        },
        { data: 'description',  //Usar cuando tengan texto muy largo
          render: (data) => {
            const slicedData = (data.length > 45) ? (data.slice(0, 45) + '...') : (data);
            return `<div>${slicedData}</div>`
          } 
        },
        {
          data: 'fileQuantity',
          render: (data) =>
            `<i class="bi bi-paperclip"></i> ${data} Archivo adjunto`
        },
        {
          data: null,
          render: (data) =>
            `<div class="text-center">
              <div class="btn-group">
                <div class="dropdown">
                  <button type="button" class="btn border border-2 bi-three-dots-vertical" data-bs-toggle="dropdown"></button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" onclick="viewComplaint(${data.id})">Ver más</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" onclick="changeState('ATTACHED', ${data.id}, ${data.userId})">Marcar como Anexada</a></li>
                    <li><a class="dropdown-item" onclick="changeState('REJECTED', ${data.id}, ${data.userId})">Marcar como Rechazada</a></li>
                    <li><a class="dropdown-item" onclick="changeState('PENDING', ${data.id}, ${data.userId})">Marcar como Pendiente</a></li>
                  </ul>
                </div>
              </div>
            </div>`
        },
        // {
        //   data: null,
        //   render: (data) =>
        //     `<div class="text-center">
        //       <input class="form-check-input border border-2 p-2" type="checkbox" value="" id="flexCheckDefault">
        //     </div>`
        // },
      ],
      dom:
        '<"mb-3"t>' +                           //Tabla
        '<"d-flex justify-content-between"lp>', //Paginacion
      language: {
        lengthMenu:
          `<select class="form-select">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>`,
        zeroRecords: "No se encontraron resultados",
        paginate: {
          first: '<i class="bi-chevron-double-left"></i>',
          previous: '<i class="bi-chevron-left"></i>',
          next: '<i class="bi-chevron-right"></i>',
          last: '<i class="bi-chevron-double-right"></i>'
        }
      },
      //Uso de botones para exportar
      buttons: [
        {
          extend: 'excel',
          text: 'Excel',
          className: 'btn btn-success export-excel-btn',
          title: 'Listado de Denuncias',
          exportOptions: {
            columns: [0, 1, 2, 3], //Esto indica que columnas se van a exportar
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
        }
      ]
    });


    //Triggers para los botones de exportacion
    $('#exportExcelBtn').on('click', function () {
      table.button('.buttons-excel').trigger();
    });

    $('#exportPdfBtn').on('click', function () {
      table.button('.buttons-pdf').trigger();
    });
  }


  //Metodo para manejar la busqueda
  onSearch(event: any) {
    const searchValue = event.target.value;

    //Comprobacion de 3 o mas caracteres (No me gusta pero a Santoro si :c)
    if (searchValue.length >= 3) {
      this.table.search(searchValue).draw();
    } else if (searchValue.length === 0) {
      this.table.search('').draw();
    }
  }


  //Metodo para filtrar la tabla en base a las 2 fechas
  filterDate() {
    const startDate = this.filterDateStart ? new Date(this.filterDateStart) : null;
    const endDate = this.filterDateEnd ? new Date(this.filterDateEnd) : null;

    this.filterComplaint = this.Complaint.filter(complaint => {
      const complaintDate = new Date(complaint.createdDate);

      if (isNaN(complaintDate.getTime())) {
        console.warn(`Fecha no valida: ${complaint.createdDate}`);
        return false;
      }

      // omprobar límites de fecha
      const afterStartDate = !startDate || complaintDate >= startDate;
      const beforeEndDate = !endDate || complaintDate <= endDate;

      return afterStartDate && beforeEndDate; //Retorna verdadero solo si ambas condiciones se cumplen
    });

    this.updateDataTable();
  }

  //Switch para manejar el estilo de los estados
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


  // Metodo para obtener el estado de la denuncia y mostrar el modal
  changeState(option: string, idComplaint: number, userId: number) {
    this.complaintState = option;
    this.openModal(idComplaint, userId);
  }


  //Metodos propios de nuestro micro:
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Consulta del listado
  refreshData() {
    this.complaintService.getAllComplains().subscribe((data) => {
      this.Complaint = data;
      this.filterComplaint = [...data];
      this.updateDataTable();
    });
  }


  //Carga del combo de estados para el filtro
  getTypes(): void {
    this.complaintService.getState().subscribe({
      next: (data) => {
        this.states = Object.keys(data).map(key => ({
          key,
          value: data[key]
        }));
      },
      error: (error) => {
        console.error('error: ', error);
      }
    })
  }


  redirect(path: string){
    this.router.navigate([path]);
  }

  //Metodo para abrir modal de confirmacion de cambio de estado
  openModal(idComplaint: number, userId: number) {
    const modal = this._modal.open(PenaltiesModalStateReasonComponent, {
      size: 'md',
      keyboard: false,
    });
    modal.componentInstance.idComplaint = idComplaint;
    modal.componentInstance.complaintState = this.complaintState;
    modal.componentInstance.userId = userId;
    modal.result
      .then((result) => {
        this.refreshData();
      })
      .catch((error) => {
        console.log("Error con modal: " + error);
      });
  }

  //Metodo para abrir el modal getById
  viewComplaint(i: number) {
    const modal = this._modal.open(PenaltiesModalConsultComplaintComponent, {
      size: 'xl',
      keyboard: false,
    });
    modal.componentInstance.denunciaId = i;
    modal.result
      .then((result) => { })
      .catch((error) => {
        console.log('Modal dismissed with error:', error);
      });
  }

}

