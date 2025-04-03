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
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { AppActionsService } from '../../../core/services/app-actions-service.service';
import { AppInstance } from '../../../core/models/app-instance.model';
import { DragResizeService } from '../../../core/services/resize-service.service';
import { Subject, takeUntil } from 'rxjs';
import { transform } from 'typescript';
import { BringToFrontDirective } from '../../../core/directives/bring-to-front.directive';

@Component({
  selector: 'app-notepad',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    ResizableModule,
    ScreenSizeDirective,
    BringToFrontDirective,
  ],
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
      // transform: this.appInstance.transform,
      zIndex: this.appInstance.zIndex,
    };
  }

  @Output() close = new EventEmitter<void>();
  @Output() minimize = new EventEmitter<void>();
  @Output() maximize = new EventEmitter<void>();
  @Output() restoreMaximized = new EventEmitter<void>();

  public appInstances: AppInstance[] = [];

  // public isMaximized: boolean = false;

  constructor(
    private appService: AppActionsService,
    public resizeService: DragResizeService
  ) { }

  ngOnInit(): void {
    this.appService.openedApps$
      .pipe(takeUntil(this.destroy$))
      .subscribe((instances) => {
        this.appInstances = instances;

        // const currentInstance = instances.find(
        //   (app) => app.id === this.appInstance.id
        // );
      });

      const element = document.getElementById('notepad');
      if (element) {
        const rect = element.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const left = rect.left + window.scrollX;
        const bottom = rect.bottom + window.scrollY;
        const right = rect.right + window.scrollX;
      
        console.log('Posición top:', top);
        console.log('Posición left:', left);
        console.log('Posición bottom:', bottom);
        console.log('Posición right:', right);
      }
      

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // onMouseDown(event: MouseEvent): void {
  //   const element = event.target as HTMLElement;
  //   const rect = element.getBoundingClientRect();
  //   // console.log('Posición top:', rect.top);
  //   // console.log('Posición left:', rect.left);
  //   // console.log('Posición bottom:', rect.bottom);
  //   // console.log('Posición right:', rect.right);
  // }
  

  // getPosition(): void {
  //   const element = this.notepadElement.nativeElement; // El elemento HTML
  //   const rect = element.getBoundingClientRect();

  //   console.log('Posición top:', rect.top);
  //   console.log('Posición left:', rect.left);
  //   console.log('Posición bottom:', rect.bottom);
  //   console.log('Posición right:', rect.right);
  // }

  // onDragEnd(event: CdkDragEnd, appName: string) {
  //   const position = event.source.getFreeDragPosition();
  //   console.log('Posición actual:', position);

  //   const appInstance = this.appInstances.find(app => app.name === appName);

  //   // if (appInstance) {
  //   //   this.appInstance.position = {
  //   //     left: `${position.x}px`,
  //   //     top: `${position.y}px`,
  //   //   };
  //   //   // this.appService.updateState(appInstance.id, { position: { left: `${position.x}px`, top: `${position.y}px` } });
  //   // }
  // }

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
}
