import { Component } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {Page} from '../../../models/page';

declare var $: any ;

@Component({
    templateUrl: 'pages.component.html',
    styleUrls:['./pages.component.css'
                // '../../../../assets/css/bootstrap/css/bootstrap.css',
                // '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                // '../../../../assets/css/style.css',
                // '../../../../assets/css/responsive.css',
    ]
})

export class PagesComponent{

    errorMessages : string;
    page_view : Page;
    page_id : number;
    is_page_dcma : boolean;

    constructor(private requestService : RequestService, private router : Router,private route : ActivatedRoute) {

        this.errorMessages = "";        
        this.page_view  = {
            title : "",            
            description : ""
        }

        this.route.queryParams.subscribe(params => {
            this.page_id = params['page_id'];

            // page_id = 16 is dcma page which consist dcma form
            this.is_page_dcma = this.page_id == 16 ? true : false;
            let details = {page_id : this.page_id};
            this.pageViewFn('pages/view' , details);

        });
    }
   
    ngOnInit() {


    }

    pageViewFn(url, object) {

        this.requestService.postMethod(url, object)
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    this.page_view = data.data;   

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