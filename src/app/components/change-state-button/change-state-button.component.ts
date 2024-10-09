import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-change-state-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './change-state-button.component.html',
  styleUrl: './change-state-button.component.css'
})
export class ChangeStateButtonComponent {
  @Input() idComplaint:number=0
  complaintState: string = ""
  modalStateReason: boolean = false
  Reason:String = ""

  // Metodo para obtener el estado de la denuncia y mostrar el modal 
  selectState(option: string) {
    this.complaintState = option
    this.modalStateReason = true  
  }

  // metodo para cerrar el modal
  closeModal() {
    this.modalStateReason = false
    this.Reason = ""
    this.complaintState = ""
  }
}
