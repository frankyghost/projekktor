/*
 * this file is part of: 
 * projekktor zwei
 * http://www.projekktor.com
 *
 * Copyright 2010, 2011, Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com
 * under GNU General Public License
 * http://www.filenew.org/projekktor/license/
 *
 * This hack implements an interface model makeing the Jaris FLV player available within
 * the Projekktor environment.
 *
 * JARIS Player:
 * copyright 2010 Jefferson Gonzalez, http://jarisflvplayer.org
 * under GNU LESSER GENERAL PUBLIC LICENSE 3
*/
jQuery(function($) {
$p.newModel({

    modelId: 'VIDEOFLASH',
    flashVersion: "9",
    iLove: [
        {ext:'flv', type:'video/flv', platform:'flash', streamType: ['http', 'httpVideo', 'pseudo', 'rtmp'],fixed: true},
        {ext:'mp4', type:'video/mp4',  platform:'flash', streamType: ['http', 'httpVideo', 'pseudo',  'rtmp'],fixed: 'maybe'},
        {ext:'mov', type:'video/quicktime', streamType: ['http', 'httpVideo',  'pseudo', 'rtmp'], platform:'flash'},
        {ext:'m4v', type:'video/mp4', platform:'flash', streamType: ['http', 'httpVideo', 'pseudo', 'rtmp'], fixed: 'maybe'},
        {ext:'f4m', type:'video/abst', platform:'flash', streamType: ['httpVideoLive']}
    ],
    
    _eventMap: {
        onprogress:             "progressListener",
        ontimeupdate:           "timeListener",
        ondatainitialized:      "metaDataListener",
        onconnectionsuccess:    "startListener",
        onplaypause:            "_playpauseListener",
        onplaybackfinished:     "endedListener",
        onmute:                 "volumeListener",
        onvolumechange:         "volumeListener",
        onbuffering:            "waitingListener",
        onnotbuffering:         "canplayListener",
        onconnectionfailed:     "errorListener"                        
    },        
    
    isPseudoStream: false,
    allowRandomSeek: false,
    flashVerifyMethod: 'api_source',
    _jarisVolume: null,

    applyMedia: function(destContainer) {

        var domOptions = {
            id: this.pp.getMediaId()+"_flash",
            name: this.pp.getMediaId()+"_flash",
            src: this.pp.getConfig('playerFlashMP4'),
            width: '100%',
            height: '100%',
            allowScriptAccess:"always",
            allowFullScreen: 'false',
            allowNetworking: "all",        
            wmode: ($p.utils.ieVersion()) ? 'transparent' : 'opaque',
            bgcolor: '#000000',
            FlashVars: {        
                type: "video",
                streamtype: (this.pp.getConfig('streamType').indexOf('rtmp')==-1) ? 'file' : 'rtmp',
                server: (this.pp.getConfig('streamType').indexOf('rtmp')>-1) ? this.pp.getConfig('streamServer') : '',
                autostart: "false",
                controls: 'false',        
                aspectratio: this.pp.getConfig('videoScaling')
            }
        };

        switch(this.pp.getConfig('streamType')) {
            case 'rtmp':
                this.allowRandomSeek = true;
                this.media.loadProgress = 100;
                break;
            case 'pseudo':             
                this.isPseudoStream = true;
                this.allowRandomSeek = true;
                this.media.loadProgress = 100;
            break;
        }
    
        this.createFlash(domOptions, destContainer);      
    },

    applySrc: function() {
        var ref = this,
            sources = this.getSource();

        this.mediaElement.get(0).api_source(sources[0].src);
        
        this.seekedListener();            

        if (this.getState('PLAYING')) {
            this.setPlay();
            if (ref.isPseudoStream!==true)
                this.setSeek(this.media.position || 0);
        }
    },

    
    /*****************************************
     * Handle Events
     ****************************************/ 
    addListeners: function() {
        if (this.mediaElement==null) return;        
        var ref = this;       
        $.each(this._eventMap, function(key, value){
            ref.mediaElement.get(0).api_addlistener(key, "projekktor('"+ref.pp.getId()+"').playerModel." + value);
        });       
    },

    removeListeners: function() {
        try {this.mediaElement.get(0).api_removelistener("*");} catch(e){}; 
    },   
    
    flashReadyListener: function() {        
        this.applySrc();
        this.displayReady();
    },        
    
    /* needs a more sophisticated error repoprting */
    errorListener: function(event) {         
        this.sendUpdate('error', 4);        
    },
    
    /* "volume change event flood" workaround - fix this within jarisplayer! */ 
    volumeListener: function(obj) {
        if (this._jarisVolume!==obj.volume) {        
            this._jarisVolume=obj.volume;
            this.sendUpdate('volume', obj.volume);
        }
    },
        
      
    /* wrapping non-status-based jaris behavior */
    _playpauseListener: function(obj) {       
        
        if (obj.isplaying) {
                // jaris player workaround for pause/seek/reset issue
                if (this.getModelName().indexOf('AUDIO')>-1) {
                    this.setSeek(this.media.position);
                }
            this.playingListener();
        }
        else {
            this.pauseListener();
        }
        this.setVolume(this._jarisVolume);        
    },
    
    metaDataListener: function(obj) {
        
        this.applyCommand('volume', this.pp.getConfig('volume'));
            
        try {this.mediaElement.get(0).api_seek(this.media.position || 0);} catch(e){}; 
        this._setState('playing'); 
        
            if (this.modelId.indexOf('AUDIO')>-1) {
                this.mediaElement.get(0).api_removelistener('ondatainitialized');
                return;
            }
            
            try {
                this.videoWidth = obj.width;
                this.videoHeight = obj.height;
                // the flash component scales the media by itself
                this.sendUpdate('scaled', {width: this.videoWidth, height:this.videoHeight});
            } catch(e) {};    

    },
    
    startListener: function(obj) {
        this.applyCommand('volume', this.pp.getConfig('volume'));    
        try {this.mediaElement.get(0).api_seek(this.media.position || 0);} catch(e){}; 
        this._setState('playing'); 
    },      
     
    
    /*****************************************
     * Setters
     ****************************************/       
    setSeek: function(newpos) { 
        if (this.isPseudoStream) {
            this.media.offset = newpos;
            // this.timeListener();    
            this.applySrc();
        } else {        
            try {this.mediaElement.get(0).api_seek(newpos);} catch(e){};
            this.seekedListener();            
            this.timeListener({position:newpos});    
        }
        this.setVolume(this._jarisVolume);        
    },

    setVolume: function(newvol) {
        this._volume = newvol;
        try {this.mediaElement.get(0).api_volume(newvol);} catch(e){return false;}
        return newvol;
    },    
    
    setPause: function(event) {
        try {this.mediaElement.get(0).api_pause();} catch(e){};
    },      
    
    setPlay: function(event) {
        try {this.mediaElement.get(0).api_play();} catch(e){};
    },
                
    getVolume: function() {    
        return this._jarisVolume;
    },

    detachMedia: function() {
        this.setPause();
        try{$(this.mediaElement).get(0).remove();} catch(e){}           
    }
});

$p.newModel({    

    modelId: 'AUDIOFLASH',
    iLove: [
        {ext:'mp3', type:'audio/mp3', platform:'flash', streamType: ['http', 'httpAudio', 'httpAudioLive']},
        {ext:'mp3', type:'audio/mpeg', platform:'flash', streamType: ['http', 'httpAudio', 'httpAudioLive']},
        {ext:'m4a', type:'audio/mp4', platform:'flash', streamType: ['http', 'httpAudio', 'httpAudioLive']}
    ],
    
    applyMedia: function(destContainer) {
    
        $p.utils.blockSelection(destContainer)        
    
        // create image element
        this.imageElement = this.applyImage(this.pp.getConfig('cover') || this.pp.getConfig('poster'), destContainer);
            
        var flashContainer = $('#'+this.pp.getMediaId()+'_flash_container')
        if (flashContainer.length===0) {
            flashContainer = $(document.createElement('div'))
            .css({width: '1px', height: '1px'})
            .attr('id', this.pp.getMediaId()+"_flash_container")
            .prependTo( this.pp.getDC() );        
        }
    
        var domOptions = {
            id: this.pp.getMediaId()+"_flash",
            name: this.pp.getMediaId()+"_flash",
            src: this.pp.getConfig('playerFlashMP3'),
            width: '1px',
            height: '1px',
            allowScriptAccess:"always",
            allowFullScreen: 'false',
            allowNetworking: "all",        
            wmode: 'transparent',
            bgcolor: '#000000',
            FlashVars: {
                type: "audio",
                streamtype: 'file', 
                server: '',
                autostart: "false",
                hardwarescaling: "false",
                controls: 'false',
                jsapi: 'true'
            }
         };
        
        this.createFlash(domOptions, flashContainer, false);      
    }
    
}, 'VIDEOFLASH');

});