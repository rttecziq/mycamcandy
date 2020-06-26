import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


declare var $: any ;

@Component({
    templateUrl: 'vod-list.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/mdb.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css'
    ]   
})

export class VODlistComponent implements OnInit{

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

            let details = {status : 1, skip : 0}; // To load my vod videos (Logged In user VOD)

            this.skipCount = 0;

            this.vod_videos = [];

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

    // To delete vod video

    deleteVODvideo(event, vod_id) {

        if (confirm('Are you sure want to delete the selected video ?')) {

            let details = {video_id : vod_id};

            this.requestService.postMethod('vod/videos/delete', details)   
            .subscribe(

                (data : any) => {
    
                    if (data.success == true) {
    
                        $.toast({
                            heading: 'Success',
                            text: "VOD video has been deleted successfully..!",
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

    }

    // To change the status of the video approve/decline

    changeVODstatus(event, vod_id) {

        if (confirm('Are you sure want to change the status of the video ?')) {

            let details = {video_id : vod_id};

            this.requestService.postMethod('vod/videos/status', details)   
            .subscribe(

                (data : any) => {
    
                    if (data.success == true) {
    
                        $.toast({
                            heading: 'Success',
                            text: "The status of the video selected by you has been changed successfully.",
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

    }

    // To publish the video

    publishVODvideo(event, vod_id) {

        if (confirm('Are you sure want to publish the video ?')) {

            let details = {video_id : vod_id};

            this.requestService.postMethod('vod/videos/publish', details)   
            .subscribe(

                (data : any) => {
    
                    if (data.success == true) {
                        
                        $.toast({
                            heading: 'Success',
                            text: "Your selected video has been published successfully",
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

    }

    showMore() {

        if (this.searchValue) {

            this.searchVideosFn('vod/videos/search', {skip:this.skipCount, term : this.searchValue,status : 1});

        } else {

            this.vodVideosFn('vod/videos/list', {skip:this.skipCount,status : 1});

        }

    }

    searchVideosFn(url, object) {

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
