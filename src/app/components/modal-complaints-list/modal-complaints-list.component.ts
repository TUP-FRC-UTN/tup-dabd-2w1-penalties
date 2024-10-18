import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockapiService } from '../../services/mock/mockapi.service';

@Component({
  selector: 'app-modal-complaints-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-complaints-list.component.html',
  styleUrl: './modal-complaints-list.component.scss'
})
export class ModalComplaintsListComponent implements OnInit {
  complaints: any[] = [];
  @Output() selectedComplaints = new EventEmitter<any[]>();
  @Input() mode: 'anexar' | 'desanexar' = 'anexar';

  constructor(private mockService: MockapiService) { }

  ngOnInit(): void {
    this.getComplaints();
  }

  //trae las denuncias desde el service
  getComplaints(): void {
    this.mockService.getAllComplaints().subscribe(res => {
      this.complaints = res.map(complaint => ({
        ...complaint,
        selected: false
      }));
      console.log('Denuncias:', this.complaints);
    }, error => {
      console.error('Error al obtener denuncias', error);
    });
  }

  //filtra por denuncias pendientes y nuevas que no esten anexadas
  getFilteredComplaints(): any[] {
    if (this.mode === 'anexar') {
      return this.complaints.filter(c => c.complaint_state === 'NUEVA' || c.complaint_state === 'PENDIENTE');
    } else if (this.mode === 'desanexar') {
      return this.complaints.filter(c => c.report_id === 1);
    }
    return [];
  }

  //emite al padre (formulario) las denuncias que se seleccionan con el chk
  attachSelectedComplaintsToList(): void {
    const selected = this.getSelectedComplaints();
    this.selectedComplaints.emit(selected); // Asegúrate de que esto esté funcionando
    console.log('Denuncias seleccionadas emitidas:', selected); // Verifica si aquí obtienes las correctas
    this.closeModal();
  }

  //filtra las denuncias seleccionadas
  private getSelectedComplaints(): any[] {
    return this.complaints.filter(complaint => complaint.selected);
  }

  public closeModal(): void {
    const modalElement = document.getElementById('complaintModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

}
