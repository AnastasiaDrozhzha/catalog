import { Component, OnInit } from '@angular/core';
import { Greeting } from '../model/greeting'
import { GreetingService } from '../service/greeting-service.service';

@Component({
  selector: 'app-greeting',
  standalone: true,
  imports: [],
  templateUrl: './greeting.component.html',
  styleUrl: './greeting.component.css'
})
export class GreetingComponent implements OnInit {

  greeting: Greeting;

  constructor(private greetingService: GreetingService) {
    this.greeting = { name: ''};
  }

  ngOnInit() {
    this.greetingService.findGreeting().subscribe(data => {
      this.greeting = data;
    });
  }
}
