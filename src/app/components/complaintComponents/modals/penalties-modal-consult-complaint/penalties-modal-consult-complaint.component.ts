import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComplaintService } from '../../../../services/complaint.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-penalties-modal-consult-complaint',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './penalties-modal-consult-complaint.component.html',
  styleUrl: './penalties-modal-consult-complaint.component.scss'
})
export class PenaltiesModalConsultComplaintComponent {
  @Input() denunciaId!: number;
  complaintTypes: { key: string; value: string }[] = [];
  reactiveForm: FormGroup;
  files: File[] = [];
  data: any;

  constructor(
    public activeModal: NgbActiveModal,
    private complaintService: ComplaintService,
    private formBuilder: FormBuilder
  ) {
    this.reactiveForm = this.formBuilder.group({  //Usen las validaciones que necesiten, todo lo de aca esta puesto a modo de ejemplo
      typeControl: new FormControl('T1'),
      dateControl: new FormControl(this.formatDate(new Date())),
      descriptionControl: new FormControl(''),
      fileControl: new FormControl(null),
    });
   }

  ngOnInit(): void {
    this.getTypes();
    this.getComplaint();
  }

  close() {
    this.activeModal.close()
  }


  getComplaint() {
    this.complaintService.getById(this.denunciaId).subscribe(
      (respuesta) => {
        console.log(respuesta);
        this.data = respuesta
      },
      (error) => {
        console.error('Error:', error);
      });
  }

    //Carga de datos del service para el select (Propio del micro de multas)
    getTypes(): void {
      this.complaintService.getTypes().subscribe({
        next: (data) => {
          this.complaintTypes = Object.keys(data).map(key => ({
            key,
            value: data[key]
          }));
        },
        error: (error) => {
          console.error('error: ', error);
        }
      })
    }

  //////////////////////////////////////////////////////////////////////////////////////////////////////


  //Formatea la fecha en yyyy-MM-dd para enviarla al input
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
