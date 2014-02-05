/*
 * this file is part of:
 * projekktor zwei
 * http://www.projekktor.com
 *
 * Copyright 2010, 2011, Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com
 * under GNU General Public License
 * http://www.filenew.org/projekktor/license/
 */
jQuery(function($) {
$p.newModel({

    modelId: 'OSMFVIDEO',
    replace: 'VIDEOFLASH',
   
    flashVersion: "10.2",
    flashVerifyMethod: 'addEventListener',
    
    iLove: [
        {ext:'flv', type:'video/flv', platform:'flash', fixed: true, streamType: ['*']},
        {ext:'mp4', type:'video/mp4', platform:'flash', streamType: ['*']},
        {ext:'f4v', type:'video/mp4', platform:'flash', streamType: ['*']},
        {ext:'mov', type:'video/quicktime', platform:'flash', streamType: ['*']},
        {ext:'m4v', type:'video/mp4', platform:'flash', fixed: true, streamType: ['*']},
        {ext:'f4m', type:'application/f4m+xml', platform:'flash', fixed: true, streamType: ['*']},
        {ext:'m3u8', type:'application/mpegURL', platform:'flash', fixed: true, streamType: ['*']},
        {ext:'m3u8', type:'application/x-mpegURL', platform:'flash', fixed: true, streamType: ['*']},
        {ext:'m3u8', type:'application/vnd.apple.mpegurl', platform:'flash', fixed: true, streamType: ['*']},
        {ext:'manifest', type:'application/vnd.ms-ss', platform:'flash', fixed: true, streamType: ['*']}
    ],

    hasGUI: false,    
    allowRandomSeek: false,
    isPseudoStream: false,
    streamType: 'http',
    
    availableQualities: {},
    
    _hardwareAcceleration: true,
    _isStream: false,
    _isDVR: false,
    _isMuted: false,
    _isStarted: false,
    _qualitySwitching: false,
    _isDynamicStream: false,
    _volume: 0,

    _eventMap: {
        //  mediaPlayerStateChange: "OSMF_playerStateChange", obsolete
        mediaPlayerCapabilityChange: "OSMF_PlayerCapabilityChange",
        durationChange: "OSMF_durationChange",
        currentTimeChange: "OSMF_currentTimeChange",
        loadStateChange: "OSMF_loadStateChange",
        bufferingChange: "OSMF_bufferingChange",
        bytesLoadedChange: "OSMF_bytesLoadedChange",
        playStateChange: "OSMF_playerStateChange",
        seekingChange: "OSMF_seekingChange",
        canPlayChange: "OSMF_seekingChange",
        isRecordingChange: "OSMF_isRecordingChange",
        complete: "endedListener",
        volumeChange: "volumeListener",
        mediaError: "errorListener",
        MBRItemChange: "OSMF_universal",
        isDynamicStreamChange: "OSMF_updateDynamicStream",
        autoSwitchChange: "OSMF_updateDynamicStream",
        switchingChange: "OSMF_updateDynamicStream",
        canSeekChange: "OSMF_canSeekChange"
    },    
    
    applyMedia: function(destContainer) {
        var ref = this; 
        
        window['projekktorOSMFReady'+this.pp.getId()] = function() {
            projekktor(ref.pp.getId()).playerModel._OSMFListener(arguments);
        };     

        var domOptions = {
            id: this.pp.getMediaId()+"_flash",
            name: this.pp.getMediaId()+"_flash",
            src: this.pp.getConfig('playerFlashMP4'),
            width: '100%',
            height: '100%',
            allowScriptAccess: "always",
            quality: "high",
            menu: false,
            allowFullScreen: 'true',
            wmode: ($p.utils.ieVersion()) ? 'transparent' : 'opaque', // must be either transparent (ie) or opaque in order to allow HTML overlays
            SeamlessTabbing: 'false',
            bgcolor: '#000000',
            FlashVars: $.extend({
                // streamType: this.pp.getConfig('streamType', ''), // "dvr", //  "live" "recorded", "dvr"
                enableStageVideo: this._hardwareAcceleration,
                disableHardwareAcceleration: !this._hardwareAcceleration,
                javascriptCallbackFunction: 'window.projekktorOSMFReady'+this.pp.getId()               
            }, this.pp.getConfig('OSMFVars'))
            };

        this.createFlash(domOptions, destContainer);
    },
    
    flashReadyListener: function() {        
        this.applySrc();
        this.displayReady();         
    },    

    // 
    removeListeners: function() {},
    
    loadProgressUpdate: function () {},
    
    // disable default addListener method
    addListeners: function() {},
        
    applySrc: function() {
        var ref = this,
            sources = this.getSource();

        this.mediaElement.get(0).setMediaResourceURL(sources[0].src);
        
        this.streamType = sources[0].streamType || this.pp.getConfig('streamType') || 'http';
        if (this.getState('PLAYING')) {
            this.setPlay();
            if (ref.isPseudoStream!==true && this.media.position>0) {
                this.setSeek(this.media.position);
            }
        }
        
        if(this.streamType=='pseudo') {
            this.isPseudoStream = true;
            this.allowRandomSeek = true;
            this.media.loadProgress = 100;
        }

        if (this.streamType.indexOf('live')>-1 ) {
            this.allowRandomSeek = true;
            this.media.loadProgress = 100;
        }
    }, 

    _OSMFListener: function() {    
        var event = arguments[0][1],
            value = arguments[0][2],
            ref = this;
 
        this.mediaElement = $('#' +  this.pp.getMediaId()+"_flash"); // IE 10 sucks
        
        switch(event) {
            case 'onJavaScriptBridgeCreated':
                if (this.mediaElement!==null && this.getState('AWAKENING') ) {                
                    $.each(this._eventMap, function(key, value){
                        ref.mediaElement.get(0).addEventListener(key, "projekktor('"+ref.pp.getId()+"').playerModel." + value);
                    });
                    this.flashReadyListener();
                }
                break;
            
            // ther is no public event-hook for this:
            case 'loadedmetadata':
                this.metaDataListener(value);
                break;
                
            case 'progress':
            break;
                this.progressListener({
                    loaded: value.buffered._end,
                    total: this.media.duration
                });
                break;                    
        }           
    },
    
    OSMF_universal: function() {},
    
    OSMF_isRecordingChange: function() {},
    
    OSMF_PlayerCapabilityChange: function(state) {},        
 
    OSMF_bytesLoadedChange: function() {
        var me = this.mediaElement.get(0),
            progress = 0;
            
        progress = me.getBytesLoaded() * 100 / me.getBytesTotal();

        if (this.media.loadProgress > progress) return;

        this.media.loadProgress = (this.allowRandomSeek === true) ? 100 : -1;
        this.media.loadProgress = (this.media.loadProgress < 100 || this.media.loadProgress === undefined) ? progress : 100;

        this.sendUpdate('progress', this.media.loadProgress);
    },
        
    OSMF_durationChange: function(value) {
        if (isNaN(value)) return;
        this.timeListener({position: this.media.position, duration: value || 0 });
        this.seekedListener();
    },
    
    OSMF_currentTimeChange: function(value) {
        if (this._isDVR) {
            this.sendUpdate('isLive', (value+20 >= this.media.duration)); // 20 => default dvr buffer of SMP
        }
        this.timeListener({position: value, duration: this.media.duration || 0 });
    },
    
    OSMF_seekingChange: function(value) {
        this.seekedListener();
    },
    
    OSMF_bufferingChange: function(state) {
        if (state===true) 
            this.waitingListener();
        else
            this.canplayListener();
    },    
    
    OSMF_loadStateChange: function(state) {
        switch (state) {
            case 'loading':        
                this.waitListener();
                break;
            case 'ready':
                if (this.getState('awakening')) {
                    this.displayReady();
                }            
                if (this.getState('starting')) {
                    this.setPlay();
                }
                if (this.mediaElement.get(0).getStreamType().indexOf('dvr')>-1) {
                    this.allowRandomSeek = true;
                    this.media.loadProgress = 100;
                }                        
                break;
            case 'loadError':
                // causes false positive in case of dynamically loaded plugins
                // this.errorListener(80);                
                break;            
        }
    },
    
    /* catching playStateChange and playerStateChange and playerStateChange aaaand... and playerStateChange */
    OSMF_playerStateChange: function(state) {
        var ref = this;
        
        // getIsDVR & getIsDVRLive seem to be broken - workaround:
        if (!this._isDVR && this.mediaElement.get(0).getStreamType()=='dvr') {
            this._isDVR = true;
            this.sendUpdate('streamTypeChange', 'dvr');
        }

        switch(state) {
            case 'playing':
                this.playingListener();
                break;
            case 'paused':            
                this.pauseListener();
                if (this._isDVR) {
                    // simulate sliding time window:
                    (function() {
                        if (ref.getState('PAUSED')) {
                            if (ref.media.position>=0.5) {
                                ref.timeListener({position: ref.media.position-0.5, duration: ref.media.duration || 0 });
                                setTimeout(arguments.callee, 500);
                            }
                        }
                    })();
                }
                break;
            case 'stopped':
                if (!this.getSeekState('SEEKING')) {
                    this.endedListener();
                }
                break;                
        }
    },    
    
    OSMF_updateDynamicStream: function() {
        var dynamicStreams = this.mediaElement.get(0).getStreamItems(),
            name = '',
            result = [];
            // switchMode = this.mediaElement.get(0).getAutoDynamicStreamSwitch() ? "Auto" : "Manual";

        for (var index in dynamicStreams) {
            if (dynamicStreams.hasOwnProperty(index) && dynamicStreams[index].bitrate!==undefined) {
                name = dynamicStreams[index].width + "x" + dynamicStreams[index].height;
                if ( this.pp.getConfig('OSMFQualityMap') &&  this.pp.getConfig('OSMFQualityMap')[name] ) {
                    this.availableQualities[ this.pp.getConfig('OSMFQualityMap')[name] ] = index;
                }
                
            }
        }

        $p.utils.log( dynamicStreams );
        
        $.each( this.availableQualities, function(key, val) {
            result.push(key);
        });
        
        result.push('auto');
        
        this._isDynamicStream = true; // important: set this before sending the update
        this.sendUpdate('availableQualitiesChange', result);        
    },
    
    OSMF_canSeekChange: function(enabled) {
        if(enabled){
            this.allowRandomSeek = true;
            this.media.loadProgress = 100;
        }
        else {
            this.allowRandomSeek = false;
        }
    },
    
    /* todo */
    switchDynamicStreamIndex: function(index) {
        if (index==-1) {
            this.mediaElement.get(0).setAutoDynamicStreamSwitch(true);	
        } else {
            if (this.mediaElement.get(0).getAutoDynamicStreamSwitch()) {
                this.mediaElement.get(0).setAutoDynamicStreamSwitch(false);	
            }
            this.mediaElement.get(0).switchDynamicStreamIndex(index);
        }
    },
    
    errorListener: function() {
        /* todo OSMF MediaErrorCodes mapping http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/org/osmf/events/MediaErrorCodes.html */
        switch (arguments[0]) {
            case 15:
                this.sendUpdate('error', 5);
                break;
            // case 16:
            case 80:
                this.sendUpdate('error', 80);
                break;
                
            default:
                // this.sendUpdate('error', 0);
                break;
        }
    },
    
    detachMedia: function() {        
        try{this.mediaElement.get(0).remove();} catch(e){}           
    },
    
    volumeListener: function (volume) {
        this._volume = volume;      
    },    
    
    endedListener: function (obj) {
        if (this.mediaElement === null) return;
        if (this.media.maxpos <= 0) return;
        if (this.getState() == 'STARTING') return;
        if (this._qualitySwitching===true) return;
        this._setState('completed');
    },    
    
    /************************************************
     * setters
     ************************************************/
    setSeek: function(newpos) {
        if (this.isPseudoStream) {
            this._setSeekState('seeking');
            this.media.offset = newpos;
            this.applySrc();
            return;
        }

        if (newpos==-1) {
            newpos = this.getDuration();
        }

        this.mediaElement.get(0).seek(newpos);
    },
    
    setVolume: function(newvol) {
        if (this.mediaElement===null) 
            this.volumeListener(newvol);
        else
            this.mediaElement.get(0).setVolume(newvol);
    },    
    
    setPause: function(event) {
        this.mediaElement.get(0).pause();
    },      
    
    setPlay: function(event) {     
        this.mediaElement.get(0).play2();
    },
    

    setQuality: function (quality) {
        if (this._quality == quality) return;
        this._quality = quality;
        
        if (this._isDynamicStream === true) {
            this.switchDynamicStreamIndex( (quality=='auto') ? -1 : this.availableQualities[quality] );
            return;
        }
        
        this._qualitySwitching = true;
        this.applySrc();
        this._qualitySwitching = false;
        this.qualityChangeListener();
    },    

    /************************************************
     * getters
     ************************************************/
    getVolume: function() {
        if (this._isMuted===true)
            return 0;
        
        if (this.mediaElement===null)
            return this.media.volume;
    
        return this._volume;
    },
    
    getSrc: function () {
        try {
            return this.mediaElement.get(0).getCurrentSrc();
        } catch(e) {return null;}
    },
    
    getQuality: function () {
        return this._quality;
    },    
    
    /************************************************
     * disablers
     ************************************************/    
    _scaleVideo: function(){}
    
});

$p.newModel({    

    modelId: 'OSMFVIDEONA',
    iLove: [
        {ext:'flv', type:'video/flv', platform:'flashna', fixed: true, streamType: ['*']},
        {ext:'mp4', type:'video/mp4', platform:'flashna', streamType: ['*']},
        {ext:'f4v', type:'video/mp4', platform:'flashna', streamType: ['*']},
        {ext:'mov', type:'video/quicktime', platform:'flashna', streamType: ['*']},
        {ext:'m4v', type:'video/mp4', platform:'flashna', fixed: true, streamType: ['*']},
        {ext:'f4m', type:'application/f4m+xml', platform:'flashna', fixed: true, streamType: ['*']}   
    ],    
    _hardwareAcceleration: false
}, 'OSMFVIDEO');

$p.newModel({    

    modelId: 'OSMFAUDIO',
    replace: 'AUDIOFLASH',
    
    hasGUI: false,
    iLove: [
        {ext:'mp3', type:'audio/mp3', platform:'flash', streamType: ['*']},
        {ext:'m4a', type:'audio/mp4', platform:'flash', streamType: ['*']},
        {ext:'m4a', type:'audio/mpeg', platform:'flash', streamType: ['*']}    
    ],
    
    applyMedia: function(destContainer) {
        var ref = this; 
        
        $p.utils.blockSelection(destContainer);        

        // create image element
        this.imageElement = this.applyImage(this.getPoster('cover') || this.getPoster('poster'), destContainer);
            
        var flashContainer = $('#'+this.pp.getMediaId()+'_flash_container');
        
        if (flashContainer.length===0) {
            flashContainer = $(document.createElement('div'))
            .css({width: '1px', height: '1px'})
            .attr('id', this.pp.getMediaId()+"_flash_container")
            .prependTo( this.pp.getDC() );        
        }
        
        window['projekktorOSMFReady'+this.pp.getId()] = function() {
            projekktor(ref.pp.getId()).playerModel._OSMFListener(arguments);
        };
        
        var domOptions = {
            id: this.pp.getMediaId()+"_flash",
            name: this.pp.getMediaId()+"_flash",
            src: this.pp.getConfig('playerFlashMP4'),
            width: '100%',
            height: '100%',
            allowScriptAccess:"always",
            quality:"height",
            menu: false,
            allowFullScreen: 'true',
            wmode: 'opaque',
            seamlesstabbing: 'false',
            bgcolor: '#ccc',
            FlashVars: $.extend({      
                javascriptCallbackFunction: 'window.projekktorOSMFReady'+this.pp.getId()               
            }, this.pp.getConfig('OSMFVars'))
            };

        this.createFlash(domOptions, flashContainer, false); 
    }
    
}, 'OSMFVIDEO');
});