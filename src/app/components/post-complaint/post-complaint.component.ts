import { Component, OnInit } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';
import { FormsModule } from '@angular/forms';
import { FileUploadComponent } from "../file-upload/file-upload.component";

@Component({
  selector: 'app-post-complaint',
  standalone: true,
  imports: [FormsModule, FileUploadComponent],
  templateUrl: './post-complaint.component.html',
  styleUrl: './post-complaint.component.scss'
})
export class PostComplaintComponent implements OnInit {
  selectedOption: string;
  selectedDate: string;
  maxDate: string;
  textareaContent: string;
  textareaPlaceholder: string;
  complaintTypes: { id: string; value: string }[] = [];

  constructor(private complaintService: ComplaintService) {
    this.selectedOption = '';
    this.maxDate = '';
    this.textareaContent = '';
    this.textareaPlaceholder = 'Ingrese su mensaje aquí...';
    this.selectedDate = '';
    this.setTodayDate();
  }

  ngOnInit(): void {
    this.getTypes();
  }

  setTodayDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();

    this.selectedDate = `${year}-${month}-${day}`;
  }

  getTypes(): void {
    this.complaintService.getTypes().subscribe({
      next: (data) => {
        this.complaintTypes = data;
      },
      error: (error) => {
        console.error('error: ', error);
      }
    })
  }

  onSubmit(): void {
    if (this.selectedOption && this.selectedDate && this.textareaContent) {
      const denunciaData = {
        userId: 1,
        complaintType: this.selectedOption,
        description: this.textareaContent,
        pictures: [
          {
            pictureUrl: "https://picsum.photos/200/300"
          }
        ]
      };

      this.complaintService.add(denunciaData).subscribe({
        next: (response) => {
          console.log('Denuncia enviada correctamente', response);
        },
        error: (error) => {
          console.error('Error al enviar la denuncia', error);
        }
      });
    }
  }
}
