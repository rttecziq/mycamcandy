import { Component } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {News} from '../../../models/news';

declare var $: any ;

@Component({
    templateUrl: 'news.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css',
    ]
})

export class NewsComponent{

    errorMessages : string;

    news_view : News;

    news_id : number;

    constructor(private requestService : RequestService, private router : Router,private route : ActivatedRoute) {

        this.errorMessages = "";

        this.news_view  = {

            title : "",
            
            description : ""

        }

        this.route.queryParams.subscribe(params => {

            this.news_id = params['news_id'];

            let details = {news_id : this.news_id};

            this.newsViewFn('news/view' , details);

        });
    }
   
    ngOnInit() {


    }

    newsViewFn(url, object) {

        this.requestService.postMethod(url, object)
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    this.news_view = data.data;   

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