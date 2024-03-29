import { Component, OnInit, ViewEncapsulation, ViewChild, Inject } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { ParentService } from '../services/parent.service';
import { AuthenticationService } from '../services/authentication-service.service';
import { User } from '../models/user';
import { getDate } from 'date-fns';
import {MatPaginator} from "@angular/material";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Cost } from '../models/cost';
import { CostAddComponent } from './cost-add/cost-add.component';
import { CostCategory } from '../models/costCategory';
import { CostDetailComponent } from './cost-detail/cost-detail.component';
import { CostsPayComponent } from './costs-pay/costs-pay.component';
import { forEach } from '@angular/router/src/utils/collection';
import { Parent } from '../models/parent';
import { Child } from '../models/child';
import { filter } from 'rxjs/operator/filter';

@Component({
  selector: 'app-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CostsComponent implements OnInit {
  displayedColumns = ['date', 'description', 'amount'];
  dataSource: ExampleDataSource | null;
  costDatabase;
  user: User;
  currentUser: Parent;
  model : any [];
  length: Number;
  costCategories: CostCategory[] = [];
  cost: Cost;
  selectedCost: Cost;
  searchValue: string = '';
  total: number;
  costBill: any = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;

    /**
     * Set the paginator after the view init since this component will
     * be able to query its view for the initialized paginator.
     */
    ngAfterViewInit() {
      //this.dataSource.length = this.paginator;
    }

  constructor(private parentService: ParentService, private authenticationSerivce: AuthenticationService, public dialog: MatDialog){
    this.user = this.authenticationSerivce.getUser();
    this.costDatabase = new CostDatabase(this.parentService,this.authenticationSerivce);
  }

  openDialog() {
    this.cost = new Cost();
    let dialogRef = this.dialog.open(CostAddComponent, {
      width: '350',
      data: {
        title: this.cost.title,
        description: this.cost.description,
        amount: this.cost.amount,
        date: this.cost.date
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cost = result;
      if(result != undefined){
        var month = new Date().getMonth();
        var year = new Date().getFullYear();
        var dateResult = new Date(result.date);
        if(dateResult.getMonth() == month && dateResult.getFullYear() == year) {
            this.costDatabase.addCost(result);
        }
        this.total = this.costDatabase.getTotal();
      }
    });
  }

  openInfoDialog(cost: Cost){
    let dialogRef = this.dialog.open(CostDetailComponent, {
      width: '400px',
      data: {
        title: cost.title,
        description: cost.description,
        amount: cost.amount,
        date: cost.date,
        picture: cost.picture,
        children: cost.children
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  pay(){
    let dialogRef = this.dialog.open(CostsPayComponent, {
      width: '400px',
      data: {
        message: "U heeft betaald!"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  ngOnInit() {
    this.dataSource = new ExampleDataSource(this.costDatabase);
    this.parentService.getCosts(this.user.email).subscribe(data => {
      this.length = data.length,
      this.total = this.costDatabase.getTotal(),
      this.parentService.getByEmail(this.user.email).subscribe(data => this.currentUser = data);
      this.getCostBill();
    });
  }

  applyFilter(value: string){
    return this.costDatabase.applyFilter(value);
  }

  refresh(){
    console.log("refreshing..");
    this.dataSource = new ExampleDataSource(this.costDatabase);
  }

  selectChild(value: number){
    if(value == 0){
      this.costDatabase.refresh();
    }else{
      this.costDatabase.filterChild(value);
    }
  }

  getCostBill(){
    this.parentService.getCostBill(this.user.email).subscribe(data => {
      this.costBill = data
      console.log(this.costBill);
    });
  }
}

export interface CostData {
  date: Date;
  description: string;
  amount: number;
  children: Child[];
}

export class CostDatabase{
  dataChange: BehaviorSubject<CostData[]> = new BehaviorSubject<CostData[]>([]);
  get data(): CostData[] { return this.dataChange.value; }
  initialData: CostData[];
  user: User;
  total: number = 0;

  constructor(private parentService: ParentService, private authenticationService: AuthenticationService){
    this.user = this.authenticationService.getUser();
    // this.parentService.getCosts(this.user.email).subscribe(data => {console.log(data), this.dataChange.next(data), this.initialData = data});
    this.parentService.getCostsMonth(this.user.email).subscribe(data => {this.dataChange.next(data), this.initialData = data});
  }

  addCost(cost: CostData){
    const copiedData = this.data.slice();
    copiedData.push(cost);
    this.dataChange.next(copiedData);
    this.initialData.push(cost);
  }

  applyFilter(filterValue: string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    var copiedData = this.initialData.slice();
    if(filterValue == ""){
      this.dataChange.next(this.initialData);
    }else{
      this.dataChange.next(copiedData.filter(e => e.description.includes(filterValue) || e.amount == parseInt(filterValue)));
    }
  }

  filterChild(value: Child){
    var filtered = [];
    for(var i = 0; i < this.initialData.length; i++) {
      for(var j = 0; j < this.initialData[i].children.length; j++) {
        if(this.initialData[i].children[j]._id == value._id) {
          filtered.push(this.initialData[i]);
        }
      }
    }
    this.dataChange.next(filtered);
  }

  getTotal(): number{
    this.total = 0;
    const copiedData = this.data;
    copiedData.forEach(elem => {
      this.total += elem.amount;
    });
    return this.total;
  }

  refresh(){
    this.dataChange.next(this.initialData);
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
  user: User;
  length: Number;

  constructor(private costDatabase: CostDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<CostData[]> {
    return this.costDatabase.dataChange;
  }

  applyFilter(value: string){
    return this.costDatabase.applyFilter(value);
  }

  disconnect() {}
}
