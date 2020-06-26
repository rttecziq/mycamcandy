import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any ;

@Component({
  selector: 'app-vip-membership',
  templateUrl: './vip-membership.component.html',
  styleUrls: ['./vip-membership.component.css',
              '../../../../../assets/css/style.css',]
})
export class VipMembershipComponent implements AfterViewInit {
  errorMessages : string;
  subscriptions : any[];

  constructor(private requestService : RequestService, private router : Router) {

      this.errorMessages = "";
      this.subscriptions = [];

  }

  ngAfterViewInit() {

      this.subscriptionDetailsFn('subscription_plans', "");

  }

  // Load subscription Details

  subscriptionDetailsFn(url, object) {
      this.requestService.postMethod(url, object) 
          .subscribe(
              (data : any) => {
                  if (data.success == true) {
                      this.subscriptions = data.data;   
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
