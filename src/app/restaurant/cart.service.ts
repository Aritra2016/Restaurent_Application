import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  restaurantId: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  get items(): CartItem[] { return this.cartSubject.value; }

  get total(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  add(item: any, restaurantId: number): void {
    const cart = [...this.items];
    const existing = cart.find(c => c.id === item.id);
    if (existing) existing.qty++;
    else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1, restaurantId });
    this.cartSubject.next(cart);
  }

  remove(itemId: number): void {
    const cart = [...this.items];
    const existing = cart.find(c => c.id === itemId);
    if (!existing) return;
    if (existing.qty > 1) {
      existing.qty--;
      this.cartSubject.next(cart);
    } else {
      this.cartSubject.next(cart.filter(c => c.id !== itemId));
    }
  }

  getQty(itemId: number): number {
    return this.items.find(c => c.id === itemId)?.qty || 0;
  }

  clear(): void { this.cartSubject.next([]); }
}
