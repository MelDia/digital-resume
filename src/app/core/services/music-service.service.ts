import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private tracks: Track[] = [
    {
      id: '1',
      title: 'Another Cha-Cha Another Cha-Cha Another Cha-Cha Another Cha-Cha',
      artist: 'Unknown',
      duration: '5:00',
      url: 'https://archive.org/download/MUSICADISCO/ANOTHER%20CHACHA.mp3',
    },
    {
      id: '2',
      title: "Babe We're Gonna Love Tonight Tonight Tonight",
      artist: 'Unknown',
      duration: '6:53',
      url: 'https://archive.org/download/MUSICADISCO/BABE%20WE%20RE%20GONNA%20LOVE%20TONIGHT.mp3',
    },
    {
      id: '3',
      title: 'Born to Be Alive',
      artist: 'Unknown',
      duration: '5:55',
      url: 'https://archive.org/download/MUSICADISCO/BORN%20TO%20BE%20ALIVE.mp3',
    },
  ];

  constructor() {}

  public getTracks(): Observable<Track[]> {
    return of(this.tracks);
  }
}
