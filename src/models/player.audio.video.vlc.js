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
    
    modelId: 'VIDEOVLC',
    vlcVersion: "2.0.6.0",
    iLove: [],
    
    _eventMap: {
        MediaPlayerPaused: "pauseListener",
        MediaPlayerPlaying: "playingListener",
        MediaPlayerTimeChanged: "_timeListener",
        MediaPlayerEndReached: "endedListener",
        MediaPlayerBuffering: "waitingListener",
        MediaPlayerEncounteredError: "errorListener",
        MediaPlayerSeekableChanged: 'seekableListener'
        // volumechange:   "volumeListener" - not supported
        // progress:       "progressListener", - not supported        
        // suspend:        "suspendListener", - not supported
        // seeked:         "seekedListener", - not supported
        // loadstart:      null - not supported
    },    
    
    allowRandomSeek: false,
    videoWidth: 0,
    videoHeight: 0,
    isPseudoStream: false,
    
    setiLove: function() {
        var model = this;
        if (navigator.plugins && (navigator.plugins.length > 0)) {
            for(var i=0;i<navigator.plugins.length;++i) {
                if (navigator.plugins[i].name.indexOf("VLC")>-1) {               
                    for (var j=0; j<navigator.plugins[i].length; j++) {
                        var ref = navigator.plugins[i][j];
                        if (ref.suffixes!=null && ref.type!=null) {
                            $.each(ref.suffixes.split(','), function(key, value) {
                                model.iLove.push( {ext:value, type: ref.type.replace(/x-/, ''), platform:['vlc'], streamType: ['rtsp', 'http', 'pseudo', 'httpVideo', 'multipart']} );
                            })
                        }
                    }
                    break;
                }
            }
        }
    },
    
    applyMedia: function(destContainer) {
        destContainer.html('').append(
            $('<embed/>')
                .attr({
                    "id": this.pp.getMediaId()+"_vlc",
                    "type": 'application/x-vlc-plugin',
                    "pluginspage": 'http://www.videolan.org',
                    // "version": 'VideoLAN.VLCPlugin.1',
                    "width": '100%',
                    "height": '100%',
                    "events": true,
                    "controls": false,
                    "toolbar": false,
                    "windowless": true,
                    "allowfullscreen": true,
                    "autoplay": false
                }).css({
                    'position': 'absolute',
                    'top': 0,
                    'left': 0
                })
        );
/*
        destContainer.append(
            $('<div/>').attr('id', this.pp.getMediaId()+"_vlc_cc" )
            .css({
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255,0,0,0.1)',
                opacity: '0.1',
                filter: 'alpha(opacity = 0.1)',
                position: 'absolute',
                top: 0,
                left: 0
            })
        )        
  */
  
        this.mediaElement = $('#'+this.pp.getMediaId()+"_vlc");
        this.applySrc();
    },
    
    applySrc: function() {

        var ref = this,
            sources = this.getSource();

        this.mediaElement.get(0).playlist.add(sources[0].src, 'item 1');
        
        if (this.getState('PLAYING')) {
            this.setPlay();
            if (ref.isPseudoStream!==true)
                this.setSeek(this.media.position || 0);
        } else {
            this.displayReady();
        }
    },
    
    detachMedia: function() {
        try {
            this.mediaElement.get(0).playlist.stop();
            this.mediaElement.html('');
        } catch(e){}
    },
        

    
    /*****************************************
     * Handle Events
     ****************************************/ 
    addListeners: function() {
        var ref = this;

        $.each(this._eventMap, function(event, value){
            try {
                if (ref.mediaElement.get(0).attachEvent) {
                    // Microsoft
                    ref.mediaElement.get(0).attachEvent (event, function(evt) {ref[value](this, evt);});
                } else if ( ref.mediaElement.get(0).addEventListener) {
                    // Mozilla: DOM level 2            
                    ref.mediaElement.get(0).addEventListener (event, function(evt) {ref[value](this, evt);}, false);
                } else {            
                    // DOM level 0            
                    ref.mediaElement.get(0)["on" + event] = function(evt) {ref[value](this, evt);};
                }
            } catch(e){}
        });

    },

    removeListener: function(evt, subId) {        
        if (this.mediaElement==null) {
            return;
        }
        var id = (subId!=null) ? '.projekktor'+subId+this.pp.getId() : '.projekktor'+this.pp.getId(),
            ref = this;

        $.each(this._eventMap, function(key, value){
            if (key==evt) {
                ref.mediaElement.unbind(key + id);
            }
        });              
    },
    
    _timeListener: function(obj) {
        this.timeListener({
            position: this.mediaElement.get(0).input.time / 1000,
            duration: this.mediaElement.get(0).input.length / 1000
        });
    },
    
    seekableListener: function() {
        this.allowRandomSeek = true;
        this.media.loadProgress = 100;
    },
    
    errorListener: function(obj, evt) {
        try {
            switch (event.target.error.code) {
                case event.target.error.MEDIA_ERR_ABORTED:
                this.sendUpdate('error', 1);
                break;
            case event.target.error.MEDIA_ERR_NETWORK:
                this.sendUpdate('error', 2);
                break;
            case event.target.error.MEDIA_ERR_DECODE:
                this.sendUpdate('error', 3);
                break;
            case event.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                this.sendUpdate('error', 4);
                break;
            default:
                this.sendUpdate('error', 5);
                break;
            }
        } catch(e) {}
    },
      

    /*****************************************
     * Setters
     ****************************************/     
    setPlay: function() {
        this.mediaElement.get(0).playlist.play();
    },
    
    setPause: function() {
        this.mediaElement.get(0).playlist.pause();
    },   
            
    setVolume: function(volume) {
        this._volume = volume;
        this.mediaElement.get(0).audio.volume = volume*100;
        // missing volume event workaround
        this.volumeListener(volume);
    }, 
     
    setSeek: function(newpos) {
        this.mediaElement.get(0).input.position = newpos / this.media.duration;
        // missing "seeked" event workaround
        this._setSeekState('seeked', newpos);   
    },
    

    setFullscreen: function() {
        // windowless:true rescaling issue workaround
        pos = this.mediaElement.get(0).input.position;
        this.mediaElement.get(0).playlist.stop();
        this.setPlay();
        this.mediaElement.get(0).input.position = pos;
        if (this.getState('PAUSED'))
            this.setPause();
    },

    setResize: function() {
        this._scaleVideo(false);
    }
    
});
});