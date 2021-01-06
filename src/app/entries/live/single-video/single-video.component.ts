/*
 *   Copyright (c) 2020 Akash Kumar Shukla
 *   All rights reserved.
 */
import { PrivateModeRequest } from './../../../models/join-video';
/* tslint:disable:triple-equals */
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit
} from '@angular/core';

import { RequestService } from '../../../common/services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Chat } from '../../../common/services/model/chat';
import { Event } from '../../../common/services/model/event';
import { ChatSocketService } from '../../../common/services/chat-socket.service';
import { JoinVideo } from '../../../models/join-video';

declare var $: any;

declare var RTCMultiConnection: any;

declare var getHTMLMediaElement: any;

declare function getBrowser(): any;

declare function getMobileOperatingSystem(): any;

declare var kurentoObject: any;
declare var RecordRTC;

declare var StereoAudioRecorder;

@Component({
  templateUrl: 'single-video.component.html',
  styleUrls: [
    '../../../../assets/css/bootstrap/css/bootstrap.css',
    '../../../../assets/css/font-awesome/css/font-awesome.min.css',
    '../../../../assets/css/style.css',
    '../../../../assets/css/responsive.css',
    '../../../../assets/css/getHTMLMediaElement.css',
    "../../../../assets/css/start-streaming.css"
  ]
})
export class SingleVideoComponent implements OnInit, OnDestroy {
  public elementRef;

  video_id: string;

  errorMessages: string;

  video_details: JoinVideo;

  public_videos: any[];

  suggestions: any[];

  chat_messages: any[];

  // Chat Variables

  liveVideoViewerID: string;

  userID: string;

  room: string;

  chat: Chat;

  messageContent: string;

  ioConnection: any;

  userpicture: string;

  username: string;

  connection = new RTCMultiConnection();

  video_attribute: boolean;

  defaultImage: boolean;

  stop_live: boolean;

  browser: string;

  mobile_browser: string;

  is_kurento_running: boolean;

  kurento_socket_url: string;

  wowza_ip_address: string;

  port_no: string;

  site_settings: any[];

  viewer_cnt: number;

  snapshot_capture: any;

  snapshot_pic: any;

  capture: any;

  navigateWindow: any;

  isStreaming = 0;

  start: any;

  onIceCandidate: any;

  updateRtpSdp: any;

  onOffer: any;

  start_response: any;

  kurentoObj: any;

  paymentChecker: any = null;
  snapShotCaptureUtil: any = null;
  getPrivateRequestUtil: any = null;
  paymentTimerDuration = 5; // 5 minute as default. Redeived in minutes from server
  snapShotTimerDuration = 5; // in seconds
  readonly noOfMiliSecondsAMinute = 60000;
  readonly noOfMiliSecondsASecond = 1000;
  privateRequests: any;
  isPrivate: number;
  privateViewers: any;
  cpm: number;
  status: number;
  publicVideoFileName: string;
  privateVideoFileName: string;
  show_type: string;
  kurentoPrivateFileSavePath: string;
  video_type: any;
  livePrivateRequestId: number;
  total_candies: any;
  liveVideoID: any;
  clockMin: number;
  clockSec: any;
  clockTimer: any;
  timer: any;
  video_start_time: string;
  clockHour: number;
  candiesChecker: any;
  show_type_price: any;

  constructor(
    myElement: ElementRef,
    private requestService: RequestService,
    private route: ActivatedRoute,
    private chatSocketService: ChatSocketService,
    private router: Router
  ) {
    this.elementRef = myElement;

    this.errorMessages = '';

    this.public_videos = [];

    this.navigateWindow = 0;

    localStorage.setItem('navigateWindow', this.navigateWindow);

    this.video_details = {
      title: '',
      type: '',
      amount: 0,
      description: '',
      viewer_cnt: '',
      name: '',
      snapshot: '',
      is_streaming: 0,
      live_group_id: 0
    };

    this.suggestions = [];

    this.video_attribute = true;

    this.defaultImage = true;

    this.stop_live = false;

    // Get Browser
    this.browser = getBrowser();

    this.mobile_browser = getMobileOperatingSystem();

    this.site_settings = JSON.parse(localStorage.getItem('site_settings'));

    const socket_url = this.site_settings.filter(obj => {
      return obj.key === 'SOCKET_URL';
    });

    const wowza_ip_address = this.site_settings.filter(obj => {
      return obj.key === 'wowza_ip_address';
    });

    const kurento_socket_url = this.site_settings.filter(obj => {
      return obj.key === 'kurento_socket_url';
    });

    this.wowza_ip_address =
      wowza_ip_address.length > 0 ? wowza_ip_address[0].value : '';

    this.kurento_socket_url =
      kurento_socket_url.length > 0 ? kurento_socket_url[0].value : '';

    this.route.queryParams.subscribe(params => {
      this.video_id = params['video_id'];

      const details = { video_id: this.video_id, browser: this.browser };

      this.singleVideoDetail('single_video', details);
    });

    this.chat_messages = [];

    /**************************Save Video Code**************************/

    
    /*************************End Kurento Code****************************/

    /********************** WEBRTC connection **************************/

    // by default, socket.io server is assumed to be deployed on your own URL
    this.connection.socketURL =
      socket_url.length > 0 ? socket_url[0].value : '';

    // comment-out below line if you do not have your own socket.io server
    // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    this.connection.socketMessageEvent = 'video-broadcast-demo';

    this.connection.session = {
      audio: true,
      video: true,
      oneway: this.isPrivate == 1? false : true
    };

    this.connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false
    };

    this.connection.videosContainer = document.getElementById(
      'videos-container'
    );

    let recordAudio, recordVideo;

    this.connection.onstream = function(event) {
      const existing = document.getElementById(event.streamid);
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }

      event.mediaElement.removeAttribute('src');
      event.mediaElement.removeAttribute('srcObject');
      event.mediaElement.muted = true;
      event.mediaElement.volume = 0;

      const video = document.createElement('video');

      try {
        video.setAttributeNode(document.createAttribute('autoplay'));
        video.setAttributeNode(document.createAttribute('playsinline'));
      } catch (e) {
        video.setAttribute('autoplay', this.video_attribute);
        video.setAttribute('playsinline', this.video_attribute);
      }

      if (event.type === 'local') {
        video.volume = 0;
        try {
          video.setAttributeNode(document.createAttribute('muted'));
        } catch (e) {
          video.setAttribute('muted', this.video_attribute);
        }
      }
      video.srcObject = event.stream;

      // this.width = parseInt(document.getElementById("videos-container").clientWidth / 3) - 20;

      const mediaElement = getHTMLMediaElement(video, {
        title: event.userid,
        buttons: [],
        width: '100%',
        showOnMouseEnter: false
      });

      Array.from(document.getElementById("videos-container").childNodes).forEach((node, index) => {
        if(index == 0 || index == 1){console.log(index,'index')}
        else{
          document.getElementById("videos-container").removeChild(node);
          console.log('removing', node);
        }
      });
      
      // if(document.getElementById('videos-container').childElementCount > 2){
      //   console.log('replace')
      console.log('append')
      document.getElementById('videos-container').appendChild(mediaElement);
      
      
      
      setTimeout(() => {
        mediaElement.media.play();

        this.capture();
      }, 5000);

      mediaElement.id = event.streamid;

      document.getElementById('start-live').click();

      recordAudio = RecordRTC(event.stream, {
        type: 'audio',
        recorderType: StereoAudioRecorder,
        // bufferSize: 16384,
        onAudioProcessStarted: function() {
          recordVideo.startRecording();
        }
      });

      const videoOnlyStream = new MediaStream();
      videoOnlyStream.addTrack(event.stream.getVideoTracks()[0]);
      recordVideo = RecordRTC(videoOnlyStream, {
        type: 'video'
        // recorderType: MediaStreamRecorder || WhammyRecorder
      });

      recordAudio.startRecording();

        // tslint:disable-next-line:no-shadowed-variable
      function takePhoto(video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || video.clientWidth;
        canvas.height = video.videoHeight || video.clientHeight;

        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL('image/png');
      }

      const yourVideoElement = document.querySelector('video');

      this.capture = function() {
        this.snapshot_pic = takePhoto(yourVideoElement);

        $('#snapshot').val(this.snapshot_pic);

        setTimeout(() => {
          // console.log(this.snapshot_pic);

          $('#snapshot_id').click();
        }, 1000);
      };

      this.snapshot_capture = setInterval(() => {
        this.capture();
      }, 60 * 1000);
    };

    this.connection.onstreamended = function(event) {
      const mediaElement = document.getElementById(event.streamid);
      if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);

        /*if(event.userid === this.connection.sessionid && !this.connection.isInitiator) {
                  alert('Broadcast is ended. We will reload this page to clear the cache.');
                  location.reload();
                } */
      }
    };

    // capture();

    /*this.connection.onMediaError = function(e) {
            if (e.message === 'Concurrent mic process limit.') {
                if (DetectRTC.audioInputDevices.length <= 1) {
                    alert('Please select external microphone. Check github issue number 483.');
                    return;
                }

                var secondaryMic = DetectRTC.audioInputDevices[1].deviceId;
                connection.mediaConstraints.audio = {
                    deviceId: secondaryMic
                };

                connection.join(connection.sessionid);
            }
        };*/

  // set time duration for payment deductions

  const streaming_charge_deduction_duration = this.site_settings.filter(obj => {
    return obj.key === 'streaming_charge_deduction_duration';
  });
  this.paymentTimerDuration = streaming_charge_deduction_duration[0].value;

  const snapshot_interval = this.site_settings.filter(obj => {
    return obj.key === 'snapshot_interval';
  });
  this.snapShotTimerDuration = snapshot_interval[0].value;
  }

  /*************************Save Video here**********************************/
    saveVideoName(filename: string) {
      this.requestService
      .postMethod('save_video_name', {
        video_id: this.video_id,
        name: filename,
        id: this.userID
      })
      .subscribe(
        (data: any) => {
          if (data.success == true) {
          } else {
            this.errorMessages = data.error_messages;
            console.log(this.errorMessages);
          }
        },
        (err: HttpErrorResponse) => {
          this.errorMessages = 'Oops! Something Went Wrong';
        }
      );
    }

  snapShotFn() {
    this.snapshot_pic = $('#snapshot').val();

    this.requestService
      .postMethod('live-video/snapshot', {
        video_id: this.video_id,
        snapshot: this.snapshot_pic,
        show_type: this.show_type,
      })
      .subscribe(
        (data: any) => {
          if (data.success == true) {
          } else {
            this.errorMessages = data.error_messages;

            console.log(this.errorMessages);

            // return this.router.navigate(['/broadcast']);
          }
        },

        (err: HttpErrorResponse) => {
          this.errorMessages = 'Oops! Something Went Wrong';
        }
      );
  }

  // ......................................................
  // .......................UI Code........................
  // ......................................................
  openRoom() {
    const room_id = this.room;

    this.connection.open(room_id, () => {
      document.getElementById('defaultImage').style.display = 'none';

      document.getElementById('open-room').style.display = 'none';

      document.getElementById('stop-live').style.display = 'block';

      $('.side-menubar').addClass('disable-links');

      $('.navbar-fixed-top').addClass('disable-links');

      if (this.is_kurento_running) {
        this.kurentoObj.start();

        // this.start();
      }

        if ( this.snapShotCaptureUtil == null) {
          console.log('setting snapshot timer');
          this.snapShotCaptureUtil = setInterval(() => {
            this.snapShotFn();
        }, this.snapShotTimerDuration * this.noOfMiliSecondsASecond );
        };
        // set getrequest timer
        if ( this.getPrivateRequestUtil == null) {
          console.log('setting getPrivateRequestUtil timer');
          this.getPrivateRequestUtil = setInterval(() => {
            this.getPrivateVideoRequest();
        }, 10000 );
        };
        if(this.candiesChecker == null){
          this.candiesChecker = setInterval(() => {
            this.getUserStatusWithCandies();
          },this.paymentTimerDuration * this.noOfMiliSecondsAMinute);
        }
    });
  }

  showClock = () =>{
    let that = this;
    var minutesLabel: string = this.clockMin.toString();
    var secondsLabel = this.clockSec;
    var totalSeconds = 0;
    setInterval(setTime, 1000);

    function setTime() {
      ++totalSeconds;
      secondsLabel = pad(totalSeconds % 60);
      minutesLabel = pad((totalSeconds / 60));
      that.clockSec = totalSeconds;
      that.clockMin = parseInt(minutesLabel);
    }

    function pad(val) {
      var valString = val + "";
      if (valString.length < 2) {
        return "0" + valString;
      } else {
        return valString;
      }
    }
  }  
  stopLive() {
    if (confirm('Are you sure you would like to stop the live streaming?')) {
      this.navigateWindow = 1;

      localStorage.setItem('navigateWindow', this.navigateWindow);

      const details = { video_id: this.video_id };

      this.requestService.postMethod('close_streaming', details).subscribe(
        (data: any) => {
          if (data.success == true) {
            this.connection.attachStreams.forEach(function(stream) {
              stream.stop();
            });

            try{
              if (this.is_kurento_running) {
                this.kurentoObj.stop();
              }
            } catch(err){
              console.log(err);
            }

            $.toast({
              heading: 'Success',
              text: 'Your streaming has been ended successfully',
              // icon: 'error',
              position: 'top-right',
              stack: false,
              textAlign: 'left',
              loader: false,
              showHideTransition: 'slide'
            });
            clearInterval(this.candiesChecker);

            return this.router.navigate(['/performer-dashboard']);
          } else {
            this.errorMessages = data.error_messages;

            $.toast({
              heading: 'Error',
              text: this.errorMessages,
              // icon: 'error',
              position: 'top-right',
              stack: false,
              textAlign: 'left',
              loader: false,
              showHideTransition: 'slide'
            });
          }
        },

        (err: HttpErrorResponse) => {
          this.errorMessages = 'Oops! Something Went Wrong';

          $.toast({
            heading: 'Error',
            text: this.errorMessages,
            // icon: 'error',
            position: 'top-right',
            stack: false,
            textAlign: 'left',
            loader: false,
            showHideTransition: 'slide'
          });
        }
      );
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.candiesChecker = null;
    this.clockTimer = null;
    /*$.getScript('../../../../assets/js/kurento/adapter.js',function(){});

        $.getScript('../../../../assets/js/kurento/index.js',function(){});

        $.getScript('../../../../assets/js/kurento/kurento-utils.js',function(){});

        $.getScript('../../../../assets/js/kurento.js',function(){}); */
  }

  webRtc (isRecordingNeeded: boolean, isPrivate: boolean) {
    /***************************Kurento Code****************************/
    console.log('setting up kurento with', isRecordingNeeded);
  this.is_kurento_running = false;
    setTimeout(() => {
      if (this.browser == 'Safari' || this.mobile_browser == 'ios') {
        console.log('kurento not supported..!');
      } else {
        console.log(this.wowza_ip_address);

        console.log(this.kurento_socket_url);

        if (this.wowza_ip_address && this.kurento_socket_url) {
          this.is_kurento_running = true;
            const dir = 'file:///var/www/html/stream/mycamcandy-server/public/video_capture/' + this.userID + '/';
            const kurentoFileSavePath = dir + 'stream_' + this.video_id + '.webm';
            this.kurentoPrivateFileSavePath = dir + 'stream_' + this.video_id + '_1' + '.webm';

            const serverFileSavePath = 'stream_' + this.video_id + '.webm';
            
            this.publicVideoFileName = serverFileSavePath;

            this.privateVideoFileName = 'stream_' + this.video_id + '_1' + '.webm';
            
            this.saveVideoName(serverFileSavePath);
            this.kurentoObj = new kurentoObject(
            this.kurento_socket_url,
            this.wowza_ip_address,
            (isRecordingNeeded && isPrivate ? this.kurentoPrivateFileSavePath : kurentoFileSavePath),
            isRecordingNeeded,
           );
        } else {
          console.log(
            'Wowza / Kurento Not configured...! so IOS Mobile Device wil not work..!'
          );
        }
      }
    }, 1000);
  }
  
  singleVideoDetail(url, object) {
    this.requestService.postMethod(url, object).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.video_details = data.data;

          this.chat_messages = data.data.comments;

          this.userpicture = data.data.chat_picture;

          this.username = data.data.name;

          this.room = data.data.unique_id;

          this.userID = data.data.user_id;

          this.viewer_cnt = data.data.viewer_cnt;

          this.port_no = data.data.port_no > 0 ? data.data.port_no : '33124';

          this.isStreaming = data.data.is_streaming;

          this.isPrivate = data.data.is_private;

          this.privateViewers = data.data.private_viewer;

          // this.getPrivateRequestId(this.privateViewers);
          this.livePrivateRequestId = data.data.private_video_id;

          this.cpm = data.data.cpm;
          
          this.show_type = data.data.show_type;

          this.video_type = data.data.type;

          this.total_candies = data.data.total_candies;

          this.video_start_time = data.data.video_start_time;

          this.show_type_price = data.data.show_type_price;
          // this.getTimeDifference(this.video_start_time);
          

          if(this.isPrivate == 1){
            // record it as private mode file
            this.webRtc(true, true);
            if(this.candiesChecker == null){
              this.candiesChecker = setInterval(() => {
                this.getUserStatusWithCandies();
              },this.paymentTimerDuration * this.noOfMiliSecondsAMinute);
            }
          } else if((!(this.show_type == 'Free' && this.video_type == 'public')) && this.isPrivate != 1){
            // record it but not as private file.
            this.webRtc(true, false);
            if(this.candiesChecker == null){
              this.candiesChecker = setInterval(() => {
                this.getUserStatusWithCandies();
              },this.paymentTimerDuration * this.noOfMiliSecondsAMinute);
            }
          } 
          else{
            // don't record it.
            this.webRtc(false, false);  
          }

          this.status = data.data.status;
          
          this.initIoConnection();

          this.getViewers('get_viewers', { video_id: this.video_id });

          if (data.data.is_streaming > 0) {
            $('.side-menubar').addClass('disable-links');

            $('.navbar-fixed-top').addClass('disable-links');

            $.toast({
              heading: 'Warning',
              text:
                'If you want to leave this page, Please stop your streaming and continue to Navigate',
              // icon: 'error',
              position: 'top-right',
              stack: false,
              textAlign: 'left',
              loader: false,
              showHideTransition: 'slide'
            });

            this.openRoom();
            if ( this.clockTimer == null) {
              this.clockTimer = setInterval(() => {
                this.timer++;
                //this.showClock(this.timer++);
              }, 1000 );
            };
          }
        } else {
          this.errorMessages = data.error_messages;

          $.toast({
            heading: 'Error',
            text: this.errorMessages,
            // icon: 'error',
            position: 'top-right',
            stack: false,
            textAlign: 'left',
            loader: false,
            showHideTransition: 'slide'
          });

          return this.router.navigate(['/performer-dashboard']);
        }
      },

      (err: HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';

        $.toast({
          heading: 'Error',
          text: this.errorMessages,
          // icon: 'error',
          position: 'top-right',
          stack: false,
          textAlign: 'left',
          loader: false,
          showHideTransition: 'slide'
        });
      }
    );
  }

  // /get_private_request
  //get private video request
  // this method fetches the private mode request
  // is being called every 5 seconds
  getPrivateVideoRequest(): any{
    let body = {live_video_id : this.video_id};
    this.requestService.postMethod('get_private_request', body).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.privateRequests = data.data;
          this.total_candies = data.total_candies;
      }
    },
      (err: HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';

        $.toast({
          heading: 'Error',
          text: this.errorMessages,
          // icon: 'error',
          position: 'top-right',
          stack: false,
          textAlign: 'left',
          loader: false,
          showHideTransition: 'slide'
        });
      }
    );
  }

  checkAndUpdateUserPaymentStatus() {
    const url = 'deduct_from_wallet';
    const details = {video_id : this.video_id, cpm: this.cpm, type: this.show_type};
    this.requestService.getMethod(url, details).subscribe((data: any) => {
      console.log(data);
      if (data.success == true) {
        this.total_candies = data.data.total_candies;
      } else {
        if (data.error_code == 156) {
          return this.router.navigate(['/candies-package'], {
            queryParams: { video_id: this.liveVideoID }
          });
        } else if(data.error_code == 160){
          try{
            this.connection.attachStreams.forEach(function(stream) {
            stream.stop();
          });
           } catch(error){
             console.log(error);
           }
            this.errorMessages = data.error_messages;
            $.toast({
              heading: 'Error',
              text: this.errorMessages,
              // icon: 'error',
              position: 'top-right',
              stack: false,
              textAlign: 'left',
              loader: false,
              showHideTransition: 'slide'
            });
            this.router.navigate(['/']);
        } else{
          this.errorMessages = data.error_messages;

          $.toast({
            heading: 'Error',
            text: this.errorMessages,
            // icon: 'error',
            position: 'top-right',
            stack: false,
            textAlign: 'left',
            loader: false,
            showHideTransition: 'slide'
          });
        }
      }
    }, (error) => {
      console.log(error);
    });
  }
  //accept_private_request
  acceptPrivateMode(userId: number, privateVideoId: number, liveVideoId: number) : any {
    let acceptPrivateRequest : PrivateModeRequest;
    console.log(userId, privateVideoId, liveVideoId);
    acceptPrivateRequest = { 
      id: this.userID, 
      live_video_id: liveVideoId, 
      user_id : userId, 
      private_cpm : 10,
      video_name : this.privateVideoFileName, 
      video_url: '',
      snapshot: '', 
      is_streaming: this.isStreaming, 
      status: this.status,
      cpm: this.cpm,
    }; 
      this.requestService.postMethod('accept_private_request', acceptPrivateRequest).subscribe(
        (data: any) => {
          if (data.success == true) {
          console.log(data);
          
           if (this.is_kurento_running) {
            this.kurentoObj.stop();
            // this.kurentoObj = new kurentoObject(
            //   this.kurento_socket_url,
            //   this.wowza_ip_address,
            //   this.kurentoPrivateFileSavePath,
            //   true
            //  );
            // record it as private file.
            this.webRtc(true, true);
            this.kurentoObj.start();
          }
        }
        },(err: HttpErrorResponse) => {
          this.errorMessages = 'Oops! Something Went Wrong';
  
          $.toast({
            heading: 'Error',
            text: this.errorMessages,
            // icon: 'error',
            position: 'top-right',
            stack: false,
            textAlign: 'left',
            loader: false,
            showHideTransition: 'slide'
          });
        })
  }
  // Chat connection

  private initIoConnection() {
    this.chatSocketService.initSocket(this.room);

    this.ioConnection = this.chatSocketService
      .onMessage()
      .subscribe((message: any) => {
        this.chat_messages.push(message);
      });

    this.ioConnection = this.chatSocketService
      .getViewersCnt()
      .subscribe((data: any) => {
        this.viewer_cnt = data;
      });

    this.chatSocketService.onEvent(Event.CONNECT).subscribe(() => {
      console.log('connected');
    });

    this.chatSocketService.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log('disconnected');
    });
  }

  public sendMessage(message: string) {
    if (!message) {
      return;
    }

    const details = {
      user_id: this.userID, // Viewer id

      live_video_viewer_id: 0, // Viewer id

      message: message,

      type: 'uv', // viewer To streamer

      live_video_id: this.video_id,

      userpicture: this.userpicture,

      username: this.username
    };

    this.chatSocketService.send(details);

    this.chat_messages.push(details);

    this.messageContent = null;
  }

  liveStatus() {
    const details = { video_id: this.video_id };

    this.requestService.postMethod('streaming/status', details).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.isStreaming = 1;
        } else {
          this.errorMessages = data.error_messages;

          $.toast({
            heading: 'Error',
            text: this.errorMessages,
            // icon: 'error',
            position: 'top-right',
            stack: false,
            textAlign: 'left',
            loader: false,
            showHideTransition: 'slide'
          });
        }
      },

      (err: HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';

        $.toast({
          heading: 'Error',
          text: this.errorMessages,
          // icon: 'error',
          position: 'top-right',
          stack: false,
          textAlign: 'left',
          loader: false,
          showHideTransition: 'slide'
        });
      }
    );
  }

  getPrivateRequestId(privateViewers){
    try{
      if(this.isPrivate == 1){
        privateViewers.forEach(element => {
          if(element['status'] == 'Accepted')
          console.log(element,'these are private requested');
          this.livePrivateRequestId = element['id'];
        });
      }
    } catch(err){
      console.log(err);
    }
  }

  getTimeDifference(video_start_time: string) {
    console.log('video_start_time', video_start_time);
    let time: string[] = video_start_time.split(':');
    let now = new Date();
    this.clockHour = Math.ceil(now.getHours() - parseInt(time[0]));
    this.clockMin = Math.ceil(now.getMinutes() - parseInt(time[1]));
    this.clockSec = Math.ceil(now.getSeconds() - parseInt(time[2]));
    console.log(this.clockHour + ':' + this.clockMin + ':' + this.clockSec);
  }
  

  getUserStatusWithCandies(){
    //getLiveStatusWithCandies
    this.requestService.getMethod('get_user_live_status', this.video_id).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.total_candies = data.total_candies;
          console.log(data);
        } else if(data.error_code == 160){
          try{
            this.connection.attachStreams.forEach(function(stream) {
            stream.stop();
          });
           } catch(error){
             console.log(error);
           }
            this.errorMessages = data.error_messages;
            $.toast({
              heading: 'Error',
              text: this.errorMessages,
              // icon: 'error',
              position: 'top-right',
              stack: false,
              textAlign: 'left',
              loader: false,
              showHideTransition: 'slide'
            });
            this.router.navigate(['/']);
        } else{
          this.errorMessages = data.error_messages;
          $.toast({
            heading: 'Error',
            text: this.errorMessages,
            // icon: 'error',
            position: 'top-right',
            stack: false,
            textAlign: 'left',
            loader: false,
            showHideTransition: 'slide'
          });
        }
      },(err: HttpErrorResponse) => {
        this.errorMessages = 'User has exited the private session';

        $.toast({
          heading: 'Error',
          text: this.errorMessages,
          // icon: 'error',
          position: 'top-right',
          stack: false,
          textAlign: 'left',
          loader: false,
          showHideTransition: 'slide'
        });
      });
  }

  ngOnDestroy() {
    // this.stopLive();

    clearInterval(this.snapshot_capture);
    clearInterval(this.candiesChecker);
    clearInterval(this.clockTimer);
   
    const details = { video_id: this.video_id, private_video_id: this.livePrivateRequestId };

    $('.side-menubar').removeClass('disable-links');

    $('.navbar-fixed-top').removeClass('disable-links');

    this.requestService.postMethod('close_streaming', details).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.connection.attachStreams.forEach(function(stream) {
            stream.stop();
          });

          if (this.is_kurento_running) {
            this.kurentoObj.stop();
          }

          $.toast({
            heading: 'Success',
            text: 'Your streaming has been ended successfully',
            // icon: 'error',
            position: 'top-right',
            stack: false,
            textAlign: 'left',
            loader: false,
            showHideTransition: 'slide'
          });

          return this.router.navigate(['/performer-dashboard']);
        } else {
          this.errorMessages = data.error_messages;

          $.toast({
            heading: 'Error',
            text: this.errorMessages,
            // icon: 'error',
            position: 'top-right',
            stack: false,
            textAlign: 'left',
            loader: false,
            showHideTransition: 'slide'
          });
        }
      },

      (err: HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';

        $.toast({
          heading: 'Error',
          text: this.errorMessages,
          // icon: 'error',
          position: 'top-right',
          stack: false,
          textAlign: 'left',
          loader: false,
          showHideTransition: 'slide'
        });
      }
    );
  }

  getViewers(url, object) {
    this.requestService.postMethod(url, object).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.viewer_cnt = data.viewer_cnt;

          setTimeout(() => {
            this.chatSocketService.checkViewersCnt(this.viewer_cnt);
          }, 10 * 1000);
        } else {
          this.errorMessages = data.error_messages;

          /*$.toast({
                            heading: 'Error',
                            text: this.errorMessages,
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        }); */
        }
      },

      (err: HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';

        /*$.toast({
                        heading: 'Error',
                        text: this.errorMessages,
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    }); */
      }
    );
  }
}
