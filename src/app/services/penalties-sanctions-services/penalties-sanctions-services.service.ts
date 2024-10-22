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
  
  //Este metodo no tiene endpoint por ahora
  //Si es necesario a quien le toque este metodo puede refactorizarlo
  getFineById(id:number){
    return this.http.get<any>(this.url + "sanction/fine/" + id)
  }
  
  //Este metodo no tiene endpoint por ahora
  addDisclaimer(userId:number, fineId:number, disclaimer:string){
    const formData = {
      userId: userId,
      fineId: fineId,
      disclaimer: disclaimer
    };
    //return this.http.post<any>(this.url + "sanction/fine/disclaimer", formData)
    return this.http.post<any>("https://6716f1153fcb11b265d3fadf.mockapi.io/api/sanction/fine/discleimer", formData)
  }

}
