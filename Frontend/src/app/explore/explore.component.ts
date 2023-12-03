import { Component, OnInit } from '@angular/core';
import { cartItem, foodItem } from '../datatypes';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../services/restaurant.service';

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

  constructor(private activatedRoute:ActivatedRoute, private restaurantService:RestaurantService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data=>{
      this.rsId=Number(data['rId'])
      this.restaurantService.getRestaurantDetails(this.rsId).subscribe(
        data=>{
          this.foodArray= data.menu
          this.restaurantName= data.name
        }
      )
    })
  }

  selectItem(food: foodItem){
    this.selectedItem= food;
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
    
  }

}
