import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComplaintService } from '../../../../services/complaintsService/complaints.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PutStateComplaintDto } from '../../../../models/complaint';

@Component({
  selector: 'app-penalties-modal-consult-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './penalties-get-complaint.component.html',
  styleUrl: './penalties-get-complaint.component.scss'
})
export class PenaltiesModalConsultComplaintComponent implements OnInit {
  //Variables
  @Input() denunciaId!: number;
  files: File[] = [];
  complaint: any;
  loggedUserId: number = 1;

  //Constructor
  constructor(
    public activeModal: NgbActiveModal,
    public complaintService: ComplaintService,
  ) { }


  //Init
  ngOnInit(): void {
    this.getComplaint();
  }


  //Boton de cierre del modal
  close() {
    this.activeModal.close()
  }


  //Metodo para buscar la denuncia por id y cargarla en su variable
  getComplaint() {
    this.complaintService.getById(this.denunciaId).subscribe(
      (response) => {
        console.log(response);
        this.complaint = response
        if (this.complaint.complaintState == "Nueva") {
          const updatedComplaint: PutStateComplaintDto = {
            id: this.complaint.id,
            userId: this.loggedUserId,
            complaintState: "PENDING",
            stateReason: "Ya vista"
          }
          this.complaintService.putStateComplaint(this.complaint.id, updatedComplaint).subscribe()
        }
      },
      (error) => {
        console.error('Error:', error);
      });
  }


  //Evento para actualizar el listado de files a los seleccionados actualmente
  onFileChange(event: any) {
    this.files = Array.from(FileList = event.target.files); //Convertir FileList a Array
  }

  addMockFile() {
    const mockImage = new File(["Contenido de la imagen"], "MockImage.png", {
      type: "image/jpeg",
      lastModified: Date.now()
    });
    this.files.push(mockImage); //Agrega la imagen simulada a la lista
  }

}
