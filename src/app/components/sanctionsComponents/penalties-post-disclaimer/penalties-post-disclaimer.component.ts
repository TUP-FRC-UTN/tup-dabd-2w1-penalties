import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-penalties-post-disclaimer',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './penalties-post-disclaimer.component.html',
  styleUrl: './penalties-post-disclaimer.component.scss'
})
export class PenaltiesPostDisclaimerComponent implements OnInit {
  selectedOption: string;
  selectedDate: string;
  description: string;
  disclaimer:string;

  constructor(private router: Router){
    this.selectedOption = '',
    this.selectedDate = '',
    this.description = '',
    this.disclaimer = ''
  }

  ngOnInit(): void {
    this.getFine();
  }

  getFine(){
    //Aca cargaria la multa
  }

  onSubmit(){
    //Envio de formulario
  }

}
