import { Component, OnInit } from '@angular/core';
import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';
declare var $: any ;
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  toggled: boolean = false;
  message: string = '';
  
  constructor() { }

  msgActive() {
    $('.active_msg').on('click', 'li', function() {
    $('.active_msg li.active').removeClass('active');
    $(this).addClass('active');
    });
  }
 
  
  ngOnInit() {
    
    this.msgActive();
    //this.emojiLoad();
  }
  // emojiLoad() {
  //   $.getScript("../../../../../assets/emoji/emojionearea.min.js");
  //   $("#sent_msg").emojioneArea({
  //     pickerPosition:"bottom"
  //   })
  // }
  ngAfterViewInit(){
    /* $.getScript('../../../../assets/js/script.js',function(){
     });
     $.getScript('../../../../assets/js/custom-file-input.js',function(){
     });
     $.getScript('../../../../assets/js/classie.js',function(){
     });
     $.getScript('../../../../assets/js/form.js',function(){
     });
     $.getScript('../../../../assets/js/lightbox.min.js',function(){
     }); */
    //  $.getScript('../../../../../assets/emoji/emojionearea.min.js',function(){
    // });
    }
  

}