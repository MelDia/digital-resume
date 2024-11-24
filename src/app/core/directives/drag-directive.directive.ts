import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDrag]',
  standalone: true,
})
export class DragDirective {
  @Output() dragEnd = new EventEmitter<{ left: number; top: number }>();

  @HostListener('cdkDragEnd', ['$event'])
  onDragEnd(event: any): void {
    const { x, y } = event.source.getFreeDragPosition();
    this.dragEnd.emit({ left: x, top: y });
  }
}
