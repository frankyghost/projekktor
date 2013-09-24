/*
 * this file is part of: 
 * projekktor zwei
 * http://www.projekktor.com
 *
 * Copyright 2010-2013 Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com
 * under GNU General Public License
 * http://www.filenew.org/projekktor/license/
*/
var projekktorPluginInterface = function(){};
jQuery(function($) {
projekktorPluginInterface.prototype = {
    
    pluginReady: false,
    reqVer: null,
    name: '',
    pp: {},
    config: {},
    playerDom: null,
    
    _appliedDOMObj: [],
    _pageDOMContainer: {},
    _childDOMContainer: {},
    
    _init: function(pluginConfig) {        
        this.config = $.extend(true, this.config, pluginConfig);
        if (this.reqVer!=null) {
            if (!$p.utils.versionCompare(this.pp.getPlayerVer(), this.reqVer)) {
                alert("Plugin '" + this.name + "' requires Projekktor v" + this.reqVer + " or later! Please visit http://www.projekktor.com and get the most recent version.");
                this.pluginReady = true;
                return;
            }
        }
        this.initialize();
    },
    
    getConfig: function(idx, defaultValue) {	
        var result = null,
                def = defaultValue || null;
    
        if (this.pp.getConfig('plugin_'+this.name)!=null) {
            result = this.pp.getConfig('plugin_'+this.name)[idx];
        }
    
        if (result==null) {
            result = this.pp.getConfig(idx);
        }
                
        if (result==null) {
            result = this.config[idx];
        }
    
        if (typeof result == 'object' && result.length === null)
            result = $.extend(true, {}, result, this.config[idx]);
            else if (typeof result == 'object') {
            result = $.extend(true, [], this.config[idx] || [], result || [] );
            }
            
        return (result==null) ? def : result;
    },
    
    getDA: function(name) {
        return 'data-' + this.pp.getNS() + '-' + this.name + '-' + name;        
    },
    
    getCN: function(name) {
        return this.pp.getNS() + name;        
    },    
    
    sendEvent: function(eventName, data) {
        this.pp._promote({_plugin:this.name, _event:eventName}, data);
    },

    deconstruct: function() {
        this.pluginReady = false;
        $.each(this._appliedDOMObj, function() {
            $(this).unbind(); 
        });
    },
    
    /**
    * applies a new dom element to the player in case it is not yet present
    * also transparently applies the cssclass prefix as configured
    * 
    * @private
    * @element (Object) the element
    * @fu (String) function, default 'container'
    * @visible (Boolean) display on init, default is 'false'
    * @return (Object) the element
    */
    applyToPlayer: function(element, fu, visible) {
        if (!element) return null;

        var func = fu || 'container',
            tmpClass = '',
            ref = this;
        
        try {tmpClass = element.attr("class") ||  this.name} catch(e){tmpClass = this.name;}

        this._pageDOMContainer[func] = $( "["+this.getDA('host')+"='" + this.pp.getId() + "']["+this.getDA('func')+"='"+func+"']" );
        this._childDOMContainer[func] = this.playerDom.find("[" + this.getDA('func') + "='" + func + "'],." + this.getCN(tmpClass) + ":not([" +this.getDA('func') +"=''])");

        // check if this element aleady exists somewhere on page        
        if ( this._pageDOMContainer[func].length > 0 ) {
            this._pageDOMContainer[func].removeClass('active').addClass('inactive');
            
            $.each(this._pageDOMContainer[func], function() {
                ref._appliedDOMObj.push($(this));
            });
            
            return this._pageDOMContainer[func];
        }
 
        // add new DOM container to the player	
        if (this._childDOMContainer[func].length==0) {
            element
                .removeClass(tmpClass)
                .addClass(this.pp.getNS()+tmpClass)
                .removeClass('active')
                .addClass('inactive')
                .attr(this.getDA('func'), func)
                .appendTo(this.playerDom);
                
            this._childDOMContainer[func] = element;
            this._appliedDOMObj.push(element);
            if (visible===true) {
                element.addClass('active').removeClass('inactive');
            }

            return element;
        } else {            
            $.each(this._childDOMContainer[func], function() {
                $(this).attr(ref.getDA('func'), func)
                ref._appliedDOMObj.push($(this));
            });
        }
            
        if (visible===true) {
            this._childDOMContainer[func].addClass('active').removeClass('inactive');
        }
    
        return $(this._childDOMContainer[func][0]);
    },

    getElement: function(name) {
        return this.pp.env.playerDom.find('.' + this.pp.getNS() + name)
    },

    setInactive: function() {
        $(this._pageDOMContainer['container']).removeClass('active').addClass('inactive');
        $(this._childDOMContainer['container']).removeClass('active').addClass('inactive');
        this.sendEvent('inactive', $.extend(true, {}, this._pageDOMContainer['container'], this._childDOMContainer['container']));
    },
    
    setActive: function(elm, on) {
        var dest = (typeof elm =='object') ? elm : this.getElement(elm);
        
        if (elm==null) {
            this._pageDOMContainer['container'].removeClass('inactive').addClass('active');
            this._childDOMContainer['container'].removeClass('inactive').addClass('active');
            this.sendEvent('active', $.extend(true, {}, this._pageDOMContainer['container'], this._childDOMContainer['container']));
            return dest;
        }
        
        if (on!=false) {
            dest.addClass('active').removeClass('inactive');
        }
        else {
            dest.addClass('inactive').removeClass('active');
        }
        
        dest.css('display', '');
        
        return dest;
    },
    
    getActive: function(elm) {        
        return $(elm).hasClass('active');
    },    
    
    // triggered on plugin-instanciation 
    initialize: function() {},
    
    isReady: function() {
        return this.pluginReady;
    },
    
    clickHandler: function(what) {
        try {
            this.pp[this.getConfig(what+'Click').callback](this.getConfig(what+'Click').value);
        } catch(e){
            try {
                    this.getConfig(what+'Click')(this.getConfig(what+'Click').value);
                } catch(e){}
        }
        return false;    
    },
    
    cookie: function (key, value, ttl) {
        if (document.cookie===undefined || document.cookie===false) return null;
        if (key==null && value!=null) return null;
        if (this.pp.getConfig('cookieExpiry')==0) return null;

        var t = new Date(),
            result = null,
            cookieString = '',
            tmp = storedData = jQuery.parseJSON(eval(result = new RegExp('(?:^|; )' + encodeURIComponent(this.getConfig('cookieName')+"_"+this.name) + '=([^;]*)').exec(document.cookie)) ? decodeURIComponent(result[1]) : null);

        if (typeof storedData!='object' || storedData==null) {
            storedData = {};
            if (key!=null)
                storedData[key] = tmp;
        }
        
        // read cookie
        if (key==null) {
            return storedData;
        }
        
        if (arguments.length==1) {
            return storedData[key];
        }
        
        if (value!=null) {
            storedData[key] = value;
        }
        else {
            delete storedData[key];
        }
      
        if ($.isEmptyObject(storedData)) {
            ttl=0;
            storedData = '';
        }
        else {
            storedData = $p.utils.stringify(storedData)      
        }
       
        // set cookie:
        t.setDate(t.getDate() + (ttl || this.getConfig('cookieExpiry', 0)));
      
        cookieString = encodeURIComponent(this.getConfig('cookieName', 'projekktor')+"_"+this.name)+'='
            +encodeURIComponent(storedData)
            +'; expires=' + ((ttl==false) ? "Thu, 01 Jan 1970 00:00:01 GMT" : t.toUTCString())
   
        if (this.getConfig('cookieDomain', false)) {
            cookieString += '; domain=' + options.domain;
        }

        document.cookie = cookieString;
        return value;
    },
    
    // important
    eventHandler: function() {}
}
});