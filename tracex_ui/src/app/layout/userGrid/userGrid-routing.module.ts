import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGrid } from './userGrid.component';

const routes: Routes = [
    {
        path: '', component: UserGrid
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GridRoutingModule { }
