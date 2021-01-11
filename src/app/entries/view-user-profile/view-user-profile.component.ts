import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { UserPreferences } from '../../models/user-preferences';

declare var $:any;

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.css']
})
export class ViewUserProfileComponent implements OnInit {

  errorMessages : string;
  user_details : UserPreferences;
  member_name : string;
  member : any;
  user_profile_picture : string;  
  user_cover_picture : string;

  logged_in_userId : string;
  is_follow : number;

  constructor(private requestService: RequestService, private router: Router, private route: ActivatedRoute) {
    this.member_name = "";
    this.member = {};
    this.user_profile_picture = "../../../../assets/img/pro-img.jpg";  
    this.user_cover_picture = "../../../../assets/img/bg-image.jpg";

    this.logged_in_userId = this.requestService.userId;
    this.is_follow = 0;

    this.user_details = {
      name : "",
      gender: "",
      cover : "",
      picture : "",
      orientation : "",
      description : "",
      body_type : "",
      ethnicity : "",
      age : "",
      hair_color : "",
      breast : "",
      hair_length : "",
      breast_size : "",
      body_hair : ""
    }
  }

  ngOnInit() {
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
                  this.member = data;
                  this.user_cover_picture = data.cover;
                  this.user_profile_picture = data.picture;
                  console.log(this.member);

                  for (let val of data.followers) {
                    if(val.follower_id == this.logged_in_userId) {
                      this.is_follow = 1;
                    }
                  }

                  this.user_model_Preference_fn("userModelPreferences", {user_id:data.id});

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

  user_model_Preference_fn(url, object) {
    this.requestService.postMethod(url, object)
    .subscribe((data : any ) => {
        if (data.success == true) {
            this.user_details = data;
        } else {
            this.errorMessages = 'Oops! Something Went Wrong';
            //this.toast_message("Error", this.errorMessages);                 
        }
    },

    (err : HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';
        this.toast_message("Error", this.errorMessages);  
    });      
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
