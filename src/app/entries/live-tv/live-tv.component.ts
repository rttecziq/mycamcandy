import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';

declare var $ : any;

@Component({
    templateUrl: 'live-tv.component.html',
    styleUrls: [
        '../../../assets/css/bootstrap/css/bootstrap.min.css',
        '../../../assets/css/font-awesome/css/font-awesome.min.css',
        '../../../assets/css/mdb.css',
        '../../../assets/css/style.css',
        '../../../assets/css/responsive.css'
    ],
})

export class LiveTVComponent implements OnInit{

    errorMessages : string;

    tv_videos : any[];

    showLoader : boolean;

    skipCount : number;

    searchValue : string;
    
    constructor(public requestService : RequestService) {

        this.errorMessages = "";

        this.tv_videos = [];

        this.showLoader = false;

        this.skipCount = 0;

        this.searchValue = "";

    }


    ngOnInit() {

        setTimeout(() => {

            let details = {skip : 0}; // To load my vod videos (Logged In user VOD)

            this.skipCount = 0;

            this.liveTvList('custom/live/videos', details);

        }, 2000);

    }

    liveTvList(url, object) {

        this.showLoader = true;

        this.requestService.postMethod(url, object) 
        .subscribe(

            (data : any) => {

                if (data.success == true) {
                    
                    if (this.skipCount > 0) {

                        this.tv_videos = [...this.tv_videos, ...data.data];
                    
                    } else {

                        this.tv_videos = data.data;
                    
                    }

                    this.skipCount += data.data.length;

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

        if (this.searchValue) {

            this.searchVideosFn('custom/videos/search', {skip:this.skipCount, term : this.searchValue});

        } else {

            this.liveTvList('custom/live/videos', {skip:this.skipCount});

        }

    }

    onKeyEnter(value) {

        this.skipCount = 0;

        this.searchValue = value;

        if(value) {

            this.tv_videos = [];

            this.searchVideosFn('custom/videos/search', {skip:this.skipCount, term : value});

        } else {

            this.liveTvList('custom/live/videos', {skip:this.skipCount});

        }

    }


    searchVideosFn(url, object) {

        this.showLoader = true;

        this.requestService.postMethod(url, object) 
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    if (data.data) {
                    
                        if (this.skipCount > 0) {

                            this.tv_videos = [...this.tv_videos, ...data.data];
                        
                        } else {

                            this.tv_videos = data.data;
                        
                        }

                        this.skipCount += data.data.length;

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
}