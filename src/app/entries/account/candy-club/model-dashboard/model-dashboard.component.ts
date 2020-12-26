import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { RequestService } from '../../../../common/services/request.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {TimeAgoPipe} from 'time-ago-pipe';

declare var $: any;

@Component({
  selector: 'app-model-dashboard',
  templateUrl: './model-dashboard.component.html',
  styleUrls: ["../../../../../assets/css/slick/slick/slick.css",
  './model-dashboard.component.css']
})
export class ModelDashboardComponent implements OnInit {
  @ViewChild('channelBtn') channelBtn;

  sliders : any[];
  errorMessages : string;
  profile_picture : string;  
  cover_picture : File;   
  is_content_creator : boolean;  
  model_id:string;
  username:string;
  total_candies:number;
  top_models:string;
  model_of_the_months:object;
  max_value:string;
  model_gift_lists:any[];
  activities:any[];
  activity_like:any[];
  likeUsers:any[];
  userId : string;
  content_comment :string;
  activity_perview_image:string;
  upload_activity_image:File;
  channel_list : any[];
  GiftErr : string;

  constructor(private requestService : RequestService, private router : Router) {
    this.sliders = [];
    this.errorMessages = '';
    this.profile_picture = null; 
    this.is_content_creator=true;
    this.total_candies=0;
    this.top_models='';
    this.model_of_the_months={};
    this.max_value='';
    this.model_gift_lists=[];
    this.model_id = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
    this.userId = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
    this.username = (localStorage.getItem('username') != '' && localStorage.getItem('username') != null && localStorage.getItem('username') != undefined) ? localStorage.getItem('username') : '';
    this.profile_picture = (localStorage.getItem('profile_picture') != '' && localStorage.getItem('profile_picture') != null && localStorage.getItem('profile_picture') != undefined) ? localStorage.getItem('profile_picture') : '';
    this.content_comment="";
    this.activities = [];
    this.activity_like = [];
    this.likeUsers = [];
    this.channel_list = [];
    this.GiftErr = "";
  }

  ngOnInit() {
    this.channel_list_fn("channel/list", "");
    this.earningFn('getTopEarning', this.model_id);
    this.model_total_candies_fn("modelTotalCandies", this.model_id);
    this.top_model_fn("topModel", this.model_id);
    this.model_giftFn("modelGiftReceiveList", this.model_id);
    this.customJs();
  }

  ngAfterViewInit(){
    let data1={type:'profile'};
    this.sliderFn('getModelSlider', data1);
    // Load Logged In User Profile    
    let data={user_id:this.userId,listActivityData:'getActivitiesList'};
      this.getActivities('userActivities',data);
  }
  openCommentImage() {
    let activity_image: HTMLElement = document.getElementsByClassName('myimage')[0] as HTMLElement;
    activity_image.click();
  }

  channel_list_fn(url, object) {
    this.requestService.getMethod(url, object)
    .subscribe(
        (data : any ) => {
            if (data.success == true) {
                this.channel_list = data.data;
                console.log(this.channel_list);
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

  addChannel(channelName, channelPrice){
    if(channelName == "" || channelPrice == ""){
      this.toast_message("Error", "Channel Name/price can not be empty");
      return;
    }

    let details = {model_id:this.model_id,channel_name:channelName,cpm:channelPrice};
    this.requestService.postMethod("channel/save", details)
    .subscribe(
        (data : any ) => {
            if (data.success == true) {
                this.toast_message("Success", "Channel saved successfully");
                this.channel_list = data.data;
                this.channelBtn.nativeElement.click();
            } else {
                this.errorMessages = data.error_message;
                this.toast_message("Error", this.errorMessages);
            }
        },
        (err : HttpErrorResponse) => {
            this.errorMessages = 'Oops! Something Went Wrong';
            this.toast_message("Error", this.errorMessages);
        }
    );
  }
   // To save the temporary file object into this variable with preview image
   handleProfilePicture(files: FileList) {
    this.upload_activity_image = files.item(0);
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
    this.activity_perview_image = event.target.result;
    }
    reader.readAsDataURL(files.item(0));

  }
  model_giftFn(url, object) {  
    this.requestService.postMethod(url, object)
      .subscribe((data : any ) => {
          if (data.success == true) { 
            this.model_gift_lists =data.data;
          } else {
            this.GiftErr = data.error_messages;
          }

      },(err : HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';
        this.toast_message("Error", this.errorMessages);
      });
  }
  top_model_fn(url, object) {  
    this.requestService.postMethod(url, object)
      .subscribe((data : any ) => {
          if (data.success == true) { 
            this.top_models =data.data;   
            // console.log(this.top_models);
          } else {
            this.errorMessages = data.error_messages;
            this.toast_message("Error", this.errorMessages);
          }

      },(err : HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';
        this.toast_message("Error", this.errorMessages);
      });
  }
  model_total_candies_fn(url, object) {  
    this.requestService.postMethod(url, object)
      .subscribe((data : any ) => {
          if (data.success == true) {  
            this.total_candies =data.data;
          } else {
            this.errorMessages = data.error_messages;
            this.toast_message("Error", this.errorMessages);
          }

      },(err : HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';
        this.toast_message("Error", this.errorMessages);
      });
}
  earningFn(url, object){
    this.requestService.postMethod(url,object) 
    .subscribe((data : any) => {
      if (data.success == true) {
        this.model_of_the_months = data.data;
        console.log(this.model_of_the_months);
      } else {
          this.errorMessages = data.error_messages;
          this.toast_message("Error", this.errorMessages);
      }
    },
      (err : HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';
        this.toast_message("Error", this.errorMessages);
    });
  }
  sliderFn(url, object) {
    this.requestService.postMethod(url,object) 
    .subscribe((data : any) => {
      if (data.success == true) {
        this.sliders = data.data;
      } else {
          this.errorMessages = data.error_messages;
          this.toast_message("Error", this.errorMessages);
      }
    },
      (err : HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';
        this.toast_message("Error", this.errorMessages);
    });
  }
  // update user comment
  updateActivities(user_activities){
    let data ={
      user_id:this.userId,
      comment_id:user_activities.id,
      content_comment:user_activities.comment_content
    }
    document.getElementById("comment_"+user_activities.id).parentElement.classList.remove("enable-edit");
    this.requestService.postMethod('updateActivities', data)
    
    .subscribe((data : any ) => {

      if (data.success == true) {
          this.toast_message("Success", "Activities updated successfully");
          this.activities = data.data;
          console.log(this.likeUsers);
      } else {
        this.errorMessages = data.error_messages;
        this.toast_message("Error", this.errorMessages);
      }
    },
    (err : HttpErrorResponse) => {
      this.errorMessages = 'Oops! Something Went Wrong';
      this.toast_message("Error", this.errorMessages);
    });
  }
  //Delete User coment Soft Delete
  deleteUserComent(id){
    let data ={
      user_id:this.userId,
      comment_id:id
    }

    this.requestService.postMethod('updateActivities', data)
    
    .subscribe((data : any ) => {

      if (data.success == true) {
          this.toast_message("Success", "Activities deleted successfully");
          this.activities = data.data;
          console.log(this.likeUsers);
      } else {
        this.errorMessages = data.error_messages;
        this.toast_message("Error", this.errorMessages);
      }
    },
    (err : HttpErrorResponse) => {
      this.errorMessages = 'Oops! Something Went Wrong';
      this.toast_message("Error", this.errorMessages);
    });
  }

  getUsers(id){
    let data ={
      user_id:this.userId,
      comment_id:id
    }
    this.requestService.postMethod('likeUsers', data)
    .subscribe((data : any ) => {

      if (data.success == true) {
          //this.toast_message("Success", "Like updated successfully");
          this.likeUsers = data.data;
         // console.log(this.likeUsers);
      } else {
        this.errorMessages = data.error_messages;
        this.toast_message("Error", this.errorMessages);
      }
    },
    (err : HttpErrorResponse) => {
      this.errorMessages = 'Oops! Something Went Wrong';
      this.toast_message("Error", this.errorMessages);
    });
  }
  userFocus(id){
    document.getElementById("focus_"+id).focus();
  }
  replyShowHide(id) {    
    
    if(document.getElementById("comment_"+id).parentElement.classList.contains('enable-edit')){
      document.getElementById("comment_"+id).parentElement.classList.remove("enable-edit");
    }else{
      document.getElementById("comment_"+id).parentElement.classList.add("enable-edit");
    }
    
  }
  editParentComment(id) {    
    document.getElementById("comment_"+id).parentElement.classList.add("enable-edit");
    
  }
  replyEditShowHide(id) {   
    
    if(document.getElementById("edit_comment_"+id).parentElement.classList.contains('enable-edit')){
      document.getElementById("edit_comment_"+id).parentElement.classList.remove("enable-edit");
      document.getElementById("pencilclose_"+id).classList.add('d-none');
      document.getElementById("pencil_"+id).classList.remove('d-none');
    }else{
      document.getElementById("edit_comment_"+id).parentElement.classList.add("enable-edit");
      document.getElementById("pencilclose_"+id).classList.remove('d-none');
      document.getElementById("pencil_"+id).classList.add('d-none');
    }

  }
  getActivities(url,object){
    this.requestService.postMethod('activities', object)
    .subscribe((data : any ) => {
      if (data.success == true) {
          //this.toast_message("Success", "Wall updated successfully");
          this.activities = data.data;
      } else {
        this.errorMessages = data.error_messages;
        this.toast_message("Error", this.errorMessages);
      }
    },

    (err : HttpErrorResponse) => {
      this.errorMessages = 'Oops! Something Went Wrong';
      this.toast_message("Error", this.errorMessages);
    });
  }
  userActivityLike(id){
    let data ={
      user_id:this.userId,
      comment_id:id
    }
    this.requestService.postMethod('activity_like', data)
    
    .subscribe((data : any ) => {

      if (data.success == true) {
          //this.toast_message("Success", "Like updated successfully");
          this.activities = data.data;
      } else {
        this.errorMessages = data.error_messages;
        this.toast_message("Error", this.errorMessages);
      }
    },
    (err : HttpErrorResponse) => {
      this.errorMessages = 'Oops! Something Went Wrong';
      this.toast_message("Error", this.errorMessages);
    });
  }
  userActivitiesChild(event){
      let data ={
        user_id:this.userId,
        comment_parent:event.target.getAttribute('data-commentid'),
        content_comment:event.target.value
    }
    this.requestService.postMethod('activities', data)
    .subscribe((data : any ) => {

      if (data.success == true) {
          this.toast_message("Success", "Wall updated successfully");
          this.activities = data.data;
      } else {
        this.errorMessages = data.error_messages;
        this.toast_message("Error", this.errorMessages);
      }
    },
    (err : HttpErrorResponse) => {
      this.errorMessages = 'Oops! Something Went Wrong';
      this.toast_message("Error", this.errorMessages);
    });
  }
  //user save activity
  userActivities(form:NgForm){
      let data ={
          user_id:this.userId,
          content_comment:form.value['content_comment'],
          activity_image:this.upload_activity_image
      }
      form.reset();
      this.activity_perview_image="";
    this.requestService.postMethod('activities', data)
    .subscribe((data : any ) => {
      if (data.success == true) {
          this.toast_message("Success", "Wall updated successfully");
          this.activities = data.data;
      } else {
        this.errorMessages = data.error_messages;
        this.toast_message("Error", this.errorMessages);
      }
    },

    (err : HttpErrorResponse) => {
      this.errorMessages = 'Oops! Something Went Wrong';
      this.toast_message("Error", this.errorMessages);
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

  customJs() {
    setTimeout (() => {
      $('.owl-carousel').slick({
        loop:true,
        autoplay:true,
        infinite: true,
        fade: true,
        speed: 500,
        prevArrow: false,
        nextArrow: false,
        pauseOnHover:false,
        autoWidth:false,
        focusOnSelect: false
      });
    }, 2000);
  }

}
