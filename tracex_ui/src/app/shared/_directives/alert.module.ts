import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { AlertComponent } from './alert.component';
import { AlertService } from '../index';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        NgbDropdownModule.forRoot()
    ],
    exports:[AlertComponent],
    declarations: [AlertComponent],
    providers: [AlertService]
})
export class AlertModule {}
