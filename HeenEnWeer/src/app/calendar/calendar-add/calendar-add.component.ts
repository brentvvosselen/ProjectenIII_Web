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
import { CategoryAddComponent } from '../category-add/category-add.component';
import { MatDialog } from '@angular/material';

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
  categories: Category[] = [];
  category: Category;
  selectedCategory: Category;

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

  constructor(private modal: NgbModal, public dialog: MatDialog, private parentService: ParentService, private authenticationService: AuthenticationService, private router: Router) {
    this.user = authenticationService.getUser();
  }

  ngOnInit() {
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
    this.refresh.next();
  }

  newCategory(){
    this.category = new Category();
    console.log("nieuw categorie");
  }

  save(){
    var model = {
      categoryid: this.selectedCategory._id,
      end: this.event.end,
      start: this.event.start,
      title: this.event.title,
      description:  this.event.description
    }
    this.parentService.addEvent(model,this.user.email).subscribe(data => this.router.navigate(["/calendar"]));
    this.refresh.next();
  }
  
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addCategory(){
    console.log(this.category);
    var model : any = {
      type: this.category.type,
      color: this.category.color 
    }
    this.parentService.addCategory(model, this.user.email).subscribe(data => {
      console.log(data),
      this.categories.push(data);      
      }
    );
    this.category = null;
  }

  setCat(value: string){
    let obj = this.categories.find(e => e.type === value);
    this.selectedCategory = obj;
    console.log(this.selectedCategory);
  }

  openDialog(): void {
    this.category = new Category();
    let dialogRef = this.dialog.open(CategoryAddComponent, {
      width: '250px',
      data: { type: this.category.type, color: this.category.color }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.category = result;
      console.log(result);
      this.categories.push(this.category);
    });
  }
}
