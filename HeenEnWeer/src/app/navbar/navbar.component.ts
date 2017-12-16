import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service.service';
import { User } from '../models/user';
import { ParentService } from '../services/parent.service';
import { Parent } from '../models/parent';
import { Observable } from "rxjs/Observable";
import { Image } from '../models/image';

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
