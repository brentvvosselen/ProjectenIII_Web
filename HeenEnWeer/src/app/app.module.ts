import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ParentService } from './parents/parent.service';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import {AuthService} from './services/auth.service';
import { RegisterComponent } from './register/register.component';
import { ParentsDetailsComponent } from './parents/parents-details/parents-details.component';
import { ParentsListComponent } from './parents/parents-list/parents-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ParentsDetailsComponent,
    ParentsListComponent
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
      { path: "parents", component:ParentsListComponent}
    ])
  ],
  providers: [AuthService, ParentService],
  bootstrap: [AppComponent,NavbarComponent,ParentsListComponent,ParentsDetailsComponent]
})
export class AppModule { }
