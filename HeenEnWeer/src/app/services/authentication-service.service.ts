import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { AsyncLocalStorage } from 'angular-async-local-storage';

@Injectable()
export class AuthenticationService {
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

    constructor(private http: Http) { }
  
    
    login(email: string, password: string) {
      let body = new URLSearchParams();
      body.set('email', email);
      body.set('password', password);
  
        return this.http.post("http://127.0.0.1:5000/api/login",body.toString(),{headers: this.headers})
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    console.log(user);
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            });
    }
 
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}