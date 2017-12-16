import { Component, OnInit } from '@angular/core';

import { User } from '../../app/models/user';
import { UserService } from '../services/user-service.service';
import { ViewEncapsulation } from '@angular/core';
import { ParentService } from '../services/parent.service';
import { AuthenticationService } from '../services/authentication-service.service';
import { Parent } from '../models/parent';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { HomeSetupPopupComponent } from './home-setup-popup/home-setup-popup.component';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {
    currentUser: Parent;
    user: User;

    constructor(private userService: UserService, private authenticationService: AuthenticationService, private parentService: ParentService,  public dialog: MatDialog, private router: Router) {
        this.user = this.authenticationService.getUser();
    }

    ngOnInit() {
        this.parentService.getByEmail(this.user.email).subscribe(user => {
            this.currentUser = user, console.log(this.currentUser.doneSetup)
            if (this.currentUser.doneSetup == false) {
                const dialogRef = this.dialog.open(HomeSetupPopupComponent, {

                });

                dialogRef.afterClosed().subscribe(result => {
                    console.log(`Dialog result: ${result}`);
                    if (result != undefined) {
                        this.router.navigate(["/setup"]);
                    }
                });
            }
        });
    }
}
