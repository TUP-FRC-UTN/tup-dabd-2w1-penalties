import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-consultar-denuncia-modal',
  standalone: true,
  imports: [],
  templateUrl: './consultar-denuncia-modal.component.html',
  styleUrl: './consultar-denuncia-modal.component.scss'
})
export class ConsultarDenunciaModalComponent implements OnInit {
  
  @Input() denunciaId!: number;
  constructor(public activeModal: NgbActiveModal){}

  ngOnInit(): void {
      console.log('Consiltar denunncia',this.denunciaId)
  }
  save(){
    this.activeModal.close()//aca podes agregar lo que se pasa
  }
  close(){
    this.activeModal.close()
  }
}
