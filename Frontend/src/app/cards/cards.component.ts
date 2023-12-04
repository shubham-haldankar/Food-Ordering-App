import { Component, Input } from '@angular/core';
import { restaurant } from '../datatypes';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent {

  @Input()
  restaurants:restaurant[]= [];

}
