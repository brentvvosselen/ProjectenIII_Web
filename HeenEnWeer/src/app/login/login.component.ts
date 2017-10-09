import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

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

  

  login(email,password){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let body = new URLSearchParams();
    body.set('email', email);
    body.set('password', password);

    this.http.post('http://127.0.0.1:5000/api/login',body.toString(),options).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
      this.error = err.error;
    });
  }
  
}
