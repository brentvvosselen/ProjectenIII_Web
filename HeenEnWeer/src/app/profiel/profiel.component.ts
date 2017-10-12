import { Component, OnInit } from '@angular/core';
import { Parent } from '../../app/models/parent';
import { User } from '../models/user';
import { ParentService } from '../services/parent.service';
import { AuthenticationService } from '../services/authentication-service.service';

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


    this.getParentFromUserEmail(this.user.email);
  }

  ngOnInit() {
  }

  //roept een api call op via parentservice.. Dit deel werkt wel -> kijk in de console -> probeer een object van de data te maken 
  private getParentFromUserEmail(email: string){
    this.parentService.getByEmail(email).subscribe(data => {
        this.currentUser == new Parent(data.firstname, data.lastname, data.email);
        console.log(this.currentUser);
    })
  }

}
