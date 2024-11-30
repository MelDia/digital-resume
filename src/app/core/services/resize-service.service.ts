import { Injectable } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { BehaviorSubject } from 'rxjs';

interface ResizeState {
  id: number; // ID del componente redimensionado
  size: { width: number; height: number };
  position: { left: number; top: number };
}

@Injectable({
  providedIn: 'root',
})
export class DragResizeService {
  private resizeStateSubject = new BehaviorSubject<ResizeState[]>([]);
  public resizeState$ = this.resizeStateSubject.asObservable();

  private readonly MIN_DIMENSIONS_PX = 50;
  public MIN_WIDTH_PX: number = 200;
  public MIN_HEIGHT_PX: number = 200;

  public validate(event: ResizeEvent): boolean {
    const MIN_HEIGHT_PX = 300;
    const MIN_WIDTH_PX = 300;

    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < MIN_WIDTH_PX ||
        event.rectangle.height < MIN_HEIGHT_PX)
    ) {
      return false;
    }
    return true;
  }

  public onResizeEnd(event: ResizeEvent): { [key: string]: string } {
    return {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
      overflow: 'hidden',
    };
  }

  // public validate(event: ResizeEvent): boolean {
  //   if (!event.rectangle) {
  //     console.error('Resize event has no rectangle property');
  //     return false;
  //   }

  //   if (!event.rectangle.width || !event.rectangle.height) {
  //     console.error('Resize event has no valid width or height');
  //     return false;
  //   }

  // const minWidth = this.MIN_WIDTH_PX;
  // const minHeight = this.MIN_HEIGHT_PX;

  //   if (
  //     event.rectangle.width < minWidth ||
  //     event.rectangle.height < minHeight
  //   ) {
  //     console.log('Validation Result: false');
  //     return false;
  //   }

  //   console.log('Validation Result: true');
  //   return true;
  // }
}
