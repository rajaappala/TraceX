import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule }    from '@angular/forms';
import { MatDialogModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { AuthenticationService, UserService } from './shared/_services/index';
import { ProductTrackDialogComponent, ProductTransferDialogComponent, ProductRecieveDialogComponent, ProductCreateDialogComponent } from './layout/product/product.component'

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatDialogModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule
    ],
    entryComponents:[ProductTrackDialogComponent, ProductTransferDialogComponent, ProductRecieveDialogComponent, ProductCreateDialogComponent],
    declarations: [AppComponent, ProductTrackDialogComponent, ProductTransferDialogComponent, ProductRecieveDialogComponent, ProductCreateDialogComponent],
    providers: [AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {}
