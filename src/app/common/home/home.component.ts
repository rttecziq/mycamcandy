import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
  templateUrl: "home.component.html",
  styleUrls: ["../../../assets/css/slick/slick/slick.css",
              "./home.component.css"]
})
export class HomeComponent implements OnInit {

  errorMessages : string;

  // slider
  sliders : any[];

  constructor(private requestService : RequestService, private router : Router) {
    this.sliders = [];
  }

  ngOnInit() {
    this.sliderFn('getLandingPageSlider', '');
    this.Customjs();
  }

  sliderFn(url, object) {
    this.requestService.getMethod(url,object) 
            .subscribe(
                (data : any) => {
                    if (data.success == true) {
                      // success
                      this.sliders = data.data;
                      console.log(data);
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

  
  Customjs() {

      setTimeout (() => {
        $('.owl-carousel').slick({
          loop:true,
          autoplay:true,
          infinite: true,
          fade: true,
          speed: 500,
          prevArrow: false,
          nextArrow: false,
          pauseOnHover:false,
          focusOnSelect: false
        });
      }, 2000);

  }

}
