import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../app/services/authentication-service.service'; 
import { User } from '../app/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  userIsLoggedIn: boolean;
  user = new User();
  
    constructor(private authenticationService: AuthenticationService,private router: Router) {
      authenticationService.userIsloggedIn.subscribe(isLoggedIn => {
        this.userIsLoggedIn = isLoggedIn;
        this.user = authenticationService.getUser();
      });
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
