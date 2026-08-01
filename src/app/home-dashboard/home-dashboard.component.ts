import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.css']
})
export class HomeDashboardComponent implements OnInit {
  totalRestaurants: number = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getRestaurent().subscribe((res: any[]) => {
      this.totalRestaurants = res.length;
    });
  }
}
