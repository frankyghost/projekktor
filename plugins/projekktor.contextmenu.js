/*
 * Projekktor II Plugin: Contextmenu
 *
 * under GNU General Public License
 * http://www.projekktor.com/license/
 */
var projekktorContextmenu = function(){};
jQuery(function($) {
projekktorContextmenu.prototype = {

    version: '1.1.00',
    reqVer: '1.2.13',

    _dest: null,
    _items: {},
    
    initialize: function() {
        var ref = this,
            target = this.pp.getIframeWindow() || $(window);

        this._dest = $p.utils.blockSelection(this.applyToPlayer($('<ul/>')))
        this._items['player'] = {
            getContextTitle: function() {
                return ref.getConfig('playerName') + ' V' + ref.pp.getPlayerVer();
            },
            open: function() {
                if (ref.getConfig('playerHome')!=null) {
                    target.get(0).location.href = ref.getConfig('playerHome');
                    ref.pp.setPause();
                }
            }            
        }
        
        if (this.pp.getConfig('helpHome')) {
            this._items['help'] = {
                getContextTitle: function() {
                    return ref.pp.getConfig('messages')[100]
                },
                open: function() {
                    ref.popup(ref.pp.getConfig('helpHome'), 400, 600);
                }            
            }            
        }
    
        this.pluginReady = true;
    },
   
    mousedownHandler: function(evt) {            
        switch (evt.which) {
            case 3:
                var parentOffset = this.pp.getDC().offset(),
                    yPos = (evt.pageY - parentOffset.top),
                    xPos = (evt.pageX - parentOffset.left);
                    
                if (xPos + this._dest.width() > this.pp.getDC().width())
                    xPos = this.pp.getDC().width() - this._dest.width() - 2;
                    
                if (yPos + this._dest.height() > this.pp.getDC().height())
                    yPos = this.pp.getDC().height() - this._dest.height() - 2;
                    
                this.setActive();               
                this._dest.css({
                    top: yPos + "px",
                    left: xPos+ "px"
                })
                break;
            case 1:                
                try {
                    this._items[$(evt.target).data('plugin')].open();
                } catch(e) {}
            default:               
                this.setInactive();
        }    
    },
    
    mouseleaveHandler: function() {
        this.setInactive();
    },

    eventHandler: function(evt, obj) {
        if (evt.indexOf('Contextmenu')>-1) {
            if (this._items[obj.name]==null) {
                this._items[obj.name] = obj;
            }
        }        
    },
    
    displayReadyHandler: function() {
        var ref = this,
            span = null;
        
        this.setInactive();
        this._dest.html('');        
        
        for (var i in this._items) {
        
            span = $('<span/>')
                .data('plugin', i)
                .html(this._items[i].getContextTitle() || i);
            
            try{this._items[i].setContextEntry(span);}catch(e){}
        
            $('<li/>')                
                .append(span)
                .data('plugin', i)
                .appendTo(this._dest)            
        }
    },
    
    popup: function(url, width, height) {
        centeredY = window.screenY + (((window.outerHeight/2) - (height/2)));
        centeredX = window.screenX + (((window.outerWidth/2) - (width/2)));
        window.open(url, 'projekktor', 'height=' + height +',width=' + width +',toolbar=0,scrollbars=0,status=0,resizable=1,location=0,menuBar=0'+',left=' + centeredX +',top=' + centeredY).focus();
    }
}
});
