import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../shared/index';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
            { path: 'product', loadChildren: './product/product.module#ProductModule', canActivate: [AuthGuard] },
            { path: 'manufacture', loadChildren: './manufacture/manufacture.module#ManufactureModule', canActivate: [AuthGuard] },
            { path: 'warehouse', loadChildren: './warehouse/warehouse.module#WarehouseModule', canActivate: [AuthGuard] },
            { path: 'distributor', loadChildren: './distributor/distributor.module#DistributorModule', canActivate: [AuthGuard] },
            { path: 'retailer', loadChildren: './retailer/retailer.module#RetailerModule', canActivate: [AuthGuard] },
            { path: 'tracker', loadChildren: './tracker/tracker.module#TrackerModule', canActivate: [AuthGuard] },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
