import { Component, OnInit } from '@angular/core';
import { TransitionServiceService } from './service/transition-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private animationService: TransitionServiceService) { }

  ngOnInit() {
    // this.animationService.initRouterEvents();
  }
}
