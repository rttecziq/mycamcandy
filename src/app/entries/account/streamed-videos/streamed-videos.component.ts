import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any ;


@Component({
    templateUrl: 'streamed-videos.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css',
    ]   
})

export class StreamedVideosComponent implements AfterViewInit{

    errorMessages : string;

    streamed_videos : any[];

    showLoader : boolean;

    skipCount : number;

    datasAvailable : number;

    constructor(private requestService : RequestService, private router: Router) {

        this.errorMessages = "";

        this.streamed_videos = [];

        this.showLoader = false;

        this.skipCount = 0;

        this.datasAvailable = 0;

    }

    ngAfterViewInit() {

        setTimeout(() => {

            let details = {skip : 0};
            
            this.streamedVideosFn('videos/info', details);

        }, 2000);

    }

    streamedVideosFn(url,object) {

        this.showLoader = true;

        this.requestService.postMethod(url,object) 
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    this.datasAvailable = 1;
                    
                    if (this.skipCount > 0) {

                        this.streamed_videos = [...this.streamed_videos, ...data.data];
                    
                    } else {

                        this.streamed_videos = data.data;
                    
                    }

                    this.skipCount += data.data.length;

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

                    this.showLoader = false;

                }, 2000);
            }

        );

    }

    showMore() {

        this.streamedVideosFn('videos/info', {skip:this.skipCount});

    }
}