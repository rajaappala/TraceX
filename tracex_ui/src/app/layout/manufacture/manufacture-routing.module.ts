import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManufactureComponent } from './manufacture.component';

const routes: Routes = [
    {
        path: '', component: ManufactureComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManufactureRoutingModule {
}
