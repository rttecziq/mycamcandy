import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../common/services/user.service';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { User } from '../../../../models/user';
declare var $: any ;

@Component({
  selector: 'user-profile-tabs',
  templateUrl: './user-profile-tabs.component.html',
  styleUrls: ['./user-profile-tabs.component.css']
})
export class UserProfileTabsComponent implements AfterViewInit {

  errorMessages : string;

  user_details : User;
  
  profile_picture : File;
  
  cover_picture : File;
  
  user_profile_picture : string;
  
  user_cover_picture : string;
  
  is_content_creator : boolean;
  
  isUserExists : string;
  userId : string;
  
  constructor(private userService : UserService, private requestService : RequestService, private router : Router) {
  
      this.profile_picture = null;
  
      this.cover_picture = null;
      this.user_details = {
  
          name : "",
          email : "",
          cover : "",
          picture : "",
          no_of_followers : "",
          no_of_followings : "",
          total_user_amount : "",
          description : "",
          login_by : "",
          gallery_description : ""
      }
  
      this.user_profile_picture = "../../../../assets/img/pro-img.jpg";
  
      this.user_cover_picture = "../../../../assets/img/bg-image.jpg";
  
      this.is_content_creator = false;

      this.isUserExists = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
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
  
      }, 1000);
  
  }
  
  user_profile_fn(url, object) {
  
      this.requestService.getMethod(url, object)
          .subscribe(
              (data : any ) => {
  
                  if (data.success == true) {
                      this.user_details = data;
                      this.user_cover_picture = data.cover;
                      this.user_profile_picture = data.picture;
                      this.is_content_creator = data.is_content_creator;
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

  logout() {

    this.userService.userLogout()
    .subscribe(

        (data : any ) =>  {

            if (data.success == true) {

                // Remove all the items which is stored in localstorage

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

                this.router.navigate(['/']);

            } else {

                // if (data.error_code == 101 || data.error_code == 103 || data.error_code == 104) {

                    localStorage.removeItem('accessToken');

                    localStorage.removeItem('userId');

                    // localStorage.clear();

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

                    this.router.navigate(['/']);

                    return false;

                // }
                
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

            return false;
        }	
    );
}

}
