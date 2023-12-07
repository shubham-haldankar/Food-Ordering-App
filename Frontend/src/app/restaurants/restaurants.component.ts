import { Component, OnInit } from '@angular/core';
import { foodItem } from '../datatypes';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  rsId: number= 0
  itemId: number= 0
  restaurantName: string= '';
  foodArray: foodItem[] = [];
  selectedItem: foodItem | undefined;
  successMessage: string= "";
  errorMessage: string= "";
  editItemForm: FormGroup= new FormGroup({name:new FormControl(), price:new FormControl(), rating: new FormControl(), discount: new FormControl(), category: new FormControl(), image: new FormControl()})
  addItemForm: FormGroup= new FormGroup({name:new FormControl(), price:new FormControl(), rating: new FormControl(), discount: new FormControl(), category: new FormControl(), image: new FormControl()})
  
  constructor(private activatedRoute:ActivatedRoute, private restaurantService:RestaurantService, private fb:FormBuilder) {}

  ngOnInit(): void {
    let em= localStorage.getItem('email')
    let pwd= localStorage.getItem('password')
    if(em && pwd){
      this.fetchData(em)
      
      this.addItemForm= this.fb.group({
        name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
        price: ['', [Validators.required, Validators.min(0), Validators.max(999)]],
        rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
        discount: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
        category: ['', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z &-]*$/)]],
        image: ['', [Validators.required]]
      })
    }
  }

  selectingItem(food:any,i:number){
    this.selectedItem= food;
    this.itemId= i
    this.editItemForm= this.fb.group({
      name: [food.name, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]],
      price: [food.price, [Validators.required, Validators.min(0), Validators.max(999)]],
      rating: [food.rating, [Validators.required, Validators.min(1), Validators.max(5)]],
      discount: [food.discount, [Validators.required, Validators.min(0), Validators.max(99)]],
      category: [food.category, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z &-]*$/)]],
      image: [food.image, [Validators.required]]
    })
  }

  fetchData(em:string){
    this.restaurantService.getId(em).then(
      rsId=>{
        this.rsId=rsId
        this.restaurantService.getRestaurantDetails(this.rsId).subscribe(
          data=>{
            this.foodArray= data.menu
            this.restaurantName= data.name
          }
        )
      }
    )
  }

  editItem(){
    console.log(this.editItemForm.value)
    this.restaurantService.getRestaurantDetails(this.rsId).subscribe(detailsData=>{
      detailsData.menu[this.itemId]= {...this.editItemForm.value, id:detailsData.menu[this.itemId].id}
      this.restaurantService.updateDetails(this.rsId,detailsData).subscribe(data=>console.log('data updated',data))
    })
    
  }
  

  deleteItem(){
    console.log('delete item called')
    let em= localStorage.getItem('email')
    let pwd= localStorage.getItem('password')
    if(em && pwd){
      this.restaurantService.getRestaurantDetails(this.rsId).subscribe(detailsData=>{
        detailsData.menu.splice(this.itemId,1)
        this.restaurantService.updateDetails(this.rsId,detailsData).subscribe(data=>{console.log('data deleted',data),this.fetchData(String(em))})
      })
    }
  }

  addItem(){
    console.log(this.addItemForm.value)
    let em= localStorage.getItem('email')
    let pwd= localStorage.getItem('password')
    if(em && pwd){
      this.restaurantService.getRestaurantDetails(this.rsId).subscribe(detailsData=>{
        detailsData.menu.push({id:detailsData.menu[detailsData.menu.length-1].id+1, ...this.addItemForm.value})
        this.restaurantService.updateDetails(this.rsId,detailsData).subscribe(data=>{console.log('data added',data),this.fetchData(String(em))})
      })
    }
  }
}
