import { Component, OnInit } from '@angular/core';
import { foodItem, restaurant, user } from 'src/app/datatypes';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { UserService } from 'src/app/services/user.service';
import { RestaurantAuthService } from 'src/app/services/restaurant-auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  parentUrl: string=''
  profileData: user | restaurant |undefined;
  chgPwd:boolean= false
  em: string= ''
  pwd: string= ''
  idData!: number
  detailsForm: FormGroup= new FormGroup({name:new FormControl(), mobile:new FormControl(), address: new FormGroup({street: new FormControl(), pincode: new FormControl(), city: new FormControl(), state: new FormControl(), country: new FormControl()})})
  email: string= ''
  oldPassword: string= ''
  password: string= ''
  confirmPassword: string= ''
  successMessage: string= ''
  errorMessage: string= ''
  passwordSuccessMessage: string= ''
  passwordErrorMessage: string= ''

  constructor(private userAuthService:UserAuthService, private cartService: CartService, private activatedRoute: ActivatedRoute, private restaurantService: RestaurantService, private userService:UserService, private fb: FormBuilder, private restaurantAuthService:RestaurantAuthService) {
    this.activatedRoute.parent?.url.subscribe(
      data=>{
        let temp= data[0].path
        console.log('profile',temp)
        if(typeof temp=='undefined'){
          this.parentUrl= ''
        }else if(temp=='profile'){
          this.parentUrl= ''
        }else{
          this.parentUrl= temp
        }
      }
    )
   }

   ngOnInit(): void {
    console.log('profile ngOnInt')
    let em= localStorage.getItem('email')
    let pwd= localStorage.getItem('password')
    console.log(this.parentUrl)
    if(this.parentUrl==''){
      this.userService.verify(String(em),String(pwd)).then((uId)=>{
        if(uId){
          this.idData= uId
          this.userService.getUserDetails(uId).subscribe(data=>{
            this.profileData= data
            this.em= String(em)
            this.pwd= String(pwd)
            console.log('profile data',this.profileData.name)
            this.detailsForm= this.fb.group({
              name: [this.profileData.name, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
              mobile: [this.profileData.mobile, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
              address: this.fb.group({
                street: [this.profileData.address.street, [Validators.required, Validators.pattern(/^\w/)]],
                pincode: [this.profileData.address.pincode, [Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{5}$/)]],
                city: [this.profileData.address.city, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
                state: [this.profileData.address.state, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
                country: [this.profileData.address.country, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]]
              })
            })
          })
        }
      })
    }else if(this.parentUrl=='restaurants'){
      this.restaurantService.verify(String(em),String(pwd)).then((rsId)=>{
        if(rsId){
          this.idData= rsId
          this.restaurantService.getRestaurantDetails(rsId).subscribe(data=>{
            this.profileData= data;
            console.log('restaurants data',this.profileData)
            this.em= String(em)
            this.pwd= String(pwd)
            this.detailsForm= this.fb.group({
              name: [this.profileData.name, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
              mobile: [this.profileData.mobile, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
              address: this.fb.group({
                street: [this.profileData.address.street, [Validators.required, Validators.pattern(/^\w/)]],
                pincode: [this.profileData.address.pincode, [Validators.required, Validators.pattern(/^[1-9]{1}[0-9]{5}$/)]],
                city: [this.profileData.address.city, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
                state: [this.profileData.address.state, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
                country: [this.profileData.address.country, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]]
              })
            })
          })
        }
      })
    }
  }

  logout(){
    if(this.parentUrl==''){
      console.log('logout submitted')
      this.cartService.cart$.next([])
      this.cartService.total$.next(0)
      this.cartService.netDiscount$.next(0)
      this.userAuthService.logout()
    }else if(this.parentUrl=='restaurants'){
      this.restaurantAuthService.logout()
    }
  }

  toggle(){
    this.chgPwd=!this.chgPwd
    this.successMessage= ''
    this.errorMessage= ''
    this.passwordSuccessMessage= ''
    this.passwordErrorMessage= ''
  }
  
  async submitDetails(){
    console.log(this.parentUrl,'in submit details')
    if(this.parentUrl==''){
      if(this.em && this.pwd){
        this.userService.getCart(this.em).then(cartData=>{
        let detailsData= {...this.detailsForm.value, cart: cartData}
        console.log('submit details clled')
        console.log('submitted details funcion',this.detailsForm.controls['address'].get('street'))
        this.userService.updateDetails(this.idData, detailsData).subscribe(
          data=>{
            console.log(Boolean(data))
            if(data){
              console.log('inside profile uoaddte')
              this.successMessage= 'Details updated successfully!'
            }
          }
        )})
      }
    }else if(this.parentUrl=='restaurants'){
      if(this.em && this.pwd){
        this.restaurantService.getMenu(this.em).then(
          async menuData=>{
          let categoryList= menuData?.map((item:foodItem)=>item.category)  
          let uniqueCategory = categoryList?.filter((value:string, index:number, array:string[]) => array.indexOf(value) === index);
          let discountList= menuData?.map((item:foodItem)=>item.discount)  
          if(discountList==undefined){
            discountList= []
          }
          console.log('unique category menu data',menuData,discountList,Math.max(...discountList))
          let detailsData= {...this.detailsForm.value, menu: menuData, image: '', rating: await this.restaurantService.getRating(this.idData), category: String(uniqueCategory), maxDiscount: Math.max(...discountList)}
          console.log('submit details clled')
          console.log('submitted details funcion',this.detailsForm.controls['address'].get('street'))
          this.restaurantService.updateDetails(this.idData, detailsData).subscribe(
            data=>{
              console.log(Boolean(data))
              if(data){
                console.log('inside profile uoaddte')
                this.successMessage= 'Details updated successfully!'
              }
            }
        )})
      }
    }
  }

  async updatePassword(passwordForm:any){
    if(this.parentUrl==''){
      if(this.em && this.pwd){
      let credentials= {...passwordForm.value,id:this.idData}
      credentials.email= this.em
      delete credentials.oldPassword
      delete credentials.confirmPassword
      this.userService.updatePassword(credentials).subscribe(
        data=>{
          if(data){
            this.passwordSuccessMessage= 'Password updated successfully!'
          }
        }
      )}
    }else if(this.parentUrl=='restaurants'){
      if(this.em && this.pwd){
        let credentials= {...passwordForm.value,id:this.idData}
        credentials.email= this.em
        delete credentials.oldPassword
        delete credentials.confirmPassword
        this.restaurantService.updatePassword(credentials).subscribe(
          data=>{
            if(data){
              this.passwordSuccessMessage= 'Password updated successfully!'
            }
          }
        )}
    }
  }
  
}
