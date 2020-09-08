import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-model-dashboard',
  templateUrl: './model-dashboard.component.html',
  styleUrls: ['./model-dashboard.component.css']
})
export class ModelDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.customJs();
  }

  customJs() {
  //   $('.owl-carousel').owlCarousel({
  //     loop:true,
  //     margin:10,
  //     nav:false,
  //     dots:false,
  //     autoplay:true,
  //     autoplayTimeout:5000,
  //     autoplayHoverPause:true,
  //     responsive:{
  //         0:{
  //             items:1
  //         },
  //         600:{
  //             items:1
  //         },
  //         1000:{
  //             items:1
  //         }
  //     }
  // })

//   $(document).ready(function() {

    
//     var readURL = function(input) {
//         if (input.files && input.files[0]) {
//             var reader = new FileReader();

//             reader.onload = function (e) {
//                 $('.uploaded-img').attr('src', e.target.result);
//             }
    
//             reader.readAsDataURL(input.files[0]);
//         }
//     }
    

//     $(".upload-img").on('change', function(){
//         readURL(this);
//         $(".uploaded-img").css("display","block");
//     });
    
//     $(".upload-img-click").on('click', function() {
//        $(".upload-img").click();
//     });
// });
  }

}
