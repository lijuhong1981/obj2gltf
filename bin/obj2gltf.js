(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.obj2gltf = factory());
})(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var path$1 = {exports: {}};

	var util = {};

	var isBufferBrowser;
	var hasRequiredIsBufferBrowser;

	function requireIsBufferBrowser () {
		if (hasRequiredIsBufferBrowser) return isBufferBrowser;
		hasRequiredIsBufferBrowser = 1;
		isBufferBrowser = function isBuffer(arg) {
		  return arg && typeof arg === 'object'
		    && typeof arg.copy === 'function'
		    && typeof arg.fill === 'function'
		    && typeof arg.readUInt8 === 'function';
		};
		return isBufferBrowser;
	}

	var inherits_browser = {exports: {}};

	var hasRequiredInherits_browser;

	function requireInherits_browser () {
		if (hasRequiredInherits_browser) return inherits_browser.exports;
		hasRequiredInherits_browser = 1;
		if (typeof Object.create === 'function') {
		  // implementation from standard node.js 'util' module
		  inherits_browser.exports = function inherits(ctor, superCtor) {
		    ctor.super_ = superCtor;
		    ctor.prototype = Object.create(superCtor.prototype, {
		      constructor: {
		        value: ctor,
		        enumerable: false,
		        writable: true,
		        configurable: true
		      }
		    });
		  };
		} else {
		  // old school shim for old browsers
		  inherits_browser.exports = function inherits(ctor, superCtor) {
		    ctor.super_ = superCtor;
		    var TempCtor = function () {};
		    TempCtor.prototype = superCtor.prototype;
		    ctor.prototype = new TempCtor();
		    ctor.prototype.constructor = ctor;
		  };
		}
		return inherits_browser.exports;
	}

	var hasRequiredUtil;

	function requireUtil () {
		if (hasRequiredUtil) return util;
		hasRequiredUtil = 1;
		(function (exports) {
			// Copyright Joyent, Inc. and other Node contributors.
			//
			// Permission is hereby granted, free of charge, to any person obtaining a
			// copy of this software and associated documentation files (the
			// "Software"), to deal in the Software without restriction, including
			// without limitation the rights to use, copy, modify, merge, publish,
			// distribute, sublicense, and/or sell copies of the Software, and to permit
			// persons to whom the Software is furnished to do so, subject to the
			// following conditions:
			//
			// The above copyright notice and this permission notice shall be included
			// in all copies or substantial portions of the Software.
			//
			// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
			// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
			// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
			// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
			// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
			// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
			// USE OR OTHER DEALINGS IN THE SOFTWARE.

			var formatRegExp = /%[sdj%]/g;
			exports.format = function(f) {
			  if (!isString(f)) {
			    var objects = [];
			    for (var i = 0; i < arguments.length; i++) {
			      objects.push(inspect(arguments[i]));
			    }
			    return objects.join(' ');
			  }

			  var i = 1;
			  var args = arguments;
			  var len = args.length;
			  var str = String(f).replace(formatRegExp, function(x) {
			    if (x === '%%') return '%';
			    if (i >= len) return x;
			    switch (x) {
			      case '%s': return String(args[i++]);
			      case '%d': return Number(args[i++]);
			      case '%j':
			        try {
			          return JSON.stringify(args[i++]);
			        } catch (_) {
			          return '[Circular]';
			        }
			      default:
			        return x;
			    }
			  });
			  for (var x = args[i]; i < len; x = args[++i]) {
			    if (isNull(x) || !isObject(x)) {
			      str += ' ' + x;
			    } else {
			      str += ' ' + inspect(x);
			    }
			  }
			  return str;
			};


			// Mark that a method should not be used.
			// Returns a modified function which warns once by default.
			// If --no-deprecation is set, then it is a no-op.
			exports.deprecate = function(fn, msg) {
			  // Allow for deprecating things in the process of starting up.
			  if (isUndefined(commonjsGlobal.process)) {
			    return function() {
			      return exports.deprecate(fn, msg).apply(this, arguments);
			    };
			  }

			  if (process.noDeprecation === true) {
			    return fn;
			  }

			  var warned = false;
			  function deprecated() {
			    if (!warned) {
			      if (process.throwDeprecation) {
			        throw new Error(msg);
			      } else if (process.traceDeprecation) {
			        console.trace(msg);
			      } else {
			        console.error(msg);
			      }
			      warned = true;
			    }
			    return fn.apply(this, arguments);
			  }

			  return deprecated;
			};


			var debugs = {};
			var debugEnviron;
			exports.debuglog = function(set) {
			  if (isUndefined(debugEnviron))
			    debugEnviron = process.env.NODE_DEBUG || '';
			  set = set.toUpperCase();
			  if (!debugs[set]) {
			    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
			      var pid = process.pid;
			      debugs[set] = function() {
			        var msg = exports.format.apply(exports, arguments);
			        console.error('%s %d: %s', set, pid, msg);
			      };
			    } else {
			      debugs[set] = function() {};
			    }
			  }
			  return debugs[set];
			};


			/**
			 * Echos the value of a value. Trys to print the value out
			 * in the best way possible given the different types.
			 *
			 * @param {Object} obj The object to print out.
			 * @param {Object} opts Optional options object that alters the output.
			 */
			/* legacy: obj, showHidden, depth, colors*/
			function inspect(obj, opts) {
			  // default options
			  var ctx = {
			    seen: [],
			    stylize: stylizeNoColor
			  };
			  // legacy...
			  if (arguments.length >= 3) ctx.depth = arguments[2];
			  if (arguments.length >= 4) ctx.colors = arguments[3];
			  if (isBoolean(opts)) {
			    // legacy...
			    ctx.showHidden = opts;
			  } else if (opts) {
			    // got an "options" object
			    exports._extend(ctx, opts);
			  }
			  // set default options
			  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
			  if (isUndefined(ctx.depth)) ctx.depth = 2;
			  if (isUndefined(ctx.colors)) ctx.colors = false;
			  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
			  if (ctx.colors) ctx.stylize = stylizeWithColor;
			  return formatValue(ctx, obj, ctx.depth);
			}
			exports.inspect = inspect;


			// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
			inspect.colors = {
			  'bold' : [1, 22],
			  'italic' : [3, 23],
			  'underline' : [4, 24],
			  'inverse' : [7, 27],
			  'white' : [37, 39],
			  'grey' : [90, 39],
			  'black' : [30, 39],
			  'blue' : [34, 39],
			  'cyan' : [36, 39],
			  'green' : [32, 39],
			  'magenta' : [35, 39],
			  'red' : [31, 39],
			  'yellow' : [33, 39]
			};

			// Don't use 'blue' not visible on cmd.exe
			inspect.styles = {
			  'special': 'cyan',
			  'number': 'yellow',
			  'boolean': 'yellow',
			  'undefined': 'grey',
			  'null': 'bold',
			  'string': 'green',
			  'date': 'magenta',
			  // "name": intentionally not styling
			  'regexp': 'red'
			};


			function stylizeWithColor(str, styleType) {
			  var style = inspect.styles[styleType];

			  if (style) {
			    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
			           '\u001b[' + inspect.colors[style][1] + 'm';
			  } else {
			    return str;
			  }
			}


			function stylizeNoColor(str, styleType) {
			  return str;
			}


			function arrayToHash(array) {
			  var hash = {};

			  array.forEach(function(val, idx) {
			    hash[val] = true;
			  });

			  return hash;
			}


			function formatValue(ctx, value, recurseTimes) {
			  // Provide a hook for user-specified inspect functions.
			  // Check that value is an object with an inspect function on it
			  if (ctx.customInspect &&
			      value &&
			      isFunction(value.inspect) &&
			      // Filter out the util module, it's inspect function is special
			      value.inspect !== exports.inspect &&
			      // Also filter out any prototype objects using the circular check.
			      !(value.constructor && value.constructor.prototype === value)) {
			    var ret = value.inspect(recurseTimes, ctx);
			    if (!isString(ret)) {
			      ret = formatValue(ctx, ret, recurseTimes);
			    }
			    return ret;
			  }

			  // Primitive types cannot have properties
			  var primitive = formatPrimitive(ctx, value);
			  if (primitive) {
			    return primitive;
			  }

			  // Look up the keys of the object.
			  var keys = Object.keys(value);
			  var visibleKeys = arrayToHash(keys);

			  if (ctx.showHidden) {
			    keys = Object.getOwnPropertyNames(value);
			  }

			  // IE doesn't make error fields non-enumerable
			  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
			  if (isError(value)
			      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
			    return formatError(value);
			  }

			  // Some type of object without properties can be shortcutted.
			  if (keys.length === 0) {
			    if (isFunction(value)) {
			      var name = value.name ? ': ' + value.name : '';
			      return ctx.stylize('[Function' + name + ']', 'special');
			    }
			    if (isRegExp(value)) {
			      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
			    }
			    if (isDate(value)) {
			      return ctx.stylize(Date.prototype.toString.call(value), 'date');
			    }
			    if (isError(value)) {
			      return formatError(value);
			    }
			  }

			  var base = '', array = false, braces = ['{', '}'];

			  // Make Array say that they are Array
			  if (isArray(value)) {
			    array = true;
			    braces = ['[', ']'];
			  }

			  // Make functions say that they are functions
			  if (isFunction(value)) {
			    var n = value.name ? ': ' + value.name : '';
			    base = ' [Function' + n + ']';
			  }

			  // Make RegExps say that they are RegExps
			  if (isRegExp(value)) {
			    base = ' ' + RegExp.prototype.toString.call(value);
			  }

			  // Make dates with properties first say the date
			  if (isDate(value)) {
			    base = ' ' + Date.prototype.toUTCString.call(value);
			  }

			  // Make error with message first say the error
			  if (isError(value)) {
			    base = ' ' + formatError(value);
			  }

			  if (keys.length === 0 && (!array || value.length == 0)) {
			    return braces[0] + base + braces[1];
			  }

			  if (recurseTimes < 0) {
			    if (isRegExp(value)) {
			      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
			    } else {
			      return ctx.stylize('[Object]', 'special');
			    }
			  }

			  ctx.seen.push(value);

			  var output;
			  if (array) {
			    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
			  } else {
			    output = keys.map(function(key) {
			      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
			    });
			  }

			  ctx.seen.pop();

			  return reduceToSingleString(output, base, braces);
			}


			function formatPrimitive(ctx, value) {
			  if (isUndefined(value))
			    return ctx.stylize('undefined', 'undefined');
			  if (isString(value)) {
			    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
			                                             .replace(/'/g, "\\'")
			                                             .replace(/\\"/g, '"') + '\'';
			    return ctx.stylize(simple, 'string');
			  }
			  if (isNumber(value))
			    return ctx.stylize('' + value, 'number');
			  if (isBoolean(value))
			    return ctx.stylize('' + value, 'boolean');
			  // For some reason typeof null is "object", so special case here.
			  if (isNull(value))
			    return ctx.stylize('null', 'null');
			}


			function formatError(value) {
			  return '[' + Error.prototype.toString.call(value) + ']';
			}


			function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
			  var output = [];
			  for (var i = 0, l = value.length; i < l; ++i) {
			    if (hasOwnProperty(value, String(i))) {
			      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
			          String(i), true));
			    } else {
			      output.push('');
			    }
			  }
			  keys.forEach(function(key) {
			    if (!key.match(/^\d+$/)) {
			      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
			          key, true));
			    }
			  });
			  return output;
			}


			function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
			  var name, str, desc;
			  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
			  if (desc.get) {
			    if (desc.set) {
			      str = ctx.stylize('[Getter/Setter]', 'special');
			    } else {
			      str = ctx.stylize('[Getter]', 'special');
			    }
			  } else {
			    if (desc.set) {
			      str = ctx.stylize('[Setter]', 'special');
			    }
			  }
			  if (!hasOwnProperty(visibleKeys, key)) {
			    name = '[' + key + ']';
			  }
			  if (!str) {
			    if (ctx.seen.indexOf(desc.value) < 0) {
			      if (isNull(recurseTimes)) {
			        str = formatValue(ctx, desc.value, null);
			      } else {
			        str = formatValue(ctx, desc.value, recurseTimes - 1);
			      }
			      if (str.indexOf('\n') > -1) {
			        if (array) {
			          str = str.split('\n').map(function(line) {
			            return '  ' + line;
			          }).join('\n').substr(2);
			        } else {
			          str = '\n' + str.split('\n').map(function(line) {
			            return '   ' + line;
			          }).join('\n');
			        }
			      }
			    } else {
			      str = ctx.stylize('[Circular]', 'special');
			    }
			  }
			  if (isUndefined(name)) {
			    if (array && key.match(/^\d+$/)) {
			      return str;
			    }
			    name = JSON.stringify('' + key);
			    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
			      name = name.substr(1, name.length - 2);
			      name = ctx.stylize(name, 'name');
			    } else {
			      name = name.replace(/'/g, "\\'")
			                 .replace(/\\"/g, '"')
			                 .replace(/(^"|"$)/g, "'");
			      name = ctx.stylize(name, 'string');
			    }
			  }

			  return name + ': ' + str;
			}


			function reduceToSingleString(output, base, braces) {
			  var length = output.reduce(function(prev, cur) {
			    if (cur.indexOf('\n') >= 0) ;
			    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
			  }, 0);

			  if (length > 60) {
			    return braces[0] +
			           (base === '' ? '' : base + '\n ') +
			           ' ' +
			           output.join(',\n  ') +
			           ' ' +
			           braces[1];
			  }

			  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
			}


			// NOTE: These type checking functions intentionally don't use `instanceof`
			// because it is fragile and can be easily faked with `Object.create()`.
			function isArray(ar) {
			  return Array.isArray(ar);
			}
			exports.isArray = isArray;

			function isBoolean(arg) {
			  return typeof arg === 'boolean';
			}
			exports.isBoolean = isBoolean;

			function isNull(arg) {
			  return arg === null;
			}
			exports.isNull = isNull;

			function isNullOrUndefined(arg) {
			  return arg == null;
			}
			exports.isNullOrUndefined = isNullOrUndefined;

			function isNumber(arg) {
			  return typeof arg === 'number';
			}
			exports.isNumber = isNumber;

			function isString(arg) {
			  return typeof arg === 'string';
			}
			exports.isString = isString;

			function isSymbol(arg) {
			  return typeof arg === 'symbol';
			}
			exports.isSymbol = isSymbol;

			function isUndefined(arg) {
			  return arg === void 0;
			}
			exports.isUndefined = isUndefined;

			function isRegExp(re) {
			  return isObject(re) && objectToString(re) === '[object RegExp]';
			}
			exports.isRegExp = isRegExp;

			function isObject(arg) {
			  return typeof arg === 'object' && arg !== null;
			}
			exports.isObject = isObject;

			function isDate(d) {
			  return isObject(d) && objectToString(d) === '[object Date]';
			}
			exports.isDate = isDate;

			function isError(e) {
			  return isObject(e) &&
			      (objectToString(e) === '[object Error]' || e instanceof Error);
			}
			exports.isError = isError;

			function isFunction(arg) {
			  return typeof arg === 'function';
			}
			exports.isFunction = isFunction;

			function isPrimitive(arg) {
			  return arg === null ||
			         typeof arg === 'boolean' ||
			         typeof arg === 'number' ||
			         typeof arg === 'string' ||
			         typeof arg === 'symbol' ||  // ES6 symbol
			         typeof arg === 'undefined';
			}
			exports.isPrimitive = isPrimitive;

			exports.isBuffer = requireIsBufferBrowser();

			function objectToString(o) {
			  return Object.prototype.toString.call(o);
			}


			function pad(n) {
			  return n < 10 ? '0' + n.toString(10) : n.toString(10);
			}


			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
			              'Oct', 'Nov', 'Dec'];

			// 26 Feb 16:19:34
			function timestamp() {
			  var d = new Date();
			  var time = [pad(d.getHours()),
			              pad(d.getMinutes()),
			              pad(d.getSeconds())].join(':');
			  return [d.getDate(), months[d.getMonth()], time].join(' ');
			}


			// log is just a thin wrapper to console.log that prepends a timestamp
			exports.log = function() {
			  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
			};


			/**
			 * Inherit the prototype methods from one constructor into another.
			 *
			 * The Function.prototype.inherits from lang.js rewritten as a standalone
			 * function (not on Function.prototype). NOTE: If this file is to be loaded
			 * during bootstrapping this function needs to be rewritten using some native
			 * functions as prototype setup using normal JavaScript does not work as
			 * expected during bootstrapping (see mirror.js in r114903).
			 *
			 * @param {function} ctor Constructor function which needs to inherit the
			 *     prototype.
			 * @param {function} superCtor Constructor function to inherit prototype from.
			 */
			exports.inherits = requireInherits_browser();

			exports._extend = function(origin, add) {
			  // Don't do anything if add isn't an object
			  if (!add || !isObject(add)) return origin;

			  var keys = Object.keys(add);
			  var i = keys.length;
			  while (i--) {
			    origin[keys[i]] = add[keys[i]];
			  }
			  return origin;
			};

			function hasOwnProperty(obj, prop) {
			  return Object.prototype.hasOwnProperty.call(obj, prop);
			} 
		} (util));
		return util;
	}

	var hasRequiredPath;

	function requirePath () {
		if (hasRequiredPath) return path$1.exports;
		hasRequiredPath = 1;


		var isWindows = process.platform === 'win32';
		var util = requireUtil();


		// resolves . and .. elements in a path array with directory names there
		// must be no slashes or device names (c:\) in the array
		// (so also no leading and trailing slashes - it does not distinguish
		// relative and absolute paths)
		function normalizeArray(parts, allowAboveRoot) {
		  var res = [];
		  for (var i = 0; i < parts.length; i++) {
		    var p = parts[i];

		    // ignore empty parts
		    if (!p || p === '.')
		      continue;

		    if (p === '..') {
		      if (res.length && res[res.length - 1] !== '..') {
		        res.pop();
		      } else if (allowAboveRoot) {
		        res.push('..');
		      }
		    } else {
		      res.push(p);
		    }
		  }

		  return res;
		}

		// returns an array with empty elements removed from either end of the input
		// array or the original array if no elements need to be removed
		function trimArray(arr) {
		  var lastIndex = arr.length - 1;
		  var start = 0;
		  for (; start <= lastIndex; start++) {
		    if (arr[start])
		      break;
		  }

		  var end = lastIndex;
		  for (; end >= 0; end--) {
		    if (arr[end])
		      break;
		  }

		  if (start === 0 && end === lastIndex)
		    return arr;
		  if (start > end)
		    return [];
		  return arr.slice(start, end + 1);
		}

		// Regex to split a windows path into three parts: [*, device, slash,
		// tail] windows-only
		var splitDeviceRe =
		    /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

		// Regex to split the tail part of the above into [*, dir, basename, ext]
		var splitTailRe =
		    /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

		var win32 = {};

		// Function to split a filename into [root, dir, basename, ext]
		function win32SplitPath(filename) {
		  // Separate device+slash from tail
		  var result = splitDeviceRe.exec(filename),
		      device = (result[1] || '') + (result[2] || ''),
		      tail = result[3] || '';
		  // Split the tail into dir, basename and extension
		  var result2 = splitTailRe.exec(tail),
		      dir = result2[1],
		      basename = result2[2],
		      ext = result2[3];
		  return [device, dir, basename, ext];
		}

		function win32StatPath(path) {
		  var result = splitDeviceRe.exec(path),
		      device = result[1] || '',
		      isUnc = !!device && device[1] !== ':';
		  return {
		    device: device,
		    isUnc: isUnc,
		    isAbsolute: isUnc || !!result[2], // UNC paths are always absolute
		    tail: result[3]
		  };
		}

		function normalizeUNCRoot(device) {
		  return '\\\\' + device.replace(/^[\\\/]+/, '').replace(/[\\\/]+/g, '\\');
		}

		// path.resolve([from ...], to)
		win32.resolve = function() {
		  var resolvedDevice = '',
		      resolvedTail = '',
		      resolvedAbsolute = false;

		  for (var i = arguments.length - 1; i >= -1; i--) {
		    var path;
		    if (i >= 0) {
		      path = arguments[i];
		    } else if (!resolvedDevice) {
		      path = process.cwd();
		    } else {
		      // Windows has the concept of drive-specific current working
		      // directories. If we've resolved a drive letter but not yet an
		      // absolute path, get cwd for that drive. We're sure the device is not
		      // an unc path at this points, because unc paths are always absolute.
		      path = process.env['=' + resolvedDevice];
		      // Verify that a drive-local cwd was found and that it actually points
		      // to our drive. If not, default to the drive's root.
		      if (!path || path.substr(0, 3).toLowerCase() !==
		          resolvedDevice.toLowerCase() + '\\') {
		        path = resolvedDevice + '\\';
		      }
		    }

		    // Skip empty and invalid entries
		    if (!util.isString(path)) {
		      throw new TypeError('Arguments to path.resolve must be strings');
		    } else if (!path) {
		      continue;
		    }

		    var result = win32StatPath(path),
		        device = result.device,
		        isUnc = result.isUnc,
		        isAbsolute = result.isAbsolute,
		        tail = result.tail;

		    if (device &&
		        resolvedDevice &&
		        device.toLowerCase() !== resolvedDevice.toLowerCase()) {
		      // This path points to another device so it is not applicable
		      continue;
		    }

		    if (!resolvedDevice) {
		      resolvedDevice = device;
		    }
		    if (!resolvedAbsolute) {
		      resolvedTail = tail + '\\' + resolvedTail;
		      resolvedAbsolute = isAbsolute;
		    }

		    if (resolvedDevice && resolvedAbsolute) {
		      break;
		    }
		  }

		  // Convert slashes to backslashes when `resolvedDevice` points to an UNC
		  // root. Also squash multiple slashes into a single one where appropriate.
		  if (isUnc) {
		    resolvedDevice = normalizeUNCRoot(resolvedDevice);
		  }

		  // At this point the path should be resolved to a full absolute path,
		  // but handle relative paths to be safe (might happen when process.cwd()
		  // fails)

		  // Normalize the tail path
		  resolvedTail = normalizeArray(resolvedTail.split(/[\\\/]+/),
		                                !resolvedAbsolute).join('\\');

		  return (resolvedDevice + (resolvedAbsolute ? '\\' : '') + resolvedTail) ||
		         '.';
		};


		win32.normalize = function(path) {
		  var result = win32StatPath(path),
		      device = result.device,
		      isUnc = result.isUnc,
		      isAbsolute = result.isAbsolute,
		      tail = result.tail,
		      trailingSlash = /[\\\/]$/.test(tail);

		  // Normalize the tail path
		  tail = normalizeArray(tail.split(/[\\\/]+/), !isAbsolute).join('\\');

		  if (!tail && !isAbsolute) {
		    tail = '.';
		  }
		  if (tail && trailingSlash) {
		    tail += '\\';
		  }

		  // Convert slashes to backslashes when `device` points to an UNC root.
		  // Also squash multiple slashes into a single one where appropriate.
		  if (isUnc) {
		    device = normalizeUNCRoot(device);
		  }

		  return device + (isAbsolute ? '\\' : '') + tail;
		};


		win32.isAbsolute = function(path) {
		  return win32StatPath(path).isAbsolute;
		};

		win32.join = function() {
		  var paths = [];
		  for (var i = 0; i < arguments.length; i++) {
		    var arg = arguments[i];
		    if (!util.isString(arg)) {
		      throw new TypeError('Arguments to path.join must be strings');
		    }
		    if (arg) {
		      paths.push(arg);
		    }
		  }

		  var joined = paths.join('\\');

		  // Make sure that the joined path doesn't start with two slashes, because
		  // normalize() will mistake it for an UNC path then.
		  //
		  // This step is skipped when it is very clear that the user actually
		  // intended to point at an UNC path. This is assumed when the first
		  // non-empty string arguments starts with exactly two slashes followed by
		  // at least one more non-slash character.
		  //
		  // Note that for normalize() to treat a path as an UNC path it needs to
		  // have at least 2 components, so we don't filter for that here.
		  // This means that the user can use join to construct UNC paths from
		  // a server name and a share name; for example:
		  //   path.join('//server', 'share') -> '\\\\server\\share\')
		  if (!/^[\\\/]{2}[^\\\/]/.test(paths[0])) {
		    joined = joined.replace(/^[\\\/]{2,}/, '\\');
		  }

		  return win32.normalize(joined);
		};


		// path.relative(from, to)
		// it will solve the relative path from 'from' to 'to', for instance:
		// from = 'C:\\orandea\\test\\aaa'
		// to = 'C:\\orandea\\impl\\bbb'
		// The output of the function should be: '..\\..\\impl\\bbb'
		win32.relative = function(from, to) {
		  from = win32.resolve(from);
		  to = win32.resolve(to);

		  // windows is not case sensitive
		  var lowerFrom = from.toLowerCase();
		  var lowerTo = to.toLowerCase();

		  var toParts = trimArray(to.split('\\'));

		  var lowerFromParts = trimArray(lowerFrom.split('\\'));
		  var lowerToParts = trimArray(lowerTo.split('\\'));

		  var length = Math.min(lowerFromParts.length, lowerToParts.length);
		  var samePartsLength = length;
		  for (var i = 0; i < length; i++) {
		    if (lowerFromParts[i] !== lowerToParts[i]) {
		      samePartsLength = i;
		      break;
		    }
		  }

		  if (samePartsLength == 0) {
		    return to;
		  }

		  var outputParts = [];
		  for (var i = samePartsLength; i < lowerFromParts.length; i++) {
		    outputParts.push('..');
		  }

		  outputParts = outputParts.concat(toParts.slice(samePartsLength));

		  return outputParts.join('\\');
		};


		win32._makeLong = function(path) {
		  // Note: this will *probably* throw somewhere.
		  if (!util.isString(path))
		    return path;

		  if (!path) {
		    return '';
		  }

		  var resolvedPath = win32.resolve(path);

		  if (/^[a-zA-Z]\:\\/.test(resolvedPath)) {
		    // path is local filesystem path, which needs to be converted
		    // to long UNC path.
		    return '\\\\?\\' + resolvedPath;
		  } else if (/^\\\\[^?.]/.test(resolvedPath)) {
		    // path is network UNC path, which needs to be converted
		    // to long UNC path.
		    return '\\\\?\\UNC\\' + resolvedPath.substring(2);
		  }

		  return path;
		};


		win32.dirname = function(path) {
		  var result = win32SplitPath(path),
		      root = result[0],
		      dir = result[1];

		  if (!root && !dir) {
		    // No dirname whatsoever
		    return '.';
		  }

		  if (dir) {
		    // It has a dirname, strip trailing slash
		    dir = dir.substr(0, dir.length - 1);
		  }

		  return root + dir;
		};


		win32.basename = function(path, ext) {
		  var f = win32SplitPath(path)[2];
		  // TODO: make this comparison case-insensitive on windows?
		  if (ext && f.substr(-1 * ext.length) === ext) {
		    f = f.substr(0, f.length - ext.length);
		  }
		  return f;
		};


		win32.extname = function(path) {
		  return win32SplitPath(path)[3];
		};


		win32.format = function(pathObject) {
		  if (!util.isObject(pathObject)) {
		    throw new TypeError(
		        "Parameter 'pathObject' must be an object, not " + typeof pathObject
		    );
		  }

		  var root = pathObject.root || '';

		  if (!util.isString(root)) {
		    throw new TypeError(
		        "'pathObject.root' must be a string or undefined, not " +
		        typeof pathObject.root
		    );
		  }

		  var dir = pathObject.dir;
		  var base = pathObject.base || '';
		  if (!dir) {
		    return base;
		  }
		  if (dir[dir.length - 1] === win32.sep) {
		    return dir + base;
		  }
		  return dir + win32.sep + base;
		};


		win32.parse = function(pathString) {
		  if (!util.isString(pathString)) {
		    throw new TypeError(
		        "Parameter 'pathString' must be a string, not " + typeof pathString
		    );
		  }
		  var allParts = win32SplitPath(pathString);
		  if (!allParts || allParts.length !== 4) {
		    throw new TypeError("Invalid path '" + pathString + "'");
		  }
		  return {
		    root: allParts[0],
		    dir: allParts[0] + allParts[1].slice(0, -1),
		    base: allParts[2],
		    ext: allParts[3],
		    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
		  };
		};


		win32.sep = '\\';
		win32.delimiter = ';';


		// Split a filename into [root, dir, basename, ext], unix version
		// 'root' is just a slash, or nothing.
		var splitPathRe =
		    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
		var posix = {};


		function posixSplitPath(filename) {
		  return splitPathRe.exec(filename).slice(1);
		}


		// path.resolve([from ...], to)
		// posix version
		posix.resolve = function() {
		  var resolvedPath = '',
		      resolvedAbsolute = false;

		  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
		    var path = (i >= 0) ? arguments[i] : process.cwd();

		    // Skip empty and invalid entries
		    if (!util.isString(path)) {
		      throw new TypeError('Arguments to path.resolve must be strings');
		    } else if (!path) {
		      continue;
		    }

		    resolvedPath = path + '/' + resolvedPath;
		    resolvedAbsolute = path[0] === '/';
		  }

		  // At this point the path should be resolved to a full absolute path, but
		  // handle relative paths to be safe (might happen when process.cwd() fails)

		  // Normalize the path
		  resolvedPath = normalizeArray(resolvedPath.split('/'),
		                                !resolvedAbsolute).join('/');

		  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
		};

		// path.normalize(path)
		// posix version
		posix.normalize = function(path) {
		  var isAbsolute = posix.isAbsolute(path),
		      trailingSlash = path && path[path.length - 1] === '/';

		  // Normalize the path
		  path = normalizeArray(path.split('/'), !isAbsolute).join('/');

		  if (!path && !isAbsolute) {
		    path = '.';
		  }
		  if (path && trailingSlash) {
		    path += '/';
		  }

		  return (isAbsolute ? '/' : '') + path;
		};

		// posix version
		posix.isAbsolute = function(path) {
		  return path.charAt(0) === '/';
		};

		// posix version
		posix.join = function() {
		  var path = '';
		  for (var i = 0; i < arguments.length; i++) {
		    var segment = arguments[i];
		    if (!util.isString(segment)) {
		      throw new TypeError('Arguments to path.join must be strings');
		    }
		    if (segment) {
		      if (!path) {
		        path += segment;
		      } else {
		        path += '/' + segment;
		      }
		    }
		  }
		  return posix.normalize(path);
		};


		// path.relative(from, to)
		// posix version
		posix.relative = function(from, to) {
		  from = posix.resolve(from).substr(1);
		  to = posix.resolve(to).substr(1);

		  var fromParts = trimArray(from.split('/'));
		  var toParts = trimArray(to.split('/'));

		  var length = Math.min(fromParts.length, toParts.length);
		  var samePartsLength = length;
		  for (var i = 0; i < length; i++) {
		    if (fromParts[i] !== toParts[i]) {
		      samePartsLength = i;
		      break;
		    }
		  }

		  var outputParts = [];
		  for (var i = samePartsLength; i < fromParts.length; i++) {
		    outputParts.push('..');
		  }

		  outputParts = outputParts.concat(toParts.slice(samePartsLength));

		  return outputParts.join('/');
		};


		posix._makeLong = function(path) {
		  return path;
		};


		posix.dirname = function(path) {
		  var result = posixSplitPath(path),
		      root = result[0],
		      dir = result[1];

		  if (!root && !dir) {
		    // No dirname whatsoever
		    return '.';
		  }

		  if (dir) {
		    // It has a dirname, strip trailing slash
		    dir = dir.substr(0, dir.length - 1);
		  }

		  return root + dir;
		};


		posix.basename = function(path, ext) {
		  var f = posixSplitPath(path)[2];
		  // TODO: make this comparison case-insensitive on windows?
		  if (ext && f.substr(-1 * ext.length) === ext) {
		    f = f.substr(0, f.length - ext.length);
		  }
		  return f;
		};


		posix.extname = function(path) {
		  return posixSplitPath(path)[3];
		};


		posix.format = function(pathObject) {
		  if (!util.isObject(pathObject)) {
		    throw new TypeError(
		        "Parameter 'pathObject' must be an object, not " + typeof pathObject
		    );
		  }

		  var root = pathObject.root || '';

		  if (!util.isString(root)) {
		    throw new TypeError(
		        "'pathObject.root' must be a string or undefined, not " +
		        typeof pathObject.root
		    );
		  }

		  var dir = pathObject.dir ? pathObject.dir + posix.sep : '';
		  var base = pathObject.base || '';
		  return dir + base;
		};


		posix.parse = function(pathString) {
		  if (!util.isString(pathString)) {
		    throw new TypeError(
		        "Parameter 'pathString' must be a string, not " + typeof pathString
		    );
		  }
		  var allParts = posixSplitPath(pathString);
		  if (!allParts || allParts.length !== 4) {
		    throw new TypeError("Invalid path '" + pathString + "'");
		  }
		  allParts[1] = allParts[1] || '';
		  allParts[2] = allParts[2] || '';
		  allParts[3] = allParts[3] || '';

		  return {
		    root: allParts[0],
		    dir: allParts[0] + allParts[1].slice(0, -1),
		    base: allParts[2],
		    ext: allParts[3],
		    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
		  };
		};


		posix.sep = '/';
		posix.delimiter = ':';


		if (isWindows)
		  path$1.exports = win32;
		else /* posix */
		  path$1.exports = posix;

		path$1.exports.posix = posix;
		path$1.exports.win32 = win32;
		return path$1.exports;
	}

	var pathExports = requirePath();
	var path = /*@__PURE__*/getDefaultExportFromCjs(pathExports);

	var bluebird = {exports: {}};

	/* @preserve
	 * The MIT License (MIT)
	 * 
	 * Copyright (c) 2013-2018 Petka Antonov
	 * 
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 * 
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 * 
	 */

	var hasRequiredBluebird;

	function requireBluebird () {
		if (hasRequiredBluebird) return bluebird.exports;
		hasRequiredBluebird = 1;
		(function (module, exports) {
			/**
			 * bluebird build version 3.7.2
			 * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, using, timers, filter, any, each
			*/
			!function(e){module.exports=e();}(function(){return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
			module.exports = function(Promise) {
			var SomePromiseArray = Promise._SomePromiseArray;
			function any(promises) {
			    var ret = new SomePromiseArray(promises);
			    var promise = ret.promise();
			    ret.setHowMany(1);
			    ret.setUnwrap();
			    ret.init();
			    return promise;
			}

			Promise.any = function (promises) {
			    return any(promises);
			};

			Promise.prototype.any = function () {
			    return any(this);
			};

			};

			},{}],2:[function(_dereq_,module,exports){
			var firstLineError;
			try {throw new Error(); } catch (e) {firstLineError = e;}
			var schedule = _dereq_("./schedule");
			var Queue = _dereq_("./queue");

			function Async() {
			    this._customScheduler = false;
			    this._isTickUsed = false;
			    this._lateQueue = new Queue(16);
			    this._normalQueue = new Queue(16);
			    this._haveDrainedQueues = false;
			    var self = this;
			    this.drainQueues = function () {
			        self._drainQueues();
			    };
			    this._schedule = schedule;
			}

			Async.prototype.setScheduler = function(fn) {
			    var prev = this._schedule;
			    this._schedule = fn;
			    this._customScheduler = true;
			    return prev;
			};

			Async.prototype.hasCustomScheduler = function() {
			    return this._customScheduler;
			};

			Async.prototype.haveItemsQueued = function () {
			    return this._isTickUsed || this._haveDrainedQueues;
			};


			Async.prototype.fatalError = function(e, isNode) {
			    if (isNode) {
			        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) +
			            "\n");
			        process.exit(2);
			    } else {
			        this.throwLater(e);
			    }
			};

			Async.prototype.throwLater = function(fn, arg) {
			    if (arguments.length === 1) {
			        arg = fn;
			        fn = function () { throw arg; };
			    }
			    if (typeof setTimeout !== "undefined") {
			        setTimeout(function() {
			            fn(arg);
			        }, 0);
			    } else try {
			        this._schedule(function() {
			            fn(arg);
			        });
			    } catch (e) {
			        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			    }
			};

			function AsyncInvokeLater(fn, receiver, arg) {
			    this._lateQueue.push(fn, receiver, arg);
			    this._queueTick();
			}

			function AsyncInvoke(fn, receiver, arg) {
			    this._normalQueue.push(fn, receiver, arg);
			    this._queueTick();
			}

			function AsyncSettlePromises(promise) {
			    this._normalQueue._pushOne(promise);
			    this._queueTick();
			}

			Async.prototype.invokeLater = AsyncInvokeLater;
			Async.prototype.invoke = AsyncInvoke;
			Async.prototype.settlePromises = AsyncSettlePromises;


			function _drainQueue(queue) {
			    while (queue.length() > 0) {
			        _drainQueueStep(queue);
			    }
			}

			function _drainQueueStep(queue) {
			    var fn = queue.shift();
			    if (typeof fn !== "function") {
			        fn._settlePromises();
			    } else {
			        var receiver = queue.shift();
			        var arg = queue.shift();
			        fn.call(receiver, arg);
			    }
			}

			Async.prototype._drainQueues = function () {
			    _drainQueue(this._normalQueue);
			    this._reset();
			    this._haveDrainedQueues = true;
			    _drainQueue(this._lateQueue);
			};

			Async.prototype._queueTick = function () {
			    if (!this._isTickUsed) {
			        this._isTickUsed = true;
			        this._schedule(this.drainQueues);
			    }
			};

			Async.prototype._reset = function () {
			    this._isTickUsed = false;
			};

			module.exports = Async;
			module.exports.firstLineError = firstLineError;

			},{"./queue":26,"./schedule":29}],3:[function(_dereq_,module,exports){
			module.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
			var calledBind = false;
			var rejectThis = function(_, e) {
			    this._reject(e);
			};

			var targetRejected = function(e, context) {
			    context.promiseRejectionQueued = true;
			    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
			};

			var bindingResolved = function(thisArg, context) {
			    if (((this._bitField & 50397184) === 0)) {
			        this._resolveCallback(context.target);
			    }
			};

			var bindingRejected = function(e, context) {
			    if (!context.promiseRejectionQueued) this._reject(e);
			};

			Promise.prototype.bind = function (thisArg) {
			    if (!calledBind) {
			        calledBind = true;
			        Promise.prototype._propagateFrom = debug.propagateFromFunction();
			        Promise.prototype._boundValue = debug.boundValueFunction();
			    }
			    var maybePromise = tryConvertToPromise(thisArg);
			    var ret = new Promise(INTERNAL);
			    ret._propagateFrom(this, 1);
			    var target = this._target();
			    ret._setBoundTo(maybePromise);
			    if (maybePromise instanceof Promise) {
			        var context = {
			            promiseRejectionQueued: false,
			            promise: ret,
			            target: target,
			            bindingPromise: maybePromise
			        };
			        target._then(INTERNAL, targetRejected, undefined, ret, context);
			        maybePromise._then(
			            bindingResolved, bindingRejected, undefined, ret, context);
			        ret._setOnCancel(maybePromise);
			    } else {
			        ret._resolveCallback(target);
			    }
			    return ret;
			};

			Promise.prototype._setBoundTo = function (obj) {
			    if (obj !== undefined) {
			        this._bitField = this._bitField | 2097152;
			        this._boundTo = obj;
			    } else {
			        this._bitField = this._bitField & (~2097152);
			    }
			};

			Promise.prototype._isBound = function () {
			    return (this._bitField & 2097152) === 2097152;
			};

			Promise.bind = function (thisArg, value) {
			    return Promise.resolve(value).bind(thisArg);
			};
			};

			},{}],4:[function(_dereq_,module,exports){
			var old;
			if (typeof Promise !== "undefined") old = Promise;
			function noConflict() {
			    try { if (Promise === bluebird) Promise = old; }
			    catch (e) {}
			    return bluebird;
			}
			var bluebird = _dereq_("./promise")();
			bluebird.noConflict = noConflict;
			module.exports = bluebird;

			},{"./promise":22}],5:[function(_dereq_,module,exports){
			var cr = Object.create;
			if (cr) {
			    var callerCache = cr(null);
			    var getterCache = cr(null);
			    callerCache[" size"] = getterCache[" size"] = 0;
			}

			module.exports = function(Promise) {
			var util = _dereq_("./util");
			var canEvaluate = util.canEvaluate;
			util.isIdentifier;
			var getGetter;

			function ensureMethod(obj, methodName) {
			    var fn;
			    if (obj != null) fn = obj[methodName];
			    if (typeof fn !== "function") {
			        var message = "Object " + util.classString(obj) + " has no method '" +
			            util.toString(methodName) + "'";
			        throw new Promise.TypeError(message);
			    }
			    return fn;
			}

			function caller(obj) {
			    var methodName = this.pop();
			    var fn = ensureMethod(obj, methodName);
			    return fn.apply(obj, this);
			}
			Promise.prototype.call = function (methodName) {
			    var args = [].slice.call(arguments, 1);		    args.push(methodName);
			    return this._then(caller, undefined, undefined, args, undefined);
			};

			function namedGetter(obj) {
			    return obj[this];
			}
			function indexedGetter(obj) {
			    var index = +this;
			    if (index < 0) index = Math.max(0, index + obj.length);
			    return obj[index];
			}
			Promise.prototype.get = function (propertyName) {
			    var isIndex = (typeof propertyName === "number");
			    var getter;
			    if (!isIndex) {
			        if (canEvaluate) {
			            var maybeGetter = getGetter(propertyName);
			            getter = maybeGetter !== null ? maybeGetter : namedGetter;
			        } else {
			            getter = namedGetter;
			        }
			    } else {
			        getter = indexedGetter;
			    }
			    return this._then(getter, undefined, undefined, propertyName, undefined);
			};
			};

			},{"./util":36}],6:[function(_dereq_,module,exports){
			module.exports = function(Promise, PromiseArray, apiRejection, debug) {
			var util = _dereq_("./util");
			var tryCatch = util.tryCatch;
			var errorObj = util.errorObj;
			var async = Promise._async;

			Promise.prototype["break"] = Promise.prototype.cancel = function() {
			    if (!debug.cancellation()) return this._warn("cancellation is disabled");

			    var promise = this;
			    var child = promise;
			    while (promise._isCancellable()) {
			        if (!promise._cancelBy(child)) {
			            if (child._isFollowing()) {
			                child._followee().cancel();
			            } else {
			                child._cancelBranched();
			            }
			            break;
			        }

			        var parent = promise._cancellationParent;
			        if (parent == null || !parent._isCancellable()) {
			            if (promise._isFollowing()) {
			                promise._followee().cancel();
			            } else {
			                promise._cancelBranched();
			            }
			            break;
			        } else {
			            if (promise._isFollowing()) promise._followee().cancel();
			            promise._setWillBeCancelled();
			            child = promise;
			            promise = parent;
			        }
			    }
			};

			Promise.prototype._branchHasCancelled = function() {
			    this._branchesRemainingToCancel--;
			};

			Promise.prototype._enoughBranchesHaveCancelled = function() {
			    return this._branchesRemainingToCancel === undefined ||
			           this._branchesRemainingToCancel <= 0;
			};

			Promise.prototype._cancelBy = function(canceller) {
			    if (canceller === this) {
			        this._branchesRemainingToCancel = 0;
			        this._invokeOnCancel();
			        return true;
			    } else {
			        this._branchHasCancelled();
			        if (this._enoughBranchesHaveCancelled()) {
			            this._invokeOnCancel();
			            return true;
			        }
			    }
			    return false;
			};

			Promise.prototype._cancelBranched = function() {
			    if (this._enoughBranchesHaveCancelled()) {
			        this._cancel();
			    }
			};

			Promise.prototype._cancel = function() {
			    if (!this._isCancellable()) return;
			    this._setCancelled();
			    async.invoke(this._cancelPromises, this, undefined);
			};

			Promise.prototype._cancelPromises = function() {
			    if (this._length() > 0) this._settlePromises();
			};

			Promise.prototype._unsetOnCancel = function() {
			    this._onCancelField = undefined;
			};

			Promise.prototype._isCancellable = function() {
			    return this.isPending() && !this._isCancelled();
			};

			Promise.prototype.isCancellable = function() {
			    return this.isPending() && !this.isCancelled();
			};

			Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
			    if (util.isArray(onCancelCallback)) {
			        for (var i = 0; i < onCancelCallback.length; ++i) {
			            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
			        }
			    } else if (onCancelCallback !== undefined) {
			        if (typeof onCancelCallback === "function") {
			            if (!internalOnly) {
			                var e = tryCatch(onCancelCallback).call(this._boundValue());
			                if (e === errorObj) {
			                    this._attachExtraTrace(e.e);
			                    async.throwLater(e.e);
			                }
			            }
			        } else {
			            onCancelCallback._resultCancelled(this);
			        }
			    }
			};

			Promise.prototype._invokeOnCancel = function() {
			    var onCancelCallback = this._onCancel();
			    this._unsetOnCancel();
			    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
			};

			Promise.prototype._invokeInternalOnCancel = function() {
			    if (this._isCancellable()) {
			        this._doInvokeOnCancel(this._onCancel(), true);
			        this._unsetOnCancel();
			    }
			};

			Promise.prototype._resultCancelled = function() {
			    this.cancel();
			};

			};

			},{"./util":36}],7:[function(_dereq_,module,exports){
			module.exports = function(NEXT_FILTER) {
			var util = _dereq_("./util");
			var getKeys = _dereq_("./es5").keys;
			var tryCatch = util.tryCatch;
			var errorObj = util.errorObj;

			function catchFilter(instances, cb, promise) {
			    return function(e) {
			        var boundTo = promise._boundValue();
			        predicateLoop: for (var i = 0; i < instances.length; ++i) {
			            var item = instances[i];

			            if (item === Error ||
			                (item != null && item.prototype instanceof Error)) {
			                if (e instanceof item) {
			                    return tryCatch(cb).call(boundTo, e);
			                }
			            } else if (typeof item === "function") {
			                var matchesPredicate = tryCatch(item).call(boundTo, e);
			                if (matchesPredicate === errorObj) {
			                    return matchesPredicate;
			                } else if (matchesPredicate) {
			                    return tryCatch(cb).call(boundTo, e);
			                }
			            } else if (util.isObject(e)) {
			                var keys = getKeys(item);
			                for (var j = 0; j < keys.length; ++j) {
			                    var key = keys[j];
			                    if (item[key] != e[key]) {
			                        continue predicateLoop;
			                    }
			                }
			                return tryCatch(cb).call(boundTo, e);
			            }
			        }
			        return NEXT_FILTER;
			    };
			}

			return catchFilter;
			};

			},{"./es5":13,"./util":36}],8:[function(_dereq_,module,exports){
			module.exports = function(Promise) {
			var longStackTraces = false;
			var contextStack = [];

			Promise.prototype._promiseCreated = function() {};
			Promise.prototype._pushContext = function() {};
			Promise.prototype._popContext = function() {return null;};
			Promise._peekContext = Promise.prototype._peekContext = function() {};

			function Context() {
			    this._trace = new Context.CapturedTrace(peekContext());
			}
			Context.prototype._pushContext = function () {
			    if (this._trace !== undefined) {
			        this._trace._promiseCreated = null;
			        contextStack.push(this._trace);
			    }
			};

			Context.prototype._popContext = function () {
			    if (this._trace !== undefined) {
			        var trace = contextStack.pop();
			        var ret = trace._promiseCreated;
			        trace._promiseCreated = null;
			        return ret;
			    }
			    return null;
			};

			function createContext() {
			    if (longStackTraces) return new Context();
			}

			function peekContext() {
			    var lastIndex = contextStack.length - 1;
			    if (lastIndex >= 0) {
			        return contextStack[lastIndex];
			    }
			    return undefined;
			}
			Context.CapturedTrace = null;
			Context.create = createContext;
			Context.deactivateLongStackTraces = function() {};
			Context.activateLongStackTraces = function() {
			    var Promise_pushContext = Promise.prototype._pushContext;
			    var Promise_popContext = Promise.prototype._popContext;
			    var Promise_PeekContext = Promise._peekContext;
			    var Promise_peekContext = Promise.prototype._peekContext;
			    var Promise_promiseCreated = Promise.prototype._promiseCreated;
			    Context.deactivateLongStackTraces = function() {
			        Promise.prototype._pushContext = Promise_pushContext;
			        Promise.prototype._popContext = Promise_popContext;
			        Promise._peekContext = Promise_PeekContext;
			        Promise.prototype._peekContext = Promise_peekContext;
			        Promise.prototype._promiseCreated = Promise_promiseCreated;
			        longStackTraces = false;
			    };
			    longStackTraces = true;
			    Promise.prototype._pushContext = Context.prototype._pushContext;
			    Promise.prototype._popContext = Context.prototype._popContext;
			    Promise._peekContext = Promise.prototype._peekContext = peekContext;
			    Promise.prototype._promiseCreated = function() {
			        var ctx = this._peekContext();
			        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
			    };
			};
			return Context;
			};

			},{}],9:[function(_dereq_,module,exports){
			module.exports = function(Promise, Context,
			    enableAsyncHooks, disableAsyncHooks) {
			var async = Promise._async;
			var Warning = _dereq_("./errors").Warning;
			var util = _dereq_("./util");
			var es5 = _dereq_("./es5");
			var canAttachTrace = util.canAttachTrace;
			var unhandledRejectionHandled;
			var possiblyUnhandledRejection;
			var bluebirdFramePattern =
			    /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
			var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
			var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
			var stackFramePattern = null;
			var formatStack = null;
			var indentStackFrames = false;
			var printWarning;
			var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 &&
			                        (true));

			var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 &&
			    (debugging || util.env("BLUEBIRD_WARNINGS")));

			var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 &&
			    (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));

			var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 &&
			    (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

			var deferUnhandledRejectionCheck;
			(function() {
			    var promises = [];

			    function unhandledRejectionCheck() {
			        for (var i = 0; i < promises.length; ++i) {
			            promises[i]._notifyUnhandledRejection();
			        }
			        unhandledRejectionClear();
			    }

			    function unhandledRejectionClear() {
			        promises.length = 0;
			    }

			    deferUnhandledRejectionCheck = function(promise) {
			        promises.push(promise);
			        setTimeout(unhandledRejectionCheck, 1);
			    };

			    es5.defineProperty(Promise, "_unhandledRejectionCheck", {
			        value: unhandledRejectionCheck
			    });
			    es5.defineProperty(Promise, "_unhandledRejectionClear", {
			        value: unhandledRejectionClear
			    });
			})();

			Promise.prototype.suppressUnhandledRejections = function() {
			    var target = this._target();
			    target._bitField = ((target._bitField & (~1048576)) |
			                      524288);
			};

			Promise.prototype._ensurePossibleRejectionHandled = function () {
			    if ((this._bitField & 524288) !== 0) return;
			    this._setRejectionIsUnhandled();
			    deferUnhandledRejectionCheck(this);
			};

			Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
			    fireRejectionEvent("rejectionHandled",
			                                  unhandledRejectionHandled, undefined, this);
			};

			Promise.prototype._setReturnedNonUndefined = function() {
			    this._bitField = this._bitField | 268435456;
			};

			Promise.prototype._returnedNonUndefined = function() {
			    return (this._bitField & 268435456) !== 0;
			};

			Promise.prototype._notifyUnhandledRejection = function () {
			    if (this._isRejectionUnhandled()) {
			        var reason = this._settledValue();
			        this._setUnhandledRejectionIsNotified();
			        fireRejectionEvent("unhandledRejection",
			                                      possiblyUnhandledRejection, reason, this);
			    }
			};

			Promise.prototype._setUnhandledRejectionIsNotified = function () {
			    this._bitField = this._bitField | 262144;
			};

			Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
			    this._bitField = this._bitField & (~262144);
			};

			Promise.prototype._isUnhandledRejectionNotified = function () {
			    return (this._bitField & 262144) > 0;
			};

			Promise.prototype._setRejectionIsUnhandled = function () {
			    this._bitField = this._bitField | 1048576;
			};

			Promise.prototype._unsetRejectionIsUnhandled = function () {
			    this._bitField = this._bitField & (~1048576);
			    if (this._isUnhandledRejectionNotified()) {
			        this._unsetUnhandledRejectionIsNotified();
			        this._notifyUnhandledRejectionIsHandled();
			    }
			};

			Promise.prototype._isRejectionUnhandled = function () {
			    return (this._bitField & 1048576) > 0;
			};

			Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
			    return warn(message, shouldUseOwnTrace, promise || this);
			};

			Promise.onPossiblyUnhandledRejection = function (fn) {
			    var context = Promise._getContext();
			    possiblyUnhandledRejection = util.contextBind(context, fn);
			};

			Promise.onUnhandledRejectionHandled = function (fn) {
			    var context = Promise._getContext();
			    unhandledRejectionHandled = util.contextBind(context, fn);
			};

			var disableLongStackTraces = function() {};
			Promise.longStackTraces = function () {
			    if (async.haveItemsQueued() && !config.longStackTraces) {
			        throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			    }
			    if (!config.longStackTraces && longStackTracesIsSupported()) {
			        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
			        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
			        var Promise_dereferenceTrace = Promise.prototype._dereferenceTrace;
			        config.longStackTraces = true;
			        disableLongStackTraces = function() {
			            if (async.haveItemsQueued() && !config.longStackTraces) {
			                throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			            }
			            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
			            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
			            Promise.prototype._dereferenceTrace = Promise_dereferenceTrace;
			            Context.deactivateLongStackTraces();
			            config.longStackTraces = false;
			        };
			        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
			        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
			        Promise.prototype._dereferenceTrace = longStackTracesDereferenceTrace;
			        Context.activateLongStackTraces();
			    }
			};

			Promise.hasLongStackTraces = function () {
			    return config.longStackTraces && longStackTracesIsSupported();
			};


			var legacyHandlers = {
			    unhandledrejection: {
			        before: function() {
			            var ret = util.global.onunhandledrejection;
			            util.global.onunhandledrejection = null;
			            return ret;
			        },
			        after: function(fn) {
			            util.global.onunhandledrejection = fn;
			        }
			    },
			    rejectionhandled: {
			        before: function() {
			            var ret = util.global.onrejectionhandled;
			            util.global.onrejectionhandled = null;
			            return ret;
			        },
			        after: function(fn) {
			            util.global.onrejectionhandled = fn;
			        }
			    }
			};

			var fireDomEvent = (function() {
			    var dispatch = function(legacy, e) {
			        if (legacy) {
			            var fn;
			            try {
			                fn = legacy.before();
			                return !util.global.dispatchEvent(e);
			            } finally {
			                legacy.after(fn);
			            }
			        } else {
			            return !util.global.dispatchEvent(e);
			        }
			    };
			    try {
			        if (typeof CustomEvent === "function") {
			            var event = new CustomEvent("CustomEvent");
			            util.global.dispatchEvent(event);
			            return function(name, event) {
			                name = name.toLowerCase();
			                var eventData = {
			                    detail: event,
			                    cancelable: true
			                };
			                var domEvent = new CustomEvent(name, eventData);
			                es5.defineProperty(
			                    domEvent, "promise", {value: event.promise});
			                es5.defineProperty(
			                    domEvent, "reason", {value: event.reason});

			                return dispatch(legacyHandlers[name], domEvent);
			            };
			        } else if (typeof Event === "function") {
			            var event = new Event("CustomEvent");
			            util.global.dispatchEvent(event);
			            return function(name, event) {
			                name = name.toLowerCase();
			                var domEvent = new Event(name, {
			                    cancelable: true
			                });
			                domEvent.detail = event;
			                es5.defineProperty(domEvent, "promise", {value: event.promise});
			                es5.defineProperty(domEvent, "reason", {value: event.reason});
			                return dispatch(legacyHandlers[name], domEvent);
			            };
			        } else {
			            var event = document.createEvent("CustomEvent");
			            event.initCustomEvent("testingtheevent", false, true, {});
			            util.global.dispatchEvent(event);
			            return function(name, event) {
			                name = name.toLowerCase();
			                var domEvent = document.createEvent("CustomEvent");
			                domEvent.initCustomEvent(name, false, true,
			                    event);
			                return dispatch(legacyHandlers[name], domEvent);
			            };
			        }
			    } catch (e) {}
			    return function() {
			        return false;
			    };
			})();

			var fireGlobalEvent = (function() {
			    if (util.isNode) {
			        return function() {
			            return process.emit.apply(process, arguments);
			        };
			    } else {
			        if (!util.global) {
			            return function() {
			                return false;
			            };
			        }
			        return function(name) {
			            var methodName = "on" + name.toLowerCase();
			            var method = util.global[methodName];
			            if (!method) return false;
			            method.apply(util.global, [].slice.call(arguments, 1));
			            return true;
			        };
			    }
			})();

			function generatePromiseLifecycleEventObject(name, promise) {
			    return {promise: promise};
			}

			var eventToObjectGenerator = {
			    promiseCreated: generatePromiseLifecycleEventObject,
			    promiseFulfilled: generatePromiseLifecycleEventObject,
			    promiseRejected: generatePromiseLifecycleEventObject,
			    promiseResolved: generatePromiseLifecycleEventObject,
			    promiseCancelled: generatePromiseLifecycleEventObject,
			    promiseChained: function(name, promise, child) {
			        return {promise: promise, child: child};
			    },
			    warning: function(name, warning) {
			        return {warning: warning};
			    },
			    unhandledRejection: function (name, reason, promise) {
			        return {reason: reason, promise: promise};
			    },
			    rejectionHandled: generatePromiseLifecycleEventObject
			};

			var activeFireEvent = function (name) {
			    var globalEventFired = false;
			    try {
			        globalEventFired = fireGlobalEvent.apply(null, arguments);
			    } catch (e) {
			        async.throwLater(e);
			        globalEventFired = true;
			    }

			    var domEventFired = false;
			    try {
			        domEventFired = fireDomEvent(name,
			                    eventToObjectGenerator[name].apply(null, arguments));
			    } catch (e) {
			        async.throwLater(e);
			        domEventFired = true;
			    }

			    return domEventFired || globalEventFired;
			};

			Promise.config = function(opts) {
			    opts = Object(opts);
			    if ("longStackTraces" in opts) {
			        if (opts.longStackTraces) {
			            Promise.longStackTraces();
			        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
			            disableLongStackTraces();
			        }
			    }
			    if ("warnings" in opts) {
			        var warningsOption = opts.warnings;
			        config.warnings = !!warningsOption;
			        wForgottenReturn = config.warnings;

			        if (util.isObject(warningsOption)) {
			            if ("wForgottenReturn" in warningsOption) {
			                wForgottenReturn = !!warningsOption.wForgottenReturn;
			            }
			        }
			    }
			    if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
			        if (async.haveItemsQueued()) {
			            throw new Error(
			                "cannot enable cancellation after promises are in use");
			        }
			        Promise.prototype._clearCancellationData =
			            cancellationClearCancellationData;
			        Promise.prototype._propagateFrom = cancellationPropagateFrom;
			        Promise.prototype._onCancel = cancellationOnCancel;
			        Promise.prototype._setOnCancel = cancellationSetOnCancel;
			        Promise.prototype._attachCancellationCallback =
			            cancellationAttachCancellationCallback;
			        Promise.prototype._execute = cancellationExecute;
			        propagateFromFunction = cancellationPropagateFrom;
			        config.cancellation = true;
			    }
			    if ("monitoring" in opts) {
			        if (opts.monitoring && !config.monitoring) {
			            config.monitoring = true;
			            Promise.prototype._fireEvent = activeFireEvent;
			        } else if (!opts.monitoring && config.monitoring) {
			            config.monitoring = false;
			            Promise.prototype._fireEvent = defaultFireEvent;
			        }
			    }
			    if ("asyncHooks" in opts && util.nodeSupportsAsyncResource) {
			        var prev = config.asyncHooks;
			        var cur = !!opts.asyncHooks;
			        if (prev !== cur) {
			            config.asyncHooks = cur;
			            if (cur) {
			                enableAsyncHooks();
			            } else {
			                disableAsyncHooks();
			            }
			        }
			    }
			    return Promise;
			};

			function defaultFireEvent() { return false; }

			Promise.prototype._fireEvent = defaultFireEvent;
			Promise.prototype._execute = function(executor, resolve, reject) {
			    try {
			        executor(resolve, reject);
			    } catch (e) {
			        return e;
			    }
			};
			Promise.prototype._onCancel = function () {};
			Promise.prototype._setOnCancel = function (handler) { };
			Promise.prototype._attachCancellationCallback = function(onCancel) {
			};
			Promise.prototype._captureStackTrace = function () {};
			Promise.prototype._attachExtraTrace = function () {};
			Promise.prototype._dereferenceTrace = function () {};
			Promise.prototype._clearCancellationData = function() {};
			Promise.prototype._propagateFrom = function (parent, flags) {
			};

			function cancellationExecute(executor, resolve, reject) {
			    var promise = this;
			    try {
			        executor(resolve, reject, function(onCancel) {
			            if (typeof onCancel !== "function") {
			                throw new TypeError("onCancel must be a function, got: " +
			                                    util.toString(onCancel));
			            }
			            promise._attachCancellationCallback(onCancel);
			        });
			    } catch (e) {
			        return e;
			    }
			}

			function cancellationAttachCancellationCallback(onCancel) {
			    if (!this._isCancellable()) return this;

			    var previousOnCancel = this._onCancel();
			    if (previousOnCancel !== undefined) {
			        if (util.isArray(previousOnCancel)) {
			            previousOnCancel.push(onCancel);
			        } else {
			            this._setOnCancel([previousOnCancel, onCancel]);
			        }
			    } else {
			        this._setOnCancel(onCancel);
			    }
			}

			function cancellationOnCancel() {
			    return this._onCancelField;
			}

			function cancellationSetOnCancel(onCancel) {
			    this._onCancelField = onCancel;
			}

			function cancellationClearCancellationData() {
			    this._cancellationParent = undefined;
			    this._onCancelField = undefined;
			}

			function cancellationPropagateFrom(parent, flags) {
			    if ((flags & 1) !== 0) {
			        this._cancellationParent = parent;
			        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
			        if (branchesRemainingToCancel === undefined) {
			            branchesRemainingToCancel = 0;
			        }
			        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
			    }
			    if ((flags & 2) !== 0 && parent._isBound()) {
			        this._setBoundTo(parent._boundTo);
			    }
			}

			function bindingPropagateFrom(parent, flags) {
			    if ((flags & 2) !== 0 && parent._isBound()) {
			        this._setBoundTo(parent._boundTo);
			    }
			}
			var propagateFromFunction = bindingPropagateFrom;

			function boundValueFunction() {
			    var ret = this._boundTo;
			    if (ret !== undefined) {
			        if (ret instanceof Promise) {
			            if (ret.isFulfilled()) {
			                return ret.value();
			            } else {
			                return undefined;
			            }
			        }
			    }
			    return ret;
			}

			function longStackTracesCaptureStackTrace() {
			    this._trace = new CapturedTrace(this._peekContext());
			}

			function longStackTracesAttachExtraTrace(error, ignoreSelf) {
			    if (canAttachTrace(error)) {
			        var trace = this._trace;
			        if (trace !== undefined) {
			            if (ignoreSelf) trace = trace._parent;
			        }
			        if (trace !== undefined) {
			            trace.attachExtraTrace(error);
			        } else if (!error.__stackCleaned__) {
			            var parsed = parseStackAndMessage(error);
			            util.notEnumerableProp(error, "stack",
			                parsed.message + "\n" + parsed.stack.join("\n"));
			            util.notEnumerableProp(error, "__stackCleaned__", true);
			        }
			    }
			}

			function longStackTracesDereferenceTrace() {
			    this._trace = undefined;
			}

			function checkForgottenReturns(returnValue, promiseCreated, name, promise,
			                               parent) {
			    if (returnValue === undefined && promiseCreated !== null &&
			        wForgottenReturn) {
			        if (parent !== undefined && parent._returnedNonUndefined()) return;
			        if ((promise._bitField & 65535) === 0) return;

			        if (name) name = name + " ";
			        var handlerLine = "";
			        var creatorLine = "";
			        if (promiseCreated._trace) {
			            var traceLines = promiseCreated._trace.stack.split("\n");
			            var stack = cleanStack(traceLines);
			            for (var i = stack.length - 1; i >= 0; --i) {
			                var line = stack[i];
			                if (!nodeFramePattern.test(line)) {
			                    var lineMatches = line.match(parseLinePattern);
			                    if (lineMatches) {
			                        handlerLine  = "at " + lineMatches[1] +
			                            ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
			                    }
			                    break;
			                }
			            }

			            if (stack.length > 0) {
			                var firstUserLine = stack[0];
			                for (var i = 0; i < traceLines.length; ++i) {

			                    if (traceLines[i] === firstUserLine) {
			                        if (i > 0) {
			                            creatorLine = "\n" + traceLines[i - 1];
			                        }
			                        break;
			                    }
			                }

			            }
			        }
			        var msg = "a promise was created in a " + name +
			            "handler " + handlerLine + "but was not returned from it, " +
			            "see http://goo.gl/rRqMUw" +
			            creatorLine;
			        promise._warn(msg, true, promiseCreated);
			    }
			}

			function deprecated(name, replacement) {
			    var message = name +
			        " is deprecated and will be removed in a future version.";
			    if (replacement) message += " Use " + replacement + " instead.";
			    return warn(message);
			}

			function warn(message, shouldUseOwnTrace, promise) {
			    if (!config.warnings) return;
			    var warning = new Warning(message);
			    var ctx;
			    if (shouldUseOwnTrace) {
			        promise._attachExtraTrace(warning);
			    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
			        ctx.attachExtraTrace(warning);
			    } else {
			        var parsed = parseStackAndMessage(warning);
			        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
			    }

			    if (!activeFireEvent("warning", warning)) {
			        formatAndLogError(warning, "", true);
			    }
			}

			function reconstructStack(message, stacks) {
			    for (var i = 0; i < stacks.length - 1; ++i) {
			        stacks[i].push("From previous event:");
			        stacks[i] = stacks[i].join("\n");
			    }
			    if (i < stacks.length) {
			        stacks[i] = stacks[i].join("\n");
			    }
			    return message + "\n" + stacks.join("\n");
			}

			function removeDuplicateOrEmptyJumps(stacks) {
			    for (var i = 0; i < stacks.length; ++i) {
			        if (stacks[i].length === 0 ||
			            ((i + 1 < stacks.length) && stacks[i][0] === stacks[i+1][0])) {
			            stacks.splice(i, 1);
			            i--;
			        }
			    }
			}

			function removeCommonRoots(stacks) {
			    var current = stacks[0];
			    for (var i = 1; i < stacks.length; ++i) {
			        var prev = stacks[i];
			        var currentLastIndex = current.length - 1;
			        var currentLastLine = current[currentLastIndex];
			        var commonRootMeetPoint = -1;

			        for (var j = prev.length - 1; j >= 0; --j) {
			            if (prev[j] === currentLastLine) {
			                commonRootMeetPoint = j;
			                break;
			            }
			        }

			        for (var j = commonRootMeetPoint; j >= 0; --j) {
			            var line = prev[j];
			            if (current[currentLastIndex] === line) {
			                current.pop();
			                currentLastIndex--;
			            } else {
			                break;
			            }
			        }
			        current = prev;
			    }
			}

			function cleanStack(stack) {
			    var ret = [];
			    for (var i = 0; i < stack.length; ++i) {
			        var line = stack[i];
			        var isTraceLine = "    (No stack trace)" === line ||
			            stackFramePattern.test(line);
			        var isInternalFrame = isTraceLine && shouldIgnore(line);
			        if (isTraceLine && !isInternalFrame) {
			            if (indentStackFrames && line.charAt(0) !== " ") {
			                line = "    " + line;
			            }
			            ret.push(line);
			        }
			    }
			    return ret;
			}

			function stackFramesAsArray(error) {
			    var stack = error.stack.replace(/\s+$/g, "").split("\n");
			    for (var i = 0; i < stack.length; ++i) {
			        var line = stack[i];
			        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
			            break;
			        }
			    }
			    if (i > 0 && error.name != "SyntaxError") {
			        stack = stack.slice(i);
			    }
			    return stack;
			}

			function parseStackAndMessage(error) {
			    var stack = error.stack;
			    var message = error.toString();
			    stack = typeof stack === "string" && stack.length > 0
			                ? stackFramesAsArray(error) : ["    (No stack trace)"];
			    return {
			        message: message,
			        stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
			    };
			}

			function formatAndLogError(error, title, isSoft) {
			    if (typeof console !== "undefined") {
			        var message;
			        if (util.isObject(error)) {
			            var stack = error.stack;
			            message = title + formatStack(stack, error);
			        } else {
			            message = title + String(error);
			        }
			        if (typeof printWarning === "function") {
			            printWarning(message, isSoft);
			        } else if (typeof console.log === "function" ||
			            typeof console.log === "object") {
			            console.log(message);
			        }
			    }
			}

			function fireRejectionEvent(name, localHandler, reason, promise) {
			    var localEventFired = false;
			    try {
			        if (typeof localHandler === "function") {
			            localEventFired = true;
			            if (name === "rejectionHandled") {
			                localHandler(promise);
			            } else {
			                localHandler(reason, promise);
			            }
			        }
			    } catch (e) {
			        async.throwLater(e);
			    }

			    if (name === "unhandledRejection") {
			        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
			            formatAndLogError(reason, "Unhandled rejection ");
			        }
			    } else {
			        activeFireEvent(name, promise);
			    }
			}

			function formatNonError(obj) {
			    var str;
			    if (typeof obj === "function") {
			        str = "[function " +
			            (obj.name || "anonymous") +
			            "]";
			    } else {
			        str = obj && typeof obj.toString === "function"
			            ? obj.toString() : util.toString(obj);
			        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
			        if (ruselessToString.test(str)) {
			            try {
			                var newStr = JSON.stringify(obj);
			                str = newStr;
			            }
			            catch(e) {

			            }
			        }
			        if (str.length === 0) {
			            str = "(empty array)";
			        }
			    }
			    return ("(<" + snip(str) + ">, no stack trace)");
			}

			function snip(str) {
			    var maxChars = 41;
			    if (str.length < maxChars) {
			        return str;
			    }
			    return str.substr(0, maxChars - 3) + "...";
			}

			function longStackTracesIsSupported() {
			    return typeof captureStackTrace === "function";
			}

			var shouldIgnore = function() { return false; };
			var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
			function parseLineInfo(line) {
			    var matches = line.match(parseLineInfoRegex);
			    if (matches) {
			        return {
			            fileName: matches[1],
			            line: parseInt(matches[2], 10)
			        };
			    }
			}

			function setBounds(firstLineError, lastLineError) {
			    if (!longStackTracesIsSupported()) return;
			    var firstStackLines = (firstLineError.stack || "").split("\n");
			    var lastStackLines = (lastLineError.stack || "").split("\n");
			    var firstIndex = -1;
			    var lastIndex = -1;
			    var firstFileName;
			    var lastFileName;
			    for (var i = 0; i < firstStackLines.length; ++i) {
			        var result = parseLineInfo(firstStackLines[i]);
			        if (result) {
			            firstFileName = result.fileName;
			            firstIndex = result.line;
			            break;
			        }
			    }
			    for (var i = 0; i < lastStackLines.length; ++i) {
			        var result = parseLineInfo(lastStackLines[i]);
			        if (result) {
			            lastFileName = result.fileName;
			            lastIndex = result.line;
			            break;
			        }
			    }
			    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
			        firstFileName !== lastFileName || firstIndex >= lastIndex) {
			        return;
			    }

			    shouldIgnore = function(line) {
			        if (bluebirdFramePattern.test(line)) return true;
			        var info = parseLineInfo(line);
			        if (info) {
			            if (info.fileName === firstFileName &&
			                (firstIndex <= info.line && info.line <= lastIndex)) {
			                return true;
			            }
			        }
			        return false;
			    };
			}

			function CapturedTrace(parent) {
			    this._parent = parent;
			    this._promisesCreated = 0;
			    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
			    captureStackTrace(this, CapturedTrace);
			    if (length > 32) this.uncycle();
			}
			util.inherits(CapturedTrace, Error);
			Context.CapturedTrace = CapturedTrace;

			CapturedTrace.prototype.uncycle = function() {
			    var length = this._length;
			    if (length < 2) return;
			    var nodes = [];
			    var stackToIndex = {};

			    for (var i = 0, node = this; node !== undefined; ++i) {
			        nodes.push(node);
			        node = node._parent;
			    }
			    length = this._length = i;
			    for (var i = length - 1; i >= 0; --i) {
			        var stack = nodes[i].stack;
			        if (stackToIndex[stack] === undefined) {
			            stackToIndex[stack] = i;
			        }
			    }
			    for (var i = 0; i < length; ++i) {
			        var currentStack = nodes[i].stack;
			        var index = stackToIndex[currentStack];
			        if (index !== undefined && index !== i) {
			            if (index > 0) {
			                nodes[index - 1]._parent = undefined;
			                nodes[index - 1]._length = 1;
			            }
			            nodes[i]._parent = undefined;
			            nodes[i]._length = 1;
			            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

			            if (index < length - 1) {
			                cycleEdgeNode._parent = nodes[index + 1];
			                cycleEdgeNode._parent.uncycle();
			                cycleEdgeNode._length =
			                    cycleEdgeNode._parent._length + 1;
			            } else {
			                cycleEdgeNode._parent = undefined;
			                cycleEdgeNode._length = 1;
			            }
			            var currentChildLength = cycleEdgeNode._length + 1;
			            for (var j = i - 2; j >= 0; --j) {
			                nodes[j]._length = currentChildLength;
			                currentChildLength++;
			            }
			            return;
			        }
			    }
			};

			CapturedTrace.prototype.attachExtraTrace = function(error) {
			    if (error.__stackCleaned__) return;
			    this.uncycle();
			    var parsed = parseStackAndMessage(error);
			    var message = parsed.message;
			    var stacks = [parsed.stack];

			    var trace = this;
			    while (trace !== undefined) {
			        stacks.push(cleanStack(trace.stack.split("\n")));
			        trace = trace._parent;
			    }
			    removeCommonRoots(stacks);
			    removeDuplicateOrEmptyJumps(stacks);
			    util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
			    util.notEnumerableProp(error, "__stackCleaned__", true);
			};

			var captureStackTrace = (function stackDetection() {
			    var v8stackFramePattern = /^\s*at\s*/;
			    var v8stackFormatter = function(stack, error) {
			        if (typeof stack === "string") return stack;

			        if (error.name !== undefined &&
			            error.message !== undefined) {
			            return error.toString();
			        }
			        return formatNonError(error);
			    };

			    if (typeof Error.stackTraceLimit === "number" &&
			        typeof Error.captureStackTrace === "function") {
			        Error.stackTraceLimit += 6;
			        stackFramePattern = v8stackFramePattern;
			        formatStack = v8stackFormatter;
			        var captureStackTrace = Error.captureStackTrace;

			        shouldIgnore = function(line) {
			            return bluebirdFramePattern.test(line);
			        };
			        return function(receiver, ignoreUntil) {
			            Error.stackTraceLimit += 6;
			            captureStackTrace(receiver, ignoreUntil);
			            Error.stackTraceLimit -= 6;
			        };
			    }
			    var err = new Error();

			    if (typeof err.stack === "string" &&
			        err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
			        stackFramePattern = /@/;
			        formatStack = v8stackFormatter;
			        indentStackFrames = true;
			        return function captureStackTrace(o) {
			            o.stack = new Error().stack;
			        };
			    }

			    var hasStackAfterThrow;
			    try { throw new Error(); }
			    catch(e) {
			        hasStackAfterThrow = ("stack" in e);
			    }
			    if (!("stack" in err) && hasStackAfterThrow &&
			        typeof Error.stackTraceLimit === "number") {
			        stackFramePattern = v8stackFramePattern;
			        formatStack = v8stackFormatter;
			        return function captureStackTrace(o) {
			            Error.stackTraceLimit += 6;
			            try { throw new Error(); }
			            catch(e) { o.stack = e.stack; }
			            Error.stackTraceLimit -= 6;
			        };
			    }

			    formatStack = function(stack, error) {
			        if (typeof stack === "string") return stack;

			        if ((typeof error === "object" ||
			            typeof error === "function") &&
			            error.name !== undefined &&
			            error.message !== undefined) {
			            return error.toString();
			        }
			        return formatNonError(error);
			    };

			    return null;

			})();

			if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
			    printWarning = function (message) {
			        console.warn(message);
			    };
			    if (util.isNode && process.stderr.isTTY) {
			        printWarning = function(message, isSoft) {
			            var color = isSoft ? "\u001b[33m" : "\u001b[31m";
			            console.warn(color + message + "\u001b[0m\n");
			        };
			    } else if (!util.isNode && typeof (new Error().stack) === "string") {
			        printWarning = function(message, isSoft) {
			            console.warn("%c" + message,
			                        isSoft ? "color: darkorange" : "color: red");
			        };
			    }
			}

			var config = {
			    warnings: warnings,
			    longStackTraces: false,
			    cancellation: false,
			    monitoring: false,
			    asyncHooks: false
			};

			if (longStackTraces) Promise.longStackTraces();

			return {
			    asyncHooks: function() {
			        return config.asyncHooks;
			    },
			    longStackTraces: function() {
			        return config.longStackTraces;
			    },
			    warnings: function() {
			        return config.warnings;
			    },
			    cancellation: function() {
			        return config.cancellation;
			    },
			    monitoring: function() {
			        return config.monitoring;
			    },
			    propagateFromFunction: function() {
			        return propagateFromFunction;
			    },
			    boundValueFunction: function() {
			        return boundValueFunction;
			    },
			    checkForgottenReturns: checkForgottenReturns,
			    setBounds: setBounds,
			    warn: warn,
			    deprecated: deprecated,
			    CapturedTrace: CapturedTrace,
			    fireDomEvent: fireDomEvent,
			    fireGlobalEvent: fireGlobalEvent
			};
			};

			},{"./errors":12,"./es5":13,"./util":36}],10:[function(_dereq_,module,exports){
			module.exports = function(Promise) {
			function returner() {
			    return this.value;
			}
			function thrower() {
			    throw this.reason;
			}

			Promise.prototype["return"] =
			Promise.prototype.thenReturn = function (value) {
			    if (value instanceof Promise) value.suppressUnhandledRejections();
			    return this._then(
			        returner, undefined, undefined, {value: value}, undefined);
			};

			Promise.prototype["throw"] =
			Promise.prototype.thenThrow = function (reason) {
			    return this._then(
			        thrower, undefined, undefined, {reason: reason}, undefined);
			};

			Promise.prototype.catchThrow = function (reason) {
			    if (arguments.length <= 1) {
			        return this._then(
			            undefined, thrower, undefined, {reason: reason}, undefined);
			    } else {
			        var _reason = arguments[1];
			        var handler = function() {throw _reason;};
			        return this.caught(reason, handler);
			    }
			};

			Promise.prototype.catchReturn = function (value) {
			    if (arguments.length <= 1) {
			        if (value instanceof Promise) value.suppressUnhandledRejections();
			        return this._then(
			            undefined, returner, undefined, {value: value}, undefined);
			    } else {
			        var _value = arguments[1];
			        if (_value instanceof Promise) _value.suppressUnhandledRejections();
			        var handler = function() {return _value;};
			        return this.caught(value, handler);
			    }
			};
			};

			},{}],11:[function(_dereq_,module,exports){
			module.exports = function(Promise, INTERNAL) {
			var PromiseReduce = Promise.reduce;
			var PromiseAll = Promise.all;

			function promiseAllThis() {
			    return PromiseAll(this);
			}

			function PromiseMapSeries(promises, fn) {
			    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
			}

			Promise.prototype.each = function (fn) {
			    return PromiseReduce(this, fn, INTERNAL, 0)
			              ._then(promiseAllThis, undefined, undefined, this, undefined);
			};

			Promise.prototype.mapSeries = function (fn) {
			    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
			};

			Promise.each = function (promises, fn) {
			    return PromiseReduce(promises, fn, INTERNAL, 0)
			              ._then(promiseAllThis, undefined, undefined, promises, undefined);
			};

			Promise.mapSeries = PromiseMapSeries;
			};


			},{}],12:[function(_dereq_,module,exports){
			var es5 = _dereq_("./es5");
			var Objectfreeze = es5.freeze;
			var util = _dereq_("./util");
			var inherits = util.inherits;
			var notEnumerableProp = util.notEnumerableProp;

			function subError(nameProperty, defaultMessage) {
			    function SubError(message) {
			        if (!(this instanceof SubError)) return new SubError(message);
			        notEnumerableProp(this, "message",
			            typeof message === "string" ? message : defaultMessage);
			        notEnumerableProp(this, "name", nameProperty);
			        if (Error.captureStackTrace) {
			            Error.captureStackTrace(this, this.constructor);
			        } else {
			            Error.call(this);
			        }
			    }
			    inherits(SubError, Error);
			    return SubError;
			}

			var _TypeError, _RangeError;
			var Warning = subError("Warning", "warning");
			var CancellationError = subError("CancellationError", "cancellation error");
			var TimeoutError = subError("TimeoutError", "timeout error");
			var AggregateError = subError("AggregateError", "aggregate error");
			try {
			    _TypeError = TypeError;
			    _RangeError = RangeError;
			} catch(e) {
			    _TypeError = subError("TypeError", "type error");
			    _RangeError = subError("RangeError", "range error");
			}

			var methods = ("join pop push shift unshift slice filter forEach some " +
			    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

			for (var i = 0; i < methods.length; ++i) {
			    if (typeof Array.prototype[methods[i]] === "function") {
			        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
			    }
			}

			es5.defineProperty(AggregateError.prototype, "length", {
			    value: 0,
			    configurable: false,
			    writable: true,
			    enumerable: true
			});
			AggregateError.prototype["isOperational"] = true;
			var level = 0;
			AggregateError.prototype.toString = function() {
			    var indent = Array(level * 4 + 1).join(" ");
			    var ret = "\n" + indent + "AggregateError of:" + "\n";
			    level++;
			    indent = Array(level * 4 + 1).join(" ");
			    for (var i = 0; i < this.length; ++i) {
			        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
			        var lines = str.split("\n");
			        for (var j = 0; j < lines.length; ++j) {
			            lines[j] = indent + lines[j];
			        }
			        str = lines.join("\n");
			        ret += str + "\n";
			    }
			    level--;
			    return ret;
			};

			function OperationalError(message) {
			    if (!(this instanceof OperationalError))
			        return new OperationalError(message);
			    notEnumerableProp(this, "name", "OperationalError");
			    notEnumerableProp(this, "message", message);
			    this.cause = message;
			    this["isOperational"] = true;

			    if (message instanceof Error) {
			        notEnumerableProp(this, "message", message.message);
			        notEnumerableProp(this, "stack", message.stack);
			    } else if (Error.captureStackTrace) {
			        Error.captureStackTrace(this, this.constructor);
			    }

			}
			inherits(OperationalError, Error);

			var errorTypes = Error["__BluebirdErrorTypes__"];
			if (!errorTypes) {
			    errorTypes = Objectfreeze({
			        CancellationError: CancellationError,
			        TimeoutError: TimeoutError,
			        OperationalError: OperationalError,
			        RejectionError: OperationalError,
			        AggregateError: AggregateError
			    });
			    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
			        value: errorTypes,
			        writable: false,
			        enumerable: false,
			        configurable: false
			    });
			}

			module.exports = {
			    Error: Error,
			    TypeError: _TypeError,
			    RangeError: _RangeError,
			    CancellationError: errorTypes.CancellationError,
			    OperationalError: errorTypes.OperationalError,
			    TimeoutError: errorTypes.TimeoutError,
			    AggregateError: errorTypes.AggregateError,
			    Warning: Warning
			};

			},{"./es5":13,"./util":36}],13:[function(_dereq_,module,exports){
			var isES5 = (function(){
			    return this === undefined;
			})();

			if (isES5) {
			    module.exports = {
			        freeze: Object.freeze,
			        defineProperty: Object.defineProperty,
			        getDescriptor: Object.getOwnPropertyDescriptor,
			        keys: Object.keys,
			        names: Object.getOwnPropertyNames,
			        getPrototypeOf: Object.getPrototypeOf,
			        isArray: Array.isArray,
			        isES5: isES5,
			        propertyIsWritable: function(obj, prop) {
			            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
			            return !!(!descriptor || descriptor.writable || descriptor.set);
			        }
			    };
			} else {
			    var has = {}.hasOwnProperty;
			    var str = {}.toString;
			    var proto = {}.constructor.prototype;

			    var ObjectKeys = function (o) {
			        var ret = [];
			        for (var key in o) {
			            if (has.call(o, key)) {
			                ret.push(key);
			            }
			        }
			        return ret;
			    };

			    var ObjectGetDescriptor = function(o, key) {
			        return {value: o[key]};
			    };

			    var ObjectDefineProperty = function (o, key, desc) {
			        o[key] = desc.value;
			        return o;
			    };

			    var ObjectFreeze = function (obj) {
			        return obj;
			    };

			    var ObjectGetPrototypeOf = function (obj) {
			        try {
			            return Object(obj).constructor.prototype;
			        }
			        catch (e) {
			            return proto;
			        }
			    };

			    var ArrayIsArray = function (obj) {
			        try {
			            return str.call(obj) === "[object Array]";
			        }
			        catch(e) {
			            return false;
			        }
			    };

			    module.exports = {
			        isArray: ArrayIsArray,
			        keys: ObjectKeys,
			        names: ObjectKeys,
			        defineProperty: ObjectDefineProperty,
			        getDescriptor: ObjectGetDescriptor,
			        freeze: ObjectFreeze,
			        getPrototypeOf: ObjectGetPrototypeOf,
			        isES5: isES5,
			        propertyIsWritable: function() {
			            return true;
			        }
			    };
			}

			},{}],14:[function(_dereq_,module,exports){
			module.exports = function(Promise, INTERNAL) {
			var PromiseMap = Promise.map;

			Promise.prototype.filter = function (fn, options) {
			    return PromiseMap(this, fn, options, INTERNAL);
			};

			Promise.filter = function (promises, fn, options) {
			    return PromiseMap(promises, fn, options, INTERNAL);
			};
			};

			},{}],15:[function(_dereq_,module,exports){
			module.exports = function(Promise, tryConvertToPromise, NEXT_FILTER) {
			var util = _dereq_("./util");
			var CancellationError = Promise.CancellationError;
			var errorObj = util.errorObj;
			var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);

			function PassThroughHandlerContext(promise, type, handler) {
			    this.promise = promise;
			    this.type = type;
			    this.handler = handler;
			    this.called = false;
			    this.cancelPromise = null;
			}

			PassThroughHandlerContext.prototype.isFinallyHandler = function() {
			    return this.type === 0;
			};

			function FinallyHandlerCancelReaction(finallyHandler) {
			    this.finallyHandler = finallyHandler;
			}

			FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
			    checkCancel(this.finallyHandler);
			};

			function checkCancel(ctx, reason) {
			    if (ctx.cancelPromise != null) {
			        if (arguments.length > 1) {
			            ctx.cancelPromise._reject(reason);
			        } else {
			            ctx.cancelPromise._cancel();
			        }
			        ctx.cancelPromise = null;
			        return true;
			    }
			    return false;
			}

			function succeed() {
			    return finallyHandler.call(this, this.promise._target()._settledValue());
			}
			function fail(reason) {
			    if (checkCancel(this, reason)) return;
			    errorObj.e = reason;
			    return errorObj;
			}
			function finallyHandler(reasonOrValue) {
			    var promise = this.promise;
			    var handler = this.handler;

			    if (!this.called) {
			        this.called = true;
			        var ret = this.isFinallyHandler()
			            ? handler.call(promise._boundValue())
			            : handler.call(promise._boundValue(), reasonOrValue);
			        if (ret === NEXT_FILTER) {
			            return ret;
			        } else if (ret !== undefined) {
			            promise._setReturnedNonUndefined();
			            var maybePromise = tryConvertToPromise(ret, promise);
			            if (maybePromise instanceof Promise) {
			                if (this.cancelPromise != null) {
			                    if (maybePromise._isCancelled()) {
			                        var reason =
			                            new CancellationError("late cancellation observer");
			                        promise._attachExtraTrace(reason);
			                        errorObj.e = reason;
			                        return errorObj;
			                    } else if (maybePromise.isPending()) {
			                        maybePromise._attachCancellationCallback(
			                            new FinallyHandlerCancelReaction(this));
			                    }
			                }
			                return maybePromise._then(
			                    succeed, fail, undefined, this, undefined);
			            }
			        }
			    }

			    if (promise.isRejected()) {
			        checkCancel(this);
			        errorObj.e = reasonOrValue;
			        return errorObj;
			    } else {
			        checkCancel(this);
			        return reasonOrValue;
			    }
			}

			Promise.prototype._passThrough = function(handler, type, success, fail) {
			    if (typeof handler !== "function") return this.then();
			    return this._then(success,
			                      fail,
			                      undefined,
			                      new PassThroughHandlerContext(this, type, handler),
			                      undefined);
			};

			Promise.prototype.lastly =
			Promise.prototype["finally"] = function (handler) {
			    return this._passThrough(handler,
			                             0,
			                             finallyHandler,
			                             finallyHandler);
			};


			Promise.prototype.tap = function (handler) {
			    return this._passThrough(handler, 1, finallyHandler);
			};

			Promise.prototype.tapCatch = function (handlerOrPredicate) {
			    var len = arguments.length;
			    if(len === 1) {
			        return this._passThrough(handlerOrPredicate,
			                                 1,
			                                 undefined,
			                                 finallyHandler);
			    } else {
			         var catchInstances = new Array(len - 1),
			            j = 0, i;
			        for (i = 0; i < len - 1; ++i) {
			            var item = arguments[i];
			            if (util.isObject(item)) {
			                catchInstances[j++] = item;
			            } else {
			                return Promise.reject(new TypeError(
			                    "tapCatch statement predicate: "
			                    + "expecting an object but got " + util.classString(item)
			                ));
			            }
			        }
			        catchInstances.length = j;
			        var handler = arguments[i];
			        return this._passThrough(catchFilter(catchInstances, handler, this),
			                                 1,
			                                 undefined,
			                                 finallyHandler);
			    }

			};

			return PassThroughHandlerContext;
			};

			},{"./catch_filter":7,"./util":36}],16:[function(_dereq_,module,exports){
			module.exports = function(Promise,
			                          apiRejection,
			                          INTERNAL,
			                          tryConvertToPromise,
			                          Proxyable,
			                          debug) {
			var errors = _dereq_("./errors");
			var TypeError = errors.TypeError;
			var util = _dereq_("./util");
			var errorObj = util.errorObj;
			var tryCatch = util.tryCatch;
			var yieldHandlers = [];

			function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
			    for (var i = 0; i < yieldHandlers.length; ++i) {
			        traceParent._pushContext();
			        var result = tryCatch(yieldHandlers[i])(value);
			        traceParent._popContext();
			        if (result === errorObj) {
			            traceParent._pushContext();
			            var ret = Promise.reject(errorObj.e);
			            traceParent._popContext();
			            return ret;
			        }
			        var maybePromise = tryConvertToPromise(result, traceParent);
			        if (maybePromise instanceof Promise) return maybePromise;
			    }
			    return null;
			}

			function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
			    if (debug.cancellation()) {
			        var internal = new Promise(INTERNAL);
			        var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
			        this._promise = internal.lastly(function() {
			            return _finallyPromise;
			        });
			        internal._captureStackTrace();
			        internal._setOnCancel(this);
			    } else {
			        var promise = this._promise = new Promise(INTERNAL);
			        promise._captureStackTrace();
			    }
			    this._stack = stack;
			    this._generatorFunction = generatorFunction;
			    this._receiver = receiver;
			    this._generator = undefined;
			    this._yieldHandlers = typeof yieldHandler === "function"
			        ? [yieldHandler].concat(yieldHandlers)
			        : yieldHandlers;
			    this._yieldedPromise = null;
			    this._cancellationPhase = false;
			}
			util.inherits(PromiseSpawn, Proxyable);

			PromiseSpawn.prototype._isResolved = function() {
			    return this._promise === null;
			};

			PromiseSpawn.prototype._cleanup = function() {
			    this._promise = this._generator = null;
			    if (debug.cancellation() && this._finallyPromise !== null) {
			        this._finallyPromise._fulfill();
			        this._finallyPromise = null;
			    }
			};

			PromiseSpawn.prototype._promiseCancelled = function() {
			    if (this._isResolved()) return;
			    var implementsReturn = typeof this._generator["return"] !== "undefined";

			    var result;
			    if (!implementsReturn) {
			        var reason = new Promise.CancellationError(
			            "generator .return() sentinel");
			        Promise.coroutine.returnSentinel = reason;
			        this._promise._attachExtraTrace(reason);
			        this._promise._pushContext();
			        result = tryCatch(this._generator["throw"]).call(this._generator,
			                                                         reason);
			        this._promise._popContext();
			    } else {
			        this._promise._pushContext();
			        result = tryCatch(this._generator["return"]).call(this._generator,
			                                                          undefined);
			        this._promise._popContext();
			    }
			    this._cancellationPhase = true;
			    this._yieldedPromise = null;
			    this._continue(result);
			};

			PromiseSpawn.prototype._promiseFulfilled = function(value) {
			    this._yieldedPromise = null;
			    this._promise._pushContext();
			    var result = tryCatch(this._generator.next).call(this._generator, value);
			    this._promise._popContext();
			    this._continue(result);
			};

			PromiseSpawn.prototype._promiseRejected = function(reason) {
			    this._yieldedPromise = null;
			    this._promise._attachExtraTrace(reason);
			    this._promise._pushContext();
			    var result = tryCatch(this._generator["throw"])
			        .call(this._generator, reason);
			    this._promise._popContext();
			    this._continue(result);
			};

			PromiseSpawn.prototype._resultCancelled = function() {
			    if (this._yieldedPromise instanceof Promise) {
			        var promise = this._yieldedPromise;
			        this._yieldedPromise = null;
			        promise.cancel();
			    }
			};

			PromiseSpawn.prototype.promise = function () {
			    return this._promise;
			};

			PromiseSpawn.prototype._run = function () {
			    this._generator = this._generatorFunction.call(this._receiver);
			    this._receiver =
			        this._generatorFunction = undefined;
			    this._promiseFulfilled(undefined);
			};

			PromiseSpawn.prototype._continue = function (result) {
			    var promise = this._promise;
			    if (result === errorObj) {
			        this._cleanup();
			        if (this._cancellationPhase) {
			            return promise.cancel();
			        } else {
			            return promise._rejectCallback(result.e, false);
			        }
			    }

			    var value = result.value;
			    if (result.done === true) {
			        this._cleanup();
			        if (this._cancellationPhase) {
			            return promise.cancel();
			        } else {
			            return promise._resolveCallback(value);
			        }
			    } else {
			        var maybePromise = tryConvertToPromise(value, this._promise);
			        if (!(maybePromise instanceof Promise)) {
			            maybePromise =
			                promiseFromYieldHandler(maybePromise,
			                                        this._yieldHandlers,
			                                        this._promise);
			            if (maybePromise === null) {
			                this._promiseRejected(
			                    new TypeError(
			                        "A value %s was yielded that could not be treated as a promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a\u000a".replace("%s", String(value)) +
			                        "From coroutine:\u000a" +
			                        this._stack.split("\n").slice(1, -7).join("\n")
			                    )
			                );
			                return;
			            }
			        }
			        maybePromise = maybePromise._target();
			        var bitField = maybePromise._bitField;
			        if (((bitField & 50397184) === 0)) {
			            this._yieldedPromise = maybePromise;
			            maybePromise._proxy(this, null);
			        } else if (((bitField & 33554432) !== 0)) {
			            Promise._async.invoke(
			                this._promiseFulfilled, this, maybePromise._value()
			            );
			        } else if (((bitField & 16777216) !== 0)) {
			            Promise._async.invoke(
			                this._promiseRejected, this, maybePromise._reason()
			            );
			        } else {
			            this._promiseCancelled();
			        }
			    }
			};

			Promise.coroutine = function (generatorFunction, options) {
			    if (typeof generatorFunction !== "function") {
			        throw new TypeError("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			    }
			    var yieldHandler = Object(options).yieldHandler;
			    var PromiseSpawn$ = PromiseSpawn;
			    var stack = new Error().stack;
			    return function () {
			        var generator = generatorFunction.apply(this, arguments);
			        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,
			                                      stack);
			        var ret = spawn.promise();
			        spawn._generator = generator;
			        spawn._promiseFulfilled(undefined);
			        return ret;
			    };
			};

			Promise.coroutine.addYieldHandler = function(fn) {
			    if (typeof fn !== "function") {
			        throw new TypeError("expecting a function but got " + util.classString(fn));
			    }
			    yieldHandlers.push(fn);
			};

			Promise.spawn = function (generatorFunction) {
			    debug.deprecated("Promise.spawn()", "Promise.coroutine()");
			    if (typeof generatorFunction !== "function") {
			        return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			    }
			    var spawn = new PromiseSpawn(generatorFunction, this);
			    var ret = spawn.promise();
			    spawn._run(Promise.spawn);
			    return ret;
			};
			};

			},{"./errors":12,"./util":36}],17:[function(_dereq_,module,exports){
			module.exports =
			function(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async) {
			var util = _dereq_("./util");
			util.canEvaluate;
			util.tryCatch;
			util.errorObj;

			Promise.join = function () {
			    var last = arguments.length - 1;
			    var fn;
			    if (last > 0 && typeof arguments[last] === "function") {
			        fn = arguments[last];
			        var ret; 
			    }
			    var args = [].slice.call(arguments);		    if (fn) args.pop();
			    var ret = new PromiseArray(args).promise();
			    return fn !== undefined ? ret.spread(fn) : ret;
			};

			};

			},{"./util":36}],18:[function(_dereq_,module,exports){
			module.exports = function(Promise,
			                          PromiseArray,
			                          apiRejection,
			                          tryConvertToPromise,
			                          INTERNAL,
			                          debug) {
			var util = _dereq_("./util");
			var tryCatch = util.tryCatch;
			var errorObj = util.errorObj;
			var async = Promise._async;

			function MappingPromiseArray(promises, fn, limit, _filter) {
			    this.constructor$(promises);
			    this._promise._captureStackTrace();
			    var context = Promise._getContext();
			    this._callback = util.contextBind(context, fn);
			    this._preservedValues = _filter === INTERNAL
			        ? new Array(this.length())
			        : null;
			    this._limit = limit;
			    this._inFlight = 0;
			    this._queue = [];
			    async.invoke(this._asyncInit, this, undefined);
			    if (util.isArray(promises)) {
			        for (var i = 0; i < promises.length; ++i) {
			            var maybePromise = promises[i];
			            if (maybePromise instanceof Promise) {
			                maybePromise.suppressUnhandledRejections();
			            }
			        }
			    }
			}
			util.inherits(MappingPromiseArray, PromiseArray);

			MappingPromiseArray.prototype._asyncInit = function() {
			    this._init$(undefined, -2);
			};

			MappingPromiseArray.prototype._init = function () {};

			MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
			    var values = this._values;
			    var length = this.length();
			    var preservedValues = this._preservedValues;
			    var limit = this._limit;

			    if (index < 0) {
			        index = (index * -1) - 1;
			        values[index] = value;
			        if (limit >= 1) {
			            this._inFlight--;
			            this._drainQueue();
			            if (this._isResolved()) return true;
			        }
			    } else {
			        if (limit >= 1 && this._inFlight >= limit) {
			            values[index] = value;
			            this._queue.push(index);
			            return false;
			        }
			        if (preservedValues !== null) preservedValues[index] = value;

			        var promise = this._promise;
			        var callback = this._callback;
			        var receiver = promise._boundValue();
			        promise._pushContext();
			        var ret = tryCatch(callback).call(receiver, value, index, length);
			        var promiseCreated = promise._popContext();
			        debug.checkForgottenReturns(
			            ret,
			            promiseCreated,
			            preservedValues !== null ? "Promise.filter" : "Promise.map",
			            promise
			        );
			        if (ret === errorObj) {
			            this._reject(ret.e);
			            return true;
			        }

			        var maybePromise = tryConvertToPromise(ret, this._promise);
			        if (maybePromise instanceof Promise) {
			            maybePromise = maybePromise._target();
			            var bitField = maybePromise._bitField;
			            if (((bitField & 50397184) === 0)) {
			                if (limit >= 1) this._inFlight++;
			                values[index] = maybePromise;
			                maybePromise._proxy(this, (index + 1) * -1);
			                return false;
			            } else if (((bitField & 33554432) !== 0)) {
			                ret = maybePromise._value();
			            } else if (((bitField & 16777216) !== 0)) {
			                this._reject(maybePromise._reason());
			                return true;
			            } else {
			                this._cancel();
			                return true;
			            }
			        }
			        values[index] = ret;
			    }
			    var totalResolved = ++this._totalResolved;
			    if (totalResolved >= length) {
			        if (preservedValues !== null) {
			            this._filter(values, preservedValues);
			        } else {
			            this._resolve(values);
			        }
			        return true;
			    }
			    return false;
			};

			MappingPromiseArray.prototype._drainQueue = function () {
			    var queue = this._queue;
			    var limit = this._limit;
			    var values = this._values;
			    while (queue.length > 0 && this._inFlight < limit) {
			        if (this._isResolved()) return;
			        var index = queue.pop();
			        this._promiseFulfilled(values[index], index);
			    }
			};

			MappingPromiseArray.prototype._filter = function (booleans, values) {
			    var len = values.length;
			    var ret = new Array(len);
			    var j = 0;
			    for (var i = 0; i < len; ++i) {
			        if (booleans[i]) ret[j++] = values[i];
			    }
			    ret.length = j;
			    this._resolve(ret);
			};

			MappingPromiseArray.prototype.preservedValues = function () {
			    return this._preservedValues;
			};

			function map(promises, fn, options, _filter) {
			    if (typeof fn !== "function") {
			        return apiRejection("expecting a function but got " + util.classString(fn));
			    }

			    var limit = 0;
			    if (options !== undefined) {
			        if (typeof options === "object" && options !== null) {
			            if (typeof options.concurrency !== "number") {
			                return Promise.reject(
			                    new TypeError("'concurrency' must be a number but it is " +
			                                    util.classString(options.concurrency)));
			            }
			            limit = options.concurrency;
			        } else {
			            return Promise.reject(new TypeError(
			                            "options argument must be an object but it is " +
			                             util.classString(options)));
			        }
			    }
			    limit = typeof limit === "number" &&
			        isFinite(limit) && limit >= 1 ? limit : 0;
			    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
			}

			Promise.prototype.map = function (fn, options) {
			    return map(this, fn, options, null);
			};

			Promise.map = function (promises, fn, options, _filter) {
			    return map(promises, fn, options, _filter);
			};


			};

			},{"./util":36}],19:[function(_dereq_,module,exports){
			module.exports =
			function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
			var util = _dereq_("./util");
			var tryCatch = util.tryCatch;

			Promise.method = function (fn) {
			    if (typeof fn !== "function") {
			        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
			    }
			    return function () {
			        var ret = new Promise(INTERNAL);
			        ret._captureStackTrace();
			        ret._pushContext();
			        var value = tryCatch(fn).apply(this, arguments);
			        var promiseCreated = ret._popContext();
			        debug.checkForgottenReturns(
			            value, promiseCreated, "Promise.method", ret);
			        ret._resolveFromSyncValue(value);
			        return ret;
			    };
			};

			Promise.attempt = Promise["try"] = function (fn) {
			    if (typeof fn !== "function") {
			        return apiRejection("expecting a function but got " + util.classString(fn));
			    }
			    var ret = new Promise(INTERNAL);
			    ret._captureStackTrace();
			    ret._pushContext();
			    var value;
			    if (arguments.length > 1) {
			        debug.deprecated("calling Promise.try with more than 1 argument");
			        var arg = arguments[1];
			        var ctx = arguments[2];
			        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
			                                  : tryCatch(fn).call(ctx, arg);
			    } else {
			        value = tryCatch(fn)();
			    }
			    var promiseCreated = ret._popContext();
			    debug.checkForgottenReturns(
			        value, promiseCreated, "Promise.try", ret);
			    ret._resolveFromSyncValue(value);
			    return ret;
			};

			Promise.prototype._resolveFromSyncValue = function (value) {
			    if (value === util.errorObj) {
			        this._rejectCallback(value.e, false);
			    } else {
			        this._resolveCallback(value, true);
			    }
			};
			};

			},{"./util":36}],20:[function(_dereq_,module,exports){
			var util = _dereq_("./util");
			var maybeWrapAsError = util.maybeWrapAsError;
			var errors = _dereq_("./errors");
			var OperationalError = errors.OperationalError;
			var es5 = _dereq_("./es5");

			function isUntypedError(obj) {
			    return obj instanceof Error &&
			        es5.getPrototypeOf(obj) === Error.prototype;
			}

			var rErrorKey = /^(?:name|message|stack|cause)$/;
			function wrapAsOperationalError(obj) {
			    var ret;
			    if (isUntypedError(obj)) {
			        ret = new OperationalError(obj);
			        ret.name = obj.name;
			        ret.message = obj.message;
			        ret.stack = obj.stack;
			        var keys = es5.keys(obj);
			        for (var i = 0; i < keys.length; ++i) {
			            var key = keys[i];
			            if (!rErrorKey.test(key)) {
			                ret[key] = obj[key];
			            }
			        }
			        return ret;
			    }
			    util.markAsOriginatingFromRejection(obj);
			    return obj;
			}

			function nodebackForPromise(promise, multiArgs) {
			    return function(err, value) {
			        if (promise === null) return;
			        if (err) {
			            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
			            promise._attachExtraTrace(wrapped);
			            promise._reject(wrapped);
			        } else if (!multiArgs) {
			            promise._fulfill(value);
			        } else {
			            var args = [].slice.call(arguments, 1);		            promise._fulfill(args);
			        }
			        promise = null;
			    };
			}

			module.exports = nodebackForPromise;

			},{"./errors":12,"./es5":13,"./util":36}],21:[function(_dereq_,module,exports){
			module.exports = function(Promise) {
			var util = _dereq_("./util");
			var async = Promise._async;
			var tryCatch = util.tryCatch;
			var errorObj = util.errorObj;

			function spreadAdapter(val, nodeback) {
			    var promise = this;
			    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
			    var ret =
			        tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
			    if (ret === errorObj) {
			        async.throwLater(ret.e);
			    }
			}

			function successAdapter(val, nodeback) {
			    var promise = this;
			    var receiver = promise._boundValue();
			    var ret = val === undefined
			        ? tryCatch(nodeback).call(receiver, null)
			        : tryCatch(nodeback).call(receiver, null, val);
			    if (ret === errorObj) {
			        async.throwLater(ret.e);
			    }
			}
			function errorAdapter(reason, nodeback) {
			    var promise = this;
			    if (!reason) {
			        var newReason = new Error(reason + "");
			        newReason.cause = reason;
			        reason = newReason;
			    }
			    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
			    if (ret === errorObj) {
			        async.throwLater(ret.e);
			    }
			}

			Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback,
			                                                                     options) {
			    if (typeof nodeback == "function") {
			        var adapter = successAdapter;
			        if (options !== undefined && Object(options).spread) {
			            adapter = spreadAdapter;
			        }
			        this._then(
			            adapter,
			            errorAdapter,
			            undefined,
			            this,
			            nodeback
			        );
			    }
			    return this;
			};
			};

			},{"./util":36}],22:[function(_dereq_,module,exports){
			module.exports = function() {
			var makeSelfResolutionError = function () {
			    return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			};
			var reflectHandler = function() {
			    return new Promise.PromiseInspection(this._target());
			};
			var apiRejection = function(msg) {
			    return Promise.reject(new TypeError(msg));
			};
			function Proxyable() {}
			var UNDEFINED_BINDING = {};
			var util = _dereq_("./util");
			util.setReflectHandler(reflectHandler);

			var getDomain = function() {
			    var domain = process.domain;
			    if (domain === undefined) {
			        return null;
			    }
			    return domain;
			};
			var getContextDefault = function() {
			    return null;
			};
			var getContextDomain = function() {
			    return {
			        domain: getDomain(),
			        async: null
			    };
			};
			var AsyncResource = util.isNode && util.nodeSupportsAsyncResource ?
			    _dereq_("async_hooks").AsyncResource : null;
			var getContextAsyncHooks = function() {
			    return {
			        domain: getDomain(),
			        async: new AsyncResource("Bluebird::Promise")
			    };
			};
			var getContext = util.isNode ? getContextDomain : getContextDefault;
			util.notEnumerableProp(Promise, "_getContext", getContext);
			var enableAsyncHooks = function() {
			    getContext = getContextAsyncHooks;
			    util.notEnumerableProp(Promise, "_getContext", getContextAsyncHooks);
			};
			var disableAsyncHooks = function() {
			    getContext = getContextDomain;
			    util.notEnumerableProp(Promise, "_getContext", getContextDomain);
			};

			var es5 = _dereq_("./es5");
			var Async = _dereq_("./async");
			var async = new Async();
			es5.defineProperty(Promise, "_async", {value: async});
			var errors = _dereq_("./errors");
			var TypeError = Promise.TypeError = errors.TypeError;
			Promise.RangeError = errors.RangeError;
			var CancellationError = Promise.CancellationError = errors.CancellationError;
			Promise.TimeoutError = errors.TimeoutError;
			Promise.OperationalError = errors.OperationalError;
			Promise.RejectionError = errors.OperationalError;
			Promise.AggregateError = errors.AggregateError;
			var INTERNAL = function(){};
			var APPLY = {};
			var NEXT_FILTER = {};
			var tryConvertToPromise = _dereq_("./thenables")(Promise, INTERNAL);
			var PromiseArray =
			    _dereq_("./promise_array")(Promise, INTERNAL,
			                               tryConvertToPromise, apiRejection, Proxyable);
			var Context = _dereq_("./context")(Promise);
			 /*jshint unused:false*/
			var createContext = Context.create;

			var debug = _dereq_("./debuggability")(Promise, Context,
			    enableAsyncHooks, disableAsyncHooks);
			debug.CapturedTrace;
			var PassThroughHandlerContext =
			    _dereq_("./finally")(Promise, tryConvertToPromise, NEXT_FILTER);
			var catchFilter = _dereq_("./catch_filter")(NEXT_FILTER);
			var nodebackForPromise = _dereq_("./nodeback");
			var errorObj = util.errorObj;
			var tryCatch = util.tryCatch;
			function check(self, executor) {
			    if (self == null || self.constructor !== Promise) {
			        throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			    }
			    if (typeof executor !== "function") {
			        throw new TypeError("expecting a function but got " + util.classString(executor));
			    }

			}

			function Promise(executor) {
			    if (executor !== INTERNAL) {
			        check(this, executor);
			    }
			    this._bitField = 0;
			    this._fulfillmentHandler0 = undefined;
			    this._rejectionHandler0 = undefined;
			    this._promise0 = undefined;
			    this._receiver0 = undefined;
			    this._resolveFromExecutor(executor);
			    this._promiseCreated();
			    this._fireEvent("promiseCreated", this);
			}

			Promise.prototype.toString = function () {
			    return "[object Promise]";
			};

			Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
			    var len = arguments.length;
			    if (len > 1) {
			        var catchInstances = new Array(len - 1),
			            j = 0, i;
			        for (i = 0; i < len - 1; ++i) {
			            var item = arguments[i];
			            if (util.isObject(item)) {
			                catchInstances[j++] = item;
			            } else {
			                return apiRejection("Catch statement predicate: " +
			                    "expecting an object but got " + util.classString(item));
			            }
			        }
			        catchInstances.length = j;
			        fn = arguments[i];

			        if (typeof fn !== "function") {
			            throw new TypeError("The last argument to .catch() " +
			                "must be a function, got " + util.toString(fn));
			        }
			        return this.then(undefined, catchFilter(catchInstances, fn, this));
			    }
			    return this.then(undefined, fn);
			};

			Promise.prototype.reflect = function () {
			    return this._then(reflectHandler,
			        reflectHandler, undefined, this, undefined);
			};

			Promise.prototype.then = function (didFulfill, didReject) {
			    if (debug.warnings() && arguments.length > 0 &&
			        typeof didFulfill !== "function" &&
			        typeof didReject !== "function") {
			        var msg = ".then() only accepts functions but was passed: " +
			                util.classString(didFulfill);
			        if (arguments.length > 1) {
			            msg += ", " + util.classString(didReject);
			        }
			        this._warn(msg);
			    }
			    return this._then(didFulfill, didReject, undefined, undefined, undefined);
			};

			Promise.prototype.done = function (didFulfill, didReject) {
			    var promise =
			        this._then(didFulfill, didReject, undefined, undefined, undefined);
			    promise._setIsFinal();
			};

			Promise.prototype.spread = function (fn) {
			    if (typeof fn !== "function") {
			        return apiRejection("expecting a function but got " + util.classString(fn));
			    }
			    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
			};

			Promise.prototype.toJSON = function () {
			    var ret = {
			        isFulfilled: false,
			        isRejected: false,
			        fulfillmentValue: undefined,
			        rejectionReason: undefined
			    };
			    if (this.isFulfilled()) {
			        ret.fulfillmentValue = this.value();
			        ret.isFulfilled = true;
			    } else if (this.isRejected()) {
			        ret.rejectionReason = this.reason();
			        ret.isRejected = true;
			    }
			    return ret;
			};

			Promise.prototype.all = function () {
			    if (arguments.length > 0) {
			        this._warn(".all() was passed arguments but it does not take any");
			    }
			    return new PromiseArray(this).promise();
			};

			Promise.prototype.error = function (fn) {
			    return this.caught(util.originatesFromRejection, fn);
			};

			Promise.getNewLibraryCopy = module.exports;

			Promise.is = function (val) {
			    return val instanceof Promise;
			};

			Promise.fromNode = Promise.fromCallback = function(fn) {
			    var ret = new Promise(INTERNAL);
			    ret._captureStackTrace();
			    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs
			                                         : false;
			    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
			    if (result === errorObj) {
			        ret._rejectCallback(result.e, true);
			    }
			    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
			    return ret;
			};

			Promise.all = function (promises) {
			    return new PromiseArray(promises).promise();
			};

			Promise.cast = function (obj) {
			    var ret = tryConvertToPromise(obj);
			    if (!(ret instanceof Promise)) {
			        ret = new Promise(INTERNAL);
			        ret._captureStackTrace();
			        ret._setFulfilled();
			        ret._rejectionHandler0 = obj;
			    }
			    return ret;
			};

			Promise.resolve = Promise.fulfilled = Promise.cast;

			Promise.reject = Promise.rejected = function (reason) {
			    var ret = new Promise(INTERNAL);
			    ret._captureStackTrace();
			    ret._rejectCallback(reason, true);
			    return ret;
			};

			Promise.setScheduler = function(fn) {
			    if (typeof fn !== "function") {
			        throw new TypeError("expecting a function but got " + util.classString(fn));
			    }
			    return async.setScheduler(fn);
			};

			Promise.prototype._then = function (
			    didFulfill,
			    didReject,
			    _,    receiver,
			    internalData
			) {
			    var haveInternalData = internalData !== undefined;
			    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
			    var target = this._target();
			    var bitField = target._bitField;

			    if (!haveInternalData) {
			        promise._propagateFrom(this, 3);
			        promise._captureStackTrace();
			        if (receiver === undefined &&
			            ((this._bitField & 2097152) !== 0)) {
			            if (!((bitField & 50397184) === 0)) {
			                receiver = this._boundValue();
			            } else {
			                receiver = target === this ? undefined : this._boundTo;
			            }
			        }
			        this._fireEvent("promiseChained", this, promise);
			    }

			    var context = getContext();
			    if (!((bitField & 50397184) === 0)) {
			        var handler, value, settler = target._settlePromiseCtx;
			        if (((bitField & 33554432) !== 0)) {
			            value = target._rejectionHandler0;
			            handler = didFulfill;
			        } else if (((bitField & 16777216) !== 0)) {
			            value = target._fulfillmentHandler0;
			            handler = didReject;
			            target._unsetRejectionIsUnhandled();
			        } else {
			            settler = target._settlePromiseLateCancellationObserver;
			            value = new CancellationError("late cancellation observer");
			            target._attachExtraTrace(value);
			            handler = didReject;
			        }

			        async.invoke(settler, target, {
			            handler: util.contextBind(context, handler),
			            promise: promise,
			            receiver: receiver,
			            value: value
			        });
			    } else {
			        target._addCallbacks(didFulfill, didReject, promise,
			                receiver, context);
			    }

			    return promise;
			};

			Promise.prototype._length = function () {
			    return this._bitField & 65535;
			};

			Promise.prototype._isFateSealed = function () {
			    return (this._bitField & 117506048) !== 0;
			};

			Promise.prototype._isFollowing = function () {
			    return (this._bitField & 67108864) === 67108864;
			};

			Promise.prototype._setLength = function (len) {
			    this._bitField = (this._bitField & -65536) |
			        (len & 65535);
			};

			Promise.prototype._setFulfilled = function () {
			    this._bitField = this._bitField | 33554432;
			    this._fireEvent("promiseFulfilled", this);
			};

			Promise.prototype._setRejected = function () {
			    this._bitField = this._bitField | 16777216;
			    this._fireEvent("promiseRejected", this);
			};

			Promise.prototype._setFollowing = function () {
			    this._bitField = this._bitField | 67108864;
			    this._fireEvent("promiseResolved", this);
			};

			Promise.prototype._setIsFinal = function () {
			    this._bitField = this._bitField | 4194304;
			};

			Promise.prototype._isFinal = function () {
			    return (this._bitField & 4194304) > 0;
			};

			Promise.prototype._unsetCancelled = function() {
			    this._bitField = this._bitField & (~65536);
			};

			Promise.prototype._setCancelled = function() {
			    this._bitField = this._bitField | 65536;
			    this._fireEvent("promiseCancelled", this);
			};

			Promise.prototype._setWillBeCancelled = function() {
			    this._bitField = this._bitField | 8388608;
			};

			Promise.prototype._setAsyncGuaranteed = function() {
			    if (async.hasCustomScheduler()) return;
			    var bitField = this._bitField;
			    this._bitField = bitField |
			        (((bitField & 536870912) >> 2) ^
			        134217728);
			};

			Promise.prototype._setNoAsyncGuarantee = function() {
			    this._bitField = (this._bitField | 536870912) &
			        (~134217728);
			};

			Promise.prototype._receiverAt = function (index) {
			    var ret = index === 0 ? this._receiver0 : this[
			            index * 4 - 4 + 3];
			    if (ret === UNDEFINED_BINDING) {
			        return undefined;
			    } else if (ret === undefined && this._isBound()) {
			        return this._boundValue();
			    }
			    return ret;
			};

			Promise.prototype._promiseAt = function (index) {
			    return this[
			            index * 4 - 4 + 2];
			};

			Promise.prototype._fulfillmentHandlerAt = function (index) {
			    return this[
			            index * 4 - 4 + 0];
			};

			Promise.prototype._rejectionHandlerAt = function (index) {
			    return this[
			            index * 4 - 4 + 1];
			};

			Promise.prototype._boundValue = function() {};

			Promise.prototype._migrateCallback0 = function (follower) {
			    follower._bitField;
			    var fulfill = follower._fulfillmentHandler0;
			    var reject = follower._rejectionHandler0;
			    var promise = follower._promise0;
			    var receiver = follower._receiverAt(0);
			    if (receiver === undefined) receiver = UNDEFINED_BINDING;
			    this._addCallbacks(fulfill, reject, promise, receiver, null);
			};

			Promise.prototype._migrateCallbackAt = function (follower, index) {
			    var fulfill = follower._fulfillmentHandlerAt(index);
			    var reject = follower._rejectionHandlerAt(index);
			    var promise = follower._promiseAt(index);
			    var receiver = follower._receiverAt(index);
			    if (receiver === undefined) receiver = UNDEFINED_BINDING;
			    this._addCallbacks(fulfill, reject, promise, receiver, null);
			};

			Promise.prototype._addCallbacks = function (
			    fulfill,
			    reject,
			    promise,
			    receiver,
			    context
			) {
			    var index = this._length();

			    if (index >= 65535 - 4) {
			        index = 0;
			        this._setLength(0);
			    }

			    if (index === 0) {
			        this._promise0 = promise;
			        this._receiver0 = receiver;
			        if (typeof fulfill === "function") {
			            this._fulfillmentHandler0 = util.contextBind(context, fulfill);
			        }
			        if (typeof reject === "function") {
			            this._rejectionHandler0 = util.contextBind(context, reject);
			        }
			    } else {
			        var base = index * 4 - 4;
			        this[base + 2] = promise;
			        this[base + 3] = receiver;
			        if (typeof fulfill === "function") {
			            this[base + 0] =
			                util.contextBind(context, fulfill);
			        }
			        if (typeof reject === "function") {
			            this[base + 1] =
			                util.contextBind(context, reject);
			        }
			    }
			    this._setLength(index + 1);
			    return index;
			};

			Promise.prototype._proxy = function (proxyable, arg) {
			    this._addCallbacks(undefined, undefined, arg, proxyable, null);
			};

			Promise.prototype._resolveCallback = function(value, shouldBind) {
			    if (((this._bitField & 117506048) !== 0)) return;
			    if (value === this)
			        return this._rejectCallback(makeSelfResolutionError(), false);
			    var maybePromise = tryConvertToPromise(value, this);
			    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

			    if (shouldBind) this._propagateFrom(maybePromise, 2);


			    var promise = maybePromise._target();

			    if (promise === this) {
			        this._reject(makeSelfResolutionError());
			        return;
			    }

			    var bitField = promise._bitField;
			    if (((bitField & 50397184) === 0)) {
			        var len = this._length();
			        if (len > 0) promise._migrateCallback0(this);
			        for (var i = 1; i < len; ++i) {
			            promise._migrateCallbackAt(this, i);
			        }
			        this._setFollowing();
			        this._setLength(0);
			        this._setFollowee(maybePromise);
			    } else if (((bitField & 33554432) !== 0)) {
			        this._fulfill(promise._value());
			    } else if (((bitField & 16777216) !== 0)) {
			        this._reject(promise._reason());
			    } else {
			        var reason = new CancellationError("late cancellation observer");
			        promise._attachExtraTrace(reason);
			        this._reject(reason);
			    }
			};

			Promise.prototype._rejectCallback =
			function(reason, synchronous, ignoreNonErrorWarnings) {
			    var trace = util.ensureErrorObject(reason);
			    var hasStack = trace === reason;
			    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
			        var message = "a promise was rejected with a non-error: " +
			            util.classString(reason);
			        this._warn(message, true);
			    }
			    this._attachExtraTrace(trace, synchronous ? hasStack : false);
			    this._reject(reason);
			};

			Promise.prototype._resolveFromExecutor = function (executor) {
			    if (executor === INTERNAL) return;
			    var promise = this;
			    this._captureStackTrace();
			    this._pushContext();
			    var synchronous = true;
			    var r = this._execute(executor, function(value) {
			        promise._resolveCallback(value);
			    }, function (reason) {
			        promise._rejectCallback(reason, synchronous);
			    });
			    synchronous = false;
			    this._popContext();

			    if (r !== undefined) {
			        promise._rejectCallback(r, true);
			    }
			};

			Promise.prototype._settlePromiseFromHandler = function (
			    handler, receiver, value, promise
			) {
			    var bitField = promise._bitField;
			    if (((bitField & 65536) !== 0)) return;
			    promise._pushContext();
			    var x;
			    if (receiver === APPLY) {
			        if (!value || typeof value.length !== "number") {
			            x = errorObj;
			            x.e = new TypeError("cannot .spread() a non-array: " +
			                                    util.classString(value));
			        } else {
			            x = tryCatch(handler).apply(this._boundValue(), value);
			        }
			    } else {
			        x = tryCatch(handler).call(receiver, value);
			    }
			    var promiseCreated = promise._popContext();
			    bitField = promise._bitField;
			    if (((bitField & 65536) !== 0)) return;

			    if (x === NEXT_FILTER) {
			        promise._reject(value);
			    } else if (x === errorObj) {
			        promise._rejectCallback(x.e, false);
			    } else {
			        debug.checkForgottenReturns(x, promiseCreated, "",  promise, this);
			        promise._resolveCallback(x);
			    }
			};

			Promise.prototype._target = function() {
			    var ret = this;
			    while (ret._isFollowing()) ret = ret._followee();
			    return ret;
			};

			Promise.prototype._followee = function() {
			    return this._rejectionHandler0;
			};

			Promise.prototype._setFollowee = function(promise) {
			    this._rejectionHandler0 = promise;
			};

			Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
			    var isPromise = promise instanceof Promise;
			    var bitField = this._bitField;
			    var asyncGuaranteed = ((bitField & 134217728) !== 0);
			    if (((bitField & 65536) !== 0)) {
			        if (isPromise) promise._invokeInternalOnCancel();

			        if (receiver instanceof PassThroughHandlerContext &&
			            receiver.isFinallyHandler()) {
			            receiver.cancelPromise = promise;
			            if (tryCatch(handler).call(receiver, value) === errorObj) {
			                promise._reject(errorObj.e);
			            }
			        } else if (handler === reflectHandler) {
			            promise._fulfill(reflectHandler.call(receiver));
			        } else if (receiver instanceof Proxyable) {
			            receiver._promiseCancelled(promise);
			        } else if (isPromise || promise instanceof PromiseArray) {
			            promise._cancel();
			        } else {
			            receiver.cancel();
			        }
			    } else if (typeof handler === "function") {
			        if (!isPromise) {
			            handler.call(receiver, value, promise);
			        } else {
			            if (asyncGuaranteed) promise._setAsyncGuaranteed();
			            this._settlePromiseFromHandler(handler, receiver, value, promise);
			        }
			    } else if (receiver instanceof Proxyable) {
			        if (!receiver._isResolved()) {
			            if (((bitField & 33554432) !== 0)) {
			                receiver._promiseFulfilled(value, promise);
			            } else {
			                receiver._promiseRejected(value, promise);
			            }
			        }
			    } else if (isPromise) {
			        if (asyncGuaranteed) promise._setAsyncGuaranteed();
			        if (((bitField & 33554432) !== 0)) {
			            promise._fulfill(value);
			        } else {
			            promise._reject(value);
			        }
			    }
			};

			Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
			    var handler = ctx.handler;
			    var promise = ctx.promise;
			    var receiver = ctx.receiver;
			    var value = ctx.value;
			    if (typeof handler === "function") {
			        if (!(promise instanceof Promise)) {
			            handler.call(receiver, value, promise);
			        } else {
			            this._settlePromiseFromHandler(handler, receiver, value, promise);
			        }
			    } else if (promise instanceof Promise) {
			        promise._reject(value);
			    }
			};

			Promise.prototype._settlePromiseCtx = function(ctx) {
			    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
			};

			Promise.prototype._settlePromise0 = function(handler, value, bitField) {
			    var promise = this._promise0;
			    var receiver = this._receiverAt(0);
			    this._promise0 = undefined;
			    this._receiver0 = undefined;
			    this._settlePromise(promise, handler, receiver, value);
			};

			Promise.prototype._clearCallbackDataAtIndex = function(index) {
			    var base = index * 4 - 4;
			    this[base + 2] =
			    this[base + 3] =
			    this[base + 0] =
			    this[base + 1] = undefined;
			};

			Promise.prototype._fulfill = function (value) {
			    var bitField = this._bitField;
			    if (((bitField & 117506048) >>> 16)) return;
			    if (value === this) {
			        var err = makeSelfResolutionError();
			        this._attachExtraTrace(err);
			        return this._reject(err);
			    }
			    this._setFulfilled();
			    this._rejectionHandler0 = value;

			    if ((bitField & 65535) > 0) {
			        if (((bitField & 134217728) !== 0)) {
			            this._settlePromises();
			        } else {
			            async.settlePromises(this);
			        }
			        this._dereferenceTrace();
			    }
			};

			Promise.prototype._reject = function (reason) {
			    var bitField = this._bitField;
			    if (((bitField & 117506048) >>> 16)) return;
			    this._setRejected();
			    this._fulfillmentHandler0 = reason;

			    if (this._isFinal()) {
			        return async.fatalError(reason, util.isNode);
			    }

			    if ((bitField & 65535) > 0) {
			        async.settlePromises(this);
			    } else {
			        this._ensurePossibleRejectionHandled();
			    }
			};

			Promise.prototype._fulfillPromises = function (len, value) {
			    for (var i = 1; i < len; i++) {
			        var handler = this._fulfillmentHandlerAt(i);
			        var promise = this._promiseAt(i);
			        var receiver = this._receiverAt(i);
			        this._clearCallbackDataAtIndex(i);
			        this._settlePromise(promise, handler, receiver, value);
			    }
			};

			Promise.prototype._rejectPromises = function (len, reason) {
			    for (var i = 1; i < len; i++) {
			        var handler = this._rejectionHandlerAt(i);
			        var promise = this._promiseAt(i);
			        var receiver = this._receiverAt(i);
			        this._clearCallbackDataAtIndex(i);
			        this._settlePromise(promise, handler, receiver, reason);
			    }
			};

			Promise.prototype._settlePromises = function () {
			    var bitField = this._bitField;
			    var len = (bitField & 65535);

			    if (len > 0) {
			        if (((bitField & 16842752) !== 0)) {
			            var reason = this._fulfillmentHandler0;
			            this._settlePromise0(this._rejectionHandler0, reason, bitField);
			            this._rejectPromises(len, reason);
			        } else {
			            var value = this._rejectionHandler0;
			            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
			            this._fulfillPromises(len, value);
			        }
			        this._setLength(0);
			    }
			    this._clearCancellationData();
			};

			Promise.prototype._settledValue = function() {
			    var bitField = this._bitField;
			    if (((bitField & 33554432) !== 0)) {
			        return this._rejectionHandler0;
			    } else if (((bitField & 16777216) !== 0)) {
			        return this._fulfillmentHandler0;
			    }
			};

			if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
			    es5.defineProperty(Promise.prototype, Symbol.toStringTag, {
			        get: function () {
			            return "Object";
			        }
			    });
			}

			function deferResolve(v) {this.promise._resolveCallback(v);}
			function deferReject(v) {this.promise._rejectCallback(v, false);}

			Promise.defer = Promise.pending = function() {
			    debug.deprecated("Promise.defer", "new Promise");
			    var promise = new Promise(INTERNAL);
			    return {
			        promise: promise,
			        resolve: deferResolve,
			        reject: deferReject
			    };
			};

			util.notEnumerableProp(Promise,
			                       "_makeSelfResolutionError",
			                       makeSelfResolutionError);

			_dereq_("./method")(Promise, INTERNAL, tryConvertToPromise, apiRejection,
			    debug);
			_dereq_("./bind")(Promise, INTERNAL, tryConvertToPromise, debug);
			_dereq_("./cancel")(Promise, PromiseArray, apiRejection, debug);
			_dereq_("./direct_resolve")(Promise);
			_dereq_("./synchronous_inspection")(Promise);
			_dereq_("./join")(
			    Promise, PromiseArray, tryConvertToPromise, INTERNAL, async);
			Promise.Promise = Promise;
			Promise.version = "3.7.2";
			_dereq_('./call_get.js')(Promise);
			_dereq_('./generators.js')(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
			_dereq_('./map.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
			_dereq_('./nodeify.js')(Promise);
			_dereq_('./promisify.js')(Promise, INTERNAL);
			_dereq_('./props.js')(Promise, PromiseArray, tryConvertToPromise, apiRejection);
			_dereq_('./race.js')(Promise, INTERNAL, tryConvertToPromise, apiRejection);
			_dereq_('./reduce.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
			_dereq_('./settle.js')(Promise, PromiseArray, debug);
			_dereq_('./some.js')(Promise, PromiseArray, apiRejection);
			_dereq_('./timers.js')(Promise, INTERNAL, debug);
			_dereq_('./using.js')(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
			_dereq_('./any.js')(Promise);
			_dereq_('./each.js')(Promise, INTERNAL);
			_dereq_('./filter.js')(Promise, INTERNAL);
			                                                         
			    util.toFastProperties(Promise);                                          
			    util.toFastProperties(Promise.prototype);                                
			    function fillTypes(value) {                                              
			        var p = new Promise(INTERNAL);                                       
			        p._fulfillmentHandler0 = value;                                      
			        p._rejectionHandler0 = value;                                        
			        p._promise0 = value;                                                 
			        p._receiver0 = value;                                                
			    }                                                                        
			    // Complete slack tracking, opt out of field-type tracking and           
			    // stabilize map                                                         
			    fillTypes({a: 1});                                                       
			    fillTypes({b: 2});                                                       
			    fillTypes({c: 3});                                                       
			    fillTypes(1);                                                            
			    fillTypes(function(){});                                                 
			    fillTypes(undefined);                                                    
			    fillTypes(false);                                                        
			    fillTypes(new Promise(INTERNAL));                                        
			    debug.setBounds(Async.firstLineError, util.lastLineError);               
			    return Promise;                                                          

			};

			},{"./any.js":1,"./async":2,"./bind":3,"./call_get.js":5,"./cancel":6,"./catch_filter":7,"./context":8,"./debuggability":9,"./direct_resolve":10,"./each.js":11,"./errors":12,"./es5":13,"./filter.js":14,"./finally":15,"./generators.js":16,"./join":17,"./map.js":18,"./method":19,"./nodeback":20,"./nodeify.js":21,"./promise_array":23,"./promisify.js":24,"./props.js":25,"./race.js":27,"./reduce.js":28,"./settle.js":30,"./some.js":31,"./synchronous_inspection":32,"./thenables":33,"./timers.js":34,"./using.js":35,"./util":36,"async_hooks":undefined}],23:[function(_dereq_,module,exports){
			module.exports = function(Promise, INTERNAL, tryConvertToPromise,
			    apiRejection, Proxyable) {
			var util = _dereq_("./util");
			util.isArray;

			function toResolutionValue(val) {
			    switch(val) {
			    case -2: return [];
			    case -3: return {};
			    case -6: return new Map();
			    }
			}

			function PromiseArray(values) {
			    var promise = this._promise = new Promise(INTERNAL);
			    if (values instanceof Promise) {
			        promise._propagateFrom(values, 3);
			        values.suppressUnhandledRejections();
			    }
			    promise._setOnCancel(this);
			    this._values = values;
			    this._length = 0;
			    this._totalResolved = 0;
			    this._init(undefined, -2);
			}
			util.inherits(PromiseArray, Proxyable);

			PromiseArray.prototype.length = function () {
			    return this._length;
			};

			PromiseArray.prototype.promise = function () {
			    return this._promise;
			};

			PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
			    var values = tryConvertToPromise(this._values, this._promise);
			    if (values instanceof Promise) {
			        values = values._target();
			        var bitField = values._bitField;
			        this._values = values;

			        if (((bitField & 50397184) === 0)) {
			            this._promise._setAsyncGuaranteed();
			            return values._then(
			                init,
			                this._reject,
			                undefined,
			                this,
			                resolveValueIfEmpty
			           );
			        } else if (((bitField & 33554432) !== 0)) {
			            values = values._value();
			        } else if (((bitField & 16777216) !== 0)) {
			            return this._reject(values._reason());
			        } else {
			            return this._cancel();
			        }
			    }
			    values = util.asArray(values);
			    if (values === null) {
			        var err = apiRejection(
			            "expecting an array or an iterable object but got " + util.classString(values)).reason();
			        this._promise._rejectCallback(err, false);
			        return;
			    }

			    if (values.length === 0) {
			        if (resolveValueIfEmpty === -5) {
			            this._resolveEmptyArray();
			        }
			        else {
			            this._resolve(toResolutionValue(resolveValueIfEmpty));
			        }
			        return;
			    }
			    this._iterate(values);
			};

			PromiseArray.prototype._iterate = function(values) {
			    var len = this.getActualLength(values.length);
			    this._length = len;
			    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
			    var result = this._promise;
			    var isResolved = false;
			    var bitField = null;
			    for (var i = 0; i < len; ++i) {
			        var maybePromise = tryConvertToPromise(values[i], result);

			        if (maybePromise instanceof Promise) {
			            maybePromise = maybePromise._target();
			            bitField = maybePromise._bitField;
			        } else {
			            bitField = null;
			        }

			        if (isResolved) {
			            if (bitField !== null) {
			                maybePromise.suppressUnhandledRejections();
			            }
			        } else if (bitField !== null) {
			            if (((bitField & 50397184) === 0)) {
			                maybePromise._proxy(this, i);
			                this._values[i] = maybePromise;
			            } else if (((bitField & 33554432) !== 0)) {
			                isResolved = this._promiseFulfilled(maybePromise._value(), i);
			            } else if (((bitField & 16777216) !== 0)) {
			                isResolved = this._promiseRejected(maybePromise._reason(), i);
			            } else {
			                isResolved = this._promiseCancelled(i);
			            }
			        } else {
			            isResolved = this._promiseFulfilled(maybePromise, i);
			        }
			    }
			    if (!isResolved) result._setAsyncGuaranteed();
			};

			PromiseArray.prototype._isResolved = function () {
			    return this._values === null;
			};

			PromiseArray.prototype._resolve = function (value) {
			    this._values = null;
			    this._promise._fulfill(value);
			};

			PromiseArray.prototype._cancel = function() {
			    if (this._isResolved() || !this._promise._isCancellable()) return;
			    this._values = null;
			    this._promise._cancel();
			};

			PromiseArray.prototype._reject = function (reason) {
			    this._values = null;
			    this._promise._rejectCallback(reason, false);
			};

			PromiseArray.prototype._promiseFulfilled = function (value, index) {
			    this._values[index] = value;
			    var totalResolved = ++this._totalResolved;
			    if (totalResolved >= this._length) {
			        this._resolve(this._values);
			        return true;
			    }
			    return false;
			};

			PromiseArray.prototype._promiseCancelled = function() {
			    this._cancel();
			    return true;
			};

			PromiseArray.prototype._promiseRejected = function (reason) {
			    this._totalResolved++;
			    this._reject(reason);
			    return true;
			};

			PromiseArray.prototype._resultCancelled = function() {
			    if (this._isResolved()) return;
			    var values = this._values;
			    this._cancel();
			    if (values instanceof Promise) {
			        values.cancel();
			    } else {
			        for (var i = 0; i < values.length; ++i) {
			            if (values[i] instanceof Promise) {
			                values[i].cancel();
			            }
			        }
			    }
			};

			PromiseArray.prototype.shouldCopyValues = function () {
			    return true;
			};

			PromiseArray.prototype.getActualLength = function (len) {
			    return len;
			};

			return PromiseArray;
			};

			},{"./util":36}],24:[function(_dereq_,module,exports){
			module.exports = function(Promise, INTERNAL) {
			var THIS = {};
			var util = _dereq_("./util");
			var nodebackForPromise = _dereq_("./nodeback");
			var withAppended = util.withAppended;
			var maybeWrapAsError = util.maybeWrapAsError;
			var canEvaluate = util.canEvaluate;
			var TypeError = _dereq_("./errors").TypeError;
			var defaultSuffix = "Async";
			var defaultPromisified = {__isPromisified__: true};
			var noCopyProps = [
			    "arity",    "length",
			    "name",
			    "arguments",
			    "caller",
			    "callee",
			    "prototype",
			    "__isPromisified__"
			];
			var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

			var defaultFilter = function(name) {
			    return util.isIdentifier(name) &&
			        name.charAt(0) !== "_" &&
			        name !== "constructor";
			};

			function propsFilter(key) {
			    return !noCopyPropsPattern.test(key);
			}

			function isPromisified(fn) {
			    try {
			        return fn.__isPromisified__ === true;
			    }
			    catch (e) {
			        return false;
			    }
			}

			function hasPromisified(obj, key, suffix) {
			    var val = util.getDataPropertyOrDefault(obj, key + suffix,
			                                            defaultPromisified);
			    return val ? isPromisified(val) : false;
			}
			function checkValid(ret, suffix, suffixRegexp) {
			    for (var i = 0; i < ret.length; i += 2) {
			        var key = ret[i];
			        if (suffixRegexp.test(key)) {
			            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
			            for (var j = 0; j < ret.length; j += 2) {
			                if (ret[j] === keyWithoutAsyncSuffix) {
			                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/MqrFmX\u000a"
			                        .replace("%s", suffix));
			                }
			            }
			        }
			    }
			}

			function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
			    var keys = util.inheritedDataKeys(obj);
			    var ret = [];
			    for (var i = 0; i < keys.length; ++i) {
			        var key = keys[i];
			        var value = obj[key];
			        var passesDefaultFilter = filter === defaultFilter
			            ? true : defaultFilter(key);
			        if (typeof value === "function" &&
			            !isPromisified(value) &&
			            !hasPromisified(obj, key, suffix) &&
			            filter(key, value, obj, passesDefaultFilter)) {
			            ret.push(key, value);
			        }
			    }
			    checkValid(ret, suffix, suffixRegexp);
			    return ret;
			}

			var escapeIdentRegex = function(str) {
			    return str.replace(/([$])/, "\\$");
			};

			var makeNodePromisifiedEval;

			function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
			    var defaultThis = (function() {return this;})();
			    var method = callback;
			    if (typeof method === "string") {
			        callback = fn;
			    }
			    function promisified() {
			        var _receiver = receiver;
			        if (receiver === THIS) _receiver = this;
			        var promise = new Promise(INTERNAL);
			        promise._captureStackTrace();
			        var cb = typeof method === "string" && this !== defaultThis
			            ? this[method] : callback;
			        var fn = nodebackForPromise(promise, multiArgs);
			        try {
			            cb.apply(_receiver, withAppended(arguments, fn));
			        } catch(e) {
			            promise._rejectCallback(maybeWrapAsError(e), true, true);
			        }
			        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
			        return promise;
			    }
			    util.notEnumerableProp(promisified, "__isPromisified__", true);
			    return promisified;
			}

			var makeNodePromisified = canEvaluate
			    ? makeNodePromisifiedEval
			    : makeNodePromisifiedClosure;

			function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
			    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
			    var methods =
			        promisifiableMethods(obj, suffix, suffixRegexp, filter);

			    for (var i = 0, len = methods.length; i < len; i+= 2) {
			        var key = methods[i];
			        var fn = methods[i+1];
			        var promisifiedKey = key + suffix;
			        if (promisifier === makeNodePromisified) {
			            obj[promisifiedKey] =
			                makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
			        } else {
			            var promisified = promisifier(fn, function() {
			                return makeNodePromisified(key, THIS, key,
			                                           fn, suffix, multiArgs);
			            });
			            util.notEnumerableProp(promisified, "__isPromisified__", true);
			            obj[promisifiedKey] = promisified;
			        }
			    }
			    util.toFastProperties(obj);
			    return obj;
			}

			function promisify(callback, receiver, multiArgs) {
			    return makeNodePromisified(callback, receiver, undefined,
			                                callback, null, multiArgs);
			}

			Promise.promisify = function (fn, options) {
			    if (typeof fn !== "function") {
			        throw new TypeError("expecting a function but got " + util.classString(fn));
			    }
			    if (isPromisified(fn)) {
			        return fn;
			    }
			    options = Object(options);
			    var receiver = options.context === undefined ? THIS : options.context;
			    var multiArgs = !!options.multiArgs;
			    var ret = promisify(fn, receiver, multiArgs);
			    util.copyDescriptors(fn, ret, propsFilter);
			    return ret;
			};

			Promise.promisifyAll = function (target, options) {
			    if (typeof target !== "function" && typeof target !== "object") {
			        throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			    }
			    options = Object(options);
			    var multiArgs = !!options.multiArgs;
			    var suffix = options.suffix;
			    if (typeof suffix !== "string") suffix = defaultSuffix;
			    var filter = options.filter;
			    if (typeof filter !== "function") filter = defaultFilter;
			    var promisifier = options.promisifier;
			    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

			    if (!util.isIdentifier(suffix)) {
			        throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			    }

			    var keys = util.inheritedDataKeys(target);
			    for (var i = 0; i < keys.length; ++i) {
			        var value = target[keys[i]];
			        if (keys[i] !== "constructor" &&
			            util.isClass(value)) {
			            promisifyAll(value.prototype, suffix, filter, promisifier,
			                multiArgs);
			            promisifyAll(value, suffix, filter, promisifier, multiArgs);
			        }
			    }

			    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
			};
			};


			},{"./errors":12,"./nodeback":20,"./util":36}],25:[function(_dereq_,module,exports){
			module.exports = function(
			    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
			var util = _dereq_("./util");
			var isObject = util.isObject;
			var es5 = _dereq_("./es5");
			var Es6Map;
			if (typeof Map === "function") Es6Map = Map;

			var mapToEntries = (function() {
			    var index = 0;
			    var size = 0;

			    function extractEntry(value, key) {
			        this[index] = value;
			        this[index + size] = key;
			        index++;
			    }

			    return function mapToEntries(map) {
			        size = map.size;
			        index = 0;
			        var ret = new Array(map.size * 2);
			        map.forEach(extractEntry, ret);
			        return ret;
			    };
			})();

			var entriesToMap = function(entries) {
			    var ret = new Es6Map();
			    var length = entries.length / 2 | 0;
			    for (var i = 0; i < length; ++i) {
			        var key = entries[length + i];
			        var value = entries[i];
			        ret.set(key, value);
			    }
			    return ret;
			};

			function PropertiesPromiseArray(obj) {
			    var isMap = false;
			    var entries;
			    if (Es6Map !== undefined && obj instanceof Es6Map) {
			        entries = mapToEntries(obj);
			        isMap = true;
			    } else {
			        var keys = es5.keys(obj);
			        var len = keys.length;
			        entries = new Array(len * 2);
			        for (var i = 0; i < len; ++i) {
			            var key = keys[i];
			            entries[i] = obj[key];
			            entries[i + len] = key;
			        }
			    }
			    this.constructor$(entries);
			    this._isMap = isMap;
			    this._init$(undefined, isMap ? -6 : -3);
			}
			util.inherits(PropertiesPromiseArray, PromiseArray);

			PropertiesPromiseArray.prototype._init = function () {};

			PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
			    this._values[index] = value;
			    var totalResolved = ++this._totalResolved;
			    if (totalResolved >= this._length) {
			        var val;
			        if (this._isMap) {
			            val = entriesToMap(this._values);
			        } else {
			            val = {};
			            var keyOffset = this.length();
			            for (var i = 0, len = this.length(); i < len; ++i) {
			                val[this._values[i + keyOffset]] = this._values[i];
			            }
			        }
			        this._resolve(val);
			        return true;
			    }
			    return false;
			};

			PropertiesPromiseArray.prototype.shouldCopyValues = function () {
			    return false;
			};

			PropertiesPromiseArray.prototype.getActualLength = function (len) {
			    return len >> 1;
			};

			function props(promises) {
			    var ret;
			    var castValue = tryConvertToPromise(promises);

			    if (!isObject(castValue)) {
			        return apiRejection("cannot await properties of a non-object\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			    } else if (castValue instanceof Promise) {
			        ret = castValue._then(
			            Promise.props, undefined, undefined, undefined, undefined);
			    } else {
			        ret = new PropertiesPromiseArray(castValue).promise();
			    }

			    if (castValue instanceof Promise) {
			        ret._propagateFrom(castValue, 2);
			    }
			    return ret;
			}

			Promise.prototype.props = function () {
			    return props(this);
			};

			Promise.props = function (promises) {
			    return props(promises);
			};
			};

			},{"./es5":13,"./util":36}],26:[function(_dereq_,module,exports){
			function arrayMove(src, srcIndex, dst, dstIndex, len) {
			    for (var j = 0; j < len; ++j) {
			        dst[j + dstIndex] = src[j + srcIndex];
			        src[j + srcIndex] = void 0;
			    }
			}

			function Queue(capacity) {
			    this._capacity = capacity;
			    this._length = 0;
			    this._front = 0;
			}

			Queue.prototype._willBeOverCapacity = function (size) {
			    return this._capacity < size;
			};

			Queue.prototype._pushOne = function (arg) {
			    var length = this.length();
			    this._checkCapacity(length + 1);
			    var i = (this._front + length) & (this._capacity - 1);
			    this[i] = arg;
			    this._length = length + 1;
			};

			Queue.prototype.push = function (fn, receiver, arg) {
			    var length = this.length() + 3;
			    if (this._willBeOverCapacity(length)) {
			        this._pushOne(fn);
			        this._pushOne(receiver);
			        this._pushOne(arg);
			        return;
			    }
			    var j = this._front + length - 3;
			    this._checkCapacity(length);
			    var wrapMask = this._capacity - 1;
			    this[(j + 0) & wrapMask] = fn;
			    this[(j + 1) & wrapMask] = receiver;
			    this[(j + 2) & wrapMask] = arg;
			    this._length = length;
			};

			Queue.prototype.shift = function () {
			    var front = this._front,
			        ret = this[front];

			    this[front] = undefined;
			    this._front = (front + 1) & (this._capacity - 1);
			    this._length--;
			    return ret;
			};

			Queue.prototype.length = function () {
			    return this._length;
			};

			Queue.prototype._checkCapacity = function (size) {
			    if (this._capacity < size) {
			        this._resizeTo(this._capacity << 1);
			    }
			};

			Queue.prototype._resizeTo = function (capacity) {
			    var oldCapacity = this._capacity;
			    this._capacity = capacity;
			    var front = this._front;
			    var length = this._length;
			    var moveItemsCount = (front + length) & (oldCapacity - 1);
			    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
			};

			module.exports = Queue;

			},{}],27:[function(_dereq_,module,exports){
			module.exports = function(
			    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
			var util = _dereq_("./util");

			var raceLater = function (promise) {
			    return promise.then(function(array) {
			        return race(array, promise);
			    });
			};

			function race(promises, parent) {
			    var maybePromise = tryConvertToPromise(promises);

			    if (maybePromise instanceof Promise) {
			        return raceLater(maybePromise);
			    } else {
			        promises = util.asArray(promises);
			        if (promises === null)
			            return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
			    }

			    var ret = new Promise(INTERNAL);
			    if (parent !== undefined) {
			        ret._propagateFrom(parent, 3);
			    }
			    var fulfill = ret._fulfill;
			    var reject = ret._reject;
			    for (var i = 0, len = promises.length; i < len; ++i) {
			        var val = promises[i];

			        if (val === undefined && !(i in promises)) {
			            continue;
			        }

			        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
			    }
			    return ret;
			}

			Promise.race = function (promises) {
			    return race(promises, undefined);
			};

			Promise.prototype.race = function () {
			    return race(this, undefined);
			};

			};

			},{"./util":36}],28:[function(_dereq_,module,exports){
			module.exports = function(Promise,
			                          PromiseArray,
			                          apiRejection,
			                          tryConvertToPromise,
			                          INTERNAL,
			                          debug) {
			var util = _dereq_("./util");
			var tryCatch = util.tryCatch;

			function ReductionPromiseArray(promises, fn, initialValue, _each) {
			    this.constructor$(promises);
			    var context = Promise._getContext();
			    this._fn = util.contextBind(context, fn);
			    if (initialValue !== undefined) {
			        initialValue = Promise.resolve(initialValue);
			        initialValue._attachCancellationCallback(this);
			    }
			    this._initialValue = initialValue;
			    this._currentCancellable = null;
			    if(_each === INTERNAL) {
			        this._eachValues = Array(this._length);
			    } else if (_each === 0) {
			        this._eachValues = null;
			    } else {
			        this._eachValues = undefined;
			    }
			    this._promise._captureStackTrace();
			    this._init$(undefined, -5);
			}
			util.inherits(ReductionPromiseArray, PromiseArray);

			ReductionPromiseArray.prototype._gotAccum = function(accum) {
			    if (this._eachValues !== undefined &&
			        this._eachValues !== null &&
			        accum !== INTERNAL) {
			        this._eachValues.push(accum);
			    }
			};

			ReductionPromiseArray.prototype._eachComplete = function(value) {
			    if (this._eachValues !== null) {
			        this._eachValues.push(value);
			    }
			    return this._eachValues;
			};

			ReductionPromiseArray.prototype._init = function() {};

			ReductionPromiseArray.prototype._resolveEmptyArray = function() {
			    this._resolve(this._eachValues !== undefined ? this._eachValues
			                                                 : this._initialValue);
			};

			ReductionPromiseArray.prototype.shouldCopyValues = function () {
			    return false;
			};

			ReductionPromiseArray.prototype._resolve = function(value) {
			    this._promise._resolveCallback(value);
			    this._values = null;
			};

			ReductionPromiseArray.prototype._resultCancelled = function(sender) {
			    if (sender === this._initialValue) return this._cancel();
			    if (this._isResolved()) return;
			    this._resultCancelled$();
			    if (this._currentCancellable instanceof Promise) {
			        this._currentCancellable.cancel();
			    }
			    if (this._initialValue instanceof Promise) {
			        this._initialValue.cancel();
			    }
			};

			ReductionPromiseArray.prototype._iterate = function (values) {
			    this._values = values;
			    var value;
			    var i;
			    var length = values.length;
			    if (this._initialValue !== undefined) {
			        value = this._initialValue;
			        i = 0;
			    } else {
			        value = Promise.resolve(values[0]);
			        i = 1;
			    }

			    this._currentCancellable = value;

			    for (var j = i; j < length; ++j) {
			        var maybePromise = values[j];
			        if (maybePromise instanceof Promise) {
			            maybePromise.suppressUnhandledRejections();
			        }
			    }

			    if (!value.isRejected()) {
			        for (; i < length; ++i) {
			            var ctx = {
			                accum: null,
			                value: values[i],
			                index: i,
			                length: length,
			                array: this
			            };

			            value = value._then(gotAccum, undefined, undefined, ctx, undefined);

			            if ((i & 127) === 0) {
			                value._setNoAsyncGuarantee();
			            }
			        }
			    }

			    if (this._eachValues !== undefined) {
			        value = value
			            ._then(this._eachComplete, undefined, undefined, this, undefined);
			    }
			    value._then(completed, completed, undefined, value, this);
			};

			Promise.prototype.reduce = function (fn, initialValue) {
			    return reduce(this, fn, initialValue, null);
			};

			Promise.reduce = function (promises, fn, initialValue, _each) {
			    return reduce(promises, fn, initialValue, _each);
			};

			function completed(valueOrReason, array) {
			    if (this.isFulfilled()) {
			        array._resolve(valueOrReason);
			    } else {
			        array._reject(valueOrReason);
			    }
			}

			function reduce(promises, fn, initialValue, _each) {
			    if (typeof fn !== "function") {
			        return apiRejection("expecting a function but got " + util.classString(fn));
			    }
			    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
			    return array.promise();
			}

			function gotAccum(accum) {
			    this.accum = accum;
			    this.array._gotAccum(accum);
			    var value = tryConvertToPromise(this.value, this.array._promise);
			    if (value instanceof Promise) {
			        this.array._currentCancellable = value;
			        return value._then(gotValue, undefined, undefined, this, undefined);
			    } else {
			        return gotValue.call(this, value);
			    }
			}

			function gotValue(value) {
			    var array = this.array;
			    var promise = array._promise;
			    var fn = tryCatch(array._fn);
			    promise._pushContext();
			    var ret;
			    if (array._eachValues !== undefined) {
			        ret = fn.call(promise._boundValue(), value, this.index, this.length);
			    } else {
			        ret = fn.call(promise._boundValue(),
			                              this.accum, value, this.index, this.length);
			    }
			    if (ret instanceof Promise) {
			        array._currentCancellable = ret;
			    }
			    var promiseCreated = promise._popContext();
			    debug.checkForgottenReturns(
			        ret,
			        promiseCreated,
			        array._eachValues !== undefined ? "Promise.each" : "Promise.reduce",
			        promise
			    );
			    return ret;
			}
			};

			},{"./util":36}],29:[function(_dereq_,module,exports){
			var util = _dereq_("./util");
			var schedule;
			var noAsyncScheduler = function() {
			    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			};
			var NativePromise = util.getNativePromise();
			if (util.isNode && typeof MutationObserver === "undefined") {
			    var GlobalSetImmediate = commonjsGlobal.setImmediate;
			    var ProcessNextTick = process.nextTick;
			    schedule = util.isRecentNode
			                ? function(fn) { GlobalSetImmediate.call(commonjsGlobal, fn); }
			                : function(fn) { ProcessNextTick.call(process, fn); };
			} else if (typeof NativePromise === "function" &&
			           typeof NativePromise.resolve === "function") {
			    var nativePromise = NativePromise.resolve();
			    schedule = function(fn) {
			        nativePromise.then(fn);
			    };
			} else if ((typeof MutationObserver !== "undefined") &&
			          !(typeof window !== "undefined" &&
			            window.navigator &&
			            (window.navigator.standalone || window.cordova)) &&
			          ("classList" in document.documentElement)) {
			    schedule = (function() {
			        var div = document.createElement("div");
			        var opts = {attributes: true};
			        var toggleScheduled = false;
			        var div2 = document.createElement("div");
			        var o2 = new MutationObserver(function() {
			            div.classList.toggle("foo");
			            toggleScheduled = false;
			        });
			        o2.observe(div2, opts);

			        var scheduleToggle = function() {
			            if (toggleScheduled) return;
			            toggleScheduled = true;
			            div2.classList.toggle("foo");
			        };

			        return function schedule(fn) {
			            var o = new MutationObserver(function() {
			                o.disconnect();
			                fn();
			            });
			            o.observe(div, opts);
			            scheduleToggle();
			        };
			    })();
			} else if (typeof setImmediate !== "undefined") {
			    schedule = function (fn) {
			        setImmediate(fn);
			    };
			} else if (typeof setTimeout !== "undefined") {
			    schedule = function (fn) {
			        setTimeout(fn, 0);
			    };
			} else {
			    schedule = noAsyncScheduler;
			}
			module.exports = schedule;

			},{"./util":36}],30:[function(_dereq_,module,exports){
			module.exports =
			    function(Promise, PromiseArray, debug) {
			var PromiseInspection = Promise.PromiseInspection;
			var util = _dereq_("./util");

			function SettledPromiseArray(values) {
			    this.constructor$(values);
			}
			util.inherits(SettledPromiseArray, PromiseArray);

			SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
			    this._values[index] = inspection;
			    var totalResolved = ++this._totalResolved;
			    if (totalResolved >= this._length) {
			        this._resolve(this._values);
			        return true;
			    }
			    return false;
			};

			SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
			    var ret = new PromiseInspection();
			    ret._bitField = 33554432;
			    ret._settledValueField = value;
			    return this._promiseResolved(index, ret);
			};
			SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
			    var ret = new PromiseInspection();
			    ret._bitField = 16777216;
			    ret._settledValueField = reason;
			    return this._promiseResolved(index, ret);
			};

			Promise.settle = function (promises) {
			    debug.deprecated(".settle()", ".reflect()");
			    return new SettledPromiseArray(promises).promise();
			};

			Promise.allSettled = function (promises) {
			    return new SettledPromiseArray(promises).promise();
			};

			Promise.prototype.settle = function () {
			    return Promise.settle(this);
			};
			};

			},{"./util":36}],31:[function(_dereq_,module,exports){
			module.exports =
			function(Promise, PromiseArray, apiRejection) {
			var util = _dereq_("./util");
			var RangeError = _dereq_("./errors").RangeError;
			var AggregateError = _dereq_("./errors").AggregateError;
			var isArray = util.isArray;
			var CANCELLATION = {};


			function SomePromiseArray(values) {
			    this.constructor$(values);
			    this._howMany = 0;
			    this._unwrap = false;
			    this._initialized = false;
			}
			util.inherits(SomePromiseArray, PromiseArray);

			SomePromiseArray.prototype._init = function () {
			    if (!this._initialized) {
			        return;
			    }
			    if (this._howMany === 0) {
			        this._resolve([]);
			        return;
			    }
			    this._init$(undefined, -5);
			    var isArrayResolved = isArray(this._values);
			    if (!this._isResolved() &&
			        isArrayResolved &&
			        this._howMany > this._canPossiblyFulfill()) {
			        this._reject(this._getRangeError(this.length()));
			    }
			};

			SomePromiseArray.prototype.init = function () {
			    this._initialized = true;
			    this._init();
			};

			SomePromiseArray.prototype.setUnwrap = function () {
			    this._unwrap = true;
			};

			SomePromiseArray.prototype.howMany = function () {
			    return this._howMany;
			};

			SomePromiseArray.prototype.setHowMany = function (count) {
			    this._howMany = count;
			};

			SomePromiseArray.prototype._promiseFulfilled = function (value) {
			    this._addFulfilled(value);
			    if (this._fulfilled() === this.howMany()) {
			        this._values.length = this.howMany();
			        if (this.howMany() === 1 && this._unwrap) {
			            this._resolve(this._values[0]);
			        } else {
			            this._resolve(this._values);
			        }
			        return true;
			    }
			    return false;

			};
			SomePromiseArray.prototype._promiseRejected = function (reason) {
			    this._addRejected(reason);
			    return this._checkOutcome();
			};

			SomePromiseArray.prototype._promiseCancelled = function () {
			    if (this._values instanceof Promise || this._values == null) {
			        return this._cancel();
			    }
			    this._addRejected(CANCELLATION);
			    return this._checkOutcome();
			};

			SomePromiseArray.prototype._checkOutcome = function() {
			    if (this.howMany() > this._canPossiblyFulfill()) {
			        var e = new AggregateError();
			        for (var i = this.length(); i < this._values.length; ++i) {
			            if (this._values[i] !== CANCELLATION) {
			                e.push(this._values[i]);
			            }
			        }
			        if (e.length > 0) {
			            this._reject(e);
			        } else {
			            this._cancel();
			        }
			        return true;
			    }
			    return false;
			};

			SomePromiseArray.prototype._fulfilled = function () {
			    return this._totalResolved;
			};

			SomePromiseArray.prototype._rejected = function () {
			    return this._values.length - this.length();
			};

			SomePromiseArray.prototype._addRejected = function (reason) {
			    this._values.push(reason);
			};

			SomePromiseArray.prototype._addFulfilled = function (value) {
			    this._values[this._totalResolved++] = value;
			};

			SomePromiseArray.prototype._canPossiblyFulfill = function () {
			    return this.length() - this._rejected();
			};

			SomePromiseArray.prototype._getRangeError = function (count) {
			    var message = "Input array must contain at least " +
			            this._howMany + " items but contains only " + count + " items";
			    return new RangeError(message);
			};

			SomePromiseArray.prototype._resolveEmptyArray = function () {
			    this._reject(this._getRangeError(0));
			};

			function some(promises, howMany) {
			    if ((howMany | 0) !== howMany || howMany < 0) {
			        return apiRejection("expecting a positive integer\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			    }
			    var ret = new SomePromiseArray(promises);
			    var promise = ret.promise();
			    ret.setHowMany(howMany);
			    ret.init();
			    return promise;
			}

			Promise.some = function (promises, howMany) {
			    return some(promises, howMany);
			};

			Promise.prototype.some = function (howMany) {
			    return some(this, howMany);
			};

			Promise._SomePromiseArray = SomePromiseArray;
			};

			},{"./errors":12,"./util":36}],32:[function(_dereq_,module,exports){
			module.exports = function(Promise) {
			function PromiseInspection(promise) {
			    if (promise !== undefined) {
			        promise = promise._target();
			        this._bitField = promise._bitField;
			        this._settledValueField = promise._isFateSealed()
			            ? promise._settledValue() : undefined;
			    }
			    else {
			        this._bitField = 0;
			        this._settledValueField = undefined;
			    }
			}

			PromiseInspection.prototype._settledValue = function() {
			    return this._settledValueField;
			};

			var value = PromiseInspection.prototype.value = function () {
			    if (!this.isFulfilled()) {
			        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			    }
			    return this._settledValue();
			};

			var reason = PromiseInspection.prototype.error =
			PromiseInspection.prototype.reason = function () {
			    if (!this.isRejected()) {
			        throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
			    }
			    return this._settledValue();
			};

			var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
			    return (this._bitField & 33554432) !== 0;
			};

			var isRejected = PromiseInspection.prototype.isRejected = function () {
			    return (this._bitField & 16777216) !== 0;
			};

			var isPending = PromiseInspection.prototype.isPending = function () {
			    return (this._bitField & 50397184) === 0;
			};

			var isResolved = PromiseInspection.prototype.isResolved = function () {
			    return (this._bitField & 50331648) !== 0;
			};

			PromiseInspection.prototype.isCancelled = function() {
			    return (this._bitField & 8454144) !== 0;
			};

			Promise.prototype.__isCancelled = function() {
			    return (this._bitField & 65536) === 65536;
			};

			Promise.prototype._isCancelled = function() {
			    return this._target().__isCancelled();
			};

			Promise.prototype.isCancelled = function() {
			    return (this._target()._bitField & 8454144) !== 0;
			};

			Promise.prototype.isPending = function() {
			    return isPending.call(this._target());
			};

			Promise.prototype.isRejected = function() {
			    return isRejected.call(this._target());
			};

			Promise.prototype.isFulfilled = function() {
			    return isFulfilled.call(this._target());
			};

			Promise.prototype.isResolved = function() {
			    return isResolved.call(this._target());
			};

			Promise.prototype.value = function() {
			    return value.call(this._target());
			};

			Promise.prototype.reason = function() {
			    var target = this._target();
			    target._unsetRejectionIsUnhandled();
			    return reason.call(target);
			};

			Promise.prototype._value = function() {
			    return this._settledValue();
			};

			Promise.prototype._reason = function() {
			    this._unsetRejectionIsUnhandled();
			    return this._settledValue();
			};

			Promise.PromiseInspection = PromiseInspection;
			};

			},{}],33:[function(_dereq_,module,exports){
			module.exports = function(Promise, INTERNAL) {
			var util = _dereq_("./util");
			var errorObj = util.errorObj;
			var isObject = util.isObject;

			function tryConvertToPromise(obj, context) {
			    if (isObject(obj)) {
			        if (obj instanceof Promise) return obj;
			        var then = getThen(obj);
			        if (then === errorObj) {
			            if (context) context._pushContext();
			            var ret = Promise.reject(then.e);
			            if (context) context._popContext();
			            return ret;
			        } else if (typeof then === "function") {
			            if (isAnyBluebirdPromise(obj)) {
			                var ret = new Promise(INTERNAL);
			                obj._then(
			                    ret._fulfill,
			                    ret._reject,
			                    undefined,
			                    ret,
			                    null
			                );
			                return ret;
			            }
			            return doThenable(obj, then, context);
			        }
			    }
			    return obj;
			}

			function doGetThen(obj) {
			    return obj.then;
			}

			function getThen(obj) {
			    try {
			        return doGetThen(obj);
			    } catch (e) {
			        errorObj.e = e;
			        return errorObj;
			    }
			}

			var hasProp = {}.hasOwnProperty;
			function isAnyBluebirdPromise(obj) {
			    try {
			        return hasProp.call(obj, "_promise0");
			    } catch (e) {
			        return false;
			    }
			}

			function doThenable(x, then, context) {
			    var promise = new Promise(INTERNAL);
			    var ret = promise;
			    if (context) context._pushContext();
			    promise._captureStackTrace();
			    if (context) context._popContext();
			    var synchronous = true;
			    var result = util.tryCatch(then).call(x, resolve, reject);
			    synchronous = false;

			    if (promise && result === errorObj) {
			        promise._rejectCallback(result.e, true, true);
			        promise = null;
			    }

			    function resolve(value) {
			        if (!promise) return;
			        promise._resolveCallback(value);
			        promise = null;
			    }

			    function reject(reason) {
			        if (!promise) return;
			        promise._rejectCallback(reason, synchronous, true);
			        promise = null;
			    }
			    return ret;
			}

			return tryConvertToPromise;
			};

			},{"./util":36}],34:[function(_dereq_,module,exports){
			module.exports = function(Promise, INTERNAL, debug) {
			var util = _dereq_("./util");
			var TimeoutError = Promise.TimeoutError;

			function HandleWrapper(handle)  {
			    this.handle = handle;
			}

			HandleWrapper.prototype._resultCancelled = function() {
			    clearTimeout(this.handle);
			};

			var afterValue = function(value) { return delay(+this).thenReturn(value); };
			var delay = Promise.delay = function (ms, value) {
			    var ret;
			    var handle;
			    if (value !== undefined) {
			        ret = Promise.resolve(value)
			                ._then(afterValue, null, null, ms, undefined);
			        if (debug.cancellation() && value instanceof Promise) {
			            ret._setOnCancel(value);
			        }
			    } else {
			        ret = new Promise(INTERNAL);
			        handle = setTimeout(function() { ret._fulfill(); }, +ms);
			        if (debug.cancellation()) {
			            ret._setOnCancel(new HandleWrapper(handle));
			        }
			        ret._captureStackTrace();
			    }
			    ret._setAsyncGuaranteed();
			    return ret;
			};

			Promise.prototype.delay = function (ms) {
			    return delay(ms, this);
			};

			var afterTimeout = function (promise, message, parent) {
			    var err;
			    if (typeof message !== "string") {
			        if (message instanceof Error) {
			            err = message;
			        } else {
			            err = new TimeoutError("operation timed out");
			        }
			    } else {
			        err = new TimeoutError(message);
			    }
			    util.markAsOriginatingFromRejection(err);
			    promise._attachExtraTrace(err);
			    promise._reject(err);

			    if (parent != null) {
			        parent.cancel();
			    }
			};

			function successClear(value) {
			    clearTimeout(this.handle);
			    return value;
			}

			function failureClear(reason) {
			    clearTimeout(this.handle);
			    throw reason;
			}

			Promise.prototype.timeout = function (ms, message) {
			    ms = +ms;
			    var ret, parent;

			    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
			        if (ret.isPending()) {
			            afterTimeout(ret, message, parent);
			        }
			    }, ms));

			    if (debug.cancellation()) {
			        parent = this.then();
			        ret = parent._then(successClear, failureClear,
			                            undefined, handleWrapper, undefined);
			        ret._setOnCancel(handleWrapper);
			    } else {
			        ret = this._then(successClear, failureClear,
			                            undefined, handleWrapper, undefined);
			    }

			    return ret;
			};

			};

			},{"./util":36}],35:[function(_dereq_,module,exports){
			module.exports = function (Promise, apiRejection, tryConvertToPromise,
			    createContext, INTERNAL, debug) {
			    var util = _dereq_("./util");
			    var TypeError = _dereq_("./errors").TypeError;
			    var inherits = _dereq_("./util").inherits;
			    var errorObj = util.errorObj;
			    var tryCatch = util.tryCatch;
			    var NULL = {};

			    function thrower(e) {
			        setTimeout(function(){throw e;}, 0);
			    }

			    function castPreservingDisposable(thenable) {
			        var maybePromise = tryConvertToPromise(thenable);
			        if (maybePromise !== thenable &&
			            typeof thenable._isDisposable === "function" &&
			            typeof thenable._getDisposer === "function" &&
			            thenable._isDisposable()) {
			            maybePromise._setDisposable(thenable._getDisposer());
			        }
			        return maybePromise;
			    }
			    function dispose(resources, inspection) {
			        var i = 0;
			        var len = resources.length;
			        var ret = new Promise(INTERNAL);
			        function iterator() {
			            if (i >= len) return ret._fulfill();
			            var maybePromise = castPreservingDisposable(resources[i++]);
			            if (maybePromise instanceof Promise &&
			                maybePromise._isDisposable()) {
			                try {
			                    maybePromise = tryConvertToPromise(
			                        maybePromise._getDisposer().tryDispose(inspection),
			                        resources.promise);
			                } catch (e) {
			                    return thrower(e);
			                }
			                if (maybePromise instanceof Promise) {
			                    return maybePromise._then(iterator, thrower,
			                                              null, null, null);
			                }
			            }
			            iterator();
			        }
			        iterator();
			        return ret;
			    }

			    function Disposer(data, promise, context) {
			        this._data = data;
			        this._promise = promise;
			        this._context = context;
			    }

			    Disposer.prototype.data = function () {
			        return this._data;
			    };

			    Disposer.prototype.promise = function () {
			        return this._promise;
			    };

			    Disposer.prototype.resource = function () {
			        if (this.promise().isFulfilled()) {
			            return this.promise().value();
			        }
			        return NULL;
			    };

			    Disposer.prototype.tryDispose = function(inspection) {
			        var resource = this.resource();
			        var context = this._context;
			        if (context !== undefined) context._pushContext();
			        var ret = resource !== NULL
			            ? this.doDispose(resource, inspection) : null;
			        if (context !== undefined) context._popContext();
			        this._promise._unsetDisposable();
			        this._data = null;
			        return ret;
			    };

			    Disposer.isDisposer = function (d) {
			        return (d != null &&
			                typeof d.resource === "function" &&
			                typeof d.tryDispose === "function");
			    };

			    function FunctionDisposer(fn, promise, context) {
			        this.constructor$(fn, promise, context);
			    }
			    inherits(FunctionDisposer, Disposer);

			    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
			        var fn = this.data();
			        return fn.call(resource, resource, inspection);
			    };

			    function maybeUnwrapDisposer(value) {
			        if (Disposer.isDisposer(value)) {
			            this.resources[this.index]._setDisposable(value);
			            return value.promise();
			        }
			        return value;
			    }

			    function ResourceList(length) {
			        this.length = length;
			        this.promise = null;
			        this[length-1] = null;
			    }

			    ResourceList.prototype._resultCancelled = function() {
			        var len = this.length;
			        for (var i = 0; i < len; ++i) {
			            var item = this[i];
			            if (item instanceof Promise) {
			                item.cancel();
			            }
			        }
			    };

			    Promise.using = function () {
			        var len = arguments.length;
			        if (len < 2) return apiRejection(
			                        "you must pass at least 2 arguments to Promise.using");
			        var fn = arguments[len - 1];
			        if (typeof fn !== "function") {
			            return apiRejection("expecting a function but got " + util.classString(fn));
			        }
			        var input;
			        var spreadArgs = true;
			        if (len === 2 && Array.isArray(arguments[0])) {
			            input = arguments[0];
			            len = input.length;
			            spreadArgs = false;
			        } else {
			            input = arguments;
			            len--;
			        }
			        var resources = new ResourceList(len);
			        for (var i = 0; i < len; ++i) {
			            var resource = input[i];
			            if (Disposer.isDisposer(resource)) {
			                var disposer = resource;
			                resource = resource.promise();
			                resource._setDisposable(disposer);
			            } else {
			                var maybePromise = tryConvertToPromise(resource);
			                if (maybePromise instanceof Promise) {
			                    resource =
			                        maybePromise._then(maybeUnwrapDisposer, null, null, {
			                            resources: resources,
			                            index: i
			                    }, undefined);
			                }
			            }
			            resources[i] = resource;
			        }

			        var reflectedResources = new Array(resources.length);
			        for (var i = 0; i < reflectedResources.length; ++i) {
			            reflectedResources[i] = Promise.resolve(resources[i]).reflect();
			        }

			        var resultPromise = Promise.all(reflectedResources)
			            .then(function(inspections) {
			                for (var i = 0; i < inspections.length; ++i) {
			                    var inspection = inspections[i];
			                    if (inspection.isRejected()) {
			                        errorObj.e = inspection.error();
			                        return errorObj;
			                    } else if (!inspection.isFulfilled()) {
			                        resultPromise.cancel();
			                        return;
			                    }
			                    inspections[i] = inspection.value();
			                }
			                promise._pushContext();

			                fn = tryCatch(fn);
			                var ret = spreadArgs
			                    ? fn.apply(undefined, inspections) : fn(inspections);
			                var promiseCreated = promise._popContext();
			                debug.checkForgottenReturns(
			                    ret, promiseCreated, "Promise.using", promise);
			                return ret;
			            });

			        var promise = resultPromise.lastly(function() {
			            var inspection = new Promise.PromiseInspection(resultPromise);
			            return dispose(resources, inspection);
			        });
			        resources.promise = promise;
			        promise._setOnCancel(resources);
			        return promise;
			    };

			    Promise.prototype._setDisposable = function (disposer) {
			        this._bitField = this._bitField | 131072;
			        this._disposer = disposer;
			    };

			    Promise.prototype._isDisposable = function () {
			        return (this._bitField & 131072) > 0;
			    };

			    Promise.prototype._getDisposer = function () {
			        return this._disposer;
			    };

			    Promise.prototype._unsetDisposable = function () {
			        this._bitField = this._bitField & (~131072);
			        this._disposer = undefined;
			    };

			    Promise.prototype.disposer = function (fn) {
			        if (typeof fn === "function") {
			            return new FunctionDisposer(fn, this, createContext());
			        }
			        throw new TypeError();
			    };

			};

			},{"./errors":12,"./util":36}],36:[function(_dereq_,module,exports){
			var es5 = _dereq_("./es5");
			var canEvaluate = typeof navigator == "undefined";

			var errorObj = {e: {}};
			var tryCatchTarget;
			var globalObject = typeof self !== "undefined" ? self :
			    typeof window !== "undefined" ? window :
			    typeof commonjsGlobal !== "undefined" ? commonjsGlobal :
			    this !== undefined ? this : null;

			function tryCatcher() {
			    try {
			        var target = tryCatchTarget;
			        tryCatchTarget = null;
			        return target.apply(this, arguments);
			    } catch (e) {
			        errorObj.e = e;
			        return errorObj;
			    }
			}
			function tryCatch(fn) {
			    tryCatchTarget = fn;
			    return tryCatcher;
			}

			var inherits = function(Child, Parent) {
			    var hasProp = {}.hasOwnProperty;

			    function T() {
			        this.constructor = Child;
			        this.constructor$ = Parent;
			        for (var propertyName in Parent.prototype) {
			            if (hasProp.call(Parent.prototype, propertyName) &&
			                propertyName.charAt(propertyName.length-1) !== "$"
			           ) {
			                this[propertyName + "$"] = Parent.prototype[propertyName];
			            }
			        }
			    }
			    T.prototype = Parent.prototype;
			    Child.prototype = new T();
			    return Child.prototype;
			};


			function isPrimitive(val) {
			    return val == null || val === true || val === false ||
			        typeof val === "string" || typeof val === "number";

			}

			function isObject(value) {
			    return typeof value === "function" ||
			           typeof value === "object" && value !== null;
			}

			function maybeWrapAsError(maybeError) {
			    if (!isPrimitive(maybeError)) return maybeError;

			    return new Error(safeToString(maybeError));
			}

			function withAppended(target, appendee) {
			    var len = target.length;
			    var ret = new Array(len + 1);
			    var i;
			    for (i = 0; i < len; ++i) {
			        ret[i] = target[i];
			    }
			    ret[i] = appendee;
			    return ret;
			}

			function getDataPropertyOrDefault(obj, key, defaultValue) {
			    if (es5.isES5) {
			        var desc = Object.getOwnPropertyDescriptor(obj, key);

			        if (desc != null) {
			            return desc.get == null && desc.set == null
			                    ? desc.value
			                    : defaultValue;
			        }
			    } else {
			        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
			    }
			}

			function notEnumerableProp(obj, name, value) {
			    if (isPrimitive(obj)) return obj;
			    var descriptor = {
			        value: value,
			        configurable: true,
			        enumerable: false,
			        writable: true
			    };
			    es5.defineProperty(obj, name, descriptor);
			    return obj;
			}

			function thrower(r) {
			    throw r;
			}

			var inheritedDataKeys = (function() {
			    var excludedPrototypes = [
			        Array.prototype,
			        Object.prototype,
			        Function.prototype
			    ];

			    var isExcludedProto = function(val) {
			        for (var i = 0; i < excludedPrototypes.length; ++i) {
			            if (excludedPrototypes[i] === val) {
			                return true;
			            }
			        }
			        return false;
			    };

			    if (es5.isES5) {
			        var getKeys = Object.getOwnPropertyNames;
			        return function(obj) {
			            var ret = [];
			            var visitedKeys = Object.create(null);
			            while (obj != null && !isExcludedProto(obj)) {
			                var keys;
			                try {
			                    keys = getKeys(obj);
			                } catch (e) {
			                    return ret;
			                }
			                for (var i = 0; i < keys.length; ++i) {
			                    var key = keys[i];
			                    if (visitedKeys[key]) continue;
			                    visitedKeys[key] = true;
			                    var desc = Object.getOwnPropertyDescriptor(obj, key);
			                    if (desc != null && desc.get == null && desc.set == null) {
			                        ret.push(key);
			                    }
			                }
			                obj = es5.getPrototypeOf(obj);
			            }
			            return ret;
			        };
			    } else {
			        var hasProp = {}.hasOwnProperty;
			        return function(obj) {
			            if (isExcludedProto(obj)) return [];
			            var ret = [];

			            /*jshint forin:false */
			            enumeration: for (var key in obj) {
			                if (hasProp.call(obj, key)) {
			                    ret.push(key);
			                } else {
			                    for (var i = 0; i < excludedPrototypes.length; ++i) {
			                        if (hasProp.call(excludedPrototypes[i], key)) {
			                            continue enumeration;
			                        }
			                    }
			                    ret.push(key);
			                }
			            }
			            return ret;
			        };
			    }

			})();

			var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
			function isClass(fn) {
			    try {
			        if (typeof fn === "function") {
			            var keys = es5.names(fn.prototype);

			            var hasMethods = es5.isES5 && keys.length > 1;
			            var hasMethodsOtherThanConstructor = keys.length > 0 &&
			                !(keys.length === 1 && keys[0] === "constructor");
			            var hasThisAssignmentAndStaticMethods =
			                thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

			            if (hasMethods || hasMethodsOtherThanConstructor ||
			                hasThisAssignmentAndStaticMethods) {
			                return true;
			            }
			        }
			        return false;
			    } catch (e) {
			        return false;
			    }
			}

			function toFastProperties(obj) {
			    /*jshint -W027,-W055,-W031*/
			    function FakeConstructor() {}
			    FakeConstructor.prototype = obj;
			    var receiver = new FakeConstructor();
			    function ic() {
			        return typeof receiver.foo;
			    }
			    ic();
			    ic();
			    return obj;
			}

			var rident = /^[a-z$_][a-z$_0-9]*$/i;
			function isIdentifier(str) {
			    return rident.test(str);
			}

			function filledRange(count, prefix, suffix) {
			    var ret = new Array(count);
			    for(var i = 0; i < count; ++i) {
			        ret[i] = prefix + i + suffix;
			    }
			    return ret;
			}

			function safeToString(obj) {
			    try {
			        return obj + "";
			    } catch (e) {
			        return "[no string representation]";
			    }
			}

			function isError(obj) {
			    return obj instanceof Error ||
			        (obj !== null &&
			           typeof obj === "object" &&
			           typeof obj.message === "string" &&
			           typeof obj.name === "string");
			}

			function markAsOriginatingFromRejection(e) {
			    try {
			        notEnumerableProp(e, "isOperational", true);
			    }
			    catch(ignore) {}
			}

			function originatesFromRejection(e) {
			    if (e == null) return false;
			    return ((e instanceof Error["__BluebirdErrorTypes__"].OperationalError) ||
			        e["isOperational"] === true);
			}

			function canAttachTrace(obj) {
			    return isError(obj) && es5.propertyIsWritable(obj, "stack");
			}

			var ensureErrorObject = (function() {
			    if (!("stack" in new Error())) {
			        return function(value) {
			            if (canAttachTrace(value)) return value;
			            try {throw new Error(safeToString(value));}
			            catch(err) {return err;}
			        };
			    } else {
			        return function(value) {
			            if (canAttachTrace(value)) return value;
			            return new Error(safeToString(value));
			        };
			    }
			})();

			function classString(obj) {
			    return {}.toString.call(obj);
			}

			function copyDescriptors(from, to, filter) {
			    var keys = es5.names(from);
			    for (var i = 0; i < keys.length; ++i) {
			        var key = keys[i];
			        if (filter(key)) {
			            try {
			                es5.defineProperty(to, key, es5.getDescriptor(from, key));
			            } catch (ignore) {}
			        }
			    }
			}

			var asArray = function(v) {
			    if (es5.isArray(v)) {
			        return v;
			    }
			    return null;
			};

			if (typeof Symbol !== "undefined" && Symbol.iterator) {
			    var ArrayFrom = typeof Array.from === "function" ? function(v) {
			        return Array.from(v);
			    } : function(v) {
			        var ret = [];
			        var it = v[Symbol.iterator]();
			        var itResult;
			        while (!((itResult = it.next()).done)) {
			            ret.push(itResult.value);
			        }
			        return ret;
			    };

			    asArray = function(v) {
			        if (es5.isArray(v)) {
			            return v;
			        } else if (v != null && typeof v[Symbol.iterator] === "function") {
			            return ArrayFrom(v);
			        }
			        return null;
			    };
			}

			var isNode = typeof process !== "undefined" &&
			        classString(process).toLowerCase() === "[object process]";

			var hasEnvVariables = typeof process !== "undefined" &&
			    typeof process.env !== "undefined";

			function env(key) {
			    return hasEnvVariables ? process.env[key] : undefined;
			}

			function getNativePromise() {
			    if (typeof Promise === "function") {
			        try {
			            var promise = new Promise(function(){});
			            if (classString(promise) === "[object Promise]") {
			                return Promise;
			            }
			        } catch (e) {}
			    }
			}

			var reflectHandler;
			function contextBind(ctx, cb) {
			    if (ctx === null ||
			        typeof cb !== "function" ||
			        cb === reflectHandler) {
			        return cb;
			    }

			    if (ctx.domain !== null) {
			        cb = ctx.domain.bind(cb);
			    }

			    var async = ctx.async;
			    if (async !== null) {
			        var old = cb;
			        cb = function() {
			            var args = (new Array(2)).concat([].slice.call(arguments));		            args[0] = old;
			            args[1] = this;
			            return async.runInAsyncScope.apply(async, args);
			        };
			    }
			    return cb;
			}

			var ret = {
			    setReflectHandler: function(fn) {
			        reflectHandler = fn;
			    },
			    isClass: isClass,
			    isIdentifier: isIdentifier,
			    inheritedDataKeys: inheritedDataKeys,
			    getDataPropertyOrDefault: getDataPropertyOrDefault,
			    thrower: thrower,
			    isArray: es5.isArray,
			    asArray: asArray,
			    notEnumerableProp: notEnumerableProp,
			    isPrimitive: isPrimitive,
			    isObject: isObject,
			    isError: isError,
			    canEvaluate: canEvaluate,
			    errorObj: errorObj,
			    tryCatch: tryCatch,
			    inherits: inherits,
			    withAppended: withAppended,
			    maybeWrapAsError: maybeWrapAsError,
			    toFastProperties: toFastProperties,
			    filledRange: filledRange,
			    toString: safeToString,
			    canAttachTrace: canAttachTrace,
			    ensureErrorObject: ensureErrorObject,
			    originatesFromRejection: originatesFromRejection,
			    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
			    classString: classString,
			    copyDescriptors: copyDescriptors,
			    isNode: isNode,
			    hasEnvVariables: hasEnvVariables,
			    env: env,
			    global: globalObject,
			    getNativePromise: getNativePromise,
			    contextBind: contextBind
			};
			ret.isRecentNode = ret.isNode && (function() {
			    var version;
			    if (process.versions && process.versions.node) {
			        version = process.versions.node.split(".").map(Number);
			    } else if (process.version) {
			        version = process.version.split(".").map(Number);
			    }
			    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);
			})();
			ret.nodeSupportsAsyncResource = ret.isNode && (function() {
			    var supportsAsync = false;
			    try {
			        var res = _dereq_("async_hooks").AsyncResource;
			        supportsAsync = typeof res.prototype.runInAsyncScope === "function";
			    } catch (e) {
			        supportsAsync = false;
			    }
			    return supportsAsync;
			})();

			if (ret.isNode) ret.toFastProperties(process);

			try {throw new Error(); } catch (e) {ret.lastLineError = e;}
			module.exports = ret;

			},{"./es5":13,"async_hooks":undefined}]},{},[4])(4)
			});if (typeof window !== 'undefined' && window !== null) {                               window.P = window.Promise;                                                     } else if (typeof self !== 'undefined' && self !== null) {                             self.P = self.Promise;                                                         } 
		} (bluebird));
		return bluebird.exports;
	}

	var bluebirdExports = requireBluebird();

	/**
	 * Returns the first parameter if not undefined, otherwise the second parameter.
	 * Useful for setting a default value for a parameter.
	 *
	 * @function
	 *
	 * @param {*} a
	 * @param {*} b
	 * @returns {*} Returns the first parameter if not undefined, otherwise the second parameter.
	 *
	 * @example
	 * param = Cesium.defaultValue(param, 'default');
	 */
	function defaultValue(a, b) {
	  if (a !== undefined && a !== null) {
	    return a;
	  }
	  return b;
	}

	/**
	 * A frozen empty object that can be used as the default value for options passed as
	 * an object literal.
	 * @type {object}
	 * @memberof defaultValue
	 */
	defaultValue.EMPTY_OBJECT = Object.freeze({});

	/**
	 * @function
	 *
	 * @param {*} value The object.
	 * @returns {boolean} Returns true if the object is defined, returns false otherwise.
	 *
	 * @example
	 * if (Cesium.defined(positions)) {
	 *      doSomething();
	 * } else {
	 *      doSomethingElse();
	 * }
	 */
	function defined(value) {
	  return value !== undefined && value !== null;
	}

	/**
	 * Constructs an exception object that is thrown due to a developer error, e.g., invalid argument,
	 * argument out of range, etc.  This exception should only be thrown during development;
	 * it usually indicates a bug in the calling code.  This exception should never be
	 * caught; instead the calling code should strive not to generate it.
	 * <br /><br />
	 * On the other hand, a {@link RuntimeError} indicates an exception that may
	 * be thrown at runtime, e.g., out of memory, that the calling code should be prepared
	 * to catch.
	 *
	 * @alias DeveloperError
	 * @constructor
	 * @extends Error
	 *
	 * @param {string} [message] The error message for this exception.
	 *
	 * @see RuntimeError
	 */
	function DeveloperError(message) {
	  /**
	   * 'DeveloperError' indicating that this exception was thrown due to a developer error.
	   * @type {string}
	   * @readonly
	   */
	  this.name = "DeveloperError";

	  /**
	   * The explanation for why this exception was thrown.
	   * @type {string}
	   * @readonly
	   */
	  this.message = message;

	  //Browsers such as IE don't have a stack property until you actually throw the error.
	  let stack;
	  try {
	    throw new Error();
	  } catch (e) {
	    stack = e.stack;
	  }

	  /**
	   * The stack trace of this exception, if available.
	   * @type {string}
	   * @readonly
	   */
	  this.stack = stack;
	}

	if (defined(Object.create)) {
	  DeveloperError.prototype = Object.create(Error.prototype);
	  DeveloperError.prototype.constructor = DeveloperError;
	}

	DeveloperError.prototype.toString = function () {
	  let str = `${this.name}: ${this.message}`;

	  if (defined(this.stack)) {
	    str += `\n${this.stack.toString()}`;
	  }

	  return str;
	};

	/**
	 * @private
	 */
	DeveloperError.throwInstantiationError = function () {
	  throw new DeveloperError(
	    "This function defines an interface and should not be called directly.",
	  );
	};

	/**
	 * Enum containing WebGL Constant values by name.
	 * for use without an active WebGL context, or in cases where certain constants are unavailable using the WebGL context
	 * (For example, in [Safari 9]{@link https://github.com/CesiumGS/cesium/issues/2989}).
	 *
	 * These match the constants from the [WebGL 1.0]{@link https://www.khronos.org/registry/webgl/specs/latest/1.0/}
	 * and [WebGL 2.0]{@link https://www.khronos.org/registry/webgl/specs/latest/2.0/}
	 * specifications.
	 *
	 * @enum {number}
	 */
	const WebGLConstants = {
	  DEPTH_BUFFER_BIT: 0x00000100,
	  STENCIL_BUFFER_BIT: 0x00000400,
	  COLOR_BUFFER_BIT: 0x00004000,
	  POINTS: 0x0000,
	  LINES: 0x0001,
	  LINE_LOOP: 0x0002,
	  LINE_STRIP: 0x0003,
	  TRIANGLES: 0x0004,
	  TRIANGLE_STRIP: 0x0005,
	  TRIANGLE_FAN: 0x0006,
	  ZERO: 0,
	  ONE: 1,
	  SRC_COLOR: 0x0300,
	  ONE_MINUS_SRC_COLOR: 0x0301,
	  SRC_ALPHA: 0x0302,
	  ONE_MINUS_SRC_ALPHA: 0x0303,
	  DST_ALPHA: 0x0304,
	  ONE_MINUS_DST_ALPHA: 0x0305,
	  DST_COLOR: 0x0306,
	  ONE_MINUS_DST_COLOR: 0x0307,
	  SRC_ALPHA_SATURATE: 0x0308,
	  FUNC_ADD: 0x8006,
	  BLEND_EQUATION: 0x8009,
	  BLEND_EQUATION_RGB: 0x8009, // same as BLEND_EQUATION
	  BLEND_EQUATION_ALPHA: 0x883d,
	  FUNC_SUBTRACT: 0x800a,
	  FUNC_REVERSE_SUBTRACT: 0x800b,
	  BLEND_DST_RGB: 0x80c8,
	  BLEND_SRC_RGB: 0x80c9,
	  BLEND_DST_ALPHA: 0x80ca,
	  BLEND_SRC_ALPHA: 0x80cb,
	  CONSTANT_COLOR: 0x8001,
	  ONE_MINUS_CONSTANT_COLOR: 0x8002,
	  CONSTANT_ALPHA: 0x8003,
	  ONE_MINUS_CONSTANT_ALPHA: 0x8004,
	  BLEND_COLOR: 0x8005,
	  ARRAY_BUFFER: 0x8892,
	  ELEMENT_ARRAY_BUFFER: 0x8893,
	  ARRAY_BUFFER_BINDING: 0x8894,
	  ELEMENT_ARRAY_BUFFER_BINDING: 0x8895,
	  STREAM_DRAW: 0x88e0,
	  STATIC_DRAW: 0x88e4,
	  DYNAMIC_DRAW: 0x88e8,
	  BUFFER_SIZE: 0x8764,
	  BUFFER_USAGE: 0x8765,
	  CURRENT_VERTEX_ATTRIB: 0x8626,
	  FRONT: 0x0404,
	  BACK: 0x0405,
	  FRONT_AND_BACK: 0x0408,
	  CULL_FACE: 0x0b44,
	  BLEND: 0x0be2,
	  DITHER: 0x0bd0,
	  STENCIL_TEST: 0x0b90,
	  DEPTH_TEST: 0x0b71,
	  SCISSOR_TEST: 0x0c11,
	  POLYGON_OFFSET_FILL: 0x8037,
	  SAMPLE_ALPHA_TO_COVERAGE: 0x809e,
	  SAMPLE_COVERAGE: 0x80a0,
	  NO_ERROR: 0,
	  INVALID_ENUM: 0x0500,
	  INVALID_VALUE: 0x0501,
	  INVALID_OPERATION: 0x0502,
	  OUT_OF_MEMORY: 0x0505,
	  CW: 0x0900,
	  CCW: 0x0901,
	  LINE_WIDTH: 0x0b21,
	  ALIASED_POINT_SIZE_RANGE: 0x846d,
	  ALIASED_LINE_WIDTH_RANGE: 0x846e,
	  CULL_FACE_MODE: 0x0b45,
	  FRONT_FACE: 0x0b46,
	  DEPTH_RANGE: 0x0b70,
	  DEPTH_WRITEMASK: 0x0b72,
	  DEPTH_CLEAR_VALUE: 0x0b73,
	  DEPTH_FUNC: 0x0b74,
	  STENCIL_CLEAR_VALUE: 0x0b91,
	  STENCIL_FUNC: 0x0b92,
	  STENCIL_FAIL: 0x0b94,
	  STENCIL_PASS_DEPTH_FAIL: 0x0b95,
	  STENCIL_PASS_DEPTH_PASS: 0x0b96,
	  STENCIL_REF: 0x0b97,
	  STENCIL_VALUE_MASK: 0x0b93,
	  STENCIL_WRITEMASK: 0x0b98,
	  STENCIL_BACK_FUNC: 0x8800,
	  STENCIL_BACK_FAIL: 0x8801,
	  STENCIL_BACK_PASS_DEPTH_FAIL: 0x8802,
	  STENCIL_BACK_PASS_DEPTH_PASS: 0x8803,
	  STENCIL_BACK_REF: 0x8ca3,
	  STENCIL_BACK_VALUE_MASK: 0x8ca4,
	  STENCIL_BACK_WRITEMASK: 0x8ca5,
	  VIEWPORT: 0x0ba2,
	  SCISSOR_BOX: 0x0c10,
	  COLOR_CLEAR_VALUE: 0x0c22,
	  COLOR_WRITEMASK: 0x0c23,
	  UNPACK_ALIGNMENT: 0x0cf5,
	  PACK_ALIGNMENT: 0x0d05,
	  MAX_TEXTURE_SIZE: 0x0d33,
	  MAX_VIEWPORT_DIMS: 0x0d3a,
	  SUBPIXEL_BITS: 0x0d50,
	  RED_BITS: 0x0d52,
	  GREEN_BITS: 0x0d53,
	  BLUE_BITS: 0x0d54,
	  ALPHA_BITS: 0x0d55,
	  DEPTH_BITS: 0x0d56,
	  STENCIL_BITS: 0x0d57,
	  POLYGON_OFFSET_UNITS: 0x2a00,
	  POLYGON_OFFSET_FACTOR: 0x8038,
	  TEXTURE_BINDING_2D: 0x8069,
	  SAMPLE_BUFFERS: 0x80a8,
	  SAMPLES: 0x80a9,
	  SAMPLE_COVERAGE_VALUE: 0x80aa,
	  SAMPLE_COVERAGE_INVERT: 0x80ab,
	  COMPRESSED_TEXTURE_FORMATS: 0x86a3,
	  DONT_CARE: 0x1100,
	  FASTEST: 0x1101,
	  NICEST: 0x1102,
	  GENERATE_MIPMAP_HINT: 0x8192,
	  BYTE: 0x1400,
	  UNSIGNED_BYTE: 0x1401,
	  SHORT: 0x1402,
	  UNSIGNED_SHORT: 0x1403,
	  INT: 0x1404,
	  UNSIGNED_INT: 0x1405,
	  FLOAT: 0x1406,
	  DEPTH_COMPONENT: 0x1902,
	  ALPHA: 0x1906,
	  RGB: 0x1907,
	  RGBA: 0x1908,
	  LUMINANCE: 0x1909,
	  LUMINANCE_ALPHA: 0x190a,
	  UNSIGNED_SHORT_4_4_4_4: 0x8033,
	  UNSIGNED_SHORT_5_5_5_1: 0x8034,
	  UNSIGNED_SHORT_5_6_5: 0x8363,
	  FRAGMENT_SHADER: 0x8b30,
	  VERTEX_SHADER: 0x8b31,
	  MAX_VERTEX_ATTRIBS: 0x8869,
	  MAX_VERTEX_UNIFORM_VECTORS: 0x8dfb,
	  MAX_VARYING_VECTORS: 0x8dfc,
	  MAX_COMBINED_TEXTURE_IMAGE_UNITS: 0x8b4d,
	  MAX_VERTEX_TEXTURE_IMAGE_UNITS: 0x8b4c,
	  MAX_TEXTURE_IMAGE_UNITS: 0x8872,
	  MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd,
	  SHADER_TYPE: 0x8b4f,
	  DELETE_STATUS: 0x8b80,
	  LINK_STATUS: 0x8b82,
	  VALIDATE_STATUS: 0x8b83,
	  ATTACHED_SHADERS: 0x8b85,
	  ACTIVE_UNIFORMS: 0x8b86,
	  ACTIVE_ATTRIBUTES: 0x8b89,
	  SHADING_LANGUAGE_VERSION: 0x8b8c,
	  CURRENT_PROGRAM: 0x8b8d,
	  NEVER: 0x0200,
	  LESS: 0x0201,
	  EQUAL: 0x0202,
	  LEQUAL: 0x0203,
	  GREATER: 0x0204,
	  NOTEQUAL: 0x0205,
	  GEQUAL: 0x0206,
	  ALWAYS: 0x0207,
	  KEEP: 0x1e00,
	  REPLACE: 0x1e01,
	  INCR: 0x1e02,
	  DECR: 0x1e03,
	  INVERT: 0x150a,
	  INCR_WRAP: 0x8507,
	  DECR_WRAP: 0x8508,
	  VENDOR: 0x1f00,
	  RENDERER: 0x1f01,
	  VERSION: 0x1f02,
	  NEAREST: 0x2600,
	  LINEAR: 0x2601,
	  NEAREST_MIPMAP_NEAREST: 0x2700,
	  LINEAR_MIPMAP_NEAREST: 0x2701,
	  NEAREST_MIPMAP_LINEAR: 0x2702,
	  LINEAR_MIPMAP_LINEAR: 0x2703,
	  TEXTURE_MAG_FILTER: 0x2800,
	  TEXTURE_MIN_FILTER: 0x2801,
	  TEXTURE_WRAP_S: 0x2802,
	  TEXTURE_WRAP_T: 0x2803,
	  TEXTURE_2D: 0x0de1,
	  TEXTURE: 0x1702,
	  TEXTURE_CUBE_MAP: 0x8513,
	  TEXTURE_BINDING_CUBE_MAP: 0x8514,
	  TEXTURE_CUBE_MAP_POSITIVE_X: 0x8515,
	  TEXTURE_CUBE_MAP_NEGATIVE_X: 0x8516,
	  TEXTURE_CUBE_MAP_POSITIVE_Y: 0x8517,
	  TEXTURE_CUBE_MAP_NEGATIVE_Y: 0x8518,
	  TEXTURE_CUBE_MAP_POSITIVE_Z: 0x8519,
	  TEXTURE_CUBE_MAP_NEGATIVE_Z: 0x851a,
	  MAX_CUBE_MAP_TEXTURE_SIZE: 0x851c,
	  TEXTURE0: 0x84c0,
	  TEXTURE1: 0x84c1,
	  TEXTURE2: 0x84c2,
	  TEXTURE3: 0x84c3,
	  TEXTURE4: 0x84c4,
	  TEXTURE5: 0x84c5,
	  TEXTURE6: 0x84c6,
	  TEXTURE7: 0x84c7,
	  TEXTURE8: 0x84c8,
	  TEXTURE9: 0x84c9,
	  TEXTURE10: 0x84ca,
	  TEXTURE11: 0x84cb,
	  TEXTURE12: 0x84cc,
	  TEXTURE13: 0x84cd,
	  TEXTURE14: 0x84ce,
	  TEXTURE15: 0x84cf,
	  TEXTURE16: 0x84d0,
	  TEXTURE17: 0x84d1,
	  TEXTURE18: 0x84d2,
	  TEXTURE19: 0x84d3,
	  TEXTURE20: 0x84d4,
	  TEXTURE21: 0x84d5,
	  TEXTURE22: 0x84d6,
	  TEXTURE23: 0x84d7,
	  TEXTURE24: 0x84d8,
	  TEXTURE25: 0x84d9,
	  TEXTURE26: 0x84da,
	  TEXTURE27: 0x84db,
	  TEXTURE28: 0x84dc,
	  TEXTURE29: 0x84dd,
	  TEXTURE30: 0x84de,
	  TEXTURE31: 0x84df,
	  ACTIVE_TEXTURE: 0x84e0,
	  REPEAT: 0x2901,
	  CLAMP_TO_EDGE: 0x812f,
	  MIRRORED_REPEAT: 0x8370,
	  FLOAT_VEC2: 0x8b50,
	  FLOAT_VEC3: 0x8b51,
	  FLOAT_VEC4: 0x8b52,
	  INT_VEC2: 0x8b53,
	  INT_VEC3: 0x8b54,
	  INT_VEC4: 0x8b55,
	  BOOL: 0x8b56,
	  BOOL_VEC2: 0x8b57,
	  BOOL_VEC3: 0x8b58,
	  BOOL_VEC4: 0x8b59,
	  FLOAT_MAT2: 0x8b5a,
	  FLOAT_MAT3: 0x8b5b,
	  FLOAT_MAT4: 0x8b5c,
	  SAMPLER_2D: 0x8b5e,
	  SAMPLER_CUBE: 0x8b60,
	  VERTEX_ATTRIB_ARRAY_ENABLED: 0x8622,
	  VERTEX_ATTRIB_ARRAY_SIZE: 0x8623,
	  VERTEX_ATTRIB_ARRAY_STRIDE: 0x8624,
	  VERTEX_ATTRIB_ARRAY_TYPE: 0x8625,
	  VERTEX_ATTRIB_ARRAY_NORMALIZED: 0x886a,
	  VERTEX_ATTRIB_ARRAY_POINTER: 0x8645,
	  VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 0x889f,
	  IMPLEMENTATION_COLOR_READ_TYPE: 0x8b9a,
	  IMPLEMENTATION_COLOR_READ_FORMAT: 0x8b9b,
	  COMPILE_STATUS: 0x8b81,
	  LOW_FLOAT: 0x8df0,
	  MEDIUM_FLOAT: 0x8df1,
	  HIGH_FLOAT: 0x8df2,
	  LOW_INT: 0x8df3,
	  MEDIUM_INT: 0x8df4,
	  HIGH_INT: 0x8df5,
	  FRAMEBUFFER: 0x8d40,
	  RENDERBUFFER: 0x8d41,
	  RGBA4: 0x8056,
	  RGB5_A1: 0x8057,
	  RGB565: 0x8d62,
	  DEPTH_COMPONENT16: 0x81a5,
	  STENCIL_INDEX: 0x1901,
	  STENCIL_INDEX8: 0x8d48,
	  DEPTH_STENCIL: 0x84f9,
	  RENDERBUFFER_WIDTH: 0x8d42,
	  RENDERBUFFER_HEIGHT: 0x8d43,
	  RENDERBUFFER_INTERNAL_FORMAT: 0x8d44,
	  RENDERBUFFER_RED_SIZE: 0x8d50,
	  RENDERBUFFER_GREEN_SIZE: 0x8d51,
	  RENDERBUFFER_BLUE_SIZE: 0x8d52,
	  RENDERBUFFER_ALPHA_SIZE: 0x8d53,
	  RENDERBUFFER_DEPTH_SIZE: 0x8d54,
	  RENDERBUFFER_STENCIL_SIZE: 0x8d55,
	  FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 0x8cd0,
	  FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 0x8cd1,
	  FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 0x8cd2,
	  FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 0x8cd3,
	  COLOR_ATTACHMENT0: 0x8ce0,
	  DEPTH_ATTACHMENT: 0x8d00,
	  STENCIL_ATTACHMENT: 0x8d20,
	  DEPTH_STENCIL_ATTACHMENT: 0x821a,
	  NONE: 0,
	  FRAMEBUFFER_COMPLETE: 0x8cd5,
	  FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 0x8cd6,
	  FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 0x8cd7,
	  FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 0x8cd9,
	  FRAMEBUFFER_UNSUPPORTED: 0x8cdd,
	  FRAMEBUFFER_BINDING: 0x8ca6,
	  RENDERBUFFER_BINDING: 0x8ca7,
	  MAX_RENDERBUFFER_SIZE: 0x84e8,
	  INVALID_FRAMEBUFFER_OPERATION: 0x0506,
	  UNPACK_FLIP_Y_WEBGL: 0x9240,
	  UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0x9241,
	  CONTEXT_LOST_WEBGL: 0x9242,
	  UNPACK_COLORSPACE_CONVERSION_WEBGL: 0x9243,
	  BROWSER_DEFAULT_WEBGL: 0x9244,

	  // WEBGL_compressed_texture_s3tc
	  COMPRESSED_RGB_S3TC_DXT1_EXT: 0x83f0,
	  COMPRESSED_RGBA_S3TC_DXT1_EXT: 0x83f1,
	  COMPRESSED_RGBA_S3TC_DXT3_EXT: 0x83f2,
	  COMPRESSED_RGBA_S3TC_DXT5_EXT: 0x83f3,

	  // WEBGL_compressed_texture_pvrtc
	  COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 0x8c00,
	  COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 0x8c01,
	  COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 0x8c02,
	  COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 0x8c03,

	  // WEBGL_compressed_texture_astc
	  COMPRESSED_RGBA_ASTC_4x4_WEBGL: 0x93b0,

	  // WEBGL_compressed_texture_etc1
	  COMPRESSED_RGB_ETC1_WEBGL: 0x8d64,

	  // EXT_texture_compression_bptc
	  COMPRESSED_RGBA_BPTC_UNORM: 0x8e8c,

	  // EXT_color_buffer_half_float
	  HALF_FLOAT_OES: 0x8d61,

	  // Desktop OpenGL
	  DOUBLE: 0x140a,

	  // WebGL 2
	  READ_BUFFER: 0x0c02,
	  UNPACK_ROW_LENGTH: 0x0cf2,
	  UNPACK_SKIP_ROWS: 0x0cf3,
	  UNPACK_SKIP_PIXELS: 0x0cf4,
	  PACK_ROW_LENGTH: 0x0d02,
	  PACK_SKIP_ROWS: 0x0d03,
	  PACK_SKIP_PIXELS: 0x0d04,
	  COLOR: 0x1800,
	  DEPTH: 0x1801,
	  STENCIL: 0x1802,
	  RED: 0x1903,
	  RGB8: 0x8051,
	  RGBA8: 0x8058,
	  RGB10_A2: 0x8059,
	  TEXTURE_BINDING_3D: 0x806a,
	  UNPACK_SKIP_IMAGES: 0x806d,
	  UNPACK_IMAGE_HEIGHT: 0x806e,
	  TEXTURE_3D: 0x806f,
	  TEXTURE_WRAP_R: 0x8072,
	  MAX_3D_TEXTURE_SIZE: 0x8073,
	  UNSIGNED_INT_2_10_10_10_REV: 0x8368,
	  MAX_ELEMENTS_VERTICES: 0x80e8,
	  MAX_ELEMENTS_INDICES: 0x80e9,
	  TEXTURE_MIN_LOD: 0x813a,
	  TEXTURE_MAX_LOD: 0x813b,
	  TEXTURE_BASE_LEVEL: 0x813c,
	  TEXTURE_MAX_LEVEL: 0x813d,
	  MIN: 0x8007,
	  MAX: 0x8008,
	  DEPTH_COMPONENT24: 0x81a6,
	  MAX_TEXTURE_LOD_BIAS: 0x84fd,
	  TEXTURE_COMPARE_MODE: 0x884c,
	  TEXTURE_COMPARE_FUNC: 0x884d,
	  CURRENT_QUERY: 0x8865,
	  QUERY_RESULT: 0x8866,
	  QUERY_RESULT_AVAILABLE: 0x8867,
	  STREAM_READ: 0x88e1,
	  STREAM_COPY: 0x88e2,
	  STATIC_READ: 0x88e5,
	  STATIC_COPY: 0x88e6,
	  DYNAMIC_READ: 0x88e9,
	  DYNAMIC_COPY: 0x88ea,
	  MAX_DRAW_BUFFERS: 0x8824,
	  DRAW_BUFFER0: 0x8825,
	  DRAW_BUFFER1: 0x8826,
	  DRAW_BUFFER2: 0x8827,
	  DRAW_BUFFER3: 0x8828,
	  DRAW_BUFFER4: 0x8829,
	  DRAW_BUFFER5: 0x882a,
	  DRAW_BUFFER6: 0x882b,
	  DRAW_BUFFER7: 0x882c,
	  DRAW_BUFFER8: 0x882d,
	  DRAW_BUFFER9: 0x882e,
	  DRAW_BUFFER10: 0x882f,
	  DRAW_BUFFER11: 0x8830,
	  DRAW_BUFFER12: 0x8831,
	  DRAW_BUFFER13: 0x8832,
	  DRAW_BUFFER14: 0x8833,
	  DRAW_BUFFER15: 0x8834,
	  MAX_FRAGMENT_UNIFORM_COMPONENTS: 0x8b49,
	  MAX_VERTEX_UNIFORM_COMPONENTS: 0x8b4a,
	  SAMPLER_3D: 0x8b5f,
	  SAMPLER_2D_SHADOW: 0x8b62,
	  FRAGMENT_SHADER_DERIVATIVE_HINT: 0x8b8b,
	  PIXEL_PACK_BUFFER: 0x88eb,
	  PIXEL_UNPACK_BUFFER: 0x88ec,
	  PIXEL_PACK_BUFFER_BINDING: 0x88ed,
	  PIXEL_UNPACK_BUFFER_BINDING: 0x88ef,
	  FLOAT_MAT2x3: 0x8b65,
	  FLOAT_MAT2x4: 0x8b66,
	  FLOAT_MAT3x2: 0x8b67,
	  FLOAT_MAT3x4: 0x8b68,
	  FLOAT_MAT4x2: 0x8b69,
	  FLOAT_MAT4x3: 0x8b6a,
	  SRGB: 0x8c40,
	  SRGB8: 0x8c41,
	  SRGB8_ALPHA8: 0x8c43,
	  COMPARE_REF_TO_TEXTURE: 0x884e,
	  RGBA32F: 0x8814,
	  RGB32F: 0x8815,
	  RGBA16F: 0x881a,
	  RGB16F: 0x881b,
	  VERTEX_ATTRIB_ARRAY_INTEGER: 0x88fd,
	  MAX_ARRAY_TEXTURE_LAYERS: 0x88ff,
	  MIN_PROGRAM_TEXEL_OFFSET: 0x8904,
	  MAX_PROGRAM_TEXEL_OFFSET: 0x8905,
	  MAX_VARYING_COMPONENTS: 0x8b4b,
	  TEXTURE_2D_ARRAY: 0x8c1a,
	  TEXTURE_BINDING_2D_ARRAY: 0x8c1d,
	  R11F_G11F_B10F: 0x8c3a,
	  UNSIGNED_INT_10F_11F_11F_REV: 0x8c3b,
	  RGB9_E5: 0x8c3d,
	  UNSIGNED_INT_5_9_9_9_REV: 0x8c3e,
	  TRANSFORM_FEEDBACK_BUFFER_MODE: 0x8c7f,
	  MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: 0x8c80,
	  TRANSFORM_FEEDBACK_VARYINGS: 0x8c83,
	  TRANSFORM_FEEDBACK_BUFFER_START: 0x8c84,
	  TRANSFORM_FEEDBACK_BUFFER_SIZE: 0x8c85,
	  TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: 0x8c88,
	  RASTERIZER_DISCARD: 0x8c89,
	  MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: 0x8c8a,
	  MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: 0x8c8b,
	  INTERLEAVED_ATTRIBS: 0x8c8c,
	  SEPARATE_ATTRIBS: 0x8c8d,
	  TRANSFORM_FEEDBACK_BUFFER: 0x8c8e,
	  TRANSFORM_FEEDBACK_BUFFER_BINDING: 0x8c8f,
	  RGBA32UI: 0x8d70,
	  RGB32UI: 0x8d71,
	  RGBA16UI: 0x8d76,
	  RGB16UI: 0x8d77,
	  RGBA8UI: 0x8d7c,
	  RGB8UI: 0x8d7d,
	  RGBA32I: 0x8d82,
	  RGB32I: 0x8d83,
	  RGBA16I: 0x8d88,
	  RGB16I: 0x8d89,
	  RGBA8I: 0x8d8e,
	  RGB8I: 0x8d8f,
	  RED_INTEGER: 0x8d94,
	  RGB_INTEGER: 0x8d98,
	  RGBA_INTEGER: 0x8d99,
	  SAMPLER_2D_ARRAY: 0x8dc1,
	  SAMPLER_2D_ARRAY_SHADOW: 0x8dc4,
	  SAMPLER_CUBE_SHADOW: 0x8dc5,
	  UNSIGNED_INT_VEC2: 0x8dc6,
	  UNSIGNED_INT_VEC3: 0x8dc7,
	  UNSIGNED_INT_VEC4: 0x8dc8,
	  INT_SAMPLER_2D: 0x8dca,
	  INT_SAMPLER_3D: 0x8dcb,
	  INT_SAMPLER_CUBE: 0x8dcc,
	  INT_SAMPLER_2D_ARRAY: 0x8dcf,
	  UNSIGNED_INT_SAMPLER_2D: 0x8dd2,
	  UNSIGNED_INT_SAMPLER_3D: 0x8dd3,
	  UNSIGNED_INT_SAMPLER_CUBE: 0x8dd4,
	  UNSIGNED_INT_SAMPLER_2D_ARRAY: 0x8dd7,
	  DEPTH_COMPONENT32F: 0x8cac,
	  DEPTH32F_STENCIL8: 0x8cad,
	  FLOAT_32_UNSIGNED_INT_24_8_REV: 0x8dad,
	  FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: 0x8210,
	  FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: 0x8211,
	  FRAMEBUFFER_ATTACHMENT_RED_SIZE: 0x8212,
	  FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: 0x8213,
	  FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: 0x8214,
	  FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: 0x8215,
	  FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: 0x8216,
	  FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: 0x8217,
	  FRAMEBUFFER_DEFAULT: 0x8218,
	  UNSIGNED_INT_24_8: 0x84fa,
	  DEPTH24_STENCIL8: 0x88f0,
	  UNSIGNED_NORMALIZED: 0x8c17,
	  DRAW_FRAMEBUFFER_BINDING: 0x8ca6, // Same as FRAMEBUFFER_BINDING
	  READ_FRAMEBUFFER: 0x8ca8,
	  DRAW_FRAMEBUFFER: 0x8ca9,
	  READ_FRAMEBUFFER_BINDING: 0x8caa,
	  RENDERBUFFER_SAMPLES: 0x8cab,
	  FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: 0x8cd4,
	  MAX_COLOR_ATTACHMENTS: 0x8cdf,
	  COLOR_ATTACHMENT1: 0x8ce1,
	  COLOR_ATTACHMENT2: 0x8ce2,
	  COLOR_ATTACHMENT3: 0x8ce3,
	  COLOR_ATTACHMENT4: 0x8ce4,
	  COLOR_ATTACHMENT5: 0x8ce5,
	  COLOR_ATTACHMENT6: 0x8ce6,
	  COLOR_ATTACHMENT7: 0x8ce7,
	  COLOR_ATTACHMENT8: 0x8ce8,
	  COLOR_ATTACHMENT9: 0x8ce9,
	  COLOR_ATTACHMENT10: 0x8cea,
	  COLOR_ATTACHMENT11: 0x8ceb,
	  COLOR_ATTACHMENT12: 0x8cec,
	  COLOR_ATTACHMENT13: 0x8ced,
	  COLOR_ATTACHMENT14: 0x8cee,
	  COLOR_ATTACHMENT15: 0x8cef,
	  FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: 0x8d56,
	  MAX_SAMPLES: 0x8d57,
	  HALF_FLOAT: 0x140b,
	  RG: 0x8227,
	  RG_INTEGER: 0x8228,
	  R8: 0x8229,
	  RG8: 0x822b,
	  R16F: 0x822d,
	  R32F: 0x822e,
	  RG16F: 0x822f,
	  RG32F: 0x8230,
	  R8I: 0x8231,
	  R8UI: 0x8232,
	  R16I: 0x8233,
	  R16UI: 0x8234,
	  R32I: 0x8235,
	  R32UI: 0x8236,
	  RG8I: 0x8237,
	  RG8UI: 0x8238,
	  RG16I: 0x8239,
	  RG16UI: 0x823a,
	  RG32I: 0x823b,
	  RG32UI: 0x823c,
	  VERTEX_ARRAY_BINDING: 0x85b5,
	  R8_SNORM: 0x8f94,
	  RG8_SNORM: 0x8f95,
	  RGB8_SNORM: 0x8f96,
	  RGBA8_SNORM: 0x8f97,
	  SIGNED_NORMALIZED: 0x8f9c,
	  COPY_READ_BUFFER: 0x8f36,
	  COPY_WRITE_BUFFER: 0x8f37,
	  COPY_READ_BUFFER_BINDING: 0x8f36, // Same as COPY_READ_BUFFER
	  COPY_WRITE_BUFFER_BINDING: 0x8f37, // Same as COPY_WRITE_BUFFER
	  UNIFORM_BUFFER: 0x8a11,
	  UNIFORM_BUFFER_BINDING: 0x8a28,
	  UNIFORM_BUFFER_START: 0x8a29,
	  UNIFORM_BUFFER_SIZE: 0x8a2a,
	  MAX_VERTEX_UNIFORM_BLOCKS: 0x8a2b,
	  MAX_FRAGMENT_UNIFORM_BLOCKS: 0x8a2d,
	  MAX_COMBINED_UNIFORM_BLOCKS: 0x8a2e,
	  MAX_UNIFORM_BUFFER_BINDINGS: 0x8a2f,
	  MAX_UNIFORM_BLOCK_SIZE: 0x8a30,
	  MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: 0x8a31,
	  MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: 0x8a33,
	  UNIFORM_BUFFER_OFFSET_ALIGNMENT: 0x8a34,
	  ACTIVE_UNIFORM_BLOCKS: 0x8a36,
	  UNIFORM_TYPE: 0x8a37,
	  UNIFORM_SIZE: 0x8a38,
	  UNIFORM_BLOCK_INDEX: 0x8a3a,
	  UNIFORM_OFFSET: 0x8a3b,
	  UNIFORM_ARRAY_STRIDE: 0x8a3c,
	  UNIFORM_MATRIX_STRIDE: 0x8a3d,
	  UNIFORM_IS_ROW_MAJOR: 0x8a3e,
	  UNIFORM_BLOCK_BINDING: 0x8a3f,
	  UNIFORM_BLOCK_DATA_SIZE: 0x8a40,
	  UNIFORM_BLOCK_ACTIVE_UNIFORMS: 0x8a42,
	  UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: 0x8a43,
	  UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: 0x8a44,
	  UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: 0x8a46,
	  INVALID_INDEX: 0xffffffff,
	  MAX_VERTEX_OUTPUT_COMPONENTS: 0x9122,
	  MAX_FRAGMENT_INPUT_COMPONENTS: 0x9125,
	  MAX_SERVER_WAIT_TIMEOUT: 0x9111,
	  OBJECT_TYPE: 0x9112,
	  SYNC_CONDITION: 0x9113,
	  SYNC_STATUS: 0x9114,
	  SYNC_FLAGS: 0x9115,
	  SYNC_FENCE: 0x9116,
	  SYNC_GPU_COMMANDS_COMPLETE: 0x9117,
	  UNSIGNALED: 0x9118,
	  SIGNALED: 0x9119,
	  ALREADY_SIGNALED: 0x911a,
	  TIMEOUT_EXPIRED: 0x911b,
	  CONDITION_SATISFIED: 0x911c,
	  WAIT_FAILED: 0x911d,
	  SYNC_FLUSH_COMMANDS_BIT: 0x00000001,
	  VERTEX_ATTRIB_ARRAY_DIVISOR: 0x88fe,
	  ANY_SAMPLES_PASSED: 0x8c2f,
	  ANY_SAMPLES_PASSED_CONSERVATIVE: 0x8d6a,
	  SAMPLER_BINDING: 0x8919,
	  RGB10_A2UI: 0x906f,
	  INT_2_10_10_10_REV: 0x8d9f,
	  TRANSFORM_FEEDBACK: 0x8e22,
	  TRANSFORM_FEEDBACK_PAUSED: 0x8e23,
	  TRANSFORM_FEEDBACK_ACTIVE: 0x8e24,
	  TRANSFORM_FEEDBACK_BINDING: 0x8e25,
	  COMPRESSED_R11_EAC: 0x9270,
	  COMPRESSED_SIGNED_R11_EAC: 0x9271,
	  COMPRESSED_RG11_EAC: 0x9272,
	  COMPRESSED_SIGNED_RG11_EAC: 0x9273,
	  COMPRESSED_RGB8_ETC2: 0x9274,
	  COMPRESSED_SRGB8_ETC2: 0x9275,
	  COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9276,
	  COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9277,
	  COMPRESSED_RGBA8_ETC2_EAC: 0x9278,
	  COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 0x9279,
	  TEXTURE_IMMUTABLE_FORMAT: 0x912f,
	  MAX_ELEMENT_INDEX: 0x8d6b,
	  TEXTURE_IMMUTABLE_LEVELS: 0x82df,

	  // Extensions
	  MAX_TEXTURE_MAX_ANISOTROPY_EXT: 0x84ff,
	};
	var WebGLConstants$1 = Object.freeze(WebGLConstants);

	/**
	 * WebGL component datatypes.  Components are intrinsics,
	 * which form attributes, which form vertices.
	 *
	 * @enum {number}
	 */
	const ComponentDatatype = {
	  /**
	   * 8-bit signed byte corresponding to <code>gl.BYTE</code> and the type
	   * of an element in <code>Int8Array</code>.
	   *
	   * @type {number}
	   * @constant
	   */
	  BYTE: WebGLConstants$1.BYTE,

	  /**
	   * 8-bit unsigned byte corresponding to <code>UNSIGNED_BYTE</code> and the type
	   * of an element in <code>Uint8Array</code>.
	   *
	   * @type {number}
	   * @constant
	   */
	  UNSIGNED_BYTE: WebGLConstants$1.UNSIGNED_BYTE,

	  /**
	   * 16-bit signed short corresponding to <code>SHORT</code> and the type
	   * of an element in <code>Int16Array</code>.
	   *
	   * @type {number}
	   * @constant
	   */
	  SHORT: WebGLConstants$1.SHORT,

	  /**
	   * 16-bit unsigned short corresponding to <code>UNSIGNED_SHORT</code> and the type
	   * of an element in <code>Uint16Array</code>.
	   *
	   * @type {number}
	   * @constant
	   */
	  UNSIGNED_SHORT: WebGLConstants$1.UNSIGNED_SHORT,

	  /**
	   * 32-bit signed int corresponding to <code>INT</code> and the type
	   * of an element in <code>Int32Array</code>.
	   *
	   * @memberOf ComponentDatatype
	   *
	   * @type {number}
	   * @constant
	   */
	  INT: WebGLConstants$1.INT,

	  /**
	   * 32-bit unsigned int corresponding to <code>UNSIGNED_INT</code> and the type
	   * of an element in <code>Uint32Array</code>.
	   *
	   * @memberOf ComponentDatatype
	   *
	   * @type {number}
	   * @constant
	   */
	  UNSIGNED_INT: WebGLConstants$1.UNSIGNED_INT,

	  /**
	   * 32-bit floating-point corresponding to <code>FLOAT</code> and the type
	   * of an element in <code>Float32Array</code>.
	   *
	   * @type {number}
	   * @constant
	   */
	  FLOAT: WebGLConstants$1.FLOAT,

	  /**
	   * 64-bit floating-point corresponding to <code>gl.DOUBLE</code> (in Desktop OpenGL;
	   * this is not supported in WebGL, and is emulated in Cesium via {@link GeometryPipeline.encodeAttribute})
	   * and the type of an element in <code>Float64Array</code>.
	   *
	   * @memberOf ComponentDatatype
	   *
	   * @type {number}
	   * @constant
	   * @default 0x140A
	   */
	  DOUBLE: WebGLConstants$1.DOUBLE,
	};

	/**
	 * Returns the size, in bytes, of the corresponding datatype.
	 *
	 * @param {ComponentDatatype} componentDatatype The component datatype to get the size of.
	 * @returns {number} The size in bytes.
	 *
	 * @exception {DeveloperError} componentDatatype is not a valid value.
	 *
	 * @example
	 * // Returns Int8Array.BYTES_PER_ELEMENT
	 * const size = Cesium.ComponentDatatype.getSizeInBytes(Cesium.ComponentDatatype.BYTE);
	 */
	ComponentDatatype.getSizeInBytes = function (componentDatatype) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(componentDatatype)) {
	    throw new DeveloperError("value is required.");
	  }
	  //>>includeEnd('debug');

	  switch (componentDatatype) {
	    case ComponentDatatype.BYTE:
	      return Int8Array.BYTES_PER_ELEMENT;
	    case ComponentDatatype.UNSIGNED_BYTE:
	      return Uint8Array.BYTES_PER_ELEMENT;
	    case ComponentDatatype.SHORT:
	      return Int16Array.BYTES_PER_ELEMENT;
	    case ComponentDatatype.UNSIGNED_SHORT:
	      return Uint16Array.BYTES_PER_ELEMENT;
	    case ComponentDatatype.INT:
	      return Int32Array.BYTES_PER_ELEMENT;
	    case ComponentDatatype.UNSIGNED_INT:
	      return Uint32Array.BYTES_PER_ELEMENT;
	    case ComponentDatatype.FLOAT:
	      return Float32Array.BYTES_PER_ELEMENT;
	    case ComponentDatatype.DOUBLE:
	      return Float64Array.BYTES_PER_ELEMENT;
	    //>>includeStart('debug', pragmas.debug);
	    default:
	      throw new DeveloperError("componentDatatype is not a valid value.");
	    //>>includeEnd('debug');
	  }
	};

	/**
	 * Gets the {@link ComponentDatatype} for the provided TypedArray instance.
	 *
	 * @param {Int8Array|Uint8Array|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} array The typed array.
	 * @returns {ComponentDatatype} The ComponentDatatype for the provided array, or undefined if the array is not a TypedArray.
	 */
	ComponentDatatype.fromTypedArray = function (array) {
	  if (array instanceof Int8Array) {
	    return ComponentDatatype.BYTE;
	  }
	  if (array instanceof Uint8Array) {
	    return ComponentDatatype.UNSIGNED_BYTE;
	  }
	  if (array instanceof Int16Array) {
	    return ComponentDatatype.SHORT;
	  }
	  if (array instanceof Uint16Array) {
	    return ComponentDatatype.UNSIGNED_SHORT;
	  }
	  if (array instanceof Int32Array) {
	    return ComponentDatatype.INT;
	  }
	  if (array instanceof Uint32Array) {
	    return ComponentDatatype.UNSIGNED_INT;
	  }
	  if (array instanceof Float32Array) {
	    return ComponentDatatype.FLOAT;
	  }
	  if (array instanceof Float64Array) {
	    return ComponentDatatype.DOUBLE;
	  }

	  //>>includeStart('debug', pragmas.debug);
	  throw new DeveloperError(
	    "array must be an Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, or Float64Array.",
	  );
	  //>>includeEnd('debug');
	};

	/**
	 * Validates that the provided component datatype is a valid {@link ComponentDatatype}
	 *
	 * @param {ComponentDatatype} componentDatatype The component datatype to validate.
	 * @returns {boolean} <code>true</code> if the provided component datatype is a valid value; otherwise, <code>false</code>.
	 *
	 * @example
	 * if (!Cesium.ComponentDatatype.validate(componentDatatype)) {
	 *   throw new Cesium.DeveloperError('componentDatatype must be a valid value.');
	 * }
	 */
	ComponentDatatype.validate = function (componentDatatype) {
	  return (
	    defined(componentDatatype) &&
	    (componentDatatype === ComponentDatatype.BYTE ||
	      componentDatatype === ComponentDatatype.UNSIGNED_BYTE ||
	      componentDatatype === ComponentDatatype.SHORT ||
	      componentDatatype === ComponentDatatype.UNSIGNED_SHORT ||
	      componentDatatype === ComponentDatatype.INT ||
	      componentDatatype === ComponentDatatype.UNSIGNED_INT ||
	      componentDatatype === ComponentDatatype.FLOAT ||
	      componentDatatype === ComponentDatatype.DOUBLE)
	  );
	};

	/**
	 * Creates a typed array corresponding to component data type.
	 *
	 * @param {ComponentDatatype} componentDatatype The component data type.
	 * @param {number|Array} valuesOrLength The length of the array to create or an array.
	 * @returns {Int8Array|Uint8Array|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} A typed array.
	 *
	 * @exception {DeveloperError} componentDatatype is not a valid value.
	 *
	 * @example
	 * // creates a Float32Array with length of 100
	 * const typedArray = Cesium.ComponentDatatype.createTypedArray(Cesium.ComponentDatatype.FLOAT, 100);
	 */
	ComponentDatatype.createTypedArray = function (
	  componentDatatype,
	  valuesOrLength,
	) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(componentDatatype)) {
	    throw new DeveloperError("componentDatatype is required.");
	  }
	  if (!defined(valuesOrLength)) {
	    throw new DeveloperError("valuesOrLength is required.");
	  }
	  //>>includeEnd('debug');

	  switch (componentDatatype) {
	    case ComponentDatatype.BYTE:
	      return new Int8Array(valuesOrLength);
	    case ComponentDatatype.UNSIGNED_BYTE:
	      return new Uint8Array(valuesOrLength);
	    case ComponentDatatype.SHORT:
	      return new Int16Array(valuesOrLength);
	    case ComponentDatatype.UNSIGNED_SHORT:
	      return new Uint16Array(valuesOrLength);
	    case ComponentDatatype.INT:
	      return new Int32Array(valuesOrLength);
	    case ComponentDatatype.UNSIGNED_INT:
	      return new Uint32Array(valuesOrLength);
	    case ComponentDatatype.FLOAT:
	      return new Float32Array(valuesOrLength);
	    case ComponentDatatype.DOUBLE:
	      return new Float64Array(valuesOrLength);
	    //>>includeStart('debug', pragmas.debug);
	    default:
	      throw new DeveloperError("componentDatatype is not a valid value.");
	    //>>includeEnd('debug');
	  }
	};

	/**
	 * Creates a typed view of an array of bytes.
	 *
	 * @param {ComponentDatatype} componentDatatype The type of the view to create.
	 * @param {ArrayBuffer} buffer The buffer storage to use for the view.
	 * @param {number} [byteOffset] The offset, in bytes, to the first element in the view.
	 * @param {number} [length] The number of elements in the view.
	 * @returns {Int8Array|Uint8Array|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} A typed array view of the buffer.
	 *
	 * @exception {DeveloperError} componentDatatype is not a valid value.
	 */
	ComponentDatatype.createArrayBufferView = function (
	  componentDatatype,
	  buffer,
	  byteOffset,
	  length,
	) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(componentDatatype)) {
	    throw new DeveloperError("componentDatatype is required.");
	  }
	  if (!defined(buffer)) {
	    throw new DeveloperError("buffer is required.");
	  }
	  //>>includeEnd('debug');

	  byteOffset = defaultValue(byteOffset, 0);
	  length = defaultValue(
	    length,
	    (buffer.byteLength - byteOffset) /
	      ComponentDatatype.getSizeInBytes(componentDatatype),
	  );

	  switch (componentDatatype) {
	    case ComponentDatatype.BYTE:
	      return new Int8Array(buffer, byteOffset, length);
	    case ComponentDatatype.UNSIGNED_BYTE:
	      return new Uint8Array(buffer, byteOffset, length);
	    case ComponentDatatype.SHORT:
	      return new Int16Array(buffer, byteOffset, length);
	    case ComponentDatatype.UNSIGNED_SHORT:
	      return new Uint16Array(buffer, byteOffset, length);
	    case ComponentDatatype.INT:
	      return new Int32Array(buffer, byteOffset, length);
	    case ComponentDatatype.UNSIGNED_INT:
	      return new Uint32Array(buffer, byteOffset, length);
	    case ComponentDatatype.FLOAT:
	      return new Float32Array(buffer, byteOffset, length);
	    case ComponentDatatype.DOUBLE:
	      return new Float64Array(buffer, byteOffset, length);
	    //>>includeStart('debug', pragmas.debug);
	    default:
	      throw new DeveloperError("componentDatatype is not a valid value.");
	    //>>includeEnd('debug');
	  }
	};

	/**
	 * Get the ComponentDatatype from its name.
	 *
	 * @param {string} name The name of the ComponentDatatype.
	 * @returns {ComponentDatatype} The ComponentDatatype.
	 *
	 * @exception {DeveloperError} name is not a valid value.
	 */
	ComponentDatatype.fromName = function (name) {
	  switch (name) {
	    case "BYTE":
	      return ComponentDatatype.BYTE;
	    case "UNSIGNED_BYTE":
	      return ComponentDatatype.UNSIGNED_BYTE;
	    case "SHORT":
	      return ComponentDatatype.SHORT;
	    case "UNSIGNED_SHORT":
	      return ComponentDatatype.UNSIGNED_SHORT;
	    case "INT":
	      return ComponentDatatype.INT;
	    case "UNSIGNED_INT":
	      return ComponentDatatype.UNSIGNED_INT;
	    case "FLOAT":
	      return ComponentDatatype.FLOAT;
	    case "DOUBLE":
	      return ComponentDatatype.DOUBLE;
	    //>>includeStart('debug', pragmas.debug);
	    default:
	      throw new DeveloperError("name is not a valid value.");
	    //>>includeEnd('debug');
	  }
	};
	var ComponentDatatype$1 = Object.freeze(ComponentDatatype);

	// module.exports = ArrayStorage;

	const initialLength = 1024; // 2^10
	const doublingThreshold = 33554432; // 2^25 (~134 MB for a Float32Array)
	const fixedExpansionLength = 33554432; // 2^25 (~134 MB for a Float32Array)

	/**
	 * Provides expandable typed array storage for geometry data. This is preferable to JS arrays which are
	 * stored with double precision. The resizing mechanism is similar to std::vector.
	 *
	 * @param {ComponentDatatype} componentDatatype The data type.
	 *
	 * @private
	 */
	function ArrayStorage(componentDatatype) {
	  this.componentDatatype = componentDatatype;
	  this.typedArray = ComponentDatatype$1.createTypedArray(componentDatatype, 0);
	  this.length = 0;
	}

	function resize(storage, length) {
	  const typedArray = ComponentDatatype$1.createTypedArray(
	    storage.componentDatatype,
	    length,
	  );
	  typedArray.set(storage.typedArray);
	  storage.typedArray = typedArray;
	}

	ArrayStorage.prototype.push = function (value) {
	  const length = this.length;
	  const typedArrayLength = this.typedArray.length;

	  if (length === 0) {
	    resize(this, initialLength);
	  } else if (length === typedArrayLength) {
	    if (length < doublingThreshold) {
	      resize(this, typedArrayLength * 2);
	    } else {
	      resize(this, typedArrayLength + fixedExpansionLength);
	    }
	  }

	  this.typedArray[this.length++] = value;
	};

	ArrayStorage.prototype.get = function (index) {
	  return this.typedArray[index];
	};

	const sizeOfUint16 = 2;
	const sizeOfUint32 = 4;
	const sizeOfFloat = 4;

	ArrayStorage.prototype.toUint16Buffer = function () {
	  const length = this.length;
	  const typedArray = this.typedArray;
	  const paddedLength = length + (length % 2 === 0 ? 0 : 1); // Round to next multiple of 2
	  const buffer = Buffer.alloc(paddedLength * sizeOfUint16);
	  for (let i = 0; i < length; ++i) {
	    buffer.writeUInt16LE(typedArray[i], i * sizeOfUint16);
	  }
	  return buffer;
	};

	ArrayStorage.prototype.toUint32Buffer = function () {
	  const length = this.length;
	  const typedArray = this.typedArray;
	  const buffer = Buffer.alloc(length * sizeOfUint32);
	  for (let i = 0; i < length; ++i) {
	    buffer.writeUInt32LE(typedArray[i], i * sizeOfUint32);
	  }
	  return buffer;
	};

	ArrayStorage.prototype.toFloatBuffer = function () {
	  const length = this.length;
	  const typedArray = this.typedArray;
	  const buffer = Buffer.alloc(length * sizeOfFloat);
	  for (let i = 0; i < length; ++i) {
	    buffer.writeFloatLE(typedArray[i], i * sizeOfFloat);
	  }
	  return buffer;
	};

	ArrayStorage.prototype.getMinMax = function (components) {
	  const length = this.length;
	  const typedArray = this.typedArray;
	  const count = length / components;
	  const min = new Array(components).fill(Number.POSITIVE_INFINITY);
	  const max = new Array(components).fill(Number.NEGATIVE_INFINITY);
	  for (let i = 0; i < count; ++i) {
	    for (let j = 0; j < components; ++j) {
	      const index = i * components + j;
	      const value = typedArray[index];
	      min[j] = Math.min(min[j], value);
	      max[j] = Math.max(max[j], value);
	    }
	  }
	  return {
	    min: min,
	    max: max,
	  };
	};

	// module.exports = Texture;

	/**
	 * An object containing information about a texture.
	 *
	 * @private
	 */
	function Texture() {
	  this.transparent = false;
	  this.source = undefined;
	  this.name = undefined;
	  this.extension = undefined;
	  this.path = undefined;
	  this.pixels = undefined;
	  this.width = undefined;
	  this.height = undefined;
	}

	// const defined = Cesium.defined;

	// module.exports = loadTexture;

	/**
	 * Load a texture file.
	 *
	 * @param {String} texturePath Path to the texture file.
	 * @param {Object} [options] An object with the following properties:
	 * @param {Boolean} [options.checkTransparency=false] Do a more exhaustive check for texture transparency by looking at the alpha channel of each pixel.
	 * @param {Boolean} [options.decode=false] Whether to decode the texture.
	 * @param {Boolean} [options.keepSource=false] Whether to keep the source image contents in memory.
	 * @returns {Promise} A promise resolving to a Texture object.
	 *
	 * @private
	 */
	function loadTexture(texturePath, options) {
	  options = defaultValue(options, {});
	  options.checkTransparency = defaultValue(options.checkTransparency, false);
	  options.decode = defaultValue(options.decode, false);
	  options.keepSource = defaultValue(options.keepSource, false);

	  //   return fsExtra.readFile(texturePath).then(function (source) {
	  return new bluebirdExports.Promise(function (resolve, reject) {
	    const name = path.basename(texturePath, path.extname(texturePath));
	    const extension = path.extname(texturePath).toLowerCase();
	    const texture = new Texture();
	    // texture.source = source;
	    texture.name = name;
	    texture.extension = extension;
	    texture.path = texturePath;

	    // let decodePromise;
	    if (extension === ".png") {
	      //   decodePromise = decodePng(texture, options);
	      texture.transparent = true;
	    } else if (extension === ".jpg" || extension === ".jpeg") {
	      //   decodePromise = decodeJpeg(texture, options);
	      texture.transparent = false;
	    }

	    // if (defined(decodePromise)) {
	    //   return decodePromise.then(function () {
	    //     return texture;
	    //   });
	    // }

	    resolve(texture);
	    // return texture;
	  });
	}

	/**
	 * 封装使用fetch接口获取Response对象
	 * @param {String} url 请求url
	 * @param {RequestInit} requestOptions 请求参数
	 * @returns {Promise} 返回Promise对象
	 */
	async function fetchResponse(url, requestOptions) {
	    if (typeof url !== 'string') {
	        throw new Error('fetch url ' + url + ' is illegal. ');
	    }
	    try {
	        const response = await fetch(url, requestOptions);
	        if (response.ok)
	            return response;
	        else
	            throw new Error('fetch url ' + url + ' failed, status=' + response.status + ' ;statusText=' + response.statusText);
	    } catch (error) {
	        throw error;
	    }
	}

	/**
	 * 封装使用fetch接口获取文本
	 * @param {String} url 请求url
	 * @param {RequestInit} requestOptions 请求参数
	 * @returns {Promise} 返回Promise对象
	 */
	async function fetchText(url, requestOptions) {
	    try {
	        const response = await fetchResponse(url, requestOptions);
	        const text = await response.text();
	        if (text)
	            return text;
	        else
	            throw new Error('fetchText result is null. ');
	    } catch (error) {
	        throw error;
	    }
	}

	/**
	 * 读取文本
	 * @param {File|Blob} file 传入的File或Blob对象
	 * @param {Function} onLoad 加载完成回调函数
	 * @param {Function} onError 加载出错回调函数
	 * @param {String} encoding 文本编码
	 * @returns {Promise}
	 */
	function readAsText(file, onLoad, onError, encoding) {
	    return new Promise((resolve, reject) => {
	        const reader = new FileReader();
	        reader.onload = function () {
	            if (onLoad)
	                onLoad(reader.result);
	            resolve(reader.result);
	        };
	        reader.onerror = function (event) {
	            console.error('readAsText failed.', event);
	            if (onError)
	                onError(event);
	            reject(event);
	        };
	        reader.readAsText(file, encoding);
	    });
	}

	/**
	 * 按行读取文本内容
	 * @param {File|Blob|ArrayBuffer|String} data 读取的数据
	 * @param {Function} callback 按行回调函数
	 * @param {String} encoding 文本编码
	 * @returns {Promise}
	 */
	function readLine(data, callback, encoding) {
	    return new Promise((resolve, reject) => {

	        function doReadLine(text) {
	            const lines = text.split(/\r\n|\r|\n/g);
	            let index = 0;
	            const length = lines.length;

	            lines.forEach(element => {
	                if (callback)
	                    try {
	                        callback(element, index, length);
	                    } catch (error) {
	                        reject(error);
	                    }
	                index++;
	            });

	            resolve();
	        }

	        if (data instanceof Blob) {
	            readAsText(data, (text) => {
	                doReadLine(text);
	            }, (error) => {
	                reject(error);
	            }, encoding);
	        } else if (data instanceof ArrayBuffer) {
	            const decoder = new TextDecode(encoding);
	            const text = decoder.decode(data);
	            doReadLine(text);
	        } else if (typeof data === 'string') {
	            const text = data;
	            doReadLine(text);
	        } else {
	            reject(new Error('unsupported data.' + data));
	        }
	    });
	}

	// module.exports = readLines;

	/**
	 * Read a file line-by-line.
	 *
	 * @param {String} path Path to the file.
	 * @param {Function} callback Function to call when reading each line.
	 * @returns {Promise} A promise when the reader is finished.
	 *
	 * @private
	 */
	function readLines(path, callback) {
	    //   const stream = fsExtra.createReadStream(path);
	    //   return events.once(stream, "open").then(function () {
	    return new Promise(function (resolve, reject) {
	        //   stream.on("error", reject);
	        //   stream.on("end", resolve);

	        //   const lineReader = readline.createInterface({
	        //     input: stream,
	        //   });

	        //   const callbackWrapper = function (line) {
	        //     try {
	        //       callback(line);
	        //     } catch (error) {
	        //       reject(error);
	        //     }
	        //   };

	        //   lineReader.on("line", callbackWrapper);

	        fetchText(path).then((text) => {
	            readLine(text, callback).then(() => {
	                resolve();
	            }).catch((error) => {
	                reject(error);
	            });
	        }).catch((error) => {
	            reject(error);
	        });
	    });
	}

	/*
	  https://github.com/banksean wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
	  so it's better encapsulated. Now you can have multiple random number generators
	  and they won't stomp all over eachother's state.

	  If you want to use this as a substitute for Math.random(), use the random()
	  method like so:

	  var m = new MersenneTwister();
	  var randomNumber = m.random();

	  You can also call the other genrand_{foo}() methods on the instance.

	  If you want to use a specific seed in order to get a repeatable random
	  sequence, pass an integer into the constructor:

	  var m = new MersenneTwister(123);

	  and that will always produce the same random sequence.

	  Sean McCullough (banksean@gmail.com)
	*/

	var mersenneTwister;
	var hasRequiredMersenneTwister;

	function requireMersenneTwister () {
		if (hasRequiredMersenneTwister) return mersenneTwister;
		hasRequiredMersenneTwister = 1;
		/*
		   A C-program for MT19937, with initialization improved 2002/1/26.
		   Coded by Takuji Nishimura and Makoto Matsumoto.

		   Before using, initialize the state by using init_seed(seed)
		   or init_by_array(init_key, key_length).

		   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
		   All rights reserved.

		   Redistribution and use in source and binary forms, with or without
		   modification, are permitted provided that the following conditions
		   are met:

		     1. Redistributions of source code must retain the above copyright
		        notice, this list of conditions and the following disclaimer.

		     2. Redistributions in binary form must reproduce the above copyright
		        notice, this list of conditions and the following disclaimer in the
		        documentation and/or other materials provided with the distribution.

		     3. The names of its contributors may not be used to endorse or promote
		        products derived from this software without specific prior written
		        permission.

		   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
		   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
		   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
		   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
		   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
		   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
		   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
		   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
		   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
		   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
		   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


		   Any feedback is very welcome.
		   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
		   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
		*/

		var MersenneTwister = function(seed) {
			if (seed == undefined) {
				seed = new Date().getTime();
			}

			/* Period parameters */
			this.N = 624;
			this.M = 397;
			this.MATRIX_A = 0x9908b0df;   /* constant vector a */
			this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
			this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

			this.mt = new Array(this.N); /* the array for the state vector */
			this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

			if (seed.constructor == Array) {
				this.init_by_array(seed, seed.length);
			}
			else {
				this.init_seed(seed);
			}
		};

		/* initializes mt[N] with a seed */
		/* origin name init_genrand */
		MersenneTwister.prototype.init_seed = function(s) {
			this.mt[0] = s >>> 0;
			for (this.mti=1; this.mti<this.N; this.mti++) {
				var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
				this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
				+ this.mti;
				/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
				/* In the previous versions, MSBs of the seed affect   */
				/* only MSBs of the array mt[].                        */
				/* 2002/01/09 modified by Makoto Matsumoto             */
				this.mt[this.mti] >>>= 0;
				/* for >32 bit machines */
			}
		};

		/* initialize by an array with array-length */
		/* init_key is the array for initializing keys */
		/* key_length is its length */
		/* slight change for C++, 2004/2/26 */
		MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
			var i, j, k;
			this.init_seed(19650218);
			i=1; j=0;
			k = (this.N>key_length ? this.N : key_length);
			for (; k; k--) {
				var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
				this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
				+ init_key[j] + j; /* non linear */
				this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
				i++; j++;
				if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
				if (j>=key_length) j=0;
			}
			for (k=this.N-1; k; k--) {
				var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
				this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
				- i; /* non linear */
				this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
				i++;
				if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
			}

			this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
		};

		/* generates a random number on [0,0xffffffff]-interval */
		/* origin name genrand_int32 */
		MersenneTwister.prototype.random_int = function() {
			var y;
			var mag01 = new Array(0x0, this.MATRIX_A);
			/* mag01[x] = x * MATRIX_A  for x=0,1 */

			if (this.mti >= this.N) { /* generate N words at one time */
				var kk;

				if (this.mti == this.N+1)  /* if init_seed() has not been called, */
					this.init_seed(5489);  /* a default initial seed is used */

				for (kk=0;kk<this.N-this.M;kk++) {
					y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
					this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
				}
				for (;kk<this.N-1;kk++) {
					y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
					this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
				}
				y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
				this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

				this.mti = 0;
			}

			y = this.mt[this.mti++];

			/* Tempering */
			y ^= (y >>> 11);
			y ^= (y << 7) & 0x9d2c5680;
			y ^= (y << 15) & 0xefc60000;
			y ^= (y >>> 18);

			return y >>> 0;
		};

		/* generates a random number on [0,0x7fffffff]-interval */
		/* origin name genrand_int31 */
		MersenneTwister.prototype.random_int31 = function() {
			return (this.random_int()>>>1);
		};

		/* generates a random number on [0,1]-real-interval */
		/* origin name genrand_real1 */
		MersenneTwister.prototype.random_incl = function() {
			return this.random_int()*(1.0/4294967295.0);
			/* divided by 2^32-1 */
		};

		/* generates a random number on [0,1)-real-interval */
		MersenneTwister.prototype.random = function() {
			return this.random_int()*(1.0/4294967296.0);
			/* divided by 2^32 */
		};

		/* generates a random number on (0,1)-real-interval */
		/* origin name genrand_real3 */
		MersenneTwister.prototype.random_excl = function() {
			return (this.random_int() + 0.5)*(1.0/4294967296.0);
			/* divided by 2^32 */
		};

		/* generates a random number on [0,1) with 53-bit resolution*/
		/* origin name genrand_res53 */
		MersenneTwister.prototype.random_long = function() {
			var a=this.random_int()>>>5, b=this.random_int()>>>6;
			return (a*67108864.0+b)*(1.0/9007199254740992.0);
		};

		/* These real versions are due to Isaku Wada, 2002/01/09 added */

		mersenneTwister = MersenneTwister;
		return mersenneTwister;
	}

	var mersenneTwisterExports = requireMersenneTwister();
	var MersenneTwister = /*@__PURE__*/getDefaultExportFromCjs(mersenneTwisterExports);

	/**
	 * Contains functions for checking that supplied arguments are of a specified type
	 * or meet specified conditions
	 */
	const Check = {};

	/**
	 * Contains type checking functions, all using the typeof operator
	 */
	Check.typeOf = {};

	function getUndefinedErrorMessage(name) {
	  return `${name} is required, actual value was undefined`;
	}

	function getFailedTypeErrorMessage(actual, expected, name) {
	  return `Expected ${name} to be typeof ${expected}, actual typeof was ${actual}`;
	}

	/**
	 * Throws if test is not defined
	 *
	 * @param {string} name The name of the variable being tested
	 * @param {*} test The value that is to be checked
	 * @exception {DeveloperError} test must be defined
	 */
	Check.defined = function (name, test) {
	  if (!defined(test)) {
	    throw new DeveloperError(getUndefinedErrorMessage(name));
	  }
	};

	/**
	 * Throws if test is not typeof 'function'
	 *
	 * @param {string} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @exception {DeveloperError} test must be typeof 'function'
	 */
	Check.typeOf.func = function (name, test) {
	  if (typeof test !== "function") {
	    throw new DeveloperError(
	      getFailedTypeErrorMessage(typeof test, "function", name),
	    );
	  }
	};

	/**
	 * Throws if test is not typeof 'string'
	 *
	 * @param {string} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @exception {DeveloperError} test must be typeof 'string'
	 */
	Check.typeOf.string = function (name, test) {
	  if (typeof test !== "string") {
	    throw new DeveloperError(
	      getFailedTypeErrorMessage(typeof test, "string", name),
	    );
	  }
	};

	/**
	 * Throws if test is not typeof 'number'
	 *
	 * @param {string} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @exception {DeveloperError} test must be typeof 'number'
	 */
	Check.typeOf.number = function (name, test) {
	  if (typeof test !== "number") {
	    throw new DeveloperError(
	      getFailedTypeErrorMessage(typeof test, "number", name),
	    );
	  }
	};

	/**
	 * Throws if test is not typeof 'number' and less than limit
	 *
	 * @param {string} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @param {number} limit The limit value to compare against
	 * @exception {DeveloperError} test must be typeof 'number' and less than limit
	 */
	Check.typeOf.number.lessThan = function (name, test, limit) {
	  Check.typeOf.number(name, test);
	  if (test >= limit) {
	    throw new DeveloperError(
	      `Expected ${name} to be less than ${limit}, actual value was ${test}`,
	    );
	  }
	};

	/**
	 * Throws if test is not typeof 'number' and less than or equal to limit
	 *
	 * @param {string} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @param {number} limit The limit value to compare against
	 * @exception {DeveloperError} test must be typeof 'number' and less than or equal to limit
	 */
	Check.typeOf.number.lessThanOrEquals = function (name, test, limit) {
	  Check.typeOf.number(name, test);
	  if (test > limit) {
	    throw new DeveloperError(
	      `Expected ${name} to be less than or equal to ${limit}, actual value was ${test}`,
	    );
	  }
	};

	/**
	 * Throws if test is not typeof 'number' and greater than limit
	 *
	 * @param {string} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @param {number} limit The limit value to compare against
	 * @exception {DeveloperError} test must be typeof 'number' and greater than limit
	 */
	Check.typeOf.number.greaterThan = function (name, test, limit) {
	  Check.typeOf.number(name, test);
	  if (test <= limit) {
	    throw new DeveloperError(
	      `Expected ${name} to be greater than ${limit}, actual value was ${test}`,
	    );
	  }
	};

	/**
	 * Throws if test is not typeof 'number' and greater than or equal to limit
	 *
	 * @param {string} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @param {number} limit The limit value to compare against
	 * @exception {DeveloperError} test must be typeof 'number' and greater than or equal to limit
	 */
	Check.typeOf.number.greaterThanOrEquals = function (name, test, limit) {
	  Check.typeOf.number(name, test);
	  if (test < limit) {
	    throw new DeveloperError(
	      `Expected ${name} to be greater than or equal to ${limit}, actual value was ${test}`,
	    );
	  }
	};

	/**
	 * Throws if test is not typeof 'object'
	 *
	 * @param {string} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @exception {DeveloperError} test must be typeof 'object'
	 */
	Check.typeOf.object = function (name, test) {
	  if (typeof test !== "object") {
	    throw new DeveloperError(
	      getFailedTypeErrorMessage(typeof test, "object", name),
	    );
	  }
	};

	/**
	 * Throws if test is not typeof 'boolean'
	 *
	 * @param {string} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @exception {DeveloperError} test must be typeof 'boolean'
	 */
	Check.typeOf.bool = function (name, test) {
	  if (typeof test !== "boolean") {
	    throw new DeveloperError(
	      getFailedTypeErrorMessage(typeof test, "boolean", name),
	    );
	  }
	};

	/**
	 * Throws if test is not typeof 'bigint'
	 *
	 * @param {string} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @exception {DeveloperError} test must be typeof 'bigint'
	 */
	Check.typeOf.bigint = function (name, test) {
	  if (typeof test !== "bigint") {
	    throw new DeveloperError(
	      getFailedTypeErrorMessage(typeof test, "bigint", name),
	    );
	  }
	};

	/**
	 * Throws if test1 and test2 is not typeof 'number' and not equal in value
	 *
	 * @param {string} name1 The name of the first variable being tested
	 * @param {string} name2 The name of the second variable being tested against
	 * @param {*} test1 The value to test
	 * @param {*} test2 The value to test against
	 * @exception {DeveloperError} test1 and test2 should be type of 'number' and be equal in value
	 */
	Check.typeOf.number.equals = function (name1, name2, test1, test2) {
	  Check.typeOf.number(name1, test1);
	  Check.typeOf.number(name2, test2);
	  if (test1 !== test2) {
	    throw new DeveloperError(
	      `${name1} must be equal to ${name2}, the actual values are ${test1} and ${test2}`,
	    );
	  }
	};

	/**
	 * Math functions.
	 *
	 * @exports CesiumMath
	 * @alias Math
	 */
	const CesiumMath = {};

	/**
	 * 0.1
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON1 = 0.1;

	/**
	 * 0.01
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON2 = 0.01;

	/**
	 * 0.001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON3 = 0.001;

	/**
	 * 0.0001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON4 = 0.0001;

	/**
	 * 0.00001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON5 = 0.00001;

	/**
	 * 0.000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON6 = 0.000001;

	/**
	 * 0.0000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON7 = 0.0000001;

	/**
	 * 0.00000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON8 = 0.00000001;

	/**
	 * 0.000000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON9 = 0.000000001;

	/**
	 * 0.0000000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON10 = 0.0000000001;

	/**
	 * 0.00000000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON11 = 0.00000000001;

	/**
	 * 0.000000000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON12 = 0.000000000001;

	/**
	 * 0.0000000000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON13 = 0.0000000000001;

	/**
	 * 0.00000000000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON14 = 0.00000000000001;

	/**
	 * 0.000000000000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON15 = 0.000000000000001;

	/**
	 * 0.0000000000000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON16 = 0.0000000000000001;

	/**
	 * 0.00000000000000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON17 = 0.00000000000000001;

	/**
	 * 0.000000000000000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON18 = 0.000000000000000001;

	/**
	 * 0.0000000000000000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON19 = 0.0000000000000000001;

	/**
	 * 0.00000000000000000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON20 = 0.00000000000000000001;

	/**
	 * 0.000000000000000000001
	 * @type {number}
	 * @constant
	 */
	CesiumMath.EPSILON21 = 0.000000000000000000001;

	/**
	 * The gravitational parameter of the Earth in meters cubed
	 * per second squared as defined by the WGS84 model: 3.986004418e14
	 * @type {number}
	 * @constant
	 */
	CesiumMath.GRAVITATIONALPARAMETER = 3.986004418e14;

	/**
	 * Radius of the sun in meters: 6.955e8
	 * @type {number}
	 * @constant
	 */
	CesiumMath.SOLAR_RADIUS = 6.955e8;

	/**
	 * The mean radius of the moon, according to the "Report of the IAU/IAG Working Group on
	 * Cartographic Coordinates and Rotational Elements of the Planets and satellites: 2000",
	 * Celestial Mechanics 82: 83-110, 2002.
	 * @type {number}
	 * @constant
	 */
	CesiumMath.LUNAR_RADIUS = 1737400.0;

	/**
	 * 64 * 1024
	 * @type {number}
	 * @constant
	 */
	CesiumMath.SIXTY_FOUR_KILOBYTES = 64 * 1024;

	/**
	 * 4 * 1024 * 1024 * 1024
	 * @type {number}
	 * @constant
	 */
	CesiumMath.FOUR_GIGABYTES = 4 * 1024 * 1024 * 1024;

	/**
	 * Returns the sign of the value; 1 if the value is positive, -1 if the value is
	 * negative, or 0 if the value is 0.
	 *
	 * @function
	 * @param {number} value The value to return the sign of.
	 * @returns {number} The sign of value.
	 */
	CesiumMath.sign = defaultValue(Math.sign, function sign(value) {
	  value = +value; // coerce to number
	  if (value === 0 || value !== value) {
	    // zero or NaN
	    return value;
	  }
	  return value > 0 ? 1 : -1;
	});

	/**
	 * Returns 1.0 if the given value is positive or zero, and -1.0 if it is negative.
	 * This is similar to {@link CesiumMath#sign} except that returns 1.0 instead of
	 * 0.0 when the input value is 0.0.
	 * @param {number} value The value to return the sign of.
	 * @returns {number} The sign of value.
	 */
	CesiumMath.signNotZero = function (value) {
	  return value < 0.0 ? -1.0 : 1.0;
	};

	/**
	 * Converts a scalar value in the range [-1.0, 1.0] to a SNORM in the range [0, rangeMaximum]
	 * @param {number} value The scalar value in the range [-1.0, 1.0]
	 * @param {number} [rangeMaximum=255] The maximum value in the mapped range, 255 by default.
	 * @returns {number} A SNORM value, where 0 maps to -1.0 and rangeMaximum maps to 1.0.
	 *
	 * @see CesiumMath.fromSNorm
	 */
	CesiumMath.toSNorm = function (value, rangeMaximum) {
	  rangeMaximum = defaultValue(rangeMaximum, 255);
	  return Math.round(
	    (CesiumMath.clamp(value, -1.0, 1.0) * 0.5 + 0.5) * rangeMaximum,
	  );
	};

	/**
	 * Converts a SNORM value in the range [0, rangeMaximum] to a scalar in the range [-1.0, 1.0].
	 * @param {number} value SNORM value in the range [0, rangeMaximum]
	 * @param {number} [rangeMaximum=255] The maximum value in the SNORM range, 255 by default.
	 * @returns {number} Scalar in the range [-1.0, 1.0].
	 *
	 * @see CesiumMath.toSNorm
	 */
	CesiumMath.fromSNorm = function (value, rangeMaximum) {
	  rangeMaximum = defaultValue(rangeMaximum, 255);
	  return (
	    (CesiumMath.clamp(value, 0.0, rangeMaximum) / rangeMaximum) * 2.0 - 1.0
	  );
	};

	/**
	 * Converts a scalar value in the range [rangeMinimum, rangeMaximum] to a scalar in the range [0.0, 1.0]
	 * @param {number} value The scalar value in the range [rangeMinimum, rangeMaximum]
	 * @param {number} rangeMinimum The minimum value in the mapped range.
	 * @param {number} rangeMaximum The maximum value in the mapped range.
	 * @returns {number} A scalar value, where rangeMinimum maps to 0.0 and rangeMaximum maps to 1.0.
	 */
	CesiumMath.normalize = function (value, rangeMinimum, rangeMaximum) {
	  rangeMaximum = Math.max(rangeMaximum - rangeMinimum, 0.0);
	  return rangeMaximum === 0.0
	    ? 0.0
	    : CesiumMath.clamp((value - rangeMinimum) / rangeMaximum, 0.0, 1.0);
	};

	/**
	 * Returns the hyperbolic sine of a number.
	 * The hyperbolic sine of <em>value</em> is defined to be
	 * (<em>e<sup>x</sup>&nbsp;-&nbsp;e<sup>-x</sup></em>)/2.0
	 * where <i>e</i> is Euler's number, approximately 2.71828183.
	 *
	 * <p>Special cases:
	 *   <ul>
	 *     <li>If the argument is NaN, then the result is NaN.</li>
	 *
	 *     <li>If the argument is infinite, then the result is an infinity
	 *     with the same sign as the argument.</li>
	 *
	 *     <li>If the argument is zero, then the result is a zero with the
	 *     same sign as the argument.</li>
	 *   </ul>
	 *</p>
	 *
	 * @function
	 * @param {number} value The number whose hyperbolic sine is to be returned.
	 * @returns {number} The hyperbolic sine of <code>value</code>.
	 */
	CesiumMath.sinh = defaultValue(Math.sinh, function sinh(value) {
	  return (Math.exp(value) - Math.exp(-value)) / 2.0;
	});

	/**
	 * Returns the hyperbolic cosine of a number.
	 * The hyperbolic cosine of <strong>value</strong> is defined to be
	 * (<em>e<sup>x</sup>&nbsp;+&nbsp;e<sup>-x</sup></em>)/2.0
	 * where <i>e</i> is Euler's number, approximately 2.71828183.
	 *
	 * <p>Special cases:
	 *   <ul>
	 *     <li>If the argument is NaN, then the result is NaN.</li>
	 *
	 *     <li>If the argument is infinite, then the result is positive infinity.</li>
	 *
	 *     <li>If the argument is zero, then the result is 1.0.</li>
	 *   </ul>
	 *</p>
	 *
	 * @function
	 * @param {number} value The number whose hyperbolic cosine is to be returned.
	 * @returns {number} The hyperbolic cosine of <code>value</code>.
	 */
	CesiumMath.cosh = defaultValue(Math.cosh, function cosh(value) {
	  return (Math.exp(value) + Math.exp(-value)) / 2.0;
	});

	/**
	 * Computes the linear interpolation of two values.
	 *
	 * @param {number} p The start value to interpolate.
	 * @param {number} q The end value to interpolate.
	 * @param {number} time The time of interpolation generally in the range <code>[0.0, 1.0]</code>.
	 * @returns {number} The linearly interpolated value.
	 *
	 * @example
	 * const n = Cesium.Math.lerp(0.0, 2.0, 0.5); // returns 1.0
	 */
	CesiumMath.lerp = function (p, q, time) {
	  return (1.0 - time) * p + time * q;
	};

	/**
	 * pi
	 *
	 * @type {number}
	 * @constant
	 */
	CesiumMath.PI = Math.PI;

	/**
	 * 1/pi
	 *
	 * @type {number}
	 * @constant
	 */
	CesiumMath.ONE_OVER_PI = 1.0 / Math.PI;

	/**
	 * pi/2
	 *
	 * @type {number}
	 * @constant
	 */
	CesiumMath.PI_OVER_TWO = Math.PI / 2.0;

	/**
	 * pi/3
	 *
	 * @type {number}
	 * @constant
	 */
	CesiumMath.PI_OVER_THREE = Math.PI / 3.0;

	/**
	 * pi/4
	 *
	 * @type {number}
	 * @constant
	 */
	CesiumMath.PI_OVER_FOUR = Math.PI / 4.0;

	/**
	 * pi/6
	 *
	 * @type {number}
	 * @constant
	 */
	CesiumMath.PI_OVER_SIX = Math.PI / 6.0;

	/**
	 * 3pi/2
	 *
	 * @type {number}
	 * @constant
	 */
	CesiumMath.THREE_PI_OVER_TWO = (3.0 * Math.PI) / 2.0;

	/**
	 * 2pi
	 *
	 * @type {number}
	 * @constant
	 */
	CesiumMath.TWO_PI = 2.0 * Math.PI;

	/**
	 * 1/2pi
	 *
	 * @type {number}
	 * @constant
	 */
	CesiumMath.ONE_OVER_TWO_PI = 1.0 / (2.0 * Math.PI);

	/**
	 * The number of radians in a degree.
	 *
	 * @type {number}
	 * @constant
	 */
	CesiumMath.RADIANS_PER_DEGREE = Math.PI / 180.0;

	/**
	 * The number of degrees in a radian.
	 *
	 * @type {number}
	 * @constant
	 */
	CesiumMath.DEGREES_PER_RADIAN = 180.0 / Math.PI;

	/**
	 * The number of radians in an arc second.
	 *
	 * @type {number}
	 * @constant
	 */
	CesiumMath.RADIANS_PER_ARCSECOND = CesiumMath.RADIANS_PER_DEGREE / 3600.0;

	/**
	 * Converts degrees to radians.
	 * @param {number} degrees The angle to convert in degrees.
	 * @returns {number} The corresponding angle in radians.
	 */
	CesiumMath.toRadians = function (degrees) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(degrees)) {
	    throw new DeveloperError("degrees is required.");
	  }
	  //>>includeEnd('debug');
	  return degrees * CesiumMath.RADIANS_PER_DEGREE;
	};

	/**
	 * Converts radians to degrees.
	 * @param {number} radians The angle to convert in radians.
	 * @returns {number} The corresponding angle in degrees.
	 */
	CesiumMath.toDegrees = function (radians) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(radians)) {
	    throw new DeveloperError("radians is required.");
	  }
	  //>>includeEnd('debug');
	  return radians * CesiumMath.DEGREES_PER_RADIAN;
	};

	/**
	 * Converts a longitude value, in radians, to the range [<code>-Math.PI</code>, <code>Math.PI</code>).
	 *
	 * @param {number} angle The longitude value, in radians, to convert to the range [<code>-Math.PI</code>, <code>Math.PI</code>).
	 * @returns {number} The equivalent longitude value in the range [<code>-Math.PI</code>, <code>Math.PI</code>).
	 *
	 * @example
	 * // Convert 270 degrees to -90 degrees longitude
	 * const longitude = Cesium.Math.convertLongitudeRange(Cesium.Math.toRadians(270.0));
	 */
	CesiumMath.convertLongitudeRange = function (angle) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(angle)) {
	    throw new DeveloperError("angle is required.");
	  }
	  //>>includeEnd('debug');
	  const twoPi = CesiumMath.TWO_PI;

	  const simplified = angle - Math.floor(angle / twoPi) * twoPi;

	  if (simplified < -Math.PI) {
	    return simplified + twoPi;
	  }
	  if (simplified >= Math.PI) {
	    return simplified - twoPi;
	  }

	  return simplified;
	};

	/**
	 * Convenience function that clamps a latitude value, in radians, to the range [<code>-Math.PI/2</code>, <code>Math.PI/2</code>).
	 * Useful for sanitizing data before use in objects requiring correct range.
	 *
	 * @param {number} angle The latitude value, in radians, to clamp to the range [<code>-Math.PI/2</code>, <code>Math.PI/2</code>).
	 * @returns {number} The latitude value clamped to the range [<code>-Math.PI/2</code>, <code>Math.PI/2</code>).
	 *
	 * @example
	 * // Clamp 108 degrees latitude to 90 degrees latitude
	 * const latitude = Cesium.Math.clampToLatitudeRange(Cesium.Math.toRadians(108.0));
	 */
	CesiumMath.clampToLatitudeRange = function (angle) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(angle)) {
	    throw new DeveloperError("angle is required.");
	  }
	  //>>includeEnd('debug');

	  return CesiumMath.clamp(
	    angle,
	    -1 * CesiumMath.PI_OVER_TWO,
	    CesiumMath.PI_OVER_TWO,
	  );
	};

	/**
	 * Produces an angle in the range -Pi <= angle <= Pi which is equivalent to the provided angle.
	 *
	 * @param {number} angle in radians
	 * @returns {number} The angle in the range [<code>-CesiumMath.PI</code>, <code>CesiumMath.PI</code>].
	 */
	CesiumMath.negativePiToPi = function (angle) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(angle)) {
	    throw new DeveloperError("angle is required.");
	  }
	  //>>includeEnd('debug');
	  if (angle >= -CesiumMath.PI && angle <= CesiumMath.PI) {
	    // Early exit if the input is already inside the range. This avoids
	    // unnecessary math which could introduce floating point error.
	    return angle;
	  }
	  return CesiumMath.zeroToTwoPi(angle + CesiumMath.PI) - CesiumMath.PI;
	};

	/**
	 * Produces an angle in the range 0 <= angle <= 2Pi which is equivalent to the provided angle.
	 *
	 * @param {number} angle in radians
	 * @returns {number} The angle in the range [0, <code>CesiumMath.TWO_PI</code>].
	 */
	CesiumMath.zeroToTwoPi = function (angle) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(angle)) {
	    throw new DeveloperError("angle is required.");
	  }
	  //>>includeEnd('debug');
	  if (angle >= 0 && angle <= CesiumMath.TWO_PI) {
	    // Early exit if the input is already inside the range. This avoids
	    // unnecessary math which could introduce floating point error.
	    return angle;
	  }
	  const mod = CesiumMath.mod(angle, CesiumMath.TWO_PI);
	  if (
	    Math.abs(mod) < CesiumMath.EPSILON14 &&
	    Math.abs(angle) > CesiumMath.EPSILON14
	  ) {
	    return CesiumMath.TWO_PI;
	  }
	  return mod;
	};

	/**
	 * The modulo operation that also works for negative dividends.
	 *
	 * @param {number} m The dividend.
	 * @param {number} n The divisor.
	 * @returns {number} The remainder.
	 */
	CesiumMath.mod = function (m, n) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(m)) {
	    throw new DeveloperError("m is required.");
	  }
	  if (!defined(n)) {
	    throw new DeveloperError("n is required.");
	  }
	  if (n === 0.0) {
	    throw new DeveloperError("divisor cannot be 0.");
	  }
	  //>>includeEnd('debug');
	  if (CesiumMath.sign(m) === CesiumMath.sign(n) && Math.abs(m) < Math.abs(n)) {
	    // Early exit if the input does not need to be modded. This avoids
	    // unnecessary math which could introduce floating point error.
	    return m;
	  }

	  return ((m % n) + n) % n;
	};

	/**
	 * Determines if two values are equal using an absolute or relative tolerance test. This is useful
	 * to avoid problems due to roundoff error when comparing floating-point values directly. The values are
	 * first compared using an absolute tolerance test. If that fails, a relative tolerance test is performed.
	 * Use this test if you are unsure of the magnitudes of left and right.
	 *
	 * @param {number} left The first value to compare.
	 * @param {number} right The other value to compare.
	 * @param {number} [relativeEpsilon=0] The maximum inclusive delta between <code>left</code> and <code>right</code> for the relative tolerance test.
	 * @param {number} [absoluteEpsilon=relativeEpsilon] The maximum inclusive delta between <code>left</code> and <code>right</code> for the absolute tolerance test.
	 * @returns {boolean} <code>true</code> if the values are equal within the epsilon; otherwise, <code>false</code>.
	 *
	 * @example
	 * const a = Cesium.Math.equalsEpsilon(0.0, 0.01, Cesium.Math.EPSILON2); // true
	 * const b = Cesium.Math.equalsEpsilon(0.0, 0.1, Cesium.Math.EPSILON2);  // false
	 * const c = Cesium.Math.equalsEpsilon(3699175.1634344, 3699175.2, Cesium.Math.EPSILON7); // true
	 * const d = Cesium.Math.equalsEpsilon(3699175.1634344, 3699175.2, Cesium.Math.EPSILON9); // false
	 */
	CesiumMath.equalsEpsilon = function (
	  left,
	  right,
	  relativeEpsilon,
	  absoluteEpsilon,
	) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(left)) {
	    throw new DeveloperError("left is required.");
	  }
	  if (!defined(right)) {
	    throw new DeveloperError("right is required.");
	  }
	  //>>includeEnd('debug');

	  relativeEpsilon = defaultValue(relativeEpsilon, 0.0);
	  absoluteEpsilon = defaultValue(absoluteEpsilon, relativeEpsilon);
	  const absDiff = Math.abs(left - right);
	  return (
	    absDiff <= absoluteEpsilon ||
	    absDiff <= relativeEpsilon * Math.max(Math.abs(left), Math.abs(right))
	  );
	};

	/**
	 * Determines if the left value is less than the right value. If the two values are within
	 * <code>absoluteEpsilon</code> of each other, they are considered equal and this function returns false.
	 *
	 * @param {number} left The first number to compare.
	 * @param {number} right The second number to compare.
	 * @param {number} absoluteEpsilon The absolute epsilon to use in comparison.
	 * @returns {boolean} <code>true</code> if <code>left</code> is less than <code>right</code> by more than
	 *          <code>absoluteEpsilon<code>. <code>false</code> if <code>left</code> is greater or if the two
	 *          values are nearly equal.
	 */
	CesiumMath.lessThan = function (left, right, absoluteEpsilon) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(left)) {
	    throw new DeveloperError("first is required.");
	  }
	  if (!defined(right)) {
	    throw new DeveloperError("second is required.");
	  }
	  if (!defined(absoluteEpsilon)) {
	    throw new DeveloperError("absoluteEpsilon is required.");
	  }
	  //>>includeEnd('debug');
	  return left - right < -absoluteEpsilon;
	};

	/**
	 * Determines if the left value is less than or equal to the right value. If the two values are within
	 * <code>absoluteEpsilon</code> of each other, they are considered equal and this function returns true.
	 *
	 * @param {number} left The first number to compare.
	 * @param {number} right The second number to compare.
	 * @param {number} absoluteEpsilon The absolute epsilon to use in comparison.
	 * @returns {boolean} <code>true</code> if <code>left</code> is less than <code>right</code> or if the
	 *          the values are nearly equal.
	 */
	CesiumMath.lessThanOrEquals = function (left, right, absoluteEpsilon) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(left)) {
	    throw new DeveloperError("first is required.");
	  }
	  if (!defined(right)) {
	    throw new DeveloperError("second is required.");
	  }
	  if (!defined(absoluteEpsilon)) {
	    throw new DeveloperError("absoluteEpsilon is required.");
	  }
	  //>>includeEnd('debug');
	  return left - right < absoluteEpsilon;
	};

	/**
	 * Determines if the left value is greater the right value. If the two values are within
	 * <code>absoluteEpsilon</code> of each other, they are considered equal and this function returns false.
	 *
	 * @param {number} left The first number to compare.
	 * @param {number} right The second number to compare.
	 * @param {number} absoluteEpsilon The absolute epsilon to use in comparison.
	 * @returns {boolean} <code>true</code> if <code>left</code> is greater than <code>right</code> by more than
	 *          <code>absoluteEpsilon<code>. <code>false</code> if <code>left</code> is less or if the two
	 *          values are nearly equal.
	 */
	CesiumMath.greaterThan = function (left, right, absoluteEpsilon) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(left)) {
	    throw new DeveloperError("first is required.");
	  }
	  if (!defined(right)) {
	    throw new DeveloperError("second is required.");
	  }
	  if (!defined(absoluteEpsilon)) {
	    throw new DeveloperError("absoluteEpsilon is required.");
	  }
	  //>>includeEnd('debug');
	  return left - right > absoluteEpsilon;
	};

	/**
	 * Determines if the left value is greater than or equal to the right value. If the two values are within
	 * <code>absoluteEpsilon</code> of each other, they are considered equal and this function returns true.
	 *
	 * @param {number} left The first number to compare.
	 * @param {number} right The second number to compare.
	 * @param {number} absoluteEpsilon The absolute epsilon to use in comparison.
	 * @returns {boolean} <code>true</code> if <code>left</code> is greater than <code>right</code> or if the
	 *          the values are nearly equal.
	 */
	CesiumMath.greaterThanOrEquals = function (left, right, absoluteEpsilon) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(left)) {
	    throw new DeveloperError("first is required.");
	  }
	  if (!defined(right)) {
	    throw new DeveloperError("second is required.");
	  }
	  if (!defined(absoluteEpsilon)) {
	    throw new DeveloperError("absoluteEpsilon is required.");
	  }
	  //>>includeEnd('debug');
	  return left - right > -absoluteEpsilon;
	};

	const factorials = [1];

	/**
	 * Computes the factorial of the provided number.
	 *
	 * @param {number} n The number whose factorial is to be computed.
	 * @returns {number} The factorial of the provided number or undefined if the number is less than 0.
	 *
	 * @exception {DeveloperError} A number greater than or equal to 0 is required.
	 *
	 *
	 * @example
	 * //Compute 7!, which is equal to 5040
	 * const computedFactorial = Cesium.Math.factorial(7);
	 *
	 * @see {@link http://en.wikipedia.org/wiki/Factorial|Factorial on Wikipedia}
	 */
	CesiumMath.factorial = function (n) {
	  //>>includeStart('debug', pragmas.debug);
	  if (typeof n !== "number" || n < 0) {
	    throw new DeveloperError(
	      "A number greater than or equal to 0 is required.",
	    );
	  }
	  //>>includeEnd('debug');

	  const length = factorials.length;
	  if (n >= length) {
	    let sum = factorials[length - 1];
	    for (let i = length; i <= n; i++) {
	      const next = sum * i;
	      factorials.push(next);
	      sum = next;
	    }
	  }
	  return factorials[n];
	};

	/**
	 * Increments a number with a wrapping to a minimum value if the number exceeds the maximum value.
	 *
	 * @param {number} [n] The number to be incremented.
	 * @param {number} [maximumValue] The maximum incremented value before rolling over to the minimum value.
	 * @param {number} [minimumValue=0.0] The number reset to after the maximum value has been exceeded.
	 * @returns {number} The incremented number.
	 *
	 * @exception {DeveloperError} Maximum value must be greater than minimum value.
	 *
	 * @example
	 * const n = Cesium.Math.incrementWrap(5, 10, 0); // returns 6
	 * const m = Cesium.Math.incrementWrap(10, 10, 0); // returns 0
	 */
	CesiumMath.incrementWrap = function (n, maximumValue, minimumValue) {
	  minimumValue = defaultValue(minimumValue, 0.0);

	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(n)) {
	    throw new DeveloperError("n is required.");
	  }
	  if (maximumValue <= minimumValue) {
	    throw new DeveloperError("maximumValue must be greater than minimumValue.");
	  }
	  //>>includeEnd('debug');

	  ++n;
	  if (n > maximumValue) {
	    n = minimumValue;
	  }
	  return n;
	};

	/**
	 * Determines if a non-negative integer is a power of two.
	 * The maximum allowed input is (2^32)-1 due to 32-bit bitwise operator limitation in Javascript.
	 *
	 * @param {number} n The integer to test in the range [0, (2^32)-1].
	 * @returns {boolean} <code>true</code> if the number if a power of two; otherwise, <code>false</code>.
	 *
	 * @exception {DeveloperError} A number between 0 and (2^32)-1 is required.
	 *
	 * @example
	 * const t = Cesium.Math.isPowerOfTwo(16); // true
	 * const f = Cesium.Math.isPowerOfTwo(20); // false
	 */
	CesiumMath.isPowerOfTwo = function (n) {
	  //>>includeStart('debug', pragmas.debug);
	  if (typeof n !== "number" || n < 0 || n > 4294967295) {
	    throw new DeveloperError("A number between 0 and (2^32)-1 is required.");
	  }
	  //>>includeEnd('debug');

	  return n !== 0 && (n & (n - 1)) === 0;
	};

	/**
	 * Computes the next power-of-two integer greater than or equal to the provided non-negative integer.
	 * The maximum allowed input is 2^31 due to 32-bit bitwise operator limitation in Javascript.
	 *
	 * @param {number} n The integer to test in the range [0, 2^31].
	 * @returns {number} The next power-of-two integer.
	 *
	 * @exception {DeveloperError} A number between 0 and 2^31 is required.
	 *
	 * @example
	 * const n = Cesium.Math.nextPowerOfTwo(29); // 32
	 * const m = Cesium.Math.nextPowerOfTwo(32); // 32
	 */
	CesiumMath.nextPowerOfTwo = function (n) {
	  //>>includeStart('debug', pragmas.debug);
	  if (typeof n !== "number" || n < 0 || n > 2147483648) {
	    throw new DeveloperError("A number between 0 and 2^31 is required.");
	  }
	  //>>includeEnd('debug');

	  // From http://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2
	  --n;
	  n |= n >> 1;
	  n |= n >> 2;
	  n |= n >> 4;
	  n |= n >> 8;
	  n |= n >> 16;
	  ++n;

	  return n;
	};

	/**
	 * Computes the previous power-of-two integer less than or equal to the provided non-negative integer.
	 * The maximum allowed input is (2^32)-1 due to 32-bit bitwise operator limitation in Javascript.
	 *
	 * @param {number} n The integer to test in the range [0, (2^32)-1].
	 * @returns {number} The previous power-of-two integer.
	 *
	 * @exception {DeveloperError} A number between 0 and (2^32)-1 is required.
	 *
	 * @example
	 * const n = Cesium.Math.previousPowerOfTwo(29); // 16
	 * const m = Cesium.Math.previousPowerOfTwo(32); // 32
	 */
	CesiumMath.previousPowerOfTwo = function (n) {
	  //>>includeStart('debug', pragmas.debug);
	  if (typeof n !== "number" || n < 0 || n > 4294967295) {
	    throw new DeveloperError("A number between 0 and (2^32)-1 is required.");
	  }
	  //>>includeEnd('debug');

	  n |= n >> 1;
	  n |= n >> 2;
	  n |= n >> 4;
	  n |= n >> 8;
	  n |= n >> 16;
	  n |= n >> 32;

	  // The previous bitwise operations implicitly convert to signed 32-bit. Use `>>>` to convert to unsigned
	  n = (n >>> 0) - (n >>> 1);

	  return n;
	};

	/**
	 * Constraint a value to lie between two values.
	 *
	 * @param {number} value The value to clamp.
	 * @param {number} min The minimum value.
	 * @param {number} max The maximum value.
	 * @returns {number} The clamped value such that min <= result <= max.
	 */
	CesiumMath.clamp = function (value, min, max) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("value", value);
	  Check.typeOf.number("min", min);
	  Check.typeOf.number("max", max);
	  //>>includeEnd('debug');

	  return value < min ? min : value > max ? max : value;
	};

	let randomNumberGenerator = new MersenneTwister();

	/**
	 * Sets the seed used by the random number generator
	 * in {@link CesiumMath#nextRandomNumber}.
	 *
	 * @param {number} seed An integer used as the seed.
	 */
	CesiumMath.setRandomNumberSeed = function (seed) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(seed)) {
	    throw new DeveloperError("seed is required.");
	  }
	  //>>includeEnd('debug');

	  randomNumberGenerator = new MersenneTwister(seed);
	};

	/**
	 * Generates a random floating point number in the range of [0.0, 1.0)
	 * using a Mersenne twister.
	 *
	 * @returns {number} A random number in the range of [0.0, 1.0).
	 *
	 * @see CesiumMath.setRandomNumberSeed
	 * @see {@link http://en.wikipedia.org/wiki/Mersenne_twister|Mersenne twister on Wikipedia}
	 */
	CesiumMath.nextRandomNumber = function () {
	  return randomNumberGenerator.random();
	};

	/**
	 * Generates a random number between two numbers.
	 *
	 * @param {number} min The minimum value.
	 * @param {number} max The maximum value.
	 * @returns {number} A random number between the min and max.
	 */
	CesiumMath.randomBetween = function (min, max) {
	  return CesiumMath.nextRandomNumber() * (max - min) + min;
	};

	/**
	 * Computes <code>Math.acos(value)</code>, but first clamps <code>value</code> to the range [-1.0, 1.0]
	 * so that the function will never return NaN.
	 *
	 * @param {number} value The value for which to compute acos.
	 * @returns {number} The acos of the value if the value is in the range [-1.0, 1.0], or the acos of -1.0 or 1.0,
	 *          whichever is closer, if the value is outside the range.
	 */
	CesiumMath.acosClamped = function (value) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(value)) {
	    throw new DeveloperError("value is required.");
	  }
	  //>>includeEnd('debug');
	  return Math.acos(CesiumMath.clamp(value, -1.0, 1.0));
	};

	/**
	 * Computes <code>Math.asin(value)</code>, but first clamps <code>value</code> to the range [-1.0, 1.0]
	 * so that the function will never return NaN.
	 *
	 * @param {number} value The value for which to compute asin.
	 * @returns {number} The asin of the value if the value is in the range [-1.0, 1.0], or the asin of -1.0 or 1.0,
	 *          whichever is closer, if the value is outside the range.
	 */
	CesiumMath.asinClamped = function (value) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(value)) {
	    throw new DeveloperError("value is required.");
	  }
	  //>>includeEnd('debug');
	  return Math.asin(CesiumMath.clamp(value, -1.0, 1.0));
	};

	/**
	 * Finds the chord length between two points given the circle's radius and the angle between the points.
	 *
	 * @param {number} angle The angle between the two points.
	 * @param {number} radius The radius of the circle.
	 * @returns {number} The chord length.
	 */
	CesiumMath.chordLength = function (angle, radius) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(angle)) {
	    throw new DeveloperError("angle is required.");
	  }
	  if (!defined(radius)) {
	    throw new DeveloperError("radius is required.");
	  }
	  //>>includeEnd('debug');
	  return 2.0 * radius * Math.sin(angle * 0.5);
	};

	/**
	 * Finds the logarithm of a number to a base.
	 *
	 * @param {number} number The number.
	 * @param {number} base The base.
	 * @returns {number} The result.
	 */
	CesiumMath.logBase = function (number, base) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(number)) {
	    throw new DeveloperError("number is required.");
	  }
	  if (!defined(base)) {
	    throw new DeveloperError("base is required.");
	  }
	  //>>includeEnd('debug');
	  return Math.log(number) / Math.log(base);
	};

	/**
	 * Finds the cube root of a number.
	 * Returns NaN if <code>number</code> is not provided.
	 *
	 * @function
	 * @param {number} [number] The number.
	 * @returns {number} The result.
	 */
	CesiumMath.cbrt = defaultValue(Math.cbrt, function cbrt(number) {
	  const result = Math.pow(Math.abs(number), 1.0 / 3.0);
	  return number < 0.0 ? -result : result;
	});

	/**
	 * Finds the base 2 logarithm of a number.
	 *
	 * @function
	 * @param {number} number The number.
	 * @returns {number} The result.
	 */
	CesiumMath.log2 = defaultValue(Math.log2, function log2(number) {
	  return Math.log(number) * Math.LOG2E;
	});

	/**
	 * Calculate the fog impact at a given distance. Useful for culling.
	 * Matches the equation in `fog.glsl`
	 * @private
	 */
	CesiumMath.fog = function (distanceToCamera, density) {
	  const scalar = distanceToCamera * density;
	  return 1.0 - Math.exp(-(scalar * scalar));
	};

	/**
	 * Computes a fast approximation of Atan for input in the range [-1, 1].
	 *
	 * Based on Michal Drobot's approximation from ShaderFastLibs,
	 * which in turn is based on "Efficient approximations for the arctangent function,"
	 * Rajan, S. Sichun Wang Inkol, R. Joyal, A., May 2006.
	 * Adapted from ShaderFastLibs under MIT License.
	 *
	 * @param {number} x An input number in the range [-1, 1]
	 * @returns {number} An approximation of atan(x)
	 */
	CesiumMath.fastApproximateAtan = function (x) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("x", x);
	  //>>includeEnd('debug');

	  return x * (-0.1784 * Math.abs(x) - 0.0663 * x * x + 1.0301);
	};

	/**
	 * Computes a fast approximation of Atan2(x, y) for arbitrary input scalars.
	 *
	 * Range reduction math based on nvidia's cg reference implementation: http://developer.download.nvidia.com/cg/atan2.html
	 *
	 * @param {number} x An input number that isn't zero if y is zero.
	 * @param {number} y An input number that isn't zero if x is zero.
	 * @returns {number} An approximation of atan2(x, y)
	 */
	CesiumMath.fastApproximateAtan2 = function (x, y) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("x", x);
	  Check.typeOf.number("y", y);
	  //>>includeEnd('debug');

	  // atan approximations are usually only reliable over [-1, 1]
	  // So reduce the range by flipping whether x or y is on top based on which is bigger.
	  let opposite;
	  let t = Math.abs(x); // t used as swap and atan result.
	  opposite = Math.abs(y);
	  const adjacent = Math.max(t, opposite);
	  opposite = Math.min(t, opposite);

	  const oppositeOverAdjacent = opposite / adjacent;
	  //>>includeStart('debug', pragmas.debug);
	  if (isNaN(oppositeOverAdjacent)) {
	    throw new DeveloperError("either x or y must be nonzero");
	  }
	  //>>includeEnd('debug');
	  t = CesiumMath.fastApproximateAtan(oppositeOverAdjacent);

	  // Undo range reduction
	  t = Math.abs(y) > Math.abs(x) ? CesiumMath.PI_OVER_TWO - t : t;
	  t = x < 0.0 ? CesiumMath.PI - t : t;
	  t = y < 0.0 ? -t : t;
	  return t;
	};

	/**
	 * Clones an object, returning a new object containing the same properties.
	 *
	 * @function
	 *
	 * @param {object} object The object to clone.
	 * @param {boolean} [deep=false] If true, all properties will be deep cloned recursively.
	 * @returns {object} The cloned object.
	 */
	function clone(object, deep) {
	  if (object === null || typeof object !== "object") {
	    return object;
	  }

	  deep = defaultValue(deep, false);

	  const result = new object.constructor();
	  for (const propertyName in object) {
	    if (object.hasOwnProperty(propertyName)) {
	      let value = object[propertyName];
	      if (deep) {
	        value = clone(value, deep);
	      }
	      result[propertyName] = value;
	    }
	  }

	  return result;
	}

	/**
	 * Merges two objects, copying their properties onto a new combined object. When two objects have the same
	 * property, the value of the property on the first object is used.  If either object is undefined,
	 * it will be treated as an empty object.
	 *
	 * @example
	 * const object1 = {
	 *     propOne : 1,
	 *     propTwo : {
	 *         value1 : 10
	 *     }
	 * }
	 * const object2 = {
	 *     propTwo : 2
	 * }
	 * const final = Cesium.combine(object1, object2);
	 *
	 * // final === {
	 * //     propOne : 1,
	 * //     propTwo : {
	 * //         value1 : 10
	 * //     }
	 * // }
	 *
	 * @param {object} [object1] The first object to merge.
	 * @param {object} [object2] The second object to merge.
	 * @param {boolean} [deep=false] Perform a recursive merge.
	 * @returns {object} The combined object containing all properties from both objects.
	 *
	 * @function
	 */
	function combine(object1, object2, deep) {
	  deep = defaultValue(deep, false);

	  const result = {};

	  const object1Defined = defined(object1);
	  const object2Defined = defined(object2);
	  let property;
	  let object1Value;
	  let object2Value;
	  if (object1Defined) {
	    for (property in object1) {
	      if (object1.hasOwnProperty(property)) {
	        object1Value = object1[property];
	        if (
	          object2Defined &&
	          deep &&
	          typeof object1Value === "object" &&
	          object2.hasOwnProperty(property)
	        ) {
	          object2Value = object2[property];
	          if (typeof object2Value === "object") {
	            result[property] = combine(object1Value, object2Value, deep);
	          } else {
	            result[property] = object1Value;
	          }
	        } else {
	          result[property] = object1Value;
	        }
	      }
	    }
	  }
	  if (object2Defined) {
	    for (property in object2) {
	      if (
	        object2.hasOwnProperty(property) &&
	        !result.hasOwnProperty(property)
	      ) {
	        object2Value = object2[property];
	        result[property] = object2Value;
	      }
	    }
	  }
	  return result;
	}

	// module.exports = loadMtl;

	/**
	 * Parse a .mtl file and load textures referenced within. Returns an array of glTF materials with Texture
	 * objects stored in the texture slots.
	 * <p>
	 * Packed PBR textures (like metallicRoughnessOcclusion and specularGlossiness) require all input textures to be decoded before hand.
	 * If a texture is of an unsupported format like .gif or .tga it can't be packed and a metallicRoughness texture will not be created.
	 * Similarly if a texture cannot be found it will be ignored and a default value will be used instead.
	 * </p>
	 *
	 * @param {String} mtlPath Path to the .mtl file.
	 * @param {Object} options The options object passed along from lib/obj2gltf.js
	 * @returns {Promise} A promise resolving to an array of glTF materials with Texture objects stored in the texture slots.
	 *
	 * @private
	 */
	function loadMtl(mtlPath, options) {
	  let material;
	  let values;
	  let value;

	  const mtlDirectory = path.dirname(mtlPath);
	  const materials = [];
	  const texturePromiseMap = {}; // Maps texture paths to load promises so that no texture is loaded twice
	  const texturePromises = [];

	  const overridingTextures = options.overridingTextures;
	  const overridingSpecularTexture = defaultValue(
	    overridingTextures.metallicRoughnessOcclusionTexture,
	    overridingTextures.specularGlossinessTexture,
	  );
	  const overridingSpecularShininessTexture = defaultValue(
	    overridingTextures.metallicRoughnessOcclusionTexture,
	    overridingTextures.specularGlossinessTexture,
	  );
	  const overridingAmbientTexture = defaultValue(
	    overridingTextures.metallicRoughnessOcclusionTexture,
	    overridingTextures.occlusionTexture,
	  );
	  const overridingNormalTexture = overridingTextures.normalTexture;
	  const overridingDiffuseTexture = overridingTextures.baseColorTexture;
	  const overridingEmissiveTexture = overridingTextures.emissiveTexture;
	  const overridingAlphaTexture = overridingTextures.alphaTexture;

	  // Textures that are packed into PBR textures need to be decoded first
	  const decodeOptions = {
	    decode: true,
	  };

	  const diffuseTextureOptions = {
	    checkTransparency: options.checkTransparency,
	  };

	  const ambientTextureOptions = defined(overridingAmbientTexture)
	    ? undefined
	    : options.packOcclusion
	      ? decodeOptions
	      : undefined;
	  const specularTextureOptions = defined(overridingSpecularTexture)
	    ? undefined
	    : decodeOptions;
	  const specularShinessTextureOptions = defined(
	    overridingSpecularShininessTexture,
	  )
	    ? undefined
	    : decodeOptions;
	  const emissiveTextureOptions = undefined;
	  const normalTextureOptions = undefined;
	  const alphaTextureOptions = {
	    decode: true,
	  };

	  function createMaterial(name) {
	    material = new Material();
	    material.name = name;
	    material.specularShininess = options.metallicRoughness ? 1.0 : 0.0;
	    material.specularTexture = overridingSpecularTexture;
	    material.specularShininessTexture = overridingSpecularShininessTexture;
	    material.diffuseTexture = overridingDiffuseTexture;
	    material.ambientTexture = overridingAmbientTexture;
	    material.normalTexture = overridingNormalTexture;
	    material.emissiveTexture = overridingEmissiveTexture;
	    material.alphaTexture = overridingAlphaTexture;
	    materials.push(material);
	  }

	  function normalizeTexturePath(texturePath, mtlDirectory) {
	    //Remove double quotes around the texture file if it exists
	    texturePath = texturePath.replace(/^"(.+)"$/, "$1");
	    // Removes texture options from texture name
	    // Assumes no spaces in texture name
	    const re = /-(bm|t|s|o|blendu|blendv|boost|mm|texres|clamp|imfchan|type)/;
	    if (re.test(texturePath)) {
	      texturePath = texturePath.split(/\s+/).pop();
	    }
	    texturePath = texturePath.replace(/\\/g, "/");
	    return path.normalize(path.resolve(mtlDirectory, texturePath));
	  }

	  function parseLine(line) {
	    line = line.trim();
	    if (/^newmtl/i.test(line)) {
	      const name = line.substring(7).trim();
	      createMaterial(name);
	    } else if (/^Ka /i.test(line)) {
	      values = line.substring(3).trim().split(" ");
	      material.ambientColor = [
	        parseFloat(values[0]),
	        parseFloat(values[1]),
	        parseFloat(values[2]),
	        1.0,
	      ];
	    } else if (/^Ke /i.test(line)) {
	      values = line.substring(3).trim().split(" ");
	      material.emissiveColor = [
	        parseFloat(values[0]),
	        parseFloat(values[1]),
	        parseFloat(values[2]),
	        1.0,
	      ];
	    } else if (/^Kd /i.test(line)) {
	      values = line.substring(3).trim().split(" ");
	      material.diffuseColor = [
	        parseFloat(values[0]),
	        parseFloat(values[1]),
	        parseFloat(values[2]),
	        1.0,
	      ];
	    } else if (/^Ks /i.test(line)) {
	      values = line.substring(3).trim().split(" ");
	      material.specularColor = [
	        parseFloat(values[0]),
	        parseFloat(values[1]),
	        parseFloat(values[2]),
	        1.0,
	      ];
	    } else if (/^Ns /i.test(line)) {
	      value = line.substring(3).trim();
	      material.specularShininess = parseFloat(value);
	    } else if (/^d /i.test(line)) {
	      value = line.substring(2).trim();
	      material.alpha = correctAlpha(parseFloat(value));
	    } else if (/^Tr /i.test(line)) {
	      value = line.substring(3).trim();
	      material.alpha = correctAlpha(1.0 - parseFloat(value));
	    } else if (/^map_Ka /i.test(line)) {
	      if (!defined(overridingAmbientTexture)) {
	        material.ambientTexture = normalizeTexturePath(
	          line.substring(7).trim(),
	          mtlDirectory,
	        );
	      }
	    } else if (/^map_Ke /i.test(line)) {
	      if (!defined(overridingEmissiveTexture)) {
	        material.emissiveTexture = normalizeTexturePath(
	          line.substring(7).trim(),
	          mtlDirectory,
	        );
	      }
	    } else if (/^map_Kd /i.test(line)) {
	      if (!defined(overridingDiffuseTexture)) {
	        material.diffuseTexture = normalizeTexturePath(
	          line.substring(7).trim(),
	          mtlDirectory,
	        );
	      }
	    } else if (/^map_Ks /i.test(line)) {
	      if (!defined(overridingSpecularTexture)) {
	        material.specularTexture = normalizeTexturePath(
	          line.substring(7).trim(),
	          mtlDirectory,
	        );
	      }
	    } else if (/^map_Ns /i.test(line)) {
	      if (!defined(overridingSpecularShininessTexture)) {
	        material.specularShininessTexture = normalizeTexturePath(
	          line.substring(7).trim(),
	          mtlDirectory,
	        );
	      }
	    } else if (/^map_Bump /i.test(line)) {
	      if (!defined(overridingNormalTexture)) {
	        material.normalTexture = normalizeTexturePath(
	          line.substring(9).trim(),
	          mtlDirectory,
	        );
	      }
	    } else if (/^map_d /i.test(line)) {
	      if (!defined(overridingAlphaTexture)) {
	        material.alphaTexture = normalizeTexturePath(
	          line.substring(6).trim(),
	          mtlDirectory,
	        );
	      }
	    }
	  }

	  function loadMaterialTextures(material) {
	    // If an alpha texture is present the diffuse texture needs to be decoded so they can be packed together
	    const diffuseAlphaTextureOptions = defined(material.alphaTexture)
	      ? alphaTextureOptions
	      : diffuseTextureOptions;

	    if (material.diffuseTexture === material.ambientTexture) {
	      // OBJ models are often exported with the same texture in the diffuse and ambient slots but this is typically not desirable, particularly
	      // when saving with PBR materials where the ambient texture is treated as the occlusion texture.
	      material.ambientTexture = undefined;
	    }

	    const textureNames = [
	      "diffuseTexture",
	      "ambientTexture",
	      "emissiveTexture",
	      "specularTexture",
	      "specularShininessTexture",
	      "normalTexture",
	      "alphaTexture",
	    ];
	    const textureOptions = [
	      diffuseAlphaTextureOptions,
	      ambientTextureOptions,
	      emissiveTextureOptions,
	      specularTextureOptions,
	      specularShinessTextureOptions,
	      normalTextureOptions,
	      alphaTextureOptions,
	    ];

	    const sharedOptions = {};
	    textureNames.forEach(function (name, index) {
	      const texturePath = material[name];
	      const originalOptions = textureOptions[index];
	      if (defined(texturePath) && defined(originalOptions)) {
	        if (!defined(sharedOptions[texturePath])) {
	          sharedOptions[texturePath] = clone(originalOptions);
	        }
	        const options = sharedOptions[texturePath];
	        options.checkTransparency =
	          options.checkTransparency || originalOptions.checkTransparency;
	        options.decode = options.decode || originalOptions.decode;
	        options.keepSource =
	          options.keepSource ||
	          !originalOptions.decode ||
	          !originalOptions.checkTransparency;
	      }
	    });

	    textureNames.forEach(function (name) {
	      const texturePath = material[name];
	      if (defined(texturePath)) {
	        loadMaterialTexture(
	          material,
	          name,
	          sharedOptions[texturePath],
	          mtlDirectory,
	          texturePromiseMap,
	          texturePromises,
	          options,
	        );
	      }
	    });
	  }

	  return readLines(mtlPath, parseLine)
	    .then(function () {
	      const length = materials.length;
	      for (let i = 0; i < length; ++i) {
	        loadMaterialTextures(materials[i]);
	      }
	      return bluebirdExports.Promise.all(texturePromises);
	    })
	    .then(function () {
	      return convertMaterials(materials, options);
	    });
	}

	function correctAlpha(alpha) {
	  // An alpha of 0.0 usually implies a problem in the export, change to 1.0 instead
	  return alpha === 0.0 ? 1.0 : alpha;
	}

	function Material() {
	  this.name = undefined;
	  this.ambientColor = [0.0, 0.0, 0.0, 1.0]; // Ka
	  this.emissiveColor = [0.0, 0.0, 0.0, 1.0]; // Ke
	  this.diffuseColor = [0.5, 0.5, 0.5, 1.0]; // Kd
	  this.specularColor = [0.0, 0.0, 0.0, 1.0]; // Ks
	  this.specularShininess = 0.0; // Ns
	  this.alpha = 1.0; // d / Tr
	  this.ambientTexture = undefined; // map_Ka
	  this.emissiveTexture = undefined; // map_Ke
	  this.diffuseTexture = undefined; // map_Kd
	  this.specularTexture = undefined; // map_Ks
	  this.specularShininessTexture = undefined; // map_Ns
	  this.normalTexture = undefined; // map_Bump
	  this.alphaTexture = undefined; // map_d
	}

	loadMtl.getDefaultMaterial = function (options) {
	  return convertMaterial(new Material(), options);
	};

	// Exposed for testing
	loadMtl._createMaterial = function (materialOptions, options) {
	  return convertMaterial(combine(materialOptions, new Material()), options);
	};

	function loadMaterialTexture(
	  material,
	  name,
	  textureOptions,
	  mtlDirectory,
	  texturePromiseMap,
	  texturePromises,
	  options,
	) {
	  const texturePath = material[name];
	  if (!defined(texturePath)) {
	    return;
	  }

	  let texturePromise = texturePromiseMap[texturePath];
	  if (!defined(texturePromise)) {
	    const shallowPath = path.join(mtlDirectory, path.basename(texturePath));
	    // if (options.secure && outsideDirectory(texturePath, mtlDirectory)) {
	    //   // Try looking for the texture in the same directory as the obj
	    //   options.logger(
	    //     "Texture file is outside of the mtl directory and the secure flag is true. Attempting to read the texture file from within the obj directory instead.",
	    //   );
	    //   texturePromise = loadTexture(shallowPath, textureOptions).catch(
	    //     function (error) {
	    //       options.logger(error.message);
	    //       options.logger(
	    //         `Could not read texture file at ${shallowPath}. This texture will be ignored`,
	    //       );
	    //     },
	    //   );
	    // } else {
	    texturePromise = loadTexture(texturePath, textureOptions)
	      .catch(function (error) {
	        // Try looking for the texture in the same directory as the obj
	        options.logger(error.message);
	        options.logger(
	          `Could not read texture file at ${texturePath}. Attempting to read the texture file from within the obj directory instead.`,
	        );
	        return loadTexture(shallowPath, textureOptions);
	      })
	      .catch(function (error) {
	        options.logger(error.message);
	        options.logger(
	          `Could not read texture file at ${shallowPath}. This texture will be ignored.`,
	        );
	      });
	    // }
	    texturePromiseMap[texturePath] = texturePromise;
	  }

	  texturePromises.push(
	    texturePromise.then(function (texture) {
	      material[name] = texture;
	    }),
	  );
	}

	function convertMaterial(material, options) {
	  if (options.specularGlossiness) {
	    return createSpecularGlossinessMaterial(material, options);
	  } else if (options.metallicRoughness) {
	    return createMetallicRoughnessMaterial(material, options);
	  }
	  // No material type specified, convert the material to metallic roughness
	  convertTraditionalToMetallicRoughness(material);
	  return createMetallicRoughnessMaterial(material, options);
	}

	function convertMaterials(materials, options) {
	  return materials.map(function (material) {
	    return convertMaterial(material, options);
	  });
	}

	function resizeChannel(
	  sourcePixels,
	  sourceWidth,
	  sourceHeight,
	  targetPixels,
	  targetWidth,
	  targetHeight,
	) {
	  // Nearest neighbor sampling
	  const widthRatio = sourceWidth / targetWidth;
	  const heightRatio = sourceHeight / targetHeight;

	  for (let y = 0; y < targetHeight; ++y) {
	    for (let x = 0; x < targetWidth; ++x) {
	      const targetIndex = y * targetWidth + x;
	      const sourceY = Math.round(y * heightRatio);
	      const sourceX = Math.round(x * widthRatio);
	      const sourceIndex = sourceY * sourceWidth + sourceX;
	      const sourceValue = sourcePixels.readUInt8(sourceIndex);
	      targetPixels.writeUInt8(sourceValue, targetIndex);
	    }
	  }
	  return targetPixels;
	}

	let scratchResizeChannel;

	function getTextureChannel(
	  texture,
	  index,
	  targetWidth,
	  targetHeight,
	  targetChannel,
	) {
	  const pixels = texture.pixels; // RGBA
	  const sourceWidth = texture.width;
	  const sourceHeight = texture.height;
	  const sourcePixelsLength = sourceWidth * sourceHeight;
	  const targetPixelsLength = targetWidth * targetHeight;

	  // Allocate the scratchResizeChannel on demand if the texture needs to be resized
	  let sourceChannel = targetChannel;
	  if (sourcePixelsLength > targetPixelsLength) {
	    if (
	      !defined(scratchResizeChannel) ||
	      sourcePixelsLength > scratchResizeChannel.length
	    ) {
	      scratchResizeChannel = Buffer.alloc(sourcePixelsLength);
	    }
	    sourceChannel = scratchResizeChannel;
	  }

	  for (let i = 0; i < sourcePixelsLength; ++i) {
	    const value = pixels.readUInt8(i * 4 + index);
	    sourceChannel.writeUInt8(value, i);
	  }

	  if (sourcePixelsLength > targetPixelsLength) {
	    resizeChannel(
	      sourceChannel,
	      sourceWidth,
	      sourceHeight,
	      targetChannel,
	      targetWidth,
	      targetHeight,
	    );
	  }

	  return targetChannel;
	}

	function writeChannel(pixels, channel, index) {
	  const pixelsLength = pixels.length / 4;
	  for (let i = 0; i < pixelsLength; ++i) {
	    const value = channel.readUInt8(i);
	    pixels.writeUInt8(value, i * 4 + index);
	  }
	}

	function getMinimumDimensions(textures, options) {
	  let width = Number.POSITIVE_INFINITY;
	  let height = Number.POSITIVE_INFINITY;

	  const length = textures.length;
	  for (let i = 0; i < length; ++i) {
	    const texture = textures[i];
	    width = Math.min(texture.width, width);
	    height = Math.min(texture.height, height);
	  }

	  for (let i = 0; i < length; ++i) {
	    const texture = textures[i];
	    if (texture.width !== width || texture.height !== height) {
	      options.logger(
	        `Texture ${texture.path} will be scaled from ${texture.width}x${texture.height} to ${width}x${height}.`,
	      );
	    }
	  }

	  return [width, height];
	}

	function isChannelSingleColor(buffer) {
	  const first = buffer.readUInt8(0);
	  const length = buffer.length;
	  for (let i = 1; i < length; ++i) {
	    if (buffer[i] !== first) {
	      return false;
	    }
	  }
	  return true;
	}

	function createDiffuseAlphaTexture(diffuseTexture, alphaTexture, options) {
	  const packDiffuse = defined(diffuseTexture);
	  const packAlpha = defined(alphaTexture);

	  if (!packDiffuse) {
	    return undefined;
	  }

	  if (!packAlpha) {
	    return diffuseTexture;
	  }

	  if (diffuseTexture === alphaTexture) {
	    return diffuseTexture;
	  }

	  if (!defined(diffuseTexture.pixels) || !defined(alphaTexture.pixels)) {
	    options.logger(
	      `Could not get decoded texture data for ${diffuseTexture.path} or ${alphaTexture.path}. The material will be created without an alpha texture.`,
	    );
	    return diffuseTexture;
	  }

	  const packedTextures = [diffuseTexture, alphaTexture];
	  const dimensions = getMinimumDimensions(packedTextures, options);
	  const width = dimensions[0];
	  const height = dimensions[1];
	  const pixelsLength = width * height;
	  const pixels = Buffer.alloc(pixelsLength * 4, 0xff); // Initialize with 4 channels
	  const scratchChannel = Buffer.alloc(pixelsLength);

	  // Write into the R, G, B channels
	  const redChannel = getTextureChannel(
	    diffuseTexture,
	    0,
	    width,
	    height,
	    scratchChannel,
	  );
	  writeChannel(pixels, redChannel, 0);
	  const greenChannel = getTextureChannel(
	    diffuseTexture,
	    1,
	    width,
	    height,
	    scratchChannel,
	  );
	  writeChannel(pixels, greenChannel, 1);
	  const blueChannel = getTextureChannel(
	    diffuseTexture,
	    2,
	    width,
	    height,
	    scratchChannel,
	  );
	  writeChannel(pixels, blueChannel, 2);

	  // First try reading the alpha component from the alpha channel, but if it is a single color read from the red channel instead.
	  let alphaChannel = getTextureChannel(
	    alphaTexture,
	    3,
	    width,
	    height,
	    scratchChannel,
	  );
	  if (isChannelSingleColor(alphaChannel)) {
	    alphaChannel = getTextureChannel(
	      alphaTexture,
	      0,
	      width,
	      height,
	      scratchChannel,
	    );
	  }
	  writeChannel(pixels, alphaChannel, 3);

	  const texture = new Texture();
	  texture.name = diffuseTexture.name;
	  texture.extension = ".png";
	  texture.pixels = pixels;
	  texture.width = width;
	  texture.height = height;
	  texture.transparent = true;

	  return texture;
	}

	function createMetallicRoughnessTexture(
	  metallicTexture,
	  roughnessTexture,
	  occlusionTexture,
	  options,
	) {
	  if (defined(options.overridingTextures.metallicRoughnessOcclusionTexture)) {
	    return metallicTexture;
	  }

	  const packMetallic = defined(metallicTexture);
	  const packRoughness = defined(roughnessTexture);
	  const packOcclusion = defined(occlusionTexture) && options.packOcclusion;

	  if (!packMetallic && !packRoughness) {
	    return undefined;
	  }

	  if (packMetallic && !defined(metallicTexture.pixels)) {
	    options.logger(
	      `Could not get decoded texture data for ${metallicTexture.path}. The material will be created without a metallicRoughness texture.`,
	    );
	    return undefined;
	  }

	  if (packRoughness && !defined(roughnessTexture.pixels)) {
	    options.logger(
	      `Could not get decoded texture data for ${roughnessTexture.path}. The material will be created without a metallicRoughness texture.`,
	    );
	    return undefined;
	  }

	  if (packOcclusion && !defined(occlusionTexture.pixels)) {
	    options.logger(
	      `Could not get decoded texture data for ${occlusionTexture.path}. The occlusion texture will not be packed in the metallicRoughness texture.`,
	    );
	    return undefined;
	  }

	  const packedTextures = [
	    metallicTexture,
	    roughnessTexture,
	    occlusionTexture,
	  ].filter(function (texture) {
	    return defined(texture) && defined(texture.pixels);
	  });

	  const dimensions = getMinimumDimensions(packedTextures, options);
	  const width = dimensions[0];
	  const height = dimensions[1];
	  const pixelsLength = width * height;
	  const pixels = Buffer.alloc(pixelsLength * 4, 0xff); // Initialize with 4 channels, unused channels will be white
	  const scratchChannel = Buffer.alloc(pixelsLength);

	  if (packMetallic) {
	    // Write into the B channel
	    const metallicChannel = getTextureChannel(
	      metallicTexture,
	      0,
	      width,
	      height,
	      scratchChannel,
	    );
	    writeChannel(pixels, metallicChannel, 2);
	  }

	  if (packRoughness) {
	    // Write into the G channel
	    const roughnessChannel = getTextureChannel(
	      roughnessTexture,
	      0,
	      width,
	      height,
	      scratchChannel,
	    );
	    writeChannel(pixels, roughnessChannel, 1);
	  }

	  if (packOcclusion) {
	    // Write into the R channel
	    const occlusionChannel = getTextureChannel(
	      occlusionTexture,
	      0,
	      width,
	      height,
	      scratchChannel,
	    );
	    writeChannel(pixels, occlusionChannel, 0);
	  }

	  const length = packedTextures.length;
	  const names = new Array(length);
	  for (let i = 0; i < length; ++i) {
	    names[i] = packedTextures[i].name;
	  }
	  const name = names.join("_");

	  const texture = new Texture();
	  texture.name = name;
	  texture.extension = ".png";
	  texture.pixels = pixels;
	  texture.width = width;
	  texture.height = height;

	  return texture;
	}

	function createSpecularGlossinessTexture(
	  specularTexture,
	  glossinessTexture,
	  options,
	) {
	  if (defined(options.overridingTextures.specularGlossinessTexture)) {
	    return specularTexture;
	  }

	  const packSpecular = defined(specularTexture);
	  const packGlossiness = defined(glossinessTexture);

	  if (!packSpecular && !packGlossiness) {
	    return undefined;
	  }

	  if (packSpecular && !defined(specularTexture.pixels)) {
	    options.logger(
	      `Could not get decoded texture data for ${specularTexture.path}. The material will be created without a specularGlossiness texture.`,
	    );
	    return undefined;
	  }

	  if (packGlossiness && !defined(glossinessTexture.pixels)) {
	    options.logger(
	      `Could not get decoded texture data for ${glossinessTexture.path}. The material will be created without a specularGlossiness texture.`,
	    );
	    return undefined;
	  }

	  const packedTextures = [specularTexture, glossinessTexture].filter(
	    function (texture) {
	      return defined(texture) && defined(texture.pixels);
	    },
	  );

	  const dimensions = getMinimumDimensions(packedTextures, options);
	  const width = dimensions[0];
	  const height = dimensions[1];
	  const pixelsLength = width * height;
	  const pixels = Buffer.alloc(pixelsLength * 4, 0xff); // Initialize with 4 channels, unused channels will be white
	  const scratchChannel = Buffer.alloc(pixelsLength);

	  if (packSpecular) {
	    // Write into the R, G, B channels
	    const redChannel = getTextureChannel(
	      specularTexture,
	      0,
	      width,
	      height,
	      scratchChannel,
	    );
	    writeChannel(pixels, redChannel, 0);
	    const greenChannel = getTextureChannel(
	      specularTexture,
	      1,
	      width,
	      height,
	      scratchChannel,
	    );
	    writeChannel(pixels, greenChannel, 1);
	    const blueChannel = getTextureChannel(
	      specularTexture,
	      2,
	      width,
	      height,
	      scratchChannel,
	    );
	    writeChannel(pixels, blueChannel, 2);
	  }

	  if (packGlossiness) {
	    // Write into the A channel
	    const glossinessChannel = getTextureChannel(
	      glossinessTexture,
	      0,
	      width,
	      height,
	      scratchChannel,
	    );
	    writeChannel(pixels, glossinessChannel, 3);
	  }

	  const length = packedTextures.length;
	  const names = new Array(length);
	  for (let i = 0; i < length; ++i) {
	    names[i] = packedTextures[i].name;
	  }
	  const name = names.join("_");

	  const texture = new Texture();
	  texture.name = name;
	  texture.extension = ".png";
	  texture.pixels = pixels;
	  texture.width = width;
	  texture.height = height;

	  return texture;
	}

	function createSpecularGlossinessMaterial(material, options) {
	  const emissiveTexture = material.emissiveTexture;
	  const normalTexture = material.normalTexture;
	  const occlusionTexture = material.ambientTexture;
	  const diffuseTexture = material.diffuseTexture;
	  const alphaTexture = material.alphaTexture;
	  const specularTexture = material.specularTexture;
	  const glossinessTexture = material.specularShininessTexture;
	  const specularGlossinessTexture = createSpecularGlossinessTexture(
	    specularTexture,
	    glossinessTexture,
	    options,
	  );
	  const diffuseAlphaTexture = createDiffuseAlphaTexture(
	    diffuseTexture,
	    alphaTexture,
	    options,
	  );

	  let emissiveFactor = material.emissiveColor.slice(0, 3);
	  let diffuseFactor = material.diffuseColor;
	  let specularFactor = material.specularColor.slice(0, 3);
	  let glossinessFactor = material.specularShininess;

	  if (defined(emissiveTexture)) {
	    emissiveFactor = [1.0, 1.0, 1.0];
	  }

	  if (defined(diffuseTexture)) {
	    diffuseFactor = [1.0, 1.0, 1.0, 1.0];
	  }

	  if (defined(specularTexture)) {
	    specularFactor = [1.0, 1.0, 1.0];
	  }

	  if (defined(glossinessTexture)) {
	    glossinessFactor = 1.0;
	  }

	  let transparent = false;
	  if (defined(alphaTexture)) {
	    transparent = true;
	  } else {
	    const alpha = material.alpha;
	    diffuseFactor[3] = alpha;
	    transparent = alpha < 1.0;
	  }

	  if (defined(diffuseTexture)) {
	    transparent = transparent || diffuseTexture.transparent;
	  }

	  const doubleSided = transparent || options.doubleSidedMaterial;
	  const alphaMode = transparent ? "BLEND" : "OPAQUE";

	  return {
	    name: material.name,
	    extensions: {
	      KHR_materials_pbrSpecularGlossiness: {
	        diffuseTexture: diffuseAlphaTexture,
	        specularGlossinessTexture: specularGlossinessTexture,
	        diffuseFactor: diffuseFactor,
	        specularFactor: specularFactor,
	        glossinessFactor: glossinessFactor,
	      },
	    },
	    emissiveTexture: emissiveTexture,
	    normalTexture: normalTexture,
	    occlusionTexture: occlusionTexture,
	    emissiveFactor: emissiveFactor,
	    alphaMode: alphaMode,
	    doubleSided: doubleSided,
	  };
	}

	function createMetallicRoughnessMaterial(material, options) {
	  const emissiveTexture = material.emissiveTexture;
	  const normalTexture = material.normalTexture;
	  let occlusionTexture = material.ambientTexture;
	  const baseColorTexture = material.diffuseTexture;
	  const alphaTexture = material.alphaTexture;
	  const metallicTexture = material.specularTexture;
	  const roughnessTexture = material.specularShininessTexture;
	  const metallicRoughnessTexture = createMetallicRoughnessTexture(
	    metallicTexture,
	    roughnessTexture,
	    occlusionTexture,
	    options,
	  );
	  const diffuseAlphaTexture = createDiffuseAlphaTexture(
	    baseColorTexture,
	    alphaTexture,
	    options,
	  );

	  if (options.packOcclusion) {
	    occlusionTexture = metallicRoughnessTexture;
	  }

	  let emissiveFactor = material.emissiveColor.slice(0, 3);
	  let baseColorFactor = material.diffuseColor;
	  let metallicFactor = material.specularColor[0];
	  let roughnessFactor = material.specularShininess;

	  if (defined(emissiveTexture)) {
	    emissiveFactor = [1.0, 1.0, 1.0];
	  }

	  if (defined(baseColorTexture)) {
	    baseColorFactor = [1.0, 1.0, 1.0, 1.0];
	  }

	  if (defined(metallicTexture)) {
	    metallicFactor = 1.0;
	  }

	  if (defined(roughnessTexture)) {
	    roughnessFactor = 1.0;
	  }

	  let transparent = false;
	  if (defined(alphaTexture)) {
	    transparent = true;
	  } else {
	    const alpha = material.alpha;
	    baseColorFactor[3] = alpha;
	    transparent = alpha < 1.0;
	  }

	  if (defined(baseColorTexture)) {
	    transparent = transparent || baseColorTexture.transparent;
	  }

	  const doubleSided = transparent || options.doubleSidedMaterial;
	  const alphaMode = transparent ? "BLEND" : "OPAQUE";

	  return {
	    name: material.name,
	    pbrMetallicRoughness: {
	      baseColorTexture: diffuseAlphaTexture,
	      metallicRoughnessTexture: metallicRoughnessTexture,
	      baseColorFactor: baseColorFactor,
	      metallicFactor: metallicFactor,
	      roughnessFactor: roughnessFactor,
	    },
	    emissiveTexture: emissiveTexture,
	    normalTexture: normalTexture,
	    occlusionTexture: occlusionTexture,
	    emissiveFactor: emissiveFactor,
	    alphaMode: alphaMode,
	    doubleSided: doubleSided,
	  };
	}

	function luminance(color) {
	  return color[0] * 0.2125 + color[1] * 0.7154 + color[2] * 0.0721;
	}

	function convertTraditionalToMetallicRoughness(material) {
	  // Translate the blinn-phong model to the pbr metallic-roughness model
	  // Roughness factor is a combination of specular intensity and shininess
	  // Metallic factor is 0.0
	  // Textures are not converted for now
	  const specularIntensity = luminance(material.specularColor);

	  // Transform from 0-1000 range to 0-1 range. Then invert.
	  let roughnessFactor = material.specularShininess;
	  roughnessFactor = roughnessFactor / 1000.0;
	  roughnessFactor = 1.0 - roughnessFactor;
	  roughnessFactor = CesiumMath.clamp(roughnessFactor, 0.0, 1.0);

	  // Low specular intensity values should produce a rough material even if shininess is high.
	  if (specularIntensity < 0.1) {
	    roughnessFactor *= 1.0 - specularIntensity;
	  }

	  const metallicFactor = 0.0;

	  material.specularColor = [
	    metallicFactor,
	    metallicFactor,
	    metallicFactor,
	    1.0,
	  ];
	  material.specularShininess = roughnessFactor;
	}

	/**
	 * A 3D Cartesian point.
	 * @alias Cartesian3
	 * @constructor
	 *
	 * @param {number} [x=0.0] The X component.
	 * @param {number} [y=0.0] The Y component.
	 * @param {number} [z=0.0] The Z component.
	 *
	 * @see Cartesian2
	 * @see Cartesian4
	 * @see Packable
	 */
	function Cartesian3(x, y, z) {
	  /**
	   * The X component.
	   * @type {number}
	   * @default 0.0
	   */
	  this.x = defaultValue(x, 0.0);

	  /**
	   * The Y component.
	   * @type {number}
	   * @default 0.0
	   */
	  this.y = defaultValue(y, 0.0);

	  /**
	   * The Z component.
	   * @type {number}
	   * @default 0.0
	   */
	  this.z = defaultValue(z, 0.0);
	}

	/**
	 * Converts the provided Spherical into Cartesian3 coordinates.
	 *
	 * @param {Spherical} spherical The Spherical to be converted to Cartesian3.
	 * @param {Cartesian3} [result] The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
	 */
	Cartesian3.fromSpherical = function (spherical, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("spherical", spherical);
	  //>>includeEnd('debug');

	  if (!defined(result)) {
	    result = new Cartesian3();
	  }

	  const clock = spherical.clock;
	  const cone = spherical.cone;
	  const magnitude = defaultValue(spherical.magnitude, 1.0);
	  const radial = magnitude * Math.sin(cone);
	  result.x = radial * Math.cos(clock);
	  result.y = radial * Math.sin(clock);
	  result.z = magnitude * Math.cos(cone);
	  return result;
	};

	/**
	 * Creates a Cartesian3 instance from x, y and z coordinates.
	 *
	 * @param {number} x The x coordinate.
	 * @param {number} y The y coordinate.
	 * @param {number} z The z coordinate.
	 * @param {Cartesian3} [result] The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
	 */
	Cartesian3.fromElements = function (x, y, z, result) {
	  if (!defined(result)) {
	    return new Cartesian3(x, y, z);
	  }

	  result.x = x;
	  result.y = y;
	  result.z = z;
	  return result;
	};

	/**
	 * Duplicates a Cartesian3 instance.
	 *
	 * @param {Cartesian3} cartesian The Cartesian to duplicate.
	 * @param {Cartesian3} [result] The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided. (Returns undefined if cartesian is undefined)
	 */
	Cartesian3.clone = function (cartesian, result) {
	  if (!defined(cartesian)) {
	    return undefined;
	  }
	  if (!defined(result)) {
	    return new Cartesian3(cartesian.x, cartesian.y, cartesian.z);
	  }

	  result.x = cartesian.x;
	  result.y = cartesian.y;
	  result.z = cartesian.z;
	  return result;
	};

	/**
	 * Creates a Cartesian3 instance from an existing Cartesian4.  This simply takes the
	 * x, y, and z properties of the Cartesian4 and drops w.
	 * @function
	 *
	 * @param {Cartesian4} cartesian The Cartesian4 instance to create a Cartesian3 instance from.
	 * @param {Cartesian3} [result] The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
	 */
	Cartesian3.fromCartesian4 = Cartesian3.clone;

	/**
	 * The number of elements used to pack the object into an array.
	 * @type {number}
	 */
	Cartesian3.packedLength = 3;

	/**
	 * Stores the provided instance into the provided array.
	 *
	 * @param {Cartesian3} value The value to pack.
	 * @param {number[]} array The array to pack into.
	 * @param {number} [startingIndex=0] The index into the array at which to start packing the elements.
	 *
	 * @returns {number[]} The array that was packed into
	 */
	Cartesian3.pack = function (value, array, startingIndex) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("value", value);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);

	  array[startingIndex++] = value.x;
	  array[startingIndex++] = value.y;
	  array[startingIndex] = value.z;

	  return array;
	};

	/**
	 * Retrieves an instance from a packed array.
	 *
	 * @param {number[]} array The packed array.
	 * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
	 * @param {Cartesian3} [result] The object into which to store the result.
	 * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
	 */
	Cartesian3.unpack = function (array, startingIndex, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);

	  if (!defined(result)) {
	    result = new Cartesian3();
	  }
	  result.x = array[startingIndex++];
	  result.y = array[startingIndex++];
	  result.z = array[startingIndex];
	  return result;
	};

	/**
	 * Flattens an array of Cartesian3s into an array of components.
	 *
	 * @param {Cartesian3[]} array The array of cartesians to pack.
	 * @param {number[]} [result] The array onto which to store the result. If this is a typed array, it must have array.length * 3 components, else a {@link DeveloperError} will be thrown. If it is a regular array, it will be resized to have (array.length * 3) elements.
	 * @returns {number[]} The packed array.
	 */
	Cartesian3.packArray = function (array, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  const length = array.length;
	  const resultLength = length * 3;
	  if (!defined(result)) {
	    result = new Array(resultLength);
	  } else if (!Array.isArray(result) && result.length !== resultLength) {
	    //>>includeStart('debug', pragmas.debug);
	    throw new DeveloperError(
	      "If result is a typed array, it must have exactly array.length * 3 elements",
	    );
	    //>>includeEnd('debug');
	  } else if (result.length !== resultLength) {
	    result.length = resultLength;
	  }

	  for (let i = 0; i < length; ++i) {
	    Cartesian3.pack(array[i], result, i * 3);
	  }
	  return result;
	};

	/**
	 * Unpacks an array of cartesian components into an array of Cartesian3s.
	 *
	 * @param {number[]} array The array of components to unpack.
	 * @param {Cartesian3[]} [result] The array onto which to store the result.
	 * @returns {Cartesian3[]} The unpacked array.
	 */
	Cartesian3.unpackArray = function (array, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  Check.typeOf.number.greaterThanOrEquals("array.length", array.length, 3);
	  if (array.length % 3 !== 0) {
	    throw new DeveloperError("array length must be a multiple of 3.");
	  }
	  //>>includeEnd('debug');

	  const length = array.length;
	  if (!defined(result)) {
	    result = new Array(length / 3);
	  } else {
	    result.length = length / 3;
	  }

	  for (let i = 0; i < length; i += 3) {
	    const index = i / 3;
	    result[index] = Cartesian3.unpack(array, i, result[index]);
	  }
	  return result;
	};

	/**
	 * Creates a Cartesian3 from three consecutive elements in an array.
	 * @function
	 *
	 * @param {number[]} array The array whose three consecutive elements correspond to the x, y, and z components, respectively.
	 * @param {number} [startingIndex=0] The offset into the array of the first element, which corresponds to the x component.
	 * @param {Cartesian3} [result] The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
	 *
	 * @example
	 * // Create a Cartesian3 with (1.0, 2.0, 3.0)
	 * const v = [1.0, 2.0, 3.0];
	 * const p = Cesium.Cartesian3.fromArray(v);
	 *
	 * // Create a Cartesian3 with (1.0, 2.0, 3.0) using an offset into an array
	 * const v2 = [0.0, 0.0, 1.0, 2.0, 3.0];
	 * const p2 = Cesium.Cartesian3.fromArray(v2, 2);
	 */
	Cartesian3.fromArray = Cartesian3.unpack;

	/**
	 * Computes the value of the maximum component for the supplied Cartesian.
	 *
	 * @param {Cartesian3} cartesian The cartesian to use.
	 * @returns {number} The value of the maximum component.
	 */
	Cartesian3.maximumComponent = function (cartesian) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  //>>includeEnd('debug');

	  return Math.max(cartesian.x, cartesian.y, cartesian.z);
	};

	/**
	 * Computes the value of the minimum component for the supplied Cartesian.
	 *
	 * @param {Cartesian3} cartesian The cartesian to use.
	 * @returns {number} The value of the minimum component.
	 */
	Cartesian3.minimumComponent = function (cartesian) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  //>>includeEnd('debug');

	  return Math.min(cartesian.x, cartesian.y, cartesian.z);
	};

	/**
	 * Compares two Cartesians and computes a Cartesian which contains the minimum components of the supplied Cartesians.
	 *
	 * @param {Cartesian3} first A cartesian to compare.
	 * @param {Cartesian3} second A cartesian to compare.
	 * @param {Cartesian3} result The object into which to store the result.
	 * @returns {Cartesian3} A cartesian with the minimum components.
	 */
	Cartesian3.minimumByComponent = function (first, second, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("first", first);
	  Check.typeOf.object("second", second);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Math.min(first.x, second.x);
	  result.y = Math.min(first.y, second.y);
	  result.z = Math.min(first.z, second.z);

	  return result;
	};

	/**
	 * Compares two Cartesians and computes a Cartesian which contains the maximum components of the supplied Cartesians.
	 *
	 * @param {Cartesian3} first A cartesian to compare.
	 * @param {Cartesian3} second A cartesian to compare.
	 * @param {Cartesian3} result The object into which to store the result.
	 * @returns {Cartesian3} A cartesian with the maximum components.
	 */
	Cartesian3.maximumByComponent = function (first, second, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("first", first);
	  Check.typeOf.object("second", second);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Math.max(first.x, second.x);
	  result.y = Math.max(first.y, second.y);
	  result.z = Math.max(first.z, second.z);
	  return result;
	};

	/**
	 * Constrain a value to lie between two values.
	 *
	 * @param {Cartesian3} cartesian The value to clamp.
	 * @param {Cartesian3} min The minimum bound.
	 * @param {Cartesian3} max The maximum bound.
	 * @param {Cartesian3} result The object into which to store the result.
	 * @returns {Cartesian3} The clamped value such that min <= value <= max.
	 */
	Cartesian3.clamp = function (value, min, max, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("value", value);
	  Check.typeOf.object("min", min);
	  Check.typeOf.object("max", max);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const x = CesiumMath.clamp(value.x, min.x, max.x);
	  const y = CesiumMath.clamp(value.y, min.y, max.y);
	  const z = CesiumMath.clamp(value.z, min.z, max.z);

	  result.x = x;
	  result.y = y;
	  result.z = z;

	  return result;
	};

	/**
	 * Computes the provided Cartesian's squared magnitude.
	 *
	 * @param {Cartesian3} cartesian The Cartesian instance whose squared magnitude is to be computed.
	 * @returns {number} The squared magnitude.
	 */
	Cartesian3.magnitudeSquared = function (cartesian) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  //>>includeEnd('debug');

	  return (
	    cartesian.x * cartesian.x +
	    cartesian.y * cartesian.y +
	    cartesian.z * cartesian.z
	  );
	};

	/**
	 * Computes the Cartesian's magnitude (length).
	 *
	 * @param {Cartesian3} cartesian The Cartesian instance whose magnitude is to be computed.
	 * @returns {number} The magnitude.
	 */
	Cartesian3.magnitude = function (cartesian) {
	  return Math.sqrt(Cartesian3.magnitudeSquared(cartesian));
	};

	const distanceScratch$2 = new Cartesian3();

	/**
	 * Computes the distance between two points.
	 *
	 * @param {Cartesian3} left The first point to compute the distance from.
	 * @param {Cartesian3} right The second point to compute the distance to.
	 * @returns {number} The distance between two points.
	 *
	 * @example
	 * // Returns 1.0
	 * const d = Cesium.Cartesian3.distance(new Cesium.Cartesian3(1.0, 0.0, 0.0), new Cesium.Cartesian3(2.0, 0.0, 0.0));
	 */
	Cartesian3.distance = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  Cartesian3.subtract(left, right, distanceScratch$2);
	  return Cartesian3.magnitude(distanceScratch$2);
	};

	/**
	 * Computes the squared distance between two points.  Comparing squared distances
	 * using this function is more efficient than comparing distances using {@link Cartesian3#distance}.
	 *
	 * @param {Cartesian3} left The first point to compute the distance from.
	 * @param {Cartesian3} right The second point to compute the distance to.
	 * @returns {number} The distance between two points.
	 *
	 * @example
	 * // Returns 4.0, not 2.0
	 * const d = Cesium.Cartesian3.distanceSquared(new Cesium.Cartesian3(1.0, 0.0, 0.0), new Cesium.Cartesian3(3.0, 0.0, 0.0));
	 */
	Cartesian3.distanceSquared = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  Cartesian3.subtract(left, right, distanceScratch$2);
	  return Cartesian3.magnitudeSquared(distanceScratch$2);
	};

	/**
	 * Computes the normalized form of the supplied Cartesian.
	 *
	 * @param {Cartesian3} cartesian The Cartesian to be normalized.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 */
	Cartesian3.normalize = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const magnitude = Cartesian3.magnitude(cartesian);

	  result.x = cartesian.x / magnitude;
	  result.y = cartesian.y / magnitude;
	  result.z = cartesian.z / magnitude;

	  //>>includeStart('debug', pragmas.debug);
	  if (isNaN(result.x) || isNaN(result.y) || isNaN(result.z)) {
	    throw new DeveloperError("normalized result is not a number");
	  }
	  //>>includeEnd('debug');

	  return result;
	};

	/**
	 * Computes the dot (scalar) product of two Cartesians.
	 *
	 * @param {Cartesian3} left The first Cartesian.
	 * @param {Cartesian3} right The second Cartesian.
	 * @returns {number} The dot product.
	 */
	Cartesian3.dot = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  return left.x * right.x + left.y * right.y + left.z * right.z;
	};

	/**
	 * Computes the componentwise product of two Cartesians.
	 *
	 * @param {Cartesian3} left The first Cartesian.
	 * @param {Cartesian3} right The second Cartesian.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 */
	Cartesian3.multiplyComponents = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x * right.x;
	  result.y = left.y * right.y;
	  result.z = left.z * right.z;
	  return result;
	};

	/**
	 * Computes the componentwise quotient of two Cartesians.
	 *
	 * @param {Cartesian3} left The first Cartesian.
	 * @param {Cartesian3} right The second Cartesian.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 */
	Cartesian3.divideComponents = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x / right.x;
	  result.y = left.y / right.y;
	  result.z = left.z / right.z;
	  return result;
	};

	/**
	 * Computes the componentwise sum of two Cartesians.
	 *
	 * @param {Cartesian3} left The first Cartesian.
	 * @param {Cartesian3} right The second Cartesian.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 */
	Cartesian3.add = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x + right.x;
	  result.y = left.y + right.y;
	  result.z = left.z + right.z;
	  return result;
	};

	/**
	 * Computes the componentwise difference of two Cartesians.
	 *
	 * @param {Cartesian3} left The first Cartesian.
	 * @param {Cartesian3} right The second Cartesian.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 */
	Cartesian3.subtract = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x - right.x;
	  result.y = left.y - right.y;
	  result.z = left.z - right.z;
	  return result;
	};

	/**
	 * Multiplies the provided Cartesian componentwise by the provided scalar.
	 *
	 * @param {Cartesian3} cartesian The Cartesian to be scaled.
	 * @param {number} scalar The scalar to multiply with.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 */
	Cartesian3.multiplyByScalar = function (cartesian, scalar, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.number("scalar", scalar);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = cartesian.x * scalar;
	  result.y = cartesian.y * scalar;
	  result.z = cartesian.z * scalar;
	  return result;
	};

	/**
	 * Divides the provided Cartesian componentwise by the provided scalar.
	 *
	 * @param {Cartesian3} cartesian The Cartesian to be divided.
	 * @param {number} scalar The scalar to divide by.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 */
	Cartesian3.divideByScalar = function (cartesian, scalar, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.number("scalar", scalar);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = cartesian.x / scalar;
	  result.y = cartesian.y / scalar;
	  result.z = cartesian.z / scalar;
	  return result;
	};

	/**
	 * Negates the provided Cartesian.
	 *
	 * @param {Cartesian3} cartesian The Cartesian to be negated.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 */
	Cartesian3.negate = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = -cartesian.x;
	  result.y = -cartesian.y;
	  result.z = -cartesian.z;
	  return result;
	};

	/**
	 * Computes the absolute value of the provided Cartesian.
	 *
	 * @param {Cartesian3} cartesian The Cartesian whose absolute value is to be computed.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 */
	Cartesian3.abs = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Math.abs(cartesian.x);
	  result.y = Math.abs(cartesian.y);
	  result.z = Math.abs(cartesian.z);
	  return result;
	};

	const lerpScratch$2 = new Cartesian3();
	/**
	 * Computes the linear interpolation or extrapolation at t using the provided cartesians.
	 *
	 * @param {Cartesian3} start The value corresponding to t at 0.0.
	 * @param {Cartesian3} end The value corresponding to t at 1.0.
	 * @param {number} t The point along t at which to interpolate.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 */
	Cartesian3.lerp = function (start, end, t, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("start", start);
	  Check.typeOf.object("end", end);
	  Check.typeOf.number("t", t);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  Cartesian3.multiplyByScalar(end, t, lerpScratch$2);
	  result = Cartesian3.multiplyByScalar(start, 1.0 - t, result);
	  return Cartesian3.add(lerpScratch$2, result, result);
	};

	const angleBetweenScratch$1 = new Cartesian3();
	const angleBetweenScratch2$1 = new Cartesian3();
	/**
	 * Returns the angle, in radians, between the provided Cartesians.
	 *
	 * @param {Cartesian3} left The first Cartesian.
	 * @param {Cartesian3} right The second Cartesian.
	 * @returns {number} The angle between the Cartesians.
	 */
	Cartesian3.angleBetween = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  Cartesian3.normalize(left, angleBetweenScratch$1);
	  Cartesian3.normalize(right, angleBetweenScratch2$1);
	  const cosine = Cartesian3.dot(angleBetweenScratch$1, angleBetweenScratch2$1);
	  const sine = Cartesian3.magnitude(
	    Cartesian3.cross(
	      angleBetweenScratch$1,
	      angleBetweenScratch2$1,
	      angleBetweenScratch$1,
	    ),
	  );
	  return Math.atan2(sine, cosine);
	};

	const mostOrthogonalAxisScratch$2 = new Cartesian3();
	/**
	 * Returns the axis that is most orthogonal to the provided Cartesian.
	 *
	 * @param {Cartesian3} cartesian The Cartesian on which to find the most orthogonal axis.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The most orthogonal axis.
	 */
	Cartesian3.mostOrthogonalAxis = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const f = Cartesian3.normalize(cartesian, mostOrthogonalAxisScratch$2);
	  Cartesian3.abs(f, f);

	  if (f.x <= f.y) {
	    if (f.x <= f.z) {
	      result = Cartesian3.clone(Cartesian3.UNIT_X, result);
	    } else {
	      result = Cartesian3.clone(Cartesian3.UNIT_Z, result);
	    }
	  } else if (f.y <= f.z) {
	    result = Cartesian3.clone(Cartesian3.UNIT_Y, result);
	  } else {
	    result = Cartesian3.clone(Cartesian3.UNIT_Z, result);
	  }

	  return result;
	};

	/**
	 * Projects vector a onto vector b
	 * @param {Cartesian3} a The vector that needs projecting
	 * @param {Cartesian3} b The vector to project onto
	 * @param {Cartesian3} result The result cartesian
	 * @returns {Cartesian3} The modified result parameter
	 */
	Cartesian3.projectVector = function (a, b, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("a", a);
	  Check.defined("b", b);
	  Check.defined("result", result);
	  //>>includeEnd('debug');

	  const scalar = Cartesian3.dot(a, b) / Cartesian3.dot(b, b);
	  return Cartesian3.multiplyByScalar(b, scalar, result);
	};

	/**
	 * Compares the provided Cartesians componentwise and returns
	 * <code>true</code> if they are equal, <code>false</code> otherwise.
	 *
	 * @param {Cartesian3} [left] The first Cartesian.
	 * @param {Cartesian3} [right] The second Cartesian.
	 * @returns {boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
	 */
	Cartesian3.equals = function (left, right) {
	  return (
	    left === right ||
	    (defined(left) &&
	      defined(right) &&
	      left.x === right.x &&
	      left.y === right.y &&
	      left.z === right.z)
	  );
	};

	/**
	 * @private
	 */
	Cartesian3.equalsArray = function (cartesian, array, offset) {
	  return (
	    cartesian.x === array[offset] &&
	    cartesian.y === array[offset + 1] &&
	    cartesian.z === array[offset + 2]
	  );
	};

	/**
	 * Compares the provided Cartesians componentwise and returns
	 * <code>true</code> if they pass an absolute or relative tolerance test,
	 * <code>false</code> otherwise.
	 *
	 * @param {Cartesian3} [left] The first Cartesian.
	 * @param {Cartesian3} [right] The second Cartesian.
	 * @param {number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
	 * @param {number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
	 * @returns {boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
	 */
	Cartesian3.equalsEpsilon = function (
	  left,
	  right,
	  relativeEpsilon,
	  absoluteEpsilon,
	) {
	  return (
	    left === right ||
	    (defined(left) &&
	      defined(right) &&
	      CesiumMath.equalsEpsilon(
	        left.x,
	        right.x,
	        relativeEpsilon,
	        absoluteEpsilon,
	      ) &&
	      CesiumMath.equalsEpsilon(
	        left.y,
	        right.y,
	        relativeEpsilon,
	        absoluteEpsilon,
	      ) &&
	      CesiumMath.equalsEpsilon(
	        left.z,
	        right.z,
	        relativeEpsilon,
	        absoluteEpsilon,
	      ))
	  );
	};

	/**
	 * Computes the cross (outer) product of two Cartesians.
	 *
	 * @param {Cartesian3} left The first Cartesian.
	 * @param {Cartesian3} right The second Cartesian.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The cross product.
	 */
	Cartesian3.cross = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const leftX = left.x;
	  const leftY = left.y;
	  const leftZ = left.z;
	  const rightX = right.x;
	  const rightY = right.y;
	  const rightZ = right.z;

	  const x = leftY * rightZ - leftZ * rightY;
	  const y = leftZ * rightX - leftX * rightZ;
	  const z = leftX * rightY - leftY * rightX;

	  result.x = x;
	  result.y = y;
	  result.z = z;
	  return result;
	};

	/**
	 * Computes the midpoint between the right and left Cartesian.
	 * @param {Cartesian3} left The first Cartesian.
	 * @param {Cartesian3} right The second Cartesian.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The midpoint.
	 */
	Cartesian3.midpoint = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = (left.x + right.x) * 0.5;
	  result.y = (left.y + right.y) * 0.5;
	  result.z = (left.z + right.z) * 0.5;

	  return result;
	};

	/**
	 * Returns a Cartesian3 position from longitude and latitude values given in degrees.
	 *
	 * @param {number} longitude The longitude, in degrees
	 * @param {number} latitude The latitude, in degrees
	 * @param {number} [height=0.0] The height, in meters, above the ellipsoid.
	 * @param {Ellipsoid} [ellipsoid=Ellipsoid.default] The ellipsoid on which the position lies.
	 * @param {Cartesian3} [result] The object onto which to store the result.
	 * @returns {Cartesian3} The position
	 *
	 * @example
	 * const position = Cesium.Cartesian3.fromDegrees(-115.0, 37.0);
	 */
	Cartesian3.fromDegrees = function (
	  longitude,
	  latitude,
	  height,
	  ellipsoid,
	  result,
	) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("longitude", longitude);
	  Check.typeOf.number("latitude", latitude);
	  //>>includeEnd('debug');

	  longitude = CesiumMath.toRadians(longitude);
	  latitude = CesiumMath.toRadians(latitude);
	  return Cartesian3.fromRadians(longitude, latitude, height, ellipsoid, result);
	};

	let scratchN = new Cartesian3();
	let scratchK = new Cartesian3();

	// To prevent a circular dependency, this value is overridden by Ellipsoid when Ellipsoid.default is set
	Cartesian3._ellipsoidRadiiSquared = new Cartesian3(
	  6378137.0 * 6378137.0,
	  6378137.0 * 6378137.0,
	  6356752.3142451793 * 6356752.3142451793,
	);

	/**
	 * Returns a Cartesian3 position from longitude and latitude values given in radians.
	 *
	 * @param {number} longitude The longitude, in radians
	 * @param {number} latitude The latitude, in radians
	 * @param {number} [height=0.0] The height, in meters, above the ellipsoid.
	 * @param {Ellipsoid} [ellipsoid=Ellipsoid.default] The ellipsoid on which the position lies.
	 * @param {Cartesian3} [result] The object onto which to store the result.
	 * @returns {Cartesian3} The position
	 *
	 * @example
	 * const position = Cesium.Cartesian3.fromRadians(-2.007, 0.645);
	 */
	Cartesian3.fromRadians = function (
	  longitude,
	  latitude,
	  height,
	  ellipsoid,
	  result,
	) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("longitude", longitude);
	  Check.typeOf.number("latitude", latitude);
	  //>>includeEnd('debug');

	  height = defaultValue(height, 0.0);

	  const radiiSquared = !defined(ellipsoid)
	    ? Cartesian3._ellipsoidRadiiSquared
	    : ellipsoid.radiiSquared;

	  const cosLatitude = Math.cos(latitude);
	  scratchN.x = cosLatitude * Math.cos(longitude);
	  scratchN.y = cosLatitude * Math.sin(longitude);
	  scratchN.z = Math.sin(latitude);
	  scratchN = Cartesian3.normalize(scratchN, scratchN);

	  Cartesian3.multiplyComponents(radiiSquared, scratchN, scratchK);
	  const gamma = Math.sqrt(Cartesian3.dot(scratchN, scratchK));
	  scratchK = Cartesian3.divideByScalar(scratchK, gamma, scratchK);
	  scratchN = Cartesian3.multiplyByScalar(scratchN, height, scratchN);

	  if (!defined(result)) {
	    result = new Cartesian3();
	  }
	  return Cartesian3.add(scratchK, scratchN, result);
	};

	/**
	 * Returns an array of Cartesian3 positions given an array of longitude and latitude values given in degrees.
	 *
	 * @param {number[]} coordinates A list of longitude and latitude values. Values alternate [longitude, latitude, longitude, latitude...].
	 * @param {Ellipsoid} [ellipsoid=Ellipsoid.default] The ellipsoid on which the coordinates lie.
	 * @param {Cartesian3[]} [result] An array of Cartesian3 objects to store the result.
	 * @returns {Cartesian3[]} The array of positions.
	 *
	 * @example
	 * const positions = Cesium.Cartesian3.fromDegreesArray([-115.0, 37.0, -107.0, 33.0]);
	 */
	Cartesian3.fromDegreesArray = function (coordinates, ellipsoid, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("coordinates", coordinates);
	  if (coordinates.length < 2 || coordinates.length % 2 !== 0) {
	    throw new DeveloperError(
	      "the number of coordinates must be a multiple of 2 and at least 2",
	    );
	  }
	  //>>includeEnd('debug');

	  const length = coordinates.length;
	  if (!defined(result)) {
	    result = new Array(length / 2);
	  } else {
	    result.length = length / 2;
	  }

	  for (let i = 0; i < length; i += 2) {
	    const longitude = coordinates[i];
	    const latitude = coordinates[i + 1];
	    const index = i / 2;
	    result[index] = Cartesian3.fromDegrees(
	      longitude,
	      latitude,
	      0,
	      ellipsoid,
	      result[index],
	    );
	  }

	  return result;
	};

	/**
	 * Returns an array of Cartesian3 positions given an array of longitude and latitude values given in radians.
	 *
	 * @param {number[]} coordinates A list of longitude and latitude values. Values alternate [longitude, latitude, longitude, latitude...].
	 * @param {Ellipsoid} [ellipsoid=Ellipsoid.default] The ellipsoid on which the coordinates lie.
	 * @param {Cartesian3[]} [result] An array of Cartesian3 objects to store the result.
	 * @returns {Cartesian3[]} The array of positions.
	 *
	 * @example
	 * const positions = Cesium.Cartesian3.fromRadiansArray([-2.007, 0.645, -1.867, .575]);
	 */
	Cartesian3.fromRadiansArray = function (coordinates, ellipsoid, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("coordinates", coordinates);
	  if (coordinates.length < 2 || coordinates.length % 2 !== 0) {
	    throw new DeveloperError(
	      "the number of coordinates must be a multiple of 2 and at least 2",
	    );
	  }
	  //>>includeEnd('debug');

	  const length = coordinates.length;
	  if (!defined(result)) {
	    result = new Array(length / 2);
	  } else {
	    result.length = length / 2;
	  }

	  for (let i = 0; i < length; i += 2) {
	    const longitude = coordinates[i];
	    const latitude = coordinates[i + 1];
	    const index = i / 2;
	    result[index] = Cartesian3.fromRadians(
	      longitude,
	      latitude,
	      0,
	      ellipsoid,
	      result[index],
	    );
	  }

	  return result;
	};

	/**
	 * Returns an array of Cartesian3 positions given an array of longitude, latitude and height values where longitude and latitude are given in degrees.
	 *
	 * @param {number[]} coordinates A list of longitude, latitude and height values. Values alternate [longitude, latitude, height, longitude, latitude, height...].
	 * @param {Ellipsoid} [ellipsoid=Ellipsoid.default] The ellipsoid on which the position lies.
	 * @param {Cartesian3[]} [result] An array of Cartesian3 objects to store the result.
	 * @returns {Cartesian3[]} The array of positions.
	 *
	 * @example
	 * const positions = Cesium.Cartesian3.fromDegreesArrayHeights([-115.0, 37.0, 100000.0, -107.0, 33.0, 150000.0]);
	 */
	Cartesian3.fromDegreesArrayHeights = function (coordinates, ellipsoid, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("coordinates", coordinates);
	  if (coordinates.length < 3 || coordinates.length % 3 !== 0) {
	    throw new DeveloperError(
	      "the number of coordinates must be a multiple of 3 and at least 3",
	    );
	  }
	  //>>includeEnd('debug');

	  const length = coordinates.length;
	  if (!defined(result)) {
	    result = new Array(length / 3);
	  } else {
	    result.length = length / 3;
	  }

	  for (let i = 0; i < length; i += 3) {
	    const longitude = coordinates[i];
	    const latitude = coordinates[i + 1];
	    const height = coordinates[i + 2];
	    const index = i / 3;
	    result[index] = Cartesian3.fromDegrees(
	      longitude,
	      latitude,
	      height,
	      ellipsoid,
	      result[index],
	    );
	  }

	  return result;
	};

	/**
	 * Returns an array of Cartesian3 positions given an array of longitude, latitude and height values where longitude and latitude are given in radians.
	 *
	 * @param {number[]} coordinates A list of longitude, latitude and height values. Values alternate [longitude, latitude, height, longitude, latitude, height...].
	 * @param {Ellipsoid} [ellipsoid=Ellipsoid.default] The ellipsoid on which the position lies.
	 * @param {Cartesian3[]} [result] An array of Cartesian3 objects to store the result.
	 * @returns {Cartesian3[]} The array of positions.
	 *
	 * @example
	 * const positions = Cesium.Cartesian3.fromRadiansArrayHeights([-2.007, 0.645, 100000.0, -1.867, .575, 150000.0]);
	 */
	Cartesian3.fromRadiansArrayHeights = function (coordinates, ellipsoid, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("coordinates", coordinates);
	  if (coordinates.length < 3 || coordinates.length % 3 !== 0) {
	    throw new DeveloperError(
	      "the number of coordinates must be a multiple of 3 and at least 3",
	    );
	  }
	  //>>includeEnd('debug');

	  const length = coordinates.length;
	  if (!defined(result)) {
	    result = new Array(length / 3);
	  } else {
	    result.length = length / 3;
	  }

	  for (let i = 0; i < length; i += 3) {
	    const longitude = coordinates[i];
	    const latitude = coordinates[i + 1];
	    const height = coordinates[i + 2];
	    const index = i / 3;
	    result[index] = Cartesian3.fromRadians(
	      longitude,
	      latitude,
	      height,
	      ellipsoid,
	      result[index],
	    );
	  }

	  return result;
	};

	/**
	 * An immutable Cartesian3 instance initialized to (0.0, 0.0, 0.0).
	 *
	 * @type {Cartesian3}
	 * @constant
	 */
	Cartesian3.ZERO = Object.freeze(new Cartesian3(0.0, 0.0, 0.0));

	/**
	 * An immutable Cartesian3 instance initialized to (1.0, 1.0, 1.0).
	 *
	 * @type {Cartesian3}
	 * @constant
	 */
	Cartesian3.ONE = Object.freeze(new Cartesian3(1.0, 1.0, 1.0));

	/**
	 * An immutable Cartesian3 instance initialized to (1.0, 0.0, 0.0).
	 *
	 * @type {Cartesian3}
	 * @constant
	 */
	Cartesian3.UNIT_X = Object.freeze(new Cartesian3(1.0, 0.0, 0.0));

	/**
	 * An immutable Cartesian3 instance initialized to (0.0, 1.0, 0.0).
	 *
	 * @type {Cartesian3}
	 * @constant
	 */
	Cartesian3.UNIT_Y = Object.freeze(new Cartesian3(0.0, 1.0, 0.0));

	/**
	 * An immutable Cartesian3 instance initialized to (0.0, 0.0, 1.0).
	 *
	 * @type {Cartesian3}
	 * @constant
	 */
	Cartesian3.UNIT_Z = Object.freeze(new Cartesian3(0.0, 0.0, 1.0));

	/**
	 * Duplicates this Cartesian3 instance.
	 *
	 * @param {Cartesian3} [result] The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
	 */
	Cartesian3.prototype.clone = function (result) {
	  return Cartesian3.clone(this, result);
	};

	/**
	 * Compares this Cartesian against the provided Cartesian componentwise and returns
	 * <code>true</code> if they are equal, <code>false</code> otherwise.
	 *
	 * @param {Cartesian3} [right] The right hand side Cartesian.
	 * @returns {boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
	 */
	Cartesian3.prototype.equals = function (right) {
	  return Cartesian3.equals(this, right);
	};

	/**
	 * Compares this Cartesian against the provided Cartesian componentwise and returns
	 * <code>true</code> if they pass an absolute or relative tolerance test,
	 * <code>false</code> otherwise.
	 *
	 * @param {Cartesian3} [right] The right hand side Cartesian.
	 * @param {number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
	 * @param {number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
	 * @returns {boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
	 */
	Cartesian3.prototype.equalsEpsilon = function (
	  right,
	  relativeEpsilon,
	  absoluteEpsilon,
	) {
	  return Cartesian3.equalsEpsilon(
	    this,
	    right,
	    relativeEpsilon,
	    absoluteEpsilon,
	  );
	};

	/**
	 * Creates a string representing this Cartesian in the format '(x, y, z)'.
	 *
	 * @returns {string} A string representing this Cartesian in the format '(x, y, z)'.
	 */
	Cartesian3.prototype.toString = function () {
	  return `(${this.x}, ${this.y}, ${this.z})`;
	};

	/**
	 * A 3x3 matrix, indexable as a column-major order array.
	 * Constructor parameters are in row-major order for code readability.
	 * @alias Matrix3
	 * @constructor
	 * @implements {ArrayLike<number>}
	 *
	 * @param {number} [column0Row0=0.0] The value for column 0, row 0.
	 * @param {number} [column1Row0=0.0] The value for column 1, row 0.
	 * @param {number} [column2Row0=0.0] The value for column 2, row 0.
	 * @param {number} [column0Row1=0.0] The value for column 0, row 1.
	 * @param {number} [column1Row1=0.0] The value for column 1, row 1.
	 * @param {number} [column2Row1=0.0] The value for column 2, row 1.
	 * @param {number} [column0Row2=0.0] The value for column 0, row 2.
	 * @param {number} [column1Row2=0.0] The value for column 1, row 2.
	 * @param {number} [column2Row2=0.0] The value for column 2, row 2.
	 *
	 * @see Matrix3.fromArray
	 * @see Matrix3.fromColumnMajorArray
	 * @see Matrix3.fromRowMajorArray
	 * @see Matrix3.fromQuaternion
	 * @see Matrix3.fromHeadingPitchRoll
	 * @see Matrix3.fromScale
	 * @see Matrix3.fromUniformScale
	 * @see Matrix3.fromCrossProduct
	 * @see Matrix3.fromRotationX
	 * @see Matrix3.fromRotationY
	 * @see Matrix3.fromRotationZ
	 * @see Matrix2
	 * @see Matrix4
	 */
	function Matrix3(
	  column0Row0,
	  column1Row0,
	  column2Row0,
	  column0Row1,
	  column1Row1,
	  column2Row1,
	  column0Row2,
	  column1Row2,
	  column2Row2,
	) {
	  this[0] = defaultValue(column0Row0, 0.0);
	  this[1] = defaultValue(column0Row1, 0.0);
	  this[2] = defaultValue(column0Row2, 0.0);
	  this[3] = defaultValue(column1Row0, 0.0);
	  this[4] = defaultValue(column1Row1, 0.0);
	  this[5] = defaultValue(column1Row2, 0.0);
	  this[6] = defaultValue(column2Row0, 0.0);
	  this[7] = defaultValue(column2Row1, 0.0);
	  this[8] = defaultValue(column2Row2, 0.0);
	}

	/**
	 * The number of elements used to pack the object into an array.
	 * @type {number}
	 */
	Matrix3.packedLength = 9;

	/**
	 * Stores the provided instance into the provided array.
	 *
	 * @param {Matrix3} value The value to pack.
	 * @param {number[]} array The array to pack into.
	 * @param {number} [startingIndex=0] The index into the array at which to start packing the elements.
	 *
	 * @returns {number[]} The array that was packed into
	 */
	Matrix3.pack = function (value, array, startingIndex) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("value", value);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);

	  array[startingIndex++] = value[0];
	  array[startingIndex++] = value[1];
	  array[startingIndex++] = value[2];
	  array[startingIndex++] = value[3];
	  array[startingIndex++] = value[4];
	  array[startingIndex++] = value[5];
	  array[startingIndex++] = value[6];
	  array[startingIndex++] = value[7];
	  array[startingIndex++] = value[8];

	  return array;
	};

	/**
	 * Retrieves an instance from a packed array.
	 *
	 * @param {number[]} array The packed array.
	 * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
	 * @param {Matrix3} [result] The object into which to store the result.
	 * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
	 */
	Matrix3.unpack = function (array, startingIndex, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);

	  if (!defined(result)) {
	    result = new Matrix3();
	  }

	  result[0] = array[startingIndex++];
	  result[1] = array[startingIndex++];
	  result[2] = array[startingIndex++];
	  result[3] = array[startingIndex++];
	  result[4] = array[startingIndex++];
	  result[5] = array[startingIndex++];
	  result[6] = array[startingIndex++];
	  result[7] = array[startingIndex++];
	  result[8] = array[startingIndex++];
	  return result;
	};

	/**
	 * Flattens an array of Matrix3s into an array of components. The components
	 * are stored in column-major order.
	 *
	 * @param {Matrix3[]} array The array of matrices to pack.
	 * @param {number[]} [result] The array onto which to store the result. If this is a typed array, it must have array.length * 9 components, else a {@link DeveloperError} will be thrown. If it is a regular array, it will be resized to have (array.length * 9) elements.
	 * @returns {number[]} The packed array.
	 */
	Matrix3.packArray = function (array, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  const length = array.length;
	  const resultLength = length * 9;
	  if (!defined(result)) {
	    result = new Array(resultLength);
	  } else if (!Array.isArray(result) && result.length !== resultLength) {
	    //>>includeStart('debug', pragmas.debug);
	    throw new DeveloperError(
	      "If result is a typed array, it must have exactly array.length * 9 elements",
	    );
	    //>>includeEnd('debug');
	  } else if (result.length !== resultLength) {
	    result.length = resultLength;
	  }

	  for (let i = 0; i < length; ++i) {
	    Matrix3.pack(array[i], result, i * 9);
	  }
	  return result;
	};

	/**
	 * Unpacks an array of column-major matrix components into an array of Matrix3s.
	 *
	 * @param {number[]} array The array of components to unpack.
	 * @param {Matrix3[]} [result] The array onto which to store the result.
	 * @returns {Matrix3[]} The unpacked array.
	 */
	Matrix3.unpackArray = function (array, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  Check.typeOf.number.greaterThanOrEquals("array.length", array.length, 9);
	  if (array.length % 9 !== 0) {
	    throw new DeveloperError("array length must be a multiple of 9.");
	  }
	  //>>includeEnd('debug');

	  const length = array.length;
	  if (!defined(result)) {
	    result = new Array(length / 9);
	  } else {
	    result.length = length / 9;
	  }

	  for (let i = 0; i < length; i += 9) {
	    const index = i / 9;
	    result[index] = Matrix3.unpack(array, i, result[index]);
	  }
	  return result;
	};

	/**
	 * Duplicates a Matrix3 instance.
	 *
	 * @param {Matrix3} matrix The matrix to duplicate.
	 * @param {Matrix3} [result] The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided. (Returns undefined if matrix is undefined)
	 */
	Matrix3.clone = function (matrix, result) {
	  if (!defined(matrix)) {
	    return undefined;
	  }
	  if (!defined(result)) {
	    return new Matrix3(
	      matrix[0],
	      matrix[3],
	      matrix[6],
	      matrix[1],
	      matrix[4],
	      matrix[7],
	      matrix[2],
	      matrix[5],
	      matrix[8],
	    );
	  }
	  result[0] = matrix[0];
	  result[1] = matrix[1];
	  result[2] = matrix[2];
	  result[3] = matrix[3];
	  result[4] = matrix[4];
	  result[5] = matrix[5];
	  result[6] = matrix[6];
	  result[7] = matrix[7];
	  result[8] = matrix[8];
	  return result;
	};

	/**
	 * Creates a Matrix3 from 9 consecutive elements in an array.
	 *
	 * @function
	 * @param {number[]} array The array whose 9 consecutive elements correspond to the positions of the matrix.  Assumes column-major order.
	 * @param {number} [startingIndex=0] The offset into the array of the first element, which corresponds to first column first row position in the matrix.
	 * @param {Matrix3} [result] The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
	 *
	 * @example
	 * // Create the Matrix3:
	 * // [1.0, 2.0, 3.0]
	 * // [1.0, 2.0, 3.0]
	 * // [1.0, 2.0, 3.0]
	 *
	 * const v = [1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0];
	 * const m = Cesium.Matrix3.fromArray(v);
	 *
	 * // Create same Matrix3 with using an offset into an array
	 * const v2 = [0.0, 0.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0];
	 * const m2 = Cesium.Matrix3.fromArray(v2, 2);
	 */
	Matrix3.fromArray = Matrix3.unpack;

	/**
	 * Creates a Matrix3 instance from a column-major order array.
	 *
	 * @param {number[]} values The column-major order array.
	 * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
	 */
	Matrix3.fromColumnMajorArray = function (values, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("values", values);
	  //>>includeEnd('debug');

	  return Matrix3.clone(values, result);
	};

	/**
	 * Creates a Matrix3 instance from a row-major order array.
	 * The resulting matrix will be in column-major order.
	 *
	 * @param {number[]} values The row-major order array.
	 * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
	 */
	Matrix3.fromRowMajorArray = function (values, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("values", values);
	  //>>includeEnd('debug');

	  if (!defined(result)) {
	    return new Matrix3(
	      values[0],
	      values[1],
	      values[2],
	      values[3],
	      values[4],
	      values[5],
	      values[6],
	      values[7],
	      values[8],
	    );
	  }
	  result[0] = values[0];
	  result[1] = values[3];
	  result[2] = values[6];
	  result[3] = values[1];
	  result[4] = values[4];
	  result[5] = values[7];
	  result[6] = values[2];
	  result[7] = values[5];
	  result[8] = values[8];
	  return result;
	};

	/**
	 * Computes a 3x3 rotation matrix from the provided quaternion.
	 *
	 * @param {Quaternion} quaternion the quaternion to use.
	 * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix3} The 3x3 rotation matrix from this quaternion.
	 */
	Matrix3.fromQuaternion = function (quaternion, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("quaternion", quaternion);
	  //>>includeEnd('debug');

	  const x2 = quaternion.x * quaternion.x;
	  const xy = quaternion.x * quaternion.y;
	  const xz = quaternion.x * quaternion.z;
	  const xw = quaternion.x * quaternion.w;
	  const y2 = quaternion.y * quaternion.y;
	  const yz = quaternion.y * quaternion.z;
	  const yw = quaternion.y * quaternion.w;
	  const z2 = quaternion.z * quaternion.z;
	  const zw = quaternion.z * quaternion.w;
	  const w2 = quaternion.w * quaternion.w;

	  const m00 = x2 - y2 - z2 + w2;
	  const m01 = 2.0 * (xy - zw);
	  const m02 = 2.0 * (xz + yw);

	  const m10 = 2.0 * (xy + zw);
	  const m11 = -x2 + y2 - z2 + w2;
	  const m12 = 2.0 * (yz - xw);

	  const m20 = 2.0 * (xz - yw);
	  const m21 = 2.0 * (yz + xw);
	  const m22 = -x2 - y2 + z2 + w2;

	  if (!defined(result)) {
	    return new Matrix3(m00, m01, m02, m10, m11, m12, m20, m21, m22);
	  }
	  result[0] = m00;
	  result[1] = m10;
	  result[2] = m20;
	  result[3] = m01;
	  result[4] = m11;
	  result[5] = m21;
	  result[6] = m02;
	  result[7] = m12;
	  result[8] = m22;
	  return result;
	};

	/**
	 * Computes a 3x3 rotation matrix from the provided headingPitchRoll. (see http://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles )
	 *
	 * @param {HeadingPitchRoll} headingPitchRoll the headingPitchRoll to use.
	 * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix3} The 3x3 rotation matrix from this headingPitchRoll.
	 */
	Matrix3.fromHeadingPitchRoll = function (headingPitchRoll, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("headingPitchRoll", headingPitchRoll);
	  //>>includeEnd('debug');

	  const cosTheta = Math.cos(-headingPitchRoll.pitch);
	  const cosPsi = Math.cos(-headingPitchRoll.heading);
	  const cosPhi = Math.cos(headingPitchRoll.roll);
	  const sinTheta = Math.sin(-headingPitchRoll.pitch);
	  const sinPsi = Math.sin(-headingPitchRoll.heading);
	  const sinPhi = Math.sin(headingPitchRoll.roll);

	  const m00 = cosTheta * cosPsi;
	  const m01 = -cosPhi * sinPsi + sinPhi * sinTheta * cosPsi;
	  const m02 = sinPhi * sinPsi + cosPhi * sinTheta * cosPsi;

	  const m10 = cosTheta * sinPsi;
	  const m11 = cosPhi * cosPsi + sinPhi * sinTheta * sinPsi;
	  const m12 = -sinPhi * cosPsi + cosPhi * sinTheta * sinPsi;

	  const m20 = -sinTheta;
	  const m21 = sinPhi * cosTheta;
	  const m22 = cosPhi * cosTheta;

	  if (!defined(result)) {
	    return new Matrix3(m00, m01, m02, m10, m11, m12, m20, m21, m22);
	  }
	  result[0] = m00;
	  result[1] = m10;
	  result[2] = m20;
	  result[3] = m01;
	  result[4] = m11;
	  result[5] = m21;
	  result[6] = m02;
	  result[7] = m12;
	  result[8] = m22;
	  return result;
	};

	/**
	 * Computes a Matrix3 instance representing a non-uniform scale.
	 *
	 * @param {Cartesian3} scale The x, y, and z scale factors.
	 * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
	 *
	 * @example
	 * // Creates
	 * //   [7.0, 0.0, 0.0]
	 * //   [0.0, 8.0, 0.0]
	 * //   [0.0, 0.0, 9.0]
	 * const m = Cesium.Matrix3.fromScale(new Cesium.Cartesian3(7.0, 8.0, 9.0));
	 */
	Matrix3.fromScale = function (scale, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("scale", scale);
	  //>>includeEnd('debug');

	  if (!defined(result)) {
	    return new Matrix3(scale.x, 0.0, 0.0, 0.0, scale.y, 0.0, 0.0, 0.0, scale.z);
	  }

	  result[0] = scale.x;
	  result[1] = 0.0;
	  result[2] = 0.0;
	  result[3] = 0.0;
	  result[4] = scale.y;
	  result[5] = 0.0;
	  result[6] = 0.0;
	  result[7] = 0.0;
	  result[8] = scale.z;
	  return result;
	};

	/**
	 * Computes a Matrix3 instance representing a uniform scale.
	 *
	 * @param {number} scale The uniform scale factor.
	 * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
	 *
	 * @example
	 * // Creates
	 * //   [2.0, 0.0, 0.0]
	 * //   [0.0, 2.0, 0.0]
	 * //   [0.0, 0.0, 2.0]
	 * const m = Cesium.Matrix3.fromUniformScale(2.0);
	 */
	Matrix3.fromUniformScale = function (scale, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("scale", scale);
	  //>>includeEnd('debug');

	  if (!defined(result)) {
	    return new Matrix3(scale, 0.0, 0.0, 0.0, scale, 0.0, 0.0, 0.0, scale);
	  }

	  result[0] = scale;
	  result[1] = 0.0;
	  result[2] = 0.0;
	  result[3] = 0.0;
	  result[4] = scale;
	  result[5] = 0.0;
	  result[6] = 0.0;
	  result[7] = 0.0;
	  result[8] = scale;
	  return result;
	};

	/**
	 * Computes a Matrix3 instance representing the cross product equivalent matrix of a Cartesian3 vector.
	 *
	 * @param {Cartesian3} vector the vector on the left hand side of the cross product operation.
	 * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
	 *
	 * @example
	 * // Creates
	 * //   [0.0, -9.0,  8.0]
	 * //   [9.0,  0.0, -7.0]
	 * //   [-8.0, 7.0,  0.0]
	 * const m = Cesium.Matrix3.fromCrossProduct(new Cesium.Cartesian3(7.0, 8.0, 9.0));
	 */
	Matrix3.fromCrossProduct = function (vector, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("vector", vector);
	  //>>includeEnd('debug');

	  if (!defined(result)) {
	    return new Matrix3(
	      0.0,
	      -vector.z,
	      vector.y,
	      vector.z,
	      0.0,
	      -vector.x,
	      -vector.y,
	      vector.x,
	      0.0,
	    );
	  }

	  result[0] = 0.0;
	  result[1] = vector.z;
	  result[2] = -vector.y;
	  result[3] = -vector.z;
	  result[4] = 0.0;
	  result[5] = vector.x;
	  result[6] = vector.y;
	  result[7] = -vector.x;
	  result[8] = 0.0;
	  return result;
	};

	/**
	 * Creates a rotation matrix around the x-axis.
	 *
	 * @param {number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
	 * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
	 *
	 * @example
	 * // Rotate a point 45 degrees counterclockwise around the x-axis.
	 * const p = new Cesium.Cartesian3(5, 6, 7);
	 * const m = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(45.0));
	 * const rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
	 */
	Matrix3.fromRotationX = function (angle, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("angle", angle);
	  //>>includeEnd('debug');

	  const cosAngle = Math.cos(angle);
	  const sinAngle = Math.sin(angle);

	  if (!defined(result)) {
	    return new Matrix3(
	      1.0,
	      0.0,
	      0.0,
	      0.0,
	      cosAngle,
	      -sinAngle,
	      0.0,
	      sinAngle,
	      cosAngle,
	    );
	  }

	  result[0] = 1.0;
	  result[1] = 0.0;
	  result[2] = 0.0;
	  result[3] = 0.0;
	  result[4] = cosAngle;
	  result[5] = sinAngle;
	  result[6] = 0.0;
	  result[7] = -sinAngle;
	  result[8] = cosAngle;

	  return result;
	};

	/**
	 * Creates a rotation matrix around the y-axis.
	 *
	 * @param {number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
	 * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
	 *
	 * @example
	 * // Rotate a point 45 degrees counterclockwise around the y-axis.
	 * const p = new Cesium.Cartesian3(5, 6, 7);
	 * const m = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(45.0));
	 * const rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
	 */
	Matrix3.fromRotationY = function (angle, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("angle", angle);
	  //>>includeEnd('debug');

	  const cosAngle = Math.cos(angle);
	  const sinAngle = Math.sin(angle);

	  if (!defined(result)) {
	    return new Matrix3(
	      cosAngle,
	      0.0,
	      sinAngle,
	      0.0,
	      1.0,
	      0.0,
	      -sinAngle,
	      0.0,
	      cosAngle,
	    );
	  }

	  result[0] = cosAngle;
	  result[1] = 0.0;
	  result[2] = -sinAngle;
	  result[3] = 0.0;
	  result[4] = 1.0;
	  result[5] = 0.0;
	  result[6] = sinAngle;
	  result[7] = 0.0;
	  result[8] = cosAngle;

	  return result;
	};

	/**
	 * Creates a rotation matrix around the z-axis.
	 *
	 * @param {number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
	 * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
	 *
	 * @example
	 * // Rotate a point 45 degrees counterclockwise around the z-axis.
	 * const p = new Cesium.Cartesian3(5, 6, 7);
	 * const m = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(45.0));
	 * const rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
	 */
	Matrix3.fromRotationZ = function (angle, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("angle", angle);
	  //>>includeEnd('debug');

	  const cosAngle = Math.cos(angle);
	  const sinAngle = Math.sin(angle);

	  if (!defined(result)) {
	    return new Matrix3(
	      cosAngle,
	      -sinAngle,
	      0.0,
	      sinAngle,
	      cosAngle,
	      0.0,
	      0.0,
	      0.0,
	      1.0,
	    );
	  }

	  result[0] = cosAngle;
	  result[1] = sinAngle;
	  result[2] = 0.0;
	  result[3] = -sinAngle;
	  result[4] = cosAngle;
	  result[5] = 0.0;
	  result[6] = 0.0;
	  result[7] = 0.0;
	  result[8] = 1.0;

	  return result;
	};

	/**
	 * Creates an Array from the provided Matrix3 instance.
	 * The array will be in column-major order.
	 *
	 * @param {Matrix3} matrix The matrix to use..
	 * @param {number[]} [result] The Array onto which to store the result.
	 * @returns {number[]} The modified Array parameter or a new Array instance if one was not provided.
	 */
	Matrix3.toArray = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  //>>includeEnd('debug');

	  if (!defined(result)) {
	    return [
	      matrix[0],
	      matrix[1],
	      matrix[2],
	      matrix[3],
	      matrix[4],
	      matrix[5],
	      matrix[6],
	      matrix[7],
	      matrix[8],
	    ];
	  }
	  result[0] = matrix[0];
	  result[1] = matrix[1];
	  result[2] = matrix[2];
	  result[3] = matrix[3];
	  result[4] = matrix[4];
	  result[5] = matrix[5];
	  result[6] = matrix[6];
	  result[7] = matrix[7];
	  result[8] = matrix[8];
	  return result;
	};

	/**
	 * Computes the array index of the element at the provided row and column.
	 *
	 * @param {number} column The zero-based index of the column.
	 * @param {number} row The zero-based index of the row.
	 * @returns {number} The index of the element at the provided row and column.
	 *
	 * @exception {DeveloperError} row must be 0, 1, or 2.
	 * @exception {DeveloperError} column must be 0, 1, or 2.
	 *
	 * @example
	 * const myMatrix = new Cesium.Matrix3();
	 * const column1Row0Index = Cesium.Matrix3.getElementIndex(1, 0);
	 * const column1Row0 = myMatrix[column1Row0Index]
	 * myMatrix[column1Row0Index] = 10.0;
	 */
	Matrix3.getElementIndex = function (column, row) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number.greaterThanOrEquals("row", row, 0);
	  Check.typeOf.number.lessThanOrEquals("row", row, 2);
	  Check.typeOf.number.greaterThanOrEquals("column", column, 0);
	  Check.typeOf.number.lessThanOrEquals("column", column, 2);
	  //>>includeEnd('debug');

	  return column * 3 + row;
	};

	/**
	 * Retrieves a copy of the matrix column at the provided index as a Cartesian3 instance.
	 *
	 * @param {Matrix3} matrix The matrix to use.
	 * @param {number} index The zero-based index of the column to retrieve.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 *
	 * @exception {DeveloperError} index must be 0, 1, or 2.
	 */
	Matrix3.getColumn = function (matrix, index, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.number.greaterThanOrEquals("index", index, 0);
	  Check.typeOf.number.lessThanOrEquals("index", index, 2);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const startIndex = index * 3;
	  const x = matrix[startIndex];
	  const y = matrix[startIndex + 1];
	  const z = matrix[startIndex + 2];

	  result.x = x;
	  result.y = y;
	  result.z = z;
	  return result;
	};

	/**
	 * Computes a new matrix that replaces the specified column in the provided matrix with the provided Cartesian3 instance.
	 *
	 * @param {Matrix3} matrix The matrix to use.
	 * @param {number} index The zero-based index of the column to set.
	 * @param {Cartesian3} cartesian The Cartesian whose values will be assigned to the specified column.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 *
	 * @exception {DeveloperError} index must be 0, 1, or 2.
	 */
	Matrix3.setColumn = function (matrix, index, cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.number.greaterThanOrEquals("index", index, 0);
	  Check.typeOf.number.lessThanOrEquals("index", index, 2);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result = Matrix3.clone(matrix, result);
	  const startIndex = index * 3;
	  result[startIndex] = cartesian.x;
	  result[startIndex + 1] = cartesian.y;
	  result[startIndex + 2] = cartesian.z;
	  return result;
	};

	/**
	 * Retrieves a copy of the matrix row at the provided index as a Cartesian3 instance.
	 *
	 * @param {Matrix3} matrix The matrix to use.
	 * @param {number} index The zero-based index of the row to retrieve.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 *
	 * @exception {DeveloperError} index must be 0, 1, or 2.
	 */
	Matrix3.getRow = function (matrix, index, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.number.greaterThanOrEquals("index", index, 0);
	  Check.typeOf.number.lessThanOrEquals("index", index, 2);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const x = matrix[index];
	  const y = matrix[index + 3];
	  const z = matrix[index + 6];

	  result.x = x;
	  result.y = y;
	  result.z = z;
	  return result;
	};

	/**
	 * Computes a new matrix that replaces the specified row in the provided matrix with the provided Cartesian3 instance.
	 *
	 * @param {Matrix3} matrix The matrix to use.
	 * @param {number} index The zero-based index of the row to set.
	 * @param {Cartesian3} cartesian The Cartesian whose values will be assigned to the specified row.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 *
	 * @exception {DeveloperError} index must be 0, 1, or 2.
	 */
	Matrix3.setRow = function (matrix, index, cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.number.greaterThanOrEquals("index", index, 0);
	  Check.typeOf.number.lessThanOrEquals("index", index, 2);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result = Matrix3.clone(matrix, result);
	  result[index] = cartesian.x;
	  result[index + 3] = cartesian.y;
	  result[index + 6] = cartesian.z;
	  return result;
	};

	const scaleScratch1$1 = new Cartesian3();

	/**
	 * Computes a new matrix that replaces the scale with the provided scale.
	 * This assumes the matrix is an affine transformation.
	 *
	 * @param {Matrix3} matrix The matrix to use.
	 * @param {Cartesian3} scale The scale that replaces the scale of the provided matrix.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 *
	 * @see Matrix3.setUniformScale
	 * @see Matrix3.fromScale
	 * @see Matrix3.fromUniformScale
	 * @see Matrix3.multiplyByScale
	 * @see Matrix3.multiplyByUniformScale
	 * @see Matrix3.getScale
	 */
	Matrix3.setScale = function (matrix, scale, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("scale", scale);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const existingScale = Matrix3.getScale(matrix, scaleScratch1$1);
	  const scaleRatioX = scale.x / existingScale.x;
	  const scaleRatioY = scale.y / existingScale.y;
	  const scaleRatioZ = scale.z / existingScale.z;

	  result[0] = matrix[0] * scaleRatioX;
	  result[1] = matrix[1] * scaleRatioX;
	  result[2] = matrix[2] * scaleRatioX;
	  result[3] = matrix[3] * scaleRatioY;
	  result[4] = matrix[4] * scaleRatioY;
	  result[5] = matrix[5] * scaleRatioY;
	  result[6] = matrix[6] * scaleRatioZ;
	  result[7] = matrix[7] * scaleRatioZ;
	  result[8] = matrix[8] * scaleRatioZ;

	  return result;
	};

	const scaleScratch2$1 = new Cartesian3();

	/**
	 * Computes a new matrix that replaces the scale with the provided uniform scale.
	 * This assumes the matrix is an affine transformation.
	 *
	 * @param {Matrix3} matrix The matrix to use.
	 * @param {number} scale The uniform scale that replaces the scale of the provided matrix.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 *
	 * @see Matrix3.setScale
	 * @see Matrix3.fromScale
	 * @see Matrix3.fromUniformScale
	 * @see Matrix3.multiplyByScale
	 * @see Matrix3.multiplyByUniformScale
	 * @see Matrix3.getScale
	 */
	Matrix3.setUniformScale = function (matrix, scale, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.number("scale", scale);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const existingScale = Matrix3.getScale(matrix, scaleScratch2$1);
	  const scaleRatioX = scale / existingScale.x;
	  const scaleRatioY = scale / existingScale.y;
	  const scaleRatioZ = scale / existingScale.z;

	  result[0] = matrix[0] * scaleRatioX;
	  result[1] = matrix[1] * scaleRatioX;
	  result[2] = matrix[2] * scaleRatioX;
	  result[3] = matrix[3] * scaleRatioY;
	  result[4] = matrix[4] * scaleRatioY;
	  result[5] = matrix[5] * scaleRatioY;
	  result[6] = matrix[6] * scaleRatioZ;
	  result[7] = matrix[7] * scaleRatioZ;
	  result[8] = matrix[8] * scaleRatioZ;

	  return result;
	};

	const scratchColumn$1 = new Cartesian3();

	/**
	 * Extracts the non-uniform scale assuming the matrix is an affine transformation.
	 *
	 * @param {Matrix3} matrix The matrix.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 *
	 * @see Matrix3.multiplyByScale
	 * @see Matrix3.multiplyByUniformScale
	 * @see Matrix3.fromScale
	 * @see Matrix3.fromUniformScale
	 * @see Matrix3.setScale
	 * @see Matrix3.setUniformScale
	 */
	Matrix3.getScale = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Cartesian3.magnitude(
	    Cartesian3.fromElements(matrix[0], matrix[1], matrix[2], scratchColumn$1),
	  );
	  result.y = Cartesian3.magnitude(
	    Cartesian3.fromElements(matrix[3], matrix[4], matrix[5], scratchColumn$1),
	  );
	  result.z = Cartesian3.magnitude(
	    Cartesian3.fromElements(matrix[6], matrix[7], matrix[8], scratchColumn$1),
	  );
	  return result;
	};

	const scaleScratch3$1 = new Cartesian3();

	/**
	 * Computes the maximum scale assuming the matrix is an affine transformation.
	 * The maximum scale is the maximum length of the column vectors.
	 *
	 * @param {Matrix3} matrix The matrix.
	 * @returns {number} The maximum scale.
	 */
	Matrix3.getMaximumScale = function (matrix) {
	  Matrix3.getScale(matrix, scaleScratch3$1);
	  return Cartesian3.maximumComponent(scaleScratch3$1);
	};

	const scaleScratch4$1 = new Cartesian3();

	/**
	 * Sets the rotation assuming the matrix is an affine transformation.
	 *
	 * @param {Matrix3} matrix The matrix.
	 * @param {Matrix3} rotation The rotation matrix.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 *
	 * @see Matrix3.getRotation
	 */
	Matrix3.setRotation = function (matrix, rotation, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const scale = Matrix3.getScale(matrix, scaleScratch4$1);

	  result[0] = rotation[0] * scale.x;
	  result[1] = rotation[1] * scale.x;
	  result[2] = rotation[2] * scale.x;
	  result[3] = rotation[3] * scale.y;
	  result[4] = rotation[4] * scale.y;
	  result[5] = rotation[5] * scale.y;
	  result[6] = rotation[6] * scale.z;
	  result[7] = rotation[7] * scale.z;
	  result[8] = rotation[8] * scale.z;

	  return result;
	};

	const scaleScratch5$1 = new Cartesian3();

	/**
	 * Extracts the rotation matrix assuming the matrix is an affine transformation.
	 *
	 * @param {Matrix3} matrix The matrix.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 *
	 * @see Matrix3.setRotation
	 */
	Matrix3.getRotation = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const scale = Matrix3.getScale(matrix, scaleScratch5$1);

	  result[0] = matrix[0] / scale.x;
	  result[1] = matrix[1] / scale.x;
	  result[2] = matrix[2] / scale.x;
	  result[3] = matrix[3] / scale.y;
	  result[4] = matrix[4] / scale.y;
	  result[5] = matrix[5] / scale.y;
	  result[6] = matrix[6] / scale.z;
	  result[7] = matrix[7] / scale.z;
	  result[8] = matrix[8] / scale.z;

	  return result;
	};

	/**
	 * Computes the product of two matrices.
	 *
	 * @param {Matrix3} left The first matrix.
	 * @param {Matrix3} right The second matrix.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 */
	Matrix3.multiply = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const column0Row0 =
	    left[0] * right[0] + left[3] * right[1] + left[6] * right[2];
	  const column0Row1 =
	    left[1] * right[0] + left[4] * right[1] + left[7] * right[2];
	  const column0Row2 =
	    left[2] * right[0] + left[5] * right[1] + left[8] * right[2];

	  const column1Row0 =
	    left[0] * right[3] + left[3] * right[4] + left[6] * right[5];
	  const column1Row1 =
	    left[1] * right[3] + left[4] * right[4] + left[7] * right[5];
	  const column1Row2 =
	    left[2] * right[3] + left[5] * right[4] + left[8] * right[5];

	  const column2Row0 =
	    left[0] * right[6] + left[3] * right[7] + left[6] * right[8];
	  const column2Row1 =
	    left[1] * right[6] + left[4] * right[7] + left[7] * right[8];
	  const column2Row2 =
	    left[2] * right[6] + left[5] * right[7] + left[8] * right[8];

	  result[0] = column0Row0;
	  result[1] = column0Row1;
	  result[2] = column0Row2;
	  result[3] = column1Row0;
	  result[4] = column1Row1;
	  result[5] = column1Row2;
	  result[6] = column2Row0;
	  result[7] = column2Row1;
	  result[8] = column2Row2;
	  return result;
	};

	/**
	 * Computes the sum of two matrices.
	 *
	 * @param {Matrix3} left The first matrix.
	 * @param {Matrix3} right The second matrix.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 */
	Matrix3.add = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = left[0] + right[0];
	  result[1] = left[1] + right[1];
	  result[2] = left[2] + right[2];
	  result[3] = left[3] + right[3];
	  result[4] = left[4] + right[4];
	  result[5] = left[5] + right[5];
	  result[6] = left[6] + right[6];
	  result[7] = left[7] + right[7];
	  result[8] = left[8] + right[8];
	  return result;
	};

	/**
	 * Computes the difference of two matrices.
	 *
	 * @param {Matrix3} left The first matrix.
	 * @param {Matrix3} right The second matrix.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 */
	Matrix3.subtract = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = left[0] - right[0];
	  result[1] = left[1] - right[1];
	  result[2] = left[2] - right[2];
	  result[3] = left[3] - right[3];
	  result[4] = left[4] - right[4];
	  result[5] = left[5] - right[5];
	  result[6] = left[6] - right[6];
	  result[7] = left[7] - right[7];
	  result[8] = left[8] - right[8];
	  return result;
	};

	/**
	 * Computes the product of a matrix and a column vector.
	 *
	 * @param {Matrix3} matrix The matrix.
	 * @param {Cartesian3} cartesian The column.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 */
	Matrix3.multiplyByVector = function (matrix, cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const vX = cartesian.x;
	  const vY = cartesian.y;
	  const vZ = cartesian.z;

	  const x = matrix[0] * vX + matrix[3] * vY + matrix[6] * vZ;
	  const y = matrix[1] * vX + matrix[4] * vY + matrix[7] * vZ;
	  const z = matrix[2] * vX + matrix[5] * vY + matrix[8] * vZ;

	  result.x = x;
	  result.y = y;
	  result.z = z;
	  return result;
	};

	/**
	 * Computes the product of a matrix and a scalar.
	 *
	 * @param {Matrix3} matrix The matrix.
	 * @param {number} scalar The number to multiply by.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 */
	Matrix3.multiplyByScalar = function (matrix, scalar, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.number("scalar", scalar);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = matrix[0] * scalar;
	  result[1] = matrix[1] * scalar;
	  result[2] = matrix[2] * scalar;
	  result[3] = matrix[3] * scalar;
	  result[4] = matrix[4] * scalar;
	  result[5] = matrix[5] * scalar;
	  result[6] = matrix[6] * scalar;
	  result[7] = matrix[7] * scalar;
	  result[8] = matrix[8] * scalar;
	  return result;
	};

	/**
	 * Computes the product of a matrix times a (non-uniform) scale, as if the scale were a scale matrix.
	 *
	 * @param {Matrix3} matrix The matrix on the left-hand side.
	 * @param {Cartesian3} scale The non-uniform scale on the right-hand side.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 *
	 *
	 * @example
	 * // Instead of Cesium.Matrix3.multiply(m, Cesium.Matrix3.fromScale(scale), m);
	 * Cesium.Matrix3.multiplyByScale(m, scale, m);
	 *
	 * @see Matrix3.multiplyByUniformScale
	 * @see Matrix3.fromScale
	 * @see Matrix3.fromUniformScale
	 * @see Matrix3.setScale
	 * @see Matrix3.setUniformScale
	 * @see Matrix3.getScale
	 */
	Matrix3.multiplyByScale = function (matrix, scale, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("scale", scale);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = matrix[0] * scale.x;
	  result[1] = matrix[1] * scale.x;
	  result[2] = matrix[2] * scale.x;
	  result[3] = matrix[3] * scale.y;
	  result[4] = matrix[4] * scale.y;
	  result[5] = matrix[5] * scale.y;
	  result[6] = matrix[6] * scale.z;
	  result[7] = matrix[7] * scale.z;
	  result[8] = matrix[8] * scale.z;

	  return result;
	};

	/**
	 * Computes the product of a matrix times a uniform scale, as if the scale were a scale matrix.
	 *
	 * @param {Matrix3} matrix The matrix on the left-hand side.
	 * @param {number} scale The uniform scale on the right-hand side.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 *
	 * @example
	 * // Instead of Cesium.Matrix3.multiply(m, Cesium.Matrix3.fromUniformScale(scale), m);
	 * Cesium.Matrix3.multiplyByUniformScale(m, scale, m);
	 *
	 * @see Matrix3.multiplyByScale
	 * @see Matrix3.fromScale
	 * @see Matrix3.fromUniformScale
	 * @see Matrix3.setScale
	 * @see Matrix3.setUniformScale
	 * @see Matrix3.getScale
	 */
	Matrix3.multiplyByUniformScale = function (matrix, scale, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.number("scale", scale);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = matrix[0] * scale;
	  result[1] = matrix[1] * scale;
	  result[2] = matrix[2] * scale;
	  result[3] = matrix[3] * scale;
	  result[4] = matrix[4] * scale;
	  result[5] = matrix[5] * scale;
	  result[6] = matrix[6] * scale;
	  result[7] = matrix[7] * scale;
	  result[8] = matrix[8] * scale;

	  return result;
	};

	/**
	 * Creates a negated copy of the provided matrix.
	 *
	 * @param {Matrix3} matrix The matrix to negate.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 */
	Matrix3.negate = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = -matrix[0];
	  result[1] = -matrix[1];
	  result[2] = -matrix[2];
	  result[3] = -matrix[3];
	  result[4] = -matrix[4];
	  result[5] = -matrix[5];
	  result[6] = -matrix[6];
	  result[7] = -matrix[7];
	  result[8] = -matrix[8];
	  return result;
	};

	/**
	 * Computes the transpose of the provided matrix.
	 *
	 * @param {Matrix3} matrix The matrix to transpose.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 */
	Matrix3.transpose = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const column0Row0 = matrix[0];
	  const column0Row1 = matrix[3];
	  const column0Row2 = matrix[6];
	  const column1Row0 = matrix[1];
	  const column1Row1 = matrix[4];
	  const column1Row2 = matrix[7];
	  const column2Row0 = matrix[2];
	  const column2Row1 = matrix[5];
	  const column2Row2 = matrix[8];

	  result[0] = column0Row0;
	  result[1] = column0Row1;
	  result[2] = column0Row2;
	  result[3] = column1Row0;
	  result[4] = column1Row1;
	  result[5] = column1Row2;
	  result[6] = column2Row0;
	  result[7] = column2Row1;
	  result[8] = column2Row2;
	  return result;
	};

	function computeFrobeniusNorm(matrix) {
	  let norm = 0.0;
	  for (let i = 0; i < 9; ++i) {
	    const temp = matrix[i];
	    norm += temp * temp;
	  }

	  return Math.sqrt(norm);
	}

	const rowVal = [1, 0, 0];
	const colVal = [2, 2, 1];

	function offDiagonalFrobeniusNorm(matrix) {
	  // Computes the "off-diagonal" Frobenius norm.
	  // Assumes matrix is symmetric.

	  let norm = 0.0;
	  for (let i = 0; i < 3; ++i) {
	    const temp = matrix[Matrix3.getElementIndex(colVal[i], rowVal[i])];
	    norm += 2.0 * temp * temp;
	  }

	  return Math.sqrt(norm);
	}

	function shurDecomposition(matrix, result) {
	  // This routine was created based upon Matrix Computations, 3rd ed., by Golub and Van Loan,
	  // section 8.4.2 The 2by2 Symmetric Schur Decomposition.
	  //
	  // The routine takes a matrix, which is assumed to be symmetric, and
	  // finds the largest off-diagonal term, and then creates
	  // a matrix (result) which can be used to help reduce it

	  const tolerance = CesiumMath.EPSILON15;

	  let maxDiagonal = 0.0;
	  let rotAxis = 1;

	  // find pivot (rotAxis) based on max diagonal of matrix
	  for (let i = 0; i < 3; ++i) {
	    const temp = Math.abs(
	      matrix[Matrix3.getElementIndex(colVal[i], rowVal[i])],
	    );
	    if (temp > maxDiagonal) {
	      rotAxis = i;
	      maxDiagonal = temp;
	    }
	  }

	  let c = 1.0;
	  let s = 0.0;

	  const p = rowVal[rotAxis];
	  const q = colVal[rotAxis];

	  if (Math.abs(matrix[Matrix3.getElementIndex(q, p)]) > tolerance) {
	    const qq = matrix[Matrix3.getElementIndex(q, q)];
	    const pp = matrix[Matrix3.getElementIndex(p, p)];
	    const qp = matrix[Matrix3.getElementIndex(q, p)];

	    const tau = (qq - pp) / 2.0 / qp;
	    let t;

	    if (tau < 0.0) {
	      t = -1.0 / (-tau + Math.sqrt(1.0 + tau * tau));
	    } else {
	      t = 1.0 / (tau + Math.sqrt(1.0 + tau * tau));
	    }

	    c = 1.0 / Math.sqrt(1.0 + t * t);
	    s = t * c;
	  }

	  result = Matrix3.clone(Matrix3.IDENTITY, result);

	  result[Matrix3.getElementIndex(p, p)] = result[
	    Matrix3.getElementIndex(q, q)
	  ] = c;
	  result[Matrix3.getElementIndex(q, p)] = s;
	  result[Matrix3.getElementIndex(p, q)] = -s;

	  return result;
	}

	const jMatrix = new Matrix3();
	const jMatrixTranspose = new Matrix3();

	/**
	 * Computes the eigenvectors and eigenvalues of a symmetric matrix.
	 * <p>
	 * Returns a diagonal matrix and unitary matrix such that:
	 * <code>matrix = unitary matrix * diagonal matrix * transpose(unitary matrix)</code>
	 * </p>
	 * <p>
	 * The values along the diagonal of the diagonal matrix are the eigenvalues. The columns
	 * of the unitary matrix are the corresponding eigenvectors.
	 * </p>
	 *
	 * @param {Matrix3} matrix The matrix to decompose into diagonal and unitary matrix. Expected to be symmetric.
	 * @param {object} [result] An object with unitary and diagonal properties which are matrices onto which to store the result.
	 * @returns {object} An object with unitary and diagonal properties which are the unitary and diagonal matrices, respectively.
	 *
	 * @example
	 * const a = //... symetric matrix
	 * const result = {
	 *     unitary : new Cesium.Matrix3(),
	 *     diagonal : new Cesium.Matrix3()
	 * };
	 * Cesium.Matrix3.computeEigenDecomposition(a, result);
	 *
	 * const unitaryTranspose = Cesium.Matrix3.transpose(result.unitary, new Cesium.Matrix3());
	 * const b = Cesium.Matrix3.multiply(result.unitary, result.diagonal, new Cesium.Matrix3());
	 * Cesium.Matrix3.multiply(b, unitaryTranspose, b); // b is now equal to a
	 *
	 * const lambda = Cesium.Matrix3.getColumn(result.diagonal, 0, new Cesium.Cartesian3()).x;  // first eigenvalue
	 * const v = Cesium.Matrix3.getColumn(result.unitary, 0, new Cesium.Cartesian3());          // first eigenvector
	 * const c = Cesium.Cartesian3.multiplyByScalar(v, lambda, new Cesium.Cartesian3());        // equal to Cesium.Matrix3.multiplyByVector(a, v)
	 */
	Matrix3.computeEigenDecomposition = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  //>>includeEnd('debug');

	  // This routine was created based upon Matrix Computations, 3rd ed., by Golub and Van Loan,
	  // section 8.4.3 The Classical Jacobi Algorithm

	  const tolerance = CesiumMath.EPSILON20;
	  const maxSweeps = 10;

	  let count = 0;
	  let sweep = 0;

	  if (!defined(result)) {
	    result = {};
	  }

	  const unitaryMatrix = (result.unitary = Matrix3.clone(
	    Matrix3.IDENTITY,
	    result.unitary,
	  ));
	  const diagMatrix = (result.diagonal = Matrix3.clone(matrix, result.diagonal));

	  const epsilon = tolerance * computeFrobeniusNorm(diagMatrix);

	  while (sweep < maxSweeps && offDiagonalFrobeniusNorm(diagMatrix) > epsilon) {
	    shurDecomposition(diagMatrix, jMatrix);
	    Matrix3.transpose(jMatrix, jMatrixTranspose);
	    Matrix3.multiply(diagMatrix, jMatrix, diagMatrix);
	    Matrix3.multiply(jMatrixTranspose, diagMatrix, diagMatrix);
	    Matrix3.multiply(unitaryMatrix, jMatrix, unitaryMatrix);

	    if (++count > 2) {
	      ++sweep;
	      count = 0;
	    }
	  }

	  return result;
	};

	/**
	 * Computes a matrix, which contains the absolute (unsigned) values of the provided matrix's elements.
	 *
	 * @param {Matrix3} matrix The matrix with signed elements.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 */
	Matrix3.abs = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = Math.abs(matrix[0]);
	  result[1] = Math.abs(matrix[1]);
	  result[2] = Math.abs(matrix[2]);
	  result[3] = Math.abs(matrix[3]);
	  result[4] = Math.abs(matrix[4]);
	  result[5] = Math.abs(matrix[5]);
	  result[6] = Math.abs(matrix[6]);
	  result[7] = Math.abs(matrix[7]);
	  result[8] = Math.abs(matrix[8]);

	  return result;
	};

	/**
	 * Computes the determinant of the provided matrix.
	 *
	 * @param {Matrix3} matrix The matrix to use.
	 * @returns {number} The value of the determinant of the matrix.
	 */
	Matrix3.determinant = function (matrix) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  //>>includeEnd('debug');

	  const m11 = matrix[0];
	  const m21 = matrix[3];
	  const m31 = matrix[6];
	  const m12 = matrix[1];
	  const m22 = matrix[4];
	  const m32 = matrix[7];
	  const m13 = matrix[2];
	  const m23 = matrix[5];
	  const m33 = matrix[8];

	  return (
	    m11 * (m22 * m33 - m23 * m32) +
	    m12 * (m23 * m31 - m21 * m33) +
	    m13 * (m21 * m32 - m22 * m31)
	  );
	};

	/**
	 * Computes the inverse of the provided matrix.
	 *
	 * @param {Matrix3} matrix The matrix to invert.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 *
	 * @exception {DeveloperError} matrix is not invertible.
	 */
	Matrix3.inverse = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const m11 = matrix[0];
	  const m21 = matrix[1];
	  const m31 = matrix[2];
	  const m12 = matrix[3];
	  const m22 = matrix[4];
	  const m32 = matrix[5];
	  const m13 = matrix[6];
	  const m23 = matrix[7];
	  const m33 = matrix[8];

	  const determinant = Matrix3.determinant(matrix);

	  //>>includeStart('debug', pragmas.debug);
	  if (Math.abs(determinant) <= CesiumMath.EPSILON15) {
	    throw new DeveloperError("matrix is not invertible");
	  }
	  //>>includeEnd('debug');

	  result[0] = m22 * m33 - m23 * m32;
	  result[1] = m23 * m31 - m21 * m33;
	  result[2] = m21 * m32 - m22 * m31;
	  result[3] = m13 * m32 - m12 * m33;
	  result[4] = m11 * m33 - m13 * m31;
	  result[5] = m12 * m31 - m11 * m32;
	  result[6] = m12 * m23 - m13 * m22;
	  result[7] = m13 * m21 - m11 * m23;
	  result[8] = m11 * m22 - m12 * m21;

	  const scale = 1.0 / determinant;
	  return Matrix3.multiplyByScalar(result, scale, result);
	};

	const scratchTransposeMatrix$1 = new Matrix3();

	/**
	 * Computes the inverse transpose of a matrix.
	 *
	 * @param {Matrix3} matrix The matrix to transpose and invert.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 */
	Matrix3.inverseTranspose = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  return Matrix3.inverse(
	    Matrix3.transpose(matrix, scratchTransposeMatrix$1),
	    result,
	  );
	};

	/**
	 * Compares the provided matrices componentwise and returns
	 * <code>true</code> if they are equal, <code>false</code> otherwise.
	 *
	 * @param {Matrix3} [left] The first matrix.
	 * @param {Matrix3} [right] The second matrix.
	 * @returns {boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
	 */
	Matrix3.equals = function (left, right) {
	  return (
	    left === right ||
	    (defined(left) &&
	      defined(right) &&
	      left[0] === right[0] &&
	      left[1] === right[1] &&
	      left[2] === right[2] &&
	      left[3] === right[3] &&
	      left[4] === right[4] &&
	      left[5] === right[5] &&
	      left[6] === right[6] &&
	      left[7] === right[7] &&
	      left[8] === right[8])
	  );
	};

	/**
	 * Compares the provided matrices componentwise and returns
	 * <code>true</code> if they are within the provided epsilon,
	 * <code>false</code> otherwise.
	 *
	 * @param {Matrix3} [left] The first matrix.
	 * @param {Matrix3} [right] The second matrix.
	 * @param {number} [epsilon=0] The epsilon to use for equality testing.
	 * @returns {boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
	 */
	Matrix3.equalsEpsilon = function (left, right, epsilon) {
	  epsilon = defaultValue(epsilon, 0);

	  return (
	    left === right ||
	    (defined(left) &&
	      defined(right) &&
	      Math.abs(left[0] - right[0]) <= epsilon &&
	      Math.abs(left[1] - right[1]) <= epsilon &&
	      Math.abs(left[2] - right[2]) <= epsilon &&
	      Math.abs(left[3] - right[3]) <= epsilon &&
	      Math.abs(left[4] - right[4]) <= epsilon &&
	      Math.abs(left[5] - right[5]) <= epsilon &&
	      Math.abs(left[6] - right[6]) <= epsilon &&
	      Math.abs(left[7] - right[7]) <= epsilon &&
	      Math.abs(left[8] - right[8]) <= epsilon)
	  );
	};

	/**
	 * An immutable Matrix3 instance initialized to the identity matrix.
	 *
	 * @type {Matrix3}
	 * @constant
	 */
	Matrix3.IDENTITY = Object.freeze(
	  new Matrix3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0),
	);

	/**
	 * An immutable Matrix3 instance initialized to the zero matrix.
	 *
	 * @type {Matrix3}
	 * @constant
	 */
	Matrix3.ZERO = Object.freeze(
	  new Matrix3(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
	);

	/**
	 * The index into Matrix3 for column 0, row 0.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix3.COLUMN0ROW0 = 0;

	/**
	 * The index into Matrix3 for column 0, row 1.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix3.COLUMN0ROW1 = 1;

	/**
	 * The index into Matrix3 for column 0, row 2.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix3.COLUMN0ROW2 = 2;

	/**
	 * The index into Matrix3 for column 1, row 0.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix3.COLUMN1ROW0 = 3;

	/**
	 * The index into Matrix3 for column 1, row 1.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix3.COLUMN1ROW1 = 4;

	/**
	 * The index into Matrix3 for column 1, row 2.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix3.COLUMN1ROW2 = 5;

	/**
	 * The index into Matrix3 for column 2, row 0.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix3.COLUMN2ROW0 = 6;

	/**
	 * The index into Matrix3 for column 2, row 1.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix3.COLUMN2ROW1 = 7;

	/**
	 * The index into Matrix3 for column 2, row 2.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix3.COLUMN2ROW2 = 8;

	Object.defineProperties(Matrix3.prototype, {
	  /**
	   * Gets the number of items in the collection.
	   * @memberof Matrix3.prototype
	   *
	   * @type {number}
	   */
	  length: {
	    get: function () {
	      return Matrix3.packedLength;
	    },
	  },
	});

	/**
	 * Duplicates the provided Matrix3 instance.
	 *
	 * @param {Matrix3} [result] The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
	 */
	Matrix3.prototype.clone = function (result) {
	  return Matrix3.clone(this, result);
	};

	/**
	 * Compares this matrix to the provided matrix componentwise and returns
	 * <code>true</code> if they are equal, <code>false</code> otherwise.
	 *
	 * @param {Matrix3} [right] The right hand side matrix.
	 * @returns {boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
	 */
	Matrix3.prototype.equals = function (right) {
	  return Matrix3.equals(this, right);
	};

	/**
	 * @private
	 */
	Matrix3.equalsArray = function (matrix, array, offset) {
	  return (
	    matrix[0] === array[offset] &&
	    matrix[1] === array[offset + 1] &&
	    matrix[2] === array[offset + 2] &&
	    matrix[3] === array[offset + 3] &&
	    matrix[4] === array[offset + 4] &&
	    matrix[5] === array[offset + 5] &&
	    matrix[6] === array[offset + 6] &&
	    matrix[7] === array[offset + 7] &&
	    matrix[8] === array[offset + 8]
	  );
	};

	/**
	 * Compares this matrix to the provided matrix componentwise and returns
	 * <code>true</code> if they are within the provided epsilon,
	 * <code>false</code> otherwise.
	 *
	 * @param {Matrix3} [right] The right hand side matrix.
	 * @param {number} [epsilon=0] The epsilon to use for equality testing.
	 * @returns {boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
	 */
	Matrix3.prototype.equalsEpsilon = function (right, epsilon) {
	  return Matrix3.equalsEpsilon(this, right, epsilon);
	};

	/**
	 * Creates a string representing this Matrix with each row being
	 * on a separate line and in the format '(column0, column1, column2)'.
	 *
	 * @returns {string} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1, column2)'.
	 */
	Matrix3.prototype.toString = function () {
	  return (
	    `(${this[0]}, ${this[3]}, ${this[6]})\n` +
	    `(${this[1]}, ${this[4]}, ${this[7]})\n` +
	    `(${this[2]}, ${this[5]}, ${this[8]})`
	  );
	};

	/**
	 * A 4D Cartesian point.
	 * @alias Cartesian4
	 * @constructor
	 *
	 * @param {number} [x=0.0] The X component.
	 * @param {number} [y=0.0] The Y component.
	 * @param {number} [z=0.0] The Z component.
	 * @param {number} [w=0.0] The W component.
	 *
	 * @see Cartesian2
	 * @see Cartesian3
	 * @see Packable
	 */
	function Cartesian4(x, y, z, w) {
	  /**
	   * The X component.
	   * @type {number}
	   * @default 0.0
	   */
	  this.x = defaultValue(x, 0.0);

	  /**
	   * The Y component.
	   * @type {number}
	   * @default 0.0
	   */
	  this.y = defaultValue(y, 0.0);

	  /**
	   * The Z component.
	   * @type {number}
	   * @default 0.0
	   */
	  this.z = defaultValue(z, 0.0);

	  /**
	   * The W component.
	   * @type {number}
	   * @default 0.0
	   */
	  this.w = defaultValue(w, 0.0);
	}

	/**
	 * Creates a Cartesian4 instance from x, y, z and w coordinates.
	 *
	 * @param {number} x The x coordinate.
	 * @param {number} y The y coordinate.
	 * @param {number} z The z coordinate.
	 * @param {number} w The w coordinate.
	 * @param {Cartesian4} [result] The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
	 */
	Cartesian4.fromElements = function (x, y, z, w, result) {
	  if (!defined(result)) {
	    return new Cartesian4(x, y, z, w);
	  }

	  result.x = x;
	  result.y = y;
	  result.z = z;
	  result.w = w;
	  return result;
	};

	/**
	 * Creates a Cartesian4 instance from a {@link Color}. <code>red</code>, <code>green</code>, <code>blue</code>,
	 * and <code>alpha</code> map to <code>x</code>, <code>y</code>, <code>z</code>, and <code>w</code>, respectively.
	 *
	 * @param {Color} color The source color.
	 * @param {Cartesian4} [result] The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
	 */
	Cartesian4.fromColor = function (color, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("color", color);
	  //>>includeEnd('debug');
	  if (!defined(result)) {
	    return new Cartesian4(color.red, color.green, color.blue, color.alpha);
	  }

	  result.x = color.red;
	  result.y = color.green;
	  result.z = color.blue;
	  result.w = color.alpha;
	  return result;
	};

	/**
	 * Duplicates a Cartesian4 instance.
	 *
	 * @param {Cartesian4} cartesian The Cartesian to duplicate.
	 * @param {Cartesian4} [result] The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided. (Returns undefined if cartesian is undefined)
	 */
	Cartesian4.clone = function (cartesian, result) {
	  if (!defined(cartesian)) {
	    return undefined;
	  }

	  if (!defined(result)) {
	    return new Cartesian4(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
	  }

	  result.x = cartesian.x;
	  result.y = cartesian.y;
	  result.z = cartesian.z;
	  result.w = cartesian.w;
	  return result;
	};

	/**
	 * The number of elements used to pack the object into an array.
	 * @type {number}
	 */
	Cartesian4.packedLength = 4;

	/**
	 * Stores the provided instance into the provided array.
	 *
	 * @param {Cartesian4} value The value to pack.
	 * @param {number[]} array The array to pack into.
	 * @param {number} [startingIndex=0] The index into the array at which to start packing the elements.
	 *
	 * @returns {number[]} The array that was packed into
	 */
	Cartesian4.pack = function (value, array, startingIndex) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("value", value);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);

	  array[startingIndex++] = value.x;
	  array[startingIndex++] = value.y;
	  array[startingIndex++] = value.z;
	  array[startingIndex] = value.w;

	  return array;
	};

	/**
	 * Retrieves an instance from a packed array.
	 *
	 * @param {number[]} array The packed array.
	 * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
	 * @param {Cartesian4} [result] The object into which to store the result.
	 * @returns {Cartesian4}  The modified result parameter or a new Cartesian4 instance if one was not provided.
	 */
	Cartesian4.unpack = function (array, startingIndex, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);

	  if (!defined(result)) {
	    result = new Cartesian4();
	  }
	  result.x = array[startingIndex++];
	  result.y = array[startingIndex++];
	  result.z = array[startingIndex++];
	  result.w = array[startingIndex];
	  return result;
	};

	/**
	 * Flattens an array of Cartesian4s into an array of components.
	 *
	 * @param {Cartesian4[]} array The array of cartesians to pack.
	 * @param {number[]} [result] The array onto which to store the result. If this is a typed array, it must have array.length * 4 components, else a {@link DeveloperError} will be thrown. If it is a regular array, it will be resized to have (array.length * 4) elements.
	 * @returns {number[]} The packed array.
	 */
	Cartesian4.packArray = function (array, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  const length = array.length;
	  const resultLength = length * 4;
	  if (!defined(result)) {
	    result = new Array(resultLength);
	  } else if (!Array.isArray(result) && result.length !== resultLength) {
	    //>>includeStart('debug', pragmas.debug);
	    throw new DeveloperError(
	      "If result is a typed array, it must have exactly array.length * 4 elements",
	    );
	    //>>includeEnd('debug');
	  } else if (result.length !== resultLength) {
	    result.length = resultLength;
	  }

	  for (let i = 0; i < length; ++i) {
	    Cartesian4.pack(array[i], result, i * 4);
	  }
	  return result;
	};

	/**
	 * Unpacks an array of cartesian components into an array of Cartesian4s.
	 *
	 * @param {number[]} array The array of components to unpack.
	 * @param {Cartesian4[]} [result] The array onto which to store the result.
	 * @returns {Cartesian4[]} The unpacked array.
	 */
	Cartesian4.unpackArray = function (array, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  Check.typeOf.number.greaterThanOrEquals("array.length", array.length, 4);
	  if (array.length % 4 !== 0) {
	    throw new DeveloperError("array length must be a multiple of 4.");
	  }
	  //>>includeEnd('debug');

	  const length = array.length;
	  if (!defined(result)) {
	    result = new Array(length / 4);
	  } else {
	    result.length = length / 4;
	  }

	  for (let i = 0; i < length; i += 4) {
	    const index = i / 4;
	    result[index] = Cartesian4.unpack(array, i, result[index]);
	  }
	  return result;
	};

	/**
	 * Creates a Cartesian4 from four consecutive elements in an array.
	 * @function
	 *
	 * @param {number[]} array The array whose four consecutive elements correspond to the x, y, z, and w components, respectively.
	 * @param {number} [startingIndex=0] The offset into the array of the first element, which corresponds to the x component.
	 * @param {Cartesian4} [result] The object onto which to store the result.
	 * @returns {Cartesian4}  The modified result parameter or a new Cartesian4 instance if one was not provided.
	 *
	 * @example
	 * // Create a Cartesian4 with (1.0, 2.0, 3.0, 4.0)
	 * const v = [1.0, 2.0, 3.0, 4.0];
	 * const p = Cesium.Cartesian4.fromArray(v);
	 *
	 * // Create a Cartesian4 with (1.0, 2.0, 3.0, 4.0) using an offset into an array
	 * const v2 = [0.0, 0.0, 1.0, 2.0, 3.0, 4.0];
	 * const p2 = Cesium.Cartesian4.fromArray(v2, 2);
	 */
	Cartesian4.fromArray = Cartesian4.unpack;

	/**
	 * Computes the value of the maximum component for the supplied Cartesian.
	 *
	 * @param {Cartesian4} cartesian The cartesian to use.
	 * @returns {number} The value of the maximum component.
	 */
	Cartesian4.maximumComponent = function (cartesian) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  //>>includeEnd('debug');

	  return Math.max(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
	};

	/**
	 * Computes the value of the minimum component for the supplied Cartesian.
	 *
	 * @param {Cartesian4} cartesian The cartesian to use.
	 * @returns {number} The value of the minimum component.
	 */
	Cartesian4.minimumComponent = function (cartesian) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  //>>includeEnd('debug');

	  return Math.min(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
	};

	/**
	 * Compares two Cartesians and computes a Cartesian which contains the minimum components of the supplied Cartesians.
	 *
	 * @param {Cartesian4} first A cartesian to compare.
	 * @param {Cartesian4} second A cartesian to compare.
	 * @param {Cartesian4} result The object into which to store the result.
	 * @returns {Cartesian4} A cartesian with the minimum components.
	 */
	Cartesian4.minimumByComponent = function (first, second, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("first", first);
	  Check.typeOf.object("second", second);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Math.min(first.x, second.x);
	  result.y = Math.min(first.y, second.y);
	  result.z = Math.min(first.z, second.z);
	  result.w = Math.min(first.w, second.w);

	  return result;
	};

	/**
	 * Compares two Cartesians and computes a Cartesian which contains the maximum components of the supplied Cartesians.
	 *
	 * @param {Cartesian4} first A cartesian to compare.
	 * @param {Cartesian4} second A cartesian to compare.
	 * @param {Cartesian4} result The object into which to store the result.
	 * @returns {Cartesian4} A cartesian with the maximum components.
	 */
	Cartesian4.maximumByComponent = function (first, second, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("first", first);
	  Check.typeOf.object("second", second);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Math.max(first.x, second.x);
	  result.y = Math.max(first.y, second.y);
	  result.z = Math.max(first.z, second.z);
	  result.w = Math.max(first.w, second.w);

	  return result;
	};

	/**
	 * Constrain a value to lie between two values.
	 *
	 * @param {Cartesian4} value The value to clamp.
	 * @param {Cartesian4} min The minimum bound.
	 * @param {Cartesian4} max The maximum bound.
	 * @param {Cartesian4} result The object into which to store the result.
	 * @returns {Cartesian4} The clamped value such that min <= result <= max.
	 */
	Cartesian4.clamp = function (value, min, max, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("value", value);
	  Check.typeOf.object("min", min);
	  Check.typeOf.object("max", max);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const x = CesiumMath.clamp(value.x, min.x, max.x);
	  const y = CesiumMath.clamp(value.y, min.y, max.y);
	  const z = CesiumMath.clamp(value.z, min.z, max.z);
	  const w = CesiumMath.clamp(value.w, min.w, max.w);

	  result.x = x;
	  result.y = y;
	  result.z = z;
	  result.w = w;

	  return result;
	};

	/**
	 * Computes the provided Cartesian's squared magnitude.
	 *
	 * @param {Cartesian4} cartesian The Cartesian instance whose squared magnitude is to be computed.
	 * @returns {number} The squared magnitude.
	 */
	Cartesian4.magnitudeSquared = function (cartesian) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  //>>includeEnd('debug');

	  return (
	    cartesian.x * cartesian.x +
	    cartesian.y * cartesian.y +
	    cartesian.z * cartesian.z +
	    cartesian.w * cartesian.w
	  );
	};

	/**
	 * Computes the Cartesian's magnitude (length).
	 *
	 * @param {Cartesian4} cartesian The Cartesian instance whose magnitude is to be computed.
	 * @returns {number} The magnitude.
	 */
	Cartesian4.magnitude = function (cartesian) {
	  return Math.sqrt(Cartesian4.magnitudeSquared(cartesian));
	};

	const distanceScratch$1 = new Cartesian4();

	/**
	 * Computes the 4-space distance between two points.
	 *
	 * @param {Cartesian4} left The first point to compute the distance from.
	 * @param {Cartesian4} right The second point to compute the distance to.
	 * @returns {number} The distance between two points.
	 *
	 * @example
	 * // Returns 1.0
	 * const d = Cesium.Cartesian4.distance(
	 *   new Cesium.Cartesian4(1.0, 0.0, 0.0, 0.0),
	 *   new Cesium.Cartesian4(2.0, 0.0, 0.0, 0.0));
	 */
	Cartesian4.distance = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  Cartesian4.subtract(left, right, distanceScratch$1);
	  return Cartesian4.magnitude(distanceScratch$1);
	};

	/**
	 * Computes the squared distance between two points.  Comparing squared distances
	 * using this function is more efficient than comparing distances using {@link Cartesian4#distance}.
	 *
	 * @param {Cartesian4} left The first point to compute the distance from.
	 * @param {Cartesian4} right The second point to compute the distance to.
	 * @returns {number} The distance between two points.
	 *
	 * @example
	 * // Returns 4.0, not 2.0
	 * const d = Cesium.Cartesian4.distance(
	 *   new Cesium.Cartesian4(1.0, 0.0, 0.0, 0.0),
	 *   new Cesium.Cartesian4(3.0, 0.0, 0.0, 0.0));
	 */
	Cartesian4.distanceSquared = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  Cartesian4.subtract(left, right, distanceScratch$1);
	  return Cartesian4.magnitudeSquared(distanceScratch$1);
	};

	/**
	 * Computes the normalized form of the supplied Cartesian.
	 *
	 * @param {Cartesian4} cartesian The Cartesian to be normalized.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter.
	 */
	Cartesian4.normalize = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const magnitude = Cartesian4.magnitude(cartesian);

	  result.x = cartesian.x / magnitude;
	  result.y = cartesian.y / magnitude;
	  result.z = cartesian.z / magnitude;
	  result.w = cartesian.w / magnitude;

	  //>>includeStart('debug', pragmas.debug);
	  if (
	    isNaN(result.x) ||
	    isNaN(result.y) ||
	    isNaN(result.z) ||
	    isNaN(result.w)
	  ) {
	    throw new DeveloperError("normalized result is not a number");
	  }
	  //>>includeEnd('debug');

	  return result;
	};

	/**
	 * Computes the dot (scalar) product of two Cartesians.
	 *
	 * @param {Cartesian4} left The first Cartesian.
	 * @param {Cartesian4} right The second Cartesian.
	 * @returns {number} The dot product.
	 */
	Cartesian4.dot = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  return (
	    left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w
	  );
	};

	/**
	 * Computes the componentwise product of two Cartesians.
	 *
	 * @param {Cartesian4} left The first Cartesian.
	 * @param {Cartesian4} right The second Cartesian.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter.
	 */
	Cartesian4.multiplyComponents = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x * right.x;
	  result.y = left.y * right.y;
	  result.z = left.z * right.z;
	  result.w = left.w * right.w;
	  return result;
	};

	/**
	 * Computes the componentwise quotient of two Cartesians.
	 *
	 * @param {Cartesian4} left The first Cartesian.
	 * @param {Cartesian4} right The second Cartesian.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter.
	 */
	Cartesian4.divideComponents = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x / right.x;
	  result.y = left.y / right.y;
	  result.z = left.z / right.z;
	  result.w = left.w / right.w;
	  return result;
	};

	/**
	 * Computes the componentwise sum of two Cartesians.
	 *
	 * @param {Cartesian4} left The first Cartesian.
	 * @param {Cartesian4} right The second Cartesian.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter.
	 */
	Cartesian4.add = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x + right.x;
	  result.y = left.y + right.y;
	  result.z = left.z + right.z;
	  result.w = left.w + right.w;
	  return result;
	};

	/**
	 * Computes the componentwise difference of two Cartesians.
	 *
	 * @param {Cartesian4} left The first Cartesian.
	 * @param {Cartesian4} right The second Cartesian.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter.
	 */
	Cartesian4.subtract = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x - right.x;
	  result.y = left.y - right.y;
	  result.z = left.z - right.z;
	  result.w = left.w - right.w;
	  return result;
	};

	/**
	 * Multiplies the provided Cartesian componentwise by the provided scalar.
	 *
	 * @param {Cartesian4} cartesian The Cartesian to be scaled.
	 * @param {number} scalar The scalar to multiply with.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter.
	 */
	Cartesian4.multiplyByScalar = function (cartesian, scalar, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.number("scalar", scalar);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = cartesian.x * scalar;
	  result.y = cartesian.y * scalar;
	  result.z = cartesian.z * scalar;
	  result.w = cartesian.w * scalar;
	  return result;
	};

	/**
	 * Divides the provided Cartesian componentwise by the provided scalar.
	 *
	 * @param {Cartesian4} cartesian The Cartesian to be divided.
	 * @param {number} scalar The scalar to divide by.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter.
	 */
	Cartesian4.divideByScalar = function (cartesian, scalar, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.number("scalar", scalar);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = cartesian.x / scalar;
	  result.y = cartesian.y / scalar;
	  result.z = cartesian.z / scalar;
	  result.w = cartesian.w / scalar;
	  return result;
	};

	/**
	 * Negates the provided Cartesian.
	 *
	 * @param {Cartesian4} cartesian The Cartesian to be negated.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter.
	 */
	Cartesian4.negate = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = -cartesian.x;
	  result.y = -cartesian.y;
	  result.z = -cartesian.z;
	  result.w = -cartesian.w;
	  return result;
	};

	/**
	 * Computes the absolute value of the provided Cartesian.
	 *
	 * @param {Cartesian4} cartesian The Cartesian whose absolute value is to be computed.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter.
	 */
	Cartesian4.abs = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Math.abs(cartesian.x);
	  result.y = Math.abs(cartesian.y);
	  result.z = Math.abs(cartesian.z);
	  result.w = Math.abs(cartesian.w);
	  return result;
	};

	const lerpScratch$1 = new Cartesian4();
	/**
	 * Computes the linear interpolation or extrapolation at t using the provided cartesians.
	 *
	 * @param {Cartesian4} start The value corresponding to t at 0.0.
	 * @param {Cartesian4}end The value corresponding to t at 1.0.
	 * @param {number} t The point along t at which to interpolate.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter.
	 */
	Cartesian4.lerp = function (start, end, t, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("start", start);
	  Check.typeOf.object("end", end);
	  Check.typeOf.number("t", t);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  Cartesian4.multiplyByScalar(end, t, lerpScratch$1);
	  result = Cartesian4.multiplyByScalar(start, 1.0 - t, result);
	  return Cartesian4.add(lerpScratch$1, result, result);
	};

	const mostOrthogonalAxisScratch$1 = new Cartesian4();
	/**
	 * Returns the axis that is most orthogonal to the provided Cartesian.
	 *
	 * @param {Cartesian4} cartesian The Cartesian on which to find the most orthogonal axis.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The most orthogonal axis.
	 */
	Cartesian4.mostOrthogonalAxis = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const f = Cartesian4.normalize(cartesian, mostOrthogonalAxisScratch$1);
	  Cartesian4.abs(f, f);

	  if (f.x <= f.y) {
	    if (f.x <= f.z) {
	      if (f.x <= f.w) {
	        result = Cartesian4.clone(Cartesian4.UNIT_X, result);
	      } else {
	        result = Cartesian4.clone(Cartesian4.UNIT_W, result);
	      }
	    } else if (f.z <= f.w) {
	      result = Cartesian4.clone(Cartesian4.UNIT_Z, result);
	    } else {
	      result = Cartesian4.clone(Cartesian4.UNIT_W, result);
	    }
	  } else if (f.y <= f.z) {
	    if (f.y <= f.w) {
	      result = Cartesian4.clone(Cartesian4.UNIT_Y, result);
	    } else {
	      result = Cartesian4.clone(Cartesian4.UNIT_W, result);
	    }
	  } else if (f.z <= f.w) {
	    result = Cartesian4.clone(Cartesian4.UNIT_Z, result);
	  } else {
	    result = Cartesian4.clone(Cartesian4.UNIT_W, result);
	  }

	  return result;
	};

	/**
	 * Compares the provided Cartesians componentwise and returns
	 * <code>true</code> if they are equal, <code>false</code> otherwise.
	 *
	 * @param {Cartesian4} [left] The first Cartesian.
	 * @param {Cartesian4} [right] The second Cartesian.
	 * @returns {boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
	 */
	Cartesian4.equals = function (left, right) {
	  return (
	    left === right ||
	    (defined(left) &&
	      defined(right) &&
	      left.x === right.x &&
	      left.y === right.y &&
	      left.z === right.z &&
	      left.w === right.w)
	  );
	};

	/**
	 * @private
	 */
	Cartesian4.equalsArray = function (cartesian, array, offset) {
	  return (
	    cartesian.x === array[offset] &&
	    cartesian.y === array[offset + 1] &&
	    cartesian.z === array[offset + 2] &&
	    cartesian.w === array[offset + 3]
	  );
	};

	/**
	 * Compares the provided Cartesians componentwise and returns
	 * <code>true</code> if they pass an absolute or relative tolerance test,
	 * <code>false</code> otherwise.
	 *
	 * @param {Cartesian4} [left] The first Cartesian.
	 * @param {Cartesian4} [right] The second Cartesian.
	 * @param {number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
	 * @param {number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
	 * @returns {boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
	 */
	Cartesian4.equalsEpsilon = function (
	  left,
	  right,
	  relativeEpsilon,
	  absoluteEpsilon,
	) {
	  return (
	    left === right ||
	    (defined(left) &&
	      defined(right) &&
	      CesiumMath.equalsEpsilon(
	        left.x,
	        right.x,
	        relativeEpsilon,
	        absoluteEpsilon,
	      ) &&
	      CesiumMath.equalsEpsilon(
	        left.y,
	        right.y,
	        relativeEpsilon,
	        absoluteEpsilon,
	      ) &&
	      CesiumMath.equalsEpsilon(
	        left.z,
	        right.z,
	        relativeEpsilon,
	        absoluteEpsilon,
	      ) &&
	      CesiumMath.equalsEpsilon(
	        left.w,
	        right.w,
	        relativeEpsilon,
	        absoluteEpsilon,
	      ))
	  );
	};

	/**
	 * An immutable Cartesian4 instance initialized to (0.0, 0.0, 0.0, 0.0).
	 *
	 * @type {Cartesian4}
	 * @constant
	 */
	Cartesian4.ZERO = Object.freeze(new Cartesian4(0.0, 0.0, 0.0, 0.0));

	/**
	 * An immutable Cartesian4 instance initialized to (1.0, 1.0, 1.0, 1.0).
	 *
	 * @type {Cartesian4}
	 * @constant
	 */
	Cartesian4.ONE = Object.freeze(new Cartesian4(1.0, 1.0, 1.0, 1.0));

	/**
	 * An immutable Cartesian4 instance initialized to (1.0, 0.0, 0.0, 0.0).
	 *
	 * @type {Cartesian4}
	 * @constant
	 */
	Cartesian4.UNIT_X = Object.freeze(new Cartesian4(1.0, 0.0, 0.0, 0.0));

	/**
	 * An immutable Cartesian4 instance initialized to (0.0, 1.0, 0.0, 0.0).
	 *
	 * @type {Cartesian4}
	 * @constant
	 */
	Cartesian4.UNIT_Y = Object.freeze(new Cartesian4(0.0, 1.0, 0.0, 0.0));

	/**
	 * An immutable Cartesian4 instance initialized to (0.0, 0.0, 1.0, 0.0).
	 *
	 * @type {Cartesian4}
	 * @constant
	 */
	Cartesian4.UNIT_Z = Object.freeze(new Cartesian4(0.0, 0.0, 1.0, 0.0));

	/**
	 * An immutable Cartesian4 instance initialized to (0.0, 0.0, 0.0, 1.0).
	 *
	 * @type {Cartesian4}
	 * @constant
	 */
	Cartesian4.UNIT_W = Object.freeze(new Cartesian4(0.0, 0.0, 0.0, 1.0));

	/**
	 * Duplicates this Cartesian4 instance.
	 *
	 * @param {Cartesian4} [result] The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
	 */
	Cartesian4.prototype.clone = function (result) {
	  return Cartesian4.clone(this, result);
	};

	/**
	 * Compares this Cartesian against the provided Cartesian componentwise and returns
	 * <code>true</code> if they are equal, <code>false</code> otherwise.
	 *
	 * @param {Cartesian4} [right] The right hand side Cartesian.
	 * @returns {boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
	 */
	Cartesian4.prototype.equals = function (right) {
	  return Cartesian4.equals(this, right);
	};

	/**
	 * Compares this Cartesian against the provided Cartesian componentwise and returns
	 * <code>true</code> if they pass an absolute or relative tolerance test,
	 * <code>false</code> otherwise.
	 *
	 * @param {Cartesian4} [right] The right hand side Cartesian.
	 * @param {number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
	 * @param {number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
	 * @returns {boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
	 */
	Cartesian4.prototype.equalsEpsilon = function (
	  right,
	  relativeEpsilon,
	  absoluteEpsilon,
	) {
	  return Cartesian4.equalsEpsilon(
	    this,
	    right,
	    relativeEpsilon,
	    absoluteEpsilon,
	  );
	};

	/**
	 * Creates a string representing this Cartesian in the format '(x, y, z, w)'.
	 *
	 * @returns {string} A string representing the provided Cartesian in the format '(x, y, z, w)'.
	 */
	Cartesian4.prototype.toString = function () {
	  return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
	};

	// scratchU8Array and scratchF32Array are views into the same buffer
	const scratchF32Array = new Float32Array(1);
	const scratchU8Array = new Uint8Array(scratchF32Array.buffer);

	const testU32 = new Uint32Array([0x11223344]);
	const testU8 = new Uint8Array(testU32.buffer);
	const littleEndian = testU8[0] === 0x44;

	/**
	 * Packs an arbitrary floating point value to 4 values representable using uint8.
	 *
	 * @param {number} value A floating point number.
	 * @param {Cartesian4} [result] The Cartesian4 that will contain the packed float.
	 * @returns {Cartesian4} A Cartesian4 representing the float packed to values in x, y, z, and w.
	 */
	Cartesian4.packFloat = function (value, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("value", value);
	  //>>includeEnd('debug');

	  if (!defined(result)) {
	    result = new Cartesian4();
	  }

	  // scratchU8Array and scratchF32Array are views into the same buffer
	  scratchF32Array[0] = value;

	  if (littleEndian) {
	    result.x = scratchU8Array[0];
	    result.y = scratchU8Array[1];
	    result.z = scratchU8Array[2];
	    result.w = scratchU8Array[3];
	  } else {
	    // convert from big-endian to little-endian
	    result.x = scratchU8Array[3];
	    result.y = scratchU8Array[2];
	    result.z = scratchU8Array[1];
	    result.w = scratchU8Array[0];
	  }
	  return result;
	};

	/**
	 * Unpacks a float packed using Cartesian4.packFloat.
	 *
	 * @param {Cartesian4} packedFloat A Cartesian4 containing a float packed to 4 values representable using uint8.
	 * @returns {number} The unpacked float.
	 * @private
	 */
	Cartesian4.unpackFloat = function (packedFloat) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("packedFloat", packedFloat);
	  //>>includeEnd('debug');

	  // scratchU8Array and scratchF32Array are views into the same buffer
	  if (littleEndian) {
	    scratchU8Array[0] = packedFloat.x;
	    scratchU8Array[1] = packedFloat.y;
	    scratchU8Array[2] = packedFloat.z;
	    scratchU8Array[3] = packedFloat.w;
	  } else {
	    // convert from little-endian to big-endian
	    scratchU8Array[0] = packedFloat.w;
	    scratchU8Array[1] = packedFloat.z;
	    scratchU8Array[2] = packedFloat.y;
	    scratchU8Array[3] = packedFloat.x;
	  }
	  return scratchF32Array[0];
	};

	/**
	 * Constructs an exception object that is thrown due to an error that can occur at runtime, e.g.,
	 * out of memory, could not compile shader, etc.  If a function may throw this
	 * exception, the calling code should be prepared to catch it.
	 * <br /><br />
	 * On the other hand, a {@link DeveloperError} indicates an exception due
	 * to a developer error, e.g., invalid argument, that usually indicates a bug in the
	 * calling code.
	 *
	 * @alias RuntimeError
	 * @constructor
	 * @extends Error
	 *
	 * @param {string} [message] The error message for this exception.
	 *
	 * @see DeveloperError
	 */
	function RuntimeError(message) {
	  /**
	   * 'RuntimeError' indicating that this exception was thrown due to a runtime error.
	   * @type {string}
	   * @readonly
	   */
	  this.name = "RuntimeError";

	  /**
	   * The explanation for why this exception was thrown.
	   * @type {string}
	   * @readonly
	   */
	  this.message = message;

	  //Browsers such as IE don't have a stack property until you actually throw the error.
	  let stack;
	  try {
	    throw new Error();
	  } catch (e) {
	    stack = e.stack;
	  }

	  /**
	   * The stack trace of this exception, if available.
	   * @type {string}
	   * @readonly
	   */
	  this.stack = stack;
	}

	if (defined(Object.create)) {
	  RuntimeError.prototype = Object.create(Error.prototype);
	  RuntimeError.prototype.constructor = RuntimeError;
	}

	RuntimeError.prototype.toString = function () {
	  let str = `${this.name}: ${this.message}`;

	  if (defined(this.stack)) {
	    str += `\n${this.stack.toString()}`;
	  }

	  return str;
	};

	/**
	 * A 4x4 matrix, indexable as a column-major order array.
	 * Constructor parameters are in row-major order for code readability.
	 * @alias Matrix4
	 * @constructor
	 * @implements {ArrayLike<number>}
	 *
	 * @param {number} [column0Row0=0.0] The value for column 0, row 0.
	 * @param {number} [column1Row0=0.0] The value for column 1, row 0.
	 * @param {number} [column2Row0=0.0] The value for column 2, row 0.
	 * @param {number} [column3Row0=0.0] The value for column 3, row 0.
	 * @param {number} [column0Row1=0.0] The value for column 0, row 1.
	 * @param {number} [column1Row1=0.0] The value for column 1, row 1.
	 * @param {number} [column2Row1=0.0] The value for column 2, row 1.
	 * @param {number} [column3Row1=0.0] The value for column 3, row 1.
	 * @param {number} [column0Row2=0.0] The value for column 0, row 2.
	 * @param {number} [column1Row2=0.0] The value for column 1, row 2.
	 * @param {number} [column2Row2=0.0] The value for column 2, row 2.
	 * @param {number} [column3Row2=0.0] The value for column 3, row 2.
	 * @param {number} [column0Row3=0.0] The value for column 0, row 3.
	 * @param {number} [column1Row3=0.0] The value for column 1, row 3.
	 * @param {number} [column2Row3=0.0] The value for column 2, row 3.
	 * @param {number} [column3Row3=0.0] The value for column 3, row 3.
	 *
	 * @see Matrix4.fromArray
	 * @see Matrix4.fromColumnMajorArray
	 * @see Matrix4.fromRowMajorArray
	 * @see Matrix4.fromRotationTranslation
	 * @see Matrix4.fromTranslationQuaternionRotationScale
	 * @see Matrix4.fromTranslationRotationScale
	 * @see Matrix4.fromTranslation
	 * @see Matrix4.fromScale
	 * @see Matrix4.fromUniformScale
	 * @see Matrix4.fromRotation
	 * @see Matrix4.fromCamera
	 * @see Matrix4.computePerspectiveFieldOfView
	 * @see Matrix4.computeOrthographicOffCenter
	 * @see Matrix4.computePerspectiveOffCenter
	 * @see Matrix4.computeInfinitePerspectiveOffCenter
	 * @see Matrix4.computeViewportTransformation
	 * @see Matrix4.computeView
	 * @see Matrix2
	 * @see Matrix3
	 * @see Packable
	 */
	function Matrix4(
	  column0Row0,
	  column1Row0,
	  column2Row0,
	  column3Row0,
	  column0Row1,
	  column1Row1,
	  column2Row1,
	  column3Row1,
	  column0Row2,
	  column1Row2,
	  column2Row2,
	  column3Row2,
	  column0Row3,
	  column1Row3,
	  column2Row3,
	  column3Row3,
	) {
	  this[0] = defaultValue(column0Row0, 0.0);
	  this[1] = defaultValue(column0Row1, 0.0);
	  this[2] = defaultValue(column0Row2, 0.0);
	  this[3] = defaultValue(column0Row3, 0.0);
	  this[4] = defaultValue(column1Row0, 0.0);
	  this[5] = defaultValue(column1Row1, 0.0);
	  this[6] = defaultValue(column1Row2, 0.0);
	  this[7] = defaultValue(column1Row3, 0.0);
	  this[8] = defaultValue(column2Row0, 0.0);
	  this[9] = defaultValue(column2Row1, 0.0);
	  this[10] = defaultValue(column2Row2, 0.0);
	  this[11] = defaultValue(column2Row3, 0.0);
	  this[12] = defaultValue(column3Row0, 0.0);
	  this[13] = defaultValue(column3Row1, 0.0);
	  this[14] = defaultValue(column3Row2, 0.0);
	  this[15] = defaultValue(column3Row3, 0.0);
	}

	/**
	 * The number of elements used to pack the object into an array.
	 * @type {number}
	 */
	Matrix4.packedLength = 16;

	/**
	 * Stores the provided instance into the provided array.
	 *
	 * @param {Matrix4} value The value to pack.
	 * @param {number[]} array The array to pack into.
	 * @param {number} [startingIndex=0] The index into the array at which to start packing the elements.
	 *
	 * @returns {number[]} The array that was packed into
	 */
	Matrix4.pack = function (value, array, startingIndex) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("value", value);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);

	  array[startingIndex++] = value[0];
	  array[startingIndex++] = value[1];
	  array[startingIndex++] = value[2];
	  array[startingIndex++] = value[3];
	  array[startingIndex++] = value[4];
	  array[startingIndex++] = value[5];
	  array[startingIndex++] = value[6];
	  array[startingIndex++] = value[7];
	  array[startingIndex++] = value[8];
	  array[startingIndex++] = value[9];
	  array[startingIndex++] = value[10];
	  array[startingIndex++] = value[11];
	  array[startingIndex++] = value[12];
	  array[startingIndex++] = value[13];
	  array[startingIndex++] = value[14];
	  array[startingIndex] = value[15];

	  return array;
	};

	/**
	 * Retrieves an instance from a packed array.
	 *
	 * @param {number[]} array The packed array.
	 * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
	 * @param {Matrix4} [result] The object into which to store the result.
	 * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
	 */
	Matrix4.unpack = function (array, startingIndex, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);

	  if (!defined(result)) {
	    result = new Matrix4();
	  }

	  result[0] = array[startingIndex++];
	  result[1] = array[startingIndex++];
	  result[2] = array[startingIndex++];
	  result[3] = array[startingIndex++];
	  result[4] = array[startingIndex++];
	  result[5] = array[startingIndex++];
	  result[6] = array[startingIndex++];
	  result[7] = array[startingIndex++];
	  result[8] = array[startingIndex++];
	  result[9] = array[startingIndex++];
	  result[10] = array[startingIndex++];
	  result[11] = array[startingIndex++];
	  result[12] = array[startingIndex++];
	  result[13] = array[startingIndex++];
	  result[14] = array[startingIndex++];
	  result[15] = array[startingIndex];
	  return result;
	};

	/**
	 * Flattens an array of Matrix4s into an array of components. The components
	 * are stored in column-major order.
	 *
	 * @param {Matrix4[]} array The array of matrices to pack.
	 * @param {number[]} [result] The array onto which to store the result. If this is a typed array, it must have array.length * 16 components, else a {@link DeveloperError} will be thrown. If it is a regular array, it will be resized to have (array.length * 16) elements.
	 * @returns {number[]} The packed array.
	 */
	Matrix4.packArray = function (array, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  const length = array.length;
	  const resultLength = length * 16;
	  if (!defined(result)) {
	    result = new Array(resultLength);
	  } else if (!Array.isArray(result) && result.length !== resultLength) {
	    //>>includeStart('debug', pragmas.debug);
	    throw new DeveloperError(
	      "If result is a typed array, it must have exactly array.length * 16 elements",
	    );
	    //>>includeEnd('debug');
	  } else if (result.length !== resultLength) {
	    result.length = resultLength;
	  }

	  for (let i = 0; i < length; ++i) {
	    Matrix4.pack(array[i], result, i * 16);
	  }
	  return result;
	};

	/**
	 * Unpacks an array of column-major matrix components into an array of Matrix4s.
	 *
	 * @param {number[]} array The array of components to unpack.
	 * @param {Matrix4[]} [result] The array onto which to store the result.
	 * @returns {Matrix4[]} The unpacked array.
	 */
	Matrix4.unpackArray = function (array, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  Check.typeOf.number.greaterThanOrEquals("array.length", array.length, 16);
	  if (array.length % 16 !== 0) {
	    throw new DeveloperError("array length must be a multiple of 16.");
	  }
	  //>>includeEnd('debug');

	  const length = array.length;
	  if (!defined(result)) {
	    result = new Array(length / 16);
	  } else {
	    result.length = length / 16;
	  }

	  for (let i = 0; i < length; i += 16) {
	    const index = i / 16;
	    result[index] = Matrix4.unpack(array, i, result[index]);
	  }
	  return result;
	};

	/**
	 * Duplicates a Matrix4 instance.
	 *
	 * @param {Matrix4} matrix The matrix to duplicate.
	 * @param {Matrix4} [result] The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided. (Returns undefined if matrix is undefined)
	 */
	Matrix4.clone = function (matrix, result) {
	  if (!defined(matrix)) {
	    return undefined;
	  }
	  if (!defined(result)) {
	    return new Matrix4(
	      matrix[0],
	      matrix[4],
	      matrix[8],
	      matrix[12],
	      matrix[1],
	      matrix[5],
	      matrix[9],
	      matrix[13],
	      matrix[2],
	      matrix[6],
	      matrix[10],
	      matrix[14],
	      matrix[3],
	      matrix[7],
	      matrix[11],
	      matrix[15],
	    );
	  }
	  result[0] = matrix[0];
	  result[1] = matrix[1];
	  result[2] = matrix[2];
	  result[3] = matrix[3];
	  result[4] = matrix[4];
	  result[5] = matrix[5];
	  result[6] = matrix[6];
	  result[7] = matrix[7];
	  result[8] = matrix[8];
	  result[9] = matrix[9];
	  result[10] = matrix[10];
	  result[11] = matrix[11];
	  result[12] = matrix[12];
	  result[13] = matrix[13];
	  result[14] = matrix[14];
	  result[15] = matrix[15];
	  return result;
	};

	/**
	 * Creates a Matrix4 from 16 consecutive elements in an array.
	 * @function
	 *
	 * @param {number[]} array The array whose 16 consecutive elements correspond to the positions of the matrix.  Assumes column-major order.
	 * @param {number} [startingIndex=0] The offset into the array of the first element, which corresponds to first column first row position in the matrix.
	 * @param {Matrix4} [result] The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
	 *
	 * @example
	 * // Create the Matrix4:
	 * // [1.0, 2.0, 3.0, 4.0]
	 * // [1.0, 2.0, 3.0, 4.0]
	 * // [1.0, 2.0, 3.0, 4.0]
	 * // [1.0, 2.0, 3.0, 4.0]
	 *
	 * const v = [1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 4.0, 4.0, 4.0, 4.0];
	 * const m = Cesium.Matrix4.fromArray(v);
	 *
	 * // Create same Matrix4 with using an offset into an array
	 * const v2 = [0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 4.0, 4.0, 4.0, 4.0];
	 * const m2 = Cesium.Matrix4.fromArray(v2, 2);
	 */
	Matrix4.fromArray = Matrix4.unpack;

	/**
	 * Computes a Matrix4 instance from a column-major order array.
	 *
	 * @param {number[]} values The column-major order array.
	 * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
	 */
	Matrix4.fromColumnMajorArray = function (values, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("values", values);
	  //>>includeEnd('debug');

	  return Matrix4.clone(values, result);
	};

	/**
	 * Computes a Matrix4 instance from a row-major order array.
	 * The resulting matrix will be in column-major order.
	 *
	 * @param {number[]} values The row-major order array.
	 * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
	 */
	Matrix4.fromRowMajorArray = function (values, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("values", values);
	  //>>includeEnd('debug');

	  if (!defined(result)) {
	    return new Matrix4(
	      values[0],
	      values[1],
	      values[2],
	      values[3],
	      values[4],
	      values[5],
	      values[6],
	      values[7],
	      values[8],
	      values[9],
	      values[10],
	      values[11],
	      values[12],
	      values[13],
	      values[14],
	      values[15],
	    );
	  }
	  result[0] = values[0];
	  result[1] = values[4];
	  result[2] = values[8];
	  result[3] = values[12];
	  result[4] = values[1];
	  result[5] = values[5];
	  result[6] = values[9];
	  result[7] = values[13];
	  result[8] = values[2];
	  result[9] = values[6];
	  result[10] = values[10];
	  result[11] = values[14];
	  result[12] = values[3];
	  result[13] = values[7];
	  result[14] = values[11];
	  result[15] = values[15];
	  return result;
	};

	/**
	 * Computes a Matrix4 instance from a Matrix3 representing the rotation
	 * and a Cartesian3 representing the translation.
	 *
	 * @param {Matrix3} rotation The upper left portion of the matrix representing the rotation.
	 * @param {Cartesian3} [translation=Cartesian3.ZERO] The upper right portion of the matrix representing the translation.
	 * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
	 */
	Matrix4.fromRotationTranslation = function (rotation, translation, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("rotation", rotation);
	  //>>includeEnd('debug');

	  translation = defaultValue(translation, Cartesian3.ZERO);

	  if (!defined(result)) {
	    return new Matrix4(
	      rotation[0],
	      rotation[3],
	      rotation[6],
	      translation.x,
	      rotation[1],
	      rotation[4],
	      rotation[7],
	      translation.y,
	      rotation[2],
	      rotation[5],
	      rotation[8],
	      translation.z,
	      0.0,
	      0.0,
	      0.0,
	      1.0,
	    );
	  }

	  result[0] = rotation[0];
	  result[1] = rotation[1];
	  result[2] = rotation[2];
	  result[3] = 0.0;
	  result[4] = rotation[3];
	  result[5] = rotation[4];
	  result[6] = rotation[5];
	  result[7] = 0.0;
	  result[8] = rotation[6];
	  result[9] = rotation[7];
	  result[10] = rotation[8];
	  result[11] = 0.0;
	  result[12] = translation.x;
	  result[13] = translation.y;
	  result[14] = translation.z;
	  result[15] = 1.0;
	  return result;
	};

	/**
	 * Computes a Matrix4 instance from a translation, rotation, and scale (TRS)
	 * representation with the rotation represented as a quaternion.
	 *
	 * @param {Cartesian3} translation The translation transformation.
	 * @param {Quaternion} rotation The rotation transformation.
	 * @param {Cartesian3} scale The non-uniform scale transformation.
	 * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
	 *
	 * @example
	 * const result = Cesium.Matrix4.fromTranslationQuaternionRotationScale(
	 *   new Cesium.Cartesian3(1.0, 2.0, 3.0), // translation
	 *   Cesium.Quaternion.IDENTITY,           // rotation
	 *   new Cesium.Cartesian3(7.0, 8.0, 9.0), // scale
	 *   result);
	 */
	Matrix4.fromTranslationQuaternionRotationScale = function (
	  translation,
	  rotation,
	  scale,
	  result,
	) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("translation", translation);
	  Check.typeOf.object("rotation", rotation);
	  Check.typeOf.object("scale", scale);
	  //>>includeEnd('debug');

	  if (!defined(result)) {
	    result = new Matrix4();
	  }

	  const scaleX = scale.x;
	  const scaleY = scale.y;
	  const scaleZ = scale.z;

	  const x2 = rotation.x * rotation.x;
	  const xy = rotation.x * rotation.y;
	  const xz = rotation.x * rotation.z;
	  const xw = rotation.x * rotation.w;
	  const y2 = rotation.y * rotation.y;
	  const yz = rotation.y * rotation.z;
	  const yw = rotation.y * rotation.w;
	  const z2 = rotation.z * rotation.z;
	  const zw = rotation.z * rotation.w;
	  const w2 = rotation.w * rotation.w;

	  const m00 = x2 - y2 - z2 + w2;
	  const m01 = 2.0 * (xy - zw);
	  const m02 = 2.0 * (xz + yw);

	  const m10 = 2.0 * (xy + zw);
	  const m11 = -x2 + y2 - z2 + w2;
	  const m12 = 2.0 * (yz - xw);

	  const m20 = 2.0 * (xz - yw);
	  const m21 = 2.0 * (yz + xw);
	  const m22 = -x2 - y2 + z2 + w2;

	  result[0] = m00 * scaleX;
	  result[1] = m10 * scaleX;
	  result[2] = m20 * scaleX;
	  result[3] = 0.0;
	  result[4] = m01 * scaleY;
	  result[5] = m11 * scaleY;
	  result[6] = m21 * scaleY;
	  result[7] = 0.0;
	  result[8] = m02 * scaleZ;
	  result[9] = m12 * scaleZ;
	  result[10] = m22 * scaleZ;
	  result[11] = 0.0;
	  result[12] = translation.x;
	  result[13] = translation.y;
	  result[14] = translation.z;
	  result[15] = 1.0;

	  return result;
	};

	/**
	 * Creates a Matrix4 instance from a {@link TranslationRotationScale} instance.
	 *
	 * @param {TranslationRotationScale} translationRotationScale The instance.
	 * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
	 */
	Matrix4.fromTranslationRotationScale = function (
	  translationRotationScale,
	  result,
	) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("translationRotationScale", translationRotationScale);
	  //>>includeEnd('debug');

	  return Matrix4.fromTranslationQuaternionRotationScale(
	    translationRotationScale.translation,
	    translationRotationScale.rotation,
	    translationRotationScale.scale,
	    result,
	  );
	};

	/**
	 * Creates a Matrix4 instance from a Cartesian3 representing the translation.
	 *
	 * @param {Cartesian3} translation The upper right portion of the matrix representing the translation.
	 * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
	 *
	 * @see Matrix4.multiplyByTranslation
	 */
	Matrix4.fromTranslation = function (translation, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("translation", translation);
	  //>>includeEnd('debug');

	  return Matrix4.fromRotationTranslation(Matrix3.IDENTITY, translation, result);
	};

	/**
	 * Computes a Matrix4 instance representing a non-uniform scale.
	 *
	 * @param {Cartesian3} scale The x, y, and z scale factors.
	 * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
	 *
	 * @example
	 * // Creates
	 * //   [7.0, 0.0, 0.0, 0.0]
	 * //   [0.0, 8.0, 0.0, 0.0]
	 * //   [0.0, 0.0, 9.0, 0.0]
	 * //   [0.0, 0.0, 0.0, 1.0]
	 * const m = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(7.0, 8.0, 9.0));
	 */
	Matrix4.fromScale = function (scale, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("scale", scale);
	  //>>includeEnd('debug');

	  if (!defined(result)) {
	    return new Matrix4(
	      scale.x,
	      0.0,
	      0.0,
	      0.0,
	      0.0,
	      scale.y,
	      0.0,
	      0.0,
	      0.0,
	      0.0,
	      scale.z,
	      0.0,
	      0.0,
	      0.0,
	      0.0,
	      1.0,
	    );
	  }

	  result[0] = scale.x;
	  result[1] = 0.0;
	  result[2] = 0.0;
	  result[3] = 0.0;
	  result[4] = 0.0;
	  result[5] = scale.y;
	  result[6] = 0.0;
	  result[7] = 0.0;
	  result[8] = 0.0;
	  result[9] = 0.0;
	  result[10] = scale.z;
	  result[11] = 0.0;
	  result[12] = 0.0;
	  result[13] = 0.0;
	  result[14] = 0.0;
	  result[15] = 1.0;
	  return result;
	};

	/**
	 * Computes a Matrix4 instance representing a uniform scale.
	 *
	 * @param {number} scale The uniform scale factor.
	 * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
	 *
	 * @example
	 * // Creates
	 * //   [2.0, 0.0, 0.0, 0.0]
	 * //   [0.0, 2.0, 0.0, 0.0]
	 * //   [0.0, 0.0, 2.0, 0.0]
	 * //   [0.0, 0.0, 0.0, 1.0]
	 * const m = Cesium.Matrix4.fromUniformScale(2.0);
	 */
	Matrix4.fromUniformScale = function (scale, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("scale", scale);
	  //>>includeEnd('debug');

	  if (!defined(result)) {
	    return new Matrix4(
	      scale,
	      0.0,
	      0.0,
	      0.0,
	      0.0,
	      scale,
	      0.0,
	      0.0,
	      0.0,
	      0.0,
	      scale,
	      0.0,
	      0.0,
	      0.0,
	      0.0,
	      1.0,
	    );
	  }

	  result[0] = scale;
	  result[1] = 0.0;
	  result[2] = 0.0;
	  result[3] = 0.0;
	  result[4] = 0.0;
	  result[5] = scale;
	  result[6] = 0.0;
	  result[7] = 0.0;
	  result[8] = 0.0;
	  result[9] = 0.0;
	  result[10] = scale;
	  result[11] = 0.0;
	  result[12] = 0.0;
	  result[13] = 0.0;
	  result[14] = 0.0;
	  result[15] = 1.0;
	  return result;
	};

	/**
	 * Creates a rotation matrix.
	 *
	 * @param {Matrix3} rotation The rotation matrix.
	 * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
	 */
	Matrix4.fromRotation = function (rotation, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("rotation", rotation);
	  //>>includeEnd('debug');

	  if (!defined(result)) {
	    result = new Matrix4();
	  }
	  result[0] = rotation[0];
	  result[1] = rotation[1];
	  result[2] = rotation[2];
	  result[3] = 0.0;

	  result[4] = rotation[3];
	  result[5] = rotation[4];
	  result[6] = rotation[5];
	  result[7] = 0.0;

	  result[8] = rotation[6];
	  result[9] = rotation[7];
	  result[10] = rotation[8];
	  result[11] = 0.0;

	  result[12] = 0.0;
	  result[13] = 0.0;
	  result[14] = 0.0;
	  result[15] = 1.0;

	  return result;
	};

	const fromCameraF = new Cartesian3();
	const fromCameraR = new Cartesian3();
	const fromCameraU = new Cartesian3();

	/**
	 * Computes a Matrix4 instance from a Camera.
	 *
	 * @param {Camera} camera The camera to use.
	 * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
	 * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
	 */
	Matrix4.fromCamera = function (camera, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("camera", camera);
	  //>>includeEnd('debug');

	  const position = camera.position;
	  const direction = camera.direction;
	  const up = camera.up;

	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("camera.position", position);
	  Check.typeOf.object("camera.direction", direction);
	  Check.typeOf.object("camera.up", up);
	  //>>includeEnd('debug');

	  Cartesian3.normalize(direction, fromCameraF);
	  Cartesian3.normalize(
	    Cartesian3.cross(fromCameraF, up, fromCameraR),
	    fromCameraR,
	  );
	  Cartesian3.normalize(
	    Cartesian3.cross(fromCameraR, fromCameraF, fromCameraU),
	    fromCameraU,
	  );

	  const sX = fromCameraR.x;
	  const sY = fromCameraR.y;
	  const sZ = fromCameraR.z;
	  const fX = fromCameraF.x;
	  const fY = fromCameraF.y;
	  const fZ = fromCameraF.z;
	  const uX = fromCameraU.x;
	  const uY = fromCameraU.y;
	  const uZ = fromCameraU.z;
	  const positionX = position.x;
	  const positionY = position.y;
	  const positionZ = position.z;
	  const t0 = sX * -positionX + sY * -positionY + sZ * -positionZ;
	  const t1 = uX * -positionX + uY * -positionY + uZ * -positionZ;
	  const t2 = fX * positionX + fY * positionY + fZ * positionZ;

	  // The code below this comment is an optimized
	  // version of the commented lines.
	  // Rather that create two matrices and then multiply,
	  // we just bake in the multiplcation as part of creation.
	  // const rotation = new Matrix4(
	  //                 sX,  sY,  sZ, 0.0,
	  //                 uX,  uY,  uZ, 0.0,
	  //                -fX, -fY, -fZ, 0.0,
	  //                 0.0,  0.0,  0.0, 1.0);
	  // const translation = new Matrix4(
	  //                 1.0, 0.0, 0.0, -position.x,
	  //                 0.0, 1.0, 0.0, -position.y,
	  //                 0.0, 0.0, 1.0, -position.z,
	  //                 0.0, 0.0, 0.0, 1.0);
	  // return rotation.multiply(translation);
	  if (!defined(result)) {
	    return new Matrix4(
	      sX,
	      sY,
	      sZ,
	      t0,
	      uX,
	      uY,
	      uZ,
	      t1,
	      -fX,
	      -fY,
	      -fZ,
	      t2,
	      0.0,
	      0.0,
	      0.0,
	      1.0,
	    );
	  }
	  result[0] = sX;
	  result[1] = uX;
	  result[2] = -fX;
	  result[3] = 0.0;
	  result[4] = sY;
	  result[5] = uY;
	  result[6] = -fY;
	  result[7] = 0.0;
	  result[8] = sZ;
	  result[9] = uZ;
	  result[10] = -fZ;
	  result[11] = 0.0;
	  result[12] = t0;
	  result[13] = t1;
	  result[14] = t2;
	  result[15] = 1.0;
	  return result;
	};

	/**
	 * Computes a Matrix4 instance representing a perspective transformation matrix.
	 *
	 * @param {number} fovY The field of view along the Y axis in radians.
	 * @param {number} aspectRatio The aspect ratio.
	 * @param {number} near The distance to the near plane in meters.
	 * @param {number} far The distance to the far plane in meters.
	 * @param {Matrix4} result The object in which the result will be stored.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @exception {DeveloperError} fovY must be in (0, PI].
	 * @exception {DeveloperError} aspectRatio must be greater than zero.
	 * @exception {DeveloperError} near must be greater than zero.
	 * @exception {DeveloperError} far must be greater than zero.
	 */
	Matrix4.computePerspectiveFieldOfView = function (
	  fovY,
	  aspectRatio,
	  near,
	  far,
	  result,
	) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number.greaterThan("fovY", fovY, 0.0);
	  Check.typeOf.number.lessThan("fovY", fovY, Math.PI);
	  Check.typeOf.number.greaterThan("near", near, 0.0);
	  Check.typeOf.number.greaterThan("far", far, 0.0);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const bottom = Math.tan(fovY * 0.5);

	  const column1Row1 = 1.0 / bottom;
	  const column0Row0 = column1Row1 / aspectRatio;
	  const column2Row2 = (far + near) / (near - far);
	  const column3Row2 = (2.0 * far * near) / (near - far);

	  result[0] = column0Row0;
	  result[1] = 0.0;
	  result[2] = 0.0;
	  result[3] = 0.0;
	  result[4] = 0.0;
	  result[5] = column1Row1;
	  result[6] = 0.0;
	  result[7] = 0.0;
	  result[8] = 0.0;
	  result[9] = 0.0;
	  result[10] = column2Row2;
	  result[11] = -1.0;
	  result[12] = 0.0;
	  result[13] = 0.0;
	  result[14] = column3Row2;
	  result[15] = 0.0;
	  return result;
	};

	/**
	 * Computes a Matrix4 instance representing an orthographic transformation matrix.
	 *
	 * @param {number} left The number of meters to the left of the camera that will be in view.
	 * @param {number} right The number of meters to the right of the camera that will be in view.
	 * @param {number} bottom The number of meters below of the camera that will be in view.
	 * @param {number} top The number of meters above of the camera that will be in view.
	 * @param {number} near The distance to the near plane in meters.
	 * @param {number} far The distance to the far plane in meters.
	 * @param {Matrix4} result The object in which the result will be stored.
	 * @returns {Matrix4} The modified result parameter.
	 */
	Matrix4.computeOrthographicOffCenter = function (
	  left,
	  right,
	  bottom,
	  top,
	  near,
	  far,
	  result,
	) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("left", left);
	  Check.typeOf.number("right", right);
	  Check.typeOf.number("bottom", bottom);
	  Check.typeOf.number("top", top);
	  Check.typeOf.number("near", near);
	  Check.typeOf.number("far", far);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  let a = 1.0 / (right - left);
	  let b = 1.0 / (top - bottom);
	  let c = 1.0 / (far - near);

	  const tx = -(right + left) * a;
	  const ty = -(top + bottom) * b;
	  const tz = -(far + near) * c;
	  a *= 2.0;
	  b *= 2.0;
	  c *= -2.0;

	  result[0] = a;
	  result[1] = 0.0;
	  result[2] = 0.0;
	  result[3] = 0.0;
	  result[4] = 0.0;
	  result[5] = b;
	  result[6] = 0.0;
	  result[7] = 0.0;
	  result[8] = 0.0;
	  result[9] = 0.0;
	  result[10] = c;
	  result[11] = 0.0;
	  result[12] = tx;
	  result[13] = ty;
	  result[14] = tz;
	  result[15] = 1.0;
	  return result;
	};

	/**
	 * Computes a Matrix4 instance representing an off center perspective transformation.
	 *
	 * @param {number} left The number of meters to the left of the camera that will be in view.
	 * @param {number} right The number of meters to the right of the camera that will be in view.
	 * @param {number} bottom The number of meters below the camera that will be in view.
	 * @param {number} top The number of meters above the camera that will be in view.
	 * @param {number} near The distance to the near plane in meters.
	 * @param {number} far The distance to the far plane in meters.
	 * @param {Matrix4} result The object in which the result will be stored.
	 * @returns {Matrix4} The modified result parameter.
	 */
	Matrix4.computePerspectiveOffCenter = function (
	  left,
	  right,
	  bottom,
	  top,
	  near,
	  far,
	  result,
	) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("left", left);
	  Check.typeOf.number("right", right);
	  Check.typeOf.number("bottom", bottom);
	  Check.typeOf.number("top", top);
	  Check.typeOf.number("near", near);
	  Check.typeOf.number("far", far);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const column0Row0 = (2.0 * near) / (right - left);
	  const column1Row1 = (2.0 * near) / (top - bottom);
	  const column2Row0 = (right + left) / (right - left);
	  const column2Row1 = (top + bottom) / (top - bottom);
	  const column2Row2 = -(far + near) / (far - near);
	  const column2Row3 = -1.0;
	  const column3Row2 = (-2.0 * far * near) / (far - near);

	  result[0] = column0Row0;
	  result[1] = 0.0;
	  result[2] = 0.0;
	  result[3] = 0.0;
	  result[4] = 0.0;
	  result[5] = column1Row1;
	  result[6] = 0.0;
	  result[7] = 0.0;
	  result[8] = column2Row0;
	  result[9] = column2Row1;
	  result[10] = column2Row2;
	  result[11] = column2Row3;
	  result[12] = 0.0;
	  result[13] = 0.0;
	  result[14] = column3Row2;
	  result[15] = 0.0;
	  return result;
	};

	/**
	 * Computes a Matrix4 instance representing an infinite off center perspective transformation.
	 *
	 * @param {number} left The number of meters to the left of the camera that will be in view.
	 * @param {number} right The number of meters to the right of the camera that will be in view.
	 * @param {number} bottom The number of meters below of the camera that will be in view.
	 * @param {number} top The number of meters above of the camera that will be in view.
	 * @param {number} near The distance to the near plane in meters.
	 * @param {Matrix4} result The object in which the result will be stored.
	 * @returns {Matrix4} The modified result parameter.
	 */
	Matrix4.computeInfinitePerspectiveOffCenter = function (
	  left,
	  right,
	  bottom,
	  top,
	  near,
	  result,
	) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("left", left);
	  Check.typeOf.number("right", right);
	  Check.typeOf.number("bottom", bottom);
	  Check.typeOf.number("top", top);
	  Check.typeOf.number("near", near);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const column0Row0 = (2.0 * near) / (right - left);
	  const column1Row1 = (2.0 * near) / (top - bottom);
	  const column2Row0 = (right + left) / (right - left);
	  const column2Row1 = (top + bottom) / (top - bottom);
	  const column2Row2 = -1.0;
	  const column2Row3 = -1.0;
	  const column3Row2 = -2.0 * near;

	  result[0] = column0Row0;
	  result[1] = 0.0;
	  result[2] = 0.0;
	  result[3] = 0.0;
	  result[4] = 0.0;
	  result[5] = column1Row1;
	  result[6] = 0.0;
	  result[7] = 0.0;
	  result[8] = column2Row0;
	  result[9] = column2Row1;
	  result[10] = column2Row2;
	  result[11] = column2Row3;
	  result[12] = 0.0;
	  result[13] = 0.0;
	  result[14] = column3Row2;
	  result[15] = 0.0;
	  return result;
	};

	/**
	 * Computes a Matrix4 instance that transforms from normalized device coordinates to window coordinates.
	 *
	 * @param {object} [viewport = { x : 0.0, y : 0.0, width : 0.0, height : 0.0 }] The viewport's corners as shown in Example 1.
	 * @param {number} [nearDepthRange=0.0] The near plane distance in window coordinates.
	 * @param {number} [farDepthRange=1.0] The far plane distance in window coordinates.
	 * @param {Matrix4} [result] The object in which the result will be stored.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @example
	 * // Create viewport transformation using an explicit viewport and depth range.
	 * const m = Cesium.Matrix4.computeViewportTransformation({
	 *     x : 0.0,
	 *     y : 0.0,
	 *     width : 1024.0,
	 *     height : 768.0
	 * }, 0.0, 1.0, new Cesium.Matrix4());
	 */
	Matrix4.computeViewportTransformation = function (
	  viewport,
	  nearDepthRange,
	  farDepthRange,
	  result,
	) {
	  if (!defined(result)) {
	    result = new Matrix4();
	  }

	  viewport = defaultValue(viewport, defaultValue.EMPTY_OBJECT);
	  const x = defaultValue(viewport.x, 0.0);
	  const y = defaultValue(viewport.y, 0.0);
	  const width = defaultValue(viewport.width, 0.0);
	  const height = defaultValue(viewport.height, 0.0);
	  nearDepthRange = defaultValue(nearDepthRange, 0.0);
	  farDepthRange = defaultValue(farDepthRange, 1.0);

	  const halfWidth = width * 0.5;
	  const halfHeight = height * 0.5;
	  const halfDepth = (farDepthRange - nearDepthRange) * 0.5;

	  const column0Row0 = halfWidth;
	  const column1Row1 = halfHeight;
	  const column2Row2 = halfDepth;
	  const column3Row0 = x + halfWidth;
	  const column3Row1 = y + halfHeight;
	  const column3Row2 = nearDepthRange + halfDepth;
	  const column3Row3 = 1.0;

	  result[0] = column0Row0;
	  result[1] = 0.0;
	  result[2] = 0.0;
	  result[3] = 0.0;
	  result[4] = 0.0;
	  result[5] = column1Row1;
	  result[6] = 0.0;
	  result[7] = 0.0;
	  result[8] = 0.0;
	  result[9] = 0.0;
	  result[10] = column2Row2;
	  result[11] = 0.0;
	  result[12] = column3Row0;
	  result[13] = column3Row1;
	  result[14] = column3Row2;
	  result[15] = column3Row3;

	  return result;
	};

	/**
	 * Computes a Matrix4 instance that transforms from world space to view space.
	 *
	 * @param {Cartesian3} position The position of the camera.
	 * @param {Cartesian3} direction The forward direction.
	 * @param {Cartesian3} up The up direction.
	 * @param {Cartesian3} right The right direction.
	 * @param {Matrix4} result The object in which the result will be stored.
	 * @returns {Matrix4} The modified result parameter.
	 */
	Matrix4.computeView = function (position, direction, up, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("position", position);
	  Check.typeOf.object("direction", direction);
	  Check.typeOf.object("up", up);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = right.x;
	  result[1] = up.x;
	  result[2] = -direction.x;
	  result[3] = 0.0;
	  result[4] = right.y;
	  result[5] = up.y;
	  result[6] = -direction.y;
	  result[7] = 0.0;
	  result[8] = right.z;
	  result[9] = up.z;
	  result[10] = -direction.z;
	  result[11] = 0.0;
	  result[12] = -Cartesian3.dot(right, position);
	  result[13] = -Cartesian3.dot(up, position);
	  result[14] = Cartesian3.dot(direction, position);
	  result[15] = 1.0;
	  return result;
	};

	/**
	 * Computes an Array from the provided Matrix4 instance.
	 * The array will be in column-major order.
	 *
	 * @param {Matrix4} matrix The matrix to use..
	 * @param {number[]} [result] The Array onto which to store the result.
	 * @returns {number[]} The modified Array parameter or a new Array instance if one was not provided.
	 *
	 * @example
	 * //create an array from an instance of Matrix4
	 * // m = [10.0, 14.0, 18.0, 22.0]
	 * //     [11.0, 15.0, 19.0, 23.0]
	 * //     [12.0, 16.0, 20.0, 24.0]
	 * //     [13.0, 17.0, 21.0, 25.0]
	 * const a = Cesium.Matrix4.toArray(m);
	 *
	 * // m remains the same
	 * //creates a = [10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0]
	 */
	Matrix4.toArray = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  //>>includeEnd('debug');

	  if (!defined(result)) {
	    return [
	      matrix[0],
	      matrix[1],
	      matrix[2],
	      matrix[3],
	      matrix[4],
	      matrix[5],
	      matrix[6],
	      matrix[7],
	      matrix[8],
	      matrix[9],
	      matrix[10],
	      matrix[11],
	      matrix[12],
	      matrix[13],
	      matrix[14],
	      matrix[15],
	    ];
	  }
	  result[0] = matrix[0];
	  result[1] = matrix[1];
	  result[2] = matrix[2];
	  result[3] = matrix[3];
	  result[4] = matrix[4];
	  result[5] = matrix[5];
	  result[6] = matrix[6];
	  result[7] = matrix[7];
	  result[8] = matrix[8];
	  result[9] = matrix[9];
	  result[10] = matrix[10];
	  result[11] = matrix[11];
	  result[12] = matrix[12];
	  result[13] = matrix[13];
	  result[14] = matrix[14];
	  result[15] = matrix[15];
	  return result;
	};

	/**
	 * Computes the array index of the element at the provided row and column.
	 *
	 * @param {number} row The zero-based index of the row.
	 * @param {number} column The zero-based index of the column.
	 * @returns {number} The index of the element at the provided row and column.
	 *
	 * @exception {DeveloperError} row must be 0, 1, 2, or 3.
	 * @exception {DeveloperError} column must be 0, 1, 2, or 3.
	 *
	 * @example
	 * const myMatrix = new Cesium.Matrix4();
	 * const column1Row0Index = Cesium.Matrix4.getElementIndex(1, 0);
	 * const column1Row0 = myMatrix[column1Row0Index];
	 * myMatrix[column1Row0Index] = 10.0;
	 */
	Matrix4.getElementIndex = function (column, row) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number.greaterThanOrEquals("row", row, 0);
	  Check.typeOf.number.lessThanOrEquals("row", row, 3);

	  Check.typeOf.number.greaterThanOrEquals("column", column, 0);
	  Check.typeOf.number.lessThanOrEquals("column", column, 3);
	  //>>includeEnd('debug');

	  return column * 4 + row;
	};

	/**
	 * Retrieves a copy of the matrix column at the provided index as a Cartesian4 instance.
	 *
	 * @param {Matrix4} matrix The matrix to use.
	 * @param {number} index The zero-based index of the column to retrieve.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter.
	 *
	 * @exception {DeveloperError} index must be 0, 1, 2, or 3.
	 *
	 * @example
	 * //returns a Cartesian4 instance with values from the specified column
	 * // m = [10.0, 11.0, 12.0, 13.0]
	 * //     [14.0, 15.0, 16.0, 17.0]
	 * //     [18.0, 19.0, 20.0, 21.0]
	 * //     [22.0, 23.0, 24.0, 25.0]
	 *
	 * //Example 1: Creates an instance of Cartesian
	 * const a = Cesium.Matrix4.getColumn(m, 2, new Cesium.Cartesian4());
	 *
	 * @example
	 * //Example 2: Sets values for Cartesian instance
	 * const a = new Cesium.Cartesian4();
	 * Cesium.Matrix4.getColumn(m, 2, a);
	 *
	 * // a.x = 12.0; a.y = 16.0; a.z = 20.0; a.w = 24.0;
	 */
	Matrix4.getColumn = function (matrix, index, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);

	  Check.typeOf.number.greaterThanOrEquals("index", index, 0);
	  Check.typeOf.number.lessThanOrEquals("index", index, 3);

	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const startIndex = index * 4;
	  const x = matrix[startIndex];
	  const y = matrix[startIndex + 1];
	  const z = matrix[startIndex + 2];
	  const w = matrix[startIndex + 3];

	  result.x = x;
	  result.y = y;
	  result.z = z;
	  result.w = w;
	  return result;
	};

	/**
	 * Computes a new matrix that replaces the specified column in the provided matrix with the provided Cartesian4 instance.
	 *
	 * @param {Matrix4} matrix The matrix to use.
	 * @param {number} index The zero-based index of the column to set.
	 * @param {Cartesian4} cartesian The Cartesian whose values will be assigned to the specified column.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @exception {DeveloperError} index must be 0, 1, 2, or 3.
	 *
	 * @example
	 * //creates a new Matrix4 instance with new column values from the Cartesian4 instance
	 * // m = [10.0, 11.0, 12.0, 13.0]
	 * //     [14.0, 15.0, 16.0, 17.0]
	 * //     [18.0, 19.0, 20.0, 21.0]
	 * //     [22.0, 23.0, 24.0, 25.0]
	 *
	 * const a = Cesium.Matrix4.setColumn(m, 2, new Cesium.Cartesian4(99.0, 98.0, 97.0, 96.0), new Cesium.Matrix4());
	 *
	 * // m remains the same
	 * // a = [10.0, 11.0, 99.0, 13.0]
	 * //     [14.0, 15.0, 98.0, 17.0]
	 * //     [18.0, 19.0, 97.0, 21.0]
	 * //     [22.0, 23.0, 96.0, 25.0]
	 */
	Matrix4.setColumn = function (matrix, index, cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);

	  Check.typeOf.number.greaterThanOrEquals("index", index, 0);
	  Check.typeOf.number.lessThanOrEquals("index", index, 3);

	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result = Matrix4.clone(matrix, result);
	  const startIndex = index * 4;
	  result[startIndex] = cartesian.x;
	  result[startIndex + 1] = cartesian.y;
	  result[startIndex + 2] = cartesian.z;
	  result[startIndex + 3] = cartesian.w;
	  return result;
	};

	/**
	 * Retrieves a copy of the matrix row at the provided index as a Cartesian4 instance.
	 *
	 * @param {Matrix4} matrix The matrix to use.
	 * @param {number} index The zero-based index of the row to retrieve.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter.
	 *
	 * @exception {DeveloperError} index must be 0, 1, 2, or 3.
	 *
	 * @example
	 * //returns a Cartesian4 instance with values from the specified column
	 * // m = [10.0, 11.0, 12.0, 13.0]
	 * //     [14.0, 15.0, 16.0, 17.0]
	 * //     [18.0, 19.0, 20.0, 21.0]
	 * //     [22.0, 23.0, 24.0, 25.0]
	 *
	 * //Example 1: Returns an instance of Cartesian
	 * const a = Cesium.Matrix4.getRow(m, 2, new Cesium.Cartesian4());
	 *
	 * @example
	 * //Example 2: Sets values for a Cartesian instance
	 * const a = new Cesium.Cartesian4();
	 * Cesium.Matrix4.getRow(m, 2, a);
	 *
	 * // a.x = 18.0; a.y = 19.0; a.z = 20.0; a.w = 21.0;
	 */
	Matrix4.getRow = function (matrix, index, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);

	  Check.typeOf.number.greaterThanOrEquals("index", index, 0);
	  Check.typeOf.number.lessThanOrEquals("index", index, 3);

	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const x = matrix[index];
	  const y = matrix[index + 4];
	  const z = matrix[index + 8];
	  const w = matrix[index + 12];

	  result.x = x;
	  result.y = y;
	  result.z = z;
	  result.w = w;
	  return result;
	};

	/**
	 * Computes a new matrix that replaces the specified row in the provided matrix with the provided Cartesian4 instance.
	 *
	 * @param {Matrix4} matrix The matrix to use.
	 * @param {number} index The zero-based index of the row to set.
	 * @param {Cartesian4} cartesian The Cartesian whose values will be assigned to the specified row.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @exception {DeveloperError} index must be 0, 1, 2, or 3.
	 *
	 * @example
	 * //create a new Matrix4 instance with new row values from the Cartesian4 instance
	 * // m = [10.0, 11.0, 12.0, 13.0]
	 * //     [14.0, 15.0, 16.0, 17.0]
	 * //     [18.0, 19.0, 20.0, 21.0]
	 * //     [22.0, 23.0, 24.0, 25.0]
	 *
	 * const a = Cesium.Matrix4.setRow(m, 2, new Cesium.Cartesian4(99.0, 98.0, 97.0, 96.0), new Cesium.Matrix4());
	 *
	 * // m remains the same
	 * // a = [10.0, 11.0, 12.0, 13.0]
	 * //     [14.0, 15.0, 16.0, 17.0]
	 * //     [99.0, 98.0, 97.0, 96.0]
	 * //     [22.0, 23.0, 24.0, 25.0]
	 */
	Matrix4.setRow = function (matrix, index, cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);

	  Check.typeOf.number.greaterThanOrEquals("index", index, 0);
	  Check.typeOf.number.lessThanOrEquals("index", index, 3);

	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result = Matrix4.clone(matrix, result);
	  result[index] = cartesian.x;
	  result[index + 4] = cartesian.y;
	  result[index + 8] = cartesian.z;
	  result[index + 12] = cartesian.w;
	  return result;
	};

	/**
	 * Computes a new matrix that replaces the translation in the rightmost column of the provided
	 * matrix with the provided translation. This assumes the matrix is an affine transformation.
	 *
	 * @param {Matrix4} matrix The matrix to use.
	 * @param {Cartesian3} translation The translation that replaces the translation of the provided matrix.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 */
	Matrix4.setTranslation = function (matrix, translation, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("translation", translation);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = matrix[0];
	  result[1] = matrix[1];
	  result[2] = matrix[2];
	  result[3] = matrix[3];

	  result[4] = matrix[4];
	  result[5] = matrix[5];
	  result[6] = matrix[6];
	  result[7] = matrix[7];

	  result[8] = matrix[8];
	  result[9] = matrix[9];
	  result[10] = matrix[10];
	  result[11] = matrix[11];

	  result[12] = translation.x;
	  result[13] = translation.y;
	  result[14] = translation.z;
	  result[15] = matrix[15];

	  return result;
	};

	const scaleScratch1 = new Cartesian3();

	/**
	 * Computes a new matrix that replaces the scale with the provided scale.
	 * This assumes the matrix is an affine transformation.
	 *
	 * @param {Matrix4} matrix The matrix to use.
	 * @param {Cartesian3} scale The scale that replaces the scale of the provided matrix.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @see Matrix4.setUniformScale
	 * @see Matrix4.fromScale
	 * @see Matrix4.fromUniformScale
	 * @see Matrix4.multiplyByScale
	 * @see Matrix4.multiplyByUniformScale
	 * @see Matrix4.getScale
	 */
	Matrix4.setScale = function (matrix, scale, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("scale", scale);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const existingScale = Matrix4.getScale(matrix, scaleScratch1);
	  const scaleRatioX = scale.x / existingScale.x;
	  const scaleRatioY = scale.y / existingScale.y;
	  const scaleRatioZ = scale.z / existingScale.z;

	  result[0] = matrix[0] * scaleRatioX;
	  result[1] = matrix[1] * scaleRatioX;
	  result[2] = matrix[2] * scaleRatioX;
	  result[3] = matrix[3];

	  result[4] = matrix[4] * scaleRatioY;
	  result[5] = matrix[5] * scaleRatioY;
	  result[6] = matrix[6] * scaleRatioY;
	  result[7] = matrix[7];

	  result[8] = matrix[8] * scaleRatioZ;
	  result[9] = matrix[9] * scaleRatioZ;
	  result[10] = matrix[10] * scaleRatioZ;
	  result[11] = matrix[11];

	  result[12] = matrix[12];
	  result[13] = matrix[13];
	  result[14] = matrix[14];
	  result[15] = matrix[15];

	  return result;
	};

	const scaleScratch2 = new Cartesian3();

	/**
	 * Computes a new matrix that replaces the scale with the provided uniform scale.
	 * This assumes the matrix is an affine transformation.
	 *
	 * @param {Matrix4} matrix The matrix to use.
	 * @param {number} scale The uniform scale that replaces the scale of the provided matrix.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @see Matrix4.setScale
	 * @see Matrix4.fromScale
	 * @see Matrix4.fromUniformScale
	 * @see Matrix4.multiplyByScale
	 * @see Matrix4.multiplyByUniformScale
	 * @see Matrix4.getScale
	 */
	Matrix4.setUniformScale = function (matrix, scale, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.number("scale", scale);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const existingScale = Matrix4.getScale(matrix, scaleScratch2);
	  const scaleRatioX = scale / existingScale.x;
	  const scaleRatioY = scale / existingScale.y;
	  const scaleRatioZ = scale / existingScale.z;

	  result[0] = matrix[0] * scaleRatioX;
	  result[1] = matrix[1] * scaleRatioX;
	  result[2] = matrix[2] * scaleRatioX;
	  result[3] = matrix[3];

	  result[4] = matrix[4] * scaleRatioY;
	  result[5] = matrix[5] * scaleRatioY;
	  result[6] = matrix[6] * scaleRatioY;
	  result[7] = matrix[7];

	  result[8] = matrix[8] * scaleRatioZ;
	  result[9] = matrix[9] * scaleRatioZ;
	  result[10] = matrix[10] * scaleRatioZ;
	  result[11] = matrix[11];

	  result[12] = matrix[12];
	  result[13] = matrix[13];
	  result[14] = matrix[14];
	  result[15] = matrix[15];

	  return result;
	};

	const scratchColumn = new Cartesian3();

	/**
	 * Extracts the non-uniform scale assuming the matrix is an affine transformation.
	 *
	 * @param {Matrix4} matrix The matrix.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter
	 *
	 * @see Matrix4.multiplyByScale
	 * @see Matrix4.multiplyByUniformScale
	 * @see Matrix4.fromScale
	 * @see Matrix4.fromUniformScale
	 * @see Matrix4.setScale
	 * @see Matrix4.setUniformScale
	 */
	Matrix4.getScale = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Cartesian3.magnitude(
	    Cartesian3.fromElements(matrix[0], matrix[1], matrix[2], scratchColumn),
	  );
	  result.y = Cartesian3.magnitude(
	    Cartesian3.fromElements(matrix[4], matrix[5], matrix[6], scratchColumn),
	  );
	  result.z = Cartesian3.magnitude(
	    Cartesian3.fromElements(matrix[8], matrix[9], matrix[10], scratchColumn),
	  );
	  return result;
	};

	const scaleScratch3 = new Cartesian3();

	/**
	 * Computes the maximum scale assuming the matrix is an affine transformation.
	 * The maximum scale is the maximum length of the column vectors in the upper-left
	 * 3x3 matrix.
	 *
	 * @param {Matrix4} matrix The matrix.
	 * @returns {number} The maximum scale.
	 */
	Matrix4.getMaximumScale = function (matrix) {
	  Matrix4.getScale(matrix, scaleScratch3);
	  return Cartesian3.maximumComponent(scaleScratch3);
	};

	const scaleScratch4 = new Cartesian3();

	/**
	 * Sets the rotation assuming the matrix is an affine transformation.
	 *
	 * @param {Matrix4} matrix The matrix.
	 * @param {Matrix3} rotation The rotation matrix.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @see Matrix4.fromRotation
	 * @see Matrix4.getRotation
	 */
	Matrix4.setRotation = function (matrix, rotation, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const scale = Matrix4.getScale(matrix, scaleScratch4);

	  result[0] = rotation[0] * scale.x;
	  result[1] = rotation[1] * scale.x;
	  result[2] = rotation[2] * scale.x;
	  result[3] = matrix[3];

	  result[4] = rotation[3] * scale.y;
	  result[5] = rotation[4] * scale.y;
	  result[6] = rotation[5] * scale.y;
	  result[7] = matrix[7];

	  result[8] = rotation[6] * scale.z;
	  result[9] = rotation[7] * scale.z;
	  result[10] = rotation[8] * scale.z;
	  result[11] = matrix[11];

	  result[12] = matrix[12];
	  result[13] = matrix[13];
	  result[14] = matrix[14];
	  result[15] = matrix[15];

	  return result;
	};

	const scaleScratch5 = new Cartesian3();

	/**
	 * Extracts the rotation matrix assuming the matrix is an affine transformation.
	 *
	 * @param {Matrix4} matrix The matrix.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 *
	 * @see Matrix4.setRotation
	 * @see Matrix4.fromRotation
	 */
	Matrix4.getRotation = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const scale = Matrix4.getScale(matrix, scaleScratch5);

	  result[0] = matrix[0] / scale.x;
	  result[1] = matrix[1] / scale.x;
	  result[2] = matrix[2] / scale.x;

	  result[3] = matrix[4] / scale.y;
	  result[4] = matrix[5] / scale.y;
	  result[5] = matrix[6] / scale.y;

	  result[6] = matrix[8] / scale.z;
	  result[7] = matrix[9] / scale.z;
	  result[8] = matrix[10] / scale.z;

	  return result;
	};

	/**
	 * Computes the product of two matrices.
	 *
	 * @param {Matrix4} left The first matrix.
	 * @param {Matrix4} right The second matrix.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 */
	Matrix4.multiply = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const left0 = left[0];
	  const left1 = left[1];
	  const left2 = left[2];
	  const left3 = left[3];
	  const left4 = left[4];
	  const left5 = left[5];
	  const left6 = left[6];
	  const left7 = left[7];
	  const left8 = left[8];
	  const left9 = left[9];
	  const left10 = left[10];
	  const left11 = left[11];
	  const left12 = left[12];
	  const left13 = left[13];
	  const left14 = left[14];
	  const left15 = left[15];

	  const right0 = right[0];
	  const right1 = right[1];
	  const right2 = right[2];
	  const right3 = right[3];
	  const right4 = right[4];
	  const right5 = right[5];
	  const right6 = right[6];
	  const right7 = right[7];
	  const right8 = right[8];
	  const right9 = right[9];
	  const right10 = right[10];
	  const right11 = right[11];
	  const right12 = right[12];
	  const right13 = right[13];
	  const right14 = right[14];
	  const right15 = right[15];

	  const column0Row0 =
	    left0 * right0 + left4 * right1 + left8 * right2 + left12 * right3;
	  const column0Row1 =
	    left1 * right0 + left5 * right1 + left9 * right2 + left13 * right3;
	  const column0Row2 =
	    left2 * right0 + left6 * right1 + left10 * right2 + left14 * right3;
	  const column0Row3 =
	    left3 * right0 + left7 * right1 + left11 * right2 + left15 * right3;

	  const column1Row0 =
	    left0 * right4 + left4 * right5 + left8 * right6 + left12 * right7;
	  const column1Row1 =
	    left1 * right4 + left5 * right5 + left9 * right6 + left13 * right7;
	  const column1Row2 =
	    left2 * right4 + left6 * right5 + left10 * right6 + left14 * right7;
	  const column1Row3 =
	    left3 * right4 + left7 * right5 + left11 * right6 + left15 * right7;

	  const column2Row0 =
	    left0 * right8 + left4 * right9 + left8 * right10 + left12 * right11;
	  const column2Row1 =
	    left1 * right8 + left5 * right9 + left9 * right10 + left13 * right11;
	  const column2Row2 =
	    left2 * right8 + left6 * right9 + left10 * right10 + left14 * right11;
	  const column2Row3 =
	    left3 * right8 + left7 * right9 + left11 * right10 + left15 * right11;

	  const column3Row0 =
	    left0 * right12 + left4 * right13 + left8 * right14 + left12 * right15;
	  const column3Row1 =
	    left1 * right12 + left5 * right13 + left9 * right14 + left13 * right15;
	  const column3Row2 =
	    left2 * right12 + left6 * right13 + left10 * right14 + left14 * right15;
	  const column3Row3 =
	    left3 * right12 + left7 * right13 + left11 * right14 + left15 * right15;

	  result[0] = column0Row0;
	  result[1] = column0Row1;
	  result[2] = column0Row2;
	  result[3] = column0Row3;
	  result[4] = column1Row0;
	  result[5] = column1Row1;
	  result[6] = column1Row2;
	  result[7] = column1Row3;
	  result[8] = column2Row0;
	  result[9] = column2Row1;
	  result[10] = column2Row2;
	  result[11] = column2Row3;
	  result[12] = column3Row0;
	  result[13] = column3Row1;
	  result[14] = column3Row2;
	  result[15] = column3Row3;
	  return result;
	};

	/**
	 * Computes the sum of two matrices.
	 *
	 * @param {Matrix4} left The first matrix.
	 * @param {Matrix4} right The second matrix.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 */
	Matrix4.add = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = left[0] + right[0];
	  result[1] = left[1] + right[1];
	  result[2] = left[2] + right[2];
	  result[3] = left[3] + right[3];
	  result[4] = left[4] + right[4];
	  result[5] = left[5] + right[5];
	  result[6] = left[6] + right[6];
	  result[7] = left[7] + right[7];
	  result[8] = left[8] + right[8];
	  result[9] = left[9] + right[9];
	  result[10] = left[10] + right[10];
	  result[11] = left[11] + right[11];
	  result[12] = left[12] + right[12];
	  result[13] = left[13] + right[13];
	  result[14] = left[14] + right[14];
	  result[15] = left[15] + right[15];
	  return result;
	};

	/**
	 * Computes the difference of two matrices.
	 *
	 * @param {Matrix4} left The first matrix.
	 * @param {Matrix4} right The second matrix.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 */
	Matrix4.subtract = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = left[0] - right[0];
	  result[1] = left[1] - right[1];
	  result[2] = left[2] - right[2];
	  result[3] = left[3] - right[3];
	  result[4] = left[4] - right[4];
	  result[5] = left[5] - right[5];
	  result[6] = left[6] - right[6];
	  result[7] = left[7] - right[7];
	  result[8] = left[8] - right[8];
	  result[9] = left[9] - right[9];
	  result[10] = left[10] - right[10];
	  result[11] = left[11] - right[11];
	  result[12] = left[12] - right[12];
	  result[13] = left[13] - right[13];
	  result[14] = left[14] - right[14];
	  result[15] = left[15] - right[15];
	  return result;
	};

	/**
	 * Computes the product of two matrices assuming the matrices are affine transformation matrices,
	 * where the upper left 3x3 elements are any matrix, and
	 * the upper three elements in the fourth column are the translation.
	 * The bottom row is assumed to be [0, 0, 0, 1].
	 * The matrix is not verified to be in the proper form.
	 * This method is faster than computing the product for general 4x4
	 * matrices using {@link Matrix4.multiply}.
	 *
	 * @param {Matrix4} left The first matrix.
	 * @param {Matrix4} right The second matrix.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @example
	 * const m1 = new Cesium.Matrix4(1.0, 6.0, 7.0, 0.0, 2.0, 5.0, 8.0, 0.0, 3.0, 4.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0);
	 * const m2 = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3(1.0, 1.0, 1.0));
	 * const m3 = Cesium.Matrix4.multiplyTransformation(m1, m2, new Cesium.Matrix4());
	 */
	Matrix4.multiplyTransformation = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const left0 = left[0];
	  const left1 = left[1];
	  const left2 = left[2];
	  const left4 = left[4];
	  const left5 = left[5];
	  const left6 = left[6];
	  const left8 = left[8];
	  const left9 = left[9];
	  const left10 = left[10];
	  const left12 = left[12];
	  const left13 = left[13];
	  const left14 = left[14];

	  const right0 = right[0];
	  const right1 = right[1];
	  const right2 = right[2];
	  const right4 = right[4];
	  const right5 = right[5];
	  const right6 = right[6];
	  const right8 = right[8];
	  const right9 = right[9];
	  const right10 = right[10];
	  const right12 = right[12];
	  const right13 = right[13];
	  const right14 = right[14];

	  const column0Row0 = left0 * right0 + left4 * right1 + left8 * right2;
	  const column0Row1 = left1 * right0 + left5 * right1 + left9 * right2;
	  const column0Row2 = left2 * right0 + left6 * right1 + left10 * right2;

	  const column1Row0 = left0 * right4 + left4 * right5 + left8 * right6;
	  const column1Row1 = left1 * right4 + left5 * right5 + left9 * right6;
	  const column1Row2 = left2 * right4 + left6 * right5 + left10 * right6;

	  const column2Row0 = left0 * right8 + left4 * right9 + left8 * right10;
	  const column2Row1 = left1 * right8 + left5 * right9 + left9 * right10;
	  const column2Row2 = left2 * right8 + left6 * right9 + left10 * right10;

	  const column3Row0 =
	    left0 * right12 + left4 * right13 + left8 * right14 + left12;
	  const column3Row1 =
	    left1 * right12 + left5 * right13 + left9 * right14 + left13;
	  const column3Row2 =
	    left2 * right12 + left6 * right13 + left10 * right14 + left14;

	  result[0] = column0Row0;
	  result[1] = column0Row1;
	  result[2] = column0Row2;
	  result[3] = 0.0;
	  result[4] = column1Row0;
	  result[5] = column1Row1;
	  result[6] = column1Row2;
	  result[7] = 0.0;
	  result[8] = column2Row0;
	  result[9] = column2Row1;
	  result[10] = column2Row2;
	  result[11] = 0.0;
	  result[12] = column3Row0;
	  result[13] = column3Row1;
	  result[14] = column3Row2;
	  result[15] = 1.0;
	  return result;
	};

	/**
	 * Multiplies a transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
	 * by a 3x3 rotation matrix.  This is an optimization
	 * for <code>Matrix4.multiply(m, Matrix4.fromRotationTranslation(rotation), m);</code> with less allocations and arithmetic operations.
	 *
	 * @param {Matrix4} matrix The matrix on the left-hand side.
	 * @param {Matrix3} rotation The 3x3 rotation matrix on the right-hand side.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @example
	 * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromRotationTranslation(rotation), m);
	 * Cesium.Matrix4.multiplyByMatrix3(m, rotation, m);
	 */
	Matrix4.multiplyByMatrix3 = function (matrix, rotation, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("rotation", rotation);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const left0 = matrix[0];
	  const left1 = matrix[1];
	  const left2 = matrix[2];
	  const left4 = matrix[4];
	  const left5 = matrix[5];
	  const left6 = matrix[6];
	  const left8 = matrix[8];
	  const left9 = matrix[9];
	  const left10 = matrix[10];

	  const right0 = rotation[0];
	  const right1 = rotation[1];
	  const right2 = rotation[2];
	  const right4 = rotation[3];
	  const right5 = rotation[4];
	  const right6 = rotation[5];
	  const right8 = rotation[6];
	  const right9 = rotation[7];
	  const right10 = rotation[8];

	  const column0Row0 = left0 * right0 + left4 * right1 + left8 * right2;
	  const column0Row1 = left1 * right0 + left5 * right1 + left9 * right2;
	  const column0Row2 = left2 * right0 + left6 * right1 + left10 * right2;

	  const column1Row0 = left0 * right4 + left4 * right5 + left8 * right6;
	  const column1Row1 = left1 * right4 + left5 * right5 + left9 * right6;
	  const column1Row2 = left2 * right4 + left6 * right5 + left10 * right6;

	  const column2Row0 = left0 * right8 + left4 * right9 + left8 * right10;
	  const column2Row1 = left1 * right8 + left5 * right9 + left9 * right10;
	  const column2Row2 = left2 * right8 + left6 * right9 + left10 * right10;

	  result[0] = column0Row0;
	  result[1] = column0Row1;
	  result[2] = column0Row2;
	  result[3] = 0.0;
	  result[4] = column1Row0;
	  result[5] = column1Row1;
	  result[6] = column1Row2;
	  result[7] = 0.0;
	  result[8] = column2Row0;
	  result[9] = column2Row1;
	  result[10] = column2Row2;
	  result[11] = 0.0;
	  result[12] = matrix[12];
	  result[13] = matrix[13];
	  result[14] = matrix[14];
	  result[15] = matrix[15];
	  return result;
	};

	/**
	 * Multiplies a transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
	 * by an implicit translation matrix defined by a {@link Cartesian3}.  This is an optimization
	 * for <code>Matrix4.multiply(m, Matrix4.fromTranslation(position), m);</code> with less allocations and arithmetic operations.
	 *
	 * @param {Matrix4} matrix The matrix on the left-hand side.
	 * @param {Cartesian3} translation The translation on the right-hand side.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @example
	 * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromTranslation(position), m);
	 * Cesium.Matrix4.multiplyByTranslation(m, position, m);
	 */
	Matrix4.multiplyByTranslation = function (matrix, translation, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("translation", translation);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const x = translation.x;
	  const y = translation.y;
	  const z = translation.z;

	  const tx = x * matrix[0] + y * matrix[4] + z * matrix[8] + matrix[12];
	  const ty = x * matrix[1] + y * matrix[5] + z * matrix[9] + matrix[13];
	  const tz = x * matrix[2] + y * matrix[6] + z * matrix[10] + matrix[14];

	  result[0] = matrix[0];
	  result[1] = matrix[1];
	  result[2] = matrix[2];
	  result[3] = matrix[3];
	  result[4] = matrix[4];
	  result[5] = matrix[5];
	  result[6] = matrix[6];
	  result[7] = matrix[7];
	  result[8] = matrix[8];
	  result[9] = matrix[9];
	  result[10] = matrix[10];
	  result[11] = matrix[11];
	  result[12] = tx;
	  result[13] = ty;
	  result[14] = tz;
	  result[15] = matrix[15];
	  return result;
	};

	/**
	 * Multiplies an affine transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
	 * by an implicit non-uniform scale matrix. This is an optimization
	 * for <code>Matrix4.multiply(m, Matrix4.fromUniformScale(scale), m);</code>, where
	 * <code>m</code> must be an affine matrix.
	 * This function performs fewer allocations and arithmetic operations.
	 *
	 * @param {Matrix4} matrix The affine matrix on the left-hand side.
	 * @param {Cartesian3} scale The non-uniform scale on the right-hand side.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 *
	 * @example
	 * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromScale(scale), m);
	 * Cesium.Matrix4.multiplyByScale(m, scale, m);
	 *
	 * @see Matrix4.multiplyByUniformScale
	 * @see Matrix4.fromScale
	 * @see Matrix4.fromUniformScale
	 * @see Matrix4.setScale
	 * @see Matrix4.setUniformScale
	 * @see Matrix4.getScale
	 */
	Matrix4.multiplyByScale = function (matrix, scale, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("scale", scale);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const scaleX = scale.x;
	  const scaleY = scale.y;
	  const scaleZ = scale.z;

	  // Faster than Cartesian3.equals
	  if (scaleX === 1.0 && scaleY === 1.0 && scaleZ === 1.0) {
	    return Matrix4.clone(matrix, result);
	  }

	  result[0] = scaleX * matrix[0];
	  result[1] = scaleX * matrix[1];
	  result[2] = scaleX * matrix[2];
	  result[3] = matrix[3];

	  result[4] = scaleY * matrix[4];
	  result[5] = scaleY * matrix[5];
	  result[6] = scaleY * matrix[6];
	  result[7] = matrix[7];

	  result[8] = scaleZ * matrix[8];
	  result[9] = scaleZ * matrix[9];
	  result[10] = scaleZ * matrix[10];
	  result[11] = matrix[11];

	  result[12] = matrix[12];
	  result[13] = matrix[13];
	  result[14] = matrix[14];
	  result[15] = matrix[15];

	  return result;
	};

	/**
	 * Computes the product of a matrix times a uniform scale, as if the scale were a scale matrix.
	 *
	 * @param {Matrix4} matrix The matrix on the left-hand side.
	 * @param {number} scale The uniform scale on the right-hand side.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @example
	 * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromUniformScale(scale), m);
	 * Cesium.Matrix4.multiplyByUniformScale(m, scale, m);
	 *
	 * @see Matrix4.multiplyByScale
	 * @see Matrix4.fromScale
	 * @see Matrix4.fromUniformScale
	 * @see Matrix4.setScale
	 * @see Matrix4.setUniformScale
	 * @see Matrix4.getScale
	 */
	Matrix4.multiplyByUniformScale = function (matrix, scale, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.number("scale", scale);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = matrix[0] * scale;
	  result[1] = matrix[1] * scale;
	  result[2] = matrix[2] * scale;
	  result[3] = matrix[3];

	  result[4] = matrix[4] * scale;
	  result[5] = matrix[5] * scale;
	  result[6] = matrix[6] * scale;
	  result[7] = matrix[7];

	  result[8] = matrix[8] * scale;
	  result[9] = matrix[9] * scale;
	  result[10] = matrix[10] * scale;
	  result[11] = matrix[11];

	  result[12] = matrix[12];
	  result[13] = matrix[13];
	  result[14] = matrix[14];
	  result[15] = matrix[15];

	  return result;
	};

	/**
	 * Computes the product of a matrix and a column vector.
	 *
	 * @param {Matrix4} matrix The matrix.
	 * @param {Cartesian4} cartesian The vector.
	 * @param {Cartesian4} result The object onto which to store the result.
	 * @returns {Cartesian4} The modified result parameter.
	 */
	Matrix4.multiplyByVector = function (matrix, cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const vX = cartesian.x;
	  const vY = cartesian.y;
	  const vZ = cartesian.z;
	  const vW = cartesian.w;

	  const x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ + matrix[12] * vW;
	  const y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ + matrix[13] * vW;
	  const z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ + matrix[14] * vW;
	  const w = matrix[3] * vX + matrix[7] * vY + matrix[11] * vZ + matrix[15] * vW;

	  result.x = x;
	  result.y = y;
	  result.z = z;
	  result.w = w;
	  return result;
	};

	/**
	 * Computes the product of a matrix and a {@link Cartesian3}.  This is equivalent to calling {@link Matrix4.multiplyByVector}
	 * with a {@link Cartesian4} with a <code>w</code> component of zero.
	 *
	 * @param {Matrix4} matrix The matrix.
	 * @param {Cartesian3} cartesian The point.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 *
	 * @example
	 * const p = new Cesium.Cartesian3(1.0, 2.0, 3.0);
	 * const result = Cesium.Matrix4.multiplyByPointAsVector(matrix, p, new Cesium.Cartesian3());
	 * // A shortcut for
	 * //   Cartesian3 p = ...
	 * //   Cesium.Matrix4.multiplyByVector(matrix, new Cesium.Cartesian4(p.x, p.y, p.z, 0.0), result);
	 */
	Matrix4.multiplyByPointAsVector = function (matrix, cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const vX = cartesian.x;
	  const vY = cartesian.y;
	  const vZ = cartesian.z;

	  const x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ;
	  const y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ;
	  const z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ;

	  result.x = x;
	  result.y = y;
	  result.z = z;
	  return result;
	};

	/**
	 * Computes the product of a matrix and a {@link Cartesian3}. This is equivalent to calling {@link Matrix4.multiplyByVector}
	 * with a {@link Cartesian4} with a <code>w</code> component of 1, but returns a {@link Cartesian3} instead of a {@link Cartesian4}.
	 *
	 * @param {Matrix4} matrix The matrix.
	 * @param {Cartesian3} cartesian The point.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 *
	 * @example
	 * const p = new Cesium.Cartesian3(1.0, 2.0, 3.0);
	 * const result = Cesium.Matrix4.multiplyByPoint(matrix, p, new Cesium.Cartesian3());
	 */
	Matrix4.multiplyByPoint = function (matrix, cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const vX = cartesian.x;
	  const vY = cartesian.y;
	  const vZ = cartesian.z;

	  const x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ + matrix[12];
	  const y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ + matrix[13];
	  const z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ + matrix[14];

	  result.x = x;
	  result.y = y;
	  result.z = z;
	  return result;
	};

	/**
	 * Computes the product of a matrix and a scalar.
	 *
	 * @param {Matrix4} matrix The matrix.
	 * @param {number} scalar The number to multiply by.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @example
	 * //create a Matrix4 instance which is a scaled version of the supplied Matrix4
	 * // m = [10.0, 11.0, 12.0, 13.0]
	 * //     [14.0, 15.0, 16.0, 17.0]
	 * //     [18.0, 19.0, 20.0, 21.0]
	 * //     [22.0, 23.0, 24.0, 25.0]
	 *
	 * const a = Cesium.Matrix4.multiplyByScalar(m, -2, new Cesium.Matrix4());
	 *
	 * // m remains the same
	 * // a = [-20.0, -22.0, -24.0, -26.0]
	 * //     [-28.0, -30.0, -32.0, -34.0]
	 * //     [-36.0, -38.0, -40.0, -42.0]
	 * //     [-44.0, -46.0, -48.0, -50.0]
	 */
	Matrix4.multiplyByScalar = function (matrix, scalar, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.number("scalar", scalar);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = matrix[0] * scalar;
	  result[1] = matrix[1] * scalar;
	  result[2] = matrix[2] * scalar;
	  result[3] = matrix[3] * scalar;
	  result[4] = matrix[4] * scalar;
	  result[5] = matrix[5] * scalar;
	  result[6] = matrix[6] * scalar;
	  result[7] = matrix[7] * scalar;
	  result[8] = matrix[8] * scalar;
	  result[9] = matrix[9] * scalar;
	  result[10] = matrix[10] * scalar;
	  result[11] = matrix[11] * scalar;
	  result[12] = matrix[12] * scalar;
	  result[13] = matrix[13] * scalar;
	  result[14] = matrix[14] * scalar;
	  result[15] = matrix[15] * scalar;
	  return result;
	};

	/**
	 * Computes a negated copy of the provided matrix.
	 *
	 * @param {Matrix4} matrix The matrix to negate.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @example
	 * //create a new Matrix4 instance which is a negation of a Matrix4
	 * // m = [10.0, 11.0, 12.0, 13.0]
	 * //     [14.0, 15.0, 16.0, 17.0]
	 * //     [18.0, 19.0, 20.0, 21.0]
	 * //     [22.0, 23.0, 24.0, 25.0]
	 *
	 * const a = Cesium.Matrix4.negate(m, new Cesium.Matrix4());
	 *
	 * // m remains the same
	 * // a = [-10.0, -11.0, -12.0, -13.0]
	 * //     [-14.0, -15.0, -16.0, -17.0]
	 * //     [-18.0, -19.0, -20.0, -21.0]
	 * //     [-22.0, -23.0, -24.0, -25.0]
	 */
	Matrix4.negate = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = -matrix[0];
	  result[1] = -matrix[1];
	  result[2] = -matrix[2];
	  result[3] = -matrix[3];
	  result[4] = -matrix[4];
	  result[5] = -matrix[5];
	  result[6] = -matrix[6];
	  result[7] = -matrix[7];
	  result[8] = -matrix[8];
	  result[9] = -matrix[9];
	  result[10] = -matrix[10];
	  result[11] = -matrix[11];
	  result[12] = -matrix[12];
	  result[13] = -matrix[13];
	  result[14] = -matrix[14];
	  result[15] = -matrix[15];
	  return result;
	};

	/**
	 * Computes the transpose of the provided matrix.
	 *
	 * @param {Matrix4} matrix The matrix to transpose.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @example
	 * //returns transpose of a Matrix4
	 * // m = [10.0, 11.0, 12.0, 13.0]
	 * //     [14.0, 15.0, 16.0, 17.0]
	 * //     [18.0, 19.0, 20.0, 21.0]
	 * //     [22.0, 23.0, 24.0, 25.0]
	 *
	 * const a = Cesium.Matrix4.transpose(m, new Cesium.Matrix4());
	 *
	 * // m remains the same
	 * // a = [10.0, 14.0, 18.0, 22.0]
	 * //     [11.0, 15.0, 19.0, 23.0]
	 * //     [12.0, 16.0, 20.0, 24.0]
	 * //     [13.0, 17.0, 21.0, 25.0]
	 */
	Matrix4.transpose = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const matrix1 = matrix[1];
	  const matrix2 = matrix[2];
	  const matrix3 = matrix[3];
	  const matrix6 = matrix[6];
	  const matrix7 = matrix[7];
	  const matrix11 = matrix[11];

	  result[0] = matrix[0];
	  result[1] = matrix[4];
	  result[2] = matrix[8];
	  result[3] = matrix[12];
	  result[4] = matrix1;
	  result[5] = matrix[5];
	  result[6] = matrix[9];
	  result[7] = matrix[13];
	  result[8] = matrix2;
	  result[9] = matrix6;
	  result[10] = matrix[10];
	  result[11] = matrix[14];
	  result[12] = matrix3;
	  result[13] = matrix7;
	  result[14] = matrix11;
	  result[15] = matrix[15];
	  return result;
	};

	/**
	 * Computes a matrix, which contains the absolute (unsigned) values of the provided matrix's elements.
	 *
	 * @param {Matrix4} matrix The matrix with signed elements.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 */
	Matrix4.abs = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = Math.abs(matrix[0]);
	  result[1] = Math.abs(matrix[1]);
	  result[2] = Math.abs(matrix[2]);
	  result[3] = Math.abs(matrix[3]);
	  result[4] = Math.abs(matrix[4]);
	  result[5] = Math.abs(matrix[5]);
	  result[6] = Math.abs(matrix[6]);
	  result[7] = Math.abs(matrix[7]);
	  result[8] = Math.abs(matrix[8]);
	  result[9] = Math.abs(matrix[9]);
	  result[10] = Math.abs(matrix[10]);
	  result[11] = Math.abs(matrix[11]);
	  result[12] = Math.abs(matrix[12]);
	  result[13] = Math.abs(matrix[13]);
	  result[14] = Math.abs(matrix[14]);
	  result[15] = Math.abs(matrix[15]);

	  return result;
	};

	/**
	 * Compares the provided matrices componentwise and returns
	 * <code>true</code> if they are equal, <code>false</code> otherwise.
	 *
	 * @param {Matrix4} [left] The first matrix.
	 * @param {Matrix4} [right] The second matrix.
	 * @returns {boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
	 *
	 * @example
	 * //compares two Matrix4 instances
	 *
	 * // a = [10.0, 14.0, 18.0, 22.0]
	 * //     [11.0, 15.0, 19.0, 23.0]
	 * //     [12.0, 16.0, 20.0, 24.0]
	 * //     [13.0, 17.0, 21.0, 25.0]
	 *
	 * // b = [10.0, 14.0, 18.0, 22.0]
	 * //     [11.0, 15.0, 19.0, 23.0]
	 * //     [12.0, 16.0, 20.0, 24.0]
	 * //     [13.0, 17.0, 21.0, 25.0]
	 *
	 * if(Cesium.Matrix4.equals(a,b)) {
	 *      console.log("Both matrices are equal");
	 * } else {
	 *      console.log("They are not equal");
	 * }
	 *
	 * //Prints "Both matrices are equal" on the console
	 */
	Matrix4.equals = function (left, right) {
	  // Given that most matrices will be transformation matrices, the elements
	  // are tested in order such that the test is likely to fail as early
	  // as possible.  I _think_ this is just as friendly to the L1 cache
	  // as testing in index order.  It is certainty faster in practice.
	  return (
	    left === right ||
	    (defined(left) &&
	      defined(right) &&
	      // Translation
	      left[12] === right[12] &&
	      left[13] === right[13] &&
	      left[14] === right[14] &&
	      // Rotation/scale
	      left[0] === right[0] &&
	      left[1] === right[1] &&
	      left[2] === right[2] &&
	      left[4] === right[4] &&
	      left[5] === right[5] &&
	      left[6] === right[6] &&
	      left[8] === right[8] &&
	      left[9] === right[9] &&
	      left[10] === right[10] &&
	      // Bottom row
	      left[3] === right[3] &&
	      left[7] === right[7] &&
	      left[11] === right[11] &&
	      left[15] === right[15])
	  );
	};

	/**
	 * Compares the provided matrices componentwise and returns
	 * <code>true</code> if they are within the provided epsilon,
	 * <code>false</code> otherwise.
	 *
	 * @param {Matrix4} [left] The first matrix.
	 * @param {Matrix4} [right] The second matrix.
	 * @param {number} [epsilon=0] The epsilon to use for equality testing.
	 * @returns {boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
	 *
	 * @example
	 * //compares two Matrix4 instances
	 *
	 * // a = [10.5, 14.5, 18.5, 22.5]
	 * //     [11.5, 15.5, 19.5, 23.5]
	 * //     [12.5, 16.5, 20.5, 24.5]
	 * //     [13.5, 17.5, 21.5, 25.5]
	 *
	 * // b = [10.0, 14.0, 18.0, 22.0]
	 * //     [11.0, 15.0, 19.0, 23.0]
	 * //     [12.0, 16.0, 20.0, 24.0]
	 * //     [13.0, 17.0, 21.0, 25.0]
	 *
	 * if(Cesium.Matrix4.equalsEpsilon(a,b,0.1)){
	 *      console.log("Difference between both the matrices is less than 0.1");
	 * } else {
	 *      console.log("Difference between both the matrices is not less than 0.1");
	 * }
	 *
	 * //Prints "Difference between both the matrices is not less than 0.1" on the console
	 */
	Matrix4.equalsEpsilon = function (left, right, epsilon) {
	  epsilon = defaultValue(epsilon, 0);

	  return (
	    left === right ||
	    (defined(left) &&
	      defined(right) &&
	      Math.abs(left[0] - right[0]) <= epsilon &&
	      Math.abs(left[1] - right[1]) <= epsilon &&
	      Math.abs(left[2] - right[2]) <= epsilon &&
	      Math.abs(left[3] - right[3]) <= epsilon &&
	      Math.abs(left[4] - right[4]) <= epsilon &&
	      Math.abs(left[5] - right[5]) <= epsilon &&
	      Math.abs(left[6] - right[6]) <= epsilon &&
	      Math.abs(left[7] - right[7]) <= epsilon &&
	      Math.abs(left[8] - right[8]) <= epsilon &&
	      Math.abs(left[9] - right[9]) <= epsilon &&
	      Math.abs(left[10] - right[10]) <= epsilon &&
	      Math.abs(left[11] - right[11]) <= epsilon &&
	      Math.abs(left[12] - right[12]) <= epsilon &&
	      Math.abs(left[13] - right[13]) <= epsilon &&
	      Math.abs(left[14] - right[14]) <= epsilon &&
	      Math.abs(left[15] - right[15]) <= epsilon)
	  );
	};

	/**
	 * Gets the translation portion of the provided matrix, assuming the matrix is an affine transformation matrix.
	 *
	 * @param {Matrix4} matrix The matrix to use.
	 * @param {Cartesian3} result The object onto which to store the result.
	 * @returns {Cartesian3} The modified result parameter.
	 */
	Matrix4.getTranslation = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = matrix[12];
	  result.y = matrix[13];
	  result.z = matrix[14];
	  return result;
	};

	/**
	 * Gets the upper left 3x3 matrix of the provided matrix.
	 *
	 * @param {Matrix4} matrix The matrix to use.
	 * @param {Matrix3} result The object onto which to store the result.
	 * @returns {Matrix3} The modified result parameter.
	 *
	 * @example
	 * // returns a Matrix3 instance from a Matrix4 instance
	 *
	 * // m = [10.0, 14.0, 18.0, 22.0]
	 * //     [11.0, 15.0, 19.0, 23.0]
	 * //     [12.0, 16.0, 20.0, 24.0]
	 * //     [13.0, 17.0, 21.0, 25.0]
	 *
	 * const b = new Cesium.Matrix3();
	 * Cesium.Matrix4.getMatrix3(m,b);
	 *
	 * // b = [10.0, 14.0, 18.0]
	 * //     [11.0, 15.0, 19.0]
	 * //     [12.0, 16.0, 20.0]
	 */
	Matrix4.getMatrix3 = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result[0] = matrix[0];
	  result[1] = matrix[1];
	  result[2] = matrix[2];
	  result[3] = matrix[4];
	  result[4] = matrix[5];
	  result[5] = matrix[6];
	  result[6] = matrix[8];
	  result[7] = matrix[9];
	  result[8] = matrix[10];
	  return result;
	};

	const scratchInverseRotation = new Matrix3();
	const scratchMatrix3Zero = new Matrix3();
	const scratchBottomRow = new Cartesian4();
	const scratchExpectedBottomRow = new Cartesian4(0.0, 0.0, 0.0, 1.0);

	/**
	 * Computes the inverse of the provided matrix using Cramers Rule.
	 * If the determinant is zero, the matrix can not be inverted, and an exception is thrown.
	 * If the matrix is a proper rigid transformation, it is more efficient
	 * to invert it with {@link Matrix4.inverseTransformation}.
	 *
	 * @param {Matrix4} matrix The matrix to invert.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 *
	 * @exception {RuntimeError} matrix is not invertible because its determinate is zero.
	 */
	Matrix4.inverse = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');
	  //
	  // Ported from:
	  //   ftp://download.intel.com/design/PentiumIII/sml/24504301.pdf
	  //
	  const src0 = matrix[0];
	  const src1 = matrix[4];
	  const src2 = matrix[8];
	  const src3 = matrix[12];
	  const src4 = matrix[1];
	  const src5 = matrix[5];
	  const src6 = matrix[9];
	  const src7 = matrix[13];
	  const src8 = matrix[2];
	  const src9 = matrix[6];
	  const src10 = matrix[10];
	  const src11 = matrix[14];
	  const src12 = matrix[3];
	  const src13 = matrix[7];
	  const src14 = matrix[11];
	  const src15 = matrix[15];

	  // calculate pairs for first 8 elements (cofactors)
	  let tmp0 = src10 * src15;
	  let tmp1 = src11 * src14;
	  let tmp2 = src9 * src15;
	  let tmp3 = src11 * src13;
	  let tmp4 = src9 * src14;
	  let tmp5 = src10 * src13;
	  let tmp6 = src8 * src15;
	  let tmp7 = src11 * src12;
	  let tmp8 = src8 * src14;
	  let tmp9 = src10 * src12;
	  let tmp10 = src8 * src13;
	  let tmp11 = src9 * src12;

	  // calculate first 8 elements (cofactors)
	  const dst0 =
	    tmp0 * src5 +
	    tmp3 * src6 +
	    tmp4 * src7 -
	    (tmp1 * src5 + tmp2 * src6 + tmp5 * src7);
	  const dst1 =
	    tmp1 * src4 +
	    tmp6 * src6 +
	    tmp9 * src7 -
	    (tmp0 * src4 + tmp7 * src6 + tmp8 * src7);
	  const dst2 =
	    tmp2 * src4 +
	    tmp7 * src5 +
	    tmp10 * src7 -
	    (tmp3 * src4 + tmp6 * src5 + tmp11 * src7);
	  const dst3 =
	    tmp5 * src4 +
	    tmp8 * src5 +
	    tmp11 * src6 -
	    (tmp4 * src4 + tmp9 * src5 + tmp10 * src6);
	  const dst4 =
	    tmp1 * src1 +
	    tmp2 * src2 +
	    tmp5 * src3 -
	    (tmp0 * src1 + tmp3 * src2 + tmp4 * src3);
	  const dst5 =
	    tmp0 * src0 +
	    tmp7 * src2 +
	    tmp8 * src3 -
	    (tmp1 * src0 + tmp6 * src2 + tmp9 * src3);
	  const dst6 =
	    tmp3 * src0 +
	    tmp6 * src1 +
	    tmp11 * src3 -
	    (tmp2 * src0 + tmp7 * src1 + tmp10 * src3);
	  const dst7 =
	    tmp4 * src0 +
	    tmp9 * src1 +
	    tmp10 * src2 -
	    (tmp5 * src0 + tmp8 * src1 + tmp11 * src2);

	  // calculate pairs for second 8 elements (cofactors)
	  tmp0 = src2 * src7;
	  tmp1 = src3 * src6;
	  tmp2 = src1 * src7;
	  tmp3 = src3 * src5;
	  tmp4 = src1 * src6;
	  tmp5 = src2 * src5;
	  tmp6 = src0 * src7;
	  tmp7 = src3 * src4;
	  tmp8 = src0 * src6;
	  tmp9 = src2 * src4;
	  tmp10 = src0 * src5;
	  tmp11 = src1 * src4;

	  // calculate second 8 elements (cofactors)
	  const dst8 =
	    tmp0 * src13 +
	    tmp3 * src14 +
	    tmp4 * src15 -
	    (tmp1 * src13 + tmp2 * src14 + tmp5 * src15);
	  const dst9 =
	    tmp1 * src12 +
	    tmp6 * src14 +
	    tmp9 * src15 -
	    (tmp0 * src12 + tmp7 * src14 + tmp8 * src15);
	  const dst10 =
	    tmp2 * src12 +
	    tmp7 * src13 +
	    tmp10 * src15 -
	    (tmp3 * src12 + tmp6 * src13 + tmp11 * src15);
	  const dst11 =
	    tmp5 * src12 +
	    tmp8 * src13 +
	    tmp11 * src14 -
	    (tmp4 * src12 + tmp9 * src13 + tmp10 * src14);
	  const dst12 =
	    tmp2 * src10 +
	    tmp5 * src11 +
	    tmp1 * src9 -
	    (tmp4 * src11 + tmp0 * src9 + tmp3 * src10);
	  const dst13 =
	    tmp8 * src11 +
	    tmp0 * src8 +
	    tmp7 * src10 -
	    (tmp6 * src10 + tmp9 * src11 + tmp1 * src8);
	  const dst14 =
	    tmp6 * src9 +
	    tmp11 * src11 +
	    tmp3 * src8 -
	    (tmp10 * src11 + tmp2 * src8 + tmp7 * src9);
	  const dst15 =
	    tmp10 * src10 +
	    tmp4 * src8 +
	    tmp9 * src9 -
	    (tmp8 * src9 + tmp11 * src10 + tmp5 * src8);

	  // calculate determinant
	  let det = src0 * dst0 + src1 * dst1 + src2 * dst2 + src3 * dst3;

	  if (Math.abs(det) < CesiumMath.EPSILON21) {
	    // Special case for a zero scale matrix that can occur, for example,
	    // when a model's node has a [0, 0, 0] scale.
	    if (
	      Matrix3.equalsEpsilon(
	        Matrix4.getMatrix3(matrix, scratchInverseRotation),
	        scratchMatrix3Zero,
	        CesiumMath.EPSILON7,
	      ) &&
	      Cartesian4.equals(
	        Matrix4.getRow(matrix, 3, scratchBottomRow),
	        scratchExpectedBottomRow,
	      )
	    ) {
	      result[0] = 0.0;
	      result[1] = 0.0;
	      result[2] = 0.0;
	      result[3] = 0.0;
	      result[4] = 0.0;
	      result[5] = 0.0;
	      result[6] = 0.0;
	      result[7] = 0.0;
	      result[8] = 0.0;
	      result[9] = 0.0;
	      result[10] = 0.0;
	      result[11] = 0.0;
	      result[12] = -matrix[12];
	      result[13] = -matrix[13];
	      result[14] = -matrix[14];
	      result[15] = 1.0;
	      return result;
	    }

	    throw new RuntimeError(
	      "matrix is not invertible because its determinate is zero.",
	    );
	  }

	  // calculate matrix inverse
	  det = 1.0 / det;

	  result[0] = dst0 * det;
	  result[1] = dst1 * det;
	  result[2] = dst2 * det;
	  result[3] = dst3 * det;
	  result[4] = dst4 * det;
	  result[5] = dst5 * det;
	  result[6] = dst6 * det;
	  result[7] = dst7 * det;
	  result[8] = dst8 * det;
	  result[9] = dst9 * det;
	  result[10] = dst10 * det;
	  result[11] = dst11 * det;
	  result[12] = dst12 * det;
	  result[13] = dst13 * det;
	  result[14] = dst14 * det;
	  result[15] = dst15 * det;
	  return result;
	};

	/**
	 * Computes the inverse of the provided matrix assuming it is a proper rigid matrix,
	 * where the upper left 3x3 elements are a rotation matrix,
	 * and the upper three elements in the fourth column are the translation.
	 * The bottom row is assumed to be [0, 0, 0, 1].
	 * The matrix is not verified to be in the proper form.
	 * This method is faster than computing the inverse for a general 4x4
	 * matrix using {@link Matrix4.inverse}.
	 *
	 * @param {Matrix4} matrix The matrix to invert.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 */
	Matrix4.inverseTransformation = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  //This function is an optimized version of the below 4 lines.
	  //const rT = Matrix3.transpose(Matrix4.getMatrix3(matrix));
	  //const rTN = Matrix3.negate(rT);
	  //const rTT = Matrix3.multiplyByVector(rTN, Matrix4.getTranslation(matrix));
	  //return Matrix4.fromRotationTranslation(rT, rTT, result);

	  const matrix0 = matrix[0];
	  const matrix1 = matrix[1];
	  const matrix2 = matrix[2];
	  const matrix4 = matrix[4];
	  const matrix5 = matrix[5];
	  const matrix6 = matrix[6];
	  const matrix8 = matrix[8];
	  const matrix9 = matrix[9];
	  const matrix10 = matrix[10];

	  const vX = matrix[12];
	  const vY = matrix[13];
	  const vZ = matrix[14];

	  const x = -matrix0 * vX - matrix1 * vY - matrix2 * vZ;
	  const y = -matrix4 * vX - matrix5 * vY - matrix6 * vZ;
	  const z = -matrix8 * vX - matrix9 * vY - matrix10 * vZ;

	  result[0] = matrix0;
	  result[1] = matrix4;
	  result[2] = matrix8;
	  result[3] = 0.0;
	  result[4] = matrix1;
	  result[5] = matrix5;
	  result[6] = matrix9;
	  result[7] = 0.0;
	  result[8] = matrix2;
	  result[9] = matrix6;
	  result[10] = matrix10;
	  result[11] = 0.0;
	  result[12] = x;
	  result[13] = y;
	  result[14] = z;
	  result[15] = 1.0;
	  return result;
	};

	const scratchTransposeMatrix = new Matrix4();

	/**
	 * Computes the inverse transpose of a matrix.
	 *
	 * @param {Matrix4} matrix The matrix to transpose and invert.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter.
	 */
	Matrix4.inverseTranspose = function (matrix, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("matrix", matrix);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  return Matrix4.inverse(
	    Matrix4.transpose(matrix, scratchTransposeMatrix),
	    result,
	  );
	};

	/**
	 * An immutable Matrix4 instance initialized to the identity matrix.
	 *
	 * @type {Matrix4}
	 * @constant
	 */
	Matrix4.IDENTITY = Object.freeze(
	  new Matrix4(
	    1.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    1.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    1.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    1.0,
	  ),
	);

	/**
	 * An immutable Matrix4 instance initialized to the zero matrix.
	 *
	 * @type {Matrix4}
	 * @constant
	 */
	Matrix4.ZERO = Object.freeze(
	  new Matrix4(
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	    0.0,
	  ),
	);

	/**
	 * The index into Matrix4 for column 0, row 0.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN0ROW0 = 0;

	/**
	 * The index into Matrix4 for column 0, row 1.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN0ROW1 = 1;

	/**
	 * The index into Matrix4 for column 0, row 2.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN0ROW2 = 2;

	/**
	 * The index into Matrix4 for column 0, row 3.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN0ROW3 = 3;

	/**
	 * The index into Matrix4 for column 1, row 0.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN1ROW0 = 4;

	/**
	 * The index into Matrix4 for column 1, row 1.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN1ROW1 = 5;

	/**
	 * The index into Matrix4 for column 1, row 2.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN1ROW2 = 6;

	/**
	 * The index into Matrix4 for column 1, row 3.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN1ROW3 = 7;

	/**
	 * The index into Matrix4 for column 2, row 0.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN2ROW0 = 8;

	/**
	 * The index into Matrix4 for column 2, row 1.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN2ROW1 = 9;

	/**
	 * The index into Matrix4 for column 2, row 2.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN2ROW2 = 10;

	/**
	 * The index into Matrix4 for column 2, row 3.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN2ROW3 = 11;

	/**
	 * The index into Matrix4 for column 3, row 0.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN3ROW0 = 12;

	/**
	 * The index into Matrix4 for column 3, row 1.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN3ROW1 = 13;

	/**
	 * The index into Matrix4 for column 3, row 2.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN3ROW2 = 14;

	/**
	 * The index into Matrix4 for column 3, row 3.
	 *
	 * @type {number}
	 * @constant
	 */
	Matrix4.COLUMN3ROW3 = 15;

	Object.defineProperties(Matrix4.prototype, {
	  /**
	   * Gets the number of items in the collection.
	   * @memberof Matrix4.prototype
	   *
	   * @type {number}
	   */
	  length: {
	    get: function () {
	      return Matrix4.packedLength;
	    },
	  },
	});

	/**
	 * Duplicates the provided Matrix4 instance.
	 *
	 * @param {Matrix4} [result] The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
	 */
	Matrix4.prototype.clone = function (result) {
	  return Matrix4.clone(this, result);
	};

	/**
	 * Compares this matrix to the provided matrix componentwise and returns
	 * <code>true</code> if they are equal, <code>false</code> otherwise.
	 *
	 * @param {Matrix4} [right] The right hand side matrix.
	 * @returns {boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
	 */
	Matrix4.prototype.equals = function (right) {
	  return Matrix4.equals(this, right);
	};

	/**
	 * @private
	 */
	Matrix4.equalsArray = function (matrix, array, offset) {
	  return (
	    matrix[0] === array[offset] &&
	    matrix[1] === array[offset + 1] &&
	    matrix[2] === array[offset + 2] &&
	    matrix[3] === array[offset + 3] &&
	    matrix[4] === array[offset + 4] &&
	    matrix[5] === array[offset + 5] &&
	    matrix[6] === array[offset + 6] &&
	    matrix[7] === array[offset + 7] &&
	    matrix[8] === array[offset + 8] &&
	    matrix[9] === array[offset + 9] &&
	    matrix[10] === array[offset + 10] &&
	    matrix[11] === array[offset + 11] &&
	    matrix[12] === array[offset + 12] &&
	    matrix[13] === array[offset + 13] &&
	    matrix[14] === array[offset + 14] &&
	    matrix[15] === array[offset + 15]
	  );
	};

	/**
	 * Compares this matrix to the provided matrix componentwise and returns
	 * <code>true</code> if they are within the provided epsilon,
	 * <code>false</code> otherwise.
	 *
	 * @param {Matrix4} [right] The right hand side matrix.
	 * @param {number} [epsilon=0] The epsilon to use for equality testing.
	 * @returns {boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
	 */
	Matrix4.prototype.equalsEpsilon = function (right, epsilon) {
	  return Matrix4.equalsEpsilon(this, right, epsilon);
	};

	/**
	 * Computes a string representing this Matrix with each row being
	 * on a separate line and in the format '(column0, column1, column2, column3)'.
	 *
	 * @returns {string} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1, column2, column3)'.
	 */
	Matrix4.prototype.toString = function () {
	  return (
	    `(${this[0]}, ${this[4]}, ${this[8]}, ${this[12]})\n` +
	    `(${this[1]}, ${this[5]}, ${this[9]}, ${this[13]})\n` +
	    `(${this[2]}, ${this[6]}, ${this[10]}, ${this[14]})\n` +
	    `(${this[3]}, ${this[7]}, ${this[11]}, ${this[15]})`
	  );
	};

	/**
	 * An enum describing the x, y, and z axes and helper conversion functions.
	 *
	 * @enum {number}
	 */
	const Axis = {
	  /**
	   * Denotes the x-axis.
	   *
	   * @type {number}
	   * @constant
	   */
	  X: 0,

	  /**
	   * Denotes the y-axis.
	   *
	   * @type {number}
	   * @constant
	   */
	  Y: 1,

	  /**
	   * Denotes the z-axis.
	   *
	   * @type {number}
	   * @constant
	   */
	  Z: 2,
	};

	/**
	 * Matrix used to convert from y-up to z-up
	 *
	 * @type {Matrix4}
	 * @constant
	 */
	Axis.Y_UP_TO_Z_UP = Matrix4.fromRotationTranslation(
	  // Rotation about PI/2 around the X-axis
	  Matrix3.fromArray([1, 0, 0, 0, 0, 1, 0, -1, 0]),
	);

	/**
	 * Matrix used to convert from z-up to y-up
	 *
	 * @type {Matrix4}
	 * @constant
	 */
	Axis.Z_UP_TO_Y_UP = Matrix4.fromRotationTranslation(
	  // Rotation about -PI/2 around the X-axis
	  Matrix3.fromArray([1, 0, 0, 0, 0, -1, 0, 1, 0]),
	);

	/**
	 * Matrix used to convert from x-up to z-up
	 *
	 * @type {Matrix4}
	 * @constant
	 */
	Axis.X_UP_TO_Z_UP = Matrix4.fromRotationTranslation(
	  // Rotation about -PI/2 around the Y-axis
	  Matrix3.fromArray([0, 0, 1, 0, 1, 0, -1, 0, 0]),
	);

	/**
	 * Matrix used to convert from z-up to x-up
	 *
	 * @type {Matrix4}
	 * @constant
	 */
	Axis.Z_UP_TO_X_UP = Matrix4.fromRotationTranslation(
	  // Rotation about PI/2 around the Y-axis
	  Matrix3.fromArray([0, 0, -1, 0, 1, 0, 1, 0, 0]),
	);

	/**
	 * Matrix used to convert from x-up to y-up
	 *
	 * @type {Matrix4}
	 * @constant
	 */
	Axis.X_UP_TO_Y_UP = Matrix4.fromRotationTranslation(
	  // Rotation about PI/2 around the Z-axis
	  Matrix3.fromArray([0, 1, 0, -1, 0, 0, 0, 0, 1]),
	);

	/**
	 * Matrix used to convert from y-up to x-up
	 *
	 * @type {Matrix4}
	 * @constant
	 */
	Axis.Y_UP_TO_X_UP = Matrix4.fromRotationTranslation(
	  // Rotation about -PI/2 around the Z-axis
	  Matrix3.fromArray([0, -1, 0, 1, 0, 0, 0, 0, 1]),
	);

	/**
	 * Gets the axis by name
	 *
	 * @param {string} name The name of the axis.
	 * @returns {number} The axis enum.
	 */
	Axis.fromName = function (name) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.string("name", name);
	  //>>includeEnd('debug');

	  return Axis[name];
	};

	var Axis$1 = Object.freeze(Axis);

	/**
	 * A 2D Cartesian point.
	 * @alias Cartesian2
	 * @constructor
	 *
	 * @param {number} [x=0.0] The X component.
	 * @param {number} [y=0.0] The Y component.
	 *
	 * @see Cartesian3
	 * @see Cartesian4
	 * @see Packable
	 */
	function Cartesian2(x, y) {
	  /**
	   * The X component.
	   * @type {number}
	   * @default 0.0
	   */
	  this.x = defaultValue(x, 0.0);

	  /**
	   * The Y component.
	   * @type {number}
	   * @default 0.0
	   */
	  this.y = defaultValue(y, 0.0);
	}

	/**
	 * Creates a Cartesian2 instance from x and y coordinates.
	 *
	 * @param {number} x The x coordinate.
	 * @param {number} y The y coordinate.
	 * @param {Cartesian2} [result] The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
	 */
	Cartesian2.fromElements = function (x, y, result) {
	  if (!defined(result)) {
	    return new Cartesian2(x, y);
	  }

	  result.x = x;
	  result.y = y;
	  return result;
	};

	/**
	 * Duplicates a Cartesian2 instance.
	 *
	 * @param {Cartesian2} cartesian The Cartesian to duplicate.
	 * @param {Cartesian2} [result] The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided. (Returns undefined if cartesian is undefined)
	 */
	Cartesian2.clone = function (cartesian, result) {
	  if (!defined(cartesian)) {
	    return undefined;
	  }
	  if (!defined(result)) {
	    return new Cartesian2(cartesian.x, cartesian.y);
	  }

	  result.x = cartesian.x;
	  result.y = cartesian.y;
	  return result;
	};

	/**
	 * Creates a Cartesian2 instance from an existing Cartesian3.  This simply takes the
	 * x and y properties of the Cartesian3 and drops z.
	 * @function
	 *
	 * @param {Cartesian3} cartesian The Cartesian3 instance to create a Cartesian2 instance from.
	 * @param {Cartesian2} [result] The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
	 */
	Cartesian2.fromCartesian3 = Cartesian2.clone;

	/**
	 * Creates a Cartesian2 instance from an existing Cartesian4.  This simply takes the
	 * x and y properties of the Cartesian4 and drops z and w.
	 * @function
	 *
	 * @param {Cartesian4} cartesian The Cartesian4 instance to create a Cartesian2 instance from.
	 * @param {Cartesian2} [result] The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
	 */
	Cartesian2.fromCartesian4 = Cartesian2.clone;

	/**
	 * The number of elements used to pack the object into an array.
	 * @type {number}
	 */
	Cartesian2.packedLength = 2;

	/**
	 * Stores the provided instance into the provided array.
	 *
	 * @param {Cartesian2} value The value to pack.
	 * @param {number[]} array The array to pack into.
	 * @param {number} [startingIndex=0] The index into the array at which to start packing the elements.
	 *
	 * @returns {number[]} The array that was packed into
	 */
	Cartesian2.pack = function (value, array, startingIndex) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("value", value);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);

	  array[startingIndex++] = value.x;
	  array[startingIndex] = value.y;

	  return array;
	};

	/**
	 * Retrieves an instance from a packed array.
	 *
	 * @param {number[]} array The packed array.
	 * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
	 * @param {Cartesian2} [result] The object into which to store the result.
	 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
	 */
	Cartesian2.unpack = function (array, startingIndex, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);

	  if (!defined(result)) {
	    result = new Cartesian2();
	  }
	  result.x = array[startingIndex++];
	  result.y = array[startingIndex];
	  return result;
	};

	/**
	 * Flattens an array of Cartesian2s into an array of components.
	 *
	 * @param {Cartesian2[]} array The array of cartesians to pack.
	 * @param {number[]} [result] The array onto which to store the result. If this is a typed array, it must have array.length * 2 components, else a {@link DeveloperError} will be thrown. If it is a regular array, it will be resized to have (array.length * 2) elements.
	 * @returns {number[]} The packed array.
	 */
	Cartesian2.packArray = function (array, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  const length = array.length;
	  const resultLength = length * 2;
	  if (!defined(result)) {
	    result = new Array(resultLength);
	  } else if (!Array.isArray(result) && result.length !== resultLength) {
	    //>>includeStart('debug', pragmas.debug);
	    throw new DeveloperError(
	      "If result is a typed array, it must have exactly array.length * 2 elements",
	    );
	    //>>includeEnd('debug');
	  } else if (result.length !== resultLength) {
	    result.length = resultLength;
	  }

	  for (let i = 0; i < length; ++i) {
	    Cartesian2.pack(array[i], result, i * 2);
	  }
	  return result;
	};

	/**
	 * Unpacks an array of cartesian components into an array of Cartesian2s.
	 *
	 * @param {number[]} array The array of components to unpack.
	 * @param {Cartesian2[]} [result] The array onto which to store the result.
	 * @returns {Cartesian2[]} The unpacked array.
	 */
	Cartesian2.unpackArray = function (array, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  Check.typeOf.number.greaterThanOrEquals("array.length", array.length, 2);
	  if (array.length % 2 !== 0) {
	    throw new DeveloperError("array length must be a multiple of 2.");
	  }
	  //>>includeEnd('debug');

	  const length = array.length;
	  if (!defined(result)) {
	    result = new Array(length / 2);
	  } else {
	    result.length = length / 2;
	  }

	  for (let i = 0; i < length; i += 2) {
	    const index = i / 2;
	    result[index] = Cartesian2.unpack(array, i, result[index]);
	  }
	  return result;
	};

	/**
	 * Creates a Cartesian2 from two consecutive elements in an array.
	 * @function
	 *
	 * @param {number[]} array The array whose two consecutive elements correspond to the x and y components, respectively.
	 * @param {number} [startingIndex=0] The offset into the array of the first element, which corresponds to the x component.
	 * @param {Cartesian2} [result] The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
	 *
	 * @example
	 * // Create a Cartesian2 with (1.0, 2.0)
	 * const v = [1.0, 2.0];
	 * const p = Cesium.Cartesian2.fromArray(v);
	 *
	 * // Create a Cartesian2 with (1.0, 2.0) using an offset into an array
	 * const v2 = [0.0, 0.0, 1.0, 2.0];
	 * const p2 = Cesium.Cartesian2.fromArray(v2, 2);
	 */
	Cartesian2.fromArray = Cartesian2.unpack;

	/**
	 * Computes the value of the maximum component for the supplied Cartesian.
	 *
	 * @param {Cartesian2} cartesian The cartesian to use.
	 * @returns {number} The value of the maximum component.
	 */
	Cartesian2.maximumComponent = function (cartesian) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  //>>includeEnd('debug');

	  return Math.max(cartesian.x, cartesian.y);
	};

	/**
	 * Computes the value of the minimum component for the supplied Cartesian.
	 *
	 * @param {Cartesian2} cartesian The cartesian to use.
	 * @returns {number} The value of the minimum component.
	 */
	Cartesian2.minimumComponent = function (cartesian) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  //>>includeEnd('debug');

	  return Math.min(cartesian.x, cartesian.y);
	};

	/**
	 * Compares two Cartesians and computes a Cartesian which contains the minimum components of the supplied Cartesians.
	 *
	 * @param {Cartesian2} first A cartesian to compare.
	 * @param {Cartesian2} second A cartesian to compare.
	 * @param {Cartesian2} result The object into which to store the result.
	 * @returns {Cartesian2} A cartesian with the minimum components.
	 */
	Cartesian2.minimumByComponent = function (first, second, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("first", first);
	  Check.typeOf.object("second", second);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Math.min(first.x, second.x);
	  result.y = Math.min(first.y, second.y);

	  return result;
	};

	/**
	 * Compares two Cartesians and computes a Cartesian which contains the maximum components of the supplied Cartesians.
	 *
	 * @param {Cartesian2} first A cartesian to compare.
	 * @param {Cartesian2} second A cartesian to compare.
	 * @param {Cartesian2} result The object into which to store the result.
	 * @returns {Cartesian2} A cartesian with the maximum components.
	 */
	Cartesian2.maximumByComponent = function (first, second, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("first", first);
	  Check.typeOf.object("second", second);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Math.max(first.x, second.x);
	  result.y = Math.max(first.y, second.y);
	  return result;
	};

	/**
	 * Constrain a value to lie between two values.
	 *
	 * @param {Cartesian2} value The value to clamp.
	 * @param {Cartesian2} min The minimum bound.
	 * @param {Cartesian2} max The maximum bound.
	 * @param {Cartesian2} result The object into which to store the result.
	 * @returns {Cartesian2} The clamped value such that min <= result <= max.
	 */
	Cartesian2.clamp = function (value, min, max, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("value", value);
	  Check.typeOf.object("min", min);
	  Check.typeOf.object("max", max);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const x = CesiumMath.clamp(value.x, min.x, max.x);
	  const y = CesiumMath.clamp(value.y, min.y, max.y);

	  result.x = x;
	  result.y = y;

	  return result;
	};

	/**
	 * Computes the provided Cartesian's squared magnitude.
	 *
	 * @param {Cartesian2} cartesian The Cartesian instance whose squared magnitude is to be computed.
	 * @returns {number} The squared magnitude.
	 */
	Cartesian2.magnitudeSquared = function (cartesian) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  //>>includeEnd('debug');

	  return cartesian.x * cartesian.x + cartesian.y * cartesian.y;
	};

	/**
	 * Computes the Cartesian's magnitude (length).
	 *
	 * @param {Cartesian2} cartesian The Cartesian instance whose magnitude is to be computed.
	 * @returns {number} The magnitude.
	 */
	Cartesian2.magnitude = function (cartesian) {
	  return Math.sqrt(Cartesian2.magnitudeSquared(cartesian));
	};

	const distanceScratch = new Cartesian2();

	/**
	 * Computes the distance between two points.
	 *
	 * @param {Cartesian2} left The first point to compute the distance from.
	 * @param {Cartesian2} right The second point to compute the distance to.
	 * @returns {number} The distance between two points.
	 *
	 * @example
	 * // Returns 1.0
	 * const d = Cesium.Cartesian2.distance(new Cesium.Cartesian2(1.0, 0.0), new Cesium.Cartesian2(2.0, 0.0));
	 */
	Cartesian2.distance = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  Cartesian2.subtract(left, right, distanceScratch);
	  return Cartesian2.magnitude(distanceScratch);
	};

	/**
	 * Computes the squared distance between two points.  Comparing squared distances
	 * using this function is more efficient than comparing distances using {@link Cartesian2#distance}.
	 *
	 * @param {Cartesian2} left The first point to compute the distance from.
	 * @param {Cartesian2} right The second point to compute the distance to.
	 * @returns {number} The distance between two points.
	 *
	 * @example
	 * // Returns 4.0, not 2.0
	 * const d = Cesium.Cartesian2.distance(new Cesium.Cartesian2(1.0, 0.0), new Cesium.Cartesian2(3.0, 0.0));
	 */
	Cartesian2.distanceSquared = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  Cartesian2.subtract(left, right, distanceScratch);
	  return Cartesian2.magnitudeSquared(distanceScratch);
	};

	/**
	 * Computes the normalized form of the supplied Cartesian.
	 *
	 * @param {Cartesian2} cartesian The Cartesian to be normalized.
	 * @param {Cartesian2} result The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter.
	 */
	Cartesian2.normalize = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const magnitude = Cartesian2.magnitude(cartesian);

	  result.x = cartesian.x / magnitude;
	  result.y = cartesian.y / magnitude;

	  //>>includeStart('debug', pragmas.debug);
	  if (isNaN(result.x) || isNaN(result.y)) {
	    throw new DeveloperError("normalized result is not a number");
	  }
	  //>>includeEnd('debug');

	  return result;
	};

	/**
	 * Computes the dot (scalar) product of two Cartesians.
	 *
	 * @param {Cartesian2} left The first Cartesian.
	 * @param {Cartesian2} right The second Cartesian.
	 * @returns {number} The dot product.
	 */
	Cartesian2.dot = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  return left.x * right.x + left.y * right.y;
	};

	/**
	 * Computes the magnitude of the cross product that would result from implicitly setting the Z coordinate of the input vectors to 0
	 *
	 * @param {Cartesian2} left The first Cartesian.
	 * @param {Cartesian2} right The second Cartesian.
	 * @returns {number} The cross product.
	 */
	Cartesian2.cross = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  return left.x * right.y - left.y * right.x;
	};

	/**
	 * Computes the componentwise product of two Cartesians.
	 *
	 * @param {Cartesian2} left The first Cartesian.
	 * @param {Cartesian2} right The second Cartesian.
	 * @param {Cartesian2} result The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter.
	 */
	Cartesian2.multiplyComponents = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x * right.x;
	  result.y = left.y * right.y;
	  return result;
	};

	/**
	 * Computes the componentwise quotient of two Cartesians.
	 *
	 * @param {Cartesian2} left The first Cartesian.
	 * @param {Cartesian2} right The second Cartesian.
	 * @param {Cartesian2} result The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter.
	 */
	Cartesian2.divideComponents = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x / right.x;
	  result.y = left.y / right.y;
	  return result;
	};

	/**
	 * Computes the componentwise sum of two Cartesians.
	 *
	 * @param {Cartesian2} left The first Cartesian.
	 * @param {Cartesian2} right The second Cartesian.
	 * @param {Cartesian2} result The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter.
	 */
	Cartesian2.add = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x + right.x;
	  result.y = left.y + right.y;
	  return result;
	};

	/**
	 * Computes the componentwise difference of two Cartesians.
	 *
	 * @param {Cartesian2} left The first Cartesian.
	 * @param {Cartesian2} right The second Cartesian.
	 * @param {Cartesian2} result The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter.
	 */
	Cartesian2.subtract = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x - right.x;
	  result.y = left.y - right.y;
	  return result;
	};

	/**
	 * Multiplies the provided Cartesian componentwise by the provided scalar.
	 *
	 * @param {Cartesian2} cartesian The Cartesian to be scaled.
	 * @param {number} scalar The scalar to multiply with.
	 * @param {Cartesian2} result The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter.
	 */
	Cartesian2.multiplyByScalar = function (cartesian, scalar, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.number("scalar", scalar);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = cartesian.x * scalar;
	  result.y = cartesian.y * scalar;
	  return result;
	};

	/**
	 * Divides the provided Cartesian componentwise by the provided scalar.
	 *
	 * @param {Cartesian2} cartesian The Cartesian to be divided.
	 * @param {number} scalar The scalar to divide by.
	 * @param {Cartesian2} result The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter.
	 */
	Cartesian2.divideByScalar = function (cartesian, scalar, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.number("scalar", scalar);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = cartesian.x / scalar;
	  result.y = cartesian.y / scalar;
	  return result;
	};

	/**
	 * Negates the provided Cartesian.
	 *
	 * @param {Cartesian2} cartesian The Cartesian to be negated.
	 * @param {Cartesian2} result The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter.
	 */
	Cartesian2.negate = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = -cartesian.x;
	  result.y = -cartesian.y;
	  return result;
	};

	/**
	 * Computes the absolute value of the provided Cartesian.
	 *
	 * @param {Cartesian2} cartesian The Cartesian whose absolute value is to be computed.
	 * @param {Cartesian2} result The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter.
	 */
	Cartesian2.abs = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Math.abs(cartesian.x);
	  result.y = Math.abs(cartesian.y);
	  return result;
	};

	const lerpScratch = new Cartesian2();
	/**
	 * Computes the linear interpolation or extrapolation at t using the provided cartesians.
	 *
	 * @param {Cartesian2} start The value corresponding to t at 0.0.
	 * @param {Cartesian2} end The value corresponding to t at 1.0.
	 * @param {number} t The point along t at which to interpolate.
	 * @param {Cartesian2} result The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter.
	 */
	Cartesian2.lerp = function (start, end, t, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("start", start);
	  Check.typeOf.object("end", end);
	  Check.typeOf.number("t", t);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  Cartesian2.multiplyByScalar(end, t, lerpScratch);
	  result = Cartesian2.multiplyByScalar(start, 1.0 - t, result);
	  return Cartesian2.add(lerpScratch, result, result);
	};

	const angleBetweenScratch = new Cartesian2();
	const angleBetweenScratch2 = new Cartesian2();
	/**
	 * Returns the angle, in radians, between the provided Cartesians.
	 *
	 * @param {Cartesian2} left The first Cartesian.
	 * @param {Cartesian2} right The second Cartesian.
	 * @returns {number} The angle between the Cartesians.
	 */
	Cartesian2.angleBetween = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  Cartesian2.normalize(left, angleBetweenScratch);
	  Cartesian2.normalize(right, angleBetweenScratch2);
	  return CesiumMath.acosClamped(
	    Cartesian2.dot(angleBetweenScratch, angleBetweenScratch2),
	  );
	};

	const mostOrthogonalAxisScratch = new Cartesian2();
	/**
	 * Returns the axis that is most orthogonal to the provided Cartesian.
	 *
	 * @param {Cartesian2} cartesian The Cartesian on which to find the most orthogonal axis.
	 * @param {Cartesian2} result The object onto which to store the result.
	 * @returns {Cartesian2} The most orthogonal axis.
	 */
	Cartesian2.mostOrthogonalAxis = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  const f = Cartesian2.normalize(cartesian, mostOrthogonalAxisScratch);
	  Cartesian2.abs(f, f);

	  if (f.x <= f.y) {
	    result = Cartesian2.clone(Cartesian2.UNIT_X, result);
	  } else {
	    result = Cartesian2.clone(Cartesian2.UNIT_Y, result);
	  }

	  return result;
	};

	/**
	 * Compares the provided Cartesians componentwise and returns
	 * <code>true</code> if they are equal, <code>false</code> otherwise.
	 *
	 * @param {Cartesian2} [left] The first Cartesian.
	 * @param {Cartesian2} [right] The second Cartesian.
	 * @returns {boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
	 */
	Cartesian2.equals = function (left, right) {
	  return (
	    left === right ||
	    (defined(left) &&
	      defined(right) &&
	      left.x === right.x &&
	      left.y === right.y)
	  );
	};

	/**
	 * @private
	 */
	Cartesian2.equalsArray = function (cartesian, array, offset) {
	  return cartesian.x === array[offset] && cartesian.y === array[offset + 1];
	};

	/**
	 * Compares the provided Cartesians componentwise and returns
	 * <code>true</code> if they pass an absolute or relative tolerance test,
	 * <code>false</code> otherwise.
	 *
	 * @param {Cartesian2} [left] The first Cartesian.
	 * @param {Cartesian2} [right] The second Cartesian.
	 * @param {number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
	 * @param {number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
	 * @returns {boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
	 */
	Cartesian2.equalsEpsilon = function (
	  left,
	  right,
	  relativeEpsilon,
	  absoluteEpsilon,
	) {
	  return (
	    left === right ||
	    (defined(left) &&
	      defined(right) &&
	      CesiumMath.equalsEpsilon(
	        left.x,
	        right.x,
	        relativeEpsilon,
	        absoluteEpsilon,
	      ) &&
	      CesiumMath.equalsEpsilon(
	        left.y,
	        right.y,
	        relativeEpsilon,
	        absoluteEpsilon,
	      ))
	  );
	};

	/**
	 * An immutable Cartesian2 instance initialized to (0.0, 0.0).
	 *
	 * @type {Cartesian2}
	 * @constant
	 */
	Cartesian2.ZERO = Object.freeze(new Cartesian2(0.0, 0.0));

	/**
	 * An immutable Cartesian2 instance initialized to (1.0, 1.0).
	 *
	 * @type {Cartesian2}
	 * @constant
	 */
	Cartesian2.ONE = Object.freeze(new Cartesian2(1.0, 1.0));

	/**
	 * An immutable Cartesian2 instance initialized to (1.0, 0.0).
	 *
	 * @type {Cartesian2}
	 * @constant
	 */
	Cartesian2.UNIT_X = Object.freeze(new Cartesian2(1.0, 0.0));

	/**
	 * An immutable Cartesian2 instance initialized to (0.0, 1.0).
	 *
	 * @type {Cartesian2}
	 * @constant
	 */
	Cartesian2.UNIT_Y = Object.freeze(new Cartesian2(0.0, 1.0));

	/**
	 * Duplicates this Cartesian2 instance.
	 *
	 * @param {Cartesian2} [result] The object onto which to store the result.
	 * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if one was not provided.
	 */
	Cartesian2.prototype.clone = function (result) {
	  return Cartesian2.clone(this, result);
	};

	/**
	 * Compares this Cartesian against the provided Cartesian componentwise and returns
	 * <code>true</code> if they are equal, <code>false</code> otherwise.
	 *
	 * @param {Cartesian2} [right] The right hand side Cartesian.
	 * @returns {boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
	 */
	Cartesian2.prototype.equals = function (right) {
	  return Cartesian2.equals(this, right);
	};

	/**
	 * Compares this Cartesian against the provided Cartesian componentwise and returns
	 * <code>true</code> if they pass an absolute or relative tolerance test,
	 * <code>false</code> otherwise.
	 *
	 * @param {Cartesian2} [right] The right hand side Cartesian.
	 * @param {number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
	 * @param {number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
	 * @returns {boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
	 */
	Cartesian2.prototype.equalsEpsilon = function (
	  right,
	  relativeEpsilon,
	  absoluteEpsilon,
	) {
	  return Cartesian2.equalsEpsilon(
	    this,
	    right,
	    relativeEpsilon,
	    absoluteEpsilon,
	  );
	};

	/**
	 * Creates a string representing this Cartesian in the format '(x, y)'.
	 *
	 * @returns {string} A string representing the provided Cartesian in the format '(x, y)'.
	 */
	Cartesian2.prototype.toString = function () {
	  return `(${this.x}, ${this.y})`;
	};

	// import BoundingSphere from "./BoundingSphere.js";
	// import Cartesian2 from "./Cartesian2.js";
	// import Plane from "./Plane.js";
	// import Rectangle from "./Rectangle.js";

	/**
	 * Creates an instance of an OrientedBoundingBox.
	 * An OrientedBoundingBox of some object is a closed and convex rectangular cuboid. It can provide a tighter bounding volume than {@link BoundingSphere} or {@link AxisAlignedBoundingBox} in many cases.
	 * @alias OrientedBoundingBox
	 * @constructor
	 *
	 * @param {Cartesian3} [center=Cartesian3.ZERO] The center of the box.
	 * @param {Matrix3} [halfAxes=Matrix3.ZERO] The three orthogonal half-axes of the bounding box.
	 *                                          Equivalently, the transformation matrix, to rotate and scale a 2x2x2
	 *                                          cube centered at the origin.
	 *
	 *
	 * @example
	 * // Create an OrientedBoundingBox using a transformation matrix, a position where the box will be translated, and a scale.
	 * const center = new Cesium.Cartesian3(1.0, 0.0, 0.0);
	 * const halfAxes = Cesium.Matrix3.fromScale(new Cesium.Cartesian3(1.0, 3.0, 2.0), new Cesium.Matrix3());
	 *
	 * const obb = new Cesium.OrientedBoundingBox(center, halfAxes);
	 *
	 * @see BoundingSphere
	 * @see BoundingRectangle
	 */
	function OrientedBoundingBox(center, halfAxes) {
	  /**
	   * The center of the box.
	   * @type {Cartesian3}
	   * @default {@link Cartesian3.ZERO}
	   */
	  this.center = Cartesian3.clone(defaultValue(center, Cartesian3.ZERO));
	  /**
	   * The three orthogonal half-axes of the bounding box. Equivalently, the
	   * transformation matrix, to rotate and scale a 2x2x2 cube centered at the
	   * origin.
	   * @type {Matrix3}
	   * @default {@link Matrix3.ZERO}
	   */
	  this.halfAxes = Matrix3.clone(defaultValue(halfAxes, Matrix3.ZERO));
	}

	/**
	 * The number of elements used to pack the object into an array.
	 * @type {number}
	 */
	OrientedBoundingBox.packedLength =
	  Cartesian3.packedLength + Matrix3.packedLength;

	/**
	 * Stores the provided instance into the provided array.
	 *
	 * @param {OrientedBoundingBox} value The value to pack.
	 * @param {number[]} array The array to pack into.
	 * @param {number} [startingIndex=0] The index into the array at which to start packing the elements.
	 *
	 * @returns {number[]} The array that was packed into
	 */
	OrientedBoundingBox.pack = function (value, array, startingIndex) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("value", value);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);

	  Cartesian3.pack(value.center, array, startingIndex);
	  Matrix3.pack(value.halfAxes, array, startingIndex + Cartesian3.packedLength);

	  return array;
	};

	/**
	 * Retrieves an instance from a packed array.
	 *
	 * @param {number[]} array The packed array.
	 * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
	 * @param {OrientedBoundingBox} [result] The object into which to store the result.
	 * @returns {OrientedBoundingBox} The modified result parameter or a new OrientedBoundingBox instance if one was not provided.
	 */
	OrientedBoundingBox.unpack = function (array, startingIndex, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);

	  if (!defined(result)) {
	    result = new OrientedBoundingBox();
	  }

	  Cartesian3.unpack(array, startingIndex, result.center);
	  Matrix3.unpack(
	    array,
	    startingIndex + Cartesian3.packedLength,
	    result.halfAxes,
	  );
	  return result;
	};

	const scratchCartesian1 = new Cartesian3();
	const scratchCartesian2 = new Cartesian3();
	const scratchCartesian3 = new Cartesian3();
	const scratchCartesian4 = new Cartesian3();
	const scratchCartesian5 = new Cartesian3();
	const scratchCartesian6 = new Cartesian3();
	const scratchCovarianceResult = new Matrix3();
	const scratchEigenResult = {
	  unitary: new Matrix3(),
	  diagonal: new Matrix3(),
	};

	/**
	 * Computes an instance of an OrientedBoundingBox of the given positions.
	 * This is an implementation of Stefan Gottschalk's Collision Queries using Oriented Bounding Boxes solution (PHD thesis).
	 * Reference: http://gamma.cs.unc.edu/users/gottschalk/main.pdf
	 *
	 * @param {Cartesian3[]} [positions] List of {@link Cartesian3} points that the bounding box will enclose.
	 * @param {OrientedBoundingBox} [result] The object onto which to store the result.
	 * @returns {OrientedBoundingBox} The modified result parameter or a new OrientedBoundingBox instance if one was not provided.
	 *
	 * @example
	 * // Compute an object oriented bounding box enclosing two points.
	 * const box = Cesium.OrientedBoundingBox.fromPoints([new Cesium.Cartesian3(2, 0, 0), new Cesium.Cartesian3(-2, 0, 0)]);
	 */
	OrientedBoundingBox.fromPoints = function (positions, result) {
	  if (!defined(result)) {
	    result = new OrientedBoundingBox();
	  }

	  if (!defined(positions) || positions.length === 0) {
	    result.halfAxes = Matrix3.ZERO;
	    result.center = Cartesian3.ZERO;
	    return result;
	  }

	  let i;
	  const length = positions.length;

	  const meanPoint = Cartesian3.clone(positions[0], scratchCartesian1);
	  for (i = 1; i < length; i++) {
	    Cartesian3.add(meanPoint, positions[i], meanPoint);
	  }
	  const invLength = 1.0 / length;
	  Cartesian3.multiplyByScalar(meanPoint, invLength, meanPoint);

	  let exx = 0.0;
	  let exy = 0.0;
	  let exz = 0.0;
	  let eyy = 0.0;
	  let eyz = 0.0;
	  let ezz = 0.0;
	  let p;

	  for (i = 0; i < length; i++) {
	    p = Cartesian3.subtract(positions[i], meanPoint, scratchCartesian2);
	    exx += p.x * p.x;
	    exy += p.x * p.y;
	    exz += p.x * p.z;
	    eyy += p.y * p.y;
	    eyz += p.y * p.z;
	    ezz += p.z * p.z;
	  }

	  exx *= invLength;
	  exy *= invLength;
	  exz *= invLength;
	  eyy *= invLength;
	  eyz *= invLength;
	  ezz *= invLength;

	  const covarianceMatrix = scratchCovarianceResult;
	  covarianceMatrix[0] = exx;
	  covarianceMatrix[1] = exy;
	  covarianceMatrix[2] = exz;
	  covarianceMatrix[3] = exy;
	  covarianceMatrix[4] = eyy;
	  covarianceMatrix[5] = eyz;
	  covarianceMatrix[6] = exz;
	  covarianceMatrix[7] = eyz;
	  covarianceMatrix[8] = ezz;

	  const eigenDecomposition = Matrix3.computeEigenDecomposition(
	    covarianceMatrix,
	    scratchEigenResult,
	  );
	  const rotation = Matrix3.clone(eigenDecomposition.unitary, result.halfAxes);

	  let v1 = Matrix3.getColumn(rotation, 0, scratchCartesian4);
	  let v2 = Matrix3.getColumn(rotation, 1, scratchCartesian5);
	  let v3 = Matrix3.getColumn(rotation, 2, scratchCartesian6);

	  let u1 = -Number.MAX_VALUE;
	  let u2 = -Number.MAX_VALUE;
	  let u3 = -Number.MAX_VALUE;
	  let l1 = Number.MAX_VALUE;
	  let l2 = Number.MAX_VALUE;
	  let l3 = Number.MAX_VALUE;

	  for (i = 0; i < length; i++) {
	    p = positions[i];
	    u1 = Math.max(Cartesian3.dot(v1, p), u1);
	    u2 = Math.max(Cartesian3.dot(v2, p), u2);
	    u3 = Math.max(Cartesian3.dot(v3, p), u3);

	    l1 = Math.min(Cartesian3.dot(v1, p), l1);
	    l2 = Math.min(Cartesian3.dot(v2, p), l2);
	    l3 = Math.min(Cartesian3.dot(v3, p), l3);
	  }

	  v1 = Cartesian3.multiplyByScalar(v1, 0.5 * (l1 + u1), v1);
	  v2 = Cartesian3.multiplyByScalar(v2, 0.5 * (l2 + u2), v2);
	  v3 = Cartesian3.multiplyByScalar(v3, 0.5 * (l3 + u3), v3);

	  const center = Cartesian3.add(v1, v2, result.center);
	  Cartesian3.add(center, v3, center);

	  const scale = scratchCartesian3;
	  scale.x = u1 - l1;
	  scale.y = u2 - l2;
	  scale.z = u3 - l3;
	  Cartesian3.multiplyByScalar(scale, 0.5, scale);
	  Matrix3.multiplyByScale(result.halfAxes, scale, result.halfAxes);

	  return result;
	};

	// const scratchOffset = new Cartesian3();
	// const scratchScale = new Cartesian3();
	// function fromPlaneExtents(
	//   planeOrigin,
	//   planeXAxis,
	//   planeYAxis,
	//   planeZAxis,
	//   minimumX,
	//   maximumX,
	//   minimumY,
	//   maximumY,
	//   minimumZ,
	//   maximumZ,
	//   result,
	// ) {
	//   //>>includeStart('debug', pragmas.debug);
	//   if (
	//     !defined(minimumX) ||
	//     !defined(maximumX) ||
	//     !defined(minimumY) ||
	//     !defined(maximumY) ||
	//     !defined(minimumZ) ||
	//     !defined(maximumZ)
	//   ) {
	//     throw new DeveloperError(
	//       "all extents (minimum/maximum X/Y/Z) are required.",
	//     );
	//   }
	//   //>>includeEnd('debug');

	//   if (!defined(result)) {
	//     result = new OrientedBoundingBox();
	//   }

	//   const halfAxes = result.halfAxes;
	//   Matrix3.setColumn(halfAxes, 0, planeXAxis, halfAxes);
	//   Matrix3.setColumn(halfAxes, 1, planeYAxis, halfAxes);
	//   Matrix3.setColumn(halfAxes, 2, planeZAxis, halfAxes);

	//   let centerOffset = scratchOffset;
	//   centerOffset.x = (minimumX + maximumX) / 2.0;
	//   centerOffset.y = (minimumY + maximumY) / 2.0;
	//   centerOffset.z = (minimumZ + maximumZ) / 2.0;

	//   const scale = scratchScale;
	//   scale.x = (maximumX - minimumX) / 2.0;
	//   scale.y = (maximumY - minimumY) / 2.0;
	//   scale.z = (maximumZ - minimumZ) / 2.0;

	//   const center = result.center;
	//   centerOffset = Matrix3.multiplyByVector(halfAxes, centerOffset, centerOffset);
	//   Cartesian3.add(planeOrigin, centerOffset, center);
	//   Matrix3.multiplyByScale(halfAxes, scale, halfAxes);

	//   return result;
	// }

	// const scratchRectangleCenterCartographic = new Cartographic();
	// const scratchRectangleCenter = new Cartesian3();
	// const scratchPerimeterCartographicNC = new Cartographic();
	// const scratchPerimeterCartographicNW = new Cartographic();
	// const scratchPerimeterCartographicCW = new Cartographic();
	// const scratchPerimeterCartographicSW = new Cartographic();
	// const scratchPerimeterCartographicSC = new Cartographic();
	// const scratchPerimeterCartesianNC = new Cartesian3();
	// const scratchPerimeterCartesianNW = new Cartesian3();
	// const scratchPerimeterCartesianCW = new Cartesian3();
	// const scratchPerimeterCartesianSW = new Cartesian3();
	// const scratchPerimeterCartesianSC = new Cartesian3();
	// const scratchPerimeterProjectedNC = new Cartesian2();
	// const scratchPerimeterProjectedNW = new Cartesian2();
	// const scratchPerimeterProjectedCW = new Cartesian2();
	// const scratchPerimeterProjectedSW = new Cartesian2();
	// const scratchPerimeterProjectedSC = new Cartesian2();

	// const scratchPlaneOrigin = new Cartesian3();
	// const scratchPlaneNormal = new Cartesian3();
	// const scratchPlaneXAxis = new Cartesian3();
	// const scratchHorizonCartesian = new Cartesian3();
	// const scratchHorizonProjected = new Cartesian2();
	// const scratchMaxY = new Cartesian3();
	// const scratchMinY = new Cartesian3();
	// const scratchZ = new Cartesian3();
	// const scratchPlane = new Plane(Cartesian3.UNIT_X, 0.0);

	/**
	 * Computes an OrientedBoundingBox that bounds a {@link Rectangle} on the surface of an {@link Ellipsoid}.
	 * There are no guarantees about the orientation of the bounding box.
	 *
	 * @param {Rectangle} rectangle The cartographic rectangle on the surface of the ellipsoid.
	 * @param {number} [minimumHeight=0.0] The minimum height (elevation) within the tile.
	 * @param {number} [maximumHeight=0.0] The maximum height (elevation) within the tile.
	 * @param {Ellipsoid} [ellipsoid=Ellipsoid.default] The ellipsoid on which the rectangle is defined.
	 * @param {OrientedBoundingBox} [result] The object onto which to store the result.
	 * @returns {OrientedBoundingBox} The modified result parameter or a new OrientedBoundingBox instance if none was provided.
	 *
	 * @exception {DeveloperError} rectangle.width must be between 0 and 2 * pi.
	 * @exception {DeveloperError} rectangle.height must be between 0 and pi.
	 * @exception {DeveloperError} ellipsoid must be an ellipsoid of revolution (<code>radii.x == radii.y</code>)
	 */
	// OrientedBoundingBox.fromRectangle = function (
	//   rectangle,
	//   minimumHeight,
	//   maximumHeight,
	//   ellipsoid,
	//   result,
	// ) {
	//   //>>includeStart('debug', pragmas.debug);
	//   if (!defined(rectangle)) {
	//     throw new DeveloperError("rectangle is required");
	//   }
	//   if (rectangle.width < 0.0 || rectangle.width > CesiumMath.TWO_PI) {
	//     throw new DeveloperError("Rectangle width must be between 0 and 2 * pi");
	//   }
	//   if (rectangle.height < 0.0 || rectangle.height > CesiumMath.PI) {
	//     throw new DeveloperError("Rectangle height must be between 0 and pi");
	//   }
	//   if (
	//     defined(ellipsoid) &&
	//     !CesiumMath.equalsEpsilon(
	//       ellipsoid.radii.x,
	//       ellipsoid.radii.y,
	//       CesiumMath.EPSILON15,
	//     )
	//   ) {
	//     throw new DeveloperError(
	//       "Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y)",
	//     );
	//   }
	//   //>>includeEnd('debug');

	//   minimumHeight = defaultValue(minimumHeight, 0.0);
	//   maximumHeight = defaultValue(maximumHeight, 0.0);
	//   ellipsoid = defaultValue(ellipsoid, Ellipsoid.default);

	//   let minX, maxX, minY, maxY, minZ, maxZ, plane;

	//   if (rectangle.width <= CesiumMath.PI) {
	//     // The bounding box will be aligned with the tangent plane at the center of the rectangle.
	//     const tangentPointCartographic = Rectangle.center(
	//       rectangle,
	//       scratchRectangleCenterCartographic,
	//     );
	//     const tangentPoint = ellipsoid.cartographicToCartesian(
	//       tangentPointCartographic,
	//       scratchRectangleCenter,
	//     );
	//     const tangentPlane = new EllipsoidTangentPlane(tangentPoint, ellipsoid);
	//     plane = tangentPlane.plane;

	//     // If the rectangle spans the equator, CW is instead aligned with the equator (because it sticks out the farthest at the equator).
	//     const lonCenter = tangentPointCartographic.longitude;
	//     const latCenter =
	//       rectangle.south < 0.0 && rectangle.north > 0.0
	//         ? 0.0
	//         : tangentPointCartographic.latitude;

	//     // Compute XY extents using the rectangle at maximum height
	//     const perimeterCartographicNC = Cartographic.fromRadians(
	//       lonCenter,
	//       rectangle.north,
	//       maximumHeight,
	//       scratchPerimeterCartographicNC,
	//     );
	//     const perimeterCartographicNW = Cartographic.fromRadians(
	//       rectangle.west,
	//       rectangle.north,
	//       maximumHeight,
	//       scratchPerimeterCartographicNW,
	//     );
	//     const perimeterCartographicCW = Cartographic.fromRadians(
	//       rectangle.west,
	//       latCenter,
	//       maximumHeight,
	//       scratchPerimeterCartographicCW,
	//     );
	//     const perimeterCartographicSW = Cartographic.fromRadians(
	//       rectangle.west,
	//       rectangle.south,
	//       maximumHeight,
	//       scratchPerimeterCartographicSW,
	//     );
	//     const perimeterCartographicSC = Cartographic.fromRadians(
	//       lonCenter,
	//       rectangle.south,
	//       maximumHeight,
	//       scratchPerimeterCartographicSC,
	//     );

	//     const perimeterCartesianNC = ellipsoid.cartographicToCartesian(
	//       perimeterCartographicNC,
	//       scratchPerimeterCartesianNC,
	//     );
	//     let perimeterCartesianNW = ellipsoid.cartographicToCartesian(
	//       perimeterCartographicNW,
	//       scratchPerimeterCartesianNW,
	//     );
	//     const perimeterCartesianCW = ellipsoid.cartographicToCartesian(
	//       perimeterCartographicCW,
	//       scratchPerimeterCartesianCW,
	//     );
	//     let perimeterCartesianSW = ellipsoid.cartographicToCartesian(
	//       perimeterCartographicSW,
	//       scratchPerimeterCartesianSW,
	//     );
	//     const perimeterCartesianSC = ellipsoid.cartographicToCartesian(
	//       perimeterCartographicSC,
	//       scratchPerimeterCartesianSC,
	//     );

	//     const perimeterProjectedNC = tangentPlane.projectPointToNearestOnPlane(
	//       perimeterCartesianNC,
	//       scratchPerimeterProjectedNC,
	//     );
	//     const perimeterProjectedNW = tangentPlane.projectPointToNearestOnPlane(
	//       perimeterCartesianNW,
	//       scratchPerimeterProjectedNW,
	//     );
	//     const perimeterProjectedCW = tangentPlane.projectPointToNearestOnPlane(
	//       perimeterCartesianCW,
	//       scratchPerimeterProjectedCW,
	//     );
	//     const perimeterProjectedSW = tangentPlane.projectPointToNearestOnPlane(
	//       perimeterCartesianSW,
	//       scratchPerimeterProjectedSW,
	//     );
	//     const perimeterProjectedSC = tangentPlane.projectPointToNearestOnPlane(
	//       perimeterCartesianSC,
	//       scratchPerimeterProjectedSC,
	//     );

	//     minX = Math.min(
	//       perimeterProjectedNW.x,
	//       perimeterProjectedCW.x,
	//       perimeterProjectedSW.x,
	//     );
	//     maxX = -minX; // symmetrical

	//     maxY = Math.max(perimeterProjectedNW.y, perimeterProjectedNC.y);
	//     minY = Math.min(perimeterProjectedSW.y, perimeterProjectedSC.y);

	//     // Compute minimum Z using the rectangle at minimum height, since it will be deeper than the maximum height
	//     perimeterCartographicNW.height = perimeterCartographicSW.height =
	//       minimumHeight;
	//     perimeterCartesianNW = ellipsoid.cartographicToCartesian(
	//       perimeterCartographicNW,
	//       scratchPerimeterCartesianNW,
	//     );
	//     perimeterCartesianSW = ellipsoid.cartographicToCartesian(
	//       perimeterCartographicSW,
	//       scratchPerimeterCartesianSW,
	//     );

	//     minZ = Math.min(
	//       Plane.getPointDistance(plane, perimeterCartesianNW),
	//       Plane.getPointDistance(plane, perimeterCartesianSW),
	//     );
	//     maxZ = maximumHeight; // Since the tangent plane touches the surface at height = 0, this is okay

	//     return fromPlaneExtents(
	//       tangentPlane.origin,
	//       tangentPlane.xAxis,
	//       tangentPlane.yAxis,
	//       tangentPlane.zAxis,
	//       minX,
	//       maxX,
	//       minY,
	//       maxY,
	//       minZ,
	//       maxZ,
	//       result,
	//     );
	//   }

	//   // Handle the case where rectangle width is greater than PI (wraps around more than half the ellipsoid).
	//   const fullyAboveEquator = rectangle.south > 0.0;
	//   const fullyBelowEquator = rectangle.north < 0.0;
	//   const latitudeNearestToEquator = fullyAboveEquator
	//     ? rectangle.south
	//     : fullyBelowEquator
	//       ? rectangle.north
	//       : 0.0;
	//   const centerLongitude = Rectangle.center(
	//     rectangle,
	//     scratchRectangleCenterCartographic,
	//   ).longitude;

	//   // Plane is located at the rectangle's center longitude and the rectangle's latitude that is closest to the equator. It rotates around the Z axis.
	//   // This results in a better fit than the obb approach for smaller rectangles, which orients with the rectangle's center normal.
	//   const planeOrigin = Cartesian3.fromRadians(
	//     centerLongitude,
	//     latitudeNearestToEquator,
	//     maximumHeight,
	//     ellipsoid,
	//     scratchPlaneOrigin,
	//   );
	//   planeOrigin.z = 0.0; // center the plane on the equator to simpify plane normal calculation
	//   const isPole =
	//     Math.abs(planeOrigin.x) < CesiumMath.EPSILON10 &&
	//     Math.abs(planeOrigin.y) < CesiumMath.EPSILON10;
	//   const planeNormal = !isPole
	//     ? Cartesian3.normalize(planeOrigin, scratchPlaneNormal)
	//     : Cartesian3.UNIT_X;
	//   const planeYAxis = Cartesian3.UNIT_Z;
	//   const planeXAxis = Cartesian3.cross(
	//     planeNormal,
	//     planeYAxis,
	//     scratchPlaneXAxis,
	//   );
	//   plane = Plane.fromPointNormal(planeOrigin, planeNormal, scratchPlane);

	//   // Get the horizon point relative to the center. This will be the farthest extent in the plane's X dimension.
	//   const horizonCartesian = Cartesian3.fromRadians(
	//     centerLongitude + CesiumMath.PI_OVER_TWO,
	//     latitudeNearestToEquator,
	//     maximumHeight,
	//     ellipsoid,
	//     scratchHorizonCartesian,
	//   );
	//   maxX = Cartesian3.dot(
	//     Plane.projectPointOntoPlane(
	//       plane,
	//       horizonCartesian,
	//       scratchHorizonProjected,
	//     ),
	//     planeXAxis,
	//   );
	//   minX = -maxX; // symmetrical

	//   // Get the min and max Y, using the height that will give the largest extent
	//   maxY = Cartesian3.fromRadians(
	//     0.0,
	//     rectangle.north,
	//     fullyBelowEquator ? minimumHeight : maximumHeight,
	//     ellipsoid,
	//     scratchMaxY,
	//   ).z;
	//   minY = Cartesian3.fromRadians(
	//     0.0,
	//     rectangle.south,
	//     fullyAboveEquator ? minimumHeight : maximumHeight,
	//     ellipsoid,
	//     scratchMinY,
	//   ).z;

	//   const farZ = Cartesian3.fromRadians(
	//     rectangle.east,
	//     latitudeNearestToEquator,
	//     maximumHeight,
	//     ellipsoid,
	//     scratchZ,
	//   );
	//   minZ = Plane.getPointDistance(plane, farZ);
	//   maxZ = 0.0; // plane origin starts at maxZ already

	//   // min and max are local to the plane axes
	//   return fromPlaneExtents(
	//     planeOrigin,
	//     planeXAxis,
	//     planeYAxis,
	//     planeNormal,
	//     minX,
	//     maxX,
	//     minY,
	//     maxY,
	//     minZ,
	//     maxZ,
	//     result,
	//   );
	// };

	/**
	 * Computes an OrientedBoundingBox that bounds an affine transformation.
	 *
	 * @param {Matrix4} transformation The affine transformation.
	 * @param {OrientedBoundingBox} [result] The object onto which to store the result.
	 * @returns {OrientedBoundingBox} The modified result parameter or a new OrientedBoundingBox instance if none was provided.
	 */
	// OrientedBoundingBox.fromTransformation = function (transformation, result) {
	//   //>>includeStart('debug', pragmas.debug);
	//   Check.typeOf.object("transformation", transformation);
	//   //>>includeEnd('debug');

	//   if (!defined(result)) {
	//     result = new OrientedBoundingBox();
	//   }

	//   result.center = Matrix4.getTranslation(transformation, result.center);
	//   result.halfAxes = Matrix4.getMatrix3(transformation, result.halfAxes);
	//   result.halfAxes = Matrix3.multiplyByScalar(
	//     result.halfAxes,
	//     0.5,
	//     result.halfAxes,
	//   );
	//   return result;
	// };

	/**
	 * Duplicates a OrientedBoundingBox instance.
	 *
	 * @param {OrientedBoundingBox} box The bounding box to duplicate.
	 * @param {OrientedBoundingBox} [result] The object onto which to store the result.
	 * @returns {OrientedBoundingBox} The modified result parameter or a new OrientedBoundingBox instance if none was provided. (Returns undefined if box is undefined)
	 */
	OrientedBoundingBox.clone = function (box, result) {
	  if (!defined(box)) {
	    return undefined;
	  }

	  if (!defined(result)) {
	    return new OrientedBoundingBox(box.center, box.halfAxes);
	  }

	  Cartesian3.clone(box.center, result.center);
	  Matrix3.clone(box.halfAxes, result.halfAxes);

	  return result;
	};

	/**
	 * Determines which side of a plane the oriented bounding box is located.
	 *
	 * @param {OrientedBoundingBox} box The oriented bounding box to test.
	 * @param {Plane} plane The plane to test against.
	 * @returns {Intersect} {@link Intersect.INSIDE} if the entire box is on the side of the plane
	 *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire box is
	 *                      on the opposite side, and {@link Intersect.INTERSECTING} if the box
	 *                      intersects the plane.
	 */
	// OrientedBoundingBox.intersectPlane = function (box, plane) {
	//   //>>includeStart('debug', pragmas.debug);
	//   if (!defined(box)) {
	//     throw new DeveloperError("box is required.");
	//   }

	//   if (!defined(plane)) {
	//     throw new DeveloperError("plane is required.");
	//   }
	//   //>>includeEnd('debug');

	//   const center = box.center;
	//   const normal = plane.normal;
	//   const halfAxes = box.halfAxes;
	//   const normalX = normal.x,
	//     normalY = normal.y,
	//     normalZ = normal.z;
	//   // plane is used as if it is its normal; the first three components are assumed to be normalized
	//   const radEffective =
	//     Math.abs(
	//       normalX * halfAxes[Matrix3.COLUMN0ROW0] +
	//         normalY * halfAxes[Matrix3.COLUMN0ROW1] +
	//         normalZ * halfAxes[Matrix3.COLUMN0ROW2],
	//     ) +
	//     Math.abs(
	//       normalX * halfAxes[Matrix3.COLUMN1ROW0] +
	//         normalY * halfAxes[Matrix3.COLUMN1ROW1] +
	//         normalZ * halfAxes[Matrix3.COLUMN1ROW2],
	//     ) +
	//     Math.abs(
	//       normalX * halfAxes[Matrix3.COLUMN2ROW0] +
	//         normalY * halfAxes[Matrix3.COLUMN2ROW1] +
	//         normalZ * halfAxes[Matrix3.COLUMN2ROW2],
	//     );
	//   const distanceToPlane = Cartesian3.dot(normal, center) + plane.distance;

	//   if (distanceToPlane <= -radEffective) {
	//     // The entire box is on the negative side of the plane normal
	//     return Intersect.OUTSIDE;
	//   } else if (distanceToPlane >= radEffective) {
	//     // The entire box is on the positive side of the plane normal
	//     return Intersect.INSIDE;
	//   }
	//   return Intersect.INTERSECTING;
	// };

	// const scratchCartesianU = new Cartesian3();
	// const scratchCartesianV = new Cartesian3();
	// const scratchCartesianW = new Cartesian3();
	// const scratchValidAxis2 = new Cartesian3();
	// const scratchValidAxis3 = new Cartesian3();
	// const scratchPPrime = new Cartesian3();

	/**
	 * Computes the estimated distance squared from the closest point on a bounding box to a point.
	 *
	 * @param {OrientedBoundingBox} box The box.
	 * @param {Cartesian3} cartesian The point
	 * @returns {number} The distance squared from the oriented bounding box to the point. Returns 0 if the point is inside the box.
	 *
	 * @example
	 * // Sort bounding boxes from back to front
	 * boxes.sort(function(a, b) {
	 *     return Cesium.OrientedBoundingBox.distanceSquaredTo(b, camera.positionWC) - Cesium.OrientedBoundingBox.distanceSquaredTo(a, camera.positionWC);
	 * });
	 */
	// OrientedBoundingBox.distanceSquaredTo = function (box, cartesian) {
	//   // See Geometric Tools for Computer Graphics 10.4.2

	//   //>>includeStart('debug', pragmas.debug);
	//   if (!defined(box)) {
	//     throw new DeveloperError("box is required.");
	//   }
	//   if (!defined(cartesian)) {
	//     throw new DeveloperError("cartesian is required.");
	//   }
	//   //>>includeEnd('debug');

	//   const offset = Cartesian3.subtract(cartesian, box.center, scratchOffset);

	//   const halfAxes = box.halfAxes;
	//   let u = Matrix3.getColumn(halfAxes, 0, scratchCartesianU);
	//   let v = Matrix3.getColumn(halfAxes, 1, scratchCartesianV);
	//   let w = Matrix3.getColumn(halfAxes, 2, scratchCartesianW);

	//   const uHalf = Cartesian3.magnitude(u);
	//   const vHalf = Cartesian3.magnitude(v);
	//   const wHalf = Cartesian3.magnitude(w);

	//   let uValid = true;
	//   let vValid = true;
	//   let wValid = true;

	//   if (uHalf > 0) {
	//     Cartesian3.divideByScalar(u, uHalf, u);
	//   } else {
	//     uValid = false;
	//   }

	//   if (vHalf > 0) {
	//     Cartesian3.divideByScalar(v, vHalf, v);
	//   } else {
	//     vValid = false;
	//   }

	//   if (wHalf > 0) {
	//     Cartesian3.divideByScalar(w, wHalf, w);
	//   } else {
	//     wValid = false;
	//   }

	//   const numberOfDegenerateAxes = !uValid + !vValid + !wValid;
	//   let validAxis1;
	//   let validAxis2;
	//   let validAxis3;

	//   if (numberOfDegenerateAxes === 1) {
	//     let degenerateAxis = u;
	//     validAxis1 = v;
	//     validAxis2 = w;
	//     if (!vValid) {
	//       degenerateAxis = v;
	//       validAxis1 = u;
	//     } else if (!wValid) {
	//       degenerateAxis = w;
	//       validAxis2 = u;
	//     }

	//     validAxis3 = Cartesian3.cross(validAxis1, validAxis2, scratchValidAxis3);

	//     if (degenerateAxis === u) {
	//       u = validAxis3;
	//     } else if (degenerateAxis === v) {
	//       v = validAxis3;
	//     } else if (degenerateAxis === w) {
	//       w = validAxis3;
	//     }
	//   } else if (numberOfDegenerateAxes === 2) {
	//     validAxis1 = u;
	//     if (vValid) {
	//       validAxis1 = v;
	//     } else if (wValid) {
	//       validAxis1 = w;
	//     }

	//     let crossVector = Cartesian3.UNIT_Y;
	//     if (crossVector.equalsEpsilon(validAxis1, CesiumMath.EPSILON3)) {
	//       crossVector = Cartesian3.UNIT_X;
	//     }

	//     validAxis2 = Cartesian3.cross(validAxis1, crossVector, scratchValidAxis2);
	//     Cartesian3.normalize(validAxis2, validAxis2);
	//     validAxis3 = Cartesian3.cross(validAxis1, validAxis2, scratchValidAxis3);
	//     Cartesian3.normalize(validAxis3, validAxis3);

	//     if (validAxis1 === u) {
	//       v = validAxis2;
	//       w = validAxis3;
	//     } else if (validAxis1 === v) {
	//       w = validAxis2;
	//       u = validAxis3;
	//     } else if (validAxis1 === w) {
	//       u = validAxis2;
	//       v = validAxis3;
	//     }
	//   } else if (numberOfDegenerateAxes === 3) {
	//     u = Cartesian3.UNIT_X;
	//     v = Cartesian3.UNIT_Y;
	//     w = Cartesian3.UNIT_Z;
	//   }

	//   const pPrime = scratchPPrime;
	//   pPrime.x = Cartesian3.dot(offset, u);
	//   pPrime.y = Cartesian3.dot(offset, v);
	//   pPrime.z = Cartesian3.dot(offset, w);

	//   let distanceSquared = 0.0;
	//   let d;

	//   if (pPrime.x < -uHalf) {
	//     d = pPrime.x + uHalf;
	//     distanceSquared += d * d;
	//   } else if (pPrime.x > uHalf) {
	//     d = pPrime.x - uHalf;
	//     distanceSquared += d * d;
	//   }

	//   if (pPrime.y < -vHalf) {
	//     d = pPrime.y + vHalf;
	//     distanceSquared += d * d;
	//   } else if (pPrime.y > vHalf) {
	//     d = pPrime.y - vHalf;
	//     distanceSquared += d * d;
	//   }

	//   if (pPrime.z < -wHalf) {
	//     d = pPrime.z + wHalf;
	//     distanceSquared += d * d;
	//   } else if (pPrime.z > wHalf) {
	//     d = pPrime.z - wHalf;
	//     distanceSquared += d * d;
	//   }

	//   return distanceSquared;
	// };

	// const scratchCorner = new Cartesian3();
	// const scratchToCenter = new Cartesian3();

	/**
	 * The distances calculated by the vector from the center of the bounding box to position projected onto direction.
	 * <br>
	 * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
	 * closest and farthest planes from position that intersect the bounding box.
	 *
	 * @param {OrientedBoundingBox} box The bounding box to calculate the distance to.
	 * @param {Cartesian3} position The position to calculate the distance from.
	 * @param {Cartesian3} direction The direction from position.
	 * @param {Interval} [result] A Interval to store the nearest and farthest distances.
	 * @returns {Interval} The nearest and farthest distances on the bounding box from position in direction.
	 */
	// OrientedBoundingBox.computePlaneDistances = function (
	//   box,
	//   position,
	//   direction,
	//   result,
	// ) {
	//   //>>includeStart('debug', pragmas.debug);
	//   if (!defined(box)) {
	//     throw new DeveloperError("box is required.");
	//   }

	//   if (!defined(position)) {
	//     throw new DeveloperError("position is required.");
	//   }

	//   if (!defined(direction)) {
	//     throw new DeveloperError("direction is required.");
	//   }
	//   //>>includeEnd('debug');

	//   if (!defined(result)) {
	//     result = new Interval();
	//   }

	//   let minDist = Number.POSITIVE_INFINITY;
	//   let maxDist = Number.NEGATIVE_INFINITY;

	//   const center = box.center;
	//   const halfAxes = box.halfAxes;

	//   const u = Matrix3.getColumn(halfAxes, 0, scratchCartesianU);
	//   const v = Matrix3.getColumn(halfAxes, 1, scratchCartesianV);
	//   const w = Matrix3.getColumn(halfAxes, 2, scratchCartesianW);

	//   // project first corner
	//   const corner = Cartesian3.add(u, v, scratchCorner);
	//   Cartesian3.add(corner, w, corner);
	//   Cartesian3.add(corner, center, corner);

	//   const toCenter = Cartesian3.subtract(corner, position, scratchToCenter);
	//   let mag = Cartesian3.dot(direction, toCenter);

	//   minDist = Math.min(mag, minDist);
	//   maxDist = Math.max(mag, maxDist);

	//   // project second corner
	//   Cartesian3.add(center, u, corner);
	//   Cartesian3.add(corner, v, corner);
	//   Cartesian3.subtract(corner, w, corner);

	//   Cartesian3.subtract(corner, position, toCenter);
	//   mag = Cartesian3.dot(direction, toCenter);

	//   minDist = Math.min(mag, minDist);
	//   maxDist = Math.max(mag, maxDist);

	//   // project third corner
	//   Cartesian3.add(center, u, corner);
	//   Cartesian3.subtract(corner, v, corner);
	//   Cartesian3.add(corner, w, corner);

	//   Cartesian3.subtract(corner, position, toCenter);
	//   mag = Cartesian3.dot(direction, toCenter);

	//   minDist = Math.min(mag, minDist);
	//   maxDist = Math.max(mag, maxDist);

	//   // project fourth corner
	//   Cartesian3.add(center, u, corner);
	//   Cartesian3.subtract(corner, v, corner);
	//   Cartesian3.subtract(corner, w, corner);

	//   Cartesian3.subtract(corner, position, toCenter);
	//   mag = Cartesian3.dot(direction, toCenter);

	//   minDist = Math.min(mag, minDist);
	//   maxDist = Math.max(mag, maxDist);

	//   // project fifth corner
	//   Cartesian3.subtract(center, u, corner);
	//   Cartesian3.add(corner, v, corner);
	//   Cartesian3.add(corner, w, corner);

	//   Cartesian3.subtract(corner, position, toCenter);
	//   mag = Cartesian3.dot(direction, toCenter);

	//   minDist = Math.min(mag, minDist);
	//   maxDist = Math.max(mag, maxDist);

	//   // project sixth corner
	//   Cartesian3.subtract(center, u, corner);
	//   Cartesian3.add(corner, v, corner);
	//   Cartesian3.subtract(corner, w, corner);

	//   Cartesian3.subtract(corner, position, toCenter);
	//   mag = Cartesian3.dot(direction, toCenter);

	//   minDist = Math.min(mag, minDist);
	//   maxDist = Math.max(mag, maxDist);

	//   // project seventh corner
	//   Cartesian3.subtract(center, u, corner);
	//   Cartesian3.subtract(corner, v, corner);
	//   Cartesian3.add(corner, w, corner);

	//   Cartesian3.subtract(corner, position, toCenter);
	//   mag = Cartesian3.dot(direction, toCenter);

	//   minDist = Math.min(mag, minDist);
	//   maxDist = Math.max(mag, maxDist);

	//   // project eighth corner
	//   Cartesian3.subtract(center, u, corner);
	//   Cartesian3.subtract(corner, v, corner);
	//   Cartesian3.subtract(corner, w, corner);

	//   Cartesian3.subtract(corner, position, toCenter);
	//   mag = Cartesian3.dot(direction, toCenter);

	//   minDist = Math.min(mag, minDist);
	//   maxDist = Math.max(mag, maxDist);

	//   result.start = minDist;
	//   result.stop = maxDist;
	//   return result;
	// };

	// const scratchXAxis = new Cartesian3();
	// const scratchYAxis = new Cartesian3();
	// const scratchZAxis = new Cartesian3();

	/**
	 * Computes the eight corners of an oriented bounding box. The corners are ordered by (-X, -Y, -Z), (-X, -Y, +Z), (-X, +Y, -Z), (-X, +Y, +Z), (+X, -Y, -Z), (+X, -Y, +Z), (+X, +Y, -Z), (+X, +Y, +Z).
	 *
	 * @param {OrientedBoundingBox} box The oriented bounding box.
	 * @param {Cartesian3[]} [result] An array of eight {@link Cartesian3} instances onto which to store the corners.
	 * @returns {Cartesian3[]} The modified result parameter or a new array if none was provided.
	 */
	// OrientedBoundingBox.computeCorners = function (box, result) {
	//   //>>includeStart('debug', pragmas.debug);
	//   Check.typeOf.object("box", box);
	//   //>>includeEnd('debug');

	//   if (!defined(result)) {
	//     result = [
	//       new Cartesian3(),
	//       new Cartesian3(),
	//       new Cartesian3(),
	//       new Cartesian3(),
	//       new Cartesian3(),
	//       new Cartesian3(),
	//       new Cartesian3(),
	//       new Cartesian3(),
	//     ];
	//   }

	//   const center = box.center;
	//   const halfAxes = box.halfAxes;
	//   const xAxis = Matrix3.getColumn(halfAxes, 0, scratchXAxis);
	//   const yAxis = Matrix3.getColumn(halfAxes, 1, scratchYAxis);
	//   const zAxis = Matrix3.getColumn(halfAxes, 2, scratchZAxis);

	//   Cartesian3.clone(center, result[0]);
	//   Cartesian3.subtract(result[0], xAxis, result[0]);
	//   Cartesian3.subtract(result[0], yAxis, result[0]);
	//   Cartesian3.subtract(result[0], zAxis, result[0]);

	//   Cartesian3.clone(center, result[1]);
	//   Cartesian3.subtract(result[1], xAxis, result[1]);
	//   Cartesian3.subtract(result[1], yAxis, result[1]);
	//   Cartesian3.add(result[1], zAxis, result[1]);

	//   Cartesian3.clone(center, result[2]);
	//   Cartesian3.subtract(result[2], xAxis, result[2]);
	//   Cartesian3.add(result[2], yAxis, result[2]);
	//   Cartesian3.subtract(result[2], zAxis, result[2]);

	//   Cartesian3.clone(center, result[3]);
	//   Cartesian3.subtract(result[3], xAxis, result[3]);
	//   Cartesian3.add(result[3], yAxis, result[3]);
	//   Cartesian3.add(result[3], zAxis, result[3]);

	//   Cartesian3.clone(center, result[4]);
	//   Cartesian3.add(result[4], xAxis, result[4]);
	//   Cartesian3.subtract(result[4], yAxis, result[4]);
	//   Cartesian3.subtract(result[4], zAxis, result[4]);

	//   Cartesian3.clone(center, result[5]);
	//   Cartesian3.add(result[5], xAxis, result[5]);
	//   Cartesian3.subtract(result[5], yAxis, result[5]);
	//   Cartesian3.add(result[5], zAxis, result[5]);

	//   Cartesian3.clone(center, result[6]);
	//   Cartesian3.add(result[6], xAxis, result[6]);
	//   Cartesian3.add(result[6], yAxis, result[6]);
	//   Cartesian3.subtract(result[6], zAxis, result[6]);

	//   Cartesian3.clone(center, result[7]);
	//   Cartesian3.add(result[7], xAxis, result[7]);
	//   Cartesian3.add(result[7], yAxis, result[7]);
	//   Cartesian3.add(result[7], zAxis, result[7]);

	//   return result;
	// };

	// const scratchRotationScale = new Matrix3();

	/**
	 * Computes a transformation matrix from an oriented bounding box.
	 *
	 * @param {OrientedBoundingBox} box The oriented bounding box.
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter or a new {@link Matrix4} instance if none was provided.
	 */
	// OrientedBoundingBox.computeTransformation = function (box, result) {
	//   //>>includeStart('debug', pragmas.debug);
	//   Check.typeOf.object("box", box);
	//   //>>includeEnd('debug');

	//   if (!defined(result)) {
	//     result = new Matrix4();
	//   }

	//   const translation = box.center;
	//   const rotationScale = Matrix3.multiplyByUniformScale(
	//     box.halfAxes,
	//     2.0,
	//     scratchRotationScale,
	//   );
	//   return Matrix4.fromRotationTranslation(rotationScale, translation, result);
	// };

	// const scratchBoundingSphere = new BoundingSphere();

	/**
	 * Determines whether or not a bounding box is hidden from view by the occluder.
	 *
	 * @param {OrientedBoundingBox} box The bounding box surrounding the occludee object.
	 * @param {Occluder} occluder The occluder.
	 * @returns {boolean} <code>true</code> if the box is not visible; otherwise <code>false</code>.
	 */
	// OrientedBoundingBox.isOccluded = function (box, occluder) {
	//   //>>includeStart('debug', pragmas.debug);
	//   if (!defined(box)) {
	//     throw new DeveloperError("box is required.");
	//   }
	//   if (!defined(occluder)) {
	//     throw new DeveloperError("occluder is required.");
	//   }
	//   //>>includeEnd('debug');

	//   const sphere = BoundingSphere.fromOrientedBoundingBox(
	//     box,
	//     scratchBoundingSphere,
	//   );

	//   return !occluder.isBoundingSphereVisible(sphere);
	// };

	/**
	 * Determines which side of a plane the oriented bounding box is located.
	 *
	 * @param {Plane} plane The plane to test against.
	 * @returns {Intersect} {@link Intersect.INSIDE} if the entire box is on the side of the plane
	 *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire box is
	 *                      on the opposite side, and {@link Intersect.INTERSECTING} if the box
	 *                      intersects the plane.
	 */
	// OrientedBoundingBox.prototype.intersectPlane = function (plane) {
	//   return OrientedBoundingBox.intersectPlane(this, plane);
	// };

	/**
	 * Computes the estimated distance squared from the closest point on a bounding box to a point.
	 *
	 * @param {Cartesian3} cartesian The point
	 * @returns {number} The estimated distance squared from the bounding sphere to the point.
	 *
	 * @example
	 * // Sort bounding boxes from back to front
	 * boxes.sort(function(a, b) {
	 *     return b.distanceSquaredTo(camera.positionWC) - a.distanceSquaredTo(camera.positionWC);
	 * });
	 */
	// OrientedBoundingBox.prototype.distanceSquaredTo = function (cartesian) {
	//   return OrientedBoundingBox.distanceSquaredTo(this, cartesian);
	// };

	/**
	 * The distances calculated by the vector from the center of the bounding box to position projected onto direction.
	 * <br>
	 * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
	 * closest and farthest planes from position that intersect the bounding box.
	 *
	 * @param {Cartesian3} position The position to calculate the distance from.
	 * @param {Cartesian3} direction The direction from position.
	 * @param {Interval} [result] A Interval to store the nearest and farthest distances.
	 * @returns {Interval} The nearest and farthest distances on the bounding box from position in direction.
	 */
	// OrientedBoundingBox.prototype.computePlaneDistances = function (
	//   position,
	//   direction,
	//   result,
	// ) {
	//   return OrientedBoundingBox.computePlaneDistances(
	//     this,
	//     position,
	//     direction,
	//     result,
	//   );
	// };

	/**
	 * Computes the eight corners of an oriented bounding box. The corners are ordered by (-X, -Y, -Z), (-X, -Y, +Z), (-X, +Y, -Z), (-X, +Y, +Z), (+X, -Y, -Z), (+X, -Y, +Z), (+X, +Y, -Z), (+X, +Y, +Z).
	 *
	 * @param {Cartesian3[]} [result] An array of eight {@link Cartesian3} instances onto which to store the corners.
	 * @returns {Cartesian3[]} The modified result parameter or a new array if none was provided.
	 */
	// OrientedBoundingBox.prototype.computeCorners = function (result) {
	//   return OrientedBoundingBox.computeCorners(this, result);
	// };

	/**
	 * Computes a transformation matrix from an oriented bounding box.
	 *
	 * @param {Matrix4} result The object onto which to store the result.
	 * @returns {Matrix4} The modified result parameter or a new {@link Matrix4} instance if none was provided.
	 */
	// OrientedBoundingBox.prototype.computeTransformation = function (result) {
	//   return OrientedBoundingBox.computeTransformation(this, result);
	// };

	/**
	 * Determines whether or not a bounding box is hidden from view by the occluder.
	 *
	 * @param {Occluder} occluder The occluder.
	 * @returns {boolean} <code>true</code> if the sphere is not visible; otherwise <code>false</code>.
	 */
	// OrientedBoundingBox.prototype.isOccluded = function (occluder) {
	//   return OrientedBoundingBox.isOccluded(this, occluder);
	// };

	/**
	 * Compares the provided OrientedBoundingBox componentwise and returns
	 * <code>true</code> if they are equal, <code>false</code> otherwise.
	 *
	 * @param {OrientedBoundingBox} left The first OrientedBoundingBox.
	 * @param {OrientedBoundingBox} right The second OrientedBoundingBox.
	 * @returns {boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
	 */
	OrientedBoundingBox.equals = function (left, right) {
	  return (
	    left === right ||
	    (defined(left) &&
	      defined(right) &&
	      Cartesian3.equals(left.center, right.center) &&
	      Matrix3.equals(left.halfAxes, right.halfAxes))
	  );
	};

	/**
	 * Duplicates this OrientedBoundingBox instance.
	 *
	 * @param {OrientedBoundingBox} [result] The object onto which to store the result.
	 * @returns {OrientedBoundingBox} The modified result parameter or a new OrientedBoundingBox instance if one was not provided.
	 */
	OrientedBoundingBox.prototype.clone = function (result) {
	  return OrientedBoundingBox.clone(this, result);
	};

	/**
	 * Compares this OrientedBoundingBox against the provided OrientedBoundingBox componentwise and returns
	 * <code>true</code> if they are equal, <code>false</code> otherwise.
	 *
	 * @param {OrientedBoundingBox} [right] The right hand side OrientedBoundingBox.
	 * @returns {boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
	 */
	OrientedBoundingBox.prototype.equals = function (right) {
	  return OrientedBoundingBox.equals(this, right);
	};

	/**
	 * @private
	 */
	const CoplanarPolygonGeometryLibrary = {};

	// const scratchIntersectionPoint = new Cartesian3();
	// const scratchXAxis = new Cartesian3();
	// const scratchYAxis = new Cartesian3();
	// const scratchZAxis = new Cartesian3();
	// const obbScratch = new OrientedBoundingBox();

	// CoplanarPolygonGeometryLibrary.validOutline = function (positions) {
	//   //>>includeStart('debug', pragmas.debug);
	//   Check.defined("positions", positions);
	//   //>>includeEnd('debug');

	//   const orientedBoundingBox = OrientedBoundingBox.fromPoints(
	//     positions,
	//     obbScratch,
	//   );
	//   const halfAxes = orientedBoundingBox.halfAxes;
	//   const xAxis = Matrix3.getColumn(halfAxes, 0, scratchXAxis);
	//   const yAxis = Matrix3.getColumn(halfAxes, 1, scratchYAxis);
	//   const zAxis = Matrix3.getColumn(halfAxes, 2, scratchZAxis);

	//   const xMag = Cartesian3.magnitude(xAxis);
	//   const yMag = Cartesian3.magnitude(yAxis);
	//   const zMag = Cartesian3.magnitude(zAxis);

	//   // If all the points are on a line return undefined because we can't draw a polygon
	//   return !(
	//     (xMag === 0 && (yMag === 0 || zMag === 0)) ||
	//     (yMag === 0 && zMag === 0)
	//   );
	// };

	// call after removeDuplicates
	CoplanarPolygonGeometryLibrary.computeProjectTo2DArguments = function (
	  positions,
	  centerResult,
	  planeAxis1Result,
	  planeAxis2Result,
	) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("positions", positions);
	  Check.defined("centerResult", centerResult);
	  Check.defined("planeAxis1Result", planeAxis1Result);
	  Check.defined("planeAxis2Result", planeAxis2Result);
	  //>>includeEnd('debug');

	  const orientedBoundingBox = OrientedBoundingBox.fromPoints(
	    positions,
	    obbScratch,
	  );
	  const halfAxes = orientedBoundingBox.halfAxes;
	  const xAxis = Matrix3.getColumn(halfAxes, 0, scratchXAxis);
	  const yAxis = Matrix3.getColumn(halfAxes, 1, scratchYAxis);
	  const zAxis = Matrix3.getColumn(halfAxes, 2, scratchZAxis);

	  const xMag = Cartesian3.magnitude(xAxis);
	  const yMag = Cartesian3.magnitude(yAxis);
	  const zMag = Cartesian3.magnitude(zAxis);
	  const min = Math.min(xMag, yMag, zMag);

	  // If all the points are on a line return undefined because we can't draw a polygon
	  if (
	    (xMag === 0 && (yMag === 0 || zMag === 0)) ||
	    (yMag === 0 && zMag === 0)
	  ) {
	    return false;
	  }

	  let planeAxis1;
	  let planeAxis2;

	  if (min === yMag || min === zMag) {
	    planeAxis1 = xAxis;
	  }
	  if (min === xMag) {
	    planeAxis1 = yAxis;
	  } else if (min === zMag) {
	    planeAxis2 = yAxis;
	  }
	  if (min === xMag || min === yMag) {
	    planeAxis2 = zAxis;
	  }

	  Cartesian3.normalize(planeAxis1, planeAxis1Result);
	  Cartesian3.normalize(planeAxis2, planeAxis2Result);
	  Cartesian3.clone(orientedBoundingBox.center, centerResult);
	  return true;
	};

	function projectTo2D(position, center, axis1, axis2, result) {
	  const v = Cartesian3.subtract(position, center, scratchIntersectionPoint);
	  const x = Cartesian3.dot(axis1, v);
	  const y = Cartesian3.dot(axis2, v);

	  return Cartesian2.fromElements(x, y, result);
	}

	CoplanarPolygonGeometryLibrary.createProjectPointsTo2DFunction = function (
	  center,
	  axis1,
	  axis2,
	) {
	  return function (positions) {
	    const positionResults = new Array(positions.length);
	    for (let i = 0; i < positions.length; i++) {
	      positionResults[i] = projectTo2D(positions[i], center, axis1, axis2);
	    }

	    return positionResults;
	  };
	};

	function earcut(data, holeIndices, dim = 2) {

	    const hasHoles = holeIndices && holeIndices.length;
	    const outerLen = hasHoles ? holeIndices[0] * dim : data.length;
	    let outerNode = linkedList(data, 0, outerLen, dim, true);
	    const triangles = [];

	    if (!outerNode || outerNode.next === outerNode.prev) return triangles;

	    let minX, minY, invSize;

	    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

	    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
	    if (data.length > 80 * dim) {
	        minX = Infinity;
	        minY = Infinity;
	        let maxX = -Infinity;
	        let maxY = -Infinity;

	        for (let i = dim; i < outerLen; i += dim) {
	            const x = data[i];
	            const y = data[i + 1];
	            if (x < minX) minX = x;
	            if (y < minY) minY = y;
	            if (x > maxX) maxX = x;
	            if (y > maxY) maxY = y;
	        }

	        // minX, minY and invSize are later used to transform coords into integers for z-order calculation
	        invSize = Math.max(maxX - minX, maxY - minY);
	        invSize = invSize !== 0 ? 32767 / invSize : 0;
	    }

	    earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);

	    return triangles;
	}

	// create a circular doubly linked list from polygon points in the specified winding order
	function linkedList(data, start, end, dim, clockwise) {
	    let last;

	    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
	        for (let i = start; i < end; i += dim) last = insertNode(i / dim | 0, data[i], data[i + 1], last);
	    } else {
	        for (let i = end - dim; i >= start; i -= dim) last = insertNode(i / dim | 0, data[i], data[i + 1], last);
	    }

	    if (last && equals(last, last.next)) {
	        removeNode(last);
	        last = last.next;
	    }

	    return last;
	}

	// eliminate colinear or duplicate points
	function filterPoints(start, end) {
	    if (!start) return start;
	    if (!end) end = start;

	    let p = start,
	        again;
	    do {
	        again = false;

	        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
	            removeNode(p);
	            p = end = p.prev;
	            if (p === p.next) break;
	            again = true;

	        } else {
	            p = p.next;
	        }
	    } while (again || p !== end);

	    return end;
	}

	// main ear slicing loop which triangulates a polygon (given as a linked list)
	function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
	    if (!ear) return;

	    // interlink polygon nodes in z-order
	    if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

	    let stop = ear;

	    // iterate through ears, slicing them one by one
	    while (ear.prev !== ear.next) {
	        const prev = ear.prev;
	        const next = ear.next;

	        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
	            triangles.push(prev.i, ear.i, next.i); // cut off the triangle

	            removeNode(ear);

	            // skipping the next vertex leads to less sliver triangles
	            ear = next.next;
	            stop = next.next;

	            continue;
	        }

	        ear = next;

	        // if we looped through the whole remaining polygon and can't find any more ears
	        if (ear === stop) {
	            // try filtering points and slicing again
	            if (!pass) {
	                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

	            // if this didn't work, try curing all small self-intersections locally
	            } else if (pass === 1) {
	                ear = cureLocalIntersections(filterPoints(ear), triangles);
	                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

	            // as a last resort, try splitting the remaining polygon into two
	            } else if (pass === 2) {
	                splitEarcut(ear, triangles, dim, minX, minY, invSize);
	            }

	            break;
	        }
	    }
	}

	// check whether a polygon node forms a valid ear with adjacent nodes
	function isEar(ear) {
	    const a = ear.prev,
	        b = ear,
	        c = ear.next;

	    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

	    // now make sure we don't have other points inside the potential ear
	    const ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;

	    // triangle bbox; min & max are calculated like this for speed
	    const x0 = ax < bx ? (ax < cx ? ax : cx) : (bx < cx ? bx : cx),
	        y0 = ay < by ? (ay < cy ? ay : cy) : (by < cy ? by : cy),
	        x1 = ax > bx ? (ax > cx ? ax : cx) : (bx > cx ? bx : cx),
	        y1 = ay > by ? (ay > cy ? ay : cy) : (by > cy ? by : cy);

	    let p = c.next;
	    while (p !== a) {
	        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) &&
	            area(p.prev, p, p.next) >= 0) return false;
	        p = p.next;
	    }

	    return true;
	}

	function isEarHashed(ear, minX, minY, invSize) {
	    const a = ear.prev,
	        b = ear,
	        c = ear.next;

	    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

	    const ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;

	    // triangle bbox; min & max are calculated like this for speed
	    const x0 = ax < bx ? (ax < cx ? ax : cx) : (bx < cx ? bx : cx),
	        y0 = ay < by ? (ay < cy ? ay : cy) : (by < cy ? by : cy),
	        x1 = ax > bx ? (ax > cx ? ax : cx) : (bx > cx ? bx : cx),
	        y1 = ay > by ? (ay > cy ? ay : cy) : (by > cy ? by : cy);

	    // z-order range for the current triangle bbox;
	    const minZ = zOrder(x0, y0, minX, minY, invSize),
	        maxZ = zOrder(x1, y1, minX, minY, invSize);

	    let p = ear.prevZ,
	        n = ear.nextZ;

	    // look for points inside the triangle in both directions
	    while (p && p.z >= minZ && n && n.z <= maxZ) {
	        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
	        p = p.prevZ;

	        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
	        n = n.nextZ;
	    }

	    // look for remaining points in decreasing z-order
	    while (p && p.z >= minZ) {
	        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
	        p = p.prevZ;
	    }

	    // look for remaining points in increasing z-order
	    while (n && n.z <= maxZ) {
	        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
	        n = n.nextZ;
	    }

	    return true;
	}

	// go through all polygon nodes and cure small local self-intersections
	function cureLocalIntersections(start, triangles) {
	    let p = start;
	    do {
	        const a = p.prev,
	            b = p.next.next;

	        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

	            triangles.push(a.i, p.i, b.i);

	            // remove two nodes involved
	            removeNode(p);
	            removeNode(p.next);

	            p = start = b;
	        }
	        p = p.next;
	    } while (p !== start);

	    return filterPoints(p);
	}

	// try splitting polygon into two and triangulate them independently
	function splitEarcut(start, triangles, dim, minX, minY, invSize) {
	    // look for a valid diagonal that divides the polygon into two
	    let a = start;
	    do {
	        let b = a.next.next;
	        while (b !== a.prev) {
	            if (a.i !== b.i && isValidDiagonal(a, b)) {
	                // split the polygon in two by the diagonal
	                let c = splitPolygon(a, b);

	                // filter colinear points around the cuts
	                a = filterPoints(a, a.next);
	                c = filterPoints(c, c.next);

	                // run earcut on each half
	                earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
	                earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
	                return;
	            }
	            b = b.next;
	        }
	        a = a.next;
	    } while (a !== start);
	}

	// link every hole into the outer loop, producing a single-ring polygon without holes
	function eliminateHoles(data, holeIndices, outerNode, dim) {
	    const queue = [];

	    for (let i = 0, len = holeIndices.length; i < len; i++) {
	        const start = holeIndices[i] * dim;
	        const end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
	        const list = linkedList(data, start, end, dim, false);
	        if (list === list.next) list.steiner = true;
	        queue.push(getLeftmost(list));
	    }

	    queue.sort(compareX);

	    // process holes from left to right
	    for (let i = 0; i < queue.length; i++) {
	        outerNode = eliminateHole(queue[i], outerNode);
	    }

	    return outerNode;
	}

	function compareX(a, b) {
	    return a.x - b.x;
	}

	// find a bridge between vertices that connects hole with an outer ring and and link it
	function eliminateHole(hole, outerNode) {
	    const bridge = findHoleBridge(hole, outerNode);
	    if (!bridge) {
	        return outerNode;
	    }

	    const bridgeReverse = splitPolygon(bridge, hole);

	    // filter collinear points around the cuts
	    filterPoints(bridgeReverse, bridgeReverse.next);
	    return filterPoints(bridge, bridge.next);
	}

	// David Eberly's algorithm for finding a bridge between hole and outer polygon
	function findHoleBridge(hole, outerNode) {
	    let p = outerNode;
	    const hx = hole.x;
	    const hy = hole.y;
	    let qx = -Infinity;
	    let m;

	    // find a segment intersected by a ray from the hole's leftmost point to the left;
	    // segment's endpoint with lesser x will be potential connection point
	    do {
	        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
	            const x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
	            if (x <= hx && x > qx) {
	                qx = x;
	                m = p.x < p.next.x ? p : p.next;
	                if (x === hx) return m; // hole touches outer segment; pick leftmost endpoint
	            }
	        }
	        p = p.next;
	    } while (p !== outerNode);

	    if (!m) return null;

	    // look for points inside the triangle of hole point, segment intersection and endpoint;
	    // if there are no points found, we have a valid connection;
	    // otherwise choose the point of the minimum angle with the ray as connection point

	    const stop = m;
	    const mx = m.x;
	    const my = m.y;
	    let tanMin = Infinity;

	    p = m;

	    do {
	        if (hx >= p.x && p.x >= mx && hx !== p.x &&
	                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

	            const tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

	            if (locallyInside(p, hole) &&
	                (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
	                m = p;
	                tanMin = tan;
	            }
	        }

	        p = p.next;
	    } while (p !== stop);

	    return m;
	}

	// whether sector in vertex m contains sector in vertex p in the same coordinates
	function sectorContainsSector(m, p) {
	    return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
	}

	// interlink polygon nodes in z-order
	function indexCurve(start, minX, minY, invSize) {
	    let p = start;
	    do {
	        if (p.z === 0) p.z = zOrder(p.x, p.y, minX, minY, invSize);
	        p.prevZ = p.prev;
	        p.nextZ = p.next;
	        p = p.next;
	    } while (p !== start);

	    p.prevZ.nextZ = null;
	    p.prevZ = null;

	    sortLinked(p);
	}

	// Simon Tatham's linked list merge sort algorithm
	// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
	function sortLinked(list) {
	    let numMerges;
	    let inSize = 1;

	    do {
	        let p = list;
	        let e;
	        list = null;
	        let tail = null;
	        numMerges = 0;

	        while (p) {
	            numMerges++;
	            let q = p;
	            let pSize = 0;
	            for (let i = 0; i < inSize; i++) {
	                pSize++;
	                q = q.nextZ;
	                if (!q) break;
	            }
	            let qSize = inSize;

	            while (pSize > 0 || (qSize > 0 && q)) {

	                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
	                    e = p;
	                    p = p.nextZ;
	                    pSize--;
	                } else {
	                    e = q;
	                    q = q.nextZ;
	                    qSize--;
	                }

	                if (tail) tail.nextZ = e;
	                else list = e;

	                e.prevZ = tail;
	                tail = e;
	            }

	            p = q;
	        }

	        tail.nextZ = null;
	        inSize *= 2;

	    } while (numMerges > 1);

	    return list;
	}

	// z-order of a point given coords and inverse of the longer side of data bbox
	function zOrder(x, y, minX, minY, invSize) {
	    // coords are transformed into non-negative 15-bit integer range
	    x = (x - minX) * invSize | 0;
	    y = (y - minY) * invSize | 0;

	    x = (x | (x << 8)) & 0x00FF00FF;
	    x = (x | (x << 4)) & 0x0F0F0F0F;
	    x = (x | (x << 2)) & 0x33333333;
	    x = (x | (x << 1)) & 0x55555555;

	    y = (y | (y << 8)) & 0x00FF00FF;
	    y = (y | (y << 4)) & 0x0F0F0F0F;
	    y = (y | (y << 2)) & 0x33333333;
	    y = (y | (y << 1)) & 0x55555555;

	    return x | (y << 1);
	}

	// find the leftmost node of a polygon ring
	function getLeftmost(start) {
	    let p = start,
	        leftmost = start;
	    do {
	        if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
	        p = p.next;
	    } while (p !== start);

	    return leftmost;
	}

	// check if a point lies within a convex triangle
	function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
	    return (cx - px) * (ay - py) >= (ax - px) * (cy - py) &&
	           (ax - px) * (by - py) >= (bx - px) * (ay - py) &&
	           (bx - px) * (cy - py) >= (cx - px) * (by - py);
	}

	// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
	function isValidDiagonal(a, b) {
	    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
	           (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
	            (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
	            equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
	}

	// signed area of a triangle
	function area(p, q, r) {
	    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	}

	// check if two points are equal
	function equals(p1, p2) {
	    return p1.x === p2.x && p1.y === p2.y;
	}

	// check if two segments intersect
	function intersects(p1, q1, p2, q2) {
	    const o1 = sign(area(p1, q1, p2));
	    const o2 = sign(area(p1, q1, q2));
	    const o3 = sign(area(p2, q2, p1));
	    const o4 = sign(area(p2, q2, q1));

	    if (o1 !== o2 && o3 !== o4) return true; // general case

	    if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
	    if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
	    if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
	    if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

	    return false;
	}

	// for collinear points p, q, r, check if point q lies on segment pr
	function onSegment(p, q, r) {
	    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
	}

	function sign(num) {
	    return num > 0 ? 1 : num < 0 ? -1 : 0;
	}

	// check if a polygon diagonal intersects any polygon segments
	function intersectsPolygon(a, b) {
	    let p = a;
	    do {
	        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
	                intersects(p, p.next, a, b)) return true;
	        p = p.next;
	    } while (p !== a);

	    return false;
	}

	// check if a polygon diagonal is locally inside the polygon
	function locallyInside(a, b) {
	    return area(a.prev, a, a.next) < 0 ?
	        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
	        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
	}

	// check if the middle point of a polygon diagonal is inside the polygon
	function middleInside(a, b) {
	    let p = a;
	    let inside = false;
	    const px = (a.x + b.x) / 2;
	    const py = (a.y + b.y) / 2;
	    do {
	        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
	                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
	            inside = !inside;
	        p = p.next;
	    } while (p !== a);

	    return inside;
	}

	// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
	// if one belongs to the outer ring and another to a hole, it merges it into a single ring
	function splitPolygon(a, b) {
	    const a2 = createNode(a.i, a.x, a.y),
	        b2 = createNode(b.i, b.x, b.y),
	        an = a.next,
	        bp = b.prev;

	    a.next = b;
	    b.prev = a;

	    a2.next = an;
	    an.prev = a2;

	    b2.next = a2;
	    a2.prev = b2;

	    bp.next = b2;
	    b2.prev = bp;

	    return b2;
	}

	// create a node and optionally link it with previous one (in a circular doubly linked list)
	function insertNode(i, x, y, last) {
	    const p = createNode(i, x, y);

	    if (!last) {
	        p.prev = p;
	        p.next = p;

	    } else {
	        p.next = last.next;
	        p.prev = last;
	        last.next.prev = p;
	        last.next = p;
	    }
	    return p;
	}

	function removeNode(p) {
	    p.next.prev = p.prev;
	    p.prev.next = p.next;

	    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
	    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
	}

	function createNode(i, x, y) {
	    return {
	        i, // vertex index in coordinates array
	        x, y, // vertex coordinates
	        prev: null, // previous and next vertex nodes in a polygon ring
	        next: null,
	        z: 0, // z-order curve value
	        prevZ: null, // previous and next nodes in z-order
	        nextZ: null,
	        steiner: false // indicates whether this is a steiner point
	    };
	}

	function signedArea(data, start, end, dim) {
	    let sum = 0;
	    for (let i = start, j = end - dim; i < end; i += dim) {
	        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
	        j = i;
	    }
	    return sum;
	}

	/**
	 * Winding order defines the order of vertices for a triangle to be considered front-facing.
	 *
	 * @enum {number}
	 */
	const WindingOrder = {
	  /**
	   * Vertices are in clockwise order.
	   *
	   * @type {number}
	   * @constant
	   */
	  CLOCKWISE: WebGLConstants$1.CW,

	  /**
	   * Vertices are in counter-clockwise order.
	   *
	   * @type {number}
	   * @constant
	   */
	  COUNTER_CLOCKWISE: WebGLConstants$1.CCW,
	};

	/**
	 * @private
	 */
	WindingOrder.validate = function (windingOrder) {
	  return (
	    windingOrder === WindingOrder.CLOCKWISE ||
	    windingOrder === WindingOrder.COUNTER_CLOCKWISE
	  );
	};

	var WindingOrder$1 = Object.freeze(WindingOrder);

	// const scaleToGeodeticHeightN = new Cartesian3();
	// const scaleToGeodeticHeightP = new Cartesian3();

	/**
	 * @private
	 */
	const PolygonPipeline = {};

	/**
	 * @exception {DeveloperError} At least three positions are required.
	 */
	PolygonPipeline.computeArea2D = function (positions) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("positions", positions);
	  Check.typeOf.number.greaterThanOrEquals(
	    "positions.length",
	    positions.length,
	    3,
	  );
	  //>>includeEnd('debug');

	  const length = positions.length;
	  let area = 0.0;

	  for (let i0 = length - 1, i1 = 0; i1 < length; i0 = i1++) {
	    const v0 = positions[i0];
	    const v1 = positions[i1];

	    area += v0.x * v1.y - v1.x * v0.y;
	  }

	  return area * 0.5;
	};

	/**
	 * @returns {WindingOrder} The winding order.
	 *
	 * @exception {DeveloperError} At least three positions are required.
	 */
	PolygonPipeline.computeWindingOrder2D = function (positions) {
	  const area = PolygonPipeline.computeArea2D(positions);
	  return area > 0.0 ? WindingOrder$1.COUNTER_CLOCKWISE : WindingOrder$1.CLOCKWISE;
	};

	/**
	 * Triangulate a polygon.
	 *
	 * @param {Cartesian2[]} positions Cartesian2 array containing the vertices of the polygon
	 * @param {number[]} [holes] An array of the staring indices of the holes.
	 * @returns {number[]} Index array representing triangles that fill the polygon
	 */
	PolygonPipeline.triangulate = function (positions, holes) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("positions", positions);
	  //>>includeEnd('debug');

	  const flattenedPositions = Cartesian2.packArray(positions);
	  return earcut(flattenedPositions, holes, 2);
	};

	// module.exports = loadObj;

	// Object name (o) -> node
	// Group name (g) -> mesh
	// Material name (usemtl) -> primitive

	function Node() {
	  this.name = undefined;
	  this.meshes = [];
	}

	function Mesh() {
	  this.name = undefined;
	  this.primitives = [];
	}

	function Primitive() {
	  this.material = undefined;
	  this.indices = new ArrayStorage(ComponentDatatype$1.UNSIGNED_INT);
	  this.positions = new ArrayStorage(ComponentDatatype$1.FLOAT);
	  this.normals = new ArrayStorage(ComponentDatatype$1.FLOAT);
	  this.uvs = new ArrayStorage(ComponentDatatype$1.FLOAT);
	}

	// OBJ regex patterns are modified from ThreeJS (https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/OBJLoader.js)
	const vertexPattern =
	  /v(\s+[\d|\.|\+|\-|e|E]+)(\s+[\d|\.|\+|\-|e|E]+)(\s+[\d|\.|\+|\-|e|E]+)/; // v float float float
	const normalPattern =
	  /vn(\s+[\d|\.|\+|\-|e|E]+)(\s+[\d|\.|\+|\-|e|E]+)(\s+[\d|\.|\+|\-|e|E]+)/; // vn float float float
	const uvPattern = /vt(\s+[\d|\.|\+|\-|e|E]+)(\s+[\d|\.|\+|\-|e|E]+)/; // vt float float
	const facePattern = /(-?\d+)\/?(-?\d*)\/?(-?\d*)/g; // for any face format "f v", "f v/v", "f v//v", "f v/v/v"

	const scratchCartesian = new Cartesian3();

	/**
	 * Parse an obj file.
	 *
	 * @param {String} objPath Path to the obj file.
	 * @param {Object} options The options object passed along from lib/obj2gltf.js
	 * @returns {Promise} A promise resolving to the obj data, which includes an array of nodes containing geometry information and an array of materials.
	 *
	 * @private
	 */
	function loadObj(objPath, options) {
	  const axisTransform = getAxisTransform(
	    options.inputUpAxis,
	    options.outputUpAxis,
	  );

	  // Global store of vertex attributes listed in the obj file
	  let globalPositions = new ArrayStorage(ComponentDatatype$1.FLOAT);
	  let globalNormals = new ArrayStorage(ComponentDatatype$1.FLOAT);
	  let globalUvs = new ArrayStorage(ComponentDatatype$1.FLOAT);

	  // The current node, mesh, and primitive
	  let node;
	  let mesh;
	  let primitive;
	  let activeMaterial;

	  // All nodes seen in the obj
	  const nodes = [];

	  // Used to build the indices. The vertex cache is unique to each primitive.
	  let vertexCache = {};
	  const vertexCacheLimit = 1000000;
	  let vertexCacheCount = 0;
	  let vertexCount = 0;

	  // All mtl paths seen in the obj
	  let mtlPaths = [];

	  // Buffers for face data that spans multiple lines
	  let lineBuffer = "";

	  // Used for parsing face data
	  const faceVertices = [];
	  const facePositions = [];
	  const faceUvs = [];
	  const faceNormals = [];

	  function clearVertexCache() {
	    vertexCache = {};
	    vertexCacheCount = 0;
	  }

	  function getName(name) {
	    return name === "" ? undefined : name;
	  }

	  function addNode(name) {
	    node = new Node();
	    node.name = getName(name);
	    nodes.push(node);
	    addMesh();
	  }

	  function addMesh(name) {
	    mesh = new Mesh();
	    mesh.name = getName(name);
	    node.meshes.push(mesh);
	    addPrimitive();
	  }

	  function addPrimitive() {
	    primitive = new Primitive();
	    primitive.material = activeMaterial;
	    mesh.primitives.push(primitive);

	    // Clear the vertex cache for each new primitive
	    clearVertexCache();
	    vertexCount = 0;
	  }

	  function reusePrimitive(callback) {
	    const primitives = mesh.primitives;
	    const primitivesLength = primitives.length;
	    for (let i = 0; i < primitivesLength; ++i) {
	      if (primitives[i].material === activeMaterial) {
	        if (!defined(callback) || callback(primitives[i])) {
	          primitive = primitives[i];
	          clearVertexCache();
	          vertexCount = primitive.positions.length / 3;
	          return;
	        }
	      }
	    }
	    addPrimitive();
	  }

	  function useMaterial(name) {
	    activeMaterial = getName(name);
	    reusePrimitive();
	  }

	  function faceAndPrimitiveMatch(uvs, normals, primitive) {
	    const faceHasUvs = defined(uvs[0]);
	    const faceHasNormals = defined(normals[0]);
	    const primitiveHasUvs = primitive.uvs.length > 0;
	    const primitiveHasNormals = primitive.normals.length > 0;
	    return (
	      primitiveHasUvs === faceHasUvs && primitiveHasNormals === faceHasNormals
	    );
	  }

	  function checkPrimitive(uvs, normals) {
	    const firstFace = primitive.indices.length === 0;
	    if (!firstFace && !faceAndPrimitiveMatch(uvs, normals, primitive)) {
	      reusePrimitive(function (primitive) {
	        return faceAndPrimitiveMatch(uvs, normals, primitive);
	      });
	    }
	  }

	  function getIndexFromStart(index, attributeData, components) {
	    const i = parseInt(index);
	    if (i < 0) {
	      // Negative vertex indexes reference the vertices immediately above it
	      return attributeData.length / components + i;
	    }
	    return i - 1;
	  }

	  function correctAttributeIndices(
	    attributeIndices,
	    attributeData,
	    components,
	  ) {
	    const length = attributeIndices.length;
	    for (let i = 0; i < length; ++i) {
	      if (attributeIndices[i].length === 0) {
	        attributeIndices[i] = undefined;
	      } else {
	        attributeIndices[i] = getIndexFromStart(
	          attributeIndices[i],
	          attributeData,
	          components,
	        );
	      }
	    }
	  }

	  function correctVertices(vertices, positions, uvs, normals) {
	    const length = vertices.length;
	    for (let i = 0; i < length; ++i) {
	      vertices[i] = `${defaultValue(positions[i], "")}/${defaultValue(
        uvs[i],
        "",
      )}/${defaultValue(normals[i], "")}`;
	    }
	  }

	  function createVertex(p, u, n) {
	    // Positions
	    if (defined(p) && globalPositions.length > 0) {
	      if (p * 3 >= globalPositions.length) {
	        throw new RuntimeError(`Position index ${p} is out of bounds`);
	      }
	      const px = globalPositions.get(p * 3);
	      const py = globalPositions.get(p * 3 + 1);
	      const pz = globalPositions.get(p * 3 + 2);
	      primitive.positions.push(px);
	      primitive.positions.push(py);
	      primitive.positions.push(pz);
	    }

	    // Normals
	    if (defined(n) && globalNormals.length > 0) {
	      if (n * 3 >= globalNormals.length) {
	        throw new RuntimeError(`Normal index ${n} is out of bounds`);
	      }
	      const nx = globalNormals.get(n * 3);
	      const ny = globalNormals.get(n * 3 + 1);
	      const nz = globalNormals.get(n * 3 + 2);
	      primitive.normals.push(nx);
	      primitive.normals.push(ny);
	      primitive.normals.push(nz);
	    }

	    // UVs
	    if (defined(u) && globalUvs.length > 0) {
	      if (u * 2 >= globalUvs.length) {
	        throw new RuntimeError(`UV index ${u} is out of bounds`);
	      }
	      const ux = globalUvs.get(u * 2);
	      const uy = globalUvs.get(u * 2 + 1);
	      primitive.uvs.push(ux);
	      primitive.uvs.push(uy);
	    }
	  }

	  function addVertex(v, p, u, n) {
	    let index = vertexCache[v];
	    if (!defined(index)) {
	      index = vertexCount++;
	      vertexCache[v] = index;
	      createVertex(p, u, n);

	      // Prevent the vertex cache from growing too large. As a result of clearing the cache there
	      // may be some duplicate vertices.
	      vertexCacheCount++;
	      if (vertexCacheCount > vertexCacheLimit) {
	        clearVertexCache();
	      }
	    }
	    return index;
	  }

	  function getPosition(index, result) {
	    const px = globalPositions.get(index * 3);
	    const py = globalPositions.get(index * 3 + 1);
	    const pz = globalPositions.get(index * 3 + 2);
	    return Cartesian3.fromElements(px, py, pz, result);
	  }

	  function getNormal(index, result) {
	    const nx = globalNormals.get(index * 3);
	    const ny = globalNormals.get(index * 3 + 1);
	    const nz = globalNormals.get(index * 3 + 2);
	    return Cartesian3.fromElements(nx, ny, nz, result);
	  }

	  const scratch1 = new Cartesian3();
	  const scratch2 = new Cartesian3();
	  const scratch3 = new Cartesian3();
	  const scratch4 = new Cartesian3();
	  const scratch5 = new Cartesian3();
	  const scratchCenter = new Cartesian3();
	  const scratchAxis1 = new Cartesian3();
	  const scratchAxis2 = new Cartesian3();
	  const scratchNormal = new Cartesian3();
	  const scratchPositions = [
	    new Cartesian3(),
	    new Cartesian3(),
	    new Cartesian3(),
	    new Cartesian3(),
	  ];
	  const scratchVertexIndices = [];
	  const scratchPoints = [];

	  function checkWindingCorrect(
	    positionIndex1,
	    positionIndex2,
	    positionIndex3,
	    normalIndex,
	  ) {
	    if (!defined(normalIndex)) {
	      // If no face normal, we have to assume the winding is correct.
	      return true;
	    }
	    const normal = getNormal(normalIndex, scratchNormal);
	    const A = getPosition(positionIndex1, scratch1);
	    const B = getPosition(positionIndex2, scratch2);
	    const C = getPosition(positionIndex3, scratch3);

	    const BA = Cartesian3.subtract(B, A, scratch4);
	    const CA = Cartesian3.subtract(C, A, scratch5);
	    const cross = Cartesian3.cross(BA, CA, scratch3);

	    return Cartesian3.dot(normal, cross) >= 0;
	  }

	  function addTriangle(index1, index2, index3, correctWinding) {
	    if (correctWinding) {
	      primitive.indices.push(index1);
	      primitive.indices.push(index2);
	      primitive.indices.push(index3);
	    } else {
	      primitive.indices.push(index1);
	      primitive.indices.push(index3);
	      primitive.indices.push(index2);
	    }
	  }

	  function addFace(
	    vertices,
	    positions,
	    uvs,
	    normals,
	    triangleWindingOrderSanitization,
	  ) {
	    correctAttributeIndices(positions, globalPositions, 3);
	    correctAttributeIndices(normals, globalNormals, 3);
	    correctAttributeIndices(uvs, globalUvs, 2);
	    correctVertices(vertices, positions, uvs, normals);

	    checkPrimitive(uvs, faceNormals);

	    if (vertices.length === 3) {
	      const isWindingCorrect =
	        !triangleWindingOrderSanitization ||
	        checkWindingCorrect(
	          positions[0],
	          positions[1],
	          positions[2],
	          normals[0],
	        );
	      const index1 = addVertex(vertices[0], positions[0], uvs[0], normals[0]);
	      const index2 = addVertex(vertices[1], positions[1], uvs[1], normals[1]);
	      const index3 = addVertex(vertices[2], positions[2], uvs[2], normals[2]);
	      addTriangle(index1, index2, index3, isWindingCorrect);
	    } else {
	      // Triangulate if the face is not a triangle
	      const points = scratchPoints;
	      const vertexIndices = scratchVertexIndices;

	      points.length = 0;
	      vertexIndices.length = 0;

	      for (let i = 0; i < vertices.length; ++i) {
	        const index = addVertex(vertices[i], positions[i], uvs[i], normals[i]);
	        vertexIndices.push(index);
	        if (i === scratchPositions.length) {
	          scratchPositions.push(new Cartesian3());
	        }
	        points.push(getPosition(positions[i], scratchPositions[i]));
	      }

	      const validGeometry =
	        CoplanarPolygonGeometryLibrary.computeProjectTo2DArguments(
	          points,
	          scratchCenter,
	          scratchAxis1,
	          scratchAxis2,
	        );
	      if (!validGeometry) {
	        return;
	      }
	      const projectPoints =
	        CoplanarPolygonGeometryLibrary.createProjectPointsTo2DFunction(
	          scratchCenter,
	          scratchAxis1,
	          scratchAxis2,
	        );
	      const points2D = projectPoints(points);
	      const indices = PolygonPipeline.triangulate(points2D);
	      const isWindingCorrect =
	        PolygonPipeline.computeWindingOrder2D(points2D) !==
	        WindingOrder$1.CLOCKWISE;

	      for (let i = 0; i < indices.length - 2; i += 3) {
	        addTriangle(
	          vertexIndices[indices[i]],
	          vertexIndices[indices[i + 1]],
	          vertexIndices[indices[i + 2]],
	          isWindingCorrect,
	        );
	      }
	    }
	  }

	  function parseLine(line) {
	    line = line.trim();
	    let result;

	    if (line.length === 0 || line.charAt(0) === "#") ; else if (/^o\s/i.test(line)) {
	      const objectName = line.substring(2).trim();
	      addNode(objectName);
	    } else if (/^g\s/i.test(line)) {
	      const groupName = line.substring(2).trim();
	      addMesh(groupName);
	    } else if (/^usemtl/i.test(line)) {
	      const materialName = line.substring(7).trim();
	      useMaterial(materialName);
	    } else if (/^mtllib/i.test(line)) {
	      const mtllibLine = line.substring(7).trim();
	      mtlPaths = mtlPaths.concat(getMtlPaths(mtllibLine));
	    } else if ((result = vertexPattern.exec(line)) !== null) {
	      const position = scratchCartesian;
	      position.x = parseFloat(result[1]);
	      position.y = parseFloat(result[2]);
	      position.z = parseFloat(result[3]);
	      if (defined(axisTransform)) {
	        Matrix4.multiplyByPoint(axisTransform, position, position);
	      }
	      globalPositions.push(position.x);
	      globalPositions.push(position.y);
	      globalPositions.push(position.z);
	    } else if ((result = normalPattern.exec(line)) !== null) {
	      const normal = Cartesian3.fromElements(
	        parseFloat(result[1]),
	        parseFloat(result[2]),
	        parseFloat(result[3]),
	        scratchNormal,
	      );
	      if (Cartesian3.equals(normal, Cartesian3.ZERO)) {
	        Cartesian3.clone(Cartesian3.UNIT_Z, normal);
	      } else {
	        Cartesian3.normalize(normal, normal);
	      }
	      if (defined(axisTransform)) {
	        Matrix4.multiplyByPointAsVector(axisTransform, normal, normal);
	      }
	      globalNormals.push(normal.x);
	      globalNormals.push(normal.y);
	      globalNormals.push(normal.z);
	    } else if ((result = uvPattern.exec(line)) !== null) {
	      globalUvs.push(parseFloat(result[1]));
	      globalUvs.push(1.0 - parseFloat(result[2])); // Flip y so 0.0 is the bottom of the image
	    } else {
	      // face line or invalid line
	      // Because face lines can contain n vertices, we use a line buffer in case the face data spans multiple lines.
	      // If there's a line continuation don't create face yet
	      if (line.slice(-1) === "\\") {
	        lineBuffer += line.substring(0, line.length - 1);
	        return;
	      }
	      lineBuffer += line;
	      if (lineBuffer.substring(0, 2) === "f ") {
	        while ((result = facePattern.exec(lineBuffer)) !== null) {
	          faceVertices.push(result[0]);
	          facePositions.push(result[1]);
	          faceUvs.push(result[2]);
	          faceNormals.push(result[3]);
	        }
	        if (faceVertices.length > 2) {
	          addFace(
	            faceVertices,
	            facePositions,
	            faceUvs,
	            faceNormals,
	            options.triangleWindingOrderSanitization,
	          );
	        }

	        faceVertices.length = 0;
	        facePositions.length = 0;
	        faceNormals.length = 0;
	        faceUvs.length = 0;
	      }
	      lineBuffer = "";
	    }
	  }

	  // Create a default node in case there are no o/g/usemtl lines in the obj
	  addNode();

	  // Parse the obj file
	  return readLines(objPath, parseLine).then(function () {
	    // Unload resources
	    globalPositions = undefined;
	    globalNormals = undefined;
	    globalUvs = undefined;

	    // Load materials and textures
	    return finishLoading(
	      nodes,
	      mtlPaths,
	      objPath,
	      defined(activeMaterial),
	      options,
	    );
	  });
	}

	function getMtlPaths(mtllibLine) {
	  // Handle paths with spaces. E.g. mtllib my material file.mtl
	  const mtlPaths = [];
	  //Remove double quotes around the mtl file if it exists
	  mtllibLine = mtllibLine.replace(/^"(.+)"$/, "$1");
	  const splits = mtllibLine.split(" ");
	  const length = splits.length;
	  let startIndex = 0;
	  for (let i = 0; i < length; ++i) {
	    if (path.extname(splits[i]) !== ".mtl") {
	      continue;
	    }
	    const mtlPath = splits.slice(startIndex, i + 1).join(" ");
	    mtlPaths.push(mtlPath);
	    startIndex = i + 1;
	  }
	  return mtlPaths;
	}

	function finishLoading(nodes, mtlPaths, objPath, usesMaterials, options) {
	  nodes = cleanNodes(nodes);
	  if (nodes.length === 0) {
	    throw new RuntimeError(`${objPath} does not have any geometry data`);
	  }
	  const name = path.basename(objPath, path.extname(objPath));
	  return loadMtls(mtlPaths, objPath, options).then(function (materials) {
	    if (materials.length > 0 && !usesMaterials) {
	      assignDefaultMaterial(nodes, materials);
	    }
	    assignUnnamedMaterial(nodes, materials);
	    return {
	      nodes: nodes,
	      materials: materials,
	      name: name,
	    };
	  });
	}

	// function normalizeMtlPath(mtlPath, objDirectory) {
	//   mtlPath = mtlPath.replace(/\\/g, "/");
	//   return path.normalize(path.resolve(objDirectory, mtlPath));
	// }

	function loadMtls(mtlPaths, objPath, options) {
	  const objDirectory = path.dirname(objPath);
	  let materials = [];

	  // Remove duplicates
	  mtlPaths = mtlPaths.filter(function (value, index, self) {
	    return self.indexOf(value) === index;
	  });

	  return bluebirdExports.Promise.map(
	    mtlPaths,
	    function (mtlPath) {
	      // mtlPath = normalizeMtlPath(mtlPath, objDirectory);
	      const shallowPath = path.join(objDirectory, path.basename(mtlPath));
	      // if (options.secure && outsideDirectory(mtlPath, objDirectory)) {
	      //   // Try looking for the .mtl in the same directory as the obj
	      //   options.logger(
	      //     "The material file is outside of the obj directory and the secure flag is true. Attempting to read the material file from within the obj directory instead.",
	      //   );
	      //   return loadMtl(shallowPath, options)
	      //     .then(function (materialsInMtl) {
	      //       materials = materials.concat(materialsInMtl);
	      //     })
	      //     .catch(function (error) {
	      //       options.logger(error.message);
	      //       options.logger(
	      //         `Could not read material file at ${shallowPath}. Using default material instead.`,
	      //       );
	      //     });
	      // }

	      return loadMtl(shallowPath, options)
	        // .catch(function (error) {
	        //   // Try looking for the .mtl in the same directory as the obj
	        //   options.logger(error.message);
	        //   options.logger(
	        //     `Could not read material file at ${mtlPath}. Attempting to read the material file from within the obj directory instead.`,
	        //   );
	        //   return loadMtl(shallowPath, options);
	        // })
	        .then(function (materialsInMtl) {
	          materials = materials.concat(materialsInMtl);
	        })
	        .catch(function (error) {
	          options.logger(error.message);
	          options.logger(
	            `Could not read material file at ${shallowPath}. Using default material instead.`,
	          );
	        });
	    },
	    { concurrency: 10 },
	  ).then(function () {
	    return materials;
	  });
	}

	function assignDefaultMaterial(nodes, materials) {
	  const defaultMaterial = materials[0].name;
	  const nodesLength = nodes.length;
	  for (let i = 0; i < nodesLength; ++i) {
	    const meshes = nodes[i].meshes;
	    const meshesLength = meshes.length;
	    for (let j = 0; j < meshesLength; ++j) {
	      const primitives = meshes[j].primitives;
	      const primitivesLength = primitives.length;
	      for (let k = 0; k < primitivesLength; ++k) {
	        const primitive = primitives[k];
	        primitive.material = defaultValue(primitive.material, defaultMaterial);
	      }
	    }
	  }
	}

	function assignUnnamedMaterial(nodes, materials) {
	  // If there is a material that doesn't have a name, assign that
	  // material to any primitives whose material is undefined.
	  const unnamedMaterial = materials.find(function (material) {
	    return material.name.length === 0;
	  });

	  if (!defined(unnamedMaterial)) {
	    return;
	  }

	  const nodesLength = nodes.length;
	  for (let i = 0; i < nodesLength; ++i) {
	    const meshes = nodes[i].meshes;
	    const meshesLength = meshes.length;
	    for (let j = 0; j < meshesLength; ++j) {
	      const primitives = meshes[j].primitives;
	      const primitivesLength = primitives.length;
	      for (let k = 0; k < primitivesLength; ++k) {
	        const primitive = primitives[k];
	        if (!defined(primitive.material)) {
	          primitive.material = unnamedMaterial.name;
	        }
	      }
	    }
	  }
	}

	function removeEmptyMeshes(meshes) {
	  return meshes.filter(function (mesh) {
	    // Remove empty primitives
	    mesh.primitives = mesh.primitives.filter(function (primitive) {
	      return primitive.indices.length > 0 && primitive.positions.length > 0;
	    });
	    // Valid meshes must have at least one primitive
	    return mesh.primitives.length > 0;
	  });
	}

	function meshesHaveNames(meshes) {
	  const meshesLength = meshes.length;
	  for (let i = 0; i < meshesLength; ++i) {
	    if (defined(meshes[i].name)) {
	      return true;
	    }
	  }
	  return false;
	}

	function removeEmptyNodes(nodes) {
	  const final = [];
	  const nodesLength = nodes.length;
	  for (let i = 0; i < nodesLength; ++i) {
	    const node = nodes[i];
	    const meshes = removeEmptyMeshes(node.meshes);
	    if (meshes.length === 0) {
	      continue;
	    }
	    node.meshes = meshes;
	    if (!defined(node.name) && meshesHaveNames(meshes)) {
	      // If the obj has groups (g) but not object groups (o) then convert meshes to nodes
	      const meshesLength = meshes.length;
	      for (let j = 0; j < meshesLength; ++j) {
	        const mesh = meshes[j];
	        const convertedNode = new Node();
	        convertedNode.name = mesh.name;
	        convertedNode.meshes = [mesh];
	        final.push(convertedNode);
	      }
	    } else {
	      final.push(node);
	    }
	  }
	  return final;
	}

	function setDefaultNames(items, defaultName, usedNames) {
	  const itemsLength = items.length;
	  for (let i = 0; i < itemsLength; ++i) {
	    const item = items[i];
	    let name = defaultValue(item.name, defaultName);
	    const occurrences = usedNames[name];
	    if (defined(occurrences)) {
	      usedNames[name]++;
	      name = `${name}_${occurrences}`;
	    } else {
	      usedNames[name] = 1;
	    }
	    item.name = name;
	  }
	}

	function setDefaults(nodes) {
	  const usedNames = {};
	  setDefaultNames(nodes, "Node", usedNames);
	  const nodesLength = nodes.length;
	  for (let i = 0; i < nodesLength; ++i) {
	    const node = nodes[i];
	    setDefaultNames(node.meshes, `${node.name}-Mesh`, usedNames);
	  }
	}

	function cleanNodes(nodes) {
	  nodes = removeEmptyNodes(nodes);
	  setDefaults(nodes);
	  return nodes;
	}

	function getAxisTransform(inputUpAxis, outputUpAxis) {
	  if (inputUpAxis === "X" && outputUpAxis === "Y") {
	    return Axis$1.X_UP_TO_Y_UP;
	  } else if (inputUpAxis === "X" && outputUpAxis === "Z") {
	    return Axis$1.X_UP_TO_Z_UP;
	  } else if (inputUpAxis === "Y" && outputUpAxis === "X") {
	    return Axis$1.Y_UP_TO_X_UP;
	  } else if (inputUpAxis === "Y" && outputUpAxis === "Z") {
	    return Axis$1.Y_UP_TO_Z_UP;
	  } else if (inputUpAxis === "Z" && outputUpAxis === "X") {
	    return Axis$1.Z_UP_TO_X_UP;
	  } else if (inputUpAxis === "Z" && outputUpAxis === "Y") {
	    return Axis$1.Z_UP_TO_Y_UP;
	  }
	}

	// module.exports = getBufferPadded;

	/**
	 * Pad the buffer to the next 4-byte boundary to ensure proper alignment for the section that follows.
	 *
	 * @param {Buffer} buffer The buffer.
	 * @returns {Buffer} The padded buffer.
	 *
	 * @private
	 */
	function getBufferPadded(buffer) {
	  const boundary = 4;
	  const byteLength = buffer.length;
	  const remainder = byteLength % boundary;
	  if (remainder === 0) {
	    return buffer;
	  }
	  const padding = remainder === 0 ? 0 : boundary - remainder;
	  const emptyBuffer = Buffer.alloc(padding);
	  return Buffer.concat([buffer, emptyBuffer]);
	}

	const getDefaultMaterial = loadMtl.getDefaultMaterial;

	// module.exports = createGltf;

	/**
	 * Create a glTF from obj data.
	 *
	 * @param {Object} objData An object containing an array of nodes containing geometry information and an array of materials.
	 * @param {Object} options The options object passed along from lib/obj2gltf.js
	 * @returns {Object} A glTF asset.
	 *
	 * @private
	 */
	function createGltf(objData, options) {
	  const nodes = objData.nodes;
	  let materials = objData.materials;
	  const name = objData.name;

	  // Split materials used by primitives with different types of attributes
	  materials = splitIncompatibleMaterials(nodes, materials, options);

	  const gltf = {
	    accessors: [],
	    asset: {},
	    buffers: [],
	    bufferViews: [],
	    extensionsUsed: [],
	    extensionsRequired: [],
	    images: [],
	    materials: [],
	    meshes: [],
	    nodes: [],
	    samplers: [],
	    scene: 0,
	    scenes: [],
	    textures: [],
	  };

	  gltf.asset = {
	    generator: "obj2gltf",
	    version: "2.0",
	  };

	  gltf.scenes.push({
	    nodes: [],
	  });

	  const bufferState = {
	    positionBuffers: [],
	    normalBuffers: [],
	    uvBuffers: [],
	    indexBuffers: [],
	    positionAccessors: [],
	    normalAccessors: [],
	    uvAccessors: [],
	    indexAccessors: [],
	  };

	  const uint32Indices = requiresUint32Indices(nodes);

	  const nodesLength = nodes.length;
	  for (let i = 0; i < nodesLength; ++i) {
	    const node = nodes[i];
	    const meshes = node.meshes;
	    const meshesLength = meshes.length;

	    if (meshesLength === 1) {
	      const meshIndex = addMesh(
	        gltf,
	        materials,
	        bufferState,
	        uint32Indices,
	        meshes[0],
	        options,
	      );
	      addNode(gltf, node.name, meshIndex, undefined);
	    } else {
	      // Add meshes as child nodes
	      const parentIndex = addNode(gltf, node.name);
	      for (let j = 0; j < meshesLength; ++j) {
	        const mesh = meshes[j];
	        const meshIndex = addMesh(
	          gltf,
	          materials,
	          bufferState,
	          uint32Indices,
	          mesh,
	          options,
	        );
	        addNode(gltf, mesh.name, meshIndex, parentIndex);
	      }
	    }
	  }

	  if (gltf.images.length > 0) {
	    gltf.samplers.push({
	      wrapS: WebGLConstants$1.REPEAT,
	      wrapT: WebGLConstants$1.REPEAT,
	    });
	  }

	  addBuffers(gltf, bufferState, name, options.separate);

	  if (options.specularGlossiness) {
	    gltf.extensionsUsed.push("KHR_materials_pbrSpecularGlossiness");
	    gltf.extensionsRequired.push("KHR_materials_pbrSpecularGlossiness");
	  }

	  if (options.unlit) {
	    gltf.extensionsUsed.push("KHR_materials_unlit");
	    gltf.extensionsRequired.push("KHR_materials_unlit");
	  }

	  return gltf;
	}

	function addCombinedBufferView(gltf, buffers, accessors, byteStride, target) {
	  const length = buffers.length;
	  if (length === 0) {
	    return;
	  }
	  const bufferViewIndex = gltf.bufferViews.length;
	  const previousBufferView = gltf.bufferViews[bufferViewIndex - 1];
	  const byteOffset = defined(previousBufferView)
	    ? previousBufferView.byteOffset + previousBufferView.byteLength
	    : 0;
	  let byteLength = 0;
	  for (let i = 0; i < length; ++i) {
	    const accessor = gltf.accessors[accessors[i]];
	    accessor.bufferView = bufferViewIndex;
	    accessor.byteOffset = byteLength;
	    byteLength += buffers[i].length;
	  }
	  gltf.bufferViews.push({
	    name: `bufferView_${bufferViewIndex}`,
	    buffer: 0,
	    byteLength: byteLength,
	    byteOffset: byteOffset,
	    byteStride: byteStride,
	    target: target,
	  });
	}

	function addCombinedBuffers(gltf, bufferState, name) {
	  addCombinedBufferView(
	    gltf,
	    bufferState.positionBuffers,
	    bufferState.positionAccessors,
	    12,
	    WebGLConstants$1.ARRAY_BUFFER,
	  );
	  addCombinedBufferView(
	    gltf,
	    bufferState.normalBuffers,
	    bufferState.normalAccessors,
	    12,
	    WebGLConstants$1.ARRAY_BUFFER,
	  );
	  addCombinedBufferView(
	    gltf,
	    bufferState.uvBuffers,
	    bufferState.uvAccessors,
	    8,
	    WebGLConstants$1.ARRAY_BUFFER,
	  );
	  addCombinedBufferView(
	    gltf,
	    bufferState.indexBuffers,
	    bufferState.indexAccessors,
	    undefined,
	    WebGLConstants$1.ELEMENT_ARRAY_BUFFER,
	  );

	  let buffers = [];
	  buffers = buffers.concat(
	    bufferState.positionBuffers,
	    bufferState.normalBuffers,
	    bufferState.uvBuffers,
	    bufferState.indexBuffers,
	  );
	  const buffer = getBufferPadded(Buffer.concat(buffers));

	  gltf.buffers.push({
	    name: name,
	    byteLength: buffer.length,
	    extras: {
	      _obj2gltf: {
	        source: buffer,
	      },
	    },
	  });
	}

	function addSeparateBufferView(
	  gltf,
	  buffer,
	  accessor,
	  byteStride,
	  target,
	  name,
	) {
	  const bufferIndex = gltf.buffers.length;
	  const bufferViewIndex = gltf.bufferViews.length;

	  gltf.buffers.push({
	    name: `${name}_${bufferIndex}`,
	    byteLength: buffer.length,
	    extras: {
	      _obj2gltf: {
	        source: buffer,
	      },
	    },
	  });

	  gltf.bufferViews.push({
	    buffer: bufferIndex,
	    byteLength: buffer.length,
	    byteOffset: 0,
	    byteStride: byteStride,
	    target: target,
	  });

	  gltf.accessors[accessor].bufferView = bufferViewIndex;
	  gltf.accessors[accessor].byteOffset = 0;
	}

	function addSeparateBufferViews(
	  gltf,
	  buffers,
	  accessors,
	  byteStride,
	  target,
	  name,
	) {
	  const length = buffers.length;
	  for (let i = 0; i < length; ++i) {
	    addSeparateBufferView(
	      gltf,
	      buffers[i],
	      accessors[i],
	      byteStride,
	      target,
	      name,
	    );
	  }
	}

	function addSeparateBuffers(gltf, bufferState, name) {
	  addSeparateBufferViews(
	    gltf,
	    bufferState.positionBuffers,
	    bufferState.positionAccessors,
	    12,
	    WebGLConstants$1.ARRAY_BUFFER,
	    name,
	  );
	  addSeparateBufferViews(
	    gltf,
	    bufferState.normalBuffers,
	    bufferState.normalAccessors,
	    12,
	    WebGLConstants$1.ARRAY_BUFFER,
	    name,
	  );
	  addSeparateBufferViews(
	    gltf,
	    bufferState.uvBuffers,
	    bufferState.uvAccessors,
	    8,
	    WebGLConstants$1.ARRAY_BUFFER,
	    name,
	  );
	  addSeparateBufferViews(
	    gltf,
	    bufferState.indexBuffers,
	    bufferState.indexAccessors,
	    undefined,
	    WebGLConstants$1.ELEMENT_ARRAY_BUFFER,
	    name,
	  );
	}

	function addBuffers(gltf, bufferState, name, separate) {
	  const buffers = bufferState.positionBuffers.concat(
	    bufferState.normalBuffers,
	    bufferState.uvBuffers,
	    bufferState.indexBuffers,
	  );
	  const buffersLength = buffers.length;
	  let buffersByteLength = 0;
	  for (let i = 0; i < buffersLength; ++i) {
	    buffersByteLength += buffers[i].length;
	  }

	  // if (separate && buffersByteLength > createGltf._getBufferMaxByteLength()) {
	  if (separate) {
	    // Don't combine buffers if the combined buffer will exceed the Node limit.
	    addSeparateBuffers(gltf, bufferState, name);
	  } else {
	    addCombinedBuffers(gltf, bufferState, name);
	  }
	}

	function addTexture(gltf, texture) {
	  const imageName = texture.name;
	  const textureName = texture.name;
	  const imageIndex = gltf.images.length;
	  const textureIndex = gltf.textures.length;

	  gltf.images.push({
	    name: imageName,
	    extras: {
	      _obj2gltf: texture,
	    },
	  });

	  gltf.textures.push({
	    name: textureName,
	    sampler: 0,
	    source: imageIndex,
	  });

	  return textureIndex;
	}

	function getTexture(gltf, texture) {
	  let textureIndex;
	  const images = gltf.images;
	  const length = images.length;
	  for (let i = 0; i < length; ++i) {
	    if (images[i].extras._obj2gltf === texture) {
	      textureIndex = i;
	      break;
	    }
	  }

	  if (!defined(textureIndex)) {
	    textureIndex = addTexture(gltf, texture);
	  }

	  return {
	    index: textureIndex,
	  };
	}

	function cloneMaterial(material, removeTextures) {
	  if (typeof material !== "object") {
	    return material;
	  } else if (material instanceof Texture) {
	    if (removeTextures) {
	      return undefined;
	    }
	    return material;
	  } else if (Array.isArray(material)) {
	    const length = material.length;
	    const clonedArray = new Array(length);
	    for (let i = 0; i < length; ++i) {
	      clonedArray[i] = cloneMaterial(material[i], removeTextures);
	    }
	    return clonedArray;
	  }
	  const clonedObject = {};
	  for (const name in material) {
	    if (Object.prototype.hasOwnProperty.call(material, name)) {
	      clonedObject[name] = cloneMaterial(material[name], removeTextures);
	    }
	  }
	  return clonedObject;
	}

	function resolveTextures(gltf, material) {
	  for (const name in material) {
	    if (Object.prototype.hasOwnProperty.call(material, name)) {
	      const property = material[name];
	      if (property instanceof Texture) {
	        material[name] = getTexture(gltf, property);
	      } else if (!Array.isArray(property) && typeof property === "object") {
	        resolveTextures(gltf, property);
	      }
	    }
	  }
	}

	function addGltfMaterial(gltf, material, options) {
	  resolveTextures(gltf, material);
	  const materialIndex = gltf.materials.length;
	  if (options.unlit) {
	    if (!defined(material.extensions)) {
	      material.extensions = {};
	    }
	    material.extensions.KHR_materials_unlit = {};
	  }
	  gltf.materials.push(material);
	  return materialIndex;
	}

	function getMaterialByName(materials, materialName) {
	  const materialsLength = materials.length;
	  for (let i = 0; i < materialsLength; ++i) {
	    if (materials[i].name === materialName) {
	      return materials[i];
	    }
	  }
	}

	function getMaterialIndex(materials, materialName) {
	  const materialsLength = materials.length;
	  for (let i = 0; i < materialsLength; ++i) {
	    if (materials[i].name === materialName) {
	      return i;
	    }
	  }
	}

	function getOrCreateGltfMaterial(gltf, materials, materialName, options) {
	  const material = getMaterialByName(materials, materialName);
	  let materialIndex = getMaterialIndex(gltf.materials, materialName);

	  if (!defined(materialIndex)) {
	    materialIndex = addGltfMaterial(gltf, material, options);
	  }

	  return materialIndex;
	}

	function primitiveInfoMatch(a, b) {
	  return a.hasUvs === b.hasUvs && a.hasNormals === b.hasNormals;
	}

	function getSplitMaterialName(
	  originalMaterialName,
	  primitiveInfo,
	  primitiveInfoByMaterial,
	) {
	  let splitMaterialName = originalMaterialName;
	  let suffix = 2;
	  while (defined(primitiveInfoByMaterial[splitMaterialName])) {
	    if (
	      primitiveInfoMatch(
	        primitiveInfo,
	        primitiveInfoByMaterial[splitMaterialName],
	      )
	    ) {
	      break;
	    }
	    splitMaterialName = `${originalMaterialName}-${suffix++}`;
	  }
	  return splitMaterialName;
	}

	function splitIncompatibleMaterials(nodes, materials, options) {
	  const splitMaterials = [];
	  const primitiveInfoByMaterial = {};
	  const nodesLength = nodes.length;
	  for (let i = 0; i < nodesLength; ++i) {
	    const meshes = nodes[i].meshes;
	    const meshesLength = meshes.length;
	    for (let j = 0; j < meshesLength; ++j) {
	      const primitives = meshes[j].primitives;
	      const primitivesLength = primitives.length;
	      for (let k = 0; k < primitivesLength; ++k) {
	        const primitive = primitives[k];
	        const hasUvs = primitive.uvs.length > 0;
	        const hasNormals = primitive.normals.length > 0;
	        const primitiveInfo = {
	          hasUvs: hasUvs,
	          hasNormals: hasNormals,
	        };
	        const originalMaterialName = defaultValue(
	          primitive.material,
	          "default",
	        );
	        const splitMaterialName = getSplitMaterialName(
	          originalMaterialName,
	          primitiveInfo,
	          primitiveInfoByMaterial,
	        );
	        primitive.material = splitMaterialName;
	        primitiveInfoByMaterial[splitMaterialName] = primitiveInfo;

	        let splitMaterial = getMaterialByName(
	          splitMaterials,
	          splitMaterialName,
	        );
	        if (defined(splitMaterial)) {
	          continue;
	        }

	        const originalMaterial = getMaterialByName(
	          materials,
	          originalMaterialName,
	        );
	        if (defined(originalMaterial)) {
	          splitMaterial = cloneMaterial(originalMaterial, !hasUvs);
	        } else {
	          splitMaterial = getDefaultMaterial(options);
	        }
	        splitMaterial.name = splitMaterialName;
	        splitMaterials.push(splitMaterial);
	      }
	    }
	  }
	  return splitMaterials;
	}

	function addVertexAttribute(gltf, array, components, name) {
	  const count = array.length / components;
	  const minMax = array.getMinMax(components);
	  const type = components === 3 ? "VEC3" : "VEC2";

	  const accessor = {
	    name: name,
	    componentType: WebGLConstants$1.FLOAT,
	    count: count,
	    min: minMax.min,
	    max: minMax.max,
	    type: type,
	  };

	  const accessorIndex = gltf.accessors.length;
	  gltf.accessors.push(accessor);
	  return accessorIndex;
	}

	function addIndexArray(gltf, array, uint32Indices, name) {
	  const componentType = uint32Indices
	    ? WebGLConstants$1.UNSIGNED_INT
	    : WebGLConstants$1.UNSIGNED_SHORT;
	  const count = array.length;
	  const minMax = array.getMinMax(1);

	  const accessor = {
	    name: name,
	    componentType: componentType,
	    count: count,
	    min: minMax.min,
	    max: minMax.max,
	    type: "SCALAR",
	  };

	  const accessorIndex = gltf.accessors.length;
	  gltf.accessors.push(accessor);
	  return accessorIndex;
	}

	function requiresUint32Indices(nodes) {
	  const nodesLength = nodes.length;
	  for (let i = 0; i < nodesLength; ++i) {
	    const meshes = nodes[i].meshes;
	    const meshesLength = meshes.length;
	    for (let j = 0; j < meshesLength; ++j) {
	      const primitives = meshes[j].primitives;
	      const primitivesLength = primitives.length;
	      for (let k = 0; k < primitivesLength; ++k) {
	        // Reserve the 65535 index for primitive restart
	        const vertexCount = primitives[k].positions.length / 3;
	        if (vertexCount > 65534) {
	          return true;
	        }
	      }
	    }
	  }
	  return false;
	}

	function addPrimitive(
	  gltf,
	  materials,
	  bufferState,
	  uint32Indices,
	  mesh,
	  primitive,
	  index,
	  options,
	) {
	  const hasPositions = primitive.positions.length > 0;
	  const hasNormals = primitive.normals.length > 0;
	  const hasUVs = primitive.uvs.length > 0;

	  const attributes = {};
	  if (hasPositions) {
	    const accessorIndex = addVertexAttribute(
	      gltf,
	      primitive.positions,
	      3,
	      `${mesh.name}_${index}_positions`,
	    );
	    attributes.POSITION = accessorIndex;
	    bufferState.positionBuffers.push(primitive.positions.toFloatBuffer());
	    bufferState.positionAccessors.push(accessorIndex);
	  }
	  if (hasNormals) {
	    const accessorIndex = addVertexAttribute(
	      gltf,
	      primitive.normals,
	      3,
	      `${mesh.name}_${index}_normals`,
	    );
	    attributes.NORMAL = accessorIndex;
	    bufferState.normalBuffers.push(primitive.normals.toFloatBuffer());
	    bufferState.normalAccessors.push(accessorIndex);
	  }
	  if (hasUVs) {
	    const accessorIndex = addVertexAttribute(
	      gltf,
	      primitive.uvs,
	      2,
	      `${mesh.name}_${index}_texcoords`,
	    );
	    attributes.TEXCOORD_0 = accessorIndex;
	    bufferState.uvBuffers.push(primitive.uvs.toFloatBuffer());
	    bufferState.uvAccessors.push(accessorIndex);
	  }

	  const indexAccessorIndex = addIndexArray(
	    gltf,
	    primitive.indices,
	    uint32Indices,
	    `${mesh.name}_${index}_indices`,
	  );
	  const indexBuffer = uint32Indices
	    ? primitive.indices.toUint32Buffer()
	    : primitive.indices.toUint16Buffer();
	  bufferState.indexBuffers.push(indexBuffer);
	  bufferState.indexAccessors.push(indexAccessorIndex);

	  // Unload resources
	  primitive.positions = undefined;
	  primitive.normals = undefined;
	  primitive.uvs = undefined;
	  primitive.indices = undefined;

	  const materialIndex = getOrCreateGltfMaterial(
	    gltf,
	    materials,
	    primitive.material,
	    options,
	  );

	  return {
	    attributes: attributes,
	    indices: indexAccessorIndex,
	    material: materialIndex,
	    mode: WebGLConstants$1.TRIANGLES,
	  };
	}

	function addMesh(gltf, materials, bufferState, uint32Indices, mesh, options) {
	  const gltfPrimitives = [];
	  const primitives = mesh.primitives;
	  const primitivesLength = primitives.length;
	  for (let i = 0; i < primitivesLength; ++i) {
	    gltfPrimitives.push(
	      addPrimitive(
	        gltf,
	        materials,
	        bufferState,
	        uint32Indices,
	        mesh,
	        primitives[i],
	        i,
	        options,
	      ),
	    );
	  }

	  const gltfMesh = {
	    name: mesh.name,
	    primitives: gltfPrimitives,
	  };

	  const meshIndex = gltf.meshes.length;
	  gltf.meshes.push(gltfMesh);
	  return meshIndex;
	}

	function addNode(gltf, name, meshIndex, parentIndex) {
	  const node = {
	    name: name,
	    mesh: meshIndex,
	  };

	  const nodeIndex = gltf.nodes.length;
	  gltf.nodes.push(node);

	  if (defined(parentIndex)) {
	    const parentNode = gltf.nodes[parentIndex];
	    if (!defined(parentNode.children)) {
	      parentNode.children = [];
	    }
	    parentNode.children.push(nodeIndex);
	  } else {
	    gltf.scenes[gltf.scene].nodes.push(nodeIndex);
	  }

	  return nodeIndex;
	}

	// module.exports = writeGltf;

	/**
	 * Write glTF resources as embedded data uris or external files.
	 *
	 * @param {Object} gltf The glTF asset.
	 * @param {Object} options The options object passed along from lib/obj2gltf.js
	 * @returns {Promise} A promise that resolves to the glTF JSON or glb buffer.
	 *
	 * @private
	 */
	function writeGltf(gltf, options) {
	  return encodeTextures(gltf).then(function () {
	    // const binary = options.binary;
	    // const separate = options.separate;
	    // const separateTextures = options.separateTextures;

	    const promises = [];
	    // if (separateTextures) {
	      promises.push(writeSeparateTextures(gltf));
	    // } else {
	    //   writeEmbeddedTextures(gltf);
	    // }

	    // if (separate) {
	    //   promises.push(writeSeparateBuffers(gltf, options));
	    // } else if (!binary) {
	      writeEmbeddedBuffer(gltf);
	    // }

	    // const binaryBuffer = gltf.buffers[0].extras._obj2gltf.source;

	    return bluebirdExports.Promise.all(promises).then(function () {
	      deleteExtras(gltf);
	      removeEmpty(gltf);
	      // if (binary) {
	      //   return gltfToGlb(gltf, binaryBuffer);
	      // }
	      return gltf;
	    });
	  });
	}

	function encodePng(texture) {
	  // Constants defined by pngjs
	  const rgbColorType = 2;
	  const rgbaColorType = 6;

	  const png = new PNG({
	    width: texture.width,
	    height: texture.height,
	    colorType: texture.transparent ? rgbaColorType : rgbColorType,
	    inputColorType: rgbaColorType,
	    inputHasAlpha: true,
	  });

	  png.data = texture.pixels;

	  return new bluebirdExports.Promise(function (resolve, reject) {
	    const chunks = [];
	    const stream = png.pack();
	    stream.on("data", function (chunk) {
	      chunks.push(chunk);
	    });
	    stream.on("end", function () {
	      resolve(Buffer.concat(chunks));
	    });
	    stream.on("error", reject);
	  });
	}

	function encodeTexture(texture) {
	  if (
	    !defined(texture.source) &&
	    defined(texture.pixels) &&
	    texture.extension === ".png"
	  ) {
	    return encodePng(texture).then(function (encoded) {
	      texture.source = encoded;
	    });
	  }
	}

	function encodeTextures(gltf) {
	  // Dynamically generated PBR textures need to be encoded to png prior to being saved
	  const encodePromises = [];
	  const images = gltf.images;
	  const length = images.length;
	  for (let i = 0; i < length; ++i) {
	    encodePromises.push(encodeTexture(images[i].extras._obj2gltf));
	  }
	  return bluebirdExports.Promise.all(encodePromises);
	}

	function deleteExtras(gltf) {
	  const buffers = gltf.buffers;
	  const buffersLength = buffers.length;
	  for (let i = 0; i < buffersLength; ++i) {
	    delete buffers[i].extras;
	  }

	  const images = gltf.images;
	  const imagesLength = images.length;
	  for (let i = 0; i < imagesLength; ++i) {
	    delete images[i].extras;
	  }
	}

	function removeEmpty(json) {
	  Object.keys(json).forEach(function (key) {
	    if (
	      !defined(json[key]) ||
	      (Array.isArray(json[key]) && json[key].length === 0)
	    ) {
	      delete json[key]; // Delete values that are undefined or []
	    } else if (typeof json[key] === "object") {
	      removeEmpty(json[key]);
	    }
	  });
	}

	// function writeSeparateBuffers(gltf, options) {
	//   const buffers = gltf.buffers;
	//   return Promise.map(
	//     buffers,
	//     function (buffer) {
	//       const source = buffer.extras._obj2gltf.source;
	//       const bufferUri = buffer.name + ".bin";
	//       buffer.uri = bufferUri;
	//       return options.writer(bufferUri, source);
	//     },
	//     { concurrency: 10 }
	//   );
	// }

	function writeSeparateTextures(gltf, options) {
	  const images = gltf.images;
	  return bluebirdExports.Promise.map(
	    images,
	    function (image) {
	      const texture = image.extras._obj2gltf;
	      const imageUri = image.name + texture.extension;
	      image.uri = imageUri;
	      // return options.writer(imageUri, texture.source);
	      return image;
	    },
	    { concurrency: 10 },
	  );
	}

	function writeEmbeddedBuffer(gltf) {
	  const buffer = gltf.buffers[0];
	  const source = buffer.extras._obj2gltf.source;

	  // Buffers larger than ~192MB cannot be base64 encoded due to a NodeJS limitation. Source: https://github.com/nodejs/node/issues/4266
	  if (source.length > 201326580) {
	    throw new RuntimeError(
	      "Buffer is too large to embed in the glTF. Use the --separate flag instead.",
	    );
	  }

	  buffer.uri = `data:application/octet-stream;base64,${source.toString(
    "base64",
  )}`;
	}

	// module.exports = obj2gltf;

	/**
	 * Converts an obj file to a glTF or glb.
	 *
	 * @param {String} objPath Path to the obj file.
	 * @param {Object} [options] An object with the following properties:
	 * @param {Boolean} [options.binary=false] Convert to binary glTF.
	 * @param {Boolean} [options.separate=false] Write out separate buffer files and textures instead of embedding them in the glTF.
	 * @param {Boolean} [options.separateTextures=false] Write out separate textures only.
	 * @param {Boolean} [options.checkTransparency=false] Do a more exhaustive check for texture transparency by looking at the alpha channel of each pixel.
	 * @param {Boolean} [options.secure=false] Prevent the converter from reading textures or mtl files outside of the input obj directory.
	 * @param {Boolean} [options.packOcclusion=false] Pack the occlusion texture in the red channel of the metallic-roughness texture.
	 * @param {Boolean} [options.metallicRoughness=false] The values in the mtl file are already metallic-roughness PBR values and no conversion step should be applied. Metallic is stored in the Ks and map_Ks slots and roughness is stored in the Ns and map_Ns slots.
	 * @param {Boolean} [options.specularGlossiness=false] The values in the mtl file are already specular-glossiness PBR values and no conversion step should be applied. Specular is stored in the Ks and map_Ks slots and glossiness is stored in the Ns and map_Ns slots. The glTF will be saved with the KHR_materials_pbrSpecularGlossiness extension.
	 * @param {Boolean} [options.unlit=false] The glTF will be saved with the KHR_materials_unlit extension.
	 * @param {Object} [options.overridingTextures] An object containing texture paths that override textures defined in the .mtl file. This is often convenient in workflows where the .mtl does not exist or is not set up to use PBR materials. Intended for models with a single material.
	 * @param {String} [options.overridingTextures.metallicRoughnessOcclusionTexture] Path to the metallic-roughness-occlusion texture, where occlusion is stored in the red channel, roughness is stored in the green channel, and metallic is stored in the blue channel. The model will be saved with a pbrMetallicRoughness material.
	 * @param {String} [options.overridingTextures.specularGlossinessTexture] Path to the specular-glossiness texture, where specular color is stored in the red, green, and blue channels and specular glossiness is stored in the alpha channel. The model will be saved with a material using the KHR_materials_pbrSpecularGlossiness extension.
	 * @param {String} [options.overridingTextures.occlusionTexture] Path to the occlusion texture. Ignored if metallicRoughnessOcclusionTexture is also set.
	 * @param {String} [options.overridingTextures.normalTexture] Path to the normal texture.
	 * @param {String} [options.overridingTextures.baseColorTexture] Path to the baseColor/diffuse texture.
	 * @param {String} [options.overridingTextures.emissiveTexture] Path to the emissive texture.
	 * @param {String} [options.overridingTextures.alphaTexture] Path to the alpha texture.
	 * @param {String} [options.inputUpAxis='Y'] Up axis of the obj. Choices are 'X', 'Y', and 'Z'.
	 * @param {String} [options.outputUpAxis='Y'] Up axis of the converted glTF. Choices are 'X', 'Y', and 'Z'.
	 * @param {String} [options.triangleWindingOrderSanitization=false] Apply triangle winding order sanitization.
	 * @param {Logger} [options.logger] A callback function for handling logged messages. Defaults to console.log.
	 * @param {Writer} [options.writer] A callback function that writes files that are saved as separate resources.
	 * @param {String} [options.outputDirectory] Output directory for writing separate resources when options.writer is not defined.
	 * @param {Boolean} [options.doubleSidedMaterial=false] Allows materials to be double sided.
	 * @return {Promise} A promise that resolves to the glTF JSON or glb buffer.
	 */
	function obj2gltf(objPath, options) {
	  const defaults = obj2gltf.defaults;
	  options = defaultValue(options, {});
	  options.binary = defaultValue(options.binary, defaults.binary);
	  options.separate = defaultValue(options.separate, defaults.separate);
	  options.separateTextures =
	    defaultValue(options.separateTextures, defaults.separateTextures) ||
	    options.separate;
	  options.checkTransparency = defaultValue(
	    options.checkTransparency,
	    defaults.checkTransparency,
	  );
	  options.doubleSidedMaterial = defaultValue(
	    options.doubleSidedMaterial,
	    defaults.doubleSidedMaterial,
	  );
	  options.secure = defaultValue(options.secure, defaults.secure);
	  options.packOcclusion = defaultValue(
	    options.packOcclusion,
	    defaults.packOcclusion,
	  );
	  options.metallicRoughness = defaultValue(
	    options.metallicRoughness,
	    defaults.metallicRoughness,
	  );
	  options.specularGlossiness = defaultValue(
	    options.specularGlossiness,
	    defaults.specularGlossiness,
	  );
	  options.unlit = defaultValue(options.unlit, defaults.unlit);
	  options.overridingTextures = defaultValue(
	    options.overridingTextures,
	    defaultValue.EMPTY_OBJECT,
	  );
	  options.logger = defaultValue(options.logger, getDefaultLogger());
	  // options.writer = defaultValue(
	  //   options.writer,
	  //   getDefaultWriter(options.outputDirectory),
	  // );
	  options.inputUpAxis = defaultValue(options.inputUpAxis, defaults.inputUpAxis);
	  options.outputUpAxis = defaultValue(
	    options.outputUpAxis,
	    defaults.outputUpAxis,
	  );
	  options.triangleWindingOrderSanitization = defaultValue(
	    options.triangleWindingOrderSanitization,
	    defaults.triangleWindingOrderSanitization,
	  );

	  if (!defined(objPath)) {
	    throw new DeveloperError("objPath is required");
	  }

	  // if (options.separateTextures && !defined(options.writer)) {
	  //   throw new DeveloperError(
	  //     "Either options.writer or options.outputDirectory must be defined when writing separate resources.",
	  //   );
	  // }

	  if (
	    options.metallicRoughness + options.specularGlossiness + options.unlit >
	    1
	  ) {
	    throw new DeveloperError(
	      "Only one material type may be set from [metallicRoughness, specularGlossiness, unlit].",
	    );
	  }

	  if (
	    defined(options.overridingTextures.metallicRoughnessOcclusionTexture) &&
	    defined(options.overridingTextures.specularGlossinessTexture)
	  ) {
	    throw new DeveloperError(
	      "metallicRoughnessOcclusionTexture and specularGlossinessTexture cannot both be defined.",
	    );
	  }

	  if (defined(options.overridingTextures.metallicRoughnessOcclusionTexture)) {
	    options.metallicRoughness = true;
	    options.specularGlossiness = false;
	    options.packOcclusion = true;
	  }

	  if (defined(options.overridingTextures.specularGlossinessTexture)) {
	    options.metallicRoughness = false;
	    options.specularGlossiness = true;
	  }

	  return loadObj(objPath, options)
	    .then(function (objData) {
	      return createGltf(objData, options);
	    })
	    .then(function (gltf) {
	      return writeGltf(gltf);
	    });
	}

	function getDefaultLogger() {
	  return function (message) {
	    console.log(message);
	  };
	}

	// function getDefaultWriter(outputDirectory) {
	//   if (defined(outputDirectory)) {
	//     return function (file, data) {
	//       const outputFile = path.join(outputDirectory, file);
	//       return fsExtra.outputFile(outputFile, data);
	//     };
	//   }
	// }

	/**
	 * Default values that will be used when calling obj2gltf(options) unless specified in the options object.
	 */
	obj2gltf.defaults = {
	  /**
	   * Gets or sets whether the converter will return a glb.
	   * @type Boolean
	   * @default false
	   */
	  binary: false,
	  /**
	   * Gets or sets whether to write out separate buffer and texture,
	   * shader files, and textures instead of embedding them in the glTF.
	   * @type Boolean
	   * @default false
	   */
	  separate: false,
	  /**
	   * Gets or sets whether to write out separate textures only.
	   * @type Boolean
	   * @default false
	   */
	  separateTextures: false,
	  /**
	   * Gets or sets whether the converter will do a more exhaustive check for texture transparency by looking at the alpha channel of each pixel.
	   * @type Boolean
	   * @default false
	   */
	  checkTransparency: false,
	  /**
	   * Gets and sets whether a material will be doubleSided or not
	   * @type Boolean
	   * @default false
	   */
	  doubleSidedMaterial: false,
	  /**
	   * Gets or sets whether the source model can reference paths outside of its directory.
	   * @type Boolean
	   * @default false
	   */
	  secure: false,
	  /**
	   * Gets or sets whether to pack the occlusion texture in the red channel of the metallic-roughness texture.
	   * @type Boolean
	   * @default false
	   */
	  packOcclusion: false,
	  /**
	   * Gets or sets whether rhe values in the .mtl file are already metallic-roughness PBR values and no conversion step should be applied. Metallic is stored in the Ks and map_Ks slots and roughness is stored in the Ns and map_Ns slots.
	   * @type Boolean
	   * @default false
	   */
	  metallicRoughness: false,
	  /**
	   * Gets or sets whether the values in the .mtl file are already specular-glossiness PBR values and no conversion step should be applied. Specular is stored in the Ks and map_Ks slots and glossiness is stored in the Ns and map_Ns slots. The glTF will be saved with the KHR_materials_pbrSpecularGlossiness extension.
	   * @type Boolean
	   * @default false
	   */
	  specularGlossiness: false,
	  /**
	   * Gets or sets whether the glTF will be saved with the KHR_materials_unlit extension.
	   * @type Boolean
	   * @default false
	   */
	  unlit: false,
	  /**
	   * Gets or sets the up axis of the obj.
	   * @type String
	   * @default 'Y'
	   */
	  inputUpAxis: "Y",
	  /**
	   * Gets or sets the up axis of the converted glTF.
	   * @type String
	   * @default 'Y'
	   */
	  outputUpAxis: "Y",
	  /**
	   * Gets or sets whether triangle winding order sanitization will be applied.
	   * @type Boolean
	   * @default false
	   */
	  windingOrderSanitization: false,
	};

	return obj2gltf;

}));
//# sourceMappingURL=obj2gltf.js.map
