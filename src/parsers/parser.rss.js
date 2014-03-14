jQuery(function($) {
$p.newParser({        
        parserId: 'RSS',
        
        test: function(xmlDocument) {
            var node = null;
            try {
                node = $(xmlDocument).find("rss");
                if (node.length>0) {
                    if (node.attr("version")==2) {
                        return true;
                    }
                }
                
            } catch(e) {}
            return false;
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
    });
});