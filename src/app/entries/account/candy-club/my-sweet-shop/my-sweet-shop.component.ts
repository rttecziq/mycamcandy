import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any ;

@Component({
  selector: 'app-my-sweet-shop',
  templateUrl: './my-sweet-shop.component.html',
  styleUrls: ["../../../../../assets/css/bootstrap/css/bootstrap.css",
  "../../../../../assets/css/font-awesome/css/font-awesome.min.css", 
  "./my-sweet-shop.component.css"]
})

export class MySweetShopComponent implements OnInit {

  errorMessages : string;
  model_name : string;
  model : object;
  isUserExists : string;
  album_list:any[];
  featured_album_list:any[];
  collection_list: any[];
  st_list: any[];

  constructor(private requestService : RequestService, private router : Router, private route: ActivatedRoute) {

    this.errorMessages = "";
    this.model_name = "";
    this.model = {};
    this.album_list = [];
    this.featured_album_list = [];
    this.collection_list = [];
    this.st_list = [];

    this.isUserExists = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
    this.model_name = localStorage.getItem('username');
    this.model = {username:this.model_name};

    let data = {model_id : this.isUserExists};
    this.featured_sweet_shop_data("list_sweet_shop", data);

  //   this.route.params.subscribe(params => {
  //     this.model_name = params['username'];
  //     let details = {name : this.model_name};
  //     this.model_profiles_fn("model_profile_details", details);
  //  });

  }

  // slides = [
  //   {img: "http://placehold.it/350x150/000000"},
  //   {img: "http://placehold.it/350x150/111111"},
  //   {img: "http://placehold.it/350x150/333333"},
  //   {img: "http://placehold.it/350x150/666666"},
  //   {img: "http://placehold.it/350x150/000000"},
  //   {img: "http://placehold.it/350x150/111111"},
  //   {img: "http://placehold.it/350x150/333333"},
  //   {img: "http://placehold.it/350x150/666666"}
  // ];
  // slideConfig = {"slidesToShow": 4, "slidesToScroll": 1};
  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    //arrows: false,
    // asNavFor: '.candy-albums-two',
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 1500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  afterChange(e) {
    //console.log('afterChange');
  }

  ngOnInit() {
    //  $.getScript('../../../../../assets/css/slick/slick/slick.min.js');
  }
  // ngAfterViewInit(){
  //   setTimeout(() => {
  //    // this.slickFn();
  //   }, 3000);
  // }

  // slickFn(){
  //   setTimeout (() => {
  //     $('.candy-albums-one').slick({
  //       dots: false,
  //       infinite: false,
  //       speed: 300,
  //       slidesToShow: 4,
  //       asNavFor: '.candy-albums-two',
  //       slidesToScroll: 4,
  //       responsive: [
  //         {
  //           breakpoint: 1024,
  //           settings: {
  //             slidesToShow: 3,
  //             slidesToScroll: 3,
  //             infinite: true,
  //             dots: false
  //           }
  //         },
  //         {
  //           breakpoint: 600,
  //           settings: {
  //             slidesToShow: 2,
  //             slidesToScroll: 2
  //           }
  //         },
  //         {
  //           breakpoint: 480,
  //           settings: {
  //             slidesToShow: 1,
  //             slidesToScroll: 1
  //           }
  //         }
  //         // You can unslick at a given breakpoint now by adding:
  //         // settings: "unslick"
  //         // instead of a settings object
  //       ]
  //     });
    
  //     $('.candy-albums-two').slick({
  //       dots: false,
  //       infinite: false,
  //       speed: 300,
  //       slidesToShow: 4,
  //       arrows: false,
  //       slidesToScroll: 4,
  //       responsive: [
  //         {
  //           breakpoint: 1024,
  //           settings: {
  //             slidesToShow: 3,
  //             slidesToScroll: 3,
  //             infinite: true,
  //             dots: false
  //           }
  //         },
  //         {
  //           breakpoint: 600,
  //           settings: {
  //             slidesToShow: 2,
  //             slidesToScroll: 2
  //           }
  //         },
  //         {
  //           breakpoint: 480,
  //           settings: {
  //             slidesToShow: 1,
  //             slidesToScroll: 1
  //           }
  //         }
  //         // You can unslick at a given breakpoint now by adding:
  //         // settings: "unslick"
  //         // instead of a settings object
  //       ]
  //     });
      
  //     $('.sweet-treat, .featured_album, .candy-collection').slick({
  //       dots: false,
  //       infinite: false,
  //       speed: 300,
  //       slidesToShow: 4,
  //       slidesToScroll: 4,
  //       responsive: [
  //         {
  //           breakpoint: 1024,
  //           settings: {
  //             slidesToShow: 3,
  //             slidesToScroll: 3,
  //             infinite: true,
  //             dots: false
  //           }
  //         },
  //         {
  //           breakpoint: 600,
  //           settings: {
  //             slidesToShow: 2,
  //             slidesToScroll: 2
  //           }
  //         },
  //         {
  //           breakpoint: 480,
  //           settings: {
  //             slidesToShow: 1,
  //             slidesToScroll: 1
  //           }
  //         }
  //       ]
  //     });

  //   }, 2000);



  // }

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

  // model_profiles_fn(url, object) {
  //   this.requestService.postMethod(url,object) 
  //     .subscribe(
  //         (data : any) => {
  //             if (data.success == true) {
  //               //this.model = data;
  //               if(this.model) {
  //                 let data = {model_id : this.model['model_id']};
  //                 this.featured_sweet_shop_data("list_sweet_shop", data);
  //               }
  //             } else if(data.error_messages == 'Model not found') {
  //               //this.router.navigate(['error']);
  //             } else {
  //               this.toast_message("Error", data.error_messages);  
  //             }
  //         },
  //         (err : HttpErrorResponse) => {
  //             this.errorMessages = 'Oops! Something Went Wrong';
  //             this.toast_message("Error", this.errorMessages);
  //         }
  //     );
  // }
  
  featured_sweet_shop_data(url, object) {
    this.requestService.postMethod(url, object)
        .subscribe(
            (data : any) => {
                if (data.success == true) {
                  console.log(data);
                  this.featured_album_list = data.data['featured_album_list'];
                  this.album_list = data.data['album_list'];
                  this.collection_list = data.data['collection_list'];
                  this.st_list = data.data['sweet_treat_list'];
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

  st_shop_details(item_type, item_id) {

    if(this.isUserExists == null || this.isUserExists == '' || this.isUserExists == undefined) {
      this.toast_message("Error", "Please login to continue");
      return false;
    }

    if(item_type == 'album') {
      this.router.navigate(['/candy-club/'+this.model_name+'/album/'+item_id]);
    } else if(item_type == 'collection'){
      this.router.navigate(['/candy-club/'+this.model_name+'/collection/'+item_id]);
    } else if(item_type == 'sweet-treat') {
      this.router.navigate(['/candy-club/'+this.model_name+'/sweet-treat/'+item_id]);
    }

  }
}
