import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RequestService } from '../../../../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Album } from '../../../../../models/album';

declare var $:any;

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.css']
})
export class AlbumDetailsComponent implements OnInit {

  errorMessages : string;
  album_id: string;

  collection_list : any;
  
  // album
  candies_check  = false;
  password_check = false;
  albums : Album;
  album_cover : File;
  album_cover_image : string;
  album_video : FileList;
  album_videos : any;
  album_photo : FileList;
  album_photos : any;

    is_content_creator : boolean;  
    isUserExists : string;
    userId : string;
    username : string;

  album_photos_urls : string[] = [];
  album_videos_urls : string[] = [];

  album_details = [];

  constructor(private requestService : RequestService, private router : Router, private route: ActivatedRoute, private elementRef:ElementRef) {

    this.collection_list = [];
    this.album_cover = null;
    this.album_cover_image = "";
    this.album_video = null;
    this.album_videos = [];
    this.album_photo = null;
    this.album_photos = [];

    this.albums = {
      id : 0,
      model_id :0,
      title : "",
      tags : [],
      collection : "",
      password : "",
      candies : 0,
      listing : 0,
      vip : 0,
      featured : 0,
      video : '',
      photo : '',
      type : '',
      item_id : 0,
      album_cover_image : "",
      status : 0
  }
  this.album_details = [];

  this.is_content_creator = true;
      this.username = (localStorage.getItem('username') != '' && localStorage.getItem('username') != null && localStorage.getItem('username') != undefined) ? localStorage.getItem('username') : '';
      this.isUserExists = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.album_id = params['id'];
      
      let details = {album_id : this.album_id};
      this.editAlbumFn("album_list", details);
      this.model_collection_fn("listCollection", "");

   });
  }

  togglePassword(e) { this.password_check = e.target.checked; }
  toggleCandies(e)  { this.candies_check = e.target.checked;  }

    handleAlbumPhoto(event) {
        this.album_photo = event.target.files;
        // if (event.target.files && event.target.files[0]) {
        //     var filesAmount = event.target.files.length;
        //     for (let i = 0; i < filesAmount; i++) {
        //             var reader = new FileReader();

        //             reader.onload = (event:any) => {
        //                this.album_photos_urls.push(event.target.result);
        //             }
        //             reader.readAsDataURL(event.target.files[i]);
        //     }
        //            // console.log(this.album_photos_urls);  

        // }
    }

    handleAlbumVideo(event) {
        if (event.target.files && event.target.files[0]) {
            this.album_video = event.target.files;
            var filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                    var reader = new FileReader();
                    reader.onload = (event:any) => {
                       this.album_videos_urls.push(event.target.result);
                    }
                    reader.readAsDataURL(event.target.files[i]);
            }  
    
        }
    }

    handleAlbumCover(files : FileList) {
        this.album_cover = files.item(0);
        if(!files.item(0).type.match('image')) {
            this.toast_message("Warning", "Please choose image with extensions .png, .jpg, .jpeg");  
            return false;
        }
      
        var reader = new FileReader();  
        reader.onload = (event: any) => {    
          this.album_cover_image = event.target.result;    
        }
          reader.readAsDataURL(files.item(0));  
    
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

  model_collection_fn(url, object) {
    this.requestService.getMethod(url, object)
    .subscribe(
        (data : any ) => {
            if (data.success == true) {
                this.collection_list = data.data;
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

  editAlbumFn(url, object) {
    this.requestService.postMethod(url,object) 
        .subscribe(
            (data : any) => {
                if (data.success == true) {
                  this.albums = data.data[0];
                  this.album_details = data.data;
                  console.log(this.album_details);
                  this.candies_check = data.data[0]['candies'] != 0.00 ? true : false;
                  this.password_check = data.data[0]['password'] != '' ? true : false;
                } else {
                    this.toast_message("Error", data.error_messages);                    
                }
            },

            (err : HttpErrorResponse) => {
                this.errorMessages = 'Oops! Something Went Wrong';
                this.toast_message("Error", this.errorMessages);
            }
        );
  }

  deleteAlblumItem(item_id) {
      if (confirm('Are you sure you want to delte this item')) {
        
            if(item_id != 0) {
                let details = {item_id : item_id};
                this.requestService.postMethod('deleteAlbumItem', details)
            .subscribe(
                (data : any ) => {
                    if (data.success === true) {
                        this.toast_message("Success", "Deleted successfully");
                        location.reload();
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

      }
  }

  
albumUploadFormFn(form : NgForm) {
    
    let formData = new FormData();

    if (form.value['title'] == undefined || form.value['title'] == '' || form.value['title'] == null) {
        this.toast_message("Error", "Enter album title");
        return false;
    } else {
        formData.append('title', form.value['title']);
    }

    if( (form.value['password_check'] === false || form.value['password_check'] == 0) 
        && (form.value['candies_check'] === false || form.value['candies_check'] == 0)
        && (form.value['listing'] === false || form.value['listing'] == 0)
        && (form.value['vip'] === false || form.value['vip'] == 0)
        && (form.value['featured'] === false || form.value['featured'] == 0)
    ) {
        this.toast_message("Error", "Missing albums category");
        return false;
    }

    if (form.value['password_check'] && form.value['password'] == "") {
        this.toast_message("Error", "Enter album password");
        return false;
    }

    if (form.value['candies_check'] && form.value['candies'] == "" ) {
        this.toast_message("Error", "Candies field required");
        return false;
    } else {
        formData.append('candies', form.value['candies']);
    }

    if (this.album_cover !== undefined && this.album_cover !== null) {
        form.value['album_cover_image'] = this.album_cover;
    }
    //  else {
    //     this.toast_message("Error", "Enter album cover image");
    //     return false;
    // }

    if(form.value['tags'] == undefined || form.value['tags'] == ''){
        form.value['tags'] = "";
    }
    if(form.value['password'] == undefined){
        form.value['password'] = "";
    }

    form.value['listing']   = form.value['listing'] == true ? 1 : 0;
    form.value['vip']       = form.value['vip'] == true ? 1 : 0;
    form.value['featured']  = form.value['featured'] == true ? 1 : 0;

    formData.append('id',  (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '');
    formData.append('model_id',  (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '');
    formData.append('album_id', this.album_id);
    formData.append('token', (localStorage.getItem('accessToken') != '' && localStorage.getItem('accessToken') != null && localStorage.getItem('accessToken') != undefined) ? localStorage.getItem('accessToken') : '');
    formData.append('login_by', "manual");
	formData.append('device_type', "web");
    
    formData.append('tags', form.value['tags']);
    formData.append('collection', form.value['collection']); 

    if(form.value['password']) {
        formData.append('password', form.value['password']);
    }
    
    formData.append('listing', form.value['listing']);
    formData.append('vip', form.value['vip']);
    formData.append('featured', form.value['featured']);

    if(this.album_photo) {
        for (let i = 0; i < this.album_photo.length; i++) {
            const file = this.album_photo[i];
            if (!file.type.match('image')) {
            continue;
            }

            formData.append("photo[]", file, file['name']);
        }
    }

    if(this.album_video) {
        for (let i = 0; i < this.album_video.length; i++) {
            const file = this.album_video[i];
            if (!file.type.match('video')) {
            continue;
            }

            formData.append("video[]", file, file['name']);
        }
    }

    if(form.value['album_cover_image']) {
        formData.append('album_cover_image', form.value['album_cover_image']);
    }

    this.requestService.uploadAlbum('addAlbum', formData)
        .subscribe(
            (data : any ) => {
                if (data.success === true) {
                    this.toast_message("Success", "Album updated successfully");
                    $('#album_model_close').click();
                    location.reload();
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

}
