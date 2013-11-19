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
    modelId: 'NA',
    iLove: [
        {ext:'NaN', type:'none/none', platform:'browser'}
    ],    
    hasGUI: true,
    
    applyMedia: function(destContainer) {
        var ref = this;

        destContainer.html('');

        var mouseClick = function(evt, player){
            if (!player.getState('AWAKENING')) {
                ref.pp.removeListener('mousedown', arguments.callee);
                ref._setState('completed');
            }
        };
        
        this.displayReady();

        if (this.pp.getConfig('enableTestcard') && !this.pp.getIsMobileClient()) {
            this.pp.addListener('mousedown', mouseClick);
            this._setState('error');
            this.setTestcard( (this.media.file[0].src!=null && this.media.errorCode===7) ? 5 : this.media.errorCode);            
        } else {
            // this.applyImage(this.media.config.poster, destContainer);
            this.applyCommand ('stop');
            window.location.href = this.media.file[0].src;            
        }

    },
    
    detachMedia: function() {
        this.pp.removeListener('leftclick', this.mouseClick);      
    }
    

});
});