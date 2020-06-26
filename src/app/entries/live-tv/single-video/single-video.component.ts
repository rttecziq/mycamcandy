import { Component } from '@angular/core';
import { LiveTv } from 'src/app/models/livetv';
import { RequestService } from 'src/app/common/services/request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $ : any;

declare var jwplayer: any;

@Component({
    templateUrl: 'single-video.component.html',
    styleUrls:[
        '../../../../assets/css/bootstrap/css/bootstrap.min.css',
        '../../../../assets/css/font-awesome/css/font-awesome.min.css',
        '../../../../assets/css/style.css',
        '../../../../assets/css/responsive.css'
    ]
})

export class LiveVideoComponent{

    errorMessages : string;

    live_tv_obj : LiveTv;

    live_tv_video_id : number;

    site_settings : any;

    tv_videos : any;

    constructor(private requestService : RequestService, private router : Router, public route : ActivatedRoute) {

        this.errorMessages = "";

        this.live_tv_obj = {

            title : "",

            description : "",
        
            rtmp_video_url : "",
        
            hls_video_url : "",
        
            image : "",
        
            live_video_id : 0,

            custom_live_video_id : 0,

            status : 0,
        
            created_date : "",
        
            category_name : "",
        
            created_time : ""
            
        };

        this.route.queryParams.subscribe((params)=> {

            this.live_tv_video_id = params['id'];

        });

        this.site_settings = JSON.parse(localStorage.getItem('site_settings'));

        let jwplayer_key = (this.site_settings).filter(obj => {
            return obj.key === 'jwplayer_key'
        });

        jwplayer.key = jwplayer_key.length > 0 ? jwplayer_key[0].value : '';

        this.tv_videos = [];

        this.liveTvList('custom/live/videos', {skip : 0, custom_live_video_id : this.live_tv_video_id});

        this.viewLiveTv();
        
    }

    // to view live video

    viewLiveTv() {

        this.requestService.postMethod('single/live/video', {custom_live_video_id : this.live_tv_video_id})
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        var object = data.data;

                        this.live_tv_obj = {

                            title : object.title,
                
                            description : object.description,
                        
                            rtmp_video_url : object.rtmp_video_url,
                        
                            hls_video_url : object.hls_video_url,
                        
                            image : object.image,
                        
                            live_video_id : object.custom_live_video_id,
                
                            custom_live_video_id : object.custom_live_video_id,
                
                            status : object.status,
                        
                            created_date : object.created_date,
                        
                            category_name : object.category_name,
                        
                            created_time : object.created_time
                            
                        };

                        var playerInstance = jwplayer("videos-container");  

                        playerInstance.setup({
                            file: object.rtmp_video_url,
                            image: object.image,
                            width: "100%",
                            aspectratio: "16:9",
                            primary: "flash",
                            controls : true,
                            "controlbar.idlehide" : false,
                            controlBarMode:'floating',
                            autostart : false,
                           
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

    liveTvList(url, object) {

        this.requestService.postMethod(url, object) 
        .subscribe(

            (data : any) => {

                if (data.success == true) {
                
                    this.tv_videos = data.data;

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