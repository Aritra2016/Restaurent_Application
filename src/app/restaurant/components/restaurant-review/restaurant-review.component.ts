import { Component, Input, OnChanges } from '@angular/core';
import { ApiService } from '../../../shared/api.service';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-restaurant-review',
  templateUrl: './restaurant-review.component.html'
})
export class RestaurantReviewComponent implements OnChanges {
  @Input() restaurantId!: number;

  ratings: any[] = [];
  loggedInUser: any;
  newRating = { score: 5, comment: '' };
  submitting = false;

  constructor(private api: ApiService, private auth: AuthService) {
    this.loggedInUser = this.auth.getLoggedInUser();
  }

  ngOnChanges(): void {
    if (this.restaurantId) {
      this.api.getRatingsByRestaurant(this.restaurantId).subscribe((res: any[]) => this.ratings = res);
    }
  }

  getStars(score: number): string {
    const s = Math.min(5, Math.max(0, Math.round(score)));
    return '★'.repeat(s) + '☆'.repeat(5 - s);
  }

  submit(): void {
    if (!this.newRating.comment.trim() || this.submitting) return;
    this.submitting = true;
    const payload = {
      restaurantId: this.restaurantId,
      customerName: this.loggedInUser.name,
      score: this.newRating.score,
      comment: this.newRating.comment.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.api.addRating(payload).subscribe((saved: any) => {
      this.ratings = [...this.ratings, saved];
      this.newRating = { score: 5, comment: '' };
      this.submitting = false;
    });
  }
}
