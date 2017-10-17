import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../app/services/authentication-service.service';
import { User } from '../app/models/user';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'app';


    constructor() {

    }

}
