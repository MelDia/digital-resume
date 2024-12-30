import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { ScreenSizeDirective } from '../../../core/directives/screen-size-directive.directive';
import { ScreenSize } from '../../../core/services/breakpoint-service.service';
import { interval, Subject, Subscription, takeUntil } from 'rxjs';
import { CalendarComponent } from '../calendar/calendar.component';
import { AppActionsService } from '../../../core/services/app-actions-service.service';
import { BringToFrontDirective } from '../../../core/directives/bring-to-front.directive';
import { WindowManagerService } from '../../../core/services/window-manager.service';

@Component({
  selector: 'app-taskbar',
  standalone: true,
  imports: [CommonModule, CalendarComponent, BringToFrontDirective],
  templateUrl: './taskbar.component.html',
  styleUrl: './taskbar.component.scss',
})
export class TaskbarComponent implements OnInit {
  @HostListener('document:click', ['$event'])
  closeCalendar(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  private destroy$ = new Subject<void>();

  ScreenSize = ScreenSize;

  public timer: string = '';

  public isOpen: boolean = false;

  public openedApps: any[] = [];

  private clockSubscription: Subscription = new Subscription();

  constructor(
    private eRef: ElementRef,
    private appService: AppActionsService,
    private windowManagerService: WindowManagerService
  ) {}

  ngOnInit(): void {
    this.clockSubscription = interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateClock();
      });

    this.appService.openedApps$
      .pipe(takeUntil(this.destroy$))
      .subscribe((apps) => {
        this.openedApps = apps;
      });
  }

  ngOnDestroy(): void {
    this.clockSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateClock(): void {
    try {
      const date = new Date();
      if (!date) {
        throw new Error('updateClock(): date is null');
      }

      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours ? hours : 12;

      this.timer = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')} ${ampm}`;
    } catch (error) {
      console.error('updateClock():', error);
    }
  }

  public toggleCalendar(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  public getIconClass(app: string): string {
    switch (app) {
      case 'notepad':
        return 'icon-files-notes';
      case 'folder':
        return 'icon-folder';
      case 'printer':
        return 'icon-printer';
      case 'email':
        return 'icon-email';
      case 'calculator':
        return 'icon-calculator';
      case 'cmd-terminal':
        return 'icon-cmd';
      default:
        return 'icon-default';
    }
  }

  public toggleMinimizedApp(app: any) {
    this.appService.restoreMinimizedAction(app.id);

    const zIndex = this.windowManagerService.bringToFront(app.name);
    const appElement = document.querySelector(
      `[data-app-id="${app.name}"]`
    ) as HTMLElement;
    if (appElement) {
      appElement.style.zIndex = zIndex.toString();
    }
  }
}
