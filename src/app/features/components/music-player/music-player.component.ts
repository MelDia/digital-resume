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
import { SpotifyService } from '../../../core/services/spotify.service';

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

  public artistInfo: string = '';
  public songInfo: string = '';
  public durationInfo: string = '';

  public progressValue: number = 0;
  public playlistTracks: any[] = [];
  public currentTrack: any = null;
  public currentTrackIndex: number = 0;

  private playbackInterval: any;

  public isArtistOverflowing: boolean = false;
  public isSongOverflowing: boolean = false;
  public isPlaying: boolean = false;

  constructor(
    private appService: AppActionsService,
    public resizeService: DragResizeService,
    private spotifyService: SpotifyService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.appService.openedApps$
      .pipe(takeUntil(this.destroy$))
      .subscribe((instances) => {
        this.appInstances = instances;
      });

    this.loadPlaylist();
  }

  ngAfterViewInit(): void {
    this.checkTextOverflow();
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public loadPlaylist(): void {
    const query = '70s 80s 90s';

    this.spotifyService
      .searchPlaylist(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const playlist = data.playlists.items[0];

        this.spotifyService
          .getPlaylistTracks(playlist.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((tracks) => {
            this.playlistTracks = tracks.items
              .filter((item: any) => item.track)
              .map((item: any) => {
                const track = item.track;

                return {
                  id: track.id,
                  uri: track.uri,
                  href: track.href,
                  name: track.name,
                  artist: track.artists
                    .map((artist: any) => artist.name)
                    .join(', '),
                  album: track.album.name,
                  duration: this.formatDuration(track.duration_ms),
                };
              });
            console.log('Processed Playlist Tracks: ', this.playlistTracks);
          });
      });
  }

  // Methods for music player
  public updateMusicPlayer(): void {
    const track = this.playlistTracks[this.currentTrackIndex];
    this.artistInfo = track.artist;
    this.songInfo = track.name;
    this.durationInfo = track.duration;
    this.progressValue = 0;
  }

  public togglePlayTrack(): void {
    this.isPlaying = true;
    this.simulatePlayback();
  }

  public togglePauseTrack(): void {
    this.isPlaying = false;
    clearInterval(this.playbackInterval);
  }

  public toggleStopTrack(): void {
    this.isPlaying = false;
    clearInterval(this.playbackInterval);
    this.progressValue = 0;
  }

  public toggleNextTrack(): void {
    this.toggleStopTrack();
    this.currentTrackIndex =
      (this.currentTrackIndex + 1) % this.playlistTracks.length;
    this.updateMusicPlayer();
  }

  public togglePreviousTrack(): void {
    this.toggleStopTrack();
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.playlistTracks.length) %
      this.playlistTracks.length;
    this.updateMusicPlayer();
  }

  public simulatePlayback(): void {
    const trackDuration = this.playlistTracks[this.currentTrackIndex].duration;
    const [minutes, seconds] = trackDuration.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;

    this.playbackInterval = setInterval(() => {
      if (this.progressValue < 100) {
        this.progressValue += (100 / totalSeconds) * 1;
      } else {
        this.toggleNextTrack();
      }
    }, 1000);
  }

  public formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
