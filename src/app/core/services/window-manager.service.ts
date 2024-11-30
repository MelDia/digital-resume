import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindowManagerService {
  private zIndex = 1000;
  private components: Map<string, number> = new Map<string, number>();

  constructor() {}

  getNextZIndex(): number {
    return ++this.zIndex;
  }

  bringToFront(id: string): number {
    const newZIndex = this.getNextZIndex();
    this.components.set(id, newZIndex);
    return newZIndex;
  }

  getZIndex(id: string): number {
    return this.components.get(id) || 1000;
  }
}
