/*
 * this file is part of: 
 * projekktor zwei
 * http://www.projekktor.com
 *
 * Copyright 2010, 2011, Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com
 * under GNU General Public License
 * http://www.filenew.org/projekktor/license/
 *
 * This is an ALTERNATE model to use the JWplayer as fallback instead of jarisplayer
*/
jQuery(function($) {
$p.newModel({

    modelId: 'JWVIDEO',
    iLove: [
	{ext:'flv', type:'video/flv', platform:'flash', streamType: ['http', 'pseudo', 'rtmp'], fixed: true},
	{ext:'mp4', type:'video/mp4', platform:'flash', streamType: ['http', 'pseudo', 'rtmp']},
	{ext:'mov', type:'video/quicktime', platform:'flash', streamType: ['http', 'pseudo', 'rtmp']},
	{ext:'m4v', type:'video/mp4', platform:'flash', streamType: ['http', 'pseudo', 'rtmp']}
    ],

    requiresFlash: 9,
    flashVerifyMethod: 'getConfig',
    hasGUI: false,
    
    _isMuted: false,
    _isStarted: false,
    
    applyMedia: function(destContainer) {

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
            wmode: ($p.utils.ieVersion()) ? 'transparent' : 'opaque',
	    seamlesstabbing: 'false',
	    bgcolor: '#111111',
            FlashVars: {
		file: this.getSource()[0].src,
		backcolor: '000000',
		frontcolor: 'd5e0f7',
		lightcolor: 'FFFFFF',
		screencolor: '000000',
		stretching: 'fill',
		bufferlength: 5,
		autostart: "false" // makes sure that no start button is shown within the flash video comp.
	    }
        };
	
	this.createFlash(domOptions, destContainer);

    },
    
    applySrc: function() {


    },
    flashReadyListener: function() {        
	this.addListeners();
        this.displayReady();
    },      

    /* custom addlistener */
    addListeners: function() {
	if (this.mediaElement==null) return;

	// pp events
	this.mediaElement.addControllerListener("VOLUME", "projekktor('"+this.pp.getId()+"').playerModel.volumeListener");	
	this.mediaElement.addControllerListener("MUTE", "projekktor('"+this.pp.getId()+"').playerModel._muteListener");

	// model events
	this.mediaElement.addModelListener("STATE", "projekktor('"+this.pp.getId()+"').playerModel._stateListener");
	this.mediaElement.addModelListener("TIME", "projekktor('"+this.pp.getId()+"').playerModel.timeListener");
	this.mediaElement.addModelListener("LOADED", "projekktor('"+this.pp.getId()+"').playerModel.progressListener");	
	this.mediaElement.addModelListener("ERROR", "projekktor('"+this.pp.getId()+"').playerModel.errorListener");
	this.mediaElement.addModelListener("BUFFER", "projekktor('"+this.pp.getId()+"').playerModel._bufferListener");
	
	this.setPlay();
    },
    
    _muteListener: function(value) {
	this._isMuted = false;
	try {
	    if (value.state===true) {
		this._isMuted = true;
	    }
	} catch(e){}
	this.volumeListener();
    },
    
    _stateListener: function(value) {
	switch (value.newstate) {
	    case "COMPLETED":
		this.endedListener();
		break;
	    case "PLAYING":
		if (this._isStarted===false) {
		    this._isStarted = true;
		    this.startListener();
		    break;
		}			
		this.playingListener();
		break;
	    case "PAUSED":
		this.pauseListener();
		break;
    	    case "BUFFERING":
		this.waitingListener();
		break;
	    
	}
	
    },
    
    /*get rid of listeners */
    removeListeners: function() {	
        try {
	    // pp events
	    this.mediaElement.removeppListener("VOLUME", "projekktor('"+this.pp.getId()+"').playerModel.volumeListener");	
	    this.mediaElement.removeppListener("MUTE", "projekktor('"+this.pp.getId()+"').playerModel._muteListener");
    
	    // model events
	    this.mediaElement.removeModelListener("STATE", "projekktor('"+this.pp.getId()+"').playerModel._stateListener");
	    this.mediaElement.removeModelListener("TIME", "projekktor('"+this.pp.getId()+"').playerModel.timeListener");
	    this.mediaElement.removeModelListener("LOADED", "projekktor('"+this.pp.getId()+"').playerModel.progressListener");	
	    this.mediaElement.removeModelListener("ERROR", "projekktor('"+this.pp.getId()+"').playerModel.errorListener");
	    this.mediaElement.removeModelListener("BUFFER", "projekktor('"+this.pp.getId()+"').playerModel._bufferListener");    	
        } catch(e){}; 
    },
    
    setSeek: function(newpos) {
	this.mediaElement.sendEvent("SEEK", newpos);        
    },
    
    setVolume: function(newvol) {
	if (this.mediaElement==null) 
	    this.volumeListener(newvol)
	else
	    this.mediaElement.sendEvent("VOLUME", newvol*100);
    },    
    
    setPause: function(event) {
	this.mediaElement.sendEvent("PLAY", false);
    },      
    
    setPlay: function(event) {
        this.mediaElement.sendEvent("PLAY", true);
    },
                
    getVolume: function() {
	if (this._isMuted===true)
	    return 0;
	
	if (this.mediaElement==null)
	    return this.media.volume;
	
        return this.mediaElement.getConfig().volume/100;
    },

    errorListener: function(event) {
        this.setTestcard(0, event.message+"<br/>");
    }
});

$p.newModel({    

    modelId: 'JWAUDIO',
    hasGUI: false,
    iLove: [
	{ext:'mp3', type:'audio/mp3', platform:'flash'},
	{ext:'m4a', type:'audio/mp4', platform:'flash'}
    ],
    
    applyMedia: function(destContainer) {
	
	this.imageElement = this.applyImage(this.pp.getConfig('cover') || this.pp.getConfig('poster'), destContainer);	
	
	var flashContainer = $('#'+this.pp.getId()+'_flash_container')
	if (flashContainer.length==0) {
	    flashContainer = $(document.createElement('div'))
		.css({width: '1px', height: '1px', 'border': '1px solid red'})
		.attr('id', this.pp.getId()+"_flash_container")
		.appendTo( destContainer );	    
	}
	
        var domOptions = {
            id: this.pp.getMediaId()+"_flash",
            name: this.pp.getMediaId()+"_flash",
            src: this.pp.getConfig('playerFlashMP3'),
            width: '1px',
            height: '1px',
            allowScriptAccess:"always",
	    quality:"height",
	    menu: false,
	    allowFullScreen: 'false',
            wmode: 'opaque',
	    seamlesstabbing: 'false',
	    bgcolor: '#111111',
            FlashVars: {
		file: this.getSource()[0].src,
		backcolor: '000000',
		frontcolor: 'd5e0f7',
		lightcolor: 'FFFFFF',
		screencolor: '000000',
		stretching: 'fill',
		bufferlength: 5,
		autostart: "false" // makes sure that no start button is shown within the flash video comp.
	    }
        };
	
	this.createFlash(domOptions, flashContainer);   
    }
}, 'JWVIDEO');


});