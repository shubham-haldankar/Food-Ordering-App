import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cartItem, credentials, user } from '../datatypes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private uUrl: string= "http://localhost:3000/users"
  private uCUrl: string= "http://localhost:3000/userCredentials"

  constructor(private http: HttpClient) { }

  async getCart(email:string):Promise<cartItem[]|undefined>{
    let user= await this.http.get<credentials[]>(this.uCUrl+`?email=${encodeURIComponent(email)}`).toPromise()
    if(user==undefined){
      user= []
    }
    let userDetails= await this.http.get<user>(this.uUrl+`/${user[0].id}`).toPromise()
    return userDetails?.cart
  }

  async verify(email:string, password:string):Promise<number|null>{
    let user= await this.http.get<credentials[]>(this.uCUrl+`?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`).toPromise()
    if(user==undefined){
      user= []
    }
    return user.length? user[0].id: null
  }

  getUsers():Observable<credentials[]>{
    return this.http.get<credentials[]>(this.uCUrl)
  }

  async verifyEmail(em:string):Promise<boolean>{
    let users= await this.getUsers().toPromise()
    console.log('here is testing ',users,users?.map((user:credentials)=>user.email).find((email:string)=>email==em))
    let registered= users?.map((user:credentials)=>user.email).find((email:string)=>email==em)
    return registered? true: false
  }

  addUserDetails():Observable<user>{
    return this.http.post<user>(this.uUrl,{name: "", mobile: 0, address: "", cart: []})
  }

  async addUser(data:credentials):Promise<credentials|undefined>{
    if(await this.verifyEmail(data.email)){
      return new Promise((resolve, reject)=>reject('Email already registered'))
    }else{
      let detailsData= await this.addUserDetails().toPromise()
      data= {id: detailsData!.id, email:data.email, password:data.password}
      return this.http.post<credentials>(this.uCUrl,data).toPromise()
    }
  }
  
  getUserDetails(uId:number):Observable<user>{
    return this.http.get<user>(this.uUrl+"/"+uId)
  }

  updateDetails(uId:number,detailsData:user){
    return this.http.put<user>(this.uUrl+"/"+uId,detailsData)
  }

  updatePassword(credentials:credentials){
    return this.http.put<credentials>(this.uCUrl+'/'+credentials.id,credentials)
  }

}
