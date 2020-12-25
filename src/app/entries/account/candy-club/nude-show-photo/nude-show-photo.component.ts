import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $ : any;

@Component({
  selector: 'app-nude-show-photo',
  templateUrl: './nude-show-photo.component.html',
  styleUrls: ['./nude-show-photo.component.css']
})
export class NudeShowPhotoComponent implements AfterViewInit {

  errorMessages : string;
  loader : boolean;
  photo_lists : any[];
  app_url : string;

  constructor(private requestService : RequestService, private router : Router) {
    this.errorMessages = "";
    this.loader = false;
    this.photo_lists = [];
    this.app_url = this.requestService.adminUrl;

    let detail = {show_type:"Nude"};
    this.nude_show_photo_list("recorded_photos/list", detail);
  }

  ngAfterViewInit () {
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

  // nude show photo list
  nude_show_photo_list(url, object) {
    this.loader = true;
    this.requestService.postMethod(url,object)
    .subscribe(
        (data : any) => {
            if (data.success == true) {
              this.photo_lists = data.data;
              this.loader = false;
            } else {
              this.loader = false;
            }
        },
        (err : HttpErrorResponse) => {
            this.errorMessages = 'Oops! Something Went Wrong';
            this.toast_message("Error", this.errorMessages);
        }

    );

}

}