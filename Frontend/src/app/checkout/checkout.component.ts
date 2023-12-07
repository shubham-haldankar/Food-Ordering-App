import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CartService } from '../services/cart.service';
import { cartItem, user } from '../datatypes';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{
  cartArray: cartItem[]= [];
  profileData: user | undefined
  detailsForm: FormGroup= new FormGroup({name:new FormControl(), mobile:new FormControl(), address: new FormGroup({street: new FormControl(), pincode: new FormControl(), city: new FormControl(), state: new FormControl(), country: new FormControl()})})
  idData!: number
  em: string= ''
  pwd: string= ''
  st: number= 0
  gt: number= 0
  orderId: number= 0

  constructor(private fb:FormBuilder, private router: Router, private user: UserService, private cartService: CartService, private orderService:OrderService) {}
  
  ngOnInit(): void {
    let em= localStorage.getItem('email')
    let pwd= localStorage.getItem('password')

    this.user.verify(String(em),String(pwd)).then((uId)=>{
      if(uId){
        this.idData= uId
        this.user.getUserDetails(uId).subscribe(data=>{
          this.profileData= data
          this.em= String(em)
          this.pwd= String(pwd)
          console.log('profile data',this.profileData.name)
          this.detailsForm= this.fb.group({
            name: [this.profileData.name, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
            mobile: [this.profileData.mobile, [Validators.required, Validators.pattern(/[0-9]{10}$/)]],
            address: this.fb.group({
              street: [this.profileData.address.street, [Validators.required, Validators.pattern(/^\w/)]],
              pincode: [this.profileData.address.pincode, [Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{5}$/)]],
              city: [this.profileData.address.city, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
              state: [this.profileData.address.state, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
              country: [this.profileData.address.country, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]]
            })
          })
        })
      }
    })
    
    this.cartService.total$.subscribe(data=> {this.st=data;this.gt= Math.round(data*1.13+50+3)})
    this.cartService.cart$.subscribe(data=>this.cartArray=data)
  }

  placeOrder(){
    this.orderService.addOrder({'user-id': this.idData,'restaurant-id': this.cartService.cart$.value[0]['restaurant-id'], items: this.cartService.cart$.value, address: this.detailsForm.value.address, grandTotal: this.gt, rating: 0}).subscribe(
      data=>{
        this.cartService.resetCart()
        this.router.navigate(['/success/',data.id])})
  }

  homePage(){
    this.router.navigate(['/'])
  }

}
