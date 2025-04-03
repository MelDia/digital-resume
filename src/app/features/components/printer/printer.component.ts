import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ScreenSize } from '../../../core/services/breakpoint-service.service';
import { AppInstance } from '../../../core/models/app-instance.model';
import { AppActionsService } from '../../../core/services/app-actions-service.service';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScreenSizeDirective } from '../../../core/directives/screen-size-directive.directive';
import { BringToFrontDirective } from '../../../core/directives/bring-to-front.directive';

@Component({
  selector: 'app-printer',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    ScreenSizeDirective,
    BringToFrontDirective,
  ],
  templateUrl: './printer.component.html',
  styleUrl: './printer.component.scss',
})
export class PrinterComponent implements OnInit, OnDestroy {
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

  public appInstances: AppInstance[] = [];

  public isPrinting: boolean = false;
  public isDownloading: boolean = false;
  public isDownloadComplete: boolean = false;

  constructor(private appService: AppActionsService) {}

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

  startDownload() {
    this.isPrinting = true;

    setTimeout(() => {
      this.downloadCV();
    }, 2000);
  }

  downloadCV() {
    const link = document.createElement('a');
    link.href = 'assets/docs/cv.pdf'; // Ruta de tu CV
    link.download = 'Melina Diaz - Curriculum Vitae.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.isPrinting = false;
    this.isDownloadComplete = true;

    setTimeout(() => {
      this.isDownloadComplete = false;
    }, 3000);
  }

  public toggleMinimizePrinter() {
    this.minimize.emit();
  }

  public toggleClosePrinter() {
    this.close.emit();
  }
}
