import { Component, OnInit, Input } from '@angular/core';
import { Child } from '../../models/child';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-child-add-form',
  templateUrl: './child-add-form.component.html',
  styleUrls: ['./child-add-form.component.css']
})
export class ChildAddFormComponent implements OnInit {

  @Input() child: Child;
  @Input() public form: NgForm;
  childAddForm: FormGroup;
  constructor( private fb: FormBuilder) { }

  ngOnInit() {
    this.childAddForm = this.fb.group({
      gender: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
    });
  }

  fillChild(){
    this.child.gender = this.childAddForm.get("gender").value;
    this.child.firstname = this.childAddForm.get("firstname").value;
    this.child.lastname = this.childAddForm.get("lastname").value;
    console.log(this.child);
  }

  updateDate($event){
    this.child.birthdate = $event;
    console.log(this.child);
  }

}
