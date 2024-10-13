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
    const formData = new FormData();
  
    formData.append('userId', complaintData.userId.toString());
    formData.append('complaintType', complaintData.complaintType);
    formData.append('description', complaintData.description);
  
    if (complaintData.pictures && complaintData.pictures.length > 0) {
      complaintData.pictures.forEach((file: File, index: number) => {
        formData.append('pictures', file, file.name);
      });
    }
  
    return this.http.post(this.url + 'complaint', formData);
  }

  getTypes(): Observable<any> {
    return this.http.get(this.url+'complaint/types');
  }

  getAllComplains(){
    return this.http.get<ComplaintDto[]>(this.url+"complaint/all")
  }

  getById(id :number):Observable<any>{
    return this.http.get(this.url+"complaint/"+id)
  }

  putStateComplaint(idcomplaint: number, updatedData: PutStateComplaintDto): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(this.url+"complaint/"+idcomplaint, updatedData, { headers });
  }
}
