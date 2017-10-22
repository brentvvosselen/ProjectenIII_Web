import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Invitee } from '../models/invitee';
import { NgModel, Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ParentService } from '../services/parent.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-invite-register',
  templateUrl: './invite-register.component.html',
  styleUrls: ['./invite-register.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InviteRegisterComponent implements OnInit {

  key: string;
  invitee: Invitee;

  model: any = {};
  inviteRegisterForm: FormGroup;

  

  constructor(private route: ActivatedRoute, private parentService: ParentService) { 
    this.route.params.subscribe(params => this.key = params.key);

     this.parentService.getInvitee(this.key).subscribe(data => this.invitee = data);
    
  }

  ngOnInit() {
  }

}
