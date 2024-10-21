import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReportDTO } from '../../models/reportDTO';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PenaltiesSanctionsServicesService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly url = 'http://localhost:8042/api/';

  constructor() { }

  //report/all
  getAllComplains(){
    return this.http.get<ReportDTO[]>(this.url+"report/all")
  }
  //esto es unicamente para mostrar fechas 
  formatDate(date: any): string {
    if (Array.isArray(date)) {
      const [year, month, day] = date;
      const createdDate = new Date(year, month - 1, day);
      return createdDate.toLocaleDateString('es-ES'); 
    }
    return new Date(date).toLocaleDateString('es-ES');
  }

  postFine(fineData: any): Observable<any> {
    const formData = new FormData();
  
    formData.append('reportId', fineData.reportId);
    formData.append('amount', fineData.amount);
    formData.append('createdUser', fineData.createdUser);
  
    return this.http.post(this.url + 'sanction/fine', formData);
  }
  postWarning(warningData: any): Observable<any> {
    const formData = new FormData();
  
    formData.append('reportId', warningData.reportId);
    formData.append('amount', warningData.amount);
    formData.append('createdUser', warningData.createdUser);
  
    return this.http.post(this.url + 'sanction/warning', formData);
  }
}
