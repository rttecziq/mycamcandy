import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {environment} from '../../../environments/environment';


@Injectable({
  // we declare that this service should be created
  // by the root application injector. 
  providedIn: 'root',
})
export class UserService {
	
	readonly apiUrl = environment.apiUrl;

	readonly adminUrl = environment.adminUrl;

	// Define common variables

	login_by : string;

	device_type : string;

	device_token : string;

	login_type : string; // User logged in as streamer /viewer

	userId : string;

	constructor(private http: HttpClient,  private route : ActivatedRoute) { 

		this.login_by = "manual";

		this.device_type = "web";

		this.device_token = "123456";

		this.route.queryParams.subscribe(params => {

            this.login_type = params['uType'];

        });

        if (this.login_type == '' || this.login_type == null || this.login_type == undefined) {

            this.login_type = 'viewer';

		}
		
		this.userId = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';

	}

	// To login using authenticated details

	userAuthentication(userName, password) {

		let formData = new FormData();
		// append your data
		formData.append('email', userName);
		formData.append('password', password);
		formData.append('login_by', this.login_by);
		formData.append('device_type', this.device_type);
		formData.append('device_token', this.device_token);
		// formData.append('login_type', this.login_type);

		return this.http.post(this.apiUrl+'login', formData);

	}

	// To login using authenticated details

	userRegistration(userModel) {

		let formData = new FormData();

		// append your data
		for ( var key in userModel ) {
		    formData.append(key, userModel[key]);
		}

		formData.append('login_by', this.login_by);
		formData.append('device_type', this.device_type);
		formData.append('device_token', this.device_token);
		formData.append('login_type', this.login_type);

		return this.http.post(this.apiUrl+'register', formData);

	}

	// To logout the user

	userLogout() {

		let formData = new FormData();

		formData.append('id', localStorage.getItem('userId'));
		formData.append('token', localStorage.getItem('accessToken'));

		return this.http.post(this.apiUrl+'logout', formData);

	}

	// forgot Password - to send reset password of the user

	forgotPassword(email) {

		let formData = new FormData();
		// append your data
		formData.append('email', email);
		formData.append('login_by', this.login_by);
		formData.append('device_type', this.device_type);
		formData.append('device_token', this.device_token);
		

		return this.http.post(this.apiUrl+'forgotpassword', formData);
	}

	// Check social login details

	checkSocialLogin() {

		return this.http.get(this.apiUrl+'check/social');
		
	}

}
