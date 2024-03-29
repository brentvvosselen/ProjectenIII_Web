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
  CalendarEventTimesChangedEvent,
  DAYS_OF_WEEK
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
import { Child } from '../models/child';
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
  locale: string = "nl";
  view: string = 'month';

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  
  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];
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
  filteredEvents: CalendarEvent[] = [];
  initialEvents: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;

  user: User;
  currentUser: Parent;

  data: any = [];
  children: Child[];

  constructor(private modal: NgbModal,
     private parentService: ParentService,
      private authenticationService: AuthenticationService,
      public dialog: MatDialog) {
    this.user = authenticationService.getUser();
  }

  ngOnInit(){
    this.parentService.getByEmail(this.user.email).subscribe(dat => {
      this.currentUser = dat;
      console.log(this.currentUser);
      this.parentService.getEvents(this.user.email).subscribe(data => {
        this.data = data;
        //loop over alle evenementen in de data
        for(var event in data){
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
            draggable: false,
            resizable: {
              beforeStart: true,
              afterEnd: true
            },
          }
          //push van event
          this.events.push(calendarEvent);
          this.initialEvents.push(calendarEvent);
        }
        console.log(this.events);
        this.refresh.next();
      });
    })
    
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
      },
      height: '400px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      let event = this.data.filter(item => item.title == result.title);
      this.events = this.events.filter(item => item.title != result.title || item.start != result.start || item.end != result.end);     
      console.log(this.events); 
      console.log(event[0]._id);
      this.parentService.deleteEvent(this.user.email ,event[0]._id).subscribe(data => {this.refresh.next()});
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

  filter(value: string){
    console.log(value);
    let events : Event[];
    this.filteredEvents = [];
    if(value === "All"){
      this.events = this.initialEvents
      this.refresh.next();
    }else{
      for(var event in this.data){
        for(var child in this.data[event]["children"]){ 
          if(value == this.data[event]["children"][child]["firstname"]){
            var _color  = {
              primary: this.data[event]["categoryid"]["color"],
              secondary: this.data[event]["categoryid"]["color"]
            }
            //initialiseer een kalenderevenement om toe te voegen aan de kalender
            let calendarEvent : CalendarEvent = {
              start : new Date(this.data[event]["start"]),
              end : new Date(this.data[event]["end"]),
              actions: this.actions,
              title : this.data[event]["title"],
              color: _color,
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
            }
            this.filteredEvents.push(calendarEvent);
          }
        }
      }
      if(this.filteredEvents.length > 0){
        this.events = this.filteredEvents;
        this.refresh.next();
      }else{
       // this.events = this.initialEvents;
       this.events = [];
      }  
    }
  }

}

