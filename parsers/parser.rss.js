function(xmlDocument) {
     var result = {};
     var regMatch = new RegExp("http:[^ ,]+\.jpg");
     result['playlist'] = [];
     $(xmlDocument).find("item").each(function() {
        try {
         result['playlist'].push({
            0:{
             src: $(this).find('link').text(),            
             type: 'video/youtube'
            },
            config: {
             poster: regMatch.exec(unescape( $(this).find('description').text())),
             title: $(this).find('title').text(),
             desc: $(this).find('description').text()
            }
         });
        } catch(e){}
     });
     return result;
    }
});