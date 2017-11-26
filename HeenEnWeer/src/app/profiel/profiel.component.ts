import { Component, OnInit, ViewChild } from '@angular/core';
import { Parent } from '../../app/models/parent';
import { User } from '../models/user';
import { ParentService } from '../services/parent.service';
import { AuthenticationService } from '../services/authentication-service.service';
import { ViewEncapsulation } from '@angular/core';
import 'rxjs/add/operator/map';
import { Image } from '../models/image';

@Component({
  selector: 'app-profiel',
  templateUrl: './profiel.component.html',
  styleUrls: ['./profiel.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfielComponent implements OnInit {
  user: User;
  parents: Parent[];

  @ViewChild('fileInput') fileInput;
  @ViewChild('preview') preview;
  codedFile: Image;

  //gebruiken van currentUser in de html voor info
  currentUser: Parent;

  constructor(private authenticationService: AuthenticationService, private parentService: ParentService) {
    this.user = authenticationService.getUser();
  }

  ngOnInit() {
    this.parentService.getByEmail(this.user.email).subscribe(user => this.currentUser = user);
  }


  getParents():void {
    this.parentService.getAll().map(response => this.parents = response);
  }

  showPreview() {
    var file = this.fileInput.nativeElement.files[0];
    console.log(file);
    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.codedFile = new Image(file.name, file.type, reader.result.split(',')[1]);
    };
  }

  addPicture() {
    this.parentService.addPicture(this.user.email, this.codedFile).subscribe(item => console.log(item));
  }
}
