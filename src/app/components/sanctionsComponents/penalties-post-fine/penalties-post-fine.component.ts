import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-penalties-post-fine',
  standalone: true,
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './penalties-post-fine.component.html',
  styleUrls: ['./penalties-post-fine.component.css']
})
export class PenaltiesPostFineComponent implements OnInit {

  //deberia tener el estado del informe? 
  // tengo que llamar al microservicio de usuario para traer el plot Id
  @Input() plotId:Number=0
  @Input() description:string=""
  @Input() reportReason:string =""
  @Input() reportReasonId:number =0
  selectedDate:string =""
  showInput:boolean=false

  constructor() { }

  ngOnInit() {
    this.setTodayDate()
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
      this.showInput=true
    }
    else{
      this.showInput=false
    }
  }
}
