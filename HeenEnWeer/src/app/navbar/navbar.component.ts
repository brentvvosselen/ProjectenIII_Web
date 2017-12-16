import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service.service';
import { User } from '../models/user';
import { ParentService } from '../services/parent.service';
import { Parent } from '../models/parent';
import { Observable } from "rxjs/Observable";
import { Image } from '../models/image';

import {DomSanitizer} from '@angular/platform-browser';

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

  @ViewChild('fileInput') fileInput;
  @ViewChild('preview') preview;
  codedFile: Image;
  imageValue: string;

  constructor(private authenticationService: AuthenticationService, private router: Router, private parentService: ParentService, private _domSanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUser();
    this.userIsLoggedIn = this.user != undefined;
    if(this.userIsLoggedIn){
      this.parentService.getByEmail(this.user.email).subscribe(user => {
        this.currentUser = user;

        if(this.currentUser.picture) {
          this.imageValue = "data:" + this.currentUser.picture.filetype + ";base64," + this.currentUser.picture.value;
        }
      });      
    }
  }

  logout($event): void {
    this.authenticationService.logout().then(success => {
      if (success) {
        this.router.navigate(['/login']);
      }
    });
  }

  showPreview() {
    var file = this.fileInput.nativeElement.files[0];
    console.log(file);
    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.codedFile = new Image(file.name, file.type, reader.result.split(',')[1]);
    };
  }

  addPicture() {
    this.parentService.addPicture(this.user.email, this.codedFile).subscribe(item => console.log(item));
  }
}
