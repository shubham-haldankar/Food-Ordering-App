import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserAuthService } from '../services/user-auth.service';

export const userLoginPageGuard: CanActivateFn = async (route, state) => {
  const userAuth:UserAuthService= inject(UserAuthService)
  const router:Router= inject(Router)
  let e= localStorage.getItem('email')
  let p= localStorage.getItem('password')
  if(!e){
    e= ''
  }
  if(!p){
    p=''
  }
  if(e && p){
    if(await userAuth.login(e,p)){
      router.navigate(['/'])
      return false
    }else{
      return true
    }
  }
  return true;
};
