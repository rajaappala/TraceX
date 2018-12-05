import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridRoutingModule } from './userGrid-routing.module';
import { UserGrid } from './userGrid.component';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [CommonModule, GridRoutingModule, PageHeaderModule],
    declarations: [UserGrid],
    exports: [UserGrid]
})
export class GridModule {}
