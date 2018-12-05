import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { RetailerRoutingModule } from './retailer-routing.module';
import { RetailerComponent } from './retailer.component';
import { PageHeaderModule, UserService, ProductService } from './../../shared';
import { AlertService } from '../../shared/_services/index';
import { BsComponentModule } from '../bs-component/bs-component.module';
import { GridModule } from '../userGrid/userGrid.module';
import { TablesModule } from '../tables/tables.module';

@NgModule({
    imports: [CommonModule, RetailerRoutingModule, PageHeaderModule, FormsModule, BsComponentModule, GridModule, TablesModule],
    declarations: [RetailerComponent],
    providers: [
      AlertService, UserService, ProductService
  ],
})
export class RetailerModule {}
