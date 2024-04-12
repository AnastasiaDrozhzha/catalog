import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Greeting } from '../model/greeting'
import { GreetingService } from '../service/greeting-service.service';

@Component({
  selector: 'app-greeting',
  standalone: true,
  imports: [NgIf],
  templateUrl: './greeting.component.html',
  styleUrl: './greeting.component.css'
})
export class GreetingComponent implements OnInit {

  greeting: Greeting | undefined;

  constructor(private greetingService: GreetingService) {
    this.greeting = { name: ''};
  }

  ngOnInit() {
    this.greetingService.findGreeting().subscribe(data => {
      this.greeting = data;
    });
  }
}
