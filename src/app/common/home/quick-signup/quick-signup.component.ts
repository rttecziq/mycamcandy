import { Component, ElementRef, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

import {QuickSignup} from '../../../models/quick-signup';

declare var $: any ;

@Component({
  selector: 'quick-signup',
  templateUrl: './quick-signup.component.html',
  styleUrls: ['./quick-signup.component.css']
})
export class QuickSignupComponent implements AfterViewInit {
 
  errorMessages : string;
  user : QuickSignup;
  uType : string; //The user is streamer / viewer

  constructor(private userService : UserService, private router : Router, private route : ActivatedRoute) { 

      this.errorMessages = '';

      this.user = {
          name : '',
          email : '',
          password : ''
      };
          this.uType = 'viewer';
  }

  ngAfterViewInit(){
    
  }

  userRegistration(form : NgForm) {
    form.value['is_quick_signup'] = '1';

    if (form.value['name'] == undefined || form.value['name'] == '' || form.value['name'] == null) {
        this.errorMessages = 'Username field is required';
    } else if(form.value['password'] == undefined || form.value['password'] == '' || form.value['password'] == null) {
        this.errorMessages = 'Password field is required';
    } else if(form.value['email'] == undefined || form.value['email'] == '' || form.value['email'] == null) {
        this.errorMessages = 'Email field is required';
    }

    if(this.errorMessages) {
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
        this.errorMessages ='';
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

                  window.location.reload();
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

                      window.location.reload();

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
