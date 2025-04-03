import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
      zIndex: this.appInstance.zIndex,
    };
  }

  @Output() close = new EventEmitter<void>();
  @Output() minimize = new EventEmitter<void>();
  @Output() maximize = new EventEmitter<void>();
  @Output() restoreMaximized = new EventEmitter<void>();

  @ViewChild('terminalContainer') terminalContainer!: ElementRef;

  public appInstances: AppInstance[] = [];
  public terminalLines: string[] = [];
  public terminalInput: string = '';
  public cursorVisible: boolean = true;

  private commandList: { [key: string]: string[] } = {
    help: [
      'Available commands:',
      '- profile: Show my professional profile',
      '- skills    Show a list of my technical skills',
      '- experience: Show my work experience',
      '- education: Show my certifications and education',
      '- contact   Get my contact details',
      '- clear     Clear the terminal screen',
    ],
    profile: [
      'Melina J. Diaz (Meldia)',
      'Full-stack Developer',
      'Passionate about building scalable and efficient web solutions with a focus on user experience.',
    ],
    skills: [
      'Technical Skills:',
      '- Front-end: HTML, CSS, JavaScript, TypeScript, Angular, Ionic, WebGL.',
      '- Back-end: Java (Spring, Spring Boot), Node.js, Express.js.',
      '- Databases: MySQL, SQL Server, Oracle, MongoDB.',
      '- Others: Docker, Kubernetes, Git, Linux, Jira.',
    ],
    experience: [
      '2023-Present: Full-stack Developer at Sistemas Planificados S.A.',
      '- Developed scalable applications with Java and Angular.',
      '- Managed microservices and optimized database performance.',
      '',
      '2022-2023: Software Developer at Factor IT.',
      '- Integrated APIs RESTful into Angular applications.',
      '- Developed a mobile app using Ionic.',
      '',
      '2020-2022: Freelance Full-stack Web Developer.',
      '- Designed responsive web layouts using HTML, CSS, and SASS.',
      '- Created and maintained APIs with Node.js and Java.',
    ],
    education: [
      'Certifications:',
      '- Java/Angular (Global Mentoring, 2021-2023)',
      '- Docker and Kubernetes (Academind, 2023-2024)',
    ],
    contact: [
      'Contact Information:',
      '- Email: diaz.melinajimena@gmail.com',
      '- LinkedIn: linkedin.com/in/melina-j-diaz',
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
    this.terminalLines.push(`> ${command}`);

    if (this.commandList[command]) {
      this.terminalLines.push(...this.commandList[command]);
      if (command === 'clear') {
        this.terminalLines = [];
      }
    } else {
      this.terminalLines.push(
        `'${command}' is not recognized as an internal or external command,
operable program or batch file.`
      );
    }

    this.terminalInput = '';
    this.scrollToBottom();
  }

  public scrollToBottom() {
    setTimeout(() => {
      const container = this.terminalContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }, 0);
  }
}
