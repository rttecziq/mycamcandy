import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService implements OnInit{

  readonly apiUrl = environment.apiUrl;

  site_settings: any;

  constructor(private http: HttpClient) {

      this.site_settings = [];

  }

  ngOnInit() {

    console.log('App service');

    // this.appDetails();

  }

  appDetails() {

      return this.http.get(this.apiUrl + 'site/settings')
      .subscribe(

        (data : any) => {

            this.site_settings = data.settings;

            localStorage.setItem('site_settings', JSON.stringify(this.site_settings));

            return this.site_settings;

        }

    )

  }
}
