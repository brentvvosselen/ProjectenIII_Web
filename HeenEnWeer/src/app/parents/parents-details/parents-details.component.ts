import { Component, OnInit, Input } from '@angular/core';
import { Parent } from '../parent';
import { ParentService } from '../parent.service';

@Component({
  selector: 'app-parents-details',
  templateUrl: './parents-details.component.html',
  styleUrls: ['./parents-details.component.css']
})
export class ParentsDetailsComponent implements OnInit {
    @Input()
    parent: Parent;

    @Input()
    createHandler: Function;
    @Input()
    updateHandler: Function;
    @Input()
    deleteHandler: Function;

    constructor (private parentService: ParentService) {}

    createParent(parent: Parent) {
      this.parentService.createParent(parent).then((newParent: Parent) => {
        this.createHandler(newParent);
      });
    }

    updateParent(parent: Parent): void {
      this.parentService.updateParent(parent).then((updatedParent: Parent) => {
        this.updateHandler(updatedParent);
      });
    }

    deleteParent(parentId: String): void {
      this.parentService.deleteParent(parentId).then((deletedParentId: String) => {
        this.deleteHandler(deletedParentId);
      });
    }

    ngOnInit(){

    }

}
