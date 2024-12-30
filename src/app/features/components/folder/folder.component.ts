import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { ScreenSizeDirective } from '../../../core/directives/screen-size-directive.directive';
import { ScreenSize } from '../../../core/services/breakpoint-service.service';
import { Subject, takeUntil } from 'rxjs';
import { AppInstance } from '../../../core/models/app-instance.model';
import { AppActionsService } from '../../../core/services/app-actions-service.service';
import { DragResizeService } from '../../../core/services/resize-service.service';
import { BringToFrontDirective } from '../../../core/directives/bring-to-front.directive';
import { CalculatorComponent } from '../calculator/calculator.component';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    ResizableModule,
    ScreenSizeDirective,
    BringToFrontDirective,
  ],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss',
})
export class FolderComponent implements OnInit {
  private destroy$ = new Subject<void>();

  ScreenSize = ScreenSize;

  @Input() appInstance!: AppInstance;

  get style(): { [key: string]: string } {
    return {
      left: this.appInstance.position.left,
      top: this.appInstance.position.top,
      width: this.appInstance.size.width,
      height: this.appInstance.size.height,
      transform: this.appInstance.transform,
    };
  }

  @Output() close = new EventEmitter<void>();
  @Output() minimize = new EventEmitter<void>();
  @Output() maximize = new EventEmitter<void>();
  @Output() restoreMaximized = new EventEmitter<void>();

  public appInstances: AppInstance[] = [];

  constructor(
    private appService: AppActionsService,
    public resizeService: DragResizeService
  ) {}
  ngOnInit(): void {
    this.appService.openedApps$
      .pipe(takeUntil(this.destroy$))
      .subscribe((instances) => {
        this.appInstances = instances;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onResizeEnd(event: ResizeEvent): void {
    this.appInstance.position = {
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
    };
    this.appInstance.size = {
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
    };
  }

  // Folder controls
  public toggleMinimizeFolder() {
    this.minimize.emit();
  }

  public toggleMaximizeFolder() {
    this.maximize.emit();
  }

  public toggleRestoreMaximizeFolder() {
    this.restoreMaximized.emit();
  }

  public toggleCloseFolder() {
    this.close.emit();
  }

  // Calculator Controls
  public openCalculator(name: string): void {
    this.appService.openAction(name);
  }

  // Cmd Controls
  public openCmd(name: string): void {
    this.appService.openAction(name);
  }
}
