import { Component  } from '@angular/core';

declare var $:any;

@Component({
  templateUrl: 'common.component.html'
})

export class CommonComponent {
  onDeactivate(){
    $('html, body').animate({
      scrollTop: 0
    });
  }

  
}
