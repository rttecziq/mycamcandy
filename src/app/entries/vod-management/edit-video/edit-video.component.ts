import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { VodEdit } from '../../../models/vod-edit';

declare var $: any ;

@Component({
    templateUrl: 'edit-video.component.html',
    styleUrls:[ '../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/mdb.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css',
                '../../../../assets/css/component.css',
    ]
})

export class EditVideoComponent{

    errorMessages : string;

    vod_video : VodEdit;

    image : File;

    video : File;

    vod_image : string;

    video_id : number;
    
    constructor(private requestService : RequestService, private router : Router, private route : ActivatedRoute) {

        this.errorMessages = "";

        this.image = null;

        this.video = null;

        this.route.queryParams.subscribe(params => {

            this.video_id = params['video_id'];

            let details = {video_id : params['video_id']};

            this.loadVod('vod/videos/view', details);

        });

        this.vod_video = {

            vod_id : this.video_id,

            title : "",

            description : "",

            publish_time : "",

            publish_type : 1,

        };
        
    }

    ngAfterViewInit(){
       /* $.getScript('../../../../assets/js/script.js',function(){
        });
        $.getScript('../../../../assets/js/custom-file-input.js',function(){
        });
        $.getScript('../../../../assets/js/classie.js',function(){
        });
        $.getScript('../../../../assets/js/form.js',function(){
        }); 
        $.getScript('../../../../assets/js/lightbox.min.js',function(){
        });*/
    }

     // To save the temporary file object into this variable with preview image

     handleVodImage(files: FileList) {

        this.image = files.item(0);

        var reader = new FileReader();
        
        reader.onload = (event: any) => {
          
            this.vod_image = event.target.result;

        }
        reader.readAsDataURL(files.item(0));

    }

    // To save the cover picture in temp object with preview image

    handleVodVideo(files : FileList) {

        this.video = files.item(0);

    }

    // Load Vod video based on video id

    loadVod(url, object) {

        this.requestService.postMethod(url, object)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        data.data.publish_time = new Date(data.data.publish_time);

                        this.vod_video = data.data;

                        this.vod_image = data.data.image;
                        

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

    // to save vod video

    saveVod(form : NgForm) {

        if (this.image !== undefined && this.image !== null) {
            
            form.value['image'] = this.image;

        }

        if (this.video !== undefined && this.video !== null) {

            form.value['video'] =  this.video;

        }

        form.value['video_id'] =  this.video_id;

        var d = new Date(form.value['publish_time']);

        var curr_day = d.getDate();
        var curr_month = d.getMonth();
        var curr_year = d.getFullYear();

        curr_month++ ; // In js, first month is 0, not 1

        form.value['publish_time'] = curr_month+'/'+curr_day+'/'+curr_year;

        $("#upload_button").attr('disabled', true);

        $("#upload_button").text('Uploading...');
        
        this.requestService.postMethod('vod/videos/save', form.value)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        $.toast({
                            heading: 'Success',
                            text: "VOD video has been updated successfully..!",
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        return this.router.navigate(['/vod-list']);

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
                ()=> {

                    $("#upload_button").attr('disabled', false);

                    $("#upload_button").text("Submit");
                }

            );
    }
}