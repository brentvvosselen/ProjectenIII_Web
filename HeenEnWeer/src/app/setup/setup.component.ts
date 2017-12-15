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
      otheremail: ['', [Validators.required, Validators.minLength(3),  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9]+\\.[a-z]{2,3}')]],
      otherfirstname: ['', [Validators.required, Validators.minLength(3)]],
      otherlastname: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  submit(){
    if(this.setupForm.valid){
      var childrenFiltered = this.children.filter(e => e.firstname != null);
      console.log(childrenFiltered);
      this.model = {
        currentType: this.setupForm.get('gender').value,
        otherEmail: this.setupForm.get('otheremail').value,
        otherFirstname: this.setupForm.get('otherfirstname').value,
        otherLastname: this.setupForm.get('otherlastname').value,
        children: childrenFiltered
      };
      this.model.email = this.parent.email;
      console.log(this.model);
      this.parentService.saveSetup(this.model).subscribe(data => {
        this.router.navigate(["/home"]);        
      });
    }else{
      console.log("not valid");
    }
  }

  addChild(){
    this.children.push(new Child());
  }
}
