import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { addOrder, order } from '../datatypes';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private oUrl: string= "http://localhost:3000/orders"

  constructor(private http:HttpClient) { }

  addOrder(data:addOrder){
    return this.http.post<order>(this.oUrl, data)
  }

  getOrder(orderId:number){
    return this.http.get<order>(this.oUrl+`/${orderId}`)
  }

  getOrders(){
    return this.http.get<order[]>(this.oUrl)
  }

  async addRating(orderId:number,r:number){
    let orderDetails= await this.getOrder(orderId).toPromise()
    orderDetails!.rating= r
    return await this.http.put<order>(this.oUrl+`/${orderId}`, orderDetails).toPromise()
  }
}
