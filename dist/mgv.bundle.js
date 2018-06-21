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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return initOptList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return d3tsv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return d3json; });
/* unused harmony export deepc */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return parseCoords; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return formatCoords; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return overlaps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return subtract; });
/* unused harmony export obj2list */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return same; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getCaretRange; });
/* unused harmony export setCaretRange */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return setCaretPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return moveCaretPosition; });
/* unused harmony export getCaretPosition */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return coordsAfterTransform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return removeDups; });

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
    get id () {
        return this.mgiid || this.mgpid;
    }
    //----------------------------------------------
    get label () {
        return this.symbol || this.mgpid;
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




/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MGVApp__ = __webpack_require__(7);
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
    pgenomes = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["j" /* removeDups */])(pgenomes.trim().split(/ +/));
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
	if ('#'+newHash === window.location.hash) return;
	// don't want to trigger an infinite loop here!
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
	mgv.setContext(cfg);
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MGVApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Genome__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__FeatureManager__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__QueryManager__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ListManager__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ListEditor__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__UserPrefsManager__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__FacetManager__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__BTManager__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__GenomeView__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__FeatureDetails__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ZoomView__ = __webpack_require__(22);














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
	this.coords = { chr: "1", start: 1000000, end: 10000000 };
	//
	// TODO: refactor pagebox, draggable, and friends into a framework module,
	// 
	this.pbDragger = this.getContentDragger();
	d3.selectAll(".pagebox")
	    .call(this.pbDragger)
	    .append("i")
	    .attr("class","material-icons busy rotating")
	    ;
	d3.selectAll(".closable")
	    .append("i")
	    .attr("class","material-icons button close")
	    .on("click.default", function () {
		let p = d3.select(this.parentNode);
		p.classed("closed", ! p.classed("closed"));
		self.setPrefsFromUI();
	    });
	d3.selectAll(".content-draggable > *")
	    .append("i")
	    .attr("class","material-icons button draghandle");
	//
	//
	this.genomeView = new __WEBPACK_IMPORTED_MODULE_10__GenomeView__["a" /* GenomeView */](this, "#genomeView", 800, 250);
	this.zoomView   = new __WEBPACK_IMPORTED_MODULE_12__ZoomView__["a" /* ZoomView */]  (this, "#zoomView", 800, 250, this.coords);
	this.resize();
        //
	this.featureDetails = new __WEBPACK_IMPORTED_MODULE_11__FeatureDetails__["a" /* FeatureDetails */](this, "#featureDetails");

	this.cscale = d3.scale.category10().domain([
	    "protein_coding_gene",
	    "pseudogene",
	    "ncRNA_gene",
	    "gene_segment",
	    "other_gene",
	    "other_feature_type"
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
	    method: "featuresById",
	    label: "...by symbol/ID",
	    template: "",
	    placeholder: "MGI symbols/IDs"
	},{
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
	Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* d3tsv */])("./data/genomeList.tsv").then(function(data){
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

	    //
	    let cfg = this.sanitizeCfg(this.initialCfg);
	    let self = this;

	    // initialize the ref and comp genome option lists
	    Object(__WEBPACK_IMPORTED_MODULE_0__utils__["f" /* initOptList */])("#refGenome",   this.allGenomes, g=>g.name, g=>g.label, false, g => g === cfg.ref);
	    Object(__WEBPACK_IMPORTED_MODULE_0__utils__["f" /* initOptList */])("#compGenomes", this.allGenomes, g=>g.name, g=>g.label, true,  g => cfg.genomes.indexOf(g) !== -1);
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
	    // Preload all the chromosome files for all the genomes
	    let cdps = this.allGenomes.map(g => Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* d3tsv */])(`./data/genomedata/${g.name}-chromosomes.tsv`));
	    return Promise.all(cdps);
	}.bind(this))
	.then(function (data) {

	    //
	    this.processChromosomes(data);

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
    showBusy (isBusy) {
        d3.select("#header > .gear.button")
	    .classed("rotating", isBusy);
    }
    //----------------------------------------------
    // Args:
    //   g  (string) genome name (eg "mus_caroli") or label (eg "CAROLI/EiJ") 
    // Returns:
    //   true iff the ref genome was actually changed
    setRefGenome (g) {
	//
	if (!g) return false;
	//
	let rg = this.nl2genome[g];
	if (rg && rg !== this.rGenome){
	    // change the ref genome
	    this.rGenome = rg;
	    d3.selectAll("#refGenome option")
	        .property("selected",  gg => (gg.label === rg.label  || null));
	    return true;
	}
	return false;
    }
    //----------------------------------------------
    // Args:
    //   glist (list of strings) genome name or labels
    // Returns:
    //   true iff comp genomes actually changed
    setCompGenomes (glist) {
        //
        if (!glist) return false;
	// 
	let cgs = [];
	for( let x of glist ) {
	    let cg = this.nl2genome[x];
	    cg && cg !== this.rGenome && cgs.indexOf(cg) === -1 && cgs.push(cg);
	}
	let cgns = cgs.map( cg => cg.label );
	d3.selectAll("#compGenomes option")
	        .property("selected",  gg => cgns.indexOf(gg.label) >= 0);
	//
	// compare contents of cgs with the current cGenomes.
	if (Object(__WEBPACK_IMPORTED_MODULE_0__utils__["k" /* same */])(cgs, this.cGenomes)) return false;
	//
	this.cGenomes = cgs;
	return true;
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
        let c = this.zoomView.coords;
        return {
	    ref : this.rGenome.label,
	    genomes: this.vGenomes.map(g=>g.label),
	    chr: c.chr,
	    start: c.start,
	    end: c.end,
	    highlight: Object.keys(this.zoomView.hiFeats),
	    dmode: this.zoomView.dmode
	}
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

	// 
	if (c.width || c.height) {
	    cfg.width = c.width
	}

	//
	// Set cfg.ref to specified genome, 
	//   with fallback to current ref genome, 
	//      with fallback to C57BL/6J (1st time thru)
	// FIXME: final fallback should be a config setting.
	cfg.ref = (c.ref ? this.nl2genome[c.ref] || this.rGenome : this.rGenome) || this.nl2genome['C57BL/6J'];

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
	
	// Set cfg.chr to be the specified chromosome
	//     with fallback to the current chr
	//         with fallback to the 1st chromosome in the ref genome
	cfg.chr = cfg.ref.getChromosome(c.chr);
	if (!cfg.chr) cfg.chr = cfg.ref.getChromosome( this.coords ? this.coords.chr : "1" );
	if (!cfg.chr) cfg.chr = cfg.ref.getChromosome(0);
	//if (!cfg.chr) console.log("warning: no chromosome");
	
	// Ensure start <= end
	if (typeof(c.start) === "number" && typeof(c.end) === "number" && c.start > c.end ) {
	    // swap
	    let tmp = c.start; c.start = c.end; c.end = tmp;
	}

	// Set cfg.start to be the specified start
	//     with fallback to the current start
	//        with fallback to 1
	//           with a min value of 1
	cfg.start = Math.floor(Math.max( 1, typeof(c.start) === "number" ? c.start : this.coords ? this.coords.start : 1 ));

	// Set cfg.end to be the specified end
	//     with fallback to the current end
	//         with fallback to start + 10 MB
	cfg.end = typeof(c.end) === "number" ?
	    c.end
	    :
	    this.coords ?
	        (cfg.start + this.coords.end - this.coords.start + 1)
		:
		cfg.start;
	// clip at chr end
	cfg.end = Math.floor(cfg.chr ? Math.min(cfg.end,   cfg.chr.length) : cfg.end);

	// Set cfg.highlight
	//    with fallback to current highlight
	//        with fallback to []
	cfg.highlight = c.highlight || this.zoomView.highlighted || [];

	// Set the drawing mode for the ZoonView.
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
    //            chr       (string) Chromosome for coordinate range
    //            start     (int) Coordinate range start position
    //            end       (int) Coordinate range end position
    //            highlight (list o strings) IDs of features to highlight
    //            dmode     (string) either 'comparison' or 'reference'
    //
    // Returns:
    //    Nothing
    // Side effects:
    //	  Redraws 
    //	  Calls contextChanged() 
    //
    setContext (c) {
        let cfg = this.sanitizeCfg(c);
	//
	this.vGenomes = cfg.genomes;
	this.rGenome  = cfg.ref;
	this.cGenomes = cfg.genomes.filter(g => g !== cfg.ref);
	this.coords   = { chr: cfg.chr.name, start: cfg.start, end: cfg.end };
	//
	this.genomeView.redraw();
	this.genomeView.setBrushCoords(this.coords);
	//
	this.zoomView.highlighted = cfg.highlight;
	this.zoomView.genomes = this.vGenomes;
	this.zoomView.update(this.coords);
	//
	this.zoomView.dmode = cfg.dmode;
	//
	this.contextChanged();
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
	let hls = `highlight=${c.highlight.join("+")}`;
	let dmode = `dmode=${c.dmode}`;
	return `${dmode}&${ref}&${genomes}&${coords}&${hls}`;
    }

    //----------------------------------------------
    get currentList () {
        return this.currList;
    }
    set currentList (lst) {
    	//
	this.currList = lst;
	//
	let lists = d3.select('#mylists').selectAll('.listInfo');
	lists.classed("current", d => d === lst);
	if (lst) {
	    // make this list the current selection in the zoom view
	    this.zoomView.hiFeats = lst.ids.reduce((a,v) => { a[v]=v; return a; }, {})
	    this.zoomView.update();
	    // show this list as tick marks in the genome view
	    this.featureManager.getFeaturesById(this.rGenome, lst.ids)
		.then( feats => {
		    this.genomeView.drawTicks(feats);
		    this.genomeView.drawTitle();
		});
	}
	else {
	    this.zoomView.hiFeats = {};
	    this.zoomView.update();
	    //
	    this.genomeView.drawTicks([]);
	    this.genomeView.drawTitle();
	}
    }

    //----------------------------------------------
    sanitizeCoords(coords) {
	if (typeof(coords) === "string") 
	    coords = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["i" /* parseCoords */])(coords);
	let chromosome = this.rGenome.chromosomes.filter(c => c.name === coords.chr)[0];
	if (! chromosome) return null;
	if (coords.start > coords.end) {
	    let tmp = coords.start; coords.start = coords.end; coords.end = tmp;
	}
	coords.start = Math.max(1, Math.floor(coords.start))
	coords.end   = Math.min(chromosome.length, Math.floor(coords.end))
        return coords;
    }

    //----------------------------------------------
    // Zooms in/out by factor. New zoom width is factor * the current zoom width.
    // Factor > 1 zooms out, 0 < factor < 1 zooms in.
    zoom (factor) {

	let len = this.coords.end - this.coords.start + 1;
	let newlen = Math.round(factor * len);
	let x = (this.coords.start + this.coords.end)/2;
	let newstart = Math.round(x - newlen/2);
	this.setContext({ chr: this.coords.chr, start: newstart, end: newstart + newlen - 1 });
    }

    //----------------------------------------------
    // Pans the view left or right by factor. The distance moved is factor times the current zoom width.
    // Negative values pan left. Positive values pan right. (Note that panning moves the "camera". Panning to the
    // right makes the objects in the scene appear to move to the left, and vice versa.)
    //
    pan (factor, animate) {
	let width = this.coords.end - this.coords.start + 1;
	let panDist = factor * (this.zoomView.xscale.range()[1]);
	let d = Math.round(factor * width);
	let ns;
	let ne;
	if (d < 0) {
	    ns = Math.max(1, this.coords.start+d);
	    ne = ns + width - 1;
	}
	else if (d > 0) {
	    let chromosome = this.rGenome.chromosomes.filter(c => c.name === this.coords.chr)[0];
	    ne = Math.min(chromosome.length, this.coords.end+d)
	    ns = ne - width + 1;
	}
	// this probably doesn't belong here but for now...
	// To get a smooth panning effect: initialize the translation to the same as
	// the pan distance, but in the opposite direction...
	//this.zoomView.svg
	    //.style("transition", "transform 0s")
	    //.style("transform", `translate(${-panDist}px,0px)`);
	// ...then the zoom draw will transition the vector back to (0,0)
	this.setContext({ chr: this.coords.chr, start: ns, end: ne });
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
/* 8 */
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
/* 9 */
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
        this.featCache = {};     // index from mgpid -> feature
	this.mgiCache = {};	 // index from mgiid -> [ features ]
	this.cache = {};         // {genome.name -> {chr.name -> list of blocks}}
	this.mineFeatureCache = {}; // auxiliary info pulled from MouseMine 
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
	    let f = this.featCache[d.mgpid];
	    if (f) return f;
	    // Create a new Feature
	    d.genome = genome
	    f = new __WEBPACK_IMPORTED_MODULE_1__Feature__["a" /* Feature */](d);
	    // Register it.
	    this.featCache[f.mgpid] = f;
	    if (f.mgiid) {
		let lst = this.mgiCache[f.mgiid] = (this.mgiCache[f.mgiid] || []);
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
	return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* d3json */])(url).then(function(blocks){
	    blocks.forEach( b => self._registerBlock(genome, b) );
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
    _getCachedFeatures (genome, range) {
        let gc = this.cache[genome.name] ;
	if (!gc) return [];
	let cBlocks = gc[range.chr];
	if (!cBlocks) return [];
	let feats = cBlocks
	    .filter(cb => Object(__WEBPACK_IMPORTED_MODULE_0__utils__["h" /* overlaps */])(cb, range))
	    .map( cb => cb.features.filter( f => Object(__WEBPACK_IMPORTED_MODULE_0__utils__["h" /* overlaps */])( f, range) ) )
	    .reduce( (acc, val) => acc.concat(val), []);
        return feats;	
    }

    //----------------------------------------------
    getCachedFeaturesByMgiId (mgiid) {
        return this.mgiCache[mgiid] || [];
    }

    //----------------------------------------------
    // This is what the user calls. Returns a promise for the features in 
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
		let f = this.mgiCache[i] || this.featCache[i];
		f && add(f);
	    }
	    return feats;
	});
    }

} // end class Feature Manager




/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QueryManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__AuxDataManager__ = __webpack_require__(11);




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
	Object(__WEBPACK_IMPORTED_MODULE_0__utils__["f" /* initOptList */])(this.select[0][0], this.cfg, c=>c.method, c=>c.label);
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
/* 11 */
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
	return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* d3json */])(url).then(data => data.results||[]);
    }

    //----------------------------------------------
    // do a LOOKUP query for SequenceFeatures from MouseMine
    featuresByLookup (qryString) {
	let q = `<query name="" model="genomic" view="SequenceFeature.primaryIdentifier SequenceFeature.symbol" longDescription="" constraintLogic="A and B and C">
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
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StorageManager__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ListFormulaEvaluator__ = __webpack_require__(13);




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
/* 13 */
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
/* 14 */
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
	    let r = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["e" /* getCaretRange */])(e);
	    e.value = v.slice(0,r[0]) + t + v.slice(r[1]);
	    Object(__WEBPACK_IMPORTED_MODULE_0__utils__["l" /* setCaretPosition */])(e, r[0]+t.length);
	    e.focus();
	}
	let range = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["e" /* getCaretRange */])(ielt);
	if (range[0] === range[1]) {
	    // no current selection
	    splice(ielt, text);
	    if (text === "()") 
		Object(__WEBPACK_IMPORTED_MODULE_0__utils__["g" /* moveCaretPosition */])(ielt, -1);
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
/* 15 */
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
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FacetManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Facet__ = __webpack_require__(17);


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
/* 17 */
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
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BTManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BlockTranslator__ = __webpack_require__(19);



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
	return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* d3tsv */])(fn1)
	  .then(function(blocks){
	      // yup, it was A-B
	      self.registerBlocks(fn1, aGenome, bGenome, blocks);
	      return blocks
	  })
	  .catch(function(e){
	      console.log(`INFO: Disregard that 404 message! ${fn1} was not found. Trying ${fn2}.`);
	      return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* d3tsv */])(fn2)
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
    // Returns the synteny blocks that map the current ref genome to the specified comparison genome.
    //
    getBlocks (fromGenome, toGenome) {
        let blkTrans = this.rcBlocks[fromGenome.name][toGenome.name];
	return blkTrans.getBlocks(fromGenome)
    }

    //----------------------------------------------
    // Translates the given coordinate range from the specified fromGenome to the specified toGenome.
    // Returns a list of zero or more coordinate ranges in the toGenome.
    //
    // FIXME is this code even used? looks out of place. copy/paste error?
    translate (fromGenome, chr, start, end, toGenome) {
	// get the right block file
	let blkTrans = this.rcBlocks[fromGenome.name][toGenome.name];
	if (!blkTrans) throw "Internal error. No block file found in index."
	// translate!
	let ranges = blkTrans.translate(fromGenome, chr, start, end);
	return ranges;
    }
} // end class BTManager




/***/ }),
/* 19 */
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
	this.currentSort = "a";
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
    translate (fromGenome, chr, start, end) {
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
	        return {
		    chr:   blk[toC],
		    start: Math.min(s2,e2),
		    end:   Math.max(s2,e2),
		    ori:   blk.blockOri,
		    index: blk[toI],
		    // also return the fromGenome coordinates corresponding to this piece of the translation
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
	let toC = to+"Chr";
	let toS = to+"Start";
	let toE = to+"End";
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
		    toChr:     blk[toC],
		    toStart:   blk[toS],
		    toEnd:     blk[toE],
		};
	    })
	// 
	return blks;
    }
}




/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GenomeView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SVGView__ = __webpack_require__(5);
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
	var xtnt = this.brushChr.brush.extent();
	if (Math.abs(xtnt[0] - xtnt[1]) <= 10){
	    // user clicked
	    let cxt = this.app.getContext()
	    let w = cxt.end - cxt.start + 1;
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
	feats.enter()
	    .append(shape)
	    .attr("class","feature")
	    .append("title")
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
/* 21 */
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
	    flist = this.app.featureManager.getCachedFeaturesByMgiId(f.mgiid);
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
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ZoomView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SVGView__ = __webpack_require__(5);
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
      this.coords = initialCoords;// curr zoom view coords { chr, start, end }
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
	// click on background => hide context menu
	this.root
	  .on("click.context", () => {
	      let tgt = d3.event.target;
	      if (tgt.tagName.toLowerCase() === "i" && tgt.innerHTML === "menu")
		  // exception: the context menu button itself
	          return;
	      else
		  this.hideContextMenu()
	  });

	//
	//
	let fSelect = function (f, shift, preserve) {
	    let id = f.mgiid || f.mgpid;
	    if (shift) {
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
		    fSelect(f, d3.event.shiftKey, true);
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
	      let tgt = d3.select(d3.event.target);
	      let t = tgt[0][0];
	      if (t.tagName == "rect" && t.classList.contains("feature")) {
		  // user clicked on a feature
		  fSelect(t.__data__, d3.event.shiftKey);
		  this.highlight();
	          this.app.contextChanged();
	      }
	      else if (t.tagName == "rect" && t.classList.contains("block") && !d3.event.shiftKey) {
		  // user clicked on a synteny block background
		  this.hiFeats = {};
		  this.highlight();
		  this.app.contextChanged();
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

	// Button: Menu in zoom view
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
	    .call(zcs => zcs[0][0].value = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["d" /* formatCoords */])(this.coords))
	    .on("change", function () {
		let coords = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["i" /* parseCoords */])(this.value);
		if (! coords) {
		    alert("Please enter a coordinate range formatted as 'chr:start..end'. " +
		          "For example, '5:10000000..50000000'.");
		    this.value = "";
		    return;
		}
		self.app.setContext(coords);
	    });
	// zoom window size box
	this.root.select("#zoomWSize")
	    .on("change", function() {
	        let ws = parseInt(this.value);
		let c = self.coords;
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
			end: newe

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
	this.genomes = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["j" /* removeDups */])(ns).map(n=> this.app.name2genome[n] ).filter(x=>x);
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
	      if (d3.select(t).attr("name") !== 'zoomStripHandle'){
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
    // handler for the start of a brush action by the user on a block
    bbStart (blk,bElt) {
      this.brushing = blk;
    }
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
    bbEnd () {
      let xt = this.brushing.brush.extent();
      let r = this.bbGetRefCoords();
      this.brushing = null;
      //
      let se = d3.event.sourceEvent;
      if (se.ctrlKey || se.altKey || se.metaKey) {
	  this.clearBrushes();
          return;
      }
      //
      if (Math.abs(xt[0] - xt[1]) <= 10){
          // user clicked instead of dragged. Recenter the view instead of zooming.
	  let cxt = this.app.getContext();
	  let w = cxt.end - cxt.start + 1;
	  r.start -= w/2;
	  r.end += w/2;
      }
      else if (se.shiftKey) {
          // zoom out
	  let currWidth = this.coords.end - this.coords.start + 1;
	  let brushWidth = r.end - r.start + 1;
	  let factor = currWidth / brushWidth;
	  let newWidth = factor * currWidth;
	  let ds = ((r.start - this.coords.start + 1)/currWidth) * newWidth;
	  r.start = this.coords.start - ds;
	  r.end = r.start + newWidth - 1;
      }
      this.app.setContext(r);
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
    update (coords) {
	let self = this;
	let c = this.coords = (coords || this.coords);
	d3.select("#zoomCoords")[0][0].value = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["d" /* formatCoords */])(c.chr, c.start, c.end);
	d3.select("#zoomWSize")[0][0].value = Math.round(c.end - c.start + 1)
	//
        let mgv = this.app;
	// when the translator is ready, we can translate the ref coords to each genome and
	// issue requests to load the features in those regions.
	mgv.showBusy(true);
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
		    promises.push(mgv.featureManager.getFeatures(cGenome, ranges))
		});
	    }
	    // when everything is ready, call the draw function
	    Promise.all(promises).then( data => {
	        self.draw(data);
		mgv.showBusy(false);
            });
	});
    }

    //----------------------------------------------
    orderSBlocks (sblocks) {
	// Sort the sblocks in each strip according to the current drawing mode.
	let cmpField = this.dmode === 'comparison' ? 'index' : 'fIndex';
	let cmpFunc = (a,b) => a.__data__[cmpField]-b.__data__[cmpField];
	sblocks.forEach( strip => strip.sort( cmpFunc ) );
	// pixels per base
	let ppb = this.width / (this.coords.end - this.coords.start + 1);
	let offset = []; // offset of start position of next block, by strip index (0===ref)
	let self = this;
	sblocks.each( function (b,i,j) { // b=block, i=index within strip, j=strip index
	    let blen = ppb * (b.end - b.start + 1); // total screen width of this sblock
	    b.flip = b.ori === '-' && self.dmode === 'reference';
	    b.xscale = d3.scale.linear().domain([b.start, b.end]).range( b.flip ? [blen, 0] : [0, blen] );
	    let dx = i === 0 ? 0 : offset[j];
	    d3.select(this).attr("transform", `translate(${dx},0)`);
	    offset[j] = dx + blen + 2;
	});
	//
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
	    .attr("class", b => "sBlock " + (b.ori==="+" ? "plus" : b.ori==="-" ? "minus": "confused") + (b.chr !== b.fChr ? " translocation" : ""))
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
	// current's feature
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

	// Draw feature labels. Each label is drawn once, above the first rectangle in its list.
	// 
	let labels = ffGrps.selectAll('text.featLabel')
	    .data(d => [{ fid: d.fid, rect: d.rects[0][0], trect: Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* coordsAfterTransform */])(d.rects[0][0]) }]);
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

	// Put a rectangle behind each label (as a background)
	let lblBoxData = labels.map(lbl => lbl[0].getBBox())
	let lblBoxes = ffGrps.selectAll('rect.featLabelBox')
	    .data((d,i) => [lblBoxData[i]]);
	lblBoxes.enter().insert('rect',':first-child').attr('class','featLabelBox');
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
	    let c1 = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* coordsAfterTransform */])(r[0]); // transform coords for 1st rect
	    let c2= Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* coordsAfterTransform */])(r[1]);  // transform coords for 2nd rect
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
    }
    //----------------------------------------------
    hideFiducials () {
	this.svgMain.select("g.fiducials")
	    .classed("hidden", true);
    }
} // end class ZoomView




/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDAyYmFjYzMyZDcxYjQ2NTQ1ZTQiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1N0b3JhZ2VNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvU1ZHVmlldy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvdmlld2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9NR1ZBcHAuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZS5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1F1ZXJ5TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQXV4RGF0YU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYUV2YWx1YXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvTGlzdEVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvVXNlclByZWZzTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmFjZXRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GYWNldC5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQlRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9CbG9ja1RyYW5zbGF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZVZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzIiwid2VicGFjazovLy8u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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQW1CQTs7Ozs7Ozs7QUNsVkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7OztBQ3JCUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUTs7Ozs7Ozs7O0FDMURSO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQyxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQyxNQUFNO0FBQ047QUFDQTtBQUNBLDRIQUFvRSxPQUFPO0FBQzNFO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsb0JBQW9CO0FBQ3JELEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFFBQVEsVUFBVSxFQUFFLElBQUk7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGlCQUFpQjtBQUN4Qzs7QUFFQTtBQUNBO0FBQ0E7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QUNsRTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFTzs7Ozs7Ozs7OztBQy9Sb0I7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7Ozs7Ozs7QUNuRXFEO0FBQ3pDO0FBQ1E7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7Ozs7QUNqT3NCOztBQUU5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7Ozs7O0FDdkNROztBQUVoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7O0FDN0JSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTzs7Ozs7Ozs7Ozs7QUNwQlE7QUFDVTs7QUFFMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQ0FBZ0MsYUFBYSxHQUFHLGFBQWE7QUFDN0QsZ0NBQWdDLGFBQWEsR0FBRyxhQUFhO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0Esd0RBQXdELElBQUkseUJBQXlCLElBQUk7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsNkRBQTZELGFBQWEsR0FBRyxhQUFhLFlBQVksRUFBRTtBQUN4RyxLQUFLO0FBQ0wsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7OztBQ3RHUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFUTs7Ozs7Ozs7Ozs7QUNuSVU7QUFDYTs7QUFFL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsa0JBQWtCO0FBQ2xCLHNCQUFzQjtBQUN0QixzQkFBc0I7QUFDdEIsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtB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QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPIiwiZmlsZSI6Im1ndi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0MDJiYWNjMzJkNzFiNDY1NDVlNCIsIlxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyAgICAgICAgICAgICAgICAgICAgVVRJTFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIChSZS0pSW5pdGlhbGl6ZXMgYW4gb3B0aW9uIGxpc3QuXG4vLyBBcmdzOlxuLy8gICBzZWxlY3RvciAoc3RyaW5nIG9yIE5vZGUpIENTUyBzZWxlY3RvciBvZiB0aGUgY29udGFpbmVyIDxzZWxlY3Q+IGVsZW1lbnQuIE9yIHRoZSBlbGVtZW50IGl0c2VsZi5cbi8vICAgb3B0cyAobGlzdCkgTGlzdCBvZiBvcHRpb24gZGF0YSBvYmplY3RzLiBNYXkgYmUgc2ltcGxlIHN0cmluZ3MuIE1heSBiZSBtb3JlIGNvbXBsZXguXG4vLyAgIHZhbHVlIChmdW5jdGlvbiBvciBudWxsKSBGdW5jdGlvbiB0byBwcm9kdWNlIHRoZSA8b3B0aW9uPiB2YWx1ZSBmcm9tIGFuIG9wdHMgaXRlbVxuLy8gICAgICAgRGVmYXVsdHMgdG8gdGhlIGlkZW50aXR5IGZ1bmN0aW9uICh4PT54KS5cbi8vICAgbGFiZWwgKGZ1bmN0aW9uIG9yIG51bGwpIEZ1bmN0aW9uIHRvIHByb2R1Y2UgdGhlIDxvcHRpb24+IGxhYmVsIGZyb20gYW4gb3B0cyBpdGVtXG4vLyAgICAgICBEZWZhdWx0cyB0byB0aGUgdmFsdWUgZnVuY3Rpb24uXG4vLyAgIG11bHRpIChib29sZWFuKSBTcGVjaWZpZXMgaWYgdGhlIGxpc3Qgc3VwcG9ydCBtdWx0aXBsZSBzZWxlY3Rpb25zLiAoZGVmYXVsdCA9IGZhbHNlKVxuLy8gICBzZWxlY3RlZCAoZnVuY3Rpb24gb3IgbnVsbCkgRnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIGEgZ2l2ZW4gb3B0aW9uIGlzIHNlbGVjdGQuXG4vLyAgICAgICBEZWZhdWx0cyB0byBkPT5GYWxzZS4gTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgb25seSBhcHBsaWVkIHRvIG5ldyBvcHRpb25zLlxuLy8gICBzb3J0QnkgKGZ1bmN0aW9uKSBPcHRpb25hbC4gSWYgcHJvdmlkZWQsIGEgY29tcGFyaXNvbiBmdW5jdGlvbiB0byB1c2UgZm9yIHNvcnRpbmcgdGhlIG9wdGlvbnMuXG4vLyAgIFx0IFRoZSBjb21wYXJpc29uIGZ1bmN0aW9uIGlzIHBhc3NlcyB0aGUgZGF0YSBvYmplY3RzIGNvcnJlc3BvbmRpbmcgdG8gdHdvIG9wdGlvbnMgYW5kIHNob3VsZFxuLy8gICBcdCByZXR1cm4gLTEsIDAgb3IgKzEuIElmIG5vdCBwcm92aWRlZCwgdGhlIG9wdGlvbiBsaXN0IHdpbGwgaGF2ZSB0aGUgc2FtZSBzb3J0IG9yZGVyIGFzIHRoZSBvcHRzIGFyZ3VtZW50LlxuLy8gUmV0dXJuczpcbi8vICAgVGhlIG9wdGlvbiBsaXN0IGluIGEgRDMgc2VsZWN0aW9uLlxuZnVuY3Rpb24gaW5pdE9wdExpc3Qoc2VsZWN0b3IsIG9wdHMsIHZhbHVlLCBsYWJlbCwgbXVsdGksIHNlbGVjdGVkLCBzb3J0QnkpIHtcblxuICAgIC8vIHNldCB1cCB0aGUgZnVuY3Rpb25zXG4gICAgbGV0IGlkZW50ID0gZCA9PiBkO1xuICAgIHZhbHVlID0gdmFsdWUgfHwgaWRlbnQ7XG4gICAgbGFiZWwgPSBsYWJlbCB8fCB2YWx1ZTtcbiAgICBzZWxlY3RlZCA9IHNlbGVjdGVkIHx8ICh4ID0+IGZhbHNlKTtcblxuICAgIC8vIHRoZSA8c2VsZWN0PiBlbHRcbiAgICBsZXQgcyA9IGQzLnNlbGVjdChzZWxlY3Rvcik7XG5cbiAgICAvLyBtdWx0aXNlbGVjdFxuICAgIHMucHJvcGVydHkoJ211bHRpcGxlJywgbXVsdGkgfHwgbnVsbCkgO1xuXG4gICAgLy8gYmluZCB0aGUgb3B0cy5cbiAgICBsZXQgb3MgPSBzLnNlbGVjdEFsbChcIm9wdGlvblwiKVxuICAgICAgICAuZGF0YShvcHRzLCBsYWJlbCk7XG4gICAgb3MuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKFwib3B0aW9uXCIpIFxuICAgICAgICAuYXR0cihcInZhbHVlXCIsIHZhbHVlKVxuICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCBvID0+IHNlbGVjdGVkKG8pIHx8IG51bGwpXG4gICAgICAgIC50ZXh0KGxhYmVsKSBcbiAgICAgICAgO1xuICAgIC8vXG4gICAgb3MuZXhpdCgpLnJlbW92ZSgpIDtcblxuICAgIC8vIHNvcnQgdGhlIHJlc3VsdHNcbiAgICBpZiAoIXNvcnRCeSkgc29ydEJ5ID0gKGEsYikgPT4ge1xuICAgIFx0bGV0IGFpID0gb3B0cy5pbmRleE9mKGEpO1xuXHRsZXQgYmkgPSBvcHRzLmluZGV4T2YoYik7XG5cdHJldHVybiBhaSAtIGJpO1xuICAgIH1cbiAgICBvcy5zb3J0KHNvcnRCeSk7XG5cbiAgICAvL1xuICAgIHJldHVybiBzO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByb21pc2lmaWVzIGEgY2FsbCB0byBkMy50c3YuXG4vLyBBcmdzOlxuLy8gICB1cmwgKHN0cmluZykgVGhlIHVybCBvZiB0aGUgdHN2IHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbGlzdCBvZiByb3cgb2JqZWN0c1xuZnVuY3Rpb24gZDN0c3YodXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkMy50c3YodXJsLCBmdW5jdGlvbihlcnJvciwgdmFsKXtcbiAgICAgICAgICAgIGVycm9yID8gcmVqZWN0KHsgc3RhdHVzOiBlcnJvci5zdGF0dXMsIHN0YXR1c1RleHQ6IGVycm9yLnN0YXR1c1RleHR9KSA6IHJlc29sdmUodmFsKTtcbiAgICAgICAgfSkgIFxuICAgIH0pOyBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcm9taXNpZmllcyBhIGNhbGwgdG8gZDMuanNvbi5cbi8vIEFyZ3M6XG4vLyAgIHVybCAoc3RyaW5nKSBUaGUgdXJsIG9mIHRoZSBqc29uIHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUganNvbiBvYmplY3QgdmFsdWUsIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvclxuZnVuY3Rpb24gZDNqc29uKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZDMuanNvbih1cmwsIGZ1bmN0aW9uKGVycm9yLCB2YWwpe1xuICAgICAgICAgICAgZXJyb3IgPyByZWplY3QoeyBzdGF0dXM6IGVycm9yLnN0YXR1cywgc3RhdHVzVGV4dDogZXJyb3Iuc3RhdHVzVGV4dH0pIDogcmVzb2x2ZSh2YWwpO1xuICAgICAgICB9KSAgXG4gICAgfSk7IFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgYSBkZWVwIGNvcHkgb2Ygb2JqZWN0IG8uIFxuLy8gQXJnczpcbi8vICAgbyAgKG9iamVjdCkgTXVzdCBiZSBhIEpTT04gb2JqZWN0IChubyBjdXJjdWxhciByZWZzLCBubyBmdW5jdGlvbnMpLlxuLy8gUmV0dXJuczpcbi8vICAgYSBkZWVwIGNvcHkgb2Ygb1xuZnVuY3Rpb24gZGVlcGMobykge1xuICAgIGlmICghbykgcmV0dXJuIG87XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG8pKTtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQYXJzZXMgYSBzdHJpbmcgb2YgdGhlIGZvcm0gXCJjaHI6c3RhcnQuLmVuZFwiLlxuLy8gUmV0dXJuczpcbi8vICAgb2JqZWN0IGNvbnRpbmluZyB0aGUgcGFyc2VkIGZpZWxkcy5cbi8vIEV4YW1wbGU6XG4vLyAgIHBhcnNlQ29vcmRzKFwiMTA6MTAwMDAwMDAuLjIwMDAwMDAwXCIpIC0+IHtjaHI6XCIxMFwiLCBzdGFydDoxMDAwMDAwMCwgZW5kOjIwMDAwMDAwfVxuZnVuY3Rpb24gcGFyc2VDb29yZHMgKGNvb3Jkcykge1xuICAgIGxldCByZSA9IC8oW146XSspOihcXGQrKVxcLlxcLihcXGQrKS87XG4gICAgbGV0IG0gPSBjb29yZHMubWF0Y2gocmUpO1xuICAgIHJldHVybiBtID8ge2NocjptWzFdLCBzdGFydDpwYXJzZUludChtWzJdKSwgZW5kOnBhcnNlSW50KG1bM10pfSA6IG51bGw7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRm9ybWF0cyBhIGNocm9tb3NvbWUgbmFtZSwgc3RhcnQgYW5kIGVuZCBwb3NpdGlvbiBhcyBhIHN0cmluZy5cbi8vIEFyZ3MgKGZvcm0gMSk6XG4vLyAgIGNvb3JkcyAob2JqZWN0KSBPZiB0aGUgZm9ybSB7Y2hyOnN0cmluZywgc3RhcnQ6aW50LCBlbmQ6aW50fVxuLy8gQXJncyAoZm9ybSAyKTpcbi8vICAgY2hyIHN0cmluZ1xuLy8gICBzdGFydCBpbnRcbi8vICAgZW5kIGludFxuLy8gUmV0dXJuczpcbi8vICAgICBzdHJpbmdcbi8vIEV4YW1wbGU6XG4vLyAgICAgZm9ybWF0Q29vcmRzKFwiMTBcIiwgMTAwMDAwMDAsIDIwMDAwMDAwKSAtPiBcIjEwOjEwMDAwMDAwLi4yMDAwMDAwMFwiXG5mdW5jdGlvbiBmb3JtYXRDb29yZHMgKGNociwgc3RhcnQsIGVuZCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG5cdGxldCBjID0gY2hyO1xuXHRjaHIgPSBjLmNocjtcblx0c3RhcnQgPSBjLnN0YXJ0O1xuXHRlbmQgPSBjLmVuZDtcbiAgICB9XG4gICAgcmV0dXJuIGAke2Nocn06JHtzdGFydH0uLiR7ZW5kfWBcbn1cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0cnVlIGlmZiB0aGUgdHdvIHJhbmdlcyBvdmVybGFwIGJ5IGF0IGxlYXN0IDEuXG4vLyBFYWNoIHJhbmdlIG11c3QgaGF2ZSBhIGNociwgc3RhcnQsIGFuZCBlbmQuXG4vL1xuZnVuY3Rpb24gb3ZlcmxhcHMgKGEsIGIpIHtcbiAgICByZXR1cm4gYS5jaHIgPT09IGIuY2hyICYmIGEuc3RhcnQgPD0gYi5lbmQgJiYgYS5lbmQgPj0gYi5zdGFydDtcbn1cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gR2l2ZW4gdHdvIHJhbmdlcywgYSBhbmQgYiwgcmV0dXJucyBhIC0gYi5cbi8vIFRoZSByZXN1bHQgaXMgYSBsaXN0IG9mIDAsIDEgb3IgMiBuZXcgcmFuZ2VzLCBkZXBlbmRpbmcgb24gYSBhbmQgYi5cbmZ1bmN0aW9uIHN1YnRyYWN0KGEsIGIpIHtcbiAgICBpZiAoYS5jaHIgIT09IGIuY2hyKSByZXR1cm4gWyBhIF07XG4gICAgbGV0IGFiTGVmdCA9IHsgY2hyOmEuY2hyLCBzdGFydDphLnN0YXJ0LCAgICAgICAgICAgICAgICAgICAgZW5kOk1hdGgubWluKGEuZW5kLCBiLnN0YXJ0LTEpIH07XG4gICAgbGV0IGFiUmlnaHQ9IHsgY2hyOmEuY2hyLCBzdGFydDpNYXRoLm1heChhLnN0YXJ0LCBiLmVuZCsxKSwgZW5kOmEuZW5kIH07XG4gICAgbGV0IGFucyA9IFsgYWJMZWZ0LCBhYlJpZ2h0IF0uZmlsdGVyKCByID0+IHIuc3RhcnQgPD0gci5lbmQgKTtcbiAgICByZXR1cm4gYW5zO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENyZWF0ZXMgYSBsaXN0IG9mIGtleSx2YWx1ZSBwYWlycyBmcm9tIHRoZSBvYmouXG5mdW5jdGlvbiBvYmoybGlzdCAobykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvKS5tYXAoayA9PiBbaywgb1trXV0pICAgIFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdHJ1ZSBpZmYgdGhlIHR3byBsaXN0cyBoYXZlIHRoZSBzYW1lIGNvbnRlbnRzIChiYXNlZCBvbiBpbmRleE9mKS5cbi8vIEJydXRlIGZvcmNlIGFwcHJvYWNoLiBCZSBjYXJlZnVsIHdoZXJlIHlvdSB1c2UgdGhpcy5cbmZ1bmN0aW9uIHNhbWUgKGFsc3QsYmxzdCkge1xuICAgcmV0dXJuIGFsc3QubGVuZ3RoID09PSBibHN0Lmxlbmd0aCAmJiBcbiAgICAgICBhbHN0LnJlZHVjZSgoYWNjLHgpID0+IChhY2MgJiYgYmxzdC5pbmRleE9mKHgpPj0wKSwgdHJ1ZSk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBZGQgYmFzaWMgc2V0IG9wcyB0byBTZXQgcHJvdG90eXBlLlxuLy8gTGlmdGVkIGZyb206IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1NldFxuU2V0LnByb3RvdHlwZS51bmlvbiA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgdW5pb24gPSBuZXcgU2V0KHRoaXMpO1xuICAgIGZvciAodmFyIGVsZW0gb2Ygc2V0Qikge1xuICAgICAgICB1bmlvbi5hZGQoZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiB1bmlvbjtcbn1cblxuU2V0LnByb3RvdHlwZS5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihzZXRCKSB7XG4gICAgdmFyIGludGVyc2VjdGlvbiA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKHZhciBlbGVtIG9mIHNldEIpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzKGVsZW0pKSB7XG4gICAgICAgICAgICBpbnRlcnNlY3Rpb24uYWRkKGVsZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnRlcnNlY3Rpb247XG59XG5cblNldC5wcm90b3R5cGUuZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgZGlmZmVyZW5jZSA9IG5ldyBTZXQodGhpcyk7XG4gICAgZm9yICh2YXIgZWxlbSBvZiBzZXRCKSB7XG4gICAgICAgIGRpZmZlcmVuY2UuZGVsZXRlKGVsZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZGlmZmVyZW5jZTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gZ2V0Q2FyZXRSYW5nZSAoZWx0KSB7XG4gICAgLy8gRklYTUU6IGRvZXMgbm90IHdvcmsgZm9yIElFXG4gICAgcmV0dXJuIFtlbHQuc2VsZWN0aW9uU3RhcnQsIGVsdC5zZWxlY3Rpb25FbmRdO1xufVxuZnVuY3Rpb24gc2V0Q2FyZXRSYW5nZSAoZWx0LCByYW5nZSkge1xuICAgIC8vIEZJWE1FOiBkb2VzIG5vdCB3b3JrIGZvciBJRVxuICAgIGVsdC5zZWxlY3Rpb25TdGFydCA9IHJhbmdlWzBdO1xuICAgIGVsdC5zZWxlY3Rpb25FbmQgICA9IHJhbmdlWzFdO1xufVxuZnVuY3Rpb24gc2V0Q2FyZXRQb3NpdGlvbiAoZWx0LCBwb3MpIHtcbiAgICBzZXRDYXJldFJhbmdlKGVsdCwgW3Bvcyxwb3NdKTtcbn1cbmZ1bmN0aW9uIG1vdmVDYXJldFBvc2l0aW9uIChlbHQsIGRlbHRhKSB7XG4gICAgc2V0Q2FyZXRQb3NpdGlvbihlbHQsIGdldENhcmV0UG9zaXRpb24oZWx0KSArIGRlbHRhKTtcbn1cbmZ1bmN0aW9uIGdldENhcmV0UG9zaXRpb24gKGVsdCkge1xuICAgIGxldCByID0gZ2V0Q2FyZXRSYW5nZShlbHQpO1xuICAgIHJldHVybiByWzFdO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdGhlIHNjcmVlbiBjb29yZGluYXRlcyBvZiBhbiBTVkcgc2hhcGUgKGNpcmNsZSwgcmVjdCwgcG9seWdvbiwgbGluZSlcbi8vIGFmdGVyIGFsbCB0cmFuc2Zvcm1zIGhhdmUgYmVlbiBhcHBsaWVkLlxuLy9cbi8vIEFyZ3M6XG4vLyAgICAgc2hhcGUgKG5vZGUpIFRoZSBTVkcgc2hhcGUuXG4vL1xuLy8gUmV0dXJuczpcbi8vICAgICBUaGUgZm9ybSBvZiB0aGUgcmV0dXJuZWQgdmFsdWUgZGVwZW5kcyBvbiB0aGUgc2hhcGUuXG4vLyAgICAgY2lyY2xlOiAgeyBjeCwgY3ksIHIgfVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBjZW50ZXIgcG9pbnQgYW5kIHRyYW5zZm9ybWVkIHJhZGl1cyAgICAgICAgIFxuLy8gICAgIGxpbmU6XHR7IHgxLCB5MSwgeDIsIHkyIH1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgZW5kcG9pbnRzXG4vLyAgICAgcmVjdDpcdHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9XG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGNvcm5lciBwb2ludCBhbmQgdHJhbnNmb3JtZWQgd2lkdGgraGVpZ2h0LlxuLy8gICAgIHBvbHlnb246IFsge3gseX0sIHt4LHl9ICwgLi4uIF1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgbGlzdCBvZiBwb2ludHNcbi8vXG4vLyBBZGFwdGVkIGZyb206IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY4NTg0NzkvcmVjdGFuZ2xlLWNvb3JkaW5hdGVzLWFmdGVyLXRyYW5zZm9ybT9ycT0xXG4vL1xuZnVuY3Rpb24gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0gKHNoYXBlKSB7XG4gICAgLy9cbiAgICBsZXQgZHNoYXBlID0gZDMuc2VsZWN0KHNoYXBlKTtcbiAgICBsZXQgc3ZnID0gc2hhcGUuY2xvc2VzdChcInN2Z1wiKTtcbiAgICBpZiAoIXN2ZykgdGhyb3cgXCJDb3VsZCBub3QgZmluZCBzdmcgYW5jZXN0b3IuXCI7XG4gICAgbGV0IHN0eXBlID0gc2hhcGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGxldCBtYXRyaXggPSBzaGFwZS5nZXRDVE0oKTtcbiAgICBsZXQgcCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgIGxldCBwMj0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgLy9cbiAgICBzd2l0Y2ggKHN0eXBlKSB7XG4gICAgLy9cbiAgICBjYXNlICdjaXJjbGUnOlxuXHRwLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImN4XCIpKTtcblx0cC55ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJjeVwiKSk7XG5cdHAyLnggPSBwLnggKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiclwiKSk7XG5cdHAyLnkgPSBwLnk7XG5cdHAgICAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRwMiAgID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdC8vIGNhbGMgbmV3IHJhZGl1cyBhcyBkaXN0YW5jZSBiZXR3ZWVuIHRyYW5zZm9ybWVkIHBvaW50c1xuXHRsZXQgZHggPSBNYXRoLmFicyhwLnggLSBwMi54KTtcblx0bGV0IGR5ID0gTWF0aC5hYnMocC55IC0gcDIueSk7XG5cdGxldCByID0gTWF0aC5zcXJ0KGR4KmR4ICsgZHkqZHkpO1xuICAgICAgICByZXR1cm4geyBjeDogcC54LCBjeTogcC55LCByOnIgfTtcbiAgICAvL1xuICAgIGNhc2UgJ3JlY3QnOlxuXHQvLyBGSVhNRTogZG9lcyBub3QgaGFuZGxlIHJvdGF0aW9ucyBjb3JyZWN0bHkuIFRvIGZpeCwgdHJhbnNsYXRlIGNvcm5lciBwb2ludHMgc2VwYXJhdGVseSBhbmQgdGhlblxuXHQvLyBjYWxjdWxhdGUgdGhlIHRyYW5zZm9ybWVkIHdpZHRoIGFuZCBoZWlnaHQuIEFzIGEgY29udmVuaWVuY2UgdG8gdGhlIHVzZXIsIG1pZ2h0IGJlIG5pY2UgdG8gcmV0dXJuXG5cdC8vIHRoZSB0cmFuc2Zvcm1lZCBjb3JuZXIgcG9pbnRzIGFuZCBwb3NzaWJseSB0aGUgZmluYWwgYW5nbGUgb2Ygcm90YXRpb24uXG5cdHAueCAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieFwiKSk7XG5cdHAueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieVwiKSk7XG5cdHAyLnggPSBwLnggKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwid2lkdGhcIikpO1xuXHRwMi55ID0gcC55ICsgcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImhlaWdodFwiKSk7XG5cdC8vXG5cdHAgID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0cDIgPSBwMi5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0Ly9cbiAgICAgICAgcmV0dXJuIHsgeDogcC54LCB5OiBwLnksIHdpZHRoOiBwMi54LXAueCwgaGVpZ2h0OiBwMi55LXAueSB9O1xuICAgIC8vXG4gICAgY2FzZSAncG9seWdvbic6XG4gICAgICAgIGxldCBwdHMgPSBkc2hhcGUuYXR0cihcInBvaW50c1wiKS50cmltKCkuc3BsaXQoLyArLyk7XG5cdHJldHVybiBwdHMubWFwKCBwdCA9PiB7XG5cdCAgICBsZXQgeHkgPSBwdC5zcGxpdChcIixcIik7XG5cdCAgICBwLnggPSBwYXJzZUZsb2F0KHh5WzBdKVxuXHQgICAgcC55ID0gcGFyc2VGbG9hdCh4eVsxXSlcblx0ICAgIHAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHQgICAgcmV0dXJuIHsgeDogcC54LCB5OiBwLnkgfTtcblx0fSk7XG4gICAgLy9cbiAgICBjYXNlICdsaW5lJzpcblx0cC54ICAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieDFcIikpO1xuXHRwLnkgICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ5MVwiKSk7XG5cdHAyLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcIngyXCIpKTtcblx0cDIueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieTJcIikpO1xuXHRwICAgICA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdHAyICAgID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG4gICAgICAgIHJldHVybiB7IHgxOiBwLngsIHkxOiBwLnksIHgyOiBwMi54LCB4MjogcDIueSB9O1xuICAgIC8vXG4gICAgLy8gRklYTUU6IGFkZCBjYXNlICd0ZXh0J1xuICAgIC8vXG5cbiAgICBkZWZhdWx0OlxuXHR0aHJvdyBcIlVuc3VwcG9ydGVkIG5vZGUgdHlwZTogXCIgKyBzdHlwZTtcbiAgICB9XG5cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZW1vdmVzIGR1cGxpY2F0ZXMgZnJvbSBhIGxpc3Qgd2hpbGUgcHJlc2VydmluZyBsaXN0IG9yZGVyLlxuLy8gQXJnczpcbi8vICAgICBsc3QgKGxpc3QpXG4vLyBSZXR1cm5zOlxuLy8gICAgIEEgcHJvY2Vzc2VkIGNvcHkgb2YgbHN0IGluIHdoaWNoIGFueSBkdXBzIGhhdmUgYmVlbiByZW1vdmVkLlxuZnVuY3Rpb24gcmVtb3ZlRHVwcyAobHN0KSB7XG4gICAgbGV0IGxzdDIgPSBbXTtcbiAgICBsZXQgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICBsc3QuZm9yRWFjaCh4ID0+IHtcblx0Ly8gcmVtb3ZlIGR1cHMgd2hpbGUgcHJlc2VydmluZyBvcmRlclxuXHRpZiAoc2Vlbi5oYXMoeCkpIHJldHVybjtcblx0bHN0Mi5wdXNoKHgpO1xuXHRzZWVuLmFkZCh4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gbHN0Mjtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB7XG4gICAgaW5pdE9wdExpc3QsXG4gICAgZDN0c3YsXG4gICAgZDNqc29uLFxuICAgIGRlZXBjLFxuICAgIHBhcnNlQ29vcmRzLFxuICAgIGZvcm1hdENvb3JkcyxcbiAgICBvdmVybGFwcyxcbiAgICBzdWJ0cmFjdCxcbiAgICBvYmoybGlzdCxcbiAgICBzYW1lLFxuICAgIGdldENhcmV0UmFuZ2UsXG4gICAgc2V0Q2FyZXRSYW5nZSxcbiAgICBzZXRDYXJldFBvc2l0aW9uLFxuICAgIG1vdmVDYXJldFBvc2l0aW9uLFxuICAgIGdldENhcmV0UG9zaXRpb24sXG4gICAgY29vcmRzQWZ0ZXJUcmFuc2Zvcm0sXG4gICAgcmVtb3ZlRHVwc1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgQ29tcG9uZW50IHtcbiAgICAvLyBhcHAgLSB0aGUgb3duaW5nIGFwcCBvYmplY3RcbiAgICAvLyBlbHQgbWF5IGJlIGEgc3RyaW5nIChzZWxlY3RvciksIGEgRE9NIG5vZGUsIG9yIGEgZDMgc2VsZWN0aW9uIG9mIDEgbm9kZS5cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcblx0dGhpcy5hcHAgPSBhcHBcblx0aWYgKHR5cGVvZihlbHQpID09PSBcInN0cmluZ1wiKVxuXHQgICAgLy8gZWx0IGlzIGEgQ1NTIHNlbGVjdG9yXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5zZWxlY3RBbGwpID09PSBcImZ1bmN0aW9uXCIpXG5cdCAgICAvLyBlbHQgaXMgYSBkMyBzZWxlY3Rpb25cblx0ICAgIHRoaXMucm9vdCA9IGVsdDtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSkgPT09IFwiZnVuY3Rpb25cIilcblx0ICAgIC8vIGVsdCBpcyBhIERPTSBub2RlXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRlIG1lXG4gICAgfVxufVxuXG5leHBvcnQgeyBDb21wb25lbnQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0NvbXBvbmVudC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBGZWF0dXJlIHtcbiAgICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG4gICAgICAgIHRoaXMuY2hyICAgICA9IGNmZy5jaHIgfHwgY2ZnLmNocm9tb3NvbWU7XG4gICAgICAgIHRoaXMuc3RhcnQgICA9IGNmZy5zdGFydDtcbiAgICAgICAgdGhpcy5lbmQgICAgID0gY2ZnLmVuZDtcbiAgICAgICAgdGhpcy5zdHJhbmQgID0gY2ZnLnN0cmFuZDtcbiAgICAgICAgdGhpcy50eXBlICAgID0gY2ZnLnR5cGU7XG4gICAgICAgIHRoaXMuYmlvdHlwZSA9IGNmZy5iaW90eXBlO1xuICAgICAgICB0aGlzLm1ncGlkICAgPSBjZmcubWdwaWQgfHwgY2ZnLmlkO1xuICAgICAgICB0aGlzLm1naWlkICAgPSBjZmcubWdpaWQ7XG4gICAgICAgIHRoaXMuc3ltYm9sICA9IGNmZy5zeW1ib2w7XG4gICAgICAgIHRoaXMuZ2Vub21lICA9IGNmZy5nZW5vbWU7XG5cdHRoaXMuY29udGlnICA9IHBhcnNlSW50KGNmZy5jb250aWcpO1xuXHR0aGlzLmxhbmUgICAgPSBwYXJzZUludChjZmcubGFuZSk7XG4gICAgICAgIGlmICh0aGlzLm1naWlkID09PSBcIi5cIikgdGhpcy5tZ2lpZCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLnN5bWJvbCA9PT0gXCIuXCIpIHRoaXMuc3ltYm9sID0gbnVsbDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGlkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdpaWQgfHwgdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGxhYmVsICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sIHx8IHRoaXMubWdwaWQ7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldE11bmdlZFR5cGUgKCkge1xuXHRyZXR1cm4gdGhpcy50eXBlID09PSBcImdlbmVcIiA/XG5cdCAgICAodGhpcy5iaW90eXBlID09PSBcInByb3RlaW5fY29kaW5nXCIgfHwgdGhpcy5iaW90eXBlID09PSBcInByb3RlaW4gY29kaW5nIGdlbmVcIikgP1xuXHRcdFwicHJvdGVpbl9jb2RpbmdfZ2VuZVwiXG5cdFx0OlxuXHRcdHRoaXMuYmlvdHlwZS5pbmRleE9mKFwicHNldWRvZ2VuZVwiKSA+PSAwID9cblx0XHQgICAgXCJwc2V1ZG9nZW5lXCJcblx0XHQgICAgOlxuXHRcdCAgICAodGhpcy5iaW90eXBlLmluZGV4T2YoXCJSTkFcIikgPj0gMCB8fCB0aGlzLmJpb3R5cGUuaW5kZXhPZihcImFudGlzZW5zZVwiKSA+PSAwKSA/XG5cdFx0XHRcIm5jUk5BX2dlbmVcIlxuXHRcdFx0OlxuXHRcdFx0dGhpcy5iaW90eXBlLmluZGV4T2YoXCJzZWdtZW50XCIpID49IDAgP1xuXHRcdFx0ICAgIFwiZ2VuZV9zZWdtZW50XCJcblx0XHRcdCAgICA6XG5cdFx0XHQgICAgXCJvdGhlcl9nZW5lXCJcblx0ICAgIDpcblx0ICAgIHRoaXMudHlwZSA9PT0gXCJwc2V1ZG9nZW5lXCIgP1xuXHRcdFwicHNldWRvZ2VuZVwiXG5cdFx0OlxuXHRcdHRoaXMudHlwZS5pbmRleE9mKFwiZ2VuZV9zZWdtZW50XCIpID49IDAgP1xuXHRcdCAgICBcImdlbmVfc2VnbWVudFwiXG5cdFx0ICAgIDpcblx0XHQgICAgdGhpcy50eXBlLmluZGV4T2YoXCJSTkFcIikgPj0gMCA/XG5cdFx0XHRcIm5jUk5BX2dlbmVcIlxuXHRcdFx0OlxuXHRcdFx0dGhpcy50eXBlLmluZGV4T2YoXCJnZW5lXCIpID49IDAgP1xuXHRcdFx0ICAgIFwib3RoZXJfZ2VuZVwiXG5cdFx0XHQgICAgOlxuXHRcdFx0ICAgIFwib3RoZXJfZmVhdHVyZV90eXBlXCI7XG4gICAgfVxufVxuXG5leHBvcnQgeyBGZWF0dXJlIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IFBSRUZJWD1cImFwcHMubWd2LlwiO1xuIFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbnRlcmFjdHMgd2l0aCBsb2NhbFN0b3JhZ2UuXG4vL1xuY2xhc3MgU3RvcmFnZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lLCBzdG9yYWdlKSB7XG5cdHRoaXMubmFtZSA9IFBSRUZJWCtuYW1lO1xuXHR0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuXHR0aGlzLm15RGF0YU9iaiA9IG51bGw7XG5cdC8vXG5cdHRoaXMuX2xvYWQoKTtcbiAgICB9XG4gICAgX2xvYWQgKCkge1xuXHQvLyBsb2FkcyBteURhdGFPYmogZnJvbSBzdG9yYWdlXG4gICAgICAgIGxldCBzID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lKTtcblx0dGhpcy5teURhdGFPYmogPSBzID8gSlNPTi5wYXJzZShzKSA6IHt9O1xuICAgIH1cbiAgICBfc2F2ZSAoKSB7XG5cdC8vIHdyaXRlcyBteURhdGFPYmogdG8gc3RvcmFnZVxuICAgICAgICBsZXQgcyA9IEpTT04uc3RyaW5naWZ5KHRoaXMubXlEYXRhT2JqKTtcblx0dGhpcy5zdG9yYWdlLnNldEl0ZW0odGhpcy5uYW1lLCBzKVxuICAgIH1cbiAgICBnZXQgKG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXlEYXRhT2JqW25dO1xuICAgIH1cbiAgICBwdXQgKG4sIHYpIHtcbiAgICAgICAgdGhpcy5teURhdGFPYmpbbl0gPSB2O1xuXHR0aGlzLl9zYXZlKCk7XG4gICAgfVxufVxuLy9cbmNsYXNzIFNlc3Npb25TdG9yYWdlTWFuYWdlciBleHRlbmRzIFN0b3JhZ2VNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSkge1xuICAgICAgICBzdXBlcihuYW1lLCB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UpO1xuICAgIH1cbn1cbi8vXG5jbGFzcyBMb2NhbFN0b3JhZ2VNYW5hZ2VyIGV4dGVuZHMgU3RvcmFnZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lKSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIHdpbmRvdy5sb2NhbFN0b3JhZ2UpO1xuICAgIH1cbn1cbi8vXG5leHBvcnQgeyBTZXNzaW9uU3RvcmFnZU1hbmFnZXIsIExvY2FsU3RvcmFnZU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1N0b3JhZ2VNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUGFyc2VzIGEgbGlzdCBvcGVyYXRvciBleHByZXNzaW9uLCBlZyBcIihhICsgYikqYyAtIGRcIlxuLy8gUmV0dXJucyBhbiBhYnN0cmFjdCBzeW50YXggdHJlZS5cbi8vICAgICBMZWFmIG5vZGVzID0gbGlzdCBuYW1lcy4gVGhleSBhcmUgc2ltcGxlIHN0cmluZ3MuXG4vLyAgICAgSW50ZXJpb3Igbm9kZXMgPSBvcGVyYXRpb25zLiBUaGV5IGxvb2sgbGlrZToge2xlZnQ6bm9kZSwgb3A6c3RyaW5nLCByaWdodDpub2RlfVxuLy8gXG5jbGFzcyBMaXN0Rm9ybXVsYVBhcnNlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuXHR0aGlzLnJfb3AgICAgPSAvWystXS87XG5cdHRoaXMucl9vcDIgICA9IC9bKl0vO1xuXHR0aGlzLnJfb3BzICAgPSAvWygpKyotXS87XG5cdHRoaXMucl9pZGVudCA9IC9bYS16QS1aX11bYS16QS1aMC05X10qLztcblx0dGhpcy5yX3FzdHIgID0gL1wiW15cIl0qXCIvO1xuXHR0aGlzLnJlID0gbmV3IFJlZ0V4cChgKCR7dGhpcy5yX29wcy5zb3VyY2V9fCR7dGhpcy5yX3FzdHIuc291cmNlfXwke3RoaXMucl9pZGVudC5zb3VyY2V9KWAsICdnJyk7XG5cdC8vdGhpcy5yZSA9IC8oWygpKyotXXxcIlteXCJdK1wifFthLXpBLVpfXVthLXpBLVowLTlfXSopL2dcblx0dGhpcy5faW5pdChcIlwiKTtcbiAgICB9XG4gICAgX2luaXQgKHMpIHtcbiAgICAgICAgdGhpcy5leHByID0gcztcblx0dGhpcy50b2tlbnMgPSB0aGlzLmV4cHIubWF0Y2godGhpcy5yZSkgfHwgW107XG5cdHRoaXMuaSA9IDA7XG4gICAgfVxuICAgIF9wZWVrVG9rZW4oKSB7XG5cdHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmldO1xuICAgIH1cbiAgICBfbmV4dFRva2VuICgpIHtcblx0bGV0IHQ7XG4gICAgICAgIGlmICh0aGlzLmkgPCB0aGlzLnRva2Vucy5sZW5ndGgpIHtcblx0ICAgIHQgPSB0aGlzLnRva2Vuc1t0aGlzLmldO1xuXHQgICAgdGhpcy5pICs9IDE7XG5cdH1cblx0cmV0dXJuIHQ7XG4gICAgfVxuICAgIF9leHByICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl90ZXJtKCk7XG5cdGxldCBvcCA9IHRoaXMuX3BlZWtUb2tlbigpO1xuXHRpZiAob3AgPT09IFwiK1wiIHx8IG9wID09PSBcIi1cIikge1xuXHQgICAgdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBub2RlID0geyBsZWZ0Om5vZGUsIG9wOm9wPT09XCIrXCI/XCJ1bmlvblwiOlwiZGlmZmVyZW5jZVwiLCByaWdodDogdGhpcy5fZXhwcigpIH1cblx0ICAgIHJldHVybiBub2RlO1xuICAgICAgICB9ICAgICAgICAgICAgICAgXG5cdGVsc2UgaWYgKG9wID09PSBcIilcIiB8fCBvcCA9PT0gdW5kZWZpbmVkIHx8IG9wID09PSBudWxsKVxuXHQgICAgcmV0dXJuIG5vZGU7XG5cdGVsc2Vcblx0ICAgIHRoaXMuX2Vycm9yKFwiVU5JT04gb3IgSU5URVJTRUNUSU9OIG9yICkgb3IgTlVMTFwiLCBvcCk7XG4gICAgfVxuICAgIF90ZXJtICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl9mYWN0b3IoKTtcblx0bGV0IG9wID0gdGhpcy5fcGVla1Rva2VuKCk7XG5cdGlmIChvcCA9PT0gXCIqXCIpIHtcblx0ICAgIHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgbm9kZSA9IHsgbGVmdDpub2RlLCBvcDpcImludGVyc2VjdGlvblwiLCByaWdodDogdGhpcy5fZmFjdG9yKCkgfVxuXHR9XG5cdHJldHVybiBub2RlO1xuICAgIH1cbiAgICBfZmFjdG9yICgpIHtcbiAgICAgICAgbGV0IHQgPSB0aGlzLl9uZXh0VG9rZW4oKTtcblx0aWYgKHQgPT09IFwiKFwiKXtcblx0ICAgIGxldCBub2RlID0gdGhpcy5fZXhwcigpO1xuXHQgICAgbGV0IG50ID0gdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBpZiAobnQgIT09IFwiKVwiKSB0aGlzLl9lcnJvcihcIicpJ1wiLCBudCk7XG5cdCAgICByZXR1cm4gbm9kZTtcblx0fVxuXHRlbHNlIGlmICh0ICYmICh0LnN0YXJ0c1dpdGgoJ1wiJykpKSB7XG5cdCAgICByZXR1cm4gdC5zdWJzdHJpbmcoMSwgdC5sZW5ndGgtMSk7XG5cdH1cblx0ZWxzZSBpZiAodCAmJiB0Lm1hdGNoKC9bYS16QS1aX10vKSkge1xuXHQgICAgcmV0dXJuIHQ7XG5cdH1cblx0ZWxzZVxuXHQgICAgdGhpcy5fZXJyb3IoXCJFWFBSIG9yIElERU5UXCIsIHR8fFwiTlVMTFwiKTtcblx0cmV0dXJuIHQ7XG5cdCAgICBcbiAgICB9XG4gICAgX2Vycm9yIChleHBlY3RlZCwgc2F3KSB7XG4gICAgICAgIHRocm93IGBQYXJzZSBlcnJvcjogZXhwZWN0ZWQgJHtleHBlY3RlZH0gYnV0IHNhdyAke3Nhd30uYDtcbiAgICB9XG4gICAgLy8gUGFyc2VzIHRoZSBzdHJpbmcgYW5kIHJldHVybnMgdGhlIGFic3RyYWN0IHN5bnRheCB0cmVlLlxuICAgIC8vIFRocm93cyBhbiBleGNlcHRpb24gaWYgdGhlcmUgaXMgYSBzeW50YXggZXJyb3IuXG4gICAgcGFyc2UgKHMpIHtcblx0dGhpcy5faW5pdChzKTtcblx0cmV0dXJuIHRoaXMuX2V4cHIoKTtcbiAgICB9XG4gICAgLy8gcmV0dXJucyB0cnVlIGlmZiBzdHJpbmcgaXMgc3ludGFjdGljYWxseSB2YWxpZFxuICAgIGlzVmFsaWQgKHMpIHtcbiAgICAgICAgdHJ5IHtcblx0ICAgIHRoaXMucGFyc2Uocyk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fVxuXHRjYXRjaCAoZSkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEZvcm11bGFQYXJzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIFNWR1ZpZXcgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCwgbWFyZ2lucywgcm90YXRpb24sIHRyYW5zbGF0aW9uKSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0KTtcbiAgICAgICAgdGhpcy5zdmcgPSB0aGlzLnJvb3Quc2VsZWN0KFwic3ZnXCIpO1xuICAgICAgICB0aGlzLnN2Z01haW4gPSB0aGlzLnN2Z1xuICAgICAgICAgICAgLmFwcGVuZChcImdcIikgICAgLy8gdGhlIG1hcmdpbi10cmFuc2xhdGVkIGdyb3VwXG4gICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVx0ICAvLyBtYWluIGdyb3VwIGZvciB0aGUgZHJhd2luZ1xuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJzdmdtYWluXCIpO1xuXHR0aGlzLm91dGVyV2lkdGggPSAxMDA7XG5cdHRoaXMud2lkdGggPSAxMDA7XG5cdHRoaXMub3V0ZXJIZWlnaHQgPSAxMDA7XG5cdHRoaXMuaGVpZ2h0ID0gMTAwO1xuXHR0aGlzLm1hcmdpbnMgPSB7dG9wOiAxOCwgcmlnaHQ6IDEyLCBib3R0b206IDEyLCBsZWZ0OiAxMn07XG5cdHRoaXMucm90YXRpb24gPSAwO1xuXHR0aGlzLnRyYW5zbGF0aW9uID0gWzAsMF07XG5cdC8vXG4gICAgICAgIHRoaXMuc2V0R2VvbSh7d2lkdGgsIGhlaWdodCwgbWFyZ2lucywgcm90YXRpb24sIHRyYW5zbGF0aW9ufSk7XG4gICAgfVxuICAgIHNldEdlb20gKGNmZykge1xuICAgICAgICB0aGlzLm91dGVyV2lkdGggID0gY2ZnLndpZHRoICAgICAgIHx8IHRoaXMub3V0ZXJXaWR0aDtcbiAgICAgICAgdGhpcy5vdXRlckhlaWdodCA9IGNmZy5oZWlnaHQgICAgICB8fCB0aGlzLm91dGVySGVpZ2h0O1xuICAgICAgICB0aGlzLm1hcmdpbnMgICAgID0gY2ZnLm1hcmdpbnMgICAgIHx8IHRoaXMubWFyZ2lucztcblx0dGhpcy5yb3RhdGlvbiAgICA9IHR5cGVvZihjZmcucm90YXRpb24pID09PSBcIm51bWJlclwiID8gY2ZnLnJvdGF0aW9uIDogdGhpcy5yb3RhdGlvbjtcblx0dGhpcy50cmFuc2xhdGlvbiA9IGNmZy50cmFuc2xhdGlvbiB8fCB0aGlzLnRyYW5zbGF0aW9uO1xuICAgICAgICAvL1xuICAgICAgICB0aGlzLndpZHRoICA9IHRoaXMub3V0ZXJXaWR0aCAgLSB0aGlzLm1hcmdpbnMubGVmdCAtIHRoaXMubWFyZ2lucy5yaWdodDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLm91dGVySGVpZ2h0IC0gdGhpcy5tYXJnaW5zLnRvcCAgLSB0aGlzLm1hcmdpbnMuYm90dG9tO1xuICAgICAgICAvL1xuICAgICAgICB0aGlzLnN2Zy5hdHRyKFwid2lkdGhcIiwgdGhpcy5vdXRlcldpZHRoKVxuICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLm91dGVySGVpZ2h0KVxuICAgICAgICAgICAgLnNlbGVjdCgnZ1tuYW1lPVwic3ZnbWFpblwiXScpXG4gICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHt0aGlzLm1hcmdpbnMubGVmdH0sJHt0aGlzLm1hcmdpbnMudG9wfSkgcm90YXRlKCR7dGhpcy5yb3RhdGlvbn0pIHRyYW5zbGF0ZSgke3RoaXMudHJhbnNsYXRpb25bMF19LCR7dGhpcy50cmFuc2xhdGlvblsxXX0pYCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzZXRNYXJnaW5zKCB0bSwgcm0sIGJtLCBsbSApIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0ICAgIHJtID0gYm0gPSBsbSA9IHRtO1xuXHR9XG5cdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcblx0ICAgIGJtID0gdG07XG5cdCAgICBsbSA9IHJtO1xuXHR9XG5cdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDQpXG5cdCAgICB0aHJvdyBcIkJhZCBhcmd1bWVudHMuXCI7XG4gICAgICAgIC8vXG5cdHRoaXMuc2V0R2VvbSh7dG9wOiB0bSwgcmlnaHQ6IHJtLCBib3R0b206IGJtLCBsZWZ0OiBsbX0pO1xuXHQvL1xuXHRyZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcm90YXRlIChkZWcpIHtcbiAgICAgICAgdGhpcy5zZXRHZW9tKHtyb3RhdGlvbjpkZWd9KTtcblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRyYW5zbGF0ZSAoZHgsIGR5KSB7XG4gICAgICAgIHRoaXMuc2V0R2VvbSh7dHJhbnNsYXRpb246W2R4LGR5XX0pO1xuXHRyZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy8gQXJnczpcbiAgICAvLyAgIHRoZSB3aW5kb3cgd2lkdGhcbiAgICBmaXRUb1dpZHRoICh3aWR0aCkge1xuICAgICAgICBsZXQgciA9IHRoaXMuc3ZnWzBdWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLnNldEdlb20oe3dpZHRoOiB3aWR0aCAtIHIueH0pXG5cdHJldHVybiB0aGlzO1xuICAgIH1cblxufSAvLyBlbmQgY2xhc3MgU1ZHVmlld1xuXG5leHBvcnQgeyBTVkdWaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9TVkdWaWV3LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IE1HVkFwcCB9IGZyb20gJy4vTUdWQXBwJztcbmltcG9ydCB7IHJlbW92ZUR1cHMgfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vXG4vLyBwcXN0cmluZyA9IFBhcnNlIHFzdHJpbmcuIFBhcnNlcyB0aGUgcGFyYW1ldGVyIHBvcnRpb24gb2YgdGhlIFVSTC5cbi8vXG5mdW5jdGlvbiBwcXN0cmluZyAocXN0cmluZykge1xuICAgIC8vXG4gICAgbGV0IGNmZyA9IHt9O1xuXG4gICAgLy8gRklYTUU6IFVSTFNlYXJjaFBhcmFtcyBBUEkgaXMgbm90IHN1cHBvcnRlZCBpbiBhbGwgYnJvd3NlcnMuXG4gICAgLy8gT0sgZm9yIGRldmVsb3BtZW50IGJ1dCBuZWVkIGEgZmFsbGJhY2sgZXZlbnR1YWxseS5cbiAgICBsZXQgcHJtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocXN0cmluZyk7XG4gICAgbGV0IGdlbm9tZXMgPSBbXTtcblxuICAgIC8vIC0tLS0tIGdlbm9tZXMgLS0tLS0tLS0tLS0tXG4gICAgbGV0IHBnZW5vbWVzID0gcHJtcy5nZXQoXCJnZW5vbWVzXCIpIHx8IFwiXCI7XG4gICAgLy8gRm9yIG5vdywgYWxsb3cgXCJjb21wc1wiIGFzIHN5bm9ueW0gZm9yIFwiZ2Vub21lc1wiLiBFdmVudHVhbGx5LCBkb24ndCBzdXBwb3J0IFwiY29tcHNcIi5cbiAgICBwZ2Vub21lcyA9IChwZ2Vub21lcyArICBcIiBcIiArIChwcm1zLmdldChcImNvbXBzXCIpIHx8IFwiXCIpKTtcbiAgICAvL1xuICAgIHBnZW5vbWVzID0gcmVtb3ZlRHVwcyhwZ2Vub21lcy50cmltKCkuc3BsaXQoLyArLykpO1xuICAgIHBnZW5vbWVzLmxlbmd0aCA+IDAgJiYgKGNmZy5nZW5vbWVzID0gcGdlbm9tZXMpO1xuXG4gICAgLy8gLS0tLS0gcmVmIGdlbm9tZSAtLS0tLS0tLS0tLS1cbiAgICBsZXQgcmVmID0gcHJtcy5nZXQoXCJyZWZcIik7XG4gICAgcmVmICYmIChjZmcucmVmID0gcmVmKTtcblxuICAgIC8vIC0tLS0tIGhpZ2hsaWdodCBJRHMgLS0tLS0tLS0tLS0tLS1cbiAgICBsZXQgaGxzID0gbmV3IFNldCgpO1xuICAgIGxldCBobHMwID0gcHJtcy5nZXQoXCJoaWdobGlnaHRcIik7XG4gICAgaWYgKGhsczApIHtcblx0aGxzMCA9IGhsczAucmVwbGFjZSgvWyAsXSsvZywgJyAnKS5zcGxpdCgnICcpLmZpbHRlcih4PT54KTtcblx0aGxzMC5sZW5ndGggPiAwICYmIChjZmcuaGlnaGxpZ2h0ID0gaGxzMCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0gY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIGxldCBjaHIgICA9IHBybXMuZ2V0KFwiY2hyXCIpO1xuICAgIGxldCBzdGFydCA9IHBybXMuZ2V0KFwic3RhcnRcIik7XG4gICAgbGV0IGVuZCAgID0gcHJtcy5nZXQoXCJlbmRcIik7XG4gICAgY2hyICAgJiYgKGNmZy5jaHIgPSBjaHIpO1xuICAgIHN0YXJ0ICYmIChjZmcuc3RhcnQgPSBwYXJzZUludChzdGFydCkpO1xuICAgIGVuZCAgICYmIChjZmcuZW5kID0gcGFyc2VJbnQoZW5kKSk7XG4gICAgLy9cbiAgICAvLyAtLS0tLSBkcmF3aW5nIG1vZGUgLS0tLS0tLS0tLS0tLVxuICAgIGxldCBkbW9kZSA9IHBybXMuZ2V0KFwiZG1vZGVcIik7XG4gICAgZG1vZGUgJiYgKGNmZy5kbW9kZSA9IGRtb2RlKTtcbiAgICAvL1xuICAgIHJldHVybiBjZmc7XG59XG5cblxuLy8gVGhlIG1haW4gcHJvZ3JhbSwgd2hlcmVpbiB0aGUgYXBwIGlzIGNyZWF0ZWQgYW5kIHdpcmVkIHRvIHRoZSBicm93c2VyLiBcbi8vXG5mdW5jdGlvbiBfX21haW5fXyAoc2VsZWN0b3IpIHtcbiAgICAvLyBCZWhvbGQsIHRoZSBNR1YgYXBwbGljYXRpb24gb2JqZWN0Li4uXG4gICAgbGV0IG1ndiA9IG51bGw7XG5cbiAgICAvLyBDYWxsYmFjayB0byBwYXNzIGludG8gdGhlIGFwcCB0byByZWdpc3RlciBjaGFuZ2VzIGluIGNvbnRleHQuXG4gICAgLy8gVXNlcyB0aGUgY3VycmVudCBhcHAgY29udGV4dCB0byBzZXQgdGhlIGhhc2ggcGFydCBvZiB0aGVcbiAgICAvLyBicm93c2VyJ3MgbG9jYXRpb24uIFRoaXMgYWxzbyByZWdpc3RlcnMgdGhlIGNoYW5nZSBpbiBcbiAgICAvLyB0aGUgYnJvd3NlciBoaXN0b3J5LlxuICAgIGZ1bmN0aW9uIHNldEhhc2ggKCkge1xuXHRsZXQgbmV3SGFzaCA9IG1ndi5nZXRQYXJhbVN0cmluZygpO1xuXHRpZiAoJyMnK25ld0hhc2ggPT09IHdpbmRvdy5sb2NhdGlvbi5oYXNoKSByZXR1cm47XG5cdC8vIGRvbid0IHdhbnQgdG8gdHJpZ2dlciBhbiBpbmZpbml0ZSBsb29wIGhlcmUhXG5cdC8vIHRlbXBvcmFyaWx5IGRpc2FibGUgcG9wc3RhdGUgaGFuZGxlclxuXHRsZXQgZiA9IHdpbmRvdy5vbnBvcHN0YXRlO1xuXHR3aW5kb3cub25wb3BzdGF0ZSA9IG51bGw7XG5cdC8vIG5vdyBzZXQgdGhlIGhhc2hcblx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSBuZXdIYXNoO1xuXHQvLyByZS1lbmFibGVcblx0d2luZG93Lm9ucG9wc3RhdGUgPSBmO1xuICAgIH1cbiAgICAvLyBIYW5kbGVyIGNhbGxlZCB3aGVuIHVzZXIgY2xpY2tzIHRoZSBicm93c2VyJ3MgYmFjayBvciBmb3J3YXJkIGJ1dHRvbnMuXG4gICAgLy8gU2V0cyB0aGUgYXBwJ3MgY29udGV4dCBiYXNlZCBvbiB0aGUgaGFzaCBwYXJ0IG9mIHRoZSBicm93c2VyJ3NcbiAgICAvLyBsb2NhdGlvbi5cbiAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdGxldCBjZmcgPSBwcXN0cmluZyhkb2N1bWVudC5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG5cdG1ndi5zZXRDb250ZXh0KGNmZyk7XG4gICAgfTtcbiAgICAvLyBnZXQgaW5pdGlhbCBzZXQgb2YgY29udGV4dCBwYXJhbXMgXG4gICAgbGV0IHFzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSk7XG4gICAgbGV0IGNmZyA9IHBxc3RyaW5nKHFzdHJpbmcpO1xuICAgIGNmZy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNmZy5vbmNvbnRleHRjaGFuZ2UgPSBzZXRIYXNoO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBhcHBcbiAgICB3aW5kb3cubWd2ID0gbWd2ID0gbmV3IE1HVkFwcChzZWxlY3RvciwgY2ZnKTtcbiAgICBcbiAgICAvLyBoYW5kbGUgcmVzaXplIGV2ZW50c1xuICAgIHdpbmRvdy5vbnJlc2l6ZSA9ICgpID0+IHttZ3YucmVzaXplKCk7bWd2LnNldENvbnRleHQoe30pO31cbn1cblxuXG5fX21haW5fXyhcIiNtZ3ZcIik7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy92aWV3ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgcGFyc2VDb29yZHMsIGZvcm1hdENvb3JkcywgZDN0c3YsIGluaXRPcHRMaXN0LCBzYW1lIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBHZW5vbWUgfSAgICAgICAgICBmcm9tICcuL0dlbm9tZSc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSAgICAgICBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBGZWF0dXJlTWFuYWdlciB9ICBmcm9tICcuL0ZlYXR1cmVNYW5hZ2VyJztcbmltcG9ydCB7IFF1ZXJ5TWFuYWdlciB9ICAgIGZyb20gJy4vUXVlcnlNYW5hZ2VyJztcbmltcG9ydCB7IExpc3RNYW5hZ2VyIH0gICAgIGZyb20gJy4vTGlzdE1hbmFnZXInO1xuaW1wb3J0IHsgTGlzdEVkaXRvciB9ICAgICAgZnJvbSAnLi9MaXN0RWRpdG9yJztcbmltcG9ydCB7IFVzZXJQcmVmc01hbmFnZXIgfSBmcm9tICcuL1VzZXJQcmVmc01hbmFnZXInO1xuaW1wb3J0IHsgRmFjZXRNYW5hZ2VyIH0gICAgZnJvbSAnLi9GYWNldE1hbmFnZXInO1xuaW1wb3J0IHsgQlRNYW5hZ2VyIH0gICAgICAgZnJvbSAnLi9CVE1hbmFnZXInO1xuaW1wb3J0IHsgR2Vub21lVmlldyB9ICAgICAgZnJvbSAnLi9HZW5vbWVWaWV3JztcbmltcG9ydCB7IEZlYXR1cmVEZXRhaWxzIH0gIGZyb20gJy4vRmVhdHVyZURldGFpbHMnO1xuaW1wb3J0IHsgWm9vbVZpZXcgfSAgICAgICAgZnJvbSAnLi9ab29tVmlldyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgTUdWQXBwIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoc2VsZWN0b3IsIGNmZykge1xuXHRzdXBlcihudWxsLCBzZWxlY3Rvcik7XG5cdHRoaXMuYXBwID0gdGhpcztcblx0Ly9cblx0dGhpcy5pbml0aWFsQ2ZnID0gY2ZnO1xuXHQvL1xuXHR0aGlzLmNvbnRleHRDaGFuZ2VkID0gKGNmZy5vbmNvbnRleHRjaGFuZ2UgfHwgZnVuY3Rpb24oKXt9KTtcblx0Ly9cblx0dGhpcy5uYW1lMmdlbm9tZSA9IHt9OyAgLy8gbWFwIGZyb20gZ2Vub21lIG5hbWUgLT4gZ2Vub21lIGRhdGEgb2JqXG5cdHRoaXMubGFiZWwyZ2Vub21lID0ge307IC8vIG1hcCBmcm9tIGdlbm9tZSBsYWJlbCAtPiBnZW5vbWUgZGF0YSBvYmpcblx0dGhpcy5ubDJnZW5vbWUgPSB7fTsgICAgLy8gY29tYmluZXMgaW5kZXhlc1xuXHQvL1xuXHR0aGlzLmFsbEdlbm9tZXMgPSBbXTsgICAvLyBsaXN0IG9mIGFsbCBhdmFpbGFibGUgZ2Vub21lc1xuXHR0aGlzLnJHZW5vbWUgPSBudWxsOyAgICAvLyB0aGUgY3VycmVudCByZWZlcmVuY2UgZ2Vub21lXG5cdHRoaXMuY0dlbm9tZXMgPSBbXTsgICAgIC8vIGN1cnJlbnQgY29tcGFyaXNvbiBnZW5vbWVzIChyR2Vub21lIGlzICpub3QqIGluY2x1ZGVkKS5cblx0dGhpcy52R2Vub21lcyA9IFtdO1x0Ly8gbGlzdCBvZiBhbGwgY3VycmVudHkgdmlld2VkIGdlbm9tZXMgKHJlZitjb21wcykgaW4gWS1vcmRlci5cblx0Ly9cblx0dGhpcy5kdXIgPSAyNTA7ICAgICAgICAgLy8gYW5pbWF0aW9uIGR1cmF0aW9uLCBpbiBtc1xuXHR0aGlzLmRlZmF1bHRab29tID0gMjtcdC8vIG11bHRpcGxpZXIgb2YgY3VycmVudCByYW5nZSB3aWR0aC4gTXVzdCBiZSA+PSAxLiAxID09IG5vIHpvb20uXG5cdFx0XHRcdC8vICh6b29taW5nIGluIHVzZXMgMS90aGlzIGFtb3VudClcblx0dGhpcy5kZWZhdWx0UGFuICA9IDAuMTU7Ly8gZnJhY3Rpb24gb2YgY3VycmVudCByYW5nZSB3aWR0aFxuXHR0aGlzLmNvb3JkcyA9IHsgY2hyOiBcIjFcIiwgc3RhcnQ6IDEwMDAwMDAsIGVuZDogMTAwMDAwMDAgfTtcblx0Ly9cblx0Ly8gVE9ETzogcmVmYWN0b3IgcGFnZWJveCwgZHJhZ2dhYmxlLCBhbmQgZnJpZW5kcyBpbnRvIGEgZnJhbWV3b3JrIG1vZHVsZSxcblx0Ly8gXG5cdHRoaXMucGJEcmFnZ2VyID0gdGhpcy5nZXRDb250ZW50RHJhZ2dlcigpO1xuXHRkMy5zZWxlY3RBbGwoXCIucGFnZWJveFwiKVxuXHQgICAgLmNhbGwodGhpcy5wYkRyYWdnZXIpXG5cdCAgICAuYXBwZW5kKFwiaVwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwibWF0ZXJpYWwtaWNvbnMgYnVzeSByb3RhdGluZ1wiKVxuXHQgICAgO1xuXHRkMy5zZWxlY3RBbGwoXCIuY2xvc2FibGVcIilcblx0ICAgIC5hcHBlbmQoXCJpXCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29ucyBidXR0b24gY2xvc2VcIilcblx0ICAgIC5vbihcImNsaWNrLmRlZmF1bHRcIiwgZnVuY3Rpb24gKCkge1xuXHRcdGxldCBwID0gZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSk7XG5cdFx0cC5jbGFzc2VkKFwiY2xvc2VkXCIsICEgcC5jbGFzc2VkKFwiY2xvc2VkXCIpKTtcblx0XHRzZWxmLnNldFByZWZzRnJvbVVJKCk7XG5cdCAgICB9KTtcblx0ZDMuc2VsZWN0QWxsKFwiLmNvbnRlbnQtZHJhZ2dhYmxlID4gKlwiKVxuXHQgICAgLmFwcGVuZChcImlcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zIGJ1dHRvbiBkcmFnaGFuZGxlXCIpO1xuXHQvL1xuXHQvL1xuXHR0aGlzLmdlbm9tZVZpZXcgPSBuZXcgR2Vub21lVmlldyh0aGlzLCBcIiNnZW5vbWVWaWV3XCIsIDgwMCwgMjUwKTtcblx0dGhpcy56b29tVmlldyAgID0gbmV3IFpvb21WaWV3ICAodGhpcywgXCIjem9vbVZpZXdcIiwgODAwLCAyNTAsIHRoaXMuY29vcmRzKTtcblx0dGhpcy5yZXNpemUoKTtcbiAgICAgICAgLy9cblx0dGhpcy5mZWF0dXJlRGV0YWlscyA9IG5ldyBGZWF0dXJlRGV0YWlscyh0aGlzLCBcIiNmZWF0dXJlRGV0YWlsc1wiKTtcblxuXHR0aGlzLmNzY2FsZSA9IGQzLnNjYWxlLmNhdGVnb3J5MTAoKS5kb21haW4oW1xuXHQgICAgXCJwcm90ZWluX2NvZGluZ19nZW5lXCIsXG5cdCAgICBcInBzZXVkb2dlbmVcIixcblx0ICAgIFwibmNSTkFfZ2VuZVwiLFxuXHQgICAgXCJnZW5lX3NlZ21lbnRcIixcblx0ICAgIFwib3RoZXJfZ2VuZVwiLFxuXHQgICAgXCJvdGhlcl9mZWF0dXJlX3R5cGVcIlxuXHRdKTtcblx0Ly9cblx0Ly9cblx0dGhpcy5saXN0TWFuYWdlciAgICA9IG5ldyBMaXN0TWFuYWdlcih0aGlzLCBcIiNteWxpc3RzXCIpO1xuXHR0aGlzLmxpc3RNYW5hZ2VyLnVwZGF0ZSgpO1xuXHQvL1xuXHR0aGlzLmxpc3RFZGl0b3IgPSBuZXcgTGlzdEVkaXRvcih0aGlzLCAnI2xpc3RlZGl0b3InKTtcblx0Ly9cblx0dGhpcy50cmFuc2xhdG9yICAgICA9IG5ldyBCVE1hbmFnZXIodGhpcyk7XG5cdHRoaXMuZmVhdHVyZU1hbmFnZXIgPSBuZXcgRmVhdHVyZU1hbmFnZXIodGhpcyk7XG5cdC8vXG5cdGxldCBzZWFyY2hUeXBlcyA9IFt7XG5cdCAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeUlkXCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBzeW1ib2wvSURcIixcblx0ICAgIHRlbXBsYXRlOiBcIlwiLFxuXHQgICAgcGxhY2Vob2xkZXI6IFwiTUdJIHN5bWJvbHMvSURzXCJcblx0fSx7XG5cdCAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeUZ1bmN0aW9uXCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBjZWxsdWxhciBmdW5jdGlvblwiLFxuXHQgICAgdGVtcGxhdGU6IFwiXCIsXG5cdCAgICBwbGFjZWhvbGRlcjogXCJHZW5lIE9udG9sb2d5IChHTykgdGVybXMvSURzXCJcblx0fSx7XG5cdCAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeVBoZW5vdHlwZVwiLFxuXHQgICAgbGFiZWw6IFwiLi4uYnkgbXV0YW50IHBoZW5vdHlwZVwiLFxuXHQgICAgdGVtcGxhdGU6IFwiXCIsXG5cdCAgICBwbGFjZWhvbGRlcjogXCJNYW1tYWxpYW4gUGhlbm90eXBlIChNUCkgdGVybXMvSURzXCJcblx0fSx7XG5cdCAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeURpc2Vhc2VcIixcblx0ICAgIGxhYmVsOiBcIi4uLmJ5IGRpc2Vhc2UgaW1wbGljYXRpb25cIixcblx0ICAgIHRlbXBsYXRlOiBcIlwiLFxuXHQgICAgcGxhY2Vob2xkZXI6IFwiRGlzZWFzZSBPbnRvbG9neSAoRE8pIHRlcm1zL0lEc1wiXG5cdH1dO1xuXHR0aGlzLnF1ZXJ5TWFuYWdlciA9IG5ldyBRdWVyeU1hbmFnZXIodGhpcywgXCIjZmluZEdlbmVzQm94XCIsIHNlYXJjaFR5cGVzKTtcblx0Ly9cblx0dGhpcy51c2VyUHJlZnNNYW5hZ2VyID0gbmV3IFVzZXJQcmVmc01hbmFnZXIoKTtcblx0Ly9cblx0Ly8gQnV0dG9uOiBHZWFyIGljb24gdG8gc2hvdy9oaWRlIGxlZnQgY29sdW1uXG5cdGQzLnNlbGVjdChcIiNoZWFkZXIgPiAuZ2Vhci5idXR0b25cIilcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgbGMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImxlZnRjb2x1bW5cIl0nKTtcblx0XHRsYy5jbGFzc2VkKFwiY2xvc2VkXCIsICgpID0+ICEgbGMuY2xhc3NlZChcImNsb3NlZFwiKSk7XG5cdFx0d2luZG93LnNldFRpbWVvdXQoKCk9Pntcblx0XHQgICAgdGhpcy5yZXNpemUoKVxuXHRcdCAgICB0aGlzLnNldENvbnRleHQoe30pO1xuXHRcdCAgICB0aGlzLnNldFByZWZzRnJvbVVJKCk7XG5cdFx0fSwgMjUwKTtcblx0ICAgIH0pO1xuXHRcblx0Ly9cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBGYWNldHNcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvL1xuXHR0aGlzLmZhY2V0TWFuYWdlciA9IG5ldyBGYWNldE1hbmFnZXIodGhpcyk7XG5cdGxldCBzZWxmID0gdGhpcztcblxuXHQvLyBGZWF0dXJlLXR5cGUgZmFjZXRcblx0bGV0IGZ0RmFjZXQgID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJGZWF0dXJlVHlwZVwiLCBmID0+IGYuZ2V0TXVuZ2VkVHlwZSgpKTtcblx0dGhpcy5pbml0RmVhdFR5cGVDb250cm9sKGZ0RmFjZXQpO1xuXG5cdC8vIEhhcy1NR0ktaWQgZmFjZXRcblx0bGV0IG1naUZhY2V0ID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJIYXNNZ2lJZFwiLCAgICBmID0+IGYubWdpaWQgID8gXCJ5ZXNcIiA6IFwibm9cIiApO1xuXHRkMy5zZWxlY3RBbGwoJ2lucHV0W25hbWU9XCJtZ2lGYWNldFwiXScpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCl7XG5cdCAgICBtZ2lGYWNldC5zZXRWYWx1ZXModGhpcy52YWx1ZSA9PT0gXCJcIiA/IFtdIDogW3RoaXMudmFsdWVdKTtcblx0ICAgIHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXG5cdC8vIElzLWhpZ2hsaWdodGVkIGZhY2V0XG5cdGxldCBoaUZhY2V0ID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJJc0hpXCIsIGYgPT4ge1xuXHQgICAgbGV0IGlzaGkgPSB0aGlzLnpvb21WaWV3LmhpRmVhdHNbZi5tZ2lpZF0gfHwgdGhpcy56b29tVmlldy5oaUZlYXRzW2YubWdwaWRdO1xuXHQgICAgcmV0dXJuIGlzaGkgPyBcInllc1wiIDogXCJub1wiO1xuXHR9KTtcblx0ZDMuc2VsZWN0QWxsKCdpbnB1dFtuYW1lPVwiaGlGYWNldFwiXScpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCl7XG5cdCAgICBoaUZhY2V0LnNldFZhbHVlcyh0aGlzLnZhbHVlID09PSBcIlwiID8gW10gOiBbdGhpcy52YWx1ZV0pO1xuXHQgICAgc2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0fSk7XG5cblxuXHQvL1xuXHR0aGlzLnNldFVJRnJvbVByZWZzKCk7XG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdC8vIFRoaW5ncyBhcmUgYWxsIHdpcmVkIHVwLiBOb3cgbGV0J3MgZ2V0IHNvbWUgZGF0YS5cblx0Ly8gU3RhcnQgd2l0aCB0aGUgZmlsZSBvZiBhbGwgdGhlIGdlbm9tZXMuXG5cdGQzdHN2KFwiLi9kYXRhL2dlbm9tZUxpc3QudHN2XCIpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICAvLyBjcmVhdGUgR2Vub21lIG9iamVjdHMgZnJvbSB0aGUgcmF3IGRhdGEuXG5cdCAgICB0aGlzLmFsbEdlbm9tZXMgICA9IGRhdGEubWFwKGcgPT4gbmV3IEdlbm9tZShnKSk7XG5cdCAgICB0aGlzLmFsbEdlbm9tZXMuc29ydCggKGEsYikgPT4ge1xuXHQgICAgICAgIHJldHVybiBhLmxhYmVsIDwgYi5sYWJlbCA/IC0xIDogYS5sYWJlbCA+IGIubGFiZWwgPyArMSA6IDA7XG5cdCAgICB9KTtcblx0ICAgIC8vXG5cdCAgICAvLyBidWlsZCBhIG5hbWUtPkdlbm9tZSBpbmRleFxuXHQgICAgdGhpcy5ubDJnZW5vbWUgPSB7fTsgLy8gYWxzbyBidWlsZCB0aGUgY29tYmluZWQgbGlzdCBhdCB0aGUgc2FtZSB0aW1lLi4uXG5cdCAgICB0aGlzLm5hbWUyZ2Vub21lICA9IHRoaXMuYWxsR2Vub21lc1xuXHQgICAgICAgIC5yZWR1Y2UoKGFjYyxnKSA9PiB7IHRoaXMubmwyZ2Vub21lW2cubmFtZV0gPSBhY2NbZy5uYW1lXSA9IGc7IHJldHVybiBhY2M7IH0sIHt9KTtcblx0ICAgIC8vIGJ1aWxkIGEgbGFiZWwtPkdlbm9tZSBpbmRleFxuXHQgICAgdGhpcy5sYWJlbDJnZW5vbWUgPSB0aGlzLmFsbEdlbm9tZXNcblx0ICAgICAgICAucmVkdWNlKChhY2MsZykgPT4geyB0aGlzLm5sMmdlbm9tZVtnLmxhYmVsXSA9IGFjY1tnLmxhYmVsXSA9IGc7IHJldHVybiBhY2M7IH0sIHt9KTtcblxuXHQgICAgLy9cblx0ICAgIGxldCBjZmcgPSB0aGlzLnNhbml0aXplQ2ZnKHRoaXMuaW5pdGlhbENmZyk7XG5cdCAgICBsZXQgc2VsZiA9IHRoaXM7XG5cblx0ICAgIC8vIGluaXRpYWxpemUgdGhlIHJlZiBhbmQgY29tcCBnZW5vbWUgb3B0aW9uIGxpc3RzXG5cdCAgICBpbml0T3B0TGlzdChcIiNyZWZHZW5vbWVcIiwgICB0aGlzLmFsbEdlbm9tZXMsIGc9PmcubmFtZSwgZz0+Zy5sYWJlbCwgZmFsc2UsIGcgPT4gZyA9PT0gY2ZnLnJlZik7XG5cdCAgICBpbml0T3B0TGlzdChcIiNjb21wR2Vub21lc1wiLCB0aGlzLmFsbEdlbm9tZXMsIGc9PmcubmFtZSwgZz0+Zy5sYWJlbCwgdHJ1ZSwgIGcgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihnKSAhPT0gLTEpO1xuXHQgICAgZDMuc2VsZWN0KFwiI3JlZkdlbm9tZVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0XHRzZWxmLnNldENvbnRleHQoeyByZWY6IHRoaXMudmFsdWUgfSk7XG5cdCAgICB9KTtcblx0ICAgIGQzLnNlbGVjdChcIiNjb21wR2Vub21lc1wiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0XHRsZXQgc2VsZWN0ZWROYW1lcyA9IFtdO1xuXHRcdGZvcihsZXQgeCBvZiB0aGlzLnNlbGVjdGVkT3B0aW9ucyl7XG5cdFx0ICAgIHNlbGVjdGVkTmFtZXMucHVzaCh4LnZhbHVlKTtcblx0XHR9XG5cdFx0Ly8gd2FudCB0byBwcmVzZXJ2ZSBjdXJyZW50IGdlbm9tZSBvcmRlciBhcyBtdWNoIGFzIHBvc3NpYmxlIFxuXHRcdGxldCBnTmFtZXMgPSBzZWxmLnZHZW5vbWVzLm1hcChnPT5nLm5hbWUpXG5cdFx0ICAgIC5maWx0ZXIobiA9PiB7XG5cdFx0ICAgICAgICByZXR1cm4gc2VsZWN0ZWROYW1lcy5pbmRleE9mKG4pID49IDAgfHwgbiA9PT0gc2VsZi5yR2Vub21lLm5hbWU7XG5cdFx0ICAgIH0pO1xuXHRcdGdOYW1lcyA9IGdOYW1lcy5jb25jYXQoc2VsZWN0ZWROYW1lcy5maWx0ZXIobiA9PiBnTmFtZXMuaW5kZXhPZihuKSA9PT0gLTEpKTtcblx0XHRzZWxmLnNldENvbnRleHQoeyBnZW5vbWVzOiBnTmFtZXMgfSk7XG5cdCAgICB9KTtcblx0ICAgIC8vXG5cdCAgICAvLyBQcmVsb2FkIGFsbCB0aGUgY2hyb21vc29tZSBmaWxlcyBmb3IgYWxsIHRoZSBnZW5vbWVzXG5cdCAgICBsZXQgY2RwcyA9IHRoaXMuYWxsR2Vub21lcy5tYXAoZyA9PiBkM3RzdihgLi9kYXRhL2dlbm9tZWRhdGEvJHtnLm5hbWV9LWNocm9tb3NvbWVzLnRzdmApKTtcblx0ICAgIHJldHVybiBQcm9taXNlLmFsbChjZHBzKTtcblx0fS5iaW5kKHRoaXMpKVxuXHQudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG5cdCAgICAvL1xuXHQgICAgdGhpcy5wcm9jZXNzQ2hyb21vc29tZXMoZGF0YSk7XG5cblx0ICAgIC8vIEZJTkFMTFkhIFdlIGFyZSByZWFkeSB0byBkcmF3IHRoZSBpbml0aWFsIHNjZW5lLlxuXHQgICAgdGhpcy5zZXRDb250ZXh0KHRoaXMuaW5pdGlhbENmZyk7XG5cblx0fS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcHJvY2Vzc0Nocm9tb3NvbWVzIChkYXRhKSB7XG5cdC8vIGRhdGEgaXMgYSBsaXN0IG9mIGNocm9tb3NvbWUgbGlzdHMsIG9uZSBwZXIgZ2Vub21lXG5cdC8vIEZpbGwgaW4gdGhlIGdlbm9tZUNocnMgbWFwIChnZW5vbWUgLT4gY2hyIGxpc3QpXG5cdHRoaXMuYWxsR2Vub21lcy5mb3JFYWNoKChnLGkpID0+IHtcblx0ICAgIC8vIG5pY2VseSBzb3J0IHRoZSBjaHJvbW9zb21lc1xuXHQgICAgbGV0IGNocnMgPSBkYXRhW2ldO1xuXHQgICAgZy5tYXhsZW4gPSAwO1xuXHQgICAgY2hycy5mb3JFYWNoKCBjID0+IHtcblx0XHQvL1xuXHRcdGMubGVuZ3RoID0gcGFyc2VJbnQoYy5sZW5ndGgpXG5cdFx0Zy5tYXhsZW4gPSBNYXRoLm1heChnLm1heGxlbiwgYy5sZW5ndGgpO1xuXHRcdC8vIGJlY2F1c2UgSSdkIHJhdGhlciBzYXkgXCJjaHJvbW9zb21lLm5hbWVcIiB0aGFuIFwiY2hyb21vc29tZS5jaHJvbW9zb21lXCJcblx0XHRjLm5hbWUgPSBjLmNocm9tb3NvbWU7XG5cdFx0ZGVsZXRlIGMuY2hyb21vc29tZTtcblx0ICAgIH0pO1xuXHQgICAgLy8gbmljZWx5IHNvcnQgdGhlIGNocm9tb3NvbWVzXG5cdCAgICBjaHJzLnNvcnQoKGEsYikgPT4ge1xuXHRcdGxldCBhYSA9IHBhcnNlSW50KGEubmFtZSkgLSBwYXJzZUludChiLm5hbWUpO1xuXHRcdGlmICghaXNOYU4oYWEpKSByZXR1cm4gYWE7XG5cdFx0cmV0dXJuIGEubmFtZSA8IGIubmFtZSA/IC0xIDogYS5uYW1lID4gYi5uYW1lID8gKzEgOiAwO1xuXHQgICAgfSk7XG5cdCAgICBnLmNocm9tb3NvbWVzID0gY2hycztcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXREb20gKCkge1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGdldENvbnRlbnREcmFnZ2VyICgpIHtcbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIC8vIEhlbHBlciBmdW5jdGlvbiBmb3IgdGhlIGRyYWcgYmVoYXZpb3IuIFJlb3JkZXJzIHRoZSBjb250ZW50cyBiYXNlZCBvblxuICAgICAgLy8gY3VycmVudCBzY3JlZW4gcG9zaXRpb24gb2YgdGhlIGRyYWdnZWQgaXRlbS5cbiAgICAgIGZ1bmN0aW9uIHJlb3JkZXJCeURvbSgpIHtcblx0ICAvLyBMb2NhdGUgdGhlIHNpYiB3aG9zZSBwb3NpdGlvbiBpcyBiZXlvbmQgdGhlIGRyYWdnZWQgaXRlbSBieSB0aGUgbGVhc3QgYW1vdW50XG5cdCAgbGV0IGRyID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICBsZXQgYlNpYiA9IG51bGw7XG5cdCAgbGV0IHh5ID0gZDMuc2VsZWN0KHNlbGYuZHJhZ1BhcmVudCkuY2xhc3NlZChcImZsZXhyb3dcIikgPyBcInhcIiA6IFwieVwiO1xuXHQgIGZvciAobGV0IHMgb2Ygc2VsZi5kcmFnU2licykge1xuXHQgICAgICBsZXQgc3IgPSBzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICBpZiAoZHJbeHldIDwgc3JbeHldKSB7XG5cdFx0ICAgbGV0IGRpc3QgPSBzclt4eV0gLSBkclt4eV07XG5cdFx0ICAgaWYgKCFiU2liIHx8IGRpc3QgPCBiU2liW3h5XSAtIGRyW3h5XSlcblx0XHQgICAgICAgYlNpYiA9IHM7XG5cdCAgICAgIH1cblx0ICB9XG5cdCAgLy8gSW5zZXJ0IHRoZSBkcmFnZ2VkIGl0ZW0gYmVmb3JlIHRoZSBsb2NhdGVkIHNpYiAob3IgYXBwZW5kIGlmIG5vIHNpYiBmb3VuZClcblx0ICBzZWxmLmRyYWdQYXJlbnQuaW5zZXJ0QmVmb3JlKHNlbGYuZHJhZ2dpbmcsIGJTaWIpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gcmVvcmRlckJ5U3R5bGUoKSB7XG5cdCAgbGV0IGRkID0gZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpO1xuXHQgIC8vIExvY2F0ZSB0aGUgc2liIHRoYXQgY29udGFpbnMgdGhlIGRyYWdnZWQgaXRlbSdzIG9yaWdpbi5cblx0ICBsZXQgZHIgPSBzZWxmLmRyYWdnaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIGxldCBiU2liID0gbnVsbDtcblx0ICBsZXQgeHkgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnUGFyZW50KS5jbGFzc2VkKFwiZmxleHJvd1wiKSA/IFwieFwiIDogXCJ5XCI7XG5cdCAgbGV0IHN6ID0geHkgPT09IFwieFwiID8gXCJ3aWR0aFwiIDogXCJoZWlnaHRcIjtcblx0ICBsZXQgc3R5PSB4eSA9PT0gXCJ4XCIgPyBcImxlZnRcIiA6IFwidG9wXCI7XG5cdCAgZm9yIChsZXQgcyBvZiBzZWxmLmRyYWdTaWJzKSB7XG5cdCAgICAgIC8vIHNraXAgdGhlIGRyYWdnZWQgaXRlbVxuXHQgICAgICBpZiAocyA9PT0gc2VsZi5kcmFnZ2luZykgY29udGludWU7XG5cdCAgICAgIGxldCBkcyA9IGQzLnNlbGVjdChzKTtcblx0ICAgICAgbGV0IHNyID0gcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgLy8gaWZ3IHRoZSBkcmFnZ2VkIGl0ZW0ncyBvcmlnaW4gaXMgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCBvZiBzaWIsIHdlIGZvdW5kIGl0LlxuXHQgICAgICBpZiAoZHJbeHldID49IHNyW3h5XSAmJiBkclt4eV0gPD0gKHNyW3h5XSArIHNyW3N6XSkpIHtcblx0XHQgICAvLyBtb3ZlIHNpYiB0b3dhcmQgdGhlIGhvbGUsIGFtb3VudCA9IHRoZSBzaXplIG9mIHRoZSBob2xlXG5cdFx0ICAgbGV0IGFtdCA9IHNlbGYuZHJhZ0hvbGVbc3pdICogKHNlbGYuZHJhZ0hvbGVbeHldIDwgc3JbeHldID8gLTEgOiAxKTtcblx0XHQgICBkcy5zdHlsZShzdHksIHBhcnNlSW50KGRzLnN0eWxlKHN0eSkpICsgYW10ICsgXCJweFwiKTtcblx0XHQgICBzZWxmLmRyYWdIb2xlW3h5XSAtPSBhbXQ7XG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgIH1cblx0ICB9XG4gICAgICB9XG4gICAgICAvL1xuICAgICAgcmV0dXJuIGQzLmJlaGF2aW9yLmRyYWcoKVxuXHQgIC5vcmlnaW4oZnVuY3Rpb24oZCxpKXtcblx0ICAgICAgcmV0dXJuIHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgfSlcbiAgICAgICAgICAub24oXCJkcmFnc3RhcnQubVwiLCBmdW5jdGlvbigpIHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC5zb3VyY2VFdmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICghIGQzLnNlbGVjdCh0KS5jbGFzc2VkKFwiZHJhZ2hhbmRsZVwiKSkgcmV0dXJuO1xuXHQgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgLy9cblx0ICAgICAgc2VsZi5kcmFnZ2luZyAgICA9IHRoaXMuY2xvc2VzdChcIi5wYWdlYm94XCIpO1xuXHQgICAgICBzZWxmLmRyYWdIb2xlICAgID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgc2VsZi5kcmFnUGFyZW50ICA9IHNlbGYuZHJhZ2dpbmcucGFyZW50Tm9kZTtcblx0ICAgICAgc2VsZi5kcmFnU2licyAgICA9IHNlbGYuZHJhZ1BhcmVudC5jaGlsZHJlbjtcblx0ICAgICAgLy9cblx0ICAgICAgZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCB0cnVlKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWcubVwiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICBsZXQgZGQgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZyk7XG5cdCAgICAgIGxldCB0cCA9IHBhcnNlSW50KGRkLnN0eWxlKFwidG9wXCIpKVxuXHQgICAgICBkZC5zdHlsZShcInRvcFwiLCB0cCArIGQzLmV2ZW50LmR5ICsgXCJweFwiKTtcblx0ICAgICAgLy9yZW9yZGVyQnlTdHlsZSgpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZ2VuZC5tXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIHJlb3JkZXJCeURvbSgpO1xuXHQgICAgICBzZWxmLnNldFByZWZzRnJvbVVJKCk7XG5cdCAgICAgIGxldCBkZCA9IGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKTtcblx0ICAgICAgZGQuc3R5bGUoXCJ0b3BcIiwgXCIwcHhcIik7XG5cdCAgICAgIGRkLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCBmYWxzZSk7XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgICAgPSBudWxsO1xuXHQgICAgICBzZWxmLmRyYWdIb2xlICAgID0gbnVsbDtcblx0ICAgICAgc2VsZi5kcmFnUGFyZW50ICA9IG51bGw7XG5cdCAgICAgIHNlbGYuZHJhZ1NpYnMgICAgPSBudWxsO1xuXHQgIH0pXG5cdCAgO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRVSUZyb21QcmVmcyAoKSB7XG4gICAgICAgIGxldCBwcmVmcyA9IHRoaXMudXNlclByZWZzTWFuYWdlci5nZXRBbGwoKTtcblx0Y29uc29sZS5sb2coXCJHb3QgcHJlZnMgZnJvbSBzdG9yYWdlXCIsIHByZWZzKTtcblxuXHQvLyBzZXQgb3Blbi9jbG9zZWQgc3RhdGVzXG5cdChwcmVmcy5jbG9zYWJsZXMgfHwgW10pLmZvckVhY2goIGMgPT4ge1xuXHQgICAgbGV0IGlkID0gY1swXTtcblx0ICAgIGxldCBzdGF0ZSA9IGNbMV07XG5cdCAgICBkMy5zZWxlY3QoJyMnK2lkKS5jbGFzc2VkKCdjbG9zZWQnLCBzdGF0ZSA9PT0gXCJjbG9zZWRcIiB8fCBudWxsKTtcblx0fSk7XG5cblx0Ly8gc2V0IGRyYWdnYWJsZXMnIG9yZGVyXG5cdChwcmVmcy5kcmFnZ2FibGVzIHx8IFtdKS5mb3JFYWNoKCBkID0+IHtcblx0ICAgIGxldCBjdHJJZCA9IGRbMF07XG5cdCAgICBsZXQgY29udGVudElkcyA9IGRbMV07XG5cdCAgICBsZXQgY3RyID0gZDMuc2VsZWN0KCcjJytjdHJJZCk7XG5cdCAgICBsZXQgY29udGVudHMgPSBjdHIuc2VsZWN0QWxsKCcjJytjdHJJZCsnID4gKicpO1xuXHQgICAgY29udGVudHNbMF0uc29ydCggKGEsYikgPT4ge1xuXHQgICAgICAgIGxldCBhaSA9IGNvbnRlbnRJZHMuaW5kZXhPZihhLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG5cdCAgICAgICAgbGV0IGJpID0gY29udGVudElkcy5pbmRleE9mKGIuZ2V0QXR0cmlidXRlKCdpZCcpKTtcblx0XHRyZXR1cm4gYWkgLSBiaTtcblx0ICAgIH0pO1xuXHQgICAgY29udGVudHMub3JkZXIoKTtcblx0fSk7XG4gICAgfVxuICAgIHNldFByZWZzRnJvbVVJICgpIHtcbiAgICAgICAgLy8gc2F2ZSBvcGVuL2Nsb3NlZCBzdGF0ZXNcblx0bGV0IGNsb3NhYmxlcyA9IHRoaXMucm9vdC5zZWxlY3RBbGwoJy5jbG9zYWJsZScpO1xuXHRsZXQgb2NEYXRhID0gY2xvc2FibGVzWzBdLm1hcCggYyA9PiB7XG5cdCAgICBsZXQgZGMgPSBkMy5zZWxlY3QoYyk7XG5cdCAgICByZXR1cm4gW2RjLmF0dHIoJ2lkJyksIGRjLmNsYXNzZWQoXCJjbG9zZWRcIikgPyBcImNsb3NlZFwiIDogXCJvcGVuXCJdO1xuXHR9KTtcblx0Ly8gc2F2ZSBkcmFnZ2FibGVzJyBvcmRlclxuXHRsZXQgZHJhZ0N0cnMgPSB0aGlzLnJvb3Quc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUnKTtcblx0bGV0IGRyYWdnYWJsZXMgPSBkcmFnQ3Rycy5zZWxlY3RBbGwoJy5jb250ZW50LWRyYWdnYWJsZSA+IConKTtcblx0bGV0IGRkRGF0YSA9IGRyYWdnYWJsZXMubWFwKCAoZCxpKSA9PiB7XG5cdCAgICBsZXQgY3RyID0gZDMuc2VsZWN0KGRyYWdDdHJzWzBdW2ldKTtcblx0ICAgIHJldHVybiBbY3RyLmF0dHIoJ2lkJyksIGQubWFwKCBkZCA9PiBkMy5zZWxlY3QoZGQpLmF0dHIoJ2lkJykpXTtcblx0fSk7XG5cdGxldCBwcmVmcyA9IHtcblx0ICAgIGNsb3NhYmxlczogb2NEYXRhLFxuXHQgICAgZHJhZ2dhYmxlczogZGREYXRhXG5cdH1cblx0Y29uc29sZS5sb2coXCJTYXZpbmcgcHJlZnMgdG8gc3RvcmFnZVwiLCBwcmVmcyk7XG5cdHRoaXMudXNlclByZWZzTWFuYWdlci5zZXRBbGwocHJlZnMpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93QmxvY2tzIChjb21wKSB7XG5cdGxldCByZWYgPSB0aGlzLnJHZW5vbWU7XG5cdGlmICghIGNvbXApIGNvbXAgPSB0aGlzLmNHZW5vbWVzWzBdO1xuXHRpZiAoISBjb21wKSByZXR1cm47XG5cdHRoaXMudHJhbnNsYXRvci5yZWFkeSgpLnRoZW4oICgpID0+IHtcblx0ICAgIGxldCBibG9ja3MgPSBjb21wID09PSByZWYgPyBbXSA6IHRoaXMudHJhbnNsYXRvci5nZXRCbG9ja3MocmVmLCBjb21wKTtcblx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3QmxvY2tzKHsgcmVmLCBjb21wLCBibG9ja3MgfSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93QnVzeSAoaXNCdXN5KSB7XG4gICAgICAgIGQzLnNlbGVjdChcIiNoZWFkZXIgPiAuZ2Vhci5idXR0b25cIilcblx0ICAgIC5jbGFzc2VkKFwicm90YXRpbmdcIiwgaXNCdXN5KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQXJnczpcbiAgICAvLyAgIGcgIChzdHJpbmcpIGdlbm9tZSBuYW1lIChlZyBcIm11c19jYXJvbGlcIikgb3IgbGFiZWwgKGVnIFwiQ0FST0xJL0VpSlwiKSBcbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgdHJ1ZSBpZmYgdGhlIHJlZiBnZW5vbWUgd2FzIGFjdHVhbGx5IGNoYW5nZWRcbiAgICBzZXRSZWZHZW5vbWUgKGcpIHtcblx0Ly9cblx0aWYgKCFnKSByZXR1cm4gZmFsc2U7XG5cdC8vXG5cdGxldCByZyA9IHRoaXMubmwyZ2Vub21lW2ddO1xuXHRpZiAocmcgJiYgcmcgIT09IHRoaXMuckdlbm9tZSl7XG5cdCAgICAvLyBjaGFuZ2UgdGhlIHJlZiBnZW5vbWVcblx0ICAgIHRoaXMuckdlbm9tZSA9IHJnO1xuXHQgICAgZDMuc2VsZWN0QWxsKFwiI3JlZkdlbm9tZSBvcHRpb25cIilcblx0ICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCAgZ2cgPT4gKGdnLmxhYmVsID09PSByZy5sYWJlbCAgfHwgbnVsbCkpO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgZ2xpc3QgKGxpc3Qgb2Ygc3RyaW5ncykgZ2Vub21lIG5hbWUgb3IgbGFiZWxzXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgIHRydWUgaWZmIGNvbXAgZ2Vub21lcyBhY3R1YWxseSBjaGFuZ2VkXG4gICAgc2V0Q29tcEdlbm9tZXMgKGdsaXN0KSB7XG4gICAgICAgIC8vXG4gICAgICAgIGlmICghZ2xpc3QpIHJldHVybiBmYWxzZTtcblx0Ly8gXG5cdGxldCBjZ3MgPSBbXTtcblx0Zm9yKCBsZXQgeCBvZiBnbGlzdCApIHtcblx0ICAgIGxldCBjZyA9IHRoaXMubmwyZ2Vub21lW3hdO1xuXHQgICAgY2cgJiYgY2cgIT09IHRoaXMuckdlbm9tZSAmJiBjZ3MuaW5kZXhPZihjZykgPT09IC0xICYmIGNncy5wdXNoKGNnKTtcblx0fVxuXHRsZXQgY2ducyA9IGNncy5tYXAoIGNnID0+IGNnLmxhYmVsICk7XG5cdGQzLnNlbGVjdEFsbChcIiNjb21wR2Vub21lcyBvcHRpb25cIilcblx0ICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCAgZ2cgPT4gY2ducy5pbmRleE9mKGdnLmxhYmVsKSA+PSAwKTtcblx0Ly9cblx0Ly8gY29tcGFyZSBjb250ZW50cyBvZiBjZ3Mgd2l0aCB0aGUgY3VycmVudCBjR2Vub21lcy5cblx0aWYgKHNhbWUoY2dzLCB0aGlzLmNHZW5vbWVzKSkgcmV0dXJuIGZhbHNlO1xuXHQvL1xuXHR0aGlzLmNHZW5vbWVzID0gY2dzO1xuXHRyZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyBvciByZXR1cm5zXG4gICAgc2V0SGlnaGxpZ2h0IChmbGlzdCkge1xuXHRpZiAoIWZsaXN0KSByZXR1cm4gZmFsc2U7XG5cdHRoaXMuem9vbVZpZXcuaGlGZWF0cyA9IGZsaXN0LnJlZHVjZSgoYSx2KSA9PiB7IGFbdl09djsgcmV0dXJuIGE7IH0sIHt9KTtcblx0cmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIGN1cnJlbnQgY29udGV4dCBhcyBhbiBvYmplY3QuXG4gICAgLy8gQ3VycmVudCBjb250ZXh0ID0gcmVmIGdlbm9tZSArIGNvbXAgZ2Vub21lcyArIGN1cnJlbnQgcmFuZ2UgKGNocixzdGFydCxlbmQpXG4gICAgZ2V0Q29udGV4dCAoKSB7XG4gICAgICAgIGxldCBjID0gdGhpcy56b29tVmlldy5jb29yZHM7XG4gICAgICAgIHJldHVybiB7XG5cdCAgICByZWYgOiB0aGlzLnJHZW5vbWUubGFiZWwsXG5cdCAgICBnZW5vbWVzOiB0aGlzLnZHZW5vbWVzLm1hcChnPT5nLmxhYmVsKSxcblx0ICAgIGNocjogYy5jaHIsXG5cdCAgICBzdGFydDogYy5zdGFydCxcblx0ICAgIGVuZDogYy5lbmQsXG5cdCAgICBoaWdobGlnaHQ6IE9iamVjdC5rZXlzKHRoaXMuem9vbVZpZXcuaGlGZWF0cyksXG5cdCAgICBkbW9kZTogdGhpcy56b29tVmlldy5kbW9kZVxuXHR9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBzYW5pdGl6ZWQgdmVyc2lvbiBvZiB0aGUgYXJndW1lbnQgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAgLy8gVGhlIHNhbml0aXplZCB2ZXJzaW9uOlxuICAgIC8vICAgICAtIGhhcyBhIHNldHRpbmcgZm9yIGV2ZXJ5IHBhcmFtZXRlci4gUGFyYW1ldGVycyBub3Qgc3BlY2lmaWVkIGluIFxuICAgIC8vICAgICAgIHRoZSBhcmd1bWVudCBhcmUgKGdlbmVyYWxseSkgZmlsbGVkIGluIHdpdGggdGhlaXIgY3VycmVudCB2YWx1ZXMuXG4gICAgLy8gICAgIC0gaXMgYWx3YXlzIHZhbGlkLCBlZ1xuICAgIC8vICAgICBcdC0gaGFzIGEgbGlzdCBvZiAxIG9yIG1vcmUgdmFsaWQgZ2Vub21lcywgd2l0aCBvbmUgb2YgdGhlbSBkZXNpZ25hdGVkIGFzIHRoZSByZWZcbiAgICAvLyAgICAgXHQtIGhhcyBhIHZhbGlkIGNvb3JkaW5hdGUgcmFuZ2VcbiAgICAvLyAgICAgXHQgICAgLSBzdGFydCBhbmQgZW5kIGFyZSBpbnRlZ2VycyB3aXRoIHN0YXJ0IDw9IGVuZFxuICAgIC8vICAgICBcdCAgICAtIHZhbGlkIGNocm9tb3NvbWUgZm9yIHJlZiBnZW5vbWVcbiAgICAvL1xuICAgIC8vIFRoZSBzYW5pdGl6ZWQgdmVyc2lvbiBpcyBhbHNvIFwiY29tcGlsZWRcIjpcbiAgICAvLyAgICAgLSBpdCBoYXMgYWN0dWFsIEdlbm9tZSBvYmplY3RzLCB3aGVyZSB0aGUgYXJndW1lbnQganVzdCBoYXMgbmFtZXNcbiAgICAvLyAgICAgLSBncm91cHMgdGhlIGNocitzdGFydCtlbmQgaW4gXCJjb29yZHNcIiBvYmplY3RcbiAgICAvL1xuICAgIC8vXG4gICAgc2FuaXRpemVDZmcgKGMpIHtcblx0bGV0IGNmZyA9IHt9O1xuXG5cdC8vIFNhbml0aXplIHRoZSBpbnB1dC5cblxuXHQvLyBcblx0aWYgKGMud2lkdGggfHwgYy5oZWlnaHQpIHtcblx0ICAgIGNmZy53aWR0aCA9IGMud2lkdGhcblx0fVxuXG5cdC8vXG5cdC8vIFNldCBjZmcucmVmIHRvIHNwZWNpZmllZCBnZW5vbWUsIFxuXHQvLyAgIHdpdGggZmFsbGJhY2sgdG8gY3VycmVudCByZWYgZ2Vub21lLCBcblx0Ly8gICAgICB3aXRoIGZhbGxiYWNrIHRvIEM1N0JMLzZKICgxc3QgdGltZSB0aHJ1KVxuXHQvLyBGSVhNRTogZmluYWwgZmFsbGJhY2sgc2hvdWxkIGJlIGEgY29uZmlnIHNldHRpbmcuXG5cdGNmZy5yZWYgPSAoYy5yZWYgPyB0aGlzLm5sMmdlbm9tZVtjLnJlZl0gfHwgdGhpcy5yR2Vub21lIDogdGhpcy5yR2Vub21lKSB8fCB0aGlzLm5sMmdlbm9tZVsnQzU3QkwvNkonXTtcblxuXHQvLyBTZXQgY2ZnLmdlbm9tZXMgdG8gYmUgdGhlIHNwZWNpZmllZCBnZW5vbWVzLFxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBnZW5vbWVzXG5cdC8vICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIFtyZWZdICgxc3QgdGltZSB0aHJ1KVxuXHRjZmcuZ2Vub21lcyA9IGMuZ2Vub21lcyA/XG5cdCAgICAoYy5nZW5vbWVzLm1hcChnID0+IHRoaXMubmwyZ2Vub21lW2ddKS5maWx0ZXIoeD0+eCkpXG5cdCAgICA6XG5cdCAgICB0aGlzLnZHZW5vbWVzO1xuXHQvLyBBZGQgcmVmIHRvIGdlbm9tZXMgaWYgbm90IHRoZXJlIGFscmVhZHlcblx0aWYgKGNmZy5nZW5vbWVzLmluZGV4T2YoY2ZnLnJlZikgPT09IC0xKVxuXHQgICAgY2ZnLmdlbm9tZXMudW5zaGlmdChjZmcucmVmKTtcblx0XG5cdC8vIFNldCBjZmcuY2hyIHRvIGJlIHRoZSBzcGVjaWZpZWQgY2hyb21vc29tZVxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBjaHJcblx0Ly8gICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSAxc3QgY2hyb21vc29tZSBpbiB0aGUgcmVmIGdlbm9tZVxuXHRjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKGMuY2hyKTtcblx0aWYgKCFjZmcuY2hyKSBjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKCB0aGlzLmNvb3JkcyA/IHRoaXMuY29vcmRzLmNociA6IFwiMVwiICk7XG5cdGlmICghY2ZnLmNocikgY2ZnLmNociA9IGNmZy5yZWYuZ2V0Q2hyb21vc29tZSgwKTtcblx0Ly9pZiAoIWNmZy5jaHIpIGNvbnNvbGUubG9nKFwid2FybmluZzogbm8gY2hyb21vc29tZVwiKTtcblx0XG5cdC8vIEVuc3VyZSBzdGFydCA8PSBlbmRcblx0aWYgKHR5cGVvZihjLnN0YXJ0KSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YoYy5lbmQpID09PSBcIm51bWJlclwiICYmIGMuc3RhcnQgPiBjLmVuZCApIHtcblx0ICAgIC8vIHN3YXBcblx0ICAgIGxldCB0bXAgPSBjLnN0YXJ0OyBjLnN0YXJ0ID0gYy5lbmQ7IGMuZW5kID0gdG1wO1xuXHR9XG5cblx0Ly8gU2V0IGNmZy5zdGFydCB0byBiZSB0aGUgc3BlY2lmaWVkIHN0YXJ0XG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IHN0YXJ0XG5cdC8vICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIDFcblx0Ly8gICAgICAgICAgIHdpdGggYSBtaW4gdmFsdWUgb2YgMVxuXHRjZmcuc3RhcnQgPSBNYXRoLmZsb29yKE1hdGgubWF4KCAxLCB0eXBlb2YoYy5zdGFydCkgPT09IFwibnVtYmVyXCIgPyBjLnN0YXJ0IDogdGhpcy5jb29yZHMgPyB0aGlzLmNvb3Jkcy5zdGFydCA6IDEgKSk7XG5cblx0Ly8gU2V0IGNmZy5lbmQgdG8gYmUgdGhlIHNwZWNpZmllZCBlbmRcblx0Ly8gICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgZW5kXG5cdC8vICAgICAgICAgd2l0aCBmYWxsYmFjayB0byBzdGFydCArIDEwIE1CXG5cdGNmZy5lbmQgPSB0eXBlb2YoYy5lbmQpID09PSBcIm51bWJlclwiID9cblx0ICAgIGMuZW5kXG5cdCAgICA6XG5cdCAgICB0aGlzLmNvb3JkcyA/XG5cdCAgICAgICAgKGNmZy5zdGFydCArIHRoaXMuY29vcmRzLmVuZCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMSlcblx0XHQ6XG5cdFx0Y2ZnLnN0YXJ0O1xuXHQvLyBjbGlwIGF0IGNociBlbmRcblx0Y2ZnLmVuZCA9IE1hdGguZmxvb3IoY2ZnLmNociA/IE1hdGgubWluKGNmZy5lbmQsICAgY2ZnLmNoci5sZW5ndGgpIDogY2ZnLmVuZCk7XG5cblx0Ly8gU2V0IGNmZy5oaWdobGlnaHRcblx0Ly8gICAgd2l0aCBmYWxsYmFjayB0byBjdXJyZW50IGhpZ2hsaWdodFxuXHQvLyAgICAgICAgd2l0aCBmYWxsYmFjayB0byBbXVxuXHRjZmcuaGlnaGxpZ2h0ID0gYy5oaWdobGlnaHQgfHwgdGhpcy56b29tVmlldy5oaWdobGlnaHRlZCB8fCBbXTtcblxuXHQvLyBTZXQgdGhlIGRyYXdpbmcgbW9kZSBmb3IgdGhlIFpvb25WaWV3LlxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCB2YWx1ZVxuXHRpZiAoYy5kbW9kZSA9PT0gJ2NvbXBhcmlzb24nIHx8IGMuZG1vZGUgPT09ICdyZWZlcmVuY2UnKSBcblx0ICAgIGNmZy5kbW9kZSA9IGMuZG1vZGU7XG5cdGVsc2Vcblx0ICAgIGNmZy5kbW9kZSA9IHRoaXMuem9vbVZpZXcuZG1vZGUgfHwgJ2NvbXBhcmlzb24nO1xuXG5cdC8vXG5cdHJldHVybiBjZmc7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyB0aGUgY3VycmVudCBjb250ZXh0IGZyb20gdGhlIGNvbmZpZyBvYmplY3QuIFxuICAgIC8vIE9ubHkgdGhvc2UgY29udGV4dCBpdGVtcyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZyBhcmUgYWZmZWN0ZWQsIGV4Y2VwdCBhcyBub3RlZC5cbiAgICAvL1xuICAgIC8vIEFsbCBjb25maWdzIGFyZSBzYW5pdGl6ZWQgYmVmb3JlIGJlaW5nIGFwcGxpZWQgKHNlZSBzYW5pdGl6ZUNmZykuXG4gICAgLy8gXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBjIChvYmplY3QpIEEgY29uZmlndXJhdGlvbiBvYmplY3QgdGhhdCBzcGVjaWZpZXMgc29tZS9hbGwgY29uZmlnIHZhbHVlcy5cbiAgICAvLyAgICAgICAgIFRoZSBwb3NzaWJsZSBjb25maWcgaXRlbXM6XG4gICAgLy8gICAgICAgICAgICBnZW5vbWVzICAgKGxpc3QgbyBzdHJpbmdzKSBBbGwgdGhlIGdlbm9tZXMgeW91IHdhbnQgdG8gc2VlLCBpbiB0b3AtdG8tYm90dG9tIG9yZGVyLiBcbiAgICAvLyAgICAgICAgICAgICAgIE1heSB1c2UgaW50ZXJuYWwgbmFtZXMgb3IgZGlzcGxheSBsYWJlbHMsIGVnLCBcIm11c19tdXNjdWx1c18xMjlzMXN2aW1qXCIgb3IgXCIxMjlTMS9TdkltSlwiLlxuICAgIC8vICAgICAgICAgICAgcmVmICAgICAgIChzdHJpbmcpIFRoZSBnZW5vbWUgdG8gdXNlIGFzIHRoZSByZWZlcmVuY2UuIE1heSBiZSBuYW1lIG9yIGxhYmVsLlxuICAgIC8vICAgICAgICAgICAgY2hyICAgICAgIChzdHJpbmcpIENocm9tb3NvbWUgZm9yIGNvb3JkaW5hdGUgcmFuZ2VcbiAgICAvLyAgICAgICAgICAgIHN0YXJ0ICAgICAoaW50KSBDb29yZGluYXRlIHJhbmdlIHN0YXJ0IHBvc2l0aW9uXG4gICAgLy8gICAgICAgICAgICBlbmQgICAgICAgKGludCkgQ29vcmRpbmF0ZSByYW5nZSBlbmQgcG9zaXRpb25cbiAgICAvLyAgICAgICAgICAgIGhpZ2hsaWdodCAobGlzdCBvIHN0cmluZ3MpIElEcyBvZiBmZWF0dXJlcyB0byBoaWdobGlnaHRcbiAgICAvLyAgICAgICAgICAgIGRtb2RlICAgICAoc3RyaW5nKSBlaXRoZXIgJ2NvbXBhcmlzb24nIG9yICdyZWZlcmVuY2UnXG4gICAgLy9cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgIE5vdGhpbmdcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy9cdCAgUmVkcmF3cyBcbiAgICAvL1x0ICBDYWxscyBjb250ZXh0Q2hhbmdlZCgpIFxuICAgIC8vXG4gICAgc2V0Q29udGV4dCAoYykge1xuICAgICAgICBsZXQgY2ZnID0gdGhpcy5zYW5pdGl6ZUNmZyhjKTtcblx0Ly9cblx0dGhpcy52R2Vub21lcyA9IGNmZy5nZW5vbWVzO1xuXHR0aGlzLnJHZW5vbWUgID0gY2ZnLnJlZjtcblx0dGhpcy5jR2Vub21lcyA9IGNmZy5nZW5vbWVzLmZpbHRlcihnID0+IGcgIT09IGNmZy5yZWYpO1xuXHR0aGlzLmNvb3JkcyAgID0geyBjaHI6IGNmZy5jaHIubmFtZSwgc3RhcnQ6IGNmZy5zdGFydCwgZW5kOiBjZmcuZW5kIH07XG5cdC8vXG5cdHRoaXMuZ2Vub21lVmlldy5yZWRyYXcoKTtcblx0dGhpcy5nZW5vbWVWaWV3LnNldEJydXNoQ29vcmRzKHRoaXMuY29vcmRzKTtcblx0Ly9cblx0dGhpcy56b29tVmlldy5oaWdobGlnaHRlZCA9IGNmZy5oaWdobGlnaHQ7XG5cdHRoaXMuem9vbVZpZXcuZ2Vub21lcyA9IHRoaXMudkdlbm9tZXM7XG5cdHRoaXMuem9vbVZpZXcudXBkYXRlKHRoaXMuY29vcmRzKTtcblx0Ly9cblx0dGhpcy56b29tVmlldy5kbW9kZSA9IGNmZy5kbW9kZTtcblx0Ly9cblx0dGhpcy5jb250ZXh0Q2hhbmdlZCgpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXNpemUgKCkge1xuXHRsZXQgdyA9IHdpbmRvdy5pbm5lcldpZHRoIC0gMjQ7XG5cdHRoaXMuZ2Vub21lVmlldy5maXRUb1dpZHRoKHcpO1xuXHR0aGlzLnpvb21WaWV3LmZpdFRvV2lkdGgodyk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIGN1cnJlbnQgY29udGV4dCBhcyBhIHBhcmFtZXRlciBzdHJpbmdcbiAgICAvLyBDdXJyZW50IGNvbnRleHQgPSByZWYgZ2Vub21lICsgY29tcCBnZW5vbWVzICsgY3VycmVudCByYW5nZSAoY2hyLHN0YXJ0LGVuZClcbiAgICBnZXRQYXJhbVN0cmluZyAoKSB7XG5cdGxldCBjID0gdGhpcy5nZXRDb250ZXh0KCk7XG4gICAgICAgIGxldCByZWYgPSBgcmVmPSR7Yy5yZWZ9YDtcbiAgICAgICAgbGV0IGdlbm9tZXMgPSBgZ2Vub21lcz0ke2MuZ2Vub21lcy5qb2luKFwiK1wiKX1gO1xuXHRsZXQgY29vcmRzID0gYGNocj0ke2MuY2hyfSZzdGFydD0ke2Muc3RhcnR9JmVuZD0ke2MuZW5kfWA7XG5cdGxldCBobHMgPSBgaGlnaGxpZ2h0PSR7Yy5oaWdobGlnaHQuam9pbihcIitcIil9YDtcblx0bGV0IGRtb2RlID0gYGRtb2RlPSR7Yy5kbW9kZX1gO1xuXHRyZXR1cm4gYCR7ZG1vZGV9JiR7cmVmfSYke2dlbm9tZXN9JiR7Y29vcmRzfSYke2hsc31gO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBjdXJyZW50TGlzdCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJMaXN0O1xuICAgIH1cbiAgICBzZXQgY3VycmVudExpc3QgKGxzdCkge1xuICAgIFx0Ly9cblx0dGhpcy5jdXJyTGlzdCA9IGxzdDtcblx0Ly9cblx0bGV0IGxpc3RzID0gZDMuc2VsZWN0KCcjbXlsaXN0cycpLnNlbGVjdEFsbCgnLmxpc3RJbmZvJyk7XG5cdGxpc3RzLmNsYXNzZWQoXCJjdXJyZW50XCIsIGQgPT4gZCA9PT0gbHN0KTtcblx0aWYgKGxzdCkge1xuXHQgICAgLy8gbWFrZSB0aGlzIGxpc3QgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGluIHRoZSB6b29tIHZpZXdcblx0ICAgIHRoaXMuem9vbVZpZXcuaGlGZWF0cyA9IGxzdC5pZHMucmVkdWNlKChhLHYpID0+IHsgYVt2XT12OyByZXR1cm4gYTsgfSwge30pXG5cdCAgICB0aGlzLnpvb21WaWV3LnVwZGF0ZSgpO1xuXHQgICAgLy8gc2hvdyB0aGlzIGxpc3QgYXMgdGljayBtYXJrcyBpbiB0aGUgZ2Vub21lIHZpZXdcblx0ICAgIHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXNCeUlkKHRoaXMuckdlbm9tZSwgbHN0Lmlkcylcblx0XHQudGhlbiggZmVhdHMgPT4ge1xuXHRcdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd1RpY2tzKGZlYXRzKTtcblx0XHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdUaXRsZSgpO1xuXHRcdH0pO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy56b29tVmlldy5oaUZlYXRzID0ge307XG5cdCAgICB0aGlzLnpvb21WaWV3LnVwZGF0ZSgpO1xuXHQgICAgLy9cblx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3VGlja3MoW10pO1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdUaXRsZSgpO1xuXHR9XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2FuaXRpemVDb29yZHMoY29vcmRzKSB7XG5cdGlmICh0eXBlb2YoY29vcmRzKSA9PT0gXCJzdHJpbmdcIikgXG5cdCAgICBjb29yZHMgPSBwYXJzZUNvb3Jkcyhjb29yZHMpO1xuXHRsZXQgY2hyb21vc29tZSA9IHRoaXMuckdlbm9tZS5jaHJvbW9zb21lcy5maWx0ZXIoYyA9PiBjLm5hbWUgPT09IGNvb3Jkcy5jaHIpWzBdO1xuXHRpZiAoISBjaHJvbW9zb21lKSByZXR1cm4gbnVsbDtcblx0aWYgKGNvb3Jkcy5zdGFydCA+IGNvb3Jkcy5lbmQpIHtcblx0ICAgIGxldCB0bXAgPSBjb29yZHMuc3RhcnQ7IGNvb3Jkcy5zdGFydCA9IGNvb3Jkcy5lbmQ7IGNvb3Jkcy5lbmQgPSB0bXA7XG5cdH1cblx0Y29vcmRzLnN0YXJ0ID0gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjb29yZHMuc3RhcnQpKVxuXHRjb29yZHMuZW5kICAgPSBNYXRoLm1pbihjaHJvbW9zb21lLmxlbmd0aCwgTWF0aC5mbG9vcihjb29yZHMuZW5kKSlcbiAgICAgICAgcmV0dXJuIGNvb3JkcztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBab29tcyBpbi9vdXQgYnkgZmFjdG9yLiBOZXcgem9vbSB3aWR0aCBpcyBmYWN0b3IgKiB0aGUgY3VycmVudCB6b29tIHdpZHRoLlxuICAgIC8vIEZhY3RvciA+IDEgem9vbXMgb3V0LCAwIDwgZmFjdG9yIDwgMSB6b29tcyBpbi5cbiAgICB6b29tIChmYWN0b3IpIHtcblxuXHRsZXQgbGVuID0gdGhpcy5jb29yZHMuZW5kIC0gdGhpcy5jb29yZHMuc3RhcnQgKyAxO1xuXHRsZXQgbmV3bGVuID0gTWF0aC5yb3VuZChmYWN0b3IgKiBsZW4pO1xuXHRsZXQgeCA9ICh0aGlzLmNvb3Jkcy5zdGFydCArIHRoaXMuY29vcmRzLmVuZCkvMjtcblx0bGV0IG5ld3N0YXJ0ID0gTWF0aC5yb3VuZCh4IC0gbmV3bGVuLzIpO1xuXHR0aGlzLnNldENvbnRleHQoeyBjaHI6IHRoaXMuY29vcmRzLmNociwgc3RhcnQ6IG5ld3N0YXJ0LCBlbmQ6IG5ld3N0YXJ0ICsgbmV3bGVuIC0gMSB9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQYW5zIHRoZSB2aWV3IGxlZnQgb3IgcmlnaHQgYnkgZmFjdG9yLiBUaGUgZGlzdGFuY2UgbW92ZWQgaXMgZmFjdG9yIHRpbWVzIHRoZSBjdXJyZW50IHpvb20gd2lkdGguXG4gICAgLy8gTmVnYXRpdmUgdmFsdWVzIHBhbiBsZWZ0LiBQb3NpdGl2ZSB2YWx1ZXMgcGFuIHJpZ2h0LiAoTm90ZSB0aGF0IHBhbm5pbmcgbW92ZXMgdGhlIFwiY2FtZXJhXCIuIFBhbm5pbmcgdG8gdGhlXG4gICAgLy8gcmlnaHQgbWFrZXMgdGhlIG9iamVjdHMgaW4gdGhlIHNjZW5lIGFwcGVhciB0byBtb3ZlIHRvIHRoZSBsZWZ0LCBhbmQgdmljZSB2ZXJzYS4pXG4gICAgLy9cbiAgICBwYW4gKGZhY3RvciwgYW5pbWF0ZSkge1xuXHRsZXQgd2lkdGggPSB0aGlzLmNvb3Jkcy5lbmQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDE7XG5cdGxldCBwYW5EaXN0ID0gZmFjdG9yICogKHRoaXMuem9vbVZpZXcueHNjYWxlLnJhbmdlKClbMV0pO1xuXHRsZXQgZCA9IE1hdGgucm91bmQoZmFjdG9yICogd2lkdGgpO1xuXHRsZXQgbnM7XG5cdGxldCBuZTtcblx0aWYgKGQgPCAwKSB7XG5cdCAgICBucyA9IE1hdGgubWF4KDEsIHRoaXMuY29vcmRzLnN0YXJ0K2QpO1xuXHQgICAgbmUgPSBucyArIHdpZHRoIC0gMTtcblx0fVxuXHRlbHNlIGlmIChkID4gMCkge1xuXHQgICAgbGV0IGNocm9tb3NvbWUgPSB0aGlzLnJHZW5vbWUuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSB0aGlzLmNvb3Jkcy5jaHIpWzBdO1xuXHQgICAgbmUgPSBNYXRoLm1pbihjaHJvbW9zb21lLmxlbmd0aCwgdGhpcy5jb29yZHMuZW5kK2QpXG5cdCAgICBucyA9IG5lIC0gd2lkdGggKyAxO1xuXHR9XG5cdC8vIHRoaXMgcHJvYmFibHkgZG9lc24ndCBiZWxvbmcgaGVyZSBidXQgZm9yIG5vdy4uLlxuXHQvLyBUbyBnZXQgYSBzbW9vdGggcGFubmluZyBlZmZlY3Q6IGluaXRpYWxpemUgdGhlIHRyYW5zbGF0aW9uIHRvIHRoZSBzYW1lIGFzXG5cdC8vIHRoZSBwYW4gZGlzdGFuY2UsIGJ1dCBpbiB0aGUgb3Bwb3NpdGUgZGlyZWN0aW9uLi4uXG5cdC8vdGhpcy56b29tVmlldy5zdmdcblx0ICAgIC8vLnN0eWxlKFwidHJhbnNpdGlvblwiLCBcInRyYW5zZm9ybSAwc1wiKVxuXHQgICAgLy8uc3R5bGUoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgkey1wYW5EaXN0fXB4LDBweClgKTtcblx0Ly8gLi4udGhlbiB0aGUgem9vbSBkcmF3IHdpbGwgdHJhbnNpdGlvbiB0aGUgdmVjdG9yIGJhY2sgdG8gKDAsMClcblx0dGhpcy5zZXRDb250ZXh0KHsgY2hyOiB0aGlzLmNvb3Jkcy5jaHIsIHN0YXJ0OiBucywgZW5kOiBuZSB9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RmVhdFR5cGVDb250cm9sIChmYWNldCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCBjb2xvcnMgPSB0aGlzLmNzY2FsZS5kb21haW4oKS5tYXAobGJsID0+IHtcblx0ICAgIHJldHVybiB7IGxibDpsYmwsIGNscjp0aGlzLmNzY2FsZShsYmwpIH07XG5cdH0pO1xuXHRsZXQgY2tlcyA9IGQzLnNlbGVjdChcIi5jb2xvcktleVwiKVxuXHQgICAgLnNlbGVjdEFsbCgnLmNvbG9yS2V5RW50cnknKVxuXHRcdC5kYXRhKGNvbG9ycyk7XG5cdGxldCBuY3MgPSBja2VzLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsIFwiY29sb3JLZXlFbnRyeSBmbGV4cm93XCIpO1xuXHRuY3MuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJzd2F0Y2hcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBjID0+IGMubGJsKVxuXHQgICAgLnN0eWxlKFwiYmFja2dyb3VuZC1jb2xvclwiLCBjID0+IGMuY2xyKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdGxldCB0ID0gZDMuc2VsZWN0KHRoaXMpO1xuXHQgICAgICAgIHQuY2xhc3NlZChcImNoZWNrZWRcIiwgISB0LmNsYXNzZWQoXCJjaGVja2VkXCIpKTtcblx0XHRsZXQgc3dhdGNoZXMgPSBkMy5zZWxlY3RBbGwoXCIuc3dhdGNoLmNoZWNrZWRcIilbMF07XG5cdFx0bGV0IGZ0cyA9IHN3YXRjaGVzLm1hcChzPT5zLmdldEF0dHJpYnV0ZShcIm5hbWVcIikpXG5cdFx0ZmFjZXQuc2V0VmFsdWVzKGZ0cyk7XG5cdFx0c2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0ICAgIH0pXG5cdCAgICAuYXBwZW5kKFwiaVwiKVxuXHQgICAgICAgIC5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zXCIpO1xuXHRuY3MuYXBwZW5kKFwic3BhblwiKVxuXHQgICAgLnRleHQoYyA9PiBjLmxibCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGlua1RvTWdpU25wUmVwb3J0ICgpIHtcblx0bGV0IGMgPSB0aGlzLmdldENvbnRleHQoKTtcblx0bGV0IHVybEJhc2UgPSAnaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL3NucC9zdW1tYXJ5Jztcblx0bGV0IHRhYkFyZyA9ICdzZWxlY3RlZFRhYj0xJztcblx0bGV0IHNlYXJjaEJ5QXJnID0gJ3NlYXJjaEJ5U2FtZURpZmY9Jztcblx0bGV0IGNockFyZyA9IGBzZWxlY3RlZENocm9tb3NvbWU9JHtjLmNocn1gO1xuXHRsZXQgY29vcmRBcmcgPSBgY29vcmRpbmF0ZT0ke2Muc3RhcnR9LSR7Yy5lbmR9YDtcblx0bGV0IHVuaXRBcmcgPSAnY29vcmRpbmF0ZVVuaXQ9YnAnO1xuXHRsZXQgY3NBcmdzID0gYy5nZW5vbWVzLm1hcChnID0+IGBzZWxlY3RlZFN0cmFpbnM9JHtnfWApXG5cdGxldCByc0FyZyA9IGByZWZlcmVuY2VTdHJhaW49JHtjLnJlZn1gO1xuXHRsZXQgbGlua1VybCA9IGAke3VybEJhc2V9PyR7dGFiQXJnfSYke3NlYXJjaEJ5QXJnfSYke2NockFyZ30mJHtjb29yZEFyZ30mJHt1bml0QXJnfSYke3JzQXJnfSYke2NzQXJncy5qb2luKCcmJyl9YFxuXHR3aW5kb3cub3BlbihsaW5rVXJsLCBcIl9ibGFua1wiKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGlua1RvTWdpUVRMcyAoKSB7XG5cdGxldCBjICAgICAgICA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRsZXQgdXJsQmFzZSAgPSAnaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL2FsbGVsZS9zdW1tYXJ5Jztcblx0bGV0IGNockFyZyAgID0gYGNocm9tb3NvbWU9JHtjLmNocn1gO1xuXHRsZXQgY29vcmRBcmcgPSBgY29vcmRpbmF0ZT0ke2Muc3RhcnR9LSR7Yy5lbmR9YDtcblx0bGV0IHVuaXRBcmcgID0gJ2Nvb3JkVW5pdD1icCc7XG5cdGxldCB0eXBlQXJnICA9ICdhbGxlbGVUeXBlPVFUTCc7XG5cdGxldCBsaW5rVXJsICA9IGAke3VybEJhc2V9PyR7Y2hyQXJnfSYke2Nvb3JkQXJnfSYke3VuaXRBcmd9JiR7dHlwZUFyZ31gO1xuXHR3aW5kb3cub3BlbihsaW5rVXJsLCBcIl9ibGFua1wiKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGlua1RvTWdpSkJyb3dzZSAoKSB7XG5cdGxldCBjID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdGxldCB1cmxCYXNlID0gJ2h0dHA6Ly9qYnJvd3NlLmluZm9ybWF0aWNzLmpheC5vcmcvJztcblx0bGV0IGRhdGFBcmcgPSAnZGF0YT1kYXRhJTJGbW91c2UnOyAvLyBcImRhdGEvbW91c2VcIlxuXHRsZXQgbG9jQXJnICA9IGBsb2M9Y2hyJHtjLmNocn0lM0Eke2Muc3RhcnR9Li4ke2MuZW5kfWA7XG5cdGxldCB0cmFja3MgID0gWydETkEnLCdNR0lfR2Vub21lX0ZlYXR1cmVzJywnTkNCSV9DQ0RTJywnTkNCSScsJ0VOU0VNQkwnXTtcblx0bGV0IHRyYWNrc0FyZz1gdHJhY2tzPSR7dHJhY2tzLmpvaW4oJywnKX1gO1xuXHRsZXQgaGlnaGxpZ2h0QXJnID0gJ2hpZ2hsaWdodD0nO1xuXHRsZXQgbGlua1VybCA9IGAke3VybEJhc2V9PyR7IFtkYXRhQXJnLGxvY0FyZyx0cmFja3NBcmcsaGlnaGxpZ2h0QXJnXS5qb2luKCcmJykgfWA7XG5cdHdpbmRvdy5vcGVuKGxpbmtVcmwsIFwiX2JsYW5rXCIpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIE1HVkFwcFxuXG5leHBvcnQgeyBNR1ZBcHAgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL01HVkFwcC5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBHZW5vbWUge1xuICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG4gICAgdGhpcy5uYW1lID0gY2ZnLm5hbWU7XG4gICAgdGhpcy5sYWJlbD0gY2ZnLmxhYmVsO1xuICAgIHRoaXMuY2hyb21vc29tZXMgPSBbXTtcbiAgICB0aGlzLm1heGxlbiA9IC0xO1xuICAgIHRoaXMueHNjYWxlID0gbnVsbDtcbiAgICB0aGlzLnlzY2FsZSA9IG51bGw7XG4gICAgdGhpcy56b29tWSAgPSAtMTtcbiAgfVxuICBnZXRDaHJvbW9zb21lIChuKSB7XG4gICAgICBpZiAodHlwZW9mKG4pID09PSAnc3RyaW5nJylcblx0ICByZXR1cm4gdGhpcy5jaHJvbW9zb21lcy5maWx0ZXIoYyA9PiBjLm5hbWUgPT09IG4pWzBdO1xuICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiB0aGlzLmNocm9tb3NvbWVzW25dO1xuICB9XG4gIGhhc0Nocm9tb3NvbWUgKG4pIHtcbiAgICAgIHJldHVybiB0aGlzLmdldENocm9tb3NvbWUobikgPyB0cnVlIDogZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IHsgR2Vub21lIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9HZW5vbWUuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtkM2pzb24sIG92ZXJsYXBzLCBzdWJ0cmFjdH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge0ZlYXR1cmV9IGZyb20gJy4vRmVhdHVyZSc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSG93IHRoZSBhcHAgbG9hZHMgZmVhdHVyZSBkYXRhLiBQcm92aWRlcyB0d28gY2FsbHM6XG4vLyAgIC0gZ2V0IGZlYXR1cmVzIGluIHJhbmdlXG4vLyAgIC0gZ2V0IGZlYXR1cmVzIGJ5IGlkXG4vLyBSZXF1ZXN0cyBmZWF0dXJlcyBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHJlZ2lzdGVycyB0aGVtIGluIGEgY2FjaGUuXG4vLyBJbnRlcmFjdHMgd2l0aCB0aGUgYmFjayBlbmQgdG8gbG9hZCBmZWF0dXJlczsgdHJpZXMgbm90IHRvIHJlcXVlc3Rcbi8vIHRoZSBzYW1lIHJlZ2lvbiB0d2ljZS5cbi8vXG5jbGFzcyBGZWF0dXJlTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICAgICAgdGhpcy5mZWF0Q2FjaGUgPSB7fTsgICAgIC8vIGluZGV4IGZyb20gbWdwaWQgLT4gZmVhdHVyZVxuXHR0aGlzLm1naUNhY2hlID0ge307XHQgLy8gaW5kZXggZnJvbSBtZ2lpZCAtPiBbIGZlYXR1cmVzIF1cblx0dGhpcy5jYWNoZSA9IHt9OyAgICAgICAgIC8vIHtnZW5vbWUubmFtZSAtPiB7Y2hyLm5hbWUgLT4gbGlzdCBvZiBibG9ja3N9fVxuXHR0aGlzLm1pbmVGZWF0dXJlQ2FjaGUgPSB7fTsgLy8gYXV4aWxpYXJ5IGluZm8gcHVsbGVkIGZyb20gTW91c2VNaW5lIFxuXHR0aGlzLmxvYWRlZEdlbm9tZXMgPSBuZXcgU2V0KCk7IC8vIHRoZSBzZXQgb2YgR2Vub21lcyB0aGF0IGhhdmUgYmVlbiBmdWxseSBsb2FkZWRcbiAgICB9XG4gXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUHJvY2Vzc2VzIHRoZSBcInJhd1wiIGZlYXR1cmVzIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgLy8gVHVybnMgdGhlbSBpbnRvIEZlYXR1cmUgb2JqZWN0cyBhbmQgcmVnaXN0ZXJzIHRoZW0uXG4gICAgLy8gSWYgdGhlIHNhbWUgcmF3IGZlYXR1cmUgaXMgcmVnaXN0ZXJlZCBhZ2FpbixcbiAgICAvLyB0aGUgRmVhdHVyZSBvYmplY3QgY3JlYXRlZCB0aGUgZmlyc3QgdGltZSBpcyByZXR1cm5lZC5cbiAgICAvLyAoSS5lLiwgcmVnaXN0ZXJpbmcgdGhlIHNhbWUgZmVhdHVyZSBtdWx0aXBsZSB0aW1lcyBpcyBvaylcbiAgICAvL1xuICAgIHByb2Nlc3NGZWF0dXJlcyAoZmVhdHMsIGdlbm9tZSkge1xuXHRyZXR1cm4gZmVhdHMubWFwKGQgPT4ge1xuXHQgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgdGhpcyBvbmUgaW4gdGhlIGNhY2hlLCByZXR1cm4gaXQuXG5cdCAgICBsZXQgZiA9IHRoaXMuZmVhdENhY2hlW2QubWdwaWRdO1xuXHQgICAgaWYgKGYpIHJldHVybiBmO1xuXHQgICAgLy8gQ3JlYXRlIGEgbmV3IEZlYXR1cmVcblx0ICAgIGQuZ2Vub21lID0gZ2Vub21lXG5cdCAgICBmID0gbmV3IEZlYXR1cmUoZCk7XG5cdCAgICAvLyBSZWdpc3RlciBpdC5cblx0ICAgIHRoaXMuZmVhdENhY2hlW2YubWdwaWRdID0gZjtcblx0ICAgIGlmIChmLm1naWlkKSB7XG5cdFx0bGV0IGxzdCA9IHRoaXMubWdpQ2FjaGVbZi5tZ2lpZF0gPSAodGhpcy5tZ2lDYWNoZVtmLm1naWlkXSB8fCBbXSk7XG5cdFx0bHN0LnB1c2goZik7XG5cdCAgICB9XG5cdCAgICAvLyBoZXJlIHknZ28uXG5cdCAgICByZXR1cm4gZjtcblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmVnaXN0ZXJzIGFuIGluZGV4IGJsb2NrIGZvciB0aGUgZ2l2ZW4gZ2Vub21lLiBBbiBpbmRleCBibG9ja1xuICAgIC8vIGlzIGEgY29udGlndW91cyBjaHVuayBvZiBmZWF0dWVzIGZyb20gdGhlIEdGRiBmaWxlIGZvciB0aGF0IGdlbm9tZS5cbiAgICAvLyBSZWdpc3RlcmluZyB0aGUgc2FtZSBibG9jayBtdWx0aXBsZSB0aW1lcyBpcyBvayAtIHN1Y2Nlc3NpdmUgdGltZXNcbiAgICAvLyBoYXZlIG5vIGVmZmVjdC5cbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICBBZGRzIHRoZSBibG9jayB0byB0aGUgY2FjaGVcbiAgICAvLyAgIFJlcGxhY2VzIGVhY2ggcmF3IGZlYXR1cmUgaW4gdGhlIGJsb2NrIHdpdGggYSBGZWF0dXJlIG9iamVjdC5cbiAgICAvLyAgIFJlZ2lzdGVycyBuZXcgRmVhdHVyZXMgaW4gYSBsb29rdXAuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgIGdlbm9tZSAob2JqZWN0KSBUaGUgZ2Vub21lIHRoZSBibG9jayBpcyBmb3IsXG4gICAgLy8gICBibGsgKG9iamVjdCkgQW4gaW5kZXggYmxvY2ssIHdoaWNoIGhhcyBhIGNociwgc3RhcnQsIGVuZCxcbiAgICAvLyAgIFx0YW5kIGEgbGlzdCBvZiBcInJhd1wiIGZlYXR1cmUgb2JqZWN0cy5cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgbm90aGluZ1xuICAgIC8vXG4gICAgX3JlZ2lzdGVyQmxvY2sgKGdlbm9tZSwgYmxrKSB7XG5cdC8vIGdlbm9tZSBjYWNoZVxuICAgICAgICBsZXQgZ2MgPSB0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXSA9ICh0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXSB8fCB7fSk7XG5cdC8vIGNocm9tb3NvbWUgY2FjaGUgKHcvaW4gZ2Vub21lKVxuXHRsZXQgY2MgPSBnY1tibGsuY2hyXSA9IChnY1tibGsuY2hyXSB8fCBbXSk7XG5cdGlmIChjYy5maWx0ZXIoYiA9PiBiLmlkID09PSBibGsuaWQpLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgYmxrLmZlYXR1cmVzID0gdGhpcy5wcm9jZXNzRmVhdHVyZXMoIGJsay5mZWF0dXJlcywgZ2Vub21lICk7XG5cdCAgICBibGsuZ2Vub21lID0gZ2Vub21lO1xuXHQgICAgY2MucHVzaChibGspO1xuXHQgICAgY2Muc29ydCggKGEsYikgPT4gYS5zdGFydCAtIGIuc3RhcnQgKTtcblx0fVxuXHQvL2Vsc2Vcblx0ICAgIC8vY29uc29sZS5sb2coXCJTa2lwcGVkIGJsb2NrLiBBbHJlYWR5IHNlZW4uXCIsIGdlbm9tZS5uYW1lLCBibGsuaWQpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIHJlbWFpbmRlciBvZiB0aGUgZ2l2ZW4gcmFuZ2UgYWZ0ZXJcbiAgICAvLyBzdWJ0cmFjdGluZyB0aGUgYWxyZWFkeS1lbnN1cmVkIHJhbmdlcy5cbiAgICAvLyBcbiAgICBfc3VidHJhY3RSYW5nZShnZW5vbWUsIHJhbmdlKXtcblx0bGV0IGdjID0gdGhpcy5jYWNoZVtnZW5vbWUubmFtZV07XG5cdGlmICghZ2MpIHRocm93IFwiTm8gc3VjaCBnZW5vbWU6IFwiICsgZ2Vub21lLm5hbWU7XG5cdGxldCBnQmxrcyA9IGdjW3JhbmdlLmNocl0gfHwgW107XG5cdGxldCBhbnMgPSBbXTtcblx0bGV0IHJuZyA9IHJhbmdlO1xuXHRnQmxrcy5mb3JFYWNoKCBiID0+IHtcblx0ICAgIGxldCBzdWIgPSBybmcgPyBzdWJ0cmFjdCggcm5nLCBiICkgOiBbXTtcblx0ICAgIGlmIChzdWIubGVuZ3RoID09PSAwKVxuXHQgICAgICAgIHJuZyA9IG51bGw7XG5cdCAgICBpZiAoc3ViLmxlbmd0aCA9PT0gMSlcblx0ICAgICAgICBybmcgPSBzdWJbMF07XG5cdCAgICBlbHNlIGlmIChzdWIubGVuZ3RoID09PSAyKXtcblx0ICAgICAgICBhbnMucHVzaChzdWJbMF0pO1xuXHRcdHJuZyA9IHN1YlsxXTtcblx0ICAgIH1cblx0fSlcblx0cm5nICYmIGFucy5wdXNoKHJuZyk7XG5cdGFucy5zb3J0KCAoYSxiKSA9PiBhLnN0YXJ0IC0gYi5zdGFydCApO1xuXHRyZXR1cm4gYW5zO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDYWxscyBzdWJ0cmFjdFJhbmdlIGZvciBlYWNoIHJhbmdlIGluIHRoZSBsaXN0IGFuZCByZXR1cm5zXG4gICAgLy8gdGhlIGFjY3VtdWxhdGVkIHJlc3VsdHMuXG4gICAgLy9cbiAgICBfc3VidHJhY3RSYW5nZXMoZ2Vub21lLCByYW5nZXMpIHtcblx0bGV0IGdjID0gdGhpcy5jYWNoZVtnZW5vbWUubmFtZV07XG5cdGlmICghZ2MpIHJldHVybiByYW5nZXM7XG5cdGxldCBuZXdyYW5nZXMgPSBbXTtcblx0cmFuZ2VzLmZvckVhY2gociA9PiB7XG5cdCAgICBuZXdyYW5nZXMgPSBuZXdyYW5nZXMuY29uY2F0KHRoaXMuX3N1YnRyYWN0UmFuZ2UoZ2Vub21lLCByKSk7XG5cdH0sIHRoaXMpXG5cdHJldHVybiBuZXdyYW5nZXM7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRW5zdXJlcyB0aGF0IGFsbCBmZWF0dXJlcyBpbiB0aGUgc3BlY2lmaWVkIHJhbmdlKHMpIGluIHRoZSBzcGVjaWZpZWQgZ2Vub21lXG4gICAgLy8gYXJlIGluIHRoZSBjYWNoZS4gUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0cnVlIHdoZW4gdGhlIGNvbmRpdGlvbiBpcyBtZXQuXG4gICAgX2Vuc3VyZUZlYXR1cmVzQnlSYW5nZSAoZ2Vub21lLCByYW5nZXMpIHtcblx0bGV0IG5ld3JhbmdlcyA9IHRoaXMuX3N1YnRyYWN0UmFuZ2VzKGdlbm9tZSwgcmFuZ2VzKTtcblx0aWYgKG5ld3Jhbmdlcy5sZW5ndGggPT09IDApIFxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHRsZXQgY29vcmRzQXJnID0gbmV3cmFuZ2VzLm1hcChyID0+IGAke3IuY2hyfToke3Iuc3RhcnR9Li4ke3IuZW5kfWApLmpvaW4oJywnKTtcblx0bGV0IGRhdGFTdHJpbmcgPSBgZ2Vub21lPSR7Z2Vub21lLm5hbWV9JmNvb3Jkcz0ke2Nvb3Jkc0FyZ31gO1xuXHRsZXQgdXJsID0gXCIuL2Jpbi9nZXRGZWF0dXJlcy5jZ2k/XCIgKyBkYXRhU3RyaW5nO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdGNvbnNvbGUubG9nKFwiUmVxdWVzdGluZzpcIiwgZ2Vub21lLm5hbWUsIG5ld3Jhbmdlcyk7XG5cdHJldHVybiBkM2pzb24odXJsKS50aGVuKGZ1bmN0aW9uKGJsb2Nrcyl7XG5cdCAgICBibG9ja3MuZm9yRWFjaCggYiA9PiBzZWxmLl9yZWdpc3RlckJsb2NrKGdlbm9tZSwgYikgKTtcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9KTtcbiAgICB9XG4gXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgX2Vuc3VyZUZlYXR1cmVzQnlHZW5vbWUgKGdlbm9tZSkge1xuXHRpZiggdGhpcy5sb2FkZWRHZW5vbWVzLmhhcyhnZW5vbWUpIClcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICAgIGxldCByYW5nZXMgPSBnZW5vbWUuY2hyb21vc29tZXMubWFwKGMgPT4geyBcblx0ICAgIHJldHVybiB7IGNocjogYy5uYW1lLCBzdGFydDogMSwgZW5kOiBjLmxlbmd0aCB9O1xuXHR9KTtcblx0cmV0dXJuIHRoaXMuX2Vuc3VyZUZlYXR1cmVzQnlSYW5nZShnZW5vbWUsIHJhbmdlcykudGhlbih4PT57IHRoaXMubG9hZGVkR2Vub21lcy5hZGQoZ2Vub21lKTsgcmV0dXJuIHRydWU7fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgX2dldENhY2hlZEZlYXR1cmVzIChnZW5vbWUsIHJhbmdlKSB7XG4gICAgICAgIGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdIDtcblx0aWYgKCFnYykgcmV0dXJuIFtdO1xuXHRsZXQgY0Jsb2NrcyA9IGdjW3JhbmdlLmNocl07XG5cdGlmICghY0Jsb2NrcykgcmV0dXJuIFtdO1xuXHRsZXQgZmVhdHMgPSBjQmxvY2tzXG5cdCAgICAuZmlsdGVyKGNiID0+IG92ZXJsYXBzKGNiLCByYW5nZSkpXG5cdCAgICAubWFwKCBjYiA9PiBjYi5mZWF0dXJlcy5maWx0ZXIoIGYgPT4gb3ZlcmxhcHMoIGYsIHJhbmdlKSApIClcblx0ICAgIC5yZWR1Y2UoIChhY2MsIHZhbCkgPT4gYWNjLmNvbmNhdCh2YWwpLCBbXSk7XG4gICAgICAgIHJldHVybiBmZWF0cztcdFxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldENhY2hlZEZlYXR1cmVzQnlNZ2lJZCAobWdpaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdpQ2FjaGVbbWdpaWRdIHx8IFtdO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFRoaXMgaXMgd2hhdCB0aGUgdXNlciBjYWxscy4gUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBmZWF0dXJlcyBpbiBcbiAgICAvLyB0aGUgc3BlY2lmaWVkIHJhbmdlcyBvZiB0aGUgc3BlY2lmaWVkIGdlbm9tZS5cbiAgICBnZXRGZWF0dXJlcyAoZ2Vub21lLCByYW5nZXMpIHtcblx0cmV0dXJuIHRoaXMuX2Vuc3VyZUZlYXR1cmVzQnlHZW5vbWUoZ2Vub21lKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmFuZ2VzLmZvckVhY2goIHIgPT4ge1xuXHQgICAgICAgIHIuZmVhdHVyZXMgPSB0aGlzLl9nZXRDYWNoZWRGZWF0dXJlcyhnZW5vbWUsIHIpIFxuXHRcdHIuZ2Vub21lID0gZ2Vub21lO1xuXHQgICAgfSk7XG5cdCAgICByZXR1cm4geyBnZW5vbWUsIGJsb2NrczpyYW5nZXMgfTtcblx0fS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBmZWF0dXJlcyBoYXZpbmcgdGhlIHNwZWNpZmllZCBpZHMgZnJvbSB0aGUgc3BlY2lmaWVkIGdlbm9tZS5cbiAgICBnZXRGZWF0dXJlc0J5SWQgKGdlbm9tZSwgaWRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbnN1cmVGZWF0dXJlc0J5R2Vub21lKGdlbm9tZSkudGhlbiggKCkgPT4ge1xuXHQgICAgbGV0IGZlYXRzID0gW107XG5cdCAgICBsZXQgc2VlbiA9IG5ldyBTZXQoKTtcblx0ICAgIGxldCBhZGRmID0gKGYpID0+IHtcblx0XHRpZiAoZi5nZW5vbWUgIT09IGdlbm9tZSkgcmV0dXJuO1xuXHRcdGlmIChzZWVuLmhhcyhmLmlkKSkgcmV0dXJuO1xuXHRcdHNlZW4uYWRkKGYuaWQpO1xuXHRcdGZlYXRzLnB1c2goZik7XG5cdCAgICB9O1xuXHQgICAgbGV0IGFkZCA9IChmKSA9PiB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZikpIFxuXHRcdCAgICBmLmZvckVhY2goZmYgPT4gYWRkZihmZikpO1xuXHRcdGVsc2Vcblx0XHQgICAgYWRkZihmKTtcblx0ICAgIH07XG5cdCAgICBmb3IgKGxldCBpIG9mIGlkcyl7XG5cdFx0bGV0IGYgPSB0aGlzLm1naUNhY2hlW2ldIHx8IHRoaXMuZmVhdENhY2hlW2ldO1xuXHRcdGYgJiYgYWRkKGYpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZlYXRzO1xuXHR9KTtcbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIEZlYXR1cmUgTWFuYWdlclxuXG5leHBvcnQgeyBGZWF0dXJlTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgaW5pdE9wdExpc3QgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IEF1eERhdGFNYW5hZ2VyIH0gZnJvbSAnLi9BdXhEYXRhTWFuYWdlcic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgUXVlcnlNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQsIGNmZykge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMuY2ZnID0gY2ZnO1xuXHR0aGlzLmF1eERhdGFNYW5hZ2VyID0gbmV3IEF1eERhdGFNYW5hZ2VyKCk7XG5cdHRoaXMuc2VsZWN0ID0gbnVsbDtcdC8vIG15IDxzZWxlY3Q+IGVsZW1lbnRcblx0dGhpcy50ZXJtID0gbnVsbDtcdC8vIG15IDxpbnB1dD4gZWxlbWVudFxuXHR0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdHRoaXMuc2VsZWN0ID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzZWFyY2h0eXBlXCJdJyk7XG5cdHRoaXMudGVybSAgID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzZWFyY2h0ZXJtXCJdJyk7XG5cdC8vXG5cdHRoaXMudGVybS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgdGhpcy5jZmdbMF0ucGxhY2Vob2xkZXIpXG5cdGluaXRPcHRMaXN0KHRoaXMuc2VsZWN0WzBdWzBdLCB0aGlzLmNmZywgYz0+Yy5tZXRob2QsIGM9PmMubGFiZWwpO1xuXHQvLyBXaGVuIHVzZXIgY2hhbmdlcyB0aGUgcXVlcnkgdHlwZSAoc2VsZWN0b3IpLCBjaGFuZ2UgdGhlIHBsYWNlaG9sZGVyIHRleHQuXG5cdHRoaXMuc2VsZWN0Lm9uKFwiY2hhbmdlXCIsICgpID0+IHtcblx0ICAgIGxldCBvcHQgPSB0aGlzLnNlbGVjdC5wcm9wZXJ0eShcInNlbGVjdGVkT3B0aW9uc1wiKVswXTtcblx0ICAgIHRoaXMudGVybS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgb3B0Ll9fZGF0YV9fLnBsYWNlaG9sZGVyKVxuXHQgICAgXG5cdH0pO1xuXHQvLyBXaGVuIHVzZXIgZW50ZXJzIGEgc2VhcmNoIHRlcm0sIHJ1biBhIHF1ZXJ5XG5cdHRoaXMudGVybS5vbihcImNoYW5nZVwiLCAoKSA9PiB7XG5cdCAgICBsZXQgdGVybSA9IHRoaXMudGVybS5wcm9wZXJ0eShcInZhbHVlXCIpO1xuXHQgICAgdGhpcy50ZXJtLnByb3BlcnR5KFwidmFsdWVcIixcIlwiKTtcblx0ICAgIGxldCBzZWFyY2hUeXBlICA9IHRoaXMuc2VsZWN0LnByb3BlcnR5KFwidmFsdWVcIik7XG5cdCAgICBsZXQgbHN0TmFtZSA9IHRlcm07XG5cdCAgICBkMy5zZWxlY3QoXCIjbXlsaXN0c1wiKS5jbGFzc2VkKFwiYnVzeVwiLHRydWUpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHQgICAgdGhpcy5hdXhEYXRhTWFuYWdlcltzZWFyY2hUeXBlXSh0ZXJtKVx0Ly8gPC0gcnVuIHRoZSBxdWVyeVxuXHQgICAgICAudGhlbihmZWF0cyA9PiB7XG5cdFx0ICAvLyBGSVhNRSAtIHJlYWNob3ZlciAtIHRoaXMgd2hvbGUgaGFuZGxlclxuXHRcdCAgbGV0IGxzdCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLmNyZWF0ZUxpc3QobHN0TmFtZSwgZmVhdHMubWFwKGYgPT4gZi5wcmltYXJ5SWRlbnRpZmllcikpXG5cdFx0ICB0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGUobHN0KTtcblx0XHQgIC8vXG5cdFx0ICB0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzID0ge307XG5cdFx0ICBmZWF0cy5mb3JFYWNoKGYgPT4gdGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0c1tmLm1naWlkXSA9IGYubWdpaWQpO1xuXHRcdCAgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdFx0ICAvL1xuXHRcdCAgdGhpcy5hcHAuY3VycmVudExpc3QgPSBsc3Q7XG5cdFx0ICAvL1xuXHRcdCAgZDMuc2VsZWN0KFwiI215bGlzdHNcIikuY2xhc3NlZChcImJ1c3lcIixmYWxzZSk7XG5cdCAgICAgIH0pO1xuXHR9KVxuICAgIH1cbn1cblxuZXhwb3J0IHsgUXVlcnlNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9RdWVyeU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGQzanNvbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEF1eERhdGFNYW5hZ2VyIC0ga25vd3MgaG93IHRvIHF1ZXJ5IGFuIGV4dGVybmFsIHNvdXJjZSAoaS5lLiwgTW91c2VNaW5lKSBmb3IgZ2VuZXNcbi8vIGFubm90YXRlZCB0byBkaWZmZXJlbnQgb250b2xvZ2llcy4gXG5jbGFzcyBBdXhEYXRhTWFuYWdlciB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0QXV4RGF0YSAocSkge1xuXHRsZXQgZm9ybWF0ID0gJ2pzb25vYmplY3RzJztcblx0bGV0IHF1ZXJ5ID0gZW5jb2RlVVJJQ29tcG9uZW50KHEpO1xuXHRsZXQgdXJsID0gYGh0dHA6Ly93d3cubW91c2VtaW5lLm9yZy9tb3VzZW1pbmUvc2VydmljZS9xdWVyeS9yZXN1bHRzP2Zvcm1hdD0ke2Zvcm1hdH0mcXVlcnk9JHtxdWVyeX1gO1xuXHRyZXR1cm4gZDNqc29uKHVybCkudGhlbihkYXRhID0+IGRhdGEucmVzdWx0c3x8W10pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGRvIGEgTE9PS1VQIHF1ZXJ5IGZvciBTZXF1ZW5jZUZlYXR1cmVzIGZyb20gTW91c2VNaW5lXG4gICAgZmVhdHVyZXNCeUxvb2t1cCAocXJ5U3RyaW5nKSB7XG5cdGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIlNlcXVlbmNlRmVhdHVyZS5wcmltYXJ5SWRlbnRpZmllciBTZXF1ZW5jZUZlYXR1cmUuc3ltYm9sXCIgbG9uZ0Rlc2NyaXB0aW9uPVwiXCIgY29uc3RyYWludExvZ2ljPVwiQSBhbmQgQiBhbmQgQ1wiPlxuXHQgICAgPGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlXCIgb3A9XCJMT09LVVBcIiB2YWx1ZT1cIiR7cXJ5U3RyaW5nfVwiLz5cblx0ICAgIDxjb25zdHJhaW50IGNvZGU9XCJCXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vcmdhbmlzbS50YXhvbklkXCIgb3A9XCI9XCIgdmFsdWU9XCIxMDA5MFwiLz5cblx0ICAgIDxjb25zdHJhaW50IGNvZGU9XCJDXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5zZXF1ZW5jZU9udG9sb2d5VGVybS5uYW1lXCIgb3A9XCIhPVwiIHZhbHVlPVwidHJhbnNnZW5lXCIvPlxuXHQgICAgPC9xdWVyeT5gO1xuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmZWF0dXJlc0J5T250b2xvZ3lUZXJtIChxcnlTdHJpbmcsIHRlcm1UeXBlKSB7XG4gICAgICAgIGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgdmlldz1cIlNlcXVlbmNlRmVhdHVyZS5wcmltYXJ5SWRlbnRpZmllciBTZXF1ZW5jZUZlYXR1cmUuc3ltYm9sXCIgbG9uZ0Rlc2NyaXB0aW9uPVwiXCIgc29ydE9yZGVyPVwiU2VxdWVuY2VGZWF0dXJlLnN5bWJvbCBhc2NcIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCIGFuZCBDXCI+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm1cIiB0eXBlPVwiJHt0ZXJtVHlwZX1cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm0ucGFyZW50c1wiIHR5cGU9XCIke3Rlcm1UeXBlfVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9udG9sb2d5QW5ub3RhdGlvbnMub250b2xvZ3lUZXJtLnBhcmVudHNcIiBvcD1cIkxPT0tVUFwiIHZhbHVlPVwiJHtxcnlTdHJpbmd9XCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiQlwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub3JnYW5pc20udGF4b25JZFwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJDXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5zZXF1ZW5jZU9udG9sb2d5VGVybS5uYW1lXCIgb3A9XCIhPVwiIHZhbHVlPVwidHJhbnNnZW5lXCIvPlxuXHQgIDwvcXVlcnk+YFxuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAobm90IGN1cnJlbnRseSBpbiB1c2UuLi4pXG4gICAgZmVhdHVyZXNCeVBhdGh3YXlUZXJtIChxcnlTdHJpbmcpIHtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICB2aWV3PVwiUGF0aHdheS5nZW5lcy5wcmltYXJ5SWRlbnRpZmllciBQYXRod2F5LmdlbmVzLnN5bWJvbFwiIGxvbmdEZXNjcmlwdGlvbj1cIlwiIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEJcIj5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlBhdGh3YXlcIiBjb2RlPVwiQVwiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJQYXRod2F5LmdlbmVzLm9yZ2FuaXNtLnRheG9uSWRcIiBjb2RlPVwiQlwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdCAgPC9xdWVyeT5gO1xuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmZWF0dXJlc0J5SWQgICAgICAgIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeUxvb2t1cChxcnlTdHJpbmcpOyB9XG4gICAgZmVhdHVyZXNCeUZ1bmN0aW9uICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBcIkdPVGVybVwiKTsgfVxuICAgIC8vZmVhdHVyZXNCeVBhdGh3YXkgICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlQYXRod2F5VGVybShxcnlTdHJpbmcpOyB9XG4gICAgZmVhdHVyZXNCeVBoZW5vdHlwZSAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBcIk1QVGVybVwiKTsgfVxuICAgIGZlYXR1cmVzQnlEaXNlYXNlICAgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5T250b2xvZ3lUZXJtKHFyeVN0cmluZywgXCJET1Rlcm1cIik7IH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbn1cblxuZXhwb3J0IHsgQXV4RGF0YU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0F1eERhdGFNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSAnLi9TdG9yYWdlTWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB9IGZyb20gJy4vTGlzdEZvcm11bGFFdmFsdWF0b3InO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE1haW50YWlucyBuYW1lZCBsaXN0cyBvZiBJRHMuIExpc3RzIG1heSBiZSB0ZW1wb3JhcnksIGxhc3Rpbmcgb25seSBmb3IgdGhlIHNlc3Npb24sIG9yIHBlcm1hbmVudCxcbi8vIGxhc3RpbmcgdW50aWwgdGhlIHVzZXIgY2xlYXJzIHRoZSBicm93c2VyIGxvY2FsIHN0b3JhZ2UgYXJlYS5cbi8vXG4vLyBVc2VzIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSBhbmQgd2luZG93LmxvY2FsU3RvcmFnZSB0byBzYXZlIGxpc3RzXG4vLyB0ZW1wb3JhcmlseSBvciBwZXJtYW5lbnRseSwgcmVzcC4gIEZJWE1FOiBzaG91bGQgYmUgdXNpbmcgd2luZG93LmluZGV4ZWREQlxuLy9cbmNsYXNzIExpc3RNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLm5hbWUybGlzdCA9IG51bGw7XG5cdHRoaXMuX2xpc3RzID0gbmV3IExvY2FsU3RvcmFnZU1hbmFnZXIgIChcImxpc3RNYW5hZ2VyLmxpc3RzXCIpXG5cdHRoaXMuZm9ybXVsYUV2YWwgPSBuZXcgTGlzdEZvcm11bGFFdmFsdWF0b3IodGhpcyk7XG5cdHRoaXMuX2xvYWQoKTtcblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuXHQvLyBCdXR0b246IHNob3cvaGlkZSB3YXJuaW5nIG1lc3NhZ2Vcblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbi53YXJuaW5nJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IHcgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cIm1lc3NhZ2VcIl0nKTtcblx0XHR3LmNsYXNzZWQoJ3Nob3dpbmcnLCAhdy5jbGFzc2VkKCdzaG93aW5nJykpO1xuXHQgICAgfSk7XG5cdC8vIEJ1dHRvbjogY3JlYXRlIGxpc3QgZnJvbSBjdXJyZW50IHNlbGVjdGlvblxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJuZXdmcm9tc2VsZWN0aW9uXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgaWRzID0gT2JqZWN0LmtleXModGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0cyk7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdFx0aWYgKGlkcy5sZW5ndGggPT09IDApIHtcblx0XHQgICAgYWxlcnQoXCJOb3RoaW5nIHNlbGVjdGVkLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbmV3bGlzdCA9IHRoaXMuY3JlYXRlTGlzdChcInNlbGVjdGlvblwiLCBpZHMpO1xuXHRcdHRoaXMudXBkYXRlKG5ld2xpc3QpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBjb21iaW5lIGxpc3RzOiBvcGVuIGxpc3QgZWRpdG9yIHdpdGggZm9ybXVsYSBlZGl0b3Igb3BlblxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJjb21iaW5lXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAodGhpcy5nZXROYW1lcygpLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vIGxpc3RzLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbGUgPSB0aGlzLmFwcC5saXN0RWRpdG9yO1xuXHRcdGxlLm9wZW4oKTtcblx0XHRsZS5vcGVuRm9ybXVsYUVkaXRvcigpO1xuXHQgICAgfSk7XG5cdC8vIEJ1dHRvbjogZGVsZXRlIGFsbCBsaXN0cyAoZ2V0IGNvbmZpcm1hdGlvbiBmaXJzdCkuXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cInB1cmdlXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAodGhpcy5nZXROYW1lcygpLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vIGxpc3RzLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0ICAgICAgICBpZiAod2luZG93LmNvbmZpcm0oXCJEZWxldGUgYWxsIGxpc3RzLiBBcmUgeW91IHN1cmU/XCIpKSB7XG5cdFx0ICAgIHRoaXMucHVyZ2UoKTtcblx0XHQgICAgdGhpcy51cGRhdGUoKTtcblx0XHR9XG5cdCAgICB9KTtcbiAgICB9XG4gICAgX2xvYWQgKCkge1xuXHR0aGlzLm5hbWUybGlzdCA9IHRoaXMuX2xpc3RzLmdldChcImFsbFwiKTtcblx0aWYgKCF0aGlzLm5hbWUybGlzdCl7XG5cdCAgICB0aGlzLm5hbWUybGlzdCA9IHt9O1xuXHQgICAgdGhpcy5fc2F2ZSgpO1xuXHR9XG4gICAgfVxuICAgIF9zYXZlICgpIHtcbiAgICAgICAgdGhpcy5fbGlzdHMucHV0KFwiYWxsXCIsIHRoaXMubmFtZTJsaXN0KTtcbiAgICB9XG4gICAgLy9cbiAgICAvLyByZXR1cm5zIHRoZSBuYW1lcyBvZiBhbGwgdGhlIGxpc3RzLCBzb3J0ZWRcbiAgICBnZXROYW1lcyAoKSB7XG4gICAgICAgIGxldCBubXMgPSBPYmplY3Qua2V5cyh0aGlzLm5hbWUybGlzdCk7XG5cdG5tcy5zb3J0KCk7XG5cdHJldHVybiBubXM7XG4gICAgfVxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZmYgYSBsaXN0IGV4aXN0cyB3aXRoIHRoaXMgbmFtZVxuICAgIGhhcyAobmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZSBpbiB0aGlzLm5hbWUybGlzdDtcbiAgICB9XG4gICAgLy8gSWYgbm8gbGlzdCB3aXRoIHRoZSBnaXZlbiBuYW1lIGV4aXN0cywgcmV0dXJuIHRoZSBuYW1lLlxuICAgIC8vIE90aGVyd2lzZSwgcmV0dXJuIGEgbW9kaWZpZWQgdmVyc2lvbiBvZiBuYW1lIHRoYXQgaXMgdW5pcXVlLlxuICAgIC8vIFVuaXF1ZSBuYW1lcyBhcmUgY3JlYXRlZCBieSBhcHBlbmRpbmcgYSBjb3VudGVyLlxuICAgIC8vIEUuZy4sIHVuaXF1aWZ5KFwiZm9vXCIpIC0+IFwiZm9vLjFcIiBvciBcImZvby4yXCIgb3Igd2hhdGV2ZXIuXG4gICAgLy9cbiAgICB1bmlxdWlmeSAobmFtZSkge1xuXHRpZiAoIXRoaXMuaGFzKG5hbWUpKSBcblx0ICAgIHJldHVybiBuYW1lO1xuXHRmb3IgKGxldCBpID0gMTsgOyBpICs9IDEpIHtcblx0ICAgIGxldCBubiA9IGAke25hbWV9LiR7aX1gO1xuXHQgICAgaWYgKCF0aGlzLmhhcyhubikpXG5cdCAgICAgICAgcmV0dXJuIG5uO1xuXHR9XG4gICAgfVxuICAgIC8vIHJldHVybnMgdGhlIGxpc3Qgd2l0aCB0aGlzIG5hbWUsIG9yIG51bGwgaWYgbm8gc3VjaCBsaXN0XG4gICAgZ2V0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLm5hbWUybGlzdFtuYW1lXTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIHJldHVybnMgYWxsIHRoZSBsaXN0cywgc29ydGVkIGJ5IG5hbWVcbiAgICBnZXRBbGwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXROYW1lcygpLm1hcChuID0+IHRoaXMuZ2V0KG4pKVxuICAgIH1cbiAgICAvLyBcbiAgICBjcmVhdGVPclVwZGF0ZSAobmFtZSwgaWRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMudXBkYXRlTGlzdChuYW1lLG51bGwsaWRzKSA6IHRoaXMuY3JlYXRlTGlzdChuYW1lLCBpZHMpO1xuICAgIH1cbiAgICAvLyBjcmVhdGVzIGEgbmV3IGxpc3Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgaWRzLlxuICAgIGNyZWF0ZUxpc3QgKG5hbWUsIGlkcywgZm9ybXVsYSkge1xuXHRpZiAobmFtZSAhPT0gXCJfXCIpXG5cdCAgICBuYW1lID0gdGhpcy51bmlxdWlmeShuYW1lKTtcblx0Ly9cblx0bGV0IGR0ID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMubmFtZTJsaXN0W25hbWVdID0ge1xuXHQgICAgbmFtZTogICAgIG5hbWUsXG5cdCAgICBpZHM6ICAgICAgaWRzLFxuXHQgICAgZm9ybXVsYTogIGZvcm11bGEgfHwgXCJcIixcblx0ICAgIGNyZWF0ZWQ6ICBkdCxcblx0ICAgIG1vZGlmaWVkOiBkdFxuXHR9O1xuXHR0aGlzLl9zYXZlKCk7XG5cdHJldHVybiB0aGlzLm5hbWUybGlzdFtuYW1lXTtcbiAgICB9XG4gICAgLy8gUHJvdmlkZSBhY2Nlc3MgdG8gZXZhbHVhdGlvbiBzZXJ2aWNlXG4gICAgZXZhbEZvcm11bGEgKGV4cHIpIHtcblx0cmV0dXJuIHRoaXMuZm9ybXVsYUV2YWwuZXZhbChleHByKTtcbiAgICB9XG4gICAgLy8gUmVmcmVzaGVzIGEgbGlzdCBhbmQgcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZWZyZXNoZWQgbGlzdC5cbiAgICAvLyBJZiB0aGUgbGlzdCBpZiBhIFBPTE8sIHByb21pc2UgcmVzb2x2ZXMgaW1tZWRpYXRlbHkgdG8gdGhlIGxpc3QuXG4gICAgLy8gT3RoZXJ3aXNlLCBzdGFydHMgYSByZWV2YWx1YXRpb24gb2YgdGhlIGZvcm11bGEgdGhhdCByZXNvbHZlcyBhZnRlciB0aGVcbiAgICAvLyBsaXN0J3MgaWRzIGhhdmUgYmVlbiB1cGRhdGVkLlxuICAgIC8vIElmIHRoZXJlIGlzIGFuIGVycm9yLCB0aGUgcmV0dXJuZWQgcHJvbWlzZSByZWplY3RzIHdpdGggdGhlIGVycm9yLlxuICAgIHJlZnJlc2hMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdGxzdC5tb2RpZmllZCA9IFwiXCIrbmV3IERhdGUoKTtcblx0aWYgKCFsc3QuZm9ybXVsYSlcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobHN0KTtcblx0ZWxzZSB7XG5cdCAgICBsZXQgcCA9IHRoaXMuZm9ybXVhbEV2YWwuZXZhbChsc3QuZm9ybXVsYSkudGhlbiggaWRzID0+IHtcblx0XHQgICAgbHN0LmlkcyA9IGlkcztcblx0XHQgICAgcmV0dXJuIGxzdDtcblx0XHR9KTtcblx0ICAgIHJldHVybiBwO1xuXHR9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlcyB0aGUgaWRzIGluIHRoZSBnaXZlbiBsaXN0XG4gICAgdXBkYXRlTGlzdCAobmFtZSwgbmV3bmFtZSwgbmV3aWRzLCBuZXdmb3JtdWxhKSB7XG5cdGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcbiAgICAgICAgaWYgKCEgbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuYW1lO1xuXHRpZiAobmV3bmFtZSkge1xuXHQgICAgZGVsZXRlIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXTtcblx0ICAgIGxzdC5uYW1lID0gdGhpcy51bmlxdWlmeShuZXduYW1lKTtcblx0ICAgIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXSA9IGxzdDtcblx0fVxuXHRpZiAobmV3aWRzKSBsc3QuaWRzICA9IG5ld2lkcztcblx0aWYgKG5ld2Zvcm11bGEgfHwgbmV3Zm9ybXVsYT09PVwiXCIpIGxzdC5mb3JtdWxhID0gbmV3Zm9ybXVsYTtcblx0bHN0Lm1vZGlmaWVkID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMuX3NhdmUoKTtcblx0cmV0dXJuIGxzdDtcbiAgICB9XG4gICAgLy8gZGVsZXRlcyB0aGUgc3BlY2lmaWVkIGxpc3RcbiAgICBkZWxldGVMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0ZGVsZXRlIHRoaXMubmFtZTJsaXN0W25hbWVdO1xuXHR0aGlzLl9zYXZlKCk7XG5cdC8vIEZJWE1FOiB1c2UgZXZlbnRzISFcblx0aWYgKGxzdCA9PT0gdGhpcy5hcHAuY3VycmVudExpc3QpIHRoaXMuYXBwLmN1cnJlbnRMaXN0ID0gbnVsbDtcblx0aWYgKGxzdCA9PT0gdGhpcy5hcHAubGlzdEVkaXRvci5saXN0KSB0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QgPSBudWxsO1xuXHRyZXR1cm4gbHN0O1xuICAgIH1cbiAgICAvLyBkZWxldGUgYWxsIGxpc3RzXG4gICAgcHVyZ2UgKCkge1xuICAgICAgICB0aGlzLm5hbWUybGlzdCA9IHt9XG5cdHRoaXMuX3NhdmUoKTtcblx0Ly9cblx0dGhpcy5hcHAuY3VycmVudExpc3QgPSBudWxsO1xuXHR0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QgPSBudWxsOyAvLyBGSVhNRSAtIHJlYWNoYWNyb3NzXG4gICAgfVxuICAgIC8vIFJldHVybnMgdHJ1ZSBpZmYgZXhwciBpcyB2YWxpZCwgd2hpY2ggbWVhbnMgaXQgaXMgYm90aCBzeW50YWN0aWNhbGx5IGNvcnJlY3QgXG4gICAgLy8gYW5kIGFsbCBtZW50aW9uZWQgbGlzdHMgZXhpc3QuXG4gICAgaXNWYWxpZCAoZXhwcikge1xuXHRyZXR1cm4gdGhpcy5mb3JtdWxhRXZhbC5pc1ZhbGlkKGV4cHIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIHRoZSBcIk15IGxpc3RzXCIgYm94IHdpdGggdGhlIGN1cnJlbnRseSBhdmFpbGFibGUgbGlzdHMuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgIG5ld2xpc3QgKExpc3QpIG9wdGlvbmFsLiBJZiBzcGVjaWZpZWQsIHdlIGp1c3QgY3JlYXRlZCB0aGF0IGxpc3QsIGFuZCBpdHMgbmFtZSBpc1xuICAgIC8vICAgXHRhIGdlbmVyYXRlZCBkZWZhdWx0LiBQbGFjZSBmb2N1cyB0aGVyZSBzbyB1c2VyIGNhbiB0eXBlIG5ldyBuYW1lLlxuICAgIHVwZGF0ZSAobmV3bGlzdCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBsaXN0cyA9IHRoaXMuZ2V0QWxsKCk7XG5cdGxldCBieU5hbWUgPSAoYSxiKSA9PiB7XG5cdCAgICBsZXQgYW4gPSBhLm5hbWUudG9Mb3dlckNhc2UoKTtcblx0ICAgIGxldCBibiA9IGIubmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgcmV0dXJuIChhbiA8IGJuID8gLTEgOiBhbiA+IGJuID8gKzEgOiAwKTtcblx0fTtcblx0bGV0IGJ5RGF0ZSA9IChhLGIpID0+ICgobmV3IERhdGUoYi5tb2RpZmllZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLm1vZGlmaWVkKSkuZ2V0VGltZSgpKTtcblx0bGlzdHMuc29ydChieU5hbWUpO1xuXHRsZXQgaXRlbXMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImxpc3RzXCJdJykuc2VsZWN0QWxsKFwiLmxpc3RJbmZvXCIpXG5cdCAgICAuZGF0YShsaXN0cyk7XG5cdGxldCBuZXdpdGVtcyA9IGl0ZW1zLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJsaXN0SW5mbyBmbGV4cm93XCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcImlcIikuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29ucyBidXR0b25cIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLFwiZWRpdFwiKVxuXHQgICAgLnRleHQoXCJtb2RlX2VkaXRcIilcblx0ICAgIC5hdHRyKFwidGl0bGVcIixcIkVkaXQgdGhpcyBsaXN0LlwiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJzcGFuXCIpLmF0dHIoXCJuYW1lXCIsXCJuYW1lXCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcInNpemVcIik7XG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcImRhdGVcIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwiaVwiKS5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zIGJ1dHRvblwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJkZWxldGVcIilcblx0ICAgIC50ZXh0KFwiaGlnaGxpZ2h0X29mZlwiKVxuXHQgICAgLmF0dHIoXCJ0aXRsZVwiLFwiRGVsZXRlIHRoaXMgbGlzdC5cIik7XG5cblx0aWYgKG5ld2l0ZW1zWzBdWzBdKSB7XG5cdCAgICBsZXQgbGFzdCA9IG5ld2l0ZW1zWzBdW25ld2l0ZW1zWzBdLmxlbmd0aC0xXTtcblx0ICAgIGxhc3Quc2Nyb2xsSW50b1ZpZXcoKTtcblx0fVxuXG5cdGl0ZW1zXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgbHN0PT5sc3QubmFtZSlcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChsc3QpIHtcblx0XHRpZiAoZDMuZXZlbnQuYWx0S2V5KSB7XG5cdFx0ICAgIGxldCBsZSA9IHNlbGYuYXBwLmxpc3RFZGl0b3I7IC8vIEZJWE1FIHJlYWNob3ZlclxuXHRcdCAgICBsZXQgcyA9IGxzdC5uYW1lO1xuXHRcdCAgICBsZXQgcmUgPSAvWyA9KCkrKi1dLztcblx0XHQgICAgaWYgKHMuc2VhcmNoKHJlKSA+PSAwKVxuXHRcdFx0cyA9ICdcIicgKyBzICsgJ1wiJztcblx0XHQgICAgaWYgKCFsZS5pc0VkaXRpbmdGb3JtdWxhKSB7XG5cdFx0ICAgICAgICBsZS5vcGVuKCk7XG5cdFx0XHRsZS5vcGVuRm9ybXVsYUVkaXRvcigpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vXG5cdFx0ICAgIGxlLmFkZFRvTGlzdEV4cHIocysnICcpO1xuXHRcdH1cblx0XHQvLyBvdGhlcndpc2UsIHNldCB0aGlzIGFzIHRoZSBjdXJyZW50IGxpc3Rcblx0XHRlbHNlIFxuXHRcdCAgICBzZWxmLmFwcC5jdXJyZW50TGlzdCA9IGxzdDsgLy8gRklYTUUgcmVhY2hvdmVyXG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJlZGl0XCJdJylcblx0ICAgIC8vIGVkaXQ6IGNsaWNrIFxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24obHN0KSB7XG5cdCAgICAgICAgc2VsZi5hcHAubGlzdEVkaXRvci5vcGVuKGxzdCk7XG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCdzcGFuW25hbWU9XCJuYW1lXCJdJylcblx0ICAgIC50ZXh0KGxzdCA9PiBsc3QubmFtZSk7XG5cdGl0ZW1zLnNlbGVjdCgnc3BhbltuYW1lPVwiZGF0ZVwiXScpLnRleHQobHN0ID0+IHtcblx0ICAgIGxldCBtZCA9IG5ldyBEYXRlKGxzdC5tb2RpZmllZCk7XG5cdCAgICBsZXQgZCA9IGAke21kLmdldEZ1bGxZZWFyKCl9LSR7bWQuZ2V0TW9udGgoKSsxfS0ke21kLmdldERhdGUoKX0gYCBcblx0ICAgICAgICAgICsgYDoke21kLmdldEhvdXJzKCl9LiR7bWQuZ2V0TWludXRlcygpfS4ke21kLmdldFNlY29uZHMoKX1gO1xuXHQgICAgcmV0dXJuIGQ7XG5cdH0pO1xuXHRpdGVtcy5zZWxlY3QoJ3NwYW5bbmFtZT1cInNpemVcIl0nKS50ZXh0KGxzdCA9PiBsc3QuaWRzLmxlbmd0aCk7XG5cdGl0ZW1zLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZGVsZXRlXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsIGxzdCA9PiB7XG5cdCAgICAgICAgdGhpcy5kZWxldGVMaXN0KGxzdC5uYW1lKTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXG5cdFx0Ly8gTm90IHN1cmUgd2h5IHRoaXMgaXMgbmVjZXNzYXJ5IGhlcmUuIEJ1dCB3aXRob3V0IGl0LCB0aGUgbGlzdCBpdGVtIGFmdGVyIHRoZSBvbmUgYmVpbmdcblx0XHQvLyBkZWxldGVkIGhlcmUgd2lsbCByZWNlaXZlIGEgY2xpY2sgZXZlbnQuXG5cdFx0ZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0Ly9cblx0ICAgIH0pO1xuXG5cdC8vXG5cdGl0ZW1zLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0aWYgKG5ld2xpc3QpIHtcblx0ICAgIGxldCBsc3RlbHQgPSBcblx0ICAgICAgICBkMy5zZWxlY3QoYCNteWxpc3RzIFtuYW1lPVwibGlzdHNcIl0gW25hbWU9XCIke25ld2xpc3QubmFtZX1cIl1gKVswXVswXTtcbiAgICAgICAgICAgIGxzdGVsdC5zY3JvbGxJbnRvVmlldyhmYWxzZSk7XG5cdH1cbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIExpc3RNYW5hZ2VyXG5cbmV4cG9ydCB7IExpc3RNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfSBmcm9tICcuL0xpc3RGb3JtdWxhUGFyc2VyJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBLbm93cyBob3cgdG8gcGFyc2UgYW5kIGV2YWx1YXRlIGEgbGlzdCBmb3JtdWxhIChha2EgbGlzdCBleHByZXNzaW9uKS5cbmNsYXNzIExpc3RGb3JtdWxhRXZhbHVhdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAobGlzdE1hbmFnZXIpIHtcblx0dGhpcy5saXN0TWFuYWdlciA9IGxpc3RNYW5hZ2VyO1xuICAgICAgICB0aGlzLnBhcnNlciA9IG5ldyBMaXN0Rm9ybXVsYVBhcnNlcigpO1xuICAgIH1cbiAgICAvLyBFdmFsdWF0ZXMgdGhlIGV4cHJlc3Npb24gYW5kIHJldHVybnMgYSBQcm9taXNlIGZvciB0aGUgbGlzdCBvZiBpZHMuXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gZXJyb3IsIHRoZSBwcm9taXNlIHJlamVjdHMgd2l0aCB0aGUgZXJyb3IgbWVzc2FnZS5cbiAgICBldmFsIChleHByKSB7XG5cdCByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICAgdHJ5IHtcblx0XHRsZXQgYXN0ID0gdGhpcy5wYXJzZXIucGFyc2UoZXhwcik7XG5cdFx0bGV0IGxtID0gdGhpcy5saXN0TWFuYWdlcjtcblx0XHRsZXQgcmVhY2ggPSAobikgPT4ge1xuXHRcdCAgICBpZiAodHlwZW9mKG4pID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdFx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG47XG5cdFx0XHRyZXR1cm4gbmV3IFNldChsc3QuaWRzKTtcblx0XHQgICAgfVxuXHRcdCAgICBlbHNlIHtcblx0XHRcdGxldCBsID0gcmVhY2gobi5sZWZ0KTtcblx0XHRcdGxldCByID0gcmVhY2gobi5yaWdodCk7XG5cdFx0XHRyZXR1cm4gbFtuLm9wXShyKTtcblx0XHQgICAgfVxuXHRcdH1cblx0XHRsZXQgaWRzID0gcmVhY2goYXN0KTtcblx0XHRyZXNvbHZlKEFycmF5LmZyb20oaWRzKSk7XG5cdCAgICB9XG5cdCAgICBjYXRjaCAoZSkge1xuXHRcdHJlamVjdChlKTtcblx0ICAgIH1cblx0IH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIC8vIENoZWNrcyB0aGUgY3VycmVudCBleHByZXNzaW9uIGZvciBzeW50YWN0aWMgYW5kIHNlbWFudGljIHZhbGlkaXR5IGFuZCBzZXRzIHRoZSBcbiAgICAvLyB2YWxpZC9pbnZhbGlkIGNsYXNzIGFjY29yZGluZ2x5LiBTZW1hbnRpYyB2YWxpZGl0eSBzaW1wbHkgbWVhbnMgYWxsIG5hbWVzIGluIHRoZVxuICAgIC8vIGV4cHJlc3Npb24gYXJlIGJvdW5kLlxuICAgIC8vXG4gICAgaXNWYWxpZCAgKGV4cHIpIHtcblx0dHJ5IHtcblx0ICAgIC8vIGZpcnN0IGNoZWNrIHN5bnRheFxuXHQgICAgbGV0IGFzdCA9IHRoaXMucGFyc2VyLnBhcnNlKGV4cHIpO1xuXHQgICAgbGV0IGxtICA9IHRoaXMubGlzdE1hbmFnZXI7IFxuXHQgICAgLy8gbm93IGNoZWNrIGxpc3QgbmFtZXNcblx0ICAgIChmdW5jdGlvbiByZWFjaChuKSB7XG5cdFx0aWYgKHR5cGVvZihuKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdCAgICBsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdCAgICBpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgblxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHQgICAgcmVhY2gobi5sZWZ0KTtcblx0XHQgICAgcmVhY2gobi5yaWdodCk7XG5cdFx0fVxuXHQgICAgfSkoYXN0KTtcblxuXHQgICAgLy8gVGh1bWJzIHVwIVxuXHQgICAgcmV0dXJuIHRydWU7XG5cdH1cblx0Y2F0Y2ggKGUpIHtcblx0ICAgIC8vIHN5bnRheCBlcnJvciBvciB1bmtub3duIGxpc3QgbmFtZVxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEZvcm11bGFFdmFsdWF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHNldENhcmV0UG9zaXRpb24sIG1vdmVDYXJldFBvc2l0aW9uLCBnZXRDYXJldFJhbmdlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9IGZyb20gJy4vTGlzdEZvcm11bGFQYXJzZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIExpc3RFZGl0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuXHRzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMucGFyc2VyID0gbmV3IExpc3RGb3JtdWxhUGFyc2VyKCk7XG5cdHRoaXMuZm9ybSA9IG51bGw7XG5cdHRoaXMuaW5pdERvbSgpO1xuXHR0aGlzLmlzRWRpdGluZ0Zvcm11bGEgPSBmYWxzZTtcblx0Ly9cblx0dGhpcy5saXN0ID0gbnVsbDtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0dGhpcy5mb3JtID0gdGhpcy5yb290LnNlbGVjdChcImZvcm1cIilbMF1bMF07XG5cdGlmICghdGhpcy5mb3JtKSB0aHJvdyBcIkNvdWxkIG5vdCBpbml0IExpc3RFZGl0b3IuIE5vIGZvcm0gZWxlbWVudC5cIjtcblx0ZDMuc2VsZWN0KHRoaXMuZm9ybSlcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgdCA9IGQzLmV2ZW50LnRhcmdldDtcblx0XHRpZiAoXCJidXR0b25cIiA9PT0gdC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpe1xuXHRcdCAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCAgICBsZXQgZiA9IHRoaXMuZm9ybTtcblx0XHQgICAgbGV0IHMgPSBmLmlkcy52YWx1ZS5yZXBsYWNlKC9bLHxdL2csICcgJykudHJpbSgpO1xuXHRcdCAgICBsZXQgaWRzID0gcyA/IHMuc3BsaXQoL1xccysvKSA6IFtdO1xuXHRcdCAgICAvLyBzYXZlIGxpc3Rcblx0XHQgICAgaWYgKHQubmFtZSA9PT0gXCJzYXZlXCIpIHtcblx0XHRcdGlmICghdGhpcy5saXN0KSByZXR1cm47XG5cdFx0XHR0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGVMaXN0KHRoaXMubGlzdC5uYW1lLCBmLm5hbWUudmFsdWUsIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNyZWF0ZSBuZXcgbGlzdFxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwibmV3XCIpIHtcblx0XHRcdGxldCBuID0gZi5uYW1lLnZhbHVlLnRyaW0oKTtcblx0XHRcdGlmICghbikge1xuXHRcdFx0ICAgYWxlcnQoXCJZb3VyIGxpc3QgaGFzIG5vIG5hbWUgYW5kIGlzIHZlcnkgc2FkLiBQbGVhc2UgZ2l2ZSBpdCBhIG5hbWUgYW5kIHRyeSBhZ2Fpbi5cIik7XG5cdFx0XHQgICByZXR1cm5cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKG4uaW5kZXhPZignXCInKSA+PSAwKSB7XG5cdFx0XHQgICBhbGVydChcIk9oIGRlYXIsIHlvdXIgbGlzdCdzIG5hbWUgaGFzIGEgZG91YmxlIHF1b3RlIGNoYXJhY3RlciwgYW5kIEknbSBhZmFyYWlkIHRoYXQncyBub3QgYWxsb3dlZC4gUGxlYXNlIHJlbW92ZSB0aGUgJ1xcXCInIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdFx0ICAgcmV0dXJuXG5cdFx0XHR9XG5cdFx0ICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5jcmVhdGVMaXN0KG4sIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNsZWFyIGZvcm1cblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcImNsZWFyXCIpIHtcblx0XHQgICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG5cdFx0ICAgIH1cblx0XHQgICAgLy8gZm9yd2FyZCB0byBNR0lcblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcInRvTWdpXCIpIHtcblx0XHQgICAgICAgIGxldCBmcm0gPSBkMy5zZWxlY3QoJyNtZ2liYXRjaGZvcm0nKVswXVswXTtcblx0XHRcdGZybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIiBcIik7XG5cdFx0XHRmcm0uc3VibWl0KClcblx0XHQgICAgfVxuXHRcdCAgICAvLyBmb3J3YXJkIHRvIE1vdXNlTWluZVxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwidG9Nb3VzZU1pbmVcIikge1xuXHRcdCAgICAgICAgbGV0IGZybSA9IGQzLnNlbGVjdCgnI21vdXNlbWluZWZvcm0nKVswXVswXTtcblx0XHRcdGZybS5leHRlcm5hbGlkcy52YWx1ZSA9IGlkcy5qb2luKFwiLFwiKTtcblx0XHRcdGZybS5zdWJtaXQoKVxuXHRcdCAgICB9XG5cdFx0fVxuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBzaG93L2hpZGUgZm9ybXVsYSBlZGl0b3Jcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNlY3Rpb25cIl0gLmJ1dHRvbltuYW1lPVwiZWRpdGZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGVGb3JtdWxhRWRpdG9yKCkpO1xuXHQgICAgXG5cdC8vIElucHV0IGJveDogZm9ybXVsYTogdmFsaWRhdGUgb24gYW55IGlucHV0XG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIHRoaXMudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBGb3J3YXJkIC0+IE1HSS9Nb3VzZU1pbmU6IGRpc2FibGUgYnV0dG9ucyBpZiBubyBpZHNcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIGxldCBlbXB0eSA9IHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMDtcblx0XHR0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0aGlzLmZvcm0udG9Nb3VzZU1pbmUuZGlzYWJsZWQgPSBlbXB0eTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbnM6IHRoZSBsaXN0IG9wZXJhdG9yIGJ1dHRvbnMgKHVuaW9uLCBpbnRlcnNlY3Rpb24sIGV0Yy4pXG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uLmxpc3RvcCcpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gYWRkIG15IHN5bWJvbCB0byB0aGUgZm9ybXVsYVxuXHRcdGxldCBpbmVsdCA9IHNlbGYuZm9ybS5mb3JtdWxhO1xuXHRcdGxldCBvcCA9IGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwibmFtZVwiKTtcblx0XHRzZWxmLmFkZFRvTGlzdEV4cHIob3ApO1xuXHRcdHNlbGYudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IHJlZnJlc2ggYnV0dG9uIGZvciBydW5uaW5nIHRoZSBmb3JtdWxhXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uW25hbWU9XCJyZWZyZXNoXCJdJylcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgZW1lc3NhZ2U9XCJJJ20gdGVycmlibHkgc29ycnksIGJ1dCB0aGVyZSBhcHBlYXJzIHRvIGJlIGEgcHJvYmxlbSB3aXRoIHlvdXIgbGlzdCBleHByZXNzaW9uOiBcIjtcblx0XHRsZXQgZm9ybXVsYSA9IHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlLnRyaW0oKTtcblx0XHRpZiAoZm9ybXVsYS5sZW5ndGggPT09IDApXG5cdFx0ICAgIHJldHVybjtcblx0ICAgICAgICB0aGlzLmFwcC5saXN0TWFuYWdlclxuXHRcdCAgICAuZXZhbEZvcm11bGEoZm9ybXVsYSlcblx0XHQgICAgLnRoZW4oaWRzID0+IHtcblx0XHQgICAgICAgIHRoaXMuZm9ybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIlxcblwiKTtcblx0XHQgICAgIH0pXG5cdFx0ICAgIC5jYXRjaChlID0+IGFsZXJ0KGVtZXNzYWdlICsgZSkpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBjbG9zZSBmb3JtdWxhIGVkaXRvclxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gLmJ1dHRvbltuYW1lPVwiY2xvc2VcIl0nKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5jbG9zZUZvcm11bGFFZGl0b3IoKSApO1xuXHRcblx0Ly8gQ2xpY2tpbmcgdGhlIGJveCBjb2xsYXBzZSBidXR0b24gc2hvdWxkIGNsZWFyIHRoZSBmb3JtXG5cdHRoaXMucm9vdC5zZWxlY3QoXCIuYnV0dG9uLmNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5leHRyYVwiLCAoKSA9PiB7XG5cdCAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0XHR0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpO1xuXHQgICAgfSk7XG4gICAgfVxuICAgIHBhcnNlSWRzIChzKSB7XG5cdHJldHVybiBzLnJlcGxhY2UoL1ssfF0vZywgJyAnKS50cmltKCkuc3BsaXQoL1xccysvKTtcbiAgICB9XG4gICAgZ2V0IGxpc3QgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdDtcbiAgICB9XG4gICAgc2V0IGxpc3QgKGxzdCkge1xuICAgICAgICB0aGlzLl9saXN0ID0gbHN0O1xuXHR0aGlzLl9zeW5jRGlzcGxheSgpO1xuICAgIH1cbiAgICBfc3luY0Rpc3BsYXkgKCkge1xuXHRsZXQgbHN0ID0gdGhpcy5fbGlzdDtcblx0aWYgKCFsc3QpIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0ubW9kaWZpZWQudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uc2F2ZS5kaXNhYmxlZCA9IHRydWU7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkID0gdHJ1ZTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gbHN0Lm5hbWU7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gbHN0Lmlkcy5qb2luKCdcXG4nKTtcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gbHN0LmZvcm11bGEgfHwgXCJcIjtcblx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZS50cmltKCkubGVuZ3RoID4gMDtcblx0ICAgIHRoaXMuZm9ybS5tb2RpZmllZC52YWx1ZSA9IGxzdC5tb2RpZmllZDtcblx0ICAgIHRoaXMuZm9ybS5zYXZlLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgXG5cdCAgICAgID0gdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkIFxuXHQgICAgICAgID0gKHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMCk7XG5cdH1cblx0dGhpcy52YWxpZGF0ZUV4cHIoKTtcbiAgICB9XG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuICAgIH1cbiAgICBvcGVuIChsc3QpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbHN0O1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiLCBmYWxzZSk7XG4gICAgfVxuICAgIGNsb3NlICgpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIiwgdHJ1ZSk7XG4gICAgfVxuICAgIG9wZW5Gb3JtdWxhRWRpdG9yICgpIHtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJlZGl0aW5nZm9ybXVsYVwiLCB0cnVlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gdHJ1ZTtcblx0bGV0IGYgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZTtcblx0dGhpcy5mb3JtLmZvcm11bGEuZm9jdXMoKTtcblx0c2V0Q2FyZXRQb3NpdGlvbih0aGlzLmZvcm0uZm9ybXVsYSwgZi5sZW5ndGgpO1xuICAgIH1cbiAgICBjbG9zZUZvcm11bGFFZGl0b3IgKCkge1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImVkaXRpbmdmb3JtdWxhXCIsIGZhbHNlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gZmFsc2U7XG4gICAgfVxuICAgIHRvZ2dsZUZvcm11bGFFZGl0b3IgKCkge1xuXHRsZXQgc2hvd2luZyA9IHRoaXMucm9vdC5jbGFzc2VkKFwiZWRpdGluZ2Zvcm11bGFcIik7XG5cdHNob3dpbmcgPyB0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpIDogdGhpcy5vcGVuRm9ybXVsYUVkaXRvcigpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDaGVja3MgdGhlIGN1cnJlbnQgZXhwcmVzc2lvbiBhbmQgc2V0cyB0aGUgdmFsaWQvaW52YWxpZCBjbGFzcy5cbiAgICB2YWxpZGF0ZUV4cHIgICgpIHtcblx0bGV0IGlucCA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKTtcblx0bGV0IGV4cHIgPSBpbnBbMF1bMF0udmFsdWUudHJpbSgpO1xuXHRpZiAoIWV4cHIpIHtcblx0ICAgIGlucC5jbGFzc2VkKFwidmFsaWRcIixmYWxzZSkuY2xhc3NlZChcImludmFsaWRcIixmYWxzZSk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IGZhbHNlO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgbGV0IGlzVmFsaWQgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5pc1ZhbGlkKGV4cHIpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHQgICAgaW5wLmNsYXNzZWQoXCJ2YWxpZFwiLCBpc1ZhbGlkKS5jbGFzc2VkKFwiaW52YWxpZFwiLCAhaXNWYWxpZCk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IHRydWU7XG5cdH1cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYWRkVG9MaXN0RXhwciAodGV4dCkge1xuXHRsZXQgaW5wID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIFtuYW1lPVwiZm9ybXVsYVwiXScpO1xuXHRsZXQgaWVsdCA9IGlucFswXVswXTtcblx0bGV0IHYgPSBpZWx0LnZhbHVlO1xuXHRsZXQgc3BsaWNlID0gZnVuY3Rpb24gKGUsdCl7XG5cdCAgICBsZXQgdiA9IGUudmFsdWU7XG5cdCAgICBsZXQgciA9IGdldENhcmV0UmFuZ2UoZSk7XG5cdCAgICBlLnZhbHVlID0gdi5zbGljZSgwLHJbMF0pICsgdCArIHYuc2xpY2UoclsxXSk7XG5cdCAgICBzZXRDYXJldFBvc2l0aW9uKGUsIHJbMF0rdC5sZW5ndGgpO1xuXHQgICAgZS5mb2N1cygpO1xuXHR9XG5cdGxldCByYW5nZSA9IGdldENhcmV0UmFuZ2UoaWVsdCk7XG5cdGlmIChyYW5nZVswXSA9PT0gcmFuZ2VbMV0pIHtcblx0ICAgIC8vIG5vIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dCk7XG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKSBcblx0XHRtb3ZlQ2FyZXRQb3NpdGlvbihpZWx0LCAtMSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICAvLyB0aGVyZSBpcyBhIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKVxuXHRcdC8vIHN1cnJvdW5kIGN1cnJlbnQgc2VsZWN0aW9uIHdpdGggcGFyZW5zLCB0aGVuIG1vdmUgY2FyZXQgYWZ0ZXJcblx0XHR0ZXh0ID0gJygnICsgdi5zbGljZShyYW5nZVswXSxyYW5nZVsxXSkgKyAnKSc7XG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dClcblx0fVxuXHR0aGlzLnZhbGlkYXRlRXhwcigpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIExpc3RFZGl0b3JcblxuZXhwb3J0IHsgTGlzdEVkaXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEVkaXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTG9jYWxTdG9yYWdlTWFuYWdlciB9IGZyb20gJy4vU3RvcmFnZU1hbmFnZXInO1xuXG5jb25zdCBNR1JfTkFNRSA9IFwicHJlZnNNYW5hZ2VyXCI7XG5jb25zdCBJVEVNX05BTUU9IFwidXNlclByZWZzXCI7XG5cbmNsYXNzIFVzZXJQcmVmc01hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZU1hbmFnZXIoTUdSX05BTUUpO1xuXHR0aGlzLmRhdGEgPSBudWxsO1xuXHR0aGlzLl9sb2FkKCk7XG4gICAgfVxuICAgIF9sb2FkICgpIHtcblx0dGhpcy5kYXRhID0gdGhpcy5zdG9yYWdlLmdldChJVEVNX05BTUUpO1xuXHRpZiAoIXRoaXMuZGF0YSl7XG5cdCAgICB0aGlzLmRhdGEgPSB7fTtcblx0ICAgIHRoaXMuX3NhdmUoKTtcblx0fVxuICAgIH1cbiAgICBfc2F2ZSAoKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5wdXQoSVRFTV9OQU1FLCB0aGlzLmRhdGEpO1xuICAgIH1cbiAgICBoYXMgKG4pIHtcbiAgICB9XG4gICAgZ2V0IChuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbbl07XG4gICAgfVxuICAgIGdldEFsbCAoKSB7XG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRhdGEpXG4gICAgfVxuICAgIHNldCAobiwgdikge1xuICAgICAgICB0aGlzLmRhdGFbbl0gPSB2O1xuXHR0aGlzLl9zYXZlKCk7XG4gICAgfVxuICAgIHNldEFsbCAodikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuZGF0YSwgdik7XG5cdHRoaXMuX3NhdmUoKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IFVzZXJQcmVmc01hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1VzZXJQcmVmc01hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEZhY2V0IH0gZnJvbSAnLi9GYWNldCc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgRmFjZXRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwKSB7XG5cdHRoaXMuYXBwID0gYXBwO1xuXHR0aGlzLmZhY2V0cyA9IFtdO1xuXHR0aGlzLm5hbWUyZmFjZXQgPSB7fVxuICAgIH1cbiAgICBhZGRGYWNldCAobmFtZSwgdmFsdWVGY24pIHtcblx0aWYgKHRoaXMubmFtZTJmYWNldFtuYW1lXSkgdGhyb3cgXCJEdXBsaWNhdGUgZmFjZXQgbmFtZS4gXCIgKyBuYW1lO1xuXHRsZXQgZmFjZXQgPSBuZXcgRmFjZXQobmFtZSwgdGhpcywgdmFsdWVGY24pO1xuICAgICAgICB0aGlzLmZhY2V0cy5wdXNoKCBmYWNldCApO1xuXHR0aGlzLm5hbWUyZmFjZXRbbmFtZV0gPSBmYWNldDtcblx0cmV0dXJuIGZhY2V0XG4gICAgfVxuICAgIHRlc3QgKGYpIHtcbiAgICAgICAgbGV0IHZhbHMgPSB0aGlzLmZhY2V0cy5tYXAoIGZhY2V0ID0+IGZhY2V0LnRlc3QoZikgKTtcblx0cmV0dXJuIHZhbHMucmVkdWNlKChhY2N1bSwgdmFsKSA9PiBhY2N1bSAmJiB2YWwsIHRydWUpO1xuICAgIH1cbiAgICBhcHBseUFsbCAoKSB7XG5cdGxldCBzaG93ID0gbnVsbDtcblx0bGV0IGhpZGUgPSBcIm5vbmVcIjtcblx0Ly8gRklYTUU6IG1ham9yIHJlYWNob3ZlclxuXHR0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcImcuc3RyaXBzXCIpLnNlbGVjdEFsbCgncmVjdC5mZWF0dXJlJylcblx0ICAgIC5zdHlsZShcImRpc3BsYXlcIiwgZiA9PiB0aGlzLnRlc3QoZikgPyBzaG93IDogaGlkZSk7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgRmFjZXRNYW5hZ2VyXG5cbmV4cG9ydCB7IEZhY2V0TWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmFjZXRNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIEZhY2V0IHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSwgbWFuYWdlciwgdmFsdWVGY24pIHtcblx0dGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcblx0dGhpcy52YWx1ZXMgPSBbXTtcblx0dGhpcy52YWx1ZUZjbiA9IHZhbHVlRmNuO1xuICAgIH1cbiAgICBzZXRWYWx1ZXMgKHZhbHVlcywgcXVpZXRseSkge1xuICAgICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcblx0aWYgKCEgcXVpZXRseSkge1xuXHQgICAgdGhpcy5tYW5hZ2VyLmFwcGx5QWxsKCk7XG5cdCAgICB0aGlzLm1hbmFnZXIuYXBwLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9XG4gICAgfVxuICAgIHRlc3QgKGYpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLnZhbHVlcyB8fCB0aGlzLnZhbHVlcy5sZW5ndGggPT09IDAgfHwgdGhpcy52YWx1ZXMuaW5kZXhPZiggdGhpcy52YWx1ZUZjbihmKSApID49IDA7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgRmFjZXRcblxuZXhwb3J0IHsgRmFjZXQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZhY2V0LmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBkM3RzdiB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQmxvY2tUcmFuc2xhdG9yIH0gZnJvbSAnLi9CbG9ja1RyYW5zbGF0b3InO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEJsb2NrVHJhbnNsYXRvciBtYW5hZ2VyIGNsYXNzLiBGb3IgYW55IGdpdmVuIHBhaXIgb2YgZ2Vub21lcywgQSBhbmQgQiwgbG9hZHMgdGhlIHNpbmdsZSBibG9jayBmaWxlXG4vLyBmb3IgdHJhbnNsYXRpbmcgYmV0d2VlbiB0aGVtLCBhbmQgaW5kZXhlcyBpdCBcImZyb20gYm90aCBkaXJlY3Rpb25zXCI6XG4vLyBcdEEtPkItPiBbQUJfQmxvY2tGaWxlXSA8LUE8LUJcbi8vXG5jbGFzcyBCVE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG5cdHRoaXMucmNCbG9ja3MgPSB7fTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZWdpc3RlckJsb2NrcyAodXJsLCBhR2Vub21lLCBiR2Vub21lLCBibG9ja3MpIHtcblx0bGV0IGFuYW1lID0gYUdlbm9tZS5uYW1lO1xuXHRsZXQgYm5hbWUgPSBiR2Vub21lLm5hbWU7XG5cdGxldCBibGtGaWxlID0gbmV3IEJsb2NrVHJhbnNsYXRvcih1cmwsYUdlbm9tZSxiR2Vub21lLGJsb2Nrcyk7XG5cdGlmKCAhIHRoaXMucmNCbG9ja3NbYW5hbWVdKSB0aGlzLnJjQmxvY2tzW2FuYW1lXSA9IHt9O1xuXHRpZiggISB0aGlzLnJjQmxvY2tzW2JuYW1lXSkgdGhpcy5yY0Jsb2Nrc1tibmFtZV0gPSB7fTtcblx0dGhpcy5yY0Jsb2Nrc1thbmFtZV1bYm5hbWVdID0gYmxrRmlsZTtcblx0dGhpcy5yY0Jsb2Nrc1tibmFtZV1bYW5hbWVdID0gYmxrRmlsZTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBMb2FkcyB0aGUgc3ludGVueSBibG9jayBmaWxlIGZvciBnZW5vbWVzIGFHZW5vbWUgYW5kIGJHZW5vbWUuXG4gICAgLy8gXG4gICAgZ2V0QmxvY2tGaWxlIChhR2Vub21lLCBiR2Vub21lKSB7XG5cdC8vIEJlIGEgbGl0dGxlIHNtYXJ0IGFib3V0IHRoZSBvcmRlciB3ZSB0cnkgdGhlIG5hbWVzLi4uXG5cdGlmIChiR2Vub21lLm5hbWUgPCBhR2Vub21lLm5hbWUpIHtcblx0ICAgIGxldCB0bXAgPSBhR2Vub21lOyBhR2Vub21lID0gYkdlbm9tZTsgYkdlbm9tZSA9IHRtcDtcblx0fVxuXHQvLyBGaXJzdCwgc2VlIGlmIHdlIGFscmVhZHkgaGF2ZSB0aGlzIHBhaXJcblx0bGV0IGFuYW1lID0gYUdlbm9tZS5uYW1lO1xuXHRsZXQgYm5hbWUgPSBiR2Vub21lLm5hbWU7XG5cdGxldCBiZiA9ICh0aGlzLnJjQmxvY2tzW2FuYW1lXSB8fCB7fSlbYm5hbWVdO1xuXHRpZiAoYmYpXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGJmKTtcblx0XG5cdC8vIEZvciBhbnkgZ2l2ZW4gZ2Vub21lIHBhaXIsIG9ubHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgdHdvIGZpbGVzXG5cdC8vIGlzIGdlbmVyYXRlZCBieSB0aGUgYmFjayBlbmRcblx0bGV0IGZuMSA9IGAuL2RhdGEvYmxvY2tmaWxlcy8ke2FHZW5vbWUubmFtZX0tJHtiR2Vub21lLm5hbWV9LnRzdmBcblx0bGV0IGZuMiA9IGAuL2RhdGEvYmxvY2tmaWxlcy8ke2JHZW5vbWUubmFtZX0tJHthR2Vub21lLm5hbWV9LnRzdmBcblx0Ly8gVGhlIGZpbGUgZm9yIEEtPkIgaXMgc2ltcGx5IGEgcmUtc29ydCBvZiB0aGUgZmlsZSBmcm9tIEItPkEuIFNvIHRoZSBcblx0Ly8gYmFjayBlbmQgb25seSBjcmVhdGVzIG9uZSBvZiB0aGVtLlxuXHQvLyBXZSdsbCB0cnkgb25lIGFuZCBpZiB0aGF0J3Mgbm90IGl0LCB0aGVuIHRyeSB0aGUgb3RoZXIuXG5cdC8vIChBbmQgaWYgVEhBVCdzIG5vdCBpdCwgdGhlbiBjcnkgYSByaXZlci4uLilcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRyZXR1cm4gZDN0c3YoZm4xKVxuXHQgIC50aGVuKGZ1bmN0aW9uKGJsb2Nrcyl7XG5cdCAgICAgIC8vIHl1cCwgaXQgd2FzIEEtQlxuXHQgICAgICBzZWxmLnJlZ2lzdGVyQmxvY2tzKGZuMSwgYUdlbm9tZSwgYkdlbm9tZSwgYmxvY2tzKTtcblx0ICAgICAgcmV0dXJuIGJsb2Nrc1xuXHQgIH0pXG5cdCAgLmNhdGNoKGZ1bmN0aW9uKGUpe1xuXHQgICAgICBjb25zb2xlLmxvZyhgSU5GTzogRGlzcmVnYXJkIHRoYXQgNDA0IG1lc3NhZ2UhICR7Zm4xfSB3YXMgbm90IGZvdW5kLiBUcnlpbmcgJHtmbjJ9LmApO1xuXHQgICAgICByZXR1cm4gZDN0c3YoZm4yKVxuXHRcdCAgLnRoZW4oZnVuY3Rpb24oYmxvY2tzKXtcblx0XHQgICAgICAvLyBub3BlLCBpdCB3YXMgQi1BXG5cdFx0ICAgICAgc2VsZi5yZWdpc3RlckJsb2NrcyhmbjIsIGJHZW5vbWUsIGFHZW5vbWUsIGJsb2Nrcyk7XG5cdFx0ICAgICAgcmV0dXJuIGJsb2Nrc1xuXHRcdCAgfSlcblx0XHQgIC5jYXRjaChmdW5jdGlvbihlKXtcblx0XHQgICAgICBjb25zb2xlLmxvZygnQnV0IFRIQVQgNDA0IG1lc3NhZ2UgaXMgYSBwcm9ibGVtLicpO1xuXHRcdCAgICAgIHRocm93IGBDYW5ub3QgZ2V0IGJsb2NrIGZpbGUgZm9yIHRoaXMgZ2Vub21lIHBhaXI6ICR7YUdlbm9tZS5uYW1lfSAke2JHZW5vbWUubmFtZX0uXFxuKEVycm9yPSR7ZX0pYDtcblx0XHQgIH0pO1xuXHQgIH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gdGhlIHRyYW5zbGF0b3IgaGFzIGxvYWRlZCBhbGwgdGhlIGRhdGEgbmVlZGVkXG4gICAgLy8gZm9yIHRyYW5zbGF0aW5nIGNvb3JkaW5hdGVzIGJldHdlZW4gdGhlIGN1cnJlbnQgcmVmIHN0cmFpbiBhbmQgdGhlIGN1cnJlbnQgY29tcGFyaXNvbiBzdHJhaW5zLlxuICAgIC8vXG4gICAgcmVhZHkgKCkge1xuXHRsZXQgcHJvbWlzZXMgPSB0aGlzLmFwcC5jR2Vub21lcy5tYXAoY2cgPT4gdGhpcy5nZXRCbG9ja0ZpbGUodGhpcy5hcHAuckdlbm9tZSwgY2cpKTtcblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIHN5bnRlbnkgYmxvY2tzIHRoYXQgbWFwIHRoZSBjdXJyZW50IHJlZiBnZW5vbWUgdG8gdGhlIHNwZWNpZmllZCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIGdldEJsb2NrcyAoZnJvbUdlbm9tZSwgdG9HZW5vbWUpIHtcbiAgICAgICAgbGV0IGJsa1RyYW5zID0gdGhpcy5yY0Jsb2Nrc1tmcm9tR2Vub21lLm5hbWVdW3RvR2Vub21lLm5hbWVdO1xuXHRyZXR1cm4gYmxrVHJhbnMuZ2V0QmxvY2tzKGZyb21HZW5vbWUpXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVHJhbnNsYXRlcyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSBzcGVjaWZpZWQgZnJvbUdlbm9tZSB0byB0aGUgc3BlY2lmaWVkIHRvR2Vub21lLlxuICAgIC8vIFJldHVybnMgYSBsaXN0IG9mIHplcm8gb3IgbW9yZSBjb29yZGluYXRlIHJhbmdlcyBpbiB0aGUgdG9HZW5vbWUuXG4gICAgLy9cbiAgICAvLyBGSVhNRSBpcyB0aGlzIGNvZGUgZXZlbiB1c2VkPyBsb29rcyBvdXQgb2YgcGxhY2UuIGNvcHkvcGFzdGUgZXJyb3I/XG4gICAgdHJhbnNsYXRlIChmcm9tR2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQsIHRvR2Vub21lKSB7XG5cdC8vIGdldCB0aGUgcmlnaHQgYmxvY2sgZmlsZVxuXHRsZXQgYmxrVHJhbnMgPSB0aGlzLnJjQmxvY2tzW2Zyb21HZW5vbWUubmFtZV1bdG9HZW5vbWUubmFtZV07XG5cdGlmICghYmxrVHJhbnMpIHRocm93IFwiSW50ZXJuYWwgZXJyb3IuIE5vIGJsb2NrIGZpbGUgZm91bmQgaW4gaW5kZXguXCJcblx0Ly8gdHJhbnNsYXRlIVxuXHRsZXQgcmFuZ2VzID0gYmxrVHJhbnMudHJhbnNsYXRlKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCk7XG5cdHJldHVybiByYW5nZXM7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgQlRNYW5hZ2VyXG5cbmV4cG9ydCB7IEJUTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQlRNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNvbWV0aGluZyB0aGF0IGtub3dzIGhvdyB0byB0cmFuc2xhdGUgY29vcmRpbmF0ZXMgYmV0d2VlbiB0d28gZ2Vub21lcy5cbi8vXG4vL1xuY2xhc3MgQmxvY2tUcmFuc2xhdG9yIHtcbiAgICBjb25zdHJ1Y3Rvcih1cmwsIGFHZW5vbWUsIGJHZW5vbWUsIGJsb2Nrcyl7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuXHR0aGlzLmFHZW5vbWUgPSBhR2Vub21lO1xuXHR0aGlzLmJHZW5vbWUgPSBiR2Vub21lO1xuXHR0aGlzLmJsb2NrcyA9IGJsb2Nrcy5tYXAoYiA9PiB0aGlzLnByb2Nlc3NCbG9jayhiKSlcblx0dGhpcy5jdXJyZW50U29ydCA9IFwiYVwiO1xuICAgIH1cbiAgICBwcm9jZXNzQmxvY2sgKGJsaykgeyBcbiAgICAgICAgYmxrLmFJbmRleCA9IHBhcnNlSW50KGJsay5hSW5kZXgpO1xuICAgICAgICBibGsuYkluZGV4ID0gcGFyc2VJbnQoYmxrLmJJbmRleCk7XG4gICAgICAgIGJsay5hU3RhcnQgPSBwYXJzZUludChibGsuYVN0YXJ0KTtcbiAgICAgICAgYmxrLmJTdGFydCA9IHBhcnNlSW50KGJsay5iU3RhcnQpO1xuICAgICAgICBibGsuYUVuZCAgID0gcGFyc2VJbnQoYmxrLmFFbmQpO1xuICAgICAgICBibGsuYkVuZCAgID0gcGFyc2VJbnQoYmxrLmJFbmQpO1xuICAgICAgICBibGsuYUxlbmd0aCAgID0gcGFyc2VJbnQoYmxrLmFMZW5ndGgpO1xuICAgICAgICBibGsuYkxlbmd0aCAgID0gcGFyc2VJbnQoYmxrLmJMZW5ndGgpO1xuICAgICAgICBibGsuYmxvY2tDb3VudCAgID0gcGFyc2VJbnQoYmxrLmJsb2NrQ291bnQpO1xuICAgICAgICBibGsuYmxvY2tSYXRpbyAgID0gcGFyc2VGbG9hdChibGsuYmxvY2tSYXRpbyk7XG5cdGJsay5hYk1hcCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdCAgICAuZG9tYWluKFtibGsuYVN0YXJ0LGJsay5hRW5kXSlcblx0ICAgIC5yYW5nZSggYmxrLmJsb2NrT3JpPT09XCItXCIgPyBbYmxrLmJFbmQsYmxrLmJTdGFydF0gOiBbYmxrLmJTdGFydCxibGsuYkVuZF0pO1xuXHRibGsuYmFNYXAgPSBibGsuYWJNYXAuaW52ZXJ0XG5cdHJldHVybiBibGs7XG4gICAgfVxuICAgIHNldFNvcnQgKHdoaWNoKSB7XG5cdGlmICh3aGljaCAhPT0gJ2EnICYmIHdoaWNoICE9PSAnYicpIHRocm93IFwiQmFkIGFyZ3VtZW50OlwiICsgd2hpY2g7XG5cdGxldCBzb3J0Q29sID0gd2hpY2ggKyBcIkluZGV4XCI7XG5cdGxldCBjbXAgPSAoeCx5KSA9PiB4W3NvcnRDb2xdIC0geVtzb3J0Q29sXTtcblx0dGhpcy5ibG9ja3Muc29ydChjbXApO1xuXHR0aGlzLmN1cnJTb3J0ID0gd2hpY2g7XG4gICAgfVxuICAgIGZsaXBTb3J0ICgpIHtcblx0dGhpcy5zZXRTb3J0KHRoaXMuY3VyclNvcnQgPT09IFwiYVwiID8gXCJiXCIgOiBcImFcIik7XG4gICAgfVxuICAgIC8vIEdpdmVuIGEgZ2Vub21lIChlaXRoZXIgdGhlIGEgb3IgYiBnZW5vbWUpIGFuZCBhIGNvb3JkaW5hdGUgcmFuZ2UsXG4gICAgLy8gcmV0dXJucyB0aGUgZXF1aXZhbGVudCBjb29yZGluYXRlIHJhbmdlKHMpIGluIHRoZSBvdGhlciBnZW5vbWVcbiAgICB0cmFuc2xhdGUgKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCkge1xuXHQvL1xuXHRlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHN0YXJ0IDogZW5kO1xuXHQvLyBmcm9tID0gXCJhXCIgb3IgXCJiXCIsIGRlcGVuZGluZyBvbiB3aGljaCBnZW5vbWUgaXMgZ2l2ZW4uXG4gICAgICAgIGxldCBmcm9tID0gKGZyb21HZW5vbWUgPT09IHRoaXMuYUdlbm9tZSA/IFwiYVwiIDogZnJvbUdlbm9tZSA9PT0gdGhpcy5iR2Vub21lID8gXCJiXCIgOiBudWxsKTtcblx0aWYgKCFmcm9tKSB0aHJvdyBcIkJhZCBhcmd1bWVudC4gR2Vub21lIG5laXRoZXIgQSBub3IgQi5cIjtcblx0Ly8gdG8gPSBcImJcIiBvciBcImFcIiwgb3Bwb3NpdGUgb2YgZnJvbVxuXHRsZXQgdG8gPSAoZnJvbSA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcblx0Ly8gbWFrZSBzdXJlIHRoZSBibG9ja3MgYXJlIHNvcnRlZCBieSB0aGUgZnJvbSBnZW5vbWVcblx0dGhpcy5zZXRTb3J0KGZyb20pO1xuXHQvL1xuXHRsZXQgZnJvbUMgPSBmcm9tK1wiQ2hyXCI7XG5cdGxldCBmcm9tUyA9IGZyb20rXCJTdGFydFwiO1xuXHRsZXQgZnJvbUUgPSBmcm9tK1wiRW5kXCI7XG5cdGxldCBmcm9tSSA9IGZyb20rXCJJbmRleFwiO1xuXHRsZXQgdG9DID0gdG8rXCJDaHJcIjtcblx0bGV0IHRvUyA9IHRvK1wiU3RhcnRcIjtcblx0bGV0IHRvRSA9IHRvK1wiRW5kXCI7XG5cdGxldCB0b0kgPSB0bytcIkluZGV4XCI7XG5cdGxldCBtYXBwZXIgPSBmcm9tK3RvK1wiTWFwXCI7XG5cdC8vIFxuXHRsZXQgYmxrcyA9IHRoaXMuYmxvY2tzXG5cdCAgICAvLyBGaXJzdCBmaWx0ZXIgZm9yIGJsb2NrcyB0aGF0IG92ZXJsYXAgdGhlIGdpdmVuIGNvb3JkaW5hdGUgcmFuZ2UgaW4gdGhlIGZyb20gZ2Vub21lXG5cdCAgICAuZmlsdGVyKGJsayA9PiBibGtbZnJvbUNdID09PSBjaHIgJiYgYmxrW2Zyb21TXSA8PSBlbmQgJiYgYmxrW2Zyb21FXSA+PSBzdGFydClcblx0ICAgIC8vIG1hcCBlYWNoIGJsb2NrLiBcblx0ICAgIC5tYXAoYmxrID0+IHtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgZnJvbSBzaWRlLlxuXHRcdGxldCBzID0gTWF0aC5tYXgoc3RhcnQsIGJsa1tmcm9tU10pO1xuXHRcdGxldCBlID0gTWF0aC5taW4oZW5kLCBibGtbZnJvbUVdKTtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgdG8gc2lkZS5cblx0XHRsZXQgczIgPSBNYXRoLmNlaWwoYmxrW21hcHBlcl0ocykpO1xuXHRcdGxldCBlMiA9IE1hdGguZmxvb3IoYmxrW21hcHBlcl0oZSkpO1xuXHQgICAgICAgIHJldHVybiB7XG5cdFx0ICAgIGNocjogICBibGtbdG9DXSxcblx0XHQgICAgc3RhcnQ6IE1hdGgubWluKHMyLGUyKSxcblx0XHQgICAgZW5kOiAgIE1hdGgubWF4KHMyLGUyKSxcblx0XHQgICAgb3JpOiAgIGJsay5ibG9ja09yaSxcblx0XHQgICAgaW5kZXg6IGJsa1t0b0ldLFxuXHRcdCAgICAvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZGluYXRlcyBjb3JyZXNwb25kaW5nIHRvIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0ICAgIGZDaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgZlN0YXJ0OiBzLFxuXHRcdCAgICBmRW5kOiAgIGUsXG5cdFx0ICAgIGZJbmRleDogYmxrW2Zyb21JXSxcblx0XHQgICAgLy8gaW5jbHVkZSB0aGUgYmxvY2sgaWQgYW5kIGZ1bGwgYmxvY2sgY29vcmRzXG5cdFx0ICAgIGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdCAgICBibG9ja1N0YXJ0OiBibGtbdG9TXSxcblx0XHQgICAgYmxvY2tFbmQ6IGJsa1t0b0VdXG5cdFx0fTtcblx0ICAgIH0pXG5cdC8vIFxuXHRyZXR1cm4gYmxrcztcbiAgICB9XG4gICAgLy8gR2l2ZW4gYSBnZW5vbWUgKGVpdGhlciB0aGUgYSBvciBiIGdlbm9tZSlcbiAgICAvLyByZXR1cm5zIHRoZSBibG9ja3MgZm9yIHRyYW5zbGF0aW5nIHRvIHRoZSBvdGhlciAoYiBvciBhKSBnZW5vbWUuXG4gICAgLy9cbiAgICBnZXRCbG9ja3MgKGZyb21HZW5vbWUpIHtcblx0Ly8gZnJvbSA9IFwiYVwiIG9yIFwiYlwiLCBkZXBlbmRpbmcgb24gd2hpY2ggZ2Vub21lIGlzIGdpdmVuLlxuICAgICAgICBsZXQgZnJvbSA9IChmcm9tR2Vub21lID09PSB0aGlzLmFHZW5vbWUgPyBcImFcIiA6IGZyb21HZW5vbWUgPT09IHRoaXMuYkdlbm9tZSA/IFwiYlwiIDogbnVsbCk7XG5cdGlmICghZnJvbSkgdGhyb3cgXCJCYWQgYXJndW1lbnQuIEdlbm9tZSBuZWl0aGVyIEEgbm9yIEIuXCI7XG5cdC8vIHRvID0gXCJiXCIgb3IgXCJhXCIsIG9wcG9zaXRlIG9mIGZyb21cblx0bGV0IHRvID0gKGZyb20gPT09IFwiYVwiID8gXCJiXCIgOiBcImFcIik7XG5cdC8vIG1ha2Ugc3VyZSB0aGUgYmxvY2tzIGFyZSBzb3J0ZWQgYnkgdGhlIGZyb20gZ2Vub21lXG5cdHRoaXMuc2V0U29ydChmcm9tKTtcblx0Ly9cblx0bGV0IGZyb21DID0gZnJvbStcIkNoclwiO1xuXHRsZXQgZnJvbVMgPSBmcm9tK1wiU3RhcnRcIjtcblx0bGV0IGZyb21FID0gZnJvbStcIkVuZFwiO1xuXHRsZXQgdG9DID0gdG8rXCJDaHJcIjtcblx0bGV0IHRvUyA9IHRvK1wiU3RhcnRcIjtcblx0bGV0IHRvRSA9IHRvK1wiRW5kXCI7XG5cdGxldCBtYXBwZXIgPSBmcm9tK3RvK1wiTWFwXCI7XG5cdC8vIFxuXHRsZXQgYmxrcyA9IHRoaXMuYmxvY2tzXG5cdCAgICAubWFwKGJsayA9PiB7XG5cdCAgICAgICAgcmV0dXJuIHtcblx0XHQgICAgYmxvY2tJZDogICBibGsuYmxvY2tJZCxcblx0XHQgICAgb3JpOiAgICAgICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGZyb21DaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgZnJvbVN0YXJ0OiBibGtbZnJvbVNdLFxuXHRcdCAgICBmcm9tRW5kOiAgIGJsa1tmcm9tRV0sXG5cdFx0ICAgIHRvQ2hyOiAgICAgYmxrW3RvQ10sXG5cdFx0ICAgIHRvU3RhcnQ6ICAgYmxrW3RvU10sXG5cdFx0ICAgIHRvRW5kOiAgICAgYmxrW3RvRV0sXG5cdFx0fTtcblx0ICAgIH0pXG5cdC8vIFxuXHRyZXR1cm4gYmxrcztcbiAgICB9XG59XG5cbmV4cG9ydCB7IEJsb2NrVHJhbnNsYXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQmxvY2tUcmFuc2xhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTVkdWaWV3IH0gZnJvbSAnLi9TVkdWaWV3JztcbmltcG9ydCB7IGNvb3Jkc0FmdGVyVHJhbnNmb3JtIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgR2Vub21lVmlldyBleHRlbmRzIFNWR1ZpZXcge1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCk7XG5cdHRoaXMub3BlbldpZHRoID0gdGhpcy5vdXRlcldpZHRoO1xuXHR0aGlzLm9wZW5IZWlnaHQ9IHRoaXMub3V0ZXJIZWlnaHQ7XG5cdHRoaXMudG90YWxDaHJXaWR0aCA9IDQwOyAvLyB0b3RhbCB3aWR0aCBvZiBvbmUgY2hyb21vc29tZSAoYmFja2JvbmUrYmxvY2tzK2ZlYXRzKVxuXHR0aGlzLmN3aWR0aCA9IDIwOyAgICAgICAgLy8gY2hyb21vc29tZSB3aWR0aFxuXHR0aGlzLnRpY2tMZW5ndGggPSAxMDtcdCAvLyBmZWF0dXJlIHRpY2sgbWFyayBsZW5ndGhcblx0dGhpcy5icnVzaENociA9IG51bGw7XHQgLy8gd2hpY2ggY2hyIGhhcyB0aGUgY3VycmVudCBicnVzaFxuXHR0aGlzLmJ3aWR0aCA9IHRoaXMuY3dpZHRoLzI7ICAvLyBibG9jayB3aWR0aFxuXHR0aGlzLmN1cnJCbG9ja3MgPSBudWxsO1xuXHR0aGlzLmN1cnJUaWNrcyA9IG51bGw7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzID0gdGhpcy5zdmdNYWluLmFwcGVuZCgnZycpLmF0dHIoXCJuYW1lXCIsIFwiY2hyb21vc29tZXNcIik7XG5cdHRoaXMudGl0bGUgICAgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCd0ZXh0JykuYXR0cihcImNsYXNzXCIsIFwidGl0bGVcIik7XG5cdHRoaXMuc2Nyb2xsQW1vdW50ID0gMDtcblx0Ly9cblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZpdFRvV2lkdGggKHcpe1xuICAgICAgICBzdXBlci5maXRUb1dpZHRoKHcpO1xuXHR0aGlzLm9wZW5XaWR0aCA9IHRoaXMub3V0ZXJXaWR0aDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdERvbSAoKSB7XG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b24uY2xvc2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHRoaXMucmVkcmF3KCkpO1xuXHR0aGlzLnN2Zy5vbihcIndoZWVsXCIsICgpID0+IHtcblx0ICAgIGlmICghdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIikpIHJldHVybjtcblx0ICAgIHRoaXMuc2Nyb2xsV2hlZWwoZDMuZXZlbnQuZGVsdGFZKVxuXHQgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fSk7XG5cdGxldCBzYnMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInN2Z2NvbnRhaW5lclwiXSA+IFtuYW1lPVwic2Nyb2xsYnV0dG9uc1wiXScpXG5cdHNicy5zZWxlY3QoJy5idXR0b25bbmFtZT1cInVwXCJdJykub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNjcm9sbENocm9tb3NvbWVzVXAoKSk7XG5cdHNicy5zZWxlY3QoJy5idXR0b25bbmFtZT1cImRuXCJdJykub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNjcm9sbENocm9tb3NvbWVzRG93bigpKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRCcnVzaENvb3JkcyAoY29vcmRzKSB7XG5cdHRoaXMuY2xlYXJCcnVzaGVzKCk7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdChgLmNocm9tb3NvbWVbbmFtZT1cIiR7Y29vcmRzLmNocn1cIl0gZ1tuYW1lPVwiYnJ1c2hcIl1gKVxuXHQgIC5lYWNoKGZ1bmN0aW9uKGNocil7XG5cdCAgICBjaHIuYnJ1c2guZXh0ZW50KFtjb29yZHMuc3RhcnQsY29vcmRzLmVuZF0pO1xuXHQgICAgY2hyLmJydXNoKGQzLnNlbGVjdCh0aGlzKSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBicnVzaHN0YXJ0IChjaHIpe1xuXHR0aGlzLmNsZWFyQnJ1c2hlcyhjaHIuYnJ1c2gpO1xuXHR0aGlzLmJydXNoQ2hyID0gY2hyO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJydXNoZW5kICgpe1xuXHRpZighdGhpcy5icnVzaENocikgcmV0dXJuO1xuXHR2YXIgeHRudCA9IHRoaXMuYnJ1c2hDaHIuYnJ1c2guZXh0ZW50KCk7XG5cdGlmIChNYXRoLmFicyh4dG50WzBdIC0geHRudFsxXSkgPD0gMTApe1xuXHQgICAgLy8gdXNlciBjbGlja2VkXG5cdCAgICBsZXQgY3h0ID0gdGhpcy5hcHAuZ2V0Q29udGV4dCgpXG5cdCAgICBsZXQgdyA9IGN4dC5lbmQgLSBjeHQuc3RhcnQgKyAxO1xuXHQgICAgeHRudFswXSAtPSB3LzI7XG5cdCAgICB4dG50WzFdICs9IHcvMjtcblx0fVxuXHRsZXQgY29vcmRzID0geyBjaHI6dGhpcy5icnVzaENoci5uYW1lLCBzdGFydDpNYXRoLmZsb29yKHh0bnRbMF0pLCBlbmQ6IE1hdGguZmxvb3IoeHRudFsxXSkgfTtcblx0dGhpcy5hcHAuc2V0Q29udGV4dChjb29yZHMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQnJ1c2hlcyAoZXhjZXB0KXtcblx0dGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKCdbbmFtZT1cImJydXNoXCJdJykuZWFjaChmdW5jdGlvbihjaHIpe1xuXHQgICAgaWYgKGNoci5icnVzaCAhPT0gZXhjZXB0KSB7XG5cdFx0Y2hyLmJydXNoLmNsZWFyKCk7XG5cdFx0Y2hyLmJydXNoKGQzLnNlbGVjdCh0aGlzKSk7XG5cdCAgICB9XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldFggKGNocikge1xuXHRsZXQgeCA9IHRoaXMuYXBwLnJHZW5vbWUueHNjYWxlKGNocik7XG5cdGlmIChpc05hTih4KSkgdGhyb3cgXCJ4IGlzIE5hTlwiXG5cdHJldHVybiB4O1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRZIChwb3MpIHtcblx0bGV0IHkgPSB0aGlzLmFwcC5yR2Vub21lLnlzY2FsZShwb3MpO1xuXHRpZiAoaXNOYU4oeSkpIHRocm93IFwieSBpcyBOYU5cIlxuXHRyZXR1cm4geTtcbiAgICB9XG4gICAgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVkcmF3ICgpIHtcbiAgICAgICAgdGhpcy5kcmF3KHRoaXMuY3VyclRpY2tzLCB0aGlzLmN1cnJCbG9ja3MpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRyYXcgKHRpY2tEYXRhLCBibG9ja0RhdGEpIHtcblx0dGhpcy5kcmF3Q2hyb21vc29tZXMoKTtcblx0dGhpcy5kcmF3QmxvY2tzKGJsb2NrRGF0YSk7XG5cdHRoaXMuZHJhd1RpY2tzKHRpY2tEYXRhKTtcblx0dGhpcy5kcmF3VGl0bGUoKTtcblx0dGhpcy5zZXRCcnVzaENvb3Jkcyh0aGlzLmFwcC5jb29yZHMpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSBjaHJvbW9zb21lcyBvZiB0aGUgcmVmZXJlbmNlIGdlbm9tZS5cbiAgICAvLyBJbmNsdWRlcyBiYWNrYm9uZXMsIGxhYmVscywgYW5kIGJydXNoZXMuXG4gICAgLy8gVGhlIGJhY2tib25lcyBhcmUgZHJhd24gYXMgdmVydGljYWwgbGluZSBzZW1lbnRzLFxuICAgIC8vIGRpc3RyaWJ1dGVkIGhvcml6b250YWxseS4gT3JkZXJpbmcgaXMgZGVmaW5lZCBieVxuICAgIC8vIHRoZSBtb2RlbCAoR2Vub21lIG9iamVjdCkuXG4gICAgLy8gTGFiZWxzIGFyZSBkcmF3biBhYm92ZSB0aGUgYmFja2JvbmVzLlxuICAgIC8vXG4gICAgLy8gTW9kaWZpY2F0aW9uOlxuICAgIC8vIERyYXdzIHRoZSBzY2VuZSBpbiBvbmUgb2YgdHdvIHN0YXRlczogb3BlbiBvciBjbG9zZWQuXG4gICAgLy8gVGhlIG9wZW4gc3RhdGUgaXMgYXMgZGVzY3JpYmVkIC0gYWxsIGNocm9tb3NvbWVzIHNob3duLlxuICAgIC8vIEluIHRoZSBjbG9zZWQgc3RhdGU6IFxuICAgIC8vICAgICAqIG9ubHkgb25lIGNocm9tb3NvbWUgc2hvd3MgKHRoZSBjdXJyZW50IG9uZSlcbiAgICAvLyAgICAgKiBkcmF3biBob3Jpem9udGFsbHkgYW5kIHBvc2l0aW9uZWQgYmVzaWRlIHRoZSBcIkdlbm9tZSBWaWV3XCIgdGl0bGVcbiAgICAvL1xuICAgIGRyYXdDaHJvbW9zb21lcyAoKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblxuXHRsZXQgcmcgPSB0aGlzLmFwcC5yR2Vub21lOyAvLyByZWYgZ2Vub21lXG5cdGxldCByQ2hycyA9IHJnLmNocm9tb3NvbWVzO1xuXG4gICAgICAgIC8vIENocm9tb3NvbWUgZ3JvdXBzXG5cdGxldCBjaHJzID0gdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKFwiLmNocm9tb3NvbWVcIilcblx0ICAgIC5kYXRhKHJDaHJzLCBjID0+IGMubmFtZSk7XG5cdGxldCBuZXdjaHJzID0gY2hycy5lbnRlcigpLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjaHJvbW9zb21lXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgYyA9PiBjLm5hbWUpO1xuXHRcblx0bmV3Y2hycy5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJuYW1lXCIsXCJsYWJlbFwiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJsaW5lXCIpLmF0dHIoXCJuYW1lXCIsXCJiYWNrYm9uZVwiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJzeW5CbG9ja3NcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwidGlja3NcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwiYnJ1c2hcIik7XG5cblxuXHRsZXQgY2xvc2VkID0gdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIik7XG5cdGlmIChjbG9zZWQpIHtcblx0ICAgIC8vIFJlc2V0IHRoZSBTVkcgc2l6ZSB0byBiZSAxLWNocm9tb3NvbWUgd2lkZS5cblx0ICAgIC8vIFRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAgc28gdGhhdCB0aGUgY3VycmVudCBjaHJvbW9zb21lIGFwcGVhcnMgaW4gdGhlIHN2ZyBhcmVhLlxuXHQgICAgLy8gVHVybiBpdCA5MCBkZWcuXG5cblx0ICAgIC8vIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBTVkcgYXJlYSB0byAxIGNocm9tb3NvbWUncyB3aWR0aFxuXHQgICAgdGhpcy5zZXRHZW9tKHsgaGVpZ2h0OiB0aGlzLnRvdGFsQ2hyV2lkdGgsIHJvdGF0aW9uOiAtOTAsIHRyYW5zbGF0aW9uOiBbLXRoaXMudG90YWxDaHJXaWR0aC8yLDMwXSB9KTtcblx0ICAgIC8vIFxuXHQgICAgbGV0IGRlbHRhID0gMTA7XG5cdCAgICByZy54c2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcblx0XHQgLmRvbWFpbihyQ2hycy5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHgubmFtZTt9KSlcblx0XHQgLy8gaW4gY2xvc2VkIG1vZGUsIHRoZSBjaHJvbW9zb21lcyBoYXZlIGZpeGVkIHNwYWNpbmdcblx0XHQgLnJhbmdlUG9pbnRzKFtkZWx0YSwgZGVsdGErdGhpcy50b3RhbENocldpZHRoKihyQ2hycy5sZW5ndGgtMSldKTtcblx0ICAgIC8vXG5cdCAgICByZy55c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdCAuZG9tYWluKFsxLHJnLm1heGxlbl0pXG5cdFx0IC5yYW5nZShbMCwgdGhpcy53aWR0aF0pO1xuXG5cdCAgICAvLyB0cmFuc2xhdGUgZWFjaCBjaHJvbW9zb21lIGludG8gcG9zaXRpb25cblx0ICAgIGNocnMuYXR0cihcInRyYW5zZm9ybVwiLCBjID0+IGB0cmFuc2xhdGUoJHtyZy54c2NhbGUoYy5uYW1lKX0sIDApYCk7XG4gICAgICAgICAgICAvLyB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKC1yZy54c2NhbGUodGhpcy5hcHAuY29vcmRzLmNocikpO1xuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIC8vIFdoZW4gb3BlbiwgZHJhdyBhbGwgdGhlIGNocm9tb3NvbWVzLiBFYWNoIGNocm9tIGlzIGEgdmVydGljYWwgbGluZS5cblx0ICAgIC8vIENocm9tcyBhcmUgZGlzdHJpYnV0ZWQgZXZlbmx5IGFjcm9zcyB0aGUgYXZhaWxhYmxlIGhvcml6b250YWwgc3BhY2UuXG5cdCAgICB0aGlzLnNldEdlb20oeyB3aWR0aDogdGhpcy5vcGVuV2lkdGgsIGhlaWdodDogdGhpcy5vcGVuSGVpZ2h0LCByb3RhdGlvbjogMCwgdHJhbnNsYXRpb246IFswLDBdIH0pO1xuXHQgICAgLy8gXG5cdCAgICByZy54c2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcblx0XHQgLmRvbWFpbihyQ2hycy5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHgubmFtZTt9KSlcblx0XHQgLy8gaW4gY2xvc2VkIG1vZGUsIHRoZSBjaHJvbW9zb21lcyBzcHJlYWQgdG8gZmlsbCB0aGUgc3BhY2Vcblx0XHQgLnJhbmdlUG9pbnRzKFswLCB0aGlzLm9wZW5XaWR0aCAtIDMwXSwgMC41KTtcblx0ICAgIHJnLnlzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0IC5kb21haW4oWzEscmcubWF4bGVuXSlcblx0XHQgLnJhbmdlKFswLCB0aGlzLmhlaWdodF0pO1xuXG5cdCAgICAvLyB0cmFuc2xhdGUgZWFjaCBjaHJvbW9zb21lIGludG8gcG9zaXRpb25cblx0ICAgIGNocnMuYXR0cihcInRyYW5zZm9ybVwiLCBjID0+IGB0cmFuc2xhdGUoJHtyZy54c2NhbGUoYy5uYW1lKX0sIDApYCk7XG4gICAgICAgICAgICAvLyB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKDApO1xuXHR9XG5cblx0ckNocnMuZm9yRWFjaChjaHIgPT4ge1xuXHQgICAgdmFyIHNjID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQuZG9tYWluKFsxLGNoci5sZW5ndGhdKVxuXHRcdC5yYW5nZShbMCwgcmcueXNjYWxlKGNoci5sZW5ndGgpXSk7XG5cdCAgICBjaHIuYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKS55KHNjKVxuXHQgICAgICAgLm9uKFwiYnJ1c2hzdGFydFwiLCBjaHIgPT4gdGhpcy5icnVzaHN0YXJ0KGNocikpXG5cdCAgICAgICAub24oXCJicnVzaGVuZFwiLCAoKSA9PiB0aGlzLmJydXNoZW5kKCkpO1xuXHQgIH0sIHRoaXMpO1xuXG5cbiAgICAgICAgY2hycy5zZWxlY3QoJ1tuYW1lPVwibGFiZWxcIl0nKVxuXHQgICAgLnRleHQoYz0+Yy5uYW1lKVxuXHQgICAgLmF0dHIoXCJ4XCIsIDApIFxuXHQgICAgLmF0dHIoXCJ5XCIsIC0yKVxuXHQgICAgO1xuXG5cdGNocnMuc2VsZWN0KCdbbmFtZT1cImJhY2tib25lXCJdJylcblx0ICAgIC5hdHRyKFwieDFcIiwgMClcblx0ICAgIC5hdHRyKFwieTFcIiwgMClcblx0ICAgIC5hdHRyKFwieDJcIiwgMClcblx0ICAgIC5hdHRyKFwieTJcIiwgYyA9PiByZy55c2NhbGUoYy5sZW5ndGgpKVxuXHQgICAgO1xuXHQgICBcblx0Y2hycy5zZWxlY3QoJ1tuYW1lPVwiYnJ1c2hcIl0nKVxuXHQgICAgLmVhY2goZnVuY3Rpb24oZCl7ZDMuc2VsZWN0KHRoaXMpLmNhbGwoZC5icnVzaCk7fSlcblx0ICAgIC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHQgICAgIC5hdHRyKCd3aWR0aCcsMTApXG5cdCAgICAgLmF0dHIoJ3gnLCAtNSlcblx0ICAgIDtcblxuXHRjaHJzLmV4aXQoKS5yZW1vdmUoKTtcblx0XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2Nyb2xsIHdoZWVsIGV2ZW50IGhhbmRsZXIuXG4gICAgc2Nyb2xsV2hlZWwgKGR5KSB7XG5cdC8vIEFkZCBkeSB0byB0b3RhbCBzY3JvbGwgYW1vdW50LiBUaGVuIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNCeShkeSk7XG5cdC8vIEFmdGVyIGEgMjAwIG1zIHBhdXNlIGluIHNjcm9sbGluZywgc25hcCB0byBuZWFyZXN0IGNocm9tb3NvbWVcblx0dGhpcy50b3V0ICYmIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50b3V0KTtcblx0dGhpcy50b3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCk9PnRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCksIDIwMCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzVG8gKHgpIHtcbiAgICAgICAgaWYgKHggPT09IHVuZGVmaW5lZCkgeCA9IHRoaXMuc2Nyb2xsQW1vdW50O1xuXHR0aGlzLnNjcm9sbEFtb3VudCA9IE1hdGgubWF4KE1hdGgubWluKHgsMTUpLCAtdGhpcy50b3RhbENocldpZHRoICogKHRoaXMuYXBwLnJHZW5vbWUuY2hyb21vc29tZXMubGVuZ3RoLTEpKTtcblx0dGhpcy5nQ2hyb21vc29tZXMuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7dGhpcy5zY3JvbGxBbW91bnR9LDApYCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzQnkgKGR4KSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbyh0aGlzLnNjcm9sbEFtb3VudCArIGR4KTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNTbmFwICgpIHtcblx0bGV0IGkgPSBNYXRoLnJvdW5kKHRoaXMuc2Nyb2xsQW1vdW50IC8gdGhpcy50b3RhbENocldpZHRoKVxuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oaSp0aGlzLnRvdGFsQ2hyV2lkdGgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc1VwICgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc0J5KC10aGlzLnRvdGFsQ2hyV2lkdGgpO1xuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc0Rvd24gKCkge1xuICAgICAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzQnkodGhpcy50b3RhbENocldpZHRoKTtcblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZHJhd1RpdGxlICgpIHtcblx0bGV0IHJlZmcgPSB0aGlzLmFwcC5yR2Vub21lLmxhYmVsO1xuXHRsZXQgYmxvY2tnID0gdGhpcy5jdXJyQmxvY2tzID8gXG5cdCAgICB0aGlzLmN1cnJCbG9ja3MuY29tcCAhPT0gdGhpcy5hcHAuckdlbm9tZSA/XG5cdCAgICAgICAgdGhpcy5jdXJyQmxvY2tzLmNvbXAubGFiZWxcblx0XHQ6XG5cdFx0bnVsbFxuXHQgICAgOlxuXHQgICAgbnVsbDtcblx0bGV0IGxzdCA9IHRoaXMuYXBwLmN1cnJMaXN0ID8gdGhpcy5hcHAuY3Vyckxpc3QubmFtZSA6IG51bGw7XG5cblx0dGhpcy5yb290LnNlbGVjdChcImxhYmVsIHNwYW4udGl0bGVcIikudGV4dChyZWZnKTtcblxuXHRsZXQgbGluZXMgPSBbXTtcblx0YmxvY2tnICYmIGxpbmVzLnB1c2goYEJsb2NrcyB2cy4gJHtibG9ja2d9YCk7XG5cdGxzdCAmJiBsaW5lcy5wdXNoKGBGZWF0dXJlcyBmcm9tIGxpc3QgXCIke2xzdH1cImApO1xuXHRsZXQgc3VidCA9IGxpbmVzLmpvaW4oXCIgOjogXCIpO1xuXHR0aGlzLnJvb3Quc2VsZWN0KFwibGFiZWwgc3Bhbi5zdWJ0aXRsZVwiKS50ZXh0KChzdWJ0ID8gXCI6OiBcIiA6IFwiXCIpICsgc3VidCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIG91dGxpbmVzIG9mIHN5bnRlbnkgYmxvY2tzIG9mIHRoZSByZWYgZ2Vub21lIHZzLlxuICAgIC8vIHRoZSBnaXZlbiBnZW5vbWUuXG4gICAgLy8gUGFzc2luZyBudWxsIGVyYXNlcyBhbGwgc3ludGVueSBibG9ja3MuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBkYXRhID09IHsgcmVmOkdlbm9tZSwgY29tcDpHZW5vbWUsIGJsb2NrczogbGlzdCBvZiBzeW50ZW55IGJsb2NrcyB9XG4gICAgLy8gICAgRWFjaCBzYmxvY2sgPT09IHsgYmxvY2tJZDppbnQsIG9yaTorLy0sIGZyb21DaHIsIGZyb21TdGFydCwgZnJvbUVuZCwgdG9DaHIsIHRvU3RhcnQsIHRvRW5kIH1cbiAgICBkcmF3QmxvY2tzIChkYXRhKSB7XG5cdC8vXG4gICAgICAgIGxldCBzYmdycHMgPSB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoXCIuY2hyb21vc29tZVwiKS5zZWxlY3QoJ1tuYW1lPVwic3luQmxvY2tzXCJdJyk7XG5cdGlmICghZGF0YSB8fCAhZGF0YS5ibG9ja3MgfHwgZGF0YS5ibG9ja3MubGVuZ3RoID09PSAwKSB7XG5cdCAgICB0aGlzLmN1cnJCbG9ja3MgPSBudWxsO1xuXHQgICAgc2JncnBzLmh0bWwoJycpO1xuXHQgICAgdGhpcy5kcmF3VGl0bGUoKTtcblx0ICAgIHJldHVybjtcblx0fVxuXHR0aGlzLmN1cnJCbG9ja3MgPSBkYXRhO1xuXHQvLyByZW9yZ2FuaXplIGRhdGEgdG8gcmVmbGVjdCBTVkcgc3RydWN0dXJlIHdlIHdhbnQsIGllLCBncm91cGVkIGJ5IGNocm9tb3NvbWVcbiAgICAgICAgbGV0IGR4ID0gZGF0YS5ibG9ja3MucmVkdWNlKChhLHNiKSA9PiB7XG5cdFx0aWYgKCFhW3NiLmZyb21DaHJdKSBhW3NiLmZyb21DaHJdID0gW107XG5cdFx0YVtzYi5mcm9tQ2hyXS5wdXNoKHNiKTtcblx0XHRyZXR1cm4gYTtcblx0ICAgIH0sIHt9KTtcblx0c2JncnBzLmVhY2goZnVuY3Rpb24oYyl7XG5cdCAgICBkMy5zZWxlY3QodGhpcykuZGF0dW0oe2NocjogYy5uYW1lLCBibG9ja3M6IGR4W2MubmFtZV0gfHwgW10gfSk7XG5cdH0pO1xuXG5cdGxldCBid2lkdGggPSAxMDtcbiAgICAgICAgbGV0IHNibG9ja3MgPSBzYmdycHMuc2VsZWN0QWxsKCdyZWN0LnNibG9jaycpLmRhdGEoYj0+Yi5ibG9ja3MpO1xuICAgICAgICBsZXQgbmV3YnMgPSBzYmxvY2tzLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuYXR0cignY2xhc3MnLCdzYmxvY2snKTtcblx0c2Jsb2Nrc1xuXHQgICAgLmF0dHIoXCJ4XCIsIC1id2lkdGgvMiApXG5cdCAgICAuYXR0cihcInlcIiwgYiA9PiB0aGlzLmdldFkoYi5mcm9tU3RhcnQpKVxuXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCBid2lkdGgpXG5cdCAgICAuYXR0cihcImhlaWdodFwiLCBiID0+IE1hdGgubWF4KDAsdGhpcy5nZXRZKGIuZnJvbUVuZCAtIGIuZnJvbVN0YXJ0ICsgMSkpKVxuXHQgICAgLmNsYXNzZWQoXCJpbnZlcnNpb25cIiwgYiA9PiBiLm9yaSA9PT0gXCItXCIpXG5cdCAgICAuY2xhc3NlZChcInRyYW5zbG9jYXRpb25cIiwgYiA9PiBiLmZyb21DaHIgIT09IGIudG9DaHIpXG5cdCAgICA7XG5cbiAgICAgICAgc2Jsb2Nrcy5leGl0KCkucmVtb3ZlKCk7XG5cblx0dGhpcy5kcmF3VGl0bGUoKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3VGlja3MgKGZlYXR1cmVzKSB7XG5cdHRoaXMuY3VyclRpY2tzID0gZmVhdHVyZXM7XG5cdGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7IC8vIHJlZiBnZW5vbWVcblx0Ly8gZmVhdHVyZSB0aWNrIG1hcmtzXG5cdGlmICghZmVhdHVyZXMgfHwgZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XG5cdCAgICB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoJ1tuYW1lPVwidGlja3NcIl0nKS5zZWxlY3RBbGwoXCIuZmVhdHVyZVwiKS5yZW1vdmUoKTtcblx0ICAgIHJldHVybjtcblx0fVxuXG5cdC8vXG5cdGxldCB0R3JwcyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpLnNlbGVjdCgnW25hbWU9XCJ0aWNrc1wiXScpO1xuXG5cdC8vIGdyb3VwIGZlYXR1cmVzIGJ5IGNocm9tb3NvbWVcbiAgICAgICAgbGV0IGZpeCA9IGZlYXR1cmVzLnJlZHVjZSgoYSxmKSA9PiB7IFxuXHQgICAgaWYgKCEgYVtmLmNocl0pIGFbZi5jaHJdID0gW107XG5cdCAgICBhW2YuY2hyXS5wdXNoKGYpO1xuXHQgICAgcmV0dXJuIGE7XG5cdH0sIHt9KVxuXHR0R3Jwcy5lYWNoKGZ1bmN0aW9uKGMpIHtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5kYXR1bSggeyBjaHI6IGMsIGZlYXR1cmVzOiBmaXhbYy5uYW1lXSAgfHwgW119ICk7XG5cdH0pO1xuXG5cdC8vIHRoZSB0aWNrIGVsZW1lbnRzXG4gICAgICAgIGxldCBmZWF0cyA9IHRHcnBzLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpXG5cdCAgICAuZGF0YShkID0+IGQuZmVhdHVyZXMsIGQgPT4gZC5tZ3BpZCk7XG5cdC8vXG5cdGxldCB4QWRqID0gZiA9PiAoZi5zdHJhbmQgPT09IFwiK1wiID8gdGhpcy50aWNrTGVuZ3RoIDogLXRoaXMudGlja0xlbmd0aCk7XG5cdC8vXG5cdGxldCBzaGFwZSA9IFwiY2lyY2xlXCI7ICAvLyBcImNpcmNsZVwiIG9yIFwibGluZVwiXG5cdC8vXG5cdGZlYXRzLmVudGVyKClcblx0ICAgIC5hcHBlbmQoc2hhcGUpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJmZWF0dXJlXCIpXG5cdCAgICAuYXBwZW5kKFwidGl0bGVcIilcblx0ICAgIC50ZXh0KGY9PmYuc3ltYm9sIHx8IGYuaWQpO1xuXHRpZiAoc2hhcGUgPT09IFwibGluZVwiKSB7XG5cdCAgICBmZWF0cy5hdHRyKFwieDFcIiwgZiA9PiB4QWRqKGYpICsgNSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ5MVwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ4MlwiLCBmID0+IHhBZGooZikgKyB0aGlzLnRpY2tMZW5ndGggKyA1KVxuXHQgICAgZmVhdHMuYXR0cihcInkyXCIsIGYgPT4gcmcueXNjYWxlKGYuc3RhcnQpKVxuXHR9XG5cdGVsc2Uge1xuXHQgICAgZmVhdHMuYXR0cihcImN4XCIsIGYgPT4geEFkaihmKSlcblx0ICAgIGZlYXRzLmF0dHIoXCJjeVwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0ICAgIGZlYXRzLmF0dHIoXCJyXCIsICB0aGlzLnRpY2tMZW5ndGggLyAyKTtcblx0fVxuXHQvL1xuXHRmZWF0cy5leGl0KCkucmVtb3ZlKClcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBHZW5vbWVWaWV3XG5cbmV4cG9ydCB7IEdlbm9tZVZpZXcgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0dlbm9tZVZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcblxuY2xhc3MgRmVhdHVyZURldGFpbHMgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMuaW5pdERvbSAoKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RG9tICgpIHtcblx0Ly9cblx0dGhpcy5yb290LnNlbGVjdCAoXCIuYnV0dG9uLmNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5leHRyYVwiLCAoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIHVwZGF0ZShmKSB7XG5cdC8vIGlmIGNhbGxlZCB3aXRoIG5vIGFyZ3MsIHVwZGF0ZSB1c2luZyB0aGUgcHJldmlvdXMgZmVhdHVyZVxuXHRmID0gZiB8fCB0aGlzLmxhc3RGZWF0dXJlO1xuXHRpZiAoIWYpIHtcblx0ICAgLy8gRklYTUU6IG1ham9yIHJlYWNob3ZlciBpbiB0aGlzIHNlY3Rpb25cblx0ICAgLy9cblx0ICAgLy8gZmFsbGJhY2suIHRha2UgdGhlIGZpcnN0IGhpZ2hsaWdodGVkLlxuXHQgICBsZXQgciA9IHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwicmVjdC5mZWF0dXJlLmhpZ2hsaWdodFwiKVswXVswXTtcblx0ICAgLy8gZmFsbGJhY2suIHRha2UgdGhlIGZpcnN0IGZlYXR1cmVcblx0ICAgaWYgKCFyKSByID0gdGhpcy5hcHAuem9vbVZpZXcuc3ZnTWFpbi5zZWxlY3QoXCJyZWN0LmZlYXR1cmVcIilbMF1bMF07XG5cdCAgIGlmIChyKSBmID0gci5fX2RhdGFfXztcblx0fVxuXHQvLyByZW1lbWJlclxuICAgICAgICBpZiAoIWYpIHRocm93IFwiQ2Fubm90IHVwZGF0ZSBmZWF0dXJlIGRldGFpbHMuIE5vIGZlYXR1cmUuXCI7XG5cdHRoaXMubGFzdEZlYXR1cmUgPSBmO1xuXG5cdC8vIGxpc3Qgb2YgZmVhdHVyZXMgdG8gc2hvdyBpbiBkZXRhaWxzIGFyZWEuXG5cdC8vIHRoZSBnaXZlbiBmZWF0dXJlIGFuZCBhbGwgZXF1aXZhbGVudHMgaW4gb3RoZXIgZ2Vub21lcy5cblx0bGV0IGZsaXN0ID0gW2ZdO1xuXHRpZiAoZi5tZ2lpZCkge1xuXHQgICAgLy8gRklYTUU6IHJlYWNob3ZlclxuXHQgICAgZmxpc3QgPSB0aGlzLmFwcC5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5TWdpSWQoZi5tZ2lpZCk7XG5cdH1cblx0Ly8gR290IHRoZSBsaXN0LiBOb3cgb3JkZXIgaXQgdGhlIHNhbWUgYXMgdGhlIGRpc3BsYXllZCBnZW5vbWVzXG5cdC8vIGJ1aWxkIGluZGV4IG9mIGdlbm9tZSBuYW1lIC0+IGZlYXR1cmUgaW4gZmxpc3Rcblx0bGV0IGl4ID0gZmxpc3QucmVkdWNlKChhY2MsZikgPT4geyBhY2NbZi5nZW5vbWUubmFtZV0gPSBmOyByZXR1cm4gYWNjOyB9LCB7fSlcblx0bGV0IGdlbm9tZU9yZGVyID0gKFt0aGlzLmFwcC5yR2Vub21lXS5jb25jYXQodGhpcy5hcHAuY0dlbm9tZXMpKTtcblx0Zmxpc3QgPSBnZW5vbWVPcmRlci5tYXAoZyA9PiBpeFtnLm5hbWVdIHx8IG51bGwpO1xuXHQvL1xuXHRsZXQgY29sSGVhZGVycyA9IFtcblx0ICAgIC8vIGNvbHVtbnMgaGVhZGVycyBhbmQgdGhlaXIgJSB3aWR0aHNcblx0ICAgIFtcIkdlbm9tZVwiICAgICAsOV0sXG5cdCAgICBbXCJNR1AgaWRcIiAgICAgLDE3XSxcblx0ICAgIFtcIlR5cGVcIiAgICAgICAsMTAuNV0sXG5cdCAgICBbXCJCaW9UeXBlXCIgICAgLDE4LjVdLFxuXHQgICAgW1wiQ29vcmRzXCIgICAgICwxOF0sXG5cdCAgICBbXCJMZW5ndGhcIiAgICAgLDddLFxuXHQgICAgW1wiTUdJIGlkXCIgICAgICwxMF0sXG5cdCAgICBbXCJNR0kgc3ltYm9sXCIgLDEwXVxuXHRdO1xuXHQvLyBJbiB0aGUgY2xvc2VkIHN0YXRlLCBvbmx5IHNob3cgdGhlIGhlYWRlciBhbmQgdGhlIHJvdyBmb3IgdGhlIHBhc3NlZCBmZWF0dXJlXG5cdGlmICh0aGlzLnJvb3QuY2xhc3NlZCgnY2xvc2VkJykpXG5cdCAgICBmbGlzdCA9IGZsaXN0LmZpbHRlciggKGZmLCBpKSA9PiBmZiA9PT0gZiApO1xuXHQvLyBEcmF3IHRoZSB0YWJsZVxuXHRsZXQgdCA9IHRoaXMucm9vdC5zZWxlY3QoJ3RhYmxlJyk7XG5cdGxldCByb3dzID0gdC5zZWxlY3RBbGwoJ3RyJykuZGF0YSggW2NvbEhlYWRlcnNdLmNvbmNhdChmbGlzdCkgKTtcblx0cm93cy5lbnRlcigpLmFwcGVuZCgndHInKVxuXHQgIC5vbihcIm1vdXNlZW50ZXJcIiwgKGYsaSkgPT4gaSAhPT0gMCAmJiB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoZiwgdHJ1ZSkpXG5cdCAgLm9uKFwibW91c2VsZWF2ZVwiLCAoZixpKSA9PiBpICE9PSAwICYmIHRoaXMuYXBwLnpvb21WaWV3LmhpZ2hsaWdodCgpKTtcblx0ICAgICAgXG5cdHJvd3MuZXhpdCgpLnJlbW92ZSgpO1xuXHRyb3dzLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgKGZmLCBpKSA9PiAoaSAhPT0gMCAmJiBmZiA9PT0gZikpO1xuXHQvL1xuXHQvLyBHaXZlbiBhIGZlYXR1cmUsIHJldHVybnMgYSBsaXN0IG9mIHN0cmluZ3MgZm9yIHBvcHVsYXRpbmcgYSB0YWJsZSByb3cuXG5cdC8vIElmIGk9PT0wLCB0aGVuIGYgaXMgbm90IGEgZmVhdHVyZSwgYnV0IGEgbGlzdCBjb2x1bW5zIG5hbWVzK3dpZHRocy5cblx0Ly8gXG5cdGxldCBjZWxsRGF0YSA9IGZ1bmN0aW9uIChmLCBpKSB7XG5cdCAgICBpZiAoaSA9PT0gMCkge1xuXHRcdHJldHVybiBmO1xuXHQgICAgfVxuXHQgICAgbGV0IGNlbGxEYXRhID0gWyBnZW5vbWVPcmRlcltpLTFdLmxhYmVsLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiBdO1xuXHQgICAgLy8gZiBpcyBudWxsIGlmIGl0IGRvZXNuJ3QgZXhpc3QgZm9yIGdlbm9tZSBpIFxuXHQgICAgaWYgKGYpIHtcblx0XHRsZXQgbGluayA9IFwiXCI7XG5cdFx0bGV0IG1naWlkID0gZi5tZ2lpZCB8fCBcIlwiO1xuXHRcdGlmIChtZ2lpZCkge1xuXHRcdCAgICBsZXQgdXJsID0gYGh0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9hY2Nlc3Npb24vJHttZ2lpZH1gO1xuXHRcdCAgICBsaW5rID0gYDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIke3VybH1cIj4ke21naWlkfTwvYT5gO1xuXHRcdH1cblx0XHRjZWxsRGF0YSA9IFtcblx0XHQgICAgZi5nZW5vbWUubGFiZWwsXG5cdFx0ICAgIGYubWdwaWQsXG5cdFx0ICAgIGYudHlwZSxcblx0XHQgICAgZi5iaW90eXBlLFxuXHRcdCAgICBgJHtmLmNocn06JHtmLnN0YXJ0fS4uJHtmLmVuZH0gKCR7Zi5zdHJhbmR9KWAsXG5cdFx0ICAgIGAke2YuZW5kIC0gZi5zdGFydCArIDF9IGJwYCxcblx0XHQgICAgbGluayB8fCBtZ2lpZCxcblx0XHQgICAgZi5zeW1ib2xcblx0XHRdO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGNlbGxEYXRhO1xuXHR9O1xuXHRsZXQgY2VsbHMgPSByb3dzLnNlbGVjdEFsbChcInRkXCIpXG5cdCAgICAuZGF0YSgoZixpKSA9PiBjZWxsRGF0YShmLGkpKTtcblx0Y2VsbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZFwiKTtcblx0Y2VsbHMuZXhpdCgpLnJlbW92ZSgpO1xuXHRjZWxscy5odG1sKChkLGksaikgPT4ge1xuXHQgICAgcmV0dXJuIGogPT09IDAgPyBkWzBdIDogZFxuXHR9KVxuXHQuc3R5bGUoXCJ3aWR0aFwiLCAoZCxpLGopID0+IGogPT09IDAgPyBgJHtkWzFdfSVgIDogbnVsbCk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBGZWF0dXJlRGV0YWlscyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmVhdHVyZURldGFpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFNWR1ZpZXcgfSBmcm9tICcuL1NWR1ZpZXcnO1xuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gJy4vRmVhdHVyZSc7XG5pbXBvcnQgeyBwYXJzZUNvb3JkcywgZm9ybWF0Q29vcmRzLCBjb29yZHNBZnRlclRyYW5zZm9ybSwgcmVtb3ZlRHVwcyB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIFpvb21WaWV3IGV4dGVuZHMgU1ZHVmlldyB7XG4gICAgLy9cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQsIGluaXRpYWxDb29yZHMsIGluaXRpYWxIaSkge1xuICAgICAgc3VwZXIoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgLy9cbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIC8vXG4gICAgICB0aGlzLm1pblN2Z0hlaWdodCA9IDI1MDtcbiAgICAgIHRoaXMuYmxvY2tIZWlnaHQgPSA0MDtcbiAgICAgIHRoaXMudG9wT2Zmc2V0ID0gNDU7XG4gICAgICB0aGlzLmZlYXRIZWlnaHQgPSA2O1x0Ly8gaGVpZ2h0IG9mIGEgcmVjdGFuZ2xlIHJlcHJlc2VudGluZyBhIGZlYXR1cmVcbiAgICAgIHRoaXMubGFuZUdhcCA9IDI7XHQgICAgICAgIC8vIHNwYWNlIGJldHdlZW4gc3dpbSBsYW5lc1xuICAgICAgdGhpcy5sYW5lSGVpZ2h0ID0gdGhpcy5mZWF0SGVpZ2h0ICsgdGhpcy5sYW5lR2FwO1xuICAgICAgdGhpcy5zdHJpcEhlaWdodCA9IDcwOyAgICAvLyBoZWlnaHQgcGVyIGdlbm9tZSBpbiB0aGUgem9vbSB2aWV3XG4gICAgICB0aGlzLnN0cmlwR2FwID0gMjA7XHQvLyBzcGFjZSBiZXR3ZWVuIHN0cmlwc1xuICAgICAgdGhpcy5kbW9kZSA9ICdjb21wYXJpc29uJzsvLyBkcmF3aW5nIG1vZGUuICdjb21wYXJpc29uJyBvciAncmVmZXJlbmNlJ1xuXG4gICAgICAvL1xuICAgICAgdGhpcy5jb29yZHMgPSBpbml0aWFsQ29vcmRzOy8vIGN1cnIgem9vbSB2aWV3IGNvb3JkcyB7IGNociwgc3RhcnQsIGVuZCB9XG4gICAgICAvLyBJRHMgb2YgRmVhdHVyZXMgd2UncmUgaGlnaGxpZ2h0aW5nLiBNYXkgYmUgbWdwaWQgIG9yIG1naUlkXG4gICAgICAvLyBoaUZlYXRzIGlzIGFuIG9iaiB3aG9zZSBrZXlzIGFyZSB0aGUgSURzXG4gICAgICB0aGlzLmhpRmVhdHMgPSAoaW5pdGlhbEhpIHx8IFtdKS5yZWR1Y2UoIChhLHYpID0+IHsgYVt2XT12OyByZXR1cm4gYTsgfSwge30gKTtcbiAgICAgIC8vXG4gICAgICB0aGlzLmZpZHVjaWFscyA9IHRoaXMuc3ZnLmluc2VydChcImdcIixcIjpmaXJzdC1jaGlsZFwiKSAvLyBcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLFwiZmlkdWNpYWxzXCIpO1xuICAgICAgdGhpcy5zdHJpcHNHcnAgPSB0aGlzLnN2Z01haW4uYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJzdHJpcHNcIik7XG4gICAgICB0aGlzLmF4aXMgPSB0aGlzLnN2Z01haW4uYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJheGlzXCIpO1xuICAgICAgdGhpcy5jeHRNZW51ID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJjeHRNZW51XCJdJyk7XG4gICAgICAvL1xuICAgICAgdGhpcy5kcmFnZ2luZyA9IG51bGw7XG4gICAgICB0aGlzLmRyYWdnZXIgPSB0aGlzLmdldERyYWdnZXIoKTtcbiAgICAgIC8vXG4gICAgICB0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgLy9cbiAgICBpbml0RG9tICgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgciA9IHRoaXMucm9vdDtcblx0bGV0IGEgPSB0aGlzLmFwcDtcblx0Ly9cblx0ci5zZWxlY3QoJy5idXR0b24uY2xvc2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHRoaXMudXBkYXRlKCkpO1xuXG5cdC8vIHpvb20gY29udHJvbHNcblx0ci5zZWxlY3QoXCIjem9vbU91dFwiKS5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEuem9vbShhLmRlZmF1bHRab29tKSB9KTtcblx0ci5zZWxlY3QoXCIjem9vbUluXCIpIC5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgxL2EuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdChcIiN6b29tT3V0TW9yZVwiKS5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgyKmEuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdChcIiN6b29tSW5Nb3JlXCIpIC5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgxLygyKmEuZGVmYXVsdFpvb20pKSB9KTtcblxuXHQvLyBwYW4gY29udHJvbHNcblx0ci5zZWxlY3QoXCIjcGFuTGVmdFwiKSAub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigtYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoXCIjcGFuUmlnaHRcIikub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigrYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoXCIjcGFuTGVmdE1vcmVcIikgLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS5wYW4oLTUqYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoXCIjcGFuUmlnaHRNb3JlXCIpLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS5wYW4oKzUqYS5kZWZhdWx0UGFuKSB9KTtcblxuXHQvLyBDcmVhdGUgY29udGV4dCBtZW51LiBcblx0dGhpcy5pbml0Q29udGV4dE1lbnUoW3tcbiAgICAgICAgICAgIGxhYmVsOiBcIk1HSSBTTlBzXCIsIFxuXHQgICAgaWNvbjogXCJvcGVuX2luX25ld1wiLFxuXHQgICAgdG9vbHRpcDogXCJWaWV3IFNOUHMgYXQgTUdJIGZvciB0aGUgY3VycmVudCBzdHJhaW5zIGluIHRoZSBjdXJyZW50IHJlZ2lvbi4gKFNvbWUgc3RyYWlucyBub3QgYXZhaWxhYmxlLilcIixcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpU25wUmVwb3J0KClcblx0fSx7XG4gICAgICAgICAgICBsYWJlbDogXCJNR0kgUVRMc1wiLCBcblx0ICAgIGljb246ICBcIm9wZW5faW5fbmV3XCIsXG5cdCAgICB0b29sdGlwOiBcIlZpZXcgUVRMIGF0IE1HSSB0aGF0IG92ZXJsYXAgdGhlIGN1cnJlbnQgcmVnaW9uLlwiLFxuXHQgICAgaGFuZGxlcjogKCk9PiB0aGlzLmFwcC5saW5rVG9NZ2lRVExzKClcblx0fSx7XG4gICAgICAgICAgICBsYWJlbDogXCJNR0kgSkJyb3dzZVwiLCBcblx0ICAgIGljb246IFwib3Blbl9pbl9uZXdcIixcblx0ICAgIHRvb2x0aXA6IFwiT3BlbiBNR0kgSkJyb3dzZSAoQzU3QkwvNkogR1JDbTM4KSB3aXRoIHRoZSBjdXJyZW50IGNvb3JkaW5hdGUgcmFuZ2UuXCIsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naUpCcm93c2UoKVxuXHR9XSk7XG5cdC8vIGNsaWNrIG9uIGJhY2tncm91bmQgPT4gaGlkZSBjb250ZXh0IG1lbnVcblx0dGhpcy5yb290XG5cdCAgLm9uKFwiY2xpY2suY29udGV4dFwiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICh0Z3QudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlcIiAmJiB0Z3QuaW5uZXJIVE1MID09PSBcIm1lbnVcIilcblx0XHQgIC8vIGV4Y2VwdGlvbjogdGhlIGNvbnRleHQgbWVudSBidXR0b24gaXRzZWxmXG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgIGVsc2Vcblx0XHQgIHRoaXMuaGlkZUNvbnRleHRNZW51KClcblx0ICB9KTtcblxuXHQvL1xuXHQvL1xuXHRsZXQgZlNlbGVjdCA9IGZ1bmN0aW9uIChmLCBzaGlmdCwgcHJlc2VydmUpIHtcblx0ICAgIGxldCBpZCA9IGYubWdpaWQgfHwgZi5tZ3BpZDtcblx0ICAgIGlmIChzaGlmdCkge1xuXHRcdGlmICh0aGlzLmhpRmVhdHNbaWRdKVxuXHRcdCAgICBkZWxldGUgdGhpcy5oaUZlYXRzW2lkXVxuXHRcdGVsc2Vcblx0XHQgICAgdGhpcy5oaUZlYXRzW2lkXSA9IGlkO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0aWYgKCFwcmVzZXJ2ZSkgdGhpcy5oaUZlYXRzID0ge307XG5cdFx0dGhpcy5oaUZlYXRzW2lkXSA9IGlkO1xuXHQgICAgfVxuXHR9LmJpbmQodGhpcyk7XG5cdC8vXG5cdGxldCBmTW91c2VPdmVySGFuZGxlciA9IGZ1bmN0aW9uKGYpIHtcblx0XHRpZiAoZDMuZXZlbnQuYWx0S2V5KSB7XG5cdFx0ICAgIC8vIElmIHVzZXIgaXMgaG9sZGluZyB0aGUgYWx0IGtleSwgc2VsZWN0IGV2ZXJ5dGhpbmcgdG91Y2hlZC5cblx0XHQgICAgZlNlbGVjdChmLCBkMy5ldmVudC5zaGlmdEtleSwgdHJ1ZSk7XG5cdFx0ICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdFx0ICAgIC8vIERvbid0IHJlZ2lzdGVyIGNvbnRleHQgY2hhbmdlcyB1bnRpbCB1c2VyIGhhcyBwYXVzZWQgZm9yIGF0IGxlYXN0IDFzLlxuXHRcdCAgICBpZiAodGhpcy50aW1lb3V0KSB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cdFx0ICAgIHRoaXMudGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHRoaXMuYXBwLmNvbnRleHRDaGFuZ2VkKCk7IH0uYmluZCh0aGlzKSwgMTAwMCk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCFkMy5ldmVudC5jdHJsS2V5KSBcblx0XHQgICAgdGhpcy5oaWdobGlnaHQoZik7XG5cdH0uYmluZCh0aGlzKTtcblx0Ly9cblx0bGV0IGZNb3VzZU91dEhhbmRsZXIgPSBmdW5jdGlvbihmKSB7XG5cdCAgICBpZiAoIWQzLmV2ZW50LmN0cmxLZXkpXG5cdFx0dGhpcy5oaWdobGlnaHQoKTsgXG5cdH0uYmluZCh0aGlzKTtcblxuXHQvLyBcbiAgICAgICAgdGhpcy5zdmdcblx0ICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IHQgPSB0Z3RbMF1bMF07XG5cdCAgICAgIGlmICh0LnRhZ05hbWUgPT0gXCJyZWN0XCIgJiYgdC5jbGFzc0xpc3QuY29udGFpbnMoXCJmZWF0dXJlXCIpKSB7XG5cdFx0ICAvLyB1c2VyIGNsaWNrZWQgb24gYSBmZWF0dXJlXG5cdFx0ICBmU2VsZWN0KHQuX19kYXRhX18sIGQzLmV2ZW50LnNoaWZ0S2V5KTtcblx0XHQgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdCAgICAgICAgICB0aGlzLmFwcC5jb250ZXh0Q2hhbmdlZCgpO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2UgaWYgKHQudGFnTmFtZSA9PSBcInJlY3RcIiAmJiB0LmNsYXNzTGlzdC5jb250YWlucyhcImJsb2NrXCIpICYmICFkMy5ldmVudC5zaGlmdEtleSkge1xuXHRcdCAgLy8gdXNlciBjbGlja2VkIG9uIGEgc3ludGVueSBibG9jayBiYWNrZ3JvdW5kXG5cdFx0ICB0aGlzLmhpRmVhdHMgPSB7fTtcblx0XHQgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdFx0ICB0aGlzLmFwcC5jb250ZXh0Q2hhbmdlZCgpO1xuXHQgICAgICB9XG5cdCAgfSlcblx0ICAub24oXCJtb3VzZW92ZXJcIiwgKCkgPT4ge1xuXHQgICAgICBsZXQgdGd0ID0gZDMuc2VsZWN0KGQzLmV2ZW50LnRhcmdldCk7XG5cdCAgICAgIGxldCBmID0gdGd0LmRhdGEoKVswXTtcblx0ICAgICAgaWYgKGYgaW5zdGFuY2VvZiBGZWF0dXJlKSB7XG5cdFx0ICBmTW91c2VPdmVySGFuZGxlcihmKTtcblx0ICAgICAgfVxuXHQgIH0pXG5cdCAgLm9uKFwibW91c2VvdXRcIiwgKCkgPT4ge1xuXHQgICAgICBsZXQgdGd0ID0gZDMuc2VsZWN0KGQzLmV2ZW50LnRhcmdldCk7XG5cdCAgICAgIGxldCBmID0gdGd0LmRhdGEoKVswXTtcblx0ICAgICAgaWYgKGYgaW5zdGFuY2VvZiBGZWF0dXJlKSB7XG5cdFx0ICBmTW91c2VPdXRIYW5kbGVyKGYpO1xuXHQgICAgICB9XG5cdCAgfSk7XG5cblx0Ly8gQnV0dG9uOiBNZW51IGluIHpvb20gdmlld1xuXHR0aGlzLnJvb3Quc2VsZWN0KFwiLm1lbnUgPiAuYnV0dG9uXCIpXG5cdCAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICAvLyBzaG93IGNvbnRleHQgbWVudSBhdCBtb3VzZSBldmVudCBjb29yZGluYXRlc1xuXHQgICAgICBsZXQgY3ggPSBkMy5ldmVudC5jbGllbnRYO1xuXHQgICAgICBsZXQgY3kgPSBkMy5ldmVudC5jbGllbnRZO1xuXHQgICAgICBsZXQgYmIgPSBkMy5zZWxlY3QodGhpcylbMF1bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICBzZWxmLnNob3dDb250ZXh0TWVudShjeC1iYi5sZWZ0LGN5LWJiLnRvcCk7XG5cdCAgfSk7XG5cdC8vIHpvb20gY29vcmRpbmF0ZXMgYm94XG5cdHRoaXMucm9vdC5zZWxlY3QoXCIjem9vbUNvb3Jkc1wiKVxuXHQgICAgLmNhbGwoemNzID0+IHpjc1swXVswXS52YWx1ZSA9IGZvcm1hdENvb3Jkcyh0aGlzLmNvb3JkcykpXG5cdCAgICAub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdGxldCBjb29yZHMgPSBwYXJzZUNvb3Jkcyh0aGlzLnZhbHVlKTtcblx0XHRpZiAoISBjb29yZHMpIHtcblx0XHQgICAgYWxlcnQoXCJQbGVhc2UgZW50ZXIgYSBjb29yZGluYXRlIHJhbmdlIGZvcm1hdHRlZCBhcyAnY2hyOnN0YXJ0Li5lbmQnLiBcIiArXG5cdFx0ICAgICAgICAgIFwiRm9yIGV4YW1wbGUsICc1OjEwMDAwMDAwLi41MDAwMDAwMCcuXCIpO1xuXHRcdCAgICB0aGlzLnZhbHVlID0gXCJcIjtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0XHRzZWxmLmFwcC5zZXRDb250ZXh0KGNvb3Jkcyk7XG5cdCAgICB9KTtcblx0Ly8gem9vbSB3aW5kb3cgc2l6ZSBib3hcblx0dGhpcy5yb290LnNlbGVjdChcIiN6b29tV1NpemVcIilcblx0ICAgIC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0ICAgICAgICBsZXQgd3MgPSBwYXJzZUludCh0aGlzLnZhbHVlKTtcblx0XHRsZXQgYyA9IHNlbGYuY29vcmRzO1xuXHRcdGlmIChpc05hTih3cykgfHwgd3MgPCAxMDApIHtcblx0XHQgICAgYWxlcnQoXCJJbnZhbGlkIHdpbmRvdyBzaXplLiBQbGVhc2UgZW50ZXIgYW4gaW50ZWdlciA+PSAxMDAuXCIpO1xuXHRcdCAgICB0aGlzLnZhbHVlID0gTWF0aC5yb3VuZChjLmVuZCAtIGMuc3RhcnQgKyAxKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIGxldCBtaWQgPSAoYy5zdGFydCArIGMuZW5kKSAvIDI7XG5cdFx0ICAgIGxldCBuZXdzID0gTWF0aC5yb3VuZChtaWQgLSB3cy8yKTtcblx0XHQgICAgbGV0IG5ld2UgPSBuZXdzICsgd3MgLSAxO1xuXHRcdCAgICBzZWxmLmFwcC5zZXRDb250ZXh0KHtcblx0XHQgICAgICAgIGNocjogYy5jaHIsXG5cdFx0XHRzdGFydDogbmV3cyxcblx0XHRcdGVuZDogbmV3ZVxuXG5cdFx0ICAgIH0pO1xuXHRcdH1cblx0ICAgIH0pO1xuXHQvLyB6b29tIGRyYXdpbmcgbW9kZSBcblx0dGhpcy5yb290LnNlbGVjdEFsbCgnZGl2W25hbWU9XCJ6b29tRG1vZGVcIl0gLmJ1dHRvbicpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHRsZXQgciA9IHNlbGYucm9vdDtcblx0XHRsZXQgaXNDID0gci5jbGFzc2VkKCdjb21wYXJpc29uJyk7XG5cdFx0ci5jbGFzc2VkKCdjb21wYXJpc29uJywgIWlzQyk7XG5cdFx0ci5jbGFzc2VkKCdyZWZlcmVuY2UnLCBpc0MpO1xuXHRcdHNlbGYuYXBwLnNldENvbnRleHQoe2Rtb2RlOiByLmNsYXNzZWQoJ2NvbXBhcmlzb24nKSA/ICdjb21wYXJpc29uJyA6ICdyZWZlcmVuY2UnfSk7XG5cdCAgICB9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgZGF0YSAobGlzdCBvZiBtZW51SXRlbSBjb25maWdzKSBFYWNoIGNvbmZpZyBsb29rcyBsaWtlIHtsYWJlbDpzdHJpbmcsIGhhbmRsZXI6IGZ1bmN0aW9ufVxuICAgIGluaXRDb250ZXh0TWVudSAoZGF0YSkge1xuXHR0aGlzLmN4dE1lbnUuc2VsZWN0QWxsKFwiLm1lbnVJdGVtXCIpLnJlbW92ZSgpOyAvLyBpbiBjYXNlIG9mIHJlLWluaXRcbiAgICAgICAgbGV0IG1pdGVtcyA9IHRoaXMuY3h0TWVudVxuXHQgIC5zZWxlY3RBbGwoXCIubWVudUl0ZW1cIilcblx0ICAuZGF0YShkYXRhKTtcblx0bGV0IG5ld3MgPSBtaXRlbXMuZW50ZXIoKVxuXHQgIC5hcHBlbmQoXCJkaXZcIilcblx0ICAuYXR0cihcImNsYXNzXCIsIFwibWVudUl0ZW0gZmxleHJvd1wiKVxuXHQgIC5hdHRyKFwidGl0bGVcIiwgZCA9PiBkLnRvb2x0aXAgfHwgbnVsbCApO1xuXHRuZXdzLmFwcGVuZChcImxhYmVsXCIpXG5cdCAgLnRleHQoZCA9PiBkLmxhYmVsKVxuXHQgIC5vbihcImNsaWNrXCIsIGQgPT4ge1xuXHQgICAgICBkLmhhbmRsZXIoKTtcblx0ICAgICAgdGhpcy5oaWRlQ29udGV4dE1lbnUoKTtcblx0ICB9KTtcblx0bmV3cy5hcHBlbmQoXCJpXCIpXG5cdCAgLmF0dHIoXCJjbGFzc1wiLCBcIm1hdGVyaWFsLWljb25zXCIpXG5cdCAgLnRleHQoIGQ9PmQuaWNvbiApO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXQgaGlnaGxpZ2h0ZWQgKGhscykge1xuXHRpZiAodHlwZW9mKGhscykgPT09IFwic3RyaW5nXCIpXG5cdCAgICBobHMgPSBbaGxzXTtcblx0Ly9cblx0dGhpcy5oaUZlYXRzID0ge307XG4gICAgICAgIGZvcihsZXQgaCBvZiBobHMpe1xuXHQgICAgdGhpcy5oaUZlYXRzW2hdID0gaDtcblx0fVxuICAgIH1cbiAgICBnZXQgaGlnaGxpZ2h0ZWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaUZlYXRzID8gT2JqZWN0LmtleXModGhpcy5oaUZlYXRzKSA6IFtdO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dDb250ZXh0TWVudSAoeCx5KSB7XG4gICAgICAgIHRoaXMuY3h0TWVudVxuXHQgICAgLmNsYXNzZWQoXCJzaG93aW5nXCIsIHRydWUpXG5cdCAgICAuc3R5bGUoXCJsZWZ0XCIsIGAke3h9cHhgKVxuXHQgICAgLnN0eWxlKFwidG9wXCIsIGAke3l9cHhgKVxuXHQgICAgO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWRlQ29udGV4dE1lbnUgKCkge1xuICAgICAgICB0aGlzLmN4dE1lbnUuY2xhc3NlZChcInNob3dpbmdcIiwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIGdzIChsaXN0IG9mIEdlbm9tZXMpXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vICAgICBGb3IgZWFjaCBHZW5vbWUsIHNldHMgZy56b29tWSBcbiAgICBzZXQgZ2Vub21lcyAoZ3MpIHtcbiAgICAgICBncy5mb3JFYWNoKCAoZyxpKSA9PiB7Zy56b29tWSA9IHRoaXMudG9wT2Zmc2V0ICsgaSAqICh0aGlzLnN0cmlwSGVpZ2h0ICsgdGhpcy5zdHJpcEdhcCl9ICk7XG4gICAgICAgdGhpcy5fZ2Vub21lcyA9IGdzO1xuICAgIH1cbiAgICBnZXQgZ2Vub21lcyAoKSB7XG4gICAgICAgcmV0dXJuIHRoaXMuX2dlbm9tZXM7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIG5hbWVzIG9mIHRoZSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMgKHN0cmlwZXMpIGluIHRvcC10by1ib3R0b20gb3JkZXIuXG4gICAgLy9cbiAgICBnZXRHZW5vbWVZT3JkZXIgKCkge1xuICAgICAgICBsZXQgc3RyaXBzID0gdGhpcy5zdmdNYWluLnNlbGVjdEFsbChcIi56b29tU3RyaXBcIik7XG4gICAgICAgIGxldCBzcyA9IHN0cmlwc1swXS5tYXAoZz0+IHtcblx0ICAgIGxldCBiYiA9IGcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICByZXR1cm4gW2JiLnksIGcuX19kYXRhX18uZ2Vub21lLm5hbWVdO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IG5zID0gc3Muc29ydCggKGEsYikgPT4gYVswXSAtIGJbMF0gKS5tYXAoIHggPT4geFsxXSApXG5cdHJldHVybiBucztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyB0aGUgdG9wLXRvLWJvdHRvbSBvcmRlciBvZiB0aGUgY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzIGFjY29yZGluZyB0byBcbiAgICAvLyB0aGUgZ2l2ZW4gbmFtZSBsaXN0IG9mIG5hbWVzLiBCZWNhdXNlIHdlIGNhbid0IGd1YXJhbnRlZSB0aGUgZ2l2ZW4gbmFtZXMgY29ycmVzcG9uZFxuICAgIC8vIHRvIGFjdHVhbCB6b29tIHN0cmlwcywgb3IgdGhhdCBhbGwgc3RyaXBzIGFyZSByZXByZXNlbnRlZCwgZXRjLlxuICAgIC8vIFRoZXJlZm9yZSwgdGhlIGxpc3QgaXMgcHJlcHJlY2Vzc2VkIGFzIGZvbGxvd3M6XG4gICAgLy8gICAgICogZHVwbGljYXRlIG5hbWVzLCBpZiB0aGV5IGV4aXN0LCBhcmUgcmVtb3ZlZFxuICAgIC8vICAgICAqIG5hbWVzIHRoYXQgZG8gbm90IGNvcnJlc3BvbmQgdG8gZXhpc3Rpbmcgem9vbVN0cmlwcyBhcmUgcmVtb3ZlZFxuICAgIC8vICAgICAqIG5hbWVzIG9mIGV4aXN0aW5nIHpvb20gc3RyaXBzIHRoYXQgZG9uJ3QgYXBwZWFyIGluIHRoZSBsaXN0IGFyZSBhZGRlZCB0byB0aGUgZW5kXG4gICAgLy8gVGhlIHJlc3VsdCBpcyBhIGxpc3Qgb2YgbmFtZXMgd2l0aCB0aGVzZSBwcm9wZXJ0aWVzOlxuICAgIC8vICAgICAqIHRoZXJlIGlzIGEgMToxIGNvcnJlc3BvbmRlbmNlIGJldHdlZW4gbmFtZXMgYW5kIGFjdHVhbCB6b29tIHN0cmlwc1xuICAgIC8vICAgICAqIHRoZSBuYW1lIG9yZGVyIGlzIGNvbnNpc3RlbnQgd2l0aCB0aGUgaW5wdXQgbGlzdFxuICAgIC8vIFRoaXMgaXMgdGhlIGxpc3QgdXNlZCB0byAocmUpb3JkZXIgdGhlIHpvb20gc3RyaXBzLlxuICAgIC8vXG4gICAgLy8gR2l2ZW4gdGhlIGxpc3Qgb3JkZXI6IFxuICAgIC8vICAgICAqIGEgWS1wb3NpdGlvbiBpcyBhc3NpZ25lZCB0byBlYWNoIGdlbm9tZVxuICAgIC8vICAgICAqIHpvb20gc3RyaXBzIHRoYXQgYXJlIE5PVCBDVVJSRU5UTFkgQkVJTkcgRFJBR0dFRCBhcmUgdHJhbnNsYXRlZCB0byB0aGVpciBuZXcgbG9jYXRpb25zXG4gICAgLy9cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBucyAobGlzdCBvZiBzdHJpbmdzKSBOYW1lcyBvZiB0aGUgZ2Vub21lcy5cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgICBub3RoaW5nXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vICAgICBSZWNhbGN1bGF0ZXMgdGhlIFktY29vcmRpbmF0ZXMgZm9yIGVhY2ggc3RyaXBlIGJhc2VkIG9uIHRoZSBnaXZlbiBvcmRlciwgdGhlbiB0cmFuc2xhdGVzXG4gICAgLy8gICAgIGVhY2ggc3RyaXAgdG8gaXRzIG5ldyBwb3NpdGlvbi5cbiAgICAvL1xuICAgIHNldEdlbm9tZVlPcmRlciAobnMpIHtcblx0dGhpcy5nZW5vbWVzID0gcmVtb3ZlRHVwcyhucykubWFwKG49PiB0aGlzLmFwcC5uYW1lMmdlbm9tZVtuXSApLmZpbHRlcih4PT54KTtcbiAgICAgICAgdGhpcy5nZW5vbWVzLmZvckVhY2goIChnLGkpID0+IHtcblx0ICAgIGxldCBzdHJpcCA9IGQzLnNlbGVjdChgI3pvb21WaWV3IC56b29tU3RyaXBbbmFtZT1cIiR7Zy5uYW1lfVwiXWApO1xuXHQgICAgaWYgKCFzdHJpcC5jbGFzc2VkKFwiZHJhZ2dpbmdcIikpXG5cdCAgICAgICAgc3RyaXAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKDAsJHtnLnpvb21ZfSlgKTtcblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIGRyYWdnZXIgKGQzLmJlaGF2aW9yLmRyYWcpIHRvIGJlIGF0dGFjaGVkIHRvIGVhY2ggem9vbSBzdHJpcC5cbiAgICAvLyBBbGxvd3Mgc3RyaXBzIHRvIGJlIHJlb3JkZXJlZCBieSBkcmFnZ2luZy5cbiAgICBnZXREcmFnZ2VyICgpIHsgIFxuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgcmV0dXJuIGQzLmJlaGF2aW9yLmRyYWcoKVxuXHQgIC5vcmlnaW4oZnVuY3Rpb24oZCxpKXtcblx0ICAgICAgcmV0dXJuIHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgfSlcbiAgICAgICAgICAub24oXCJkcmFnc3RhcnQuelwiLCBmdW5jdGlvbihnKSB7XG5cdCAgICAgIGxldCB0ID0gZDMuZXZlbnQuc291cmNlRXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAoZDMuc2VsZWN0KHQpLmF0dHIoXCJuYW1lXCIpICE9PSAnem9vbVN0cmlwSGFuZGxlJyl7XG5cdCAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgIH1cblx0ICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIGxldCBzdHJpcCA9IHRoaXMuY2xvc2VzdChcIi56b29tU3RyaXBcIik7XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgPSBkMy5zZWxlY3Qoc3RyaXApLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCB0cnVlKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWcuelwiLCBmdW5jdGlvbiAoZykge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgbGV0IG15ID0gZDMubW91c2Uoc2VsZi5zdmdNYWluWzBdWzBdKVsxXTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZy5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoMCwgJHtteX0pYCk7XG5cdCAgICAgIHNlbGYuc2V0R2Vub21lWU9yZGVyKHNlbGYuZ2V0R2Vub21lWU9yZGVyKCkpO1xuXHQgICAgICBzZWxmLmhpZ2hsaWdodCgpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZ2VuZC56XCIsIGZ1bmN0aW9uIChnKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICAvL1xuXHQgICAgICBzZWxmLmRyYWdnaW5nLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCBmYWxzZSk7XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgPSBudWxsO1xuXHQgICAgICBzZWxmLnNldEdlbm9tZVlPcmRlcihzZWxmLmdldEdlbm9tZVlPcmRlcigpKTtcblx0ICAgICAgc2VsZi5hcHAuc2V0Q29udGV4dCh7IGdlbm9tZXM6IHNlbGYuZ2V0R2Vub21lWU9yZGVyKCkgfSk7XG5cdCAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCBzZWxmLmhpZ2hsaWdodC5iaW5kKHNlbGYpLCAyNTAgKTtcblx0ICB9KVxuXHQgIDtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhckJydXNoZXMgKCkge1xuXHR0aGlzLnJvb3Quc2VsZWN0QWxsKFwiZy5icnVzaFwiKVxuXHQgICAgLmVhY2goIGZ1bmN0aW9uIChiKSB7XG5cdCAgICAgICAgYi5icnVzaC5jbGVhcigpO1xuXHRcdGQzLnNlbGVjdCh0aGlzKS5jYWxsKGIuYnJ1c2gpO1xuXHQgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyB0aGUgY3VycmVudCBicnVzaCBjb29yZGluYXRlcywgdHJhbnNsYXRlZCAoaWYgbmVlZGVkKSB0byByZWYgZ2Vub21lIGNvb3JkaW5hdGVzLlxuICAgIGJiR2V0UmVmQ29vcmRzICgpIHtcbiAgICAgIGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7XG4gICAgICBsZXQgYmxrID0gdGhpcy5icnVzaGluZztcbiAgICAgIGxldCBleHQgPSBibGsuYnJ1c2guZXh0ZW50KCk7XG4gICAgICBsZXQgciA9IHsgY2hyOiBibGsuY2hyLCBzdGFydDogZXh0WzBdLCBlbmQ6IGV4dFsxXSwgYmxvY2tJZDpibGsuYmxvY2tJZCB9O1xuICAgICAgbGV0IHRyID0gdGhpcy5hcHAudHJhbnNsYXRvcjtcbiAgICAgIGlmKCBibGsuZ2Vub21lICE9PSByZyApIHtcbiAgICAgICAgIC8vIHVzZXIgaXMgYnJ1c2hpbmcgYSBjb21wIGdlbm9tZXMgc28gZmlyc3QgdHJhbnNsYXRlXG5cdCAvLyBjb29yZGluYXRlcyB0byByZWYgZ2Vub21lXG5cdCBsZXQgcnMgPSB0aGlzLmFwcC50cmFuc2xhdG9yLnRyYW5zbGF0ZShibGsuZ2Vub21lLCByLmNociwgci5zdGFydCwgci5lbmQsIHJnKTtcblx0IGlmIChycy5sZW5ndGggPT09IDApIHJldHVybjtcblx0IHIgPSByc1swXTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAgIHIuYmxvY2tJZCA9IHJnLm5hbWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gcjtcbiAgICB9XG4gICAgLy8gaGFuZGxlciBmb3IgdGhlIHN0YXJ0IG9mIGEgYnJ1c2ggYWN0aW9uIGJ5IHRoZSB1c2VyIG9uIGEgYmxvY2tcbiAgICBiYlN0YXJ0IChibGssYkVsdCkge1xuICAgICAgdGhpcy5icnVzaGluZyA9IGJsaztcbiAgICB9XG4gICAgLy8gaGFuZGxlciBmb3IgYnJ1c2ggbW90aW9uLiBNYWluIGpvYiBpcyB0byByZWZsZWN0IHRoZSBicnVzaFxuICAgIC8vIGluIHBhcmFsbGVsIGFjcm9zcyB0aGUgZ2Vub21lcyBpbiB0aGUgdmlldy4gVGhlIGN1cnJudCBicnVzaCBleHRlbnQgXG4gICAgLy8gaXMgdHJhbnNsYXRlZCAoaWYgbmVjZXNzYXJ5KSB0byByZWYgZ2Vub21lIHNwYWNlLiBUaGVuIHRob3NlXG4gICAgLy8gY29vcmRpbmF0ZXMgYXJlIHRyYW5zbGF0ZWQgdG8gZWFjaCBjb21wYXJpc29uIGdlbm9tZSBzcGFjZSwgYW5kIHRoZSBhcHByb3ByaWF0ZVxuICAgIC8vIGJydXNoKGVzKSB1cGRhdGVkLlxuICAgIC8vXG4gICAgYmJCcnVzaCAoKSB7XG4gICAgICBsZXQgcmcgPSB0aGlzLmFwcC5yR2Vub21lOyAvLyB0aGUgcmVmZXJlbmNlIGdlbm9tZVxuICAgICAgbGV0IGdzID0gW3JnXS5jb25jYXQodGhpcy5hcHAuY0dlbm9tZXMpOyAvLyBhbGwgdGhlIGdlbm9tZXMgaW4gdGhlIHZpZXdcbiAgICAgIGxldCB0ciA9IHRoaXMuYXBwLnRyYW5zbGF0b3I7IC8vIGZvciB0cmFuc2xhdGluZyBjb29yZHMgYmV0d2VlbiBnZW5vbWVzXG4gICAgICBsZXQgYmxrID0gdGhpcy5icnVzaGluZzsgLy8gdGhlIGJsb2NrIGN1cnJlbmx5IGJlaW5nIGJydXNoZWRcbiAgICAgIGxldCByID0gdGhpcy5iYkdldFJlZkNvb3JkcygpOyAvLyBjdXJyZW50IGJydXNoIGV4dGVudCwgaW4gcmVmIGdlbm9tZSBzcGFjZVxuICAgICAgZ3MuZm9yRWFjaCggZyA9PiB7XG5cdCAgLy8gaWYgZyBpcyB0aGUgcmVmR2Vub21lLCBubyBuZWVkIHRvIHRyYW5zbGF0ZS4gT3RoZXJ3aXNlLCB0cmFuc2xhdGUgZnJvbSBcblx0ICAvLyByZWYgZ2Vub21lIHRvIGNvbXBhcmlzb24gZ2Vub21lIGcuXG4gICAgICAgICAgbGV0IHJzO1xuXHQgIGlmIChnID09PSByZykge1xuXHQgICAgICByLmJsb2NrSWQgPSByZy5uYW1lO1xuXHQgICAgICBycyA9IFtyXTtcblx0ICB9XG5cdCAgZWxzZSB7XG5cdCAgICAgIHJzID0gdHIudHJhbnNsYXRlKHJnLCByLmNociwgci5zdGFydCwgci5lbmQsIGcpO1xuXHQgIH1cblx0ICAvLyBub3RlIHRoYXQgdHJhbnNsYXRlZCByZXN1bHRzIGluY2x1ZGUgYmxvY2sgaWRlbnRpZmllcnMsIHdoaWNoIHRlbGxcblx0ICAvLyB1cyB0aGUgYmxvY2sgKGFuZCBoZW5jZSwgYnJ1c2hlcykgaW4gdGhlIGRpc3BsYXkgdG8gdGFyZ2V0LlxuXHQgIHJzLmZvckVhY2goIHJyID0+IHtcblx0ICAgICAgbGV0IGJiID0gdGhpcy5zdmdNYWluLnNlbGVjdChgLnpvb21TdHJpcFtuYW1lPVwiJHtnLm5hbWV9XCJdIC5zQmxvY2tbbmFtZT1cIiR7cnIuYmxvY2tJZH1cIl0gLmJydXNoYClcblx0ICAgICAgYmIuZWFjaCggZnVuY3Rpb24oYikge1xuXHQgICAgICAgICAgYi5icnVzaC5leHRlbnQoW3JyLnN0YXJ0LCByci5lbmRdKTtcblx0XHQgIGQzLnNlbGVjdCh0aGlzKS5jYWxsKGIuYnJ1c2gpO1xuXHQgICAgICB9KTtcblx0ICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBiYkVuZCAoKSB7XG4gICAgICBsZXQgeHQgPSB0aGlzLmJydXNoaW5nLmJydXNoLmV4dGVudCgpO1xuICAgICAgbGV0IHIgPSB0aGlzLmJiR2V0UmVmQ29vcmRzKCk7XG4gICAgICB0aGlzLmJydXNoaW5nID0gbnVsbDtcbiAgICAgIC8vXG4gICAgICBsZXQgc2UgPSBkMy5ldmVudC5zb3VyY2VFdmVudDtcbiAgICAgIGlmIChzZS5jdHJsS2V5IHx8IHNlLmFsdEtleSB8fCBzZS5tZXRhS2V5KSB7XG5cdCAgdGhpcy5jbGVhckJydXNoZXMoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvL1xuICAgICAgaWYgKE1hdGguYWJzKHh0WzBdIC0geHRbMV0pIDw9IDEwKXtcbiAgICAgICAgICAvLyB1c2VyIGNsaWNrZWQgaW5zdGVhZCBvZiBkcmFnZ2VkLiBSZWNlbnRlciB0aGUgdmlldyBpbnN0ZWFkIG9mIHpvb21pbmcuXG5cdCAgbGV0IGN4dCA9IHRoaXMuYXBwLmdldENvbnRleHQoKTtcblx0ICBsZXQgdyA9IGN4dC5lbmQgLSBjeHQuc3RhcnQgKyAxO1xuXHQgIHIuc3RhcnQgLT0gdy8yO1xuXHQgIHIuZW5kICs9IHcvMjtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHNlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgLy8gem9vbSBvdXRcblx0ICBsZXQgY3VycldpZHRoID0gdGhpcy5jb29yZHMuZW5kIC0gdGhpcy5jb29yZHMuc3RhcnQgKyAxO1xuXHQgIGxldCBicnVzaFdpZHRoID0gci5lbmQgLSByLnN0YXJ0ICsgMTtcblx0ICBsZXQgZmFjdG9yID0gY3VycldpZHRoIC8gYnJ1c2hXaWR0aDtcblx0ICBsZXQgbmV3V2lkdGggPSBmYWN0b3IgKiBjdXJyV2lkdGg7XG5cdCAgbGV0IGRzID0gKChyLnN0YXJ0IC0gdGhpcy5jb29yZHMuc3RhcnQgKyAxKS9jdXJyV2lkdGgpICogbmV3V2lkdGg7XG5cdCAgci5zdGFydCA9IHRoaXMuY29vcmRzLnN0YXJ0IC0gZHM7XG5cdCAgci5lbmQgPSByLnN0YXJ0ICsgbmV3V2lkdGggLSAxO1xuICAgICAgfVxuICAgICAgdGhpcy5hcHAuc2V0Q29udGV4dChyKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWdobGlnaHRTdHJpcCAoZywgZWx0KSB7XG5cdGlmIChnID09PSB0aGlzLmN1cnJlbnRITEcpIHJldHVybjtcblx0dGhpcy5jdXJyZW50SExHID0gZztcblx0Ly9cblx0dGhpcy5zdmdNYWluLnNlbGVjdEFsbCgnLnpvb21TdHJpcCcpXG5cdCAgICAuY2xhc3NlZChcImhpZ2hsaWdodGVkXCIsIGQgPT4gZC5nZW5vbWUgPT09IGcpO1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0QWxsKCcuem9vbVN0cmlwSGFuZGxlJylcblx0ICAgIC5jbGFzc2VkKFwiaGlnaGxpZ2h0ZWRcIiwgZCA9PiBkLmdlbm9tZSA9PT0gZyk7XG5cdHRoaXMuYXBwLnNob3dCbG9ja3MoZyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgdXBkYXRlIChjb29yZHMpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgYyA9IHRoaXMuY29vcmRzID0gKGNvb3JkcyB8fCB0aGlzLmNvb3Jkcyk7XG5cdGQzLnNlbGVjdChcIiN6b29tQ29vcmRzXCIpWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCk7XG5cdGQzLnNlbGVjdChcIiN6b29tV1NpemVcIilbMF1bMF0udmFsdWUgPSBNYXRoLnJvdW5kKGMuZW5kIC0gYy5zdGFydCArIDEpXG5cdC8vXG4gICAgICAgIGxldCBtZ3YgPSB0aGlzLmFwcDtcblx0Ly8gd2hlbiB0aGUgdHJhbnNsYXRvciBpcyByZWFkeSwgd2UgY2FuIHRyYW5zbGF0ZSB0aGUgcmVmIGNvb3JkcyB0byBlYWNoIGdlbm9tZSBhbmRcblx0Ly8gaXNzdWUgcmVxdWVzdHMgdG8gbG9hZCB0aGUgZmVhdHVyZXMgaW4gdGhvc2UgcmVnaW9ucy5cblx0bWd2LnNob3dCdXN5KHRydWUpO1xuXHRtZ3YudHJhbnNsYXRvci5yZWFkeSgpLnRoZW4oZnVuY3Rpb24oKXtcblx0ICAgIC8vIE5vdyBpc3N1ZSByZXF1ZXN0cyBmb3IgZmVhdHVyZXMuIE9uZSByZXF1ZXN0IHBlciBnZW5vbWUsIGVhY2ggcmVxdWVzdCBzcGVjaWZpZXMgb25lIG9yIG1vcmVcblx0ICAgIC8vIGNvb3JkaW5hdGUgcmFuZ2VzLlxuXHQgICAgLy8gV2FpdCBmb3IgYWxsIHRoZSBkYXRhIHRvIGJlY29tZSBhdmFpbGFibGUsIHRoZW4gZHJhdy5cblx0ICAgIC8vXG5cdCAgICBsZXQgcHJvbWlzZXMgPSBbXTtcblxuXHQgICAgLy8gRmlyc3QgcmVxdWVzdCBpcyBmb3IgdGhlIHRoZSByZWZlcmVuY2UgZ2Vub21lLiBHZXQgYWxsIHRoZSBmZWF0dXJlcyBpbiB0aGUgcmFuZ2UuXG5cdCAgICBwcm9taXNlcy5wdXNoKG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhtZ3Yuckdlbm9tZSwgW3tcblx0XHQvLyBOZWVkIHRvIHNpbXVsYXRlIHRoZSByZXN1bHRzIGZyb20gY2FsbGluZyB0aGUgdHJhbnNsYXRvci4gXG5cdFx0Ly8gXG5cdFx0Y2hyICAgIDogYy5jaHIsXG5cdFx0c3RhcnQgIDogYy5zdGFydCxcblx0XHRlbmQgICAgOiBjLmVuZCxcblx0XHRpbmRleCAgOiAwLFxuXHRcdGZDaHIgICA6IGMuY2hyLFxuXHRcdGZTdGFydCA6IGMuc3RhcnQsXG5cdFx0ZkVuZCAgIDogYy5lbmQsXG5cdFx0ZkluZGV4ICA6IDAsXG5cdFx0b3JpICAgIDogXCIrXCIsXG5cdFx0YmxvY2tJZDogbWd2LnJHZW5vbWUubmFtZVxuXHRcdH1dKSk7XG5cdCAgICBpZiAoISBzZWxmLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiKSkge1xuXHRcdC8vIEFkZCBhIHJlcXVlc3QgZm9yIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUsIHVzaW5nIHRyYW5zbGF0ZWQgY29vcmRpbmF0ZXMuIFxuXHRcdG1ndi5jR2Vub21lcy5mb3JFYWNoKGNHZW5vbWUgPT4ge1xuXHRcdCAgICBsZXQgcmFuZ2VzID0gbWd2LnRyYW5zbGF0b3IudHJhbnNsYXRlKCBtZ3Yuckdlbm9tZSwgYy5jaHIsIGMuc3RhcnQsIGMuZW5kLCBjR2Vub21lICk7XG5cdFx0ICAgIHByb21pc2VzLnB1c2gobWd2LmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzKGNHZW5vbWUsIHJhbmdlcykpXG5cdFx0fSk7XG5cdCAgICB9XG5cdCAgICAvLyB3aGVuIGV2ZXJ5dGhpbmcgaXMgcmVhZHksIGNhbGwgdGhlIGRyYXcgZnVuY3Rpb25cblx0ICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCBkYXRhID0+IHtcblx0ICAgICAgICBzZWxmLmRyYXcoZGF0YSk7XG5cdFx0bWd2LnNob3dCdXN5KGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBvcmRlclNCbG9ja3MgKHNibG9ja3MpIHtcblx0Ly8gU29ydCB0aGUgc2Jsb2NrcyBpbiBlYWNoIHN0cmlwIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBkcmF3aW5nIG1vZGUuXG5cdGxldCBjbXBGaWVsZCA9IHRoaXMuZG1vZGUgPT09ICdjb21wYXJpc29uJyA/ICdpbmRleCcgOiAnZkluZGV4Jztcblx0bGV0IGNtcEZ1bmMgPSAoYSxiKSA9PiBhLl9fZGF0YV9fW2NtcEZpZWxkXS1iLl9fZGF0YV9fW2NtcEZpZWxkXTtcblx0c2Jsb2Nrcy5mb3JFYWNoKCBzdHJpcCA9PiBzdHJpcC5zb3J0KCBjbXBGdW5jICkgKTtcblx0Ly8gcGl4ZWxzIHBlciBiYXNlXG5cdGxldCBwcGIgPSB0aGlzLndpZHRoIC8gKHRoaXMuY29vcmRzLmVuZCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMSk7XG5cdGxldCBvZmZzZXQgPSBbXTsgLy8gb2Zmc2V0IG9mIHN0YXJ0IHBvc2l0aW9uIG9mIG5leHQgYmxvY2ssIGJ5IHN0cmlwIGluZGV4ICgwPT09cmVmKVxuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdHNibG9ja3MuZWFjaCggZnVuY3Rpb24gKGIsaSxqKSB7IC8vIGI9YmxvY2ssIGk9aW5kZXggd2l0aGluIHN0cmlwLCBqPXN0cmlwIGluZGV4XG5cdCAgICBsZXQgYmxlbiA9IHBwYiAqIChiLmVuZCAtIGIuc3RhcnQgKyAxKTsgLy8gdG90YWwgc2NyZWVuIHdpZHRoIG9mIHRoaXMgc2Jsb2NrXG5cdCAgICBiLmZsaXAgPSBiLm9yaSA9PT0gJy0nICYmIHNlbGYuZG1vZGUgPT09ICdyZWZlcmVuY2UnO1xuXHQgICAgYi54c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW2Iuc3RhcnQsIGIuZW5kXSkucmFuZ2UoIGIuZmxpcCA/IFtibGVuLCAwXSA6IFswLCBibGVuXSApO1xuXHQgICAgbGV0IGR4ID0gaSA9PT0gMCA/IDAgOiBvZmZzZXRbal07XG5cdCAgICBkMy5zZWxlY3QodGhpcykuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7ZHh9LDApYCk7XG5cdCAgICBvZmZzZXRbal0gPSBkeCArIGJsZW4gKyAyO1xuXHR9KTtcblx0Ly9cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgem9vbSB2aWV3IHBhbmVsIHdpdGggdGhlIGdpdmVuIGRhdGEuXG4gICAgLy9cbiAgICAvLyBEYXRhIGlzIHN0cnVjdHVyZWQgYXMgZm9sbG93czpcbiAgICAvLyAgICAgZGF0YSA9IFsgem9vbVN0cmlwX2RhdGEgXVxuICAgIC8vICAgICB6b29tU3RyaXBfZGF0YSA9IHsgZ2Vub21lIFsgem9vbUJsb2NrX2RhdGEgXSB9XG4gICAgLy8gICAgIHpvb21CbG9ja19kYXRhID0geyB4c2NhbGUsIGNociwgc3RhcnQsIGVuZCwgZkNociwgZlN0YXJ0LCBmRW5kLCBvcmksIFsgZmVhdHVyZV9kYXRhIF0gfVxuICAgIC8vICAgICBmZWF0dXJlX2RhdGEgPSB7IG1ncGlkLCBtZ2lpZCwgc3ltYm9sLCBjaHIsIHN0YXJ0LCBlbmQsIHN0cmFuZCwgdHlwZSwgYmlvdHlwZSB9XG4gICAgLy9cbiAgICAvLyBBZ2FpbiwgaW4gRW5nbGlzaDpcbiAgICAvLyAgLSBkYXRhIGlzIGEgbGlzdCBvZiBpdGVtcywgb25lIHBlciBzdHJpcCB0byBiZSBkaXNwbGF5ZWQuIEl0ZW1bMF0gaXMgZGF0YSBmb3IgdGhlIHJlZiBnZW5vbWUuXG4gICAgLy8gICAgSXRlbXNbMStdIGFyZSBkYXRhIGZvciB0aGUgY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy8gIC0gZWFjaCBzdHJpcCBpdGVtIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGEgZ2Vub21lIGFuZCBhIGxpc3Qgb2YgYmxvY2tzLiBJdGVtWzBdIGFsd2F5cyBoYXMgXG4gICAgLy8gICAgYSBzaW5nbGUgYmxvY2suXG4gICAgLy8gIC0gZWFjaCBibG9jayBpcyBhbiBvYmplY3QgY29udGFpbmluZyBhIGNocm9tb3NvbWUsIHN0YXJ0LCBlbmQsIG9yaWVudGF0aW9uLCBldGMsIGFuZCBhIGxpc3Qgb2YgZmVhdHVyZXMuXG4gICAgLy8gIC0gZWFjaCBmZWF0dXJlIGhhcyBjaHIsc3RhcnQsZW5kLHN0cmFuZCx0eXBlLGJpb3R5cGUsbWdwaWRcbiAgICAvL1xuICAgIGRyYXcgKGRhdGEpIHtcblx0Ly8gXG5cdGxldCBzZWxmID0gdGhpcztcblxuXHRsZXQgY2xvc2VkID0gdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIik7XG5cblx0Ly8gcmVzZXQgdGhlIHN2ZyBzaXplIGJhc2VkIG9uIG51bWJlciBvZiBzdHJpcHNcblx0bGV0IHRvdGFsSGVpZ2h0ID0gKHRoaXMuc3RyaXBIZWlnaHQrdGhpcy5zdHJpcEdhcCkgKiBkYXRhLmxlbmd0aCArIDEyO1xuXHR0aGlzLnN2Z1xuXHQgICAgLmF0dHIoXCJoZWlnaHRcIiwgdG90YWxIZWlnaHQpO1xuXG5cdC8vIERyYXcgdGhlIHRpdGxlIG9uIHRoZSB6b29tdmlldyBwb3NpdGlvbiBjb250cm9sc1xuXHRkMy5zZWxlY3QoXCIjem9vbVZpZXcgLnpvb21Db29yZHMgbGFiZWxcIilcblx0ICAgIC50ZXh0KGRhdGFbMF0uZ2Vub21lLmxhYmVsICsgXCIgY29vcmRzXCIpO1xuXHRcblx0Ly8gdGhlIHJlZmVyZW5jZSBnZW5vbWUgYmxvY2sgKGFsd2F5cyBqdXN0IDEgb2YgdGhlc2UpLlxuXHRsZXQgckJsb2NrID0gZGF0YVswXS5ibG9ja3NbMF07XG5cblx0Ly8geC1zY2FsZSBhbmQgeC1heGlzIGJhc2VkIG9uIHRoZSByZWYgZ2Vub21lIGRhdGEuXG5cdHRoaXMueHNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0ICAgIC5kb21haW4oW3JCbG9jay5zdGFydCxyQmxvY2suZW5kXSlcblx0ICAgIC5yYW5nZShbMCx0aGlzLndpZHRoXSk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gZHJhdyB0aGUgYXhpc1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHR0aGlzLmF4aXNGdW5jID0gZDMuc3ZnLmF4aXMoKVxuXHQgICAgLnNjYWxlKHRoaXMueHNjYWxlKVxuXHQgICAgLm9yaWVudChcInRvcFwiKVxuXHQgICAgLm91dGVyVGlja1NpemUoMClcblx0ICAgIC50aWNrcyg1KVxuXHQgICAgO1xuXHR0aGlzLmF4aXMuY2FsbCh0aGlzLmF4aXNGdW5jKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyB6b29tIHN0cmlwcyAob25lIHBlciBnZW5vbWUpXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGxldCB6c3RyaXBzID0gdGhpcy5zdHJpcHNHcnBcblx0ICAgICAgICAuc2VsZWN0QWxsKFwiZy56b29tU3RyaXBcIilcblx0XHQuZGF0YShkYXRhLCBkID0+IGQuZ2Vub21lLm5hbWUpO1xuXHRsZXQgbmV3enMgPSB6c3RyaXBzLmVudGVyKClcblx0ICAgICAgICAuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIixcInpvb21TdHJpcFwiKVxuXHRcdC5hdHRyKFwibmFtZVwiLCBkID0+IGQuZ2Vub21lLm5hbWUpXG5cdFx0Lm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGcpIHtcblx0XHQgICAgc2VsZi5oaWdobGlnaHRTdHJpcChnLmdlbm9tZSwgdGhpcyk7XG5cdFx0fSlcblx0XHQuY2FsbCh0aGlzLmRyYWdnZXIpXG5cdFx0O1xuXHRuZXd6cy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgXCJnZW5vbWVMYWJlbFwiKVxuXHQgICAgLnRleHQoIGQgPT4gZC5nZW5vbWUubGFiZWwpXG5cdCAgICAuYXR0cihcInhcIiwgMClcblx0ICAgIC5hdHRyKFwieVwiLCB0aGlzLmJsb2NrSGVpZ2h0LzIgKyAxMClcblx0ICAgIC5hdHRyKFwiZm9udC1mYW1pbHlcIixcInNhbnMtc2VyaWZcIilcblx0ICAgIC5hdHRyKFwiZm9udC1zaXplXCIsIDEwKVxuXHQgICAgO1xuXHRuZXd6cy5hcHBlbmQoXCJnXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgXCJzQmxvY2tzXCIpO1xuXHRuZXd6cy5hcHBlbmQoXCJyZWN0XCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgXCJ6b29tU3RyaXBIYW5kbGVcIilcblx0ICAgIC5hdHRyKFwieFwiLCAtMTUpXG5cdCAgICAuYXR0cihcInlcIiwgLXRoaXMuYmxvY2tIZWlnaHQgLyAyKVxuXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCAxNSlcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMuYmxvY2tIZWlnaHQpXG5cdCAgICA7XG5cblx0enN0cmlwc1xuXHQgICAgLmNsYXNzZWQoXCJyZWZlcmVuY2VcIiwgZCA9PiBkLmdlbm9tZSA9PT0gdGhpcy5hcHAuckdlbm9tZSlcblx0ICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGcgPT4gYHRyYW5zbGF0ZSgwLCR7Y2xvc2VkID8gdGhpcy50b3BPZmZzZXQgOiBnLmdlbm9tZS56b29tWX0pYClcblx0ICAgIDtcblxuICAgICAgICB6c3RyaXBzLmV4aXQoKVxuXHQgICAgLm9uKFwiLmRyYWdcIiwgbnVsbClcblx0ICAgIC5yZW1vdmUoKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBzeW50ZW55IGJsb2Nrcy4gRWFjaCB6b29tIHN0cmlwIGhhcyBhIGxpc3Qgb2YgMSBvciBtb3JlIHNibG9ja3MuXG5cdC8vIFRoZSByZWZlcmVuY2UgZ2Vub21lIGFsd2F5cyBoYXMganVzdCAxLiBUaGUgY29tcCBnZW5vbWVzIG1hbnkgaGF2ZVxuXHQvLyAxIG9yIG1vcmUgKGFuZCBpbiByYXJlIGNhc2VzLCAwKS5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0bGV0IHVuaXFpZnkgPSBibG9ja3MgPT4ge1xuXHQgICAgLy8gaGVscGVyIGZ1bmN0aW9uLiBXaGVuIHNibG9jayByZWxhdGlvbnNoaXAgYmV0d2VlbiBnZW5vbWVzIGlzIGNvbmZ1c2VkLCByZXF1ZXN0aW5nIG9uZVxuXHQgICAgLy8gcmVnaW9uIGluIGdlbm9tZSBBIGNhbiBlbmQgdXAgcmVxdWVzdGluZyB0aGUgc2FtZSByZWdpb24gaW4gZ2Vub21lIEIgdHdpY2UuIFRoaXMgZnVuY3Rpb25cblx0ICAgIC8vIGF2b2lkcyBkcmF3aW5nIHRoZSBzYW1lIHNibG9jayB0d2ljZS4gKE5COiBSZWFsbHkgbm90IHN1cmUgd2hlcmUgdGhpcyBjaGVjayBpcyBiZXN0IGRvbmUuXG5cdCAgICAvLyBDb3VsZCBwdXNoIGl0IGZhcnRoZXIgdXBzdHJlYW0uKVxuXHQgICAgbGV0IHNlZW4gPSBuZXcgU2V0KCk7XG5cdCAgICByZXR1cm4gYmxvY2tzLmZpbHRlciggYiA9PiB7IFxuXHQgICAgICAgIGlmIChzZWVuLmhhcyhiLmluZGV4KSkgcmV0dXJuIGZhbHNlO1xuXHRcdHNlZW4uYWRkKGIuaW5kZXgpO1xuXHRcdHJldHVybiB0cnVlO1xuXHQgICAgfSk7XG5cdH07XG4gICAgICAgIGxldCBzYmxvY2tzID0genN0cmlwcy5zZWxlY3QoJ1tuYW1lPVwic0Jsb2Nrc1wiXScpLnNlbGVjdEFsbCgnZy5zQmxvY2snKVxuXHQgICAgLmRhdGEoZCA9PiB7XG5cdCAgICAgICAgcmV0dXJuIHVuaXFpZnkoZC5ibG9ja3MpO1xuXHQgICAgfSwgYiA9PiBiLmJsb2NrSWQpO1xuXHRsZXQgbmV3c2JzID0gc2Jsb2Nrcy5lbnRlcigpXG5cdCAgICAuYXBwZW5kKFwiZ1wiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBiID0+IFwic0Jsb2NrIFwiICsgKGIub3JpPT09XCIrXCIgPyBcInBsdXNcIiA6IGIub3JpPT09XCItXCIgPyBcIm1pbnVzXCI6IFwiY29uZnVzZWRcIikgKyAoYi5jaHIgIT09IGIuZkNociA/IFwiIHRyYW5zbG9jYXRpb25cIiA6IFwiXCIpKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGI9PmIuaW5kZXgpXG5cdCAgICA7XG5cdGxldCBsMCA9IG5ld3Nicy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsIFwibGF5ZXIwXCIpO1xuXHRsZXQgbDEgPSBuZXdzYnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLCBcImxheWVyMVwiKTtcblxuXHQvLyByZWN0YW5nbGUgZm9yIHRoZSB3aG9sZSBibG9ja1xuXHRsMC5hcHBlbmQoXCJyZWN0XCIpLmF0dHIoXCJjbGFzc1wiLCBcImJsb2NrXCIpO1xuXHQvLyB0aGUgYXhpcyBsaW5lXG5cdGwwLmFwcGVuZChcImxpbmVcIikuYXR0cihcImNsYXNzXCIsXCJheGlzXCIpIDtcblx0Ly8gbGFiZWxcblx0bDAuYXBwZW5kKFwidGV4dFwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwiYmxvY2tMYWJlbFwiKSA7XG5cdC8vIGJydXNoXG5cdGwwLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsXCJicnVzaFwiKTtcblxuXHRzYmxvY2tzLmV4aXQoKS5yZW1vdmUoKTtcblxuXHR0aGlzLm9yZGVyU0Jsb2NrcyhzYmxvY2tzKTtcblxuXHQvLyBzeW50ZW55IGJsb2NrIGxhYmVsc1xuXHRzYmxvY2tzLnNlbGVjdChcInRleHQuYmxvY2tMYWJlbFwiKVxuXHQgICAgLnRleHQoIGIgPT4gYi5jaHIgKVxuXHQgICAgLmF0dHIoXCJ4XCIsIGIgPT4gKGIueHNjYWxlKGIuc3RhcnQpICsgYi54c2NhbGUoYi5lbmQpKS8yIClcblx0ICAgIC5hdHRyKFwieVwiLCB0aGlzLmJsb2NrSGVpZ2h0IC8gMiArIDEwKVxuXHQgICAgO1xuXG5cdC8vIHN5bnRlbnkgYmxvY2sgcmVjdHNcblx0c2Jsb2Nrcy5zZWxlY3QoXCJyZWN0LmJsb2NrXCIpXG5cdCAgLmF0dHIoXCJ4XCIsICAgICBiID0+IGIueHNjYWxlKGIuZmxpcCA/IGIuZW5kIDogYi5zdGFydCkpXG5cdCAgLmF0dHIoXCJ5XCIsICAgICBiID0+IC10aGlzLmJsb2NrSGVpZ2h0IC8gMilcblx0ICAuYXR0cihcIndpZHRoXCIsIGIgPT4gTWF0aC5hYnMoYi54c2NhbGUoYi5lbmQpLWIueHNjYWxlKGIuc3RhcnQpKSlcblx0ICAuYXR0cihcImhlaWdodFwiLHRoaXMuYmxvY2tIZWlnaHQpO1xuXG5cdC8vIHN5bnRlbnkgYmxvY2sgYXhpcyBsaW5lc1xuXHRzYmxvY2tzLnNlbGVjdChcImxpbmUuYXhpc1wiKVxuXHQgICAgLmF0dHIoXCJ4MVwiLCBiID0+IGIueHNjYWxlLnJhbmdlKClbMF0pXG5cdCAgICAuYXR0cihcInkxXCIsIDApXG5cdCAgICAuYXR0cihcIngyXCIsIGIgPT4gYi54c2NhbGUucmFuZ2UoKVsxXSlcblx0ICAgIC5hdHRyKFwieTJcIiwgMClcblx0ICAgIDtcblxuXHQvLyBicnVzaFxuXHRzYmxvY2tzLnNlbGVjdChcImcuYnJ1c2hcIilcblx0ICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGIgPT4gYHRyYW5zbGF0ZSgwLCR7dGhpcy5ibG9ja0hlaWdodCAvIDJ9KWApXG5cdCAgICAuZWFjaChmdW5jdGlvbihiKSB7XG5cdFx0aWYgKCFiLmJydXNoKSB7XG5cdFx0ICAgIGIuYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxuXHRcdFx0Lm9uKFwiYnJ1c2hzdGFydFwiLCBmdW5jdGlvbigpeyBzZWxmLmJiU3RhcnQoIGIsIHRoaXMgKTsgfSlcblx0XHRcdC5vbihcImJydXNoXCIsICAgICAgZnVuY3Rpb24oKXsgc2VsZi5iYkJydXNoKCBiLCB0aGlzICk7IH0pXG5cdFx0XHQub24oXCJicnVzaGVuZFwiLCAgIGZ1bmN0aW9uKCl7IHNlbGYuYmJFbmQoIGIsIHRoaXMgKTsgfSlcblx0XHR9XG5cdFx0Yi5icnVzaC54KGIueHNjYWxlKS5jbGVhcigpO1xuXHRcdGQzLnNlbGVjdCh0aGlzKS5jYWxsKGIuYnJ1c2gpO1xuXHQgICAgfSlcblx0ICAgIC5zZWxlY3RBbGwoXCJyZWN0XCIpXG5cdFx0LmF0dHIoXCJoZWlnaHRcIiwgMTApO1xuXG5cdHRoaXMuZHJhd0ZlYXR1cmVzKHNibG9ja3MpO1xuXG5cdC8vXG5cdHRoaXMuYXBwLmZhY2V0TWFuYWdlci5hcHBseUFsbCgpO1xuXG5cdC8vIFdlIG5lZWQgdG8gbGV0IHRoZSB2aWV3IHJlbmRlciBiZWZvcmUgZG9pbmcgdGhlIGhpZ2hsaWdodGluZywgc2luY2UgaXQgZGVwZW5kcyBvblxuXHQvLyB0aGUgcG9zaXRpb25zIG9mIHJlY3RhbmdsZXMgaW4gdGhlIHNjZW5lLlxuXHR3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG5cdCAgICAvL3RoaXMuc2V0R2Vub21lWU9yZGVyKCB0aGlzLmdlbm9tZXMubWFwKGcgPT4gZy5uYW1lKSApO1xuXHQgICAgLy93aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLmhpZ2hsaWdodCgpLCA1MCk7XG5cdCAgICB0aGlzLmhpZ2hsaWdodCgpO1xuXHR9LCA1MCk7XG4gICAgfTtcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSBmZWF0dXJlcyAocmVjdGFuZ2xlcykgZm9yIHRoZSBzcGVjaWZpZWQgc3ludGVueSBibG9ja3MuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgc2Jsb2NrcyAoRDMgc2VsZWN0aW9uIG9mIGcuc2Jsb2NrIG5vZGVzKSAtIG11bHRpbGV2ZWwgc2VsZWN0aW9uLlxuICAgIC8vICAgICAgICBBcnJheSAoY29ycmVzcG9uZGluZyB0byBzdHJpcHMpIG9mIGFycmF5cyBvZiBzeW50ZW55IGJsb2Nrcy5cbiAgICAvL1xuICAgIGRyYXdGZWF0dXJlcyAoc2Jsb2Nrcykge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdC8vXG5cdC8vIG5ldmVyIGRyYXcgdGhlIHNhbWUgZmVhdHVyZSB0d2ljZVxuXHRsZXQgZHJhd24gPSBuZXcgU2V0KCk7XHQvLyBzZXQgb2YgbWdwaWRzIG9mIGRyYXduIGZlYXR1cmVzXG5cdGxldCBmaWx0ZXJEcmF3biA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICAvLyByZXR1cm5zIHRydWUgaWYgd2UndmUgbm90IHNlZW4gdGhpcyBvbmUgYmVmb3JlLlxuXHQgICAgLy8gcmVnaXN0ZXJzIHRoYXQgd2UndmUgc2VlbiBpdC5cblx0ICAgIGxldCBmaWQgPSBmLm1ncGlkO1xuXHQgICAgbGV0IHYgPSAhIGRyYXduLmhhcyhmaWQpO1xuXHQgICAgZHJhd24uYWRkKGZpZCk7XG5cdCAgICByZXR1cm4gdjtcblx0fTtcblx0bGV0IGZlYXRzID0gc2Jsb2Nrcy5zZWxlY3QoJ1tuYW1lPVwibGF5ZXIxXCJdJykuc2VsZWN0QWxsKFwiLmZlYXR1cmVcIilcblx0ICAgIC5kYXRhKGQ9PmQuZmVhdHVyZXMuZmlsdGVyKGZpbHRlckRyYXduKSwgZD0+ZC5tZ3BpZCk7XG5cdGZlYXRzLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0bGV0IG5ld0ZlYXRzID0gZmVhdHMuZW50ZXIoKS5hcHBlbmQoXCJyZWN0XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsIGYgPT4gXCJmZWF0dXJlXCIgKyAoZi5zdHJhbmQ9PT1cIi1cIiA/IFwiIG1pbnVzXCIgOiBcIiBwbHVzXCIpKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGYgPT4gZi5tZ3BpZClcblx0ICAgIC5zdHlsZShcImZpbGxcIiwgZiA9PiBzZWxmLmFwcC5jc2NhbGUoZi5nZXRNdW5nZWRUeXBlKCkpKVxuXHQgICAgO1xuXG5cdC8vIGRyYXcgdGhlIHJlY3RhbmdsZXNcblxuXHQvLyByZXR1cm5zIHRoZSBzeW50ZW55IGJsb2NrIGNvbnRhaW5pbmcgdGhpcyBmZWF0dXJlXG5cdGxldCBmQmxvY2sgPSBmdW5jdGlvbiAoZmVhdEVsdCkge1xuXHQgICAgbGV0IGJsa0VsdCA9IGZlYXRFbHQucGFyZW50Tm9kZTtcblx0ICAgIHJldHVybiBibGtFbHQuX19kYXRhX187XG5cdH1cblx0bGV0IGZ4ID0gZnVuY3Rpb24oZikge1xuXHQgICAgbGV0IGIgPSBmQmxvY2sodGhpcyk7XG5cdCAgICByZXR1cm4gYi54c2NhbGUoZi5zdGFydClcblx0fTtcblx0bGV0IGZ3ID0gZnVuY3Rpb24gKGYpIHtcblx0ICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgcmV0dXJuIE1hdGguYWJzKGIueHNjYWxlKGYuZW5kKSAtIGIueHNjYWxlKGYuc3RhcnQpKSArIDE7XG5cdH07XG5cdGxldCBmeSA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICAgICBsZXQgYiA9IGZCbG9jayh0aGlzKTtcblx0ICAgICAgIGlmIChmLnN0cmFuZCA9PSBcIitcIil7XG5cdFx0ICAgaWYgKGIuZmxpcCkgXG5cdFx0ICAgICAgIHJldHVybiBzZWxmLmxhbmVIZWlnaHQqZi5sYW5lIC0gc2VsZi5mZWF0SGVpZ2h0OyBcblx0XHQgICBlbHNlIFxuXHRcdCAgICAgICByZXR1cm4gLXNlbGYubGFuZUhlaWdodCpmLmxhbmU7XG5cdCAgICAgICB9XG5cdCAgICAgICBlbHNlIHtcblx0XHQgICAvLyBmLmxhbmUgaXMgbmVnYXRpdmUgZm9yIFwiLVwiIHN0cmFuZFxuXHRcdCAgIGlmIChiLmZsaXApIFxuXHRcdCAgICAgICByZXR1cm4gc2VsZi5sYW5lSGVpZ2h0KmYubGFuZTtcblx0XHQgICBlbHNlXG5cdFx0ICAgICAgIHJldHVybiAtc2VsZi5sYW5lSGVpZ2h0KmYubGFuZSAtIHNlbGYuZmVhdEhlaWdodDsgXG5cdCAgICAgICB9XG5cdCAgIH07XG5cblx0ZmVhdHNcblx0ICAuYXR0cihcInhcIiwgZngpXG5cdCAgLmF0dHIoXCJ3aWR0aFwiLCBmdylcblx0ICAuYXR0cihcInlcIiwgZnkpXG5cdCAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5mZWF0SGVpZ2h0KVxuXHQgIDtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIGZlYXR1cmUgaGlnaGxpZ2h0aW5nIGluIHRoZSBjdXJyZW50IHpvb20gdmlldy5cbiAgICAvLyBGZWF0dXJlcyB0byBiZSBoaWdobGlnaHRlZCBpbmNsdWRlIHRob3NlIGluIHRoZSBoaUZlYXRzIGxpc3QgcGx1cyB0aGUgZmVhdHVyZVxuICAgIC8vIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHJlY3RhbmdsZSBhcmd1bWVudCwgaWYgZ2l2ZW4uIChUaGUgbW91c2VvdmVyIGZlYXR1cmUuKVxuICAgIC8vXG4gICAgLy8gRHJhd3MgZmlkdWNpYWxzIGZvciBmZWF0dXJlcyBpbiB0aGlzIGxpc3QgdGhhdDpcbiAgICAvLyAxLiBvdmVybGFwIHRoZSBjdXJyZW50IHpvb21WaWV3IGNvb3JkIHJhbmdlXG4gICAgLy8gMi4gYXJlIG5vdCByZW5kZXJlZCBpbnZpc2libGUgYnkgY3VycmVudCBmYWNldCBzZXR0aW5nc1xuICAgIC8vXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBjdXJyZW50IChyZWN0IGVsZW1lbnQpIE9wdGlvbmFsLiBBZGQnbCByZWN0YW5nbGUgZWxlbWVudCwgZS5nLiwgdGhhdCB3YXMgbW91c2VkLW92ZXIuIEhpZ2hsaWdodGluZ1xuICAgIC8vICAgICAgICB3aWxsIGluY2x1ZGUgdGhlIGZlYXR1cmUgY29ycmVzcG9uZGluZyB0byB0aGlzIHJlY3QgYWxvbmcgd2l0aCB0aG9zZSBpbiB0aGUgaGlnaGxpZ2h0IGxpc3QuXG4gICAgLy8gICAgcHVsc2VDdXJyZW50IChib29sZWFuKSBJZiB0cnVlIGFuZCBjdXJyZW50IGlzIGdpdmVuLCBjYXVzZSBpdCB0byBwdWxzZSBicmllZmx5LlxuICAgIC8vXG4gICAgaGlnaGxpZ2h0IChjdXJyZW50LCBwdWxzZUN1cnJlbnQpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHQvLyBjdXJyZW50J3MgZmVhdHVyZVxuXHRsZXQgY3VyckZlYXQgPSBjdXJyZW50ID8gKGN1cnJlbnQgaW5zdGFuY2VvZiBGZWF0dXJlID8gY3VycmVudCA6IGN1cnJlbnQuX19kYXRhX18pIDogbnVsbDtcblx0Ly8gY3JlYXRlIGxvY2FsIGNvcHkgb2YgaGlGZWF0cywgd2l0aCBjdXJyZW50IGZlYXR1cmUgYWRkZWRcblx0bGV0IGhpRmVhdHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmhpRmVhdHMpO1xuXHRpZiAoY3VyckZlYXQpIHtcblx0ICAgIGhpRmVhdHNbY3VyckZlYXQuaWRdID0gY3VyckZlYXQuaWQ7XG5cdH1cblxuXHQvLyBGaWx0ZXIgYWxsIGZlYXR1cmVzIChyZWN0YW5nbGVzKSBpbiB0aGUgc2NlbmUgZm9yIHRob3NlIGJlaW5nIGhpZ2hsaWdodGVkLlxuXHQvLyBBbG9uZyB0aGUgd2F5LCBidWlsZCBpbmRleCBtYXBwaW5nIGZlYXR1cmUgaWQgdG8gaXRzIFwic3RhY2tcIiBvZiBlcXVpdmFsZW50IGZlYXR1cmVzLFxuXHQvLyBpLmUuIGEgbGlzdCBvZiBpdHMgZ2Vub2xvZ3Mgc29ydGVkIGJ5IHkgY29vcmRpbmF0ZS5cblx0Ly8gQWxzbywgbWFrZSBlYWNoIGhpZ2hsaWdodGVkIGZlYXR1cmUgdGFsbGVyIChzbyBpdCBzdGFuZHMgYWJvdmUgaXRzIG5laWdoYm9ycylcblx0Ly8gYW5kIGdpdmUgaXQgdGhlIFwiLmhpZ2hsaWdodFwiIGNsYXNzLlxuXHQvL1xuXHRsZXQgc3RhY2tzID0ge307IC8vIGZpZCAtPiBbIHJlY3RzIF0gXG5cdGxldCBkaCA9IHRoaXMuYmxvY2tIZWlnaHQvMiAtIHRoaXMuZmVhdEhlaWdodDtcbiAgICAgICAgbGV0IGZlYXRzID0gdGhpcy5zdmdNYWluLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpXG5cdCAgLy8gZmlsdGVyIHJlY3QuZmVhdHVyZXMgZm9yIHRob3NlIGluIHRoZSBoaWdobGlnaHQgbGlzdFxuXHQgIC5maWx0ZXIoZnVuY3Rpb24oZmYpe1xuXHQgICAgICAvLyBoaWdobGlnaHQgZmYgaWYgZWl0aGVyIGlkIGlzIGluIHRoZSBsaXN0IEFORCBpdCdzIG5vdCBiZWVuIGhpZGRlblxuXHQgICAgICBsZXQgbWdpID0gaGlGZWF0c1tmZi5tZ2lpZF07XG5cdCAgICAgIGxldCBtZ3AgPSBoaUZlYXRzW2ZmLm1ncGlkXTtcblx0ICAgICAgbGV0IHNob3dpbmcgPSBkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJkaXNwbGF5XCIpICE9PSBcIm5vbmVcIjtcblx0ICAgICAgbGV0IGhsID0gc2hvd2luZyAmJiAobWdpIHx8IG1ncCk7XG5cdCAgICAgIGlmIChobCkge1xuXHRcdCAgLy8gZm9yIGVhY2ggaGlnaGxpZ2h0ZWQgZmVhdHVyZSwgYWRkIGl0cyByZWN0YW5nbGUgdG8gdGhlIGxpc3Rcblx0XHQgIGxldCBrID0gZmYuaWQ7XG5cdFx0ICBpZiAoIXN0YWNrc1trXSkgc3RhY2tzW2tdID0gW11cblx0XHQgIHN0YWNrc1trXS5wdXNoKHRoaXMpXG5cdCAgICAgIH1cblx0ICAgICAgLy8gXG5cdCAgICAgIGQzLnNlbGVjdCh0aGlzKVxuXHRcdCAgLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgaGwpXG5cdFx0ICAuY2xhc3NlZChcImN1cnJlbnRcIiwgaGwgJiYgY3VyckZlYXQgJiYgdGhpcy5fX2RhdGFfXy5pZCA9PT0gY3VyckZlYXQuaWQpXG5cdFx0ICAuY2xhc3NlZChcImV4dHJhXCIsIHB1bHNlQ3VycmVudCAmJiBmZiA9PT0gY3VyckZlYXQpXG5cdCAgICAgIHJldHVybiBobDtcblx0ICB9KVxuXHQgIDtcblxuXHQvLyBidWlsZCBkYXRhIGFycmF5IGZvciBkcmF3aW5nIGZpZHVjaWFscyBiZXR3ZWVuIGVxdWl2YWxlbnQgZmVhdHVyZXNcblx0bGV0IGRhdGEgPSBbXTtcblx0Zm9yIChsZXQgayBpbiBzdGFja3MpIHtcblx0ICAgIC8vIGZvciBlYWNoIGhpZ2hsaWdodGVkIGZlYXR1cmUsIHNvcnQgdGhlIHJlY3RhbmdsZXMgaW4gaXRzIGxpc3QgYnkgWS1jb29yZGluYXRlXG5cdCAgICBsZXQgcmVjdHMgPSBzdGFja3Nba107XG5cdCAgICByZWN0cy5zb3J0KCAoYSxiKSA9PiBwYXJzZUZsb2F0KGEuZ2V0QXR0cmlidXRlKFwieVwiKSkgLSBwYXJzZUZsb2F0KGIuZ2V0QXR0cmlidXRlKFwieVwiKSkgKTtcblx0ICAgIHJlY3RzLnNvcnQoIChhLGIpID0+IHtcblx0XHRyZXR1cm4gYS5fX2RhdGFfXy5nZW5vbWUuem9vbVkgLSBiLl9fZGF0YV9fLmdlbm9tZS56b29tWTtcblx0ICAgIH0pO1xuXHQgICAgLy8gV2FudCBhIHBvbHlnb24gYmV0d2VlbiBlYWNoIHN1Y2Nlc3NpdmUgcGFpciBvZiBpdGVtcy4gVGhlIGZvbGxvd2luZyBjcmVhdGVzIGEgbGlzdCBvZlxuXHQgICAgLy8gbiBwYWlycywgd2hlcmUgcmVjdFtpXSBpcyBwYWlyZWQgd2l0aCByZWN0W2krMV0uIFRoZSBsYXN0IHBhaXIgY29uc2lzdHMgb2YgdGhlIGxhc3Rcblx0ICAgIC8vIHJlY3RhbmdsZSBwYWlyZWQgd2l0aCB1bmRlZmluZWQuIChXZSB3YW50IHRoaXMuKVxuXHQgICAgbGV0IHBhaXJzID0gcmVjdHMubWFwKChyLCBpKSA9PiBbcixyZWN0c1tpKzFdXSk7XG5cdCAgICAvLyBBZGQgYSBjbGFzcyAoXCJjdXJyZW50XCIpIGZvciB0aGUgcG9seWdvbnMgYXNzb2NpYXRlZCB3aXRoIHRoZSBtb3VzZW92ZXIgZmVhdHVyZSBzbyB0aGV5XG5cdCAgICAvLyBjYW4gYmUgZGlzdGluZ3Vpc2hlZCBmcm9tIG90aGVycy5cblx0ICAgIGRhdGEucHVzaCh7IGZpZDogaywgcmVjdHM6IHBhaXJzLCBjbHM6IChjdXJyRmVhdCAmJiBjdXJyRmVhdC5pZCA9PT0gayA/ICdjdXJyZW50JyA6ICcnKSB9KTtcblx0fVxuXHR0aGlzLmRyYXdGaWR1Y2lhbHMoZGF0YSwgY3VyckZlYXQpO1xuXG5cdC8vIEZJWE1FOiByZWFjaG92ZXJcblx0dGhpcy5hcHAuZmVhdHVyZURldGFpbHMudXBkYXRlKGN1cnJGZWF0KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyBwb2x5Z29ucyB0aGF0IGNvbm5lY3QgaGlnaGxpZ2h0ZWQgZmVhdHVyZXMgaW4gdGhlIHZpZXdcbiAgICAvLyBBcmdzOlxuICAgIC8vICAgZGF0YSA6IGxpc3Qgb2Yge1xuICAgIC8vICAgICAgIGZpZDogZmVhdHVyZS1pZCwgXG4gICAgLy8gICAgICAgY2xzOiBleHRyYSBjbGFzcyBmb3IgLmZlYXR1cmVNYXJrIGdyb3VwLFxuICAgIC8vICAgICAgIHJlY3RzOiBsaXN0IG9mIFtyZWN0MSxyZWN0Ml0gcGFpcnMsIFxuICAgIC8vICAgICAgIH1cbiAgICAvLyAgIGN1cnJGZWF0IDogY3VycmVudCAobW91c2VvdmVyKSBmZWF0dXJlIChpZiBhbnkpXG4gICAgLy9cbiAgICBkcmF3RmlkdWNpYWxzIChkYXRhLCBjdXJyRmVhdCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdC8vXG5cdC8vIHB1dCBmaWR1Y2lhbCBtYXJrcyBpbiB0aGVpciBvd24gZ3JvdXAgXG5cdGxldCBmR3JwID0gdGhpcy5maWR1Y2lhbHMuY2xhc3NlZChcImhpZGRlblwiLCBmYWxzZSk7XG5cblx0Ly8gQmluZCBmaXJzdCBsZXZlbCBkYXRhIHRvIFwiZmVhdHVyZU1hcmtzXCIgZ3JvdXBzXG5cdGxldCBmZkdycHMgPSBmR3JwLnNlbGVjdEFsbChcImcuZmVhdHVyZU1hcmtzXCIpXG5cdCAgICAuZGF0YShkYXRhLCBkID0+IGQuZmlkKTtcblx0ZmZHcnBzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGQgPT4gZC5maWQpO1xuXHRmZkdycHMuZXhpdCgpLnJlbW92ZSgpO1xuXHQvL1xuXHRmZkdycHMuYXR0cihcImNsYXNzXCIsZCA9PiBcImZlYXR1cmVNYXJrcyBcIiArIChkLmNscyB8fCBcIlwiKSlcblxuXHQvLyBEcmF3IGZlYXR1cmUgbGFiZWxzLiBFYWNoIGxhYmVsIGlzIGRyYXduIG9uY2UsIGFib3ZlIHRoZSBmaXJzdCByZWN0YW5nbGUgaW4gaXRzIGxpc3QuXG5cdC8vIFxuXHRsZXQgbGFiZWxzID0gZmZHcnBzLnNlbGVjdEFsbCgndGV4dC5mZWF0TGFiZWwnKVxuXHQgICAgLmRhdGEoZCA9PiBbeyBmaWQ6IGQuZmlkLCByZWN0OiBkLnJlY3RzWzBdWzBdLCB0cmVjdDogY29vcmRzQWZ0ZXJUcmFuc2Zvcm0oZC5yZWN0c1swXVswXSkgfV0pO1xuXHRsYWJlbHMuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKS5hdHRyKCdjbGFzcycsJ2ZlYXRMYWJlbCcpO1xuXHRsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xuXHRsYWJlbHNcblx0ICAuYXR0cihcInhcIiwgZCA9PiBkLnRyZWN0LnggKyBkLnRyZWN0LndpZHRoLzIgKVxuXHQgIC5hdHRyKFwieVwiLCBkID0+IGQucmVjdC5fX2RhdGFfXy5nZW5vbWUuem9vbVkgLSAzKVxuXHQgIC50ZXh0KGQgPT4ge1xuXHQgICAgICAgbGV0IGYgPSBkLnJlY3QuX19kYXRhX187XG5cdCAgICAgICBsZXQgc3ltID0gZi5zeW1ib2wgfHwgZi5tZ3BpZDtcblx0ICAgICAgIHJldHVybiBzeW07XG5cdCAgfSk7XG5cblx0Ly8gUHV0IGEgcmVjdGFuZ2xlIGJlaGluZCBlYWNoIGxhYmVsIChhcyBhIGJhY2tncm91bmQpXG5cdGxldCBsYmxCb3hEYXRhID0gbGFiZWxzLm1hcChsYmwgPT4gbGJsWzBdLmdldEJCb3goKSlcblx0bGV0IGxibEJveGVzID0gZmZHcnBzLnNlbGVjdEFsbCgncmVjdC5mZWF0TGFiZWxCb3gnKVxuXHQgICAgLmRhdGEoKGQsaSkgPT4gW2xibEJveERhdGFbaV1dKTtcblx0bGJsQm94ZXMuZW50ZXIoKS5pbnNlcnQoJ3JlY3QnLCc6Zmlyc3QtY2hpbGQnKS5hdHRyKCdjbGFzcycsJ2ZlYXRMYWJlbEJveCcpO1xuXHRsYmxCb3hlcy5leGl0KCkucmVtb3ZlKCk7XG5cdGxibEJveGVzXG5cdCAgICAuYXR0cihcInhcIiwgICAgICBiYiA9PiBiYi54LTIpXG5cdCAgICAuYXR0cihcInlcIiwgICAgICBiYiA9PiBiYi55LTEpXG5cdCAgICAuYXR0cihcIndpZHRoXCIsICBiYiA9PiBiYi53aWR0aCs0KVxuXHQgICAgLmF0dHIoXCJoZWlnaHRcIiwgYmIgPT4gYmIuaGVpZ2h0KzIpXG5cdCAgICA7XG5cdFxuXHQvLyBpZiB0aGVyZSBpcyBhIGN1cnJGZWF0LCBtb3ZlIGl0cyBmaWR1Y2lhbHMgdG8gdGhlIGVuZCAoc28gdGhleSdyZSBvbiB0b3Agb2YgZXZlcnlvbmUgZWxzZSlcblx0aWYgKGN1cnJGZWF0KSB7XG5cdCAgICAvLyBnZXQgbGlzdCBvZiBncm91cCBlbGVtZW50cyBmcm9tIHRoZSBkMyBzZWxlY3Rpb25cblx0ICAgIGxldCBmZkxpc3QgPSBmZkdycHNbMF07XG5cdCAgICAvLyBmaW5kIHRoZSBvbmUgd2hvc2UgZmVhdHVyZSBpcyBjdXJyRmVhdFxuXHQgICAgbGV0IGkgPSAtMTtcblx0ICAgIGZmTGlzdC5mb3JFYWNoKCAoZyxqKSA9PiB7IGlmIChnLl9fZGF0YV9fLmZpZCA9PT0gY3VyckZlYXQuaWQpIGkgPSBqOyB9KTtcblx0ICAgIC8vIGlmIHdlIGZvdW5kIGl0IGFuZCBpdCdzIG5vdCBhbHJlYWR5IHRoZSBsYXN0LCBtb3ZlIGl0IHRvIHRoZVxuXHQgICAgLy8gbGFzdCBwb3NpdGlvbiBhbmQgcmVvcmRlciBpbiB0aGUgRE9NLlxuXHQgICAgaWYgKGkgPj0gMCkge1xuXHRcdGxldCBsYXN0aSA9IGZmTGlzdC5sZW5ndGggLSAxO1xuXHQgICAgICAgIGxldCB4ID0gZmZMaXN0W2ldO1xuXHRcdGZmTGlzdFtpXSA9IGZmTGlzdFtsYXN0aV07XG5cdFx0ZmZMaXN0W2xhc3RpXSA9IHg7XG5cdFx0ZmZHcnBzLm9yZGVyKCk7XG5cdCAgICB9XG5cdH1cblx0XG5cdC8vIEJpbmQgc2Vjb25kIGxldmVsIGRhdGEgKHJlY3RhbmdsZSBwYWlycykgdG8gcG9seWdvbnMgaW4gdGhlIGdyb3VwXG5cdGxldCBwZ29ucyA9IGZmR3Jwcy5zZWxlY3RBbGwoXCJwb2x5Z29uXCIpXG5cdCAgICAuZGF0YShkPT5kLnJlY3RzLmZpbHRlcihyID0+IHJbMF0gJiYgclsxXSkpO1xuXHRwZ29ucy5leGl0KCkucmVtb3ZlKCk7XG5cdHBnb25zLmVudGVyKCkuYXBwZW5kKFwicG9seWdvblwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwiZmlkdWNpYWxcIilcblx0ICAgIDtcblx0Ly9cblx0cGdvbnMuYXR0cihcInBvaW50c1wiLCByID0+IHtcblx0ICAgIC8vIHBvbHlnb24gY29ubmVjdHMgYm90dG9tIGNvcm5lcnMgb2YgMXN0IHJlY3QgdG8gdG9wIGNvcm5lcnMgb2YgMm5kIHJlY3Rcblx0ICAgIGxldCBjMSA9IGNvb3Jkc0FmdGVyVHJhbnNmb3JtKHJbMF0pOyAvLyB0cmFuc2Zvcm0gY29vcmRzIGZvciAxc3QgcmVjdFxuXHQgICAgbGV0IGMyPSBjb29yZHNBZnRlclRyYW5zZm9ybShyWzFdKTsgIC8vIHRyYW5zZm9ybSBjb29yZHMgZm9yIDJuZCByZWN0XG5cdCAgICAvLyBmb3VyIHBvbHlnb24gcG9pbnRzXG5cdCAgICBsZXQgcyA9IGAke2MxLnh9LCR7YzEueStjMS5oZWlnaHR9ICR7YzIueH0sJHtjMi55fSAke2MyLngrYzIud2lkdGh9LCR7YzIueX0gJHtjMS54K2MxLndpZHRofSwke2MxLnkrYzEuaGVpZ2h0fWBcblx0ICAgIHJldHVybiBzO1xuXHR9KVxuXHQvLyBtb3VzaW5nIG92ZXIgdGhlIGZpZHVjaWFsIGhpZ2hsaWdodHMgKGFzIGlmIHRoZSB1c2VyIGhhZCBtb3VzZWQgb3ZlciB0aGUgZmVhdHVyZSBpdHNlbGYpXG5cdC5vbihcIm1vdXNlb3ZlclwiLCAocCkgPT4ge1xuXHQgICAgaWYgKCFkMy5ldmVudC5jdHJsS2V5KVxuXHQgICAgICAgIHRoaXMuaGlnaGxpZ2h0KHBbMF0pO1xuXHR9KVxuXHQub24oXCJtb3VzZW91dFwiLCAgKHApID0+IHtcblx0ICAgIGlmICghZDMuZXZlbnQuY3RybEtleSlcblx0ICAgICAgICB0aGlzLmhpZ2hsaWdodCgpO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaGlkZUZpZHVjaWFscyAoKSB7XG5cdHRoaXMuc3ZnTWFpbi5zZWxlY3QoXCJnLmZpZHVjaWFsc1wiKVxuXHQgICAgLmNsYXNzZWQoXCJoaWRkZW5cIiwgdHJ1ZSk7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgWm9vbVZpZXdcblxuZXhwb3J0IHsgWm9vbVZpZXcgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1pvb21WaWV3LmpzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9