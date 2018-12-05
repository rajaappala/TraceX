import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { PageHeaderModule } from './../../shared';
import {
    TimelineComponent,
    NotificationComponent,
    ChatComponent
} from './components';
import { StatModule, AlertService, UserService, ProductService } from '../../shared';
import { MatDialogRef } from '@angular/material';
import { AlertModule } from '../../shared/_directives/alert.module';

@NgModule({
    imports: [
        CommonModule,
        PageHeaderModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        DashboardRoutingModule,
        AlertModule,
        StatModule        
    ],
    declarations: [
        DashboardComponent,
        TimelineComponent,
        NotificationComponent,
        ChatComponent        
    ],
    providers: [
      AlertService,
      UserService,
      ProductService,
  ]
})
export class DashboardModule {}
