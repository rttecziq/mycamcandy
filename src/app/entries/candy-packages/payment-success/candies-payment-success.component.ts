import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'candies-payment-success.component.html',
    styleUrls:['../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../assets/css/jquery-ui.css',
                '../../../../assets/css/style.css',
                '../../../../assets/css/responsive.css'
    ]   
})

export class CandiesPaymentSuccessComponent{
    candies_package_id : string;

    constructor(private route : ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            this.candies_package_id = params['candies_package_id'] ? params['candies_package_id'] : '';
        });
    }

}