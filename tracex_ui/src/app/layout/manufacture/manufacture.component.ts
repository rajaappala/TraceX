import { Component, OnInit, Input } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertService,UserService,ProductService } from '../../shared';


@Component({
    selector: 'app-manufacture',
    templateUrl: './manufacture.component.html',
    styleUrls: ['./manufacture.component.scss'],
    animations: [routerTransition()]
})

export class ManufactureComponent implements OnInit {
    constructor(private userService:UserService,
                private router: Router,
                private productService: ProductService,) {
                }
    userGrid: any = {};
    ngOnInit() {
        this.userGrid.role = 'Manufacturers';
        this.getAllUsers();
    }
    private getAllUsers() {
        this.userService.getByRole('Manufacturer')
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
