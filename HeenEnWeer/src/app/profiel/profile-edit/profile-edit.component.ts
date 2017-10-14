import { Component, OnInit } from '@angular/core';
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
  user: User;
  model: any = {};

  //gebruiken van currentUser in de html voor de waarden
  currentUser: Parent;

  constructor(private authenticationService: AuthenticationService, private parentService: ParentService) {

    //haalt user op uit localstorage
    this.user = authenticationService.getUser();
    //moet dit nog hier?
    this.getParentFromUserEmail(this.user.email);

  }


  ngOnInit() {
    this.getParentFromUserEmail(this.user.email);
  }

  //roept api call op via parentservice
  private getParentFromUserEmail(email: string){
    this.parentService.getByEmail(email).map(
      (response) => this.currentUser = response).subscribe(data => {
        console.log(this.currentUser);
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


    this.parentService.update(updatedUser);


    //this.parentService.update()
  }


}
