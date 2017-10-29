import { Component, OnInit, Input } from '@angular/core';
import { Child } from '../../models/child';

@Component({
  selector: 'app-childForm',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {

  @Input() child: Child;

  constructor() { }

  ngOnInit() {
  }

}
