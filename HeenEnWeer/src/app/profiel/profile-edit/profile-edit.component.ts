import { Component, OnInit } from '@angular/core';
import { NgModel, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Parent } from '../../../app/models/parent';
import { User } from '../../models/user';
import { ParentService } from '../../services/parent.service';
import { AuthenticationService } from '../../services/authentication-service.service';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileEditComponent implements OnInit {
  submitted = false;
  user: User;
  model: Parent;
  //gebruiken van currentUser in de html voor de waarden
  currentUser: Parent;

  profielForm : FormGroup;

  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService, private parentService: ParentService,private router: Router) {
    this.user = authenticationService.getUser();
  }

  ngOnInit() {
    this.parentService.getByEmail(this.user.email).subscribe(user => 
      {
        this.currentUser = user,
        this.model = user;
      });   
  }

  edit(){
    var updatedUser = this.currentUser;
    updatedUser['addressStreet'] = this.model.addressStreet;
    updatedUser['addressCity'] = this.model.addressCity;
    updatedUser['addressNumber'] = this.model.addressNumber;
    updatedUser['addressPostalcode'] =  this.model.addressPostalcode;
    updatedUser['telephoneNumber'] = this.model.telephoneNumber;
    updatedUser['workName'] = this.model.workName;
    updatedUser['workNumber'] = this.model.workNumber;

    console.log(updatedUser["telephoneNumber"]);

    this.parentService.update(updatedUser).subscribe(data => {
      this.submitted = true;
    });

    this.router.navigate(["/profiel"]);
  }
}
