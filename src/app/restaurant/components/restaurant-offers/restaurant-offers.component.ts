import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-restaurant-offers',
  templateUrl: './restaurant-offers.component.html'
})
export class RestaurantOffersComponent {
  @Input() restaurant: any;

  offers = [
    { icon: '🎉', title: '50% OFF up to ₹100', subtitle: 'Use code WELCOME50' },
    { icon: '🚚', title: 'Free Delivery', subtitle: 'On orders above ₹299' }
  ];
}
