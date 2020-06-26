import { Component } from '@angular/core';
import { RequestService } from 'src/app/common/services/request.service';
import { Router } from '@angular/router';
import { LiveTv } from 'src/app/models/livetv';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';


declare var $ : any;

@Component({
    templateUrl: 'upload.component.html',
    styleUrls:[
        '../../../../assets/css/bootstrap/css/bootstrap.css',
        '../../../../assets/css/font-awesome/css/font-awesome.min.css',
        '../../../../assets/css/jquery-ui.css',
        '../../../../assets/css/mdb.css',
        '../../../../assets/css/style.css',
        '../../../../assets/css/responsive.css',
        '../../../../assets/css/component.css',
    ]
})

export class UploadLiveVideoComponent{

    errorMessages : string;

    live_tv_obj : LiveTv;

    image : File;

    live_tv_image : string;

    constructor(private requestService : RequestService, private router : Router) {

        this.errorMessages = "";

        this.image = null;

        this.live_tv_image = '../../../../assets/img/bg-image.jpg';

        this.live_tv_obj = {

            title : "",

            description : "",
        
            rtmp_video_url : "",
        
            hls_video_url : "",
        
            image : "",
        
            live_video_id : 0,

            custom_live_video_id : 0,

            status : 0,
        
            created_date : "",
        
            category_name : "",
        
            created_time : ""
            
        };
        
    }

     // To save the temporary file object into this variable with preview image

    handleLiveTvImage(files: FileList) {

        this.image = files.item(0);

        var reader = new FileReader();
        
        reader.onload = (event: any) => {
          
            this.live_tv_image = event.target.result;

        }
        reader.readAsDataURL(files.item(0));

    }


    // to save vod video

    saveLiveTV(form : NgForm) {

        if (this.image !== undefined && this.image !== null) {
            
            form.value['image'] = this.image;

        }

        $("#upload_button").attr('disabled', true);

        $("#upload_button").text('Uploading...');
        
        this.requestService.postMethod('custom/video/save', form.value)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        $.toast({
                            heading: 'Success',
                            text: "Live TV video has been uploaded successfully..!",
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        return this.router.navigate(['/live-tv/list']);

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
