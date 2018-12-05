import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/_services/index';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ProductService, UserService } from '../../shared/index';

@Component({
    selector: 'app-distributor',
    templateUrl: './distributor.component.html',
    styleUrls: ['./distributor.component.scss'],
    animations: [routerTransition()]
})
export class DistributorComponent implements OnInit {
    constructor(private userService:UserService,
        private router: Router,
        private productService: ProductService,) {
        }
    userGrid: any={};
    ngOnInit() {
        this.getAllUsers();
        this.userGrid.role = 'Retailers';
    }
    private getAllUsers() {
    this.userService.getByRole('Distributor')
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
