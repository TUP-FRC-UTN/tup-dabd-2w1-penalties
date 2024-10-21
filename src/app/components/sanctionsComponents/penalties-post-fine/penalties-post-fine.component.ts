import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { ReportDTO, plotOwner } from '../../../models/reportDTO';
import { PenaltiesSanctionsServicesService } from '../../../services/penalties-sanctions-services/penalties-sanctions-services.service';

@Component({
  selector: 'app-penalties-post-fine',
  standalone: true,
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './penalties-post-fine.component.html',
  styleUrls: ['./penalties-post-fine.component.css']
})
export class PenaltiesPostFineComponent implements OnInit {



  //tengo que llamar al microservicio de usuario para traer el plot usando el plot Id
  @Input() report:ReportDTO={
    id: 0,
    reportState: '',
    plotId: 0,
    description: '',
    createdDate: new Date,
    baseAmount: 0,
  }

  //plotOwner:plotOwner={}

  selectedDate:string =""
  newFine:boolean=false
  newAmount: number=0

  constructor(private router: Router, private penaltiesService: PenaltiesSanctionsServicesService) { }

  ngOnInit() {
    this.setTodayDate()
    //this.getPlotOwner()
    this.newAmount = this.report.baseAmount
  }
  setTodayDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();

    this.selectedDate = `${year}-${month}-${day}`;
  }
  showAmountToPay(radioButton: string) {
    if(radioButton==="fine"){
      this.newFine=true
    }
    else{
      this.newFine=false
    }
  }
  //getPlotOwner(){}
 
  onSubmit(): void {
    if(this.newFine){

      const fineData = {
        reportId: this.report.id,
        amount: this.newAmount,
        createdUser: 1
      };

      this.penaltiesService.postFine(fineData).subscribe({
        next: (response) => {
          
          console.log('Multa enviada correctamente', response);
          this.router.navigate(['home/reportList']);
        },
        error: (error) => {
          console.error('Error al enviar la Multa', error);
        }
      });
    }
    else{

      const warningData = {
        reportId: this.report.id,
        createdUser: 1
      };

      this.penaltiesService.postWarning(warningData).subscribe({
        next: (response) => {
          
          console.log('Advertencia enviada correctamente', response);
          this.router.navigate(['home/reportList']);
        },
        error: (error) => {
          console.error('Error al enviar la Advertencia', error);
        }
      });

    }
      
  }

}

