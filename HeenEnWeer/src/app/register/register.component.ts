import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  error: string;

  constructor(private http:HttpClient) { }

  ngOnInit() {
  }

  createUser(email, password, confirmationPassword) {
    this.error = "";
    if (password != confirmationPassword) {
      this.error = "Password doesn't match with confirmation";
      return;
    }

    this.http.post('http://127.0.0.1:5000/api/signup', {
      email: email,
      password: password
    }).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
      this.error = err.error;
    });
  }
}
