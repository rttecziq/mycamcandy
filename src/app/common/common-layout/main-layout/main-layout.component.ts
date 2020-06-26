import { Component, OnInit } from '@angular/core';

declare var $:any;

@Component({
  templateUrl: 'main-layout.component.html',
  styleUrls: ['../../../../assets/css/style.css',
              '../../../../assets/css/responsive.css',
  ],
})
export class MainLayoutComponent implements OnInit {

  onDeactivate(){
    $('html, body').animate({
      scrollTop: 0
    });
  }
  constructor() { }

  ngOnInit() {

      

  }

}

