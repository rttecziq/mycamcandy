import { Component } from '@angular/core';
import { TitleService } from './common/services/title.service';
import { Event, NavigationCancel,NavigationEnd,NavigationError,NavigationStart,Router } from '@angular/router';
import { RequestService } from './common/services/request.service';

import { TranslateService } from '@ngx-translate/core';

declare var $ :any;

declare var undefined : any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    '../assets/css/bootstrap/css/bootstrap.min.css',
    '../assets/css/font-awesome/css/font-awesome.min.css',
    '../assets/css/style.css',
    '../assets/css/responsive.css',
  ]
})
export class AppComponent {
  title = 'app';
  onDeactivate() {
    window.scrollTo(0, 0)
  }

  onActivate(event: Event){
    window.scroll(0,0);

    $('html, body').animate({
      scrollTop: 0
    });
  }
  
  loading = false;

  android_page : boolean;

  android_loading = false;

  language : string;

  constructor(private titleService : TitleService, private router: Router, private requestService : RequestService, public translate: TranslateService) {

    this.language = localStorage.getItem('user_local_language');

    if(this.language == undefined || this.language == null || this.language == '') {
        
        localStorage.setItem('user_local_language', 'en');

    }


    translate.setDefaultLang(this.language);

    translate.use(this.language);

    this.router.events.subscribe((url:any) =>  {

        if(url.url != undefined && typeof url.url != 'undefined') {
    
          let current_url = (url.url.toString()).split('?');

          if (current_url.length > 0) {

            if (current_url[0] == '/viewer-video' || current_url[0] == '/streamer-video') {

              this.android_page = true;

            } else {

              this.android_page = false;

            }

          } else {

            this.android_page = false;

          }

        } else {

          this.android_page = false;

        }

      }

    );

    this.router.events.subscribe((event: Event) => {

      switch (true) {
        case event instanceof NavigationStart: {

          if (this.android_page) {

            this.android_loading = true;

          } else {

            this.loading = true;

          }


          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {

          setTimeout(() => {

            if (this.android_page) {

              this.android_loading = false;
  
            } else {

              this.loading = false;

            }

            window.scroll(0,0);

          }, 2000);
          
          break;
        }
        default: {
          break;
        }
      }
    });

  }

  
}
