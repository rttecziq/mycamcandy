import { Component, OnInit, ElementRef, Input } from '@angular/core';

declare var $:any;

@Component({
    selector: 'common-footer',
    templateUrl: 'footer.component.html',
    styleUrls:[
        '../../../../assets/css/bootstrap/css/bootstrap.min.css',
        '../../../../assets/css/font-awesome/css/font-awesome.min.css',
        '../../../../assets/css/style.css',
        '../../../../assets/css/responsive.css',
    ],
})

export class FooterComponent implements OnInit{


    constructor() {
    }


    ngOnInit(){
    }

}