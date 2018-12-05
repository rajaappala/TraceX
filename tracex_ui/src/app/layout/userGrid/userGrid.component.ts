import { Component, OnInit, Input } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'user-grid',
    templateUrl: './userGrid.component.html',
    styleUrls: ['./userGrid.component.scss'],
    animations: [routerTransition()]
})
export class UserGrid implements OnInit {
    constructor() {}
    @Input() userGrid: any;
    ngOnInit() {}
}
