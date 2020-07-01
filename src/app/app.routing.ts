import {Routes, RouterModule} from '@angular/router';

import { CommonLayoutComponent } from './common/common-layout/common-layout.component';
import { MainLayoutComponent } from './common/common-layout/main-layout/main-layout.component';

import { ForgotPasswordComponent } from './common/auth/forgot-password/forgot-password.component';
import { LoginComponent } from './common/auth/login/login.component';
import { SocialLoginComponent } from './common/auth/social-login/login.component';
import { RegisterComponent } from './common/auth/register/register.component';
import { ChooseComponent } from './common/auth/choose/choose.component';
import { HomeComponent } from './common/home/home.component';

import { NotificationComponent } from './common/notifications/notification.component';

import { ErrorComponent } from './common/error/error.component';

import { UserSignupComponent } from './common/auth/register/user-signup.component';
// To check Login user or not
import { AuthGuard } from './common/auth/auth.guard';

const appRoutes:Routes = [

    { path: 'error', component:ErrorComponent},

    { path: '', component:CommonLayoutComponent,
        children:[
            { 
                path: '', 
                component:HomeComponent,
                canActivate: [AuthGuard],
                data: { 
                  expectedRole: 'guestUser',
                  title : "Home",
                },
            },
            {
                path: 'notifications',
                component: NotificationComponent,
                canActivate: [AuthGuard],
                data: { 
                  expectedRole: 'onlyUser',
                  title : "Notifications",
                },
            }
        ]
    },

    {path :'login', component:LoginComponent,canActivate: [AuthGuard],data : {title : "Login", expectedRole: 'onlyGuest'} },

    { path: '', component:MainLayoutComponent,
        canActivate: [AuthGuard],
        data: { 
          expectedRole: 'onlyGuest'
        },
        children:[
            { 
                path: 'signup', 
                component:UserSignupComponent,
                data : {title : "Signup"}
            },
            { 
                path: 'register', 
                component:RegisterComponent,
                data : {title : "Register"}
            },
            {
                path: 'forgot-password',
                component:ForgotPasswordComponent,
                data : {title : "Forgot Password"}
            },
            {
                path: 'choose-login',
                component:ChooseComponent,
                data : {title : "Choose Login"}
            },
            {
                path: 'social/login',
                component:SocialLoginComponent,
                data : {title : "Social Login"}
            }
        ]
    },

    { path: '',
        loadChildren: '../app/entries/entry.module#EntryModule'
    },

     { path: '**', redirectTo: '/error', pathMatch: 'full'}

];

export const routing  = RouterModule.forRoot(appRoutes);