import { Component, OnInit, Inject } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service.service';
import { ParentService } from '../../services/parent.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Cost } from '../../models/cost';

@Component({
  selector: 'app-cost-detail',
  templateUrl: './cost-detail.component.html',
  styleUrls: ['./cost-detail.component.css']
})
export class CostDetailComponent implements OnInit {


  constructor(private authenticationService: AuthenticationService,
    private parentService: ParentService,
    @Inject(MAT_DIALOG_DATA) public cost: Cost,
    public dialogRef: MatDialogRef<CostDetailComponent>) { }

  ngOnInit() {
  }

}
