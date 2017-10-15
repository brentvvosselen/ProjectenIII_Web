import { Component, OnInit, Input } from '@angular/core';
import { Parent } from '../../../app/models/parent';
import { ParentService } from '../../services/parent.service';


@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {
  @Input() firstname: string;
  @Input() lastname: string;
  @Input() info: string;
  @Input() currentUser: Parent;

  infoNodes = new Array<infoNode>();

  constructor(private parentService: ParentService) {

  }

  ngOnInit() {
    let temp = this.info.split(';');
    for (let i of temp) {
      if(i != "") {
        let temp2 = i.split(':');
        this.addInfoNode(temp2[0].trim(), temp2[1].trim());
      }
    }
  }

  addInfoNode(name: string, value: string) {
    var node: infoNode = {
      name: name,
      value: value
    };

    this.infoNodes.push(node);
  }

  saveChanges() {
    var temp = "";
    for (let i of this.infoNodes) {
      temp = temp + i.name + ":" + i.value + ";";
    }

    this.currentUser.children[0].info = temp;
    this.parentService.update(this.currentUser).subscribe(data => {
      console.log(data);
    });
  }

  delete(obj: infoNode) {
    this.infoNodes = this.infoNodes.filter(info => info !== obj);
  }

  save(value: string, index: number) {
    this.infoNodes[index].value = value;
    this.saveChanges();
  }
}

interface infoNode {
  name: string;
  value: string;
}