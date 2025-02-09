import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
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
import {
  MusicService,
  Track,
} from '../../../core/services/music-service.service';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule, DragDropModule, BringToFrontDirective],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss',
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
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
  @ViewChild('marqueeContainer') marqueeContainer!: ElementRef;

  public appInstances: AppInstance[] = [];

  public artistInfo: string = '';
  public songInfo: string = '';
  public durationInfo: string = '0:00';
  public elapsedTime: string = '0:00';

  public playlistTracks: Track[] = [];
  public currentTrack: any = null;
  public currentTrackIndex: number = 0;
  public progressValue: number = 0;

  private playbackInterval: any;

  public isArtistOverflowing: boolean = false;
  public isSongOverflowing: boolean = false;
  public isPlaying: boolean = false;

  public audio = new Audio();

  constructor(
    private appService: AppActionsService,
    public resizeService: DragResizeService,
    private musicService: MusicService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.progressValue = 0;
    // this.updateProgressBar();

    this.appService.openedApps$
      .pipe(takeUntil(this.destroy$))
      .subscribe((instances) => {
        this.appInstances = instances;
      });
    this.loadPlaylist();
    this.simulateDuration();
  }

  ngAfterViewInit(): void {
    this.checkTextOverflow();
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    clearInterval(this.playbackInterval);
    this.audio.pause();
    this.audio.src = '';
  }

  public loadPlaylist(): void {
    this.musicService
      .getTracks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tracks: any) => {
        this.playlistTracks = tracks;

        if (this.playlistTracks.length > 0) {
          this.updateMusicPlayer();
        }
      });
  }

  // Methods for music player
  public updateMusicPlayer(): void {
    if (this.playlistTracks.length === 0) {
      return;
    }

    const track = this.playlistTracks[this.currentTrackIndex];
    this.artistInfo = track.artist;
    this.songInfo = track.title;
    this.durationInfo = track.duration;

    this.audio.src = track.url;
    this.audio.load();
    this.progressValue = 0;
    this.elapsedTime = '0:00';

    if (this.isPlaying) {
      this.audio.play();
    }
  }

  public togglePlayTrack(): void {
    if (!this.isPlaying) {
      this.audio.play();
      this.isPlaying = true;
      this.trackProgress();
    }
  }

  public togglePauseTrack(): void {
    this.audio.pause();
    this.isPlaying = false;
    clearInterval(this.playbackInterval);
  }

  public toggleStopTrack(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
    this.progressValue = 0;
    this.elapsedTime = '0:00';
    clearInterval(this.playbackInterval);
  }

  public toggleNextTrack(): void {
    this.toggleStopTrack();
    this.currentTrackIndex =
      (this.currentTrackIndex + 1) % this.playlistTracks.length;
    this.updateMusicPlayer();
    this.togglePlayTrack();
  }

  public togglePreviousTrack(): void {
    this.toggleStopTrack();
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.playlistTracks.length) %
      this.playlistTracks.length;
    this.updateMusicPlayer();
    this.togglePlayTrack();
  }

  private trackProgress(): void {
    this.playbackInterval = setInterval(() => {
      if (!this.audio.paused) {
        this.progressValue =
          (this.audio.currentTime / this.audio.duration) * 100;
      }
      if (this.audio.ended) {
        this.toggleNextTrack();
      }
    }, 1000);
  }

  public simulateDuration(): void {
    this.audio.addEventListener('loadedmetadata', () => {
      this.durationInfo = this.formatDuration(this.audio.duration);
    });

    this.audio.addEventListener('timeupdate', () => {
      this.elapsedTime = this.formatDuration(this.audio.currentTime);
      this.progressValue = (this.audio.currentTime / this.audio.duration) * 100;
    });

    this.audio.addEventListener('ended', () => {
      this.toggleNextTrack();
    });
  }

  public formatDuration(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // private updateProgressBar(): void {
  //   console.log('updateProgressBar() called');
  //   const progressBar = document.querySelector(
  //     '.progress-bar'
  //   ) as HTMLInputElement;
  //   if (progressBar) {
  //     console.log('progressBar:', progressBar);
  //     const percentage = `${this.progressValue}%`;
  //     console.log('percentage:', percentage);
  //     progressBar.style.background = `linear-gradient(to right, var(--color-dark-gray, #4a4a4a) ${percentage}, var(--color-very-light-gray, #ddd) ${percentage})`;
  //     console.log(
  //       'progressBar.style.background:',
  //       progressBar.style.background
  //     );
  //   } else {
  //     console.log('progressBar not found');
  //   }
  // }

  // public onProgressChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   this.progressValue = Number(input.value);
  //   this.updateProgressBar();
  // }

  // Music player controls
  public toggleMinimizeMusic() {
    this.minimize.emit();
  }

  public toggleCloseMusic() {
    this.close.emit();
  }

  public checkTextOverflow(): void {
    // console.log(
    //   'songInfoElement:',
    //   this.songInfoElement.nativeElement.scrollWidth,
    //   this.songInfoElement.nativeElement.clientWidth
    // );
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
}
