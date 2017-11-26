import { Component, OnInit } from '@angular/core';
import { ParentService } from '../services/parent.service';
import { User } from '../models/user';
import { Child } from '../models/child';
import { Parent } from '../../app/models/parent';
import { AuthenticationService } from '../services/authentication-service.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-child-info',
  templateUrl: './child-info.component.html',
  styleUrls: ['./child-info.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChildInfoComponent implements OnInit {
  user: User;
  currentUser: Parent;
  children: Child[];

  constructor(private authenticationService: AuthenticationService,private parentService: ParentService) {
    //haalt user op uit localstorage
    this.user = authenticationService.getUser();
  }

  ngOnInit() {
    this.parentService.getByEmail(this.user.email).subscribe(user => this.currentUser = user);
  }
}
