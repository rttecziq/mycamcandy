import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  // we declare that this service should be created
  // by the root application injector. 
  providedIn: 'root',
})
export class RequestService {
	
	readonly apiUrl = environment.apiUrl;

	readonly adminUrl = environment.adminUrl;

	// Define common variables

	login_by : string;

	device_type : string;

	device_token : string;

	userId : string;

	accessToken : string;

	constructor(private http: HttpClient) { 

		this.login_by = "manual";

		this.device_type = "web";

		this.device_token = "123456";

	}

	// PostMethod for only to load details from API

	postMethod(url, object) {

		let formData = new FormData();

		this.userId = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';

		this.accessToken = (localStorage.getItem('accessToken') != '' && localStorage.getItem('accessToken') != null && localStorage.getItem('accessToken') != undefined) ? localStorage.getItem('accessToken') : '';

		// By Default added device type and login type in future use
		formData.append('id', this.userId);
		formData.append('model_id', this.userId);
		formData.append('token', this.accessToken);

		// append your data
		for ( var key in object ) {
		    formData.append(key, object[key]);
		}
		

		// By Default added device type and login type in future use
		formData.append('login_by', this.login_by);
		formData.append('device_type', this.device_type);

		return this.http.post(this.apiUrl+url, formData);

	}

	// PostMethod for only to load details from API

	uploadMultipleImage(url, formData) {

		return this.http.post(this.apiUrl+url, formData);

	}

	// GetMethod for only to load details from API

	getMethod(url, object) {

		this.userId = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';

		this.accessToken = (localStorage.getItem('accessToken') != '' && localStorage.getItem('accessToken') != null && localStorage.getItem('accessToken') != undefined) ? localStorage.getItem('accessToken') : '';1

		let params = {'id' : this.userId,
						'model_id' : this.userId,
						'token' : this.accessToken,
						'login_by': this.login_by,
						'device_type': this.device_type};

		return this.http.get(this.apiUrl+url, {params : params});

	}

}
