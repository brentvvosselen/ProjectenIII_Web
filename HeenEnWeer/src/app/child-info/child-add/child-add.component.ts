import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication-service.service';
import { ParentService } from '../../services/parent.service';
import { User } from '../../models/user';
import { Parent } from '../../models/parent';
import { Router } from '@angular/router';

@Component({
  selector: 'app-child-add',
  templateUrl: './child-add.component.html',
  styleUrls: ['./child-add.component.css']
})
export class ChildAddComponent implements OnInit {

  genders = [
    { value: 'F', display: 'Miesje' },
    { value: 'M', display: 'Jongen' }
  ];

  user: User;
  currentUser: Parent;
  model: any = {};

  constructor(private authenticationService: AuthenticationService, private parentService: ParentService, private router: Router) {
      this.user = authenticationService.getUser();
   }

  ngOnInit() {
    this.parentService.getByEmail(this.user.email).subscribe(user => {this.currentUser = user});    
  }

  addChild(){
    console.log(this.model);
    this.parentService.addChild(this.model, this.currentUser).subscribe(data => console.log(data));
    this.router.navigate(["/children"]);
  }

  setGender(value: string){
    this.model.gender = value;
  }
}
