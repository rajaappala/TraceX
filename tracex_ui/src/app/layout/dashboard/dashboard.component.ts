import { Component, OnInit, Inject } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router } from '@angular/router';
import { AlertService,UserService,ProductService } from '../../shared';
import { Product } from '../../shared/index';
import {ProductTrackDialogComponent, ProductTransferDialogComponent, ProductRecieveDialogComponent} from '../product/product.component'
import { MatDialog} from '@angular/material';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    users: Array<any> = [];
    loading = false;
    products: any = {};
    isadmin:boolean = false;
    show_transfer: boolean = false;
    role: any;
    loggedInUserId:any;
    product_details: any;
    transfer_product_info:any={};
    transferTo: any = {};
    receive_pd:any;
    private dialogRef: any;
    tx_link:string = "https://ropsten.etherscan.io/tx/";
    tx_hash:string;
    
    constructor(private userService:UserService,
        private router: Router,
        private productService: ProductService,
        private alertService: AlertService, 
        private dialog: MatDialog) {
    }

    ngOnInit() {
        this.role = sessionStorage.getItem('role');
        this.isadmin = this.role=='Admin' ? true : false
        if(this.isadmin)
        {
            this.getAllPendingSignups();
        }
        else
        {
            this.getAllProducts();
        }
    }

    private getAllPendingSignups() {
        this.userService.getAllPendingSignups()
            .subscribe(
                data => {
                    this.users = data;
                },
                error => {
                    console.log(error.error.message)
                });
    }

    private getAllProducts(){
        this.loggedInUserId = sessionStorage.getItem('_id');
        console.log(this.loggedInUserId)
        this.productService.getAll()
            .subscribe(
                data => {
                    console.log(data);
                    this.products = data;
                },
                error => {
                    console.log(error.error.message)
                    // this.alertService.error(error);
                });
    }
    showTransferProductModal(role, product_data){
        let taransferUsers;
        switch(this.role){
            case 'Manufacturer':
                taransferUsers = 'Warehouse';
                break;
            case 'Warehouse':
                taransferUsers='Distributor';
                break;
            case 'Distributor':
                taransferUsers = 'Retailer';
                break;
        }
        this.product_details = product_data;
        this.userService.getByRole(taransferUsers)
            .subscribe(
                data => {
                    let dialog = this.dialog.open(ProductTransferDialogComponent, {
                            width: '600px',
                            height: '500px',
                            data: { 
                                available_users: data,
                                product_details: product_data
                                }
                            });
                    dialog.afterClosed().subscribe(result => {
                        if(!!result){
                            this.loading = true;
                            this.transfer(result, this.product_details.id);
                            console.log('The dialog was closed');
                        }
                    });
                },
                error => {
                    console.log(error.error.message)
                });
    }
    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
    user_approval(_id: string, isApproved: boolean) {
        this.loading = true;
        this.userService.approve_signup(_id, isApproved)
            .subscribe(
                data => {
                    this.getAllPendingSignups();
                    this.loading = false;
                    if(isApproved){
                        this.alertService.success("User approval successful", true);
                    }else{
                        this.alertService.success("User regection successful", true);
                    }
                },
                error => {
                    this.getAllPendingSignups();
                    this.alertService.error(error.error.message);
                    this.loading = false;
                });
    }

    getProductDetails(id: string){
        this.loading = true;
        this.productService.getById(id)
            .subscribe(
                data => {
                    this.product_details = data
                    this.loading = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    transfer(toAddress, product_id){
        this.transfer_product_info.to_address = toAddress;
        this.productService.transfer(this.transfer_product_info, product_id)
            .subscribe(
                data => {
                    this.getAllProducts();
                    this.tx_hash = data["result"].tx;
                    this.tx_link = this.tx_link + this.tx_hash
                    this.loading = false;
                    this.alertService.success('Product transfered successfully', true);
                },
                error => {
                    this.loading = false;
                    this.alertService.error(error.error.message);
                });
    }
    showDetailsDialog(drug_data){
        this.product_details = drug_data;
        this.productService.trace(drug_data.id)
            .subscribe(
                data => {
                    let trace_details = {
                        Manufacturer : {
                            status:'disabled'
                        },
                        Warehouse: {
                            status:'disabled'
                        },
                        Distributor:{
                            status:'disabled'
                        },
                        Retailer:{
                            status:'disabled'
                        },
                    };
                    data["result"].forEach(childObj=> {
                        if(childObj.args.status == 'sent'){
                            trace_details[childObj.args.from.role].name = childObj.args.from.username
                            trace_details[childObj.args.from.role].sent_at = childObj.args.datetime
                            trace_details[childObj.args.from.role].sent_to = childObj.args.to.username
                            trace_details[childObj.args.from.role].status =  'complete'
                            }
                        else if(childObj.args.status == 'received'){
                            trace_details[childObj.args.to.role].name = childObj.args.to.username
                            trace_details[childObj.args.to.role].recieved_at = childObj.args.datetime
                            trace_details[childObj.args.to.role].sent_by = childObj.args.from.username
                            trace_details[childObj.args.to.role].status =  'active'

                        }else{
                            trace_details[childObj.args.from.role]["name"] = childObj.args.from.username
                            trace_details[childObj.args.from.role]["created_at"] = childObj.args.datetime
                            trace_details[childObj.args.from.role].status =  'active'
                        }
                     })
                    this.dialogRef = this.dialog.open(ProductTrackDialogComponent,{
                        width: '800px',
                        height: '650px',
                        data: {   
                                  product_details: this.product_details,
                                  trace_details: trace_details,
                              }
                      });
                      this.dialogRef.afterClosed().subscribe(result => {
                        console.log(result);
                        console.log('The dialog was closed');
                      });
                },
                error => {
                    this.loading = false;
                    this.alertService.error(error.error.message);
                });
    }

    showRecieveDialog(){
            let dialog = this.dialog.open(ProductRecieveDialogComponent, {
                width: '600px',
                height: '500px',
                data: { }
                });
            dialog.afterClosed().subscribe(result => {
                this.loading = true;
                this.productService.receive(result)
                .subscribe(
                    data => {
                        this.getAllProducts();
                        this.tx_hash = data["result"].tx;
                        this.tx_link = this.tx_link + this.tx_hash
                        this.loading = false;
                        this.alertService.success('Product recieved succefully', true);
                    },
                    error => {
                        this.loading = false;
                        this.alertService.error(error.error.message);
                    }
                );
            });
        }
    }