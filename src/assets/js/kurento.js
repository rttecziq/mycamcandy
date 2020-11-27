var kurentoObject = function (kurento_socket_url, wowza_ip_address) {
   

    var ws = new WebSocket('ws://'+kurento_socket_url+'/rtprelay');

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



}