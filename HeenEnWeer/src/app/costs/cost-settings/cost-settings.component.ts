import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ParentService } from '../../services/parent.service';
import { Parent } from '../../models/parent';
import { AuthenticationService } from '../../services/authentication-service.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-cost-settings',
  templateUrl: './cost-settings.component.html',
  styleUrls: ['./cost-settings.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CostSettingsComponent implements OnInit {

  user: User;
  currentUser: Parent;
  mustCompleteSetup: boolean;
  model: any = {};

  constructor(private parentService: ParentService, private authenticationService: AuthenticationService) {
    this.user = this.authenticationService.getUser();
  }

  ngOnInit() {
    this.parentService.getByEmail(this.user.email).subscribe(data => {
      this.currentUser = data;
      console.log(this.currentUser.group);
      if(this.currentUser.group.finance.accepted.length == 0){
        this.mustCompleteSetup = true;
        console.log(this.mustCompleteSetup);
      }else{
        this.mustCompleteSetup = false;
        console.log(this.mustCompleteSetup);        
      }
    });
  }

  setType(value: string){
    switch(value){
      case "kindrekening": {
        this.currentUser.group.finance.fintype = "kindrekening";
        this.currentUser.group.finance.kindrekening = {maxBedrag : 0};
      }
      break;
      case "onderhoudsbijdrage": {
        this.currentUser.group.finance.fintype = "onderhoudsbijdrage";
        this.currentUser.group.finance.onderhoudsBijdrage = {
          onderhoudsgerechtigde: null,
          onderhoudsplichtige: null,
          percentage: null
        };
      }
      break;
    }

    console.log(this.currentUser.group.finance.fintype);
  }

  log(){
    console.log(this.currentUser.group.finance.kindrekening.maxBedrag);
  }

  log2(){
    console.log(this.currentUser.group.finance.onderhoudsBijdrage.percentage);
  }

  setOnderhoudsbijdrage(onderhoudsbijdrage: string){
    switch(onderhoudsbijdrage){
      case "onderhoudsgerechtigde": this.currentUser.group.finance.onderhoudsBijdrage.onderhoudsgerechtigde = this.currentUser;
      break;
      case "onderhoudsplichtige": this.currentUser.group.finance.onderhoudsBijdrage.onderhoudsplichtige = this.currentUser;
      break;
    }
    console.log(onderhoudsbijdrage);
  }

  edit(){
    console.log(this.currentUser.group.finance);
  }
}
