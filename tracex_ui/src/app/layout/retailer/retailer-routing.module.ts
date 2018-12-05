import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RetailerComponent } from './retailer.component';

const routes: Routes = [
    {
        path: '', component: RetailerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RetailerRoutingModule {
}
