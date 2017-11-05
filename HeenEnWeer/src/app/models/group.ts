import { Child } from './child';
import { CalendarEvent } from 'angular-calendar';

export class Group {
    children: Child[];
    events: CalendarEvent[];
}
