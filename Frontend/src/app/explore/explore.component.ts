import { Component, OnInit } from '@angular/core';
import { cartItem, foodItem } from '../datatypes';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../services/restaurant.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  rsId: number= 0
  restaurantName: string= '';
  foodArray: foodItem[] = [];
  selectedItem: foodItem|undefined; 
  selectedQuantity: number= 1;
  selectedTotal: number= 0;
  discountedPrice: number= 0;
  successMessage: string= "";
  errorMessage: string= "";
  cartArray:  cartItem[]= [];

  constructor(private activatedRoute:ActivatedRoute, private restaurantService:RestaurantService,  private cartService: CartService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      data=>{
        this.rsId=Number(data['rId'])
        this.restaurantService.getRestaurantDetails(this.rsId).subscribe(
          data=>{
            this.foodArray= data.menu
            this.restaurantName= data.name
          }
        )
      }
    )
    this.cartService.cart$.subscribe(data=>data?this.cartArray=data:this.cartArray=[])
  }

  selectItem(food: foodItem){
    this.selectedItem= food;
    var itemIndex = this.cartArray.filter(i=>i['restaurant-id']==this.rsId).map(i=>i.name).indexOf(this.selectedItem.name);//use id instead of name(for uniqueness)
    if(itemIndex!=-1){
      this.selectedQuantity= this.cartArray[itemIndex].quantity;
    }else{
      this.selectedQuantity= 1;
    }
    this.discountedPrice= this.selectedItem.price*(100-this.selectedItem.discount)/100;;
    this.selectedTotal= this.discountedPrice*this.selectedQuantity;
  }

  onKey(event: any) {
    if(event.target.value<0){
      event.target.value= 0;
    }else if(event.target.value>100){
      event.target.value= 100;
    }
    this.selectedQuantity= Number(event.target.value);
    if(this.selectedItem){
      this.selectedTotal= this.discountedPrice*this.selectedQuantity;
    }
  }

  decrement(){
    if(this.selectedQuantity>0){
      this.selectedQuantity-= 1;
    }
    if(this.selectedItem){
      this.selectedTotal= this.discountedPrice*this.selectedQuantity;
    }
  }

  increment(){
    if(this.selectedQuantity<100){
      this.selectedQuantity+= 1;
    }
    if(this.selectedItem){
      this.selectedTotal= this.discountedPrice*this.selectedQuantity;
    }
  }

  updatingCart(){
    if(this.selectedItem){
      let item: any;
      let st= this.discountedPrice*this.selectedQuantity;
      item= {...this.selectedItem, rsId: this.rsId, quantity: this.selectedQuantity, subTotal: st}
      this.cartService.updateCart(item)
    }
  }

}
