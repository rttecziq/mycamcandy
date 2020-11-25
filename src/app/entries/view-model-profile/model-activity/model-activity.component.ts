import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RequestService } from '../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { User } from '../../../models/user';
import {TimeAgoPipe} from 'time-ago-pipe';
declare var $: any ;

@Component({
  selector: 'app-model-activity',
  templateUrl: './model-activity.component.html',
  styleUrls: ['./model-activity.component.css']
})
export class ModelActivityComponent implements AfterViewInit {
  
  errorMessages : string;
  user_details : User;  
  profile_picture : File;  
  cover_picture : File;  
  user_profile_picture : string;  
  user_cover_picture : string;  
  is_content_creator : boolean;
  activities:any[];
  activity_like:any[];
  likeUsers:any[];
  userId : string;
  content_comment :string;
  activity_perview_image:string;
  upload_activity_image:File;

  username : string;

  constructor(private requestService : RequestService, private router : Router, private route : ActivatedRoute) {
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
      this.userId = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
      this.user_profile_picture = "../../../../assets/img/pro-img.jpg";
      this.user_cover_picture = "../../../../assets/img/bg-image.jpg";
     
      this.is_content_creator = true;
      this.content_comment="";
      this.activities = [];
      this.activity_like = [];
      this.likeUsers = [];

      this.route.paramMap.subscribe(params => {
        this.username = params['params']['modelname'];
      });

  }

  ngAfterViewInit() {
      // Load Logged In User Profile  
    setTimeout(()=>{
        this.user_profile_fn("userDetails", "");  
    }, 1000);  
    let data={user_id:this.userId,listActivityData:'getActivitiesList', username:this.username};
    this.getActivities('userActivities',data);
  }
  
  openCommentImage() {
    let activity_image: HTMLElement = document.getElementsByClassName('myimage')[0] as HTMLElement;
    activity_image.click();
  }

// To save the temporary file object into this variable with preview image
handleProfilePicture(files: FileList) {
    this.upload_activity_image = files.item(0);
    if(!files.item(0).type.match('image')) {
      this.toast_message("Warning", "Please choose image with extensions .png, .jpg, .jpeg");
      return false;
    }

    var reader = new FileReader();  
    reader.onload = (event: any) => {    
    this.activity_perview_image = event.target.result;
    }
    reader.readAsDataURL(files.item(0));

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
            //console.log(this.likeUsers);
        } else {
            this.errorMessages = data.error_messages;
            this.toast_message("Error", this.errorMessages);
        }
    },(err : HttpErrorResponse) => {
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
            //console.log(this.likeUsers);
        } else {
            this.errorMessages = data.error_messages;
            this.toast_message("Error", this.errorMessages);
        }
    },(err : HttpErrorResponse) => {
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
            this.likeUsers = data.data;
        } else {
            this.errorMessages = data.error_messages;
            this.toast_message("Error", this.errorMessages);
        }
    },(err : HttpErrorResponse) => {
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
    },(err : HttpErrorResponse) => {
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
    },(err : HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';
        this.toast_message("Error", this.errorMessages);
    });
}
//user save activity
userActivities(form:NgForm){
    if(form.value['content_comment'] == null) {
        this.toast_message("Error", "Write something on the wall to proceed");
        return false;
    }

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
    },(err : HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';
        this.toast_message("Error", this.errorMessages);
    });
}

user_profile_fn(url, object) {  
    this.requestService.getMethod(url, object)
    .subscribe((data : any ) => {  
        if (data.success == true) {
            this.user_details = data;
            this.user_cover_picture = data.cover;  
            this.user_profile_picture = data.picture;  
            this.is_content_creator = data.is_content_creator;
        } else {  
            this.errorMessages = data.error_messages;  
            this.toast_message("Error", this.errorMessages);                      
        }
    },(err : HttpErrorResponse) => {  
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

}
