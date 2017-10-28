import { Component, OnInit } from '@angular/core';
import { ParentService } from '../services/parent.service';
import { User } from '../models/user';
import { Child } from '../models/child';
import { Parent } from '../../app/models/parent';
import { AuthenticationService } from '../services/authentication-service.service';

@Component({
  selector: 'app-child-info',
  templateUrl: './child-info.component.html',
  styleUrls: ['./child-info.component.css']
})
export class ChildInfoComponent implements OnInit {
  user: User;
  currentUser: Parent;
  children: Child[];

  constructor(private authenticationService: AuthenticationService,private parentService: ParentService) {
    //haalt user op uit localstorage
    this.user = authenticationService.getUser();
  }

  ngOnInit() {
    this.getParentFromUserEmail(this.user.email);
  }

  //roept een api call op via parentservice.. Dit deel werkt wel -> kijk in de console -> probeer een object van de data te maken
  private getParentFromUserEmail(email: string){
    this.parentService.getByEmail(email).map(
      (response) => this.currentUser = response).subscribe(data => {
        //oke parent object is gezet naar currentUser
        console.log(this.currentUser);
    });
  }
}
