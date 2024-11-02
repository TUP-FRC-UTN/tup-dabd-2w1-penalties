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
    this.loadComplaintFiles();
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

  onFileChange(event: any) {
    this.files = Array.from(FileList = event.target.files);
  }
  //Deprecated, comentar
  addMockFile() {
    const mockImage = new File(["Contenido de la imagen"], "MockImage.png", {
      type: "image/jpeg",
      lastModified: Date.now()
    });
    this.files.push(mockImage);
  }
  //Acá llamo al servicio que me trae los archivos de la denuncia
  loadComplaintFiles() {
    this.complaintService.getFilesById(this.denunciaId).subscribe(
      (response: any) => {
        console.log('Respuesta de la API:', response);
        console.log('Tipo de respuesta:', typeof response);
        
        if (response && typeof response === 'object') {
          this.files = this.base64ToFile(response);
        } else {
          console.error('La respuesta está mal:', response);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
}

//Acá lo que hago es convertir el base64 a un archivo
base64ToFile(response: Record<string, string>): File[] {
  const files: File[] = [];

  for (const base64String in response) {
    if (response.hasOwnProperty(base64String)) {
      const fileName = response[base64String].trim(); 
      const trimmedBase64String = base64String.trim(); 
      console.log(`Base64 Key: ${base64String}, File Name: ${fileName}`);
      
      if (trimmedBase64String.startsWith("data:")) {
        
        const [mimeTypePart, base64Data] = trimmedBase64String.split(',');
        const mimeType = mimeTypePart.split(':')[1].split(';')[0]; 
        
        if (base64Data) {
          try {
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const blob = new Blob([byteNumbers], { type: mimeType });
            const file = new File([blob], fileName, { type: mimeType });
            files.push(file);
          } catch (error) {
            console.error(`Error decoding base64 for ${base64String}:`, error);
          }
        } else {
          console.error(`Base64 data is empty for ${base64String}`);
        }
      } else {
        console.warn(`Base64 string does not start with expected prefix for ${base64String}: ${trimmedBase64String}`);
      }
    }
  }
  return files; 
}

  trackByFile(index: number, file: any): number {
    return file.id;
  }
//Acá creo el link de descarga automático
  downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
