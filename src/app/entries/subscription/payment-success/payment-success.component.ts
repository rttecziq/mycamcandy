import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'payment-success.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css'
    ]   
})

export class PaymentSuccessComponent{

    video_id : string;

    vod_id : string;

    subscription_id : string;

    constructor(private route : ActivatedRoute) {

        this.route.queryParams.subscribe(params => {

            this.video_id = params['video_id'] > 0 ? params['video_id'] : '';

            this.vod_id = params['vod_id'] ? params['vod_id'] : '';

            this.subscription_id = params['subscription_id'] ? params['subscription_id'] : '';

        });
    }

}