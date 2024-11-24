import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreakpointService, ScreenSize } from '../services/breakpoint-service.service';

@Directive({
  selector: '[appShowOnScreenSize]',
  standalone: true,
})
export class ScreenSizeDirective implements OnInit {
  private subscription!: Subscription;
  private screenSize!: ScreenSize;

  @Input() appShowOnScreenSize!: ScreenSize | ScreenSize[]; 

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private breakpointService: BreakpointService
  ) {}

  ngOnInit() {
    this.subscription = this.breakpointService.screenSize$.subscribe(size => {
      this.screenSize = size;
      this.updateView();
    });
  }

  private updateView(): void {
    this.viewContainer.clear();

    const sizes = Array.isArray(this.appShowOnScreenSize) ? this.appShowOnScreenSize : [this.appShowOnScreenSize];


    if (sizes.includes(this.screenSize)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
