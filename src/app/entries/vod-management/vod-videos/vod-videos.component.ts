import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

declare var $:any;

@Component({
    templateUrl: 'vod-videos.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/mdb.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css'
    ]   
})

export class VODvideosComponent implements OnInit{

    errorMessages : string;

    vod_videos : any[];

    showLoader : boolean;

    skipCount : number;

    searchValue : string;

    datasAvailable : number;

    constructor(private requestService : RequestService, private router : Router) {

        this.errorMessages = "";

        this.vod_videos = [];

        this.showLoader = false;

        this.skipCount = 0;

        this.searchValue = "";

        this.datasAvailable = 0;

    }

    ngOnInit() {

        setTimeout(() => {

            let details = {skip : 0}; // To load my vod videos (Logged In user VOD)

            this.vodVideosFn('vod/videos/list', details);

        }, 2000);

    }

    vodVideosFn(url, object) {

        this.showLoader = true;

        this.requestService.postMethod(url, object) 
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    this.datasAvailable = 1;
                    
                    if (this.skipCount > 0) {

                        this.vod_videos = [...this.vod_videos, ...data.data];
                    
                    } else {

                        this.vod_videos = data.data;
                    
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

        if (this.searchValue) {

            this.searchVideosFn('vod/videos/search', {skip:this.skipCount, term : this.searchValue});

        } else {

            this.vodVideosFn('vod/videos/list', {skip:this.skipCount});

        }

    }

    searchVideosFn(url, object) {

        this.showLoader = true;

        this.requestService.postMethod(url, object) 
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    this.datasAvailable = 1;
                    
                    if (this.skipCount > 12) {

                        this.vod_videos = [...this.vod_videos, ...data.data];
                    
                    } else {

                        this.vod_videos = data.data;
                    
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

    onKeyEnter(value) {

        this.skipCount = 0;

        this.searchValue = value;

        if(value) {

            this.searchVideosFn('vod/videos/search', {skip:this.skipCount, term : value});

        } else {

            this.vodVideosFn('vod/videos/list', {skip:this.skipCount});

        }

    }

}