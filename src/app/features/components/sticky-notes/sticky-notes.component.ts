import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ResizableModule } from 'angular-resizable-element';
import { BringToFrontDirective } from '../../../core/directives/bring-to-front.directive';
import { ScreenSizeDirective } from '../../../core/directives/screen-size-directive.directive';
import { Subject } from 'rxjs';
import { ScreenSize } from '../../../core/services/breakpoint-service.service';
import { AppInstance } from '../../../core/models/app-instance.model';
import { AppActionsService } from '../../../core/services/app-actions-service.service';
import { DragResizeService } from '../../../core/services/resize-service.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FormsModule } from '@angular/forms';

interface StickyNotes {
  id: number;
  content: string;
  position: { left: number; top: number };
}

@Component({
  selector: 'app-sticky-notes',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    ResizableModule,
    ScreenSizeDirective,
    BringToFrontDirective,
    FormsModule
  ],
  templateUrl: './sticky-notes.component.html',
  styleUrl: './sticky-notes.component.css'
})
export class StickyNotesComponent implements OnInit {
  @ViewChild('stickyNote') noteInput!: ElementRef<HTMLTextAreaElement>;

  private destroy$ = new Subject<void>();

  ScreenSize = ScreenSize;

  @Input() appInstance!: AppInstance;

  get style(): { [key: string]: string } {
    return {
      left: this.appInstance.position.left,
      top: this.appInstance.position.top,
      // width: this.appInstance.size.width,
      // height: this.appInstance.size.height,
      transform: this.appInstance.transform,
      zIndex: this.appInstance.zIndex,
    };
  }

  @Output() close = new EventEmitter<void>();
  @Output() minimize = new EventEmitter<void>();
  @Output() maximize = new EventEmitter<void>();
  @Output() restoreMaximized = new EventEmitter<void>();

  public appInstances: AppInstance[] = [];
  public notes: StickyNotes[] = [];
  public stickyNoteText: string = 'Hello! this is the site of Meldia...';

  constructor(
    private appService: AppActionsService,
    public resizeService: DragResizeService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.noteInput.nativeElement.focus();
    }, 0);
  }

  // Sticky note controls
  public toggleMinimizeStickyNote() {
    this.minimize.emit();
  }

  public toggleCloseStickyNote() {
    this.close.emit();
  }

}
