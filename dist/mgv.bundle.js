/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return initOptList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return d3tsv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return d3json; });
/* unused harmony export deepc */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return parseCoords; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return formatCoords; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return overlaps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return subtract; });
/* unused harmony export obj2list */
/* unused harmony export same */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getCaretRange; });
/* unused harmony export setCaretRange */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return setCaretPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return moveCaretPosition; });
/* unused harmony export getCaretPosition */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return coordsAfterTransform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return removeDups; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return clip; });

// =============================================
//                    UTILS
// =============================================

// ---------------------------------------------
// (Re-)Initializes an option list.
// Args:
//   selector (string or Node) CSS selector of the container <select> element. Or the element itself.
//   opts (list) List of option data objects. May be simple strings. May be more complex.
//   value (function or null) Function to produce the <option> value from an opts item
//       Defaults to the identity function (x=>x).
//   label (function or null) Function to produce the <option> label from an opts item
//       Defaults to the value function.
//   multi (boolean) Specifies if the list support multiple selections. (default = false)
//   selected (function or null) Function to determine if a given option is selectd.
//       Defaults to d=>False. Note that this function is only applied to new options.
//   sortBy (function) Optional. If provided, a comparison function to use for sorting the options.
//   	 The comparison function is passes the data objects corresponding to two options and should
//   	 return -1, 0 or +1. If not provided, the option list will have the same sort order as the opts argument.
// Returns:
//   The option list in a D3 selection.
function initOptList(selector, opts, value, label, multi, selected, sortBy) {

    // set up the functions
    let ident = d => d;
    value = value || ident;
    label = label || value;
    selected = selected || (x => false);

    // the <select> elt
    let s = d3.select(selector);

    // multiselect
    s.property('multiple', multi || null) ;

    // bind the opts.
    let os = s.selectAll("option")
        .data(opts, label);
    os.enter()
        .append("option") 
        .attr("value", value)
        .property("selected", o => selected(o) || null)
        .text(label) 
        ;
    //
    os.exit().remove() ;

    // sort the results
    if (!sortBy) sortBy = (a,b) => {
    	let ai = opts.indexOf(a);
	let bi = opts.indexOf(b);
	return ai - bi;
    }
    os.sort(sortBy);

    //
    return s;
}

//----------------------------------------------
// Promisifies a call to d3.tsv.
// Args:
//   url (string) The url of the tsv resource
// Returns:
//   a promise that resolves to the list of row objects
function d3tsv(url) {
    return new Promise(function(resolve, reject) {
        d3.tsv(url, function(error, val){
            error ? reject({ status: error.status, statusText: error.statusText}) : resolve(val);
        })  
    }); 
}

//----------------------------------------------
// Promisifies a call to d3.json.
// Args:
//   url (string) The url of the json resource
// Returns:
//   a promise that resolves to the json object value, or rejects with an error
function d3json(url) {
    return new Promise(function(resolve, reject) {
        d3.json(url, function(error, val){
            error ? reject({ status: error.status, statusText: error.statusText}) : resolve(val);
        })  
    }); 
}

//----------------------------------------------
// Returns a deep copy of object o. 
// Args:
//   o  (object) Must be a JSON object (no curcular refs, no functions).
// Returns:
//   a deep copy of o
function deepc(o) {
    if (!o) return o;
        return JSON.parse(JSON.stringify(o));
}

//----------------------------------------------
// Parses a string of the form "chr:start..end".
// Returns:
//   object contining the parsed fields.
// Example:
//   parseCoords("10:10000000..20000000") -> {chr:"10", start:10000000, end:20000000}
function parseCoords (coords) {
    let re = /([^:]+):(\d+)\.\.(\d+)/;
    let m = coords.match(re);
    return m ? {chr:m[1], start:parseInt(m[2]), end:parseInt(m[3])} : null;
}

//----------------------------------------------
// Formats a chromosome name, start and end position as a string.
// Args (form 1):
//   coords (object) Of the form {chr:string, start:int, end:int}
// Args (form 2):
//   chr string
//   start int
//   end int
// Returns:
//     string
// Example:
//     formatCoords("10", 10000000, 20000000) -> "10:10000000..20000000"
function formatCoords (chr, start, end) {
    if (arguments.length === 1) {
	let c = chr;
	chr = c.chr;
	start = c.start;
	end = c.end;
    }
    return `${chr}:${start}..${end}`
}
//----------------------------------------------
// Returns true iff the two ranges overlap by at least 1.
// Each range must have a chr, start, and end.
//
function overlaps (a, b) {
    return a.chr === b.chr && a.start <= b.end && a.end >= b.start;
}
//----------------------------------------------
// Given two ranges, a and b, returns a - b.
// The result is a list of 0, 1 or 2 new ranges, depending on a and b.
function subtract(a, b) {
    if (a.chr !== b.chr) return [ a ];
    let abLeft = { chr:a.chr, start:a.start,                    end:Math.min(a.end, b.start-1) };
    let abRight= { chr:a.chr, start:Math.max(a.start, b.end+1), end:a.end };
    let ans = [ abLeft, abRight ].filter( r => r.start <= r.end );
    return ans;
}

//----------------------------------------------
// Creates a list of key,value pairs from the obj.
function obj2list (o) {
    return Object.keys(o).map(k => [k, o[k]])    
}

//----------------------------------------------
// Returns true iff the two lists have the same contents (based on indexOf).
// Brute force approach. Be careful where you use this.
function same (alst,blst) {
   return alst.length === blst.length && 
       alst.reduce((acc,x) => (acc && blst.indexOf(x)>=0), true);
}

//---------------------------------------------
// Add basic set ops to Set prototype.
// Lifted from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}
// ---------------------------------------------
function getCaretRange (elt) {
    // FIXME: does not work for IE
    return [elt.selectionStart, elt.selectionEnd];
}
function setCaretRange (elt, range) {
    // FIXME: does not work for IE
    elt.selectionStart = range[0];
    elt.selectionEnd   = range[1];
}
function setCaretPosition (elt, pos) {
    setCaretRange(elt, [pos,pos]);
}
function moveCaretPosition (elt, delta) {
    setCaretPosition(elt, getCaretPosition(elt) + delta);
}
function getCaretPosition (elt) {
    let r = getCaretRange(elt);
    return r[1];
}

// ---------------------------------------------
// Returns the screen coordinates of an SVG shape (circle, rect, polygon, line)
// after all transforms have been applied.
//
// Args:
//     shape (node) The SVG shape.
//
// Returns:
//     The form of the returned value depends on the shape.
//     circle:  { cx, cy, r }
//         returns the transformed center point and transformed radius         
//     line:	{ x1, y1, x2, y2 }
//         returns the transformed endpoints
//     rect:	{ x, y, width, height }
//         returns the transformed corner point and transformed width+height.
//     polygon: [ {x,y}, {x,y} , ... ]
//         returns the transformed list of points
//
// Adapted from: https://stackoverflow.com/questions/6858479/rectangle-coordinates-after-transform?rq=1
//
function coordsAfterTransform (shape) {
    //
    let dshape = d3.select(shape);
    let svg = shape.closest("svg");
    if (!svg) throw "Could not find svg ancestor.";
    let stype = shape.tagName.toLowerCase();
    let matrix = shape.getCTM();
    let p = svg.createSVGPoint();
    let p2= svg.createSVGPoint();
    //
    switch (stype) {
    //
    case 'circle':
	p.x  = parseFloat(dshape.attr("cx"));
	p.y  = parseFloat(dshape.attr("cy"));
	p2.x = p.x + parseFloat(dshape.attr("r"));
	p2.y = p.y;
	p    = p.matrixTransform(matrix);
	p2   = p2.matrixTransform(matrix);
	// calc new radius as distance between transformed points
	let dx = Math.abs(p.x - p2.x);
	let dy = Math.abs(p.y - p2.y);
	let r = Math.sqrt(dx*dx + dy*dy);
        return { cx: p.x, cy: p.y, r:r };
    //
    case 'rect':
	// FIXME: does not handle rotations correctly. To fix, translate corner points separately and then
	// calculate the transformed width and height. As a convenience to the user, might be nice to return
	// the transformed corner points and possibly the final angle of rotation.
	p.x  = parseFloat(dshape.attr("x"));
	p.y  = parseFloat(dshape.attr("y"));
	p2.x = p.x + parseFloat(dshape.attr("width"));
	p2.y = p.y + parseFloat(dshape.attr("height"));
	//
	p  = p.matrixTransform(matrix);
	p2 = p2.matrixTransform(matrix);
	//
        return { x: p.x, y: p.y, width: p2.x-p.x, height: p2.y-p.y };
    //
    case 'polygon':
        let pts = dshape.attr("points").trim().split(/ +/);
	return pts.map( pt => {
	    let xy = pt.split(",");
	    p.x = parseFloat(xy[0])
	    p.y = parseFloat(xy[1])
	    p = p.matrixTransform(matrix);
	    return { x: p.x, y: p.y };
	});
    //
    case 'line':
	p.x   = parseFloat(dshape.attr("x1"));
	p.y   = parseFloat(dshape.attr("y1"));
	p2.x  = parseFloat(dshape.attr("x2"));
	p2.y  = parseFloat(dshape.attr("y2"));
	p     = p.matrixTransform(matrix);
	p2    = p2.matrixTransform(matrix);
        return { x1: p.x, y1: p.y, x2: p2.x, x2: p2.y };
    //
    // FIXME: add case 'text'
    //

    default:
	throw "Unsupported node type: " + stype;
    }

}

// ---------------------------------------------
// Removes duplicates from a list while preserving list order.
// Args:
//     lst (list)
// Returns:
//     A processed copy of lst in which any dups have been removed.
function removeDups (lst) {
    let lst2 = [];
    let seen = new Set();
    lst.forEach(x => {
	// remove dups while preserving order
	if (seen.has(x)) return;
	lst2.push(x);
	seen.add(x);
    });
    return lst2;
}

// ---------------------------------------------
// Clips a value to a range.
function clip (n, min, max) {
    return Math.min(max, Math.max(min, n));
}

// ---------------------------------------------
// ---------------------------------------------



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Component; });
// ---------------------------------------------
class Component {
    // app - the owning app object
    // elt may be a string (selector), a DOM node, or a d3 selection of 1 node.
    constructor (app, elt) {
	this.app = app
	if (typeof(elt) === "string")
	    // elt is a CSS selector
	    this.root = d3.select(elt);
	else if (typeof(elt.selectAll) === "function")
	    // elt is a d3 selection
	    this.root = elt;
	else if (typeof(elt.getElementsByTagName) === "function")
	    // elt is a DOM node
	    this.root = d3.select(elt);
    }
    initDom () {
        // override me
    }
}




/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Feature; });
class Feature {
    constructor (cfg) {
        this.chr     = cfg.chr || cfg.chromosome;
        this.start   = cfg.start;
        this.end     = cfg.end;
        this.strand  = cfg.strand;
        this.type    = cfg.type;
        this.biotype = cfg.biotype;
        this.mgpid   = cfg.mgpid || cfg.id;
        this.mgiid   = cfg.mgiid;
        this.symbol  = cfg.symbol;
        this.genome  = cfg.genome;
	this.contig  = parseInt(cfg.contig);
	this.lane    = parseInt(cfg.lane);
        if (this.mgiid === ".") this.mgiid = null;
        if (this.symbol === ".") this.symbol = null;
    }
    //----------------------------------------------
    get ID () {
        return this.mgpid;
    }
    get canonical () {
        return this.mgiid;
    }
    get id () {
	// FIXME: remove this method
        return this.mgiid || this.mgpid;
    }
    //----------------------------------------------
    get label () {
        return this.symbol || this.mgpid;
    }
    //----------------------------------------------
    get length () {
        return this.end - this.start + 1;
    }
    //----------------------------------------------
    getMungedType () {
	return this.type === "gene" ?
	    (this.biotype === "protein_coding" || this.biotype === "protein coding gene") ?
		"protein_coding_gene"
		:
		this.biotype.indexOf("pseudogene") >= 0 ?
		    "pseudogene"
		    :
		    (this.biotype.indexOf("RNA") >= 0 || this.biotype.indexOf("antisense") >= 0) ?
			"ncRNA_gene"
			:
			this.biotype.indexOf("segment") >= 0 ?
			    "gene_segment"
			    :
			    "other_gene"
	    :
	    this.type === "pseudogene" ?
		"pseudogene"
		:
		this.type.indexOf("gene_segment") >= 0 ?
		    "gene_segment"
		    :
		    this.type.indexOf("RNA") >= 0 ?
			"ncRNA_gene"
			:
			this.type.indexOf("gene") >= 0 ?
			    "other_gene"
			    :
			    "other_feature_type";
    }
}




/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export SessionStorageManager */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LocalStorageManager; });
const PREFIX="apps.mgv.";
 
// ---------------------------------------------
// Interacts with localStorage.
//
class StorageManager {
    constructor (name, storage) {
	this.name = PREFIX+name;
	this.storage = storage;
	this.myDataObj = null;
	//
	this._load();
    }
    _load () {
	// loads myDataObj from storage
        let s = this.storage.getItem(this.name);
	this.myDataObj = s ? JSON.parse(s) : {};
    }
    _save () {
	// writes myDataObj to storage
        let s = JSON.stringify(this.myDataObj);
	this.storage.setItem(this.name, s)
    }
    get (n) {
        return this.myDataObj[n];
    }
    put (n, v) {
        this.myDataObj[n] = v;
	this._save();
    }
}
//
class SessionStorageManager extends StorageManager {
    constructor (name) {
        super(name, window.sessionStorage);
    }
}
//
class LocalStorageManager extends StorageManager {
    constructor (name) {
        super(name, window.localStorage);
    }
}
//



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListFormulaParser; });
// ---------------------------------------------
// Parses a list operator expression, eg "(a + b)*c - d"
// Returns an abstract syntax tree.
//     Leaf nodes = list names. They are simple strings.
//     Interior nodes = operations. They look like: {left:node, op:string, right:node}
// 
class ListFormulaParser {
    constructor () {
	this.r_op    = /[+-]/;
	this.r_op2   = /[*]/;
	this.r_ops   = /[()+*-]/;
	this.r_ident = /[a-zA-Z_][a-zA-Z0-9_]*/;
	this.r_qstr  = /"[^"]*"/;
	this.re = new RegExp(`(${this.r_ops.source}|${this.r_qstr.source}|${this.r_ident.source})`, 'g');
	//this.re = /([()+*-]|"[^"]+"|[a-zA-Z_][a-zA-Z0-9_]*)/g
	this._init("");
    }
    _init (s) {
        this.expr = s;
	this.tokens = this.expr.match(this.re) || [];
	this.i = 0;
    }
    _peekToken() {
	return this.tokens[this.i];
    }
    _nextToken () {
	let t;
        if (this.i < this.tokens.length) {
	    t = this.tokens[this.i];
	    this.i += 1;
	}
	return t;
    }
    _expr () {
        let node = this._term();
	let op = this._peekToken();
	if (op === "+" || op === "-") {
	    this._nextToken();
	    node = { left:node, op:op==="+"?"union":"difference", right: this._expr() }
	    return node;
        }               
	else if (op === ")" || op === undefined || op === null)
	    return node;
	else
	    this._error("UNION or INTERSECTION or ) or NULL", op);
    }
    _term () {
        let node = this._factor();
	let op = this._peekToken();
	if (op === "*") {
	    this._nextToken();
	    node = { left:node, op:"intersection", right: this._factor() }
	}
	return node;
    }
    _factor () {
        let t = this._nextToken();
	if (t === "("){
	    let node = this._expr();
	    let nt = this._nextToken();
	    if (nt !== ")") this._error("')'", nt);
	    return node;
	}
	else if (t && (t.startsWith('"'))) {
	    return t.substring(1, t.length-1);
	}
	else if (t && t.match(/[a-zA-Z_]/)) {
	    return t;
	}
	else
	    this._error("EXPR or IDENT", t||"NULL");
	return t;
	    
    }
    _error (expected, saw) {
        throw `Parse error: expected ${expected} but saw ${saw}.`;
    }
    // Parses the string and returns the abstract syntax tree.
    // Throws an exception if there is a syntax error.
    parse (s) {
	this._init(s);
	return this._expr();
    }
    // returns true iff string is syntactically valid
    isValid (s) {
        try {
	    this.parse(s);
	    return true;
	}
	catch (e) {
	    return false;
	}
    }
}




/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MGVApp__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



// ---------------------------------------------
// ---------------------------------------------
//
// pqstring = Parse qstring. Parses the parameter portion of the URL.
//
function pqstring (qstring) {
    //
    let cfg = {};

    // FIXME: URLSearchParams API is not supported in all browsers.
    // OK for development but need a fallback eventually.
    let prms = new URLSearchParams(qstring);
    let genomes = [];

    // ----- genomes ------------
    let pgenomes = prms.get("genomes") || "";
    // For now, allow "comps" as synonym for "genomes". Eventually, don't support "comps".
    pgenomes = (pgenomes +  " " + (prms.get("comps") || ""));
    //
    pgenomes = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["k" /* removeDups */])(pgenomes.trim().split(/ +/));
    pgenomes.length > 0 && (cfg.genomes = pgenomes);

    // ----- ref genome ------------
    let ref = prms.get("ref");
    ref && (cfg.ref = ref);

    // ----- highlight IDs --------------
    let hls = new Set();
    let hls0 = prms.get("highlight");
    if (hls0) {
	hls0 = hls0.replace(/[ ,]+/g, ' ').split(' ').filter(x=>x);
	hls0.length > 0 && (cfg.highlight = hls0);
    }

    // ----- coordinates --------------
    //
    let chr   = prms.get("chr");
    let start = prms.get("start");
    let end   = prms.get("end");
    chr   && (cfg.chr = chr);
    start && (cfg.start = parseInt(start));
    end   && (cfg.end = parseInt(end));
    //
    let landmark = prms.get("landmark");
    let flank    = prms.get("flank");
    let length   = prms.get("length");
    let delta    = prms.get("delta");
    landmark && (cfg.landmark = landmark);
    flank    && (cfg.flank = parseInt(flank));
    length   && (cfg.length = parseInt(length));
    delta    && (cfg.delta = parseInt(delta));
    //
    // ----- drawing mode -------------
    let dmode = prms.get("dmode");
    dmode && (cfg.dmode = dmode);
    //
    return cfg;
}


// The main program, wherein the app is created and wired to the browser. 
//
function __main__ (selector) {
    // Behold, the MGV application object...
    let mgv = null;

    // Callback to pass into the app to register changes in context.
    // Uses the current app context to set the hash part of the
    // browser's location. This also registers the change in 
    // the browser history.
    function setHash () {
	let newHash = mgv.getParamString();
	if ('#'+newHash === window.location.hash)
	    return;
	// temporarily disable popstate handler
	let f = window.onpopstate;
	window.onpopstate = null;
	// now set the hash
	window.location.hash = newHash;
	// re-enable
	window.onpopstate = f;
    }
    // Handler called when user clicks the browser's back or forward buttons.
    // Sets the app's context based on the hash part of the browser's
    // location.
    window.onpopstate = function(event) {
	let cfg = pqstring(document.location.hash.substring(1));
	mgv.setContext(cfg, true);
    };
    // get initial set of context params 
    let qstring = window.location.hash.substring(1);
    let cfg = pqstring(qstring);
    cfg.width = window.innerWidth;
    cfg.oncontextchange = setHash;

    // create the app
    window.mgv = mgv = new __WEBPACK_IMPORTED_MODULE_0__MGVApp__["a" /* MGVApp */](selector, cfg);
    
    // handle resize events
    window.onresize = () => {mgv.resize();mgv.setContext({});}
}


__main__("#mgv");


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MGVApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Genome__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__FeatureManager__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__QueryManager__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ListManager__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ListEditor__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__UserPrefsManager__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__FacetManager__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__BTManager__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__GenomeView__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__FeatureDetails__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ZoomView__ = __webpack_require__(21);














// ---------------------------------------------
class MGVApp extends __WEBPACK_IMPORTED_MODULE_2__Component__["a" /* Component */] {
    constructor (selector, cfg) {
	super(null, selector);
	this.app = this;
	//
	this.initialCfg = cfg;
	//
	this.contextChanged = (cfg.oncontextchange || function(){});
	//
	this.name2genome = {};  // map from genome name -> genome data obj
	this.label2genome = {}; // map from genome label -> genome data obj
	this.nl2genome = {};    // combines indexes
	//
	this.allGenomes = [];   // list of all available genomes
	this.rGenome = null;    // the current reference genome
	this.cGenomes = [];     // current comparison genomes (rGenome is *not* included).
	this.vGenomes = [];	// list of all currenty viewed genomes (ref+comps) in Y-order.
	//
	this.dur = 250;         // animation duration, in ms
	this.defaultZoom = 2;	// multiplier of current range width. Must be >= 1. 1 == no zoom.
				// (zooming in uses 1/this amount)
	this.defaultPan  = 0.15;// fraction of current range width

	// Coordinates may be specified in one of two ways: mapped or landmark. 
	// Mapped coordinates are specified as chromosome+start+end. This coordinate range is defined relative to 
	// the current reference genome, and is mapped to the corresponding range(s) in each comparison genome.
	// Landmark coordinates are specified as landmark+[flank|width]+delta. The landmark is looked up in each 
	// genome. Its coordinates, combined with flank|length and delta, determine the absolute coordinate range
	// in that genome. If the landmark does not exist in a given genome, then mapped coordinate are used.
	// 
	this.cmode = 'mapped' // 'mapped' or 'landmark'
	this.coords = { chr: '1', start: 1000000, end: 10000000 };  // mapped
	this.lcoords = { landmark: 'Pax6', flank: 500000, delta:0 };// landmark

	//
	// TODO: refactor pagebox, draggable, and friends into a framework module,
	// 
	this.pbDragger = this.getContentDragger();
	d3.selectAll('.pagebox')
	    .call(this.pbDragger)
	    .append('i')
	    .attr('class','material-icons busy rotating')
	    ;
	d3.selectAll('.closable')
	    .append('i')
		.attr('class','material-icons button close')
		.attr('title','Click to open/close.')
		.on('click.default', function () {
		    let p = d3.select(this.parentNode);
		    p.classed('closed', ! p.classed('closed'));
		    d3.select(this).attr('title','Click to ' +  (p.classed('closed') ? 'open' : 'close') + '.')
		    self.setPrefsFromUI();
		});
	d3.selectAll('.content-draggable > *')
	    .append('i')
		.attr('title','Drag up/down to reposition.')
		.attr('class','material-icons button draghandle');

	// 
        d3.select('#statusMessage')
	    .on('click', () => { this.showStatus(false); });
	
	//
	//
	this.genomeView = new __WEBPACK_IMPORTED_MODULE_10__GenomeView__["a" /* GenomeView */](this, '#genomeView', 800, 250);
	this.zoomView   = new __WEBPACK_IMPORTED_MODULE_12__ZoomView__["a" /* ZoomView */]  (this, '#zoomView', 800, 250, this.coords);
	this.resize();
        //
	this.featureDetails = new __WEBPACK_IMPORTED_MODULE_11__FeatureDetails__["a" /* FeatureDetails */](this, '#featureDetails');

	this.cscale = d3.scale.category10().domain([
	    'protein_coding_gene',
	    'pseudogene',
	    'ncRNA_gene',
	    'gene_segment',
	    'other_gene',
	    'other_feature_type'
	]);
	//
	//
	this.listManager    = new __WEBPACK_IMPORTED_MODULE_5__ListManager__["a" /* ListManager */](this, "#mylists");
	this.listManager.update();
	//
	this.listEditor = new __WEBPACK_IMPORTED_MODULE_6__ListEditor__["a" /* ListEditor */](this, '#listeditor');
	//
	this.translator     = new __WEBPACK_IMPORTED_MODULE_9__BTManager__["a" /* BTManager */](this);
	this.featureManager = new __WEBPACK_IMPORTED_MODULE_3__FeatureManager__["a" /* FeatureManager */](this);
	//
	let searchTypes = [{
	    method: "featuresByFunction",
	    label: "...by cellular function",
	    template: "",
	    placeholder: "Gene Ontology (GO) terms/IDs"
	},{
	    method: "featuresByPhenotype",
	    label: "...by mutant phenotype",
	    template: "",
	    placeholder: "Mammalian Phenotype (MP) terms/IDs"
	},{
	    method: "featuresByDisease",
	    label: "...by disease implication",
	    template: "",
	    placeholder: "Disease Ontology (DO) terms/IDs"
	},{
	    method: "featuresById",
	    label: "...by nomenclature",
	    template: "",
	    placeholder: "MGI names, synonyms, etc."
	}];
	this.queryManager = new __WEBPACK_IMPORTED_MODULE_4__QueryManager__["a" /* QueryManager */](this, "#findGenesBox", searchTypes);
	//
	this.userPrefsManager = new __WEBPACK_IMPORTED_MODULE_7__UserPrefsManager__["a" /* UserPrefsManager */]();
	//
	// Button: Gear icon to show/hide left column
	d3.select("#header > .gear.button")
	    .on("click", () => {
	        let lc = this.root.select('[name="leftcolumn"]');
		lc.classed("closed", () => ! lc.classed("closed"));
		window.setTimeout(()=>{
		    this.resize()
		    this.setContext({});
		    this.setPrefsFromUI();
		}, 250);
	    });
	
	//
	// -------------------------------------------------------------------
	// Facets
	// -------------------------------------------------------------------
	//
	this.facetManager = new __WEBPACK_IMPORTED_MODULE_8__FacetManager__["a" /* FacetManager */](this);
	let self = this;

	// Feature-type facet
	let ftFacet  = this.facetManager.addFacet("FeatureType", f => f.getMungedType());
	this.initFeatTypeControl(ftFacet);

	// Has-MGI-id facet
	let mgiFacet = this.facetManager.addFacet("HasMgiId",    f => f.mgiid  ? "yes" : "no" );
	d3.selectAll('input[name="mgiFacet"]').on("change", function(){
	    mgiFacet.setValues(this.value === "" ? [] : [this.value]);
	    self.zoomView.highlight();
	});

	// Is-highlighted facet
	let hiFacet = this.facetManager.addFacet("IsHi", f => {
	    let ishi = this.zoomView.hiFeats[f.mgiid] || this.zoomView.hiFeats[f.mgpid];
	    return ishi ? "yes" : "no";
	});
	d3.selectAll('input[name="hiFacet"]').on("change", function(){
	    hiFacet.setValues(this.value === "" ? [] : [this.value]);
	    self.zoomView.highlight();
	});


	//
	this.setUIFromPrefs();

	// ------------------------------
	// ------------------------------

	// Things are all wired up. Now let's get some data.
	// Start with the file of all the genomes.
	Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* d3tsv */])("./data/genomeList.tsv").then(function(data){
	    // create Genome objects from the raw data.
	    this.allGenomes   = data.map(g => new __WEBPACK_IMPORTED_MODULE_1__Genome__["a" /* Genome */](g));
	    this.allGenomes.sort( (a,b) => {
	        return a.label < b.label ? -1 : a.label > b.label ? +1 : 0;
	    });
	    //
	    // build a name->Genome index
	    this.nl2genome = {}; // also build the combined list at the same time...
	    this.name2genome  = this.allGenomes
	        .reduce((acc,g) => { this.nl2genome[g.name] = acc[g.name] = g; return acc; }, {});
	    // build a label->Genome index
	    this.label2genome = this.allGenomes
	        .reduce((acc,g) => { this.nl2genome[g.label] = acc[g.label] = g; return acc; }, {});

	    // Preload all the chromosome files for all the genomes
	    let cdps = this.allGenomes.map(g => Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* d3tsv */])(`./data/genomedata/${g.name}-chromosomes.tsv`));
	    return Promise.all(cdps);
	}.bind(this))
	.then(function (data) {

	    //
	    this.processChromosomes(data);

	    //
	    let cfg = this.sanitizeCfg(this.initialCfg);
	    let self = this;

	    // initialize the ref and comp genome option lists
	    Object(__WEBPACK_IMPORTED_MODULE_0__utils__["g" /* initOptList */])("#refGenome",   this.allGenomes, g=>g.name, g=>g.label, false, g => g === cfg.ref);
	    Object(__WEBPACK_IMPORTED_MODULE_0__utils__["g" /* initOptList */])("#compGenomes", this.allGenomes, g=>g.name, g=>g.label, true,  g => cfg.genomes.indexOf(g) !== -1);
	    d3.select("#refGenome").on("change", function() {
		self.setContext({ ref: this.value });
	    });
	    d3.select("#compGenomes").on("change", function() {
		let selectedNames = [];
		for(let x of this.selectedOptions){
		    selectedNames.push(x.value);
		}
		// want to preserve current genome order as much as possible 
		let gNames = self.vGenomes.map(g=>g.name)
		    .filter(n => {
		        return selectedNames.indexOf(n) >= 0 || n === self.rGenome.name;
		    });
		gNames = gNames.concat(selectedNames.filter(n => gNames.indexOf(n) === -1));
		self.setContext({ genomes: gNames });
	    });
	    //
	    // FINALLY! We are ready to draw the initial scene.
	    this.setContext(this.initialCfg);

	}.bind(this));
    }
    //----------------------------------------------
    processChromosomes (data) {
	// data is a list of chromosome lists, one per genome
	// Fill in the genomeChrs map (genome -> chr list)
	this.allGenomes.forEach((g,i) => {
	    // nicely sort the chromosomes
	    let chrs = data[i];
	    g.maxlen = 0;
	    chrs.forEach( c => {
		//
		c.length = parseInt(c.length)
		g.maxlen = Math.max(g.maxlen, c.length);
		// because I'd rather say "chromosome.name" than "chromosome.chromosome"
		c.name = c.chromosome;
		delete c.chromosome;
	    });
	    // nicely sort the chromosomes
	    chrs.sort((a,b) => {
		let aa = parseInt(a.name) - parseInt(b.name);
		if (!isNaN(aa)) return aa;
		return a.name < b.name ? -1 : a.name > b.name ? +1 : 0;
	    });
	    g.chromosomes = chrs;
	});
    }
    //----------------------------------------------
    initDom () {
    }

    //----------------------------------------------
    getContentDragger () {
      let self = this;
      // Helper function for the drag behavior. Reorders the contents based on
      // current screen position of the dragged item.
      function reorderByDom() {
	  // Locate the sib whose position is beyond the dragged item by the least amount
	  let dr = self.dragging.getBoundingClientRect();
	  let bSib = null;
	  let xy = d3.select(self.dragParent).classed("flexrow") ? "x" : "y";
	  for (let s of self.dragSibs) {
	      let sr = s.getBoundingClientRect();
	      if (dr[xy] < sr[xy]) {
		   let dist = sr[xy] - dr[xy];
		   if (!bSib || dist < bSib[xy] - dr[xy])
		       bSib = s;
	      }
	  }
	  // Insert the dragged item before the located sib (or append if no sib found)
	  self.dragParent.insertBefore(self.dragging, bSib);
      }
      function reorderByStyle() {
	  let dd = d3.select(self.dragging);
	  // Locate the sib that contains the dragged item's origin.
	  let dr = self.dragging.getBoundingClientRect();
	  let bSib = null;
	  let xy = d3.select(self.dragParent).classed("flexrow") ? "x" : "y";
	  let sz = xy === "x" ? "width" : "height";
	  let sty= xy === "x" ? "left" : "top";
	  for (let s of self.dragSibs) {
	      // skip the dragged item
	      if (s === self.dragging) continue;
	      let ds = d3.select(s);
	      let sr = s.getBoundingClientRect();
	      // ifw the dragged item's origin is between the start and end of sib, we found it.
	      if (dr[xy] >= sr[xy] && dr[xy] <= (sr[xy] + sr[sz])) {
		   // move sib toward the hole, amount = the size of the hole
		   let amt = self.dragHole[sz] * (self.dragHole[xy] < sr[xy] ? -1 : 1);
		   ds.style(sty, parseInt(ds.style(sty)) + amt + "px");
		   self.dragHole[xy] -= amt;
                   break;
	      }
	  }
      }
      //
      return d3.behavior.drag()
	  .origin(function(d,i){
	      return this.getBoundingClientRect();
	  })
          .on("dragstart.m", function() {
	      let t = d3.event.sourceEvent.target;
	      if (! d3.select(t).classed("draghandle")) return;
	      d3.event.sourceEvent.stopPropagation();
	      //
	      self.dragging    = this.closest(".pagebox");
	      self.dragHole    = self.dragging.getBoundingClientRect();
	      self.dragParent  = self.dragging.parentNode;
	      self.dragSibs    = self.dragParent.children;
	      //
	      d3.select(self.dragging).classed("dragging", true);
	  })
	  .on("drag.m", function () {
	      if (!self.dragging) return;
	      let dd = d3.select(self.dragging);
	      let tp = parseInt(dd.style("top"))
	      dd.style("top", tp + d3.event.dy + "px");
	      //reorderByStyle();
	  })
	  .on("dragend.m", function () {
	      if (!self.dragging) return;
	      reorderByDom();
	      self.setPrefsFromUI();
	      let dd = d3.select(self.dragging);
	      dd.style("top", "0px");
	      dd.classed("dragging", false);
	      self.dragging    = null;
	      self.dragHole    = null;
	      self.dragParent  = null;
	      self.dragSibs    = null;
	  })
	  ;
    }
    //----------------------------------------------
    setUIFromPrefs () {
        let prefs = this.userPrefsManager.getAll();
	console.log("Got prefs from storage", prefs);

	// set open/closed states
	(prefs.closables || []).forEach( c => {
	    let id = c[0];
	    let state = c[1];
	    d3.select('#'+id).classed('closed', state === "closed" || null);
	});

	// set draggables' order
	(prefs.draggables || []).forEach( d => {
	    let ctrId = d[0];
	    let contentIds = d[1];
	    let ctr = d3.select('#'+ctrId);
	    let contents = ctr.selectAll('#'+ctrId+' > *');
	    contents[0].sort( (a,b) => {
	        let ai = contentIds.indexOf(a.getAttribute('id'));
	        let bi = contentIds.indexOf(b.getAttribute('id'));
		return ai - bi;
	    });
	    contents.order();
	});
    }
    setPrefsFromUI () {
        // save open/closed states
	let closables = this.root.selectAll('.closable');
	let ocData = closables[0].map( c => {
	    let dc = d3.select(c);
	    return [dc.attr('id'), dc.classed("closed") ? "closed" : "open"];
	});
	// save draggables' order
	let dragCtrs = this.root.selectAll('.content-draggable');
	let draggables = dragCtrs.selectAll('.content-draggable > *');
	let ddData = draggables.map( (d,i) => {
	    let ctr = d3.select(dragCtrs[0][i]);
	    return [ctr.attr('id'), d.map( dd => d3.select(dd).attr('id'))];
	});
	let prefs = {
	    closables: ocData,
	    draggables: ddData
	}
	console.log("Saving prefs to storage", prefs);
	this.userPrefsManager.setAll(prefs);
    }
    //----------------------------------------------
    showBlocks (comp) {
	let ref = this.rGenome;
	if (! comp) comp = this.cGenomes[0];
	if (! comp) return;
	this.translator.ready().then( () => {
	    let blocks = comp === ref ? [] : this.translator.getBlocks(ref, comp);
	    this.genomeView.drawBlocks({ ref, comp, blocks });
	});
    }
    //----------------------------------------------
    showBusy (isBusy, message) {
        d3.select("#header > .gear.button")
	    .classed("rotating", isBusy);
        d3.select("#zoomView").classed("busy", isBusy);
	if (isBusy && message) this.showStatus(message);
	if (!isBusy) this.showStatus('')
    }
    //----------------------------------------------
    showStatus (msg) {
	if (msg)
	    d3.select('#statusMessage')
		.classed('showing', true)
		.select('span')
		    .text(msg);
	else
	    d3.select('#statusMessage').classed('showing', false);
    }

    //----------------------------------------------
    setRefGenomeSelection () {
	d3.selectAll("#refGenome option")
	    .property("selected",  gg => (gg.label === this.rGenome.label  || null));
    }
    //----------------------------------------------
    setCompGenomesSelection () {
	let cgns = this.vGenomes.map(g=>g.label);
	d3.selectAll("#compGenomes option")
	        .property("selected",  gg => cgns.indexOf(gg.label) >= 0);
    }
    //----------------------------------------------
    // Sets or returns
    setHighlight (flist) {
	if (!flist) return false;
	this.zoomView.hiFeats = flist.reduce((a,v) => { a[v]=v; return a; }, {});
	return true;
    }
    //----------------------------------------------
    // Returns the current context as an object.
    // Current context = ref genome + comp genomes + current range (chr,start,end)
    getContext () {
	if (this.cmode === 'mapped') {
	    let c = this.coords;
	    return {
		ref : this.rGenome.label,
		genomes: this.vGenomes.map(g=>g.label),
		chr: c.chr,
		start: c.start,
		end: c.end,
		highlight: Object.keys(this.zoomView.hiFeats).sort(),
		dmode: this.zoomView.dmode
	    }
	} else {
	    let c = this.lcoords;
	    return {
		ref : this.rGenome.label,
		genomes: this.vGenomes.map(g=>g.label),
		landmark: c.landmark,
		flank: c.flank,
		length: c.length,
		delta: c.delta,
		highlight: Object.keys(this.zoomView.hiFeats).sort(),
		dmode: this.zoomView.dmode
	    }
	}
    }
    //----------------------------------------------
    // Resolves the specified landmark to a feature and the list of equivalent feaures.
    // May be given an id, canonical id, or symbol.
    // Args:
    //     cfg (obj) Sanitized config object, with a landmark (string) field.
    // Returns:
    //     The cfg object, with additional fields:
    //        landmarkRefFeat: the landmark (Feature obj) in the ref genome
    //        landmarkFeats: [ equivalent features in each genome (includes rf)]
    //     Also, changes ref to be the genome of the landmarkRefFeat
    //     Returns null if landmark not found in any genome.
    // 
    resolveLandmark (cfg) {
	let rf, feats;
	// Find the landmark feature in the ref genome. 
	rf = this.featureManager.getCachedFeaturesByLabel(cfg.landmark, cfg.ref)[0];
	if (rf) {
	    // landmark exists in ref genome. Get equivalent feat in each genome.
	    feats = rf.canonical ? this.featureManager.getCachedFeaturesByCanonicalId(rf.canonical) : [rf];
	}
	else {
	    // landmark does not exist in ref genome. Does it exist anywhere?
	    rf = this.featureManager.getCachedFeaturesByLabel(cfg.landmark)[0];
	    if (rf) {
	        // Yes, landmark exists in another genome.
		// Change ref genome and proceed.
		cfg.ref = rf.genome;
		feats = rf.canonical ? this.featureManager.getCachedFeaturesByCanonicalId(rf.canonical) : [rf];
	    }
	    else {
	        // landmark doesn't exist anywhere. 
		return null;
	    }
	}
	cfg.landmarkRefFeat = rf;
	cfg.landmarkFeats = feats
	return cfg;
    }
    //----------------------------------------------
    // Returns a sanitized version of the argument configuration object.
    // The sanitized version:
    //     - has a setting for every parameter. Parameters not specified in 
    //       the argument are (generally) filled in with their current values.
    //     - is always valid, eg
    //     	- has a list of 1 or more valid genomes, with one of them designated as the ref
    //     	- has a valid coordinate range
    //     	    - start and end are integers with start <= end
    //     	    - valid chromosome for ref genome
    //
    // The sanitized version is also "compiled":
    //     - it has actual Genome objects, where the argument just has names
    //     - groups the chr+start+end in "coords" object
    //
    //
    sanitizeCfg (c) {
	let cfg = {};

	// Sanitize the input.

	// window size -----------------------------------------------------------------
	if (c.width) {
	    cfg.width = c.width
	}

	// ref genome ------------------------------------------------------------------
	//
	// Set cfg.ref to specified genome, 
	//   with fallback to current ref genome, 
	//      with fallback to C57BL/6J (1st time thru)
	// FIXME: final fallback should be a config setting.
	cfg.ref = (c.ref ? this.nl2genome[c.ref] || this.rGenome : this.rGenome) || this.nl2genome['C57BL/6J'];

	// comparison genomes ----------------------------------------------------------
	// Set cfg.genomes to be the specified genomes,
	//     with fallback to the current genomes
	//        with fallback to [ref] (1st time thru)
	cfg.genomes = c.genomes ?
	    (c.genomes.map(g => this.nl2genome[g]).filter(x=>x))
	    :
	    this.vGenomes;
	// Add ref to genomes if not there already
	if (cfg.genomes.indexOf(cfg.ref) === -1)
	    cfg.genomes.unshift(cfg.ref);
	
	// absolute coordinates -----------------------------------------------------------------
	//
	// Set cfg.chr to be the specified chromosome
	//     with fallback to the current chr
	//         with fallback to the 1st chromosome in the ref genome
	cfg.chr = cfg.ref.getChromosome(c.chr);
	if (!cfg.chr) cfg.chr = cfg.ref.getChromosome( this.coords ? this.coords.chr : "1" );
	if (!cfg.chr) cfg.chr = cfg.ref.getChromosome(0);
	if (!cfg.chr) throw "No chromosome."
	
	// Set cfg.start to be the specified start with fallback to the current start
	// Clip at chr boundaries
	cfg.start = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* clip */])(Math.round(typeof(c.start) === "number" ? c.start : this.coords.start), 1, cfg.chr.length);

	// Set cfg.end to be the specified end with fallback to the current end
	// Clip at chr boundaries
	cfg.end = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* clip */])(Math.round(typeof(c.end) === "number" ? c.end : this.coords.end), 1, cfg.chr.length);

	// Ensure start <= end
	if (cfg.start > cfg.end) {
	   let tmp = cfg.start; cfg.start = cfg.end; cfg.end = tmp;
	}

	// landmark coordinates --------------------------------------------------------
	// NOTE that landmark coordinate cannot be fully resolved to absolute coordinate until
	// *after* genome data have been loaded. See setContext and resolveLandmark methods.
	cfg.landmark = c.landmark || this.lcoords.landmark;
	cfg.delta    = Math.round('delta' in c ? c.delta : (this.lcoords.delta || 0));
	if ('flank' in c){
	    cfg.flank = Math.round(c.flank);
	}
	else if ('length' in c) {
	    cfg.length = Math.round(c.length);
	}
	else {
	    cfg.length = Math.round(this.coords.end - this.coords.start + 1);
	}

	// cmode -----------------------------------------------------------------------
	if (c.cmode && c.cmode !== 'mapped' && c.cmode !== 'landmark') c.cmode = null;
	cfg.cmode = c.cmode || 
	    (('chr' in c || 'start' in c || 'end' in c) ?
	        'mapped' : 
		('landmark' in c || 'flank' in c || 'length' in c || 'delta' in c) ?
		    'landmark' : 
		    this.cmode || 'mapped');

	// highlighting ----------------------------------------------------------------
	// Set cfg.highlight
	//    with fallback to current highlight
	//        with fallback to []
	cfg.highlight = c.highlight || this.zoomView.highlighted || [];

	// drawing mode ----------------------------------------------------------------
	// Set the drawing mode for the ZoomView.
	//     with fallback to the current value
	if (c.dmode === 'comparison' || c.dmode === 'reference') 
	    cfg.dmode = c.dmode;
	else
	    cfg.dmode = this.zoomView.dmode || 'comparison';

	//
	return cfg;
    }

    //----------------------------------------------
    // Sets the current context from the config object. 
    // Only those context items specified in the config are affected, except as noted.
    //
    // All configs are sanitized before being applied (see sanitizeCfg).
    // 
    // Args:
    //    c (object) A configuration object that specifies some/all config values.
    //         The possible config items:
    //            genomes   (list o strings) All the genomes you want to see, in top-to-bottom order. 
    //               May use internal names or display labels, eg, "mus_musculus_129s1svimj" or "129S1/SvImJ".
    //            ref       (string) The genome to use as the reference. May be name or label.
    //            highlight (list o strings) IDs of features to highlight
    //            dmode     (string) either 'comparison' or 'reference'
    //
    //            Coordinates are specified in one of 2 forms.
    //              chr       (string) Chromosome for coordinate range
    //              start     (int) Coordinate range start position
    //              end       (int) Coordinate range end position
    //
    //              Displays this coordinate range from the current reference geneoms, and the equivalent (mapped)
    //              coordinate range(s) in each comparison genome.
    //
    //            or:
    //              landmark  (string) ID, canonical ID, or symbol, identifying a feature.
    //              flank|length (int) If flank, viewing region size = flank + len(landmark) + flank. 
    //                 If length, viewing region size = length. In either case, the landmark is centered in
    //                 the viewing area, +/- any specified delta.
    //              delta     (int) Amount in bp to shift the region left (<0) or right (>0).
    //
    //              Displays the region around the specified landmark in each genome where it exists.
    //
    //    quietly (boolean) If true, don't update browser history (as when going back)
    //
    // Returns:
    //    Nothing
    // Side effects:
    //	  Redraws 
    //	  Calls contextChanged() 
    //
    setContext (c, quietly) {
        let cfg = this.sanitizeCfg(c);
	console.log("Set context (raw):", c);
	console.log("Set context (sanitized):", cfg);
	if (!cfg) return;
	this.showBusy(true, 'Requesting data...');
	let p = this.featureManager.loadGenomes(cfg.genomes).then(() => {
	    if (cfg.cmode === 'landmark')
	        this.resolveLandmark(cfg);
	    //
	    this.vGenomes = cfg.genomes;
	    this.rGenome  = cfg.ref;
	    this.cGenomes = cfg.genomes.filter(g => g !== cfg.ref);
	    this.setRefGenomeSelection(this.rGenome.name);
	    this.setCompGenomesSelection(this.vGenomes.map(g=>g.name));
	    //
	    this.cmode = cfg.cmode;
	    return this.translator.ready();
	}).then(() => {
	    //
	    this.coords   = { chr: cfg.chr.name, start: cfg.start, end: cfg.end };
	    this.lcoords  = {
	        landmark: cfg.landmark, 
		landmarkRefFeat: cfg.landmarkRefFeat,
		landmarkFeats: cfg.landmarkFeats,
		flank: cfg.flank, 
		length: cfg.length, 
		delta: cfg.delta 
	    };
	    //
	    this.zoomView.highlighted = cfg.highlight;
	    this.zoomView.genomes = this.vGenomes;
	    this.zoomView.dmode = cfg.dmode;
	    this.zoomView.update();
	    //
	    this.genomeView.redraw();
	    this.genomeView.setBrushCoords(this.coords);
	    //
	    if (!quietly)
	        this.contextChanged();
	    //
	    this.showBusy(false);
	});
	return p;
    }
 
    //----------------------------------------------
    setCoordinates (str) {
	let coords = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["j" /* parseCoords */])(str);
	if (! coords) {
	    let feats = this.featureManager.getCachedFeaturesByLabel(str);
	    let feats2 = feats.filter(f=>f.genome == this.rGenome);
	    let f = feats2[0] || feats[0];
	    if (f) {
		coords = {
		    ref: f.genome.name,
		    landmark: str,
		    highlight: f.id
		}
	    }
	    else {
		alert("Unable to set coordinates with this value: " + str);
		return;
	    }
	}
	this.setContext(coords);
    }

    //----------------------------------------------
    resize () {
	let w = window.innerWidth - 24;
	this.genomeView.fitToWidth(w);
	this.zoomView.fitToWidth(w);
    }
    //----------------------------------------------
    // Returns the current context as a parameter string
    // Current context = ref genome + comp genomes + current range (chr,start,end)
    getParamString () {
	let c = this.getContext();
        let ref = `ref=${c.ref}`;
        let genomes = `genomes=${c.genomes.join("+")}`;
	let coords = `chr=${c.chr}&start=${c.start}&end=${c.end}`;
	let lflf = c.flank ? '&flank='+c.flank : '&length='+c.length;
	let lcoords = `landmark=${c.landmark}&delta=${c.delta}${lflf}`;
	let hls = `highlight=${c.highlight.join("+")}`;
	let dmode = `dmode=${c.dmode}`;
	return `${this.cmode==='mapped'?coords:lcoords}&${dmode}&${ref}&${genomes}&${hls}`;
    }

    //----------------------------------------------
    get currentList () {
        return this.currList;
    }
    //----------------------------------------------
    set currentList (lst) {
    	//
	let prevList = this.currList;
	this.currList = lst;
	//
	let lists = d3.select('#mylists').selectAll('.listInfo');
	lists.classed("current", d => d === lst);
	//
	if (lst) {
	    if (lst === prevList)
	        this.currListCounter = (this.currListCounter + 1) % this.currList.ids.length;
	    else
	        this.currListCounter = 0;
	    let currId = lst.ids[this.currListCounter];
	    // show this list as tick marks in the genome view
	    this.featureManager.getFeaturesById(this.rGenome, lst.ids)
		.then( feats => {
		    this.genomeView.drawTicks(feats);
		    this.genomeView.drawTitle();
		    this.setCoordinates(currId);
		});
	}
	else {
	    this.currListCounter = 0;
	    //
	    this.zoomView.hiFeats = {};
	    this.zoomView.update();
	    //
	    this.genomeView.drawTicks([]);
	    this.genomeView.drawTitle();
	}
    }

    //----------------------------------------------
    // Zooms in/out by factor. New zoom width is factor * the current width.
    // Factor > 1 zooms out, 0 < factor < 1 zooms in.
    zoom (factor) {
	let len = this.coords.end - this.coords.start + 1;
	let newlen = Math.round(factor * len);
	let x = (this.coords.start + this.coords.end)/2;
	if (this.cmode === 'mapped') {
	    let newstart = Math.round(x - newlen/2);
	    this.setContext({ chr: this.coords.chr, start: newstart, end: newstart + newlen - 1 });
	}
	else {
	    this.setContext({ length: newlen });
	}
    }

    //----------------------------------------------
    // Pans the view left or right by factor. The distance moved is factor times the current zoom width.
    // Negative values pan left. Positive values pan right. (Note that panning moves the "camera". Panning to the
    // right makes the objects in the scene appear to move to the left, and vice versa.)
    //
    pan (factor) {
	let c = this.coords;
	let chr = this.rGenome.chromosomes.filter(c => c.name === this.coords.chr)[0];
	let width = c.end - c.start + 1;
	let minD = -(c.start-1);
	let maxD = chr.length - c.end;
	let d = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* clip */])(factor * width, minD, maxD);
	if (this.cmode === 'mapped') {
	    this.setContext({ chr: c.chr, start: c.start+d, end: c.end+d });
	}
	else {
	    this.setContext({ delta: this.lcoords.delta + d });
	}
    }

    //----------------------------------------------
    initFeatTypeControl (facet) {
	let self = this;
	let colors = this.cscale.domain().map(lbl => {
	    return { lbl:lbl, clr:this.cscale(lbl) };
	});
	let ckes = d3.select(".colorKey")
	    .selectAll('.colorKeyEntry')
		.data(colors);
	let ncs = ckes.enter().append("div")
	    .attr("class", "colorKeyEntry flexrow");
	ncs.append("div")
	    .attr("class","swatch")
	    .attr("name", c => c.lbl)
	    .style("background-color", c => c.clr)
	    .on("click", function () {
		let t = d3.select(this);
	        t.classed("checked", ! t.classed("checked"));
		let swatches = d3.selectAll(".swatch.checked")[0];
		let fts = swatches.map(s=>s.getAttribute("name"))
		facet.setValues(fts);
		self.zoomView.highlight();
	    })
	    .append("i")
	        .attr("class","material-icons");
	ncs.append("span")
	    .text(c => c.lbl);
    }

    //----------------------------------------------
    linkToMgiSnpReport () {
	let c = this.getContext();
	let urlBase = 'http://www.informatics.jax.org/snp/summary';
	let tabArg = 'selectedTab=1';
	let searchByArg = 'searchBySameDiff=';
	let chrArg = `selectedChromosome=${c.chr}`;
	let coordArg = `coordinate=${c.start}-${c.end}`;
	let unitArg = 'coordinateUnit=bp';
	let csArgs = c.genomes.map(g => `selectedStrains=${g}`)
	let rsArg = `referenceStrain=${c.ref}`;
	let linkUrl = `${urlBase}?${tabArg}&${searchByArg}&${chrArg}&${coordArg}&${unitArg}&${rsArg}&${csArgs.join('&')}`
	window.open(linkUrl, "_blank");
    }
    //----------------------------------------------
    linkToMgiQTLs () {
	let c        = this.getContext();
	let urlBase  = 'http://www.informatics.jax.org/allele/summary';
	let chrArg   = `chromosome=${c.chr}`;
	let coordArg = `coordinate=${c.start}-${c.end}`;
	let unitArg  = 'coordUnit=bp';
	let typeArg  = 'alleleType=QTL';
	let linkUrl  = `${urlBase}?${chrArg}&${coordArg}&${unitArg}&${typeArg}`;
	window.open(linkUrl, "_blank");
    }
    //----------------------------------------------
    linkToMgiJBrowse () {
	let c = this.getContext();
	let urlBase = 'http://jbrowse.informatics.jax.org/';
	let dataArg = 'data=data%2Fmouse'; // "data/mouse"
	let locArg  = `loc=chr${c.chr}%3A${c.start}..${c.end}`;
	let tracks  = ['DNA','MGI_Genome_Features','NCBI_CCDS','NCBI','ENSEMBL'];
	let tracksArg=`tracks=${tracks.join(',')}`;
	let highlightArg = 'highlight=';
	let linkUrl = `${urlBase}?${ [dataArg,locArg,tracksArg,highlightArg].join('&') }`;
	window.open(linkUrl, "_blank");
    }
} // end class MGVApp




/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Genome; });
class Genome {
  constructor (cfg) {
    this.name = cfg.name;
    this.label= cfg.label;
    this.chromosomes = [];
    this.maxlen = -1;
    this.xscale = null;
    this.yscale = null;
    this.zoomY  = -1;
  }
  getChromosome (n) {
      if (typeof(n) === 'string')
	  return this.chromosomes.filter(c => c.name === n)[0];
      else
          return this.chromosomes[n];
  }
  hasChromosome (n) {
      return this.getChromosome(n) ? true : false;
  }
}




/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FeatureManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Feature__ = __webpack_require__(2);



//----------------------------------------------
// How the app loads feature data. Provides two calls:
//   - get features in range
//   - get features by id
// Requests features from the server and registers them in a cache.
// Interacts with the back end to load features; tries not to request
// the same region twice.
//
class FeatureManager {
    constructor (app) {
        this.app = app;
        this.id2feat = {};		// index from  feature ID to feature
	this.canonical2feats = {};	// index from canonical ID -> [ features tagged with that id ]
	this.symbol2feats = {}		// index from symbol -> [ features having that symbol ]
	this.cache = {};		// {genome.name -> {chr.name -> list of blocks}}
	this.mineFeatureCache = {};	// auxiliary info pulled from MouseMine 
	this.loadedGenomes = new Set(); // the set of Genomes that have been fully loaded
    }
 
    //----------------------------------------------
    // Processes the "raw" features returned by the server.
    // Turns them into Feature objects and registers them.
    // If the same raw feature is registered again,
    // the Feature object created the first time is returned.
    // (I.e., registering the same feature multiple times is ok)
    //
    processFeatures (feats, genome) {
	return feats.map(d => {
	    // If we've already got this one in the cache, return it.
	    let f = this.id2feat[d.mgpid];
	    if (f) return f;
	    // Create a new Feature
	    d.genome = genome
	    f = new __WEBPACK_IMPORTED_MODULE_1__Feature__["a" /* Feature */](d);
	    // Register it.
	    this.id2feat[f.mgpid] = f;
	    if (f.mgiid && f.mgiid !== '.') {
		let lst = this.canonical2feats[f.mgiid] = (this.canonical2feats[f.mgiid] || []);
		lst.push(f);
	    }
	    if (f.symbol && f.symbol !== '.') {
		let lst = this.symbol2feats[f.symbol] = (this.symbol2feats[f.symbol] || []);
		lst.push(f);
	    }
	    // here y'go.
	    return f;
	});
    }

    //----------------------------------------------
    // Registers an index block for the given genome. An index block
    // is a contiguous chunk of featues from the GFF file for that genome.
    // Registering the same block multiple times is ok - successive times
    // have no effect.
    // Side effects:
    //   Adds the block to the cache
    //   Replaces each raw feature in the block with a Feature object.
    //   Registers new Features in a lookup.
    // Args:
    //   genome (object) The genome the block is for,
    //   blk (object) An index block, which has a chr, start, end,
    //   	and a list of "raw" feature objects.
    // Returns:
    //   nothing
    //
    _registerBlock (genome, blk) {
	// genome cache
        let gc = this.cache[genome.name] = (this.cache[genome.name] || {});
	// chromosome cache (w/in genome)
	let cc = gc[blk.chr] = (gc[blk.chr] || []);
	if (cc.filter(b => b.id === blk.id).length === 0) {
	    blk.features = this.processFeatures( blk.features, genome );
	    blk.genome = genome;
	    cc.push(blk);
	    cc.sort( (a,b) => a.start - b.start );
	}
	//else
	    //console.log("Skipped block. Already seen.", genome.name, blk.id);
    }

    //----------------------------------------------
    // Returns the remainder of the given range after
    // subtracting the already-ensured ranges.
    // 
    _subtractRange(genome, range){
	let gc = this.cache[genome.name];
	if (!gc) throw "No such genome: " + genome.name;
	let gBlks = gc[range.chr] || [];
	let ans = [];
	let rng = range;
	gBlks.forEach( b => {
	    let sub = rng ? Object(__WEBPACK_IMPORTED_MODULE_0__utils__["m" /* subtract */])( rng, b ) : [];
	    if (sub.length === 0)
	        rng = null;
	    if (sub.length === 1)
	        rng = sub[0];
	    else if (sub.length === 2){
	        ans.push(sub[0]);
		rng = sub[1];
	    }
	})
	rng && ans.push(rng);
	ans.sort( (a,b) => a.start - b.start );
	return ans;
    }
    //----------------------------------------------
    // Calls subtractRange for each range in the list and returns
    // the accumulated results.
    //
    _subtractRanges(genome, ranges) {
	let gc = this.cache[genome.name];
	if (!gc) return ranges;
	let newranges = [];
	ranges.forEach(r => {
	    newranges = newranges.concat(this._subtractRange(genome, r));
	}, this)
	return newranges;
    }

    //----------------------------------------------
    // Ensures that all features in the specified range(s) in the specified genome
    // are in the cache. Returns a promise that resolves to true when the condition is met.
    _ensureFeaturesByRange (genome, ranges) {
	let newranges = this._subtractRanges(genome, ranges);
	if (newranges.length === 0) 
	    return Promise.resolve();
	let coordsArg = newranges.map(r => `${r.chr}:${r.start}..${r.end}`).join(',');
	let dataString = `genome=${genome.name}&coords=${coordsArg}`;
	let url = "./bin/getFeatures.cgi?" + dataString;
	let self = this;
	console.log("Requesting:", genome.name, newranges);
	return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* d3json */])(url).then(function(blocks){
	    blocks.forEach( b => self._registerBlock(genome, b) );
	    self.app.showStatus(`Loaded: ${genome.name}`);
	    return true;
	});
    }
 
    //----------------------------------------------
    _ensureFeaturesByGenome (genome) {
	if( this.loadedGenomes.has(genome) )
	    return Promise.resolve(true);
        let ranges = genome.chromosomes.map(c => { 
	    return { chr: c.name, start: 1, end: c.length };
	});
	return this._ensureFeaturesByRange(genome, ranges).then(x=>{ this.loadedGenomes.add(genome); return true;});
    }

    //----------------------------------------------
    loadGenomes (genomes) {
        return Promise.all(genomes.map(g => this._ensureFeaturesByGenome (g))).then(()=>true);
    }

    //----------------------------------------------
    _getCachedFeatures (genome, range) {
        let gc = this.cache[genome.name] ;
	if (!gc) return [];
	let cBlocks = gc[range.chr];
	if (!cBlocks) return [];
	let feats = cBlocks
	    .filter(cb => Object(__WEBPACK_IMPORTED_MODULE_0__utils__["i" /* overlaps */])(cb, range))
	    .map( cb => cb.features.filter( f => Object(__WEBPACK_IMPORTED_MODULE_0__utils__["i" /* overlaps */])( f, range) ) )
	    .reduce( (acc, val) => acc.concat(val), []);
        return feats;	
    }

    //----------------------------------------------
    // Returns all cached features having the given canonical id.
    getCachedFeatureById (id) {
        return this.id2feats[id];
    }

    //----------------------------------------------
    // Returns all cached features having the given canonical id.
    getCachedFeaturesByCanonicalId (cid) {
        return this.canonical2feats[cid] || [];
    }

    //----------------------------------------------
    // Returns a list of features that match the given label, which can be an id, canonical id, or symbol.
    // If genome is specified, limit results to features from that genome.
    // 
    getCachedFeaturesByLabel (label, genome) {
	let f = this.id2feat[label]
	let feats = f ? [f] : this.canonical2feats[label] || this.symbol2feats[label] || [];
	return genome ? feats.filter(f=> f.genome === genome) : feats;
    }

    //----------------------------------------------
    // Returns a promise for the features in 
    // the specified ranges of the specified genome.
    getFeatures (genome, ranges) {
	return this._ensureFeaturesByGenome(genome).then(function() {
            ranges.forEach( r => {
	        r.features = this._getCachedFeatures(genome, r) 
		r.genome = genome;
	    });
	    return { genome, blocks:ranges };
	}.bind(this));
    }
    //----------------------------------------------
    // Returns a promise for the features having the specified ids from the specified genome.
    getFeaturesById (genome, ids) {
        return this._ensureFeaturesByGenome(genome).then( () => {
	    let feats = [];
	    let seen = new Set();
	    let addf = (f) => {
		if (f.genome !== genome) return;
		if (seen.has(f.id)) return;
		seen.add(f.id);
		feats.push(f);
	    };
	    let add = (f) => {
		if (Array.isArray(f)) 
		    f.forEach(ff => addf(ff));
		else
		    addf(f);
	    };
	    for (let i of ids){
		let f = this.canonical2feats[i] || this.id2feat[i];
		f && add(f);
	    }
	    return feats;
	});
    }

} // end class Feature Manager




/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QueryManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__AuxDataManager__ = __webpack_require__(10);




// ---------------------------------------------
class QueryManager extends __WEBPACK_IMPORTED_MODULE_1__Component__["a" /* Component */] {
    constructor (app, elt, cfg) {
        super(app, elt);
	this.cfg = cfg;
	this.auxDataManager = new __WEBPACK_IMPORTED_MODULE_2__AuxDataManager__["a" /* AuxDataManager */]();
	this.select = null;	// my <select> element
	this.term = null;	// my <input> element
	this.initDom();
    }
    initDom () {
	this.select = this.root.select('[name="searchtype"]');
	this.term   = this.root.select('[name="searchterm"]');
	//
	this.term.attr("placeholder", this.cfg[0].placeholder)
	Object(__WEBPACK_IMPORTED_MODULE_0__utils__["g" /* initOptList */])(this.select[0][0], this.cfg, c=>c.method, c=>c.label);
	// When user changes the query type (selector), change the placeholder text.
	this.select.on("change", () => {
	    let opt = this.select.property("selectedOptions")[0];
	    this.term.attr("placeholder", opt.__data__.placeholder)
	    
	});
	// When user enters a search term, run a query
	this.term.on("change", () => {
	    let term = this.term.property("value");
	    this.term.property("value","");
	    let searchType  = this.select.property("value");
	    let lstName = term;
	    d3.select("#mylists").classed("busy",true); // FIXME - reachover
	    this.auxDataManager[searchType](term)	// <- run the query
	      .then(feats => {
		  // FIXME - reachover - this whole handler
		  let lst = this.app.listManager.createList(lstName, feats.map(f => f.primaryIdentifier))
		  this.app.listManager.update(lst);
		  //
		  this.app.zoomView.hiFeats = {};
		  feats.forEach(f => this.app.zoomView.hiFeats[f.mgiid] = f.mgiid);
		  this.app.zoomView.highlight();
		  //
		  this.app.currentList = lst;
		  //
		  d3.select("#mylists").classed("busy",false);
	      });
	})
    }
}




/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuxDataManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);


// ---------------------------------------------
// AuxDataManager - knows how to query an external source (i.e., MouseMine) for genes
// annotated to different ontologies. 
class AuxDataManager {
    //----------------------------------------------
    getAuxData (q) {
	let format = 'jsonobjects';
	let query = encodeURIComponent(q);
	let url = `http://www.mousemine.org/mousemine/service/query/results?format=${format}&query=${query}`;
	return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* d3json */])(url).then(data => data.results||[]);
    }

    //----------------------------------------------
    // do a LOOKUP query for SequenceFeatures from MouseMine
    featuresByLookup (qryString) {
	let q = `<query name="" model="genomic" 
	    view="SequenceFeature.primaryIdentifier SequenceFeature.symbol" 
	    longDescription="" 
	    constraintLogic="A and B and C">
		<constraint code="A" path="SequenceFeature" op="LOOKUP" value="${qryString}"/>
		<constraint code="B" path="SequenceFeature.organism.taxonId" op="=" value="10090"/>
		<constraint code="C" path="SequenceFeature.sequenceOntologyTerm.name" op="!=" value="transgene"/>
	    </query>`;
	return this.getAuxData(q);
    }
    //----------------------------------------------
    featuresByOntologyTerm (qryString, termType) {
        let q = `<query name="" model="genomic" 
	  view="SequenceFeature.primaryIdentifier SequenceFeature.symbol" longDescription="" sortOrder="SequenceFeature.symbol asc" constraintLogic="A and B and C">
	      <constraint path="SequenceFeature.ontologyAnnotations.ontologyTerm" type="${termType}"/>
	      <constraint path="SequenceFeature.ontologyAnnotations.ontologyTerm.parents" type="${termType}"/>
	      <constraint code="A" path="SequenceFeature.ontologyAnnotations.ontologyTerm.parents" op="LOOKUP" value="${qryString}"/>
	      <constraint code="B" path="SequenceFeature.organism.taxonId" op="=" value="10090"/>
	      <constraint code="C" path="SequenceFeature.sequenceOntologyTerm.name" op="!=" value="transgene"/>
	  </query>`
	return this.getAuxData(q);
    }
    //----------------------------------------------
    // (not currently in use...)
    featuresByPathwayTerm (qryString) {
        let q = `<query name="" model="genomic" 
	  view="Pathway.genes.primaryIdentifier Pathway.genes.symbol" longDescription="" constraintLogic="A and B">
	      <constraint path="Pathway" code="A" op="LOOKUP" value="${qryString}"/>
	      <constraint path="Pathway.genes.organism.taxonId" code="B" op="=" value="10090"/>
	  </query>`;
	return this.getAuxData(q);
    }
    //----------------------------------------------
    featuresById        (qryString) { return this.featuresByLookup(qryString); }
    featuresByFunction  (qryString) { return this.featuresByOntologyTerm(qryString, "GOTerm"); }
    //featuresByPathway   (qryString) { return this.featuresByPathwayTerm(qryString); }
    featuresByPhenotype (qryString) { return this.featuresByOntologyTerm(qryString, "MPTerm"); }
    featuresByDisease   (qryString) { return this.featuresByOntologyTerm(qryString, "DOTerm"); }
    //----------------------------------------------
}




/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StorageManager__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ListFormulaEvaluator__ = __webpack_require__(12);




// ---------------------------------------------
// Maintains named lists of IDs. Lists may be temporary, lasting only for the session, or permanent,
// lasting until the user clears the browser local storage area.
//
// Uses window.sessionStorage and window.localStorage to save lists
// temporarily or permanently, resp.  FIXME: should be using window.indexedDB
//
class ListManager extends __WEBPACK_IMPORTED_MODULE_0__Component__["a" /* Component */] {
    constructor (app, elt) {
        super(app, elt);
	this.name2list = null;
	this._lists = new __WEBPACK_IMPORTED_MODULE_1__StorageManager__["a" /* LocalStorageManager */]  ("listManager.lists")
	this.formulaEval = new __WEBPACK_IMPORTED_MODULE_2__ListFormulaEvaluator__["a" /* ListFormulaEvaluator */](this);
	this._load();
	this.initDom();
    }
    initDom () {
	// Button: show/hide warning message
	this.root.select('.button.warning')
	    .on('click', () => {
	        let w = this.root.select('[name="message"]');
		w.classed('showing', !w.classed('showing'));
	    });
	// Button: create list from current selection
	this.root.select('.button[name="newfromselection"]')
	    .on("click", () => {
		let ids = Object.keys(this.app.zoomView.hiFeats); // FIXME - reachover
		if (ids.length === 0) {
		    alert("Nothing selected.");
		    return;
		}
		let newlist = this.createList("selection", ids);
		this.update(newlist);
	    });

	// Button: combine lists: open list editor with formula editor open
	this.root.select('.button[name="combine"]')
	    .on("click", () => {
		if (this.getNames().length === 0) {
		    alert("No lists.");
		    return;
		}
		let le = this.app.listEditor;
		le.open();
		le.openFormulaEditor();
	    });
	// Button: delete all lists (get confirmation first).
	this.root.select('.button[name="purge"]')
	    .on("click", () => {
		if (this.getNames().length === 0) {
		    alert("No lists.");
		    return;
		}
	        if (window.confirm("Delete all lists. Are you sure?")) {
		    this.purge();
		    this.update();
		}
	    });
    }
    _load () {
	this.name2list = this._lists.get("all");
	if (!this.name2list){
	    this.name2list = {};
	    this._save();
	}
    }
    _save () {
        this._lists.put("all", this.name2list);
    }
    //
    // returns the names of all the lists, sorted
    getNames () {
        let nms = Object.keys(this.name2list);
	nms.sort();
	return nms;
    }
    // returns true iff a list exists with this name
    has (name) {
        return name in this.name2list;
    }
    // If no list with the given name exists, return the name.
    // Otherwise, return a modified version of name that is unique.
    // Unique names are created by appending a counter.
    // E.g., uniquify("foo") -> "foo.1" or "foo.2" or whatever.
    //
    uniquify (name) {
	if (!this.has(name)) 
	    return name;
	for (let i = 1; ; i += 1) {
	    let nn = `${name}.${i}`;
	    if (!this.has(nn))
	        return nn;
	}
    }
    // returns the list with this name, or null if no such list
    get (name) {
        let lst = this.name2list[name];
	if (!lst) throw "No such list: " + name;
	return lst;
    }
    // returns all the lists, sorted by name
    getAll () {
        return this.getNames().map(n => this.get(n))
    }
    // 
    createOrUpdate (name, ids) {
        return this.has(name) ? this.updateList(name,null,ids) : this.createList(name, ids);
    }
    // creates a new list with the given name and ids.
    createList (name, ids, formula) {
	if (name !== "_")
	    name = this.uniquify(name);
	//
	let dt = new Date() + "";
	this.name2list[name] = {
	    name:     name,
	    ids:      ids,
	    formula:  formula || "",
	    created:  dt,
	    modified: dt
	};
	this._save();
	return this.name2list[name];
    }
    // Provide access to evaluation service
    evalFormula (expr) {
	return this.formulaEval.eval(expr);
    }
    // Refreshes a list and returns a promise for the refreshed list.
    // If the list if a POLO, promise resolves immediately to the list.
    // Otherwise, starts a reevaluation of the formula that resolves after the
    // list's ids have been updated.
    // If there is an error, the returned promise rejects with the error.
    refreshList (name) {
        let lst = this.get(name);
	if (!lst) throw "No such list: " + name;
	lst.modified = ""+new Date();
	if (!lst.formula)
	    return Promise.resolve(lst);
	else {
	    let p = this.formualEval.eval(lst.formula).then( ids => {
		    lst.ids = ids;
		    return lst;
		});
	    return p;
	}
    }

    // updates the ids in the given list
    updateList (name, newname, newids, newformula) {
	let lst = this.get(name);
        if (! lst) throw "No such list: " + name;
	if (newname) {
	    delete this.name2list[lst.name];
	    lst.name = this.uniquify(newname);
	    this.name2list[lst.name] = lst;
	}
	if (newids) lst.ids  = newids;
	if (newformula || newformula==="") lst.formula = newformula;
	lst.modified = new Date() + "";
	this._save();
	return lst;
    }
    // deletes the specified list
    deleteList (name) {
        let lst = this.get(name);
	delete this.name2list[name];
	this._save();
	// FIXME: use events!!
	if (lst === this.app.currentList) this.app.currentList = null;
	if (lst === this.app.listEditor.list) this.app.listEditor.list = null;
	return lst;
    }
    // delete all lists
    purge () {
        this.name2list = {}
	this._save();
	//
	this.app.currentList = null;
	this.app.listEditor.list = null; // FIXME - reachacross
    }
    // Returns true iff expr is valid, which means it is both syntactically correct 
    // and all mentioned lists exist.
    isValid (expr) {
	return this.formulaEval.isValid(expr);
    }
    //----------------------------------------------
    // Updates the "My lists" box with the currently available lists.
    // Args:
    //   newlist (List) optional. If specified, we just created that list, and its name is
    //   	a generated default. Place focus there so user can type new name.
    update (newlist) {
	let self = this;
        let lists = this.getAll();
	let byName = (a,b) => {
	    let an = a.name.toLowerCase();
	    let bn = b.name.toLowerCase();
	    return (an < bn ? -1 : an > bn ? +1 : 0);
	};
	let byDate = (a,b) => ((new Date(b.modified)).getTime() - (new Date(a.modified)).getTime());
	lists.sort(byName);
	let items = this.root.select('[name="lists"]').selectAll(".listInfo")
	    .data(lists);
	let newitems = items.enter().append("div")
	    .attr("class","listInfo flexrow");

	newitems.append("i").attr("class","material-icons button")
	    .attr("name","edit")
	    .text("mode_edit")
	    .attr("title","Edit this list.");

	newitems.append("span").attr("name","name");

	newitems.append("span").attr("name","size");
	newitems.append("span").attr("name","date");

	newitems.append("i").attr("class","material-icons button")
	    .attr("name","delete")
	    .text("highlight_off")
	    .attr("title","Delete this list.");

	if (newitems[0][0]) {
	    let last = newitems[0][newitems[0].length-1];
	    last.scrollIntoView();
	}

	items
	    .attr("name", lst=>lst.name)
	    .on("click", function (lst) {
		if (d3.event.altKey) {
		    let le = self.app.listEditor; // FIXME reachover
		    let s = lst.name;
		    let re = /[ =()+*-]/;
		    if (s.search(re) >= 0)
			s = '"' + s + '"';
		    if (!le.isEditingFormula) {
		        le.open();
			le.openFormulaEditor();
		    }
		    //
		    le.addToListExpr(s+' ');
		}
		// otherwise, set this as the current list
		else 
		    self.app.currentList = lst; // FIXME reachover
	    });
	items.select('.button[name="edit"]')
	    // edit: click 
	    .on("click", function(lst) {
	        self.app.listEditor.open(lst);
	    });
	items.select('span[name="name"]')
	    .text(lst => lst.name);
	items.select('span[name="date"]').text(lst => {
	    let md = new Date(lst.modified);
	    let d = `${md.getFullYear()}-${md.getMonth()+1}-${md.getDate()} ` 
	          + `:${md.getHours()}.${md.getMinutes()}.${md.getSeconds()}`;
	    return d;
	});
	items.select('span[name="size"]').text(lst => lst.ids.length);
	items.select('.button[name="delete"]')
	    .on("click", lst => {
	        this.deleteList(lst.name);
		this.update();

		// Not sure why this is necessary here. But without it, the list item after the one being
		// deleted here will receive a click event.
		d3.event.stopPropagation();
		//
	    });

	//
	items.exit().remove();
	//
	if (newlist) {
	    let lstelt = 
	        d3.select(`#mylists [name="lists"] [name="${newlist.name}"]`)[0][0];
            lstelt.scrollIntoView(false);
	}
    }

} // end class ListManager




/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListFormulaEvaluator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ListFormulaParser__ = __webpack_require__(4);


// ---------------------------------------------
// Knows how to parse and evaluate a list formula (aka list expression).
class ListFormulaEvaluator {
    constructor (listManager) {
	this.listManager = listManager;
        this.parser = new __WEBPACK_IMPORTED_MODULE_0__ListFormulaParser__["a" /* ListFormulaParser */]();
    }
    // Evaluates the expression and returns a Promise for the list of ids.
    // If there is an error, the promise rejects with the error message.
    eval (expr) {
	 return new Promise(function(resolve, reject) {
	     try {
		let ast = this.parser.parse(expr);
		let lm = this.listManager;
		let reach = (n) => {
		    if (typeof(n) === "string") {
			let lst = lm.get(n);
			if (!lst) throw "No such list: " + n;
			return new Set(lst.ids);
		    }
		    else {
			let l = reach(n.left);
			let r = reach(n.right);
			return l[n.op](r);
		    }
		}
		let ids = reach(ast);
		resolve(Array.from(ids));
	    }
	    catch (e) {
		reject(e);
	    }
	 }.bind(this));
    }
    // Checks the current expression for syntactic and semantic validity and sets the 
    // valid/invalid class accordingly. Semantic validity simply means all names in the
    // expression are bound.
    //
    isValid  (expr) {
	try {
	    // first check syntax
	    let ast = this.parser.parse(expr);
	    let lm  = this.listManager; 
	    // now check list names
	    (function reach(n) {
		if (typeof(n) === "string") {
		    let lst = lm.get(n);
		    if (!lst) throw "No such list: " + n
		}
		else {
		    reach(n.left);
		    reach(n.right);
		}
	    })(ast);

	    // Thumbs up!
	    return true;
	}
	catch (e) {
	    // syntax error or unknown list name
	    return false;
	}
    }
}




/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListEditor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ListFormulaParser__ = __webpack_require__(4);




// ---------------------------------------------
class ListEditor extends __WEBPACK_IMPORTED_MODULE_1__Component__["a" /* Component */] {
    constructor (app, elt) {
	super(app, elt);
	this.parser = new __WEBPACK_IMPORTED_MODULE_2__ListFormulaParser__["a" /* ListFormulaParser */]();
	this.form = null;
	this.initDom();
	this.isEditingFormula = false;
	//
	this.list = null;
    }
    initDom () {
	let self = this;
	this.form = this.root.select("form")[0][0];
	if (!this.form) throw "Could not init ListEditor. No form element.";
	d3.select(this.form)
	    .on("click", () => {
	        let t = d3.event.target;
		if ("button" === t.tagName.toLowerCase()){
		    d3.event.preventDefault();
		    let f = this.form;
		    let s = f.ids.value.replace(/[,|]/g, ' ').trim();
		    let ids = s ? s.split(/\s+/) : [];
		    // save list
		    if (t.name === "save") {
			if (!this.list) return;
			this.list = this.app.listManager.updateList(this.list.name, f.name.value, ids, f.formula.value);
			this.app.listManager.update(this.list);
		    }
		    // create new list
		    else if (t.name === "new") {
			let n = f.name.value.trim();
			if (!n) {
			   alert("Your list has no name and is very sad. Please give it a name and try again.");
			   return
			}
			else if (n.indexOf('"') >= 0) {
			   alert("Oh dear, your list's name has a double quote character, and I'm afaraid that's not allowed. Please remove the '\"' and try again.");
			   return
			}
		        this.list = this.app.listManager.createList(n, ids, f.formula.value);
			this.app.listManager.update(this.list);
		    }
		    // clear form
		    else if (t.name === "clear") {
		        this.list = null;
		    }
		    // forward to MGI
		    else if (t.name === "toMgi") {
		        let frm = d3.select('#mgibatchform')[0][0];
			frm.ids.value = ids.join(" ");
			frm.submit()
		    }
		    // forward to MouseMine
		    else if (t.name === "toMouseMine") {
		        let frm = d3.select('#mousemineform')[0][0];
			frm.externalids.value = ids.join(",");
			frm.submit()
		    }
		}
	    });

	// Button: show/hide formula editor
	this.root.select('[name="idsection"] .button[name="editformula"]')
	    .on("click", () => this.toggleFormulaEditor());
	    
	// Input box: formula: validate on any input
	this.root.select('[name="formulaeditor"] [name="formula"]')
	    .on("input", () => {
	        this.validateExpr();
	    });

	// Forward -> MGI/MouseMine: disable buttons if no ids
	this.root.select('[name="ids"]')
	    .on("input", () => {
	        let empty = this.form.ids.value.trim().length === 0;
		this.form.toMgi.disabled = this.form.toMouseMine.disabled = empty;
	    });

	// Buttons: the list operator buttons (union, intersection, etc.)
	this.root.selectAll('[name="formulaeditor"] .button.listop')
	    .on("click", function () {
		// add my symbol to the formula
		let inelt = self.form.formula;
		let op = d3.select(this).attr("name");
		self.addToListExpr(op);
		self.validateExpr();
	    });

	// Button: refresh button for running the formula
	this.root.select('[name="formulaeditor"] .button[name="refresh"]')
            .on("click", () => {
		let emessage="I'm terribly sorry, but there appears to be a problem with your list expression: ";
		let formula = this.form.formula.value.trim();
		if (formula.length === 0)
		    return;
	        this.app.listManager
		    .evalFormula(formula)
		    .then(ids => {
		        this.form.ids.value = ids.join("\n");
		     })
		    .catch(e => alert(emessage + e));
	    });

	// Button: close formula editor
	this.root.select('[name="formulaeditor"] .button[name="close"]')
            .on("click", () => this.closeFormulaEditor() );
	
	// Clicking the box collapse button should clear the form
	this.root.select(".button.close")
	    .on("click.extra", () => {
	        this.list = null;
		this.closeFormulaEditor();
	    });
    }
    parseIds (s) {
	return s.replace(/[,|]/g, ' ').trim().split(/\s+/);
    }
    get list () {
        return this._list;
    }
    set list (lst) {
        this._list = lst;
	this._syncDisplay();
    }
    _syncDisplay () {
	let lst = this._list;
	if (!lst) {
	    this.form.name.value = '';
	    this.form.ids.value = '';
	    this.form.ids.disabled = false;
	    this.form.modified.value = '';
	    this.form.formula.value = '';
	    this.form.save.disabled = true;
	    this.form.toMgi.disabled = true;
	    this.form.toMouseMine.disabled = true;
	}
	else {
	    this.form.name.value = lst.name;
	    this.form.ids.value = lst.ids.join('\n');
	    this.form.formula.value = lst.formula || "";
	    this.form.ids.disabled = this.form.formula.value.trim().length > 0;
	    this.form.modified.value = lst.modified;
	    this.form.save.disabled = false;
	    this.form.toMgi.disabled 
	      = this.form.toMouseMine.disabled 
	        = (this.form.ids.value.trim().length === 0);
	}
	this.validateExpr();
    }
    clear () {
        this.list = null;
    }
    open (lst) {
        this.list = lst;
	this.root.classed("closed", false);
    }
    close () {
        this.list = null;
	this.root.classed("closed", true);
    }
    openFormulaEditor () {
	this.root.classed("editingformula", true);
	this.isEditingFormula = true;
	let f = this.form.formula.value;
	this.form.formula.focus();
	Object(__WEBPACK_IMPORTED_MODULE_0__utils__["l" /* setCaretPosition */])(this.form.formula, f.length);
    }
    closeFormulaEditor () {
	this.root.classed("editingformula", false);
	this.isEditingFormula = false;
    }
    toggleFormulaEditor () {
	let showing = this.root.classed("editingformula");
	showing ? this.closeFormulaEditor() : this.openFormulaEditor();
    }
    //----------------------------------------------
    // Checks the current expression and sets the valid/invalid class.
    validateExpr  () {
	let inp = this.root.select('[name="formulaeditor"] [name="formula"]');
	let expr = inp[0][0].value.trim();
	if (!expr) {
	    inp.classed("valid",false).classed("invalid",false);
 	    this.form.ids.disabled = false;
	}
	else {
	    let isValid = this.app.listManager.isValid(expr); // FIXME - reachover
	    inp.classed("valid", isValid).classed("invalid", !isValid);
 	    this.form.ids.disabled = true;
	}
    }
    //----------------------------------------------
    addToListExpr (text) {
	let inp = this.root.select('[name="formulaeditor"] [name="formula"]');
	let ielt = inp[0][0];
	let v = ielt.value;
	let splice = function (e,t){
	    let v = e.value;
	    let r = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["f" /* getCaretRange */])(e);
	    e.value = v.slice(0,r[0]) + t + v.slice(r[1]);
	    Object(__WEBPACK_IMPORTED_MODULE_0__utils__["l" /* setCaretPosition */])(e, r[0]+t.length);
	    e.focus();
	}
	let range = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["f" /* getCaretRange */])(ielt);
	if (range[0] === range[1]) {
	    // no current selection
	    splice(ielt, text);
	    if (text === "()") 
		Object(__WEBPACK_IMPORTED_MODULE_0__utils__["h" /* moveCaretPosition */])(ielt, -1);
	}
	else {
	    // there is a current selection
	    if (text === "()")
		// surround current selection with parens, then move caret after
		text = '(' + v.slice(range[0],range[1]) + ')';
	    splice(ielt, text)
	}
	this.validateExpr();
    }
} // end class ListEditor




/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserPrefsManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__StorageManager__ = __webpack_require__(3);


const MGR_NAME = "prefsManager";
const ITEM_NAME= "userPrefs";

class UserPrefsManager {
    constructor () {
        this.storage = new __WEBPACK_IMPORTED_MODULE_0__StorageManager__["a" /* LocalStorageManager */](MGR_NAME);
	this.data = null;
	this._load();
    }
    _load () {
	this.data = this.storage.get(ITEM_NAME);
	if (!this.data){
	    this.data = {};
	    this._save();
	}
    }
    _save () {
        this.storage.put(ITEM_NAME, this.data);
    }
    has (n) {
    }
    get (n) {
        return this.data[n];
    }
    getAll () {
	return Object.assign({}, this.data)
    }
    set (n, v) {
        this.data[n] = v;
	this._save();
    }
    setAll (v) {
        Object.assign(this.data, v);
	this._save();
    }
}




/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FacetManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Facet__ = __webpack_require__(16);


//----------------------------------------------
class FacetManager {
    constructor (app) {
	this.app = app;
	this.facets = [];
	this.name2facet = {}
    }
    addFacet (name, valueFcn) {
	if (this.name2facet[name]) throw "Duplicate facet name. " + name;
	let facet = new __WEBPACK_IMPORTED_MODULE_0__Facet__["a" /* Facet */](name, this, valueFcn);
        this.facets.push( facet );
	this.name2facet[name] = facet;
	return facet
    }
    test (f) {
        let vals = this.facets.map( facet => facet.test(f) );
	return vals.reduce((accum, val) => accum && val, true);
    }
    applyAll () {
	let show = null;
	let hide = "none";
	// FIXME: major reachover
	this.app.zoomView.svgMain.select("g.strips").selectAll('rect.feature')
	    .style("display", f => this.test(f) ? show : hide);
    }
} // end class FacetManager




/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Facet; });
//----------------------------------------------
class Facet {
    constructor (name, manager, valueFcn) {
	this.manager = manager;
        this.name = name;
	this.values = [];
	this.valueFcn = valueFcn;
    }
    setValues (values, quietly) {
        this.values = values;
	if (! quietly) {
	    this.manager.applyAll();
	    this.manager.app.zoomView.highlight();
	}
    }
    test (f) {
        return !this.values || this.values.length === 0 || this.values.indexOf( this.valueFcn(f) ) >= 0;
    }
} // end class Facet




/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BTManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BlockTranslator__ = __webpack_require__(18);



//----------------------------------------------
// BlockTranslator manager class. For any given pair of genomes, A and B, loads the single block file
// for translating between them, and indexes it "from both directions":
// 	A->B-> [AB_BlockFile] <-A<-B
//
class BTManager {
    constructor (app) {
        this.app = app;
	this.rcBlocks = {};
    }

    //----------------------------------------------
    registerBlocks (url, aGenome, bGenome, blocks) {
	console.log("Registering blocks from: " + url, blocks);
	let aname = aGenome.name;
	let bname = bGenome.name;
	let blkFile = new __WEBPACK_IMPORTED_MODULE_1__BlockTranslator__["a" /* BlockTranslator */](url,aGenome,bGenome,blocks);
	if( ! this.rcBlocks[aname]) this.rcBlocks[aname] = {};
	if( ! this.rcBlocks[bname]) this.rcBlocks[bname] = {};
	this.rcBlocks[aname][bname] = blkFile;
	this.rcBlocks[bname][aname] = blkFile;
    }

    //----------------------------------------------
    // Loads the synteny block file for genomes aGenome and bGenome.
    // 
    getBlockFile (aGenome, bGenome) {
	// Be a little smart about the order we try the names...
	if (bGenome.name < aGenome.name) {
	    let tmp = aGenome; aGenome = bGenome; bGenome = tmp;
	}
	// First, see if we already have this pair
	let aname = aGenome.name;
	let bname = bGenome.name;
	let bf = (this.rcBlocks[aname] || {})[bname];
	if (bf)
	    return Promise.resolve(bf);
	
	// For any given genome pair, only one of the following two files
	// is generated by the back end
	let fn1 = `./data/blockfiles/${aGenome.name}-${bGenome.name}.tsv`
	let fn2 = `./data/blockfiles/${bGenome.name}-${aGenome.name}.tsv`
	// The file for A->B is simply a re-sort of the file from B->A. So the 
	// back end only creates one of them.
	// We'll try one and if that's not it, then try the other.
	// (And if THAT's not it, then cry a river...)
	let self = this;
	return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* d3tsv */])(fn1)
	  .then(function(blocks){
	      // yup, it was A-B
	      self.registerBlocks(fn1, aGenome, bGenome, blocks);
	      return blocks
	  })
	  .catch(function(e){
	      console.log(`INFO: Disregard that 404 message! ${fn1} was not found. Trying ${fn2}.`);
	      return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* d3tsv */])(fn2)
		  .then(function(blocks){
		      // nope, it was B-A
		      self.registerBlocks(fn2, bGenome, aGenome, blocks);
		      return blocks
		  })
		  .catch(function(e){
		      console.log('But THAT 404 message is a problem.');
		      throw `Cannot get block file for this genome pair: ${aGenome.name} ${bGenome.name}.\n(Error=${e})`;
		  });
	  });
    }

    //----------------------------------------------
    // Returns a promise that is fulfilled when the translator has loaded all the data needed
    // for translating coordinates between the current ref strain and the current comparison strains.
    //
    ready () {
	let promises = this.app.cGenomes.map(cg => this.getBlockFile(this.app.rGenome, cg));
	return Promise.all(promises)
    }

    //----------------------------------------------
    // Returns the synteny block translator that maps the current ref genome to the specified comparison genome.
    //
    getBlocks (fromGenome, toGenome) {
        let blkTrans = this.rcBlocks[fromGenome.name][toGenome.name];
	return blkTrans.getBlocks(fromGenome)
    }

    //----------------------------------------------
    // Translates the given coordinate range from the specified fromGenome to the specified toGenome.
    // Returns a list of zero or more coordinate ranges in the toGenome.
    //
    translate (fromGenome, chr, start, end, toGenome, inverted) {
	// get the right block file
	let blkTrans = this.rcBlocks[fromGenome.name][toGenome.name];
	if (!blkTrans) throw "Internal error. No block file found in index."
	// translate!
	let ranges = blkTrans.translate(fromGenome, chr, start, end, inverted);
	return ranges;
    }
} // end class BTManager




/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BlockTranslator; });
// ---------------------------------------------
// Something that knows how to translate coordinates between two genomes.
//
//
class BlockTranslator {
    constructor(url, aGenome, bGenome, blocks){
        this.url = url;
	this.aGenome = aGenome;
	this.bGenome = bGenome;
	this.blocks = blocks.map(b => this.processBlock(b))
	this.currentSort = "a"; // either 'a' or 'b'
    }
    processBlock (blk) { 
        blk.aIndex = parseInt(blk.aIndex);
        blk.bIndex = parseInt(blk.bIndex);
        blk.aStart = parseInt(blk.aStart);
        blk.bStart = parseInt(blk.bStart);
        blk.aEnd   = parseInt(blk.aEnd);
        blk.bEnd   = parseInt(blk.bEnd);
        blk.aLength   = parseInt(blk.aLength);
        blk.bLength   = parseInt(blk.bLength);
        blk.blockCount   = parseInt(blk.blockCount);
        blk.blockRatio   = parseFloat(blk.blockRatio);
	blk.abMap = d3.scale.linear()
	    .domain([blk.aStart,blk.aEnd])
	    .range( blk.blockOri==="-" ? [blk.bEnd,blk.bStart] : [blk.bStart,blk.bEnd]);
	blk.baMap = blk.abMap.invert
	return blk;
    }
    setSort (which) {
	if (which !== 'a' && which !== 'b') throw "Bad argument:" + which;
	let sortCol = which + "Index";
	let cmp = (x,y) => x[sortCol] - y[sortCol];
	this.blocks.sort(cmp);
	this.currSort = which;
    }
    flipSort () {
	this.setSort(this.currSort === "a" ? "b" : "a");
    }
    // Given a genome (either the a or b genome) and a coordinate range,
    // returns the equivalent coordinate range(s) in the other genome
    translate (fromGenome, chr, start, end, invert) {
	//
	end = end === undefined ? start : end;
	// from = "a" or "b", depending on which genome is given.
        let from = (fromGenome === this.aGenome ? "a" : fromGenome === this.bGenome ? "b" : null);
	if (!from) throw "Bad argument. Genome neither A nor B.";
	// to = "b" or "a", opposite of from
	let to = (from === "a" ? "b" : "a");
	// make sure the blocks are sorted by the from genome
	this.setSort(from);
	//
	let fromC = from+"Chr";
	let fromS = from+"Start";
	let fromE = from+"End";
	let fromI = from+"Index";
	let toC = to+"Chr";
	let toS = to+"Start";
	let toE = to+"End";
	let toI = to+"Index";
	let mapper = from+to+"Map";
	// 
	let blks = this.blocks
	    // First filter for blocks that overlap the given coordinate range in the from genome
	    .filter(blk => blk[fromC] === chr && blk[fromS] <= end && blk[fromE] >= start)
	    // map each block. 
	    .map(blk => {
		// coord range on the from side.
		let s = Math.max(start, blk[fromS]);
		let e = Math.min(end, blk[fromE]);
		// coord range on the to side.
		let s2 = Math.ceil(blk[mapper](s));
		let e2 = Math.floor(blk[mapper](e));
	        return invert ? {
		    chr:   blk[fromC],
		    start: s,
		    end:   e,
		    ori:   blk.blockOri,
		    index: blk[fromI],
		    // also return the fromGenome coords for this piece of the translation
		    fChr:   blk[toC],
		    fStart: Math.min(s2,e2),
		    fEnd:   Math.max(s2,e2),
		    fIndex: blk[toI],
		    // include the block id and full block coords
		    blockId: blk.blockId,
		    blockStart: blk[fromS],
		    blockEnd: blk[fromE]
		    } : {
		    chr:   blk[toC],
		    start: Math.min(s2,e2),
		    end:   Math.max(s2,e2),
		    ori:   blk.blockOri,
		    index: blk[toI],
		    // also return the fromGenome coords for this piece of the translation
		    fChr:   blk[fromC],
		    fStart: s,
		    fEnd:   e,
		    fIndex: blk[fromI],
		    // include the block id and full block coords
		    blockId: blk.blockId,
		    blockStart: blk[toS],
		    blockEnd: blk[toE]
		};
	    })
	// 
	return blks;
    }
    // Given a genome (either the a or b genome)
    // returns the blocks for translating to the other (b or a) genome.
    //
    getBlocks (fromGenome) {
	// from = "a" or "b", depending on which genome is given.
        let from = (fromGenome === this.aGenome ? "a" : fromGenome === this.bGenome ? "b" : null);
	if (!from) throw "Bad argument. Genome neither A nor B.";
	// to = "b" or "a", opposite of from
	let to = (from === "a" ? "b" : "a");
	// make sure the blocks are sorted by the from genome
	this.setSort(from);
	//
	let fromC = from+"Chr";
	let fromS = from+"Start";
	let fromE = from+"End";
	let fromI = from+"Index";
	let toC = to+"Chr";
	let toS = to+"Start";
	let toE = to+"End";
	let toI = to+"Index";
	let mapper = from+to+"Map";
	// 
	let blks = this.blocks
	    .map(blk => {
	        return {
		    blockId:   blk.blockId,
		    ori:       blk.blockOri,
		    fromChr:   blk[fromC],
		    fromStart: blk[fromS],
		    fromEnd:   blk[fromE],
		    fromIndex: blk[fromI],
		    toChr:     blk[toC],
		    toStart:   blk[toS],
		    toEnd:     blk[toE],
		    toIndex:   blk[toI]
		};
	    })
	// 
	return blks;
    }
}




/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GenomeView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SVGView__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



// ---------------------------------------------
class GenomeView extends __WEBPACK_IMPORTED_MODULE_0__SVGView__["a" /* SVGView */] {
    //----------------------------------------------
    constructor (app, elt, width, height) {
        super(app, elt, width, height);
	this.openWidth = this.outerWidth;
	this.openHeight= this.outerHeight;
	this.totalChrWidth = 40; // total width of one chromosome (backbone+blocks+feats)
	this.cwidth = 20;        // chromosome width
	this.tickLength = 10;	 // feature tick mark length
	this.brushChr = null;	 // which chr has the current brush
	this.bwidth = this.cwidth/2;  // block width
	this.currBlocks = null;
	this.currTicks = null;
	this.gChromosomes = this.svgMain.append('g').attr("name", "chromosomes");
	this.title    = this.svgMain.append('text').attr("class", "title");
	this.scrollAmount = 0;
	//
	this.initDom();
    }
    //----------------------------------------------
    fitToWidth (w){
        super.fitToWidth(w);
	this.openWidth = this.outerWidth;
    }
    //----------------------------------------------
    initDom () {
	this.root.select('.button.close')
	    .on('click', () => this.redraw());
	this.svg.on("wheel", () => {
	    if (!this.root.classed("closed")) return;
	    this.scrollWheel(d3.event.deltaY)
	    d3.event.preventDefault();
	});
	let sbs = this.root.select('[name="svgcontainer"] > [name="scrollbuttons"]')
	sbs.select('.button[name="up"]').on("click", () => this.scrollChromosomesUp());
	sbs.select('.button[name="dn"]').on("click", () => this.scrollChromosomesDown());
    }

    //----------------------------------------------
    setBrushCoords (coords) {
	this.clearBrushes();
	this.gChromosomes.select(`.chromosome[name="${coords.chr}"] g[name="brush"]`)
	  .each(function(chr){
	    chr.brush.extent([coords.start,coords.end]);
	    chr.brush(d3.select(this));
	});
    }
    //----------------------------------------------
    brushstart (chr){
	this.clearBrushes(chr.brush);
	this.brushChr = chr;
    }

    //----------------------------------------------
    brushend (){
	if(!this.brushChr) return;
	let cc = this.app.coords;
	var xtnt = this.brushChr.brush.extent();
	if (Math.abs(xtnt[0] - xtnt[1]) <= 10){
	    // user clicked
	    let w = cc.end - cc.start + 1;
	    xtnt[0] -= w/2;
	    xtnt[1] += w/2;
	}
	let coords = { chr:this.brushChr.name, start:Math.floor(xtnt[0]), end: Math.floor(xtnt[1]) };
	this.app.setContext(coords);
    }

    //----------------------------------------------
    clearBrushes (except){
	this.gChromosomes.selectAll('[name="brush"]').each(function(chr){
	    if (chr.brush !== except) {
		chr.brush.clear();
		chr.brush(d3.select(this));
	    }
	});
    }

    //----------------------------------------------
    getX (chr) {
	let x = this.app.rGenome.xscale(chr);
	if (isNaN(x)) throw "x is NaN"
	return x;
    }
    //----------------------------------------------
    getY (pos) {
	let y = this.app.rGenome.yscale(pos);
	if (isNaN(y)) throw "y is NaN"
	return y;
    }
    
    //----------------------------------------------
    redraw () {
        this.draw(this.currTicks, this.currBlocks);
    }

    //----------------------------------------------
    draw (tickData, blockData) {
	this.drawChromosomes();
	this.drawBlocks(blockData);
	this.drawTicks(tickData);
	this.drawTitle();
	this.setBrushCoords(this.app.coords);
    }

    // ---------------------------------------------
    // Draws the chromosomes of the reference genome.
    // Includes backbones, labels, and brushes.
    // The backbones are drawn as vertical line sements,
    // distributed horizontally. Ordering is defined by
    // the model (Genome object).
    // Labels are drawn above the backbones.
    //
    // Modification:
    // Draws the scene in one of two states: open or closed.
    // The open state is as described - all chromosomes shown.
    // In the closed state: 
    //     * only one chromosome shows (the current one)
    //     * drawn horizontally and positioned beside the "Genome View" title
    //
    drawChromosomes () {
	let self = this;

	let rg = this.app.rGenome; // ref genome
	let rChrs = rg.chromosomes;

        // Chromosome groups
	let chrs = this.gChromosomes.selectAll(".chromosome")
	    .data(rChrs, c => c.name);
	let newchrs = chrs.enter().append("g")
	    .attr("class", "chromosome")
	    .attr("name", c => c.name);
	
	newchrs.append("text").attr("name","label");
	newchrs.append("line").attr("name","backbone");
	newchrs.append("g").attr("name","synBlocks");
	newchrs.append("g").attr("name","ticks");
	newchrs.append("g").attr("name","brush");


	let closed = this.root.classed("closed");
	if (closed) {
	    // Reset the SVG size to be 1-chromosome wide.
	    // Translate the chromosomes group so that the current chromosome appears in the svg area.
	    // Turn it 90 deg.

	    // Set the height of the SVG area to 1 chromosome's width
	    this.setGeom({ height: this.totalChrWidth, rotation: -90, translation: [-this.totalChrWidth/2,30] });
	    // 
	    let delta = 10;
	    rg.xscale = d3.scale.ordinal()
		 .domain(rChrs.map(function(x){return x.name;}))
		 // in closed mode, the chromosomes have fixed spacing
		 .rangePoints([delta, delta+this.totalChrWidth*(rChrs.length-1)]);
	    //
	    rg.yscale = d3.scale.linear()
		 .domain([1,rg.maxlen])
		 .range([0, this.width]);

	    // translate each chromosome into position
	    chrs.attr("transform", c => `translate(${rg.xscale(c.name)}, 0)`);
            // translate the chromosomes group.
	    this.scrollChromosomesTo(-rg.xscale(this.app.coords.chr));
	    this.scrollChromosomesSnap();
	}
	else {
	    // When open, draw all the chromosomes. Each chrom is a vertical line.
	    // Chroms are distributed evenly across the available horizontal space.
	    this.setGeom({ width: this.openWidth, height: this.openHeight, rotation: 0, translation: [0,0] });
	    // 
	    rg.xscale = d3.scale.ordinal()
		 .domain(rChrs.map(function(x){return x.name;}))
		 // in closed mode, the chromosomes spread to fill the space
		 .rangePoints([0, this.openWidth - 30], 0.5);
	    rg.yscale = d3.scale.linear()
		 .domain([1,rg.maxlen])
		 .range([0, this.height]);

	    // translate each chromosome into position
	    chrs.attr("transform", c => `translate(${rg.xscale(c.name)}, 0)`);
            // translate the chromosomes group.
	    this.scrollChromosomesTo(0);
	}

	rChrs.forEach(chr => {
	    var sc = d3.scale.linear()
		.domain([1,chr.length])
		.range([0, rg.yscale(chr.length)]);
	    chr.brush = d3.svg.brush().y(sc)
	       .on("brushstart", chr => this.brushstart(chr))
	       .on("brushend", () => this.brushend());
	  }, this);


        chrs.select('[name="label"]')
	    .text(c=>c.name)
	    .attr("x", 0) 
	    .attr("y", -2)
	    ;

	chrs.select('[name="backbone"]')
	    .attr("x1", 0)
	    .attr("y1", 0)
	    .attr("x2", 0)
	    .attr("y2", c => rg.yscale(c.length))
	    ;
	   
	chrs.select('[name="brush"]')
	    .each(function(d){d3.select(this).call(d.brush);})
	    .selectAll('rect')
	     .attr('width',10)
	     .attr('x', -5)
	    ;

	chrs.exit().remove();
	
    }

    // ---------------------------------------------
    // Scroll wheel event handler.
    scrollWheel (dy) {
	// Add dy to total scroll amount. Then translate the chromosomes group.
	this.scrollChromosomesBy(dy);
	// After a 200 ms pause in scrolling, snap to nearest chromosome
	this.tout && window.clearTimeout(this.tout);
	this.tout = window.setTimeout(()=>this.scrollChromosomesSnap(), 200);
    }
    scrollChromosomesTo (x) {
        if (x === undefined) x = this.scrollAmount;
	this.scrollAmount = Math.max(Math.min(x,15), -this.totalChrWidth * (this.app.rGenome.chromosomes.length-1));
	this.gChromosomes.attr("transform", `translate(${this.scrollAmount},0)`);
    }
    scrollChromosomesBy (dx) {
        this.scrollChromosomesTo(this.scrollAmount + dx);
    }
    scrollChromosomesSnap () {
	let i = Math.round(this.scrollAmount / this.totalChrWidth)
	this.scrollChromosomesTo(i*this.totalChrWidth);
    }
    scrollChromosomesUp () {
        this.scrollChromosomesBy(-this.totalChrWidth);
	this.scrollChromosomesSnap();
    }
    scrollChromosomesDown () {
        this.scrollChromosomesBy(this.totalChrWidth);
	this.scrollChromosomesSnap();
    }
    // ---------------------------------------------
    drawTitle () {
	let refg = this.app.rGenome.label;
	let blockg = this.currBlocks ? 
	    this.currBlocks.comp !== this.app.rGenome ?
	        this.currBlocks.comp.label
		:
		null
	    :
	    null;
	let lst = this.app.currList ? this.app.currList.name : null;

	this.root.select("label span.title").text(refg);

	let lines = [];
	blockg && lines.push(`Blocks vs. ${blockg}`);
	lst && lines.push(`Features from list "${lst}"`);
	let subt = lines.join(" :: ");
	this.root.select("label span.subtitle").text((subt ? ":: " : "") + subt);
    }

    // ---------------------------------------------
    // Draws the outlines of synteny blocks of the ref genome vs.
    // the given genome.
    // Passing null erases all synteny blocks.
    // Args:
    //    data == { ref:Genome, comp:Genome, blocks: list of synteny blocks }
    //    Each sblock === { blockId:int, ori:+/-, fromChr, fromStart, fromEnd, toChr, toStart, toEnd }
    drawBlocks (data) {
	//
        let sbgrps = this.gChromosomes.selectAll(".chromosome").select('[name="synBlocks"]');
	if (!data || !data.blocks || data.blocks.length === 0) {
	    this.currBlocks = null;
	    sbgrps.html('');
	    this.drawTitle();
	    return;
	}
	this.currBlocks = data;
	// reorganize data to reflect SVG structure we want, ie, grouped by chromosome
        let dx = data.blocks.reduce((a,sb) => {
		if (!a[sb.fromChr]) a[sb.fromChr] = [];
		a[sb.fromChr].push(sb);
		return a;
	    }, {});
	sbgrps.each(function(c){
	    d3.select(this).datum({chr: c.name, blocks: dx[c.name] || [] });
	});

	let bwidth = 10;
        let sblocks = sbgrps.selectAll('rect.sblock').data(b=>b.blocks);
        let newbs = sblocks.enter().append('rect').attr('class','sblock');
	sblocks
	    .attr("x", -bwidth/2 )
	    .attr("y", b => this.getY(b.fromStart))
	    .attr("width", bwidth)
	    .attr("height", b => Math.max(0,this.getY(b.fromEnd - b.fromStart + 1)))
	    .classed("inversion", b => b.ori === "-")
	    .classed("translocation", b => b.fromChr !== b.toChr)
	    ;

        sblocks.exit().remove();

	this.drawTitle();
    }

    // ---------------------------------------------
    drawTicks (features) {
	this.currTicks = features;
	let rg = this.app.rGenome; // ref genome
	// feature tick marks
	if (!features || features.length === 0) {
	    this.gChromosomes.selectAll('[name="ticks"]').selectAll(".feature").remove();
	    return;
	}

	//
	let tGrps = this.gChromosomes.selectAll(".chromosome").select('[name="ticks"]');

	// group features by chromosome
        let fix = features.reduce((a,f) => { 
	    if (! a[f.chr]) a[f.chr] = [];
	    a[f.chr].push(f);
	    return a;
	}, {})
	tGrps.each(function(c) {
	    d3.select(this).datum( { chr: c, features: fix[c.name]  || []} );
	});

	// the tick elements
        let feats = tGrps.selectAll(".feature")
	    .data(d => d.features, d => d.mgpid);
	//
	let xAdj = f => (f.strand === "+" ? this.tickLength : -this.tickLength);
	//
	let shape = "circle";  // "circle" or "line"
	//
	let newfs = feats.enter()
	    .append(shape)
	    .attr("class","feature")
	    .on('click', (f) => {
		let i = f.canonical||f.ID;
	        this.app.setContext({landmark:i, highlight:[i]});
	    }) ;
	newfs.append("title")
		.text(f=>f.symbol || f.id);
	if (shape === "line") {
	    feats.attr("x1", f => xAdj(f) + 5)
	    feats.attr("y1", f => rg.yscale(f.start))
	    feats.attr("x2", f => xAdj(f) + this.tickLength + 5)
	    feats.attr("y2", f => rg.yscale(f.start))
	}
	else {
	    feats.attr("cx", f => xAdj(f))
	    feats.attr("cy", f => rg.yscale(f.start))
	    feats.attr("r",  this.tickLength / 2);
	}
	//
	feats.exit().remove()
    }
} // end class GenomeView




/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FeatureDetails; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(1);


class FeatureDetails extends __WEBPACK_IMPORTED_MODULE_0__Component__["a" /* Component */] {
    //----------------------------------------------
    constructor (app, elt) {
        super(app, elt);
	this.initDom ();
    }

    //----------------------------------------------
    initDom () {
	//
	this.root.select (".button.close")
	    .on("click.extra", () => this.update());
    }

    //----------------------------------------------
    //
    update(f) {
	// if called with no args, update using the previous feature
	f = f || this.lastFeature;
	if (!f) {
	   // FIXME: major reachover in this section
	   //
	   // fallback. take the first highlighted.
	   let r = this.app.zoomView.svgMain.select("rect.feature.highlight")[0][0];
	   // fallback. take the first feature
	   if (!r) r = this.app.zoomView.svgMain.select("rect.feature")[0][0];
	   if (r) f = r.__data__;
	}
	// remember
        if (!f) throw "Cannot update feature details. No feature.";
	this.lastFeature = f;

	// list of features to show in details area.
	// the given feature and all equivalents in other genomes.
	let flist = [f];
	if (f.mgiid) {
	    // FIXME: reachover
	    flist = this.app.featureManager.getCachedFeaturesByCanonicalId(f.mgiid);
	}
	// Got the list. Now order it the same as the displayed genomes
	// build index of genome name -> feature in flist
	let ix = flist.reduce((acc,f) => { acc[f.genome.name] = f; return acc; }, {})
	let genomeOrder = ([this.app.rGenome].concat(this.app.cGenomes));
	flist = genomeOrder.map(g => ix[g.name] || null);
	//
	let colHeaders = [
	    // columns headers and their % widths
	    ["Genome"     ,9],
	    ["MGP id"     ,17],
	    ["Type"       ,10.5],
	    ["BioType"    ,18.5],
	    ["Coords"     ,18],
	    ["Length"     ,7],
	    ["MGI id"     ,10],
	    ["MGI symbol" ,10]
	];
	// In the closed state, only show the header and the row for the passed feature
	if (this.root.classed('closed'))
	    flist = flist.filter( (ff, i) => ff === f );
	// Draw the table
	let t = this.root.select('table');
	let rows = t.selectAll('tr').data( [colHeaders].concat(flist) );
	rows.enter().append('tr')
	  .on("mouseenter", (f,i) => i !== 0 && this.app.zoomView.highlight(f, true))
	  .on("mouseleave", (f,i) => i !== 0 && this.app.zoomView.highlight());
	      
	rows.exit().remove();
	rows.classed("highlight", (ff, i) => (i !== 0 && ff === f));
	//
	// Given a feature, returns a list of strings for populating a table row.
	// If i===0, then f is not a feature, but a list columns names+widths.
	// 
	let cellData = function (f, i) {
	    if (i === 0) {
		return f;
	    }
	    let cellData = [ genomeOrder[i-1].label, ".", ".", ".", ".", ".", ".", "." ];
	    // f is null if it doesn't exist for genome i 
	    if (f) {
		let link = "";
		let mgiid = f.mgiid || "";
		if (mgiid) {
		    let url = `http://www.informatics.jax.org/accession/${mgiid}`;
		    link = `<a target="_blank" href="${url}">${mgiid}</a>`;
		}
		cellData = [
		    f.genome.label,
		    f.mgpid,
		    f.type,
		    f.biotype,
		    `${f.chr}:${f.start}..${f.end} (${f.strand})`,
		    `${f.end - f.start + 1} bp`,
		    link || mgiid,
		    f.symbol
		];
	    }
	    return cellData;
	};
	let cells = rows.selectAll("td")
	    .data((f,i) => cellData(f,i));
	cells.enter().append("td");
	cells.exit().remove();
	cells.html((d,i,j) => {
	    return j === 0 ? d[0] : d
	})
	.style("width", (d,i,j) => j === 0 ? `${d[1]}%` : null);
    }
}




/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ZoomView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SVGView__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Feature__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(0);




// ---------------------------------------------
class ZoomView extends __WEBPACK_IMPORTED_MODULE_0__SVGView__["a" /* SVGView */] {
    //
    constructor (app, elt, width, height, initialCoords, initialHi) {
      super(app, elt, width, height);
      //
      let self = this;
      //
      this.minSvgHeight = 250;
      this.blockHeight = 40;
      this.topOffset = 45;
      this.featHeight = 6;	// height of a rectangle representing a feature
      this.laneGap = 2;	        // space between swim lanes
      this.laneHeight = this.featHeight + this.laneGap;
      this.stripHeight = 70;    // height per genome in the zoom view
      this.stripGap = 20;	// space between strips
      this.dmode = 'comparison';// drawing mode. 'comparison' or 'reference'

      //
      // IDs of Features we're highlighting. May be mgpid  or mgiId
      // hiFeats is an obj whose keys are the IDs
      this.hiFeats = (initialHi || []).reduce( (a,v) => { a[v]=v; return a; }, {} );
      //
      this.fiducials = this.svg.insert("g",":first-child") // 
        .attr("class","fiducials");
      this.stripsGrp = this.svgMain.append("g")
        .attr("class","strips");
      this.axis = this.svgMain.append("g")
        .attr("class","axis");
      this.cxtMenu = this.root.select('[name="cxtMenu"]');
      //
      this.dragging = null;
      this.dragger = this.getDragger();
      //
      this.initDom();
    }
    //
    initDom () {
        let self = this;
	let r = this.root;
	let a = this.app;
	//
	r.select('.button.close')
	    .on('click', () => this.update());

	// zoom controls
	r.select("#zoomOut").on("click",
	    () => { a.zoom(a.defaultZoom) });
	r.select("#zoomIn") .on("click",
	    () => { a.zoom(1/a.defaultZoom) });
	r.select("#zoomOutMore").on("click",
	    () => { a.zoom(2*a.defaultZoom) });
	r.select("#zoomInMore") .on("click",
	    () => { a.zoom(1/(2*a.defaultZoom)) });

	// pan controls
	r.select("#panLeft") .on("click",
	    () => { a.pan(-a.defaultPan) });
	r.select("#panRight").on("click",
	    () => { a.pan(+a.defaultPan) });
	r.select("#panLeftMore") .on("click",
	    () => { a.pan(-5*a.defaultPan) });
	r.select("#panRightMore").on("click",
	    () => { a.pan(+5*a.defaultPan) });

	// Create context menu. 
	this.initContextMenu([{
            label: "MGI SNPs", 
	    icon: "open_in_new",
	    tooltip: "View SNPs at MGI for the current strains in the current region. (Some strains not available.)",
	    handler: ()=> this.app.linkToMgiSnpReport()
	},{
            label: "MGI QTLs", 
	    icon:  "open_in_new",
	    tooltip: "View QTL at MGI that overlap the current region.",
	    handler: ()=> this.app.linkToMgiQTLs()
	},{
            label: "MGI JBrowse", 
	    icon: "open_in_new",
	    tooltip: "Open MGI JBrowse (C57BL/6J GRCm38) with the current coordinate range.",
	    handler: ()=> this.app.linkToMgiJBrowse()
	}]);
	this.root
	  .on("click", () => {
	      // click on background => hide context menu
	      let tgt = d3.event.target;
	      if (tgt.tagName.toLowerCase() === "i" && tgt.innerHTML === "menu")
		  // exception: the context menu button itself
	          return;
	      else
		  this.hideContextMenu()
	      
	  })
	  .on('contextmenu', function(){
	      // right-click on a feature => feature context menu
	      let tgt = d3.event.target;
	      if (!tgt.classList.contains("feature")) return;
	      d3.event.preventDefault();
	      d3.event.stopPropagation();
	  });

	//
	//
	let fClickHandler = function (f, evt, preserve) {
	    let id = f.mgiid || f.mgpid;
	    if (evt.metaKey) {
		if (!evt.shiftKey && !preserve) this.hiFeats = {};
		this.hiFeats[id] = id;
	        this.app.setContext({landmark:(f.canonical || f.ID), delta:0})
		return;
	    }
	    if (evt.shiftKey) {
		if (this.hiFeats[id])
		    delete this.hiFeats[id]
		else
		    this.hiFeats[id] = id;
	    }
	    else {
		if (!preserve) this.hiFeats = {};
		this.hiFeats[id] = id;
	    }
	}.bind(this);
	//
	let fMouseOverHandler = function(f) {
		if (d3.event.altKey) {
		    // If user is holding the alt key, select everything touched.
		    fClickHandler(f, d3.event, true);
		    this.highlight();
		    // Don't register context changes until user has paused for at least 1s.
		    if (this.timeout) window.clearTimeout(this.timeout);
		    this.timeout = window.setTimeout(function(){ this.app.contextChanged(); }.bind(this), 1000);
		}
		else if (!d3.event.ctrlKey) 
		    this.highlight(f);
	}.bind(this);
	//
	let fMouseOutHandler = function(f) {
	    if (!d3.event.ctrlKey)
		this.highlight(); 
	}.bind(this);

	// 
        this.svg
	  .on("click", () => {
	      let t = d3.event.target;
	      let tgt = d3.select(t);
	      if (t.tagName == "rect" && t.classList.contains("feature")) {
		  // user clicked on a feature
		  fClickHandler(t.__data__, d3.event);
		  this.highlight();
	          this.app.contextChanged();
	      }
	      else if (t.tagName == "rect" && t.classList.contains("block") && !d3.event.shiftKey) {
		  // user clicked on a synteny block background
		  this.hiFeats = {};
		  this.highlight();
		  this.app.contextChanged();
	      }
	      else if (t.tagName == "rect" && tgt.attr('name') === 'zoomStripHandle' && d3.event.shiftKey) {
	          this.app.setContext({ref:t.__data__.genome.name});
	      }
	  })
	  .on("mouseover", () => {
	      let tgt = d3.select(d3.event.target);
	      let f = tgt.data()[0];
	      if (f instanceof __WEBPACK_IMPORTED_MODULE_1__Feature__["a" /* Feature */]) {
		  fMouseOverHandler(f);
	      }
	  })
	  .on("mouseout", () => {
	      let tgt = d3.select(d3.event.target);
	      let f = tgt.data()[0];
	      if (f instanceof __WEBPACK_IMPORTED_MODULE_1__Feature__["a" /* Feature */]) {
		  fMouseOutHandler(f);
	      }
	  });

	// Button: Drop down menu in zoom view
	this.root.select(".menu > .button")
	  .on("click", function () {
	      // show context menu at mouse event coordinates
	      let cx = d3.event.clientX;
	      let cy = d3.event.clientY;
	      let bb = d3.select(this)[0][0].getBoundingClientRect();
	      d3.event.stopPropagation();
	      self.showContextMenu(cx-bb.left,cy-bb.top);
	  });
	// zoom coordinates box
	this.root.select("#zoomCoords")
	    .call(zcs => zcs[0][0].value = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["e" /* formatCoords */])(this.app.coords))
	    .on("click", function () { this.select(); })
	    .on("change", function () { self.app.setCoordinates(this.value); });

	// zoom window size box
	this.root.select("#zoomWSize")
	    .on("click", function () { this.select(); })
	    .on("change", function() {
	        let ws = parseInt(this.value);
		let c = self.app.coords;
		if (isNaN(ws) || ws < 100) {
		    alert("Invalid window size. Please enter an integer >= 100.");
		    this.value = Math.round(c.end - c.start + 1);
		}
		else {
		    let mid = (c.start + c.end) / 2;
		    let news = Math.round(mid - ws/2);
		    let newe = news + ws - 1;
		    self.app.setContext({
		        chr: c.chr,
			start: news,
			end: newe,
			length: newe-news+1
		    });
		}
	    });
	// zoom drawing mode 
	this.root.selectAll('div[name="zoomDmode"] .button')
	    .on("click", function() {
		let r = self.root;
		let isC = r.classed('comparison');
		r.classed('comparison', !isC);
		r.classed('reference', isC);
		self.app.setContext({dmode: r.classed('comparison') ? 'comparison' : 'reference'});
	    });
    }
    //----------------------------------------------
    // Args:
    //     data (list of menuItem configs) Each config looks like {label:string, handler: function}
    initContextMenu (data) {
	this.cxtMenu.selectAll(".menuItem").remove(); // in case of re-init
        let mitems = this.cxtMenu
	  .selectAll(".menuItem")
	  .data(data);
	let news = mitems.enter()
	  .append("div")
	  .attr("class", "menuItem flexrow")
	  .attr("title", d => d.tooltip || null );
	news.append("label")
	  .text(d => d.label)
	  .on("click", d => {
	      d.handler();
	      this.hideContextMenu();
	  });
	news.append("i")
	  .attr("class", "material-icons")
	  .text( d=>d.icon );
    }
    //----------------------------------------------
    set highlighted (hls) {
	if (typeof(hls) === "string")
	    hls = [hls];
	//
	this.hiFeats = {};
        for(let h of hls){
	    this.hiFeats[h] = h;
	}
    }
    get highlighted () {
        return this.hiFeats ? Object.keys(this.hiFeats) : [];
    }

    //----------------------------------------------
    showContextMenu (x,y) {
        this.cxtMenu
	    .classed("showing", true)
	    .style("left", `${x}px`)
	    .style("top", `${y}px`)
	    ;
    }
    //----------------------------------------------
    hideContextMenu () {
        this.cxtMenu.classed("showing", false);
    }

    //----------------------------------------------
    // Args:
    //     gs (list of Genomes)
    // Side effects:
    //     For each Genome, sets g.zoomY 
    set genomes (gs) {
       gs.forEach( (g,i) => {g.zoomY = this.topOffset + i * (this.stripHeight + this.stripGap)} );
       this._genomes = gs;
    }
    get genomes () {
       return this._genomes;
    }
    //----------------------------------------------
    // Returns the names of the currently displayed genomes (stripes) in top-to-bottom order.
    //
    getGenomeYOrder () {
        let strips = this.svgMain.selectAll(".zoomStrip");
        let ss = strips[0].map(g=> {
	    let bb = g.getBoundingClientRect();
	    return [bb.y, g.__data__.genome.name];
        });
        let ns = ss.sort( (a,b) => a[0] - b[0] ).map( x => x[1] )
	return ns;
    }
    //----------------------------------------------
    // Sets the top-to-bottom order of the currently displayed genomes according to 
    // the given name list of names. Because we can't guarantee the given names correspond
    // to actual zoom strips, or that all strips are represented, etc.
    // Therefore, the list is preprecessed as follows:
    //     * duplicate names, if they exist, are removed
    //     * names that do not correspond to existing zoomStrips are removed
    //     * names of existing zoom strips that don't appear in the list are added to the end
    // The result is a list of names with these properties:
    //     * there is a 1:1 correspondence between names and actual zoom strips
    //     * the name order is consistent with the input list
    // This is the list used to (re)order the zoom strips.
    //
    // Given the list order: 
    //     * a Y-position is assigned to each genome
    //     * zoom strips that are NOT CURRENTLY BEING DRAGGED are translated to their new locations
    //
    // Args:
    //     ns (list of strings) Names of the genomes.
    // Returns:
    //     nothing
    // Side effects:
    //     Recalculates the Y-coordinates for each stripe based on the given order, then translates
    //     each strip to its new position.
    //
    setGenomeYOrder (ns) {
	this.genomes = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["k" /* removeDups */])(ns).map(n=> this.app.name2genome[n] ).filter(x=>x);
        this.genomes.forEach( (g,i) => {
	    let strip = d3.select(`#zoomView .zoomStrip[name="${g.name}"]`);
	    if (!strip.classed("dragging"))
	        strip.attr("transform", `translate(0,${g.zoomY})`);
	});
    }

    //----------------------------------------------
    // Returns a dragger (d3.behavior.drag) to be attached to each zoom strip.
    // Allows strips to be reordered by dragging.
    getDragger () {  
      let self = this;
      return d3.behavior.drag()
	  .origin(function(d,i){
	      return this.getBoundingClientRect();
	  })
          .on("dragstart.z", function(g) {
	      let t = d3.event.sourceEvent.target;
	      if (d3.event.sourceEvent.shiftKey || d3.select(t).attr("name") !== 'zoomStripHandle'){
	          return false;
	      }
	      d3.event.sourceEvent.stopPropagation();
	      let strip = this.closest(".zoomStrip");
	      self.dragging = d3.select(strip).classed("dragging", true);
	  })
	  .on("drag.z", function (g) {
	      if (!self.dragging) return;
	      let my = d3.mouse(self.svgMain[0][0])[1];
	      self.dragging.attr("transform", `translate(0, ${my})`);
	      self.setGenomeYOrder(self.getGenomeYOrder());
	      self.highlight();
	  })
	  .on("dragend.z", function (g) {
	      if (!self.dragging) return;
	      //
	      self.dragging.classed("dragging", false);
	      self.dragging = null;
	      self.setGenomeYOrder(self.getGenomeYOrder());
	      self.app.setContext({ genomes: self.getGenomeYOrder() });
	      window.setTimeout( self.highlight.bind(self), 250 );
	  })
	  ;
    }

    //----------------------------------------------
    clearBrushes () {
	this.root.selectAll("g.brush")
	    .each( function (b) {
	        b.brush.clear();
		d3.select(this).call(b.brush);
	    });
    }

    //----------------------------------------------
    // Returns the current brush coordinates, translated (if needed) to ref genome coordinates.
    bbGetRefCoords () {
      let rg = this.app.rGenome;
      let blk = this.brushing;
      let ext = blk.brush.extent();
      let r = { chr: blk.chr, start: ext[0], end: ext[1], blockId:blk.blockId };
      let tr = this.app.translator;
      if( blk.genome !== rg ) {
         // user is brushing a comp genomes so first translate
	 // coordinates to ref genome
	 let rs = this.app.translator.translate(blk.genome, r.chr, r.start, r.end, rg);
	 if (rs.length === 0) return;
	 r = rs[0];
      }
      else {
          r.blockId = rg.name;
      }
      return r;
    }
    //----------------------------------------------
    // handler for the start of a brush action by the user on a block
    bbStart (blk,bElt) {
      this.brushing = blk;
    }
    //----------------------------------------------
    // handler for brush motion. Main job is to reflect the brush
    // in parallel across the genomes in the view. The currnt brush extent 
    // is translated (if necessary) to ref genome space. Then those
    // coordinates are translated to each comparison genome space, and the appropriate
    // brush(es) updated.
    //
    bbBrush () {
      let rg = this.app.rGenome; // the reference genome
      let gs = [rg].concat(this.app.cGenomes); // all the genomes in the view
      let tr = this.app.translator; // for translating coords between genomes
      let blk = this.brushing; // the block currenly being brushed
      let r = this.bbGetRefCoords(); // current brush extent, in ref genome space
      gs.forEach( g => {
	  // if g is the refGenome, no need to translate. Otherwise, translate from 
	  // ref genome to comparison genome g.
          let rs;
	  if (g === rg) {
	      r.blockId = rg.name;
	      rs = [r];
	  }
	  else {
	      rs = tr.translate(rg, r.chr, r.start, r.end, g);
	  }
	  // note that translated results include block identifiers, which tell
	  // us the block (and hence, brushes) in the display to target.
	  rs.forEach( rr => {
	      let bb = this.svgMain.select(`.zoomStrip[name="${g.name}"] .sBlock[name="${rr.blockId}"] .brush`)
	      bb.each( function(b) {
	          b.brush.extent([rr.start, rr.end]);
		  d3.select(this).call(b.brush);
	      });
	  });
      });
    }
    //----------------------------------------------
    bbEnd () {
      let se = d3.event.sourceEvent;
      let xt = this.brushing.brush.extent();
      let r = this.bbGetRefCoords();
      this.brushing = null;
      //
      if (se.ctrlKey || se.altKey || se.metaKey) {
	  this.clearBrushes();
          return;
      }
      //
      let cc = this.app.coords; // current coordinates
      let currWidth = cc.end - cc.start + 1;
      let mid = (cc.start + cc.end)/2;
      //
      if (Math.abs(xt[0] - xt[1]) <= 10){
          // user clicked instead of dragged. Recenter the view on the clicked point.
	  let dx  = r.start - mid;
	  this.app.pan(dx/currWidth);
      }
      else {
	  // zoom in (no shift key) or out (shift key)
	  let brushWidth = r.end - r.start + 1;
	  let factor = brushWidth / currWidth;
	  this.app.zoom(se.shiftKey ? 1/factor : factor);
      }
    }

    //----------------------------------------------
    highlightStrip (g, elt) {
	if (g === this.currentHLG) return;
	this.currentHLG = g;
	//
	this.svgMain.selectAll('.zoomStrip')
	    .classed("highlighted", d => d.genome === g);
	this.svgMain.selectAll('.zoomStripHandle')
	    .classed("highlighted", d => d.genome === g);
	this.app.showBlocks(g);
    }

    //----------------------------------------------
    // Updates the ZoomView to show the given coordinate range from the reg genome and the corresponding
    // range(s) in each comparison genome.
    //
    updateViaMappedCoordinates (coords) {
	let self = this;
	let c = (coords || this.app.coords);
	d3.select("#zoomCoords")[0][0].value = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["e" /* formatCoords */])(c.chr, c.start, c.end);
	d3.select("#zoomWSize")[0][0].value = Math.round(c.end - c.start + 1)
	//
        let mgv = this.app;
	// when the translator is ready, we can translate the ref coords to each genome and
	// issue requests to load the features in those regions.
	mgv.translator.ready().then(function(){
	    // Now issue requests for features. One request per genome, each request specifies one or more
	    // coordinate ranges.
	    // Wait for all the data to become available, then draw.
	    //
	    let promises = [];

	    // First request is for the the reference genome. Get all the features in the range.
	    promises.push(mgv.featureManager.getFeatures(mgv.rGenome, [{
		// Need to simulate the results from calling the translator. 
		// 
		chr    : c.chr,
		start  : c.start,
		end    : c.end,
		index  : 0,
		fChr   : c.chr,
		fStart : c.start,
		fEnd   : c.end,
		fIndex  : 0,
		ori    : "+",
		blockId: mgv.rGenome.name
		}]));
	    if (! self.root.classed("closed")) {
		// Add a request for each comparison genome, using translated coordinates. 
		mgv.cGenomes.forEach(cGenome => {
		    let ranges = mgv.translator.translate( mgv.rGenome, c.chr, c.start, c.end, cGenome );
		    let p = mgv.featureManager.getFeatures(cGenome, ranges);
		    promises.push(p);
		});
	    }
	    // when everything is ready, call the draw function
	    Promise.all(promises).then( data => {
	        self.draw(data);
            });
	});
    }
    // Updates the ZoomView to show the region around a landmark in each genome.
    //
    // coords = {
    //     landmark : id of a feature to use as a reference
    //     flank|width : specify one of flank or width. 
    //         flank = amount of flanking region (bp) to include at both ends of the landmark, 
    //         so the total viewing region = flank + length(landmark) + flank.
    //         width = total viewing region width. If both width and flank are specified, flank is ignored.
    //     delta : amount to shift the view left/right
    // }
    // 
    // The landmark must exist in the current reference genome. 
    //
    updateViaLandmarkCoordinates (coords) {
	let c = coords;
	let mgv = this.app;
        let self = this;
	let rf = coords.landmarkRefFeat;
	let feats = coords.landmarkFeats;
	let delta = coords.delta || 0;
	// compute ranges around landmark in each genome
	let ranges = feats.map(f => {
	    let flank = c.length ? (c.length - f.length) / 2 : c.flank;
	    let range = {
		genome:	f.genome,
		chr:	f.chr,
		start:	Math.round(f.start - flank + delta),
		end:	Math.round(f.end + flank + delta)
	    } ;
	    if (f.genome === mgv.rGenome) {
		let c = this.app.coords = range;
		d3.select("#zoomCoords")[0][0].value = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["e" /* formatCoords */])(c.chr, c.start, c.end);
		d3.select("#zoomWSize")[0][0].value = Math.round(c.end - c.start + 1)
	    }
	    return range;
	});
	let seenGenomes = new Set();
	let rCoords;
	// Get (promises for) the features in each range.
	let promises = ranges.map(r => {
            let rrs;
	    seenGenomes.add(r.genome);
	    if (r.genome === mgv.rGenome){
		// the ref genome range
		rCoords = r;
	        rrs = [{
		    chr    : r.chr,
		    start  : r.start,
		    end    : r.end,
		    index  : 0,
		    fChr   : r.chr,
		    fStart : r.start,
		    fEnd   : r.end,
		    fIndex  : 0,
		    ori    : "+",
		    blockId: mgv.rGenome.name
		}];
	    }
	    else { 
		// turn the single range into a range for each overlapping synteny block with the ref genome
	        rrs = mgv.translator.translate(r.genome, r.chr, r.start, r.end, mgv.rGenome, true);
	    }
	    return mgv.featureManager.getFeatures(r.genome, rrs);
	});
	// For each genome where the landmark does not exist, compute a mapped range (as in mapped cmode).
	mgv.cGenomes.forEach(g => {
	    if (! seenGenomes.has(g)) {
		let rrs = mgv.translator.translate(mgv.rGenome, rCoords.chr, rCoords.start, rCoords.end, g);
		promises.push( mgv.featureManager.getFeatures(g, rrs) );
	    }
	});
	// When all the data is ready, draw.
	Promise.all(promises).then( data => {
	    self.draw(data);
	});
    }
    //
    update () {
	if (this.app.cmode === 'mapped')
	    this.updateViaMappedCoordinates(this.app.coords);
	else
	    this.updateViaLandmarkCoordinates(this.app.lcoords);
    }

    //----------------------------------------------
    orderSBlocks (sblocks) {
	// Sort the sblocks in each strip according to the current drawing mode.
	let cmpField = this.dmode === 'comparison' ? 'index' : 'fIndex';
	let cmpFunc = (a,b) => a.__data__[cmpField]-b.__data__[cmpField];
	sblocks.forEach( strip => strip.sort( cmpFunc ) );
	// pixels per base
	let ppb = this.width / (this.app.coords.end - this.app.coords.start + 1);
	let pstart = []; // offset (in pixels) of start position of next block, by strip index (0===ref)
	let bstart = []; // block start pos (in bp) assoc with pstart
	let cchr = null;
	let self = this;
	let dx;
	let pend;
	sblocks.each( function (b,i,j) { // b=block, i=index within strip, j=strip index
	    let blen = ppb * (b.end - b.start + 1); // total screen width of this sblock
	    b.flip = b.ori === '-' && self.dmode === 'reference';
	    b.xscale = d3.scale.linear().domain([b.start, b.end]).range( b.flip ? [blen, 0] : [0, blen] );
	    //
	    if (i===0) {
		// first block in each strip inits
		pstart[j] = 0;
		bstart[j] = b.start;
		dx = 0;
		cchr = b.chr;
	    }
	    else if (b.chr === cchr) {
		// Next block on current chr
		dx = pstart[j] + ppb * (b.start - bstart[j]);
	    }
	    else {
		// Changed chr
		pstart[j] = pend + 4;
		bstart[j] = b.start;
		dx = pstart[j];
	    }
	    d3.select(this).attr("transform", `translate(${dx},0)`);
	    pend = dx + blen;
	});
    }

    //----------------------------------------------
    // Draws the zoom view panel with the given data.
    //
    // Data is structured as follows:
    //     data = [ zoomStrip_data ]
    //     zoomStrip_data = { genome [ zoomBlock_data ] }
    //     zoomBlock_data = { xscale, chr, start, end, fChr, fStart, fEnd, ori, [ feature_data ] }
    //     feature_data = { mgpid, mgiid, symbol, chr, start, end, strand, type, biotype }
    //
    // Again, in English:
    //  - data is a list of items, one per strip to be displayed. Item[0] is data for the ref genome.
    //    Items[1+] are data for the comparison genome.
    //  - each strip item is an object containing a genome and a list of blocks. Item[0] always has 
    //    a single block.
    //  - each block is an object containing a chromosome, start, end, orientation, etc, and a list of features.
    //  - each feature has chr,start,end,strand,type,biotype,mgpid
    //
    draw (data) {
	// 
	let self = this;

	let closed = this.root.classed("closed");

	// reset the svg size based on number of strips
	let totalHeight = (this.stripHeight+this.stripGap) * data.length + 12;
	this.svg
	    .attr("height", totalHeight);

	// Draw the title on the zoomview position controls
	d3.select("#zoomView .zoomCoords label")
	    .text(data[0].genome.label + " coords");
	
	// the reference genome block (always just 1 of these).
	let rBlock = data[0].blocks[0];

	// x-scale and x-axis based on the ref genome data.
	this.xscale = d3.scale.linear()
	    .domain([rBlock.start,rBlock.end])
	    .range([0,this.width]);

        // -----------------------------------------------------
	// draw the axis
        // -----------------------------------------------------
	this.axisFunc = d3.svg.axis()
	    .scale(this.xscale)
	    .orient("top")
	    .outerTickSize(0)
	    .ticks(5)
	    ;
	this.axis.call(this.axisFunc);

        // -----------------------------------------------------
	// zoom strips (one per genome)
        // -----------------------------------------------------
        let zstrips = this.stripsGrp
	        .selectAll("g.zoomStrip")
		.data(data, d => d.genome.name);
	let newzs = zstrips.enter()
	        .append("g")
		.attr("class","zoomStrip")
		.attr("name", d => d.genome.name)
		.on("click", function (g) {
		    self.highlightStrip(g.genome, this);
		})
		.call(this.dragger)
		;
	newzs.append("text")
	    .attr("name", "genomeLabel")
	    .text( d => d.genome.label)
	    .attr("x", 0)
	    .attr("y", this.blockHeight/2 + 10)
	    .attr("font-family","sans-serif")
	    .attr("font-size", 10)
	    ;
	newzs.append("g")
	    .attr("name", "sBlocks");
	newzs.append("rect")
	    .attr("name", "zoomStripHandle")
	    .attr("x", -15)
	    .attr("y", -this.blockHeight / 2)
	    .attr("width", 15)
	    .attr("height", this.blockHeight)
	    ;

	zstrips
	    .classed("reference", d => d.genome === this.app.rGenome)
	    .attr("transform", g => `translate(0,${closed ? this.topOffset : g.genome.zoomY})`)
	    ;

        zstrips.exit()
	    .on(".drag", null)
	    .remove();

        // -----------------------------------------------------
	// synteny blocks. Each zoom strip has a list of 1 or more sblocks.
	// The reference genome always has just 1. The comp genomes many have
	// 1 or more (and in rare cases, 0).
        // -----------------------------------------------------
	let uniqify = blocks => {
	    // helper function. When sblock relationship between genomes is confused, requesting one
	    // region in genome A can end up requesting the same region in genome B twice. This function
	    // avoids drawing the same sblock twice. (NB: Really not sure where this check is best done.
	    // Could push it farther upstream.)
	    let seen = new Set();
	    return blocks.filter( b => { 
	        if (seen.has(b.index)) return false;
		seen.add(b.index);
		return true;
	    });
	};
        let sblocks = zstrips.select('[name="sBlocks"]').selectAll('g.sBlock')
	    .data(d => {
	        return uniqify(d.blocks);
	    }, b => b.blockId);
	let newsbs = sblocks.enter()
	    .append("g")
	    .attr("class", b => "sBlock " + 
	        (b.ori==="+" ? "plus" : b.ori==="-" ? "minus": "confused") + 
		(b.chr !== b.fChr ? " translocation" : ""))
	    .attr("name", b=>b.index)
	    ;
	let l0 = newsbs.append("g").attr("name", "layer0");
	let l1 = newsbs.append("g").attr("name", "layer1");

	// rectangle for the whole block
	l0.append("rect").attr("class", "block");
	// the axis line
	l0.append("line").attr("class","axis") ;
	// label
	l0.append("text")
	    .attr("class","blockLabel") ;
	// brush
	l0.append("g").attr("class","brush");

	sblocks.exit().remove();

	this.orderSBlocks(sblocks);

	// synteny block labels
	sblocks.select("text.blockLabel")
	    .text( b => b.chr )
	    .attr("x", b => (b.xscale(b.start) + b.xscale(b.end))/2 )
	    .attr("y", this.blockHeight / 2 + 10)
	    ;

	// synteny block rects
	sblocks.select("rect.block")
	  .attr("x",     b => b.xscale(b.flip ? b.end : b.start))
	  .attr("y",     b => -this.blockHeight / 2)
	  .attr("width", b => Math.abs(b.xscale(b.end)-b.xscale(b.start)))
	  .attr("height",this.blockHeight);

	// synteny block axis lines
	sblocks.select("line.axis")
	    .attr("x1", b => b.xscale.range()[0])
	    .attr("y1", 0)
	    .attr("x2", b => b.xscale.range()[1])
	    .attr("y2", 0)
	    ;

	// brush
	sblocks.select("g.brush")
	    .attr("transform", b => `translate(0,${this.blockHeight / 2})`)
	    .each(function(b) {
		if (!b.brush) {
		    b.brush = d3.svg.brush()
			.on("brushstart", function(){ self.bbStart( b, this ); })
			.on("brush",      function(){ self.bbBrush( b, this ); })
			.on("brushend",   function(){ self.bbEnd( b, this ); })
		}
		b.brush.x(b.xscale).clear();
		d3.select(this).call(b.brush);
	    })
	    .selectAll("rect")
		.attr("height", 10);

	this.drawFeatures(sblocks);

	//
	this.app.facetManager.applyAll();

	// We need to let the view render before doing the highlighting, since it depends on
	// the positions of rectangles in the scene.
	window.setTimeout(() => {
	    //this.setGenomeYOrder( this.genomes.map(g => g.name) );
	    //window.setTimeout(() => this.highlight(), 50);
	    this.highlight();
	}, 50);
    };

    //----------------------------------------------
    // Draws the features (rectangles) for the specified synteny blocks.
    // Args:
    //     sblocks (D3 selection of g.sblock nodes) - multilevel selection.
    //        Array (corresponding to strips) of arrays of synteny blocks.
    //
    drawFeatures (sblocks) {
        let self = this;
	//
	// never draw the same feature twice
	let drawn = new Set();	// set of mgpids of drawn features
	let filterDrawn = function (f) {
	    // returns true if we've not seen this one before.
	    // registers that we've seen it.
	    let fid = f.mgpid;
	    let v = ! drawn.has(fid);
	    drawn.add(fid);
	    return v;
	};
	let feats = sblocks.select('[name="layer1"]').selectAll(".feature")
	    .data(d=>d.features.filter(filterDrawn), d=>d.mgpid);
	feats.exit().remove();
	//
	let newFeats = feats.enter().append("rect")
	    .attr("class", f => "feature" + (f.strand==="-" ? " minus" : " plus"))
	    .attr("name", f => f.mgpid)
	    .style("fill", f => self.app.cscale(f.getMungedType()))
	    ;

	// draw the rectangles

	// returns the synteny block containing this feature
	let fBlock = function (featElt) {
	    let blkElt = featElt.parentNode;
	    return blkElt.__data__;
	}
	let fx = function(f) {
	    let b = fBlock(this);
	    return b.xscale(f.start)
	};
	let fw = function (f) {
	    let b = fBlock(this);
	    return Math.abs(b.xscale(f.end) - b.xscale(f.start)) + 1;
	};
	let fy = function (f) {
	       let b = fBlock(this);
	       if (f.strand == "+"){
		   if (b.flip) 
		       return self.laneHeight*f.lane - self.featHeight; 
		   else 
		       return -self.laneHeight*f.lane;
	       }
	       else {
		   // f.lane is negative for "-" strand
		   if (b.flip) 
		       return self.laneHeight*f.lane;
		   else
		       return -self.laneHeight*f.lane - self.featHeight; 
	       }
	   };

	feats
	  .attr("x", fx)
	  .attr("width", fw)
	  .attr("y", fy)
	  .attr("height", this.featHeight)
	  ;
    }

    //----------------------------------------------
    // Updates feature highlighting in the current zoom view.
    // Features to be highlighted include those in the hiFeats list plus the feature
    // corresponding to the rectangle argument, if given. (The mouseover feature.)
    //
    // Draws fiducials for features in this list that:
    // 1. overlap the current zoomView coord range
    // 2. are not rendered invisible by current facet settings
    //
    // Args:
    //    current (rect element) Optional. Add'l rectangle element, e.g., that was moused-over. Highlighting
    //        will include the feature corresponding to this rect along with those in the highlight list.
    //    pulseCurrent (boolean) If true and current is given, cause it to pulse briefly.
    //
    highlight (current, pulseCurrent) {
	let self = this;
	// current feature
	let currFeat = current ? (current instanceof __WEBPACK_IMPORTED_MODULE_1__Feature__["a" /* Feature */] ? current : current.__data__) : null;
	// create local copy of hiFeats, with current feature added
	let hiFeats = Object.assign({}, this.hiFeats);
	if (currFeat) {
	    hiFeats[currFeat.id] = currFeat.id;
	}

	// Filter all features (rectangles) in the scene for those being highlighted.
	// Along the way, build index mapping feature id to its "stack" of equivalent features,
	// i.e. a list of its genologs sorted by y coordinate.
	// Also, make each highlighted feature taller (so it stands above its neighbors)
	// and give it the ".highlight" class.
	//
	let stacks = {}; // fid -> [ rects ] 
	let dh = this.blockHeight/2 - this.featHeight;
        let feats = this.svgMain.selectAll(".feature")
	  // filter rect.features for those in the highlight list
	  .filter(function(ff){
	      // highlight ff if either id is in the list AND it's not been hidden
	      let mgi = hiFeats[ff.mgiid];
	      let mgp = hiFeats[ff.mgpid];
	      let showing = d3.select(this).style("display") !== "none";
	      let hl = showing && (mgi || mgp);
	      if (hl) {
		  // for each highlighted feature, add its rectangle to the list
		  let k = ff.id;
		  if (!stacks[k]) stacks[k] = []
		  stacks[k].push(this)
	      }
	      // 
	      d3.select(this)
		  .classed("highlight", hl)
		  .classed("current", hl && currFeat && this.__data__.id === currFeat.id)
		  .classed("extra", pulseCurrent && ff === currFeat)
	      return hl;
	  })
	  ;

	// build data array for drawing fiducials between equivalent features
	let data = [];
	for (let k in stacks) {
	    // for each highlighted feature, sort the rectangles in its list by Y-coordinate
	    let rects = stacks[k];
	    rects.sort( (a,b) => parseFloat(a.getAttribute("y")) - parseFloat(b.getAttribute("y")) );
	    rects.sort( (a,b) => {
		return a.__data__.genome.zoomY - b.__data__.genome.zoomY;
	    });
	    // Want a polygon between each successive pair of items. The following creates a list of
	    // n pairs, where rect[i] is paired with rect[i+1]. The last pair consists of the last
	    // rectangle paired with undefined. (We want this.)
	    let pairs = rects.map((r, i) => [r,rects[i+1]]);
	    // Add a class ("current") for the polygons associated with the mouseover feature so they
	    // can be distinguished from others.
	    data.push({ fid: k, rects: pairs, cls: (currFeat && currFeat.id === k ? 'current' : '') });
	}
	this.drawFiducials(data, currFeat);

	// FIXME: reachover
	this.app.featureDetails.update(currFeat);
    }

    //----------------------------------------------
    // Draws polygons that connect highlighted features in the view
    // Args:
    //   data : list of {
    //       fid: feature-id, 
    //       cls: extra class for .featureMark group,
    //       rects: list of [rect1,rect2] pairs, 
    //       }
    //   currFeat : current (mouseover) feature (if any)
    //
    drawFiducials (data, currFeat) {
	let self = this;
	//
	// put fiducial marks in their own group 
	let fGrp = this.fiducials.classed("hidden", false);

	// Bind first level data to "featureMarks" groups
	let ffGrps = fGrp.selectAll("g.featureMarks")
	    .data(data, d => d.fid);
	ffGrps.enter().append("g")
	    .attr("name", d => d.fid);
	ffGrps.exit().remove();
	//
	ffGrps.attr("class",d => "featureMarks " + (d.cls || ""))

	// -------------------------------------
	// Draw the connector polygons.
	// Bind second level data (rectangle pairs) to polygons in the group
	let pgons = ffGrps.selectAll("polygon")
	    .data(d=>d.rects.filter(r => r[0] && r[1]));
	pgons.exit().remove();
	pgons.enter().append("polygon")
	    .attr("class","fiducial")
	    ;
	//
	pgons.attr("points", r => {
	    // polygon connects bottom corners of 1st rect to top corners of 2nd rect
	    let c1 = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* coordsAfterTransform */])(r[0]); // transform coords for 1st rect
	    let c2= Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* coordsAfterTransform */])(r[1]);  // transform coords for 2nd rect
	    // four polygon points
	    let s = `${c1.x},${c1.y+c1.height} ${c2.x},${c2.y} ${c2.x+c2.width},${c2.y} ${c1.x+c1.width},${c1.y+c1.height}`
	    return s;
	})
	// mousing over the fiducial highlights (as if the user had moused over the feature itself)
	.on("mouseover", (p) => {
	    if (!d3.event.ctrlKey)
	        this.highlight(p[0]);
	})
	.on("mouseout",  (p) => {
	    if (!d3.event.ctrlKey)
	        this.highlight();
	});
	// -------------------------------------
	// Draw feature labels. Each label is drawn once, above the first rectangle in its list.
	// The exception is the current (mouseover) feature, where the label is drawn above that feature.
	let labels = ffGrps.selectAll('text.featLabel')
	    .data(d => {
		let r = d.rects[0][0];
		if (currFeat && (d.fid === currFeat.ID || d.fid === currFeat.canonical)){
		    r = d.rects.map( rr =>
		       rr[0].__data__ === currFeat ? rr[0] : rr[1]&&rr[1].__data__ === currFeat ? rr[1] : null
		       ).filter(x=>x)[0];
		}
	        return [{
		    fid: d.fid,
		    rect: r,
		    trect: Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* coordsAfterTransform */])(r)
		}];
	    });

	// Draw the text.
	labels.enter().append('text').attr('class','featLabel');
	labels.exit().remove();
	labels
	  .attr("x", d => d.trect.x + d.trect.width/2 )
	  .attr("y", d => d.rect.__data__.genome.zoomY - 3)
	  .text(d => {
	       let f = d.rect.__data__;
	       let sym = f.symbol || f.mgpid;
	       return sym;
	  });

	// Put a rectangle behind each label as a background
	let lblBoxData = labels.map(lbl => lbl[0].getBBox())
	let lblBoxes = ffGrps.selectAll('rect.featLabelBox')
	    .data((d,i) => [lblBoxData[i]]);
	lblBoxes.enter().insert('rect','text').attr('class','featLabelBox');
	lblBoxes.exit().remove();
	lblBoxes
	    .attr("x",      bb => bb.x-2)
	    .attr("y",      bb => bb.y-1)
	    .attr("width",  bb => bb.width+4)
	    .attr("height", bb => bb.height+2)
	    ;
	
	// if there is a currFeat, move its fiducials to the end (so they're on top of everyone else)
	if (currFeat) {
	    // get list of group elements from the d3 selection
	    let ffList = ffGrps[0];
	    // find the one whose feature is currFeat
	    let i = -1;
	    ffList.forEach( (g,j) => { if (g.__data__.fid === currFeat.id) i = j; });
	    // if we found it and it's not already the last, move it to the
	    // last position and reorder in the DOM.
	    if (i >= 0) {
		let lasti = ffList.length - 1;
	        let x = ffList[i];
		ffList[i] = ffList[lasti];
		ffList[lasti] = x;
		ffGrps.order();
	    }
	}
	
    }
    //----------------------------------------------
    hideFiducials () {
	this.svgMain.select("g.fiducials")
	    .classed("hidden", true);
    }
} // end class ZoomView




/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SVGView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(1);


// ---------------------------------------------
class SVGView extends __WEBPACK_IMPORTED_MODULE_0__Component__["a" /* Component */] {
    constructor (app, elt, width, height, margins, rotation, translation) {
        super(app, elt);
        this.svg = this.root.select("svg");
        this.svgMain = this.svg
            .append("g")    // the margin-translated group
            .append("g")	  // main group for the drawing
	    .attr("name","svgmain");
	this.outerWidth = 100;
	this.width = 100;
	this.outerHeight = 100;
	this.height = 100;
	this.margins = {top: 18, right: 12, bottom: 12, left: 12};
	this.rotation = 0;
	this.translation = [0,0];
	//
        this.setGeom({width, height, margins, rotation, translation});
    }
    setGeom (cfg) {
        this.outerWidth  = cfg.width       || this.outerWidth;
        this.outerHeight = cfg.height      || this.outerHeight;
        this.margins     = cfg.margins     || this.margins;
	this.rotation    = typeof(cfg.rotation) === "number" ? cfg.rotation : this.rotation;
	this.translation = cfg.translation || this.translation;
        //
        this.width  = this.outerWidth  - this.margins.left - this.margins.right;
        this.height = this.outerHeight - this.margins.top  - this.margins.bottom;
        //
        this.svg.attr("width", this.outerWidth)
              .attr("height", this.outerHeight)
            .select('g[name="svgmain"]')
              .attr("transform", `translate(${this.margins.left},${this.margins.top}) rotate(${this.rotation}) translate(${this.translation[0]},${this.translation[1]})`);
        return this;
    }
    setMargins( tm, rm, bm, lm ) {
	if (arguments.length === 1) {
	    rm = bm = lm = tm;
	}
	else if (arguments.length === 2) {
	    bm = tm;
	    lm = rm;
	}
	else if (arguments.length !== 4)
	    throw "Bad arguments.";
        //
	this.setGeom({top: tm, right: rm, bottom: bm, left: lm});
	//
	return this;
    }
    rotate (deg) {
        this.setGeom({rotation:deg});
	return this;
    }
    translate (dx, dy) {
        this.setGeom({translation:[dx,dy]});
	return this;
    }
    // Args:
    //   the window width
    fitToWidth (width) {
        let r = this.svg[0][0].getBoundingClientRect();
        this.setGeom({width: width - r.x})
	return this;
    }

} // end class SVGView




/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZThjOGVmYzM2ZjhiYWU3Nzg4N2MiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1N0b3JhZ2VNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvdmlld2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9NR1ZBcHAuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZS5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1F1ZXJ5TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQXV4RGF0YU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYUV2YWx1YXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvTGlzdEVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvVXNlclByZWZzTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmFjZXRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GYWNldC5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQlRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9CbG9ja1RyYW5zbGF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZVZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9ab29tVmlldy5qcyIsIndlYnBhY2s6Ly8v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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQW9CQTs7Ozs7Ozs7QUN6VkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7OztBQ3JCUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7OztBQ3JFUjtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLG9CQUFvQjtBQUNyRCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFFBQVEsVUFBVSxFQUFFLElBQUk7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLHFCQUFxQjtBQUM3Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsRUFBRTtBQUNsQixpQkFBaUIsS0FBSyxHQUFHLEVBQUU7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQyxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsaUJBQWlCLEdBQUcsZ0JBQWdCLEdBQUcsYUFBYTtBQUNwRSxpQkFBaUIsY0FBYyxHQUFHLGdCQUFnQixHQUFHLGdCQUFnQjtBQUNyRTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELGFBQWE7QUFDbEU7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRU87Ozs7Ozs7Ozs7QUMvUm9COztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUTs7Ozs7Ozs7Ozs7O0FDbkVxRDtBQUN6QztBQUNROztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7Ozs7O0FDak9zQjs7QUFFOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUTs7Ozs7Ozs7OztBQ3ZDUTs7QUFFaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7OztBQzdCUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7Ozs7O0FDcEJRO0FBQ1U7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztB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dUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLDhFQUE4RTtBQUM5RjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpR0FBeUM7QUFDekMsZ0dBQXdDO0FBQ3hDO0FBQ0EsZ0JBQWdCLEtBQUssR0FBRyxlQUFlLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxjQUFjLEdBQUcsS0FBSyxHQUFHLGNBQWMsR0FBRyxlQUFlO0FBQ25IO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiwyQ0FBMkMsRUFBRTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7Ozs7O0FDM2xDWTs7QUFFcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDhDQUE4QztBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLGtCQUFrQixHQUFHLGlCQUFpQixXQUFXLGNBQWMsY0FBYyxvQkFBb0IsR0FBRyxvQkFBb0I7QUFDdEs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLHlDQUF5QztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixhQUFhO0FBQ25DO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixvQkFBb0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLG1CQUFtQjtBQUN6QztBQUNBOztBQUVBLENBQUM7O0FBRU8iLCJmaWxlIjoibWd2LmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGU4YzhlZmMzNmY4YmFlNzc4ODdjIiwiXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vICAgICAgICAgICAgICAgICAgICBVVElMU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gKFJlLSlJbml0aWFsaXplcyBhbiBvcHRpb24gbGlzdC5cbi8vIEFyZ3M6XG4vLyAgIHNlbGVjdG9yIChzdHJpbmcgb3IgTm9kZSkgQ1NTIHNlbGVjdG9yIG9mIHRoZSBjb250YWluZXIgPHNlbGVjdD4gZWxlbWVudC4gT3IgdGhlIGVsZW1lbnQgaXRzZWxmLlxuLy8gICBvcHRzIChsaXN0KSBMaXN0IG9mIG9wdGlvbiBkYXRhIG9iamVjdHMuIE1heSBiZSBzaW1wbGUgc3RyaW5ncy4gTWF5IGJlIG1vcmUgY29tcGxleC5cbi8vICAgdmFsdWUgKGZ1bmN0aW9uIG9yIG51bGwpIEZ1bmN0aW9uIHRvIHByb2R1Y2UgdGhlIDxvcHRpb24+IHZhbHVlIGZyb20gYW4gb3B0cyBpdGVtXG4vLyAgICAgICBEZWZhdWx0cyB0byB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gKHg9PngpLlxuLy8gICBsYWJlbCAoZnVuY3Rpb24gb3IgbnVsbCkgRnVuY3Rpb24gdG8gcHJvZHVjZSB0aGUgPG9wdGlvbj4gbGFiZWwgZnJvbSBhbiBvcHRzIGl0ZW1cbi8vICAgICAgIERlZmF1bHRzIHRvIHRoZSB2YWx1ZSBmdW5jdGlvbi5cbi8vICAgbXVsdGkgKGJvb2xlYW4pIFNwZWNpZmllcyBpZiB0aGUgbGlzdCBzdXBwb3J0IG11bHRpcGxlIHNlbGVjdGlvbnMuIChkZWZhdWx0ID0gZmFsc2UpXG4vLyAgIHNlbGVjdGVkIChmdW5jdGlvbiBvciBudWxsKSBGdW5jdGlvbiB0byBkZXRlcm1pbmUgaWYgYSBnaXZlbiBvcHRpb24gaXMgc2VsZWN0ZC5cbi8vICAgICAgIERlZmF1bHRzIHRvIGQ9PkZhbHNlLiBOb3RlIHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBvbmx5IGFwcGxpZWQgdG8gbmV3IG9wdGlvbnMuXG4vLyAgIHNvcnRCeSAoZnVuY3Rpb24pIE9wdGlvbmFsLiBJZiBwcm92aWRlZCwgYSBjb21wYXJpc29uIGZ1bmN0aW9uIHRvIHVzZSBmb3Igc29ydGluZyB0aGUgb3B0aW9ucy5cbi8vICAgXHQgVGhlIGNvbXBhcmlzb24gZnVuY3Rpb24gaXMgcGFzc2VzIHRoZSBkYXRhIG9iamVjdHMgY29ycmVzcG9uZGluZyB0byB0d28gb3B0aW9ucyBhbmQgc2hvdWxkXG4vLyAgIFx0IHJldHVybiAtMSwgMCBvciArMS4gSWYgbm90IHByb3ZpZGVkLCB0aGUgb3B0aW9uIGxpc3Qgd2lsbCBoYXZlIHRoZSBzYW1lIHNvcnQgb3JkZXIgYXMgdGhlIG9wdHMgYXJndW1lbnQuXG4vLyBSZXR1cm5zOlxuLy8gICBUaGUgb3B0aW9uIGxpc3QgaW4gYSBEMyBzZWxlY3Rpb24uXG5mdW5jdGlvbiBpbml0T3B0TGlzdChzZWxlY3Rvciwgb3B0cywgdmFsdWUsIGxhYmVsLCBtdWx0aSwgc2VsZWN0ZWQsIHNvcnRCeSkge1xuXG4gICAgLy8gc2V0IHVwIHRoZSBmdW5jdGlvbnNcbiAgICBsZXQgaWRlbnQgPSBkID0+IGQ7XG4gICAgdmFsdWUgPSB2YWx1ZSB8fCBpZGVudDtcbiAgICBsYWJlbCA9IGxhYmVsIHx8IHZhbHVlO1xuICAgIHNlbGVjdGVkID0gc2VsZWN0ZWQgfHwgKHggPT4gZmFsc2UpO1xuXG4gICAgLy8gdGhlIDxzZWxlY3Q+IGVsdFxuICAgIGxldCBzID0gZDMuc2VsZWN0KHNlbGVjdG9yKTtcblxuICAgIC8vIG11bHRpc2VsZWN0XG4gICAgcy5wcm9wZXJ0eSgnbXVsdGlwbGUnLCBtdWx0aSB8fCBudWxsKSA7XG5cbiAgICAvLyBiaW5kIHRoZSBvcHRzLlxuICAgIGxldCBvcyA9IHMuc2VsZWN0QWxsKFwib3B0aW9uXCIpXG4gICAgICAgIC5kYXRhKG9wdHMsIGxhYmVsKTtcbiAgICBvcy5lbnRlcigpXG4gICAgICAgIC5hcHBlbmQoXCJvcHRpb25cIikgXG4gICAgICAgIC5hdHRyKFwidmFsdWVcIiwgdmFsdWUpXG4gICAgICAgIC5wcm9wZXJ0eShcInNlbGVjdGVkXCIsIG8gPT4gc2VsZWN0ZWQobykgfHwgbnVsbClcbiAgICAgICAgLnRleHQobGFiZWwpIFxuICAgICAgICA7XG4gICAgLy9cbiAgICBvcy5leGl0KCkucmVtb3ZlKCkgO1xuXG4gICAgLy8gc29ydCB0aGUgcmVzdWx0c1xuICAgIGlmICghc29ydEJ5KSBzb3J0QnkgPSAoYSxiKSA9PiB7XG4gICAgXHRsZXQgYWkgPSBvcHRzLmluZGV4T2YoYSk7XG5cdGxldCBiaSA9IG9wdHMuaW5kZXhPZihiKTtcblx0cmV0dXJuIGFpIC0gYmk7XG4gICAgfVxuICAgIG9zLnNvcnQoc29ydEJ5KTtcblxuICAgIC8vXG4gICAgcmV0dXJuIHM7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJvbWlzaWZpZXMgYSBjYWxsIHRvIGQzLnRzdi5cbi8vIEFyZ3M6XG4vLyAgIHVybCAoc3RyaW5nKSBUaGUgdXJsIG9mIHRoZSB0c3YgcmVzb3VyY2Vcbi8vIFJldHVybnM6XG4vLyAgIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBsaXN0IG9mIHJvdyBvYmplY3RzXG5mdW5jdGlvbiBkM3Rzdih1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGQzLnRzdih1cmwsIGZ1bmN0aW9uKGVycm9yLCB2YWwpe1xuICAgICAgICAgICAgZXJyb3IgPyByZWplY3QoeyBzdGF0dXM6IGVycm9yLnN0YXR1cywgc3RhdHVzVGV4dDogZXJyb3Iuc3RhdHVzVGV4dH0pIDogcmVzb2x2ZSh2YWwpO1xuICAgICAgICB9KSAgXG4gICAgfSk7IFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByb21pc2lmaWVzIGEgY2FsbCB0byBkMy5qc29uLlxuLy8gQXJnczpcbi8vICAgdXJsIChzdHJpbmcpIFRoZSB1cmwgb2YgdGhlIGpzb24gcmVzb3VyY2Vcbi8vIFJldHVybnM6XG4vLyAgIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBqc29uIG9iamVjdCB2YWx1ZSwgb3IgcmVqZWN0cyB3aXRoIGFuIGVycm9yXG5mdW5jdGlvbiBkM2pzb24odXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkMy5qc29uKHVybCwgZnVuY3Rpb24oZXJyb3IsIHZhbCl7XG4gICAgICAgICAgICBlcnJvciA/IHJlamVjdCh7IHN0YXR1czogZXJyb3Iuc3RhdHVzLCBzdGF0dXNUZXh0OiBlcnJvci5zdGF0dXNUZXh0fSkgOiByZXNvbHZlKHZhbCk7XG4gICAgICAgIH0pICBcbiAgICB9KTsgXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyBhIGRlZXAgY29weSBvZiBvYmplY3Qgby4gXG4vLyBBcmdzOlxuLy8gICBvICAob2JqZWN0KSBNdXN0IGJlIGEgSlNPTiBvYmplY3QgKG5vIGN1cmN1bGFyIHJlZnMsIG5vIGZ1bmN0aW9ucykuXG4vLyBSZXR1cm5zOlxuLy8gICBhIGRlZXAgY29weSBvZiBvXG5mdW5jdGlvbiBkZWVwYyhvKSB7XG4gICAgaWYgKCFvKSByZXR1cm4gbztcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobykpO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBhcnNlcyBhIHN0cmluZyBvZiB0aGUgZm9ybSBcImNocjpzdGFydC4uZW5kXCIuXG4vLyBSZXR1cm5zOlxuLy8gICBvYmplY3QgY29udGluaW5nIHRoZSBwYXJzZWQgZmllbGRzLlxuLy8gRXhhbXBsZTpcbi8vICAgcGFyc2VDb29yZHMoXCIxMDoxMDAwMDAwMC4uMjAwMDAwMDBcIikgLT4ge2NocjpcIjEwXCIsIHN0YXJ0OjEwMDAwMDAwLCBlbmQ6MjAwMDAwMDB9XG5mdW5jdGlvbiBwYXJzZUNvb3JkcyAoY29vcmRzKSB7XG4gICAgbGV0IHJlID0gLyhbXjpdKyk6KFxcZCspXFwuXFwuKFxcZCspLztcbiAgICBsZXQgbSA9IGNvb3Jkcy5tYXRjaChyZSk7XG4gICAgcmV0dXJuIG0gPyB7Y2hyOm1bMV0sIHN0YXJ0OnBhcnNlSW50KG1bMl0pLCBlbmQ6cGFyc2VJbnQobVszXSl9IDogbnVsbDtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBGb3JtYXRzIGEgY2hyb21vc29tZSBuYW1lLCBzdGFydCBhbmQgZW5kIHBvc2l0aW9uIGFzIGEgc3RyaW5nLlxuLy8gQXJncyAoZm9ybSAxKTpcbi8vICAgY29vcmRzIChvYmplY3QpIE9mIHRoZSBmb3JtIHtjaHI6c3RyaW5nLCBzdGFydDppbnQsIGVuZDppbnR9XG4vLyBBcmdzIChmb3JtIDIpOlxuLy8gICBjaHIgc3RyaW5nXG4vLyAgIHN0YXJ0IGludFxuLy8gICBlbmQgaW50XG4vLyBSZXR1cm5zOlxuLy8gICAgIHN0cmluZ1xuLy8gRXhhbXBsZTpcbi8vICAgICBmb3JtYXRDb29yZHMoXCIxMFwiLCAxMDAwMDAwMCwgMjAwMDAwMDApIC0+IFwiMTA6MTAwMDAwMDAuLjIwMDAwMDAwXCJcbmZ1bmN0aW9uIGZvcm1hdENvb3JkcyAoY2hyLCBzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0bGV0IGMgPSBjaHI7XG5cdGNociA9IGMuY2hyO1xuXHRzdGFydCA9IGMuc3RhcnQ7XG5cdGVuZCA9IGMuZW5kO1xuICAgIH1cbiAgICByZXR1cm4gYCR7Y2hyfToke3N0YXJ0fS4uJHtlbmR9YFxufVxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRydWUgaWZmIHRoZSB0d28gcmFuZ2VzIG92ZXJsYXAgYnkgYXQgbGVhc3QgMS5cbi8vIEVhY2ggcmFuZ2UgbXVzdCBoYXZlIGEgY2hyLCBzdGFydCwgYW5kIGVuZC5cbi8vXG5mdW5jdGlvbiBvdmVybGFwcyAoYSwgYikge1xuICAgIHJldHVybiBhLmNociA9PT0gYi5jaHIgJiYgYS5zdGFydCA8PSBiLmVuZCAmJiBhLmVuZCA+PSBiLnN0YXJ0O1xufVxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBHaXZlbiB0d28gcmFuZ2VzLCBhIGFuZCBiLCByZXR1cm5zIGEgLSBiLlxuLy8gVGhlIHJlc3VsdCBpcyBhIGxpc3Qgb2YgMCwgMSBvciAyIG5ldyByYW5nZXMsIGRlcGVuZGluZyBvbiBhIGFuZCBiLlxuZnVuY3Rpb24gc3VidHJhY3QoYSwgYikge1xuICAgIGlmIChhLmNociAhPT0gYi5jaHIpIHJldHVybiBbIGEgXTtcbiAgICBsZXQgYWJMZWZ0ID0geyBjaHI6YS5jaHIsIHN0YXJ0OmEuc3RhcnQsICAgICAgICAgICAgICAgICAgICBlbmQ6TWF0aC5taW4oYS5lbmQsIGIuc3RhcnQtMSkgfTtcbiAgICBsZXQgYWJSaWdodD0geyBjaHI6YS5jaHIsIHN0YXJ0Ok1hdGgubWF4KGEuc3RhcnQsIGIuZW5kKzEpLCBlbmQ6YS5lbmQgfTtcbiAgICBsZXQgYW5zID0gWyBhYkxlZnQsIGFiUmlnaHQgXS5maWx0ZXIoIHIgPT4gci5zdGFydCA8PSByLmVuZCApO1xuICAgIHJldHVybiBhbnM7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ3JlYXRlcyBhIGxpc3Qgb2Yga2V5LHZhbHVlIHBhaXJzIGZyb20gdGhlIG9iai5cbmZ1bmN0aW9uIG9iajJsaXN0IChvKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG8pLm1hcChrID0+IFtrLCBvW2tdXSkgICAgXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0cnVlIGlmZiB0aGUgdHdvIGxpc3RzIGhhdmUgdGhlIHNhbWUgY29udGVudHMgKGJhc2VkIG9uIGluZGV4T2YpLlxuLy8gQnJ1dGUgZm9yY2UgYXBwcm9hY2guIEJlIGNhcmVmdWwgd2hlcmUgeW91IHVzZSB0aGlzLlxuZnVuY3Rpb24gc2FtZSAoYWxzdCxibHN0KSB7XG4gICByZXR1cm4gYWxzdC5sZW5ndGggPT09IGJsc3QubGVuZ3RoICYmIFxuICAgICAgIGFsc3QucmVkdWNlKChhY2MseCkgPT4gKGFjYyAmJiBibHN0LmluZGV4T2YoeCk+PTApLCB0cnVlKTtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFkZCBiYXNpYyBzZXQgb3BzIHRvIFNldCBwcm90b3R5cGUuXG4vLyBMaWZ0ZWQgZnJvbTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU2V0XG5TZXQucHJvdG90eXBlLnVuaW9uID0gZnVuY3Rpb24oc2V0Qikge1xuICAgIHZhciB1bmlvbiA9IG5ldyBTZXQodGhpcyk7XG4gICAgZm9yICh2YXIgZWxlbSBvZiBzZXRCKSB7XG4gICAgICAgIHVuaW9uLmFkZChlbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuaW9uO1xufVxuXG5TZXQucHJvdG90eXBlLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgaW50ZXJzZWN0aW9uID0gbmV3IFNldCgpO1xuICAgIGZvciAodmFyIGVsZW0gb2Ygc2V0Qikge1xuICAgICAgICBpZiAodGhpcy5oYXMoZWxlbSkpIHtcbiAgICAgICAgICAgIGludGVyc2VjdGlvbi5hZGQoZWxlbSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGludGVyc2VjdGlvbjtcbn1cblxuU2V0LnByb3RvdHlwZS5kaWZmZXJlbmNlID0gZnVuY3Rpb24oc2V0Qikge1xuICAgIHZhciBkaWZmZXJlbmNlID0gbmV3IFNldCh0aGlzKTtcbiAgICBmb3IgKHZhciBlbGVtIG9mIHNldEIpIHtcbiAgICAgICAgZGlmZmVyZW5jZS5kZWxldGUoZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiBkaWZmZXJlbmNlO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBnZXRDYXJldFJhbmdlIChlbHQpIHtcbiAgICAvLyBGSVhNRTogZG9lcyBub3Qgd29yayBmb3IgSUVcbiAgICByZXR1cm4gW2VsdC5zZWxlY3Rpb25TdGFydCwgZWx0LnNlbGVjdGlvbkVuZF07XG59XG5mdW5jdGlvbiBzZXRDYXJldFJhbmdlIChlbHQsIHJhbmdlKSB7XG4gICAgLy8gRklYTUU6IGRvZXMgbm90IHdvcmsgZm9yIElFXG4gICAgZWx0LnNlbGVjdGlvblN0YXJ0ID0gcmFuZ2VbMF07XG4gICAgZWx0LnNlbGVjdGlvbkVuZCAgID0gcmFuZ2VbMV07XG59XG5mdW5jdGlvbiBzZXRDYXJldFBvc2l0aW9uIChlbHQsIHBvcykge1xuICAgIHNldENhcmV0UmFuZ2UoZWx0LCBbcG9zLHBvc10pO1xufVxuZnVuY3Rpb24gbW92ZUNhcmV0UG9zaXRpb24gKGVsdCwgZGVsdGEpIHtcbiAgICBzZXRDYXJldFBvc2l0aW9uKGVsdCwgZ2V0Q2FyZXRQb3NpdGlvbihlbHQpICsgZGVsdGEpO1xufVxuZnVuY3Rpb24gZ2V0Q2FyZXRQb3NpdGlvbiAoZWx0KSB7XG4gICAgbGV0IHIgPSBnZXRDYXJldFJhbmdlKGVsdCk7XG4gICAgcmV0dXJuIHJbMV07XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0aGUgc2NyZWVuIGNvb3JkaW5hdGVzIG9mIGFuIFNWRyBzaGFwZSAoY2lyY2xlLCByZWN0LCBwb2x5Z29uLCBsaW5lKVxuLy8gYWZ0ZXIgYWxsIHRyYW5zZm9ybXMgaGF2ZSBiZWVuIGFwcGxpZWQuXG4vL1xuLy8gQXJnczpcbi8vICAgICBzaGFwZSAobm9kZSkgVGhlIFNWRyBzaGFwZS5cbi8vXG4vLyBSZXR1cm5zOlxuLy8gICAgIFRoZSBmb3JtIG9mIHRoZSByZXR1cm5lZCB2YWx1ZSBkZXBlbmRzIG9uIHRoZSBzaGFwZS5cbi8vICAgICBjaXJjbGU6ICB7IGN4LCBjeSwgciB9XG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGNlbnRlciBwb2ludCBhbmQgdHJhbnNmb3JtZWQgcmFkaXVzICAgICAgICAgXG4vLyAgICAgbGluZTpcdHsgeDEsIHkxLCB4MiwgeTIgfVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBlbmRwb2ludHNcbi8vICAgICByZWN0Olx0eyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgY29ybmVyIHBvaW50IGFuZCB0cmFuc2Zvcm1lZCB3aWR0aCtoZWlnaHQuXG4vLyAgICAgcG9seWdvbjogWyB7eCx5fSwge3gseX0gLCAuLi4gXVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBsaXN0IG9mIHBvaW50c1xuLy9cbi8vIEFkYXB0ZWQgZnJvbTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjg1ODQ3OS9yZWN0YW5nbGUtY29vcmRpbmF0ZXMtYWZ0ZXItdHJhbnNmb3JtP3JxPTFcbi8vXG5mdW5jdGlvbiBjb29yZHNBZnRlclRyYW5zZm9ybSAoc2hhcGUpIHtcbiAgICAvL1xuICAgIGxldCBkc2hhcGUgPSBkMy5zZWxlY3Qoc2hhcGUpO1xuICAgIGxldCBzdmcgPSBzaGFwZS5jbG9zZXN0KFwic3ZnXCIpO1xuICAgIGlmICghc3ZnKSB0aHJvdyBcIkNvdWxkIG5vdCBmaW5kIHN2ZyBhbmNlc3Rvci5cIjtcbiAgICBsZXQgc3R5cGUgPSBzaGFwZS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgbGV0IG1hdHJpeCA9IHNoYXBlLmdldENUTSgpO1xuICAgIGxldCBwID0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgbGV0IHAyPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICAvL1xuICAgIHN3aXRjaCAoc3R5cGUpIHtcbiAgICAvL1xuICAgIGNhc2UgJ2NpcmNsZSc6XG5cdHAueCAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiY3hcIikpO1xuXHRwLnkgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImN5XCIpKTtcblx0cDIueCA9IHAueCArIHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJyXCIpKTtcblx0cDIueSA9IHAueTtcblx0cCAgICA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdHAyICAgPSBwMi5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0Ly8gY2FsYyBuZXcgcmFkaXVzIGFzIGRpc3RhbmNlIGJldHdlZW4gdHJhbnNmb3JtZWQgcG9pbnRzXG5cdGxldCBkeCA9IE1hdGguYWJzKHAueCAtIHAyLngpO1xuXHRsZXQgZHkgPSBNYXRoLmFicyhwLnkgLSBwMi55KTtcblx0bGV0IHIgPSBNYXRoLnNxcnQoZHgqZHggKyBkeSpkeSk7XG4gICAgICAgIHJldHVybiB7IGN4OiBwLngsIGN5OiBwLnksIHI6ciB9O1xuICAgIC8vXG4gICAgY2FzZSAncmVjdCc6XG5cdC8vIEZJWE1FOiBkb2VzIG5vdCBoYW5kbGUgcm90YXRpb25zIGNvcnJlY3RseS4gVG8gZml4LCB0cmFuc2xhdGUgY29ybmVyIHBvaW50cyBzZXBhcmF0ZWx5IGFuZCB0aGVuXG5cdC8vIGNhbGN1bGF0ZSB0aGUgdHJhbnNmb3JtZWQgd2lkdGggYW5kIGhlaWdodC4gQXMgYSBjb252ZW5pZW5jZSB0byB0aGUgdXNlciwgbWlnaHQgYmUgbmljZSB0byByZXR1cm5cblx0Ly8gdGhlIHRyYW5zZm9ybWVkIGNvcm5lciBwb2ludHMgYW5kIHBvc3NpYmx5IHRoZSBmaW5hbCBhbmdsZSBvZiByb3RhdGlvbi5cblx0cC54ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ4XCIpKTtcblx0cC55ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ5XCIpKTtcblx0cDIueCA9IHAueCArIHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ3aWR0aFwiKSk7XG5cdHAyLnkgPSBwLnkgKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiaGVpZ2h0XCIpKTtcblx0Ly9cblx0cCAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRwMiA9IHAyLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHQvL1xuICAgICAgICByZXR1cm4geyB4OiBwLngsIHk6IHAueSwgd2lkdGg6IHAyLngtcC54LCBoZWlnaHQ6IHAyLnktcC55IH07XG4gICAgLy9cbiAgICBjYXNlICdwb2x5Z29uJzpcbiAgICAgICAgbGV0IHB0cyA9IGRzaGFwZS5hdHRyKFwicG9pbnRzXCIpLnRyaW0oKS5zcGxpdCgvICsvKTtcblx0cmV0dXJuIHB0cy5tYXAoIHB0ID0+IHtcblx0ICAgIGxldCB4eSA9IHB0LnNwbGl0KFwiLFwiKTtcblx0ICAgIHAueCA9IHBhcnNlRmxvYXQoeHlbMF0pXG5cdCAgICBwLnkgPSBwYXJzZUZsb2F0KHh5WzFdKVxuXHQgICAgcCA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdCAgICByZXR1cm4geyB4OiBwLngsIHk6IHAueSB9O1xuXHR9KTtcbiAgICAvL1xuICAgIGNhc2UgJ2xpbmUnOlxuXHRwLnggICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ4MVwiKSk7XG5cdHAueSAgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInkxXCIpKTtcblx0cDIueCAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieDJcIikpO1xuXHRwMi55ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ5MlwiKSk7XG5cdHAgICAgID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0cDIgICAgPSBwMi5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcbiAgICAgICAgcmV0dXJuIHsgeDE6IHAueCwgeTE6IHAueSwgeDI6IHAyLngsIHgyOiBwMi55IH07XG4gICAgLy9cbiAgICAvLyBGSVhNRTogYWRkIGNhc2UgJ3RleHQnXG4gICAgLy9cblxuICAgIGRlZmF1bHQ6XG5cdHRocm93IFwiVW5zdXBwb3J0ZWQgbm9kZSB0eXBlOiBcIiArIHN0eXBlO1xuICAgIH1cblxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJlbW92ZXMgZHVwbGljYXRlcyBmcm9tIGEgbGlzdCB3aGlsZSBwcmVzZXJ2aW5nIGxpc3Qgb3JkZXIuXG4vLyBBcmdzOlxuLy8gICAgIGxzdCAobGlzdClcbi8vIFJldHVybnM6XG4vLyAgICAgQSBwcm9jZXNzZWQgY29weSBvZiBsc3QgaW4gd2hpY2ggYW55IGR1cHMgaGF2ZSBiZWVuIHJlbW92ZWQuXG5mdW5jdGlvbiByZW1vdmVEdXBzIChsc3QpIHtcbiAgICBsZXQgbHN0MiA9IFtdO1xuICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuICAgIGxzdC5mb3JFYWNoKHggPT4ge1xuXHQvLyByZW1vdmUgZHVwcyB3aGlsZSBwcmVzZXJ2aW5nIG9yZGVyXG5cdGlmIChzZWVuLmhhcyh4KSkgcmV0dXJuO1xuXHRsc3QyLnB1c2goeCk7XG5cdHNlZW4uYWRkKHgpO1xuICAgIH0pO1xuICAgIHJldHVybiBsc3QyO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENsaXBzIGEgdmFsdWUgdG8gYSByYW5nZS5cbmZ1bmN0aW9uIGNsaXAgKG4sIG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCBuKSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQge1xuICAgIGluaXRPcHRMaXN0LFxuICAgIGQzdHN2LFxuICAgIGQzanNvbixcbiAgICBkZWVwYyxcbiAgICBwYXJzZUNvb3JkcyxcbiAgICBmb3JtYXRDb29yZHMsXG4gICAgb3ZlcmxhcHMsXG4gICAgc3VidHJhY3QsXG4gICAgb2JqMmxpc3QsXG4gICAgc2FtZSxcbiAgICBnZXRDYXJldFJhbmdlLFxuICAgIHNldENhcmV0UmFuZ2UsXG4gICAgc2V0Q2FyZXRQb3NpdGlvbixcbiAgICBtb3ZlQ2FyZXRQb3NpdGlvbixcbiAgICBnZXRDYXJldFBvc2l0aW9uLFxuICAgIGNvb3Jkc0FmdGVyVHJhbnNmb3JtLFxuICAgIHJlbW92ZUR1cHMsXG4gICAgY2xpcFxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgQ29tcG9uZW50IHtcbiAgICAvLyBhcHAgLSB0aGUgb3duaW5nIGFwcCBvYmplY3RcbiAgICAvLyBlbHQgbWF5IGJlIGEgc3RyaW5nIChzZWxlY3RvciksIGEgRE9NIG5vZGUsIG9yIGEgZDMgc2VsZWN0aW9uIG9mIDEgbm9kZS5cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcblx0dGhpcy5hcHAgPSBhcHBcblx0aWYgKHR5cGVvZihlbHQpID09PSBcInN0cmluZ1wiKVxuXHQgICAgLy8gZWx0IGlzIGEgQ1NTIHNlbGVjdG9yXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5zZWxlY3RBbGwpID09PSBcImZ1bmN0aW9uXCIpXG5cdCAgICAvLyBlbHQgaXMgYSBkMyBzZWxlY3Rpb25cblx0ICAgIHRoaXMucm9vdCA9IGVsdDtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSkgPT09IFwiZnVuY3Rpb25cIilcblx0ICAgIC8vIGVsdCBpcyBhIERPTSBub2RlXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRlIG1lXG4gICAgfVxufVxuXG5leHBvcnQgeyBDb21wb25lbnQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0NvbXBvbmVudC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBGZWF0dXJlIHtcbiAgICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG4gICAgICAgIHRoaXMuY2hyICAgICA9IGNmZy5jaHIgfHwgY2ZnLmNocm9tb3NvbWU7XG4gICAgICAgIHRoaXMuc3RhcnQgICA9IGNmZy5zdGFydDtcbiAgICAgICAgdGhpcy5lbmQgICAgID0gY2ZnLmVuZDtcbiAgICAgICAgdGhpcy5zdHJhbmQgID0gY2ZnLnN0cmFuZDtcbiAgICAgICAgdGhpcy50eXBlICAgID0gY2ZnLnR5cGU7XG4gICAgICAgIHRoaXMuYmlvdHlwZSA9IGNmZy5iaW90eXBlO1xuICAgICAgICB0aGlzLm1ncGlkICAgPSBjZmcubWdwaWQgfHwgY2ZnLmlkO1xuICAgICAgICB0aGlzLm1naWlkICAgPSBjZmcubWdpaWQ7XG4gICAgICAgIHRoaXMuc3ltYm9sICA9IGNmZy5zeW1ib2w7XG4gICAgICAgIHRoaXMuZ2Vub21lICA9IGNmZy5nZW5vbWU7XG5cdHRoaXMuY29udGlnICA9IHBhcnNlSW50KGNmZy5jb250aWcpO1xuXHR0aGlzLmxhbmUgICAgPSBwYXJzZUludChjZmcubGFuZSk7XG4gICAgICAgIGlmICh0aGlzLm1naWlkID09PSBcIi5cIikgdGhpcy5tZ2lpZCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLnN5bWJvbCA9PT0gXCIuXCIpIHRoaXMuc3ltYm9sID0gbnVsbDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IElEICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdwaWQ7XG4gICAgfVxuICAgIGdldCBjYW5vbmljYWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZ2lpZDtcbiAgICB9XG4gICAgZ2V0IGlkICgpIHtcblx0Ly8gRklYTUU6IHJlbW92ZSB0aGlzIG1ldGhvZFxuICAgICAgICByZXR1cm4gdGhpcy5tZ2lpZCB8fCB0aGlzLm1ncGlkO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgbGFiZWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2wgfHwgdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGxlbmd0aCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuZCAtIHRoaXMuc3RhcnQgKyAxO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRNdW5nZWRUeXBlICgpIHtcblx0cmV0dXJuIHRoaXMudHlwZSA9PT0gXCJnZW5lXCIgP1xuXHQgICAgKHRoaXMuYmlvdHlwZSA9PT0gXCJwcm90ZWluX2NvZGluZ1wiIHx8IHRoaXMuYmlvdHlwZSA9PT0gXCJwcm90ZWluIGNvZGluZyBnZW5lXCIpID9cblx0XHRcInByb3RlaW5fY29kaW5nX2dlbmVcIlxuXHRcdDpcblx0XHR0aGlzLmJpb3R5cGUuaW5kZXhPZihcInBzZXVkb2dlbmVcIikgPj0gMCA/XG5cdFx0ICAgIFwicHNldWRvZ2VuZVwiXG5cdFx0ICAgIDpcblx0XHQgICAgKHRoaXMuYmlvdHlwZS5pbmRleE9mKFwiUk5BXCIpID49IDAgfHwgdGhpcy5iaW90eXBlLmluZGV4T2YoXCJhbnRpc2Vuc2VcIikgPj0gMCkgP1xuXHRcdFx0XCJuY1JOQV9nZW5lXCJcblx0XHRcdDpcblx0XHRcdHRoaXMuYmlvdHlwZS5pbmRleE9mKFwic2VnbWVudFwiKSA+PSAwID9cblx0XHRcdCAgICBcImdlbmVfc2VnbWVudFwiXG5cdFx0XHQgICAgOlxuXHRcdFx0ICAgIFwib3RoZXJfZ2VuZVwiXG5cdCAgICA6XG5cdCAgICB0aGlzLnR5cGUgPT09IFwicHNldWRvZ2VuZVwiID9cblx0XHRcInBzZXVkb2dlbmVcIlxuXHRcdDpcblx0XHR0aGlzLnR5cGUuaW5kZXhPZihcImdlbmVfc2VnbWVudFwiKSA+PSAwID9cblx0XHQgICAgXCJnZW5lX3NlZ21lbnRcIlxuXHRcdCAgICA6XG5cdFx0ICAgIHRoaXMudHlwZS5pbmRleE9mKFwiUk5BXCIpID49IDAgP1xuXHRcdFx0XCJuY1JOQV9nZW5lXCJcblx0XHRcdDpcblx0XHRcdHRoaXMudHlwZS5pbmRleE9mKFwiZ2VuZVwiKSA+PSAwID9cblx0XHRcdCAgICBcIm90aGVyX2dlbmVcIlxuXHRcdFx0ICAgIDpcblx0XHRcdCAgICBcIm90aGVyX2ZlYXR1cmVfdHlwZVwiO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgRmVhdHVyZSB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmVhdHVyZS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBQUkVGSVg9XCJhcHBzLm1ndi5cIjtcbiBcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW50ZXJhY3RzIHdpdGggbG9jYWxTdG9yYWdlLlxuLy9cbmNsYXNzIFN0b3JhZ2VNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSwgc3RvcmFnZSkge1xuXHR0aGlzLm5hbWUgPSBQUkVGSVgrbmFtZTtcblx0dGhpcy5zdG9yYWdlID0gc3RvcmFnZTtcblx0dGhpcy5teURhdGFPYmogPSBudWxsO1xuXHQvL1xuXHR0aGlzLl9sb2FkKCk7XG4gICAgfVxuICAgIF9sb2FkICgpIHtcblx0Ly8gbG9hZHMgbXlEYXRhT2JqIGZyb20gc3RvcmFnZVxuICAgICAgICBsZXQgcyA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZSk7XG5cdHRoaXMubXlEYXRhT2JqID0gcyA/IEpTT04ucGFyc2UocykgOiB7fTtcbiAgICB9XG4gICAgX3NhdmUgKCkge1xuXHQvLyB3cml0ZXMgbXlEYXRhT2JqIHRvIHN0b3JhZ2VcbiAgICAgICAgbGV0IHMgPSBKU09OLnN0cmluZ2lmeSh0aGlzLm15RGF0YU9iaik7XG5cdHRoaXMuc3RvcmFnZS5zZXRJdGVtKHRoaXMubmFtZSwgcylcbiAgICB9XG4gICAgZ2V0IChuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm15RGF0YU9ialtuXTtcbiAgICB9XG4gICAgcHV0IChuLCB2KSB7XG4gICAgICAgIHRoaXMubXlEYXRhT2JqW25dID0gdjtcblx0dGhpcy5fc2F2ZSgpO1xuICAgIH1cbn1cbi8vXG5jbGFzcyBTZXNzaW9uU3RvcmFnZU1hbmFnZXIgZXh0ZW5kcyBTdG9yYWdlTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUpIHtcbiAgICAgICAgc3VwZXIobmFtZSwgd2luZG93LnNlc3Npb25TdG9yYWdlKTtcbiAgICB9XG59XG4vL1xuY2xhc3MgTG9jYWxTdG9yYWdlTWFuYWdlciBleHRlbmRzIFN0b3JhZ2VNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSkge1xuICAgICAgICBzdXBlcihuYW1lLCB3aW5kb3cubG9jYWxTdG9yYWdlKTtcbiAgICB9XG59XG4vL1xuZXhwb3J0IHsgU2Vzc2lvblN0b3JhZ2VNYW5hZ2VyLCBMb2NhbFN0b3JhZ2VNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9TdG9yYWdlTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBhcnNlcyBhIGxpc3Qgb3BlcmF0b3IgZXhwcmVzc2lvbiwgZWcgXCIoYSArIGIpKmMgLSBkXCJcbi8vIFJldHVybnMgYW4gYWJzdHJhY3Qgc3ludGF4IHRyZWUuXG4vLyAgICAgTGVhZiBub2RlcyA9IGxpc3QgbmFtZXMuIFRoZXkgYXJlIHNpbXBsZSBzdHJpbmdzLlxuLy8gICAgIEludGVyaW9yIG5vZGVzID0gb3BlcmF0aW9ucy4gVGhleSBsb29rIGxpa2U6IHtsZWZ0Om5vZGUsIG9wOnN0cmluZywgcmlnaHQ6bm9kZX1cbi8vIFxuY2xhc3MgTGlzdEZvcm11bGFQYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcblx0dGhpcy5yX29wICAgID0gL1srLV0vO1xuXHR0aGlzLnJfb3AyICAgPSAvWypdLztcblx0dGhpcy5yX29wcyAgID0gL1soKSsqLV0vO1xuXHR0aGlzLnJfaWRlbnQgPSAvW2EtekEtWl9dW2EtekEtWjAtOV9dKi87XG5cdHRoaXMucl9xc3RyICA9IC9cIlteXCJdKlwiLztcblx0dGhpcy5yZSA9IG5ldyBSZWdFeHAoYCgke3RoaXMucl9vcHMuc291cmNlfXwke3RoaXMucl9xc3RyLnNvdXJjZX18JHt0aGlzLnJfaWRlbnQuc291cmNlfSlgLCAnZycpO1xuXHQvL3RoaXMucmUgPSAvKFsoKSsqLV18XCJbXlwiXStcInxbYS16QS1aX11bYS16QS1aMC05X10qKS9nXG5cdHRoaXMuX2luaXQoXCJcIik7XG4gICAgfVxuICAgIF9pbml0IChzKSB7XG4gICAgICAgIHRoaXMuZXhwciA9IHM7XG5cdHRoaXMudG9rZW5zID0gdGhpcy5leHByLm1hdGNoKHRoaXMucmUpIHx8IFtdO1xuXHR0aGlzLmkgPSAwO1xuICAgIH1cbiAgICBfcGVla1Rva2VuKCkge1xuXHRyZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5pXTtcbiAgICB9XG4gICAgX25leHRUb2tlbiAoKSB7XG5cdGxldCB0O1xuICAgICAgICBpZiAodGhpcy5pIDwgdGhpcy50b2tlbnMubGVuZ3RoKSB7XG5cdCAgICB0ID0gdGhpcy50b2tlbnNbdGhpcy5pXTtcblx0ICAgIHRoaXMuaSArPSAxO1xuXHR9XG5cdHJldHVybiB0O1xuICAgIH1cbiAgICBfZXhwciAoKSB7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fdGVybSgpO1xuXHRsZXQgb3AgPSB0aGlzLl9wZWVrVG9rZW4oKTtcblx0aWYgKG9wID09PSBcIitcIiB8fCBvcCA9PT0gXCItXCIpIHtcblx0ICAgIHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgbm9kZSA9IHsgbGVmdDpub2RlLCBvcDpvcD09PVwiK1wiP1widW5pb25cIjpcImRpZmZlcmVuY2VcIiwgcmlnaHQ6IHRoaXMuX2V4cHIoKSB9XG5cdCAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfSAgICAgICAgICAgICAgIFxuXHRlbHNlIGlmIChvcCA9PT0gXCIpXCIgfHwgb3AgPT09IHVuZGVmaW5lZCB8fCBvcCA9PT0gbnVsbClcblx0ICAgIHJldHVybiBub2RlO1xuXHRlbHNlXG5cdCAgICB0aGlzLl9lcnJvcihcIlVOSU9OIG9yIElOVEVSU0VDVElPTiBvciApIG9yIE5VTExcIiwgb3ApO1xuICAgIH1cbiAgICBfdGVybSAoKSB7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fZmFjdG9yKCk7XG5cdGxldCBvcCA9IHRoaXMuX3BlZWtUb2tlbigpO1xuXHRpZiAob3AgPT09IFwiKlwiKSB7XG5cdCAgICB0aGlzLl9uZXh0VG9rZW4oKTtcblx0ICAgIG5vZGUgPSB7IGxlZnQ6bm9kZSwgb3A6XCJpbnRlcnNlY3Rpb25cIiwgcmlnaHQ6IHRoaXMuX2ZhY3RvcigpIH1cblx0fVxuXHRyZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgX2ZhY3RvciAoKSB7XG4gICAgICAgIGxldCB0ID0gdGhpcy5fbmV4dFRva2VuKCk7XG5cdGlmICh0ID09PSBcIihcIil7XG5cdCAgICBsZXQgbm9kZSA9IHRoaXMuX2V4cHIoKTtcblx0ICAgIGxldCBudCA9IHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgaWYgKG50ICE9PSBcIilcIikgdGhpcy5fZXJyb3IoXCInKSdcIiwgbnQpO1xuXHQgICAgcmV0dXJuIG5vZGU7XG5cdH1cblx0ZWxzZSBpZiAodCAmJiAodC5zdGFydHNXaXRoKCdcIicpKSkge1xuXHQgICAgcmV0dXJuIHQuc3Vic3RyaW5nKDEsIHQubGVuZ3RoLTEpO1xuXHR9XG5cdGVsc2UgaWYgKHQgJiYgdC5tYXRjaCgvW2EtekEtWl9dLykpIHtcblx0ICAgIHJldHVybiB0O1xuXHR9XG5cdGVsc2Vcblx0ICAgIHRoaXMuX2Vycm9yKFwiRVhQUiBvciBJREVOVFwiLCB0fHxcIk5VTExcIik7XG5cdHJldHVybiB0O1xuXHQgICAgXG4gICAgfVxuICAgIF9lcnJvciAoZXhwZWN0ZWQsIHNhdykge1xuICAgICAgICB0aHJvdyBgUGFyc2UgZXJyb3I6IGV4cGVjdGVkICR7ZXhwZWN0ZWR9IGJ1dCBzYXcgJHtzYXd9LmA7XG4gICAgfVxuICAgIC8vIFBhcnNlcyB0aGUgc3RyaW5nIGFuZCByZXR1cm5zIHRoZSBhYnN0cmFjdCBzeW50YXggdHJlZS5cbiAgICAvLyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIHRoZXJlIGlzIGEgc3ludGF4IGVycm9yLlxuICAgIHBhcnNlIChzKSB7XG5cdHRoaXMuX2luaXQocyk7XG5cdHJldHVybiB0aGlzLl9leHByKCk7XG4gICAgfVxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZmYgc3RyaW5nIGlzIHN5bnRhY3RpY2FsbHkgdmFsaWRcbiAgICBpc1ZhbGlkIChzKSB7XG4gICAgICAgIHRyeSB7XG5cdCAgICB0aGlzLnBhcnNlKHMpO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdH1cblx0Y2F0Y2ggKGUpIHtcblx0ICAgIHJldHVybiBmYWxzZTtcblx0fVxuICAgIH1cbn1cblxuZXhwb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0xpc3RGb3JtdWxhUGFyc2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IE1HVkFwcCB9IGZyb20gJy4vTUdWQXBwJztcbmltcG9ydCB7IHJlbW92ZUR1cHMgfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vXG4vLyBwcXN0cmluZyA9IFBhcnNlIHFzdHJpbmcuIFBhcnNlcyB0aGUgcGFyYW1ldGVyIHBvcnRpb24gb2YgdGhlIFVSTC5cbi8vXG5mdW5jdGlvbiBwcXN0cmluZyAocXN0cmluZykge1xuICAgIC8vXG4gICAgbGV0IGNmZyA9IHt9O1xuXG4gICAgLy8gRklYTUU6IFVSTFNlYXJjaFBhcmFtcyBBUEkgaXMgbm90IHN1cHBvcnRlZCBpbiBhbGwgYnJvd3NlcnMuXG4gICAgLy8gT0sgZm9yIGRldmVsb3BtZW50IGJ1dCBuZWVkIGEgZmFsbGJhY2sgZXZlbnR1YWxseS5cbiAgICBsZXQgcHJtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocXN0cmluZyk7XG4gICAgbGV0IGdlbm9tZXMgPSBbXTtcblxuICAgIC8vIC0tLS0tIGdlbm9tZXMgLS0tLS0tLS0tLS0tXG4gICAgbGV0IHBnZW5vbWVzID0gcHJtcy5nZXQoXCJnZW5vbWVzXCIpIHx8IFwiXCI7XG4gICAgLy8gRm9yIG5vdywgYWxsb3cgXCJjb21wc1wiIGFzIHN5bm9ueW0gZm9yIFwiZ2Vub21lc1wiLiBFdmVudHVhbGx5LCBkb24ndCBzdXBwb3J0IFwiY29tcHNcIi5cbiAgICBwZ2Vub21lcyA9IChwZ2Vub21lcyArICBcIiBcIiArIChwcm1zLmdldChcImNvbXBzXCIpIHx8IFwiXCIpKTtcbiAgICAvL1xuICAgIHBnZW5vbWVzID0gcmVtb3ZlRHVwcyhwZ2Vub21lcy50cmltKCkuc3BsaXQoLyArLykpO1xuICAgIHBnZW5vbWVzLmxlbmd0aCA+IDAgJiYgKGNmZy5nZW5vbWVzID0gcGdlbm9tZXMpO1xuXG4gICAgLy8gLS0tLS0gcmVmIGdlbm9tZSAtLS0tLS0tLS0tLS1cbiAgICBsZXQgcmVmID0gcHJtcy5nZXQoXCJyZWZcIik7XG4gICAgcmVmICYmIChjZmcucmVmID0gcmVmKTtcblxuICAgIC8vIC0tLS0tIGhpZ2hsaWdodCBJRHMgLS0tLS0tLS0tLS0tLS1cbiAgICBsZXQgaGxzID0gbmV3IFNldCgpO1xuICAgIGxldCBobHMwID0gcHJtcy5nZXQoXCJoaWdobGlnaHRcIik7XG4gICAgaWYgKGhsczApIHtcblx0aGxzMCA9IGhsczAucmVwbGFjZSgvWyAsXSsvZywgJyAnKS5zcGxpdCgnICcpLmZpbHRlcih4PT54KTtcblx0aGxzMC5sZW5ndGggPiAwICYmIChjZmcuaGlnaGxpZ2h0ID0gaGxzMCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0gY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIGxldCBjaHIgICA9IHBybXMuZ2V0KFwiY2hyXCIpO1xuICAgIGxldCBzdGFydCA9IHBybXMuZ2V0KFwic3RhcnRcIik7XG4gICAgbGV0IGVuZCAgID0gcHJtcy5nZXQoXCJlbmRcIik7XG4gICAgY2hyICAgJiYgKGNmZy5jaHIgPSBjaHIpO1xuICAgIHN0YXJ0ICYmIChjZmcuc3RhcnQgPSBwYXJzZUludChzdGFydCkpO1xuICAgIGVuZCAgICYmIChjZmcuZW5kID0gcGFyc2VJbnQoZW5kKSk7XG4gICAgLy9cbiAgICBsZXQgbGFuZG1hcmsgPSBwcm1zLmdldChcImxhbmRtYXJrXCIpO1xuICAgIGxldCBmbGFuayAgICA9IHBybXMuZ2V0KFwiZmxhbmtcIik7XG4gICAgbGV0IGxlbmd0aCAgID0gcHJtcy5nZXQoXCJsZW5ndGhcIik7XG4gICAgbGV0IGRlbHRhICAgID0gcHJtcy5nZXQoXCJkZWx0YVwiKTtcbiAgICBsYW5kbWFyayAmJiAoY2ZnLmxhbmRtYXJrID0gbGFuZG1hcmspO1xuICAgIGZsYW5rICAgICYmIChjZmcuZmxhbmsgPSBwYXJzZUludChmbGFuaykpO1xuICAgIGxlbmd0aCAgICYmIChjZmcubGVuZ3RoID0gcGFyc2VJbnQobGVuZ3RoKSk7XG4gICAgZGVsdGEgICAgJiYgKGNmZy5kZWx0YSA9IHBhcnNlSW50KGRlbHRhKSk7XG4gICAgLy9cbiAgICAvLyAtLS0tLSBkcmF3aW5nIG1vZGUgLS0tLS0tLS0tLS0tLVxuICAgIGxldCBkbW9kZSA9IHBybXMuZ2V0KFwiZG1vZGVcIik7XG4gICAgZG1vZGUgJiYgKGNmZy5kbW9kZSA9IGRtb2RlKTtcbiAgICAvL1xuICAgIHJldHVybiBjZmc7XG59XG5cblxuLy8gVGhlIG1haW4gcHJvZ3JhbSwgd2hlcmVpbiB0aGUgYXBwIGlzIGNyZWF0ZWQgYW5kIHdpcmVkIHRvIHRoZSBicm93c2VyLiBcbi8vXG5mdW5jdGlvbiBfX21haW5fXyAoc2VsZWN0b3IpIHtcbiAgICAvLyBCZWhvbGQsIHRoZSBNR1YgYXBwbGljYXRpb24gb2JqZWN0Li4uXG4gICAgbGV0IG1ndiA9IG51bGw7XG5cbiAgICAvLyBDYWxsYmFjayB0byBwYXNzIGludG8gdGhlIGFwcCB0byByZWdpc3RlciBjaGFuZ2VzIGluIGNvbnRleHQuXG4gICAgLy8gVXNlcyB0aGUgY3VycmVudCBhcHAgY29udGV4dCB0byBzZXQgdGhlIGhhc2ggcGFydCBvZiB0aGVcbiAgICAvLyBicm93c2VyJ3MgbG9jYXRpb24uIFRoaXMgYWxzbyByZWdpc3RlcnMgdGhlIGNoYW5nZSBpbiBcbiAgICAvLyB0aGUgYnJvd3NlciBoaXN0b3J5LlxuICAgIGZ1bmN0aW9uIHNldEhhc2ggKCkge1xuXHRsZXQgbmV3SGFzaCA9IG1ndi5nZXRQYXJhbVN0cmluZygpO1xuXHRpZiAoJyMnK25ld0hhc2ggPT09IHdpbmRvdy5sb2NhdGlvbi5oYXNoKVxuXHQgICAgcmV0dXJuO1xuXHQvLyB0ZW1wb3JhcmlseSBkaXNhYmxlIHBvcHN0YXRlIGhhbmRsZXJcblx0bGV0IGYgPSB3aW5kb3cub25wb3BzdGF0ZTtcblx0d2luZG93Lm9ucG9wc3RhdGUgPSBudWxsO1xuXHQvLyBub3cgc2V0IHRoZSBoYXNoXG5cdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gbmV3SGFzaDtcblx0Ly8gcmUtZW5hYmxlXG5cdHdpbmRvdy5vbnBvcHN0YXRlID0gZjtcbiAgICB9XG4gICAgLy8gSGFuZGxlciBjYWxsZWQgd2hlbiB1c2VyIGNsaWNrcyB0aGUgYnJvd3NlcidzIGJhY2sgb3IgZm9yd2FyZCBidXR0b25zLlxuICAgIC8vIFNldHMgdGhlIGFwcCdzIGNvbnRleHQgYmFzZWQgb24gdGhlIGhhc2ggcGFydCBvZiB0aGUgYnJvd3NlcidzXG4gICAgLy8gbG9jYXRpb24uXG4gICAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbihldmVudCkge1xuXHRsZXQgY2ZnID0gcHFzdHJpbmcoZG9jdW1lbnQubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuXHRtZ3Yuc2V0Q29udGV4dChjZmcsIHRydWUpO1xuICAgIH07XG4gICAgLy8gZ2V0IGluaXRpYWwgc2V0IG9mIGNvbnRleHQgcGFyYW1zIFxuICAgIGxldCBxc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpO1xuICAgIGxldCBjZmcgPSBwcXN0cmluZyhxc3RyaW5nKTtcbiAgICBjZmcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjZmcub25jb250ZXh0Y2hhbmdlID0gc2V0SGFzaDtcblxuICAgIC8vIGNyZWF0ZSB0aGUgYXBwXG4gICAgd2luZG93Lm1ndiA9IG1ndiA9IG5ldyBNR1ZBcHAoc2VsZWN0b3IsIGNmZyk7XG4gICAgXG4gICAgLy8gaGFuZGxlIHJlc2l6ZSBldmVudHNcbiAgICB3aW5kb3cub25yZXNpemUgPSAoKSA9PiB7bWd2LnJlc2l6ZSgpO21ndi5zZXRDb250ZXh0KHt9KTt9XG59XG5cblxuX19tYWluX18oXCIjbWd2XCIpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvdmlld2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHBhcnNlQ29vcmRzLCBmb3JtYXRDb29yZHMsIGQzdHN2LCBpbml0T3B0TGlzdCwgc2FtZSwgY2xpcCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgR2Vub21lIH0gICAgICAgICAgZnJvbSAnLi9HZW5vbWUnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gICAgICAgZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgRmVhdHVyZU1hbmFnZXIgfSAgZnJvbSAnLi9GZWF0dXJlTWFuYWdlcic7XG5pbXBvcnQgeyBRdWVyeU1hbmFnZXIgfSAgICBmcm9tICcuL1F1ZXJ5TWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0TWFuYWdlciB9ICAgICBmcm9tICcuL0xpc3RNYW5hZ2VyJztcbmltcG9ydCB7IExpc3RFZGl0b3IgfSAgICAgIGZyb20gJy4vTGlzdEVkaXRvcic7XG5pbXBvcnQgeyBVc2VyUHJlZnNNYW5hZ2VyIH0gZnJvbSAnLi9Vc2VyUHJlZnNNYW5hZ2VyJztcbmltcG9ydCB7IEZhY2V0TWFuYWdlciB9ICAgIGZyb20gJy4vRmFjZXRNYW5hZ2VyJztcbmltcG9ydCB7IEJUTWFuYWdlciB9ICAgICAgIGZyb20gJy4vQlRNYW5hZ2VyJztcbmltcG9ydCB7IEdlbm9tZVZpZXcgfSAgICAgIGZyb20gJy4vR2Vub21lVmlldyc7XG5pbXBvcnQgeyBGZWF0dXJlRGV0YWlscyB9ICBmcm9tICcuL0ZlYXR1cmVEZXRhaWxzJztcbmltcG9ydCB7IFpvb21WaWV3IH0gICAgICAgIGZyb20gJy4vWm9vbVZpZXcnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIE1HVkFwcCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHNlbGVjdG9yLCBjZmcpIHtcblx0c3VwZXIobnVsbCwgc2VsZWN0b3IpO1xuXHR0aGlzLmFwcCA9IHRoaXM7XG5cdC8vXG5cdHRoaXMuaW5pdGlhbENmZyA9IGNmZztcblx0Ly9cblx0dGhpcy5jb250ZXh0Q2hhbmdlZCA9IChjZmcub25jb250ZXh0Y2hhbmdlIHx8IGZ1bmN0aW9uKCl7fSk7XG5cdC8vXG5cdHRoaXMubmFtZTJnZW5vbWUgPSB7fTsgIC8vIG1hcCBmcm9tIGdlbm9tZSBuYW1lIC0+IGdlbm9tZSBkYXRhIG9ialxuXHR0aGlzLmxhYmVsMmdlbm9tZSA9IHt9OyAvLyBtYXAgZnJvbSBnZW5vbWUgbGFiZWwgLT4gZ2Vub21lIGRhdGEgb2JqXG5cdHRoaXMubmwyZ2Vub21lID0ge307ICAgIC8vIGNvbWJpbmVzIGluZGV4ZXNcblx0Ly9cblx0dGhpcy5hbGxHZW5vbWVzID0gW107ICAgLy8gbGlzdCBvZiBhbGwgYXZhaWxhYmxlIGdlbm9tZXNcblx0dGhpcy5yR2Vub21lID0gbnVsbDsgICAgLy8gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZVxuXHR0aGlzLmNHZW5vbWVzID0gW107ICAgICAvLyBjdXJyZW50IGNvbXBhcmlzb24gZ2Vub21lcyAockdlbm9tZSBpcyAqbm90KiBpbmNsdWRlZCkuXG5cdHRoaXMudkdlbm9tZXMgPSBbXTtcdC8vIGxpc3Qgb2YgYWxsIGN1cnJlbnR5IHZpZXdlZCBnZW5vbWVzIChyZWYrY29tcHMpIGluIFktb3JkZXIuXG5cdC8vXG5cdHRoaXMuZHVyID0gMjUwOyAgICAgICAgIC8vIGFuaW1hdGlvbiBkdXJhdGlvbiwgaW4gbXNcblx0dGhpcy5kZWZhdWx0Wm9vbSA9IDI7XHQvLyBtdWx0aXBsaWVyIG9mIGN1cnJlbnQgcmFuZ2Ugd2lkdGguIE11c3QgYmUgPj0gMS4gMSA9PSBubyB6b29tLlxuXHRcdFx0XHQvLyAoem9vbWluZyBpbiB1c2VzIDEvdGhpcyBhbW91bnQpXG5cdHRoaXMuZGVmYXVsdFBhbiAgPSAwLjE1Oy8vIGZyYWN0aW9uIG9mIGN1cnJlbnQgcmFuZ2Ugd2lkdGhcblxuXHQvLyBDb29yZGluYXRlcyBtYXkgYmUgc3BlY2lmaWVkIGluIG9uZSBvZiB0d28gd2F5czogbWFwcGVkIG9yIGxhbmRtYXJrLiBcblx0Ly8gTWFwcGVkIGNvb3JkaW5hdGVzIGFyZSBzcGVjaWZpZWQgYXMgY2hyb21vc29tZStzdGFydCtlbmQuIFRoaXMgY29vcmRpbmF0ZSByYW5nZSBpcyBkZWZpbmVkIHJlbGF0aXZlIHRvIFxuXHQvLyB0aGUgY3VycmVudCByZWZlcmVuY2UgZ2Vub21lLCBhbmQgaXMgbWFwcGVkIHRvIHRoZSBjb3JyZXNwb25kaW5nIHJhbmdlKHMpIGluIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUuXG5cdC8vIExhbmRtYXJrIGNvb3JkaW5hdGVzIGFyZSBzcGVjaWZpZWQgYXMgbGFuZG1hcmsrW2ZsYW5rfHdpZHRoXStkZWx0YS4gVGhlIGxhbmRtYXJrIGlzIGxvb2tlZCB1cCBpbiBlYWNoIFxuXHQvLyBnZW5vbWUuIEl0cyBjb29yZGluYXRlcywgY29tYmluZWQgd2l0aCBmbGFua3xsZW5ndGggYW5kIGRlbHRhLCBkZXRlcm1pbmUgdGhlIGFic29sdXRlIGNvb3JkaW5hdGUgcmFuZ2Vcblx0Ly8gaW4gdGhhdCBnZW5vbWUuIElmIHRoZSBsYW5kbWFyayBkb2VzIG5vdCBleGlzdCBpbiBhIGdpdmVuIGdlbm9tZSwgdGhlbiBtYXBwZWQgY29vcmRpbmF0ZSBhcmUgdXNlZC5cblx0Ly8gXG5cdHRoaXMuY21vZGUgPSAnbWFwcGVkJyAvLyAnbWFwcGVkJyBvciAnbGFuZG1hcmsnXG5cdHRoaXMuY29vcmRzID0geyBjaHI6ICcxJywgc3RhcnQ6IDEwMDAwMDAsIGVuZDogMTAwMDAwMDAgfTsgIC8vIG1hcHBlZFxuXHR0aGlzLmxjb29yZHMgPSB7IGxhbmRtYXJrOiAnUGF4NicsIGZsYW5rOiA1MDAwMDAsIGRlbHRhOjAgfTsvLyBsYW5kbWFya1xuXG5cdC8vXG5cdC8vIFRPRE86IHJlZmFjdG9yIHBhZ2Vib3gsIGRyYWdnYWJsZSwgYW5kIGZyaWVuZHMgaW50byBhIGZyYW1ld29yayBtb2R1bGUsXG5cdC8vIFxuXHR0aGlzLnBiRHJhZ2dlciA9IHRoaXMuZ2V0Q29udGVudERyYWdnZXIoKTtcblx0ZDMuc2VsZWN0QWxsKCcucGFnZWJveCcpXG5cdCAgICAuY2FsbCh0aGlzLnBiRHJhZ2dlcilcblx0ICAgIC5hcHBlbmQoJ2knKVxuXHQgICAgLmF0dHIoJ2NsYXNzJywnbWF0ZXJpYWwtaWNvbnMgYnVzeSByb3RhdGluZycpXG5cdCAgICA7XG5cdGQzLnNlbGVjdEFsbCgnLmNsb3NhYmxlJylcblx0ICAgIC5hcHBlbmQoJ2knKVxuXHRcdC5hdHRyKCdjbGFzcycsJ21hdGVyaWFsLWljb25zIGJ1dHRvbiBjbG9zZScpXG5cdFx0LmF0dHIoJ3RpdGxlJywnQ2xpY2sgdG8gb3Blbi9jbG9zZS4nKVxuXHRcdC5vbignY2xpY2suZGVmYXVsdCcsIGZ1bmN0aW9uICgpIHtcblx0XHQgICAgbGV0IHAgPSBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlKTtcblx0XHQgICAgcC5jbGFzc2VkKCdjbG9zZWQnLCAhIHAuY2xhc3NlZCgnY2xvc2VkJykpO1xuXHRcdCAgICBkMy5zZWxlY3QodGhpcykuYXR0cigndGl0bGUnLCdDbGljayB0byAnICsgIChwLmNsYXNzZWQoJ2Nsb3NlZCcpID8gJ29wZW4nIDogJ2Nsb3NlJykgKyAnLicpXG5cdFx0ICAgIHNlbGYuc2V0UHJlZnNGcm9tVUkoKTtcblx0XHR9KTtcblx0ZDMuc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUgPiAqJylcblx0ICAgIC5hcHBlbmQoJ2knKVxuXHRcdC5hdHRyKCd0aXRsZScsJ0RyYWcgdXAvZG93biB0byByZXBvc2l0aW9uLicpXG5cdFx0LmF0dHIoJ2NsYXNzJywnbWF0ZXJpYWwtaWNvbnMgYnV0dG9uIGRyYWdoYW5kbGUnKTtcblxuXHQvLyBcbiAgICAgICAgZDMuc2VsZWN0KCcjc3RhdHVzTWVzc2FnZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4geyB0aGlzLnNob3dTdGF0dXMoZmFsc2UpOyB9KTtcblx0XG5cdC8vXG5cdC8vXG5cdHRoaXMuZ2Vub21lVmlldyA9IG5ldyBHZW5vbWVWaWV3KHRoaXMsICcjZ2Vub21lVmlldycsIDgwMCwgMjUwKTtcblx0dGhpcy56b29tVmlldyAgID0gbmV3IFpvb21WaWV3ICAodGhpcywgJyN6b29tVmlldycsIDgwMCwgMjUwLCB0aGlzLmNvb3Jkcyk7XG5cdHRoaXMucmVzaXplKCk7XG4gICAgICAgIC8vXG5cdHRoaXMuZmVhdHVyZURldGFpbHMgPSBuZXcgRmVhdHVyZURldGFpbHModGhpcywgJyNmZWF0dXJlRGV0YWlscycpO1xuXG5cdHRoaXMuY3NjYWxlID0gZDMuc2NhbGUuY2F0ZWdvcnkxMCgpLmRvbWFpbihbXG5cdCAgICAncHJvdGVpbl9jb2RpbmdfZ2VuZScsXG5cdCAgICAncHNldWRvZ2VuZScsXG5cdCAgICAnbmNSTkFfZ2VuZScsXG5cdCAgICAnZ2VuZV9zZWdtZW50Jyxcblx0ICAgICdvdGhlcl9nZW5lJyxcblx0ICAgICdvdGhlcl9mZWF0dXJlX3R5cGUnXG5cdF0pO1xuXHQvL1xuXHQvL1xuXHR0aGlzLmxpc3RNYW5hZ2VyICAgID0gbmV3IExpc3RNYW5hZ2VyKHRoaXMsIFwiI215bGlzdHNcIik7XG5cdHRoaXMubGlzdE1hbmFnZXIudXBkYXRlKCk7XG5cdC8vXG5cdHRoaXMubGlzdEVkaXRvciA9IG5ldyBMaXN0RWRpdG9yKHRoaXMsICcjbGlzdGVkaXRvcicpO1xuXHQvL1xuXHR0aGlzLnRyYW5zbGF0b3IgICAgID0gbmV3IEJUTWFuYWdlcih0aGlzKTtcblx0dGhpcy5mZWF0dXJlTWFuYWdlciA9IG5ldyBGZWF0dXJlTWFuYWdlcih0aGlzKTtcblx0Ly9cblx0bGV0IHNlYXJjaFR5cGVzID0gW3tcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5RnVuY3Rpb25cIixcblx0ICAgIGxhYmVsOiBcIi4uLmJ5IGNlbGx1bGFyIGZ1bmN0aW9uXCIsXG5cdCAgICB0ZW1wbGF0ZTogXCJcIixcblx0ICAgIHBsYWNlaG9sZGVyOiBcIkdlbmUgT250b2xvZ3kgKEdPKSB0ZXJtcy9JRHNcIlxuXHR9LHtcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5UGhlbm90eXBlXCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBtdXRhbnQgcGhlbm90eXBlXCIsXG5cdCAgICB0ZW1wbGF0ZTogXCJcIixcblx0ICAgIHBsYWNlaG9sZGVyOiBcIk1hbW1hbGlhbiBQaGVub3R5cGUgKE1QKSB0ZXJtcy9JRHNcIlxuXHR9LHtcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5RGlzZWFzZVwiLFxuXHQgICAgbGFiZWw6IFwiLi4uYnkgZGlzZWFzZSBpbXBsaWNhdGlvblwiLFxuXHQgICAgdGVtcGxhdGU6IFwiXCIsXG5cdCAgICBwbGFjZWhvbGRlcjogXCJEaXNlYXNlIE9udG9sb2d5IChETykgdGVybXMvSURzXCJcblx0fSx7XG5cdCAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeUlkXCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBub21lbmNsYXR1cmVcIixcblx0ICAgIHRlbXBsYXRlOiBcIlwiLFxuXHQgICAgcGxhY2Vob2xkZXI6IFwiTUdJIG5hbWVzLCBzeW5vbnltcywgZXRjLlwiXG5cdH1dO1xuXHR0aGlzLnF1ZXJ5TWFuYWdlciA9IG5ldyBRdWVyeU1hbmFnZXIodGhpcywgXCIjZmluZEdlbmVzQm94XCIsIHNlYXJjaFR5cGVzKTtcblx0Ly9cblx0dGhpcy51c2VyUHJlZnNNYW5hZ2VyID0gbmV3IFVzZXJQcmVmc01hbmFnZXIoKTtcblx0Ly9cblx0Ly8gQnV0dG9uOiBHZWFyIGljb24gdG8gc2hvdy9oaWRlIGxlZnQgY29sdW1uXG5cdGQzLnNlbGVjdChcIiNoZWFkZXIgPiAuZ2Vhci5idXR0b25cIilcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgbGMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImxlZnRjb2x1bW5cIl0nKTtcblx0XHRsYy5jbGFzc2VkKFwiY2xvc2VkXCIsICgpID0+ICEgbGMuY2xhc3NlZChcImNsb3NlZFwiKSk7XG5cdFx0d2luZG93LnNldFRpbWVvdXQoKCk9Pntcblx0XHQgICAgdGhpcy5yZXNpemUoKVxuXHRcdCAgICB0aGlzLnNldENvbnRleHQoe30pO1xuXHRcdCAgICB0aGlzLnNldFByZWZzRnJvbVVJKCk7XG5cdFx0fSwgMjUwKTtcblx0ICAgIH0pO1xuXHRcblx0Ly9cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBGYWNldHNcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvL1xuXHR0aGlzLmZhY2V0TWFuYWdlciA9IG5ldyBGYWNldE1hbmFnZXIodGhpcyk7XG5cdGxldCBzZWxmID0gdGhpcztcblxuXHQvLyBGZWF0dXJlLXR5cGUgZmFjZXRcblx0bGV0IGZ0RmFjZXQgID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJGZWF0dXJlVHlwZVwiLCBmID0+IGYuZ2V0TXVuZ2VkVHlwZSgpKTtcblx0dGhpcy5pbml0RmVhdFR5cGVDb250cm9sKGZ0RmFjZXQpO1xuXG5cdC8vIEhhcy1NR0ktaWQgZmFjZXRcblx0bGV0IG1naUZhY2V0ID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJIYXNNZ2lJZFwiLCAgICBmID0+IGYubWdpaWQgID8gXCJ5ZXNcIiA6IFwibm9cIiApO1xuXHRkMy5zZWxlY3RBbGwoJ2lucHV0W25hbWU9XCJtZ2lGYWNldFwiXScpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCl7XG5cdCAgICBtZ2lGYWNldC5zZXRWYWx1ZXModGhpcy52YWx1ZSA9PT0gXCJcIiA/IFtdIDogW3RoaXMudmFsdWVdKTtcblx0ICAgIHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXG5cdC8vIElzLWhpZ2hsaWdodGVkIGZhY2V0XG5cdGxldCBoaUZhY2V0ID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJJc0hpXCIsIGYgPT4ge1xuXHQgICAgbGV0IGlzaGkgPSB0aGlzLnpvb21WaWV3LmhpRmVhdHNbZi5tZ2lpZF0gfHwgdGhpcy56b29tVmlldy5oaUZlYXRzW2YubWdwaWRdO1xuXHQgICAgcmV0dXJuIGlzaGkgPyBcInllc1wiIDogXCJub1wiO1xuXHR9KTtcblx0ZDMuc2VsZWN0QWxsKCdpbnB1dFtuYW1lPVwiaGlGYWNldFwiXScpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCl7XG5cdCAgICBoaUZhY2V0LnNldFZhbHVlcyh0aGlzLnZhbHVlID09PSBcIlwiID8gW10gOiBbdGhpcy52YWx1ZV0pO1xuXHQgICAgc2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0fSk7XG5cblxuXHQvL1xuXHR0aGlzLnNldFVJRnJvbVByZWZzKCk7XG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdC8vIFRoaW5ncyBhcmUgYWxsIHdpcmVkIHVwLiBOb3cgbGV0J3MgZ2V0IHNvbWUgZGF0YS5cblx0Ly8gU3RhcnQgd2l0aCB0aGUgZmlsZSBvZiBhbGwgdGhlIGdlbm9tZXMuXG5cdGQzdHN2KFwiLi9kYXRhL2dlbm9tZUxpc3QudHN2XCIpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICAvLyBjcmVhdGUgR2Vub21lIG9iamVjdHMgZnJvbSB0aGUgcmF3IGRhdGEuXG5cdCAgICB0aGlzLmFsbEdlbm9tZXMgICA9IGRhdGEubWFwKGcgPT4gbmV3IEdlbm9tZShnKSk7XG5cdCAgICB0aGlzLmFsbEdlbm9tZXMuc29ydCggKGEsYikgPT4ge1xuXHQgICAgICAgIHJldHVybiBhLmxhYmVsIDwgYi5sYWJlbCA/IC0xIDogYS5sYWJlbCA+IGIubGFiZWwgPyArMSA6IDA7XG5cdCAgICB9KTtcblx0ICAgIC8vXG5cdCAgICAvLyBidWlsZCBhIG5hbWUtPkdlbm9tZSBpbmRleFxuXHQgICAgdGhpcy5ubDJnZW5vbWUgPSB7fTsgLy8gYWxzbyBidWlsZCB0aGUgY29tYmluZWQgbGlzdCBhdCB0aGUgc2FtZSB0aW1lLi4uXG5cdCAgICB0aGlzLm5hbWUyZ2Vub21lICA9IHRoaXMuYWxsR2Vub21lc1xuXHQgICAgICAgIC5yZWR1Y2UoKGFjYyxnKSA9PiB7IHRoaXMubmwyZ2Vub21lW2cubmFtZV0gPSBhY2NbZy5uYW1lXSA9IGc7IHJldHVybiBhY2M7IH0sIHt9KTtcblx0ICAgIC8vIGJ1aWxkIGEgbGFiZWwtPkdlbm9tZSBpbmRleFxuXHQgICAgdGhpcy5sYWJlbDJnZW5vbWUgPSB0aGlzLmFsbEdlbm9tZXNcblx0ICAgICAgICAucmVkdWNlKChhY2MsZykgPT4geyB0aGlzLm5sMmdlbm9tZVtnLmxhYmVsXSA9IGFjY1tnLmxhYmVsXSA9IGc7IHJldHVybiBhY2M7IH0sIHt9KTtcblxuXHQgICAgLy8gUHJlbG9hZCBhbGwgdGhlIGNocm9tb3NvbWUgZmlsZXMgZm9yIGFsbCB0aGUgZ2Vub21lc1xuXHQgICAgbGV0IGNkcHMgPSB0aGlzLmFsbEdlbm9tZXMubWFwKGcgPT4gZDN0c3YoYC4vZGF0YS9nZW5vbWVkYXRhLyR7Zy5uYW1lfS1jaHJvbW9zb21lcy50c3ZgKSk7XG5cdCAgICByZXR1cm4gUHJvbWlzZS5hbGwoY2Rwcyk7XG5cdH0uYmluZCh0aGlzKSlcblx0LnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuXHQgICAgLy9cblx0ICAgIHRoaXMucHJvY2Vzc0Nocm9tb3NvbWVzKGRhdGEpO1xuXG5cdCAgICAvL1xuXHQgICAgbGV0IGNmZyA9IHRoaXMuc2FuaXRpemVDZmcodGhpcy5pbml0aWFsQ2ZnKTtcblx0ICAgIGxldCBzZWxmID0gdGhpcztcblxuXHQgICAgLy8gaW5pdGlhbGl6ZSB0aGUgcmVmIGFuZCBjb21wIGdlbm9tZSBvcHRpb24gbGlzdHNcblx0ICAgIGluaXRPcHRMaXN0KFwiI3JlZkdlbm9tZVwiLCAgIHRoaXMuYWxsR2Vub21lcywgZz0+Zy5uYW1lLCBnPT5nLmxhYmVsLCBmYWxzZSwgZyA9PiBnID09PSBjZmcucmVmKTtcblx0ICAgIGluaXRPcHRMaXN0KFwiI2NvbXBHZW5vbWVzXCIsIHRoaXMuYWxsR2Vub21lcywgZz0+Zy5uYW1lLCBnPT5nLmxhYmVsLCB0cnVlLCAgZyA9PiBjZmcuZ2Vub21lcy5pbmRleE9mKGcpICE9PSAtMSk7XG5cdCAgICBkMy5zZWxlY3QoXCIjcmVmR2Vub21lXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHNlbGYuc2V0Q29udGV4dCh7IHJlZjogdGhpcy52YWx1ZSB9KTtcblx0ICAgIH0pO1xuXHQgICAgZDMuc2VsZWN0KFwiI2NvbXBHZW5vbWVzXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuXHRcdGxldCBzZWxlY3RlZE5hbWVzID0gW107XG5cdFx0Zm9yKGxldCB4IG9mIHRoaXMuc2VsZWN0ZWRPcHRpb25zKXtcblx0XHQgICAgc2VsZWN0ZWROYW1lcy5wdXNoKHgudmFsdWUpO1xuXHRcdH1cblx0XHQvLyB3YW50IHRvIHByZXNlcnZlIGN1cnJlbnQgZ2Vub21lIG9yZGVyIGFzIG11Y2ggYXMgcG9zc2libGUgXG5cdFx0bGV0IGdOYW1lcyA9IHNlbGYudkdlbm9tZXMubWFwKGc9PmcubmFtZSlcblx0XHQgICAgLmZpbHRlcihuID0+IHtcblx0XHQgICAgICAgIHJldHVybiBzZWxlY3RlZE5hbWVzLmluZGV4T2YobikgPj0gMCB8fCBuID09PSBzZWxmLnJHZW5vbWUubmFtZTtcblx0XHQgICAgfSk7XG5cdFx0Z05hbWVzID0gZ05hbWVzLmNvbmNhdChzZWxlY3RlZE5hbWVzLmZpbHRlcihuID0+IGdOYW1lcy5pbmRleE9mKG4pID09PSAtMSkpO1xuXHRcdHNlbGYuc2V0Q29udGV4dCh7IGdlbm9tZXM6IGdOYW1lcyB9KTtcblx0ICAgIH0pO1xuXHQgICAgLy9cblx0ICAgIC8vIEZJTkFMTFkhIFdlIGFyZSByZWFkeSB0byBkcmF3IHRoZSBpbml0aWFsIHNjZW5lLlxuXHQgICAgdGhpcy5zZXRDb250ZXh0KHRoaXMuaW5pdGlhbENmZyk7XG5cblx0fS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcHJvY2Vzc0Nocm9tb3NvbWVzIChkYXRhKSB7XG5cdC8vIGRhdGEgaXMgYSBsaXN0IG9mIGNocm9tb3NvbWUgbGlzdHMsIG9uZSBwZXIgZ2Vub21lXG5cdC8vIEZpbGwgaW4gdGhlIGdlbm9tZUNocnMgbWFwIChnZW5vbWUgLT4gY2hyIGxpc3QpXG5cdHRoaXMuYWxsR2Vub21lcy5mb3JFYWNoKChnLGkpID0+IHtcblx0ICAgIC8vIG5pY2VseSBzb3J0IHRoZSBjaHJvbW9zb21lc1xuXHQgICAgbGV0IGNocnMgPSBkYXRhW2ldO1xuXHQgICAgZy5tYXhsZW4gPSAwO1xuXHQgICAgY2hycy5mb3JFYWNoKCBjID0+IHtcblx0XHQvL1xuXHRcdGMubGVuZ3RoID0gcGFyc2VJbnQoYy5sZW5ndGgpXG5cdFx0Zy5tYXhsZW4gPSBNYXRoLm1heChnLm1heGxlbiwgYy5sZW5ndGgpO1xuXHRcdC8vIGJlY2F1c2UgSSdkIHJhdGhlciBzYXkgXCJjaHJvbW9zb21lLm5hbWVcIiB0aGFuIFwiY2hyb21vc29tZS5jaHJvbW9zb21lXCJcblx0XHRjLm5hbWUgPSBjLmNocm9tb3NvbWU7XG5cdFx0ZGVsZXRlIGMuY2hyb21vc29tZTtcblx0ICAgIH0pO1xuXHQgICAgLy8gbmljZWx5IHNvcnQgdGhlIGNocm9tb3NvbWVzXG5cdCAgICBjaHJzLnNvcnQoKGEsYikgPT4ge1xuXHRcdGxldCBhYSA9IHBhcnNlSW50KGEubmFtZSkgLSBwYXJzZUludChiLm5hbWUpO1xuXHRcdGlmICghaXNOYU4oYWEpKSByZXR1cm4gYWE7XG5cdFx0cmV0dXJuIGEubmFtZSA8IGIubmFtZSA/IC0xIDogYS5uYW1lID4gYi5uYW1lID8gKzEgOiAwO1xuXHQgICAgfSk7XG5cdCAgICBnLmNocm9tb3NvbWVzID0gY2hycztcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXREb20gKCkge1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldENvbnRlbnREcmFnZ2VyICgpIHtcbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIC8vIEhlbHBlciBmdW5jdGlvbiBmb3IgdGhlIGRyYWcgYmVoYXZpb3IuIFJlb3JkZXJzIHRoZSBjb250ZW50cyBiYXNlZCBvblxuICAgICAgLy8gY3VycmVudCBzY3JlZW4gcG9zaXRpb24gb2YgdGhlIGRyYWdnZWQgaXRlbS5cbiAgICAgIGZ1bmN0aW9uIHJlb3JkZXJCeURvbSgpIHtcblx0ICAvLyBMb2NhdGUgdGhlIHNpYiB3aG9zZSBwb3NpdGlvbiBpcyBiZXlvbmQgdGhlIGRyYWdnZWQgaXRlbSBieSB0aGUgbGVhc3QgYW1vdW50XG5cdCAgbGV0IGRyID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICBsZXQgYlNpYiA9IG51bGw7XG5cdCAgbGV0IHh5ID0gZDMuc2VsZWN0KHNlbGYuZHJhZ1BhcmVudCkuY2xhc3NlZChcImZsZXhyb3dcIikgPyBcInhcIiA6IFwieVwiO1xuXHQgIGZvciAobGV0IHMgb2Ygc2VsZi5kcmFnU2licykge1xuXHQgICAgICBsZXQgc3IgPSBzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICBpZiAoZHJbeHldIDwgc3JbeHldKSB7XG5cdFx0ICAgbGV0IGRpc3QgPSBzclt4eV0gLSBkclt4eV07XG5cdFx0ICAgaWYgKCFiU2liIHx8IGRpc3QgPCBiU2liW3h5XSAtIGRyW3h5XSlcblx0XHQgICAgICAgYlNpYiA9IHM7XG5cdCAgICAgIH1cblx0ICB9XG5cdCAgLy8gSW5zZXJ0IHRoZSBkcmFnZ2VkIGl0ZW0gYmVmb3JlIHRoZSBsb2NhdGVkIHNpYiAob3IgYXBwZW5kIGlmIG5vIHNpYiBmb3VuZClcblx0ICBzZWxmLmRyYWdQYXJlbnQuaW5zZXJ0QmVmb3JlKHNlbGYuZHJhZ2dpbmcsIGJTaWIpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gcmVvcmRlckJ5U3R5bGUoKSB7XG5cdCAgbGV0IGRkID0gZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpO1xuXHQgIC8vIExvY2F0ZSB0aGUgc2liIHRoYXQgY29udGFpbnMgdGhlIGRyYWdnZWQgaXRlbSdzIG9yaWdpbi5cblx0ICBsZXQgZHIgPSBzZWxmLmRyYWdnaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIGxldCBiU2liID0gbnVsbDtcblx0ICBsZXQgeHkgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnUGFyZW50KS5jbGFzc2VkKFwiZmxleHJvd1wiKSA/IFwieFwiIDogXCJ5XCI7XG5cdCAgbGV0IHN6ID0geHkgPT09IFwieFwiID8gXCJ3aWR0aFwiIDogXCJoZWlnaHRcIjtcblx0ICBsZXQgc3R5PSB4eSA9PT0gXCJ4XCIgPyBcImxlZnRcIiA6IFwidG9wXCI7XG5cdCAgZm9yIChsZXQgcyBvZiBzZWxmLmRyYWdTaWJzKSB7XG5cdCAgICAgIC8vIHNraXAgdGhlIGRyYWdnZWQgaXRlbVxuXHQgICAgICBpZiAocyA9PT0gc2VsZi5kcmFnZ2luZykgY29udGludWU7XG5cdCAgICAgIGxldCBkcyA9IGQzLnNlbGVjdChzKTtcblx0ICAgICAgbGV0IHNyID0gcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgLy8gaWZ3IHRoZSBkcmFnZ2VkIGl0ZW0ncyBvcmlnaW4gaXMgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCBvZiBzaWIsIHdlIGZvdW5kIGl0LlxuXHQgICAgICBpZiAoZHJbeHldID49IHNyW3h5XSAmJiBkclt4eV0gPD0gKHNyW3h5XSArIHNyW3N6XSkpIHtcblx0XHQgICAvLyBtb3ZlIHNpYiB0b3dhcmQgdGhlIGhvbGUsIGFtb3VudCA9IHRoZSBzaXplIG9mIHRoZSBob2xlXG5cdFx0ICAgbGV0IGFtdCA9IHNlbGYuZHJhZ0hvbGVbc3pdICogKHNlbGYuZHJhZ0hvbGVbeHldIDwgc3JbeHldID8gLTEgOiAxKTtcblx0XHQgICBkcy5zdHlsZShzdHksIHBhcnNlSW50KGRzLnN0eWxlKHN0eSkpICsgYW10ICsgXCJweFwiKTtcblx0XHQgICBzZWxmLmRyYWdIb2xlW3h5XSAtPSBhbXQ7XG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgIH1cblx0ICB9XG4gICAgICB9XG4gICAgICAvL1xuICAgICAgcmV0dXJuIGQzLmJlaGF2aW9yLmRyYWcoKVxuXHQgIC5vcmlnaW4oZnVuY3Rpb24oZCxpKXtcblx0ICAgICAgcmV0dXJuIHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgfSlcbiAgICAgICAgICAub24oXCJkcmFnc3RhcnQubVwiLCBmdW5jdGlvbigpIHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC5zb3VyY2VFdmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICghIGQzLnNlbGVjdCh0KS5jbGFzc2VkKFwiZHJhZ2hhbmRsZVwiKSkgcmV0dXJuO1xuXHQgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgLy9cblx0ICAgICAgc2VsZi5kcmFnZ2luZyAgICA9IHRoaXMuY2xvc2VzdChcIi5wYWdlYm94XCIpO1xuXHQgICAgICBzZWxmLmRyYWdIb2xlICAgID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgc2VsZi5kcmFnUGFyZW50ICA9IHNlbGYuZHJhZ2dpbmcucGFyZW50Tm9kZTtcblx0ICAgICAgc2VsZi5kcmFnU2licyAgICA9IHNlbGYuZHJhZ1BhcmVudC5jaGlsZHJlbjtcblx0ICAgICAgLy9cblx0ICAgICAgZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCB0cnVlKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWcubVwiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICBsZXQgZGQgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZyk7XG5cdCAgICAgIGxldCB0cCA9IHBhcnNlSW50KGRkLnN0eWxlKFwidG9wXCIpKVxuXHQgICAgICBkZC5zdHlsZShcInRvcFwiLCB0cCArIGQzLmV2ZW50LmR5ICsgXCJweFwiKTtcblx0ICAgICAgLy9yZW9yZGVyQnlTdHlsZSgpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZ2VuZC5tXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIHJlb3JkZXJCeURvbSgpO1xuXHQgICAgICBzZWxmLnNldFByZWZzRnJvbVVJKCk7XG5cdCAgICAgIGxldCBkZCA9IGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKTtcblx0ICAgICAgZGQuc3R5bGUoXCJ0b3BcIiwgXCIwcHhcIik7XG5cdCAgICAgIGRkLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCBmYWxzZSk7XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgICAgPSBudWxsO1xuXHQgICAgICBzZWxmLmRyYWdIb2xlICAgID0gbnVsbDtcblx0ICAgICAgc2VsZi5kcmFnUGFyZW50ICA9IG51bGw7XG5cdCAgICAgIHNlbGYuZHJhZ1NpYnMgICAgPSBudWxsO1xuXHQgIH0pXG5cdCAgO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRVSUZyb21QcmVmcyAoKSB7XG4gICAgICAgIGxldCBwcmVmcyA9IHRoaXMudXNlclByZWZzTWFuYWdlci5nZXRBbGwoKTtcblx0Y29uc29sZS5sb2coXCJHb3QgcHJlZnMgZnJvbSBzdG9yYWdlXCIsIHByZWZzKTtcblxuXHQvLyBzZXQgb3Blbi9jbG9zZWQgc3RhdGVzXG5cdChwcmVmcy5jbG9zYWJsZXMgfHwgW10pLmZvckVhY2goIGMgPT4ge1xuXHQgICAgbGV0IGlkID0gY1swXTtcblx0ICAgIGxldCBzdGF0ZSA9IGNbMV07XG5cdCAgICBkMy5zZWxlY3QoJyMnK2lkKS5jbGFzc2VkKCdjbG9zZWQnLCBzdGF0ZSA9PT0gXCJjbG9zZWRcIiB8fCBudWxsKTtcblx0fSk7XG5cblx0Ly8gc2V0IGRyYWdnYWJsZXMnIG9yZGVyXG5cdChwcmVmcy5kcmFnZ2FibGVzIHx8IFtdKS5mb3JFYWNoKCBkID0+IHtcblx0ICAgIGxldCBjdHJJZCA9IGRbMF07XG5cdCAgICBsZXQgY29udGVudElkcyA9IGRbMV07XG5cdCAgICBsZXQgY3RyID0gZDMuc2VsZWN0KCcjJytjdHJJZCk7XG5cdCAgICBsZXQgY29udGVudHMgPSBjdHIuc2VsZWN0QWxsKCcjJytjdHJJZCsnID4gKicpO1xuXHQgICAgY29udGVudHNbMF0uc29ydCggKGEsYikgPT4ge1xuXHQgICAgICAgIGxldCBhaSA9IGNvbnRlbnRJZHMuaW5kZXhPZihhLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG5cdCAgICAgICAgbGV0IGJpID0gY29udGVudElkcy5pbmRleE9mKGIuZ2V0QXR0cmlidXRlKCdpZCcpKTtcblx0XHRyZXR1cm4gYWkgLSBiaTtcblx0ICAgIH0pO1xuXHQgICAgY29udGVudHMub3JkZXIoKTtcblx0fSk7XG4gICAgfVxuICAgIHNldFByZWZzRnJvbVVJICgpIHtcbiAgICAgICAgLy8gc2F2ZSBvcGVuL2Nsb3NlZCBzdGF0ZXNcblx0bGV0IGNsb3NhYmxlcyA9IHRoaXMucm9vdC5zZWxlY3RBbGwoJy5jbG9zYWJsZScpO1xuXHRsZXQgb2NEYXRhID0gY2xvc2FibGVzWzBdLm1hcCggYyA9PiB7XG5cdCAgICBsZXQgZGMgPSBkMy5zZWxlY3QoYyk7XG5cdCAgICByZXR1cm4gW2RjLmF0dHIoJ2lkJyksIGRjLmNsYXNzZWQoXCJjbG9zZWRcIikgPyBcImNsb3NlZFwiIDogXCJvcGVuXCJdO1xuXHR9KTtcblx0Ly8gc2F2ZSBkcmFnZ2FibGVzJyBvcmRlclxuXHRsZXQgZHJhZ0N0cnMgPSB0aGlzLnJvb3Quc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUnKTtcblx0bGV0IGRyYWdnYWJsZXMgPSBkcmFnQ3Rycy5zZWxlY3RBbGwoJy5jb250ZW50LWRyYWdnYWJsZSA+IConKTtcblx0bGV0IGRkRGF0YSA9IGRyYWdnYWJsZXMubWFwKCAoZCxpKSA9PiB7XG5cdCAgICBsZXQgY3RyID0gZDMuc2VsZWN0KGRyYWdDdHJzWzBdW2ldKTtcblx0ICAgIHJldHVybiBbY3RyLmF0dHIoJ2lkJyksIGQubWFwKCBkZCA9PiBkMy5zZWxlY3QoZGQpLmF0dHIoJ2lkJykpXTtcblx0fSk7XG5cdGxldCBwcmVmcyA9IHtcblx0ICAgIGNsb3NhYmxlczogb2NEYXRhLFxuXHQgICAgZHJhZ2dhYmxlczogZGREYXRhXG5cdH1cblx0Y29uc29sZS5sb2coXCJTYXZpbmcgcHJlZnMgdG8gc3RvcmFnZVwiLCBwcmVmcyk7XG5cdHRoaXMudXNlclByZWZzTWFuYWdlci5zZXRBbGwocHJlZnMpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93QmxvY2tzIChjb21wKSB7XG5cdGxldCByZWYgPSB0aGlzLnJHZW5vbWU7XG5cdGlmICghIGNvbXApIGNvbXAgPSB0aGlzLmNHZW5vbWVzWzBdO1xuXHRpZiAoISBjb21wKSByZXR1cm47XG5cdHRoaXMudHJhbnNsYXRvci5yZWFkeSgpLnRoZW4oICgpID0+IHtcblx0ICAgIGxldCBibG9ja3MgPSBjb21wID09PSByZWYgPyBbXSA6IHRoaXMudHJhbnNsYXRvci5nZXRCbG9ja3MocmVmLCBjb21wKTtcblx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3QmxvY2tzKHsgcmVmLCBjb21wLCBibG9ja3MgfSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93QnVzeSAoaXNCdXN5LCBtZXNzYWdlKSB7XG4gICAgICAgIGQzLnNlbGVjdChcIiNoZWFkZXIgPiAuZ2Vhci5idXR0b25cIilcblx0ICAgIC5jbGFzc2VkKFwicm90YXRpbmdcIiwgaXNCdXN5KTtcbiAgICAgICAgZDMuc2VsZWN0KFwiI3pvb21WaWV3XCIpLmNsYXNzZWQoXCJidXN5XCIsIGlzQnVzeSk7XG5cdGlmIChpc0J1c3kgJiYgbWVzc2FnZSkgdGhpcy5zaG93U3RhdHVzKG1lc3NhZ2UpO1xuXHRpZiAoIWlzQnVzeSkgdGhpcy5zaG93U3RhdHVzKCcnKVxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93U3RhdHVzIChtc2cpIHtcblx0aWYgKG1zZylcblx0ICAgIGQzLnNlbGVjdCgnI3N0YXR1c01lc3NhZ2UnKVxuXHRcdC5jbGFzc2VkKCdzaG93aW5nJywgdHJ1ZSlcblx0XHQuc2VsZWN0KCdzcGFuJylcblx0XHQgICAgLnRleHQobXNnKTtcblx0ZWxzZVxuXHQgICAgZDMuc2VsZWN0KCcjc3RhdHVzTWVzc2FnZScpLmNsYXNzZWQoJ3Nob3dpbmcnLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0UmVmR2Vub21lU2VsZWN0aW9uICgpIHtcblx0ZDMuc2VsZWN0QWxsKFwiI3JlZkdlbm9tZSBvcHRpb25cIilcblx0ICAgIC5wcm9wZXJ0eShcInNlbGVjdGVkXCIsICBnZyA9PiAoZ2cubGFiZWwgPT09IHRoaXMuckdlbm9tZS5sYWJlbCAgfHwgbnVsbCkpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRDb21wR2Vub21lc1NlbGVjdGlvbiAoKSB7XG5cdGxldCBjZ25zID0gdGhpcy52R2Vub21lcy5tYXAoZz0+Zy5sYWJlbCk7XG5cdGQzLnNlbGVjdEFsbChcIiNjb21wR2Vub21lcyBvcHRpb25cIilcblx0ICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCAgZ2cgPT4gY2ducy5pbmRleE9mKGdnLmxhYmVsKSA+PSAwKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyBvciByZXR1cm5zXG4gICAgc2V0SGlnaGxpZ2h0IChmbGlzdCkge1xuXHRpZiAoIWZsaXN0KSByZXR1cm4gZmFsc2U7XG5cdHRoaXMuem9vbVZpZXcuaGlGZWF0cyA9IGZsaXN0LnJlZHVjZSgoYSx2KSA9PiB7IGFbdl09djsgcmV0dXJuIGE7IH0sIHt9KTtcblx0cmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIGN1cnJlbnQgY29udGV4dCBhcyBhbiBvYmplY3QuXG4gICAgLy8gQ3VycmVudCBjb250ZXh0ID0gcmVmIGdlbm9tZSArIGNvbXAgZ2Vub21lcyArIGN1cnJlbnQgcmFuZ2UgKGNocixzdGFydCxlbmQpXG4gICAgZ2V0Q29udGV4dCAoKSB7XG5cdGlmICh0aGlzLmNtb2RlID09PSAnbWFwcGVkJykge1xuXHQgICAgbGV0IGMgPSB0aGlzLmNvb3Jkcztcblx0ICAgIHJldHVybiB7XG5cdFx0cmVmIDogdGhpcy5yR2Vub21lLmxhYmVsLFxuXHRcdGdlbm9tZXM6IHRoaXMudkdlbm9tZXMubWFwKGc9PmcubGFiZWwpLFxuXHRcdGNocjogYy5jaHIsXG5cdFx0c3RhcnQ6IGMuc3RhcnQsXG5cdFx0ZW5kOiBjLmVuZCxcblx0XHRoaWdobGlnaHQ6IE9iamVjdC5rZXlzKHRoaXMuem9vbVZpZXcuaGlGZWF0cykuc29ydCgpLFxuXHRcdGRtb2RlOiB0aGlzLnpvb21WaWV3LmRtb2RlXG5cdCAgICB9XG5cdH0gZWxzZSB7XG5cdCAgICBsZXQgYyA9IHRoaXMubGNvb3Jkcztcblx0ICAgIHJldHVybiB7XG5cdFx0cmVmIDogdGhpcy5yR2Vub21lLmxhYmVsLFxuXHRcdGdlbm9tZXM6IHRoaXMudkdlbm9tZXMubWFwKGc9PmcubGFiZWwpLFxuXHRcdGxhbmRtYXJrOiBjLmxhbmRtYXJrLFxuXHRcdGZsYW5rOiBjLmZsYW5rLFxuXHRcdGxlbmd0aDogYy5sZW5ndGgsXG5cdFx0ZGVsdGE6IGMuZGVsdGEsXG5cdFx0aGlnaGxpZ2h0OiBPYmplY3Qua2V5cyh0aGlzLnpvb21WaWV3LmhpRmVhdHMpLnNvcnQoKSxcblx0XHRkbW9kZTogdGhpcy56b29tVmlldy5kbW9kZVxuXHQgICAgfVxuXHR9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJlc29sdmVzIHRoZSBzcGVjaWZpZWQgbGFuZG1hcmsgdG8gYSBmZWF0dXJlIGFuZCB0aGUgbGlzdCBvZiBlcXVpdmFsZW50IGZlYXVyZXMuXG4gICAgLy8gTWF5IGJlIGdpdmVuIGFuIGlkLCBjYW5vbmljYWwgaWQsIG9yIHN5bWJvbC5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBjZmcgKG9iaikgU2FuaXRpemVkIGNvbmZpZyBvYmplY3QsIHdpdGggYSBsYW5kbWFyayAoc3RyaW5nKSBmaWVsZC5cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgICBUaGUgY2ZnIG9iamVjdCwgd2l0aCBhZGRpdGlvbmFsIGZpZWxkczpcbiAgICAvLyAgICAgICAgbGFuZG1hcmtSZWZGZWF0OiB0aGUgbGFuZG1hcmsgKEZlYXR1cmUgb2JqKSBpbiB0aGUgcmVmIGdlbm9tZVxuICAgIC8vICAgICAgICBsYW5kbWFya0ZlYXRzOiBbIGVxdWl2YWxlbnQgZmVhdHVyZXMgaW4gZWFjaCBnZW5vbWUgKGluY2x1ZGVzIHJmKV1cbiAgICAvLyAgICAgQWxzbywgY2hhbmdlcyByZWYgdG8gYmUgdGhlIGdlbm9tZSBvZiB0aGUgbGFuZG1hcmtSZWZGZWF0XG4gICAgLy8gICAgIFJldHVybnMgbnVsbCBpZiBsYW5kbWFyayBub3QgZm91bmQgaW4gYW55IGdlbm9tZS5cbiAgICAvLyBcbiAgICByZXNvbHZlTGFuZG1hcmsgKGNmZykge1xuXHRsZXQgcmYsIGZlYXRzO1xuXHQvLyBGaW5kIHRoZSBsYW5kbWFyayBmZWF0dXJlIGluIHRoZSByZWYgZ2Vub21lLiBcblx0cmYgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlMYWJlbChjZmcubGFuZG1hcmssIGNmZy5yZWYpWzBdO1xuXHRpZiAocmYpIHtcblx0ICAgIC8vIGxhbmRtYXJrIGV4aXN0cyBpbiByZWYgZ2Vub21lLiBHZXQgZXF1aXZhbGVudCBmZWF0IGluIGVhY2ggZ2Vub21lLlxuXHQgICAgZmVhdHMgPSByZi5jYW5vbmljYWwgPyB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlDYW5vbmljYWxJZChyZi5jYW5vbmljYWwpIDogW3JmXTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIC8vIGxhbmRtYXJrIGRvZXMgbm90IGV4aXN0IGluIHJlZiBnZW5vbWUuIERvZXMgaXQgZXhpc3QgYW55d2hlcmU/XG5cdCAgICByZiA9IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsKGNmZy5sYW5kbWFyaylbMF07XG5cdCAgICBpZiAocmYpIHtcblx0ICAgICAgICAvLyBZZXMsIGxhbmRtYXJrIGV4aXN0cyBpbiBhbm90aGVyIGdlbm9tZS5cblx0XHQvLyBDaGFuZ2UgcmVmIGdlbm9tZSBhbmQgcHJvY2VlZC5cblx0XHRjZmcucmVmID0gcmYuZ2Vub21lO1xuXHRcdGZlYXRzID0gcmYuY2Fub25pY2FsID8gdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5Q2Fub25pY2FsSWQocmYuY2Fub25pY2FsKSA6IFtyZl07XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICAvLyBsYW5kbWFyayBkb2Vzbid0IGV4aXN0IGFueXdoZXJlLiBcblx0XHRyZXR1cm4gbnVsbDtcblx0ICAgIH1cblx0fVxuXHRjZmcubGFuZG1hcmtSZWZGZWF0ID0gcmY7XG5cdGNmZy5sYW5kbWFya0ZlYXRzID0gZmVhdHNcblx0cmV0dXJuIGNmZztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHNhbml0aXplZCB2ZXJzaW9uIG9mIHRoZSBhcmd1bWVudCBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAgICAvLyBUaGUgc2FuaXRpemVkIHZlcnNpb246XG4gICAgLy8gICAgIC0gaGFzIGEgc2V0dGluZyBmb3IgZXZlcnkgcGFyYW1ldGVyLiBQYXJhbWV0ZXJzIG5vdCBzcGVjaWZpZWQgaW4gXG4gICAgLy8gICAgICAgdGhlIGFyZ3VtZW50IGFyZSAoZ2VuZXJhbGx5KSBmaWxsZWQgaW4gd2l0aCB0aGVpciBjdXJyZW50IHZhbHVlcy5cbiAgICAvLyAgICAgLSBpcyBhbHdheXMgdmFsaWQsIGVnXG4gICAgLy8gICAgIFx0LSBoYXMgYSBsaXN0IG9mIDEgb3IgbW9yZSB2YWxpZCBnZW5vbWVzLCB3aXRoIG9uZSBvZiB0aGVtIGRlc2lnbmF0ZWQgYXMgdGhlIHJlZlxuICAgIC8vICAgICBcdC0gaGFzIGEgdmFsaWQgY29vcmRpbmF0ZSByYW5nZVxuICAgIC8vICAgICBcdCAgICAtIHN0YXJ0IGFuZCBlbmQgYXJlIGludGVnZXJzIHdpdGggc3RhcnQgPD0gZW5kXG4gICAgLy8gICAgIFx0ICAgIC0gdmFsaWQgY2hyb21vc29tZSBmb3IgcmVmIGdlbm9tZVxuICAgIC8vXG4gICAgLy8gVGhlIHNhbml0aXplZCB2ZXJzaW9uIGlzIGFsc28gXCJjb21waWxlZFwiOlxuICAgIC8vICAgICAtIGl0IGhhcyBhY3R1YWwgR2Vub21lIG9iamVjdHMsIHdoZXJlIHRoZSBhcmd1bWVudCBqdXN0IGhhcyBuYW1lc1xuICAgIC8vICAgICAtIGdyb3VwcyB0aGUgY2hyK3N0YXJ0K2VuZCBpbiBcImNvb3Jkc1wiIG9iamVjdFxuICAgIC8vXG4gICAgLy9cbiAgICBzYW5pdGl6ZUNmZyAoYykge1xuXHRsZXQgY2ZnID0ge307XG5cblx0Ly8gU2FuaXRpemUgdGhlIGlucHV0LlxuXG5cdC8vIHdpbmRvdyBzaXplIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGlmIChjLndpZHRoKSB7XG5cdCAgICBjZmcud2lkdGggPSBjLndpZHRoXG5cdH1cblxuXHQvLyByZWYgZ2Vub21lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvL1xuXHQvLyBTZXQgY2ZnLnJlZiB0byBzcGVjaWZpZWQgZ2Vub21lLCBcblx0Ly8gICB3aXRoIGZhbGxiYWNrIHRvIGN1cnJlbnQgcmVmIGdlbm9tZSwgXG5cdC8vICAgICAgd2l0aCBmYWxsYmFjayB0byBDNTdCTC82SiAoMXN0IHRpbWUgdGhydSlcblx0Ly8gRklYTUU6IGZpbmFsIGZhbGxiYWNrIHNob3VsZCBiZSBhIGNvbmZpZyBzZXR0aW5nLlxuXHRjZmcucmVmID0gKGMucmVmID8gdGhpcy5ubDJnZW5vbWVbYy5yZWZdIHx8IHRoaXMuckdlbm9tZSA6IHRoaXMuckdlbm9tZSkgfHwgdGhpcy5ubDJnZW5vbWVbJ0M1N0JMLzZKJ107XG5cblx0Ly8gY29tcGFyaXNvbiBnZW5vbWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gU2V0IGNmZy5nZW5vbWVzIHRvIGJlIHRoZSBzcGVjaWZpZWQgZ2Vub21lcyxcblx0Ly8gICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgZ2Vub21lc1xuXHQvLyAgICAgICAgd2l0aCBmYWxsYmFjayB0byBbcmVmXSAoMXN0IHRpbWUgdGhydSlcblx0Y2ZnLmdlbm9tZXMgPSBjLmdlbm9tZXMgP1xuXHQgICAgKGMuZ2Vub21lcy5tYXAoZyA9PiB0aGlzLm5sMmdlbm9tZVtnXSkuZmlsdGVyKHg9PngpKVxuXHQgICAgOlxuXHQgICAgdGhpcy52R2Vub21lcztcblx0Ly8gQWRkIHJlZiB0byBnZW5vbWVzIGlmIG5vdCB0aGVyZSBhbHJlYWR5XG5cdGlmIChjZmcuZ2Vub21lcy5pbmRleE9mKGNmZy5yZWYpID09PSAtMSlcblx0ICAgIGNmZy5nZW5vbWVzLnVuc2hpZnQoY2ZnLnJlZik7XG5cdFxuXHQvLyBhYnNvbHV0ZSBjb29yZGluYXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvL1xuXHQvLyBTZXQgY2ZnLmNociB0byBiZSB0aGUgc3BlY2lmaWVkIGNocm9tb3NvbWVcblx0Ly8gICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgY2hyXG5cdC8vICAgICAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgMXN0IGNocm9tb3NvbWUgaW4gdGhlIHJlZiBnZW5vbWVcblx0Y2ZnLmNociA9IGNmZy5yZWYuZ2V0Q2hyb21vc29tZShjLmNocik7XG5cdGlmICghY2ZnLmNocikgY2ZnLmNociA9IGNmZy5yZWYuZ2V0Q2hyb21vc29tZSggdGhpcy5jb29yZHMgPyB0aGlzLmNvb3Jkcy5jaHIgOiBcIjFcIiApO1xuXHRpZiAoIWNmZy5jaHIpIGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoMCk7XG5cdGlmICghY2ZnLmNocikgdGhyb3cgXCJObyBjaHJvbW9zb21lLlwiXG5cdFxuXHQvLyBTZXQgY2ZnLnN0YXJ0IHRvIGJlIHRoZSBzcGVjaWZpZWQgc3RhcnQgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBzdGFydFxuXHQvLyBDbGlwIGF0IGNociBib3VuZGFyaWVzXG5cdGNmZy5zdGFydCA9IGNsaXAoTWF0aC5yb3VuZCh0eXBlb2YoYy5zdGFydCkgPT09IFwibnVtYmVyXCIgPyBjLnN0YXJ0IDogdGhpcy5jb29yZHMuc3RhcnQpLCAxLCBjZmcuY2hyLmxlbmd0aCk7XG5cblx0Ly8gU2V0IGNmZy5lbmQgdG8gYmUgdGhlIHNwZWNpZmllZCBlbmQgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBlbmRcblx0Ly8gQ2xpcCBhdCBjaHIgYm91bmRhcmllc1xuXHRjZmcuZW5kID0gY2xpcChNYXRoLnJvdW5kKHR5cGVvZihjLmVuZCkgPT09IFwibnVtYmVyXCIgPyBjLmVuZCA6IHRoaXMuY29vcmRzLmVuZCksIDEsIGNmZy5jaHIubGVuZ3RoKTtcblxuXHQvLyBFbnN1cmUgc3RhcnQgPD0gZW5kXG5cdGlmIChjZmcuc3RhcnQgPiBjZmcuZW5kKSB7XG5cdCAgIGxldCB0bXAgPSBjZmcuc3RhcnQ7IGNmZy5zdGFydCA9IGNmZy5lbmQ7IGNmZy5lbmQgPSB0bXA7XG5cdH1cblxuXHQvLyBsYW5kbWFyayBjb29yZGluYXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBOT1RFIHRoYXQgbGFuZG1hcmsgY29vcmRpbmF0ZSBjYW5ub3QgYmUgZnVsbHkgcmVzb2x2ZWQgdG8gYWJzb2x1dGUgY29vcmRpbmF0ZSB1bnRpbFxuXHQvLyAqYWZ0ZXIqIGdlbm9tZSBkYXRhIGhhdmUgYmVlbiBsb2FkZWQuIFNlZSBzZXRDb250ZXh0IGFuZCByZXNvbHZlTGFuZG1hcmsgbWV0aG9kcy5cblx0Y2ZnLmxhbmRtYXJrID0gYy5sYW5kbWFyayB8fCB0aGlzLmxjb29yZHMubGFuZG1hcms7XG5cdGNmZy5kZWx0YSAgICA9IE1hdGgucm91bmQoJ2RlbHRhJyBpbiBjID8gYy5kZWx0YSA6ICh0aGlzLmxjb29yZHMuZGVsdGEgfHwgMCkpO1xuXHRpZiAoJ2ZsYW5rJyBpbiBjKXtcblx0ICAgIGNmZy5mbGFuayA9IE1hdGgucm91bmQoYy5mbGFuayk7XG5cdH1cblx0ZWxzZSBpZiAoJ2xlbmd0aCcgaW4gYykge1xuXHQgICAgY2ZnLmxlbmd0aCA9IE1hdGgucm91bmQoYy5sZW5ndGgpO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgY2ZnLmxlbmd0aCA9IE1hdGgucm91bmQodGhpcy5jb29yZHMuZW5kIC0gdGhpcy5jb29yZHMuc3RhcnQgKyAxKTtcblx0fVxuXG5cdC8vIGNtb2RlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGlmIChjLmNtb2RlICYmIGMuY21vZGUgIT09ICdtYXBwZWQnICYmIGMuY21vZGUgIT09ICdsYW5kbWFyaycpIGMuY21vZGUgPSBudWxsO1xuXHRjZmcuY21vZGUgPSBjLmNtb2RlIHx8IFxuXHQgICAgKCgnY2hyJyBpbiBjIHx8ICdzdGFydCcgaW4gYyB8fCAnZW5kJyBpbiBjKSA/XG5cdCAgICAgICAgJ21hcHBlZCcgOiBcblx0XHQoJ2xhbmRtYXJrJyBpbiBjIHx8ICdmbGFuaycgaW4gYyB8fCAnbGVuZ3RoJyBpbiBjIHx8ICdkZWx0YScgaW4gYykgP1xuXHRcdCAgICAnbGFuZG1hcmsnIDogXG5cdFx0ICAgIHRoaXMuY21vZGUgfHwgJ21hcHBlZCcpO1xuXG5cdC8vIGhpZ2hsaWdodGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIFNldCBjZmcuaGlnaGxpZ2h0XG5cdC8vICAgIHdpdGggZmFsbGJhY2sgdG8gY3VycmVudCBoaWdobGlnaHRcblx0Ly8gICAgICAgIHdpdGggZmFsbGJhY2sgdG8gW11cblx0Y2ZnLmhpZ2hsaWdodCA9IGMuaGlnaGxpZ2h0IHx8IHRoaXMuem9vbVZpZXcuaGlnaGxpZ2h0ZWQgfHwgW107XG5cblx0Ly8gZHJhd2luZyBtb2RlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gU2V0IHRoZSBkcmF3aW5nIG1vZGUgZm9yIHRoZSBab29tVmlldy5cblx0Ly8gICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgdmFsdWVcblx0aWYgKGMuZG1vZGUgPT09ICdjb21wYXJpc29uJyB8fCBjLmRtb2RlID09PSAncmVmZXJlbmNlJykgXG5cdCAgICBjZmcuZG1vZGUgPSBjLmRtb2RlO1xuXHRlbHNlXG5cdCAgICBjZmcuZG1vZGUgPSB0aGlzLnpvb21WaWV3LmRtb2RlIHx8ICdjb21wYXJpc29uJztcblxuXHQvL1xuXHRyZXR1cm4gY2ZnO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNldHMgdGhlIGN1cnJlbnQgY29udGV4dCBmcm9tIHRoZSBjb25maWcgb2JqZWN0LiBcbiAgICAvLyBPbmx5IHRob3NlIGNvbnRleHQgaXRlbXMgc3BlY2lmaWVkIGluIHRoZSBjb25maWcgYXJlIGFmZmVjdGVkLCBleGNlcHQgYXMgbm90ZWQuXG4gICAgLy9cbiAgICAvLyBBbGwgY29uZmlncyBhcmUgc2FuaXRpemVkIGJlZm9yZSBiZWluZyBhcHBsaWVkIChzZWUgc2FuaXRpemVDZmcpLlxuICAgIC8vIFxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgYyAob2JqZWN0KSBBIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHRoYXQgc3BlY2lmaWVzIHNvbWUvYWxsIGNvbmZpZyB2YWx1ZXMuXG4gICAgLy8gICAgICAgICBUaGUgcG9zc2libGUgY29uZmlnIGl0ZW1zOlxuICAgIC8vICAgICAgICAgICAgZ2Vub21lcyAgIChsaXN0IG8gc3RyaW5ncykgQWxsIHRoZSBnZW5vbWVzIHlvdSB3YW50IHRvIHNlZSwgaW4gdG9wLXRvLWJvdHRvbSBvcmRlci4gXG4gICAgLy8gICAgICAgICAgICAgICBNYXkgdXNlIGludGVybmFsIG5hbWVzIG9yIGRpc3BsYXkgbGFiZWxzLCBlZywgXCJtdXNfbXVzY3VsdXNfMTI5czFzdmltalwiIG9yIFwiMTI5UzEvU3ZJbUpcIi5cbiAgICAvLyAgICAgICAgICAgIHJlZiAgICAgICAoc3RyaW5nKSBUaGUgZ2Vub21lIHRvIHVzZSBhcyB0aGUgcmVmZXJlbmNlLiBNYXkgYmUgbmFtZSBvciBsYWJlbC5cbiAgICAvLyAgICAgICAgICAgIGhpZ2hsaWdodCAobGlzdCBvIHN0cmluZ3MpIElEcyBvZiBmZWF0dXJlcyB0byBoaWdobGlnaHRcbiAgICAvLyAgICAgICAgICAgIGRtb2RlICAgICAoc3RyaW5nKSBlaXRoZXIgJ2NvbXBhcmlzb24nIG9yICdyZWZlcmVuY2UnXG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIENvb3JkaW5hdGVzIGFyZSBzcGVjaWZpZWQgaW4gb25lIG9mIDIgZm9ybXMuXG4gICAgLy8gICAgICAgICAgICAgIGNociAgICAgICAoc3RyaW5nKSBDaHJvbW9zb21lIGZvciBjb29yZGluYXRlIHJhbmdlXG4gICAgLy8gICAgICAgICAgICAgIHN0YXJ0ICAgICAoaW50KSBDb29yZGluYXRlIHJhbmdlIHN0YXJ0IHBvc2l0aW9uXG4gICAgLy8gICAgICAgICAgICAgIGVuZCAgICAgICAoaW50KSBDb29yZGluYXRlIHJhbmdlIGVuZCBwb3NpdGlvblxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAgIERpc3BsYXlzIHRoaXMgY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBnZW5lb21zLCBhbmQgdGhlIGVxdWl2YWxlbnQgKG1hcHBlZClcbiAgICAvLyAgICAgICAgICAgICAgY29vcmRpbmF0ZSByYW5nZShzKSBpbiBlYWNoIGNvbXBhcmlzb24gZ2Vub21lLlxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICBvcjpcbiAgICAvLyAgICAgICAgICAgICAgbGFuZG1hcmsgIChzdHJpbmcpIElELCBjYW5vbmljYWwgSUQsIG9yIHN5bWJvbCwgaWRlbnRpZnlpbmcgYSBmZWF0dXJlLlxuICAgIC8vICAgICAgICAgICAgICBmbGFua3xsZW5ndGggKGludCkgSWYgZmxhbmssIHZpZXdpbmcgcmVnaW9uIHNpemUgPSBmbGFuayArIGxlbihsYW5kbWFyaykgKyBmbGFuay4gXG4gICAgLy8gICAgICAgICAgICAgICAgIElmIGxlbmd0aCwgdmlld2luZyByZWdpb24gc2l6ZSA9IGxlbmd0aC4gSW4gZWl0aGVyIGNhc2UsIHRoZSBsYW5kbWFyayBpcyBjZW50ZXJlZCBpblxuICAgIC8vICAgICAgICAgICAgICAgICB0aGUgdmlld2luZyBhcmVhLCArLy0gYW55IHNwZWNpZmllZCBkZWx0YS5cbiAgICAvLyAgICAgICAgICAgICAgZGVsdGEgICAgIChpbnQpIEFtb3VudCBpbiBicCB0byBzaGlmdCB0aGUgcmVnaW9uIGxlZnQgKDwwKSBvciByaWdodCAoPjApLlxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAgIERpc3BsYXlzIHRoZSByZWdpb24gYXJvdW5kIHRoZSBzcGVjaWZpZWQgbGFuZG1hcmsgaW4gZWFjaCBnZW5vbWUgd2hlcmUgaXQgZXhpc3RzLlxuICAgIC8vXG4gICAgLy8gICAgcXVpZXRseSAoYm9vbGVhbikgSWYgdHJ1ZSwgZG9uJ3QgdXBkYXRlIGJyb3dzZXIgaGlzdG9yeSAoYXMgd2hlbiBnb2luZyBiYWNrKVxuICAgIC8vXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgICBOb3RoaW5nXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vXHQgIFJlZHJhd3MgXG4gICAgLy9cdCAgQ2FsbHMgY29udGV4dENoYW5nZWQoKSBcbiAgICAvL1xuICAgIHNldENvbnRleHQgKGMsIHF1aWV0bHkpIHtcbiAgICAgICAgbGV0IGNmZyA9IHRoaXMuc2FuaXRpemVDZmcoYyk7XG5cdGNvbnNvbGUubG9nKFwiU2V0IGNvbnRleHQgKHJhdyk6XCIsIGMpO1xuXHRjb25zb2xlLmxvZyhcIlNldCBjb250ZXh0IChzYW5pdGl6ZWQpOlwiLCBjZmcpO1xuXHRpZiAoIWNmZykgcmV0dXJuO1xuXHR0aGlzLnNob3dCdXN5KHRydWUsICdSZXF1ZXN0aW5nIGRhdGEuLi4nKTtcblx0bGV0IHAgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmxvYWRHZW5vbWVzKGNmZy5nZW5vbWVzKS50aGVuKCgpID0+IHtcblx0ICAgIGlmIChjZmcuY21vZGUgPT09ICdsYW5kbWFyaycpXG5cdCAgICAgICAgdGhpcy5yZXNvbHZlTGFuZG1hcmsoY2ZnKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLnZHZW5vbWVzID0gY2ZnLmdlbm9tZXM7XG5cdCAgICB0aGlzLnJHZW5vbWUgID0gY2ZnLnJlZjtcblx0ICAgIHRoaXMuY0dlbm9tZXMgPSBjZmcuZ2Vub21lcy5maWx0ZXIoZyA9PiBnICE9PSBjZmcucmVmKTtcblx0ICAgIHRoaXMuc2V0UmVmR2Vub21lU2VsZWN0aW9uKHRoaXMuckdlbm9tZS5uYW1lKTtcblx0ICAgIHRoaXMuc2V0Q29tcEdlbm9tZXNTZWxlY3Rpb24odGhpcy52R2Vub21lcy5tYXAoZz0+Zy5uYW1lKSk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5jbW9kZSA9IGNmZy5jbW9kZTtcblx0ICAgIHJldHVybiB0aGlzLnRyYW5zbGF0b3IucmVhZHkoKTtcblx0fSkudGhlbigoKSA9PiB7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5jb29yZHMgICA9IHsgY2hyOiBjZmcuY2hyLm5hbWUsIHN0YXJ0OiBjZmcuc3RhcnQsIGVuZDogY2ZnLmVuZCB9O1xuXHQgICAgdGhpcy5sY29vcmRzICA9IHtcblx0ICAgICAgICBsYW5kbWFyazogY2ZnLmxhbmRtYXJrLCBcblx0XHRsYW5kbWFya1JlZkZlYXQ6IGNmZy5sYW5kbWFya1JlZkZlYXQsXG5cdFx0bGFuZG1hcmtGZWF0czogY2ZnLmxhbmRtYXJrRmVhdHMsXG5cdFx0Zmxhbms6IGNmZy5mbGFuaywgXG5cdFx0bGVuZ3RoOiBjZmcubGVuZ3RoLCBcblx0XHRkZWx0YTogY2ZnLmRlbHRhIFxuXHQgICAgfTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLnpvb21WaWV3LmhpZ2hsaWdodGVkID0gY2ZnLmhpZ2hsaWdodDtcblx0ICAgIHRoaXMuem9vbVZpZXcuZ2Vub21lcyA9IHRoaXMudkdlbm9tZXM7XG5cdCAgICB0aGlzLnpvb21WaWV3LmRtb2RlID0gY2ZnLmRtb2RlO1xuXHQgICAgdGhpcy56b29tVmlldy51cGRhdGUoKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLmdlbm9tZVZpZXcucmVkcmF3KCk7XG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuc2V0QnJ1c2hDb29yZHModGhpcy5jb29yZHMpO1xuXHQgICAgLy9cblx0ICAgIGlmICghcXVpZXRseSlcblx0ICAgICAgICB0aGlzLmNvbnRleHRDaGFuZ2VkKCk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5zaG93QnVzeShmYWxzZSk7XG5cdH0pO1xuXHRyZXR1cm4gcDtcbiAgICB9XG4gXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0Q29vcmRpbmF0ZXMgKHN0cikge1xuXHRsZXQgY29vcmRzID0gcGFyc2VDb29yZHMoc3RyKTtcblx0aWYgKCEgY29vcmRzKSB7XG5cdCAgICBsZXQgZmVhdHMgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlMYWJlbChzdHIpO1xuXHQgICAgbGV0IGZlYXRzMiA9IGZlYXRzLmZpbHRlcihmPT5mLmdlbm9tZSA9PSB0aGlzLnJHZW5vbWUpO1xuXHQgICAgbGV0IGYgPSBmZWF0czJbMF0gfHwgZmVhdHNbMF07XG5cdCAgICBpZiAoZikge1xuXHRcdGNvb3JkcyA9IHtcblx0XHQgICAgcmVmOiBmLmdlbm9tZS5uYW1lLFxuXHRcdCAgICBsYW5kbWFyazogc3RyLFxuXHRcdCAgICBoaWdobGlnaHQ6IGYuaWRcblx0XHR9XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRhbGVydChcIlVuYWJsZSB0byBzZXQgY29vcmRpbmF0ZXMgd2l0aCB0aGlzIHZhbHVlOiBcIiArIHN0cik7XG5cdFx0cmV0dXJuO1xuXHQgICAgfVxuXHR9XG5cdHRoaXMuc2V0Q29udGV4dChjb29yZHMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlc2l6ZSAoKSB7XG5cdGxldCB3ID0gd2luZG93LmlubmVyV2lkdGggLSAyNDtcblx0dGhpcy5nZW5vbWVWaWV3LmZpdFRvV2lkdGgodyk7XG5cdHRoaXMuem9vbVZpZXcuZml0VG9XaWR0aCh3KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgY3VycmVudCBjb250ZXh0IGFzIGEgcGFyYW1ldGVyIHN0cmluZ1xuICAgIC8vIEN1cnJlbnQgY29udGV4dCA9IHJlZiBnZW5vbWUgKyBjb21wIGdlbm9tZXMgKyBjdXJyZW50IHJhbmdlIChjaHIsc3RhcnQsZW5kKVxuICAgIGdldFBhcmFtU3RyaW5nICgpIHtcblx0bGV0IGMgPSB0aGlzLmdldENvbnRleHQoKTtcbiAgICAgICAgbGV0IHJlZiA9IGByZWY9JHtjLnJlZn1gO1xuICAgICAgICBsZXQgZ2Vub21lcyA9IGBnZW5vbWVzPSR7Yy5nZW5vbWVzLmpvaW4oXCIrXCIpfWA7XG5cdGxldCBjb29yZHMgPSBgY2hyPSR7Yy5jaHJ9JnN0YXJ0PSR7Yy5zdGFydH0mZW5kPSR7Yy5lbmR9YDtcblx0bGV0IGxmbGYgPSBjLmZsYW5rID8gJyZmbGFuaz0nK2MuZmxhbmsgOiAnJmxlbmd0aD0nK2MubGVuZ3RoO1xuXHRsZXQgbGNvb3JkcyA9IGBsYW5kbWFyaz0ke2MubGFuZG1hcmt9JmRlbHRhPSR7Yy5kZWx0YX0ke2xmbGZ9YDtcblx0bGV0IGhscyA9IGBoaWdobGlnaHQ9JHtjLmhpZ2hsaWdodC5qb2luKFwiK1wiKX1gO1xuXHRsZXQgZG1vZGUgPSBgZG1vZGU9JHtjLmRtb2RlfWA7XG5cdHJldHVybiBgJHt0aGlzLmNtb2RlPT09J21hcHBlZCc/Y29vcmRzOmxjb29yZHN9JiR7ZG1vZGV9JiR7cmVmfSYke2dlbm9tZXN9JiR7aGxzfWA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGN1cnJlbnRMaXN0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Vyckxpc3Q7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldCBjdXJyZW50TGlzdCAobHN0KSB7XG4gICAgXHQvL1xuXHRsZXQgcHJldkxpc3QgPSB0aGlzLmN1cnJMaXN0O1xuXHR0aGlzLmN1cnJMaXN0ID0gbHN0O1xuXHQvL1xuXHRsZXQgbGlzdHMgPSBkMy5zZWxlY3QoJyNteWxpc3RzJykuc2VsZWN0QWxsKCcubGlzdEluZm8nKTtcblx0bGlzdHMuY2xhc3NlZChcImN1cnJlbnRcIiwgZCA9PiBkID09PSBsc3QpO1xuXHQvL1xuXHRpZiAobHN0KSB7XG5cdCAgICBpZiAobHN0ID09PSBwcmV2TGlzdClcblx0ICAgICAgICB0aGlzLmN1cnJMaXN0Q291bnRlciA9ICh0aGlzLmN1cnJMaXN0Q291bnRlciArIDEpICUgdGhpcy5jdXJyTGlzdC5pZHMubGVuZ3RoO1xuXHQgICAgZWxzZVxuXHQgICAgICAgIHRoaXMuY3Vyckxpc3RDb3VudGVyID0gMDtcblx0ICAgIGxldCBjdXJySWQgPSBsc3QuaWRzW3RoaXMuY3Vyckxpc3RDb3VudGVyXTtcblx0ICAgIC8vIHNob3cgdGhpcyBsaXN0IGFzIHRpY2sgbWFya3MgaW4gdGhlIGdlbm9tZSB2aWV3XG5cdCAgICB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzQnlJZCh0aGlzLnJHZW5vbWUsIGxzdC5pZHMpXG5cdFx0LnRoZW4oIGZlYXRzID0+IHtcblx0XHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdUaWNrcyhmZWF0cyk7XG5cdFx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3VGl0bGUoKTtcblx0XHQgICAgdGhpcy5zZXRDb29yZGluYXRlcyhjdXJySWQpO1xuXHRcdH0pO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy5jdXJyTGlzdENvdW50ZXIgPSAwO1xuXHQgICAgLy9cblx0ICAgIHRoaXMuem9vbVZpZXcuaGlGZWF0cyA9IHt9O1xuXHQgICAgdGhpcy56b29tVmlldy51cGRhdGUoKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd1RpY2tzKFtdKTtcblx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3VGl0bGUoKTtcblx0fVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFpvb21zIGluL291dCBieSBmYWN0b3IuIE5ldyB6b29tIHdpZHRoIGlzIGZhY3RvciAqIHRoZSBjdXJyZW50IHdpZHRoLlxuICAgIC8vIEZhY3RvciA+IDEgem9vbXMgb3V0LCAwIDwgZmFjdG9yIDwgMSB6b29tcyBpbi5cbiAgICB6b29tIChmYWN0b3IpIHtcblx0bGV0IGxlbiA9IHRoaXMuY29vcmRzLmVuZCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMTtcblx0bGV0IG5ld2xlbiA9IE1hdGgucm91bmQoZmFjdG9yICogbGVuKTtcblx0bGV0IHggPSAodGhpcy5jb29yZHMuc3RhcnQgKyB0aGlzLmNvb3Jkcy5lbmQpLzI7XG5cdGlmICh0aGlzLmNtb2RlID09PSAnbWFwcGVkJykge1xuXHQgICAgbGV0IG5ld3N0YXJ0ID0gTWF0aC5yb3VuZCh4IC0gbmV3bGVuLzIpO1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgY2hyOiB0aGlzLmNvb3Jkcy5jaHIsIHN0YXJ0OiBuZXdzdGFydCwgZW5kOiBuZXdzdGFydCArIG5ld2xlbiAtIDEgfSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICB0aGlzLnNldENvbnRleHQoeyBsZW5ndGg6IG5ld2xlbiB9KTtcblx0fVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFBhbnMgdGhlIHZpZXcgbGVmdCBvciByaWdodCBieSBmYWN0b3IuIFRoZSBkaXN0YW5jZSBtb3ZlZCBpcyBmYWN0b3IgdGltZXMgdGhlIGN1cnJlbnQgem9vbSB3aWR0aC5cbiAgICAvLyBOZWdhdGl2ZSB2YWx1ZXMgcGFuIGxlZnQuIFBvc2l0aXZlIHZhbHVlcyBwYW4gcmlnaHQuIChOb3RlIHRoYXQgcGFubmluZyBtb3ZlcyB0aGUgXCJjYW1lcmFcIi4gUGFubmluZyB0byB0aGVcbiAgICAvLyByaWdodCBtYWtlcyB0aGUgb2JqZWN0cyBpbiB0aGUgc2NlbmUgYXBwZWFyIHRvIG1vdmUgdG8gdGhlIGxlZnQsIGFuZCB2aWNlIHZlcnNhLilcbiAgICAvL1xuICAgIHBhbiAoZmFjdG9yKSB7XG5cdGxldCBjID0gdGhpcy5jb29yZHM7XG5cdGxldCBjaHIgPSB0aGlzLnJHZW5vbWUuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSB0aGlzLmNvb3Jkcy5jaHIpWzBdO1xuXHRsZXQgd2lkdGggPSBjLmVuZCAtIGMuc3RhcnQgKyAxO1xuXHRsZXQgbWluRCA9IC0oYy5zdGFydC0xKTtcblx0bGV0IG1heEQgPSBjaHIubGVuZ3RoIC0gYy5lbmQ7XG5cdGxldCBkID0gY2xpcChmYWN0b3IgKiB3aWR0aCwgbWluRCwgbWF4RCk7XG5cdGlmICh0aGlzLmNtb2RlID09PSAnbWFwcGVkJykge1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgY2hyOiBjLmNociwgc3RhcnQ6IGMuc3RhcnQrZCwgZW5kOiBjLmVuZCtkIH0pO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgZGVsdGE6IHRoaXMubGNvb3Jkcy5kZWx0YSArIGQgfSk7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RmVhdFR5cGVDb250cm9sIChmYWNldCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCBjb2xvcnMgPSB0aGlzLmNzY2FsZS5kb21haW4oKS5tYXAobGJsID0+IHtcblx0ICAgIHJldHVybiB7IGxibDpsYmwsIGNscjp0aGlzLmNzY2FsZShsYmwpIH07XG5cdH0pO1xuXHRsZXQgY2tlcyA9IGQzLnNlbGVjdChcIi5jb2xvcktleVwiKVxuXHQgICAgLnNlbGVjdEFsbCgnLmNvbG9yS2V5RW50cnknKVxuXHRcdC5kYXRhKGNvbG9ycyk7XG5cdGxldCBuY3MgPSBja2VzLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsIFwiY29sb3JLZXlFbnRyeSBmbGV4cm93XCIpO1xuXHRuY3MuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJzd2F0Y2hcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBjID0+IGMubGJsKVxuXHQgICAgLnN0eWxlKFwiYmFja2dyb3VuZC1jb2xvclwiLCBjID0+IGMuY2xyKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdGxldCB0ID0gZDMuc2VsZWN0KHRoaXMpO1xuXHQgICAgICAgIHQuY2xhc3NlZChcImNoZWNrZWRcIiwgISB0LmNsYXNzZWQoXCJjaGVja2VkXCIpKTtcblx0XHRsZXQgc3dhdGNoZXMgPSBkMy5zZWxlY3RBbGwoXCIuc3dhdGNoLmNoZWNrZWRcIilbMF07XG5cdFx0bGV0IGZ0cyA9IHN3YXRjaGVzLm1hcChzPT5zLmdldEF0dHJpYnV0ZShcIm5hbWVcIikpXG5cdFx0ZmFjZXQuc2V0VmFsdWVzKGZ0cyk7XG5cdFx0c2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0ICAgIH0pXG5cdCAgICAuYXBwZW5kKFwiaVwiKVxuXHQgICAgICAgIC5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zXCIpO1xuXHRuY3MuYXBwZW5kKFwic3BhblwiKVxuXHQgICAgLnRleHQoYyA9PiBjLmxibCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGlua1RvTWdpU25wUmVwb3J0ICgpIHtcblx0bGV0IGMgPSB0aGlzLmdldENvbnRleHQoKTtcblx0bGV0IHVybEJhc2UgPSAnaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL3NucC9zdW1tYXJ5Jztcblx0bGV0IHRhYkFyZyA9ICdzZWxlY3RlZFRhYj0xJztcblx0bGV0IHNlYXJjaEJ5QXJnID0gJ3NlYXJjaEJ5U2FtZURpZmY9Jztcblx0bGV0IGNockFyZyA9IGBzZWxlY3RlZENocm9tb3NvbWU9JHtjLmNocn1gO1xuXHRsZXQgY29vcmRBcmcgPSBgY29vcmRpbmF0ZT0ke2Muc3RhcnR9LSR7Yy5lbmR9YDtcblx0bGV0IHVuaXRBcmcgPSAnY29vcmRpbmF0ZVVuaXQ9YnAnO1xuXHRsZXQgY3NBcmdzID0gYy5nZW5vbWVzLm1hcChnID0+IGBzZWxlY3RlZFN0cmFpbnM9JHtnfWApXG5cdGxldCByc0FyZyA9IGByZWZlcmVuY2VTdHJhaW49JHtjLnJlZn1gO1xuXHRsZXQgbGlua1VybCA9IGAke3VybEJhc2V9PyR7dGFiQXJnfSYke3NlYXJjaEJ5QXJnfSYke2NockFyZ30mJHtjb29yZEFyZ30mJHt1bml0QXJnfSYke3JzQXJnfSYke2NzQXJncy5qb2luKCcmJyl9YFxuXHR3aW5kb3cub3BlbihsaW5rVXJsLCBcIl9ibGFua1wiKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGlua1RvTWdpUVRMcyAoKSB7XG5cdGxldCBjICAgICAgICA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRsZXQgdXJsQmFzZSAgPSAnaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL2FsbGVsZS9zdW1tYXJ5Jztcblx0bGV0IGNockFyZyAgID0gYGNocm9tb3NvbWU9JHtjLmNocn1gO1xuXHRsZXQgY29vcmRBcmcgPSBgY29vcmRpbmF0ZT0ke2Muc3RhcnR9LSR7Yy5lbmR9YDtcblx0bGV0IHVuaXRBcmcgID0gJ2Nvb3JkVW5pdD1icCc7XG5cdGxldCB0eXBlQXJnICA9ICdhbGxlbGVUeXBlPVFUTCc7XG5cdGxldCBsaW5rVXJsICA9IGAke3VybEJhc2V9PyR7Y2hyQXJnfSYke2Nvb3JkQXJnfSYke3VuaXRBcmd9JiR7dHlwZUFyZ31gO1xuXHR3aW5kb3cub3BlbihsaW5rVXJsLCBcIl9ibGFua1wiKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGlua1RvTWdpSkJyb3dzZSAoKSB7XG5cdGxldCBjID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdGxldCB1cmxCYXNlID0gJ2h0dHA6Ly9qYnJvd3NlLmluZm9ybWF0aWNzLmpheC5vcmcvJztcblx0bGV0IGRhdGFBcmcgPSAnZGF0YT1kYXRhJTJGbW91c2UnOyAvLyBcImRhdGEvbW91c2VcIlxuXHRsZXQgbG9jQXJnICA9IGBsb2M9Y2hyJHtjLmNocn0lM0Eke2Muc3RhcnR9Li4ke2MuZW5kfWA7XG5cdGxldCB0cmFja3MgID0gWydETkEnLCdNR0lfR2Vub21lX0ZlYXR1cmVzJywnTkNCSV9DQ0RTJywnTkNCSScsJ0VOU0VNQkwnXTtcblx0bGV0IHRyYWNrc0FyZz1gdHJhY2tzPSR7dHJhY2tzLmpvaW4oJywnKX1gO1xuXHRsZXQgaGlnaGxpZ2h0QXJnID0gJ2hpZ2hsaWdodD0nO1xuXHRsZXQgbGlua1VybCA9IGAke3VybEJhc2V9PyR7IFtkYXRhQXJnLGxvY0FyZyx0cmFja3NBcmcsaGlnaGxpZ2h0QXJnXS5qb2luKCcmJykgfWA7XG5cdHdpbmRvdy5vcGVuKGxpbmtVcmwsIFwiX2JsYW5rXCIpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIE1HVkFwcFxuXG5leHBvcnQgeyBNR1ZBcHAgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL01HVkFwcC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBHZW5vbWUge1xuICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG4gICAgdGhpcy5uYW1lID0gY2ZnLm5hbWU7XG4gICAgdGhpcy5sYWJlbD0gY2ZnLmxhYmVsO1xuICAgIHRoaXMuY2hyb21vc29tZXMgPSBbXTtcbiAgICB0aGlzLm1heGxlbiA9IC0xO1xuICAgIHRoaXMueHNjYWxlID0gbnVsbDtcbiAgICB0aGlzLnlzY2FsZSA9IG51bGw7XG4gICAgdGhpcy56b29tWSAgPSAtMTtcbiAgfVxuICBnZXRDaHJvbW9zb21lIChuKSB7XG4gICAgICBpZiAodHlwZW9mKG4pID09PSAnc3RyaW5nJylcblx0ICByZXR1cm4gdGhpcy5jaHJvbW9zb21lcy5maWx0ZXIoYyA9PiBjLm5hbWUgPT09IG4pWzBdO1xuICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiB0aGlzLmNocm9tb3NvbWVzW25dO1xuICB9XG4gIGhhc0Nocm9tb3NvbWUgKG4pIHtcbiAgICAgIHJldHVybiB0aGlzLmdldENocm9tb3NvbWUobikgPyB0cnVlIDogZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IHsgR2Vub21lIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9HZW5vbWUuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtkM2pzb24sIG92ZXJsYXBzLCBzdWJ0cmFjdH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge0ZlYXR1cmV9IGZyb20gJy4vRmVhdHVyZSc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSG93IHRoZSBhcHAgbG9hZHMgZmVhdHVyZSBkYXRhLiBQcm92aWRlcyB0d28gY2FsbHM6XG4vLyAgIC0gZ2V0IGZlYXR1cmVzIGluIHJhbmdlXG4vLyAgIC0gZ2V0IGZlYXR1cmVzIGJ5IGlkXG4vLyBSZXF1ZXN0cyBmZWF0dXJlcyBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHJlZ2lzdGVycyB0aGVtIGluIGEgY2FjaGUuXG4vLyBJbnRlcmFjdHMgd2l0aCB0aGUgYmFjayBlbmQgdG8gbG9hZCBmZWF0dXJlczsgdHJpZXMgbm90IHRvIHJlcXVlc3Rcbi8vIHRoZSBzYW1lIHJlZ2lvbiB0d2ljZS5cbi8vXG5jbGFzcyBGZWF0dXJlTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICAgICAgdGhpcy5pZDJmZWF0ID0ge307XHRcdC8vIGluZGV4IGZyb20gIGZlYXR1cmUgSUQgdG8gZmVhdHVyZVxuXHR0aGlzLmNhbm9uaWNhbDJmZWF0cyA9IHt9O1x0Ly8gaW5kZXggZnJvbSBjYW5vbmljYWwgSUQgLT4gWyBmZWF0dXJlcyB0YWdnZWQgd2l0aCB0aGF0IGlkIF1cblx0dGhpcy5zeW1ib2wyZmVhdHMgPSB7fVx0XHQvLyBpbmRleCBmcm9tIHN5bWJvbCAtPiBbIGZlYXR1cmVzIGhhdmluZyB0aGF0IHN5bWJvbCBdXG5cdHRoaXMuY2FjaGUgPSB7fTtcdFx0Ly8ge2dlbm9tZS5uYW1lIC0+IHtjaHIubmFtZSAtPiBsaXN0IG9mIGJsb2Nrc319XG5cdHRoaXMubWluZUZlYXR1cmVDYWNoZSA9IHt9O1x0Ly8gYXV4aWxpYXJ5IGluZm8gcHVsbGVkIGZyb20gTW91c2VNaW5lIFxuXHR0aGlzLmxvYWRlZEdlbm9tZXMgPSBuZXcgU2V0KCk7IC8vIHRoZSBzZXQgb2YgR2Vub21lcyB0aGF0IGhhdmUgYmVlbiBmdWxseSBsb2FkZWRcbiAgICB9XG4gXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUHJvY2Vzc2VzIHRoZSBcInJhd1wiIGZlYXR1cmVzIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgLy8gVHVybnMgdGhlbSBpbnRvIEZlYXR1cmUgb2JqZWN0cyBhbmQgcmVnaXN0ZXJzIHRoZW0uXG4gICAgLy8gSWYgdGhlIHNhbWUgcmF3IGZlYXR1cmUgaXMgcmVnaXN0ZXJlZCBhZ2FpbixcbiAgICAvLyB0aGUgRmVhdHVyZSBvYmplY3QgY3JlYXRlZCB0aGUgZmlyc3QgdGltZSBpcyByZXR1cm5lZC5cbiAgICAvLyAoSS5lLiwgcmVnaXN0ZXJpbmcgdGhlIHNhbWUgZmVhdHVyZSBtdWx0aXBsZSB0aW1lcyBpcyBvaylcbiAgICAvL1xuICAgIHByb2Nlc3NGZWF0dXJlcyAoZmVhdHMsIGdlbm9tZSkge1xuXHRyZXR1cm4gZmVhdHMubWFwKGQgPT4ge1xuXHQgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgdGhpcyBvbmUgaW4gdGhlIGNhY2hlLCByZXR1cm4gaXQuXG5cdCAgICBsZXQgZiA9IHRoaXMuaWQyZmVhdFtkLm1ncGlkXTtcblx0ICAgIGlmIChmKSByZXR1cm4gZjtcblx0ICAgIC8vIENyZWF0ZSBhIG5ldyBGZWF0dXJlXG5cdCAgICBkLmdlbm9tZSA9IGdlbm9tZVxuXHQgICAgZiA9IG5ldyBGZWF0dXJlKGQpO1xuXHQgICAgLy8gUmVnaXN0ZXIgaXQuXG5cdCAgICB0aGlzLmlkMmZlYXRbZi5tZ3BpZF0gPSBmO1xuXHQgICAgaWYgKGYubWdpaWQgJiYgZi5tZ2lpZCAhPT0gJy4nKSB7XG5cdFx0bGV0IGxzdCA9IHRoaXMuY2Fub25pY2FsMmZlYXRzW2YubWdpaWRdID0gKHRoaXMuY2Fub25pY2FsMmZlYXRzW2YubWdpaWRdIHx8IFtdKTtcblx0XHRsc3QucHVzaChmKTtcblx0ICAgIH1cblx0ICAgIGlmIChmLnN5bWJvbCAmJiBmLnN5bWJvbCAhPT0gJy4nKSB7XG5cdFx0bGV0IGxzdCA9IHRoaXMuc3ltYm9sMmZlYXRzW2Yuc3ltYm9sXSA9ICh0aGlzLnN5bWJvbDJmZWF0c1tmLnN5bWJvbF0gfHwgW10pO1xuXHRcdGxzdC5wdXNoKGYpO1xuXHQgICAgfVxuXHQgICAgLy8gaGVyZSB5J2dvLlxuXHQgICAgcmV0dXJuIGY7XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJlZ2lzdGVycyBhbiBpbmRleCBibG9jayBmb3IgdGhlIGdpdmVuIGdlbm9tZS4gQW4gaW5kZXggYmxvY2tcbiAgICAvLyBpcyBhIGNvbnRpZ3VvdXMgY2h1bmsgb2YgZmVhdHVlcyBmcm9tIHRoZSBHRkYgZmlsZSBmb3IgdGhhdCBnZW5vbWUuXG4gICAgLy8gUmVnaXN0ZXJpbmcgdGhlIHNhbWUgYmxvY2sgbXVsdGlwbGUgdGltZXMgaXMgb2sgLSBzdWNjZXNzaXZlIHRpbWVzXG4gICAgLy8gaGF2ZSBubyBlZmZlY3QuXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vICAgQWRkcyB0aGUgYmxvY2sgdG8gdGhlIGNhY2hlXG4gICAgLy8gICBSZXBsYWNlcyBlYWNoIHJhdyBmZWF0dXJlIGluIHRoZSBibG9jayB3aXRoIGEgRmVhdHVyZSBvYmplY3QuXG4gICAgLy8gICBSZWdpc3RlcnMgbmV3IEZlYXR1cmVzIGluIGEgbG9va3VwLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICBnZW5vbWUgKG9iamVjdCkgVGhlIGdlbm9tZSB0aGUgYmxvY2sgaXMgZm9yLFxuICAgIC8vICAgYmxrIChvYmplY3QpIEFuIGluZGV4IGJsb2NrLCB3aGljaCBoYXMgYSBjaHIsIHN0YXJ0LCBlbmQsXG4gICAgLy8gICBcdGFuZCBhIGxpc3Qgb2YgXCJyYXdcIiBmZWF0dXJlIG9iamVjdHMuXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgIG5vdGhpbmdcbiAgICAvL1xuICAgIF9yZWdpc3RlckJsb2NrIChnZW5vbWUsIGJsaykge1xuXHQvLyBnZW5vbWUgY2FjaGVcbiAgICAgICAgbGV0IGdjID0gdGhpcy5jYWNoZVtnZW5vbWUubmFtZV0gPSAodGhpcy5jYWNoZVtnZW5vbWUubmFtZV0gfHwge30pO1xuXHQvLyBjaHJvbW9zb21lIGNhY2hlICh3L2luIGdlbm9tZSlcblx0bGV0IGNjID0gZ2NbYmxrLmNocl0gPSAoZ2NbYmxrLmNocl0gfHwgW10pO1xuXHRpZiAoY2MuZmlsdGVyKGIgPT4gYi5pZCA9PT0gYmxrLmlkKS5sZW5ndGggPT09IDApIHtcblx0ICAgIGJsay5mZWF0dXJlcyA9IHRoaXMucHJvY2Vzc0ZlYXR1cmVzKCBibGsuZmVhdHVyZXMsIGdlbm9tZSApO1xuXHQgICAgYmxrLmdlbm9tZSA9IGdlbm9tZTtcblx0ICAgIGNjLnB1c2goYmxrKTtcblx0ICAgIGNjLnNvcnQoIChhLGIpID0+IGEuc3RhcnQgLSBiLnN0YXJ0ICk7XG5cdH1cblx0Ly9lbHNlXG5cdCAgICAvL2NvbnNvbGUubG9nKFwiU2tpcHBlZCBibG9jay4gQWxyZWFkeSBzZWVuLlwiLCBnZW5vbWUubmFtZSwgYmxrLmlkKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSByZW1haW5kZXIgb2YgdGhlIGdpdmVuIHJhbmdlIGFmdGVyXG4gICAgLy8gc3VidHJhY3RpbmcgdGhlIGFscmVhZHktZW5zdXJlZCByYW5nZXMuXG4gICAgLy8gXG4gICAgX3N1YnRyYWN0UmFuZ2UoZ2Vub21lLCByYW5nZSl7XG5cdGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdO1xuXHRpZiAoIWdjKSB0aHJvdyBcIk5vIHN1Y2ggZ2Vub21lOiBcIiArIGdlbm9tZS5uYW1lO1xuXHRsZXQgZ0Jsa3MgPSBnY1tyYW5nZS5jaHJdIHx8IFtdO1xuXHRsZXQgYW5zID0gW107XG5cdGxldCBybmcgPSByYW5nZTtcblx0Z0Jsa3MuZm9yRWFjaCggYiA9PiB7XG5cdCAgICBsZXQgc3ViID0gcm5nID8gc3VidHJhY3QoIHJuZywgYiApIDogW107XG5cdCAgICBpZiAoc3ViLmxlbmd0aCA9PT0gMClcblx0ICAgICAgICBybmcgPSBudWxsO1xuXHQgICAgaWYgKHN1Yi5sZW5ndGggPT09IDEpXG5cdCAgICAgICAgcm5nID0gc3ViWzBdO1xuXHQgICAgZWxzZSBpZiAoc3ViLmxlbmd0aCA9PT0gMil7XG5cdCAgICAgICAgYW5zLnB1c2goc3ViWzBdKTtcblx0XHRybmcgPSBzdWJbMV07XG5cdCAgICB9XG5cdH0pXG5cdHJuZyAmJiBhbnMucHVzaChybmcpO1xuXHRhbnMuc29ydCggKGEsYikgPT4gYS5zdGFydCAtIGIuc3RhcnQgKTtcblx0cmV0dXJuIGFucztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ2FsbHMgc3VidHJhY3RSYW5nZSBmb3IgZWFjaCByYW5nZSBpbiB0aGUgbGlzdCBhbmQgcmV0dXJuc1xuICAgIC8vIHRoZSBhY2N1bXVsYXRlZCByZXN1bHRzLlxuICAgIC8vXG4gICAgX3N1YnRyYWN0UmFuZ2VzKGdlbm9tZSwgcmFuZ2VzKSB7XG5cdGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdO1xuXHRpZiAoIWdjKSByZXR1cm4gcmFuZ2VzO1xuXHRsZXQgbmV3cmFuZ2VzID0gW107XG5cdHJhbmdlcy5mb3JFYWNoKHIgPT4ge1xuXHQgICAgbmV3cmFuZ2VzID0gbmV3cmFuZ2VzLmNvbmNhdCh0aGlzLl9zdWJ0cmFjdFJhbmdlKGdlbm9tZSwgcikpO1xuXHR9LCB0aGlzKVxuXHRyZXR1cm4gbmV3cmFuZ2VzO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEVuc3VyZXMgdGhhdCBhbGwgZmVhdHVyZXMgaW4gdGhlIHNwZWNpZmllZCByYW5nZShzKSBpbiB0aGUgc3BlY2lmaWVkIGdlbm9tZVxuICAgIC8vIGFyZSBpbiB0aGUgY2FjaGUuIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdHJ1ZSB3aGVuIHRoZSBjb25kaXRpb24gaXMgbWV0LlxuICAgIF9lbnN1cmVGZWF0dXJlc0J5UmFuZ2UgKGdlbm9tZSwgcmFuZ2VzKSB7XG5cdGxldCBuZXdyYW5nZXMgPSB0aGlzLl9zdWJ0cmFjdFJhbmdlcyhnZW5vbWUsIHJhbmdlcyk7XG5cdGlmIChuZXdyYW5nZXMubGVuZ3RoID09PSAwKSBcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0bGV0IGNvb3Jkc0FyZyA9IG5ld3Jhbmdlcy5tYXAociA9PiBgJHtyLmNocn06JHtyLnN0YXJ0fS4uJHtyLmVuZH1gKS5qb2luKCcsJyk7XG5cdGxldCBkYXRhU3RyaW5nID0gYGdlbm9tZT0ke2dlbm9tZS5uYW1lfSZjb29yZHM9JHtjb29yZHNBcmd9YDtcblx0bGV0IHVybCA9IFwiLi9iaW4vZ2V0RmVhdHVyZXMuY2dpP1wiICsgZGF0YVN0cmluZztcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRjb25zb2xlLmxvZyhcIlJlcXVlc3Rpbmc6XCIsIGdlbm9tZS5uYW1lLCBuZXdyYW5nZXMpO1xuXHRyZXR1cm4gZDNqc29uKHVybCkudGhlbihmdW5jdGlvbihibG9ja3Mpe1xuXHQgICAgYmxvY2tzLmZvckVhY2goIGIgPT4gc2VsZi5fcmVnaXN0ZXJCbG9jayhnZW5vbWUsIGIpICk7XG5cdCAgICBzZWxmLmFwcC5zaG93U3RhdHVzKGBMb2FkZWQ6ICR7Z2Vub21lLm5hbWV9YCk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fSk7XG4gICAgfVxuIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIF9lbnN1cmVGZWF0dXJlc0J5R2Vub21lIChnZW5vbWUpIHtcblx0aWYoIHRoaXMubG9hZGVkR2Vub21lcy5oYXMoZ2Vub21lKSApXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgICBsZXQgcmFuZ2VzID0gZ2Vub21lLmNocm9tb3NvbWVzLm1hcChjID0+IHsgXG5cdCAgICByZXR1cm4geyBjaHI6IGMubmFtZSwgc3RhcnQ6IDEsIGVuZDogYy5sZW5ndGggfTtcblx0fSk7XG5cdHJldHVybiB0aGlzLl9lbnN1cmVGZWF0dXJlc0J5UmFuZ2UoZ2Vub21lLCByYW5nZXMpLnRoZW4oeD0+eyB0aGlzLmxvYWRlZEdlbm9tZXMuYWRkKGdlbm9tZSk7IHJldHVybiB0cnVlO30pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxvYWRHZW5vbWVzIChnZW5vbWVzKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChnZW5vbWVzLm1hcChnID0+IHRoaXMuX2Vuc3VyZUZlYXR1cmVzQnlHZW5vbWUgKGcpKSkudGhlbigoKT0+dHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgX2dldENhY2hlZEZlYXR1cmVzIChnZW5vbWUsIHJhbmdlKSB7XG4gICAgICAgIGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdIDtcblx0aWYgKCFnYykgcmV0dXJuIFtdO1xuXHRsZXQgY0Jsb2NrcyA9IGdjW3JhbmdlLmNocl07XG5cdGlmICghY0Jsb2NrcykgcmV0dXJuIFtdO1xuXHRsZXQgZmVhdHMgPSBjQmxvY2tzXG5cdCAgICAuZmlsdGVyKGNiID0+IG92ZXJsYXBzKGNiLCByYW5nZSkpXG5cdCAgICAubWFwKCBjYiA9PiBjYi5mZWF0dXJlcy5maWx0ZXIoIGYgPT4gb3ZlcmxhcHMoIGYsIHJhbmdlKSApIClcblx0ICAgIC5yZWR1Y2UoIChhY2MsIHZhbCkgPT4gYWNjLmNvbmNhdCh2YWwpLCBbXSk7XG4gICAgICAgIHJldHVybiBmZWF0cztcdFxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYWxsIGNhY2hlZCBmZWF0dXJlcyBoYXZpbmcgdGhlIGdpdmVuIGNhbm9uaWNhbCBpZC5cbiAgICBnZXRDYWNoZWRGZWF0dXJlQnlJZCAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQyZmVhdHNbaWRdO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYWxsIGNhY2hlZCBmZWF0dXJlcyBoYXZpbmcgdGhlIGdpdmVuIGNhbm9uaWNhbCBpZC5cbiAgICBnZXRDYWNoZWRGZWF0dXJlc0J5Q2Fub25pY2FsSWQgKGNpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW5vbmljYWwyZmVhdHNbY2lkXSB8fCBbXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgbGlzdCBvZiBmZWF0dXJlcyB0aGF0IG1hdGNoIHRoZSBnaXZlbiBsYWJlbCwgd2hpY2ggY2FuIGJlIGFuIGlkLCBjYW5vbmljYWwgaWQsIG9yIHN5bWJvbC5cbiAgICAvLyBJZiBnZW5vbWUgaXMgc3BlY2lmaWVkLCBsaW1pdCByZXN1bHRzIHRvIGZlYXR1cmVzIGZyb20gdGhhdCBnZW5vbWUuXG4gICAgLy8gXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsIChsYWJlbCwgZ2Vub21lKSB7XG5cdGxldCBmID0gdGhpcy5pZDJmZWF0W2xhYmVsXVxuXHRsZXQgZmVhdHMgPSBmID8gW2ZdIDogdGhpcy5jYW5vbmljYWwyZmVhdHNbbGFiZWxdIHx8IHRoaXMuc3ltYm9sMmZlYXRzW2xhYmVsXSB8fCBbXTtcblx0cmV0dXJuIGdlbm9tZSA/IGZlYXRzLmZpbHRlcihmPT4gZi5nZW5vbWUgPT09IGdlbm9tZSkgOiBmZWF0cztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIGZlYXR1cmVzIGluIFxuICAgIC8vIHRoZSBzcGVjaWZpZWQgcmFuZ2VzIG9mIHRoZSBzcGVjaWZpZWQgZ2Vub21lLlxuICAgIGdldEZlYXR1cmVzIChnZW5vbWUsIHJhbmdlcykge1xuXHRyZXR1cm4gdGhpcy5fZW5zdXJlRmVhdHVyZXNCeUdlbm9tZShnZW5vbWUpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByYW5nZXMuZm9yRWFjaCggciA9PiB7XG5cdCAgICAgICAgci5mZWF0dXJlcyA9IHRoaXMuX2dldENhY2hlZEZlYXR1cmVzKGdlbm9tZSwgcikgXG5cdFx0ci5nZW5vbWUgPSBnZW5vbWU7XG5cdCAgICB9KTtcblx0ICAgIHJldHVybiB7IGdlbm9tZSwgYmxvY2tzOnJhbmdlcyB9O1xuXHR9LmJpbmQodGhpcykpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIGZlYXR1cmVzIGhhdmluZyB0aGUgc3BlY2lmaWVkIGlkcyBmcm9tIHRoZSBzcGVjaWZpZWQgZ2Vub21lLlxuICAgIGdldEZlYXR1cmVzQnlJZCAoZ2Vub21lLCBpZHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Vuc3VyZUZlYXR1cmVzQnlHZW5vbWUoZ2Vub21lKS50aGVuKCAoKSA9PiB7XG5cdCAgICBsZXQgZmVhdHMgPSBbXTtcblx0ICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuXHQgICAgbGV0IGFkZGYgPSAoZikgPT4ge1xuXHRcdGlmIChmLmdlbm9tZSAhPT0gZ2Vub21lKSByZXR1cm47XG5cdFx0aWYgKHNlZW4uaGFzKGYuaWQpKSByZXR1cm47XG5cdFx0c2Vlbi5hZGQoZi5pZCk7XG5cdFx0ZmVhdHMucHVzaChmKTtcblx0ICAgIH07XG5cdCAgICBsZXQgYWRkID0gKGYpID0+IHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShmKSkgXG5cdFx0ICAgIGYuZm9yRWFjaChmZiA9PiBhZGRmKGZmKSk7XG5cdFx0ZWxzZVxuXHRcdCAgICBhZGRmKGYpO1xuXHQgICAgfTtcblx0ICAgIGZvciAobGV0IGkgb2YgaWRzKXtcblx0XHRsZXQgZiA9IHRoaXMuY2Fub25pY2FsMmZlYXRzW2ldIHx8IHRoaXMuaWQyZmVhdFtpXTtcblx0XHRmICYmIGFkZChmKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmZWF0cztcblx0fSk7XG4gICAgfVxuXG59IC8vIGVuZCBjbGFzcyBGZWF0dXJlIE1hbmFnZXJcblxuZXhwb3J0IHsgRmVhdHVyZU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZlYXR1cmVNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGluaXRPcHRMaXN0IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBBdXhEYXRhTWFuYWdlciB9IGZyb20gJy4vQXV4RGF0YU1hbmFnZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIFF1ZXJ5TWFuYWdlciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCBjZmcpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLmNmZyA9IGNmZztcblx0dGhpcy5hdXhEYXRhTWFuYWdlciA9IG5ldyBBdXhEYXRhTWFuYWdlcigpO1xuXHR0aGlzLnNlbGVjdCA9IG51bGw7XHQvLyBteSA8c2VsZWN0PiBlbGVtZW50XG5cdHRoaXMudGVybSA9IG51bGw7XHQvLyBteSA8aW5wdXQ+IGVsZW1lbnRcblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuXHR0aGlzLnNlbGVjdCA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwic2VhcmNodHlwZVwiXScpO1xuXHR0aGlzLnRlcm0gICA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwic2VhcmNodGVybVwiXScpO1xuXHQvL1xuXHR0aGlzLnRlcm0uYXR0cihcInBsYWNlaG9sZGVyXCIsIHRoaXMuY2ZnWzBdLnBsYWNlaG9sZGVyKVxuXHRpbml0T3B0TGlzdCh0aGlzLnNlbGVjdFswXVswXSwgdGhpcy5jZmcsIGM9PmMubWV0aG9kLCBjPT5jLmxhYmVsKTtcblx0Ly8gV2hlbiB1c2VyIGNoYW5nZXMgdGhlIHF1ZXJ5IHR5cGUgKHNlbGVjdG9yKSwgY2hhbmdlIHRoZSBwbGFjZWhvbGRlciB0ZXh0LlxuXHR0aGlzLnNlbGVjdC5vbihcImNoYW5nZVwiLCAoKSA9PiB7XG5cdCAgICBsZXQgb3B0ID0gdGhpcy5zZWxlY3QucHJvcGVydHkoXCJzZWxlY3RlZE9wdGlvbnNcIilbMF07XG5cdCAgICB0aGlzLnRlcm0uYXR0cihcInBsYWNlaG9sZGVyXCIsIG9wdC5fX2RhdGFfXy5wbGFjZWhvbGRlcilcblx0ICAgIFxuXHR9KTtcblx0Ly8gV2hlbiB1c2VyIGVudGVycyBhIHNlYXJjaCB0ZXJtLCBydW4gYSBxdWVyeVxuXHR0aGlzLnRlcm0ub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xuXHQgICAgbGV0IHRlcm0gPSB0aGlzLnRlcm0ucHJvcGVydHkoXCJ2YWx1ZVwiKTtcblx0ICAgIHRoaXMudGVybS5wcm9wZXJ0eShcInZhbHVlXCIsXCJcIik7XG5cdCAgICBsZXQgc2VhcmNoVHlwZSAgPSB0aGlzLnNlbGVjdC5wcm9wZXJ0eShcInZhbHVlXCIpO1xuXHQgICAgbGV0IGxzdE5hbWUgPSB0ZXJtO1xuXHQgICAgZDMuc2VsZWN0KFwiI215bGlzdHNcIikuY2xhc3NlZChcImJ1c3lcIix0cnVlKTsgLy8gRklYTUUgLSByZWFjaG92ZXJcblx0ICAgIHRoaXMuYXV4RGF0YU1hbmFnZXJbc2VhcmNoVHlwZV0odGVybSlcdC8vIDwtIHJ1biB0aGUgcXVlcnlcblx0ICAgICAgLnRoZW4oZmVhdHMgPT4ge1xuXHRcdCAgLy8gRklYTUUgLSByZWFjaG92ZXIgLSB0aGlzIHdob2xlIGhhbmRsZXJcblx0XHQgIGxldCBsc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5jcmVhdGVMaXN0KGxzdE5hbWUsIGZlYXRzLm1hcChmID0+IGYucHJpbWFyeUlkZW50aWZpZXIpKVxuXHRcdCAgdGhpcy5hcHAubGlzdE1hbmFnZXIudXBkYXRlKGxzdCk7XG5cdFx0ICAvL1xuXHRcdCAgdGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0cyA9IHt9O1xuXHRcdCAgZmVhdHMuZm9yRWFjaChmID0+IHRoaXMuYXBwLnpvb21WaWV3LmhpRmVhdHNbZi5tZ2lpZF0gPSBmLm1naWlkKTtcblx0XHQgIHRoaXMuYXBwLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHRcdCAgLy9cblx0XHQgIHRoaXMuYXBwLmN1cnJlbnRMaXN0ID0gbHN0O1xuXHRcdCAgLy9cblx0XHQgIGQzLnNlbGVjdChcIiNteWxpc3RzXCIpLmNsYXNzZWQoXCJidXN5XCIsZmFsc2UpO1xuXHQgICAgICB9KTtcblx0fSlcbiAgICB9XG59XG5cbmV4cG9ydCB7IFF1ZXJ5TWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvUXVlcnlNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGQzanNvbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEF1eERhdGFNYW5hZ2VyIC0ga25vd3MgaG93IHRvIHF1ZXJ5IGFuIGV4dGVybmFsIHNvdXJjZSAoaS5lLiwgTW91c2VNaW5lKSBmb3IgZ2VuZXNcbi8vIGFubm90YXRlZCB0byBkaWZmZXJlbnQgb250b2xvZ2llcy4gXG5jbGFzcyBBdXhEYXRhTWFuYWdlciB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0QXV4RGF0YSAocSkge1xuXHRsZXQgZm9ybWF0ID0gJ2pzb25vYmplY3RzJztcblx0bGV0IHF1ZXJ5ID0gZW5jb2RlVVJJQ29tcG9uZW50KHEpO1xuXHRsZXQgdXJsID0gYGh0dHA6Ly93d3cubW91c2VtaW5lLm9yZy9tb3VzZW1pbmUvc2VydmljZS9xdWVyeS9yZXN1bHRzP2Zvcm1hdD0ke2Zvcm1hdH0mcXVlcnk9JHtxdWVyeX1gO1xuXHRyZXR1cm4gZDNqc29uKHVybCkudGhlbihkYXRhID0+IGRhdGEucmVzdWx0c3x8W10pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGRvIGEgTE9PS1VQIHF1ZXJ5IGZvciBTZXF1ZW5jZUZlYXR1cmVzIGZyb20gTW91c2VNaW5lXG4gICAgZmVhdHVyZXNCeUxvb2t1cCAocXJ5U3RyaW5nKSB7XG5cdGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgICB2aWV3PVwiU2VxdWVuY2VGZWF0dXJlLnByaW1hcnlJZGVudGlmaWVyIFNlcXVlbmNlRmVhdHVyZS5zeW1ib2xcIiBcblx0ICAgIGxvbmdEZXNjcmlwdGlvbj1cIlwiIFxuXHQgICAgY29uc3RyYWludExvZ2ljPVwiQSBhbmQgQiBhbmQgQ1wiPlxuXHRcdDxjb25zdHJhaW50IGNvZGU9XCJBXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZVwiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdFx0PGNvbnN0cmFpbnQgY29kZT1cIkJcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9yZ2FuaXNtLnRheG9uSWRcIiBvcD1cIj1cIiB2YWx1ZT1cIjEwMDkwXCIvPlxuXHRcdDxjb25zdHJhaW50IGNvZGU9XCJDXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5zZXF1ZW5jZU9udG9sb2d5VGVybS5uYW1lXCIgb3A9XCIhPVwiIHZhbHVlPVwidHJhbnNnZW5lXCIvPlxuXHQgICAgPC9xdWVyeT5gO1xuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmZWF0dXJlc0J5T250b2xvZ3lUZXJtIChxcnlTdHJpbmcsIHRlcm1UeXBlKSB7XG4gICAgICAgIGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgdmlldz1cIlNlcXVlbmNlRmVhdHVyZS5wcmltYXJ5SWRlbnRpZmllciBTZXF1ZW5jZUZlYXR1cmUuc3ltYm9sXCIgbG9uZ0Rlc2NyaXB0aW9uPVwiXCIgc29ydE9yZGVyPVwiU2VxdWVuY2VGZWF0dXJlLnN5bWJvbCBhc2NcIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCIGFuZCBDXCI+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm1cIiB0eXBlPVwiJHt0ZXJtVHlwZX1cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm0ucGFyZW50c1wiIHR5cGU9XCIke3Rlcm1UeXBlfVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9udG9sb2d5QW5ub3RhdGlvbnMub250b2xvZ3lUZXJtLnBhcmVudHNcIiBvcD1cIkxPT0tVUFwiIHZhbHVlPVwiJHtxcnlTdHJpbmd9XCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiQlwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub3JnYW5pc20udGF4b25JZFwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJDXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5zZXF1ZW5jZU9udG9sb2d5VGVybS5uYW1lXCIgb3A9XCIhPVwiIHZhbHVlPVwidHJhbnNnZW5lXCIvPlxuXHQgIDwvcXVlcnk+YFxuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAobm90IGN1cnJlbnRseSBpbiB1c2UuLi4pXG4gICAgZmVhdHVyZXNCeVBhdGh3YXlUZXJtIChxcnlTdHJpbmcpIHtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICB2aWV3PVwiUGF0aHdheS5nZW5lcy5wcmltYXJ5SWRlbnRpZmllciBQYXRod2F5LmdlbmVzLnN5bWJvbFwiIGxvbmdEZXNjcmlwdGlvbj1cIlwiIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEJcIj5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlBhdGh3YXlcIiBjb2RlPVwiQVwiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJQYXRod2F5LmdlbmVzLm9yZ2FuaXNtLnRheG9uSWRcIiBjb2RlPVwiQlwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdCAgPC9xdWVyeT5gO1xuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmZWF0dXJlc0J5SWQgICAgICAgIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeUxvb2t1cChxcnlTdHJpbmcpOyB9XG4gICAgZmVhdHVyZXNCeUZ1bmN0aW9uICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBcIkdPVGVybVwiKTsgfVxuICAgIC8vZmVhdHVyZXNCeVBhdGh3YXkgICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlQYXRod2F5VGVybShxcnlTdHJpbmcpOyB9XG4gICAgZmVhdHVyZXNCeVBoZW5vdHlwZSAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBcIk1QVGVybVwiKTsgfVxuICAgIGZlYXR1cmVzQnlEaXNlYXNlICAgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5T250b2xvZ3lUZXJtKHFyeVN0cmluZywgXCJET1Rlcm1cIik7IH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbn1cblxuZXhwb3J0IHsgQXV4RGF0YU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0F1eERhdGFNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSAnLi9TdG9yYWdlTWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB9IGZyb20gJy4vTGlzdEZvcm11bGFFdmFsdWF0b3InO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE1haW50YWlucyBuYW1lZCBsaXN0cyBvZiBJRHMuIExpc3RzIG1heSBiZSB0ZW1wb3JhcnksIGxhc3Rpbmcgb25seSBmb3IgdGhlIHNlc3Npb24sIG9yIHBlcm1hbmVudCxcbi8vIGxhc3RpbmcgdW50aWwgdGhlIHVzZXIgY2xlYXJzIHRoZSBicm93c2VyIGxvY2FsIHN0b3JhZ2UgYXJlYS5cbi8vXG4vLyBVc2VzIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSBhbmQgd2luZG93LmxvY2FsU3RvcmFnZSB0byBzYXZlIGxpc3RzXG4vLyB0ZW1wb3JhcmlseSBvciBwZXJtYW5lbnRseSwgcmVzcC4gIEZJWE1FOiBzaG91bGQgYmUgdXNpbmcgd2luZG93LmluZGV4ZWREQlxuLy9cbmNsYXNzIExpc3RNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLm5hbWUybGlzdCA9IG51bGw7XG5cdHRoaXMuX2xpc3RzID0gbmV3IExvY2FsU3RvcmFnZU1hbmFnZXIgIChcImxpc3RNYW5hZ2VyLmxpc3RzXCIpXG5cdHRoaXMuZm9ybXVsYUV2YWwgPSBuZXcgTGlzdEZvcm11bGFFdmFsdWF0b3IodGhpcyk7XG5cdHRoaXMuX2xvYWQoKTtcblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuXHQvLyBCdXR0b246IHNob3cvaGlkZSB3YXJuaW5nIG1lc3NhZ2Vcblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbi53YXJuaW5nJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IHcgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cIm1lc3NhZ2VcIl0nKTtcblx0XHR3LmNsYXNzZWQoJ3Nob3dpbmcnLCAhdy5jbGFzc2VkKCdzaG93aW5nJykpO1xuXHQgICAgfSk7XG5cdC8vIEJ1dHRvbjogY3JlYXRlIGxpc3QgZnJvbSBjdXJyZW50IHNlbGVjdGlvblxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJuZXdmcm9tc2VsZWN0aW9uXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgaWRzID0gT2JqZWN0LmtleXModGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0cyk7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdFx0aWYgKGlkcy5sZW5ndGggPT09IDApIHtcblx0XHQgICAgYWxlcnQoXCJOb3RoaW5nIHNlbGVjdGVkLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbmV3bGlzdCA9IHRoaXMuY3JlYXRlTGlzdChcInNlbGVjdGlvblwiLCBpZHMpO1xuXHRcdHRoaXMudXBkYXRlKG5ld2xpc3QpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBjb21iaW5lIGxpc3RzOiBvcGVuIGxpc3QgZWRpdG9yIHdpdGggZm9ybXVsYSBlZGl0b3Igb3BlblxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJjb21iaW5lXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAodGhpcy5nZXROYW1lcygpLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vIGxpc3RzLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbGUgPSB0aGlzLmFwcC5saXN0RWRpdG9yO1xuXHRcdGxlLm9wZW4oKTtcblx0XHRsZS5vcGVuRm9ybXVsYUVkaXRvcigpO1xuXHQgICAgfSk7XG5cdC8vIEJ1dHRvbjogZGVsZXRlIGFsbCBsaXN0cyAoZ2V0IGNvbmZpcm1hdGlvbiBmaXJzdCkuXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cInB1cmdlXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAodGhpcy5nZXROYW1lcygpLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vIGxpc3RzLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0ICAgICAgICBpZiAod2luZG93LmNvbmZpcm0oXCJEZWxldGUgYWxsIGxpc3RzLiBBcmUgeW91IHN1cmU/XCIpKSB7XG5cdFx0ICAgIHRoaXMucHVyZ2UoKTtcblx0XHQgICAgdGhpcy51cGRhdGUoKTtcblx0XHR9XG5cdCAgICB9KTtcbiAgICB9XG4gICAgX2xvYWQgKCkge1xuXHR0aGlzLm5hbWUybGlzdCA9IHRoaXMuX2xpc3RzLmdldChcImFsbFwiKTtcblx0aWYgKCF0aGlzLm5hbWUybGlzdCl7XG5cdCAgICB0aGlzLm5hbWUybGlzdCA9IHt9O1xuXHQgICAgdGhpcy5fc2F2ZSgpO1xuXHR9XG4gICAgfVxuICAgIF9zYXZlICgpIHtcbiAgICAgICAgdGhpcy5fbGlzdHMucHV0KFwiYWxsXCIsIHRoaXMubmFtZTJsaXN0KTtcbiAgICB9XG4gICAgLy9cbiAgICAvLyByZXR1cm5zIHRoZSBuYW1lcyBvZiBhbGwgdGhlIGxpc3RzLCBzb3J0ZWRcbiAgICBnZXROYW1lcyAoKSB7XG4gICAgICAgIGxldCBubXMgPSBPYmplY3Qua2V5cyh0aGlzLm5hbWUybGlzdCk7XG5cdG5tcy5zb3J0KCk7XG5cdHJldHVybiBubXM7XG4gICAgfVxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZmYgYSBsaXN0IGV4aXN0cyB3aXRoIHRoaXMgbmFtZVxuICAgIGhhcyAobmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZSBpbiB0aGlzLm5hbWUybGlzdDtcbiAgICB9XG4gICAgLy8gSWYgbm8gbGlzdCB3aXRoIHRoZSBnaXZlbiBuYW1lIGV4aXN0cywgcmV0dXJuIHRoZSBuYW1lLlxuICAgIC8vIE90aGVyd2lzZSwgcmV0dXJuIGEgbW9kaWZpZWQgdmVyc2lvbiBvZiBuYW1lIHRoYXQgaXMgdW5pcXVlLlxuICAgIC8vIFVuaXF1ZSBuYW1lcyBhcmUgY3JlYXRlZCBieSBhcHBlbmRpbmcgYSBjb3VudGVyLlxuICAgIC8vIEUuZy4sIHVuaXF1aWZ5KFwiZm9vXCIpIC0+IFwiZm9vLjFcIiBvciBcImZvby4yXCIgb3Igd2hhdGV2ZXIuXG4gICAgLy9cbiAgICB1bmlxdWlmeSAobmFtZSkge1xuXHRpZiAoIXRoaXMuaGFzKG5hbWUpKSBcblx0ICAgIHJldHVybiBuYW1lO1xuXHRmb3IgKGxldCBpID0gMTsgOyBpICs9IDEpIHtcblx0ICAgIGxldCBubiA9IGAke25hbWV9LiR7aX1gO1xuXHQgICAgaWYgKCF0aGlzLmhhcyhubikpXG5cdCAgICAgICAgcmV0dXJuIG5uO1xuXHR9XG4gICAgfVxuICAgIC8vIHJldHVybnMgdGhlIGxpc3Qgd2l0aCB0aGlzIG5hbWUsIG9yIG51bGwgaWYgbm8gc3VjaCBsaXN0XG4gICAgZ2V0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLm5hbWUybGlzdFtuYW1lXTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIHJldHVybnMgYWxsIHRoZSBsaXN0cywgc29ydGVkIGJ5IG5hbWVcbiAgICBnZXRBbGwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXROYW1lcygpLm1hcChuID0+IHRoaXMuZ2V0KG4pKVxuICAgIH1cbiAgICAvLyBcbiAgICBjcmVhdGVPclVwZGF0ZSAobmFtZSwgaWRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMudXBkYXRlTGlzdChuYW1lLG51bGwsaWRzKSA6IHRoaXMuY3JlYXRlTGlzdChuYW1lLCBpZHMpO1xuICAgIH1cbiAgICAvLyBjcmVhdGVzIGEgbmV3IGxpc3Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgaWRzLlxuICAgIGNyZWF0ZUxpc3QgKG5hbWUsIGlkcywgZm9ybXVsYSkge1xuXHRpZiAobmFtZSAhPT0gXCJfXCIpXG5cdCAgICBuYW1lID0gdGhpcy51bmlxdWlmeShuYW1lKTtcblx0Ly9cblx0bGV0IGR0ID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMubmFtZTJsaXN0W25hbWVdID0ge1xuXHQgICAgbmFtZTogICAgIG5hbWUsXG5cdCAgICBpZHM6ICAgICAgaWRzLFxuXHQgICAgZm9ybXVsYTogIGZvcm11bGEgfHwgXCJcIixcblx0ICAgIGNyZWF0ZWQ6ICBkdCxcblx0ICAgIG1vZGlmaWVkOiBkdFxuXHR9O1xuXHR0aGlzLl9zYXZlKCk7XG5cdHJldHVybiB0aGlzLm5hbWUybGlzdFtuYW1lXTtcbiAgICB9XG4gICAgLy8gUHJvdmlkZSBhY2Nlc3MgdG8gZXZhbHVhdGlvbiBzZXJ2aWNlXG4gICAgZXZhbEZvcm11bGEgKGV4cHIpIHtcblx0cmV0dXJuIHRoaXMuZm9ybXVsYUV2YWwuZXZhbChleHByKTtcbiAgICB9XG4gICAgLy8gUmVmcmVzaGVzIGEgbGlzdCBhbmQgcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZWZyZXNoZWQgbGlzdC5cbiAgICAvLyBJZiB0aGUgbGlzdCBpZiBhIFBPTE8sIHByb21pc2UgcmVzb2x2ZXMgaW1tZWRpYXRlbHkgdG8gdGhlIGxpc3QuXG4gICAgLy8gT3RoZXJ3aXNlLCBzdGFydHMgYSByZWV2YWx1YXRpb24gb2YgdGhlIGZvcm11bGEgdGhhdCByZXNvbHZlcyBhZnRlciB0aGVcbiAgICAvLyBsaXN0J3MgaWRzIGhhdmUgYmVlbiB1cGRhdGVkLlxuICAgIC8vIElmIHRoZXJlIGlzIGFuIGVycm9yLCB0aGUgcmV0dXJuZWQgcHJvbWlzZSByZWplY3RzIHdpdGggdGhlIGVycm9yLlxuICAgIHJlZnJlc2hMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdGxzdC5tb2RpZmllZCA9IFwiXCIrbmV3IERhdGUoKTtcblx0aWYgKCFsc3QuZm9ybXVsYSlcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobHN0KTtcblx0ZWxzZSB7XG5cdCAgICBsZXQgcCA9IHRoaXMuZm9ybXVhbEV2YWwuZXZhbChsc3QuZm9ybXVsYSkudGhlbiggaWRzID0+IHtcblx0XHQgICAgbHN0LmlkcyA9IGlkcztcblx0XHQgICAgcmV0dXJuIGxzdDtcblx0XHR9KTtcblx0ICAgIHJldHVybiBwO1xuXHR9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlcyB0aGUgaWRzIGluIHRoZSBnaXZlbiBsaXN0XG4gICAgdXBkYXRlTGlzdCAobmFtZSwgbmV3bmFtZSwgbmV3aWRzLCBuZXdmb3JtdWxhKSB7XG5cdGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcbiAgICAgICAgaWYgKCEgbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuYW1lO1xuXHRpZiAobmV3bmFtZSkge1xuXHQgICAgZGVsZXRlIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXTtcblx0ICAgIGxzdC5uYW1lID0gdGhpcy51bmlxdWlmeShuZXduYW1lKTtcblx0ICAgIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXSA9IGxzdDtcblx0fVxuXHRpZiAobmV3aWRzKSBsc3QuaWRzICA9IG5ld2lkcztcblx0aWYgKG5ld2Zvcm11bGEgfHwgbmV3Zm9ybXVsYT09PVwiXCIpIGxzdC5mb3JtdWxhID0gbmV3Zm9ybXVsYTtcblx0bHN0Lm1vZGlmaWVkID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMuX3NhdmUoKTtcblx0cmV0dXJuIGxzdDtcbiAgICB9XG4gICAgLy8gZGVsZXRlcyB0aGUgc3BlY2lmaWVkIGxpc3RcbiAgICBkZWxldGVMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0ZGVsZXRlIHRoaXMubmFtZTJsaXN0W25hbWVdO1xuXHR0aGlzLl9zYXZlKCk7XG5cdC8vIEZJWE1FOiB1c2UgZXZlbnRzISFcblx0aWYgKGxzdCA9PT0gdGhpcy5hcHAuY3VycmVudExpc3QpIHRoaXMuYXBwLmN1cnJlbnRMaXN0ID0gbnVsbDtcblx0aWYgKGxzdCA9PT0gdGhpcy5hcHAubGlzdEVkaXRvci5saXN0KSB0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QgPSBudWxsO1xuXHRyZXR1cm4gbHN0O1xuICAgIH1cbiAgICAvLyBkZWxldGUgYWxsIGxpc3RzXG4gICAgcHVyZ2UgKCkge1xuICAgICAgICB0aGlzLm5hbWUybGlzdCA9IHt9XG5cdHRoaXMuX3NhdmUoKTtcblx0Ly9cblx0dGhpcy5hcHAuY3VycmVudExpc3QgPSBudWxsO1xuXHR0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QgPSBudWxsOyAvLyBGSVhNRSAtIHJlYWNoYWNyb3NzXG4gICAgfVxuICAgIC8vIFJldHVybnMgdHJ1ZSBpZmYgZXhwciBpcyB2YWxpZCwgd2hpY2ggbWVhbnMgaXQgaXMgYm90aCBzeW50YWN0aWNhbGx5IGNvcnJlY3QgXG4gICAgLy8gYW5kIGFsbCBtZW50aW9uZWQgbGlzdHMgZXhpc3QuXG4gICAgaXNWYWxpZCAoZXhwcikge1xuXHRyZXR1cm4gdGhpcy5mb3JtdWxhRXZhbC5pc1ZhbGlkKGV4cHIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIHRoZSBcIk15IGxpc3RzXCIgYm94IHdpdGggdGhlIGN1cnJlbnRseSBhdmFpbGFibGUgbGlzdHMuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgIG5ld2xpc3QgKExpc3QpIG9wdGlvbmFsLiBJZiBzcGVjaWZpZWQsIHdlIGp1c3QgY3JlYXRlZCB0aGF0IGxpc3QsIGFuZCBpdHMgbmFtZSBpc1xuICAgIC8vICAgXHRhIGdlbmVyYXRlZCBkZWZhdWx0LiBQbGFjZSBmb2N1cyB0aGVyZSBzbyB1c2VyIGNhbiB0eXBlIG5ldyBuYW1lLlxuICAgIHVwZGF0ZSAobmV3bGlzdCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBsaXN0cyA9IHRoaXMuZ2V0QWxsKCk7XG5cdGxldCBieU5hbWUgPSAoYSxiKSA9PiB7XG5cdCAgICBsZXQgYW4gPSBhLm5hbWUudG9Mb3dlckNhc2UoKTtcblx0ICAgIGxldCBibiA9IGIubmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgcmV0dXJuIChhbiA8IGJuID8gLTEgOiBhbiA+IGJuID8gKzEgOiAwKTtcblx0fTtcblx0bGV0IGJ5RGF0ZSA9IChhLGIpID0+ICgobmV3IERhdGUoYi5tb2RpZmllZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLm1vZGlmaWVkKSkuZ2V0VGltZSgpKTtcblx0bGlzdHMuc29ydChieU5hbWUpO1xuXHRsZXQgaXRlbXMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImxpc3RzXCJdJykuc2VsZWN0QWxsKFwiLmxpc3RJbmZvXCIpXG5cdCAgICAuZGF0YShsaXN0cyk7XG5cdGxldCBuZXdpdGVtcyA9IGl0ZW1zLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJsaXN0SW5mbyBmbGV4cm93XCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcImlcIikuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29ucyBidXR0b25cIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLFwiZWRpdFwiKVxuXHQgICAgLnRleHQoXCJtb2RlX2VkaXRcIilcblx0ICAgIC5hdHRyKFwidGl0bGVcIixcIkVkaXQgdGhpcyBsaXN0LlwiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJzcGFuXCIpLmF0dHIoXCJuYW1lXCIsXCJuYW1lXCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcInNpemVcIik7XG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcImRhdGVcIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwiaVwiKS5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zIGJ1dHRvblwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJkZWxldGVcIilcblx0ICAgIC50ZXh0KFwiaGlnaGxpZ2h0X29mZlwiKVxuXHQgICAgLmF0dHIoXCJ0aXRsZVwiLFwiRGVsZXRlIHRoaXMgbGlzdC5cIik7XG5cblx0aWYgKG5ld2l0ZW1zWzBdWzBdKSB7XG5cdCAgICBsZXQgbGFzdCA9IG5ld2l0ZW1zWzBdW25ld2l0ZW1zWzBdLmxlbmd0aC0xXTtcblx0ICAgIGxhc3Quc2Nyb2xsSW50b1ZpZXcoKTtcblx0fVxuXG5cdGl0ZW1zXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgbHN0PT5sc3QubmFtZSlcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChsc3QpIHtcblx0XHRpZiAoZDMuZXZlbnQuYWx0S2V5KSB7XG5cdFx0ICAgIGxldCBsZSA9IHNlbGYuYXBwLmxpc3RFZGl0b3I7IC8vIEZJWE1FIHJlYWNob3ZlclxuXHRcdCAgICBsZXQgcyA9IGxzdC5uYW1lO1xuXHRcdCAgICBsZXQgcmUgPSAvWyA9KCkrKi1dLztcblx0XHQgICAgaWYgKHMuc2VhcmNoKHJlKSA+PSAwKVxuXHRcdFx0cyA9ICdcIicgKyBzICsgJ1wiJztcblx0XHQgICAgaWYgKCFsZS5pc0VkaXRpbmdGb3JtdWxhKSB7XG5cdFx0ICAgICAgICBsZS5vcGVuKCk7XG5cdFx0XHRsZS5vcGVuRm9ybXVsYUVkaXRvcigpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vXG5cdFx0ICAgIGxlLmFkZFRvTGlzdEV4cHIocysnICcpO1xuXHRcdH1cblx0XHQvLyBvdGhlcndpc2UsIHNldCB0aGlzIGFzIHRoZSBjdXJyZW50IGxpc3Rcblx0XHRlbHNlIFxuXHRcdCAgICBzZWxmLmFwcC5jdXJyZW50TGlzdCA9IGxzdDsgLy8gRklYTUUgcmVhY2hvdmVyXG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJlZGl0XCJdJylcblx0ICAgIC8vIGVkaXQ6IGNsaWNrIFxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24obHN0KSB7XG5cdCAgICAgICAgc2VsZi5hcHAubGlzdEVkaXRvci5vcGVuKGxzdCk7XG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCdzcGFuW25hbWU9XCJuYW1lXCJdJylcblx0ICAgIC50ZXh0KGxzdCA9PiBsc3QubmFtZSk7XG5cdGl0ZW1zLnNlbGVjdCgnc3BhbltuYW1lPVwiZGF0ZVwiXScpLnRleHQobHN0ID0+IHtcblx0ICAgIGxldCBtZCA9IG5ldyBEYXRlKGxzdC5tb2RpZmllZCk7XG5cdCAgICBsZXQgZCA9IGAke21kLmdldEZ1bGxZZWFyKCl9LSR7bWQuZ2V0TW9udGgoKSsxfS0ke21kLmdldERhdGUoKX0gYCBcblx0ICAgICAgICAgICsgYDoke21kLmdldEhvdXJzKCl9LiR7bWQuZ2V0TWludXRlcygpfS4ke21kLmdldFNlY29uZHMoKX1gO1xuXHQgICAgcmV0dXJuIGQ7XG5cdH0pO1xuXHRpdGVtcy5zZWxlY3QoJ3NwYW5bbmFtZT1cInNpemVcIl0nKS50ZXh0KGxzdCA9PiBsc3QuaWRzLmxlbmd0aCk7XG5cdGl0ZW1zLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZGVsZXRlXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsIGxzdCA9PiB7XG5cdCAgICAgICAgdGhpcy5kZWxldGVMaXN0KGxzdC5uYW1lKTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXG5cdFx0Ly8gTm90IHN1cmUgd2h5IHRoaXMgaXMgbmVjZXNzYXJ5IGhlcmUuIEJ1dCB3aXRob3V0IGl0LCB0aGUgbGlzdCBpdGVtIGFmdGVyIHRoZSBvbmUgYmVpbmdcblx0XHQvLyBkZWxldGVkIGhlcmUgd2lsbCByZWNlaXZlIGEgY2xpY2sgZXZlbnQuXG5cdFx0ZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0Ly9cblx0ICAgIH0pO1xuXG5cdC8vXG5cdGl0ZW1zLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0aWYgKG5ld2xpc3QpIHtcblx0ICAgIGxldCBsc3RlbHQgPSBcblx0ICAgICAgICBkMy5zZWxlY3QoYCNteWxpc3RzIFtuYW1lPVwibGlzdHNcIl0gW25hbWU9XCIke25ld2xpc3QubmFtZX1cIl1gKVswXVswXTtcbiAgICAgICAgICAgIGxzdGVsdC5zY3JvbGxJbnRvVmlldyhmYWxzZSk7XG5cdH1cbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIExpc3RNYW5hZ2VyXG5cbmV4cG9ydCB7IExpc3RNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfSBmcm9tICcuL0xpc3RGb3JtdWxhUGFyc2VyJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBLbm93cyBob3cgdG8gcGFyc2UgYW5kIGV2YWx1YXRlIGEgbGlzdCBmb3JtdWxhIChha2EgbGlzdCBleHByZXNzaW9uKS5cbmNsYXNzIExpc3RGb3JtdWxhRXZhbHVhdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAobGlzdE1hbmFnZXIpIHtcblx0dGhpcy5saXN0TWFuYWdlciA9IGxpc3RNYW5hZ2VyO1xuICAgICAgICB0aGlzLnBhcnNlciA9IG5ldyBMaXN0Rm9ybXVsYVBhcnNlcigpO1xuICAgIH1cbiAgICAvLyBFdmFsdWF0ZXMgdGhlIGV4cHJlc3Npb24gYW5kIHJldHVybnMgYSBQcm9taXNlIGZvciB0aGUgbGlzdCBvZiBpZHMuXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gZXJyb3IsIHRoZSBwcm9taXNlIHJlamVjdHMgd2l0aCB0aGUgZXJyb3IgbWVzc2FnZS5cbiAgICBldmFsIChleHByKSB7XG5cdCByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICAgdHJ5IHtcblx0XHRsZXQgYXN0ID0gdGhpcy5wYXJzZXIucGFyc2UoZXhwcik7XG5cdFx0bGV0IGxtID0gdGhpcy5saXN0TWFuYWdlcjtcblx0XHRsZXQgcmVhY2ggPSAobikgPT4ge1xuXHRcdCAgICBpZiAodHlwZW9mKG4pID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdFx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG47XG5cdFx0XHRyZXR1cm4gbmV3IFNldChsc3QuaWRzKTtcblx0XHQgICAgfVxuXHRcdCAgICBlbHNlIHtcblx0XHRcdGxldCBsID0gcmVhY2gobi5sZWZ0KTtcblx0XHRcdGxldCByID0gcmVhY2gobi5yaWdodCk7XG5cdFx0XHRyZXR1cm4gbFtuLm9wXShyKTtcblx0XHQgICAgfVxuXHRcdH1cblx0XHRsZXQgaWRzID0gcmVhY2goYXN0KTtcblx0XHRyZXNvbHZlKEFycmF5LmZyb20oaWRzKSk7XG5cdCAgICB9XG5cdCAgICBjYXRjaCAoZSkge1xuXHRcdHJlamVjdChlKTtcblx0ICAgIH1cblx0IH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIC8vIENoZWNrcyB0aGUgY3VycmVudCBleHByZXNzaW9uIGZvciBzeW50YWN0aWMgYW5kIHNlbWFudGljIHZhbGlkaXR5IGFuZCBzZXRzIHRoZSBcbiAgICAvLyB2YWxpZC9pbnZhbGlkIGNsYXNzIGFjY29yZGluZ2x5LiBTZW1hbnRpYyB2YWxpZGl0eSBzaW1wbHkgbWVhbnMgYWxsIG5hbWVzIGluIHRoZVxuICAgIC8vIGV4cHJlc3Npb24gYXJlIGJvdW5kLlxuICAgIC8vXG4gICAgaXNWYWxpZCAgKGV4cHIpIHtcblx0dHJ5IHtcblx0ICAgIC8vIGZpcnN0IGNoZWNrIHN5bnRheFxuXHQgICAgbGV0IGFzdCA9IHRoaXMucGFyc2VyLnBhcnNlKGV4cHIpO1xuXHQgICAgbGV0IGxtICA9IHRoaXMubGlzdE1hbmFnZXI7IFxuXHQgICAgLy8gbm93IGNoZWNrIGxpc3QgbmFtZXNcblx0ICAgIChmdW5jdGlvbiByZWFjaChuKSB7XG5cdFx0aWYgKHR5cGVvZihuKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdCAgICBsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdCAgICBpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgblxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHQgICAgcmVhY2gobi5sZWZ0KTtcblx0XHQgICAgcmVhY2gobi5yaWdodCk7XG5cdFx0fVxuXHQgICAgfSkoYXN0KTtcblxuXHQgICAgLy8gVGh1bWJzIHVwIVxuXHQgICAgcmV0dXJuIHRydWU7XG5cdH1cblx0Y2F0Y2ggKGUpIHtcblx0ICAgIC8vIHN5bnRheCBlcnJvciBvciB1bmtub3duIGxpc3QgbmFtZVxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEZvcm11bGFFdmFsdWF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHNldENhcmV0UG9zaXRpb24sIG1vdmVDYXJldFBvc2l0aW9uLCBnZXRDYXJldFJhbmdlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9IGZyb20gJy4vTGlzdEZvcm11bGFQYXJzZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIExpc3RFZGl0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuXHRzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMucGFyc2VyID0gbmV3IExpc3RGb3JtdWxhUGFyc2VyKCk7XG5cdHRoaXMuZm9ybSA9IG51bGw7XG5cdHRoaXMuaW5pdERvbSgpO1xuXHR0aGlzLmlzRWRpdGluZ0Zvcm11bGEgPSBmYWxzZTtcblx0Ly9cblx0dGhpcy5saXN0ID0gbnVsbDtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0dGhpcy5mb3JtID0gdGhpcy5yb290LnNlbGVjdChcImZvcm1cIilbMF1bMF07XG5cdGlmICghdGhpcy5mb3JtKSB0aHJvdyBcIkNvdWxkIG5vdCBpbml0IExpc3RFZGl0b3IuIE5vIGZvcm0gZWxlbWVudC5cIjtcblx0ZDMuc2VsZWN0KHRoaXMuZm9ybSlcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgdCA9IGQzLmV2ZW50LnRhcmdldDtcblx0XHRpZiAoXCJidXR0b25cIiA9PT0gdC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpe1xuXHRcdCAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCAgICBsZXQgZiA9IHRoaXMuZm9ybTtcblx0XHQgICAgbGV0IHMgPSBmLmlkcy52YWx1ZS5yZXBsYWNlKC9bLHxdL2csICcgJykudHJpbSgpO1xuXHRcdCAgICBsZXQgaWRzID0gcyA/IHMuc3BsaXQoL1xccysvKSA6IFtdO1xuXHRcdCAgICAvLyBzYXZlIGxpc3Rcblx0XHQgICAgaWYgKHQubmFtZSA9PT0gXCJzYXZlXCIpIHtcblx0XHRcdGlmICghdGhpcy5saXN0KSByZXR1cm47XG5cdFx0XHR0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGVMaXN0KHRoaXMubGlzdC5uYW1lLCBmLm5hbWUudmFsdWUsIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNyZWF0ZSBuZXcgbGlzdFxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwibmV3XCIpIHtcblx0XHRcdGxldCBuID0gZi5uYW1lLnZhbHVlLnRyaW0oKTtcblx0XHRcdGlmICghbikge1xuXHRcdFx0ICAgYWxlcnQoXCJZb3VyIGxpc3QgaGFzIG5vIG5hbWUgYW5kIGlzIHZlcnkgc2FkLiBQbGVhc2UgZ2l2ZSBpdCBhIG5hbWUgYW5kIHRyeSBhZ2Fpbi5cIik7XG5cdFx0XHQgICByZXR1cm5cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKG4uaW5kZXhPZignXCInKSA+PSAwKSB7XG5cdFx0XHQgICBhbGVydChcIk9oIGRlYXIsIHlvdXIgbGlzdCdzIG5hbWUgaGFzIGEgZG91YmxlIHF1b3RlIGNoYXJhY3RlciwgYW5kIEknbSBhZmFyYWlkIHRoYXQncyBub3QgYWxsb3dlZC4gUGxlYXNlIHJlbW92ZSB0aGUgJ1xcXCInIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdFx0ICAgcmV0dXJuXG5cdFx0XHR9XG5cdFx0ICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5jcmVhdGVMaXN0KG4sIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNsZWFyIGZvcm1cblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcImNsZWFyXCIpIHtcblx0XHQgICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG5cdFx0ICAgIH1cblx0XHQgICAgLy8gZm9yd2FyZCB0byBNR0lcblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcInRvTWdpXCIpIHtcblx0XHQgICAgICAgIGxldCBmcm0gPSBkMy5zZWxlY3QoJyNtZ2liYXRjaGZvcm0nKVswXVswXTtcblx0XHRcdGZybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIiBcIik7XG5cdFx0XHRmcm0uc3VibWl0KClcblx0XHQgICAgfVxuXHRcdCAgICAvLyBmb3J3YXJkIHRvIE1vdXNlTWluZVxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwidG9Nb3VzZU1pbmVcIikge1xuXHRcdCAgICAgICAgbGV0IGZybSA9IGQzLnNlbGVjdCgnI21vdXNlbWluZWZvcm0nKVswXVswXTtcblx0XHRcdGZybS5leHRlcm5hbGlkcy52YWx1ZSA9IGlkcy5qb2luKFwiLFwiKTtcblx0XHRcdGZybS5zdWJtaXQoKVxuXHRcdCAgICB9XG5cdFx0fVxuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBzaG93L2hpZGUgZm9ybXVsYSBlZGl0b3Jcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNlY3Rpb25cIl0gLmJ1dHRvbltuYW1lPVwiZWRpdGZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGVGb3JtdWxhRWRpdG9yKCkpO1xuXHQgICAgXG5cdC8vIElucHV0IGJveDogZm9ybXVsYTogdmFsaWRhdGUgb24gYW55IGlucHV0XG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIHRoaXMudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBGb3J3YXJkIC0+IE1HSS9Nb3VzZU1pbmU6IGRpc2FibGUgYnV0dG9ucyBpZiBubyBpZHNcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIGxldCBlbXB0eSA9IHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMDtcblx0XHR0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0aGlzLmZvcm0udG9Nb3VzZU1pbmUuZGlzYWJsZWQgPSBlbXB0eTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbnM6IHRoZSBsaXN0IG9wZXJhdG9yIGJ1dHRvbnMgKHVuaW9uLCBpbnRlcnNlY3Rpb24sIGV0Yy4pXG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uLmxpc3RvcCcpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gYWRkIG15IHN5bWJvbCB0byB0aGUgZm9ybXVsYVxuXHRcdGxldCBpbmVsdCA9IHNlbGYuZm9ybS5mb3JtdWxhO1xuXHRcdGxldCBvcCA9IGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwibmFtZVwiKTtcblx0XHRzZWxmLmFkZFRvTGlzdEV4cHIob3ApO1xuXHRcdHNlbGYudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IHJlZnJlc2ggYnV0dG9uIGZvciBydW5uaW5nIHRoZSBmb3JtdWxhXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uW25hbWU9XCJyZWZyZXNoXCJdJylcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgZW1lc3NhZ2U9XCJJJ20gdGVycmlibHkgc29ycnksIGJ1dCB0aGVyZSBhcHBlYXJzIHRvIGJlIGEgcHJvYmxlbSB3aXRoIHlvdXIgbGlzdCBleHByZXNzaW9uOiBcIjtcblx0XHRsZXQgZm9ybXVsYSA9IHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlLnRyaW0oKTtcblx0XHRpZiAoZm9ybXVsYS5sZW5ndGggPT09IDApXG5cdFx0ICAgIHJldHVybjtcblx0ICAgICAgICB0aGlzLmFwcC5saXN0TWFuYWdlclxuXHRcdCAgICAuZXZhbEZvcm11bGEoZm9ybXVsYSlcblx0XHQgICAgLnRoZW4oaWRzID0+IHtcblx0XHQgICAgICAgIHRoaXMuZm9ybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIlxcblwiKTtcblx0XHQgICAgIH0pXG5cdFx0ICAgIC5jYXRjaChlID0+IGFsZXJ0KGVtZXNzYWdlICsgZSkpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBjbG9zZSBmb3JtdWxhIGVkaXRvclxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gLmJ1dHRvbltuYW1lPVwiY2xvc2VcIl0nKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5jbG9zZUZvcm11bGFFZGl0b3IoKSApO1xuXHRcblx0Ly8gQ2xpY2tpbmcgdGhlIGJveCBjb2xsYXBzZSBidXR0b24gc2hvdWxkIGNsZWFyIHRoZSBmb3JtXG5cdHRoaXMucm9vdC5zZWxlY3QoXCIuYnV0dG9uLmNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5leHRyYVwiLCAoKSA9PiB7XG5cdCAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0XHR0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpO1xuXHQgICAgfSk7XG4gICAgfVxuICAgIHBhcnNlSWRzIChzKSB7XG5cdHJldHVybiBzLnJlcGxhY2UoL1ssfF0vZywgJyAnKS50cmltKCkuc3BsaXQoL1xccysvKTtcbiAgICB9XG4gICAgZ2V0IGxpc3QgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdDtcbiAgICB9XG4gICAgc2V0IGxpc3QgKGxzdCkge1xuICAgICAgICB0aGlzLl9saXN0ID0gbHN0O1xuXHR0aGlzLl9zeW5jRGlzcGxheSgpO1xuICAgIH1cbiAgICBfc3luY0Rpc3BsYXkgKCkge1xuXHRsZXQgbHN0ID0gdGhpcy5fbGlzdDtcblx0aWYgKCFsc3QpIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0ubW9kaWZpZWQudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uc2F2ZS5kaXNhYmxlZCA9IHRydWU7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkID0gdHJ1ZTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gbHN0Lm5hbWU7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gbHN0Lmlkcy5qb2luKCdcXG4nKTtcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gbHN0LmZvcm11bGEgfHwgXCJcIjtcblx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZS50cmltKCkubGVuZ3RoID4gMDtcblx0ICAgIHRoaXMuZm9ybS5tb2RpZmllZC52YWx1ZSA9IGxzdC5tb2RpZmllZDtcblx0ICAgIHRoaXMuZm9ybS5zYXZlLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgXG5cdCAgICAgID0gdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkIFxuXHQgICAgICAgID0gKHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMCk7XG5cdH1cblx0dGhpcy52YWxpZGF0ZUV4cHIoKTtcbiAgICB9XG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuICAgIH1cbiAgICBvcGVuIChsc3QpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbHN0O1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiLCBmYWxzZSk7XG4gICAgfVxuICAgIGNsb3NlICgpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIiwgdHJ1ZSk7XG4gICAgfVxuICAgIG9wZW5Gb3JtdWxhRWRpdG9yICgpIHtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJlZGl0aW5nZm9ybXVsYVwiLCB0cnVlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gdHJ1ZTtcblx0bGV0IGYgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZTtcblx0dGhpcy5mb3JtLmZvcm11bGEuZm9jdXMoKTtcblx0c2V0Q2FyZXRQb3NpdGlvbih0aGlzLmZvcm0uZm9ybXVsYSwgZi5sZW5ndGgpO1xuICAgIH1cbiAgICBjbG9zZUZvcm11bGFFZGl0b3IgKCkge1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImVkaXRpbmdmb3JtdWxhXCIsIGZhbHNlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gZmFsc2U7XG4gICAgfVxuICAgIHRvZ2dsZUZvcm11bGFFZGl0b3IgKCkge1xuXHRsZXQgc2hvd2luZyA9IHRoaXMucm9vdC5jbGFzc2VkKFwiZWRpdGluZ2Zvcm11bGFcIik7XG5cdHNob3dpbmcgPyB0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpIDogdGhpcy5vcGVuRm9ybXVsYUVkaXRvcigpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDaGVja3MgdGhlIGN1cnJlbnQgZXhwcmVzc2lvbiBhbmQgc2V0cyB0aGUgdmFsaWQvaW52YWxpZCBjbGFzcy5cbiAgICB2YWxpZGF0ZUV4cHIgICgpIHtcblx0bGV0IGlucCA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKTtcblx0bGV0IGV4cHIgPSBpbnBbMF1bMF0udmFsdWUudHJpbSgpO1xuXHRpZiAoIWV4cHIpIHtcblx0ICAgIGlucC5jbGFzc2VkKFwidmFsaWRcIixmYWxzZSkuY2xhc3NlZChcImludmFsaWRcIixmYWxzZSk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IGZhbHNlO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgbGV0IGlzVmFsaWQgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5pc1ZhbGlkKGV4cHIpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHQgICAgaW5wLmNsYXNzZWQoXCJ2YWxpZFwiLCBpc1ZhbGlkKS5jbGFzc2VkKFwiaW52YWxpZFwiLCAhaXNWYWxpZCk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IHRydWU7XG5cdH1cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYWRkVG9MaXN0RXhwciAodGV4dCkge1xuXHRsZXQgaW5wID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIFtuYW1lPVwiZm9ybXVsYVwiXScpO1xuXHRsZXQgaWVsdCA9IGlucFswXVswXTtcblx0bGV0IHYgPSBpZWx0LnZhbHVlO1xuXHRsZXQgc3BsaWNlID0gZnVuY3Rpb24gKGUsdCl7XG5cdCAgICBsZXQgdiA9IGUudmFsdWU7XG5cdCAgICBsZXQgciA9IGdldENhcmV0UmFuZ2UoZSk7XG5cdCAgICBlLnZhbHVlID0gdi5zbGljZSgwLHJbMF0pICsgdCArIHYuc2xpY2UoclsxXSk7XG5cdCAgICBzZXRDYXJldFBvc2l0aW9uKGUsIHJbMF0rdC5sZW5ndGgpO1xuXHQgICAgZS5mb2N1cygpO1xuXHR9XG5cdGxldCByYW5nZSA9IGdldENhcmV0UmFuZ2UoaWVsdCk7XG5cdGlmIChyYW5nZVswXSA9PT0gcmFuZ2VbMV0pIHtcblx0ICAgIC8vIG5vIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dCk7XG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKSBcblx0XHRtb3ZlQ2FyZXRQb3NpdGlvbihpZWx0LCAtMSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICAvLyB0aGVyZSBpcyBhIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKVxuXHRcdC8vIHN1cnJvdW5kIGN1cnJlbnQgc2VsZWN0aW9uIHdpdGggcGFyZW5zLCB0aGVuIG1vdmUgY2FyZXQgYWZ0ZXJcblx0XHR0ZXh0ID0gJygnICsgdi5zbGljZShyYW5nZVswXSxyYW5nZVsxXSkgKyAnKSc7XG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dClcblx0fVxuXHR0aGlzLnZhbGlkYXRlRXhwcigpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIExpc3RFZGl0b3JcblxuZXhwb3J0IHsgTGlzdEVkaXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEVkaXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTG9jYWxTdG9yYWdlTWFuYWdlciB9IGZyb20gJy4vU3RvcmFnZU1hbmFnZXInO1xuXG5jb25zdCBNR1JfTkFNRSA9IFwicHJlZnNNYW5hZ2VyXCI7XG5jb25zdCBJVEVNX05BTUU9IFwidXNlclByZWZzXCI7XG5cbmNsYXNzIFVzZXJQcmVmc01hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZU1hbmFnZXIoTUdSX05BTUUpO1xuXHR0aGlzLmRhdGEgPSBudWxsO1xuXHR0aGlzLl9sb2FkKCk7XG4gICAgfVxuICAgIF9sb2FkICgpIHtcblx0dGhpcy5kYXRhID0gdGhpcy5zdG9yYWdlLmdldChJVEVNX05BTUUpO1xuXHRpZiAoIXRoaXMuZGF0YSl7XG5cdCAgICB0aGlzLmRhdGEgPSB7fTtcblx0ICAgIHRoaXMuX3NhdmUoKTtcblx0fVxuICAgIH1cbiAgICBfc2F2ZSAoKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5wdXQoSVRFTV9OQU1FLCB0aGlzLmRhdGEpO1xuICAgIH1cbiAgICBoYXMgKG4pIHtcbiAgICB9XG4gICAgZ2V0IChuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbbl07XG4gICAgfVxuICAgIGdldEFsbCAoKSB7XG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRhdGEpXG4gICAgfVxuICAgIHNldCAobiwgdikge1xuICAgICAgICB0aGlzLmRhdGFbbl0gPSB2O1xuXHR0aGlzLl9zYXZlKCk7XG4gICAgfVxuICAgIHNldEFsbCAodikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuZGF0YSwgdik7XG5cdHRoaXMuX3NhdmUoKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IFVzZXJQcmVmc01hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1VzZXJQcmVmc01hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEZhY2V0IH0gZnJvbSAnLi9GYWNldCc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgRmFjZXRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwKSB7XG5cdHRoaXMuYXBwID0gYXBwO1xuXHR0aGlzLmZhY2V0cyA9IFtdO1xuXHR0aGlzLm5hbWUyZmFjZXQgPSB7fVxuICAgIH1cbiAgICBhZGRGYWNldCAobmFtZSwgdmFsdWVGY24pIHtcblx0aWYgKHRoaXMubmFtZTJmYWNldFtuYW1lXSkgdGhyb3cgXCJEdXBsaWNhdGUgZmFjZXQgbmFtZS4gXCIgKyBuYW1lO1xuXHRsZXQgZmFjZXQgPSBuZXcgRmFjZXQobmFtZSwgdGhpcywgdmFsdWVGY24pO1xuICAgICAgICB0aGlzLmZhY2V0cy5wdXNoKCBmYWNldCApO1xuXHR0aGlzLm5hbWUyZmFjZXRbbmFtZV0gPSBmYWNldDtcblx0cmV0dXJuIGZhY2V0XG4gICAgfVxuICAgIHRlc3QgKGYpIHtcbiAgICAgICAgbGV0IHZhbHMgPSB0aGlzLmZhY2V0cy5tYXAoIGZhY2V0ID0+IGZhY2V0LnRlc3QoZikgKTtcblx0cmV0dXJuIHZhbHMucmVkdWNlKChhY2N1bSwgdmFsKSA9PiBhY2N1bSAmJiB2YWwsIHRydWUpO1xuICAgIH1cbiAgICBhcHBseUFsbCAoKSB7XG5cdGxldCBzaG93ID0gbnVsbDtcblx0bGV0IGhpZGUgPSBcIm5vbmVcIjtcblx0Ly8gRklYTUU6IG1ham9yIHJlYWNob3ZlclxuXHR0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcImcuc3RyaXBzXCIpLnNlbGVjdEFsbCgncmVjdC5mZWF0dXJlJylcblx0ICAgIC5zdHlsZShcImRpc3BsYXlcIiwgZiA9PiB0aGlzLnRlc3QoZikgPyBzaG93IDogaGlkZSk7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgRmFjZXRNYW5hZ2VyXG5cbmV4cG9ydCB7IEZhY2V0TWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmFjZXRNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIEZhY2V0IHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSwgbWFuYWdlciwgdmFsdWVGY24pIHtcblx0dGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcblx0dGhpcy52YWx1ZXMgPSBbXTtcblx0dGhpcy52YWx1ZUZjbiA9IHZhbHVlRmNuO1xuICAgIH1cbiAgICBzZXRWYWx1ZXMgKHZhbHVlcywgcXVpZXRseSkge1xuICAgICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcblx0aWYgKCEgcXVpZXRseSkge1xuXHQgICAgdGhpcy5tYW5hZ2VyLmFwcGx5QWxsKCk7XG5cdCAgICB0aGlzLm1hbmFnZXIuYXBwLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9XG4gICAgfVxuICAgIHRlc3QgKGYpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLnZhbHVlcyB8fCB0aGlzLnZhbHVlcy5sZW5ndGggPT09IDAgfHwgdGhpcy52YWx1ZXMuaW5kZXhPZiggdGhpcy52YWx1ZUZjbihmKSApID49IDA7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgRmFjZXRcblxuZXhwb3J0IHsgRmFjZXQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZhY2V0LmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBkM3RzdiB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQmxvY2tUcmFuc2xhdG9yIH0gZnJvbSAnLi9CbG9ja1RyYW5zbGF0b3InO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEJsb2NrVHJhbnNsYXRvciBtYW5hZ2VyIGNsYXNzLiBGb3IgYW55IGdpdmVuIHBhaXIgb2YgZ2Vub21lcywgQSBhbmQgQiwgbG9hZHMgdGhlIHNpbmdsZSBibG9jayBmaWxlXG4vLyBmb3IgdHJhbnNsYXRpbmcgYmV0d2VlbiB0aGVtLCBhbmQgaW5kZXhlcyBpdCBcImZyb20gYm90aCBkaXJlY3Rpb25zXCI6XG4vLyBcdEEtPkItPiBbQUJfQmxvY2tGaWxlXSA8LUE8LUJcbi8vXG5jbGFzcyBCVE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG5cdHRoaXMucmNCbG9ja3MgPSB7fTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZWdpc3RlckJsb2NrcyAodXJsLCBhR2Vub21lLCBiR2Vub21lLCBibG9ja3MpIHtcblx0Y29uc29sZS5sb2coXCJSZWdpc3RlcmluZyBibG9ja3MgZnJvbTogXCIgKyB1cmwsIGJsb2Nrcyk7XG5cdGxldCBhbmFtZSA9IGFHZW5vbWUubmFtZTtcblx0bGV0IGJuYW1lID0gYkdlbm9tZS5uYW1lO1xuXHRsZXQgYmxrRmlsZSA9IG5ldyBCbG9ja1RyYW5zbGF0b3IodXJsLGFHZW5vbWUsYkdlbm9tZSxibG9ja3MpO1xuXHRpZiggISB0aGlzLnJjQmxvY2tzW2FuYW1lXSkgdGhpcy5yY0Jsb2Nrc1thbmFtZV0gPSB7fTtcblx0aWYoICEgdGhpcy5yY0Jsb2Nrc1tibmFtZV0pIHRoaXMucmNCbG9ja3NbYm5hbWVdID0ge307XG5cdHRoaXMucmNCbG9ja3NbYW5hbWVdW2JuYW1lXSA9IGJsa0ZpbGU7XG5cdHRoaXMucmNCbG9ja3NbYm5hbWVdW2FuYW1lXSA9IGJsa0ZpbGU7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gTG9hZHMgdGhlIHN5bnRlbnkgYmxvY2sgZmlsZSBmb3IgZ2Vub21lcyBhR2Vub21lIGFuZCBiR2Vub21lLlxuICAgIC8vIFxuICAgIGdldEJsb2NrRmlsZSAoYUdlbm9tZSwgYkdlbm9tZSkge1xuXHQvLyBCZSBhIGxpdHRsZSBzbWFydCBhYm91dCB0aGUgb3JkZXIgd2UgdHJ5IHRoZSBuYW1lcy4uLlxuXHRpZiAoYkdlbm9tZS5uYW1lIDwgYUdlbm9tZS5uYW1lKSB7XG5cdCAgICBsZXQgdG1wID0gYUdlbm9tZTsgYUdlbm9tZSA9IGJHZW5vbWU7IGJHZW5vbWUgPSB0bXA7XG5cdH1cblx0Ly8gRmlyc3QsIHNlZSBpZiB3ZSBhbHJlYWR5IGhhdmUgdGhpcyBwYWlyXG5cdGxldCBhbmFtZSA9IGFHZW5vbWUubmFtZTtcblx0bGV0IGJuYW1lID0gYkdlbm9tZS5uYW1lO1xuXHRsZXQgYmYgPSAodGhpcy5yY0Jsb2Nrc1thbmFtZV0gfHwge30pW2JuYW1lXTtcblx0aWYgKGJmKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShiZik7XG5cdFxuXHQvLyBGb3IgYW55IGdpdmVuIGdlbm9tZSBwYWlyLCBvbmx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIHR3byBmaWxlc1xuXHQvLyBpcyBnZW5lcmF0ZWQgYnkgdGhlIGJhY2sgZW5kXG5cdGxldCBmbjEgPSBgLi9kYXRhL2Jsb2NrZmlsZXMvJHthR2Vub21lLm5hbWV9LSR7Ykdlbm9tZS5uYW1lfS50c3ZgXG5cdGxldCBmbjIgPSBgLi9kYXRhL2Jsb2NrZmlsZXMvJHtiR2Vub21lLm5hbWV9LSR7YUdlbm9tZS5uYW1lfS50c3ZgXG5cdC8vIFRoZSBmaWxlIGZvciBBLT5CIGlzIHNpbXBseSBhIHJlLXNvcnQgb2YgdGhlIGZpbGUgZnJvbSBCLT5BLiBTbyB0aGUgXG5cdC8vIGJhY2sgZW5kIG9ubHkgY3JlYXRlcyBvbmUgb2YgdGhlbS5cblx0Ly8gV2UnbGwgdHJ5IG9uZSBhbmQgaWYgdGhhdCdzIG5vdCBpdCwgdGhlbiB0cnkgdGhlIG90aGVyLlxuXHQvLyAoQW5kIGlmIFRIQVQncyBub3QgaXQsIHRoZW4gY3J5IGEgcml2ZXIuLi4pXG5cdGxldCBzZWxmID0gdGhpcztcblx0cmV0dXJuIGQzdHN2KGZuMSlcblx0ICAudGhlbihmdW5jdGlvbihibG9ja3Mpe1xuXHQgICAgICAvLyB5dXAsIGl0IHdhcyBBLUJcblx0ICAgICAgc2VsZi5yZWdpc3RlckJsb2NrcyhmbjEsIGFHZW5vbWUsIGJHZW5vbWUsIGJsb2Nrcyk7XG5cdCAgICAgIHJldHVybiBibG9ja3Ncblx0ICB9KVxuXHQgIC5jYXRjaChmdW5jdGlvbihlKXtcblx0ICAgICAgY29uc29sZS5sb2coYElORk86IERpc3JlZ2FyZCB0aGF0IDQwNCBtZXNzYWdlISAke2ZuMX0gd2FzIG5vdCBmb3VuZC4gVHJ5aW5nICR7Zm4yfS5gKTtcblx0ICAgICAgcmV0dXJuIGQzdHN2KGZuMilcblx0XHQgIC50aGVuKGZ1bmN0aW9uKGJsb2Nrcyl7XG5cdFx0ICAgICAgLy8gbm9wZSwgaXQgd2FzIEItQVxuXHRcdCAgICAgIHNlbGYucmVnaXN0ZXJCbG9ja3MoZm4yLCBiR2Vub21lLCBhR2Vub21lLCBibG9ja3MpO1xuXHRcdCAgICAgIHJldHVybiBibG9ja3Ncblx0XHQgIH0pXG5cdFx0ICAuY2F0Y2goZnVuY3Rpb24oZSl7XG5cdFx0ICAgICAgY29uc29sZS5sb2coJ0J1dCBUSEFUIDQwNCBtZXNzYWdlIGlzIGEgcHJvYmxlbS4nKTtcblx0XHQgICAgICB0aHJvdyBgQ2Fubm90IGdldCBibG9jayBmaWxlIGZvciB0aGlzIGdlbm9tZSBwYWlyOiAke2FHZW5vbWUubmFtZX0gJHtiR2Vub21lLm5hbWV9LlxcbihFcnJvcj0ke2V9KWA7XG5cdFx0ICB9KTtcblx0ICB9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHRoZSB0cmFuc2xhdG9yIGhhcyBsb2FkZWQgYWxsIHRoZSBkYXRhIG5lZWRlZFxuICAgIC8vIGZvciB0cmFuc2xhdGluZyBjb29yZGluYXRlcyBiZXR3ZWVuIHRoZSBjdXJyZW50IHJlZiBzdHJhaW4gYW5kIHRoZSBjdXJyZW50IGNvbXBhcmlzb24gc3RyYWlucy5cbiAgICAvL1xuICAgIHJlYWR5ICgpIHtcblx0bGV0IHByb21pc2VzID0gdGhpcy5hcHAuY0dlbm9tZXMubWFwKGNnID0+IHRoaXMuZ2V0QmxvY2tGaWxlKHRoaXMuYXBwLnJHZW5vbWUsIGNnKSk7XG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBzeW50ZW55IGJsb2NrIHRyYW5zbGF0b3IgdGhhdCBtYXBzIHRoZSBjdXJyZW50IHJlZiBnZW5vbWUgdG8gdGhlIHNwZWNpZmllZCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIGdldEJsb2NrcyAoZnJvbUdlbm9tZSwgdG9HZW5vbWUpIHtcbiAgICAgICAgbGV0IGJsa1RyYW5zID0gdGhpcy5yY0Jsb2Nrc1tmcm9tR2Vub21lLm5hbWVdW3RvR2Vub21lLm5hbWVdO1xuXHRyZXR1cm4gYmxrVHJhbnMuZ2V0QmxvY2tzKGZyb21HZW5vbWUpXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVHJhbnNsYXRlcyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSBzcGVjaWZpZWQgZnJvbUdlbm9tZSB0byB0aGUgc3BlY2lmaWVkIHRvR2Vub21lLlxuICAgIC8vIFJldHVybnMgYSBsaXN0IG9mIHplcm8gb3IgbW9yZSBjb29yZGluYXRlIHJhbmdlcyBpbiB0aGUgdG9HZW5vbWUuXG4gICAgLy9cbiAgICB0cmFuc2xhdGUgKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCwgdG9HZW5vbWUsIGludmVydGVkKSB7XG5cdC8vIGdldCB0aGUgcmlnaHQgYmxvY2sgZmlsZVxuXHRsZXQgYmxrVHJhbnMgPSB0aGlzLnJjQmxvY2tzW2Zyb21HZW5vbWUubmFtZV1bdG9HZW5vbWUubmFtZV07XG5cdGlmICghYmxrVHJhbnMpIHRocm93IFwiSW50ZXJuYWwgZXJyb3IuIE5vIGJsb2NrIGZpbGUgZm91bmQgaW4gaW5kZXguXCJcblx0Ly8gdHJhbnNsYXRlIVxuXHRsZXQgcmFuZ2VzID0gYmxrVHJhbnMudHJhbnNsYXRlKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCwgaW52ZXJ0ZWQpO1xuXHRyZXR1cm4gcmFuZ2VzO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEJUTWFuYWdlclxuXG5leHBvcnQgeyBCVE1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0JUTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTb21ldGhpbmcgdGhhdCBrbm93cyBob3cgdG8gdHJhbnNsYXRlIGNvb3JkaW5hdGVzIGJldHdlZW4gdHdvIGdlbm9tZXMuXG4vL1xuLy9cbmNsYXNzIEJsb2NrVHJhbnNsYXRvciB7XG4gICAgY29uc3RydWN0b3IodXJsLCBhR2Vub21lLCBiR2Vub21lLCBibG9ja3Mpe1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcblx0dGhpcy5hR2Vub21lID0gYUdlbm9tZTtcblx0dGhpcy5iR2Vub21lID0gYkdlbm9tZTtcblx0dGhpcy5ibG9ja3MgPSBibG9ja3MubWFwKGIgPT4gdGhpcy5wcm9jZXNzQmxvY2soYikpXG5cdHRoaXMuY3VycmVudFNvcnQgPSBcImFcIjsgLy8gZWl0aGVyICdhJyBvciAnYidcbiAgICB9XG4gICAgcHJvY2Vzc0Jsb2NrIChibGspIHsgXG4gICAgICAgIGJsay5hSW5kZXggPSBwYXJzZUludChibGsuYUluZGV4KTtcbiAgICAgICAgYmxrLmJJbmRleCA9IHBhcnNlSW50KGJsay5iSW5kZXgpO1xuICAgICAgICBibGsuYVN0YXJ0ID0gcGFyc2VJbnQoYmxrLmFTdGFydCk7XG4gICAgICAgIGJsay5iU3RhcnQgPSBwYXJzZUludChibGsuYlN0YXJ0KTtcbiAgICAgICAgYmxrLmFFbmQgICA9IHBhcnNlSW50KGJsay5hRW5kKTtcbiAgICAgICAgYmxrLmJFbmQgICA9IHBhcnNlSW50KGJsay5iRW5kKTtcbiAgICAgICAgYmxrLmFMZW5ndGggICA9IHBhcnNlSW50KGJsay5hTGVuZ3RoKTtcbiAgICAgICAgYmxrLmJMZW5ndGggICA9IHBhcnNlSW50KGJsay5iTGVuZ3RoKTtcbiAgICAgICAgYmxrLmJsb2NrQ291bnQgICA9IHBhcnNlSW50KGJsay5ibG9ja0NvdW50KTtcbiAgICAgICAgYmxrLmJsb2NrUmF0aW8gICA9IHBhcnNlRmxvYXQoYmxrLmJsb2NrUmF0aW8pO1xuXHRibGsuYWJNYXAgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHQgICAgLmRvbWFpbihbYmxrLmFTdGFydCxibGsuYUVuZF0pXG5cdCAgICAucmFuZ2UoIGJsay5ibG9ja09yaT09PVwiLVwiID8gW2Jsay5iRW5kLGJsay5iU3RhcnRdIDogW2Jsay5iU3RhcnQsYmxrLmJFbmRdKTtcblx0YmxrLmJhTWFwID0gYmxrLmFiTWFwLmludmVydFxuXHRyZXR1cm4gYmxrO1xuICAgIH1cbiAgICBzZXRTb3J0ICh3aGljaCkge1xuXHRpZiAod2hpY2ggIT09ICdhJyAmJiB3aGljaCAhPT0gJ2InKSB0aHJvdyBcIkJhZCBhcmd1bWVudDpcIiArIHdoaWNoO1xuXHRsZXQgc29ydENvbCA9IHdoaWNoICsgXCJJbmRleFwiO1xuXHRsZXQgY21wID0gKHgseSkgPT4geFtzb3J0Q29sXSAtIHlbc29ydENvbF07XG5cdHRoaXMuYmxvY2tzLnNvcnQoY21wKTtcblx0dGhpcy5jdXJyU29ydCA9IHdoaWNoO1xuICAgIH1cbiAgICBmbGlwU29ydCAoKSB7XG5cdHRoaXMuc2V0U29ydCh0aGlzLmN1cnJTb3J0ID09PSBcImFcIiA/IFwiYlwiIDogXCJhXCIpO1xuICAgIH1cbiAgICAvLyBHaXZlbiBhIGdlbm9tZSAoZWl0aGVyIHRoZSBhIG9yIGIgZ2Vub21lKSBhbmQgYSBjb29yZGluYXRlIHJhbmdlLFxuICAgIC8vIHJldHVybnMgdGhlIGVxdWl2YWxlbnQgY29vcmRpbmF0ZSByYW5nZShzKSBpbiB0aGUgb3RoZXIgZ2Vub21lXG4gICAgdHJhbnNsYXRlIChmcm9tR2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQsIGludmVydCkge1xuXHQvL1xuXHRlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHN0YXJ0IDogZW5kO1xuXHQvLyBmcm9tID0gXCJhXCIgb3IgXCJiXCIsIGRlcGVuZGluZyBvbiB3aGljaCBnZW5vbWUgaXMgZ2l2ZW4uXG4gICAgICAgIGxldCBmcm9tID0gKGZyb21HZW5vbWUgPT09IHRoaXMuYUdlbm9tZSA/IFwiYVwiIDogZnJvbUdlbm9tZSA9PT0gdGhpcy5iR2Vub21lID8gXCJiXCIgOiBudWxsKTtcblx0aWYgKCFmcm9tKSB0aHJvdyBcIkJhZCBhcmd1bWVudC4gR2Vub21lIG5laXRoZXIgQSBub3IgQi5cIjtcblx0Ly8gdG8gPSBcImJcIiBvciBcImFcIiwgb3Bwb3NpdGUgb2YgZnJvbVxuXHRsZXQgdG8gPSAoZnJvbSA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcblx0Ly8gbWFrZSBzdXJlIHRoZSBibG9ja3MgYXJlIHNvcnRlZCBieSB0aGUgZnJvbSBnZW5vbWVcblx0dGhpcy5zZXRTb3J0KGZyb20pO1xuXHQvL1xuXHRsZXQgZnJvbUMgPSBmcm9tK1wiQ2hyXCI7XG5cdGxldCBmcm9tUyA9IGZyb20rXCJTdGFydFwiO1xuXHRsZXQgZnJvbUUgPSBmcm9tK1wiRW5kXCI7XG5cdGxldCBmcm9tSSA9IGZyb20rXCJJbmRleFwiO1xuXHRsZXQgdG9DID0gdG8rXCJDaHJcIjtcblx0bGV0IHRvUyA9IHRvK1wiU3RhcnRcIjtcblx0bGV0IHRvRSA9IHRvK1wiRW5kXCI7XG5cdGxldCB0b0kgPSB0bytcIkluZGV4XCI7XG5cdGxldCBtYXBwZXIgPSBmcm9tK3RvK1wiTWFwXCI7XG5cdC8vIFxuXHRsZXQgYmxrcyA9IHRoaXMuYmxvY2tzXG5cdCAgICAvLyBGaXJzdCBmaWx0ZXIgZm9yIGJsb2NrcyB0aGF0IG92ZXJsYXAgdGhlIGdpdmVuIGNvb3JkaW5hdGUgcmFuZ2UgaW4gdGhlIGZyb20gZ2Vub21lXG5cdCAgICAuZmlsdGVyKGJsayA9PiBibGtbZnJvbUNdID09PSBjaHIgJiYgYmxrW2Zyb21TXSA8PSBlbmQgJiYgYmxrW2Zyb21FXSA+PSBzdGFydClcblx0ICAgIC8vIG1hcCBlYWNoIGJsb2NrLiBcblx0ICAgIC5tYXAoYmxrID0+IHtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgZnJvbSBzaWRlLlxuXHRcdGxldCBzID0gTWF0aC5tYXgoc3RhcnQsIGJsa1tmcm9tU10pO1xuXHRcdGxldCBlID0gTWF0aC5taW4oZW5kLCBibGtbZnJvbUVdKTtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgdG8gc2lkZS5cblx0XHRsZXQgczIgPSBNYXRoLmNlaWwoYmxrW21hcHBlcl0ocykpO1xuXHRcdGxldCBlMiA9IE1hdGguZmxvb3IoYmxrW21hcHBlcl0oZSkpO1xuXHQgICAgICAgIHJldHVybiBpbnZlcnQgPyB7XG5cdFx0ICAgIGNocjogICBibGtbZnJvbUNdLFxuXHRcdCAgICBzdGFydDogcyxcblx0XHQgICAgZW5kOiAgIGUsXG5cdFx0ICAgIG9yaTogICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGluZGV4OiBibGtbZnJvbUldLFxuXHRcdCAgICAvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZHMgZm9yIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0ICAgIGZDaHI6ICAgYmxrW3RvQ10sXG5cdFx0ICAgIGZTdGFydDogTWF0aC5taW4oczIsZTIpLFxuXHRcdCAgICBmRW5kOiAgIE1hdGgubWF4KHMyLGUyKSxcblx0XHQgICAgZkluZGV4OiBibGtbdG9JXSxcblx0XHQgICAgLy8gaW5jbHVkZSB0aGUgYmxvY2sgaWQgYW5kIGZ1bGwgYmxvY2sgY29vcmRzXG5cdFx0ICAgIGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdCAgICBibG9ja1N0YXJ0OiBibGtbZnJvbVNdLFxuXHRcdCAgICBibG9ja0VuZDogYmxrW2Zyb21FXVxuXHRcdCAgICB9IDoge1xuXHRcdCAgICBjaHI6ICAgYmxrW3RvQ10sXG5cdFx0ICAgIHN0YXJ0OiBNYXRoLm1pbihzMixlMiksXG5cdFx0ICAgIGVuZDogICBNYXRoLm1heChzMixlMiksXG5cdFx0ICAgIG9yaTogICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGluZGV4OiBibGtbdG9JXSxcblx0XHQgICAgLy8gYWxzbyByZXR1cm4gdGhlIGZyb21HZW5vbWUgY29vcmRzIGZvciB0aGlzIHBpZWNlIG9mIHRoZSB0cmFuc2xhdGlvblxuXHRcdCAgICBmQ2hyOiAgIGJsa1tmcm9tQ10sXG5cdFx0ICAgIGZTdGFydDogcyxcblx0XHQgICAgZkVuZDogICBlLFxuXHRcdCAgICBmSW5kZXg6IGJsa1tmcm9tSV0sXG5cdFx0ICAgIC8vIGluY2x1ZGUgdGhlIGJsb2NrIGlkIGFuZCBmdWxsIGJsb2NrIGNvb3Jkc1xuXHRcdCAgICBibG9ja0lkOiBibGsuYmxvY2tJZCxcblx0XHQgICAgYmxvY2tTdGFydDogYmxrW3RvU10sXG5cdFx0ICAgIGJsb2NrRW5kOiBibGtbdG9FXVxuXHRcdH07XG5cdCAgICB9KVxuXHQvLyBcblx0cmV0dXJuIGJsa3M7XG4gICAgfVxuICAgIC8vIEdpdmVuIGEgZ2Vub21lIChlaXRoZXIgdGhlIGEgb3IgYiBnZW5vbWUpXG4gICAgLy8gcmV0dXJucyB0aGUgYmxvY2tzIGZvciB0cmFuc2xhdGluZyB0byB0aGUgb3RoZXIgKGIgb3IgYSkgZ2Vub21lLlxuICAgIC8vXG4gICAgZ2V0QmxvY2tzIChmcm9tR2Vub21lKSB7XG5cdC8vIGZyb20gPSBcImFcIiBvciBcImJcIiwgZGVwZW5kaW5nIG9uIHdoaWNoIGdlbm9tZSBpcyBnaXZlbi5cbiAgICAgICAgbGV0IGZyb20gPSAoZnJvbUdlbm9tZSA9PT0gdGhpcy5hR2Vub21lID8gXCJhXCIgOiBmcm9tR2Vub21lID09PSB0aGlzLmJHZW5vbWUgPyBcImJcIiA6IG51bGwpO1xuXHRpZiAoIWZyb20pIHRocm93IFwiQmFkIGFyZ3VtZW50LiBHZW5vbWUgbmVpdGhlciBBIG5vciBCLlwiO1xuXHQvLyB0byA9IFwiYlwiIG9yIFwiYVwiLCBvcHBvc2l0ZSBvZiBmcm9tXG5cdGxldCB0byA9IChmcm9tID09PSBcImFcIiA/IFwiYlwiIDogXCJhXCIpO1xuXHQvLyBtYWtlIHN1cmUgdGhlIGJsb2NrcyBhcmUgc29ydGVkIGJ5IHRoZSBmcm9tIGdlbm9tZVxuXHR0aGlzLnNldFNvcnQoZnJvbSk7XG5cdC8vXG5cdGxldCBmcm9tQyA9IGZyb20rXCJDaHJcIjtcblx0bGV0IGZyb21TID0gZnJvbStcIlN0YXJ0XCI7XG5cdGxldCBmcm9tRSA9IGZyb20rXCJFbmRcIjtcblx0bGV0IGZyb21JID0gZnJvbStcIkluZGV4XCI7XG5cdGxldCB0b0MgPSB0bytcIkNoclwiO1xuXHRsZXQgdG9TID0gdG8rXCJTdGFydFwiO1xuXHRsZXQgdG9FID0gdG8rXCJFbmRcIjtcblx0bGV0IHRvSSA9IHRvK1wiSW5kZXhcIjtcblx0bGV0IG1hcHBlciA9IGZyb20rdG8rXCJNYXBcIjtcblx0Ly8gXG5cdGxldCBibGtzID0gdGhpcy5ibG9ja3Ncblx0ICAgIC5tYXAoYmxrID0+IHtcblx0ICAgICAgICByZXR1cm4ge1xuXHRcdCAgICBibG9ja0lkOiAgIGJsay5ibG9ja0lkLFxuXHRcdCAgICBvcmk6ICAgICAgIGJsay5ibG9ja09yaSxcblx0XHQgICAgZnJvbUNocjogICBibGtbZnJvbUNdLFxuXHRcdCAgICBmcm9tU3RhcnQ6IGJsa1tmcm9tU10sXG5cdFx0ICAgIGZyb21FbmQ6ICAgYmxrW2Zyb21FXSxcblx0XHQgICAgZnJvbUluZGV4OiBibGtbZnJvbUldLFxuXHRcdCAgICB0b0NocjogICAgIGJsa1t0b0NdLFxuXHRcdCAgICB0b1N0YXJ0OiAgIGJsa1t0b1NdLFxuXHRcdCAgICB0b0VuZDogICAgIGJsa1t0b0VdLFxuXHRcdCAgICB0b0luZGV4OiAgIGJsa1t0b0ldXG5cdFx0fTtcblx0ICAgIH0pXG5cdC8vIFxuXHRyZXR1cm4gYmxrcztcbiAgICB9XG59XG5cbmV4cG9ydCB7IEJsb2NrVHJhbnNsYXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQmxvY2tUcmFuc2xhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTVkdWaWV3IH0gZnJvbSAnLi9TVkdWaWV3JztcbmltcG9ydCB7IGNvb3Jkc0FmdGVyVHJhbnNmb3JtIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgR2Vub21lVmlldyBleHRlbmRzIFNWR1ZpZXcge1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCk7XG5cdHRoaXMub3BlbldpZHRoID0gdGhpcy5vdXRlcldpZHRoO1xuXHR0aGlzLm9wZW5IZWlnaHQ9IHRoaXMub3V0ZXJIZWlnaHQ7XG5cdHRoaXMudG90YWxDaHJXaWR0aCA9IDQwOyAvLyB0b3RhbCB3aWR0aCBvZiBvbmUgY2hyb21vc29tZSAoYmFja2JvbmUrYmxvY2tzK2ZlYXRzKVxuXHR0aGlzLmN3aWR0aCA9IDIwOyAgICAgICAgLy8gY2hyb21vc29tZSB3aWR0aFxuXHR0aGlzLnRpY2tMZW5ndGggPSAxMDtcdCAvLyBmZWF0dXJlIHRpY2sgbWFyayBsZW5ndGhcblx0dGhpcy5icnVzaENociA9IG51bGw7XHQgLy8gd2hpY2ggY2hyIGhhcyB0aGUgY3VycmVudCBicnVzaFxuXHR0aGlzLmJ3aWR0aCA9IHRoaXMuY3dpZHRoLzI7ICAvLyBibG9jayB3aWR0aFxuXHR0aGlzLmN1cnJCbG9ja3MgPSBudWxsO1xuXHR0aGlzLmN1cnJUaWNrcyA9IG51bGw7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzID0gdGhpcy5zdmdNYWluLmFwcGVuZCgnZycpLmF0dHIoXCJuYW1lXCIsIFwiY2hyb21vc29tZXNcIik7XG5cdHRoaXMudGl0bGUgICAgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCd0ZXh0JykuYXR0cihcImNsYXNzXCIsIFwidGl0bGVcIik7XG5cdHRoaXMuc2Nyb2xsQW1vdW50ID0gMDtcblx0Ly9cblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZpdFRvV2lkdGggKHcpe1xuICAgICAgICBzdXBlci5maXRUb1dpZHRoKHcpO1xuXHR0aGlzLm9wZW5XaWR0aCA9IHRoaXMub3V0ZXJXaWR0aDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdERvbSAoKSB7XG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b24uY2xvc2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHRoaXMucmVkcmF3KCkpO1xuXHR0aGlzLnN2Zy5vbihcIndoZWVsXCIsICgpID0+IHtcblx0ICAgIGlmICghdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIikpIHJldHVybjtcblx0ICAgIHRoaXMuc2Nyb2xsV2hlZWwoZDMuZXZlbnQuZGVsdGFZKVxuXHQgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fSk7XG5cdGxldCBzYnMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInN2Z2NvbnRhaW5lclwiXSA+IFtuYW1lPVwic2Nyb2xsYnV0dG9uc1wiXScpXG5cdHNicy5zZWxlY3QoJy5idXR0b25bbmFtZT1cInVwXCJdJykub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNjcm9sbENocm9tb3NvbWVzVXAoKSk7XG5cdHNicy5zZWxlY3QoJy5idXR0b25bbmFtZT1cImRuXCJdJykub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNjcm9sbENocm9tb3NvbWVzRG93bigpKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRCcnVzaENvb3JkcyAoY29vcmRzKSB7XG5cdHRoaXMuY2xlYXJCcnVzaGVzKCk7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdChgLmNocm9tb3NvbWVbbmFtZT1cIiR7Y29vcmRzLmNocn1cIl0gZ1tuYW1lPVwiYnJ1c2hcIl1gKVxuXHQgIC5lYWNoKGZ1bmN0aW9uKGNocil7XG5cdCAgICBjaHIuYnJ1c2guZXh0ZW50KFtjb29yZHMuc3RhcnQsY29vcmRzLmVuZF0pO1xuXHQgICAgY2hyLmJydXNoKGQzLnNlbGVjdCh0aGlzKSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBicnVzaHN0YXJ0IChjaHIpe1xuXHR0aGlzLmNsZWFyQnJ1c2hlcyhjaHIuYnJ1c2gpO1xuXHR0aGlzLmJydXNoQ2hyID0gY2hyO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJydXNoZW5kICgpe1xuXHRpZighdGhpcy5icnVzaENocikgcmV0dXJuO1xuXHRsZXQgY2MgPSB0aGlzLmFwcC5jb29yZHM7XG5cdHZhciB4dG50ID0gdGhpcy5icnVzaENoci5icnVzaC5leHRlbnQoKTtcblx0aWYgKE1hdGguYWJzKHh0bnRbMF0gLSB4dG50WzFdKSA8PSAxMCl7XG5cdCAgICAvLyB1c2VyIGNsaWNrZWRcblx0ICAgIGxldCB3ID0gY2MuZW5kIC0gY2Muc3RhcnQgKyAxO1xuXHQgICAgeHRudFswXSAtPSB3LzI7XG5cdCAgICB4dG50WzFdICs9IHcvMjtcblx0fVxuXHRsZXQgY29vcmRzID0geyBjaHI6dGhpcy5icnVzaENoci5uYW1lLCBzdGFydDpNYXRoLmZsb29yKHh0bnRbMF0pLCBlbmQ6IE1hdGguZmxvb3IoeHRudFsxXSkgfTtcblx0dGhpcy5hcHAuc2V0Q29udGV4dChjb29yZHMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQnJ1c2hlcyAoZXhjZXB0KXtcblx0dGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKCdbbmFtZT1cImJydXNoXCJdJykuZWFjaChmdW5jdGlvbihjaHIpe1xuXHQgICAgaWYgKGNoci5icnVzaCAhPT0gZXhjZXB0KSB7XG5cdFx0Y2hyLmJydXNoLmNsZWFyKCk7XG5cdFx0Y2hyLmJydXNoKGQzLnNlbGVjdCh0aGlzKSk7XG5cdCAgICB9XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldFggKGNocikge1xuXHRsZXQgeCA9IHRoaXMuYXBwLnJHZW5vbWUueHNjYWxlKGNocik7XG5cdGlmIChpc05hTih4KSkgdGhyb3cgXCJ4IGlzIE5hTlwiXG5cdHJldHVybiB4O1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRZIChwb3MpIHtcblx0bGV0IHkgPSB0aGlzLmFwcC5yR2Vub21lLnlzY2FsZShwb3MpO1xuXHRpZiAoaXNOYU4oeSkpIHRocm93IFwieSBpcyBOYU5cIlxuXHRyZXR1cm4geTtcbiAgICB9XG4gICAgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVkcmF3ICgpIHtcbiAgICAgICAgdGhpcy5kcmF3KHRoaXMuY3VyclRpY2tzLCB0aGlzLmN1cnJCbG9ja3MpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRyYXcgKHRpY2tEYXRhLCBibG9ja0RhdGEpIHtcblx0dGhpcy5kcmF3Q2hyb21vc29tZXMoKTtcblx0dGhpcy5kcmF3QmxvY2tzKGJsb2NrRGF0YSk7XG5cdHRoaXMuZHJhd1RpY2tzKHRpY2tEYXRhKTtcblx0dGhpcy5kcmF3VGl0bGUoKTtcblx0dGhpcy5zZXRCcnVzaENvb3Jkcyh0aGlzLmFwcC5jb29yZHMpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSBjaHJvbW9zb21lcyBvZiB0aGUgcmVmZXJlbmNlIGdlbm9tZS5cbiAgICAvLyBJbmNsdWRlcyBiYWNrYm9uZXMsIGxhYmVscywgYW5kIGJydXNoZXMuXG4gICAgLy8gVGhlIGJhY2tib25lcyBhcmUgZHJhd24gYXMgdmVydGljYWwgbGluZSBzZW1lbnRzLFxuICAgIC8vIGRpc3RyaWJ1dGVkIGhvcml6b250YWxseS4gT3JkZXJpbmcgaXMgZGVmaW5lZCBieVxuICAgIC8vIHRoZSBtb2RlbCAoR2Vub21lIG9iamVjdCkuXG4gICAgLy8gTGFiZWxzIGFyZSBkcmF3biBhYm92ZSB0aGUgYmFja2JvbmVzLlxuICAgIC8vXG4gICAgLy8gTW9kaWZpY2F0aW9uOlxuICAgIC8vIERyYXdzIHRoZSBzY2VuZSBpbiBvbmUgb2YgdHdvIHN0YXRlczogb3BlbiBvciBjbG9zZWQuXG4gICAgLy8gVGhlIG9wZW4gc3RhdGUgaXMgYXMgZGVzY3JpYmVkIC0gYWxsIGNocm9tb3NvbWVzIHNob3duLlxuICAgIC8vIEluIHRoZSBjbG9zZWQgc3RhdGU6IFxuICAgIC8vICAgICAqIG9ubHkgb25lIGNocm9tb3NvbWUgc2hvd3MgKHRoZSBjdXJyZW50IG9uZSlcbiAgICAvLyAgICAgKiBkcmF3biBob3Jpem9udGFsbHkgYW5kIHBvc2l0aW9uZWQgYmVzaWRlIHRoZSBcIkdlbm9tZSBWaWV3XCIgdGl0bGVcbiAgICAvL1xuICAgIGRyYXdDaHJvbW9zb21lcyAoKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblxuXHRsZXQgcmcgPSB0aGlzLmFwcC5yR2Vub21lOyAvLyByZWYgZ2Vub21lXG5cdGxldCByQ2hycyA9IHJnLmNocm9tb3NvbWVzO1xuXG4gICAgICAgIC8vIENocm9tb3NvbWUgZ3JvdXBzXG5cdGxldCBjaHJzID0gdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKFwiLmNocm9tb3NvbWVcIilcblx0ICAgIC5kYXRhKHJDaHJzLCBjID0+IGMubmFtZSk7XG5cdGxldCBuZXdjaHJzID0gY2hycy5lbnRlcigpLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjaHJvbW9zb21lXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgYyA9PiBjLm5hbWUpO1xuXHRcblx0bmV3Y2hycy5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJuYW1lXCIsXCJsYWJlbFwiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJsaW5lXCIpLmF0dHIoXCJuYW1lXCIsXCJiYWNrYm9uZVwiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJzeW5CbG9ja3NcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwidGlja3NcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwiYnJ1c2hcIik7XG5cblxuXHRsZXQgY2xvc2VkID0gdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIik7XG5cdGlmIChjbG9zZWQpIHtcblx0ICAgIC8vIFJlc2V0IHRoZSBTVkcgc2l6ZSB0byBiZSAxLWNocm9tb3NvbWUgd2lkZS5cblx0ICAgIC8vIFRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAgc28gdGhhdCB0aGUgY3VycmVudCBjaHJvbW9zb21lIGFwcGVhcnMgaW4gdGhlIHN2ZyBhcmVhLlxuXHQgICAgLy8gVHVybiBpdCA5MCBkZWcuXG5cblx0ICAgIC8vIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBTVkcgYXJlYSB0byAxIGNocm9tb3NvbWUncyB3aWR0aFxuXHQgICAgdGhpcy5zZXRHZW9tKHsgaGVpZ2h0OiB0aGlzLnRvdGFsQ2hyV2lkdGgsIHJvdGF0aW9uOiAtOTAsIHRyYW5zbGF0aW9uOiBbLXRoaXMudG90YWxDaHJXaWR0aC8yLDMwXSB9KTtcblx0ICAgIC8vIFxuXHQgICAgbGV0IGRlbHRhID0gMTA7XG5cdCAgICByZy54c2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcblx0XHQgLmRvbWFpbihyQ2hycy5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHgubmFtZTt9KSlcblx0XHQgLy8gaW4gY2xvc2VkIG1vZGUsIHRoZSBjaHJvbW9zb21lcyBoYXZlIGZpeGVkIHNwYWNpbmdcblx0XHQgLnJhbmdlUG9pbnRzKFtkZWx0YSwgZGVsdGErdGhpcy50b3RhbENocldpZHRoKihyQ2hycy5sZW5ndGgtMSldKTtcblx0ICAgIC8vXG5cdCAgICByZy55c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdCAuZG9tYWluKFsxLHJnLm1heGxlbl0pXG5cdFx0IC5yYW5nZShbMCwgdGhpcy53aWR0aF0pO1xuXG5cdCAgICAvLyB0cmFuc2xhdGUgZWFjaCBjaHJvbW9zb21lIGludG8gcG9zaXRpb25cblx0ICAgIGNocnMuYXR0cihcInRyYW5zZm9ybVwiLCBjID0+IGB0cmFuc2xhdGUoJHtyZy54c2NhbGUoYy5uYW1lKX0sIDApYCk7XG4gICAgICAgICAgICAvLyB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKC1yZy54c2NhbGUodGhpcy5hcHAuY29vcmRzLmNocikpO1xuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIC8vIFdoZW4gb3BlbiwgZHJhdyBhbGwgdGhlIGNocm9tb3NvbWVzLiBFYWNoIGNocm9tIGlzIGEgdmVydGljYWwgbGluZS5cblx0ICAgIC8vIENocm9tcyBhcmUgZGlzdHJpYnV0ZWQgZXZlbmx5IGFjcm9zcyB0aGUgYXZhaWxhYmxlIGhvcml6b250YWwgc3BhY2UuXG5cdCAgICB0aGlzLnNldEdlb20oeyB3aWR0aDogdGhpcy5vcGVuV2lkdGgsIGhlaWdodDogdGhpcy5vcGVuSGVpZ2h0LCByb3RhdGlvbjogMCwgdHJhbnNsYXRpb246IFswLDBdIH0pO1xuXHQgICAgLy8gXG5cdCAgICByZy54c2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcblx0XHQgLmRvbWFpbihyQ2hycy5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHgubmFtZTt9KSlcblx0XHQgLy8gaW4gY2xvc2VkIG1vZGUsIHRoZSBjaHJvbW9zb21lcyBzcHJlYWQgdG8gZmlsbCB0aGUgc3BhY2Vcblx0XHQgLnJhbmdlUG9pbnRzKFswLCB0aGlzLm9wZW5XaWR0aCAtIDMwXSwgMC41KTtcblx0ICAgIHJnLnlzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0IC5kb21haW4oWzEscmcubWF4bGVuXSlcblx0XHQgLnJhbmdlKFswLCB0aGlzLmhlaWdodF0pO1xuXG5cdCAgICAvLyB0cmFuc2xhdGUgZWFjaCBjaHJvbW9zb21lIGludG8gcG9zaXRpb25cblx0ICAgIGNocnMuYXR0cihcInRyYW5zZm9ybVwiLCBjID0+IGB0cmFuc2xhdGUoJHtyZy54c2NhbGUoYy5uYW1lKX0sIDApYCk7XG4gICAgICAgICAgICAvLyB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKDApO1xuXHR9XG5cblx0ckNocnMuZm9yRWFjaChjaHIgPT4ge1xuXHQgICAgdmFyIHNjID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQuZG9tYWluKFsxLGNoci5sZW5ndGhdKVxuXHRcdC5yYW5nZShbMCwgcmcueXNjYWxlKGNoci5sZW5ndGgpXSk7XG5cdCAgICBjaHIuYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKS55KHNjKVxuXHQgICAgICAgLm9uKFwiYnJ1c2hzdGFydFwiLCBjaHIgPT4gdGhpcy5icnVzaHN0YXJ0KGNocikpXG5cdCAgICAgICAub24oXCJicnVzaGVuZFwiLCAoKSA9PiB0aGlzLmJydXNoZW5kKCkpO1xuXHQgIH0sIHRoaXMpO1xuXG5cbiAgICAgICAgY2hycy5zZWxlY3QoJ1tuYW1lPVwibGFiZWxcIl0nKVxuXHQgICAgLnRleHQoYz0+Yy5uYW1lKVxuXHQgICAgLmF0dHIoXCJ4XCIsIDApIFxuXHQgICAgLmF0dHIoXCJ5XCIsIC0yKVxuXHQgICAgO1xuXG5cdGNocnMuc2VsZWN0KCdbbmFtZT1cImJhY2tib25lXCJdJylcblx0ICAgIC5hdHRyKFwieDFcIiwgMClcblx0ICAgIC5hdHRyKFwieTFcIiwgMClcblx0ICAgIC5hdHRyKFwieDJcIiwgMClcblx0ICAgIC5hdHRyKFwieTJcIiwgYyA9PiByZy55c2NhbGUoYy5sZW5ndGgpKVxuXHQgICAgO1xuXHQgICBcblx0Y2hycy5zZWxlY3QoJ1tuYW1lPVwiYnJ1c2hcIl0nKVxuXHQgICAgLmVhY2goZnVuY3Rpb24oZCl7ZDMuc2VsZWN0KHRoaXMpLmNhbGwoZC5icnVzaCk7fSlcblx0ICAgIC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHQgICAgIC5hdHRyKCd3aWR0aCcsMTApXG5cdCAgICAgLmF0dHIoJ3gnLCAtNSlcblx0ICAgIDtcblxuXHRjaHJzLmV4aXQoKS5yZW1vdmUoKTtcblx0XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2Nyb2xsIHdoZWVsIGV2ZW50IGhhbmRsZXIuXG4gICAgc2Nyb2xsV2hlZWwgKGR5KSB7XG5cdC8vIEFkZCBkeSB0byB0b3RhbCBzY3JvbGwgYW1vdW50LiBUaGVuIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNCeShkeSk7XG5cdC8vIEFmdGVyIGEgMjAwIG1zIHBhdXNlIGluIHNjcm9sbGluZywgc25hcCB0byBuZWFyZXN0IGNocm9tb3NvbWVcblx0dGhpcy50b3V0ICYmIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50b3V0KTtcblx0dGhpcy50b3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCk9PnRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCksIDIwMCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzVG8gKHgpIHtcbiAgICAgICAgaWYgKHggPT09IHVuZGVmaW5lZCkgeCA9IHRoaXMuc2Nyb2xsQW1vdW50O1xuXHR0aGlzLnNjcm9sbEFtb3VudCA9IE1hdGgubWF4KE1hdGgubWluKHgsMTUpLCAtdGhpcy50b3RhbENocldpZHRoICogKHRoaXMuYXBwLnJHZW5vbWUuY2hyb21vc29tZXMubGVuZ3RoLTEpKTtcblx0dGhpcy5nQ2hyb21vc29tZXMuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7dGhpcy5zY3JvbGxBbW91bnR9LDApYCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzQnkgKGR4KSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbyh0aGlzLnNjcm9sbEFtb3VudCArIGR4KTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNTbmFwICgpIHtcblx0bGV0IGkgPSBNYXRoLnJvdW5kKHRoaXMuc2Nyb2xsQW1vdW50IC8gdGhpcy50b3RhbENocldpZHRoKVxuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oaSp0aGlzLnRvdGFsQ2hyV2lkdGgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc1VwICgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc0J5KC10aGlzLnRvdGFsQ2hyV2lkdGgpO1xuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc0Rvd24gKCkge1xuICAgICAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzQnkodGhpcy50b3RhbENocldpZHRoKTtcblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZHJhd1RpdGxlICgpIHtcblx0bGV0IHJlZmcgPSB0aGlzLmFwcC5yR2Vub21lLmxhYmVsO1xuXHRsZXQgYmxvY2tnID0gdGhpcy5jdXJyQmxvY2tzID8gXG5cdCAgICB0aGlzLmN1cnJCbG9ja3MuY29tcCAhPT0gdGhpcy5hcHAuckdlbm9tZSA/XG5cdCAgICAgICAgdGhpcy5jdXJyQmxvY2tzLmNvbXAubGFiZWxcblx0XHQ6XG5cdFx0bnVsbFxuXHQgICAgOlxuXHQgICAgbnVsbDtcblx0bGV0IGxzdCA9IHRoaXMuYXBwLmN1cnJMaXN0ID8gdGhpcy5hcHAuY3Vyckxpc3QubmFtZSA6IG51bGw7XG5cblx0dGhpcy5yb290LnNlbGVjdChcImxhYmVsIHNwYW4udGl0bGVcIikudGV4dChyZWZnKTtcblxuXHRsZXQgbGluZXMgPSBbXTtcblx0YmxvY2tnICYmIGxpbmVzLnB1c2goYEJsb2NrcyB2cy4gJHtibG9ja2d9YCk7XG5cdGxzdCAmJiBsaW5lcy5wdXNoKGBGZWF0dXJlcyBmcm9tIGxpc3QgXCIke2xzdH1cImApO1xuXHRsZXQgc3VidCA9IGxpbmVzLmpvaW4oXCIgOjogXCIpO1xuXHR0aGlzLnJvb3Quc2VsZWN0KFwibGFiZWwgc3Bhbi5zdWJ0aXRsZVwiKS50ZXh0KChzdWJ0ID8gXCI6OiBcIiA6IFwiXCIpICsgc3VidCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIG91dGxpbmVzIG9mIHN5bnRlbnkgYmxvY2tzIG9mIHRoZSByZWYgZ2Vub21lIHZzLlxuICAgIC8vIHRoZSBnaXZlbiBnZW5vbWUuXG4gICAgLy8gUGFzc2luZyBudWxsIGVyYXNlcyBhbGwgc3ludGVueSBibG9ja3MuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBkYXRhID09IHsgcmVmOkdlbm9tZSwgY29tcDpHZW5vbWUsIGJsb2NrczogbGlzdCBvZiBzeW50ZW55IGJsb2NrcyB9XG4gICAgLy8gICAgRWFjaCBzYmxvY2sgPT09IHsgYmxvY2tJZDppbnQsIG9yaTorLy0sIGZyb21DaHIsIGZyb21TdGFydCwgZnJvbUVuZCwgdG9DaHIsIHRvU3RhcnQsIHRvRW5kIH1cbiAgICBkcmF3QmxvY2tzIChkYXRhKSB7XG5cdC8vXG4gICAgICAgIGxldCBzYmdycHMgPSB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoXCIuY2hyb21vc29tZVwiKS5zZWxlY3QoJ1tuYW1lPVwic3luQmxvY2tzXCJdJyk7XG5cdGlmICghZGF0YSB8fCAhZGF0YS5ibG9ja3MgfHwgZGF0YS5ibG9ja3MubGVuZ3RoID09PSAwKSB7XG5cdCAgICB0aGlzLmN1cnJCbG9ja3MgPSBudWxsO1xuXHQgICAgc2JncnBzLmh0bWwoJycpO1xuXHQgICAgdGhpcy5kcmF3VGl0bGUoKTtcblx0ICAgIHJldHVybjtcblx0fVxuXHR0aGlzLmN1cnJCbG9ja3MgPSBkYXRhO1xuXHQvLyByZW9yZ2FuaXplIGRhdGEgdG8gcmVmbGVjdCBTVkcgc3RydWN0dXJlIHdlIHdhbnQsIGllLCBncm91cGVkIGJ5IGNocm9tb3NvbWVcbiAgICAgICAgbGV0IGR4ID0gZGF0YS5ibG9ja3MucmVkdWNlKChhLHNiKSA9PiB7XG5cdFx0aWYgKCFhW3NiLmZyb21DaHJdKSBhW3NiLmZyb21DaHJdID0gW107XG5cdFx0YVtzYi5mcm9tQ2hyXS5wdXNoKHNiKTtcblx0XHRyZXR1cm4gYTtcblx0ICAgIH0sIHt9KTtcblx0c2JncnBzLmVhY2goZnVuY3Rpb24oYyl7XG5cdCAgICBkMy5zZWxlY3QodGhpcykuZGF0dW0oe2NocjogYy5uYW1lLCBibG9ja3M6IGR4W2MubmFtZV0gfHwgW10gfSk7XG5cdH0pO1xuXG5cdGxldCBid2lkdGggPSAxMDtcbiAgICAgICAgbGV0IHNibG9ja3MgPSBzYmdycHMuc2VsZWN0QWxsKCdyZWN0LnNibG9jaycpLmRhdGEoYj0+Yi5ibG9ja3MpO1xuICAgICAgICBsZXQgbmV3YnMgPSBzYmxvY2tzLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuYXR0cignY2xhc3MnLCdzYmxvY2snKTtcblx0c2Jsb2Nrc1xuXHQgICAgLmF0dHIoXCJ4XCIsIC1id2lkdGgvMiApXG5cdCAgICAuYXR0cihcInlcIiwgYiA9PiB0aGlzLmdldFkoYi5mcm9tU3RhcnQpKVxuXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCBid2lkdGgpXG5cdCAgICAuYXR0cihcImhlaWdodFwiLCBiID0+IE1hdGgubWF4KDAsdGhpcy5nZXRZKGIuZnJvbUVuZCAtIGIuZnJvbVN0YXJ0ICsgMSkpKVxuXHQgICAgLmNsYXNzZWQoXCJpbnZlcnNpb25cIiwgYiA9PiBiLm9yaSA9PT0gXCItXCIpXG5cdCAgICAuY2xhc3NlZChcInRyYW5zbG9jYXRpb25cIiwgYiA9PiBiLmZyb21DaHIgIT09IGIudG9DaHIpXG5cdCAgICA7XG5cbiAgICAgICAgc2Jsb2Nrcy5leGl0KCkucmVtb3ZlKCk7XG5cblx0dGhpcy5kcmF3VGl0bGUoKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3VGlja3MgKGZlYXR1cmVzKSB7XG5cdHRoaXMuY3VyclRpY2tzID0gZmVhdHVyZXM7XG5cdGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7IC8vIHJlZiBnZW5vbWVcblx0Ly8gZmVhdHVyZSB0aWNrIG1hcmtzXG5cdGlmICghZmVhdHVyZXMgfHwgZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XG5cdCAgICB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoJ1tuYW1lPVwidGlja3NcIl0nKS5zZWxlY3RBbGwoXCIuZmVhdHVyZVwiKS5yZW1vdmUoKTtcblx0ICAgIHJldHVybjtcblx0fVxuXG5cdC8vXG5cdGxldCB0R3JwcyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpLnNlbGVjdCgnW25hbWU9XCJ0aWNrc1wiXScpO1xuXG5cdC8vIGdyb3VwIGZlYXR1cmVzIGJ5IGNocm9tb3NvbWVcbiAgICAgICAgbGV0IGZpeCA9IGZlYXR1cmVzLnJlZHVjZSgoYSxmKSA9PiB7IFxuXHQgICAgaWYgKCEgYVtmLmNocl0pIGFbZi5jaHJdID0gW107XG5cdCAgICBhW2YuY2hyXS5wdXNoKGYpO1xuXHQgICAgcmV0dXJuIGE7XG5cdH0sIHt9KVxuXHR0R3Jwcy5lYWNoKGZ1bmN0aW9uKGMpIHtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5kYXR1bSggeyBjaHI6IGMsIGZlYXR1cmVzOiBmaXhbYy5uYW1lXSAgfHwgW119ICk7XG5cdH0pO1xuXG5cdC8vIHRoZSB0aWNrIGVsZW1lbnRzXG4gICAgICAgIGxldCBmZWF0cyA9IHRHcnBzLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpXG5cdCAgICAuZGF0YShkID0+IGQuZmVhdHVyZXMsIGQgPT4gZC5tZ3BpZCk7XG5cdC8vXG5cdGxldCB4QWRqID0gZiA9PiAoZi5zdHJhbmQgPT09IFwiK1wiID8gdGhpcy50aWNrTGVuZ3RoIDogLXRoaXMudGlja0xlbmd0aCk7XG5cdC8vXG5cdGxldCBzaGFwZSA9IFwiY2lyY2xlXCI7ICAvLyBcImNpcmNsZVwiIG9yIFwibGluZVwiXG5cdC8vXG5cdGxldCBuZXdmcyA9IGZlYXRzLmVudGVyKClcblx0ICAgIC5hcHBlbmQoc2hhcGUpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJmZWF0dXJlXCIpXG5cdCAgICAub24oJ2NsaWNrJywgKGYpID0+IHtcblx0XHRsZXQgaSA9IGYuY2Fub25pY2FsfHxmLklEO1xuXHQgICAgICAgIHRoaXMuYXBwLnNldENvbnRleHQoe2xhbmRtYXJrOmksIGhpZ2hsaWdodDpbaV19KTtcblx0ICAgIH0pIDtcblx0bmV3ZnMuYXBwZW5kKFwidGl0bGVcIilcblx0XHQudGV4dChmPT5mLnN5bWJvbCB8fCBmLmlkKTtcblx0aWYgKHNoYXBlID09PSBcImxpbmVcIikge1xuXHQgICAgZmVhdHMuYXR0cihcIngxXCIsIGYgPT4geEFkaihmKSArIDUpXG5cdCAgICBmZWF0cy5hdHRyKFwieTFcIiwgZiA9PiByZy55c2NhbGUoZi5zdGFydCkpXG5cdCAgICBmZWF0cy5hdHRyKFwieDJcIiwgZiA9PiB4QWRqKGYpICsgdGhpcy50aWNrTGVuZ3RoICsgNSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ5MlwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0fVxuXHRlbHNlIHtcblx0ICAgIGZlYXRzLmF0dHIoXCJjeFwiLCBmID0+IHhBZGooZikpXG5cdCAgICBmZWF0cy5hdHRyKFwiY3lcIiwgZiA9PiByZy55c2NhbGUoZi5zdGFydCkpXG5cdCAgICBmZWF0cy5hdHRyKFwiclwiLCAgdGhpcy50aWNrTGVuZ3RoIC8gMik7XG5cdH1cblx0Ly9cblx0ZmVhdHMuZXhpdCgpLnJlbW92ZSgpXG4gICAgfVxufSAvLyBlbmQgY2xhc3MgR2Vub21lVmlld1xuXG5leHBvcnQgeyBHZW5vbWVWaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9HZW5vbWVWaWV3LmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5cbmNsYXNzIEZlYXR1cmVEZXRhaWxzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLmluaXREb20gKCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdERvbSAoKSB7XG5cdC8vXG5cdHRoaXMucm9vdC5zZWxlY3QgKFwiLmJ1dHRvbi5jbG9zZVwiKVxuXHQgICAgLm9uKFwiY2xpY2suZXh0cmFcIiwgKCkgPT4gdGhpcy51cGRhdGUoKSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy9cbiAgICB1cGRhdGUoZikge1xuXHQvLyBpZiBjYWxsZWQgd2l0aCBubyBhcmdzLCB1cGRhdGUgdXNpbmcgdGhlIHByZXZpb3VzIGZlYXR1cmVcblx0ZiA9IGYgfHwgdGhpcy5sYXN0RmVhdHVyZTtcblx0aWYgKCFmKSB7XG5cdCAgIC8vIEZJWE1FOiBtYWpvciByZWFjaG92ZXIgaW4gdGhpcyBzZWN0aW9uXG5cdCAgIC8vXG5cdCAgIC8vIGZhbGxiYWNrLiB0YWtlIHRoZSBmaXJzdCBoaWdobGlnaHRlZC5cblx0ICAgbGV0IHIgPSB0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcInJlY3QuZmVhdHVyZS5oaWdobGlnaHRcIilbMF1bMF07XG5cdCAgIC8vIGZhbGxiYWNrLiB0YWtlIHRoZSBmaXJzdCBmZWF0dXJlXG5cdCAgIGlmICghcikgciA9IHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwicmVjdC5mZWF0dXJlXCIpWzBdWzBdO1xuXHQgICBpZiAocikgZiA9IHIuX19kYXRhX187XG5cdH1cblx0Ly8gcmVtZW1iZXJcbiAgICAgICAgaWYgKCFmKSB0aHJvdyBcIkNhbm5vdCB1cGRhdGUgZmVhdHVyZSBkZXRhaWxzLiBObyBmZWF0dXJlLlwiO1xuXHR0aGlzLmxhc3RGZWF0dXJlID0gZjtcblxuXHQvLyBsaXN0IG9mIGZlYXR1cmVzIHRvIHNob3cgaW4gZGV0YWlscyBhcmVhLlxuXHQvLyB0aGUgZ2l2ZW4gZmVhdHVyZSBhbmQgYWxsIGVxdWl2YWxlbnRzIGluIG90aGVyIGdlbm9tZXMuXG5cdGxldCBmbGlzdCA9IFtmXTtcblx0aWYgKGYubWdpaWQpIHtcblx0ICAgIC8vIEZJWE1FOiByZWFjaG92ZXJcblx0ICAgIGZsaXN0ID0gdGhpcy5hcHAuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkKGYubWdpaWQpO1xuXHR9XG5cdC8vIEdvdCB0aGUgbGlzdC4gTm93IG9yZGVyIGl0IHRoZSBzYW1lIGFzIHRoZSBkaXNwbGF5ZWQgZ2Vub21lc1xuXHQvLyBidWlsZCBpbmRleCBvZiBnZW5vbWUgbmFtZSAtPiBmZWF0dXJlIGluIGZsaXN0XG5cdGxldCBpeCA9IGZsaXN0LnJlZHVjZSgoYWNjLGYpID0+IHsgYWNjW2YuZ2Vub21lLm5hbWVdID0gZjsgcmV0dXJuIGFjYzsgfSwge30pXG5cdGxldCBnZW5vbWVPcmRlciA9IChbdGhpcy5hcHAuckdlbm9tZV0uY29uY2F0KHRoaXMuYXBwLmNHZW5vbWVzKSk7XG5cdGZsaXN0ID0gZ2Vub21lT3JkZXIubWFwKGcgPT4gaXhbZy5uYW1lXSB8fCBudWxsKTtcblx0Ly9cblx0bGV0IGNvbEhlYWRlcnMgPSBbXG5cdCAgICAvLyBjb2x1bW5zIGhlYWRlcnMgYW5kIHRoZWlyICUgd2lkdGhzXG5cdCAgICBbXCJHZW5vbWVcIiAgICAgLDldLFxuXHQgICAgW1wiTUdQIGlkXCIgICAgICwxN10sXG5cdCAgICBbXCJUeXBlXCIgICAgICAgLDEwLjVdLFxuXHQgICAgW1wiQmlvVHlwZVwiICAgICwxOC41XSxcblx0ICAgIFtcIkNvb3Jkc1wiICAgICAsMThdLFxuXHQgICAgW1wiTGVuZ3RoXCIgICAgICw3XSxcblx0ICAgIFtcIk1HSSBpZFwiICAgICAsMTBdLFxuXHQgICAgW1wiTUdJIHN5bWJvbFwiICwxMF1cblx0XTtcblx0Ly8gSW4gdGhlIGNsb3NlZCBzdGF0ZSwgb25seSBzaG93IHRoZSBoZWFkZXIgYW5kIHRoZSByb3cgZm9yIHRoZSBwYXNzZWQgZmVhdHVyZVxuXHRpZiAodGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgZmxpc3QgPSBmbGlzdC5maWx0ZXIoIChmZiwgaSkgPT4gZmYgPT09IGYgKTtcblx0Ly8gRHJhdyB0aGUgdGFibGVcblx0bGV0IHQgPSB0aGlzLnJvb3Quc2VsZWN0KCd0YWJsZScpO1xuXHRsZXQgcm93cyA9IHQuc2VsZWN0QWxsKCd0cicpLmRhdGEoIFtjb2xIZWFkZXJzXS5jb25jYXQoZmxpc3QpICk7XG5cdHJvd3MuZW50ZXIoKS5hcHBlbmQoJ3RyJylcblx0ICAub24oXCJtb3VzZWVudGVyXCIsIChmLGkpID0+IGkgIT09IDAgJiYgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KGYsIHRydWUpKVxuXHQgIC5vbihcIm1vdXNlbGVhdmVcIiwgKGYsaSkgPT4gaSAhPT0gMCAmJiB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoKSk7XG5cdCAgICAgIFxuXHRyb3dzLmV4aXQoKS5yZW1vdmUoKTtcblx0cm93cy5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIChmZiwgaSkgPT4gKGkgIT09IDAgJiYgZmYgPT09IGYpKTtcblx0Ly9cblx0Ly8gR2l2ZW4gYSBmZWF0dXJlLCByZXR1cm5zIGEgbGlzdCBvZiBzdHJpbmdzIGZvciBwb3B1bGF0aW5nIGEgdGFibGUgcm93LlxuXHQvLyBJZiBpPT09MCwgdGhlbiBmIGlzIG5vdCBhIGZlYXR1cmUsIGJ1dCBhIGxpc3QgY29sdW1ucyBuYW1lcyt3aWR0aHMuXG5cdC8vIFxuXHRsZXQgY2VsbERhdGEgPSBmdW5jdGlvbiAoZiwgaSkge1xuXHQgICAgaWYgKGkgPT09IDApIHtcblx0XHRyZXR1cm4gZjtcblx0ICAgIH1cblx0ICAgIGxldCBjZWxsRGF0YSA9IFsgZ2Vub21lT3JkZXJbaS0xXS5sYWJlbCwgXCIuXCIsIFwiLlwiLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiwgXCIuXCIgXTtcblx0ICAgIC8vIGYgaXMgbnVsbCBpZiBpdCBkb2Vzbid0IGV4aXN0IGZvciBnZW5vbWUgaSBcblx0ICAgIGlmIChmKSB7XG5cdFx0bGV0IGxpbmsgPSBcIlwiO1xuXHRcdGxldCBtZ2lpZCA9IGYubWdpaWQgfHwgXCJcIjtcblx0XHRpZiAobWdpaWQpIHtcblx0XHQgICAgbGV0IHVybCA9IGBodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvYWNjZXNzaW9uLyR7bWdpaWR9YDtcblx0XHQgICAgbGluayA9IGA8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHt1cmx9XCI+JHttZ2lpZH08L2E+YDtcblx0XHR9XG5cdFx0Y2VsbERhdGEgPSBbXG5cdFx0ICAgIGYuZ2Vub21lLmxhYmVsLFxuXHRcdCAgICBmLm1ncGlkLFxuXHRcdCAgICBmLnR5cGUsXG5cdFx0ICAgIGYuYmlvdHlwZSxcblx0XHQgICAgYCR7Zi5jaHJ9OiR7Zi5zdGFydH0uLiR7Zi5lbmR9ICgke2Yuc3RyYW5kfSlgLFxuXHRcdCAgICBgJHtmLmVuZCAtIGYuc3RhcnQgKyAxfSBicGAsXG5cdFx0ICAgIGxpbmsgfHwgbWdpaWQsXG5cdFx0ICAgIGYuc3ltYm9sXG5cdFx0XTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBjZWxsRGF0YTtcblx0fTtcblx0bGV0IGNlbGxzID0gcm93cy5zZWxlY3RBbGwoXCJ0ZFwiKVxuXHQgICAgLmRhdGEoKGYsaSkgPT4gY2VsbERhdGEoZixpKSk7XG5cdGNlbGxzLmVudGVyKCkuYXBwZW5kKFwidGRcIik7XG5cdGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcblx0Y2VsbHMuaHRtbCgoZCxpLGopID0+IHtcblx0ICAgIHJldHVybiBqID09PSAwID8gZFswXSA6IGRcblx0fSlcblx0LnN0eWxlKFwid2lkdGhcIiwgKGQsaSxqKSA9PiBqID09PSAwID8gYCR7ZFsxXX0lYCA6IG51bGwpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgRmVhdHVyZURldGFpbHMgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTVkdWaWV3IH0gZnJvbSAnLi9TVkdWaWV3JztcbmltcG9ydCB7IEZlYXR1cmUgfSBmcm9tICcuL0ZlYXR1cmUnO1xuaW1wb3J0IHsgcGFyc2VDb29yZHMsIGZvcm1hdENvb3JkcywgY29vcmRzQWZ0ZXJUcmFuc2Zvcm0sIHJlbW92ZUR1cHMgfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBab29tVmlldyBleHRlbmRzIFNWR1ZpZXcge1xuICAgIC8vXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0LCBpbml0aWFsQ29vcmRzLCBpbml0aWFsSGkpIHtcbiAgICAgIHN1cGVyKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIC8vXG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAvL1xuICAgICAgdGhpcy5taW5TdmdIZWlnaHQgPSAyNTA7XG4gICAgICB0aGlzLmJsb2NrSGVpZ2h0ID0gNDA7XG4gICAgICB0aGlzLnRvcE9mZnNldCA9IDQ1O1xuICAgICAgdGhpcy5mZWF0SGVpZ2h0ID0gNjtcdC8vIGhlaWdodCBvZiBhIHJlY3RhbmdsZSByZXByZXNlbnRpbmcgYSBmZWF0dXJlXG4gICAgICB0aGlzLmxhbmVHYXAgPSAyO1x0ICAgICAgICAvLyBzcGFjZSBiZXR3ZWVuIHN3aW0gbGFuZXNcbiAgICAgIHRoaXMubGFuZUhlaWdodCA9IHRoaXMuZmVhdEhlaWdodCArIHRoaXMubGFuZUdhcDtcbiAgICAgIHRoaXMuc3RyaXBIZWlnaHQgPSA3MDsgICAgLy8gaGVpZ2h0IHBlciBnZW5vbWUgaW4gdGhlIHpvb20gdmlld1xuICAgICAgdGhpcy5zdHJpcEdhcCA9IDIwO1x0Ly8gc3BhY2UgYmV0d2VlbiBzdHJpcHNcbiAgICAgIHRoaXMuZG1vZGUgPSAnY29tcGFyaXNvbic7Ly8gZHJhd2luZyBtb2RlLiAnY29tcGFyaXNvbicgb3IgJ3JlZmVyZW5jZSdcblxuICAgICAgLy9cbiAgICAgIC8vIElEcyBvZiBGZWF0dXJlcyB3ZSdyZSBoaWdobGlnaHRpbmcuIE1heSBiZSBtZ3BpZCAgb3IgbWdpSWRcbiAgICAgIC8vIGhpRmVhdHMgaXMgYW4gb2JqIHdob3NlIGtleXMgYXJlIHRoZSBJRHNcbiAgICAgIHRoaXMuaGlGZWF0cyA9IChpbml0aWFsSGkgfHwgW10pLnJlZHVjZSggKGEsdikgPT4geyBhW3ZdPXY7IHJldHVybiBhOyB9LCB7fSApO1xuICAgICAgLy9cbiAgICAgIHRoaXMuZmlkdWNpYWxzID0gdGhpcy5zdmcuaW5zZXJ0KFwiZ1wiLFwiOmZpcnN0LWNoaWxkXCIpIC8vIFxuICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJmaWR1Y2lhbHNcIik7XG4gICAgICB0aGlzLnN0cmlwc0dycCA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIixcInN0cmlwc1wiKTtcbiAgICAgIHRoaXMuYXhpcyA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIixcImF4aXNcIik7XG4gICAgICB0aGlzLmN4dE1lbnUgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImN4dE1lbnVcIl0nKTtcbiAgICAgIC8vXG4gICAgICB0aGlzLmRyYWdnaW5nID0gbnVsbDtcbiAgICAgIHRoaXMuZHJhZ2dlciA9IHRoaXMuZ2V0RHJhZ2dlcigpO1xuICAgICAgLy9cbiAgICAgIHRoaXMuaW5pdERvbSgpO1xuICAgIH1cbiAgICAvL1xuICAgIGluaXREb20gKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCByID0gdGhpcy5yb290O1xuXHRsZXQgYSA9IHRoaXMuYXBwO1xuXHQvL1xuXHRyLnNlbGVjdCgnLmJ1dHRvbi5jbG9zZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4gdGhpcy51cGRhdGUoKSk7XG5cblx0Ly8gem9vbSBjb250cm9sc1xuXHRyLnNlbGVjdChcIiN6b29tT3V0XCIpLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKGEuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdChcIiN6b29tSW5cIikgLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKDEvYS5kZWZhdWx0Wm9vbSkgfSk7XG5cdHIuc2VsZWN0KFwiI3pvb21PdXRNb3JlXCIpLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKDIqYS5kZWZhdWx0Wm9vbSkgfSk7XG5cdHIuc2VsZWN0KFwiI3pvb21Jbk1vcmVcIikgLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKDEvKDIqYS5kZWZhdWx0Wm9vbSkpIH0pO1xuXG5cdC8vIHBhbiBjb250cm9sc1xuXHRyLnNlbGVjdChcIiNwYW5MZWZ0XCIpIC5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEucGFuKC1hLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdChcIiNwYW5SaWdodFwiKS5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEucGFuKCthLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdChcIiNwYW5MZWZ0TW9yZVwiKSAub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigtNSphLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdChcIiNwYW5SaWdodE1vcmVcIikub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigrNSphLmRlZmF1bHRQYW4pIH0pO1xuXG5cdC8vIENyZWF0ZSBjb250ZXh0IG1lbnUuIFxuXHR0aGlzLmluaXRDb250ZXh0TWVudShbe1xuICAgICAgICAgICAgbGFiZWw6IFwiTUdJIFNOUHNcIiwgXG5cdCAgICBpY29uOiBcIm9wZW5faW5fbmV3XCIsXG5cdCAgICB0b29sdGlwOiBcIlZpZXcgU05QcyBhdCBNR0kgZm9yIHRoZSBjdXJyZW50IHN0cmFpbnMgaW4gdGhlIGN1cnJlbnQgcmVnaW9uLiAoU29tZSBzdHJhaW5zIG5vdCBhdmFpbGFibGUuKVwiLFxuXHQgICAgaGFuZGxlcjogKCk9PiB0aGlzLmFwcC5saW5rVG9NZ2lTbnBSZXBvcnQoKVxuXHR9LHtcbiAgICAgICAgICAgIGxhYmVsOiBcIk1HSSBRVExzXCIsIFxuXHQgICAgaWNvbjogIFwib3Blbl9pbl9uZXdcIixcblx0ICAgIHRvb2x0aXA6IFwiVmlldyBRVEwgYXQgTUdJIHRoYXQgb3ZlcmxhcCB0aGUgY3VycmVudCByZWdpb24uXCIsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naVFUTHMoKVxuXHR9LHtcbiAgICAgICAgICAgIGxhYmVsOiBcIk1HSSBKQnJvd3NlXCIsIFxuXHQgICAgaWNvbjogXCJvcGVuX2luX25ld1wiLFxuXHQgICAgdG9vbHRpcDogXCJPcGVuIE1HSSBKQnJvd3NlIChDNTdCTC82SiBHUkNtMzgpIHdpdGggdGhlIGN1cnJlbnQgY29vcmRpbmF0ZSByYW5nZS5cIixcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpSkJyb3dzZSgpXG5cdH1dKTtcblx0dGhpcy5yb290XG5cdCAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHQgICAgICAvLyBjbGljayBvbiBiYWNrZ3JvdW5kID0+IGhpZGUgY29udGV4dCBtZW51XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICh0Z3QudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlcIiAmJiB0Z3QuaW5uZXJIVE1MID09PSBcIm1lbnVcIilcblx0XHQgIC8vIGV4Y2VwdGlvbjogdGhlIGNvbnRleHQgbWVudSBidXR0b24gaXRzZWxmXG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgIGVsc2Vcblx0XHQgIHRoaXMuaGlkZUNvbnRleHRNZW51KClcblx0ICAgICAgXG5cdCAgfSlcblx0ICAub24oJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oKXtcblx0ICAgICAgLy8gcmlnaHQtY2xpY2sgb24gYSBmZWF0dXJlID0+IGZlYXR1cmUgY29udGV4dCBtZW51XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICghdGd0LmNsYXNzTGlzdC5jb250YWlucyhcImZlYXR1cmVcIikpIHJldHVybjtcblx0ICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0ICAgICAgZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgfSk7XG5cblx0Ly9cblx0Ly9cblx0bGV0IGZDbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZiwgZXZ0LCBwcmVzZXJ2ZSkge1xuXHQgICAgbGV0IGlkID0gZi5tZ2lpZCB8fCBmLm1ncGlkO1xuXHQgICAgaWYgKGV2dC5tZXRhS2V5KSB7XG5cdFx0aWYgKCFldnQuc2hpZnRLZXkgJiYgIXByZXNlcnZlKSB0aGlzLmhpRmVhdHMgPSB7fTtcblx0XHR0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICAgICAgdGhpcy5hcHAuc2V0Q29udGV4dCh7bGFuZG1hcms6KGYuY2Fub25pY2FsIHx8IGYuSUQpLCBkZWx0YTowfSlcblx0XHRyZXR1cm47XG5cdCAgICB9XG5cdCAgICBpZiAoZXZ0LnNoaWZ0S2V5KSB7XG5cdFx0aWYgKHRoaXMuaGlGZWF0c1tpZF0pXG5cdFx0ICAgIGRlbGV0ZSB0aGlzLmhpRmVhdHNbaWRdXG5cdFx0ZWxzZVxuXHRcdCAgICB0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRpZiAoIXByZXNlcnZlKSB0aGlzLmhpRmVhdHMgPSB7fTtcblx0XHR0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdH0uYmluZCh0aGlzKTtcblx0Ly9cblx0bGV0IGZNb3VzZU92ZXJIYW5kbGVyID0gZnVuY3Rpb24oZikge1xuXHRcdGlmIChkMy5ldmVudC5hbHRLZXkpIHtcblx0XHQgICAgLy8gSWYgdXNlciBpcyBob2xkaW5nIHRoZSBhbHQga2V5LCBzZWxlY3QgZXZlcnl0aGluZyB0b3VjaGVkLlxuXHRcdCAgICBmQ2xpY2tIYW5kbGVyKGYsIGQzLmV2ZW50LCB0cnVlKTtcblx0XHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0XHQgICAgLy8gRG9uJ3QgcmVnaXN0ZXIgY29udGV4dCBjaGFuZ2VzIHVudGlsIHVzZXIgaGFzIHBhdXNlZCBmb3IgYXQgbGVhc3QgMXMuXG5cdFx0ICAgIGlmICh0aGlzLnRpbWVvdXQpIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcblx0XHQgICAgdGhpcy50aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXsgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTsgfS5iaW5kKHRoaXMpLCAxMDAwKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIWQzLmV2ZW50LmN0cmxLZXkpIFxuXHRcdCAgICB0aGlzLmhpZ2hsaWdodChmKTtcblx0fS5iaW5kKHRoaXMpO1xuXHQvL1xuXHRsZXQgZk1vdXNlT3V0SGFuZGxlciA9IGZ1bmN0aW9uKGYpIHtcblx0ICAgIGlmICghZDMuZXZlbnQuY3RybEtleSlcblx0XHR0aGlzLmhpZ2hsaWdodCgpOyBcblx0fS5iaW5kKHRoaXMpO1xuXG5cdC8vIFxuICAgICAgICB0aGlzLnN2Z1xuXHQgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QodCk7XG5cdCAgICAgIGlmICh0LnRhZ05hbWUgPT0gXCJyZWN0XCIgJiYgdC5jbGFzc0xpc3QuY29udGFpbnMoXCJmZWF0dXJlXCIpKSB7XG5cdFx0ICAvLyB1c2VyIGNsaWNrZWQgb24gYSBmZWF0dXJlXG5cdFx0ICBmQ2xpY2tIYW5kbGVyKHQuX19kYXRhX18sIGQzLmV2ZW50KTtcblx0XHQgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdCAgICAgICAgICB0aGlzLmFwcC5jb250ZXh0Q2hhbmdlZCgpO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2UgaWYgKHQudGFnTmFtZSA9PSBcInJlY3RcIiAmJiB0LmNsYXNzTGlzdC5jb250YWlucyhcImJsb2NrXCIpICYmICFkMy5ldmVudC5zaGlmdEtleSkge1xuXHRcdCAgLy8gdXNlciBjbGlja2VkIG9uIGEgc3ludGVueSBibG9jayBiYWNrZ3JvdW5kXG5cdFx0ICB0aGlzLmhpRmVhdHMgPSB7fTtcblx0XHQgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdFx0ICB0aGlzLmFwcC5jb250ZXh0Q2hhbmdlZCgpO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2UgaWYgKHQudGFnTmFtZSA9PSBcInJlY3RcIiAmJiB0Z3QuYXR0cignbmFtZScpID09PSAnem9vbVN0cmlwSGFuZGxlJyAmJiBkMy5ldmVudC5zaGlmdEtleSkge1xuXHQgICAgICAgICAgdGhpcy5hcHAuc2V0Q29udGV4dCh7cmVmOnQuX19kYXRhX18uZ2Vub21lLm5hbWV9KTtcblx0ICAgICAgfVxuXHQgIH0pXG5cdCAgLm9uKFwibW91c2VvdmVyXCIsICgpID0+IHtcblx0ICAgICAgbGV0IHRndCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpO1xuXHQgICAgICBsZXQgZiA9IHRndC5kYXRhKClbMF07XG5cdCAgICAgIGlmIChmIGluc3RhbmNlb2YgRmVhdHVyZSkge1xuXHRcdCAgZk1vdXNlT3ZlckhhbmRsZXIoZik7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbihcIm1vdXNlb3V0XCIsICgpID0+IHtcblx0ICAgICAgbGV0IHRndCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpO1xuXHQgICAgICBsZXQgZiA9IHRndC5kYXRhKClbMF07XG5cdCAgICAgIGlmIChmIGluc3RhbmNlb2YgRmVhdHVyZSkge1xuXHRcdCAgZk1vdXNlT3V0SGFuZGxlcihmKTtcblx0ICAgICAgfVxuXHQgIH0pO1xuXG5cdC8vIEJ1dHRvbjogRHJvcCBkb3duIG1lbnUgaW4gem9vbSB2aWV3XG5cdHRoaXMucm9vdC5zZWxlY3QoXCIubWVudSA+IC5idXR0b25cIilcblx0ICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIC8vIHNob3cgY29udGV4dCBtZW51IGF0IG1vdXNlIGV2ZW50IGNvb3JkaW5hdGVzXG5cdCAgICAgIGxldCBjeCA9IGQzLmV2ZW50LmNsaWVudFg7XG5cdCAgICAgIGxldCBjeSA9IGQzLmV2ZW50LmNsaWVudFk7XG5cdCAgICAgIGxldCBiYiA9IGQzLnNlbGVjdCh0aGlzKVswXVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIHNlbGYuc2hvd0NvbnRleHRNZW51KGN4LWJiLmxlZnQsY3ktYmIudG9wKTtcblx0ICB9KTtcblx0Ly8gem9vbSBjb29yZGluYXRlcyBib3hcblx0dGhpcy5yb290LnNlbGVjdChcIiN6b29tQ29vcmRzXCIpXG5cdCAgICAuY2FsbCh6Y3MgPT4gemNzWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKHRoaXMuYXBwLmNvb3JkcykpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7IHRoaXMuc2VsZWN0KCk7IH0pXG5cdCAgICAub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkgeyBzZWxmLmFwcC5zZXRDb29yZGluYXRlcyh0aGlzLnZhbHVlKTsgfSk7XG5cblx0Ly8gem9vbSB3aW5kb3cgc2l6ZSBib3hcblx0dGhpcy5yb290LnNlbGVjdChcIiN6b29tV1NpemVcIilcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHsgdGhpcy5zZWxlY3QoKTsgfSlcblx0ICAgIC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0ICAgICAgICBsZXQgd3MgPSBwYXJzZUludCh0aGlzLnZhbHVlKTtcblx0XHRsZXQgYyA9IHNlbGYuYXBwLmNvb3Jkcztcblx0XHRpZiAoaXNOYU4od3MpIHx8IHdzIDwgMTAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiSW52YWxpZCB3aW5kb3cgc2l6ZS4gUGxlYXNlIGVudGVyIGFuIGludGVnZXIgPj0gMTAwLlwiKTtcblx0XHQgICAgdGhpcy52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICBsZXQgbWlkID0gKGMuc3RhcnQgKyBjLmVuZCkgLyAyO1xuXHRcdCAgICBsZXQgbmV3cyA9IE1hdGgucm91bmQobWlkIC0gd3MvMik7XG5cdFx0ICAgIGxldCBuZXdlID0gbmV3cyArIHdzIC0gMTtcblx0XHQgICAgc2VsZi5hcHAuc2V0Q29udGV4dCh7XG5cdFx0ICAgICAgICBjaHI6IGMuY2hyLFxuXHRcdFx0c3RhcnQ6IG5ld3MsXG5cdFx0XHRlbmQ6IG5ld2UsXG5cdFx0XHRsZW5ndGg6IG5ld2UtbmV3cysxXG5cdFx0ICAgIH0pO1xuXHRcdH1cblx0ICAgIH0pO1xuXHQvLyB6b29tIGRyYXdpbmcgbW9kZSBcblx0dGhpcy5yb290LnNlbGVjdEFsbCgnZGl2W25hbWU9XCJ6b29tRG1vZGVcIl0gLmJ1dHRvbicpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHRsZXQgciA9IHNlbGYucm9vdDtcblx0XHRsZXQgaXNDID0gci5jbGFzc2VkKCdjb21wYXJpc29uJyk7XG5cdFx0ci5jbGFzc2VkKCdjb21wYXJpc29uJywgIWlzQyk7XG5cdFx0ci5jbGFzc2VkKCdyZWZlcmVuY2UnLCBpc0MpO1xuXHRcdHNlbGYuYXBwLnNldENvbnRleHQoe2Rtb2RlOiByLmNsYXNzZWQoJ2NvbXBhcmlzb24nKSA/ICdjb21wYXJpc29uJyA6ICdyZWZlcmVuY2UnfSk7XG5cdCAgICB9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgZGF0YSAobGlzdCBvZiBtZW51SXRlbSBjb25maWdzKSBFYWNoIGNvbmZpZyBsb29rcyBsaWtlIHtsYWJlbDpzdHJpbmcsIGhhbmRsZXI6IGZ1bmN0aW9ufVxuICAgIGluaXRDb250ZXh0TWVudSAoZGF0YSkge1xuXHR0aGlzLmN4dE1lbnUuc2VsZWN0QWxsKFwiLm1lbnVJdGVtXCIpLnJlbW92ZSgpOyAvLyBpbiBjYXNlIG9mIHJlLWluaXRcbiAgICAgICAgbGV0IG1pdGVtcyA9IHRoaXMuY3h0TWVudVxuXHQgIC5zZWxlY3RBbGwoXCIubWVudUl0ZW1cIilcblx0ICAuZGF0YShkYXRhKTtcblx0bGV0IG5ld3MgPSBtaXRlbXMuZW50ZXIoKVxuXHQgIC5hcHBlbmQoXCJkaXZcIilcblx0ICAuYXR0cihcImNsYXNzXCIsIFwibWVudUl0ZW0gZmxleHJvd1wiKVxuXHQgIC5hdHRyKFwidGl0bGVcIiwgZCA9PiBkLnRvb2x0aXAgfHwgbnVsbCApO1xuXHRuZXdzLmFwcGVuZChcImxhYmVsXCIpXG5cdCAgLnRleHQoZCA9PiBkLmxhYmVsKVxuXHQgIC5vbihcImNsaWNrXCIsIGQgPT4ge1xuXHQgICAgICBkLmhhbmRsZXIoKTtcblx0ICAgICAgdGhpcy5oaWRlQ29udGV4dE1lbnUoKTtcblx0ICB9KTtcblx0bmV3cy5hcHBlbmQoXCJpXCIpXG5cdCAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hdGVyaWFsLWljb25zXCIpXG5cdCAgLnRleHQoIGQ9PmQuaWNvbiApO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXQgaGlnaGxpZ2h0ZWQgKGhscykge1xuXHRpZiAodHlwZW9mKGhscykgPT09IFwic3RyaW5nXCIpXG5cdCAgICBobHMgPSBbaGxzXTtcblx0Ly9cblx0dGhpcy5oaUZlYXRzID0ge307XG4gICAgICAgIGZvcihsZXQgaCBvZiBobHMpe1xuXHQgICAgdGhpcy5oaUZlYXRzW2hdID0gaDtcblx0fVxuICAgIH1cbiAgICBnZXQgaGlnaGxpZ2h0ZWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaUZlYXRzID8gT2JqZWN0LmtleXModGhpcy5oaUZlYXRzKSA6IFtdO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dDb250ZXh0TWVudSAoeCx5KSB7XG4gICAgICAgIHRoaXMuY3h0TWVudVxuXHQgICAgLmNsYXNzZWQoXCJzaG93aW5nXCIsIHRydWUpXG5cdCAgICAuc3R5bGUoXCJsZWZ0XCIsIGAke3h9cHhgKVxuXHQgICAgLnN0eWxlKFwidG9wXCIsIGAke3l9cHhgKVxuXHQgICAgO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWRlQ29udGV4dE1lbnUgKCkge1xuICAgICAgICB0aGlzLmN4dE1lbnUuY2xhc3NlZChcInNob3dpbmdcIiwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIGdzIChsaXN0IG9mIEdlbm9tZXMpXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vICAgICBGb3IgZWFjaCBHZW5vbWUsIHNldHMgZy56b29tWSBcbiAgICBzZXQgZ2Vub21lcyAoZ3MpIHtcbiAgICAgICBncy5mb3JFYWNoKCAoZyxpKSA9PiB7Zy56b29tWSA9IHRoaXMudG9wT2Zmc2V0ICsgaSAqICh0aGlzLnN0cmlwSGVpZ2h0ICsgdGhpcy5zdHJpcEdhcCl9ICk7XG4gICAgICAgdGhpcy5fZ2Vub21lcyA9IGdzO1xuICAgIH1cbiAgICBnZXQgZ2Vub21lcyAoKSB7XG4gICAgICAgcmV0dXJuIHRoaXMuX2dlbm9tZXM7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIG5hbWVzIG9mIHRoZSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMgKHN0cmlwZXMpIGluIHRvcC10by1ib3R0b20gb3JkZXIuXG4gICAgLy9cbiAgICBnZXRHZW5vbWVZT3JkZXIgKCkge1xuICAgICAgICBsZXQgc3RyaXBzID0gdGhpcy5zdmdNYWluLnNlbGVjdEFsbChcIi56b29tU3RyaXBcIik7XG4gICAgICAgIGxldCBzcyA9IHN0cmlwc1swXS5tYXAoZz0+IHtcblx0ICAgIGxldCBiYiA9IGcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICByZXR1cm4gW2JiLnksIGcuX19kYXRhX18uZ2Vub21lLm5hbWVdO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IG5zID0gc3Muc29ydCggKGEsYikgPT4gYVswXSAtIGJbMF0gKS5tYXAoIHggPT4geFsxXSApXG5cdHJldHVybiBucztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyB0aGUgdG9wLXRvLWJvdHRvbSBvcmRlciBvZiB0aGUgY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzIGFjY29yZGluZyB0byBcbiAgICAvLyB0aGUgZ2l2ZW4gbmFtZSBsaXN0IG9mIG5hbWVzLiBCZWNhdXNlIHdlIGNhbid0IGd1YXJhbnRlZSB0aGUgZ2l2ZW4gbmFtZXMgY29ycmVzcG9uZFxuICAgIC8vIHRvIGFjdHVhbCB6b29tIHN0cmlwcywgb3IgdGhhdCBhbGwgc3RyaXBzIGFyZSByZXByZXNlbnRlZCwgZXRjLlxuICAgIC8vIFRoZXJlZm9yZSwgdGhlIGxpc3QgaXMgcHJlcHJlY2Vzc2VkIGFzIGZvbGxvd3M6XG4gICAgLy8gICAgICogZHVwbGljYXRlIG5hbWVzLCBpZiB0aGV5IGV4aXN0LCBhcmUgcmVtb3ZlZFxuICAgIC8vICAgICAqIG5hbWVzIHRoYXQgZG8gbm90IGNvcnJlc3BvbmQgdG8gZXhpc3Rpbmcgem9vbVN0cmlwcyBhcmUgcmVtb3ZlZFxuICAgIC8vICAgICAqIG5hbWVzIG9mIGV4aXN0aW5nIHpvb20gc3RyaXBzIHRoYXQgZG9uJ3QgYXBwZWFyIGluIHRoZSBsaXN0IGFyZSBhZGRlZCB0byB0aGUgZW5kXG4gICAgLy8gVGhlIHJlc3VsdCBpcyBhIGxpc3Qgb2YgbmFtZXMgd2l0aCB0aGVzZSBwcm9wZXJ0aWVzOlxuICAgIC8vICAgICAqIHRoZXJlIGlzIGEgMToxIGNvcnJlc3BvbmRlbmNlIGJldHdlZW4gbmFtZXMgYW5kIGFjdHVhbCB6b29tIHN0cmlwc1xuICAgIC8vICAgICAqIHRoZSBuYW1lIG9yZGVyIGlzIGNvbnNpc3RlbnQgd2l0aCB0aGUgaW5wdXQgbGlzdFxuICAgIC8vIFRoaXMgaXMgdGhlIGxpc3QgdXNlZCB0byAocmUpb3JkZXIgdGhlIHpvb20gc3RyaXBzLlxuICAgIC8vXG4gICAgLy8gR2l2ZW4gdGhlIGxpc3Qgb3JkZXI6IFxuICAgIC8vICAgICAqIGEgWS1wb3NpdGlvbiBpcyBhc3NpZ25lZCB0byBlYWNoIGdlbm9tZVxuICAgIC8vICAgICAqIHpvb20gc3RyaXBzIHRoYXQgYXJlIE5PVCBDVVJSRU5UTFkgQkVJTkcgRFJBR0dFRCBhcmUgdHJhbnNsYXRlZCB0byB0aGVpciBuZXcgbG9jYXRpb25zXG4gICAgLy9cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBucyAobGlzdCBvZiBzdHJpbmdzKSBOYW1lcyBvZiB0aGUgZ2Vub21lcy5cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgICBub3RoaW5nXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vICAgICBSZWNhbGN1bGF0ZXMgdGhlIFktY29vcmRpbmF0ZXMgZm9yIGVhY2ggc3RyaXBlIGJhc2VkIG9uIHRoZSBnaXZlbiBvcmRlciwgdGhlbiB0cmFuc2xhdGVzXG4gICAgLy8gICAgIGVhY2ggc3RyaXAgdG8gaXRzIG5ldyBwb3NpdGlvbi5cbiAgICAvL1xuICAgIHNldEdlbm9tZVlPcmRlciAobnMpIHtcblx0dGhpcy5nZW5vbWVzID0gcmVtb3ZlRHVwcyhucykubWFwKG49PiB0aGlzLmFwcC5uYW1lMmdlbm9tZVtuXSApLmZpbHRlcih4PT54KTtcbiAgICAgICAgdGhpcy5nZW5vbWVzLmZvckVhY2goIChnLGkpID0+IHtcblx0ICAgIGxldCBzdHJpcCA9IGQzLnNlbGVjdChgI3pvb21WaWV3IC56b29tU3RyaXBbbmFtZT1cIiR7Zy5uYW1lfVwiXWApO1xuXHQgICAgaWYgKCFzdHJpcC5jbGFzc2VkKFwiZHJhZ2dpbmdcIikpXG5cdCAgICAgICAgc3RyaXAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKDAsJHtnLnpvb21ZfSlgKTtcblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIGRyYWdnZXIgKGQzLmJlaGF2aW9yLmRyYWcpIHRvIGJlIGF0dGFjaGVkIHRvIGVhY2ggem9vbSBzdHJpcC5cbiAgICAvLyBBbGxvd3Mgc3RyaXBzIHRvIGJlIHJlb3JkZXJlZCBieSBkcmFnZ2luZy5cbiAgICBnZXREcmFnZ2VyICgpIHsgIFxuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgcmV0dXJuIGQzLmJlaGF2aW9yLmRyYWcoKVxuXHQgIC5vcmlnaW4oZnVuY3Rpb24oZCxpKXtcblx0ICAgICAgcmV0dXJuIHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgfSlcbiAgICAgICAgICAub24oXCJkcmFnc3RhcnQuelwiLCBmdW5jdGlvbihnKSB7XG5cdCAgICAgIGxldCB0ID0gZDMuZXZlbnQuc291cmNlRXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAoZDMuZXZlbnQuc291cmNlRXZlbnQuc2hpZnRLZXkgfHwgZDMuc2VsZWN0KHQpLmF0dHIoXCJuYW1lXCIpICE9PSAnem9vbVN0cmlwSGFuZGxlJyl7XG5cdCAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgIH1cblx0ICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIGxldCBzdHJpcCA9IHRoaXMuY2xvc2VzdChcIi56b29tU3RyaXBcIik7XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgPSBkMy5zZWxlY3Qoc3RyaXApLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCB0cnVlKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWcuelwiLCBmdW5jdGlvbiAoZykge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgbGV0IG15ID0gZDMubW91c2Uoc2VsZi5zdmdNYWluWzBdWzBdKVsxXTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZy5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoMCwgJHtteX0pYCk7XG5cdCAgICAgIHNlbGYuc2V0R2Vub21lWU9yZGVyKHNlbGYuZ2V0R2Vub21lWU9yZGVyKCkpO1xuXHQgICAgICBzZWxmLmhpZ2hsaWdodCgpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZ2VuZC56XCIsIGZ1bmN0aW9uIChnKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICAvL1xuXHQgICAgICBzZWxmLmRyYWdnaW5nLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCBmYWxzZSk7XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgPSBudWxsO1xuXHQgICAgICBzZWxmLnNldEdlbm9tZVlPcmRlcihzZWxmLmdldEdlbm9tZVlPcmRlcigpKTtcblx0ICAgICAgc2VsZi5hcHAuc2V0Q29udGV4dCh7IGdlbm9tZXM6IHNlbGYuZ2V0R2Vub21lWU9yZGVyKCkgfSk7XG5cdCAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCBzZWxmLmhpZ2hsaWdodC5iaW5kKHNlbGYpLCAyNTAgKTtcblx0ICB9KVxuXHQgIDtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhckJydXNoZXMgKCkge1xuXHR0aGlzLnJvb3Quc2VsZWN0QWxsKFwiZy5icnVzaFwiKVxuXHQgICAgLmVhY2goIGZ1bmN0aW9uIChiKSB7XG5cdCAgICAgICAgYi5icnVzaC5jbGVhcigpO1xuXHRcdGQzLnNlbGVjdCh0aGlzKS5jYWxsKGIuYnJ1c2gpO1xuXHQgICAgfSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgY3VycmVudCBicnVzaCBjb29yZGluYXRlcywgdHJhbnNsYXRlZCAoaWYgbmVlZGVkKSB0byByZWYgZ2Vub21lIGNvb3JkaW5hdGVzLlxuICAgIGJiR2V0UmVmQ29vcmRzICgpIHtcbiAgICAgIGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7XG4gICAgICBsZXQgYmxrID0gdGhpcy5icnVzaGluZztcbiAgICAgIGxldCBleHQgPSBibGsuYnJ1c2guZXh0ZW50KCk7XG4gICAgICBsZXQgciA9IHsgY2hyOiBibGsuY2hyLCBzdGFydDogZXh0WzBdLCBlbmQ6IGV4dFsxXSwgYmxvY2tJZDpibGsuYmxvY2tJZCB9O1xuICAgICAgbGV0IHRyID0gdGhpcy5hcHAudHJhbnNsYXRvcjtcbiAgICAgIGlmKCBibGsuZ2Vub21lICE9PSByZyApIHtcbiAgICAgICAgIC8vIHVzZXIgaXMgYnJ1c2hpbmcgYSBjb21wIGdlbm9tZXMgc28gZmlyc3QgdHJhbnNsYXRlXG5cdCAvLyBjb29yZGluYXRlcyB0byByZWYgZ2Vub21lXG5cdCBsZXQgcnMgPSB0aGlzLmFwcC50cmFuc2xhdG9yLnRyYW5zbGF0ZShibGsuZ2Vub21lLCByLmNociwgci5zdGFydCwgci5lbmQsIHJnKTtcblx0IGlmIChycy5sZW5ndGggPT09IDApIHJldHVybjtcblx0IHIgPSByc1swXTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAgIHIuYmxvY2tJZCA9IHJnLm5hbWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gcjtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gaGFuZGxlciBmb3IgdGhlIHN0YXJ0IG9mIGEgYnJ1c2ggYWN0aW9uIGJ5IHRoZSB1c2VyIG9uIGEgYmxvY2tcbiAgICBiYlN0YXJ0IChibGssYkVsdCkge1xuICAgICAgdGhpcy5icnVzaGluZyA9IGJsaztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gaGFuZGxlciBmb3IgYnJ1c2ggbW90aW9uLiBNYWluIGpvYiBpcyB0byByZWZsZWN0IHRoZSBicnVzaFxuICAgIC8vIGluIHBhcmFsbGVsIGFjcm9zcyB0aGUgZ2Vub21lcyBpbiB0aGUgdmlldy4gVGhlIGN1cnJudCBicnVzaCBleHRlbnQgXG4gICAgLy8gaXMgdHJhbnNsYXRlZCAoaWYgbmVjZXNzYXJ5KSB0byByZWYgZ2Vub21lIHNwYWNlLiBUaGVuIHRob3NlXG4gICAgLy8gY29vcmRpbmF0ZXMgYXJlIHRyYW5zbGF0ZWQgdG8gZWFjaCBjb21wYXJpc29uIGdlbm9tZSBzcGFjZSwgYW5kIHRoZSBhcHByb3ByaWF0ZVxuICAgIC8vIGJydXNoKGVzKSB1cGRhdGVkLlxuICAgIC8vXG4gICAgYmJCcnVzaCAoKSB7XG4gICAgICBsZXQgcmcgPSB0aGlzLmFwcC5yR2Vub21lOyAvLyB0aGUgcmVmZXJlbmNlIGdlbm9tZVxuICAgICAgbGV0IGdzID0gW3JnXS5jb25jYXQodGhpcy5hcHAuY0dlbm9tZXMpOyAvLyBhbGwgdGhlIGdlbm9tZXMgaW4gdGhlIHZpZXdcbiAgICAgIGxldCB0ciA9IHRoaXMuYXBwLnRyYW5zbGF0b3I7IC8vIGZvciB0cmFuc2xhdGluZyBjb29yZHMgYmV0d2VlbiBnZW5vbWVzXG4gICAgICBsZXQgYmxrID0gdGhpcy5icnVzaGluZzsgLy8gdGhlIGJsb2NrIGN1cnJlbmx5IGJlaW5nIGJydXNoZWRcbiAgICAgIGxldCByID0gdGhpcy5iYkdldFJlZkNvb3JkcygpOyAvLyBjdXJyZW50IGJydXNoIGV4dGVudCwgaW4gcmVmIGdlbm9tZSBzcGFjZVxuICAgICAgZ3MuZm9yRWFjaCggZyA9PiB7XG5cdCAgLy8gaWYgZyBpcyB0aGUgcmVmR2Vub21lLCBubyBuZWVkIHRvIHRyYW5zbGF0ZS4gT3RoZXJ3aXNlLCB0cmFuc2xhdGUgZnJvbSBcblx0ICAvLyByZWYgZ2Vub21lIHRvIGNvbXBhcmlzb24gZ2Vub21lIGcuXG4gICAgICAgICAgbGV0IHJzO1xuXHQgIGlmIChnID09PSByZykge1xuXHQgICAgICByLmJsb2NrSWQgPSByZy5uYW1lO1xuXHQgICAgICBycyA9IFtyXTtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICAgIHJzID0gdHIudHJhbnNsYXRlKHJnLCByLmNociwgci5zdGFydCwgci5lbmQsIGcpO1xuXHQgIH1cblx0ICAvLyBub3RlIHRoYXQgdHJhbnNsYXRlZCByZXN1bHRzIGluY2x1ZGUgYmxvY2sgaWRlbnRpZmllcnMsIHdoaWNoIHRlbGxcblx0ICAvLyB1cyB0aGUgYmxvY2sgKGFuZCBoZW5jZSwgYnJ1c2hlcykgaW4gdGhlIGRpc3BsYXkgdG8gdGFyZ2V0LlxuXHQgIHJzLmZvckVhY2goIHJyID0+IHtcblx0ICAgICAgbGV0IGJiID0gdGhpcy5zdmdNYWluLnNlbGVjdChgLnpvb21TdHJpcFtuYW1lPVwiJHtnLm5hbWV9XCJdIC5zQmxvY2tbbmFtZT1cIiR7cnIuYmxvY2tJZH1cIl0gLmJydXNoYClcblx0ICAgICAgYmIuZWFjaCggZnVuY3Rpb24oYikge1xuXHQgICAgICAgICAgYi5icnVzaC5leHRlbnQoW3JyLnN0YXJ0LCByci5lbmRdKTtcblx0XHQgIGQzLnNlbGVjdCh0aGlzKS5jYWxsKGIuYnJ1c2gpO1xuXHQgICAgICB9KTtcblx0ICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBiYkVuZCAoKSB7XG4gICAgICBsZXQgc2UgPSBkMy5ldmVudC5zb3VyY2VFdmVudDtcbiAgICAgIGxldCB4dCA9IHRoaXMuYnJ1c2hpbmcuYnJ1c2guZXh0ZW50KCk7XG4gICAgICBsZXQgciA9IHRoaXMuYmJHZXRSZWZDb29yZHMoKTtcbiAgICAgIHRoaXMuYnJ1c2hpbmcgPSBudWxsO1xuICAgICAgLy9cbiAgICAgIGlmIChzZS5jdHJsS2V5IHx8IHNlLmFsdEtleSB8fCBzZS5tZXRhS2V5KSB7XG5cdCAgdGhpcy5jbGVhckJydXNoZXMoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvL1xuICAgICAgbGV0IGNjID0gdGhpcy5hcHAuY29vcmRzOyAvLyBjdXJyZW50IGNvb3JkaW5hdGVzXG4gICAgICBsZXQgY3VycldpZHRoID0gY2MuZW5kIC0gY2Muc3RhcnQgKyAxO1xuICAgICAgbGV0IG1pZCA9IChjYy5zdGFydCArIGNjLmVuZCkvMjtcbiAgICAgIC8vXG4gICAgICBpZiAoTWF0aC5hYnMoeHRbMF0gLSB4dFsxXSkgPD0gMTApe1xuICAgICAgICAgIC8vIHVzZXIgY2xpY2tlZCBpbnN0ZWFkIG9mIGRyYWdnZWQuIFJlY2VudGVyIHRoZSB2aWV3IG9uIHRoZSBjbGlja2VkIHBvaW50LlxuXHQgIGxldCBkeCAgPSByLnN0YXJ0IC0gbWlkO1xuXHQgIHRoaXMuYXBwLnBhbihkeC9jdXJyV2lkdGgpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG5cdCAgLy8gem9vbSBpbiAobm8gc2hpZnQga2V5KSBvciBvdXQgKHNoaWZ0IGtleSlcblx0ICBsZXQgYnJ1c2hXaWR0aCA9IHIuZW5kIC0gci5zdGFydCArIDE7XG5cdCAgbGV0IGZhY3RvciA9IGJydXNoV2lkdGggLyBjdXJyV2lkdGg7XG5cdCAgdGhpcy5hcHAuem9vbShzZS5zaGlmdEtleSA/IDEvZmFjdG9yIDogZmFjdG9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWdobGlnaHRTdHJpcCAoZywgZWx0KSB7XG5cdGlmIChnID09PSB0aGlzLmN1cnJlbnRITEcpIHJldHVybjtcblx0dGhpcy5jdXJyZW50SExHID0gZztcblx0Ly9cblx0dGhpcy5zdmdNYWluLnNlbGVjdEFsbCgnLnpvb21TdHJpcCcpXG5cdCAgICAuY2xhc3NlZChcImhpZ2hsaWdodGVkXCIsIGQgPT4gZC5nZW5vbWUgPT09IGcpO1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0QWxsKCcuem9vbVN0cmlwSGFuZGxlJylcblx0ICAgIC5jbGFzc2VkKFwiaGlnaGxpZ2h0ZWRcIiwgZCA9PiBkLmdlbm9tZSA9PT0gZyk7XG5cdHRoaXMuYXBwLnNob3dCbG9ja3MoZyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyB0aGUgWm9vbVZpZXcgdG8gc2hvdyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSByZWcgZ2Vub21lIGFuZCB0aGUgY29ycmVzcG9uZGluZ1xuICAgIC8vIHJhbmdlKHMpIGluIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy9cbiAgICB1cGRhdGVWaWFNYXBwZWRDb29yZGluYXRlcyAoY29vcmRzKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0bGV0IGMgPSAoY29vcmRzIHx8IHRoaXMuYXBwLmNvb3Jkcyk7XG5cdGQzLnNlbGVjdChcIiN6b29tQ29vcmRzXCIpWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCk7XG5cdGQzLnNlbGVjdChcIiN6b29tV1NpemVcIilbMF1bMF0udmFsdWUgPSBNYXRoLnJvdW5kKGMuZW5kIC0gYy5zdGFydCArIDEpXG5cdC8vXG4gICAgICAgIGxldCBtZ3YgPSB0aGlzLmFwcDtcblx0Ly8gd2hlbiB0aGUgdHJhbnNsYXRvciBpcyByZWFkeSwgd2UgY2FuIHRyYW5zbGF0ZSB0aGUgcmVmIGNvb3JkcyB0byBlYWNoIGdlbm9tZSBhbmRcblx0Ly8gaXNzdWUgcmVxdWVzdHMgdG8gbG9hZCB0aGUgZmVhdHVyZXMgaW4gdGhvc2UgcmVnaW9ucy5cblx0bWd2LnRyYW5zbGF0b3IucmVhZHkoKS50aGVuKGZ1bmN0aW9uKCl7XG5cdCAgICAvLyBOb3cgaXNzdWUgcmVxdWVzdHMgZm9yIGZlYXR1cmVzLiBPbmUgcmVxdWVzdCBwZXIgZ2Vub21lLCBlYWNoIHJlcXVlc3Qgc3BlY2lmaWVzIG9uZSBvciBtb3JlXG5cdCAgICAvLyBjb29yZGluYXRlIHJhbmdlcy5cblx0ICAgIC8vIFdhaXQgZm9yIGFsbCB0aGUgZGF0YSB0byBiZWNvbWUgYXZhaWxhYmxlLCB0aGVuIGRyYXcuXG5cdCAgICAvL1xuXHQgICAgbGV0IHByb21pc2VzID0gW107XG5cblx0ICAgIC8vIEZpcnN0IHJlcXVlc3QgaXMgZm9yIHRoZSB0aGUgcmVmZXJlbmNlIGdlbm9tZS4gR2V0IGFsbCB0aGUgZmVhdHVyZXMgaW4gdGhlIHJhbmdlLlxuXHQgICAgcHJvbWlzZXMucHVzaChtZ3YuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXMobWd2LnJHZW5vbWUsIFt7XG5cdFx0Ly8gTmVlZCB0byBzaW11bGF0ZSB0aGUgcmVzdWx0cyBmcm9tIGNhbGxpbmcgdGhlIHRyYW5zbGF0b3IuIFxuXHRcdC8vIFxuXHRcdGNociAgICA6IGMuY2hyLFxuXHRcdHN0YXJ0ICA6IGMuc3RhcnQsXG5cdFx0ZW5kICAgIDogYy5lbmQsXG5cdFx0aW5kZXggIDogMCxcblx0XHRmQ2hyICAgOiBjLmNocixcblx0XHRmU3RhcnQgOiBjLnN0YXJ0LFxuXHRcdGZFbmQgICA6IGMuZW5kLFxuXHRcdGZJbmRleCAgOiAwLFxuXHRcdG9yaSAgICA6IFwiK1wiLFxuXHRcdGJsb2NrSWQ6IG1ndi5yR2Vub21lLm5hbWVcblx0XHR9XSkpO1xuXHQgICAgaWYgKCEgc2VsZi5yb290LmNsYXNzZWQoXCJjbG9zZWRcIikpIHtcblx0XHQvLyBBZGQgYSByZXF1ZXN0IGZvciBlYWNoIGNvbXBhcmlzb24gZ2Vub21lLCB1c2luZyB0cmFuc2xhdGVkIGNvb3JkaW5hdGVzLiBcblx0XHRtZ3YuY0dlbm9tZXMuZm9yRWFjaChjR2Vub21lID0+IHtcblx0XHQgICAgbGV0IHJhbmdlcyA9IG1ndi50cmFuc2xhdG9yLnRyYW5zbGF0ZSggbWd2LnJHZW5vbWUsIGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCwgY0dlbm9tZSApO1xuXHRcdCAgICBsZXQgcCA9IG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhjR2Vub21lLCByYW5nZXMpO1xuXHRcdCAgICBwcm9taXNlcy5wdXNoKHApO1xuXHRcdH0pO1xuXHQgICAgfVxuXHQgICAgLy8gd2hlbiBldmVyeXRoaW5nIGlzIHJlYWR5LCBjYWxsIHRoZSBkcmF3IGZ1bmN0aW9uXG5cdCAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbiggZGF0YSA9PiB7XG5cdCAgICAgICAgc2VsZi5kcmF3KGRhdGEpO1xuICAgICAgICAgICAgfSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLyBVcGRhdGVzIHRoZSBab29tVmlldyB0byBzaG93IHRoZSByZWdpb24gYXJvdW5kIGEgbGFuZG1hcmsgaW4gZWFjaCBnZW5vbWUuXG4gICAgLy9cbiAgICAvLyBjb29yZHMgPSB7XG4gICAgLy8gICAgIGxhbmRtYXJrIDogaWQgb2YgYSBmZWF0dXJlIHRvIHVzZSBhcyBhIHJlZmVyZW5jZVxuICAgIC8vICAgICBmbGFua3x3aWR0aCA6IHNwZWNpZnkgb25lIG9mIGZsYW5rIG9yIHdpZHRoLiBcbiAgICAvLyAgICAgICAgIGZsYW5rID0gYW1vdW50IG9mIGZsYW5raW5nIHJlZ2lvbiAoYnApIHRvIGluY2x1ZGUgYXQgYm90aCBlbmRzIG9mIHRoZSBsYW5kbWFyaywgXG4gICAgLy8gICAgICAgICBzbyB0aGUgdG90YWwgdmlld2luZyByZWdpb24gPSBmbGFuayArIGxlbmd0aChsYW5kbWFyaykgKyBmbGFuay5cbiAgICAvLyAgICAgICAgIHdpZHRoID0gdG90YWwgdmlld2luZyByZWdpb24gd2lkdGguIElmIGJvdGggd2lkdGggYW5kIGZsYW5rIGFyZSBzcGVjaWZpZWQsIGZsYW5rIGlzIGlnbm9yZWQuXG4gICAgLy8gICAgIGRlbHRhIDogYW1vdW50IHRvIHNoaWZ0IHRoZSB2aWV3IGxlZnQvcmlnaHRcbiAgICAvLyB9XG4gICAgLy8gXG4gICAgLy8gVGhlIGxhbmRtYXJrIG11c3QgZXhpc3QgaW4gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZS4gXG4gICAgLy9cbiAgICB1cGRhdGVWaWFMYW5kbWFya0Nvb3JkaW5hdGVzIChjb29yZHMpIHtcblx0bGV0IGMgPSBjb29yZHM7XG5cdGxldCBtZ3YgPSB0aGlzLmFwcDtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgcmYgPSBjb29yZHMubGFuZG1hcmtSZWZGZWF0O1xuXHRsZXQgZmVhdHMgPSBjb29yZHMubGFuZG1hcmtGZWF0cztcblx0bGV0IGRlbHRhID0gY29vcmRzLmRlbHRhIHx8IDA7XG5cdC8vIGNvbXB1dGUgcmFuZ2VzIGFyb3VuZCBsYW5kbWFyayBpbiBlYWNoIGdlbm9tZVxuXHRsZXQgcmFuZ2VzID0gZmVhdHMubWFwKGYgPT4ge1xuXHQgICAgbGV0IGZsYW5rID0gYy5sZW5ndGggPyAoYy5sZW5ndGggLSBmLmxlbmd0aCkgLyAyIDogYy5mbGFuaztcblx0ICAgIGxldCByYW5nZSA9IHtcblx0XHRnZW5vbWU6XHRmLmdlbm9tZSxcblx0XHRjaHI6XHRmLmNocixcblx0XHRzdGFydDpcdE1hdGgucm91bmQoZi5zdGFydCAtIGZsYW5rICsgZGVsdGEpLFxuXHRcdGVuZDpcdE1hdGgucm91bmQoZi5lbmQgKyBmbGFuayArIGRlbHRhKVxuXHQgICAgfSA7XG5cdCAgICBpZiAoZi5nZW5vbWUgPT09IG1ndi5yR2Vub21lKSB7XG5cdFx0bGV0IGMgPSB0aGlzLmFwcC5jb29yZHMgPSByYW5nZTtcblx0XHRkMy5zZWxlY3QoXCIjem9vbUNvb3Jkc1wiKVswXVswXS52YWx1ZSA9IGZvcm1hdENvb3JkcyhjLmNociwgYy5zdGFydCwgYy5lbmQpO1xuXHRcdGQzLnNlbGVjdChcIiN6b29tV1NpemVcIilbMF1bMF0udmFsdWUgPSBNYXRoLnJvdW5kKGMuZW5kIC0gYy5zdGFydCArIDEpXG5cdCAgICB9XG5cdCAgICByZXR1cm4gcmFuZ2U7XG5cdH0pO1xuXHRsZXQgc2Vlbkdlbm9tZXMgPSBuZXcgU2V0KCk7XG5cdGxldCByQ29vcmRzO1xuXHQvLyBHZXQgKHByb21pc2VzIGZvcikgdGhlIGZlYXR1cmVzIGluIGVhY2ggcmFuZ2UuXG5cdGxldCBwcm9taXNlcyA9IHJhbmdlcy5tYXAociA9PiB7XG4gICAgICAgICAgICBsZXQgcnJzO1xuXHQgICAgc2Vlbkdlbm9tZXMuYWRkKHIuZ2Vub21lKTtcblx0ICAgIGlmIChyLmdlbm9tZSA9PT0gbWd2LnJHZW5vbWUpe1xuXHRcdC8vIHRoZSByZWYgZ2Vub21lIHJhbmdlXG5cdFx0ckNvb3JkcyA9IHI7XG5cdCAgICAgICAgcnJzID0gW3tcblx0XHQgICAgY2hyICAgIDogci5jaHIsXG5cdFx0ICAgIHN0YXJ0ICA6IHIuc3RhcnQsXG5cdFx0ICAgIGVuZCAgICA6IHIuZW5kLFxuXHRcdCAgICBpbmRleCAgOiAwLFxuXHRcdCAgICBmQ2hyICAgOiByLmNocixcblx0XHQgICAgZlN0YXJ0IDogci5zdGFydCxcblx0XHQgICAgZkVuZCAgIDogci5lbmQsXG5cdFx0ICAgIGZJbmRleCAgOiAwLFxuXHRcdCAgICBvcmkgICAgOiBcIitcIixcblx0XHQgICAgYmxvY2tJZDogbWd2LnJHZW5vbWUubmFtZVxuXHRcdH1dO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7IFxuXHRcdC8vIHR1cm4gdGhlIHNpbmdsZSByYW5nZSBpbnRvIGEgcmFuZ2UgZm9yIGVhY2ggb3ZlcmxhcHBpbmcgc3ludGVueSBibG9jayB3aXRoIHRoZSByZWYgZ2Vub21lXG5cdCAgICAgICAgcnJzID0gbWd2LnRyYW5zbGF0b3IudHJhbnNsYXRlKHIuZ2Vub21lLCByLmNociwgci5zdGFydCwgci5lbmQsIG1ndi5yR2Vub21lLCB0cnVlKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBtZ3YuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXMoci5nZW5vbWUsIHJycyk7XG5cdH0pO1xuXHQvLyBGb3IgZWFjaCBnZW5vbWUgd2hlcmUgdGhlIGxhbmRtYXJrIGRvZXMgbm90IGV4aXN0LCBjb21wdXRlIGEgbWFwcGVkIHJhbmdlIChhcyBpbiBtYXBwZWQgY21vZGUpLlxuXHRtZ3YuY0dlbm9tZXMuZm9yRWFjaChnID0+IHtcblx0ICAgIGlmICghIHNlZW5HZW5vbWVzLmhhcyhnKSkge1xuXHRcdGxldCBycnMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUobWd2LnJHZW5vbWUsIHJDb29yZHMuY2hyLCByQ29vcmRzLnN0YXJ0LCByQ29vcmRzLmVuZCwgZyk7XG5cdFx0cHJvbWlzZXMucHVzaCggbWd2LmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzKGcsIHJycykgKTtcblx0ICAgIH1cblx0fSk7XG5cdC8vIFdoZW4gYWxsIHRoZSBkYXRhIGlzIHJlYWR5LCBkcmF3LlxuXHRQcm9taXNlLmFsbChwcm9taXNlcykudGhlbiggZGF0YSA9PiB7XG5cdCAgICBzZWxmLmRyYXcoZGF0YSk7XG5cdH0pO1xuICAgIH1cbiAgICAvL1xuICAgIHVwZGF0ZSAoKSB7XG5cdGlmICh0aGlzLmFwcC5jbW9kZSA9PT0gJ21hcHBlZCcpXG5cdCAgICB0aGlzLnVwZGF0ZVZpYU1hcHBlZENvb3JkaW5hdGVzKHRoaXMuYXBwLmNvb3Jkcyk7XG5cdGVsc2Vcblx0ICAgIHRoaXMudXBkYXRlVmlhTGFuZG1hcmtDb29yZGluYXRlcyh0aGlzLmFwcC5sY29vcmRzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBvcmRlclNCbG9ja3MgKHNibG9ja3MpIHtcblx0Ly8gU29ydCB0aGUgc2Jsb2NrcyBpbiBlYWNoIHN0cmlwIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBkcmF3aW5nIG1vZGUuXG5cdGxldCBjbXBGaWVsZCA9IHRoaXMuZG1vZGUgPT09ICdjb21wYXJpc29uJyA/ICdpbmRleCcgOiAnZkluZGV4Jztcblx0bGV0IGNtcEZ1bmMgPSAoYSxiKSA9PiBhLl9fZGF0YV9fW2NtcEZpZWxkXS1iLl9fZGF0YV9fW2NtcEZpZWxkXTtcblx0c2Jsb2Nrcy5mb3JFYWNoKCBzdHJpcCA9PiBzdHJpcC5zb3J0KCBjbXBGdW5jICkgKTtcblx0Ly8gcGl4ZWxzIHBlciBiYXNlXG5cdGxldCBwcGIgPSB0aGlzLndpZHRoIC8gKHRoaXMuYXBwLmNvb3Jkcy5lbmQgLSB0aGlzLmFwcC5jb29yZHMuc3RhcnQgKyAxKTtcblx0bGV0IHBzdGFydCA9IFtdOyAvLyBvZmZzZXQgKGluIHBpeGVscykgb2Ygc3RhcnQgcG9zaXRpb24gb2YgbmV4dCBibG9jaywgYnkgc3RyaXAgaW5kZXggKDA9PT1yZWYpXG5cdGxldCBic3RhcnQgPSBbXTsgLy8gYmxvY2sgc3RhcnQgcG9zIChpbiBicCkgYXNzb2Mgd2l0aCBwc3RhcnRcblx0bGV0IGNjaHIgPSBudWxsO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCBkeDtcblx0bGV0IHBlbmQ7XG5cdHNibG9ja3MuZWFjaCggZnVuY3Rpb24gKGIsaSxqKSB7IC8vIGI9YmxvY2ssIGk9aW5kZXggd2l0aGluIHN0cmlwLCBqPXN0cmlwIGluZGV4XG5cdCAgICBsZXQgYmxlbiA9IHBwYiAqIChiLmVuZCAtIGIuc3RhcnQgKyAxKTsgLy8gdG90YWwgc2NyZWVuIHdpZHRoIG9mIHRoaXMgc2Jsb2NrXG5cdCAgICBiLmZsaXAgPSBiLm9yaSA9PT0gJy0nICYmIHNlbGYuZG1vZGUgPT09ICdyZWZlcmVuY2UnO1xuXHQgICAgYi54c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW2Iuc3RhcnQsIGIuZW5kXSkucmFuZ2UoIGIuZmxpcCA/IFtibGVuLCAwXSA6IFswLCBibGVuXSApO1xuXHQgICAgLy9cblx0ICAgIGlmIChpPT09MCkge1xuXHRcdC8vIGZpcnN0IGJsb2NrIGluIGVhY2ggc3RyaXAgaW5pdHNcblx0XHRwc3RhcnRbal0gPSAwO1xuXHRcdGJzdGFydFtqXSA9IGIuc3RhcnQ7XG5cdFx0ZHggPSAwO1xuXHRcdGNjaHIgPSBiLmNocjtcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYgKGIuY2hyID09PSBjY2hyKSB7XG5cdFx0Ly8gTmV4dCBibG9jayBvbiBjdXJyZW50IGNoclxuXHRcdGR4ID0gcHN0YXJ0W2pdICsgcHBiICogKGIuc3RhcnQgLSBic3RhcnRbal0pO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0Ly8gQ2hhbmdlZCBjaHJcblx0XHRwc3RhcnRbal0gPSBwZW5kICsgNDtcblx0XHRic3RhcnRbal0gPSBiLnN0YXJ0O1xuXHRcdGR4ID0gcHN0YXJ0W2pdO1xuXHQgICAgfVxuXHQgICAgZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke2R4fSwwKWApO1xuXHQgICAgcGVuZCA9IGR4ICsgYmxlbjtcblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIHpvb20gdmlldyBwYW5lbCB3aXRoIHRoZSBnaXZlbiBkYXRhLlxuICAgIC8vXG4gICAgLy8gRGF0YSBpcyBzdHJ1Y3R1cmVkIGFzIGZvbGxvd3M6XG4gICAgLy8gICAgIGRhdGEgPSBbIHpvb21TdHJpcF9kYXRhIF1cbiAgICAvLyAgICAgem9vbVN0cmlwX2RhdGEgPSB7IGdlbm9tZSBbIHpvb21CbG9ja19kYXRhIF0gfVxuICAgIC8vICAgICB6b29tQmxvY2tfZGF0YSA9IHsgeHNjYWxlLCBjaHIsIHN0YXJ0LCBlbmQsIGZDaHIsIGZTdGFydCwgZkVuZCwgb3JpLCBbIGZlYXR1cmVfZGF0YSBdIH1cbiAgICAvLyAgICAgZmVhdHVyZV9kYXRhID0geyBtZ3BpZCwgbWdpaWQsIHN5bWJvbCwgY2hyLCBzdGFydCwgZW5kLCBzdHJhbmQsIHR5cGUsIGJpb3R5cGUgfVxuICAgIC8vXG4gICAgLy8gQWdhaW4sIGluIEVuZ2xpc2g6XG4gICAgLy8gIC0gZGF0YSBpcyBhIGxpc3Qgb2YgaXRlbXMsIG9uZSBwZXIgc3RyaXAgdG8gYmUgZGlzcGxheWVkLiBJdGVtWzBdIGlzIGRhdGEgZm9yIHRoZSByZWYgZ2Vub21lLlxuICAgIC8vICAgIEl0ZW1zWzErXSBhcmUgZGF0YSBmb3IgdGhlIGNvbXBhcmlzb24gZ2Vub21lLlxuICAgIC8vICAtIGVhY2ggc3RyaXAgaXRlbSBpcyBhbiBvYmplY3QgY29udGFpbmluZyBhIGdlbm9tZSBhbmQgYSBsaXN0IG9mIGJsb2Nrcy4gSXRlbVswXSBhbHdheXMgaGFzIFxuICAgIC8vICAgIGEgc2luZ2xlIGJsb2NrLlxuICAgIC8vICAtIGVhY2ggYmxvY2sgaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBjaHJvbW9zb21lLCBzdGFydCwgZW5kLCBvcmllbnRhdGlvbiwgZXRjLCBhbmQgYSBsaXN0IG9mIGZlYXR1cmVzLlxuICAgIC8vICAtIGVhY2ggZmVhdHVyZSBoYXMgY2hyLHN0YXJ0LGVuZCxzdHJhbmQsdHlwZSxiaW90eXBlLG1ncGlkXG4gICAgLy9cbiAgICBkcmF3IChkYXRhKSB7XG5cdC8vIFxuXHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0bGV0IGNsb3NlZCA9IHRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIpO1xuXG5cdC8vIHJlc2V0IHRoZSBzdmcgc2l6ZSBiYXNlZCBvbiBudW1iZXIgb2Ygc3RyaXBzXG5cdGxldCB0b3RhbEhlaWdodCA9ICh0aGlzLnN0cmlwSGVpZ2h0K3RoaXMuc3RyaXBHYXApICogZGF0YS5sZW5ndGggKyAxMjtcblx0dGhpcy5zdmdcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRvdGFsSGVpZ2h0KTtcblxuXHQvLyBEcmF3IHRoZSB0aXRsZSBvbiB0aGUgem9vbXZpZXcgcG9zaXRpb24gY29udHJvbHNcblx0ZDMuc2VsZWN0KFwiI3pvb21WaWV3IC56b29tQ29vcmRzIGxhYmVsXCIpXG5cdCAgICAudGV4dChkYXRhWzBdLmdlbm9tZS5sYWJlbCArIFwiIGNvb3Jkc1wiKTtcblx0XG5cdC8vIHRoZSByZWZlcmVuY2UgZ2Vub21lIGJsb2NrIChhbHdheXMganVzdCAxIG9mIHRoZXNlKS5cblx0bGV0IHJCbG9jayA9IGRhdGFbMF0uYmxvY2tzWzBdO1xuXG5cdC8vIHgtc2NhbGUgYW5kIHgtYXhpcyBiYXNlZCBvbiB0aGUgcmVmIGdlbm9tZSBkYXRhLlxuXHR0aGlzLnhzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdCAgICAuZG9tYWluKFtyQmxvY2suc3RhcnQsckJsb2NrLmVuZF0pXG5cdCAgICAucmFuZ2UoWzAsdGhpcy53aWR0aF0pO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIGRyYXcgdGhlIGF4aXNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0dGhpcy5heGlzRnVuYyA9IGQzLnN2Zy5heGlzKClcblx0ICAgIC5zY2FsZSh0aGlzLnhzY2FsZSlcblx0ICAgIC5vcmllbnQoXCJ0b3BcIilcblx0ICAgIC5vdXRlclRpY2tTaXplKDApXG5cdCAgICAudGlja3MoNSlcblx0ICAgIDtcblx0dGhpcy5heGlzLmNhbGwodGhpcy5heGlzRnVuYyk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gem9vbSBzdHJpcHMgKG9uZSBwZXIgZ2Vub21lKVxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBsZXQgenN0cmlwcyA9IHRoaXMuc3RyaXBzR3JwXG5cdCAgICAgICAgLnNlbGVjdEFsbChcImcuem9vbVN0cmlwXCIpXG5cdFx0LmRhdGEoZGF0YSwgZCA9PiBkLmdlbm9tZS5uYW1lKTtcblx0bGV0IG5ld3pzID0genN0cmlwcy5lbnRlcigpXG5cdCAgICAgICAgLmFwcGVuZChcImdcIilcblx0XHQuYXR0cihcImNsYXNzXCIsXCJ6b29tU3RyaXBcIilcblx0XHQuYXR0cihcIm5hbWVcIiwgZCA9PiBkLmdlbm9tZS5uYW1lKVxuXHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChnKSB7XG5cdFx0ICAgIHNlbGYuaGlnaGxpZ2h0U3RyaXAoZy5nZW5vbWUsIHRoaXMpO1xuXHRcdH0pXG5cdFx0LmNhbGwodGhpcy5kcmFnZ2VyKVxuXHRcdDtcblx0bmV3enMuYXBwZW5kKFwidGV4dFwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIFwiZ2Vub21lTGFiZWxcIilcblx0ICAgIC50ZXh0KCBkID0+IGQuZ2Vub21lLmxhYmVsKVxuXHQgICAgLmF0dHIoXCJ4XCIsIDApXG5cdCAgICAuYXR0cihcInlcIiwgdGhpcy5ibG9ja0hlaWdodC8yICsgMTApXG5cdCAgICAuYXR0cihcImZvbnQtZmFtaWx5XCIsXCJzYW5zLXNlcmlmXCIpXG5cdCAgICAuYXR0cihcImZvbnQtc2l6ZVwiLCAxMClcblx0ICAgIDtcblx0bmV3enMuYXBwZW5kKFwiZ1wiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIFwic0Jsb2Nrc1wiKTtcblx0bmV3enMuYXBwZW5kKFwicmVjdFwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIFwiem9vbVN0cmlwSGFuZGxlXCIpXG5cdCAgICAuYXR0cihcInhcIiwgLTE1KVxuXHQgICAgLmF0dHIoXCJ5XCIsIC10aGlzLmJsb2NrSGVpZ2h0IC8gMilcblx0ICAgIC5hdHRyKFwid2lkdGhcIiwgMTUpXG5cdCAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLmJsb2NrSGVpZ2h0KVxuXHQgICAgO1xuXG5cdHpzdHJpcHNcblx0ICAgIC5jbGFzc2VkKFwicmVmZXJlbmNlXCIsIGQgPT4gZC5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpXG5cdCAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBnID0+IGB0cmFuc2xhdGUoMCwke2Nsb3NlZCA/IHRoaXMudG9wT2Zmc2V0IDogZy5nZW5vbWUuem9vbVl9KWApXG5cdCAgICA7XG5cbiAgICAgICAgenN0cmlwcy5leGl0KClcblx0ICAgIC5vbihcIi5kcmFnXCIsIG51bGwpXG5cdCAgICAucmVtb3ZlKCk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gc3ludGVueSBibG9ja3MuIEVhY2ggem9vbSBzdHJpcCBoYXMgYSBsaXN0IG9mIDEgb3IgbW9yZSBzYmxvY2tzLlxuXHQvLyBUaGUgcmVmZXJlbmNlIGdlbm9tZSBhbHdheXMgaGFzIGp1c3QgMS4gVGhlIGNvbXAgZ2Vub21lcyBtYW55IGhhdmVcblx0Ly8gMSBvciBtb3JlIChhbmQgaW4gcmFyZSBjYXNlcywgMCkuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGxldCB1bmlxaWZ5ID0gYmxvY2tzID0+IHtcblx0ICAgIC8vIGhlbHBlciBmdW5jdGlvbi4gV2hlbiBzYmxvY2sgcmVsYXRpb25zaGlwIGJldHdlZW4gZ2Vub21lcyBpcyBjb25mdXNlZCwgcmVxdWVzdGluZyBvbmVcblx0ICAgIC8vIHJlZ2lvbiBpbiBnZW5vbWUgQSBjYW4gZW5kIHVwIHJlcXVlc3RpbmcgdGhlIHNhbWUgcmVnaW9uIGluIGdlbm9tZSBCIHR3aWNlLiBUaGlzIGZ1bmN0aW9uXG5cdCAgICAvLyBhdm9pZHMgZHJhd2luZyB0aGUgc2FtZSBzYmxvY2sgdHdpY2UuIChOQjogUmVhbGx5IG5vdCBzdXJlIHdoZXJlIHRoaXMgY2hlY2sgaXMgYmVzdCBkb25lLlxuXHQgICAgLy8gQ291bGQgcHVzaCBpdCBmYXJ0aGVyIHVwc3RyZWFtLilcblx0ICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuXHQgICAgcmV0dXJuIGJsb2Nrcy5maWx0ZXIoIGIgPT4geyBcblx0ICAgICAgICBpZiAoc2Vlbi5oYXMoYi5pbmRleCkpIHJldHVybiBmYWxzZTtcblx0XHRzZWVuLmFkZChiLmluZGV4KTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0ICAgIH0pO1xuXHR9O1xuICAgICAgICBsZXQgc2Jsb2NrcyA9IHpzdHJpcHMuc2VsZWN0KCdbbmFtZT1cInNCbG9ja3NcIl0nKS5zZWxlY3RBbGwoJ2cuc0Jsb2NrJylcblx0ICAgIC5kYXRhKGQgPT4ge1xuXHQgICAgICAgIHJldHVybiB1bmlxaWZ5KGQuYmxvY2tzKTtcblx0ICAgIH0sIGIgPT4gYi5ibG9ja0lkKTtcblx0bGV0IG5ld3NicyA9IHNibG9ja3MuZW50ZXIoKVxuXHQgICAgLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgYiA9PiBcInNCbG9jayBcIiArIFxuXHQgICAgICAgIChiLm9yaT09PVwiK1wiID8gXCJwbHVzXCIgOiBiLm9yaT09PVwiLVwiID8gXCJtaW51c1wiOiBcImNvbmZ1c2VkXCIpICsgXG5cdFx0KGIuY2hyICE9PSBiLmZDaHIgPyBcIiB0cmFuc2xvY2F0aW9uXCIgOiBcIlwiKSlcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBiPT5iLmluZGV4KVxuXHQgICAgO1xuXHRsZXQgbDAgPSBuZXdzYnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLCBcImxheWVyMFwiKTtcblx0bGV0IGwxID0gbmV3c2JzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIiwgXCJsYXllcjFcIik7XG5cblx0Ly8gcmVjdGFuZ2xlIGZvciB0aGUgd2hvbGUgYmxvY2tcblx0bDAuYXBwZW5kKFwicmVjdFwiKS5hdHRyKFwiY2xhc3NcIiwgXCJibG9ja1wiKTtcblx0Ly8gdGhlIGF4aXMgbGluZVxuXHRsMC5hcHBlbmQoXCJsaW5lXCIpLmF0dHIoXCJjbGFzc1wiLFwiYXhpc1wiKSA7XG5cdC8vIGxhYmVsXG5cdGwwLmFwcGVuZChcInRleHRcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImJsb2NrTGFiZWxcIikgO1xuXHQvLyBicnVzaFxuXHRsMC5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLFwiYnJ1c2hcIik7XG5cblx0c2Jsb2Nrcy5leGl0KCkucmVtb3ZlKCk7XG5cblx0dGhpcy5vcmRlclNCbG9ja3Moc2Jsb2Nrcyk7XG5cblx0Ly8gc3ludGVueSBibG9jayBsYWJlbHNcblx0c2Jsb2Nrcy5zZWxlY3QoXCJ0ZXh0LmJsb2NrTGFiZWxcIilcblx0ICAgIC50ZXh0KCBiID0+IGIuY2hyIClcblx0ICAgIC5hdHRyKFwieFwiLCBiID0+IChiLnhzY2FsZShiLnN0YXJ0KSArIGIueHNjYWxlKGIuZW5kKSkvMiApXG5cdCAgICAuYXR0cihcInlcIiwgdGhpcy5ibG9ja0hlaWdodCAvIDIgKyAxMClcblx0ICAgIDtcblxuXHQvLyBzeW50ZW55IGJsb2NrIHJlY3RzXG5cdHNibG9ja3Muc2VsZWN0KFwicmVjdC5ibG9ja1wiKVxuXHQgIC5hdHRyKFwieFwiLCAgICAgYiA9PiBiLnhzY2FsZShiLmZsaXAgPyBiLmVuZCA6IGIuc3RhcnQpKVxuXHQgIC5hdHRyKFwieVwiLCAgICAgYiA9PiAtdGhpcy5ibG9ja0hlaWdodCAvIDIpXG5cdCAgLmF0dHIoXCJ3aWR0aFwiLCBiID0+IE1hdGguYWJzKGIueHNjYWxlKGIuZW5kKS1iLnhzY2FsZShiLnN0YXJ0KSkpXG5cdCAgLmF0dHIoXCJoZWlnaHRcIix0aGlzLmJsb2NrSGVpZ2h0KTtcblxuXHQvLyBzeW50ZW55IGJsb2NrIGF4aXMgbGluZXNcblx0c2Jsb2Nrcy5zZWxlY3QoXCJsaW5lLmF4aXNcIilcblx0ICAgIC5hdHRyKFwieDFcIiwgYiA9PiBiLnhzY2FsZS5yYW5nZSgpWzBdKVxuXHQgICAgLmF0dHIoXCJ5MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ4MlwiLCBiID0+IGIueHNjYWxlLnJhbmdlKClbMV0pXG5cdCAgICAuYXR0cihcInkyXCIsIDApXG5cdCAgICA7XG5cblx0Ly8gYnJ1c2hcblx0c2Jsb2Nrcy5zZWxlY3QoXCJnLmJydXNoXCIpXG5cdCAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBiID0+IGB0cmFuc2xhdGUoMCwke3RoaXMuYmxvY2tIZWlnaHQgLyAyfSlgKVxuXHQgICAgLmVhY2goZnVuY3Rpb24oYikge1xuXHRcdGlmICghYi5icnVzaCkge1xuXHRcdCAgICBiLmJydXNoID0gZDMuc3ZnLmJydXNoKClcblx0XHRcdC5vbihcImJydXNoc3RhcnRcIiwgZnVuY3Rpb24oKXsgc2VsZi5iYlN0YXJ0KCBiLCB0aGlzICk7IH0pXG5cdFx0XHQub24oXCJicnVzaFwiLCAgICAgIGZ1bmN0aW9uKCl7IHNlbGYuYmJCcnVzaCggYiwgdGhpcyApOyB9KVxuXHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgICBmdW5jdGlvbigpeyBzZWxmLmJiRW5kKCBiLCB0aGlzICk7IH0pXG5cdFx0fVxuXHRcdGIuYnJ1c2gueChiLnhzY2FsZSkuY2xlYXIoKTtcblx0XHRkMy5zZWxlY3QodGhpcykuY2FsbChiLmJydXNoKTtcblx0ICAgIH0pXG5cdCAgICAuc2VsZWN0QWxsKFwicmVjdFwiKVxuXHRcdC5hdHRyKFwiaGVpZ2h0XCIsIDEwKTtcblxuXHR0aGlzLmRyYXdGZWF0dXJlcyhzYmxvY2tzKTtcblxuXHQvL1xuXHR0aGlzLmFwcC5mYWNldE1hbmFnZXIuYXBwbHlBbGwoKTtcblxuXHQvLyBXZSBuZWVkIHRvIGxldCB0aGUgdmlldyByZW5kZXIgYmVmb3JlIGRvaW5nIHRoZSBoaWdobGlnaHRpbmcsIHNpbmNlIGl0IGRlcGVuZHMgb25cblx0Ly8gdGhlIHBvc2l0aW9ucyBvZiByZWN0YW5nbGVzIGluIHRoZSBzY2VuZS5cblx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuXHQgICAgLy90aGlzLnNldEdlbm9tZVlPcmRlciggdGhpcy5nZW5vbWVzLm1hcChnID0+IGcubmFtZSkgKTtcblx0ICAgIC8vd2luZG93LnNldFRpbWVvdXQoKCkgPT4gdGhpcy5oaWdobGlnaHQoKSwgNTApO1xuXHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0fSwgNTApO1xuICAgIH07XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgZmVhdHVyZXMgKHJlY3RhbmdsZXMpIGZvciB0aGUgc3BlY2lmaWVkIHN5bnRlbnkgYmxvY2tzLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIHNibG9ja3MgKEQzIHNlbGVjdGlvbiBvZiBnLnNibG9jayBub2RlcykgLSBtdWx0aWxldmVsIHNlbGVjdGlvbi5cbiAgICAvLyAgICAgICAgQXJyYXkgKGNvcnJlc3BvbmRpbmcgdG8gc3RyaXBzKSBvZiBhcnJheXMgb2Ygc3ludGVueSBibG9ja3MuXG4gICAgLy9cbiAgICBkcmF3RmVhdHVyZXMgKHNibG9ja3MpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHQvL1xuXHQvLyBuZXZlciBkcmF3IHRoZSBzYW1lIGZlYXR1cmUgdHdpY2Vcblx0bGV0IGRyYXduID0gbmV3IFNldCgpO1x0Ly8gc2V0IG9mIG1ncGlkcyBvZiBkcmF3biBmZWF0dXJlc1xuXHRsZXQgZmlsdGVyRHJhd24gPSBmdW5jdGlvbiAoZikge1xuXHQgICAgLy8gcmV0dXJucyB0cnVlIGlmIHdlJ3ZlIG5vdCBzZWVuIHRoaXMgb25lIGJlZm9yZS5cblx0ICAgIC8vIHJlZ2lzdGVycyB0aGF0IHdlJ3ZlIHNlZW4gaXQuXG5cdCAgICBsZXQgZmlkID0gZi5tZ3BpZDtcblx0ICAgIGxldCB2ID0gISBkcmF3bi5oYXMoZmlkKTtcblx0ICAgIGRyYXduLmFkZChmaWQpO1xuXHQgICAgcmV0dXJuIHY7XG5cdH07XG5cdGxldCBmZWF0cyA9IHNibG9ja3Muc2VsZWN0KCdbbmFtZT1cImxheWVyMVwiXScpLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpXG5cdCAgICAuZGF0YShkPT5kLmZlYXR1cmVzLmZpbHRlcihmaWx0ZXJEcmF3biksIGQ9PmQubWdwaWQpO1xuXHRmZWF0cy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGxldCBuZXdGZWF0cyA9IGZlYXRzLmVudGVyKCkuYXBwZW5kKFwicmVjdFwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBmID0+IFwiZmVhdHVyZVwiICsgKGYuc3RyYW5kPT09XCItXCIgPyBcIiBtaW51c1wiIDogXCIgcGx1c1wiKSlcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBmID0+IGYubWdwaWQpXG5cdCAgICAuc3R5bGUoXCJmaWxsXCIsIGYgPT4gc2VsZi5hcHAuY3NjYWxlKGYuZ2V0TXVuZ2VkVHlwZSgpKSlcblx0ICAgIDtcblxuXHQvLyBkcmF3IHRoZSByZWN0YW5nbGVzXG5cblx0Ly8gcmV0dXJucyB0aGUgc3ludGVueSBibG9jayBjb250YWluaW5nIHRoaXMgZmVhdHVyZVxuXHRsZXQgZkJsb2NrID0gZnVuY3Rpb24gKGZlYXRFbHQpIHtcblx0ICAgIGxldCBibGtFbHQgPSBmZWF0RWx0LnBhcmVudE5vZGU7XG5cdCAgICByZXR1cm4gYmxrRWx0Ll9fZGF0YV9fO1xuXHR9XG5cdGxldCBmeCA9IGZ1bmN0aW9uKGYpIHtcblx0ICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgcmV0dXJuIGIueHNjYWxlKGYuc3RhcnQpXG5cdH07XG5cdGxldCBmdyA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICBsZXQgYiA9IGZCbG9jayh0aGlzKTtcblx0ICAgIHJldHVybiBNYXRoLmFicyhiLnhzY2FsZShmLmVuZCkgLSBiLnhzY2FsZShmLnN0YXJ0KSkgKyAxO1xuXHR9O1xuXHRsZXQgZnkgPSBmdW5jdGlvbiAoZikge1xuXHQgICAgICAgbGV0IGIgPSBmQmxvY2sodGhpcyk7XG5cdCAgICAgICBpZiAoZi5zdHJhbmQgPT0gXCIrXCIpe1xuXHRcdCAgIGlmIChiLmZsaXApIFxuXHRcdCAgICAgICByZXR1cm4gc2VsZi5sYW5lSGVpZ2h0KmYubGFuZSAtIHNlbGYuZmVhdEhlaWdodDsgXG5cdFx0ICAgZWxzZSBcblx0XHQgICAgICAgcmV0dXJuIC1zZWxmLmxhbmVIZWlnaHQqZi5sYW5lO1xuXHQgICAgICAgfVxuXHQgICAgICAgZWxzZSB7XG5cdFx0ICAgLy8gZi5sYW5lIGlzIG5lZ2F0aXZlIGZvciBcIi1cIiBzdHJhbmRcblx0XHQgICBpZiAoYi5mbGlwKSBcblx0XHQgICAgICAgcmV0dXJuIHNlbGYubGFuZUhlaWdodCpmLmxhbmU7XG5cdFx0ICAgZWxzZVxuXHRcdCAgICAgICByZXR1cm4gLXNlbGYubGFuZUhlaWdodCpmLmxhbmUgLSBzZWxmLmZlYXRIZWlnaHQ7IFxuXHQgICAgICAgfVxuXHQgICB9O1xuXG5cdGZlYXRzXG5cdCAgLmF0dHIoXCJ4XCIsIGZ4KVxuXHQgIC5hdHRyKFwid2lkdGhcIiwgZncpXG5cdCAgLmF0dHIoXCJ5XCIsIGZ5KVxuXHQgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMuZmVhdEhlaWdodClcblx0ICA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyBmZWF0dXJlIGhpZ2hsaWdodGluZyBpbiB0aGUgY3VycmVudCB6b29tIHZpZXcuXG4gICAgLy8gRmVhdHVyZXMgdG8gYmUgaGlnaGxpZ2h0ZWQgaW5jbHVkZSB0aG9zZSBpbiB0aGUgaGlGZWF0cyBsaXN0IHBsdXMgdGhlIGZlYXR1cmVcbiAgICAvLyBjb3JyZXNwb25kaW5nIHRvIHRoZSByZWN0YW5nbGUgYXJndW1lbnQsIGlmIGdpdmVuLiAoVGhlIG1vdXNlb3ZlciBmZWF0dXJlLilcbiAgICAvL1xuICAgIC8vIERyYXdzIGZpZHVjaWFscyBmb3IgZmVhdHVyZXMgaW4gdGhpcyBsaXN0IHRoYXQ6XG4gICAgLy8gMS4gb3ZlcmxhcCB0aGUgY3VycmVudCB6b29tVmlldyBjb29yZCByYW5nZVxuICAgIC8vIDIuIGFyZSBub3QgcmVuZGVyZWQgaW52aXNpYmxlIGJ5IGN1cnJlbnQgZmFjZXQgc2V0dGluZ3NcbiAgICAvL1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgY3VycmVudCAocmVjdCBlbGVtZW50KSBPcHRpb25hbC4gQWRkJ2wgcmVjdGFuZ2xlIGVsZW1lbnQsIGUuZy4sIHRoYXQgd2FzIG1vdXNlZC1vdmVyLiBIaWdobGlnaHRpbmdcbiAgICAvLyAgICAgICAgd2lsbCBpbmNsdWRlIHRoZSBmZWF0dXJlIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyByZWN0IGFsb25nIHdpdGggdGhvc2UgaW4gdGhlIGhpZ2hsaWdodCBsaXN0LlxuICAgIC8vICAgIHB1bHNlQ3VycmVudCAoYm9vbGVhbikgSWYgdHJ1ZSBhbmQgY3VycmVudCBpcyBnaXZlbiwgY2F1c2UgaXQgdG8gcHVsc2UgYnJpZWZseS5cbiAgICAvL1xuICAgIGhpZ2hsaWdodCAoY3VycmVudCwgcHVsc2VDdXJyZW50KSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0Ly8gY3VycmVudCBmZWF0dXJlXG5cdGxldCBjdXJyRmVhdCA9IGN1cnJlbnQgPyAoY3VycmVudCBpbnN0YW5jZW9mIEZlYXR1cmUgPyBjdXJyZW50IDogY3VycmVudC5fX2RhdGFfXykgOiBudWxsO1xuXHQvLyBjcmVhdGUgbG9jYWwgY29weSBvZiBoaUZlYXRzLCB3aXRoIGN1cnJlbnQgZmVhdHVyZSBhZGRlZFxuXHRsZXQgaGlGZWF0cyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuaGlGZWF0cyk7XG5cdGlmIChjdXJyRmVhdCkge1xuXHQgICAgaGlGZWF0c1tjdXJyRmVhdC5pZF0gPSBjdXJyRmVhdC5pZDtcblx0fVxuXG5cdC8vIEZpbHRlciBhbGwgZmVhdHVyZXMgKHJlY3RhbmdsZXMpIGluIHRoZSBzY2VuZSBmb3IgdGhvc2UgYmVpbmcgaGlnaGxpZ2h0ZWQuXG5cdC8vIEFsb25nIHRoZSB3YXksIGJ1aWxkIGluZGV4IG1hcHBpbmcgZmVhdHVyZSBpZCB0byBpdHMgXCJzdGFja1wiIG9mIGVxdWl2YWxlbnQgZmVhdHVyZXMsXG5cdC8vIGkuZS4gYSBsaXN0IG9mIGl0cyBnZW5vbG9ncyBzb3J0ZWQgYnkgeSBjb29yZGluYXRlLlxuXHQvLyBBbHNvLCBtYWtlIGVhY2ggaGlnaGxpZ2h0ZWQgZmVhdHVyZSB0YWxsZXIgKHNvIGl0IHN0YW5kcyBhYm92ZSBpdHMgbmVpZ2hib3JzKVxuXHQvLyBhbmQgZ2l2ZSBpdCB0aGUgXCIuaGlnaGxpZ2h0XCIgY2xhc3MuXG5cdC8vXG5cdGxldCBzdGFja3MgPSB7fTsgLy8gZmlkIC0+IFsgcmVjdHMgXSBcblx0bGV0IGRoID0gdGhpcy5ibG9ja0hlaWdodC8yIC0gdGhpcy5mZWF0SGVpZ2h0O1xuICAgICAgICBsZXQgZmVhdHMgPSB0aGlzLnN2Z01haW4uc2VsZWN0QWxsKFwiLmZlYXR1cmVcIilcblx0ICAvLyBmaWx0ZXIgcmVjdC5mZWF0dXJlcyBmb3IgdGhvc2UgaW4gdGhlIGhpZ2hsaWdodCBsaXN0XG5cdCAgLmZpbHRlcihmdW5jdGlvbihmZil7XG5cdCAgICAgIC8vIGhpZ2hsaWdodCBmZiBpZiBlaXRoZXIgaWQgaXMgaW4gdGhlIGxpc3QgQU5EIGl0J3Mgbm90IGJlZW4gaGlkZGVuXG5cdCAgICAgIGxldCBtZ2kgPSBoaUZlYXRzW2ZmLm1naWlkXTtcblx0ICAgICAgbGV0IG1ncCA9IGhpRmVhdHNbZmYubWdwaWRdO1xuXHQgICAgICBsZXQgc2hvd2luZyA9IGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcImRpc3BsYXlcIikgIT09IFwibm9uZVwiO1xuXHQgICAgICBsZXQgaGwgPSBzaG93aW5nICYmIChtZ2kgfHwgbWdwKTtcblx0ICAgICAgaWYgKGhsKSB7XG5cdFx0ICAvLyBmb3IgZWFjaCBoaWdobGlnaHRlZCBmZWF0dXJlLCBhZGQgaXRzIHJlY3RhbmdsZSB0byB0aGUgbGlzdFxuXHRcdCAgbGV0IGsgPSBmZi5pZDtcblx0XHQgIGlmICghc3RhY2tzW2tdKSBzdGFja3Nba10gPSBbXVxuXHRcdCAgc3RhY2tzW2tdLnB1c2godGhpcylcblx0ICAgICAgfVxuXHQgICAgICAvLyBcblx0ICAgICAgZDMuc2VsZWN0KHRoaXMpXG5cdFx0ICAuY2xhc3NlZChcImhpZ2hsaWdodFwiLCBobClcblx0XHQgIC5jbGFzc2VkKFwiY3VycmVudFwiLCBobCAmJiBjdXJyRmVhdCAmJiB0aGlzLl9fZGF0YV9fLmlkID09PSBjdXJyRmVhdC5pZClcblx0XHQgIC5jbGFzc2VkKFwiZXh0cmFcIiwgcHVsc2VDdXJyZW50ICYmIGZmID09PSBjdXJyRmVhdClcblx0ICAgICAgcmV0dXJuIGhsO1xuXHQgIH0pXG5cdCAgO1xuXG5cdC8vIGJ1aWxkIGRhdGEgYXJyYXkgZm9yIGRyYXdpbmcgZmlkdWNpYWxzIGJldHdlZW4gZXF1aXZhbGVudCBmZWF0dXJlc1xuXHRsZXQgZGF0YSA9IFtdO1xuXHRmb3IgKGxldCBrIGluIHN0YWNrcykge1xuXHQgICAgLy8gZm9yIGVhY2ggaGlnaGxpZ2h0ZWQgZmVhdHVyZSwgc29ydCB0aGUgcmVjdGFuZ2xlcyBpbiBpdHMgbGlzdCBieSBZLWNvb3JkaW5hdGVcblx0ICAgIGxldCByZWN0cyA9IHN0YWNrc1trXTtcblx0ICAgIHJlY3RzLnNvcnQoIChhLGIpID0+IHBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJ5XCIpKSAtIHBhcnNlRmxvYXQoYi5nZXRBdHRyaWJ1dGUoXCJ5XCIpKSApO1xuXHQgICAgcmVjdHMuc29ydCggKGEsYikgPT4ge1xuXHRcdHJldHVybiBhLl9fZGF0YV9fLmdlbm9tZS56b29tWSAtIGIuX19kYXRhX18uZ2Vub21lLnpvb21ZO1xuXHQgICAgfSk7XG5cdCAgICAvLyBXYW50IGEgcG9seWdvbiBiZXR3ZWVuIGVhY2ggc3VjY2Vzc2l2ZSBwYWlyIG9mIGl0ZW1zLiBUaGUgZm9sbG93aW5nIGNyZWF0ZXMgYSBsaXN0IG9mXG5cdCAgICAvLyBuIHBhaXJzLCB3aGVyZSByZWN0W2ldIGlzIHBhaXJlZCB3aXRoIHJlY3RbaSsxXS4gVGhlIGxhc3QgcGFpciBjb25zaXN0cyBvZiB0aGUgbGFzdFxuXHQgICAgLy8gcmVjdGFuZ2xlIHBhaXJlZCB3aXRoIHVuZGVmaW5lZC4gKFdlIHdhbnQgdGhpcy4pXG5cdCAgICBsZXQgcGFpcnMgPSByZWN0cy5tYXAoKHIsIGkpID0+IFtyLHJlY3RzW2krMV1dKTtcblx0ICAgIC8vIEFkZCBhIGNsYXNzIChcImN1cnJlbnRcIikgZm9yIHRoZSBwb2x5Z29ucyBhc3NvY2lhdGVkIHdpdGggdGhlIG1vdXNlb3ZlciBmZWF0dXJlIHNvIHRoZXlcblx0ICAgIC8vIGNhbiBiZSBkaXN0aW5ndWlzaGVkIGZyb20gb3RoZXJzLlxuXHQgICAgZGF0YS5wdXNoKHsgZmlkOiBrLCByZWN0czogcGFpcnMsIGNsczogKGN1cnJGZWF0ICYmIGN1cnJGZWF0LmlkID09PSBrID8gJ2N1cnJlbnQnIDogJycpIH0pO1xuXHR9XG5cdHRoaXMuZHJhd0ZpZHVjaWFscyhkYXRhLCBjdXJyRmVhdCk7XG5cblx0Ly8gRklYTUU6IHJlYWNob3ZlclxuXHR0aGlzLmFwcC5mZWF0dXJlRGV0YWlscy51cGRhdGUoY3VyckZlYXQpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHBvbHlnb25zIHRoYXQgY29ubmVjdCBoaWdobGlnaHRlZCBmZWF0dXJlcyBpbiB0aGUgdmlld1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICBkYXRhIDogbGlzdCBvZiB7XG4gICAgLy8gICAgICAgZmlkOiBmZWF0dXJlLWlkLCBcbiAgICAvLyAgICAgICBjbHM6IGV4dHJhIGNsYXNzIGZvciAuZmVhdHVyZU1hcmsgZ3JvdXAsXG4gICAgLy8gICAgICAgcmVjdHM6IGxpc3Qgb2YgW3JlY3QxLHJlY3QyXSBwYWlycywgXG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgY3VyckZlYXQgOiBjdXJyZW50IChtb3VzZW92ZXIpIGZlYXR1cmUgKGlmIGFueSlcbiAgICAvL1xuICAgIGRyYXdGaWR1Y2lhbHMgKGRhdGEsIGN1cnJGZWF0KSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0Ly9cblx0Ly8gcHV0IGZpZHVjaWFsIG1hcmtzIGluIHRoZWlyIG93biBncm91cCBcblx0bGV0IGZHcnAgPSB0aGlzLmZpZHVjaWFscy5jbGFzc2VkKFwiaGlkZGVuXCIsIGZhbHNlKTtcblxuXHQvLyBCaW5kIGZpcnN0IGxldmVsIGRhdGEgdG8gXCJmZWF0dXJlTWFya3NcIiBncm91cHNcblx0bGV0IGZmR3JwcyA9IGZHcnAuc2VsZWN0QWxsKFwiZy5mZWF0dXJlTWFya3NcIilcblx0ICAgIC5kYXRhKGRhdGEsIGQgPT4gZC5maWQpO1xuXHRmZkdycHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgZCA9PiBkLmZpZCk7XG5cdGZmR3Jwcy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGZmR3Jwcy5hdHRyKFwiY2xhc3NcIixkID0+IFwiZmVhdHVyZU1hcmtzIFwiICsgKGQuY2xzIHx8IFwiXCIpKVxuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRHJhdyB0aGUgY29ubmVjdG9yIHBvbHlnb25zLlxuXHQvLyBCaW5kIHNlY29uZCBsZXZlbCBkYXRhIChyZWN0YW5nbGUgcGFpcnMpIHRvIHBvbHlnb25zIGluIHRoZSBncm91cFxuXHRsZXQgcGdvbnMgPSBmZkdycHMuc2VsZWN0QWxsKFwicG9seWdvblwiKVxuXHQgICAgLmRhdGEoZD0+ZC5yZWN0cy5maWx0ZXIociA9PiByWzBdICYmIHJbMV0pKTtcblx0cGdvbnMuZXhpdCgpLnJlbW92ZSgpO1xuXHRwZ29ucy5lbnRlcigpLmFwcGVuZChcInBvbHlnb25cIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImZpZHVjaWFsXCIpXG5cdCAgICA7XG5cdC8vXG5cdHBnb25zLmF0dHIoXCJwb2ludHNcIiwgciA9PiB7XG5cdCAgICAvLyBwb2x5Z29uIGNvbm5lY3RzIGJvdHRvbSBjb3JuZXJzIG9mIDFzdCByZWN0IHRvIHRvcCBjb3JuZXJzIG9mIDJuZCByZWN0XG5cdCAgICBsZXQgYzEgPSBjb29yZHNBZnRlclRyYW5zZm9ybShyWzBdKTsgLy8gdHJhbnNmb3JtIGNvb3JkcyBmb3IgMXN0IHJlY3Rcblx0ICAgIGxldCBjMj0gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0oclsxXSk7ICAvLyB0cmFuc2Zvcm0gY29vcmRzIGZvciAybmQgcmVjdFxuXHQgICAgLy8gZm91ciBwb2x5Z29uIHBvaW50c1xuXHQgICAgbGV0IHMgPSBgJHtjMS54fSwke2MxLnkrYzEuaGVpZ2h0fSAke2MyLnh9LCR7YzIueX0gJHtjMi54K2MyLndpZHRofSwke2MyLnl9ICR7YzEueCtjMS53aWR0aH0sJHtjMS55K2MxLmhlaWdodH1gXG5cdCAgICByZXR1cm4gcztcblx0fSlcblx0Ly8gbW91c2luZyBvdmVyIHRoZSBmaWR1Y2lhbCBoaWdobGlnaHRzIChhcyBpZiB0aGUgdXNlciBoYWQgbW91c2VkIG92ZXIgdGhlIGZlYXR1cmUgaXRzZWxmKVxuXHQub24oXCJtb3VzZW92ZXJcIiwgKHApID0+IHtcblx0ICAgIGlmICghZDMuZXZlbnQuY3RybEtleSlcblx0ICAgICAgICB0aGlzLmhpZ2hsaWdodChwWzBdKTtcblx0fSlcblx0Lm9uKFwibW91c2VvdXRcIiwgIChwKSA9PiB7XG5cdCAgICBpZiAoIWQzLmV2ZW50LmN0cmxLZXkpXG5cdCAgICAgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0fSk7XG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRHJhdyBmZWF0dXJlIGxhYmVscy4gRWFjaCBsYWJlbCBpcyBkcmF3biBvbmNlLCBhYm92ZSB0aGUgZmlyc3QgcmVjdGFuZ2xlIGluIGl0cyBsaXN0LlxuXHQvLyBUaGUgZXhjZXB0aW9uIGlzIHRoZSBjdXJyZW50IChtb3VzZW92ZXIpIGZlYXR1cmUsIHdoZXJlIHRoZSBsYWJlbCBpcyBkcmF3biBhYm92ZSB0aGF0IGZlYXR1cmUuXG5cdGxldCBsYWJlbHMgPSBmZkdycHMuc2VsZWN0QWxsKCd0ZXh0LmZlYXRMYWJlbCcpXG5cdCAgICAuZGF0YShkID0+IHtcblx0XHRsZXQgciA9IGQucmVjdHNbMF1bMF07XG5cdFx0aWYgKGN1cnJGZWF0ICYmIChkLmZpZCA9PT0gY3VyckZlYXQuSUQgfHwgZC5maWQgPT09IGN1cnJGZWF0LmNhbm9uaWNhbCkpe1xuXHRcdCAgICByID0gZC5yZWN0cy5tYXAoIHJyID0+XG5cdFx0ICAgICAgIHJyWzBdLl9fZGF0YV9fID09PSBjdXJyRmVhdCA/IHJyWzBdIDogcnJbMV0mJnJyWzFdLl9fZGF0YV9fID09PSBjdXJyRmVhdCA/IHJyWzFdIDogbnVsbFxuXHRcdCAgICAgICApLmZpbHRlcih4PT54KVswXTtcblx0XHR9XG5cdCAgICAgICAgcmV0dXJuIFt7XG5cdFx0ICAgIGZpZDogZC5maWQsXG5cdFx0ICAgIHJlY3Q6IHIsXG5cdFx0ICAgIHRyZWN0OiBjb29yZHNBZnRlclRyYW5zZm9ybShyKVxuXHRcdH1dO1xuXHQgICAgfSk7XG5cblx0Ly8gRHJhdyB0aGUgdGV4dC5cblx0bGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCdmZWF0TGFiZWwnKTtcblx0bGFiZWxzLmV4aXQoKS5yZW1vdmUoKTtcblx0bGFiZWxzXG5cdCAgLmF0dHIoXCJ4XCIsIGQgPT4gZC50cmVjdC54ICsgZC50cmVjdC53aWR0aC8yIClcblx0ICAuYXR0cihcInlcIiwgZCA9PiBkLnJlY3QuX19kYXRhX18uZ2Vub21lLnpvb21ZIC0gMylcblx0ICAudGV4dChkID0+IHtcblx0ICAgICAgIGxldCBmID0gZC5yZWN0Ll9fZGF0YV9fO1xuXHQgICAgICAgbGV0IHN5bSA9IGYuc3ltYm9sIHx8IGYubWdwaWQ7XG5cdCAgICAgICByZXR1cm4gc3ltO1xuXHQgIH0pO1xuXG5cdC8vIFB1dCBhIHJlY3RhbmdsZSBiZWhpbmQgZWFjaCBsYWJlbCBhcyBhIGJhY2tncm91bmRcblx0bGV0IGxibEJveERhdGEgPSBsYWJlbHMubWFwKGxibCA9PiBsYmxbMF0uZ2V0QkJveCgpKVxuXHRsZXQgbGJsQm94ZXMgPSBmZkdycHMuc2VsZWN0QWxsKCdyZWN0LmZlYXRMYWJlbEJveCcpXG5cdCAgICAuZGF0YSgoZCxpKSA9PiBbbGJsQm94RGF0YVtpXV0pO1xuXHRsYmxCb3hlcy5lbnRlcigpLmluc2VydCgncmVjdCcsJ3RleHQnKS5hdHRyKCdjbGFzcycsJ2ZlYXRMYWJlbEJveCcpO1xuXHRsYmxCb3hlcy5leGl0KCkucmVtb3ZlKCk7XG5cdGxibEJveGVzXG5cdCAgICAuYXR0cihcInhcIiwgICAgICBiYiA9PiBiYi54LTIpXG5cdCAgICAuYXR0cihcInlcIiwgICAgICBiYiA9PiBiYi55LTEpXG5cdCAgICAuYXR0cihcIndpZHRoXCIsICBiYiA9PiBiYi53aWR0aCs0KVxuXHQgICAgLmF0dHIoXCJoZWlnaHRcIiwgYmIgPT4gYmIuaGVpZ2h0KzIpXG5cdCAgICA7XG5cdFxuXHQvLyBpZiB0aGVyZSBpcyBhIGN1cnJGZWF0LCBtb3ZlIGl0cyBmaWR1Y2lhbHMgdG8gdGhlIGVuZCAoc28gdGhleSdyZSBvbiB0b3Agb2YgZXZlcnlvbmUgZWxzZSlcblx0aWYgKGN1cnJGZWF0KSB7XG5cdCAgICAvLyBnZXQgbGlzdCBvZiBncm91cCBlbGVtZW50cyBmcm9tIHRoZSBkMyBzZWxlY3Rpb25cblx0ICAgIGxldCBmZkxpc3QgPSBmZkdycHNbMF07XG5cdCAgICAvLyBmaW5kIHRoZSBvbmUgd2hvc2UgZmVhdHVyZSBpcyBjdXJyRmVhdFxuXHQgICAgbGV0IGkgPSAtMTtcblx0ICAgIGZmTGlzdC5mb3JFYWNoKCAoZyxqKSA9PiB7IGlmIChnLl9fZGF0YV9fLmZpZCA9PT0gY3VyckZlYXQuaWQpIGkgPSBqOyB9KTtcblx0ICAgIC8vIGlmIHdlIGZvdW5kIGl0IGFuZCBpdCdzIG5vdCBhbHJlYWR5IHRoZSBsYXN0LCBtb3ZlIGl0IHRvIHRoZVxuXHQgICAgLy8gbGFzdCBwb3NpdGlvbiBhbmQgcmVvcmRlciBpbiB0aGUgRE9NLlxuXHQgICAgaWYgKGkgPj0gMCkge1xuXHRcdGxldCBsYXN0aSA9IGZmTGlzdC5sZW5ndGggLSAxO1xuXHQgICAgICAgIGxldCB4ID0gZmZMaXN0W2ldO1xuXHRcdGZmTGlzdFtpXSA9IGZmTGlzdFtsYXN0aV07XG5cdFx0ZmZMaXN0W2xhc3RpXSA9IHg7XG5cdFx0ZmZHcnBzLm9yZGVyKCk7XG5cdCAgICB9XG5cdH1cblx0XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZGVGaWR1Y2lhbHMgKCkge1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0KFwiZy5maWR1Y2lhbHNcIilcblx0ICAgIC5jbGFzc2VkKFwiaGlkZGVuXCIsIHRydWUpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIFpvb21WaWV3XG5cbmV4cG9ydCB7IFpvb21WaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9ab29tVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIFNWR1ZpZXcgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCwgbWFyZ2lucywgcm90YXRpb24sIHRyYW5zbGF0aW9uKSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0KTtcbiAgICAgICAgdGhpcy5zdmcgPSB0aGlzLnJvb3Quc2VsZWN0KFwic3ZnXCIpO1xuICAgICAgICB0aGlzLnN2Z01haW4gPSB0aGlzLnN2Z1xuICAgICAgICAgICAgLmFwcGVuZChcImdcIikgICAgLy8gdGhlIG1hcmdpbi10cmFuc2xhdGVkIGdyb3VwXG4gICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVx0ICAvLyBtYWluIGdyb3VwIGZvciB0aGUgZHJhd2luZ1xuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJzdmdtYWluXCIpO1xuXHR0aGlzLm91dGVyV2lkdGggPSAxMDA7XG5cdHRoaXMud2lkdGggPSAxMDA7XG5cdHRoaXMub3V0ZXJIZWlnaHQgPSAxMDA7XG5cdHRoaXMuaGVpZ2h0ID0gMTAwO1xuXHR0aGlzLm1hcmdpbnMgPSB7dG9wOiAxOCwgcmlnaHQ6IDEyLCBib3R0b206IDEyLCBsZWZ0OiAxMn07XG5cdHRoaXMucm90YXRpb24gPSAwO1xuXHR0aGlzLnRyYW5zbGF0aW9uID0gWzAsMF07XG5cdC8vXG4gICAgICAgIHRoaXMuc2V0R2VvbSh7d2lkdGgsIGhlaWdodCwgbWFyZ2lucywgcm90YXRpb24sIHRyYW5zbGF0aW9ufSk7XG4gICAgfVxuICAgIHNldEdlb20gKGNmZykge1xuICAgICAgICB0aGlzLm91dGVyV2lkdGggID0gY2ZnLndpZHRoICAgICAgIHx8IHRoaXMub3V0ZXJXaWR0aDtcbiAgICAgICAgdGhpcy5vdXRlckhlaWdodCA9IGNmZy5oZWlnaHQgICAgICB8fCB0aGlzLm91dGVySGVpZ2h0O1xuICAgICAgICB0aGlzLm1hcmdpbnMgICAgID0gY2ZnLm1hcmdpbnMgICAgIHx8IHRoaXMubWFyZ2lucztcblx0dGhpcy5yb3RhdGlvbiAgICA9IHR5cGVvZihjZmcucm90YXRpb24pID09PSBcIm51bWJlclwiID8gY2ZnLnJvdGF0aW9uIDogdGhpcy5yb3RhdGlvbjtcblx0dGhpcy50cmFuc2xhdGlvbiA9IGNmZy50cmFuc2xhdGlvbiB8fCB0aGlzLnRyYW5zbGF0aW9uO1xuICAgICAgICAvL1xuICAgICAgICB0aGlzLndpZHRoICA9IHRoaXMub3V0ZXJXaWR0aCAgLSB0aGlzLm1hcmdpbnMubGVmdCAtIHRoaXMubWFyZ2lucy5yaWdodDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLm91dGVySGVpZ2h0IC0gdGhpcy5tYXJnaW5zLnRvcCAgLSB0aGlzLm1hcmdpbnMuYm90dG9tO1xuICAgICAgICAvL1xuICAgICAgICB0aGlzLnN2Zy5hdHRyKFwid2lkdGhcIiwgdGhpcy5vdXRlcldpZHRoKVxuICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLm91dGVySGVpZ2h0KVxuICAgICAgICAgICAgLnNlbGVjdCgnZ1tuYW1lPVwic3ZnbWFpblwiXScpXG4gICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHt0aGlzLm1hcmdpbnMubGVmdH0sJHt0aGlzLm1hcmdpbnMudG9wfSkgcm90YXRlKCR7dGhpcy5yb3RhdGlvbn0pIHRyYW5zbGF0ZSgke3RoaXMudHJhbnNsYXRpb25bMF19LCR7dGhpcy50cmFuc2xhdGlvblsxXX0pYCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzZXRNYXJnaW5zKCB0bSwgcm0sIGJtLCBsbSApIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0ICAgIHJtID0gYm0gPSBsbSA9IHRtO1xuXHR9XG5cdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcblx0ICAgIGJtID0gdG07XG5cdCAgICBsbSA9IHJtO1xuXHR9XG5cdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDQpXG5cdCAgICB0aHJvdyBcIkJhZCBhcmd1bWVudHMuXCI7XG4gICAgICAgIC8vXG5cdHRoaXMuc2V0R2VvbSh7dG9wOiB0bSwgcmlnaHQ6IHJtLCBib3R0b206IGJtLCBsZWZ0OiBsbX0pO1xuXHQvL1xuXHRyZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcm90YXRlIChkZWcpIHtcbiAgICAgICAgdGhpcy5zZXRHZW9tKHtyb3RhdGlvbjpkZWd9KTtcblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRyYW5zbGF0ZSAoZHgsIGR5KSB7XG4gICAgICAgIHRoaXMuc2V0R2VvbSh7dHJhbnNsYXRpb246W2R4LGR5XX0pO1xuXHRyZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy8gQXJnczpcbiAgICAvLyAgIHRoZSB3aW5kb3cgd2lkdGhcbiAgICBmaXRUb1dpZHRoICh3aWR0aCkge1xuICAgICAgICBsZXQgciA9IHRoaXMuc3ZnWzBdWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLnNldEdlb20oe3dpZHRoOiB3aWR0aCAtIHIueH0pXG5cdHJldHVybiB0aGlzO1xuICAgIH1cblxufSAvLyBlbmQgY2xhc3MgU1ZHVmlld1xuXG5leHBvcnQgeyBTVkdWaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9TVkdWaWV3LmpzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9