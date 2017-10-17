import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Parent } from '../../app/models/parent';

@Injectable()
export class ParentService {
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    constructor(private http: Http) { }

    getAll() {
        return this.http.get('http://127.0.0.1:5000/api/parents', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get('http://127.0.0.1:5000/api/parents' + id, this.jwt()).map((response: Response) => response.json());
    }

    getByEmail(email: string){
      return this.http.get('http://127.0.0.1:5000/api/parents/' + email, this.jwt()).map((response: Response) => response.json());
    }

    update(parent: Parent) {
        return this.http.post('http://127.0.0.1:5000/api/parents/edit', parent, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('http://127.0.0.1:5000/api/parents' + id, this.jwt()).map((response: Response) => response.json());
    }

    getChildren(email: string){
        return this.http.get('http://127.0.0.1:5000/api/children/' + email, this.jwt()).map((response: Response) => response.json());        
    }

    requestSecretRoute(){
        return this.http.get("http://127.0.0.1:5000/api/secret", this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}
