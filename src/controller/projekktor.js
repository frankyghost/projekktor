/*
 * this file is part of
 * projekktor zwei
 * http://www.projekktor.com
 *
 * Copyright 2010-2013, Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com
 * under GNU General Public License
 * http://www.projekktor.com/license/
 * ,------------------------------------------,      .    _  .
 * |  Naaah, love shines through !!1          |      |\_|/__/|
 * |------------------------------------------|     / / \/ \  \
 *                                           \     /__|O||O|__ \
 *                                             \  |/_ \_/\_/ _\ |
 *                                                | | (____) | ||
 *                                                \/\___/\__/  //
 *                                                (_/         ||
 *                                                 |          ||
 *                                                 |          ||\
 *                                                  \        //_/
 *                                                   \______//
 *                                                 __ || __||
 *                                                (____(____)
 */
jQuery(function($) {
var projekktors = [];

// apply IE8 html5 fix - thanx to Remy Sharp - http://remysharp.com/2009/01/07/html5-enabling-script/
if (!!document.createElement('video').canPlayType) {
    (function(){
        if(!/*@cc_on!@*/0) return;
        var e = "audio,video,track,source".split(',');
        for(var i=0;i<e.length;i++) {
            document.createElement(e[i]);
        }
    }
    )();
}

// this object is returned in case multiple player's are requested
function Iterator(arr) {
    this.length = arr.length;
    this.each = function(fn) {$.each(arr, fn);};
    this.size = function() {return arr.length;};
};

// make sure projekktor works with jquery 1.3, 1.4, 1.5, 1.6:
if (!$.fn.prop) {
    $.fn.prop = function(arga, argb) {
        return $(this).attr(arga, argb);
    };
}
    
projekktor = $p = function() {

    var arg = arguments[0],
        instances = [],
        plugins = [];

    if (!arguments.length) {
        return projekktors[0] || null;
    }

    // get instances
    // projekktor(idx:number);
    if (typeof arg == 'number') {
        return projekktors[arg];
    }

    // by string selection unqiue "id" or "*"
    if (typeof arg == 'string') {
    
        // get all instances
        if (arg == '*') {
            return new Iterator(projekktors);
        }

        // get instance by Jquery OBJ, 'containerId' or selector
        for (var i=0; i<projekktors.length; i++) {
            try {
                if (projekktors[i].getId() == arg.id) {
                    instances.push(projekktors[i]);
                    continue;
                }
            } catch(e){}
            try {
                for (var j=0; j<$(arg).length; j++) {
                    if (projekktors[i].env.playerDom.get(0)==$(arg).get(j)) { instances.push(projekktors[i]); continue; }
                }
            } catch(e){}
            try {
                if (projekktors[i].getParent() == arg) {
                    instances.push(projekktors[i]);
                    continue;
                }
            } catch(e){}
            try {
                if (projekktors[i].getId() == arg) {
                    instances.push(projekktors[i]);
                    continue;
                }
            } catch(e){}
        }
    
        if (instances.length>0) {
            return (instances.length==1) ? instances[0] : new Iterator(instances);
        }
    }

    // build instances
    if (instances.length===0) {
        var cfg = arguments[1] || {},
            callback = arguments[2] || {},
            count=0,
            playerA;
            
        if (typeof arg == 'string') {
            $.each($(arg), function() {
                playerA = new PPlayer($(this), cfg, callback);
                projekktors.push(playerA);
                count++;
            });
            return (count>1) ? new Iterator(projekktors) : playerA;
            // arg is a DOM element
        } else if (arg) {
            projekktors.push(new PPlayer(arg, cfg, callback));
            return new Iterator(projekktors);
        }
    }

    return null;

    function PPlayer(srcNode, cfg, onReady) {

    this.config = new projekktorConfig('1.3.09');

    this.env = {
        muted: false,
        playerDom: null,
        mediaContainer: null,
        agent: 'standard',
        mouseIsOver: false,
        loading: false,  // important
        className: '',
        onReady: onReady
    };

    this.media = [];
    this._plugins = [];
    this._pluginCache = {};
    this._queue = [];
    this._cuePoints = {};
    this.listeners = [];
    this.playerModel = {};
    this._isReady = false;
    this._maxElapsed = 0;
    this._currentItem = null;
    this._playlistServer = '';
    this._id = '';


    /* apply incoming playlistdata  */
    this._reelUpdate = function(obj) {
        var ref = this,
            itemIdx = null,
            data = obj || [{}],
            files = data.playlist || data;

        this.env.loading = true;
        this.media = [];

        // gather and set alternate config from reel:
        try {         
            for(var props in data.config) {
                if (data.config.hasOwnProperty(props)) {
                    if (typeof data.config[props].indexOf('objectfunction')>-1) {
                        continue; // IE SUCKZ
                    }
                    this.config[props] = eval( data.config[props] );
                }
            }
                
            if (data.config!=null) {
                $p.utils.log('Updated config var: '+props+' to '+this.config[props]);
                this._promote('configModified');
                delete(data.config);
            }                
        } catch(e) {}

        // add media items
        $.each(files, function() {  
            itemIdx = ref._addItem(ref._prepareMedia({file:this, config:this.config || {}, errorCode: this.errorCode || 0}));      
            // set cuepoints from reel:
            $.each(this.cuepoints || [], function() {
                this.item = itemIdx;                    
                ref.setCuePoint(this);        
            });            
        });
    
        if (itemIdx===null) {
            this._addItem(this._prepareMedia({file:'', config:{}, errorCode: 97}));
        }

        this.env.loading = false;
        this._promote('scheduled', this.getItemCount());
        this._syncPlugins(function(){ref.setActiveItem(0);});     
    };


    this._addItem = function(data, idx, replace) {
        var resultIdx = 0;
        
        // replace "error dummy" if any:
        if (this.media.length===1 && this.media[0].mediaModel=='NA') {
            this._detachplayerModel();
            this.media = [];
        }

        // inject or append:
        if (idx===undefined || idx<0 || idx>this.media.length-1) {
            this.media.push(data);
            resultIdx = this.media.length-1;
        } else {
            this.media.splice(idx, (replace===true) ? 1 : 0,data);
            resultIdx = idx;
        }

        // report schedule modifications after initial scheduling only:
        if (this.env.loading===false) {
            this._promote('scheduleModified', this.getItemCount());
        }
        
        return resultIdx;
    };

    this._removeItem = function(idx) {
        var resultIdx = 0;

        if (this.media.length===1) {
            // keep "error dummy", nothing to do:
            if (this.media[0].mediaModel=='NA') {
                return 0;
            } else {
                // replace last one with "error dummy"
                this.media[0] = this._prepareMedia({file:''});
                return 0;
            }
        }

        if (idx===undefined || idx<0 || idx>this.media.length-1) {
            this.media.pop();
            resultIdx = this.media.length;
        }
        else {
            this.media.splice(idx, 1);
            resultIdx = idx;
        }

        if (this.env.loading===false) {
            this._promote('scheduleModified', this.getItemCount());
        }

        return resultIdx;
    };

    this._canPlay = function(mediaType, platform, streamType) {
        var ref = this,
            checkIn = [],
            checkFor = [],
            st = streamType || 'http',
            pltfrm = (typeof platform=='object') ? platform : [platform],
            type = (mediaType) ? mediaType.replace(/x-/, '') : undefined,
            tm = ref._testMediaSupport();

        $.each(pltfrm, function(nothing, plt) {
            $.each($.extend(tm[st], tm['*'] || []) || [], function(thisPlatform, val) {
                if (plt!=null) {
                    if (thisPlatform!=plt) {
                        return true;
                    }
                }
                checkIn = $.merge(checkIn, this);
                return true;
            });
        });

        if (checkIn.length===0) {
            return false;
        }

        switch (typeof type) {
            case 'undefined':
                return checkIn.length>0;
            case 'string':                    
                if (type=='*')
                    return checkIn;
                checkFor.push(type);
                break;
            case 'array':
                checkFor = type;
                break;
        }

        for(var i in checkFor) {
            if ($p.mmap.hasOwnProperty(i)) {
                if (typeof checkFor[i] !== 'string') break;
                if ($.inArray( checkFor[i], checkIn)>-1) {
                    return true;
                }
            }
        }

        return false;
    };    
    
    /* apply available data and playout models */
    this._prepareMedia = function(data) {
        var ref = this,
            types = [],
            mediaFiles = [],
            qualities = [],
            extTypes = {},
            typesModels = {},
            modelSets = [],
            result = {},
            extRegEx = [],
            bestMatch = 0;

        // build regex string and filter dublicate extensions and more ...        
        for(var mmapIndex in $p.mmap ) {
            if ($p.mmap.hasOwnProperty(mmapIndex)) {
                platforms = (typeof $p.mmap[mmapIndex].platform=='object') ? $p.mmap[mmapIndex].platform : [ $p.mmap[mmapIndex].platform ];
                $.each(platforms, function(_na, platform) {
                    var k = 0,
                        streamType = 'http';
              
                    for (var j in data.file) {
                        if (data.file.hasOwnProperty(j)) {
                            if (j==='config') continue;
                            streamType = data.file[j].streamType || ref.getConfig('streamType') || 'http';

                            if ( ref._canPlay($p.mmap[mmapIndex].type, platform, streamType) ) {
                                k++;
                            }
                            
                            // this platform does not support any of the provided streamtypes:
                            if (k===0) {
                                continue;
                            }
                     
                            // set priority level
                            $p.mmap[mmapIndex].level = $.inArray(platform, ref.config._platforms);
                            $p.mmap[mmapIndex].level = ($p.mmap[mmapIndex].level<0) ? 100 : $p.mmap[mmapIndex].level;
                           
                            // upcoming fun:
                            extRegEx.push( '.'+$p.mmap[mmapIndex].ext );
                            
                            // build extension2filetype map
                            if (!extTypes[$p.mmap[mmapIndex].ext]) {
                                extTypes[$p.mmap[mmapIndex].ext] = [];
                            }                            
                            extTypes[$p.mmap[mmapIndex].ext].push( $p.mmap[mmapIndex] );
                            
                            if ($p.mmap[mmapIndex].streamType===null || $p.mmap[mmapIndex].streamType=='*' || $.inArray(streamType  || [], $p.mmap[mmapIndex].streamType || '')>-1) {

                                if (!typesModels[$p.mmap[mmapIndex].type]) {
                                    typesModels[$p.mmap[mmapIndex].type] = [];
                                }

                                k = -1;
                                for(var ci = 0, len = typesModels[$p.mmap[mmapIndex].type].length; ci < len; ci++) {                           
                                    if (typesModels[$p.mmap[mmapIndex].type][ci].model == $p.mmap[mmapIndex].model) {
                                       k = ci;
                                       break;
                                    }
                                }                                

                                if (k===-1) {
                                    typesModels[$p.mmap[mmapIndex].type].push( $p.mmap[mmapIndex] );                        
                                }
                                
                            }
                            continue;
                        }
                    }
                    return true;
                });                
            }
           
        }
        extRegEx = '^.*\.(' + extRegEx.join('|') + ")$";

        // incoming file is a string only, no array
        if (typeof data.file=='string') {
            data.file = [{'src':data.file}];
            if (typeof data.type=='string') {
                data.file = [{'src':data.file, 'type':data.type}];
            }
        }

        // incoming file is ... bullshit
        if ($.isEmptyObject(data) || data.file===false || data.file === null) {
            data.file = [{'src':null}];
        }

        for(var index in data.file) {
            if (data.file.hasOwnProperty(index)) {
                // meeeep
                if (index=='config') continue;
        
                // just a filename _> go object
                if (typeof data.file[index]=='string') {
                    data.file[index] = {'src':data.file[index]};
                }

                // nothing to do, next one
                if (data.file[index].src==null) {
                    continue;
                }
        
                // get file extension:
                /**
                try {
                    data.file[index].ext = data.file[index].src.match( new RegExp(extRegEx))[1];
                    data.file[index].ext = (!data.file[index].ext) ? 'NaN' : data.file[index].ext.replace('.','');
                } catch(e) { data.file[index].ext='NaN'; }
                */
     
                // if type is set, get rid of the codec mess
                if ( data.file[index].type!=null && data.file[index].type!=='') {
                    try {
                        var codecMatch = data.file[index].type.split(' ').join('').split(/[\;]codecs=.([a-zA-Z0-9\,]*)[\'|\"]/i);
                        if (codecMatch[1]!=null) {
                            data.file[index].codec = codecMatch[1];                
                        }
                        data.file[index].type = codecMatch[0].replace(/x-/, '');
                        data.file[index].originalType = codecMatch[0];
                    } catch(e){}
                }
                else {
                    data.file[index].type = this._getTypeFromFileExtension( data.file[index].src );
                }
        
                if (typesModels[data.file[index].type] && typesModels[data.file[index].type].length>0) {
                      
                    typesModels[data.file[index].type].sort(function(a, b) {
                            return a.level - b.level;
                    });
               
                    modelSets.push(typesModels[data.file[index].type] [0]);
                }
            }
        }

        if (modelSets.length===0) {
            modelSets = typesModels['none/none'];
        }
        else {
            
            // find highest priorized playback model
            modelSets.sort(function(a, b) {
                return a.level - b.level;
            });

            bestMatch = modelSets[0].level;
            
            modelSets = $.grep(modelSets, function(value) {
                return value.level == bestMatch;
            });
        }

        types = [];
        $.each(modelSets || [], function() {
            types.push(this.type);
        });
            

        var modelSet = (modelSets && modelSets.length>0) ? modelSets[0] : {type:'none/none', model: 'NA', errorCode:11};

        types = $p.utils.unique(types);

        for (index in data.file) {
            if (data.file.hasOwnProperty(index)) {
            
                // discard files not matching the selected model
                if (data.file[index].type==null)
                    continue;
                
                if ( ($.inArray( data.file[index].type.replace(/x-/, ''), types)<0) && modelSet.type!='none/none') {
                    continue;
                }
                
                // make srcURL absolute for non-RTMP files
                if ($.isEmptyObject(data.config) || data.config.streamType==null || data.config.streamType.indexOf('rtmp')==-1) {
                    data.file[index].src = $p.utils.toAbsoluteURL(data.file[index].src);
                }
     
                // set "default" quality
                if ( data.file[index].quality==null)
                    data.file[index].quality = 'default';
                
                // add this files quality key to index
                qualities.push(data.file[index].quality)
                
                // add media variant
                mediaFiles.push(data.file[index])        
            }
        }         
       
        if (mediaFiles.length===0) {
            mediaFiles.push({src:null, quality:"default"});
        }
  
        // check quality index against configured index:
        var _setQual = [];
        $.each(this.getConfig('playbackQualities'), function() {
            _setQual.push(this.key || 'default');
        });
            
        result = {
            ID: data.config.id || $p.utils.randomId(8),
            cat: data.config.cat || 'clip',
            file: mediaFiles,
            platform: modelSet.platform,
            platforms: platforms,
            qualities: $p.utils.intersect($p.utils.unique(_setQual), $p.utils.unique(qualities)),
            mediaModel: modelSet.model || 'NA', 
            errorCode: modelSet.errorCode || data.errorCode || 7,   
            config:  data.config || {}                   
        }

        return result;
    };

    /* media element update listener */
    this._modelUpdateListener = function(type, value) {
        var ref = this;

        if (!this.playerModel.init) return;
        if (type!='time' && type!='progress') {
            $p.utils.log("Update: '"+type, this.playerModel.getSrc(), this.playerModel.getModelName(), value);
        }

        switch(type) {
            case 'state':
            
                this._promote('state', value); // IMPORTANT: STATES must be promoted first!
                
                var classes = $.map(this.getDC().attr("class").split(" "), function(item) {
                    return item.indexOf(ref.getConfig('ns') + "state") === -1 ? item : "";
                });                    
                classes.push(this.getConfig('ns') + "state" + value.toLowerCase() );
                this.getDC().attr("class", classes.join(" "));
                                        
                switch (value) {
                    case 'AWAKENING':
                        var modelRef = this.playerModel;
                        this._syncPlugins(function() {
                        if (modelRef.getState('AWAKENING'))
                            modelRef.displayItem(true);
                        });
                        break;
        
                    case 'ERROR':
                        this._addGUIListeners();
                        break;
        
                    case 'STOPPED':
                        this._promote('stopped', {});
                        break;
        
                    case 'PAUSED':
                        if (this.getConfig('disablePause')===true) {
                        this.playerModel.applyCommand('play', 0);
                        }
                        break;
        
                    case 'COMPLETED':                           
                        // all items in PL completed:
                        if (this._currentItem+1>=this.media.length && !this.getConfig('loop')) {
                            this._promote('done', {});
                            if (this.getConfig('leaveFullscreen')) {
                                this.reset(); // POW, crowba-method for Firefox!
                                return;
                            }
                        }
                        // next one, pls:
                        this.setActiveItem('next');
                        break;
                }
                break;

            case 'modelReady':
                this._maxElapsed = 0;
                this._promote('item', ref._currentItem);
                break;

            case 'displayReady':
                this._promote('displayReady', true);
                modelRef = this.playerModel;
                this._syncPlugins(function() {
                ref._promote('ready');
                ref._addGUIListeners();
                if (!modelRef.getState('IDLE'))
                    modelRef.start();
                });
            break;
            
            case 'availableQualitiesChange':
                this.media[this._currentItem].qualities = value;
                this._promote('availableQualitiesChange', value);            
                break;

            case 'qualityChange':
                this.setConfig({playbackQuality: value});            
                this._promote('qualityChange', value);
                break;
                
                /*
                case 'durationChange':
                    console.log( this.getConfig('start')>0, this.playerModel.allowRandomSeek )
                    if (this.playerModel.allowRandomSeek==true) {
                        if (this.getConfig('start')>0) {
                            console.log("setPLay")
                            this.setPlayhead(this.getConfig('start'));
                            this.setConfig({start: 0});
                        }
                    }
                    console.log( this.getConfig('start') )
                    break;
                */
                
            case 'volume':
                this.setConfig({volume: value});
                this._promote('volume', value);
    
                if (value<=0) {
                    this.env.muted = true;
                    this._promote('mute', value);
                } else if (this.env.muted===true) {
                    this.env.muted = false;
                    this._promote('unmute', value);
                }
                break;

            case 'playlist':
                this.setFile(value.file, value.type);
                break;
    
            case 'config':
                this.setConfig(value);
                break;
            
            case 'time':
                // track quartiles
                if (this._maxElapsed<value) {
                    var pct = Math.round(value * 100 / this.getDuration()),
                        evt=false;
                    
                    if (pct < 25) {pct=25;}
                    if (pct > 25 && pct < 50) {evt='firstquartile'; pct=50;}
                    if (pct > 50 && pct < 75) {evt='midpoint'; pct=75;}
                    if (pct > 75 && pct < 100) {evt='thirdquartile'; pct=100;}
                    
                    if (evt!==false) this._promote(evt, value);
                    this._maxElapsed = (this.getDuration() * pct / 100);
                }
                this._promote(type, value);
                break;
    
            case 'fullscreen':
                if (value===true) {
                    this.getDC().addClass('fullscreen');
                    this._enterFullViewport();
                }
                else {
                    this.getDC().removeClass('fullscreen');
                    this._exitFullViewport();
                }
                this._promote(type, value);
                break;
                
            case 'error':
                this._promote(type, value);
                if (this.getConfig('skipTestcard') && this.getItemCount() > 1) {        
                   this.setActiveItem('next');
                } else {                
                    this.playerModel.applyCommand("error", value);
                    this._addGUIListeners();                      
                }
                break;
                                          
            case 'streamTypeChange':
                if (value=='dvr') {
                    this.getDC().addClass(this.getNS() + 'dvr');
                }
                this._promote(type, value);
                break;
            default:                    
                this._promote(type, value);
                break;                
        }

    };

    this._syncPlugins = function(callback) {
        // wait for all plugins to re-initialize properly
        var ref = this;        
        this.env.loading = true;
        (function() {
            try{
                if (ref._plugins.length>0) {
                    for(var i=0; i<ref._plugins.length; i++) {
                        if (!ref._plugins[i].isReady()) {
                            setTimeout(arguments.callee,50);
                            return;
                        }
                    }
                }
                        
                ref.env.loading = false;
                ref._promote('pluginsReady', {});

                try {callback();}catch(e){}
            } catch(e) {}
        })();
    };

    this._MD = function(event) {
        projekktor('#'+event.currentTarget.id.replace(/_media$/,''))._playerFocusListener(event);
    };

    /* attach mouse-listeners to GUI elements */
    this._addGUIListeners = function() {
        var ref = this;
        
        this._removeGUIListeners();

        if (this.getDC().get(0).addEventListener) {
            this.getDC().get(0).addEventListener("mousedown", this._MD, true);
        }
        else {
            // IE *sigh*
            this.getDC().mousedown(function(event){ref._playerFocusListener(event);});
        }
        
        this.getDC()
            .mousemove(function(event){ref._playerFocusListener(event);})
            .mouseenter(function(event){ref._playerFocusListener(event);})
            .mouseleave(function(event){ref._playerFocusListener(event);})
            .focus(function(event){ref._playerFocusListener(event);})
            .blur(function(event){ref._playerFocusListener(event);});
            // .bind('touchstart', function(){ref._MD})
        
        $(window)
            .bind('resize.projekktor'+this.getId(), function() {ref.setSize();})
            .bind('touchstart', function(){ref._windowTouchListener(event);});

        if (this.config.enableKeyboard===true) {
            $(document).unbind('keydown.pp'+this._id);
            $(document).bind('keydown.pp'+this._id, function(evt){
                ref._keyListener(evt);
            });
        }
        
    };

    /* remove mouse-listeners */
    this._removeGUIListeners = function() {
        $("#"+this.getId()).unbind();
        this.getDC().unbind();

        if (this.getDC().get(0).removeEventListener) {
            this.getDC().get(0).removeEventListener("mousedown", this._MD, true);
        }
        else {
            this.getDC().get(0).detachEvent('onmousedown', this._MD);
        }

        $(window).unbind('resize.projekktor'+this.getId());
    };

    /* add plugin objects to the bubble-event queue */
    this._registerPlugins = function() {
        var plugins = $.merge($.merge([],this.config._plugins), this.config._addplugins),
        pluginName = '',
        pluginObj = null;

        // nothing to do
        if (this._plugins.length>0 || plugins.length===0) {
            return;
        }
        for(var i=0; i<plugins.length; i++) {
            pluginName = "projekktor"+plugins[i].charAt(0).toUpperCase() + plugins[i].slice(1);
            try {typeof eval(pluginName);} catch(e) {alert("Projekktor Error: Plugin '" + plugins[i] + "' malicious or not available."); continue;}
        
            pluginObj = $.extend(true, {}, new projekktorPluginInterface(), eval(pluginName).prototype);
            pluginObj.name = plugins[i].toLowerCase();
            pluginObj.pp = this;
            pluginObj.playerDom = this.env.playerDom;
            pluginObj._init( this.config['plugin_'+plugins[i].toLowerCase()] || {} );
        
            if (this.config['plugin_'+pluginObj.name]==null)
                this.config['plugin_'+pluginObj.name] = {};
            
            this.config['plugin_'+pluginObj.name] = $.extend(true, {}, pluginObj.config || {});

            for (var propName in pluginObj) {
                if (propName.indexOf('Handler')>1) {
                    if (this._pluginCache[propName]==null) {
                        this._pluginCache[propName]=[];
                    }
                    this._pluginCache[propName].push(pluginObj);
                }
            }
            
            this._plugins.push(pluginObj);
        }
    };

    /* removes some or all eventlisteners from registered plugins */
    this.removePlugins = function(rmvPl) {
        if (this._plugins.length==0) return;

        var pluginsToRemove = rmvPl || $.merge($.merge([],this.config._plugins), this.config._addplugins),
        pluginsRegistered = this._plugins.length;

        for (var j=0; j<pluginsToRemove.length; j++){
            for (var k=0; k<pluginsRegistered; k++){
                if (this._plugins[k]!=undefined) {
                    if (this._plugins[k].name==pluginsToRemove[j].toLowerCase()) {
                        this._plugins[k].deconstruct();
                        this._plugins.splice(k, 1);
                                  
                        for (var events in this._pluginCache){
                            for (var shortcuts=0; shortcuts<this._pluginCache[events].length; shortcuts++){
                                if (this._pluginCache[events][shortcuts].name==pluginsToRemove[j].toLowerCase()){
                                    this._pluginCache[events].splice(shortcuts, 1);
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    
    this.getPlugins = function() {
        var result = [];
        $.each(this._plugins, function() {
            result.push({name: this.name, ver: this.version || 'unknown'});
        });
        return result;
    };

    
    this._promote = function(evt, value) {
        var ref = this;
        this._enqueue(function() { try {ref.__promote(evt, value);} catch(e) {} } );
        // this._enqueue(function() {onReady(ref);});
    };
    
    /* promote an event to all registered plugins */
    this.__promote = function(evt, value) {

        var event = evt,
            pluginData={};

        if (typeof event=='object') {        
            if (!event._plugin) return;
            event = 'plugin_' + event._plugin + $p.utils.capitalise(event._event.toUpperCase());
        }

        if (event!='time' && event!='progress' && event!='mousemove') 
        $p.utils.log("Event: ["+event+"]", value, this.listeners);

        // fire on plugins
        if (this._pluginCache[event+"Handler"] && this._pluginCache[event+"Handler"].length>0) {
            for (var i = 0; i < this._pluginCache[event+"Handler"].length; i++) {
                if (this.getConfig('debug')) {
                    try {this._pluginCache[event+"Handler"][i][event+"Handler"](value, this);} catch(e) {$p.utils.log(e)}
                } else {
                    this._pluginCache[event+"Handler"][i][event+"Handler"](value, this);
                }
            }
        }

        if (this._pluginCache["eventHandler"] && this._pluginCache["eventHandler"].length>0) {
            for (var i = 0; i < this._pluginCache["eventHandler"].length; i++) {
                if (this.getConfig('debug')) {
                    try {this._pluginCache["eventHandler"][i]["eventHandler"](event, value, this);} catch(e) {$p.utils.log(e)}
                } else {
                    this._pluginCache["eventHandler"][i]["eventHandler"](event, value, this);
                }
            }
        }

        // fire on custom (3rd party) listeners
        if (this.listeners.length>0) {
            for (var i = 0; i < this.listeners.length; i++) {
                if ( this.listeners[i]['event']==event || this.listeners[i]['event']=='*' ) {
                    if (this.getConfig('debug')) {
                        try {this.listeners[i]['callback'](value, this);} catch(e) {$p.utils.log(e)}
                    } else {
                        this.listeners[i]['callback'](value, this);
                    }
                }
            }
        }
    };

    /* destoy, reset, break down to rebuild */
    this._detachplayerModel = function() {
        this._removeGUIListeners();

        try {
        this.playerModel.destroy();
        this._promote('detach', {});
        } catch(e) {
        // this.playerModel = new playerModel();
        // this.playerModel._init({pp:this, autoplay: false});
        }
    };


    /*******************************
          GUI LISTENERS
    *******************************/
    this._windowTouchListener = function(evt) {
        if (evt.touches) {
            if (evt.touches.length>0) {
                if (  ( $(document.elementFromPoint(evt.touches[0].clientX, evt.touches[0].clientY)).attr('id') || '').indexOf(this.getDC().attr('id'))>-1) {
                    if (this.env.mouseIsOver==false) {
                        this._promote('mouseenter', {});                        
                    }
                    this.env.mouseIsOver = true;
                    
                    this._promote('mousemove', {});
                    evt.stopPropagation();            
                } else if (this.env.mouseIsOver) {
                    this._promote('mouseleave', {});            
                    this.env.mouseIsOver = false;
                }                   
            }
        }
    };
        
        
    this._playerFocusListener = function(evt) {
        var type = evt.type.toLowerCase();
                   
        switch(type) {
            case 'mousedown':
                if (this.env.mouseIsOver==false)
                    break;
        
                // make sure we do not mess with input-overlays here:
                if ( "|TEXTAREA|INPUT".indexOf('|' + evt.target.tagName.toUpperCase()) > -1){        
                    return;
                }
                
                // prevent context-menu
                if (evt.which==3) {
                    if ($(evt.target).hasClass('context')) break;
                    $(document).bind('contextmenu', function(evt){
                        $(document).unbind('contextmenu');
                        return false;
                    });                    
                }
                break;
            
            case 'mousemove':
                if (this.env.mouseX!=evt.clientX && this.env.mouseY!=evt.clientY) {
                    this.env.mouseIsOver = true;
                }
                // prevent strange chrome issues with cursor changes:
                if (this.env.clientX==evt.clientX && this.env.clientY==evt.clientY)
                    return;
                this.env.clientX = evt.clientX;
                this.env.clientY = evt.clientY;
                break;
            
            case 'focus':
            case 'mouseenter':
                this.env.mouseIsOver = true;
                break;
            
            case 'blur':
            case 'mouseleave':
                this.env.mouseIsOver = false;
                break;
        }
        
        this._promote(type, evt);
        
    };

    this._keyListener = function(evt) {
        if (!this.env.mouseIsOver) return;
            
            // make sure we do not mess with input-overlays here:
        if ( "|TEXTAREA|INPUT".indexOf('|' + evt.target.tagName.toUpperCase()) > -1){        
            return;
        }             
    
        var ref = this,
            set = (this.getConfig('keys').length > 0) ? this.getConfig('keys') : [{
                27: function(player) { if(player.getInFullscreen()) { player.setFullscreen(false); }else player.setStop();}, // ESC
                32: function(player, evt) {player.setPlayPause(); evt.preventDefault();},
                70: function(player) {player.setFullscreen();}, // f
                39: function(player, evt) {player.setPlayhead('+5'); evt.preventDefault();},
                37: function(player, evt) {player.setPlayhead('-5'); evt.preventDefault();},
                38: function(player, evt) {player.setVolume('+0.05'); evt.preventDefault();},
                40: function(player, evt) {player.setVolume('-0.05'); evt.preventDefault();},
                68: function(player) {player.setDebug();}, // D
                67: function(player) {$p.utils.log('Config Dump', player.config);}, // C
                80: function(player) {$p.utils.log('Schedule Dump', player.media);}, // P
                84: function(player) {$p.utils.log('Cuepoints Dump', player.getCuePoints());} // T
            }];
        
        this._promote('key', evt);

        $.each(  set || [], function() {
            try {this[evt.keyCode](ref, evt);} catch(e) {}
            try {this['*'](ref);} catch(e) {}
        });
    };

    /*******************************
    DOM manipulations
    *******************************/
    /* make player fill the whole window viewport */
    this._enterFullViewport = function(forcePlayer) {
        // get relevant elements
        var win = this.getIframeParent() || $(window),
        target = this.getIframe() || this.getDC(),
                overflow = $(win[0].document.body).css('overflow');

        if (forcePlayer) {
        win = $(window);
        target = this.getDC();
        }
            
        // prepare target:
            target.data('fsdata', {
                scrollTop: win.scrollTop() || 0,
                scrollLeft: win.scrollLeft() || 0,
                targetStyle: target.attr('style') || '',
                targetWidth: target.width(),
                targetHeight: target.height(),
                bodyOverflow: (overflow=='visible') ? 'auto' : overflow, // prevent IE7 crash
                bodyOverflowX: $(win[0].document.body).css('overflow-x'), // prevent IE7 crash
                bodyOverflowY: $(win[0].document.body).css('overflow-y'), // prevent IE7 crash
                iframeWidth: target.attr('width') || 0,
                iframeHeight: target.attr('height') || 0
            }).css({
        position: 'absolute',
        display: 'block',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 99999,
        margin: 0,
        padding: 0
        });     

        // prepare parent window
        win.scrollTop(0).scrollLeft(0);
        $(win[0].document.body).css({
                overflow: 'hidden',
                overflowX: 'hidden',
                overflowY: 'hidden'
            });
    };

    /* reset player from "full (parent) window viewport" iframe thing */
    this._exitFullViewport = function(forcePlayer) {
        // get relevant elements
        var win = this.getIframeParent() || $(window),
        target = this.getIframe() || this.getDC(),
                fsData = target.data('fsdata') || null;

        if (forcePlayer) {
        win = $(window);
        target = this.getDC();
        }

        // reset
            if (fsData!=null) {
                // rebuild parent window state
                win.scrollTop(fsData.scrollTop).scrollLeft(fsData.scrollLeft);
                $(win[0].document.body).css('overflow', fsData.bodyOverflow);
                $(win[0].document.body).css('overflow-x', fsData.bodyOverflowX);
                $(win[0].document.body).css('overflow-y', fsData.bodyOverflowY);
                
                // rebuild iframe:
                if ( fsData.iframeWidth > 0 && !forcePlayer) {
                    target
                        .attr('width', fsData.iframeWidth+"px")
                        .attr('height', fsData.iframeHeight+"px");
                } else {
                    target
                        .width(fsData.targetWidth)
                        .height(fsData.targetHeight);
                }
                target
                    .attr('style', (fsData.targetStyle==null) ? '' : fsData.targetStyle )
                    .data('fsdata', null);
            }
    };

    /*******************************
    plugin API wrapper
    *******************************/
    this.pluginAPI = function() {
        var args = Array.prototype.slice.call(arguments) || null,
            dest = args.shift(),
            func = args.shift();
        
        if (dest!=null && func!=null) {
            for (var j=0; j<this._plugins.length; j++){
                if (this._plugins[j].name==dest) {
                    this._plugins[j][func](args[0])
                    return;
                }
            }
        }
    };

    /*******************************
    public (API) methods GETTERS
    *******************************/
        this.getPlayerVer = function() {
            return this.config._version;
        };
    
    this.getIsLastItem = function() {
        return ( (this._currentItem==this.media.length-1) && this.config._loop!==true )
    };

    this.getIsFirstItem = function() {
        return ( (this._currentItem==0) && this.config._loop!==true )
    };    
    
    // compatibility <0.9.x
    this.getItemConfig = function(name, itemIdx) {
        return this.getConfig(name, itemIdx);
    };

    this.getConfig = function(name, itemIdx) {
        var idx = itemIdx || this._currentItem,
            result = this.config['_'+name] || this.config[name];

        if (name==null) {
            return  this.media[idx]['config'];
        }

        // get value from item-specific config (beats them all)
        if (this.config['_'+name]==undefined) {        
            try {
                if (this.media[idx]['config'][name]!==undefined) {
                    result = this.media[idx]['config'][name];            
                }
            } catch(e){}
        }

        if (name.indexOf('plugin_')>-1) {
            try {
                if (this.media[idx]['config'][name]) {
                    result = $.extend(true, {}, this.config[name], this.media[idx]['config'][name]);
                }
            } catch(e){}
        }
  
        if (result==null)
            return null;
     
        if (typeof result == 'object' && result.length === null) {
            result = $.extend(true, {}, result || {});
        }
        else if (typeof result == 'object') {
            result = $.extend(true, [], result || []);            
        }
     
        if (typeof result == 'string') {
            switch(result) {
                case 'true':
                    result = true;
                    break;
                case 'false':
                    result = false;
                    break;
                case 'NaN':
                case 'undefined':
                case 'null':
                    result = null;
                    break;
            }
        }

        return result;
    };
        
    this.getDC = function() {
        return this.env.playerDom;
    };

    this.getState = function(compare) {
        var result = 'IDLE';
        try {
                result =  this.playerModel.getState();
            } catch(e) {}

        if (compare!=null) {
                return (result==compare.toUpperCase());
            }
        return result;
    };

    this.getLoadProgress = function() {
        try {return this.playerModel.getLoadProgress();}
        catch(e) {return 0;}
    };

    this.getKbPerSec = function() {
        try {return this.playerModel.getKbPerSec();}
        catch(e) {return 0;}
    };

    this.getItemCount = function() {
            // ignore NA dummy
            return (this.media.length==1 && this.media[0].mediaModel=='na') ? 0 : this.media.length;
    };
    
    this.getItemId = function(idx) {
        return this.media[idx || this._currentItem].ID || null;
    };

    this.getItemIdx = function() {
        return this._currentItem;
    };

    this.getPlaylist = function() {
        return this.getItem('*');
    };
        
    this.getItem = function() {
        // ignore NA dummy
        if (this.media.length==1 && this.media[0].mediaModel=='na') {
            return null;
        }

        // some shortcuts    
        switch(arguments[0] || 'current') {
            case 'next':
                return $.extend(true, {}, this.media[this._currentItem+1] || {});
            case 'prev':
                return $.extend(true, {}, this.media[this._currentItem-1] || {});
            case 'current':
                return $.extend(true, {}, this.media[this._currentItem] || {});
            case '*':
                return $.extend(true, [], this.media || []);
            default:
                return $.extend(true, {}, this.media[arguments[0] || this._currentItem] || {});
        }
    };
        
    this.getVolume = function() {
        return (this.getConfig('fixedVolume')===true)
        ? this.config.volume
        : this.getConfig('volume');
    };

    this.getTrackId = function() {
        if (this.getConfig('trackId')) {
        return this.config.trackId;
        }
        if (this._playlistServer!=null) {
        return "pl"+this._currentItem;
        }
        return null;
    };

    this.getLoadPlaybackProgress = function() {
        try {return this.playerModel.getLoadPlaybackProgress()}
        catch(e) {return 0;}
    };
    
    this.getSource = function() {        
        try {return this.playerModel.getSource()[0].src;}
        catch(e) {return false;}
    };    

    this.getDuration = function() {
        try {return this.playerModel.getDuration();}
        catch(e) {return 0;}
    };

    this.getPosition = function() {
        try {return this.playerModel.getPosition() || 0;}
        catch(e) {return 0;}
    };
        
    this.getMaxPosition = function() {
        try {return this.playerModel.getMaxPosition() || 0;}
        catch(e) {return 0;}
    };
        
    this.getFrame = function() {
        try {return this.playerModel.getFrame() }
        catch(e) {return 0;}
    };        

    this.getTimeLeft = function() {
        try {return this.playerModel.getDuration() - this.playerModel.getPosition();}
        catch(e) {return this.media[this._currentItem].duration;}
    };

    this.getInFullscreen = function() {
        return this.getNativeFullscreenSupport().isFullScreen();
    }

    this.getMediaContainer = function() {
        // return "buffered" media container
        if (this.env.mediaContainer==null) {
        this.env.mediaContainer = $('#'+this.getMediaId());
        }
        // if mediacontainer does not exist ...
        if (this.env.mediaContainer.length==0) {
        // and there is a "display", injectz media container
        if ( this.env.playerDom.find('.'+this.getNS()+'display').length>0 ) {
            this.env.mediaContainer = $(document.createElement('div'))
            .attr({'id':this.getId()+"_media"}) // IMPORTANT IDENTIFIER
            .css({
               // position: 'absolute',
                overflow: 'hidden',
                height: '100%',
                width: '100%',
                top: 0,
                left: 0,
                padding: 0,
                margin: 0,
                display: 'block'
            })
            .appendTo( this.env.playerDom.find('.'+this.getNS()+'display') );
        }

        // elsewise create a 1x1 pixel dummy somewhere
        else {
            this.env.mediaContainer = $(document.createElement('div'))
            .attr({id: this.getMediaId()})
            .css({width: '1px', height: '1px'})
            .appendTo( $(document.body) );
        }

        }

        // go for it
        return this.env.mediaContainer;
    };

    this.getMediaId = function() {
        return this.getId()+"_media";
    };

    this.getMediaType = function() {
            // might be called before a model has been initialized
            try {
                return this._getTypeFromFileExtension( this.playerModel.getSrc() ) || 'na/na';
            } catch(e) {
                return 'na/na';
            }
    };

    this.getUsesFlash = function() {
        return (this.playerModel.modelId.indexOf('FLASH')>-1)
    };

    this.getModel = function() {
        try {return this.media[this._currentItem].mediaModel.toUpperCase()} catch(e) {return "NA";}
    };
        
    this.getIframeParent = this.getIframeWindow = function() {
        try {
            var result = false;
            if(this.config._iframe)
                result = parent.location.host || false;
            return (result===false) ? false : $(parent.window);
        } catch(e) { return false; }        
    };

    this.getIframe = function() {
        try {
        	var result = [];
            if(this.config._iframe)
            	result = window.$(frameElement) || [];
            return (result.length==0) ? false : result;
        } catch(e) { return false; }
        
    };
        
    this.getIframeAllowFullscreen = function() {
        var result = null;
        try {
            result = window.frameElement.attributes.allowFullscreen || window.frameElement.attributes.mozallowFullscreen || window.frameElement.attributes.webkitallowFullscreen || null;
        } catch(e) { result=true; }
        return (result!=null) ? true :  false;
    };

    this.getPlaybackQuality = function() {
        var result = 'default';
        try { result=this.playerModel.getPlaybackQuality();} catch(e) {}
        if (result=='default') result = this.getConfig('playbackQuality');
        if (result=='default' || $.inArray(result, this.getPlaybackQualities())==-1 ) result = this.getAppropriateQuality();
        if ($.inArray(result, this.getPlaybackQualities())==-1) result = 'default';
        return result;
    };
    
    this.getPlaybackQualities = function() {
        try {
            return $.extend(true, [], this.media[this._currentItem].qualities || []);;
        } catch(e) {}
        return [];
    };    

    this.getIsMobileClient = function(what) {
        var uagent = navigator.userAgent.toLowerCase();

        var mobileAgents = ['android', "windows ce", 'blackberry', 'palm', 'mobile'];

        for (var i=0; i<mobileAgents.length; i++) {
        if (uagent.indexOf(mobileAgents[i])>-1) {
            // if (uagent.indexOf('webkit')>-1) return false;
            return (what) ? (mobileAgents[i].toUpperCase()==what.toUpperCase()) : true;
        }
        }
        return false;
    };
        
    this.getCanPlay = function(type, platform, streamType) {
        return this._canPlay(type, platform, streamType);
    }

        /* kept for historical reasons */
    this.getCanPlayNatively = function(type) {
        return this._canPlay(type, 'native');
    }
    
    this.getPlatform = function() {
        return this.media[this._currentItem].platform  || 'error';
    };

    this.getPlatforms = function()  {
        var ref = this,
            platforms = this._testMediaSupport(true),
            cfg = this.getConfig('platforms'),
            tmp = [],
            result = [];

        try {
            for (var i in this.media[this._currentItem].file) {
                if (this.media[this._currentItem].file.hasOwnProperty(i)) {
                    for (var j in platforms) {
                        if (this._canPlay(this.media[this._currentItem].file[i].type.replace(/x-/, ''), platforms[j].toLowerCase(), this.getConfig('streamType')) ) {
                            if ($.inArray(platforms[j].toLowerCase(), result)==-1) {
                                result.push(platforms[j].toLowerCase());
                            }
                        }
                    }
                }            
            }
        } catch(e) {}

        result.sort(function(a, b) {
            return $.inArray(a, cfg) - $.inArray(b, cfg);
        });                               

        return result;
    };

    /*
     Thanx to John Dyer: http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/
    */
    this.getNativeFullscreenSupport = function() {
        var ref = this,
            fullScreenApi = {
                supportsFullScreen: 'viewport', // viewport=full viewport, media=video only (e.g. iphone), dom=html5 true fullscreen
                isFullScreen: function() {try {return ref.getDC().hasClass('fullscreen');} catch(e){return false;}},
                requestFullScreen: function() {ref.playerModel.applyCommand('fullscreen', true);},
                cancelFullScreen: function() {ref.playerModel.applyCommand('fullscreen', false);},
                prefix: '',
                ref: this
            },
            browserPrefixes = 'webkit moz o ms khtml'.split(' ');

        // return fullScreenApi;
        // check for native support

        // standard conform?
        if (typeof document.cancelFullScreen != 'undefined') {
            fullScreenApi.supportsFullScreen = true;
        } else {
            // (double)-check for fullscreen support by vendor prefix
            for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
    
                fullScreenApi.prefix = browserPrefixes[i];
    
                // media element only
                if (typeof document.createElement('video')[fullScreenApi.prefix+"EnterFullscreen"] != 'undefined') {
                    fullScreenApi.supportsFullScreen = 'mediaonly';
                }
    
                // player container / true fullscreen
                if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
                
                    fullScreenApi.supportsFullScreen = 'dom';
    
                    // FF8+FF9 double-check
                    if (fullScreenApi.prefix=='moz' && typeof document[fullScreenApi.prefix + 'FullScreenEnabled'] == 'undefined' ) {
                        fullScreenApi.supportsFullScreen = 'viewport';
                    }
                }

                if (fullScreenApi.supportsFullScreen!==false && fullScreenApi.supportsFullScreen!=='viewport') {
                    break;
                }
    
            }
        }
    
        // SEMI:
        // we are done here: full viewport only
        if (fullScreenApi.supportsFullScreen=='viewport' || (fullScreenApi.supportsFullScreen=='dom' && this.getConfig('forceFullViewport'))) {
            return fullScreenApi;
        }

        
        // MEDIA ONLY:
        // the browser supports true fullscreen for the media element only - this is semi cool
        if (fullScreenApi.supportsFullScreen=='mediaonly') {
            fullScreenApi.requestFullScreen = function(el) {
                ref.playerModel.getMediaElement().get(0)[this.prefix+'EnterFullscreen']();
            }
            fullScreenApi.dest = {};
    
            // cancel fullscreen method
            fullScreenApi.cancelFullScreen = function() {}
    
            return fullScreenApi;
        }
        
        
        // HTML5 true fullscreen:
        // is in fullscreen check
        fullScreenApi.isFullScreen = function(esc) {
            // * FF and GoogleTV report bullshit here:
            var dest = (ref.getIframe()) ? parent.window.document : document;
            switch (this.prefix) {
                case '':
                    return dest.fullScreen;
                case 'webkit':
                    return dest.webkitIsFullScreen;
                case 'moz':
                     return dest[this.prefix + 'FullScreen'] || (ref.getDC().hasClass('fullscreen') && esc!==true);
                default:                  
                    return dest[this.prefix + 'FullScreen'];
            }
        }

        // the browser supports true fullscreen for any DOM container - this is ubercool:
        fullScreenApi.requestFullScreen = function() {
            if (this.isFullScreen()) return;
                    
            var win = ref.getIframeParent() || $(window),
                target = (ref.getIframe()) ? ref.getIframe().get(0) : null || ref.getDC().get(0),
                apiRef = this,
                dest = (ref.getIframe()) ? parent.window.document : document,
                win = ref.getIframeParent() || $(window);
            
            // store scroll positon:
            win.data('fsdata', {
                scrollTop: win.scrollTop(),
                scrollLeft: win.scrollLeft()
            });

            $(dest).unbind(this.prefix + "fullscreenchange.projekktor");
            
            if (this.prefix === '') {
                target.requestFullScreen();
            }
            else {
                target[this.prefix + 'RequestFullScreen']();
            }  
            
            apiRef.ref.playerModel.applyCommand('fullscreen', true);            
            
            // create fullscreen change listener on the fly:
            $(dest).bind(this.prefix + "fullscreenchange.projekktor", function(evt) {
                if (!apiRef.isFullScreen(true)) {
                    apiRef.ref.playerModel.applyCommand('fullscreen', false);
                    var win = apiRef.ref.getIframeParent() || $(window),
                        fsData = win.data('fsdata');
                    if (fsData!=null) {
                        win.scrollTop(fsData.scrollTop);
                        win.scrollLeft(fsData.scrollLeft);
                    }
                } else {
                    apiRef.ref.playerModel.applyCommand('fullscreen', true);
                }
            });

        }

        // cancel fullscreen method
        fullScreenApi.cancelFullScreen = function() {

            var target = ref.getIframe() ? parent.window.document : document,
                win = ref.getIframeParent() || $(window),
                fsData = win.data('fsdata');
            
            $( (ref.getIframe()) ? parent.window.document : document).unbind(this.prefix + "fullscreenchange.projekktor");

            // seems to cause errors in FF           
            if (target.exitFullScreen) {
                target.exitFullScreen();
            }
            else if (this.prefix == '') {
                target.cancelFullScreen();
            }
            else {
                target[this.prefix + 'CancelFullScreen']();
            }                

            // restore scrollposition
            if (fsData!=null) {
                win.scrollTop(fsData.scrollTop);
                win.scrollLeft(fsData.scrollLeft);
            }
                    
            ref.playerModel.applyCommand('fullscreen', false);
        }

        return fullScreenApi;
    };

    this.getId = function() {
        return this._id;
    };

    this.getHasGUI = function() {
        try {
            return this.playerModel.getHasGUI();
        } catch(e) { return false;}
    };

    this.getCssPrefix = this.getNS = function() {
        return this.config._cssClassPrefix || this.config._ns || 'pp';
    };

    this.getPlayerDimensions = function() {
        return {width: this.getDC().width(), height: this.getDC().height()};
    };

    this.getMediaDimensions = function() {
        return this.playerModel.getMediaDimensions() || {width:0, height:0};
    };
        
   this.getAppropriateQuality = function(qualities) {
        var quals = qualities || this.getPlaybackQualities() || [];
        
        if (quals.length==0)
            return [];
           
        var wid = this.env.playerDom.width(),
            hei = this.env.playerDom.height(),
            ratio = $p.utils.roundNumber(wid/hei,2),        
            temp = {};

        // find best available quality-config-set by "minHeight"
        $.each( this.getConfig('playbackQualities') || [], function() {
            // not available
            if ($.inArray(this.key, quals)<0)
                return true;
            
            // check player-dim agains minHeight
            if ( (this.minHeight || 0) > hei && temp.minHeight <= hei)        
                return true;
            
            // new set in case of higher resolution
            if( (temp.minHeight || 0) > this.minHeight )
                return true;
                           
            // check against minWidth - simple case:
            if (typeof this.minWidth == 'number') {
                if (this.minWidth===0 && this.minHeight > hei)
                return true;
                
                if (this.minWidth > wid)
                return true;
                
                temp = this;
            }        
            // check against minWidth - aspect ratio
            else if (typeof this.minWidth == 'object') {
                var ref = this;
                $.each(this.minWidth, function() {
                if ( (this.ratio || 100) > ratio)
                    return true;
                if (this.minWidth > wid)
                    return true;
                temp = ref;
                return true;
                })
                
            }        
            return true;
        });

        return ($.inArray('auto', this.getPlaybackQualities())>-1) ? 'auto' : temp.key || 'default';
    };
        
    /* asynchronously loads external XML and JSON data from server */
    this.getFromUrl = function(url, dest, callback, customParser, dataType) {
        var data = null,
            ref = this,
            aSync = !this.getIsMobileClient();

        if (dest==ref && callback=='_reelUpdate') {
            this._promote('scheduleLoading', 1+this.getItemCount());
        }

        if (callback.substr(0,1)!='_') {
            window[callback] = function(data) {
                try { delete window[callback]; } catch(e) {}
                dest[callback](data);
            };
        } else if (dataType.indexOf('jsonp')>-1) {
            this['_jsonp'+callback] = function(data) {
                dest[callback](data);
            };
        }

        if (dataType) {
            if ($.parseJSON==undefined && dataType.indexOf('json')>-1) {
                this._raiseError("Projekktor requires at least jQuery 1.4.2 in order to handle JSON playlists.");
                return this;
            }
            dataType = (dataType.indexOf('/')>-1) ? dataType.split('/')[1] : dataType;
        }
                
        var ajaxConf = {
            url: url,
            complete: function( xhr, status ) {

                if (dataType==undefined) {
                    try {
                        if (xhr.getResponseHeader("Content-Type").indexOf('xml')>-1) dataType = 'xml';
                        if (xhr.getResponseHeader("Content-Type").indexOf('json')>-1) dataType = 'json';
                        if (xhr.getResponseHeader("Content-Type").indexOf('html')>-1) dataType = 'html';
                    } catch(e){}
                }

                data = $p.utils.cleanResponse(xhr.responseText, dataType)
                
                try {data = customParser(data, xhr.responseText, dest);} catch(e){}

                if (status!='error' && dataType!='jsonp') {
                    try {dest[callback](data);} catch(e){}
                }
            },
            error: function(data) {

                // bypass jq 1.6.1 issues
                if (dest[callback] && dataType!='jsonp'){
                    dest[callback](false);
                }
            },
            cache: true,
            async: aSync,
            dataType: dataType,
            jsonpCallback: (callback.substr(0,1)!='_') ? false : "projekktor('"+this.getId()+"')._jsonp"+callback,
            jsonp: (callback.substr(0,1)!='_') ? false : 'callback'
        };

        ajaxConf.xhrFields = {withCredentials: true};
        ajaxConf.beforeSend = function(xhr){
              xhr.withCredentials = true;
        };

        $.support.cors = true;
        $.ajax(ajaxConf);            

        return this;
    };


    /*******************************
    public (API) methods SETTERS
    *******************************/
    this.setActiveItem = function(mixedData) {
        var newItem = 0,
            lastItem = this._currentItem,
            ref = this,
            ap = false;

        if (typeof mixedData=='string') {
            // prev/next shortcuts
            switch(mixedData) {
                case 'same':
                    newItem = this._currentItem;
                    break;            
                case 'previous':
                    newItem = this._currentItem-1;
                    break;
                case 'next':
                    newItem = this._currentItem+1;
                    break;
            }
        } else if (typeof mixedData=='number') {
            // index number given
            newItem = parseInt(mixedData);
        } else {
            // default
            newItem = 0;
        }

        // item change requested...
        if (newItem!=this._currentItem) {
            // and denied... gnehe
            if ( this.getConfig('disallowSkip')==true && (!this.getState('COMPLETED') && !this.getState('IDLE')) ) {
                        return this;
            }
        }

        this._detachplayerModel();
        this.env.loading = false;

        // do we have an autoplay situation?
        // regular "autoplay" on:
        if (newItem===0 && (lastItem==null || lastItem==newItem) && (this.config._autoplay===true || 'DESTROYING|AWAKENING'.indexOf(this.getState())>-1) ) {
            ap = true;
        }
        //  "continuous" playback?
        else if (this.getItemCount()>1 && newItem!=lastItem && lastItem!=null && this.config._continuous===true && newItem<this.getItemCount()) {
            ap = true;
        }

        // always "loop" playlist and disallow illegal indexes:
        if (newItem >= this.getItemCount() || newItem<0) {
            ap = this.config._loop;
            newItem = 0;
        }

        // set new item
        this._currentItem = newItem;

        // reset player class
        var wasFullscreen = this.getDC().hasClass('fullscreen');
        this.getDC().attr('class', this.env.className)
        if (wasFullscreen) this.getDC().addClass('fullscreen');

        // create player instance
        var newModel = this.media[this._currentItem].mediaModel.toUpperCase();

        // model does not exist or is faulty:
        if ( !$p.models[newModel] ) {
            newModel='NA';
            this.media[this._currentItem].mediaModel = newModel;
            this.media[this._currentItem].errorCode = 8;
        } else {
            // apply item specific class(es) to player
            if (this.getConfig('className', null)!=null) {
                this.getDC().addClass(this.getNS() + this.getConfig('className'))
            }
            this.getDC().addClass(this.getNS() + (this.getConfig('streamType') || 'http') );
                
            if (!$p.utils.cssTransitions()) this.getDC().addClass('notransitions')
            if (this.getIsMobileClient()) this.getDC().addClass('mobile')
        }

        // start model:
        this.playerModel = new playerModel();
        $.extend(this.playerModel, $p.models[newModel].prototype );
        
        this._promote('syncing', 'display');

        this._enqueue(function() { try {ref._applyCuePoints();} catch(e) {} } );

        this.playerModel._init({
            media: $.extend(true, {}, this.media[this._currentItem]),
            model: newModel,
            pp: this,
            environment: $.extend(true, {}, this.env),
            autoplay: ap,
            quality: this.getPlaybackQuality(),
            fullscreen: this.getInFullscreen()
            // persistent: (ap || this.config._continuous) && (newModel==nextUp)
        });
        return this;
    };

    /* queue ready */
    this.setPlay = function() {        
        var ref = this;            
        if (this.getConfig('thereCanBeOnlyOne')) {
            projekktor('*').each(function() {
                if (this.getId()!==ref.getId()) {
                    this.setStop();
                }
            });
        }
        this._enqueue('play', false);
        return this;
    };

    /* queue ready */
    this.setPause = function() {
        this._enqueue('pause', false);
        return this;
    };

    /* queue ready */
    this.setStop = function(toZero) {
        var ref = this;

        if (this.getState('IDLE')) {        
            return this;
        }

        if (toZero) {
            this._enqueue(function() {
                ref._currentItem=0;
                ref.setActiveItem(0);
            });
        }
        else {
            this._enqueue('stop', false);
        }

        return this;
    };

    /* queue ready */
    this.setPlayPause = function() {
        if (!this.getState('PLAYING')) {
            this.setPlay();
        } else {
            this.setPause();
        }
        return this;
    };

    /* queue ready */
    this.setVolume = function(vol, fadeDelay) {
        var initalVolume = this.getVolume();            
        if (this.getConfig('fixedVolume')==true) {
            return this;
        }
        
        switch (typeof vol) {
            case 'string':
                var dir = vol.substr(0,1);
                vol = parseFloat(vol.substr(1));          
                switch(dir) {
                case '+':
                    vol = this.getVolume()+vol;
                    break;
                case '-':
                    vol = this.getVolume()-vol;
                    break;
                default:
                    vol = this.getVolume();
                }        
            case 'number':
                vol = parseFloat(vol);
                vol =  (vol>1) ? 1 : vol;
                vol = (vol<0) ? 0 : vol;            
                break;
            default:
                return this;        
        }

        if (vol>initalVolume && fadeDelay) {
            if (vol-initalVolume>0.03) {
                for(var i=initalVolume; i<=vol; i=i+0.03) {
                    this._enqueue('volume', i, fadeDelay);
                }
                this._enqueue('volume', vol, fadeDelay);
                return this;
            }
        }
        else if (vol<initalVolume && fadeDelay) {
            if (initalVolume-vol>0.03) {
                for(var i=initalVolume; i>=vol; i=i-0.03) {
                    this._enqueue('volume', i, fadeDelay);
                }
                this._enqueue('volume', vol, fadeDelay);
                return this;
            }
        }

        this._enqueue('volume', vol);
        return this;
    };

       /* queue ready */
    this.setPlayhead = this.setSeek = function(position) {
        if (this.getConfig('disallowSkip')==true)
                return this;
            
        if (typeof position == 'string') {
        var dir = position.substr(0,1);
        position = parseFloat(position.substr(1));

        if (dir=='+') {
            position = this.getPosition()+position;
        } else if (dir=='-') {
            position = this.getPosition()-position;
        } else {
            position = this.getPosition();
        }
        }
            
        if (typeof position == 'number') {
        this._enqueue('seek', Math.round(position * 100) / 100);
        }
            
        return this;
    };
        
       /* queue ready */
    this.setFrame = function(frame) {

        if (this.getConfig('fps')==null)
            return this;
           
        if (this.getConfig('disallowSkip')==true)
                return this;

        if (typeof frame == 'string') {
            var dir = frame.substr(0,1);
            frame = parseFloat(frame.substr(1));
    
            if (dir=='+') {
                frame = this.getFrame()+frame;
            } else if (dir=='-') {
                frame = this.getFrame()-frame;
            } else {
                frame = this.getFrame();
            }
        }
  
        if (typeof frame == 'number') {
            this._enqueue('frame', frame);
        }
            
        return this;
    };        

    /* queue ready */
    this.setPlayerPoster = function(url) {
        var ref = this;
        this._enqueue(function() {ref.setConfig({poster:url},0);});
        this._enqueue(function() {ref.playerModel.setPosterLive();});
        return this;
    };

    this.setConfig = function() {
        var ref = this,
            args = arguments;
            
        this._enqueue(function() {
            ref._setConfig(args[0] || null, args[1] || null)
        });
            
        return this;
    };

    this._setConfig = function() {
        if (!arguments.length) {
            return result;
        }

        var confObj = arguments[0],
            dest = '*',
            value = false;

        if (typeof confObj != 'object') {
            return this;
        }

        if (arguments[1] == 'string' || arguments[1] == 'number') {
            dest = arguments[1];
        } else {
            dest = this._currentItem;
        }

        for (var i in confObj) {
            // is constant:
            if (this.config['_'+i]!=null) continue;
    
            try {value = eval(confObj[i]);}
            catch(e) {value = confObj[i];}
    
            if (dest == '*') {
                $.each(this.media, function() {
                if (this.config == null) {
                    this.config = {};
                }
                this.config[i] = value;
                });
                continue;
            }
    
            if (this.media[dest] == undefined) return this;
    
            if (this.media[dest]['config'] == null) {
                this.media[dest]['config'] = {};
            }
    
            this.media[dest]['config'][i] = value;
        }
        return this;
    };

    this.setFullscreen = function(goFull) {
        var nativeFullscreen = this.getNativeFullscreenSupport();

        goFull = (goFull==null) ? !nativeFullscreen.isFullScreen() : goFull;                                

        if (goFull===true) nativeFullscreen.requestFullScreen();
        else nativeFullscreen.cancelFullScreen();

        return this;
    };

    this.setSize = function(data) {
        var target = this.getIframe() || this.getDC(),
            fsdata = target.data('fsdata') || null,
            w = (data && data.width!=null) ? data.width : 
                (this.getConfig('width')!=null) ? this.getConfig('width') : false,
            h = (data && data.height!=null) ? data.height :
                (this.getConfig('height')==null && this.getConfig('ratio')) ? Math.round( (w || this.getDC().width()) / this.getConfig('ratio')) :
                (this.getConfig('height')!=null) ? this.getConfig('height') : false;

        if (this.getInFullscreen() && fsdata!=null) {
            // remember new dims while in FS
            fsdata.targetWidth = w;
            fsdata.targetHeight = h;
            target.data('fsdata', fsdata);
        } else {
            // apply new dims 
            if (w) target.css({width:  w + "px" });
            if (h) target.css({height: h + "px" });        
        }
        
        try {this.playerModel.applyCommand('resize'); } catch(e) {}                            
    };

    this.setLoop = function(value) {
        this.config._loop = value || !this.config._loop;
    };

    this.setDebug = function(value) {
        $p.utils.logging = value || !$p.utils.logging;
        if ($p.utils.logging)
            $p.utils.log('DEBUG MODE for player #' + this.getId());
    };

    this.addListener = function(evt, callback) {
        var ref=this;
        this._enqueue(function() {ref._addListener(evt, callback)});
        return this;
    };
        
    this._addListener = function(event, callback) {
        var evt = (event.indexOf('.')>-1) ? event.split('.') : [event, 'default'];
        this.listeners.push({
            event: evt[0],
            ns: evt[1],
            callback: callback
        });            
        return this;
    };

    /* removes an JS object from the event queue */
    this.removeListener = function(event, callback) {
        var len = this.listeners.length,
                evt = (event.indexOf('.')>-1) ? event.split('.') : [event, '*'];

        for (var i=0; i<len;i++) {
            if (this.listeners[i]==undefined) continue;
            if (this.listeners[i].event!=evt[0] && evt[0]!=='*') continue;                
                if ( (this.listeners[i].ns!=evt[1] && evt[1]!=='*') || (this.listeners[i].callback+''!=callback+'' && callback!=null) ) continue;        
                this.listeners.splice(i,1);
        }
        return this;
    };

    this.setItem = function() {
        // arg0 -> item obj
        // arg1 -> position (int)
        // arg2 -> replace (bool)

        var itemData = arguments[0];
        var affectedIdx = 0;

        this._clearqueue();
        
            // if (this.env.loading===true) {
        // return this;
        // }

        if (itemData==null) {
            // remove item
            affectedIdx = this._removeItem(arguments[1]);
            if (affectedIdx===this._currentItem) {
                this.setActiveItem('previous');
            }
        }
        else {
            // add/set item
            affectedIdx = this._addItem( this._prepareMedia({file:itemData, config:itemData.config || {}}), arguments[1], arguments[2]);
            if (affectedIdx===this._currentItem) {
                this.setActiveItem(this._currentItem);
            }
        }

        return this;
    };

    this.setFile = function() {

        var fileNameOrObject = arguments[0] || '',
            dataType = arguments[1] || this._getTypeFromFileExtension( fileNameOrObject ),
            result = [];

        if (this.env.loading===true)
                return this;
            
        this._clearqueue();
        this.env.loading = true;
        this._detachplayerModel();

        // incoming JSON
        if (typeof fileNameOrObject=='object') {
            $p.utils.log('Applying incoming JS Object', fileNameOrObject);
            this._reelUpdate(fileNameOrObject);
            return this;
        }

        result[0] = {};
        result[0].file = {}
        result[0].file.src = fileNameOrObject || '';
        result[0].file.type = dataType || this._getTypeFromFileExtension( splt[0] ) ;

        // incoming playlist
        if (result[0].file.type.indexOf('/xml')>-1 || result[0].file.type.indexOf('/json') >-1) {
        $p.utils.log('Loading external data from '+result[0].file.src+' supposed to be '+result[0].file.type );
        this._playlistServer = result[0].file.src;
        this.getFromUrl(result[0].file.src, this, '_reelUpdate', this.getConfig('reelParser'), result[0].file.type );
        return this;
        }

        // incoming single file:
        $p.utils.log('Applying incoming single file:'+result[0].file.src, result);
        this._reelUpdate(result);
        return this;
    };

    this.setPlaybackQuality = function(quality) {
        var qual = quality || this.getAppropriateQuality();         
        if ($.inArray(qual, this.media[this._currentItem].qualities || [])>-1) {
            this.playerModel.applyCommand('quality', qual);
            this.setConfig({playbackQuality: qual});    
        }
        return this;
    };

    this.openUrl = function(cfg) {
        cfg = cfg || {url:'', target:'', pause: false};
        if (cfg.url=='') return this;
        if (cfg.pause===true) {
            this.setPause();
        }
        window.open(cfg.url, cfg.target).focus();
        return this;
    };


    /**
    * Removes THIS Projekktor and reconstructs original DOM
    *
    * ENQUEUED
    *
    * @public
    * @return {Object} this
    */
    this.selfDestruct = this.destroy = function() {
        var ref = this;
        this._enqueue(function() {ref._destroy();});
        return this;
    },
        
    this._destroy = function() {
        var ref = this;
        
        $(this).unbind();
            
        this.removePlugins();
        this.playerModel.destroy();            
        this._removeGUIListeners();


        $.each(projekktors, function(idx) {
            try {
                if (this.getId() == ref.getId() || this.getId() == ref.getId() || this.getParent() == ref.getId())  {
                projekktors.splice(idx, 1);
                return;
                }
            } catch(e){}
        });

        this.env.playerDom.replaceWith( this.env.srcNode );
     
        this._promote('destroyed')
        this.removeListener('*');
            
        return this;
    }

    /**
    * @public
    * @return {Object} this
    */
    this.reset = function() {
        var ref = this;
        this._clearqueue();
        this._enqueue(function() {ref._reset();});
        return this;
    },

    this._reset = function() {

        var cleanConfig = {},
            ref = this;
              
        this.setFullscreen(false);
        
        $(this).unbind();
        $((this.getIframe()) ? parent.window.document : document).unbind(".projekktor");
        $(window).unbind('.projekktor'+this.getId());

        this.playerModel.destroy();
        this.playerModel = {};
            
        this.removePlugins();
        this._removeGUIListeners();
        this.env.mediaContainer = null;
        this._currentItem = null;

        for (var i in this.config) {
            cleanConfig[(i.substr(0,1)=='_') ? i.substr(1) : i] = this.config[i];
        }

        if (typeof this.env.onReady==='function') {
            this._enqueue(ref.env.onReady(ref));
        }

        this._init(this.env.playerDom, cleanConfig);

        return this;
    },


     /********************************************************************************************
        Queue Points
    *********************************************************************************************/
    this.setCuePoint = function(obj, opt) {
        var item = (obj.item!==undefined) ? obj.item : this.getItemIdx(),
            options = $.extend(true, {
                offset: 0
            }, opt),
        ref = this,
        cuePoint = {
            id: obj.id || $p.utils.randomId(8),
            group: obj.group || $p.utils.randomId(8),
            item: item,
            on: ($p.utils.toSeconds(obj.on) || 0) + options.offset,
            off: ($p.utils.toSeconds(obj.off) || $p.utils.toSeconds(obj.on) || 0)  + options.offset,
            value: obj.value || null,
            callback: obj.callback || function(){},
            precision: (obj.precision==null) ? 1 : obj.precision,
            title: (obj.title==null) ? '' : obj.title,
            
            _listeners: [],
            _unlocked: false,
            _active: false,
            _lastTime: 0,
                        
            isAvailable: function() {return this._unlocked;},
                    
            _stateListener: function(state, player) {
            if ('STOPPED|COMPLETED|DESTROYING'.indexOf(state)>-1) {
                if (this._active)
                try {  this.callback(false, this, player); } catch(e) {}
                this._active = false;
                this._lastTime = -1;
            }

            },
            _timeListener: function(time, player) {

                        if (player.getItemIdx()!==this.item && this.item!='*')
                            return;
                        
            var timeIdx = (this.precision==0) ? Math.round(time) : $p.utils.roundNumber(time, this.precision),                           
                            ref = this;

                        // are we already unlocked?
                        // consider buffer state to unlock future cuepoints for user interactions
                        if (this._unlocked===false) {
                            var approxMaxTimeLoaded = player.getDuration() * player.getLoadProgress() / 100;
                       
                            if (this.on<=approxMaxTimeLoaded || this.on<=timeIdx ) {
                                
                                // trigger unlock-listeners
                                $.each(this._listeners['unlock'] || [], function() {            
                                    this(ref, player);
                                })
                                
                                this._unlocked = true;
                                
                            } else { return; }
                            
                        }

                        // something to do?
            if (this._lastTime==timeIdx)
                return;

            var nat = (timeIdx-this._lastTime<=1 && timeIdx-this._lastTime>0);

            // trigger ON
            if ( ( (timeIdx >= this.on && timeIdx <= this.off) || (timeIdx >= this.on && this.on == this.off && timeIdx <= this.on+1) ) && this._active!==true) {               
                            
                            this._active = true;
                $p.utils.log("Cue Point: [ON " + this.on +"] at "+timeIdx,  this);
                try { this.callback({
                                id: this.id,
                                enabled: true,
                                value: this.value,
                                seeked: !nat,
                                player: player}); } catch(e) {}
            }
            
                        // trigger OFF
            else if ( (timeIdx < this.on || timeIdx > this.off) && this.off!=this.on && this._active==true) {
                    this._active = false;
                            $p.utils.log("Cue Point: [OFF] at " + this.off, this);
                            try { this.callback({
                                id: this.id,
                                enabled: false,
                                value: this.value,
                                seeked: !nat,
                                player: player}); } catch(e) {}                                    
            }                        
                        
                        if ( this.off==this.on && this._active && new Number(timeIdx-this.on).toPrecision(this.precision)>=1 ) {
                            this._active = false;
                        }

            this._lastTime = timeIdx;
            },
                    addListener: function(event, func) {
                        if (this._listeners[event]==null)
                            this._listeners[event] = [];
                        this._listeners[event].push( func || function(){} );
                    }
        }

            if(obj.unlockCallback!=null)
                cuePoint.addListener('unlock', obj.unlockCallback);
                
        // create itemidx key
        if (this._cuePoints[item]==null)
        this._cuePoints[item] = [];

        this._cuePoints[item].push(cuePoint);
        
        if (!this.getState('IDLE'))
        this._promote('cuepointAdded')
        
        return this;

    },
        
    this.setGotoCuePoint = function(idx, itemIdx) {
        var cuePoints = this.getCuePoints(itemIdx);
        this.setPlayhead(cuePoints[idx].on);
        return this;
    },        

    this.getCuePoints = function(idx) {            
        return this._cuePoints[ idx || this.getItemIdx() ] || this._cuePoints || {};
    },

    this.getCuePointById = function(id, idx) {
        var result = false,
            cuePoints = this.getCuePoints(idx);
        
        for (var j=0; j<cuePoints.length; j++){
            if (cuePoints.id==id) {
                result = this;
                break;
            }
        }
        return result;
    },

    this.removeCuePoints = function(idx, group) {
        var cuePoints = this.getCuePoints(idx || 0) || {},
        kill = [];        
        for (var cIdx=0; cIdx < cuePoints.length; cIdx++ ) {
            if (cuePoints[cIdx].group==group) {
                this.removeListener('time', cuePoints[cIdx].timeEventHandler);
                this.removeListener('state', cuePoints[cIdx].stateEventHandler);            
                kill.push(cIdx);
            }
        }

        for (var i = 0; i < kill.length; i++) {
            cuePoints.splice(kill[i] - i, 1);        
        }
        return this;
    },
    
    this.syncCuePoints = function() {
        var ref = this;
        this._enqueue(function() { try {ref._applyCuePoints();} catch(e) {} } );
        return this;
    },

    this._applyCuePoints = function(resync) {

        var ref = this;

        if (this._cuePoints[this._currentItem]==null && this._cuePoints['*']==null) {
            return;
        }

        $.each( $.merge(this._cuePoints[this._currentItem] || [], this._cuePoints['*'] || []), function(key, cuePointObj) {
            try {
                ref.removeListener('time', cuePointObj.timeEventHandler);
                ref.removeListener('state', cuePointObj.stateEventHandler);
            } catch(e) {}
            
            cuePointObj.timeEventHandler = function(time, player) {
                try {cuePointObj._timeListener(time, player);} catch(e){}
            },
    
            cuePointObj.stateEventHandler = function(state, player) {
                try {cuePointObj._stateListener(state, player);} catch(e){}
            },
    
    
            ref.addListener('time', cuePointObj.timeEventHandler);
            ref.addListener('state', cuePointObj.stateEventHandler);
    
            ref.addListener('item', function() {
                ref.removeListener('time', cuePointObj.timeEventHandler);
                ref.removeListener('state', cuePointObj.stateEventHandler);
            });
        })

    },


     /********************************************************************************************
        Command Queue
    *********************************************************************************************/
    this._enqueue = function(command, params, delay)  {
        if (command!=null) {
            this._queue.push({command:command, params:params, delay:delay});
            this._processQueue();
        }
    };

    this._clearqueue = function(command, params)  {
        if (this._isReady===true) {
            this._queue = [];
        }
    };

    this._processQueue = function() {
        var ref = this,
            modelReady = false;
                
        if (this._processing===true || this.env.loading===true) return;        
        this._processing = true;

        (function() {
            try {modelReady=ref.playerModel.getIsReady();} catch(e) {}
            if (ref.env.loading!==true && modelReady) {    
                try {
                    var msg = ref._queue.shift();
                    if (msg!=null) {
                        if (typeof msg.command=='string') {
                        if (msg.delay>0)
                            setTimeout(function() {
                            ref.playerModel.applyCommand(msg.command, msg.params);
                            }, msg.delay);
                        else
                            ref.playerModel.applyCommand(msg.command, msg.params);
                        } else {
                        msg.command(ref);
                        }
                    }
                } catch(e) {$p.utils.log("ERROR:", e);}
    
                if (ref._queue.length==0){
                    if (ref._isReady===false ) {
                        ref._isReady=true;
                    }
                    ref._processing = false;
                    return;
                }
    
                arguments.callee();
                return;
            }
            setTimeout(arguments.callee,100);
        })();
    };


    /********************************************************************************************
        GENERAL Tools
    *********************************************************************************************/
    this._getTypeFromFileExtension = function(url) {
        var fileExt = '',
            extRegEx = [],
            extTypes = {},
            extRegEx = [],
            plt = null,
            on = true;

        // build regex string and filter dublicate extensions:
        for(var i in $p.mmap ) {
            if ($p.mmap.hasOwnProperty(i)) {
                plt = $p.mmap[i].platform;
                if (typeof plt != 'object') {
                    plt = [plt];
                }
                on = true;
                for(var j=0; j < plt.length; j++) {
                    if (plt[j]!=null) {
                        if (this.getConfig('enable'+plt[j].toUpperCase()+'Platform')===false || $.inArray(plt[j], this.getConfig('platforms'))===-1) {
                            on = false;
                        }
                    }
                }
                if (on===false) continue;        
                extRegEx.push( '\\\.'+$p.mmap[i].ext );
                extTypes[$p.mmap [i].ext] = $p.mmap [i];
            }
        }

        extRegEx = '^.*\.('+extRegEx.join('|')+")";

        try {
            fileExt = url.match( new RegExp(extRegEx))[1];
            fileExt = (!fileExt) ? 'NaN' : fileExt.replace('.','');
        } catch(e) {
            fileExt='NaN';
        }

        return extTypes[fileExt].type;
    };

    /* generates an array of mediatype=>playertype relations depending on browser capabilities */
    this._testMediaSupport = function(getPlatforms) {
        var result = {},
            resultPlatforms = [],
            streamType = '',
            ref = this;

        if (getPlatforms) {
            if ($p._platformTableCache!=null) {
                return $p._platformTableCache;
            }            
        } else {
            if ($p._compTableCache!=null) {
                return $p._compTableCache;
            }
        }
        
        for (var i=0; i < $p.mmap.length; i++ ) {
            if ($p.mmap.hasOwnProperty(i)) {
                platforms = (typeof $p.mmap[i]['platform']=='object') ? $p.mmap[i]['platform'] : [ $p.mmap[i]['platform'] ];
                
                $.each(platforms, function(_na, platform) {
        
                    if (platform==null)
                        return true;
    
                    streamType = $p.mmap[i]['streamType'] || ['http'];
    
                    $.each(streamType, function(key, st) {
    
                        if (result[st]==null)
                            result[st] = {};        
                        
                        if (result[st][platform]==null)
                            result[st][platform] = [];
                    
                        // avoid dupes
                        if ( $.inArray($p.mmap[i]['type'], result[st][platform] )>-1 )
                            return true;
                        
                        
                        var reqPlatformVersion = ($p.models[ $p.mmap[i]['model'].toUpperCase() ].prototype[(platform.toLowerCase()) + 'Version'] || "1").toString();
    
                        // perform version and config check:
                        try {
                            if ( $p.utils.versionCompare($p.platforms[platform.toUpperCase()]($p.mmap[i]['type']), reqPlatformVersion) ) {                                
                                // check if platform is enabled in config
                                if (ref.getConfig('enable'+platform.toUpperCase()+'Platform')!=false && $.inArray(platform.toLowerCase(), ref.getConfig('platforms'))>-1) {
                                    result[st][platform].push($p.mmap[i]['type'])
                                    if ($.inArray(platform.toUpperCase(), resultPlatforms)==-1) {
                                        resultPlatforms.push(platform.toUpperCase());
                                    }
                                }
                                return true;
                            }
                        } catch(e) {
                            $p.utils.log('ERROR', 'platform '+platform+' not defined')
                        }
                        
                        return true;
                    })
                    
                    return true;
                })
            }
        }
        $p._compTableCache = result;
        $p._platformTableCache = resultPlatforms;
        
        return (getPlatforms) ? $p._platformTableCache : $p._compTableCache;
    };
        
    this._readMediaTag = function(domNode) {
        var result = {},
        htmlTag='',
        attr=[],
        ref=this;

        if("VIDEOAUDIO".indexOf(domNode[0].tagName.toUpperCase())==-1)
                return false;


        // gather general config attributes:
        // - Safari does not supply default-bools here:
        if (!this.getConfig('ignoreAttributes')) {
        result = {
            autoplay: ( (domNode.attr('autoplay')!==undefined || domNode.prop('autoplay')!==undefined) && domNode.prop('autoplay')!==false) ? true : false,
            controls: ( (domNode.attr('controls')!==undefined || domNode.prop('controls')!==undefined) && domNode.prop('controls')!==false) ? true : false,
            loop: ( (domNode.attr('autoplay')!==undefined || domNode.prop('loop')!==undefined) && domNode.prop('loop')!==false) ? true : false,
            title: (domNode.attr('title')!==undefined && domNode.attr('title')!==false) ? domNode.attr('title') : '',
            poster: (domNode.attr('poster')!==undefined && domNode.attr('poster')!==false) ? domNode.attr('poster') : '',
            width: (domNode.attr('width')!==undefined && domNode.attr('width')!==false) ? domNode.attr('width') : null,
            height: (domNode.attr('height')!==undefined && domNode.attr('height')!==false) ? domNode.attr('height') : null
        };
        }
        
        // IE7+8 and some other idiots do not keep attributes w/o values:
        htmlTag = $($('<div></div>').html($(domNode).clone())).html();
        attr = ['autoplay', 'controls', 'loop'];

        for (var i=0; i<attr.length; i++) {
            if (htmlTag.indexOf(attr[i])==-1) continue;
            result[attr[i]] = true;
        }


        // get possible media sources:
        result.playlist = [];
        result.playlist[0] = [];
        result.playlist[0]['config'] = {tracks:[]};
       
        // ... from "src" attribute:
        if (domNode.attr('src')) {
            result.playlist[0].push({
                src: domNode.attr('src'),
                type: domNode.attr('type') || this._getTypeFromFileExtension(domNode.attr('src'))
            });
        }

        // ... from media tag children
        // ... within a lame browser (IE <9) ...
        if (!$('<video/>').get(0).canPlayType) {
            var childNode = domNode;
            do {
                                           
                childNode = childNode.next('source,track');
                if (childNode.attr('src')) {
                switch(childNode.get(0).tagName.toUpperCase()) {
                    case 'SOURCE':
                    result.playlist[0].push({
                        src: childNode.attr('src'),
                        type: childNode.attr('type') || this._getTypeFromFileExtension(childNode.attr('src')),
                        quality: childNode.attr('data-quality') || ''
                    });                
                    break;
                    case 'TRACK':
                    if ($(this).attr('src')) {
                        result.playlist[0]['config']['tracks'].push({
                        src: childNode.attr('src'),
                        kind: childNode.attr('kind') || 'subtitle',
                        lang: childNode.attr('srclang') || null,
                        label: childNode.attr('label') || null
                        });
                    }
                    break;
                }
                }
            } while (childNode.attr('src'))
        }
    
        // ... within a good browser ...
        if (result.playlist[0].length==0) {
        domNode.children('source,track').each( function(){
            if ($(this).attr('src')) {
            switch($(this).get(0).tagName.toUpperCase()) {
                case 'SOURCE':
                result.playlist[0].push({
                    src: $(this).attr('src'),
                    type: $(this).attr('type') || ref._getTypeFromFileExtension($(this).attr('src')),
                    quality: $(this).attr('data-quality') || ''
                });                
                break;
                case 'TRACK':
                result.playlist[0]['config']['tracks'].push({
                    src: $(this).attr('src'),
                    kind: $(this).attr('kind') || 'subtitle',
                    lang: $(this).attr('srclang') || null,
                    label: $(this).attr('label') || null
                });                
                break;
            }
            }
        });
        }

        return result;
    };        
        
    this._raiseError = function(txt) {
        this.env.playerDom
        .html(txt)
        .css({
            color: '#fdfdfd',
            backgroundColor: '#333',
            lineHeight: this.config.height+"px",
            textAlign: 'center',
            display: 'block'

        });
        this._promote('error');
    };

    this._init = function(customNode, customCfg) {

        var theNode = customNode || srcNode,
            theCfg = customCfg || cfg,
            cfgByTag = this._readMediaTag(theNode);

        // -----------------------------------------------------------------------------
        // - 1. GENERAL CONFIG ---------------------------------------------------------
        // -----------------------------------------------------------------------------

        // remember original node HTML for reset and reference purposes:
        this.env.srcNode = theNode.wrap('<div></div>').parent().html();
            theNode.unwrap();
            
        // remember initial classes
        this.env.className = theNode.attr('class') || '';
        
            // remember ID
            this._id = theNode[0].id || $p.utils.randomId(8);            

        if (cfgByTag!==false) {
        // swap videotag->playercontainer
        this.env.playerDom = $('<div/>')
            .attr({
            'class': theNode[0].className,
            'style': theNode.attr('style')
            })
        theNode.replaceWith( this.env.playerDom );
                
                // destroy theNode            
                theNode.empty().removeAttr('type').removeAttr('src');
                try {
                    theNode.get(0).pause();
                    theNode.get(0).load();
                } catch(e) {}
                
                $('<div/>').append(theNode).get(0).innerHTML='';
                theNode = null;
                
        } else {
                this.env.playerDom = theNode;    
            }

        // merge configs we got so far:
        theCfg = $.extend(true, {}, cfgByTag, theCfg);
            
        for (var i in theCfg) {
        if (this.config['_'+i]!=null) {
            this.config['_'+i] = theCfg[i];
        } else {
                    if (i.indexOf('plugin_')>-1) this.config[i] = $.extend(this.config[i], theCfg[i]);
                    else this.config[i] = theCfg[i];
        }
        }

            $p.utils.logging = this.config._debug;
            
            // initial DOM scaling
            this.setSize();
            
        // force autoplay false on mobile devices:
        if  (this.getIsMobileClient()) {
        this.config._autoplay = false;
        this.config.fixedVolume = true;
        }


        // -----------------------------------------------------------------------------
        // - 2. TRIM DEST --------------------------------------------------------------
        // -----------------------------------------------------------------------------

        // make sure we can deal with a domID here:
        this.env.playerDom.attr('id', this._id);

        // ----------------------------------------------------------------------------
        // - 3. INIT THEME LOADER ------------------------------------------------------
        // -----------------------------------------------------------------------------
        if (this.config._theme) {
        switch(typeof this.config._theme) {
            case 'string':
            // later: this.getFromUrl(this.parseTemplate(this.config._themeRepo, {id:this.config._theme, ver:this.config._version}), this, "_applyTheme", false, 'jsonp');
            break;
            case 'object':
            this._applyTheme(this.config._theme)
        }
        }
        else {
        this._start(false);
        }

        return this;
    };


    this._start = function(data) {

        var ref = this,
            iframeParent = this.getIframeParent();

        // load and initialize plugins
        this._registerPlugins();


        // set up iframe environment
        if (this.config._iframe === true) {
            if (iframeParent) {
                iframeParent.ready(function() {
                    ref._enterFullViewport(true);
                });
            } else {
                ref._enterFullViewport(true);
            }
        }

            // cross domain
            if (iframeParent===false) {
                this.config._isCrossDomain = true;
            }
     
            // allow fullscreen?
            if (!this.getIframeAllowFullscreen()) {
                this.config.enableFullscreen = false;              
            }
             
        if (typeof onReady==='function') {
            // this._queue.unshift({command:function() {onReady(ref);}});
            this._enqueue(function() {onReady(ref);});
        }

        // playlist?
        for (var i in this.config._playlist[0]) {
        // we prefer playlists - search one:
        if (this.config._playlist[0][i].type) {
            if (this.config._playlist[0][i].type.indexOf('/json')>-1 || this.config._playlist[0][i].type.indexOf('/xml')>-1 ) {
            this.setFile(this.config._playlist[0][i].src, this.config._playlist[0][i].type);
            return this;
            }
        }
        }

        this.setFile(this.config._playlist);

        return this;
    };

    this._applyTheme = function(data) {

        var ref = this;

        // theme could not be loaded => error
        if (data===false) {
        this._raiseError('The Projekktor theme-set specified could not be loaded.')
        return false;
        }

        /*
            // check projekktor version
        if (typeof data. == 'string') {
        if (
            (parseInt(this.config._version.split('.')[0]) || 0) < (parseInt(data.version.split('.')[0]) || 0) ||
            (parseInt(this.config._version.split('.')[1]) || 0) < (parseInt(data.version.split('.')[1]) || 0)
        ){
            this._raiseError('You are using Projekktor V'+this.config._version+' but the applied theme requires at least V'+data.version+'.');
            return false;
        }
        }
        */


        // inject CSS & parse {relpath} tag (sprites)
        if (typeof data.css == 'string') {
            $('head').append('<style type="text/css">' + $p.utils.parseTemplate(data.css, {'rp':data.baseURL}) + '</style>');
        }

        // apply html template
            if (typeof data.html=='string') {
        this.env.playerDom.html( $p.utils.parseTemplate(data.html, {'p':this.getNS()}) );
        }

        // apply class            
        this.env.playerDom.addClass(data.id).addClass(data.variation);
        this.env.className = this.env.className && this.env.className.length !== 0 ? this.env.className + " " + data.id : data.id;
        if(data.variation && data.variation.length !== 0) {
            this.env.className += " " + data.variation;
        }        

            // apply additional config
        if (typeof data.config=='object') {
            for (var i in data.config) {
    
                if (this.config['_'+i]!=null) {
                this.config['_'+i] = data.config[i];
                } else {
                            if (i.indexOf('plugin_')>-1) this.config[i] = $.extend(true, {}, this.config[i], data.config[i]);
                else this.config[i] = data.config[i];
                }
            }
    
            // check dependencies
            if (typeof data.config.plugins == 'object' ) {
                for (var i=0; i<data.config.plugins.length; i++) {
                try {
                    typeof eval('projekktor'+data.config.plugins[i]);
                }
                catch(e) {
                    this._raiseError('The applied theme requires the following Projekktor plugin(s): <b>'+data.config.plugins.join(', ')+'</b>');
                    return false;
                }
                }
            }
        }

        if (data.onReady) {
            this._enqueue(function(player){eval(data.onReady);});
        }

        return this._start();
    };


    return this._init();
    };

}

$p.mmap = [];
$p.models = {};
$p.newModel = function(obj, ext) {
    if (typeof obj!='object') return result;
    if (!obj.modelId) return result;
    
    var result = false,
        extend = ($p.models[ext] && ext!=undefined) ? $p.models[ext].prototype : {};
  
    /* already exists or has been replaced */
    if ($p.models[obj.modelId]) return result;

    /* register new model */
    $p.models[obj.modelId] = function(){};
    $p.models[obj.modelId].prototype = $.extend({}, extend, obj);

    /* add modelname to media map object */
    if (obj.setiLove) {
        obj.setiLove();
    }
    
 
    /* remove overwritten model from iLove-map */
    $p.mmap = $.grep($p.mmap, function(iLove) {
        var doesNotExist = iLove.model != ((obj.replace) ? obj.replace.toLowerCase() : ''),
            isNotOverwritten = iLove.replaces != obj.modelId;
        return doesNotExist && isNotOverwritten;
    })

    for (var i=0; i< obj.iLove.length; i++) {
        obj.iLove[i].model = obj.modelId.toLowerCase();
        obj.iLove[i].replaces = ((obj.replace) ? obj.replace.toLowerCase() : '');
        $p.mmap.push( obj.iLove[i] );
    }

    return true;
}

});
var projekktorConfig = function(ver){this._version = ver;};
