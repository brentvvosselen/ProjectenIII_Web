import { Component, OnInit } from '@angular/core';
import { Parent } from '../../app/models/parent';
import { User } from '../models/user';
import { ParentService } from '../services/parent.service';
import { AuthenticationService } from '../services/authentication-service.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-profiel',
  templateUrl: './profiel.component.html',
  styleUrls: ['./profiel.component.css']
})
export class ProfielComponent implements OnInit {
  user: User;

  //gebruiken van currentUser in de html voor info
  currentUser: Parent;

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
        // console.log(this.currentUser);
    });
  }

}
