import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any ;

@Component({
    templateUrl: 'vod-revenue.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css'
    ]   
})

export class VODrevenueComponent implements AfterViewInit{

    errorMessages : string;

    vod_videos : any[];

    vod_revenue : string;

    total_vod_videos : number;

    total_paid_videos : number;

    showLoader : boolean;

    skipCount : number;

    datasAvailable : number;

    constructor(private requestService : RequestService, private router : Router) {

        this.errorMessages = '';

        this.vod_videos = [];

        this.vod_revenue = "";

        this.total_vod_videos = 0;

        this.total_paid_videos = 0;

        this.showLoader = false;

        this.skipCount = 0;

        this.datasAvailable = 0;

    }

    ngAfterViewInit() {

        setTimeout(() => {

            this.vodRevenueList("ppv/revenue", {skip : 0});

        }, 2000);

    }

    vodRevenueList(url, object) {

        this.showLoader = true;

        this.requestService.postMethod(url, object)
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    this.datasAvailable = 1;
                    
                    this.vod_revenue = data.currency+''+(data.total_amount > 0 ? data.total_amount: 0);

                    this.total_vod_videos = data.total_videos;

                    this.total_paid_videos = data.total_paid_videos;

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

        this.vodRevenueList("ppv/revenue", {skip : this.skipCount});

    }
}