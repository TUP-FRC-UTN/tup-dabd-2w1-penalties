import { Component, OnInit } from '@angular/core';
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
  complaintTypes: { key: string; value: string }[] = [];
  files?: File[];

  constructor(private complaintService: ComplaintService, private router: Router) {
    this.selectedOption = '';
    this.maxDate = '';
    this.textareaContent = '';
    this.textareaPlaceholder = 'Ingrese su mensaje aquí...';
    this.selectedDate = '';
    this.setTodayDate();
    this.files = [];
  }

  ngOnInit(): void {
    this.getTypes();
  }

  getFiles(files: File[]) {
    this.files = files;
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

  onSubmit(): void {
    if (this.selectedOption && this.selectedDate && this.textareaContent) {
      const denunciaData = {
        userId: 1,
        complaintType: this.selectedOption,
        description: this.textareaContent,
        pictures: this.files
      };
      
      this.complaintService.add(denunciaData).subscribe({
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
