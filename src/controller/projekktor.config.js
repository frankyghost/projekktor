/*
* this file is part of: 
* projekktor zwei
* http://www.projekktor.com
*
* Copyright 2010-2012, Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com
* under GNU General Public License
* http://www.filenew.org/projekktor/license/
*/
projekktorConfig.prototype = {
    /**************************************************************
        Config options to be customized prior initialization only:
    ***************************************************************/
        
    _playerName:                    'Projekktor',
        
    _playerHome:                    'http://www.projekktor.com?via=context',
    
    /* sets name of the cookie to store playerinformation in */
    _cookieName:                    'projekktor',
    
    /* days to keep cookie alive */
    _cookieExpiry:                  356,     
    
    /* Plugins to load on instance initialization, plugins are automatically extening the projekktorPluginInterface class.
    The order how the plugins are set here is important because they are added from z-index 0 to n one by one to the player DOM.
    As such it is usefull to add the "Display" plugin always first.
    */
    _plugins:                       ['display', 'controlbar', 'contextmenu'],
    
    /* Add one plugin or more plugins to the player. Alternative to "plugins" above. Will be merged with it. */
    _addplugins:                    [], 
    
    /* custom reel parser (data:JSObject), default function(data){return data;} */
    _reelParser:                    null,
    
    /* Prefix prepended to all css-Classnames and data-attributes used by the player in order to avoid conflicts with existing layouts and scripts */ 
    _ns:                            'pp',
    
    /* a priorised array of available platforms */
    _platforms:                     ['browser', 'android', 'ios', 'native', 'flash', 'vlc'],
    
    /* if set to true, projekktor assumes to live within an iframe and will act accordingly (used for embedding) */
    _iframe:                        false,
    
    /* if set to true projekktor will discard native media tag attributes (loop,controls,autoplay,preload etc.pp) */   
    _ignoreAttributes:              false,
        
    /* looping scheduled media elements -  will be overwritten by loop-attribute of a replaced <video> tag. */
    _loop:                          false,
    
    /* automatically start playback once page has loaded -  will be overwritten by autoplay-attribute of a replaced <video> tag. */
    _autoplay:                      false,
    
    /* if more than one item is scheduled, true will automatically start playback of the next item in line once current one completed */ 
    _continuous:                    true,
    
    /* "true" will stop all other player instances but the one the user clicked play on. */
    _thereCanBeOnlyOne:             true,
    
    /* on "true" try to leave fullscreen on player "complete" - does not seem to work properly in Firefox... yeah! */
    _leaveFullscreen:               true,
            
    /* An array of items to be played. Check http://www.projekktor.com/docs/playlists to learn more */
    _playlist:                      [],
    
    _theme:                         false,
    
    /*'http://www.projekktorxl.com/themegen/api/themes/live/format/jsonp/id/%{id}/version/%{ver}',*/ 
    _themeRepo:                     false, 
    
    /* all error messages waiting for your translation */
    _messages:  {
        /* flash & native: */
        0: '#0 An (unknown) error occurred.',
        1: '#1 You aborted the media playback. ',
        2: '#2 A network error caused the media download to fail part-way. ',
        3: '#3 The media playback was aborted due to a corruption problem. ',
        4: '#4 The media (%{title}) could not be loaded because the server or network failed.',
        5: '#5 Sorry, your browser does not support the media format of the requested file.',
        6: '#6 Your client is in lack of the Flash Plugin V%{flashver} or higher.',
        7: '#7 No media scheduled.',
        8: '#8 ! Invalid media model configured !',
        9: '#9 File (%{file}) not found.',
        10: '#10 Invalid or missing quality settings for %{title}.',
        11: '#11 Invalid streamType and/or streamServer settings for %{title}.',
        12: '#12 Invalid or inconsistent quality setup for %{title}.',
        80: '#80 The requested file does not exist or is delivered with an invalid content-type.',
        97: 'No media scheduled.',
        98: 'Invalid or malformed playlist data!',
        99: 'Click display to proceed. ',
        100: 'Keyboard Shortcuts',
            
        /* youtube errors: */
        500: 'This Youtube video has been removed or set to private',
        501: 'The Youtube user owning this video disabled embedding.',
        502: 'Invalid Youtube Video-Id specified.'
    },
    
    /* debug on / off */
    _debug:                         false,
    
    /* the width of the player - >0= overwrite destNodes width, 0= keep dest node width, false=maintain ratio */
    _width:                         null,
    
    /* guess what.... the hight of the player - >0= overwrite destNodes height, 0 = keep height , false=maintain ratio */
    _height:                        null,
    
    _ratio:                         false,
    
    /* An array of objects featuring keycode=>function sets for keyboard-controls-customizing */
    _keys: [],          
    
    /* cross domain */
    _isCrossDomain:                 false,
    
    /* foce full viewport if browser supports native media-element-fullscreen (e.g. iPad) */
    _forceFullViewport:             false,
    
    /**************************************************************
        Config options available per playlist item:
    ***************************************************************/
    
    /* unique itemID for the item currently played - dynamically generated if not provided via config */
    id:                             0,
    
    /* a title is a title is a title */ 
    title:                          null,
        
    cat:                            'clip',
        
    /* URL to poster image -  will be overwritten by poster-attribute of the replaced media tag. */
    poster:                         null,   
    
    /* enable/disable controls -  will be overwritten by controls-attribute of the replaced <video> tag. */
    controls:                       true,
    
    /* start offset in seconds for randomly seekable media. (EXPERIMENTAL) */
    start:                          false,
    
    /* stop endpoint in seconds for randomly seekable media. (EXPERIMENTAL) */
    stop:                           false,   
    
    /* initial volume on player-startup, 0=muted, 1=max */
    volume:                         0.5,
    
    /* a cover which will fill the display on audio-only playback */
    cover:                          '',     
            
    /* enable/disable the possibility to PAUSE the video once playback started. */
    disablePause:                   false,
    
    /* enable/disable the possibility to skip the video by hitting NEXT or using the SCRUBBER */
    disallowSkip:                   false,
    
    /* if set to TRUE users can not change the volume of the player - neither via API nor through controls */
    fixedVolume:                    false,
    
    /* scaling used for images (playlist items and posters) "fill", "aspectratio" or "none" */
    imageScaling:                   'aspectratio',
    
    /* scaling used for videos (flash and native, not youtube) "fill", "aspectratio" or "none" */
    videoScaling:                   'aspectratio',
        
    /* path to the MP4 Flash-player fallback component */
    playerFlashMP4:                 '',
        
    /* path to the MP3 Flash-player fallback component */
    playerFlashMP3:                 '',  
            
    /* defines the streamtype of the current item.
        'http':  http  streaming
        'rtmp':  RTMP streaming - requires "flashRTMPServer" to be set.
    */
    streamType:                     'http',
    
    /* it streamType is 'rtmp' you have to provide the serverURL here. */
    streamServer:   '',
        
    startParameter:                 'start',
        
    /* Youtube offers two different player APIs: fLaSh and "iFrame" for HTML5 . Make your choice here:
      For mobile devices this is forced to TRUE
    */
    useYTIframeAPI:                 true,
    
    /* enable/disable fetching of keyboard events - works in "fullscreen" only */
    enableKeyboard:                 true,  
    
    /* enable/disable the possibility to toggle to FULLSCREEN mode */
    enableFullscreen:               true,
    
    /*
    small: Player height is 240px, and player dimensions are at least 320px by 240px for 4:3 aspect ratio.
    medium: Player height is 360px, and player dimensions are 640px by 360px (for 16:9 aspect ratio) or 480px by 360px (for 4:3 aspect ratio).
    large: Player height is 480px, and player dimensions are 853px by 480px (for 16:9 aspect ratio) or 640px by 480px (for 4:3 aspect ratio).
    hd720: Player height is 720px, and player dimensions are 1280px by 720px (for 16:9 aspect ratio) or 960px by 720px (for 4:3 aspect ratio).
    hd1080: Player height is 1080px, and player dimensions are 1920px by 1080px (for 16:9 aspect ratio) or 1440px by 1080px (for 4:3 aspect ratio).
    highres: Player height is greater than 1080px, which means that the player's aspect ratio is greater than 1920px by 1080px.
    */
    playbackQuality:                'default',
    
    _playbackQualities:
    [
        {key: 'small',  minHeight: 240,  minWidth: 240}, 
        {key: 'medium',  minHeight: 360,  minWidth: [{ratio: 1.77, minWidth: 640}, {ratio: 1.33, minWidth: 480}]},
        {key: 'large',  minHeight: 480,  minWidth: [{ratio: 1.77, minWidth: 853}, {ratio: 1.33, minWidth: 640}]},
        {key: 'hd1080',  minHeight: 1080, minWidth: [{ratio: 1.77, minWidth: 1920}, {ratio: 1.33, minWidth: 1440}]},
        {key: 'hd720',  minHeight: 720,  minWidth: [{ratio: 1.77, minWidth: 1280}, {ratio: 1.33, minWidth: 960}]},
        {key: 'highres',  minHeight: 1081, minWidth: 0}  
    ],
    
    /* if testcard is disabled, the player will force a filedowload in case no native- or flashplayer
    is available. oterhwise (enableTestcard=true) a testcard with an errormessage is shown in case of issues */
    enableTestcard:                 true,
    
    /* if the scheduled playlist holds more than one item an "skipTestcard" is set to TRUE in case of an error
    the player will proceed to the next item without showing a testcard */
    skipTestcard:                   false,  
        
    /* sets the duration for media items without a duration (images & html pages) */
    duration:                       0,
    
    /* add this CSS classes on startup */
    className:                      ''
};