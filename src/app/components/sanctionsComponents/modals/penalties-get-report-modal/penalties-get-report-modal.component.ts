import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PenaltiesSanctionsServicesService } from '../../../../services/sanctionsService/sanctions.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-penalties-modal-report',
  standalone: true,
  imports: [FormsModule,DatePipe],
  templateUrl: './penalties-get-report-modal.component.html',
  styleUrl: './penalties-get-report-modal.component.scss'
})
export class PenaltiesModalReportComponent implements OnInit{


  formattedDate:any;
  public service = inject(PenaltiesSanctionsServicesService)
  @Input() id:number = 0
  report: any;
  constructor(public activeModal: NgbActiveModal){

  }


  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.getReport()
    //alert(this.data.createdDate) 
  }


  close(){
    this.activeModal.close()
  }


  // Fetches the report details using the provided ID.
  
  // This method calls `getById()` on the injected service with the specified ID
  // and subscribes to handle the response. On success, it assigns the response to `report`
  // and formats the date using the service's `formatDate()` method.
  
  // In case of an error, it logs an error message in the console.
  getReport(){
    this.service.getById(this.id)
    .subscribe(
      (respuesta) => {
        console.log(respuesta); 
        this.report = respuesta
        console.log(this.report)
        // Format the report creation date to a readable format.
        this.formattedDate = new Date(this.service.formatDate(this.report.createdDate))
      },
      (error) => {
        console.error('Error:', error);
      });
  }
  

}
