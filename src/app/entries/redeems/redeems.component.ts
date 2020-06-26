import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Redeem } from '../../models/redeems';

declare var $ : any;

@Component({
    templateUrl: 'redeems.component.html',
    styleUrls:['../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../assets/css/jquery-ui.css',
                '../../../assets/css/style.css',
                '../../../assets/css/responsive.css',
                '../../../assets/css/demo.css',
    ]   
})

export class RedeemsComponent implements AfterViewInit {

    errorMessages : string;

    redeem_requests : any[];

    redeem_details : Redeem;

    constructor(private requesService : RequestService, private router : Router) {

        this.errorMessages = "";

        this.redeem_requests = [];

        this.redeem_details = {

            currency: "",

            remaining : ""

        };

    }

    ngAfterViewInit() {

        this.redeemRequestList("redeem/request/list", "");

    }

    // Redeem request List

    redeemRequestList(url, object) {

        this.requesService.postMethod(url,object)
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    this.redeem_requests = data.data; 
                    
                    this.redeem_details = data.redeem_amount;

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

    // Send Redeem Request List

    sendRedeemRequest() {

        this.requesService.postMethod("redeems/request","")
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    $.toast({
                        heading: 'Success',
                        text: "Redeem Request sent Successfully..!",
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });
                    
                    this.redeemRequestList("redeem/request/list", "");

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

    // To cancel redeem request based on id

    cancelRedeemRequest(id) {

        this.requesService.postMethod("redeem/request/cancel",{redeem_request_id : id})
        .subscribe(

            (data : any) => {

                if (data.success == true) {

                    $.toast({
                        heading: 'Success',
                        text: "Redeem Request cancelled Successfully..!",
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });
                    
                    this.redeemRequestList("redeem/request/list", "");

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