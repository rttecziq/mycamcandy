import { Component, AfterViewInit, CollectionChangeRecord } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../../common/services/user.service';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { User } from '../../../../models/user';
import { sweetTreat } from '../../../../models/sweet-treat';
import { Collection } from '../../../../models/collection';
import { Album } from '../../../../models/album';
import heic2any from "heic2any";

declare var $: any ;

@Component({
  selector: 'user-profile-tabs',
  templateUrl: './user-profile-tabs.component.html',
  styleUrls: ['./user-profile-tabs.component.css']
})
export class UserProfileTabsComponent implements AfterViewInit {

  errorMessages : string;
  user_details : User;  
  profile_picture : File;  
  cover_picture : File;  
  user_profile_picture : string;  
  user_cover_picture : string;
  sweet_treat_image : File;
  sweet_treat_featured_image : string;
  collection_image : File;
  collection_featured_image : string;
  is_content_creator : boolean;  
  isUserExists : string;
  userId : string;
  username : string;
  sweet_treat : sweetTreat;
  model_collection : Collection;

  collection_list : any;
  sweet_shop_count : any;
  
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

  album_photos_urls : string[] = [];
  album_videos_urls : string[] = [];
  heic_array : string[] = [];

  constructor(private userService : UserService, private requestService : RequestService, private router : Router) {
  
      this.profile_picture = null;  
      this.cover_picture = null;
      this.sweet_treat_image = null;
      this.collection_image = null;
      this.collection_list = [];
      this.sweet_shop_count = [];
      this.album_cover = null;
      this.album_cover_image = "";
      this.album_video = null;
      this.album_videos = [];
      this.album_photo = null;
      this.album_photos = [];

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

    this.sweet_treat = {
        title : "",
        candies : 0,
        listing : false,
        description : "",
        featured_image : "",
        secret_note : ""
    }

    this.model_collection = {
        collection_title : "",
        collection_candies : 0,
        collection_featured_image : "",
    }

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
        video : "",
        photo : "",
        type : "",
        item_id : 0,
        album_cover_image : "",
        status : 0
    }
  
      this.user_profile_picture = "../../../../assets/img/pro-img.jpg";  
      this.user_cover_picture = "../../../../assets/img/bg-image.jpg";
      this.sweet_treat_featured_image = "../../../../assets/img/default-profile.jpg";
      this.collection_featured_image = "../../../../assets/img/default-profile.jpg";
  
      this.is_content_creator = true;
      this.username = (localStorage.getItem('username') != '' && localStorage.getItem('username') != null && localStorage.getItem('username') != undefined) ? localStorage.getItem('username') : '';
      this.isUserExists = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
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
      $.getScript('../../../../assets/js/heic2any.js',function(){
    });
      // Load Logged In User Profile
  
      setTimeout(()=>{  
          this.user_profile_fn("userDetails", "");
          this.model_collection_fn("listCollection", "");  
      }, 1000);
  
  }

togglePassword(e) { this.password_check = e.target.checked; if(this.password_check === false) {this.albums.password = '';} }

toggleCandies(e) { this.candies_check = e.target.checked; if(this.candies_check === false) {this.albums.candies = 0;} }
  
  user_profile_fn(url, object) {
  
      this.requestService.getMethod(url, object)
          .subscribe(
              (data : any ) => {
  
                  if (data.success == true) {
                      this.user_details = data;
                      this.user_cover_picture = data.cover;
                      this.user_profile_picture = data.picture;
                      this.is_content_creator = data.is_content_creator;
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

  model_collection_fn(url, object) {
    this.requestService.getMethod(url, object)
    .subscribe(
        (data : any ) => {

            if (data.success == true) {
                this.collection_list = data.data;
                this.sweet_shop_count = data.sweet_shop_count;
                console.log(data);
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

handleSweetTreat(files : FileList) {
    this.sweet_treat_image = files.item(0);
    if(!files.item(0).type.match('image')) {
        this.toast_message("Warning", "Please choose image with extensions .png, .jpg, .jpeg");  
        return false;
    }
  
    var reader = new FileReader();  
    reader.onload = (event: any) => {    
      this.sweet_treat_featured_image = event.target.result;    
    }
    reader.readAsDataURL(files.item(0));
}

handleCollection(files : FileList) {
    this.collection_image = files.item(0);
    if(!files.item(0).type.match('image')) {
        this.toast_message("Warning", "Please choose image with extensions .png, .jpg, .jpeg");  
        return false;
    }
  
    var reader = new FileReader();  
    reader.onload = (event: any) => {    
      this.collection_featured_image = event.target.result;    
    }
    reader.readAsDataURL(files.item(0));
}

handleAlbumCover(files : FileList) {
    this.album_cover = files.item(0);
    // if(!files.item(0).type.match('image')) {
    //     this.toast_message("Warning", "Please choose image with extensions .png, .jpg, .jpeg");  
    //     return false;
    // }
  
    // var reader = new FileReader();  
    // reader.onload = (event: any) => {    
    //   this.album_cover_image = event.target.result;    
    // }
    //   reader.readAsDataURL(files.item(0));

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

handleAlbumPhoto(event) {
    this.album_photo = event.target.files;
    console.log(this.album_photo);
    if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = (event:any) => {
                   this.album_photos_urls.push(event.target.result);
                }
                reader.readAsDataURL(event.target.files[i]);
        }
               // console.log(this.album_photos_urls);  

    }
    

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
  sweetTreatFormFn(form : NgForm) {
    
    if (form.value['title'] == undefined || form.value['title'] == '' || form.value['title'] == null) {
        this.toast_message("Error", "Enter Sweet treat title");
        return false;
    }

    if (form.value['candies'] == undefined || form.value['candies'] == '' || form.value['candies'] == null) {
        this.toast_message("Error", "Candies field is missing");
        return false;
    }

    if (this.sweet_treat_image !== undefined && this.sweet_treat_image !== null) {            
        form.value['featured_image'] = this.sweet_treat_image;
    } else {
        this.toast_message("Error", "Add Sweet treat featured image");
        return false;
    }
    if (form.value['listing'] === true) {
        form.value['listing'] = 0;
    } else {
        form.value['listing'] = 1;
    }

    this.requestService.postMethod('sweetTreat', form.value)
        .subscribe(
            (data : any ) => {
                if (data.success == true) {
                    this.toast_message("Success", "Sweet Treat added successfully");
                    $('#sweet_treat_model_close').click();
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

collectionFormFn(form : NgForm) {
    
    if (form.value['collection_title'] == undefined || form.value['collection_title'] == '' || form.value['collection_title'] == null) {
        this.toast_message("Error", "Enter collection title");
        return false;
    }

    if (form.value['collection_candies'] == undefined || form.value['collection_candies'] == '' || form.value['collection_candies'] == null) {
        this.toast_message("Error", "Collection candies is missing");
        return false;
    }

    if (this.collection_image !== undefined && this.collection_image !== null) {            
        form.value['collection_featured_image'] = this.collection_image;
    } else {
        this.toast_message("Error", "Add collection featured image");
        return false;
    }
        
    this.requestService.postMethod('addCollection', form.value)
        .subscribe(
            (data : any ) => {
                if (data.success == true) {
                    this.toast_message("Success", "Collection added successfully");
                    $('#collection_model_close').click();
                    this.router.navigate(['/candy-club/'+this.username+'/collection']);
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
    } else {
        this.toast_message("Error", "Enter album cover image");
        return false;
    }

    if(form.value['tags'] == undefined){
        form.value['tags'] = "";
    }
    if(form.value['password'] == undefined){
        form.value['password'] = "";
    }

    if(this.album_photo == null && this.album_video == null) {
        this.toast_message("Error", "Missing album image/video");
        return false;
    }

    form.value['listing']   = form.value['listing'] === true ? 1 : 0;
    form.value['vip']       = form.value['vip'] === true ? 1 : 0;
    form.value['featured']  = form.value['featured'] === true ? 1 : 0;



    formData.append('id',  (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '');
    formData.append('model_id',  (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '');
    formData.append('token', (localStorage.getItem('accessToken') != '' && localStorage.getItem('accessToken') != null && localStorage.getItem('accessToken') != undefined) ? localStorage.getItem('accessToken') : '');
    formData.append('login_by', "manual");
	formData.append('device_type', "web");
    
    formData.append('tags', form.value['tags']);
    formData.append('collection', form.value['collection']);  
    formData.append('password', form.value['password']);
    formData.append('listing', form.value['listing']);
    formData.append('vip', form.value['vip']);
    formData.append('featured', form.value['featured']);


    if(this.album_photo) {

        for (let i = 0; i < this.album_photo.length; i++) {
            const file = this.album_photo[i];
            
            if (!file.type.match('image') && file.name.split('.').pop().toLowerCase() != 'heic') {
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

    formData.append('album_cover_image', form.value['album_cover_image']);
    
    

    this.requestService.uploadAlbum('addAlbum', formData)
        .subscribe(
            (data : any ) => {
                if (data.success === true) {
                    // console.log(data);
                    this.toast_message("Success", "Album added successfully");
                    //if(data.data) {
                        // hide popup of album upload
                        // show popup heic conversion
                        // for (let i = 0; i < 1; i++) {
                        //     this.heic_conversion(data.data[i]);
                        // }
                    //}
                    $('#album_model_close').click();
                    this.router.navigate(['/candy-club/'+this.username+'/album']);
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

// heic conversion
    heic_conversion(image_url) {
        console.log(image_url);
                    //../../../../assets/img/2.heic
                    // { mode: 'no-cors' }
        //http://mycamcandy-server.local/uploads/album/11/heic/6c4f196756173e0c688424c83a17785bd53868d4.heic
        fetch("https://alexcorvi.github.io/heic2any/demo/1.heic", { mode: 'no-cors' })
        .then((res) => res.blob())
        .then((blob) => heic2any({ blob, toType: "image/jpeg",quality: 0.7 }))
        .then((conversionResult) => {

            var url = URL.createObjectURL(conversionResult);
            console.log('i am undefined '+url);
            var xhr = new XMLHttpRequest;
            xhr.responseType = 'blob';
            console.log('before onload');
            xhr.onload = (event: any) => { 
                let recoveredBlob = xhr.response;        
                let reader = new FileReader;
                reader.onload = (event: any) => {
                let blobAsDataUrl = reader.result;
                console.log('blobAsDataUrl: '+blobAsDataUrl);
                };

                reader.readAsDataURL(recoveredBlob);
                console.log('recoveredBlob: '+recoveredBlob);

            };

            xhr.open('GET', url);
            xhr.send();

        })
        .catch((e) => {
            console.log(e);
        });
    }



}
