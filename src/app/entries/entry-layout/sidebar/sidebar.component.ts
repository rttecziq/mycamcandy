import { Component, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../common/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CheckStreamerService } from '../../../common/services/check-streamer.service';

declare var $: any;

@Component({
    selector: 'common-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrls:[
        '../../../../assets/css/bootstrap/css/bootstrap.min.css',
        '../../../../assets/css/font-awesome/css/font-awesome.min.css',
        '../../../../assets/css/style.css',
        '../../../../assets/css/responsive.css',
    ]
})

export class EntrySidebarComponent implements AfterViewInit{
    
	errorMessages : string;

	is_content_creator : number;

	isUserExists : string;

	user_type : number;

	constructor (private userService : UserService, private router : Router, private checkStreamerService : CheckStreamerService) {

		this.errorMessages = '';

		this.is_content_creator = 0;

		this.isUserExists = this.userService.userId;

		this.user_type = 0;

	}

	ngAfterViewInit() {

		setTimeout(()=> {
			
			this.checkStreamerService.emitChange.subscribe(
				text => {

					if (text != null) {
					
						this.is_content_creator = text.is_content_creator;

						this.user_type = text.user_type == 1 ? 1 : 0;

					}

			});

		}, 1000);

	}

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