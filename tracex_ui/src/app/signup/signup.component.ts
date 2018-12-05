import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { Router } from '@angular/router';
import { AlertService, UserService } from '../shared/_services/index';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    model: any = {};
    roles: any = [];
    loading = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    register() {
        this.loading = true;
        this.userService.create(this.model)
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                    this.loading = false;
                },
                error => {
                    this.alertService.error(error.error.errors[0].messages[0]);
                    this.loading = false;
                });
    }

    ngOnInit() { this.getRoles(); }
    private getRoles() {
        this.userService.getRoles()
            .subscribe(
                data => {
                    this.roles = data;
                },
                error => {
                    this.alertService.error(error.error.errors[0].messages[0]);
                    this.loading = false;
                });
    }
}
