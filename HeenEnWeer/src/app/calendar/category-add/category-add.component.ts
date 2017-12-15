import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication-service.service';
import { ParentService } from '../../services/parent.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit {

  user: User;
  category: Category;
  
  constructor(private authenticationService: AuthenticationService, 
    private parentService: ParentService, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CategoryAddComponent>){
    this.user = this.authenticationService.getUser();
  }

  ngOnInit(){
    this.category = new Category();
    this.category.color = "#ff0303";
  }

  closeDialog() {
    this.dialogRef.close("test");
  }

  save(){
    this.parentService.addCategory(this.category,this.user.email).subscribe(data => {this.category = data, this.dialogRef.close(data)});
  }

  setColor(value :string){
    this.category.color = value;
  }
}
