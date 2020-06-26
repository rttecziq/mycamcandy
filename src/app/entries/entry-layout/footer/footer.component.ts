import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Admin } from '../../../models/admin';

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

export class EntryFooterComponent implements OnInit{


    constructor() {
    }


    ngOnInit(){
    }

}