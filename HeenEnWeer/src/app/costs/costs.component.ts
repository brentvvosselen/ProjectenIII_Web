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
  model : any [];
  length: Number;
  costCategories: CostCategory[] = [];
  cost: Cost;

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
      data: {
        title: this.cost.title, description: this.cost.description, amount: this.cost.amount, date: this.cost.date
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cost = result;
      this.costDatabase.addCost(result);
      this.dataSource.connect();
    });
  }

  ngOnInit() {
    this.dataSource = new ExampleDataSource(this.costDatabase);
    this.parentService.getCosts(this.user.email).subscribe(data => {this.length = data.length})    
  }

  applyFilter(value: string){
    return this.costDatabase.applyFilter(value);
  }
}

export interface CostData {
  date: Date;
  description: string;
  amount: string;
}

export class CostDatabase{
  dataChange: BehaviorSubject<CostData[]> = new BehaviorSubject<CostData[]>([]);
  get data(): CostData[] { return this.dataChange.value; }
  initialData: CostData[];
  user: User;
  constructor(private parentService: ParentService, private authenticationService: AuthenticationService){
    this.user = this.authenticationService.getUser();
    this.parentService.getCosts(this.user.email).subscribe(data => {console.log(data), this.dataChange.next(data), this.initialData = data});
  }

  addCost(cost: CostData){
    const copiedData = this.data.slice();
    copiedData.push(cost);
    this.dataChange.next(copiedData);
  }

  applyFilter(filterValue: string){
    console.log(filterValue);
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); 
    var copiedData = this.data.slice();
    if(filterValue == ""){
      this.dataChange.next(this.initialData);
    }else{
      this.dataChange.next(copiedData.filter(e => e.description.includes(filterValue)));      
    }
    //this.dataChange.next(data);
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
