import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from "../services/authentication-service.service";
import { Router, ActivatedRoute } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  error: string;
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(private http:HttpClient,
      private authenticationService: AuthenticationService,
      private router: Router,private route: ActivatedRoute,) {}

  ngOnInit(): void {
    // reset login status
    this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  private onLoginSuccesFull(){

  }

  login() {
    this.loading = true;
    
    this.authenticationService.login(this.model.email, this.model.password).subscribe(data => {
      this.router.navigate([this.returnUrl]);
      window.location.reload();
    }, error => {
      this.error = "Combinatie email - paswoord is niet correct";
      this.loading = false;
    });
  }
}
