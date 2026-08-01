import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RestaurentDashComponent } from './restaurent-dash/restaurent-dash.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeDashboardComponent } from './home-dashboard/home-dashboard.component';
import { RestaurantDetailsComponent } from './restaurant/pages/restaurant-details/restaurant-details.component';
import { RestaurantHeaderComponent } from './restaurant/components/restaurant-header/restaurant-header.component';
import { RestaurantInfoComponent } from './restaurant/components/restaurant-info/restaurant-info.component';
import { RestaurantOffersComponent } from './restaurant/components/restaurant-offers/restaurant-offers.component';
import { MenuCategoryComponent } from './restaurant/components/menu-category/menu-category.component';
import { MenuItemCardComponent } from './restaurant/components/menu-item-card/menu-item-card.component';
import { RestaurantReviewComponent } from './restaurant/components/restaurant-review/restaurant-review.component';
import { CartSummaryComponent } from './restaurant/components/cart-summary/cart-summary.component';

@NgModule({
  declarations: [
    AppComponent,
    RestaurentDashComponent,
    LoginComponent,
    SignupComponent,
    HomeDashboardComponent,
    RestaurantDetailsComponent,
    RestaurantHeaderComponent,
    RestaurantInfoComponent,
    RestaurantOffersComponent,
    MenuCategoryComponent,
    MenuItemCardComponent,
    RestaurantReviewComponent,
    CartSummaryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }