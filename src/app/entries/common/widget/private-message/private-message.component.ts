import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { Router  } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { RequestService } from '../../../../common/services/request.service';
import {TimeAgoPipe} from 'time-ago-pipe';
declare var $: any ;


@Component({
  selector: 'app-private-message',
  templateUrl: './private-message.component.html',
  styleUrls: ['./private-message.component.css']
})
export class PrivateMessageComponent implements OnInit, OnDestroy {
  
  @ViewChild('messageContainer') private myScrollContainer: ElementRef;

  errorMessages : string;
  isLoggedInUser : boolean;
  userId : string;

  //message
  messages : any[];
  message_text : string;
  display : string;
  loader : boolean;
  is_blocked : boolean;
  last_conversation : any[];
  user_list : any[];
  active_message_model : number;
  active_message_model_picture : string;
  active_message_model_username : string;

  interval : any;

  constructor(private requestService: RequestService) {

  this.isLoggedInUser  = (this.requestService.userId !='' && this.requestService.userId != undefined && this.requestService.userId != null)  ? true : false;
  this.userId = this.requestService.userId;
  this.errorMessages = '';
  
     // message
   this.display='none';
   this.message_text = '';
   this.messages = [];
   this.loader = false;
   this.last_conversation = [];
   this.user_list = [];
   this.active_message_model = 0;
   this.active_message_model_picture = '../../../../../assets/img/default-profile.jpg';
   this.active_message_model_username = '';
  }

  msgActive() {
    $('.active_msg').on('click', 'li', function() {
    $('.active_msg li.active').removeClass('active');
    $(this).addClass('active');
    });
  }

  ngOnInit() {
    this.msgActive();
    if(this.isLoggedInUser) {
      let data = {user_id:this.userId};
      this.listAllUserModelActiveMessagesFn("list_model_user_active_message", data);
    }

    this.interval = setInterval(()=>{
      if(this.messages.length > 0 && this.is_blocked === false) {
        let data = {user_id:this.userId, model_id:this.active_message_model};
        this.listUserModelMessages("listUserModelMessages", data);
      }
    }, 10 * 1000);

  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  switchMessage(user) {
    this.loader = true;
    this.active_message_model = user.user_id;
    this.active_message_model_picture = user.chat_picture;
    this.active_message_model_username = user.username;

    let data = {user_id:this.userId, model_id:this.active_message_model};
    this.listUserModelMessages("listUserModelMessages", data);
    
    this.loader = false;
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

  listAllUserModelActiveMessagesFn(url, object){
    this.requestService.postMethod(url, object)
      .subscribe(
          (data : any) => {
              if (data.success === true) {
                  this.messages = data.data.conversation;
                  this.user_list = data.user_list;
                  this.active_message_model = data.data.model_id;
                  this.active_message_model_picture = data.data.chat_picture;
                  this.active_message_model_username = data.data.username;

                  this.is_blocked = (data.is_blocked == this.active_message_model) ? true : false;

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

  sendMessageFormFn(form : NgForm) {
    if(form.value['message_text'] == '' || form.value['message_text'] == undefined) {
      this.toast_message("Error", "Message can't be empty");
      return false;
    } else if(this.active_message_model == undefined || this.active_message_model == null || this.active_message_model == 0) {
      this.toast_message("Error", "Something went wrong, please refresh page and try again");
      return false;
    } else if(this.userId== '' || this.userId == undefined || this.userId == null) {
      this.toast_message("Error", "Please login to continue");
      return false;
    }

    form.value['user_id'] = this.userId;
    form.value['model_id'] = this.active_message_model;
    form.value['type'] = 'mu';
    // send message to api
    this.requestService.postMethod("userModelMessages", form.value)
      .subscribe(
          (data : any) => {
              if (data.success === true) {
                  this.messages = data.data;
                  this.is_blocked = (data.is_blocked == this.active_message_model) ? true : false;
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

  actionFn(action : string){
    if( (action != '') && (action != undefined) ){
      let data = {user_id:this.userId, model_id:this.active_message_model, action:action};
      
      this.requestService.postMethod("banTrashUserModelMessages", data)
      .subscribe(
          (data : any) => {
              if (data.success === true) {
                this.toast_message("Success", data.message);
                if(data.message !='Message trashed') {
                  this.is_blocked = (data.is_blocked == this.active_message_model) ? true : false;
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

  listUserModelMessages(url, object) {
    this.requestService.postMethod(url, object)
      .subscribe(
          (data : any) => {
              if (data.success === true) {
                  this.messages = data.data;
                  this.is_blocked = (data.is_blocked == this.active_message_model) ? true : false; 
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

  deleteMsg(msg_id) {
    let data = {msg_id:msg_id, model_id:this.active_message_model, user_id: this.userId};
    this.requestService.postMethod("deleteUserModelMessages", data)
      .subscribe(
          (data : any) => {
              if (data.success === true) {
                  this.messages = data.data;
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

  scrollToBottom = () => {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
  
}
