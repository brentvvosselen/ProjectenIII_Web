import { Component, OnInit, Input } from '@angular/core';
import { Parent } from '../../../app/models/parent';
import { Child } from '../../../app/models/child';
import { ParentService } from '../../services/parent.service';


@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {
  @Input() model: any = {};

  categories = new Array<category>();

  constructor(private parentService: ParentService) {

  }

  ngOnInit() {
    console.log(this.model);
    var date = new Date(this.model.birthdate);
    console.log(date);
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var myFormattedDate = day + " - " + month + " - " + year;
    this.model.birthdate = myFormattedDate;
    this.categories = this.model.categories;
    console.log(this.categories);
  }

  addInfoNode(index: number, name: string, value: string) {
    var node: infoNode = {
      name: name,
      value: value
    };

    this.categories[index].info.push(node);
  }

  saveChanges() {
    this.model.categories = this.categories;

    this.parentService.updateChild(this.model).subscribe(data => {
      console.log(data);
    });
  }

  delete(index: number, obj: infoNode) {
    this.categories[index].info = this.categories[index].info.filter(info => info !== obj);
  }

  save(catIndex: number, infoIndex: number, value: string) {
    console.log("CHANGED");
    this.categories[catIndex].info[infoIndex].value = value;
  }

  addCategorie(naam : string){
    var node: category = {
      name: naam,
      info: []
    };
    this.categories.push(node);
    this.saveChanges();
  }
}

interface category {
  name: string;
  info: infoNode[];
}

interface infoNode {
  name: string;
  value: string;
}
