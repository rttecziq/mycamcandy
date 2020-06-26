import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';

declare var $:any;
declare var Stripe: any;

@Component({
    templateUrl: 'add-card.component.html',
    styleUrls:['../../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../../assets/css/jquery-ui.css',
                '../../../../../assets/css/style.css',
                '../../../../../assets/css/responsive.css'
    ]   
})

export class AddCardComponent implements AfterViewInit{
    error: string;
    errorMessages: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
    stripe_publishable_key: string;
    site_settings: any;
    subscription_id: number;
    candies_package_id: number;
    vod_id: string;
    video_id: number;

    constructor(private router:Router, private requestService : RequestService, private route : ActivatedRoute) {
        this.site_settings = JSON.parse(localStorage.getItem('site_settings'));

        this.route.queryParams.subscribe(params => {
            this.subscription_id = params['subscription_id'];
            this.candies_package_id = params['candies_package_id'];
            this.vod_id = params['vod_id'];
            this.video_id = params['video_id'];
        });
    }

    ngAfterViewInit(){
            let stripe_publishable_key = (this.site_settings).filter(obj => {
                return obj.key === 'stripe_publishable_key'
            });
    
            this.stripe_publishable_key = stripe_publishable_key.length > 0 ? stripe_publishable_key[0].value : '';
            Stripe.setPublishableKey(this.stripe_publishable_key);
    }
    
    addCard(form : NgForm) {
        $("#add_card_button").attr('disabled', true);
        $("#add_card_button").text('Adding...');
        
        (<any>window).Stripe.card.createToken({
            number: this.cardNumber,
            exp_month: this.expiryMonth,
            exp_year: this.expiryYear,
            cvc: this.cvc
        }, (status: number, response: any) => {
            if (status === 200) {
                console.log( `Success! Card token ${response.id}.`);
                form.value["card_token"] = `${response.id}`;
            } else {
                $.toast({
                    heading: 'Error',
                    text: response.error.message,
                    position: 'top-right',
                    stack: false,
                    textAlign: 'left',
                    loader : false,
                    showHideTransition: 'slide'
                });

                return false;
            }
        });
        setTimeout(() => {
            this.requestService.postMethod("payment_card_add", form.value)
            .subscribe(
                (data : any) => {
                    if (data.success == true) {
                        $.toast({
                            heading: 'Success',
                            text: "Your card has been added successfully..!",
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        if(this.subscription_id > 0) {
                            this.router.navigate(['/invoice'], {queryParams : {subscription_id : this.subscription_id}});
                        } else if(this.vod_id){
                            this.router.navigate(['/vod/invoice'], {queryParams : {vod_id : this.vod_id}});
                        } else if(this.video_id > 0){
                            this.router.navigate(['/video/invoice'], {queryParams : {video_id : this.video_id}});
                        } else if (this.candies_package_id > 0) {
                            this.router.navigate(['/buy_candies'], {queryParams : {
                                candies_package_id : this.candies_package_id
                            }});
                        } else {
                            this.router.navigate(['/card-details']);
                        }
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

                        if (data.error_code == 154) {
                            if (this.candies_package_id > 0) {
                                return this.router.navigate(['/candies-package']);
                            } else {
                                return this.router.navigate(['/subscription']);
                            }
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
                    $("#add_card_button").attr('disabled', false);
                    $("#add_card_button").text("Add Card");
                }
            );
        }, 2000);
    }
}