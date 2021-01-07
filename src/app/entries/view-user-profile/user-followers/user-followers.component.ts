import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-user-followers',
  templateUrl: './user-followers.component.html',
  styleUrls: ['./user-followers.component.css']
})
export class UserFollowersComponent implements AfterViewInit {

  errorMessages : string;
  member_name : string;
  member : any;
  user_profile_picture : string;  
  user_cover_picture : string;

  logged_in_userId : string;
  is_follow : number;

  follower_details : any[];
  showFollowersLoader : boolean;
  followersSkipCount : number;
  datasAvailable : number;
  

  constructor(private requestService: RequestService, private router: Router, private route: ActivatedRoute) {
    this.member_name = "";
    this.member = {};
    this.user_profile_picture = "../../../../assets/img/pro-img.jpg";  
    this.user_cover_picture = "../../../../assets/img/bg-image.jpg";

    this.logged_in_userId = this.requestService.userId;
    this.is_follow = 0;

    this.follower_details = [];
    this.showFollowersLoader = false;
    this.followersSkipCount = 0;
    this.datasAvailable = 0;
  }
        ngAfterViewInit(){
          this.route.params.subscribe(params => {
            this.member_name = params['username'];
            let details = {name : this.member_name};
            this.model_profiles_fn("user_profile_details", details);
          });
        }
        toast_message(heading, message) {
          $.toast({
              heading: heading,
              text: message,
              position: 'top-right',
              stack: false,
              textAlign: 'left',
              loader : false,
              showHideTransition: 'slide'
          });
        }
      
        model_profiles_fn(url, object) {
          this.requestService.postMethod(url,object) 
              .subscribe(
                  (data : any) => {
                      if (data.success == true) {
                        // set default false
                        this.is_follow = 0;
                        console.log(data);
                        this.member = data;
                        this.user_cover_picture = data.cover;
                        this.user_profile_picture = data.picture;
                        this.follower_details = data.followers;
                        
                        if(this.follower_details) {
                          for (let key of this.follower_details) {
                            let value = key['follower_id'];
                            if(value == this.logged_in_userId) {
                              this.is_follow = 1;
                            }
                          }
                        }

                      } else if(data.error_messages == 'Model not found') {
                        this.router.navigate(['error']);
                      } else {
                        this.toast_message("Error", data.error_messages);  
                      }
                  },
                  (err : HttpErrorResponse) => {
                      this.errorMessages = 'Oops! Something Went Wrong';
                      this.toast_message("Error", this.errorMessages);
                  }
              );
        }

      followUser(user_id : any, index : any) {
        
          let details = {follower_id : user_id};

          this.requestService.postMethod('add_follower', details)
              .subscribe(
                  (data : any ) => {
  
                      if (data.success == true) {
                          this.follower_details[index] = data.data;
                          console.log(this.follower_details[index])
                          //this.model_profiles_fn("user_profile_details", {name:this.member_name});
                          this.toast_message("Success", "You have now started following the User, you will be notified when the User goes live");  
                      } else {
                          this.errorMessages = data.error_messages;
                          this.toast_message("Error", this.errorMessages);
                      }
  
                  },
  
                  (err : HttpErrorResponse) => {  
                      this.errorMessages = 'Oops! Something Went Wrong';
                      this.toast_message("Error", this.errorMessages);
                  }
  
              );
  
      }
  
      // REmove follower
      unFollowUser(user_id, index, is_sidebar_follow_button) {
          let details = {follower_id : user_id};

          this.requestService.postMethod('remove_follower', details)
              .subscribe(
                  (data : any ) => {
                      if (data.success == true) {
                          this.follower_details[index] = data.data;
                          console.log(this.follower_details[index]);
                          document.getElementById("unfollow"+index).style.display = "none";
                          this.model_profiles_fn("user_profile_details", {name:this.member_name});
                          this.toast_message("Success", "You have now stopped following the user, you will not get any further notifications from the User");  
                      } else {
                          this.errorMessages = data.error_messages;
                          this.toast_message("Error", this.errorMessages);
                      }  
                  },
  
                  (err : HttpErrorResponse) => {  
                      this.errorMessages = 'Oops! Something Went Wrong';
                      this.toast_message("Error", this.errorMessages);
                  }
  
              );
  
      }


      // Add follower from sidebar button
      followUserSidebar(user_id : any) {
        
        let details = {follower_id : user_id};

        this.requestService.postMethod('add_follower', details)
            .subscribe(
                (data : any ) => {
                    if (data.success == true) {
                        this.model_profiles_fn("user_profile_details", {name:this.member_name});
                        this.toast_message("Success", "You have now started following the User, you will be notified when the User goes live");  
                    } else {
                        this.errorMessages = data.error_messages;
                        this.toast_message("Error", this.errorMessages);
                    }

                },

                (err : HttpErrorResponse) => {  
                    this.errorMessages = 'Oops! Something Went Wrong';
                    this.toast_message("Error", this.errorMessages);
                }

            );

      }

      // Remove follower from sidebar button
      unFollowUserSidebar(user_id) {
        let details = {follower_id : user_id};

        this.requestService.postMethod('remove_follower', details)
            .subscribe(
                (data : any ) => {
                    if (data.success == true) {
                        this.model_profiles_fn("user_profile_details", {name:this.member_name});
                        this.toast_message("Success", "You have now stopped following the user, you will not get any further notifications from the User");  
                    } else {
                        this.errorMessages = data.error_messages;
                        this.toast_message("Error", this.errorMessages);
                    }  
                },

                (err : HttpErrorResponse) => {  
                    this.errorMessages = 'Oops! Something Went Wrong';
                    this.toast_message("Error", this.errorMessages);
                }

            );

      }

}