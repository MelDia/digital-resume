import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private URL = 'https://api.spotify.com/v1/';
  private accessToken =
    'BQDfNpPtrGbfNyAXUppFWABizpPOEFYzsifE73EYDWXzfijGGdLpROQB1qEs5wjeXFL1mWuNYyJS9qwjHCk-JttXbclPa0ioD4R63KCyU-XyCU6dJTo';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
  }

  public searchPlaylist(query: string): Observable<any> {
    const url = `${this.URL}search?q=${query}&type=playlist&limit=10`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  public getPlaylistTracks(playlistId: string): Observable<any> {
    const url = `${this.URL}playlists/${playlistId}/tracks`;
    return this.http.get(url, { headers: this.getHeaders() });
  }
}
