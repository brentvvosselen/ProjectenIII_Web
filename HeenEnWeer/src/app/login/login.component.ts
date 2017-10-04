import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  test: string = 'just a test';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    let sampleUser: any = {
      email: 'michael@realpython.com' as string,
      password: 'michael' as string
    };
    this.auth.register(sampleUser)
    .then((user) => {
      console.log(user.json());
    })
    .catch((err) => {
      console.log(err);
    });
    this.auth.login(sampleUser).then((user) => {
      console.log(user.json());
    })
    .catch((err) => {
      console.log(err);
    });
  }
  
}
