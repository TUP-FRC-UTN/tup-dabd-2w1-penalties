import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-fine',
  standalone: true,
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './post-fine.component.html',
  styleUrl: './post-fine.component.scss'
})
export class PostFineComponent {

}
