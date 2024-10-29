import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PenaltiesSanctionsServicesService } from '../../../../services/penalties-sanctions-services/penalties-sanctions-services.service';

@Component({
  selector: 'app-penalties-modal-fine',
  standalone: true,
  imports: [],
  templateUrl: './penalties-modal-fine.component.html',
  styleUrl: './penalties-modal-fine.component.scss'
})
export class PenaltiesModalFineComponent implements OnInit {
  //Variables
  @Input() fineId!: number;
  files: File[] = [];
  fine: any;


  //Constructor
  constructor(
    public activeModal: NgbActiveModal,
    public sanctionsService: PenaltiesSanctionsServicesService,
  ) { }


  //Init
  ngOnInit(): void {
    this.getFine(this.fineId);
  }


  //Boton de cierre del modal
  close() {
    this.activeModal.close()
  }


  getFine(fineId:number){
    this.sanctionsService.getFineById(fineId)
    .subscribe(
      (response) => {
        console.log(response); 
        this.fine = response
      },
      (error) => {
        console.error('Error:', error);
      });
  }


}
