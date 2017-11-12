import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Cost } from '../../models/cost';
import { AuthenticationService } from '../../services/authentication-service.service';
import { ParentService } from '../../services/parent.service';
import { User } from '../../models/user';
import { CostCategory } from '../../models/costCategory';

@Component({
  selector: 'app-cost-add',
  templateUrl: './cost-add.component.html',
  styleUrls: ['./cost-add.component.css']
})
export class CostAddComponent implements OnInit {

  cost: Cost;
  user: User;
  costCategories: CostCategory[] = [];
  
  constructor(private authenticationService: AuthenticationService, private parentService: ParentService, @Inject(MAT_DIALOG_DATA) public data: any){
    this.user = this.authenticationService.getUser();
  }

  ngOnInit() {
    this.cost = new Cost();
    this.parentService.getCostCategories(this.user.email).subscribe(data => {console.log(data), this.costCategories = data});
  }

  save(){
    this.parentService.addCost(this.cost, this.user.email).subscribe(data => console.log(data));
  }

}
