import {
    Component,
    ElementRef,
    ViewChild,
    OnDestroy,
    OnInit
} from '@angular/core';

import { RequestService } from '../../../common/services/request.service';
import { ActivatedRoute, UrlHandlingStrategy, Router } from '@angular/router';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

import { JoinVideo } from '../../../models/join-video';

declare var $: any;

declare var RTCMultiConnection: any;

declare var DetectRTC: any;

declare var getHTMLMediaElement: any;

declare function getBrowser(): any;

declare function getMobileOperatingSystem(): any;

declare var kurentoObject: any;

@Component({
    templateUrl: 'streamer-video.component.html',
    styleUrls: [
        '../../../../assets/css/bootstrap/css/bootstrap.css',
        '../../../../assets/css/font-awesome/css/font-awesome.min.css',
        '../../../../assets/css/jquery-ui.css',
        '../../../../assets/css/style.css',
        '../../../../assets/css/responsive.css'
    ]
})
export class AndroidStreamerComponent implements OnInit, OnDestroy {
    video_id: string;

    errorMessages: string;

    video_details: JoinVideo;

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

    userId: string;

    room: string;

    cameras: any[];

    currentDeviceId: string;

    snapshot_pic: any;

    snapshot_capture: any;

    constructor(
        private requestService: RequestService,
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient
    ) {
        this.errorMessages = '';

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

        this.video_attribute = true;

        this.defaultImage = true;

        this.stop_live = false;

        // Get Browser
        this.browser = getBrowser();

        this.mobile_browser = getMobileOperatingSystem();

        this.requestService
            .getMethod('site/settings', '')
            .subscribe((data: any) => {
                this.site_settings = data.settings;
            });

        setTimeout(() => {
            console.log('timeout fn');

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
                kurento_socket_url.length > 0
                    ? kurento_socket_url[0].value
                    : '';

            this.route.queryParams.subscribe(params => {
                this.video_id = params['video_id'];

                this.userId = params['user_id'];

                const details = {
                    video_id: this.video_id,
                    browser: this.browser
                };

                this.singleVideoDetail('single_video', details);
            });

            /***************************Kurento Code****************************/

            this.is_kurento_running = false;

            setTimeout(() => {
                if (this.browser == 'Safari' || this.mobile_browser == 'ios') {
                    console.log('kurento not supported..!');
                } else {
                    if (this.wowza_ip_address && this.kurento_socket_url) {
                        this.is_kurento_running = true;

                        // let kurentoObj = new kurentoObject(this.kurento_socket_url,this.wowza_ip_address);
                    } else {
                        console.log(
                            'Wowza / Kurento Not configured...! so IOS Mobile Device wil not work..!'
                        );
                    }
                }
            }, 1000);

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
                oneway: true
            };

            this.connection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            };

            this.connection.videosContainer = document.getElementById(
                'videos-container'
            );

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
                    video.setAttributeNode(
                        document.createAttribute('autoplay')
                    );
                    video.setAttributeNode(
                        document.createAttribute('playsinline')
                    );
                } catch (e) {
                    video.setAttribute('autoplay', this.video_attribute);
                    video.setAttribute('playsinline', this.video_attribute);
                }

                if (event.type === 'local') {
                    video.volume = 0;
                    try {
                        video.setAttributeNode(
                            document.createAttribute('muted')
                        );
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

                document
                    .getElementById('videos-container')
                    .appendChild(mediaElement);

                setTimeout(function() {
                    this.connection.sdpConstraints.mandatory = {
                        OfferToReceiveAudio: true,
                        OfferToReceiveVideo: true
                    };
                    mediaElement.media.play();
                }, 5000);

                mediaElement.id = event.streamid;

                // document.getElementById('start-live').click();

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

            setTimeout(() => {
                this.switch_cameras();
            }, 2 * 1000);
        }, 3000);
    }

    ngOnDestroy() {}

    ngOnInit() {}

    singleVideoDetail(url, object) {
        const formData = new FormData();

        // By Default added device type and login type in future use
        formData.append('id', this.userId);
        formData.append('token', '');

        // append your data
        for (const key in object) {
            formData.append(key, object[key]);
        }

        // By Default added device type and login type in future use
        // formData.append('login_by', );
        formData.append('device_type', 'android');

        this.http.post(this.requestService.apiUrl + url, formData).subscribe(
            (data: any) => {
                if (data.success == true) {
                    this.video_details = data.data;

                    this.room = data.data.unique_id;

                    this.port_no =
                        data.data.port_no > 0 ? data.data.port_no : '33124';

                    setTimeout(() => {
                        //this.openRoom();
                    }, 1000);
                } else {
                    this.errorMessages = data.error_messages;

                    alert(data.error_messages);

                    return false;
                }
            },

            (err: HttpErrorResponse) => {
                this.errorMessages = 'Oops! Something Went Wrong';

                alert(this.errorMessages);

                return false;
            }
        );
    }

    snapShotFn() {
        this.snapshot_pic = $('#snapshot').val();

        const formData = new FormData();

        // By Default added device type and login type in future use
        formData.append('id', this.userId);
        formData.append('token', '');

        formData.append('snapshot', this.snapshot_pic);

        formData.append('video_id', this.video_id);

        // By Default added device type and login type in future use
        // formData.append('login_by', );
        formData.append('device_type', 'android');

        this.http
            .post(this.requestService.apiUrl + 'live-video/snapshot', formData)
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

    openRoom(deviceId) {
        // alert(deviceId);

        const room_id = this.room;

        this.connection.attachStreams.forEach(function(stream) {
            stream.stop();
        });

        setTimeout(() => {
            this.connection.mediaConstraints = {
                audio: true,
                video: { deviceId: deviceId }
            };

            this.connection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            };

            this.connection.open(room_id, () => {
                document.getElementById('defaultImage').style.display = 'none';

                /*if(this.is_kurento_running) {

                    let kurentoObj = new kurentoObject(this.kurento_socket_url, this.wowza_ip_address);

                    kurentoObj.start();

                } */
            });
        }, 1000);
    }

    checkAndOpenRoom() {
        let deviceId = '';

        this.cameras.forEach(camera => {
            if (this.currentDeviceId == camera.deviceId) {
            } else {
                deviceId = camera.deviceId;
            }
        });

        this.currentDeviceId = deviceId;

        console.log(deviceId);

        this.openRoom(this.currentDeviceId);
    }

    switch_cameras() {
        /*********************Switch camera*************/

        const cameras = [];
        DetectRTC.load(() => {
            DetectRTC.videoInputDevices.forEach(function(camera) {
                cameras.push({
                    deviceId: camera.deviceId,
                    label: camera.label
                });
            });
        });

        setTimeout(() => {
            this.cameras = cameras;

            this.currentDeviceId = this.cameras[0].deviceId;

            this.openRoom(this.cameras[0].deviceId);
        }, 1000);

        /**********************Switch camera***************/
    }
}
