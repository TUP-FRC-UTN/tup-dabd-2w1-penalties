import { Component } from '@angular/core';
import { ComplaintService } from '../../../services/complaint.service';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PenaltiesFileUploadButtonComponent } from '../helpers/penalties-file-upload-button/penalties-file-upload-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-penalties-post-complaint',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, PenaltiesFileUploadButtonComponent, RouterModule],
  templateUrl: './penalties-post-complaint.component.html',
  styleUrl: './penalties-post-complaint.component.scss'
})
export class PenaltiesPostComplaintComponent {
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

  //Esto esta puesto solo de ejemplo
  formReactivo = new FormGroup({
    text: new FormControl("asd", [Validators.required]),
    number: new FormControl(0, [Validators.required]),
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    select: new FormControl(['T1'], [Validators.required]),
    date: new FormControl(new Date(), [Validators.required]),
    radio: new FormControl(['choice1'], [Validators.required]),
    check: new FormControl([false], [Validators.required]),
    file: new FormControl([], [Validators.required]),
    range: new FormControl(0, [Validators.required]),
    dissabled: new FormControl("", [Validators.required]),
    textarea: new FormControl("", [Validators.required])
  });

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
          this.router.navigate(['home/complaints/listComplaint']);
        },
        error: (error) => {
          console.error('Error al enviar la denuncia', error);
        }
      });
    }
  }

}
