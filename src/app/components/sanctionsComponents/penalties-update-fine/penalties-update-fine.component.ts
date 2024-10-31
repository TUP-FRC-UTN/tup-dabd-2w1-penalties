import { Component, OnInit } from '@angular/core';
import { PenaltiesSanctionsServicesService } from '../../../services/sanctionsService/sanctions.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-penalties-update-fine',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './penalties-update-fine.component.html',
  styleUrl: './penalties-update-fine.component.scss'
})
export class PenaltiesUpdateFineComponent implements OnInit {
  userId:number;
  fineIdFromList: number;
  fine: any;
  reactiveForm:FormGroup;

  constructor(private penaltiesService: PenaltiesSanctionsServicesService,private router: Router, private route: ActivatedRoute, formBuilder:FormBuilder){
    this.userId = 1;
    this.fineIdFromList = 0; //Esto deberia venir del listado
    this.reactiveForm = formBuilder.group({
      amountControl: new FormControl('', [Validators.required, Validators.min(1.00)])
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.fineIdFromList = + params.get('fineId')!;
      this.getFine(this.fineIdFromList);
    });
  }

  getFine(fineId:number){
    this.penaltiesService.getFineById(this.fineIdFromList)
    .subscribe(
      (response) => {
        console.log(response); 
        this.fine = response
      },
      (error) => {
        console.error('Error:', error);
      });
  }

  onSubmit(){
    const fineData = {
      userId: 10,
      fineId:this.fineIdFromList,
      amount: this.reactiveForm.value.amountControl
    };

    //Envio de formulario
    //Deberia ir al endpoint de putFine
    this.penaltiesService.updateFine(fineData).subscribe({
      next: (response) => {
        console.log('Multa actualizada correctamente', response);
        this.router.navigate(['/home/sanctions/sanctionsList']);
      },
      error: (error) => {
        console.error('Error al enviar la multa', error);
      }
    });
  }

  //Retorna una clase para poner el input en verde o rojo dependiendo si esta validado
  onValidate(controlName: string) {
    const control = this.reactiveForm.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.dirty || control?.touched),
      'is-valid': control?.valid
    }
  }


  //Retorna el primer error encontrado para el input dentro de los posibles
  showError(controlName: string) {
    const control = this.reactiveForm.get(controlName);
    //Si encuentra un error retorna un mensaje describiendolo
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
    //Si no se cumplen ninguno de los anteriores retorna vacio
    return '';
  }


}
