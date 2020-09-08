import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-why-signup-with-us',
  templateUrl: './why-signup-with-us.component.html',
  styleUrls: ['./why-signup-with-us.component.css']
})
export class WhySignupWithUsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.Customjs();
  }

  Customjs() {
    $('.owl-carousel').owlCarousel({
      loop:true,
      autoplay:true,
      autoplayTimeout:5000,
      autoplayHoverPause:true,
      responsive:{
          0:{
              items:1
          },
          600:{
              items:1
          },
          1000:{
              items:1
          }
      }
  })
  }

}
