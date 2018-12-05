import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { DistributorRoutingModule } from './distributor-routing.module';
import { DistributorComponent } from './distributor.component';
import { PageHeaderModule, UserService, ProductService } from './../../shared';
import { AlertService } from '../../shared/_services/index';
import { BsComponentModule } from '../bs-component/bs-component.module';
import { GridModule } from '../userGrid/userGrid.module';
import { TablesModule } from '../tables/tables.module';

@NgModule({
    imports: [CommonModule, DistributorRoutingModule, PageHeaderModule, FormsModule, BsComponentModule, GridModule, TablesModule],
    declarations: [DistributorComponent],
    providers: [
      AlertService, UserService, ProductService

  ],
})
export class DistributorModule {}
