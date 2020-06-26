import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/common/services/request.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
    templateUrl: 'group.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css'
    ]   
})

export class GroupsComponent implements OnInit{

    errorMessages : string;

    user_details : User;

    constructor(public requestService : RequestService, public router : Router) {

        this.errorMessages = '';
        
        this.user_details = {

            name : "",
            email : "",
            cover : "",
            picture : "",
            no_of_followers : "",
            no_of_followings : "",
            total_user_amount : "",
            description : "",
            login_by : "",
            gallery_description : ""
        }

    }

    ngOnInit() {

        this.user_profile_fn("userDetails", "");

    }

    user_profile_fn(url, object) {

        this.requestService.getMethod(url, object)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        this.user_details = data; 

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