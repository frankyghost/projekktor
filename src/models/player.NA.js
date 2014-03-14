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
        {ext:'NaN', type:'none/none', platform: 'browser'}
    ],    
    hasGUI: true,
    
    applyMedia: function(destContainer) {
        var ref = this;

        destContainer.html('');
        this.displayReady();

        this.sendUpdate( 'error', (this.media.file[0].src!=null && this.media.errorCode===7) ? 5 : this.media.errorCode );
        
        if (!this.pp.getConfig('enableTestcard')) {
            window.location.href = this.media.file[0].src;      
        }
    }
});
});