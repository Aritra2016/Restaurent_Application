import { Component, Input } from '@angular/core';
import { CartService } from '../../cart.service';

@Component({
  selector: 'app-menu-item-card',
  templateUrl: './menu-item-card.component.html'
})
export class MenuItemCardComponent {
  @Input() item: any;
  @Input() restaurantId!: number;

  constructor(public cart: CartService) {}

  add(): void { this.cart.add(this.item, this.restaurantId); }
  remove(): void { this.cart.remove(this.item.id); }
  get qty(): number { return this.cart.getQty(this.item.id); }
}
