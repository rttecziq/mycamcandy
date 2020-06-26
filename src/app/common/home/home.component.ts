import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RequestService } from "../services/request.service";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

declare var $: any;

@Component({
  templateUrl: "home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  sum = 0;

  errorMessages: string;

  home_videos: any[];

  public_videos: any[];

  private_videos: any[];

  user_details: Object;

  suggestions: any[];

  skipCount: number;

  showLoader: boolean;

  showPublicLoader: boolean;

  showPrivateLoader: boolean;

  isUser: boolean;

  skipPublicCount: number;

  skipPrivateCount: number;

  datasAvailable: number;

  publicDatasAvailable: number;

  privateDatasAvailable: number;

  constructor(
    private requestService: RequestService,
    private router: Router,
    public translate: TranslateService
  ) {
    this.home_videos = [];

    this.public_videos = [];

    this.private_videos = [];

    this.user_details = {};

    this.suggestions = [];

    this.skipCount = 0;

    this.showLoader = false;

    this.isUser = false;

    this.skipPublicCount = 0;

    this.skipPrivateCount = 0;

    this.showPublicLoader = true;

    this.showPrivateLoader = true;

    this.datasAvailable = 0;

    this.publicDatasAvailable = 0;

    this.privateDatasAvailable = 0;
  }

  ngOnInit() {
    // Load Videos
    this.sidebarCatMenu();
    this.closeNav();
    this.openNav();
    this.home_video_fn("home", { skip: 0 });

    if (this.requestService.userId) {
      // Load Logged In User Profile

      this.user_profile_fn("userDetails", "");

      let details = { skip: 0 };

      this.suggestionsList("suggestions", details);
    }
  }

  homeFn() {
    this.skipCount = 0;

    this.home_video_fn("home", { skip: 0 });
  }
     
   closeNav() {
    if ($(window).width() > 991) {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main_home").style.marginLeft= "0";
    document.getElementById("openbtn").style.display = "block";
    document.getElementById("closebtn").style.display = "none";
  }
  }
  openNav() {
    if ($(window).width() > 991) {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main_home").style.marginLeft = "250px";
    document.getElementById("openbtn").style.display = "none";
    document.getElementById("closebtn").style.display = "block";
  }
  }
  sidebarCatMenu() {
    
        $("#by6").click(function(){
        $(".grid").removeClass("col-lg-4 col-md-4 col-sm-4");
        $(".grid").removeClass("col-lg-3 col-md-3 col-sm-4");
        $(".grid").addClass("col-lg-2 col-md-2 col-sm-3 col-xs-4");
      });
        $("#by4").click(function(){
        $(".grid").removeClass("col-lg-2 col-md-2 col-sm-3 col-xs-4");
        $(".grid").removeClass("col-lg-4 col-md-4 col-sm-4");
        $(".grid").addClass("col-lg-3 col-md-3 col-sm-3");
      });
        $("#by3").click(function(){
        $(".grid").removeClass("col-lg-2 col-md-2 col-sm-3 col-xs-4");
        $(".grid").removeClass("col-lg-3 col-md-3 col-sm-4");
        $(".grid").addClass("col-lg-4 col-md-4 col-sm-4");
      });
      

/* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - This allows the user to have multiple dropdowns without any conflict */
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
  this.classList.toggle("active");
  var dropdownContent = this.nextElementSibling;
  if (dropdownContent.style.display === "block") {
  dropdownContent.style.display = "none";
  } else {
  dropdownContent.style.display = "block";
  }
  });
}

	$(document).ready(function() {
$(".sidebar_menu").click(function () {
    $(this).addClass("active");
    $(".sidebar_menu").not(this).removeClass("active");
});

});

  }

  publicFn() {
    this.skipPublicCount = 0;

    this.publicVideosFn("popular_videos", { skip: 0, type: "public" });
  }

  privateFn() {
    this.skipPrivateCount = 0;

    this.privateVideosFn("popular_videos", { skip: 0, type: "private" });
  }

  home_video_fn(url, object) {
    this.showLoader = true;

    this.requestService.postMethod(url, object).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.datasAvailable = 1;

          if (this.skipCount > 0) {
            this.home_videos = [...this.home_videos, ...data.data];
          } else {
            this.home_videos = data.data;
          }

          this.skipCount += data.data.length;

          if (data.data.length <= 0) {
            this.datasAvailable = 0;
          }
        } else {
          this.errorMessages = data.error_messages;

          $.toast({
            heading: "Error",
            text: this.errorMessages,
            // icon: 'error',
            position: "top-right",
            stack: false,
            textAlign: "left",
            loader: false,
            showHideTransition: "slide"
          });
        }
      },

      (err: HttpErrorResponse) => {
        this.errorMessages = "Oops! Something Went Wrong";

        $.toast({
          heading: "Error",
          text: this.errorMessages,
          // icon: 'error',
          position: "top-right",
          stack: false,
          textAlign: "left",
          loader: false,
          showHideTransition: "slide"
        });
      },
      () => {
        setTimeout(() => {
          this.showLoader = false;
        }, 2000);
      }
    );
  }

  publicVideosFn(url, object) {
    this.showPublicLoader = true;

    this.requestService.postMethod(url, object).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.publicDatasAvailable = 1;

          if (this.skipPublicCount > 0) {
            this.public_videos = [...this.public_videos, ...data.data];
          } else {
            this.public_videos = data.data;
          }

          this.skipPublicCount += data.data.length;

          if (data.data.length <= 0) {
            this.publicDatasAvailable = 0;
          }
        } else {
          this.errorMessages = data.error_messages;

          $.toast({
            heading: "Error",
            text: this.errorMessages,
            // icon: 'error',
            position: "top-right",
            stack: false,
            textAlign: "left",
            loader: false,
            showHideTransition: "slide"
          });
        }
      },

      (err: HttpErrorResponse) => {
        this.errorMessages = "Oops! Something Went Wrong";

        $.toast({
          heading: "Error",
          text: this.errorMessages,
          // icon: 'error',
          position: "top-right",
          stack: false,
          textAlign: "left",
          loader: false,
          showHideTransition: "slide"
        });
      },
      () => {
        setTimeout(() => {
          this.showPublicLoader = false;
        }, 2000);
      }
    );
  }

  privateVideosFn(url, object) {
    this.showPrivateLoader = true;

    this.requestService.postMethod(url, object).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.privateDatasAvailable = 1;

          if (this.skipPrivateCount > 0) {
            this.private_videos = [...this.private_videos, ...data.data];
          } else {
            this.private_videos = data.data;
          }

          this.skipPrivateCount += data.data.length;

          if (data.data.length <= 0) {
            this.privateDatasAvailable = 0;
          }
        } else {
          this.errorMessages = data.error_messages;

          $.toast({
            heading: "Error",
            text: this.errorMessages,
            // icon: 'error',
            position: "top-right",
            stack: false,
            textAlign: "left",
            loader: false,
            showHideTransition: "slide"
          });
        }
      },

      (err: HttpErrorResponse) => {
        this.errorMessages = "Oops! Something Went Wrong";

        $.toast({
          heading: "Error",
          text: this.errorMessages,
          // icon: 'error',
          position: "top-right",
          stack: false,
          textAlign: "left",
          loader: false,
          showHideTransition: "slide"
        });
      },
      () => {
        setTimeout(() => {
          this.showPrivateLoader = false;
        }, 2000);
      }
    );
  }

  user_profile_fn(url, object) {
    this.requestService.getMethod(url, object).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.isUser = true;

          this.user_details = data;
        } else {
          this.errorMessages = data.error_messages;

          $.toast({
            heading: "Error",
            text: this.errorMessages,
            // icon: 'error',
            position: "top-right",
            stack: false,
            textAlign: "left",
            loader: false,
            showHideTransition: "slide"
          });
        }
      },

      (err: HttpErrorResponse) => {
        this.errorMessages = "Oops! Something Went Wrong";

        $.toast({
          heading: "Error",
          text: this.errorMessages,
          // icon: 'error',
          position: "top-right",
          stack: false,
          textAlign: "left",
          loader: false,
          showHideTransition: "slide"
        });
      }
    );
  }

  // User suggestions list

  suggestionsList(url, object) {
    this.requestService.postMethod(url, object).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.suggestions = data.data;
        } else {
          this.errorMessages = data.error_messages;

          $.toast({
            heading: "Error",
            text: this.errorMessages,
            // icon: 'error',
            position: "top-right",
            stack: false,
            textAlign: "left",
            loader: false,
            showHideTransition: "slide"
          });
        }
      },

      (err: HttpErrorResponse) => {
        this.errorMessages = "Oops! Something Went Wrong";

        $.toast({
          heading: "Error",
          text: this.errorMessages,
          // icon: 'error',
          position: "top-right",
          stack: false,
          textAlign: "left",
          loader: false,
          showHideTransition: "slide"
        });
      }
    );
  }

  // To add follower

  followUser(user_id) {
    let details = { follower_id: user_id };

    this.requestService.postMethod("add_follower", details).subscribe(
      (data: any) => {
        if (data.success == true) {
          let details = { skip: 0 };

          this.suggestionsList("suggestions", details);

          this.user_profile_fn("userDetails", "");

          $.toast({
            heading: "Success",
            text: this.translate.instant("follow_user_success"),
            // icon: 'error',
            position: "top-right",
            stack: false,
            textAlign: "left",
            loader: false,
            showHideTransition: "slide"
          });
        } else {
          this.errorMessages = data.error_messages;

          $.toast({
            heading: "Error",
            text: this.errorMessages,
            // icon: 'error',
            position: "top-right",
            stack: false,
            textAlign: "left",
            loader: false,
            showHideTransition: "slide"
          });
        }
      },

      (err: HttpErrorResponse) => {
        this.errorMessages = "Oops! Something Went Wrong";

        $.toast({
          heading: "Error",
          text: this.errorMessages,
          // icon: 'error',
          position: "top-right",
          stack: false,
          textAlign: "left",
          loader: false,
          showHideTransition: "slide"
        });
      }
    );
  }

  showMoreVideos() {
    this.home_video_fn("home", { skip: this.skipCount });
  }
  showPublicMoreVideos() {
    this.publicVideosFn("popular_videos", {
      skip: this.skipPublicCount,
      type: "public"
    });
  }
  showPrivateMoreVideos() {
    this.privateVideosFn("popular_videos", {
      skip: this.skipPublicCount,
      type: "private"
    });
  }
}
