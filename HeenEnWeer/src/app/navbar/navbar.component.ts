import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service.service';
import { User } from '../models/user';
import { ParentService } from '../services/parent.service';
import { Parent } from '../models/parent';

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
    authenticationService.userIsloggedIn.subscribe(isLoggedIn => {
      this.userIsLoggedIn = isLoggedIn;
      this.user = authenticationService.getUser();
    });
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUser();
    this.userIsLoggedIn = this.user != undefined;
    this.getParentFromUserEmail(this.user.email);
    this.getSex();
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

  //roept een api call op via parentservice.. Dit deel werkt wel -> kijk in de console -> probeer een object van de data te maken
  private getParentFromUserEmail(email: string) {
    this.parentService.getByEmail(email).map(
      (response) => this.currentUser = response).subscribe(data => {
        this.gender = data.type;
      });
  }

  getSex() {
    return this.gender;
  }
}
