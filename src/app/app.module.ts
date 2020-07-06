import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { routing } from './app.routing';

import {AppService} from './app.service';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { CommonComponent } from './common/common.component';
import { CommonLayoutComponent } from './common/common-layout/common-layout.component';
import { MainLayoutComponent } from './common/common-layout/main-layout/main-layout.component';
import { HeaderComponent } from './common/common-layout/header/header.component';
import { FooterComponent } from './common/common-layout/footer/footer.component';
import { SidebarComponent } from './common/common-layout/sidebar/sidebar.component';

import { ForgotPasswordComponent } from './common/auth/forgot-password/forgot-password.component';
import { LoginComponent } from './common/auth/login/login.component';
import { SocialLoginComponent } from './common/auth/social-login/login.component';
import { RegisterComponent } from './common/auth/register/register.component';
import { ChooseComponent } from './common/auth/choose/choose.component';

import { HomeComponent } from './common/home/home.component';

import { NotificationComponent } from './common/notifications/notification.component';

// User Service
import { UserService } from  './common/services/user.service';

// Request Service
import { RequestService } from  './common/services/request.service';

import { TitleService } from  './common/services/title.service';

// Streamer Service

import { CheckStreamerService } from './common/services/check-streamer.service';

// To check Login user or not
import { AuthGuard } from './common/auth/auth.guard';

// Dependancy modules for formsand request
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FormsModule} from '@angular/forms';

// For Translation
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// sample controller
import { ErrorComponent } from './common/error/error.component';
import { UserSignupComponent } from './common/auth/register/user-signup.component';
import { QuickSignupComponent } from './common/home/quick-signup/quick-signup.component';
import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    CommonLayoutComponent,
    MainLayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ChooseComponent,
    CommonComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    HomeComponent,
    ErrorComponent,
    SocialLoginComponent,
    NotificationComponent,
    UserSignupComponent,
    QuickSignupComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    routing,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxEmojiPickerModule.forRoot()
  ],
  providers: [AppService, UserService, RequestService, AuthGuard, TitleService, CheckStreamerService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
