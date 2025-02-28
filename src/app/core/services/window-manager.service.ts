import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindowManagerService {
  private zIndex = 1000;
  private components: Map<string, number> = new Map<string, number>();

  constructor() {}

  public getNextZIndex(): number {
    return ++this.zIndex;
  }

  public bringToFront(id: string): number {
    const newZIndex = this.getNextZIndex();
    this.components.set(id, newZIndex);
    return newZIndex;
  }

  public getZIndex(id: string): number {
    return this.components.get(id) || 1000;
  }

  public updateZIndex(appName: string, zIndex: number): void {
    const appElement = document.querySelector(
      `[data-app-id="${appName}"]`
    ) as HTMLElement;
    if (appElement) {
      appElement.style.zIndex = zIndex.toString();
    }
  }
}
