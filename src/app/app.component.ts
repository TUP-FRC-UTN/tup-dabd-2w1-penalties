import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersNavbarComponent } from './components/users-components/users-navbar/users-navbar.component'; 
//import {components} from './components'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UsersNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'template-app';
}
