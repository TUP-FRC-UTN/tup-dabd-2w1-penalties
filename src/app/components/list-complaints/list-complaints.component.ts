import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConsultarDenunciaModalComponent } from '../consultar-denuncia-modal/consultar-denuncia-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Complaint, ComplaintDto } from '../../models/complaint';
import { ComplaintService } from '../../services/complaint.service';
import { ModalStateReasonComponent } from '../modal-state-reason/modal-state-reason.component';

@Component({
  selector: 'app-list-complaints',
  standalone: true,
  imports: [CommonModule, RouterLink, ConsultarDenunciaModalComponent, ModalStateReasonComponent],
  templateUrl: './list-complaints.component.html',
  styleUrl: './list-complaints.component.scss'
})
export class ListComplaintsComponent implements OnInit {
  denuncias: ComplaintDto[]=[];
  complaintState: String = ""

constructor(private router: Router,private _modal:NgbModal, private complServ: ComplaintService){

}
  ngOnInit(): void {
    this.complServ.getAllComplains().subscribe(data=>{
      this.denuncias=data
      this.denuncias.forEach((actividad) => {
        // Verificar si createdDate es un array antes de intentar convertirlo
        if (Array.isArray(actividad.createdDate)) {
          const [year, month, day, hour, minute, second] = actividad.createdDate;
          actividad.createdDate = new Date(year, month - 1, day, hour, minute, second); // El mes en JavaScript es 0 indexado
        }
      });
     
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue!=""){
      this.denuncias = this.denuncias.filter((p) => {
        const idProyectoStr = p.complaintState.toString().toLowerCase(); 
        const clienteStr = p.description.toLowerCase();
        const filterValueLower = filterValue.toLocaleLowerCase();
      
        return idProyectoStr.indexOf(filterValueLower) >= 0 || clienteStr.indexOf(filterValueLower) >= 0;
      });
    }else{
       this.denuncias
    }
    
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
