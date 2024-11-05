import { Component, OnInit } from '@angular/core';
import { PenaltiesSanctionsServicesService } from '../../../services/sanctionsService/sanctions.service';
import { ReportDTO } from '../../../models/reportDTO';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PenaltiesModalReportComponent } from '../modals/penalties-get-report-modal/penalties-get-report-modal.component';
// Imports de DataTable con soporte para Bootstrap 5
import $ from 'jquery';
import 'datatables.net-bs5'; // DataTables con Bootstrap 5
import 'datatables.net-buttons-bs5'; // Botones con estilos de Bootstrap 5
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';



@Component({
  selector: 'app-penalties-sanctions-report-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbModule],
  templateUrl: './penalties-list-report.component.html',
  styleUrl: './penalties-list-report.component.scss'
})
export class PenaltiesSanctionsReportListComponent implements OnInit {
  //Variables
  report: ReportDTO[] = [];                       //
  reportfilter: ReportDTO[] = [];                 //
  filterDateStart: Date = new Date();             //
  filterDateEnd: Date = new Date();               //
  states: { key: string; value: string }[] = [];  //
  table: any;                                     //Tabla base
  searchTerm: string = '';                        //Valor de la barra de busqueda


  //Constructor
  constructor(private reportServodes: PenaltiesSanctionsServicesService, private _modal: NgbModal, private router: Router) {
    (window as any).viewComplaint = (id: number) => this.viewComplaint(id);
    (window as any).editReport = (id: number) => this.editReport(id);
  }


  //Init
  ngOnInit(): void {
    this.filterDateStart.setDate(this.filterDateStart.getDate() - 30);
    this.refreshData()

    this.getTypes()

    const that = this; // para referenciar metodos afuera de la datatable

    // Sets up event listeners for the DataTable.
    $('#reportsTable').on('click', 'a.dropdown-item', function(event) {
      const action = $(this).data('action');
      const id = $(this).data('id');
  
      switch(action) {
        case 'newSaction':
          that.newSanction(id);
          break;
      }
    })
  }


  // Filters reports based on the selected state.
  // 
  // Param 'event' - The event triggered by selecting a new state.
  onFilter(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    // Filters the reports based on the selected state.
    this.reportfilter = this.report.filter(
      (c) => c.reportState == selectedValue
    );

    // Resets the filter if no value is selected.
    if (selectedValue == '') {
      this.reportfilter = this.report;
    }

    // Updates the DataTable with the filtered data.
    this.updateDataTable();
  }


  // Configures the DataTable display properties and loads data.
  updateDataTable() {
    // Clears existing DataTable if it is already initialized.
    if ($.fn.dataTable.isDataTable('#reportsTable')) {
      $('#reportsTable').DataTable().clear().destroy();
    }

    // Initializes DataTable with specific settings.
    let table = this.table = $('#reportsTable').DataTable({
      // DataTable settings
      paging: true,
      searching: true,
      ordering: true,
      lengthChange: true,
      order: [0, 'asc'],
      lengthMenu: [5,10, 25, 50],
      pageLength: 5,
      data: this.reportfilter, // Data Source
      //Table columns
      columns: [
        {
          data: 'createdDate',
          className: 'align-middle',
          render: (data) =>
            `<div>${data}</div>`
        },
        {
          data: 'reportState',
          className: 'align-middle',
          render: (data) =>
            `<div class="btn ${this.getStatusClass(data)} border rounded-pill w-75">${data}</div>`
        },
        {
          data: 'plotId',
          className: 'align-middle',
          render: (data) =>
            `<div>Nro: ${data}</div>`
        },
        {
          data: 'description',
          className: 'align-middle',
          render: (data) =>
            `<div>${data}</div>`
        },
        {
          data: null,
          className: 'align-middle',
          searchable: false, //This is to avoid searching in this column.
          render: (data) =>
            `<div class="text-center">
              <div class="btn-group">
                <div class="dropdown">
                  <button type="button" class="btn border border-2 bi-three-dots-vertical" data-bs-toggle="dropdown"></button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" onclick="viewComplaint(${data.id})">Ver más</a></li>
                    ${data.reportState === 'Abierto' || data.reportState === 'Nuevo' || data.reportState === 'Pendiente' ?
                      `<li><hr class="dropdown-divider"></li> <li><a class="dropdown-item" onclick="editReport(${data.id})">Modificar informe</a></li>` : ''}
                      ${data.reportState === 'Abierto' || data.reportState === 'Pendiente' ?
                        `<li><a class="dropdown-item" data-action="newSaction" data-id="${data.id}"">Nueva Infracción</a></li>` : ''}
                  </ul>
                </div>
              </div>
            </div>`
        },
        // {
        //   data: null,
        //   className: 'align-middle',
        //   render: (data) =>
        //     `<div class="text-center">
        //       <input class="form-check-input border border-2 p-2" type="checkbox" value="" id="flexCheckDefault">
        //     </div>`
        // },
      ],
      dom:
        '<"mb-3"t>' +                           //Table
        '<"d-flex justify-content-between"lp>', //Pagination
      language: {
        lengthMenu:
          `<select class="form-select">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>`,
        zeroRecords: "No se encontraron resultados",
        loadingRecords: "Cargando...",
        processing: "Procesando...",
      },
      //Uso de botones para exportar
      buttons: [
        {
          extend: 'excel',
          text: 'Excel',
          className: 'btn btn-success export-excel-btn',
          title: 'Listado de Denuncias',
          exportOptions: {
            columns: [0, 1, 2, 3], //This indicates the columns that will be exported to excel.
          },
        },
        {
          extend: 'pdf',
          text: 'PDF',
          className: 'btn btn-danger export-pdf-btn',
          title: 'Listado de denuncias',
          exportOptions: {
            columns: [0, 1, 2, 3], //This indicates the columns that will be exported to pdf.
          },
        }
      ]
    });

    //These methods are used to export 
    //the table data to Excel and PDF.

    //They are activated by
    //clicks in the buttons.

    //Returns the table data exported 
    //to the desired format.
    $('#exportExcelBtn').on('click', function () {
      table.button('.buttons-excel').trigger();
    });

    $('#exportPdfBtn').on('click', function () {
      table.button('.buttons-pdf').trigger();
    });
  }

  //Method to search in the table
  //based on the search term.

  //Param 'event' is the event 
  //that triggers the method.

  //Returns the table filtered.
  onSearch(event: any) {
    const searchValue = event.target.value;

    
    //Checks if the search term has 3 or more characters.
    if (searchValue.length >= 3) {
      this.table.search(searchValue).draw();
    } else if (searchValue.length === 0) {
      this.table.search('').draw();
    }
  }


  //Method to filter the table
  //based on the 2 dates.

// Modifica el método filterDate()
filterDate() {
  const startDate = this.filterDateStart ? new Date(this.filterDateStart) : null;
  const endDate = this.filterDateEnd ? new Date(this.filterDateEnd) : null;

  // Si no hay fechas seleccionadas, mantener todos los registros
  if (!startDate && !endDate) {
    this.reportfilter = this.report;
    return;
  }

  this.reportfilter = this.report.filter(item => {
    const date = new Date(item.createdDate);

    if (isNaN(date.getTime())) {
      console.warn(`Fecha no válida: ${item.createdDate}`);
      return false;
    }

    //Checks if the date is between the start and end date.
    const afterStartDate = !startDate || date >= startDate;
    const beforeEndDate = !endDate || date <= endDate;

    return afterStartDate && beforeEndDate;
  });

  // Solo actualizamos la tabla si ya está inicializada
  if ($.fn.dataTable.isDataTable('#reportsTable')) {
    this.updateDataTable();
  }
}


  // Modifica el método refreshData()
  refreshData() {
    this.reportServodes.getAllReports().subscribe({
      next: (response) => {
        this.report = response;
        this.reportfilter = this.report;
        // Primero aplicamos el filtro de fecha si hay fechas seleccionadas
        if (this.filterDateStart || this.filterDateEnd) {
          this.filterDate();
        }
        // Luego actualizamos la tabla con los datos ya filtrados
        this.updateDataTable();
      },
      error: (error) => {
        alert(error);
      }
    });
  }
  selectedState: string = '';
  //This method is used to return the 
  //filters to their default values.
  eraseFilters(){
    this.refreshData();
    this.selectedState = '';
    this.searchTerm = '';
  }
  
  // Navigates to the new sanction page for the selected report.
  newSanction(id: number) {
    this.router.navigate([`/home/sanctions/postFine/${id}`])
  }































  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // Navigates to the report 
  // editing page.
  editReport(id: number) {
    const selectedReport = this.report.find(report => report.id === id);

    if (selectedReport) {
      this.router.navigate(['/home/sanctions/putReport'], {
        queryParams: {
          id: selectedReport.id,
          createdDate: selectedReport.createdDate,
          reportState: selectedReport.reportState,
          plotId: selectedReport.plotId,
          description: selectedReport.description
        }
      });
    }
  }

  showReport(id: number) {
    const selectedReport = this.report.find(report => report.id === id);

    if(selectedReport) {
      this.router.navigate(['/home/sanctions/postFine'], {
        queryParams: {
          id: selectedReport.id,
          reportState: selectedReport.reportState,
          plotId: selectedReport.plotId,
          description: selectedReport.description,
          createdDate: selectedReport.createdDate,
          baseAmount: selectedReport.baseAmount
        }
      });
    }
  }

  CreateDataTable() {
    if ($.fn.dataTable.isDataTable('#reportsTables')) {//creo que es por la funcion
      $('#reportsTables').DataTable().clear().destroy();
    }

    let table = $('#reportsTables').DataTable({
      data: this.reportfilter,
      columns: [
        {
          data: 'createdDate',
          render: (data) => this.reportServodes.formatDate(data),
        },
        {
          data: 'reportState',
          render: (data) => `<div class="d-flex justify-content-center"><div class="${this.getStatusClass(data)} btn w-75 text-center border rounded-pill" >${data}</div></div>`
        },
        { data: 'plotId', render: (data) => ` <div class="text-start">Nro: ${data}</div>` },
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
                            <li><hr class="dropdown-divider"></li>
                            
                        </ul>
                    </div>
                </div>`,
        }
      ],
      paging: true,
      pageLength: 10,
      lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
      dom: 't<"d-flex justify-content-between"<lf>"d-flex justify-content-between"p>',
      searching: false,
      language: {
        lengthMenu: '<select class="form-select">' +
          '<option value="5">5</option>' +
          '<option value="10">10</option>' +
          '<option value="25">25</option>' +
          '<option value="50">50</option>' +
          '<option value="-1">All</option>' +
          '</select>'
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


  viewComplaint(i: number) {
    const modal = this._modal.open(PenaltiesModalReportComponent, {
      size: 'xl',
      keyboard: false,
    });
    modal.componentInstance.id = i;
    modal.result
      .then((result) => { })
      .catch((error) => {
        console.log('Modal dismissed with error:', error);
      });
  }




  // Loads the list of report 
  // states for selection.
  getTypes(): void {
    this.reportServodes.getState().subscribe({
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


  // Assigns a color class to a report 
  // status based on its value.
  getStatusClass(estado: string): string {
    switch (estado) {
      case 'Pendiente':
        return 'text-bg-warning';
      case 'Abierto':
        return 'text-bg-success';
      case 'Cerrado':
        return 'text-bg-danger';
      case 'Rechazado':
        return 'text-bg-secondary';
      case 'Finalizado':
        return 'text-bg-primary';
      default:
        return '';
    }
  }

  redirect(path: string) {
    this.router.navigate([path]);
  }



}
