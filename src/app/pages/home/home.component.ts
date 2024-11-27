import { Component } from '@angular/core';
import { TaskbarComponent } from '../../features/components/taskbar/taskbar.component';
import { NotepadComponent } from '../../features/components/notepad/notepad.component';
import {
  BreakpointService,
  ScreenSize,
} from '../../core/services/breakpoint-service.service';
import { ScreenSizeDirective } from '../../core/directives/screen-size-directive.directive';
import { AppActionsService } from '../../core/services/app-actions-service.service';
import { CommonModule } from '@angular/common';
import { AppInstance } from '../../core/models/app-instance.model';
import { Subject, takeUntil } from 'rxjs';
import { FolderComponent } from '../../features/components/folder/folder.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TaskbarComponent,
    NotepadComponent,
    FolderComponent,
    ScreenSizeDirective,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private destroy$ = new Subject<void>();

  ScreenSize = ScreenSize;

  public appInstances: AppInstance[] = [];

  constructor(private appService: AppActionsService) {}

  ngOnInit(): void {
    this.appService.openedApps$
      .pipe(takeUntil(this.destroy$))
      .subscribe((instances) => {
        this.appInstances = instances;
        console.log(this.appInstances);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public open(name: string): void {
    console.log(name);
    this.appService.openAction(name);
  }

  public close(id: number): void {
    this.appService.closeAction(id);
  }

  public minimize(id: number): void {
    this.appService.minimizeAction(id);
  }

  public maximize(id: number): void {
    this.appService.maximizeAction(id);
  }

  public restoreMaximized(id: number): void {
    this.appService.restoreMaximizedAction(id);
  }
}
