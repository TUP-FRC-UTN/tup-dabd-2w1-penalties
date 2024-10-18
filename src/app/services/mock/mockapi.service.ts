import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockapiService {

  //! ESTE SERVICE ESTA PARA PROBAR LAS FUNCIONES DEL FRONT MOCKEADAS Y LAS TRANSACCIONES PARA DESPUES LLEVARLO AL BACKEND SIN ERRORES, NO LO BORREN PORFA XD (RENDER)

  private readonly urlReports = 'https://670e71123e7151861654888c.mockapi.io/api/reports';
  private readonly urlComplaints = 'https://670e71123e7151861654888c.mockapi.io/api/complaints';

  constructor(private http: HttpClient) { }

  updateReportDescription(description: string): Observable<any> {
    const reportId = '1';
    const url = `${this.urlReports}/${reportId}`;

    const updatedReport = {
      report_state: 'report_state 1',
      state_reason: 'state_reason 1',
      report_reason_id: 54,
      plot_id: 92,
      description: description,
      id: reportId
    };

    return this.http.put(url, updatedReport);
  }

  getAllComplaints(): Observable<any[]> {
    return this.http.get<any[]>(this.urlComplaints);
  }

  updateComplaintState(complaint: any): Observable<any> {
    const updatedComplaint = {
      ...complaint,
      report_id: 1,
      complaint_state: 'ANEXADA'
    };
  
    const url = `${this.urlComplaints}/${complaint.id}`;
    return this.http.put(url, updatedComplaint);
  }
}
