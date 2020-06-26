import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PeerProfile } from '../../models/peer-profile';

declare var $: any ;

@Component({
    templateUrl: 'view-profile.component.html',
    styleUrls:['../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../assets/css/jquery-ui.css',
                '../../../assets/css/style.css',
                '../../../assets/css/responsive.css',
                '../../../assets/css/component.css',
    ]   
})

export class ViewProfileComponent{
    
    errorMessages : string;

    user_details : PeerProfile;

    peer_id : number;

    followers : any[];

    followings : any[];

    galleries : any[];

    showFollowingLoader : boolean;

    showFollowersLoader : boolean;

    showGalleryLoader : boolean;

    galleriesSkipCount : number;

    followersSkipCount : number;

    followingsSkipCount : number;

    isLoggedInUser : string;

    userId : string;

    galleryDatasAvailable : number;

    followerDatasAvailable : number;

    followingDatasAvailable : number;

    constructor(private requestService : RequestService, private router : Router, private route : ActivatedRoute) {

        this.followers = [];

        this.followings = [];

        this.galleries = [];

        this.showFollowingLoader = false;

        this.showFollowersLoader = false;

        this.showGalleryLoader = false;

        this.galleriesSkipCount = 0;

        this.followersSkipCount = 0;

        this.followingsSkipCount = 0;

        this.galleryDatasAvailable = 0;

        this.followerDatasAvailable = 0;

        this.followingDatasAvailable = 0;

        this.isLoggedInUser  = this.requestService.userId;

        this.user_details = {

            is_block : ""

        };

        this.route.queryParams.subscribe(params => {

            this.peer_id = params['peer_id'];

            // Load Peer Profile
            let details = {peer_id : this.peer_id};
            
            this.peerProfileFn("peerProfile", details);

        });
        
        this.userId = this.requestService.userId;
    }

    ngOnInit() {


    }

    peerProfileFn(url, object) {

        this.requestService.postMethod(url, object)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        this.user_details = data; 

                        this.followers = data.followers.length > 0 ? data.followers : [];

                        this.followings = data.followings.length > 0 ? data.followings : [];

                        this.galleries = data.galleries.length > 0 ? data.galleries : [];
                        
                        this.galleriesSkipCount = data.galleries.length;

                        this.followingDatasAvailable = 1;
                        
                        this.followerDatasAvailable = 1;

                        this.galleryDatasAvailable = 1;

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

    followUser(user_id, type, index) {

        let details = {follower_id : user_id};

        this.requestService.postMethod('add_follower', details)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        if (index) {

                            if (type == 'follower') {

                                this.followers[index] = data.data;

                            } else {

                                this.followings[index] = data.data;

                            }

                        } else {

                            // Load Peer Profile
                            
                            let details = {peer_id : this.peer_id};
                                
                            this.peerProfileFn("peerProfile", details);

                        }

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

    unFollowUser(user_id, type, index) {

        let details = {follower_id : user_id};

        this.requestService.postMethod('remove_follower', details)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        if (index) {

                            if (type == 'follower') {

                                this.followers[index] = data.data;

                            } else {

                                this.followings[index] = data.data;

                            }

                        } else {

                            // Load Peer Profile
                            
                            let details = {peer_id : this.peer_id};
                                
                            this.peerProfileFn("peerProfile", details);

                        }

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

    blockUser(user_id, type, index) {

        let details = {blocker_id : user_id};

        this.requestService.postMethod('block_user', details)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        if(index) {

                            if (type == 'follower') {

                                this.followers[index] = data.data;

                            } else {

                                this.followings[index] = data.data;

                            }

                        } else {

                            $("#confirm_button_close").click();

                            // Load Peer Profile
                            
                            let details = {peer_id : this.peer_id};
                                
                            this.peerProfileFn("peerProfile", details);

                        }

                        $.toast({
                            heading: 'Success',
                            text: "You are blocking the user, you will not get Notifications, Suggestions from the user.",
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

    unBlockUser(user_id, type, index) {

        let details = {blocker_id : user_id};

        this.requestService.postMethod('unblock_user', details)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        if (index) {

                            if (type == 'follower') {

                                this.followers[index] = data.data;

                            } else {

                                this.followings[index] = data.data;

                            }

                        } else {

                            $("#unblock_button_close").click();

                            // Load Peer Profile
                            
                            let details = {peer_id : this.peer_id};
                                
                            this.peerProfileFn("peerProfile", details);

                        }

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

    // To get gallery details
    galleriesList(url, object) {

        this.showGalleryLoader = true;

        this.requestService.postMethod(url, object)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        this.galleryDatasAvailable = 1;
                        
                        this.galleries = [...this.galleries, ...data.data]; 

                        this.galleriesSkipCount += data.data.length;

                        if (data.data.length <= 0) {

                            this.galleryDatasAvailable = 0;
    
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

                        this.showGalleryLoader = false;

                    }, 2000);
                }

            );

    }

    followerDetailsFn(url, object) {

        this.showFollowersLoader = true;

        this.requestService.postMethod(url,object)
            .subscribe(

                (data : any) => {

                    if (data.success == true) {
                        
                        this.followerDatasAvailable = 1;

                        this.followers = [...this.followers, ...data.data];
                        
                        this.followersSkipCount += data.data.length;

                        if (data.data.length <= 0) {

                            this.followerDatasAvailable = 0;
    
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


    followingDetailsFn(url, object) {

        this.showFollowingLoader = true;

        this.requestService.postMethod(url,object)
            .subscribe(

                (data : any) => {

                    if (data.success == true) {

                        this.followingDatasAvailable = 1;

                        this.followings = [...this.followings, ...data.data];

                        this.followingsSkipCount += data.data.length;

                        if (data.data.length <= 0) {

                            this.followingDatasAvailable = 0;
    
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
        
    showMoreFollowings() {

        this.followingDetailsFn('followings_list', {skip : this.followingsSkipCount});
        
    }

    showMoreFollowers() {

        this.followerDetailsFn('followers_list', {skip : this.followersSkipCount});

    }

    showMoreGalleries() {

        this.galleriesList("streamer/galleries/list", {skip : this.galleriesSkipCount, user_id : this.peer_id});

    }
}