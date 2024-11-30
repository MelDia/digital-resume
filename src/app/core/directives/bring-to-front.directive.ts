import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { WindowManagerService } from '../services/window-manager.service';

@Directive({
  selector: '[appBringToFront]',
  standalone: true,
})
export class BringToFrontDirective {
  @Input() componentId!: string;

  constructor(
    private elementRef: ElementRef,
    private windowManagerService: WindowManagerService
  ) {}

  @HostListener('mousedown') onMousedown() {
    if (this.componentId) {
      const zIndex = this.windowManagerService.bringToFront(this.componentId);
      this.elementRef.nativeElement.style.zIndex = zIndex;
    }
  }
}
