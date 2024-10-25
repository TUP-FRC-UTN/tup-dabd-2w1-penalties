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
  sanctionsfilter : any[]=[];
  sanctions : any[]=[];
  selectedValue: string = '';
  states : { key: string; value: string }[] = [];
  filterDateStart: Date = new Date();
  filterDateEnd: Date = new Date();

  constructor(private reportServodes: PenaltiesSanctionsServicesService,private _modal:NgbModal, private router:Router){
    //Esto es importante para llamar los funciones dentro del data table con onClick
    // (window as any).viewComplaint = (id: number) => this.viewComplaint(id);
    // (window as any).selectState = (state: string, id: number, userId: number) =>
    //   this.selectState(state, id, userId);
  }

  ngOnInit(): void {
    this.refreshData()

    //Esto es para acceder al metodo desde afuera del datatable
    const that = this; // para referenciar metodos afuera de la datatable
    $('#sanctionsTable').on('click', 'a.dropdown-item', function(event) {
      const action = $(this).data('action');
      const id = $(this).data('id');
  
      switch(action) {
        case 'newDisclaimer':
          that.newDisclaimer(id);
          break;
        case 'seeDisclaimer':
          that.seeDisclaimer(id);
          break;
      }
    });

  }

  refreshData(){
    this.reportServodes.getAllSactions().subscribe(
      response=>{
        this.sanctions = response;
        this.sanctionsfilter=this.sanctions;
        this.CreateDataTable()
      },error=>{
        alert(error)
      }
    )
  }

  CreateDataTable(){
    if ($.fn.dataTable.isDataTable('#sanctionsTable')) {//creo que es por la funcion
      $('#sanctionsTable').DataTable().clear().destroy();
    }

  let table = $('#sanctionsTable').DataTable({
      data: this.sanctionsfilter,
      columns: [
        {data: 'createdDate',
          render: (data) => this.reportServodes.formatDate(data),
        },
          {
              data: 'fineState',
              render: (data) => {
                //Si es advertencia
                const displayValue = data === null ? 'Advertencia' : data;
                return `<div class="d-flex justify-content-center"><div class="${this.getStatusClass(data)} btn w-75 text-center border rounded-pill">${displayValue}</div></div>`;
            } },
          { data: 'plotId', render : (data)=> ` <div class="text-start">Nro: ${data}</div>`},
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
 
  $('#exportExcelBtn').on('click', function() {
    table.button('.buttons-excel').trigger(); 
  });

  $('#exportPdfBtn').on('click', function() {
    table.button('.buttons-pdf').trigger(); 
  });

  }


  newDisclaimer(id: number) {
    this.router.navigate([`/home/sanctions/postDisclaimer/${id}`])
  }

  seeDisclaimer(id:number){
    alert('No implementado!')
  }

  filterDate() {
    const startDate = this.filterDateStart
    ? new Date(this.filterDateStart)
    : null;
    const endDate = this.filterDateEnd ? new Date(this.filterDateEnd) : null;

    this.sanctionsfilter = this.sanctions.filter((sanctions) => {
    let complaintDate;

    complaintDate = new Date(sanctions.createdDate);

    if (isNaN(complaintDate.getTime())) {
      console.warn(`Fecha de queja no válida: ${sanctions.createdDate}`);
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


    this.CreateDataTable(); // Actualizar la tabla con los datos filtrados
  }

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
    this.reportServodes.getState().subscribe({
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
