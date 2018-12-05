import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/_services/index';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserService, ProductService } from '../../shared/index';

@Component({
    selector: 'app-retailer',
    templateUrl: './retailer.component.html',
    styleUrls: ['./retailer.component.scss'],
    animations: [routerTransition()]
})
export class RetailerComponent implements OnInit {
    constructor(private userService:UserService,
        private router: Router,
        private productService: ProductService,) {
            
        }
    userGrid: any={};

    ngOnInit() {
        this.userGrid.role = 'Retailers';
        this.getAllUsers();
    }
    private getAllUsers() {
    this.userService.getByRole('Retailer')
        .subscribe(
            data => {
                this.userGrid.data = data;
                console.log(this.userGrid)
            },
            error => {
                console.log(error)
            });
    }

}
