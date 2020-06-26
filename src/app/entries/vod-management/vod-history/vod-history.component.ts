import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestService } from '../../../common/services/request.service';
import { Router } from '@angular/router';

declare var $: any

@Component({
    templateUrl: 'vod-history.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css'
    ]   
})

export class VODhistoryComponent{

    detailsShow(id){
        $('#dialog_'+id).css("display","block");
    }
    detailsClose(id){
        $('#dialog_'+id).css("display","none");
    }

    errorMessages : string;

    vod_histories : any[];

    showLoader : boolean;

    skipCount : number;

    datasAvailable : number;

    constructor(private requestService : RequestService, private router: Router) {

        this.errorMessages = "";

        this.vod_histories = [];

        this.showLoader = false;

        this.skipCount = 0;

        this.datasAvailable = 0;

    }

    ngAfterViewInit() {

        setTimeout(() => {

            let details = {skip : 0};
            
            this.vodHistoryFn('vod/videos/ppv/history', details);

        }, 2000);

    }

    vodHistoryFn(url,object) {

        this.showLoader = true;

        this.requestService.postMethod(url,object) 
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    this.datasAvailable = 1;
                    
                    if (this.skipCount > 0) {

                        this.vod_histories = [...this.vod_histories, ...data.data];
                    
                    } else {

                        this.vod_histories = data.data;
                    
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

        this.vodHistoryFn('vod/videos/ppv/history', {skip:this.skipCount});

    }
}