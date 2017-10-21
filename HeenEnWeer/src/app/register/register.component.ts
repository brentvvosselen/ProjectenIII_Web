import { Component } from '@angular/core';
import { Router } from '@angular/router';
 
import { UserService } from '../../app/services/user-service.service';
 
@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html',
    styleUrls: ['./register.component.css']
})
 
export class RegisterComponent {
    model: any = {};
    loading = false;
 
    constructor(
        private router: Router,
        private userService: UserService,) { }
 
    register(email: string, password: string) {
        this.loading = true;
        if(this.model.password == this.model.confirmPassword){
            this.userService.create(this.model)
            .subscribe(
                data => {
                    // set success message and pass true paramater to persist the message after redirecting to the login page
                    //this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    //this.alertService.error(error);
                    this.loading = false;
                });
        }else{
            console.log("passwords komen niet overeen");
        }
        
    }
}