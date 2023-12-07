import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cartItem } from '../datatypes';
import { UserAuthService } from './user-auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart$= new BehaviorSubject<cartItem[]>([])
  total$= new BehaviorSubject<number>(0)
  netDiscount$= new BehaviorSubject<number>(0)

  constructor(private userAuthService:UserAuthService ,private userService:UserService) {
    //syncing all observable properties with database
    let em= localStorage.getItem('email')
    let pwd= localStorage.getItem('password')
    this.userAuthService.login(String(em),String(pwd)).then(
      (verified)=>{
        let cart= localStorage.getItem('cart')
        if(verified){
          this.userService.getCart(String(em)).then(data=>{
            if(data){
              let cartFiltered= data
              this.cart$.next(cartFiltered)
              this.total$.next(this.cart$.value.map(item=>item.subTotal).reduce((partialSum, a) => partialSum + a, 0))
              this.netDiscount$.next(this.cart$.value.map(item=>item.price*item.quantity-item.subTotal).reduce((partialSum, a) => partialSum + a, 0))
              if(cart){
                JSON.parse(cart).forEach((item:cartItem)=>this.updateCart(item))
              }
            }
          })
        }else if(cart){
          let cartFiltered= JSON.parse(cart)
          console.log(cart)
          let rsId= cartFiltered[cartFiltered.length-1].rsId
          cartFiltered= JSON.parse(cart).filter((item:cartItem)=>item['restaurant-id']==rsId)
          this.cart$.next(cartFiltered)
          this.total$.next(this.cart$.value.map(item=>item.subTotal).reduce((partialSum, a) => partialSum + a, 0))
          this.netDiscount$.next(this.cart$.value.map(item=>item.price*item.quantity-item.subTotal).reduce((partialSum, a) => partialSum + a, 0))
          
        }
      })
    
  }

  updateCart(item:cartItem){
    let currentCart:cartItem[]= this.cart$.value
    let rsId= item['restaurant-id']
    currentCart= currentCart.filter((i:cartItem)=>i['restaurant-id']==rsId)
    var itemIndex = currentCart.map(i=>i.name).indexOf(item.name);
    if(itemIndex!=-1){
      currentCart[itemIndex].quantity= item.quantity;
      currentCart[itemIndex].subTotal= item.price*item.quantity-item.discount/100*item.price*item.quantity;
      console.log(currentCart);
      if(item.quantity==0){
        currentCart.splice(itemIndex,1)
      }
    }else if(item.quantity){
      currentCart.push(item);
      console.log(currentCart);
    }
    this.cart$.next(currentCart)
    this.total$.next(this.cart$.value.map(item=>item.subTotal).reduce((partialSum, a) => partialSum + a, 0))
    this.netDiscount$.next(this.cart$.value.map(item=>item.price*item.quantity-item.subTotal).reduce((partialSum, a) => partialSum + a, 0))
    
    let em= localStorage.getItem('email')
    let pwd= localStorage.getItem('password')
    console.log(em,pwd)
    this.userAuthService.login(String(em),String(pwd)).then(
      (verified)=>{
        if(verified){
          this.userService.postCart(String(em), currentCart).then((data)=>console.log('update cart called',data))//working
          localStorage.removeItem('cart')
        }else{
          localStorage.setItem('cart',JSON.stringify(currentCart))
        }
      })
  }

  resetCart(){
    let em= localStorage.getItem('email')
    let pwd= localStorage.getItem('password')
    console.log(em,pwd)
    this.userAuthService.login(String(em),String(pwd)).then(
      (verified)=>{
        if(verified){
          this.cart$.next([])
          this.total$.next(0)
          this.netDiscount$.next(0)
          this.userService.postCart(String(em), []).then((data)=>console.log('resetCart called',data))
        }
      })
  }
}
