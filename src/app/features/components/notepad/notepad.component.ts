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

@Component({
  selector: 'app-notepad',
  standalone: true,
  imports: [CommonModule, DragDropModule, ResizableModule],
  templateUrl: './notepad.component.html',
  styleUrl: './notepad.component.scss',
})
export class NotepadComponent implements OnInit {
  // ScreenSize = ScreenSize;

  @Input() style: object = {};
  @Input() appInstance!: AppInstance;
  // @Input() isMaximized: boolean = false;

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
    console.log('notepad component initialized');

    // this.style = {
    //   left: this.appInstance.position.left,
    //   top: this.appInstance.position.top,
    //   width: `${this.appInstance.size.width}px`,
    //   height: `${this.appInstance.size.height}px`,
    // };

    this.appService.openedApps$.subscribe((instances) => {
      this.appInstances = instances;
      console.log('opened apps:', this.appInstances);

      const currentInstance = instances.find(
        (app) => app.id === this.appInstance.id
      );

      if (currentInstance) {
        this.isMaximized = currentInstance.isMaximized || false;
        this.updateStyle();
        console.log('isMaximized: ', this.isMaximized);
        // this.style = {
        //   left: this.appInstance.isMaximized
        //     ? this.appInstance.position.left
        //     : 0,
        //   top: this.appInstance.isMaximized ? this.appInstance.position.top : 0,
        //   width: this.appInstance.isMaximized
        //     ? this.appInstance.size.width
        //     : '100vw',
        //   height: this.appInstance.isMaximized
        //     ? this.appInstance.size.height
        //     : '100vh',
        //   transform: this.appInstance.isMaximized
        //     ? 'none'
        //     : 'translate3d(0px, 30px, 0px)',
        // };
        // if (this.isMaximized) {
        //   console.log('style: ', this.style);
        // }
      }
    });
  }

  // public validate(event: ResizeEvent): boolean {
  //   // const MIN_DIMENSIONS_PX: number = 50;
  //   // if (
  //   //   event.rectangle.width &&
  //   //   event.rectangle.height &&
  //   //   (event.rectangle.width < MIN_DIMENSIONS_PX ||
  //   //     event.rectangle.height < MIN_DIMENSIONS_PX)
  //   // ) {
  //   //   return false;
  //   // }
  //   // return true;
  //   return this.resizeService.validate(event);
  // }

  public onResizeEnd(event: ResizeEvent): void {
    console.log('Element was resized', event);
    // const newSize = {
    //   width: event.rectangle.width,
    //   height: event.rectangle.height,
    // };
    // const newPosition = {
    //   left: event.rectangle.left,
    //   top: event.rectangle.top,
    // };

    // this.appService.updateState(this.appInstance.id, {
    //   size: { width: newSize.width + 'px', height: newSize.height + 'px' },
    //   position: { left: newPosition.left, top: newPosition.top },
    // });

    this.style = this.resizeService.onResizeEnd(event);
    console.log('Updated style after resize:', this.style);
    // this.style = {
    //   position: 'fixed',
    //   left: `${event.rectangle.left}px`,
    //   top: `${event.rectangle.top}px`,
    //   width: `${event.rectangle.width}px`,
    //   height: `${event.rectangle.height}px`,
    //   overflow: 'hidden',
    // };
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

  public updateStyle() {
    if (this.isMaximized) {
      console.log('maximized');
      this.style = {
        left: '0',
        top: '0',
        width: '100vw',
        height: '100vh',
        transform: 'translate3d(0px, 30px, 0px)',
      };
    } else {
      this.style = {
        left: this.appInstance.position.left,
        top: this.appInstance.position.top,
        width: this.appInstance.size.width,
        height: this.appInstance.size.height,
      };
      console.log('not maximized');
      console.log('style: ', this.style);
    }
  }
}
