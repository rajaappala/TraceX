import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WarehouseComponent } from './warehouse.component';

const routes: Routes = [
    {
        path: '', component: WarehouseComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WarehouseRoutingModule {
}
