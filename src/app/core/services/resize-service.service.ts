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

  public validate(event: ResizeEvent): boolean {
    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < this.MIN_DIMENSIONS_PX ||
        event.rectangle.height < this.MIN_DIMENSIONS_PX)
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
}
