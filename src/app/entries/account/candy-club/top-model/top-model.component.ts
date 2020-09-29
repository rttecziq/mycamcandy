import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
//import {TimeAgoPipe} from 'time-ago-pipe';

declare var $: any;

@Component({
  selector: 'app-top-model',
  templateUrl: './top-model.component.html',
  styleUrls: ['./top-model.component.css']
})
export class TopModelComponent implements OnInit {
  model_id:string;
  all_top_models:string;
  errorMessages : string;
  constructor(private requestService : RequestService, private router : Router) {
    this.model_id = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
    this.all_top_models='';
    this.errorMessages = '';
   }

  ngOnInit() {
    let data={model_id:this.model_id, topModelsEarning:'listAllTopModel'}
    this.top_model_fn("topModel", data);
  }
  
  top_model_fn(url, object) {  
    this.requestService.postMethod(url, object)
      .subscribe((data : any ) => {
          if (data.success == true) { 
            this.all_top_models =data.data;  
          } else {
            this.errorMessages = data.error_messages;
            this.toast_message("Error", this.errorMessages);
          }

      },(err : HttpErrorResponse) => {
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
