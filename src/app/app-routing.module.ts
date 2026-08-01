import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RestaurentDashComponent } from './restaurent-dash/restaurent-dash.component';
import { SignupComponent } from './signup/signup.component';
import { HomeDashboardComponent } from './home-dashboard/home-dashboard.component';
import { RestaurantDetailsComponent } from './restaurant/pages/restaurant-details/restaurant-details.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'home', component: HomeDashboardComponent
  },
  {
   path: 'login', component: LoginComponent 
  },
  {
   path: 'signup', component: SignupComponent 
  }, 
  {
   path: 'restaurent', component: RestaurentDashComponent
  },
  {
    path: 'restaurant/:id', component: RestaurantDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
