import { Component, ElementRef, OnDestroy } from "@angular/core";

import { RequestService } from "../../../common/services/request.service";
import { ActivatedRoute, UrlHandlingStrategy, Router } from "@angular/router";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";

import { JoinVideo } from "../../../models/join-video";

import { Chat } from "../../../common/services/model/chat";
import { Event } from "../../../common/services/model/event";
import { ChatSocketService } from "../../../common/services/chat-socket.service";

declare var $: any;

declare var RTCMultiConnection: any;

declare var getHTMLMediaElement: any;

declare function getBrowser(): any;

declare var jwplayer: any;

@Component({
    templateUrl: "join-video.component.html",
    styleUrls: [
        "../../../../assets/css/bootstrap/css/bootstrap.css",
        "../../../../assets/css/font-awesome/css/font-awesome.min.css",
        "../../../../assets/css/jquery-ui.css",
        "../../../../assets/css/style.css",
        "../../../../assets/css/responsive.css"
    ]
})
export class AndroidJoinComponent implements OnDestroy {
    video_id: string;

    errorMessages: string;

    video_details: JoinVideo;

    ioConnection: any;

    room: string;

    connection = new RTCMultiConnection();

    video_attribute: boolean;

    browser: any;

    site_settings: any[];

    viewer_cnt: number;

    userId: string;

    constructor(
        private requestService: RequestService,
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient
    ) {
        this.errorMessages = "";

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

        this.requestService
            .getMethod("site/settings", "")
            .subscribe((data: any) => {
                this.site_settings = data.settings;
            });

        setTimeout(() => {
            console.log("timeout fn");

            let socket_url = this.site_settings.filter(obj => {
                return obj.key === "SOCKET_URL";
            });

            let jwplayer_key = this.site_settings.filter(obj => {
                return obj.key === "jwplayer_key";
            });

            jwplayer.key = jwplayer_key.length > 0 ? jwplayer_key[0].value : "";

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
                    video.setAttributeNode(
                        document.createAttribute("autoplay")
                    );
                    video.setAttributeNode(
                        document.createAttribute("playsinline")
                    );
                } catch (e) {
                    video.setAttribute("autoplay", this.video_attribute);
                    video.setAttribute("playsinline", this.video_attribute);
                }

                if (event.type === "local") {
                    video.volume = 0;
                    try {
                        video.setAttributeNode(
                            document.createAttribute("muted")
                        );
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

                document
                    .getElementById("videos-container")
                    .appendChild(mediaElement);

                setTimeout(function() {
                    mediaElement.media.play();
                }, 5000);

                mediaElement.id = event.streamid;
            };

            var ended = 0;

            this.connection.onstreamended = function(event) {
                console.log("Streaming Endeddd. " + ended);

                if (ended) {
                    console.log("Streaming Ende.");

                    // document.location.reload(true);
                }

                var mediaElement = document.getElementById(event.streamid);

                if (mediaElement) {
                    console.log("Streaming Ended inside.");

                    mediaElement.parentNode.removeChild(mediaElement);

                    ended = 1;

                    /* if(event.userid === this.connection.sessionid && !this.connection.isInitiator) {
                    alert('Broadcast is ended. We will reload this page to clear the cache.');
                    location.reload();
                    } */

                    setTimeout(() => {
                        console.log("Streaming Ended timeout.");

                        // this.router.reload();
                        window.location.reload(true);

                        $("#join-room").click();
                    }, 1000);
                }
            };

            this.route.queryParams.subscribe(params => {
                this.video_id = params["video_id"];

                this.userId = params["user_id"];

                this.browser = getBrowser();

                let details = {
                    video_id: this.video_id,
                    browser: this.browser
                };

                this.singleVideoDetail("single_video", details);
            });
        }, 3000);
    }

    ngOnDestroy(): any {}

    singleVideoDetail(url, object) {
        let formData = new FormData();

        // By Default added device type and login type in future use
        formData.append("id", this.userId);
        formData.append("token", "");

        // append your data
        for (var key in object) {
            formData.append(key, object[key]);
        }

        // By Default added device type and login type in future use
        // formData.append('login_by', );
        formData.append("device_type", "android");

        this.http.post(this.requestService.apiUrl + url, formData).subscribe(
            (data: any) => {
                if (data.success == true) {
                    this.video_details = data.data;

                    this.room = data.data.unique_id;

                    this.viewer_cnt = data.data.viewer_cnt;

                    if (data.data.video_url) {
                        var playerInstance = jwplayer("videos-container");

                        console.log(data.data.video_url);

                        console.log(jwplayer.key);

                        playerInstance.setup({
                            file: data.data.video_url,
                            // file:"https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
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
                    } else {
                        console.log("Jinroom");

                        this.joinRoom();
                    }
                } else {
                    // The video is PPV

                    alert(data.error_messages);

                    return false;
                }
            },

            (err: HttpErrorResponse) => {
                this.errorMessages = "Oops! Something Went Wrong";

                alert(this.errorMessages);

                return false;
            }
        );
    }

    joinRoom() {
        console.log("Join Room");

        let room_id = this.room;

        setTimeout(() => {
            this.connection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            };

            this.connection.join(room_id);

            document.getElementById("defaultImage").style.display = "none";
        }, 2000);
    }

    /*private initIoConnection() {
        this.chatSocketService.initSocket(this.room);
    
        this.ioConnection = this.chatSocketService.getViewersCnt()
          .subscribe((data : any) => {
            this.viewer_cnt = data;
        });
    
        this.chatSocketService.onEvent(Event.CONNECT)
          .subscribe(() => {
            console.log('connected');
          });
          
        this.chatSocketService.onEvent(Event.DISCONNECT)
          .subscribe(() => {
            console.log('disconnected');
          });
    } */
}
