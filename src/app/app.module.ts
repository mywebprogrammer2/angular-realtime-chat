import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GlobalRequestHandlerInterceptor } from './interceptors/global-request-handler.interceptor';
import { UserService } from './dashboard/services/user.service';
import { LoginComponent } from './auth/components/login/login.component';
import { DashboardSharedModule } from './dashboard/shared/shared.module';
import { StorageService } from './services/storage.service';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { RegisterComponent } from './auth/components/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DashboardSharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalRequestHandlerInterceptor,
      multi: true
    },
    UserService,
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
