import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';

declare var $:any;

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  errorMessages : string;
  albums : any[];

  constructor(private requestService : RequestService, private router : Router, private elementRef:ElementRef) {

  }

  ngOnInit() {
    this.albumListFn('album_list', "");
  }

  albumListFn(url, object) {
    this.requestService.postMethod(url,object) 
        .subscribe(
            (data : any) => {
                if (data.success == true) {
                  this.albums = data.data;
                } else {                  
                    this.errorMessages = data.error_messages;
                    $.toast({
                        heading: 'Error',
                        text: this.errorMessages,
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
