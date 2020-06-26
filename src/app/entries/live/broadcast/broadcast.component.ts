import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RequestService } from '../../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BroadCast } from '../../../models/broadcast';

declare var $: any ;

declare function getBrowser() : any;

@Component({
    templateUrl: 'broadcast.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/mdb.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css',
    ]   
})

export class BroadcastComponent implements AfterViewInit{

    

    errorMessages : string;

    broadcast : BroadCast;

    is_ongoing_call_present : boolean;

    groups_list : any;

    constructor(private requestService : RequestService, private router : Router) {

        this.errorMessages = '';

        this.is_ongoing_call_present = false;

        this.checkOngoingBroadcast();

        this.broadcast = {

            title : "",

            type : 'public',

            payment_status : 0,

            amount : 0,

            description : "",

            live_group_id : 0

        }

        this.groups_list = [];

        this.groupsList();
    }

    resetForm() {
        $("#form")[0].reset();

        this.broadcast = {

            title : "",

            type : 'public',

            payment_status : 0,

            amount : 0,

            description : "",

            live_group_id : ""
        }
    }

    ngAfterViewInit(){
        $.getScript('../../../../assets/js/script.js',function(){
        });
        $.getScript('../../../../assets/js/custom-file-input.js',function(){
        });
        $.getScript('../../../../assets/js/classie.js',function(){
        });
        $.getScript('../../../../assets/js/form.js',function(){
        });

        this.user_profile_fn("userDetails", "");
    }


    user_profile_fn(url, object) {

        this.requestService.getMethod(url, object)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                       if(data.user_type == 0) {

                            return this.router.navigate(['/subscription']);

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

                }

            );

    }
    
    saveBroadcasting(form : NgForm) {

        var browser = getBrowser();

        form.value['browser'] = browser;

        this.requestService.postMethod('save_live_video', form.value)
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


    checkOngoingBroadcast() {
        this.requestService.postMethod("check_user_call", "")
        .subscribe(
            (data : any) => {
                if (data.success == true) {

                    this.is_ongoing_call_present = false;

                } else {

                    this.is_ongoing_call_present = true;

                    return false;
                    
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

    groupsList() {
        this.requestService.postMethod("groups/index", {type : 'owned'})
        .subscribe(
            (data : any) => {
                if (data.success == true) {

                    this.groups_list = data.data.groups;

                } else {

                    this.groups_list = [];
                    
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

    // Clear Ongoing calls, when the clicks proceed

    clearOngoingStreaming() {

        this.requestService.postMethod("erase_videos", "")
            .subscribe(
                (data : any) => {
                    if (data.success == true) {

                        $("#clear_ongoing_streaming_button").click();

                        this.checkOngoingBroadcast();

                        $.toast({
                            heading: 'Success',
                            text: "All Video got erased, Start with New Broadcasting Video..!",
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

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