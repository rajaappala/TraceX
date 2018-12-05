import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumerComponent } from './consumer.component';

const routes: Routes = [
    {
        path: '', component: ConsumerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsumerRoutingModule {
}
