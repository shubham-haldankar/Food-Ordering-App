import { Component, OnInit } from '@angular/core';
import { restaurant } from '../datatypes';
import { RestaurantService } from '../services/restaurant.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchResult: restaurant[] | undefined;
  query:string= ''

  constructor(private restaurantService: RestaurantService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      data=>{
        this.query=data['query']
        this.restaurantService.search(this.query).subscribe(result=>this.searchResult=result)
      }
    )
  }

}
