//import { Component, OnInit } from '@angular/core';
import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { exit } from 'process';

declare var $: any ;
const userId = 'userId';
@Component({
  selector: 'app-header-login',
  templateUrl: './header-login.component.html',
  styleUrls: ['../../../../assets/css/header/header.css']
})
export class HeaderLoginComponent implements AfterViewInit {

  errorMessages : string;

    uType : string; //The user is streamer / viewer

    fb_status : boolean;

    google_status : boolean;

    socialUrl : string;

    constructor(private userService : UserService, private router : Router, private route:ActivatedRoute, public translate : TranslateService) { 

        this.errorMessages = '';

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

    isLogged() {
        return localStorage.getItem(userId) != null;
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
                    // reload page or redirect.
                    window.location.reload();
                    //this.router.navigate(['/']);

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
