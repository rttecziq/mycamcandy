import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { VodUpload } from '../../../models/vod-upload';


declare var $: any ;

@Component({
    templateUrl: 'upload-video.component.html',
    styleUrls:[ '../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/mdb.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css',
                '../../../../assets/css/component.css',
    ]
})

export class UploadVideoComponent{

    errorMessages : string;

    vod_video : VodUpload;

    image : File;

    video : File;

    vod_image : string;

    constructor(private requestService : RequestService, private router : Router) {

        this.errorMessages = "";

        this.image = null;

        this.video = null;

        this.vod_image = '../../../../assets/img/bg-image.jpg';

        this.vod_video = {

            title : "",

            description : "",

            publish_type : 1,

            publish_time : "",
            
        };
        
    }

    ngAfterViewInit(){
        /*$.getScript('../../../../assets/js/script.js',function(){
        });
        $.getScript('../../../../assets/js/custom-file-input.js',function(){
        });
        $.getScript('../../../../assets/js/classie.js',function(){
        });
        $.getScript('../../../../assets/js/form.js',function(){
        });
        $.getScript('../../../../assets/js/lightbox.min.js',function(){
        }); */
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

    // to save vod video

    saveVod(form : NgForm) {

        if (this.image !== undefined && this.image !== null) {
            
            form.value['image'] = this.image;

        }

        if (this.video !== undefined && this.video !== null) {

            form.value['video'] =  this.video;

        }

        $("#upload_button").attr('disabled', true);

        $("#upload_button").text('Uploading...');
        
        this.requestService.postMethod('vod/videos/save', form.value)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        $.toast({
                            heading: 'Success',
                            text: "VOD video has been uploaded successfully..!",
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