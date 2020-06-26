import { Component, ElementRef, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgModule } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppService } from '../../../app.service';
declare var $: any

@Component({
    selector: 'common-header',
    templateUrl: 'header.component.html',
    styleUrls:['../../../../assets/css/header/header.css'],
    host: {
        '(document:click)': 'onClick($event)',
    },
})

export class HeaderComponent implements AfterViewInit, OnDestroy{
    public elementRef;

    site_settings : any;

    site_logo : string;

    errorMessages : any;

    userId : any;

    key_term : any;

    // notifications_types : any;

    constructor(private userService : UserService, private appService : AppService, public  router : Router, myElement: ElementRef, private requestService : RequestService) {      

        this.elementRef = myElement;

        this.site_settings = this.appService.appDetails();

        this.errorMessages = '';

        this.userId = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';

    }

    toggleMenu(){
            $('.toggle-wrap').on('click', function() {
              $(this).toggleClass('active');
              $('aside').animate({width: 'toggle'}, 200);
              $("#custom_header_mcc").removeClass("h-100");
              $("#myNavbar").removeClass("in");
            });
    }
    
    menuHeight(){
        $("#login-or-menu").click(function(){
            $("#custom_header_mcc").toggleClass("h-100");
            $("aside").css("display","none");
            $(".toggle-wrap").removeClass("active");
          });
    }
    
    liActive(){
        $('aside').on('click', 'li', function() {
            $('li.active').removeClass('active');
            $(this).addClass('active');
      });
    }

    headerDropdown(){
        $('.dropdown-submenu a.test').on("click", function(e){
            $(this).next('ul').toggle();
            e.stopPropagation();
            e.preventDefault();
          });
    }

    searchbox(){
        $("#search-menu").click(function(){
            $("#searchbox").toggleClass("search-hide");
          });
    }
   
    ngOnDestroy() {

    //    clearInterval(this.bellNotificationStatus);

    }

    ngAfterViewInit() {
        this.toggleMenu();
        this.menuHeight();
        this.liActive();
        this.headerDropdown();
        this.searchbox();
        this.site_settings = JSON.parse(localStorage.getItem('site_settings'));

        let site_logo = (this.site_settings).filter(obj => {
            return obj.key === 'site_logo'
        });

        setTimeout(()=>{

            this.site_logo = site_logo.length > 0 ? site_logo[0].value : '';

        }, 1000);
        
        
    }

    onClick(event) {
        
        $("#search_results").val("");

    }


    // logout
    logout() {

		this.userService.userLogout()
		.subscribe(

			(data : any ) =>  {

				if (data.success == true) {

                    // Remove all the items which is stored in localstorage

                    localStorage.removeItem('accessToken');

                    localStorage.removeItem('userId');

					//localStorage.clear();

					$.toast({
                        heading: 'Success',
                        text: "You have been logged out successfully",
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });
                    location.reload();
                    //this.router.navigate(['/']);

                } else {

                	// if (data.error_code == 101 || data.error_code == 103 || data.error_code == 104) {

                		localStorage.removeItem('accessToken');

	                    localStorage.removeItem('userId');

						// localStorage.clear();

						$.toast({
							heading: 'Success',
							text: "You have been logged out successfully",
						// icon: 'error',
							position: 'top-right',
							stack: false,
							textAlign: 'left',
							loader : false,
							showHideTransition: 'slide'
						});

	                    this.router.navigate(['/']);

	                    return false;

                	// }
                    
                }

			},

			(err : HttpErrorResponse) => {

				this.errorMessages = 'Incorrect Username / Password';

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

				return false;
			}	
		);
	}
}