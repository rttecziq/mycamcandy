import { Component, Input, AfterViewInit } from '@angular/core';
import { CheckStreamerService } from '../../../common/services/check-streamer.service';
import { RequestService } from '../../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

declare var $ :any;

@Component({
    templateUrl: 'settings.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css',
    ]   
})

export class SettingsComponent implements AfterViewInit{

    is_content_creator : number;

    errorMessages : string;

    user_type : number;

    constructor(private checkStreamerService : CheckStreamerService, private requestService: RequestService, private translate: TranslateService) {
        
        this.is_content_creator = 0;

        this.errorMessages = "";

        this.user_type = 0;

    }

    ngAfterViewInit() {

        setTimeout(()=>{

            this.checkStreamerService.emitChange.subscribe(
                text => {

                    if (text != null) {
                            
                        this.is_content_creator = text.is_content_creator;

                        this.user_type = text.user_type;
                        
                    }
                
            });

        }, 1000);



    }


    switchLanguage(language: string) {

        $('#language_close').click();

        let language_name = $("input[name=language_name]:checked").val();
      
        localStorage.setItem('user_local_language', language_name);

        this.translate.use(language_name);

    }
}