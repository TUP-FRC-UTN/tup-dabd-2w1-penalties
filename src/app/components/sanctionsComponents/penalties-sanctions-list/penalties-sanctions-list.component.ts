import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PenaltiesSanctionsServicesService } from '../../../services/penalties-sanctions-services/penalties-sanctions-services.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-penalties-sanctions-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbModule, RouterModule],
  templateUrl: './penalties-sanctions-list.component.html',
  styleUrl: './penalties-sanctions-list.component.scss'
})
export class PenaltiesSanctionsListComponent implements OnInit {
  //Variables
  sanctionsfilter: any[] = [];                    //
  sanctions: any[] = [];                          //
  sanctionState: String = '';                     //
  selectedValue: string = '';                     //
  filterDateStart: Date = new Date();             //
  filterDateEnd: Date = new Date();               //
  states: { key: string; value: string }[] = [];  //
  table: any;                                     //Tabla base
  searchTerm: string = '';                        //Valor de la barra de busqueda


  //Init
  ngOnInit(): void {
    this.refreshData()

    //Esto es para acceder al metodo desde afuera del datatable
    const that = this; // para referenciar metodos afuera de la datatable
    $('#sanctionsTable').on('click', 'a.dropdown-item', function (event) {
      const action = $(this).data('action');
      const id = $(this).data('id');

      switch (action) {
        case 'newDisclaimer':
          that.newDisclaimer(id);
          break;
        case 'seeDisclaimer':
          that.seeDisclaimer(id);
          break;
      }
    });
  }


  //Constructor
  constructor(
    private router: Router,
    private _modal: NgbModal,
    private sanctionService: PenaltiesSanctionsServicesService,
  ) {
    //Esto es importante para llamar los funciones dentro del data table con onClick
    // (window as any).viewComplaint = (id: number) => this.viewComplaint(id);
    // (window as any).selectState = (state: string, id: number, userId: number) =>
    //   this.selectState(state, id, userId);
  }

  //Combo de filtrado de estado
  onFilter(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    this.sanctionsfilter = this.sanctions.filter(
      (c) => c.complaintState == selectedValue
    );
    if (selectedValue == '') {
      this.sanctionsfilter = this.sanctions;
    }

    this.updateDataTable();
  }


  ///////////////////////////////////////////////////////////////////////////////////////
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
      data: this.sanctionsfilter, //Fuente de datos
      //Columnas de la tabla
      columns: [
        {
          data: 'createdDate',
          render: (data) =>
            this.sanctionService.formatDate(data)
        },
        {
          data: 'fineState',
          render: (data) => {
            const displayValue = data === null ? 'Advertencia' : data;
            return `<div class="btn ${this.getStatusClass(data)} border rounded-pill w-75">${displayValue}</div>`
          }
        },
        {
          data: 'plotId', render: (data) =>
            `<div class="text-start">Nra: ${data}</div>`
        },
        {
          data: 'amount',
          render: (data) => {
            //Si es advertencia
            const amountValue = data != null ? '$' + data : '';
            return `<div class="text-start">${amountValue}</div>`;
          }
        },
        {
          data: 'description',  //Usar cuando tengan texto muy largo
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
            `<div class="btn-group gap-2">
              <div class="dropdown">
                <button type="button" class="btn btn-light border border-2 bi-three-dots-vertical" data-bs-toggle="dropdown"></button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" onclick="viewComplaint(${data.id})">Ver más</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" onclick="selectState('ATTACHED', ${data.id}, ${data.userId})">Marcar como Anexada</a></li>
                  <li><a class="dropdown-item" onclick="selectState('REJECTED', ${data.id}, ${data.userId})">Marcar como Rechazada</a></li>
                  <li><a class="dropdown-item" onclick="selectState('PENDING', ${data.id}, ${data.userId})">Marcar como Pendiente</a></li>
                  ${data.hasSubmittedDisclaimer ? `<li><a class="dropdown-item" data-action="seeDisclaimer" data-id="${data.id}"">Consultar Descargo</a></li>` : `<li><a class="dropdown-item" data-action="newDisclaimer" data-id="${data.id}"">Realizar Descargo</a></li>`}
              </ul>
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
  ///////////////////////////////////////////////////////////////////////////////////////


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

    this.sanctionsfilter = this.sanctions.filter(item => {
      const date = new Date(item.createdDate);

      if (isNaN(date.getTime())) {
        console.warn(`Fecha no valida: ${item.createdDate}`);
        return false;
      }

      // omprobar límites de fecha
      const afterStartDate = !startDate || date >= startDate;
      const beforeEndDate = !endDate || date <= endDate;

      return afterStartDate && beforeEndDate; //Retorna verdadero solo si ambas condiciones se cumplen
    });

    this.updateDataTable();
  }


  //ToDo: Esto esta desactualizado o son los de los informes (arreglar mas tarde)
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
        return 'text-bg-secondary';
      default:
        return '';
    }
  }

  refreshData() {
    this.sanctionService.getAllSactions().subscribe(
      response => {
        this.sanctions = response;
        this.sanctionsfilter = this.sanctions;
        this.CreateDataTable()
      }, error => {
        alert(error)
      }
    )
  }















  CreateDataTable() {
    if ($.fn.dataTable.isDataTable('#asd')) {//creo que es por la funcion
      $('#sanctionsTable').DataTable().clear().destroy();
    }

    let table = $('#sanctionsTable').DataTable({
      data: this.sanctionsfilter,
      columns: [
        {
          data: 'createdDate',
          render: (data) => this.sanctionService.formatDate(data),
        },
        {
          data: 'fineState',
          render: (data) => {
            //Si es advertencia
            const displayValue = data === null ? 'Advertencia' : data;
            return `<div class="d-flex justify-content-center"><div class="${this.getStatusClass(data)} btn w-75 text-center border rounded-pill">${displayValue}</div></div>`;
          }
        },
        {
          data: 'plotId', render: (data) =>
            `<div class="text-start">Nro: ${data}</div>`
        },
        {
          data: 'amount',
          render: (data) => {
            //Si es advertencia
            const amountValue = data != null ? '$' + data : '';
            return `<div class="text-start">${amountValue}</div>`;
          }
        },
        { data: 'description' },
        {
          data: null,
          render: (data) => {
            if (data.amount === null) {
              return '';
            }
            return `
                   <div class="btn-group gap-2">
                        <div class="dropdown">
                            <button type="button" class="btn btn-light border border-2 bi-three-dots-vertical" data-bs-toggle="dropdown"></button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" onclick="viewComplaint(${data.id})">Ver más</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" onclick="selectState('ATTACHED', ${data.id}, ${data.userId})">Marcar como Anexada</a></li>
                                <li><a class="dropdown-item" onclick="selectState('REJECTED', ${data.id}, ${data.userId})">Marcar como Rechazada</a></li>
                                <li><a class="dropdown-item" onclick="selectState('PENDING', ${data.id}, ${data.userId})">Marcar como Pendiente</a></li>
                                ${data.hasSubmittedDisclaimer ? `<li><a class="dropdown-item" data-action="seeDisclaimer" data-id="${data.id}"">Consultar Descargo</a></li>` : `<li><a class="dropdown-item" data-action="newDisclaimer" data-id="${data.id}"">Realizar Descargo</a></li>`}
                            </ul>
                        </div>
                    </div>`;
          }
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

  redirect(path: string) {
    this.router.navigate([path]);
  }

  newDisclaimer(id: number) {
    this.router.navigate([`/home/sanctions/postDisclaimer/${id}`])
  }

  seeDisclaimer(id: number) {
    alert('No implementado!')
  }

  // filterDate() {
  //   const startDate = this.filterDateStart
  //     ? new Date(this.filterDateStart)
  //     : null;
  //   const endDate = this.filterDateEnd ? new Date(this.filterDateEnd) : null;

  //   this.sanctionsfilter = this.sanctions.filter((sanctions) => {
  //     let complaintDate;

  //     complaintDate = new Date(sanctions.createdDate);

  //     if (isNaN(complaintDate.getTime())) {
  //       console.warn(`Fecha de queja no válida: ${sanctions.createdDate}`);
  //       return false;
  //     }

  //     console.log(`Fecha de queja: ${complaintDate}`);

  //     if (startDate && endDate) {
  //       return complaintDate >= startDate && complaintDate <= endDate;
  //     } else if (startDate) {
  //       return complaintDate >= startDate;
  //     } else if (endDate) {
  //       return complaintDate <= endDate;
  //     }

  //     return true;
  //   });


  //   this.CreateDataTable(); // Actualizar la tabla con los datos filtrados
  // }

  //filtro de los estados
  search(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log(this.sanctionsfilter);

    this.sanctionsfilter = this.sanctions.filter(
      (c) => c.reportState == selectedValue
    );
    if (selectedValue == '') {
      this.sanctionsfilter = this.sanctions;
    }
    // alert(this.filterComplaint)
    console.log(this.sanctionsfilter);
    this.CreateDataTable();
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .toLowerCase()
      .trim(); // Añadido trim()

    if (filterValue) {
      this.sanctionsfilter = this.sanctions.filter((p) => {
        const descriptionStr = p.description.toLowerCase().trim();
        const plotIdStr = p.plotId.toString().trim();
        return descriptionStr.includes(filterValue), plotIdStr.includes(filterValue);
      });
    } else {
      this.sanctionsfilter = [...this.sanctions];
    }

    this.CreateDataTable();
  }

  viewComplaint(i: number) {
    //   const modal = this._modal.open(PenaltiesModalReportComponent, {
    //     size: 'xl',
    //     keyboard: false,
    //   });
    //   modal.componentInstance.id = i;
    //   modal.result
    //     .then((result) => {})
    //     .catch((error) => {
    //       console.log('Modal dismissed with error:', error);
    //     });
  }




  getTypes(): void {
    this.sanctionService.getState().subscribe({
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

}
