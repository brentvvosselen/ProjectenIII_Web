import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Parent } from '../../models/parent';
import { ParentService } from '../../services/parent.service';
import { AuthenticationService } from '../../services/authentication-service.service';
import { Cost } from '../../models/cost';
import { Cell, Row, Table } from 'ng-pdf-make/objects/table';
import { PdfmakeService } from 'ng-pdf-make';
import { MatDialog } from '@angular/material';
import { CostSetupPopupComponent } from '../cost-setup-popup/cost-setup-popup.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cost-bill-show',
  templateUrl: './cost-bill-show.component.html',
  styleUrls: ['./cost-bill-show.component.css']
})
export class CostBillShowComponent implements OnInit {

  user: User;
  currentUser: Parent;
  costBill: any = {};
  currentDate: Date;
  totalCost: number;
  mustCompleteSetup: boolean;

  constructor(private parentService: ParentService, private authenticationSerivce: AuthenticationService, private pdfmake: PdfmakeService, public dialog: MatDialog, private router: Router) {
    this.user = this.authenticationSerivce.getUser();
    this.totalCost = 0;
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.parentService.getByEmail(this.user.email).subscribe(data => {
      this.currentUser = data
      if(this.currentUser.group.finance.fintype != ""){
        this.mustCompleteSetup = true;
        console.log(this.mustCompleteSetup);
        const dialogRef = this.dialog.open(CostSetupPopupComponent, {

        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          if(result != undefined){
            this.router.navigate(["/costs/settings"]);
          }
        });
      }
    });
    this.parentService.getCostBill(this.user.email).subscribe(data => {
      this.costBill = data;
      data.costs.forEach(element => {
        this.totalCost += element.amount;
      });

       // Configure text styles  
      this.pdfmake.configureStyles({ header: { fontSize: 18, bold: true } });
    
       // Add a text with style
       this.pdfmake.addText('Dit is de afrekening van maand ' + this.currentDate.getMonth().toString(), 'header');
    
       // Add simple text
       this.pdfmake.addText('Details van de kosten');
    
    
      // Create Headers cells
      const header1 = new Cell('Titel');
      const header2 = new Cell('Beschrijving');
      const header3 = new Cell('Datum');
      const header4 = new Cell('Bedrag');
      
      // Create headers row
      const headerRows = new Row([header1, header2, header3, header4]);

      // Create a content row
      const rows = [];
      data.costs.forEach(element => {
        const row1 = new Row([new Cell(element.title), new Cell(element.description), new Cell(element.date), new Cell(element.amount)]);   
        rows.push(row1);        
      });

      // Custom  column widths
      const widths = [100, '*', 200, '*'];

      // Create table object
      const table = new Table(headerRows, rows, widths);

      // Add table to document
      this.pdfmake.addTable(table);

      // Add simple text
      this.pdfmake.addText('Totaalbedrag van de kosten: €' + this.totalCost );
      
    });


  }


  openPdf() {
    this.pdfmake.open();
  }

  printPdf() {
    this.pdfmake.print();
  }

  downloadPdf() {
    this.pdfmake.download("maandafrekening"+(this.currentDate.getMonth()+1));
  }

  downloadPdfWithName(customName: string) {
    this.pdfmake.download(customName);
  }

}
