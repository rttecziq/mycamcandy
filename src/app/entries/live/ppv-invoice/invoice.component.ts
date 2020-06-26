import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { PPV } from '../../../models/pay-per-view';

declare var $: any ;

@Component({
    templateUrl: 'invoice.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css',
    ]   
})

export class VideoInvoiceComponent implements AfterViewInit{
    resetForm() {
        $("#form1")[0].reset();
    }

    errorMessages : string;

    invoice_details : PPV;

    video_id : number;

    coupon_code : string;

    is_coupon : boolean;

    coupon_details : Object;

    type : number;

    constructor(private requestService : RequestService, private router : Router, private route : ActivatedRoute) {

        this.errorMessages = "";

        this.coupon_code = "";

        this.is_coupon = false;

        this.type = 1;

        this.invoice_details = {

            title : "",
            picture : "",
            description : "",
            currency : "",
            amount : "",

        };

        this.coupon_details = {};

        this.route.queryParams.subscribe(params => {
            this.video_id = params['video_id'];
        });    

    }

    ngAfterViewInit(){
        /*$.getScript('../../../../assets/js/script.js',function(){
        });
        $.getScript('../../../../assets/js/custom-file-input.js',function(){
        });
        $.getScript('../../../../assets/js/classie.js',function(){
        });
        $.getScript('../../../../assets/js/form.js',function(){
        }); */

        let details = {live_video_id : this.video_id};

        this.invoiceDetailsFn('video/invoice', details);
    }

    // To get invoice details based on subscription details
    invoiceDetailsFn(url, object) {

        this.requestService.postMethod(url, object)
            .subscribe(

                (data : any) => {

                    if (data.success == true) {

                        this.invoice_details = data.data;   

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

    // Apply coupon for ppv

    applyCouponForPPV(coupon_code) {

        let details = {live_video_id : this.video_id , coupon_code : coupon_code};

        this.requestService.postMethod('apply/coupon/live-videos', details)
            .subscribe(

                (data : any) => {

                    if (data.success == true) {

                        this.is_coupon = true;

                        this.coupon_details = data.data;

                        $.toast({
                            heading: 'Success',
                            text: "The coupon code has been applied successfully",
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                    } else {

                        this.errorMessages = data.error_messages;

                        this.coupon_code = "";

                        this.is_coupon = false;

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

                    this.is_coupon = false;

                    this.coupon_code = "";

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

    // Paynow option

    payNow(coupon_code, payment_type) {

        if (coupon_code == '' || coupon_code == undefined || coupon_code == null) {

            coupon_code = '';

        }
        if (payment_type == '' || payment_type == undefined || payment_type == null) {

            payment_type = '';
            
        }

        if (payment_type) {

            var total_remaining_amount = $(".total_remaining_amount").text();

            if (parseInt(total_remaining_amount) > 0) {

                if (payment_type == 1) {

                    let user_id = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';

                    this.paypalPayment(this.requestService.adminUrl+"paypal_video/", {video_id : this.video_id, user_id : user_id, coupon_code : this.coupon_code});

                } else {

                    this.cardPayment("stripe/live/ppv", {video_id : this.video_id, coupon_code : this.coupon_code});
                }

            } else {

                this.zeroPlan("video_subscription", {video_id : this.video_id, payment_id : 'COUPON-DISCOUNT', coupon_code : this.coupon_code});

            }

        } else {

            this.zeroPlan("video_subscription", {video_id : this.video_id, payment_id : 'FREE-PLAN'});

        }

    }

    zeroPlan(url, object) {

        $("#pay_now_button").attr('disabled', true);
        $("#pay_now_button").html('Sending...');

        this.requestService.postMethod(url,object)
            .subscribe(
                (data : any) => {
                    
                    if (data.success == true) {
                        

                        $.toast({
                            heading: 'Success',
                            text: data.message,
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        this.router.navigate(['/payment-success'], {queryParams : {video_id:this.video_id}});

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

                        this.router.navigate(['/payment-failure']);
                        
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
                ()=> {

                    setTimeout(()=>{

                        $("#pay_now_button").attr('disabled', false);

                        $("#pay_now_button").html('Pay Now');

                    }, 1000);

                },

            );
    }
 
    paypalPayment(url, object) {

        if(object.coupon_code == '' || object.coupon_code == null || object.coupon_code == "undefined") {

            window.location.href = url+object.video_id+"/"+object.user_id;

        } else {

            window.location.href = url+object.video_id+"/"+object.user_id+"/"+object.coupon_code;

        }

    }

    cardPayment(url, object) {

        $("#pay_now_button").attr('disabled', true);
        $("#pay_now_button").html('Sending...');

        this.requestService.postMethod(url,object)
            .subscribe(
                (data : any) => {
                    
                    if (data.success == true) {

                        $.toast({
                            heading: 'Success',
                            text: data.message,
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        this.router.navigate(['/payment-success'], {queryParams : {video_id:this.video_id}});

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

                        if (data.error_code == 901) {

                            this.router.navigate(['/add-card'], {queryParams : {video_id : this.video_id}});

                        } else {

                            this.router.navigate(['/payment-failure']);

                        }
                        
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
                ()=> {

                    setTimeout(()=>{

                        $("#pay_now_button").attr('disabled', false);

                        $("#pay_now_button").html('Pay Now');

                    }, 1000);

                },

            );

    }
    
}