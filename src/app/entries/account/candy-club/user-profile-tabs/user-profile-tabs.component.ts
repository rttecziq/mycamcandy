import { Component, AfterViewInit, CollectionChangeRecord } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../../common/services/user.service';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { User } from '../../../../models/user';
import { sweetTreat } from '../../../../models/sweet-treat';
import { collection } from '../../../../models/collection';

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
  sweet_treat_image : File;
  sweet_treat_featured_image : string;
  collection_image : File;
  collection_featured_image : string;
  is_content_creator : boolean;  
  isUserExists : string;
  userId : string;
  username : string;
  sweet_treat : sweetTreat;
  model_collection : collection;
  
  constructor(private userService : UserService, private requestService : RequestService, private router : Router) {
  
      this.profile_picture = null;  
      this.cover_picture = null;
      this.sweet_treat_image = null;
      this.collection_image = null;

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

    this.sweet_treat = {
        title : "",
        candies : 0,
        listing : false,
        description : "",
        featured_image : "",
        secret_note : ""
    }

    this.model_collection = {
        collection_title : "",
        collection_candies : 0,
        collection_featured_image : "",
    }
  
      this.user_profile_picture = "../../../../assets/img/pro-img.jpg";  
      this.user_cover_picture = "../../../../assets/img/bg-image.jpg";
      this.sweet_treat_featured_image = "../../../../assets/img/default-profile.jpg";
      this.collection_featured_image = "../../../../assets/img/default-profile.jpg";
  
      this.is_content_creator = true;
      this.username = (localStorage.getItem('username') != '' && localStorage.getItem('username') != null && localStorage.getItem('username') != undefined) ? localStorage.getItem('username') : '';
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

handleSweetTreat(files : FileList) {
    this.sweet_treat_image = files.item(0);
    if(!files.item(0).type.match('image')) {
        this.toast_message("Warning", "Please choose image with extensions .png, .jpg, .jpeg");  
        return false;
    }
  
    var reader = new FileReader();  
    reader.onload = (event: any) => {    
      this.sweet_treat_featured_image = event.target.result;    
    }
    reader.readAsDataURL(files.item(0));
}

handleCollection(files : FileList) {
    this.collection_image = files.item(0);
    if(!files.item(0).type.match('image')) {
        this.toast_message("Warning", "Please choose image with extensions .png, .jpg, .jpeg");  
        return false;
    }
  
    var reader = new FileReader();  
    reader.onload = (event: any) => {    
      this.collection_featured_image = event.target.result;    
    }
    reader.readAsDataURL(files.item(0));
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
  sweetTreatFormFn(form : NgForm) {
    
    if (form.value['title'] == undefined || form.value['title'] == '' || form.value['title'] == null) {
        this.toast_message("Error", "Enter Sweet treat title");
        return false;
    }

    if (form.value['candies'] == undefined || form.value['candies'] == '' || form.value['candies'] == null) {
        this.toast_message("Error", "Candies field is missing");
        return false;
    }

    if (this.sweet_treat_image !== undefined && this.sweet_treat_image !== null) {            
        form.value['featured_image'] = this.sweet_treat_image;
    } else {
        this.toast_message("Error", "Add Sweet treat featured image");
        return false;
    }
    if (form.value['listing'] === true) {
        form.value['listing'] = 0;
    } else {
        form.value['listing'] = 1;
    }

    this.requestService.postMethod('sweetTreat', form.value)
        .subscribe(
            (data : any ) => {
                if (data.success == true) {
                    this.toast_message("Success", "Sweet Treat added successfully");
                    $('#sweet_treat_model_close').click();
                    location.reload();
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

collectionFormFn(form : NgForm) {
    
    if (form.value['collection_title'] == undefined || form.value['collection_title'] == '' || form.value['collection_title'] == null) {
        this.toast_message("Error", "Enter collection title");
        return false;
    }

    if (form.value['collection_candies'] == undefined || form.value['collection_candies'] == '' || form.value['collection_candies'] == null) {
        this.toast_message("Error", "Collection candies is missing");
        return false;
    }

    if (this.collection_image !== undefined && this.collection_image !== null) {            
        form.value['collection_featured_image'] = this.collection_image;
    } else {
        this.toast_message("Error", "Add collection featured image");
        return false;
    }
        
    this.requestService.postMethod('addCollection', form.value)
        .subscribe(
            (data : any ) => {
                if (data.success == true) {
                    this.toast_message("Success", "Collection added successfully");
                    $('#collection_model_close').click();
                    this.router.navigate(['/candy-club/'+this.username+'/collection']);
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
