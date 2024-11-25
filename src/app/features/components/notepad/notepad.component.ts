import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ScreenSizeDirective } from '../../../core/directives/screen-size-directive.directive';
import { CommonModule } from '@angular/common';
import { ScreenSize } from '../../../core/services/breakpoint-service.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { AppActionsService } from '../../../core/services/app-actions-service.service';
import { AppInstance } from '../../../core/models/app-instance.model';
import { DragResizeService } from '../../../core/services/resize-service.service';
import { Subject, takeUntil } from 'rxjs';
import { transform } from 'typescript';

@Component({
  selector: 'app-notepad',
  standalone: true,
  imports: [CommonModule, DragDropModule, ResizableModule, ScreenSizeDirective],
  templateUrl: './notepad.component.html',
  styleUrl: './notepad.component.scss',
})
export class NotepadComponent implements OnInit {
  private destroy$ = new Subject<void>();

  ScreenSize = ScreenSize;

  // @Input() style: object = {};
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

  public isMaximized: boolean = false;

  constructor(
    private appService: AppActionsService,
    public resizeService: DragResizeService
  ) {}

  ngOnInit(): void {
    console.log('NOTEPAD COMPONENT INITIALIZED');
    console.log(' appInstance:', this.appInstance);
    console.log(' style: ', this.style);

    this.appService.openedApps$
      .pipe(takeUntil(this.destroy$))
      .subscribe((instances) => {
        this.appInstances = instances;

        // const currentInstance = instances.find(
        //   (app) => app.id === this.appInstance.id
        // );

        // if (currentInstance) {
        //   this.isMaximized = currentInstance.isMaximized || false;
        //   // this.updateStyle();
        // }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onResizeEnd(event: ResizeEvent): void {
    console.log('Element was resized', event);
    // this.style = this.resizeService.onResizeEnd(event);
    this.appInstance.position = {
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
    };
    this.appInstance.size = {
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
    };
    console.log('Updated style after resize:', this.appInstance);
  }

  public toggleMinimizeNotepad() {
    this.minimize.emit();
  }

  public toggleMaximizeNotepad() {
    this.maximize.emit();
  }

  public toggleRestoreMaximizeNotepad() {
    this.restoreMaximized.emit();
  }

  public toggleCloseNotepad() {
    this.close.emit();
  }

  // public updateStyle() {
  //   if (this.isMaximized) {
  //     console.log('maximized');
  //     // this.appInstance.position = { left: '0', top: '0' };
  //     // this.appInstance.size = { width: '100vw', height: '100vh' };
  //     // this.appInstance.transform = 'translate3d(0px, 30px, 0px)';

  //     const updates = {
  //       position: { left: '0', top: '0' },
  //       size: { width: '100vw', height: '100vh' },
  //       transform: 'translate3d(0px, 30px, 0px)',
  //     };
  //     this.appService.updateState(this.appInstance.id, updates);
  //     console.log('this.appInstance ', this.appInstance);

  //     // this.style = {
  //     //   left: '0',
  //     //   top: '0',
  //     //   width: '100vw',
  //     //   height: '100vh',
  //     //   transform: 'translate3d(0px, 30px, 0px)',
  //     // };
  //   }
  //   // else {
  //   //   this.style = {
  //   //     left: this.appInstance.position.left,
  //   //     top: this.appInstance.position.top,
  //   //     width: this.appInstance.size.width,
  //   //     height: this.appInstance.size.height,
  //   //   };
  //   //   console.log('not maximized');
  //   //   console.log('style: ', this.style);
  //   // }
  // }
}
