import { Component, OnInit } from '@angular/core';
import { NgModel, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Parent } from '../../../app/models/parent';
import { User } from '../../models/user';
import { ParentService } from '../../services/parent.service';
import { AuthenticationService } from '../../services/authentication-service.service';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  submitted = false;
  user: User;
  model: Parent;

  
  //gebruiken van currentUser in de html voor de waarden
  currentUser: Parent;


  profielForm : FormGroup;
  //addressStreet = new FormControl();

  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService, private parentService: ParentService) {
    this.user = authenticationService.getUser();
    //this.createForm();
  }

  ngOnInit() {
    this.getParentFromUserEmail(this.user.email);
   
  }

  createForm() {
    this.profielForm = this.fb.group({
      addressStreet: '',
    });
  }

  //roept api call op via parentservice
  private getParentFromUserEmail(email: string){
    this.parentService.getByEmail(email).map(
      (response) => this.currentUser = response).subscribe(data => {
        this.model = this.currentUser;      
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

    this.parentService.update(updatedUser).subscribe(data => {
      this.submitted = true;
    });

  }

  //get addressStreet() { return this.profielForm.get('addressStreet'); }
}
