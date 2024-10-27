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
  private readonly url = 'http://localhost:8040/api/complaint';


  //Envia una nueva denuncia
  add(complaintData: any): Observable<any> {
    const complaint = new FormData();
  
    complaint.append('userId', complaintData.userId.toString());
    complaint.append('complaintType', complaintData.complaintType);
    complaint.append('description', complaintData.description);
  
    if (complaintData.pictures && complaintData.pictures.length > 0) {
      complaintData.pictures.forEach((file: File, index: number) => {
        complaint.append('pictures', file, file.name);
      });
    }
  
    return this.http.post(this.url, complaint);
  }


  //Obtiene todos los tipos de denuncia (motivos)
  getTypes(): Observable<any> {
    return this.http.get(this.url + `/types`);
  }


  //Obtiene todo el listado reducido de denuncias
  getAllComplains(){
    return this.http.get<ComplaintDto[]>(this.url + `/all`)
  }


  //Obtiene una denuncia por id
  getById(id :number):Observable<any>{
    return this.http.get(this.url + `/${id}`)
  }


  //Actualiza el estado de una denuncia
  putStateComplaint(idcomplaint: number, updatedData: PutStateComplaintDto): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put(this.url + `/${idcomplaint}`, updatedData, { headers });
  }


  //Devuelve el listado completo de estados
  getState(): Observable<any> {
    return this.http.get(this.url + `/states`)
  }


  //esto es unicamente para mostrar fechas en formato local
  formatDate(date: any): string {
    if (Array.isArray(date)) {
      const [year, month, day] = date;
      const createdDate = new Date(year, month - 1, day);
      return createdDate.toLocaleDateString('es-ES');
    }
    return new Date(date).toLocaleDateString('es-ES');
  }
}
