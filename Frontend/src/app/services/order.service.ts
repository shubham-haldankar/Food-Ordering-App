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
}
