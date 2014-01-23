/*
 * Projekktor II Plugin: Controlbar
 * 
 * DESC: Adds a fully features cb element to the player
 * Copyright 2010-2013 Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com
 *
 * under GNU General Public License
 * http://www.projekktor.com/license/
 */
var projekktorControlbar = function () {};
jQuery(function ($) {
    projekktorControlbar.prototype = {
    
        version: '1.1.01',

        _cTimer: null,
        _isDVR: false,
        _noHide: false,
        _vSliderAct: false,
        
        cb: null,

        controlElements: {},
        controlElementsConfig: {
            'sec_dur': null,
            'min_dur': null,
            'sec_abs_dur': null,
            'min_abs_dur': null,            
            'hr_dur': null,
            'sec_elp': null,
            'min_elp': null,
            'sec_abs_elp': null,
            'min_abs_elp': null,            
            'hr_elp': null,
            'sec_rem': null,
            'min_rem': null,
            'sec_abs_rem': null,
            'min_abs_rem': null,            
            'hr_rem': null,
            'sec_tip': null,
            'min_tip': null,
            'sec_abs_tip': null,
            'min_abs_tip': null,            
            'hr_tip': null,

            'cb': null,

            'playhead': {
                on: null,
                call: null
            },
            'loaded': null, // { on:['touchstart', 'click'], call:'scrubberClk'},
            'golive': [{
                on: ['touchstart', 'click'],
                call: 'goliveClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'scrubber': null, // { on:['touchstart', 'click'], call:'scrubberClk'},
            'scrubbertip': null,
            'scrubberknob': null,
            'scrubberdrag': [{
                on: ['mouseenter'],
                call: 'scrubberShowTooltip'
            }, {
                on: ['mouseout'],
                call: 'scrubberHideTooltip'
            }, {
                on: ['mousemove'],
                call: 'scrubberdragTooltip'
            }, {
                on: ['mousedown'],
                call: 'scrubberdragStartDragListener'
            }],

            'play': [{
                on: ['touchstart', 'click'],
                call: 'playClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'pause': [{
                on: ['touchstart', 'click'],
                call: 'pauseClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'stop': [{
                on: ['touchstart', 'click'],
                call: 'stopClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'prev': [{
                on: ['touchstart', 'click'],
                call: 'prevClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'next': [{
                on: ['touchstart', 'click'],
                call: 'nextClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'rewind': [{
                on: ['touchstart', 'click'],
                call: 'rewindClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'forward': [{
                on: ['touchstart', 'click'],
                call: 'forwardClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],

            'fsexit': [{
                on: ['touchstart', 'click'],
                call: 'exitFullscreenClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'fsenter': [{
                on: ['touchstart', 'click'],
                call: 'enterFullscreenClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],

            'loquality': [{
                on: ['touchstart', 'click'],
                call: 'setQualityClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'hiquality': [{
                on: ['touchstart', 'click'],
                call: 'setQualityClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],

            'vslider': [{
                on: ['touchstart', 'click'],
                call: 'vsliderClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'vmarker': [{
                on: ['touchstart', 'click'],
                call: 'vsliderClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'vknob': {
                on: ['mousedown'],
                call: 'vknobStartDragListener'
            },

            'volumePanel': [{
                on: ['mousemove'],
                call: 'volumeBtnHover'
            }, {
                on: ['mouseout'],
                call: 'volumeBtnOut'
            }],
            'volume': null,

            'mute': [{
                on: ['touchstart', 'click'],
                call: 'muteClk'
            }, {
                on: ['mouseout'],
                call: 'volumeBtnOut'
            }, {
                on: ['mousemove'],
                call: 'volumeBtnHover'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'unmute': [{
                on: ['touchstart', 'click'],
                call: 'unmuteClk'
            }, {
                on: ['mouseout'],
                call: 'volumeBtnOut'
            }, {
                on: ['mousemove'],
                call: 'volumeBtnHover'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'vmax': [{
                on: ['touchstart', 'click'],
                call: 'vmaxClk'
            }, {
                on: ['mouseout'],
                call: 'volumeBtnOut'
            }, {
                on: ['mousemove'],
                call: 'volumeBtnHover'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],

            'open': [{
                on: ['touchstart', 'click'],
                call: 'openCloseClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'close': [{
                on: ['touchstart', 'click'],
                call: 'openCloseClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'loop': [{
                on: ['touchstart', 'click'],
                call: 'loopClk'
            }, {
                on: ['touchend'],
                call: 'touchEnd'
            }],
            'draghandle': {
                on: ['mousedown'],
                call: 'handleStartDragListener'
            },

            'controls': null,
            'title': null
        },

        config: {
            /* Plugin: cb - enable/disable fade away of overlayed controls */
            toggleMute: false,
            showCuePoints: false,
            fadeDelay: 2500,
            showOnStart: false,
            showOnIdle: false,

            /* Default layout */
            controlsTemplate: '<ul class="left"><li><div %{play}></div><div %{pause}></div></li></ul><ul class="right"><li><div %{fsexit}></div><div %{fsenter}></div></li><li><div %{loquality}></div><div %{hiquality}></div></li><li><div %{tracksbtn}></div></li><li><div %{vmax}></div></li><li><div %{vslider}><div %{vmarker}></div><div %{vknob}></div></div></li><li><div %{mute}></div></li><li><div %{timeleft}>%{hr_elp}:%{min_elp}:%{sec_elp} | %{hr_dur}:%{min_dur}:%{sec_dur}</div></li><li><div %{next}></div></li><li><div %{prev}></div></li></ul><ul class="bottom"><li><div %{scrubber}><div %{loaded}></div><div %{playhead}></div><div %{scrubberknob}></div><div %{scrubberdrag}></div></div></li></ul><div %{scrubbertip}>%{hr_tip}:%{min_tip}:%{sec_tip}</div>'
        },

        initialize: function () {

            var ref = this,
                playerHtml = this.playerDom.html(),
                useTemplate = true,
                classPrefix = this.pp.getNS();

            // check if ANY control element already exists        
            for (var i in this.controlElementsConfig) {
                if (playerHtml.match(new RegExp(classPrefix + i, 'gi'))) {
                    useTemplate = false;
                    break;
                }
            }

            if (useTemplate) {
                this.cb = this.applyToPlayer($(('<div/>')).addClass('controls'));
                this.applyTemplate(this.cb, this.getConfig('controlsTemplate'));
            } else {
                this.cb = this.playerDom.find("." + classPrefix + 'controls');
            }

            // find (inter)active elements    
            for (var i in this.controlElementsConfig) {
                this.controlElements[i] = $(this.playerDom).find('.' + classPrefix + i);
                $p.utils.blockSelection($(this.controlElements[i]));
            }

            this.addGuiListeners();
            this.hidecb(true);
            this.pluginReady = true;
        },

        /* parse and apply controls dom-template */
        applyTemplate: function (dest, templateString) {
            var ref = this,
                classPrefix = this.pp.getNS();

            // apply template string if required:
            if (templateString) {
                // replace tags by class derictive
                var tagsUsed = templateString.match(/\%{[a-zA-Z_]*\}/gi);
                if (tagsUsed != null) {
                    $.each(tagsUsed, function (key, value) {
                        var cn = value.replace(/\%{|}/gi, '');
                        if (value.match(/\_/gi)) {
                            // replace with span markup
                            templateString = templateString.replace(value, '<span class="' + classPrefix + cn + '"></span>');
                        } else {
                            // replace with className
                            templateString = templateString.replace(value, 'class="' + classPrefix + cn + '"');
                        }
                    });
                }
                dest.html(templateString);
            }
        },

        updateDisplay: function () {
            var ref = this,
                state = this.pp.getState();

            // clearTimeout(this._cTimer);

            if (this.pp.getHasGUI()) return;

            // nothing to do
            if (this.getConfig('controls') == false) {
                this.hidecb(true);
                return;
            }

            // prev / next button
            if (this.pp.getItemCount() < 2 || this.getConfig('disallowSkip')) {
                this._active('prev', false);
                this._active('next', false);
            } else {
                this._active('prev', true);
                this._active('next', true);
            }

            if (this.pp.getItemIdx() < 1) {
                this._active('prev', false);
            }

            if (this.pp.getItemIdx() >= this.pp.getItemCount() - 1) {
                this._active('next', false);
            }

            // play / pause button
            if (this.getConfig('disablePause')) {
                this._active('play', false);
                this._active('pause', false);
            } else {
                if (state === 'PLAYING') this.drawPauseButton();
                if (state === 'PAUSED') this.drawPlayButton();
                if (state === 'IDLE') this.drawPlayButton();
            }

            // stop button
            this._active('stop', state !== 'IDLE');



            // rewind & forward
            this._active('forward', state !== 'IDLE');
            this._active('rewind', state !== 'IDLE');


            // fullscreen button    
            if (this.pp.getInFullscreen() === true) {
                this.drawExitFullscreenButton();
            } else {
                this.drawEnterFullscreenButton();
            }

            if (!this.getConfig('enableFullscreen')) {
                this._active('fsexit', false);
                this._active('fsenter', false);
            }


            // loop button
            this._active('loop', true);
            this.controlElements.loop
                .addClass( this.pp.getConfig('loop') ? 'on' : 'off' )
                .removeClass( !this.pp.getConfig('loop') ? 'on' : 'off' );

            // hd / sd toggl
            this.displayQualityToggle();

            // init time display
            this.displayTime();

            // init volume display
            this.displayVolume(this._getVolume());
        },

        /* assign listener methods to controlbar elements */
        addGuiListeners: function () {
            var ref = this;

            // if (!this.getConfig('controls')) return;

            $.each(this.controlElementsConfig, function (key, elmCfg) {
                if (elmCfg == null) {
                    return true;
                }

                if (!(elmCfg instanceof Array)) {
                    elmCfg = [elmCfg]
                }

                for (var subset = 0; subset < elmCfg.length; subset++) {

                    if (elmCfg[subset].on == null) continue;

                    $.each(elmCfg[subset].on, function (evtKey, eventName) {

                        // thanx to FF3.6 this approach became a little complicated:
                        var isSupported = ("on" + eventName in window.document),
                            callback = elmCfg[subset].call;

                        if (!isSupported) {
                            var el = document.createElement('div')
                            el.setAttribute("on" + eventName, 'return;');
                            isSupported = (typeof el["on" + eventName] == 'function');

                        }

                        if (isSupported) {
                            ref.controlElements[key].bind(eventName, function (event) {
                                ref.clickCatcher(event, callback, ref.controlElements[key]);
                            });

                        }

                    });
                }
                return true;                
            });
            this.cb.mousemove(function (event) {
                ref.controlsFocus(event);
            });
            this.cb.mouseout(function (event) {
                ref.controlsBlur(event);
            });
        },

        /* generic click handler for all controlbar buttons */
        clickCatcher: function (evt, callback, element) {
            var ref = this;
            
            evt.stopPropagation();
            evt.preventDefault();
            // $p.utils.log('Controlbar: Click', element, callback, evt)
            this[callback](evt, element);

            return false;
        },


        touchEnd: function () {
            var ref = this;
            this._cTimer = setTimeout(function () {
                ref.hidecb();
            }, this.getConfig('fadeDelay'));
            this._noHide = false;
        },


        /*******************************
        DOM Manipulations
        *******************************/
        drawTitle: function () {
            this.controlElements['title'].html(this.getConfig('title', ''));
        },

        hidecb: function (instant) {

            clearTimeout(this._cTimer);

            if (this.cb == null) return;

            // no controls at all:
            if (this.getConfig('controls') == false) {
                this.cb.removeClass('active').addClass('inactive');
                return;
            }
                        
                        if (this.getConfig('showOnIdle') && this.pp.getState('IDLE'))
                            return;

            if (instant)
                this._noHide = false;

            // do not hide nao
            if (this._noHide || this.cb.hasClass('inactive'))
                return;

            this.cb.removeClass('active').addClass('inactive');
            this.sendEvent('hide', this.cb);

        },

        showcb: function (fade) {

            var ref = this;

            // always clear timeout, stop animations
            clearTimeout(this._cTimer);

            // hide for current playback component
            if (this.pp.getHasGUI() || this.getConfig('controls') == false) {
                this.cb.removeClass('active').addClass('inactive');
                return;
            }

            // player is IDLEing
            if (this.cb == null) return;
            if ("IDLE|AWAKENING|ERROR".indexOf(this.pp.getState()) > -1 && fade != true) return;

            // is visible  restart timer:
            if (this.cb.hasClass('active') && fade !== false) {
                this._cTimer = setTimeout(function () {
                    ref.hidecb();
                }, this.getConfig('fadeDelay'));
                return;
            };

            // show up:
            this.cb.removeClass('inactive').addClass('active');
            this.sendEvent('show', this.cb);
            this._cTimer=setTimeout(
                function() {
                    ref.hidecb();
                }, this.getConfig('fadeDelay')
            );            
        },

        displayTime: function (pct, dur, pos) {

            if (this.pp.getHasGUI()) return;

            var percent = Math.round((pct || this.pp.getLoadPlaybackProgress() || 0) * 10) / 10,
                duration = dur || this.pp.getDuration() || 0,
                position = pos || this.pp.getPosition() || 0,
                times = $.extend({}, this._clockDigits(duration, 'dur'), this._clockDigits(position, 'elp'), this._clockDigits(duration - position, 'rem'));

            // limit updates
            if (this.controlElements['playhead'].data('pct') != percent) {

                // update scrubber:
                this.controlElements['playhead'].data('pct', percent).css({
                    width: percent + "%"
                });
                this.controlElements['scrubberknob'].css({
                    left: percent + "%"
                });

                // update numeric displays
                for (var key in this.controlElements) {
                    if (key == 'cb')
                        break;

                    if (times[key]) {
                        $.each(this.controlElements[key], function () {
                            $(this).html(times[key]);
                        });
                    }
                }
            }

        },

        displayProgress: function () {
            var percent = Math.round(this.pp.getLoadProgress() * 10) / 10;

            // limit updates
            if (this.controlElements['loaded'].data('pct') != percent) {
                this.controlElements['loaded'].data('pct', percent).css("width", percent + "%");
            };
        },

        displayVolume: function (volume) {

            var ref = this;

            if (this._vSliderAct == true) return;
            if (volume == null) return;

            var isVisible = this.cb.hasClass('active'),
                ref = this,
                fixed = this.getConfig('fixedVolume'),
                toggleMute = (this.controlElements['mute'].hasClass('toggle') || this.controlElements['unmute'].hasClass('toggle') || this.getConfig('toggleMute'));

            // hide volume mess in case volume is fixed
            this._active('mute', !fixed);
            this._active('unmute', !fixed);
            this._active('vmax', !fixed);
            this._active('vknob', !fixed);
            this._active('vmarker', !fixed);
            this._active('vslider', !fixed);

            if (fixed) return;

            // make controls visible in order to allow dom manipulations
            // this.cb.stop(true, true).show();
            if (this.controlElements['vslider'].width() > this.controlElements['vslider'].height()) {
                this.controlElements['vmarker'].css('width', volume * 100 + "%");
                this.controlElements['vknob'].css('left', volume * 100 + "%");
            } else {
                this.controlElements['vmarker'].css('height', volume * 100 + "%");
                this.controlElements['vknob'].css('top', (100 - volume * 100) + "%");
            }

            // "li" hack
            var lis = this.controlElements['volume'].find('li'),
                set = lis.length - Math.ceil((volume * 100) / lis.length);

            for (var i = 0; i <= lis.length; i++) {
                if (i >= set) $(lis[i]).addClass('active');
                else $(lis[i]).removeClass('active');
            }


            if (toggleMute) {
                switch (parseFloat(volume)) {
                case 0:
                    this._active('mute', false);
                    this._active('unmute', true);
                    this._active('vmax', true);
                    break;

                default:
                    this._active('mute', true);
                    this._active('unmute', false);
                    this._active('vmax', false);
                    //  vknob.css('left', volume*(vslider.width()-(vknob.width()/2))+"px");  
                    break;
                }
            }

            // hide again - if necessary
            if (isVisible) {
                this.cb.fadeTo(1, .99).fadeTo(1, 1, function () {
                    ref.cb.removeAttr('style');
                })
            }
        },

        displayCuePoints: function (duration) {

            var ref = this,
                prefix = this.pp.getNS();

            if (!this.getConfig('showCuePoints'))
                return;

            ref.controlElements['scrubber'].remove('.' + prefix + 'cuepoint');

            $.each(this.pp.getCuePoints() || [], function () {

                var blipWidth = Math.max(100 / duration, Math.round(duration / 100), 1),
                    // Math.max( (this.off - this.off / duration, Math.round(duration/100), 1),
                    blipPos = (this.on * 100 / duration) - ((blipWidth / 2) * 100 / duration),
                    that = this,
                    player = ref.pp,
                    blip = $(document.createElement('div'))
                        .addClass(prefix + 'cuepoint')
                        .addClass('inactive')
                        .css('left', blipPos + "%")
                        .css('width', blipWidth + "%")
                        .data('on', this.on);

                if (this.title != '')
                    blip.attr('title', this.title);

                this.addListener('unlock', function () {
                    $(blip).removeClass('inactive').addClass('active');
                    blip.click(function () {
                        ref.pp.setPlayhead(blip.data('on'))
                    })
                });

                ref.controlElements['scrubber'].append(blip);

            })

        },

        drawPauseButton: function (event) {
            this._active('pause', true);
            this._active('play', false);
        },

        drawPlayButton: function (event) {
            this._active('pause', false);
            this._active('play', true);
        },


        drawEnterFullscreenButton: function (event) {
            this._active('fsexit', false);
            this._active('fsenter', true);
        },

        drawExitFullscreenButton: function (event) {
            this._active('fsexit', true);
            this._active('fsenter', false);
        },

        displayQualityToggle: function (qual) {

            var qualsCfg = this.getConfig('playbackQualities'),
                qualsItm = this.pp.getPlaybackQualities(),
                classPrefix = this.pp.getNS();
            best = [];

            // off
            if (qualsItm.length < 2 || qualsCfg.length < 2) {
                this.controlElements['loquality'].removeClass().addClass('inactive').addClass(classPrefix + 'loquality').data('qual', '');
                this.controlElements['hiquality'].removeClass().addClass('inactive').addClass(classPrefix + 'hiquality').data('qual', '');
                return;
            }

            // get two best variants
            qualsCfg.sort(function (a, b) {
                return a.minHeight - b.minHeight;
            });
            for (var i = qualsCfg.length; i--; i > 0) {
                if ($.inArray(qualsCfg[i].key, qualsItm) > -1)
                    best.push(qualsCfg[i].key);
                if (best.length > 1)
                    break;
            }

            this.cb.addClass('qualities');
            if (best[0] == this.pp.getPlaybackQuality()) {
                this._active('loquality', true).addClass('qual' + best[1]).data('qual', best[1]);
                this._active('hiquality', false).addClass('qual' + best[0]).data('qual', best[0]);
            } else {
                this._active('loquality', false).addClass('qual' + best[1]).data('qual', best[1]);
                this._active('hiquality', true).addClass('qual' + best[0]).data('qual', best[0]);
            }
        },


        /*******************************
        Player Event Handlers
        *******************************/
        itemHandler: function (data) {
            $(this.cb).find('.' + this.pp.getNS() + 'cuepoint').remove();
            this.pp.setVolume(this._getVolume())
            this.updateDisplay();
            this.hidecb(true);
            this.drawTitle();
            this.displayQualityToggle();
            this.pluginReady = true;
        },

        startHandler: function () {
            this.pp.setVolume(this._getVolume());
            if (this.getConfig('showOnStart') == true) {
                this.showcb(true);
            } else {
                this.hidecb(true);
            }
        },

        readyHandler: function (data) {
            clearTimeout(this._cTimer);
            if (this.getConfig('showOnIdle')) {
                this.showcb(true);
                this.cb.removeClass('inactive').addClass('active').show();
            }
            this.pluginReady = true;
        },

        stateHandler: function (state) {
            this.updateDisplay();

            if ('STOPPED|AWAKENING|IDLE|DONE'.indexOf(state) > -1) {
                this.displayTime(0, 0, 0);
                this.displayProgress(0);
                if (this.pp.getIsMobileClient()) {
                    this.hidecb(true);
                }
            }

            if ('STOPPED|DONE|IDLE'.indexOf(state) > -1) {
                this.hidecb(true);
                return;
            }

            if ('ERROR'.indexOf(state) > -1) {
                this._noHide = false;
                this.hidecb(true);
            }

            this.displayProgress();
        },

        scheduleModifiedHandler: function () {
            if (this.pp.getState() === 'IDLE') return;
            this.updateDisplay();
            this.displayTime();
            this.displayProgress();
        },

        volumeHandler: function (value) {
            try {
               if (value>0)
                   this.cookie('muted', false);
                   
               if (!this.cookie('muted'))
                   this.cookie('volume', value);
            } catch(e){console.log(e)}
            this.displayVolume(this._getVolume());
        },

        progressHandler: function (obj) {
            this.displayProgress();
        },

        timeHandler: function (obj) {
            this.displayTime();
            this.displayProgress();
        },

        qualityChangeHandler: function (qual) {
            this.displayQualityToggle(qual);
        },
        
        streamTypeChangeHandler: function (streamType) {
            if (streamType=='dvr') {
                this._isDVR = true;
                this.setActive(this.controlElements['golive'], true);
            }
        },
        
        isLiveHandler: function (islive) {
            if (islive) {
                this.controlElements['golive'].addClass('on').removeClass('off');
            } else {
                this.controlElements['golive'].addClass('off').removeClass('on');
            }
        },            

        fullscreenHandler: function (inFullscreen) {

            var ref = this,
                classPrefix = this.pp.getNS();

            clearTimeout(this._cTimer);

            this._noHide = false;
            this._vSliderAct = false;

            if (!this.getConfig('controls')) return;
            if (!this.getConfig('enableFullscreen')) return;

            if (inFullscreen) {
                this.cb.addClass('fullscreen');
                this.drawExitFullscreenButton();
            } else {
                this.cb.removeClass('fullscreen');
                this.drawEnterFullscreenButton();
            }

            if (this.pp.getState() == 'IDLE' && !this.getConfig('showOnIdle'))
                this.hidecb(true);
        },        
        
        durationChangeHandler: function (dur) {
            this.displayCuePoints(dur);
        },
        
        errorHandler: function (value) {
            this.hidecb(true);
        },

        leftclickHandler: function () {
            this.mouseleaveHandler();
        },

        focusHandler: function (evt) {
            this.showcb();
        },
        
        mouseenterHandler: function (evt) {
            this.showcb();
        },        

        mousemoveHandler: function (evt) {
            if (this.pp.getState('STARTING')) return;             
            this.showcb();
        },
        
        mouseleaveHandler: function() {},
        
        mousedownHandler: function (evt) {
            this.showcb();     
        },
        
        /*******************************
        ControlUI Event LISTENERS
        *******************************/
        controlsFocus: function (evt) {
            
                this._noHide = true;
        },

        controlsBlur: function (evt) {
            this._noHide = false;
        },

        setQualityClk: function (evt) {
            this.pp.setPlaybackQuality($(evt.currentTarget).data('qual'));
        },

        goliveClk: function (evt) {
            this.pp.setSeek(-1);
        },
        
        playClk: function (evt) {
            this.pp.setPlay();
        },

        pauseClk: function (evt) {
            this.pp.setPause();
        },

        stopClk: function (evt) {
            this.pp.setStop();
        },

        startClk: function (evt) {
            this.pp.setPlay();
        },

        controlsClk: function (evt) {},

        prevClk: function (evt) {
            this.pp.setActiveItem('previous');
        },

        nextClk: function (evt) {
            this.pp.setActiveItem('next');
        },

        forwardClk: function (evt) {
            this.pp.setPlayhead('+10');
        },

        rewindClk: function (evt) {
            this.pp.setPlayhead('-10');
        },

        muteClk: function (evt) {
            this.cookie('muted', true);
            this.pp.setVolume(0);
        },

        unmuteClk: function (evt) {
            this.cookie('muted', false);
            this.pp.setVolume(this._getVolume());
        },

        vmaxClk: function (evt) {
            this.cookie('muted', false);
            this.pp.setVolume(1);
        },

        enterFullscreenClk: function (evt) {
            this.pp.setFullscreen(true);
        },

        exitFullscreenClk: function (evt) {
            this.pp.setFullscreen(false);
        },

        loopClk: function (evt) {
            this.pp.setLoop($(evt.currentTarget).hasClass('inactive') || false);
            this.updateDisplay();
        },

        vmarkerClk: function (evt) {
            vsliderClk(evt);
        },

        openCloseClk: function (evt) {
            var ref = this;
            $($(evt.currentTarget).attr('class').split(/\s+/)).each(function (key, value) {
                if (value.indexOf('toggle') == -1) return;
                ref.playerDom.find('.' + value.substring(6)).slideToggle('slow', function () {
                    ref.pp.setSize();
                });
                ref.controlElements['open'].toggle();
                ref.controlElements['close'].toggle()
            });
        },

        volumeBtnHover: function (evt) {
            clearTimeout(this._outDelay);
            this.setActive(this.controlElements['volumePanel'], true);
        },

        volumeBtnOut: function (evt, elm) {
            var ref = this;
            if (evt.currentTarget != elm.get(0)) return;
            if (evt.relatedTarget == elm.get(0)) return;
            this._outDelay = setTimeout(function () {
                ref.setActive(ref.controlElements['volumePanel'], false);
            }, 100);
        },

        vsliderClk: function (evt) {
            if (this._vSliderAct == true) return;


            var slider = $(this.controlElements['vslider']),
                orientation = slider.width() > slider.height() ? 'hor' : 'vert',
                totalDim = (orientation == 'hor') ? slider.width() : slider.height(),
                pageX = (evt.originalEvent.touches) ? evt.originalEvent.touches[0].pageX : evt.pageX,
                pageY = (evt.originalEvent.touches) ? evt.originalEvent.touches[0].pageY : evt.pageY,
                requested = (orientation == 'hor') ? pageX - slider.offset().left : pageY - slider.offset().top,
                result = 0;

            if (requested < 0 || isNaN(requested) || requested == undefined) {
                result = 0;
            } else {
                result = (orientation == 'hor') ? (requested / totalDim) : 1 - (requested / totalDim);
            }

            this.pp.setVolume(result);            
        },

        scrubberShowTooltip: function (event) {
            if (this.pp.getDuration() == 0) return;
            clearTimeout(this._cTimer);
            this.setActive(this.controlElements['scrubbertip'], true)
        },

        scrubberHideTooltip: function (event) {
            this.setActive(this.controlElements['scrubbertip'], false)
        },

        scrubberdragTooltip: function (evt) {

            // IE amd Chrome issues (mouseenter,mouseleave)
            if (this.pp.getDuration() == 0) return;
            this.setActive(this.controlElements['scrubbertip'], true)

            var slider = $(this.controlElements['scrubberdrag'][0]),
                loaded = $(this.controlElements['loaded'][0]),
                tip = $(this.controlElements['scrubbertip']),
                pageX = (evt.originalEvent.touches) ? evt.originalEvent.touches[0].pageX : evt.pageX,
                pageY = (evt.originalEvent.touches) ? evt.originalEvent.touches[0].pageY : evt.pageY,
                newPos = pageX - slider.offset().left - (tip.outerWidth() / 2),
                timeIdx = this.pp.getDuration() / 100 * ((pageX - slider.offset().left) * 100 / slider.width()),
                times = this._clockDigits(timeIdx, 'tip');
                
            if (this._isDVR) { 
                timeIdx =  this.pp.getDuration() - timeIdx; 
                var then = new Date( (new Date().getTime() / 1000 - timeIdx) * 1000), // date minus timeidx
                    then = then.getSeconds() + (60 * then.getMinutes()) + (60 * 60 * then.getHours()); // second of today
                    
                times = this._clockDigits( then , 'tip');
            }

            for (var key in this.controlElements) {
                if (key == 'cb')
                    break;

                if (times[key]) {
                    $.each(this.controlElements[key], function () {
                        $(this).html(times[key]);
                    });
                }
            }

            newPos = (newPos < 0) ? 0 : newPos;
            newPos = (newPos > slider.width() - tip.outerWidth()) ? slider.width() - tip.outerWidth() : newPos;

            tip.css({
                left: newPos + "px"
            })
        },

        scrubberdragStartDragListener: function (event) {

            if (this.getConfig('disallowSkip') == true) return;
            this._sSliderAct = true;

            var ref = this,
                slider = $(this.controlElements['scrubberdrag'][0]),
                loaded = $(this.controlElements['loaded'][0]),
                second = 0,
                dx = Math.abs(parseInt(slider.offset().left) - event.clientX),

                applyValue = function (event) {

                    var newPos = Math.abs(slider.offset().left - event.clientX);
                    newPos = (newPos > slider.width()) ? slider.width() : newPos;
                    newPos = (newPos > loaded.width()) ? loaded.width() : newPos;
                    newPos = (newPos < 0) ? 0 : newPos;
                    newPos = Math.abs(newPos / slider.width()) * ref.pp.getDuration();

                    // avoid strange "mouseMove"-flooding in IE7+8
                    if (newPos > 0 && newPos != second) {
                        second = newPos;
                        ref.pp.setPlayhead(second);
                    }

                },

                mouseUp = function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();

                    ref.playerDom.unbind('mouseup.slider');

                    slider.unbind('mousemove', mouseMove);
                    slider.unbind('mouseup', mouseUp);
                    ref._sSliderAct = false;

                    return false;
                },

                mouseMove = function (evt) {
                    clearTimeout(ref._cTimer);
                    evt.stopPropagation();
                    evt.preventDefault();
                    applyValue(evt);
                    return false;
                };

            this.playerDom.bind('mouseup.slider', mouseUp);
            slider.mouseup(mouseUp);
            slider.mousemove(mouseMove);

            applyValue(event);

        },

        vknobStartDragListener: function (event, domObj) {
            this._vSliderAct = true;

            var ref = this,
                sliderIdx = (this.pp.getInFullscreen() === true && this.controlElements['vslider'].length > 1) ? 1 : 0,
                knob = $(domObj[sliderIdx]),
                slider = $(this.controlElements['vslider'][sliderIdx]),
                dx = Math.abs(parseFloat(knob.position().left) - event.clientX),
                dy = Math.abs(parseFloat(knob.position().top) - event.clientY),
                
                volume = 0,
                mouseUp = function (mouseupevt) {
                    ref.playerDom.unbind('mouseup', mouseUp);
                    slider.unbind('mousemove', mouseMove);
                    slider.unbind('mouseup', mouseUp);
                    knob.unbind('mousemove', mouseMove);
                    knob.unbind('mouseup', mouseUp);
                    ref._vSliderAct = false;

                    return false;
                },

                mouseMove = function (dragevent) {
                    clearTimeout(ref._cTimer);
                    var newXPos = (dragevent.clientX - dx),
                        newXPos = (newXPos > slider.width() - knob.width() / 2) ? slider.width() - (knob.width() / 2) : newXPos,
                        newXPos = (newXPos < 0) ? 0 : newXPos,
                        newYPos = (dragevent.clientY - dy),                        
                        newYPos = (newYPos > slider.height() - knob.height() / 2) ? slider.height() - (knob.height() / 2) : newYPos,
                        newYPos = (newYPos < 0) ? 0 : newYPos;
                    
                    if (ref.controlElements['vslider'].width() > ref.controlElements['vslider'].height()) {                    
                        knob.css('left', newXPos + 'px');
                        volume = Math.abs(newXPos / (slider.width() - (knob.width() / 2)));
                        $(ref.controlElements['vmarker'][sliderIdx]).css('width', volume * 100 + "%");
                    } else {
                        knob.css('top', newYPos + 'px');
                        volume = 1 - Math.abs(newYPos / (slider.height() - (knob.height() / 2)));
                        $(ref.controlElements['vmarker'][sliderIdx]).css('height', volume * 100 + "%");
                    }
                };

            // this.playerDom.mousemove(mouseMove);
            this.playerDom.mouseup(mouseUp);

            slider.mousemove(mouseMove);
            slider.mouseup(mouseUp);

            knob.mousemove(mouseMove);
            knob.mouseup(mouseUp);

        },

        handleStartDragListener: function (evt, domObj) {

            var ref = this,
                dx = Math.abs(parseInt(this.cb.position().left) - evt.clientX),
                dy = Math.abs(parseInt(this.cb.position().top) - evt.clientY);

            /*
    this._initalPosition = {
        top: this.cb.css('top'),
        bottom: this.cb.css('bottom'),
        left: this.cb.css('left'),
        right: this.cb.css('right')
        
    };
    */
            // this._initalPosition = $.extend({}, this.cb.attr('style'), this.cb.css());


            var mouseUp = function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                ref.playerDom.unbind('mouseup', mouseUp);
                ref.playerDom.unbind('mouseout', mouseUp);
                ref.playerDom.unbind('mousemove', mouseMove);
                return false;
            }

            var mouseMove = function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                clearTimeout(ref._cTimer);
                var newXPos = (evt.clientX - dx);
                newXPos = (newXPos > ref.playerDom.width() - ref.cb.width()) ? ref.playerDom.width() - ref.cb.width() : newXPos;
                newXPos = (newXPos < 0) ? 0 : newXPos;
                ref.cb.css('left', newXPos + 'px');
                var newYPos = (evt.clientY - dy);
                newYPos = (newYPos > ref.playerDom.height() - ref.cb.height()) ? ref.playerDom.height() - ref.cb.height() : newYPos;
                newYPos = (newYPos < 0) ? 0 : newYPos;
                ref.cb.css('top', newYPos + 'px');
                return false;
            }

            this.playerDom.mousemove(mouseMove);
            this.playerDom.mouseup(mouseUp);
            // this.playerDom.mouseout(mouseUp);
        },

        /*******************************
            GENERAL HELPERS
        *******************************/
        _getVolume: function() {

            var volume = parseFloat(this.cookie('volume') || this.getConfig('volume') || 0.5),
                muted = this.cookie('muted') || false;
            
            if (this.getConfig('fixedVolume') || volume==null)
                return this.getConfig('volume');
                
            if (muted) return 0;
            
            return volume;
        },
        
        _active: function (elmName, on) {
            var dest = this.controlElements[elmName];
            if (on == true) dest.addClass('active').removeClass('inactive');
            else dest.addClass('inactive').removeClass('active');
            return dest;
        },

        /* convert a num of seconds to a digital-clock like display string */
        _clockDigits: function (secs, postfix) {

            if (secs < 0 || isNaN(secs) || secs == undefined) {
                secs = 0;
            }

            var hr = Math.floor(secs / (60 * 60)),
                divisor_for_minutes = secs % (60 * 60),
                min = Math.floor(divisor_for_minutes / 60),
                min_abs = hr * 60 + min,
                divisor_for_seconds = divisor_for_minutes % 60,
                sec = Math.floor(divisor_for_seconds),
                sec_abs = secs,
                result = {};
                
            result['min_' + postfix] = (min < 10) ? "0" + min : min;
            result['min_abs_' + postfix] = (min_abs < 10) ? "0" + min_abs : min_abs;
            result['sec_' + postfix] = (sec < 10) ? "0" + sec : sec;
            result['sec_abs_' + postfix] = (sec_abs < 10) ? "0" + sec_abs : sec_abs;            
            result['hr_' + postfix] = (hr < 10) ? "0" + hr : hr;
            
            return result;
        }
    }
});