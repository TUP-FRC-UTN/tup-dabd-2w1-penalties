import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReportDTO } from '../../models/reportDTO';

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
  /*
  getFineById(){
    return this.http.get<FineDisclaimerDto>(this.url+"sanction/fine/id")
  }
  postDisclaimer(){
    return this.http.post<DisclaimerDto>(this.url+"sanction/fine/disclaimer")
  }
  */


}
