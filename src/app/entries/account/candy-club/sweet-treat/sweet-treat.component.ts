import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { sweetTreat } from '../../../../models/sweet-treat';

declare var $: any ;

@Component({
  selector: 'app-sweet-treat',
  templateUrl: './sweet-treat.component.html',
  styleUrls: ['./sweet-treat.component.css']
})
export class SweetTreatComponent implements AfterViewInit {

  errorMessages : string;
  sweet_treats : any;
  username : string;
  sweet_treat : sweetTreat;
  sweet_treat_id : number;
  sweet_treat_image : File;
  showModal: boolean;
  sweet_treat_featured_image : string;

  constructor(private requestService : RequestService, private router : Router) {
    this.errorMessages ="";
    this.sweet_treats = [];

    this.sweet_treat = {
      title : "",
      candies : 0,
      listing : false,
      description : "",
      featured_image : "",
      secret_note : ""
  }

    let username = (localStorage.getItem('username') != '' && localStorage.getItem('username') != null && localStorage.getItem('username') != undefined) ? localStorage.getItem('username') : '';
    this.username = username;
  }

  ngAfterViewInit(){

      setTimeout(()=>{
      this.sweet_treat_list_fn("listSweetTreat", "");
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

  show(id, title, candies, listing, description, featured_image, secret_note){

    this.sweet_treat_id = id;
    this.sweet_treat.title = title;
    this.sweet_treat.candies = candies;
    this.sweet_treat.listing = listing;
    this.sweet_treat.description = description;
    this.sweet_treat_featured_image = featured_image;
    this.sweet_treat.secret_note = secret_note;

    this.showModal = true;
  }
  hide() {
    this.showModal = false;
  }

  sweetTreatFormFn(form : NgForm) {
    form.value['sweet_treat_id'] = this.sweet_treat_id ? this.sweet_treat_id : 0;

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

  sweet_treat_list_fn(url, object) {  
      this.requestService.getMethod(url, object)
      .subscribe(
          (data : any ) => {
              if (data.success == true) {
                  this.sweet_treats = data.data;
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

  unlist_sweet_treat(sweet_treat_id) {
    const formData = {
      sweet_treat_id : sweet_treat_id
    }

    this.requestService.postMethod("unlistSweetTreat", formData)
      .subscribe(
          (data : any ) => {
              if (data.success == true) {
                this.toast_message("Success", "Unlisted successfully");
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