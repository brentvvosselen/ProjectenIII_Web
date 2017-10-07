import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private http:HttpClient) { }

  ngOnInit() {
  }

  createUser(username, password) {
    this.http.post('http://127.0.0.1:5000/api/register', {
      username: username,
      password: password
    }).subscribe(data => {
      console.log(data);
    });
  }
}
