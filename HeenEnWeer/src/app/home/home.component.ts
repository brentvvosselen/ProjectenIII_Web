import { Component, OnInit } from '@angular/core';

import { User } from '../../app/models/user';
import { UserService } from '../services/user-service.service';
import { ViewEncapsulation } from '@angular/core';
import { ParentService } from '../services/parent.service';
import { AuthenticationService } from '../services/authentication-service.service';
import { Parent } from '../models/parent';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {
    currentUser: Parent;
    user: User;

    constructor(private userService: UserService, private authenticationService: AuthenticationService, private parentService: ParentService) {
        this.user = this.authenticationService.getUser();
    }

    ngOnInit() {
        this.parentService.getByEmail(this.user.email).then(user => this.currentUser = user);
    }
}
