import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-costs-pay',
  templateUrl: './costs-pay.component.html',
  styleUrls: ['./costs-pay.component.css']
})
export class CostsPayComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }

}
