import { Component, Input } from '@angular/core';
import { Complaint } from '../../models/complaint';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modal-info-complaint',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './modal-info-complaint.component.html',
  styleUrl: './modal-info-complaint.component.scss'
})
export class ModalInfoComplaintComponent {
  @Input() complaint!: Complaint;

  constructor(public activeModal: NgbActiveModal) { }

  close() {
    this.activeModal.close();
  }
}
