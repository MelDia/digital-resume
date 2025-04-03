import { Component, ViewChild } from '@angular/core';
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
import { BubbleComponent } from '../../features/components/bubble/bubble.component';
import { CalculatorComponent } from '../../features/components/calculator/calculator.component';
import { CmdTerminalComponent } from '../../features/components/cmd-terminal/cmd-terminal.component';
import { MusicPlayerComponent } from '../../features/components/music-player/music-player.component';
import { PrinterComponent } from '../../features/components/printer/printer.component';
import { StickyNotesComponent } from '../../features/components/sticky-notes/sticky-notes.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TaskbarComponent,
    NotepadComponent,
    FolderComponent,
    CalculatorComponent,
    ScreenSizeDirective,
    CommonModule,
    BubbleComponent,
    CmdTerminalComponent,
    MusicPlayerComponent,
    PrinterComponent,
    StickyNotesComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('trashBubble') trashBubble!: BubbleComponent;
  private destroy$ = new Subject<void>();

  ScreenSize = ScreenSize;

  public appInstances: AppInstance[] = [];
  public isModalOpen: boolean = false;

  constructor(private appService: AppActionsService) {}

  ngOnInit(): void {
    this.appService.openedApps$
      .pipe(takeUntil(this.destroy$))
      .subscribe((instances) => {
        this.appInstances = instances;
      });

      setTimeout(() => {
        this.open('sticky-note');
      }, 7000);
      
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public showTrashBubble(): void {
    this.trashBubble.toggleBubble();
  }

  public toggleModal(event: Event): void {
    event.stopPropagation();
    this.isModalOpen = !this.isModalOpen;
  }

  // App controls
  public open(name: string): void {
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
