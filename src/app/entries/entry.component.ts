import { Component , AfterViewInit, OnInit } from '@angular/core';
import { TitleService } from '../common/services/title.service';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;
@Component({

    templateUrl: 'entry.component.html',
    styleUrls:[
        '../../assets/css/bootstrap/css/bootstrap.min.css',
        '../../assets/css/font-awesome/css/font-awesome.min.css',
        '../../assets/css/style.css',
        '../../assets/css/responsive.css',
    ]
})

export class EntryComponent implements OnInit{
  
  language : string;

  constructor(private titleService : TitleService, public translate : TranslateService) {

    this.language = localStorage.getItem('user_local_language');

    if(this.language == undefined || this.language == null || this.language == '') {
        
        localStorage.setItem('user_local_language', 'en');

    }


    translate.setDefaultLang(this.language);

    translate.use(this.language);

  }
  
  ngOnInit () {

      console.log("dddd");
      
  }

  onDeactivate(){
    $('html, body').animate({
      scrollTop: 0
    });
  }

  onActivate(event: Event){
    
    window.scroll(0,0);
    
    $('html, body').animate({
      scrollTop: 0
    });
  }
  
}