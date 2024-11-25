import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
  LayoutModule,
} from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoaderComponent } from './features/components/loader/loader.component';
import { ScreenSizeDirective } from './core/directives/screen-size-directive.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    LayoutModule,
    LoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {}
}
