import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { appConfig } from '../../app.config';
import { Product } from '../_models/index';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpOptionService {
    constructor(private http: HttpClient) {}
    getOptions(){
      return {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Token ' + sessionStorage.getItem('token')})
      };
    }
}