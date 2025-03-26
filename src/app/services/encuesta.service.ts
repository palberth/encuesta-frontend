import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {
  private apiUrl = 'http://localhost:8080/api/encuestas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllEncuestas(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  getEncuestaById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createEncuesta(encuesta: any): Observable<any> {
    return this.http.post(this.apiUrl, encuesta, { headers: this.getHeaders() });
  }

  updateEncuesta(id: number, encuesta: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, encuesta, { headers: this.getHeaders() });
  }

  deleteEncuesta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}