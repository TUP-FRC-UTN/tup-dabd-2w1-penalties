import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PenaltiesSanctionsServicesService } from '../../../../services/sanctionsService/sanctions.service';

@Component({
  selector: 'app-penalties-update-state-reason-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './penalties-update-state-reason-modal.component.html',
  styleUrl: './penalties-update-state-reason-modal.component.scss'
})
export class PenaltiesUpdateStateReasonModalComponent {
  reasonText:String = ""
  @Input() id:number=0
  @Input() fineState: string = ""
  userId: number = 1;
  

  constructor(public activeModal: NgbActiveModal, 
    public sanctionService: PenaltiesSanctionsServicesService) {}
  ngOnInit(): void {
    console.log(this.id, this.fineState)
  }
  close() {
    this.activeModal.close(); 
  }

  //metodo para enviar
  putFine(){
    const fineDto:any = {
      id: this.id,
      userId: this.userId,
      complaintState: this.fineState,
      stateReason: this.reasonText
    }
    this.sanctionService.putStateFine(fineDto).subscribe({
      next: (response) => {
        alert('El estado de la multa fue actualizado con éxito');
        this.close()
        
      },
      error: (error) => {
        alert('El estado de la multa no pudo ser actualizado');
        this.close()
      }
    });
  }
}
