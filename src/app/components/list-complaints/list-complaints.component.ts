import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ConsultarDenunciaModalComponent } from '../consultar-denuncia-modal/consultar-denuncia-modal.component';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Complaint, ComplaintDto } from '../../models/complaint';
import { ComplaintService } from '../../services/complaint.service';

import { ModalStateReasonComponent } from '../modal-state-reason/modal-state-reason.component';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-complaints',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, ConsultarDenunciaModalComponent ,FormsModule,NgbModule,
    NgbPaginationModule,],
  templateUrl: './list-complaints.component.html',
  styleUrl: './list-complaints.component.scss'
})
export class ListComplaintsComponent implements OnInit {
  denuncias: ComplaintDto[]=[];
  complaintState: String = ""
  denunciasfiltro: ComplaintDto[]=[];
  page:number=1;
  pageSize:number = 10;
  collectionSize:number=0;

constructor(private router: Router,private _modal:NgbModal, private complServ: ComplaintService){

}
  ngOnInit(): void {
    this.refreshData()
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
  
    if (filterValue) {
      this.denunciasfiltro = this.denuncias.filter((p) => {
        const complaintStateStr = p.complaintState.toLowerCase();
        const descriptionStr = p.description.toLowerCase();
  
        return (
          complaintStateStr.indexOf(filterValue) >= 0 || 
          descriptionStr.indexOf(filterValue) >= 0
        );
      });
    } else {
      
      this.denunciasfiltro = [...this.denuncias];
    }
  }


  
  modalConsulta(i:number){
    const modal = this._modal.open(ConsultarDenunciaModalComponent, { size: 'xl' ,  keyboard: false });
      modal.componentInstance.denunciaId =i ; 
      modal.result.then((result) => {
      
      }).catch((error) => {
        console.log('Modal dismissed with error:', error);
      });
  }
  
  refreshData() {
    this.complServ.getAllComplains().subscribe(data=>{
      this.denuncias=data
      this.denunciasfiltro = [...data];
      this.collectionSize = data.length; 
      this.denuncias= data.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
      this.denuncias.forEach((actividad) => {
       
        if (Array.isArray(actividad.createdDate)) {
          const [year, month, day, hour, minute, second] = actividad.createdDate;
          actividad.createdDate = new Date(year, month - 1, day, hour, minute, second); 
        }
      });
     
    })
  }

  // Metodo para obtener el estado de la denuncia y mostrar el modal 
  selectState(option: string, idComplaint: number,userId:number) {
    this.complaintState = option
    this.openModal(idComplaint,userId)
  }
  openModal(idComplaint:number, userId:number){
    const modal = this._modal.open(ModalStateReasonComponent, { size: 'sm' ,  keyboard: false });
    modal.componentInstance.idComplaint = idComplaint
    modal.componentInstance.complaintState = this.complaintState
    modal.componentInstance.userId = userId
    modal.result.then((result) => {
    }).catch((error) => {
      console.log('Modal dismissed with error:', error);
    });
  }



  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'Anexada':
        return 'btn-secondary';
      case 'Nuevo':
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
