import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppInstance } from '../models/app-instance.model';
import { BreakpointService, ScreenSize } from './breakpoint-service.service';

@Injectable({
  providedIn: 'root',
})
export class AppActionsService {
  private openedAppsSubject = new BehaviorSubject<AppInstance[]>([]);
  public openedApps$ = this.openedAppsSubject.asObservable();

  constructor(private breakpointService: BreakpointService) {}

  public openAction(name: string): void {
    const currentApps = this.openedAppsSubject.getValue();
    const appInstances = currentApps.filter((app) => app.name === name);

    const screenSize = this.breakpointService.currentScreenSize;

    const defaultConfig = this.getDefaultConfig(screenSize);

    if (appInstances.length < 1) {
      const appInstance: AppInstance = {
        id: Date.now(),
        name: name,
        position: defaultConfig.position,
        size: defaultConfig.size,
        isMinimized: false,
        isMaximized: false,
      };

      this.openedAppsSubject.next([...currentApps, appInstance]);
    }
  }

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
    this.updateState(appId, {
      isMaximized: true,
      position: { left: '0', top: '0' },
      size: { width: '100vw', height: '100vh' },
      transform: 'translate3d(0px, 30px, 0px)',
    });
  }

  public restoreMaximizedAction(appId: number): void {
    const screenSize = this.breakpointService.currentScreenSize;

    const defaultConfig = this.getDefaultConfig(screenSize);

    this.updateState(appId, {
      isMaximized: false,
      position: defaultConfig.position,
      size: defaultConfig.size,
      transform: 'translate3d(0px, 0px, 0px)',
    });
  }

  public updateState(appId: number, updates: Partial<AppInstance>): void {
    const currentApps = this.openedAppsSubject.getValue();
    const updatedApps = currentApps.map((app) => {
      if (app.id === appId) {
        return { ...app, ...updates };
      }
      return app;
    });
    this.openedAppsSubject.next(updatedApps);
  }

  private getDefaultConfig(screenSize: ScreenSize): {
    position: { left: string; top: string };
    size: { width: string; height: string };
  } {
    switch (screenSize) {
      case ScreenSize.XSmall:
        return {
          position: { left: '10px', top: '50px' },
          size: { width: '95%', height: '80%' },
        };
      case ScreenSize.Small:
        return {
          position: { left: '20px', top: '50px' },
          size: { width: '80%', height: '70%' },
        };
      case ScreenSize.Medium:
        return {
          position: { left: '50px', top: '50px' },
          size: { width: '70%', height: '60%' },
        };
      case ScreenSize.Large:
      case ScreenSize.XLarge:
      default:
        return {
          position: { left: '100px', top: '100px' },
          size: { width: '60%', height: '50%' },
        };
    }
  }
}
