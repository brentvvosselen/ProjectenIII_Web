import { Component, OnInit } from '@angular/core';
import { Child } from '../models/child';
import { ParentService } from '../services/parent.service';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication-service.service';
import { Parent } from '../models/parent';


@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  children: Child[] = [];
  model : any = {};
  user: User;
  parent: Parent;
  
  constructor(private parentService: ParentService, private authenticationSerivce: AuthenticationService) { }

  ngOnInit() {
    this.children.push(new Child ());
    this.user = this.authenticationSerivce.getUser();
    this.parentService.getByEmail(this.user.email).subscribe(parent => this.parent = parent);
  }

  onStep1Next($event){
    //this.parentService.updateParent(this.model);
    this.parent.type = this.model.type;
    console.log(this.parent.type + "dit is het type");
    this.parentService.update(this.parent).subscribe(data => console.log(data));
  }

  onStep2Next($event){
  }

  onStep3Next($event){
    this.model.children = this.children;
    this.model.email = this.user.email;
    this.model.currentType = this.model.type;

    console.log(this.model);
    this.parentService.saveSetup(this.model).subscribe(data => console.log(data));
  }

  addChild(){
    this.children.push(new Child());
  }
}
