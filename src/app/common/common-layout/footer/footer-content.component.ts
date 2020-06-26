import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

declare var $:any;

const TOP_MENU_LINKS = [1, 2, 3, 4];
const BOTTOM_MENU_LINKS = [2, 3, 4, 11, 12];
const MID_CONTENT = 5;

@Component({
  selector: 'app-footer-content',
  templateUrl: './footer-content.component.html',
  styleUrls: [
    '../../../../assets/css/bootstrap/css/bootstrap.min.css',
    '../../../../assets/css/font-awesome/css/font-awesome.min.css',
    './footer-content.component.css',
  
  ]
})
export class FooterContentComponent implements OnInit {
  errorMessages : string;

  pages_list : any[];
  bottom_links : any[];
  top_links : any[];
  mid_content : string;

  constructor(private requestService : RequestService, private router : Router, private elementRef:ElementRef) {

  }


  ngOnInit(){
    var footer_height = $('#footer_sec1').outerHeight(true);
    footer_height = parseInt(footer_height);
    $('.bottomheight').height(footer_height);
    var viewHeight = document.getElementById('footer_sec1').clientHeight;    
    this.pagesListFn('pages/footer_list', "");
}

  pagesListFn(url, object) {
      this.requestService.postMethod(url,object) 
          .subscribe(
              (data : any) => {
                  if (data.success == true) {
                    let content = data.data[0];
                    this.top_links = content.filter(
                        item =>TOP_MENU_LINKS.includes(item.id)
                    );
                    this.bottom_links = content.filter(
                        item => BOTTOM_MENU_LINKS.includes(item.id)
                    );
                    this.mid_content = content.filter(
                        item => MID_CONTENT == item.id
                    )[0].description;
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
