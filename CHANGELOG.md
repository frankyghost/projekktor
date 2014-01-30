PROJEKKTOR - simply mighty <video>
http://www.projekktor.com

V1.3.09
=======

  fixes:
  * [core] general issues with jQuery older than V1.6.x
  * [core] leaving fullscreen on "done" doesn´t make the player stuck in a loop anymore
  * [core] always get some poster to display in case of invalid or incomplete quality-toggle setups
  * [core] several Android related issues fixed
  
  additions:  
  * [code] added volume knob for vertical volume sliders
  

V1.3.08
=======

  fixes:
  * [core] general scrubbing issues after dynamic change of platforms
  
  
V1.3.07
=======

  fixes:
  * [core] quality toggled audio covers
  * [plugin:controlbar] loop button behavior
  

V1.3.06
=======

 fixes:
 * [core] OSMF model: fixed problems with not or not properly promoted load progress information 


V1.3.05
=======

 additions:
 * [core] new possibilities to bypass hardware acceleration during flash fallback
 

V1.3.04
=======

  additions:
  * [core] error messages can now also be customized on item level
  * [core] HLS on Android still sucks - added a workaround anyway
  
  fixes:
  * [core] general IE issues
  * [core] proper display of error messages in case no proper platform support has been found on client side.
  * [core] issues with quality-toggle-enabled poster images


V1.3.03
=======

  additions:
  * [model:OSMF] added DVR support
  * [plugin:controlbar] added "go live" button
  * [plugin:controlbar] scrubber tooltip know shows relative time on DVR
  
  fixes:
  * [core] proper restore of user quality prefs for dynamic streams
  * [core] removed improper request for undefined poster images


V1.3.02
=======

  fixes:
  * [StrobeMediaPlayer] fixed cross domain issues
  

V1.3.01
=======

  fixes:
  * [core] fixed iframe fullscreen bug - sorry folks


V1.3.00
=======

  addtions:
  * [core] added OSMF player model
  * [core] "streamType" can now be specified separately for each alternate media entry of a playlist item (allows mixing e.g. of RTMP, HTTP for one single playlist item)
  * [core] made mJpeg multipart streams available for clients with VLC Web Plugin
  
  fixes:
  * [core] fixed jQuery 1.4 issues
  * [core] now even Firefox accepts to leave fullscreen once "done" is being triggered

  changes:
  * [core] made OSMF player model default
  * [core] missing or broken plugins are now reported via an alert()
  * [core] set default duration for images to one second
  

V1.2.38
=======
  
  additions:
  * [core] models can now overwrite existing ones - allows alternate ones without rebuild of the player-script
  
  fixes:
  * [core] general HLS audio issues
  * [core] load progress indicator for HLS audio
  

V1.2.37
=======

  additions:
  * [core] improved debugging for custom listeners and plugins (try-catch-log on "debug: true")
  
  fixes:
  * [core] race condition issue introduced with V1.2.35 while on HTML5 playback
  * [core] wildcarded "streamType"s now work properly
  * [core] native audio (live) stream is now properly inherited form AUDIO not from VIDEO model

  

V1.2.36
=======

  additions:
  * [core] "leaveFullscreen" config option. On "true" player tries to leave fullscreen once "complete"ed.
  * [plugin:controlbar] new template tags "min_abs" and "secs_abs" making it possible to get visually rid of the next higher divisor (e.g. "185 minutes" instead of "2 hours and 25 minutes")

  fixes:
  * [core] several AUDIO related issues fixed - especially HLS and .m3u related ones
  * [core] minor Android issues fixed
  * [core] an item session doesn´t fire any events or updates after "error" anymore
  
  

V1.2.35
=======

  additions:
  * [plugin:controlbar] added scrubber tooltip showing time-index depending on cursor position - pls update your theme

  fixes:
  * [core] volume toggling issues on audio playback via flash
  * [core] fixed compatibility issues with jQuery < 1.6.1
  * [core] on quality-toggle while watching pseudo-streams time offset parameter is now properly appended
  
  changes:
  * [core] enabled VLC Web Plugin support by default
  * [core] maed silly ".setPlayhead()" also available as ".setSeek()"
  
  

V1.2.34
=======

  additions:
  * [theme] added subtitle-button set
  * [core] new config option "cookieDomain"
  * [core] new config option "cookiePath"
  
  fixes:
  * [core] fixed false positive native-support detections
  * [core] fixed image model seeking issue

  changes:
  * [theme] changed directory-/name- scheme from /theme/style.css to /theme/<themename>/projekktor.style.css
  

V1.2.33
=======
  
  additions:
  * [core] added VLC Web Plugin Support - experimental - to unlock set config.platforms = ['browser', 'android', 'ios', 'vlc', 'native', 'flash']
  
  fixes:
  * [plugin:controlbar] improved volume- and mute/unmute handling
  * [core] prevent hopping time-index on seek in pseudo-streams
  * [core] fixed pseudo-stream-on-fash-fallback issues
  * [core] improved cookie handling
  * [core] fixed item id config
  * [core] .getItem() was totally messed up

  changes:
  * [core] argument values for .setPlayhead() are now internaly rounded to 2 decimal places
  * [core] improved platform detection incl. full version check 
  
  
V1.2.32
=======

  fixes:
  * [core] IE8 issue due to a left console.log statement


V1.2.31
=======

  additions:
  * [core] new event "seek"
  

  fixes:
  * [core] even more interesting fullscreen issues fixed
  * [core] fixed cross-domain iframe issues - detection is now more accurate and will check for "allowFullscreen" attribute(s)

  changes:
  * [core] "seeking" and "seeked" are no longer player "state"s. Both are now properties of the new "seek"-event.
  
  
V1.2.30
=======

 fixes:
 * [core] fullscreen issues in case dimensions are set via config options


V1.2.29
=======

 fixes:
 * [core] .getConfig() now returns proper plugin cfg data


V1.2.28
=======

 additions:
 * [core] config option "ratio" - "16/9" by default
 * [core] .setSize() now automatically sets "height" by "ratio"

 fixes:
 * [core] .getMediaDimensions() now returns proper data
 * [core] general liquid layout fixes
 
 changes:
 * [core] config option "_minWidth" depreciated
 * [core] config option "_minHeight" depreciated
 * [core] .setResize() depreciated
 

V1.2.27
=======

 fixes:
 * [core] "pause" event not longer triggered on start of media while on flash fallback
 * [core] "seeked" and "seeking" event are now properly triggered. 
 * [flash component] stripped useless code, several performance relevant fixes.



V1.2.26
=======

 fixes:
 * [core] minor performance tweaks
 * [core] disabling platforms works properly again
 * [flash component] fixed general scaling issues
 
 additions:
 * [core] added plugin-"click-to-play" support



V1.2.25
=======

  fixes:
  * [core] fixed poster scaling issues
  * [plugin:controlbar] fixed scrubber-flickering on seeking
  * [plugin:controlbar] fixed scrubber-tooltip positioning issues
  
  additions:
  * [plugin:controlbar] added a scrubber-knob option

  

V1.2.24
=======

  fixes:
  * [core] fixed poster quality toggling on "unbalanced" playlists where one or more format(s) provide more quality alternatives than the selected one.



V1.2.23
=======

  additions:
  * [core] it´s now possible to set up different poster images for each quality-setting (in analogy to media source quality arrays)

  fixes:
  * [plugin:controlbar] proper view reset on .setStop()
  
  

V1.2.22
=======

  additions:
  * [plugin:display] mouse cursor now automatically turns "pointer" on IDLE state
  
  fixes:
  * [core] fixed "autoplay" behavior on .reset() and .setFile()
  * [plugin:controlbar] volume controls are now properly set "inactive" on mobile devices
  * [plugin:display] mouse cursor now properly turns "none" after timeout in case click invoced play but mouse hasn´t moved afterwards



V1.2.21
=======

  additions:
  * [core] new API method ".setGotoCuePoint
  * [core] the player container now gets an additional class matching the player´s state
  * [plugin:controlbar] added scrubber-position tooltip
  * [plugin:controlbar] its now possible to have vertical volume sliders wihout further hacking
  
  changes:
  * [plugin:controlbar] volume of zero is no longer stored in cookie to avoid silent players accross sessions

  fixes:
  * [core] fixed event unbinding for plugin objects on .reset()
  


V1.2.20
=======

  additions:
  * [core] new API method ".getFrame()"
  * [core] new API method ".setFrame()"
  * [core] new config parameter "thereCanBeOnlyOne", default "true"
  * [core] on pages with multiple player instances, players with "thereCanBeOnlyOne" set to "true" will auto-stop all other players once they change to none IDLE state
  * [core] .addListener() & .removeListener() now support namespaces
  
  changes:
  * [core] improved seek accuracy for native video
  * [core] .removePlugin() is now .removePlugins() as it always accepted an array of plugins only
  
  fixes:
  * [core] fixed poster rescaling
  * [core] performance tweeks
  


V1.2.19
=======

  fixes:
  * [core] streamType "httpAudio" is now properly recognized by the native playback model
  * [core] fixed a very annoying fullscreen issue

  
  
V1.2.18
=======

  fixes:
  * [core] credentials are now always enabled on AJAX calls
  * [core] if player toggles DONE after being in fullscreen mode player containers with unset dimensions do not disappear any longer
  * [core] injecting new items to non IDLE players doesn´t force IDLE any longer
  * [core] fixed plugin version check routine
  * [plugin:display] clicking on testcards now works properly on items with "disallowSkip" set true
  * [plugin:contextmenu] proper iframe breaking on URL clicks where applicable.
  
  changes:
  * [core] CSS transitions are now disabled on mobile devices (performance issues)


V1.2.17
=======

  fixes:
  * [core] .setVolume() properly discards invalid values
  * [plugin:controlbar] click target for quality-button fixed


V1.2.16
=======

  fixes:
  * [core] DOM elements applied by plugins are now properly unbound
  * [core] .reset() did not unbind projekktor related events from document.window
  * [plugin:display] startbutton and buffer-indicator now unregister properly on .reset() or .destroy()
  
  changes:
  * [core] config option "controls" is now TRUE by default
  

V1.2.15
=======

  fixes:
  * [core] fixed logic issue in plugin interface
  * [core] fixed continuous playback issues on mobile devices
  * [plugin:display] startbutton and buffer-indicator now unregister properly on .reset() or .destroy()



V1.2.14
=======
  
  additions:
  * [core] compatibility-check for plugins via verion numbers
  
  fixes:
  * [core] some JWPlayer-model issues fixed
  * [core] issue with inter-plugin-communication fixed
  * [core] minor performance issues fixed
  * [core] using native audio shifted poster image down by one pixel
  * [theme] IE7 issues fixed

V1.2.13
=======
  
  additions:
  * [core] mounted <source>-tags can now be filled with addition "data-quality"-attributes
  

V1.2.12
=======

  additions:
  * [theme] Added quality toggle button.
  
  fixes:
  * [plugin:controlbar] fixed quality toggle logic mess
  * [flash component] fixed minor image scaling issues
  

V1.2.11
=======

  fixes:
  * [core] Fixed a plugin-interface-bug causing to mess up acitvation/de-activation of applied DOM containers


V1.2.10
=======

  fixes:
  * [core] Fixed general volume-handling issues in IE7-9
  

V1.2.09
=======

  fixes:
  * [core] D´oh, stupid bug caused player to crash instantly in IE.


V1.2.08
=======

  fixes:
  * [core] dynamic css-classes are now properly set and reset - thanks again to "bhweb"
  * [core] paused players now update time after seeking
  * [plugin:controlbar] controls are now properly set "inactive" on mouse-over and player fires "done"


V1.2.07
=======
  
  additions:
  * [core] new API method "getSource". Returns the exact video URL of the active media about to be played or playing
  * [core] new API method "getPlatform". Returns the platform/environment the active media, e.g. "native", "flash", "ios", "vlc" ...
  * [core] new item config-option "cat" - free text for categorizing video items. use at will.
  
  fixes:
  * [core] prevent key event promotion for "playpause" via <space>-key in order to avoid scrolling
  * [core] "fullscreen" event is now properly propagated over playlisted items
  * [core] player collapsed on "completed" ... thx to bhweb for pointing this one out
  * [core] "full viewport" now also works for IE7 when player is wrapped by a container with "position" CSS-directive ("hasLayout bug")
  * [plugin:controlbar] muting IDLE players now works properly
  * [plugin:controlbar] volume is now properly restored from in a cookie
  
  changes:
  * [core] configured "keys"-callbacks now also recieve the original event as second argument
  * [core] removed hard-coded "max-width: 100%;" from playercontainer


V1.2.06
=======

 fixes:
 * [core] prevent IE7 under some conditions to crash on return from fullscreen
 * [plugin:controlbar] fixed "showOnIdle" behavior
 

V1.2.05
=======

 additions:
 * [plugin:display] mouse cursor now hides after 3 seconds of mouseover.
 
 fixes:
 * [core] fixed HLS playback issues on iDevices
 * [core] fixed misinterpreted "steamType" parameter
 
 changes:
 * [plugin:controlbar] removed all hardcoded animations from script. use CSS transitions instead.


V1.2.04
=======

 fixes:
 * [core] minor config-issue fixed


V1.2.03
=======

  fixes:
  * [core] general minor plugin interface issues fixed.
  

V1.2.02
=======

  fixes:
  * [core] Fixes "return to IDLE state" issues
  * [core] Fixed non starting video on FF for Android
  * [core] config parametes are now properly set in case of "false" or "null" values.
  * [plugin:controlbar] if no quality setup exists existing quality-toggle-buttons are now properly turned inactive


V1.2.01
=======

  fixes:
  * [core] Argh! Removed some debug-stuff.
  
  

V1.2.00
=======

  additions:
  * [core] added CORS capabilities for async. loaded playlists and plugin data
  * [core] plugins are now allowed to extend the API
  * [core] added "syncCuePoints"-method to allow dynamic injection of cuepoints into initialized and running players
  * [core] new player events: "firstquartile", "midpoint", "thirdquartile"
  * [core] new player event: "mousedown" - triggered when... ah, come on.
  * [core] new player event: "blur" - triggered once player looses focus
  * [core] new player event: "focus" - triggered once player receives focus
  * [core] new config option "forceFullViewport" to bypass native _media_ fullscreen on iPad and similar
  * [core] new config option "keys" for keyboard-control customization

  fixes:
  * [core] fixed random seek capabilities where available
  * [core] when leaving native fullscreen the scroll-position is now properly restored
  * [core] while seeking a flash pseudo stream the position indicator was set to maximum for a glimpse
  * [core] quality settings are stored in a cookie. Changing the quality-setup after a client already launched with the old setup caused quality-toggling and pseudo-streaming to break.
  * [core] fixed type by fileextension detection
  * [core] fixed issues while removing specific groups of cuepoints
  * [core] setting "disalowSkip" as player global made player not initialize
  * [core] general jQuery 1.8.x compatibility issues
  * [core] general IE8 issues  
  * [core] minor general fixes
  * [core] several major GoogleTV fixes
  * [core] improved "selfDestruct / destroy" mechanism

  changes:
  * [core] the general plugin-event handler has been removed in favour if an event specic handler (plugins_<pluginname><event>Handler)
  * [core] player container doesn´t prevent further propagation of keyboard events any longer
  * [core] dropped internal "leftclick", "rightclick" and "middleclick" events. Use "mousedown" instead and check button with "event.which".
  * [plugin:display] logo overlay functionality moved to a separated plugin (called... guess! correct: "logo")
  
  
  
  
V1.1.03
=======

  Sorry folks, just a quicky. More fixes coming soon.

  changes:
  * [core] mime type prefixes ("x-") are now ignored.



V1.1.02
=======

  fixes:
  * [core] in case of player errors flash detection intervals are now properly cleared
  * [core] proper namespace prefix set for plugins

  changes:
  * [core] removed "Invalid or inconsistent quality setup ..." error. In case your quality setup isn´t correct it will now simply be ignored.


V1.1.01
=======

  fixes:
  * [core] .setPlayhead() crashed IDLE players
  * [core] cookies sometimes were set to NULL
  * [core] quality-settings are now properly remembered, applied and promoted.
  * [core] cuepoints were not properly reset in players with playlists. caused them to fail on replay.
  * [plugin:controlbar] cuepoint-blips are now properly removed on COMPLETED
  
  addition:
  * {core] config option "keys" => set default keyboard commands as you like
  
  

V1.1.00
=======

 changes:
 * [core] ".getCssPrefix()" became ".getNS()" (get namespace)
 * [core] config option 'cssClassPrefix' became 'ns' (namespace)

 fixes:
 * [core] fixed issues where set cue-points where not properly unlocked in case media was completely pre-cached
 * [core] error message "no media scheduled" is now properly shown instead of "sorry, your browser can not ..."
 * [core] .getMediaType() always returned "video/mp4"
 * [core] prevent promotion of "mousemove" event in case of hovered fading elements
 * [plugin:controlbar] fixed general fading issues
 

V1.0.29
=======

 fixes:
 * [core] several performance enhancements (thx Lena)
 * [plugin:controlbar] on mobile devides controls didn´t fade away if "fade" is enabled

 additions:
 * [core] hitting "c" if debug is enabled dumps the current config object to console
 * [core] hitting "p" if debug is enabled dumps the current schedule / playlist object to console


V1.0.28
=======

 fixes:
 * [core] fixed a critical bug which caused .canPlay() to return "false" in case no platform has been specified.


V1.0.27
=======

 fixes:
 * [core] multiple "plugin_" configs on player- and item- level are now properly merged
 * [plugin:controlbar] controlbar no longer fades out on scrubbing while in "static" mode
 
 additions:
 * [plugin:display] new config option "designMode"



V1.0.26
=======

 fixes:
 * [core] player level config options were not properly inherited to plugins
 
 

V1.0.25
=======

 fixes:
 * [core] .setVolume() method ignored values of type number => fixed
 * [core] .setPlayhead() method ignored values of type number => fixed
 * [plugin:controlbar] controlbar DOM is now properly refreshed on volume-chnage in Chrome
 
 additions:
 * [core] new API method .getPlayerVer()
 


V1.0.24
=======

  fixes:
  * [core] fixed issues while changing the quality of players in IDLE state
  * [core] percenatge width and hight of the initial player container are now kept after init
  * [core] X-domain iFrames are now properly detected in Chrome
  * [core] fixed issues with iframed player on browsers with lack of true html fullscreen mode
  * [core] fixed Flash detection on Android devices
  * [core] disabling specific platforms by setting "enable<platform>Platform" to false now works properly
  * [core] disabling "nive" platform no longer disables Android and iOS native playback
  * [core] setting "disallowSkip" on player level prevented the player from bein initialized
  * [plugin:controlbar] fullscreen-button is now properly disabled in case of X-domain issues
  
  additions:
  * [core] entering debug-mode gives an initial feedback to console
  * [core] HDS streaming support for Android >2




V1.0.23 (!!!)
=======

  fixes:
  * [core] fixed stuttering on audio-playback via flash


V1.0.22
=======

  fixes:
  * [core] fixed scaling issues if controlbar is set to be permanently visible

V1.0.21
=======

  fixes:
  * [core] fixed synching issues while toggling fullscreen
  * [core] fixed iOS issues when HDS and HLS streams are provided in combination
  * [core] fixed general pseudo-streaming issues while on Flash
  * [core] fixed general config inheritance issues with theme-packs 
  
  additions:
  * [plugin:controlbar] position- and load- indicators move a little smoother now
  

V1.0.20
=======
  
  fixes:
  * [core] IE9 playlist issues
  * [core] .gePlaylist() and .getItem() properly return an empty array in case of an empty playlist
  * [core] .getItemCount() now properly returns zero for empty playlists.
  * [core] playhead position is noe properly restored in case a "streamable" video format is being played and quality/source was changed dynamically
  * [core] cue points where not applied in case "autoplay" was "true"
  * [core] fixed cuepoint-callback-flooding if a precision higher 0 is used (floating point)
  * [core] if config.className is undefined the player no longer gets the class "<cssprefix>null"
  * [core] improved flexibility on handling iframed players with prepended html content in conjunction with fullscreen
  * [core] fixed native ogg/audio hickup
  * [plugin:controlbar] "seek" was triggered twice if the srubber was clicked
  
  additions:
  * [core] .setSize() now respects "%" and "px"
  


V1.0.19
=======

  fixes:
  * [core] ficed cuepoint "flooding"
  * [plugin:display] fixed error handling for non-existent logo-files.


V1.0.18
=======

  fixes:
  * [core] fixed general Firefox 3.6 issues - volumeslider, flash fallback
  * [core] fixed minor Android 2.x issues - "stop" once finished
  * [core] fixed IE9.0.x issue with non-starting native video
  * [core] fixed IE9.0.x issue with proper pseudo-stream detection
  * [core] fixed IE8 issue with messed up volume / seek setting
  * [core] fixed Chrome 12.x issue not firing the timeupdate event while seeking in a paused video
  * [core] fixed position reset issues with jarisplayer being scrubbed during "pause" state on AUDIO playback
  * [core] config option "enable<Platform>Platform" is now properly recognized
  * [core] cover images on audioplayback are no longer marked as "selected" after "play" gets hit in FF 
  * [plugin:controlbar] improved cuePoint-blip precision
  * [plugin:controlbar] "showCuePoints" set to false is now properly detected (and default)


V1.0.17
=======

 additions:
 * [core] added pseudo streaming support for native H.264 video playback
 * [core] added "durationChange" event
 * [core] a cuePoint now observes itself if it´s set for an already preloaded region of the media file. If so "isAvailable" will return "true".
 * [core] new cuePoint method: "isAvailable"
 * [plugin:controlbar] new config parameter "showCuePoints"
 * [plugin:controlbar] set cuepoints are now optionally displayed on top of the scubber bar.
 
 fixes:
 * [core] .selfDestuct() caused issues in IE7-9
 * [core] 404-error testcard now functions properly - even in i*-Devices
 * [plugin:controlbar] fixed some strange rendering issues regarding the volume knob in webkit
 
 changes:
 * [core] cleaned up console.log debugging. config.debug now is true/false only
 

V1.0.16
=======

 additions:
 * its now possible to send any custom "update" from models to the controller. Will result in a regular event promotion.
 

V1.0.15
=======

 changes:
 * [config] dropped config option "enableFlashFallback"
 * [config] dropped config option "enableNativePlayback"
 * [config] renamed config option "platformPrority" to "platforms"
 * [config] "flashStreamType" became "streamType", default is "file"
 * [config] "FlashStreamServer" became "streamServer", default is an empty string
 * added platform "browser" to "platforms"
 * CSS classes added to the player by using the "className" config-option are now prefixed with "cssClassPrefix" (default is "pp")
 
 fixes:
 * [core] the "mousemove" event is now properly promoted in case of flash fallback in Firefox on MacOsX (controlbar appears on mousemove)
 * [core] propert behavior on empty schedules in Firefox
 * [core] proper RTMP playback on browsers featuring "Flash" and "native H.264" (model-clash)

 additions:
 * [core] .getCanPlayNatively('*') now returns all formats the player supports natively
 * [core] the player gets a CSS class according to "streamType" and "cssClassPrexi", e.g. "ppfile" or "pprtmp"
 * [core] cuePoint support => trigger custom functions depending on the player´s timeindex
 * [core] pressing "d" while mouse hovers the player enableds debugging (console.log)

V1.0.14
=======
 
 Maintenance release, no new features. General cleanup. Project related stuff. Sorry about that.


V1.0.13
=======
 
 maintenance release, no new features.

 changes: 
 * removed "overflow: hidden" which was automatically applied to the the player container.
 
 fixes:
 * fixed white background in IE6, IE7 while on flash fallback *sigh*
 * Youtube Flash API issues with automatically skipped vids.
 * "canPlay" accuracy


V1.0.12
=======
 
 additions:
 * [plugin:controlbar] new control elements for quality-toggling
 
 fixes:
 * no controls in safari if projekktor is mounted on a <video> - http://dev.projekktorxl.com/projekktor/issues/17
 * proper support of "mouseenter", "mouseleave" and "mousemove" events on iPad and other thouch devices


V1.0.11
=======
 
 changes:
 * [plugin:display] click callbacks can now be external functions but name corresponding config options changed:
   ondisplayclick, ondisplaydblclick, ondisplay_playing and onlogoclick are now ...
   displayClick, displayDblClick, displayPlayingClick, logoClick
 * [plugin:display] removed all hardcoded CS directives and moved them to the theme.css

 fixes:
 * [core] JS error which caused IE6-8 to lock up the player since V1.0.10
 * [core] fixed reinit of flash component while exiting true fullscreen in FF
 * [plugin:display] Logo now appears on iPad - http://dev.projekktorxl.com/projekktor/issues/10
 * [plugin:controlbar] fixed behavior if "disableFade" is true - controls now properly stay permanently


V1.0.10
=======

 additions:
 * [core] it is now possible to provide multiple qualities of a single video file. player selects "best choice" depending on player dimensions and device.
 * [core] Apple HLS support for iDevices 
 
 changes:
 * [core] API function "setPlaybackQuality" no supports all media types (was "youtube" only)

 fixes: 
 * [core] Fallback to jarisplayer playing an audio playlist seems broken in 1.0.0.9r27 (http://dev.projekktorxl.com/projekktor/issues/12)
 * [core] Custom user agent string in IE9 breaks flash fallback  (http://dev.projekktorxl.com/projekktor/issues/11)
 * [core] hotfixed "missing quality settings"-error
 * [core] in safari the controlbar didn´t come up while on flash fallback
 * [plugin:controlbar] fadeable controls stay properly hidden during item init


V1.0.09
=======

 Minor rewrites and performance improvements.
 

V1.0.08
=======

 maintenance release, no new features.

 fixes:

 * [core] State "Completed" isn´t triggered on Android
 * [core] in IE9 flash is used instead of native video in case file extension is mp4s
 * [core] audio playback doesn´t start if flash or <audio> component is wrapped into an invisible container
 
 

V1.0.07
=======

 minor maintenance

 fixes:
 * [plugin:display] fixed "loop" button toggle
 * [core] coverimage was removed if first playback started with native <audio>.
 

V1.0.06
=======

 fixes:
 * [core] fixed false negative result of ".canplaynatively()"

 additions:
 * [core] the browser´s context-menu (leftclick) can now be selectively unlocked by assigning the "context" class to any element
 * [core] added some keyboard shortcuts
 
 changes:
 * [plugin:display] removed setFullscreen on doubleclick - doesn´t work for native fullscreen
 * [plugin:display] changed DOM order of display, startbutton, buffering icon, logo layer


V1.0.05
=======

 fixes:
 * [core] fixed playlist issues on iOS 5.0.x



V1.0.04
=======

 okay, let´s see if we can make it up to V2.0 today ...

 fixes:
 * [core] improved "getCanPlay" accuracy


V1.0.03
=======

 fixes:
 * [core] Strange behavior of iframed players in native fullscreen fixed


V1.0.02
=======

 fixes:
 * [core] Firefox 10 fullscreen issues
 * [core] Strange behavior of iframed players in native fullscreen fixed
 * [core] fixed this annoying resumeing-video-thingy while on flash-fallback in Firefox.
 * [core] skipping in playlists caused strange effects when changing from flash to native or vice versa. fixed that
 * [core] testcards informing about missing browser -plugins or -capabilities now properly react on click.
 * [core] fixed sync-bug causing issues on instant-ready player-models
 * [core] several bugs in image model
 * [core] on iMess-devices the player now shows the native control elements if "autoplay" failed
 * [plugin:controlbar] "fixedVolume" now properly reverses if next item is unlocked

 changes:
 * [core] mouse- and key-event-listeners now get the original event-object as 1st argument
 * [plugin:controlbar] dropped support for fullscreen-layout-switching - use css classes instead
 
 additions:
 * [core:config] "imageScaling" and "videoScaling" can now be "none" - will cause the media to be centered within the player but not changed in size.
 * [core] new API method "setLoop"
 * [core] new API method "setDebug"
 * [core] new API method "getCanPlay"
 * [core:config] new option "skipTestcard" allows to autoskip tescards informing about missing browser -plugins or -capabilities



V1.0.01
=======

 additions:

 * [core] new config option "ignoreAttributes" which will cause the player to ignore all behavior relevant <video> and <audio> attributes.
 * [core] providing a media´s "type" is now optional - player will try to get it from file-extensions then.
 * [core] new event "syncing"
 * [core] new event "starting"
 * [core] massively improved playlist experience on iMess devices
 * [core] added "alt" text to player poster
 * [core] new API function "setPlaybackQuality" (experimental, for now Youtube only)
 * [core] new event "qualityChange" (experimental, for now Youtube only)
 * [core] new config-option "playbackQuality" .... eeeexperimental
 * [plugin:controlbar] visual video scrubbing / draggable scrubber

 changes:

 * [core] cleaned up .setFile - please refer http://www.projekktor.com/docs/api?&#playersetfile_datamixed_typestring_void
 * [plugin:controlbar] the default controlbar layout now features <ul> - update your theme
 * [plugin:controlbar] the controlbar now fades almost instantly once the mousecursor left the player (not on Mobile)

 fixes:

 * [core] better <video> reset
 * [core] error callback if jsonp callback fails
 * [core] prevent stopping of an IDLE player
 * [core] prevent "buffer" state flood while on flash fallback
 * [core] fixed IE issues in case config.width or config.height where NaN
 * [core] fixed fullscreen toggling for iframed players in FF8+FF9
 * [core] if set to "loop" the player stays in fullscreen once re-playing the playlist
 * [core] fixed ignorance of applied custom "realParser" functions
 * [core] fixed handling of treed playlists (loading playlist from within a playlist)
 * [core] fixed discarded "click" event(s) if mouse is over player-DOM during instantiation
 * [core] youtube-videos do not longer restart from position ZERO in Firefox on fullscreen-toggle
 * [core] fixed audio/youtube model
 * [core] fixed cookie issues with personalised parameters based on strings
 * [plugin:controlbar] fixed layout of default controlbar in order to avoid overlapping titles and achieve proper button-"stacking"
 * [plugin:display] logo is now properly disabled on load-error
 * [default theme] better "stacking" of control buttons
 * [default theme] fixed title string overlapping with control elements




V1.0.00
=======

 additions:

 * [core] new API method "setCuePoint"
 * [core] new API method "getCuePoints"
 * [core] new API method "removeCuePoint"
 * [core] enabled true fullscreen mode where applicable

 fixes:

 * [core] "addlistener" now properly returns "this"
 * [core] fixed video-scaling in flash component
 * [core] internal time / position pointer rounding issues
 * [core] fixed dynamic setting of config parameters with type of "string"
 * [core] toSeconds now allows hundredths
 * [core] when entering fullviewport, player now also sets margin and padding to zero
 * [core] made plugin names case insensitive
 * [core] improved plugin config scheme


V0.9.09
=======

 One more maintenance release.

 fixes:

 * [core] fixes stuttering flash playback in Opera and Safari
 * [core] double clicking IDLE players doesn´t force fullscreen anymore
 * [core] on seek in a paused Youtube video the scrubber now updates instantly
 * [core] fixed "user disabled embedding" issue for Youtube videos
 * [core] refixed "start playback" behavior on i*-Devices
 * [core] fixed visible "buffering"-icon on i*-Divces which are unable to autoplay follow-up items
 * [core] volume is now properly stored in cookie (where available)
 * [plugin:display] logo is now properly disabled in case it´s not required
 * [plugin:controlbar] fixed hiding of controlbar if player is "DONE"
 * [plugin:controlbar] fixed mute/unmute buttons on players with initially visible controlbars


V0.9.08
=======

 fixes:
 * [core] volume change now works properly for IDLE audio players.
 * [core] opera issues while on flash fallback.
 * [core] fixed cross-model "start" event issue.
 * [core] fixed issues while using the player in responsive layouts.
 * [core] fixed display click behavior - overlapping plugins like "embedd" now work properly
 * [core] fixed some issues while using .reset() in fullscreen mode

 changes:
 * [core] moved "cDump" into plugin (configdump)


 additions:
 * [core] new API function .setSize() allows to resize the player during runtime
 * [core] new config parameter "className" => allows to set a specific CSS class for each item in playlist which is applied to the whole player during playback of the respecitve item
 * [plugin interface] .getConfig() now supports a second parameter setting a default value
 * [plugin: configdump] F12 opens an improved "cDump" dialog.
 * [plugin: controlbar] added "fadeDelay" config parameter. Default is 2500 (milliseconds) - controls how long the controlbar is visible before fading away.
 * [plugin: controlbar] added "showOnStart" config parameter. Default is false. If true the controlbar shows up right on start of the video.


V0.9.07
=======

 lost in space


V0.9.06
=======

 additions:
 * [core] added "unmute" event
 * [core] added "mute" event
 * [core] added "resume" event
 * [core] hitting F12 while mouse hovers a player brings up debug information (cDump)

 fixes:
 * [core] fixed issues with not properly detached media objects on runtime manipulations of the playlist (setItem)
 * [core] fixed "awakening" state trigger on autoplay items
 * [core] fixed cookie expiry and path
 * [core] fixed image model issues (proper interval reset)
 * [core] fixed placeholders in default testcard texts
 * [core] resetting the player now properly triggers onReady function (where set)
 * [plugin:controlbar] fixed volume slider issues while in fullscreen
 * [plugin:controlbar] fixed general slider issues while in fullscreen and in "design" mode
 * [plugin:controlbar] fixed controlbar fade behaviour

 changes:
 * [core] dropped "flashVars" player-config parameter
 * [core] moved "embeddFlash" method from model to controller.



V0.9.05
=======

 Slowly but surely this projekkt moves towards V1 - when you see it you´ll sh*it bricks.

 fixes:
 * [core] model-detection-accuracy

 changes:
 * [core] dropped the "allowplaybackfrom" thingy
 * [core] dropped the "get-fileid-from-url-hash-while-in-iframe-mode" thingy


V0.9.04
=======

 fixes:
 * [plugin:display] fixed click ion testcard behavior

 changes:
 * [core] improved media type selector (logic, cleanup, performance)
 * [core] dropped "dynamicTypeExtensions"


V0.9.03
=======

 fixes:
 * [plugin:controlbar] optionally toggling mute button fix
 * [core] some &#%$§!#D flash detection issues (thanx for reporting this, doctor001)


V0.9.02
=======

 additions:
 * "leftclick", "rightclick" & "middleclick" event
 * disabled contextmenu on player (evil but doesn´t work in all browsers anyway, so what)

 fixes:
 * [core] fixed "file type via extension-detection"
 * {core] general android 2.x.x fixes
 * [plugin:controlbar] fixed "enableFullscreen" behaviour



V0.9.01
=======
 fixes:
 * [core] "controls" "false" issue hotfixed (before someone else noticed it)


V0.9.00
=======

 additions:
 * [core] new config parameter "addplugins"
 * [core] using "projekktor" with a jQuery selector now returns matched instances instead of re-instantiating them
 * [core] added "theme package loader"
 * [core] added API function openURL
 * [core] player automatically leaves fullscreenmode when "done" event is fired
 * [plugin:display] actions on click and dblclick are customizable

 changes:
 * [core] removed the mysterious "designMode"
 * [core] out sourced config-set to allow handling of preset packages
 * [core] config option "defaultPoster" obsolete
 * [core] config option "flashVideoModel" obsolete
 * [core] config option "flashAudioModel" obsolete
 * [core] "useYTIframeAPI" is now FALSE per default
 * [plugin:display] "buffericon", "start" and "logo" are now shown/hidden via "active" "inactives" classes

 fixes:
 * [core] Opera "networkState" issues
 * [core] parser issues on XML playlists
 * [core] general jQuery 1.6 issues
 * [core] some general and jQuery 1.6 related jsonp issues
 * [core] "removeListener" issues
 * [core] "resize" event issues on pages with multiple player instances
 * [core] progress bar is now properly set on flash fallback with instant ready (cached) media
 * [core] added workaround for "click on transparent div" bug of IE6-9
 * [core] fixed "selfDestruct" method
 * [core] fixed scaling issues (fill)
 * [plugin: share] fixed minor issues with embed code


V0.8.21
=======

 I am dreaming of v0.9.x but, well ...

 additions:
 * [core] added "removePlugin" public API method
 * [core] playlist content type is now properly "guessed"
 * [core] added "volume fade" option for smooth transitions - works best with FlAsH *sigh*
 * [core] added "useYTIframeAPI" config option to either use Youtube´s old Flash- or the new  iFrame-HTML5 API player - default is TRUE
 * [core] added audio/m4a type
 * [core] made Youtube error messages i18n-able

 fixes:
 * [core] "reset" method now propertly reinitializes the player including all plugins
 * [core] fixed image- and HTML- player models (freaky experimental stuff)
 * [core] fixed Youtube iFrame API issues with multiple Projekktor instances (API bugs howevere are still there)
 * [core] fixed error listener of Youtube iFrame model



V0.8.20
=======

 I hate the smell of bugs in the morning.

 additions:
 * [core] non included plugins are properly ignored now and will not cause the player to get stuck any longer
 * [core] added JSON-P support for cross-site playlist hosting

 fixes:
 * [core] "error" event wasn´t properly promoted in certain situations
 * [core] "file not found" error caused "setTimeout" loop within native media model
 * [core] fixed JWPlayer model
 * [core] cookies are now properly set in Chrome
 * [core] fixed performance issues on native audio playback
 * [core] fixed Safari 5.x Mac OSX issues (video didn´t start on native playback)
 * [plugin:controlbar] fixed toggling of unmute/mute icons
 * [plugin:display] fixed logo IMG dummy issue


V0.8.19
=======

 I can see the light ...

 additions:
 * added "x-webkit-airplay=allow" for native media

 fixes:
 * [core] "onReady" callback wasn´t triggered in case of async. loaded playlists.
 * [core] fixed max volume toggle on player resume while playing audio via flash.
 * [plugin:display] fixed "instant buffer icon" for youtube videos


V0.8.18
=======

 Some fundamental changes before we go up to V0.9.x

 additions:
 * [core] default keyboard commands: enter/esc=fullscreen, right & left arrow=prev / next, space=playpause
 * [core] error messages / testcards can now be set to display some relevant data (e.g. src-URL)
 * [core] new config option "minHeight"
 * [core] new config option "minWidth"
 * [core] new API method cDump() - opens (toggles) a popup containing data relevant for debugging
 * [core] added (experiemental) player autoscaling
 * [core] setStop(true) sets playlist pointer back to the very first item, setStop() let it stay where it is.
 * [core] it is now possible to create players without a "display". neither posters nor covers or video are visible then but the audio can be heard (if any). all events and updates are regularily fired anyhow.
 * [core] added new media type "audio/youtube" to create audio players filled with youtube videos
 * [core] Projekktor now supports the new YOUTUBE iframe API for even fewer Flash
 * [core] added proper error / testcard display for Youtube videos.
 * [plugin:controlbar] it is now (officially) possible to provide a different controlbar layout for fullscreen mode
 * [plugin:controlbar] added vmax-button (maximum volume)

 fixes:
 * [core] it is now possible to set and get volume while player is in IDLE state (e.g. in poster mode)
 * [core] fixed IE9 issue causing ignored <audio> and <video> -<source> tags
 * [core] flash fallback components now works properly with relative media URLs
 * [core] failed hash detection on iframed players doesn´t block the player any longer
 * [core] server data loaded from within a plugin is no longer parsed by "customParser"
 * [core] fixed strange DOM effects on [ESC]-keypress while not in fullscreen mode
 * [core] fixed .setVolume: volume < 0 or volume > 1 is now properly blocked
 * [core] fixed image / video rescaling issues caused by rounding errors
 * [core] media loadProgress, playProgress, position & duration now properly reset on "setStop"
 * [core] fixed itemcount on "scheduled" event
 * [core] fixed "ended" event flood on audio skip while on flash fallback
 * [core] event:"scheduleModfied" is not fired during initialisation process anymore (event flood)
 * [core] made sure that xxxFLASH model is choosed if flashStreamType is RTMP and browser supports MP4
 * [core] fixed index issue on playlists not starting with key "0"
 * [core] player state STOPPED is now properly promoted on NEXT and PREVIOUS command also
 * [core] fixed keypress handling
 * [core] fixed seldom double audio on native video playback
 * [core] fixed Opera V11.x native support detection issues
 * [core] fixed Opera V11.x progress update issues
 * [core] fixed "endedListener" bug on native playback which broke playlists
 * [core] fixed poster scaling if player is IDLE and player is resized
 * [core] fixed native video scaling on window resize
 * [core] fixed strange flickering effect during <video> init in Firefox
 * [core] fixed some Youtube API timing issues
 * [plugin:controlbar] fixed inproper mute/unmute volume restore if user clicks on volume slider
 * [plugin:controlbar] fixed volume slider behavior (precision)
 * [plugin:controlbar] fixed "unmute" behavior
 * [plugin:controlbar] scrubber now properly resets on IDLE state

 changes:
 * [core] media display relevant functionaities have been moved into one single plugin (display)
 * [core] removed the bloated XML2Json parser function.
 * [core] config option "enableTestcard" is now "false" by default
 * [core] minor mico optimizations
 * [plugin:controlbar] removed all hardcoded "display: none;" and "display: block;" directives. Classes "inactive" & "active" are applied instead in order to provide higher styling flexibility
 * [plugin:startbutton] obsolete => handled by plugin:display
 * [plugin:bufferingicon] obsolete => handled by plugin:display



V0.8.17
=======

 additions:
 * [core] added public "selfDestruct" method. revereses all DOM manipulations made by the player.
 * [core] plugins are now allowed to fire custom events.
 * [core] Volume value is now stored in Clientcookie.
 * [core] new API method "getCanPlayNatively"
 * [core] new API method "reset"
 * [core] new config option "enableTestcard"
 * [plugin:buffericon] added possibility to make a transparent PNG-sprite an indicator-animation

 changes:
 * [core] removed hard coded "cursor: pointer" css values
 * [core] removed hard coded "position: absolute" css values
 * [core] removed all plugins from being applied by default (!important)
 * [core] removed setDefaultStyle function (was a nice try)
 * [core] removed JQUERY 1.4.2 REQUIRED warning

 fixes:
 * [core] using the "getFromUrl"-method doesn´t trigger "scheduleLoading"-event any longer when used from within plugins
 * [core] fixed image scaling in chrome and opera
 * [core] fixed crash if plugins-array has length of zero
 * [core] fixed iterator issues on instantiation
 * [plugin:controlbar] unmuting now restores original volume and not to full throttle any longer


V0.8.16
=======

 a version numbered "0/8/15" sucks anyway:

 fixes:
 * [core] "no media scheduled" properly displayed in case async. loaded playlist is properly formatted but of zero length.


V0.8.15
=======

 ..well...

 fixes:
 * [core] automatic type detection fixed in "sandbox" mode
 * [plugin:share] "facebook"- and "twitter"- buttons are now properly hidden in case setup is messed up

 additions:
 * [plugin:share] it´s now possible to set shareable links for each item individually


V0.8.14
=======

 this ought to be the last release before V0.9.x ...

 fixes:
 * [core] "loop" config parameter now works properly in conjunction playlists
 * [core] improved command-queue performance
 * [core] minor visual issues fixed
 * [core] fixed projekktor() iterator issues

 additions:
 * [core:youtube] poster and title are fetched from YT API in case none is set in config


V0.8.13
=======

 just an other maintenance release ...

 fixes:
 * [core] iPad start button now displays properly
 * [core] "setPlayPause" now enqueues properly
 * [core] "playbutton" does not appear while switching between scheduled media items any longer

 changes:
 * [core] "playlist"-Event removed

 additions:
 * [core] "scheduleLoading" event - Triggered in case of AJAX class fetching external playlist data from server.
 * [core] "scheduleModified" event - Fired whenever an item is been added or removed from schedule.
 * [core] "scheduled" event - The scheduling process has finished and the player is ready for action.
 * [core] "configModified" - Fired if player configuration has been altered as the result of a prior AJAX call


V0.8.12
=======

 just a maintenance release

 fixes:
 * [core] "setItem", 'index' argument is now properly detected
 * [core] "autoplay" config option now works properly
 * [core] controlbar is now disabled on "autoplay" eq. TRUE and "controls" eq. FALSE - as intended
 * [core] player now properly "stops" if set to "autoplay" and all scheduled videos played back once.
 * [core] fixed "play/pause" toggle issues while on jaris flash-fallback in Opera and IE
 * [core] fixed volume change issues while on jaris flash-fallback in Opera and IE
 * [core] youtube playback performance increased (fixed update timer issues)
 * [core] "cued" event on youtube playback is now properly handled
 * [core] fixed general IE9 issues - keep fingers crossed
 * [core] full-viewport-toggle on flashfallback fixed - listeners are now properly re-applied
 * [core] disabled fullscreen option on x-site iframe embeds in order to avoid JS security errors
 * [core] added internal command queue. catches API calls during asynchronous operations. in older version they where discarded.



V0.8.11
=======

 additions:
 * added "setDefaultCss" method to make new plugins compatible to older themes.

 fixes:
 * buffering icon now shows up during plugin-(re)initialization
 * buffering icon now shows instantly on "youtube" videos in order to overlay the original one
 * fixed SOURCE-child-tag issues in IE
 * fixed wrong error codes

 changes:
 * made reelLoader singleton in order to make it available for plugin-developers
 * changed playlist formatting



V0.8.10
=======
 additions:
 * [core] its now possible to apply the player to ANY block-styled DOM element - requires "file" to be set through config-option then.
 * [core] all file-source-strings are now parsed for {}-tags allowing to apply dynamic item configurations to the file URL.
 * [core] video and image rescaling on window.resize
 * [core] during load of xml or json playlists the player is now locked until loading procedure has finished

 fixes:
 * [core] fixed general XML parsing issues
 * [core] fixed InTerNeTexPloRer XML response header issues
 * [core] fixed dynamicTypeExtension issues
 * [core] fixed issues on empty "setFile"-calls
 * [core] RTMP and HTTP pseudo streamed files are now properly seekable
 * [core] fixed "width" & "height" handling
 * [core] proper detection of "<source>" tags
 * [core] fixed youtube-model - time is now displayed properly even on two youtube videos in a row
 * [plugin: controls] controls do not show up on any longer if config.controls = false

 changes:
 * added jQuery(function($)... where necessary in order to feature "compatibility" mode
 * [core] all setters now return "this" in order to allow method cascading
 * [plugin: tracker] removed from lib - is now optional
 * [plugin: iframeoverlays] removed from lib - is now optional


V0.8.01
=======
 additions:
 * [core] added config option 'cover' which allows to set a background image for audio which can be different to 'poster'

 fixes:
 * [core] fixed issues with "getItemn" and "getPlaylist"
 * [plugin: social] fixed behavior on non embeddable/shareable players
 * [core] youtube videos now play properly on ipad, iphone and ipod devices


V0.8.00
=======
 additions:
 * [core] basic i* playlist support
 * [core] Javascript API
 * [core: flash fallback] RTMP support (flash only)
 * [core: falsh fallback] FLV-pseudo streaming (flash only)
 * [core] XML playlist support
 * [core] playlist/reel parsing through custom "reelParser" function
 * [core] added "continuous" config option to allow toggling of auto playback for playlisted conent
 * [core] added "stop" method to bring player back to IDLE (with poster display) at any point.

 fixes:
 * [core] ipad, iphone and ipod issues fixed
 * [core] buffering issues fixed
 * dozens of cross browser issues fixed...


 changes:
 * [general] changed instantiation through projekktor() function.
 * [core] removed "spawn" option
 * [core] merged MP3 and MP4 flash fallback component into one single player
 * [core] moved plugin config-options to sperated namespaces for each plugin
 * [core] made some config options not changeable through item-configurations
 * [core] made "social" plugin activated by default






V0.7.16
=======
 additions:
 * [core] double click on display turns player to fullscreen
 * [plugin: logo] config options "logoPosition" allows to set the logo to top left, top right, bottom left, bottom right

 fixes:
 * [core] file extension->extension detection fixed
 * [plugin: controlbar] no hide on fullscreen toggle fixed
 * [youtube model] fixed set volume on start playback


 changes:
 * [core] merging of player- & media- config is now allowed for selected options only in order to avoid veeeery strange effects


V0.7.15
=======

 additions:
 * [core] added dynamic video scaling for native video playback
 * [core: config option: allowPlaybackFrom] added possibility to prevent content to be loaded from external domains
 * [core] added keyboard support
 * [core] on new items player now waits for all plugins to reinitialize (e.g. after async operations)
 * [plugin: controlbar] added possibility to customize time formatting - http://tracker.projekktor.com/index.php?do=details&task_id=3
 * [plugin: controlbar] (config: toggleMute) added possibility to make mute/maxvol icon optionally invisible accordingly to current player state
 * [plugin: controlbar] made controlbar optionally dragable
 * [plugin: +social] added social plugin - as base for social features. currently providing an embed and twitter feature.

 fixes:
 * [core] fixed "poster flickering" on player initialization
 * [core] fixed "poster flickering" on audio playback
 * [core] fixed general image scaling issues with IE
 * [core] fixed "disallowSkip" behavior
 * [core] fixed random stuck on end of native playback
 * [core] fixed full viewport behavior if player is wrapped into a relative positioned container
 * [core] fixed Firefox´ "flash resize workaround" play/pause issue
 * [core] progress- and time- indicators now update properly on scrubbing while player is paused
 * [core] no poster on single audio fixed - http://tracker.projekktor.com/index.php?do=details&task_id=2

 * [flash video] fixed video scaling issue

 * [plugin: controlbar] fixed volume knob behavior
 * [plugin: controlbar] improved scrubber accuracy
 * [plugin: controlbar] improved volume knob drag&drop behavior
 * [plugin: controlbar] (config: controlsTemplate)

 changes:
 * [core] general code and API cleanup
 * [core] moved all plugin relevant configuration to the respective one
 * [plugin: controlbar] (config: controlsTemplateFilter) depreciated
 * [plugin: controlbar] (config: timeDelimiter) custom time delimiter removed (fixed to "|" for early themes)
 * [plugin: controlbar] improved templating concept




V0.7.14r1
=========

 * fixed flash detection bug
 * fixed iPhone issues




V0.7.14
========

 additions:
 * [core] added general iPad markup syntax compatibility fix
 * [core] added iPad support for single files
 * [core] added error-testcard if flash is required but user´s Flash version is below 9
 * [core] added plugin-preloading mechanism
 * [core] added new content type "text/html" which allows to display iframed HTML content
 * [plugin: iframeoverlays] new plugin which allows video overlays via iframes catching player events.

 fixes:
 * [core] fixed IE display click behavior
 * [core] fixed minor memory leaks
 * [plugin: logo] scaling issue fixed
 * [plugin: bufferingicon] fixed flash issue (spinning wheel of death I)




V0.7.13i
========

 additions:
 * [core] added (experimental) RSS support
 * [core] added i*-mobile support for single (non playlisted) files
 * [core] Projekktor now also catches up <audio> elements.
 * [core] Setting "PROJEKKTOR_CONFIG['spawn'] to "false" disables auto -instantiation/-replacement.
 * [core] added JSON_service for the server.php example as fallback for older PHP installations.
 * [plugin: controlbar] made texts (timedisplay, title) unselectable

 fixes:
 * [core] Individually scripted video container projekktorization now works properly
 * [core] fixed "loop" behavior on autoplay=TRUE
 * [core] fixed config merging in case of item-configs through playlists
 * [core] fixed scrubbing issues in safari and chrome
 * [plugin: controlbar] fixed "play/pause"-toggle issue while "autoplay" is TRUE
 * [plugin: controlbar] fixed title display
 * [plugin: controlbar] fixed IE issues

 changes:
 * [core] standard playerelements (startbutton, bufferingicon, poster) are now encapsulated into plugins
 * [core] additional browsertype detection to identify mobile browsers implemented
 * [core] changed "full viewport" handling as preparation for further onscreen manipulations
 * [core] changed config-logic for plugins and altered existing ones accordingly


V0.7.12
=======

 additions:
 * [core] playlist items now get a unqiue IDs which are valid for the whole playbac sessiobn
 * [core] playlist items of type "text/json" will load a new playlist as specified and reset the player which enables the
   possibility to build trees of  x-linked playlists

 * [config option] "controlsDisableFade": enable/disable fading of overlayed control elements
 * [config option] "start": sets an offset in seconds to start playback from, http://code.google.com/p/projekktor-zwei/issues/detail?id=33
 * [config option] "defaultPoster" - sets a default poster in case none is provided by tag attributes or item configuration
 * [config option] "bypassFlashFFFix" - enables / disables a strange flash-reinit loop required for FF due to a rendering "bug"
 * [config option] "enableNativePlayback" - enable/disable native players to force flash fallback

 * [plugin controlbar] prev/next is now disabled if first or respectively last item is played back

 * [API function] getPlaylist
 * [API function] getItemId
 * [API function] getItemTrackId
 * [API function] addListener
 * [API function] getTimeLeft
 * [API function] play
 * [API function] pause
 * [API function] playpause


 fixes:
 * fixed issues on missing or invalid poster-URL in IE & Opera
 * fixed poster/cover scaling on audio playback
 * fixed play/pause- & display- click issues on missing poster attribute
 * fixed poster positioning
 * fixed stuck on empty "poster" attribute, http://code.google.com/p/projekktor-zwei/issues/detail?id=42
 * fixed crash on provided codec parameter, http://code.google.com/p/projekktor-zwei/issues/detail?id=45


 changes:
 * display "cursor" is set to "pointer" while player shows just the poster
 * poster now resizes on player resize
 * Playlist entries are now verified and applied to models directly after playlist is loaded from server (and not "on demand" any longer)
 * improved display click & doubleclick handling


V0.7.11
=======
 lost in space


V0.7.10
=======

 fixes:
 * Fixed general load-progress bar issues
 * Improved "seek" accuracy
 * Fixed filetype detection issues


V0.7.9
======

 additions:
 * made big "play" invisible on autoplay


V0.7.8
======

 additions:
 * "enableFlashFallback" config option allows to enable/disable automatic flash fallback (default: true), http://code.google.com/p/projekktor-zwei/issues/detail?id=35
 * "controlsTemplateFilter" config option allows assignment of custom string rewrite functions for time- & title strings.

 changes:
 * improved file type detection and fallback decision stuff, http://code.google.com/p/projekktor-zwei/issues/list?cursor=26
 * removed flashVar parameters for MP4 Flash fallback component, http://code.google.com/p/projekktor-zwei/issues/detail?id=34
 * set default Flash fallback component«s stage quality to HIGH and enabled video smoothing, http://code.google.com/p/projekktor-zwei/issues/detail?id=36

 fixes:
 * IE7, IE8 issues, http://code.google.com/p/projekktor-zwei/issues/detail?id=32&can=1
 * fixed opera fallback issues
 * fixed testcard«s "click display to continue" bug


V0.7.6
======

 additions:
 * Added WEBM support
 * Added experimental native audio support (flash fallback pending)
 * Core: dynamic IE7, IE8 HTML5 fix, makes the xmlns="http://www.w3.org/1999/xhtml/video" workaround obsolete
 * Controlbar Plugin: Volume slider is now clickable (and the knob still draggable)
 * Flash video component: added "time" and "loaded" attribute, http://code.google.com/p/projekktor-zwei/issues/detail?id=21

 changes:
 * removed automatic CSS inclusion (too much fuzz and user complaints - e.g. http://code.google.com/p/projekktor-zwei/issues/detail?id=27)
 * "Totally Looks Like..." Theme overhauled
 * Workaround for Firefox flash resize bug simplified

 fixes:
 * fixed some strange buffer-icon behavior
 * fixed multi-instance issues on flash-fallback
 * fixed FLV issue, http://code.google.com/p/projekktor-zwei/issues/detail?id=22
 * fixed poster issue, http://code.google.com/p/projekktor-zwei/issues/detail?id=25
 * fixed IE youtube issue, http://code.google.com/p/projekktor-zwei/issues/detail?id=30

V0.7.2
======
 * fixed, added and altered that much, you shouldn«t use 0.6.1 anymore

V0.6.1
======
 * initial release - it works


free the princess of agentia!
+++
