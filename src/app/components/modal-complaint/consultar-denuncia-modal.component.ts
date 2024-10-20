import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComplaintService } from '../../services/complaint.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultar-denuncia-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultar-denuncia-modal.component.html',
  styleUrl: './consultar-denuncia-modal.component.scss'
})
export class ConsultarDenunciaModalComponent implements OnInit {
  
  @Input() denunciaId!: number;
  data:any;
  formattedDate:any;
  private service = inject(ComplaintService)

  constructor(public activeModal: NgbActiveModal){}

  ngOnInit(): void {
      console.log('Consiltar denuncia',this.denunciaId)
      this.getComplaint()
      
    //  console.log(this.setDate())
  }
  save(){
    this.activeModal.close()//aca podes agregar lo que se pasa
  }
  close(){
    this.activeModal.close()
  }
  setDate(){
    const dateArray :number[] = []
    for (let index = 0; index <this.data.createdDate.length; index++) {
      dateArray.push(this.data.createdDate[index])
    }
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5]);
     this.formattedDate = date.toISOString().split('T')[0];

  }
  getComplaint(){
    this.service.getById(this.denunciaId)
    .subscribe(
      (respuesta) => {
        console.log(respuesta); 
        this.data = respuesta
        this.setDate()
      },
      (error) => {
        console.error('Error:', error);
      });
  }



}
