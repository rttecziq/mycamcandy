import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { UserAccount } from '../../../../models/user-account';
import { Notifications } from '../../../../models/notifications';
import { CheckStreamerService } from '../../../../common/services/check-streamer.service';

declare var $: any ;

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements AfterViewInit {

errorMessages : string;

user_details : UserAccount;
notification_details : Notifications;
profile_picture : File;
cover_picture : File;
user_profile_picture : string;
is_content_creator : boolean;
fileInputs : FileList;
userId : string;
constructor(private requestService : RequestService, private router : Router, private location : Location, private checkStreamerService :CheckStreamerService) {

    this.profile_picture = null;
    this.cover_picture = null;
    this.user_details = {
        name : "",
        first_name : "",
        last_name  : "",
        email : "",
        picture : ""        
    }
    this.notification_details = {
            membership_level_change : 0,
            member_comment_reply : 0,
            member_post_comment : 0,
            guest_post_comment : 0,
            member_profile_view : 0,
            guest_profile_view : 0,
            member_topic_reply : 0,
            guest_topic_reply : 0,
            private_message : 0,
            gift_receive : 0,
            follow : 0,
            wall_post : 0,
            comment_post : 0,
            post_like : 0,
            mention_me : 0,
            email_private_message : 0,
            email_on_follow : 0
    }

    this.user_profile_picture = "../../../../assets/img/pro-img.jpg";
    this.is_content_creator = false;
}

  ngAfterViewInit(){
    /* $.getScript('../../../../assets/js/script.js',function(){
     });
     $.getScript('../../../../assets/js/custom-file-input.js',function(){
     });
     $.getScript('../../../../assets/js/classie.js',function(){
     });
     $.getScript('../../../../assets/js/form.js',function(){
     });
     $.getScript('../../../../assets/js/lightbox.min.js',function(){
     }); */

     // Load Logged In User Profile

     setTimeout(()=>{

         this.user_profile_fn("userDetails", "");
         let user_id = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';

         this.userId = user_id;
        this.user_notification_fn("notificationSetting", "");
     }, 1000);

 }

user_profile_fn(url, object) {

  this.requestService.getMethod(url, object)
      .subscribe(
          (data : any ) => {

              if (data.success == true) {
               // console.log(this.user_details);
                  this.user_details = data;
                //  console.log(this.user_details);
                  this.user_profile_picture = data.picture;

                  this.is_content_creator = data.is_content_creator;

                  this.checkStreamerService.emit({is_content_creator : data.is_content_creator, user_type : data.user_type});

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

              this.errorMessages = 'Oops! Something Went Wrong';

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

// get notification setting of logged in user

user_notification_fn(url, object) {

    this.requestService.getMethod(url, object)
        .subscribe(
            (data : any ) => {                
                if (data.success == true) {
                   this.notification_details = data;
                }  
            },
  
            (err : HttpErrorResponse) => {
  
                this.errorMessages = 'Oops! Something Went Wrong';
  
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

// Email notification setting
emailNotificationFn(form :NgForm) {

    this.requestService.postMethod('updateEmailNotification', form.value)
        .subscribe(
            (data : any ) => {
                if (data.success == true) {
                    $.toast({
                        heading: 'Success',
                        text: "Email notification has been updated successfully",
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });

                } else {

                    $.toast({
                        heading: 'Error',
                        text: 'Something went wrong, please try again',
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

                this.errorMessages = 'Oops! Something Went Wrong';

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

// Web notification setting
webNotificationFn(form :NgForm) {
    this.requestService.postMethod('updateWebNotification', form.value)
    .subscribe(
        (data : any ) => {
            if (data.success == true) {
                $.toast({
                    heading: 'Success',
                    text: "Web notification has been updated successfully",
                // icon: 'error',
                    position: 'top-right',
                    stack: false,
                    textAlign: 'left',
                    loader : false,
                    showHideTransition: 'slide'
                });

            } else {

                $.toast({
                    heading: 'Error',
                    text: 'Something went wrong, please try again',
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

            this.errorMessages = 'Oops! Something Went Wrong';

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

// To change the password of the logged in user

changePasswordFn(form : NgForm) {

    if (confirm('Are you sure ? You want to change your password? ? ')) {

        this.requestService.postMethod('changePassword', form.value)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        localStorage.removeItem('accessToken');

                        localStorage.removeItem('userId');

                        //localStorage.clear();

                        $.toast({
                            heading: 'Success',
                            text: "You have been logged out successfully",
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        if (this.is_content_creator) {

                            this.router.navigate(['/']);

                        } else {

                            this.router.navigate(['/']);
                        }

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

                    this.errorMessages = 'Oops! Something Went Wrong';

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

   // To update the profile page of logged in user

   updateProfileFn(form : NgForm) {

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

    if (form.value['first_name'] == undefined || form.value['first_name'] == '' || form.value['first_name'] == null) {

        $.toast({
            heading: 'Error',
            text: "First name should not be an Empty",
        // icon: 'error',
            position: 'top-right',
            stack: false,
            textAlign: 'left',
            loader : false,
            showHideTransition: 'slide'
        });

        return false;

    }

    if (form.value['last_name'] == undefined || form.value['last_name'] == '' || form.value['last_name'] == null) {

        $.toast({
            heading: 'Error',
            text: "Last name should not be an Empty",
        // icon: 'error',
            position: 'top-right',
            stack: false,
            textAlign: 'left',
            loader : false,
            showHideTransition: 'slide'
        });

        return false;

    }

    
    this.requestService.postMethod('updateProfile', form.value)
        .subscribe(
            (data : any ) => {

                if (data.success == true) {

                    $.toast({
                        heading: 'Success',
                        text: "Your profile has been updated successfully",
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });

                    location.reload();

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

                this.errorMessages = 'Oops! Something Went Wrong';

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

// To delete user account 
deleteAccountFn(form : NgForm) {

    if (form.value['password'] == undefined || form.value['password'] == '' || form.value['password'] == null) {

        $.toast({
            heading: 'Error',
            text: "Enter password to continue",
        // icon: 'error',
            position: 'top-right',
            stack: false,
            textAlign: 'left',
            loader : false,
            showHideTransition: 'slide'
        });

        return false;

    }

    this.requestService.postMethod('deleteUserAccount', form.value)
        .subscribe(
            (data : any ) => {

                if (data.success == true) {

                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userId');

                    $.toast({
                        heading: 'Success',
                        text: "You have been Deleted successfully",
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

            },

            (err : HttpErrorResponse) => {

                this.errorMessages = 'Oops! Something Went Wrong';

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
