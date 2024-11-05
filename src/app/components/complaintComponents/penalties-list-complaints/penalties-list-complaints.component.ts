import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Imports de DataTable con soporte para Bootstrap 5
import $ from 'jquery';
import 'datatables.net-bs5'; // DataTables con Bootstrap 5
import 'datatables.net-buttons-bs5'; // Botones con estilos de Bootstrap 5
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';

//Si los estilos fallan (sobretodo en la paginacion) usen estos comandos
// npm uninstall datatables.net
// npm uninstall datatables.net-dt
// npm uninstall datatables.net-buttons-dt

// npm cache clean --force

// npm install datatables.net-bs5
// npm install datatables.net-buttons-bs5

//Imports propios de multas
import { PenaltiesModalConsultComplaintComponent } from '../modals/penalties-get-complaint-modal/penalties-get-complaint.component';
import { PenaltiesModalStateReasonComponent } from '../modals/penalties-update-stateReason-modal/penalties-update-stateReason-modal.component';
import { ComplaintService } from '../../../services/complaintsService/complaints.service';
import { ComplaintDto } from '../../../models/complaint';

@Component({
  selector: 'app-penalties-list-complaint',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbModule],
  templateUrl: './penalties-list-complaints.component.html',
  styleUrl: './penalties-list-complaints.component.scss',
})
export class PenaltiesListComplaintComponent implements OnInit {
  //Variables
  Complaint: ComplaintDto[] = [];                 //Data Souce
  filterComplaint: ComplaintDto[] = [];           //Data Source to show (filtered)
  // filterDateStart: Date = new Date();             //Start Date value
  // filterDateEnd: Date = new Date();               //End Date value
  states: { key: string; value: string }[] = [];  //States array for the select
  table: any;                                     //Base table
  searchTerm: string = '';                        //Search bar value

  filterDateStart: string=''; //Start Date value

filterDateEnd: string =''; //End Date value


  //Init
  ngOnInit(): void {
    this.refreshData();
    this.getTypes()

     const today = new Date();
    this.filterDateEnd = this.formatDateToString(today);

    const previousMonthDate = new Date();
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    this.filterDateStart = this.formatDateToString(previousMonthDate);
  }

  // This method is used to convert
  //a date to a formatted string.

  //Param 'date' is the date to convert.
  
  //Returns the date in this 
  //string format: `YYYY-MM-DD`.
  private formatDateToString(date: Date): string {
    return date.toISOString().split('T')[0];
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

  //This method is used to 
  //update the table.

  //If the table is already created, it 
  //is destroyed and created again.
  updateDataTable() {
    if ($.fn.dataTable.isDataTable('#complaintsTable')) {
      $('#complaintsTable').DataTable().clear().destroy();
    }

    let table = this.table = $('#complaintsTable').DataTable({
      //These are the 
      //table attributes.
      paging: true,
      searching: true,
      ordering: true,
      lengthChange: true,
      order: [0, 'asc'],
      lengthMenu: [5,10, 25, 50],
      pageLength: 5,
      data: this.filterComplaint, //Data source

      //Table columns
      columns: [
        {
          data: 'createdDate',
          className: 'align-middle',
          render: (data) =>
            `<div>${this.complaintService.formatDate(data)}</div>`
        },
        {
          data: 'complaintState',
          className: 'align-middle',
          render: (data) =>
            `<div class="btn ${this.getStatusClass(data)} border rounded-pill w-75">${data}</div>`
        },
        {
          data: 'description',
          className: 'align-middle',
          render: (data) =>
            `<div>${data}</div>`
        },
        {
          data: 'fileQuantity',
          className: 'align-middle',
          render: (data) =>
            `<i class="bi bi-paperclip"></i> ${data} Archivo adjunto`
        },
        {
          data: null,
          className: 'align-middle',
          searchable: false, //This is false to indicate 
          render: (data) =>  //that this column is not searchable.
            `<div class="text-center">
              <div class="btn-group">
                <div class="dropdown">
                  <button type="button" class="btn border border-2 bi-three-dots-vertical" data-bs-toggle="dropdown"></button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" onclick="viewComplaint(${data.id})">Ver más</a></li>
                    ${data.complaintState !== "Rechazada" ? `
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item" onclick="changeState('ATTACHED', ${data.id}, ${data.userId})">Marcar como Anexada</a></li>
                      <li><a class="dropdown-item" onclick="changeState('REJECTED', ${data.id}, ${data.userId})">Marcar como Rechazada</a></li>
                      <li><a class="dropdown-item" onclick="changeState('PENDING', ${data.id}, ${data.userId})">Marcar como Pendiente</a></li>` : ``}                      
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
      //This sets the buttons to export 
      //the table data to Excel and PDF.
      buttons: [
        {
          extend: 'excel',
          text: 'Excel',
          className: 'btn btn-success export-excel-btn',
          title: 'Listado de Denuncias',
          exportOptions: {
            columns: [0, 1, 2, 3], //This indicates the columns that will be exported to Excel.
          },
        },
        {
          extend: 'pdf',
          text: 'PDF',
          className: 'btn btn-danger export-pdf-btn',
          title: 'Listado de denuncias',
          exportOptions: {
            columns: [0, 1, 2, 3], //This indicates the columns that will be exported to PDF.
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

  //Returns true only if the complaint
  //date is between the 2 dates.
  filterDate() {
    const startDate = this.filterDateStart ? new Date(this.filterDateStart) : null;
    const endDate = this.filterDateEnd ? new Date(this.filterDateEnd) : null;

    this.filterComplaint = this.Complaint.filter(item => {
      const date = new Date(item.createdDate);

      if (isNaN(date.getTime())) {
        console.warn(`Fecha no valida: ${item.createdDate}`);
        return false;
      }

      //Checks if the date is between the start and end date.
      const afterStartDate = !startDate || date >= startDate;
      const beforeEndDate = !endDate || date <= endDate;

      return afterStartDate && beforeEndDate; //Returns true only if both conditions are met.
    });

    this.updateDataTable();
  }
      //This method filters the table 
      //by the complaint state.

      //Param 'event' is the event 
      //that triggers the method.

      //Updates the table using the filters.
    onFilter(event: Event) {
      const selectedValue = (event.target as HTMLSelectElement).value;

      this.filterComplaint = this.filterComplaint.filter(
        (c) => c.complaintState == selectedValue
      );
      if (selectedValue == '') {
        this.filterComplaint = this.Complaint;
      }

      this.updateDataTable();
    }

  
  //This method is used to get
  //styles based on the complaint state.

  //Param 'estado' is the 
  //complaint state.

  //Returns the class for the state.
  getStatusClass(estado: string): string {
    switch (estado) {
      case 'Anexada':
        return 'text-bg-primary';
      case 'Nueva':
        return 'text-bg-info';
      case 'Pendiente':
        return 'text-bg-secondary';
      case 'Rechazada':
        return 'text-bg-danger';
      default:
        return '';
    }
  }


  // Method to get the complaint 
  // state and show the modal.

  // Param 'option' is the new state that the complaint is
  // being changed to (e.g., "ATTACHED", "REJECTED", "PENDING").
  // Param 'idComplaint' is the complaint id.
  // Param 'userId' is the user id 
  // associated with the complaint.

  //Returns the modal to change the state.
  changeState(option: string, idComplaint: number, userId: number) {
    const newState = option;
    this.openModal(idComplaint, userId, newState);
  }


  //Metodos propios de nuestro micro:
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //List queries.
  //This method is used to 
  //refresh the data in the table.
  refreshData() {
    this.complaintService.getAllComplaints().subscribe((data) => {
      this.Complaint = data;
      this.filterComplaint = [...data];
      this.updateDataTable();
      this.filterDate()
    });
  }

  selectedState: string = '';
  //This method is used to return the 
  //filters to their default values.
  eraseFilters(){
    this.refreshData();
    this.selectedState = '';
    this.searchTerm = '';
    this.resetDates();
  }


  //Resets the date filters.
  resetDates(){
    const today = new Date();
    this.filterDateEnd = this.formatDateToString(today);

    const previousMonthDate = new Date();
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    this.filterDateStart = this.formatDateToString(previousMonthDate);
  }


  //Loads the 'states' array with 
  //the complaint states for the filter.
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


  //Method to redirect 
  //to another route.

  //Param 'path' is the 
  //route to redirect to.
  redirect(path: string) {
    this.router.navigate([path]);
  }


  //Opens the modal to change 
  //the complaint state.

  //Param 'idComplaint' is the id of the complaint
  //that's going to be visualized in the modal.
  //Param 'userId' is the user id 
  //which the complaint belongs to.
  //Param 'complaintState' is the 
  //current state of the complaint.

  openModal(idComplaint: number, userId: number, complaintState: string) {
    const modal = this._modal.open(PenaltiesModalStateReasonComponent, {
      size: 'md',
      keyboard: false,
    });
    modal.componentInstance.idComplaint = idComplaint;
    modal.componentInstance.complaintState = complaintState;
    modal.componentInstance.userId = userId;
    modal.result
      .then((result) => {
        this.refreshData();
      })
      .catch((error) => {
        console.log("Error con modal: " + error);
      });
  }

  //Opens the modal to 
  //get the complaint by id.

  //Param 'i' is the 
  //complaint id.
  viewComplaint(i: number) {
    const modal = this._modal.open(PenaltiesModalConsultComplaintComponent, {
      size: 'xl',
      keyboard: false,
    });
    modal.componentInstance.denunciaId = i;
    modal.result
      .then((result) => { this.refreshData() })
      .catch((error) => {
        console.log('Modal dismissed with error:', error);
      });
  }

}

