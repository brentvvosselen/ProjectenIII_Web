import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { User } from '../models/user';

@Injectable()
export class AuthenticationService {
    private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    userIsloggedIn: EventEmitter<boolean>;

    constructor(private http: Http) { 
        this.userIsloggedIn = new EventEmitter();
    }
    
    login(email: string, password: string) {
      let body = new URLSearchParams();
      body.set('email', email);
      body.set('password', password);
  
        return this.http.post("http://127.0.0.1:5000/api/login",body.toString(),{headers: this.headers})
            .map((response: Response) => {
                let validCredentials: boolean = false;
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    console.log(user);
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    validCredentials = true;
                }
                this.userIsloggedIn.emit(validCredentials);
                return user;
            });
    }

    logout(): Promise<boolean> {
        return new Promise(resolve => {
        localStorage.removeItem('currentUser');
        this.userIsloggedIn.emit(false);
        resolve(true);
        });
    }

    getUser(): User{
        return JSON.parse(localStorage.getItem('currentUser'));
    }
}