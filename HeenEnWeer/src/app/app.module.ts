import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ParentService } from '../app/services/parent.service';
import { FormsModule } from '@angular/forms';
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
    RouterModule.forRoot([
      { path: "login", component:LoginComponent},
      { path: "register", component:RegisterComponent},
      { path: "parents", component:ParentsListComponent},
      { path: "profiel", component:ProfielComponent},
      { path: "profiel/edit", component:ProfileEditComponent},
      { path: "", component:HomeComponent, canActivate: [AuthGuard]},
      { path: "**", redirectTo: "" },
    ])
  ],
  providers: [AuthenticationService, ParentService, UserService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
