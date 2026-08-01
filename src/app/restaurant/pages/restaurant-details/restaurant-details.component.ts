import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/api.service';
import { CartService } from '../../cart.service';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css']
})
export class RestaurantDetailsComponent implements OnInit {
  restaurant: any = null;
  menuItems: any[] = [];
  categories: string[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public cart: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getRestaurent().subscribe((res: any[]) => {
      this.restaurant = res.find(r => r.id === id);
      if (!this.restaurant) { this.router.navigate(['/home']); return; }
      this.api.getMenuByRestaurant(id).subscribe(menu => {
        this.menuItems = menu;
        this.categories = [...new Set(menu.map((i: any) => i.category))] as string[];
        this.loading = false;
      });
    });
  }

  getItemsByCategory(cat: string): any[] {
    return this.menuItems.filter(i => i.category === cat);
  }
}
