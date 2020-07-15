import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

declare var $: any ;



@Component({
  selector: 'app-sweet-treat',
  templateUrl: './sweet-treat.component.html',
  styleUrls: ['./sweet-treat.component.css']
})
export class SweetTreatComponent implements AfterViewInit {

  errorMessages : string;
  sweet_treats : any;
  username : string;

  constructor(private requestService : RequestService, private router : Router) {
    this.errorMessages ="";
    this.sweet_treats = [];

    let username = (localStorage.getItem('username') != '' && localStorage.getItem('username') != null && localStorage.getItem('username') != undefined) ? localStorage.getItem('username') : '';
    this.username = username;
  }

  ngAfterViewInit(){

      setTimeout(()=>{
      this.sweet_treat_list_fn("listSweetTreat", "");
   }, 1000);

  }

  toast_message(heading, message) {
    $.toast({
        heading: heading,
        text: message,
        position: 'top-right',
        stack: false,
        textAlign: 'left',
        loader : false,
        showHideTransition: 'slide'
    });
  }

  sweet_treat_list_fn(url, object) {  
      this.requestService.getMethod(url, object)
      .subscribe(
          (data : any ) => {
              if (data.success == true) {
                  this.sweet_treats = data.data;
              } else {
                  this.errorMessages = data.error_messages;
                  this.toast_message("Error", this.errorMessages);
              }
          },

          (err : HttpErrorResponse) => {
              this.errorMessages = 'Oops! Something Went Wrong';
              this.toast_message("Error", this.errorMessages);
          }
      );
  }

  unlist_sweet_treat(sweet_treat_id) {
    const formData = {
      sweet_treat_id : sweet_treat_id
    }

    this.requestService.postMethod("unlistSweetTreat", formData)
      .subscribe(
          (data : any ) => {
              if (data.success == true) {
                this.toast_message("Success", "Unlisted successfully");
                  location.reload();
              } else {
                  this.errorMessages = data.error_messages;
                  this.toast_message("Error", this.errorMessages);
              }
          },

          (err : HttpErrorResponse) => {
              this.errorMessages = 'Oops! Something Went Wrong';
              this.toast_message("Error", this.errorMessages);
          }
      );
  }

  

}