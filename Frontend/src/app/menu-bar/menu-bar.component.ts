import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { foodItem } from '../datatypes';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent {
  searchResult: foodItem[] | undefined;

  constructor(private router:Router) {}

  suggestions(query:KeyboardEvent){
    console.log(query)
  }

  hideSearch(){
    this.searchResult= undefined;
  }

  submitSearch(searchInput:string){
    console.log(searchInput)
  }

  explorePage(rsId:number){
    console.log(rsId)
  }

  checkout(){
    this.router.navigate(['/checkout'])
  }

}
