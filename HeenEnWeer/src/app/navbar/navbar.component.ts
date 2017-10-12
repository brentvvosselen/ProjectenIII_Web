import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service.service';
import { User } from '../models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title = 'navbar';
  userIsLoggedIn: boolean;
  user = new User();

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    authenticationService.userIsloggedIn.subscribe(isLoggedIn => {
      this.userIsLoggedIn = isLoggedIn;
      this.user = authenticationService.getUser();
    });
  }


  ngOnInit(): void {
    this.user = this.authenticationService.getUser();
  }


  logout($event): void {
    $event.preventDefault();

    this.authenticationService.logout().then(success => {
      if (success) {
        this.router.navigateByUrl('/login');
      }
    });
  }
}
