import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-complaints-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-complaints-list.component.html',
  styleUrl: './modal-complaints-list.component.scss'
})
export class ModalComplaintsListComponent {

  @Input() complaints: any[] = [];

  getFilteredComplaints() {
    return this.complaints.filter(c => c.complaint_state === 'NUEVA' || c.complaint_state === 'PENDIENTE');
  }

  getSelectedComplaints() {
    return this.complaints.filter(complaint => complaint.selected);
  }

  logSelectedComplaints() {
    const selectedComplaints = this.getSelectedComplaints();
    console.log('seleccionadas:', selectedComplaints);
  }
}
