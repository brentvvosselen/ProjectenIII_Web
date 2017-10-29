import { Component, OnInit } from '@angular/core';
import { Child } from '../models/child';


@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  children: Child[] = [];
  model : any = {};
  constructor() { }

  ngOnInit() {
    this.children.push(new Child = {
      firstname: "",
      lastname: "",
      gender: "",
      birthdate: "",
      categories: [],
    });
    console.log(this.children);
  }

  onStep1Next($event){
    console.log(this.model.gender);
  }

  onStep2Next($event){
    console.log(this.model);
  }

  onStep3Next($event){
    console.log(this.model);
  }
}
