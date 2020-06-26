import {Component} from '@angular/core';
import { RequestService } from 'src/app/common/services/request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $ : any;

@Component({
    templateUrl: 'live-video.component.html',
    styleUrls: [    
        '../../../../assets/css/bootstrap/css/bootstrap.css',
        '../../../../assets/css/font-awesome/css/font-awesome.min.css',
        '../../../../assets/css/jquery-ui.css',
        '../../../../assets/css/style.css',
        '../../../../assets/css/responsive.css',
        '../../../../assets/css/component.css',
    ]
})

export class SearchLivevideosComponent{
    
    errorMessages : string;

    live_videos : any[];

    showLoader : boolean;

    skipCount : number;

    term : string;

    constructor(private requestService : RequestService, private router : Router, private route : ActivatedRoute) {

        this.errorMessages = "";

        this.live_videos = [];

        this.showLoader = false;

        this.skipCount = 0;

        this.route.queryParams.subscribe(params => {

            this.term = params['q'];

            let details = {term : this.term, skip : 0, type : 'live-videos'};

            this.live_videos = [];

            this.skipCount = 0;

            this.searchLiveVideos('search/user', details);

        });

    }

    ngOnInit() {

        

    }

    searchLiveVideos(url, object) {

        this.showLoader = true;

        this.requestService.postMethod(url, object) 
        .subscribe(

            (data : any) => {

                if (data.success == true) {
                    
                    if (this.skipCount > 0) {

                        this.live_videos = [...this.live_videos, ...data.data];
                    
                    } else {

                        this.live_videos = data.data;
                    
                    }

                    this.skipCount += data.data.length;

                } else {

                    this.errorMessages = data.error_messages;

                
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

        this.searchLiveVideos('search/live/videos', {skip:this.skipCount,term : this.term, type : 'live-videos'});

    }
}