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
import { interval, Subscription } from 'rxjs';
import { CalendarComponent } from '../calendar/calendar.component';
import { AppActionsService } from '../../../core/services/app-actions-service.service';

@Component({
  selector: 'app-taskbar',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
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

  // @Output() bringToFrontEvent = new EventEmitter<{
  //   appName: string;
  //   instanceId: number;
  // }>();

  ScreenSize = ScreenSize;

  public timer: string = '';

  public isOpen: boolean = false;
  public openedApps: any[] = [];
  // public groupedOpenedApps: {
  //   name: string;
  //   count: number;
  //   instances: any[];
  // }[] = [];
  // public dropdownOpen: { [key: string]: boolean } = {};

  private clockSubscription: Subscription = new Subscription();

  constructor(
    private eRef: ElementRef,
    private appService: AppActionsService
  ) {}

  ngOnInit(): void {
    this.clockSubscription = interval(1000).subscribe(() => {
      this.updateClock();
    });

    this.appService.openedApps$.subscribe((apps) => {
      this.openedApps = apps;
      // console.log('opened apps in taskbar:', this.openedApps);
      // this.groupApps();
    });
  }

  ngOnDestroy(): void {
    this.clockSubscription.unsubscribe();
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
      default:
        return 'icon-default';
    }
  }

  public toggleMinimizedApp(appId: any) {
    // const appInstance = this.openedApps.find((app) => app.id === appId);

    // if (appInstance) {
    //   appInstance.isMinimized = false;
    //   this.appService.updateApp(appInstance);
    // }

    this.appService.restoreMinimizedAction(appId);
  }

  // private groupApps(): void {
  //   const grouped = this.openedApps.reduce((acc, app) => {
  //     const existing = acc.find(
  //       (item: { name: any }) => item.name === app.name
  //     );

  //     if (existing) {
  //       existing.count++;
  //       existing.instances.push(app);
  //     } else {
  //       acc.push({ name: app.name, count: 1, instances: [app] });
  //     }

  //     return acc;
  //   }, [] as { name: string; count: number; instances: any[] }[]);

  //   this.groupedOpenedApps = grouped;
  // }

  // public toggleDropdown(appName: string): void {
  //   this.dropdownOpen[appName] = !this.dropdownOpen[appName];
  // }
}
