import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { ConsumerRoutingModule } from './consumer-routing.module';
import { ConsumerComponent } from './consumer.component';
import { PageHeaderModule, ProductService, UserService } from './../../shared';
import { AlertService } from '../../shared/_services/index';
import { BsComponentModule } from '../bs-component/bs-component.module';
import { GridModule } from '../userGrid/userGrid.module';
import { TablesModule } from '../tables/tables.module';

@NgModule({
    imports: [CommonModule, ConsumerRoutingModule, PageHeaderModule, FormsModule, BsComponentModule, GridModule, TablesModule],
    declarations: [ConsumerComponent],
    providers: [
      AlertService, ProductService, UserService
  ],
})
export class ConsumerModule {}
