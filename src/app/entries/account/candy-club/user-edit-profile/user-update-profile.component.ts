import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { UserPreferences } from '../../../../models/user-preferences';
import { Preference } from '../../../../models/preference';
import { CheckStreamerService } from '../../../../common/services/check-streamer.service';

declare var $: any ;
const COVER_PICTURE = "COVER_PICTURE";
const PROFILE_PICTURE = "PROFILE_PICTURE";

@Component({
  selector: 'app-user-update-profile',
  templateUrl: './user-update-profile.component.html',
  styleUrls: ['./user-update-profile.component.css']
})
export class UserUpdateProfileComponent implements AfterViewInit {

  resetForm() {
    $("#form3")[0].reset();
  }

  updateProfileReset() { 

  }

errorMessages : string;
user_details : UserPreferences;
profile_picture : File;
cover_picture : File;
user_profile_picture : string;
user_cover_picture : string;
is_content_creator : boolean;
fileInputs : FileList;
userId : string;
preferences : Preference;
constructor(private requestService : RequestService, private router : Router, private location : Location, private checkStreamerService :CheckStreamerService) {

    this.profile_picture = null;
    this.cover_picture = null;
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
    this.preferences = {
        gender : [],
        orientation: [],
        body_type : [],
        ethnicity : [],
        age : [],
        hair_color : [],
        breast : [],
        hair_length : [],
        breast_size : [],
        body_hair : []
    }

    this.user_profile_picture = "../../../../assets/img/default-profile.jpg";
    this.user_cover_picture = "../../../../assets/img/cover.jpg";
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
        this.user_model_Preference_fn("userModelPreferences", "");
        let user_id = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
        this.userId = user_id;
        this.model_physic_data_fn("modelPhysicData","");
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

updateDescriptionFn(form : NgForm) {
    this.requestService.postMethod('updateUserDescription', form.value)
        .subscribe(
            (data : any ) => {
                if (data.success == true) {
                    $.toast({
                        heading: 'Success',
                        text: "Description has been updated successfully",
                    // icon: 'error',
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

model_physic_data_fn(url, object) {    
  this.requestService.getMethod(url, object)
  .subscribe(
      (data : any ) => {
          if (data.success == true) {
             this.preferences = data;
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

user_model_Preference_fn(url, object) {
  this.requestService.getMethod(url, object)
      .subscribe(
          (data : any ) => {
              if (data.success == true) {
                  this.user_details = data;
                  this.user_cover_picture = data.cover;
                  this.user_profile_picture = data.picture;
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

   // To update the profile page of logged in user
   updateUserModelPreferenceFn(form : NgForm) {    
    this.requestService.postMethod('updateUserModelPreference', form.value)
        .subscribe(
            (data : any ) => {
                if (data.success == true) {
                    $.toast({
                        heading: 'Success',
                        text: "Model preferences has been updated successfully",
                    // icon: 'error',
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
