import { Component } from '@angular/core';
import { Template } from '../model/template';

@Component({
  selector: 'app-properties-search',
  standalone: true,
  imports: [],
  templateUrl: './properties-search.component.html',
  styleUrl: './properties-search.component.css'
})
export class PropertiesSearchComponent {

  template: Template | undefined;

   constructor() {
     this.template = window.history.state;
   }

}
