import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu-category',
  templateUrl: './menu-category.component.html'
})
export class MenuCategoryComponent {
  @Input() category!: string;
  @Input() items: any[] = [];
  @Input() restaurantId!: number;
}
