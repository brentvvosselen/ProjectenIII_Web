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
import { Child } from '../../models/child';

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
  selectedChildren: Child[];
  allChildren: Child[];
  refresh: Subject<any> = new Subject();
  
  user: User;
  currentUser: Parent;

  modalData: {
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
      this.selectedCategory = this.categories[0];
    });
    this.parentService.getByEmail(this.user.email).subscribe(user => {
      this.currentUser = user;
      this.allChildren = user.group.children;
    });
    this.newEvent();
  }

  newEvent(){
    this.event = {
      title: "test",
      start: new Date(),
      end: new Date(),
      until: new Date(),
      freq: "",
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      children: [],
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
      description:  this.event.description,
      children: this.selectedChildren,
      freq: this.event.freq,
      until: this.event.until,
    }
    console.log(model);
    this.parentService.addEvent(model,this.user.email).subscribe(data => this.router.navigate(["/calendar"]));
    this.refresh.next();
  }
  
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event };
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

  setChild(value: number){
    console.log(value);
    if(value === 0){
      this.selectedChildren === this.allChildren;
      console.log("geraak k ier?");
      console.log(this.allChildren);
    }else{
      this.selectedChildren = this.currentUser.group.children.filter(elem => elem._id == value);
      console.log(this.selectedChildren);
    } 
  }

  openDialog(): void {
    this.category = new Category();
    let dialogRef = this.dialog.open(CategoryAddComponent, {
      width: '450px',
      data: { type: this.category.type, color: this.category.color }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.category = result;
        console.log(result);
        this.selectedCategory = result;
        this.categories.push(this.category);
      }
    });
  }

  setFreq(value: string){
    console.log(value);
    this.event.freq = value;
    console.log(this.event.freq);
  }
}
