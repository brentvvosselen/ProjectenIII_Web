import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Parent } from '../../app/models/parent';
import { Child } from '../models/child';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from 'angular-calendar';
import { Category } from '../models/category';
import { CostData } from '../costs/costs.component';
import { Image } from '../models/image';

@Injectable()
export class ParentService {
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

    constructor(private http: Http) {
    }

    getAll() {
        return this.http.get('http://127.0.0.1:5000/api/parents', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get('http://127.0.0.1:5000/api/parents' + id, this.jwt()).map((response: Response) => response.json());
    }

    getParentByEmail(email: string): Observable<Parent>{
        return this.http.get('http://127.0.0.1:5000/api/parents' + email, this.jwt()).map((response: Response) => response.json());
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
        return this.http.post("http://127.0.0.1:5000/api/calendar/event/add/" + email ,model, this.jwt()).map((response: Response) => response.json());
    }

    getCategories(email: string){
        return this.http.get("http://127.0.0.1:5000/api/category/" + email, this.jwt()).map((response: Response) => response.json());
    }

    addCategory(category: any, email:string){
        return this.http.post("http://127.0.0.1:5000/api/category/add/" + email,category, this.jwt()).map((response: Response) => response.json());
    }

    getCosts(email: string): Observable<CostData[]>{
        return this.http.get("http://127.0.0.1:5000/api/costs/" + email, this.jwt()).map((response: Response) => response.json());
    }

    addCost(cost: any, email:string){
        return this.http.post("http://127.0.0.1:5000/api/costs/addCost/" + email,cost, this.jwt()).map((response: Response) => response.json());
    }

    getCostCategories(email: string){
        return this.http.get("http://127.0.0.1:5000/api/costs/categories/" + email, this.jwt()).map((response: Response) => response.json());
    }

    addCostCategory(category: any, email:string){
        return this.http.post("http://127.0.0.1:5000/api/costs/addCategory/" + email,category, this.jwt()).map((response: Response) => response.json());
    }

    deleteEvent(email:string, id:number){
        return this.http.delete("http://127.0.0.1:5000/api/event/delete/" + email + "/"+ id , this.jwt()).map((response: Response) => response.json());
    }

    addPicture(email: string, picture: Image) {
      return this.http.post("http://127.0.0.1:5000/api/parents/picture/" + email, picture, this.jwt()).map((response: Response) => response.json());
    }

    addPictureChild(id: string, picture: Image) {
      return this.http.post("http://127.0.0.1:5000/api/children/picture/" + id, picture, this.jwt()).map((response: Response) => response.json());
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
