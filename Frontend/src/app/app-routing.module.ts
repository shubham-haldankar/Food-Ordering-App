import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchComponent } from './search/search.component';
import { ExploreComponent } from './explore/explore.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './shared/login/login.component';
import { ProfileComponent } from './shared/profile/profile.component';
import { SignUpComponent } from './shared/sign-up/sign-up.component';
import { userAuthGuard } from './guards/user-auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search/:query', component: SearchComponent },
  { path: 'explore/:rId', component: ExploreComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [userAuthGuard] },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'restaurants/sign-up', component: SignUpComponent },
  { path: 'restaurants/login', component: LoginComponent },
  { path: 'restaurants', loadChildren: () => import('./restaurants/restaurants.module').then(m => m.RestaurantsModule) },
  { path : '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
