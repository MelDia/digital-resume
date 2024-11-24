import {
  Directive,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';

@Directive({
  selector: '[appResize]',
  standalone: true,
})
export class ResizeDirective {
  @Output() resizeEnd = new EventEmitter<ResizeEvent>();
  @Output() validateResize = new EventEmitter<ResizeEvent>();

  @HostListener('resizeEnd', ['$event'])
  onResizeEnd(event: ResizeEvent): void {
    this.resizeEnd.emit(event);
  }

  @HostListener('validateResize', ['$event'])
  validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX: number = 50;
    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < MIN_DIMENSIONS_PX ||
        event.rectangle.height < MIN_DIMENSIONS_PX)
    ) {
      return false;
    }
    this.validateResize.emit(event);
    return true;
  }
}
