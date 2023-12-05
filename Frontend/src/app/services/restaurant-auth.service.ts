import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantService } from './restaurant.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantAuthService {

  constructor(private restaurantService:RestaurantService, private router: Router) { }

  async login(e:string, p:string){
    let verified: boolean= Boolean(await this.restaurantService.verify(e,p))
    console.log('this is login',verified)
    if(verified){
      localStorage.setItem('email',e)
      localStorage.setItem('password',p)
      verified= true;
    }
    return verified;
  }

  logout(){
    localStorage.removeItem('email')
    localStorage.removeItem('password')
    this.router.navigate(['/'])
  }

}
