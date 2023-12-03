import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../services/restaurant.service';
import { restaurant } from '../datatypes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  restaurants: restaurant[] | undefined;

  constructor(private restaurantService:RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe(restaurants=>{
      this.restaurants=restaurants
    })
  }

}
