import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { VodView } from '../../../models/vod-view';

declare var $ : any;
declare var jwplayer: any;

@Component({
    templateUrl: 'vod-view.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/mdb.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css',
    ]   
})

export class VODviewComponent implements AfterViewInit{

    errorMessages : string;

    vod_videos : any[];

    vod_id : number;

    vod_view : any;

    userId : string;

    ppv : VodView;

    site_settings : any;

    video_id : number;

    constructor(private requestService : RequestService, private route : ActivatedRoute, private router : Router) {
        
        this.errorMessages = "";

        this.vod_videos = [];

        this.userId = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';

        this.ppv = {

            type_of_user : 3, // both Users

            video_id : this.vod_id,

            type_of_subscription : 1, // One Time payment

            amount : 0
        
        };

        this.route.queryParams.subscribe(params => {

            this.vod_id = params['id'];

            this.vodView("vod/videos/view", {video_id : this.vod_id});

            this.vodVideosFn("vod/videos/list", {skip : 0, video_id : this.vod_id});

        });

        this.vod_view = {};

        this.site_settings = JSON.parse(localStorage.getItem('site_settings'));

        let jwplayer_key = (this.site_settings).filter(obj => {
            return obj.key === 'jwplayer_key'
        });

        jwplayer.key = jwplayer_key.length > 0 ? jwplayer_key[0].value : '';
   
    }

    ngAfterViewInit() {

        
    }

    oncompletePPV(url,object) {

        this.requestService.postMethod(url, object)   
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    if (data.navigate_and_pay) {

                        $.toast({
                            heading: 'Success',
                            text: "The video is recurring payment, Please pay and watch it again",
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        this.router.navigate(['vod/invoice'], {queryParams : {video_id : this.vod_id}});

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

            }

        );

    }

    vodView(url, object) {

        this.requestService.postMethod(url, object)
            .subscribe(
                (data : any) => { 

                    if(data.success) {

                            this.vod_view = data.data;

                            this.video_id = data.data.vod_id;

                            this.ppv = {

                                type_of_user : 3, // both Users
                    
                                video_id : data.data.vod_id,
                    
                                type_of_subscription : data.data.type_of_subscription > 0 ? data.data.type_of_subscription : 1, // One Time payment
                    
                                amount : data.data.amount
                            
                            };
                    

                           // setTimeout(() => {

                                var playerInstance = jwplayer("videos-container");  

                                playerInstance.setup({
                                    file: data.data.video,
                                    image: data.data.image,
                                    width: "100%",
                                    aspectratio: "16:9",
                                    primary: "flash",
                                    controls : true,
                                    "controlbar.idlehide" : false,
                                    controlBarMode:'floating',
                                    autostart : false,
                                   
                                    events : {
                                        onComplete : () => { 
                                        
                                            if (data.data.user_id != this.userId) {
                
                                                this.oncompletePPV("vod/videos/oncomplete/ppv", {'video_id':this.video_id});

                                            }
                
                                            
                                        },
                    
                                    },
                                });

                          //  }, 2000);

                    } else {

                        this.errorMessages = data.error_messages;

                        $.toast({
                            heading: 'Warning',
                            text: this.errorMessages,
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        if (data.error_code == 2007) {

                            this.router.navigate(['vod/invoice'], {queryParams : {video_id : this.vod_id}});
                            
                        }

                    }

                },

                (err : HttpErrorResponse)=> {

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
            )

    }

    vodVideosFn(url, object) {

        this.requestService.postMethod(url, object) 
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    this.vod_videos = data.data;

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


    // To set PPV

    setPPV(form : NgForm) {

        this.requestService.postMethod('vod/videos/set/ppv', form.value)   
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    $.toast({
                        heading: 'Success',
                        text: "This video has been changed into Payment video",
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });

                    $("#clear_ppv_streaming_button").click();

                    this.vodView("vod/videos/view", {video_id : this.vod_id});

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
  
    // To remove PPV

    removePPV(video_id) {

        this.requestService.postMethod('vod/videos/remove/ppv', {video_id : video_id})   
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    $.toast({
                        heading: 'Success',
                        text: "Payment has been removed in this video..!",
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });

                    $("#clear_ppv_streaming_button").click();

                    this.vodView("vod/videos/view", {video_id : this.vod_id});

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