import { Component, OnInit } from '@angular/core';
import { ComplaintService } from '../../../services/complaintsService/complaints.service';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-penalties-post-complaint',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './penalties-post-complaint.component.html',
  styleUrl: './penalties-post-complaint.component.scss'
})
export class PenaltiesPostComplaintComponent implements OnInit {
  //Variables
  complaintTypes: { key: string; value: string }[] = [];
  reactiveForm: FormGroup;
  files: File[] = [];


  //Constructor
  constructor(
    private complaintService: ComplaintService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { 
    this.reactiveForm = this.formBuilder.group({  //Usen las validaciones que necesiten, todo lo de aca esta puesto a modo de ejemplo
      typeControl: new FormControl('', [Validators.required]),
      descriptionControl: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]),
      fileControl: new FormControl(null),
    });
  }


  //Init
  ngOnInit(): void {
    this.getTypes();
  }


  //Submit del form
  onSubmit(): void {
    if (this.reactiveForm.valid) {
      let formData = this.reactiveForm.value;
      let data = {
        userId: 1,
        complaintType: formData.typeControl,
        description: formData.descriptionControl,
        pictures: this.files
      };

      (window as any).Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas confirmar el envío de la denuncia?",
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
          // This method sends the 
          // complaint to the service.

          // If the complaint is sent correctly, 
          // it will show a success message.
          
          // If the complaint is not sent correctly, 
          // it will show an error message.
          this.complaintService.add(data).subscribe( res => {
              (window as any).Swal.fire({
                title: '¡Denuncia enviada!',
                text: 'La denuncia ha sido enviada correctamente.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
              });
              this.router.navigate(['/home/complaints/listComplaint']);
            }, error => {
              console.error('Error al enviar la denuncia', error);
              (window as any).Swal.fire({
                title: 'Error',
                text: 'No se pudo enviar la denuncia. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            })
          };
        });

    }
  }


  //This method returns a class for the input.

  // Param 'controlName'
  // The name of the control.
  // Param 'isValid' Whether the
  // control is valid or not.

  // Return The class to be applied 
  // to the input (Green or red).
  onValidate(controlName: string) {
    const control = this.reactiveForm.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.dirty || control?.touched),
      'is-valid': control?.valid
    }
  }


  //This method checks if there is an error in the input.

  // Param 'controlName' The 
  // name of the control.

  // Returns an error message 
  // based on the first found error.
  // If no error is found, it 
  // returns an empty string.
  showError(controlName: string) {
    const control = this.reactiveForm.get(controlName);
    
    if (control && control.errors) {
      const errorKey = Object.keys(control!.errors!)[0];
      switch (errorKey) {
        case 'required':
          return 'Este campo no puede estar vacío.';
        case 'email':
          return 'Formato de correo electrónico inválido.';
        case 'minlength':
          return `El valor ingresado es demasiado corto. Mínimo ${control.errors['minlength'].requiredLength} caracteres.`;
        case 'maxlength':
          return `El valor ingresado es demasiado largo. Máximo ${control.errors['maxlength'].requiredLength} caracteres.`;
        case 'pattern':
          return 'El formato ingresado no es válido.';
        case 'min':
          return `El valor es menor que el mínimo permitido (${control.errors['min'].min}).`;
        case 'max':
          return `El valor es mayor que el máximo permitido (${control.errors['max'].max}).`;
        case 'requiredTrue':
          return 'Debe aceptar el campo requerido para continuar.';
        case 'date':
          return 'La fecha ingresada es inválida.';
        case 'url':
          return 'El formato de URL ingresado no es válido.';
        case 'number':
          return 'Este campo solo acepta números.';
        case 'customError':
          return 'Error personalizado: verifique el dato ingresado.';
        default:
          return 'Error no identificado en el campo.';
      }
    }
    return '';
  }



  // This method loads the data from the service
  // for the select (Own of the fines microservice).

  // If the data is loaded correctly, it will fill 
  // the select with the data.

  // If the data is not loaded correctly, 
  // it will return an error.
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


  // This method formats a date
  // to send it to the input.

  // Param 'date' The date to be formatted.

  // Returns the date as a string in the format "yyyy-MM-dd".
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  
  // This method updates the list of 
  // files to the currently selected ones.
  onFileChange(event: any) {
    this.files = Array.from(FileList = event.target.files); //Convertir FileList a Array
  }

}
