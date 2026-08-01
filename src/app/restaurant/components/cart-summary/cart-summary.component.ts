import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../cart.service';
import { ApiService } from '../../../shared/api.service';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html'
})
export class CartSummaryComponent {
  orderType: 'dine-in' | 'delivery' = 'dine-in';
  deliveryAddress = '';
  orderPlaced = false;
  placing = false;

  constructor(
    public cart: CartService,
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  get items() { return this.cart.items; }
  get total() { return this.cart.total; }

  placeOrder(): void {
    const user = this.auth.getLoggedInUser();
    if (!user) { this.router.navigate(['/login']); return; }
    if (this.orderType === 'delivery' && !this.deliveryAddress.trim()) {
      alert('Please enter delivery address.'); return;
    }
    this.placing = true;
    const restaurantId = this.items[0]?.restaurantId;
    const order = {
      restaurantId,
      customerName: user.name,
      items: this.items.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
      total: this.total,
      type: this.orderType,
      status: 'pending',
      address: this.deliveryAddress,
      createdAt: new Date().toISOString()
    };
    this.api.placeOrder(order).subscribe(() => {
      this.orderPlaced = true;
      this.placing = false;
      this.cart.clear();
    });
  }
}
