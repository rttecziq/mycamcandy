import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  }

  ngOnInit() {
    let data={type:'profile'};
    this.sliderFn('getModelSlider', data);
    this.earningFn('getTopEarning', data);
    this.model_total_candies_fn("modelTotalCandies", this.model_id);
    this.top_model_fn("topModel", this.model_id);
    this.model_giftFn("modelGiftReceiveList", this.model_id);
    this.customJs();
  }

  ngAfterViewInit(){

    // Load Logged In User Profile
    let data={user_id:this.userId,listActivityData:'getActivitiesList'};
      this.getActivities('userActivities',data);

}
  model_giftFn(url, object) {  
    this.requestService.postMethod(url, object)
      .subscribe((data : any ) => {
          if (data.success == true) { 
            this.model_gift_lists =data.data;   
            console.log(this.model_gift_lists);
          } else {
            this.errorMessages = data.error_messages;
            this.toast_message("Error", this.errorMessages);
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
    
    if(document.getElementById("comment_"+id).parentElement.classList.contains('enable-edit')){
      document.getElementById("edit_comment_"+id).parentElement.classList.remove("enable-edit");
      document.getElementById("pencil_"+id).getElementsByClassName( 'fa-close' )[0].classList.add('fa-pencil');
      document.getElementById("pencil_"+id).getElementsByClassName('fa-pencil' )[0].classList.remove('fa-close');
    }else{
      document.getElementById("edit_comment_"+id).parentElement.classList.add("enable-edit");
      document.getElementById("pencil_"+id).getElementsByClassName( 'fa-pencil' )[0].classList.add('fa-close');
      document.getElementById("pencil_"+id).getElementsByClassName( 'fa-close' )[0].classList.remove('fa-pencil');
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
          content_comment:form.value['content_comment']
      }
      form.reset();
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
