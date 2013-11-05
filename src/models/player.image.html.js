/*
 * this file is part of: 
 * projekktor zwei
 * http://filenew.org/projekktor/
 *
 * Copyright 2010, 2011, Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com
 * under GNU General Public License
 * http://www.filenew.org/projekktor/license/
*/
jQuery(function($) {
$p.newModel({
    
    browserVersion: "1",
    modelId: 'IMAGE',
    iLove: [
        {ext:'jpg', type:'image/jpeg', platform:'browser', streamType: ['http']},
        {ext:'gif', type:'image/gif', platform:'browser', streamType: ['http']},
        {ext:'png', type:'image/png', platform:'browser', streamType: ['http']}
    ],
    
    allowRandomSeek: true,

    _position: 0,
    _duration: 0,
    
    applyMedia: function(destContainer) {
        this.mediaElement = this.applyImage(this.media.file[0].src, destContainer.html(''));
        this._duration = this.pp.getConfig('duration') || 1;
        this._position = -1;
        this.displayReady();
        this._position = -0.5;    
    },    
    
    /* start timer */
    setPlay: function() {

        var ref = this;
    
        this._setBufferState('full');
        this.progressListener(100);
        this.playingListener();    
        
        if (this._duration==0) {
            ref._setState('completed');
            return;
        }
    
        (function() {
            if (ref._position>=ref._duration) {
                ref._setState('completed');
                return;
            }
            
            if (!ref.getState('PLAYING')) {
                return;
            }
            
            ref.timeListener({duration: ref._duration, position:ref._position});
            setTimeout(arguments.callee,200);
            ref._position += 0.2;        
        })();    
    
    },
    
    detachMedia: function() {
        this.mediaElement.remove();
    },
    
    setPause: function() {
        this.pauseListener();
    },   
            
    setSeek: function(newpos) {
        if (newpos<this._duration) {
            this._position = newpos;
            this.seekedListener()
        }
    }
    
});

$p.newModel({
    
    modelId: 'HTML',
    iLove: [
        {ext:'html', type:'text/html', platform:'browser', streamType: ['http']}
    ],
    
   applyMedia: function(destContainer) {
        var ref = this;
         
        this.mediaElement = $(document.createElement('iframe')).attr({
            "id": this.pp.getMediaId()+"_iframe",
            "name": this.pp.getMediaId()+"_iframe",
            "src": this.media.file[0].src,
            "scrolling": 'no',
            "frameborder": "0",
            'width': '100%',
            'height': '100%'
        }).css({
            'overflow': 'hidden',
            'border': '0px',
            "width": '100%',
            "height": '100%'            
        }).appendTo(destContainer.html(''));
        
        this.mediaElement.load(function(event){ref.success();});
        this.mediaElement.error(function(event){ref.remove();});
    
        this._duration = this.pp.getConfig('duration');
        
    },
    
    success: function() {   
        this.displayReady();
    },
    
    remove: function() {
        this.mediaElement.remove();        
    }    
}, 'IMAGE');
});