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
    //this.children.push(new Child ());
    this.user = this.authenticationSerivce.getUser();
    this.parentService.getByEmail(this.user.email).subscribe(parent => this.parent = parent);
    console.log(this.children);
  }

  onStep1Next($event){
    console.log(this.model.type);
    console.log(this.model);
    //this.parentService.updateParent(this.model);
    this.parent.type = this.model.type;
    console.log(this.parent.type + "dit is het type");
    this.parentService.update(this.parent).subscribe(data => console.log(data));
  }

  onStep2Next($event){
    console.log(this.model);
  }

  onStep3Next($event){
    console.log(this.model);
  }
}
