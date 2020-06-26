import { Component , AfterViewInit, OnInit } from '@angular/core';

declare var $: any;
@Component({

    templateUrl: 'error.component.html',
    styleUrls:[
        '../../../assets/css/bootstrap/css/bootstrap.min.css',
        '../../../assets/css/font-awesome/css/font-awesome.min.css',
        '../../../assets/css/style.css',
        '../../../assets/css/responsive.css',
    ]
})

export class ErrorComponent implements OnInit{

    onDeactivate(){
        $('html, body').animate({
            scrollTop: 0
        });
    }

    constructor() {

    }
  
    ngOnInit () {

    }

}