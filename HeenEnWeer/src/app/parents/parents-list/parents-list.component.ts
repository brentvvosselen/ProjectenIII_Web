import { Component, OnInit } from '@angular/core';
import { Parent } from '../parent';
import { ParentService } from '../parent.service';
import { ParentsDetailsComponent } from '../parents-details/parents-details.component';

@Component({
  selector: 'app-parents-list',
  templateUrl: './parents-list.component.html',
  styleUrls: ['./parents-list.component.css']
})
export class ParentsListComponent implements OnInit {
    parents: Parent[]
    selectedParent: Parent

    constructor(private parentService: ParentService) { }

    ngOnInit() {
       this.parentService
        .getParents()
        .then((parents: Parent[]) => {
          this.parents = parents.map((parent) => {
            if (!parent.phone) {
              parent.phone = {
                mobile: '',
                work: ''
              }
            }
            return parent;
          });
        });
    }

    private getIndexOfParent = (parentId: String) => {
      return this.parents.findIndex((parent) => {
        return parent._id === parentId;
      });
    }

    selectParent(parent: Parent) {
      this.selectedParent = parent
    }

    createNewParent() {
      var parent: Parent = {
        name: '',
        email: '',
        phone: {
          work: '',
          mobile: ''
        }
      };

      // By default, a newly-created parent will have the selected state.
      this.selectParent(parent);
    }

    deleteParent = (parentId: String) => {
      var idx = this.getIndexOfParent(parentId);
      if (idx !== -1) {
        this.parents.splice(idx, 1);
        this.selectParent(null);
      }
      return this.parents;
    }

    addParent = (parent: Parent) => {
      this.parents.push(parent);
      this.selectParent(parent);
      return this.parents;
    }

    updateParent = (parent: Parent) => {
      var idx = this.getIndexOfParent(parent._id);
      if (idx !== -1) {
        this.parents[idx] = parent;
        this.selectParent(parent);
      }
      return this.parents;
    }
}
