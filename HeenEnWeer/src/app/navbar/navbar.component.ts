import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service.service';
import { User } from '../models/user';
import { ParentService } from '../services/parent.service';
import { Parent } from '../models/parent';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title = 'navbar';
  userIsLoggedIn: boolean;
  user: User;
  currentUser: Parent;
  gender: string;

  constructor(private authenticationService: AuthenticationService, private router: Router, private parentService: ParentService) {
    authenticationService.userIsLoggedIn.subscribe(isLoggedIn => {
      this.userIsLoggedIn = isLoggedIn;
      this.user = authenticationService.getUser();
      if(this.userIsLoggedIn){
        this.parentService.getByEmail(this.user.email).subscribe(user => (this.currentUser = user));     
      }
    });
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUser();
    this.userIsLoggedIn = this.user != undefined;
    if(this.userIsLoggedIn){
      this.parentService.getByEmail(this.user.email).subscribe(user => this.currentUser = user);      
    }
  }

  logout($event): void {
    $event.preventDefault();
    this.authenticationService.logout().then(success => {
      if (success) {
        this.router.navigateByUrl('/login');
        window.location.reload();
      }
    });
  }
}
