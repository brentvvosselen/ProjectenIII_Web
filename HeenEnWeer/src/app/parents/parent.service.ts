import { Injectable } from '@angular/core';
import { Parent } from './parent';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ParentService {
  private parentsUrl = 'http://localhost:5000/api/parents';
  constructor(private http: Http) { }

  // get("/api/Parents")
    getParents(): Promise<void | Parent[]> {
      return this.http.get(this.parentsUrl)
                 .toPromise()
                 .then(response => response.json() as Parent[])
                 .catch(this.handleError);
    }

    // post("/api/Parents")
    createParent(newParent: Parent): Promise<void | Parent> {
      return this.http.post(this.parentsUrl, newParent)
                 .toPromise()
                 .then(response => response.json() as Parent)
                 .catch(this.handleError);
    }

    // get("/api/Parents/:id") endpoint not used by Angular app

    // delete("/api/Parents/:id")
    deleteParent(delParentId: String): Promise<void | String> {
      return this.http.delete(this.parentsUrl + '/' + delParentId)
                 .toPromise()
                 .then(response => response.json() as String)
                 .catch(this.handleError);
    }

    // put("/api/Parents/:id")
    updateParent(putParent: Parent): Promise<void | Parent> {
      var putUrl = this.parentsUrl + '/' + putParent._id;
      return this.http.put(putUrl, putParent)
                 .toPromise()
                 .then(response => response.json() as Parent)
                 .catch(this.handleError);
    }

    private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }

}
