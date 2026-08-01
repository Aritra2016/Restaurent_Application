import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.css']
})
export class HomeDashboardComponent implements OnInit {
  loggedInUser: any = null;
  allRestaurants: any[] = [];
  filteredRestaurants: any[] = [];
  searchQuery = '';
  totalRestaurants = 0;
  totalOrders = 0;
  deliveryOrders = 0;
  avgRating = '0.0';
  selectedRestaurant: any = null;
  selectedRatings: any[] = [];
  newRating = { score: 5, comment: '' };

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loggedInUser = this.auth.getLoggedInUser();
    this.loadData();
  }

  loadData(): void {
    this.api.getRestaurent().subscribe((res: any[]) => {
      this.allRestaurants = res;
      this.filteredRestaurants = res;
      this.totalRestaurants = res.length;
      const total = res.reduce((sum, r) => sum + (r.rating || 0), 0);
      this.avgRating = res.length ? (total / res.length).toFixed(1) : '0.0';
    });
    this.api.getOrders().subscribe((res: any[]) => {
      this.totalOrders = res.length;
      this.deliveryOrders = res.filter(o => o.type === 'delivery').length;
    });
  }

  filterRestaurants(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredRestaurants = this.allRestaurants.filter(r =>
      r.name.toLowerCase().includes(q) || r.cuisine?.toLowerCase().includes(q)
    );
  }

  selectRestaurant(r: any): void {
    localStorage.setItem('selectedRestaurant', JSON.stringify(r));
  }

  openRatings(r: any): void {
    this.selectedRestaurant = r;
    this.selectedRatings = [];
    this.newRating = { score: 5, comment: '' };
    this.api.getRatingsByRestaurant(r.id).subscribe(res => {
      this.selectedRatings = res;
    });
    const modalEl = document.getElementById('ratingsModal');
    (window as any).bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  submitRating(): void {
    if (!this.newRating.comment.trim()) return;
    const payload = {
      restaurantId: this.selectedRestaurant.id,
      customerName: this.loggedInUser.name,
      score: this.newRating.score,
      comment: this.newRating.comment,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.api.addRating(payload).subscribe(() => {
      this.selectedRatings.push(payload);
      this.newRating = { score: 5, comment: '' };
    });
  }

  getStars(score: number): string {
    return '★'.repeat(score) + '☆'.repeat(5 - score);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
