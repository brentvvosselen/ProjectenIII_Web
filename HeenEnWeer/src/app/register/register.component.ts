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

  createUser(email, password, confirmationPassword) {
    if(password == confirmationPassword){
      this.http.post('http://127.0.0.1:5000/api/register', {
        email: email,
        password: password
      }).subscribe(data => {
        console.log(data);
      });
    }else{
      console.log("Password komt niet overeen met confirmation password");
    }

  }
}
