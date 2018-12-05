import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { appConfig } from '../../app.config';
import { Product } from '../_models/index';
import { HttpOptionService } from './gethttp.service';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Token ' + sessionStorage.getItem('token')})
};

@Injectable()
export class ProductService {
    constructor(private http: HttpClient,
        private optionService: HttpOptionService){}
    
    getAll() {
        return this.http.get<Product[]>(appConfig.apiUrl + 'products', this.optionService.getOptions());
    }

    getById(_id: string) {
        return this.http.get(appConfig.apiUrl + 'products/' + _id, this.optionService.getOptions());
    }

    create(product: Product) {
        console.log(httpOptions)
        return this.http.post(appConfig.apiUrl + 'products', product, this.optionService.getOptions());
    }

    update(product: Product) {
        return this.http.put(appConfig.apiUrl + 'products/' + product._id, product, this.optionService.getOptions());
    }

    transfer(to_address: {}, product_id: string) {
        return this.http.post(appConfig.apiUrl + 'products/'+ product_id + '/transfer' , to_address, this.optionService.getOptions());
    }

    receive(product_id: string) {
        return this.http.post(appConfig.apiUrl + 'products/'+ product_id + '/receive' , {}, this.optionService.getOptions());
    }

    trace(product_id: string) {
        return this.http.get(appConfig.apiUrl + 'products/'+ product_id + '/track' , this.optionService.getOptions());
    }

    delete(_id: string) {
        return this.http.delete(appConfig.apiUrl + 'products/' + _id, this.optionService.getOptions());
    }
}
