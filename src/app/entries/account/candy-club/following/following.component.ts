import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
    templateUrl: 'following.component.html',
    styleUrls:['./following.component.css'
    // '../../../../../assets/css/style.css'
    ]   
})

export class FollowingComponent implements AfterViewInit{

    errorMessages = '';
    following_details : any[];
    showFollowingLoader : boolean;
    followingsSkipCount : number;
    datasAvailable : number;

    constructor(private requestService : RequestService, private router : Router) {

        this.errorMessages = '';
        this.following_details = [];
        this.showFollowingLoader = false;
        this.followingsSkipCount = 0;        
        this.datasAvailable = 0;
    }
    
    ngAfterViewInit() {
        setTimeout(() => {
            let details = {skip : 0};
            this.followingDetailsFn('followings_list', details);
        }, 2000);
    }

    followingDetailsFn(url, object) {
        this.showFollowingLoader = true;
        this.requestService.postMethod(url,object)
            .subscribe(
                (data : any) => {
                    if (data.success == true) {
                        this.datasAvailable = 1;                        
                        if (this.followingsSkipCount > 0) {
                            this.following_details = [...this.following_details, ...data.data];                        
                        } else {
                            this.following_details = data.data;                        
                        }
                        this.followingsSkipCount += data.data.length;
                        if (data.data.length <= 0) {
                            this.datasAvailable = 0;    
                        }
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
                },
                () => {
                    setTimeout(() => {
                        this.showFollowingLoader = false;
                    }, 2000);
                }
            );
    }


    unBlockUser(user_id, index) {
        let details = {blocker_id : user_id};
        this.requestService.postMethod('unblock_user', details)
            .subscribe(
                (data : any ) => {
                    if (data.success == true) {
                        this.following_details[index] = data.data;
                        $.toast({
                            heading: 'Success',
                            text: "You are unblocking the user, you will get the user in suggestions list.",
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

    // REmove follower

    unFollowUser(user_id, index) {
        let details = {follower_id : user_id};
        this.requestService.postMethod('remove_follower', details)
            .subscribe(
                (data : any ) => {
                    if (data.success == true) {
                        //this.following_details[index] = data.data;
                        document.getElementById("unfollow"+index).style.display = "none";
                        $.toast({
                            heading: 'Success',
                            text: "You have now stopped following the user, you will not get any further notifications from the User",
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

    // To add follower

    followUser(user_id, index) {
        let details = {follower_id : user_id};
        this.requestService.postMethod('add_follower', details)
            .subscribe(
                (data : any ) => {
                    if (data.success == true) {
                        this.following_details[index] = data.data;
                        $.toast({
                            heading: 'Success',
                            text: "You have now started following the User, you will be notified when the User goes live",
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

    showMoreFollowings() {
        this.followingDetailsFn('followings_list', {skip : this.followingsSkipCount});
    }
}