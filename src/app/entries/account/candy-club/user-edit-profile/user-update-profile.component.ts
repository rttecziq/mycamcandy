import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { ModelProfile } from '../../../../models/model-profile';
import { Preference } from '../../../../models/preference';
import { CheckStreamerService } from '../../../../common/services/check-streamer.service';

declare var $: any ;
const COVER_PICTURE = "COVER_PICTURE";
const PROFILE_PICTURE = "PROFILE_PICTURE";

@Component({
  selector: 'app-user-update-profile',
  templateUrl: './user-update-profile.component.html',
  styleUrls: [/*'../../../../../assets/css/select2.min.css', */
                './user-update-profile.component.css'
            ]
})
export class UserUpdateProfileComponent implements AfterViewInit {

    config: any = {
        allowedContent: true,
        toolbar: [['Bold', 'Italic', 'Underline', '-', 'NumberedList', 'BulletedList', 'Link', '-', 'blockQuote']],
        removePlugins: 'elementspath',
        resize_enabled: false,
        extraPlugins: 'font,divarea,placeholder',
        contentsCss: ["body {font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;}"],
        autoParagraph: false,
        enterMode: 2
    };

    errorMessages : string;
    model_details : ModelProfile;
    profile_picture : File;
    cover_picture : File;
    user_profile_picture : string;
    user_cover_picture : string;
    no_of_followers : number;
    no_of_followings : number;
    description : string;
    is_content_creator : boolean;
    fileInputs : FileList;
    userId : string;
    username : string;
    general : Preference;

    resetForm() {
        $("#form3")[0].reset();
    }

constructor(private requestService : RequestService, private router : Router, private location : Location, private checkStreamerService :CheckStreamerService) {

    this.no_of_followers = 0;
    this.no_of_followings = 0;
    this.profile_picture = null;
    this.cover_picture = null;
    this.description = "";
    this.model_details = {
        
        //about
        describe_your_personality : "",
        what_kind_chat_room : "",
        turns_on_you_going : "",
        what_annoys_bed_room : "",
        who_dream_customer : "",

        //general
        zodiac_signs : "",
        height : "",
        dob : 0,
        weight : "",
        public_age : "",
        breast_size_number : "",
        public_country : "",
        breast_size_letter : "",
        language_spoken : "",
        breast_type : "",
        gender : "",
        hair_length : "",
        hair_color : "",
        shoe_size : "",
        public_hair : "",

        // sexual preferences
        orientation : "",

        // characteristics
        ethnicity : "", 
        eyes : "",

        //Fetishes & specialities
        fetishes : [],
        wish_list : "",

        // color scheme
        profile_text_color : "#000",
        profile_bg_color : "#fff",

        // category
        //category : [],

        // social media
        twitter : "",
        instagram : "",
        body_type : ""      
    }

    this.general = {
        zodiac_signs : [],
        height : [],
        birth_date : [],
        weight : [],
        public_age : [],
        breast_size_number : [],
        public_country : [],
        breast_size_letter : [],
        language_spoken : [],
        breast_type : [],
        gender : [],
        hair_length : [],
        hair_color : [],
        shoe_size : [],
        public_hair : [],
        body_type : [],
        orientation : [],
        ethnicity : [],
        eyes : [],
        fetishes : []
    }

    this.user_profile_picture = "../../../../assets/img/default-profile.jpg";
    this.user_cover_picture = "../../../../assets/img/cover.jpg";
    this.is_content_creator = true;
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
    $('select').select2();
    
     // Load Logged In User Profile
     setTimeout(()=>{
        this.user_profile_fn("userDetails", "");
        let user_id = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
        let username = (localStorage.getItem('username') != '' && localStorage.getItem('username') != null && localStorage.getItem('username') != undefined) ? localStorage.getItem('username') : '';
        this.userId = user_id;
        this.username = username;
       this.generalAccordionData_fn("model_profiles","");
     }, 1000);


 }

 openCoverFile(){
  let cover: HTMLElement = document.getElementsByClassName('mycover')[0] as HTMLElement;
  cover.click();
}

openProfileFile() {
  let profile: HTMLElement = document.getElementsByClassName('myprofile')[0] as HTMLElement;
  profile.click();
}

removeProfilePicture() {
    this.user_profile_picture = "../../../../assets/img/pro-img.jpg";
}

removeCoverPicture() {
    this.user_cover_picture = "../../../../assets/img/bg-image.jpg";
}

// To save the temporary file object into this variable with preview image
handleProfilePicture(files: FileList) {
  this.profile_picture = files.item(0);
  if(!files.item(0).type.match('image')) {
      $.toast({
          heading: 'Warning',
          text: "Please choose image with extensions .png, .jpg, .jpeg",
      // icon: 'error',
          position: 'top-right',
          stack: false,
          textAlign: 'left',
          loader : false,
          showHideTransition: 'slide'
      });
      return false;
  }

  var reader = new FileReader();  
  reader.onload = (event: any) => {    
    this.user_profile_picture = event.target.result;
  }
  reader.readAsDataURL(files.item(0));

    // upload picture
    const formData = {
        image: files.item(0),
        type: PROFILE_PICTURE
    }
    this.updateImagesFn(formData);
}

// To save the cover picture in temp object with preview image
handleCoverPicture(files : FileList) {
  this.cover_picture = files.item(0);
  if(!files.item(0).type.match('image')) {
      $.toast({
          heading: 'Warning',
          text: "Please choose image with extensions .png, .jpg, .jpeg",
          position: 'top-right',
          stack: false,
          textAlign: 'left',
          loader : false,
          showHideTransition: 'slide'
      });

      return false;

  }

  var reader = new FileReader();  
  reader.onload = (event: any) => {    
    this.user_cover_picture = event.target.result;    
  }
  reader.readAsDataURL(files.item(0));  
  // upload picture
  const formData = {
      image: files.item(0),
      type: COVER_PICTURE
  }
  this.updateImagesFn(formData);
}

updateImagesFn(formData) {
    this.requestService.postMethod('updateUserProfileImages', formData)
        .subscribe(
            (data : any ) => {
                if (data.success == true) {
                    $.toast({
                        heading: 'Success',
                        text: formData.type === COVER_PICTURE ? "Cover image has been updated successfully" : 
                        "Profile picture has been updated successfully",
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });
                } else {
                    this.errorMessages = data.error_messages;
                    $.toast({
                        heading: 'Error',
                        text: this.errorMessages,
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
                    position: 'top-right',
                    stack: false,
                    textAlign: 'left',
                    loader : false,
                    showHideTransition: 'slide'
                });

            }

        );
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

updateDescriptionFn(form : NgForm) {
    this.requestService.postMethod('updateUserDescription', form.value)
        .subscribe(
            (data : any ) => {
                if (data.success == true) {                   
                    this.toast_message("Success", "Description has been updated successfully");
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

setBackgroundColor(bgcolor) { this.model_details.profile_bg_color = bgcolor; }
setTextColor(textColor) { this.model_details.profile_text_color = textColor; }

generalAccordionData_fn(url, object) {    
  this.requestService.getMethod(url, object)
  .subscribe(
      (data : any ) => {
          if (data.success == true) {
           //  this.general = data;
            this.general.zodiac_signs        = data.data[1];
            this.general.height              = data.data[0];
            this.general.weight              = data.data[3];
            this.general.public_age          = data.data[4];
            this.general.breast_size_number  = data.data[5];
            this.general.public_country      = data.data[6];
            this.general.breast_size_letter  = data.data[7];
            this.general.language_spoken     = data.data[8];
            this.general.breast_type         = data.data[9];
            this.general.hair_length         = data.data[11];
            this.general.shoe_size           = data.data[12];
            this.general.hair_color          = data.data[13];
            this.general.public_hair         = data.data[15];
            this.general.body_type           = data.data[14];
            this.general.gender              = data.data[10];

            this.general.orientation         = data.data[16];
            this.general.ethnicity           = data.data[17];
            this.general.eyes                = data.data[18];
            this.general.fetishes            = data.data[19];
            
            if(data.model_details !== undefined && data.model_details !== null && data.model_details !== "") {
                this.model_details = data.model_details;
            }

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

user_profile_fn(url, object) {
  this.requestService.getMethod(url, object)
      .subscribe(
          (data : any ) => {
              if (data.success == true) {
                  this.description = data.description;
                  this.user_cover_picture = data.cover;
                  this.user_profile_picture = data.picture;
                  this.no_of_followings = data.no_of_followings;
                  this.no_of_followers  = data.no_of_followers;
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

   // To update the profile page of logged in user
   updateModelProfileFn(form : NgForm) {
       console.log(form.value);

    this.requestService.postMethod('updateModelProfile', form.value)
        .subscribe(
            (data : any ) => {
                if (data.success == true) {
                    this.toast_message("Success", "Model profile has been updated successfully");
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
