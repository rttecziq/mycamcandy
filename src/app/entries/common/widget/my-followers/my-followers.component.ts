import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $:any;
@Component({
  selector: 'app-my-followers',
  templateUrl: './my-followers.component.html',
  styleUrls: ['./my-followers.component.css']
})
export class MyFollowersComponent implements AfterViewInit {

    errorMessages : string;
    username : string;
    follower_details : any[];
    following_details : any[];
    	
	constructor(private requestService : RequestService, private router : Router) {
		this.errorMessages = '';
        this.follower_details = [];
        this.following_details = [];

        this.username = (localStorage.getItem('username') != '' && localStorage.getItem('username') != null && localStorage.getItem('username') != undefined) ? localStorage.getItem('username') : '';
	}

    ngAfterViewInit() {
        let details = {skip:0};
        this.followerDetailsFn('followers_list', details);
        this.followingDetailsFn('followings_list', details);
    }
  
    toast_message(heading, message) {
            $.toast({
                heading: heading,
                text: message,
            // icon: 'error',
                position: 'top-right',
                stack: false,
                textAlign: 'left',
                loader : false,
                showHideTransition: 'slide'
            });
    }

    followerDetailsFn(url, object) {
        this.requestService.postMethod(url,object)
            .subscribe(
                (data : any) => {
                    if (data.success == true) {
                        this.follower_details = data.data;
                    } else {
                        this.errorMessages = data.error_messages;
                        this.toast_message("Error", this.errorMessages);
                    }
                },
                (err : HttpErrorResponse) => {
                    this.errorMessages = 'Oops! Something Went Wrong';
                }
            );
    }

    followingDetailsFn(url, object) {
        this.requestService.postMethod(url,object)
            .subscribe(
                (data : any) => {
                    if (data.success == true) {
                        this.following_details = data.data;
                        console.log(this.following_details)
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
}