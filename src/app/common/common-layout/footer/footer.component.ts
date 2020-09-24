import { Component, ElementRef, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgModule } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppService } from '../../../app.service';
import { Constant } from '../../../constant/Constant';

declare var $:any;

const BOTTOM_MENU_LINKS = [2, 3, 4, 11, 12];

@Component({
  selector: 'common-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css',]
})
export class FooterComponent implements OnInit,AfterViewInit, OnDestroy {
  errorMessages : string;

  pages_list : any[];
  bottom_links : any[];

//   public elementRef;

    site_settings : any;
    site_logo : string;
    // errorMessages : any;
    userId : any;
    username : string;
    key_term : any;

    notifications : any[];
    notification_count : number;
    bellNotificationStatus : any;
    notifications_types : any;

  constructor(private userService : UserService, private appService : AppService, private requestService : RequestService, private router : Router, private elementRef:ElementRef) {

    
        this.site_settings = this.appService.appDetails();
        this.errorMessages = '';

        this.userId = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
        this.username = (localStorage.getItem('username') != '' && localStorage.getItem('username') != null && localStorage.getItem('username') != undefined) ? localStorage.getItem('username') : '';

        this.notifications = [];
        this.notifications_types = {
            'LIVE_STREAM_STARTED' : Constant.LIVE_STREAM_STARTED,
            'USER_FOLLOW' : Constant.USER_FOLLOW,
            'USER_JOIN_VIDEO' : Constant.USER_JOIN_VIDEO,
            'USER_GROUP_ADD' : Constant.USER_GROUP_ADD,
            'USER_GIFT' : Constant.USER_GIFT,
            'USER_TIP' : Constant.USER_TIP,
            'ALBUM_BUY' : Constant.ALBUM_BUY,
            'SWEET_TREAT_BUY' : Constant.SWEET_TREAT_BUY,
            'NEW_MESSAGE' : Constant.NEW_MESSAGE
        };
        if (this.userId) {
            this.bellNotifications();
        }

        this.notification_count = 0;

  }


  ngOnInit(){    
    this.pagesListFn('pages/footer_list', "");
}

    ngOnDestroy() {

        clearInterval(this.bellNotificationStatus);

    }

    ngAfterViewInit() {
        this.site_settings = JSON.parse(localStorage.getItem('site_settings'));

        let site_logo = (this.site_settings).filter(obj => {
            return obj.key === 'site_logo'
        });

        setTimeout(()=>{
            this.site_logo = site_logo.length > 0 ? site_logo[0].value : '';
        }, 1000);
    }
      
    closeNotification() {
        document.getElementById("bell-notification").style.display = "none";
        document.getElementById("open-button").style.display = "block";
      }

    bellNotifications() {
        this.requestService.postMethod("user/notifications", {skip : 0}) 
        .subscribe(
            (data : any) => {
                if (data.success == true) {
                    this.notifications = data.data;
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

    bellNotificationsCount() {
        this.requestService.postMethod("get/notification/count", {}) 
        .subscribe(
            (data : any) => {
                if (data.success == true) {                    
                    this.notification_count = data.count;
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

    notificationStatusChange() {
        document.getElementById("bell-notification").style.display = "block";
            document.getElementById("open-button").style.display = "none";
        if(this.notification_count > 0) {
            this.requestService.postMethod("status/notifications", {}) 
            .subscribe(
                (data : any) => {
                    this.notification_count = 0;
                    this.notifications = data.notifications;
                    // this.notifications = [...data.notifications, ...this.notifications];

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
        } else {
            console.log("Notification count "+this.notification_count);
        }
    }

  pagesListFn(url, object) {
      this.requestService.postMethod(url,object) 
          .subscribe(
              (data : any) => {
                  if (data.success == true) {
                    let content = data.data[0];                   
                    this.bottom_links = content.filter(
                        item => BOTTOM_MENU_LINKS.includes(item.id)
                    );
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

  deleteNotificationFn(notify_id, li_id) {
    this.requestService.postMethod("delete_notification", {notify_id : notify_id}) 
        .subscribe(
            (data : any) => {
                if (data.success == true) {    
                    document.getElementById("notif"+li_id).style.display = "none";
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
