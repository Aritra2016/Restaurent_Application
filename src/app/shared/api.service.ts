import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000';

  constructor(private _http: HttpClient) { }

  postRestaurent(data: any) {
    return this._http.post<any>(`${this.baseUrl}/posts`, data);
  }

  getRestaurent() {
    return this._http.get<any>(`${this.baseUrl}/posts`);
  }

  deleteRestaurant(id: number) {
    return this._http.delete<any>(`${this.baseUrl}/posts/${id}`);
  }

  updateRestaurant(id: number, data: any) {
    return this._http.put<any>(`${this.baseUrl}/posts/${id}`, data);
  }

  signUp(data: any) {
    return this._http.post<any>(`${this.baseUrl}/signup`, data);
  }

  login(email: string, password: string) {
    return this._http.get<any[]>(`${this.baseUrl}/signup?email=${email}&password=${password}`);
  }
}
