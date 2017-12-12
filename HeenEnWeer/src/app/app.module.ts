import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ParentService } from '../app/services/parent.service';
import { FormsModule, FormControl, FormBuilder,ReactiveFormsModule  } from '@angular/forms';
import { AppComponent } from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ParentsDetailsComponent } from './parents/parents-details/parents-details.component';
import { ParentsListComponent } from './parents/parents-list/parents-list.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationService } from "../app/services/authentication-service.service";
import { UserService } from "../app/services/user-service.service";
import { LocalStorageModule } from 'angular-2-local-storage';
import { AuthGuard } from '../app/guards/auth-guard.guard';
import { ProfielComponent } from './profiel/profiel.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileEditComponent } from './profiel/profile-edit/profile-edit.component';
import { ChildInfoComponent } from './child-info/child-info.component';
import { ChildComponent } from './child-info/child/child.component';
import { InviteRegisterComponent } from './invite-register/invite-register.component';
import { SetupComponent } from './setup/setup.component';
import { ChildAddComponent } from './child-info/child-add/child-add.component';
import { FormWizardModule } from 'angular2-wizard';
import { ChildAddFormComponent } from './setup/child-add-form/child-add-form.component';
import {MatDatepickerModule, MatNativeDateModule} from '@angular/material';
import { ChildEditComponent } from './child-info/child-edit/child-edit.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule } from 'angular-calendar';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DemoUtilsModule } from './demo-utils/module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarAddComponent } from './calendar/calendar-add/calendar-add.component'; 
import { ColorPickerModule } from 'ngx-color-picker';
import { CostsComponent } from './costs/costs.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatTableModule } from "@angular/material/table";
import {CdkTableModule} from '@angular/cdk/table';
import { CostAddComponent } from './costs/cost-add/cost-add.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import {MatSelectModule} from '@angular/material';
import { CategoryAddComponent } from './calendar/category-add/category-add.component';
import { CostDetailComponent } from './costs/cost-detail/cost-detail.component';
import { DayShowComponent } from './calendar/day-show/day-show.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CostsPayComponent } from './costs/costs-pay/costs-pay.component';
import { CostSettingsComponent } from './costs/cost-settings/cost-settings.component';
import { CostBillShowComponent } from './costs/cost-bill-show/cost-bill-show.component';
import { PdfmakeModule, PdfmakeService } from 'ng-pdf-make';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ParentsDetailsComponent,
    ParentsListComponent,
    HomeComponent,
    ProfielComponent,
    NavbarComponent,
    ProfileEditComponent,
    ChildInfoComponent,
    ChildComponent,
    InviteRegisterComponent,
    SetupComponent,
    ChildAddComponent,
    ChildAddFormComponent,
    ChildEditComponent,
    CalendarComponent,
    CalendarAddComponent,
    CostsComponent,
    PageNotFoundComponent,
    CostAddComponent,
    CategoryAddComponent,
    CostDetailComponent,
    DayShowComponent,
    CostsPayComponent,
    CostSettingsComponent,
    CostBillShowComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FormWizardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    NgbModalModule.forRoot(),
    CalendarModule.forRoot(),
    DemoUtilsModule,
    ColorPickerModule,
    MatTableModule,
    CdkTableModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    RouterModule.forRoot([
      { path: "login", component:LoginComponent},
      { path: "register", component:RegisterComponent},
      { path: "parents", component:ParentsListComponent, canActivate: [AuthGuard]},
      { path: "profiel", component:ProfielComponent, canActivate: [AuthGuard]},
      { path: "profiel/edit", component:ProfileEditComponent, canActivate: [AuthGuard]},
      { path: "children", component:ChildInfoComponent, canActivate: [AuthGuard]},
      { path: "children/add", component:ChildAddComponent, canActivate: [AuthGuard]},
      { path: "register/invite/:key", component:InviteRegisterComponent},
      { path: "calendar", component:CalendarComponent, canActivate: [AuthGuard]},
      { path: "calendar/add", component:CalendarAddComponent, canActivate: [AuthGuard]},
      { path: "costs", component:CostsComponent, canActivate: [AuthGuard]},
      { path: "costs/add", component:CostAddComponent, canActivate: [AuthGuard]},
      { path: "costs/costBill", component:CostBillShowComponent, canActivate: [AuthGuard]},      
      { path: "costs/settings", component:CostSettingsComponent, canActivate: [AuthGuard]},
      { path: "setup", component:SetupComponent, canActivate: [AuthGuard]},
      { path: "", component:HomeComponent, canActivate: [AuthGuard]},
      { path: "home", component:HomeComponent, canActivate: [AuthGuard]},      
      { path: "**", component:PageNotFoundComponent},
    ])
  ],
  providers: [AuthenticationService, ParentService, UserService, AuthGuard, FormBuilder,     PdfmakeService, ],
  bootstrap: [AppComponent],
  entryComponents: [CategoryAddComponent, CostDetailComponent, DayShowComponent, CostsPayComponent]  
})
export class AppModule { }
