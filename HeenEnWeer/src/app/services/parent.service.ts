import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Parent } from '../../app/models/parent';
import { Child } from '../models/child';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from 'angular-calendar';

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

    getInvitee(key: string){
        return this.http.get('http://127.0.0.1:5000/api/invitee/' + key).map((response: Response) => response.json());
    }

    addChild(child: Child, parent: Parent){
        return this.http.post("http://127.0.0.1:5000/api/child/"+ parent._id, child, this.jwt()).map((response: Response) => response.json());
    }

    updateChild(child: Child) {
        return this.http.post("http://127.0.0.1:5000/api/children/update", child).map((response: Response) => response.json());
    }

    saveSetup(model :any){
        return this.http.post("http://127.0.0.1:5000/api/setup", model, this.jwt()).map((response: Response) => response.json());
    }

    getEvents(email: string){
        return this.http.get("http://127.0.0.1:5000/api/calendar/getall/" + email, this.jwt()).map((response: Response) => response.json());
    }

    addEvent(model:any, email:string){
        return this.http.post("http://127.0.0.1:5000/api/calendar/event/add/" + email + model, this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}
