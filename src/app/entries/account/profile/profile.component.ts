import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RequestService } from '../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { User } from '../../../models/user';
import { CheckStreamerService } from '../../../common/services/check-streamer.service';

declare var $: any ;

@Component({
    templateUrl: './profile.component.html',
    styleUrls:[ '../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/mdb.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css',
                '../../../../assets/css/component.css',
    ]
})

export class ProfileComponent implements AfterViewInit{
    resetForm() {
        $("#form1")[0].reset();
        $("#form2")[0].reset();
        $("#form3")[0].reset();
    }

    updateProfileReset() {

        

    }

    errorMessages : string;

    user_details : User;

    profile_picture : File;

    cover_picture : File;

    user_profile_picture : string;

    user_cover_picture : string;

    is_content_creator : boolean;

    blockers : any[];

    fileInputs : FileList;

    gallery_pictures : any[];

    blockersSkipCount : number;

    showBlockerLoader : boolean;

    gallerySkipCount : number;

    showGalleryLoader : boolean;

    userId : string;

    blockerDatasAvailable : number;

    galleryDatasAvailable : number;

    constructor(private requestService : RequestService, private router : Router, private location : Location, private checkStreamerService :CheckStreamerService) {

        this.profile_picture = null;

        this.cover_picture = null;

        this.blockerDatasAvailable = 0;

        this.galleryDatasAvailable = 0;

        this.user_details = {

            name : "",
            email : "",
            cover : "",
            picture : "",
            no_of_followers : "",
            no_of_followings : "",
            total_user_amount : "",
            description : "",
            login_by : "",
            gallery_description : ""
        }

        this.user_profile_picture = "../../../../assets/img/pro-img.jpg";

        this.user_cover_picture = "../../../../assets/img/bg-image.jpg";

        this.is_content_creator = false;

        this.blockers = [];

        this.gallery_pictures = [];

        this.blockersSkipCount = 0;

        this.showBlockerLoader = false; 

        this.gallerySkipCount = 0;

        this.showGalleryLoader = false;
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
        }); */

        // Load Logged In User Profile

        setTimeout(()=>{

            this.user_profile_fn("userDetails", "");

            this.blockersList("blockersList", {skip:0});

            let user_id = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';

            this.userId = user_id;
    
            this.galleries('streamer/galleries/list', {skip : 0, user_id : user_id});

        }, 1000);

    }

    // To save the temporary file object into this variable with preview image

    handleProfilePicture(files: FileList) {

        this.profile_picture = files.item(0);

        if(!files.item(0).type.match('image')) {

            $.toast({
                heading: 'Warning',
                text: "Please choose image with extensions .png, .jpg, .jpeg",
            // icon: 'error',
                position: 'top-right',
                stack: false,
                textAlign: 'left',
                loader : false,
                showHideTransition: 'slide'
            });

            return false;

        }

        var reader = new FileReader();
        
        reader.onload = (event: any) => {
          
            this.user_profile_picture = event.target.result;

        }
        reader.readAsDataURL(files.item(0));

    }

    // To save the cover picture in temp object with preview image

    handleCoverPicture(files : FileList) {

        this.cover_picture = files.item(0);

        if(!files.item(0).type.match('image')) {

            $.toast({
                heading: 'Warning',
                text: "Please choose image with extensions .png, .jpg, .jpeg",
            // icon: 'error',
                position: 'top-right',
                stack: false,
                textAlign: 'left',
                loader : false,
                showHideTransition: 'slide'
            });

            return false;

        }

        var reader = new FileReader();
        
        reader.onload = (event: any) => {
          
            this.user_cover_picture = event.target.result;

        }
        reader.readAsDataURL(files.item(0));

    }

    // To save the gallery picture in temp object with preview image

    handleGalleryPicture(event) {
        
        this.fileInputs = event.target.files;
        
    }

    user_profile_fn(url, object) {

        this.requestService.getMethod(url, object)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        this.user_details = data; 

                        this.user_cover_picture = data.cover;

                        this.user_profile_picture = data.picture;

                        this.is_content_creator = data.is_content_creator;

                        this.checkStreamerService.emit({is_content_creator : data.is_content_creator, user_type : data.user_type});

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

    // To change the password of the logged in user

    changePasswordFn(form : NgForm) {

        if (confirm('Are you sure ? You want to change your password? ? ')) {

            this.requestService.postMethod('changePassword', form.value)
                .subscribe(
                    (data : any ) => {

                        if (data.success == true) {

                            localStorage.removeItem('accessToken');

                            localStorage.removeItem('userId');

                            //localStorage.clear();

                            $.toast({
                                heading: 'Success',
                                text: "You have been logged out successfully",
                            // icon: 'error',
                                position: 'top-right',
                                stack: false,
                                textAlign: 'left',
                                loader : false,
                                showHideTransition: 'slide'
                            });

                            if (this.is_content_creator) {

                                this.router.navigate(['/login'], {queryParams : {uType : 'creator'}});

                            } else {

                                this.router.navigate(['/login'], {queryParams : {uType : 'viewer'}});
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
    }

    // To delete the account of the logged in user

    deleteAccountFn(form : NgForm) {

        this.requestService.postMethod('deleteAccount', form.value)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        localStorage.removeItem('accessToken');

                        localStorage.removeItem('userId');

                        //localStorage.clear();

                        $.toast({
                            heading: 'Success',
                            text: "You have been logged out successfully",
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        this.router.navigate(['/login']);

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

    // To update the profile page of logged in user

    updateProfileFn(form : NgForm) {

        if (form.value['name'] == undefined || form.value['name'] == '' || form.value['name'] == null) {

            $.toast({
                heading: 'Error',
                text: "Name should not be an Empty",
            // icon: 'error',
                position: 'top-right',
                stack: false,
                textAlign: 'left',
                loader : false,
                showHideTransition: 'slide'
            });

            return false;

        }

        if (this.profile_picture !== undefined && this.profile_picture !== null) {
            
            form.value['picture'] = this.profile_picture;

        }

        if (this.cover_picture !== undefined && this.cover_picture !== null) {

            form.value['cover'] =  this.cover_picture;

        }
        
        this.requestService.postMethod('updateProfile', form.value)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        $.toast({
                            heading: 'Success',
                            text: "Your profile has been updated successfully",
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        location.reload();

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

    // Become an Streamer

    becomeStreamer() {

        if(confirm('Are you sure want to become Streamer ?')) {

            this.requestService.postMethod('become/operator', "")
                .subscribe(
                    (data : any ) => {

                        if (data.success == true) {

                            $.toast({
                                heading: 'Success',
                                text: data.message,
                            // icon: 'error',
                                position: 'top-right',
                                stack: false,
                                textAlign: 'left',
                                loader : false,
                                showHideTransition: 'slide'
                            });

                            this.is_content_creator = true;

                            this.user_profile_fn("userDetails", "");

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

    // To get blocked users by you

    blockersList(url, object) {

        this.showBlockerLoader = true;

        this.requestService.postMethod(url, object)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        this.blockerDatasAvailable = 1;

                        if (this.blockersSkipCount > 0) {

                            this.blockers = [...this.blockers, ...data.data];

                        } else {

                            this.blockers = data.data;

                        }

                        this.blockersSkipCount += data.data.length;

                        if (data.data.length <= 0) {

                            this.blockerDatasAvailable = 0;
    
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

                },

                () => {

                    setTimeout(()=> {
                        
                        this.showBlockerLoader = false;

                    }, 2000);

                }

            );
    }

    // To unblock the user


    unBlockUser(user_id, type, index) {

        let details = {blocker_id : user_id};

        this.requestService.postMethod('unblock_user', details)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        $("#"+type+"_"+index).text('Unblocked');

                        $("#"+type+"_"+index).attr('disabled', true);

                        $.toast({
                            heading: 'Success',
                            text: "You are unblocking the user, you will get the user in suggestions list",
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

    
    // To update the gallery details

    galleryForm(form : NgForm) {

        if (form.value['gallery_description'] == null || form.value['gallery_description'] == undefined || form.value['gallery_description'] == '') {

            $.toast({
                heading: 'Error',
                text: "Gallery Description should not an empty",
            // icon: 'error',
                position: 'top-right',
                stack: false,
                textAlign: 'left',
                loader : false,
                showHideTransition: 'slide'
            });

            return false;
        }

        let formData = new FormData();

		// By Default added device type and login type in future use
		formData.append('id',  (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '');
		formData.append('token', (localStorage.getItem('accessToken') != '' && localStorage.getItem('accessToken') != null && localStorage.getItem('accessToken') != undefined) ? localStorage.getItem('accessToken') : '');

        formData.append('gallery_description', form.value['gallery_description']);

        for (let i = 0; i < this.fileInputs.length; i++) {
            const file = this.fileInputs[i];
            if (!file.type.match('image')) {
              continue;
            }

            formData.append("image[]", file, file['name']);
  
        }

		// By Default added device type and login type in future use
		formData.append('login_by', "manual");
		formData.append('device_type', "web");

		this.requestService.uploadMultipleImage('streamer/galleries/save', formData)
        .subscribe(
            (data : any ) => {

                if (data.success == true) {

                    $.toast({
                        heading: 'Success',
                        text: data.message,
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });

                    $("#gallery-form")[0].reset();

                    // location.reload();

                    $("#upload_close").click();

                    let user_id = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
            
                    this.galleries('streamer/galleries/list', {skip : 0, user_id : user_id});

                    this.user_profile_fn("userDetails", "");

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

    // To get gallery details
    galleries(url, object) {

        this.showGalleryLoader = true;

        this.requestService.postMethod(url, object)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        this.galleryDatasAvailable = 1;

                        if (this.gallerySkipCount > 0) {

                            this.gallery_pictures = [...this.gallery_pictures, ...data.data];

                        } else {

                            this.gallery_pictures = data.data;

                        }

                        this.gallerySkipCount += data.data.length;

                        if (data.data.length <= 0) {

                            this.galleryDatasAvailable = 0;
    
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

                },
                () => {

                    setTimeout(()=> {
                        
                        this.showGalleryLoader = false;

                    }, 2000);

                }

            );

    }

    // To get gallery details
    deleteGalleryPicture(gallery_id, index) {

        this.requestService.postMethod("streamer/galleries/delete", {gallery_id : gallery_id})
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        $("#gallery_pic_"+index).hide();

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

    showMoreBlockers() {

        this.blockersList("blockersList", {skip:this.blockersSkipCount});

    }

    showMoreGallery() {

        this.galleries("streamer/galleries/list", {skip:this.gallerySkipCount, user_id : this.userId});

    }
}