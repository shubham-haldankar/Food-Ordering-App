import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { restaurant } from '../datatypes';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent {
  searchResult: restaurant[]= [];

  constructor(private router:Router, private restaurantService:RestaurantService) {}

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
    this.router.navigate(['/checkout'])
  }

}
