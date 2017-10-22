import { BrowserModule } from '@angular/platform-browser';
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
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: "login", component:LoginComponent},
      { path: "register", component:RegisterComponent},
      { path: "parents", component:ParentsListComponent},
      { path: "profiel", component:ProfielComponent},
      { path: "profiel/edit", component:ProfileEditComponent},
      { path: "children", component:ChildInfoComponent},
      { path: "register/invite/:key", component:InviteRegisterComponent},
      { path: "", component:HomeComponent, canActivate: [AuthGuard]},
      { path: "**", redirectTo: "" },
    ])
  ],
  providers: [AuthenticationService, ParentService, UserService, AuthGuard, FormBuilder, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
