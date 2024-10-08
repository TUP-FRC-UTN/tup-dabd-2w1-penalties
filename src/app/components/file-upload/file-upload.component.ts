import { Component, ElementRef, ViewChild } from '@angular/core';
import { FileComponent } from "../file/file.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [FileComponent,CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  files: File[] = [];
  
  @ViewChild('fileUpload') fileInput!: ElementRef;

  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      // En lugar de reemplazar, agregamos nuevos archivos al array existente
      const selectedFiles = Array.from(input.files);
      this.files.push(...selectedFiles);
      
      // Restablecer el valor del input para poder seleccionar los mismos archivos si es necesario
      this.fileInput.nativeElement.value = '';
    }
  }

  eliminateImg(index: number) {
    // Eliminar archivo de la lista por índice
    this.files.splice(index, 1);
  }
}
