import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RequestService } from '../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

declare var $: any ;
@Component({
  selector: 'app-dcma-compliant-form',
  templateUrl: './dcma-compliant-form.component.html',
  styleUrls: ['./dcma-compliant-form.component.css']
})
export class DcmaCompliantFormComponent implements OnInit {

  errorMessages : string;
  url : string;
  email : string;
  more_info : string;

  constructor(private requestService : RequestService, private router : Router) {
    this.errorMessages = '';
    this.url = '';
    this.email = '';
    this.more_info = '';
   }

  ngOnInit() {

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

  dcmaFormFn(form : NgForm) {
    if (form.value['url'] == undefined || form.value['url'] == '' || form.value['url'] == null) {
      this.toast_message("Error", "Please enter Infringing URL");
      return false;
  }

  if (form.value['email'] == undefined || form.value['email'] == '' || form.value['email'] == null) {
      this.toast_message("Error", "Enter your email address");
      return false;
  }

  
  if (form.value['more_info'] == undefined || form.value['more_info'] == '' || form.value['more_info'] == null) {
    this.toast_message("Error", "Write some information");
    return false;
  }

  form.value['reference'] = 'streamvertigo';

  this.requestService.postMethod('dcmaCompliant', form.value)
        .subscribe(
            (data : any ) => {
                if (data.success == true) {
                    this.toast_message("Success", "Sent successfully");
                    $('#dcmaForm')[0].reset();
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
