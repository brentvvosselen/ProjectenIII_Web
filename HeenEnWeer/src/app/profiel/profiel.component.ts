import { Component, OnInit } from '@angular/core';
import { Parent } from '../../app/models/parent';
import { User } from '../models/user';
import { ParentService } from '../services/parent.service';
import { AuthenticationService } from '../services/authentication-service.service';
import { ViewEncapsulation } from '@angular/core';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-profiel',
  templateUrl: './profiel.component.html',
  styleUrls: ['./profiel.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfielComponent implements OnInit {
  user: User;
  parents: Parent[];

  //gebruiken van currentUser in de html voor info
  currentUser: Parent;

  constructor(private authenticationService: AuthenticationService,private parentService: ParentService) {
    this.user = authenticationService.getUser();
  }

  ngOnInit() {
    this.getParentFromUserEmail(this.user.email);
  }


  getParents():void{
    this.parentService.getAll().map(response => this.parents = response);
  }

  private getParentFromUserEmail(email: string){
    this.parentService.getByEmail(email).map(
      (response) => this.currentUser = response).subscribe(data => {
        console.log(data);
      });
  }
}
