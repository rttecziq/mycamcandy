import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { RequestService } from '../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

declare var $: any ;

@Component({
  selector: 'sidebar-tabs',
  templateUrl: './sidebar-tabs.component.html',
  styleUrls: ['./sidebar-tabs.component.css']
})
export class SidebarTabsComponent implements OnInit {
  @ViewChild('messageContainer') private myScrollContainer: ElementRef;

  errorMessages : string;
  username:string;
  userId : string;
  model_name:string;
  model_id : string;
  model_description:string;
  user_profile_picture:string;
  user_cover_picture:string;

  chat_picture : string;

  no_of_followers : number;
  no_of_followings : number;
  is_follow_current_model:string;

  messages : any[];
  message_text : string;
  display : string;
  loader : boolean;
  is_message_popup_open:boolean;
  is_blocked : boolean;

  constructor(private requestService : RequestService, private router : Router,private route : ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.username = params['params']['modelname'];
      let details = {username : this.username};
      setTimeout(()=>{    
        this.count_follower_followingFn("count_follower_following",details);
    }, 1000);

  });

  this.model_name="";
  this.model_description="";
  this.chat_picture="";
  this.no_of_followers = 0;
  this.no_of_followings = 0;
  this.is_follow_current_model = "";
  this.userId = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';

  // message
  this.display='none';
  this.message_text = '';
  this.messages = [];
  this.loader = false;
  this.is_message_popup_open = false;

  }

 
  ngOnInit() {
  }

  count_follower_followingFn(url, object) {
    this.requestService.postMethod(url, object)
          .subscribe(
              (data : any ) => {  
                  if (data.success == true) {
                    console.log(data);
                      this.model_id = data.id;
                      this.model_name = data.name;
                      this.model_description = data.description;
                      this.user_cover_picture = data.cover;
                      this.user_profile_picture = data.picture;

                      this.chat_picture = data.chat_picture;
                      this.no_of_followers = data.no_of_followers;
                      this.no_of_followings = data.no_of_followings;
                      this.is_follow_current_model = data.is_follow_current_model;
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

  showMessagePopUp() {
    if(this.userId != null && this.userId != undefined && this.userId != '') {
      this.loader = true;
      this.is_message_popup_open = true;
      this.display='block';
      let data = {user_id:this.userId, model_id:this.model_id};
      this.listUserModelMessages("listUserModelMessages", data);

      setInterval(()=>{
        if( (this.is_message_popup_open) && (this.messages.length > 0) && (this.is_blocked === false) ) {
          let data = {user_id:this.userId, model_id:this.model_id};
          this.listUserModelMessages("listUserModelMessages", data);
        }
      }, 10 * 1000);

    } else {
      this.toast_message("Error", "Please login to continue");
    }
  }

  hideMessagePopUp(){
    this.is_message_popup_open = false;
    this.display='none';
  }

  listUserModelMessages(url, object) {
    this.requestService.postMethod(url, object)
      .subscribe(
          (data : any) => {
              if (data.success === true) {
                  this.messages = data.data;
                  console.log(this.messages)
                  this.is_blocked = (data.is_blocked == this.model_id) ? true : false; 
                  setTimeout(() => {
                    this.loader = false;
                    this.scrollToBottom();
                  }, 200);               
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

  actionFn(action : string){
    if( (action != '') && (action != undefined) ){
      let data = {user_id:this.userId, model_id:this.model_id, action:action};
      
      this.requestService.postMethod("banTrashUserModelMessages", data)
      .subscribe(
          (data : any) => {
              if (data.success === true) {
                this.toast_message("Success", data.message);
                if(data.message !='Message trashed') {
                  this.is_blocked = (data.is_blocked == this.model_id) ? true : false;
                }else{
                  // Message trashed
                  this.messages = [];
                }
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
  }
  
  sendMessageFormFn(form : NgForm) {
    if(form.value['message_text'] == '' || form.value['message_text'] == undefined) {
      this.toast_message("Error", "Message can't be empty");
      return false;
    } else if(this.model_id == '' || this.model_id == undefined || this.model_id == null) {
      this.toast_message("Error", "Something went wrong, please refresh page and try again");
      return false;
    } else if(this.userId== '' || this.userId == undefined || this.userId == null) {
      this.toast_message("Error", "Please login to continue");
      return false;
    }

    form.value['user_id'] = this.userId;
    form.value['model_id'] = this.model_id;
    form.value['type'] = 'um';
    // send message to api
    this.requestService.postMethod("userModelMessages", form.value)
      .subscribe(
          (data : any) => {
              if (data.success === true) {
                  this.messages = data.data;
                  this.is_blocked = (data.is_blocked == this.model_id) ? true : false;
                  console.log(this.messages)
                  form.reset();
                  setTimeout(() => {
                    this.scrollToBottom();
                  }, 200);                  
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

  deleteMsg(msg_id) {
    console.log(msg_id);
    let data = {msg_id:msg_id, model_id:this.model_id, user_id: this.userId};
    this.requestService.postMethod("deleteUserModelMessages", data)
      .subscribe(
          (data : any) => {
              if (data.success === true) {
                  this.messages = data.data;
                  console.log(data);
                  setTimeout(() => {
                    this.scrollToBottom();
                  }, 200);
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

  // To add follower
followUser(user_id) {
  let details = {follower_id : user_id};
  this.requestService.postMethod('add_follower', details)
      .subscribe(
          (data : any ) => {
              if (data.success == true) {
                this.is_follow_current_model = '1';
                this.toast_message("Success", "You have now started following the User");
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

unFollowUser(user_id, index) {
  let details = {follower_id : user_id};
  this.requestService.postMethod('remove_follower', details)
      .subscribe(
          (data : any ) => {
              if (data.success == true) {
                this.is_follow_current_model = '0';
                this.toast_message("Success", "You have now stopped following the user");
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

  scrollToBottom = () => {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

}
