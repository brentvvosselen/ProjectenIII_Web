import { Component, OnInit } from '@angular/core';
import { Child } from '../models/child';
import { ParentService } from '../services/parent.service';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication-service.service';
import { Parent } from '../models/parent';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  children: Child[] = [];
  model : any = {};
  user: User;
  parent: Parent;
  setupForm: FormGroup;
  

  constructor(private parentService: ParentService, private authenticationSerivce: AuthenticationService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.children.push(new Child ());
    this.user = this.authenticationSerivce.getUser();
    this.parentService.getByEmail(this.user.email).subscribe(user => this.parent = user);
    this.setupForm = this.fb.group({
      gender: ['', [Validators.required]],
      otheremail: ['', [Validators.required, Validators.minLength(3)]],
      otherfirstname: ['', [Validators.required, Validators.minLength(3)]],
      otherlastname: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  submit(){
    if(this.setupForm.valid){
      this.model = {
        gender: this.setupForm.get('gender').value,
        otheremail: this.setupForm.get('otheremail').value,
        otherfirstname: this.setupForm.get('otherfirstname').value,
        otherlastname: this.setupForm.get('otherlastname').value
      };
      console.log(this.model);
      //this.router.navigate(["/home"]);
    }else{
      console.log("not valid");
    }
  }

  addChild(){
    this.children.push(new Child());
  }
}
