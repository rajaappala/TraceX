import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AlertService, UserService, AuthenticationService } from '../shared/_services/index';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    // constructor(public router: Router) {}

    // ngOnInit() {}

    // onLoggedin() {
    //     sessionStorage.setItem('isLoggedin', 'true');
    // }
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.email, this.model.password)
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                    localStorage.setItem('isLoggedin', 'true');
                    this.alertService.success("Sign in successful, redirecting...", true);
                },
                error => {
                    console.log(error)
                    this.alertService.error(error.error.message);
                    this.loading = false;
                });
    }
}
