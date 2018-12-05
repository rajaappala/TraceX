import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { appConfig } from '../../app.config';
import { User } from '../_models/index';
import { HttpHeaders } from '@angular/common/http';
import { HttpOptionService } from './gethttp.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Token ' + sessionStorage.getItem('token')
  })
};

@Injectable()
export class UserService {
    constructor(private http: HttpClient,
        private optionService: HttpOptionService) { }

    getAll() {
        // console.log(sessionStorage.getItem('currentUser'));
        return this.http.get<User[]>(appConfig.apiUrl + 'users', this.optionService.getOptions());
    }
    getAllPendingSignups(){
        return this.http.get<User[]>(appConfig.apiUrl + 'users/?status=Pending', this.optionService.getOptions());
    }
    getRoles() {
        return this.http.get(appConfig.apiUrl + 'roles');
    }

    getByRole(role) {
        return this.http.get<User[]>(appConfig.apiUrl + 'users/list/'+role, this.optionService.getOptions());
    }

    getById(_id: string) {
        return this.http.get(appConfig.apiUrl + 'users/' + _id, this.optionService.getOptions());
    }

    create(user: User) {
        return this.http.post(appConfig.apiUrl + 'users', user);
    }

    approve_signup(_id: string, isApproved: boolean){
        if(isApproved===true){
            return this.http.post(appConfig.apiUrl + 'users/' + _id + '/approve_signup', {}, this.optionService.getOptions());        
        }else{
            return this.http.post(appConfig.apiUrl + 'users/' + _id + '/reject_signup', {}, this.optionService.getOptions());        
        }
    }

    update(user: User) {
        return this.http.put(appConfig.apiUrl + 'users/' + user._id, user, httpOptions);
    }

    delete(_id: string) {
        return this.http.delete(appConfig.apiUrl + 'users/' + _id, httpOptions);
    }
}
