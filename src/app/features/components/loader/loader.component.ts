import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BreakpointService } from '../../../core/services/breakpoint-service.service';
import { ScreenSizeDirective } from '../../../core/directives/screen-size-directive.directive';
import { ScreenSize } from '../../../core/services/breakpoint-service.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, ScreenSizeDirective],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent implements OnInit {

  ScreenSize = ScreenSize;

  public isLoaderVisible: boolean = true;
  public isLoaderClose:  boolean = true;
  public isLoadingContentVisible:  boolean = true;
  public isTextVisible:  boolean = false;

  constructor() { }

  ngOnInit(): void {

    const animationDuration = 5000;

    timer(animationDuration).subscribe(() => {
      this.isLoadingContentVisible = false;
      this.isTextVisible = true;
    });

    timer(animationDuration + 1000).subscribe(() => {
      this.isLoaderClose = false;
    });

    timer(animationDuration + 2000).subscribe(() => {
      this.isLoaderVisible = false;
    });

  }

}
