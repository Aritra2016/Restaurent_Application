import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-restaurant-header',
  templateUrl: './restaurant-header.component.html'
})
export class RestaurantHeaderComponent {
  @Input() restaurant: any;

  getStars(rating: number): string {
    const r = Math.round(rating);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }
}
