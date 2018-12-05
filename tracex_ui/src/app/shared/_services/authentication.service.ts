import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../../app.config';


@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(email: string, password: string) {

        return this.http.post<any>(appConfig.apiUrl + 'users/sessions', { email: email, password: password }).map(resp => {
            let user = resp.result.user
                // login successful if there's a jwt token in the response
                if (user && resp.result.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('role', user.role);
                    sessionStorage.setItem('_id', user._id);
                    sessionStorage.setItem('name', user.username);
                    sessionStorage.setItem('token', resp.result.token);
                }

                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('token');
    }
}
