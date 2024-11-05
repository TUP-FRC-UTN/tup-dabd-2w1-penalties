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
    };

// Confirmación antes de enviar el formulario
(window as any).Swal.fire({
  title: '¿Estás seguro?',
  text: "¿Deseas confirmar la actualización de la multa?",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Confirmar',
  cancelButtonText: 'Cancelar',
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
}).then((result: any) => {
  if (result.isConfirmed) {
    // Envío de formulario solo después de la confirmación
    this.sanctionService.putStateFine(fineDto).subscribe( res => {
        (window as any).Swal.fire({
          title: 'Multa actualizada!',
          text: 'El estado de la multa fue actualizado con éxito',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
          
        });
        this.close();
      }, error => {
        console.error('Error al enviar la multa', error);
        (window as any).Swal.fire({
          title: 'Error',
          text: 'No se pudo enviar la multa. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      })
    };
  });

    
  }
}
