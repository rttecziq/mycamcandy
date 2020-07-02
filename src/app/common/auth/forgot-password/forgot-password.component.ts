import { Component , AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

declare var $: any ;

@Component({
    templateUrl: 'forgot-password.component.html',
    styleUrls:[
        '../../../../assets/css/responsive.css',
        './forgot-password.component.css'
    ]
})

export class ForgotPasswordComponent{
    ngOnInit(){

    }

    uType : string; //The user is streamer / viewer
    errorMessages : string;

    constructor(private route:ActivatedRoute, private userService : UserService, private router : Router, public translate : TranslateService) {
        this.errorMessages = "";
        this.uType = "creator";
    }
    

    sendResetPassword(email) {
        this.userService.forgotPassword(email)
            .subscribe(
                (data : any) => {
                    if (data.success == true) {
                        $.toast({
                            heading: 'Success',
                            text: this.translate.instant('forgot_password_success'),
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });
                        this.router.navigate(['/login']);

                    } else {
                        this.errorMessages = data.error_messages;
                        $.toast({
                            heading: 'Error',
                            text: this.errorMessages,
                           // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });
                        
                    }

                },

                (err : HttpErrorResponse) => {
                    this.errorMessages = this.translate.instant('something_went_wrong');
                    $.toast({
                        heading: 'Error',
                        text: this.errorMessages,
                       // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });

                }
            );
    }
}