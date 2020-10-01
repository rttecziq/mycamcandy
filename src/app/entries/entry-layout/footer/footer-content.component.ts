import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $:any;

const BOTTOM_MENU_LINKS = [14, 15, 16, 18, 19];

@Component({
    selector: 'entry-common-footer',
    templateUrl: 'entry-footer-content.component.html',
    styleUrls:['./entry-footer-content.component.css']
})

export class EntryFooterContentComponent implements OnInit{

    errorMessages : string;
    pages_list : any[];
    bottom_links : any[];

    constructor(private requestService : RequestService, private router : Router) {
        this.errorMessages = '';
    }


    ngOnInit(){
        let details = {type:'ModelFooter'};
        this.pagesListFn('pages/footer_list', details);
    }

    pagesListFn(url, object) {
        this.requestService.postMethod(url,object) 
            .subscribe(
                (data : any) => {
                    if (data.success == true) {
                        let content = data.data[0];
                        this.bottom_links = content.filter(
                            item => BOTTOM_MENU_LINKS.includes(item.id)
                        );
                      } else {
                        this.errorMessages = data.error_messages;
                        $.toast({
                            heading: 'Error',
                            text: this.errorMessages,
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });                        
                    }
                },

                (err : HttpErrorResponse) => {
                    this.errorMessages = 'Oops! Something Went Wrong';
                    $.toast({
                        heading: 'Error',
                        text: this.errorMessages,
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });

                }

            );
    }

}