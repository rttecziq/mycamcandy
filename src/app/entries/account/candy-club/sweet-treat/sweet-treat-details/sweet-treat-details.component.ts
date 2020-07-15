import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RequestService } from '../../../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

declare var $: any ;

@Component({
  selector: 'app-sweet-treat-details',
  templateUrl: './sweet-treat-details.component.html',
  styleUrls: ['./sweet-treat-details.component.css']
})
export class SweetTreatDetailsComponent{

  errorMessages : string;
  sweet_treat_id : string;
  id : string;
  title : string;
  model_id : string;
  candies : string;
  listing : string;
  secret_note : string;
  description : string;
  featured_image : string;
  username : string;
  chat_picture : string;
  content : number;

  constructor(private requestService : RequestService, private router : Router, private route : ActivatedRoute) {

    this.id = "";
    this.title = "";
    this.model_id = "";
    this.candies = "";
    this.listing = "";
    this.secret_note = "";
    this.description = "";
    this.featured_image = "";
    this.username = "";

    this.sweet_treat_id = this.route.snapshot.paramMap.get('id');
    let details = {sweet_treat_id : this.sweet_treat_id};

    let username = (localStorage.getItem('username') != '' && localStorage.getItem('username') != null && localStorage.getItem('username') != undefined) ? localStorage.getItem('username') : '';
    let chat_picture = (localStorage.getItem('chat_picture') != '' && localStorage.getItem('chat_picture') != null && localStorage.getItem('chat_picture') != undefined) ? localStorage.getItem('chat_picture') : '';
    this.chat_picture = chat_picture;
    this.username = username;
    this.sweetTreatDetailsFn("sweetTreatDetails", details);
  }

  ngOnInit() {
    
  }

  sweetTreatDetailsFn(url, object) {
    this.requestService.postMethod(url, object)
    .subscribe(
        (data : any ) => {
            if (data.success == true) {
              if(data.data != "null") {
                this.id = data.data.id;
                this.title = data.data.title;
                this.model_id = data.data.model_id;
                this.candies = data.data.candies;
                this.listing = data.data.listing;
                this.secret_note = data.data.secret_note;
                this.description = data.data.description;
                this.featured_image = data.data.featured_image;
                this.content = 1;
              } else {
                this.content = 0;
              }

            } else {
                this.errorMessages = data.error_messages;
                $.toast({
                    heading: 'Error',
                    text: this.errorMessages,
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
