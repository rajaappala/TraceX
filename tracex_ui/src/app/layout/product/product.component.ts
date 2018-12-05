import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { routerTransition } from '../../router.animations';
import { Router } from '@angular/router';
import { AlertService, ProductService } from '../../shared/_services/index';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Product, UserService } from '../../shared/index';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    animations: [routerTransition()]
})
export class ProductComponent implements OnInit {
    model: any = {};
    products: any = {};
    loading = false;
    closeResult: string;
    product_details: any;
    transfer_product_info:any={};
    dialogResult:any;
    loggedInUserId:any;
    private dialogRef: any;
    tx_link:string = "https://ropsten.etherscan.io/tx/";
    tx_hash:string;
    createDialog:any;
    
    open(content) {
        this.dialogResult = this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }
    constructor(
        private router: Router,
        private productService: ProductService,
        private alertService: AlertService,
        private modalService: NgbModal,
        public dialog: MatDialog,
        private userService: UserService) { }

        openDialog(product_data): void {
            let dialog = this.dialog.open(ProductTrackDialogComponent, {
              width: '600px',
              height: '500px',
              data: {   product_details: product_data,
                        manufacture_status : 'complete',
                        warehouse_status : 'active',
                        distributor_status : 'disabled',
                        retailer_status : 'disabled'
                    }
            });
            dialog.afterClosed().subscribe(result => {
                console.log('The dialog was closed');
            });
          }
    showTransferProductModal(product_data){
            console.log(product_data)
            this.product_details = product_data;
            this.userService.getByRole("Warehouse")
            .subscribe(
                data => {
                    let dialog = this.dialog.open(ProductTransferDialogComponent, {
                        width: '600px',
                        height: '500px',
                        data: {   
                            available_users: data,
                            product_details: this.product_details
                            }
                      });
                      dialog.afterClosed().subscribe(result => {
                        console.log(result);
                        if(!!result){
                            this.loading = true;
                            if(!!result){
                                this.transfer(result, this.product_details.id);
                                console.log('The dialog was closed');
                            }
                        }
                      });
                },
                error => {
                    console.log(error)
                });
    }

    showCreateProductModal(){
        this.createDialog = this.dialog.open(ProductCreateDialogComponent, {
            width: '600px',
            height: '500px',
            data: { }
            });
            this.createDialog.afterClosed()
            .subscribe(result => {
                console.log(result);
                if(!!result){
                    // this.transfer(result, this.product_details.id);
                    this.loading = true;
                    this.addProduct(result);
                    console.log('The dialog was closed');
                }
            });
    }
    
    addProduct(prd_data) {
        // this.loading = true;
        // debugger;
        this.productService.create(prd_data)
            .subscribe(
                data => {
                    this.getAllProducts();
                    this.loading = false;
                    this.alertService.success('Product added successfully', true);
                    this.tx_hash = data["result"].tx;
                    this.tx_link = this.tx_link + this.tx_hash
                    // this.createDialog.close();
                },
                error => {
                    this.loading = false;
                    this.alertService.error(error.error.errors[0].messages[0]);
                });
    }

    ngOnInit() {
        this.getAllProducts();
    }
    private getAllProducts(){
        this.loggedInUserId = sessionStorage.getItem("_id")
        this.productService.getAll()
            .subscribe(
                data => {
                    this.products = data;
                },
                error => {
                    console.log(error)
                    // this.alertService.error(error.error.errors[0].messages[0]);
                });
    }

    showDetailsDialog(drug_data){
        this.product_details = drug_data;
        this.productService.trace(drug_data.id)
            .subscribe(
                data => {
                    console.log(data)
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
                        console.log('The dialog was closed');
                      });
                },
                error => {
                    this.alertService.error(error.error.errors[0].messages[0]);
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
                    this.loading = false;
                    this.tx_hash = data["result"].tx;
                    this.tx_link = this.tx_link + this.tx_hash
                    this.alertService.success('Product transfered successfully', true);
                },
                error => {
                    this.alertService.error(error.error.errors[0].messages[0]);
                    this.loading = false;
                });
    }


}

@Component({
    selector: 'product-track-dialog',
    templateUrl: './productTrackDialog.html',
    styleUrls: ['./product.component.scss'],
  })
  export class ProductTrackDialogComponent {

    constructor(
      public dialogRef: MatDialogRef<ProductTrackDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.dialogRef.updatePosition({ top: '50px', left: '50px' });
       }

    onNoClick(): void {
      this.dialogRef.close();

    }

  }

  @Component({
    selector: 'product-transfer-dialog',
    templateUrl: './productTransferDialog.html',
    styleUrls: ['./product.component.scss'],
  })
  export class ProductTransferDialogComponent {

    constructor(
      public dialogRef: MatDialogRef<ProductTransferDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.dialogRef.updatePosition({ top: '50px', left: '50px' });
       }

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

  @Component({
    selector: 'product-recieve-dialog',
    templateUrl: './productRecieveDialog.html',
    styleUrls: ['./product.component.scss'],
  })
  export class ProductRecieveDialogComponent {

    constructor(
      public dialogRef: MatDialogRef<ProductRecieveDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.dialogRef.updatePosition({ top: '50px', left: '50px' });
       }

    onNoClick(): void {
      this.dialogRef.close();
    }

  }

  @Component({
    selector: 'product-create-dialog',
    templateUrl: './productCreateDialog.html',
    styleUrls: ['./product.component.scss'],
  })
  export class ProductCreateDialogComponent {

    constructor(
      public dialogRef: MatDialogRef<ProductCreateDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.dialogRef.updatePosition({ top: '50px', left: '50px' });
       }

    onNoClick(): void {
      this.dialogRef.close();
    }

  }
