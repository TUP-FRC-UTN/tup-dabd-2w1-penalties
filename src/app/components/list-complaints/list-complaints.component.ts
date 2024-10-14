import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConsultarDenunciaModalComponent } from '../modal-complaint/consultar-denuncia-modal.component';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ComplaintDto } from '../../models/complaint';
import { ComplaintService } from '../../services/complaint.service';

import { ModalStateReasonComponent } from '../modal-state-reason/modal-state-reason.component';

import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import 'datatables.net'

@Component({
  selector: 'app-list-complaints',
  standalone: true,
  imports: [CommonModule, RouterModule, ConsultarDenunciaModalComponent ,FormsModule,NgbModule,
    NgbPaginationModule,],
  templateUrl: './list-complaints.component.html',
  styleUrl: './list-complaints.component.scss'
})
export class ListComplaintsComponent implements OnInit {
  Complaint: ComplaintDto[]=[];
  complaintState: String = ""
  filterComplaint: ComplaintDto[]=[];
  page:number=1;
  pageSize:number = 5;
  collectionSize:number=0;
  filterDateStart:Date = new Date
  filterDateEnd:Date = new Date

constructor(private router: Router,private _modal:NgbModal, private complServ: ComplaintService){

}
  ngOnInit(): void {
   
    this.makeFunctionsGlobal();
    this.refreshData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim(); // Añadido trim()
  
    if (filterValue) {
      this.filterComplaint = this.Complaint.filter((p) => {
        // Asegúrate que formatDate retorne una fecha en el formato DD/MM/YYYY
        let fecha = this.formatDate(p.createdDate);
        
        const complaintStateStr = p.complaintState.toLowerCase().trim(); // Añadido trim()
        const descriptionStr = p.description.toLowerCase().trim(); // Añadido trim()
        // No necesitas convertir fecha de nuevo a Date
        const fechaStr = fecha ? fecha : ''; // Aquí asumimos que formatDate ya devuelve DD/MM/YYYY
        
        console.log(p.createdDate); // Para depuración
  
        return (
          complaintStateStr.includes(filterValue) || // Usando includes
          descriptionStr.includes(filterValue) ||    // Usando includes
          fechaStr.includes(filterValue)              // Comparando directamente
        );
      });
    } else {
      this.filterComplaint = [...this.Complaint];
    }
  
    this.updateDataTable();
  }
  
  

  refreshData() {
    this.complServ.getAllComplains().subscribe(data => {
      this.Complaint = data;
      this.filterComplaint = [...data];
      this.collectionSize = data.length; 
      this.updateDataTable();
    });
  }
  makeFunctionsGlobal() {
    (window as any).viewComplaint = (id: number) => this.viewComplaint(id);
    (window as any).selectState = (state: string, id: number, userId: number) => this.selectState(state, id, userId);
  }
  
  updateDataTable() {
    // Reinicia la DataTable si ya existe
    if ($.fn.dataTable.isDataTable('#complaintsTable')) {
      $('#complaintsTable').DataTable().clear().destroy();
    }

    // Inicializa la DataTable
    let table= $('#complaintsTable').DataTable({
      data: this.filterComplaint,
      columns: [
        { data: 'createdDate', render: (data) => this.formatDate(data) }, // Formatear fecha
        {
          data: 'complaintState',
          render: (data) => `<button class="btn ${this.getStatusClass(data)} text-center border rounded-pill text-dark" style="width: 130px;">${data}</button>`
        },
        { data: 'description' },
        { data: 'fileQuantity', render: (data) => `<i class="bi bi-paperclip"></i> ${data} Archivo adjunto` },
        {
          data: null,
          render: (data) => `
             <div class="btn-group gap-2">
              <button type="button" class="btn btn-success" onclick="viewComplaint(${data.id})" style="border: 3px solid #1B4332;
                  background-color: #2D6A4F;
                  color: white;
                
                  width: 100px;
                  height: 50px;

                  border-radius: 15px;
                  display: flex; 
                  justify-content: center; 
                  align-items: center;
                  text-align: center;
                  padding: 0;">Ver más</button>
              <div class="dropdown">
                <button type="button" class="btn btn-success" data-bs-toggle="dropdown" aria-expanded="false" style=" border: 3px solid #1B4332;
                  background-color: #2D6A4F;
                  color: white;
                  
                  width: 50px;
                  height: 50px;

                  border-radius: 15px;
                  display: flex; 
                  justify-content: center; 
                  align-items: center;
                  text-align: center;
                  padding: 0;">•••</button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" onclick="selectState('ATTACHED', ${data.id}, ${data.userId})">Marcar como Anexada</a></li>
                  <li><a class="dropdown-item" onclick="selectState('REJECTED', ${data.id}, ${data.userId})">Marcar como Rechazada</a></li>
                  <li><a class="dropdown-item" onclick="selectState('PENDING', ${data.id}, ${data.userId})">Marcar como Pendiente</a></li>
                </ul>
              </div>
            </div>`
        }
      ],
      paging: true,
      pageLength: this.pageSize,
      searching: false // Deshabilitar la búsqueda global predeterminada
      //,dom: '<"top"i>rt<"bottom"flp><"clear">',
      
    });
    
  }

  formatDate(date: any): string {
    if (Array.isArray(date)) {
      const [year, month, day, hour, minute, second] = date;
      const createdDate = new Date(year, month - 1, day, hour, minute, second);
      return createdDate.toLocaleDateString('es-ES'); 
    }
    return new Date(date).toLocaleDateString('es-ES'); 
  }

  // Metodo para obtener el estado de la denuncia y mostrar el modal 
  selectState(option: string, idComplaint: number,userId:number) {
    this.complaintState = option
    this.openModal(idComplaint,userId)
  }
  
  openModal(idComplaint:number, userId:number){
    const modal = this._modal.open(ModalStateReasonComponent, { size: 'sm' ,  keyboard: false });
    modal.componentInstance.idComplaint = idComplaint
    console.log(idComplaint,this.complaintState)
    modal.componentInstance.complaintState = this.complaintState
    modal.componentInstance.userId = userId
    modal.result.then((result) => {
      this.refreshData() 
    }).catch((error) => {
      console.log('Modal dismissed with error:', error);
    });
  }
  
  viewComplaint(i:number){
    const modal = this._modal.open(ConsultarDenunciaModalComponent, { size: 'xl' ,  keyboard: false });
      modal.componentInstance.denunciaId =i ; 
      modal.result.then((result) => {
      
      }).catch((error) => {
        console.log('Modal dismissed with error:', error);
      });
  }


  getStatusClass(estado: string): string {
    switch (estado) {
      case 'Anexada':
        return 'btn-secondary';
      case 'Nueva':
        return 'btn-success';
      case 'Pendiente':
        return 'btn-warning';
      case 'Rechazada':
        return 'btn-danger';
      default:
        return '';
    }
  }
  onButtonClick() {
    this.router.navigate(['/nuevaDenuncia']);
  }
}
