import { Component, OnInit} from '@angular/core';
import { group } from '@angular/animations';
import { RequestService } from 'src/app/common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
    selector: 'group-sidebar',
    templateUrl: 'group-sidebar.component.html',
    styleUrls:['../../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../../assets/css/jquery-ui.css',
                '../../../../../assets/css/style.css',
                '../../../../../assets/css/responsive.css'
    ]   
})

export class GroupSidebarComponent implements OnInit{

    errorMessages : string;

    group_list : any;

    constructor(public requestService : RequestService, public router : Router) {

        this.group_list = [];

        this.errorMessages = "";
    }

    ngOnInit() {

        this.groupsList("groups/index", {type : 0});

    }

    groupsList(url, object) {

        this.requestService.postMethod(url, object)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        this.group_list = data.data; 

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