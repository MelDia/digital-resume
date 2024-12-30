import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BringToFrontDirective } from '../../../core/directives/bring-to-front.directive';
import { ScreenSizeDirective } from '../../../core/directives/screen-size-directive.directive';
import { ResizableModule, ResizeEvent } from 'angular-resizable-element';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AppActionsService } from '../../../core/services/app-actions-service.service';
import { DragResizeService } from '../../../core/services/resize-service.service';
import { AppInstance } from '../../../core/models/app-instance.model';
import { ScreenSize } from '../../../core/services/breakpoint-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cmd-terminal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    ResizableModule,
    ScreenSizeDirective,
    BringToFrontDirective,
  ],
  templateUrl: './cmd-terminal.component.html',
  styleUrl: './cmd-terminal.component.scss',
})
export class CmdTerminalComponent implements OnInit {
  private destroy$ = new Subject<void>();

  ScreenSize = ScreenSize;

  @Input() appInstance!: AppInstance;

  get style(): { [key: string]: string } {
    return {
      left: this.appInstance.position.left,
      top: this.appInstance.position.top,
      width: this.appInstance.size.width,
      height: this.appInstance.size.height,
      transform: this.appInstance.transform,
    };
  }

  @Output() close = new EventEmitter<void>();
  @Output() minimize = new EventEmitter<void>();
  @Output() maximize = new EventEmitter<void>();
  @Output() restoreMaximized = new EventEmitter<void>();

  public appInstances: AppInstance[] = [];
  public terminalLines: string[] = [];
  public terminalInput: string = '';
  public cursorVisible: boolean = true;

  private commandList: { [key: string]: string[] } = {
    help: [
      'Available commands:',
      '- skills    Show a list of my technical skills',
      '- projects  Display my recent projects',
      '- contact   Get my contact details',
      '- clear     Clear the terminal screen',
    ],
    skills: [
      'Technical Skills:',
      '- HTML, CSS, JavaScript',
      '- Angular, Node.js',
      '- Git, Figma',
    ],
    projects: [
      'Recent Projects:',
      '1. Retro Portfolio - A fully interactive digital CV (current project)',
      '2. Task Manager - A web app to manage daily tasks',
    ],
    contact: [
      'Contact Information:',
      '- Email: diaz.melinajimena@gmail.com',
      '- LinkedIn: linkedin.com/in/melina',
    ],
    clear: [],
  };

  constructor(
    private appService: AppActionsService,
    public resizeService: DragResizeService
  ) {}
  ngOnInit(): void {
    this.appService.openedApps$
      .pipe(takeUntil(this.destroy$))
      .subscribe((instances) => {
        this.appInstances = instances;
      });

    // this.startCursorBlink();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startCursorBlink(): void {
    setInterval(() => {
      this.cursorVisible = !this.cursorVisible;
    }, 500);
  }

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

  // Cmd controls
  public toggleMinimizeCmdTerminal() {
    this.minimize.emit();
  }

  public toggleMaximizeCmdTerminal() {
    this.maximize.emit();
  }

  public toggleRestoreMaximizeCmdTerminal() {
    this.restoreMaximized.emit();
  }

  public toggleCloseCmdTerminal() {
    this.close.emit();
  }

  public executeCommand(): void {
    const command = this.terminalInput.trim();
    this.terminalLines.push(`C:\\Users\\Meldia\\Portfolio> ${command}`);

    // switch (command.toLowerCase()) {
    //   case 'help':
    //     this.terminalLines.push('Available commands:');
    //     this.terminalLines.push(
    //       '- skills    Show a list of my technical skills'
    //     );
    //     this.terminalLines.push('- projects  Display my recent projects');
    //     this.terminalLines.push('- contact   Get my contact details');
    //     this.terminalLines.push('- clear     Clear the terminal screen');
    //     break;
    //   case 'skills':
    //     this.terminalLines.push('Technical Skills:');
    //     this.terminalLines.push('- HTML, CSS, JavaScript');
    //     this.terminalLines.push('- Angular, Node.js');
    //     this.terminalLines.push('- Git, Figma');
    //     break;
    //   case 'projects':
    //     this.terminalLines.push('Recent Projects:');
    //     this.terminalLines.push(
    //       '1. Retro Portfolio - A fully interactive digital CV (current project)'
    //     );
    //     this.terminalLines.push(
    //       '2. Task Manager - A web app to manage daily tasks'
    //     );
    //     break;
    //   case 'contact':
    //     this.terminalLines.push('Contact Information:');
    //     this.terminalLines.push('- Email: melina@example.com');
    //     this.terminalLines.push('- LinkedIn: linkedin.com/in/melina');
    //     break;
    //   case 'clear':
    //     this.terminalLines = [];
    //     break;
    //   default:
    //     this.terminalLines.push(
    //       `'${command}' is not recognized as an internal or external command.`
    //     );
    // }

    if (this.commandList[command]) {
      this.terminalLines.push(...this.commandList[command]);
      if (command === 'clear') {
        this.terminalLines = [];
      }
    } else {
      this.terminalLines.push(
        `'${command}' is not recognized as an internal or external command.`
      );
    }

    this.terminalInput = '';
  }
}
