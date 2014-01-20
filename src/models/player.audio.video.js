/*
 * this file is part of: 
 * projekktor zwei
 * http://www.projekktor.com
 *
 * Copyright 2010, Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com
 * under GNU General Public License
 * http://www.filenew.org/projekktor/license/
*/
jQuery(function($) {
$p.newModel({
    
    modelId: 'VIDEO',
    androidVersion: "2",
    iosVersion: "3",
    nativeVersion: "1",
    iLove: [
        {ext:'mp4', type:'video/mp4', platform:['ios', 'android', 'native'], streamType: ['http', 'pseudo', 'httpVideo'], fixed: 'maybe'},
        {ext:'m4v', type:'video/mp4', platform:['ios', 'android', 'native'], streamType: ['http', 'pseudo', 'httpVideo'], fixed: 'maybe'},        
        {ext:'ogv', type:'video/ogg', platform:'native', streamType: ['http', 'httpVideo']},
        {ext:'webm',type:'video/webm', platform:'native', streamType: ['http', 'httpVideo']},
        {ext:'ogg', type:'video/ogg', platform:'native', streamType: ['http', 'httpVideo']},
        {ext:'anx', type:'video/ogg', platform:'native', streamType: ['http', 'httpVideo']}
    ],
    
    _eventMap: {
        pause:          "pauseListener",
        play:           "playingListener",
        volumechange:   "volumeListener",
        progress:       "progressListener",
        timeupdate:     "timeListener",
        ended:          "_ended",
        waiting:        "waitingListener",
        canplaythrough: "canplayListener",
        canplay:        "canplayListener",
        error:          "errorListener",
        suspend:        "suspendListener",
        seeked:         "seekedListener",
        loadedmetadata: "metaDataListener",
        loadstart:      null        
    },    
    
    isGingerbread: false,
    isAndroid: false, 
    allowRandomSeek: false,
    videoWidth: 0,
    videoHeight: 0,
    wasPersistent: true,
    isPseudoStream: false,
    
    init: function() {                 
        var ua = navigator.userAgent; // TODO: global platform and feature detection
        if( ua.indexOf("Android") >= 0 ) {
            this.isAndroid = true;
          if (parseFloat(ua.slice(ua.indexOf("Android")+8)) < 3) {
            this.isGingerbread = true;
          }
        }
        this.ready();
    },
        
    applyMedia: function(destContainer) { 
        
        if ($('#'+this.pp.getMediaId()+"_html").length === 0) {
            
            this.wasPersistent = false;
            
            destContainer.html('').append(
                $('<video/>')
                .attr({
                    "id": this.pp.getMediaId()+"_html",         
                    "poster": $p.utils.imageDummy(),
                    "loop": false,
                    "autoplay": false,
                    "preload": "none",
                    "x-webkit-airplay": "allow"
                }).prop({
                    controls: false,
                    volume: this.getVolume()
                }).css({
                    'width': '100%',
                    'height': '100%',
                    'position': 'absolute',
                    'top': 0,
                    'left': 0
                })
            );
        }

        this.mediaElement = $('#'+this.pp.getMediaId()+"_html");
        this.applySrc();
    },
        
    applySrc: function() {
        var ref = this,
            media = this.getSource(),
            wasAwakening = ref.getState('AWAKENING');
        
        /* 
         * Using 'src' attribute directly in <video> element is safer than using it inside <source> elements.
         * Some of the mobile browsers (e.g. Samsung Galaxy S2, S3 Android native browsers <= 4.2.2)
         * will not initialize video playback with <source> elements at all, displaying only gray screen instead.
         * HLS stream on iOS and Android will not work if its URL is defined through <source> 'src' attribute
         * instead of <video> 'src' attribute.
         */
        this.mediaElement.attr('src', media[0].src);
        
        /* Some Android Gingerbread devices will not play video when
         * the <video> 'type' attribute is set explicitly 
         */
        if (!this.isGingerbread) {
            this.mediaElement.attr('type', media[0].originalType );
        }
        
        /*
         * Some of the mobile browsers (e.g. Android native browsers <= 4.2.x, Opera Mobile) 
         * have by default play/pause actions bound directly to click/mousedown events of <video>.
         * That causes conflict with display plugin play/pause actions, which makes it impossible 
         * to pause the currently playing video. Precisely _setState is called twice: 
         * first by pauseListener triggered by <video> default click/mousedown action, 
         * secondly by display plugin actions bound to mousedown events. The result is that 
         * the video is paused by native <video> events and then immediately started by display 
         * plugin that uses the setPlayPause function. setPlayPause function toggles between 
         * "PAUSED" and "PLAYING" states, so when a video is being played, the function causes its pausing.
         */
        this.mediaElement.bind('mousedown.projekktorqs'+this.pp.getId(), this.disableDefaultVideoElementActions);
        this.mediaElement.bind('click.projekktorqs'+this.pp.getId(), this.disableDefaultVideoElementActions);
        
        var func = function(){
            
            ref.mediaElement.unbind('loadstart.projekktorqs'+ref.pp.getId());
            ref.mediaElement.unbind('loadeddata.projekktorqs'+ref.pp.getId());
            ref.mediaElement.unbind('canplay.projekktorqs'+ref.pp.getId());
            
            ref.addListeners('error');
            ref.addListeners('play');
            ref.addListeners('canplay');
            
            ref.mediaElement = $('#'+ref.pp.getMediaId()+"_html");            

            if (wasAwakening) {
                ref.displayReady();                
                return;
            }

            if (ref.getSeekState('SEEKING')) {
                if (ref._isPlaying){
                    ref.setPlay();
                }
                
                ref.seekedListener();
                return;
            }
       
            if (!ref.isPseudoStream) {
                ref.setSeek(ref.media.position || 0);
            }

            if (ref._isPlaying){
                ref.setPlay();
            }
            
        };

        this.mediaElement.bind('loadstart.projekktorqs'+this.pp.getId(), func);
        this.mediaElement.bind('loadeddata.projekktorqs'+this.pp.getId(), func);
        this.mediaElement.bind('canplay.projekktorqs'+this.pp.getId(), func);
        
        this.mediaElement[0].load(); // important especially for iOS devices
        
        // F*CK!!!!
        if (this.isGingerbread)
        {
            func();
        }
        
    },
    
    detachMedia: function() {
        try {
            this.removeListener('error');
            this.removeListener('play');
            this.removeListener('canplay');
            this.mediaElement.unbind('mousedown.projekktorqs'+this.pp.getId()); 
            this.mediaElement.unbind('click.projekktorqs'+this.pp.getId());
            this.mediaElement[0].pause();
            this.mediaElement.attr('src','');
            this.mediaElement[0].load();
        } catch(e){}
    },
   
    /*****************************************
     * Handle Events
     ****************************************/ 
    addListeners: function(evtId, subId) {
        if (this.mediaElement==null) return;
        var id = (subId!=null) ? '.projekktor'+subId+this.pp.getId() : '.projekktor'+this.pp.getId(),
            ref = this,
            evt = (evtId==null) ? '*' : evtId;

        $.each(this._eventMap, function(key, value){
            if ((key==evt || evt=='*') && value!=null) {
                ref.mediaElement.bind(key + id, function(evt) { ref[value](this, evt); });
            }
        });       
    },

    removeListener: function(evt, subId) {        
        if (this.mediaElement==null) return;
        
        var id = (subId!=null) ? '.projekktor'+subId+this.pp.getId() : '.projekktor'+this.pp.getId(),
            ref = this;

        $.each(this._eventMap, function(key, value){
            if (key==evt) {
                ref.mediaElement.unbind(key + id);
            }
        });              
    },
    
    _ended: function() {
        var dur = this.mediaElement[0].duration, // strange android behavior workaround
            complete = (Math.round(this.media.position) === Math.round(dur)),
            fixedEnd = ( (dur-this.media.maxpos) < 2 ) && (this.media.position===0) || false;
            
        if (complete || fixedEnd || this.isPseudoStream) {                   
            this.endedListener(this);
        } else {
            this.pauseListener(this);
        }
    },
    
    playingListener: function(obj) {
        var ref = this;
        if (!this.isGingerbread) {
            (function() {
                try{
                    if (ref.getDuration()===0) {
                        if(ref.mediaElement.get(0).currentSrc!=='' && ref.mediaElement.get(0).networkState==ref.mediaElement.get(0).NETWORK_NO_SOURCE) {
                            ref.sendUpdate('error', 80);
                            return;
                        }
                        setTimeout(arguments.callee, 500);
                        return;
                    }
                } catch(e) {}
            })();
        }
        this._setState('playing'); 
    },

    errorListener: function(obj, evt) {
        try {
            switch (evt.target.error.code) {
                case evt.target.error.MEDIA_ERR_ABORTED:
                    this.sendUpdate('error', 1);
                    break;
                case evt.target.error.MEDIA_ERR_NETWORK:
                    this.sendUpdate('error', 2);        
                    break;
                case evt.target.error.MEDIA_ERR_DECODE:
                    this.sendUpdate('error', 3);        
                    break;
                case evt.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    this.sendUpdate('error', 4);        
                    break;
                default:
                    this.sendUpdate('error', 5);        
                    break;
            }
        } catch(e) {}
    },
    
    canplayListener: function(obj) {
        var ref = this;
        // pseudo streaming
        if (this.pp.getConfig('streamType')=='pseudo') {            
            $.each(this.media.file, function() {
                if (this.src.indexOf(ref.mediaElement[0].currentSrc)>-1) {
                    if (this.type=='video/mp4') {
                        ref.isPseudoStream = true;
                        ref.allowRandomSeek = true;
                        ref.media.loadProgress = 100;
                        return false;
                    }
                }
                return true;
            });
        }        
        this._setBufferState('full');
    },
    
     disableDefaultVideoElementActions: function(evt){
            evt.preventDefault();
            evt.stopPropagation();
    }, 
    
    /*****************************************
     * Setters
     ****************************************/     
    setPlay: function() {
        try{this.mediaElement[0].play();} catch(e){}
    },
    
    setPause: function() {
        try {this.mediaElement[0].pause();} catch(e){}
    },   
            
    setVolume: function(volume) {
        this._volume = volume;
            try {
            this.mediaElement.prop('volume', volume);
        } catch(e){
            return false;
        }
        return volume;
    }, 
     
    setSeek: function(newpos) {
        var ref = this;
        
        if (this.isPseudoStream) {
            this.media.position = 0;
            this.media.offset = newpos;
            this.applySrc();
            return;
        }

        // IE9 somtimes raises INDEX_SIZE_ERR
        (function() {
            try {
                ref.mediaElement[0].currentTime = newpos;
                ref.timeListener({position: newpos});
            } catch(e){
                if (ref.mediaElement!=null) {
                    setTimeout(arguments.callee,100);    
                }
            }
        
        })();
    },           

    setFullscreen: function(inFullscreen) {
        if (this.element=='audio') return;
        this._scaleVideo();
    }, 

    setResize: function() {
        if (this.element=='audio') return;
        this._scaleVideo(false);
    }
    
});

$p.newModel({
    
    modelId: 'AUDIO',
    
    iLove: [
        {ext:'ogg', type:'audio/ogg', platform:'native', streamType: ['http', 'httpAudio']},
        {ext:'oga', type:'audio/ogg', platform:'native', streamType: ['http', 'httpAudio']},
        {ext:'mp3', type:'audio/mp3', platform:['ios', 'android', 'native'], streamType: ['http', 'httpAudio']},
        {ext:'mp3', type:'audio/mpeg', platform:['ios', 'android', 'native'], streamType: ['http', 'httpAudio']}        
    ],
    
    imageElement: {},
    
    applyMedia: function(destContainer) {   

        $p.utils.blockSelection(destContainer);
    
        // create cover image
        this.imageElement = this.applyImage(this.getPoster('cover') || this.getPoster('poster'), destContainer);
        this.imageElement.css({border: '0px'});
        
        if ($('#'+this.pp.getMediaId()+"_html").length===0) {
            this.wasPersistent = false;
            destContainer.html('').append(
                $((this.isGingerbread) ? '<video/>' : '<audio/>')
                .attr({
                    "id": this.pp.getMediaId()+"_html",         
                    "poster": $p.utils.imageDummy(),
                    "loop": false,
                    "autoplay": false,
                    "preload": "none",
                    "x-webkit-airplay": "allow"
                }).prop({
                    controls: false,
                    volume: this.getVolume()
                }).css({
                    'width': '1px',
                    'height': '1px',
                    'position': 'absolute',
                    'top': 0,
                    'left': 0
                })
            );
        }

        this.mediaElement = $('#'+this.pp.getMediaId()+"_html");
        this.applySrc();        
    },    
    
    setPosterLive: function() {
        if (this.imageElement.parent) {
            var dest = this.imageElement.parent(),
            ref = this;

            if (this.imageElement.attr('src') == this.getPoster('cover') || this.getPoster('poster'))
                return;
            
            this.imageElement.fadeOut('fast', function() {
                $(this).remove();
                ref.imageElement = ref.applyImage(ref.getPoster('cover') || ref.getPoster('poster'), dest );
            });
        }
    }
    
}, 'VIDEO');

});