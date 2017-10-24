import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Invitee } from '../models/invitee';
import { NgModel, Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ParentService } from '../services/parent.service';
import { UserService } from '../services/user-service.service'; 
import { Router } from '@angular/router'; 
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-invite-register',
  templateUrl: './invite-register.component.html',
  styleUrls: ['./invite-register.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InviteRegisterComponent implements OnInit {

  genders = ['F','M'];

  key: string;

  model: any = {};
  inviteRegisterForm: FormGroup;

  

  constructor(private route: ActivatedRoute, private parentService: ParentService, private userService: UserService, private router: Router) { 
    this.route.params.subscribe(params => this.key = params.key);

     this.parentService.getInvitee(this.key).subscribe(data => {
      //we halen de values die nodig zijn op uit de data en plaatsen deze in het model
      this.model.email = data.email;
      this.model.firstname = data.firstname;
      this.model.lastname = data.lastname;
      this.model.key = data.key;
     });
    
  }

  ngOnInit() {
  }

  register(){
    console.log(this.model);
    this.userService.addByInvite(this.model).subscribe(data => {
      this.router.navigate(['/login']);
    }, error => {
      console.log('Registreren niet gelukt');
    });
  }

}
