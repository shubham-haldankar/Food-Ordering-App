import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { credentials, foodItem, order, restaurant } from '../datatypes';
import { Observable } from 'rxjs';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private rUrl: string= "http://localhost:3000/restaurants"
  private rCUrl: string= "http://localhost:3000/restaurantCredentials"

  constructor(private http: HttpClient, private orderService:OrderService) { }

  getRestaurants():Observable<credentials[]>{
    return this.http.get<credentials[]>(this.rCUrl)
  }

  getRestaurantsDetails():Observable<restaurant[]>{
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
    let restaurant= await this.http.get<credentials[]>(this.rCUrl+`?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`).toPromise()
    if(restaurant==undefined){
      restaurant= []
    }
    return restaurant.length? restaurant[0].id: null
  }

  async verifyEmail(em:string):Promise<boolean>{
    let restaurants= await this.getRestaurants().toPromise()
    console.log('here is testing ',restaurants,restaurants?.map((restaurant:credentials)=>restaurant.email).find((email:string)=>email==em))
    let registered= restaurants?.map((restaurant:credentials)=>restaurant.email).find((email:string)=>email==em)
    return registered? true: false
  }

  addRestaurantDetails():Observable<restaurant>{
    return this.http.post<restaurant>(this.rUrl,{name: "", mobile: 0, address: {}, noOfRatings: 0, menu: [], image: '', category: '', rating: 0, maxDiscount: 0})
  }

  async addRestaurant(data:credentials):Promise<credentials|undefined>{
    if(await this.verifyEmail(data.email)){
      console.log('reg failed')
      return new Promise((resolve, reject)=>reject('Email already registered'))
    }else{
      console.log('reg stared')
      let detailsData= await this.addRestaurantDetails().toPromise()
      data= {id: detailsData!.id, email: data.email, password: data.password}
      return this.http.post<credentials>(this.rCUrl,data).toPromise()
    }
  }

  async getMenu(email:string):Promise<foodItem[]|undefined>{
    let restaurant= await this.http.get<credentials[]>(this.rCUrl+`?email=${encodeURIComponent(email)}`).toPromise()
    let restaurantDetails= await this.http.get<restaurant>(this.rUrl+`/${restaurant![0].id}`).toPromise()
    return restaurantDetails?.menu
  }

  updateDetails(rsId:number,detailsData:restaurant){
    return this.http.put<restaurant>(this.rUrl+"/"+rsId,detailsData)
  }

  async getRating(rsId:number):Promise<number>{
    let restaurantDetails= await this.http.get<restaurant>(this.rUrl+`/${rsId}`).toPromise()
    return restaurantDetails!.rating
  }

  updatePassword(credentials:credentials){
    return this.http.put<credentials>(this.rCUrl+'/'+credentials.id,credentials)
  }

  async updateRating(orderId:number, r:number){
    this.orderService.addRating(orderId,r)
    let orderData= await this.orderService.getOrder(orderId).toPromise()
    let rsId= orderData!['restaurant-id']
    let restaurantData= await this.getRestaurantDetails(rsId).toPromise()
    let orders= await this.orderService.getOrders().toPromise()
    let ratings= orders!.filter((order:order)=>order['restaurant-id']==rsId && order.rating>0).map((order:order)=>order.rating)
    restaurantData!.rating= Math.round(ratings.reduce((partialSum:number, a:number) => partialSum + a, 0)/ratings.length*10)/10
    restaurantData!.noOfRatings= ratings.length
    return await this.http.put<any>(this.rUrl+`/${rsId}`,restaurantData).toPromise()
  }

  async getId(em:string){
    let rc= await this.http.get<any>(this.rCUrl+`/?email=${em}`).toPromise()
    return rc[0].id
  }
}