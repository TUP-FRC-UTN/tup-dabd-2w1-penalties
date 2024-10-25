import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PutReportDTO } from '../../models/PutReportDTO';

@Injectable({
  providedIn: 'root'
})
export class MockapiService {

  private readonly urlReports = 'http://localhost:8042';
  private readonly urlComplaints = 'http://localhost:8040';

  constructor(private http: HttpClient) { }

  updateReport(reportDTO: PutReportDTO): Observable<any> {
    return this.http.put(this.urlReports + '/api/report', reportDTO);
  }

  getAllComplaints(): Observable<any[]> {
    return this.http.get<any[]>(this.urlComplaints + '/api/complaint/all');
  }

  updateComplaintState(complaint: any): Observable<any> {
    const url = `${this.urlComplaints}/${complaint.id}`;
    return this.http.put(url, complaint);
  }
}
