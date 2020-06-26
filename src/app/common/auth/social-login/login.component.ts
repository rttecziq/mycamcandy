import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

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

export class SocialLoginComponent implements AfterViewInit{


    errorMessages : string;
    
    user_id : string;

    constructor(private userService : UserService, private router : Router, private route:ActivatedRoute, private http : HttpClient) { 

        this.errorMessages = '';

        this.route.queryParams.subscribe(params => {

            this.user_id = params['id'];

            this.getUserDetails("user/view");

        });

        
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

    getUserDetails(url) {

        let formData = new FormData();

		// By Default added device type and login type in future use
		formData.append('id', this.user_id);
		formData.append('token', "");

		// By Default added device type and login type in future use
		// formData.append('login_by', );
		formData.append('device_type', "android");

		this.http.post(this.userService.apiUrl+url, formData)
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    // Save User Id and Token in local storage to get the values to all pages.

                    // Instead of getting and loading each page and also to restrict some pages to guest user

                    localStorage.setItem('accessToken', data.data.token);

                    localStorage.setItem('userId', data.data.id);
                    
                    $.toast({
                        heading: 'Success',
                        text: "You have been loggedin successfully",
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

                    this.router.navigate(['/choose-login']);
                    
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

                this.router.navigate(['/choose-login']);

            }
        );
    }

}