import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

declare var $: any ;

@Component({
    templateUrl: 'login.component.html',
    styleUrls:[
        '../../../../assets/css/bootstrap/css/bootstrap.min.css',
        '../../../../assets/css/font-awesome/css/font-awesome.min.css',
        '../../../../assets/css/mdb.css',
        '../../../../assets/css/style.css',
        '../../../../assets/css/responsive.css',
    ]
})

export class LoginComponent implements AfterViewInit{

    // checkInput(input){
    //     console.log(input.value.length);

    //     if (input.value.length > 0) {
    //         input.className = 'active';
    //     } else {
    //         input.className = '';
    //     }
    // };
    
    errorMessages : string;

    uType : string; //The user is streamer / viewer

    fb_status : boolean;

    google_status : boolean;

    socialUrl : string;

    constructor(private userService : UserService, private router : Router, private route:ActivatedRoute, public translate : TranslateService) { 

        this.errorMessages = '';

        this.route.queryParams.subscribe(params => {

            this.uType = params['uType'];

        });

        if (this.uType == '' || this.uType == null || this.uType == undefined) {

            this.uType = 'viewer';

        }

        this.fb_status = false;

        this.google_status = false;

        this.socialUrl = this.userService.adminUrl+'social';
        
    }
        
    // After Page load below files will load for this particular page

    ngAfterViewInit(){
        /*$.getScript('../../../../assets/js/script.js',function(){
        });
        $.getScript('../../../../assets/js/custom-file-input.js',function(){
        });
        $.getScript('../../../assets/js/classie.js',function(){
        });
        $.getScript('../../../../assets/js/form.js',function(){
        }); */

        this.checkSocialLogin();

    }

    userAuthentication(userName, password) {

        this.userService.userAuthentication(userName, password)
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    // Save User Id and Token in local storage to get the values to all pages.

                    // Instead of getting and loading each page and also to restrict some pages to guest user

                    localStorage.setItem('accessToken', data.token);

                    localStorage.setItem('userId', data.id);
                    
                    $.toast({
                        heading: 'Success',
                        text: this.translate.instant('login_success'),
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });

                    // Once successfully authenticated by user, redirect home/profile page

                    this.router.navigate(['/']);

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

                this.errorMessages = 'Incorrect Username / Password';

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

    checkSocialLogin() {

        this.userService.checkSocialLogin()
            .subscribe(

                (data : any) => {

                    this.google_status =  data.google_status;

                    this.fb_status =  data.fb_status;

                },

                (err : HttpErrorResponse) => {


                    $.toast({
                        heading: 'Error',
                        text:"Oops! Something went wrong..!",
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

    socialLogin(provider) {

        window.location.href = this.socialUrl+"?provider="+provider+"&user_type="+this.uType;
    }
}