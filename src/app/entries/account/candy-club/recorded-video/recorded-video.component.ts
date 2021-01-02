import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $ : any;

@Component({
  selector: 'app-recorded-video',
  templateUrl: './recorded-video.component.html',
  styleUrls: ['./recorded-video.component.css']
})
export class RecordedVideoComponent implements AfterViewInit  {

  errorMessages : string;
  loader : boolean;
  recorded_video_lists : any[];
  app_url : string;
  active_video : any[];

  showModalBox: boolean = false;

  constructor(private requestService : RequestService, private router : Router) {
    this.errorMessages = "";
    this.loader = false;
    this.recorded_video_lists = [];
    this.app_url = this.requestService.adminUrl;
    this.active_video = [];
    this.recorded_video_lists_fn("recorded_videos/list", "");
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

  // Recorded video lists
  recorded_video_lists_fn(url, object) {
    this.loader = true;
    this.requestService.postMethod(url,object)
    .subscribe(
        (data : any) => {
            if (data.success == true) {
              this.recorded_video_lists = data.data;
              //  console.log(this.recorded_video_lists);
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

  showPopup(video) {
    // console.log(video);
    if(0){
      this.showModalBox = false;
    } else {
       this.active_video = video;
       this.showModalBox = true;
    }
  }

}