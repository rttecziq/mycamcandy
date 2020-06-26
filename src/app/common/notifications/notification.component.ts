import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Constant } from 'src/app/constant/Constant';

declare var $ : any;

@Component({
    templateUrl: 'notification.component.html',
    styleUrls:[
        '../../../assets/css/bootstrap/css/bootstrap.min.css',
        '../../../assets/css/font-awesome/css/font-awesome.min.css',
        '../../../assets/css/style.css',
        '../../../assets/css/responsive.css',
    ]
})

export class NotificationComponent implements AfterViewInit{

    errorMessages : string;

    notifications : any[];

    showLoader : boolean;

    skipCount : number;

    dataAvailable : number;

    notifications_types : any;

    constructor(private requestService : RequestService, private router : Router) {

        this.errorMessages = '';

        this.notifications = [];

        this.showLoader = false;

        this.skipCount = 0;

        this.dataAvailable = 0;

        this.notifications_types = {

            'LIVE_STREAM_STARTED' : Constant.LIVE_STREAM_STARTED,

            'USER_FOLLOW' : Constant.USER_FOLLOW,

            'USER_JOIN_VIDEO' : Constant.USER_JOIN_VIDEO,

            'USER_GROUP_ADD' : Constant.USER_GROUP_ADD

        };
    }

    ngAfterViewInit() {

        setTimeout(() => {

            let details = {skip : 0};

            this.notificationsFn('user/notifications', details);

        }, 2000);

    }

    // Paid videos which is paid by me

    notificationsFn(url, object) {

        this.showLoader = true;

        this.requestService.postMethod(url,object) 
            .subscribe(

                (data : any) => {

                    if (data.success == true) {
                        
                        this.dataAvailable = 1;

                        if (this.skipCount > 0) {

                            this.notifications = [...this.notifications, ...data.data];
                        
                        } else {

                            this.notifications = data.data;
                        
                        }

                        this.skipCount += data.data.length;

                        if (data.data.length <= 0) {

                            this.dataAvailable = 0;

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

                        this.showLoader = false;

                    }, 2000);
                }

            );

    }

    showMore() {

        this.notificationsFn('user/notifications',  {skip:this.skipCount});

    }
}