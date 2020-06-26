import { Component , AfterViewInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare var $: any ;

@Component({
    templateUrl: 'choose.component.html',
    styleUrls:[
        '../../../../assets/css/bootstrap/css/bootstrap.min.css',
        '../../../../assets/css/font-awesome/css/font-awesome.min.css',
        '../../../../assets/css/style.css',
        '../../../../assets/css/responsive.css',
    ]
})

export class ChooseComponent{

    constructor(private route : ActivatedRoute, public translate : TranslateService) {

        this.route.queryParams.subscribe(params => {

            if(params['error'] == "0") {

                $.toast({
                    heading: 'Error',
                    text: translate.instant('registered_as_viewer_error'),
                // icon: 'error',
                    position: 'top-right',
                    stack: false,
                    textAlign: 'left',
                    loader : false,
                    showHideTransition: 'slide'
                });

            }

            if(params['error'] == '1') {

                $.toast({
                    heading: 'Error',
                    text: translate.instant('registered_as_streamer_error'),
                // icon: 'error',
                    position: 'top-right',
                    stack: false,
                    textAlign: 'left',
                    loader : false,
                    showHideTransition: 'slide'
                });

            }

        })

    }
  
}