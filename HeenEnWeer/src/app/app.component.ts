import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../app/services/authentication-service.service';
import { User } from '../app/models/user';
import { ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'app';

    user : User;
    userIsLoggedIn: boolean;
    isLoggedIn$: Observable<boolean>;

    constructor(private authenticationService: AuthenticationService) {
      this.isLoggedIn$ = this.authenticationService.userIsLoggedIn;
      console.log(this.isLoggedIn$);
    }

}
