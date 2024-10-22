import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
  userId:number;
  @Input() fineId: number;
  selectedOption: string;
  selectedDate: string;
  description: string;
  disclaimer:string;
  textareaPlaceholder: string;
  fine: any;

  constructor(private penaltiesService: PenaltiesSanctionsServicesService,private router: Router){
    this.userId = 1;
    this.fineId = 1; //Esto deberia venir del listado
    this.selectedOption = 'Cargando...',
    this.selectedDate = '2012-12-12',
    this.description = 'Si estas viendo este mensaje es porque aun no ha cargado la descripcion, por favor espere...',
    /*
    Se usarian estos campos en lugar de los de arriba
    fine?.reason
    fine?.description
    fine?.createdDate
     */
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
    const disclaimerData = {
      userId: 10,
      fineId:3,
      disclaimer:this.disclaimer
    };

    //Envio de formulario
    this.penaltiesService.addDisclaimer(disclaimerData).subscribe({
      next: (response) => {
        console.log('Reclamo enviado correctamente', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al enviar el reclamo', error);
      }
    });
    //navegar al listado de sanciones
    //this.router.navigate(['/sanctionList']);
  }

}
