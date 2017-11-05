import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { startOfDay, endOfDay } from 'date-fns';
import { colors } from '../../demo-utils/colors';
import { Subject } from 'rxjs/Subject';
import { User } from '../../models/user';
import { Parent } from '../../models/parent';
import { ParentService } from '../../services/parent.service';
import { AuthenticationService } from '../../services/authentication-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-add',
  templateUrl: './calendar-add.component.html',
  styleUrls: ['./calendar-add.component.css']
})
export class CalendarAddComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  events: CalendarEvent[] = [];
  
  refresh: Subject<any> = new Subject();
  
  user: User;
  currentUser: Parent;

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

  constructor(private modal: NgbModal, private parentService: ParentService, private authenticationService: AuthenticationService, private router: Router) {
    this.user = authenticationService.getUser();
  }

  ngOnInit() {
    this.parentService.getByEmail(this.user.email).subscribe(user => this.currentUser = user);
    
    this.parentService.getEvents(this.user.email).subscribe(data => {
      for(var event in data){
        console.log(data);
        var calendarEvent = {
          "start" : new Date(data[event]["start"]),
          "end" : new Date(data[event]["end"]),
          "actions": this.actions,
          "title" : data[event]["title"],
          "color": data[event]["category"]["color"]
        }

        this.events.push(calendarEvent);
        
      }
      console.log(this.events);
      this.refresh.next();
    });
    console.log(this.events);
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

  save(){
    this.currentUser.group.events = this.events;
    this.parentService.update(this.currentUser).subscribe(data => console.log(data));
    this.router.navigate(["/calendar"]);
  }
  
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }
}
