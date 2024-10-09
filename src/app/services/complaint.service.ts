import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly url = 'http://localhost:8080';


  add(complaintData: any): Observable<any> {
    return this.http.post(this.url, complaintData);
  }

  getTypes(): Observable<any> {
    return this.http.get(this.url+'/types');
  }
}
