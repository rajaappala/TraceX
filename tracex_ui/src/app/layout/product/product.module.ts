import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { PageHeaderModule, UserService } from './../../shared';
import { AlertService, ProductService } from '../../shared/_services/index';
import { BsComponentModule } from '../bs-component/bs-component.module';
import { GridModule } from '../userGrid/userGrid.module';
import { TablesModule } from '../tables/tables.module';
import {MatDialogModule,MatCardModule,MatButtonModule} from '@angular/material';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { AlertModule } from '../../shared/_directives/alert.module';

@NgModule({
    imports: [
      CommonModule,
      ProductRoutingModule, 
      PageHeaderModule, 
      FormsModule, 
      BsComponentModule, 
      GridModule, 
      TablesModule,
      AlertModule
    ],
    declarations: [ProductComponent], 
    providers: [
      AlertService,
      ProductService,
      UserService,
      NgbActiveModal
  ],
})
export class ProductModule {}
