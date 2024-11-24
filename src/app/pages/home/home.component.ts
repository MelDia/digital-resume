import { Component } from '@angular/core';
import { TaskbarComponent } from '../../features/components/taskbar/taskbar.component';
import { NotepadComponent } from '../../features/components/notepad/notepad.component';
import { ScreenSize } from '../../core/services/breakpoint-service.service';
import { ScreenSizeDirective } from '../../core/directives/screen-size-directive.directive';
import { AppActionsService } from '../../core/services/app-actions-service.service';
import { CommonModule } from '@angular/common';
import { AppInstance } from '../../core/models/app-instance.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TaskbarComponent,
    NotepadComponent,
    ScreenSizeDirective,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  ScreenSize = ScreenSize;

  // public notepadInstances: AppInstance[] = [];

  // private notepadId: number = 0;
  // private maxAppsOpened: number = 1;
  // public openNotepads: number[] = [];

  public appInstances: AppInstance[] = [];

  public isOpen: boolean = false;

  constructor(private appService: AppActionsService) {}

  ngOnInit(): void {
    this.appService.openedApps$.subscribe((instances) => {
      this.appInstances = instances;
      console.log('appInstances: ', this.appInstances);
    });
  }

  public open(name: string): void {
    console.log('App ', name, ' opened');
    this.appService.openAction(name);
  }

  // public openNotepad(): void {
  //   if (this.notepadInstances.length < this.maxAppsOpened) {
  //     const newPosition = this.getNewPosition();

  //     const notepadInstance: AppInstance = {
  //       id: this.notepadId,
  //       name: 'notepad',
  //       position: newPosition,
  //       isMinimized: false,
  //       isMaximized: false,
  //     };

  //     this.notepadInstances.push(notepadInstance);

  //     this.appService.openApp(notepadInstance);
  //     // this.notepadId++;
  //   }
  // }

  public close(id: number): void {
    console.log('App with the id ', id, ' closed');
    // this.notepadInstances = this.notepadInstances.filter(
    //   (instance) => instance.id !== id
    // );
    this.appService.closeAction(id);
  }

  public minimize(id: number): void {
    // const appInstance = this.notepadInstances.find(
    //   (instance) => instance.id === id
    // );

    // if (appInstance) {
    //   appInstance.isMinimized = true;
    // this.appService.updateApp(appInstance);
    console.log('minimize: ', id);
    this.appService.minimizeAction(id);
    // }
  }

  public maximize(id: number): void {
    console.log('maximize: ', id);
    // const appInstance = this.notepadInstances.find(
    //   (instance) => instance.id === id
    // );

    // if (appInstance) {
    //   appInstance.isMaximized = true;
    //   this.appService.updateApp(appInstance);
    // }

    this.appService.maximizeAction(id);
  }

  public restoreMaximized(id: number): void {
    console.log('restore: ', id);
    // const appInstance = this.notepadInstances.find(
    //   (instance) => instance.id === id
    // );

    // if (appInstance) {
    //   appInstance.isMaximized = false;
    //   this.appService.updateApp(appInstance);
    // }

    this.appService.restoreMaximizedAction(id);
  }

  // private getNewPosition(): { left: string; top: string } {
  //   const offset = 30 * this.notepadInstances.length;

  //   return {
  //     left: `${100 + offset}px`,
  //     top: `${100 + offset}px`,
  //   };
  // }
}
