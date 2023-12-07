import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { order } from '../datatypes';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private oUrl: string= "http://localhost:3000/orders"

  constructor(private http:HttpClient) { }

  addOrder(data:order){
    return this.http.post<order>(this.oUrl, data)
  }
}
