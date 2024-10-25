import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockapiService } from '../../services/mock/mockapi.service';

@Component({
  selector: 'app-modal-complaints-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './modal-complaints-list.component.html',
  styleUrl: './modal-complaints-list.component.scss'
})
export class ModalComplaintsListComponent implements OnInit {
  complaints: any[] = [];
  tooltipTitle: string = 'Las denuncias seleccionadas se anexarán al informe. Las que no estén seleccionadas se desanexarán del mismo en caso de estar anexadas.'
  @Output() selectedComplaints = new EventEmitter<any[]>();

  constructor(private mockService: MockapiService) { }

  ngOnInit(): void {
    this.getComplaints();
  }

  //trae las denuncias desde el service
  getComplaints(): void {
    this.mockService.getAllComplaints().subscribe(res => {
      this.complaints = res.map(complaint => ({
        ...complaint,
        selected: complaint.complaintState === 'Anexada'
      }));
      console.log('Denuncias:', this.complaints);
    }, error => {
      console.error('Error al obtener denuncias', error);
    });
  }

  //emite al padre (formulario) las denuncias que se seleccionan con el chk
  attachSelectedComplaintsToList(): void {
    const selected = this.getSelectedComplaints();
    console.log('Denuncias seleccionadas antes de emitir:', selected);
    this.selectedComplaints.emit(selected);
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

  //tooltip para el icono del signo de pregunta
  ngAfterViewInit(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new (window as any).bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

}
