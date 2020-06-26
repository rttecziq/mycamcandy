function getBrowser() {

    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

    // Internet Explorer 6-11
    var isIE = false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    var b_n = '';

    switch(true) {

        case isFirefox :

                b_n = "Firefox";

                break;
        case isChrome :

                b_n = "Chrome";

                break;

        case isSafari :

                b_n = "Safari";

                break;
        case isOpera :

                b_n = "Opera";

                break;

        case isIE :

                b_n = "IE";

                break;

        case isEdge : 

                b_n = "Edge";

                break;

        case isBlink : 

                b_n = "Blink";

                break;

        default :

                b_n = "Unknown";

                break;

    }

    return b_n; 
}

var mobile_type = "";

function getMobileOperatingSystem() {

    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
    {
      mobile_type =  'ios';

    }
    else if( userAgent.match( /Android/i ) )
    {

      mobile_type =  'andriod';
    }
    else
    {
      mobile_type =  'unknown'; 
    }

    return mobile_type;
  
}
