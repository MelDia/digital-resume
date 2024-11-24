import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ScreenSizeDirective } from '../../../core/directives/screen-size-directive.directive';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ScreenSizeDirective],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  
  private clockSubscription: Subscription = new Subscription();

  public currentDate: Date = new Date();
  public currentMonth: string = '';
  public currentYear: number = this.currentDate.getFullYear();

  public time: string = '';
  public date: string = '';
  public daysInMonth: number[] = [];
  public today: number = this.currentDate.getDate();
  public firstDayOfMonth: number = 0;

  private monthNames: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  public dayNames: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  public isCurrentMonth: boolean = true;

  ngOnInit(): void {
    this.currentMonth = this.monthNames[this.currentDate.getMonth()];
    this.clockSubscription = interval(0)
    .subscribe(() => {
      this.updateTimeAndDate()
    });
    this.updateCalendar();
  }

  ngOnDestroy(): void {
    this.clockSubscription.unsubscribe();
  }

  private updateTimeAndDate(): void {
    try {
      this.currentDate = new Date();

      let hours = this.currentDate.getHours();
      const minutes = this.currentDate.getMinutes();
      const seconds = this.currentDate.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      hours = hours % 12;
      hours = hours ? hours : 12;

      this.time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;

      this.updateDate();
    } catch (error) {
      console.error('updateTimeAndDate():', error);
    }
  }

  private updateDate(): void {
    try {

      const year = this.currentYear; 
      const monthIndex = this.monthNames.indexOf(this.currentMonth);

      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);

      this.firstDayOfMonth = new Date(year, monthIndex, 1).getDay();

      this.isCurrentMonth = (year === this.currentDate.getFullYear()) && (monthIndex === this.currentDate.getMonth());

      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };

      this.date = new Intl.DateTimeFormat('en-EN', options).format(this.currentDate);
      
    } catch (error) {
      console.error('updateDate():', error);
    }
  }

  previousMonth() {
    const monthIndex = this.monthNames.indexOf(this.currentMonth); 
    if (monthIndex === 0) {
      this.currentMonth = this.monthNames[11]; 
      this.currentYear--; 
    } else {
      this.currentMonth = this.monthNames[monthIndex - 1];; 
    }
    this.updateCalendar();
  }

  nextMonth() {
    const monthIndex = this.monthNames.indexOf(this.currentMonth);

    if (monthIndex === 11) {
      this.currentMonth = this.monthNames[0]; 
      this.currentYear++; 
    } else {
      this.currentMonth = this.monthNames[monthIndex + 1]; 
    }
    this.updateCalendar();
  }


  private updateCalendar(): void {
    this.updateDate(); 
  }
}
