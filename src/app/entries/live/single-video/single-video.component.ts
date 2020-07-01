import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  OnInit
} from "@angular/core";

import videojs from "video.js";
import { RequestService } from "../../../common/services/request.service";
import { ActivatedRoute, UrlHandlingStrategy, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

import { Chat } from "../../../common/services/model/chat";
import { Event } from "../../../common/services/model/event";
import { ChatSocketService } from "../../../common/services/chat-socket.service";
import { JoinVideo } from "../../../models/join-video";

declare var $: any;

declare var RTCMultiConnection: any;

declare var getHTMLMediaElement: any;

declare function getBrowser(): any;

declare function getMobileOperatingSystem(): any;

declare var kurentoObject: any;

declare var kurentoUtils;

declare var RecordRTC;

declare var StereoAudioRecorder;

@Component({
  templateUrl: "single-video.component.html",
  styleUrls: [
    "../../../../assets/css/bootstrap/css/bootstrap.css",
    "../../../../assets/css/font-awesome/css/font-awesome.min.css",
    "../../../../assets/css/style.css",
    "../../../../assets/css/responsive.css",
    "../../../../assets/css/getHTMLMediaElement.css"
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

  liveVideoID: string;

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

  constructor(
    myElement: ElementRef,
    private requestService: RequestService,
    private route: ActivatedRoute,
    private chatSocketService: ChatSocketService,
    private router: Router
  ) {
    this.elementRef = myElement;

    this.errorMessages = "";

    this.public_videos = [];

    this.navigateWindow = 0;

    localStorage.setItem("navigateWindow", this.navigateWindow);

    this.video_details = {
      title: "",
      type: "",
      amount: 0,
      description: "",
      viewer_cnt: "",
      name: "",
      snapshot: "",
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

    this.site_settings = JSON.parse(localStorage.getItem("site_settings"));

    let socket_url = this.site_settings.filter(obj => {
      return obj.key === "SOCKET_URL";
    });

    let wowza_ip_address = this.site_settings.filter(obj => {
      return obj.key === "wowza_ip_address";
    });

    let kurento_socket_url = this.site_settings.filter(obj => {
      return obj.key === "kurento_socket_url";
    });

    this.wowza_ip_address =
      wowza_ip_address.length > 0 ? wowza_ip_address[0].value : "";

    this.kurento_socket_url =
      kurento_socket_url.length > 0 ? kurento_socket_url[0].value : "";

    this.route.queryParams.subscribe(params => {
      this.video_id = params["video_id"];

      let details = { video_id: this.video_id, browser: this.browser };

      this.singleVideoDetail("single_video", details);
    });

    this.chat_messages = [];

    /***************************Kurento Code****************************/

    this.is_kurento_running = false;

    setTimeout(() => {
      if (this.browser == "Safari" || this.mobile_browser == "ios") {
        console.log("kurento not supported..!");
      } else {
        console.log(this.wowza_ip_address);

        console.log(this.kurento_socket_url);

        if (this.wowza_ip_address && this.kurento_socket_url) {
          this.is_kurento_running = true;

          this.kurentoObj = new kurentoObject(
            this.kurento_socket_url,
            this.wowza_ip_address
          );
        } else {
          console.log(
            "Wowza / Kurento Not configured...! so IOS Mobile Device wil not work..!"
          );
        }
      }
    }, 1000);

    /*************************End Kurento Code****************************/

    /********************** WEBRTC connection **************************/

    // by default, socket.io server is assumed to be deployed on your own URL
    this.connection.socketURL =
      socket_url.length > 0 ? socket_url[0].value : "";

    // comment-out below line if you do not have your own socket.io server
    // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    this.connection.socketMessageEvent = "video-broadcast-demo";

    this.connection.session = {
      audio: true,
      video: true,
      oneway: true
    };

    this.connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false
    };

    this.connection.videosContainer = document.getElementById(
      "videos-container"
    );

    var recordAudio, recordVideo;

    this.connection.onstream = function(event) {
      var existing = document.getElementById(event.streamid);
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }

      event.mediaElement.removeAttribute("src");
      event.mediaElement.removeAttribute("srcObject");
      event.mediaElement.muted = true;
      event.mediaElement.volume = 0;

      var video = document.createElement("video");

      try {
        video.setAttributeNode(document.createAttribute("autoplay"));
        video.setAttributeNode(document.createAttribute("playsinline"));
      } catch (e) {
        video.setAttribute("autoplay", this.video_attribute);
        video.setAttribute("playsinline", this.video_attribute);
      }

      if (event.type === "local") {
        video.volume = 0;
        try {
          video.setAttributeNode(document.createAttribute("muted"));
        } catch (e) {
          video.setAttribute("muted", this.video_attribute);
        }
      }
      video.srcObject = event.stream;

      // this.width = parseInt(document.getElementById("videos-container").clientWidth / 3) - 20;

      var mediaElement = getHTMLMediaElement(video, {
        title: event.userid,
        buttons: [],
        width: "100%",
        showOnMouseEnter: false
      });

      document.getElementById("videos-container").appendChild(mediaElement);

      setTimeout(() => {
        mediaElement.media.play();

        this.capture();
      }, 5000);

      mediaElement.id = event.streamid;

      document.getElementById("start-live").click();

      recordAudio = RecordRTC(event.stream, {
        type: "audio",
        recorderType: StereoAudioRecorder,
        // bufferSize: 16384,
        onAudioProcessStarted: function() {
          recordVideo.startRecording();
        }
      });

      var videoOnlyStream = new MediaStream();
      videoOnlyStream.addTrack(event.stream.getVideoTracks()[0]);
      recordVideo = RecordRTC(videoOnlyStream, {
        type: "video"
        // recorderType: MediaStreamRecorder || WhammyRecorder
      });

      recordAudio.startRecording();

      function takePhoto(video) {
        var canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || video.clientWidth;
        canvas.height = video.videoHeight || video.clientHeight;

        var context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL("image/png");
      }

      var yourVideoElement = document.querySelector("video");

      this.capture = function() {
        this.snapshot_pic = takePhoto(yourVideoElement);

        $("#snapshot").val(this.snapshot_pic);

        setTimeout(() => {
          // console.log(this.snapshot_pic);

          $("#snapshot_id").click();
        }, 1000);
      };

      this.snapshot_capture = setInterval(() => {
        this.capture();
      }, 60 * 1000);
    };

    this.connection.onstreamended = function(event) {
      var mediaElement = document.getElementById(event.streamid);
      if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);

        /*if(event.userid === this.connection.sessionid && !this.connection.isInitiator) {
                  alert('Broadcast is ended. We will reload this page to clear the cache.');
                  location.reload();
                } */
      }
    };

    //capture();

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
  }

  snapShotFn() {
    this.snapshot_pic = $("#snapshot").val();

    this.requestService
      .postMethod("live-video/snapshot", {
        video_id: this.video_id,
        snapshot: this.snapshot_pic
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
          this.errorMessages = "Oops! Something Went Wrong";
        }
      );
  }

  // ......................................................
  // .......................UI Code........................
  // ......................................................
  openRoom() {
    let room_id = this.room;

    this.connection.open(room_id, () => {
      document.getElementById("defaultImage").style.display = "none";

      document.getElementById("open-room").style.display = "none";

      document.getElementById("stop-live").style.display = "block";

      $(".side-menubar").addClass("disable-links");

      $(".navbar-fixed-top").addClass("disable-links");

      if (this.is_kurento_running) {
        this.kurentoObj.start();

        // this.start();
      }
    });
  }

  stopLive() {
    if (confirm("Are you sure you would like to stop the live streaming?")) {
      this.navigateWindow = 1;

      localStorage.setItem("navigateWindow", this.navigateWindow);

      let details = { video_id: this.video_id };

      this.requestService.postMethod("close_streaming", details).subscribe(
        (data: any) => {
          if (data.success == true) {
            this.connection.attachStreams.forEach(function(stream) {
              stream.stop();
            });

            if (this.is_kurento_running) {
              // ws.close();

              // let kurentoObj = new kurentoObject(this.kurento_socket_url, this.wowza_ip_address);

              this.kurentoObj.stop();
            }

            $.toast({
              heading: "Success",
              text: "Your streaming has been ended successfully",
              // icon: 'error',
              position: "top-right",
              stack: false,
              textAlign: "left",
              loader: false,
              showHideTransition: "slide"
            });

            return this.router.navigate(["/broadcast"]);
          } else {
            this.errorMessages = data.error_messages;

            $.toast({
              heading: "Error",
              text: this.errorMessages,
              // icon: 'error',
              position: "top-right",
              stack: false,
              textAlign: "left",
              loader: false,
              showHideTransition: "slide"
            });
          }
        },

        (err: HttpErrorResponse) => {
          this.errorMessages = "Oops! Something Went Wrong";

          $.toast({
            heading: "Error",
            text: this.errorMessages,
            // icon: 'error',
            position: "top-right",
            stack: false,
            textAlign: "left",
            loader: false,
            showHideTransition: "slide"
          });
        }
      );
    } else {
      return false;
    }
  }

  ngOnInit() {
    /*$.getScript('../../../../assets/js/kurento/adapter.js',function(){});

        $.getScript('../../../../assets/js/kurento/index.js',function(){});

        $.getScript('../../../../assets/js/kurento/kurento-utils.js',function(){});

        $.getScript('../../../../assets/js/kurento.js',function(){}); */
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

          this.port_no = data.data.port_no > 0 ? data.data.port_no : "33124";

          this.isStreaming = data.data.is_streaming;

          this.initIoConnection();

          this.getViewers("get_viewers", { video_id: this.video_id });

          if (data.data.is_streaming > 0) {
            $(".side-menubar").addClass("disable-links");

            $(".navbar-fixed-top").addClass("disable-links");

            $.toast({
              heading: "Warning",
              text:
                "If you want to leave this page, Please stop your streaming and continue to Navigate",
              // icon: 'error',
              position: "top-right",
              stack: false,
              textAlign: "left",
              loader: false,
              showHideTransition: "slide"
            });

            this.openRoom();
          }
        } else {
          this.errorMessages = data.error_messages;

          $.toast({
            heading: "Error",
            text: this.errorMessages,
            // icon: 'error',
            position: "top-right",
            stack: false,
            textAlign: "left",
            loader: false,
            showHideTransition: "slide"
          });

          return this.router.navigate(["/broadcast"]);
        }
      },

      (err: HttpErrorResponse) => {
        this.errorMessages = "Oops! Something Went Wrong";

        $.toast({
          heading: "Error",
          text: this.errorMessages,
          // icon: 'error',
          position: "top-right",
          stack: false,
          textAlign: "left",
          loader: false,
          showHideTransition: "slide"
        });
      }
    );
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
      console.log("connected");
    });

    this.chatSocketService.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log("disconnected");
    });
  }

  public sendMessage(message: string) {
    if (!message) {
      return;
    }

    let details = {
      user_id: this.userID, //Viewer id

      live_video_viewer_id: 0, // Viewer id

      message: message,

      type: "uv", // viewer To streamer

      live_video_id: this.video_id,

      userpicture: this.userpicture,

      username: this.username
    };

    this.chatSocketService.send(details);

    this.chat_messages.push(details);

    this.messageContent = null;
  }

  liveStatus() {
    let details = { video_id: this.video_id };

    this.requestService.postMethod("streaming/status", details).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.isStreaming = 1;
        } else {
          this.errorMessages = data.error_messages;

          $.toast({
            heading: "Error",
            text: this.errorMessages,
            // icon: 'error',
            position: "top-right",
            stack: false,
            textAlign: "left",
            loader: false,
            showHideTransition: "slide"
          });
        }
      },

      (err: HttpErrorResponse) => {
        this.errorMessages = "Oops! Something Went Wrong";

        $.toast({
          heading: "Error",
          text: this.errorMessages,
          // icon: 'error',
          position: "top-right",
          stack: false,
          textAlign: "left",
          loader: false,
          showHideTransition: "slide"
        });
      }
    );
  }

  ngOnDestroy() {
    // this.stopLive();

    clearInterval(this.snapshot_capture);

    let details = { video_id: this.video_id };

    $(".side-menubar").removeClass("disable-links");

    $(".navbar-fixed-top").removeClass("disable-links");

    this.requestService.postMethod("close_streaming", details).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.connection.attachStreams.forEach(function(stream) {
            stream.stop();
          });

          if (this.is_kurento_running) {
            this.kurentoObj.stop();
          }

          $.toast({
            heading: "Success",
            text: "Your streaming has been ended successfully",
            // icon: 'error',
            position: "top-right",
            stack: false,
            textAlign: "left",
            loader: false,
            showHideTransition: "slide"
          });

          return this.router.navigate(["/broadcast"]);
        } else {
          this.errorMessages = data.error_messages;

          $.toast({
            heading: "Error",
            text: this.errorMessages,
            // icon: 'error',
            position: "top-right",
            stack: false,
            textAlign: "left",
            loader: false,
            showHideTransition: "slide"
          });
        }
      },

      (err: HttpErrorResponse) => {
        this.errorMessages = "Oops! Something Went Wrong";

        $.toast({
          heading: "Error",
          text: this.errorMessages,
          // icon: 'error',
          position: "top-right",
          stack: false,
          textAlign: "left",
          loader: false,
          showHideTransition: "slide"
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
        this.errorMessages = "Oops! Something Went Wrong";

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