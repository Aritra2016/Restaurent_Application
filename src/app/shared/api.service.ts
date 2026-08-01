import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private _http: HttpClient) {}

  // Restaurants
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

  // Menus
  getMenuByRestaurant(restaurantId: number) { 
    return this._http.get<any[]>(`${this.baseUrl}/menus?restaurantId=${restaurantId}`); 
  }
  getAllMenus() {
     return this._http.get<any[]>(`${this.baseUrl}/menus`); 
    }
  addMenuItem(data: any) { return this._http.post<any>(`${this.baseUrl}/menus`, data); }
  updateMenuItem(id: number, data: any) { return this._http.put<any>(`${this.baseUrl}/menus/${id}`, data); }
  deleteMenuItem(id: number) { return this._http.delete<any>(`${this.baseUrl}/menus/${id}`); }

  // Orders
  getOrders() { return this._http.get<any[]>(`${this.baseUrl}/orders`); }
  getOrdersByRestaurant(restaurantId: number) { return this._http.get<any[]>(`${this.baseUrl}/orders?restaurantId=${restaurantId}`); }
  getDeliveryOrders() { return this._http.get<any[]>(`${this.baseUrl}/orders?type=delivery`); }
  placeOrder(data: any) { return this._http.post<any>(`${this.baseUrl}/orders`, data); }
  updateOrderStatus(id: number, data: any) { return this._http.patch<any>(`${this.baseUrl}/orders/${id}`, data); }

  // Ratings
  getRatingsByRestaurant(restaurantId: number) { return this._http.get<any[]>(`${this.baseUrl}/ratings?restaurantId=${restaurantId}`); }
  addRating(data: any) { return this._http.post<any>(`${this.baseUrl}/ratings`, data); }

  // Auth
  signUp(data: any) { return this._http.post<any>(`${this.baseUrl}/signup`, data); }
  login(email: string, password: string) { return this._http.get<any[]>(`${this.baseUrl}/signup?email=${email}&password=${password}`); }
}
