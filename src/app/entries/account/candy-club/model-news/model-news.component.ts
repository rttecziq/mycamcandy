import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {TimeAgoPipe} from 'time-ago-pipe';

declare var $: any;

@Component({
  selector: 'app-model-news',
  templateUrl: './model-news.component.html',
  styleUrls: ['./model-news.component.css']
})
export class ModelNewsComponent implements OnInit {

  errorMessages : string;
  sliders : any[];
  constructor(private requestService : RequestService, private router : Router) { 
    this.errorMessages='';
    this.sliders = [];
  }

  ngOnInit() {
    let data={type:'model'};
    this.getModeNewsFn('getModelNews',data);
  }

  getModeNewsFn(url,object){
    this.requestService.postMethod(url,object) 
    .subscribe((data : any) => {
      if (data.success == true) {
        this.sliders = data.data;
      } else {
          this.errorMessages = data.error_messages;
          this.toast_message("Error", this.errorMessages);
      }
    },
      (err : HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';
        this.toast_message("Error", this.errorMessages);
    });
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

}
