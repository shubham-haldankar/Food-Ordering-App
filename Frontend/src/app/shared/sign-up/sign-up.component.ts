import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantAuthService } from 'src/app/services/restaurant-auth.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  email: string= ''
  password: string= ''
  confirmPassword: string= ''
  errorMessage: string= ''
  successMessage: string= ''
  parentUrl: string= ''

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private resturantService:RestaurantService, private userService:UserService, private userAuthService:UserAuthService, private restaurantAuthService: RestaurantAuthService) {
    let temp= this.activatedRoute.snapshot.url[0]?.path
    console.log('sing up temp',temp)
    if(typeof temp=='undefined'){
      this.parentUrl= ''
    }else if(temp=='sign-up'){
      this.parentUrl= ''
    }else{
      this.parentUrl= temp
    }
  }

  ngOnInit(): void {}
  
  submitForm(form:any){
    let formData= form.value
    console.log('signup form submitted', form, form.controls['password'].errors)
    delete formData.confirmPassword
    if(this.parentUrl==''){
      this.userService.addUser(formData).then(
        data=>{
          this.userAuthService.login(formData.email,formData.password).then(verified=>{
            if(verified){
              this.router.navigate([`/${this.parentUrl}`+'/profile'])
            }
          })
        }).catch(
        (err)=>this.errorMessage= err
        )
    }else if(this.parentUrl=='restaurants'){
      this.resturantService.addRestaurant(formData).then(
        //add login after adding restaurant auth service
        data=>{
          this.restaurantAuthService.login(formData.email,formData.password).then(verified=>{
            if(verified){
              this.router.navigate([`/${this.parentUrl}`+'/profile'])
            }
          })
        }).catch(
        (err)=>this.errorMessage= err
        )
    }
    
  }

  loginPage(){
    this.router.navigate([`${this.parentUrl}/login`])
  }
}
