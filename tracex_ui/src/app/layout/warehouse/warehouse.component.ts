import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/_services/index';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Product, ProductService, UserService } from '../../shared/index';

@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss'],
    animations: [routerTransition()]
})
export class WarehouseComponent implements OnInit {
    constructor(private userService:UserService,
        private router: Router,
        private productService: ProductService,) {
        }
    userGrid: any={};
    ngOnInit() {
        this.userGrid.role = 'Warehouses';
        this.getAllUsers()
    }
    private getAllUsers() {
    this.userService.getByRole('Warehouse')
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
