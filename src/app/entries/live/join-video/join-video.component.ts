import { Component, ElementRef, OnDestroy } from "@angular/core";

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

declare var jwplayer: any;

declare var ActiveXObject;

@Component({
  templateUrl: "join-video.component.html",
  styleUrls: [
    "../../../../assets/css/bootstrap/css/bootstrap.css",
    "../../../../assets/css/font-awesome/css/font-awesome.min.css",
    "../../../../assets/css/style.css",
    "../../../../assets/css/responsive.css"
  ]
})
export class JoinVideoComponent implements OnDestroy {
  public elementRef;

  public player: any;

  private socket;

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

  private currentTimeout: any;

  browser: any;

  site_settings: any[];

  viewer_cnt: number;

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

    this.suggestions = [];

    this.chat_messages = [];

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

    if (this.requestService.userId) {
      this.user_profile_fn("userDetails", "");
    }

    this.site_settings = JSON.parse(localStorage.getItem("site_settings"));

    let jwplayer_key = this.site_settings.filter(obj => {
      return obj.key === "jwplayer_key";
    });

    jwplayer.key = jwplayer_key.length > 0 ? jwplayer_key[0].value : "";

    this.route.queryParams.subscribe(params => {
      this.video_id = params["video_id"];

      this.liveVideoID = params["video_id"];

      this.browser = getBrowser();

      let details = { video_id: this.video_id, browser: this.browser };

      this.singleVideoDetail("single_video", details);

      let public_video_details = {
        video_id: this.video_id,
        type: "public",
        skip: 0
      };

      this.loadPublicVideos("popular_videos", public_video_details);
    });

    let suggestion_details = { skip: 0 };

    this.suggestionsList("suggestions", suggestion_details);

    this.site_settings = JSON.parse(localStorage.getItem("site_settings"));

    this.webrtc();
  }

  webrtc() {
    let socket_url = this.site_settings.filter(obj => {
      return obj.key === "SOCKET_URL";
    });

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

      setTimeout(function() {
        mediaElement.media.play();
      }, 5000);

      mediaElement.id = event.streamid;
    };

    this.connection.onstreamended = function(event) {
      var mediaElement = document.getElementById(event.streamid);
      if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);

        /* this.connection.attachStreams.forEach(function(stream) {
                    stream.stop();
                }); */

        setTimeout(() => {
          /* $("#web-rtc").click();

                   setTimeout(() => {


                    $("#join-room").click();

                   }, 2000); */

          location.reload(true);
          // $("#join-room").click();
        }, 1000);

        /*if(event.userid === this.connection.sessionid && !this.connection.isInitiator) {
                  alert('Broadcast is ended. We will reload this page to clear the cache.');
                  location.reload();
                } */
      }
    };
  }
  ngOnDestroy(): any {}

  user_profile_fn(url, object) {
    this.requestService.getMethod(url, object).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.userpicture = data.chat_picture;

          this.username = data.name;
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

  singleVideoDetail(url, object) {
    this.requestService.postMethod(url, object).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.video_details = data.data;

          this.chat_messages = data.data.comments;

          this.viewer_cnt = data.data.viewer_cnt;

          this.liveVideoViewerID = this.userID = data.data.id; // Logged in user id

          this.room = data.data.unique_id;

          this.initIoConnection();

          console.log(data.data.video_url);

          if (data.data.video_url) {
            var playerInstance = jwplayer("videos-container");

            console.log(data.data.video_url);
            console.log(jwplayer.key);

            playerInstance.setup({
              file: data.data.video_url,
              // file: "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",

              image: data.data.snapshot,
              width: "100%",
              aspectratio: "16:9",
              // primary: "flash",
              controls: true,
              "controlbar.idlehide": false,
              controlBarMode: "floating",
              autostart: false,
              hlshtml: true,
              type: "hls",
              androidhls: true
            });

            playerInstance.on("setupError", function(e) {

              console.log("setupError", e);

              $("#videos-container").hide();

              var hasFlash = false;
              try {
                var fo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                if (fo) {
                  hasFlash = true;
                }
              } catch (e) {
                if (
                  navigator.mimeTypes &&
                  navigator.mimeTypes["application/x-shockwave-flash"] !=
                    undefined &&
                  navigator.mimeTypes["application/x-shockwave-flash"]
                    .enabledPlugin
                ) {
                  hasFlash = true;
                }
              }

              if (hasFlash == false) {
                console.log("eerr");

                $("#flash_error_display").show();

                $("#main_video_setup_error").show();

                return false;
              }

              $("#main_video_setup_error").show();
            });
          } else {
            console.log("Jinroom");

            this.joinRoom();
          }

          if (this.requestService.userId) {
            this.getViewers("get_viewers", { video_id: this.video_id });
          } else {
            $("#chat-input").attr("disabled", true);
          }
        } else {
          // The video is PPV

          if (data.error_code == 156) {
            return this.router.navigate(["/video/invoice"], {
              queryParams: { video_id: this.liveVideoID }
            });
          }

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

          return this.router.navigate(["/"]);
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

  joinRoom() {
    let room_id = this.room;

    console.log("Join Room");

    this.currentTimeout = setTimeout(() => {
      this.connection.sdpConstraints.mandatory = {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true
      };
      this.connection.join(room_id);

      document.getElementById("defaultImage").style.display = "none";
    }, 3000);
  }

  // Load Public videos

  loadPublicVideos(url, object) {
    this.requestService.postMethod(url, object).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.public_videos = data.data;
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

  // User suggestions list

  suggestionsList(url, object) {
    this.requestService.postMethod(url, object).subscribe(
      (data: any) => {
        if (data.success == true) {
          this.suggestions = data.data;
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
                    });*/
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

  // To add follower

  followUser(user_id) {
    let details = { follower_id: user_id };

    this.requestService.postMethod("add_follower", details).subscribe(
      (data: any) => {
        if (data.success == true) {
          let details = { skip: 0 };

          this.suggestionsList("suggestions", details);

          $.toast({
            heading: "Success",
            text:
              "You have now started following the User, you will be notified when the User goes live",
            // icon: 'error',
            position: "top-right",
            stack: false,
            textAlign: "left",
            loader: false,
            showHideTransition: "slide"
          });
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
      user_id: 0,

      live_video_viewer_id: this.liveVideoViewerID, // Viewer id

      message: message,

      type: "vu", // viewer To streamer

      live_video_id: this.video_id,

      userpicture: this.userpicture,

      username: this.username
    };

    this.chatSocketService.send(details);

    this.chat_messages.push(details);

    this.messageContent = null;
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

        /* $.toast({
                        heading: 'Error',
                        text: this.errorMessages,
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });*/
      }
    );
  }
}
