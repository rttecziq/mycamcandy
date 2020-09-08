import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ModelProfile } from '../../../../models/model-profile';
import { Preference } from '../../../../models/preference';
import { DatePipe } from  '@angular/common';

declare var $: any ;

@Component({
  selector: 'user-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit {

 
    errorMessages : string;
    is_content_creator : boolean;   
    userId : string;
    model_details : ModelProfile;
    general : Preference;
    datePipe : DatePipe;
    username:string;
    
    constructor(private requestService : RequestService, private router : Router) {    
        this.username = localStorage.getItem('username');        
        this.model_details = {
        
            //about
            describe_your_personality : "",
            what_kind_chat_room : "",
            turns_on_you_going : "",
            what_annoys_bed_room : "",
            who_dream_customer : "",
    
            //general
            zodiac_signs : "",
            height : "",
            dob : 0,
            weight : "",
            public_age : "",
            breast_size_number : "",
            public_country : "",
            breast_size_letter : "",
            language_spoken : "",
            breast_type : "",
            gender : "",
            hair_length : "",
            hair_color : "",
            shoe_size : "",
            public_hair : "",
    
            // sexual preferences
            orientation : "",
    
            // characteristics
            ethnicity : "", 
            eyes : "",
    
            //Fetishes & specialities
            fetishes : [],
            wish_list : "",
    
            // color scheme
            profile_text_color : "#000",
            profile_bg_color : "#fff",
    
            // category
            //category : [],
    
            // social media
            twitter : "",
            instagram : "",
            body_type : ""      
        }
    
        this.general = {
            zodiac_signs : [],
            height : [],
            birth_date : [],
            weight : [],
            public_age : [],
            breast_size_number : [],
            public_country : [],
            breast_size_letter : [],
            language_spoken : [],
            breast_type : [],
            gender : [],
            hair_length : [],
            hair_color : [],
            shoe_size : [],
            public_hair : [],
            body_type : [],
            orientation : [],
            ethnicity : [],
            eyes : [],
            fetishes : []
        }
        this.is_content_creator = true;
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
    
        // Load Logged In Model Profile details
    
        setTimeout(()=>{    
            this.model_profile_data_fn("model_profiles","");    
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

    model_profile_data_fn(url, object) {    
        this.requestService.getMethod(url, object)
        .subscribe(
            (data : any ) => {
                if (data.success == true) {                 
                    this.general.zodiac_signs        = data.data[1];
                    this.general.height              = data.data[0];
                    this.general.weight              = data.data[3];
                    this.general.public_age          = data.data[4];
                    this.general.breast_size_number  = data.data[5];
                    this.general.public_country      = data.data[6];
                    this.general.breast_size_letter  = data.data[7];
                    this.general.language_spoken     = data.data[8];
                    this.general.breast_type         = data.data[9];
                    this.general.hair_length         = data.data[11];
                    this.general.shoe_size           = data.data[12];
                    this.general.hair_color          = data.data[13];
                    this.general.public_hair         = data.data[15];
                    this.general.body_type           = data.data[14];
                    this.general.gender              = data.data[10];
        
                    this.general.orientation         = data.data[16];
                    this.general.ethnicity           = data.data[17];
                    this.general.eyes                = data.data[18];
                    this.general.fetishes            = data.data[19];
                    
                    if(data.model_details !== undefined && data.model_details !== null && data.model_details !== "") {
                        this.model_details = data.model_details;
                       // this.model_details.dob =  new Date().getFullYear() - this.datePipe.transform(this.model_details.dob, "yyyy");
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
