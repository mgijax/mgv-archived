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
    let abLeft = { chr:a.chr, start:a.start,                  end:Math.min(a.end, b.start-1) };
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
	    highlight: Object.keys(this.zoomView.hiFeats)
	}
    }
    //----------------------------------------------
    // Returns a sanitized version of the argument configuration object.
    // The sanitized version:
    //     - has a setting for every parameter. Parameters not specified in the argument are (generally) filled
    //     in with their current values.
    //     - is always valid, eg
    //     	- has a list of 1 or more valid genomes, with one of them designated as the ref
    //     	- has a valid coordinate range
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
	cfg.start = Math.max( 1, typeof(c.start) === "number" ? c.start : this.coords ? this.coords.start : 1 );

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
	cfg.end = cfg.chr ? Math.min(cfg.end,   cfg.chr.length) : cfg.end;

	// Set cfg.highlight
	//    with fallback to current highlight
	//        with fallback to []
	cfg.highlight = c.highlight || this.zoomView.highlighted || [];

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
	this.zoomView.update(this.coords)
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
	return `${ref}&${genomes}&${coords}&${hls}`;
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
        let gc = this.cache[genome.name] = (this.cache[genome.name] || {});
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
	//console.log("Requesting:", genome.name, newranges);
	return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* d3json */])(url).then(function(blocks){
	    blocks.forEach( b => self._registerBlock(genome, b) );
	    return true;
	});
    }
    //----------------------------------------------
    // Ensures that all features with the given IDs in the specified genome
    // are in the cache. Returns a promise that resolves to true when the condition is met.
    _ensureFeaturesById (genome, ids) {
	// subtract ids of features already in the cache
	let needids = ids.filter(i => {
	    if (i in this.featCache) {
	        return false;
	    }
	    else if (i in this.mgiCache) {
		let fs = this.mgiCache[i].filter(f => f.genome === genome);
		return fs.length === 0;
	    }
	    else
		return true;
	});
	let dataString = `genome=${genome.name}&ids=${needids.join("+")}`;
	let url = "./bin/getFeatures.cgi?" + dataString;
	let self = this;
	//console.log("Requesting IDs:", genome.name, needids);
	return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* d3json */])(url).then(function(data){
	    data.forEach((item) => {
	        let id = item[0];
		let feats = item[1];
		this.processFeatures(feats, genome);
	    });
	    return true;
	}.bind(this));
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
	return this._ensureFeaturesByRange(genome, ranges).then(function() {
            ranges.forEach( r => {
	        r.features = this._getCachedFeatures(genome, r) 
		r.genome = genome;
	    });
	    return { genome, blocks:ranges };
	}.bind(this));
    }
    //----------------------------------------------
    // Returns a promise for the features having the specified ids from the specified genome.
    // Fulfillment data = 
    getFeaturesById (genome, ids) {
        return this._ensureFeaturesById(genome, ids).then( () => {
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
    orderSBlocks () {
	let sblocks = this.stripsGrp.selectAll('g.zoomStrip').select('[name="sBlocks"]').selectAll('g.sBlock')
	// By default, the sblocks in a comp genome strip are ordered to match the ref genome
	// order.
	let ppb = this.width / (this.coords.end - this.coords.start + 1);
	let offset = []; // offset of start  position of next block, by strip index (0===ref)
	sblocks.each( function (b,i,j) { // b=block, i=index within strip, j=strip index
	    let blen = ppb * (b.end - b.start + 1); // total screen width of this sblock
	    b.xscale = d3.scale.linear().domain([b.start, b.end]).range([0, blen]);
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
	// synteny blocks. Eachzoom strip has a list of 1 or more sblocks.
	// The reference genome always has just 1. The comp genomes many have
	// 1 or more (and in rare cases, 0).
        // -----------------------------------------------------
        let sblocks = zstrips.select('[name="sBlocks"]').selectAll('g.sBlock')
	    .data(d => {
		//d.blocks.sort( (a,b) => a.index-b.index );
	        return d.blocks;
	    }, d => d.blockId);
	let newsbs = sblocks.enter()
	    .append("g")
	    .attr("class", b => "sBlock" + (b.ori==="+" ? " plus" : " minus") + (b.chr !== b.fChr ? " translocation" : ""))
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
	    .text( b => {
		// only show chromosome label for ref genome and for any sblock
		// whose chromosome differs from the ref
		if (b.genome === this.app.rGenome || b.chr !== this.coords.chr)
		    return b.chr;
		else
		    return "";
	    })
	    .attr("x", b => (b.xscale(b.start) + b.xscale(b.end))/2 )
	    .attr("y", this.blockHeight / 2 + 10)
	    ;

	// synteny block rects
	sblocks.select("rect.block")
	  .attr("x",     b => b.xscale(b.start))
	  .attr("y",     b => -this.blockHeight / 2)
	  .attr("width", b=>b.xscale(b.end)-b.xscale(b.start))
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
    //     sblocks (D3 selection of g.sblock nodes)
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
	let fBlock = function (featElt) {
	    let blkElt = featElt.parentNode;
	    return blkElt.__data__;
	}
	feats
	  .attr("x", function (f) { return fBlock(this).xscale(f.start) })
	  .attr("width", function (f) { return fBlock(this).xscale(f.end)-fBlock(this).xscale(f.start)+1 })
	  .attr("y", function (f) {
	       if (f.strand == "+")
		   return -self.laneHeight*f.lane;
	       else
		   // f.lane is negative for "-" strand
	           return -self.laneHeight*f.lane - self.featHeight; 
	       })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODBhNmQxZDQzMDM3Yzc3ODhhMjciLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1N0b3JhZ2VNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvU1ZHVmlldy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvdmlld2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9NR1ZBcHAuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZS5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1F1ZXJ5TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQXV4RGF0YU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYUV2YWx1YXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvTGlzdEVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvVXNlclByZWZzTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmFjZXRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GYWNldC5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQlRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9CbG9ja1RyYW5zbGF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZVZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzIiwid2VicGFjazovLy8u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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQW1CQTs7Ozs7Ozs7QUNsVkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7OztBQ3JCUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUTs7Ozs7Ozs7O0FDMURSO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LG1CQUFtQixrQkFBa0I7QUFDckMsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckMsTUFBTTtBQUNOO0FBQ0E7QUFDQSw0SEFBb0UsT0FBTztBQUMzRTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Es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LENBQUM7O0FBRU87Ozs7Ozs7Ozs7QUMvUm9COztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUTs7Ozs7Ozs7Ozs7O0FDbkVxRDtBQUN6QztBQUNROztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7Ozs7O0FDak9zQjs7QUFFOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUTs7Ozs7Ozs7OztBQ3ZDUTs7QUFFaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLDhFQUE4RTtBQUM5RjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isc0lBQThFO0FBQ2hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiwyQ0FBMkMsRUFBRTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlHQUF5QztBQUN6QyxnR0FBd0M7QUFDeEM7QUFDQSxnQkFBZ0IsS0FBSyxHQUFHLGVBQWUsR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLGNBQWMsR0FBRyxLQUFLLEdBQUcsY0FBYyxHQUFHLGVBQWU7QUFDbkg7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU8iLCJmaWxlIjoibWd2LmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDgwYTZkMWQ0MzAzN2M3Nzg4YTI3IiwiXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vICAgICAgICAgICAgICAgICAgICBVVElMU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gKFJlLSlJbml0aWFsaXplcyBhbiBvcHRpb24gbGlzdC5cbi8vIEFyZ3M6XG4vLyAgIHNlbGVjdG9yIChzdHJpbmcgb3IgTm9kZSkgQ1NTIHNlbGVjdG9yIG9mIHRoZSBjb250YWluZXIgPHNlbGVjdD4gZWxlbWVudC4gT3IgdGhlIGVsZW1lbnQgaXRzZWxmLlxuLy8gICBvcHRzIChsaXN0KSBMaXN0IG9mIG9wdGlvbiBkYXRhIG9iamVjdHMuIE1heSBiZSBzaW1wbGUgc3RyaW5ncy4gTWF5IGJlIG1vcmUgY29tcGxleC5cbi8vICAgdmFsdWUgKGZ1bmN0aW9uIG9yIG51bGwpIEZ1bmN0aW9uIHRvIHByb2R1Y2UgdGhlIDxvcHRpb24+IHZhbHVlIGZyb20gYW4gb3B0cyBpdGVtXG4vLyAgICAgICBEZWZhdWx0cyB0byB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gKHg9PngpLlxuLy8gICBsYWJlbCAoZnVuY3Rpb24gb3IgbnVsbCkgRnVuY3Rpb24gdG8gcHJvZHVjZSB0aGUgPG9wdGlvbj4gbGFiZWwgZnJvbSBhbiBvcHRzIGl0ZW1cbi8vICAgICAgIERlZmF1bHRzIHRvIHRoZSB2YWx1ZSBmdW5jdGlvbi5cbi8vICAgbXVsdGkgKGJvb2xlYW4pIFNwZWNpZmllcyBpZiB0aGUgbGlzdCBzdXBwb3J0IG11bHRpcGxlIHNlbGVjdGlvbnMuIChkZWZhdWx0ID0gZmFsc2UpXG4vLyAgIHNlbGVjdGVkIChmdW5jdGlvbiBvciBudWxsKSBGdW5jdGlvbiB0byBkZXRlcm1pbmUgaWYgYSBnaXZlbiBvcHRpb24gaXMgc2VsZWN0ZC5cbi8vICAgICAgIERlZmF1bHRzIHRvIGQ9PkZhbHNlLiBOb3RlIHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBvbmx5IGFwcGxpZWQgdG8gbmV3IG9wdGlvbnMuXG4vLyAgIHNvcnRCeSAoZnVuY3Rpb24pIE9wdGlvbmFsLiBJZiBwcm92aWRlZCwgYSBjb21wYXJpc29uIGZ1bmN0aW9uIHRvIHVzZSBmb3Igc29ydGluZyB0aGUgb3B0aW9ucy5cbi8vICAgXHQgVGhlIGNvbXBhcmlzb24gZnVuY3Rpb24gaXMgcGFzc2VzIHRoZSBkYXRhIG9iamVjdHMgY29ycmVzcG9uZGluZyB0byB0d28gb3B0aW9ucyBhbmQgc2hvdWxkXG4vLyAgIFx0IHJldHVybiAtMSwgMCBvciArMS4gSWYgbm90IHByb3ZpZGVkLCB0aGUgb3B0aW9uIGxpc3Qgd2lsbCBoYXZlIHRoZSBzYW1lIHNvcnQgb3JkZXIgYXMgdGhlIG9wdHMgYXJndW1lbnQuXG4vLyBSZXR1cm5zOlxuLy8gICBUaGUgb3B0aW9uIGxpc3QgaW4gYSBEMyBzZWxlY3Rpb24uXG5mdW5jdGlvbiBpbml0T3B0TGlzdChzZWxlY3Rvciwgb3B0cywgdmFsdWUsIGxhYmVsLCBtdWx0aSwgc2VsZWN0ZWQsIHNvcnRCeSkge1xuXG4gICAgLy8gc2V0IHVwIHRoZSBmdW5jdGlvbnNcbiAgICBsZXQgaWRlbnQgPSBkID0+IGQ7XG4gICAgdmFsdWUgPSB2YWx1ZSB8fCBpZGVudDtcbiAgICBsYWJlbCA9IGxhYmVsIHx8IHZhbHVlO1xuICAgIHNlbGVjdGVkID0gc2VsZWN0ZWQgfHwgKHggPT4gZmFsc2UpO1xuXG4gICAgLy8gdGhlIDxzZWxlY3Q+IGVsdFxuICAgIGxldCBzID0gZDMuc2VsZWN0KHNlbGVjdG9yKTtcblxuICAgIC8vIG11bHRpc2VsZWN0XG4gICAgcy5wcm9wZXJ0eSgnbXVsdGlwbGUnLCBtdWx0aSB8fCBudWxsKSA7XG5cbiAgICAvLyBiaW5kIHRoZSBvcHRzLlxuICAgIGxldCBvcyA9IHMuc2VsZWN0QWxsKFwib3B0aW9uXCIpXG4gICAgICAgIC5kYXRhKG9wdHMsIGxhYmVsKTtcbiAgICBvcy5lbnRlcigpXG4gICAgICAgIC5hcHBlbmQoXCJvcHRpb25cIikgXG4gICAgICAgIC5hdHRyKFwidmFsdWVcIiwgdmFsdWUpXG4gICAgICAgIC5wcm9wZXJ0eShcInNlbGVjdGVkXCIsIG8gPT4gc2VsZWN0ZWQobykgfHwgbnVsbClcbiAgICAgICAgLnRleHQobGFiZWwpIFxuICAgICAgICA7XG4gICAgLy9cbiAgICBvcy5leGl0KCkucmVtb3ZlKCkgO1xuXG4gICAgLy8gc29ydCB0aGUgcmVzdWx0c1xuICAgIGlmICghc29ydEJ5KSBzb3J0QnkgPSAoYSxiKSA9PiB7XG4gICAgXHRsZXQgYWkgPSBvcHRzLmluZGV4T2YoYSk7XG5cdGxldCBiaSA9IG9wdHMuaW5kZXhPZihiKTtcblx0cmV0dXJuIGFpIC0gYmk7XG4gICAgfVxuICAgIG9zLnNvcnQoc29ydEJ5KTtcblxuICAgIC8vXG4gICAgcmV0dXJuIHM7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJvbWlzaWZpZXMgYSBjYWxsIHRvIGQzLnRzdi5cbi8vIEFyZ3M6XG4vLyAgIHVybCAoc3RyaW5nKSBUaGUgdXJsIG9mIHRoZSB0c3YgcmVzb3VyY2Vcbi8vIFJldHVybnM6XG4vLyAgIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBsaXN0IG9mIHJvdyBvYmplY3RzXG5mdW5jdGlvbiBkM3Rzdih1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGQzLnRzdih1cmwsIGZ1bmN0aW9uKGVycm9yLCB2YWwpe1xuICAgICAgICAgICAgZXJyb3IgPyByZWplY3QoeyBzdGF0dXM6IGVycm9yLnN0YXR1cywgc3RhdHVzVGV4dDogZXJyb3Iuc3RhdHVzVGV4dH0pIDogcmVzb2x2ZSh2YWwpO1xuICAgICAgICB9KSAgXG4gICAgfSk7IFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByb21pc2lmaWVzIGEgY2FsbCB0byBkMy5qc29uLlxuLy8gQXJnczpcbi8vICAgdXJsIChzdHJpbmcpIFRoZSB1cmwgb2YgdGhlIGpzb24gcmVzb3VyY2Vcbi8vIFJldHVybnM6XG4vLyAgIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBqc29uIG9iamVjdCB2YWx1ZSwgb3IgcmVqZWN0cyB3aXRoIGFuIGVycm9yXG5mdW5jdGlvbiBkM2pzb24odXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkMy5qc29uKHVybCwgZnVuY3Rpb24oZXJyb3IsIHZhbCl7XG4gICAgICAgICAgICBlcnJvciA/IHJlamVjdCh7IHN0YXR1czogZXJyb3Iuc3RhdHVzLCBzdGF0dXNUZXh0OiBlcnJvci5zdGF0dXNUZXh0fSkgOiByZXNvbHZlKHZhbCk7XG4gICAgICAgIH0pICBcbiAgICB9KTsgXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyBhIGRlZXAgY29weSBvZiBvYmplY3Qgby4gXG4vLyBBcmdzOlxuLy8gICBvICAob2JqZWN0KSBNdXN0IGJlIGEgSlNPTiBvYmplY3QgKG5vIGN1cmN1bGFyIHJlZnMsIG5vIGZ1bmN0aW9ucykuXG4vLyBSZXR1cm5zOlxuLy8gICBhIGRlZXAgY29weSBvZiBvXG5mdW5jdGlvbiBkZWVwYyhvKSB7XG4gICAgaWYgKCFvKSByZXR1cm4gbztcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobykpO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBhcnNlcyBhIHN0cmluZyBvZiB0aGUgZm9ybSBcImNocjpzdGFydC4uZW5kXCIuXG4vLyBSZXR1cm5zOlxuLy8gICBvYmplY3QgY29udGluaW5nIHRoZSBwYXJzZWQgZmllbGRzLlxuLy8gRXhhbXBsZTpcbi8vICAgcGFyc2VDb29yZHMoXCIxMDoxMDAwMDAwMC4uMjAwMDAwMDBcIikgLT4ge2NocjpcIjEwXCIsIHN0YXJ0OjEwMDAwMDAwLCBlbmQ6MjAwMDAwMDB9XG5mdW5jdGlvbiBwYXJzZUNvb3JkcyAoY29vcmRzKSB7XG4gICAgbGV0IHJlID0gLyhbXjpdKyk6KFxcZCspXFwuXFwuKFxcZCspLztcbiAgICBsZXQgbSA9IGNvb3Jkcy5tYXRjaChyZSk7XG4gICAgcmV0dXJuIG0gPyB7Y2hyOm1bMV0sIHN0YXJ0OnBhcnNlSW50KG1bMl0pLCBlbmQ6cGFyc2VJbnQobVszXSl9IDogbnVsbDtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBGb3JtYXRzIGEgY2hyb21vc29tZSBuYW1lLCBzdGFydCBhbmQgZW5kIHBvc2l0aW9uIGFzIGEgc3RyaW5nLlxuLy8gQXJncyAoZm9ybSAxKTpcbi8vICAgY29vcmRzIChvYmplY3QpIE9mIHRoZSBmb3JtIHtjaHI6c3RyaW5nLCBzdGFydDppbnQsIGVuZDppbnR9XG4vLyBBcmdzIChmb3JtIDIpOlxuLy8gICBjaHIgc3RyaW5nXG4vLyAgIHN0YXJ0IGludFxuLy8gICBlbmQgaW50XG4vLyBSZXR1cm5zOlxuLy8gICAgIHN0cmluZ1xuLy8gRXhhbXBsZTpcbi8vICAgICBmb3JtYXRDb29yZHMoXCIxMFwiLCAxMDAwMDAwMCwgMjAwMDAwMDApIC0+IFwiMTA6MTAwMDAwMDAuLjIwMDAwMDAwXCJcbmZ1bmN0aW9uIGZvcm1hdENvb3JkcyAoY2hyLCBzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0bGV0IGMgPSBjaHI7XG5cdGNociA9IGMuY2hyO1xuXHRzdGFydCA9IGMuc3RhcnQ7XG5cdGVuZCA9IGMuZW5kO1xuICAgIH1cbiAgICByZXR1cm4gYCR7Y2hyfToke3N0YXJ0fS4uJHtlbmR9YFxufVxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRydWUgaWZmIHRoZSB0d28gcmFuZ2VzIG92ZXJsYXAgYnkgYXQgbGVhc3QgMS5cbi8vIEVhY2ggcmFuZ2UgbXVzdCBoYXZlIGEgY2hyLCBzdGFydCwgYW5kIGVuZC5cbi8vXG5mdW5jdGlvbiBvdmVybGFwcyAoYSwgYikge1xuICAgIHJldHVybiBhLmNociA9PT0gYi5jaHIgJiYgYS5zdGFydCA8PSBiLmVuZCAmJiBhLmVuZCA+PSBiLnN0YXJ0O1xufVxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBHaXZlbiB0d28gcmFuZ2VzLCBhIGFuZCBiLCByZXR1cm5zIGEgLSBiLlxuLy8gVGhlIHJlc3VsdCBpcyBhIGxpc3Qgb2YgMCwgMSBvciAyIG5ldyByYW5nZXMsIGRlcGVuZGluZyBvbiBhIGFuZCBiLlxuZnVuY3Rpb24gc3VidHJhY3QoYSwgYikge1xuICAgIGlmIChhLmNociAhPT0gYi5jaHIpIHJldHVybiBbIGEgXTtcbiAgICBsZXQgYWJMZWZ0ID0geyBjaHI6YS5jaHIsIHN0YXJ0OmEuc3RhcnQsICAgICAgICAgICAgICAgICAgZW5kOk1hdGgubWluKGEuZW5kLCBiLnN0YXJ0LTEpIH07XG4gICAgbGV0IGFiUmlnaHQ9IHsgY2hyOmEuY2hyLCBzdGFydDpNYXRoLm1heChhLnN0YXJ0LCBiLmVuZCsxKSwgZW5kOmEuZW5kIH07XG4gICAgbGV0IGFucyA9IFsgYWJMZWZ0LCBhYlJpZ2h0IF0uZmlsdGVyKCByID0+IHIuc3RhcnQgPD0gci5lbmQgKTtcbiAgICByZXR1cm4gYW5zO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENyZWF0ZXMgYSBsaXN0IG9mIGtleSx2YWx1ZSBwYWlycyBmcm9tIHRoZSBvYmouXG5mdW5jdGlvbiBvYmoybGlzdCAobykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvKS5tYXAoayA9PiBbaywgb1trXV0pICAgIFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdHJ1ZSBpZmYgdGhlIHR3byBsaXN0cyBoYXZlIHRoZSBzYW1lIGNvbnRlbnRzIChiYXNlZCBvbiBpbmRleE9mKS5cbi8vIEJydXRlIGZvcmNlIGFwcHJvYWNoLiBCZSBjYXJlZnVsIHdoZXJlIHlvdSB1c2UgdGhpcy5cbmZ1bmN0aW9uIHNhbWUgKGFsc3QsYmxzdCkge1xuICAgcmV0dXJuIGFsc3QubGVuZ3RoID09PSBibHN0Lmxlbmd0aCAmJiBcbiAgICAgICBhbHN0LnJlZHVjZSgoYWNjLHgpID0+IChhY2MgJiYgYmxzdC5pbmRleE9mKHgpPj0wKSwgdHJ1ZSk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBZGQgYmFzaWMgc2V0IG9wcyB0byBTZXQgcHJvdG90eXBlLlxuLy8gTGlmdGVkIGZyb206IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1NldFxuU2V0LnByb3RvdHlwZS51bmlvbiA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgdW5pb24gPSBuZXcgU2V0KHRoaXMpO1xuICAgIGZvciAodmFyIGVsZW0gb2Ygc2V0Qikge1xuICAgICAgICB1bmlvbi5hZGQoZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiB1bmlvbjtcbn1cblxuU2V0LnByb3RvdHlwZS5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihzZXRCKSB7XG4gICAgdmFyIGludGVyc2VjdGlvbiA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKHZhciBlbGVtIG9mIHNldEIpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzKGVsZW0pKSB7XG4gICAgICAgICAgICBpbnRlcnNlY3Rpb24uYWRkKGVsZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnRlcnNlY3Rpb247XG59XG5cblNldC5wcm90b3R5cGUuZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgZGlmZmVyZW5jZSA9IG5ldyBTZXQodGhpcyk7XG4gICAgZm9yICh2YXIgZWxlbSBvZiBzZXRCKSB7XG4gICAgICAgIGRpZmZlcmVuY2UuZGVsZXRlKGVsZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZGlmZmVyZW5jZTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gZ2V0Q2FyZXRSYW5nZSAoZWx0KSB7XG4gICAgLy8gRklYTUU6IGRvZXMgbm90IHdvcmsgZm9yIElFXG4gICAgcmV0dXJuIFtlbHQuc2VsZWN0aW9uU3RhcnQsIGVsdC5zZWxlY3Rpb25FbmRdO1xufVxuZnVuY3Rpb24gc2V0Q2FyZXRSYW5nZSAoZWx0LCByYW5nZSkge1xuICAgIC8vIEZJWE1FOiBkb2VzIG5vdCB3b3JrIGZvciBJRVxuICAgIGVsdC5zZWxlY3Rpb25TdGFydCA9IHJhbmdlWzBdO1xuICAgIGVsdC5zZWxlY3Rpb25FbmQgICA9IHJhbmdlWzFdO1xufVxuZnVuY3Rpb24gc2V0Q2FyZXRQb3NpdGlvbiAoZWx0LCBwb3MpIHtcbiAgICBzZXRDYXJldFJhbmdlKGVsdCwgW3Bvcyxwb3NdKTtcbn1cbmZ1bmN0aW9uIG1vdmVDYXJldFBvc2l0aW9uIChlbHQsIGRlbHRhKSB7XG4gICAgc2V0Q2FyZXRQb3NpdGlvbihlbHQsIGdldENhcmV0UG9zaXRpb24oZWx0KSArIGRlbHRhKTtcbn1cbmZ1bmN0aW9uIGdldENhcmV0UG9zaXRpb24gKGVsdCkge1xuICAgIGxldCByID0gZ2V0Q2FyZXRSYW5nZShlbHQpO1xuICAgIHJldHVybiByWzFdO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdGhlIHNjcmVlbiBjb29yZGluYXRlcyBvZiBhbiBTVkcgc2hhcGUgKGNpcmNsZSwgcmVjdCwgcG9seWdvbiwgbGluZSlcbi8vIGFmdGVyIGFsbCB0cmFuc2Zvcm1zIGhhdmUgYmVlbiBhcHBsaWVkLlxuLy9cbi8vIEFyZ3M6XG4vLyAgICAgc2hhcGUgKG5vZGUpIFRoZSBTVkcgc2hhcGUuXG4vL1xuLy8gUmV0dXJuczpcbi8vICAgICBUaGUgZm9ybSBvZiB0aGUgcmV0dXJuZWQgdmFsdWUgZGVwZW5kcyBvbiB0aGUgc2hhcGUuXG4vLyAgICAgY2lyY2xlOiAgeyBjeCwgY3ksIHIgfVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBjZW50ZXIgcG9pbnQgYW5kIHRyYW5zZm9ybWVkIHJhZGl1cyAgICAgICAgIFxuLy8gICAgIGxpbmU6XHR7IHgxLCB5MSwgeDIsIHkyIH1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgZW5kcG9pbnRzXG4vLyAgICAgcmVjdDpcdHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9XG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGNvcm5lciBwb2ludCBhbmQgdHJhbnNmb3JtZWQgd2lkdGgraGVpZ2h0LlxuLy8gICAgIHBvbHlnb246IFsge3gseX0sIHt4LHl9ICwgLi4uIF1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgbGlzdCBvZiBwb2ludHNcbi8vXG4vLyBBZGFwdGVkIGZyb206IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY4NTg0NzkvcmVjdGFuZ2xlLWNvb3JkaW5hdGVzLWFmdGVyLXRyYW5zZm9ybT9ycT0xXG4vL1xuZnVuY3Rpb24gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0gKHNoYXBlKSB7XG4gICAgLy9cbiAgICBsZXQgZHNoYXBlID0gZDMuc2VsZWN0KHNoYXBlKTtcbiAgICBsZXQgc3ZnID0gc2hhcGUuY2xvc2VzdChcInN2Z1wiKTtcbiAgICBpZiAoIXN2ZykgdGhyb3cgXCJDb3VsZCBub3QgZmluZCBzdmcgYW5jZXN0b3IuXCI7XG4gICAgbGV0IHN0eXBlID0gc2hhcGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGxldCBtYXRyaXggPSBzaGFwZS5nZXRDVE0oKTtcbiAgICBsZXQgcCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgIGxldCBwMj0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgLy9cbiAgICBzd2l0Y2ggKHN0eXBlKSB7XG4gICAgLy9cbiAgICBjYXNlICdjaXJjbGUnOlxuXHRwLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImN4XCIpKTtcblx0cC55ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJjeVwiKSk7XG5cdHAyLnggPSBwLnggKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiclwiKSk7XG5cdHAyLnkgPSBwLnk7XG5cdHAgICAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRwMiAgID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdC8vIGNhbGMgbmV3IHJhZGl1cyBhcyBkaXN0YW5jZSBiZXR3ZWVuIHRyYW5zZm9ybWVkIHBvaW50c1xuXHRsZXQgZHggPSBNYXRoLmFicyhwLnggLSBwMi54KTtcblx0bGV0IGR5ID0gTWF0aC5hYnMocC55IC0gcDIueSk7XG5cdGxldCByID0gTWF0aC5zcXJ0KGR4KmR4ICsgZHkqZHkpO1xuICAgICAgICByZXR1cm4geyBjeDogcC54LCBjeTogcC55LCByOnIgfTtcbiAgICAvL1xuICAgIGNhc2UgJ3JlY3QnOlxuXHQvLyBGSVhNRTogZG9lcyBub3QgaGFuZGxlIHJvdGF0aW9ucyBjb3JyZWN0bHkuIFRvIGZpeCwgdHJhbnNsYXRlIGNvcm5lciBwb2ludHMgc2VwYXJhdGVseSBhbmQgdGhlblxuXHQvLyBjYWxjdWxhdGUgdGhlIHRyYW5zZm9ybWVkIHdpZHRoIGFuZCBoZWlnaHQuIEFzIGEgY29udmVuaWVuY2UgdG8gdGhlIHVzZXIsIG1pZ2h0IGJlIG5pY2UgdG8gcmV0dXJuXG5cdC8vIHRoZSB0cmFuc2Zvcm1lZCBjb3JuZXIgcG9pbnRzIGFuZCBwb3NzaWJseSB0aGUgZmluYWwgYW5nbGUgb2Ygcm90YXRpb24uXG5cdHAueCAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieFwiKSk7XG5cdHAueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieVwiKSk7XG5cdHAyLnggPSBwLnggKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwid2lkdGhcIikpO1xuXHRwMi55ID0gcC55ICsgcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImhlaWdodFwiKSk7XG5cdC8vXG5cdHAgID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0cDIgPSBwMi5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0Ly9cbiAgICAgICAgcmV0dXJuIHsgeDogcC54LCB5OiBwLnksIHdpZHRoOiBwMi54LXAueCwgaGVpZ2h0OiBwMi55LXAueSB9O1xuICAgIC8vXG4gICAgY2FzZSAncG9seWdvbic6XG4gICAgICAgIGxldCBwdHMgPSBkc2hhcGUuYXR0cihcInBvaW50c1wiKS50cmltKCkuc3BsaXQoLyArLyk7XG5cdHJldHVybiBwdHMubWFwKCBwdCA9PiB7XG5cdCAgICBsZXQgeHkgPSBwdC5zcGxpdChcIixcIik7XG5cdCAgICBwLnggPSBwYXJzZUZsb2F0KHh5WzBdKVxuXHQgICAgcC55ID0gcGFyc2VGbG9hdCh4eVsxXSlcblx0ICAgIHAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHQgICAgcmV0dXJuIHsgeDogcC54LCB5OiBwLnkgfTtcblx0fSk7XG4gICAgLy9cbiAgICBjYXNlICdsaW5lJzpcblx0cC54ICAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieDFcIikpO1xuXHRwLnkgICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ5MVwiKSk7XG5cdHAyLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcIngyXCIpKTtcblx0cDIueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieTJcIikpO1xuXHRwICAgICA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdHAyICAgID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG4gICAgICAgIHJldHVybiB7IHgxOiBwLngsIHkxOiBwLnksIHgyOiBwMi54LCB4MjogcDIueSB9O1xuICAgIC8vXG4gICAgLy8gRklYTUU6IGFkZCBjYXNlICd0ZXh0J1xuICAgIC8vXG5cbiAgICBkZWZhdWx0OlxuXHR0aHJvdyBcIlVuc3VwcG9ydGVkIG5vZGUgdHlwZTogXCIgKyBzdHlwZTtcbiAgICB9XG5cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZW1vdmVzIGR1cGxpY2F0ZXMgZnJvbSBhIGxpc3Qgd2hpbGUgcHJlc2VydmluZyBsaXN0IG9yZGVyLlxuLy8gQXJnczpcbi8vICAgICBsc3QgKGxpc3QpXG4vLyBSZXR1cm5zOlxuLy8gICAgIEEgcHJvY2Vzc2VkIGNvcHkgb2YgbHN0IGluIHdoaWNoIGFueSBkdXBzIGhhdmUgYmVlbiByZW1vdmVkLlxuZnVuY3Rpb24gcmVtb3ZlRHVwcyAobHN0KSB7XG4gICAgbGV0IGxzdDIgPSBbXTtcbiAgICBsZXQgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICBsc3QuZm9yRWFjaCh4ID0+IHtcblx0Ly8gcmVtb3ZlIGR1cHMgd2hpbGUgcHJlc2VydmluZyBvcmRlclxuXHRpZiAoc2Vlbi5oYXMoeCkpIHJldHVybjtcblx0bHN0Mi5wdXNoKHgpO1xuXHRzZWVuLmFkZCh4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gbHN0Mjtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB7XG4gICAgaW5pdE9wdExpc3QsXG4gICAgZDN0c3YsXG4gICAgZDNqc29uLFxuICAgIGRlZXBjLFxuICAgIHBhcnNlQ29vcmRzLFxuICAgIGZvcm1hdENvb3JkcyxcbiAgICBvdmVybGFwcyxcbiAgICBzdWJ0cmFjdCxcbiAgICBvYmoybGlzdCxcbiAgICBzYW1lLFxuICAgIGdldENhcmV0UmFuZ2UsXG4gICAgc2V0Q2FyZXRSYW5nZSxcbiAgICBzZXRDYXJldFBvc2l0aW9uLFxuICAgIG1vdmVDYXJldFBvc2l0aW9uLFxuICAgIGdldENhcmV0UG9zaXRpb24sXG4gICAgY29vcmRzQWZ0ZXJUcmFuc2Zvcm0sXG4gICAgcmVtb3ZlRHVwc1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgQ29tcG9uZW50IHtcbiAgICAvLyBhcHAgLSB0aGUgb3duaW5nIGFwcCBvYmplY3RcbiAgICAvLyBlbHQgbWF5IGJlIGEgc3RyaW5nIChzZWxlY3RvciksIGEgRE9NIG5vZGUsIG9yIGEgZDMgc2VsZWN0aW9uIG9mIDEgbm9kZS5cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcblx0dGhpcy5hcHAgPSBhcHBcblx0aWYgKHR5cGVvZihlbHQpID09PSBcInN0cmluZ1wiKVxuXHQgICAgLy8gZWx0IGlzIGEgQ1NTIHNlbGVjdG9yXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5zZWxlY3RBbGwpID09PSBcImZ1bmN0aW9uXCIpXG5cdCAgICAvLyBlbHQgaXMgYSBkMyBzZWxlY3Rpb25cblx0ICAgIHRoaXMucm9vdCA9IGVsdDtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSkgPT09IFwiZnVuY3Rpb25cIilcblx0ICAgIC8vIGVsdCBpcyBhIERPTSBub2RlXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRlIG1lXG4gICAgfVxufVxuXG5leHBvcnQgeyBDb21wb25lbnQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0NvbXBvbmVudC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBGZWF0dXJlIHtcbiAgICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG4gICAgICAgIHRoaXMuY2hyICAgICA9IGNmZy5jaHIgfHwgY2ZnLmNocm9tb3NvbWU7XG4gICAgICAgIHRoaXMuc3RhcnQgICA9IGNmZy5zdGFydDtcbiAgICAgICAgdGhpcy5lbmQgICAgID0gY2ZnLmVuZDtcbiAgICAgICAgdGhpcy5zdHJhbmQgID0gY2ZnLnN0cmFuZDtcbiAgICAgICAgdGhpcy50eXBlICAgID0gY2ZnLnR5cGU7XG4gICAgICAgIHRoaXMuYmlvdHlwZSA9IGNmZy5iaW90eXBlO1xuICAgICAgICB0aGlzLm1ncGlkICAgPSBjZmcubWdwaWQgfHwgY2ZnLmlkO1xuICAgICAgICB0aGlzLm1naWlkICAgPSBjZmcubWdpaWQ7XG4gICAgICAgIHRoaXMuc3ltYm9sICA9IGNmZy5zeW1ib2w7XG4gICAgICAgIHRoaXMuZ2Vub21lICA9IGNmZy5nZW5vbWU7XG5cdHRoaXMuY29udGlnICA9IHBhcnNlSW50KGNmZy5jb250aWcpO1xuXHR0aGlzLmxhbmUgICAgPSBwYXJzZUludChjZmcubGFuZSk7XG4gICAgICAgIGlmICh0aGlzLm1naWlkID09PSBcIi5cIikgdGhpcy5tZ2lpZCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLnN5bWJvbCA9PT0gXCIuXCIpIHRoaXMuc3ltYm9sID0gbnVsbDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGlkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdpaWQgfHwgdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGxhYmVsICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sIHx8IHRoaXMubWdwaWQ7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldE11bmdlZFR5cGUgKCkge1xuXHRyZXR1cm4gdGhpcy50eXBlID09PSBcImdlbmVcIiA/XG5cdCAgICAodGhpcy5iaW90eXBlID09PSBcInByb3RlaW5fY29kaW5nXCIgfHwgdGhpcy5iaW90eXBlID09PSBcInByb3RlaW4gY29kaW5nIGdlbmVcIikgP1xuXHRcdFwicHJvdGVpbl9jb2RpbmdfZ2VuZVwiXG5cdFx0OlxuXHRcdHRoaXMuYmlvdHlwZS5pbmRleE9mKFwicHNldWRvZ2VuZVwiKSA+PSAwID9cblx0XHQgICAgXCJwc2V1ZG9nZW5lXCJcblx0XHQgICAgOlxuXHRcdCAgICAodGhpcy5iaW90eXBlLmluZGV4T2YoXCJSTkFcIikgPj0gMCB8fCB0aGlzLmJpb3R5cGUuaW5kZXhPZihcImFudGlzZW5zZVwiKSA+PSAwKSA/XG5cdFx0XHRcIm5jUk5BX2dlbmVcIlxuXHRcdFx0OlxuXHRcdFx0dGhpcy5iaW90eXBlLmluZGV4T2YoXCJzZWdtZW50XCIpID49IDAgP1xuXHRcdFx0ICAgIFwiZ2VuZV9zZWdtZW50XCJcblx0XHRcdCAgICA6XG5cdFx0XHQgICAgXCJvdGhlcl9nZW5lXCJcblx0ICAgIDpcblx0ICAgIHRoaXMudHlwZSA9PT0gXCJwc2V1ZG9nZW5lXCIgP1xuXHRcdFwicHNldWRvZ2VuZVwiXG5cdFx0OlxuXHRcdHRoaXMudHlwZS5pbmRleE9mKFwiZ2VuZV9zZWdtZW50XCIpID49IDAgP1xuXHRcdCAgICBcImdlbmVfc2VnbWVudFwiXG5cdFx0ICAgIDpcblx0XHQgICAgdGhpcy50eXBlLmluZGV4T2YoXCJSTkFcIikgPj0gMCA/XG5cdFx0XHRcIm5jUk5BX2dlbmVcIlxuXHRcdFx0OlxuXHRcdFx0dGhpcy50eXBlLmluZGV4T2YoXCJnZW5lXCIpID49IDAgP1xuXHRcdFx0ICAgIFwib3RoZXJfZ2VuZVwiXG5cdFx0XHQgICAgOlxuXHRcdFx0ICAgIFwib3RoZXJfZmVhdHVyZV90eXBlXCI7XG4gICAgfVxufVxuXG5leHBvcnQgeyBGZWF0dXJlIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IFBSRUZJWD1cImFwcHMubWd2LlwiO1xuIFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbnRlcmFjdHMgd2l0aCBsb2NhbFN0b3JhZ2UuXG4vL1xuY2xhc3MgU3RvcmFnZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lLCBzdG9yYWdlKSB7XG5cdHRoaXMubmFtZSA9IFBSRUZJWCtuYW1lO1xuXHR0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuXHR0aGlzLm15RGF0YU9iaiA9IG51bGw7XG5cdC8vXG5cdHRoaXMuX2xvYWQoKTtcbiAgICB9XG4gICAgX2xvYWQgKCkge1xuXHQvLyBsb2FkcyBteURhdGFPYmogZnJvbSBzdG9yYWdlXG4gICAgICAgIGxldCBzID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lKTtcblx0dGhpcy5teURhdGFPYmogPSBzID8gSlNPTi5wYXJzZShzKSA6IHt9O1xuICAgIH1cbiAgICBfc2F2ZSAoKSB7XG5cdC8vIHdyaXRlcyBteURhdGFPYmogdG8gc3RvcmFnZVxuICAgICAgICBsZXQgcyA9IEpTT04uc3RyaW5naWZ5KHRoaXMubXlEYXRhT2JqKTtcblx0dGhpcy5zdG9yYWdlLnNldEl0ZW0odGhpcy5uYW1lLCBzKVxuICAgIH1cbiAgICBnZXQgKG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXlEYXRhT2JqW25dO1xuICAgIH1cbiAgICBwdXQgKG4sIHYpIHtcbiAgICAgICAgdGhpcy5teURhdGFPYmpbbl0gPSB2O1xuXHR0aGlzLl9zYXZlKCk7XG4gICAgfVxufVxuLy9cbmNsYXNzIFNlc3Npb25TdG9yYWdlTWFuYWdlciBleHRlbmRzIFN0b3JhZ2VNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSkge1xuICAgICAgICBzdXBlcihuYW1lLCB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UpO1xuICAgIH1cbn1cbi8vXG5jbGFzcyBMb2NhbFN0b3JhZ2VNYW5hZ2VyIGV4dGVuZHMgU3RvcmFnZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lKSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIHdpbmRvdy5sb2NhbFN0b3JhZ2UpO1xuICAgIH1cbn1cbi8vXG5leHBvcnQgeyBTZXNzaW9uU3RvcmFnZU1hbmFnZXIsIExvY2FsU3RvcmFnZU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1N0b3JhZ2VNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUGFyc2VzIGEgbGlzdCBvcGVyYXRvciBleHByZXNzaW9uLCBlZyBcIihhICsgYikqYyAtIGRcIlxuLy8gUmV0dXJucyBhbiBhYnN0cmFjdCBzeW50YXggdHJlZS5cbi8vICAgICBMZWFmIG5vZGVzID0gbGlzdCBuYW1lcy4gVGhleSBhcmUgc2ltcGxlIHN0cmluZ3MuXG4vLyAgICAgSW50ZXJpb3Igbm9kZXMgPSBvcGVyYXRpb25zLiBUaGV5IGxvb2sgbGlrZToge2xlZnQ6bm9kZSwgb3A6c3RyaW5nLCByaWdodDpub2RlfVxuLy8gXG5jbGFzcyBMaXN0Rm9ybXVsYVBhcnNlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuXHR0aGlzLnJfb3AgICAgPSAvWystXS87XG5cdHRoaXMucl9vcDIgICA9IC9bKl0vO1xuXHR0aGlzLnJfb3BzICAgPSAvWygpKyotXS87XG5cdHRoaXMucl9pZGVudCA9IC9bYS16QS1aX11bYS16QS1aMC05X10qLztcblx0dGhpcy5yX3FzdHIgID0gL1wiW15cIl0qXCIvO1xuXHR0aGlzLnJlID0gbmV3IFJlZ0V4cChgKCR7dGhpcy5yX29wcy5zb3VyY2V9fCR7dGhpcy5yX3FzdHIuc291cmNlfXwke3RoaXMucl9pZGVudC5zb3VyY2V9KWAsICdnJyk7XG5cdC8vdGhpcy5yZSA9IC8oWygpKyotXXxcIlteXCJdK1wifFthLXpBLVpfXVthLXpBLVowLTlfXSopL2dcblx0dGhpcy5faW5pdChcIlwiKTtcbiAgICB9XG4gICAgX2luaXQgKHMpIHtcbiAgICAgICAgdGhpcy5leHByID0gcztcblx0dGhpcy50b2tlbnMgPSB0aGlzLmV4cHIubWF0Y2godGhpcy5yZSkgfHwgW107XG5cdHRoaXMuaSA9IDA7XG4gICAgfVxuICAgIF9wZWVrVG9rZW4oKSB7XG5cdHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmldO1xuICAgIH1cbiAgICBfbmV4dFRva2VuICgpIHtcblx0bGV0IHQ7XG4gICAgICAgIGlmICh0aGlzLmkgPCB0aGlzLnRva2Vucy5sZW5ndGgpIHtcblx0ICAgIHQgPSB0aGlzLnRva2Vuc1t0aGlzLmldO1xuXHQgICAgdGhpcy5pICs9IDE7XG5cdH1cblx0cmV0dXJuIHQ7XG4gICAgfVxuICAgIF9leHByICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl90ZXJtKCk7XG5cdGxldCBvcCA9IHRoaXMuX3BlZWtUb2tlbigpO1xuXHRpZiAob3AgPT09IFwiK1wiIHx8IG9wID09PSBcIi1cIikge1xuXHQgICAgdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBub2RlID0geyBsZWZ0Om5vZGUsIG9wOm9wPT09XCIrXCI/XCJ1bmlvblwiOlwiZGlmZmVyZW5jZVwiLCByaWdodDogdGhpcy5fZXhwcigpIH1cblx0ICAgIHJldHVybiBub2RlO1xuICAgICAgICB9ICAgICAgICAgICAgICAgXG5cdGVsc2UgaWYgKG9wID09PSBcIilcIiB8fCBvcCA9PT0gdW5kZWZpbmVkIHx8IG9wID09PSBudWxsKVxuXHQgICAgcmV0dXJuIG5vZGU7XG5cdGVsc2Vcblx0ICAgIHRoaXMuX2Vycm9yKFwiVU5JT04gb3IgSU5URVJTRUNUSU9OIG9yICkgb3IgTlVMTFwiLCBvcCk7XG4gICAgfVxuICAgIF90ZXJtICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl9mYWN0b3IoKTtcblx0bGV0IG9wID0gdGhpcy5fcGVla1Rva2VuKCk7XG5cdGlmIChvcCA9PT0gXCIqXCIpIHtcblx0ICAgIHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgbm9kZSA9IHsgbGVmdDpub2RlLCBvcDpcImludGVyc2VjdGlvblwiLCByaWdodDogdGhpcy5fZmFjdG9yKCkgfVxuXHR9XG5cdHJldHVybiBub2RlO1xuICAgIH1cbiAgICBfZmFjdG9yICgpIHtcbiAgICAgICAgbGV0IHQgPSB0aGlzLl9uZXh0VG9rZW4oKTtcblx0aWYgKHQgPT09IFwiKFwiKXtcblx0ICAgIGxldCBub2RlID0gdGhpcy5fZXhwcigpO1xuXHQgICAgbGV0IG50ID0gdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBpZiAobnQgIT09IFwiKVwiKSB0aGlzLl9lcnJvcihcIicpJ1wiLCBudCk7XG5cdCAgICByZXR1cm4gbm9kZTtcblx0fVxuXHRlbHNlIGlmICh0ICYmICh0LnN0YXJ0c1dpdGgoJ1wiJykpKSB7XG5cdCAgICByZXR1cm4gdC5zdWJzdHJpbmcoMSwgdC5sZW5ndGgtMSk7XG5cdH1cblx0ZWxzZSBpZiAodCAmJiB0Lm1hdGNoKC9bYS16QS1aX10vKSkge1xuXHQgICAgcmV0dXJuIHQ7XG5cdH1cblx0ZWxzZVxuXHQgICAgdGhpcy5fZXJyb3IoXCJFWFBSIG9yIElERU5UXCIsIHR8fFwiTlVMTFwiKTtcblx0cmV0dXJuIHQ7XG5cdCAgICBcbiAgICB9XG4gICAgX2Vycm9yIChleHBlY3RlZCwgc2F3KSB7XG4gICAgICAgIHRocm93IGBQYXJzZSBlcnJvcjogZXhwZWN0ZWQgJHtleHBlY3RlZH0gYnV0IHNhdyAke3Nhd30uYDtcbiAgICB9XG4gICAgLy8gUGFyc2VzIHRoZSBzdHJpbmcgYW5kIHJldHVybnMgdGhlIGFic3RyYWN0IHN5bnRheCB0cmVlLlxuICAgIC8vIFRocm93cyBhbiBleGNlcHRpb24gaWYgdGhlcmUgaXMgYSBzeW50YXggZXJyb3IuXG4gICAgcGFyc2UgKHMpIHtcblx0dGhpcy5faW5pdChzKTtcblx0cmV0dXJuIHRoaXMuX2V4cHIoKTtcbiAgICB9XG4gICAgLy8gcmV0dXJucyB0cnVlIGlmZiBzdHJpbmcgaXMgc3ludGFjdGljYWxseSB2YWxpZFxuICAgIGlzVmFsaWQgKHMpIHtcbiAgICAgICAgdHJ5IHtcblx0ICAgIHRoaXMucGFyc2Uocyk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fVxuXHRjYXRjaCAoZSkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEZvcm11bGFQYXJzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIFNWR1ZpZXcgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCwgbWFyZ2lucywgcm90YXRpb24sIHRyYW5zbGF0aW9uKSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0KTtcbiAgICAgICAgdGhpcy5zdmcgPSB0aGlzLnJvb3Quc2VsZWN0KFwic3ZnXCIpO1xuICAgICAgICB0aGlzLnN2Z01haW4gPSB0aGlzLnN2Z1xuICAgICAgICAgICAgLmFwcGVuZChcImdcIikgICAgLy8gdGhlIG1hcmdpbi10cmFuc2xhdGVkIGdyb3VwXG4gICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVx0ICAvLyBtYWluIGdyb3VwIGZvciB0aGUgZHJhd2luZ1xuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJzdmdtYWluXCIpO1xuXHR0aGlzLm91dGVyV2lkdGggPSAxMDA7XG5cdHRoaXMud2lkdGggPSAxMDA7XG5cdHRoaXMub3V0ZXJIZWlnaHQgPSAxMDA7XG5cdHRoaXMuaGVpZ2h0ID0gMTAwO1xuXHR0aGlzLm1hcmdpbnMgPSB7dG9wOiAxOCwgcmlnaHQ6IDEyLCBib3R0b206IDEyLCBsZWZ0OiAxMn07XG5cdHRoaXMucm90YXRpb24gPSAwO1xuXHR0aGlzLnRyYW5zbGF0aW9uID0gWzAsMF07XG5cdC8vXG4gICAgICAgIHRoaXMuc2V0R2VvbSh7d2lkdGgsIGhlaWdodCwgbWFyZ2lucywgcm90YXRpb24sIHRyYW5zbGF0aW9ufSk7XG4gICAgfVxuICAgIHNldEdlb20gKGNmZykge1xuICAgICAgICB0aGlzLm91dGVyV2lkdGggID0gY2ZnLndpZHRoICAgICAgIHx8IHRoaXMub3V0ZXJXaWR0aDtcbiAgICAgICAgdGhpcy5vdXRlckhlaWdodCA9IGNmZy5oZWlnaHQgICAgICB8fCB0aGlzLm91dGVySGVpZ2h0O1xuICAgICAgICB0aGlzLm1hcmdpbnMgICAgID0gY2ZnLm1hcmdpbnMgICAgIHx8IHRoaXMubWFyZ2lucztcblx0dGhpcy5yb3RhdGlvbiAgICA9IHR5cGVvZihjZmcucm90YXRpb24pID09PSBcIm51bWJlclwiID8gY2ZnLnJvdGF0aW9uIDogdGhpcy5yb3RhdGlvbjtcblx0dGhpcy50cmFuc2xhdGlvbiA9IGNmZy50cmFuc2xhdGlvbiB8fCB0aGlzLnRyYW5zbGF0aW9uO1xuICAgICAgICAvL1xuICAgICAgICB0aGlzLndpZHRoICA9IHRoaXMub3V0ZXJXaWR0aCAgLSB0aGlzLm1hcmdpbnMubGVmdCAtIHRoaXMubWFyZ2lucy5yaWdodDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLm91dGVySGVpZ2h0IC0gdGhpcy5tYXJnaW5zLnRvcCAgLSB0aGlzLm1hcmdpbnMuYm90dG9tO1xuICAgICAgICAvL1xuICAgICAgICB0aGlzLnN2Zy5hdHRyKFwid2lkdGhcIiwgdGhpcy5vdXRlcldpZHRoKVxuICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLm91dGVySGVpZ2h0KVxuICAgICAgICAgICAgLnNlbGVjdCgnZ1tuYW1lPVwic3ZnbWFpblwiXScpXG4gICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHt0aGlzLm1hcmdpbnMubGVmdH0sJHt0aGlzLm1hcmdpbnMudG9wfSkgcm90YXRlKCR7dGhpcy5yb3RhdGlvbn0pIHRyYW5zbGF0ZSgke3RoaXMudHJhbnNsYXRpb25bMF19LCR7dGhpcy50cmFuc2xhdGlvblsxXX0pYCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzZXRNYXJnaW5zKCB0bSwgcm0sIGJtLCBsbSApIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0ICAgIHJtID0gYm0gPSBsbSA9IHRtO1xuXHR9XG5cdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcblx0ICAgIGJtID0gdG07XG5cdCAgICBsbSA9IHJtO1xuXHR9XG5cdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDQpXG5cdCAgICB0aHJvdyBcIkJhZCBhcmd1bWVudHMuXCI7XG4gICAgICAgIC8vXG5cdHRoaXMuc2V0R2VvbSh7dG9wOiB0bSwgcmlnaHQ6IHJtLCBib3R0b206IGJtLCBsZWZ0OiBsbX0pO1xuXHQvL1xuXHRyZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcm90YXRlIChkZWcpIHtcbiAgICAgICAgdGhpcy5zZXRHZW9tKHtyb3RhdGlvbjpkZWd9KTtcblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRyYW5zbGF0ZSAoZHgsIGR5KSB7XG4gICAgICAgIHRoaXMuc2V0R2VvbSh7dHJhbnNsYXRpb246W2R4LGR5XX0pO1xuXHRyZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy8gQXJnczpcbiAgICAvLyAgIHRoZSB3aW5kb3cgd2lkdGhcbiAgICBmaXRUb1dpZHRoICh3aWR0aCkge1xuICAgICAgICBsZXQgciA9IHRoaXMuc3ZnWzBdWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLnNldEdlb20oe3dpZHRoOiB3aWR0aCAtIHIueH0pXG5cdHJldHVybiB0aGlzO1xuICAgIH1cblxufSAvLyBlbmQgY2xhc3MgU1ZHVmlld1xuXG5leHBvcnQgeyBTVkdWaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9TVkdWaWV3LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IE1HVkFwcCB9IGZyb20gJy4vTUdWQXBwJztcbmltcG9ydCB7IHJlbW92ZUR1cHMgfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vXG4vLyBwcXN0cmluZyA9IFBhcnNlIHFzdHJpbmcuIFBhcnNlcyB0aGUgcGFyYW1ldGVyIHBvcnRpb24gb2YgdGhlIFVSTC5cbi8vXG5mdW5jdGlvbiBwcXN0cmluZyAocXN0cmluZykge1xuICAgIC8vXG4gICAgbGV0IGNmZyA9IHt9O1xuXG4gICAgLy8gRklYTUU6IFVSTFNlYXJjaFBhcmFtcyBBUEkgaXMgbm90IHN1cHBvcnRlZCBpbiBhbGwgYnJvd3NlcnMuXG4gICAgLy8gT0sgZm9yIGRldmVsb3BtZW50IGJ1dCBuZWVkIGEgZmFsbGJhY2sgZXZlbnR1YWxseS5cbiAgICBsZXQgcHJtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocXN0cmluZyk7XG4gICAgbGV0IGdlbm9tZXMgPSBbXTtcblxuICAgIC8vIC0tLS0tIGdlbm9tZXMgLS0tLS0tLS0tLS0tXG4gICAgbGV0IHBnZW5vbWVzID0gcHJtcy5nZXQoXCJnZW5vbWVzXCIpIHx8IFwiXCI7XG4gICAgLy8gRm9yIG5vdywgYWxsb3cgXCJjb21wc1wiIGFzIHN5bm9ueW0gZm9yIFwiZ2Vub21lc1wiLiBFdmVudHVhbGx5LCBkb24ndCBzdXBwb3J0IFwiY29tcHNcIi5cbiAgICBwZ2Vub21lcyA9IChwZ2Vub21lcyArICBcIiBcIiArIChwcm1zLmdldChcImNvbXBzXCIpIHx8IFwiXCIpKTtcbiAgICAvL1xuICAgIHBnZW5vbWVzID0gcmVtb3ZlRHVwcyhwZ2Vub21lcy50cmltKCkuc3BsaXQoLyArLykpO1xuICAgIHBnZW5vbWVzLmxlbmd0aCA+IDAgJiYgKGNmZy5nZW5vbWVzID0gcGdlbm9tZXMpO1xuXG4gICAgLy8gLS0tLS0gcmVmIGdlbm9tZSAtLS0tLS0tLS0tLS1cbiAgICBsZXQgcmVmID0gcHJtcy5nZXQoXCJyZWZcIik7XG4gICAgcmVmICYmIChjZmcucmVmID0gcmVmKTtcblxuICAgIC8vIC0tLS0tIGhpZ2hsaWdodCBJRHMgLS0tLS0tLS0tLS0tLS1cbiAgICBsZXQgaGxzID0gbmV3IFNldCgpO1xuICAgIGxldCBobHMwID0gcHJtcy5nZXQoXCJoaWdobGlnaHRcIik7XG4gICAgaWYgKGhsczApIHtcblx0aGxzMCA9IGhsczAucmVwbGFjZSgvWyAsXSsvZywgJyAnKS5zcGxpdCgnICcpLmZpbHRlcih4PT54KTtcblx0aGxzMC5sZW5ndGggPiAwICYmIChjZmcuaGlnaGxpZ2h0ID0gaGxzMCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0gY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIGxldCBjaHIgICA9IHBybXMuZ2V0KFwiY2hyXCIpO1xuICAgIGxldCBzdGFydCA9IHBybXMuZ2V0KFwic3RhcnRcIik7XG4gICAgbGV0IGVuZCAgID0gcHJtcy5nZXQoXCJlbmRcIik7XG4gICAgY2hyICAgJiYgKGNmZy5jaHIgPSBjaHIpO1xuICAgIHN0YXJ0ICYmIChjZmcuc3RhcnQgPSBwYXJzZUludChzdGFydCkpO1xuICAgIGVuZCAgICYmIChjZmcuZW5kID0gcGFyc2VJbnQoZW5kKSk7XG4gICAgLy9cbiAgICByZXR1cm4gY2ZnO1xufVxuXG5cbi8vIFRoZSBtYWluIHByb2dyYW0sIHdoZXJlaW4gdGhlIGFwcCBpcyBjcmVhdGVkIGFuZCB3aXJlZCB0byB0aGUgYnJvd3Nlci4gXG4vL1xuZnVuY3Rpb24gX19tYWluX18gKHNlbGVjdG9yKSB7XG4gICAgLy8gQmVob2xkLCB0aGUgTUdWIGFwcGxpY2F0aW9uIG9iamVjdC4uLlxuICAgIGxldCBtZ3YgPSBudWxsO1xuXG4gICAgLy8gQ2FsbGJhY2sgdG8gcGFzcyBpbnRvIHRoZSBhcHAgdG8gcmVnaXN0ZXIgY2hhbmdlcyBpbiBjb250ZXh0LlxuICAgIC8vIFVzZXMgdGhlIGN1cnJlbnQgYXBwIGNvbnRleHQgdG8gc2V0IHRoZSBoYXNoIHBhcnQgb2YgdGhlXG4gICAgLy8gYnJvd3NlcidzIGxvY2F0aW9uLiBUaGlzIGFsc28gcmVnaXN0ZXJzIHRoZSBjaGFuZ2UgaW4gXG4gICAgLy8gdGhlIGJyb3dzZXIgaGlzdG9yeS5cbiAgICBmdW5jdGlvbiBzZXRIYXNoICgpIHtcblx0bGV0IG5ld0hhc2ggPSBtZ3YuZ2V0UGFyYW1TdHJpbmcoKTtcblx0aWYgKCcjJytuZXdIYXNoID09PSB3aW5kb3cubG9jYXRpb24uaGFzaCkgcmV0dXJuO1xuXHQvLyBkb24ndCB3YW50IHRvIHRyaWdnZXIgYW4gaW5maW5pdGUgbG9vcCBoZXJlIVxuXHQvLyB0ZW1wb3JhcmlseSBkaXNhYmxlIHBvcHN0YXRlIGhhbmRsZXJcblx0bGV0IGYgPSB3aW5kb3cub25wb3BzdGF0ZTtcblx0d2luZG93Lm9ucG9wc3RhdGUgPSBudWxsO1xuXHQvLyBub3cgc2V0IHRoZSBoYXNoXG5cdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gbmV3SGFzaDtcblx0Ly8gcmUtZW5hYmxlXG5cdHdpbmRvdy5vbnBvcHN0YXRlID0gZjtcbiAgICB9XG4gICAgLy8gSGFuZGxlciBjYWxsZWQgd2hlbiB1c2VyIGNsaWNrcyB0aGUgYnJvd3NlcidzIGJhY2sgb3IgZm9yd2FyZCBidXR0b25zLlxuICAgIC8vIFNldHMgdGhlIGFwcCdzIGNvbnRleHQgYmFzZWQgb24gdGhlIGhhc2ggcGFydCBvZiB0aGUgYnJvd3NlcidzXG4gICAgLy8gbG9jYXRpb24uXG4gICAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbihldmVudCkge1xuXHRsZXQgY2ZnID0gcHFzdHJpbmcoZG9jdW1lbnQubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuXHRtZ3Yuc2V0Q29udGV4dChjZmcpO1xuICAgIH07XG4gICAgLy8gZ2V0IGluaXRpYWwgc2V0IG9mIGNvbnRleHQgcGFyYW1zIFxuICAgIGxldCBxc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpO1xuICAgIGxldCBjZmcgPSBwcXN0cmluZyhxc3RyaW5nKTtcbiAgICBjZmcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjZmcub25jb250ZXh0Y2hhbmdlID0gc2V0SGFzaDtcblxuICAgIC8vIGNyZWF0ZSB0aGUgYXBwXG4gICAgd2luZG93Lm1ndiA9IG1ndiA9IG5ldyBNR1ZBcHAoc2VsZWN0b3IsIGNmZyk7XG4gICAgXG4gICAgLy8gaGFuZGxlIHJlc2l6ZSBldmVudHNcbiAgICB3aW5kb3cub25yZXNpemUgPSAoKSA9PiB7bWd2LnJlc2l6ZSgpO21ndi5zZXRDb250ZXh0KHt9KTt9XG59XG5cblxuX19tYWluX18oXCIjbWd2XCIpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvdmlld2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHBhcnNlQ29vcmRzLCBmb3JtYXRDb29yZHMsIGQzdHN2LCBpbml0T3B0TGlzdCwgc2FtZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgR2Vub21lIH0gICAgICAgICAgZnJvbSAnLi9HZW5vbWUnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gICAgICAgZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgRmVhdHVyZU1hbmFnZXIgfSAgZnJvbSAnLi9GZWF0dXJlTWFuYWdlcic7XG5pbXBvcnQgeyBRdWVyeU1hbmFnZXIgfSAgICBmcm9tICcuL1F1ZXJ5TWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0TWFuYWdlciB9ICAgICBmcm9tICcuL0xpc3RNYW5hZ2VyJztcbmltcG9ydCB7IExpc3RFZGl0b3IgfSAgICAgIGZyb20gJy4vTGlzdEVkaXRvcic7XG5pbXBvcnQgeyBVc2VyUHJlZnNNYW5hZ2VyIH0gZnJvbSAnLi9Vc2VyUHJlZnNNYW5hZ2VyJztcbmltcG9ydCB7IEZhY2V0TWFuYWdlciB9ICAgIGZyb20gJy4vRmFjZXRNYW5hZ2VyJztcbmltcG9ydCB7IEJUTWFuYWdlciB9ICAgICAgIGZyb20gJy4vQlRNYW5hZ2VyJztcbmltcG9ydCB7IEdlbm9tZVZpZXcgfSAgICAgIGZyb20gJy4vR2Vub21lVmlldyc7XG5pbXBvcnQgeyBGZWF0dXJlRGV0YWlscyB9ICBmcm9tICcuL0ZlYXR1cmVEZXRhaWxzJztcbmltcG9ydCB7IFpvb21WaWV3IH0gICAgICAgIGZyb20gJy4vWm9vbVZpZXcnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIE1HVkFwcCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHNlbGVjdG9yLCBjZmcpIHtcblx0c3VwZXIobnVsbCwgc2VsZWN0b3IpO1xuXHR0aGlzLmFwcCA9IHRoaXM7XG5cdC8vXG5cdHRoaXMuaW5pdGlhbENmZyA9IGNmZztcblx0Ly9cblx0dGhpcy5jb250ZXh0Q2hhbmdlZCA9IChjZmcub25jb250ZXh0Y2hhbmdlIHx8IGZ1bmN0aW9uKCl7fSk7XG5cdC8vXG5cdHRoaXMubmFtZTJnZW5vbWUgPSB7fTsgIC8vIG1hcCBmcm9tIGdlbm9tZSBuYW1lIC0+IGdlbm9tZSBkYXRhIG9ialxuXHR0aGlzLmxhYmVsMmdlbm9tZSA9IHt9OyAvLyBtYXAgZnJvbSBnZW5vbWUgbGFiZWwgLT4gZ2Vub21lIGRhdGEgb2JqXG5cdHRoaXMubmwyZ2Vub21lID0ge307ICAgIC8vIGNvbWJpbmVzIGluZGV4ZXNcblx0Ly9cblx0dGhpcy5hbGxHZW5vbWVzID0gW107ICAgLy8gbGlzdCBvZiBhbGwgYXZhaWxhYmxlIGdlbm9tZXNcblx0dGhpcy5yR2Vub21lID0gbnVsbDsgICAgLy8gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZVxuXHR0aGlzLmNHZW5vbWVzID0gW107ICAgICAvLyBjdXJyZW50IGNvbXBhcmlzb24gZ2Vub21lcyAockdlbm9tZSBpcyAqbm90KiBpbmNsdWRlZCkuXG5cdHRoaXMudkdlbm9tZXMgPSBbXTtcdC8vIGxpc3Qgb2YgYWxsIGN1cnJlbnR5IHZpZXdlZCBnZW5vbWVzIChyZWYrY29tcHMpIGluIFktb3JkZXIuXG5cdC8vXG5cdHRoaXMuZHVyID0gMjUwOyAgICAgICAgIC8vIGFuaW1hdGlvbiBkdXJhdGlvbiwgaW4gbXNcblx0dGhpcy5kZWZhdWx0Wm9vbSA9IDI7XHQvLyBtdWx0aXBsaWVyIG9mIGN1cnJlbnQgcmFuZ2Ugd2lkdGguIE11c3QgYmUgPj0gMS4gMSA9PSBubyB6b29tLlxuXHRcdFx0XHQvLyAoem9vbWluZyBpbiB1c2VzIDEvdGhpcyBhbW91bnQpXG5cdHRoaXMuZGVmYXVsdFBhbiAgPSAwLjE1Oy8vIGZyYWN0aW9uIG9mIGN1cnJlbnQgcmFuZ2Ugd2lkdGhcblx0dGhpcy5jb29yZHMgPSB7IGNocjogXCIxXCIsIHN0YXJ0OiAxMDAwMDAwLCBlbmQ6IDEwMDAwMDAwIH07XG5cdC8vXG5cdC8vIFRPRE86IHJlZmFjdG9yIHBhZ2Vib3gsIGRyYWdnYWJsZSwgYW5kIGZyaWVuZHMgaW50byBhIGZyYW1ld29yayBtb2R1bGUsXG5cdC8vIFxuXHR0aGlzLnBiRHJhZ2dlciA9IHRoaXMuZ2V0Q29udGVudERyYWdnZXIoKTtcblx0ZDMuc2VsZWN0QWxsKFwiLnBhZ2Vib3hcIilcblx0ICAgIC5jYWxsKHRoaXMucGJEcmFnZ2VyKVxuXHQgICAgLmFwcGVuZChcImlcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zIGJ1c3kgcm90YXRpbmdcIilcblx0ICAgIDtcblx0ZDMuc2VsZWN0QWxsKFwiLmNsb3NhYmxlXCIpXG5cdCAgICAuYXBwZW5kKFwiaVwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwibWF0ZXJpYWwtaWNvbnMgYnV0dG9uIGNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5kZWZhdWx0XCIsIGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgcCA9IGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUpO1xuXHRcdHAuY2xhc3NlZChcImNsb3NlZFwiLCAhIHAuY2xhc3NlZChcImNsb3NlZFwiKSk7XG5cdFx0c2VsZi5zZXRQcmVmc0Zyb21VSSgpO1xuXHQgICAgfSk7XG5cdGQzLnNlbGVjdEFsbChcIi5jb250ZW50LWRyYWdnYWJsZSA+ICpcIilcblx0ICAgIC5hcHBlbmQoXCJpXCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29ucyBidXR0b24gZHJhZ2hhbmRsZVwiKTtcblx0Ly9cblx0Ly9cblx0dGhpcy5nZW5vbWVWaWV3ID0gbmV3IEdlbm9tZVZpZXcodGhpcywgXCIjZ2Vub21lVmlld1wiLCA4MDAsIDI1MCk7XG5cdHRoaXMuem9vbVZpZXcgICA9IG5ldyBab29tVmlldyAgKHRoaXMsIFwiI3pvb21WaWV3XCIsIDgwMCwgMjUwLCB0aGlzLmNvb3Jkcyk7XG5cdHRoaXMucmVzaXplKCk7XG4gICAgICAgIC8vXG5cdHRoaXMuZmVhdHVyZURldGFpbHMgPSBuZXcgRmVhdHVyZURldGFpbHModGhpcywgXCIjZmVhdHVyZURldGFpbHNcIik7XG5cblx0dGhpcy5jc2NhbGUgPSBkMy5zY2FsZS5jYXRlZ29yeTEwKCkuZG9tYWluKFtcblx0ICAgIFwicHJvdGVpbl9jb2RpbmdfZ2VuZVwiLFxuXHQgICAgXCJwc2V1ZG9nZW5lXCIsXG5cdCAgICBcIm5jUk5BX2dlbmVcIixcblx0ICAgIFwiZ2VuZV9zZWdtZW50XCIsXG5cdCAgICBcIm90aGVyX2dlbmVcIixcblx0ICAgIFwib3RoZXJfZmVhdHVyZV90eXBlXCJcblx0XSk7XG5cdC8vXG5cdC8vXG5cdHRoaXMubGlzdE1hbmFnZXIgICAgPSBuZXcgTGlzdE1hbmFnZXIodGhpcywgXCIjbXlsaXN0c1wiKTtcblx0dGhpcy5saXN0TWFuYWdlci51cGRhdGUoKTtcblx0Ly9cblx0dGhpcy5saXN0RWRpdG9yID0gbmV3IExpc3RFZGl0b3IodGhpcywgJyNsaXN0ZWRpdG9yJyk7XG5cdC8vXG5cdHRoaXMudHJhbnNsYXRvciAgICAgPSBuZXcgQlRNYW5hZ2VyKHRoaXMpO1xuXHR0aGlzLmZlYXR1cmVNYW5hZ2VyID0gbmV3IEZlYXR1cmVNYW5hZ2VyKHRoaXMpO1xuXHQvL1xuXHRsZXQgc2VhcmNoVHlwZXMgPSBbe1xuXHQgICAgbWV0aG9kOiBcImZlYXR1cmVzQnlJZFwiLFxuXHQgICAgbGFiZWw6IFwiLi4uYnkgc3ltYm9sL0lEXCIsXG5cdCAgICB0ZW1wbGF0ZTogXCJcIixcblx0ICAgIHBsYWNlaG9sZGVyOiBcIk1HSSBzeW1ib2xzL0lEc1wiXG5cdH0se1xuXHQgICAgbWV0aG9kOiBcImZlYXR1cmVzQnlGdW5jdGlvblwiLFxuXHQgICAgbGFiZWw6IFwiLi4uYnkgY2VsbHVsYXIgZnVuY3Rpb25cIixcblx0ICAgIHRlbXBsYXRlOiBcIlwiLFxuXHQgICAgcGxhY2Vob2xkZXI6IFwiR2VuZSBPbnRvbG9neSAoR08pIHRlcm1zL0lEc1wiXG5cdH0se1xuXHQgICAgbWV0aG9kOiBcImZlYXR1cmVzQnlQaGVub3R5cGVcIixcblx0ICAgIGxhYmVsOiBcIi4uLmJ5IG11dGFudCBwaGVub3R5cGVcIixcblx0ICAgIHRlbXBsYXRlOiBcIlwiLFxuXHQgICAgcGxhY2Vob2xkZXI6IFwiTWFtbWFsaWFuIFBoZW5vdHlwZSAoTVApIHRlcm1zL0lEc1wiXG5cdH0se1xuXHQgICAgbWV0aG9kOiBcImZlYXR1cmVzQnlEaXNlYXNlXCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBkaXNlYXNlIGltcGxpY2F0aW9uXCIsXG5cdCAgICB0ZW1wbGF0ZTogXCJcIixcblx0ICAgIHBsYWNlaG9sZGVyOiBcIkRpc2Vhc2UgT250b2xvZ3kgKERPKSB0ZXJtcy9JRHNcIlxuXHR9XTtcblx0dGhpcy5xdWVyeU1hbmFnZXIgPSBuZXcgUXVlcnlNYW5hZ2VyKHRoaXMsIFwiI2ZpbmRHZW5lc0JveFwiLCBzZWFyY2hUeXBlcyk7XG5cdC8vXG5cdHRoaXMudXNlclByZWZzTWFuYWdlciA9IG5ldyBVc2VyUHJlZnNNYW5hZ2VyKCk7XG5cdC8vXG5cdC8vIEJ1dHRvbjogR2VhciBpY29uIHRvIHNob3cvaGlkZSBsZWZ0IGNvbHVtblxuXHRkMy5zZWxlY3QoXCIjaGVhZGVyID4gLmdlYXIuYnV0dG9uXCIpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IGxjID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJsZWZ0Y29sdW1uXCJdJyk7XG5cdFx0bGMuY2xhc3NlZChcImNsb3NlZFwiLCAoKSA9PiAhIGxjLmNsYXNzZWQoXCJjbG9zZWRcIikpO1xuXHRcdHdpbmRvdy5zZXRUaW1lb3V0KCgpPT57XG5cdFx0ICAgIHRoaXMucmVzaXplKClcblx0XHQgICAgdGhpcy5zZXRDb250ZXh0KHt9KTtcblx0XHQgICAgdGhpcy5zZXRQcmVmc0Zyb21VSSgpO1xuXHRcdH0sIDI1MCk7XG5cdCAgICB9KTtcblx0XG5cdC8vXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRmFjZXRzXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0dGhpcy5mYWNldE1hbmFnZXIgPSBuZXcgRmFjZXRNYW5hZ2VyKHRoaXMpO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0Ly8gRmVhdHVyZS10eXBlIGZhY2V0XG5cdGxldCBmdEZhY2V0ICA9IHRoaXMuZmFjZXRNYW5hZ2VyLmFkZEZhY2V0KFwiRmVhdHVyZVR5cGVcIiwgZiA9PiBmLmdldE11bmdlZFR5cGUoKSk7XG5cdHRoaXMuaW5pdEZlYXRUeXBlQ29udHJvbChmdEZhY2V0KTtcblxuXHQvLyBIYXMtTUdJLWlkIGZhY2V0XG5cdGxldCBtZ2lGYWNldCA9IHRoaXMuZmFjZXRNYW5hZ2VyLmFkZEZhY2V0KFwiSGFzTWdpSWRcIiwgICAgZiA9PiBmLm1naWlkICA/IFwieWVzXCIgOiBcIm5vXCIgKTtcblx0ZDMuc2VsZWN0QWxsKCdpbnB1dFtuYW1lPVwibWdpRmFjZXRcIl0nKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpe1xuXHQgICAgbWdpRmFjZXQuc2V0VmFsdWVzKHRoaXMudmFsdWUgPT09IFwiXCIgPyBbXSA6IFt0aGlzLnZhbHVlXSk7XG5cdCAgICBzZWxmLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9KTtcblxuXHQvLyBJcy1oaWdobGlnaHRlZCBmYWNldFxuXHRsZXQgaGlGYWNldCA9IHRoaXMuZmFjZXRNYW5hZ2VyLmFkZEZhY2V0KFwiSXNIaVwiLCBmID0+IHtcblx0ICAgIGxldCBpc2hpID0gdGhpcy56b29tVmlldy5oaUZlYXRzW2YubWdpaWRdIHx8IHRoaXMuem9vbVZpZXcuaGlGZWF0c1tmLm1ncGlkXTtcblx0ICAgIHJldHVybiBpc2hpID8gXCJ5ZXNcIiA6IFwibm9cIjtcblx0fSk7XG5cdGQzLnNlbGVjdEFsbCgnaW5wdXRbbmFtZT1cImhpRmFjZXRcIl0nKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpe1xuXHQgICAgaGlGYWNldC5zZXRWYWx1ZXModGhpcy52YWx1ZSA9PT0gXCJcIiA/IFtdIDogW3RoaXMudmFsdWVdKTtcblx0ICAgIHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXG5cblx0Ly9cblx0dGhpcy5zZXRVSUZyb21QcmVmcygpO1xuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQvLyBUaGluZ3MgYXJlIGFsbCB3aXJlZCB1cC4gTm93IGxldCdzIGdldCBzb21lIGRhdGEuXG5cdC8vIFN0YXJ0IHdpdGggdGhlIGZpbGUgb2YgYWxsIHRoZSBnZW5vbWVzLlxuXHRkM3RzdihcIi4vZGF0YS9nZW5vbWVMaXN0LnRzdlwiKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHQgICAgLy8gY3JlYXRlIEdlbm9tZSBvYmplY3RzIGZyb20gdGhlIHJhdyBkYXRhLlxuXHQgICAgdGhpcy5hbGxHZW5vbWVzICAgPSBkYXRhLm1hcChnID0+IG5ldyBHZW5vbWUoZykpO1xuXHQgICAgdGhpcy5hbGxHZW5vbWVzLnNvcnQoIChhLGIpID0+IHtcblx0ICAgICAgICByZXR1cm4gYS5sYWJlbCA8IGIubGFiZWwgPyAtMSA6IGEubGFiZWwgPiBiLmxhYmVsID8gKzEgOiAwO1xuXHQgICAgfSk7XG5cdCAgICAvL1xuXHQgICAgLy8gYnVpbGQgYSBuYW1lLT5HZW5vbWUgaW5kZXhcblx0ICAgIHRoaXMubmwyZ2Vub21lID0ge307IC8vIGFsc28gYnVpbGQgdGhlIGNvbWJpbmVkIGxpc3QgYXQgdGhlIHNhbWUgdGltZS4uLlxuXHQgICAgdGhpcy5uYW1lMmdlbm9tZSAgPSB0aGlzLmFsbEdlbm9tZXNcblx0ICAgICAgICAucmVkdWNlKChhY2MsZykgPT4geyB0aGlzLm5sMmdlbm9tZVtnLm5hbWVdID0gYWNjW2cubmFtZV0gPSBnOyByZXR1cm4gYWNjOyB9LCB7fSk7XG5cdCAgICAvLyBidWlsZCBhIGxhYmVsLT5HZW5vbWUgaW5kZXhcblx0ICAgIHRoaXMubGFiZWwyZ2Vub21lID0gdGhpcy5hbGxHZW5vbWVzXG5cdCAgICAgICAgLnJlZHVjZSgoYWNjLGcpID0+IHsgdGhpcy5ubDJnZW5vbWVbZy5sYWJlbF0gPSBhY2NbZy5sYWJlbF0gPSBnOyByZXR1cm4gYWNjOyB9LCB7fSk7XG5cblx0ICAgIC8vXG5cdCAgICBsZXQgY2ZnID0gdGhpcy5zYW5pdGl6ZUNmZyh0aGlzLmluaXRpYWxDZmcpO1xuXHQgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG5cdCAgICAvLyBpbml0aWFsaXplIHRoZSByZWYgYW5kIGNvbXAgZ2Vub21lIG9wdGlvbiBsaXN0c1xuXHQgICAgaW5pdE9wdExpc3QoXCIjcmVmR2Vub21lXCIsICAgdGhpcy5hbGxHZW5vbWVzLCBnPT5nLm5hbWUsIGc9PmcubGFiZWwsIGZhbHNlLCBnID0+IGcgPT09IGNmZy5yZWYpO1xuXHQgICAgaW5pdE9wdExpc3QoXCIjY29tcEdlbm9tZXNcIiwgdGhpcy5hbGxHZW5vbWVzLCBnPT5nLm5hbWUsIGc9PmcubGFiZWwsIHRydWUsICBnID0+IGNmZy5nZW5vbWVzLmluZGV4T2YoZykgIT09IC0xKTtcblx0ICAgIGQzLnNlbGVjdChcIiNyZWZHZW5vbWVcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG5cdFx0c2VsZi5zZXRDb250ZXh0KHsgcmVmOiB0aGlzLnZhbHVlIH0pO1xuXHQgICAgfSk7XG5cdCAgICBkMy5zZWxlY3QoXCIjY29tcEdlbm9tZXNcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG5cdFx0bGV0IHNlbGVjdGVkTmFtZXMgPSBbXTtcblx0XHRmb3IobGV0IHggb2YgdGhpcy5zZWxlY3RlZE9wdGlvbnMpe1xuXHRcdCAgICBzZWxlY3RlZE5hbWVzLnB1c2goeC52YWx1ZSk7XG5cdFx0fVxuXHRcdC8vIHdhbnQgdG8gcHJlc2VydmUgY3VycmVudCBnZW5vbWUgb3JkZXIgYXMgbXVjaCBhcyBwb3NzaWJsZSBcblx0XHRsZXQgZ05hbWVzID0gc2VsZi52R2Vub21lcy5tYXAoZz0+Zy5uYW1lKVxuXHRcdCAgICAuZmlsdGVyKG4gPT4ge1xuXHRcdCAgICAgICAgcmV0dXJuIHNlbGVjdGVkTmFtZXMuaW5kZXhPZihuKSA+PSAwIHx8IG4gPT09IHNlbGYuckdlbm9tZS5uYW1lO1xuXHRcdCAgICB9KTtcblx0XHRnTmFtZXMgPSBnTmFtZXMuY29uY2F0KHNlbGVjdGVkTmFtZXMuZmlsdGVyKG4gPT4gZ05hbWVzLmluZGV4T2YobikgPT09IC0xKSk7XG5cdFx0c2VsZi5zZXRDb250ZXh0KHsgZ2Vub21lczogZ05hbWVzIH0pO1xuXHQgICAgfSk7XG5cdCAgICAvL1xuXHQgICAgLy8gUHJlbG9hZCBhbGwgdGhlIGNocm9tb3NvbWUgZmlsZXMgZm9yIGFsbCB0aGUgZ2Vub21lc1xuXHQgICAgbGV0IGNkcHMgPSB0aGlzLmFsbEdlbm9tZXMubWFwKGcgPT4gZDN0c3YoYC4vZGF0YS9nZW5vbWVkYXRhLyR7Zy5uYW1lfS1jaHJvbW9zb21lcy50c3ZgKSk7XG5cdCAgICByZXR1cm4gUHJvbWlzZS5hbGwoY2Rwcyk7XG5cdH0uYmluZCh0aGlzKSlcblx0LnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblxuXHQgICAgLy9cblx0ICAgIHRoaXMucHJvY2Vzc0Nocm9tb3NvbWVzKGRhdGEpO1xuXG5cdCAgICAvLyBGSU5BTExZISBXZSBhcmUgcmVhZHkgdG8gZHJhdyB0aGUgaW5pdGlhbCBzY2VuZS5cblx0ICAgIHRoaXMuc2V0Q29udGV4dCh0aGlzLmluaXRpYWxDZmcpO1xuXG5cdH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHByb2Nlc3NDaHJvbW9zb21lcyAoZGF0YSkge1xuXHQvLyBkYXRhIGlzIGEgbGlzdCBvZiBjaHJvbW9zb21lIGxpc3RzLCBvbmUgcGVyIGdlbm9tZVxuXHQvLyBGaWxsIGluIHRoZSBnZW5vbWVDaHJzIG1hcCAoZ2Vub21lIC0+IGNociBsaXN0KVxuXHR0aGlzLmFsbEdlbm9tZXMuZm9yRWFjaCgoZyxpKSA9PiB7XG5cdCAgICAvLyBuaWNlbHkgc29ydCB0aGUgY2hyb21vc29tZXNcblx0ICAgIGxldCBjaHJzID0gZGF0YVtpXTtcblx0ICAgIGcubWF4bGVuID0gMDtcblx0ICAgIGNocnMuZm9yRWFjaCggYyA9PiB7XG5cdFx0Ly9cblx0XHRjLmxlbmd0aCA9IHBhcnNlSW50KGMubGVuZ3RoKVxuXHRcdGcubWF4bGVuID0gTWF0aC5tYXgoZy5tYXhsZW4sIGMubGVuZ3RoKTtcblx0XHQvLyBiZWNhdXNlIEknZCByYXRoZXIgc2F5IFwiY2hyb21vc29tZS5uYW1lXCIgdGhhbiBcImNocm9tb3NvbWUuY2hyb21vc29tZVwiXG5cdFx0Yy5uYW1lID0gYy5jaHJvbW9zb21lO1xuXHRcdGRlbGV0ZSBjLmNocm9tb3NvbWU7XG5cdCAgICB9KTtcblx0ICAgIC8vIG5pY2VseSBzb3J0IHRoZSBjaHJvbW9zb21lc1xuXHQgICAgY2hycy5zb3J0KChhLGIpID0+IHtcblx0XHRsZXQgYWEgPSBwYXJzZUludChhLm5hbWUpIC0gcGFyc2VJbnQoYi5uYW1lKTtcblx0XHRpZiAoIWlzTmFOKGFhKSkgcmV0dXJuIGFhO1xuXHRcdHJldHVybiBhLm5hbWUgPCBiLm5hbWUgPyAtMSA6IGEubmFtZSA+IGIubmFtZSA/ICsxIDogMDtcblx0ICAgIH0pO1xuXHQgICAgZy5jaHJvbW9zb21lcyA9IGNocnM7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RG9tICgpIHtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBnZXRDb250ZW50RHJhZ2dlciAoKSB7XG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAvLyBIZWxwZXIgZnVuY3Rpb24gZm9yIHRoZSBkcmFnIGJlaGF2aW9yLiBSZW9yZGVycyB0aGUgY29udGVudHMgYmFzZWQgb25cbiAgICAgIC8vIGN1cnJlbnQgc2NyZWVuIHBvc2l0aW9uIG9mIHRoZSBkcmFnZ2VkIGl0ZW0uXG4gICAgICBmdW5jdGlvbiByZW9yZGVyQnlEb20oKSB7XG5cdCAgLy8gTG9jYXRlIHRoZSBzaWIgd2hvc2UgcG9zaXRpb24gaXMgYmV5b25kIHRoZSBkcmFnZ2VkIGl0ZW0gYnkgdGhlIGxlYXN0IGFtb3VudFxuXHQgIGxldCBkciA9IHNlbGYuZHJhZ2dpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgbGV0IGJTaWIgPSBudWxsO1xuXHQgIGxldCB4eSA9IGQzLnNlbGVjdChzZWxmLmRyYWdQYXJlbnQpLmNsYXNzZWQoXCJmbGV4cm93XCIpID8gXCJ4XCIgOiBcInlcIjtcblx0ICBmb3IgKGxldCBzIG9mIHNlbGYuZHJhZ1NpYnMpIHtcblx0ICAgICAgbGV0IHNyID0gcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgaWYgKGRyW3h5XSA8IHNyW3h5XSkge1xuXHRcdCAgIGxldCBkaXN0ID0gc3JbeHldIC0gZHJbeHldO1xuXHRcdCAgIGlmICghYlNpYiB8fCBkaXN0IDwgYlNpYlt4eV0gLSBkclt4eV0pXG5cdFx0ICAgICAgIGJTaWIgPSBzO1xuXHQgICAgICB9XG5cdCAgfVxuXHQgIC8vIEluc2VydCB0aGUgZHJhZ2dlZCBpdGVtIGJlZm9yZSB0aGUgbG9jYXRlZCBzaWIgKG9yIGFwcGVuZCBpZiBubyBzaWIgZm91bmQpXG5cdCAgc2VsZi5kcmFnUGFyZW50Lmluc2VydEJlZm9yZShzZWxmLmRyYWdnaW5nLCBiU2liKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHJlb3JkZXJCeVN0eWxlKCkge1xuXHQgIGxldCBkZCA9IGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKTtcblx0ICAvLyBMb2NhdGUgdGhlIHNpYiB0aGF0IGNvbnRhaW5zIHRoZSBkcmFnZ2VkIGl0ZW0ncyBvcmlnaW4uXG5cdCAgbGV0IGRyID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICBsZXQgYlNpYiA9IG51bGw7XG5cdCAgbGV0IHh5ID0gZDMuc2VsZWN0KHNlbGYuZHJhZ1BhcmVudCkuY2xhc3NlZChcImZsZXhyb3dcIikgPyBcInhcIiA6IFwieVwiO1xuXHQgIGxldCBzeiA9IHh5ID09PSBcInhcIiA/IFwid2lkdGhcIiA6IFwiaGVpZ2h0XCI7XG5cdCAgbGV0IHN0eT0geHkgPT09IFwieFwiID8gXCJsZWZ0XCIgOiBcInRvcFwiO1xuXHQgIGZvciAobGV0IHMgb2Ygc2VsZi5kcmFnU2licykge1xuXHQgICAgICAvLyBza2lwIHRoZSBkcmFnZ2VkIGl0ZW1cblx0ICAgICAgaWYgKHMgPT09IHNlbGYuZHJhZ2dpbmcpIGNvbnRpbnVlO1xuXHQgICAgICBsZXQgZHMgPSBkMy5zZWxlY3Qocyk7XG5cdCAgICAgIGxldCBzciA9IHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIC8vIGlmdyB0aGUgZHJhZ2dlZCBpdGVtJ3Mgb3JpZ2luIGlzIGJldHdlZW4gdGhlIHN0YXJ0IGFuZCBlbmQgb2Ygc2liLCB3ZSBmb3VuZCBpdC5cblx0ICAgICAgaWYgKGRyW3h5XSA+PSBzclt4eV0gJiYgZHJbeHldIDw9IChzclt4eV0gKyBzcltzel0pKSB7XG5cdFx0ICAgLy8gbW92ZSBzaWIgdG93YXJkIHRoZSBob2xlLCBhbW91bnQgPSB0aGUgc2l6ZSBvZiB0aGUgaG9sZVxuXHRcdCAgIGxldCBhbXQgPSBzZWxmLmRyYWdIb2xlW3N6XSAqIChzZWxmLmRyYWdIb2xlW3h5XSA8IHNyW3h5XSA/IC0xIDogMSk7XG5cdFx0ICAgZHMuc3R5bGUoc3R5LCBwYXJzZUludChkcy5zdHlsZShzdHkpKSArIGFtdCArIFwicHhcIik7XG5cdFx0ICAgc2VsZi5kcmFnSG9sZVt4eV0gLT0gYW10O1xuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICB9XG5cdCAgfVxuICAgICAgfVxuICAgICAgLy9cbiAgICAgIHJldHVybiBkMy5iZWhhdmlvci5kcmFnKClcblx0ICAub3JpZ2luKGZ1bmN0aW9uKGQsaSl7XG5cdCAgICAgIHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIH0pXG4gICAgICAgICAgLm9uKFwiZHJhZ3N0YXJ0Lm1cIiwgZnVuY3Rpb24oKSB7XG5cdCAgICAgIGxldCB0ID0gZDMuZXZlbnQuc291cmNlRXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAoISBkMy5zZWxlY3QodCkuY2xhc3NlZChcImRyYWdoYW5kbGVcIikpIHJldHVybjtcblx0ICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIC8vXG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgICAgPSB0aGlzLmNsb3Nlc3QoXCIucGFnZWJveFwiKTtcblx0ICAgICAgc2VsZi5kcmFnSG9sZSAgICA9IHNlbGYuZHJhZ2dpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIHNlbGYuZHJhZ1BhcmVudCAgPSBzZWxmLmRyYWdnaW5nLnBhcmVudE5vZGU7XG5cdCAgICAgIHNlbGYuZHJhZ1NpYnMgICAgPSBzZWxmLmRyYWdQYXJlbnQuY2hpbGRyZW47XG5cdCAgICAgIC8vXG5cdCAgICAgIGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKS5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgdHJ1ZSk7XG5cdCAgfSlcblx0ICAub24oXCJkcmFnLm1cIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgbGV0IGRkID0gZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpO1xuXHQgICAgICBsZXQgdHAgPSBwYXJzZUludChkZC5zdHlsZShcInRvcFwiKSlcblx0ICAgICAgZGQuc3R5bGUoXCJ0b3BcIiwgdHAgKyBkMy5ldmVudC5keSArIFwicHhcIik7XG5cdCAgICAgIC8vcmVvcmRlckJ5U3R5bGUoKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWdlbmQubVwiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICByZW9yZGVyQnlEb20oKTtcblx0ICAgICAgc2VsZi5zZXRQcmVmc0Zyb21VSSgpO1xuXHQgICAgICBsZXQgZGQgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZyk7XG5cdCAgICAgIGRkLnN0eWxlKFwidG9wXCIsIFwiMHB4XCIpO1xuXHQgICAgICBkZC5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgZmFsc2UpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nICAgID0gbnVsbDtcblx0ICAgICAgc2VsZi5kcmFnSG9sZSAgICA9IG51bGw7XG5cdCAgICAgIHNlbGYuZHJhZ1BhcmVudCAgPSBudWxsO1xuXHQgICAgICBzZWxmLmRyYWdTaWJzICAgID0gbnVsbDtcblx0ICB9KVxuXHQgIDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0VUlGcm9tUHJlZnMgKCkge1xuICAgICAgICBsZXQgcHJlZnMgPSB0aGlzLnVzZXJQcmVmc01hbmFnZXIuZ2V0QWxsKCk7XG5cdGNvbnNvbGUubG9nKFwiR290IHByZWZzIGZyb20gc3RvcmFnZVwiLCBwcmVmcyk7XG5cblx0Ly8gc2V0IG9wZW4vY2xvc2VkIHN0YXRlc1xuXHQocHJlZnMuY2xvc2FibGVzIHx8IFtdKS5mb3JFYWNoKCBjID0+IHtcblx0ICAgIGxldCBpZCA9IGNbMF07XG5cdCAgICBsZXQgc3RhdGUgPSBjWzFdO1xuXHQgICAgZDMuc2VsZWN0KCcjJytpZCkuY2xhc3NlZCgnY2xvc2VkJywgc3RhdGUgPT09IFwiY2xvc2VkXCIgfHwgbnVsbCk7XG5cdH0pO1xuXG5cdC8vIHNldCBkcmFnZ2FibGVzJyBvcmRlclxuXHQocHJlZnMuZHJhZ2dhYmxlcyB8fCBbXSkuZm9yRWFjaCggZCA9PiB7XG5cdCAgICBsZXQgY3RySWQgPSBkWzBdO1xuXHQgICAgbGV0IGNvbnRlbnRJZHMgPSBkWzFdO1xuXHQgICAgbGV0IGN0ciA9IGQzLnNlbGVjdCgnIycrY3RySWQpO1xuXHQgICAgbGV0IGNvbnRlbnRzID0gY3RyLnNlbGVjdEFsbCgnIycrY3RySWQrJyA+IConKTtcblx0ICAgIGNvbnRlbnRzWzBdLnNvcnQoIChhLGIpID0+IHtcblx0ICAgICAgICBsZXQgYWkgPSBjb250ZW50SWRzLmluZGV4T2YoYS5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuXHQgICAgICAgIGxldCBiaSA9IGNvbnRlbnRJZHMuaW5kZXhPZihiLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG5cdFx0cmV0dXJuIGFpIC0gYmk7XG5cdCAgICB9KTtcblx0ICAgIGNvbnRlbnRzLm9yZGVyKCk7XG5cdH0pO1xuICAgIH1cbiAgICBzZXRQcmVmc0Zyb21VSSAoKSB7XG4gICAgICAgIC8vIHNhdmUgb3Blbi9jbG9zZWQgc3RhdGVzXG5cdGxldCBjbG9zYWJsZXMgPSB0aGlzLnJvb3Quc2VsZWN0QWxsKCcuY2xvc2FibGUnKTtcblx0bGV0IG9jRGF0YSA9IGNsb3NhYmxlc1swXS5tYXAoIGMgPT4ge1xuXHQgICAgbGV0IGRjID0gZDMuc2VsZWN0KGMpO1xuXHQgICAgcmV0dXJuIFtkYy5hdHRyKCdpZCcpLCBkYy5jbGFzc2VkKFwiY2xvc2VkXCIpID8gXCJjbG9zZWRcIiA6IFwib3BlblwiXTtcblx0fSk7XG5cdC8vIHNhdmUgZHJhZ2dhYmxlcycgb3JkZXJcblx0bGV0IGRyYWdDdHJzID0gdGhpcy5yb290LnNlbGVjdEFsbCgnLmNvbnRlbnQtZHJhZ2dhYmxlJyk7XG5cdGxldCBkcmFnZ2FibGVzID0gZHJhZ0N0cnMuc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUgPiAqJyk7XG5cdGxldCBkZERhdGEgPSBkcmFnZ2FibGVzLm1hcCggKGQsaSkgPT4ge1xuXHQgICAgbGV0IGN0ciA9IGQzLnNlbGVjdChkcmFnQ3Ryc1swXVtpXSk7XG5cdCAgICByZXR1cm4gW2N0ci5hdHRyKCdpZCcpLCBkLm1hcCggZGQgPT4gZDMuc2VsZWN0KGRkKS5hdHRyKCdpZCcpKV07XG5cdH0pO1xuXHRsZXQgcHJlZnMgPSB7XG5cdCAgICBjbG9zYWJsZXM6IG9jRGF0YSxcblx0ICAgIGRyYWdnYWJsZXM6IGRkRGF0YVxuXHR9XG5cdGNvbnNvbGUubG9nKFwiU2F2aW5nIHByZWZzIHRvIHN0b3JhZ2VcIiwgcHJlZnMpO1xuXHR0aGlzLnVzZXJQcmVmc01hbmFnZXIuc2V0QWxsKHByZWZzKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd0Jsb2NrcyAoY29tcCkge1xuXHRsZXQgcmVmID0gdGhpcy5yR2Vub21lO1xuXHRpZiAoISBjb21wKSBjb21wID0gdGhpcy5jR2Vub21lc1swXTtcblx0aWYgKCEgY29tcCkgcmV0dXJuO1xuXHR0aGlzLnRyYW5zbGF0b3IucmVhZHkoKS50aGVuKCAoKSA9PiB7XG5cdCAgICBsZXQgYmxvY2tzID0gY29tcCA9PT0gcmVmID8gW10gOiB0aGlzLnRyYW5zbGF0b3IuZ2V0QmxvY2tzKHJlZiwgY29tcCk7XG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd0Jsb2Nrcyh7IHJlZiwgY29tcCwgYmxvY2tzIH0pO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd0J1c3kgKGlzQnVzeSkge1xuICAgICAgICBkMy5zZWxlY3QoXCIjaGVhZGVyID4gLmdlYXIuYnV0dG9uXCIpXG5cdCAgICAuY2xhc3NlZChcInJvdGF0aW5nXCIsIGlzQnVzeSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICBnICAoc3RyaW5nKSBnZW5vbWUgbmFtZSAoZWcgXCJtdXNfY2Fyb2xpXCIpIG9yIGxhYmVsIChlZyBcIkNBUk9MSS9FaUpcIikgXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgIHRydWUgaWZmIHRoZSByZWYgZ2Vub21lIHdhcyBhY3R1YWxseSBjaGFuZ2VkXG4gICAgc2V0UmVmR2Vub21lIChnKSB7XG5cdC8vXG5cdGlmICghZykgcmV0dXJuIGZhbHNlO1xuXHQvL1xuXHRsZXQgcmcgPSB0aGlzLm5sMmdlbm9tZVtnXTtcblx0aWYgKHJnICYmIHJnICE9PSB0aGlzLnJHZW5vbWUpe1xuXHQgICAgLy8gY2hhbmdlIHRoZSByZWYgZ2Vub21lXG5cdCAgICB0aGlzLnJHZW5vbWUgPSByZztcblx0ICAgIGQzLnNlbGVjdEFsbChcIiNyZWZHZW5vbWUgb3B0aW9uXCIpXG5cdCAgICAgICAgLnByb3BlcnR5KFwic2VsZWN0ZWRcIiwgIGdnID0+IChnZy5sYWJlbCA9PT0gcmcubGFiZWwgIHx8IG51bGwpKTtcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQXJnczpcbiAgICAvLyAgIGdsaXN0IChsaXN0IG9mIHN0cmluZ3MpIGdlbm9tZSBuYW1lIG9yIGxhYmVsc1xuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICB0cnVlIGlmZiBjb21wIGdlbm9tZXMgYWN0dWFsbHkgY2hhbmdlZFxuICAgIHNldENvbXBHZW5vbWVzIChnbGlzdCkge1xuICAgICAgICAvL1xuICAgICAgICBpZiAoIWdsaXN0KSByZXR1cm4gZmFsc2U7XG5cdC8vIFxuXHRsZXQgY2dzID0gW107XG5cdGZvciggbGV0IHggb2YgZ2xpc3QgKSB7XG5cdCAgICBsZXQgY2cgPSB0aGlzLm5sMmdlbm9tZVt4XTtcblx0ICAgIGNnICYmIGNnICE9PSB0aGlzLnJHZW5vbWUgJiYgY2dzLmluZGV4T2YoY2cpID09PSAtMSAmJiBjZ3MucHVzaChjZyk7XG5cdH1cblx0bGV0IGNnbnMgPSBjZ3MubWFwKCBjZyA9PiBjZy5sYWJlbCApO1xuXHRkMy5zZWxlY3RBbGwoXCIjY29tcEdlbm9tZXMgb3B0aW9uXCIpXG5cdCAgICAgICAgLnByb3BlcnR5KFwic2VsZWN0ZWRcIiwgIGdnID0+IGNnbnMuaW5kZXhPZihnZy5sYWJlbCkgPj0gMCk7XG5cdC8vXG5cdC8vIGNvbXBhcmUgY29udGVudHMgb2YgY2dzIHdpdGggdGhlIGN1cnJlbnQgY0dlbm9tZXMuXG5cdGlmIChzYW1lKGNncywgdGhpcy5jR2Vub21lcykpIHJldHVybiBmYWxzZTtcblx0Ly9cblx0dGhpcy5jR2Vub21lcyA9IGNncztcblx0cmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNldHMgb3IgcmV0dXJuc1xuICAgIHNldEhpZ2hsaWdodCAoZmxpc3QpIHtcblx0aWYgKCFmbGlzdCkgcmV0dXJuIGZhbHNlO1xuXHR0aGlzLnpvb21WaWV3LmhpRmVhdHMgPSBmbGlzdC5yZWR1Y2UoKGEsdikgPT4geyBhW3ZdPXY7IHJldHVybiBhOyB9LCB7fSk7XG5cdHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGNvbnRleHQgYXMgYW4gb2JqZWN0LlxuICAgIC8vIEN1cnJlbnQgY29udGV4dCA9IHJlZiBnZW5vbWUgKyBjb21wIGdlbm9tZXMgKyBjdXJyZW50IHJhbmdlIChjaHIsc3RhcnQsZW5kKVxuICAgIGdldENvbnRleHQgKCkge1xuICAgICAgICBsZXQgYyA9IHRoaXMuem9vbVZpZXcuY29vcmRzO1xuICAgICAgICByZXR1cm4ge1xuXHQgICAgcmVmIDogdGhpcy5yR2Vub21lLmxhYmVsLFxuXHQgICAgZ2Vub21lczogdGhpcy52R2Vub21lcy5tYXAoZz0+Zy5sYWJlbCksXG5cdCAgICBjaHI6IGMuY2hyLFxuXHQgICAgc3RhcnQ6IGMuc3RhcnQsXG5cdCAgICBlbmQ6IGMuZW5kLFxuXHQgICAgaGlnaGxpZ2h0OiBPYmplY3Qua2V5cyh0aGlzLnpvb21WaWV3LmhpRmVhdHMpXG5cdH1cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHNhbml0aXplZCB2ZXJzaW9uIG9mIHRoZSBhcmd1bWVudCBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAgICAvLyBUaGUgc2FuaXRpemVkIHZlcnNpb246XG4gICAgLy8gICAgIC0gaGFzIGEgc2V0dGluZyBmb3IgZXZlcnkgcGFyYW1ldGVyLiBQYXJhbWV0ZXJzIG5vdCBzcGVjaWZpZWQgaW4gdGhlIGFyZ3VtZW50IGFyZSAoZ2VuZXJhbGx5KSBmaWxsZWRcbiAgICAvLyAgICAgaW4gd2l0aCB0aGVpciBjdXJyZW50IHZhbHVlcy5cbiAgICAvLyAgICAgLSBpcyBhbHdheXMgdmFsaWQsIGVnXG4gICAgLy8gICAgIFx0LSBoYXMgYSBsaXN0IG9mIDEgb3IgbW9yZSB2YWxpZCBnZW5vbWVzLCB3aXRoIG9uZSBvZiB0aGVtIGRlc2lnbmF0ZWQgYXMgdGhlIHJlZlxuICAgIC8vICAgICBcdC0gaGFzIGEgdmFsaWQgY29vcmRpbmF0ZSByYW5nZVxuICAgIC8vXG4gICAgLy8gVGhlIHNhbml0aXplZCB2ZXJzaW9uIGlzIGFsc28gXCJjb21waWxlZFwiOlxuICAgIC8vICAgICAtIGl0IGhhcyBhY3R1YWwgR2Vub21lIG9iamVjdHMsIHdoZXJlIHRoZSBhcmd1bWVudCBqdXN0IGhhcyBuYW1lc1xuICAgIC8vICAgICAtIGdyb3VwcyB0aGUgY2hyK3N0YXJ0K2VuZCBpbiBcImNvb3Jkc1wiIG9iamVjdFxuICAgIC8vXG4gICAgLy9cbiAgICBzYW5pdGl6ZUNmZyAoYykge1xuXHRsZXQgY2ZnID0ge307XG5cblx0Ly8gU2FuaXRpemUgdGhlIGlucHV0LlxuXG5cdC8vIFxuXHRpZiAoYy53aWR0aCB8fCBjLmhlaWdodCkge1xuXHQgICAgY2ZnLndpZHRoID0gYy53aWR0aFxuXHR9XG5cblx0Ly9cblx0Ly8gU2V0IGNmZy5yZWYgdG8gc3BlY2lmaWVkIGdlbm9tZSwgXG5cdC8vICAgd2l0aCBmYWxsYmFjayB0byBjdXJyZW50IHJlZiBnZW5vbWUsIFxuXHQvLyAgICAgIHdpdGggZmFsbGJhY2sgdG8gQzU3QkwvNkogKDFzdCB0aW1lIHRocnUpXG5cdC8vIEZJWE1FOiBmaW5hbCBmYWxsYmFjayBzaG91bGQgYmUgYSBjb25maWcgc2V0dGluZy5cblx0Y2ZnLnJlZiA9IChjLnJlZiA/IHRoaXMubmwyZ2Vub21lW2MucmVmXSB8fCB0aGlzLnJHZW5vbWUgOiB0aGlzLnJHZW5vbWUpIHx8IHRoaXMubmwyZ2Vub21lWydDNTdCTC82SiddO1xuXG5cdC8vIFNldCBjZmcuZ2Vub21lcyB0byBiZSB0aGUgc3BlY2lmaWVkIGdlbm9tZXMsXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGdlbm9tZXNcblx0Ly8gICAgICAgIHdpdGggZmFsbGJhY2sgdG8gW3JlZl0gKDFzdCB0aW1lIHRocnUpXG5cdGNmZy5nZW5vbWVzID0gYy5nZW5vbWVzID9cblx0ICAgIChjLmdlbm9tZXMubWFwKGcgPT4gdGhpcy5ubDJnZW5vbWVbZ10pLmZpbHRlcih4PT54KSlcblx0ICAgIDpcblx0ICAgIHRoaXMudkdlbm9tZXM7XG5cdC8vIEFkZCByZWYgdG8gZ2Vub21lcyBpZiBub3QgdGhlcmUgYWxyZWFkeVxuXHRpZiAoY2ZnLmdlbm9tZXMuaW5kZXhPZihjZmcucmVmKSA9PT0gLTEpXG5cdCAgICBjZmcuZ2Vub21lcy51bnNoaWZ0KGNmZy5yZWYpO1xuXHRcblx0Ly8gU2V0IGNmZy5jaHIgdG8gYmUgdGhlIHNwZWNpZmllZCBjaHJvbW9zb21lXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGNoclxuXHQvLyAgICAgICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIDFzdCBjaHJvbW9zb21lIGluIHRoZSByZWYgZ2Vub21lXG5cdGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoYy5jaHIpO1xuXHRpZiAoIWNmZy5jaHIpIGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoIHRoaXMuY29vcmRzID8gdGhpcy5jb29yZHMuY2hyIDogXCIxXCIgKTtcblx0aWYgKCFjZmcuY2hyKSBjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKDApO1xuXHQvL2lmICghY2ZnLmNocikgY29uc29sZS5sb2coXCJ3YXJuaW5nOiBubyBjaHJvbW9zb21lXCIpO1xuXHRcblx0Ly8gRW5zdXJlIHN0YXJ0IDw9IGVuZFxuXHRpZiAodHlwZW9mKGMuc3RhcnQpID09PSBcIm51bWJlclwiICYmIHR5cGVvZihjLmVuZCkgPT09IFwibnVtYmVyXCIgJiYgYy5zdGFydCA+IGMuZW5kICkge1xuXHQgICAgLy8gc3dhcFxuXHQgICAgbGV0IHRtcCA9IGMuc3RhcnQ7IGMuc3RhcnQgPSBjLmVuZDsgYy5lbmQgPSB0bXA7XG5cdH1cblxuXHQvLyBTZXQgY2ZnLnN0YXJ0IHRvIGJlIHRoZSBzcGVjaWZpZWQgc3RhcnRcblx0Ly8gICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgc3RhcnRcblx0Ly8gICAgICAgIHdpdGggZmFsbGJhY2sgdG8gMVxuXHQvLyAgICAgICAgICAgd2l0aCBhIG1pbiB2YWx1ZSBvZiAxXG5cdGNmZy5zdGFydCA9IE1hdGgubWF4KCAxLCB0eXBlb2YoYy5zdGFydCkgPT09IFwibnVtYmVyXCIgPyBjLnN0YXJ0IDogdGhpcy5jb29yZHMgPyB0aGlzLmNvb3Jkcy5zdGFydCA6IDEgKTtcblxuXHQvLyBTZXQgY2ZnLmVuZCB0byBiZSB0aGUgc3BlY2lmaWVkIGVuZFxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBlbmRcblx0Ly8gICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIHN0YXJ0ICsgMTAgTUJcblx0Y2ZnLmVuZCA9IHR5cGVvZihjLmVuZCkgPT09IFwibnVtYmVyXCIgP1xuXHQgICAgYy5lbmRcblx0ICAgIDpcblx0ICAgIHRoaXMuY29vcmRzID9cblx0ICAgICAgICAoY2ZnLnN0YXJ0ICsgdGhpcy5jb29yZHMuZW5kIC0gdGhpcy5jb29yZHMuc3RhcnQgKyAxKVxuXHRcdDpcblx0XHRjZmcuc3RhcnQ7XG5cdC8vIGNsaXAgYXQgY2hyIGVuZFxuXHRjZmcuZW5kID0gY2ZnLmNociA/IE1hdGgubWluKGNmZy5lbmQsICAgY2ZnLmNoci5sZW5ndGgpIDogY2ZnLmVuZDtcblxuXHQvLyBTZXQgY2ZnLmhpZ2hsaWdodFxuXHQvLyAgICB3aXRoIGZhbGxiYWNrIHRvIGN1cnJlbnQgaGlnaGxpZ2h0XG5cdC8vICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIFtdXG5cdGNmZy5oaWdobGlnaHQgPSBjLmhpZ2hsaWdodCB8fCB0aGlzLnpvb21WaWV3LmhpZ2hsaWdodGVkIHx8IFtdO1xuXG5cdC8vXG5cdHJldHVybiBjZmc7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyB0aGUgY3VycmVudCBjb250ZXh0IGZyb20gdGhlIGNvbmZpZyBvYmplY3QuIFxuICAgIC8vIE9ubHkgdGhvc2UgY29udGV4dCBpdGVtcyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZyBhcmUgYWZmZWN0ZWQsIGV4Y2VwdCBhcyBub3RlZC5cbiAgICAvL1xuICAgIC8vIEFsbCBjb25maWdzIGFyZSBzYW5pdGl6ZWQgYmVmb3JlIGJlaW5nIGFwcGxpZWQgKHNlZSBzYW5pdGl6ZUNmZykuXG4gICAgLy8gXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBjIChvYmplY3QpIEEgY29uZmlndXJhdGlvbiBvYmplY3QgdGhhdCBzcGVjaWZpZXMgc29tZS9hbGwgY29uZmlnIHZhbHVlcy5cbiAgICAvLyAgICAgICAgIFRoZSBwb3NzaWJsZSBjb25maWcgaXRlbXM6XG4gICAgLy8gICAgICAgICAgICBnZW5vbWVzICAgKGxpc3QgbyBzdHJpbmdzKSBBbGwgdGhlIGdlbm9tZXMgeW91IHdhbnQgdG8gc2VlLCBpbiB0b3AtdG8tYm90dG9tIG9yZGVyLiBcbiAgICAvLyAgICAgICAgICAgICAgIE1heSB1c2UgaW50ZXJuYWwgbmFtZXMgb3IgZGlzcGxheSBsYWJlbHMsIGVnLCBcIm11c19tdXNjdWx1c18xMjlzMXN2aW1qXCIgb3IgXCIxMjlTMS9TdkltSlwiLlxuICAgIC8vICAgICAgICAgICAgcmVmICAgICAgIChzdHJpbmcpIFRoZSBnZW5vbWUgdG8gdXNlIGFzIHRoZSByZWZlcmVuY2UuIE1heSBiZSBuYW1lIG9yIGxhYmVsLlxuICAgIC8vICAgICAgICAgICAgY2hyICAgICAgIChzdHJpbmcpIENocm9tb3NvbWUgZm9yIGNvb3JkaW5hdGUgcmFuZ2VcbiAgICAvLyAgICAgICAgICAgIHN0YXJ0ICAgICAoaW50KSBDb29yZGluYXRlIHJhbmdlIHN0YXJ0IHBvc2l0aW9uXG4gICAgLy8gICAgICAgICAgICBlbmQgICAgICAgKGludCkgQ29vcmRpbmF0ZSByYW5nZSBlbmQgcG9zaXRpb25cbiAgICAvLyAgICAgICAgICAgIGhpZ2hsaWdodCAobGlzdCBvIHN0cmluZ3MpIElEcyBvZiBmZWF0dXJlcyB0byBoaWdobGlnaHRcbiAgICAvL1xuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgTm90aGluZ1xuICAgIC8vIFNpZGUgZWZmZWN0czpcbiAgICAvL1x0ICBSZWRyYXdzIFxuICAgIC8vXHQgIENhbGxzIGNvbnRleHRDaGFuZ2VkKCkgXG4gICAgLy9cbiAgICBzZXRDb250ZXh0IChjKSB7XG4gICAgICAgIGxldCBjZmcgPSB0aGlzLnNhbml0aXplQ2ZnKGMpO1xuXHQvL1xuXHR0aGlzLnZHZW5vbWVzID0gY2ZnLmdlbm9tZXM7XG5cdHRoaXMuckdlbm9tZSAgPSBjZmcucmVmO1xuXHR0aGlzLmNHZW5vbWVzID0gY2ZnLmdlbm9tZXMuZmlsdGVyKGcgPT4gZyAhPT0gY2ZnLnJlZik7XG5cdHRoaXMuY29vcmRzICAgPSB7IGNocjogY2ZnLmNoci5uYW1lLCBzdGFydDogY2ZnLnN0YXJ0LCBlbmQ6IGNmZy5lbmQgfTtcblx0Ly9cblx0dGhpcy5nZW5vbWVWaWV3LnJlZHJhdygpO1xuXHR0aGlzLmdlbm9tZVZpZXcuc2V0QnJ1c2hDb29yZHModGhpcy5jb29yZHMpO1xuXHQvL1xuXHR0aGlzLnpvb21WaWV3LmhpZ2hsaWdodGVkID0gY2ZnLmhpZ2hsaWdodDtcblx0dGhpcy56b29tVmlldy5nZW5vbWVzID0gdGhpcy52R2Vub21lcztcblx0dGhpcy56b29tVmlldy51cGRhdGUodGhpcy5jb29yZHMpXG5cdC8vXG5cdHRoaXMuY29udGV4dENoYW5nZWQoKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVzaXplICgpIHtcblx0bGV0IHcgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDI0O1xuXHR0aGlzLmdlbm9tZVZpZXcuZml0VG9XaWR0aCh3KTtcblx0dGhpcy56b29tVmlldy5maXRUb1dpZHRoKHcpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGNvbnRleHQgYXMgYSBwYXJhbWV0ZXIgc3RyaW5nXG4gICAgLy8gQ3VycmVudCBjb250ZXh0ID0gcmVmIGdlbm9tZSArIGNvbXAgZ2Vub21lcyArIGN1cnJlbnQgcmFuZ2UgKGNocixzdGFydCxlbmQpXG4gICAgZ2V0UGFyYW1TdHJpbmcgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuICAgICAgICBsZXQgcmVmID0gYHJlZj0ke2MucmVmfWA7XG4gICAgICAgIGxldCBnZW5vbWVzID0gYGdlbm9tZXM9JHtjLmdlbm9tZXMuam9pbihcIitcIil9YDtcblx0bGV0IGNvb3JkcyA9IGBjaHI9JHtjLmNocn0mc3RhcnQ9JHtjLnN0YXJ0fSZlbmQ9JHtjLmVuZH1gO1xuXHRsZXQgaGxzID0gYGhpZ2hsaWdodD0ke2MuaGlnaGxpZ2h0LmpvaW4oXCIrXCIpfWA7XG5cdHJldHVybiBgJHtyZWZ9JiR7Z2Vub21lc30mJHtjb29yZHN9JiR7aGxzfWA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGN1cnJlbnRMaXN0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Vyckxpc3Q7XG4gICAgfVxuICAgIHNldCBjdXJyZW50TGlzdCAobHN0KSB7XG4gICAgXHQvL1xuXHR0aGlzLmN1cnJMaXN0ID0gbHN0O1xuXHQvL1xuXHRsZXQgbGlzdHMgPSBkMy5zZWxlY3QoJyNteWxpc3RzJykuc2VsZWN0QWxsKCcubGlzdEluZm8nKTtcblx0bGlzdHMuY2xhc3NlZChcImN1cnJlbnRcIiwgZCA9PiBkID09PSBsc3QpO1xuXHRpZiAobHN0KSB7XG5cdCAgICAvLyBtYWtlIHRoaXMgbGlzdCB0aGUgY3VycmVudCBzZWxlY3Rpb24gaW4gdGhlIHpvb20gdmlld1xuXHQgICAgdGhpcy56b29tVmlldy5oaUZlYXRzID0gbHN0Lmlkcy5yZWR1Y2UoKGEsdikgPT4geyBhW3ZdPXY7IHJldHVybiBhOyB9LCB7fSlcblx0ICAgIHRoaXMuem9vbVZpZXcudXBkYXRlKCk7XG5cdCAgICAvLyBzaG93IHRoaXMgbGlzdCBhcyB0aWNrIG1hcmtzIGluIHRoZSBnZW5vbWUgdmlld1xuXHQgICAgdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlc0J5SWQodGhpcy5yR2Vub21lLCBsc3QuaWRzKVxuXHRcdC50aGVuKCBmZWF0cyA9PiB7XG5cdFx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3VGlja3MoZmVhdHMpO1xuXHRcdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd1RpdGxlKCk7XG5cdFx0fSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICB0aGlzLnpvb21WaWV3LmhpRmVhdHMgPSB7fTtcblx0ICAgIHRoaXMuem9vbVZpZXcudXBkYXRlKCk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdUaWNrcyhbXSk7XG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd1RpdGxlKCk7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzYW5pdGl6ZUNvb3Jkcyhjb29yZHMpIHtcblx0aWYgKHR5cGVvZihjb29yZHMpID09PSBcInN0cmluZ1wiKSBcblx0ICAgIGNvb3JkcyA9IHBhcnNlQ29vcmRzKGNvb3Jkcyk7XG5cdGxldCBjaHJvbW9zb21lID0gdGhpcy5yR2Vub21lLmNocm9tb3NvbWVzLmZpbHRlcihjID0+IGMubmFtZSA9PT0gY29vcmRzLmNocilbMF07XG5cdGlmICghIGNocm9tb3NvbWUpIHJldHVybiBudWxsO1xuXHRpZiAoY29vcmRzLnN0YXJ0ID4gY29vcmRzLmVuZCkge1xuXHQgICAgbGV0IHRtcCA9IGNvb3Jkcy5zdGFydDsgY29vcmRzLnN0YXJ0ID0gY29vcmRzLmVuZDsgY29vcmRzLmVuZCA9IHRtcDtcblx0fVxuXHRjb29yZHMuc3RhcnQgPSBNYXRoLm1heCgxLCBNYXRoLmZsb29yKGNvb3Jkcy5zdGFydCkpXG5cdGNvb3Jkcy5lbmQgICA9IE1hdGgubWluKGNocm9tb3NvbWUubGVuZ3RoLCBNYXRoLmZsb29yKGNvb3Jkcy5lbmQpKVxuICAgICAgICByZXR1cm4gY29vcmRzO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFpvb21zIGluL291dCBieSBmYWN0b3IuIE5ldyB6b29tIHdpZHRoIGlzIGZhY3RvciAqIHRoZSBjdXJyZW50IHpvb20gd2lkdGguXG4gICAgLy8gRmFjdG9yID4gMSB6b29tcyBvdXQsIDAgPCBmYWN0b3IgPCAxIHpvb21zIGluLlxuICAgIHpvb20gKGZhY3Rvcikge1xuXG5cdGxldCBsZW4gPSB0aGlzLmNvb3Jkcy5lbmQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDE7XG5cdGxldCBuZXdsZW4gPSBNYXRoLnJvdW5kKGZhY3RvciAqIGxlbik7XG5cdGxldCB4ID0gKHRoaXMuY29vcmRzLnN0YXJ0ICsgdGhpcy5jb29yZHMuZW5kKS8yO1xuXHRsZXQgbmV3c3RhcnQgPSBNYXRoLnJvdW5kKHggLSBuZXdsZW4vMik7XG5cdHRoaXMuc2V0Q29udGV4dCh7IGNocjogdGhpcy5jb29yZHMuY2hyLCBzdGFydDogbmV3c3RhcnQsIGVuZDogbmV3c3RhcnQgKyBuZXdsZW4gLSAxIH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFBhbnMgdGhlIHZpZXcgbGVmdCBvciByaWdodCBieSBmYWN0b3IuIFRoZSBkaXN0YW5jZSBtb3ZlZCBpcyBmYWN0b3IgdGltZXMgdGhlIGN1cnJlbnQgem9vbSB3aWR0aC5cbiAgICAvLyBOZWdhdGl2ZSB2YWx1ZXMgcGFuIGxlZnQuIFBvc2l0aXZlIHZhbHVlcyBwYW4gcmlnaHQuIChOb3RlIHRoYXQgcGFubmluZyBtb3ZlcyB0aGUgXCJjYW1lcmFcIi4gUGFubmluZyB0byB0aGVcbiAgICAvLyByaWdodCBtYWtlcyB0aGUgb2JqZWN0cyBpbiB0aGUgc2NlbmUgYXBwZWFyIHRvIG1vdmUgdG8gdGhlIGxlZnQsIGFuZCB2aWNlIHZlcnNhLilcbiAgICAvL1xuICAgIHBhbiAoZmFjdG9yLCBhbmltYXRlKSB7XG5cdGxldCB3aWR0aCA9IHRoaXMuY29vcmRzLmVuZCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMTtcblx0bGV0IHBhbkRpc3QgPSBmYWN0b3IgKiAodGhpcy56b29tVmlldy54c2NhbGUucmFuZ2UoKVsxXSk7XG5cdGxldCBkID0gTWF0aC5yb3VuZChmYWN0b3IgKiB3aWR0aCk7XG5cdGxldCBucztcblx0bGV0IG5lO1xuXHRpZiAoZCA8IDApIHtcblx0ICAgIG5zID0gTWF0aC5tYXgoMSwgdGhpcy5jb29yZHMuc3RhcnQrZCk7XG5cdCAgICBuZSA9IG5zICsgd2lkdGggLSAxO1xuXHR9XG5cdGVsc2UgaWYgKGQgPiAwKSB7XG5cdCAgICBsZXQgY2hyb21vc29tZSA9IHRoaXMuckdlbm9tZS5jaHJvbW9zb21lcy5maWx0ZXIoYyA9PiBjLm5hbWUgPT09IHRoaXMuY29vcmRzLmNocilbMF07XG5cdCAgICBuZSA9IE1hdGgubWluKGNocm9tb3NvbWUubGVuZ3RoLCB0aGlzLmNvb3Jkcy5lbmQrZClcblx0ICAgIG5zID0gbmUgLSB3aWR0aCArIDE7XG5cdH1cblx0Ly8gdGhpcyBwcm9iYWJseSBkb2Vzbid0IGJlbG9uZyBoZXJlIGJ1dCBmb3Igbm93Li4uXG5cdC8vIFRvIGdldCBhIHNtb290aCBwYW5uaW5nIGVmZmVjdDogaW5pdGlhbGl6ZSB0aGUgdHJhbnNsYXRpb24gdG8gdGhlIHNhbWUgYXNcblx0Ly8gdGhlIHBhbiBkaXN0YW5jZSwgYnV0IGluIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24uLi5cblx0Ly90aGlzLnpvb21WaWV3LnN2Z1xuXHQgICAgLy8uc3R5bGUoXCJ0cmFuc2l0aW9uXCIsIFwidHJhbnNmb3JtIDBzXCIpXG5cdCAgICAvLy5zdHlsZShcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7LXBhbkRpc3R9cHgsMHB4KWApO1xuXHQvLyAuLi50aGVuIHRoZSB6b29tIGRyYXcgd2lsbCB0cmFuc2l0aW9uIHRoZSB2ZWN0b3IgYmFjayB0byAoMCwwKVxuXHR0aGlzLnNldENvbnRleHQoeyBjaHI6IHRoaXMuY29vcmRzLmNociwgc3RhcnQ6IG5zLCBlbmQ6IG5lIH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXRGZWF0VHlwZUNvbnRyb2wgKGZhY2V0KSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0bGV0IGNvbG9ycyA9IHRoaXMuY3NjYWxlLmRvbWFpbigpLm1hcChsYmwgPT4ge1xuXHQgICAgcmV0dXJuIHsgbGJsOmxibCwgY2xyOnRoaXMuY3NjYWxlKGxibCkgfTtcblx0fSk7XG5cdGxldCBja2VzID0gZDMuc2VsZWN0KFwiLmNvbG9yS2V5XCIpXG5cdCAgICAuc2VsZWN0QWxsKCcuY29sb3JLZXlFbnRyeScpXG5cdFx0LmRhdGEoY29sb3JzKTtcblx0bGV0IG5jcyA9IGNrZXMuZW50ZXIoKS5hcHBlbmQoXCJkaXZcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjb2xvcktleUVudHJ5IGZsZXhyb3dcIik7XG5cdG5jcy5hcHBlbmQoXCJkaXZcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcInN3YXRjaFwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGMgPT4gYy5sYmwpXG5cdCAgICAuc3R5bGUoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGMgPT4gYy5jbHIpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IHQgPSBkMy5zZWxlY3QodGhpcyk7XG5cdCAgICAgICAgdC5jbGFzc2VkKFwiY2hlY2tlZFwiLCAhIHQuY2xhc3NlZChcImNoZWNrZWRcIikpO1xuXHRcdGxldCBzd2F0Y2hlcyA9IGQzLnNlbGVjdEFsbChcIi5zd2F0Y2guY2hlY2tlZFwiKVswXTtcblx0XHRsZXQgZnRzID0gc3dhdGNoZXMubWFwKHM9PnMuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSlcblx0XHRmYWNldC5zZXRWYWx1ZXMoZnRzKTtcblx0XHRzZWxmLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHQgICAgfSlcblx0ICAgIC5hcHBlbmQoXCJpXCIpXG5cdCAgICAgICAgLmF0dHIoXCJjbGFzc1wiLFwibWF0ZXJpYWwtaWNvbnNcIik7XG5cdG5jcy5hcHBlbmQoXCJzcGFuXCIpXG5cdCAgICAudGV4dChjID0+IGMubGJsKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsaW5rVG9NZ2lTbnBSZXBvcnQgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRsZXQgdXJsQmFzZSA9ICdodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvc25wL3N1bW1hcnknO1xuXHRsZXQgdGFiQXJnID0gJ3NlbGVjdGVkVGFiPTEnO1xuXHRsZXQgc2VhcmNoQnlBcmcgPSAnc2VhcmNoQnlTYW1lRGlmZj0nO1xuXHRsZXQgY2hyQXJnID0gYHNlbGVjdGVkQ2hyb21vc29tZT0ke2MuY2hyfWA7XG5cdGxldCBjb29yZEFyZyA9IGBjb29yZGluYXRlPSR7Yy5zdGFydH0tJHtjLmVuZH1gO1xuXHRsZXQgdW5pdEFyZyA9ICdjb29yZGluYXRlVW5pdD1icCc7XG5cdGxldCBjc0FyZ3MgPSBjLmdlbm9tZXMubWFwKGcgPT4gYHNlbGVjdGVkU3RyYWlucz0ke2d9YClcblx0bGV0IHJzQXJnID0gYHJlZmVyZW5jZVN0cmFpbj0ke2MucmVmfWA7XG5cdGxldCBsaW5rVXJsID0gYCR7dXJsQmFzZX0/JHt0YWJBcmd9JiR7c2VhcmNoQnlBcmd9JiR7Y2hyQXJnfSYke2Nvb3JkQXJnfSYke3VuaXRBcmd9JiR7cnNBcmd9JiR7Y3NBcmdzLmpvaW4oJyYnKX1gXG5cdHdpbmRvdy5vcGVuKGxpbmtVcmwsIFwiX2JsYW5rXCIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsaW5rVG9NZ2lRVExzICgpIHtcblx0bGV0IGMgICAgICAgID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdGxldCB1cmxCYXNlICA9ICdodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvYWxsZWxlL3N1bW1hcnknO1xuXHRsZXQgY2hyQXJnICAgPSBgY2hyb21vc29tZT0ke2MuY2hyfWA7XG5cdGxldCBjb29yZEFyZyA9IGBjb29yZGluYXRlPSR7Yy5zdGFydH0tJHtjLmVuZH1gO1xuXHRsZXQgdW5pdEFyZyAgPSAnY29vcmRVbml0PWJwJztcblx0bGV0IHR5cGVBcmcgID0gJ2FsbGVsZVR5cGU9UVRMJztcblx0bGV0IGxpbmtVcmwgID0gYCR7dXJsQmFzZX0/JHtjaHJBcmd9JiR7Y29vcmRBcmd9JiR7dW5pdEFyZ30mJHt0eXBlQXJnfWA7XG5cdHdpbmRvdy5vcGVuKGxpbmtVcmwsIFwiX2JsYW5rXCIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsaW5rVG9NZ2lKQnJvd3NlICgpIHtcblx0bGV0IGMgPSB0aGlzLmdldENvbnRleHQoKTtcblx0bGV0IHVybEJhc2UgPSAnaHR0cDovL2picm93c2UuaW5mb3JtYXRpY3MuamF4Lm9yZy8nO1xuXHRsZXQgZGF0YUFyZyA9ICdkYXRhPWRhdGElMkZtb3VzZSc7IC8vIFwiZGF0YS9tb3VzZVwiXG5cdGxldCBsb2NBcmcgID0gYGxvYz1jaHIke2MuY2hyfSUzQSR7Yy5zdGFydH0uLiR7Yy5lbmR9YDtcblx0bGV0IHRyYWNrcyAgPSBbJ0ROQScsJ01HSV9HZW5vbWVfRmVhdHVyZXMnLCdOQ0JJX0NDRFMnLCdOQ0JJJywnRU5TRU1CTCddO1xuXHRsZXQgdHJhY2tzQXJnPWB0cmFja3M9JHt0cmFja3Muam9pbignLCcpfWA7XG5cdGxldCBoaWdobGlnaHRBcmcgPSAnaGlnaGxpZ2h0PSc7XG5cdGxldCBsaW5rVXJsID0gYCR7dXJsQmFzZX0/JHsgW2RhdGFBcmcsbG9jQXJnLHRyYWNrc0FyZyxoaWdobGlnaHRBcmddLmpvaW4oJyYnKSB9YDtcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgTUdWQXBwXG5cbmV4cG9ydCB7IE1HVkFwcCB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTUdWQXBwLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIEdlbm9tZSB7XG4gIGNvbnN0cnVjdG9yIChjZmcpIHtcbiAgICB0aGlzLm5hbWUgPSBjZmcubmFtZTtcbiAgICB0aGlzLmxhYmVsPSBjZmcubGFiZWw7XG4gICAgdGhpcy5jaHJvbW9zb21lcyA9IFtdO1xuICAgIHRoaXMubWF4bGVuID0gLTE7XG4gICAgdGhpcy54c2NhbGUgPSBudWxsO1xuICAgIHRoaXMueXNjYWxlID0gbnVsbDtcbiAgICB0aGlzLnpvb21ZICA9IC0xO1xuICB9XG4gIGdldENocm9tb3NvbWUgKG4pIHtcbiAgICAgIGlmICh0eXBlb2YobikgPT09ICdzdHJpbmcnKVxuXHQgIHJldHVybiB0aGlzLmNocm9tb3NvbWVzLmZpbHRlcihjID0+IGMubmFtZSA9PT0gbilbMF07XG4gICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2hyb21vc29tZXNbbl07XG4gIH1cbiAgaGFzQ2hyb21vc29tZSAobikge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2hyb21vc29tZShuKSA/IHRydWUgOiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgeyBHZW5vbWUgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0dlbm9tZS5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge2QzanNvbiwgb3ZlcmxhcHMsIHN1YnRyYWN0fSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7RmVhdHVyZX0gZnJvbSAnLi9GZWF0dXJlJztcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBIb3cgdGhlIGFwcCBsb2FkcyBmZWF0dXJlIGRhdGEuIFByb3ZpZGVzIHR3byBjYWxsczpcbi8vICAgLSBnZXQgZmVhdHVyZXMgaW4gcmFuZ2Vcbi8vICAgLSBnZXQgZmVhdHVyZXMgYnkgaWRcbi8vIFJlcXVlc3RzIGZlYXR1cmVzIGZyb20gdGhlIHNlcnZlciBhbmQgcmVnaXN0ZXJzIHRoZW0gaW4gYSBjYWNoZS5cbi8vIEludGVyYWN0cyB3aXRoIHRoZSBiYWNrIGVuZCB0byBsb2FkIGZlYXR1cmVzOyB0cmllcyBub3QgdG8gcmVxdWVzdFxuLy8gdGhlIHNhbWUgcmVnaW9uIHR3aWNlLlxuLy9cbmNsYXNzIEZlYXR1cmVNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLmZlYXRDYWNoZSA9IHt9OyAgICAgLy8gaW5kZXggZnJvbSBtZ3BpZCAtPiBmZWF0dXJlXG5cdHRoaXMubWdpQ2FjaGUgPSB7fTtcdCAvLyBpbmRleCBmcm9tIG1naWlkIC0+IFsgZmVhdHVyZXMgXVxuXHR0aGlzLmNhY2hlID0ge307ICAgICAgICAgLy8ge2dlbm9tZS5uYW1lIC0+IHtjaHIubmFtZSAtPiBsaXN0IG9mIGJsb2Nrc319XG5cblx0dGhpcy5taW5lRmVhdHVyZUNhY2hlID0ge307IC8vIGF1eGlsaWFyeSBpbmZvIHB1bGxlZCBmcm9tIE1vdXNlTWluZSBcbiAgICB9XG4gXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUHJvY2Vzc2VzIHRoZSBcInJhd1wiIGZlYXR1cmVzIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgLy8gVHVybnMgdGhlbSBpbnRvIEZlYXR1cmUgb2JqZWN0cyBhbmQgcmVnaXN0ZXJzIHRoZW0uXG4gICAgLy8gSWYgdGhlIHNhbWUgcmF3IGZlYXR1cmUgaXMgcmVnaXN0ZXJlZCBhZ2FpbixcbiAgICAvLyB0aGUgRmVhdHVyZSBvYmplY3QgY3JlYXRlZCB0aGUgZmlyc3QgdGltZSBpcyByZXR1cm5lZC5cbiAgICAvLyAoSS5lLiwgcmVnaXN0ZXJpbmcgdGhlIHNhbWUgZmVhdHVyZSBtdWx0aXBsZSB0aW1lcyBpcyBvaylcbiAgICAvL1xuICAgIHByb2Nlc3NGZWF0dXJlcyAoZmVhdHMsIGdlbm9tZSkge1xuXHRyZXR1cm4gZmVhdHMubWFwKGQgPT4ge1xuXHQgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgdGhpcyBvbmUgaW4gdGhlIGNhY2hlLCByZXR1cm4gaXQuXG5cdCAgICBsZXQgZiA9IHRoaXMuZmVhdENhY2hlW2QubWdwaWRdO1xuXHQgICAgaWYgKGYpIHJldHVybiBmO1xuXHQgICAgLy8gQ3JlYXRlIGEgbmV3IEZlYXR1cmVcblx0ICAgIGQuZ2Vub21lID0gZ2Vub21lXG5cdCAgICBmID0gbmV3IEZlYXR1cmUoZCk7XG5cdCAgICAvLyBSZWdpc3RlciBpdC5cblx0ICAgIHRoaXMuZmVhdENhY2hlW2YubWdwaWRdID0gZjtcblx0ICAgIGlmIChmLm1naWlkKSB7XG5cdFx0bGV0IGxzdCA9IHRoaXMubWdpQ2FjaGVbZi5tZ2lpZF0gPSAodGhpcy5tZ2lDYWNoZVtmLm1naWlkXSB8fCBbXSk7XG5cdFx0bHN0LnB1c2goZik7XG5cdCAgICB9XG5cdCAgICAvLyBoZXJlIHknZ28uXG5cdCAgICByZXR1cm4gZjtcblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmVnaXN0ZXJzIGFuIGluZGV4IGJsb2NrIGZvciB0aGUgZ2l2ZW4gZ2Vub21lLiBBbiBpbmRleCBibG9ja1xuICAgIC8vIGlzIGEgY29udGlndW91cyBjaHVuayBvZiBmZWF0dWVzIGZyb20gdGhlIEdGRiBmaWxlIGZvciB0aGF0IGdlbm9tZS5cbiAgICAvLyBSZWdpc3RlcmluZyB0aGUgc2FtZSBibG9jayBtdWx0aXBsZSB0aW1lcyBpcyBvayAtIHN1Y2Nlc3NpdmUgdGltZXNcbiAgICAvLyBoYXZlIG5vIGVmZmVjdC5cbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICBBZGRzIHRoZSBibG9jayB0byB0aGUgY2FjaGVcbiAgICAvLyAgIFJlcGxhY2VzIGVhY2ggcmF3IGZlYXR1cmUgaW4gdGhlIGJsb2NrIHdpdGggYSBGZWF0dXJlIG9iamVjdC5cbiAgICAvLyAgIFJlZ2lzdGVycyBuZXcgRmVhdHVyZXMgaW4gYSBsb29rdXAuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgIGdlbm9tZSAob2JqZWN0KSBUaGUgZ2Vub21lIHRoZSBibG9jayBpcyBmb3IsXG4gICAgLy8gICBibGsgKG9iamVjdCkgQW4gaW5kZXggYmxvY2ssIHdoaWNoIGhhcyBhIGNociwgc3RhcnQsIGVuZCxcbiAgICAvLyAgIFx0YW5kIGEgbGlzdCBvZiBcInJhd1wiIGZlYXR1cmUgb2JqZWN0cy5cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgbm90aGluZ1xuICAgIC8vXG4gICAgX3JlZ2lzdGVyQmxvY2sgKGdlbm9tZSwgYmxrKSB7XG4gICAgICAgIGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdID0gKHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdIHx8IHt9KTtcblx0bGV0IGNjID0gZ2NbYmxrLmNocl0gPSAoZ2NbYmxrLmNocl0gfHwgW10pO1xuXHRpZiAoY2MuZmlsdGVyKGIgPT4gYi5pZCA9PT0gYmxrLmlkKS5sZW5ndGggPT09IDApIHtcblx0ICAgIGJsay5mZWF0dXJlcyA9IHRoaXMucHJvY2Vzc0ZlYXR1cmVzKCBibGsuZmVhdHVyZXMsIGdlbm9tZSApO1xuXHQgICAgYmxrLmdlbm9tZSA9IGdlbm9tZTtcblx0ICAgIGNjLnB1c2goYmxrKTtcblx0ICAgIGNjLnNvcnQoIChhLGIpID0+IGEuc3RhcnQgLSBiLnN0YXJ0ICk7XG5cdH1cblx0Ly9lbHNlXG5cdCAgICAvL2NvbnNvbGUubG9nKFwiU2tpcHBlZCBibG9jay4gQWxyZWFkeSBzZWVuLlwiLCBnZW5vbWUubmFtZSwgYmxrLmlkKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSByZW1haW5kZXIgb2YgdGhlIGdpdmVuIHJhbmdlIGFmdGVyXG4gICAgLy8gc3VidHJhY3RpbmcgdGhlIGFscmVhZHktZW5zdXJlZCByYW5nZXMuXG4gICAgLy8gXG4gICAgX3N1YnRyYWN0UmFuZ2UoZ2Vub21lLCByYW5nZSl7XG5cdGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdO1xuXHRpZiAoIWdjKSB0aHJvdyBcIk5vIHN1Y2ggZ2Vub21lOiBcIiArIGdlbm9tZS5uYW1lO1xuXHRsZXQgZ0Jsa3MgPSBnY1tyYW5nZS5jaHJdIHx8IFtdO1xuXHRsZXQgYW5zID0gW107XG5cdGxldCBybmcgPSByYW5nZTtcblx0Z0Jsa3MuZm9yRWFjaCggYiA9PiB7XG5cdCAgICBsZXQgc3ViID0gcm5nID8gc3VidHJhY3QoIHJuZywgYiApIDogW107XG5cdCAgICBpZiAoc3ViLmxlbmd0aCA9PT0gMClcblx0ICAgICAgICBybmcgPSBudWxsO1xuXHQgICAgaWYgKHN1Yi5sZW5ndGggPT09IDEpXG5cdCAgICAgICAgcm5nID0gc3ViWzBdO1xuXHQgICAgZWxzZSBpZiAoc3ViLmxlbmd0aCA9PT0gMil7XG5cdCAgICAgICAgYW5zLnB1c2goc3ViWzBdKTtcblx0XHRybmcgPSBzdWJbMV07XG5cdCAgICB9XG5cdH0pXG5cdHJuZyAmJiBhbnMucHVzaChybmcpO1xuXHRhbnMuc29ydCggKGEsYikgPT4gYS5zdGFydCAtIGIuc3RhcnQgKTtcblx0cmV0dXJuIGFucztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ2FsbHMgc3VidHJhY3RSYW5nZSBmb3IgZWFjaCByYW5nZSBpbiB0aGUgbGlzdCBhbmQgcmV0dXJuc1xuICAgIC8vIHRoZSBhY2N1bXVsYXRlZCByZXN1bHRzLlxuICAgIC8vXG4gICAgX3N1YnRyYWN0UmFuZ2VzKGdlbm9tZSwgcmFuZ2VzKSB7XG5cdGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdO1xuXHRpZiAoIWdjKSByZXR1cm4gcmFuZ2VzO1xuXHRsZXQgbmV3cmFuZ2VzID0gW107XG5cdHJhbmdlcy5mb3JFYWNoKHIgPT4ge1xuXHQgICAgbmV3cmFuZ2VzID0gbmV3cmFuZ2VzLmNvbmNhdCh0aGlzLl9zdWJ0cmFjdFJhbmdlKGdlbm9tZSwgcikpO1xuXHR9LCB0aGlzKVxuXHRyZXR1cm4gbmV3cmFuZ2VzO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEVuc3VyZXMgdGhhdCBhbGwgZmVhdHVyZXMgaW4gdGhlIHNwZWNpZmllZCByYW5nZShzKSBpbiB0aGUgc3BlY2lmaWVkIGdlbm9tZVxuICAgIC8vIGFyZSBpbiB0aGUgY2FjaGUuIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdHJ1ZSB3aGVuIHRoZSBjb25kaXRpb24gaXMgbWV0LlxuICAgIF9lbnN1cmVGZWF0dXJlc0J5UmFuZ2UgKGdlbm9tZSwgcmFuZ2VzKSB7XG5cdGxldCBuZXdyYW5nZXMgPSB0aGlzLl9zdWJ0cmFjdFJhbmdlcyhnZW5vbWUsIHJhbmdlcyk7XG5cdGlmIChuZXdyYW5nZXMubGVuZ3RoID09PSAwKSBcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0bGV0IGNvb3Jkc0FyZyA9IG5ld3Jhbmdlcy5tYXAociA9PiBgJHtyLmNocn06JHtyLnN0YXJ0fS4uJHtyLmVuZH1gKS5qb2luKCcsJyk7XG5cdGxldCBkYXRhU3RyaW5nID0gYGdlbm9tZT0ke2dlbm9tZS5uYW1lfSZjb29yZHM9JHtjb29yZHNBcmd9YDtcblx0bGV0IHVybCA9IFwiLi9iaW4vZ2V0RmVhdHVyZXMuY2dpP1wiICsgZGF0YVN0cmluZztcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHQvL2NvbnNvbGUubG9nKFwiUmVxdWVzdGluZzpcIiwgZ2Vub21lLm5hbWUsIG5ld3Jhbmdlcyk7XG5cdHJldHVybiBkM2pzb24odXJsKS50aGVuKGZ1bmN0aW9uKGJsb2Nrcyl7XG5cdCAgICBibG9ja3MuZm9yRWFjaCggYiA9PiBzZWxmLl9yZWdpc3RlckJsb2NrKGdlbm9tZSwgYikgKTtcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRW5zdXJlcyB0aGF0IGFsbCBmZWF0dXJlcyB3aXRoIHRoZSBnaXZlbiBJRHMgaW4gdGhlIHNwZWNpZmllZCBnZW5vbWVcbiAgICAvLyBhcmUgaW4gdGhlIGNhY2hlLiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRydWUgd2hlbiB0aGUgY29uZGl0aW9uIGlzIG1ldC5cbiAgICBfZW5zdXJlRmVhdHVyZXNCeUlkIChnZW5vbWUsIGlkcykge1xuXHQvLyBzdWJ0cmFjdCBpZHMgb2YgZmVhdHVyZXMgYWxyZWFkeSBpbiB0aGUgY2FjaGVcblx0bGV0IG5lZWRpZHMgPSBpZHMuZmlsdGVyKGkgPT4ge1xuXHQgICAgaWYgKGkgaW4gdGhpcy5mZWF0Q2FjaGUpIHtcblx0ICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9XG5cdCAgICBlbHNlIGlmIChpIGluIHRoaXMubWdpQ2FjaGUpIHtcblx0XHRsZXQgZnMgPSB0aGlzLm1naUNhY2hlW2ldLmZpbHRlcihmID0+IGYuZ2Vub21lID09PSBnZW5vbWUpO1xuXHRcdHJldHVybiBmcy5sZW5ndGggPT09IDA7XG5cdCAgICB9XG5cdCAgICBlbHNlXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0pO1xuXHRsZXQgZGF0YVN0cmluZyA9IGBnZW5vbWU9JHtnZW5vbWUubmFtZX0maWRzPSR7bmVlZGlkcy5qb2luKFwiK1wiKX1gO1xuXHRsZXQgdXJsID0gXCIuL2Jpbi9nZXRGZWF0dXJlcy5jZ2k/XCIgKyBkYXRhU3RyaW5nO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdC8vY29uc29sZS5sb2coXCJSZXF1ZXN0aW5nIElEczpcIiwgZ2Vub21lLm5hbWUsIG5lZWRpZHMpO1xuXHRyZXR1cm4gZDNqc29uKHVybCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0ICAgIGRhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHQgICAgICAgIGxldCBpZCA9IGl0ZW1bMF07XG5cdFx0bGV0IGZlYXRzID0gaXRlbVsxXTtcblx0XHR0aGlzLnByb2Nlc3NGZWF0dXJlcyhmZWF0cywgZ2Vub21lKTtcblx0ICAgIH0pO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgX2dldENhY2hlZEZlYXR1cmVzIChnZW5vbWUsIHJhbmdlKSB7XG4gICAgICAgIGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdIDtcblx0aWYgKCFnYykgcmV0dXJuIFtdO1xuXHRsZXQgY0Jsb2NrcyA9IGdjW3JhbmdlLmNocl07XG5cdGlmICghY0Jsb2NrcykgcmV0dXJuIFtdO1xuXHRsZXQgZmVhdHMgPSBjQmxvY2tzXG5cdCAgICAuZmlsdGVyKGNiID0+IG92ZXJsYXBzKGNiLCByYW5nZSkpXG5cdCAgICAubWFwKCBjYiA9PiBjYi5mZWF0dXJlcy5maWx0ZXIoIGYgPT4gb3ZlcmxhcHMoIGYsIHJhbmdlKSApIClcblx0ICAgIC5yZWR1Y2UoIChhY2MsIHZhbCkgPT4gYWNjLmNvbmNhdCh2YWwpLCBbXSk7XG4gICAgICAgIHJldHVybiBmZWF0cztcdFxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldENhY2hlZEZlYXR1cmVzQnlNZ2lJZCAobWdpaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdpQ2FjaGVbbWdpaWRdIHx8IFtdO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFRoaXMgaXMgd2hhdCB0aGUgdXNlciBjYWxscy4gUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBmZWF0dXJlcyBpbiBcbiAgICAvLyB0aGUgc3BlY2lmaWVkIHJhbmdlcyBvZiB0aGUgc3BlY2lmaWVkIGdlbm9tZS5cbiAgICBnZXRGZWF0dXJlcyAoZ2Vub21lLCByYW5nZXMpIHtcblx0cmV0dXJuIHRoaXMuX2Vuc3VyZUZlYXR1cmVzQnlSYW5nZShnZW5vbWUsIHJhbmdlcykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJhbmdlcy5mb3JFYWNoKCByID0+IHtcblx0ICAgICAgICByLmZlYXR1cmVzID0gdGhpcy5fZ2V0Q2FjaGVkRmVhdHVyZXMoZ2Vub21lLCByKSBcblx0XHRyLmdlbm9tZSA9IGdlbm9tZTtcblx0ICAgIH0pO1xuXHQgICAgcmV0dXJuIHsgZ2Vub21lLCBibG9ja3M6cmFuZ2VzIH07XG5cdH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgZmVhdHVyZXMgaGF2aW5nIHRoZSBzcGVjaWZpZWQgaWRzIGZyb20gdGhlIHNwZWNpZmllZCBnZW5vbWUuXG4gICAgLy8gRnVsZmlsbG1lbnQgZGF0YSA9IFxuICAgIGdldEZlYXR1cmVzQnlJZCAoZ2Vub21lLCBpZHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Vuc3VyZUZlYXR1cmVzQnlJZChnZW5vbWUsIGlkcykudGhlbiggKCkgPT4ge1xuXHQgICAgbGV0IGZlYXRzID0gW107XG5cdCAgICBsZXQgc2VlbiA9IG5ldyBTZXQoKTtcblx0ICAgIGxldCBhZGRmID0gKGYpID0+IHtcblx0XHRpZiAoZi5nZW5vbWUgIT09IGdlbm9tZSkgcmV0dXJuO1xuXHRcdGlmIChzZWVuLmhhcyhmLmlkKSkgcmV0dXJuO1xuXHRcdHNlZW4uYWRkKGYuaWQpO1xuXHRcdGZlYXRzLnB1c2goZik7XG5cdCAgICB9O1xuXHQgICAgbGV0IGFkZCA9IChmKSA9PiB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZikpIFxuXHRcdCAgICBmLmZvckVhY2goZmYgPT4gYWRkZihmZikpO1xuXHRcdGVsc2Vcblx0XHQgICAgYWRkZihmKTtcblx0ICAgIH07XG5cdCAgICBmb3IgKGxldCBpIG9mIGlkcyl7XG5cdFx0bGV0IGYgPSB0aGlzLm1naUNhY2hlW2ldIHx8IHRoaXMuZmVhdENhY2hlW2ldO1xuXHRcdGYgJiYgYWRkKGYpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZlYXRzO1xuXHR9KTtcbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIEZlYXR1cmUgTWFuYWdlclxuXG5leHBvcnQgeyBGZWF0dXJlTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgaW5pdE9wdExpc3QgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IEF1eERhdGFNYW5hZ2VyIH0gZnJvbSAnLi9BdXhEYXRhTWFuYWdlcic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgUXVlcnlNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQsIGNmZykge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMuY2ZnID0gY2ZnO1xuXHR0aGlzLmF1eERhdGFNYW5hZ2VyID0gbmV3IEF1eERhdGFNYW5hZ2VyKCk7XG5cdHRoaXMuc2VsZWN0ID0gbnVsbDtcdC8vIG15IDxzZWxlY3Q+IGVsZW1lbnRcblx0dGhpcy50ZXJtID0gbnVsbDtcdC8vIG15IDxpbnB1dD4gZWxlbWVudFxuXHR0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdHRoaXMuc2VsZWN0ID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzZWFyY2h0eXBlXCJdJyk7XG5cdHRoaXMudGVybSAgID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzZWFyY2h0ZXJtXCJdJyk7XG5cdC8vXG5cdHRoaXMudGVybS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgdGhpcy5jZmdbMF0ucGxhY2Vob2xkZXIpXG5cdGluaXRPcHRMaXN0KHRoaXMuc2VsZWN0WzBdWzBdLCB0aGlzLmNmZywgYz0+Yy5tZXRob2QsIGM9PmMubGFiZWwpO1xuXHQvLyBXaGVuIHVzZXIgY2hhbmdlcyB0aGUgcXVlcnkgdHlwZSAoc2VsZWN0b3IpLCBjaGFuZ2UgdGhlIHBsYWNlaG9sZGVyIHRleHQuXG5cdHRoaXMuc2VsZWN0Lm9uKFwiY2hhbmdlXCIsICgpID0+IHtcblx0ICAgIGxldCBvcHQgPSB0aGlzLnNlbGVjdC5wcm9wZXJ0eShcInNlbGVjdGVkT3B0aW9uc1wiKVswXTtcblx0ICAgIHRoaXMudGVybS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgb3B0Ll9fZGF0YV9fLnBsYWNlaG9sZGVyKVxuXHQgICAgXG5cdH0pO1xuXHQvLyBXaGVuIHVzZXIgZW50ZXJzIGEgc2VhcmNoIHRlcm0sIHJ1biBhIHF1ZXJ5XG5cdHRoaXMudGVybS5vbihcImNoYW5nZVwiLCAoKSA9PiB7XG5cdCAgICBsZXQgdGVybSA9IHRoaXMudGVybS5wcm9wZXJ0eShcInZhbHVlXCIpO1xuXHQgICAgdGhpcy50ZXJtLnByb3BlcnR5KFwidmFsdWVcIixcIlwiKTtcblx0ICAgIGxldCBzZWFyY2hUeXBlICA9IHRoaXMuc2VsZWN0LnByb3BlcnR5KFwidmFsdWVcIik7XG5cdCAgICBsZXQgbHN0TmFtZSA9IHRlcm07XG5cdCAgICBkMy5zZWxlY3QoXCIjbXlsaXN0c1wiKS5jbGFzc2VkKFwiYnVzeVwiLHRydWUpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHQgICAgdGhpcy5hdXhEYXRhTWFuYWdlcltzZWFyY2hUeXBlXSh0ZXJtKVx0Ly8gPC0gcnVuIHRoZSBxdWVyeVxuXHQgICAgICAudGhlbihmZWF0cyA9PiB7XG5cdFx0ICAvLyBGSVhNRSAtIHJlYWNob3ZlciAtIHRoaXMgd2hvbGUgaGFuZGxlclxuXHRcdCAgbGV0IGxzdCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLmNyZWF0ZUxpc3QobHN0TmFtZSwgZmVhdHMubWFwKGYgPT4gZi5wcmltYXJ5SWRlbnRpZmllcikpXG5cdFx0ICB0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGUobHN0KTtcblx0XHQgIC8vXG5cdFx0ICB0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzID0ge307XG5cdFx0ICBmZWF0cy5mb3JFYWNoKGYgPT4gdGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0c1tmLm1naWlkXSA9IGYubWdpaWQpO1xuXHRcdCAgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdFx0ICAvL1xuXHRcdCAgdGhpcy5hcHAuY3VycmVudExpc3QgPSBsc3Q7XG5cdFx0ICAvL1xuXHRcdCAgZDMuc2VsZWN0KFwiI215bGlzdHNcIikuY2xhc3NlZChcImJ1c3lcIixmYWxzZSk7XG5cdCAgICAgIH0pO1xuXHR9KVxuICAgIH1cbn1cblxuZXhwb3J0IHsgUXVlcnlNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9RdWVyeU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGQzanNvbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEF1eERhdGFNYW5hZ2VyIC0ga25vd3MgaG93IHRvIHF1ZXJ5IGFuIGV4dGVybmFsIHNvdXJjZSAoaS5lLiwgTW91c2VNaW5lKSBmb3IgZ2VuZXNcbi8vIGFubm90YXRlZCB0byBkaWZmZXJlbnQgb250b2xvZ2llcy4gXG5jbGFzcyBBdXhEYXRhTWFuYWdlciB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0QXV4RGF0YSAocSkge1xuXHRsZXQgZm9ybWF0ID0gJ2pzb25vYmplY3RzJztcblx0bGV0IHF1ZXJ5ID0gZW5jb2RlVVJJQ29tcG9uZW50KHEpO1xuXHRsZXQgdXJsID0gYGh0dHA6Ly93d3cubW91c2VtaW5lLm9yZy9tb3VzZW1pbmUvc2VydmljZS9xdWVyeS9yZXN1bHRzP2Zvcm1hdD0ke2Zvcm1hdH0mcXVlcnk9JHtxdWVyeX1gO1xuXHRyZXR1cm4gZDNqc29uKHVybCkudGhlbihkYXRhID0+IGRhdGEucmVzdWx0c3x8W10pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGRvIGEgTE9PS1VQIHF1ZXJ5IGZvciBTZXF1ZW5jZUZlYXR1cmVzIGZyb20gTW91c2VNaW5lXG4gICAgZmVhdHVyZXNCeUxvb2t1cCAocXJ5U3RyaW5nKSB7XG5cdGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIlNlcXVlbmNlRmVhdHVyZS5wcmltYXJ5SWRlbnRpZmllciBTZXF1ZW5jZUZlYXR1cmUuc3ltYm9sXCIgbG9uZ0Rlc2NyaXB0aW9uPVwiXCIgY29uc3RyYWludExvZ2ljPVwiQSBhbmQgQiBhbmQgQ1wiPlxuXHQgICAgPGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlXCIgb3A9XCJMT09LVVBcIiB2YWx1ZT1cIiR7cXJ5U3RyaW5nfVwiLz5cblx0ICAgIDxjb25zdHJhaW50IGNvZGU9XCJCXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vcmdhbmlzbS50YXhvbklkXCIgb3A9XCI9XCIgdmFsdWU9XCIxMDA5MFwiLz5cblx0ICAgIDxjb25zdHJhaW50IGNvZGU9XCJDXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5zZXF1ZW5jZU9udG9sb2d5VGVybS5uYW1lXCIgb3A9XCIhPVwiIHZhbHVlPVwidHJhbnNnZW5lXCIvPlxuXHQgICAgPC9xdWVyeT5gO1xuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmZWF0dXJlc0J5T250b2xvZ3lUZXJtIChxcnlTdHJpbmcsIHRlcm1UeXBlKSB7XG4gICAgICAgIGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgdmlldz1cIlNlcXVlbmNlRmVhdHVyZS5wcmltYXJ5SWRlbnRpZmllciBTZXF1ZW5jZUZlYXR1cmUuc3ltYm9sXCIgbG9uZ0Rlc2NyaXB0aW9uPVwiXCIgc29ydE9yZGVyPVwiU2VxdWVuY2VGZWF0dXJlLnN5bWJvbCBhc2NcIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCIGFuZCBDXCI+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm1cIiB0eXBlPVwiJHt0ZXJtVHlwZX1cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm0ucGFyZW50c1wiIHR5cGU9XCIke3Rlcm1UeXBlfVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9udG9sb2d5QW5ub3RhdGlvbnMub250b2xvZ3lUZXJtLnBhcmVudHNcIiBvcD1cIkxPT0tVUFwiIHZhbHVlPVwiJHtxcnlTdHJpbmd9XCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiQlwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub3JnYW5pc20udGF4b25JZFwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJDXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5zZXF1ZW5jZU9udG9sb2d5VGVybS5uYW1lXCIgb3A9XCIhPVwiIHZhbHVlPVwidHJhbnNnZW5lXCIvPlxuXHQgIDwvcXVlcnk+YFxuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAobm90IGN1cnJlbnRseSBpbiB1c2UuLi4pXG4gICAgZmVhdHVyZXNCeVBhdGh3YXlUZXJtIChxcnlTdHJpbmcpIHtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICB2aWV3PVwiUGF0aHdheS5nZW5lcy5wcmltYXJ5SWRlbnRpZmllciBQYXRod2F5LmdlbmVzLnN5bWJvbFwiIGxvbmdEZXNjcmlwdGlvbj1cIlwiIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEJcIj5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlBhdGh3YXlcIiBjb2RlPVwiQVwiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJQYXRod2F5LmdlbmVzLm9yZ2FuaXNtLnRheG9uSWRcIiBjb2RlPVwiQlwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdCAgPC9xdWVyeT5gO1xuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmZWF0dXJlc0J5SWQgICAgICAgIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeUxvb2t1cChxcnlTdHJpbmcpOyB9XG4gICAgZmVhdHVyZXNCeUZ1bmN0aW9uICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBcIkdPVGVybVwiKTsgfVxuICAgIC8vZmVhdHVyZXNCeVBhdGh3YXkgICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlQYXRod2F5VGVybShxcnlTdHJpbmcpOyB9XG4gICAgZmVhdHVyZXNCeVBoZW5vdHlwZSAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBcIk1QVGVybVwiKTsgfVxuICAgIGZlYXR1cmVzQnlEaXNlYXNlICAgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5T250b2xvZ3lUZXJtKHFyeVN0cmluZywgXCJET1Rlcm1cIik7IH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbn1cblxuZXhwb3J0IHsgQXV4RGF0YU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0F1eERhdGFNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSAnLi9TdG9yYWdlTWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB9IGZyb20gJy4vTGlzdEZvcm11bGFFdmFsdWF0b3InO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE1haW50YWlucyBuYW1lZCBsaXN0cyBvZiBJRHMuIExpc3RzIG1heSBiZSB0ZW1wb3JhcnksIGxhc3Rpbmcgb25seSBmb3IgdGhlIHNlc3Npb24sIG9yIHBlcm1hbmVudCxcbi8vIGxhc3RpbmcgdW50aWwgdGhlIHVzZXIgY2xlYXJzIHRoZSBicm93c2VyIGxvY2FsIHN0b3JhZ2UgYXJlYS5cbi8vXG4vLyBVc2VzIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSBhbmQgd2luZG93LmxvY2FsU3RvcmFnZSB0byBzYXZlIGxpc3RzXG4vLyB0ZW1wb3JhcmlseSBvciBwZXJtYW5lbnRseSwgcmVzcC4gIEZJWE1FOiBzaG91bGQgYmUgdXNpbmcgd2luZG93LmluZGV4ZWREQlxuLy9cbmNsYXNzIExpc3RNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLm5hbWUybGlzdCA9IG51bGw7XG5cdHRoaXMuX2xpc3RzID0gbmV3IExvY2FsU3RvcmFnZU1hbmFnZXIgIChcImxpc3RNYW5hZ2VyLmxpc3RzXCIpXG5cdHRoaXMuZm9ybXVsYUV2YWwgPSBuZXcgTGlzdEZvcm11bGFFdmFsdWF0b3IodGhpcyk7XG5cdHRoaXMuX2xvYWQoKTtcblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuXHQvLyBCdXR0b246IHNob3cvaGlkZSB3YXJuaW5nIG1lc3NhZ2Vcblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbi53YXJuaW5nJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IHcgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cIm1lc3NhZ2VcIl0nKTtcblx0XHR3LmNsYXNzZWQoJ3Nob3dpbmcnLCAhdy5jbGFzc2VkKCdzaG93aW5nJykpO1xuXHQgICAgfSk7XG5cdC8vIEJ1dHRvbjogY3JlYXRlIGxpc3QgZnJvbSBjdXJyZW50IHNlbGVjdGlvblxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJuZXdmcm9tc2VsZWN0aW9uXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgaWRzID0gT2JqZWN0LmtleXModGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0cyk7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdFx0aWYgKGlkcy5sZW5ndGggPT09IDApIHtcblx0XHQgICAgYWxlcnQoXCJOb3RoaW5nIHNlbGVjdGVkLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbmV3bGlzdCA9IHRoaXMuY3JlYXRlTGlzdChcInNlbGVjdGlvblwiLCBpZHMpO1xuXHRcdHRoaXMudXBkYXRlKG5ld2xpc3QpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBjb21iaW5lIGxpc3RzOiBvcGVuIGxpc3QgZWRpdG9yIHdpdGggZm9ybXVsYSBlZGl0b3Igb3BlblxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJjb21iaW5lXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAodGhpcy5nZXROYW1lcygpLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vIGxpc3RzLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbGUgPSB0aGlzLmFwcC5saXN0RWRpdG9yO1xuXHRcdGxlLm9wZW4oKTtcblx0XHRsZS5vcGVuRm9ybXVsYUVkaXRvcigpO1xuXHQgICAgfSk7XG5cdC8vIEJ1dHRvbjogZGVsZXRlIGFsbCBsaXN0cyAoZ2V0IGNvbmZpcm1hdGlvbiBmaXJzdCkuXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cInB1cmdlXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAodGhpcy5nZXROYW1lcygpLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vIGxpc3RzLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0ICAgICAgICBpZiAod2luZG93LmNvbmZpcm0oXCJEZWxldGUgYWxsIGxpc3RzLiBBcmUgeW91IHN1cmU/XCIpKSB7XG5cdFx0ICAgIHRoaXMucHVyZ2UoKTtcblx0XHQgICAgdGhpcy51cGRhdGUoKTtcblx0XHR9XG5cdCAgICB9KTtcbiAgICB9XG4gICAgX2xvYWQgKCkge1xuXHR0aGlzLm5hbWUybGlzdCA9IHRoaXMuX2xpc3RzLmdldChcImFsbFwiKTtcblx0aWYgKCF0aGlzLm5hbWUybGlzdCl7XG5cdCAgICB0aGlzLm5hbWUybGlzdCA9IHt9O1xuXHQgICAgdGhpcy5fc2F2ZSgpO1xuXHR9XG4gICAgfVxuICAgIF9zYXZlICgpIHtcbiAgICAgICAgdGhpcy5fbGlzdHMucHV0KFwiYWxsXCIsIHRoaXMubmFtZTJsaXN0KTtcbiAgICB9XG4gICAgLy9cbiAgICAvLyByZXR1cm5zIHRoZSBuYW1lcyBvZiBhbGwgdGhlIGxpc3RzLCBzb3J0ZWRcbiAgICBnZXROYW1lcyAoKSB7XG4gICAgICAgIGxldCBubXMgPSBPYmplY3Qua2V5cyh0aGlzLm5hbWUybGlzdCk7XG5cdG5tcy5zb3J0KCk7XG5cdHJldHVybiBubXM7XG4gICAgfVxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZmYgYSBsaXN0IGV4aXN0cyB3aXRoIHRoaXMgbmFtZVxuICAgIGhhcyAobmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZSBpbiB0aGlzLm5hbWUybGlzdDtcbiAgICB9XG4gICAgLy8gSWYgbm8gbGlzdCB3aXRoIHRoZSBnaXZlbiBuYW1lIGV4aXN0cywgcmV0dXJuIHRoZSBuYW1lLlxuICAgIC8vIE90aGVyd2lzZSwgcmV0dXJuIGEgbW9kaWZpZWQgdmVyc2lvbiBvZiBuYW1lIHRoYXQgaXMgdW5pcXVlLlxuICAgIC8vIFVuaXF1ZSBuYW1lcyBhcmUgY3JlYXRlZCBieSBhcHBlbmRpbmcgYSBjb3VudGVyLlxuICAgIC8vIEUuZy4sIHVuaXF1aWZ5KFwiZm9vXCIpIC0+IFwiZm9vLjFcIiBvciBcImZvby4yXCIgb3Igd2hhdGV2ZXIuXG4gICAgLy9cbiAgICB1bmlxdWlmeSAobmFtZSkge1xuXHRpZiAoIXRoaXMuaGFzKG5hbWUpKSBcblx0ICAgIHJldHVybiBuYW1lO1xuXHRmb3IgKGxldCBpID0gMTsgOyBpICs9IDEpIHtcblx0ICAgIGxldCBubiA9IGAke25hbWV9LiR7aX1gO1xuXHQgICAgaWYgKCF0aGlzLmhhcyhubikpXG5cdCAgICAgICAgcmV0dXJuIG5uO1xuXHR9XG4gICAgfVxuICAgIC8vIHJldHVybnMgdGhlIGxpc3Qgd2l0aCB0aGlzIG5hbWUsIG9yIG51bGwgaWYgbm8gc3VjaCBsaXN0XG4gICAgZ2V0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLm5hbWUybGlzdFtuYW1lXTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIHJldHVybnMgYWxsIHRoZSBsaXN0cywgc29ydGVkIGJ5IG5hbWVcbiAgICBnZXRBbGwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXROYW1lcygpLm1hcChuID0+IHRoaXMuZ2V0KG4pKVxuICAgIH1cbiAgICAvLyBcbiAgICBjcmVhdGVPclVwZGF0ZSAobmFtZSwgaWRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMudXBkYXRlTGlzdChuYW1lLG51bGwsaWRzKSA6IHRoaXMuY3JlYXRlTGlzdChuYW1lLCBpZHMpO1xuICAgIH1cbiAgICAvLyBjcmVhdGVzIGEgbmV3IGxpc3Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgaWRzLlxuICAgIGNyZWF0ZUxpc3QgKG5hbWUsIGlkcywgZm9ybXVsYSkge1xuXHRpZiAobmFtZSAhPT0gXCJfXCIpXG5cdCAgICBuYW1lID0gdGhpcy51bmlxdWlmeShuYW1lKTtcblx0Ly9cblx0bGV0IGR0ID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMubmFtZTJsaXN0W25hbWVdID0ge1xuXHQgICAgbmFtZTogICAgIG5hbWUsXG5cdCAgICBpZHM6ICAgICAgaWRzLFxuXHQgICAgZm9ybXVsYTogIGZvcm11bGEgfHwgXCJcIixcblx0ICAgIGNyZWF0ZWQ6ICBkdCxcblx0ICAgIG1vZGlmaWVkOiBkdFxuXHR9O1xuXHR0aGlzLl9zYXZlKCk7XG5cdHJldHVybiB0aGlzLm5hbWUybGlzdFtuYW1lXTtcbiAgICB9XG4gICAgLy8gUHJvdmlkZSBhY2Nlc3MgdG8gZXZhbHVhdGlvbiBzZXJ2aWNlXG4gICAgZXZhbEZvcm11bGEgKGV4cHIpIHtcblx0cmV0dXJuIHRoaXMuZm9ybXVsYUV2YWwuZXZhbChleHByKTtcbiAgICB9XG4gICAgLy8gUmVmcmVzaGVzIGEgbGlzdCBhbmQgcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZWZyZXNoZWQgbGlzdC5cbiAgICAvLyBJZiB0aGUgbGlzdCBpZiBhIFBPTE8sIHByb21pc2UgcmVzb2x2ZXMgaW1tZWRpYXRlbHkgdG8gdGhlIGxpc3QuXG4gICAgLy8gT3RoZXJ3aXNlLCBzdGFydHMgYSByZWV2YWx1YXRpb24gb2YgdGhlIGZvcm11bGEgdGhhdCByZXNvbHZlcyBhZnRlciB0aGVcbiAgICAvLyBsaXN0J3MgaWRzIGhhdmUgYmVlbiB1cGRhdGVkLlxuICAgIC8vIElmIHRoZXJlIGlzIGFuIGVycm9yLCB0aGUgcmV0dXJuZWQgcHJvbWlzZSByZWplY3RzIHdpdGggdGhlIGVycm9yLlxuICAgIHJlZnJlc2hMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdGxzdC5tb2RpZmllZCA9IFwiXCIrbmV3IERhdGUoKTtcblx0aWYgKCFsc3QuZm9ybXVsYSlcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobHN0KTtcblx0ZWxzZSB7XG5cdCAgICBsZXQgcCA9IHRoaXMuZm9ybXVhbEV2YWwuZXZhbChsc3QuZm9ybXVsYSkudGhlbiggaWRzID0+IHtcblx0XHQgICAgbHN0LmlkcyA9IGlkcztcblx0XHQgICAgcmV0dXJuIGxzdDtcblx0XHR9KTtcblx0ICAgIHJldHVybiBwO1xuXHR9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlcyB0aGUgaWRzIGluIHRoZSBnaXZlbiBsaXN0XG4gICAgdXBkYXRlTGlzdCAobmFtZSwgbmV3bmFtZSwgbmV3aWRzLCBuZXdmb3JtdWxhKSB7XG5cdGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcbiAgICAgICAgaWYgKCEgbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuYW1lO1xuXHRpZiAobmV3bmFtZSkge1xuXHQgICAgZGVsZXRlIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXTtcblx0ICAgIGxzdC5uYW1lID0gdGhpcy51bmlxdWlmeShuZXduYW1lKTtcblx0ICAgIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXSA9IGxzdDtcblx0fVxuXHRpZiAobmV3aWRzKSBsc3QuaWRzICA9IG5ld2lkcztcblx0aWYgKG5ld2Zvcm11bGEgfHwgbmV3Zm9ybXVsYT09PVwiXCIpIGxzdC5mb3JtdWxhID0gbmV3Zm9ybXVsYTtcblx0bHN0Lm1vZGlmaWVkID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMuX3NhdmUoKTtcblx0cmV0dXJuIGxzdDtcbiAgICB9XG4gICAgLy8gZGVsZXRlcyB0aGUgc3BlY2lmaWVkIGxpc3RcbiAgICBkZWxldGVMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0ZGVsZXRlIHRoaXMubmFtZTJsaXN0W25hbWVdO1xuXHR0aGlzLl9zYXZlKCk7XG5cdC8vIEZJWE1FOiB1c2UgZXZlbnRzISFcblx0aWYgKGxzdCA9PT0gdGhpcy5hcHAuY3VycmVudExpc3QpIHRoaXMuYXBwLmN1cnJlbnRMaXN0ID0gbnVsbDtcblx0aWYgKGxzdCA9PT0gdGhpcy5hcHAubGlzdEVkaXRvci5saXN0KSB0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QgPSBudWxsO1xuXHRyZXR1cm4gbHN0O1xuICAgIH1cbiAgICAvLyBkZWxldGUgYWxsIGxpc3RzXG4gICAgcHVyZ2UgKCkge1xuICAgICAgICB0aGlzLm5hbWUybGlzdCA9IHt9XG5cdHRoaXMuX3NhdmUoKTtcblx0Ly9cblx0dGhpcy5hcHAuY3VycmVudExpc3QgPSBudWxsO1xuXHR0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QgPSBudWxsOyAvLyBGSVhNRSAtIHJlYWNoYWNyb3NzXG4gICAgfVxuICAgIC8vIFJldHVybnMgdHJ1ZSBpZmYgZXhwciBpcyB2YWxpZCwgd2hpY2ggbWVhbnMgaXQgaXMgYm90aCBzeW50YWN0aWNhbGx5IGNvcnJlY3QgXG4gICAgLy8gYW5kIGFsbCBtZW50aW9uZWQgbGlzdHMgZXhpc3QuXG4gICAgaXNWYWxpZCAoZXhwcikge1xuXHRyZXR1cm4gdGhpcy5mb3JtdWxhRXZhbC5pc1ZhbGlkKGV4cHIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIHRoZSBcIk15IGxpc3RzXCIgYm94IHdpdGggdGhlIGN1cnJlbnRseSBhdmFpbGFibGUgbGlzdHMuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgIG5ld2xpc3QgKExpc3QpIG9wdGlvbmFsLiBJZiBzcGVjaWZpZWQsIHdlIGp1c3QgY3JlYXRlZCB0aGF0IGxpc3QsIGFuZCBpdHMgbmFtZSBpc1xuICAgIC8vICAgXHRhIGdlbmVyYXRlZCBkZWZhdWx0LiBQbGFjZSBmb2N1cyB0aGVyZSBzbyB1c2VyIGNhbiB0eXBlIG5ldyBuYW1lLlxuICAgIHVwZGF0ZSAobmV3bGlzdCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBsaXN0cyA9IHRoaXMuZ2V0QWxsKCk7XG5cdGxldCBieU5hbWUgPSAoYSxiKSA9PiB7XG5cdCAgICBsZXQgYW4gPSBhLm5hbWUudG9Mb3dlckNhc2UoKTtcblx0ICAgIGxldCBibiA9IGIubmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgcmV0dXJuIChhbiA8IGJuID8gLTEgOiBhbiA+IGJuID8gKzEgOiAwKTtcblx0fTtcblx0bGV0IGJ5RGF0ZSA9IChhLGIpID0+ICgobmV3IERhdGUoYi5tb2RpZmllZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLm1vZGlmaWVkKSkuZ2V0VGltZSgpKTtcblx0bGlzdHMuc29ydChieU5hbWUpO1xuXHRsZXQgaXRlbXMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImxpc3RzXCJdJykuc2VsZWN0QWxsKFwiLmxpc3RJbmZvXCIpXG5cdCAgICAuZGF0YShsaXN0cyk7XG5cdGxldCBuZXdpdGVtcyA9IGl0ZW1zLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJsaXN0SW5mbyBmbGV4cm93XCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcImlcIikuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29ucyBidXR0b25cIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLFwiZWRpdFwiKVxuXHQgICAgLnRleHQoXCJtb2RlX2VkaXRcIilcblx0ICAgIC5hdHRyKFwidGl0bGVcIixcIkVkaXQgdGhpcyBsaXN0LlwiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJzcGFuXCIpLmF0dHIoXCJuYW1lXCIsXCJuYW1lXCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcInNpemVcIik7XG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcImRhdGVcIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwiaVwiKS5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zIGJ1dHRvblwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJkZWxldGVcIilcblx0ICAgIC50ZXh0KFwiaGlnaGxpZ2h0X29mZlwiKVxuXHQgICAgLmF0dHIoXCJ0aXRsZVwiLFwiRGVsZXRlIHRoaXMgbGlzdC5cIik7XG5cblx0aWYgKG5ld2l0ZW1zWzBdWzBdKSB7XG5cdCAgICBsZXQgbGFzdCA9IG5ld2l0ZW1zWzBdW25ld2l0ZW1zWzBdLmxlbmd0aC0xXTtcblx0ICAgIGxhc3Quc2Nyb2xsSW50b1ZpZXcoKTtcblx0fVxuXG5cdGl0ZW1zXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgbHN0PT5sc3QubmFtZSlcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChsc3QpIHtcblx0XHRpZiAoZDMuZXZlbnQuYWx0S2V5KSB7XG5cdFx0ICAgIGxldCBsZSA9IHNlbGYuYXBwLmxpc3RFZGl0b3I7IC8vIEZJWE1FIHJlYWNob3ZlclxuXHRcdCAgICBsZXQgcyA9IGxzdC5uYW1lO1xuXHRcdCAgICBsZXQgcmUgPSAvWyA9KCkrKi1dLztcblx0XHQgICAgaWYgKHMuc2VhcmNoKHJlKSA+PSAwKVxuXHRcdFx0cyA9ICdcIicgKyBzICsgJ1wiJztcblx0XHQgICAgaWYgKCFsZS5pc0VkaXRpbmdGb3JtdWxhKSB7XG5cdFx0ICAgICAgICBsZS5vcGVuKCk7XG5cdFx0XHRsZS5vcGVuRm9ybXVsYUVkaXRvcigpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vXG5cdFx0ICAgIGxlLmFkZFRvTGlzdEV4cHIocysnICcpO1xuXHRcdH1cblx0XHQvLyBvdGhlcndpc2UsIHNldCB0aGlzIGFzIHRoZSBjdXJyZW50IGxpc3Rcblx0XHRlbHNlIFxuXHRcdCAgICBzZWxmLmFwcC5jdXJyZW50TGlzdCA9IGxzdDsgLy8gRklYTUUgcmVhY2hvdmVyXG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJlZGl0XCJdJylcblx0ICAgIC8vIGVkaXQ6IGNsaWNrIFxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24obHN0KSB7XG5cdCAgICAgICAgc2VsZi5hcHAubGlzdEVkaXRvci5vcGVuKGxzdCk7XG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCdzcGFuW25hbWU9XCJuYW1lXCJdJylcblx0ICAgIC50ZXh0KGxzdCA9PiBsc3QubmFtZSk7XG5cdGl0ZW1zLnNlbGVjdCgnc3BhbltuYW1lPVwiZGF0ZVwiXScpLnRleHQobHN0ID0+IHtcblx0ICAgIGxldCBtZCA9IG5ldyBEYXRlKGxzdC5tb2RpZmllZCk7XG5cdCAgICBsZXQgZCA9IGAke21kLmdldEZ1bGxZZWFyKCl9LSR7bWQuZ2V0TW9udGgoKSsxfS0ke21kLmdldERhdGUoKX0gYCBcblx0ICAgICAgICAgICsgYDoke21kLmdldEhvdXJzKCl9LiR7bWQuZ2V0TWludXRlcygpfS4ke21kLmdldFNlY29uZHMoKX1gO1xuXHQgICAgcmV0dXJuIGQ7XG5cdH0pO1xuXHRpdGVtcy5zZWxlY3QoJ3NwYW5bbmFtZT1cInNpemVcIl0nKS50ZXh0KGxzdCA9PiBsc3QuaWRzLmxlbmd0aCk7XG5cdGl0ZW1zLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZGVsZXRlXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsIGxzdCA9PiB7XG5cdCAgICAgICAgdGhpcy5kZWxldGVMaXN0KGxzdC5uYW1lKTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXG5cdFx0Ly8gTm90IHN1cmUgd2h5IHRoaXMgaXMgbmVjZXNzYXJ5IGhlcmUuIEJ1dCB3aXRob3V0IGl0LCB0aGUgbGlzdCBpdGVtIGFmdGVyIHRoZSBvbmUgYmVpbmdcblx0XHQvLyBkZWxldGVkIGhlcmUgd2lsbCByZWNlaXZlIGEgY2xpY2sgZXZlbnQuXG5cdFx0ZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0Ly9cblx0ICAgIH0pO1xuXG5cdC8vXG5cdGl0ZW1zLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0aWYgKG5ld2xpc3QpIHtcblx0ICAgIGxldCBsc3RlbHQgPSBcblx0ICAgICAgICBkMy5zZWxlY3QoYCNteWxpc3RzIFtuYW1lPVwibGlzdHNcIl0gW25hbWU9XCIke25ld2xpc3QubmFtZX1cIl1gKVswXVswXTtcbiAgICAgICAgICAgIGxzdGVsdC5zY3JvbGxJbnRvVmlldyhmYWxzZSk7XG5cdH1cbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIExpc3RNYW5hZ2VyXG5cbmV4cG9ydCB7IExpc3RNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfSBmcm9tICcuL0xpc3RGb3JtdWxhUGFyc2VyJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBLbm93cyBob3cgdG8gcGFyc2UgYW5kIGV2YWx1YXRlIGEgbGlzdCBmb3JtdWxhIChha2EgbGlzdCBleHByZXNzaW9uKS5cbmNsYXNzIExpc3RGb3JtdWxhRXZhbHVhdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAobGlzdE1hbmFnZXIpIHtcblx0dGhpcy5saXN0TWFuYWdlciA9IGxpc3RNYW5hZ2VyO1xuICAgICAgICB0aGlzLnBhcnNlciA9IG5ldyBMaXN0Rm9ybXVsYVBhcnNlcigpO1xuICAgIH1cbiAgICAvLyBFdmFsdWF0ZXMgdGhlIGV4cHJlc3Npb24gYW5kIHJldHVybnMgYSBQcm9taXNlIGZvciB0aGUgbGlzdCBvZiBpZHMuXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gZXJyb3IsIHRoZSBwcm9taXNlIHJlamVjdHMgd2l0aCB0aGUgZXJyb3IgbWVzc2FnZS5cbiAgICBldmFsIChleHByKSB7XG5cdCByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICAgdHJ5IHtcblx0XHRsZXQgYXN0ID0gdGhpcy5wYXJzZXIucGFyc2UoZXhwcik7XG5cdFx0bGV0IGxtID0gdGhpcy5saXN0TWFuYWdlcjtcblx0XHRsZXQgcmVhY2ggPSAobikgPT4ge1xuXHRcdCAgICBpZiAodHlwZW9mKG4pID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdFx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG47XG5cdFx0XHRyZXR1cm4gbmV3IFNldChsc3QuaWRzKTtcblx0XHQgICAgfVxuXHRcdCAgICBlbHNlIHtcblx0XHRcdGxldCBsID0gcmVhY2gobi5sZWZ0KTtcblx0XHRcdGxldCByID0gcmVhY2gobi5yaWdodCk7XG5cdFx0XHRyZXR1cm4gbFtuLm9wXShyKTtcblx0XHQgICAgfVxuXHRcdH1cblx0XHRsZXQgaWRzID0gcmVhY2goYXN0KTtcblx0XHRyZXNvbHZlKEFycmF5LmZyb20oaWRzKSk7XG5cdCAgICB9XG5cdCAgICBjYXRjaCAoZSkge1xuXHRcdHJlamVjdChlKTtcblx0ICAgIH1cblx0IH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIC8vIENoZWNrcyB0aGUgY3VycmVudCBleHByZXNzaW9uIGZvciBzeW50YWN0aWMgYW5kIHNlbWFudGljIHZhbGlkaXR5IGFuZCBzZXRzIHRoZSBcbiAgICAvLyB2YWxpZC9pbnZhbGlkIGNsYXNzIGFjY29yZGluZ2x5LiBTZW1hbnRpYyB2YWxpZGl0eSBzaW1wbHkgbWVhbnMgYWxsIG5hbWVzIGluIHRoZVxuICAgIC8vIGV4cHJlc3Npb24gYXJlIGJvdW5kLlxuICAgIC8vXG4gICAgaXNWYWxpZCAgKGV4cHIpIHtcblx0dHJ5IHtcblx0ICAgIC8vIGZpcnN0IGNoZWNrIHN5bnRheFxuXHQgICAgbGV0IGFzdCA9IHRoaXMucGFyc2VyLnBhcnNlKGV4cHIpO1xuXHQgICAgbGV0IGxtICA9IHRoaXMubGlzdE1hbmFnZXI7IFxuXHQgICAgLy8gbm93IGNoZWNrIGxpc3QgbmFtZXNcblx0ICAgIChmdW5jdGlvbiByZWFjaChuKSB7XG5cdFx0aWYgKHR5cGVvZihuKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdCAgICBsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdCAgICBpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgblxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHQgICAgcmVhY2gobi5sZWZ0KTtcblx0XHQgICAgcmVhY2gobi5yaWdodCk7XG5cdFx0fVxuXHQgICAgfSkoYXN0KTtcblxuXHQgICAgLy8gVGh1bWJzIHVwIVxuXHQgICAgcmV0dXJuIHRydWU7XG5cdH1cblx0Y2F0Y2ggKGUpIHtcblx0ICAgIC8vIHN5bnRheCBlcnJvciBvciB1bmtub3duIGxpc3QgbmFtZVxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEZvcm11bGFFdmFsdWF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHNldENhcmV0UG9zaXRpb24sIG1vdmVDYXJldFBvc2l0aW9uLCBnZXRDYXJldFJhbmdlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9IGZyb20gJy4vTGlzdEZvcm11bGFQYXJzZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIExpc3RFZGl0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuXHRzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMucGFyc2VyID0gbmV3IExpc3RGb3JtdWxhUGFyc2VyKCk7XG5cdHRoaXMuZm9ybSA9IG51bGw7XG5cdHRoaXMuaW5pdERvbSgpO1xuXHR0aGlzLmlzRWRpdGluZ0Zvcm11bGEgPSBmYWxzZTtcblx0Ly9cblx0dGhpcy5saXN0ID0gbnVsbDtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0dGhpcy5mb3JtID0gdGhpcy5yb290LnNlbGVjdChcImZvcm1cIilbMF1bMF07XG5cdGlmICghdGhpcy5mb3JtKSB0aHJvdyBcIkNvdWxkIG5vdCBpbml0IExpc3RFZGl0b3IuIE5vIGZvcm0gZWxlbWVudC5cIjtcblx0ZDMuc2VsZWN0KHRoaXMuZm9ybSlcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgdCA9IGQzLmV2ZW50LnRhcmdldDtcblx0XHRpZiAoXCJidXR0b25cIiA9PT0gdC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpe1xuXHRcdCAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCAgICBsZXQgZiA9IHRoaXMuZm9ybTtcblx0XHQgICAgbGV0IHMgPSBmLmlkcy52YWx1ZS5yZXBsYWNlKC9bLHxdL2csICcgJykudHJpbSgpO1xuXHRcdCAgICBsZXQgaWRzID0gcyA/IHMuc3BsaXQoL1xccysvKSA6IFtdO1xuXHRcdCAgICAvLyBzYXZlIGxpc3Rcblx0XHQgICAgaWYgKHQubmFtZSA9PT0gXCJzYXZlXCIpIHtcblx0XHRcdGlmICghdGhpcy5saXN0KSByZXR1cm47XG5cdFx0XHR0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGVMaXN0KHRoaXMubGlzdC5uYW1lLCBmLm5hbWUudmFsdWUsIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNyZWF0ZSBuZXcgbGlzdFxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwibmV3XCIpIHtcblx0XHRcdGxldCBuID0gZi5uYW1lLnZhbHVlLnRyaW0oKTtcblx0XHRcdGlmICghbikge1xuXHRcdFx0ICAgYWxlcnQoXCJZb3VyIGxpc3QgaGFzIG5vIG5hbWUgYW5kIGlzIHZlcnkgc2FkLiBQbGVhc2UgZ2l2ZSBpdCBhIG5hbWUgYW5kIHRyeSBhZ2Fpbi5cIik7XG5cdFx0XHQgICByZXR1cm5cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKG4uaW5kZXhPZignXCInKSA+PSAwKSB7XG5cdFx0XHQgICBhbGVydChcIk9oIGRlYXIsIHlvdXIgbGlzdCdzIG5hbWUgaGFzIGEgZG91YmxlIHF1b3RlIGNoYXJhY3RlciwgYW5kIEknbSBhZmFyYWlkIHRoYXQncyBub3QgYWxsb3dlZC4gUGxlYXNlIHJlbW92ZSB0aGUgJ1xcXCInIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdFx0ICAgcmV0dXJuXG5cdFx0XHR9XG5cdFx0ICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5jcmVhdGVMaXN0KG4sIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNsZWFyIGZvcm1cblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcImNsZWFyXCIpIHtcblx0XHQgICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG5cdFx0ICAgIH1cblx0XHQgICAgLy8gZm9yd2FyZCB0byBNR0lcblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcInRvTWdpXCIpIHtcblx0XHQgICAgICAgIGxldCBmcm0gPSBkMy5zZWxlY3QoJyNtZ2liYXRjaGZvcm0nKVswXVswXTtcblx0XHRcdGZybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIiBcIik7XG5cdFx0XHRmcm0uc3VibWl0KClcblx0XHQgICAgfVxuXHRcdCAgICAvLyBmb3J3YXJkIHRvIE1vdXNlTWluZVxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwidG9Nb3VzZU1pbmVcIikge1xuXHRcdCAgICAgICAgbGV0IGZybSA9IGQzLnNlbGVjdCgnI21vdXNlbWluZWZvcm0nKVswXVswXTtcblx0XHRcdGZybS5leHRlcm5hbGlkcy52YWx1ZSA9IGlkcy5qb2luKFwiLFwiKTtcblx0XHRcdGZybS5zdWJtaXQoKVxuXHRcdCAgICB9XG5cdFx0fVxuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBzaG93L2hpZGUgZm9ybXVsYSBlZGl0b3Jcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNlY3Rpb25cIl0gLmJ1dHRvbltuYW1lPVwiZWRpdGZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGVGb3JtdWxhRWRpdG9yKCkpO1xuXHQgICAgXG5cdC8vIElucHV0IGJveDogZm9ybXVsYTogdmFsaWRhdGUgb24gYW55IGlucHV0XG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIHRoaXMudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBGb3J3YXJkIC0+IE1HSS9Nb3VzZU1pbmU6IGRpc2FibGUgYnV0dG9ucyBpZiBubyBpZHNcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIGxldCBlbXB0eSA9IHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMDtcblx0XHR0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0aGlzLmZvcm0udG9Nb3VzZU1pbmUuZGlzYWJsZWQgPSBlbXB0eTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbnM6IHRoZSBsaXN0IG9wZXJhdG9yIGJ1dHRvbnMgKHVuaW9uLCBpbnRlcnNlY3Rpb24sIGV0Yy4pXG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uLmxpc3RvcCcpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gYWRkIG15IHN5bWJvbCB0byB0aGUgZm9ybXVsYVxuXHRcdGxldCBpbmVsdCA9IHNlbGYuZm9ybS5mb3JtdWxhO1xuXHRcdGxldCBvcCA9IGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwibmFtZVwiKTtcblx0XHRzZWxmLmFkZFRvTGlzdEV4cHIob3ApO1xuXHRcdHNlbGYudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IHJlZnJlc2ggYnV0dG9uIGZvciBydW5uaW5nIHRoZSBmb3JtdWxhXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uW25hbWU9XCJyZWZyZXNoXCJdJylcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgZW1lc3NhZ2U9XCJJJ20gdGVycmlibHkgc29ycnksIGJ1dCB0aGVyZSBhcHBlYXJzIHRvIGJlIGEgcHJvYmxlbSB3aXRoIHlvdXIgbGlzdCBleHByZXNzaW9uOiBcIjtcblx0XHRsZXQgZm9ybXVsYSA9IHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlLnRyaW0oKTtcblx0XHRpZiAoZm9ybXVsYS5sZW5ndGggPT09IDApXG5cdFx0ICAgIHJldHVybjtcblx0ICAgICAgICB0aGlzLmFwcC5saXN0TWFuYWdlclxuXHRcdCAgICAuZXZhbEZvcm11bGEoZm9ybXVsYSlcblx0XHQgICAgLnRoZW4oaWRzID0+IHtcblx0XHQgICAgICAgIHRoaXMuZm9ybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIlxcblwiKTtcblx0XHQgICAgIH0pXG5cdFx0ICAgIC5jYXRjaChlID0+IGFsZXJ0KGVtZXNzYWdlICsgZSkpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBjbG9zZSBmb3JtdWxhIGVkaXRvclxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gLmJ1dHRvbltuYW1lPVwiY2xvc2VcIl0nKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5jbG9zZUZvcm11bGFFZGl0b3IoKSApO1xuXHRcblx0Ly8gQ2xpY2tpbmcgdGhlIGJveCBjb2xsYXBzZSBidXR0b24gc2hvdWxkIGNsZWFyIHRoZSBmb3JtXG5cdHRoaXMucm9vdC5zZWxlY3QoXCIuYnV0dG9uLmNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5leHRyYVwiLCAoKSA9PiB7XG5cdCAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0XHR0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpO1xuXHQgICAgfSk7XG4gICAgfVxuICAgIHBhcnNlSWRzIChzKSB7XG5cdHJldHVybiBzLnJlcGxhY2UoL1ssfF0vZywgJyAnKS50cmltKCkuc3BsaXQoL1xccysvKTtcbiAgICB9XG4gICAgZ2V0IGxpc3QgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdDtcbiAgICB9XG4gICAgc2V0IGxpc3QgKGxzdCkge1xuICAgICAgICB0aGlzLl9saXN0ID0gbHN0O1xuXHR0aGlzLl9zeW5jRGlzcGxheSgpO1xuICAgIH1cbiAgICBfc3luY0Rpc3BsYXkgKCkge1xuXHRsZXQgbHN0ID0gdGhpcy5fbGlzdDtcblx0aWYgKCFsc3QpIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0ubW9kaWZpZWQudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uc2F2ZS5kaXNhYmxlZCA9IHRydWU7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkID0gdHJ1ZTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gbHN0Lm5hbWU7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gbHN0Lmlkcy5qb2luKCdcXG4nKTtcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gbHN0LmZvcm11bGEgfHwgXCJcIjtcblx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZS50cmltKCkubGVuZ3RoID4gMDtcblx0ICAgIHRoaXMuZm9ybS5tb2RpZmllZC52YWx1ZSA9IGxzdC5tb2RpZmllZDtcblx0ICAgIHRoaXMuZm9ybS5zYXZlLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgXG5cdCAgICAgID0gdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkIFxuXHQgICAgICAgID0gKHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMCk7XG5cdH1cblx0dGhpcy52YWxpZGF0ZUV4cHIoKTtcbiAgICB9XG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuICAgIH1cbiAgICBvcGVuIChsc3QpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbHN0O1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiLCBmYWxzZSk7XG4gICAgfVxuICAgIGNsb3NlICgpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIiwgdHJ1ZSk7XG4gICAgfVxuICAgIG9wZW5Gb3JtdWxhRWRpdG9yICgpIHtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJlZGl0aW5nZm9ybXVsYVwiLCB0cnVlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gdHJ1ZTtcblx0bGV0IGYgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZTtcblx0dGhpcy5mb3JtLmZvcm11bGEuZm9jdXMoKTtcblx0c2V0Q2FyZXRQb3NpdGlvbih0aGlzLmZvcm0uZm9ybXVsYSwgZi5sZW5ndGgpO1xuICAgIH1cbiAgICBjbG9zZUZvcm11bGFFZGl0b3IgKCkge1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImVkaXRpbmdmb3JtdWxhXCIsIGZhbHNlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gZmFsc2U7XG4gICAgfVxuICAgIHRvZ2dsZUZvcm11bGFFZGl0b3IgKCkge1xuXHRsZXQgc2hvd2luZyA9IHRoaXMucm9vdC5jbGFzc2VkKFwiZWRpdGluZ2Zvcm11bGFcIik7XG5cdHNob3dpbmcgPyB0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpIDogdGhpcy5vcGVuRm9ybXVsYUVkaXRvcigpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDaGVja3MgdGhlIGN1cnJlbnQgZXhwcmVzc2lvbiBhbmQgc2V0cyB0aGUgdmFsaWQvaW52YWxpZCBjbGFzcy5cbiAgICB2YWxpZGF0ZUV4cHIgICgpIHtcblx0bGV0IGlucCA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKTtcblx0bGV0IGV4cHIgPSBpbnBbMF1bMF0udmFsdWUudHJpbSgpO1xuXHRpZiAoIWV4cHIpIHtcblx0ICAgIGlucC5jbGFzc2VkKFwidmFsaWRcIixmYWxzZSkuY2xhc3NlZChcImludmFsaWRcIixmYWxzZSk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IGZhbHNlO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgbGV0IGlzVmFsaWQgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5pc1ZhbGlkKGV4cHIpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHQgICAgaW5wLmNsYXNzZWQoXCJ2YWxpZFwiLCBpc1ZhbGlkKS5jbGFzc2VkKFwiaW52YWxpZFwiLCAhaXNWYWxpZCk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IHRydWU7XG5cdH1cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYWRkVG9MaXN0RXhwciAodGV4dCkge1xuXHRsZXQgaW5wID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIFtuYW1lPVwiZm9ybXVsYVwiXScpO1xuXHRsZXQgaWVsdCA9IGlucFswXVswXTtcblx0bGV0IHYgPSBpZWx0LnZhbHVlO1xuXHRsZXQgc3BsaWNlID0gZnVuY3Rpb24gKGUsdCl7XG5cdCAgICBsZXQgdiA9IGUudmFsdWU7XG5cdCAgICBsZXQgciA9IGdldENhcmV0UmFuZ2UoZSk7XG5cdCAgICBlLnZhbHVlID0gdi5zbGljZSgwLHJbMF0pICsgdCArIHYuc2xpY2UoclsxXSk7XG5cdCAgICBzZXRDYXJldFBvc2l0aW9uKGUsIHJbMF0rdC5sZW5ndGgpO1xuXHQgICAgZS5mb2N1cygpO1xuXHR9XG5cdGxldCByYW5nZSA9IGdldENhcmV0UmFuZ2UoaWVsdCk7XG5cdGlmIChyYW5nZVswXSA9PT0gcmFuZ2VbMV0pIHtcblx0ICAgIC8vIG5vIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dCk7XG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKSBcblx0XHRtb3ZlQ2FyZXRQb3NpdGlvbihpZWx0LCAtMSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICAvLyB0aGVyZSBpcyBhIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKVxuXHRcdC8vIHN1cnJvdW5kIGN1cnJlbnQgc2VsZWN0aW9uIHdpdGggcGFyZW5zLCB0aGVuIG1vdmUgY2FyZXQgYWZ0ZXJcblx0XHR0ZXh0ID0gJygnICsgdi5zbGljZShyYW5nZVswXSxyYW5nZVsxXSkgKyAnKSc7XG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dClcblx0fVxuXHR0aGlzLnZhbGlkYXRlRXhwcigpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIExpc3RFZGl0b3JcblxuZXhwb3J0IHsgTGlzdEVkaXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEVkaXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTG9jYWxTdG9yYWdlTWFuYWdlciB9IGZyb20gJy4vU3RvcmFnZU1hbmFnZXInO1xuXG5jb25zdCBNR1JfTkFNRSA9IFwicHJlZnNNYW5hZ2VyXCI7XG5jb25zdCBJVEVNX05BTUU9IFwidXNlclByZWZzXCI7XG5cbmNsYXNzIFVzZXJQcmVmc01hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZU1hbmFnZXIoTUdSX05BTUUpO1xuXHR0aGlzLmRhdGEgPSBudWxsO1xuXHR0aGlzLl9sb2FkKCk7XG4gICAgfVxuICAgIF9sb2FkICgpIHtcblx0dGhpcy5kYXRhID0gdGhpcy5zdG9yYWdlLmdldChJVEVNX05BTUUpO1xuXHRpZiAoIXRoaXMuZGF0YSl7XG5cdCAgICB0aGlzLmRhdGEgPSB7fTtcblx0ICAgIHRoaXMuX3NhdmUoKTtcblx0fVxuICAgIH1cbiAgICBfc2F2ZSAoKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5wdXQoSVRFTV9OQU1FLCB0aGlzLmRhdGEpO1xuICAgIH1cbiAgICBoYXMgKG4pIHtcbiAgICB9XG4gICAgZ2V0IChuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbbl07XG4gICAgfVxuICAgIGdldEFsbCAoKSB7XG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRhdGEpXG4gICAgfVxuICAgIHNldCAobiwgdikge1xuICAgICAgICB0aGlzLmRhdGFbbl0gPSB2O1xuXHR0aGlzLl9zYXZlKCk7XG4gICAgfVxuICAgIHNldEFsbCAodikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuZGF0YSwgdik7XG5cdHRoaXMuX3NhdmUoKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IFVzZXJQcmVmc01hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1VzZXJQcmVmc01hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEZhY2V0IH0gZnJvbSAnLi9GYWNldCc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgRmFjZXRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwKSB7XG5cdHRoaXMuYXBwID0gYXBwO1xuXHR0aGlzLmZhY2V0cyA9IFtdO1xuXHR0aGlzLm5hbWUyZmFjZXQgPSB7fVxuICAgIH1cbiAgICBhZGRGYWNldCAobmFtZSwgdmFsdWVGY24pIHtcblx0aWYgKHRoaXMubmFtZTJmYWNldFtuYW1lXSkgdGhyb3cgXCJEdXBsaWNhdGUgZmFjZXQgbmFtZS4gXCIgKyBuYW1lO1xuXHRsZXQgZmFjZXQgPSBuZXcgRmFjZXQobmFtZSwgdGhpcywgdmFsdWVGY24pO1xuICAgICAgICB0aGlzLmZhY2V0cy5wdXNoKCBmYWNldCApO1xuXHR0aGlzLm5hbWUyZmFjZXRbbmFtZV0gPSBmYWNldDtcblx0cmV0dXJuIGZhY2V0XG4gICAgfVxuICAgIHRlc3QgKGYpIHtcbiAgICAgICAgbGV0IHZhbHMgPSB0aGlzLmZhY2V0cy5tYXAoIGZhY2V0ID0+IGZhY2V0LnRlc3QoZikgKTtcblx0cmV0dXJuIHZhbHMucmVkdWNlKChhY2N1bSwgdmFsKSA9PiBhY2N1bSAmJiB2YWwsIHRydWUpO1xuICAgIH1cbiAgICBhcHBseUFsbCAoKSB7XG5cdGxldCBzaG93ID0gbnVsbDtcblx0bGV0IGhpZGUgPSBcIm5vbmVcIjtcblx0Ly8gRklYTUU6IG1ham9yIHJlYWNob3ZlclxuXHR0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcImcuc3RyaXBzXCIpLnNlbGVjdEFsbCgncmVjdC5mZWF0dXJlJylcblx0ICAgIC5zdHlsZShcImRpc3BsYXlcIiwgZiA9PiB0aGlzLnRlc3QoZikgPyBzaG93IDogaGlkZSk7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgRmFjZXRNYW5hZ2VyXG5cbmV4cG9ydCB7IEZhY2V0TWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmFjZXRNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIEZhY2V0IHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSwgbWFuYWdlciwgdmFsdWVGY24pIHtcblx0dGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcblx0dGhpcy52YWx1ZXMgPSBbXTtcblx0dGhpcy52YWx1ZUZjbiA9IHZhbHVlRmNuO1xuICAgIH1cbiAgICBzZXRWYWx1ZXMgKHZhbHVlcywgcXVpZXRseSkge1xuICAgICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcblx0aWYgKCEgcXVpZXRseSkge1xuXHQgICAgdGhpcy5tYW5hZ2VyLmFwcGx5QWxsKCk7XG5cdCAgICB0aGlzLm1hbmFnZXIuYXBwLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9XG4gICAgfVxuICAgIHRlc3QgKGYpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLnZhbHVlcyB8fCB0aGlzLnZhbHVlcy5sZW5ndGggPT09IDAgfHwgdGhpcy52YWx1ZXMuaW5kZXhPZiggdGhpcy52YWx1ZUZjbihmKSApID49IDA7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgRmFjZXRcblxuZXhwb3J0IHsgRmFjZXQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZhY2V0LmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBkM3RzdiB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQmxvY2tUcmFuc2xhdG9yIH0gZnJvbSAnLi9CbG9ja1RyYW5zbGF0b3InO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEJsb2NrVHJhbnNsYXRvciBtYW5hZ2VyIGNsYXNzLiBGb3IgYW55IGdpdmVuIHBhaXIgb2YgZ2Vub21lcywgQSBhbmQgQiwgbG9hZHMgdGhlIHNpbmdsZSBibG9jayBmaWxlXG4vLyBmb3IgdHJhbnNsYXRpbmcgYmV0d2VlbiB0aGVtLCBhbmQgaW5kZXhlcyBpdCBcImZyb20gYm90aCBkaXJlY3Rpb25zXCI6XG4vLyBcdEEtPkItPiBbQUJfQmxvY2tGaWxlXSA8LUE8LUJcbi8vXG5jbGFzcyBCVE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG5cdHRoaXMucmNCbG9ja3MgPSB7fTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZWdpc3RlckJsb2NrcyAodXJsLCBhR2Vub21lLCBiR2Vub21lLCBibG9ja3MpIHtcblx0bGV0IGFuYW1lID0gYUdlbm9tZS5uYW1lO1xuXHRsZXQgYm5hbWUgPSBiR2Vub21lLm5hbWU7XG5cdGxldCBibGtGaWxlID0gbmV3IEJsb2NrVHJhbnNsYXRvcih1cmwsYUdlbm9tZSxiR2Vub21lLGJsb2Nrcyk7XG5cdGlmKCAhIHRoaXMucmNCbG9ja3NbYW5hbWVdKSB0aGlzLnJjQmxvY2tzW2FuYW1lXSA9IHt9O1xuXHRpZiggISB0aGlzLnJjQmxvY2tzW2JuYW1lXSkgdGhpcy5yY0Jsb2Nrc1tibmFtZV0gPSB7fTtcblx0dGhpcy5yY0Jsb2Nrc1thbmFtZV1bYm5hbWVdID0gYmxrRmlsZTtcblx0dGhpcy5yY0Jsb2Nrc1tibmFtZV1bYW5hbWVdID0gYmxrRmlsZTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBMb2FkcyB0aGUgc3ludGVueSBibG9jayBmaWxlIGZvciBnZW5vbWVzIGFHZW5vbWUgYW5kIGJHZW5vbWUuXG4gICAgLy8gXG4gICAgZ2V0QmxvY2tGaWxlIChhR2Vub21lLCBiR2Vub21lKSB7XG5cdC8vIEJlIGEgbGl0dGxlIHNtYXJ0IGFib3V0IHRoZSBvcmRlciB3ZSB0cnkgdGhlIG5hbWVzLi4uXG5cdGlmIChiR2Vub21lLm5hbWUgPCBhR2Vub21lLm5hbWUpIHtcblx0ICAgIGxldCB0bXAgPSBhR2Vub21lOyBhR2Vub21lID0gYkdlbm9tZTsgYkdlbm9tZSA9IHRtcDtcblx0fVxuXHQvLyBGaXJzdCwgc2VlIGlmIHdlIGFscmVhZHkgaGF2ZSB0aGlzIHBhaXJcblx0bGV0IGFuYW1lID0gYUdlbm9tZS5uYW1lO1xuXHRsZXQgYm5hbWUgPSBiR2Vub21lLm5hbWU7XG5cdGxldCBiZiA9ICh0aGlzLnJjQmxvY2tzW2FuYW1lXSB8fCB7fSlbYm5hbWVdO1xuXHRpZiAoYmYpXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGJmKTtcblx0XG5cdC8vIEZvciBhbnkgZ2l2ZW4gZ2Vub21lIHBhaXIsIG9ubHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgdHdvIGZpbGVzXG5cdC8vIGlzIGdlbmVyYXRlZCBieSB0aGUgYmFjayBlbmRcblx0bGV0IGZuMSA9IGAuL2RhdGEvYmxvY2tmaWxlcy8ke2FHZW5vbWUubmFtZX0tJHtiR2Vub21lLm5hbWV9LnRzdmBcblx0bGV0IGZuMiA9IGAuL2RhdGEvYmxvY2tmaWxlcy8ke2JHZW5vbWUubmFtZX0tJHthR2Vub21lLm5hbWV9LnRzdmBcblx0Ly8gVGhlIGZpbGUgZm9yIEEtPkIgaXMgc2ltcGx5IGEgcmUtc29ydCBvZiB0aGUgZmlsZSBmcm9tIEItPkEuIFNvIHRoZSBcblx0Ly8gYmFjayBlbmQgb25seSBjcmVhdGVzIG9uZSBvZiB0aGVtLlxuXHQvLyBXZSdsbCB0cnkgb25lIGFuZCBpZiB0aGF0J3Mgbm90IGl0LCB0aGVuIHRyeSB0aGUgb3RoZXIuXG5cdC8vIChBbmQgaWYgVEhBVCdzIG5vdCBpdCwgdGhlbiBjcnkgYSByaXZlci4uLilcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRyZXR1cm4gZDN0c3YoZm4xKVxuXHQgIC50aGVuKGZ1bmN0aW9uKGJsb2Nrcyl7XG5cdCAgICAgIC8vIHl1cCwgaXQgd2FzIEEtQlxuXHQgICAgICBzZWxmLnJlZ2lzdGVyQmxvY2tzKGZuMSwgYUdlbm9tZSwgYkdlbm9tZSwgYmxvY2tzKTtcblx0ICAgICAgcmV0dXJuIGJsb2Nrc1xuXHQgIH0pXG5cdCAgLmNhdGNoKGZ1bmN0aW9uKGUpe1xuXHQgICAgICBjb25zb2xlLmxvZyhgSU5GTzogRGlzcmVnYXJkIHRoYXQgNDA0IG1lc3NhZ2UhICR7Zm4xfSB3YXMgbm90IGZvdW5kLiBUcnlpbmcgJHtmbjJ9LmApO1xuXHQgICAgICByZXR1cm4gZDN0c3YoZm4yKVxuXHRcdCAgLnRoZW4oZnVuY3Rpb24oYmxvY2tzKXtcblx0XHQgICAgICAvLyBub3BlLCBpdCB3YXMgQi1BXG5cdFx0ICAgICAgc2VsZi5yZWdpc3RlckJsb2NrcyhmbjIsIGJHZW5vbWUsIGFHZW5vbWUsIGJsb2Nrcyk7XG5cdFx0ICAgICAgcmV0dXJuIGJsb2Nrc1xuXHRcdCAgfSlcblx0XHQgIC5jYXRjaChmdW5jdGlvbihlKXtcblx0XHQgICAgICBjb25zb2xlLmxvZygnQnV0IFRIQVQgNDA0IG1lc3NhZ2UgaXMgYSBwcm9ibGVtLicpO1xuXHRcdCAgICAgIHRocm93IGBDYW5ub3QgZ2V0IGJsb2NrIGZpbGUgZm9yIHRoaXMgZ2Vub21lIHBhaXI6ICR7YUdlbm9tZS5uYW1lfSAke2JHZW5vbWUubmFtZX0uXFxuKEVycm9yPSR7ZX0pYDtcblx0XHQgIH0pO1xuXHQgIH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gdGhlIHRyYW5zbGF0b3IgaGFzIGxvYWRlZCBhbGwgdGhlIGRhdGEgbmVlZGVkXG4gICAgLy8gZm9yIHRyYW5zbGF0aW5nIGNvb3JkaW5hdGVzIGJldHdlZW4gdGhlIGN1cnJlbnQgcmVmIHN0cmFpbiBhbmQgdGhlIGN1cnJlbnQgY29tcGFyaXNvbiBzdHJhaW5zLlxuICAgIC8vXG4gICAgcmVhZHkgKCkge1xuXHRsZXQgcHJvbWlzZXMgPSB0aGlzLmFwcC5jR2Vub21lcy5tYXAoY2cgPT4gdGhpcy5nZXRCbG9ja0ZpbGUodGhpcy5hcHAuckdlbm9tZSwgY2cpKTtcblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIHN5bnRlbnkgYmxvY2tzIHRoYXQgbWFwIHRoZSBjdXJyZW50IHJlZiBnZW5vbWUgdG8gdGhlIHNwZWNpZmllZCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIGdldEJsb2NrcyAoZnJvbUdlbm9tZSwgdG9HZW5vbWUpIHtcbiAgICAgICAgbGV0IGJsa1RyYW5zID0gdGhpcy5yY0Jsb2Nrc1tmcm9tR2Vub21lLm5hbWVdW3RvR2Vub21lLm5hbWVdO1xuXHRyZXR1cm4gYmxrVHJhbnMuZ2V0QmxvY2tzKGZyb21HZW5vbWUpXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVHJhbnNsYXRlcyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSBzcGVjaWZpZWQgZnJvbUdlbm9tZSB0byB0aGUgc3BlY2lmaWVkIHRvR2Vub21lLlxuICAgIC8vIFJldHVybnMgYSBsaXN0IG9mIHplcm8gb3IgbW9yZSBjb29yZGluYXRlIHJhbmdlcyBpbiB0aGUgdG9HZW5vbWUuXG4gICAgLy9cbiAgICB0cmFuc2xhdGUgKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCwgdG9HZW5vbWUpIHtcblx0Ly8gZ2V0IHRoZSByaWdodCBibG9jayBmaWxlXG5cdGxldCBibGtUcmFucyA9IHRoaXMucmNCbG9ja3NbZnJvbUdlbm9tZS5uYW1lXVt0b0dlbm9tZS5uYW1lXTtcblx0aWYgKCFibGtUcmFucykgdGhyb3cgXCJJbnRlcm5hbCBlcnJvci4gTm8gYmxvY2sgZmlsZSBmb3VuZCBpbiBpbmRleC5cIlxuXHQvLyB0cmFuc2xhdGUhXG5cdGxldCByYW5nZXMgPSBibGtUcmFucy50cmFuc2xhdGUoZnJvbUdlbm9tZSwgY2hyLCBzdGFydCwgZW5kKTtcblx0cmV0dXJuIHJhbmdlcztcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBCVE1hbmFnZXJcblxuZXhwb3J0IHsgQlRNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9CVE1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU29tZXRoaW5nIHRoYXQga25vd3MgaG93IHRvIHRyYW5zbGF0ZSBjb29yZGluYXRlcyBiZXR3ZWVuIHR3byBnZW5vbWVzLlxuLy9cbi8vXG5jbGFzcyBCbG9ja1RyYW5zbGF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKHVybCwgYUdlbm9tZSwgYkdlbm9tZSwgYmxvY2tzKXtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG5cdHRoaXMuYUdlbm9tZSA9IGFHZW5vbWU7XG5cdHRoaXMuYkdlbm9tZSA9IGJHZW5vbWU7XG5cdHRoaXMuYmxvY2tzID0gYmxvY2tzLm1hcChiID0+IHRoaXMucHJvY2Vzc0Jsb2NrKGIpKVxuXHR0aGlzLmN1cnJlbnRTb3J0ID0gXCJhXCI7XG4gICAgfVxuICAgIHByb2Nlc3NCbG9jayAoYmxrKSB7IFxuICAgICAgICBibGsuYUluZGV4ID0gcGFyc2VJbnQoYmxrLmFJbmRleCk7XG4gICAgICAgIGJsay5iSW5kZXggPSBwYXJzZUludChibGsuYkluZGV4KTtcbiAgICAgICAgYmxrLmFTdGFydCA9IHBhcnNlSW50KGJsay5hU3RhcnQpO1xuICAgICAgICBibGsuYlN0YXJ0ID0gcGFyc2VJbnQoYmxrLmJTdGFydCk7XG4gICAgICAgIGJsay5hRW5kICAgPSBwYXJzZUludChibGsuYUVuZCk7XG4gICAgICAgIGJsay5iRW5kICAgPSBwYXJzZUludChibGsuYkVuZCk7XG4gICAgICAgIGJsay5hTGVuZ3RoICAgPSBwYXJzZUludChibGsuYUxlbmd0aCk7XG4gICAgICAgIGJsay5iTGVuZ3RoICAgPSBwYXJzZUludChibGsuYkxlbmd0aCk7XG4gICAgICAgIGJsay5ibG9ja0NvdW50ICAgPSBwYXJzZUludChibGsuYmxvY2tDb3VudCk7XG4gICAgICAgIGJsay5ibG9ja1JhdGlvICAgPSBwYXJzZUZsb2F0KGJsay5ibG9ja1JhdGlvKTtcblx0YmxrLmFiTWFwID0gZDMuc2NhbGUubGluZWFyKClcblx0ICAgIC5kb21haW4oW2Jsay5hU3RhcnQsYmxrLmFFbmRdKVxuXHQgICAgLnJhbmdlKCBibGsuYmxvY2tPcmk9PT1cIi1cIiA/IFtibGsuYkVuZCxibGsuYlN0YXJ0XSA6IFtibGsuYlN0YXJ0LGJsay5iRW5kXSk7XG5cdGJsay5iYU1hcCA9IGJsay5hYk1hcC5pbnZlcnRcblx0cmV0dXJuIGJsaztcbiAgICB9XG4gICAgc2V0U29ydCAod2hpY2gpIHtcblx0aWYgKHdoaWNoICE9PSAnYScgJiYgd2hpY2ggIT09ICdiJykgdGhyb3cgXCJCYWQgYXJndW1lbnQ6XCIgKyB3aGljaDtcblx0bGV0IHNvcnRDb2wgPSB3aGljaCArIFwiSW5kZXhcIjtcblx0bGV0IGNtcCA9ICh4LHkpID0+IHhbc29ydENvbF0gLSB5W3NvcnRDb2xdO1xuXHR0aGlzLmJsb2Nrcy5zb3J0KGNtcCk7XG5cdHRoaXMuY3VyclNvcnQgPSB3aGljaDtcbiAgICB9XG4gICAgZmxpcFNvcnQgKCkge1xuXHR0aGlzLnNldFNvcnQodGhpcy5jdXJyU29ydCA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcbiAgICB9XG4gICAgLy8gR2l2ZW4gYSBnZW5vbWUgKGVpdGhlciB0aGUgYSBvciBiIGdlbm9tZSkgYW5kIGEgY29vcmRpbmF0ZSByYW5nZSxcbiAgICAvLyByZXR1cm5zIHRoZSBlcXVpdmFsZW50IGNvb3JkaW5hdGUgcmFuZ2UocykgaW4gdGhlIG90aGVyIGdlbm9tZVxuICAgIHRyYW5zbGF0ZSAoZnJvbUdlbm9tZSwgY2hyLCBzdGFydCwgZW5kKSB7XG5cdC8vXG5cdGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gc3RhcnQgOiBlbmQ7XG5cdC8vIGZyb20gPSBcImFcIiBvciBcImJcIiwgZGVwZW5kaW5nIG9uIHdoaWNoIGdlbm9tZSBpcyBnaXZlbi5cbiAgICAgICAgbGV0IGZyb20gPSAoZnJvbUdlbm9tZSA9PT0gdGhpcy5hR2Vub21lID8gXCJhXCIgOiBmcm9tR2Vub21lID09PSB0aGlzLmJHZW5vbWUgPyBcImJcIiA6IG51bGwpO1xuXHRpZiAoIWZyb20pIHRocm93IFwiQmFkIGFyZ3VtZW50LiBHZW5vbWUgbmVpdGhlciBBIG5vciBCLlwiO1xuXHQvLyB0byA9IFwiYlwiIG9yIFwiYVwiLCBvcHBvc2l0ZSBvZiBmcm9tXG5cdGxldCB0byA9IChmcm9tID09PSBcImFcIiA/IFwiYlwiIDogXCJhXCIpO1xuXHQvLyBtYWtlIHN1cmUgdGhlIGJsb2NrcyBhcmUgc29ydGVkIGJ5IHRoZSBmcm9tIGdlbm9tZVxuXHR0aGlzLnNldFNvcnQoZnJvbSk7XG5cdC8vXG5cdGxldCBmcm9tQyA9IGZyb20rXCJDaHJcIjtcblx0bGV0IGZyb21TID0gZnJvbStcIlN0YXJ0XCI7XG5cdGxldCBmcm9tRSA9IGZyb20rXCJFbmRcIjtcblx0bGV0IGZyb21JID0gZnJvbStcIkluZGV4XCI7XG5cdGxldCB0b0MgPSB0bytcIkNoclwiO1xuXHRsZXQgdG9TID0gdG8rXCJTdGFydFwiO1xuXHRsZXQgdG9FID0gdG8rXCJFbmRcIjtcblx0bGV0IHRvSSA9IHRvK1wiSW5kZXhcIjtcblx0bGV0IG1hcHBlciA9IGZyb20rdG8rXCJNYXBcIjtcblx0Ly8gXG5cdGxldCBibGtzID0gdGhpcy5ibG9ja3Ncblx0ICAgIC8vIEZpcnN0IGZpbHRlciBmb3IgYmxvY2tzIHRoYXQgb3ZlcmxhcCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBpbiB0aGUgZnJvbSBnZW5vbWVcblx0ICAgIC5maWx0ZXIoYmxrID0+IGJsa1tmcm9tQ10gPT09IGNociAmJiBibGtbZnJvbVNdIDw9IGVuZCAmJiBibGtbZnJvbUVdID49IHN0YXJ0KVxuXHQgICAgLy8gbWFwIGVhY2ggYmxvY2suIFxuXHQgICAgLm1hcChibGsgPT4ge1xuXHRcdC8vIGNvb3JkIHJhbmdlIG9uIHRoZSBmcm9tIHNpZGUuXG5cdFx0bGV0IHMgPSBNYXRoLm1heChzdGFydCwgYmxrW2Zyb21TXSk7XG5cdFx0bGV0IGUgPSBNYXRoLm1pbihlbmQsIGJsa1tmcm9tRV0pO1xuXHRcdC8vIGNvb3JkIHJhbmdlIG9uIHRoZSB0byBzaWRlLlxuXHRcdGxldCBzMiA9IE1hdGguY2VpbChibGtbbWFwcGVyXShzKSk7XG5cdFx0bGV0IGUyID0gTWF0aC5mbG9vcihibGtbbWFwcGVyXShlKSk7XG5cdCAgICAgICAgcmV0dXJuIHtcblx0XHQgICAgY2hyOiAgIGJsa1t0b0NdLFxuXHRcdCAgICBzdGFydDogTWF0aC5taW4oczIsZTIpLFxuXHRcdCAgICBlbmQ6ICAgTWF0aC5tYXgoczIsZTIpLFxuXHRcdCAgICBvcmk6ICAgYmxrLmJsb2NrT3JpLFxuXHRcdCAgICBpbmRleDogYmxrW3RvSV0sXG5cdFx0ICAgIC8vIGFsc28gcmV0dXJuIHRoZSBmcm9tR2Vub21lIGNvb3JkaW5hdGVzIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyBwaWVjZSBvZiB0aGUgdHJhbnNsYXRpb25cblx0XHQgICAgZkNocjogICBibGtbZnJvbUNdLFxuXHRcdCAgICBmU3RhcnQ6IHMsXG5cdFx0ICAgIGZFbmQ6ICAgZSxcblx0XHQgICAgZkluZGV4OiBibGtbZnJvbUldLFxuXHRcdCAgICAvLyBpbmNsdWRlIHRoZSBibG9jayBpZCBhbmQgZnVsbCBibG9jayBjb29yZHNcblx0XHQgICAgYmxvY2tJZDogYmxrLmJsb2NrSWQsXG5cdFx0ICAgIGJsb2NrU3RhcnQ6IGJsa1t0b1NdLFxuXHRcdCAgICBibG9ja0VuZDogYmxrW3RvRV1cblx0XHR9O1xuXHQgICAgfSlcblx0Ly8gXG5cdHJldHVybiBibGtzO1xuICAgIH1cbiAgICAvLyBHaXZlbiBhIGdlbm9tZSAoZWl0aGVyIHRoZSBhIG9yIGIgZ2Vub21lKVxuICAgIC8vIHJldHVybnMgdGhlIGJsb2NrcyBmb3IgdHJhbnNsYXRpbmcgdG8gdGhlIG90aGVyIChiIG9yIGEpIGdlbm9tZS5cbiAgICAvL1xuICAgIGdldEJsb2NrcyAoZnJvbUdlbm9tZSkge1xuXHQvLyBmcm9tID0gXCJhXCIgb3IgXCJiXCIsIGRlcGVuZGluZyBvbiB3aGljaCBnZW5vbWUgaXMgZ2l2ZW4uXG4gICAgICAgIGxldCBmcm9tID0gKGZyb21HZW5vbWUgPT09IHRoaXMuYUdlbm9tZSA/IFwiYVwiIDogZnJvbUdlbm9tZSA9PT0gdGhpcy5iR2Vub21lID8gXCJiXCIgOiBudWxsKTtcblx0aWYgKCFmcm9tKSB0aHJvdyBcIkJhZCBhcmd1bWVudC4gR2Vub21lIG5laXRoZXIgQSBub3IgQi5cIjtcblx0Ly8gdG8gPSBcImJcIiBvciBcImFcIiwgb3Bwb3NpdGUgb2YgZnJvbVxuXHRsZXQgdG8gPSAoZnJvbSA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcblx0Ly8gbWFrZSBzdXJlIHRoZSBibG9ja3MgYXJlIHNvcnRlZCBieSB0aGUgZnJvbSBnZW5vbWVcblx0dGhpcy5zZXRTb3J0KGZyb20pO1xuXHQvL1xuXHRsZXQgZnJvbUMgPSBmcm9tK1wiQ2hyXCI7XG5cdGxldCBmcm9tUyA9IGZyb20rXCJTdGFydFwiO1xuXHRsZXQgZnJvbUUgPSBmcm9tK1wiRW5kXCI7XG5cdGxldCB0b0MgPSB0bytcIkNoclwiO1xuXHRsZXQgdG9TID0gdG8rXCJTdGFydFwiO1xuXHRsZXQgdG9FID0gdG8rXCJFbmRcIjtcblx0bGV0IG1hcHBlciA9IGZyb20rdG8rXCJNYXBcIjtcblx0Ly8gXG5cdGxldCBibGtzID0gdGhpcy5ibG9ja3Ncblx0ICAgIC5tYXAoYmxrID0+IHtcblx0ICAgICAgICByZXR1cm4ge1xuXHRcdCAgICBibG9ja0lkOiAgIGJsay5ibG9ja0lkLFxuXHRcdCAgICBvcmk6ICAgICAgIGJsay5ibG9ja09yaSxcblx0XHQgICAgZnJvbUNocjogICBibGtbZnJvbUNdLFxuXHRcdCAgICBmcm9tU3RhcnQ6IGJsa1tmcm9tU10sXG5cdFx0ICAgIGZyb21FbmQ6ICAgYmxrW2Zyb21FXSxcblx0XHQgICAgdG9DaHI6ICAgICBibGtbdG9DXSxcblx0XHQgICAgdG9TdGFydDogICBibGtbdG9TXSxcblx0XHQgICAgdG9FbmQ6ICAgICBibGtbdG9FXSxcblx0XHR9O1xuXHQgICAgfSlcblx0Ly8gXG5cdHJldHVybiBibGtzO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgQmxvY2tUcmFuc2xhdG9yIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9CbG9ja1RyYW5zbGF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFNWR1ZpZXcgfSBmcm9tICcuL1NWR1ZpZXcnO1xuaW1wb3J0IHsgY29vcmRzQWZ0ZXJUcmFuc2Zvcm0gfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBHZW5vbWVWaWV3IGV4dGVuZHMgU1ZHVmlldyB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0KTtcblx0dGhpcy5vcGVuV2lkdGggPSB0aGlzLm91dGVyV2lkdGg7XG5cdHRoaXMub3BlbkhlaWdodD0gdGhpcy5vdXRlckhlaWdodDtcblx0dGhpcy50b3RhbENocldpZHRoID0gNDA7IC8vIHRvdGFsIHdpZHRoIG9mIG9uZSBjaHJvbW9zb21lIChiYWNrYm9uZStibG9ja3MrZmVhdHMpXG5cdHRoaXMuY3dpZHRoID0gMjA7ICAgICAgICAvLyBjaHJvbW9zb21lIHdpZHRoXG5cdHRoaXMudGlja0xlbmd0aCA9IDEwO1x0IC8vIGZlYXR1cmUgdGljayBtYXJrIGxlbmd0aFxuXHR0aGlzLmJydXNoQ2hyID0gbnVsbDtcdCAvLyB3aGljaCBjaHIgaGFzIHRoZSBjdXJyZW50IGJydXNoXG5cdHRoaXMuYndpZHRoID0gdGhpcy5jd2lkdGgvMjsgIC8vIGJsb2NrIHdpZHRoXG5cdHRoaXMuY3VyckJsb2NrcyA9IG51bGw7XG5cdHRoaXMuY3VyclRpY2tzID0gbnVsbDtcblx0dGhpcy5nQ2hyb21vc29tZXMgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCdnJykuYXR0cihcIm5hbWVcIiwgXCJjaHJvbW9zb21lc1wiKTtcblx0dGhpcy50aXRsZSAgICA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ3RleHQnKS5hdHRyKFwiY2xhc3NcIiwgXCJ0aXRsZVwiKTtcblx0dGhpcy5zY3JvbGxBbW91bnQgPSAwO1xuXHQvL1xuXHR0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZml0VG9XaWR0aCAodyl7XG4gICAgICAgIHN1cGVyLmZpdFRvV2lkdGgodyk7XG5cdHRoaXMub3BlbldpZHRoID0gdGhpcy5vdXRlcldpZHRoO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RG9tICgpIHtcblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbi5jbG9zZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4gdGhpcy5yZWRyYXcoKSk7XG5cdHRoaXMuc3ZnLm9uKFwid2hlZWxcIiwgKCkgPT4ge1xuXHQgICAgaWYgKCF0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiKSkgcmV0dXJuO1xuXHQgICAgdGhpcy5zY3JvbGxXaGVlbChkMy5ldmVudC5kZWx0YVkpXG5cdCAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9KTtcblx0bGV0IHNicyA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwic3ZnY29udGFpbmVyXCJdID4gW25hbWU9XCJzY3JvbGxidXR0b25zXCJdJylcblx0c2JzLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwidXBcIl0nKS5vbihcImNsaWNrXCIsICgpID0+IHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNVcCgpKTtcblx0c2JzLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZG5cIl0nKS5vbihcImNsaWNrXCIsICgpID0+IHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNEb3duKCkpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldEJydXNoQ29vcmRzIChjb29yZHMpIHtcblx0dGhpcy5jbGVhckJydXNoZXMoKTtcblx0dGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0KGAuY2hyb21vc29tZVtuYW1lPVwiJHtjb29yZHMuY2hyfVwiXSBnW25hbWU9XCJicnVzaFwiXWApXG5cdCAgLmVhY2goZnVuY3Rpb24oY2hyKXtcblx0ICAgIGNoci5icnVzaC5leHRlbnQoW2Nvb3Jkcy5zdGFydCxjb29yZHMuZW5kXSk7XG5cdCAgICBjaHIuYnJ1c2goZDMuc2VsZWN0KHRoaXMpKTtcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJydXNoc3RhcnQgKGNocil7XG5cdHRoaXMuY2xlYXJCcnVzaGVzKGNoci5icnVzaCk7XG5cdHRoaXMuYnJ1c2hDaHIgPSBjaHI7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYnJ1c2hlbmQgKCl7XG5cdGlmKCF0aGlzLmJydXNoQ2hyKSByZXR1cm47XG5cdHZhciB4dG50ID0gdGhpcy5icnVzaENoci5icnVzaC5leHRlbnQoKTtcblx0aWYgKE1hdGguYWJzKHh0bnRbMF0gLSB4dG50WzFdKSA8PSAxMCl7XG5cdCAgICAvLyB1c2VyIGNsaWNrZWRcblx0ICAgIGxldCBjeHQgPSB0aGlzLmFwcC5nZXRDb250ZXh0KClcblx0ICAgIGxldCB3ID0gY3h0LmVuZCAtIGN4dC5zdGFydCArIDE7XG5cdCAgICB4dG50WzBdIC09IHcvMjtcblx0ICAgIHh0bnRbMV0gKz0gdy8yO1xuXHR9XG5cdGxldCBjb29yZHMgPSB7IGNocjp0aGlzLmJydXNoQ2hyLm5hbWUsIHN0YXJ0Ok1hdGguZmxvb3IoeHRudFswXSksIGVuZDogTWF0aC5mbG9vcih4dG50WzFdKSB9O1xuXHR0aGlzLmFwcC5zZXRDb250ZXh0KGNvb3Jkcyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJCcnVzaGVzIChleGNlcHQpe1xuXHR0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoJ1tuYW1lPVwiYnJ1c2hcIl0nKS5lYWNoKGZ1bmN0aW9uKGNocil7XG5cdCAgICBpZiAoY2hyLmJydXNoICE9PSBleGNlcHQpIHtcblx0XHRjaHIuYnJ1c2guY2xlYXIoKTtcblx0XHRjaHIuYnJ1c2goZDMuc2VsZWN0KHRoaXMpKTtcblx0ICAgIH1cblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0WCAoY2hyKSB7XG5cdGxldCB4ID0gdGhpcy5hcHAuckdlbm9tZS54c2NhbGUoY2hyKTtcblx0aWYgKGlzTmFOKHgpKSB0aHJvdyBcInggaXMgTmFOXCJcblx0cmV0dXJuIHg7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldFkgKHBvcykge1xuXHRsZXQgeSA9IHRoaXMuYXBwLnJHZW5vbWUueXNjYWxlKHBvcyk7XG5cdGlmIChpc05hTih5KSkgdGhyb3cgXCJ5IGlzIE5hTlwiXG5cdHJldHVybiB5O1xuICAgIH1cbiAgICBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZWRyYXcgKCkge1xuICAgICAgICB0aGlzLmRyYXcodGhpcy5jdXJyVGlja3MsIHRoaXMuY3VyckJsb2Nrcyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZHJhdyAodGlja0RhdGEsIGJsb2NrRGF0YSkge1xuXHR0aGlzLmRyYXdDaHJvbW9zb21lcygpO1xuXHR0aGlzLmRyYXdCbG9ja3MoYmxvY2tEYXRhKTtcblx0dGhpcy5kcmF3VGlja3ModGlja0RhdGEpO1xuXHR0aGlzLmRyYXdUaXRsZSgpO1xuXHR0aGlzLnNldEJydXNoQ29vcmRzKHRoaXMuYXBwLmNvb3Jkcyk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIGNocm9tb3NvbWVzIG9mIHRoZSByZWZlcmVuY2UgZ2Vub21lLlxuICAgIC8vIEluY2x1ZGVzIGJhY2tib25lcywgbGFiZWxzLCBhbmQgYnJ1c2hlcy5cbiAgICAvLyBUaGUgYmFja2JvbmVzIGFyZSBkcmF3biBhcyB2ZXJ0aWNhbCBsaW5lIHNlbWVudHMsXG4gICAgLy8gZGlzdHJpYnV0ZWQgaG9yaXpvbnRhbGx5LiBPcmRlcmluZyBpcyBkZWZpbmVkIGJ5XG4gICAgLy8gdGhlIG1vZGVsIChHZW5vbWUgb2JqZWN0KS5cbiAgICAvLyBMYWJlbHMgYXJlIGRyYXduIGFib3ZlIHRoZSBiYWNrYm9uZXMuXG4gICAgLy9cbiAgICAvLyBNb2RpZmljYXRpb246XG4gICAgLy8gRHJhd3MgdGhlIHNjZW5lIGluIG9uZSBvZiB0d28gc3RhdGVzOiBvcGVuIG9yIGNsb3NlZC5cbiAgICAvLyBUaGUgb3BlbiBzdGF0ZSBpcyBhcyBkZXNjcmliZWQgLSBhbGwgY2hyb21vc29tZXMgc2hvd24uXG4gICAgLy8gSW4gdGhlIGNsb3NlZCBzdGF0ZTogXG4gICAgLy8gICAgICogb25seSBvbmUgY2hyb21vc29tZSBzaG93cyAodGhlIGN1cnJlbnQgb25lKVxuICAgIC8vICAgICAqIGRyYXduIGhvcml6b250YWxseSBhbmQgcG9zaXRpb25lZCBiZXNpZGUgdGhlIFwiR2Vub21lIFZpZXdcIiB0aXRsZVxuICAgIC8vXG4gICAgZHJhd0Nocm9tb3NvbWVzICgpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7IC8vIHJlZiBnZW5vbWVcblx0bGV0IHJDaHJzID0gcmcuY2hyb21vc29tZXM7XG5cbiAgICAgICAgLy8gQ2hyb21vc29tZSBncm91cHNcblx0bGV0IGNocnMgPSB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoXCIuY2hyb21vc29tZVwiKVxuXHQgICAgLmRhdGEockNocnMsIGMgPT4gYy5uYW1lKTtcblx0bGV0IG5ld2NocnMgPSBjaHJzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBcImNocm9tb3NvbWVcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBjID0+IGMubmFtZSk7XG5cdFxuXHRuZXdjaHJzLmFwcGVuZChcInRleHRcIikuYXR0cihcIm5hbWVcIixcImxhYmVsXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImxpbmVcIikuYXR0cihcIm5hbWVcIixcImJhY2tib25lXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIixcInN5bkJsb2Nrc1wiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJ0aWNrc1wiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJicnVzaFwiKTtcblxuXG5cdGxldCBjbG9zZWQgPSB0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiKTtcblx0aWYgKGNsb3NlZCkge1xuXHQgICAgLy8gUmVzZXQgdGhlIFNWRyBzaXplIHRvIGJlIDEtY2hyb21vc29tZSB3aWRlLlxuXHQgICAgLy8gVHJhbnNsYXRlIHRoZSBjaHJvbW9zb21lcyBncm91cCBzbyB0aGF0IHRoZSBjdXJyZW50IGNocm9tb3NvbWUgYXBwZWFycyBpbiB0aGUgc3ZnIGFyZWEuXG5cdCAgICAvLyBUdXJuIGl0IDkwIGRlZy5cblxuXHQgICAgLy8gU2V0IHRoZSBoZWlnaHQgb2YgdGhlIFNWRyBhcmVhIHRvIDEgY2hyb21vc29tZSdzIHdpZHRoXG5cdCAgICB0aGlzLnNldEdlb20oeyBoZWlnaHQ6IHRoaXMudG90YWxDaHJXaWR0aCwgcm90YXRpb246IC05MCwgdHJhbnNsYXRpb246IFstdGhpcy50b3RhbENocldpZHRoLzIsMzBdIH0pO1xuXHQgICAgLy8gXG5cdCAgICBsZXQgZGVsdGEgPSAxMDtcblx0ICAgIHJnLnhzY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuXHRcdCAuZG9tYWluKHJDaHJzLm1hcChmdW5jdGlvbih4KXtyZXR1cm4geC5uYW1lO30pKVxuXHRcdCAvLyBpbiBjbG9zZWQgbW9kZSwgdGhlIGNocm9tb3NvbWVzIGhhdmUgZml4ZWQgc3BhY2luZ1xuXHRcdCAucmFuZ2VQb2ludHMoW2RlbHRhLCBkZWx0YSt0aGlzLnRvdGFsQ2hyV2lkdGgqKHJDaHJzLmxlbmd0aC0xKV0pO1xuXHQgICAgLy9cblx0ICAgIHJnLnlzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0IC5kb21haW4oWzEscmcubWF4bGVuXSlcblx0XHQgLnJhbmdlKFswLCB0aGlzLndpZHRoXSk7XG5cblx0ICAgIC8vIHRyYW5zbGF0ZSBlYWNoIGNocm9tb3NvbWUgaW50byBwb3NpdGlvblxuXHQgICAgY2hycy5hdHRyKFwidHJhbnNmb3JtXCIsIGMgPT4gYHRyYW5zbGF0ZSgke3JnLnhzY2FsZShjLm5hbWUpfSwgMClgKTtcbiAgICAgICAgICAgIC8vIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oLXJnLnhzY2FsZSh0aGlzLmFwcC5jb29yZHMuY2hyKSk7XG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgLy8gV2hlbiBvcGVuLCBkcmF3IGFsbCB0aGUgY2hyb21vc29tZXMuIEVhY2ggY2hyb20gaXMgYSB2ZXJ0aWNhbCBsaW5lLlxuXHQgICAgLy8gQ2hyb21zIGFyZSBkaXN0cmlidXRlZCBldmVubHkgYWNyb3NzIHRoZSBhdmFpbGFibGUgaG9yaXpvbnRhbCBzcGFjZS5cblx0ICAgIHRoaXMuc2V0R2VvbSh7IHdpZHRoOiB0aGlzLm9wZW5XaWR0aCwgaGVpZ2h0OiB0aGlzLm9wZW5IZWlnaHQsIHJvdGF0aW9uOiAwLCB0cmFuc2xhdGlvbjogWzAsMF0gfSk7XG5cdCAgICAvLyBcblx0ICAgIHJnLnhzY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuXHRcdCAuZG9tYWluKHJDaHJzLm1hcChmdW5jdGlvbih4KXtyZXR1cm4geC5uYW1lO30pKVxuXHRcdCAvLyBpbiBjbG9zZWQgbW9kZSwgdGhlIGNocm9tb3NvbWVzIHNwcmVhZCB0byBmaWxsIHRoZSBzcGFjZVxuXHRcdCAucmFuZ2VQb2ludHMoWzAsIHRoaXMub3BlbldpZHRoIC0gMzBdLCAwLjUpO1xuXHQgICAgcmcueXNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQgLmRvbWFpbihbMSxyZy5tYXhsZW5dKVxuXHRcdCAucmFuZ2UoWzAsIHRoaXMuaGVpZ2h0XSk7XG5cblx0ICAgIC8vIHRyYW5zbGF0ZSBlYWNoIGNocm9tb3NvbWUgaW50byBwb3NpdGlvblxuXHQgICAgY2hycy5hdHRyKFwidHJhbnNmb3JtXCIsIGMgPT4gYHRyYW5zbGF0ZSgke3JnLnhzY2FsZShjLm5hbWUpfSwgMClgKTtcbiAgICAgICAgICAgIC8vIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oMCk7XG5cdH1cblxuXHRyQ2hycy5mb3JFYWNoKGNociA9PiB7XG5cdCAgICB2YXIgc2MgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdC5kb21haW4oWzEsY2hyLmxlbmd0aF0pXG5cdFx0LnJhbmdlKFswLCByZy55c2NhbGUoY2hyLmxlbmd0aCldKTtcblx0ICAgIGNoci5icnVzaCA9IGQzLnN2Zy5icnVzaCgpLnkoc2MpXG5cdCAgICAgICAub24oXCJicnVzaHN0YXJ0XCIsIGNociA9PiB0aGlzLmJydXNoc3RhcnQoY2hyKSlcblx0ICAgICAgIC5vbihcImJydXNoZW5kXCIsICgpID0+IHRoaXMuYnJ1c2hlbmQoKSk7XG5cdCAgfSwgdGhpcyk7XG5cblxuICAgICAgICBjaHJzLnNlbGVjdCgnW25hbWU9XCJsYWJlbFwiXScpXG5cdCAgICAudGV4dChjPT5jLm5hbWUpXG5cdCAgICAuYXR0cihcInhcIiwgMCkgXG5cdCAgICAuYXR0cihcInlcIiwgLTIpXG5cdCAgICA7XG5cblx0Y2hycy5zZWxlY3QoJ1tuYW1lPVwiYmFja2JvbmVcIl0nKVxuXHQgICAgLmF0dHIoXCJ4MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ5MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ4MlwiLCAwKVxuXHQgICAgLmF0dHIoXCJ5MlwiLCBjID0+IHJnLnlzY2FsZShjLmxlbmd0aCkpXG5cdCAgICA7XG5cdCAgIFxuXHRjaHJzLnNlbGVjdCgnW25hbWU9XCJicnVzaFwiXScpXG5cdCAgICAuZWFjaChmdW5jdGlvbihkKXtkMy5zZWxlY3QodGhpcykuY2FsbChkLmJydXNoKTt9KVxuXHQgICAgLnNlbGVjdEFsbCgncmVjdCcpXG5cdCAgICAgLmF0dHIoJ3dpZHRoJywxMClcblx0ICAgICAuYXR0cigneCcsIC01KVxuXHQgICAgO1xuXG5cdGNocnMuZXhpdCgpLnJlbW92ZSgpO1xuXHRcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTY3JvbGwgd2hlZWwgZXZlbnQgaGFuZGxlci5cbiAgICBzY3JvbGxXaGVlbCAoZHkpIHtcblx0Ly8gQWRkIGR5IHRvIHRvdGFsIHNjcm9sbCBhbW91bnQuIFRoZW4gdHJhbnNsYXRlIHRoZSBjaHJvbW9zb21lcyBncm91cC5cblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc0J5KGR5KTtcblx0Ly8gQWZ0ZXIgYSAyMDAgbXMgcGF1c2UgaW4gc2Nyb2xsaW5nLCBzbmFwIHRvIG5lYXJlc3QgY2hyb21vc29tZVxuXHR0aGlzLnRvdXQgJiYgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRvdXQpO1xuXHR0aGlzLnRvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKT0+dGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKSwgMjAwKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNUbyAoeCkge1xuICAgICAgICBpZiAoeCA9PT0gdW5kZWZpbmVkKSB4ID0gdGhpcy5zY3JvbGxBbW91bnQ7XG5cdHRoaXMuc2Nyb2xsQW1vdW50ID0gTWF0aC5tYXgoTWF0aC5taW4oeCwxNSksIC10aGlzLnRvdGFsQ2hyV2lkdGggKiAodGhpcy5hcHAuckdlbm9tZS5jaHJvbW9zb21lcy5sZW5ndGgtMSkpO1xuXHR0aGlzLmdDaHJvbW9zb21lcy5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHt0aGlzLnNjcm9sbEFtb3VudH0sMClgKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNCeSAoZHgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKHRoaXMuc2Nyb2xsQW1vdW50ICsgZHgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc1NuYXAgKCkge1xuXHRsZXQgaSA9IE1hdGgucm91bmQodGhpcy5zY3JvbGxBbW91bnQgLyB0aGlzLnRvdGFsQ2hyV2lkdGgpXG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbyhpKnRoaXMudG90YWxDaHJXaWR0aCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzVXAgKCkge1xuICAgICAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzQnkoLXRoaXMudG90YWxDaHJXaWR0aCk7XG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzRG93biAoKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNCeSh0aGlzLnRvdGFsQ2hyV2lkdGgpO1xuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3VGl0bGUgKCkge1xuXHRsZXQgcmVmZyA9IHRoaXMuYXBwLnJHZW5vbWUubGFiZWw7XG5cdGxldCBibG9ja2cgPSB0aGlzLmN1cnJCbG9ja3MgPyBcblx0ICAgIHRoaXMuY3VyckJsb2Nrcy5jb21wICE9PSB0aGlzLmFwcC5yR2Vub21lID9cblx0ICAgICAgICB0aGlzLmN1cnJCbG9ja3MuY29tcC5sYWJlbFxuXHRcdDpcblx0XHRudWxsXG5cdCAgICA6XG5cdCAgICBudWxsO1xuXHRsZXQgbHN0ID0gdGhpcy5hcHAuY3Vyckxpc3QgPyB0aGlzLmFwcC5jdXJyTGlzdC5uYW1lIDogbnVsbDtcblxuXHR0aGlzLnJvb3Quc2VsZWN0KFwibGFiZWwgc3Bhbi50aXRsZVwiKS50ZXh0KHJlZmcpO1xuXG5cdGxldCBsaW5lcyA9IFtdO1xuXHRibG9ja2cgJiYgbGluZXMucHVzaChgQmxvY2tzIHZzLiAke2Jsb2NrZ31gKTtcblx0bHN0ICYmIGxpbmVzLnB1c2goYEZlYXR1cmVzIGZyb20gbGlzdCBcIiR7bHN0fVwiYCk7XG5cdGxldCBzdWJ0ID0gbGluZXMuam9pbihcIiA6OiBcIik7XG5cdHRoaXMucm9vdC5zZWxlY3QoXCJsYWJlbCBzcGFuLnN1YnRpdGxlXCIpLnRleHQoKHN1YnQgPyBcIjo6IFwiIDogXCJcIikgKyBzdWJ0KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgb3V0bGluZXMgb2Ygc3ludGVueSBibG9ja3Mgb2YgdGhlIHJlZiBnZW5vbWUgdnMuXG4gICAgLy8gdGhlIGdpdmVuIGdlbm9tZS5cbiAgICAvLyBQYXNzaW5nIG51bGwgZXJhc2VzIGFsbCBzeW50ZW55IGJsb2Nrcy5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgIGRhdGEgPT0geyByZWY6R2Vub21lLCBjb21wOkdlbm9tZSwgYmxvY2tzOiBsaXN0IG9mIHN5bnRlbnkgYmxvY2tzIH1cbiAgICAvLyAgICBFYWNoIHNibG9jayA9PT0geyBibG9ja0lkOmludCwgb3JpOisvLSwgZnJvbUNociwgZnJvbVN0YXJ0LCBmcm9tRW5kLCB0b0NociwgdG9TdGFydCwgdG9FbmQgfVxuICAgIGRyYXdCbG9ja3MgKGRhdGEpIHtcblx0Ly9cbiAgICAgICAgbGV0IHNiZ3JwcyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpLnNlbGVjdCgnW25hbWU9XCJzeW5CbG9ja3NcIl0nKTtcblx0aWYgKCFkYXRhIHx8ICFkYXRhLmJsb2NrcyB8fCBkYXRhLmJsb2Nrcy5sZW5ndGggPT09IDApIHtcblx0ICAgIHRoaXMuY3VyckJsb2NrcyA9IG51bGw7XG5cdCAgICBzYmdycHMuaHRtbCgnJyk7XG5cdCAgICB0aGlzLmRyYXdUaXRsZSgpO1xuXHQgICAgcmV0dXJuO1xuXHR9XG5cdHRoaXMuY3VyckJsb2NrcyA9IGRhdGE7XG5cdC8vIHJlb3JnYW5pemUgZGF0YSB0byByZWZsZWN0IFNWRyBzdHJ1Y3R1cmUgd2Ugd2FudCwgaWUsIGdyb3VwZWQgYnkgY2hyb21vc29tZVxuICAgICAgICBsZXQgZHggPSBkYXRhLmJsb2Nrcy5yZWR1Y2UoKGEsc2IpID0+IHtcblx0XHRpZiAoIWFbc2IuZnJvbUNocl0pIGFbc2IuZnJvbUNocl0gPSBbXTtcblx0XHRhW3NiLmZyb21DaHJdLnB1c2goc2IpO1xuXHRcdHJldHVybiBhO1xuXHQgICAgfSwge30pO1xuXHRzYmdycHMuZWFjaChmdW5jdGlvbihjKXtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5kYXR1bSh7Y2hyOiBjLm5hbWUsIGJsb2NrczogZHhbYy5uYW1lXSB8fCBbXSB9KTtcblx0fSk7XG5cblx0bGV0IGJ3aWR0aCA9IDEwO1xuICAgICAgICBsZXQgc2Jsb2NrcyA9IHNiZ3Jwcy5zZWxlY3RBbGwoJ3JlY3Quc2Jsb2NrJykuZGF0YShiPT5iLmJsb2Nrcyk7XG4gICAgICAgIGxldCBuZXdicyA9IHNibG9ja3MuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsJ3NibG9jaycpO1xuXHRzYmxvY2tzXG5cdCAgICAuYXR0cihcInhcIiwgLWJ3aWR0aC8yIClcblx0ICAgIC5hdHRyKFwieVwiLCBiID0+IHRoaXMuZ2V0WShiLmZyb21TdGFydCkpXG5cdCAgICAuYXR0cihcIndpZHRoXCIsIGJ3aWR0aClcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGIgPT4gTWF0aC5tYXgoMCx0aGlzLmdldFkoYi5mcm9tRW5kIC0gYi5mcm9tU3RhcnQgKyAxKSkpXG5cdCAgICAuY2xhc3NlZChcImludmVyc2lvblwiLCBiID0+IGIub3JpID09PSBcIi1cIilcblx0ICAgIC5jbGFzc2VkKFwidHJhbnNsb2NhdGlvblwiLCBiID0+IGIuZnJvbUNociAhPT0gYi50b0Nocilcblx0ICAgIDtcblxuICAgICAgICBzYmxvY2tzLmV4aXQoKS5yZW1vdmUoKTtcblxuXHR0aGlzLmRyYXdUaXRsZSgpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRyYXdUaWNrcyAoZmVhdHVyZXMpIHtcblx0dGhpcy5jdXJyVGlja3MgPSBmZWF0dXJlcztcblx0bGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTsgLy8gcmVmIGdlbm9tZVxuXHQvLyBmZWF0dXJlIHRpY2sgbWFya3Ncblx0aWYgKCFmZWF0dXJlcyB8fCBmZWF0dXJlcy5sZW5ndGggPT09IDApIHtcblx0ICAgIHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbCgnW25hbWU9XCJ0aWNrc1wiXScpLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpLnJlbW92ZSgpO1xuXHQgICAgcmV0dXJuO1xuXHR9XG5cblx0Ly9cblx0bGV0IHRHcnBzID0gdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKFwiLmNocm9tb3NvbWVcIikuc2VsZWN0KCdbbmFtZT1cInRpY2tzXCJdJyk7XG5cblx0Ly8gZ3JvdXAgZmVhdHVyZXMgYnkgY2hyb21vc29tZVxuICAgICAgICBsZXQgZml4ID0gZmVhdHVyZXMucmVkdWNlKChhLGYpID0+IHsgXG5cdCAgICBpZiAoISBhW2YuY2hyXSkgYVtmLmNocl0gPSBbXTtcblx0ICAgIGFbZi5jaHJdLnB1c2goZik7XG5cdCAgICByZXR1cm4gYTtcblx0fSwge30pXG5cdHRHcnBzLmVhY2goZnVuY3Rpb24oYykge1xuXHQgICAgZDMuc2VsZWN0KHRoaXMpLmRhdHVtKCB7IGNocjogYywgZmVhdHVyZXM6IGZpeFtjLm5hbWVdICB8fCBbXX0gKTtcblx0fSk7XG5cblx0Ly8gdGhlIHRpY2sgZWxlbWVudHNcbiAgICAgICAgbGV0IGZlYXRzID0gdEdycHMuc2VsZWN0QWxsKFwiLmZlYXR1cmVcIilcblx0ICAgIC5kYXRhKGQgPT4gZC5mZWF0dXJlcywgZCA9PiBkLm1ncGlkKTtcblx0Ly9cblx0bGV0IHhBZGogPSBmID0+IChmLnN0cmFuZCA9PT0gXCIrXCIgPyB0aGlzLnRpY2tMZW5ndGggOiAtdGhpcy50aWNrTGVuZ3RoKTtcblx0Ly9cblx0bGV0IHNoYXBlID0gXCJjaXJjbGVcIjsgIC8vIFwiY2lyY2xlXCIgb3IgXCJsaW5lXCJcblx0Ly9cblx0ZmVhdHMuZW50ZXIoKVxuXHQgICAgLmFwcGVuZChzaGFwZSlcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImZlYXR1cmVcIilcblx0ICAgIC5hcHBlbmQoXCJ0aXRsZVwiKVxuXHQgICAgLnRleHQoZj0+Zi5zeW1ib2wgfHwgZi5pZCk7XG5cdGlmIChzaGFwZSA9PT0gXCJsaW5lXCIpIHtcblx0ICAgIGZlYXRzLmF0dHIoXCJ4MVwiLCBmID0+IHhBZGooZikgKyA1KVxuXHQgICAgZmVhdHMuYXR0cihcInkxXCIsIGYgPT4gcmcueXNjYWxlKGYuc3RhcnQpKVxuXHQgICAgZmVhdHMuYXR0cihcIngyXCIsIGYgPT4geEFkaihmKSArIHRoaXMudGlja0xlbmd0aCArIDUpXG5cdCAgICBmZWF0cy5hdHRyKFwieTJcIiwgZiA9PiByZy55c2NhbGUoZi5zdGFydCkpXG5cdH1cblx0ZWxzZSB7XG5cdCAgICBmZWF0cy5hdHRyKFwiY3hcIiwgZiA9PiB4QWRqKGYpKVxuXHQgICAgZmVhdHMuYXR0cihcImN5XCIsIGYgPT4gcmcueXNjYWxlKGYuc3RhcnQpKVxuXHQgICAgZmVhdHMuYXR0cihcInJcIiwgIHRoaXMudGlja0xlbmd0aCAvIDIpO1xuXHR9XG5cdC8vXG5cdGZlYXRzLmV4aXQoKS5yZW1vdmUoKVxuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEdlbm9tZVZpZXdcblxuZXhwb3J0IHsgR2Vub21lVmlldyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvR2Vub21lVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuXG5jbGFzcyBGZWF0dXJlRGV0YWlscyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0KSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0KTtcblx0dGhpcy5pbml0RG9tICgpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXREb20gKCkge1xuXHQvL1xuXHR0aGlzLnJvb3Quc2VsZWN0IChcIi5idXR0b24uY2xvc2VcIilcblx0ICAgIC5vbihcImNsaWNrLmV4dHJhXCIsICgpID0+IHRoaXMudXBkYXRlKCkpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgdXBkYXRlKGYpIHtcblx0Ly8gaWYgY2FsbGVkIHdpdGggbm8gYXJncywgdXBkYXRlIHVzaW5nIHRoZSBwcmV2aW91cyBmZWF0dXJlXG5cdGYgPSBmIHx8IHRoaXMubGFzdEZlYXR1cmU7XG5cdGlmICghZikge1xuXHQgICAvLyBGSVhNRTogbWFqb3IgcmVhY2hvdmVyIGluIHRoaXMgc2VjdGlvblxuXHQgICAvL1xuXHQgICAvLyBmYWxsYmFjay4gdGFrZSB0aGUgZmlyc3QgaGlnaGxpZ2h0ZWQuXG5cdCAgIGxldCByID0gdGhpcy5hcHAuem9vbVZpZXcuc3ZnTWFpbi5zZWxlY3QoXCJyZWN0LmZlYXR1cmUuaGlnaGxpZ2h0XCIpWzBdWzBdO1xuXHQgICAvLyBmYWxsYmFjay4gdGFrZSB0aGUgZmlyc3QgZmVhdHVyZVxuXHQgICBpZiAoIXIpIHIgPSB0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcInJlY3QuZmVhdHVyZVwiKVswXVswXTtcblx0ICAgaWYgKHIpIGYgPSByLl9fZGF0YV9fO1xuXHR9XG5cdC8vIHJlbWVtYmVyXG4gICAgICAgIGlmICghZikgdGhyb3cgXCJDYW5ub3QgdXBkYXRlIGZlYXR1cmUgZGV0YWlscy4gTm8gZmVhdHVyZS5cIjtcblx0dGhpcy5sYXN0RmVhdHVyZSA9IGY7XG5cblx0Ly8gbGlzdCBvZiBmZWF0dXJlcyB0byBzaG93IGluIGRldGFpbHMgYXJlYS5cblx0Ly8gdGhlIGdpdmVuIGZlYXR1cmUgYW5kIGFsbCBlcXVpdmFsZW50cyBpbiBvdGhlciBnZW5vbWVzLlxuXHRsZXQgZmxpc3QgPSBbZl07XG5cdGlmIChmLm1naWlkKSB7XG5cdCAgICAvLyBGSVhNRTogcmVhY2hvdmVyXG5cdCAgICBmbGlzdCA9IHRoaXMuYXBwLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlNZ2lJZChmLm1naWlkKTtcblx0fVxuXHQvLyBHb3QgdGhlIGxpc3QuIE5vdyBvcmRlciBpdCB0aGUgc2FtZSBhcyB0aGUgZGlzcGxheWVkIGdlbm9tZXNcblx0Ly8gYnVpbGQgaW5kZXggb2YgZ2Vub21lIG5hbWUgLT4gZmVhdHVyZSBpbiBmbGlzdFxuXHRsZXQgaXggPSBmbGlzdC5yZWR1Y2UoKGFjYyxmKSA9PiB7IGFjY1tmLmdlbm9tZS5uYW1lXSA9IGY7IHJldHVybiBhY2M7IH0sIHt9KVxuXHRsZXQgZ2Vub21lT3JkZXIgPSAoW3RoaXMuYXBwLnJHZW5vbWVdLmNvbmNhdCh0aGlzLmFwcC5jR2Vub21lcykpO1xuXHRmbGlzdCA9IGdlbm9tZU9yZGVyLm1hcChnID0+IGl4W2cubmFtZV0gfHwgbnVsbCk7XG5cdC8vXG5cdGxldCBjb2xIZWFkZXJzID0gW1xuXHQgICAgLy8gY29sdW1ucyBoZWFkZXJzIGFuZCB0aGVpciAlIHdpZHRoc1xuXHQgICAgW1wiR2Vub21lXCIgICAgICw5XSxcblx0ICAgIFtcIk1HUCBpZFwiICAgICAsMTddLFxuXHQgICAgW1wiVHlwZVwiICAgICAgICwxMC41XSxcblx0ICAgIFtcIkJpb1R5cGVcIiAgICAsMTguNV0sXG5cdCAgICBbXCJDb29yZHNcIiAgICAgLDE4XSxcblx0ICAgIFtcIkxlbmd0aFwiICAgICAsN10sXG5cdCAgICBbXCJNR0kgaWRcIiAgICAgLDEwXSxcblx0ICAgIFtcIk1HSSBzeW1ib2xcIiAsMTBdXG5cdF07XG5cdC8vIEluIHRoZSBjbG9zZWQgc3RhdGUsIG9ubHkgc2hvdyB0aGUgaGVhZGVyIGFuZCB0aGUgcm93IGZvciB0aGUgcGFzc2VkIGZlYXR1cmVcblx0aWYgKHRoaXMucm9vdC5jbGFzc2VkKCdjbG9zZWQnKSlcblx0ICAgIGZsaXN0ID0gZmxpc3QuZmlsdGVyKCAoZmYsIGkpID0+IGZmID09PSBmICk7XG5cdC8vIERyYXcgdGhlIHRhYmxlXG5cdGxldCB0ID0gdGhpcy5yb290LnNlbGVjdCgndGFibGUnKTtcblx0bGV0IHJvd3MgPSB0LnNlbGVjdEFsbCgndHInKS5kYXRhKCBbY29sSGVhZGVyc10uY29uY2F0KGZsaXN0KSApO1xuXHRyb3dzLmVudGVyKCkuYXBwZW5kKCd0cicpXG5cdCAgLm9uKFwibW91c2VlbnRlclwiLCAoZixpKSA9PiBpICE9PSAwICYmIHRoaXMuYXBwLnpvb21WaWV3LmhpZ2hsaWdodChmLCB0cnVlKSlcblx0ICAub24oXCJtb3VzZWxlYXZlXCIsIChmLGkpID0+IGkgIT09IDAgJiYgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KCkpO1xuXHQgICAgICBcblx0cm93cy5leGl0KCkucmVtb3ZlKCk7XG5cdHJvd3MuY2xhc3NlZChcImhpZ2hsaWdodFwiLCAoZmYsIGkpID0+IChpICE9PSAwICYmIGZmID09PSBmKSk7XG5cdC8vXG5cdC8vIEdpdmVuIGEgZmVhdHVyZSwgcmV0dXJucyBhIGxpc3Qgb2Ygc3RyaW5ncyBmb3IgcG9wdWxhdGluZyBhIHRhYmxlIHJvdy5cblx0Ly8gSWYgaT09PTAsIHRoZW4gZiBpcyBub3QgYSBmZWF0dXJlLCBidXQgYSBsaXN0IGNvbHVtbnMgbmFtZXMrd2lkdGhzLlxuXHQvLyBcblx0bGV0IGNlbGxEYXRhID0gZnVuY3Rpb24gKGYsIGkpIHtcblx0ICAgIGlmIChpID09PSAwKSB7XG5cdFx0cmV0dXJuIGY7XG5cdCAgICB9XG5cdCAgICBsZXQgY2VsbERhdGEgPSBbIGdlbm9tZU9yZGVyW2ktMV0ubGFiZWwsIFwiLlwiLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiwgXCIuXCIsIFwiLlwiIF07XG5cdCAgICAvLyBmIGlzIG51bGwgaWYgaXQgZG9lc24ndCBleGlzdCBmb3IgZ2Vub21lIGkgXG5cdCAgICBpZiAoZikge1xuXHRcdGxldCBsaW5rID0gXCJcIjtcblx0XHRsZXQgbWdpaWQgPSBmLm1naWlkIHx8IFwiXCI7XG5cdFx0aWYgKG1naWlkKSB7XG5cdFx0ICAgIGxldCB1cmwgPSBgaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL2FjY2Vzc2lvbi8ke21naWlkfWA7XG5cdFx0ICAgIGxpbmsgPSBgPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7dXJsfVwiPiR7bWdpaWR9PC9hPmA7XG5cdFx0fVxuXHRcdGNlbGxEYXRhID0gW1xuXHRcdCAgICBmLmdlbm9tZS5sYWJlbCxcblx0XHQgICAgZi5tZ3BpZCxcblx0XHQgICAgZi50eXBlLFxuXHRcdCAgICBmLmJpb3R5cGUsXG5cdFx0ICAgIGAke2YuY2hyfToke2Yuc3RhcnR9Li4ke2YuZW5kfSAoJHtmLnN0cmFuZH0pYCxcblx0XHQgICAgYCR7Zi5lbmQgLSBmLnN0YXJ0ICsgMX0gYnBgLFxuXHRcdCAgICBsaW5rIHx8IG1naWlkLFxuXHRcdCAgICBmLnN5bWJvbFxuXHRcdF07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gY2VsbERhdGE7XG5cdH07XG5cdGxldCBjZWxscyA9IHJvd3Muc2VsZWN0QWxsKFwidGRcIilcblx0ICAgIC5kYXRhKChmLGkpID0+IGNlbGxEYXRhKGYsaSkpO1xuXHRjZWxscy5lbnRlcigpLmFwcGVuZChcInRkXCIpO1xuXHRjZWxscy5leGl0KCkucmVtb3ZlKCk7XG5cdGNlbGxzLmh0bWwoKGQsaSxqKSA9PiB7XG5cdCAgICByZXR1cm4gaiA9PT0gMCA/IGRbMF0gOiBkXG5cdH0pXG5cdC5zdHlsZShcIndpZHRoXCIsIChkLGksaikgPT4gaiA9PT0gMCA/IGAke2RbMV19JWAgOiBudWxsKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IEZlYXR1cmVEZXRhaWxzIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlRGV0YWlscy5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgU1ZHVmlldyB9IGZyb20gJy4vU1ZHVmlldyc7XG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSAnLi9GZWF0dXJlJztcbmltcG9ydCB7IHBhcnNlQ29vcmRzLCBmb3JtYXRDb29yZHMsIGNvb3Jkc0FmdGVyVHJhbnNmb3JtLCByZW1vdmVEdXBzIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgWm9vbVZpZXcgZXh0ZW5kcyBTVkdWaWV3IHtcbiAgICAvL1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCwgaW5pdGlhbENvb3JkcywgaW5pdGlhbEhpKSB7XG4gICAgICBzdXBlcihhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAvL1xuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgLy9cbiAgICAgIHRoaXMubWluU3ZnSGVpZ2h0ID0gMjUwO1xuICAgICAgdGhpcy5ibG9ja0hlaWdodCA9IDQwO1xuICAgICAgdGhpcy50b3BPZmZzZXQgPSA0NTtcbiAgICAgIHRoaXMuZmVhdEhlaWdodCA9IDY7XHQvLyBoZWlnaHQgb2YgYSByZWN0YW5nbGUgcmVwcmVzZW50aW5nIGEgZmVhdHVyZVxuICAgICAgdGhpcy5sYW5lR2FwID0gMjtcdCAgICAgICAgLy8gc3BhY2UgYmV0d2VlbiBzd2ltIGxhbmVzXG4gICAgICB0aGlzLmxhbmVIZWlnaHQgPSB0aGlzLmZlYXRIZWlnaHQgKyB0aGlzLmxhbmVHYXA7XG4gICAgICB0aGlzLnN0cmlwSGVpZ2h0ID0gNzA7ICAgIC8vIGhlaWdodCBwZXIgZ2Vub21lIGluIHRoZSB6b29tIHZpZXdcbiAgICAgIHRoaXMuc3RyaXBHYXAgPSAyMDtcdC8vIHNwYWNlIGJldHdlZW4gc3RyaXBzXG5cbiAgICAgIC8vXG4gICAgICB0aGlzLmNvb3JkcyA9IGluaXRpYWxDb29yZHM7Ly8gY3VyciB6b29tIHZpZXcgY29vcmRzIHsgY2hyLCBzdGFydCwgZW5kIH1cbiAgICAgIC8vIElEcyBvZiBGZWF0dXJlcyB3ZSdyZSBoaWdobGlnaHRpbmcuIE1heSBiZSBtZ3BpZCAgb3IgbWdpSWRcbiAgICAgIC8vIGhpRmVhdHMgaXMgYW4gb2JqIHdob3NlIGtleXMgYXJlIHRoZSBJRHNcbiAgICAgIHRoaXMuaGlGZWF0cyA9IChpbml0aWFsSGkgfHwgW10pLnJlZHVjZSggKGEsdikgPT4geyBhW3ZdPXY7IHJldHVybiBhOyB9LCB7fSApO1xuICAgICAgLy9cbiAgICAgIHRoaXMuZmlkdWNpYWxzID0gdGhpcy5zdmcuaW5zZXJ0KFwiZ1wiLFwiOmZpcnN0LWNoaWxkXCIpIC8vIFxuICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJmaWR1Y2lhbHNcIik7XG4gICAgICB0aGlzLnN0cmlwc0dycCA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIixcInN0cmlwc1wiKTtcbiAgICAgIHRoaXMuYXhpcyA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIixcImF4aXNcIik7XG4gICAgICB0aGlzLmN4dE1lbnUgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImN4dE1lbnVcIl0nKTtcbiAgICAgIC8vXG4gICAgICB0aGlzLmRyYWdnaW5nID0gbnVsbDtcbiAgICAgIHRoaXMuZHJhZ2dlciA9IHRoaXMuZ2V0RHJhZ2dlcigpO1xuICAgICAgLy9cbiAgICAgIHRoaXMuaW5pdERvbSgpO1xuICAgIH1cbiAgICAvL1xuICAgIGluaXREb20gKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCByID0gdGhpcy5yb290O1xuXHRsZXQgYSA9IHRoaXMuYXBwO1xuXHQvL1xuXHRyLnNlbGVjdCgnLmJ1dHRvbi5jbG9zZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4gdGhpcy51cGRhdGUoKSk7XG5cblx0Ly8gem9vbSBjb250cm9sc1xuXHRyLnNlbGVjdChcIiN6b29tT3V0XCIpLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKGEuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdChcIiN6b29tSW5cIikgLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKDEvYS5kZWZhdWx0Wm9vbSkgfSk7XG5cdHIuc2VsZWN0KFwiI3pvb21PdXRNb3JlXCIpLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKDIqYS5kZWZhdWx0Wm9vbSkgfSk7XG5cdHIuc2VsZWN0KFwiI3pvb21Jbk1vcmVcIikgLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKDEvKDIqYS5kZWZhdWx0Wm9vbSkpIH0pO1xuXG5cdC8vIHBhbiBjb250cm9sc1xuXHRyLnNlbGVjdChcIiNwYW5MZWZ0XCIpIC5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEucGFuKC1hLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdChcIiNwYW5SaWdodFwiKS5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEucGFuKCthLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdChcIiNwYW5MZWZ0TW9yZVwiKSAub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigtNSphLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdChcIiNwYW5SaWdodE1vcmVcIikub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigrNSphLmRlZmF1bHRQYW4pIH0pO1xuXG5cdC8vIENyZWF0ZSBjb250ZXh0IG1lbnUuIFxuXHR0aGlzLmluaXRDb250ZXh0TWVudShbe1xuICAgICAgICAgICAgbGFiZWw6IFwiTUdJIFNOUHNcIiwgXG5cdCAgICBpY29uOiBcIm9wZW5faW5fbmV3XCIsXG5cdCAgICB0b29sdGlwOiBcIlZpZXcgU05QcyBhdCBNR0kgZm9yIHRoZSBjdXJyZW50IHN0cmFpbnMgaW4gdGhlIGN1cnJlbnQgcmVnaW9uLiAoU29tZSBzdHJhaW5zIG5vdCBhdmFpbGFibGUuKVwiLFxuXHQgICAgaGFuZGxlcjogKCk9PiB0aGlzLmFwcC5saW5rVG9NZ2lTbnBSZXBvcnQoKVxuXHR9LHtcbiAgICAgICAgICAgIGxhYmVsOiBcIk1HSSBRVExzXCIsIFxuXHQgICAgaWNvbjogIFwib3Blbl9pbl9uZXdcIixcblx0ICAgIHRvb2x0aXA6IFwiVmlldyBRVEwgYXQgTUdJIHRoYXQgb3ZlcmxhcCB0aGUgY3VycmVudCByZWdpb24uXCIsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naVFUTHMoKVxuXHR9LHtcbiAgICAgICAgICAgIGxhYmVsOiBcIk1HSSBKQnJvd3NlXCIsIFxuXHQgICAgaWNvbjogXCJvcGVuX2luX25ld1wiLFxuXHQgICAgdG9vbHRpcDogXCJPcGVuIE1HSSBKQnJvd3NlIChDNTdCTC82SiBHUkNtMzgpIHdpdGggdGhlIGN1cnJlbnQgY29vcmRpbmF0ZSByYW5nZS5cIixcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpSkJyb3dzZSgpXG5cdH1dKTtcblx0Ly8gY2xpY2sgb24gYmFja2dyb3VuZCA9PiBoaWRlIGNvbnRleHQgbWVudVxuXHR0aGlzLnJvb3Rcblx0ICAub24oXCJjbGljay5jb250ZXh0XCIsICgpID0+IHtcblx0ICAgICAgbGV0IHRndCA9IGQzLmV2ZW50LnRhcmdldDtcblx0ICAgICAgaWYgKHRndC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaVwiICYmIHRndC5pbm5lckhUTUwgPT09IFwibWVudVwiKVxuXHRcdCAgLy8gZXhjZXB0aW9uOiB0aGUgY29udGV4dCBtZW51IGJ1dHRvbiBpdHNlbGZcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgZWxzZVxuXHRcdCAgdGhpcy5oaWRlQ29udGV4dE1lbnUoKVxuXHQgIH0pO1xuXG5cdC8vXG5cdC8vXG5cdGxldCBmU2VsZWN0ID0gZnVuY3Rpb24gKGYsIHNoaWZ0LCBwcmVzZXJ2ZSkge1xuXHQgICAgbGV0IGlkID0gZi5tZ2lpZCB8fCBmLm1ncGlkO1xuXHQgICAgaWYgKHNoaWZ0KSB7XG5cdFx0aWYgKHRoaXMuaGlGZWF0c1tpZF0pXG5cdFx0ICAgIGRlbGV0ZSB0aGlzLmhpRmVhdHNbaWRdXG5cdFx0ZWxzZVxuXHRcdCAgICB0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRpZiAoIXByZXNlcnZlKSB0aGlzLmhpRmVhdHMgPSB7fTtcblx0XHR0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdH0uYmluZCh0aGlzKTtcblx0Ly9cblx0bGV0IGZNb3VzZU92ZXJIYW5kbGVyID0gZnVuY3Rpb24oZikge1xuXHRcdGlmIChkMy5ldmVudC5hbHRLZXkpIHtcblx0XHQgICAgLy8gSWYgdXNlciBpcyBob2xkaW5nIHRoZSBhbHQga2V5LCBzZWxlY3QgZXZlcnl0aGluZyB0b3VjaGVkLlxuXHRcdCAgICBmU2VsZWN0KGYsIGQzLmV2ZW50LnNoaWZ0S2V5LCB0cnVlKTtcblx0XHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0XHQgICAgLy8gRG9uJ3QgcmVnaXN0ZXIgY29udGV4dCBjaGFuZ2VzIHVudGlsIHVzZXIgaGFzIHBhdXNlZCBmb3IgYXQgbGVhc3QgMXMuXG5cdFx0ICAgIGlmICh0aGlzLnRpbWVvdXQpIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcblx0XHQgICAgdGhpcy50aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXsgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTsgfS5iaW5kKHRoaXMpLCAxMDAwKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIWQzLmV2ZW50LmN0cmxLZXkpIFxuXHRcdCAgICB0aGlzLmhpZ2hsaWdodChmKTtcblx0fS5iaW5kKHRoaXMpO1xuXHQvL1xuXHRsZXQgZk1vdXNlT3V0SGFuZGxlciA9IGZ1bmN0aW9uKGYpIHtcblx0ICAgIGlmICghZDMuZXZlbnQuY3RybEtleSlcblx0XHR0aGlzLmhpZ2hsaWdodCgpOyBcblx0fS5iaW5kKHRoaXMpO1xuXG5cdC8vIFxuICAgICAgICB0aGlzLnN2Z1xuXHQgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgbGV0IHRndCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpO1xuXHQgICAgICBsZXQgdCA9IHRndFswXVswXTtcblx0ICAgICAgaWYgKHQudGFnTmFtZSA9PSBcInJlY3RcIiAmJiB0LmNsYXNzTGlzdC5jb250YWlucyhcImZlYXR1cmVcIikpIHtcblx0XHQgIC8vIHVzZXIgY2xpY2tlZCBvbiBhIGZlYXR1cmVcblx0XHQgIGZTZWxlY3QodC5fX2RhdGFfXywgZDMuZXZlbnQuc2hpZnRLZXkpO1xuXHRcdCAgdGhpcy5oaWdobGlnaHQoKTtcblx0ICAgICAgICAgIHRoaXMuYXBwLmNvbnRleHRDaGFuZ2VkKCk7XG5cdCAgICAgIH1cblx0ICAgICAgZWxzZSBpZiAodC50YWdOYW1lID09IFwicmVjdFwiICYmIHQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYmxvY2tcIikgJiYgIWQzLmV2ZW50LnNoaWZ0S2V5KSB7XG5cdFx0ICAvLyB1c2VyIGNsaWNrZWQgb24gYSBzeW50ZW55IGJsb2NrIGJhY2tncm91bmRcblx0XHQgIHRoaXMuaGlGZWF0cyA9IHt9O1xuXHRcdCAgdGhpcy5oaWdobGlnaHQoKTtcblx0XHQgIHRoaXMuYXBwLmNvbnRleHRDaGFuZ2VkKCk7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbihcIm1vdXNlb3ZlclwiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU92ZXJIYW5kbGVyKGYpO1xuXHQgICAgICB9XG5cdCAgfSlcblx0ICAub24oXCJtb3VzZW91dFwiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU91dEhhbmRsZXIoZik7XG5cdCAgICAgIH1cblx0ICB9KTtcblxuXHQvLyBCdXR0b246IE1lbnUgaW4gem9vbSB2aWV3XG5cdHRoaXMucm9vdC5zZWxlY3QoXCIubWVudSA+IC5idXR0b25cIilcblx0ICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIC8vIHNob3cgY29udGV4dCBtZW51IGF0IG1vdXNlIGV2ZW50IGNvb3JkaW5hdGVzXG5cdCAgICAgIGxldCBjeCA9IGQzLmV2ZW50LmNsaWVudFg7XG5cdCAgICAgIGxldCBjeSA9IGQzLmV2ZW50LmNsaWVudFk7XG5cdCAgICAgIGxldCBiYiA9IGQzLnNlbGVjdCh0aGlzKVswXVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgc2VsZi5zaG93Q29udGV4dE1lbnUoY3gtYmIubGVmdCxjeS1iYi50b3ApO1xuXHQgIH0pO1xuXHQvLyB6b29tIGNvb3JkaW5hdGVzIGJveFxuXHR0aGlzLnJvb3Quc2VsZWN0KFwiI3pvb21Db29yZHNcIilcblx0ICAgIC5jYWxsKHpjcyA9PiB6Y3NbMF1bMF0udmFsdWUgPSBmb3JtYXRDb29yZHModGhpcy5jb29yZHMpKVxuXHQgICAgLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgY29vcmRzID0gcGFyc2VDb29yZHModGhpcy52YWx1ZSk7XG5cdFx0aWYgKCEgY29vcmRzKSB7XG5cdFx0ICAgIGFsZXJ0KFwiUGxlYXNlIGVudGVyIGEgY29vcmRpbmF0ZSByYW5nZSBmb3JtYXR0ZWQgYXMgJ2NocjpzdGFydC4uZW5kJy4gXCIgK1xuXHRcdCAgICAgICAgICBcIkZvciBleGFtcGxlLCAnNToxMDAwMDAwMC4uNTAwMDAwMDAnLlwiKTtcblx0XHQgICAgdGhpcy52YWx1ZSA9IFwiXCI7XG5cdFx0ICAgIHJldHVybjtcblx0XHR9XG5cdFx0c2VsZi5hcHAuc2V0Q29udGV4dChjb29yZHMpO1xuXHQgICAgfSk7XG5cdC8vIHpvb20gd2luZG93IHNpemUgYm94XG5cdHRoaXMucm9vdC5zZWxlY3QoXCIjem9vbVdTaXplXCIpXG5cdCAgICAub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgbGV0IHdzID0gcGFyc2VJbnQodGhpcy52YWx1ZSk7XG5cdFx0bGV0IGMgPSBzZWxmLmNvb3Jkcztcblx0XHRpZiAoaXNOYU4od3MpIHx8IHdzIDwgMTAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiSW52YWxpZCB3aW5kb3cgc2l6ZS4gUGxlYXNlIGVudGVyIGFuIGludGVnZXIgPj0gMTAwLlwiKTtcblx0XHQgICAgdGhpcy52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICBsZXQgbWlkID0gKGMuc3RhcnQgKyBjLmVuZCkgLyAyO1xuXHRcdCAgICBsZXQgbmV3cyA9IE1hdGgucm91bmQobWlkIC0gd3MvMik7XG5cdFx0ICAgIGxldCBuZXdlID0gbmV3cyArIHdzIC0gMTtcblx0XHQgICAgc2VsZi5hcHAuc2V0Q29udGV4dCh7XG5cdFx0ICAgICAgICBjaHI6IGMuY2hyLFxuXHRcdFx0c3RhcnQ6IG5ld3MsXG5cdFx0XHRlbmQ6IG5ld2VcblxuXHRcdCAgICB9KTtcblx0XHR9XG5cdCAgICB9KTtcblxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBkYXRhIChsaXN0IG9mIG1lbnVJdGVtIGNvbmZpZ3MpIEVhY2ggY29uZmlnIGxvb2tzIGxpa2Uge2xhYmVsOnN0cmluZywgaGFuZGxlcjogZnVuY3Rpb259XG4gICAgaW5pdENvbnRleHRNZW51IChkYXRhKSB7XG5cdHRoaXMuY3h0TWVudS5zZWxlY3RBbGwoXCIubWVudUl0ZW1cIikucmVtb3ZlKCk7IC8vIGluIGNhc2Ugb2YgcmUtaW5pdFxuICAgICAgICBsZXQgbWl0ZW1zID0gdGhpcy5jeHRNZW51XG5cdCAgLnNlbGVjdEFsbChcIi5tZW51SXRlbVwiKVxuXHQgIC5kYXRhKGRhdGEpO1xuXHRsZXQgbmV3cyA9IG1pdGVtcy5lbnRlcigpXG5cdCAgLmFwcGVuZChcImRpdlwiKVxuXHQgIC5hdHRyKFwiY2xhc3NcIiwgXCJtZW51SXRlbSBmbGV4cm93XCIpXG5cdCAgLmF0dHIoXCJ0aXRsZVwiLCBkID0+IGQudG9vbHRpcCB8fCBudWxsICk7XG5cdG5ld3MuYXBwZW5kKFwibGFiZWxcIilcblx0ICAudGV4dChkID0+IGQubGFiZWwpXG5cdCAgLm9uKFwiY2xpY2tcIiwgZCA9PiB7XG5cdCAgICAgIGQuaGFuZGxlcigpO1xuXHQgICAgICB0aGlzLmhpZGVDb250ZXh0TWVudSgpO1xuXHQgIH0pO1xuXHRuZXdzLmFwcGVuZChcImlcIilcblx0ICAuYXR0cihcImNsYXNzXCIsIFwibWF0ZXJpYWwtaWNvbnNcIilcblx0ICAudGV4dCggZD0+ZC5pY29uICk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldCBoaWdobGlnaHRlZCAoaGxzKSB7XG5cdGlmICh0eXBlb2YoaGxzKSA9PT0gXCJzdHJpbmdcIilcblx0ICAgIGhscyA9IFtobHNdO1xuXHQvL1xuXHR0aGlzLmhpRmVhdHMgPSB7fTtcbiAgICAgICAgZm9yKGxldCBoIG9mIGhscyl7XG5cdCAgICB0aGlzLmhpRmVhdHNbaF0gPSBoO1xuXHR9XG4gICAgfVxuICAgIGdldCBoaWdobGlnaHRlZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpRmVhdHMgPyBPYmplY3Qua2V5cyh0aGlzLmhpRmVhdHMpIDogW107XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd0NvbnRleHRNZW51ICh4LHkpIHtcbiAgICAgICAgdGhpcy5jeHRNZW51XG5cdCAgICAuY2xhc3NlZChcInNob3dpbmdcIiwgdHJ1ZSlcblx0ICAgIC5zdHlsZShcImxlZnRcIiwgYCR7eH1weGApXG5cdCAgICAuc3R5bGUoXCJ0b3BcIiwgYCR7eX1weGApXG5cdCAgICA7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZGVDb250ZXh0TWVudSAoKSB7XG4gICAgICAgIHRoaXMuY3h0TWVudS5jbGFzc2VkKFwic2hvd2luZ1wiLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgZ3MgKGxpc3Qgb2YgR2Vub21lcylcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICAgIEZvciBlYWNoIEdlbm9tZSwgc2V0cyBnLnpvb21ZIFxuICAgIHNldCBnZW5vbWVzIChncykge1xuICAgICAgIGdzLmZvckVhY2goIChnLGkpID0+IHtnLnpvb21ZID0gdGhpcy50b3BPZmZzZXQgKyBpICogKHRoaXMuc3RyaXBIZWlnaHQgKyB0aGlzLnN0cmlwR2FwKX0gKTtcbiAgICAgICB0aGlzLl9nZW5vbWVzID0gZ3M7XG4gICAgfVxuICAgIGdldCBnZW5vbWVzICgpIHtcbiAgICAgICByZXR1cm4gdGhpcy5fZ2Vub21lcztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcyAoc3RyaXBlcykgaW4gdG9wLXRvLWJvdHRvbSBvcmRlci5cbiAgICAvL1xuICAgIGdldEdlbm9tZVlPcmRlciAoKSB7XG4gICAgICAgIGxldCBzdHJpcHMgPSB0aGlzLnN2Z01haW4uc2VsZWN0QWxsKFwiLnpvb21TdHJpcFwiKTtcbiAgICAgICAgbGV0IHNzID0gc3RyaXBzWzBdLm1hcChnPT4ge1xuXHQgICAgbGV0IGJiID0gZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgIHJldHVybiBbYmIueSwgZy5fX2RhdGFfXy5nZW5vbWUubmFtZV07XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgbnMgPSBzcy5zb3J0KCAoYSxiKSA9PiBhWzBdIC0gYlswXSApLm1hcCggeCA9PiB4WzFdIClcblx0cmV0dXJuIG5zO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTZXRzIHRoZSB0b3AtdG8tYm90dG9tIG9yZGVyIG9mIHRoZSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMgYWNjb3JkaW5nIHRvIFxuICAgIC8vIHRoZSBnaXZlbiBuYW1lIGxpc3Qgb2YgbmFtZXMuIEJlY2F1c2Ugd2UgY2FuJ3QgZ3VhcmFudGVlIHRoZSBnaXZlbiBuYW1lcyBjb3JyZXNwb25kXG4gICAgLy8gdG8gYWN0dWFsIHpvb20gc3RyaXBzLCBvciB0aGF0IGFsbCBzdHJpcHMgYXJlIHJlcHJlc2VudGVkLCBldGMuXG4gICAgLy8gVGhlcmVmb3JlLCB0aGUgbGlzdCBpcyBwcmVwcmVjZXNzZWQgYXMgZm9sbG93czpcbiAgICAvLyAgICAgKiBkdXBsaWNhdGUgbmFtZXMsIGlmIHRoZXkgZXhpc3QsIGFyZSByZW1vdmVkXG4gICAgLy8gICAgICogbmFtZXMgdGhhdCBkbyBub3QgY29ycmVzcG9uZCB0byBleGlzdGluZyB6b29tU3RyaXBzIGFyZSByZW1vdmVkXG4gICAgLy8gICAgICogbmFtZXMgb2YgZXhpc3Rpbmcgem9vbSBzdHJpcHMgdGhhdCBkb24ndCBhcHBlYXIgaW4gdGhlIGxpc3QgYXJlIGFkZGVkIHRvIHRoZSBlbmRcbiAgICAvLyBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiBuYW1lcyB3aXRoIHRoZXNlIHByb3BlcnRpZXM6XG4gICAgLy8gICAgICogdGhlcmUgaXMgYSAxOjEgY29ycmVzcG9uZGVuY2UgYmV0d2VlbiBuYW1lcyBhbmQgYWN0dWFsIHpvb20gc3RyaXBzXG4gICAgLy8gICAgICogdGhlIG5hbWUgb3JkZXIgaXMgY29uc2lzdGVudCB3aXRoIHRoZSBpbnB1dCBsaXN0XG4gICAgLy8gVGhpcyBpcyB0aGUgbGlzdCB1c2VkIHRvIChyZSlvcmRlciB0aGUgem9vbSBzdHJpcHMuXG4gICAgLy9cbiAgICAvLyBHaXZlbiB0aGUgbGlzdCBvcmRlcjogXG4gICAgLy8gICAgICogYSBZLXBvc2l0aW9uIGlzIGFzc2lnbmVkIHRvIGVhY2ggZ2Vub21lXG4gICAgLy8gICAgICogem9vbSBzdHJpcHMgdGhhdCBhcmUgTk9UIENVUlJFTlRMWSBCRUlORyBEUkFHR0VEIGFyZSB0cmFuc2xhdGVkIHRvIHRoZWlyIG5ldyBsb2NhdGlvbnNcbiAgICAvL1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIG5zIChsaXN0IG9mIHN0cmluZ3MpIE5hbWVzIG9mIHRoZSBnZW5vbWVzLlxuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgIG5vdGhpbmdcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICAgIFJlY2FsY3VsYXRlcyB0aGUgWS1jb29yZGluYXRlcyBmb3IgZWFjaCBzdHJpcGUgYmFzZWQgb24gdGhlIGdpdmVuIG9yZGVyLCB0aGVuIHRyYW5zbGF0ZXNcbiAgICAvLyAgICAgZWFjaCBzdHJpcCB0byBpdHMgbmV3IHBvc2l0aW9uLlxuICAgIC8vXG4gICAgc2V0R2Vub21lWU9yZGVyIChucykge1xuXHR0aGlzLmdlbm9tZXMgPSByZW1vdmVEdXBzKG5zKS5tYXAobj0+IHRoaXMuYXBwLm5hbWUyZ2Vub21lW25dICkuZmlsdGVyKHg9PngpO1xuICAgICAgICB0aGlzLmdlbm9tZXMuZm9yRWFjaCggKGcsaSkgPT4ge1xuXHQgICAgbGV0IHN0cmlwID0gZDMuc2VsZWN0KGAjem9vbVZpZXcgLnpvb21TdHJpcFtuYW1lPVwiJHtnLm5hbWV9XCJdYCk7XG5cdCAgICBpZiAoIXN0cmlwLmNsYXNzZWQoXCJkcmFnZ2luZ1wiKSlcblx0ICAgICAgICBzdHJpcC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoMCwke2cuem9vbVl9KWApO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgZHJhZ2dlciAoZDMuYmVoYXZpb3IuZHJhZykgdG8gYmUgYXR0YWNoZWQgdG8gZWFjaCB6b29tIHN0cmlwLlxuICAgIC8vIEFsbG93cyBzdHJpcHMgdG8gYmUgcmVvcmRlcmVkIGJ5IGRyYWdnaW5nLlxuICAgIGdldERyYWdnZXIgKCkgeyAgXG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICByZXR1cm4gZDMuYmVoYXZpb3IuZHJhZygpXG5cdCAgLm9yaWdpbihmdW5jdGlvbihkLGkpe1xuXHQgICAgICByZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICB9KVxuICAgICAgICAgIC5vbihcImRyYWdzdGFydC56XCIsIGZ1bmN0aW9uKGcpIHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC5zb3VyY2VFdmVudC50YXJnZXQ7XG5cdCAgICAgIGlmIChkMy5zZWxlY3QodCkuYXR0cihcIm5hbWVcIikgIT09ICd6b29tU3RyaXBIYW5kbGUnKXtcblx0ICAgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgfVxuXHQgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgbGV0IHN0cmlwID0gdGhpcy5jbG9zZXN0KFwiLnpvb21TdHJpcFwiKTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZyA9IGQzLnNlbGVjdChzdHJpcCkuY2xhc3NlZChcImRyYWdnaW5nXCIsIHRydWUpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZy56XCIsIGZ1bmN0aW9uIChnKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICBsZXQgbXkgPSBkMy5tb3VzZShzZWxmLnN2Z01haW5bMF1bMF0pWzFdO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwLCAke215fSlgKTtcblx0ICAgICAgc2VsZi5zZXRHZW5vbWVZT3JkZXIoc2VsZi5nZXRHZW5vbWVZT3JkZXIoKSk7XG5cdCAgICAgIHNlbGYuaGlnaGxpZ2h0KCk7XG5cdCAgfSlcblx0ICAub24oXCJkcmFnZW5kLnpcIiwgZnVuY3Rpb24gKGcpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIC8vXG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcuY2xhc3NlZChcImRyYWdnaW5nXCIsIGZhbHNlKTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZyA9IG51bGw7XG5cdCAgICAgIHNlbGYuc2V0R2Vub21lWU9yZGVyKHNlbGYuZ2V0R2Vub21lWU9yZGVyKCkpO1xuXHQgICAgICBzZWxmLmFwcC5zZXRDb250ZXh0KHsgZ2Vub21lczogc2VsZi5nZXRHZW5vbWVZT3JkZXIoKSB9KTtcblx0ICAgICAgd2luZG93LnNldFRpbWVvdXQoIHNlbGYuaGlnaGxpZ2h0LmJpbmQoc2VsZiksIDI1MCApO1xuXHQgIH0pXG5cdCAgO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQnJ1c2hlcyAoKSB7XG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoXCJnLmJydXNoXCIpXG5cdCAgICAuZWFjaCggZnVuY3Rpb24gKGIpIHtcblx0ICAgICAgICBiLmJydXNoLmNsZWFyKCk7XG5cdFx0ZDMuc2VsZWN0KHRoaXMpLmNhbGwoYi5icnVzaCk7XG5cdCAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGJydXNoIGNvb3JkaW5hdGVzLCB0cmFuc2xhdGVkIChpZiBuZWVkZWQpIHRvIHJlZiBnZW5vbWUgY29vcmRpbmF0ZXMuXG4gICAgYmJHZXRSZWZDb29yZHMgKCkge1xuICAgICAgbGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTtcbiAgICAgIGxldCBibGsgPSB0aGlzLmJydXNoaW5nO1xuICAgICAgbGV0IGV4dCA9IGJsay5icnVzaC5leHRlbnQoKTtcbiAgICAgIGxldCByID0geyBjaHI6IGJsay5jaHIsIHN0YXJ0OiBleHRbMF0sIGVuZDogZXh0WzFdLCBibG9ja0lkOmJsay5ibG9ja0lkIH07XG4gICAgICBsZXQgdHIgPSB0aGlzLmFwcC50cmFuc2xhdG9yO1xuICAgICAgaWYoIGJsay5nZW5vbWUgIT09IHJnICkge1xuICAgICAgICAgLy8gdXNlciBpcyBicnVzaGluZyBhIGNvbXAgZ2Vub21lcyBzbyBmaXJzdCB0cmFuc2xhdGVcblx0IC8vIGNvb3JkaW5hdGVzIHRvIHJlZiBnZW5vbWVcblx0IGxldCBycyA9IHRoaXMuYXBwLnRyYW5zbGF0b3IudHJhbnNsYXRlKGJsay5nZW5vbWUsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgcmcpO1xuXHQgaWYgKHJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHQgciA9IHJzWzBdO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICAgci5ibG9ja0lkID0gcmcubmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByO1xuICAgIH1cbiAgICAvLyBoYW5kbGVyIGZvciB0aGUgc3RhcnQgb2YgYSBicnVzaCBhY3Rpb24gYnkgdGhlIHVzZXIgb24gYSBibG9ja1xuICAgIGJiU3RhcnQgKGJsayxiRWx0KSB7XG4gICAgICB0aGlzLmJydXNoaW5nID0gYmxrO1xuICAgIH1cbiAgICAvLyBoYW5kbGVyIGZvciBicnVzaCBtb3Rpb24uIE1haW4gam9iIGlzIHRvIHJlZmxlY3QgdGhlIGJydXNoXG4gICAgLy8gaW4gcGFyYWxsZWwgYWNyb3NzIHRoZSBnZW5vbWVzIGluIHRoZSB2aWV3LiBUaGUgY3Vycm50IGJydXNoIGV4dGVudCBcbiAgICAvLyBpcyB0cmFuc2xhdGVkIChpZiBuZWNlc3NhcnkpIHRvIHJlZiBnZW5vbWUgc3BhY2UuIFRoZW4gdGhvc2VcbiAgICAvLyBjb29yZGluYXRlcyBhcmUgdHJhbnNsYXRlZCB0byBlYWNoIGNvbXBhcmlzb24gZ2Vub21lIHNwYWNlLCBhbmQgdGhlIGFwcHJvcHJpYXRlXG4gICAgLy8gYnJ1c2goZXMpIHVwZGF0ZWQuXG4gICAgLy9cbiAgICBiYkJydXNoICgpIHtcbiAgICAgIGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7IC8vIHRoZSByZWZlcmVuY2UgZ2Vub21lXG4gICAgICBsZXQgZ3MgPSBbcmddLmNvbmNhdCh0aGlzLmFwcC5jR2Vub21lcyk7IC8vIGFsbCB0aGUgZ2Vub21lcyBpbiB0aGUgdmlld1xuICAgICAgbGV0IHRyID0gdGhpcy5hcHAudHJhbnNsYXRvcjsgLy8gZm9yIHRyYW5zbGF0aW5nIGNvb3JkcyBiZXR3ZWVuIGdlbm9tZXNcbiAgICAgIGxldCBibGsgPSB0aGlzLmJydXNoaW5nOyAvLyB0aGUgYmxvY2sgY3VycmVubHkgYmVpbmcgYnJ1c2hlZFxuICAgICAgbGV0IHIgPSB0aGlzLmJiR2V0UmVmQ29vcmRzKCk7IC8vIGN1cnJlbnQgYnJ1c2ggZXh0ZW50LCBpbiByZWYgZ2Vub21lIHNwYWNlXG4gICAgICBncy5mb3JFYWNoKCBnID0+IHtcblx0ICAvLyBpZiBnIGlzIHRoZSByZWZHZW5vbWUsIG5vIG5lZWQgdG8gdHJhbnNsYXRlLiBPdGhlcndpc2UsIHRyYW5zbGF0ZSBmcm9tIFxuXHQgIC8vIHJlZiBnZW5vbWUgdG8gY29tcGFyaXNvbiBnZW5vbWUgZy5cbiAgICAgICAgICBsZXQgcnM7XG5cdCAgaWYgKGcgPT09IHJnKSB7XG5cdCAgICAgIHIuYmxvY2tJZCA9IHJnLm5hbWU7XG5cdCAgICAgIHJzID0gW3JdO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgICAgcnMgPSB0ci50cmFuc2xhdGUocmcsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgZyk7XG5cdCAgfVxuXHQgIC8vIG5vdGUgdGhhdCB0cmFuc2xhdGVkIHJlc3VsdHMgaW5jbHVkZSBibG9jayBpZGVudGlmaWVycywgd2hpY2ggdGVsbFxuXHQgIC8vIHVzIHRoZSBibG9jayAoYW5kIGhlbmNlLCBicnVzaGVzKSBpbiB0aGUgZGlzcGxheSB0byB0YXJnZXQuXG5cdCAgcnMuZm9yRWFjaCggcnIgPT4ge1xuXHQgICAgICBsZXQgYmIgPSB0aGlzLnN2Z01haW4uc2VsZWN0KGAuem9vbVN0cmlwW25hbWU9XCIke2cubmFtZX1cIl0gLnNCbG9ja1tuYW1lPVwiJHtyci5ibG9ja0lkfVwiXSAuYnJ1c2hgKVxuXHQgICAgICBiYi5lYWNoKCBmdW5jdGlvbihiKSB7XG5cdCAgICAgICAgICBiLmJydXNoLmV4dGVudChbcnIuc3RhcnQsIHJyLmVuZF0pO1xuXHRcdCAgZDMuc2VsZWN0KHRoaXMpLmNhbGwoYi5icnVzaCk7XG5cdCAgICAgIH0pO1xuXHQgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGJiRW5kICgpIHtcbiAgICAgIGxldCB4dCA9IHRoaXMuYnJ1c2hpbmcuYnJ1c2guZXh0ZW50KCk7XG4gICAgICBsZXQgciA9IHRoaXMuYmJHZXRSZWZDb29yZHMoKTtcbiAgICAgIHRoaXMuYnJ1c2hpbmcgPSBudWxsO1xuICAgICAgLy9cbiAgICAgIGxldCBzZSA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50O1xuICAgICAgaWYgKHNlLmN0cmxLZXkgfHwgc2UuYWx0S2V5IHx8IHNlLm1ldGFLZXkpIHtcblx0ICB0aGlzLmNsZWFyQnJ1c2hlcygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vXG4gICAgICBpZiAoTWF0aC5hYnMoeHRbMF0gLSB4dFsxXSkgPD0gMTApe1xuICAgICAgICAgIC8vIHVzZXIgY2xpY2tlZCBpbnN0ZWFkIG9mIGRyYWdnZWQuIFJlY2VudGVyIHRoZSB2aWV3IGluc3RlYWQgb2Ygem9vbWluZy5cblx0ICBsZXQgY3h0ID0gdGhpcy5hcHAuZ2V0Q29udGV4dCgpO1xuXHQgIGxldCB3ID0gY3h0LmVuZCAtIGN4dC5zdGFydCArIDE7XG5cdCAgci5zdGFydCAtPSB3LzI7XG5cdCAgci5lbmQgKz0gdy8yO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoc2Uuc2hpZnRLZXkpIHtcbiAgICAgICAgICAvLyB6b29tIG91dFxuXHQgIGxldCBjdXJyV2lkdGggPSB0aGlzLmNvb3Jkcy5lbmQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDE7XG5cdCAgbGV0IGJydXNoV2lkdGggPSByLmVuZCAtIHIuc3RhcnQgKyAxO1xuXHQgIGxldCBmYWN0b3IgPSBjdXJyV2lkdGggLyBicnVzaFdpZHRoO1xuXHQgIGxldCBuZXdXaWR0aCA9IGZhY3RvciAqIGN1cnJXaWR0aDtcblx0ICBsZXQgZHMgPSAoKHIuc3RhcnQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDEpL2N1cnJXaWR0aCkgKiBuZXdXaWR0aDtcblx0ICByLnN0YXJ0ID0gdGhpcy5jb29yZHMuc3RhcnQgLSBkcztcblx0ICByLmVuZCA9IHIuc3RhcnQgKyBuZXdXaWR0aCAtIDE7XG4gICAgICB9XG4gICAgICB0aGlzLmFwcC5zZXRDb250ZXh0KHIpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZ2hsaWdodFN0cmlwIChnLCBlbHQpIHtcblx0aWYgKGcgPT09IHRoaXMuY3VycmVudEhMRykgcmV0dXJuO1xuXHR0aGlzLmN1cnJlbnRITEcgPSBnO1xuXHQvL1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0QWxsKCcuem9vbVN0cmlwJylcblx0ICAgIC5jbGFzc2VkKFwiaGlnaGxpZ2h0ZWRcIiwgZCA9PiBkLmdlbm9tZSA9PT0gZyk7XG5cdHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoJy56b29tU3RyaXBIYW5kbGUnKVxuXHQgICAgLmNsYXNzZWQoXCJoaWdobGlnaHRlZFwiLCBkID0+IGQuZ2Vub21lID09PSBnKTtcblx0dGhpcy5hcHAuc2hvd0Jsb2NrcyhnKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB1cGRhdGUgKGNvb3Jkcykge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCBjID0gdGhpcy5jb29yZHMgPSAoY29vcmRzIHx8IHRoaXMuY29vcmRzKTtcblx0ZDMuc2VsZWN0KFwiI3pvb21Db29yZHNcIilbMF1bMF0udmFsdWUgPSBmb3JtYXRDb29yZHMoYy5jaHIsIGMuc3RhcnQsIGMuZW5kKTtcblx0ZDMuc2VsZWN0KFwiI3pvb21XU2l6ZVwiKVswXVswXS52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSlcblx0Ly9cbiAgICAgICAgbGV0IG1ndiA9IHRoaXMuYXBwO1xuXHQvLyB3aGVuIHRoZSB0cmFuc2xhdG9yIGlzIHJlYWR5LCB3ZSBjYW4gdHJhbnNsYXRlIHRoZSByZWYgY29vcmRzIHRvIGVhY2ggZ2Vub21lIGFuZFxuXHQvLyBpc3N1ZSByZXF1ZXN0cyB0byBsb2FkIHRoZSBmZWF0dXJlcyBpbiB0aG9zZSByZWdpb25zLlxuXHRtZ3Yuc2hvd0J1c3kodHJ1ZSk7XG5cdG1ndi50cmFuc2xhdG9yLnJlYWR5KCkudGhlbihmdW5jdGlvbigpe1xuXHQgICAgLy8gTm93IGlzc3VlIHJlcXVlc3RzIGZvciBmZWF0dXJlcy4gT25lIHJlcXVlc3QgcGVyIGdlbm9tZSwgZWFjaCByZXF1ZXN0IHNwZWNpZmllcyBvbmUgb3IgbW9yZVxuXHQgICAgLy8gY29vcmRpbmF0ZSByYW5nZXMuXG5cdCAgICAvLyBXYWl0IGZvciBhbGwgdGhlIGRhdGEgdG8gYmVjb21lIGF2YWlsYWJsZSwgdGhlbiBkcmF3LlxuXHQgICAgLy9cblx0ICAgIGxldCBwcm9taXNlcyA9IFtdO1xuXG5cdCAgICAvLyBGaXJzdCByZXF1ZXN0IGlzIGZvciB0aGUgdGhlIHJlZmVyZW5jZSBnZW5vbWUuIEdldCBhbGwgdGhlIGZlYXR1cmVzIGluIHRoZSByYW5nZS5cblx0ICAgIHByb21pc2VzLnB1c2gobWd2LmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzKG1ndi5yR2Vub21lLCBbe1xuXHRcdC8vIE5lZWQgdG8gc2ltdWxhdGUgdGhlIHJlc3VsdHMgZnJvbSBjYWxsaW5nIHRoZSB0cmFuc2xhdG9yLiBcblx0XHQvLyBcblx0XHRjaHIgICAgOiBjLmNocixcblx0XHRzdGFydCAgOiBjLnN0YXJ0LFxuXHRcdGVuZCAgICA6IGMuZW5kLFxuXHRcdGluZGV4ICA6IDAsXG5cdFx0ZkNociAgIDogYy5jaHIsXG5cdFx0ZlN0YXJ0IDogYy5zdGFydCxcblx0XHRmRW5kICAgOiBjLmVuZCxcblx0XHRmSW5kZXggIDogMCxcblx0XHRvcmkgICAgOiBcIitcIixcblx0XHRibG9ja0lkOiBtZ3Yuckdlbm9tZS5uYW1lXG5cdFx0fV0pKTtcblx0ICAgIGlmICghIHNlbGYucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIpKSB7XG5cdFx0Ly8gQWRkIGEgcmVxdWVzdCBmb3IgZWFjaCBjb21wYXJpc29uIGdlbm9tZSwgdXNpbmcgdHJhbnNsYXRlZCBjb29yZGluYXRlcy4gXG5cdFx0bWd2LmNHZW5vbWVzLmZvckVhY2goY0dlbm9tZSA9PiB7XG5cdFx0ICAgIGxldCByYW5nZXMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUoIG1ndi5yR2Vub21lLCBjLmNociwgYy5zdGFydCwgYy5lbmQsIGNHZW5vbWUgKTtcblx0XHQgICAgcHJvbWlzZXMucHVzaChtZ3YuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXMoY0dlbm9tZSwgcmFuZ2VzKSlcblx0XHR9KTtcblx0ICAgIH1cblx0ICAgIC8vIHdoZW4gZXZlcnl0aGluZyBpcyByZWFkeSwgY2FsbCB0aGUgZHJhdyBmdW5jdGlvblxuXHQgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oIGRhdGEgPT4ge1xuXHQgICAgICAgIHNlbGYuZHJhdyhkYXRhKTtcblx0XHRtZ3Yuc2hvd0J1c3koZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIG9yZGVyU0Jsb2NrcyAoKSB7XG5cdGxldCBzYmxvY2tzID0gdGhpcy5zdHJpcHNHcnAuc2VsZWN0QWxsKCdnLnpvb21TdHJpcCcpLnNlbGVjdCgnW25hbWU9XCJzQmxvY2tzXCJdJykuc2VsZWN0QWxsKCdnLnNCbG9jaycpXG5cdC8vIEJ5IGRlZmF1bHQsIHRoZSBzYmxvY2tzIGluIGEgY29tcCBnZW5vbWUgc3RyaXAgYXJlIG9yZGVyZWQgdG8gbWF0Y2ggdGhlIHJlZiBnZW5vbWVcblx0Ly8gb3JkZXIuXG5cdGxldCBwcGIgPSB0aGlzLndpZHRoIC8gKHRoaXMuY29vcmRzLmVuZCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMSk7XG5cdGxldCBvZmZzZXQgPSBbXTsgLy8gb2Zmc2V0IG9mIHN0YXJ0ICBwb3NpdGlvbiBvZiBuZXh0IGJsb2NrLCBieSBzdHJpcCBpbmRleCAoMD09PXJlZilcblx0c2Jsb2Nrcy5lYWNoKCBmdW5jdGlvbiAoYixpLGopIHsgLy8gYj1ibG9jaywgaT1pbmRleCB3aXRoaW4gc3RyaXAsIGo9c3RyaXAgaW5kZXhcblx0ICAgIGxldCBibGVuID0gcHBiICogKGIuZW5kIC0gYi5zdGFydCArIDEpOyAvLyB0b3RhbCBzY3JlZW4gd2lkdGggb2YgdGhpcyBzYmxvY2tcblx0ICAgIGIueHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFtiLnN0YXJ0LCBiLmVuZF0pLnJhbmdlKFswLCBibGVuXSk7XG5cdCAgICBsZXQgZHggPSBpID09PSAwID8gMCA6IG9mZnNldFtqXTtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHtkeH0sMClgKTtcblx0ICAgIG9mZnNldFtqXSA9IGR4ICsgYmxlbiArIDI7XG5cdH0pO1xuXHQvL1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSB6b29tIHZpZXcgcGFuZWwgd2l0aCB0aGUgZ2l2ZW4gZGF0YS5cbiAgICAvL1xuICAgIC8vIERhdGEgaXMgc3RydWN0dXJlZCBhcyBmb2xsb3dzOlxuICAgIC8vICAgICBkYXRhID0gWyB6b29tU3RyaXBfZGF0YSBdXG4gICAgLy8gICAgIHpvb21TdHJpcF9kYXRhID0geyBnZW5vbWUgWyB6b29tQmxvY2tfZGF0YSBdIH1cbiAgICAvLyAgICAgem9vbUJsb2NrX2RhdGEgPSB7IHhzY2FsZSwgY2hyLCBzdGFydCwgZW5kLCBmQ2hyLCBmU3RhcnQsIGZFbmQsIG9yaSwgWyBmZWF0dXJlX2RhdGEgXSB9XG4gICAgLy8gICAgIGZlYXR1cmVfZGF0YSA9IHsgbWdwaWQsIG1naWlkLCBzeW1ib2wsIGNociwgc3RhcnQsIGVuZCwgc3RyYW5kLCB0eXBlLCBiaW90eXBlIH1cbiAgICAvL1xuICAgIC8vIEFnYWluLCBpbiBFbmdsaXNoOlxuICAgIC8vICAtIGRhdGEgaXMgYSBsaXN0IG9mIGl0ZW1zLCBvbmUgcGVyIHN0cmlwIHRvIGJlIGRpc3BsYXllZC4gSXRlbVswXSBpcyBkYXRhIGZvciB0aGUgcmVmIGdlbm9tZS5cbiAgICAvLyAgICBJdGVtc1sxK10gYXJlIGRhdGEgZm9yIHRoZSBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvLyAgLSBlYWNoIHN0cmlwIGl0ZW0gaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBnZW5vbWUgYW5kIGEgbGlzdCBvZiBibG9ja3MuIEl0ZW1bMF0gYWx3YXlzIGhhcyBcbiAgICAvLyAgICBhIHNpbmdsZSBibG9jay5cbiAgICAvLyAgLSBlYWNoIGJsb2NrIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGEgY2hyb21vc29tZSwgc3RhcnQsIGVuZCwgb3JpZW50YXRpb24sIGV0YywgYW5kIGEgbGlzdCBvZiBmZWF0dXJlcy5cbiAgICAvLyAgLSBlYWNoIGZlYXR1cmUgaGFzIGNocixzdGFydCxlbmQsc3RyYW5kLHR5cGUsYmlvdHlwZSxtZ3BpZFxuICAgIC8vXG4gICAgZHJhdyAoZGF0YSkge1xuXHQvLyBcblx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdGxldCBjbG9zZWQgPSB0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiKTtcblxuXHQvLyByZXNldCB0aGUgc3ZnIHNpemUgYmFzZWQgb24gbnVtYmVyIG9mIHN0cmlwc1xuXHRsZXQgdG90YWxIZWlnaHQgPSAodGhpcy5zdHJpcEhlaWdodCt0aGlzLnN0cmlwR2FwKSAqIGRhdGEubGVuZ3RoICsgMTI7XG5cdHRoaXMuc3ZnXG5cdCAgICAuYXR0cihcImhlaWdodFwiLCB0b3RhbEhlaWdodCk7XG5cblx0Ly8gRHJhdyB0aGUgdGl0bGUgb24gdGhlIHpvb212aWV3IHBvc2l0aW9uIGNvbnRyb2xzXG5cdGQzLnNlbGVjdChcIiN6b29tVmlldyAuem9vbUNvb3JkcyBsYWJlbFwiKVxuXHQgICAgLnRleHQoZGF0YVswXS5nZW5vbWUubGFiZWwgKyBcIiBjb29yZHNcIik7XG5cdFxuXHQvLyB0aGUgcmVmZXJlbmNlIGdlbm9tZSBibG9jayAoYWx3YXlzIGp1c3QgMSBvZiB0aGVzZSkuXG5cdGxldCByQmxvY2sgPSBkYXRhWzBdLmJsb2Nrc1swXTtcblxuXHQvLyB4LXNjYWxlIGFuZCB4LWF4aXMgYmFzZWQgb24gdGhlIHJlZiBnZW5vbWUgZGF0YS5cblx0dGhpcy54c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHQgICAgLmRvbWFpbihbckJsb2NrLnN0YXJ0LHJCbG9jay5lbmRdKVxuXHQgICAgLnJhbmdlKFswLHRoaXMud2lkdGhdKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBkcmF3IHRoZSBheGlzXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdHRoaXMuYXhpc0Z1bmMgPSBkMy5zdmcuYXhpcygpXG5cdCAgICAuc2NhbGUodGhpcy54c2NhbGUpXG5cdCAgICAub3JpZW50KFwidG9wXCIpXG5cdCAgICAub3V0ZXJUaWNrU2l6ZSgwKVxuXHQgICAgLnRpY2tzKDUpXG5cdCAgICA7XG5cdHRoaXMuYXhpcy5jYWxsKHRoaXMuYXhpc0Z1bmMpO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIHpvb20gc3RyaXBzIChvbmUgcGVyIGdlbm9tZSlcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgbGV0IHpzdHJpcHMgPSB0aGlzLnN0cmlwc0dycFxuXHQgICAgICAgIC5zZWxlY3RBbGwoXCJnLnpvb21TdHJpcFwiKVxuXHRcdC5kYXRhKGRhdGEsIGQgPT4gZC5nZW5vbWUubmFtZSk7XG5cdGxldCBuZXd6cyA9IHpzdHJpcHMuZW50ZXIoKVxuXHQgICAgICAgIC5hcHBlbmQoXCJnXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLFwiem9vbVN0cmlwXCIpXG5cdFx0LmF0dHIoXCJuYW1lXCIsIGQgPT4gZC5nZW5vbWUubmFtZSlcblx0XHQub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZykge1xuXHRcdCAgICBzZWxmLmhpZ2hsaWdodFN0cmlwKGcuZ2Vub21lLCB0aGlzKTtcblx0XHR9KVxuXHRcdC5jYWxsKHRoaXMuZHJhZ2dlcilcblx0XHQ7XG5cdG5ld3pzLmFwcGVuZChcInRleHRcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBcImdlbm9tZUxhYmVsXCIpXG5cdCAgICAudGV4dCggZCA9PiBkLmdlbm9tZS5sYWJlbClcblx0ICAgIC5hdHRyKFwieFwiLCAwKVxuXHQgICAgLmF0dHIoXCJ5XCIsIHRoaXMuYmxvY2tIZWlnaHQvMiArIDEwKVxuXHQgICAgLmF0dHIoXCJmb250LWZhbWlseVwiLFwic2Fucy1zZXJpZlwiKVxuXHQgICAgLmF0dHIoXCJmb250LXNpemVcIiwgMTApXG5cdCAgICA7XG5cdG5ld3pzLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBcInNCbG9ja3NcIik7XG5cdG5ld3pzLmFwcGVuZChcInJlY3RcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBcInpvb21TdHJpcEhhbmRsZVwiKVxuXHQgICAgLmF0dHIoXCJ4XCIsIC0xNSlcblx0ICAgIC5hdHRyKFwieVwiLCAtdGhpcy5ibG9ja0hlaWdodCAvIDIpXG5cdCAgICAuYXR0cihcIndpZHRoXCIsIDE1KVxuXHQgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5ibG9ja0hlaWdodClcblx0ICAgIDtcblxuXHR6c3RyaXBzXG5cdCAgICAuY2xhc3NlZChcInJlZmVyZW5jZVwiLCBkID0+IGQuZ2Vub21lID09PSB0aGlzLmFwcC5yR2Vub21lKVxuXHQgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZyA9PiBgdHJhbnNsYXRlKDAsJHtjbG9zZWQgPyB0aGlzLnRvcE9mZnNldCA6IGcuZ2Vub21lLnpvb21ZfSlgKVxuXHQgICAgO1xuXG4gICAgICAgIHpzdHJpcHMuZXhpdCgpXG5cdCAgICAub24oXCIuZHJhZ1wiLCBudWxsKVxuXHQgICAgLnJlbW92ZSgpO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIHN5bnRlbnkgYmxvY2tzLiBFYWNoem9vbSBzdHJpcCBoYXMgYSBsaXN0IG9mIDEgb3IgbW9yZSBzYmxvY2tzLlxuXHQvLyBUaGUgcmVmZXJlbmNlIGdlbm9tZSBhbHdheXMgaGFzIGp1c3QgMS4gVGhlIGNvbXAgZ2Vub21lcyBtYW55IGhhdmVcblx0Ly8gMSBvciBtb3JlIChhbmQgaW4gcmFyZSBjYXNlcywgMCkuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGxldCBzYmxvY2tzID0genN0cmlwcy5zZWxlY3QoJ1tuYW1lPVwic0Jsb2Nrc1wiXScpLnNlbGVjdEFsbCgnZy5zQmxvY2snKVxuXHQgICAgLmRhdGEoZCA9PiB7XG5cdFx0Ly9kLmJsb2Nrcy5zb3J0KCAoYSxiKSA9PiBhLmluZGV4LWIuaW5kZXggKTtcblx0ICAgICAgICByZXR1cm4gZC5ibG9ja3M7XG5cdCAgICB9LCBkID0+IGQuYmxvY2tJZCk7XG5cdGxldCBuZXdzYnMgPSBzYmxvY2tzLmVudGVyKClcblx0ICAgIC5hcHBlbmQoXCJnXCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsIGIgPT4gXCJzQmxvY2tcIiArIChiLm9yaT09PVwiK1wiID8gXCIgcGx1c1wiIDogXCIgbWludXNcIikgKyAoYi5jaHIgIT09IGIuZkNociA/IFwiIHRyYW5zbG9jYXRpb25cIiA6IFwiXCIpKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGI9PmIuaW5kZXgpXG5cdCAgICA7XG5cdGxldCBsMCA9IG5ld3Nicy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsIFwibGF5ZXIwXCIpO1xuXHRsZXQgbDEgPSBuZXdzYnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLCBcImxheWVyMVwiKTtcblxuXHQvLyByZWN0YW5nbGUgZm9yIHRoZSB3aG9sZSBibG9ja1xuXHRsMC5hcHBlbmQoXCJyZWN0XCIpLmF0dHIoXCJjbGFzc1wiLCBcImJsb2NrXCIpO1xuXHQvLyB0aGUgYXhpcyBsaW5lXG5cdGwwLmFwcGVuZChcImxpbmVcIikuYXR0cihcImNsYXNzXCIsXCJheGlzXCIpIDtcblx0Ly8gbGFiZWxcblx0bDAuYXBwZW5kKFwidGV4dFwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwiYmxvY2tMYWJlbFwiKSA7XG5cdC8vIGJydXNoXG5cdGwwLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsXCJicnVzaFwiKTtcblxuXHRzYmxvY2tzLmV4aXQoKS5yZW1vdmUoKTtcblxuXHR0aGlzLm9yZGVyU0Jsb2NrcyhzYmxvY2tzKTtcblxuXHQvLyBzeW50ZW55IGJsb2NrIGxhYmVsc1xuXHRzYmxvY2tzLnNlbGVjdChcInRleHQuYmxvY2tMYWJlbFwiKVxuXHQgICAgLnRleHQoIGIgPT4ge1xuXHRcdC8vIG9ubHkgc2hvdyBjaHJvbW9zb21lIGxhYmVsIGZvciByZWYgZ2Vub21lIGFuZCBmb3IgYW55IHNibG9ja1xuXHRcdC8vIHdob3NlIGNocm9tb3NvbWUgZGlmZmVycyBmcm9tIHRoZSByZWZcblx0XHRpZiAoYi5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUgfHwgYi5jaHIgIT09IHRoaXMuY29vcmRzLmNocilcblx0XHQgICAgcmV0dXJuIGIuY2hyO1xuXHRcdGVsc2Vcblx0XHQgICAgcmV0dXJuIFwiXCI7XG5cdCAgICB9KVxuXHQgICAgLmF0dHIoXCJ4XCIsIGIgPT4gKGIueHNjYWxlKGIuc3RhcnQpICsgYi54c2NhbGUoYi5lbmQpKS8yIClcblx0ICAgIC5hdHRyKFwieVwiLCB0aGlzLmJsb2NrSGVpZ2h0IC8gMiArIDEwKVxuXHQgICAgO1xuXG5cdC8vIHN5bnRlbnkgYmxvY2sgcmVjdHNcblx0c2Jsb2Nrcy5zZWxlY3QoXCJyZWN0LmJsb2NrXCIpXG5cdCAgLmF0dHIoXCJ4XCIsICAgICBiID0+IGIueHNjYWxlKGIuc3RhcnQpKVxuXHQgIC5hdHRyKFwieVwiLCAgICAgYiA9PiAtdGhpcy5ibG9ja0hlaWdodCAvIDIpXG5cdCAgLmF0dHIoXCJ3aWR0aFwiLCBiPT5iLnhzY2FsZShiLmVuZCktYi54c2NhbGUoYi5zdGFydCkpXG5cdCAgLmF0dHIoXCJoZWlnaHRcIix0aGlzLmJsb2NrSGVpZ2h0KTtcblxuXHQvLyBzeW50ZW55IGJsb2NrIGF4aXMgbGluZXNcblx0c2Jsb2Nrcy5zZWxlY3QoXCJsaW5lLmF4aXNcIilcblx0ICAgIC5hdHRyKFwieDFcIiwgYiA9PiBiLnhzY2FsZS5yYW5nZSgpWzBdKVxuXHQgICAgLmF0dHIoXCJ5MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ4MlwiLCBiID0+IGIueHNjYWxlLnJhbmdlKClbMV0pXG5cdCAgICAuYXR0cihcInkyXCIsIDApXG5cdCAgICA7XG5cblx0Ly8gYnJ1c2hcblx0c2Jsb2Nrcy5zZWxlY3QoXCJnLmJydXNoXCIpXG5cdCAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBiID0+IGB0cmFuc2xhdGUoMCwke3RoaXMuYmxvY2tIZWlnaHQgLyAyfSlgKVxuXHQgICAgLmVhY2goZnVuY3Rpb24oYikge1xuXHRcdGlmICghYi5icnVzaCkge1xuXHRcdCAgICBiLmJydXNoID0gZDMuc3ZnLmJydXNoKClcblx0XHRcdC5vbihcImJydXNoc3RhcnRcIiwgZnVuY3Rpb24oKXsgc2VsZi5iYlN0YXJ0KCBiLCB0aGlzICk7IH0pXG5cdFx0XHQub24oXCJicnVzaFwiLCAgICAgIGZ1bmN0aW9uKCl7IHNlbGYuYmJCcnVzaCggYiwgdGhpcyApOyB9KVxuXHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgICBmdW5jdGlvbigpeyBzZWxmLmJiRW5kKCBiLCB0aGlzICk7IH0pXG5cdFx0fVxuXHRcdGIuYnJ1c2gueChiLnhzY2FsZSkuY2xlYXIoKTtcblx0XHRkMy5zZWxlY3QodGhpcykuY2FsbChiLmJydXNoKTtcblx0ICAgIH0pXG5cdCAgICAuc2VsZWN0QWxsKFwicmVjdFwiKVxuXHRcdC5hdHRyKFwiaGVpZ2h0XCIsIDEwKTtcblxuXHR0aGlzLmRyYXdGZWF0dXJlcyhzYmxvY2tzKTtcblxuXHQvL1xuXHR0aGlzLmFwcC5mYWNldE1hbmFnZXIuYXBwbHlBbGwoKTtcblxuXHQvLyBXZSBuZWVkIHRvIGxldCB0aGUgdmlldyByZW5kZXIgYmVmb3JlIGRvaW5nIHRoZSBoaWdobGlnaHRpbmcsIHNpbmNlIGl0IGRlcGVuZHMgb25cblx0Ly8gdGhlIHBvc2l0aW9ucyBvZiByZWN0YW5nbGVzIGluIHRoZSBzY2VuZS5cblx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuXHQgICAgLy90aGlzLnNldEdlbm9tZVlPcmRlciggdGhpcy5nZW5vbWVzLm1hcChnID0+IGcubmFtZSkgKTtcblx0ICAgIC8vd2luZG93LnNldFRpbWVvdXQoKCkgPT4gdGhpcy5oaWdobGlnaHQoKSwgNTApO1xuXHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0fSwgNTApO1xuICAgIH07XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgZmVhdHVyZXMgKHJlY3RhbmdsZXMpIGZvciB0aGUgc3BlY2lmaWVkIHN5bnRlbnkgYmxvY2tzLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIHNibG9ja3MgKEQzIHNlbGVjdGlvbiBvZiBnLnNibG9jayBub2RlcylcbiAgICAvL1xuICAgIGRyYXdGZWF0dXJlcyAoc2Jsb2Nrcykge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdC8vXG5cdC8vIG5ldmVyIGRyYXcgdGhlIHNhbWUgZmVhdHVyZSB0d2ljZVxuXHRsZXQgZHJhd24gPSBuZXcgU2V0KCk7XHQvLyBzZXQgb2YgbWdwaWRzIG9mIGRyYXduIGZlYXR1cmVzXG5cdGxldCBmaWx0ZXJEcmF3biA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICAvLyByZXR1cm5zIHRydWUgaWYgd2UndmUgbm90IHNlZW4gdGhpcyBvbmUgYmVmb3JlLlxuXHQgICAgLy8gcmVnaXN0ZXJzIHRoYXQgd2UndmUgc2VlbiBpdC5cblx0ICAgIGxldCBmaWQgPSBmLm1ncGlkO1xuXHQgICAgbGV0IHYgPSAhIGRyYXduLmhhcyhmaWQpO1xuXHQgICAgZHJhd24uYWRkKGZpZCk7XG5cdCAgICByZXR1cm4gdjtcblx0fTtcblx0bGV0IGZlYXRzID0gc2Jsb2Nrcy5zZWxlY3QoJ1tuYW1lPVwibGF5ZXIxXCJdJykuc2VsZWN0QWxsKFwiLmZlYXR1cmVcIilcblx0ICAgIC5kYXRhKGQ9PmQuZmVhdHVyZXMuZmlsdGVyKGZpbHRlckRyYXduKSwgZD0+ZC5tZ3BpZCk7XG5cdGZlYXRzLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0bGV0IG5ld0ZlYXRzID0gZmVhdHMuZW50ZXIoKS5hcHBlbmQoXCJyZWN0XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsIGYgPT4gXCJmZWF0dXJlXCIgKyAoZi5zdHJhbmQ9PT1cIi1cIiA/IFwiIG1pbnVzXCIgOiBcIiBwbHVzXCIpKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGYgPT4gZi5tZ3BpZClcblx0ICAgIC5zdHlsZShcImZpbGxcIiwgZiA9PiBzZWxmLmFwcC5jc2NhbGUoZi5nZXRNdW5nZWRUeXBlKCkpKVxuXHQgICAgO1xuXG5cdC8vIGRyYXcgdGhlIHJlY3RhbmdsZXNcblx0bGV0IGZCbG9jayA9IGZ1bmN0aW9uIChmZWF0RWx0KSB7XG5cdCAgICBsZXQgYmxrRWx0ID0gZmVhdEVsdC5wYXJlbnROb2RlO1xuXHQgICAgcmV0dXJuIGJsa0VsdC5fX2RhdGFfXztcblx0fVxuXHRmZWF0c1xuXHQgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZikgeyByZXR1cm4gZkJsb2NrKHRoaXMpLnhzY2FsZShmLnN0YXJ0KSB9KVxuXHQgIC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGZCbG9jayh0aGlzKS54c2NhbGUoZi5lbmQpLWZCbG9jayh0aGlzKS54c2NhbGUoZi5zdGFydCkrMSB9KVxuXHQgIC5hdHRyKFwieVwiLCBmdW5jdGlvbiAoZikge1xuXHQgICAgICAgaWYgKGYuc3RyYW5kID09IFwiK1wiKVxuXHRcdCAgIHJldHVybiAtc2VsZi5sYW5lSGVpZ2h0KmYubGFuZTtcblx0ICAgICAgIGVsc2Vcblx0XHQgICAvLyBmLmxhbmUgaXMgbmVnYXRpdmUgZm9yIFwiLVwiIHN0cmFuZFxuXHQgICAgICAgICAgIHJldHVybiAtc2VsZi5sYW5lSGVpZ2h0KmYubGFuZSAtIHNlbGYuZmVhdEhlaWdodDsgXG5cdCAgICAgICB9KVxuXHQgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMuZmVhdEhlaWdodClcblx0ICA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyBmZWF0dXJlIGhpZ2hsaWdodGluZyBpbiB0aGUgY3VycmVudCB6b29tIHZpZXcuXG4gICAgLy8gRmVhdHVyZXMgdG8gYmUgaGlnaGxpZ2h0ZWQgaW5jbHVkZSB0aG9zZSBpbiB0aGUgaGlGZWF0cyBsaXN0IHBsdXMgdGhlIGZlYXR1cmVcbiAgICAvLyBjb3JyZXNwb25kaW5nIHRvIHRoZSByZWN0YW5nbGUgYXJndW1lbnQsIGlmIGdpdmVuLiAoVGhlIG1vdXNlb3ZlciBmZWF0dXJlLilcbiAgICAvL1xuICAgIC8vIERyYXdzIGZpZHVjaWFscyBmb3IgZmVhdHVyZXMgaW4gdGhpcyBsaXN0IHRoYXQ6XG4gICAgLy8gMS4gb3ZlcmxhcCB0aGUgY3VycmVudCB6b29tVmlldyBjb29yZCByYW5nZVxuICAgIC8vIDIuIGFyZSBub3QgcmVuZGVyZWQgaW52aXNpYmxlIGJ5IGN1cnJlbnQgZmFjZXQgc2V0dGluZ3NcbiAgICAvL1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgY3VycmVudCAocmVjdCBlbGVtZW50KSBPcHRpb25hbC4gQWRkJ2wgcmVjdGFuZ2xlIGVsZW1lbnQsIGUuZy4sIHRoYXQgd2FzIG1vdXNlZC1vdmVyLiBIaWdobGlnaHRpbmdcbiAgICAvLyAgICAgICAgd2lsbCBpbmNsdWRlIHRoZSBmZWF0dXJlIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyByZWN0IGFsb25nIHdpdGggdGhvc2UgaW4gdGhlIGhpZ2hsaWdodCBsaXN0LlxuICAgIC8vICAgIHB1bHNlQ3VycmVudCAoYm9vbGVhbikgSWYgdHJ1ZSBhbmQgY3VycmVudCBpcyBnaXZlbiwgY2F1c2UgaXQgdG8gcHVsc2UgYnJpZWZseS5cbiAgICAvL1xuICAgIGhpZ2hsaWdodCAoY3VycmVudCwgcHVsc2VDdXJyZW50KSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0Ly8gY3VycmVudCdzIGZlYXR1cmVcblx0bGV0IGN1cnJGZWF0ID0gY3VycmVudCA/IChjdXJyZW50IGluc3RhbmNlb2YgRmVhdHVyZSA/IGN1cnJlbnQgOiBjdXJyZW50Ll9fZGF0YV9fKSA6IG51bGw7XG5cdC8vIGNyZWF0ZSBsb2NhbCBjb3B5IG9mIGhpRmVhdHMsIHdpdGggY3VycmVudCBmZWF0dXJlIGFkZGVkXG5cdGxldCBoaUZlYXRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5oaUZlYXRzKTtcblx0aWYgKGN1cnJGZWF0KSB7XG5cdCAgICBoaUZlYXRzW2N1cnJGZWF0LmlkXSA9IGN1cnJGZWF0LmlkO1xuXHR9XG5cblx0Ly8gRmlsdGVyIGFsbCBmZWF0dXJlcyAocmVjdGFuZ2xlcykgaW4gdGhlIHNjZW5lIGZvciB0aG9zZSBiZWluZyBoaWdobGlnaHRlZC5cblx0Ly8gQWxvbmcgdGhlIHdheSwgYnVpbGQgaW5kZXggbWFwcGluZyBmZWF0dXJlIGlkIHRvIGl0cyBcInN0YWNrXCIgb2YgZXF1aXZhbGVudCBmZWF0dXJlcyxcblx0Ly8gaS5lLiBhIGxpc3Qgb2YgaXRzIGdlbm9sb2dzIHNvcnRlZCBieSB5IGNvb3JkaW5hdGUuXG5cdC8vIEFsc28sIG1ha2UgZWFjaCBoaWdobGlnaHRlZCBmZWF0dXJlIHRhbGxlciAoc28gaXQgc3RhbmRzIGFib3ZlIGl0cyBuZWlnaGJvcnMpXG5cdC8vIGFuZCBnaXZlIGl0IHRoZSBcIi5oaWdobGlnaHRcIiBjbGFzcy5cblx0Ly9cblx0bGV0IHN0YWNrcyA9IHt9OyAvLyBmaWQgLT4gWyByZWN0cyBdIFxuXHRsZXQgZGggPSB0aGlzLmJsb2NrSGVpZ2h0LzIgLSB0aGlzLmZlYXRIZWlnaHQ7XG4gICAgICAgIGxldCBmZWF0cyA9IHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoXCIuZmVhdHVyZVwiKVxuXHQgIC8vIGZpbHRlciByZWN0LmZlYXR1cmVzIGZvciB0aG9zZSBpbiB0aGUgaGlnaGxpZ2h0IGxpc3Rcblx0ICAuZmlsdGVyKGZ1bmN0aW9uKGZmKXtcblx0ICAgICAgLy8gaGlnaGxpZ2h0IGZmIGlmIGVpdGhlciBpZCBpcyBpbiB0aGUgbGlzdCBBTkQgaXQncyBub3QgYmVlbiBoaWRkZW5cblx0ICAgICAgbGV0IG1naSA9IGhpRmVhdHNbZmYubWdpaWRdO1xuXHQgICAgICBsZXQgbWdwID0gaGlGZWF0c1tmZi5tZ3BpZF07XG5cdCAgICAgIGxldCBzaG93aW5nID0gZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwiZGlzcGxheVwiKSAhPT0gXCJub25lXCI7XG5cdCAgICAgIGxldCBobCA9IHNob3dpbmcgJiYgKG1naSB8fCBtZ3ApO1xuXHQgICAgICBpZiAoaGwpIHtcblx0XHQgIC8vIGZvciBlYWNoIGhpZ2hsaWdodGVkIGZlYXR1cmUsIGFkZCBpdHMgcmVjdGFuZ2xlIHRvIHRoZSBsaXN0XG5cdFx0ICBsZXQgayA9IGZmLmlkO1xuXHRcdCAgaWYgKCFzdGFja3Nba10pIHN0YWNrc1trXSA9IFtdXG5cdFx0ICBzdGFja3Nba10ucHVzaCh0aGlzKVxuXHQgICAgICB9XG5cdCAgICAgIC8vIFxuXHQgICAgICBkMy5zZWxlY3QodGhpcylcblx0XHQgIC5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIGhsKVxuXHRcdCAgLmNsYXNzZWQoXCJjdXJyZW50XCIsIGhsICYmIGN1cnJGZWF0ICYmIHRoaXMuX19kYXRhX18uaWQgPT09IGN1cnJGZWF0LmlkKVxuXHRcdCAgLmNsYXNzZWQoXCJleHRyYVwiLCBwdWxzZUN1cnJlbnQgJiYgZmYgPT09IGN1cnJGZWF0KVxuXHQgICAgICByZXR1cm4gaGw7XG5cdCAgfSlcblx0ICA7XG5cblx0Ly8gYnVpbGQgZGF0YSBhcnJheSBmb3IgZHJhd2luZyBmaWR1Y2lhbHMgYmV0d2VlbiBlcXVpdmFsZW50IGZlYXR1cmVzXG5cdGxldCBkYXRhID0gW107XG5cdGZvciAobGV0IGsgaW4gc3RhY2tzKSB7XG5cdCAgICAvLyBmb3IgZWFjaCBoaWdobGlnaHRlZCBmZWF0dXJlLCBzb3J0IHRoZSByZWN0YW5nbGVzIGluIGl0cyBsaXN0IGJ5IFktY29vcmRpbmF0ZVxuXHQgICAgbGV0IHJlY3RzID0gc3RhY2tzW2tdO1xuXHQgICAgcmVjdHMuc29ydCggKGEsYikgPT4gcGFyc2VGbG9hdChhLmdldEF0dHJpYnV0ZShcInlcIikpIC0gcGFyc2VGbG9hdChiLmdldEF0dHJpYnV0ZShcInlcIikpICk7XG5cdCAgICByZWN0cy5zb3J0KCAoYSxiKSA9PiB7XG5cdFx0cmV0dXJuIGEuX19kYXRhX18uZ2Vub21lLnpvb21ZIC0gYi5fX2RhdGFfXy5nZW5vbWUuem9vbVk7XG5cdCAgICB9KTtcblx0ICAgIC8vIFdhbnQgYSBwb2x5Z29uIGJldHdlZW4gZWFjaCBzdWNjZXNzaXZlIHBhaXIgb2YgaXRlbXMuIFRoZSBmb2xsb3dpbmcgY3JlYXRlcyBhIGxpc3Qgb2Zcblx0ICAgIC8vIG4gcGFpcnMsIHdoZXJlIHJlY3RbaV0gaXMgcGFpcmVkIHdpdGggcmVjdFtpKzFdLiBUaGUgbGFzdCBwYWlyIGNvbnNpc3RzIG9mIHRoZSBsYXN0XG5cdCAgICAvLyByZWN0YW5nbGUgcGFpcmVkIHdpdGggdW5kZWZpbmVkLiAoV2Ugd2FudCB0aGlzLilcblx0ICAgIGxldCBwYWlycyA9IHJlY3RzLm1hcCgociwgaSkgPT4gW3IscmVjdHNbaSsxXV0pO1xuXHQgICAgLy8gQWRkIGEgY2xhc3MgKFwiY3VycmVudFwiKSBmb3IgdGhlIHBvbHlnb25zIGFzc29jaWF0ZWQgd2l0aCB0aGUgbW91c2VvdmVyIGZlYXR1cmUgc28gdGhleVxuXHQgICAgLy8gY2FuIGJlIGRpc3Rpbmd1aXNoZWQgZnJvbSBvdGhlcnMuXG5cdCAgICBkYXRhLnB1c2goeyBmaWQ6IGssIHJlY3RzOiBwYWlycywgY2xzOiAoY3VyckZlYXQgJiYgY3VyckZlYXQuaWQgPT09IGsgPyAnY3VycmVudCcgOiAnJykgfSk7XG5cdH1cblx0dGhpcy5kcmF3RmlkdWNpYWxzKGRhdGEsIGN1cnJGZWF0KTtcblxuXHQvLyBGSVhNRTogcmVhY2hvdmVyXG5cdHRoaXMuYXBwLmZlYXR1cmVEZXRhaWxzLnVwZGF0ZShjdXJyRmVhdCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgcG9seWdvbnMgdGhhdCBjb25uZWN0IGhpZ2hsaWdodGVkIGZlYXR1cmVzIGluIHRoZSB2aWV3XG4gICAgLy8gQXJnczpcbiAgICAvLyAgIGRhdGEgOiBsaXN0IG9mIHtcbiAgICAvLyAgICAgICBmaWQ6IGZlYXR1cmUtaWQsIFxuICAgIC8vICAgICAgIGNsczogZXh0cmEgY2xhc3MgZm9yIC5mZWF0dXJlTWFyayBncm91cCxcbiAgICAvLyAgICAgICByZWN0czogbGlzdCBvZiBbcmVjdDEscmVjdDJdIHBhaXJzLCBcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICBjdXJyRmVhdCA6IGN1cnJlbnQgKG1vdXNlb3ZlcikgZmVhdHVyZSAoaWYgYW55KVxuICAgIC8vXG4gICAgZHJhd0ZpZHVjaWFscyAoZGF0YSwgY3VyckZlYXQpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHQvL1xuXHQvLyBwdXQgZmlkdWNpYWwgbWFya3MgaW4gdGhlaXIgb3duIGdyb3VwIFxuXHRsZXQgZkdycCA9IHRoaXMuZmlkdWNpYWxzLmNsYXNzZWQoXCJoaWRkZW5cIiwgZmFsc2UpO1xuXG5cdC8vIEJpbmQgZmlyc3QgbGV2ZWwgZGF0YSB0byBcImZlYXR1cmVNYXJrc1wiIGdyb3Vwc1xuXHRsZXQgZmZHcnBzID0gZkdycC5zZWxlY3RBbGwoXCJnLmZlYXR1cmVNYXJrc1wiKVxuXHQgICAgLmRhdGEoZGF0YSwgZCA9PiBkLmZpZCk7XG5cdGZmR3Jwcy5lbnRlcigpLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBkID0+IGQuZmlkKTtcblx0ZmZHcnBzLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0ZmZHcnBzLmF0dHIoXCJjbGFzc1wiLGQgPT4gXCJmZWF0dXJlTWFya3MgXCIgKyAoZC5jbHMgfHwgXCJcIikpXG5cblx0Ly8gRHJhdyBmZWF0dXJlIGxhYmVscy4gRWFjaCBsYWJlbCBpcyBkcmF3biBvbmNlLCBhYm92ZSB0aGUgZmlyc3QgcmVjdGFuZ2xlIGluIGl0cyBsaXN0LlxuXHQvLyBcblx0bGV0IGxhYmVscyA9IGZmR3Jwcy5zZWxlY3RBbGwoJ3RleHQuZmVhdExhYmVsJylcblx0ICAgIC5kYXRhKGQgPT4gW3sgZmlkOiBkLmZpZCwgcmVjdDogZC5yZWN0c1swXVswXSwgdHJlY3Q6IGNvb3Jkc0FmdGVyVHJhbnNmb3JtKGQucmVjdHNbMF1bMF0pIH1dKTtcblx0bGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCdmZWF0TGFiZWwnKTtcblx0bGFiZWxzLmV4aXQoKS5yZW1vdmUoKTtcblx0bGFiZWxzXG5cdCAgLmF0dHIoXCJ4XCIsIGQgPT4gZC50cmVjdC54ICsgZC50cmVjdC53aWR0aC8yIClcblx0ICAuYXR0cihcInlcIiwgZCA9PiBkLnJlY3QuX19kYXRhX18uZ2Vub21lLnpvb21ZIC0gMylcblx0ICAudGV4dChkID0+IHtcblx0ICAgICAgIGxldCBmID0gZC5yZWN0Ll9fZGF0YV9fO1xuXHQgICAgICAgbGV0IHN5bSA9IGYuc3ltYm9sIHx8IGYubWdwaWQ7XG5cdCAgICAgICByZXR1cm4gc3ltO1xuXHQgIH0pO1xuXG5cdC8vIFB1dCBhIHJlY3RhbmdsZSBiZWhpbmQgZWFjaCBsYWJlbCAoYXMgYSBiYWNrZ3JvdW5kKVxuXHRsZXQgbGJsQm94RGF0YSA9IGxhYmVscy5tYXAobGJsID0+IGxibFswXS5nZXRCQm94KCkpXG5cdGxldCBsYmxCb3hlcyA9IGZmR3Jwcy5zZWxlY3RBbGwoJ3JlY3QuZmVhdExhYmVsQm94Jylcblx0ICAgIC5kYXRhKChkLGkpID0+IFtsYmxCb3hEYXRhW2ldXSk7XG5cdGxibEJveGVzLmVudGVyKCkuaW5zZXJ0KCdyZWN0JywnOmZpcnN0LWNoaWxkJykuYXR0cignY2xhc3MnLCdmZWF0TGFiZWxCb3gnKTtcblx0bGJsQm94ZXMuZXhpdCgpLnJlbW92ZSgpO1xuXHRsYmxCb3hlc1xuXHQgICAgLmF0dHIoXCJ4XCIsICAgICAgYmIgPT4gYmIueC0yKVxuXHQgICAgLmF0dHIoXCJ5XCIsICAgICAgYmIgPT4gYmIueS0xKVxuXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCAgYmIgPT4gYmIud2lkdGgrNClcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGJiID0+IGJiLmhlaWdodCsyKVxuXHQgICAgO1xuXHRcblx0Ly8gaWYgdGhlcmUgaXMgYSBjdXJyRmVhdCwgbW92ZSBpdHMgZmlkdWNpYWxzIHRvIHRoZSBlbmQgKHNvIHRoZXkncmUgb24gdG9wIG9mIGV2ZXJ5b25lIGVsc2UpXG5cdGlmIChjdXJyRmVhdCkge1xuXHQgICAgLy8gZ2V0IGxpc3Qgb2YgZ3JvdXAgZWxlbWVudHMgZnJvbSB0aGUgZDMgc2VsZWN0aW9uXG5cdCAgICBsZXQgZmZMaXN0ID0gZmZHcnBzWzBdO1xuXHQgICAgLy8gZmluZCB0aGUgb25lIHdob3NlIGZlYXR1cmUgaXMgY3VyckZlYXRcblx0ICAgIGxldCBpID0gLTE7XG5cdCAgICBmZkxpc3QuZm9yRWFjaCggKGcsaikgPT4geyBpZiAoZy5fX2RhdGFfXy5maWQgPT09IGN1cnJGZWF0LmlkKSBpID0gajsgfSk7XG5cdCAgICAvLyBpZiB3ZSBmb3VuZCBpdCBhbmQgaXQncyBub3QgYWxyZWFkeSB0aGUgbGFzdCwgbW92ZSBpdCB0byB0aGVcblx0ICAgIC8vIGxhc3QgcG9zaXRpb24gYW5kIHJlb3JkZXIgaW4gdGhlIERPTS5cblx0ICAgIGlmIChpID49IDApIHtcblx0XHRsZXQgbGFzdGkgPSBmZkxpc3QubGVuZ3RoIC0gMTtcblx0ICAgICAgICBsZXQgeCA9IGZmTGlzdFtpXTtcblx0XHRmZkxpc3RbaV0gPSBmZkxpc3RbbGFzdGldO1xuXHRcdGZmTGlzdFtsYXN0aV0gPSB4O1xuXHRcdGZmR3Jwcy5vcmRlcigpO1xuXHQgICAgfVxuXHR9XG5cdFxuXHQvLyBCaW5kIHNlY29uZCBsZXZlbCBkYXRhIChyZWN0YW5nbGUgcGFpcnMpIHRvIHBvbHlnb25zIGluIHRoZSBncm91cFxuXHRsZXQgcGdvbnMgPSBmZkdycHMuc2VsZWN0QWxsKFwicG9seWdvblwiKVxuXHQgICAgLmRhdGEoZD0+ZC5yZWN0cy5maWx0ZXIociA9PiByWzBdICYmIHJbMV0pKTtcblx0cGdvbnMuZXhpdCgpLnJlbW92ZSgpO1xuXHRwZ29ucy5lbnRlcigpLmFwcGVuZChcInBvbHlnb25cIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImZpZHVjaWFsXCIpXG5cdCAgICA7XG5cdC8vXG5cdHBnb25zLmF0dHIoXCJwb2ludHNcIiwgciA9PiB7XG5cdCAgICAvLyBwb2x5Z29uIGNvbm5lY3RzIGJvdHRvbSBjb3JuZXJzIG9mIDFzdCByZWN0IHRvIHRvcCBjb3JuZXJzIG9mIDJuZCByZWN0XG5cdCAgICBsZXQgYzEgPSBjb29yZHNBZnRlclRyYW5zZm9ybShyWzBdKTsgLy8gdHJhbnNmb3JtIGNvb3JkcyBmb3IgMXN0IHJlY3Rcblx0ICAgIGxldCBjMj0gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0oclsxXSk7ICAvLyB0cmFuc2Zvcm0gY29vcmRzIGZvciAybmQgcmVjdFxuXHQgICAgLy8gZm91ciBwb2x5Z29uIHBvaW50c1xuXHQgICAgbGV0IHMgPSBgJHtjMS54fSwke2MxLnkrYzEuaGVpZ2h0fSAke2MyLnh9LCR7YzIueX0gJHtjMi54K2MyLndpZHRofSwke2MyLnl9ICR7YzEueCtjMS53aWR0aH0sJHtjMS55K2MxLmhlaWdodH1gXG5cdCAgICByZXR1cm4gcztcblx0fSlcblx0Ly8gbW91c2luZyBvdmVyIHRoZSBmaWR1Y2lhbCBoaWdobGlnaHRzIChhcyBpZiB0aGUgdXNlciBoYWQgbW91c2VkIG92ZXIgdGhlIGZlYXR1cmUgaXRzZWxmKVxuXHQub24oXCJtb3VzZW92ZXJcIiwgKHApID0+IHtcblx0ICAgIGlmICghZDMuZXZlbnQuY3RybEtleSlcblx0ICAgICAgICB0aGlzLmhpZ2hsaWdodChwWzBdKTtcblx0fSlcblx0Lm9uKFwibW91c2VvdXRcIiwgIChwKSA9PiB7XG5cdCAgICBpZiAoIWQzLmV2ZW50LmN0cmxLZXkpXG5cdCAgICAgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZGVGaWR1Y2lhbHMgKCkge1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0KFwiZy5maWR1Y2lhbHNcIilcblx0ICAgIC5jbGFzc2VkKFwiaGlkZGVuXCIsIHRydWUpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIFpvb21WaWV3XG5cbmV4cG9ydCB7IFpvb21WaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9ab29tVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==