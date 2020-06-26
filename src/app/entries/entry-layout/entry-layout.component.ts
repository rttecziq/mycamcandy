import { Component, OnInit } from '@angular/core';
import { CheckStreamerService } from '../../common/services/check-streamer.service';
import { RequestService } from '../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

declare var $:any;

@Component({
  templateUrl: 'entry-layout.component.html',
  styleUrls: [
    '../../../assets/css/bootstrap/css/bootstrap.min.css',
    '../../../assets/css/font-awesome/css/font-awesome.min.css',
    '../../../assets/css/style.css',
    '../../../assets/css/responsive.css',
  ],
})
export class EntryLayoutComponent implements OnInit {

  isUser : boolean;

  errorMessages : string;

  is_content_creator : number;

  language : string;

  constructor(private checkStreamerService : CheckStreamerService, private requestService : RequestService, public translate : TranslateService) { 

        this.isUser =  false;

        this.is_content_creator = 0;

        this.language = localStorage.getItem('user_local_language');

        if(this.language == undefined || this.language == null || this.language == '') {

            console.log("test");
            
            localStorage.setItem('user_local_language', 'en');

        }

        translate.setDefaultLang(this.language);

        translate.use(this.language);

  }

  ngOnInit() {


      // we will check whether an user is authenticated or not using localStorage – userToken.

      if (localStorage.getItem('accessToken') != null && localStorage.getItem('accessToken') != undefined &&
      localStorage.getItem('accessToken') != '') {

          this.isUser = true;

          if (this.isUser) {

                this.user_profile_fn('userDetails', '');

          }

      }

  }

  user_profile_fn(url, object) {

    this.requestService.getMethod(url, object)
        .subscribe(
            (data : any ) => {

                if (data.success == true) {

                    this.is_content_creator = data.is_content_creator;

                    this.checkStreamerService.emit({is_content_creator : this.is_content_creator, user_type : data.user_type});

                } else {

                    this.errorMessages = data.error_messages;
                    
                }

            },

            (err : HttpErrorResponse) => {

                this.errorMessages = 'Oops! Something Went Wrong';

            }

        );

  }
}

