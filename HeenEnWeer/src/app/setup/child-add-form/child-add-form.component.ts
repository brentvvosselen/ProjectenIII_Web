import { Component, OnInit, Input } from '@angular/core';
import { Child } from '../../models/child';

@Component({
  selector: 'app-child-add-form',
  templateUrl: './child-add-form.component.html',
  styleUrls: ['./child-add-form.component.css']
})
export class ChildAddFormComponent implements OnInit {

  @Input() child: Child;
  constructor() { }

  ngOnInit() {
  }

}
