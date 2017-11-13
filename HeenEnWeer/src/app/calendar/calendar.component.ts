import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import { ParentService } from '../services/parent.service';
import { AuthenticationService } from '../services/authentication-service.service';
import { User } from '../models/user';
import { Parent } from '../models/parent';
import { CategoryAddComponent } from './category-add/category-add.component';
import { MatDialog } from '@angular/material';
import { Category } from '../models/category';
import { DayShowComponent } from './day-show/day-show.component';
import {Event} from "../models/event";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
var colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'calendar-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None  
})
export class CalendarComponent implements OnInit{
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'month';

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;

  user: User;
  currentUser: Parent;

  data: Event[];

  constructor(private modal: NgbModal,
     private parentService: ParentService,
      private authenticationService: AuthenticationService,
      public dialog: MatDialog) {
    this.user = authenticationService.getUser();
  }

  ngOnInit(){
    this.parentService.getByEmail(this.user.email).subscribe(user => this.currentUser = user);
    this.parentService.getEvents(this.user.email).subscribe(data => {
      this.data = data;
      //loop over alle evenementen in de data
      for(var event in data){
        console.log(data);
        //maakt nieuw kleur type aan voor automatische display op agenda
        var _color  = {
          primary: data[event]["categoryid"]["color"],
          secondary: data[event]["categoryid"]["color"]
        }
        //initialiseer een kalenderevenement om toe te voegen aan de kalender
        let calendarEvent : CalendarEvent = {
          start : new Date(data[event]["start"]),
          end : new Date(data[event]["end"]),
          actions: this.actions,
          title : data[event]["title"],
          color: _color,
          draggable: true,
          resizable: {
            beforeStart: true,
            afterEnd: true
          },
        }
        //push van event
        this.events.push(calendarEvent);
      }
      console.log(this.events);
      this.refresh.next();
    });
    this.refresh.subscribe();
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  showDay(event: CalendarEvent) {
    let dialogRef = this.dialog.open(DayShowComponent, {
      data: {
        title: event.title, end: event.end, start: event.start, color: event.color
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      let event = this.data.filter(item => item.title == result.title);
      this.events = this.events.filter(item => item.title != result.title || item.start != result.start || item.end != result.end);     
      console.log(this.events); 
      console.log(event[0]._id);
      this.parentService.deleteEvent(event[0]._id).subscribe(data => {this.refresh.next()});
    });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }
}