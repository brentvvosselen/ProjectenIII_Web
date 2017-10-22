import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-invite-register',
  templateUrl: './invite-register.component.html',
  styleUrls: ['./invite-register.component.css']
})
export class InviteRegisterComponent implements OnInit {

  key: String;


  constructor(private route: ActivatedRoute) { 
    this.route.params.subscribe(params => this.key = params.key);
    
  }

  ngOnInit() {
  }

}
