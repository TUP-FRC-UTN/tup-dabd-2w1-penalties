import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalStateReasonComponent } from '../modal-state-reason/modal-state-reason.component';
import { NgModel } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-state-button',
  standalone: true,
  imports: [CommonModule, ModalStateReasonComponent],
  templateUrl: './change-state-button.component.html',
  styleUrl: './change-state-button.component.css'
})
export class ChangeStateButtonComponent {
  @Input() idComplaint:number=0
  complaintState: string = ""
  modalStateReason: Boolean = false
  Reason:String = ""
  constructor(private modal:NgbModal){
    
  }

  // Metodo para obtener el estado de la denuncia y mostrar el modal 
  selectState(option: string) {
    this.complaintState = option
    this.openModal()
  }
  openModal(){
    const modal = this.modal.open(ModalStateReasonComponent, { size: 'lg' ,  keyboard: false });
    modal.componentInstance.idComplaint = this.idComplaint
    modal.componentInstance.complaintState = this.complaintState
    modal.result.then((result) => {
    }).catch((error) => {
      console.log('Modal dismissed with error:', error);
    });
  }

}
