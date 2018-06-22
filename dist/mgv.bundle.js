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
    setRefGenomeSelection (g) {
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
    setCompGenomesSelection (glist) {
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
	this.setRefGenomeSelection(cfg.ref.name);
	this.setCompGenomesSelection(cfg.genomes.map(g=>g.name));
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
        return this.canonical2feats[mgiid] || [];
    }

    //----------------------------------------------
    // Returns a list of features that match the given label.
    // First tries matching on feature ID, then on canonical ID, and then on symbol.
    // 
    getCachedFeaturesByLabel (label) {
	let f = this.id2feat[label]
	if (f) return [f];
	return this.canonical2feats[label] || this.symbol2feats[label] || []
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
	    .call(zcs => zcs[0][0].value = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["d" /* formatCoords */])(this.coords))
	    .on("click", function () { this.select(); })
	    .on("change", function () {
		let coords = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["i" /* parseCoords */])(this.value);
		if (! coords) {
		    let feats = self.app.featureManager.getCachedFeaturesByLabel(this.value);
		    let feats2 = feats.filter(f=>f.genome == self.app.rGenome);
		    let f = feats2[0] || feats[0];
		    if (f) {
		        coords = {
			    ref: f.genome.name,
			    chr: f.chr,
			    start: f.start - 5*f.length,
			    end: f.end + 5*f.length,
			    highlight: f.id
			}
		    }
		    else {
			alert("Please enter a valid identifier or a coordinate range formatted as 'chr:start..end'. " +
			      "For example, '5:10000000..50000000'.");
			this.value = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["d" /* formatCoords */])(self.coords.chr, self.coords.start, self.coords.end);
			return;
		    }


		}
		self.app.setContext(coords);
	    });
	// zoom window size box
	this.root.select("#zoomWSize")
	    .on("click", function () { this.select(); })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjAwMjY4ZmU0YzExNmQ5Zjg5MTYiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1N0b3JhZ2VNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvU1ZHVmlldy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvdmlld2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9NR1ZBcHAuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZS5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1F1ZXJ5TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQXV4RGF0YU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYUV2YWx1YXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvTGlzdEVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvVXNlclByZWZzTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmFjZXRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GYWNldC5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQlRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9CbG9ja1RyYW5zbGF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZVZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzIiwid2VicGFjazovLy8u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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQW1CQTs7Ozs7Ozs7QUNsVkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7OztBQ3JCUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7Ozs7QUM5RFI7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUUzRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsa0JBQWtCO0FBQ3JDLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxtQkFBbUIsa0JBQWtCO0FBQ3JDLE1BQU07QUFDTjtBQUNBO0FBQ0EsNEhBQW9FLE9BQU87QUFDM0U7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxvQkFBb0I7QUFDckQsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsUUFBUSxVQUFVLEVBQUUsSUFBSTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsaUJBQWlCO0FB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QUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELGFBQWE7QUFDbEU7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRU87Ozs7Ozs7Ozs7QUMvUm9COztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUTs7Ozs7Ozs7Ozs7O0FDbkVxRDtBQUN6QztBQUNROztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7Ozs7O0FDak9zQjs7QUFFOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUTs7Ozs7Ozs7OztBQ3ZDUTs7QUFFaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7OztBQzdCUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7Ozs7O0FDcEJRO0FBQ1U7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQ0FBZ0MsYUFBYSxHQUFHLGFBQWE7QUFDN0QsZ0NBQWdDLGFBQWEsR0FBRyxhQUFhO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0Esd0RBQXdELElBQUkseUJBQXlCLElBQUk7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsNkRBQTZELGFBQWEsR0FBRyxhQUFhLFlBQVksRUFBRTtBQUN4RyxLQUFLO0FBQ0wsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7OztBQ3ZHUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFUTs7Ozs7Ozs7Ozs7QUNuSVU7QUFDYTs7QUFFL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsa0JBQWtCO0FBQ2xCLHNCQUFzQjtBQUN0QixzQkFBc0I7QUFDdEIsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsV0FBVztBQUMxRDtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixxRkFBcUY7QUFDeEc7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOENBQThDLGtCQUFrQjtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixrRkFBa0Y7QUFDckc7QUFDQTtBQUNBLGlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBOEMsa0JBQWtCO0FBQ2hFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7OztBQUdKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLCtCQUErQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Qsa0JBQWtCO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLG9DQUFvQyxPQUFPO0FBQzNDLDBDQUEwQyxJQUFJO0FBQzlDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQUk7QUFDVjtBQUNBLDRCQUE0Qix1Q0FBdUM7QUFDbkUsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxJQUFJO0FBQ047QUFDQSw2QkFBNkIsc0NBQXNDO0FBQ25FLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7Ozs7O0FDaFhZOztBQUVwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLHdCQUF3QixZQUFZLEVBQUUsSUFBSTtBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTRELE1BQU07QUFDbEUseUNBQXlDLElBQUksSUFBSSxNQUFNO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsTUFBTSxHQUFHLFFBQVEsSUFBSSxNQUFNLElBQUksU0FBUztBQUNqRCxTQUFTLG9CQUFvQjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YseUNBQXlDLEtBQUs7QUFDOUM7QUFDQTs7QUFFUTs7Ozs7Ozs7Ozs7O0FDL0dVO0FBQ0E7QUFDb0Q7O0FBRXRFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsdUJBQXVCO0FBQ3ZCO0FBQ0EsNEJBQTRCO0FBQzVCLHlCQUF5QjtBQUN6QixnQ0FBZ0M7O0FBRWhDO0FBQ0Esa0NBQWtDLDBCQUEwQjtBQUM1RDtBQUNBO0FBQ0EseURBQXlELFFBQVEsVUFBVSxFQUFFLElBQUk7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksd0JBQXdCO0FBQ3BDO0FBQ0EsWUFBWSwwQkFBMEI7QUFDdEM7QUFDQSxZQUFZLDBCQUEwQjtBQUN0QztBQUNBLFlBQVksOEJBQThCOztBQUUxQztBQUNBO0FBQ0EsWUFBWSx1QkFBdUI7QUFDbkM7QUFDQSxZQUFZLHVCQUF1QjtBQUNuQztBQUNBLFlBQVkseUJBQXlCO0FBQ3JDO0FBQ0EsWUFBWSx5QkFBeUI7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELDJCQUEyQixFQUFFO0FBQy9FO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxtQjtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGVBQWUsRUFBRTtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLCtCQUErQixlQUFlLEVBQUU7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU87QUFDUDtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qiw0REFBNEQ7QUFDbkYsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRTtBQUNBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixFQUFFO0FBQ3pCLHNCQUFzQixFQUFFO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsa0VBQWtFO0FBQy9GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELE9BQU87QUFDaEU7QUFDQSxnREFBZ0QsUUFBUTtBQUN4RCxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxHQUFHO0FBQzFEO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLGtDQUFrQztBQUM5RDtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQyw4Q0FBOEM7QUFDOUMsbUNBQW1DO0FBQ25DLDhCQUE4QjtBQUM5QixvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RCxPQUFPLG1CQUFtQixXQUFXO0FBQzdGO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixJQUFJO0FBQ0osT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGlDQUFpQztBQUNqQyw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELEdBQUc7QUFDdkQ7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUM3QiwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDLHlDQUF5QztBQUNyRjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEMscUJBQXFCO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyx5QkFBeUIsRUFBRTtBQUMzRCxnQ0FBZ0MseUJBQXlCLEVBQUU7QUFDM0QsZ0NBQWdDLHVCQUF1QixFQUFFO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQiw4RUFBOEU7QUFDOUY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHNJQUE4RTtBQUNoRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsMkNBQTJDLEVBQUU7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpR0FBeUM7QUFDekMsZ0dBQXdDO0FBQ3hDO0FBQ0EsZ0JBQWdCLEtBQUssR0FBRyxlQUFlLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxjQUFjLEdBQUcsS0FBSyxHQUFHLGNBQWMsR0FBRyxlQUFlO0FBQ25IO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPIiwiZmlsZSI6Im1ndi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2MDAyNjhmZTRjMTE2ZDlmODkxNiIsIlxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyAgICAgICAgICAgICAgICAgICAgVVRJTFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIChSZS0pSW5pdGlhbGl6ZXMgYW4gb3B0aW9uIGxpc3QuXG4vLyBBcmdzOlxuLy8gICBzZWxlY3RvciAoc3RyaW5nIG9yIE5vZGUpIENTUyBzZWxlY3RvciBvZiB0aGUgY29udGFpbmVyIDxzZWxlY3Q+IGVsZW1lbnQuIE9yIHRoZSBlbGVtZW50IGl0c2VsZi5cbi8vICAgb3B0cyAobGlzdCkgTGlzdCBvZiBvcHRpb24gZGF0YSBvYmplY3RzLiBNYXkgYmUgc2ltcGxlIHN0cmluZ3MuIE1heSBiZSBtb3JlIGNvbXBsZXguXG4vLyAgIHZhbHVlIChmdW5jdGlvbiBvciBudWxsKSBGdW5jdGlvbiB0byBwcm9kdWNlIHRoZSA8b3B0aW9uPiB2YWx1ZSBmcm9tIGFuIG9wdHMgaXRlbVxuLy8gICAgICAgRGVmYXVsdHMgdG8gdGhlIGlkZW50aXR5IGZ1bmN0aW9uICh4PT54KS5cbi8vICAgbGFiZWwgKGZ1bmN0aW9uIG9yIG51bGwpIEZ1bmN0aW9uIHRvIHByb2R1Y2UgdGhlIDxvcHRpb24+IGxhYmVsIGZyb20gYW4gb3B0cyBpdGVtXG4vLyAgICAgICBEZWZhdWx0cyB0byB0aGUgdmFsdWUgZnVuY3Rpb24uXG4vLyAgIG11bHRpIChib29sZWFuKSBTcGVjaWZpZXMgaWYgdGhlIGxpc3Qgc3VwcG9ydCBtdWx0aXBsZSBzZWxlY3Rpb25zLiAoZGVmYXVsdCA9IGZhbHNlKVxuLy8gICBzZWxlY3RlZCAoZnVuY3Rpb24gb3IgbnVsbCkgRnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIGEgZ2l2ZW4gb3B0aW9uIGlzIHNlbGVjdGQuXG4vLyAgICAgICBEZWZhdWx0cyB0byBkPT5GYWxzZS4gTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgb25seSBhcHBsaWVkIHRvIG5ldyBvcHRpb25zLlxuLy8gICBzb3J0QnkgKGZ1bmN0aW9uKSBPcHRpb25hbC4gSWYgcHJvdmlkZWQsIGEgY29tcGFyaXNvbiBmdW5jdGlvbiB0byB1c2UgZm9yIHNvcnRpbmcgdGhlIG9wdGlvbnMuXG4vLyAgIFx0IFRoZSBjb21wYXJpc29uIGZ1bmN0aW9uIGlzIHBhc3NlcyB0aGUgZGF0YSBvYmplY3RzIGNvcnJlc3BvbmRpbmcgdG8gdHdvIG9wdGlvbnMgYW5kIHNob3VsZFxuLy8gICBcdCByZXR1cm4gLTEsIDAgb3IgKzEuIElmIG5vdCBwcm92aWRlZCwgdGhlIG9wdGlvbiBsaXN0IHdpbGwgaGF2ZSB0aGUgc2FtZSBzb3J0IG9yZGVyIGFzIHRoZSBvcHRzIGFyZ3VtZW50LlxuLy8gUmV0dXJuczpcbi8vICAgVGhlIG9wdGlvbiBsaXN0IGluIGEgRDMgc2VsZWN0aW9uLlxuZnVuY3Rpb24gaW5pdE9wdExpc3Qoc2VsZWN0b3IsIG9wdHMsIHZhbHVlLCBsYWJlbCwgbXVsdGksIHNlbGVjdGVkLCBzb3J0QnkpIHtcblxuICAgIC8vIHNldCB1cCB0aGUgZnVuY3Rpb25zXG4gICAgbGV0IGlkZW50ID0gZCA9PiBkO1xuICAgIHZhbHVlID0gdmFsdWUgfHwgaWRlbnQ7XG4gICAgbGFiZWwgPSBsYWJlbCB8fCB2YWx1ZTtcbiAgICBzZWxlY3RlZCA9IHNlbGVjdGVkIHx8ICh4ID0+IGZhbHNlKTtcblxuICAgIC8vIHRoZSA8c2VsZWN0PiBlbHRcbiAgICBsZXQgcyA9IGQzLnNlbGVjdChzZWxlY3Rvcik7XG5cbiAgICAvLyBtdWx0aXNlbGVjdFxuICAgIHMucHJvcGVydHkoJ211bHRpcGxlJywgbXVsdGkgfHwgbnVsbCkgO1xuXG4gICAgLy8gYmluZCB0aGUgb3B0cy5cbiAgICBsZXQgb3MgPSBzLnNlbGVjdEFsbChcIm9wdGlvblwiKVxuICAgICAgICAuZGF0YShvcHRzLCBsYWJlbCk7XG4gICAgb3MuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKFwib3B0aW9uXCIpIFxuICAgICAgICAuYXR0cihcInZhbHVlXCIsIHZhbHVlKVxuICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCBvID0+IHNlbGVjdGVkKG8pIHx8IG51bGwpXG4gICAgICAgIC50ZXh0KGxhYmVsKSBcbiAgICAgICAgO1xuICAgIC8vXG4gICAgb3MuZXhpdCgpLnJlbW92ZSgpIDtcblxuICAgIC8vIHNvcnQgdGhlIHJlc3VsdHNcbiAgICBpZiAoIXNvcnRCeSkgc29ydEJ5ID0gKGEsYikgPT4ge1xuICAgIFx0bGV0IGFpID0gb3B0cy5pbmRleE9mKGEpO1xuXHRsZXQgYmkgPSBvcHRzLmluZGV4T2YoYik7XG5cdHJldHVybiBhaSAtIGJpO1xuICAgIH1cbiAgICBvcy5zb3J0KHNvcnRCeSk7XG5cbiAgICAvL1xuICAgIHJldHVybiBzO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByb21pc2lmaWVzIGEgY2FsbCB0byBkMy50c3YuXG4vLyBBcmdzOlxuLy8gICB1cmwgKHN0cmluZykgVGhlIHVybCBvZiB0aGUgdHN2IHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbGlzdCBvZiByb3cgb2JqZWN0c1xuZnVuY3Rpb24gZDN0c3YodXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkMy50c3YodXJsLCBmdW5jdGlvbihlcnJvciwgdmFsKXtcbiAgICAgICAgICAgIGVycm9yID8gcmVqZWN0KHsgc3RhdHVzOiBlcnJvci5zdGF0dXMsIHN0YXR1c1RleHQ6IGVycm9yLnN0YXR1c1RleHR9KSA6IHJlc29sdmUodmFsKTtcbiAgICAgICAgfSkgIFxuICAgIH0pOyBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcm9taXNpZmllcyBhIGNhbGwgdG8gZDMuanNvbi5cbi8vIEFyZ3M6XG4vLyAgIHVybCAoc3RyaW5nKSBUaGUgdXJsIG9mIHRoZSBqc29uIHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUganNvbiBvYmplY3QgdmFsdWUsIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvclxuZnVuY3Rpb24gZDNqc29uKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZDMuanNvbih1cmwsIGZ1bmN0aW9uKGVycm9yLCB2YWwpe1xuICAgICAgICAgICAgZXJyb3IgPyByZWplY3QoeyBzdGF0dXM6IGVycm9yLnN0YXR1cywgc3RhdHVzVGV4dDogZXJyb3Iuc3RhdHVzVGV4dH0pIDogcmVzb2x2ZSh2YWwpO1xuICAgICAgICB9KSAgXG4gICAgfSk7IFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgYSBkZWVwIGNvcHkgb2Ygb2JqZWN0IG8uIFxuLy8gQXJnczpcbi8vICAgbyAgKG9iamVjdCkgTXVzdCBiZSBhIEpTT04gb2JqZWN0IChubyBjdXJjdWxhciByZWZzLCBubyBmdW5jdGlvbnMpLlxuLy8gUmV0dXJuczpcbi8vICAgYSBkZWVwIGNvcHkgb2Ygb1xuZnVuY3Rpb24gZGVlcGMobykge1xuICAgIGlmICghbykgcmV0dXJuIG87XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG8pKTtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQYXJzZXMgYSBzdHJpbmcgb2YgdGhlIGZvcm0gXCJjaHI6c3RhcnQuLmVuZFwiLlxuLy8gUmV0dXJuczpcbi8vICAgb2JqZWN0IGNvbnRpbmluZyB0aGUgcGFyc2VkIGZpZWxkcy5cbi8vIEV4YW1wbGU6XG4vLyAgIHBhcnNlQ29vcmRzKFwiMTA6MTAwMDAwMDAuLjIwMDAwMDAwXCIpIC0+IHtjaHI6XCIxMFwiLCBzdGFydDoxMDAwMDAwMCwgZW5kOjIwMDAwMDAwfVxuZnVuY3Rpb24gcGFyc2VDb29yZHMgKGNvb3Jkcykge1xuICAgIGxldCByZSA9IC8oW146XSspOihcXGQrKVxcLlxcLihcXGQrKS87XG4gICAgbGV0IG0gPSBjb29yZHMubWF0Y2gocmUpO1xuICAgIHJldHVybiBtID8ge2NocjptWzFdLCBzdGFydDpwYXJzZUludChtWzJdKSwgZW5kOnBhcnNlSW50KG1bM10pfSA6IG51bGw7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRm9ybWF0cyBhIGNocm9tb3NvbWUgbmFtZSwgc3RhcnQgYW5kIGVuZCBwb3NpdGlvbiBhcyBhIHN0cmluZy5cbi8vIEFyZ3MgKGZvcm0gMSk6XG4vLyAgIGNvb3JkcyAob2JqZWN0KSBPZiB0aGUgZm9ybSB7Y2hyOnN0cmluZywgc3RhcnQ6aW50LCBlbmQ6aW50fVxuLy8gQXJncyAoZm9ybSAyKTpcbi8vICAgY2hyIHN0cmluZ1xuLy8gICBzdGFydCBpbnRcbi8vICAgZW5kIGludFxuLy8gUmV0dXJuczpcbi8vICAgICBzdHJpbmdcbi8vIEV4YW1wbGU6XG4vLyAgICAgZm9ybWF0Q29vcmRzKFwiMTBcIiwgMTAwMDAwMDAsIDIwMDAwMDAwKSAtPiBcIjEwOjEwMDAwMDAwLi4yMDAwMDAwMFwiXG5mdW5jdGlvbiBmb3JtYXRDb29yZHMgKGNociwgc3RhcnQsIGVuZCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG5cdGxldCBjID0gY2hyO1xuXHRjaHIgPSBjLmNocjtcblx0c3RhcnQgPSBjLnN0YXJ0O1xuXHRlbmQgPSBjLmVuZDtcbiAgICB9XG4gICAgcmV0dXJuIGAke2Nocn06JHtzdGFydH0uLiR7ZW5kfWBcbn1cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0cnVlIGlmZiB0aGUgdHdvIHJhbmdlcyBvdmVybGFwIGJ5IGF0IGxlYXN0IDEuXG4vLyBFYWNoIHJhbmdlIG11c3QgaGF2ZSBhIGNociwgc3RhcnQsIGFuZCBlbmQuXG4vL1xuZnVuY3Rpb24gb3ZlcmxhcHMgKGEsIGIpIHtcbiAgICByZXR1cm4gYS5jaHIgPT09IGIuY2hyICYmIGEuc3RhcnQgPD0gYi5lbmQgJiYgYS5lbmQgPj0gYi5zdGFydDtcbn1cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gR2l2ZW4gdHdvIHJhbmdlcywgYSBhbmQgYiwgcmV0dXJucyBhIC0gYi5cbi8vIFRoZSByZXN1bHQgaXMgYSBsaXN0IG9mIDAsIDEgb3IgMiBuZXcgcmFuZ2VzLCBkZXBlbmRpbmcgb24gYSBhbmQgYi5cbmZ1bmN0aW9uIHN1YnRyYWN0KGEsIGIpIHtcbiAgICBpZiAoYS5jaHIgIT09IGIuY2hyKSByZXR1cm4gWyBhIF07XG4gICAgbGV0IGFiTGVmdCA9IHsgY2hyOmEuY2hyLCBzdGFydDphLnN0YXJ0LCAgICAgICAgICAgICAgICAgICAgZW5kOk1hdGgubWluKGEuZW5kLCBiLnN0YXJ0LTEpIH07XG4gICAgbGV0IGFiUmlnaHQ9IHsgY2hyOmEuY2hyLCBzdGFydDpNYXRoLm1heChhLnN0YXJ0LCBiLmVuZCsxKSwgZW5kOmEuZW5kIH07XG4gICAgbGV0IGFucyA9IFsgYWJMZWZ0LCBhYlJpZ2h0IF0uZmlsdGVyKCByID0+IHIuc3RhcnQgPD0gci5lbmQgKTtcbiAgICByZXR1cm4gYW5zO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENyZWF0ZXMgYSBsaXN0IG9mIGtleSx2YWx1ZSBwYWlycyBmcm9tIHRoZSBvYmouXG5mdW5jdGlvbiBvYmoybGlzdCAobykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvKS5tYXAoayA9PiBbaywgb1trXV0pICAgIFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdHJ1ZSBpZmYgdGhlIHR3byBsaXN0cyBoYXZlIHRoZSBzYW1lIGNvbnRlbnRzIChiYXNlZCBvbiBpbmRleE9mKS5cbi8vIEJydXRlIGZvcmNlIGFwcHJvYWNoLiBCZSBjYXJlZnVsIHdoZXJlIHlvdSB1c2UgdGhpcy5cbmZ1bmN0aW9uIHNhbWUgKGFsc3QsYmxzdCkge1xuICAgcmV0dXJuIGFsc3QubGVuZ3RoID09PSBibHN0Lmxlbmd0aCAmJiBcbiAgICAgICBhbHN0LnJlZHVjZSgoYWNjLHgpID0+IChhY2MgJiYgYmxzdC5pbmRleE9mKHgpPj0wKSwgdHJ1ZSk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBZGQgYmFzaWMgc2V0IG9wcyB0byBTZXQgcHJvdG90eXBlLlxuLy8gTGlmdGVkIGZyb206IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1NldFxuU2V0LnByb3RvdHlwZS51bmlvbiA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgdW5pb24gPSBuZXcgU2V0KHRoaXMpO1xuICAgIGZvciAodmFyIGVsZW0gb2Ygc2V0Qikge1xuICAgICAgICB1bmlvbi5hZGQoZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiB1bmlvbjtcbn1cblxuU2V0LnByb3RvdHlwZS5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihzZXRCKSB7XG4gICAgdmFyIGludGVyc2VjdGlvbiA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKHZhciBlbGVtIG9mIHNldEIpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzKGVsZW0pKSB7XG4gICAgICAgICAgICBpbnRlcnNlY3Rpb24uYWRkKGVsZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnRlcnNlY3Rpb247XG59XG5cblNldC5wcm90b3R5cGUuZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgZGlmZmVyZW5jZSA9IG5ldyBTZXQodGhpcyk7XG4gICAgZm9yICh2YXIgZWxlbSBvZiBzZXRCKSB7XG4gICAgICAgIGRpZmZlcmVuY2UuZGVsZXRlKGVsZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZGlmZmVyZW5jZTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gZ2V0Q2FyZXRSYW5nZSAoZWx0KSB7XG4gICAgLy8gRklYTUU6IGRvZXMgbm90IHdvcmsgZm9yIElFXG4gICAgcmV0dXJuIFtlbHQuc2VsZWN0aW9uU3RhcnQsIGVsdC5zZWxlY3Rpb25FbmRdO1xufVxuZnVuY3Rpb24gc2V0Q2FyZXRSYW5nZSAoZWx0LCByYW5nZSkge1xuICAgIC8vIEZJWE1FOiBkb2VzIG5vdCB3b3JrIGZvciBJRVxuICAgIGVsdC5zZWxlY3Rpb25TdGFydCA9IHJhbmdlWzBdO1xuICAgIGVsdC5zZWxlY3Rpb25FbmQgICA9IHJhbmdlWzFdO1xufVxuZnVuY3Rpb24gc2V0Q2FyZXRQb3NpdGlvbiAoZWx0LCBwb3MpIHtcbiAgICBzZXRDYXJldFJhbmdlKGVsdCwgW3Bvcyxwb3NdKTtcbn1cbmZ1bmN0aW9uIG1vdmVDYXJldFBvc2l0aW9uIChlbHQsIGRlbHRhKSB7XG4gICAgc2V0Q2FyZXRQb3NpdGlvbihlbHQsIGdldENhcmV0UG9zaXRpb24oZWx0KSArIGRlbHRhKTtcbn1cbmZ1bmN0aW9uIGdldENhcmV0UG9zaXRpb24gKGVsdCkge1xuICAgIGxldCByID0gZ2V0Q2FyZXRSYW5nZShlbHQpO1xuICAgIHJldHVybiByWzFdO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdGhlIHNjcmVlbiBjb29yZGluYXRlcyBvZiBhbiBTVkcgc2hhcGUgKGNpcmNsZSwgcmVjdCwgcG9seWdvbiwgbGluZSlcbi8vIGFmdGVyIGFsbCB0cmFuc2Zvcm1zIGhhdmUgYmVlbiBhcHBsaWVkLlxuLy9cbi8vIEFyZ3M6XG4vLyAgICAgc2hhcGUgKG5vZGUpIFRoZSBTVkcgc2hhcGUuXG4vL1xuLy8gUmV0dXJuczpcbi8vICAgICBUaGUgZm9ybSBvZiB0aGUgcmV0dXJuZWQgdmFsdWUgZGVwZW5kcyBvbiB0aGUgc2hhcGUuXG4vLyAgICAgY2lyY2xlOiAgeyBjeCwgY3ksIHIgfVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBjZW50ZXIgcG9pbnQgYW5kIHRyYW5zZm9ybWVkIHJhZGl1cyAgICAgICAgIFxuLy8gICAgIGxpbmU6XHR7IHgxLCB5MSwgeDIsIHkyIH1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgZW5kcG9pbnRzXG4vLyAgICAgcmVjdDpcdHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9XG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGNvcm5lciBwb2ludCBhbmQgdHJhbnNmb3JtZWQgd2lkdGgraGVpZ2h0LlxuLy8gICAgIHBvbHlnb246IFsge3gseX0sIHt4LHl9ICwgLi4uIF1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgbGlzdCBvZiBwb2ludHNcbi8vXG4vLyBBZGFwdGVkIGZyb206IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY4NTg0NzkvcmVjdGFuZ2xlLWNvb3JkaW5hdGVzLWFmdGVyLXRyYW5zZm9ybT9ycT0xXG4vL1xuZnVuY3Rpb24gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0gKHNoYXBlKSB7XG4gICAgLy9cbiAgICBsZXQgZHNoYXBlID0gZDMuc2VsZWN0KHNoYXBlKTtcbiAgICBsZXQgc3ZnID0gc2hhcGUuY2xvc2VzdChcInN2Z1wiKTtcbiAgICBpZiAoIXN2ZykgdGhyb3cgXCJDb3VsZCBub3QgZmluZCBzdmcgYW5jZXN0b3IuXCI7XG4gICAgbGV0IHN0eXBlID0gc2hhcGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGxldCBtYXRyaXggPSBzaGFwZS5nZXRDVE0oKTtcbiAgICBsZXQgcCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgIGxldCBwMj0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgLy9cbiAgICBzd2l0Y2ggKHN0eXBlKSB7XG4gICAgLy9cbiAgICBjYXNlICdjaXJjbGUnOlxuXHRwLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImN4XCIpKTtcblx0cC55ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJjeVwiKSk7XG5cdHAyLnggPSBwLnggKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiclwiKSk7XG5cdHAyLnkgPSBwLnk7XG5cdHAgICAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRwMiAgID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdC8vIGNhbGMgbmV3IHJhZGl1cyBhcyBkaXN0YW5jZSBiZXR3ZWVuIHRyYW5zZm9ybWVkIHBvaW50c1xuXHRsZXQgZHggPSBNYXRoLmFicyhwLnggLSBwMi54KTtcblx0bGV0IGR5ID0gTWF0aC5hYnMocC55IC0gcDIueSk7XG5cdGxldCByID0gTWF0aC5zcXJ0KGR4KmR4ICsgZHkqZHkpO1xuICAgICAgICByZXR1cm4geyBjeDogcC54LCBjeTogcC55LCByOnIgfTtcbiAgICAvL1xuICAgIGNhc2UgJ3JlY3QnOlxuXHQvLyBGSVhNRTogZG9lcyBub3QgaGFuZGxlIHJvdGF0aW9ucyBjb3JyZWN0bHkuIFRvIGZpeCwgdHJhbnNsYXRlIGNvcm5lciBwb2ludHMgc2VwYXJhdGVseSBhbmQgdGhlblxuXHQvLyBjYWxjdWxhdGUgdGhlIHRyYW5zZm9ybWVkIHdpZHRoIGFuZCBoZWlnaHQuIEFzIGEgY29udmVuaWVuY2UgdG8gdGhlIHVzZXIsIG1pZ2h0IGJlIG5pY2UgdG8gcmV0dXJuXG5cdC8vIHRoZSB0cmFuc2Zvcm1lZCBjb3JuZXIgcG9pbnRzIGFuZCBwb3NzaWJseSB0aGUgZmluYWwgYW5nbGUgb2Ygcm90YXRpb24uXG5cdHAueCAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieFwiKSk7XG5cdHAueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieVwiKSk7XG5cdHAyLnggPSBwLnggKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwid2lkdGhcIikpO1xuXHRwMi55ID0gcC55ICsgcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImhlaWdodFwiKSk7XG5cdC8vXG5cdHAgID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0cDIgPSBwMi5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0Ly9cbiAgICAgICAgcmV0dXJuIHsgeDogcC54LCB5OiBwLnksIHdpZHRoOiBwMi54LXAueCwgaGVpZ2h0OiBwMi55LXAueSB9O1xuICAgIC8vXG4gICAgY2FzZSAncG9seWdvbic6XG4gICAgICAgIGxldCBwdHMgPSBkc2hhcGUuYXR0cihcInBvaW50c1wiKS50cmltKCkuc3BsaXQoLyArLyk7XG5cdHJldHVybiBwdHMubWFwKCBwdCA9PiB7XG5cdCAgICBsZXQgeHkgPSBwdC5zcGxpdChcIixcIik7XG5cdCAgICBwLnggPSBwYXJzZUZsb2F0KHh5WzBdKVxuXHQgICAgcC55ID0gcGFyc2VGbG9hdCh4eVsxXSlcblx0ICAgIHAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHQgICAgcmV0dXJuIHsgeDogcC54LCB5OiBwLnkgfTtcblx0fSk7XG4gICAgLy9cbiAgICBjYXNlICdsaW5lJzpcblx0cC54ICAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieDFcIikpO1xuXHRwLnkgICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ5MVwiKSk7XG5cdHAyLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcIngyXCIpKTtcblx0cDIueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieTJcIikpO1xuXHRwICAgICA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdHAyICAgID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG4gICAgICAgIHJldHVybiB7IHgxOiBwLngsIHkxOiBwLnksIHgyOiBwMi54LCB4MjogcDIueSB9O1xuICAgIC8vXG4gICAgLy8gRklYTUU6IGFkZCBjYXNlICd0ZXh0J1xuICAgIC8vXG5cbiAgICBkZWZhdWx0OlxuXHR0aHJvdyBcIlVuc3VwcG9ydGVkIG5vZGUgdHlwZTogXCIgKyBzdHlwZTtcbiAgICB9XG5cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZW1vdmVzIGR1cGxpY2F0ZXMgZnJvbSBhIGxpc3Qgd2hpbGUgcHJlc2VydmluZyBsaXN0IG9yZGVyLlxuLy8gQXJnczpcbi8vICAgICBsc3QgKGxpc3QpXG4vLyBSZXR1cm5zOlxuLy8gICAgIEEgcHJvY2Vzc2VkIGNvcHkgb2YgbHN0IGluIHdoaWNoIGFueSBkdXBzIGhhdmUgYmVlbiByZW1vdmVkLlxuZnVuY3Rpb24gcmVtb3ZlRHVwcyAobHN0KSB7XG4gICAgbGV0IGxzdDIgPSBbXTtcbiAgICBsZXQgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICBsc3QuZm9yRWFjaCh4ID0+IHtcblx0Ly8gcmVtb3ZlIGR1cHMgd2hpbGUgcHJlc2VydmluZyBvcmRlclxuXHRpZiAoc2Vlbi5oYXMoeCkpIHJldHVybjtcblx0bHN0Mi5wdXNoKHgpO1xuXHRzZWVuLmFkZCh4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gbHN0Mjtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB7XG4gICAgaW5pdE9wdExpc3QsXG4gICAgZDN0c3YsXG4gICAgZDNqc29uLFxuICAgIGRlZXBjLFxuICAgIHBhcnNlQ29vcmRzLFxuICAgIGZvcm1hdENvb3JkcyxcbiAgICBvdmVybGFwcyxcbiAgICBzdWJ0cmFjdCxcbiAgICBvYmoybGlzdCxcbiAgICBzYW1lLFxuICAgIGdldENhcmV0UmFuZ2UsXG4gICAgc2V0Q2FyZXRSYW5nZSxcbiAgICBzZXRDYXJldFBvc2l0aW9uLFxuICAgIG1vdmVDYXJldFBvc2l0aW9uLFxuICAgIGdldENhcmV0UG9zaXRpb24sXG4gICAgY29vcmRzQWZ0ZXJUcmFuc2Zvcm0sXG4gICAgcmVtb3ZlRHVwc1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgQ29tcG9uZW50IHtcbiAgICAvLyBhcHAgLSB0aGUgb3duaW5nIGFwcCBvYmplY3RcbiAgICAvLyBlbHQgbWF5IGJlIGEgc3RyaW5nIChzZWxlY3RvciksIGEgRE9NIG5vZGUsIG9yIGEgZDMgc2VsZWN0aW9uIG9mIDEgbm9kZS5cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcblx0dGhpcy5hcHAgPSBhcHBcblx0aWYgKHR5cGVvZihlbHQpID09PSBcInN0cmluZ1wiKVxuXHQgICAgLy8gZWx0IGlzIGEgQ1NTIHNlbGVjdG9yXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5zZWxlY3RBbGwpID09PSBcImZ1bmN0aW9uXCIpXG5cdCAgICAvLyBlbHQgaXMgYSBkMyBzZWxlY3Rpb25cblx0ICAgIHRoaXMucm9vdCA9IGVsdDtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSkgPT09IFwiZnVuY3Rpb25cIilcblx0ICAgIC8vIGVsdCBpcyBhIERPTSBub2RlXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRlIG1lXG4gICAgfVxufVxuXG5leHBvcnQgeyBDb21wb25lbnQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0NvbXBvbmVudC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBGZWF0dXJlIHtcbiAgICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG4gICAgICAgIHRoaXMuY2hyICAgICA9IGNmZy5jaHIgfHwgY2ZnLmNocm9tb3NvbWU7XG4gICAgICAgIHRoaXMuc3RhcnQgICA9IGNmZy5zdGFydDtcbiAgICAgICAgdGhpcy5lbmQgICAgID0gY2ZnLmVuZDtcbiAgICAgICAgdGhpcy5zdHJhbmQgID0gY2ZnLnN0cmFuZDtcbiAgICAgICAgdGhpcy50eXBlICAgID0gY2ZnLnR5cGU7XG4gICAgICAgIHRoaXMuYmlvdHlwZSA9IGNmZy5iaW90eXBlO1xuICAgICAgICB0aGlzLm1ncGlkICAgPSBjZmcubWdwaWQgfHwgY2ZnLmlkO1xuICAgICAgICB0aGlzLm1naWlkICAgPSBjZmcubWdpaWQ7XG4gICAgICAgIHRoaXMuc3ltYm9sICA9IGNmZy5zeW1ib2w7XG4gICAgICAgIHRoaXMuZ2Vub21lICA9IGNmZy5nZW5vbWU7XG5cdHRoaXMuY29udGlnICA9IHBhcnNlSW50KGNmZy5jb250aWcpO1xuXHR0aGlzLmxhbmUgICAgPSBwYXJzZUludChjZmcubGFuZSk7XG4gICAgICAgIGlmICh0aGlzLm1naWlkID09PSBcIi5cIikgdGhpcy5tZ2lpZCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLnN5bWJvbCA9PT0gXCIuXCIpIHRoaXMuc3ltYm9sID0gbnVsbDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGlkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdpaWQgfHwgdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGxhYmVsICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sIHx8IHRoaXMubWdwaWQ7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBsZW5ndGggKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbmQgLSB0aGlzLnN0YXJ0ICsgMTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0TXVuZ2VkVHlwZSAoKSB7XG5cdHJldHVybiB0aGlzLnR5cGUgPT09IFwiZ2VuZVwiID9cblx0ICAgICh0aGlzLmJpb3R5cGUgPT09IFwicHJvdGVpbl9jb2RpbmdcIiB8fCB0aGlzLmJpb3R5cGUgPT09IFwicHJvdGVpbiBjb2RpbmcgZ2VuZVwiKSA/XG5cdFx0XCJwcm90ZWluX2NvZGluZ19nZW5lXCJcblx0XHQ6XG5cdFx0dGhpcy5iaW90eXBlLmluZGV4T2YoXCJwc2V1ZG9nZW5lXCIpID49IDAgP1xuXHRcdCAgICBcInBzZXVkb2dlbmVcIlxuXHRcdCAgICA6XG5cdFx0ICAgICh0aGlzLmJpb3R5cGUuaW5kZXhPZihcIlJOQVwiKSA+PSAwIHx8IHRoaXMuYmlvdHlwZS5pbmRleE9mKFwiYW50aXNlbnNlXCIpID49IDApID9cblx0XHRcdFwibmNSTkFfZ2VuZVwiXG5cdFx0XHQ6XG5cdFx0XHR0aGlzLmJpb3R5cGUuaW5kZXhPZihcInNlZ21lbnRcIikgPj0gMCA/XG5cdFx0XHQgICAgXCJnZW5lX3NlZ21lbnRcIlxuXHRcdFx0ICAgIDpcblx0XHRcdCAgICBcIm90aGVyX2dlbmVcIlxuXHQgICAgOlxuXHQgICAgdGhpcy50eXBlID09PSBcInBzZXVkb2dlbmVcIiA/XG5cdFx0XCJwc2V1ZG9nZW5lXCJcblx0XHQ6XG5cdFx0dGhpcy50eXBlLmluZGV4T2YoXCJnZW5lX3NlZ21lbnRcIikgPj0gMCA/XG5cdFx0ICAgIFwiZ2VuZV9zZWdtZW50XCJcblx0XHQgICAgOlxuXHRcdCAgICB0aGlzLnR5cGUuaW5kZXhPZihcIlJOQVwiKSA+PSAwID9cblx0XHRcdFwibmNSTkFfZ2VuZVwiXG5cdFx0XHQ6XG5cdFx0XHR0aGlzLnR5cGUuaW5kZXhPZihcImdlbmVcIikgPj0gMCA/XG5cdFx0XHQgICAgXCJvdGhlcl9nZW5lXCJcblx0XHRcdCAgICA6XG5cdFx0XHQgICAgXCJvdGhlcl9mZWF0dXJlX3R5cGVcIjtcbiAgICB9XG59XG5cbmV4cG9ydCB7IEZlYXR1cmUgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZlYXR1cmUuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgUFJFRklYPVwiYXBwcy5tZ3YuXCI7XG4gXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEludGVyYWN0cyB3aXRoIGxvY2FsU3RvcmFnZS5cbi8vXG5jbGFzcyBTdG9yYWdlTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUsIHN0b3JhZ2UpIHtcblx0dGhpcy5uYW1lID0gUFJFRklYK25hbWU7XG5cdHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2U7XG5cdHRoaXMubXlEYXRhT2JqID0gbnVsbDtcblx0Ly9cblx0dGhpcy5fbG9hZCgpO1xuICAgIH1cbiAgICBfbG9hZCAoKSB7XG5cdC8vIGxvYWRzIG15RGF0YU9iaiBmcm9tIHN0b3JhZ2VcbiAgICAgICAgbGV0IHMgPSB0aGlzLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLm5hbWUpO1xuXHR0aGlzLm15RGF0YU9iaiA9IHMgPyBKU09OLnBhcnNlKHMpIDoge307XG4gICAgfVxuICAgIF9zYXZlICgpIHtcblx0Ly8gd3JpdGVzIG15RGF0YU9iaiB0byBzdG9yYWdlXG4gICAgICAgIGxldCBzID0gSlNPTi5zdHJpbmdpZnkodGhpcy5teURhdGFPYmopO1xuXHR0aGlzLnN0b3JhZ2Uuc2V0SXRlbSh0aGlzLm5hbWUsIHMpXG4gICAgfVxuICAgIGdldCAobikge1xuICAgICAgICByZXR1cm4gdGhpcy5teURhdGFPYmpbbl07XG4gICAgfVxuICAgIHB1dCAobiwgdikge1xuICAgICAgICB0aGlzLm15RGF0YU9ialtuXSA9IHY7XG5cdHRoaXMuX3NhdmUoKTtcbiAgICB9XG59XG4vL1xuY2xhc3MgU2Vzc2lvblN0b3JhZ2VNYW5hZ2VyIGV4dGVuZHMgU3RvcmFnZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lKSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSk7XG4gICAgfVxufVxuLy9cbmNsYXNzIExvY2FsU3RvcmFnZU1hbmFnZXIgZXh0ZW5kcyBTdG9yYWdlTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUpIHtcbiAgICAgICAgc3VwZXIobmFtZSwgd2luZG93LmxvY2FsU3RvcmFnZSk7XG4gICAgfVxufVxuLy9cbmV4cG9ydCB7IFNlc3Npb25TdG9yYWdlTWFuYWdlciwgTG9jYWxTdG9yYWdlTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvU3RvcmFnZU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQYXJzZXMgYSBsaXN0IG9wZXJhdG9yIGV4cHJlc3Npb24sIGVnIFwiKGEgKyBiKSpjIC0gZFwiXG4vLyBSZXR1cm5zIGFuIGFic3RyYWN0IHN5bnRheCB0cmVlLlxuLy8gICAgIExlYWYgbm9kZXMgPSBsaXN0IG5hbWVzLiBUaGV5IGFyZSBzaW1wbGUgc3RyaW5ncy5cbi8vICAgICBJbnRlcmlvciBub2RlcyA9IG9wZXJhdGlvbnMuIFRoZXkgbG9vayBsaWtlOiB7bGVmdDpub2RlLCBvcDpzdHJpbmcsIHJpZ2h0Om5vZGV9XG4vLyBcbmNsYXNzIExpc3RGb3JtdWxhUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG5cdHRoaXMucl9vcCAgICA9IC9bKy1dLztcblx0dGhpcy5yX29wMiAgID0gL1sqXS87XG5cdHRoaXMucl9vcHMgICA9IC9bKCkrKi1dLztcblx0dGhpcy5yX2lkZW50ID0gL1thLXpBLVpfXVthLXpBLVowLTlfXSovO1xuXHR0aGlzLnJfcXN0ciAgPSAvXCJbXlwiXSpcIi87XG5cdHRoaXMucmUgPSBuZXcgUmVnRXhwKGAoJHt0aGlzLnJfb3BzLnNvdXJjZX18JHt0aGlzLnJfcXN0ci5zb3VyY2V9fCR7dGhpcy5yX2lkZW50LnNvdXJjZX0pYCwgJ2cnKTtcblx0Ly90aGlzLnJlID0gLyhbKCkrKi1dfFwiW15cIl0rXCJ8W2EtekEtWl9dW2EtekEtWjAtOV9dKikvZ1xuXHR0aGlzLl9pbml0KFwiXCIpO1xuICAgIH1cbiAgICBfaW5pdCAocykge1xuICAgICAgICB0aGlzLmV4cHIgPSBzO1xuXHR0aGlzLnRva2VucyA9IHRoaXMuZXhwci5tYXRjaCh0aGlzLnJlKSB8fCBbXTtcblx0dGhpcy5pID0gMDtcbiAgICB9XG4gICAgX3BlZWtUb2tlbigpIHtcblx0cmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuaV07XG4gICAgfVxuICAgIF9uZXh0VG9rZW4gKCkge1xuXHRsZXQgdDtcbiAgICAgICAgaWYgKHRoaXMuaSA8IHRoaXMudG9rZW5zLmxlbmd0aCkge1xuXHQgICAgdCA9IHRoaXMudG9rZW5zW3RoaXMuaV07XG5cdCAgICB0aGlzLmkgKz0gMTtcblx0fVxuXHRyZXR1cm4gdDtcbiAgICB9XG4gICAgX2V4cHIgKCkge1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuX3Rlcm0oKTtcblx0bGV0IG9wID0gdGhpcy5fcGVla1Rva2VuKCk7XG5cdGlmIChvcCA9PT0gXCIrXCIgfHwgb3AgPT09IFwiLVwiKSB7XG5cdCAgICB0aGlzLl9uZXh0VG9rZW4oKTtcblx0ICAgIG5vZGUgPSB7IGxlZnQ6bm9kZSwgb3A6b3A9PT1cIitcIj9cInVuaW9uXCI6XCJkaWZmZXJlbmNlXCIsIHJpZ2h0OiB0aGlzLl9leHByKCkgfVxuXHQgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH0gICAgICAgICAgICAgICBcblx0ZWxzZSBpZiAob3AgPT09IFwiKVwiIHx8IG9wID09PSB1bmRlZmluZWQgfHwgb3AgPT09IG51bGwpXG5cdCAgICByZXR1cm4gbm9kZTtcblx0ZWxzZVxuXHQgICAgdGhpcy5fZXJyb3IoXCJVTklPTiBvciBJTlRFUlNFQ1RJT04gb3IgKSBvciBOVUxMXCIsIG9wKTtcbiAgICB9XG4gICAgX3Rlcm0gKCkge1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuX2ZhY3RvcigpO1xuXHRsZXQgb3AgPSB0aGlzLl9wZWVrVG9rZW4oKTtcblx0aWYgKG9wID09PSBcIipcIikge1xuXHQgICAgdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBub2RlID0geyBsZWZ0Om5vZGUsIG9wOlwiaW50ZXJzZWN0aW9uXCIsIHJpZ2h0OiB0aGlzLl9mYWN0b3IoKSB9XG5cdH1cblx0cmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIF9mYWN0b3IgKCkge1xuICAgICAgICBsZXQgdCA9IHRoaXMuX25leHRUb2tlbigpO1xuXHRpZiAodCA9PT0gXCIoXCIpe1xuXHQgICAgbGV0IG5vZGUgPSB0aGlzLl9leHByKCk7XG5cdCAgICBsZXQgbnQgPSB0aGlzLl9uZXh0VG9rZW4oKTtcblx0ICAgIGlmIChudCAhPT0gXCIpXCIpIHRoaXMuX2Vycm9yKFwiJyknXCIsIG50KTtcblx0ICAgIHJldHVybiBub2RlO1xuXHR9XG5cdGVsc2UgaWYgKHQgJiYgKHQuc3RhcnRzV2l0aCgnXCInKSkpIHtcblx0ICAgIHJldHVybiB0LnN1YnN0cmluZygxLCB0Lmxlbmd0aC0xKTtcblx0fVxuXHRlbHNlIGlmICh0ICYmIHQubWF0Y2goL1thLXpBLVpfXS8pKSB7XG5cdCAgICByZXR1cm4gdDtcblx0fVxuXHRlbHNlXG5cdCAgICB0aGlzLl9lcnJvcihcIkVYUFIgb3IgSURFTlRcIiwgdHx8XCJOVUxMXCIpO1xuXHRyZXR1cm4gdDtcblx0ICAgIFxuICAgIH1cbiAgICBfZXJyb3IgKGV4cGVjdGVkLCBzYXcpIHtcbiAgICAgICAgdGhyb3cgYFBhcnNlIGVycm9yOiBleHBlY3RlZCAke2V4cGVjdGVkfSBidXQgc2F3ICR7c2F3fS5gO1xuICAgIH1cbiAgICAvLyBQYXJzZXMgdGhlIHN0cmluZyBhbmQgcmV0dXJucyB0aGUgYWJzdHJhY3Qgc3ludGF4IHRyZWUuXG4gICAgLy8gVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGVyZSBpcyBhIHN5bnRheCBlcnJvci5cbiAgICBwYXJzZSAocykge1xuXHR0aGlzLl9pbml0KHMpO1xuXHRyZXR1cm4gdGhpcy5fZXhwcigpO1xuICAgIH1cbiAgICAvLyByZXR1cm5zIHRydWUgaWZmIHN0cmluZyBpcyBzeW50YWN0aWNhbGx5IHZhbGlkXG4gICAgaXNWYWxpZCAocykge1xuICAgICAgICB0cnkge1xuXHQgICAgdGhpcy5wYXJzZShzKTtcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9XG5cdGNhdGNoIChlKSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IExpc3RGb3JtdWxhUGFyc2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgU1ZHVmlldyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0LCBtYXJnaW5zLCByb3RhdGlvbiwgdHJhbnNsYXRpb24pIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuICAgICAgICB0aGlzLnN2ZyA9IHRoaXMucm9vdC5zZWxlY3QoXCJzdmdcIik7XG4gICAgICAgIHRoaXMuc3ZnTWFpbiA9IHRoaXMuc3ZnXG4gICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKSAgICAvLyB0aGUgbWFyZ2luLXRyYW5zbGF0ZWQgZ3JvdXBcbiAgICAgICAgICAgIC5hcHBlbmQoXCJnXCIpXHQgIC8vIG1haW4gZ3JvdXAgZm9yIHRoZSBkcmF3aW5nXG5cdCAgICAuYXR0cihcIm5hbWVcIixcInN2Z21haW5cIik7XG5cdHRoaXMub3V0ZXJXaWR0aCA9IDEwMDtcblx0dGhpcy53aWR0aCA9IDEwMDtcblx0dGhpcy5vdXRlckhlaWdodCA9IDEwMDtcblx0dGhpcy5oZWlnaHQgPSAxMDA7XG5cdHRoaXMubWFyZ2lucyA9IHt0b3A6IDE4LCByaWdodDogMTIsIGJvdHRvbTogMTIsIGxlZnQ6IDEyfTtcblx0dGhpcy5yb3RhdGlvbiA9IDA7XG5cdHRoaXMudHJhbnNsYXRpb24gPSBbMCwwXTtcblx0Ly9cbiAgICAgICAgdGhpcy5zZXRHZW9tKHt3aWR0aCwgaGVpZ2h0LCBtYXJnaW5zLCByb3RhdGlvbiwgdHJhbnNsYXRpb259KTtcbiAgICB9XG4gICAgc2V0R2VvbSAoY2ZnKSB7XG4gICAgICAgIHRoaXMub3V0ZXJXaWR0aCAgPSBjZmcud2lkdGggICAgICAgfHwgdGhpcy5vdXRlcldpZHRoO1xuICAgICAgICB0aGlzLm91dGVySGVpZ2h0ID0gY2ZnLmhlaWdodCAgICAgIHx8IHRoaXMub3V0ZXJIZWlnaHQ7XG4gICAgICAgIHRoaXMubWFyZ2lucyAgICAgPSBjZmcubWFyZ2lucyAgICAgfHwgdGhpcy5tYXJnaW5zO1xuXHR0aGlzLnJvdGF0aW9uICAgID0gdHlwZW9mKGNmZy5yb3RhdGlvbikgPT09IFwibnVtYmVyXCIgPyBjZmcucm90YXRpb24gOiB0aGlzLnJvdGF0aW9uO1xuXHR0aGlzLnRyYW5zbGF0aW9uID0gY2ZnLnRyYW5zbGF0aW9uIHx8IHRoaXMudHJhbnNsYXRpb247XG4gICAgICAgIC8vXG4gICAgICAgIHRoaXMud2lkdGggID0gdGhpcy5vdXRlcldpZHRoICAtIHRoaXMubWFyZ2lucy5sZWZ0IC0gdGhpcy5tYXJnaW5zLnJpZ2h0O1xuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMub3V0ZXJIZWlnaHQgLSB0aGlzLm1hcmdpbnMudG9wICAtIHRoaXMubWFyZ2lucy5ib3R0b207XG4gICAgICAgIC8vXG4gICAgICAgIHRoaXMuc3ZnLmF0dHIoXCJ3aWR0aFwiLCB0aGlzLm91dGVyV2lkdGgpXG4gICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMub3V0ZXJIZWlnaHQpXG4gICAgICAgICAgICAuc2VsZWN0KCdnW25hbWU9XCJzdmdtYWluXCJdJylcbiAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke3RoaXMubWFyZ2lucy5sZWZ0fSwke3RoaXMubWFyZ2lucy50b3B9KSByb3RhdGUoJHt0aGlzLnJvdGF0aW9ufSkgdHJhbnNsYXRlKCR7dGhpcy50cmFuc2xhdGlvblswXX0sJHt0aGlzLnRyYW5zbGF0aW9uWzFdfSlgKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldE1hcmdpbnMoIHRtLCBybSwgYm0sIGxtICkge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHQgICAgcm0gPSBibSA9IGxtID0gdG07XG5cdH1cblx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuXHQgICAgYm0gPSB0bTtcblx0ICAgIGxtID0gcm07XG5cdH1cblx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gNClcblx0ICAgIHRocm93IFwiQmFkIGFyZ3VtZW50cy5cIjtcbiAgICAgICAgLy9cblx0dGhpcy5zZXRHZW9tKHt0b3A6IHRtLCByaWdodDogcm0sIGJvdHRvbTogYm0sIGxlZnQ6IGxtfSk7XG5cdC8vXG5cdHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByb3RhdGUgKGRlZykge1xuICAgICAgICB0aGlzLnNldEdlb20oe3JvdGF0aW9uOmRlZ30pO1xuXHRyZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdHJhbnNsYXRlIChkeCwgZHkpIHtcbiAgICAgICAgdGhpcy5zZXRHZW9tKHt0cmFuc2xhdGlvbjpbZHgsZHldfSk7XG5cdHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgdGhlIHdpbmRvdyB3aWR0aFxuICAgIGZpdFRvV2lkdGggKHdpZHRoKSB7XG4gICAgICAgIGxldCByID0gdGhpcy5zdmdbMF1bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMuc2V0R2VvbSh7d2lkdGg6IHdpZHRoIC0gci54fSlcblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuXG59IC8vIGVuZCBjbGFzcyBTVkdWaWV3XG5cbmV4cG9ydCB7IFNWR1ZpZXcgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1NWR1ZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTUdWQXBwIH0gZnJvbSAnLi9NR1ZBcHAnO1xuaW1wb3J0IHsgcmVtb3ZlRHVwcyB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy9cbi8vIHBxc3RyaW5nID0gUGFyc2UgcXN0cmluZy4gUGFyc2VzIHRoZSBwYXJhbWV0ZXIgcG9ydGlvbiBvZiB0aGUgVVJMLlxuLy9cbmZ1bmN0aW9uIHBxc3RyaW5nIChxc3RyaW5nKSB7XG4gICAgLy9cbiAgICBsZXQgY2ZnID0ge307XG5cbiAgICAvLyBGSVhNRTogVVJMU2VhcmNoUGFyYW1zIEFQSSBpcyBub3Qgc3VwcG9ydGVkIGluIGFsbCBicm93c2Vycy5cbiAgICAvLyBPSyBmb3IgZGV2ZWxvcG1lbnQgYnV0IG5lZWQgYSBmYWxsYmFjayBldmVudHVhbGx5LlxuICAgIGxldCBwcm1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhxc3RyaW5nKTtcbiAgICBsZXQgZ2Vub21lcyA9IFtdO1xuXG4gICAgLy8gLS0tLS0gZ2Vub21lcyAtLS0tLS0tLS0tLS1cbiAgICBsZXQgcGdlbm9tZXMgPSBwcm1zLmdldChcImdlbm9tZXNcIikgfHwgXCJcIjtcbiAgICAvLyBGb3Igbm93LCBhbGxvdyBcImNvbXBzXCIgYXMgc3lub255bSBmb3IgXCJnZW5vbWVzXCIuIEV2ZW50dWFsbHksIGRvbid0IHN1cHBvcnQgXCJjb21wc1wiLlxuICAgIHBnZW5vbWVzID0gKHBnZW5vbWVzICsgIFwiIFwiICsgKHBybXMuZ2V0KFwiY29tcHNcIikgfHwgXCJcIikpO1xuICAgIC8vXG4gICAgcGdlbm9tZXMgPSByZW1vdmVEdXBzKHBnZW5vbWVzLnRyaW0oKS5zcGxpdCgvICsvKSk7XG4gICAgcGdlbm9tZXMubGVuZ3RoID4gMCAmJiAoY2ZnLmdlbm9tZXMgPSBwZ2Vub21lcyk7XG5cbiAgICAvLyAtLS0tLSByZWYgZ2Vub21lIC0tLS0tLS0tLS0tLVxuICAgIGxldCByZWYgPSBwcm1zLmdldChcInJlZlwiKTtcbiAgICByZWYgJiYgKGNmZy5yZWYgPSByZWYpO1xuXG4gICAgLy8gLS0tLS0gaGlnaGxpZ2h0IElEcyAtLS0tLS0tLS0tLS0tLVxuICAgIGxldCBobHMgPSBuZXcgU2V0KCk7XG4gICAgbGV0IGhsczAgPSBwcm1zLmdldChcImhpZ2hsaWdodFwiKTtcbiAgICBpZiAoaGxzMCkge1xuXHRobHMwID0gaGxzMC5yZXBsYWNlKC9bICxdKy9nLCAnICcpLnNwbGl0KCcgJykuZmlsdGVyKHg9PngpO1xuXHRobHMwLmxlbmd0aCA+IDAgJiYgKGNmZy5oaWdobGlnaHQgPSBobHMwKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLSBjb29yZGluYXRlcyAtLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgbGV0IGNociAgID0gcHJtcy5nZXQoXCJjaHJcIik7XG4gICAgbGV0IHN0YXJ0ID0gcHJtcy5nZXQoXCJzdGFydFwiKTtcbiAgICBsZXQgZW5kICAgPSBwcm1zLmdldChcImVuZFwiKTtcbiAgICBjaHIgICAmJiAoY2ZnLmNociA9IGNocik7XG4gICAgc3RhcnQgJiYgKGNmZy5zdGFydCA9IHBhcnNlSW50KHN0YXJ0KSk7XG4gICAgZW5kICAgJiYgKGNmZy5lbmQgPSBwYXJzZUludChlbmQpKTtcbiAgICAvL1xuICAgIC8vIC0tLS0tIGRyYXdpbmcgbW9kZSAtLS0tLS0tLS0tLS0tXG4gICAgbGV0IGRtb2RlID0gcHJtcy5nZXQoXCJkbW9kZVwiKTtcbiAgICBkbW9kZSAmJiAoY2ZnLmRtb2RlID0gZG1vZGUpO1xuICAgIC8vXG4gICAgcmV0dXJuIGNmZztcbn1cblxuXG4vLyBUaGUgbWFpbiBwcm9ncmFtLCB3aGVyZWluIHRoZSBhcHAgaXMgY3JlYXRlZCBhbmQgd2lyZWQgdG8gdGhlIGJyb3dzZXIuIFxuLy9cbmZ1bmN0aW9uIF9fbWFpbl9fIChzZWxlY3Rvcikge1xuICAgIC8vIEJlaG9sZCwgdGhlIE1HViBhcHBsaWNhdGlvbiBvYmplY3QuLi5cbiAgICBsZXQgbWd2ID0gbnVsbDtcblxuICAgIC8vIENhbGxiYWNrIHRvIHBhc3MgaW50byB0aGUgYXBwIHRvIHJlZ2lzdGVyIGNoYW5nZXMgaW4gY29udGV4dC5cbiAgICAvLyBVc2VzIHRoZSBjdXJyZW50IGFwcCBjb250ZXh0IHRvIHNldCB0aGUgaGFzaCBwYXJ0IG9mIHRoZVxuICAgIC8vIGJyb3dzZXIncyBsb2NhdGlvbi4gVGhpcyBhbHNvIHJlZ2lzdGVycyB0aGUgY2hhbmdlIGluIFxuICAgIC8vIHRoZSBicm93c2VyIGhpc3RvcnkuXG4gICAgZnVuY3Rpb24gc2V0SGFzaCAoKSB7XG5cdGxldCBuZXdIYXNoID0gbWd2LmdldFBhcmFtU3RyaW5nKCk7XG5cdGlmICgnIycrbmV3SGFzaCA9PT0gd2luZG93LmxvY2F0aW9uLmhhc2gpIHJldHVybjtcblx0Ly8gZG9uJ3Qgd2FudCB0byB0cmlnZ2VyIGFuIGluZmluaXRlIGxvb3AgaGVyZSFcblx0Ly8gdGVtcG9yYXJpbHkgZGlzYWJsZSBwb3BzdGF0ZSBoYW5kbGVyXG5cdGxldCBmID0gd2luZG93Lm9ucG9wc3RhdGU7XG5cdHdpbmRvdy5vbnBvcHN0YXRlID0gbnVsbDtcblx0Ly8gbm93IHNldCB0aGUgaGFzaFxuXHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IG5ld0hhc2g7XG5cdC8vIHJlLWVuYWJsZVxuXHR3aW5kb3cub25wb3BzdGF0ZSA9IGY7XG4gICAgfVxuICAgIC8vIEhhbmRsZXIgY2FsbGVkIHdoZW4gdXNlciBjbGlja3MgdGhlIGJyb3dzZXIncyBiYWNrIG9yIGZvcndhcmQgYnV0dG9ucy5cbiAgICAvLyBTZXRzIHRoZSBhcHAncyBjb250ZXh0IGJhc2VkIG9uIHRoZSBoYXNoIHBhcnQgb2YgdGhlIGJyb3dzZXInc1xuICAgIC8vIGxvY2F0aW9uLlxuICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0bGV0IGNmZyA9IHBxc3RyaW5nKGRvY3VtZW50LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcblx0bWd2LnNldENvbnRleHQoY2ZnKTtcbiAgICB9O1xuICAgIC8vIGdldCBpbml0aWFsIHNldCBvZiBjb250ZXh0IHBhcmFtcyBcbiAgICBsZXQgcXN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKTtcbiAgICBsZXQgY2ZnID0gcHFzdHJpbmcocXN0cmluZyk7XG4gICAgY2ZnLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgY2ZnLm9uY29udGV4dGNoYW5nZSA9IHNldEhhc2g7XG5cbiAgICAvLyBjcmVhdGUgdGhlIGFwcFxuICAgIHdpbmRvdy5tZ3YgPSBtZ3YgPSBuZXcgTUdWQXBwKHNlbGVjdG9yLCBjZmcpO1xuICAgIFxuICAgIC8vIGhhbmRsZSByZXNpemUgZXZlbnRzXG4gICAgd2luZG93Lm9ucmVzaXplID0gKCkgPT4ge21ndi5yZXNpemUoKTttZ3Yuc2V0Q29udGV4dCh7fSk7fVxufVxuXG5cbl9fbWFpbl9fKFwiI21ndlwiKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL3ZpZXdlci5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBwYXJzZUNvb3JkcywgZm9ybWF0Q29vcmRzLCBkM3RzdiwgaW5pdE9wdExpc3QsIHNhbWUgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEdlbm9tZSB9ICAgICAgICAgIGZyb20gJy4vR2Vub21lJztcbmltcG9ydCB7IENvbXBvbmVudCB9ICAgICAgIGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IEZlYXR1cmVNYW5hZ2VyIH0gIGZyb20gJy4vRmVhdHVyZU1hbmFnZXInO1xuaW1wb3J0IHsgUXVlcnlNYW5hZ2VyIH0gICAgZnJvbSAnLi9RdWVyeU1hbmFnZXInO1xuaW1wb3J0IHsgTGlzdE1hbmFnZXIgfSAgICAgZnJvbSAnLi9MaXN0TWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0RWRpdG9yIH0gICAgICBmcm9tICcuL0xpc3RFZGl0b3InO1xuaW1wb3J0IHsgVXNlclByZWZzTWFuYWdlciB9IGZyb20gJy4vVXNlclByZWZzTWFuYWdlcic7XG5pbXBvcnQgeyBGYWNldE1hbmFnZXIgfSAgICBmcm9tICcuL0ZhY2V0TWFuYWdlcic7XG5pbXBvcnQgeyBCVE1hbmFnZXIgfSAgICAgICBmcm9tICcuL0JUTWFuYWdlcic7XG5pbXBvcnQgeyBHZW5vbWVWaWV3IH0gICAgICBmcm9tICcuL0dlbm9tZVZpZXcnO1xuaW1wb3J0IHsgRmVhdHVyZURldGFpbHMgfSAgZnJvbSAnLi9GZWF0dXJlRGV0YWlscyc7XG5pbXBvcnQgeyBab29tVmlldyB9ICAgICAgICBmcm9tICcuL1pvb21WaWV3JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBNR1ZBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChzZWxlY3RvciwgY2ZnKSB7XG5cdHN1cGVyKG51bGwsIHNlbGVjdG9yKTtcblx0dGhpcy5hcHAgPSB0aGlzO1xuXHQvL1xuXHR0aGlzLmluaXRpYWxDZmcgPSBjZmc7XG5cdC8vXG5cdHRoaXMuY29udGV4dENoYW5nZWQgPSAoY2ZnLm9uY29udGV4dGNoYW5nZSB8fCBmdW5jdGlvbigpe30pO1xuXHQvL1xuXHR0aGlzLm5hbWUyZ2Vub21lID0ge307ICAvLyBtYXAgZnJvbSBnZW5vbWUgbmFtZSAtPiBnZW5vbWUgZGF0YSBvYmpcblx0dGhpcy5sYWJlbDJnZW5vbWUgPSB7fTsgLy8gbWFwIGZyb20gZ2Vub21lIGxhYmVsIC0+IGdlbm9tZSBkYXRhIG9ialxuXHR0aGlzLm5sMmdlbm9tZSA9IHt9OyAgICAvLyBjb21iaW5lcyBpbmRleGVzXG5cdC8vXG5cdHRoaXMuYWxsR2Vub21lcyA9IFtdOyAgIC8vIGxpc3Qgb2YgYWxsIGF2YWlsYWJsZSBnZW5vbWVzXG5cdHRoaXMuckdlbm9tZSA9IG51bGw7ICAgIC8vIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBnZW5vbWVcblx0dGhpcy5jR2Vub21lcyA9IFtdOyAgICAgLy8gY3VycmVudCBjb21wYXJpc29uIGdlbm9tZXMgKHJHZW5vbWUgaXMgKm5vdCogaW5jbHVkZWQpLlxuXHR0aGlzLnZHZW5vbWVzID0gW107XHQvLyBsaXN0IG9mIGFsbCBjdXJyZW50eSB2aWV3ZWQgZ2Vub21lcyAocmVmK2NvbXBzKSBpbiBZLW9yZGVyLlxuXHQvL1xuXHR0aGlzLmR1ciA9IDI1MDsgICAgICAgICAvLyBhbmltYXRpb24gZHVyYXRpb24sIGluIG1zXG5cdHRoaXMuZGVmYXVsdFpvb20gPSAyO1x0Ly8gbXVsdGlwbGllciBvZiBjdXJyZW50IHJhbmdlIHdpZHRoLiBNdXN0IGJlID49IDEuIDEgPT0gbm8gem9vbS5cblx0XHRcdFx0Ly8gKHpvb21pbmcgaW4gdXNlcyAxL3RoaXMgYW1vdW50KVxuXHR0aGlzLmRlZmF1bHRQYW4gID0gMC4xNTsvLyBmcmFjdGlvbiBvZiBjdXJyZW50IHJhbmdlIHdpZHRoXG5cdHRoaXMuY29vcmRzID0geyBjaHI6IFwiMVwiLCBzdGFydDogMTAwMDAwMCwgZW5kOiAxMDAwMDAwMCB9O1xuXHQvL1xuXHQvLyBUT0RPOiByZWZhY3RvciBwYWdlYm94LCBkcmFnZ2FibGUsIGFuZCBmcmllbmRzIGludG8gYSBmcmFtZXdvcmsgbW9kdWxlLFxuXHQvLyBcblx0dGhpcy5wYkRyYWdnZXIgPSB0aGlzLmdldENvbnRlbnREcmFnZ2VyKCk7XG5cdGQzLnNlbGVjdEFsbChcIi5wYWdlYm94XCIpXG5cdCAgICAuY2FsbCh0aGlzLnBiRHJhZ2dlcilcblx0ICAgIC5hcHBlbmQoXCJpXCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29ucyBidXN5IHJvdGF0aW5nXCIpXG5cdCAgICA7XG5cdGQzLnNlbGVjdEFsbChcIi5jbG9zYWJsZVwiKVxuXHQgICAgLmFwcGVuZChcImlcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zIGJ1dHRvbiBjbG9zZVwiKVxuXHQgICAgLm9uKFwiY2xpY2suZGVmYXVsdFwiLCBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IHAgPSBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlKTtcblx0XHRwLmNsYXNzZWQoXCJjbG9zZWRcIiwgISBwLmNsYXNzZWQoXCJjbG9zZWRcIikpO1xuXHRcdHNlbGYuc2V0UHJlZnNGcm9tVUkoKTtcblx0ICAgIH0pO1xuXHRkMy5zZWxlY3RBbGwoXCIuY29udGVudC1kcmFnZ2FibGUgPiAqXCIpXG5cdCAgICAuYXBwZW5kKFwiaVwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwibWF0ZXJpYWwtaWNvbnMgYnV0dG9uIGRyYWdoYW5kbGVcIik7XG5cdC8vXG5cdC8vXG5cdHRoaXMuZ2Vub21lVmlldyA9IG5ldyBHZW5vbWVWaWV3KHRoaXMsIFwiI2dlbm9tZVZpZXdcIiwgODAwLCAyNTApO1xuXHR0aGlzLnpvb21WaWV3ICAgPSBuZXcgWm9vbVZpZXcgICh0aGlzLCBcIiN6b29tVmlld1wiLCA4MDAsIDI1MCwgdGhpcy5jb29yZHMpO1xuXHR0aGlzLnJlc2l6ZSgpO1xuICAgICAgICAvL1xuXHR0aGlzLmZlYXR1cmVEZXRhaWxzID0gbmV3IEZlYXR1cmVEZXRhaWxzKHRoaXMsIFwiI2ZlYXR1cmVEZXRhaWxzXCIpO1xuXG5cdHRoaXMuY3NjYWxlID0gZDMuc2NhbGUuY2F0ZWdvcnkxMCgpLmRvbWFpbihbXG5cdCAgICBcInByb3RlaW5fY29kaW5nX2dlbmVcIixcblx0ICAgIFwicHNldWRvZ2VuZVwiLFxuXHQgICAgXCJuY1JOQV9nZW5lXCIsXG5cdCAgICBcImdlbmVfc2VnbWVudFwiLFxuXHQgICAgXCJvdGhlcl9nZW5lXCIsXG5cdCAgICBcIm90aGVyX2ZlYXR1cmVfdHlwZVwiXG5cdF0pO1xuXHQvL1xuXHQvL1xuXHR0aGlzLmxpc3RNYW5hZ2VyICAgID0gbmV3IExpc3RNYW5hZ2VyKHRoaXMsIFwiI215bGlzdHNcIik7XG5cdHRoaXMubGlzdE1hbmFnZXIudXBkYXRlKCk7XG5cdC8vXG5cdHRoaXMubGlzdEVkaXRvciA9IG5ldyBMaXN0RWRpdG9yKHRoaXMsICcjbGlzdGVkaXRvcicpO1xuXHQvL1xuXHR0aGlzLnRyYW5zbGF0b3IgICAgID0gbmV3IEJUTWFuYWdlcih0aGlzKTtcblx0dGhpcy5mZWF0dXJlTWFuYWdlciA9IG5ldyBGZWF0dXJlTWFuYWdlcih0aGlzKTtcblx0Ly9cblx0bGV0IHNlYXJjaFR5cGVzID0gW3tcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5RnVuY3Rpb25cIixcblx0ICAgIGxhYmVsOiBcIi4uLmJ5IGNlbGx1bGFyIGZ1bmN0aW9uXCIsXG5cdCAgICB0ZW1wbGF0ZTogXCJcIixcblx0ICAgIHBsYWNlaG9sZGVyOiBcIkdlbmUgT250b2xvZ3kgKEdPKSB0ZXJtcy9JRHNcIlxuXHR9LHtcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5UGhlbm90eXBlXCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBtdXRhbnQgcGhlbm90eXBlXCIsXG5cdCAgICB0ZW1wbGF0ZTogXCJcIixcblx0ICAgIHBsYWNlaG9sZGVyOiBcIk1hbW1hbGlhbiBQaGVub3R5cGUgKE1QKSB0ZXJtcy9JRHNcIlxuXHR9LHtcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5RGlzZWFzZVwiLFxuXHQgICAgbGFiZWw6IFwiLi4uYnkgZGlzZWFzZSBpbXBsaWNhdGlvblwiLFxuXHQgICAgdGVtcGxhdGU6IFwiXCIsXG5cdCAgICBwbGFjZWhvbGRlcjogXCJEaXNlYXNlIE9udG9sb2d5IChETykgdGVybXMvSURzXCJcblx0fSx7XG5cdCAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeUlkXCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBub21lbmNsYXR1cmVcIixcblx0ICAgIHRlbXBsYXRlOiBcIlwiLFxuXHQgICAgcGxhY2Vob2xkZXI6IFwiTUdJIG5hbWVzLCBzeW5vbnltcywgZXRjLlwiXG5cdH1dO1xuXHR0aGlzLnF1ZXJ5TWFuYWdlciA9IG5ldyBRdWVyeU1hbmFnZXIodGhpcywgXCIjZmluZEdlbmVzQm94XCIsIHNlYXJjaFR5cGVzKTtcblx0Ly9cblx0dGhpcy51c2VyUHJlZnNNYW5hZ2VyID0gbmV3IFVzZXJQcmVmc01hbmFnZXIoKTtcblx0Ly9cblx0Ly8gQnV0dG9uOiBHZWFyIGljb24gdG8gc2hvdy9oaWRlIGxlZnQgY29sdW1uXG5cdGQzLnNlbGVjdChcIiNoZWFkZXIgPiAuZ2Vhci5idXR0b25cIilcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgbGMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImxlZnRjb2x1bW5cIl0nKTtcblx0XHRsYy5jbGFzc2VkKFwiY2xvc2VkXCIsICgpID0+ICEgbGMuY2xhc3NlZChcImNsb3NlZFwiKSk7XG5cdFx0d2luZG93LnNldFRpbWVvdXQoKCk9Pntcblx0XHQgICAgdGhpcy5yZXNpemUoKVxuXHRcdCAgICB0aGlzLnNldENvbnRleHQoe30pO1xuXHRcdCAgICB0aGlzLnNldFByZWZzRnJvbVVJKCk7XG5cdFx0fSwgMjUwKTtcblx0ICAgIH0pO1xuXHRcblx0Ly9cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBGYWNldHNcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvL1xuXHR0aGlzLmZhY2V0TWFuYWdlciA9IG5ldyBGYWNldE1hbmFnZXIodGhpcyk7XG5cdGxldCBzZWxmID0gdGhpcztcblxuXHQvLyBGZWF0dXJlLXR5cGUgZmFjZXRcblx0bGV0IGZ0RmFjZXQgID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJGZWF0dXJlVHlwZVwiLCBmID0+IGYuZ2V0TXVuZ2VkVHlwZSgpKTtcblx0dGhpcy5pbml0RmVhdFR5cGVDb250cm9sKGZ0RmFjZXQpO1xuXG5cdC8vIEhhcy1NR0ktaWQgZmFjZXRcblx0bGV0IG1naUZhY2V0ID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJIYXNNZ2lJZFwiLCAgICBmID0+IGYubWdpaWQgID8gXCJ5ZXNcIiA6IFwibm9cIiApO1xuXHRkMy5zZWxlY3RBbGwoJ2lucHV0W25hbWU9XCJtZ2lGYWNldFwiXScpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCl7XG5cdCAgICBtZ2lGYWNldC5zZXRWYWx1ZXModGhpcy52YWx1ZSA9PT0gXCJcIiA/IFtdIDogW3RoaXMudmFsdWVdKTtcblx0ICAgIHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXG5cdC8vIElzLWhpZ2hsaWdodGVkIGZhY2V0XG5cdGxldCBoaUZhY2V0ID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJJc0hpXCIsIGYgPT4ge1xuXHQgICAgbGV0IGlzaGkgPSB0aGlzLnpvb21WaWV3LmhpRmVhdHNbZi5tZ2lpZF0gfHwgdGhpcy56b29tVmlldy5oaUZlYXRzW2YubWdwaWRdO1xuXHQgICAgcmV0dXJuIGlzaGkgPyBcInllc1wiIDogXCJub1wiO1xuXHR9KTtcblx0ZDMuc2VsZWN0QWxsKCdpbnB1dFtuYW1lPVwiaGlGYWNldFwiXScpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCl7XG5cdCAgICBoaUZhY2V0LnNldFZhbHVlcyh0aGlzLnZhbHVlID09PSBcIlwiID8gW10gOiBbdGhpcy52YWx1ZV0pO1xuXHQgICAgc2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0fSk7XG5cblxuXHQvL1xuXHR0aGlzLnNldFVJRnJvbVByZWZzKCk7XG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdC8vIFRoaW5ncyBhcmUgYWxsIHdpcmVkIHVwLiBOb3cgbGV0J3MgZ2V0IHNvbWUgZGF0YS5cblx0Ly8gU3RhcnQgd2l0aCB0aGUgZmlsZSBvZiBhbGwgdGhlIGdlbm9tZXMuXG5cdGQzdHN2KFwiLi9kYXRhL2dlbm9tZUxpc3QudHN2XCIpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICAvLyBjcmVhdGUgR2Vub21lIG9iamVjdHMgZnJvbSB0aGUgcmF3IGRhdGEuXG5cdCAgICB0aGlzLmFsbEdlbm9tZXMgICA9IGRhdGEubWFwKGcgPT4gbmV3IEdlbm9tZShnKSk7XG5cdCAgICB0aGlzLmFsbEdlbm9tZXMuc29ydCggKGEsYikgPT4ge1xuXHQgICAgICAgIHJldHVybiBhLmxhYmVsIDwgYi5sYWJlbCA/IC0xIDogYS5sYWJlbCA+IGIubGFiZWwgPyArMSA6IDA7XG5cdCAgICB9KTtcblx0ICAgIC8vXG5cdCAgICAvLyBidWlsZCBhIG5hbWUtPkdlbm9tZSBpbmRleFxuXHQgICAgdGhpcy5ubDJnZW5vbWUgPSB7fTsgLy8gYWxzbyBidWlsZCB0aGUgY29tYmluZWQgbGlzdCBhdCB0aGUgc2FtZSB0aW1lLi4uXG5cdCAgICB0aGlzLm5hbWUyZ2Vub21lICA9IHRoaXMuYWxsR2Vub21lc1xuXHQgICAgICAgIC5yZWR1Y2UoKGFjYyxnKSA9PiB7IHRoaXMubmwyZ2Vub21lW2cubmFtZV0gPSBhY2NbZy5uYW1lXSA9IGc7IHJldHVybiBhY2M7IH0sIHt9KTtcblx0ICAgIC8vIGJ1aWxkIGEgbGFiZWwtPkdlbm9tZSBpbmRleFxuXHQgICAgdGhpcy5sYWJlbDJnZW5vbWUgPSB0aGlzLmFsbEdlbm9tZXNcblx0ICAgICAgICAucmVkdWNlKChhY2MsZykgPT4geyB0aGlzLm5sMmdlbm9tZVtnLmxhYmVsXSA9IGFjY1tnLmxhYmVsXSA9IGc7IHJldHVybiBhY2M7IH0sIHt9KTtcblxuXHQgICAgLy9cblx0ICAgIGxldCBjZmcgPSB0aGlzLnNhbml0aXplQ2ZnKHRoaXMuaW5pdGlhbENmZyk7XG5cdCAgICBsZXQgc2VsZiA9IHRoaXM7XG5cblx0ICAgIC8vIGluaXRpYWxpemUgdGhlIHJlZiBhbmQgY29tcCBnZW5vbWUgb3B0aW9uIGxpc3RzXG5cdCAgICBpbml0T3B0TGlzdChcIiNyZWZHZW5vbWVcIiwgICB0aGlzLmFsbEdlbm9tZXMsIGc9PmcubmFtZSwgZz0+Zy5sYWJlbCwgZmFsc2UsIGcgPT4gZyA9PT0gY2ZnLnJlZik7XG5cdCAgICBpbml0T3B0TGlzdChcIiNjb21wR2Vub21lc1wiLCB0aGlzLmFsbEdlbm9tZXMsIGc9PmcubmFtZSwgZz0+Zy5sYWJlbCwgdHJ1ZSwgIGcgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihnKSAhPT0gLTEpO1xuXHQgICAgZDMuc2VsZWN0KFwiI3JlZkdlbm9tZVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0XHRzZWxmLnNldENvbnRleHQoeyByZWY6IHRoaXMudmFsdWUgfSk7XG5cdCAgICB9KTtcblx0ICAgIGQzLnNlbGVjdChcIiNjb21wR2Vub21lc1wiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0XHRsZXQgc2VsZWN0ZWROYW1lcyA9IFtdO1xuXHRcdGZvcihsZXQgeCBvZiB0aGlzLnNlbGVjdGVkT3B0aW9ucyl7XG5cdFx0ICAgIHNlbGVjdGVkTmFtZXMucHVzaCh4LnZhbHVlKTtcblx0XHR9XG5cdFx0Ly8gd2FudCB0byBwcmVzZXJ2ZSBjdXJyZW50IGdlbm9tZSBvcmRlciBhcyBtdWNoIGFzIHBvc3NpYmxlIFxuXHRcdGxldCBnTmFtZXMgPSBzZWxmLnZHZW5vbWVzLm1hcChnPT5nLm5hbWUpXG5cdFx0ICAgIC5maWx0ZXIobiA9PiB7XG5cdFx0ICAgICAgICByZXR1cm4gc2VsZWN0ZWROYW1lcy5pbmRleE9mKG4pID49IDAgfHwgbiA9PT0gc2VsZi5yR2Vub21lLm5hbWU7XG5cdFx0ICAgIH0pO1xuXHRcdGdOYW1lcyA9IGdOYW1lcy5jb25jYXQoc2VsZWN0ZWROYW1lcy5maWx0ZXIobiA9PiBnTmFtZXMuaW5kZXhPZihuKSA9PT0gLTEpKTtcblx0XHRzZWxmLnNldENvbnRleHQoeyBnZW5vbWVzOiBnTmFtZXMgfSk7XG5cdCAgICB9KTtcblx0ICAgIC8vXG5cdCAgICAvLyBQcmVsb2FkIGFsbCB0aGUgY2hyb21vc29tZSBmaWxlcyBmb3IgYWxsIHRoZSBnZW5vbWVzXG5cdCAgICBsZXQgY2RwcyA9IHRoaXMuYWxsR2Vub21lcy5tYXAoZyA9PiBkM3RzdihgLi9kYXRhL2dlbm9tZWRhdGEvJHtnLm5hbWV9LWNocm9tb3NvbWVzLnRzdmApKTtcblx0ICAgIHJldHVybiBQcm9taXNlLmFsbChjZHBzKTtcblx0fS5iaW5kKHRoaXMpKVxuXHQudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG5cdCAgICAvL1xuXHQgICAgdGhpcy5wcm9jZXNzQ2hyb21vc29tZXMoZGF0YSk7XG5cblx0ICAgIC8vIEZJTkFMTFkhIFdlIGFyZSByZWFkeSB0byBkcmF3IHRoZSBpbml0aWFsIHNjZW5lLlxuXHQgICAgdGhpcy5zZXRDb250ZXh0KHRoaXMuaW5pdGlhbENmZyk7XG5cblx0fS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcHJvY2Vzc0Nocm9tb3NvbWVzIChkYXRhKSB7XG5cdC8vIGRhdGEgaXMgYSBsaXN0IG9mIGNocm9tb3NvbWUgbGlzdHMsIG9uZSBwZXIgZ2Vub21lXG5cdC8vIEZpbGwgaW4gdGhlIGdlbm9tZUNocnMgbWFwIChnZW5vbWUgLT4gY2hyIGxpc3QpXG5cdHRoaXMuYWxsR2Vub21lcy5mb3JFYWNoKChnLGkpID0+IHtcblx0ICAgIC8vIG5pY2VseSBzb3J0IHRoZSBjaHJvbW9zb21lc1xuXHQgICAgbGV0IGNocnMgPSBkYXRhW2ldO1xuXHQgICAgZy5tYXhsZW4gPSAwO1xuXHQgICAgY2hycy5mb3JFYWNoKCBjID0+IHtcblx0XHQvL1xuXHRcdGMubGVuZ3RoID0gcGFyc2VJbnQoYy5sZW5ndGgpXG5cdFx0Zy5tYXhsZW4gPSBNYXRoLm1heChnLm1heGxlbiwgYy5sZW5ndGgpO1xuXHRcdC8vIGJlY2F1c2UgSSdkIHJhdGhlciBzYXkgXCJjaHJvbW9zb21lLm5hbWVcIiB0aGFuIFwiY2hyb21vc29tZS5jaHJvbW9zb21lXCJcblx0XHRjLm5hbWUgPSBjLmNocm9tb3NvbWU7XG5cdFx0ZGVsZXRlIGMuY2hyb21vc29tZTtcblx0ICAgIH0pO1xuXHQgICAgLy8gbmljZWx5IHNvcnQgdGhlIGNocm9tb3NvbWVzXG5cdCAgICBjaHJzLnNvcnQoKGEsYikgPT4ge1xuXHRcdGxldCBhYSA9IHBhcnNlSW50KGEubmFtZSkgLSBwYXJzZUludChiLm5hbWUpO1xuXHRcdGlmICghaXNOYU4oYWEpKSByZXR1cm4gYWE7XG5cdFx0cmV0dXJuIGEubmFtZSA8IGIubmFtZSA/IC0xIDogYS5uYW1lID4gYi5uYW1lID8gKzEgOiAwO1xuXHQgICAgfSk7XG5cdCAgICBnLmNocm9tb3NvbWVzID0gY2hycztcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXREb20gKCkge1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGdldENvbnRlbnREcmFnZ2VyICgpIHtcbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIC8vIEhlbHBlciBmdW5jdGlvbiBmb3IgdGhlIGRyYWcgYmVoYXZpb3IuIFJlb3JkZXJzIHRoZSBjb250ZW50cyBiYXNlZCBvblxuICAgICAgLy8gY3VycmVudCBzY3JlZW4gcG9zaXRpb24gb2YgdGhlIGRyYWdnZWQgaXRlbS5cbiAgICAgIGZ1bmN0aW9uIHJlb3JkZXJCeURvbSgpIHtcblx0ICAvLyBMb2NhdGUgdGhlIHNpYiB3aG9zZSBwb3NpdGlvbiBpcyBiZXlvbmQgdGhlIGRyYWdnZWQgaXRlbSBieSB0aGUgbGVhc3QgYW1vdW50XG5cdCAgbGV0IGRyID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICBsZXQgYlNpYiA9IG51bGw7XG5cdCAgbGV0IHh5ID0gZDMuc2VsZWN0KHNlbGYuZHJhZ1BhcmVudCkuY2xhc3NlZChcImZsZXhyb3dcIikgPyBcInhcIiA6IFwieVwiO1xuXHQgIGZvciAobGV0IHMgb2Ygc2VsZi5kcmFnU2licykge1xuXHQgICAgICBsZXQgc3IgPSBzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICBpZiAoZHJbeHldIDwgc3JbeHldKSB7XG5cdFx0ICAgbGV0IGRpc3QgPSBzclt4eV0gLSBkclt4eV07XG5cdFx0ICAgaWYgKCFiU2liIHx8IGRpc3QgPCBiU2liW3h5XSAtIGRyW3h5XSlcblx0XHQgICAgICAgYlNpYiA9IHM7XG5cdCAgICAgIH1cblx0ICB9XG5cdCAgLy8gSW5zZXJ0IHRoZSBkcmFnZ2VkIGl0ZW0gYmVmb3JlIHRoZSBsb2NhdGVkIHNpYiAob3IgYXBwZW5kIGlmIG5vIHNpYiBmb3VuZClcblx0ICBzZWxmLmRyYWdQYXJlbnQuaW5zZXJ0QmVmb3JlKHNlbGYuZHJhZ2dpbmcsIGJTaWIpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gcmVvcmRlckJ5U3R5bGUoKSB7XG5cdCAgbGV0IGRkID0gZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpO1xuXHQgIC8vIExvY2F0ZSB0aGUgc2liIHRoYXQgY29udGFpbnMgdGhlIGRyYWdnZWQgaXRlbSdzIG9yaWdpbi5cblx0ICBsZXQgZHIgPSBzZWxmLmRyYWdnaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIGxldCBiU2liID0gbnVsbDtcblx0ICBsZXQgeHkgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnUGFyZW50KS5jbGFzc2VkKFwiZmxleHJvd1wiKSA/IFwieFwiIDogXCJ5XCI7XG5cdCAgbGV0IHN6ID0geHkgPT09IFwieFwiID8gXCJ3aWR0aFwiIDogXCJoZWlnaHRcIjtcblx0ICBsZXQgc3R5PSB4eSA9PT0gXCJ4XCIgPyBcImxlZnRcIiA6IFwidG9wXCI7XG5cdCAgZm9yIChsZXQgcyBvZiBzZWxmLmRyYWdTaWJzKSB7XG5cdCAgICAgIC8vIHNraXAgdGhlIGRyYWdnZWQgaXRlbVxuXHQgICAgICBpZiAocyA9PT0gc2VsZi5kcmFnZ2luZykgY29udGludWU7XG5cdCAgICAgIGxldCBkcyA9IGQzLnNlbGVjdChzKTtcblx0ICAgICAgbGV0IHNyID0gcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgLy8gaWZ3IHRoZSBkcmFnZ2VkIGl0ZW0ncyBvcmlnaW4gaXMgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCBvZiBzaWIsIHdlIGZvdW5kIGl0LlxuXHQgICAgICBpZiAoZHJbeHldID49IHNyW3h5XSAmJiBkclt4eV0gPD0gKHNyW3h5XSArIHNyW3N6XSkpIHtcblx0XHQgICAvLyBtb3ZlIHNpYiB0b3dhcmQgdGhlIGhvbGUsIGFtb3VudCA9IHRoZSBzaXplIG9mIHRoZSBob2xlXG5cdFx0ICAgbGV0IGFtdCA9IHNlbGYuZHJhZ0hvbGVbc3pdICogKHNlbGYuZHJhZ0hvbGVbeHldIDwgc3JbeHldID8gLTEgOiAxKTtcblx0XHQgICBkcy5zdHlsZShzdHksIHBhcnNlSW50KGRzLnN0eWxlKHN0eSkpICsgYW10ICsgXCJweFwiKTtcblx0XHQgICBzZWxmLmRyYWdIb2xlW3h5XSAtPSBhbXQ7XG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgIH1cblx0ICB9XG4gICAgICB9XG4gICAgICAvL1xuICAgICAgcmV0dXJuIGQzLmJlaGF2aW9yLmRyYWcoKVxuXHQgIC5vcmlnaW4oZnVuY3Rpb24oZCxpKXtcblx0ICAgICAgcmV0dXJuIHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgfSlcbiAgICAgICAgICAub24oXCJkcmFnc3RhcnQubVwiLCBmdW5jdGlvbigpIHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC5zb3VyY2VFdmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICghIGQzLnNlbGVjdCh0KS5jbGFzc2VkKFwiZHJhZ2hhbmRsZVwiKSkgcmV0dXJuO1xuXHQgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgLy9cblx0ICAgICAgc2VsZi5kcmFnZ2luZyAgICA9IHRoaXMuY2xvc2VzdChcIi5wYWdlYm94XCIpO1xuXHQgICAgICBzZWxmLmRyYWdIb2xlICAgID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgc2VsZi5kcmFnUGFyZW50ICA9IHNlbGYuZHJhZ2dpbmcucGFyZW50Tm9kZTtcblx0ICAgICAgc2VsZi5kcmFnU2licyAgICA9IHNlbGYuZHJhZ1BhcmVudC5jaGlsZHJlbjtcblx0ICAgICAgLy9cblx0ICAgICAgZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCB0cnVlKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWcubVwiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICBsZXQgZGQgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZyk7XG5cdCAgICAgIGxldCB0cCA9IHBhcnNlSW50KGRkLnN0eWxlKFwidG9wXCIpKVxuXHQgICAgICBkZC5zdHlsZShcInRvcFwiLCB0cCArIGQzLmV2ZW50LmR5ICsgXCJweFwiKTtcblx0ICAgICAgLy9yZW9yZGVyQnlTdHlsZSgpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZ2VuZC5tXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIHJlb3JkZXJCeURvbSgpO1xuXHQgICAgICBzZWxmLnNldFByZWZzRnJvbVVJKCk7XG5cdCAgICAgIGxldCBkZCA9IGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKTtcblx0ICAgICAgZGQuc3R5bGUoXCJ0b3BcIiwgXCIwcHhcIik7XG5cdCAgICAgIGRkLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCBmYWxzZSk7XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgICAgPSBudWxsO1xuXHQgICAgICBzZWxmLmRyYWdIb2xlICAgID0gbnVsbDtcblx0ICAgICAgc2VsZi5kcmFnUGFyZW50ICA9IG51bGw7XG5cdCAgICAgIHNlbGYuZHJhZ1NpYnMgICAgPSBudWxsO1xuXHQgIH0pXG5cdCAgO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRVSUZyb21QcmVmcyAoKSB7XG4gICAgICAgIGxldCBwcmVmcyA9IHRoaXMudXNlclByZWZzTWFuYWdlci5nZXRBbGwoKTtcblx0Y29uc29sZS5sb2coXCJHb3QgcHJlZnMgZnJvbSBzdG9yYWdlXCIsIHByZWZzKTtcblxuXHQvLyBzZXQgb3Blbi9jbG9zZWQgc3RhdGVzXG5cdChwcmVmcy5jbG9zYWJsZXMgfHwgW10pLmZvckVhY2goIGMgPT4ge1xuXHQgICAgbGV0IGlkID0gY1swXTtcblx0ICAgIGxldCBzdGF0ZSA9IGNbMV07XG5cdCAgICBkMy5zZWxlY3QoJyMnK2lkKS5jbGFzc2VkKCdjbG9zZWQnLCBzdGF0ZSA9PT0gXCJjbG9zZWRcIiB8fCBudWxsKTtcblx0fSk7XG5cblx0Ly8gc2V0IGRyYWdnYWJsZXMnIG9yZGVyXG5cdChwcmVmcy5kcmFnZ2FibGVzIHx8IFtdKS5mb3JFYWNoKCBkID0+IHtcblx0ICAgIGxldCBjdHJJZCA9IGRbMF07XG5cdCAgICBsZXQgY29udGVudElkcyA9IGRbMV07XG5cdCAgICBsZXQgY3RyID0gZDMuc2VsZWN0KCcjJytjdHJJZCk7XG5cdCAgICBsZXQgY29udGVudHMgPSBjdHIuc2VsZWN0QWxsKCcjJytjdHJJZCsnID4gKicpO1xuXHQgICAgY29udGVudHNbMF0uc29ydCggKGEsYikgPT4ge1xuXHQgICAgICAgIGxldCBhaSA9IGNvbnRlbnRJZHMuaW5kZXhPZihhLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG5cdCAgICAgICAgbGV0IGJpID0gY29udGVudElkcy5pbmRleE9mKGIuZ2V0QXR0cmlidXRlKCdpZCcpKTtcblx0XHRyZXR1cm4gYWkgLSBiaTtcblx0ICAgIH0pO1xuXHQgICAgY29udGVudHMub3JkZXIoKTtcblx0fSk7XG4gICAgfVxuICAgIHNldFByZWZzRnJvbVVJICgpIHtcbiAgICAgICAgLy8gc2F2ZSBvcGVuL2Nsb3NlZCBzdGF0ZXNcblx0bGV0IGNsb3NhYmxlcyA9IHRoaXMucm9vdC5zZWxlY3RBbGwoJy5jbG9zYWJsZScpO1xuXHRsZXQgb2NEYXRhID0gY2xvc2FibGVzWzBdLm1hcCggYyA9PiB7XG5cdCAgICBsZXQgZGMgPSBkMy5zZWxlY3QoYyk7XG5cdCAgICByZXR1cm4gW2RjLmF0dHIoJ2lkJyksIGRjLmNsYXNzZWQoXCJjbG9zZWRcIikgPyBcImNsb3NlZFwiIDogXCJvcGVuXCJdO1xuXHR9KTtcblx0Ly8gc2F2ZSBkcmFnZ2FibGVzJyBvcmRlclxuXHRsZXQgZHJhZ0N0cnMgPSB0aGlzLnJvb3Quc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUnKTtcblx0bGV0IGRyYWdnYWJsZXMgPSBkcmFnQ3Rycy5zZWxlY3RBbGwoJy5jb250ZW50LWRyYWdnYWJsZSA+IConKTtcblx0bGV0IGRkRGF0YSA9IGRyYWdnYWJsZXMubWFwKCAoZCxpKSA9PiB7XG5cdCAgICBsZXQgY3RyID0gZDMuc2VsZWN0KGRyYWdDdHJzWzBdW2ldKTtcblx0ICAgIHJldHVybiBbY3RyLmF0dHIoJ2lkJyksIGQubWFwKCBkZCA9PiBkMy5zZWxlY3QoZGQpLmF0dHIoJ2lkJykpXTtcblx0fSk7XG5cdGxldCBwcmVmcyA9IHtcblx0ICAgIGNsb3NhYmxlczogb2NEYXRhLFxuXHQgICAgZHJhZ2dhYmxlczogZGREYXRhXG5cdH1cblx0Y29uc29sZS5sb2coXCJTYXZpbmcgcHJlZnMgdG8gc3RvcmFnZVwiLCBwcmVmcyk7XG5cdHRoaXMudXNlclByZWZzTWFuYWdlci5zZXRBbGwocHJlZnMpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93QmxvY2tzIChjb21wKSB7XG5cdGxldCByZWYgPSB0aGlzLnJHZW5vbWU7XG5cdGlmICghIGNvbXApIGNvbXAgPSB0aGlzLmNHZW5vbWVzWzBdO1xuXHRpZiAoISBjb21wKSByZXR1cm47XG5cdHRoaXMudHJhbnNsYXRvci5yZWFkeSgpLnRoZW4oICgpID0+IHtcblx0ICAgIGxldCBibG9ja3MgPSBjb21wID09PSByZWYgPyBbXSA6IHRoaXMudHJhbnNsYXRvci5nZXRCbG9ja3MocmVmLCBjb21wKTtcblx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3QmxvY2tzKHsgcmVmLCBjb21wLCBibG9ja3MgfSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93QnVzeSAoaXNCdXN5KSB7XG4gICAgICAgIGQzLnNlbGVjdChcIiNoZWFkZXIgPiAuZ2Vhci5idXR0b25cIilcblx0ICAgIC5jbGFzc2VkKFwicm90YXRpbmdcIiwgaXNCdXN5KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQXJnczpcbiAgICAvLyAgIGcgIChzdHJpbmcpIGdlbm9tZSBuYW1lIChlZyBcIm11c19jYXJvbGlcIikgb3IgbGFiZWwgKGVnIFwiQ0FST0xJL0VpSlwiKSBcbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgdHJ1ZSBpZmYgdGhlIHJlZiBnZW5vbWUgd2FzIGFjdHVhbGx5IGNoYW5nZWRcbiAgICBzZXRSZWZHZW5vbWVTZWxlY3Rpb24gKGcpIHtcblx0Ly9cblx0aWYgKCFnKSByZXR1cm4gZmFsc2U7XG5cdC8vXG5cdGxldCByZyA9IHRoaXMubmwyZ2Vub21lW2ddO1xuXHRpZiAocmcgJiYgcmcgIT09IHRoaXMuckdlbm9tZSl7XG5cdCAgICAvLyBjaGFuZ2UgdGhlIHJlZiBnZW5vbWVcblx0ICAgIHRoaXMuckdlbm9tZSA9IHJnO1xuXHQgICAgZDMuc2VsZWN0QWxsKFwiI3JlZkdlbm9tZSBvcHRpb25cIilcblx0ICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCAgZ2cgPT4gKGdnLmxhYmVsID09PSByZy5sYWJlbCAgfHwgbnVsbCkpO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgZ2xpc3QgKGxpc3Qgb2Ygc3RyaW5ncykgZ2Vub21lIG5hbWUgb3IgbGFiZWxzXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgIHRydWUgaWZmIGNvbXAgZ2Vub21lcyBhY3R1YWxseSBjaGFuZ2VkXG4gICAgc2V0Q29tcEdlbm9tZXNTZWxlY3Rpb24gKGdsaXN0KSB7XG4gICAgICAgIC8vXG4gICAgICAgIGlmICghZ2xpc3QpIHJldHVybiBmYWxzZTtcblx0Ly8gXG5cdGxldCBjZ3MgPSBbXTtcblx0Zm9yKCBsZXQgeCBvZiBnbGlzdCApIHtcblx0ICAgIGxldCBjZyA9IHRoaXMubmwyZ2Vub21lW3hdO1xuXHQgICAgY2cgJiYgY2cgIT09IHRoaXMuckdlbm9tZSAmJiBjZ3MuaW5kZXhPZihjZykgPT09IC0xICYmIGNncy5wdXNoKGNnKTtcblx0fVxuXHRsZXQgY2ducyA9IGNncy5tYXAoIGNnID0+IGNnLmxhYmVsICk7XG5cdGQzLnNlbGVjdEFsbChcIiNjb21wR2Vub21lcyBvcHRpb25cIilcblx0ICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCAgZ2cgPT4gY2ducy5pbmRleE9mKGdnLmxhYmVsKSA+PSAwKTtcblx0Ly9cblx0Ly8gY29tcGFyZSBjb250ZW50cyBvZiBjZ3Mgd2l0aCB0aGUgY3VycmVudCBjR2Vub21lcy5cblx0aWYgKHNhbWUoY2dzLCB0aGlzLmNHZW5vbWVzKSkgcmV0dXJuIGZhbHNlO1xuXHQvL1xuXHR0aGlzLmNHZW5vbWVzID0gY2dzO1xuXHRyZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyBvciByZXR1cm5zXG4gICAgc2V0SGlnaGxpZ2h0IChmbGlzdCkge1xuXHRpZiAoIWZsaXN0KSByZXR1cm4gZmFsc2U7XG5cdHRoaXMuem9vbVZpZXcuaGlGZWF0cyA9IGZsaXN0LnJlZHVjZSgoYSx2KSA9PiB7IGFbdl09djsgcmV0dXJuIGE7IH0sIHt9KTtcblx0cmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIGN1cnJlbnQgY29udGV4dCBhcyBhbiBvYmplY3QuXG4gICAgLy8gQ3VycmVudCBjb250ZXh0ID0gcmVmIGdlbm9tZSArIGNvbXAgZ2Vub21lcyArIGN1cnJlbnQgcmFuZ2UgKGNocixzdGFydCxlbmQpXG4gICAgZ2V0Q29udGV4dCAoKSB7XG4gICAgICAgIGxldCBjID0gdGhpcy56b29tVmlldy5jb29yZHM7XG4gICAgICAgIHJldHVybiB7XG5cdCAgICByZWYgOiB0aGlzLnJHZW5vbWUubGFiZWwsXG5cdCAgICBnZW5vbWVzOiB0aGlzLnZHZW5vbWVzLm1hcChnPT5nLmxhYmVsKSxcblx0ICAgIGNocjogYy5jaHIsXG5cdCAgICBzdGFydDogYy5zdGFydCxcblx0ICAgIGVuZDogYy5lbmQsXG5cdCAgICBoaWdobGlnaHQ6IE9iamVjdC5rZXlzKHRoaXMuem9vbVZpZXcuaGlGZWF0cyksXG5cdCAgICBkbW9kZTogdGhpcy56b29tVmlldy5kbW9kZVxuXHR9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBzYW5pdGl6ZWQgdmVyc2lvbiBvZiB0aGUgYXJndW1lbnQgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAgLy8gVGhlIHNhbml0aXplZCB2ZXJzaW9uOlxuICAgIC8vICAgICAtIGhhcyBhIHNldHRpbmcgZm9yIGV2ZXJ5IHBhcmFtZXRlci4gUGFyYW1ldGVycyBub3Qgc3BlY2lmaWVkIGluIFxuICAgIC8vICAgICAgIHRoZSBhcmd1bWVudCBhcmUgKGdlbmVyYWxseSkgZmlsbGVkIGluIHdpdGggdGhlaXIgY3VycmVudCB2YWx1ZXMuXG4gICAgLy8gICAgIC0gaXMgYWx3YXlzIHZhbGlkLCBlZ1xuICAgIC8vICAgICBcdC0gaGFzIGEgbGlzdCBvZiAxIG9yIG1vcmUgdmFsaWQgZ2Vub21lcywgd2l0aCBvbmUgb2YgdGhlbSBkZXNpZ25hdGVkIGFzIHRoZSByZWZcbiAgICAvLyAgICAgXHQtIGhhcyBhIHZhbGlkIGNvb3JkaW5hdGUgcmFuZ2VcbiAgICAvLyAgICAgXHQgICAgLSBzdGFydCBhbmQgZW5kIGFyZSBpbnRlZ2VycyB3aXRoIHN0YXJ0IDw9IGVuZFxuICAgIC8vICAgICBcdCAgICAtIHZhbGlkIGNocm9tb3NvbWUgZm9yIHJlZiBnZW5vbWVcbiAgICAvL1xuICAgIC8vIFRoZSBzYW5pdGl6ZWQgdmVyc2lvbiBpcyBhbHNvIFwiY29tcGlsZWRcIjpcbiAgICAvLyAgICAgLSBpdCBoYXMgYWN0dWFsIEdlbm9tZSBvYmplY3RzLCB3aGVyZSB0aGUgYXJndW1lbnQganVzdCBoYXMgbmFtZXNcbiAgICAvLyAgICAgLSBncm91cHMgdGhlIGNocitzdGFydCtlbmQgaW4gXCJjb29yZHNcIiBvYmplY3RcbiAgICAvL1xuICAgIC8vXG4gICAgc2FuaXRpemVDZmcgKGMpIHtcblx0bGV0IGNmZyA9IHt9O1xuXG5cdC8vIFNhbml0aXplIHRoZSBpbnB1dC5cblxuXHQvLyBcblx0aWYgKGMud2lkdGggfHwgYy5oZWlnaHQpIHtcblx0ICAgIGNmZy53aWR0aCA9IGMud2lkdGhcblx0fVxuXG5cdC8vXG5cdC8vIFNldCBjZmcucmVmIHRvIHNwZWNpZmllZCBnZW5vbWUsIFxuXHQvLyAgIHdpdGggZmFsbGJhY2sgdG8gY3VycmVudCByZWYgZ2Vub21lLCBcblx0Ly8gICAgICB3aXRoIGZhbGxiYWNrIHRvIEM1N0JMLzZKICgxc3QgdGltZSB0aHJ1KVxuXHQvLyBGSVhNRTogZmluYWwgZmFsbGJhY2sgc2hvdWxkIGJlIGEgY29uZmlnIHNldHRpbmcuXG5cdGNmZy5yZWYgPSAoYy5yZWYgPyB0aGlzLm5sMmdlbm9tZVtjLnJlZl0gfHwgdGhpcy5yR2Vub21lIDogdGhpcy5yR2Vub21lKSB8fCB0aGlzLm5sMmdlbm9tZVsnQzU3QkwvNkonXTtcblxuXHQvLyBTZXQgY2ZnLmdlbm9tZXMgdG8gYmUgdGhlIHNwZWNpZmllZCBnZW5vbWVzLFxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBnZW5vbWVzXG5cdC8vICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIFtyZWZdICgxc3QgdGltZSB0aHJ1KVxuXHRjZmcuZ2Vub21lcyA9IGMuZ2Vub21lcyA/XG5cdCAgICAoYy5nZW5vbWVzLm1hcChnID0+IHRoaXMubmwyZ2Vub21lW2ddKS5maWx0ZXIoeD0+eCkpXG5cdCAgICA6XG5cdCAgICB0aGlzLnZHZW5vbWVzO1xuXHQvLyBBZGQgcmVmIHRvIGdlbm9tZXMgaWYgbm90IHRoZXJlIGFscmVhZHlcblx0aWYgKGNmZy5nZW5vbWVzLmluZGV4T2YoY2ZnLnJlZikgPT09IC0xKVxuXHQgICAgY2ZnLmdlbm9tZXMudW5zaGlmdChjZmcucmVmKTtcblx0XG5cdC8vIFNldCBjZmcuY2hyIHRvIGJlIHRoZSBzcGVjaWZpZWQgY2hyb21vc29tZVxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBjaHJcblx0Ly8gICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSAxc3QgY2hyb21vc29tZSBpbiB0aGUgcmVmIGdlbm9tZVxuXHRjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKGMuY2hyKTtcblx0aWYgKCFjZmcuY2hyKSBjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKCB0aGlzLmNvb3JkcyA/IHRoaXMuY29vcmRzLmNociA6IFwiMVwiICk7XG5cdGlmICghY2ZnLmNocikgY2ZnLmNociA9IGNmZy5yZWYuZ2V0Q2hyb21vc29tZSgwKTtcblx0Ly9pZiAoIWNmZy5jaHIpIGNvbnNvbGUubG9nKFwid2FybmluZzogbm8gY2hyb21vc29tZVwiKTtcblx0XG5cdC8vIEVuc3VyZSBzdGFydCA8PSBlbmRcblx0aWYgKHR5cGVvZihjLnN0YXJ0KSA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YoYy5lbmQpID09PSBcIm51bWJlclwiICYmIGMuc3RhcnQgPiBjLmVuZCApIHtcblx0ICAgIC8vIHN3YXBcblx0ICAgIGxldCB0bXAgPSBjLnN0YXJ0OyBjLnN0YXJ0ID0gYy5lbmQ7IGMuZW5kID0gdG1wO1xuXHR9XG5cblx0Ly8gU2V0IGNmZy5zdGFydCB0byBiZSB0aGUgc3BlY2lmaWVkIHN0YXJ0XG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IHN0YXJ0XG5cdC8vICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIDFcblx0Ly8gICAgICAgICAgIHdpdGggYSBtaW4gdmFsdWUgb2YgMVxuXHRjZmcuc3RhcnQgPSBNYXRoLmZsb29yKE1hdGgubWF4KCAxLCB0eXBlb2YoYy5zdGFydCkgPT09IFwibnVtYmVyXCIgPyBjLnN0YXJ0IDogdGhpcy5jb29yZHMgPyB0aGlzLmNvb3Jkcy5zdGFydCA6IDEgKSk7XG5cblx0Ly8gU2V0IGNmZy5lbmQgdG8gYmUgdGhlIHNwZWNpZmllZCBlbmRcblx0Ly8gICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgZW5kXG5cdC8vICAgICAgICAgd2l0aCBmYWxsYmFjayB0byBzdGFydCArIDEwIE1CXG5cdGNmZy5lbmQgPSB0eXBlb2YoYy5lbmQpID09PSBcIm51bWJlclwiID9cblx0ICAgIGMuZW5kXG5cdCAgICA6XG5cdCAgICB0aGlzLmNvb3JkcyA/XG5cdCAgICAgICAgKGNmZy5zdGFydCArIHRoaXMuY29vcmRzLmVuZCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMSlcblx0XHQ6XG5cdFx0Y2ZnLnN0YXJ0O1xuXHQvLyBjbGlwIGF0IGNociBlbmRcblx0Y2ZnLmVuZCA9IE1hdGguZmxvb3IoY2ZnLmNociA/IE1hdGgubWluKGNmZy5lbmQsICAgY2ZnLmNoci5sZW5ndGgpIDogY2ZnLmVuZCk7XG5cblx0Ly8gU2V0IGNmZy5oaWdobGlnaHRcblx0Ly8gICAgd2l0aCBmYWxsYmFjayB0byBjdXJyZW50IGhpZ2hsaWdodFxuXHQvLyAgICAgICAgd2l0aCBmYWxsYmFjayB0byBbXVxuXHRjZmcuaGlnaGxpZ2h0ID0gYy5oaWdobGlnaHQgfHwgdGhpcy56b29tVmlldy5oaWdobGlnaHRlZCB8fCBbXTtcblxuXHQvLyBTZXQgdGhlIGRyYXdpbmcgbW9kZSBmb3IgdGhlIFpvb25WaWV3LlxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCB2YWx1ZVxuXHRpZiAoYy5kbW9kZSA9PT0gJ2NvbXBhcmlzb24nIHx8IGMuZG1vZGUgPT09ICdyZWZlcmVuY2UnKSBcblx0ICAgIGNmZy5kbW9kZSA9IGMuZG1vZGU7XG5cdGVsc2Vcblx0ICAgIGNmZy5kbW9kZSA9IHRoaXMuem9vbVZpZXcuZG1vZGUgfHwgJ2NvbXBhcmlzb24nO1xuXG5cdC8vXG5cdHJldHVybiBjZmc7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyB0aGUgY3VycmVudCBjb250ZXh0IGZyb20gdGhlIGNvbmZpZyBvYmplY3QuIFxuICAgIC8vIE9ubHkgdGhvc2UgY29udGV4dCBpdGVtcyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZyBhcmUgYWZmZWN0ZWQsIGV4Y2VwdCBhcyBub3RlZC5cbiAgICAvL1xuICAgIC8vIEFsbCBjb25maWdzIGFyZSBzYW5pdGl6ZWQgYmVmb3JlIGJlaW5nIGFwcGxpZWQgKHNlZSBzYW5pdGl6ZUNmZykuXG4gICAgLy8gXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBjIChvYmplY3QpIEEgY29uZmlndXJhdGlvbiBvYmplY3QgdGhhdCBzcGVjaWZpZXMgc29tZS9hbGwgY29uZmlnIHZhbHVlcy5cbiAgICAvLyAgICAgICAgIFRoZSBwb3NzaWJsZSBjb25maWcgaXRlbXM6XG4gICAgLy8gICAgICAgICAgICBnZW5vbWVzICAgKGxpc3QgbyBzdHJpbmdzKSBBbGwgdGhlIGdlbm9tZXMgeW91IHdhbnQgdG8gc2VlLCBpbiB0b3AtdG8tYm90dG9tIG9yZGVyLiBcbiAgICAvLyAgICAgICAgICAgICAgIE1heSB1c2UgaW50ZXJuYWwgbmFtZXMgb3IgZGlzcGxheSBsYWJlbHMsIGVnLCBcIm11c19tdXNjdWx1c18xMjlzMXN2aW1qXCIgb3IgXCIxMjlTMS9TdkltSlwiLlxuICAgIC8vICAgICAgICAgICAgcmVmICAgICAgIChzdHJpbmcpIFRoZSBnZW5vbWUgdG8gdXNlIGFzIHRoZSByZWZlcmVuY2UuIE1heSBiZSBuYW1lIG9yIGxhYmVsLlxuICAgIC8vICAgICAgICAgICAgY2hyICAgICAgIChzdHJpbmcpIENocm9tb3NvbWUgZm9yIGNvb3JkaW5hdGUgcmFuZ2VcbiAgICAvLyAgICAgICAgICAgIHN0YXJ0ICAgICAoaW50KSBDb29yZGluYXRlIHJhbmdlIHN0YXJ0IHBvc2l0aW9uXG4gICAgLy8gICAgICAgICAgICBlbmQgICAgICAgKGludCkgQ29vcmRpbmF0ZSByYW5nZSBlbmQgcG9zaXRpb25cbiAgICAvLyAgICAgICAgICAgIGhpZ2hsaWdodCAobGlzdCBvIHN0cmluZ3MpIElEcyBvZiBmZWF0dXJlcyB0byBoaWdobGlnaHRcbiAgICAvLyAgICAgICAgICAgIGRtb2RlICAgICAoc3RyaW5nKSBlaXRoZXIgJ2NvbXBhcmlzb24nIG9yICdyZWZlcmVuY2UnXG4gICAgLy9cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgIE5vdGhpbmdcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy9cdCAgUmVkcmF3cyBcbiAgICAvL1x0ICBDYWxscyBjb250ZXh0Q2hhbmdlZCgpIFxuICAgIC8vXG4gICAgc2V0Q29udGV4dCAoYykge1xuICAgICAgICBsZXQgY2ZnID0gdGhpcy5zYW5pdGl6ZUNmZyhjKTtcblx0Ly9cblx0dGhpcy52R2Vub21lcyA9IGNmZy5nZW5vbWVzO1xuXHR0aGlzLnJHZW5vbWUgID0gY2ZnLnJlZjtcblx0dGhpcy5jR2Vub21lcyA9IGNmZy5nZW5vbWVzLmZpbHRlcihnID0+IGcgIT09IGNmZy5yZWYpO1xuXHR0aGlzLnNldFJlZkdlbm9tZVNlbGVjdGlvbihjZmcucmVmLm5hbWUpO1xuXHR0aGlzLnNldENvbXBHZW5vbWVzU2VsZWN0aW9uKGNmZy5nZW5vbWVzLm1hcChnPT5nLm5hbWUpKTtcblx0dGhpcy5jb29yZHMgICA9IHsgY2hyOiBjZmcuY2hyLm5hbWUsIHN0YXJ0OiBjZmcuc3RhcnQsIGVuZDogY2ZnLmVuZCB9O1xuXHQvL1xuXHR0aGlzLmdlbm9tZVZpZXcucmVkcmF3KCk7XG5cdHRoaXMuZ2Vub21lVmlldy5zZXRCcnVzaENvb3Jkcyh0aGlzLmNvb3Jkcyk7XG5cdC8vXG5cdHRoaXMuem9vbVZpZXcuaGlnaGxpZ2h0ZWQgPSBjZmcuaGlnaGxpZ2h0O1xuXHR0aGlzLnpvb21WaWV3Lmdlbm9tZXMgPSB0aGlzLnZHZW5vbWVzO1xuXHR0aGlzLnpvb21WaWV3LnVwZGF0ZSh0aGlzLmNvb3Jkcyk7XG5cdC8vXG5cdHRoaXMuem9vbVZpZXcuZG1vZGUgPSBjZmcuZG1vZGU7XG5cdC8vXG5cdHRoaXMuY29udGV4dENoYW5nZWQoKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVzaXplICgpIHtcblx0bGV0IHcgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDI0O1xuXHR0aGlzLmdlbm9tZVZpZXcuZml0VG9XaWR0aCh3KTtcblx0dGhpcy56b29tVmlldy5maXRUb1dpZHRoKHcpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGNvbnRleHQgYXMgYSBwYXJhbWV0ZXIgc3RyaW5nXG4gICAgLy8gQ3VycmVudCBjb250ZXh0ID0gcmVmIGdlbm9tZSArIGNvbXAgZ2Vub21lcyArIGN1cnJlbnQgcmFuZ2UgKGNocixzdGFydCxlbmQpXG4gICAgZ2V0UGFyYW1TdHJpbmcgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuICAgICAgICBsZXQgcmVmID0gYHJlZj0ke2MucmVmfWA7XG4gICAgICAgIGxldCBnZW5vbWVzID0gYGdlbm9tZXM9JHtjLmdlbm9tZXMuam9pbihcIitcIil9YDtcblx0bGV0IGNvb3JkcyA9IGBjaHI9JHtjLmNocn0mc3RhcnQ9JHtjLnN0YXJ0fSZlbmQ9JHtjLmVuZH1gO1xuXHRsZXQgaGxzID0gYGhpZ2hsaWdodD0ke2MuaGlnaGxpZ2h0LmpvaW4oXCIrXCIpfWA7XG5cdGxldCBkbW9kZSA9IGBkbW9kZT0ke2MuZG1vZGV9YDtcblx0cmV0dXJuIGAke2Rtb2RlfSYke3JlZn0mJHtnZW5vbWVzfSYke2Nvb3Jkc30mJHtobHN9YDtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgY3VycmVudExpc3QgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyTGlzdDtcbiAgICB9XG4gICAgc2V0IGN1cnJlbnRMaXN0IChsc3QpIHtcbiAgICBcdC8vXG5cdHRoaXMuY3Vyckxpc3QgPSBsc3Q7XG5cdC8vXG5cdGxldCBsaXN0cyA9IGQzLnNlbGVjdCgnI215bGlzdHMnKS5zZWxlY3RBbGwoJy5saXN0SW5mbycpO1xuXHRsaXN0cy5jbGFzc2VkKFwiY3VycmVudFwiLCBkID0+IGQgPT09IGxzdCk7XG5cdGlmIChsc3QpIHtcblx0ICAgIC8vIG1ha2UgdGhpcyBsaXN0IHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpbiB0aGUgem9vbSB2aWV3XG5cdCAgICB0aGlzLnpvb21WaWV3LmhpRmVhdHMgPSBsc3QuaWRzLnJlZHVjZSgoYSx2KSA9PiB7IGFbdl09djsgcmV0dXJuIGE7IH0sIHt9KVxuXHQgICAgdGhpcy56b29tVmlldy51cGRhdGUoKTtcblx0ICAgIC8vIHNob3cgdGhpcyBsaXN0IGFzIHRpY2sgbWFya3MgaW4gdGhlIGdlbm9tZSB2aWV3XG5cdCAgICB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzQnlJZCh0aGlzLnJHZW5vbWUsIGxzdC5pZHMpXG5cdFx0LnRoZW4oIGZlYXRzID0+IHtcblx0XHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdUaWNrcyhmZWF0cyk7XG5cdFx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3VGl0bGUoKTtcblx0XHR9KTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuem9vbVZpZXcuaGlGZWF0cyA9IHt9O1xuXHQgICAgdGhpcy56b29tVmlldy51cGRhdGUoKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd1RpY2tzKFtdKTtcblx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3VGl0bGUoKTtcblx0fVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNhbml0aXplQ29vcmRzKGNvb3Jkcykge1xuXHRpZiAodHlwZW9mKGNvb3JkcykgPT09IFwic3RyaW5nXCIpIFxuXHQgICAgY29vcmRzID0gcGFyc2VDb29yZHMoY29vcmRzKTtcblx0bGV0IGNocm9tb3NvbWUgPSB0aGlzLnJHZW5vbWUuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSBjb29yZHMuY2hyKVswXTtcblx0aWYgKCEgY2hyb21vc29tZSkgcmV0dXJuIG51bGw7XG5cdGlmIChjb29yZHMuc3RhcnQgPiBjb29yZHMuZW5kKSB7XG5cdCAgICBsZXQgdG1wID0gY29vcmRzLnN0YXJ0OyBjb29yZHMuc3RhcnQgPSBjb29yZHMuZW5kOyBjb29yZHMuZW5kID0gdG1wO1xuXHR9XG5cdGNvb3Jkcy5zdGFydCA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3IoY29vcmRzLnN0YXJ0KSlcblx0Y29vcmRzLmVuZCAgID0gTWF0aC5taW4oY2hyb21vc29tZS5sZW5ndGgsIE1hdGguZmxvb3IoY29vcmRzLmVuZCkpXG4gICAgICAgIHJldHVybiBjb29yZHM7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gWm9vbXMgaW4vb3V0IGJ5IGZhY3Rvci4gTmV3IHpvb20gd2lkdGggaXMgZmFjdG9yICogdGhlIGN1cnJlbnQgem9vbSB3aWR0aC5cbiAgICAvLyBGYWN0b3IgPiAxIHpvb21zIG91dCwgMCA8IGZhY3RvciA8IDEgem9vbXMgaW4uXG4gICAgem9vbSAoZmFjdG9yKSB7XG5cblx0bGV0IGxlbiA9IHRoaXMuY29vcmRzLmVuZCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMTtcblx0bGV0IG5ld2xlbiA9IE1hdGgucm91bmQoZmFjdG9yICogbGVuKTtcblx0bGV0IHggPSAodGhpcy5jb29yZHMuc3RhcnQgKyB0aGlzLmNvb3Jkcy5lbmQpLzI7XG5cdGxldCBuZXdzdGFydCA9IE1hdGgucm91bmQoeCAtIG5ld2xlbi8yKTtcblx0dGhpcy5zZXRDb250ZXh0KHsgY2hyOiB0aGlzLmNvb3Jkcy5jaHIsIHN0YXJ0OiBuZXdzdGFydCwgZW5kOiBuZXdzdGFydCArIG5ld2xlbiAtIDEgfSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUGFucyB0aGUgdmlldyBsZWZ0IG9yIHJpZ2h0IGJ5IGZhY3Rvci4gVGhlIGRpc3RhbmNlIG1vdmVkIGlzIGZhY3RvciB0aW1lcyB0aGUgY3VycmVudCB6b29tIHdpZHRoLlxuICAgIC8vIE5lZ2F0aXZlIHZhbHVlcyBwYW4gbGVmdC4gUG9zaXRpdmUgdmFsdWVzIHBhbiByaWdodC4gKE5vdGUgdGhhdCBwYW5uaW5nIG1vdmVzIHRoZSBcImNhbWVyYVwiLiBQYW5uaW5nIHRvIHRoZVxuICAgIC8vIHJpZ2h0IG1ha2VzIHRoZSBvYmplY3RzIGluIHRoZSBzY2VuZSBhcHBlYXIgdG8gbW92ZSB0byB0aGUgbGVmdCwgYW5kIHZpY2UgdmVyc2EuKVxuICAgIC8vXG4gICAgcGFuIChmYWN0b3IsIGFuaW1hdGUpIHtcblx0bGV0IHdpZHRoID0gdGhpcy5jb29yZHMuZW5kIC0gdGhpcy5jb29yZHMuc3RhcnQgKyAxO1xuXHRsZXQgcGFuRGlzdCA9IGZhY3RvciAqICh0aGlzLnpvb21WaWV3LnhzY2FsZS5yYW5nZSgpWzFdKTtcblx0bGV0IGQgPSBNYXRoLnJvdW5kKGZhY3RvciAqIHdpZHRoKTtcblx0bGV0IG5zO1xuXHRsZXQgbmU7XG5cdGlmIChkIDwgMCkge1xuXHQgICAgbnMgPSBNYXRoLm1heCgxLCB0aGlzLmNvb3Jkcy5zdGFydCtkKTtcblx0ICAgIG5lID0gbnMgKyB3aWR0aCAtIDE7XG5cdH1cblx0ZWxzZSBpZiAoZCA+IDApIHtcblx0ICAgIGxldCBjaHJvbW9zb21lID0gdGhpcy5yR2Vub21lLmNocm9tb3NvbWVzLmZpbHRlcihjID0+IGMubmFtZSA9PT0gdGhpcy5jb29yZHMuY2hyKVswXTtcblx0ICAgIG5lID0gTWF0aC5taW4oY2hyb21vc29tZS5sZW5ndGgsIHRoaXMuY29vcmRzLmVuZCtkKVxuXHQgICAgbnMgPSBuZSAtIHdpZHRoICsgMTtcblx0fVxuXHQvLyB0aGlzIHByb2JhYmx5IGRvZXNuJ3QgYmVsb25nIGhlcmUgYnV0IGZvciBub3cuLi5cblx0Ly8gVG8gZ2V0IGEgc21vb3RoIHBhbm5pbmcgZWZmZWN0OiBpbml0aWFsaXplIHRoZSB0cmFuc2xhdGlvbiB0byB0aGUgc2FtZSBhc1xuXHQvLyB0aGUgcGFuIGRpc3RhbmNlLCBidXQgaW4gdGhlIG9wcG9zaXRlIGRpcmVjdGlvbi4uLlxuXHQvL3RoaXMuem9vbVZpZXcuc3ZnXG5cdCAgICAvLy5zdHlsZShcInRyYW5zaXRpb25cIiwgXCJ0cmFuc2Zvcm0gMHNcIilcblx0ICAgIC8vLnN0eWxlKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHstcGFuRGlzdH1weCwwcHgpYCk7XG5cdC8vIC4uLnRoZW4gdGhlIHpvb20gZHJhdyB3aWxsIHRyYW5zaXRpb24gdGhlIHZlY3RvciBiYWNrIHRvICgwLDApXG5cdHRoaXMuc2V0Q29udGV4dCh7IGNocjogdGhpcy5jb29yZHMuY2hyLCBzdGFydDogbnMsIGVuZDogbmUgfSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdEZlYXRUeXBlQ29udHJvbCAoZmFjZXQpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgY29sb3JzID0gdGhpcy5jc2NhbGUuZG9tYWluKCkubWFwKGxibCA9PiB7XG5cdCAgICByZXR1cm4geyBsYmw6bGJsLCBjbHI6dGhpcy5jc2NhbGUobGJsKSB9O1xuXHR9KTtcblx0bGV0IGNrZXMgPSBkMy5zZWxlY3QoXCIuY29sb3JLZXlcIilcblx0ICAgIC5zZWxlY3RBbGwoJy5jb2xvcktleUVudHJ5Jylcblx0XHQuZGF0YShjb2xvcnMpO1xuXHRsZXQgbmNzID0gY2tlcy5lbnRlcigpLmFwcGVuZChcImRpdlwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBcImNvbG9yS2V5RW50cnkgZmxleHJvd1wiKTtcblx0bmNzLmFwcGVuZChcImRpdlwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwic3dhdGNoXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgYyA9PiBjLmxibClcblx0ICAgIC5zdHlsZShcImJhY2tncm91bmQtY29sb3JcIiwgYyA9PiBjLmNscilcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgdCA9IGQzLnNlbGVjdCh0aGlzKTtcblx0ICAgICAgICB0LmNsYXNzZWQoXCJjaGVja2VkXCIsICEgdC5jbGFzc2VkKFwiY2hlY2tlZFwiKSk7XG5cdFx0bGV0IHN3YXRjaGVzID0gZDMuc2VsZWN0QWxsKFwiLnN3YXRjaC5jaGVja2VkXCIpWzBdO1xuXHRcdGxldCBmdHMgPSBzd2F0Y2hlcy5tYXAocz0+cy5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpKVxuXHRcdGZhY2V0LnNldFZhbHVlcyhmdHMpO1xuXHRcdHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdCAgICB9KVxuXHQgICAgLmFwcGVuZChcImlcIilcblx0ICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29uc1wiKTtcblx0bmNzLmFwcGVuZChcInNwYW5cIilcblx0ICAgIC50ZXh0KGMgPT4gYy5sYmwpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naVNucFJlcG9ydCAoKSB7XG5cdGxldCBjID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdGxldCB1cmxCYXNlID0gJ2h0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9zbnAvc3VtbWFyeSc7XG5cdGxldCB0YWJBcmcgPSAnc2VsZWN0ZWRUYWI9MSc7XG5cdGxldCBzZWFyY2hCeUFyZyA9ICdzZWFyY2hCeVNhbWVEaWZmPSc7XG5cdGxldCBjaHJBcmcgPSBgc2VsZWN0ZWRDaHJvbW9zb21lPSR7Yy5jaHJ9YDtcblx0bGV0IGNvb3JkQXJnID0gYGNvb3JkaW5hdGU9JHtjLnN0YXJ0fS0ke2MuZW5kfWA7XG5cdGxldCB1bml0QXJnID0gJ2Nvb3JkaW5hdGVVbml0PWJwJztcblx0bGV0IGNzQXJncyA9IGMuZ2Vub21lcy5tYXAoZyA9PiBgc2VsZWN0ZWRTdHJhaW5zPSR7Z31gKVxuXHRsZXQgcnNBcmcgPSBgcmVmZXJlbmNlU3RyYWluPSR7Yy5yZWZ9YDtcblx0bGV0IGxpbmtVcmwgPSBgJHt1cmxCYXNlfT8ke3RhYkFyZ30mJHtzZWFyY2hCeUFyZ30mJHtjaHJBcmd9JiR7Y29vcmRBcmd9JiR7dW5pdEFyZ30mJHtyc0FyZ30mJHtjc0FyZ3Muam9pbignJicpfWBcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naVFUTHMgKCkge1xuXHRsZXQgYyAgICAgICAgPSB0aGlzLmdldENvbnRleHQoKTtcblx0bGV0IHVybEJhc2UgID0gJ2h0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9hbGxlbGUvc3VtbWFyeSc7XG5cdGxldCBjaHJBcmcgICA9IGBjaHJvbW9zb21lPSR7Yy5jaHJ9YDtcblx0bGV0IGNvb3JkQXJnID0gYGNvb3JkaW5hdGU9JHtjLnN0YXJ0fS0ke2MuZW5kfWA7XG5cdGxldCB1bml0QXJnICA9ICdjb29yZFVuaXQ9YnAnO1xuXHRsZXQgdHlwZUFyZyAgPSAnYWxsZWxlVHlwZT1RVEwnO1xuXHRsZXQgbGlua1VybCAgPSBgJHt1cmxCYXNlfT8ke2NockFyZ30mJHtjb29yZEFyZ30mJHt1bml0QXJnfSYke3R5cGVBcmd9YDtcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naUpCcm93c2UgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRsZXQgdXJsQmFzZSA9ICdodHRwOi8vamJyb3dzZS5pbmZvcm1hdGljcy5qYXgub3JnLyc7XG5cdGxldCBkYXRhQXJnID0gJ2RhdGE9ZGF0YSUyRm1vdXNlJzsgLy8gXCJkYXRhL21vdXNlXCJcblx0bGV0IGxvY0FyZyAgPSBgbG9jPWNociR7Yy5jaHJ9JTNBJHtjLnN0YXJ0fS4uJHtjLmVuZH1gO1xuXHRsZXQgdHJhY2tzICA9IFsnRE5BJywnTUdJX0dlbm9tZV9GZWF0dXJlcycsJ05DQklfQ0NEUycsJ05DQkknLCdFTlNFTUJMJ107XG5cdGxldCB0cmFja3NBcmc9YHRyYWNrcz0ke3RyYWNrcy5qb2luKCcsJyl9YDtcblx0bGV0IGhpZ2hsaWdodEFyZyA9ICdoaWdobGlnaHQ9Jztcblx0bGV0IGxpbmtVcmwgPSBgJHt1cmxCYXNlfT8keyBbZGF0YUFyZyxsb2NBcmcsdHJhY2tzQXJnLGhpZ2hsaWdodEFyZ10uam9pbignJicpIH1gO1xuXHR3aW5kb3cub3BlbihsaW5rVXJsLCBcIl9ibGFua1wiKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBNR1ZBcHBcblxuZXhwb3J0IHsgTUdWQXBwIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9NR1ZBcHAuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgR2Vub21lIHtcbiAgY29uc3RydWN0b3IgKGNmZykge1xuICAgIHRoaXMubmFtZSA9IGNmZy5uYW1lO1xuICAgIHRoaXMubGFiZWw9IGNmZy5sYWJlbDtcbiAgICB0aGlzLmNocm9tb3NvbWVzID0gW107XG4gICAgdGhpcy5tYXhsZW4gPSAtMTtcbiAgICB0aGlzLnhzY2FsZSA9IG51bGw7XG4gICAgdGhpcy55c2NhbGUgPSBudWxsO1xuICAgIHRoaXMuem9vbVkgID0gLTE7XG4gIH1cbiAgZ2V0Q2hyb21vc29tZSAobikge1xuICAgICAgaWYgKHR5cGVvZihuKSA9PT0gJ3N0cmluZycpXG5cdCAgcmV0dXJuIHRoaXMuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSBuKVswXTtcbiAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gdGhpcy5jaHJvbW9zb21lc1tuXTtcbiAgfVxuICBoYXNDaHJvbW9zb21lIChuKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDaHJvbW9zb21lKG4pID8gdHJ1ZSA6IGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCB7IEdlbm9tZSB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvR2Vub21lLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7ZDNqc29uLCBvdmVybGFwcywgc3VidHJhY3R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtGZWF0dXJlfSBmcm9tICcuL0ZlYXR1cmUnO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEhvdyB0aGUgYXBwIGxvYWRzIGZlYXR1cmUgZGF0YS4gUHJvdmlkZXMgdHdvIGNhbGxzOlxuLy8gICAtIGdldCBmZWF0dXJlcyBpbiByYW5nZVxuLy8gICAtIGdldCBmZWF0dXJlcyBieSBpZFxuLy8gUmVxdWVzdHMgZmVhdHVyZXMgZnJvbSB0aGUgc2VydmVyIGFuZCByZWdpc3RlcnMgdGhlbSBpbiBhIGNhY2hlLlxuLy8gSW50ZXJhY3RzIHdpdGggdGhlIGJhY2sgZW5kIHRvIGxvYWQgZmVhdHVyZXM7IHRyaWVzIG5vdCB0byByZXF1ZXN0XG4vLyB0aGUgc2FtZSByZWdpb24gdHdpY2UuXG4vL1xuY2xhc3MgRmVhdHVyZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMuaWQyZmVhdCA9IHt9O1x0XHQvLyBpbmRleCBmcm9tICBmZWF0dXJlIElEIHRvIGZlYXR1cmVcblx0dGhpcy5jYW5vbmljYWwyZmVhdHMgPSB7fTtcdC8vIGluZGV4IGZyb20gY2Fub25pY2FsIElEIC0+IFsgZmVhdHVyZXMgdGFnZ2VkIHdpdGggdGhhdCBpZCBdXG5cdHRoaXMuc3ltYm9sMmZlYXRzID0ge31cdFx0Ly8gaW5kZXggZnJvbSBzeW1ib2wgLT4gWyBmZWF0dXJlcyBoYXZpbmcgdGhhdCBzeW1ib2wgXVxuXHR0aGlzLmNhY2hlID0ge307XHRcdC8vIHtnZW5vbWUubmFtZSAtPiB7Y2hyLm5hbWUgLT4gbGlzdCBvZiBibG9ja3N9fVxuXHR0aGlzLm1pbmVGZWF0dXJlQ2FjaGUgPSB7fTtcdC8vIGF1eGlsaWFyeSBpbmZvIHB1bGxlZCBmcm9tIE1vdXNlTWluZSBcblx0dGhpcy5sb2FkZWRHZW5vbWVzID0gbmV3IFNldCgpOyAvLyB0aGUgc2V0IG9mIEdlbm9tZXMgdGhhdCBoYXZlIGJlZW4gZnVsbHkgbG9hZGVkXG4gICAgfVxuIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFByb2Nlc3NlcyB0aGUgXCJyYXdcIiBmZWF0dXJlcyByZXR1cm5lZCBieSB0aGUgc2VydmVyLlxuICAgIC8vIFR1cm5zIHRoZW0gaW50byBGZWF0dXJlIG9iamVjdHMgYW5kIHJlZ2lzdGVycyB0aGVtLlxuICAgIC8vIElmIHRoZSBzYW1lIHJhdyBmZWF0dXJlIGlzIHJlZ2lzdGVyZWQgYWdhaW4sXG4gICAgLy8gdGhlIEZlYXR1cmUgb2JqZWN0IGNyZWF0ZWQgdGhlIGZpcnN0IHRpbWUgaXMgcmV0dXJuZWQuXG4gICAgLy8gKEkuZS4sIHJlZ2lzdGVyaW5nIHRoZSBzYW1lIGZlYXR1cmUgbXVsdGlwbGUgdGltZXMgaXMgb2spXG4gICAgLy9cbiAgICBwcm9jZXNzRmVhdHVyZXMgKGZlYXRzLCBnZW5vbWUpIHtcblx0cmV0dXJuIGZlYXRzLm1hcChkID0+IHtcblx0ICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IHRoaXMgb25lIGluIHRoZSBjYWNoZSwgcmV0dXJuIGl0LlxuXHQgICAgbGV0IGYgPSB0aGlzLmlkMmZlYXRbZC5tZ3BpZF07XG5cdCAgICBpZiAoZikgcmV0dXJuIGY7XG5cdCAgICAvLyBDcmVhdGUgYSBuZXcgRmVhdHVyZVxuXHQgICAgZC5nZW5vbWUgPSBnZW5vbWVcblx0ICAgIGYgPSBuZXcgRmVhdHVyZShkKTtcblx0ICAgIC8vIFJlZ2lzdGVyIGl0LlxuXHQgICAgdGhpcy5pZDJmZWF0W2YubWdwaWRdID0gZjtcblx0ICAgIGlmIChmLm1naWlkICYmIGYubWdpaWQgIT09ICcuJykge1xuXHRcdGxldCBsc3QgPSB0aGlzLmNhbm9uaWNhbDJmZWF0c1tmLm1naWlkXSA9ICh0aGlzLmNhbm9uaWNhbDJmZWF0c1tmLm1naWlkXSB8fCBbXSk7XG5cdFx0bHN0LnB1c2goZik7XG5cdCAgICB9XG5cdCAgICBpZiAoZi5zeW1ib2wgJiYgZi5zeW1ib2wgIT09ICcuJykge1xuXHRcdGxldCBsc3QgPSB0aGlzLnN5bWJvbDJmZWF0c1tmLnN5bWJvbF0gPSAodGhpcy5zeW1ib2wyZmVhdHNbZi5zeW1ib2xdIHx8IFtdKTtcblx0XHRsc3QucHVzaChmKTtcblx0ICAgIH1cblx0ICAgIC8vIGhlcmUgeSdnby5cblx0ICAgIHJldHVybiBmO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZWdpc3RlcnMgYW4gaW5kZXggYmxvY2sgZm9yIHRoZSBnaXZlbiBnZW5vbWUuIEFuIGluZGV4IGJsb2NrXG4gICAgLy8gaXMgYSBjb250aWd1b3VzIGNodW5rIG9mIGZlYXR1ZXMgZnJvbSB0aGUgR0ZGIGZpbGUgZm9yIHRoYXQgZ2Vub21lLlxuICAgIC8vIFJlZ2lzdGVyaW5nIHRoZSBzYW1lIGJsb2NrIG11bHRpcGxlIHRpbWVzIGlzIG9rIC0gc3VjY2Vzc2l2ZSB0aW1lc1xuICAgIC8vIGhhdmUgbm8gZWZmZWN0LlxuICAgIC8vIFNpZGUgZWZmZWN0czpcbiAgICAvLyAgIEFkZHMgdGhlIGJsb2NrIHRvIHRoZSBjYWNoZVxuICAgIC8vICAgUmVwbGFjZXMgZWFjaCByYXcgZmVhdHVyZSBpbiB0aGUgYmxvY2sgd2l0aCBhIEZlYXR1cmUgb2JqZWN0LlxuICAgIC8vICAgUmVnaXN0ZXJzIG5ldyBGZWF0dXJlcyBpbiBhIGxvb2t1cC5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgZ2Vub21lIChvYmplY3QpIFRoZSBnZW5vbWUgdGhlIGJsb2NrIGlzIGZvcixcbiAgICAvLyAgIGJsayAob2JqZWN0KSBBbiBpbmRleCBibG9jaywgd2hpY2ggaGFzIGEgY2hyLCBzdGFydCwgZW5kLFxuICAgIC8vICAgXHRhbmQgYSBsaXN0IG9mIFwicmF3XCIgZmVhdHVyZSBvYmplY3RzLlxuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICBub3RoaW5nXG4gICAgLy9cbiAgICBfcmVnaXN0ZXJCbG9jayAoZ2Vub21lLCBibGspIHtcblx0Ly8gZ2Vub21lIGNhY2hlXG4gICAgICAgIGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdID0gKHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdIHx8IHt9KTtcblx0Ly8gY2hyb21vc29tZSBjYWNoZSAody9pbiBnZW5vbWUpXG5cdGxldCBjYyA9IGdjW2Jsay5jaHJdID0gKGdjW2Jsay5jaHJdIHx8IFtdKTtcblx0aWYgKGNjLmZpbHRlcihiID0+IGIuaWQgPT09IGJsay5pZCkubGVuZ3RoID09PSAwKSB7XG5cdCAgICBibGsuZmVhdHVyZXMgPSB0aGlzLnByb2Nlc3NGZWF0dXJlcyggYmxrLmZlYXR1cmVzLCBnZW5vbWUgKTtcblx0ICAgIGJsay5nZW5vbWUgPSBnZW5vbWU7XG5cdCAgICBjYy5wdXNoKGJsayk7XG5cdCAgICBjYy5zb3J0KCAoYSxiKSA9PiBhLnN0YXJ0IC0gYi5zdGFydCApO1xuXHR9XG5cdC8vZWxzZVxuXHQgICAgLy9jb25zb2xlLmxvZyhcIlNraXBwZWQgYmxvY2suIEFscmVhZHkgc2Vlbi5cIiwgZ2Vub21lLm5hbWUsIGJsay5pZCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgcmVtYWluZGVyIG9mIHRoZSBnaXZlbiByYW5nZSBhZnRlclxuICAgIC8vIHN1YnRyYWN0aW5nIHRoZSBhbHJlYWR5LWVuc3VyZWQgcmFuZ2VzLlxuICAgIC8vIFxuICAgIF9zdWJ0cmFjdFJhbmdlKGdlbm9tZSwgcmFuZ2Upe1xuXHRsZXQgZ2MgPSB0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXTtcblx0aWYgKCFnYykgdGhyb3cgXCJObyBzdWNoIGdlbm9tZTogXCIgKyBnZW5vbWUubmFtZTtcblx0bGV0IGdCbGtzID0gZ2NbcmFuZ2UuY2hyXSB8fCBbXTtcblx0bGV0IGFucyA9IFtdO1xuXHRsZXQgcm5nID0gcmFuZ2U7XG5cdGdCbGtzLmZvckVhY2goIGIgPT4ge1xuXHQgICAgbGV0IHN1YiA9IHJuZyA/IHN1YnRyYWN0KCBybmcsIGIgKSA6IFtdO1xuXHQgICAgaWYgKHN1Yi5sZW5ndGggPT09IDApXG5cdCAgICAgICAgcm5nID0gbnVsbDtcblx0ICAgIGlmIChzdWIubGVuZ3RoID09PSAxKVxuXHQgICAgICAgIHJuZyA9IHN1YlswXTtcblx0ICAgIGVsc2UgaWYgKHN1Yi5sZW5ndGggPT09IDIpe1xuXHQgICAgICAgIGFucy5wdXNoKHN1YlswXSk7XG5cdFx0cm5nID0gc3ViWzFdO1xuXHQgICAgfVxuXHR9KVxuXHRybmcgJiYgYW5zLnB1c2gocm5nKTtcblx0YW5zLnNvcnQoIChhLGIpID0+IGEuc3RhcnQgLSBiLnN0YXJ0ICk7XG5cdHJldHVybiBhbnM7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENhbGxzIHN1YnRyYWN0UmFuZ2UgZm9yIGVhY2ggcmFuZ2UgaW4gdGhlIGxpc3QgYW5kIHJldHVybnNcbiAgICAvLyB0aGUgYWNjdW11bGF0ZWQgcmVzdWx0cy5cbiAgICAvL1xuICAgIF9zdWJ0cmFjdFJhbmdlcyhnZW5vbWUsIHJhbmdlcykge1xuXHRsZXQgZ2MgPSB0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXTtcblx0aWYgKCFnYykgcmV0dXJuIHJhbmdlcztcblx0bGV0IG5ld3JhbmdlcyA9IFtdO1xuXHRyYW5nZXMuZm9yRWFjaChyID0+IHtcblx0ICAgIG5ld3JhbmdlcyA9IG5ld3Jhbmdlcy5jb25jYXQodGhpcy5fc3VidHJhY3RSYW5nZShnZW5vbWUsIHIpKTtcblx0fSwgdGhpcylcblx0cmV0dXJuIG5ld3JhbmdlcztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBFbnN1cmVzIHRoYXQgYWxsIGZlYXR1cmVzIGluIHRoZSBzcGVjaWZpZWQgcmFuZ2UocykgaW4gdGhlIHNwZWNpZmllZCBnZW5vbWVcbiAgICAvLyBhcmUgaW4gdGhlIGNhY2hlLiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRydWUgd2hlbiB0aGUgY29uZGl0aW9uIGlzIG1ldC5cbiAgICBfZW5zdXJlRmVhdHVyZXNCeVJhbmdlIChnZW5vbWUsIHJhbmdlcykge1xuXHRsZXQgbmV3cmFuZ2VzID0gdGhpcy5fc3VidHJhY3RSYW5nZXMoZ2Vub21lLCByYW5nZXMpO1xuXHRpZiAobmV3cmFuZ2VzLmxlbmd0aCA9PT0gMCkgXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdGxldCBjb29yZHNBcmcgPSBuZXdyYW5nZXMubWFwKHIgPT4gYCR7ci5jaHJ9OiR7ci5zdGFydH0uLiR7ci5lbmR9YCkuam9pbignLCcpO1xuXHRsZXQgZGF0YVN0cmluZyA9IGBnZW5vbWU9JHtnZW5vbWUubmFtZX0mY29vcmRzPSR7Y29vcmRzQXJnfWA7XG5cdGxldCB1cmwgPSBcIi4vYmluL2dldEZlYXR1cmVzLmNnaT9cIiArIGRhdGFTdHJpbmc7XG5cdGxldCBzZWxmID0gdGhpcztcblx0Y29uc29sZS5sb2coXCJSZXF1ZXN0aW5nOlwiLCBnZW5vbWUubmFtZSwgbmV3cmFuZ2VzKTtcblx0cmV0dXJuIGQzanNvbih1cmwpLnRoZW4oZnVuY3Rpb24oYmxvY2tzKXtcblx0ICAgIGJsb2Nrcy5mb3JFYWNoKCBiID0+IHNlbGYuX3JlZ2lzdGVyQmxvY2soZ2Vub21lLCBiKSApO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdH0pO1xuICAgIH1cbiBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBfZW5zdXJlRmVhdHVyZXNCeUdlbm9tZSAoZ2Vub21lKSB7XG5cdGlmKCB0aGlzLmxvYWRlZEdlbm9tZXMuaGFzKGdlbm9tZSkgKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgbGV0IHJhbmdlcyA9IGdlbm9tZS5jaHJvbW9zb21lcy5tYXAoYyA9PiB7IFxuXHQgICAgcmV0dXJuIHsgY2hyOiBjLm5hbWUsIHN0YXJ0OiAxLCBlbmQ6IGMubGVuZ3RoIH07XG5cdH0pO1xuXHRyZXR1cm4gdGhpcy5fZW5zdXJlRmVhdHVyZXNCeVJhbmdlKGdlbm9tZSwgcmFuZ2VzKS50aGVuKHg9PnsgdGhpcy5sb2FkZWRHZW5vbWVzLmFkZChnZW5vbWUpOyByZXR1cm4gdHJ1ZTt9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBfZ2V0Q2FjaGVkRmVhdHVyZXMgKGdlbm9tZSwgcmFuZ2UpIHtcbiAgICAgICAgbGV0IGdjID0gdGhpcy5jYWNoZVtnZW5vbWUubmFtZV0gO1xuXHRpZiAoIWdjKSByZXR1cm4gW107XG5cdGxldCBjQmxvY2tzID0gZ2NbcmFuZ2UuY2hyXTtcblx0aWYgKCFjQmxvY2tzKSByZXR1cm4gW107XG5cdGxldCBmZWF0cyA9IGNCbG9ja3Ncblx0ICAgIC5maWx0ZXIoY2IgPT4gb3ZlcmxhcHMoY2IsIHJhbmdlKSlcblx0ICAgIC5tYXAoIGNiID0+IGNiLmZlYXR1cmVzLmZpbHRlciggZiA9PiBvdmVybGFwcyggZiwgcmFuZ2UpICkgKVxuXHQgICAgLnJlZHVjZSggKGFjYywgdmFsKSA9PiBhY2MuY29uY2F0KHZhbCksIFtdKTtcbiAgICAgICAgcmV0dXJuIGZlYXRzO1x0XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXNCeU1naUlkIChtZ2lpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW5vbmljYWwyZmVhdHNbbWdpaWRdIHx8IFtdO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBsaXN0IG9mIGZlYXR1cmVzIHRoYXQgbWF0Y2ggdGhlIGdpdmVuIGxhYmVsLlxuICAgIC8vIEZpcnN0IHRyaWVzIG1hdGNoaW5nIG9uIGZlYXR1cmUgSUQsIHRoZW4gb24gY2Fub25pY2FsIElELCBhbmQgdGhlbiBvbiBzeW1ib2wuXG4gICAgLy8gXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsIChsYWJlbCkge1xuXHRsZXQgZiA9IHRoaXMuaWQyZmVhdFtsYWJlbF1cblx0aWYgKGYpIHJldHVybiBbZl07XG5cdHJldHVybiB0aGlzLmNhbm9uaWNhbDJmZWF0c1tsYWJlbF0gfHwgdGhpcy5zeW1ib2wyZmVhdHNbbGFiZWxdIHx8IFtdXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBmZWF0dXJlcyBpbiBcbiAgICAvLyB0aGUgc3BlY2lmaWVkIHJhbmdlcyBvZiB0aGUgc3BlY2lmaWVkIGdlbm9tZS5cbiAgICBnZXRGZWF0dXJlcyAoZ2Vub21lLCByYW5nZXMpIHtcblx0cmV0dXJuIHRoaXMuX2Vuc3VyZUZlYXR1cmVzQnlHZW5vbWUoZ2Vub21lKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmFuZ2VzLmZvckVhY2goIHIgPT4ge1xuXHQgICAgICAgIHIuZmVhdHVyZXMgPSB0aGlzLl9nZXRDYWNoZWRGZWF0dXJlcyhnZW5vbWUsIHIpIFxuXHRcdHIuZ2Vub21lID0gZ2Vub21lO1xuXHQgICAgfSk7XG5cdCAgICByZXR1cm4geyBnZW5vbWUsIGJsb2NrczpyYW5nZXMgfTtcblx0fS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBmZWF0dXJlcyBoYXZpbmcgdGhlIHNwZWNpZmllZCBpZHMgZnJvbSB0aGUgc3BlY2lmaWVkIGdlbm9tZS5cbiAgICBnZXRGZWF0dXJlc0J5SWQgKGdlbm9tZSwgaWRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbnN1cmVGZWF0dXJlc0J5R2Vub21lKGdlbm9tZSkudGhlbiggKCkgPT4ge1xuXHQgICAgbGV0IGZlYXRzID0gW107XG5cdCAgICBsZXQgc2VlbiA9IG5ldyBTZXQoKTtcblx0ICAgIGxldCBhZGRmID0gKGYpID0+IHtcblx0XHRpZiAoZi5nZW5vbWUgIT09IGdlbm9tZSkgcmV0dXJuO1xuXHRcdGlmIChzZWVuLmhhcyhmLmlkKSkgcmV0dXJuO1xuXHRcdHNlZW4uYWRkKGYuaWQpO1xuXHRcdGZlYXRzLnB1c2goZik7XG5cdCAgICB9O1xuXHQgICAgbGV0IGFkZCA9IChmKSA9PiB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZikpIFxuXHRcdCAgICBmLmZvckVhY2goZmYgPT4gYWRkZihmZikpO1xuXHRcdGVsc2Vcblx0XHQgICAgYWRkZihmKTtcblx0ICAgIH07XG5cdCAgICBmb3IgKGxldCBpIG9mIGlkcyl7XG5cdFx0bGV0IGYgPSB0aGlzLmNhbm9uaWNhbDJmZWF0c1tpXSB8fCB0aGlzLmlkMmZlYXRbaV07XG5cdFx0ZiAmJiBhZGQoZik7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZmVhdHM7XG5cdH0pO1xuICAgIH1cblxufSAvLyBlbmQgY2xhc3MgRmVhdHVyZSBNYW5hZ2VyXG5cbmV4cG9ydCB7IEZlYXR1cmVNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBpbml0T3B0TGlzdCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgQXV4RGF0YU1hbmFnZXIgfSBmcm9tICcuL0F1eERhdGFNYW5hZ2VyJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBRdWVyeU1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgY2ZnKSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0KTtcblx0dGhpcy5jZmcgPSBjZmc7XG5cdHRoaXMuYXV4RGF0YU1hbmFnZXIgPSBuZXcgQXV4RGF0YU1hbmFnZXIoKTtcblx0dGhpcy5zZWxlY3QgPSBudWxsO1x0Ly8gbXkgPHNlbGVjdD4gZWxlbWVudFxuXHR0aGlzLnRlcm0gPSBudWxsO1x0Ly8gbXkgPGlucHV0PiBlbGVtZW50XG5cdHRoaXMuaW5pdERvbSgpO1xuICAgIH1cbiAgICBpbml0RG9tICgpIHtcblx0dGhpcy5zZWxlY3QgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInNlYXJjaHR5cGVcIl0nKTtcblx0dGhpcy50ZXJtICAgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInNlYXJjaHRlcm1cIl0nKTtcblx0Ly9cblx0dGhpcy50ZXJtLmF0dHIoXCJwbGFjZWhvbGRlclwiLCB0aGlzLmNmZ1swXS5wbGFjZWhvbGRlcilcblx0aW5pdE9wdExpc3QodGhpcy5zZWxlY3RbMF1bMF0sIHRoaXMuY2ZnLCBjPT5jLm1ldGhvZCwgYz0+Yy5sYWJlbCk7XG5cdC8vIFdoZW4gdXNlciBjaGFuZ2VzIHRoZSBxdWVyeSB0eXBlIChzZWxlY3RvciksIGNoYW5nZSB0aGUgcGxhY2Vob2xkZXIgdGV4dC5cblx0dGhpcy5zZWxlY3Qub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xuXHQgICAgbGV0IG9wdCA9IHRoaXMuc2VsZWN0LnByb3BlcnR5KFwic2VsZWN0ZWRPcHRpb25zXCIpWzBdO1xuXHQgICAgdGhpcy50ZXJtLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBvcHQuX19kYXRhX18ucGxhY2Vob2xkZXIpXG5cdCAgICBcblx0fSk7XG5cdC8vIFdoZW4gdXNlciBlbnRlcnMgYSBzZWFyY2ggdGVybSwgcnVuIGEgcXVlcnlcblx0dGhpcy50ZXJtLm9uKFwiY2hhbmdlXCIsICgpID0+IHtcblx0ICAgIGxldCB0ZXJtID0gdGhpcy50ZXJtLnByb3BlcnR5KFwidmFsdWVcIik7XG5cdCAgICB0aGlzLnRlcm0ucHJvcGVydHkoXCJ2YWx1ZVwiLFwiXCIpO1xuXHQgICAgbGV0IHNlYXJjaFR5cGUgID0gdGhpcy5zZWxlY3QucHJvcGVydHkoXCJ2YWx1ZVwiKTtcblx0ICAgIGxldCBsc3ROYW1lID0gdGVybTtcblx0ICAgIGQzLnNlbGVjdChcIiNteWxpc3RzXCIpLmNsYXNzZWQoXCJidXN5XCIsdHJ1ZSk7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdCAgICB0aGlzLmF1eERhdGFNYW5hZ2VyW3NlYXJjaFR5cGVdKHRlcm0pXHQvLyA8LSBydW4gdGhlIHF1ZXJ5XG5cdCAgICAgIC50aGVuKGZlYXRzID0+IHtcblx0XHQgIC8vIEZJWE1FIC0gcmVhY2hvdmVyIC0gdGhpcyB3aG9sZSBoYW5kbGVyXG5cdFx0ICBsZXQgbHN0ID0gdGhpcy5hcHAubGlzdE1hbmFnZXIuY3JlYXRlTGlzdChsc3ROYW1lLCBmZWF0cy5tYXAoZiA9PiBmLnByaW1hcnlJZGVudGlmaWVyKSlcblx0XHQgIHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZShsc3QpO1xuXHRcdCAgLy9cblx0XHQgIHRoaXMuYXBwLnpvb21WaWV3LmhpRmVhdHMgPSB7fTtcblx0XHQgIGZlYXRzLmZvckVhY2goZiA9PiB0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzW2YubWdpaWRdID0gZi5tZ2lpZCk7XG5cdFx0ICB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoKTtcblx0XHQgIC8vXG5cdFx0ICB0aGlzLmFwcC5jdXJyZW50TGlzdCA9IGxzdDtcblx0XHQgIC8vXG5cdFx0ICBkMy5zZWxlY3QoXCIjbXlsaXN0c1wiKS5jbGFzc2VkKFwiYnVzeVwiLGZhbHNlKTtcblx0ICAgICAgfSk7XG5cdH0pXG4gICAgfVxufVxuXG5leHBvcnQgeyBRdWVyeU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1F1ZXJ5TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgZDNqc29uIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXV4RGF0YU1hbmFnZXIgLSBrbm93cyBob3cgdG8gcXVlcnkgYW4gZXh0ZXJuYWwgc291cmNlIChpLmUuLCBNb3VzZU1pbmUpIGZvciBnZW5lc1xuLy8gYW5ub3RhdGVkIHRvIGRpZmZlcmVudCBvbnRvbG9naWVzLiBcbmNsYXNzIEF1eERhdGFNYW5hZ2VyIHtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRBdXhEYXRhIChxKSB7XG5cdGxldCBmb3JtYXQgPSAnanNvbm9iamVjdHMnO1xuXHRsZXQgcXVlcnkgPSBlbmNvZGVVUklDb21wb25lbnQocSk7XG5cdGxldCB1cmwgPSBgaHR0cDovL3d3dy5tb3VzZW1pbmUub3JnL21vdXNlbWluZS9zZXJ2aWNlL3F1ZXJ5L3Jlc3VsdHM/Zm9ybWF0PSR7Zm9ybWF0fSZxdWVyeT0ke3F1ZXJ5fWA7XG5cdHJldHVybiBkM2pzb24odXJsKS50aGVuKGRhdGEgPT4gZGF0YS5yZXN1bHRzfHxbXSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gZG8gYSBMT09LVVAgcXVlcnkgZm9yIFNlcXVlbmNlRmVhdHVyZXMgZnJvbSBNb3VzZU1pbmVcbiAgICBmZWF0dXJlc0J5TG9va3VwIChxcnlTdHJpbmcpIHtcblx0bGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiU2VxdWVuY2VGZWF0dXJlLnByaW1hcnlJZGVudGlmaWVyIFNlcXVlbmNlRmVhdHVyZS5zeW1ib2xcIiBsb25nRGVzY3JpcHRpb249XCJcIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCIGFuZCBDXCI+XG5cdCAgICA8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmVcIiBvcD1cIkxPT0tVUFwiIHZhbHVlPVwiJHtxcnlTdHJpbmd9XCIvPlxuXHQgICAgPGNvbnN0cmFpbnQgY29kZT1cIkJcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9yZ2FuaXNtLnRheG9uSWRcIiBvcD1cIj1cIiB2YWx1ZT1cIjEwMDkwXCIvPlxuXHQgICAgPGNvbnN0cmFpbnQgY29kZT1cIkNcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLnNlcXVlbmNlT250b2xvZ3lUZXJtLm5hbWVcIiBvcD1cIiE9XCIgdmFsdWU9XCJ0cmFuc2dlbmVcIi8+XG5cdCAgICA8L3F1ZXJ5PmA7XG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZlYXR1cmVzQnlPbnRvbG9neVRlcm0gKHFyeVN0cmluZywgdGVybVR5cGUpIHtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICB2aWV3PVwiU2VxdWVuY2VGZWF0dXJlLnByaW1hcnlJZGVudGlmaWVyIFNlcXVlbmNlRmVhdHVyZS5zeW1ib2xcIiBsb25nRGVzY3JpcHRpb249XCJcIiBzb3J0T3JkZXI9XCJTZXF1ZW5jZUZlYXR1cmUuc3ltYm9sIGFzY1wiIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEIgYW5kIENcIj5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vbnRvbG9neUFubm90YXRpb25zLm9udG9sb2d5VGVybVwiIHR5cGU9XCIke3Rlcm1UeXBlfVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vbnRvbG9neUFubm90YXRpb25zLm9udG9sb2d5VGVybS5wYXJlbnRzXCIgdHlwZT1cIiR7dGVybVR5cGV9XCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm0ucGFyZW50c1wiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJCXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vcmdhbmlzbS50YXhvbklkXCIgb3A9XCI9XCIgdmFsdWU9XCIxMDA5MFwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkNcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLnNlcXVlbmNlT250b2xvZ3lUZXJtLm5hbWVcIiBvcD1cIiE9XCIgdmFsdWU9XCJ0cmFuc2dlbmVcIi8+XG5cdCAgPC9xdWVyeT5gXG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIChub3QgY3VycmVudGx5IGluIHVzZS4uLilcbiAgICBmZWF0dXJlc0J5UGF0aHdheVRlcm0gKHFyeVN0cmluZykge1xuICAgICAgICBsZXQgcSA9IGA8cXVlcnkgbmFtZT1cIlwiIG1vZGVsPVwiZ2Vub21pY1wiIFxuXHQgIHZpZXc9XCJQYXRod2F5LmdlbmVzLnByaW1hcnlJZGVudGlmaWVyIFBhdGh3YXkuZ2VuZXMuc3ltYm9sXCIgbG9uZ0Rlc2NyaXB0aW9uPVwiXCIgY29uc3RyYWludExvZ2ljPVwiQSBhbmQgQlwiPlxuXHQgICAgICA8Y29uc3RyYWludCBwYXRoPVwiUGF0aHdheVwiIGNvZGU9XCJBXCIgb3A9XCJMT09LVVBcIiB2YWx1ZT1cIiR7cXJ5U3RyaW5nfVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlBhdGh3YXkuZ2VuZXMub3JnYW5pc20udGF4b25JZFwiIGNvZGU9XCJCXCIgb3A9XCI9XCIgdmFsdWU9XCIxMDA5MFwiLz5cblx0ICA8L3F1ZXJ5PmA7XG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZlYXR1cmVzQnlJZCAgICAgICAgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5TG9va3VwKHFyeVN0cmluZyk7IH1cbiAgICBmZWF0dXJlc0J5RnVuY3Rpb24gIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeU9udG9sb2d5VGVybShxcnlTdHJpbmcsIFwiR09UZXJtXCIpOyB9XG4gICAgLy9mZWF0dXJlc0J5UGF0aHdheSAgIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeVBhdGh3YXlUZXJtKHFyeVN0cmluZyk7IH1cbiAgICBmZWF0dXJlc0J5UGhlbm90eXBlIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeU9udG9sb2d5VGVybShxcnlTdHJpbmcsIFwiTVBUZXJtXCIpOyB9XG4gICAgZmVhdHVyZXNCeURpc2Vhc2UgICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBcIkRPVGVybVwiKTsgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufVxuXG5leHBvcnQgeyBBdXhEYXRhTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQXV4RGF0YU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IExvY2FsU3RvcmFnZU1hbmFnZXIgfSBmcm9tICcuL1N0b3JhZ2VNYW5hZ2VyJztcbmltcG9ydCB7IExpc3RGb3JtdWxhRXZhbHVhdG9yIH0gZnJvbSAnLi9MaXN0Rm9ybXVsYUV2YWx1YXRvcic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTWFpbnRhaW5zIG5hbWVkIGxpc3RzIG9mIElEcy4gTGlzdHMgbWF5IGJlIHRlbXBvcmFyeSwgbGFzdGluZyBvbmx5IGZvciB0aGUgc2Vzc2lvbiwgb3IgcGVybWFuZW50LFxuLy8gbGFzdGluZyB1bnRpbCB0aGUgdXNlciBjbGVhcnMgdGhlIGJyb3dzZXIgbG9jYWwgc3RvcmFnZSBhcmVhLlxuLy9cbi8vIFVzZXMgd2luZG93LnNlc3Npb25TdG9yYWdlIGFuZCB3aW5kb3cubG9jYWxTdG9yYWdlIHRvIHNhdmUgbGlzdHNcbi8vIHRlbXBvcmFyaWx5IG9yIHBlcm1hbmVudGx5LCByZXNwLiAgRklYTUU6IHNob3VsZCBiZSB1c2luZyB3aW5kb3cuaW5kZXhlZERCXG4vL1xuY2xhc3MgTGlzdE1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMubmFtZTJsaXN0ID0gbnVsbDtcblx0dGhpcy5fbGlzdHMgPSBuZXcgTG9jYWxTdG9yYWdlTWFuYWdlciAgKFwibGlzdE1hbmFnZXIubGlzdHNcIilcblx0dGhpcy5mb3JtdWxhRXZhbCA9IG5ldyBMaXN0Rm9ybXVsYUV2YWx1YXRvcih0aGlzKTtcblx0dGhpcy5fbG9hZCgpO1xuXHR0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdC8vIEJ1dHRvbjogc2hvdy9oaWRlIHdhcm5pbmcgbWVzc2FnZVxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uLndhcm5pbmcnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHtcblx0ICAgICAgICBsZXQgdyA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwibWVzc2FnZVwiXScpO1xuXHRcdHcuY2xhc3NlZCgnc2hvd2luZycsICF3LmNsYXNzZWQoJ3Nob3dpbmcnKSk7XG5cdCAgICB9KTtcblx0Ly8gQnV0dG9uOiBjcmVhdGUgbGlzdCBmcm9tIGN1cnJlbnQgc2VsZWN0aW9uXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cIm5ld2Zyb21zZWxlY3Rpb25cIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGxldCBpZHMgPSBPYmplY3Qua2V5cyh0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzKTsgLy8gRklYTUUgLSByZWFjaG92ZXJcblx0XHRpZiAoaWRzLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vdGhpbmcgc2VsZWN0ZWQuXCIpO1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHRcdGxldCBuZXdsaXN0ID0gdGhpcy5jcmVhdGVMaXN0KFwic2VsZWN0aW9uXCIsIGlkcyk7XG5cdFx0dGhpcy51cGRhdGUobmV3bGlzdCk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IGNvbWJpbmUgbGlzdHM6IG9wZW4gbGlzdCBlZGl0b3Igd2l0aCBmb3JtdWxhIGVkaXRvciBvcGVuXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cImNvbWJpbmVcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlmICh0aGlzLmdldE5hbWVzKCkubGVuZ3RoID09PSAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTm8gbGlzdHMuXCIpO1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHRcdGxldCBsZSA9IHRoaXMuYXBwLmxpc3RFZGl0b3I7XG5cdFx0bGUub3BlbigpO1xuXHRcdGxlLm9wZW5Gb3JtdWxhRWRpdG9yKCk7XG5cdCAgICB9KTtcblx0Ly8gQnV0dG9uOiBkZWxldGUgYWxsIGxpc3RzIChnZXQgY29uZmlybWF0aW9uIGZpcnN0KS5cblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwicHVyZ2VcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlmICh0aGlzLmdldE5hbWVzKCkubGVuZ3RoID09PSAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTm8gbGlzdHMuXCIpO1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHQgICAgICAgIGlmICh3aW5kb3cuY29uZmlybShcIkRlbGV0ZSBhbGwgbGlzdHMuIEFyZSB5b3Ugc3VyZT9cIikpIHtcblx0XHQgICAgdGhpcy5wdXJnZSgpO1xuXHRcdCAgICB0aGlzLnVwZGF0ZSgpO1xuXHRcdH1cblx0ICAgIH0pO1xuICAgIH1cbiAgICBfbG9hZCAoKSB7XG5cdHRoaXMubmFtZTJsaXN0ID0gdGhpcy5fbGlzdHMuZ2V0KFwiYWxsXCIpO1xuXHRpZiAoIXRoaXMubmFtZTJsaXN0KXtcblx0ICAgIHRoaXMubmFtZTJsaXN0ID0ge307XG5cdCAgICB0aGlzLl9zYXZlKCk7XG5cdH1cbiAgICB9XG4gICAgX3NhdmUgKCkge1xuICAgICAgICB0aGlzLl9saXN0cy5wdXQoXCJhbGxcIiwgdGhpcy5uYW1lMmxpc3QpO1xuICAgIH1cbiAgICAvL1xuICAgIC8vIHJldHVybnMgdGhlIG5hbWVzIG9mIGFsbCB0aGUgbGlzdHMsIHNvcnRlZFxuICAgIGdldE5hbWVzICgpIHtcbiAgICAgICAgbGV0IG5tcyA9IE9iamVjdC5rZXlzKHRoaXMubmFtZTJsaXN0KTtcblx0bm1zLnNvcnQoKTtcblx0cmV0dXJuIG5tcztcbiAgICB9XG4gICAgLy8gcmV0dXJucyB0cnVlIGlmZiBhIGxpc3QgZXhpc3RzIHdpdGggdGhpcyBuYW1lXG4gICAgaGFzIChuYW1lKSB7XG4gICAgICAgIHJldHVybiBuYW1lIGluIHRoaXMubmFtZTJsaXN0O1xuICAgIH1cbiAgICAvLyBJZiBubyBsaXN0IHdpdGggdGhlIGdpdmVuIG5hbWUgZXhpc3RzLCByZXR1cm4gdGhlIG5hbWUuXG4gICAgLy8gT3RoZXJ3aXNlLCByZXR1cm4gYSBtb2RpZmllZCB2ZXJzaW9uIG9mIG5hbWUgdGhhdCBpcyB1bmlxdWUuXG4gICAgLy8gVW5pcXVlIG5hbWVzIGFyZSBjcmVhdGVkIGJ5IGFwcGVuZGluZyBhIGNvdW50ZXIuXG4gICAgLy8gRS5nLiwgdW5pcXVpZnkoXCJmb29cIikgLT4gXCJmb28uMVwiIG9yIFwiZm9vLjJcIiBvciB3aGF0ZXZlci5cbiAgICAvL1xuICAgIHVuaXF1aWZ5IChuYW1lKSB7XG5cdGlmICghdGhpcy5oYXMobmFtZSkpIFxuXHQgICAgcmV0dXJuIG5hbWU7XG5cdGZvciAobGV0IGkgPSAxOyA7IGkgKz0gMSkge1xuXHQgICAgbGV0IG5uID0gYCR7bmFtZX0uJHtpfWA7XG5cdCAgICBpZiAoIXRoaXMuaGFzKG5uKSlcblx0ICAgICAgICByZXR1cm4gbm47XG5cdH1cbiAgICB9XG4gICAgLy8gcmV0dXJucyB0aGUgbGlzdCB3aXRoIHRoaXMgbmFtZSwgb3IgbnVsbCBpZiBubyBzdWNoIGxpc3RcbiAgICBnZXQgKG5hbWUpIHtcbiAgICAgICAgbGV0IGxzdCA9IHRoaXMubmFtZTJsaXN0W25hbWVdO1xuXHRpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgbmFtZTtcblx0cmV0dXJuIGxzdDtcbiAgICB9XG4gICAgLy8gcmV0dXJucyBhbGwgdGhlIGxpc3RzLCBzb3J0ZWQgYnkgbmFtZVxuICAgIGdldEFsbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE5hbWVzKCkubWFwKG4gPT4gdGhpcy5nZXQobikpXG4gICAgfVxuICAgIC8vIFxuICAgIGNyZWF0ZU9yVXBkYXRlIChuYW1lLCBpZHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy51cGRhdGVMaXN0KG5hbWUsbnVsbCxpZHMpIDogdGhpcy5jcmVhdGVMaXN0KG5hbWUsIGlkcyk7XG4gICAgfVxuICAgIC8vIGNyZWF0ZXMgYSBuZXcgbGlzdCB3aXRoIHRoZSBnaXZlbiBuYW1lIGFuZCBpZHMuXG4gICAgY3JlYXRlTGlzdCAobmFtZSwgaWRzLCBmb3JtdWxhKSB7XG5cdGlmIChuYW1lICE9PSBcIl9cIilcblx0ICAgIG5hbWUgPSB0aGlzLnVuaXF1aWZ5KG5hbWUpO1xuXHQvL1xuXHRsZXQgZHQgPSBuZXcgRGF0ZSgpICsgXCJcIjtcblx0dGhpcy5uYW1lMmxpc3RbbmFtZV0gPSB7XG5cdCAgICBuYW1lOiAgICAgbmFtZSxcblx0ICAgIGlkczogICAgICBpZHMsXG5cdCAgICBmb3JtdWxhOiAgZm9ybXVsYSB8fCBcIlwiLFxuXHQgICAgY3JlYXRlZDogIGR0LFxuXHQgICAgbW9kaWZpZWQ6IGR0XG5cdH07XG5cdHRoaXMuX3NhdmUoKTtcblx0cmV0dXJuIHRoaXMubmFtZTJsaXN0W25hbWVdO1xuICAgIH1cbiAgICAvLyBQcm92aWRlIGFjY2VzcyB0byBldmFsdWF0aW9uIHNlcnZpY2VcbiAgICBldmFsRm9ybXVsYSAoZXhwcikge1xuXHRyZXR1cm4gdGhpcy5mb3JtdWxhRXZhbC5ldmFsKGV4cHIpO1xuICAgIH1cbiAgICAvLyBSZWZyZXNoZXMgYSBsaXN0IGFuZCByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHJlZnJlc2hlZCBsaXN0LlxuICAgIC8vIElmIHRoZSBsaXN0IGlmIGEgUE9MTywgcHJvbWlzZSByZXNvbHZlcyBpbW1lZGlhdGVseSB0byB0aGUgbGlzdC5cbiAgICAvLyBPdGhlcndpc2UsIHN0YXJ0cyBhIHJlZXZhbHVhdGlvbiBvZiB0aGUgZm9ybXVsYSB0aGF0IHJlc29sdmVzIGFmdGVyIHRoZVxuICAgIC8vIGxpc3QncyBpZHMgaGF2ZSBiZWVuIHVwZGF0ZWQuXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gZXJyb3IsIHRoZSByZXR1cm5lZCBwcm9taXNlIHJlamVjdHMgd2l0aCB0aGUgZXJyb3IuXG4gICAgcmVmcmVzaExpc3QgKG5hbWUpIHtcbiAgICAgICAgbGV0IGxzdCA9IHRoaXMuZ2V0KG5hbWUpO1xuXHRpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgbmFtZTtcblx0bHN0Lm1vZGlmaWVkID0gXCJcIituZXcgRGF0ZSgpO1xuXHRpZiAoIWxzdC5mb3JtdWxhKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShsc3QpO1xuXHRlbHNlIHtcblx0ICAgIGxldCBwID0gdGhpcy5mb3JtdWFsRXZhbC5ldmFsKGxzdC5mb3JtdWxhKS50aGVuKCBpZHMgPT4ge1xuXHRcdCAgICBsc3QuaWRzID0gaWRzO1xuXHRcdCAgICByZXR1cm4gbHN0O1xuXHRcdH0pO1xuXHQgICAgcmV0dXJuIHA7XG5cdH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGVzIHRoZSBpZHMgaW4gdGhlIGdpdmVuIGxpc3RcbiAgICB1cGRhdGVMaXN0IChuYW1lLCBuZXduYW1lLCBuZXdpZHMsIG5ld2Zvcm11bGEpIHtcblx0bGV0IGxzdCA9IHRoaXMuZ2V0KG5hbWUpO1xuICAgICAgICBpZiAoISBsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdGlmIChuZXduYW1lKSB7XG5cdCAgICBkZWxldGUgdGhpcy5uYW1lMmxpc3RbbHN0Lm5hbWVdO1xuXHQgICAgbHN0Lm5hbWUgPSB0aGlzLnVuaXF1aWZ5KG5ld25hbWUpO1xuXHQgICAgdGhpcy5uYW1lMmxpc3RbbHN0Lm5hbWVdID0gbHN0O1xuXHR9XG5cdGlmIChuZXdpZHMpIGxzdC5pZHMgID0gbmV3aWRzO1xuXHRpZiAobmV3Zm9ybXVsYSB8fCBuZXdmb3JtdWxhPT09XCJcIikgbHN0LmZvcm11bGEgPSBuZXdmb3JtdWxhO1xuXHRsc3QubW9kaWZpZWQgPSBuZXcgRGF0ZSgpICsgXCJcIjtcblx0dGhpcy5fc2F2ZSgpO1xuXHRyZXR1cm4gbHN0O1xuICAgIH1cbiAgICAvLyBkZWxldGVzIHRoZSBzcGVjaWZpZWQgbGlzdFxuICAgIGRlbGV0ZUxpc3QgKG5hbWUpIHtcbiAgICAgICAgbGV0IGxzdCA9IHRoaXMuZ2V0KG5hbWUpO1xuXHRkZWxldGUgdGhpcy5uYW1lMmxpc3RbbmFtZV07XG5cdHRoaXMuX3NhdmUoKTtcblx0Ly8gRklYTUU6IHVzZSBldmVudHMhIVxuXHRpZiAobHN0ID09PSB0aGlzLmFwcC5jdXJyZW50TGlzdCkgdGhpcy5hcHAuY3VycmVudExpc3QgPSBudWxsO1xuXHRpZiAobHN0ID09PSB0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QpIHRoaXMuYXBwLmxpc3RFZGl0b3IubGlzdCA9IG51bGw7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIGRlbGV0ZSBhbGwgbGlzdHNcbiAgICBwdXJnZSAoKSB7XG4gICAgICAgIHRoaXMubmFtZTJsaXN0ID0ge31cblx0dGhpcy5fc2F2ZSgpO1xuXHQvL1xuXHR0aGlzLmFwcC5jdXJyZW50TGlzdCA9IG51bGw7XG5cdHRoaXMuYXBwLmxpc3RFZGl0b3IubGlzdCA9IG51bGw7IC8vIEZJWE1FIC0gcmVhY2hhY3Jvc3NcbiAgICB9XG4gICAgLy8gUmV0dXJucyB0cnVlIGlmZiBleHByIGlzIHZhbGlkLCB3aGljaCBtZWFucyBpdCBpcyBib3RoIHN5bnRhY3RpY2FsbHkgY29ycmVjdCBcbiAgICAvLyBhbmQgYWxsIG1lbnRpb25lZCBsaXN0cyBleGlzdC5cbiAgICBpc1ZhbGlkIChleHByKSB7XG5cdHJldHVybiB0aGlzLmZvcm11bGFFdmFsLmlzVmFsaWQoZXhwcik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFVwZGF0ZXMgdGhlIFwiTXkgbGlzdHNcIiBib3ggd2l0aCB0aGUgY3VycmVudGx5IGF2YWlsYWJsZSBsaXN0cy5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgbmV3bGlzdCAoTGlzdCkgb3B0aW9uYWwuIElmIHNwZWNpZmllZCwgd2UganVzdCBjcmVhdGVkIHRoYXQgbGlzdCwgYW5kIGl0cyBuYW1lIGlzXG4gICAgLy8gICBcdGEgZ2VuZXJhdGVkIGRlZmF1bHQuIFBsYWNlIGZvY3VzIHRoZXJlIHNvIHVzZXIgY2FuIHR5cGUgbmV3IG5hbWUuXG4gICAgdXBkYXRlIChuZXdsaXN0KSB7XG5cdGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGxpc3RzID0gdGhpcy5nZXRBbGwoKTtcblx0bGV0IGJ5TmFtZSA9IChhLGIpID0+IHtcblx0ICAgIGxldCBhbiA9IGEubmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgbGV0IGJuID0gYi5uYW1lLnRvTG93ZXJDYXNlKCk7XG5cdCAgICByZXR1cm4gKGFuIDwgYm4gPyAtMSA6IGFuID4gYm4gPyArMSA6IDApO1xuXHR9O1xuXHRsZXQgYnlEYXRlID0gKGEsYikgPT4gKChuZXcgRGF0ZShiLm1vZGlmaWVkKSkuZ2V0VGltZSgpIC0gKG5ldyBEYXRlKGEubW9kaWZpZWQpKS5nZXRUaW1lKCkpO1xuXHRsaXN0cy5zb3J0KGJ5TmFtZSk7XG5cdGxldCBpdGVtcyA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwibGlzdHNcIl0nKS5zZWxlY3RBbGwoXCIubGlzdEluZm9cIilcblx0ICAgIC5kYXRhKGxpc3RzKTtcblx0bGV0IG5ld2l0ZW1zID0gaXRlbXMuZW50ZXIoKS5hcHBlbmQoXCJkaXZcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImxpc3RJbmZvIGZsZXhyb3dcIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwiaVwiKS5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zIGJ1dHRvblwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJlZGl0XCIpXG5cdCAgICAudGV4dChcIm1vZGVfZWRpdFwiKVxuXHQgICAgLmF0dHIoXCJ0aXRsZVwiLFwiRWRpdCB0aGlzIGxpc3QuXCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcIm5hbWVcIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwic3BhblwiKS5hdHRyKFwibmFtZVwiLFwic2l6ZVwiKTtcblx0bmV3aXRlbXMuYXBwZW5kKFwic3BhblwiKS5hdHRyKFwibmFtZVwiLFwiZGF0ZVwiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJpXCIpLmF0dHIoXCJjbGFzc1wiLFwibWF0ZXJpYWwtaWNvbnMgYnV0dG9uXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIixcImRlbGV0ZVwiKVxuXHQgICAgLnRleHQoXCJoaWdobGlnaHRfb2ZmXCIpXG5cdCAgICAuYXR0cihcInRpdGxlXCIsXCJEZWxldGUgdGhpcyBsaXN0LlwiKTtcblxuXHRpZiAobmV3aXRlbXNbMF1bMF0pIHtcblx0ICAgIGxldCBsYXN0ID0gbmV3aXRlbXNbMF1bbmV3aXRlbXNbMF0ubGVuZ3RoLTFdO1xuXHQgICAgbGFzdC5zY3JvbGxJbnRvVmlldygpO1xuXHR9XG5cblx0aXRlbXNcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBsc3Q9PmxzdC5uYW1lKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGxzdCkge1xuXHRcdGlmIChkMy5ldmVudC5hbHRLZXkpIHtcblx0XHQgICAgbGV0IGxlID0gc2VsZi5hcHAubGlzdEVkaXRvcjsgLy8gRklYTUUgcmVhY2hvdmVyXG5cdFx0ICAgIGxldCBzID0gbHN0Lm5hbWU7XG5cdFx0ICAgIGxldCByZSA9IC9bID0oKSsqLV0vO1xuXHRcdCAgICBpZiAocy5zZWFyY2gocmUpID49IDApXG5cdFx0XHRzID0gJ1wiJyArIHMgKyAnXCInO1xuXHRcdCAgICBpZiAoIWxlLmlzRWRpdGluZ0Zvcm11bGEpIHtcblx0XHQgICAgICAgIGxlLm9wZW4oKTtcblx0XHRcdGxlLm9wZW5Gb3JtdWxhRWRpdG9yKCk7XG5cdFx0ICAgIH1cblx0XHQgICAgLy9cblx0XHQgICAgbGUuYWRkVG9MaXN0RXhwcihzKycgJyk7XG5cdFx0fVxuXHRcdC8vIG90aGVyd2lzZSwgc2V0IHRoaXMgYXMgdGhlIGN1cnJlbnQgbGlzdFxuXHRcdGVsc2UgXG5cdFx0ICAgIHNlbGYuYXBwLmN1cnJlbnRMaXN0ID0gbHN0OyAvLyBGSVhNRSByZWFjaG92ZXJcblx0ICAgIH0pO1xuXHRpdGVtcy5zZWxlY3QoJy5idXR0b25bbmFtZT1cImVkaXRcIl0nKVxuXHQgICAgLy8gZWRpdDogY2xpY2sgXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbihsc3QpIHtcblx0ICAgICAgICBzZWxmLmFwcC5saXN0RWRpdG9yLm9wZW4obHN0KTtcblx0ICAgIH0pO1xuXHRpdGVtcy5zZWxlY3QoJ3NwYW5bbmFtZT1cIm5hbWVcIl0nKVxuXHQgICAgLnRleHQobHN0ID0+IGxzdC5uYW1lKTtcblx0aXRlbXMuc2VsZWN0KCdzcGFuW25hbWU9XCJkYXRlXCJdJykudGV4dChsc3QgPT4ge1xuXHQgICAgbGV0IG1kID0gbmV3IERhdGUobHN0Lm1vZGlmaWVkKTtcblx0ICAgIGxldCBkID0gYCR7bWQuZ2V0RnVsbFllYXIoKX0tJHttZC5nZXRNb250aCgpKzF9LSR7bWQuZ2V0RGF0ZSgpfSBgIFxuXHQgICAgICAgICAgKyBgOiR7bWQuZ2V0SG91cnMoKX0uJHttZC5nZXRNaW51dGVzKCl9LiR7bWQuZ2V0U2Vjb25kcygpfWA7XG5cdCAgICByZXR1cm4gZDtcblx0fSk7XG5cdGl0ZW1zLnNlbGVjdCgnc3BhbltuYW1lPVwic2l6ZVwiXScpLnRleHQobHN0ID0+IGxzdC5pZHMubGVuZ3RoKTtcblx0aXRlbXMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJkZWxldGVcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgbHN0ID0+IHtcblx0ICAgICAgICB0aGlzLmRlbGV0ZUxpc3QobHN0Lm5hbWUpO1xuXHRcdHRoaXMudXBkYXRlKCk7XG5cblx0XHQvLyBOb3Qgc3VyZSB3aHkgdGhpcyBpcyBuZWNlc3NhcnkgaGVyZS4gQnV0IHdpdGhvdXQgaXQsIHRoZSBsaXN0IGl0ZW0gYWZ0ZXIgdGhlIG9uZSBiZWluZ1xuXHRcdC8vIGRlbGV0ZWQgaGVyZSB3aWxsIHJlY2VpdmUgYSBjbGljayBldmVudC5cblx0XHRkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHQvL1xuXHQgICAgfSk7XG5cblx0Ly9cblx0aXRlbXMuZXhpdCgpLnJlbW92ZSgpO1xuXHQvL1xuXHRpZiAobmV3bGlzdCkge1xuXHQgICAgbGV0IGxzdGVsdCA9IFxuXHQgICAgICAgIGQzLnNlbGVjdChgI215bGlzdHMgW25hbWU9XCJsaXN0c1wiXSBbbmFtZT1cIiR7bmV3bGlzdC5uYW1lfVwiXWApWzBdWzBdO1xuICAgICAgICAgICAgbHN0ZWx0LnNjcm9sbEludG9WaWV3KGZhbHNlKTtcblx0fVxuICAgIH1cblxufSAvLyBlbmQgY2xhc3MgTGlzdE1hbmFnZXJcblxuZXhwb3J0IHsgTGlzdE1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0xpc3RNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9IGZyb20gJy4vTGlzdEZvcm11bGFQYXJzZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEtub3dzIGhvdyB0byBwYXJzZSBhbmQgZXZhbHVhdGUgYSBsaXN0IGZvcm11bGEgKGFrYSBsaXN0IGV4cHJlc3Npb24pLlxuY2xhc3MgTGlzdEZvcm11bGFFdmFsdWF0b3Ige1xuICAgIGNvbnN0cnVjdG9yIChsaXN0TWFuYWdlcikge1xuXHR0aGlzLmxpc3RNYW5hZ2VyID0gbGlzdE1hbmFnZXI7XG4gICAgICAgIHRoaXMucGFyc2VyID0gbmV3IExpc3RGb3JtdWxhUGFyc2VyKCk7XG4gICAgfVxuICAgIC8vIEV2YWx1YXRlcyB0aGUgZXhwcmVzc2lvbiBhbmQgcmV0dXJucyBhIFByb21pc2UgZm9yIHRoZSBsaXN0IG9mIGlkcy5cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBlcnJvciwgdGhlIHByb21pc2UgcmVqZWN0cyB3aXRoIHRoZSBlcnJvciBtZXNzYWdlLlxuICAgIGV2YWwgKGV4cHIpIHtcblx0IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0ICAgICB0cnkge1xuXHRcdGxldCBhc3QgPSB0aGlzLnBhcnNlci5wYXJzZShleHByKTtcblx0XHRsZXQgbG0gPSB0aGlzLmxpc3RNYW5hZ2VyO1xuXHRcdGxldCByZWFjaCA9IChuKSA9PiB7XG5cdFx0ICAgIGlmICh0eXBlb2YobikgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdGxldCBsc3QgPSBsbS5nZXQobik7XG5cdFx0XHRpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgbjtcblx0XHRcdHJldHVybiBuZXcgU2V0KGxzdC5pZHMpO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVsc2Uge1xuXHRcdFx0bGV0IGwgPSByZWFjaChuLmxlZnQpO1xuXHRcdFx0bGV0IHIgPSByZWFjaChuLnJpZ2h0KTtcblx0XHRcdHJldHVybiBsW24ub3BdKHIpO1xuXHRcdCAgICB9XG5cdFx0fVxuXHRcdGxldCBpZHMgPSByZWFjaChhc3QpO1xuXHRcdHJlc29sdmUoQXJyYXkuZnJvbShpZHMpKTtcblx0ICAgIH1cblx0ICAgIGNhdGNoIChlKSB7XG5cdFx0cmVqZWN0KGUpO1xuXHQgICAgfVxuXHQgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgLy8gQ2hlY2tzIHRoZSBjdXJyZW50IGV4cHJlc3Npb24gZm9yIHN5bnRhY3RpYyBhbmQgc2VtYW50aWMgdmFsaWRpdHkgYW5kIHNldHMgdGhlIFxuICAgIC8vIHZhbGlkL2ludmFsaWQgY2xhc3MgYWNjb3JkaW5nbHkuIFNlbWFudGljIHZhbGlkaXR5IHNpbXBseSBtZWFucyBhbGwgbmFtZXMgaW4gdGhlXG4gICAgLy8gZXhwcmVzc2lvbiBhcmUgYm91bmQuXG4gICAgLy9cbiAgICBpc1ZhbGlkICAoZXhwcikge1xuXHR0cnkge1xuXHQgICAgLy8gZmlyc3QgY2hlY2sgc3ludGF4XG5cdCAgICBsZXQgYXN0ID0gdGhpcy5wYXJzZXIucGFyc2UoZXhwcik7XG5cdCAgICBsZXQgbG0gID0gdGhpcy5saXN0TWFuYWdlcjsgXG5cdCAgICAvLyBub3cgY2hlY2sgbGlzdCBuYW1lc1xuXHQgICAgKGZ1bmN0aW9uIHJlYWNoKG4pIHtcblx0XHRpZiAodHlwZW9mKG4pID09PSBcInN0cmluZ1wiKSB7XG5cdFx0ICAgIGxldCBsc3QgPSBsbS5nZXQobik7XG5cdFx0ICAgIGlmICghbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICByZWFjaChuLmxlZnQpO1xuXHRcdCAgICByZWFjaChuLnJpZ2h0KTtcblx0XHR9XG5cdCAgICB9KShhc3QpO1xuXG5cdCAgICAvLyBUaHVtYnMgdXAhXG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fVxuXHRjYXRjaCAoZSkge1xuXHQgICAgLy8gc3ludGF4IGVycm9yIG9yIHVua25vd24gbGlzdCBuYW1lXG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IExpc3RGb3JtdWxhRXZhbHVhdG9yIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0Rm9ybXVsYUV2YWx1YXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgc2V0Q2FyZXRQb3NpdGlvbiwgbW92ZUNhcmV0UG9zaXRpb24sIGdldENhcmV0UmFuZ2UgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IExpc3RGb3JtdWxhUGFyc2VyIH0gZnJvbSAnLi9MaXN0Rm9ybXVsYVBhcnNlcic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgTGlzdEVkaXRvciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0KSB7XG5cdHN1cGVyKGFwcCwgZWx0KTtcblx0dGhpcy5wYXJzZXIgPSBuZXcgTGlzdEZvcm11bGFQYXJzZXIoKTtcblx0dGhpcy5mb3JtID0gbnVsbDtcblx0dGhpcy5pbml0RG9tKCk7XG5cdHRoaXMuaXNFZGl0aW5nRm9ybXVsYSA9IGZhbHNlO1xuXHQvL1xuXHR0aGlzLmxpc3QgPSBudWxsO1xuICAgIH1cbiAgICBpbml0RG9tICgpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHR0aGlzLmZvcm0gPSB0aGlzLnJvb3Quc2VsZWN0KFwiZm9ybVwiKVswXVswXTtcblx0aWYgKCF0aGlzLmZvcm0pIHRocm93IFwiQ291bGQgbm90IGluaXQgTGlzdEVkaXRvci4gTm8gZm9ybSBlbGVtZW50LlwiO1xuXHRkMy5zZWxlY3QodGhpcy5mb3JtKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHQgICAgICAgIGxldCB0ID0gZDMuZXZlbnQudGFyZ2V0O1xuXHRcdGlmIChcImJ1dHRvblwiID09PSB0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSl7XG5cdFx0ICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ICAgIGxldCBmID0gdGhpcy5mb3JtO1xuXHRcdCAgICBsZXQgcyA9IGYuaWRzLnZhbHVlLnJlcGxhY2UoL1ssfF0vZywgJyAnKS50cmltKCk7XG5cdFx0ICAgIGxldCBpZHMgPSBzID8gcy5zcGxpdCgvXFxzKy8pIDogW107XG5cdFx0ICAgIC8vIHNhdmUgbGlzdFxuXHRcdCAgICBpZiAodC5uYW1lID09PSBcInNhdmVcIikge1xuXHRcdFx0aWYgKCF0aGlzLmxpc3QpIHJldHVybjtcblx0XHRcdHRoaXMubGlzdCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZUxpc3QodGhpcy5saXN0Lm5hbWUsIGYubmFtZS52YWx1ZSwgaWRzLCBmLmZvcm11bGEudmFsdWUpO1xuXHRcdFx0dGhpcy5hcHAubGlzdE1hbmFnZXIudXBkYXRlKHRoaXMubGlzdCk7XG5cdFx0ICAgIH1cblx0XHQgICAgLy8gY3JlYXRlIG5ldyBsaXN0XG5cdFx0ICAgIGVsc2UgaWYgKHQubmFtZSA9PT0gXCJuZXdcIikge1xuXHRcdFx0bGV0IG4gPSBmLm5hbWUudmFsdWUudHJpbSgpO1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHQgICBhbGVydChcIllvdXIgbGlzdCBoYXMgbm8gbmFtZSBhbmQgaXMgdmVyeSBzYWQuIFBsZWFzZSBnaXZlIGl0IGEgbmFtZSBhbmQgdHJ5IGFnYWluLlwiKTtcblx0XHRcdCAgIHJldHVyblxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAobi5pbmRleE9mKCdcIicpID49IDApIHtcblx0XHRcdCAgIGFsZXJ0KFwiT2ggZGVhciwgeW91ciBsaXN0J3MgbmFtZSBoYXMgYSBkb3VibGUgcXVvdGUgY2hhcmFjdGVyLCBhbmQgSSdtIGFmYXJhaWQgdGhhdCdzIG5vdCBhbGxvd2VkLiBQbGVhc2UgcmVtb3ZlIHRoZSAnXFxcIicgYW5kIHRyeSBhZ2Fpbi5cIik7XG5cdFx0XHQgICByZXR1cm5cblx0XHRcdH1cblx0XHQgICAgICAgIHRoaXMubGlzdCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLmNyZWF0ZUxpc3QobiwgaWRzLCBmLmZvcm11bGEudmFsdWUpO1xuXHRcdFx0dGhpcy5hcHAubGlzdE1hbmFnZXIudXBkYXRlKHRoaXMubGlzdCk7XG5cdFx0ICAgIH1cblx0XHQgICAgLy8gY2xlYXIgZm9ybVxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwiY2xlYXJcIikge1xuXHRcdCAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0XHQgICAgfVxuXHRcdCAgICAvLyBmb3J3YXJkIHRvIE1HSVxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwidG9NZ2lcIikge1xuXHRcdCAgICAgICAgbGV0IGZybSA9IGQzLnNlbGVjdCgnI21naWJhdGNoZm9ybScpWzBdWzBdO1xuXHRcdFx0ZnJtLmlkcy52YWx1ZSA9IGlkcy5qb2luKFwiIFwiKTtcblx0XHRcdGZybS5zdWJtaXQoKVxuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGZvcndhcmQgdG8gTW91c2VNaW5lXG5cdFx0ICAgIGVsc2UgaWYgKHQubmFtZSA9PT0gXCJ0b01vdXNlTWluZVwiKSB7XG5cdFx0ICAgICAgICBsZXQgZnJtID0gZDMuc2VsZWN0KCcjbW91c2VtaW5lZm9ybScpWzBdWzBdO1xuXHRcdFx0ZnJtLmV4dGVybmFsaWRzLnZhbHVlID0gaWRzLmpvaW4oXCIsXCIpO1xuXHRcdFx0ZnJtLnN1Ym1pdCgpXG5cdFx0ICAgIH1cblx0XHR9XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IHNob3cvaGlkZSBmb3JtdWxhIGVkaXRvclxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImlkc2VjdGlvblwiXSAuYnV0dG9uW25hbWU9XCJlZGl0Zm9ybXVsYVwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRvZ2dsZUZvcm11bGFFZGl0b3IoKSk7XG5cdCAgICBcblx0Ly8gSW5wdXQgYm94OiBmb3JtdWxhOiB2YWxpZGF0ZSBvbiBhbnkgaW5wdXRcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIFtuYW1lPVwiZm9ybXVsYVwiXScpXG5cdCAgICAub24oXCJpbnB1dFwiLCAoKSA9PiB7XG5cdCAgICAgICAgdGhpcy52YWxpZGF0ZUV4cHIoKTtcblx0ICAgIH0pO1xuXG5cdC8vIEZvcndhcmQgLT4gTUdJL01vdXNlTWluZTogZGlzYWJsZSBidXR0b25zIGlmIG5vIGlkc1xuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImlkc1wiXScpXG5cdCAgICAub24oXCJpbnB1dFwiLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IGVtcHR5ID0gdGhpcy5mb3JtLmlkcy52YWx1ZS50cmltKCkubGVuZ3RoID09PSAwO1xuXHRcdHRoaXMuZm9ybS50b01naS5kaXNhYmxlZCA9IHRoaXMuZm9ybS50b01vdXNlTWluZS5kaXNhYmxlZCA9IGVtcHR5O1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uczogdGhlIGxpc3Qgb3BlcmF0b3IgYnV0dG9ucyAodW5pb24sIGludGVyc2VjdGlvbiwgZXRjLilcblx0dGhpcy5yb290LnNlbGVjdEFsbCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIC5idXR0b24ubGlzdG9wJylcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHQvLyBhZGQgbXkgc3ltYm9sIHRvIHRoZSBmb3JtdWxhXG5cdFx0bGV0IGluZWx0ID0gc2VsZi5mb3JtLmZvcm11bGE7XG5cdFx0bGV0IG9wID0gZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJuYW1lXCIpO1xuXHRcdHNlbGYuYWRkVG9MaXN0RXhwcihvcCk7XG5cdFx0c2VsZi52YWxpZGF0ZUV4cHIoKTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbjogcmVmcmVzaCBidXR0b24gZm9yIHJ1bm5pbmcgdGhlIGZvcm11bGFcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIC5idXR0b25bbmFtZT1cInJlZnJlc2hcIl0nKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGxldCBlbWVzc2FnZT1cIkknbSB0ZXJyaWJseSBzb3JyeSwgYnV0IHRoZXJlIGFwcGVhcnMgdG8gYmUgYSBwcm9ibGVtIHdpdGggeW91ciBsaXN0IGV4cHJlc3Npb246IFwiO1xuXHRcdGxldCBmb3JtdWxhID0gdGhpcy5mb3JtLmZvcm11bGEudmFsdWUudHJpbSgpO1xuXHRcdGlmIChmb3JtdWxhLmxlbmd0aCA9PT0gMClcblx0XHQgICAgcmV0dXJuO1xuXHQgICAgICAgIHRoaXMuYXBwLmxpc3RNYW5hZ2VyXG5cdFx0ICAgIC5ldmFsRm9ybXVsYShmb3JtdWxhKVxuXHRcdCAgICAudGhlbihpZHMgPT4ge1xuXHRcdCAgICAgICAgdGhpcy5mb3JtLmlkcy52YWx1ZSA9IGlkcy5qb2luKFwiXFxuXCIpO1xuXHRcdCAgICAgfSlcblx0XHQgICAgLmNhdGNoKGUgPT4gYWxlcnQoZW1lc3NhZ2UgKyBlKSk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IGNsb3NlIGZvcm11bGEgZWRpdG9yXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uW25hbWU9XCJjbG9zZVwiXScpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpICk7XG5cdFxuXHQvLyBDbGlja2luZyB0aGUgYm94IGNvbGxhcHNlIGJ1dHRvbiBzaG91bGQgY2xlYXIgdGhlIGZvcm1cblx0dGhpcy5yb290LnNlbGVjdChcIi5idXR0b24uY2xvc2VcIilcblx0ICAgIC5vbihcImNsaWNrLmV4dHJhXCIsICgpID0+IHtcblx0ICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuXHRcdHRoaXMuY2xvc2VGb3JtdWxhRWRpdG9yKCk7XG5cdCAgICB9KTtcbiAgICB9XG4gICAgcGFyc2VJZHMgKHMpIHtcblx0cmV0dXJuIHMucmVwbGFjZSgvWyx8XS9nLCAnICcpLnRyaW0oKS5zcGxpdCgvXFxzKy8pO1xuICAgIH1cbiAgICBnZXQgbGlzdCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0O1xuICAgIH1cbiAgICBzZXQgbGlzdCAobHN0KSB7XG4gICAgICAgIHRoaXMuX2xpc3QgPSBsc3Q7XG5cdHRoaXMuX3N5bmNEaXNwbGF5KCk7XG4gICAgfVxuICAgIF9zeW5jRGlzcGxheSAoKSB7XG5cdGxldCBsc3QgPSB0aGlzLl9saXN0O1xuXHRpZiAoIWxzdCkge1xuXHQgICAgdGhpcy5mb3JtLm5hbWUudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5pZHMudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSBmYWxzZTtcblx0ICAgIHRoaXMuZm9ybS5tb2RpZmllZC52YWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5mb3JtLmZvcm11bGEudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5zYXZlLmRpc2FibGVkID0gdHJ1ZTtcblx0ICAgIHRoaXMuZm9ybS50b01naS5kaXNhYmxlZCA9IHRydWU7XG5cdCAgICB0aGlzLmZvcm0udG9Nb3VzZU1pbmUuZGlzYWJsZWQgPSB0cnVlO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy5mb3JtLm5hbWUudmFsdWUgPSBsc3QubmFtZTtcblx0ICAgIHRoaXMuZm9ybS5pZHMudmFsdWUgPSBsc3QuaWRzLmpvaW4oJ1xcbicpO1xuXHQgICAgdGhpcy5mb3JtLmZvcm11bGEudmFsdWUgPSBsc3QuZm9ybXVsYSB8fCBcIlwiO1xuXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlLnRyaW0oKS5sZW5ndGggPiAwO1xuXHQgICAgdGhpcy5mb3JtLm1vZGlmaWVkLnZhbHVlID0gbHN0Lm1vZGlmaWVkO1xuXHQgICAgdGhpcy5mb3JtLnNhdmUuZGlzYWJsZWQgPSBmYWxzZTtcblx0ICAgIHRoaXMuZm9ybS50b01naS5kaXNhYmxlZCBcblx0ICAgICAgPSB0aGlzLmZvcm0udG9Nb3VzZU1pbmUuZGlzYWJsZWQgXG5cdCAgICAgICAgPSAodGhpcy5mb3JtLmlkcy52YWx1ZS50cmltKCkubGVuZ3RoID09PSAwKTtcblx0fVxuXHR0aGlzLnZhbGlkYXRlRXhwcigpO1xuICAgIH1cbiAgICBjbGVhciAoKSB7XG4gICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG4gICAgfVxuICAgIG9wZW4gKGxzdCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBsc3Q7XG5cdHRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIsIGZhbHNlKTtcbiAgICB9XG4gICAgY2xvc2UgKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiLCB0cnVlKTtcbiAgICB9XG4gICAgb3BlbkZvcm11bGFFZGl0b3IgKCkge1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImVkaXRpbmdmb3JtdWxhXCIsIHRydWUpO1xuXHR0aGlzLmlzRWRpdGluZ0Zvcm11bGEgPSB0cnVlO1xuXHRsZXQgZiA9IHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlO1xuXHR0aGlzLmZvcm0uZm9ybXVsYS5mb2N1cygpO1xuXHRzZXRDYXJldFBvc2l0aW9uKHRoaXMuZm9ybS5mb3JtdWxhLCBmLmxlbmd0aCk7XG4gICAgfVxuICAgIGNsb3NlRm9ybXVsYUVkaXRvciAoKSB7XG5cdHRoaXMucm9vdC5jbGFzc2VkKFwiZWRpdGluZ2Zvcm11bGFcIiwgZmFsc2UpO1xuXHR0aGlzLmlzRWRpdGluZ0Zvcm11bGEgPSBmYWxzZTtcbiAgICB9XG4gICAgdG9nZ2xlRm9ybXVsYUVkaXRvciAoKSB7XG5cdGxldCBzaG93aW5nID0gdGhpcy5yb290LmNsYXNzZWQoXCJlZGl0aW5nZm9ybXVsYVwiKTtcblx0c2hvd2luZyA/IHRoaXMuY2xvc2VGb3JtdWxhRWRpdG9yKCkgOiB0aGlzLm9wZW5Gb3JtdWxhRWRpdG9yKCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENoZWNrcyB0aGUgY3VycmVudCBleHByZXNzaW9uIGFuZCBzZXRzIHRoZSB2YWxpZC9pbnZhbGlkIGNsYXNzLlxuICAgIHZhbGlkYXRlRXhwciAgKCkge1xuXHRsZXQgaW5wID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIFtuYW1lPVwiZm9ybXVsYVwiXScpO1xuXHRsZXQgZXhwciA9IGlucFswXVswXS52YWx1ZS50cmltKCk7XG5cdGlmICghZXhwcikge1xuXHQgICAgaW5wLmNsYXNzZWQoXCJ2YWxpZFwiLGZhbHNlKS5jbGFzc2VkKFwiaW52YWxpZFwiLGZhbHNlKTtcbiBcdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gZmFsc2U7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICBsZXQgaXNWYWxpZCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLmlzVmFsaWQoZXhwcik7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdCAgICBpbnAuY2xhc3NlZChcInZhbGlkXCIsIGlzVmFsaWQpLmNsYXNzZWQoXCJpbnZhbGlkXCIsICFpc1ZhbGlkKTtcbiBcdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gdHJ1ZTtcblx0fVxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhZGRUb0xpc3RFeHByICh0ZXh0KSB7XG5cdGxldCBpbnAgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gW25hbWU9XCJmb3JtdWxhXCJdJyk7XG5cdGxldCBpZWx0ID0gaW5wWzBdWzBdO1xuXHRsZXQgdiA9IGllbHQudmFsdWU7XG5cdGxldCBzcGxpY2UgPSBmdW5jdGlvbiAoZSx0KXtcblx0ICAgIGxldCB2ID0gZS52YWx1ZTtcblx0ICAgIGxldCByID0gZ2V0Q2FyZXRSYW5nZShlKTtcblx0ICAgIGUudmFsdWUgPSB2LnNsaWNlKDAsclswXSkgKyB0ICsgdi5zbGljZShyWzFdKTtcblx0ICAgIHNldENhcmV0UG9zaXRpb24oZSwgclswXSt0Lmxlbmd0aCk7XG5cdCAgICBlLmZvY3VzKCk7XG5cdH1cblx0bGV0IHJhbmdlID0gZ2V0Q2FyZXRSYW5nZShpZWx0KTtcblx0aWYgKHJhbmdlWzBdID09PSByYW5nZVsxXSkge1xuXHQgICAgLy8gbm8gY3VycmVudCBzZWxlY3Rpb25cblx0ICAgIHNwbGljZShpZWx0LCB0ZXh0KTtcblx0ICAgIGlmICh0ZXh0ID09PSBcIigpXCIpIFxuXHRcdG1vdmVDYXJldFBvc2l0aW9uKGllbHQsIC0xKTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIC8vIHRoZXJlIGlzIGEgY3VycmVudCBzZWxlY3Rpb25cblx0ICAgIGlmICh0ZXh0ID09PSBcIigpXCIpXG5cdFx0Ly8gc3Vycm91bmQgY3VycmVudCBzZWxlY3Rpb24gd2l0aCBwYXJlbnMsIHRoZW4gbW92ZSBjYXJldCBhZnRlclxuXHRcdHRleHQgPSAnKCcgKyB2LnNsaWNlKHJhbmdlWzBdLHJhbmdlWzFdKSArICcpJztcblx0ICAgIHNwbGljZShpZWx0LCB0ZXh0KVxuXHR9XG5cdHRoaXMudmFsaWRhdGVFeHByKCk7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgTGlzdEVkaXRvclxuXG5leHBvcnQgeyBMaXN0RWRpdG9yIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0RWRpdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBMb2NhbFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSAnLi9TdG9yYWdlTWFuYWdlcic7XG5cbmNvbnN0IE1HUl9OQU1FID0gXCJwcmVmc01hbmFnZXJcIjtcbmNvbnN0IElURU1fTkFNRT0gXCJ1c2VyUHJlZnNcIjtcblxuY2xhc3MgVXNlclByZWZzTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlTWFuYWdlcihNR1JfTkFNRSk7XG5cdHRoaXMuZGF0YSA9IG51bGw7XG5cdHRoaXMuX2xvYWQoKTtcbiAgICB9XG4gICAgX2xvYWQgKCkge1xuXHR0aGlzLmRhdGEgPSB0aGlzLnN0b3JhZ2UuZ2V0KElURU1fTkFNRSk7XG5cdGlmICghdGhpcy5kYXRhKXtcblx0ICAgIHRoaXMuZGF0YSA9IHt9O1xuXHQgICAgdGhpcy5fc2F2ZSgpO1xuXHR9XG4gICAgfVxuICAgIF9zYXZlICgpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnB1dChJVEVNX05BTUUsIHRoaXMuZGF0YSk7XG4gICAgfVxuICAgIGhhcyAobikge1xuICAgIH1cbiAgICBnZXQgKG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVtuXTtcbiAgICB9XG4gICAgZ2V0QWxsICgpIHtcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGF0YSlcbiAgICB9XG4gICAgc2V0IChuLCB2KSB7XG4gICAgICAgIHRoaXMuZGF0YVtuXSA9IHY7XG5cdHRoaXMuX3NhdmUoKTtcbiAgICB9XG4gICAgc2V0QWxsICh2KSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5kYXRhLCB2KTtcblx0dGhpcy5fc2F2ZSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgVXNlclByZWZzTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvVXNlclByZWZzTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgRmFjZXQgfSBmcm9tICcuL0ZhY2V0JztcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBGYWNldE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcblx0dGhpcy5hcHAgPSBhcHA7XG5cdHRoaXMuZmFjZXRzID0gW107XG5cdHRoaXMubmFtZTJmYWNldCA9IHt9XG4gICAgfVxuICAgIGFkZEZhY2V0IChuYW1lLCB2YWx1ZUZjbikge1xuXHRpZiAodGhpcy5uYW1lMmZhY2V0W25hbWVdKSB0aHJvdyBcIkR1cGxpY2F0ZSBmYWNldCBuYW1lLiBcIiArIG5hbWU7XG5cdGxldCBmYWNldCA9IG5ldyBGYWNldChuYW1lLCB0aGlzLCB2YWx1ZUZjbik7XG4gICAgICAgIHRoaXMuZmFjZXRzLnB1c2goIGZhY2V0ICk7XG5cdHRoaXMubmFtZTJmYWNldFtuYW1lXSA9IGZhY2V0O1xuXHRyZXR1cm4gZmFjZXRcbiAgICB9XG4gICAgdGVzdCAoZikge1xuICAgICAgICBsZXQgdmFscyA9IHRoaXMuZmFjZXRzLm1hcCggZmFjZXQgPT4gZmFjZXQudGVzdChmKSApO1xuXHRyZXR1cm4gdmFscy5yZWR1Y2UoKGFjY3VtLCB2YWwpID0+IGFjY3VtICYmIHZhbCwgdHJ1ZSk7XG4gICAgfVxuICAgIGFwcGx5QWxsICgpIHtcblx0bGV0IHNob3cgPSBudWxsO1xuXHRsZXQgaGlkZSA9IFwibm9uZVwiO1xuXHQvLyBGSVhNRTogbWFqb3IgcmVhY2hvdmVyXG5cdHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwiZy5zdHJpcHNcIikuc2VsZWN0QWxsKCdyZWN0LmZlYXR1cmUnKVxuXHQgICAgLnN0eWxlKFwiZGlzcGxheVwiLCBmID0+IHRoaXMudGVzdChmKSA/IHNob3cgOiBoaWRlKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBGYWNldE1hbmFnZXJcblxuZXhwb3J0IHsgRmFjZXRNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GYWNldE1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgRmFjZXQge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lLCBtYW5hZ2VyLCB2YWx1ZUZjbikge1xuXHR0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXHR0aGlzLnZhbHVlcyA9IFtdO1xuXHR0aGlzLnZhbHVlRmNuID0gdmFsdWVGY247XG4gICAgfVxuICAgIHNldFZhbHVlcyAodmFsdWVzLCBxdWlldGx5KSB7XG4gICAgICAgIHRoaXMudmFsdWVzID0gdmFsdWVzO1xuXHRpZiAoISBxdWlldGx5KSB7XG5cdCAgICB0aGlzLm1hbmFnZXIuYXBwbHlBbGwoKTtcblx0ICAgIHRoaXMubWFuYWdlci5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH1cbiAgICB9XG4gICAgdGVzdCAoZikge1xuICAgICAgICByZXR1cm4gIXRoaXMudmFsdWVzIHx8IHRoaXMudmFsdWVzLmxlbmd0aCA9PT0gMCB8fCB0aGlzLnZhbHVlcy5pbmRleE9mKCB0aGlzLnZhbHVlRmNuKGYpICkgPj0gMDtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBGYWNldFxuXG5leHBvcnQgeyBGYWNldCB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmFjZXQuanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGQzdHN2IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBCbG9ja1RyYW5zbGF0b3IgfSBmcm9tICcuL0Jsb2NrVHJhbnNsYXRvcic7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQmxvY2tUcmFuc2xhdG9yIG1hbmFnZXIgY2xhc3MuIEZvciBhbnkgZ2l2ZW4gcGFpciBvZiBnZW5vbWVzLCBBIGFuZCBCLCBsb2FkcyB0aGUgc2luZ2xlIGJsb2NrIGZpbGVcbi8vIGZvciB0cmFuc2xhdGluZyBiZXR3ZWVuIHRoZW0sIGFuZCBpbmRleGVzIGl0IFwiZnJvbSBib3RoIGRpcmVjdGlvbnNcIjpcbi8vIFx0QS0+Qi0+IFtBQl9CbG9ja0ZpbGVdIDwtQTwtQlxuLy9cbmNsYXNzIEJUTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcblx0dGhpcy5yY0Jsb2NrcyA9IHt9O1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlZ2lzdGVyQmxvY2tzICh1cmwsIGFHZW5vbWUsIGJHZW5vbWUsIGJsb2Nrcykge1xuXHRjb25zb2xlLmxvZyhcIlJlZ2lzdGVyaW5nIGJsb2NrcyBmcm9tOiBcIiArIHVybCwgYmxvY2tzKTtcblx0bGV0IGFuYW1lID0gYUdlbm9tZS5uYW1lO1xuXHRsZXQgYm5hbWUgPSBiR2Vub21lLm5hbWU7XG5cdGxldCBibGtGaWxlID0gbmV3IEJsb2NrVHJhbnNsYXRvcih1cmwsYUdlbm9tZSxiR2Vub21lLGJsb2Nrcyk7XG5cdGlmKCAhIHRoaXMucmNCbG9ja3NbYW5hbWVdKSB0aGlzLnJjQmxvY2tzW2FuYW1lXSA9IHt9O1xuXHRpZiggISB0aGlzLnJjQmxvY2tzW2JuYW1lXSkgdGhpcy5yY0Jsb2Nrc1tibmFtZV0gPSB7fTtcblx0dGhpcy5yY0Jsb2Nrc1thbmFtZV1bYm5hbWVdID0gYmxrRmlsZTtcblx0dGhpcy5yY0Jsb2Nrc1tibmFtZV1bYW5hbWVdID0gYmxrRmlsZTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBMb2FkcyB0aGUgc3ludGVueSBibG9jayBmaWxlIGZvciBnZW5vbWVzIGFHZW5vbWUgYW5kIGJHZW5vbWUuXG4gICAgLy8gXG4gICAgZ2V0QmxvY2tGaWxlIChhR2Vub21lLCBiR2Vub21lKSB7XG5cdC8vIEJlIGEgbGl0dGxlIHNtYXJ0IGFib3V0IHRoZSBvcmRlciB3ZSB0cnkgdGhlIG5hbWVzLi4uXG5cdGlmIChiR2Vub21lLm5hbWUgPCBhR2Vub21lLm5hbWUpIHtcblx0ICAgIGxldCB0bXAgPSBhR2Vub21lOyBhR2Vub21lID0gYkdlbm9tZTsgYkdlbm9tZSA9IHRtcDtcblx0fVxuXHQvLyBGaXJzdCwgc2VlIGlmIHdlIGFscmVhZHkgaGF2ZSB0aGlzIHBhaXJcblx0bGV0IGFuYW1lID0gYUdlbm9tZS5uYW1lO1xuXHRsZXQgYm5hbWUgPSBiR2Vub21lLm5hbWU7XG5cdGxldCBiZiA9ICh0aGlzLnJjQmxvY2tzW2FuYW1lXSB8fCB7fSlbYm5hbWVdO1xuXHRpZiAoYmYpXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGJmKTtcblx0XG5cdC8vIEZvciBhbnkgZ2l2ZW4gZ2Vub21lIHBhaXIsIG9ubHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgdHdvIGZpbGVzXG5cdC8vIGlzIGdlbmVyYXRlZCBieSB0aGUgYmFjayBlbmRcblx0bGV0IGZuMSA9IGAuL2RhdGEvYmxvY2tmaWxlcy8ke2FHZW5vbWUubmFtZX0tJHtiR2Vub21lLm5hbWV9LnRzdmBcblx0bGV0IGZuMiA9IGAuL2RhdGEvYmxvY2tmaWxlcy8ke2JHZW5vbWUubmFtZX0tJHthR2Vub21lLm5hbWV9LnRzdmBcblx0Ly8gVGhlIGZpbGUgZm9yIEEtPkIgaXMgc2ltcGx5IGEgcmUtc29ydCBvZiB0aGUgZmlsZSBmcm9tIEItPkEuIFNvIHRoZSBcblx0Ly8gYmFjayBlbmQgb25seSBjcmVhdGVzIG9uZSBvZiB0aGVtLlxuXHQvLyBXZSdsbCB0cnkgb25lIGFuZCBpZiB0aGF0J3Mgbm90IGl0LCB0aGVuIHRyeSB0aGUgb3RoZXIuXG5cdC8vIChBbmQgaWYgVEhBVCdzIG5vdCBpdCwgdGhlbiBjcnkgYSByaXZlci4uLilcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRyZXR1cm4gZDN0c3YoZm4xKVxuXHQgIC50aGVuKGZ1bmN0aW9uKGJsb2Nrcyl7XG5cdCAgICAgIC8vIHl1cCwgaXQgd2FzIEEtQlxuXHQgICAgICBzZWxmLnJlZ2lzdGVyQmxvY2tzKGZuMSwgYUdlbm9tZSwgYkdlbm9tZSwgYmxvY2tzKTtcblx0ICAgICAgcmV0dXJuIGJsb2Nrc1xuXHQgIH0pXG5cdCAgLmNhdGNoKGZ1bmN0aW9uKGUpe1xuXHQgICAgICBjb25zb2xlLmxvZyhgSU5GTzogRGlzcmVnYXJkIHRoYXQgNDA0IG1lc3NhZ2UhICR7Zm4xfSB3YXMgbm90IGZvdW5kLiBUcnlpbmcgJHtmbjJ9LmApO1xuXHQgICAgICByZXR1cm4gZDN0c3YoZm4yKVxuXHRcdCAgLnRoZW4oZnVuY3Rpb24oYmxvY2tzKXtcblx0XHQgICAgICAvLyBub3BlLCBpdCB3YXMgQi1BXG5cdFx0ICAgICAgc2VsZi5yZWdpc3RlckJsb2NrcyhmbjIsIGJHZW5vbWUsIGFHZW5vbWUsIGJsb2Nrcyk7XG5cdFx0ICAgICAgcmV0dXJuIGJsb2Nrc1xuXHRcdCAgfSlcblx0XHQgIC5jYXRjaChmdW5jdGlvbihlKXtcblx0XHQgICAgICBjb25zb2xlLmxvZygnQnV0IFRIQVQgNDA0IG1lc3NhZ2UgaXMgYSBwcm9ibGVtLicpO1xuXHRcdCAgICAgIHRocm93IGBDYW5ub3QgZ2V0IGJsb2NrIGZpbGUgZm9yIHRoaXMgZ2Vub21lIHBhaXI6ICR7YUdlbm9tZS5uYW1lfSAke2JHZW5vbWUubmFtZX0uXFxuKEVycm9yPSR7ZX0pYDtcblx0XHQgIH0pO1xuXHQgIH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gdGhlIHRyYW5zbGF0b3IgaGFzIGxvYWRlZCBhbGwgdGhlIGRhdGEgbmVlZGVkXG4gICAgLy8gZm9yIHRyYW5zbGF0aW5nIGNvb3JkaW5hdGVzIGJldHdlZW4gdGhlIGN1cnJlbnQgcmVmIHN0cmFpbiBhbmQgdGhlIGN1cnJlbnQgY29tcGFyaXNvbiBzdHJhaW5zLlxuICAgIC8vXG4gICAgcmVhZHkgKCkge1xuXHRsZXQgcHJvbWlzZXMgPSB0aGlzLmFwcC5jR2Vub21lcy5tYXAoY2cgPT4gdGhpcy5nZXRCbG9ja0ZpbGUodGhpcy5hcHAuckdlbm9tZSwgY2cpKTtcblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIHN5bnRlbnkgYmxvY2tzIHRoYXQgbWFwIHRoZSBjdXJyZW50IHJlZiBnZW5vbWUgdG8gdGhlIHNwZWNpZmllZCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIGdldEJsb2NrcyAoZnJvbUdlbm9tZSwgdG9HZW5vbWUpIHtcbiAgICAgICAgbGV0IGJsa1RyYW5zID0gdGhpcy5yY0Jsb2Nrc1tmcm9tR2Vub21lLm5hbWVdW3RvR2Vub21lLm5hbWVdO1xuXHRyZXR1cm4gYmxrVHJhbnMuZ2V0QmxvY2tzKGZyb21HZW5vbWUpXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVHJhbnNsYXRlcyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSBzcGVjaWZpZWQgZnJvbUdlbm9tZSB0byB0aGUgc3BlY2lmaWVkIHRvR2Vub21lLlxuICAgIC8vIFJldHVybnMgYSBsaXN0IG9mIHplcm8gb3IgbW9yZSBjb29yZGluYXRlIHJhbmdlcyBpbiB0aGUgdG9HZW5vbWUuXG4gICAgLy9cbiAgICAvLyBGSVhNRSBpcyB0aGlzIGNvZGUgZXZlbiB1c2VkPyBsb29rcyBvdXQgb2YgcGxhY2UuIGNvcHkvcGFzdGUgZXJyb3I/XG4gICAgdHJhbnNsYXRlIChmcm9tR2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQsIHRvR2Vub21lKSB7XG5cdC8vIGdldCB0aGUgcmlnaHQgYmxvY2sgZmlsZVxuXHRsZXQgYmxrVHJhbnMgPSB0aGlzLnJjQmxvY2tzW2Zyb21HZW5vbWUubmFtZV1bdG9HZW5vbWUubmFtZV07XG5cdGlmICghYmxrVHJhbnMpIHRocm93IFwiSW50ZXJuYWwgZXJyb3IuIE5vIGJsb2NrIGZpbGUgZm91bmQgaW4gaW5kZXguXCJcblx0Ly8gdHJhbnNsYXRlIVxuXHRsZXQgcmFuZ2VzID0gYmxrVHJhbnMudHJhbnNsYXRlKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCk7XG5cdHJldHVybiByYW5nZXM7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgQlRNYW5hZ2VyXG5cbmV4cG9ydCB7IEJUTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQlRNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNvbWV0aGluZyB0aGF0IGtub3dzIGhvdyB0byB0cmFuc2xhdGUgY29vcmRpbmF0ZXMgYmV0d2VlbiB0d28gZ2Vub21lcy5cbi8vXG4vL1xuY2xhc3MgQmxvY2tUcmFuc2xhdG9yIHtcbiAgICBjb25zdHJ1Y3Rvcih1cmwsIGFHZW5vbWUsIGJHZW5vbWUsIGJsb2Nrcyl7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuXHR0aGlzLmFHZW5vbWUgPSBhR2Vub21lO1xuXHR0aGlzLmJHZW5vbWUgPSBiR2Vub21lO1xuXHR0aGlzLmJsb2NrcyA9IGJsb2Nrcy5tYXAoYiA9PiB0aGlzLnByb2Nlc3NCbG9jayhiKSlcblx0dGhpcy5jdXJyZW50U29ydCA9IFwiYVwiO1xuICAgIH1cbiAgICBwcm9jZXNzQmxvY2sgKGJsaykgeyBcbiAgICAgICAgYmxrLmFJbmRleCA9IHBhcnNlSW50KGJsay5hSW5kZXgpO1xuICAgICAgICBibGsuYkluZGV4ID0gcGFyc2VJbnQoYmxrLmJJbmRleCk7XG4gICAgICAgIGJsay5hU3RhcnQgPSBwYXJzZUludChibGsuYVN0YXJ0KTtcbiAgICAgICAgYmxrLmJTdGFydCA9IHBhcnNlSW50KGJsay5iU3RhcnQpO1xuICAgICAgICBibGsuYUVuZCAgID0gcGFyc2VJbnQoYmxrLmFFbmQpO1xuICAgICAgICBibGsuYkVuZCAgID0gcGFyc2VJbnQoYmxrLmJFbmQpO1xuICAgICAgICBibGsuYUxlbmd0aCAgID0gcGFyc2VJbnQoYmxrLmFMZW5ndGgpO1xuICAgICAgICBibGsuYkxlbmd0aCAgID0gcGFyc2VJbnQoYmxrLmJMZW5ndGgpO1xuICAgICAgICBibGsuYmxvY2tDb3VudCAgID0gcGFyc2VJbnQoYmxrLmJsb2NrQ291bnQpO1xuICAgICAgICBibGsuYmxvY2tSYXRpbyAgID0gcGFyc2VGbG9hdChibGsuYmxvY2tSYXRpbyk7XG5cdGJsay5hYk1hcCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdCAgICAuZG9tYWluKFtibGsuYVN0YXJ0LGJsay5hRW5kXSlcblx0ICAgIC5yYW5nZSggYmxrLmJsb2NrT3JpPT09XCItXCIgPyBbYmxrLmJFbmQsYmxrLmJTdGFydF0gOiBbYmxrLmJTdGFydCxibGsuYkVuZF0pO1xuXHRibGsuYmFNYXAgPSBibGsuYWJNYXAuaW52ZXJ0XG5cdHJldHVybiBibGs7XG4gICAgfVxuICAgIHNldFNvcnQgKHdoaWNoKSB7XG5cdGlmICh3aGljaCAhPT0gJ2EnICYmIHdoaWNoICE9PSAnYicpIHRocm93IFwiQmFkIGFyZ3VtZW50OlwiICsgd2hpY2g7XG5cdGxldCBzb3J0Q29sID0gd2hpY2ggKyBcIkluZGV4XCI7XG5cdGxldCBjbXAgPSAoeCx5KSA9PiB4W3NvcnRDb2xdIC0geVtzb3J0Q29sXTtcblx0dGhpcy5ibG9ja3Muc29ydChjbXApO1xuXHR0aGlzLmN1cnJTb3J0ID0gd2hpY2g7XG4gICAgfVxuICAgIGZsaXBTb3J0ICgpIHtcblx0dGhpcy5zZXRTb3J0KHRoaXMuY3VyclNvcnQgPT09IFwiYVwiID8gXCJiXCIgOiBcImFcIik7XG4gICAgfVxuICAgIC8vIEdpdmVuIGEgZ2Vub21lIChlaXRoZXIgdGhlIGEgb3IgYiBnZW5vbWUpIGFuZCBhIGNvb3JkaW5hdGUgcmFuZ2UsXG4gICAgLy8gcmV0dXJucyB0aGUgZXF1aXZhbGVudCBjb29yZGluYXRlIHJhbmdlKHMpIGluIHRoZSBvdGhlciBnZW5vbWVcbiAgICB0cmFuc2xhdGUgKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCkge1xuXHQvL1xuXHRlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHN0YXJ0IDogZW5kO1xuXHQvLyBmcm9tID0gXCJhXCIgb3IgXCJiXCIsIGRlcGVuZGluZyBvbiB3aGljaCBnZW5vbWUgaXMgZ2l2ZW4uXG4gICAgICAgIGxldCBmcm9tID0gKGZyb21HZW5vbWUgPT09IHRoaXMuYUdlbm9tZSA/IFwiYVwiIDogZnJvbUdlbm9tZSA9PT0gdGhpcy5iR2Vub21lID8gXCJiXCIgOiBudWxsKTtcblx0aWYgKCFmcm9tKSB0aHJvdyBcIkJhZCBhcmd1bWVudC4gR2Vub21lIG5laXRoZXIgQSBub3IgQi5cIjtcblx0Ly8gdG8gPSBcImJcIiBvciBcImFcIiwgb3Bwb3NpdGUgb2YgZnJvbVxuXHRsZXQgdG8gPSAoZnJvbSA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcblx0Ly8gbWFrZSBzdXJlIHRoZSBibG9ja3MgYXJlIHNvcnRlZCBieSB0aGUgZnJvbSBnZW5vbWVcblx0dGhpcy5zZXRTb3J0KGZyb20pO1xuXHQvL1xuXHRsZXQgZnJvbUMgPSBmcm9tK1wiQ2hyXCI7XG5cdGxldCBmcm9tUyA9IGZyb20rXCJTdGFydFwiO1xuXHRsZXQgZnJvbUUgPSBmcm9tK1wiRW5kXCI7XG5cdGxldCBmcm9tSSA9IGZyb20rXCJJbmRleFwiO1xuXHRsZXQgdG9DID0gdG8rXCJDaHJcIjtcblx0bGV0IHRvUyA9IHRvK1wiU3RhcnRcIjtcblx0bGV0IHRvRSA9IHRvK1wiRW5kXCI7XG5cdGxldCB0b0kgPSB0bytcIkluZGV4XCI7XG5cdGxldCBtYXBwZXIgPSBmcm9tK3RvK1wiTWFwXCI7XG5cdC8vIFxuXHRsZXQgYmxrcyA9IHRoaXMuYmxvY2tzXG5cdCAgICAvLyBGaXJzdCBmaWx0ZXIgZm9yIGJsb2NrcyB0aGF0IG92ZXJsYXAgdGhlIGdpdmVuIGNvb3JkaW5hdGUgcmFuZ2UgaW4gdGhlIGZyb20gZ2Vub21lXG5cdCAgICAuZmlsdGVyKGJsayA9PiBibGtbZnJvbUNdID09PSBjaHIgJiYgYmxrW2Zyb21TXSA8PSBlbmQgJiYgYmxrW2Zyb21FXSA+PSBzdGFydClcblx0ICAgIC8vIG1hcCBlYWNoIGJsb2NrLiBcblx0ICAgIC5tYXAoYmxrID0+IHtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgZnJvbSBzaWRlLlxuXHRcdGxldCBzID0gTWF0aC5tYXgoc3RhcnQsIGJsa1tmcm9tU10pO1xuXHRcdGxldCBlID0gTWF0aC5taW4oZW5kLCBibGtbZnJvbUVdKTtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgdG8gc2lkZS5cblx0XHRsZXQgczIgPSBNYXRoLmNlaWwoYmxrW21hcHBlcl0ocykpO1xuXHRcdGxldCBlMiA9IE1hdGguZmxvb3IoYmxrW21hcHBlcl0oZSkpO1xuXHQgICAgICAgIHJldHVybiB7XG5cdFx0ICAgIGNocjogICBibGtbdG9DXSxcblx0XHQgICAgc3RhcnQ6IE1hdGgubWluKHMyLGUyKSxcblx0XHQgICAgZW5kOiAgIE1hdGgubWF4KHMyLGUyKSxcblx0XHQgICAgb3JpOiAgIGJsay5ibG9ja09yaSxcblx0XHQgICAgaW5kZXg6IGJsa1t0b0ldLFxuXHRcdCAgICAvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZGluYXRlcyBjb3JyZXNwb25kaW5nIHRvIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0ICAgIGZDaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgZlN0YXJ0OiBzLFxuXHRcdCAgICBmRW5kOiAgIGUsXG5cdFx0ICAgIGZJbmRleDogYmxrW2Zyb21JXSxcblx0XHQgICAgLy8gaW5jbHVkZSB0aGUgYmxvY2sgaWQgYW5kIGZ1bGwgYmxvY2sgY29vcmRzXG5cdFx0ICAgIGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdCAgICBibG9ja1N0YXJ0OiBibGtbdG9TXSxcblx0XHQgICAgYmxvY2tFbmQ6IGJsa1t0b0VdXG5cdFx0fTtcblx0ICAgIH0pXG5cdC8vIFxuXHRyZXR1cm4gYmxrcztcbiAgICB9XG4gICAgLy8gR2l2ZW4gYSBnZW5vbWUgKGVpdGhlciB0aGUgYSBvciBiIGdlbm9tZSlcbiAgICAvLyByZXR1cm5zIHRoZSBibG9ja3MgZm9yIHRyYW5zbGF0aW5nIHRvIHRoZSBvdGhlciAoYiBvciBhKSBnZW5vbWUuXG4gICAgLy9cbiAgICBnZXRCbG9ja3MgKGZyb21HZW5vbWUpIHtcblx0Ly8gZnJvbSA9IFwiYVwiIG9yIFwiYlwiLCBkZXBlbmRpbmcgb24gd2hpY2ggZ2Vub21lIGlzIGdpdmVuLlxuICAgICAgICBsZXQgZnJvbSA9IChmcm9tR2Vub21lID09PSB0aGlzLmFHZW5vbWUgPyBcImFcIiA6IGZyb21HZW5vbWUgPT09IHRoaXMuYkdlbm9tZSA/IFwiYlwiIDogbnVsbCk7XG5cdGlmICghZnJvbSkgdGhyb3cgXCJCYWQgYXJndW1lbnQuIEdlbm9tZSBuZWl0aGVyIEEgbm9yIEIuXCI7XG5cdC8vIHRvID0gXCJiXCIgb3IgXCJhXCIsIG9wcG9zaXRlIG9mIGZyb21cblx0bGV0IHRvID0gKGZyb20gPT09IFwiYVwiID8gXCJiXCIgOiBcImFcIik7XG5cdC8vIG1ha2Ugc3VyZSB0aGUgYmxvY2tzIGFyZSBzb3J0ZWQgYnkgdGhlIGZyb20gZ2Vub21lXG5cdHRoaXMuc2V0U29ydChmcm9tKTtcblx0Ly9cblx0bGV0IGZyb21DID0gZnJvbStcIkNoclwiO1xuXHRsZXQgZnJvbVMgPSBmcm9tK1wiU3RhcnRcIjtcblx0bGV0IGZyb21FID0gZnJvbStcIkVuZFwiO1xuXHRsZXQgdG9DID0gdG8rXCJDaHJcIjtcblx0bGV0IHRvUyA9IHRvK1wiU3RhcnRcIjtcblx0bGV0IHRvRSA9IHRvK1wiRW5kXCI7XG5cdGxldCBtYXBwZXIgPSBmcm9tK3RvK1wiTWFwXCI7XG5cdC8vIFxuXHRsZXQgYmxrcyA9IHRoaXMuYmxvY2tzXG5cdCAgICAubWFwKGJsayA9PiB7XG5cdCAgICAgICAgcmV0dXJuIHtcblx0XHQgICAgYmxvY2tJZDogICBibGsuYmxvY2tJZCxcblx0XHQgICAgb3JpOiAgICAgICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGZyb21DaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgZnJvbVN0YXJ0OiBibGtbZnJvbVNdLFxuXHRcdCAgICBmcm9tRW5kOiAgIGJsa1tmcm9tRV0sXG5cdFx0ICAgIHRvQ2hyOiAgICAgYmxrW3RvQ10sXG5cdFx0ICAgIHRvU3RhcnQ6ICAgYmxrW3RvU10sXG5cdFx0ICAgIHRvRW5kOiAgICAgYmxrW3RvRV0sXG5cdFx0fTtcblx0ICAgIH0pXG5cdC8vIFxuXHRyZXR1cm4gYmxrcztcbiAgICB9XG59XG5cbmV4cG9ydCB7IEJsb2NrVHJhbnNsYXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQmxvY2tUcmFuc2xhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTVkdWaWV3IH0gZnJvbSAnLi9TVkdWaWV3JztcbmltcG9ydCB7IGNvb3Jkc0FmdGVyVHJhbnNmb3JtIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgR2Vub21lVmlldyBleHRlbmRzIFNWR1ZpZXcge1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCk7XG5cdHRoaXMub3BlbldpZHRoID0gdGhpcy5vdXRlcldpZHRoO1xuXHR0aGlzLm9wZW5IZWlnaHQ9IHRoaXMub3V0ZXJIZWlnaHQ7XG5cdHRoaXMudG90YWxDaHJXaWR0aCA9IDQwOyAvLyB0b3RhbCB3aWR0aCBvZiBvbmUgY2hyb21vc29tZSAoYmFja2JvbmUrYmxvY2tzK2ZlYXRzKVxuXHR0aGlzLmN3aWR0aCA9IDIwOyAgICAgICAgLy8gY2hyb21vc29tZSB3aWR0aFxuXHR0aGlzLnRpY2tMZW5ndGggPSAxMDtcdCAvLyBmZWF0dXJlIHRpY2sgbWFyayBsZW5ndGhcblx0dGhpcy5icnVzaENociA9IG51bGw7XHQgLy8gd2hpY2ggY2hyIGhhcyB0aGUgY3VycmVudCBicnVzaFxuXHR0aGlzLmJ3aWR0aCA9IHRoaXMuY3dpZHRoLzI7ICAvLyBibG9jayB3aWR0aFxuXHR0aGlzLmN1cnJCbG9ja3MgPSBudWxsO1xuXHR0aGlzLmN1cnJUaWNrcyA9IG51bGw7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzID0gdGhpcy5zdmdNYWluLmFwcGVuZCgnZycpLmF0dHIoXCJuYW1lXCIsIFwiY2hyb21vc29tZXNcIik7XG5cdHRoaXMudGl0bGUgICAgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCd0ZXh0JykuYXR0cihcImNsYXNzXCIsIFwidGl0bGVcIik7XG5cdHRoaXMuc2Nyb2xsQW1vdW50ID0gMDtcblx0Ly9cblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZpdFRvV2lkdGggKHcpe1xuICAgICAgICBzdXBlci5maXRUb1dpZHRoKHcpO1xuXHR0aGlzLm9wZW5XaWR0aCA9IHRoaXMub3V0ZXJXaWR0aDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdERvbSAoKSB7XG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b24uY2xvc2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHRoaXMucmVkcmF3KCkpO1xuXHR0aGlzLnN2Zy5vbihcIndoZWVsXCIsICgpID0+IHtcblx0ICAgIGlmICghdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIikpIHJldHVybjtcblx0ICAgIHRoaXMuc2Nyb2xsV2hlZWwoZDMuZXZlbnQuZGVsdGFZKVxuXHQgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fSk7XG5cdGxldCBzYnMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInN2Z2NvbnRhaW5lclwiXSA+IFtuYW1lPVwic2Nyb2xsYnV0dG9uc1wiXScpXG5cdHNicy5zZWxlY3QoJy5idXR0b25bbmFtZT1cInVwXCJdJykub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNjcm9sbENocm9tb3NvbWVzVXAoKSk7XG5cdHNicy5zZWxlY3QoJy5idXR0b25bbmFtZT1cImRuXCJdJykub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNjcm9sbENocm9tb3NvbWVzRG93bigpKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRCcnVzaENvb3JkcyAoY29vcmRzKSB7XG5cdHRoaXMuY2xlYXJCcnVzaGVzKCk7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdChgLmNocm9tb3NvbWVbbmFtZT1cIiR7Y29vcmRzLmNocn1cIl0gZ1tuYW1lPVwiYnJ1c2hcIl1gKVxuXHQgIC5lYWNoKGZ1bmN0aW9uKGNocil7XG5cdCAgICBjaHIuYnJ1c2guZXh0ZW50KFtjb29yZHMuc3RhcnQsY29vcmRzLmVuZF0pO1xuXHQgICAgY2hyLmJydXNoKGQzLnNlbGVjdCh0aGlzKSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBicnVzaHN0YXJ0IChjaHIpe1xuXHR0aGlzLmNsZWFyQnJ1c2hlcyhjaHIuYnJ1c2gpO1xuXHR0aGlzLmJydXNoQ2hyID0gY2hyO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJydXNoZW5kICgpe1xuXHRpZighdGhpcy5icnVzaENocikgcmV0dXJuO1xuXHR2YXIgeHRudCA9IHRoaXMuYnJ1c2hDaHIuYnJ1c2guZXh0ZW50KCk7XG5cdGlmIChNYXRoLmFicyh4dG50WzBdIC0geHRudFsxXSkgPD0gMTApe1xuXHQgICAgLy8gdXNlciBjbGlja2VkXG5cdCAgICBsZXQgY3h0ID0gdGhpcy5hcHAuZ2V0Q29udGV4dCgpXG5cdCAgICBsZXQgdyA9IGN4dC5lbmQgLSBjeHQuc3RhcnQgKyAxO1xuXHQgICAgeHRudFswXSAtPSB3LzI7XG5cdCAgICB4dG50WzFdICs9IHcvMjtcblx0fVxuXHRsZXQgY29vcmRzID0geyBjaHI6dGhpcy5icnVzaENoci5uYW1lLCBzdGFydDpNYXRoLmZsb29yKHh0bnRbMF0pLCBlbmQ6IE1hdGguZmxvb3IoeHRudFsxXSkgfTtcblx0dGhpcy5hcHAuc2V0Q29udGV4dChjb29yZHMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQnJ1c2hlcyAoZXhjZXB0KXtcblx0dGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKCdbbmFtZT1cImJydXNoXCJdJykuZWFjaChmdW5jdGlvbihjaHIpe1xuXHQgICAgaWYgKGNoci5icnVzaCAhPT0gZXhjZXB0KSB7XG5cdFx0Y2hyLmJydXNoLmNsZWFyKCk7XG5cdFx0Y2hyLmJydXNoKGQzLnNlbGVjdCh0aGlzKSk7XG5cdCAgICB9XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldFggKGNocikge1xuXHRsZXQgeCA9IHRoaXMuYXBwLnJHZW5vbWUueHNjYWxlKGNocik7XG5cdGlmIChpc05hTih4KSkgdGhyb3cgXCJ4IGlzIE5hTlwiXG5cdHJldHVybiB4O1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRZIChwb3MpIHtcblx0bGV0IHkgPSB0aGlzLmFwcC5yR2Vub21lLnlzY2FsZShwb3MpO1xuXHRpZiAoaXNOYU4oeSkpIHRocm93IFwieSBpcyBOYU5cIlxuXHRyZXR1cm4geTtcbiAgICB9XG4gICAgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVkcmF3ICgpIHtcbiAgICAgICAgdGhpcy5kcmF3KHRoaXMuY3VyclRpY2tzLCB0aGlzLmN1cnJCbG9ja3MpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRyYXcgKHRpY2tEYXRhLCBibG9ja0RhdGEpIHtcblx0dGhpcy5kcmF3Q2hyb21vc29tZXMoKTtcblx0dGhpcy5kcmF3QmxvY2tzKGJsb2NrRGF0YSk7XG5cdHRoaXMuZHJhd1RpY2tzKHRpY2tEYXRhKTtcblx0dGhpcy5kcmF3VGl0bGUoKTtcblx0dGhpcy5zZXRCcnVzaENvb3Jkcyh0aGlzLmFwcC5jb29yZHMpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSBjaHJvbW9zb21lcyBvZiB0aGUgcmVmZXJlbmNlIGdlbm9tZS5cbiAgICAvLyBJbmNsdWRlcyBiYWNrYm9uZXMsIGxhYmVscywgYW5kIGJydXNoZXMuXG4gICAgLy8gVGhlIGJhY2tib25lcyBhcmUgZHJhd24gYXMgdmVydGljYWwgbGluZSBzZW1lbnRzLFxuICAgIC8vIGRpc3RyaWJ1dGVkIGhvcml6b250YWxseS4gT3JkZXJpbmcgaXMgZGVmaW5lZCBieVxuICAgIC8vIHRoZSBtb2RlbCAoR2Vub21lIG9iamVjdCkuXG4gICAgLy8gTGFiZWxzIGFyZSBkcmF3biBhYm92ZSB0aGUgYmFja2JvbmVzLlxuICAgIC8vXG4gICAgLy8gTW9kaWZpY2F0aW9uOlxuICAgIC8vIERyYXdzIHRoZSBzY2VuZSBpbiBvbmUgb2YgdHdvIHN0YXRlczogb3BlbiBvciBjbG9zZWQuXG4gICAgLy8gVGhlIG9wZW4gc3RhdGUgaXMgYXMgZGVzY3JpYmVkIC0gYWxsIGNocm9tb3NvbWVzIHNob3duLlxuICAgIC8vIEluIHRoZSBjbG9zZWQgc3RhdGU6IFxuICAgIC8vICAgICAqIG9ubHkgb25lIGNocm9tb3NvbWUgc2hvd3MgKHRoZSBjdXJyZW50IG9uZSlcbiAgICAvLyAgICAgKiBkcmF3biBob3Jpem9udGFsbHkgYW5kIHBvc2l0aW9uZWQgYmVzaWRlIHRoZSBcIkdlbm9tZSBWaWV3XCIgdGl0bGVcbiAgICAvL1xuICAgIGRyYXdDaHJvbW9zb21lcyAoKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblxuXHRsZXQgcmcgPSB0aGlzLmFwcC5yR2Vub21lOyAvLyByZWYgZ2Vub21lXG5cdGxldCByQ2hycyA9IHJnLmNocm9tb3NvbWVzO1xuXG4gICAgICAgIC8vIENocm9tb3NvbWUgZ3JvdXBzXG5cdGxldCBjaHJzID0gdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKFwiLmNocm9tb3NvbWVcIilcblx0ICAgIC5kYXRhKHJDaHJzLCBjID0+IGMubmFtZSk7XG5cdGxldCBuZXdjaHJzID0gY2hycy5lbnRlcigpLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjaHJvbW9zb21lXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgYyA9PiBjLm5hbWUpO1xuXHRcblx0bmV3Y2hycy5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJuYW1lXCIsXCJsYWJlbFwiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJsaW5lXCIpLmF0dHIoXCJuYW1lXCIsXCJiYWNrYm9uZVwiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJzeW5CbG9ja3NcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwidGlja3NcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwiYnJ1c2hcIik7XG5cblxuXHRsZXQgY2xvc2VkID0gdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIik7XG5cdGlmIChjbG9zZWQpIHtcblx0ICAgIC8vIFJlc2V0IHRoZSBTVkcgc2l6ZSB0byBiZSAxLWNocm9tb3NvbWUgd2lkZS5cblx0ICAgIC8vIFRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAgc28gdGhhdCB0aGUgY3VycmVudCBjaHJvbW9zb21lIGFwcGVhcnMgaW4gdGhlIHN2ZyBhcmVhLlxuXHQgICAgLy8gVHVybiBpdCA5MCBkZWcuXG5cblx0ICAgIC8vIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBTVkcgYXJlYSB0byAxIGNocm9tb3NvbWUncyB3aWR0aFxuXHQgICAgdGhpcy5zZXRHZW9tKHsgaGVpZ2h0OiB0aGlzLnRvdGFsQ2hyV2lkdGgsIHJvdGF0aW9uOiAtOTAsIHRyYW5zbGF0aW9uOiBbLXRoaXMudG90YWxDaHJXaWR0aC8yLDMwXSB9KTtcblx0ICAgIC8vIFxuXHQgICAgbGV0IGRlbHRhID0gMTA7XG5cdCAgICByZy54c2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcblx0XHQgLmRvbWFpbihyQ2hycy5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHgubmFtZTt9KSlcblx0XHQgLy8gaW4gY2xvc2VkIG1vZGUsIHRoZSBjaHJvbW9zb21lcyBoYXZlIGZpeGVkIHNwYWNpbmdcblx0XHQgLnJhbmdlUG9pbnRzKFtkZWx0YSwgZGVsdGErdGhpcy50b3RhbENocldpZHRoKihyQ2hycy5sZW5ndGgtMSldKTtcblx0ICAgIC8vXG5cdCAgICByZy55c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdCAuZG9tYWluKFsxLHJnLm1heGxlbl0pXG5cdFx0IC5yYW5nZShbMCwgdGhpcy53aWR0aF0pO1xuXG5cdCAgICAvLyB0cmFuc2xhdGUgZWFjaCBjaHJvbW9zb21lIGludG8gcG9zaXRpb25cblx0ICAgIGNocnMuYXR0cihcInRyYW5zZm9ybVwiLCBjID0+IGB0cmFuc2xhdGUoJHtyZy54c2NhbGUoYy5uYW1lKX0sIDApYCk7XG4gICAgICAgICAgICAvLyB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKC1yZy54c2NhbGUodGhpcy5hcHAuY29vcmRzLmNocikpO1xuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIC8vIFdoZW4gb3BlbiwgZHJhdyBhbGwgdGhlIGNocm9tb3NvbWVzLiBFYWNoIGNocm9tIGlzIGEgdmVydGljYWwgbGluZS5cblx0ICAgIC8vIENocm9tcyBhcmUgZGlzdHJpYnV0ZWQgZXZlbmx5IGFjcm9zcyB0aGUgYXZhaWxhYmxlIGhvcml6b250YWwgc3BhY2UuXG5cdCAgICB0aGlzLnNldEdlb20oeyB3aWR0aDogdGhpcy5vcGVuV2lkdGgsIGhlaWdodDogdGhpcy5vcGVuSGVpZ2h0LCByb3RhdGlvbjogMCwgdHJhbnNsYXRpb246IFswLDBdIH0pO1xuXHQgICAgLy8gXG5cdCAgICByZy54c2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcblx0XHQgLmRvbWFpbihyQ2hycy5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHgubmFtZTt9KSlcblx0XHQgLy8gaW4gY2xvc2VkIG1vZGUsIHRoZSBjaHJvbW9zb21lcyBzcHJlYWQgdG8gZmlsbCB0aGUgc3BhY2Vcblx0XHQgLnJhbmdlUG9pbnRzKFswLCB0aGlzLm9wZW5XaWR0aCAtIDMwXSwgMC41KTtcblx0ICAgIHJnLnlzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0IC5kb21haW4oWzEscmcubWF4bGVuXSlcblx0XHQgLnJhbmdlKFswLCB0aGlzLmhlaWdodF0pO1xuXG5cdCAgICAvLyB0cmFuc2xhdGUgZWFjaCBjaHJvbW9zb21lIGludG8gcG9zaXRpb25cblx0ICAgIGNocnMuYXR0cihcInRyYW5zZm9ybVwiLCBjID0+IGB0cmFuc2xhdGUoJHtyZy54c2NhbGUoYy5uYW1lKX0sIDApYCk7XG4gICAgICAgICAgICAvLyB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKDApO1xuXHR9XG5cblx0ckNocnMuZm9yRWFjaChjaHIgPT4ge1xuXHQgICAgdmFyIHNjID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQuZG9tYWluKFsxLGNoci5sZW5ndGhdKVxuXHRcdC5yYW5nZShbMCwgcmcueXNjYWxlKGNoci5sZW5ndGgpXSk7XG5cdCAgICBjaHIuYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKS55KHNjKVxuXHQgICAgICAgLm9uKFwiYnJ1c2hzdGFydFwiLCBjaHIgPT4gdGhpcy5icnVzaHN0YXJ0KGNocikpXG5cdCAgICAgICAub24oXCJicnVzaGVuZFwiLCAoKSA9PiB0aGlzLmJydXNoZW5kKCkpO1xuXHQgIH0sIHRoaXMpO1xuXG5cbiAgICAgICAgY2hycy5zZWxlY3QoJ1tuYW1lPVwibGFiZWxcIl0nKVxuXHQgICAgLnRleHQoYz0+Yy5uYW1lKVxuXHQgICAgLmF0dHIoXCJ4XCIsIDApIFxuXHQgICAgLmF0dHIoXCJ5XCIsIC0yKVxuXHQgICAgO1xuXG5cdGNocnMuc2VsZWN0KCdbbmFtZT1cImJhY2tib25lXCJdJylcblx0ICAgIC5hdHRyKFwieDFcIiwgMClcblx0ICAgIC5hdHRyKFwieTFcIiwgMClcblx0ICAgIC5hdHRyKFwieDJcIiwgMClcblx0ICAgIC5hdHRyKFwieTJcIiwgYyA9PiByZy55c2NhbGUoYy5sZW5ndGgpKVxuXHQgICAgO1xuXHQgICBcblx0Y2hycy5zZWxlY3QoJ1tuYW1lPVwiYnJ1c2hcIl0nKVxuXHQgICAgLmVhY2goZnVuY3Rpb24oZCl7ZDMuc2VsZWN0KHRoaXMpLmNhbGwoZC5icnVzaCk7fSlcblx0ICAgIC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHQgICAgIC5hdHRyKCd3aWR0aCcsMTApXG5cdCAgICAgLmF0dHIoJ3gnLCAtNSlcblx0ICAgIDtcblxuXHRjaHJzLmV4aXQoKS5yZW1vdmUoKTtcblx0XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2Nyb2xsIHdoZWVsIGV2ZW50IGhhbmRsZXIuXG4gICAgc2Nyb2xsV2hlZWwgKGR5KSB7XG5cdC8vIEFkZCBkeSB0byB0b3RhbCBzY3JvbGwgYW1vdW50LiBUaGVuIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNCeShkeSk7XG5cdC8vIEFmdGVyIGEgMjAwIG1zIHBhdXNlIGluIHNjcm9sbGluZywgc25hcCB0byBuZWFyZXN0IGNocm9tb3NvbWVcblx0dGhpcy50b3V0ICYmIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50b3V0KTtcblx0dGhpcy50b3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCk9PnRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCksIDIwMCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzVG8gKHgpIHtcbiAgICAgICAgaWYgKHggPT09IHVuZGVmaW5lZCkgeCA9IHRoaXMuc2Nyb2xsQW1vdW50O1xuXHR0aGlzLnNjcm9sbEFtb3VudCA9IE1hdGgubWF4KE1hdGgubWluKHgsMTUpLCAtdGhpcy50b3RhbENocldpZHRoICogKHRoaXMuYXBwLnJHZW5vbWUuY2hyb21vc29tZXMubGVuZ3RoLTEpKTtcblx0dGhpcy5nQ2hyb21vc29tZXMuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7dGhpcy5zY3JvbGxBbW91bnR9LDApYCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzQnkgKGR4KSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbyh0aGlzLnNjcm9sbEFtb3VudCArIGR4KTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNTbmFwICgpIHtcblx0bGV0IGkgPSBNYXRoLnJvdW5kKHRoaXMuc2Nyb2xsQW1vdW50IC8gdGhpcy50b3RhbENocldpZHRoKVxuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oaSp0aGlzLnRvdGFsQ2hyV2lkdGgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc1VwICgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc0J5KC10aGlzLnRvdGFsQ2hyV2lkdGgpO1xuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc0Rvd24gKCkge1xuICAgICAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzQnkodGhpcy50b3RhbENocldpZHRoKTtcblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZHJhd1RpdGxlICgpIHtcblx0bGV0IHJlZmcgPSB0aGlzLmFwcC5yR2Vub21lLmxhYmVsO1xuXHRsZXQgYmxvY2tnID0gdGhpcy5jdXJyQmxvY2tzID8gXG5cdCAgICB0aGlzLmN1cnJCbG9ja3MuY29tcCAhPT0gdGhpcy5hcHAuckdlbm9tZSA/XG5cdCAgICAgICAgdGhpcy5jdXJyQmxvY2tzLmNvbXAubGFiZWxcblx0XHQ6XG5cdFx0bnVsbFxuXHQgICAgOlxuXHQgICAgbnVsbDtcblx0bGV0IGxzdCA9IHRoaXMuYXBwLmN1cnJMaXN0ID8gdGhpcy5hcHAuY3Vyckxpc3QubmFtZSA6IG51bGw7XG5cblx0dGhpcy5yb290LnNlbGVjdChcImxhYmVsIHNwYW4udGl0bGVcIikudGV4dChyZWZnKTtcblxuXHRsZXQgbGluZXMgPSBbXTtcblx0YmxvY2tnICYmIGxpbmVzLnB1c2goYEJsb2NrcyB2cy4gJHtibG9ja2d9YCk7XG5cdGxzdCAmJiBsaW5lcy5wdXNoKGBGZWF0dXJlcyBmcm9tIGxpc3QgXCIke2xzdH1cImApO1xuXHRsZXQgc3VidCA9IGxpbmVzLmpvaW4oXCIgOjogXCIpO1xuXHR0aGlzLnJvb3Quc2VsZWN0KFwibGFiZWwgc3Bhbi5zdWJ0aXRsZVwiKS50ZXh0KChzdWJ0ID8gXCI6OiBcIiA6IFwiXCIpICsgc3VidCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIG91dGxpbmVzIG9mIHN5bnRlbnkgYmxvY2tzIG9mIHRoZSByZWYgZ2Vub21lIHZzLlxuICAgIC8vIHRoZSBnaXZlbiBnZW5vbWUuXG4gICAgLy8gUGFzc2luZyBudWxsIGVyYXNlcyBhbGwgc3ludGVueSBibG9ja3MuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBkYXRhID09IHsgcmVmOkdlbm9tZSwgY29tcDpHZW5vbWUsIGJsb2NrczogbGlzdCBvZiBzeW50ZW55IGJsb2NrcyB9XG4gICAgLy8gICAgRWFjaCBzYmxvY2sgPT09IHsgYmxvY2tJZDppbnQsIG9yaTorLy0sIGZyb21DaHIsIGZyb21TdGFydCwgZnJvbUVuZCwgdG9DaHIsIHRvU3RhcnQsIHRvRW5kIH1cbiAgICBkcmF3QmxvY2tzIChkYXRhKSB7XG5cdC8vXG4gICAgICAgIGxldCBzYmdycHMgPSB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoXCIuY2hyb21vc29tZVwiKS5zZWxlY3QoJ1tuYW1lPVwic3luQmxvY2tzXCJdJyk7XG5cdGlmICghZGF0YSB8fCAhZGF0YS5ibG9ja3MgfHwgZGF0YS5ibG9ja3MubGVuZ3RoID09PSAwKSB7XG5cdCAgICB0aGlzLmN1cnJCbG9ja3MgPSBudWxsO1xuXHQgICAgc2JncnBzLmh0bWwoJycpO1xuXHQgICAgdGhpcy5kcmF3VGl0bGUoKTtcblx0ICAgIHJldHVybjtcblx0fVxuXHR0aGlzLmN1cnJCbG9ja3MgPSBkYXRhO1xuXHQvLyByZW9yZ2FuaXplIGRhdGEgdG8gcmVmbGVjdCBTVkcgc3RydWN0dXJlIHdlIHdhbnQsIGllLCBncm91cGVkIGJ5IGNocm9tb3NvbWVcbiAgICAgICAgbGV0IGR4ID0gZGF0YS5ibG9ja3MucmVkdWNlKChhLHNiKSA9PiB7XG5cdFx0aWYgKCFhW3NiLmZyb21DaHJdKSBhW3NiLmZyb21DaHJdID0gW107XG5cdFx0YVtzYi5mcm9tQ2hyXS5wdXNoKHNiKTtcblx0XHRyZXR1cm4gYTtcblx0ICAgIH0sIHt9KTtcblx0c2JncnBzLmVhY2goZnVuY3Rpb24oYyl7XG5cdCAgICBkMy5zZWxlY3QodGhpcykuZGF0dW0oe2NocjogYy5uYW1lLCBibG9ja3M6IGR4W2MubmFtZV0gfHwgW10gfSk7XG5cdH0pO1xuXG5cdGxldCBid2lkdGggPSAxMDtcbiAgICAgICAgbGV0IHNibG9ja3MgPSBzYmdycHMuc2VsZWN0QWxsKCdyZWN0LnNibG9jaycpLmRhdGEoYj0+Yi5ibG9ja3MpO1xuICAgICAgICBsZXQgbmV3YnMgPSBzYmxvY2tzLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuYXR0cignY2xhc3MnLCdzYmxvY2snKTtcblx0c2Jsb2Nrc1xuXHQgICAgLmF0dHIoXCJ4XCIsIC1id2lkdGgvMiApXG5cdCAgICAuYXR0cihcInlcIiwgYiA9PiB0aGlzLmdldFkoYi5mcm9tU3RhcnQpKVxuXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCBid2lkdGgpXG5cdCAgICAuYXR0cihcImhlaWdodFwiLCBiID0+IE1hdGgubWF4KDAsdGhpcy5nZXRZKGIuZnJvbUVuZCAtIGIuZnJvbVN0YXJ0ICsgMSkpKVxuXHQgICAgLmNsYXNzZWQoXCJpbnZlcnNpb25cIiwgYiA9PiBiLm9yaSA9PT0gXCItXCIpXG5cdCAgICAuY2xhc3NlZChcInRyYW5zbG9jYXRpb25cIiwgYiA9PiBiLmZyb21DaHIgIT09IGIudG9DaHIpXG5cdCAgICA7XG5cbiAgICAgICAgc2Jsb2Nrcy5leGl0KCkucmVtb3ZlKCk7XG5cblx0dGhpcy5kcmF3VGl0bGUoKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3VGlja3MgKGZlYXR1cmVzKSB7XG5cdHRoaXMuY3VyclRpY2tzID0gZmVhdHVyZXM7XG5cdGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7IC8vIHJlZiBnZW5vbWVcblx0Ly8gZmVhdHVyZSB0aWNrIG1hcmtzXG5cdGlmICghZmVhdHVyZXMgfHwgZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XG5cdCAgICB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoJ1tuYW1lPVwidGlja3NcIl0nKS5zZWxlY3RBbGwoXCIuZmVhdHVyZVwiKS5yZW1vdmUoKTtcblx0ICAgIHJldHVybjtcblx0fVxuXG5cdC8vXG5cdGxldCB0R3JwcyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpLnNlbGVjdCgnW25hbWU9XCJ0aWNrc1wiXScpO1xuXG5cdC8vIGdyb3VwIGZlYXR1cmVzIGJ5IGNocm9tb3NvbWVcbiAgICAgICAgbGV0IGZpeCA9IGZlYXR1cmVzLnJlZHVjZSgoYSxmKSA9PiB7IFxuXHQgICAgaWYgKCEgYVtmLmNocl0pIGFbZi5jaHJdID0gW107XG5cdCAgICBhW2YuY2hyXS5wdXNoKGYpO1xuXHQgICAgcmV0dXJuIGE7XG5cdH0sIHt9KVxuXHR0R3Jwcy5lYWNoKGZ1bmN0aW9uKGMpIHtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5kYXR1bSggeyBjaHI6IGMsIGZlYXR1cmVzOiBmaXhbYy5uYW1lXSAgfHwgW119ICk7XG5cdH0pO1xuXG5cdC8vIHRoZSB0aWNrIGVsZW1lbnRzXG4gICAgICAgIGxldCBmZWF0cyA9IHRHcnBzLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpXG5cdCAgICAuZGF0YShkID0+IGQuZmVhdHVyZXMsIGQgPT4gZC5tZ3BpZCk7XG5cdC8vXG5cdGxldCB4QWRqID0gZiA9PiAoZi5zdHJhbmQgPT09IFwiK1wiID8gdGhpcy50aWNrTGVuZ3RoIDogLXRoaXMudGlja0xlbmd0aCk7XG5cdC8vXG5cdGxldCBzaGFwZSA9IFwiY2lyY2xlXCI7ICAvLyBcImNpcmNsZVwiIG9yIFwibGluZVwiXG5cdC8vXG5cdGZlYXRzLmVudGVyKClcblx0ICAgIC5hcHBlbmQoc2hhcGUpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJmZWF0dXJlXCIpXG5cdCAgICAuYXBwZW5kKFwidGl0bGVcIilcblx0ICAgIC50ZXh0KGY9PmYuc3ltYm9sIHx8IGYuaWQpO1xuXHRpZiAoc2hhcGUgPT09IFwibGluZVwiKSB7XG5cdCAgICBmZWF0cy5hdHRyKFwieDFcIiwgZiA9PiB4QWRqKGYpICsgNSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ5MVwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ4MlwiLCBmID0+IHhBZGooZikgKyB0aGlzLnRpY2tMZW5ndGggKyA1KVxuXHQgICAgZmVhdHMuYXR0cihcInkyXCIsIGYgPT4gcmcueXNjYWxlKGYuc3RhcnQpKVxuXHR9XG5cdGVsc2Uge1xuXHQgICAgZmVhdHMuYXR0cihcImN4XCIsIGYgPT4geEFkaihmKSlcblx0ICAgIGZlYXRzLmF0dHIoXCJjeVwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0ICAgIGZlYXRzLmF0dHIoXCJyXCIsICB0aGlzLnRpY2tMZW5ndGggLyAyKTtcblx0fVxuXHQvL1xuXHRmZWF0cy5leGl0KCkucmVtb3ZlKClcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBHZW5vbWVWaWV3XG5cbmV4cG9ydCB7IEdlbm9tZVZpZXcgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0dlbm9tZVZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcblxuY2xhc3MgRmVhdHVyZURldGFpbHMgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMuaW5pdERvbSAoKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RG9tICgpIHtcblx0Ly9cblx0dGhpcy5yb290LnNlbGVjdCAoXCIuYnV0dG9uLmNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5leHRyYVwiLCAoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIHVwZGF0ZShmKSB7XG5cdC8vIGlmIGNhbGxlZCB3aXRoIG5vIGFyZ3MsIHVwZGF0ZSB1c2luZyB0aGUgcHJldmlvdXMgZmVhdHVyZVxuXHRmID0gZiB8fCB0aGlzLmxhc3RGZWF0dXJlO1xuXHRpZiAoIWYpIHtcblx0ICAgLy8gRklYTUU6IG1ham9yIHJlYWNob3ZlciBpbiB0aGlzIHNlY3Rpb25cblx0ICAgLy9cblx0ICAgLy8gZmFsbGJhY2suIHRha2UgdGhlIGZpcnN0IGhpZ2hsaWdodGVkLlxuXHQgICBsZXQgciA9IHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwicmVjdC5mZWF0dXJlLmhpZ2hsaWdodFwiKVswXVswXTtcblx0ICAgLy8gZmFsbGJhY2suIHRha2UgdGhlIGZpcnN0IGZlYXR1cmVcblx0ICAgaWYgKCFyKSByID0gdGhpcy5hcHAuem9vbVZpZXcuc3ZnTWFpbi5zZWxlY3QoXCJyZWN0LmZlYXR1cmVcIilbMF1bMF07XG5cdCAgIGlmIChyKSBmID0gci5fX2RhdGFfXztcblx0fVxuXHQvLyByZW1lbWJlclxuICAgICAgICBpZiAoIWYpIHRocm93IFwiQ2Fubm90IHVwZGF0ZSBmZWF0dXJlIGRldGFpbHMuIE5vIGZlYXR1cmUuXCI7XG5cdHRoaXMubGFzdEZlYXR1cmUgPSBmO1xuXG5cdC8vIGxpc3Qgb2YgZmVhdHVyZXMgdG8gc2hvdyBpbiBkZXRhaWxzIGFyZWEuXG5cdC8vIHRoZSBnaXZlbiBmZWF0dXJlIGFuZCBhbGwgZXF1aXZhbGVudHMgaW4gb3RoZXIgZ2Vub21lcy5cblx0bGV0IGZsaXN0ID0gW2ZdO1xuXHRpZiAoZi5tZ2lpZCkge1xuXHQgICAgLy8gRklYTUU6IHJlYWNob3ZlclxuXHQgICAgZmxpc3QgPSB0aGlzLmFwcC5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5TWdpSWQoZi5tZ2lpZCk7XG5cdH1cblx0Ly8gR290IHRoZSBsaXN0LiBOb3cgb3JkZXIgaXQgdGhlIHNhbWUgYXMgdGhlIGRpc3BsYXllZCBnZW5vbWVzXG5cdC8vIGJ1aWxkIGluZGV4IG9mIGdlbm9tZSBuYW1lIC0+IGZlYXR1cmUgaW4gZmxpc3Rcblx0bGV0IGl4ID0gZmxpc3QucmVkdWNlKChhY2MsZikgPT4geyBhY2NbZi5nZW5vbWUubmFtZV0gPSBmOyByZXR1cm4gYWNjOyB9LCB7fSlcblx0bGV0IGdlbm9tZU9yZGVyID0gKFt0aGlzLmFwcC5yR2Vub21lXS5jb25jYXQodGhpcy5hcHAuY0dlbm9tZXMpKTtcblx0Zmxpc3QgPSBnZW5vbWVPcmRlci5tYXAoZyA9PiBpeFtnLm5hbWVdIHx8IG51bGwpO1xuXHQvL1xuXHRsZXQgY29sSGVhZGVycyA9IFtcblx0ICAgIC8vIGNvbHVtbnMgaGVhZGVycyBhbmQgdGhlaXIgJSB3aWR0aHNcblx0ICAgIFtcIkdlbm9tZVwiICAgICAsOV0sXG5cdCAgICBbXCJNR1AgaWRcIiAgICAgLDE3XSxcblx0ICAgIFtcIlR5cGVcIiAgICAgICAsMTAuNV0sXG5cdCAgICBbXCJCaW9UeXBlXCIgICAgLDE4LjVdLFxuXHQgICAgW1wiQ29vcmRzXCIgICAgICwxOF0sXG5cdCAgICBbXCJMZW5ndGhcIiAgICAgLDddLFxuXHQgICAgW1wiTUdJIGlkXCIgICAgICwxMF0sXG5cdCAgICBbXCJNR0kgc3ltYm9sXCIgLDEwXVxuXHRdO1xuXHQvLyBJbiB0aGUgY2xvc2VkIHN0YXRlLCBvbmx5IHNob3cgdGhlIGhlYWRlciBhbmQgdGhlIHJvdyBmb3IgdGhlIHBhc3NlZCBmZWF0dXJlXG5cdGlmICh0aGlzLnJvb3QuY2xhc3NlZCgnY2xvc2VkJykpXG5cdCAgICBmbGlzdCA9IGZsaXN0LmZpbHRlciggKGZmLCBpKSA9PiBmZiA9PT0gZiApO1xuXHQvLyBEcmF3IHRoZSB0YWJsZVxuXHRsZXQgdCA9IHRoaXMucm9vdC5zZWxlY3QoJ3RhYmxlJyk7XG5cdGxldCByb3dzID0gdC5zZWxlY3RBbGwoJ3RyJykuZGF0YSggW2NvbEhlYWRlcnNdLmNvbmNhdChmbGlzdCkgKTtcblx0cm93cy5lbnRlcigpLmFwcGVuZCgndHInKVxuXHQgIC5vbihcIm1vdXNlZW50ZXJcIiwgKGYsaSkgPT4gaSAhPT0gMCAmJiB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoZiwgdHJ1ZSkpXG5cdCAgLm9uKFwibW91c2VsZWF2ZVwiLCAoZixpKSA9PiBpICE9PSAwICYmIHRoaXMuYXBwLnpvb21WaWV3LmhpZ2hsaWdodCgpKTtcblx0ICAgICAgXG5cdHJvd3MuZXhpdCgpLnJlbW92ZSgpO1xuXHRyb3dzLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgKGZmLCBpKSA9PiAoaSAhPT0gMCAmJiBmZiA9PT0gZikpO1xuXHQvL1xuXHQvLyBHaXZlbiBhIGZlYXR1cmUsIHJldHVybnMgYSBsaXN0IG9mIHN0cmluZ3MgZm9yIHBvcHVsYXRpbmcgYSB0YWJsZSByb3cuXG5cdC8vIElmIGk9PT0wLCB0aGVuIGYgaXMgbm90IGEgZmVhdHVyZSwgYnV0IGEgbGlzdCBjb2x1bW5zIG5hbWVzK3dpZHRocy5cblx0Ly8gXG5cdGxldCBjZWxsRGF0YSA9IGZ1bmN0aW9uIChmLCBpKSB7XG5cdCAgICBpZiAoaSA9PT0gMCkge1xuXHRcdHJldHVybiBmO1xuXHQgICAgfVxuXHQgICAgbGV0IGNlbGxEYXRhID0gWyBnZW5vbWVPcmRlcltpLTFdLmxhYmVsLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiBdO1xuXHQgICAgLy8gZiBpcyBudWxsIGlmIGl0IGRvZXNuJ3QgZXhpc3QgZm9yIGdlbm9tZSBpIFxuXHQgICAgaWYgKGYpIHtcblx0XHRsZXQgbGluayA9IFwiXCI7XG5cdFx0bGV0IG1naWlkID0gZi5tZ2lpZCB8fCBcIlwiO1xuXHRcdGlmIChtZ2lpZCkge1xuXHRcdCAgICBsZXQgdXJsID0gYGh0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9hY2Nlc3Npb24vJHttZ2lpZH1gO1xuXHRcdCAgICBsaW5rID0gYDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIke3VybH1cIj4ke21naWlkfTwvYT5gO1xuXHRcdH1cblx0XHRjZWxsRGF0YSA9IFtcblx0XHQgICAgZi5nZW5vbWUubGFiZWwsXG5cdFx0ICAgIGYubWdwaWQsXG5cdFx0ICAgIGYudHlwZSxcblx0XHQgICAgZi5iaW90eXBlLFxuXHRcdCAgICBgJHtmLmNocn06JHtmLnN0YXJ0fS4uJHtmLmVuZH0gKCR7Zi5zdHJhbmR9KWAsXG5cdFx0ICAgIGAke2YuZW5kIC0gZi5zdGFydCArIDF9IGJwYCxcblx0XHQgICAgbGluayB8fCBtZ2lpZCxcblx0XHQgICAgZi5zeW1ib2xcblx0XHRdO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGNlbGxEYXRhO1xuXHR9O1xuXHRsZXQgY2VsbHMgPSByb3dzLnNlbGVjdEFsbChcInRkXCIpXG5cdCAgICAuZGF0YSgoZixpKSA9PiBjZWxsRGF0YShmLGkpKTtcblx0Y2VsbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZFwiKTtcblx0Y2VsbHMuZXhpdCgpLnJlbW92ZSgpO1xuXHRjZWxscy5odG1sKChkLGksaikgPT4ge1xuXHQgICAgcmV0dXJuIGogPT09IDAgPyBkWzBdIDogZFxuXHR9KVxuXHQuc3R5bGUoXCJ3aWR0aFwiLCAoZCxpLGopID0+IGogPT09IDAgPyBgJHtkWzFdfSVgIDogbnVsbCk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBGZWF0dXJlRGV0YWlscyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmVhdHVyZURldGFpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFNWR1ZpZXcgfSBmcm9tICcuL1NWR1ZpZXcnO1xuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gJy4vRmVhdHVyZSc7XG5pbXBvcnQgeyBwYXJzZUNvb3JkcywgZm9ybWF0Q29vcmRzLCBjb29yZHNBZnRlclRyYW5zZm9ybSwgcmVtb3ZlRHVwcyB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIFpvb21WaWV3IGV4dGVuZHMgU1ZHVmlldyB7XG4gICAgLy9cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQsIGluaXRpYWxDb29yZHMsIGluaXRpYWxIaSkge1xuICAgICAgc3VwZXIoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgLy9cbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIC8vXG4gICAgICB0aGlzLm1pblN2Z0hlaWdodCA9IDI1MDtcbiAgICAgIHRoaXMuYmxvY2tIZWlnaHQgPSA0MDtcbiAgICAgIHRoaXMudG9wT2Zmc2V0ID0gNDU7XG4gICAgICB0aGlzLmZlYXRIZWlnaHQgPSA2O1x0Ly8gaGVpZ2h0IG9mIGEgcmVjdGFuZ2xlIHJlcHJlc2VudGluZyBhIGZlYXR1cmVcbiAgICAgIHRoaXMubGFuZUdhcCA9IDI7XHQgICAgICAgIC8vIHNwYWNlIGJldHdlZW4gc3dpbSBsYW5lc1xuICAgICAgdGhpcy5sYW5lSGVpZ2h0ID0gdGhpcy5mZWF0SGVpZ2h0ICsgdGhpcy5sYW5lR2FwO1xuICAgICAgdGhpcy5zdHJpcEhlaWdodCA9IDcwOyAgICAvLyBoZWlnaHQgcGVyIGdlbm9tZSBpbiB0aGUgem9vbSB2aWV3XG4gICAgICB0aGlzLnN0cmlwR2FwID0gMjA7XHQvLyBzcGFjZSBiZXR3ZWVuIHN0cmlwc1xuICAgICAgdGhpcy5kbW9kZSA9ICdjb21wYXJpc29uJzsvLyBkcmF3aW5nIG1vZGUuICdjb21wYXJpc29uJyBvciAncmVmZXJlbmNlJ1xuXG4gICAgICAvL1xuICAgICAgdGhpcy5jb29yZHMgPSBpbml0aWFsQ29vcmRzOy8vIGN1cnIgem9vbSB2aWV3IGNvb3JkcyB7IGNociwgc3RhcnQsIGVuZCB9XG4gICAgICAvLyBJRHMgb2YgRmVhdHVyZXMgd2UncmUgaGlnaGxpZ2h0aW5nLiBNYXkgYmUgbWdwaWQgIG9yIG1naUlkXG4gICAgICAvLyBoaUZlYXRzIGlzIGFuIG9iaiB3aG9zZSBrZXlzIGFyZSB0aGUgSURzXG4gICAgICB0aGlzLmhpRmVhdHMgPSAoaW5pdGlhbEhpIHx8IFtdKS5yZWR1Y2UoIChhLHYpID0+IHsgYVt2XT12OyByZXR1cm4gYTsgfSwge30gKTtcbiAgICAgIC8vXG4gICAgICB0aGlzLmZpZHVjaWFscyA9IHRoaXMuc3ZnLmluc2VydChcImdcIixcIjpmaXJzdC1jaGlsZFwiKSAvLyBcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLFwiZmlkdWNpYWxzXCIpO1xuICAgICAgdGhpcy5zdHJpcHNHcnAgPSB0aGlzLnN2Z01haW4uYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJzdHJpcHNcIik7XG4gICAgICB0aGlzLmF4aXMgPSB0aGlzLnN2Z01haW4uYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJheGlzXCIpO1xuICAgICAgdGhpcy5jeHRNZW51ID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJjeHRNZW51XCJdJyk7XG4gICAgICAvL1xuICAgICAgdGhpcy5kcmFnZ2luZyA9IG51bGw7XG4gICAgICB0aGlzLmRyYWdnZXIgPSB0aGlzLmdldERyYWdnZXIoKTtcbiAgICAgIC8vXG4gICAgICB0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgLy9cbiAgICBpbml0RG9tICgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgciA9IHRoaXMucm9vdDtcblx0bGV0IGEgPSB0aGlzLmFwcDtcblx0Ly9cblx0ci5zZWxlY3QoJy5idXR0b24uY2xvc2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHRoaXMudXBkYXRlKCkpO1xuXG5cdC8vIHpvb20gY29udHJvbHNcblx0ci5zZWxlY3QoXCIjem9vbU91dFwiKS5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEuem9vbShhLmRlZmF1bHRab29tKSB9KTtcblx0ci5zZWxlY3QoXCIjem9vbUluXCIpIC5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgxL2EuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdChcIiN6b29tT3V0TW9yZVwiKS5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgyKmEuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdChcIiN6b29tSW5Nb3JlXCIpIC5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgxLygyKmEuZGVmYXVsdFpvb20pKSB9KTtcblxuXHQvLyBwYW4gY29udHJvbHNcblx0ci5zZWxlY3QoXCIjcGFuTGVmdFwiKSAub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigtYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoXCIjcGFuUmlnaHRcIikub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigrYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoXCIjcGFuTGVmdE1vcmVcIikgLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS5wYW4oLTUqYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoXCIjcGFuUmlnaHRNb3JlXCIpLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS5wYW4oKzUqYS5kZWZhdWx0UGFuKSB9KTtcblxuXHQvLyBDcmVhdGUgY29udGV4dCBtZW51LiBcblx0dGhpcy5pbml0Q29udGV4dE1lbnUoW3tcbiAgICAgICAgICAgIGxhYmVsOiBcIk1HSSBTTlBzXCIsIFxuXHQgICAgaWNvbjogXCJvcGVuX2luX25ld1wiLFxuXHQgICAgdG9vbHRpcDogXCJWaWV3IFNOUHMgYXQgTUdJIGZvciB0aGUgY3VycmVudCBzdHJhaW5zIGluIHRoZSBjdXJyZW50IHJlZ2lvbi4gKFNvbWUgc3RyYWlucyBub3QgYXZhaWxhYmxlLilcIixcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpU25wUmVwb3J0KClcblx0fSx7XG4gICAgICAgICAgICBsYWJlbDogXCJNR0kgUVRMc1wiLCBcblx0ICAgIGljb246ICBcIm9wZW5faW5fbmV3XCIsXG5cdCAgICB0b29sdGlwOiBcIlZpZXcgUVRMIGF0IE1HSSB0aGF0IG92ZXJsYXAgdGhlIGN1cnJlbnQgcmVnaW9uLlwiLFxuXHQgICAgaGFuZGxlcjogKCk9PiB0aGlzLmFwcC5saW5rVG9NZ2lRVExzKClcblx0fSx7XG4gICAgICAgICAgICBsYWJlbDogXCJNR0kgSkJyb3dzZVwiLCBcblx0ICAgIGljb246IFwib3Blbl9pbl9uZXdcIixcblx0ICAgIHRvb2x0aXA6IFwiT3BlbiBNR0kgSkJyb3dzZSAoQzU3QkwvNkogR1JDbTM4KSB3aXRoIHRoZSBjdXJyZW50IGNvb3JkaW5hdGUgcmFuZ2UuXCIsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naUpCcm93c2UoKVxuXHR9XSk7XG5cdHRoaXMucm9vdFxuXHQgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgLy8gY2xpY2sgb24gYmFja2dyb3VuZCA9PiBoaWRlIGNvbnRleHQgbWVudVxuXHQgICAgICBsZXQgdGd0ID0gZDMuZXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAodGd0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpXCIgJiYgdGd0LmlubmVySFRNTCA9PT0gXCJtZW51XCIpXG5cdFx0ICAvLyBleGNlcHRpb246IHRoZSBjb250ZXh0IG1lbnUgYnV0dG9uIGl0c2VsZlxuXHQgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICBlbHNlXG5cdFx0ICB0aGlzLmhpZGVDb250ZXh0TWVudSgpXG5cdCAgICAgIFxuXHQgIH0pXG5cdCAgLm9uKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKCl7XG5cdCAgICAgIC8vIHJpZ2h0LWNsaWNrIG9uIGEgZmVhdHVyZSA9PiBmZWF0dXJlIGNvbnRleHQgbWVudVxuXHQgICAgICBsZXQgdGd0ID0gZDMuZXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAoIXRndC5jbGFzc0xpc3QuY29udGFpbnMoXCJmZWF0dXJlXCIpKSByZXR1cm47XG5cdCAgICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgIH0pO1xuXG5cdC8vXG5cdC8vXG5cdGxldCBmU2VsZWN0ID0gZnVuY3Rpb24gKGYsIHNoaWZ0LCBwcmVzZXJ2ZSkge1xuXHQgICAgbGV0IGlkID0gZi5tZ2lpZCB8fCBmLm1ncGlkO1xuXHQgICAgaWYgKHNoaWZ0KSB7XG5cdFx0aWYgKHRoaXMuaGlGZWF0c1tpZF0pXG5cdFx0ICAgIGRlbGV0ZSB0aGlzLmhpRmVhdHNbaWRdXG5cdFx0ZWxzZVxuXHRcdCAgICB0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRpZiAoIXByZXNlcnZlKSB0aGlzLmhpRmVhdHMgPSB7fTtcblx0XHR0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdH0uYmluZCh0aGlzKTtcblx0Ly9cblx0bGV0IGZNb3VzZU92ZXJIYW5kbGVyID0gZnVuY3Rpb24oZikge1xuXHRcdGlmIChkMy5ldmVudC5hbHRLZXkpIHtcblx0XHQgICAgLy8gSWYgdXNlciBpcyBob2xkaW5nIHRoZSBhbHQga2V5LCBzZWxlY3QgZXZlcnl0aGluZyB0b3VjaGVkLlxuXHRcdCAgICBmU2VsZWN0KGYsIGQzLmV2ZW50LnNoaWZ0S2V5LCB0cnVlKTtcblx0XHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0XHQgICAgLy8gRG9uJ3QgcmVnaXN0ZXIgY29udGV4dCBjaGFuZ2VzIHVudGlsIHVzZXIgaGFzIHBhdXNlZCBmb3IgYXQgbGVhc3QgMXMuXG5cdFx0ICAgIGlmICh0aGlzLnRpbWVvdXQpIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcblx0XHQgICAgdGhpcy50aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXsgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTsgfS5iaW5kKHRoaXMpLCAxMDAwKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoIWQzLmV2ZW50LmN0cmxLZXkpIFxuXHRcdCAgICB0aGlzLmhpZ2hsaWdodChmKTtcblx0fS5iaW5kKHRoaXMpO1xuXHQvL1xuXHRsZXQgZk1vdXNlT3V0SGFuZGxlciA9IGZ1bmN0aW9uKGYpIHtcblx0ICAgIGlmICghZDMuZXZlbnQuY3RybEtleSlcblx0XHR0aGlzLmhpZ2hsaWdodCgpOyBcblx0fS5iaW5kKHRoaXMpO1xuXG5cdC8vIFxuICAgICAgICB0aGlzLnN2Z1xuXHQgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgbGV0IHRndCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpO1xuXHQgICAgICBsZXQgdCA9IHRndFswXVswXTtcblx0ICAgICAgaWYgKHQudGFnTmFtZSA9PSBcInJlY3RcIiAmJiB0LmNsYXNzTGlzdC5jb250YWlucyhcImZlYXR1cmVcIikpIHtcblx0XHQgIC8vIHVzZXIgY2xpY2tlZCBvbiBhIGZlYXR1cmVcblx0XHQgIGZTZWxlY3QodC5fX2RhdGFfXywgZDMuZXZlbnQuc2hpZnRLZXkpO1xuXHRcdCAgdGhpcy5oaWdobGlnaHQoKTtcblx0ICAgICAgICAgIHRoaXMuYXBwLmNvbnRleHRDaGFuZ2VkKCk7XG5cdCAgICAgIH1cblx0ICAgICAgZWxzZSBpZiAodC50YWdOYW1lID09IFwicmVjdFwiICYmIHQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYmxvY2tcIikgJiYgIWQzLmV2ZW50LnNoaWZ0S2V5KSB7XG5cdFx0ICAvLyB1c2VyIGNsaWNrZWQgb24gYSBzeW50ZW55IGJsb2NrIGJhY2tncm91bmRcblx0XHQgIHRoaXMuaGlGZWF0cyA9IHt9O1xuXHRcdCAgdGhpcy5oaWdobGlnaHQoKTtcblx0XHQgIHRoaXMuYXBwLmNvbnRleHRDaGFuZ2VkKCk7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbihcIm1vdXNlb3ZlclwiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU92ZXJIYW5kbGVyKGYpO1xuXHQgICAgICB9XG5cdCAgfSlcblx0ICAub24oXCJtb3VzZW91dFwiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU91dEhhbmRsZXIoZik7XG5cdCAgICAgIH1cblx0ICB9KTtcblxuXHQvLyBCdXR0b246IERyb3AgZG93biBtZW51IGluIHpvb20gdmlld1xuXHR0aGlzLnJvb3Quc2VsZWN0KFwiLm1lbnUgPiAuYnV0dG9uXCIpXG5cdCAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICAvLyBzaG93IGNvbnRleHQgbWVudSBhdCBtb3VzZSBldmVudCBjb29yZGluYXRlc1xuXHQgICAgICBsZXQgY3ggPSBkMy5ldmVudC5jbGllbnRYO1xuXHQgICAgICBsZXQgY3kgPSBkMy5ldmVudC5jbGllbnRZO1xuXHQgICAgICBsZXQgYmIgPSBkMy5zZWxlY3QodGhpcylbMF1bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICBzZWxmLnNob3dDb250ZXh0TWVudShjeC1iYi5sZWZ0LGN5LWJiLnRvcCk7XG5cdCAgfSk7XG5cdC8vIHpvb20gY29vcmRpbmF0ZXMgYm94XG5cdHRoaXMucm9vdC5zZWxlY3QoXCIjem9vbUNvb3Jkc1wiKVxuXHQgICAgLmNhbGwoemNzID0+IHpjc1swXVswXS52YWx1ZSA9IGZvcm1hdENvb3Jkcyh0aGlzLmNvb3JkcykpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7IHRoaXMuc2VsZWN0KCk7IH0pXG5cdCAgICAub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuXHRcdGxldCBjb29yZHMgPSBwYXJzZUNvb3Jkcyh0aGlzLnZhbHVlKTtcblx0XHRpZiAoISBjb29yZHMpIHtcblx0XHQgICAgbGV0IGZlYXRzID0gc2VsZi5hcHAuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsKHRoaXMudmFsdWUpO1xuXHRcdCAgICBsZXQgZmVhdHMyID0gZmVhdHMuZmlsdGVyKGY9PmYuZ2Vub21lID09IHNlbGYuYXBwLnJHZW5vbWUpO1xuXHRcdCAgICBsZXQgZiA9IGZlYXRzMlswXSB8fCBmZWF0c1swXTtcblx0XHQgICAgaWYgKGYpIHtcblx0XHQgICAgICAgIGNvb3JkcyA9IHtcblx0XHRcdCAgICByZWY6IGYuZ2Vub21lLm5hbWUsXG5cdFx0XHQgICAgY2hyOiBmLmNocixcblx0XHRcdCAgICBzdGFydDogZi5zdGFydCAtIDUqZi5sZW5ndGgsXG5cdFx0XHQgICAgZW5kOiBmLmVuZCArIDUqZi5sZW5ndGgsXG5cdFx0XHQgICAgaGlnaGxpZ2h0OiBmLmlkXG5cdFx0XHR9XG5cdFx0ICAgIH1cblx0XHQgICAgZWxzZSB7XG5cdFx0XHRhbGVydChcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGlkZW50aWZpZXIgb3IgYSBjb29yZGluYXRlIHJhbmdlIGZvcm1hdHRlZCBhcyAnY2hyOnN0YXJ0Li5lbmQnLiBcIiArXG5cdFx0XHQgICAgICBcIkZvciBleGFtcGxlLCAnNToxMDAwMDAwMC4uNTAwMDAwMDAnLlwiKTtcblx0XHRcdHRoaXMudmFsdWUgPSBmb3JtYXRDb29yZHMoc2VsZi5jb29yZHMuY2hyLCBzZWxmLmNvb3Jkcy5zdGFydCwgc2VsZi5jb29yZHMuZW5kKTtcblx0XHRcdHJldHVybjtcblx0XHQgICAgfVxuXG5cblx0XHR9XG5cdFx0c2VsZi5hcHAuc2V0Q29udGV4dChjb29yZHMpO1xuXHQgICAgfSk7XG5cdC8vIHpvb20gd2luZG93IHNpemUgYm94XG5cdHRoaXMucm9vdC5zZWxlY3QoXCIjem9vbVdTaXplXCIpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7IHRoaXMuc2VsZWN0KCk7IH0pXG5cdCAgICAub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgbGV0IHdzID0gcGFyc2VJbnQodGhpcy52YWx1ZSk7XG5cdFx0bGV0IGMgPSBzZWxmLmNvb3Jkcztcblx0XHRpZiAoaXNOYU4od3MpIHx8IHdzIDwgMTAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiSW52YWxpZCB3aW5kb3cgc2l6ZS4gUGxlYXNlIGVudGVyIGFuIGludGVnZXIgPj0gMTAwLlwiKTtcblx0XHQgICAgdGhpcy52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICBsZXQgbWlkID0gKGMuc3RhcnQgKyBjLmVuZCkgLyAyO1xuXHRcdCAgICBsZXQgbmV3cyA9IE1hdGgucm91bmQobWlkIC0gd3MvMik7XG5cdFx0ICAgIGxldCBuZXdlID0gbmV3cyArIHdzIC0gMTtcblx0XHQgICAgc2VsZi5hcHAuc2V0Q29udGV4dCh7XG5cdFx0ICAgICAgICBjaHI6IGMuY2hyLFxuXHRcdFx0c3RhcnQ6IG5ld3MsXG5cdFx0XHRlbmQ6IG5ld2VcblxuXHRcdCAgICB9KTtcblx0XHR9XG5cdCAgICB9KTtcblx0Ly8gem9vbSBkcmF3aW5nIG1vZGUgXG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ2RpdltuYW1lPVwiem9vbURtb2RlXCJdIC5idXR0b24nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0bGV0IHIgPSBzZWxmLnJvb3Q7XG5cdFx0bGV0IGlzQyA9IHIuY2xhc3NlZCgnY29tcGFyaXNvbicpO1xuXHRcdHIuY2xhc3NlZCgnY29tcGFyaXNvbicsICFpc0MpO1xuXHRcdHIuY2xhc3NlZCgncmVmZXJlbmNlJywgaXNDKTtcblx0XHRzZWxmLmFwcC5zZXRDb250ZXh0KHtkbW9kZTogci5jbGFzc2VkKCdjb21wYXJpc29uJykgPyAnY29tcGFyaXNvbicgOiAncmVmZXJlbmNlJ30pO1xuXHQgICAgfSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIGRhdGEgKGxpc3Qgb2YgbWVudUl0ZW0gY29uZmlncykgRWFjaCBjb25maWcgbG9va3MgbGlrZSB7bGFiZWw6c3RyaW5nLCBoYW5kbGVyOiBmdW5jdGlvbn1cbiAgICBpbml0Q29udGV4dE1lbnUgKGRhdGEpIHtcblx0dGhpcy5jeHRNZW51LnNlbGVjdEFsbChcIi5tZW51SXRlbVwiKS5yZW1vdmUoKTsgLy8gaW4gY2FzZSBvZiByZS1pbml0XG4gICAgICAgIGxldCBtaXRlbXMgPSB0aGlzLmN4dE1lbnVcblx0ICAuc2VsZWN0QWxsKFwiLm1lbnVJdGVtXCIpXG5cdCAgLmRhdGEoZGF0YSk7XG5cdGxldCBuZXdzID0gbWl0ZW1zLmVudGVyKClcblx0ICAuYXBwZW5kKFwiZGl2XCIpXG5cdCAgLmF0dHIoXCJjbGFzc1wiLCBcIm1lbnVJdGVtIGZsZXhyb3dcIilcblx0ICAuYXR0cihcInRpdGxlXCIsIGQgPT4gZC50b29sdGlwIHx8IG51bGwgKTtcblx0bmV3cy5hcHBlbmQoXCJsYWJlbFwiKVxuXHQgIC50ZXh0KGQgPT4gZC5sYWJlbClcblx0ICAub24oXCJjbGlja1wiLCBkID0+IHtcblx0ICAgICAgZC5oYW5kbGVyKCk7XG5cdCAgICAgIHRoaXMuaGlkZUNvbnRleHRNZW51KCk7XG5cdCAgfSk7XG5cdG5ld3MuYXBwZW5kKFwiaVwiKVxuXHQgIC5hdHRyKFwiY2xhc3NcIiwgXCJtYXRlcmlhbC1pY29uc1wiKVxuXHQgIC50ZXh0KCBkPT5kLmljb24gKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0IGhpZ2hsaWdodGVkIChobHMpIHtcblx0aWYgKHR5cGVvZihobHMpID09PSBcInN0cmluZ1wiKVxuXHQgICAgaGxzID0gW2hsc107XG5cdC8vXG5cdHRoaXMuaGlGZWF0cyA9IHt9O1xuICAgICAgICBmb3IobGV0IGggb2YgaGxzKXtcblx0ICAgIHRoaXMuaGlGZWF0c1toXSA9IGg7XG5cdH1cbiAgICB9XG4gICAgZ2V0IGhpZ2hsaWdodGVkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlGZWF0cyA/IE9iamVjdC5rZXlzKHRoaXMuaGlGZWF0cykgOiBbXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93Q29udGV4dE1lbnUgKHgseSkge1xuICAgICAgICB0aGlzLmN4dE1lbnVcblx0ICAgIC5jbGFzc2VkKFwic2hvd2luZ1wiLCB0cnVlKVxuXHQgICAgLnN0eWxlKFwibGVmdFwiLCBgJHt4fXB4YClcblx0ICAgIC5zdHlsZShcInRvcFwiLCBgJHt5fXB4YClcblx0ICAgIDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaGlkZUNvbnRleHRNZW51ICgpIHtcbiAgICAgICAgdGhpcy5jeHRNZW51LmNsYXNzZWQoXCJzaG93aW5nXCIsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBncyAobGlzdCBvZiBHZW5vbWVzKVxuICAgIC8vIFNpZGUgZWZmZWN0czpcbiAgICAvLyAgICAgRm9yIGVhY2ggR2Vub21lLCBzZXRzIGcuem9vbVkgXG4gICAgc2V0IGdlbm9tZXMgKGdzKSB7XG4gICAgICAgZ3MuZm9yRWFjaCggKGcsaSkgPT4ge2cuem9vbVkgPSB0aGlzLnRvcE9mZnNldCArIGkgKiAodGhpcy5zdHJpcEhlaWdodCArIHRoaXMuc3RyaXBHYXApfSApO1xuICAgICAgIHRoaXMuX2dlbm9tZXMgPSBncztcbiAgICB9XG4gICAgZ2V0IGdlbm9tZXMgKCkge1xuICAgICAgIHJldHVybiB0aGlzLl9nZW5vbWVzO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzIChzdHJpcGVzKSBpbiB0b3AtdG8tYm90dG9tIG9yZGVyLlxuICAgIC8vXG4gICAgZ2V0R2Vub21lWU9yZGVyICgpIHtcbiAgICAgICAgbGV0IHN0cmlwcyA9IHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoXCIuem9vbVN0cmlwXCIpO1xuICAgICAgICBsZXQgc3MgPSBzdHJpcHNbMF0ubWFwKGc9PiB7XG5cdCAgICBsZXQgYmIgPSBnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgcmV0dXJuIFtiYi55LCBnLl9fZGF0YV9fLmdlbm9tZS5uYW1lXTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBucyA9IHNzLnNvcnQoIChhLGIpID0+IGFbMF0gLSBiWzBdICkubWFwKCB4ID0+IHhbMV0gKVxuXHRyZXR1cm4gbnM7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNldHMgdGhlIHRvcC10by1ib3R0b20gb3JkZXIgb2YgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcyBhY2NvcmRpbmcgdG8gXG4gICAgLy8gdGhlIGdpdmVuIG5hbWUgbGlzdCBvZiBuYW1lcy4gQmVjYXVzZSB3ZSBjYW4ndCBndWFyYW50ZWUgdGhlIGdpdmVuIG5hbWVzIGNvcnJlc3BvbmRcbiAgICAvLyB0byBhY3R1YWwgem9vbSBzdHJpcHMsIG9yIHRoYXQgYWxsIHN0cmlwcyBhcmUgcmVwcmVzZW50ZWQsIGV0Yy5cbiAgICAvLyBUaGVyZWZvcmUsIHRoZSBsaXN0IGlzIHByZXByZWNlc3NlZCBhcyBmb2xsb3dzOlxuICAgIC8vICAgICAqIGR1cGxpY2F0ZSBuYW1lcywgaWYgdGhleSBleGlzdCwgYXJlIHJlbW92ZWRcbiAgICAvLyAgICAgKiBuYW1lcyB0aGF0IGRvIG5vdCBjb3JyZXNwb25kIHRvIGV4aXN0aW5nIHpvb21TdHJpcHMgYXJlIHJlbW92ZWRcbiAgICAvLyAgICAgKiBuYW1lcyBvZiBleGlzdGluZyB6b29tIHN0cmlwcyB0aGF0IGRvbid0IGFwcGVhciBpbiB0aGUgbGlzdCBhcmUgYWRkZWQgdG8gdGhlIGVuZFxuICAgIC8vIFRoZSByZXN1bHQgaXMgYSBsaXN0IG9mIG5hbWVzIHdpdGggdGhlc2UgcHJvcGVydGllczpcbiAgICAvLyAgICAgKiB0aGVyZSBpcyBhIDE6MSBjb3JyZXNwb25kZW5jZSBiZXR3ZWVuIG5hbWVzIGFuZCBhY3R1YWwgem9vbSBzdHJpcHNcbiAgICAvLyAgICAgKiB0aGUgbmFtZSBvcmRlciBpcyBjb25zaXN0ZW50IHdpdGggdGhlIGlucHV0IGxpc3RcbiAgICAvLyBUaGlzIGlzIHRoZSBsaXN0IHVzZWQgdG8gKHJlKW9yZGVyIHRoZSB6b29tIHN0cmlwcy5cbiAgICAvL1xuICAgIC8vIEdpdmVuIHRoZSBsaXN0IG9yZGVyOiBcbiAgICAvLyAgICAgKiBhIFktcG9zaXRpb24gaXMgYXNzaWduZWQgdG8gZWFjaCBnZW5vbWVcbiAgICAvLyAgICAgKiB6b29tIHN0cmlwcyB0aGF0IGFyZSBOT1QgQ1VSUkVOVExZIEJFSU5HIERSQUdHRUQgYXJlIHRyYW5zbGF0ZWQgdG8gdGhlaXIgbmV3IGxvY2F0aW9uc1xuICAgIC8vXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgbnMgKGxpc3Qgb2Ygc3RyaW5ncykgTmFtZXMgb2YgdGhlIGdlbm9tZXMuXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgICAgbm90aGluZ1xuICAgIC8vIFNpZGUgZWZmZWN0czpcbiAgICAvLyAgICAgUmVjYWxjdWxhdGVzIHRoZSBZLWNvb3JkaW5hdGVzIGZvciBlYWNoIHN0cmlwZSBiYXNlZCBvbiB0aGUgZ2l2ZW4gb3JkZXIsIHRoZW4gdHJhbnNsYXRlc1xuICAgIC8vICAgICBlYWNoIHN0cmlwIHRvIGl0cyBuZXcgcG9zaXRpb24uXG4gICAgLy9cbiAgICBzZXRHZW5vbWVZT3JkZXIgKG5zKSB7XG5cdHRoaXMuZ2Vub21lcyA9IHJlbW92ZUR1cHMobnMpLm1hcChuPT4gdGhpcy5hcHAubmFtZTJnZW5vbWVbbl0gKS5maWx0ZXIoeD0+eCk7XG4gICAgICAgIHRoaXMuZ2Vub21lcy5mb3JFYWNoKCAoZyxpKSA9PiB7XG5cdCAgICBsZXQgc3RyaXAgPSBkMy5zZWxlY3QoYCN6b29tVmlldyAuem9vbVN0cmlwW25hbWU9XCIke2cubmFtZX1cIl1gKTtcblx0ICAgIGlmICghc3RyaXAuY2xhc3NlZChcImRyYWdnaW5nXCIpKVxuXHQgICAgICAgIHN0cmlwLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwLCR7Zy56b29tWX0pYCk7XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBkcmFnZ2VyIChkMy5iZWhhdmlvci5kcmFnKSB0byBiZSBhdHRhY2hlZCB0byBlYWNoIHpvb20gc3RyaXAuXG4gICAgLy8gQWxsb3dzIHN0cmlwcyB0byBiZSByZW9yZGVyZWQgYnkgZHJhZ2dpbmcuXG4gICAgZ2V0RHJhZ2dlciAoKSB7ICBcbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBkMy5iZWhhdmlvci5kcmFnKClcblx0ICAub3JpZ2luKGZ1bmN0aW9uKGQsaSl7XG5cdCAgICAgIHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIH0pXG4gICAgICAgICAgLm9uKFwiZHJhZ3N0YXJ0LnpcIiwgZnVuY3Rpb24oZykge1xuXHQgICAgICBsZXQgdCA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50LnRhcmdldDtcblx0ICAgICAgaWYgKGQzLnNlbGVjdCh0KS5hdHRyKFwibmFtZVwiKSAhPT0gJ3pvb21TdHJpcEhhbmRsZScpe1xuXHQgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICB9XG5cdCAgICAgIGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICBsZXQgc3RyaXAgPSB0aGlzLmNsb3Nlc3QoXCIuem9vbVN0cmlwXCIpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nID0gZDMuc2VsZWN0KHN0cmlwKS5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgdHJ1ZSk7XG5cdCAgfSlcblx0ICAub24oXCJkcmFnLnpcIiwgZnVuY3Rpb24gKGcpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIGxldCBteSA9IGQzLm1vdXNlKHNlbGYuc3ZnTWFpblswXVswXSlbMV07XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKDAsICR7bXl9KWApO1xuXHQgICAgICBzZWxmLnNldEdlbm9tZVlPcmRlcihzZWxmLmdldEdlbm9tZVlPcmRlcigpKTtcblx0ICAgICAgc2VsZi5oaWdobGlnaHQoKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWdlbmQuelwiLCBmdW5jdGlvbiAoZykge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgLy9cblx0ICAgICAgc2VsZi5kcmFnZ2luZy5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgZmFsc2UpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nID0gbnVsbDtcblx0ICAgICAgc2VsZi5zZXRHZW5vbWVZT3JkZXIoc2VsZi5nZXRHZW5vbWVZT3JkZXIoKSk7XG5cdCAgICAgIHNlbGYuYXBwLnNldENvbnRleHQoeyBnZW5vbWVzOiBzZWxmLmdldEdlbm9tZVlPcmRlcigpIH0pO1xuXHQgICAgICB3aW5kb3cuc2V0VGltZW91dCggc2VsZi5oaWdobGlnaHQuYmluZChzZWxmKSwgMjUwICk7XG5cdCAgfSlcblx0ICA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJCcnVzaGVzICgpIHtcblx0dGhpcy5yb290LnNlbGVjdEFsbChcImcuYnJ1c2hcIilcblx0ICAgIC5lYWNoKCBmdW5jdGlvbiAoYikge1xuXHQgICAgICAgIGIuYnJ1c2guY2xlYXIoKTtcblx0XHRkMy5zZWxlY3QodGhpcykuY2FsbChiLmJydXNoKTtcblx0ICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgdGhlIGN1cnJlbnQgYnJ1c2ggY29vcmRpbmF0ZXMsIHRyYW5zbGF0ZWQgKGlmIG5lZWRlZCkgdG8gcmVmIGdlbm9tZSBjb29yZGluYXRlcy5cbiAgICBiYkdldFJlZkNvb3JkcyAoKSB7XG4gICAgICBsZXQgcmcgPSB0aGlzLmFwcC5yR2Vub21lO1xuICAgICAgbGV0IGJsayA9IHRoaXMuYnJ1c2hpbmc7XG4gICAgICBsZXQgZXh0ID0gYmxrLmJydXNoLmV4dGVudCgpO1xuICAgICAgbGV0IHIgPSB7IGNocjogYmxrLmNociwgc3RhcnQ6IGV4dFswXSwgZW5kOiBleHRbMV0sIGJsb2NrSWQ6YmxrLmJsb2NrSWQgfTtcbiAgICAgIGxldCB0ciA9IHRoaXMuYXBwLnRyYW5zbGF0b3I7XG4gICAgICBpZiggYmxrLmdlbm9tZSAhPT0gcmcgKSB7XG4gICAgICAgICAvLyB1c2VyIGlzIGJydXNoaW5nIGEgY29tcCBnZW5vbWVzIHNvIGZpcnN0IHRyYW5zbGF0ZVxuXHQgLy8gY29vcmRpbmF0ZXMgdG8gcmVmIGdlbm9tZVxuXHQgbGV0IHJzID0gdGhpcy5hcHAudHJhbnNsYXRvci50cmFuc2xhdGUoYmxrLmdlbm9tZSwgci5jaHIsIHIuc3RhcnQsIHIuZW5kLCByZyk7XG5cdCBpZiAocnMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cdCByID0gcnNbMF07XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgICByLmJsb2NrSWQgPSByZy5uYW1lO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHI7XG4gICAgfVxuICAgIC8vIGhhbmRsZXIgZm9yIHRoZSBzdGFydCBvZiBhIGJydXNoIGFjdGlvbiBieSB0aGUgdXNlciBvbiBhIGJsb2NrXG4gICAgYmJTdGFydCAoYmxrLGJFbHQpIHtcbiAgICAgIHRoaXMuYnJ1c2hpbmcgPSBibGs7XG4gICAgfVxuICAgIC8vIGhhbmRsZXIgZm9yIGJydXNoIG1vdGlvbi4gTWFpbiBqb2IgaXMgdG8gcmVmbGVjdCB0aGUgYnJ1c2hcbiAgICAvLyBpbiBwYXJhbGxlbCBhY3Jvc3MgdGhlIGdlbm9tZXMgaW4gdGhlIHZpZXcuIFRoZSBjdXJybnQgYnJ1c2ggZXh0ZW50IFxuICAgIC8vIGlzIHRyYW5zbGF0ZWQgKGlmIG5lY2Vzc2FyeSkgdG8gcmVmIGdlbm9tZSBzcGFjZS4gVGhlbiB0aG9zZVxuICAgIC8vIGNvb3JkaW5hdGVzIGFyZSB0cmFuc2xhdGVkIHRvIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUgc3BhY2UsIGFuZCB0aGUgYXBwcm9wcmlhdGVcbiAgICAvLyBicnVzaChlcykgdXBkYXRlZC5cbiAgICAvL1xuICAgIGJiQnJ1c2ggKCkge1xuICAgICAgbGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTsgLy8gdGhlIHJlZmVyZW5jZSBnZW5vbWVcbiAgICAgIGxldCBncyA9IFtyZ10uY29uY2F0KHRoaXMuYXBwLmNHZW5vbWVzKTsgLy8gYWxsIHRoZSBnZW5vbWVzIGluIHRoZSB2aWV3XG4gICAgICBsZXQgdHIgPSB0aGlzLmFwcC50cmFuc2xhdG9yOyAvLyBmb3IgdHJhbnNsYXRpbmcgY29vcmRzIGJldHdlZW4gZ2Vub21lc1xuICAgICAgbGV0IGJsayA9IHRoaXMuYnJ1c2hpbmc7IC8vIHRoZSBibG9jayBjdXJyZW5seSBiZWluZyBicnVzaGVkXG4gICAgICBsZXQgciA9IHRoaXMuYmJHZXRSZWZDb29yZHMoKTsgLy8gY3VycmVudCBicnVzaCBleHRlbnQsIGluIHJlZiBnZW5vbWUgc3BhY2VcbiAgICAgIGdzLmZvckVhY2goIGcgPT4ge1xuXHQgIC8vIGlmIGcgaXMgdGhlIHJlZkdlbm9tZSwgbm8gbmVlZCB0byB0cmFuc2xhdGUuIE90aGVyd2lzZSwgdHJhbnNsYXRlIGZyb20gXG5cdCAgLy8gcmVmIGdlbm9tZSB0byBjb21wYXJpc29uIGdlbm9tZSBnLlxuICAgICAgICAgIGxldCBycztcblx0ICBpZiAoZyA9PT0gcmcpIHtcblx0ICAgICAgci5ibG9ja0lkID0gcmcubmFtZTtcblx0ICAgICAgcnMgPSBbcl07XG5cdCAgfVxuXHQgIGVsc2Uge1xuXHQgICAgICBycyA9IHRyLnRyYW5zbGF0ZShyZywgci5jaHIsIHIuc3RhcnQsIHIuZW5kLCBnKTtcblx0ICB9XG5cdCAgLy8gbm90ZSB0aGF0IHRyYW5zbGF0ZWQgcmVzdWx0cyBpbmNsdWRlIGJsb2NrIGlkZW50aWZpZXJzLCB3aGljaCB0ZWxsXG5cdCAgLy8gdXMgdGhlIGJsb2NrIChhbmQgaGVuY2UsIGJydXNoZXMpIGluIHRoZSBkaXNwbGF5IHRvIHRhcmdldC5cblx0ICBycy5mb3JFYWNoKCByciA9PiB7XG5cdCAgICAgIGxldCBiYiA9IHRoaXMuc3ZnTWFpbi5zZWxlY3QoYC56b29tU3RyaXBbbmFtZT1cIiR7Zy5uYW1lfVwiXSAuc0Jsb2NrW25hbWU9XCIke3JyLmJsb2NrSWR9XCJdIC5icnVzaGApXG5cdCAgICAgIGJiLmVhY2goIGZ1bmN0aW9uKGIpIHtcblx0ICAgICAgICAgIGIuYnJ1c2guZXh0ZW50KFtyci5zdGFydCwgcnIuZW5kXSk7XG5cdFx0ICBkMy5zZWxlY3QodGhpcykuY2FsbChiLmJydXNoKTtcblx0ICAgICAgfSk7XG5cdCAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgYmJFbmQgKCkge1xuICAgICAgbGV0IHh0ID0gdGhpcy5icnVzaGluZy5icnVzaC5leHRlbnQoKTtcbiAgICAgIGxldCByID0gdGhpcy5iYkdldFJlZkNvb3JkcygpO1xuICAgICAgdGhpcy5icnVzaGluZyA9IG51bGw7XG4gICAgICAvL1xuICAgICAgbGV0IHNlID0gZDMuZXZlbnQuc291cmNlRXZlbnQ7XG4gICAgICBpZiAoc2UuY3RybEtleSB8fCBzZS5hbHRLZXkgfHwgc2UubWV0YUtleSkge1xuXHQgIHRoaXMuY2xlYXJCcnVzaGVzKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy9cbiAgICAgIGlmIChNYXRoLmFicyh4dFswXSAtIHh0WzFdKSA8PSAxMCl7XG4gICAgICAgICAgLy8gdXNlciBjbGlja2VkIGluc3RlYWQgb2YgZHJhZ2dlZC4gUmVjZW50ZXIgdGhlIHZpZXcgaW5zdGVhZCBvZiB6b29taW5nLlxuXHQgIGxldCBjeHQgPSB0aGlzLmFwcC5nZXRDb250ZXh0KCk7XG5cdCAgbGV0IHcgPSBjeHQuZW5kIC0gY3h0LnN0YXJ0ICsgMTtcblx0ICByLnN0YXJ0IC09IHcvMjtcblx0ICByLmVuZCArPSB3LzI7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChzZS5zaGlmdEtleSkge1xuICAgICAgICAgIC8vIHpvb20gb3V0XG5cdCAgbGV0IGN1cnJXaWR0aCA9IHRoaXMuY29vcmRzLmVuZCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMTtcblx0ICBsZXQgYnJ1c2hXaWR0aCA9IHIuZW5kIC0gci5zdGFydCArIDE7XG5cdCAgbGV0IGZhY3RvciA9IGN1cnJXaWR0aCAvIGJydXNoV2lkdGg7XG5cdCAgbGV0IG5ld1dpZHRoID0gZmFjdG9yICogY3VycldpZHRoO1xuXHQgIGxldCBkcyA9ICgoci5zdGFydCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMSkvY3VycldpZHRoKSAqIG5ld1dpZHRoO1xuXHQgIHIuc3RhcnQgPSB0aGlzLmNvb3Jkcy5zdGFydCAtIGRzO1xuXHQgIHIuZW5kID0gci5zdGFydCArIG5ld1dpZHRoIC0gMTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYXBwLnNldENvbnRleHQocik7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaGlnaGxpZ2h0U3RyaXAgKGcsIGVsdCkge1xuXHRpZiAoZyA9PT0gdGhpcy5jdXJyZW50SExHKSByZXR1cm47XG5cdHRoaXMuY3VycmVudEhMRyA9IGc7XG5cdC8vXG5cdHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoJy56b29tU3RyaXAnKVxuXHQgICAgLmNsYXNzZWQoXCJoaWdobGlnaHRlZFwiLCBkID0+IGQuZ2Vub21lID09PSBnKTtcblx0dGhpcy5zdmdNYWluLnNlbGVjdEFsbCgnLnpvb21TdHJpcEhhbmRsZScpXG5cdCAgICAuY2xhc3NlZChcImhpZ2hsaWdodGVkXCIsIGQgPT4gZC5nZW5vbWUgPT09IGcpO1xuXHR0aGlzLmFwcC5zaG93QmxvY2tzKGcpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHVwZGF0ZSAoY29vcmRzKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0bGV0IGMgPSB0aGlzLmNvb3JkcyA9IChjb29yZHMgfHwgdGhpcy5jb29yZHMpO1xuXHRkMy5zZWxlY3QoXCIjem9vbUNvb3Jkc1wiKVswXVswXS52YWx1ZSA9IGZvcm1hdENvb3JkcyhjLmNociwgYy5zdGFydCwgYy5lbmQpO1xuXHRkMy5zZWxlY3QoXCIjem9vbVdTaXplXCIpWzBdWzBdLnZhbHVlID0gTWF0aC5yb3VuZChjLmVuZCAtIGMuc3RhcnQgKyAxKVxuXHQvL1xuICAgICAgICBsZXQgbWd2ID0gdGhpcy5hcHA7XG5cdC8vIHdoZW4gdGhlIHRyYW5zbGF0b3IgaXMgcmVhZHksIHdlIGNhbiB0cmFuc2xhdGUgdGhlIHJlZiBjb29yZHMgdG8gZWFjaCBnZW5vbWUgYW5kXG5cdC8vIGlzc3VlIHJlcXVlc3RzIHRvIGxvYWQgdGhlIGZlYXR1cmVzIGluIHRob3NlIHJlZ2lvbnMuXG5cdG1ndi5zaG93QnVzeSh0cnVlKTtcblx0bWd2LnRyYW5zbGF0b3IucmVhZHkoKS50aGVuKGZ1bmN0aW9uKCl7XG5cdCAgICAvLyBOb3cgaXNzdWUgcmVxdWVzdHMgZm9yIGZlYXR1cmVzLiBPbmUgcmVxdWVzdCBwZXIgZ2Vub21lLCBlYWNoIHJlcXVlc3Qgc3BlY2lmaWVzIG9uZSBvciBtb3JlXG5cdCAgICAvLyBjb29yZGluYXRlIHJhbmdlcy5cblx0ICAgIC8vIFdhaXQgZm9yIGFsbCB0aGUgZGF0YSB0byBiZWNvbWUgYXZhaWxhYmxlLCB0aGVuIGRyYXcuXG5cdCAgICAvL1xuXHQgICAgbGV0IHByb21pc2VzID0gW107XG5cblx0ICAgIC8vIEZpcnN0IHJlcXVlc3QgaXMgZm9yIHRoZSB0aGUgcmVmZXJlbmNlIGdlbm9tZS4gR2V0IGFsbCB0aGUgZmVhdHVyZXMgaW4gdGhlIHJhbmdlLlxuXHQgICAgcHJvbWlzZXMucHVzaChtZ3YuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXMobWd2LnJHZW5vbWUsIFt7XG5cdFx0Ly8gTmVlZCB0byBzaW11bGF0ZSB0aGUgcmVzdWx0cyBmcm9tIGNhbGxpbmcgdGhlIHRyYW5zbGF0b3IuIFxuXHRcdC8vIFxuXHRcdGNociAgICA6IGMuY2hyLFxuXHRcdHN0YXJ0ICA6IGMuc3RhcnQsXG5cdFx0ZW5kICAgIDogYy5lbmQsXG5cdFx0aW5kZXggIDogMCxcblx0XHRmQ2hyICAgOiBjLmNocixcblx0XHRmU3RhcnQgOiBjLnN0YXJ0LFxuXHRcdGZFbmQgICA6IGMuZW5kLFxuXHRcdGZJbmRleCAgOiAwLFxuXHRcdG9yaSAgICA6IFwiK1wiLFxuXHRcdGJsb2NrSWQ6IG1ndi5yR2Vub21lLm5hbWVcblx0XHR9XSkpO1xuXHQgICAgaWYgKCEgc2VsZi5yb290LmNsYXNzZWQoXCJjbG9zZWRcIikpIHtcblx0XHQvLyBBZGQgYSByZXF1ZXN0IGZvciBlYWNoIGNvbXBhcmlzb24gZ2Vub21lLCB1c2luZyB0cmFuc2xhdGVkIGNvb3JkaW5hdGVzLiBcblx0XHRtZ3YuY0dlbm9tZXMuZm9yRWFjaChjR2Vub21lID0+IHtcblx0XHQgICAgbGV0IHJhbmdlcyA9IG1ndi50cmFuc2xhdG9yLnRyYW5zbGF0ZSggbWd2LnJHZW5vbWUsIGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCwgY0dlbm9tZSApO1xuXHRcdCAgICBwcm9taXNlcy5wdXNoKG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhjR2Vub21lLCByYW5nZXMpKVxuXHRcdH0pO1xuXHQgICAgfVxuXHQgICAgLy8gd2hlbiBldmVyeXRoaW5nIGlzIHJlYWR5LCBjYWxsIHRoZSBkcmF3IGZ1bmN0aW9uXG5cdCAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbiggZGF0YSA9PiB7XG5cdCAgICAgICAgc2VsZi5kcmF3KGRhdGEpO1xuXHRcdG1ndi5zaG93QnVzeShmYWxzZSk7XG4gICAgICAgICAgICB9KTtcblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgb3JkZXJTQmxvY2tzIChzYmxvY2tzKSB7XG5cdC8vIFNvcnQgdGhlIHNibG9ja3MgaW4gZWFjaCBzdHJpcCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgZHJhd2luZyBtb2RlLlxuXHRsZXQgY21wRmllbGQgPSB0aGlzLmRtb2RlID09PSAnY29tcGFyaXNvbicgPyAnaW5kZXgnIDogJ2ZJbmRleCc7XG5cdGxldCBjbXBGdW5jID0gKGEsYikgPT4gYS5fX2RhdGFfX1tjbXBGaWVsZF0tYi5fX2RhdGFfX1tjbXBGaWVsZF07XG5cdHNibG9ja3MuZm9yRWFjaCggc3RyaXAgPT4gc3RyaXAuc29ydCggY21wRnVuYyApICk7XG5cdC8vIHBpeGVscyBwZXIgYmFzZVxuXHRsZXQgcHBiID0gdGhpcy53aWR0aCAvICh0aGlzLmNvb3Jkcy5lbmQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDEpO1xuXHRsZXQgb2Zmc2V0ID0gW107IC8vIG9mZnNldCBvZiBzdGFydCBwb3NpdGlvbiBvZiBuZXh0IGJsb2NrLCBieSBzdHJpcCBpbmRleCAoMD09PXJlZilcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRzYmxvY2tzLmVhY2goIGZ1bmN0aW9uIChiLGksaikgeyAvLyBiPWJsb2NrLCBpPWluZGV4IHdpdGhpbiBzdHJpcCwgaj1zdHJpcCBpbmRleFxuXHQgICAgbGV0IGJsZW4gPSBwcGIgKiAoYi5lbmQgLSBiLnN0YXJ0ICsgMSk7IC8vIHRvdGFsIHNjcmVlbiB3aWR0aCBvZiB0aGlzIHNibG9ja1xuXHQgICAgYi5mbGlwID0gYi5vcmkgPT09ICctJyAmJiBzZWxmLmRtb2RlID09PSAncmVmZXJlbmNlJztcblx0ICAgIGIueHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFtiLnN0YXJ0LCBiLmVuZF0pLnJhbmdlKCBiLmZsaXAgPyBbYmxlbiwgMF0gOiBbMCwgYmxlbl0gKTtcblx0ICAgIGxldCBkeCA9IGkgPT09IDAgPyAwIDogb2Zmc2V0W2pdO1xuXHQgICAgZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke2R4fSwwKWApO1xuXHQgICAgb2Zmc2V0W2pdID0gZHggKyBibGVuICsgMjtcblx0fSk7XG5cdC8vXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIHpvb20gdmlldyBwYW5lbCB3aXRoIHRoZSBnaXZlbiBkYXRhLlxuICAgIC8vXG4gICAgLy8gRGF0YSBpcyBzdHJ1Y3R1cmVkIGFzIGZvbGxvd3M6XG4gICAgLy8gICAgIGRhdGEgPSBbIHpvb21TdHJpcF9kYXRhIF1cbiAgICAvLyAgICAgem9vbVN0cmlwX2RhdGEgPSB7IGdlbm9tZSBbIHpvb21CbG9ja19kYXRhIF0gfVxuICAgIC8vICAgICB6b29tQmxvY2tfZGF0YSA9IHsgeHNjYWxlLCBjaHIsIHN0YXJ0LCBlbmQsIGZDaHIsIGZTdGFydCwgZkVuZCwgb3JpLCBbIGZlYXR1cmVfZGF0YSBdIH1cbiAgICAvLyAgICAgZmVhdHVyZV9kYXRhID0geyBtZ3BpZCwgbWdpaWQsIHN5bWJvbCwgY2hyLCBzdGFydCwgZW5kLCBzdHJhbmQsIHR5cGUsIGJpb3R5cGUgfVxuICAgIC8vXG4gICAgLy8gQWdhaW4sIGluIEVuZ2xpc2g6XG4gICAgLy8gIC0gZGF0YSBpcyBhIGxpc3Qgb2YgaXRlbXMsIG9uZSBwZXIgc3RyaXAgdG8gYmUgZGlzcGxheWVkLiBJdGVtWzBdIGlzIGRhdGEgZm9yIHRoZSByZWYgZ2Vub21lLlxuICAgIC8vICAgIEl0ZW1zWzErXSBhcmUgZGF0YSBmb3IgdGhlIGNvbXBhcmlzb24gZ2Vub21lLlxuICAgIC8vICAtIGVhY2ggc3RyaXAgaXRlbSBpcyBhbiBvYmplY3QgY29udGFpbmluZyBhIGdlbm9tZSBhbmQgYSBsaXN0IG9mIGJsb2Nrcy4gSXRlbVswXSBhbHdheXMgaGFzIFxuICAgIC8vICAgIGEgc2luZ2xlIGJsb2NrLlxuICAgIC8vICAtIGVhY2ggYmxvY2sgaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBjaHJvbW9zb21lLCBzdGFydCwgZW5kLCBvcmllbnRhdGlvbiwgZXRjLCBhbmQgYSBsaXN0IG9mIGZlYXR1cmVzLlxuICAgIC8vICAtIGVhY2ggZmVhdHVyZSBoYXMgY2hyLHN0YXJ0LGVuZCxzdHJhbmQsdHlwZSxiaW90eXBlLG1ncGlkXG4gICAgLy9cbiAgICBkcmF3IChkYXRhKSB7XG5cdC8vIFxuXHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0bGV0IGNsb3NlZCA9IHRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIpO1xuXG5cdC8vIHJlc2V0IHRoZSBzdmcgc2l6ZSBiYXNlZCBvbiBudW1iZXIgb2Ygc3RyaXBzXG5cdGxldCB0b3RhbEhlaWdodCA9ICh0aGlzLnN0cmlwSGVpZ2h0K3RoaXMuc3RyaXBHYXApICogZGF0YS5sZW5ndGggKyAxMjtcblx0dGhpcy5zdmdcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRvdGFsSGVpZ2h0KTtcblxuXHQvLyBEcmF3IHRoZSB0aXRsZSBvbiB0aGUgem9vbXZpZXcgcG9zaXRpb24gY29udHJvbHNcblx0ZDMuc2VsZWN0KFwiI3pvb21WaWV3IC56b29tQ29vcmRzIGxhYmVsXCIpXG5cdCAgICAudGV4dChkYXRhWzBdLmdlbm9tZS5sYWJlbCArIFwiIGNvb3Jkc1wiKTtcblx0XG5cdC8vIHRoZSByZWZlcmVuY2UgZ2Vub21lIGJsb2NrIChhbHdheXMganVzdCAxIG9mIHRoZXNlKS5cblx0bGV0IHJCbG9jayA9IGRhdGFbMF0uYmxvY2tzWzBdO1xuXG5cdC8vIHgtc2NhbGUgYW5kIHgtYXhpcyBiYXNlZCBvbiB0aGUgcmVmIGdlbm9tZSBkYXRhLlxuXHR0aGlzLnhzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdCAgICAuZG9tYWluKFtyQmxvY2suc3RhcnQsckJsb2NrLmVuZF0pXG5cdCAgICAucmFuZ2UoWzAsdGhpcy53aWR0aF0pO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIGRyYXcgdGhlIGF4aXNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0dGhpcy5heGlzRnVuYyA9IGQzLnN2Zy5heGlzKClcblx0ICAgIC5zY2FsZSh0aGlzLnhzY2FsZSlcblx0ICAgIC5vcmllbnQoXCJ0b3BcIilcblx0ICAgIC5vdXRlclRpY2tTaXplKDApXG5cdCAgICAudGlja3MoNSlcblx0ICAgIDtcblx0dGhpcy5heGlzLmNhbGwodGhpcy5heGlzRnVuYyk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gem9vbSBzdHJpcHMgKG9uZSBwZXIgZ2Vub21lKVxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBsZXQgenN0cmlwcyA9IHRoaXMuc3RyaXBzR3JwXG5cdCAgICAgICAgLnNlbGVjdEFsbChcImcuem9vbVN0cmlwXCIpXG5cdFx0LmRhdGEoZGF0YSwgZCA9PiBkLmdlbm9tZS5uYW1lKTtcblx0bGV0IG5ld3pzID0genN0cmlwcy5lbnRlcigpXG5cdCAgICAgICAgLmFwcGVuZChcImdcIilcblx0XHQuYXR0cihcImNsYXNzXCIsXCJ6b29tU3RyaXBcIilcblx0XHQuYXR0cihcIm5hbWVcIiwgZCA9PiBkLmdlbm9tZS5uYW1lKVxuXHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChnKSB7XG5cdFx0ICAgIHNlbGYuaGlnaGxpZ2h0U3RyaXAoZy5nZW5vbWUsIHRoaXMpO1xuXHRcdH0pXG5cdFx0LmNhbGwodGhpcy5kcmFnZ2VyKVxuXHRcdDtcblx0bmV3enMuYXBwZW5kKFwidGV4dFwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIFwiZ2Vub21lTGFiZWxcIilcblx0ICAgIC50ZXh0KCBkID0+IGQuZ2Vub21lLmxhYmVsKVxuXHQgICAgLmF0dHIoXCJ4XCIsIDApXG5cdCAgICAuYXR0cihcInlcIiwgdGhpcy5ibG9ja0hlaWdodC8yICsgMTApXG5cdCAgICAuYXR0cihcImZvbnQtZmFtaWx5XCIsXCJzYW5zLXNlcmlmXCIpXG5cdCAgICAuYXR0cihcImZvbnQtc2l6ZVwiLCAxMClcblx0ICAgIDtcblx0bmV3enMuYXBwZW5kKFwiZ1wiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIFwic0Jsb2Nrc1wiKTtcblx0bmV3enMuYXBwZW5kKFwicmVjdFwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIFwiem9vbVN0cmlwSGFuZGxlXCIpXG5cdCAgICAuYXR0cihcInhcIiwgLTE1KVxuXHQgICAgLmF0dHIoXCJ5XCIsIC10aGlzLmJsb2NrSGVpZ2h0IC8gMilcblx0ICAgIC5hdHRyKFwid2lkdGhcIiwgMTUpXG5cdCAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLmJsb2NrSGVpZ2h0KVxuXHQgICAgO1xuXG5cdHpzdHJpcHNcblx0ICAgIC5jbGFzc2VkKFwicmVmZXJlbmNlXCIsIGQgPT4gZC5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpXG5cdCAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBnID0+IGB0cmFuc2xhdGUoMCwke2Nsb3NlZCA/IHRoaXMudG9wT2Zmc2V0IDogZy5nZW5vbWUuem9vbVl9KWApXG5cdCAgICA7XG5cbiAgICAgICAgenN0cmlwcy5leGl0KClcblx0ICAgIC5vbihcIi5kcmFnXCIsIG51bGwpXG5cdCAgICAucmVtb3ZlKCk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gc3ludGVueSBibG9ja3MuIEVhY2ggem9vbSBzdHJpcCBoYXMgYSBsaXN0IG9mIDEgb3IgbW9yZSBzYmxvY2tzLlxuXHQvLyBUaGUgcmVmZXJlbmNlIGdlbm9tZSBhbHdheXMgaGFzIGp1c3QgMS4gVGhlIGNvbXAgZ2Vub21lcyBtYW55IGhhdmVcblx0Ly8gMSBvciBtb3JlIChhbmQgaW4gcmFyZSBjYXNlcywgMCkuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGxldCB1bmlxaWZ5ID0gYmxvY2tzID0+IHtcblx0ICAgIC8vIGhlbHBlciBmdW5jdGlvbi4gV2hlbiBzYmxvY2sgcmVsYXRpb25zaGlwIGJldHdlZW4gZ2Vub21lcyBpcyBjb25mdXNlZCwgcmVxdWVzdGluZyBvbmVcblx0ICAgIC8vIHJlZ2lvbiBpbiBnZW5vbWUgQSBjYW4gZW5kIHVwIHJlcXVlc3RpbmcgdGhlIHNhbWUgcmVnaW9uIGluIGdlbm9tZSBCIHR3aWNlLiBUaGlzIGZ1bmN0aW9uXG5cdCAgICAvLyBhdm9pZHMgZHJhd2luZyB0aGUgc2FtZSBzYmxvY2sgdHdpY2UuIChOQjogUmVhbGx5IG5vdCBzdXJlIHdoZXJlIHRoaXMgY2hlY2sgaXMgYmVzdCBkb25lLlxuXHQgICAgLy8gQ291bGQgcHVzaCBpdCBmYXJ0aGVyIHVwc3RyZWFtLilcblx0ICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuXHQgICAgcmV0dXJuIGJsb2Nrcy5maWx0ZXIoIGIgPT4geyBcblx0ICAgICAgICBpZiAoc2Vlbi5oYXMoYi5pbmRleCkpIHJldHVybiBmYWxzZTtcblx0XHRzZWVuLmFkZChiLmluZGV4KTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0ICAgIH0pO1xuXHR9O1xuICAgICAgICBsZXQgc2Jsb2NrcyA9IHpzdHJpcHMuc2VsZWN0KCdbbmFtZT1cInNCbG9ja3NcIl0nKS5zZWxlY3RBbGwoJ2cuc0Jsb2NrJylcblx0ICAgIC5kYXRhKGQgPT4ge1xuXHQgICAgICAgIHJldHVybiB1bmlxaWZ5KGQuYmxvY2tzKTtcblx0ICAgIH0sIGIgPT4gYi5ibG9ja0lkKTtcblx0bGV0IG5ld3NicyA9IHNibG9ja3MuZW50ZXIoKVxuXHQgICAgLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgYiA9PiBcInNCbG9jayBcIiArIChiLm9yaT09PVwiK1wiID8gXCJwbHVzXCIgOiBiLm9yaT09PVwiLVwiID8gXCJtaW51c1wiOiBcImNvbmZ1c2VkXCIpICsgKGIuY2hyICE9PSBiLmZDaHIgPyBcIiB0cmFuc2xvY2F0aW9uXCIgOiBcIlwiKSlcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBiPT5iLmluZGV4KVxuXHQgICAgO1xuXHRsZXQgbDAgPSBuZXdzYnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLCBcImxheWVyMFwiKTtcblx0bGV0IGwxID0gbmV3c2JzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIiwgXCJsYXllcjFcIik7XG5cblx0Ly8gcmVjdGFuZ2xlIGZvciB0aGUgd2hvbGUgYmxvY2tcblx0bDAuYXBwZW5kKFwicmVjdFwiKS5hdHRyKFwiY2xhc3NcIiwgXCJibG9ja1wiKTtcblx0Ly8gdGhlIGF4aXMgbGluZVxuXHRsMC5hcHBlbmQoXCJsaW5lXCIpLmF0dHIoXCJjbGFzc1wiLFwiYXhpc1wiKSA7XG5cdC8vIGxhYmVsXG5cdGwwLmFwcGVuZChcInRleHRcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImJsb2NrTGFiZWxcIikgO1xuXHQvLyBicnVzaFxuXHRsMC5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLFwiYnJ1c2hcIik7XG5cblx0c2Jsb2Nrcy5leGl0KCkucmVtb3ZlKCk7XG5cblx0dGhpcy5vcmRlclNCbG9ja3Moc2Jsb2Nrcyk7XG5cblx0Ly8gc3ludGVueSBibG9jayBsYWJlbHNcblx0c2Jsb2Nrcy5zZWxlY3QoXCJ0ZXh0LmJsb2NrTGFiZWxcIilcblx0ICAgIC50ZXh0KCBiID0+IGIuY2hyIClcblx0ICAgIC5hdHRyKFwieFwiLCBiID0+IChiLnhzY2FsZShiLnN0YXJ0KSArIGIueHNjYWxlKGIuZW5kKSkvMiApXG5cdCAgICAuYXR0cihcInlcIiwgdGhpcy5ibG9ja0hlaWdodCAvIDIgKyAxMClcblx0ICAgIDtcblxuXHQvLyBzeW50ZW55IGJsb2NrIHJlY3RzXG5cdHNibG9ja3Muc2VsZWN0KFwicmVjdC5ibG9ja1wiKVxuXHQgIC5hdHRyKFwieFwiLCAgICAgYiA9PiBiLnhzY2FsZShiLmZsaXAgPyBiLmVuZCA6IGIuc3RhcnQpKVxuXHQgIC5hdHRyKFwieVwiLCAgICAgYiA9PiAtdGhpcy5ibG9ja0hlaWdodCAvIDIpXG5cdCAgLmF0dHIoXCJ3aWR0aFwiLCBiID0+IE1hdGguYWJzKGIueHNjYWxlKGIuZW5kKS1iLnhzY2FsZShiLnN0YXJ0KSkpXG5cdCAgLmF0dHIoXCJoZWlnaHRcIix0aGlzLmJsb2NrSGVpZ2h0KTtcblxuXHQvLyBzeW50ZW55IGJsb2NrIGF4aXMgbGluZXNcblx0c2Jsb2Nrcy5zZWxlY3QoXCJsaW5lLmF4aXNcIilcblx0ICAgIC5hdHRyKFwieDFcIiwgYiA9PiBiLnhzY2FsZS5yYW5nZSgpWzBdKVxuXHQgICAgLmF0dHIoXCJ5MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ4MlwiLCBiID0+IGIueHNjYWxlLnJhbmdlKClbMV0pXG5cdCAgICAuYXR0cihcInkyXCIsIDApXG5cdCAgICA7XG5cblx0Ly8gYnJ1c2hcblx0c2Jsb2Nrcy5zZWxlY3QoXCJnLmJydXNoXCIpXG5cdCAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBiID0+IGB0cmFuc2xhdGUoMCwke3RoaXMuYmxvY2tIZWlnaHQgLyAyfSlgKVxuXHQgICAgLmVhY2goZnVuY3Rpb24oYikge1xuXHRcdGlmICghYi5icnVzaCkge1xuXHRcdCAgICBiLmJydXNoID0gZDMuc3ZnLmJydXNoKClcblx0XHRcdC5vbihcImJydXNoc3RhcnRcIiwgZnVuY3Rpb24oKXsgc2VsZi5iYlN0YXJ0KCBiLCB0aGlzICk7IH0pXG5cdFx0XHQub24oXCJicnVzaFwiLCAgICAgIGZ1bmN0aW9uKCl7IHNlbGYuYmJCcnVzaCggYiwgdGhpcyApOyB9KVxuXHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgICBmdW5jdGlvbigpeyBzZWxmLmJiRW5kKCBiLCB0aGlzICk7IH0pXG5cdFx0fVxuXHRcdGIuYnJ1c2gueChiLnhzY2FsZSkuY2xlYXIoKTtcblx0XHRkMy5zZWxlY3QodGhpcykuY2FsbChiLmJydXNoKTtcblx0ICAgIH0pXG5cdCAgICAuc2VsZWN0QWxsKFwicmVjdFwiKVxuXHRcdC5hdHRyKFwiaGVpZ2h0XCIsIDEwKTtcblxuXHR0aGlzLmRyYXdGZWF0dXJlcyhzYmxvY2tzKTtcblxuXHQvL1xuXHR0aGlzLmFwcC5mYWNldE1hbmFnZXIuYXBwbHlBbGwoKTtcblxuXHQvLyBXZSBuZWVkIHRvIGxldCB0aGUgdmlldyByZW5kZXIgYmVmb3JlIGRvaW5nIHRoZSBoaWdobGlnaHRpbmcsIHNpbmNlIGl0IGRlcGVuZHMgb25cblx0Ly8gdGhlIHBvc2l0aW9ucyBvZiByZWN0YW5nbGVzIGluIHRoZSBzY2VuZS5cblx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuXHQgICAgLy90aGlzLnNldEdlbm9tZVlPcmRlciggdGhpcy5nZW5vbWVzLm1hcChnID0+IGcubmFtZSkgKTtcblx0ICAgIC8vd2luZG93LnNldFRpbWVvdXQoKCkgPT4gdGhpcy5oaWdobGlnaHQoKSwgNTApO1xuXHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0fSwgNTApO1xuICAgIH07XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgZmVhdHVyZXMgKHJlY3RhbmdsZXMpIGZvciB0aGUgc3BlY2lmaWVkIHN5bnRlbnkgYmxvY2tzLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIHNibG9ja3MgKEQzIHNlbGVjdGlvbiBvZiBnLnNibG9jayBub2RlcykgLSBtdWx0aWxldmVsIHNlbGVjdGlvbi5cbiAgICAvLyAgICAgICAgQXJyYXkgKGNvcnJlc3BvbmRpbmcgdG8gc3RyaXBzKSBvZiBhcnJheXMgb2Ygc3ludGVueSBibG9ja3MuXG4gICAgLy9cbiAgICBkcmF3RmVhdHVyZXMgKHNibG9ja3MpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHQvL1xuXHQvLyBuZXZlciBkcmF3IHRoZSBzYW1lIGZlYXR1cmUgdHdpY2Vcblx0bGV0IGRyYXduID0gbmV3IFNldCgpO1x0Ly8gc2V0IG9mIG1ncGlkcyBvZiBkcmF3biBmZWF0dXJlc1xuXHRsZXQgZmlsdGVyRHJhd24gPSBmdW5jdGlvbiAoZikge1xuXHQgICAgLy8gcmV0dXJucyB0cnVlIGlmIHdlJ3ZlIG5vdCBzZWVuIHRoaXMgb25lIGJlZm9yZS5cblx0ICAgIC8vIHJlZ2lzdGVycyB0aGF0IHdlJ3ZlIHNlZW4gaXQuXG5cdCAgICBsZXQgZmlkID0gZi5tZ3BpZDtcblx0ICAgIGxldCB2ID0gISBkcmF3bi5oYXMoZmlkKTtcblx0ICAgIGRyYXduLmFkZChmaWQpO1xuXHQgICAgcmV0dXJuIHY7XG5cdH07XG5cdGxldCBmZWF0cyA9IHNibG9ja3Muc2VsZWN0KCdbbmFtZT1cImxheWVyMVwiXScpLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpXG5cdCAgICAuZGF0YShkPT5kLmZlYXR1cmVzLmZpbHRlcihmaWx0ZXJEcmF3biksIGQ9PmQubWdwaWQpO1xuXHRmZWF0cy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGxldCBuZXdGZWF0cyA9IGZlYXRzLmVudGVyKCkuYXBwZW5kKFwicmVjdFwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBmID0+IFwiZmVhdHVyZVwiICsgKGYuc3RyYW5kPT09XCItXCIgPyBcIiBtaW51c1wiIDogXCIgcGx1c1wiKSlcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBmID0+IGYubWdwaWQpXG5cdCAgICAuc3R5bGUoXCJmaWxsXCIsIGYgPT4gc2VsZi5hcHAuY3NjYWxlKGYuZ2V0TXVuZ2VkVHlwZSgpKSlcblx0ICAgIDtcblxuXHQvLyBkcmF3IHRoZSByZWN0YW5nbGVzXG5cblx0Ly8gcmV0dXJucyB0aGUgc3ludGVueSBibG9jayBjb250YWluaW5nIHRoaXMgZmVhdHVyZVxuXHRsZXQgZkJsb2NrID0gZnVuY3Rpb24gKGZlYXRFbHQpIHtcblx0ICAgIGxldCBibGtFbHQgPSBmZWF0RWx0LnBhcmVudE5vZGU7XG5cdCAgICByZXR1cm4gYmxrRWx0Ll9fZGF0YV9fO1xuXHR9XG5cdGxldCBmeCA9IGZ1bmN0aW9uKGYpIHtcblx0ICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgcmV0dXJuIGIueHNjYWxlKGYuc3RhcnQpXG5cdH07XG5cdGxldCBmdyA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICBsZXQgYiA9IGZCbG9jayh0aGlzKTtcblx0ICAgIHJldHVybiBNYXRoLmFicyhiLnhzY2FsZShmLmVuZCkgLSBiLnhzY2FsZShmLnN0YXJ0KSkgKyAxO1xuXHR9O1xuXHRsZXQgZnkgPSBmdW5jdGlvbiAoZikge1xuXHQgICAgICAgbGV0IGIgPSBmQmxvY2sodGhpcyk7XG5cdCAgICAgICBpZiAoZi5zdHJhbmQgPT0gXCIrXCIpe1xuXHRcdCAgIGlmIChiLmZsaXApIFxuXHRcdCAgICAgICByZXR1cm4gc2VsZi5sYW5lSGVpZ2h0KmYubGFuZSAtIHNlbGYuZmVhdEhlaWdodDsgXG5cdFx0ICAgZWxzZSBcblx0XHQgICAgICAgcmV0dXJuIC1zZWxmLmxhbmVIZWlnaHQqZi5sYW5lO1xuXHQgICAgICAgfVxuXHQgICAgICAgZWxzZSB7XG5cdFx0ICAgLy8gZi5sYW5lIGlzIG5lZ2F0aXZlIGZvciBcIi1cIiBzdHJhbmRcblx0XHQgICBpZiAoYi5mbGlwKSBcblx0XHQgICAgICAgcmV0dXJuIHNlbGYubGFuZUhlaWdodCpmLmxhbmU7XG5cdFx0ICAgZWxzZVxuXHRcdCAgICAgICByZXR1cm4gLXNlbGYubGFuZUhlaWdodCpmLmxhbmUgLSBzZWxmLmZlYXRIZWlnaHQ7IFxuXHQgICAgICAgfVxuXHQgICB9O1xuXG5cdGZlYXRzXG5cdCAgLmF0dHIoXCJ4XCIsIGZ4KVxuXHQgIC5hdHRyKFwid2lkdGhcIiwgZncpXG5cdCAgLmF0dHIoXCJ5XCIsIGZ5KVxuXHQgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMuZmVhdEhlaWdodClcblx0ICA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyBmZWF0dXJlIGhpZ2hsaWdodGluZyBpbiB0aGUgY3VycmVudCB6b29tIHZpZXcuXG4gICAgLy8gRmVhdHVyZXMgdG8gYmUgaGlnaGxpZ2h0ZWQgaW5jbHVkZSB0aG9zZSBpbiB0aGUgaGlGZWF0cyBsaXN0IHBsdXMgdGhlIGZlYXR1cmVcbiAgICAvLyBjb3JyZXNwb25kaW5nIHRvIHRoZSByZWN0YW5nbGUgYXJndW1lbnQsIGlmIGdpdmVuLiAoVGhlIG1vdXNlb3ZlciBmZWF0dXJlLilcbiAgICAvL1xuICAgIC8vIERyYXdzIGZpZHVjaWFscyBmb3IgZmVhdHVyZXMgaW4gdGhpcyBsaXN0IHRoYXQ6XG4gICAgLy8gMS4gb3ZlcmxhcCB0aGUgY3VycmVudCB6b29tVmlldyBjb29yZCByYW5nZVxuICAgIC8vIDIuIGFyZSBub3QgcmVuZGVyZWQgaW52aXNpYmxlIGJ5IGN1cnJlbnQgZmFjZXQgc2V0dGluZ3NcbiAgICAvL1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgY3VycmVudCAocmVjdCBlbGVtZW50KSBPcHRpb25hbC4gQWRkJ2wgcmVjdGFuZ2xlIGVsZW1lbnQsIGUuZy4sIHRoYXQgd2FzIG1vdXNlZC1vdmVyLiBIaWdobGlnaHRpbmdcbiAgICAvLyAgICAgICAgd2lsbCBpbmNsdWRlIHRoZSBmZWF0dXJlIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyByZWN0IGFsb25nIHdpdGggdGhvc2UgaW4gdGhlIGhpZ2hsaWdodCBsaXN0LlxuICAgIC8vICAgIHB1bHNlQ3VycmVudCAoYm9vbGVhbikgSWYgdHJ1ZSBhbmQgY3VycmVudCBpcyBnaXZlbiwgY2F1c2UgaXQgdG8gcHVsc2UgYnJpZWZseS5cbiAgICAvL1xuICAgIGhpZ2hsaWdodCAoY3VycmVudCwgcHVsc2VDdXJyZW50KSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0Ly8gY3VycmVudCdzIGZlYXR1cmVcblx0bGV0IGN1cnJGZWF0ID0gY3VycmVudCA/IChjdXJyZW50IGluc3RhbmNlb2YgRmVhdHVyZSA/IGN1cnJlbnQgOiBjdXJyZW50Ll9fZGF0YV9fKSA6IG51bGw7XG5cdC8vIGNyZWF0ZSBsb2NhbCBjb3B5IG9mIGhpRmVhdHMsIHdpdGggY3VycmVudCBmZWF0dXJlIGFkZGVkXG5cdGxldCBoaUZlYXRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5oaUZlYXRzKTtcblx0aWYgKGN1cnJGZWF0KSB7XG5cdCAgICBoaUZlYXRzW2N1cnJGZWF0LmlkXSA9IGN1cnJGZWF0LmlkO1xuXHR9XG5cblx0Ly8gRmlsdGVyIGFsbCBmZWF0dXJlcyAocmVjdGFuZ2xlcykgaW4gdGhlIHNjZW5lIGZvciB0aG9zZSBiZWluZyBoaWdobGlnaHRlZC5cblx0Ly8gQWxvbmcgdGhlIHdheSwgYnVpbGQgaW5kZXggbWFwcGluZyBmZWF0dXJlIGlkIHRvIGl0cyBcInN0YWNrXCIgb2YgZXF1aXZhbGVudCBmZWF0dXJlcyxcblx0Ly8gaS5lLiBhIGxpc3Qgb2YgaXRzIGdlbm9sb2dzIHNvcnRlZCBieSB5IGNvb3JkaW5hdGUuXG5cdC8vIEFsc28sIG1ha2UgZWFjaCBoaWdobGlnaHRlZCBmZWF0dXJlIHRhbGxlciAoc28gaXQgc3RhbmRzIGFib3ZlIGl0cyBuZWlnaGJvcnMpXG5cdC8vIGFuZCBnaXZlIGl0IHRoZSBcIi5oaWdobGlnaHRcIiBjbGFzcy5cblx0Ly9cblx0bGV0IHN0YWNrcyA9IHt9OyAvLyBmaWQgLT4gWyByZWN0cyBdIFxuXHRsZXQgZGggPSB0aGlzLmJsb2NrSGVpZ2h0LzIgLSB0aGlzLmZlYXRIZWlnaHQ7XG4gICAgICAgIGxldCBmZWF0cyA9IHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoXCIuZmVhdHVyZVwiKVxuXHQgIC8vIGZpbHRlciByZWN0LmZlYXR1cmVzIGZvciB0aG9zZSBpbiB0aGUgaGlnaGxpZ2h0IGxpc3Rcblx0ICAuZmlsdGVyKGZ1bmN0aW9uKGZmKXtcblx0ICAgICAgLy8gaGlnaGxpZ2h0IGZmIGlmIGVpdGhlciBpZCBpcyBpbiB0aGUgbGlzdCBBTkQgaXQncyBub3QgYmVlbiBoaWRkZW5cblx0ICAgICAgbGV0IG1naSA9IGhpRmVhdHNbZmYubWdpaWRdO1xuXHQgICAgICBsZXQgbWdwID0gaGlGZWF0c1tmZi5tZ3BpZF07XG5cdCAgICAgIGxldCBzaG93aW5nID0gZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwiZGlzcGxheVwiKSAhPT0gXCJub25lXCI7XG5cdCAgICAgIGxldCBobCA9IHNob3dpbmcgJiYgKG1naSB8fCBtZ3ApO1xuXHQgICAgICBpZiAoaGwpIHtcblx0XHQgIC8vIGZvciBlYWNoIGhpZ2hsaWdodGVkIGZlYXR1cmUsIGFkZCBpdHMgcmVjdGFuZ2xlIHRvIHRoZSBsaXN0XG5cdFx0ICBsZXQgayA9IGZmLmlkO1xuXHRcdCAgaWYgKCFzdGFja3Nba10pIHN0YWNrc1trXSA9IFtdXG5cdFx0ICBzdGFja3Nba10ucHVzaCh0aGlzKVxuXHQgICAgICB9XG5cdCAgICAgIC8vIFxuXHQgICAgICBkMy5zZWxlY3QodGhpcylcblx0XHQgIC5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIGhsKVxuXHRcdCAgLmNsYXNzZWQoXCJjdXJyZW50XCIsIGhsICYmIGN1cnJGZWF0ICYmIHRoaXMuX19kYXRhX18uaWQgPT09IGN1cnJGZWF0LmlkKVxuXHRcdCAgLmNsYXNzZWQoXCJleHRyYVwiLCBwdWxzZUN1cnJlbnQgJiYgZmYgPT09IGN1cnJGZWF0KVxuXHQgICAgICByZXR1cm4gaGw7XG5cdCAgfSlcblx0ICA7XG5cblx0Ly8gYnVpbGQgZGF0YSBhcnJheSBmb3IgZHJhd2luZyBmaWR1Y2lhbHMgYmV0d2VlbiBlcXVpdmFsZW50IGZlYXR1cmVzXG5cdGxldCBkYXRhID0gW107XG5cdGZvciAobGV0IGsgaW4gc3RhY2tzKSB7XG5cdCAgICAvLyBmb3IgZWFjaCBoaWdobGlnaHRlZCBmZWF0dXJlLCBzb3J0IHRoZSByZWN0YW5nbGVzIGluIGl0cyBsaXN0IGJ5IFktY29vcmRpbmF0ZVxuXHQgICAgbGV0IHJlY3RzID0gc3RhY2tzW2tdO1xuXHQgICAgcmVjdHMuc29ydCggKGEsYikgPT4gcGFyc2VGbG9hdChhLmdldEF0dHJpYnV0ZShcInlcIikpIC0gcGFyc2VGbG9hdChiLmdldEF0dHJpYnV0ZShcInlcIikpICk7XG5cdCAgICByZWN0cy5zb3J0KCAoYSxiKSA9PiB7XG5cdFx0cmV0dXJuIGEuX19kYXRhX18uZ2Vub21lLnpvb21ZIC0gYi5fX2RhdGFfXy5nZW5vbWUuem9vbVk7XG5cdCAgICB9KTtcblx0ICAgIC8vIFdhbnQgYSBwb2x5Z29uIGJldHdlZW4gZWFjaCBzdWNjZXNzaXZlIHBhaXIgb2YgaXRlbXMuIFRoZSBmb2xsb3dpbmcgY3JlYXRlcyBhIGxpc3Qgb2Zcblx0ICAgIC8vIG4gcGFpcnMsIHdoZXJlIHJlY3RbaV0gaXMgcGFpcmVkIHdpdGggcmVjdFtpKzFdLiBUaGUgbGFzdCBwYWlyIGNvbnNpc3RzIG9mIHRoZSBsYXN0XG5cdCAgICAvLyByZWN0YW5nbGUgcGFpcmVkIHdpdGggdW5kZWZpbmVkLiAoV2Ugd2FudCB0aGlzLilcblx0ICAgIGxldCBwYWlycyA9IHJlY3RzLm1hcCgociwgaSkgPT4gW3IscmVjdHNbaSsxXV0pO1xuXHQgICAgLy8gQWRkIGEgY2xhc3MgKFwiY3VycmVudFwiKSBmb3IgdGhlIHBvbHlnb25zIGFzc29jaWF0ZWQgd2l0aCB0aGUgbW91c2VvdmVyIGZlYXR1cmUgc28gdGhleVxuXHQgICAgLy8gY2FuIGJlIGRpc3Rpbmd1aXNoZWQgZnJvbSBvdGhlcnMuXG5cdCAgICBkYXRhLnB1c2goeyBmaWQ6IGssIHJlY3RzOiBwYWlycywgY2xzOiAoY3VyckZlYXQgJiYgY3VyckZlYXQuaWQgPT09IGsgPyAnY3VycmVudCcgOiAnJykgfSk7XG5cdH1cblx0dGhpcy5kcmF3RmlkdWNpYWxzKGRhdGEsIGN1cnJGZWF0KTtcblxuXHQvLyBGSVhNRTogcmVhY2hvdmVyXG5cdHRoaXMuYXBwLmZlYXR1cmVEZXRhaWxzLnVwZGF0ZShjdXJyRmVhdCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgcG9seWdvbnMgdGhhdCBjb25uZWN0IGhpZ2hsaWdodGVkIGZlYXR1cmVzIGluIHRoZSB2aWV3XG4gICAgLy8gQXJnczpcbiAgICAvLyAgIGRhdGEgOiBsaXN0IG9mIHtcbiAgICAvLyAgICAgICBmaWQ6IGZlYXR1cmUtaWQsIFxuICAgIC8vICAgICAgIGNsczogZXh0cmEgY2xhc3MgZm9yIC5mZWF0dXJlTWFyayBncm91cCxcbiAgICAvLyAgICAgICByZWN0czogbGlzdCBvZiBbcmVjdDEscmVjdDJdIHBhaXJzLCBcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICBjdXJyRmVhdCA6IGN1cnJlbnQgKG1vdXNlb3ZlcikgZmVhdHVyZSAoaWYgYW55KVxuICAgIC8vXG4gICAgZHJhd0ZpZHVjaWFscyAoZGF0YSwgY3VyckZlYXQpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHQvL1xuXHQvLyBwdXQgZmlkdWNpYWwgbWFya3MgaW4gdGhlaXIgb3duIGdyb3VwIFxuXHRsZXQgZkdycCA9IHRoaXMuZmlkdWNpYWxzLmNsYXNzZWQoXCJoaWRkZW5cIiwgZmFsc2UpO1xuXG5cdC8vIEJpbmQgZmlyc3QgbGV2ZWwgZGF0YSB0byBcImZlYXR1cmVNYXJrc1wiIGdyb3Vwc1xuXHRsZXQgZmZHcnBzID0gZkdycC5zZWxlY3RBbGwoXCJnLmZlYXR1cmVNYXJrc1wiKVxuXHQgICAgLmRhdGEoZGF0YSwgZCA9PiBkLmZpZCk7XG5cdGZmR3Jwcy5lbnRlcigpLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBkID0+IGQuZmlkKTtcblx0ZmZHcnBzLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0ZmZHcnBzLmF0dHIoXCJjbGFzc1wiLGQgPT4gXCJmZWF0dXJlTWFya3MgXCIgKyAoZC5jbHMgfHwgXCJcIikpXG5cblx0Ly8gRHJhdyBmZWF0dXJlIGxhYmVscy4gRWFjaCBsYWJlbCBpcyBkcmF3biBvbmNlLCBhYm92ZSB0aGUgZmlyc3QgcmVjdGFuZ2xlIGluIGl0cyBsaXN0LlxuXHQvLyBcblx0bGV0IGxhYmVscyA9IGZmR3Jwcy5zZWxlY3RBbGwoJ3RleHQuZmVhdExhYmVsJylcblx0ICAgIC5kYXRhKGQgPT4gW3sgZmlkOiBkLmZpZCwgcmVjdDogZC5yZWN0c1swXVswXSwgdHJlY3Q6IGNvb3Jkc0FmdGVyVHJhbnNmb3JtKGQucmVjdHNbMF1bMF0pIH1dKTtcblx0bGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCdmZWF0TGFiZWwnKTtcblx0bGFiZWxzLmV4aXQoKS5yZW1vdmUoKTtcblx0bGFiZWxzXG5cdCAgLmF0dHIoXCJ4XCIsIGQgPT4gZC50cmVjdC54ICsgZC50cmVjdC53aWR0aC8yIClcblx0ICAuYXR0cihcInlcIiwgZCA9PiBkLnJlY3QuX19kYXRhX18uZ2Vub21lLnpvb21ZIC0gMylcblx0ICAudGV4dChkID0+IHtcblx0ICAgICAgIGxldCBmID0gZC5yZWN0Ll9fZGF0YV9fO1xuXHQgICAgICAgbGV0IHN5bSA9IGYuc3ltYm9sIHx8IGYubWdwaWQ7XG5cdCAgICAgICByZXR1cm4gc3ltO1xuXHQgIH0pO1xuXG5cdC8vIFB1dCBhIHJlY3RhbmdsZSBiZWhpbmQgZWFjaCBsYWJlbCAoYXMgYSBiYWNrZ3JvdW5kKVxuXHRsZXQgbGJsQm94RGF0YSA9IGxhYmVscy5tYXAobGJsID0+IGxibFswXS5nZXRCQm94KCkpXG5cdGxldCBsYmxCb3hlcyA9IGZmR3Jwcy5zZWxlY3RBbGwoJ3JlY3QuZmVhdExhYmVsQm94Jylcblx0ICAgIC5kYXRhKChkLGkpID0+IFtsYmxCb3hEYXRhW2ldXSk7XG5cdGxibEJveGVzLmVudGVyKCkuaW5zZXJ0KCdyZWN0JywnOmZpcnN0LWNoaWxkJykuYXR0cignY2xhc3MnLCdmZWF0TGFiZWxCb3gnKTtcblx0bGJsQm94ZXMuZXhpdCgpLnJlbW92ZSgpO1xuXHRsYmxCb3hlc1xuXHQgICAgLmF0dHIoXCJ4XCIsICAgICAgYmIgPT4gYmIueC0yKVxuXHQgICAgLmF0dHIoXCJ5XCIsICAgICAgYmIgPT4gYmIueS0xKVxuXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCAgYmIgPT4gYmIud2lkdGgrNClcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGJiID0+IGJiLmhlaWdodCsyKVxuXHQgICAgO1xuXHRcblx0Ly8gaWYgdGhlcmUgaXMgYSBjdXJyRmVhdCwgbW92ZSBpdHMgZmlkdWNpYWxzIHRvIHRoZSBlbmQgKHNvIHRoZXkncmUgb24gdG9wIG9mIGV2ZXJ5b25lIGVsc2UpXG5cdGlmIChjdXJyRmVhdCkge1xuXHQgICAgLy8gZ2V0IGxpc3Qgb2YgZ3JvdXAgZWxlbWVudHMgZnJvbSB0aGUgZDMgc2VsZWN0aW9uXG5cdCAgICBsZXQgZmZMaXN0ID0gZmZHcnBzWzBdO1xuXHQgICAgLy8gZmluZCB0aGUgb25lIHdob3NlIGZlYXR1cmUgaXMgY3VyckZlYXRcblx0ICAgIGxldCBpID0gLTE7XG5cdCAgICBmZkxpc3QuZm9yRWFjaCggKGcsaikgPT4geyBpZiAoZy5fX2RhdGFfXy5maWQgPT09IGN1cnJGZWF0LmlkKSBpID0gajsgfSk7XG5cdCAgICAvLyBpZiB3ZSBmb3VuZCBpdCBhbmQgaXQncyBub3QgYWxyZWFkeSB0aGUgbGFzdCwgbW92ZSBpdCB0byB0aGVcblx0ICAgIC8vIGxhc3QgcG9zaXRpb24gYW5kIHJlb3JkZXIgaW4gdGhlIERPTS5cblx0ICAgIGlmIChpID49IDApIHtcblx0XHRsZXQgbGFzdGkgPSBmZkxpc3QubGVuZ3RoIC0gMTtcblx0ICAgICAgICBsZXQgeCA9IGZmTGlzdFtpXTtcblx0XHRmZkxpc3RbaV0gPSBmZkxpc3RbbGFzdGldO1xuXHRcdGZmTGlzdFtsYXN0aV0gPSB4O1xuXHRcdGZmR3Jwcy5vcmRlcigpO1xuXHQgICAgfVxuXHR9XG5cdFxuXHQvLyBCaW5kIHNlY29uZCBsZXZlbCBkYXRhIChyZWN0YW5nbGUgcGFpcnMpIHRvIHBvbHlnb25zIGluIHRoZSBncm91cFxuXHRsZXQgcGdvbnMgPSBmZkdycHMuc2VsZWN0QWxsKFwicG9seWdvblwiKVxuXHQgICAgLmRhdGEoZD0+ZC5yZWN0cy5maWx0ZXIociA9PiByWzBdICYmIHJbMV0pKTtcblx0cGdvbnMuZXhpdCgpLnJlbW92ZSgpO1xuXHRwZ29ucy5lbnRlcigpLmFwcGVuZChcInBvbHlnb25cIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImZpZHVjaWFsXCIpXG5cdCAgICA7XG5cdC8vXG5cdHBnb25zLmF0dHIoXCJwb2ludHNcIiwgciA9PiB7XG5cdCAgICAvLyBwb2x5Z29uIGNvbm5lY3RzIGJvdHRvbSBjb3JuZXJzIG9mIDFzdCByZWN0IHRvIHRvcCBjb3JuZXJzIG9mIDJuZCByZWN0XG5cdCAgICBsZXQgYzEgPSBjb29yZHNBZnRlclRyYW5zZm9ybShyWzBdKTsgLy8gdHJhbnNmb3JtIGNvb3JkcyBmb3IgMXN0IHJlY3Rcblx0ICAgIGxldCBjMj0gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0oclsxXSk7ICAvLyB0cmFuc2Zvcm0gY29vcmRzIGZvciAybmQgcmVjdFxuXHQgICAgLy8gZm91ciBwb2x5Z29uIHBvaW50c1xuXHQgICAgbGV0IHMgPSBgJHtjMS54fSwke2MxLnkrYzEuaGVpZ2h0fSAke2MyLnh9LCR7YzIueX0gJHtjMi54K2MyLndpZHRofSwke2MyLnl9ICR7YzEueCtjMS53aWR0aH0sJHtjMS55K2MxLmhlaWdodH1gXG5cdCAgICByZXR1cm4gcztcblx0fSlcblx0Ly8gbW91c2luZyBvdmVyIHRoZSBmaWR1Y2lhbCBoaWdobGlnaHRzIChhcyBpZiB0aGUgdXNlciBoYWQgbW91c2VkIG92ZXIgdGhlIGZlYXR1cmUgaXRzZWxmKVxuXHQub24oXCJtb3VzZW92ZXJcIiwgKHApID0+IHtcblx0ICAgIGlmICghZDMuZXZlbnQuY3RybEtleSlcblx0ICAgICAgICB0aGlzLmhpZ2hsaWdodChwWzBdKTtcblx0fSlcblx0Lm9uKFwibW91c2VvdXRcIiwgIChwKSA9PiB7XG5cdCAgICBpZiAoIWQzLmV2ZW50LmN0cmxLZXkpXG5cdCAgICAgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZGVGaWR1Y2lhbHMgKCkge1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0KFwiZy5maWR1Y2lhbHNcIilcblx0ICAgIC5jbGFzc2VkKFwiaGlkZGVuXCIsIHRydWUpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIFpvb21WaWV3XG5cbmV4cG9ydCB7IFpvb21WaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9ab29tVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==