import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { credentials, restaurant } from '../datatypes';

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

  async verify(email:string, password:string):Promise<number|null>{
    console.log(email, password)
    let restaurant= await this.http.get<credentials[]>(this.rCUrl+`?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`).toPromise()//change the type
    if(restaurant==undefined){
      restaurant= []
    }
    return restaurant.length? restaurant[0].id: null
  }
}
