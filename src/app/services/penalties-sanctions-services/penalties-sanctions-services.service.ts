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
  
  //Estos dos metodos no tienen endpoint por ahora
  getFineById(id:number){
    return this.http.get<any>(this.url + "sanction/fine/" + id)
  }
  
  addDisclaimer(disclaimer:any){
    const formData = new FormData();
  
    formData.append('userId', disclaimer.userId.toString());
    formData.append('fineId', disclaimer.fineId);
    formData.append('disclaimer', disclaimer.disclaimer);

    return this.http.post(this.url + "sanction/fine/disclaimer", disclaimer) //revisar url
  }


}
