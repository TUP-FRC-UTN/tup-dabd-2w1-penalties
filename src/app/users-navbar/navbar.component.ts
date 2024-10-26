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
        //Denuncias
        icon: "bi-envelope-exclamation",
        title: "Denuncia",
        roles: ["SuperAdmin", "Admin", "SanctionManager", "Owner", "Tenant"],
        childButtons: [{
          //botón nueva denuncia
          icon: "bi-envelope-plus-fill",
          title: "Enviar",
          route: "home/complaints/postComplaint",
          roles: ["SuperAdmin", "Admin", "SanctionManager", "Owner", "Tenant"]
        },
        {
          //botón listado denuncia
          icon: "bi-envelope-paper-fill",
          title: "Listado",
          route: "home/complaints/listComplaint",
          roles: ["SuperAdmin", "Admin", "SanctionManager"]
        }]
      },
      {
        //Sanciones
        icon: "bi-exclamation-triangle",
        title: "Sanciones",
        roles: ["SuperAdmin", "Admin", "SanctionManager", "Owner", "Tenant"],
        childButtons: [{
          //Listado multas y advertencias
          icon: "bi-receipt",
          title: "Multas/Advertencias",
          route: "home/sanctions/sanctionsList",
          roles: ["SuperAdmin", "Admin", "SanctionManager", "Owner", "Tenant"]
        },
        {
          //Listado Informes
          icon: "bi-clipboard2-fill",
          title: "Informes",
          route: "home/sanctions/reportList",
          roles: ["SuperAdmin", "Admin", "SanctionManager"]
        },
        {
          icon: "bi-slash-circle",
          title: "Infracciones",
          route: "home",
          roles: ["SuperAdmin", "Admin"]
        },
        {
          icon: "bi-chat-text-fill",
          title: "Descargo",
          route: "home/sanctions/postDisclaimer/:fineId1",
          roles: ["SuperAdmin", "Admin"]
        }
        ]
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