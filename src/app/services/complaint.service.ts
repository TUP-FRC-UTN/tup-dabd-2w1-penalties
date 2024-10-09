import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly url = 'http://localhost:8040';


  add(complaintData: any): Observable<any> {
    return this.http.post(this.url+'/api/complaint', complaintData);
  }

  getTypes(): Observable<any> {
    return this.http.get(this.url+'/api/complaint/types');
  }
}
