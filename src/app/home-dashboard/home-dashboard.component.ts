import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  loading = true;

  // Filters
  selectedCuisines: string[] = [];
  selectedRating: number | null = null;
  selectedDeliveryTime: number | null = null;
  cuisineOptions: string[] = [];

  // Menu modal state
  selectedRestaurant: any = null;
  menuItems: any[] = [];
  menuLoading = false;

  // Ratings modal state
  ratingRestaurant: any = null;
  selectedRatings: any[] = [];
  ratingsLoading = false;
  newRating = { score: 5, comment: '' };
  ratingSubmitting = false;

  // Add Restaurant (staff - from home page)
  addRestoForm!: FormGroup;
  addRestoSaving = false;
  addRestoSuccess = false;

  constructor(private api: ApiService, private auth: AuthService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    const user = this.auth.getLoggedInUser();
    // Force re-login if session has no role (stale session)
    if (user && !user.role) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return;
    }
    this.loggedInUser = user;
    this.addRestoForm = this.fb.group({
      name:     ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      mobile:   ['', Validators.required],
      address:  ['', Validators.required],
      cuisine:  [''],
      services: [''],
      rating:   [0],
      image:    ['']
    });
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.api.getRestaurent().subscribe({
      next: (res: any[]) => {
        this.allRestaurants = res;
        this.totalRestaurants = res.length;
        const total = res.reduce((sum, r) => sum + (r.rating || 0), 0);
        this.avgRating = res.length ? (total / res.length).toFixed(1) : '0.0';
        this.cuisineOptions = [...new Set(res.map(r => r.cuisine).filter(Boolean))] as string[];
        this.loading = false;
        this.applyFilters();
      },
      error: () => { this.loading = false; }
    });
    this.api.getOrders().subscribe({
      next: (res: any[]) => {
        this.totalOrders = res.length;
        this.deliveryOrders = res.filter(o => o.type === 'delivery').length;
      },
      error: () => {}
    });
  }

  filterRestaurants(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredRestaurants = this.allRestaurants.filter(r => {
      const matchSearch = !q || r.name.toLowerCase().includes(q) || (r.cuisine || '').toLowerCase().includes(q);
      const matchCuisine = !this.selectedCuisines.length || this.selectedCuisines.includes(r.cuisine);
      const matchRating = !this.selectedRating || r.rating >= this.selectedRating;
      const matchDelivery = !this.selectedDeliveryTime || (r.deliveryTime && r.deliveryTime <= this.selectedDeliveryTime);
      return matchSearch && matchCuisine && matchRating && matchDelivery;
    });
  }

  toggleCuisine(cuisine: string): void {
    const idx = this.selectedCuisines.indexOf(cuisine);
    if (idx > -1) this.selectedCuisines.splice(idx, 1);
    else this.selectedCuisines.push(cuisine);
    this.applyFilters();
  }

  setRatingFilter(rating: number): void {
    this.selectedRating = this.selectedRating === rating ? null : rating;
    this.applyFilters();
  }

  setDeliveryFilter(mins: number): void {
    this.selectedDeliveryTime = this.selectedDeliveryTime === mins ? null : mins;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCuisines = [];
    this.selectedRating = null;
    this.selectedDeliveryTime = null;
    this.searchQuery = '';
    this.applyFilters();
  }

  getStarDisplay(rating: number): string {
    const r = Math.round(rating);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  // ── View Menu ──────────────────────────────────────────────────────────────
  openMenu(r: any): void {
    this.selectedRestaurant = r;
    this.menuItems = [];
    this.menuLoading = true;
    this.api.getMenuByRestaurant(r.id).subscribe({
      next: (res) => {
        this.menuItems = res;
        this.menuLoading = false;
        this.showModal('menuViewModal');
      },
      error: () => { this.menuLoading = false; }
    });
  }

  // ── Ratings ────────────────────────────────────────────────────────────────
  openRatings(r: any): void {
    this.ratingRestaurant = r;
    this.selectedRatings = [];
    this.ratingsLoading = true;
    this.newRating = { score: 5, comment: '' };
    this.api.getRatingsByRestaurant(r.id).subscribe({
      next: (res) => {
        this.selectedRatings = res;
        this.ratingsLoading = false;
        this.showModal('ratingsModal');
      },
      error: () => { this.ratingsLoading = false; }
    });
  }

  submitRating(): void {
    if (!this.newRating.comment.trim() || this.ratingSubmitting) return;
    this.ratingSubmitting = true;
    const payload = {
      restaurantId: this.ratingRestaurant.id,
      customerName: this.loggedInUser.name,
      score: Number(this.newRating.score),
      comment: this.newRating.comment.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.api.addRating(payload).subscribe({
      next: (saved) => {
        this.selectedRatings = [...this.selectedRatings, saved];
        this.newRating = { score: 5, comment: '' };
        this.ratingSubmitting = false;
      },
      error: () => { this.ratingSubmitting = false; }
    });
  }

  getStars(score: number): string {
    const s = Math.min(5, Math.max(0, Math.round(score)));
    return '★'.repeat(s) + '☆'.repeat(5 - s);
  }

  getCategories(): string[] {
    return [...new Set(this.menuItems.map(i => i.category))];
  }

  getItemsByCategory(cat: string): any[] {
    return this.menuItems.filter(i => i.category === cat);
  }

  openAddRestaurant(): void {
    this.addRestoForm.reset({ rating: 0, image: '' });
    this.addRestoSuccess = false;
    this.showModal('addRestoHomeModal');
  }

  submitAddRestaurant(): void {
    if (this.addRestoForm.invalid) { this.addRestoForm.markAllAsTouched(); return; }
    this.addRestoSaving = true;
    this.api.postRestaurent(this.addRestoForm.value).subscribe({
      next: (saved) => {
        this.addRestoSaving = false;
        this.addRestoSuccess = true;
        this.allRestaurants = [...this.allRestaurants, saved];
        this.filteredRestaurants = [...this.allRestaurants];
        this.totalRestaurants = this.allRestaurants.length;
        this.addRestoForm.reset({ rating: 0, image: '' });
        setTimeout(() => {
          this.addRestoSuccess = false;
          const el = document.getElementById('addRestoHomeModal');
          if (el) (window as any).bootstrap.Modal.getOrCreateInstance(el).hide();
        }, 1500);
      },
      error: () => { this.addRestoSaving = false; }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/restaurent']);
  }

  private showModal(id: string): void {
    const el = document.getElementById(id);
    if (el) (window as any).bootstrap.Modal.getOrCreateInstance(el).show();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
