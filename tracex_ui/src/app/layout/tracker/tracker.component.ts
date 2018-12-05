import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/_services/index';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Product, ProductService } from '../../shared/index';

@Component({
    selector: 'app-tracker',
    templateUrl: './tracker.component.html',
    styleUrls: ['./tracker.component.scss'],
    animations: [routerTransition()]
})
export class TrackerComponent implements OnInit {
    manufacture_status = 'complete'
    warehouse_status = 'active'
    distributor_status = 'disabled'
    retailer_status = 'disabled'
    product_details: any={};
    constructor(
        private router: Router,
        private productService: ProductService,
        private alertService: AlertService,
        private modalService: NgbModal){}

    ngOnInit(){}

    getProductDetails(id: string){
        this.productService.getById(id)
            .subscribe(
                data => {
                    this.product_details = data
                },
                error => {
                    this.alertService.error(error);
                });
    }
}
