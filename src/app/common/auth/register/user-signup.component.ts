import { Component, ElementRef, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

import {Signup} from '../../../models/signup';

declare var $: any ;

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements AfterViewInit{

  errorMessages : string;
  user : Signup;
  uType : string;

    constructor(private userService : UserService, private router : Router, private route : ActivatedRoute) {
        this.errorMessages = '';
        this.user = {
            name : '',
            first_name : '',
            last_name : '',
            password : '',
            email : '',
            email_confirmation : '',
            agree_signup : '' 
        };
            this.uType = 'viewer';
    }

    ngAfterViewInit(){
        /*$.getScript('../../../../assets/js/script.js',function(){
        });
        $.getScript('../../../../assets/js/custom-file-input.js',function(){
        });
        $.getScript('../../../../assets/js/classie.js',function(){
        });
        $.getScript('../../../../assets/js/form.js',function(){
        }); */
    }

    userRegistration(form : NgForm) {
        if (form.value['name'] == undefined || form.value['name'] == '' || form.value['name'] == null) {
            $.toast({
                heading: 'Error',
                text: "Username should not be an Empty",
            // icon: 'error',
                position: 'top-right',
                stack: false,
                textAlign: 'left',
                loader : false,
                showHideTransition: 'slide'
            });
            return false;
        }

        this.userService.userRegistration(form.value)
        .subscribe(
            (data : any) => {
                if (data.success == true) {
                    // Save User Id and Token in local storage to get the values to all pages.
                    // Instead of getting and loading each page and also to restrict some pages to guest user
                    localStorage.setItem('accessToken', data.token);
                    localStorage.setItem('userId', data.id);

                    $.toast({
                        heading: 'Success',
                        text: "You have been registered successfully",
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });
                    this.router.navigate(['/']);
                } else {
                    if (data.error_code == 9001) {
                        $.toast({
                            heading: 'Success',
                            text: "You have been registered successfully, Please Verify your Account from your email address!",
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });
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
                }
            },

            (err : HttpErrorResponse) => {
                this.errorMessages = 'Oops! something went wrong...!';
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
