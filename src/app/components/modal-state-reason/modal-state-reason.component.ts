import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-state-reason',
  standalone: true,
  imports: [],
  templateUrl: './modal-state-reason.component.html',
  styleUrl: './modal-state-reason.component.css'
})
export class ModalStateReasonComponent {
  reasonText:String = ""
  @Input() idComplaint:number=0
  @Input() complaintState: string = ""
  constructor(public activeModal: NgbActiveModal) {}
  cerrar() {
    this.activeModal.close(); 
  }
  

    //metodo para enviar
    putComplaint(){

    }
}
