import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { cartItem, restaurant } from '../datatypes';
import { RestaurantService } from '../services/restaurant.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  searchResult: restaurant[]= [];
  cartArray: cartItem[]= []

  constructor(private router:Router, private restaurantService:RestaurantService, private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(data=>data?this.cartArray=data:this.cartArray=[])
  }

  suggestions(query:KeyboardEvent){
    if(query){
      const element= query.target as HTMLInputElement
      this.restaurantService.search(element.value).subscribe(result=>{
        if(result.length>5){
          result.length= 5
        }
        this.searchResult=result
      })
      
      console.log(this.searchResult)
    }
  }

  hideSearch(){
    this.searchResult= [];
  }

  submitSearch(searchInput:string){
    if(searchInput){
      this.router.navigate([`/search/${searchInput}`])
    }
  }

  explorePage(rsId:number){
    this.router.navigate(['/explore',rsId])
  }

  checkout(){
    this.cartService.cart$.value.forEach((item)=>this.cartService.updateCart(item))
    this.router.navigate(['/checkout'])
  }

  homePage(){
    this.router.navigate(['/'])
  }

  @Input()
  key:string= ''

}
