import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: string;
  constructor(private http:HttpClient) {}

  ngOnInit(): void {

  }

  onLogin(email,password){
    this.http.post('http://127.0.0.1:5000/api/login', {
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
