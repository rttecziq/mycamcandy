import { Component, ElementRef, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgModule } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppService } from '../../../app.service';
import { Constant } from '../../../constant/Constant';

declare var $: any

@Component({
    selector: 'common-header',
    templateUrl: 'header.component.html',
    styleUrls:['./header.component.css',
               '../../../../assets/css/style.css'],
    host: {
        '(document:click)': 'onClick($event)',
    },
})

export class HeaderComponent implements AfterViewInit, OnDestroy{
    public elementRef;

    site_settings : any;
    site_logo : string;
    errorMessages : any;
    userId : any;
    username : string;
    key_term : any;

    notifications : any[];
    notification_count : number;
    bellNotificationStatus : any;
    notifications_types : any;

    constructor(private userService : UserService, private appService : AppService, public  router : Router, myElement: ElementRef, private requestService : RequestService) {      

        this.elementRef = myElement;
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

    toggleMenu(){
            $('.toggle-wrap').on('click', function() {
              $(this).toggleClass('active');
              $('aside').animate({width: 'toggle'}, 200);
              $("#custom_header_mcc").removeClass("h-100");
              $("#myNavbar").removeClass("in");
            });
    }
    
    menuHeight(){
        $("#login-or-menu").click(function(){
            $("#custom_header_mcc").toggleClass("h-100");
            $("aside").css("display","none");
            $(".toggle-wrap").removeClass("active");
          });
    }
    
    liActive(){
        $('aside').on('click', 'li', function() {
            $('li.active').removeClass('active');
            $(this).addClass('active');
      });
    }

    headerDropdown(){
        $('.dropdown-submenu a.test').on("click", function(e){
            $(this).next('ul').toggle();
            e.stopPropagation();
            e.preventDefault();
          });
    }

    searchbox(){
        $("#search-menu").click(function(){
            $("#searchbox").toggleClass("search-hide");
          });
    }
   
    ngOnDestroy() {

    //    clearInterval(this.bellNotificationStatus);

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

    onClick(event) {        
        $("#search_results").val("");
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

    // logout
    logout() {

		this.userService.userLogout()
		.subscribe(

			(data : any ) =>  {

				if (data.success == true) {

                    // Remove all the items which is stored in localstorage
                    localStorage.removeItem('accessToken');                    
                    localStorage.removeItem('userId');
                    localStorage.removeItem('username');
                    localStorage.removeItem('profile_picture');
                    localStorage.removeItem('chat_picture');
                    localStorage.removeItem('cover_picture');

					//localStorage.clear();

					$.toast({
                        heading: 'Success',
                        text: "You have been logged out successfully",
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });
                    location.reload();
                    //this.router.navigate(['/']);

                } else {

                	// if (data.error_code == 101 || data.error_code == 103 || data.error_code == 104) {

                		localStorage.removeItem('accessToken');

	                    localStorage.removeItem('userId');

						// localStorage.clear();

						$.toast({
							heading: 'Success',
							text: "You have been logged out successfully",
						// icon: 'error',
							position: 'top-right',
							stack: false,
							textAlign: 'left',
							loader : false,
							showHideTransition: 'slide'
						});

	                    this.router.navigate(['/']);

	                    return false;

                	// }
                    
                }

			},

			(err : HttpErrorResponse) => {

				this.errorMessages = 'Incorrect Username / Password';

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

				return false;
			}	
		);
	}
}