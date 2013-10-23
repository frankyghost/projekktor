/*
 * this file is part of: 
 * projekktor zwei
 * http://www.projekktor.com
 *
 * Copyright 2013 Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com

 * Use of this software is NOT free and requires permission of the copyright owner.
 * Unlicensed use is forbidden and subject to severe penalties of law.
 */
jQuery(function($) {
$p.newModel({

    modelId: 'OSMFVIDEO',
    replace: 'VIDEOFLASH',
    
    flashVersion: "10.1",
    flashVerifyMethod: 'addEventListener',
    
    iLove: [
        {ext:'flv', type:'video/flv', platform:'flash', fixed: true, streamType: ['*']},
        {ext:'mp4', type:'video/mp4', platform:'flash', streamType: ['*']},
        {ext:'f4v', type:'video/mp4', platform:'flash', streamType: ['*']},
        {ext:'mov', type:'video/quicktime', platform:'flash', streamType: ['*']},
        {ext:'m4v', type:'video/mp4', platform:'flash', fixed: true, streamType: ['*']},
        {ext:'f4m', type:'application/f4m+xml', platform:'flash', fixed: true, streamType: ['*']},
        {ext:'m3u8', type:'application/mpegURL', platform:'flash', fixed: true, streamType: ['*']}        
    ],

    hasGUI: false,    
    allowRandomSeek: false,
    isPseudoStream: false,
    streamType: 'http',
    
    availableQualities: {},
    
    _isStream: false,
    _isMuted: false,
    _isStarted: false,
    _qualitySwitching: false,
    _isDynamicStream: false,
    _volume: 0,

    _eventMap: {
        mediaPlayerStateChange: "OSMF_playerStateChange",
        mediaPlayerCapabilityChange: "OSMF_PlayerCapabilityChange",
        durationChange: "OSMF_durationChange",
        currentTimeChange: "OSMF_currentTimeChange",
        loadStateChange: "OSMF_loadStateChange",
        bufferingChange: "OSMF_bufferingChange",
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
        switchingChange: "OSMF_updateDynamicStream"
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
            allowScriptAccess:"always",
            quality:"height",
            menu: false,
            allowFullScreen: 'true',
            wmode: 'opaque',
            seamlesstabbing: 'false',
            bgcolor: '#ccc',
            FlashVars: $.extend({
                // streamType: this.pp.getConfig('streamType', ''), // "dvr", //  "live" "recorded", "dvr"
                controlBarMode: 'none',
                playButtonOverlay: false,
                // showVideoInfoOverlayOnStartUp: true,
                // dvrSnapToLiveClockOffset: "5",
                bufferingOverlay: false,
                javascriptCallbackFunction: 'window.projekktorOSMFReady'+this.pp.getId()               
            }, this.pp.getConfig('OSMFVars'))
            };

        this.createFlash(domOptions, destContainer);
    },
    
    // disable default ready listener - wait for onJavaScriptBridgeCreated 
    flashReadyListener: function() {},

    // 
    removeListeners: function() {},
    
    // disable default addListener method
    addListeners: function() {},
        
    applySrc: function() {
        var ref = this,
            sources = this.getSource();

        this.mediaElement.get(0).setMediaResourceURL(sources[0].src);
        
        this.streamType = sources[0].streamType || this.pp.getConfig('streamType') || 'http';

        if (this.getState('PLAYING')) {
            this.setPlay();
            if (ref.isPseudoStream!==true)
                this.setSeek(this.media.position || 0);
        }
        
        if(this.pp.getConfig('streamType')=='pseudo') {
            this.isPseudoStream = true;
            this.allowRandomSeek = true;
            this.media.loadProgress = 100;
        }
        
        if (this.pp.getConfig('streamType').indexOf('live')) {
            this.allowRandomSeek = true;
            this.media.loadProgress = 100;         
        }
    }, 

    _OSMFListener: function() {    
        var event = arguments[0][1],
            value = arguments[0][2],
            ref = this;

        switch(event) {
            case 'onJavaScriptBridgeCreated':
                if (this.mediaElement!==null && this.getState('AWAKENING') ) {                
                    $.each(this._eventMap, function(key, value){
                        ref.mediaElement.get(0).addEventListener(key, "projekktor('"+ref.pp.getId()+"').playerModel." + value);
                    });   
                    this.applySrc();
                }
                break;
            
            // there´s now public event-hook for this:
            case 'loadedmetadata':
                this.metaDataListener(value);
                break;        
            
            case 'progress':
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
    
    OSMF_durationChange: function(value) {
        if (isNaN(value)) return;
        this.timeListener({position: this.media.position, duration: value || 0 });
    },
    
    OSMF_currentTimeChange: function(value) {    
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
                break;
        }
    },
    
    /* catching playStateChange and playerStateChange */
    OSMF_playerStateChange: function(state) {
        switch(state) {
            case 'playing':
                this.playingListener();
                break;
            case 'paused':
                this.pauseListener();
                break;
            case 'stopped':
                if (!this.getSeekState('SEEKING')) {
                    this.endedListener();
                }
                break;                
        }
    },    
    
    /* todo */
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
        
        this.sendUpdate('availableQualitiesChange', result);
        this._isDynamicStream = true;
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
        switch (arguments[0]) {
            case 16:
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
    
    /************************************************
     * disablers
     ************************************************/    
    _scaleVideo: function(){}
    
});

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
        this.imageElement = this.applyImage(this.pp.getConfig('cover') || this.pp.getConfig('poster'), destContainer);
            
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
                controlBarMode: 'none',
                playButtonOverlay: false,
                showVideoInfoOverlayOnStartUp: true,
                bufferingOverlay: false,
                javascriptCallbackFunction: 'window.projekktorOSMFReady'+this.pp.getId()               
            }, this.pp.getConfig('OSMFVars'))
            };

        this.createFlash(domOptions, flashContainer, false); 
    }
    
}, 'OSMFVIDEO');
});