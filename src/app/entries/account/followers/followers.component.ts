import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
    templateUrl: 'followers.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css'
    ]   
})

export class FollowersComponent implements AfterViewInit{

    errorMessages : string;

    follower_details : any[];

    showFollowersLoader : boolean;

    followersSkipCount : number;

    datasAvailable : number;

    constructor(private requestService : RequestService, private router: Router) {

        this.errorMessages = '';

        this.follower_details = [];

        this.showFollowersLoader = false;

        this.followersSkipCount = 0;

        this.datasAvailable = 0;

    }

    ngAfterViewInit() {

        setTimeout(() => {

            let details = {skip:0};

            this.followerDetailsFn('followers_list', details);

        }, 2000);

    }

    followerDetailsFn(url, object) {

        this.showFollowersLoader = true;

        this.requestService.postMethod(url,object)
            .subscribe(

                (data : any) => {

                    if (data.success == true) {

                        this.datasAvailable = 1;

                        if (this.followersSkipCount > 0) {

                            this.follower_details = [...this.follower_details, ...data.data];
                        
                        } else {

                            this.follower_details = data.data;
                        
                        }

                        this.followersSkipCount += data.data.length;

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

                        this.showFollowersLoader = false;

                    }, 2000);
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

                        this.follower_details[index] = data.data;

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

    // REmove follower

    unFollowUser(user_id, index) {

        let details = {follower_id : user_id};

        this.requestService.postMethod('remove_follower', details)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        this.follower_details[index] = data.data;

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

    unBlockUser(user_id, index) {

        let details = {blocker_id : user_id};

        this.requestService.postMethod('unblock_user', details)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        this.follower_details[index] = data.data;
                        
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

    showMoreFollowers() {

        this.followerDetailsFn('followers_list', {skip : this.followersSkipCount});

    }
}