import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { Complaint, ComplaintDto, PutStateComplaintDto } from '../models/complaint';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly url = 'http://localhost:8040/api/';


  add(complaintData: any): Observable<any> {
    return this.http.post(this.url+'complaint', complaintData);
  }

  getTypes(): Observable<any> {
    return this.http.get(this.url+'complaint/types');
  }

  getAllComplains(){
    return this.http.get<ComplaintDto[]>(this.url+"complaint/all")
  }
  getById(id :number):Observable<any>{
    return this.http.get(this.url+"complaint/complaint/"+id)
  }

  putStateComplaint(idcomplaint: number, updatedData: PutStateComplaintDto): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(this.url+"complaint/"+idcomplaint, updatedData, { headers });
  }
}
