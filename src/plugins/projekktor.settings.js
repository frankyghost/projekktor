/*
 * Projekktor II Plugin: Settings Service Menu
 *
 * under GNU General Public License
 * http://www.projekktor.com/license/
 */
var projekktorSettings = function(){};
jQuery(function($) {
projekktorSettings.prototype = {

    reqVer: '1.4.00',
    version: '1.0.00',

    _contextEntry: null,
    _nativeIdx: 0,
    _flashIdx: 0, 

    pluginReady: false,
    
    config: {
        contextTitle: 'Settings',
        settingsMenu:
            '<ul id="tool" class="ppsettingslist active">' +
                '<li class="first">%{help}</li>' +
                '<li data-pp-settings-func="tool_help" class="inactive">%{keyboard controls}</li>' +
                '<li data-pp-settings-func="tool_debug" class="inactive">%{debug}</li>' +
                '<li data-pp-settings-func="tool_version" class="inactive">%{player info}</li>' +
                '<li></li>' +
            '</ul>' +
            '<ul id="platform" class="ppsettingslist active">' +
                '<li class="first">%{platform}</li>' +
                '<li data-pp-settings-func="platform_flash" class="inactive">%{flash}</li>' +
                '<li data-pp-settings-func="platform_native" class="inactive">%{html5}</li>' +
                '<li data-pp-settings-func="platform_vlc" class="inactive">%{vlc}</li>' +
                '<li data-pp-settings-func="platform_auto" class="auto inactive">%{automatic}</li>' +
            '</ul>' +
            '<ul id="quality" class="ppsettingslist active">' +
                '<li class="first">%{quality}</li>' +
                '<li data-pp-settings-func="quality_l"  class="inactive">%{high}</li>' +
                '<li data-pp-settings-func="quality_m"  class="inactive">%{medium}</li>' +
                '<li data-pp-settings-func="quality_s"  class="inactive">%{low}</li>' +
                '<li data-pp-settings-func="quality_auto"  class="auto inactive">%{automatic}</li>' +
            '</ul>' +
            '<div class="ppclear"></div>',
            
        versionTpl:
            '<div data-pp-settings-func="toolwindow_version">' +
                '<p>Projekktor V%{version}</p>' + 
                '<p><a class="btn cancel" href="#">%{ok}</a></p>' + 
            '</div>',
            
            
        debugTpl:
            '<div data-pp-settings-func="toolwindow_debug">' + 
                '<div class="wizzard inactive" id="debug_1">' + 
                    '<p><b>%{report}</b></p>' + 
                    '<p><textarea id="message">%{please}</textarea></p>' + 
                    '<p>' + 
                        '<a class="btn cancel" href="#">%{cancel}</a>' + 
                        '<a class="btn next" data-step="2" href="#">%{continue}</a>' + 
                    '</p>' + 
                '</div>' + 
                '<div class="wizzard inactive" id="debug_2">' + 
                    '<p><b>%{sendto}</b></p>' + 
                    '<p><textarea id="result">%{please}</textarea></p>' + 
                    '<p><a class="btn next" href="#" data-step="3">%{ok}</a></p>' + 
                '</div>' + 
                '<div class="wizzard inactive" id="debug_3">' + 
                    '<p>%{thanks}</p>' + 
                    '<p><a class="btn cancel" href="#">%{ok}</a></p>' + 
                '</div>' + 
            '</div>' + 
            '<div data-pp-settings-func="toolwindow_error">' + 
                '<div class="wizzard inactive" id="error_1">' + 
                    '<p><b>%{error}<br/> %{sendto}</b></p>' + 
                    '<p><textarea id="errortxt"></textarea></p>' + 
                    '<p><a class="btn next" href="#" data-step="3">%{ok}</a></p>' + 
                '</div>' + 
                '<div class="wizzard inactive" id="error_2">' + 
                    '<p>%{thanks}</p>' + 
                    '<p><a class="btn cancel" href="#">%{ok}</a></p>' + 
                '</div>' + 
            '</div>',
        
        helpTpl:
            '<div data-pp-settings-func="toolwindow_help">' +
                '<p><b>%{keyboard assignments}</b></p>' +
                '<p class="key">%{help1}</p>' +
                '<p class="key">%{help2}</p>' +
                '<p class="key">%{help3}</p>' +
                '<p>%{help4}</p>' +
                '<p><a class="btn cancel" href="#">%{ok}</a></p>' +
            '</div>' 

    },

    initialize: function() {

        var ref = this,
            _outDelay = 0;

        // button, main container and options
        this.dest = this.applyToPlayer($('<div/>').addClass('settingsmenu').html(this.i18n(this.getConfig('settingsMenu'))));
        this.btn = this.applyToPlayer($('<div/>').addClass('settingsbtn'), 'btn');
        this.tool = this.applyToPlayer($('<div/>').addClass('tool'), 'toolwindow');

        // the platforms hack
        this.platformSet();

        this.setActive(this.btn, true);

        // hide menu
        this.setInactive();
        $p.utils.blockSelection(this.dest);

        // fade in / out
        this.dest.bind('mouseleave', function() {
            clearTimeout(_outDelay);
            _outDelay=setTimeout(function(){
                ref.setInactive();
            } , 200);
        });

        this.dest.bind('mouseenter', function() {
            clearTimeout(_outDelay);
        });

        // enable "settings" button
        this.btn.click(function(evt) {
            if (ref.dest.hasClass('active')) {
                ref.setInactive();
            } else {
                ref.setActive();
            }
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });

        this.btn.bind('mouseleave', function() {
            $(this).blur();
            clearTimeout(_outDelay);
            _outDelay=setTimeout(function(){
                ref.setInactive();
            } , 200);
        });

        this.btn.bind('mouseenter', function() {
            clearTimeout(_outDelay);
        });
 
        this.pluginReady = true;
    },

    optionSelect: function(dest, func, value) { 
        // visual feedback
        if (this[func + 'Set'](value)===true) {
            dest.parent().find('li').each(function() { 
                if (!$(this).hasClass('first')) {
                    $(this).addClass('off').removeClass('on');
                }
            });
            dest.addClass('on').removeClass('off');
        }
        // set automode: delete cookie
    },

    itemHandler: function() {
        var ref = this,
            pCount = 0,
            menuOptions = [];    

        $.each(this.dest.find("[" + this.getDA('func') + "]"), function() {
            var func = $(this).attr(ref.getDA('func')).split('_');

            if (menuOptions[func[0]]==null) {
                menuOptions[func[0]] = [];
            }

            // check
            if (!ref[func[0] + 'Check'](func[1]) && func[1]!='auto') {
                $(this).addClass('inactive').removeClass('active');
                // return true;
            } else {
                $(this).addClass('active').removeClass('inactive');
            }

            menuOptions[func[0]].push(func[1]);

            // visual feedback custom settings
            if (ref.cookie(func[0])==func[1] || ( (ref.cookie(func[0])===false || ref.cookie(func[0])==null) && func[1]=='auto')) {
                $(this).addClass('on').removeClass('off');
            }
            else {
                $(this).addClass('off').removeClass('on');
            }

            $(this).click(function(evt) {
                ref.optionSelect($(this), func[0], func[1]); 
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            }); 

            return true;
        });

        // restore presets:
        for (var i in menuOptions) {
            
            if (menuOptions[i].length<3) {
                this.dest.find('#' + i).addClass('inactive').removeClass('active');
            } else {
                this.dest.find('#' + i).addClass('active').removeClass('inactive');
                this[i + 'Set']();
                pCount++;
            }
        }

        // apply "columns" class
        var classes = this.dest.attr("class").split(" ").filter(function(item) {
            return item.lastIndexOf("column", 0) !== 0;
        });
        this.dest.attr("class", classes.join(" "));        
        this.dest.addClass('column' + pCount);

    },

    /*****************************************************
     * Player Event Handlers
     * **************************************************/     
    plugin_controlbarHideHandler: function(controlBar) {
        this.setInactive();
        this.btn.addClass('off').removeClass('on');
    },
    
    availableQualitiesChangeHandler: function(qualities) {
        this.qualitySet();
        this.itemHandler();
    },
    
    errorHandler: function(code) {
        var msg = this.pp.getConfig('messages')[code];
        this.toolSet('error', 1, msg);
    },

    /*****************************************************
     * availability checks
     * **************************************************/
    toolCheck: function(value) {
        return true;
    },

    qualityCheck: function(value) {
        if ($.inArray(value, this.pp.getPlaybackQualities())==-1) {
            return false;
        }
        return true;
    },

    platformCheck: function(value) {
        if ($.inArray(value.toLowerCase(), this.pp.getPlatforms())==-1) return false;
        return true;
    },

    /*****************************************************
     * Config SETTERS
     * **************************************************/
    toolSet: function(func, stp, data) {

        var tpl = this.applyToPlayer($('<div/>'), 'toolwindow_' + func),
            step = stp || 1,
            ref = this,
            isPlaying = this.pp.getState('PLAYING');
        
        tpl.html(this.i18n(this.getConfig(func + 'Tpl')));
        
        this.tool.html($p.utils.parseTemplate(tpl.html(), this.pp.config) );
        this.tool.find('.wizzard').addClass('inactive').removeClass('active');
        this.tool.find('#' + func + '_' + step).addClass('active').removeClass('inactive');
        this.setActive(this.tool);

        if (data==null) {
            this.tool.find('#message').focus(function(){
                $(this).html('').unbind('focus').css({color:'#000'});
            });
            this.tool.find('#message').css({color:'#aaa'});
        } else {
            var debugData = {
                version: this.pp.getPlayerVer(),
                message: data,
                timestamp: new Date().getTime(),
                navigator: navigator.userAgent.toLowerCase(),
                iframe: location.href,
                href: window.parent.location.href,
                modelstate: this.pp.getState(),
                duration: this.pp.getDuration(),
                position: this.pp.getPosition(),
                maxposition: this.pp.getMaxPosition(),
                platforms: this.pp.getPlatforms(),
                platform: this.pp.getPlatform(),
                platformscfg: this.pp.config._platforms,
                plugins: this.pp.config._plugins,
                media: this.pp.media,                
                compTable: this.pp._testMediaSupport(),
                rnd: $p.utils.randomId(22)
            };
            $.each(this.pp.config._platforms, function(key, value) {
                debugData[value + 'ver'] = $p.platforms[value.toUpperCase()]();
            });
            this.tool.find((func=='debug') ? '#result' : '#errortxt')
                .attr({readonly: 'readonly'})
                .val(
                    $p.utils.stringify(debugData)
                )
                .unbind()
                .bind('focus', function() {$(this).select();});
        }

        $(this.pp.getDC().find('.next')).click(function() {
            $(this).unbind();
            ref.toolSet('debug', parseInt($(this).attr('data-step'), 10), ref.tool.find('#message').val() );
            return false;
        });

        $(this.pp.getDC().find('.cancel')).click(function() {
            $(this).unbind();
            ref.setActive(ref.tool, false);
            if (isPlaying) ref.pp.setPlay();
            return false;
        });

        this.tool.css({
            margin: '-'+ (this.tool.outerHeight()/2) + 'px 0 0 -'+ (this.tool.outerWidth()/2) + 'px'
        });

        if (this.pp.getConfig('streamType').toUpperCase().indexOf('LIVE')==-1 && func!=null) {
            this.pp.setPause();
        }

        this.setInactive();
        return false;
    },


    qualitySet: function(val) {

        var value = val || this.cookie('quality') || null;

        if (value=='auto' || !this.qualityCheck(value)) {
            this.cookie('quality', false, true);
            this.pp.setPlaybackQuality(this.pp.getAppropriateQuality());
            return true;
        }

        if (value!==null) {
            this.cookie('quality', value);
            this.pp.setPlaybackQuality(value);
        }

        return true;
    },

    platformSet: function(val) {
        var platforms = this.pp.getConfig('platforms'),
            value = val || this.cookie('platform') || null,
            tmp = platforms[0],
            ref = this,
            pos = ref.pp.getPosition(),
            old = $.inArray(value, platforms);

        if (value=='auto') {
            this.cookie('platform', false, true);
            this.pp.reset();
            return null;
        }

        if (value==null) return null; // bullshit
        if (old==-1 || old===0) return null; // bullshit or already is prefered


        platforms[0] = value;
        platforms[old] = tmp;
        this.pp.config._platforms = platforms;


        if (val!=null) {
            this.cookie('platform', value);
            this.pp.reset();
            this.pp.setPlay();
            setTimeout(function() {ref.pp.setPlayhead(pos);}, 500);
            return true;
        }

        return true;
    },
    
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
    
        input = this._utf8_encode(input);
    
        while (i < input.length) {
    
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
    
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
    
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
    
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    
        }
    
        return output;
    },
    
    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
    
        for (var n = 0; n < string.length; n++) {
    
            var c = string.charCodeAt(n);
    
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
    
        }
    
        return utftext;
    }
};
});
