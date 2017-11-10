import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'app-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.css'],
  encapsulation: ViewEncapsulation.None  
})
export class CostsComponent implements OnInit {
  displayedColumns = ['date', 'description', 'amount'];
  dataSource: ExampleDataSource | null;
  user: User;

  constructor(private parentService: ParentService, private authenticationSerivce: AuthenticationService){}

  ngOnInit() {
    this.dataSource = new ExampleDataSource(this.parentService, this.authenticationSerivce);
  }
}

export interface CostData {
  date: Date;
  description: string;
  amount: string;
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
  constructor(private parentService: ParentService, private authenticationService: AuthenticationService) {
    super();
    this.user = this.authenticationService.getUser();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<CostData[]> {
    console.log(this.parentService.getCosts(this.user.email).subscribe(data => console.log(data)));
    return this.parentService.getCosts(this.user.email);
  }

  disconnect() {}
}
