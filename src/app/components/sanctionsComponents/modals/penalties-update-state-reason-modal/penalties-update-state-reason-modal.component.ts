import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() id:number=1
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

  // Sends the updated fine state to the server
  //
  // Builds a `fineDto` object with:
  // - id: Fine ID to update
  // - fineState: New state to be set
  // - stateReason: Reason entered by user for the update
  // - userId: ID of the user making the change
  //
  // If successful, refreshes the fine list and closes the modal.
  // Shows an alert based on the response.
  putFine(){
    const fineDto:any = {
      id: this.id,
      fineState: this.fineState,
      stateReason: this.reasonText,
      userId: this.userId
    }
    this.sanctionService.putStateFine(fineDto).subscribe({
      next: (response) => {
        alert('El estado de la multa fue actualizado con éxito');
        this.sanctionService.triggerRefresh();
        this.close()
      },
      error: (error) => {
        alert('El estado de la multa no pudo ser actualizado');
        this.close()
      }
    });
  }
}
