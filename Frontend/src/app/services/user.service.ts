import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cartItem, credentials, user } from '../datatypes';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl: string= "http://localhost:3000/users"
  private ucUrl: string= "http://localhost:3000/userCredentials"

  constructor(private http: HttpClient) { }

  async getCart(email:string):Promise<cartItem[]|undefined>{
    let user= await this.http.get<credentials[]>(this.ucUrl+`?email=${encodeURIComponent(email)}`).toPromise()
    if(user==undefined){
      user= []
    }
    let userDetails= await this.http.get<user>(this.usersUrl+`/${user[0].id}`).toPromise()
    return userDetails?.cart
  }

  async verify(email:string, password:string):Promise<number|null>{
    let user= await this.http.get<credentials[]>(this.ucUrl+`?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`).toPromise()
    if(user==undefined){
      user= []
    }
    return user.length? user[0].id: null
  }

}
