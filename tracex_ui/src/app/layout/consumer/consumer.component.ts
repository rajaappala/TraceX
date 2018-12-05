import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/_services/index';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Product, ProductService, UserService } from '../../shared/index';

@Component({
    selector: 'app-consumer',
    templateUrl: './consumer.component.html',
    styleUrls: ['./consumer.component.scss'],
    animations: [routerTransition()]
})
export class ConsumerComponent implements OnInit {
    constructor(private userService:UserService,
        private router: Router,
        private productService: ProductService,) {
            this.getAllUsers()
        }
    userGrid: any;
    ngOnInit() {}
    private getAllUsers() {
    this.userService.getByRole('Consumer')
        .subscribe(
            data => {
                this.userGrid = data;
                console.log(this.userGrid)
            },
            error => {
                console.log(error)
            });
    }
}
