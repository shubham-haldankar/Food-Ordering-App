import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend';
  currentRoute: string= '';
  keyval: string= '';
  
  constructor(private router:Router){
    router.events.subscribe(
      value => {
        this.currentRoute= this.router.url.toString()
        this.keyval= this.currentRoute.split('/')[1]
        if(this.keyval!='restaurants' && this.keyval!='checkout'){
          this.keyval= ''
        }
      }
    )
  }
}
