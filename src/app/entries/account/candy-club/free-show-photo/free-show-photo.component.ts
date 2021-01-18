import { Component, AfterViewInit,ElementRef } from '@angular/core';
import { RequestService } from '../../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

declare var $ : any;

@Component({
  selector: 'app-free-show-photo',
  templateUrl: './free-show-photo.component.html',
  styleUrls: ['./free-show-photo.component.css']
})
export class FreeShowPhotoComponent implements AfterViewInit  {

  errorMessages : string;
  loader : boolean;
  photo_lists : any[];
  app_url : string;

  skipCount : number;
  datasAvailable : number;

  constructor(private requestService : RequestService, private router : Router,private elementRef:ElementRef) {
    this.errorMessages = "";
    this.loader = false;
    this.photo_lists = [];
    this.app_url = this.requestService.adminUrl;

    this.skipCount = 0;
    this.datasAvailable = 0;

    let detail = {show_type:"Free",skip : 0};
    this.free_show_photo_list("recorded_photos/list", detail);
  }

  ngAfterViewInit () {
    console.log('load lightgallery');
    this.loadLightgallery();
  }

  ngOnChanges () {
    this.destroyLightGallery();
    this.loadLightgallery();
  }

  loadLightgallery() {
    $(window).bind("load", function() {
        var lightInstance = $("#lightgallery").lightGallery({
          selector: '.item',
          thumbnail: true,
          appendSubHtmlTo: '.lg-item',
          addClass: 'fb-comments',
          download: false,
          enableDrag: false,
          actualSize: false,
          autoplayControls: true,
          enableSwipe: false,
          mode: 'lg-fade'
        });

        var post_id = 0;
        var user_id = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';

        lightInstance.on('onAfterSlide.lg', function(event, prevIndex, index) {
            post_id = $("#post_" + index).val();

            $.get(environment.apiUrl + 'showComments/' + post_id + '/freeshow/' + user_id, function(data){	
                $('.lg-outer .lg-thumb-outer').width($(document).width()-420)
                $('.lg-loaded .fb-comments').html(data);

                emoji();
                replyFocus();
            });
        });

        function emoji () {
            $("div.lg-current .emojionearea").emojioneArea({
                pickerPosition: "top",
                filtersPosition: "bottom",
                tones: false,
                autocomplete: false,
                inline: true,
                hidePickerOnBlur: false,
                events: {
                    keyup: function(editor, event) {      				
                      if (event.which == 13) {
                            var commentType = $('div.lg-current #s_replyArea').attr('data-type');
                            if(commentType != 'post'){
                                var parent_id = $('div.lg-current #s_replyArea').attr('data-id');
                            }
                            var comment = $('div.lg-current .emojionearea-editor').html();

                            var author = user_id;
                            var commenData=	{
                                  author : author,
                                  comment : comment,
                                  parent_id : parent_id ? parent_id : 0
                              }
                            if(comment === '') {
                              alert("Enter your comment!");
                           } else {
                              $.ajax({
                                  type:'POST',
                                  url: environment.apiUrl + 'showComments/' + post_id + '/freeshow',
                                  datatype: "json",
                                  data: commenData,
                                  success:function(data) {
                                        $('.s_commentBoxAreaBox').html(data);

                                        emoji();
                                  }
                              })
                            }
                      }
                    }
              }
            });
        }

        $('body').on('click', "div.lg-current .s_deleteComment", function (e) {
            var comment_id = $(this).val();

            $.ajax({
                type: 'POST',
                url: environment.apiUrl + 'showComments/' + post_id + '/freeshow/' + comment_id + '/' + user_id,
                success:function(data) {
                    $('.s_commentBoxAreaBox').html(data);

                    emoji();
                }
            })
        });

        function replyFocus() {
            $('body').on('click', '.replyComment', function(){  
                var str = $(this).val();
                $('div.lg-current #s_replyArea').attr('data-id', str);
                $('div.lg-current #s_replyArea').attr('data-type', 'comment');
                $('div.lg-current .emojionearea-editor').focus();
            });
        }

        $('body').on('click', '.s_likeIconFI', function(){
            $.ajax({
            type:'POST',
          url: environment.apiUrl + 'showPostLike/' + post_id + '/freeshow',
          data:'user_id='+user_id,
          success:function(data) {
                      console.log(data)
            $('div.lg-current .commentLikeDetails').html(data.text);
            $('.likeValue').html(data.like);
            $('.s_likeIconFI').hide();
            $('.showLikes').css("display", "block");
          }
          })
        });

        // toggle price button
        
        $('body').on('click', '#togglePrice', function(e){
            $('span#addPrice').toggle();
        });

        // Add price
        $('body').on('click', '.addPrice', function(e){

          //alert($('.price').val());

          //alert($(this).val());

        //   $.ajax({
        //   type:'POST',
        // url: environment.apiUrl + 'showPostLike/' + post_id + '/freeshow',
        // data:'user_id='+user_id,
        // success:function(data) {
        //             console.log(data)
        //   $('div.lg-current .commentLikeDetails').html(data.text);
        //   $('.likeValue').html(data.like);
        //   $('.s_likeIconFI').hide();
        //   $('.showLikes').css("display", "block");
        // }
        // })
      });


        $('body').on('click', ".s_likeComment", function (e) { 
            var comment_id = $(this).val();
            var $this = $(this);

            var obj2 = $('.liked_comment_' + comment_id);
            $.ajax({
                type:'POST',
                url: environment.apiUrl + 'showCommentLike/' + post_id + '/'+ comment_id + '/freeshow',
                data: '&user_id=' + user_id,
                success:function(res) {
                    if (res.like == 0) {
                        obj2.html(' ');
                        $this.html('Like');
                    }else{
                        var obj = res;
                        obj2.html('<img src="https://mycamcandy.com/wp-content/uploads/sites/2/2019/05/facebook-thumb-icon.png"><span class="likeValue2">'+obj.like+'</span>');
                        // console.log(obj)
                        $this.html('Unlike');
                    }
                }
            })
    
          });
    });
  }

  destroyLightGallery() {
    $("#lightgallery").data('lightGallery').destroy(true);
  }

  toast_message(heading, message) {
    $.toast({
        heading: heading,
        text: message,
        position: 'top-right',
        stack: false,
        textAlign: 'left',
        loader : false,
        showHideTransition: 'slide'
    });
  }

  // Fan club photo request List
  free_show_photo_list(url, object) {
    this.loader = true;
    this.requestService.postMethod(url,object)
    .subscribe(
        (data : any) => {
            if (data.success == true) {
              this.datasAvailable = 1;

                if (this.skipCount > 0) {
                    this.photo_lists = [...this.photo_lists, ...data.data];
                } else {
                    this.photo_lists = data.data;
                }

                this.skipCount += data.data.length;
                if (data.data.length <= 0) {
                    this.datasAvailable = 0;
                }
              //this.photo_lists = data.data;
              this.loader = false;
            } else {
              this.loader = false;
            }
        },
        (err : HttpErrorResponse) => {
            this.errorMessages = 'Oops! Something Went Wrong';
            this.toast_message("Error", this.errorMessages);
        },
        () => {

            setTimeout(() => {

                this.loader = false;

            }, 2000);
        }

    );

}

showMore() {
  let detail = {show_type:"Free",skip:this.skipCount};
  this.free_show_photo_list("recorded_photos/list", detail);
}

}