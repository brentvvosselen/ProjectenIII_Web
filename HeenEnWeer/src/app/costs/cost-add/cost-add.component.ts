import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Cost } from '../../models/cost';
import { AuthenticationService } from '../../services/authentication-service.service';
import { ParentService } from '../../services/parent.service';
import { User } from '../../models/user';
import { Image } from '../../models/image';
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

  @ViewChild('fileInput') fileInput;
  @ViewChild('preview') preview;
  codedFile: Image;

  constructor(private authenticationService: AuthenticationService,
     private parentService: ParentService,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<CostAddComponent>){
    this.user = this.authenticationService.getUser();
  }

  ngOnInit() {
    this.cost = new Cost();
    this.parentService.getCostCategories(this.user.email).subscribe(data => {this.costCategories = data});
  }

  save() {
    if(this.codedFile != undefined){
      this.cost.picture = this.codedFile;      
    }
    this.parentService.addCost(this.cost, this.user.email).subscribe(data => {this.dialogRef.close(data)});
  }

  showPreview() {
    var file = this.fileInput.nativeElement.files[0];
    console.log(file);
    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.codedFile = new Image(file.name, file.type, reader.result.split(',')[1]);
    };
  }
}
