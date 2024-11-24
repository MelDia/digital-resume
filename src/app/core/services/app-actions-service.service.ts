import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppInstance } from '../models/app-instance.model';

@Injectable({
  providedIn: 'root',
})
export class AppActionsService {
  private openedAppsSubject = new BehaviorSubject<AppInstance[]>([]);
  public openedApps$ = this.openedAppsSubject.asObservable();

  constructor() {}

  // public openApp(appInstance: AppInstance): void {
  //   const currentApps = this.openedAppsSubject.getValue();
  //   this.openedAppsSubject.next([...currentApps, appInstance]);
  // }

  // public updateApp(appInstance: AppInstance): void {
  //   const currentApps = this.openedAppsSubject.value.map((app) =>
  //     app.id === appInstance.id ? appInstance : app
  //   );

  //   this.openedAppsSubject.next(currentApps);
  // }

  /**
   * Opens an application by name if it is not already opened.
   *
   * This method checks the currently opened applications to see if any
   * match the provided name. If no instances are found, it creates a new
   * `AppInstance` with a unique ID, default position, and default state
   * (not minimized or maximized) and adds it to the list of opened applications.
   *
   * @param name - The name of the application to open.
   */
  public openAction(name: string): void {
    const currentApps = this.openedAppsSubject.getValue();
    const appInstances = currentApps.filter((app) => app.name === name);

    if (appInstances.length < 1) {
      const appInstance: AppInstance = {
        id: Date.now(),
        name: name,
        // position: { left: '100px', top: '100px' },
        position: this.getPosition(appInstances.length),
        size: { width: '400px', height: '600px' },
        isMinimized: false,
        isMaximized: false,
      };

      this.openedAppsSubject.next([...currentApps, appInstance]);
    }
  }

  /**
   * Closes an application with the given ID.
   *
   * This method takes an application ID as an argument and removes the
   * corresponding application from the list of opened applications.
   *
   * @param appId - The ID of the application to close.
   */
  public closeAction(appId: any): void {
    const currentApps = this.openedAppsSubject.getValue();
    const filteredApps = currentApps.filter((app) => app.id !== appId);
    this.openedAppsSubject.next(filteredApps);
  }

  public minimizeAction(appId: number): void {
    this.updateState(appId, { isMinimized: true });
  }

  public restoreMinimizedAction(appId: number): void {
    this.updateState(appId, { isMinimized: false });
  }

  public maximizeAction(appId: number): void {
    this.updateState(appId, { isMaximized: true });
  }

  public restoreMaximizedAction(appId: number): void {
    this.updateState(appId, { isMaximized: false });
  }

  /**
   * Updates an application with the given ID by applying the given updates to
   * its state.
   *
   * @param appId - The ID of the application to update.
   * @param updates - A partial application state with the properties to
   *                  update.
   */
  public updateState(appId: number, updates: Partial<AppInstance>): void {
    const currentApps = this.openedAppsSubject.getValue();
    const updatedApps = currentApps.map((app) => {
      if (app.id === appId) {
        return { ...app, ...updates };
      }
      return app;
    });
    console.log('updated apps: ', updatedApps);
    this.openedAppsSubject.next(updatedApps);
  }

  // public updateSizeAndPosition(
  //   appId: number,
  //   newSize: { width: number; height: number },
  //   newPosition: { left: number; top: number }
  // ): void {
  //   const currentApps = this.openedAppsSubject.getValue();
  //   const appInstance = currentApps.find((app) => app.id === appId);

  //   if (appInstance) {
  //     this.updateState(appId, {
  //       size: { width: newSize.width, height: newSize.height },
  //       position: { left: newPosition.left, top: newPosition.top },
  //     });
  //   }
  // }

  private getPosition(offsetMultiplier: number): { left: string; top: string } {
    const offset = 30 * offsetMultiplier;

    return {
      left: `${100 + offset}px`,
      top: `${100 + offset}px`,
    };
  }
}
