import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CandiesPackage } from 'src/app/models/candies-package';

declare var $: any ;

@Component({
    templateUrl: 'candies-invoice.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css',
                './candies-invoice.css'
    ]
})

export class CandiesInvoiceComponent implements AfterViewInit{
    resetForm() {
        $("#form1")[0].reset();
    }

    errorMessages : string;
    invoice_details : CandiesPackage;
    candies_package_id : number;
    type : number;

    constructor(private requestService : RequestService, private router : Router, private route : ActivatedRoute) {
        this.errorMessages = "";
        this.invoice_details = {
            title: "",
            candies: 0,
            bonus_candies: 0,
            amount: 0,
            currency: ""
        };

        this.route.queryParams.subscribe(params => {
            this.candies_package_id = params['candies_package_id'];
        });
    }

    ngAfterViewInit() {
        let details = {
            candies_package_id : this.candies_package_id
        };

        this.invoiceDetailsFn('candies_packages/invoice', details);
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
    payNow(payment_type) {
        if (payment_type == '' || payment_type == undefined || payment_type == null) {

            payment_type = '';
        }

        if (payment_type) {
            if (payment_type == 2) {
                this.cardPayment("candies_purchase_stripe_payment", {
                    candies_package_id : this.candies_package_id
                });
            }
        } else {
            this.noPaymentMethodSelected();
        }
    }

    noPaymentMethodSelected() {
        $.toast({
            heading: 'Error',
            text: 'Please select appropriate payment gateway',
            position: 'top-right',
            stack: false,
            textAlign: 'left',
            loader : false,
            showHideTransition: 'slide'
        });
    }

    cardPayment(url, object) {
        $("#pay_now_button").attr('disabled', true);
        $("#pay_now_button").html('Sending...');

        this.requestService.postMethod(url, object)
            .subscribe(
                (data : any) => {
                    if (data.success == true) {
                        $.toast({
                            heading: 'Success',
                            text: data.message,
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        this.router.navigate(['/candies-payment-success'], {queryParams : {
                            candies_package_id:this.candies_package_id
                        }});
                    } else {
                        this.errorMessages = data.error_messages;

                        $.toast({
                            heading: 'Error',
                            text: this.errorMessages,
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        if (data.error_code == 901) {
                            this.router.navigate(['/add-card'], {queryParams : {
                                candies_package_id : this.candies_package_id
                            }});
                        } else {
                            this.router.navigate(['/candies-payment-failure']);
                        }
                    }
                },

                (err : HttpErrorResponse) => {
                    this.errorMessages = 'Oops! Something Went Wrong';

                    $.toast({
                        heading: 'Error',
                        text: this.errorMessages,
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