import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ScreenSize {
  XSmall = 'xs',
  Small = 'sm',
  Medium = 'md',
  Large = 'lg',
  XLarge = 'xl',
  Unknown = 'unknown',
}

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private screenSize = new BehaviorSubject<ScreenSize>(ScreenSize.Unknown);

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((state: BreakpointState) => {
        if (state.breakpoints[Breakpoints.XSmall]) {
          this.screenSize.next(ScreenSize.XSmall);
        } else if (state.breakpoints[Breakpoints.Small]) {
          this.screenSize.next(ScreenSize.Small);
        } else if (state.breakpoints[Breakpoints.Medium]) {
          this.screenSize.next(ScreenSize.Medium);
        } else if (state.breakpoints[Breakpoints.Large]) {
          this.screenSize.next(ScreenSize.Large);
        } else if (state.breakpoints[Breakpoints.XLarge]) {
          this.screenSize.next(ScreenSize.XLarge);
        } else {
          this.screenSize.next(ScreenSize.Unknown);
        }
      });
  }

  get screenSize$(): Observable<ScreenSize> {
    return this.screenSize.asObservable();
  }

  get currentScreenSize(): ScreenSize {
    return this.screenSize.getValue();
  }
}
