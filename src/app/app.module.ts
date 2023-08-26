import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CfooterComponent } from './shared/cfooter/cfooter.component';
import { SendMoneyComponent } from './send-money/send-money.component';
import { ReceipientsComponent } from './receipients/receipients.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TransactionsComponent } from './transactions/transactions.component';
import { AuthModule } from './auth/auth.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { myInterceptor } from './shared/authConfig.interceptor';
import { NgxPaginationModule } from 'ngx-pagination';
import { BnNgIdleService } from 'bn-ng-idle';
import { NgImageSliderModule } from 'ng-image-slider';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CfooterComponent,
    SendMoneyComponent,
    ReceipientsComponent,
    TransactionsComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    AuthModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [
    BnNgIdleService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: myInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
