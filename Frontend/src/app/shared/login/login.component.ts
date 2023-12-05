import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cartItem } from 'src/app/datatypes';
import { CartService } from 'src/app/services/cart.service';
import { RestaurantAuthService } from 'src/app/services/restaurant-auth.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string= ''
  password: string= ''
  errorMessage: string= ''
  successMessage: string= ''
  parentUrl: string= ''

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private userAuthService:UserAuthService, private userService:UserService, private cartService:CartService, private restaurantAuthService:RestaurantAuthService) {
    let temp= this.activatedRoute.snapshot.url[0]?.path
    console.log(temp)
    if(typeof temp=='undefined'){
      this.parentUrl= ''
    }else if(temp=='login'){
      this.parentUrl= ''
    }
    else{
      this.parentUrl= temp
    }
    console.log('login parent',this.parentUrl)
  }

  async verify(em:string, pwd:string){
    let accessingUrlId= localStorage.getItem('accessingUrlId')
    localStorage.removeItem('accessingUrlId')
    if(!accessingUrlId){
      accessingUrlId= ''
    }
    if(this.parentUrl==''){
      if(await this.userAuthService.login(em,pwd)){
        console.log('inside logic login')
        //database synchronization- immediately after login
        let cart= localStorage.getItem('cart')
        this.userService.getCart(String(em)).then(
          (data:cartItem[]|undefined)=>{
            if(data){
              let cartFiltered= data
              this.cartService.cart$.next(cartFiltered)
              this.cartService.total$.next(this.cartService.cart$.value.map(item=>item.subTotal).reduce((partialSum, a) => partialSum + a, 0))
              this.cartService.netDiscount$.next(this.cartService.cart$.value.map(item=>item.price*item.quantity-item.subTotal).reduce((partialSum, a) => partialSum + a, 0))
              if(cart){
                JSON.parse(cart).forEach((item:cartItem)=>this.cartService.updateCart(item))
              }
            }
          }
        )

        if(['profile','checkout','success'].includes(accessingUrlId)){
          this.router.navigate(['/'+accessingUrlId])
        }else{
          this.router.navigate(['/'])
        }
      }else{
        this.errorMessage= 'login failed!'
      }
    }else if(this.parentUrl=='restaurants'){
      if(await this.restaurantAuthService.login(em,pwd)){
        this.router.navigate(['/restaurants'])
      }else{
        this.errorMessage= 'login failed!'
      }
    }
  }

  signUpPage(){
    this.router.navigate([`${this.parentUrl}/sign-up`])
  }

}
