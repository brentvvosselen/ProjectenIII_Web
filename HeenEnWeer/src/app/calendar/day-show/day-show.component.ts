import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CategoryAddComponent } from '../category-add/category-add.component';

@Component({
  selector: 'app-day-show',
  templateUrl: './day-show.component.html',
  styleUrls: ['./day-show.component.css']
})
export class DayShowComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<CategoryAddComponent>) { }

  ngOnInit() {
  }

  remove(){
    console.log("i want to remove you")
    this.dialogRef.close(this.data);
  }
}
