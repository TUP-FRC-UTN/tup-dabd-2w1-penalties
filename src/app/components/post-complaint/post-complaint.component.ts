import { Component, OnInit, ViewChild } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';
import { FormsModule } from '@angular/forms';
import { FileUploadComponent } from "../file-upload/file-upload.component";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-post-complaint',
  standalone: true,
  imports: [FormsModule, FileUploadComponent, RouterModule],
  templateUrl: './post-complaint.component.html',
  styleUrl: './post-complaint.component.scss'
})
export class PostComplaintComponent implements OnInit {
  selectedOption: string;
  selectedDate: string;
  maxDate: string;
  textareaContent: string;
  textareaPlaceholder: string;
  complaintTypes?: { key: string; value: string }[];
  files?: File[];

  constructor(private complaintService: ComplaintService, private router: Router) {
    this.selectedOption = '';
    this.maxDate = '';
    this.textareaContent = '';
    this.textareaPlaceholder = 'Ingrese su mensaje aquí...';
    this.selectedDate = '';
    this.setTodayDate();
    this.complaintTypes = [];
    this.files = [];
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

  getFiles(files: File[]) {
    this.files = files;
    console.log(files);
  }

  onSubmit(): void {
    if (this.selectedOption && this.selectedDate && this.textareaContent) {
      const formData = new FormData();

      formData.append('userId', '1');
      formData.append('complaintType', this.selectedOption);
      formData.append('description', this.textareaContent);

      // Agregar los archivos al FormData
      if (this.files && this.files.length > 0) {
        this.files.forEach((file, index) => {
          formData.append(`pictures`, file, file.name);
        });
      }

      // Llamar al servicio con el FormData
      this.complaintService.add(formData).subscribe({
        next: (response) => {
          console.log('Denuncia enviada correctamente', response);
          this.router.navigate(['/list']);
        },
        error: (error) => {
          console.error('Error al enviar la denuncia', error);
        }
      });
    }
  }
}
