import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import {AuthService} from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpModule,
    RouterModule.forRoot([
      { path: "login", component: LoginComponent}
    ])
  ],
  providers: [AuthService],
  bootstrap: [AppComponent,NavbarComponent]
})
export class AppModule { }
