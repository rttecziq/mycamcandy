import { Component, AfterViewInit, ViewChild} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { RequestService } from '../../../../common/services/request.service';

declare var $: any ;

declare function getBrowser() : any;

@Component({
  selector: 'app-performer-dashboard',
  templateUrl: './performer-dashboard.component.html',
  styleUrls: ['./performer-dashboard.component.css']
})
export class PerformerDashboardComponent implements AfterViewInit {

  @ViewChild('channelBtn') channelBtn;
  private selectedChannel: string;

  errorMessages : string;
  performer_details : any[];
  model_id : string;
  model_name : string;
  channel_list : any[];
  channel_price : number;
  show_type : string;

  constructor(private requestService : RequestService, private router : Router) {
    this.errorMessages ="";
    this.performer_details = [];
    this.channel_list = [];
    this.selectedChannel = "";
    this.channel_price = 0;

    this.show_type = "Free";

    this.model_id   = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
    this.model_name = (localStorage.getItem('username') != '' && localStorage.getItem('username') != null && localStorage.getItem('username') != undefined) ? localStorage.getItem('username') : '';
  }

  ngAfterViewInit() {
    this.channel_list_fn("channel/list", "");
    this.performer_details_fn("show_type_with_price", "");
  }

  goLive(form : NgForm) {
    if (form.value['channel'] == undefined || form.value['channel'] == '' || form.value['channel'] == null) {
      this.toast_message("Error", "Select Channel name");
      return false;
    }
    if (form.value['show_type'] == undefined || form.value['show_type'] == '' || form.value['show_type'] == null) {
      this.toast_message("Error", "Select Show type");
      return false;
    }
    if (form.value['channel_cpm'] == undefined || form.value['channel_cpm'] == '' || form.value['channel_cpm'] == null) {
      this.toast_message("Error", "Enter Cost per minute");
      return false;
    }
    var browser = getBrowser();
    form.value['browser'] = browser;
    let details = {type:'public',show_type:form.value['show_type'], channel_id:this.selectedChannel, cpm:form.value['channel_cpm'],browser:form.value['browser']}
    console.log(details);

    this.update_show_price("channel/save", details);
    this.saveBroadcasting("save_live_video", details);
    
  }

  update_show_price(url, object) {
    this.requestService.postMethod(url, object)
    .subscribe(
        (data : any ) => {
            if (data.success == true) {
              //this.toast_message("Success", "Price updated successfully");

              // proceed with broadcast
            } else {
                this.errorMessages = data.error_message;
                this.toast_message("Error", this.errorMessages);
            }
        },
        (err : HttpErrorResponse) => {
            this.errorMessages = 'Oops! Something Went Wrong';
            this.toast_message("Error", this.errorMessages);
        }
    );
  }

  saveBroadcasting(url, object) {

    //var browser = getBrowser();

    //form.value['browser'] = browser;

    this.requestService.postMethod(url, object)
    .subscribe(

        (data : any) => {

            if (data.success == true) {
            
                $('body').removeClass('modal-open');
                
                $('.modal-backdrop').remove();

                $.toast({
        heading: 'Success',
        text: "Your Live Broadcasting saved successfully..!",
      // icon: 'error',
        position: 'top-right',
        stack: false,
        textAlign: 'left',
        loader : false,
        showHideTransition: 'slide'
      });

                this.router.navigate(['/single-video'] ,{queryParams : {video_id : data.video_id}}); 

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

                if (data.error_code == 154) {

                    return this.router.navigate(['/subscription']);

                }
                
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


  performer_details_fn(url, object) {
    this.requestService.getMethod(url, object)
    .subscribe(
        (data : any ) => {
            if (data.success == true) {
                this.performer_details = data.data;
                console.log(this.performer_details);
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

  channel_list_fn(url, object) {
    this.requestService.getMethod(url, object)
    .subscribe(
        (data : any ) => {
            if (data.success == true) {
                this.channel_list = data.data;
                //console.log(this.channel_list);
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

  addChannel(channelName, channelPrice){
    if(channelName == "" || channelPrice == ""){
      this.toast_message("Error", "Channel Name/price can not be empty");
      return;
    }

    let details = {model_id:this.model_id,channel_name:channelName,channel_price:channelPrice};
    this.requestService.postMethod("channel/save", details)
    .subscribe(
        (data : any ) => {
            if (data.success == true) {
                this.toast_message("Success", "Channel saved successfully");
                this.channel_list = data.data;
                this.channelBtn.nativeElement.click();

                //$('#channelBtn').click();
            } else {
                this.errorMessages = data.error_message;
                this.toast_message("Error", this.errorMessages);
            }
        },
        (err : HttpErrorResponse) => {
            this.errorMessages = 'Oops! Something Went Wrong';
            this.toast_message("Error", this.errorMessages);
        }
    );
  }

  onChange(selectedVal){
    // console.log(selectedVal);
      for (var key in this.channel_list) {
        //console.log(this.channel_list[key]);
        if(this.channel_list[key].id == selectedVal) {
          this.selectedChannel = selectedVal;
          this.channel_price = Math.round(this.channel_list[key].private_cost_per_deduction);
        }
      }
  }

}
