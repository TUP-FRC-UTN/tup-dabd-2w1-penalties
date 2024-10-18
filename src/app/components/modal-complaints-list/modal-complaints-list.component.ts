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

  constructor(private mockService: MockapiService) { }

  ngOnInit(): void {
    this.getComplaints();
  }



  getComplaints() {
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

  // Filtrar las denuncias que estén en estado NUEVA o PENDIENTE
  getFilteredComplaints() {
    return this.complaints.filter(c => c.complaint_state === 'NUEVA' || c.complaint_state === 'PENDIENTE');
  }

  // Emitir las denuncias seleccionadas
  attachSelectedComplaintsToList() {
    const selected = this.complaints.filter(complaint => complaint.selected);
    this.selectedComplaints.emit(selected);
    console.log('Denuncias seleccionadas emitidas:', selected);

    // Cerrar el modal después de emitir las denuncias seleccionadas
    const modalElement = document.getElementById('complaintModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.hide();
    }
  }
}
