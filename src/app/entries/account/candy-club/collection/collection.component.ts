import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Collection } from '../../../../models/collection';

declare var $: any ;

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements AfterViewInit {

  errorMessages : string;
  collections : any;
  username : string;
  model_collection : Collection;
  showModal: boolean;
  is_edit_mode : boolean;
  collection_image : File;
  collection_featured_image : string;
  collection_id : number;
  
  constructor(private requestService : RequestService, private router : Router) {
    this.errorMessages ="";
    this.collections = [];
    this.collection_image = null;

    this.model_collection = {
      collection_title : "",
      collection_candies : 0,
      collection_featured_image : "",
    }

    let username = (localStorage.getItem('username') != '' && localStorage.getItem('username') != null && localStorage.getItem('username') != undefined) ? localStorage.getItem('username') : '';
    this.username = username;
  }

  ngAfterViewInit() {
    setTimeout(()=>{
      this.list_collection_fn("listCollection", "");
    }, 1000);

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

list_collection_fn(url, object) {
  this.requestService.getMethod(url, object)
  .subscribe(
      (data : any ) => {
          if (data.success == true) {
              this.collections = data.data;
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

show(id, collection_title,collection_candies,collection_featured_image) {
  this.collection_id = id;
  this.model_collection.collection_title = collection_title;
  this.model_collection.collection_candies = collection_candies;
  this.model_collection.collection_featured_image = collection_featured_image;
  this.showModal = true;
  this.is_edit_mode = true;
}
hide() {
  this.showModal = false;
  this.is_edit_mode = false;
}


handleCollection(files : FileList) {
  this.collection_image = files.item(0);
  if(!files.item(0).type.match('image')) {
      this.toast_message("Warning", "Please choose image with extensions .png, .jpg, .jpeg");  
      return false;
  }

  var reader = new FileReader();  
  reader.onload = (event: any) => {    
    this.model_collection.collection_featured_image = event.target.result;    
  }
  reader.readAsDataURL(files.item(0));
}

collectionFormFn(form : NgForm) {

  form.value['collection_id'] = this.collection_id ? this.collection_id : 0;
    
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
      if(!this.is_edit_mode) {
        this.toast_message("Error", "Add collection featured image");
        return false;
      }
  }
//  addCollection api is used for edit also
  this.requestService.postMethod('addCollection', form.value)
      .subscribe(
          (data : any ) => {
              if (data.success == true) {
                  this.toast_message("Success", this.is_edit_mode ? 'Collection updated successfully' : 'Collection added successfully');
                    if(this.router.url.split("/").pop() == 'collection') {
                      location.reload();
                    } else {
                      this.router.navigate(['/candy-club/'+this.username+'/collection']);
                    }
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
