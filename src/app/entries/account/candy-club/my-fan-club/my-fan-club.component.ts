import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any ;

@Component({
  selector: 'app-my-fan-club',
  templateUrl: './my-fan-club.component.html',
  styleUrls: ['./my-fan-club.component.css']
})
export class MyFanClubComponent implements AfterViewInit {
  errorMessages : string;

  subscribed_plans : any[];

  showLoader : boolean;

  skipCount : number;

  datasAvailable : number;

  constructor(private requestService : RequestService, private router : Router) {

    this.errorMessages = "";

    this.subscribed_plans = [];  

    this.showLoader = false;

    this.skipCount = 0;

    this.datasAvailable = 0;

  }

  ngAfterViewInit(){

    setTimeout(() => {

        let details = {skip : 0};

        this.subscribedPlansFn('subscribedPlans', details);

    }, 2000);
    
  }

  subscribedPlansFn(url, object) {

    this.showLoader = true;

    this.requestService.postMethod(url, object)
        .subscribe(

            (data : any) => {

                if (data. success == true) {

                    this.datasAvailable = 1;
                    
                    if (this.skipCount > 0) {

                        this.subscribed_plans = [...this.subscribed_plans, ...data.data];
                    
                    } else {

                        this.subscribed_plans = data.data;
                    
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

pauseAutorenewal() {

    var reason = $("#desc").val();
    
    let details = {cancel_reason : reason};

    this.requestService.postMethod("cancel/subscription", details)
        .subscribe(
            (data : any) => {

                if (data.success == true) {

                    $("#pause_autorenewal_close").click();

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

                    this.subscribed_plans[0] = data.data;

                    // let details = {skip : 0};

                    // this.subscribedPlansFn('subscribedPlans', details);

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

  enableAutorenewal() {

    this.requestService.postMethod("autorenewal/enable", "")
    .subscribe(
        (data : any) => {

            if (data.success == true) {

                $("#enable_autorenewal_close").click();

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

                this.subscribed_plans[0] = data.data;
                //let details = {skip : 0};

                //this.subscribedPlansFn('subscribedPlans', details);

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

  showMore() {

      this.subscribedPlansFn('subscribedPlans', {skip:this.skipCount});

  }

}
