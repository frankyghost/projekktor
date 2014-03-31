/*
 * Projekktor II Plugin: Contextmenu
 *
 * under GNU General Public License
 * http://www.projekktor.com/license/
 */
var projekktorRSS = function(){};
jQuery(function($) {
projekktorRSS.prototype = {
        
    version: '1.0.00',
    reqVer: '1.4.00', 
    
    initialize: function() {
        this.pluginReady = true;
    },
    
    scheduleLoadingHandler: function() {
        this.pluginReady = false;
    },
    
    scheduleLoadedHandler: function(xmlDocument) {
        var node = null;
        try {
            node = $(xmlDocument).find("rss");
            if (node.length>0) {
                if (node.attr("version")==2) {
                    this.pp.addParser(this.parse);
                }
            }
            
        } catch(e) {console.log(e)}
        this.pluginReady = true;  
    },
    
    parse: function(xmlDocument) {
        var result = {},
            itm=0;
            
        result.playlist = [];
        
        $(xmlDocument).find("item").each(function() {            
            try {
                result['playlist'].push({
                    0:{
                        src:  $(this).find('enclosure').attr('url'),            
                        type: $(this).find('enclosure').attr('type')            
                    },
                    config: {
                        poster: $(this).find('media\\:thumbnail').attr('url'),
                        title: $(this).find('title').text(),
                        desc: $(this).find('description').text()
                    }
                });
            } catch(e){}
        });
        
        return result;
    }
}
});