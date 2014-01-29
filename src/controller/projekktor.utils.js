jQuery(function ($) {

	$p.utils = {

		imageDummy: function () {
			return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi/v//PwNAgAEACQsDAUdpTjcAAAAASUVORK5CYII=';
		},

		/**
		 * Capitalizes a String
		 * @private
		 * @param (Object) da String
		 * @return da result String
		 */
		capitalise: function (string) {
			return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
		},

		/**
		 * blocks text selection attempts by the user for the given obj
		 * @private
		 * @param (Object) Object
		 */
		blockSelection: function (dest) {
			if (dest)
				dest
					.css({
						"-khtml-user-select": "none",
						"-webkit-user-select": "none",
						"MozUserSelect": "none",
						"user-select": "none"
					})
					.attr('unselectable', 'on')
					.bind("selectstart", function () {
						return false;
					});
			return dest;
		},

		unique: function (dest) {
			var uniqueArr = [];
			for (var i = dest.length; i--;) {
				var val = dest[i];
				if ($.inArray(val, uniqueArr) === -1) {
					uniqueArr.unshift(val);
				}
			}
			return uniqueArr;
		},

		intersect: function (array1, array2) {

			var result = [];
			$.each(array1, function (i) {
				// ugly try catch mess thx to IE6-8
				try {
					if ($.inArray(array2, array1[i]) > -1) result.push(array1[i]);
				} catch (e) {}
				try {
					if ($.inArray(array1[i], array2) > -1) result.push(array1[i]);
				} catch (e) {}
			});
			return result;
		},

		roundNumber: function (rnum, rlength) {
			if (rnum <= 0 || isNaN(rnum)) return 0;
			return Math.round(rnum * Math.pow(10, rlength)) / Math.pow(10, rlength);
		},

		/* generates a random string of <length> */
		randomId: function (length) {
			var chars = "abcdefghiklmnopqrstuvwxyz",
				result = '';
			for (var i = 0; i < length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				result += chars.substring(rnum, rnum + 1);
			}
			return result;
		},

		toAbsoluteURL: function (s) {
			var l = location,
				h, p, f, i;

			if (s == null || s == '') return '';

			if (/^\w+:/.test(s)) {
				return s;
			}

			h = l.protocol + '//' + l.host;
			if (s.indexOf('/')===0) {
				return h + s;
			}

			p = l.pathname.replace(/\/[^\/]*$/, '');
			f = s.match(/\.\.\//g);
			if (f) {
				s = s.substring(f.length * 3);
				for (i = f.length; i--;) {
					p = p.substring(0, p.lastIndexOf('/'));
				}
			}

			return h + p + '/' + s;
		},

		/**
		 * strips / trims
		 * @public
		 * @param (String) Da string to get processed
		 * @return (String) Da trimmed string
		 */
		strip: function (s) {
			return s.replace(/^\s+|\s+$/g, "");
		},

		/**
		 * strips / trims
		 * @public
		 * @param (String) Da human readable time to parse
		 * @return (Integer) Absolute seconds
		 */
		toSeconds: function (t) {
			var s = 0.0;
			if (typeof t != 'string') return t;
			if (t) {
				var p = t.split(':');
				if (p.length > 3)
					p = p.slice(0, 3);

				for (var i = 0; i < p.length; i++)
					s = s * 60 + parseFloat(p[i].replace(',', '.'));
			}

			return parseFloat(s);
		},

		toTimeString: function (secs, noSecs) {
			var hours = Math.floor(secs / (60 * 60)),
				divisor_for_minutes = secs % (60 * 60),
				minutes = Math.floor(divisor_for_minutes / 60),
				divisor_for_seconds = divisor_for_minutes % 60,
				seconds = Math.floor(divisor_for_seconds);

			if (hours < 10) {
				hours = "0" + hours;
			}
			if (minutes < 10) {
				minutes = "0" + minutes;
			}
			if (seconds < 10) {
				seconds = "0" + seconds;
			}

			return (noSecs === true) ? hours + ':' + minutes : hours + ':' + minutes + ':' + seconds;
		},

		/* X-Browser flash embedd mess */
		embeddFlash: function (destObj, domOptions, shield, shrinkShield) {

			var flashVars = domOptions.FlashVars || {},
				result = '',
				htmlEmbedObj = '',
				htmlEmbed = '',
				tmpStr = '',
				dest = destObj,
				id = '';

			// add flashVars
			if (domOptions.src.indexOf('?') == -1)
				domOptions.src += "?";
			else
				domOptions.src += "&";



			for (var key in flashVars) {
				if (typeof flashVars[key] != 'function') {
					tmpStr = flashVars[key];

					/*
			    // support "{tags}" to add media properties
			    for(var i in this.media) {
				if (typeof tmpStr != 'string') continue;	    
				tmpStr = tmpStr.replace('{'+i+'}', this.media[i]);
			    }
			    */
					domOptions.src += key + '=' + encodeURIComponent(tmpStr) + '&';
				}
			}
			domOptions.src.replace(/&$/, '');

			// <object> bullshit with redundant "ID" IE extrawurst
			htmlEmbedObj = '<object id="' + domOptions.id + '" codebase="https://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"  name="' + domOptions.name + '" width="' + domOptions.width + '" height="' + domOptions.height + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">' + '<param name="movie" value="' + domOptions.src + '"></param>' + '<param name="allowScriptAccess" value="' + domOptions.allowScriptAccess + '"></param>' + '<param name="allowFullScreen" value="' + domOptions.allowFullScreen + '"></param>' + '<param name="wmode" value="' + domOptions.wmode + '"></param>';


			// <embed> tag
			htmlEmbed = '<embed ';
			for (var key in domOptions) {
				if (key.toUpperCase() === 'FLASHVARS') continue;
				if (typeof domOptions[key] != 'function') htmlEmbed += key + '="' + domOptions[key] + '" ';
			}
			htmlEmbed += ' pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"></embed>';


			result = htmlEmbedObj + htmlEmbed;
			result += '</object>';

			if (!document.all || window.opera) {
				result = htmlEmbed;
			}

			if (dest === null)
				return result;

			// jquerx 1.4.2 IE flash <object> issue workaround:
			// this does not work in IE: destObj.append(result);
			dest.get(0).innerHTML = result;

			if (shield !== false) {
				dest.append(
					$('<div/>').attr('id', domOptions.id + '_cc')
					.css({
						width: (shrinkShield) ? '1px' : '100%',
						height: (shrinkShield) ? '1px' : '100%',
						backgroundColor: ($p.utils.ieVersion() < 9) ? '#000' : 'transparent',
						filter: 'alpha(opacity = 0.1)',
						position: 'absolute',
						top: 0,
						left: 0
					})
				);
			}

			return $('#' + domOptions.id);
		},

		ieVersion: function () {
			var v = 3,
				div = document.createElement('div'),
				all = div.getElementsByTagName('i');

			while (
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0]
			);

			return v > 4 ? v : undefined;
		},

		/**
		 * replaces {}-tags with parameter equialents
		 * @public
		 * @param (String) Da string to get processed
		 * @param (Object) Object holding data to fill in
		 * @return (String) Da parsed string
		 */
		parseTemplate: function (template, data, encode) {

			if (data === undefined || data.length == 0 || typeof data != 'object') return template;

			for (var i in data) {
				template = template.replace(new RegExp('%{' + i + '}', 'gi'), ((encode === true) ? window.encodeURIComponent(data[i]) : data[i]))
			}
			template = template.replace(/%{(.*?)}/gi, '');
			return template;
		},


		/**
		 * stretches target to fit into specified dimensions keeping apsect ratio
		 * @public
		 * @param (String) "fill" or "aspectratio" (default)
		 * @param (Object) the Dom-Obj to scale
		 * @param (Float) The maximum available width in px
		 * @param (Float) The maximum available height in px
		 * @param (Float) A forced asumed with of the target object (optional)
		 * @param (Float) A forced asumed height of the target object (optional)
		 * @return (Boolean) Returns TRUE if <target> was resized in any way, otherwise FALSE
		 */
		stretch: function (stretchStyle, target, wid, hei, twf, thf) {
			if (target == null)
				return false;

			if ((target instanceof $)===false) {
				target = $(target);
			}

			if (!target.data('od')) {
				target.data('od', {
					width: target.width(),
					height: target.height()
				});
			}

			var tw = (twf !== undefined) ? twf : target.data('od').width,
				th = (thf !== undefined) ? thf : target.data('od').height,
				xsc = (wid / tw),
				ysc = (hei / th),
				rw = wid,
				rh = hei;

			// fill area
			switch (stretchStyle) {
			case 'none':
				rw = tw;
				rh = th;
				break;

			case 'fill':
				if (xsc > ysc) {
					rw = tw * xsc;
					rh = th * xsc;
				} else if (xsc < ysc) {
					rw = tw * ysc;
					rh = th * ysc;
				}
				break;

			case 'aspectratio':
			default:
				// scale, keep aspect ratio
				if (xsc > ysc) {
					rw = tw * ysc;
					rh = th * ysc;
				} else if (xsc < ysc) {
					rw = tw * xsc;
					rh = th * xsc;
				}
				break;
			}
			wid = $p.utils.roundNumber((rw / wid) * 100, 0);
			hei = $p.utils.roundNumber((rh / hei) * 100, 0);

			if (wid===0 || hei===0) {
				return false;
			}

			target.css({
				'margin': 0,
				'padding': 0,
				'width': wid + "%",
				'height': hei + "%",
				'left': (100 - wid) / 2 + "%",
				'top': (100 - hei) / 2 + "%"
			});

			if (target.data('od').width != target.width() || target.data('od').height != target.height()) {
				return true;
			}

			return false;

		},

		// parseUri 1.2.2
		// (c) Steven Levithan <stevenlevithan.com>
		// MIT License                 
		parseUri: function (str) {
			var o = {
				strictMode: false,
				key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
				q: {
					name: "queryKey",
					parser: /(?:^|&)([^&=]*)=?([^&]*)/g
				},
				parser: {
					strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
					loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
				}
			},
				m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
				uri = {},
				i = 14;

			while (i--) uri[o.key[i]] = m[i] || "";

			uri[o.q.name] = {};
			uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
				if ($1) uri[o.q.name][$1] = $2;
			});

			return uri;
		},

		// usage: log('inside coolFunc',this,arguments);
		// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/                
		log: function () {

			if (this.logging===false) {
				return;
			}

			this.history = this.history || []; // store logs to an array for reference
			this.history.push(arguments);
			if (window.console)
				console.log(Array.prototype.slice.call(arguments));
		},

		cleanResponse: function (responseText, type) {
			var data = false;

			switch (type) {
			case 'html':
			case 'xml':
				// Create the xml document from the responseText string.
				if (window.DOMParser) {
					data = new DOMParser()
					data = data.parseFromString(responseText, "text/xml");
				} else { // Internet Explorer
					data = new ActiveXObject("Microsoft.XMLDOM");
					data.async = "false";
					data.loadXML(responseText);
				}
				break;

			case 'json':
				data = responseText;
				if (typeof data == 'string') {
					data = $.parseJSON(data);
				}
				break;
			case 'jsonp':
				break;
			default:
				data = responseText;
				break;

			}
			return data;
		},

		cssTransitions: function () {
			var m = document.createElement('z'),
				s = m.style;

			function test_props(p) {
				for (var i in p) {
					if (s[p[i]] != null) {
						return true;
					}
				}
				return false;
			}

			function test_props_all(prop) {
				var d = 'Webkit Moz O ms Khtml'.split(' '),
					u = prop.charAt(0).toUpperCase() + prop.substr(1),
					e = (prop + ' ' + d.join(u + ' ') + u).split(' ');
				return test_props(e);
			}
			return test_props_all('animationName');
		},
        
        versionCompare: function (installed, required) {
            var a = installed.split('.'),
                b = required.split('.'),
				i = 0;
    
            for (i = 0; i < a.length; ++i) {
                a[i] = Number(a[i]);
            }
            for (i = 0; i < b.length; ++i) {
                b[i] = Number(b[i]);
            }
            if (a.length == 2) {
                a[2] = 0;
            }
    
            if (a[0] > b[0]) return true;
            if (a[0] < b[0]) return false;
    
            if (a[1] > b[1]) return true;
            if (a[1] < b[1]) return false;
    
            if (a[2] > b[2]) return true;
            if (a[2] < b[2]) return false;
    
            return true;
        },

        /**
         * serializes a simple object to a JSON formatted string.
         * Note: stringify() is different from jQuery.serialize() which URLEncodes form elements
         * CREDITS: http://blogs.sitepointstatic.com/examples/tech/json-serialization/json-serialization.js
         */        
        stringify: function(obj) {         
            if ("JSON" in window) {
                return JSON.stringify(obj);
            }
    
            var t = typeof (obj);
            if (t != "object" || obj === null) {
                // simple data type
                if (t == "string") obj = '"' + obj + '"';
    
                return String(obj);
            } else {
                // recurse array or object
                var n, v, json = [], arr = (obj && obj.constructor == Array);
    
                for (n in obj) {
					if (obj.hasOwnProperty(n)) {
						v = obj[n];
						t = typeof(v);
						if (obj.hasOwnProperty(n)) {
							if (t == "string") {
								v = '"' + v + '"';
							} else if (t == "object" && v !== null){
								v = $p.utils.stringify(v);
							}
		
							json.push((arr ? "" : '"' + n + '":') + String(v));
						}
					}
                }
    
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        },
        
		logging: false
	};
});


jQuery(function ($) {

	$p.platforms = {

        VLC: function() {
            if (navigator.plugins && (navigator.plugins.length > 0)) {
                for(var i=0;i<navigator.plugins.length;++i) {
                    if (navigator.plugins[i].name.indexOf("VLC") != -1) {
                        if (navigator.plugins[i].version!=null)
                            return navigator.plugins[i].version || "0";
                        if (navigator.plugins[i].description!=null)
                            if (navigator.plugins[i].description.match(/\d{1,}\.\d{1,}\.\d{1,}/i)[0])
                                return navigator.plugins[i].description.match(/\d{1,}\.\d{1,}\.\d{1,}/i)[0];
                    }
                }
            }
            else {
                try {
                    new ActiveXObject("VideoLAN.VLCPlugin.2");
                    return "0"; // no, please, no
                } catch (err) {}
            }        
            return "0";
        },

		/* returns the version of the flash player installed on client. returns 0 on none. */
		FLASH: function (typ) {
			try {
				try {
					// avoid fp6 minor version lookup issues
					// see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
					var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
					try {
						axo.AllowScriptAccess = 'always';
					} catch (e) {
						return '6.0.0';
					}
				} catch (e) {}
				return (new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1].match(/\d+/g)[0]).toString();
			} catch (e) {
				try {
					if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
						return ((navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1].match(/\d+/g)[0] ).toString()
					}
				} catch (e) {}
			}
			return "0";
		},
		
		FLASHNA: function (typ) {
			try {
				try {
					// avoid fp6 minor version lookup issues
					// see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
					var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
					try {
						axo.AllowScriptAccess = 'always';
					} catch (e) {
						return '6.0.0';
					}
				} catch (e) {}
				return (new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1].match(/\d+/g)[0]).toString();
			} catch (e) {
				try {
					if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
						return ((navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1].match(/\d+/g)[0] ).toString()
					}
				} catch (e) {}
			}
			return "0";
		},
		
		ANDROID: function (type) {
			try {
				return (navigator.userAgent.toLowerCase().match(/android\s+(([\d\.]+))?/)[1]).toString();
			} catch (e) {}
            return "0";
		},

		IOS: function (type) {
			var agent = navigator.userAgent.toLowerCase(),
				start = agent.indexOf('os ');
			if ((agent.indexOf('iphone') > -1 || agent.indexOf('ipad') > -1) && start > -1) {
				return (agent.substr(start + 3, 3).replace('_', '.')).toString()
			}
			return "0";
		},

		NATIVE: function (type) {
			try {
				var testObject = $((type.indexOf('video')>-1) ? '<video/>' : '<audio/>').get(0);
				if (testObject.canPlayType!=null) {
					if (type==='*') {
						return "1";
					}
					switch (testObject.canPlayType(type)) {
                        case "no":
                        case "":
                            return "0";
                        // case "maybe":			
						// case "probably":
                        default:
                        	return "1";
					}
				}
			} catch (e) {}
            return "0";
		},

		BROWSER: function (type) {
			return "1";
		}
	}
});
