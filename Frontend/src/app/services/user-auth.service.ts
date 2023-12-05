import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private user: UserService, private router: Router) { }

  async login(e:string, p:string){
    let verified: boolean= Boolean(await this.user.verify(e,p))
    console.log('this is login',verified)
    if(verified){
      localStorage.setItem('email',e)
      localStorage.setItem('password',p)
      verified= true;
    }
    return verified;
  }

  logout(){
    localStorage.removeItem('email')
    localStorage.removeItem('password')
    this.router.navigate(['/'])
  }
}
