import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ScreenSize } from '../../../core/services/breakpoint-service.service';
import { AppInstance } from '../../../core/models/app-instance.model';
import { AppActionsService } from '../../../core/services/app-actions-service.service';
import { DragResizeService } from '../../../core/services/resize-service.service';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BringToFrontDirective } from '../../../core/directives/bring-to-front.directive';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule, DragDropModule, BringToFrontDirective],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss',
})
export class MusicPlayerComponent implements OnInit {
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
    };
  }

  @Output() close = new EventEmitter<void>();
  @Output() minimize = new EventEmitter<void>();
  @ViewChild('artistInfoElement') artistInfoElement!: ElementRef;
  @ViewChild('songInfoElement') songInfoElement!: ElementRef;

  public appInstances: AppInstance[] = [];
  public artistInfo: string = 'Lisa Stansfield';
  public songInfo: string = 'Never Gonna Give You Up Richie Sambora';
  public durationInfo: string = '03:00:00';
  public progressValue: number = 0;

  public isArtistOverflowing: boolean = false;
  public isSongOverflowing: boolean = false;
  public isPlaying: boolean = false;

  constructor(
    private appService: AppActionsService,
    public resizeService: DragResizeService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.appService.openedApps$
      .pipe(takeUntil(this.destroy$))
      .subscribe((instances) => {
        this.appInstances = instances;
      });
  }

  ngAfterViewInit(): void {
    this.checkTextOverflow();
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Music player controls
  public toggleMinimizeMusic() {
    this.minimize.emit();
  }

  public toggleCloseMusic() {
    this.close.emit();
  }

  public checkTextOverflow(): void {
    if (
      this.artistInfoElement.nativeElement.scrollWidth >
      this.artistInfoElement.nativeElement.clientWidth
    ) {
      this.isArtistOverflowing = true;
    }

    if (
      this.songInfoElement.nativeElement.scrollWidth >
      this.songInfoElement.nativeElement.clientWidth
    ) {
      this.isSongOverflowing = true;
    }
  }

  public onProgressChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.progressValue = Number(input.value);
    const percentage = `${this.progressValue}%`;
    input.style.background = `linear-gradient(to right, var(--color-dark-gray, #4a4a4a) ${percentage}, var(--color-very-light-gray, #ddd) ${percentage})`;
  }
}
