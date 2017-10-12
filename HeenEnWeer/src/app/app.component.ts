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

  
    constructor() {

    }

}
