import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ParentService } from '../../services/parent.service';
import { Parent } from '../../models/parent';
import { AuthenticationService } from '../../services/authentication-service.service';
import { User } from '../../models/user';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HomeSetupPopupComponent } from '../../home/home-setup-popup/home-setup-popup.component';
import { MatDialog } from '@angular/material';
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
  mustAcceptSetup: boolean;
  everythingCompleted: boolean;
  model: any = {};

  constructor(private parentService: ParentService, private authenticationService: AuthenticationService, private location: Location, private router: Router, public dialog: MatDialog) {
    this.user = this.authenticationService.getUser();
  }

  ngOnInit() {
    this.parentService.getByEmail(this.user.email).subscribe(data => {
      this.currentUser = data;
      console.log(this.currentUser.group.finance);

      if (this.currentUser.doneSetup == false) {
        const dialogRef = this.dialog.open(HomeSetupPopupComponent, {

        });

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);

            this.router.navigate(["/setup"]);

        });
      }

      if(this.currentUser.group.finance.accepted.length > 0 && this.currentUser.group.finance.accepted.length < 2 && !this.currentUser.group.finance.accepted.includes(this.currentUser)){
        console.log(this.currentUser.group.finance);
        this.mustAcceptSetup = true;
      }else{
        this.mustAcceptSetup = false;
      }
      if(this.currentUser.group.finance.accepted.length == 0){
        this.mustCompleteSetup = true;
      }else{
        this.mustCompleteSetup = false;     
      }

      if(this.currentUser.group.finance.accepted.length == 2){
        this.everythingCompleted = true;
      }else{
        this.everythingCompleted = false;
      }
      console.log(this.everythingCompleted);
      console.log(this.mustAcceptSetup);
      console.log(this.mustCompleteSetup);
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

        console.log(this.model);
        this.currentUser.group.finance.onderhoudsBijdrage = {
          onderhoudsgerechtigde: "",
          onderhoudsplichtige: "",
          percentage: null
        };
      }
      break;
    }
  }

  setOnderhoudsbijdrage(onderhoudsbijdrage: string){
    switch(onderhoudsbijdrage){
      case "onderhoudsgerechtigde": {
        this.currentUser.group.finance.onderhoudsBijdrage.onderhoudsgerechtigde = this.currentUser._id.toString();
      };
      break;
      case "onderhoudsplichtige": {
        this.currentUser.group.finance.onderhoudsBijdrage.onderhoudsplichtige = this.currentUser._id.toString();    
      }
      break;
    }
    console.log(onderhoudsbijdrage);
  }

  edit(){
    console.log(this.currentUser.group);
    this.currentUser.group.finance.accepted.push(this.currentUser);
    switch(this.currentUser.group.finance.fintype){
      case "kindrekening": {
        this.model = {
          _id: this.currentUser.group["_id"],
          finance: {
            fintype: this.currentUser.group.finance.fintype,
            accepted: [this.currentUser._id],
            kindrekening: {
              maxBedrag: this.currentUser.group.finance.kindrekening.maxBedrag
            },
          }
        };
      }break;
      case "onderhoudsbijdrage": {
        if(this.currentUser.group.finance.onderhoudsBijdrage.onderhoudsgerechtigde == ""){
          this.model = {
            _id: this.currentUser.group["_id"],
            finance: {
              fintype: this.currentUser.group.finance.fintype,
              accepted: [this.currentUser._id],
              onderhoudsbijdrage: {
                onderhoudsplichtige: this.currentUser.group.finance.onderhoudsBijdrage.onderhoudsplichtige,
                percentage: this.currentUser.group.finance.onderhoudsBijdrage.percentage
              }
            }
          };
        }else if(this.currentUser.group.finance.onderhoudsBijdrage.onderhoudsplichtige == ""){
          this.model = {
            _id: this.currentUser.group["_id"],
            finance: {
              fintype: this.currentUser.group.finance.fintype,
              accepted: [this.currentUser._id],
              onderhoudsbijdrage: {
                onderhoudsgerechtigde: this.currentUser.group.finance.onderhoudsBijdrage.onderhoudsgerechtigde,
                percentage: this.currentUser.group.finance.onderhoudsBijdrage.percentage
              }
            }
          };
        } 
        
      }break;
    }
    this.parentService.costSetup(this.model).subscribe(data => {this.mustCompleteSetup = false});
  }

  back(){
    this.location.back();
  }

  acceptFinanceSetup(){
    console.log("aanvaard");
    this.parentService.costSetupAccept(this.currentUser).subscribe(data => {console.log(data), this.router.navigate(["/costs"])});
  }

  declineFinanceSetup(){
    console.log("geweigerd")
  }

  editFinance(){
    //this.currentUser.group.finance = null;
    this.currentUser.group.finance = {
      fintype : "",
      accepted: [this.currentUser],
      onderhoudsBijdrage: {
        onderhoudsgerechtigde: null,
        onderhoudsplichtige: null,
        percentage: 0
      },
      kindrekening: {
        maxBedrag: 0
      }
    };
    this.mustAcceptSetup = false;
    this.everythingCompleted = false;
    this.mustCompleteSetup = true;
  }
}
