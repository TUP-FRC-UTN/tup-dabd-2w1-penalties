import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PenaltiesSanctionsServicesService } from '../../../services/penalties-sanctions-services/penalties-sanctions-services.service';

@Component({
  selector: 'app-penalties-post-disclaimer',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './penalties-post-disclaimer.component.html',
  styleUrl: './penalties-post-disclaimer.component.scss'
})
export class PenaltiesPostDisclaimerComponent implements OnInit {
  fineId: number; 
  selectedOption: string;
  selectedDate: string;
  description: string;
  disclaimer:string;
  textareaPlaceholder: string;
  fine: any;

  constructor(private penaltiesService: PenaltiesSanctionsServicesService,private router: Router){
    this.selectedOption = 'Cargando...',
    this.selectedDate = '2012-12-12',
    this.description = 'Si estas viendo este mensaje es porque aun no ha cargado la descripcion, por favor espere...',
    /*
    Se usarian estos campos en lugar de los de arriba
    fine?.reason
    fine?.description
    fine?.createdDate
     */
    this.fineId = 0; //Esto deberia venir del listado
    this.disclaimer = '',
    this.textareaPlaceholder = 'Ingrese su descargo aquí...'
  }

  ngOnInit(): void {
    this.getFine();
  }

  getFine(){
    this.penaltiesService.getFineById(this.fineId)
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
    //Envio de formulario
    const disclaimerData = {
      userId: 1,
      fineId:this.fineId,
      disclaimer: this.disclaimer
    };
    this.penaltiesService.addDisclaimer(disclaimerData).subscribe({
      next: (response) => {
        console.log('Reclamo enviad0 correctamente', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al enviar el reclamo', error);
      }
    });
  }

}
