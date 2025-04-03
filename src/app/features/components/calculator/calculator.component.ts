import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BringToFrontDirective } from '../../../core/directives/bring-to-front.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AppInstance } from '../../../core/models/app-instance.model';
import { AppActionsService } from '../../../core/services/app-actions-service.service';
import { DragResizeService } from '../../../core/services/resize-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, BringToFrontDirective],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
})
export class CalculatorComponent implements OnInit {
  private destroy$ = new Subject<void>();

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

  public displayValue: string = '0';
  public previousValue: string | null = null;
  public pendingValue: string | null = null;
  public currentOperation: string | null = null;

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

  public appendChar(value: string): void {
    if (value === '.' && this.displayValue.includes('.')) {
      return;
    }

    this.displayValue =
      this.displayValue === '0' ? value : this.displayValue + value;
  }

  public operation(operation: string): void {
    if (this.displayValue === '') {
      return;
    }

    if (!this.currentOperation) {
      this.previousValue = this.displayValue;
      this.currentOperation = this.mapOperationToSymbol(operation);
      this.displayValue = '0';
    } else {
      this.calculate();
      this.currentOperation = this.mapOperationToSymbol(operation);
    }
  }

  public mapOperationToSymbol(operation: string): string | null {
    const operations: { [key: string]: string } = {
      addition: '+',
      subtraction: '-',
      multiplication: '×',
      division: '÷',
    };

    return operations[operation] || operation;
  }

  public calculate(): void {
    if (!this.previousValue || !this.currentOperation) return;

    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.displayValue);
    let result: number;

    switch (this.currentOperation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = current === 0 ? NaN : prev / current;
        break;
      default:
        return;
    }

    this.previousValue = `${this.previousValue} ${this.currentOperation} ${this.displayValue} =`;
    this.displayValue = isNaN(result) ? 'Error' : result.toString();
    this.currentOperation = null;
  }

  public clearDisplay() {
    this.displayValue = '0';
    this.previousValue = null;
    this.currentOperation = null;
    this.pendingValue = null;
  }

  public deleteChar() {
    if (this.displayValue.length === 1) {
      this.displayValue = '0';
    } else {
      this.displayValue = this.displayValue.slice(0, -1);
    }
  }

  // Calculator controls
  public toggleMinimizeNotepad() {
    this.minimize.emit();
  }

  public toggleCloseNotepad() {
    this.close.emit();
  }
}
