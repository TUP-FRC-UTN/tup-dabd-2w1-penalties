import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { UsersSideButtonComponent } from "../users-side-button/users-side-button.component";
import { SideButton } from '../models/SideButton';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule, UsersSideButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  //Expande el side
  expand: boolean = false;

  constructor(private router: Router) { }

  userRole: string = "SuperAdmin" //Cambiar según el rol del usuario que se loguee

  //Lista de botones
  buttonsList: SideButton[] = [];

  ngOnInit(): void {
    this.buttonsList = [
      {
        icon: "bi-people",
        title: "Usuarios",
        roles: ["SuperAdmin", "Admin"],
        childButtons: [{
          //botón agregar usuario
          icon: "bi-person-plus-fill",
          title: "Añadir",
          route: "home/postComplaint",
          roles: ["SuperAdmin", "Admin", "Owner"]
        },
        {

          //botón listado
          icon: "bi-person-lines-fill",
          title: "Listado",
          route: "home/listComplaint",
          roles: ["SuperAdmin", "Admin", "Owner"]
        }
        ]
      },

      {
        icon: "bi-box",
        title: "Añadir Lote",
        route: "home/reportList",
        roles: ["SuperAdmin", "Admin"]
      }

    ];
  }

  //Expandir y contraer el sidebar
  changeState() {
    this.expand = !this.expand;
  }

  redirect(path: string) {
    this.router.navigate([path]);
  }

}