import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot , Router} from '@angular/router';
import { Observable } from 'rxjs';
import { RequestService } from '../services/request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../services/user.service';

declare var $:any;

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private router: Router, private requestService : RequestService, private userService : UserService) { }

	// If the user token cached by browser, but the token got expired need to call the logout function

	userLogoutFn() {

		this.userService.userLogout()
		.subscribe(

			(data : any ) =>  {

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

			},

			(err : HttpErrorResponse) => {

				$.toast({
					heading: 'Warning',
					text: "Oops! Something Went Wrong",
				// icon: 'error',
					position: 'top-right',
					stack: false,
					textAlign: 'left',
					loader : false,
					showHideTransition: 'slide'
				});

				localStorage.removeItem('accessToken');

				localStorage.removeItem('userId');

				//localStorage.clear();

				this.router.navigate(['/']);

				return false;
			}	
		);
	}

	// Check Token Is valid or not

	checkTokenValidFn() {

		this.requestService.postMethod('check/token-valid', "")
			.subscribe(
				(data : any ) => {

					if (data.success == true) {
						

					} else {
	
						$.toast({
							heading: 'Error',
							text: data.error_messages,
						// icon: 'error',
							position: 'top-right',
							stack: false,
							textAlign: 'left',
							loader : false,
							showHideTransition: 'slide'
						});
	

						localStorage.removeItem('accessToken');

						localStorage.removeItem('userId');

						// localStorage.clear();

						setTimeout(()=>{

							this.userLogoutFn();

							this.router.navigate(['/']);

						}, 3000);

						return false;
						
					}

				},

				(err : HttpErrorResponse) => {
	
					$.toast({
						heading: 'Warning',
						text: "Oops! Something Went Wrong",
					// icon: 'error',
						position: 'top-right',
						stack: false,
						textAlign: 'left',
						loader : false,
						showHideTransition: 'slide'
					});

					localStorage.removeItem('accessToken');

					localStorage.removeItem('userId');

					// localStorage.clear();

					this.router.navigate(['/']);


					return false;

				}
			);
	}

  	canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {	
	    
	    // we will check whether an user is authenticated or not using localStorage – userToken.

		//console.log("Expected Role "+next.data.expectedRole);
		
	    if (localStorage.getItem('accessToken') != null 
		    && localStorage.getItem('accessToken') != undefined 
		    && localStorage.getItem('accessToken') != '') {
							
			// Check Token Is valid or not

			this.checkTokenValidFn();

	    	// If the role is "guest" then redirect into home page.

	    	if(next.data.expectedRole == 'onlyGuest') {

				$.toast({
					heading: 'Warning',
					text: "Only Guest Users can access the page..!",
				// icon: 'error',
					position: 'top-right',
					stack: false,
					textAlign: 'left',
					loader : false,
					showHideTransition: 'slide'
				});

	    		this.router.navigate(['/']);

			}


	      	return true;

	    } else {

	    	// if not not authenticate we will send him to login form

	    	if(next.data.expectedRole == 'guestUser' || next.data.expectedRole == 'onlyGuest') {

	    		return true;

	    	} else {

				$.toast({
					heading: 'Warning',
					text: "Only Authroized Users can access the page..!",
				// icon: 'error',
					position: 'top-right',
					stack: false,
					textAlign: 'left',
					loader : false,
					showHideTransition: 'slide'
				});

	    		this.router.navigate(['/']);

	    		return false;
	    	}

	    }


	}

}
