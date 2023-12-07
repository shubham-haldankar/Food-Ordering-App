import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit{
  orderId: number= 0
  color1: string= ''
  color2: string= ''
  color3: string= ''
  color4: string= ''
  color5: string= ''

  constructor(private activatedRoute:ActivatedRoute, private router: Router, private orderService: OrderService, private restaurantService:RestaurantService) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data=>{
      this.orderId= data['oId']
      this.orderService.getOrder(this.orderId).subscribe(
        orderData=>{
          this.rating(orderData.rating)
        }
      )
    })
  }

  rating(r:number){
    this.resetRating()
    if(r>=1) this.color1= 'orange';
    if(r>=2) this.color2= 'orange';
    if(r>=3) this.color3= 'orange';
    if(r>=4) this.color4= 'orange';
    if(r==5) this.color5= 'orange';
  }

  submitRating(r:number){
    this.rating(r)
    this.restaurantService.updateRating(this.orderId,r)
  }

  resetRating(){
    this.color1= ''
    this.color2= ''
    this.color3= ''
    this.color4= ''
    this.color5= ''
  }

  homePage(){
    this.router.navigate(['/'])
  }
}
