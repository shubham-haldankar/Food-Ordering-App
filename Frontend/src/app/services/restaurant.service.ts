import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { restaurant } from '../datatypes';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private rUrl: string= "http://localhost:3000/restaurants"
  private rCUrl: string= "http://localhost:3000/restaurantCredentials"

  constructor(private http: HttpClient) { }

  getRestaurants(){
    return this.http.get<restaurant[]>(this.rUrl)
  }

  search(q:string){
    return this.http.get<restaurant[]>(this.rUrl+`?q=${encodeURIComponent(q)}`)
  }

  getRestaurantDetails(rsId:number){
    return this.http.get<restaurant>(this.rUrl+"/"+rsId)
  }
}
