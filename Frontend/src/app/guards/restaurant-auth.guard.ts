import { CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RestaurantAuthService } from '../services/restaurant-auth.service';

export const restaurantAuthGuard: CanActivateChildFn = async (childRoute, state) => {
  const restaurantAuth:RestaurantAuthService= inject(RestaurantAuthService)
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
    console.log(e,p)
    if(await restaurantAuth.login(e,p)){
      return true
    }else{
      router.navigate(['restaurants/login'])
      return false
    }
  }
  
  router.navigate(['restaurants/login'])
  return false;
};
