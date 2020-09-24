import { Component, ElementRef, AfterViewInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import { UserService } from '../../../common/services/user.service';
import { NgModule } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppService } from '../../../app.service';
import { Constant } from '../../../constant/Constant';

declare var $: any

@Component({
    selector: 'common-header',
    templateUrl: 'header.component.html',
    styleUrls:['./header.component.css'
            //    '../../../../assets/css/style.css'
        ]
})

export class EntryHeaderComponent implements AfterViewInit{
    public elementRef;
    site_settings : any;

    site_logo : string;
    errorMessages : string;
    userId : any;
    isUserExists : boolean;
    username : string;
    key_term :string;

    constructor(private userService : UserService, private appService : AppService, public  router : Router, myElement: ElementRef, private requestService : RequestService) {      

        this.elementRef = myElement;
        this.errorMessages = "";
        this.site_settings = this.appService.appDetails();
        this.userId = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
        this.username = (localStorage.getItem('username') != '' && localStorage.getItem('username') != null && localStorage.getItem('username') != undefined) ? localStorage.getItem('username') : '';
        
        if(this.userId != '' && this.userId != null && this.userId != undefined) {
            this.isUserExists = true;
        }

        
    }

    ngAfterViewInit(){
        this.site_settings = JSON.parse(localStorage.getItem('site_settings'));
        let site_logo = (this.site_settings).filter(obj => {
            return obj.key === 'site_logo'
        });

        setTimeout(()=>{
            this.site_logo = site_logo.length > 0 ? site_logo[0].value : '';
        }, 1000);

        
    }

        resizeContent(){
            $("#full-view").toggleClass("width100");
            $("#full-view").toggleClass("left-right-padding");
            $("#side-view").toggleClass("zero-width");
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
                    localStorage.removeItem('username');
                    localStorage.removeItem('profile_picture');
                    localStorage.removeItem('chat_picture');
                    localStorage.removeItem('cover_picture');
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
                    this.router.navigate(['/']);
                } else {
                	console.log(data.error_code);

                	// if (data.error_code == 101 || data.error_code == 103 || data.error_code == 104) {

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