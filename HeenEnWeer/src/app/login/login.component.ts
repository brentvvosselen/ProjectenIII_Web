import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from "../services/authentication-service.service";
import { Router, ActivatedRoute } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  loginForm: FormGroup;

  constructor(private http: HttpClient,
    private authenticationService: AuthenticationService,
    private router: Router, private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // reset login status
    this.authenticationService.logout();

    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  private onLoginSuccesFull() {

  }

  login() {
    if (this.loginForm.valid) {
      this.model = {
        password: this.loginForm.get('password').value,
        email: this.loginForm.get('email').value
      };
      this.authenticationService.login(this.model.email, this.model.password).subscribe(data => {
        this.router.navigate([this.returnUrl]);
      }, error => {
        this.error = "Combinatie email - paswoord is niet correct";
        this.loading = false;
      });
    } else {
      console.log("not valid");
    }
  }
}

