/*
 * this file is part of: 
 * projekktor zwei
 * http://filenew.org/projekktor/
 *
 * Copyright 2010, 2011, Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com
 * under GNU General Public License
 * http://www.filenew.org/projekktor/license/
*/
// http://code.google.com/apis/youtube/js_api_reference.html#Embedding
jQuery(function($) {
$p.newModel({
    
    modelId: 'YTVIDEO',
    iLove: [
	{ext:'youtube.com', type:'video/youtube', platform:'flash', fixed:'maybe'}
    ],
    
    allowRandomSeek: true,
    useIframeAPI: true,
    flashVerifyMethod: 'cueVideoById',
    
    _ffFix: false,
    _updateTimer: null,
    
    init: function(params) {
	
	var ref = this;
	
	this.useIframeAPI = this.pp.getConfig('useYTIframeAPI') || this.pp.getIsMobileClient();
	this.hasGUI = this.pp.getIsMobileClient();
	
	
	if (!this.useIframeAPI) {
	    this.requiresFlash = 8;
	    this.ready();
	    return;
	}
	
	var id = this.pp.getId();
	
	// load youtube API stuff if required:
	if (window.ProjekktorYoutubePlayerAPIReady!==true) {
	    $.getScript('http://www.youtube.com/player_api');
	    // we ca not use the getscript onready callback here
	    // coz youtube does some additional ubersecret stuff
	    (function() {
		try{
		    if(window.ProjekktorYoutubePlayerAPIReady==true){
			ref.ready();
			return;
		    }
		    setTimeout(arguments.callee,50);	
		} catch(e) {
		    setTimeout(arguments.callee,50);    
		}
	       
	    })();	    
	}
	else {
	    this.ready();
	}
	
    	
	window.onYouTubePlayerAPIReady = function() {
	    window.ProjekktorYoutubePlayerAPIReady=true;
	}
    },
    
    applyMedia: function(destContainer) {
	
	this._setBufferState('empty');

	var ref = this,
	    width = (this.modelId=='YTAUDIO') ? 1 : '100%',
	    height = (this.modelId=='YTAUDIO') ? 1 : '100%';
	
	if (this.modelId=='YTAUDIO')
	    this.imageElement = this.applyImage(this.pp.getPoster(), destContainer);

	if (this.useIframeAPI) {

	    destContainer
		.html('')
		.append(
		    $('<div/>').attr('id', this.pp.getId()+'_media_youtube' )
		    .css({
			width: '100%',
			height: '100%',
			position: 'absolute',
			top: 0,
			left: 0
		    })		    
		);
	    var shield = $('<div/>').attr('id', this.pp.getId()+'_media_youtube_cc' )
		.css({
		    width: '100%',
		    height: '100%',
		    backgroundColor: ($p.utils.ieVersion()) ? '#000' : 'transparent',
		    filter: 'alpha(opacity = 0.1)',
		    position: 'absolute',
		    top: 0,
		    left: 0
		});
	    
	    destContainer.append(shield);
		    
	    this.mediaElement = new YT.Player( this.pp.getId()+'_media_youtube', {
		width: (this.pp.getIsMobileClient()) ? this.pp.config._width : width,
		height: (this.pp.getIsMobileClient()) ? this.pp.config._height : height,
		playerVars: {
		    autoplay: 0,
		    disablekb: 0,
		    version: 3,
		    start: 0,
		    controls: (this.pp.getIsMobileClient()) ? 1 : 0,
		    showinfo: 0,
		    enablejsapi: 1,
		    start: (this.media.position || 0),
		    origin: window.location.href,
		    wmode: 'transparent', 
		    modestbranding: 1
		},
		videoId: this.youtubeGetId(),
		events: {
		    'onReady': function(evt) {ref.onReady(evt);}, // 'onReady'+ this.pp.getId(),
		    'onStateChange': function(evt) {ref.stateChange(evt);},
		    'onError':  function(evt) {ref.errorListener(evt);}
		}
	    });
	    
	    
	} else {
	    	    	
	    var domOptions = {
		id: this.pp.getId()+"_media_youtube",
		name: this.pp.getId()+"_media_youtube",
		src: 'http://www.youtube.com/apiplayer',
		width: (this.pp.getIsMobileClient()) ? this.pp.config._width : width,
		height: (this.pp.getIsMobileClient()) ? this.pp.config._height : height,
		bgcolor: '#000000',
		allowScriptAccess:"always",
		wmode: 'transparent',
		FlashVars: {
		    enablejsapi: 1,
		    autoplay: 0,
		    version: 3,
		    modestbranding: 1,
		    showinfo: 0
		}
	    };
	    this.createFlash(domOptions, destContainer);
	}
	
    },
    
    /* OLD API - flashmovie loaded and initialized - cue youtube ID */
    flashReadyListener: function() {
	this._youtubeResizeFix();
	this.addListeners();
	this.mediaElement.cueVideoById( this.youtubeGetId(), this.media.position || 0, this._playbackQuality );
    },
    
    
    /* OLD API - workaround for youtube video resize bug: */
    _youtubeResizeFix: function() {
	/*
	$(this.mediaElement).attr({
	    width: '99.99999%',
	    height: '99.9999%'
	});
	*/
	this.applyCommand('volume', this.pp.getConfig('volume'));
    },    
  
    /* OLD API */
    addListeners: function() {
	// if (this.useIframeAPI===true) return;
	this.mediaElement.addEventListener("onStateChange", "projekktor('"+this.pp.getId()+"').playerModel.stateChange");
	this.mediaElement.addEventListener("onError", "projekktor('"+this.pp.getId()+"').playerModel.errorListener");	
	this.mediaElement.addEventListener("onPlaybackQualityChange", "projekktor('"+this.pp.getId()+"').playerModel.qualityChangeListener");
    },
    
    setSeek: function(newpos) {
        try {
	    this.mediaElement.seekTo(newpos, true);
	    if (!this.getState('PLAYING'))
		this.timeListener({position:this.mediaElement.getCurrentTime(),duration:this.mediaElement.getDuration()});
	} catch(e){}
    },
    
    setVolume: function(newvol) {	
	try {this.mediaElement.setVolume(newvol*100);} catch(e){}
    },    
    
    setPause: function(event) {
	try {this.mediaElement.pauseVideo();} catch(e){}
    },      
    
    setPlay: function(event) {
        try {this.mediaElement.playVideo();}catch(e){}	
    },

    setQuality: function(quality) {
	try{this.mediaElement.setPlaybackQuality(quality)} catch(e) {}
    },

    getVolume: function() {
        try {return this.mediaElement.getVolume();} catch(e){};
	return 0;
    },
    
    getPoster: function() {
	return this.media['config']['poster'] || this.pp.config.poster || 'http://img.youtube.com/vi/' + this.youtubeGetId() + '/0.jpg';
    },

    getPlaybackQuality: function() {
	try {return this.mediaElement.getPlaybackQuality();}catch(e){ return false;}	
    },

    getSrc: function() {
	return this.youtubeGetId() || null;
    },    
    
    errorListener: function(code) {
	switch ( (code.data==undefined) ? code : code.data ) {
	    case 100:
		this.setTestcard(500);
		break;
	    case 101:
	    case 150:
		this.setTestcard(501);
		break;
	    case 2:
		this.setTestcard(502);
		break;
	}
    },
    
    stateChange: function(eventCode) {
	// unstarted (-1), ended (0), playing (1), paused (2), buffering (3), video cued (5).
	clearTimeout(this._updateTimer);        
	if (this.mediaElement===null || this.getState('COMPLETED')) return;
	switch ((eventCode.data==undefined) ? eventCode : eventCode.data) {
	    case -1:
		this.setPlay();		
		this.ffFix = true;	
		break;
	    case 0:
                // fixing a YT API bug:
		if (this.getState('AWAKENING')) break;
                this._setBufferState('full');
		this.endedListener({});
		break;
	    case 1:
		this._setBufferState('full');
		
		if ( (this.media.position || 0) > 0 && this._isFF() && this.ffFix) {
		    this.ffFix = false;
		    this.setSeek(this.media.position);
		}
		    
		this.playingListener({});
		this.canplayListener({});
		this.updateInfo();		
		break;
	    case 2:
		this.pauseListener({});
		break;
	    case 3:
		this.waitingListener({});
		break;
	    case 5:
		if (this.useIframeAPI!==true)
		    this.onReady();		

		break;	    
	}
    },
    
    onReady: function() {
	
	this.setVolume(this.pp.getVolume());
	
	$( '#'+this.pp.getId()+'_media' )
	    .attr('ALLOWTRANSPARENCY', true)
	    .attr({scrolling:'no', frameborder: 0})
	    .css({
		'overflow': 'hidden',
		'display': 'block',
		'border': '0'
	    })
	
	if (this.media.title ||  this.pp.config.title || this.pp.getIsMobileClient() ) {
	    this.displayReady();
	    return;
	}
	
	var ref = this;

	$.ajax({
	    url: 'http://gdata.youtube.com/feeds/api/videos/'+ this.youtubeGetId() +'?v=2&alt=jsonc',
	    async: false,
	    complete: function( xhr, status) {
		
		try {
		    data = xhr.responseText;
		    if (typeof data == 'string') {
			data = $.parseJSON(data);
		    }
		    if (data.data.title) {
			ref.sendUpdate('config', {title: data.data.title + ' (' + data.data.uploader + ')'});
		    }
		} catch(e){};
		ref.displayReady();
	    }
	});	
    },
    
    youtubeGetId: function() {
	return encodeURIComponent( this.media.file[0].src.replace(/^[^v]+v.(.{11}).*/,"$1") );
    },
    
    updateInfo: function() {	
	var ref=this;	
	clearTimeout(this._updateTimer);
	(function() {
	    if(ref.mediaElement==null) {
		clearTimeout(ref._updateTimer);
		return;
	    }
	    try{
		if (ref.getState('PLAYING')) {
		    ref.timeListener({position:ref.mediaElement.getCurrentTime(),duration:ref.mediaElement.getDuration()});
		    ref.progressListener({loaded:ref.mediaElement.getVideoBytesLoaded(),total:ref.mediaElement.getVideoBytesTotal()});
                    ref._updateTimer = setTimeout(arguments.callee,500);                    
		}
	    } catch(e) {}
	    		    
	})();
    }
});

$p.newModel({
    
    modelId: 'YTAUDIO',
    iLove: [
	{ext:'youtube.com', type:'audio/youtube', platform:'flash', fixed:'maybe'}
    ]
    
}, 'YTVIDEO');
});