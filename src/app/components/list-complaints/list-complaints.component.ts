import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConsultarDenunciaModalComponent } from '../consultar-denuncia-modal/consultar-denuncia-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Complaint, ComplaintDto } from '../../models/complaint';
import { ComplaintService } from '../../services/complaint.service';
import { ChangeStateButtonComponent } from "../change-state-button/change-state-button.component";

@Component({
  selector: 'app-list-complaints',
  standalone: true,
  imports: [CommonModule, RouterLink, ConsultarDenunciaModalComponent, ChangeStateButtonComponent],
  templateUrl: './list-complaints.component.html',
  styleUrl: './list-complaints.component.scss'
})
export class ListComplaintsComponent implements OnInit {
  denuncias: ComplaintDto[]=[];

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
