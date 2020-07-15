import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

declare var $: any ;

@Component({
    templateUrl: 'login.component.html',
    styleUrls:['./login.component.css']
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

    constructor(private userService : UserService, private router : Router, private route:ActivatedRoute, public translate : TranslateService) {
        this.errorMessages = '';
        this.uType = 'creator';        
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

    }

    userAuthentication(userName, password) {
        this.userService.userAuthentication(userName, password)
        .subscribe(

            (data : any) => {

                if (data.success == true) {
                    // Save User Id and Token in local storage to get the values to all pages.
                    // Instead of getting and loading each page and also to restrict some pages to guest user

                    localStorage.setItem('accessToken', data.token);
                    localStorage.setItem('username', data.name);
                    localStorage.setItem('profile_picture', data.picture);
                    localStorage.setItem('chat_picture', data.chat_picture);
                    localStorage.setItem('cover_picture', data.cover);
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
                    this.router.navigate(['/']); //modeldashboard

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

}