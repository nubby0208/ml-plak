import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarView, DAYS_OF_WEEK } from 'angular-calendar';

@Component({
  selector: 'mwl-demo-utils-calendar-header',
  templateUrl: './calendar-header.component.html'
})
export class CalendarHeaderComponent {
  @Input() view: CalendarView | 'month' | 'week' | 'day';

  @Input() viewDate: Date;

  @Input() locale: string = 'en';

  @Output() viewChange: EventEmitter<string> = new EventEmitter();

  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

} 
