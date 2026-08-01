import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html'
})
export class RestaurantInfoComponent {
  @Input() restaurant: any;
}
