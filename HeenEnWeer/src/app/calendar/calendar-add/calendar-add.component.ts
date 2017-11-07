import { Component, OnInit, Input, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
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
import { Category } from '../../models/category';

@Component({
  selector: 'app-calendar-add',
  templateUrl: './calendar-add.component.html',
  styleUrls: ['./calendar-add.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarAddComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  events: CalendarEvent[] = [];
  event: any = {};
  categories: any[] = [];
  category: Category;

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
    this.parentService.getCategories(this.user.email).subscribe(data => {
      this.categories = data;
      console.log(this.categories);
    });
    this.newEvent();
  }

  newEvent(){
    this.event = {
      title: "test",
      start: new Date(),
      end: new Date(),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
    };
    console.log("nieuw single event aangemaakt");
    this.refresh.next();
  }

  save(){
    var model = {
      categoryid: "59feec1f48b163357425ef07",
      end: this.event.end,
      start: this.event.start,
      title: this.event.title,
      description:  this.event.description
    }
    console.log("log");
    this.parentService.addEvent(model,this.user.email).subscribe(data => console.log(data))
    this.router.navigate(["/calendar"]);
    this.refresh.next();
  }
  
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addCategory(){
    this.categories.push(this.category);
  }
}
