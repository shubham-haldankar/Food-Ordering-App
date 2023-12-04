import { Component, OnInit } from '@angular/core';
import { cartItem } from '../datatypes';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartArray: cartItem[]= [];
  total: number= 0;
  cartDiscount:number= 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(
      data=>{
        data? this.cartArray=data: this.cartArray= []
        this.calculateTotal()
        this.calculateCartDiscount()
      }
    )

    this.cartService.total$.subscribe(
      data=>{
        data? this.total= data: this.total= 0
      }
    )

    this.cartService.netDiscount$.subscribe(
      data=>{
        data? this.cartDiscount= data: this.cartDiscount= 0
      }
    )

    console.log(this.cartArray)
  }

  calculateTotal(){
    this.total= 0
    this.cartArray.map((i:cartItem)=>i.subTotal).forEach((total:number) => {
      this.total+=total
    });
    this.cartService.total$.next(this.total)
  }

  calculateCartDiscount(){
    this.cartDiscount= 0
    this.cartArray.map((i:cartItem)=>i.price*i.quantity-i.subTotal).forEach((cartDiscount:number) => {
      this.cartDiscount+=cartDiscount
    });
    this.cartService.netDiscount$.next(this.cartDiscount)
  }

  onKey(event: any) {
    if(event.target.value<0){
      event.target.value = 0;
    }else if(event.target.value>100){
      event.target.value= 100;
    }
    let itemIndex= Number(event.target.id.split('_')[1])
    this.cartArray[itemIndex].subTotal= this.cartArray[itemIndex].price*Number(event.target.value)*(100-this.cartArray[itemIndex].discount)/100
    this.calculateTotal()
    this.calculateCartDiscount()
    console.log(this.cartArray)
  }

  decrement(id:number){
    if(this.cartArray[id].quantity>0){
      this.cartArray[id].quantity-= 1;
    }
    this.cartArray[id].subTotal= this.cartArray[id].price*this.cartArray[id].quantity*(100-this.cartArray[id].discount)/100;
    this.calculateTotal()
    this.calculateCartDiscount()
  }

  increment(id:number){
    if(this.cartArray[id].quantity>0){
      this.cartArray[id].quantity+= 1;
    }
    this.cartArray[id].subTotal= this.cartArray[id].price*this.cartArray[id].quantity*(100-this.cartArray[id].discount)/100;
    this.calculateTotal()
    this.calculateCartDiscount()
  }

  deleting(item:cartItem){
    item.quantity= 0
    this.cartService.updateCart(item)
  }

}
