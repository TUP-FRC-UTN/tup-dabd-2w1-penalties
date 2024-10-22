import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PenaltiesFileUploadItemComponent } from '../penalties-file-upload-item/penalties-file-upload-item.component';

@Component({
  selector: 'app-penalties-file-upload-button',
  standalone: true,
  imports: [PenaltiesFileUploadItemComponent,CommonModule],
  templateUrl: './penalties-file-upload-button.component.html',
  styleUrl: './penalties-file-upload-button.component.scss'
})
export class PenaltiesFileUploadButtonComponent {
  files: File[] = [];
  maxFiles:number = 3
  errorMessage: string = '';
  maxFileSize: number = 5 * 1024 * 1024; // 5MB
  @Output() finalFiles = new EventEmitter<File[]>()
  
  @ViewChild('fileUpload') fileInput!: ElementRef;

  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      // agregamos los archivos a una nueva variable y calculamos los espacios disponibles
      const newFile = Array.from(input.files);
      const availableSlots = this.maxFiles - this.files.length
      //La variable FilesToAdd recibe la cantidad de archivos que estan dentro del limite establecido
      const filesToAdd = newFile.slice(0,availableSlots)
      
      //se valida el formato y el tamaño del archivo
      for(const file of filesToAdd){
        if(this.validateFile(file)){
          //Se agregan a la lista existente de files, los archivos seleccionados
          this.files.push(file);
        }
      }

      //emito evento para poder almacenar los files
      this.finalFiles.emit(this.files)

      // Restablecer el valor del input para poder seleccionar los mismos archivos si es necesario
      this.fileInput.nativeElement.value = '';
    }
  }
  validateFile(file: File): boolean {
    // Validacion del tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = `El archivo ${file.name} no es un tipo de imagen válido.`;
      return false;
    }

    // Validacion del tamaño de archivo
    if (file.size > this.maxFileSize) {
      this.errorMessage = `El archivo ${file.name} excede el tamaño máximo permitido de 5MB.`;
      return false;
    }

    this.errorMessage = '';
    return true;
  }
  eliminateImg(index: number) {
    // Eliminar archivo de la lista por índice
    this.files.splice(index, 1);
    //emito evento para poder almacenar los files
    this.finalFiles.emit(this.files)
  }
}
