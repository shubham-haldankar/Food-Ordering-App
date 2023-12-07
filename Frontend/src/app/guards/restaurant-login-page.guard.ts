import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RestaurantAuthService } from '../services/restaurant-auth.service';

export const restaurantLoginPageGuard: CanActivateFn = async (route, state) => {
  const restaurantAuthService:RestaurantAuthService= inject(RestaurantAuthService)
  const router:Router= inject(Router)
  let e= localStorage.getItem('email')
  let p= localStorage.getItem('password')
  if(!e){
    e= ''
  }
  if(!p){
    p=''
  }
  if(e && p){
    if(await restaurantAuthService.login(e,p)){
      router.navigate(['/restaurants'])
      return false
    }else{
      return true
    }
  }
  return true;
};
