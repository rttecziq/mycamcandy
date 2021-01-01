/*
 *   Copyright (c) 2020 Akash Kumar Shukla
 *   All rights reserved.
 */
var kurentoObject = function (kurento_socket_url, wowza_ip_address, fileSavePath, isRecordingNeeded) {
    console.log('passed values are', 'isRecordingNeeded', isRecordingNeeded, 'fileSavePath', fileSavePath);

    const socketProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    var ws = new WebSocket(socketProtocol + kurento_socket_url + '/rtprelay');

    var videoInput;
    var videoOutput;
    var webRtcPeer;
    var state = null;
    var destinationIp;
    var destinationPort;
    var rtpSdp;

    console.log('Page loaded ...');
    videoInput = document.getElementById('videoInput');
    videoOutput = document.getElementById('videoOutput');
    rtpSdp = document.getElementById('rtpSdp');

    ws.onmessage = function(message) {
        var parsedMessage = JSON.parse(message.data);
        console.info('Received message: ' + message.data);

        switch (parsedMessage.id) {
        case 'startResponse':
            startResponse(parsedMessage);
            break;
        case 'error':
            console.log('Error message from server: ' + parsedMessage.message);
            break;
        case 'iceCandidate':
            webRtcPeer.addIceCandidate(parsedMessage.candidate)
            break;
        default:
        console.log('Unrecognized message', parsedMessage);
        }
    }

    this.start = function() {
        console.log('Starting video call ...')

        // showSpinner(videoInput);

        console.log('Creating WebRtcPeer and generating local sdp offer ...');

        var options = {
          localVideo: videoInput,
          onicecandidate : onIceCandidate
        }

        webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(error) {
            if(error) return onError(error);
            this.generateOffer(onOffer);
        });
        start();
    }

    function onIceCandidate(candidate) {
           console.log('Local candidate' + JSON.stringify(candidate));

           var message = {
              id : 'onIceCandidate',
              candidate : candidate
           };
           sendMessage(message);
    }

    function onOffer(error, offerSdp) {
        if(error) return onError(error);

        console.info('Invoking SDP offer callback function ' + location.host);
        var message = {
            id : 'start',
            sdpOffer : offerSdp,
            rtpSdp : rtpSdp.value
        }
        console.log("This is the offer sdp:");
        console.log(offerSdp);
        sendMessage(message);
    }

    function onError(error) {
        console.error(error);
    }

    function startResponse(message) {
        console.log('SDP answer received from server. Processing ...');
        webRtcPeer.processAnswer(message.sdpAnswer);
    }

    this.stop = function() {
        console.log('Stopping video call ...');
        if (webRtcPeer) {
            webRtcPeer.dispose();
            webRtcPeer = null;

            var message = {
                id : 'stop'
            }
            sendMessage(message);
        }

        ws.close();

        window.location.reload(true);
        // hideSpinner(videoInput, videoOutput);
    }

    function sendMessage(message) {
        var jsonMessage = JSON.stringify(message);
        console.log('Senging message: ' + jsonMessage);
        ws.send(jsonMessage);
    }


    function forceEvenRtpPort(rtpPort) {
        if ((rtpPort > 0) && (rtpPort % 2 != 0))
            return rtpPort - 1;
        else return rtpPort;
    }

    function updateRtpSdp() {
        var destination_ip;
        var destination_port;

        if (!destinationIp.value)
            destination_ip= wowza_ip_address;
        else
            destination_ip = destinationIp.value.trim();

        if (!destinationPort.value)
            destination_port="33124";
        else
            destination_port = forceEvenRtpPort(destinationPort.value.trim());


        destination_ip= wowza_ip_address;

            rtpSdp.value = 'v=0\n'
            + 'o=- 0 0 IN IP4 ' + destination_ip + '\n'
            + 's=Kurento\n'
            + 'c=IN IP4 ' + destination_ip + '\n'
            + 't=0 0\n'
            + 'm=video ' + destination_port + ' RTP/AVP 100\n'
            + 'a=rtpmap:100 H264/90000\n';

        console.log(rtpSdp.value);
    }

// starts here

    fileSavePath = fileSavePath;
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    var args = {
       // ws_uri:  protocol + kurentoIp + ':' + kurentoPort + '/kurento',
        ws_uri:  protocol + kurento_socket_url + '/kurento',// port forwarding managed internally.
        file_uri: fileSavePath
    };

    var localVideo,
        remoteVideo,
        webRtcPeer,
        client,
        pipeline;

    window.onload = function () {
        localVideo = document.getElementById('localVideo');
        remoteVideo = document.getElementById('remoteVideo');

    }

    function start() {
        webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv({
            localVideo: localVideo,
            remoteVideo: remoteVideo
        }, (error) => {
            if (error) return onError(error);
            webRtcPeer.generateOffer(onStartOffer);
        });
    }

    function stop() {
        if (webRtcPeer) {
            webRtcPeer.dispose();
            webRtcPeer = null;
        }

        if (pipeline) {
            pipeline.release();
            pipeline = null;
        }
    }

    function onStartOffer(error, sdpOffer) {
        if (error) return onError(error);

        co(function* () {
            try {
                if (!client)
                    client = yield kurentoClient(args.ws_uri);

                pipeline = yield client.create('MediaPipeline');
                var webRtc = yield pipeline.create('WebRtcEndpoint');
                setIceCandidateCallbacks(webRtcPeer, webRtc, onError);
                var recorder = yield pipeline.create('RecorderEndpoint', { uri: args.file_uri });
                yield webRtc.connect(recorder);
                yield webRtc.connect(webRtc);
                if(isRecordingNeeded == true){
                    yield recorder.record();        
                }
                var sdpAnswer = yield webRtc.processOffer(sdpOffer);
                webRtc.gatherCandidates(onError);
                webRtcPeer.processAnswer(sdpAnswer);

            } catch (e) {
                onError(e);
            }
        })();
    }

    function onError(error) {
        if (error) {
            console.error(error);
            stop();
        }
    }

    function setIceCandidateCallbacks(webRtcPeer, webRtcEp, onerror) {
        webRtcPeer.on('icecandidate', function (candidate) {
            candidate = kurentoClient.getComplexType('IceCandidate')(candidate);
            webRtcEp.addIceCandidate(candidate, onerror);
        });
        webRtcEp.on('OnIceCandidate', function (event) {
            var candidate = event.candidate;
            webRtcPeer.addIceCandidate(candidate, onerror);
        });
    }


}
