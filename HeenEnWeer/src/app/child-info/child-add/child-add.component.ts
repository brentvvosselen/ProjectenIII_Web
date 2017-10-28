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

  public genders = [
    { value: 'F', display: 'Female' },
    { value: 'M', display: 'Male' }
  ];

  user: User;
  currentUser: Parent;
  model: any = {};

  constructor(private authenticationService: AuthenticationService, private parentService: ParentService, private router: Router) {
      this.user = authenticationService.getUser();
   }

  ngOnInit() {
    console.log(this.genders);
    this.getParentFromUserEmail(this.user.email);
  }

  addChild(){
    console.log(this.model);
    this.parentService.addChild(this.model, this.currentUser).subscribe(data => console.log(data));
    this.router.navigate(["/children"]);
  }

  private getParentFromUserEmail(email: string){
    this.parentService.getByEmail(email).map(
      (response) => this.currentUser = response).subscribe(data => {
        //oke parent object is gezet naar currentUser
        //console.log(this.currentUser);
        console.log(this.currentUser);
    });
  }

}
