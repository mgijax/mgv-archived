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
    // elt - container. may be a string (selector), a DOM node, or a d3 selection of 1 node.
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

	this.initDom();

	//
	//
	this.genomeView = new __WEBPACK_IMPORTED_MODULE_10__GenomeView__["a" /* GenomeView */](this, '#genomeView', 800, 250);
	this.zoomView   = new __WEBPACK_IMPORTED_MODULE_12__ZoomView__["a" /* ZoomView */]  (this, '#zoomView', 800, 250, this.coords);
	this.resize();
        //
	this.featureDetails = new __WEBPACK_IMPORTED_MODULE_11__FeatureDetails__["a" /* FeatureDetails */](this, '#featureDetails');

	// Categorical color scale for feature types
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
	Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* d3tsv */])("./data/genomeList.tsv").then(data => {
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

	    // Now preload all the chromosome files for all the genomes
	    let cdps = this.allGenomes.map(g => Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* d3tsv */])(`./data/genomedata/${g.name}-chromosomes.tsv`));
	    return Promise.all(cdps);
	})
	.then( data => {

	    //
	    this.processChromosomes(data);
            this.initDomPart2();
	    //
	    // FINALLY! We are ready to draw the initial scene.
	    this.setContext(this.initialCfg);

	});
    }
    //----------------------------------------------
    // 
    initDom () {
	self = this;
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
    }
    //----------------------------------------------
    // Dom initializtion that must wait until after genome meta data is loaded.
    initDomPart2 () {
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
	Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* d3tsv */])("./data/genomeSets.tsv").then(sets => {
	    // Create selection buttons.
	    sets.forEach( s => s.genomes = s.genomes.split(",") );
	    let cgb = d3.select('#compGenomesBox').selectAll('button').data(sets);
	    cgb.enter().append('button')
		.text(d=>d.name)
		.attr('title', d=>d.description)
		.on('click', d => {
		    self.setContext(d);
		})
		;
	}).catch(()=>{
	    console.log("No genomeSets file found.");
	}); // OK if no genomeSets file

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
	if (!rf) {
	    // Landmark does not exist in ref genome. Does it exist in any specified genome?
	    rf = this.featureManager.getCachedFeaturesByLabel(cfg.landmark).filter(f => cfg.genomes.indexOf(f.genome) >= 0)[0];
	    if (rf) {
	        cfg.ref = rf.genome;
	    }
	    else {
	        // Landmark cannot be resolved.
		return null;
	    }
	}
	// landmark exists in ref genome. Get equivalent feat in each genome.
	feats = rf.canonical ? this.featureManager.getCachedFeaturesByCanonicalId(rf.canonical) : [rf];
	cfg.landmarkRefFeat = rf;
	cfg.landmarkFeats = feats.filter(f => cfg.genomes.indexOf(f.genome) >= 0);
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
	    if (cfg.cmode === 'landmark') {
	        cfg = this.resolveLandmark(cfg);
		if (!cfg) {
		    alert("Landmark does not exist in current reference genome. Please change the reference genome and try again.");
		    this.showBusy(false);
		    return;
		}
	    }
	    this.vGenomes = cfg.genomes;
	    this.rGenome  = cfg.ref;
	    this.cGenomes = cfg.genomes.filter(g => g !== cfg.ref);
	    this.setRefGenomeSelection(this.rGenome.name);
	    this.setCompGenomesSelection(this.vGenomes.map(g=>g.name));
	    //
	    this.cmode = cfg.cmode;
	    //
	    return this.translator.ready();
	}).then(() => {
	    //
	    if (!cfg) return;
	    this.coords   = {
	        chr: cfg.chr.name,
		start: cfg.start,
		end: cfg.end
	    };
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
		    delta: 0,
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
	if (lst && lst.ids.length > 0) {
	    if (lst === prevList)
	        this.currListCounter = (this.currListCounter + 1) % this.currList.ids.length;
	    else
	        this.currListCounter = 0;
	    let currId = lst.ids[this.currListCounter];
	    // show this list as tick marks in the genome view
	    this.genomeView.drawTicks(lst.ids);
	    this.genomeView.drawTitle();
	    this.setCoordinates(currId);
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
    panzoom(pfactor, zfactor) {
	//
	!pfactor && (pfactor = 0);
	!zfactor && (zfactor = 1);
	//
	let c = this.coords;
	let width = c.end - c.start + 1;
	let mid = (c.start + c.end)/2;
	let chr = this.rGenome.chromosomes.filter(c => c.name === this.coords.chr)[0];
	let ncxt = {}; // new context
	let minD = -(c.start-1); // min delta (at current zoom)
	let maxD = chr.length - c.end; // max delta (at current zoom)
	let d = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* clip */])(pfactor * width, minD, maxD); // delta (at new zoom)
	let newwidth = zfactor * width;
	let newstart = mid - newwidth/2 + d;
	//
	if (this.cmode === 'mapped') {
	    ncxt.chr = c.chr;
	    ncxt.start = newstart;
	    ncxt.end = newstart + newwidth - 1;
	}
	else {
	    ncxt.length = newwidth;
	    ncxt.delta = this.lcoords.delta + d ;
	}
	this.setContext(ncxt);
    }
    zoom (factor) {
        this.panzoom(null, factor);
    }
    pan (factor) {
        this.panzoom(factor, null);
    }	
    //----------------------------------------------
    // Zooms in/out by factor. New zoom width is factor * the current width.
    // Factor > 1 zooms out, 0 < factor < 1 zooms in.
    xzoom (factor) {
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
    xpan (factor) {
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
		    // alt-click copies the list's name into the formula editor
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
	     .attr('width',16)
	     .attr('x', -8)
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
    drawTicks (ids) {
	this.currTicks = ids || [];
	this.app.featureManager.getFeaturesById(this.app.rGenome, this.currTicks)
	    .then( feats => { this._drawTicks(feats); });
    }
    // ---------------------------------------------
    _drawTicks (features) {
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
	    ["MGI id"     ,10],
	    ["MGI symbol" ,10],
	    ["Genome"     ,9],
	    ["MGP id"     ,17],
	    ["Type"       ,10.5],
	    ["BioType"    ,18.5],
	    ["Coordinates",18],
	    ["Length"     ,7]
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
	    let cellData = [ ".", ".", genomeOrder[i-1].label, ".", ".", ".", ".", "." ];
	    // f is null if it doesn't exist for genome i 
	    if (f) {
		let link = "";
		let mgiid = f.mgiid || "";
		if (mgiid) {
		    let url = `http://www.informatics.jax.org/accession/${mgiid}`;
		    link = `<a target="_blank" href="${url}">${mgiid}</a>`;
		}
		cellData = [
		    link || mgiid,
		    f.symbol,
		    f.genome.label,
		    f.mgpid,
		    f.type,
		    f.biotype,
		    `${f.chr}:${f.start}..${f.end} (${f.strand})`,
		    `${f.end - f.start + 1} bp`
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
      this.maxSBgap = 20;	// max gap allowed between blocks.
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
	    // FIXME: reachover
	    this.app.featureDetails.update(f);
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
		else {
		    this.highlight(f);
		    if (d3.event.ctrlKey)
		        this.app.featureDetails.update(f);
		}
	}.bind(this);
	//
	let fMouseOutHandler = function(f) {
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
	      let mx = d3.mouse(self.svgMain[0][0])[0];
	      let my = d3.mouse(self.svgMain[0][0])[1];
	      self.dragging.attr("transform", `translate(${mx}, ${my})`);
	      self.setGenomeYOrder(self.getGenomeYOrder());
	      self.drawFiducials();
	  })
	  .on("dragend.z", function (g) {
	      if (!self.dragging) return;
	      //
	      self.dragging.classed("dragging", false);
	      self.dragging = null;
	      self.setGenomeYOrder(self.getGenomeYOrder());
	      self.app.setContext({ genomes: self.getGenomeYOrder() });
	      window.setTimeout( self.drawFiducials.bind(self), 50 );
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
      if (Math.abs(xt[0] - xt[1]) <= 10) {
	  // User clicked. Recenter view.
	  let cc        = this.app.coords; 
	  let currWidth = cc.end - cc.start + 1;
	  let mid       = (cc.start + cc.end)/2;
          let d = (xt[0] + xt[1])/2 - mid;
	  this.app.setContext({ start: cc.start+d, end: cc.end+d });
      }
      else {
	  // User dragged. Zoom in or out.
	  this.app.setContext({ start:xt[0], end:xt[1] });
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
	return mgv.translator.ready().then(function(){
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
	    return Promise.all(promises)
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
	if (this.root.classed('closed'))
	    feats = feats.filter(f => f.genome === this.app.rGenome);
	let delta = coords.delta || 0;
	// compute ranges around landmark in each genome
	let ranges = feats.map(f => {
	    let flank = c.length ? (c.length - f.length) / 2 : c.flank;
	    let clength = f.genome.getChromosome(f.chr).length;
	    let w     = c.length ? c.length : (f.length + 2*flank);
	    let start = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* clip */])(Math.round(delta + f.start - flank), 1, clength);
	    let end   = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* clip */])(Math.round(start + w), start, clength)
	    let range = {
		genome:	f.genome,
		chr:	f.chr,
		start:	start,
		end:	end
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
	if (!this.root.classed('closed'))
	    mgv.cGenomes.forEach(g => {
		if (! seenGenomes.has(g)) {
		    let rrs = mgv.translator.translate(mgv.rGenome, rCoords.chr, rCoords.start, rCoords.end, g);
		    promises.push( mgv.featureManager.getFeatures(g, rrs) );
		}
	    });
	// When all the data is ready, draw.
	return Promise.all(promises);
    }
    //
    update () {
	let p;
	if (this.app.cmode === 'mapped')
	    p = this.updateViaMappedCoordinates(this.app.coords);
	else
	    p = this.updateViaLandmarkCoordinates(this.app.lcoords);
	p.then( data => {
	    this.draw(data);
	});
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
	    else {
		dx = b.chr === cchr ? pstart[j] + ppb * (b.start - bstart[j]) : Infinity;
		if (dx > self.maxSBgap) {
		    // Changed chr or jumped a large gap
		    pstart[j] = pend + 16;
		    bstart[j] = b.start;
		    dx = pstart[j];
		}
	    }
	    d3.select(this).attr("transform", `translate(${dx},0)`);
	    pend = dx + blen;
	});
    }

    // ------------------------------------
    mergeSblockRuns (data) {
	// -----
	// Reducer function. Will be called with these args:
	//   nblcks (list) New blocks. (current accumulator value)
	//   	A list of lists of synteny blocks.
	//   blk (synteny block) the current synteny block
	//   i (int) The iteration count.
	// Returns:
	//   list of lists of blocks
	let merger = function(nblks, b, i) {
	    let initBlk = function (bb) {
		let nb = Object.assign({}, bb);
		nb.features = bb.features.concat();
		nb.sblocks = [bb];
		nb.ori = '+';
	        return nb;
	    };
	    if (i === 0){
		nblks.push(initBlk(b));
		return nblks;
	    }
	    let lastBlk = nblks[nblks.length - 1];
	    if (b.chr !== lastBlk.chr || b.index - lastBlk.index > 2) {
	        nblks.push(initBlk(b));
		return nblks;
	    }
	    // merge
	    lastBlk.index = b.index;
	    lastBlk.end = b.end;
	    lastBlk.blockEnd = b.blockEnd;
	    lastBlk.features = lastBlk.features.concat(b.features);
	    //b.features = null;
	    lastBlk.sblocks.push(b);
	    return nblks;
	};
	// -----
        data.forEach((gdata,i) => {
	    gdata.blocks.sort( (a,b) => a.index - b.index );
	    gdata.blocks = gdata.blocks.reduce(merger,[]);
	});
	return data;
    }

    // -----------------------------------------------------
    // synteny blocks. Each zoom strip has a list of 1 or more sblocks.
    // The reference genome always has just 1. The comp genomes many have
    // 1 or more (and in rare cases, 0).
    // -----------------------------------------------------
    uniqifyBlocks (blocks) {
	// helper function. When sblock relationship between genomes is confused, requesting one
	// region in genome A can end up requesting the same region in genome B multiple times.
	// This function avoids drawing the same sblock twice. (NB: Really not sure where this 
	// check is best done. Could push it farther upstream.)
	let seen = new Set();
	return blocks.filter( b => { 
	    if (seen.has(b.index)) return false;
	    seen.add(b.index);
	    return true;
	});
    };
    //----------------------------------------------
    // Applies several transformation steps on the data as returned by the server to prepare for drawing.
    // Input data is structured as follows:
    //     data = [ zoomStrip_data ]
    //     zoomStrip_data = { genome [ zoomBlock_data ] }
    //     zoomBlock_data = { xscale, chr, start, end, index, fChr, fStart, fEnd, fIndex, ori, [ feature_data ] }
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
    // Because SBlocks can be very fragmented, one contiguous region in the ref genome can turn into 
    // a bazillion tiny blocks in the comparison. The resulting rendering is jarring and unusable.
    // The drawing routine modifies the data by merging runs of consecutive blocks in each comp genome.
    // The data change is to insert a grouping layer on top of the sblocks, specifically, 
    //     zoomStrip_data = { genome [ zoomBlock_data ] }
    // becomes
    //     zoomStrip_data = { genome [ zoomSuperBlock_data ] }
    //     zoomSuperBlock_data = { chr start end blocks [ zoomBlock_data ] }
    //
    mungeData (data) {
        data.forEach(gData => gData.blocks = this.uniqifyBlocks(gData.blocks));
	data = this.mergeSblockRuns(data);
	return data;
    }

    //----------------------------------------------
    // Draws the zoom view panel with the given data.
    //
    draw (data) {
        data = this.mungeData(data);
	// 
	let self = this;

	let closed = this.root.classed("closed");

	// reset the svg size based on number of strips
	let totalHeight = (this.stripHeight+this.stripGap) * data.length + 20;
	this.svg
	    .attr("height", totalHeight);

	// Draw the title on the zoomview position controls
	d3.select("#zoomView .zoomCoords label")
	    .text(this.app.rGenome.label + " coords");
	
	// the reference genome block (always just 1 of these).
	let rData = data.filter(dd => dd.genome === this.app.rGenome)[0];
	let rBlock = rData.blocks[0];

	// x-scale and x-axis based on the ref genome data.
	this.xscale = d3.scale.linear()
	    .domain([rBlock.start,rBlock.end])
	    .range([0,this.width]);

        // -----------------------------------------------------
	// draw the coordinate axis
        // -----------------------------------------------------
	this.axisFunc = d3.svg.axis()
	    .scale(this.xscale)
	    .orient("top")
	    .outerTickSize(2)
	    .ticks(5)
	    .tickSize(5)
	    ;
	this.axis.call(this.axisFunc);

        // -----------------------------------------------------
	// zoom strips (one per genome)
        // -----------------------------------------------------
        let zstrips = this.stripsGrp
	        .selectAll("g.zoomStrip")
		.data(data, d => d.genome.name);
	// Create the group
	let newzs = zstrips.enter()
	        .append("g")
		.attr("class","zoomStrip")
		.attr("name", d => d.genome.name)
		.on("click", function (g) {
		    self.highlightStrip(g.genome, this);
		})
		.call(this.dragger)
		;
	// Strip label
	newzs.append("text")
	    .attr("name", "genomeLabel")
	    .text( d => d.genome.label)
	    .attr("x", 0)
	    .attr("y", this.blockHeight/2 + 20)
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

	// ---- Synteny blocks ----
        let sblocks = zstrips.select('[name="sBlocks"]').selectAll('g.sBlock')
	    .data(d=>d.blocks, b => b.blockId);
	let newsbs = sblocks.enter()
	    .append("g")
	    .attr("class", b => "sBlock " + 
	        (b.ori==="+" ? "plus" : b.ori==="-" ? "minus": "confused") + 
		(b.chr !== b.fChr ? " translocation" : ""))
	    .attr("name", b=>b.index)
	    ;
	let l0 = newsbs.append("g").attr("name", "layer0");
	let l1 = newsbs.append("g").attr("name", "layer1");

	//
	this.orderSBlocks(sblocks);

	// rectangle for each synteny block
	let sbrects = sblocks.select('g[name="layer0"]').selectAll('rect.block').data(d=> {
	    d.sblocks.forEach(b=>b.xscale = d.xscale);
	    return d.sblocks
	    }, sb=>sb.index);
        sbrects.enter().append('rect')
	    .attr("class", b => "block " + 
	        (b.ori==="+" ? "plus" : b.ori==="-" ? "minus": "confused") + 
		(b.chr !== b.fChr ? " translocation" : ""))
	    ;
	sbrects
	  .attr("x",     b => b.xscale(b.flip ? b.end : b.start))
	  .attr("y",     b => -this.blockHeight / 2)
	  .attr("width", b => Math.max(4, Math.abs(b.xscale(b.end)-b.xscale(b.start))))
	  .attr("height",this.blockHeight);
	  ;
	sbrects.exit().remove();

	// the axis line
	l0.append("line").attr("class","axis");
	
	sblocks.select("line.axis")
	    .attr("x1", b => b.xscale(b.start))
	    .attr("y1", 0)
	    .attr("x2", b => b.xscale(b.end))
	    .attr("y2", 0)
	    ;
	// label
	l0.append("text")
	    .attr("class","blockLabel") ;
	// brush
	l0.append("g").attr("class","brush");

	//
	sblocks.exit().remove();

	// synteny block labels
	sblocks.select("text.blockLabel")
	    .text( b => b.chr )
	    .attr("x", b => (b.xscale(b.start) + b.xscale(b.end))/2 )
	    .attr("y", this.blockHeight / 2 + 10)
	    ;

	// brush
	sblocks.select("g.brush")
	    .attr("transform", b => `translate(0,${this.blockHeight / 2})`)
	    .each(function(b) {
		if (!b.brush) {
		    b.brush = d3.svg.brush()
			.on("brushstart", function(){ self.bbStart( b, this ); })
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
	    return b.xscale(Math.max(f.start,b.start))
	};
	let fw = function (f) {
	    let b = fBlock(this);
	    return Math.abs(b.xscale(Math.min(f.end,b.end)) - b.xscale(Math.max(f.start,b.start))) + 1;
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
	this.stacks = {}; // fid -> [ rects ] 
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
		  if (!self.stacks[k]) self.stacks[k] = []
		  self.stacks[k].push(this)
	      }
	      // 
	      d3.select(this)
		  .classed("highlight", hl)
		  .classed("current", hl && currFeat && this.__data__.id === currFeat.id)
		  .classed("extra", pulseCurrent && ff === currFeat)
	      return hl;
	  })
	  ;

	this.drawFiducials(currFeat);

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
    drawFiducials (currFeat) {
	// build data array for drawing fiducials between equivalent features
	let data = [];
	for (let k in this.stacks) {
	    // for each highlighted feature, sort the rectangles in its list by Y-coordinate
	    let rects = this.stacks[k];
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
	    let c2 = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* coordsAfterTransform */])(r[1]);  // transform coords for 2nd rect
	    r.tcoords = [c1,c2];
	    // four polygon points
	    let s = `${c1.x},${c1.y+c1.height} ${c2.x},${c2.y} ${c2.x+c2.width},${c2.y} ${c1.x+c1.width},${c1.y+c1.height}`
	    return s;
	})
	//
	// mousing over the fiducial highlights (as if the user had moused over the feature itself)
	.on("mouseover", (p) => {
	    this.highlight(p[0]);
	})
	.on("mouseout",  (p) => {
	    this.highlight();
	});
	// -------------------------------------
	// Draw feature labels. Each label is drawn once, above the first rectangle in its list.
	// The exception is the current (mouseover) feature, where the label is drawn above that feature.
	let labels = ffGrps.selectAll('text.featLabel')
	    .data(d => {
		let r = d.rects[0][0];
		if (currFeat && (d.fid === currFeat.ID || d.fid === currFeat.canonical)){
		    let r2 = r = d.rects.map( rr =>
		       rr[0].__data__ === currFeat ? rr[0] : rr[1]&&rr[1].__data__ === currFeat ? rr[1] : null
		       ).filter(x=>x)[0];
		    r = r2 ? r2 : r;
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




/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgN2I2NmYyMzcxYWI4Y2FkNjFkODEiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1N0b3JhZ2VNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvU1ZHVmlldy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvdmlld2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9NR1ZBcHAuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZS5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1F1ZXJ5TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQXV4RGF0YU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYUV2YWx1YXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvTGlzdEVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvVXNlclByZWZzTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmFjZXRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GYWNldC5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQlRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9CbG9ja1RyYW5zbGF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZVZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzIiwid2VicGFjazovLy8u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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQW9CQTs7Ozs7Ozs7QUN6VkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7OztBQ3JCUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7OztBQ3JFUjtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxvQkFBb0I7QUFDckQsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxRQUFRLFVBQVUsRUFBRSxJQUFJO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLHFCQUFxQjtBQUM3Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixFQUFFO0FBQ2xCLGlCQUFpQixLQUFLLEdBQUcsRUFBRTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakMsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQixHQUFHLGdCQUFnQixHQUFHLGFBQWE7QUFDcEUsaUJBQWlCLGNBQWMsR0FBRyxnQkFBZ0IsR0FBRyxnQkFBZ0I7QUFDckU7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxhQUFhO0FBQ2xFO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVPOzs7Ozs7Ozs7O0FDaFNvQjs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7Ozs7OztBQ25FcUQ7QUFDekM7QUFDUTs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRDtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QXlCLEVBQUU7QUFDM0QsZ0NBQWdDLHVCQUF1QixFQUFFO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsOEVBQThFO0FBQzlGOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUdBQXlDO0FBQ3pDLGlHQUF5QztBQUN6QztBQUNBO0FBQ0EsZ0JBQWdCLEtBQUssR0FBRyxlQUFlLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxjQUFjLEdBQUcsS0FBSyxHQUFHLGNBQWMsR0FBRyxlQUFlO0FBQ25IO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiwyQ0FBMkMsRUFBRTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPIiwiZmlsZSI6Im1ndi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA3YjY2ZjIzNzFhYjhjYWQ2MWQ4MSIsIlxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyAgICAgICAgICAgICAgICAgICAgVVRJTFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIChSZS0pSW5pdGlhbGl6ZXMgYW4gb3B0aW9uIGxpc3QuXG4vLyBBcmdzOlxuLy8gICBzZWxlY3RvciAoc3RyaW5nIG9yIE5vZGUpIENTUyBzZWxlY3RvciBvZiB0aGUgY29udGFpbmVyIDxzZWxlY3Q+IGVsZW1lbnQuIE9yIHRoZSBlbGVtZW50IGl0c2VsZi5cbi8vICAgb3B0cyAobGlzdCkgTGlzdCBvZiBvcHRpb24gZGF0YSBvYmplY3RzLiBNYXkgYmUgc2ltcGxlIHN0cmluZ3MuIE1heSBiZSBtb3JlIGNvbXBsZXguXG4vLyAgIHZhbHVlIChmdW5jdGlvbiBvciBudWxsKSBGdW5jdGlvbiB0byBwcm9kdWNlIHRoZSA8b3B0aW9uPiB2YWx1ZSBmcm9tIGFuIG9wdHMgaXRlbVxuLy8gICAgICAgRGVmYXVsdHMgdG8gdGhlIGlkZW50aXR5IGZ1bmN0aW9uICh4PT54KS5cbi8vICAgbGFiZWwgKGZ1bmN0aW9uIG9yIG51bGwpIEZ1bmN0aW9uIHRvIHByb2R1Y2UgdGhlIDxvcHRpb24+IGxhYmVsIGZyb20gYW4gb3B0cyBpdGVtXG4vLyAgICAgICBEZWZhdWx0cyB0byB0aGUgdmFsdWUgZnVuY3Rpb24uXG4vLyAgIG11bHRpIChib29sZWFuKSBTcGVjaWZpZXMgaWYgdGhlIGxpc3Qgc3VwcG9ydCBtdWx0aXBsZSBzZWxlY3Rpb25zLiAoZGVmYXVsdCA9IGZhbHNlKVxuLy8gICBzZWxlY3RlZCAoZnVuY3Rpb24gb3IgbnVsbCkgRnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIGEgZ2l2ZW4gb3B0aW9uIGlzIHNlbGVjdGQuXG4vLyAgICAgICBEZWZhdWx0cyB0byBkPT5GYWxzZS4gTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgb25seSBhcHBsaWVkIHRvIG5ldyBvcHRpb25zLlxuLy8gICBzb3J0QnkgKGZ1bmN0aW9uKSBPcHRpb25hbC4gSWYgcHJvdmlkZWQsIGEgY29tcGFyaXNvbiBmdW5jdGlvbiB0byB1c2UgZm9yIHNvcnRpbmcgdGhlIG9wdGlvbnMuXG4vLyAgIFx0IFRoZSBjb21wYXJpc29uIGZ1bmN0aW9uIGlzIHBhc3NlcyB0aGUgZGF0YSBvYmplY3RzIGNvcnJlc3BvbmRpbmcgdG8gdHdvIG9wdGlvbnMgYW5kIHNob3VsZFxuLy8gICBcdCByZXR1cm4gLTEsIDAgb3IgKzEuIElmIG5vdCBwcm92aWRlZCwgdGhlIG9wdGlvbiBsaXN0IHdpbGwgaGF2ZSB0aGUgc2FtZSBzb3J0IG9yZGVyIGFzIHRoZSBvcHRzIGFyZ3VtZW50LlxuLy8gUmV0dXJuczpcbi8vICAgVGhlIG9wdGlvbiBsaXN0IGluIGEgRDMgc2VsZWN0aW9uLlxuZnVuY3Rpb24gaW5pdE9wdExpc3Qoc2VsZWN0b3IsIG9wdHMsIHZhbHVlLCBsYWJlbCwgbXVsdGksIHNlbGVjdGVkLCBzb3J0QnkpIHtcblxuICAgIC8vIHNldCB1cCB0aGUgZnVuY3Rpb25zXG4gICAgbGV0IGlkZW50ID0gZCA9PiBkO1xuICAgIHZhbHVlID0gdmFsdWUgfHwgaWRlbnQ7XG4gICAgbGFiZWwgPSBsYWJlbCB8fCB2YWx1ZTtcbiAgICBzZWxlY3RlZCA9IHNlbGVjdGVkIHx8ICh4ID0+IGZhbHNlKTtcblxuICAgIC8vIHRoZSA8c2VsZWN0PiBlbHRcbiAgICBsZXQgcyA9IGQzLnNlbGVjdChzZWxlY3Rvcik7XG5cbiAgICAvLyBtdWx0aXNlbGVjdFxuICAgIHMucHJvcGVydHkoJ211bHRpcGxlJywgbXVsdGkgfHwgbnVsbCkgO1xuXG4gICAgLy8gYmluZCB0aGUgb3B0cy5cbiAgICBsZXQgb3MgPSBzLnNlbGVjdEFsbChcIm9wdGlvblwiKVxuICAgICAgICAuZGF0YShvcHRzLCBsYWJlbCk7XG4gICAgb3MuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKFwib3B0aW9uXCIpIFxuICAgICAgICAuYXR0cihcInZhbHVlXCIsIHZhbHVlKVxuICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCBvID0+IHNlbGVjdGVkKG8pIHx8IG51bGwpXG4gICAgICAgIC50ZXh0KGxhYmVsKSBcbiAgICAgICAgO1xuICAgIC8vXG4gICAgb3MuZXhpdCgpLnJlbW92ZSgpIDtcblxuICAgIC8vIHNvcnQgdGhlIHJlc3VsdHNcbiAgICBpZiAoIXNvcnRCeSkgc29ydEJ5ID0gKGEsYikgPT4ge1xuICAgIFx0bGV0IGFpID0gb3B0cy5pbmRleE9mKGEpO1xuXHRsZXQgYmkgPSBvcHRzLmluZGV4T2YoYik7XG5cdHJldHVybiBhaSAtIGJpO1xuICAgIH1cbiAgICBvcy5zb3J0KHNvcnRCeSk7XG5cbiAgICAvL1xuICAgIHJldHVybiBzO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByb21pc2lmaWVzIGEgY2FsbCB0byBkMy50c3YuXG4vLyBBcmdzOlxuLy8gICB1cmwgKHN0cmluZykgVGhlIHVybCBvZiB0aGUgdHN2IHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbGlzdCBvZiByb3cgb2JqZWN0c1xuZnVuY3Rpb24gZDN0c3YodXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkMy50c3YodXJsLCBmdW5jdGlvbihlcnJvciwgdmFsKXtcbiAgICAgICAgICAgIGVycm9yID8gcmVqZWN0KHsgc3RhdHVzOiBlcnJvci5zdGF0dXMsIHN0YXR1c1RleHQ6IGVycm9yLnN0YXR1c1RleHR9KSA6IHJlc29sdmUodmFsKTtcbiAgICAgICAgfSkgIFxuICAgIH0pOyBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcm9taXNpZmllcyBhIGNhbGwgdG8gZDMuanNvbi5cbi8vIEFyZ3M6XG4vLyAgIHVybCAoc3RyaW5nKSBUaGUgdXJsIG9mIHRoZSBqc29uIHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUganNvbiBvYmplY3QgdmFsdWUsIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvclxuZnVuY3Rpb24gZDNqc29uKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZDMuanNvbih1cmwsIGZ1bmN0aW9uKGVycm9yLCB2YWwpe1xuICAgICAgICAgICAgZXJyb3IgPyByZWplY3QoeyBzdGF0dXM6IGVycm9yLnN0YXR1cywgc3RhdHVzVGV4dDogZXJyb3Iuc3RhdHVzVGV4dH0pIDogcmVzb2x2ZSh2YWwpO1xuICAgICAgICB9KSAgXG4gICAgfSk7IFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgYSBkZWVwIGNvcHkgb2Ygb2JqZWN0IG8uIFxuLy8gQXJnczpcbi8vICAgbyAgKG9iamVjdCkgTXVzdCBiZSBhIEpTT04gb2JqZWN0IChubyBjdXJjdWxhciByZWZzLCBubyBmdW5jdGlvbnMpLlxuLy8gUmV0dXJuczpcbi8vICAgYSBkZWVwIGNvcHkgb2Ygb1xuZnVuY3Rpb24gZGVlcGMobykge1xuICAgIGlmICghbykgcmV0dXJuIG87XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG8pKTtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQYXJzZXMgYSBzdHJpbmcgb2YgdGhlIGZvcm0gXCJjaHI6c3RhcnQuLmVuZFwiLlxuLy8gUmV0dXJuczpcbi8vICAgb2JqZWN0IGNvbnRpbmluZyB0aGUgcGFyc2VkIGZpZWxkcy5cbi8vIEV4YW1wbGU6XG4vLyAgIHBhcnNlQ29vcmRzKFwiMTA6MTAwMDAwMDAuLjIwMDAwMDAwXCIpIC0+IHtjaHI6XCIxMFwiLCBzdGFydDoxMDAwMDAwMCwgZW5kOjIwMDAwMDAwfVxuZnVuY3Rpb24gcGFyc2VDb29yZHMgKGNvb3Jkcykge1xuICAgIGxldCByZSA9IC8oW146XSspOihcXGQrKVxcLlxcLihcXGQrKS87XG4gICAgbGV0IG0gPSBjb29yZHMubWF0Y2gocmUpO1xuICAgIHJldHVybiBtID8ge2NocjptWzFdLCBzdGFydDpwYXJzZUludChtWzJdKSwgZW5kOnBhcnNlSW50KG1bM10pfSA6IG51bGw7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRm9ybWF0cyBhIGNocm9tb3NvbWUgbmFtZSwgc3RhcnQgYW5kIGVuZCBwb3NpdGlvbiBhcyBhIHN0cmluZy5cbi8vIEFyZ3MgKGZvcm0gMSk6XG4vLyAgIGNvb3JkcyAob2JqZWN0KSBPZiB0aGUgZm9ybSB7Y2hyOnN0cmluZywgc3RhcnQ6aW50LCBlbmQ6aW50fVxuLy8gQXJncyAoZm9ybSAyKTpcbi8vICAgY2hyIHN0cmluZ1xuLy8gICBzdGFydCBpbnRcbi8vICAgZW5kIGludFxuLy8gUmV0dXJuczpcbi8vICAgICBzdHJpbmdcbi8vIEV4YW1wbGU6XG4vLyAgICAgZm9ybWF0Q29vcmRzKFwiMTBcIiwgMTAwMDAwMDAsIDIwMDAwMDAwKSAtPiBcIjEwOjEwMDAwMDAwLi4yMDAwMDAwMFwiXG5mdW5jdGlvbiBmb3JtYXRDb29yZHMgKGNociwgc3RhcnQsIGVuZCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG5cdGxldCBjID0gY2hyO1xuXHRjaHIgPSBjLmNocjtcblx0c3RhcnQgPSBjLnN0YXJ0O1xuXHRlbmQgPSBjLmVuZDtcbiAgICB9XG4gICAgcmV0dXJuIGAke2Nocn06JHtzdGFydH0uLiR7ZW5kfWBcbn1cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0cnVlIGlmZiB0aGUgdHdvIHJhbmdlcyBvdmVybGFwIGJ5IGF0IGxlYXN0IDEuXG4vLyBFYWNoIHJhbmdlIG11c3QgaGF2ZSBhIGNociwgc3RhcnQsIGFuZCBlbmQuXG4vL1xuZnVuY3Rpb24gb3ZlcmxhcHMgKGEsIGIpIHtcbiAgICByZXR1cm4gYS5jaHIgPT09IGIuY2hyICYmIGEuc3RhcnQgPD0gYi5lbmQgJiYgYS5lbmQgPj0gYi5zdGFydDtcbn1cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gR2l2ZW4gdHdvIHJhbmdlcywgYSBhbmQgYiwgcmV0dXJucyBhIC0gYi5cbi8vIFRoZSByZXN1bHQgaXMgYSBsaXN0IG9mIDAsIDEgb3IgMiBuZXcgcmFuZ2VzLCBkZXBlbmRpbmcgb24gYSBhbmQgYi5cbmZ1bmN0aW9uIHN1YnRyYWN0KGEsIGIpIHtcbiAgICBpZiAoYS5jaHIgIT09IGIuY2hyKSByZXR1cm4gWyBhIF07XG4gICAgbGV0IGFiTGVmdCA9IHsgY2hyOmEuY2hyLCBzdGFydDphLnN0YXJ0LCAgICAgICAgICAgICAgICAgICAgZW5kOk1hdGgubWluKGEuZW5kLCBiLnN0YXJ0LTEpIH07XG4gICAgbGV0IGFiUmlnaHQ9IHsgY2hyOmEuY2hyLCBzdGFydDpNYXRoLm1heChhLnN0YXJ0LCBiLmVuZCsxKSwgZW5kOmEuZW5kIH07XG4gICAgbGV0IGFucyA9IFsgYWJMZWZ0LCBhYlJpZ2h0IF0uZmlsdGVyKCByID0+IHIuc3RhcnQgPD0gci5lbmQgKTtcbiAgICByZXR1cm4gYW5zO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENyZWF0ZXMgYSBsaXN0IG9mIGtleSx2YWx1ZSBwYWlycyBmcm9tIHRoZSBvYmouXG5mdW5jdGlvbiBvYmoybGlzdCAobykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvKS5tYXAoayA9PiBbaywgb1trXV0pICAgIFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdHJ1ZSBpZmYgdGhlIHR3byBsaXN0cyBoYXZlIHRoZSBzYW1lIGNvbnRlbnRzIChiYXNlZCBvbiBpbmRleE9mKS5cbi8vIEJydXRlIGZvcmNlIGFwcHJvYWNoLiBCZSBjYXJlZnVsIHdoZXJlIHlvdSB1c2UgdGhpcy5cbmZ1bmN0aW9uIHNhbWUgKGFsc3QsYmxzdCkge1xuICAgcmV0dXJuIGFsc3QubGVuZ3RoID09PSBibHN0Lmxlbmd0aCAmJiBcbiAgICAgICBhbHN0LnJlZHVjZSgoYWNjLHgpID0+IChhY2MgJiYgYmxzdC5pbmRleE9mKHgpPj0wKSwgdHJ1ZSk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBZGQgYmFzaWMgc2V0IG9wcyB0byBTZXQgcHJvdG90eXBlLlxuLy8gTGlmdGVkIGZyb206IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1NldFxuU2V0LnByb3RvdHlwZS51bmlvbiA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgdW5pb24gPSBuZXcgU2V0KHRoaXMpO1xuICAgIGZvciAodmFyIGVsZW0gb2Ygc2V0Qikge1xuICAgICAgICB1bmlvbi5hZGQoZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiB1bmlvbjtcbn1cblxuU2V0LnByb3RvdHlwZS5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihzZXRCKSB7XG4gICAgdmFyIGludGVyc2VjdGlvbiA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKHZhciBlbGVtIG9mIHNldEIpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzKGVsZW0pKSB7XG4gICAgICAgICAgICBpbnRlcnNlY3Rpb24uYWRkKGVsZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnRlcnNlY3Rpb247XG59XG5cblNldC5wcm90b3R5cGUuZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgZGlmZmVyZW5jZSA9IG5ldyBTZXQodGhpcyk7XG4gICAgZm9yICh2YXIgZWxlbSBvZiBzZXRCKSB7XG4gICAgICAgIGRpZmZlcmVuY2UuZGVsZXRlKGVsZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZGlmZmVyZW5jZTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gZ2V0Q2FyZXRSYW5nZSAoZWx0KSB7XG4gICAgLy8gRklYTUU6IGRvZXMgbm90IHdvcmsgZm9yIElFXG4gICAgcmV0dXJuIFtlbHQuc2VsZWN0aW9uU3RhcnQsIGVsdC5zZWxlY3Rpb25FbmRdO1xufVxuZnVuY3Rpb24gc2V0Q2FyZXRSYW5nZSAoZWx0LCByYW5nZSkge1xuICAgIC8vIEZJWE1FOiBkb2VzIG5vdCB3b3JrIGZvciBJRVxuICAgIGVsdC5zZWxlY3Rpb25TdGFydCA9IHJhbmdlWzBdO1xuICAgIGVsdC5zZWxlY3Rpb25FbmQgICA9IHJhbmdlWzFdO1xufVxuZnVuY3Rpb24gc2V0Q2FyZXRQb3NpdGlvbiAoZWx0LCBwb3MpIHtcbiAgICBzZXRDYXJldFJhbmdlKGVsdCwgW3Bvcyxwb3NdKTtcbn1cbmZ1bmN0aW9uIG1vdmVDYXJldFBvc2l0aW9uIChlbHQsIGRlbHRhKSB7XG4gICAgc2V0Q2FyZXRQb3NpdGlvbihlbHQsIGdldENhcmV0UG9zaXRpb24oZWx0KSArIGRlbHRhKTtcbn1cbmZ1bmN0aW9uIGdldENhcmV0UG9zaXRpb24gKGVsdCkge1xuICAgIGxldCByID0gZ2V0Q2FyZXRSYW5nZShlbHQpO1xuICAgIHJldHVybiByWzFdO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdGhlIHNjcmVlbiBjb29yZGluYXRlcyBvZiBhbiBTVkcgc2hhcGUgKGNpcmNsZSwgcmVjdCwgcG9seWdvbiwgbGluZSlcbi8vIGFmdGVyIGFsbCB0cmFuc2Zvcm1zIGhhdmUgYmVlbiBhcHBsaWVkLlxuLy9cbi8vIEFyZ3M6XG4vLyAgICAgc2hhcGUgKG5vZGUpIFRoZSBTVkcgc2hhcGUuXG4vL1xuLy8gUmV0dXJuczpcbi8vICAgICBUaGUgZm9ybSBvZiB0aGUgcmV0dXJuZWQgdmFsdWUgZGVwZW5kcyBvbiB0aGUgc2hhcGUuXG4vLyAgICAgY2lyY2xlOiAgeyBjeCwgY3ksIHIgfVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBjZW50ZXIgcG9pbnQgYW5kIHRyYW5zZm9ybWVkIHJhZGl1cyAgICAgICAgIFxuLy8gICAgIGxpbmU6XHR7IHgxLCB5MSwgeDIsIHkyIH1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgZW5kcG9pbnRzXG4vLyAgICAgcmVjdDpcdHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9XG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGNvcm5lciBwb2ludCBhbmQgdHJhbnNmb3JtZWQgd2lkdGgraGVpZ2h0LlxuLy8gICAgIHBvbHlnb246IFsge3gseX0sIHt4LHl9ICwgLi4uIF1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgbGlzdCBvZiBwb2ludHNcbi8vXG4vLyBBZGFwdGVkIGZyb206IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY4NTg0NzkvcmVjdGFuZ2xlLWNvb3JkaW5hdGVzLWFmdGVyLXRyYW5zZm9ybT9ycT0xXG4vL1xuZnVuY3Rpb24gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0gKHNoYXBlKSB7XG4gICAgLy9cbiAgICBsZXQgZHNoYXBlID0gZDMuc2VsZWN0KHNoYXBlKTtcbiAgICBsZXQgc3ZnID0gc2hhcGUuY2xvc2VzdChcInN2Z1wiKTtcbiAgICBpZiAoIXN2ZykgdGhyb3cgXCJDb3VsZCBub3QgZmluZCBzdmcgYW5jZXN0b3IuXCI7XG4gICAgbGV0IHN0eXBlID0gc2hhcGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGxldCBtYXRyaXggPSBzaGFwZS5nZXRDVE0oKTtcbiAgICBsZXQgcCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgIGxldCBwMj0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgLy9cbiAgICBzd2l0Y2ggKHN0eXBlKSB7XG4gICAgLy9cbiAgICBjYXNlICdjaXJjbGUnOlxuXHRwLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImN4XCIpKTtcblx0cC55ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJjeVwiKSk7XG5cdHAyLnggPSBwLnggKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiclwiKSk7XG5cdHAyLnkgPSBwLnk7XG5cdHAgICAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRwMiAgID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdC8vIGNhbGMgbmV3IHJhZGl1cyBhcyBkaXN0YW5jZSBiZXR3ZWVuIHRyYW5zZm9ybWVkIHBvaW50c1xuXHRsZXQgZHggPSBNYXRoLmFicyhwLnggLSBwMi54KTtcblx0bGV0IGR5ID0gTWF0aC5hYnMocC55IC0gcDIueSk7XG5cdGxldCByID0gTWF0aC5zcXJ0KGR4KmR4ICsgZHkqZHkpO1xuICAgICAgICByZXR1cm4geyBjeDogcC54LCBjeTogcC55LCByOnIgfTtcbiAgICAvL1xuICAgIGNhc2UgJ3JlY3QnOlxuXHQvLyBGSVhNRTogZG9lcyBub3QgaGFuZGxlIHJvdGF0aW9ucyBjb3JyZWN0bHkuIFRvIGZpeCwgdHJhbnNsYXRlIGNvcm5lciBwb2ludHMgc2VwYXJhdGVseSBhbmQgdGhlblxuXHQvLyBjYWxjdWxhdGUgdGhlIHRyYW5zZm9ybWVkIHdpZHRoIGFuZCBoZWlnaHQuIEFzIGEgY29udmVuaWVuY2UgdG8gdGhlIHVzZXIsIG1pZ2h0IGJlIG5pY2UgdG8gcmV0dXJuXG5cdC8vIHRoZSB0cmFuc2Zvcm1lZCBjb3JuZXIgcG9pbnRzIGFuZCBwb3NzaWJseSB0aGUgZmluYWwgYW5nbGUgb2Ygcm90YXRpb24uXG5cdHAueCAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieFwiKSk7XG5cdHAueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieVwiKSk7XG5cdHAyLnggPSBwLnggKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwid2lkdGhcIikpO1xuXHRwMi55ID0gcC55ICsgcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImhlaWdodFwiKSk7XG5cdC8vXG5cdHAgID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0cDIgPSBwMi5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0Ly9cbiAgICAgICAgcmV0dXJuIHsgeDogcC54LCB5OiBwLnksIHdpZHRoOiBwMi54LXAueCwgaGVpZ2h0OiBwMi55LXAueSB9O1xuICAgIC8vXG4gICAgY2FzZSAncG9seWdvbic6XG4gICAgICAgIGxldCBwdHMgPSBkc2hhcGUuYXR0cihcInBvaW50c1wiKS50cmltKCkuc3BsaXQoLyArLyk7XG5cdHJldHVybiBwdHMubWFwKCBwdCA9PiB7XG5cdCAgICBsZXQgeHkgPSBwdC5zcGxpdChcIixcIik7XG5cdCAgICBwLnggPSBwYXJzZUZsb2F0KHh5WzBdKVxuXHQgICAgcC55ID0gcGFyc2VGbG9hdCh4eVsxXSlcblx0ICAgIHAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHQgICAgcmV0dXJuIHsgeDogcC54LCB5OiBwLnkgfTtcblx0fSk7XG4gICAgLy9cbiAgICBjYXNlICdsaW5lJzpcblx0cC54ICAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieDFcIikpO1xuXHRwLnkgICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ5MVwiKSk7XG5cdHAyLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcIngyXCIpKTtcblx0cDIueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieTJcIikpO1xuXHRwICAgICA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdHAyICAgID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG4gICAgICAgIHJldHVybiB7IHgxOiBwLngsIHkxOiBwLnksIHgyOiBwMi54LCB4MjogcDIueSB9O1xuICAgIC8vXG4gICAgLy8gRklYTUU6IGFkZCBjYXNlICd0ZXh0J1xuICAgIC8vXG5cbiAgICBkZWZhdWx0OlxuXHR0aHJvdyBcIlVuc3VwcG9ydGVkIG5vZGUgdHlwZTogXCIgKyBzdHlwZTtcbiAgICB9XG5cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZW1vdmVzIGR1cGxpY2F0ZXMgZnJvbSBhIGxpc3Qgd2hpbGUgcHJlc2VydmluZyBsaXN0IG9yZGVyLlxuLy8gQXJnczpcbi8vICAgICBsc3QgKGxpc3QpXG4vLyBSZXR1cm5zOlxuLy8gICAgIEEgcHJvY2Vzc2VkIGNvcHkgb2YgbHN0IGluIHdoaWNoIGFueSBkdXBzIGhhdmUgYmVlbiByZW1vdmVkLlxuZnVuY3Rpb24gcmVtb3ZlRHVwcyAobHN0KSB7XG4gICAgbGV0IGxzdDIgPSBbXTtcbiAgICBsZXQgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICBsc3QuZm9yRWFjaCh4ID0+IHtcblx0Ly8gcmVtb3ZlIGR1cHMgd2hpbGUgcHJlc2VydmluZyBvcmRlclxuXHRpZiAoc2Vlbi5oYXMoeCkpIHJldHVybjtcblx0bHN0Mi5wdXNoKHgpO1xuXHRzZWVuLmFkZCh4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gbHN0Mjtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBDbGlwcyBhIHZhbHVlIHRvIGEgcmFuZ2UuXG5mdW5jdGlvbiBjbGlwIChuLCBtaW4sIG1heCkge1xuICAgIHJldHVybiBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgbikpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHtcbiAgICBpbml0T3B0TGlzdCxcbiAgICBkM3RzdixcbiAgICBkM2pzb24sXG4gICAgZGVlcGMsXG4gICAgcGFyc2VDb29yZHMsXG4gICAgZm9ybWF0Q29vcmRzLFxuICAgIG92ZXJsYXBzLFxuICAgIHN1YnRyYWN0LFxuICAgIG9iajJsaXN0LFxuICAgIHNhbWUsXG4gICAgZ2V0Q2FyZXRSYW5nZSxcbiAgICBzZXRDYXJldFJhbmdlLFxuICAgIHNldENhcmV0UG9zaXRpb24sXG4gICAgbW92ZUNhcmV0UG9zaXRpb24sXG4gICAgZ2V0Q2FyZXRQb3NpdGlvbixcbiAgICBjb29yZHNBZnRlclRyYW5zZm9ybSxcbiAgICByZW1vdmVEdXBzLFxuICAgIGNsaXBcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIENvbXBvbmVudCB7XG4gICAgLy8gYXBwIC0gdGhlIG93bmluZyBhcHAgb2JqZWN0XG4gICAgLy8gZWx0IC0gY29udGFpbmVyLiBtYXkgYmUgYSBzdHJpbmcgKHNlbGVjdG9yKSwgYSBET00gbm9kZSwgb3IgYSBkMyBzZWxlY3Rpb24gb2YgMSBub2RlLlxuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuXHR0aGlzLmFwcCA9IGFwcFxuXHRpZiAodHlwZW9mKGVsdCkgPT09IFwic3RyaW5nXCIpXG5cdCAgICAvLyBlbHQgaXMgYSBDU1Mgc2VsZWN0b3Jcblx0ICAgIHRoaXMucm9vdCA9IGQzLnNlbGVjdChlbHQpO1xuXHRlbHNlIGlmICh0eXBlb2YoZWx0LnNlbGVjdEFsbCkgPT09IFwiZnVuY3Rpb25cIilcblx0ICAgIC8vIGVsdCBpcyBhIGQzIHNlbGVjdGlvblxuXHQgICAgdGhpcy5yb290ID0gZWx0O1xuXHRlbHNlIGlmICh0eXBlb2YoZWx0LmdldEVsZW1lbnRzQnlUYWdOYW1lKSA9PT0gXCJmdW5jdGlvblwiKVxuXHQgICAgLy8gZWx0IGlzIGEgRE9NIG5vZGVcblx0ICAgIHRoaXMucm9vdCA9IGQzLnNlbGVjdChlbHQpO1xuICAgIH1cbiAgICBpbml0RG9tICgpIHtcbiAgICAgICAgLy8gb3ZlcnJpZGUgbWVcbiAgICB9XG59XG5cbmV4cG9ydCB7IENvbXBvbmVudCB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQ29tcG9uZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIEZlYXR1cmUge1xuICAgIGNvbnN0cnVjdG9yIChjZmcpIHtcbiAgICAgICAgdGhpcy5jaHIgICAgID0gY2ZnLmNociB8fCBjZmcuY2hyb21vc29tZTtcbiAgICAgICAgdGhpcy5zdGFydCAgID0gY2ZnLnN0YXJ0O1xuICAgICAgICB0aGlzLmVuZCAgICAgPSBjZmcuZW5kO1xuICAgICAgICB0aGlzLnN0cmFuZCAgPSBjZmcuc3RyYW5kO1xuICAgICAgICB0aGlzLnR5cGUgICAgPSBjZmcudHlwZTtcbiAgICAgICAgdGhpcy5iaW90eXBlID0gY2ZnLmJpb3R5cGU7XG4gICAgICAgIHRoaXMubWdwaWQgICA9IGNmZy5tZ3BpZCB8fCBjZmcuaWQ7XG4gICAgICAgIHRoaXMubWdpaWQgICA9IGNmZy5tZ2lpZDtcbiAgICAgICAgdGhpcy5zeW1ib2wgID0gY2ZnLnN5bWJvbDtcbiAgICAgICAgdGhpcy5nZW5vbWUgID0gY2ZnLmdlbm9tZTtcblx0dGhpcy5jb250aWcgID0gcGFyc2VJbnQoY2ZnLmNvbnRpZyk7XG5cdHRoaXMubGFuZSAgICA9IHBhcnNlSW50KGNmZy5sYW5lKTtcbiAgICAgICAgaWYgKHRoaXMubWdpaWQgPT09IFwiLlwiKSB0aGlzLm1naWlkID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuc3ltYm9sID09PSBcIi5cIikgdGhpcy5zeW1ib2wgPSBudWxsO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgSUQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgZ2V0IGNhbm9uaWNhbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1naWlkO1xuICAgIH1cbiAgICBnZXQgaWQgKCkge1xuXHQvLyBGSVhNRTogcmVtb3ZlIHRoaXMgbWV0aG9kXG4gICAgICAgIHJldHVybiB0aGlzLm1naWlkIHx8IHRoaXMubWdwaWQ7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBsYWJlbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bWJvbCB8fCB0aGlzLm1ncGlkO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgbGVuZ3RoICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5kIC0gdGhpcy5zdGFydCArIDE7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldE11bmdlZFR5cGUgKCkge1xuXHRyZXR1cm4gdGhpcy50eXBlID09PSBcImdlbmVcIiA/XG5cdCAgICAodGhpcy5iaW90eXBlID09PSBcInByb3RlaW5fY29kaW5nXCIgfHwgdGhpcy5iaW90eXBlID09PSBcInByb3RlaW4gY29kaW5nIGdlbmVcIikgP1xuXHRcdFwicHJvdGVpbl9jb2RpbmdfZ2VuZVwiXG5cdFx0OlxuXHRcdHRoaXMuYmlvdHlwZS5pbmRleE9mKFwicHNldWRvZ2VuZVwiKSA+PSAwID9cblx0XHQgICAgXCJwc2V1ZG9nZW5lXCJcblx0XHQgICAgOlxuXHRcdCAgICAodGhpcy5iaW90eXBlLmluZGV4T2YoXCJSTkFcIikgPj0gMCB8fCB0aGlzLmJpb3R5cGUuaW5kZXhPZihcImFudGlzZW5zZVwiKSA+PSAwKSA/XG5cdFx0XHRcIm5jUk5BX2dlbmVcIlxuXHRcdFx0OlxuXHRcdFx0dGhpcy5iaW90eXBlLmluZGV4T2YoXCJzZWdtZW50XCIpID49IDAgP1xuXHRcdFx0ICAgIFwiZ2VuZV9zZWdtZW50XCJcblx0XHRcdCAgICA6XG5cdFx0XHQgICAgXCJvdGhlcl9nZW5lXCJcblx0ICAgIDpcblx0ICAgIHRoaXMudHlwZSA9PT0gXCJwc2V1ZG9nZW5lXCIgP1xuXHRcdFwicHNldWRvZ2VuZVwiXG5cdFx0OlxuXHRcdHRoaXMudHlwZS5pbmRleE9mKFwiZ2VuZV9zZWdtZW50XCIpID49IDAgP1xuXHRcdCAgICBcImdlbmVfc2VnbWVudFwiXG5cdFx0ICAgIDpcblx0XHQgICAgdGhpcy50eXBlLmluZGV4T2YoXCJSTkFcIikgPj0gMCA/XG5cdFx0XHRcIm5jUk5BX2dlbmVcIlxuXHRcdFx0OlxuXHRcdFx0dGhpcy50eXBlLmluZGV4T2YoXCJnZW5lXCIpID49IDAgP1xuXHRcdFx0ICAgIFwib3RoZXJfZ2VuZVwiXG5cdFx0XHQgICAgOlxuXHRcdFx0ICAgIFwib3RoZXJfZmVhdHVyZV90eXBlXCI7XG4gICAgfVxufVxuXG5leHBvcnQgeyBGZWF0dXJlIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IFBSRUZJWD1cImFwcHMubWd2LlwiO1xuIFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbnRlcmFjdHMgd2l0aCBsb2NhbFN0b3JhZ2UuXG4vL1xuY2xhc3MgU3RvcmFnZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lLCBzdG9yYWdlKSB7XG5cdHRoaXMubmFtZSA9IFBSRUZJWCtuYW1lO1xuXHR0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuXHR0aGlzLm15RGF0YU9iaiA9IG51bGw7XG5cdC8vXG5cdHRoaXMuX2xvYWQoKTtcbiAgICB9XG4gICAgX2xvYWQgKCkge1xuXHQvLyBsb2FkcyBteURhdGFPYmogZnJvbSBzdG9yYWdlXG4gICAgICAgIGxldCBzID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0odGhpcy5uYW1lKTtcblx0dGhpcy5teURhdGFPYmogPSBzID8gSlNPTi5wYXJzZShzKSA6IHt9O1xuICAgIH1cbiAgICBfc2F2ZSAoKSB7XG5cdC8vIHdyaXRlcyBteURhdGFPYmogdG8gc3RvcmFnZVxuICAgICAgICBsZXQgcyA9IEpTT04uc3RyaW5naWZ5KHRoaXMubXlEYXRhT2JqKTtcblx0dGhpcy5zdG9yYWdlLnNldEl0ZW0odGhpcy5uYW1lLCBzKVxuICAgIH1cbiAgICBnZXQgKG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXlEYXRhT2JqW25dO1xuICAgIH1cbiAgICBwdXQgKG4sIHYpIHtcbiAgICAgICAgdGhpcy5teURhdGFPYmpbbl0gPSB2O1xuXHR0aGlzLl9zYXZlKCk7XG4gICAgfVxufVxuLy9cbmNsYXNzIFNlc3Npb25TdG9yYWdlTWFuYWdlciBleHRlbmRzIFN0b3JhZ2VNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSkge1xuICAgICAgICBzdXBlcihuYW1lLCB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UpO1xuICAgIH1cbn1cbi8vXG5jbGFzcyBMb2NhbFN0b3JhZ2VNYW5hZ2VyIGV4dGVuZHMgU3RvcmFnZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lKSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIHdpbmRvdy5sb2NhbFN0b3JhZ2UpO1xuICAgIH1cbn1cbi8vXG5leHBvcnQgeyBTZXNzaW9uU3RvcmFnZU1hbmFnZXIsIExvY2FsU3RvcmFnZU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1N0b3JhZ2VNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUGFyc2VzIGEgbGlzdCBvcGVyYXRvciBleHByZXNzaW9uLCBlZyBcIihhICsgYikqYyAtIGRcIlxuLy8gUmV0dXJucyBhbiBhYnN0cmFjdCBzeW50YXggdHJlZS5cbi8vICAgICBMZWFmIG5vZGVzID0gbGlzdCBuYW1lcy4gVGhleSBhcmUgc2ltcGxlIHN0cmluZ3MuXG4vLyAgICAgSW50ZXJpb3Igbm9kZXMgPSBvcGVyYXRpb25zLiBUaGV5IGxvb2sgbGlrZToge2xlZnQ6bm9kZSwgb3A6c3RyaW5nLCByaWdodDpub2RlfVxuLy8gXG5jbGFzcyBMaXN0Rm9ybXVsYVBhcnNlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuXHR0aGlzLnJfb3AgICAgPSAvWystXS87XG5cdHRoaXMucl9vcDIgICA9IC9bKl0vO1xuXHR0aGlzLnJfb3BzICAgPSAvWygpKyotXS87XG5cdHRoaXMucl9pZGVudCA9IC9bYS16QS1aX11bYS16QS1aMC05X10qLztcblx0dGhpcy5yX3FzdHIgID0gL1wiW15cIl0qXCIvO1xuXHR0aGlzLnJlID0gbmV3IFJlZ0V4cChgKCR7dGhpcy5yX29wcy5zb3VyY2V9fCR7dGhpcy5yX3FzdHIuc291cmNlfXwke3RoaXMucl9pZGVudC5zb3VyY2V9KWAsICdnJyk7XG5cdC8vdGhpcy5yZSA9IC8oWygpKyotXXxcIlteXCJdK1wifFthLXpBLVpfXVthLXpBLVowLTlfXSopL2dcblx0dGhpcy5faW5pdChcIlwiKTtcbiAgICB9XG4gICAgX2luaXQgKHMpIHtcbiAgICAgICAgdGhpcy5leHByID0gcztcblx0dGhpcy50b2tlbnMgPSB0aGlzLmV4cHIubWF0Y2godGhpcy5yZSkgfHwgW107XG5cdHRoaXMuaSA9IDA7XG4gICAgfVxuICAgIF9wZWVrVG9rZW4oKSB7XG5cdHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmldO1xuICAgIH1cbiAgICBfbmV4dFRva2VuICgpIHtcblx0bGV0IHQ7XG4gICAgICAgIGlmICh0aGlzLmkgPCB0aGlzLnRva2Vucy5sZW5ndGgpIHtcblx0ICAgIHQgPSB0aGlzLnRva2Vuc1t0aGlzLmldO1xuXHQgICAgdGhpcy5pICs9IDE7XG5cdH1cblx0cmV0dXJuIHQ7XG4gICAgfVxuICAgIF9leHByICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl90ZXJtKCk7XG5cdGxldCBvcCA9IHRoaXMuX3BlZWtUb2tlbigpO1xuXHRpZiAob3AgPT09IFwiK1wiIHx8IG9wID09PSBcIi1cIikge1xuXHQgICAgdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBub2RlID0geyBsZWZ0Om5vZGUsIG9wOm9wPT09XCIrXCI/XCJ1bmlvblwiOlwiZGlmZmVyZW5jZVwiLCByaWdodDogdGhpcy5fZXhwcigpIH1cblx0ICAgIHJldHVybiBub2RlO1xuICAgICAgICB9ICAgICAgICAgICAgICAgXG5cdGVsc2UgaWYgKG9wID09PSBcIilcIiB8fCBvcCA9PT0gdW5kZWZpbmVkIHx8IG9wID09PSBudWxsKVxuXHQgICAgcmV0dXJuIG5vZGU7XG5cdGVsc2Vcblx0ICAgIHRoaXMuX2Vycm9yKFwiVU5JT04gb3IgSU5URVJTRUNUSU9OIG9yICkgb3IgTlVMTFwiLCBvcCk7XG4gICAgfVxuICAgIF90ZXJtICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl9mYWN0b3IoKTtcblx0bGV0IG9wID0gdGhpcy5fcGVla1Rva2VuKCk7XG5cdGlmIChvcCA9PT0gXCIqXCIpIHtcblx0ICAgIHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgbm9kZSA9IHsgbGVmdDpub2RlLCBvcDpcImludGVyc2VjdGlvblwiLCByaWdodDogdGhpcy5fZmFjdG9yKCkgfVxuXHR9XG5cdHJldHVybiBub2RlO1xuICAgIH1cbiAgICBfZmFjdG9yICgpIHtcbiAgICAgICAgbGV0IHQgPSB0aGlzLl9uZXh0VG9rZW4oKTtcblx0aWYgKHQgPT09IFwiKFwiKXtcblx0ICAgIGxldCBub2RlID0gdGhpcy5fZXhwcigpO1xuXHQgICAgbGV0IG50ID0gdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBpZiAobnQgIT09IFwiKVwiKSB0aGlzLl9lcnJvcihcIicpJ1wiLCBudCk7XG5cdCAgICByZXR1cm4gbm9kZTtcblx0fVxuXHRlbHNlIGlmICh0ICYmICh0LnN0YXJ0c1dpdGgoJ1wiJykpKSB7XG5cdCAgICByZXR1cm4gdC5zdWJzdHJpbmcoMSwgdC5sZW5ndGgtMSk7XG5cdH1cblx0ZWxzZSBpZiAodCAmJiB0Lm1hdGNoKC9bYS16QS1aX10vKSkge1xuXHQgICAgcmV0dXJuIHQ7XG5cdH1cblx0ZWxzZVxuXHQgICAgdGhpcy5fZXJyb3IoXCJFWFBSIG9yIElERU5UXCIsIHR8fFwiTlVMTFwiKTtcblx0cmV0dXJuIHQ7XG5cdCAgICBcbiAgICB9XG4gICAgX2Vycm9yIChleHBlY3RlZCwgc2F3KSB7XG4gICAgICAgIHRocm93IGBQYXJzZSBlcnJvcjogZXhwZWN0ZWQgJHtleHBlY3RlZH0gYnV0IHNhdyAke3Nhd30uYDtcbiAgICB9XG4gICAgLy8gUGFyc2VzIHRoZSBzdHJpbmcgYW5kIHJldHVybnMgdGhlIGFic3RyYWN0IHN5bnRheCB0cmVlLlxuICAgIC8vIFRocm93cyBhbiBleGNlcHRpb24gaWYgdGhlcmUgaXMgYSBzeW50YXggZXJyb3IuXG4gICAgcGFyc2UgKHMpIHtcblx0dGhpcy5faW5pdChzKTtcblx0cmV0dXJuIHRoaXMuX2V4cHIoKTtcbiAgICB9XG4gICAgLy8gcmV0dXJucyB0cnVlIGlmZiBzdHJpbmcgaXMgc3ludGFjdGljYWxseSB2YWxpZFxuICAgIGlzVmFsaWQgKHMpIHtcbiAgICAgICAgdHJ5IHtcblx0ICAgIHRoaXMucGFyc2Uocyk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fVxuXHRjYXRjaCAoZSkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEZvcm11bGFQYXJzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIFNWR1ZpZXcgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCwgbWFyZ2lucywgcm90YXRpb24sIHRyYW5zbGF0aW9uKSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0KTtcbiAgICAgICAgdGhpcy5zdmcgPSB0aGlzLnJvb3Quc2VsZWN0KFwic3ZnXCIpO1xuICAgICAgICB0aGlzLnN2Z01haW4gPSB0aGlzLnN2Z1xuICAgICAgICAgICAgLmFwcGVuZChcImdcIikgICAgLy8gdGhlIG1hcmdpbi10cmFuc2xhdGVkIGdyb3VwXG4gICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVx0ICAvLyBtYWluIGdyb3VwIGZvciB0aGUgZHJhd2luZ1xuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJzdmdtYWluXCIpO1xuXHR0aGlzLm91dGVyV2lkdGggPSAxMDA7XG5cdHRoaXMud2lkdGggPSAxMDA7XG5cdHRoaXMub3V0ZXJIZWlnaHQgPSAxMDA7XG5cdHRoaXMuaGVpZ2h0ID0gMTAwO1xuXHR0aGlzLm1hcmdpbnMgPSB7dG9wOiAxOCwgcmlnaHQ6IDEyLCBib3R0b206IDEyLCBsZWZ0OiAxMn07XG5cdHRoaXMucm90YXRpb24gPSAwO1xuXHR0aGlzLnRyYW5zbGF0aW9uID0gWzAsMF07XG5cdC8vXG4gICAgICAgIHRoaXMuc2V0R2VvbSh7d2lkdGgsIGhlaWdodCwgbWFyZ2lucywgcm90YXRpb24sIHRyYW5zbGF0aW9ufSk7XG4gICAgfVxuICAgIHNldEdlb20gKGNmZykge1xuICAgICAgICB0aGlzLm91dGVyV2lkdGggID0gY2ZnLndpZHRoICAgICAgIHx8IHRoaXMub3V0ZXJXaWR0aDtcbiAgICAgICAgdGhpcy5vdXRlckhlaWdodCA9IGNmZy5oZWlnaHQgICAgICB8fCB0aGlzLm91dGVySGVpZ2h0O1xuICAgICAgICB0aGlzLm1hcmdpbnMgICAgID0gY2ZnLm1hcmdpbnMgICAgIHx8IHRoaXMubWFyZ2lucztcblx0dGhpcy5yb3RhdGlvbiAgICA9IHR5cGVvZihjZmcucm90YXRpb24pID09PSBcIm51bWJlclwiID8gY2ZnLnJvdGF0aW9uIDogdGhpcy5yb3RhdGlvbjtcblx0dGhpcy50cmFuc2xhdGlvbiA9IGNmZy50cmFuc2xhdGlvbiB8fCB0aGlzLnRyYW5zbGF0aW9uO1xuICAgICAgICAvL1xuICAgICAgICB0aGlzLndpZHRoICA9IHRoaXMub3V0ZXJXaWR0aCAgLSB0aGlzLm1hcmdpbnMubGVmdCAtIHRoaXMubWFyZ2lucy5yaWdodDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLm91dGVySGVpZ2h0IC0gdGhpcy5tYXJnaW5zLnRvcCAgLSB0aGlzLm1hcmdpbnMuYm90dG9tO1xuICAgICAgICAvL1xuICAgICAgICB0aGlzLnN2Zy5hdHRyKFwid2lkdGhcIiwgdGhpcy5vdXRlcldpZHRoKVxuICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLm91dGVySGVpZ2h0KVxuICAgICAgICAgICAgLnNlbGVjdCgnZ1tuYW1lPVwic3ZnbWFpblwiXScpXG4gICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHt0aGlzLm1hcmdpbnMubGVmdH0sJHt0aGlzLm1hcmdpbnMudG9wfSkgcm90YXRlKCR7dGhpcy5yb3RhdGlvbn0pIHRyYW5zbGF0ZSgke3RoaXMudHJhbnNsYXRpb25bMF19LCR7dGhpcy50cmFuc2xhdGlvblsxXX0pYCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzZXRNYXJnaW5zKCB0bSwgcm0sIGJtLCBsbSApIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0ICAgIHJtID0gYm0gPSBsbSA9IHRtO1xuXHR9XG5cdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcblx0ICAgIGJtID0gdG07XG5cdCAgICBsbSA9IHJtO1xuXHR9XG5cdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDQpXG5cdCAgICB0aHJvdyBcIkJhZCBhcmd1bWVudHMuXCI7XG4gICAgICAgIC8vXG5cdHRoaXMuc2V0R2VvbSh7dG9wOiB0bSwgcmlnaHQ6IHJtLCBib3R0b206IGJtLCBsZWZ0OiBsbX0pO1xuXHQvL1xuXHRyZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcm90YXRlIChkZWcpIHtcbiAgICAgICAgdGhpcy5zZXRHZW9tKHtyb3RhdGlvbjpkZWd9KTtcblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRyYW5zbGF0ZSAoZHgsIGR5KSB7XG4gICAgICAgIHRoaXMuc2V0R2VvbSh7dHJhbnNsYXRpb246W2R4LGR5XX0pO1xuXHRyZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy8gQXJnczpcbiAgICAvLyAgIHRoZSB3aW5kb3cgd2lkdGhcbiAgICBmaXRUb1dpZHRoICh3aWR0aCkge1xuICAgICAgICBsZXQgciA9IHRoaXMuc3ZnWzBdWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLnNldEdlb20oe3dpZHRoOiB3aWR0aCAtIHIueH0pXG5cdHJldHVybiB0aGlzO1xuICAgIH1cblxufSAvLyBlbmQgY2xhc3MgU1ZHVmlld1xuXG5leHBvcnQgeyBTVkdWaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9TVkdWaWV3LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IE1HVkFwcCB9IGZyb20gJy4vTUdWQXBwJztcbmltcG9ydCB7IHJlbW92ZUR1cHMgfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vXG4vLyBwcXN0cmluZyA9IFBhcnNlIHFzdHJpbmcuIFBhcnNlcyB0aGUgcGFyYW1ldGVyIHBvcnRpb24gb2YgdGhlIFVSTC5cbi8vXG5mdW5jdGlvbiBwcXN0cmluZyAocXN0cmluZykge1xuICAgIC8vXG4gICAgbGV0IGNmZyA9IHt9O1xuXG4gICAgLy8gRklYTUU6IFVSTFNlYXJjaFBhcmFtcyBBUEkgaXMgbm90IHN1cHBvcnRlZCBpbiBhbGwgYnJvd3NlcnMuXG4gICAgLy8gT0sgZm9yIGRldmVsb3BtZW50IGJ1dCBuZWVkIGEgZmFsbGJhY2sgZXZlbnR1YWxseS5cbiAgICBsZXQgcHJtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocXN0cmluZyk7XG4gICAgbGV0IGdlbm9tZXMgPSBbXTtcblxuICAgIC8vIC0tLS0tIGdlbm9tZXMgLS0tLS0tLS0tLS0tXG4gICAgbGV0IHBnZW5vbWVzID0gcHJtcy5nZXQoXCJnZW5vbWVzXCIpIHx8IFwiXCI7XG4gICAgLy8gRm9yIG5vdywgYWxsb3cgXCJjb21wc1wiIGFzIHN5bm9ueW0gZm9yIFwiZ2Vub21lc1wiLiBFdmVudHVhbGx5LCBkb24ndCBzdXBwb3J0IFwiY29tcHNcIi5cbiAgICBwZ2Vub21lcyA9IChwZ2Vub21lcyArICBcIiBcIiArIChwcm1zLmdldChcImNvbXBzXCIpIHx8IFwiXCIpKTtcbiAgICAvL1xuICAgIHBnZW5vbWVzID0gcmVtb3ZlRHVwcyhwZ2Vub21lcy50cmltKCkuc3BsaXQoLyArLykpO1xuICAgIHBnZW5vbWVzLmxlbmd0aCA+IDAgJiYgKGNmZy5nZW5vbWVzID0gcGdlbm9tZXMpO1xuXG4gICAgLy8gLS0tLS0gcmVmIGdlbm9tZSAtLS0tLS0tLS0tLS1cbiAgICBsZXQgcmVmID0gcHJtcy5nZXQoXCJyZWZcIik7XG4gICAgcmVmICYmIChjZmcucmVmID0gcmVmKTtcblxuICAgIC8vIC0tLS0tIGhpZ2hsaWdodCBJRHMgLS0tLS0tLS0tLS0tLS1cbiAgICBsZXQgaGxzID0gbmV3IFNldCgpO1xuICAgIGxldCBobHMwID0gcHJtcy5nZXQoXCJoaWdobGlnaHRcIik7XG4gICAgaWYgKGhsczApIHtcblx0aGxzMCA9IGhsczAucmVwbGFjZSgvWyAsXSsvZywgJyAnKS5zcGxpdCgnICcpLmZpbHRlcih4PT54KTtcblx0aGxzMC5sZW5ndGggPiAwICYmIChjZmcuaGlnaGxpZ2h0ID0gaGxzMCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0gY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIGxldCBjaHIgICA9IHBybXMuZ2V0KFwiY2hyXCIpO1xuICAgIGxldCBzdGFydCA9IHBybXMuZ2V0KFwic3RhcnRcIik7XG4gICAgbGV0IGVuZCAgID0gcHJtcy5nZXQoXCJlbmRcIik7XG4gICAgY2hyICAgJiYgKGNmZy5jaHIgPSBjaHIpO1xuICAgIHN0YXJ0ICYmIChjZmcuc3RhcnQgPSBwYXJzZUludChzdGFydCkpO1xuICAgIGVuZCAgICYmIChjZmcuZW5kID0gcGFyc2VJbnQoZW5kKSk7XG4gICAgLy9cbiAgICBsZXQgbGFuZG1hcmsgPSBwcm1zLmdldChcImxhbmRtYXJrXCIpO1xuICAgIGxldCBmbGFuayAgICA9IHBybXMuZ2V0KFwiZmxhbmtcIik7XG4gICAgbGV0IGxlbmd0aCAgID0gcHJtcy5nZXQoXCJsZW5ndGhcIik7XG4gICAgbGV0IGRlbHRhICAgID0gcHJtcy5nZXQoXCJkZWx0YVwiKTtcbiAgICBsYW5kbWFyayAmJiAoY2ZnLmxhbmRtYXJrID0gbGFuZG1hcmspO1xuICAgIGZsYW5rICAgICYmIChjZmcuZmxhbmsgPSBwYXJzZUludChmbGFuaykpO1xuICAgIGxlbmd0aCAgICYmIChjZmcubGVuZ3RoID0gcGFyc2VJbnQobGVuZ3RoKSk7XG4gICAgZGVsdGEgICAgJiYgKGNmZy5kZWx0YSA9IHBhcnNlSW50KGRlbHRhKSk7XG4gICAgLy9cbiAgICAvLyAtLS0tLSBkcmF3aW5nIG1vZGUgLS0tLS0tLS0tLS0tLVxuICAgIGxldCBkbW9kZSA9IHBybXMuZ2V0KFwiZG1vZGVcIik7XG4gICAgZG1vZGUgJiYgKGNmZy5kbW9kZSA9IGRtb2RlKTtcbiAgICAvL1xuICAgIHJldHVybiBjZmc7XG59XG5cblxuLy8gVGhlIG1haW4gcHJvZ3JhbSwgd2hlcmVpbiB0aGUgYXBwIGlzIGNyZWF0ZWQgYW5kIHdpcmVkIHRvIHRoZSBicm93c2VyLiBcbi8vXG5mdW5jdGlvbiBfX21haW5fXyAoc2VsZWN0b3IpIHtcbiAgICAvLyBCZWhvbGQsIHRoZSBNR1YgYXBwbGljYXRpb24gb2JqZWN0Li4uXG4gICAgbGV0IG1ndiA9IG51bGw7XG5cbiAgICAvLyBDYWxsYmFjayB0byBwYXNzIGludG8gdGhlIGFwcCB0byByZWdpc3RlciBjaGFuZ2VzIGluIGNvbnRleHQuXG4gICAgLy8gVXNlcyB0aGUgY3VycmVudCBhcHAgY29udGV4dCB0byBzZXQgdGhlIGhhc2ggcGFydCBvZiB0aGVcbiAgICAvLyBicm93c2VyJ3MgbG9jYXRpb24uIFRoaXMgYWxzbyByZWdpc3RlcnMgdGhlIGNoYW5nZSBpbiBcbiAgICAvLyB0aGUgYnJvd3NlciBoaXN0b3J5LlxuICAgIGZ1bmN0aW9uIHNldEhhc2ggKCkge1xuXHRsZXQgbmV3SGFzaCA9IG1ndi5nZXRQYXJhbVN0cmluZygpO1xuXHRpZiAoJyMnK25ld0hhc2ggPT09IHdpbmRvdy5sb2NhdGlvbi5oYXNoKVxuXHQgICAgcmV0dXJuO1xuXHQvLyB0ZW1wb3JhcmlseSBkaXNhYmxlIHBvcHN0YXRlIGhhbmRsZXJcblx0bGV0IGYgPSB3aW5kb3cub25wb3BzdGF0ZTtcblx0d2luZG93Lm9ucG9wc3RhdGUgPSBudWxsO1xuXHQvLyBub3cgc2V0IHRoZSBoYXNoXG5cdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gbmV3SGFzaDtcblx0Ly8gcmUtZW5hYmxlXG5cdHdpbmRvdy5vbnBvcHN0YXRlID0gZjtcbiAgICB9XG4gICAgLy8gSGFuZGxlciBjYWxsZWQgd2hlbiB1c2VyIGNsaWNrcyB0aGUgYnJvd3NlcidzIGJhY2sgb3IgZm9yd2FyZCBidXR0b25zLlxuICAgIC8vIFNldHMgdGhlIGFwcCdzIGNvbnRleHQgYmFzZWQgb24gdGhlIGhhc2ggcGFydCBvZiB0aGUgYnJvd3NlcidzXG4gICAgLy8gbG9jYXRpb24uXG4gICAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbihldmVudCkge1xuXHRsZXQgY2ZnID0gcHFzdHJpbmcoZG9jdW1lbnQubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuXHRtZ3Yuc2V0Q29udGV4dChjZmcsIHRydWUpO1xuICAgIH07XG4gICAgLy8gZ2V0IGluaXRpYWwgc2V0IG9mIGNvbnRleHQgcGFyYW1zIFxuICAgIGxldCBxc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpO1xuICAgIGxldCBjZmcgPSBwcXN0cmluZyhxc3RyaW5nKTtcbiAgICBjZmcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjZmcub25jb250ZXh0Y2hhbmdlID0gc2V0SGFzaDtcblxuICAgIC8vIGNyZWF0ZSB0aGUgYXBwXG4gICAgd2luZG93Lm1ndiA9IG1ndiA9IG5ldyBNR1ZBcHAoc2VsZWN0b3IsIGNmZyk7XG4gICAgXG4gICAgLy8gaGFuZGxlIHJlc2l6ZSBldmVudHNcbiAgICB3aW5kb3cub25yZXNpemUgPSAoKSA9PiB7bWd2LnJlc2l6ZSgpO21ndi5zZXRDb250ZXh0KHt9KTt9XG59XG5cblxuX19tYWluX18oXCIjbWd2XCIpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvdmlld2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHBhcnNlQ29vcmRzLCBmb3JtYXRDb29yZHMsIGQzdHN2LCBpbml0T3B0TGlzdCwgc2FtZSwgY2xpcCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgR2Vub21lIH0gICAgICAgICAgZnJvbSAnLi9HZW5vbWUnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gICAgICAgZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgRmVhdHVyZU1hbmFnZXIgfSAgZnJvbSAnLi9GZWF0dXJlTWFuYWdlcic7XG5pbXBvcnQgeyBRdWVyeU1hbmFnZXIgfSAgICBmcm9tICcuL1F1ZXJ5TWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0TWFuYWdlciB9ICAgICBmcm9tICcuL0xpc3RNYW5hZ2VyJztcbmltcG9ydCB7IExpc3RFZGl0b3IgfSAgICAgIGZyb20gJy4vTGlzdEVkaXRvcic7XG5pbXBvcnQgeyBVc2VyUHJlZnNNYW5hZ2VyIH0gZnJvbSAnLi9Vc2VyUHJlZnNNYW5hZ2VyJztcbmltcG9ydCB7IEZhY2V0TWFuYWdlciB9ICAgIGZyb20gJy4vRmFjZXRNYW5hZ2VyJztcbmltcG9ydCB7IEJUTWFuYWdlciB9ICAgICAgIGZyb20gJy4vQlRNYW5hZ2VyJztcbmltcG9ydCB7IEdlbm9tZVZpZXcgfSAgICAgIGZyb20gJy4vR2Vub21lVmlldyc7XG5pbXBvcnQgeyBGZWF0dXJlRGV0YWlscyB9ICBmcm9tICcuL0ZlYXR1cmVEZXRhaWxzJztcbmltcG9ydCB7IFpvb21WaWV3IH0gICAgICAgIGZyb20gJy4vWm9vbVZpZXcnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIE1HVkFwcCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHNlbGVjdG9yLCBjZmcpIHtcblx0c3VwZXIobnVsbCwgc2VsZWN0b3IpO1xuXHR0aGlzLmFwcCA9IHRoaXM7XG5cdC8vXG5cdHRoaXMuaW5pdGlhbENmZyA9IGNmZztcblx0Ly9cblx0dGhpcy5jb250ZXh0Q2hhbmdlZCA9IChjZmcub25jb250ZXh0Y2hhbmdlIHx8IGZ1bmN0aW9uKCl7fSk7XG5cdC8vXG5cdHRoaXMubmFtZTJnZW5vbWUgPSB7fTsgIC8vIG1hcCBmcm9tIGdlbm9tZSBuYW1lIC0+IGdlbm9tZSBkYXRhIG9ialxuXHR0aGlzLmxhYmVsMmdlbm9tZSA9IHt9OyAvLyBtYXAgZnJvbSBnZW5vbWUgbGFiZWwgLT4gZ2Vub21lIGRhdGEgb2JqXG5cdHRoaXMubmwyZ2Vub21lID0ge307ICAgIC8vIGNvbWJpbmVzIGluZGV4ZXNcblx0Ly9cblx0dGhpcy5hbGxHZW5vbWVzID0gW107ICAgLy8gbGlzdCBvZiBhbGwgYXZhaWxhYmxlIGdlbm9tZXNcblx0dGhpcy5yR2Vub21lID0gbnVsbDsgICAgLy8gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZVxuXHR0aGlzLmNHZW5vbWVzID0gW107ICAgICAvLyBjdXJyZW50IGNvbXBhcmlzb24gZ2Vub21lcyAockdlbm9tZSBpcyAqbm90KiBpbmNsdWRlZCkuXG5cdHRoaXMudkdlbm9tZXMgPSBbXTtcdC8vIGxpc3Qgb2YgYWxsIGN1cnJlbnR5IHZpZXdlZCBnZW5vbWVzIChyZWYrY29tcHMpIGluIFktb3JkZXIuXG5cdC8vXG5cdHRoaXMuZHVyID0gMjUwOyAgICAgICAgIC8vIGFuaW1hdGlvbiBkdXJhdGlvbiwgaW4gbXNcblx0dGhpcy5kZWZhdWx0Wm9vbSA9IDI7XHQvLyBtdWx0aXBsaWVyIG9mIGN1cnJlbnQgcmFuZ2Ugd2lkdGguIE11c3QgYmUgPj0gMS4gMSA9PSBubyB6b29tLlxuXHRcdFx0XHQvLyAoem9vbWluZyBpbiB1c2VzIDEvdGhpcyBhbW91bnQpXG5cdHRoaXMuZGVmYXVsdFBhbiAgPSAwLjE1Oy8vIGZyYWN0aW9uIG9mIGN1cnJlbnQgcmFuZ2Ugd2lkdGhcblxuXHQvLyBDb29yZGluYXRlcyBtYXkgYmUgc3BlY2lmaWVkIGluIG9uZSBvZiB0d28gd2F5czogbWFwcGVkIG9yIGxhbmRtYXJrLiBcblx0Ly8gTWFwcGVkIGNvb3JkaW5hdGVzIGFyZSBzcGVjaWZpZWQgYXMgY2hyb21vc29tZStzdGFydCtlbmQuIFRoaXMgY29vcmRpbmF0ZSByYW5nZSBpcyBkZWZpbmVkIHJlbGF0aXZlIHRvIFxuXHQvLyB0aGUgY3VycmVudCByZWZlcmVuY2UgZ2Vub21lLCBhbmQgaXMgbWFwcGVkIHRvIHRoZSBjb3JyZXNwb25kaW5nIHJhbmdlKHMpIGluIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUuXG5cdC8vIExhbmRtYXJrIGNvb3JkaW5hdGVzIGFyZSBzcGVjaWZpZWQgYXMgbGFuZG1hcmsrW2ZsYW5rfHdpZHRoXStkZWx0YS4gVGhlIGxhbmRtYXJrIGlzIGxvb2tlZCB1cCBpbiBlYWNoIFxuXHQvLyBnZW5vbWUuIEl0cyBjb29yZGluYXRlcywgY29tYmluZWQgd2l0aCBmbGFua3xsZW5ndGggYW5kIGRlbHRhLCBkZXRlcm1pbmUgdGhlIGFic29sdXRlIGNvb3JkaW5hdGUgcmFuZ2Vcblx0Ly8gaW4gdGhhdCBnZW5vbWUuIElmIHRoZSBsYW5kbWFyayBkb2VzIG5vdCBleGlzdCBpbiBhIGdpdmVuIGdlbm9tZSwgdGhlbiBtYXBwZWQgY29vcmRpbmF0ZSBhcmUgdXNlZC5cblx0Ly8gXG5cdHRoaXMuY21vZGUgPSAnbWFwcGVkJyAvLyAnbWFwcGVkJyBvciAnbGFuZG1hcmsnXG5cdHRoaXMuY29vcmRzID0geyBjaHI6ICcxJywgc3RhcnQ6IDEwMDAwMDAsIGVuZDogMTAwMDAwMDAgfTsgIC8vIG1hcHBlZFxuXHR0aGlzLmxjb29yZHMgPSB7IGxhbmRtYXJrOiAnUGF4NicsIGZsYW5rOiA1MDAwMDAsIGRlbHRhOjAgfTsvLyBsYW5kbWFya1xuXG5cdHRoaXMuaW5pdERvbSgpO1xuXG5cdC8vXG5cdC8vXG5cdHRoaXMuZ2Vub21lVmlldyA9IG5ldyBHZW5vbWVWaWV3KHRoaXMsICcjZ2Vub21lVmlldycsIDgwMCwgMjUwKTtcblx0dGhpcy56b29tVmlldyAgID0gbmV3IFpvb21WaWV3ICAodGhpcywgJyN6b29tVmlldycsIDgwMCwgMjUwLCB0aGlzLmNvb3Jkcyk7XG5cdHRoaXMucmVzaXplKCk7XG4gICAgICAgIC8vXG5cdHRoaXMuZmVhdHVyZURldGFpbHMgPSBuZXcgRmVhdHVyZURldGFpbHModGhpcywgJyNmZWF0dXJlRGV0YWlscycpO1xuXG5cdC8vIENhdGVnb3JpY2FsIGNvbG9yIHNjYWxlIGZvciBmZWF0dXJlIHR5cGVzXG5cdHRoaXMuY3NjYWxlID0gZDMuc2NhbGUuY2F0ZWdvcnkxMCgpLmRvbWFpbihbXG5cdCAgICAncHJvdGVpbl9jb2RpbmdfZ2VuZScsXG5cdCAgICAncHNldWRvZ2VuZScsXG5cdCAgICAnbmNSTkFfZ2VuZScsXG5cdCAgICAnZ2VuZV9zZWdtZW50Jyxcblx0ICAgICdvdGhlcl9nZW5lJyxcblx0ICAgICdvdGhlcl9mZWF0dXJlX3R5cGUnXG5cdF0pO1xuXHQvL1xuXHQvL1xuXHR0aGlzLmxpc3RNYW5hZ2VyICAgID0gbmV3IExpc3RNYW5hZ2VyKHRoaXMsIFwiI215bGlzdHNcIik7XG5cdHRoaXMubGlzdE1hbmFnZXIudXBkYXRlKCk7XG5cdC8vXG5cdHRoaXMubGlzdEVkaXRvciA9IG5ldyBMaXN0RWRpdG9yKHRoaXMsICcjbGlzdGVkaXRvcicpO1xuXHQvL1xuXHR0aGlzLnRyYW5zbGF0b3IgICAgID0gbmV3IEJUTWFuYWdlcih0aGlzKTtcblx0dGhpcy5mZWF0dXJlTWFuYWdlciA9IG5ldyBGZWF0dXJlTWFuYWdlcih0aGlzKTtcblx0Ly9cblx0bGV0IHNlYXJjaFR5cGVzID0gW3tcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5RnVuY3Rpb25cIixcblx0ICAgIGxhYmVsOiBcIi4uLmJ5IGNlbGx1bGFyIGZ1bmN0aW9uXCIsXG5cdCAgICB0ZW1wbGF0ZTogXCJcIixcblx0ICAgIHBsYWNlaG9sZGVyOiBcIkdlbmUgT250b2xvZ3kgKEdPKSB0ZXJtcy9JRHNcIlxuXHR9LHtcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5UGhlbm90eXBlXCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBtdXRhbnQgcGhlbm90eXBlXCIsXG5cdCAgICB0ZW1wbGF0ZTogXCJcIixcblx0ICAgIHBsYWNlaG9sZGVyOiBcIk1hbW1hbGlhbiBQaGVub3R5cGUgKE1QKSB0ZXJtcy9JRHNcIlxuXHR9LHtcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5RGlzZWFzZVwiLFxuXHQgICAgbGFiZWw6IFwiLi4uYnkgZGlzZWFzZSBpbXBsaWNhdGlvblwiLFxuXHQgICAgdGVtcGxhdGU6IFwiXCIsXG5cdCAgICBwbGFjZWhvbGRlcjogXCJEaXNlYXNlIE9udG9sb2d5IChETykgdGVybXMvSURzXCJcblx0fSx7XG5cdCAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeUlkXCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBub21lbmNsYXR1cmVcIixcblx0ICAgIHRlbXBsYXRlOiBcIlwiLFxuXHQgICAgcGxhY2Vob2xkZXI6IFwiTUdJIG5hbWVzLCBzeW5vbnltcywgZXRjLlwiXG5cdH1dO1xuXHR0aGlzLnF1ZXJ5TWFuYWdlciA9IG5ldyBRdWVyeU1hbmFnZXIodGhpcywgXCIjZmluZEdlbmVzQm94XCIsIHNlYXJjaFR5cGVzKTtcblx0Ly9cblx0dGhpcy51c2VyUHJlZnNNYW5hZ2VyID0gbmV3IFVzZXJQcmVmc01hbmFnZXIoKTtcblx0XG5cdC8vXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRmFjZXRzXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0dGhpcy5mYWNldE1hbmFnZXIgPSBuZXcgRmFjZXRNYW5hZ2VyKHRoaXMpO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0Ly8gRmVhdHVyZS10eXBlIGZhY2V0XG5cdGxldCBmdEZhY2V0ICA9IHRoaXMuZmFjZXRNYW5hZ2VyLmFkZEZhY2V0KFwiRmVhdHVyZVR5cGVcIiwgZiA9PiBmLmdldE11bmdlZFR5cGUoKSk7XG5cdHRoaXMuaW5pdEZlYXRUeXBlQ29udHJvbChmdEZhY2V0KTtcblxuXHQvLyBIYXMtTUdJLWlkIGZhY2V0XG5cdGxldCBtZ2lGYWNldCA9IHRoaXMuZmFjZXRNYW5hZ2VyLmFkZEZhY2V0KFwiSGFzTWdpSWRcIiwgICAgZiA9PiBmLm1naWlkICA/IFwieWVzXCIgOiBcIm5vXCIgKTtcblx0ZDMuc2VsZWN0QWxsKCdpbnB1dFtuYW1lPVwibWdpRmFjZXRcIl0nKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpe1xuXHQgICAgbWdpRmFjZXQuc2V0VmFsdWVzKHRoaXMudmFsdWUgPT09IFwiXCIgPyBbXSA6IFt0aGlzLnZhbHVlXSk7XG5cdCAgICBzZWxmLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9KTtcblxuXHQvLyBJcy1oaWdobGlnaHRlZCBmYWNldFxuXHRsZXQgaGlGYWNldCA9IHRoaXMuZmFjZXRNYW5hZ2VyLmFkZEZhY2V0KFwiSXNIaVwiLCBmID0+IHtcblx0ICAgIGxldCBpc2hpID0gdGhpcy56b29tVmlldy5oaUZlYXRzW2YubWdpaWRdIHx8IHRoaXMuem9vbVZpZXcuaGlGZWF0c1tmLm1ncGlkXTtcblx0ICAgIHJldHVybiBpc2hpID8gXCJ5ZXNcIiA6IFwibm9cIjtcblx0fSk7XG5cdGQzLnNlbGVjdEFsbCgnaW5wdXRbbmFtZT1cImhpRmFjZXRcIl0nKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpe1xuXHQgICAgaGlGYWNldC5zZXRWYWx1ZXModGhpcy52YWx1ZSA9PT0gXCJcIiA/IFtdIDogW3RoaXMudmFsdWVdKTtcblx0ICAgIHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXG5cblx0Ly9cblx0dGhpcy5zZXRVSUZyb21QcmVmcygpO1xuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQvLyBUaGluZ3MgYXJlIGFsbCB3aXJlZCB1cC4gTm93IGxldCdzIGdldCBzb21lIGRhdGEuXG5cdC8vIFN0YXJ0IHdpdGggdGhlIGZpbGUgb2YgYWxsIHRoZSBnZW5vbWVzLlxuXHRkM3RzdihcIi4vZGF0YS9nZW5vbWVMaXN0LnRzdlwiKS50aGVuKGRhdGEgPT4ge1xuXHQgICAgLy8gY3JlYXRlIEdlbm9tZSBvYmplY3RzIGZyb20gdGhlIHJhdyBkYXRhLlxuXHQgICAgdGhpcy5hbGxHZW5vbWVzICAgPSBkYXRhLm1hcChnID0+IG5ldyBHZW5vbWUoZykpO1xuXHQgICAgdGhpcy5hbGxHZW5vbWVzLnNvcnQoIChhLGIpID0+IHtcblx0ICAgICAgICByZXR1cm4gYS5sYWJlbCA8IGIubGFiZWwgPyAtMSA6IGEubGFiZWwgPiBiLmxhYmVsID8gKzEgOiAwO1xuXHQgICAgfSk7XG5cdCAgICAvL1xuXHQgICAgLy8gYnVpbGQgYSBuYW1lLT5HZW5vbWUgaW5kZXhcblx0ICAgIHRoaXMubmwyZ2Vub21lID0ge307IC8vIGFsc28gYnVpbGQgdGhlIGNvbWJpbmVkIGxpc3QgYXQgdGhlIHNhbWUgdGltZS4uLlxuXHQgICAgdGhpcy5uYW1lMmdlbm9tZSAgPSB0aGlzLmFsbEdlbm9tZXNcblx0ICAgICAgICAucmVkdWNlKChhY2MsZykgPT4geyB0aGlzLm5sMmdlbm9tZVtnLm5hbWVdID0gYWNjW2cubmFtZV0gPSBnOyByZXR1cm4gYWNjOyB9LCB7fSk7XG5cdCAgICAvLyBidWlsZCBhIGxhYmVsLT5HZW5vbWUgaW5kZXhcblx0ICAgIHRoaXMubGFiZWwyZ2Vub21lID0gdGhpcy5hbGxHZW5vbWVzXG5cdCAgICAgICAgLnJlZHVjZSgoYWNjLGcpID0+IHsgdGhpcy5ubDJnZW5vbWVbZy5sYWJlbF0gPSBhY2NbZy5sYWJlbF0gPSBnOyByZXR1cm4gYWNjOyB9LCB7fSk7XG5cblx0ICAgIC8vIE5vdyBwcmVsb2FkIGFsbCB0aGUgY2hyb21vc29tZSBmaWxlcyBmb3IgYWxsIHRoZSBnZW5vbWVzXG5cdCAgICBsZXQgY2RwcyA9IHRoaXMuYWxsR2Vub21lcy5tYXAoZyA9PiBkM3RzdihgLi9kYXRhL2dlbm9tZWRhdGEvJHtnLm5hbWV9LWNocm9tb3NvbWVzLnRzdmApKTtcblx0ICAgIHJldHVybiBQcm9taXNlLmFsbChjZHBzKTtcblx0fSlcblx0LnRoZW4oIGRhdGEgPT4ge1xuXG5cdCAgICAvL1xuXHQgICAgdGhpcy5wcm9jZXNzQ2hyb21vc29tZXMoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmluaXREb21QYXJ0MigpO1xuXHQgICAgLy9cblx0ICAgIC8vIEZJTkFMTFkhIFdlIGFyZSByZWFkeSB0byBkcmF3IHRoZSBpbml0aWFsIHNjZW5lLlxuXHQgICAgdGhpcy5zZXRDb250ZXh0KHRoaXMuaW5pdGlhbENmZyk7XG5cblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFxuICAgIGluaXREb20gKCkge1xuXHRzZWxmID0gdGhpcztcblx0Ly9cblx0Ly8gVE9ETzogcmVmYWN0b3IgcGFnZWJveCwgZHJhZ2dhYmxlLCBhbmQgZnJpZW5kcyBpbnRvIGEgZnJhbWV3b3JrIG1vZHVsZSxcblx0Ly8gXG5cdHRoaXMucGJEcmFnZ2VyID0gdGhpcy5nZXRDb250ZW50RHJhZ2dlcigpO1xuXHRkMy5zZWxlY3RBbGwoJy5wYWdlYm94Jylcblx0ICAgIC5jYWxsKHRoaXMucGJEcmFnZ2VyKVxuXHQgICAgLmFwcGVuZCgnaScpXG5cdCAgICAuYXR0cignY2xhc3MnLCdtYXRlcmlhbC1pY29ucyBidXN5IHJvdGF0aW5nJylcblx0ICAgIDtcblx0ZDMuc2VsZWN0QWxsKCcuY2xvc2FibGUnKVxuXHQgICAgLmFwcGVuZCgnaScpXG5cdFx0LmF0dHIoJ2NsYXNzJywnbWF0ZXJpYWwtaWNvbnMgYnV0dG9uIGNsb3NlJylcblx0XHQuYXR0cigndGl0bGUnLCdDbGljayB0byBvcGVuL2Nsb3NlLicpXG5cdFx0Lm9uKCdjbGljay5kZWZhdWx0JywgZnVuY3Rpb24gKCkge1xuXHRcdCAgICBsZXQgcCA9IGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUpO1xuXHRcdCAgICBwLmNsYXNzZWQoJ2Nsb3NlZCcsICEgcC5jbGFzc2VkKCdjbG9zZWQnKSk7XG5cdFx0ICAgIGQzLnNlbGVjdCh0aGlzKS5hdHRyKCd0aXRsZScsJ0NsaWNrIHRvICcgKyAgKHAuY2xhc3NlZCgnY2xvc2VkJykgPyAnb3BlbicgOiAnY2xvc2UnKSArICcuJylcblx0XHQgICAgc2VsZi5zZXRQcmVmc0Zyb21VSSgpO1xuXHRcdH0pO1xuXHRkMy5zZWxlY3RBbGwoJy5jb250ZW50LWRyYWdnYWJsZSA+IConKVxuXHQgICAgLmFwcGVuZCgnaScpXG5cdFx0LmF0dHIoJ3RpdGxlJywnRHJhZyB1cC9kb3duIHRvIHJlcG9zaXRpb24uJylcblx0XHQuYXR0cignY2xhc3MnLCdtYXRlcmlhbC1pY29ucyBidXR0b24gZHJhZ2hhbmRsZScpO1xuXG5cdC8vIFxuICAgICAgICBkMy5zZWxlY3QoJyNzdGF0dXNNZXNzYWdlJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB7IHRoaXMuc2hvd1N0YXR1cyhmYWxzZSk7IH0pO1xuXHRcblx0Ly9cblx0Ly8gQnV0dG9uOiBHZWFyIGljb24gdG8gc2hvdy9oaWRlIGxlZnQgY29sdW1uXG5cdGQzLnNlbGVjdChcIiNoZWFkZXIgPiAuZ2Vhci5idXR0b25cIilcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgbGMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImxlZnRjb2x1bW5cIl0nKTtcblx0XHRsYy5jbGFzc2VkKFwiY2xvc2VkXCIsICgpID0+ICEgbGMuY2xhc3NlZChcImNsb3NlZFwiKSk7XG5cdFx0d2luZG93LnNldFRpbWVvdXQoKCk9Pntcblx0XHQgICAgdGhpcy5yZXNpemUoKVxuXHRcdCAgICB0aGlzLnNldENvbnRleHQoe30pO1xuXHRcdCAgICB0aGlzLnNldFByZWZzRnJvbVVJKCk7XG5cdFx0fSwgMjUwKTtcblx0ICAgIH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEb20gaW5pdGlhbGl6dGlvbiB0aGF0IG11c3Qgd2FpdCB1bnRpbCBhZnRlciBnZW5vbWUgbWV0YSBkYXRhIGlzIGxvYWRlZC5cbiAgICBpbml0RG9tUGFydDIgKCkge1xuXHQvL1xuXHRsZXQgY2ZnID0gdGhpcy5zYW5pdGl6ZUNmZyh0aGlzLmluaXRpYWxDZmcpO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0Ly8gaW5pdGlhbGl6ZSB0aGUgcmVmIGFuZCBjb21wIGdlbm9tZSBvcHRpb24gbGlzdHNcblx0aW5pdE9wdExpc3QoXCIjcmVmR2Vub21lXCIsICAgdGhpcy5hbGxHZW5vbWVzLCBnPT5nLm5hbWUsIGc9PmcubGFiZWwsIGZhbHNlLCBnID0+IGcgPT09IGNmZy5yZWYpO1xuXHRpbml0T3B0TGlzdChcIiNjb21wR2Vub21lc1wiLCB0aGlzLmFsbEdlbm9tZXMsIGc9PmcubmFtZSwgZz0+Zy5sYWJlbCwgdHJ1ZSwgIGcgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihnKSAhPT0gLTEpO1xuXHRkMy5zZWxlY3QoXCIjcmVmR2Vub21lXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuXHQgICAgc2VsZi5zZXRDb250ZXh0KHsgcmVmOiB0aGlzLnZhbHVlIH0pO1xuXHR9KTtcblx0ZDMuc2VsZWN0KFwiI2NvbXBHZW5vbWVzXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuXHQgICAgbGV0IHNlbGVjdGVkTmFtZXMgPSBbXTtcblx0ICAgIGZvcihsZXQgeCBvZiB0aGlzLnNlbGVjdGVkT3B0aW9ucyl7XG5cdFx0c2VsZWN0ZWROYW1lcy5wdXNoKHgudmFsdWUpO1xuXHQgICAgfVxuXHQgICAgLy8gd2FudCB0byBwcmVzZXJ2ZSBjdXJyZW50IGdlbm9tZSBvcmRlciBhcyBtdWNoIGFzIHBvc3NpYmxlIFxuXHQgICAgbGV0IGdOYW1lcyA9IHNlbGYudkdlbm9tZXMubWFwKGc9PmcubmFtZSlcblx0XHQuZmlsdGVyKG4gPT4ge1xuXHRcdCAgICByZXR1cm4gc2VsZWN0ZWROYW1lcy5pbmRleE9mKG4pID49IDAgfHwgbiA9PT0gc2VsZi5yR2Vub21lLm5hbWU7XG5cdFx0fSk7XG5cdCAgICBnTmFtZXMgPSBnTmFtZXMuY29uY2F0KHNlbGVjdGVkTmFtZXMuZmlsdGVyKG4gPT4gZ05hbWVzLmluZGV4T2YobikgPT09IC0xKSk7XG5cdCAgICBzZWxmLnNldENvbnRleHQoeyBnZW5vbWVzOiBnTmFtZXMgfSk7XG5cdH0pO1xuXHRkM3RzdihcIi4vZGF0YS9nZW5vbWVTZXRzLnRzdlwiKS50aGVuKHNldHMgPT4ge1xuXHQgICAgLy8gQ3JlYXRlIHNlbGVjdGlvbiBidXR0b25zLlxuXHQgICAgc2V0cy5mb3JFYWNoKCBzID0+IHMuZ2Vub21lcyA9IHMuZ2Vub21lcy5zcGxpdChcIixcIikgKTtcblx0ICAgIGxldCBjZ2IgPSBkMy5zZWxlY3QoJyNjb21wR2Vub21lc0JveCcpLnNlbGVjdEFsbCgnYnV0dG9uJykuZGF0YShzZXRzKTtcblx0ICAgIGNnYi5lbnRlcigpLmFwcGVuZCgnYnV0dG9uJylcblx0XHQudGV4dChkPT5kLm5hbWUpXG5cdFx0LmF0dHIoJ3RpdGxlJywgZD0+ZC5kZXNjcmlwdGlvbilcblx0XHQub24oJ2NsaWNrJywgZCA9PiB7XG5cdFx0ICAgIHNlbGYuc2V0Q29udGV4dChkKTtcblx0XHR9KVxuXHRcdDtcblx0fSkuY2F0Y2goKCk9Pntcblx0ICAgIGNvbnNvbGUubG9nKFwiTm8gZ2Vub21lU2V0cyBmaWxlIGZvdW5kLlwiKTtcblx0fSk7IC8vIE9LIGlmIG5vIGdlbm9tZVNldHMgZmlsZVxuXG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHByb2Nlc3NDaHJvbW9zb21lcyAoZGF0YSkge1xuXHQvLyBkYXRhIGlzIGEgbGlzdCBvZiBjaHJvbW9zb21lIGxpc3RzLCBvbmUgcGVyIGdlbm9tZVxuXHQvLyBGaWxsIGluIHRoZSBnZW5vbWVDaHJzIG1hcCAoZ2Vub21lIC0+IGNociBsaXN0KVxuXHR0aGlzLmFsbEdlbm9tZXMuZm9yRWFjaCgoZyxpKSA9PiB7XG5cdCAgICAvLyBuaWNlbHkgc29ydCB0aGUgY2hyb21vc29tZXNcblx0ICAgIGxldCBjaHJzID0gZGF0YVtpXTtcblx0ICAgIGcubWF4bGVuID0gMDtcblx0ICAgIGNocnMuZm9yRWFjaCggYyA9PiB7XG5cdFx0Ly9cblx0XHRjLmxlbmd0aCA9IHBhcnNlSW50KGMubGVuZ3RoKVxuXHRcdGcubWF4bGVuID0gTWF0aC5tYXgoZy5tYXhsZW4sIGMubGVuZ3RoKTtcblx0XHQvLyBiZWNhdXNlIEknZCByYXRoZXIgc2F5IFwiY2hyb21vc29tZS5uYW1lXCIgdGhhbiBcImNocm9tb3NvbWUuY2hyb21vc29tZVwiXG5cdFx0Yy5uYW1lID0gYy5jaHJvbW9zb21lO1xuXHRcdGRlbGV0ZSBjLmNocm9tb3NvbWU7XG5cdCAgICB9KTtcblx0ICAgIC8vIG5pY2VseSBzb3J0IHRoZSBjaHJvbW9zb21lc1xuXHQgICAgY2hycy5zb3J0KChhLGIpID0+IHtcblx0XHRsZXQgYWEgPSBwYXJzZUludChhLm5hbWUpIC0gcGFyc2VJbnQoYi5uYW1lKTtcblx0XHRpZiAoIWlzTmFOKGFhKSkgcmV0dXJuIGFhO1xuXHRcdHJldHVybiBhLm5hbWUgPCBiLm5hbWUgPyAtMSA6IGEubmFtZSA+IGIubmFtZSA/ICsxIDogMDtcblx0ICAgIH0pO1xuXHQgICAgZy5jaHJvbW9zb21lcyA9IGNocnM7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRDb250ZW50RHJhZ2dlciAoKSB7XG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAvLyBIZWxwZXIgZnVuY3Rpb24gZm9yIHRoZSBkcmFnIGJlaGF2aW9yLiBSZW9yZGVycyB0aGUgY29udGVudHMgYmFzZWQgb25cbiAgICAgIC8vIGN1cnJlbnQgc2NyZWVuIHBvc2l0aW9uIG9mIHRoZSBkcmFnZ2VkIGl0ZW0uXG4gICAgICBmdW5jdGlvbiByZW9yZGVyQnlEb20oKSB7XG5cdCAgLy8gTG9jYXRlIHRoZSBzaWIgd2hvc2UgcG9zaXRpb24gaXMgYmV5b25kIHRoZSBkcmFnZ2VkIGl0ZW0gYnkgdGhlIGxlYXN0IGFtb3VudFxuXHQgIGxldCBkciA9IHNlbGYuZHJhZ2dpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgbGV0IGJTaWIgPSBudWxsO1xuXHQgIGxldCB4eSA9IGQzLnNlbGVjdChzZWxmLmRyYWdQYXJlbnQpLmNsYXNzZWQoXCJmbGV4cm93XCIpID8gXCJ4XCIgOiBcInlcIjtcblx0ICBmb3IgKGxldCBzIG9mIHNlbGYuZHJhZ1NpYnMpIHtcblx0ICAgICAgbGV0IHNyID0gcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgaWYgKGRyW3h5XSA8IHNyW3h5XSkge1xuXHRcdCAgIGxldCBkaXN0ID0gc3JbeHldIC0gZHJbeHldO1xuXHRcdCAgIGlmICghYlNpYiB8fCBkaXN0IDwgYlNpYlt4eV0gLSBkclt4eV0pXG5cdFx0ICAgICAgIGJTaWIgPSBzO1xuXHQgICAgICB9XG5cdCAgfVxuXHQgIC8vIEluc2VydCB0aGUgZHJhZ2dlZCBpdGVtIGJlZm9yZSB0aGUgbG9jYXRlZCBzaWIgKG9yIGFwcGVuZCBpZiBubyBzaWIgZm91bmQpXG5cdCAgc2VsZi5kcmFnUGFyZW50Lmluc2VydEJlZm9yZShzZWxmLmRyYWdnaW5nLCBiU2liKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHJlb3JkZXJCeVN0eWxlKCkge1xuXHQgIGxldCBkZCA9IGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKTtcblx0ICAvLyBMb2NhdGUgdGhlIHNpYiB0aGF0IGNvbnRhaW5zIHRoZSBkcmFnZ2VkIGl0ZW0ncyBvcmlnaW4uXG5cdCAgbGV0IGRyID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICBsZXQgYlNpYiA9IG51bGw7XG5cdCAgbGV0IHh5ID0gZDMuc2VsZWN0KHNlbGYuZHJhZ1BhcmVudCkuY2xhc3NlZChcImZsZXhyb3dcIikgPyBcInhcIiA6IFwieVwiO1xuXHQgIGxldCBzeiA9IHh5ID09PSBcInhcIiA/IFwid2lkdGhcIiA6IFwiaGVpZ2h0XCI7XG5cdCAgbGV0IHN0eT0geHkgPT09IFwieFwiID8gXCJsZWZ0XCIgOiBcInRvcFwiO1xuXHQgIGZvciAobGV0IHMgb2Ygc2VsZi5kcmFnU2licykge1xuXHQgICAgICAvLyBza2lwIHRoZSBkcmFnZ2VkIGl0ZW1cblx0ICAgICAgaWYgKHMgPT09IHNlbGYuZHJhZ2dpbmcpIGNvbnRpbnVlO1xuXHQgICAgICBsZXQgZHMgPSBkMy5zZWxlY3Qocyk7XG5cdCAgICAgIGxldCBzciA9IHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIC8vIGlmdyB0aGUgZHJhZ2dlZCBpdGVtJ3Mgb3JpZ2luIGlzIGJldHdlZW4gdGhlIHN0YXJ0IGFuZCBlbmQgb2Ygc2liLCB3ZSBmb3VuZCBpdC5cblx0ICAgICAgaWYgKGRyW3h5XSA+PSBzclt4eV0gJiYgZHJbeHldIDw9IChzclt4eV0gKyBzcltzel0pKSB7XG5cdFx0ICAgLy8gbW92ZSBzaWIgdG93YXJkIHRoZSBob2xlLCBhbW91bnQgPSB0aGUgc2l6ZSBvZiB0aGUgaG9sZVxuXHRcdCAgIGxldCBhbXQgPSBzZWxmLmRyYWdIb2xlW3N6XSAqIChzZWxmLmRyYWdIb2xlW3h5XSA8IHNyW3h5XSA/IC0xIDogMSk7XG5cdFx0ICAgZHMuc3R5bGUoc3R5LCBwYXJzZUludChkcy5zdHlsZShzdHkpKSArIGFtdCArIFwicHhcIik7XG5cdFx0ICAgc2VsZi5kcmFnSG9sZVt4eV0gLT0gYW10O1xuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICB9XG5cdCAgfVxuICAgICAgfVxuICAgICAgLy9cbiAgICAgIHJldHVybiBkMy5iZWhhdmlvci5kcmFnKClcblx0ICAub3JpZ2luKGZ1bmN0aW9uKGQsaSl7XG5cdCAgICAgIHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIH0pXG4gICAgICAgICAgLm9uKFwiZHJhZ3N0YXJ0Lm1cIiwgZnVuY3Rpb24oKSB7XG5cdCAgICAgIGxldCB0ID0gZDMuZXZlbnQuc291cmNlRXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAoISBkMy5zZWxlY3QodCkuY2xhc3NlZChcImRyYWdoYW5kbGVcIikpIHJldHVybjtcblx0ICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIC8vXG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgICAgPSB0aGlzLmNsb3Nlc3QoXCIucGFnZWJveFwiKTtcblx0ICAgICAgc2VsZi5kcmFnSG9sZSAgICA9IHNlbGYuZHJhZ2dpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIHNlbGYuZHJhZ1BhcmVudCAgPSBzZWxmLmRyYWdnaW5nLnBhcmVudE5vZGU7XG5cdCAgICAgIHNlbGYuZHJhZ1NpYnMgICAgPSBzZWxmLmRyYWdQYXJlbnQuY2hpbGRyZW47XG5cdCAgICAgIC8vXG5cdCAgICAgIGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKS5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgdHJ1ZSk7XG5cdCAgfSlcblx0ICAub24oXCJkcmFnLm1cIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgbGV0IGRkID0gZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpO1xuXHQgICAgICBsZXQgdHAgPSBwYXJzZUludChkZC5zdHlsZShcInRvcFwiKSlcblx0ICAgICAgZGQuc3R5bGUoXCJ0b3BcIiwgdHAgKyBkMy5ldmVudC5keSArIFwicHhcIik7XG5cdCAgICAgIC8vcmVvcmRlckJ5U3R5bGUoKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWdlbmQubVwiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICByZW9yZGVyQnlEb20oKTtcblx0ICAgICAgc2VsZi5zZXRQcmVmc0Zyb21VSSgpO1xuXHQgICAgICBsZXQgZGQgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZyk7XG5cdCAgICAgIGRkLnN0eWxlKFwidG9wXCIsIFwiMHB4XCIpO1xuXHQgICAgICBkZC5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgZmFsc2UpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nICAgID0gbnVsbDtcblx0ICAgICAgc2VsZi5kcmFnSG9sZSAgICA9IG51bGw7XG5cdCAgICAgIHNlbGYuZHJhZ1BhcmVudCAgPSBudWxsO1xuXHQgICAgICBzZWxmLmRyYWdTaWJzICAgID0gbnVsbDtcblx0ICB9KVxuXHQgIDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0VUlGcm9tUHJlZnMgKCkge1xuICAgICAgICBsZXQgcHJlZnMgPSB0aGlzLnVzZXJQcmVmc01hbmFnZXIuZ2V0QWxsKCk7XG5cdGNvbnNvbGUubG9nKFwiR290IHByZWZzIGZyb20gc3RvcmFnZVwiLCBwcmVmcyk7XG5cblx0Ly8gc2V0IG9wZW4vY2xvc2VkIHN0YXRlc1xuXHQocHJlZnMuY2xvc2FibGVzIHx8IFtdKS5mb3JFYWNoKCBjID0+IHtcblx0ICAgIGxldCBpZCA9IGNbMF07XG5cdCAgICBsZXQgc3RhdGUgPSBjWzFdO1xuXHQgICAgZDMuc2VsZWN0KCcjJytpZCkuY2xhc3NlZCgnY2xvc2VkJywgc3RhdGUgPT09IFwiY2xvc2VkXCIgfHwgbnVsbCk7XG5cdH0pO1xuXG5cdC8vIHNldCBkcmFnZ2FibGVzJyBvcmRlclxuXHQocHJlZnMuZHJhZ2dhYmxlcyB8fCBbXSkuZm9yRWFjaCggZCA9PiB7XG5cdCAgICBsZXQgY3RySWQgPSBkWzBdO1xuXHQgICAgbGV0IGNvbnRlbnRJZHMgPSBkWzFdO1xuXHQgICAgbGV0IGN0ciA9IGQzLnNlbGVjdCgnIycrY3RySWQpO1xuXHQgICAgbGV0IGNvbnRlbnRzID0gY3RyLnNlbGVjdEFsbCgnIycrY3RySWQrJyA+IConKTtcblx0ICAgIGNvbnRlbnRzWzBdLnNvcnQoIChhLGIpID0+IHtcblx0ICAgICAgICBsZXQgYWkgPSBjb250ZW50SWRzLmluZGV4T2YoYS5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuXHQgICAgICAgIGxldCBiaSA9IGNvbnRlbnRJZHMuaW5kZXhPZihiLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG5cdFx0cmV0dXJuIGFpIC0gYmk7XG5cdCAgICB9KTtcblx0ICAgIGNvbnRlbnRzLm9yZGVyKCk7XG5cdH0pO1xuICAgIH1cbiAgICBzZXRQcmVmc0Zyb21VSSAoKSB7XG4gICAgICAgIC8vIHNhdmUgb3Blbi9jbG9zZWQgc3RhdGVzXG5cdGxldCBjbG9zYWJsZXMgPSB0aGlzLnJvb3Quc2VsZWN0QWxsKCcuY2xvc2FibGUnKTtcblx0bGV0IG9jRGF0YSA9IGNsb3NhYmxlc1swXS5tYXAoIGMgPT4ge1xuXHQgICAgbGV0IGRjID0gZDMuc2VsZWN0KGMpO1xuXHQgICAgcmV0dXJuIFtkYy5hdHRyKCdpZCcpLCBkYy5jbGFzc2VkKFwiY2xvc2VkXCIpID8gXCJjbG9zZWRcIiA6IFwib3BlblwiXTtcblx0fSk7XG5cdC8vIHNhdmUgZHJhZ2dhYmxlcycgb3JkZXJcblx0bGV0IGRyYWdDdHJzID0gdGhpcy5yb290LnNlbGVjdEFsbCgnLmNvbnRlbnQtZHJhZ2dhYmxlJyk7XG5cdGxldCBkcmFnZ2FibGVzID0gZHJhZ0N0cnMuc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUgPiAqJyk7XG5cdGxldCBkZERhdGEgPSBkcmFnZ2FibGVzLm1hcCggKGQsaSkgPT4ge1xuXHQgICAgbGV0IGN0ciA9IGQzLnNlbGVjdChkcmFnQ3Ryc1swXVtpXSk7XG5cdCAgICByZXR1cm4gW2N0ci5hdHRyKCdpZCcpLCBkLm1hcCggZGQgPT4gZDMuc2VsZWN0KGRkKS5hdHRyKCdpZCcpKV07XG5cdH0pO1xuXHRsZXQgcHJlZnMgPSB7XG5cdCAgICBjbG9zYWJsZXM6IG9jRGF0YSxcblx0ICAgIGRyYWdnYWJsZXM6IGRkRGF0YVxuXHR9XG5cdGNvbnNvbGUubG9nKFwiU2F2aW5nIHByZWZzIHRvIHN0b3JhZ2VcIiwgcHJlZnMpO1xuXHR0aGlzLnVzZXJQcmVmc01hbmFnZXIuc2V0QWxsKHByZWZzKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd0Jsb2NrcyAoY29tcCkge1xuXHRsZXQgcmVmID0gdGhpcy5yR2Vub21lO1xuXHRpZiAoISBjb21wKSBjb21wID0gdGhpcy5jR2Vub21lc1swXTtcblx0aWYgKCEgY29tcCkgcmV0dXJuO1xuXHR0aGlzLnRyYW5zbGF0b3IucmVhZHkoKS50aGVuKCAoKSA9PiB7XG5cdCAgICBsZXQgYmxvY2tzID0gY29tcCA9PT0gcmVmID8gW10gOiB0aGlzLnRyYW5zbGF0b3IuZ2V0QmxvY2tzKHJlZiwgY29tcCk7XG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd0Jsb2Nrcyh7IHJlZiwgY29tcCwgYmxvY2tzIH0pO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd0J1c3kgKGlzQnVzeSwgbWVzc2FnZSkge1xuICAgICAgICBkMy5zZWxlY3QoXCIjaGVhZGVyID4gLmdlYXIuYnV0dG9uXCIpXG5cdCAgICAuY2xhc3NlZChcInJvdGF0aW5nXCIsIGlzQnVzeSk7XG4gICAgICAgIGQzLnNlbGVjdChcIiN6b29tVmlld1wiKS5jbGFzc2VkKFwiYnVzeVwiLCBpc0J1c3kpO1xuXHRpZiAoaXNCdXN5ICYmIG1lc3NhZ2UpIHRoaXMuc2hvd1N0YXR1cyhtZXNzYWdlKTtcblx0aWYgKCFpc0J1c3kpIHRoaXMuc2hvd1N0YXR1cygnJylcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd1N0YXR1cyAobXNnKSB7XG5cdGlmIChtc2cpXG5cdCAgICBkMy5zZWxlY3QoJyNzdGF0dXNNZXNzYWdlJylcblx0XHQuY2xhc3NlZCgnc2hvd2luZycsIHRydWUpXG5cdFx0LnNlbGVjdCgnc3BhbicpXG5cdFx0ICAgIC50ZXh0KG1zZyk7XG5cdGVsc2Vcblx0ICAgIGQzLnNlbGVjdCgnI3N0YXR1c01lc3NhZ2UnKS5jbGFzc2VkKCdzaG93aW5nJywgZmFsc2UpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldFJlZkdlbm9tZVNlbGVjdGlvbiAoKSB7XG5cdGQzLnNlbGVjdEFsbChcIiNyZWZHZW5vbWUgb3B0aW9uXCIpXG5cdCAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCAgZ2cgPT4gKGdnLmxhYmVsID09PSB0aGlzLnJHZW5vbWUubGFiZWwgIHx8IG51bGwpKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0Q29tcEdlbm9tZXNTZWxlY3Rpb24gKCkge1xuXHRsZXQgY2ducyA9IHRoaXMudkdlbm9tZXMubWFwKGc9PmcubGFiZWwpO1xuXHRkMy5zZWxlY3RBbGwoXCIjY29tcEdlbm9tZXMgb3B0aW9uXCIpXG5cdCAgICAgICAgLnByb3BlcnR5KFwic2VsZWN0ZWRcIiwgIGdnID0+IGNnbnMuaW5kZXhPZihnZy5sYWJlbCkgPj0gMCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNldHMgb3IgcmV0dXJuc1xuICAgIHNldEhpZ2hsaWdodCAoZmxpc3QpIHtcblx0aWYgKCFmbGlzdCkgcmV0dXJuIGZhbHNlO1xuXHR0aGlzLnpvb21WaWV3LmhpRmVhdHMgPSBmbGlzdC5yZWR1Y2UoKGEsdikgPT4geyBhW3ZdPXY7IHJldHVybiBhOyB9LCB7fSk7XG5cdHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGNvbnRleHQgYXMgYW4gb2JqZWN0LlxuICAgIC8vIEN1cnJlbnQgY29udGV4dCA9IHJlZiBnZW5vbWUgKyBjb21wIGdlbm9tZXMgKyBjdXJyZW50IHJhbmdlIChjaHIsc3RhcnQsZW5kKVxuICAgIGdldENvbnRleHQgKCkge1xuXHRpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpIHtcblx0ICAgIGxldCBjID0gdGhpcy5jb29yZHM7XG5cdCAgICByZXR1cm4ge1xuXHRcdHJlZiA6IHRoaXMuckdlbm9tZS5sYWJlbCxcblx0XHRnZW5vbWVzOiB0aGlzLnZHZW5vbWVzLm1hcChnPT5nLmxhYmVsKSxcblx0XHRjaHI6IGMuY2hyLFxuXHRcdHN0YXJ0OiBjLnN0YXJ0LFxuXHRcdGVuZDogYy5lbmQsXG5cdFx0aGlnaGxpZ2h0OiBPYmplY3Qua2V5cyh0aGlzLnpvb21WaWV3LmhpRmVhdHMpLnNvcnQoKSxcblx0XHRkbW9kZTogdGhpcy56b29tVmlldy5kbW9kZVxuXHQgICAgfVxuXHR9IGVsc2Uge1xuXHQgICAgbGV0IGMgPSB0aGlzLmxjb29yZHM7XG5cdCAgICByZXR1cm4ge1xuXHRcdHJlZiA6IHRoaXMuckdlbm9tZS5sYWJlbCxcblx0XHRnZW5vbWVzOiB0aGlzLnZHZW5vbWVzLm1hcChnPT5nLmxhYmVsKSxcblx0XHRsYW5kbWFyazogYy5sYW5kbWFyayxcblx0XHRmbGFuazogYy5mbGFuayxcblx0XHRsZW5ndGg6IGMubGVuZ3RoLFxuXHRcdGRlbHRhOiBjLmRlbHRhLFxuXHRcdGhpZ2hsaWdodDogT2JqZWN0LmtleXModGhpcy56b29tVmlldy5oaUZlYXRzKS5zb3J0KCksXG5cdFx0ZG1vZGU6IHRoaXMuem9vbVZpZXcuZG1vZGVcblx0ICAgIH1cblx0fVxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXNvbHZlcyB0aGUgc3BlY2lmaWVkIGxhbmRtYXJrIHRvIGEgZmVhdHVyZSBhbmQgdGhlIGxpc3Qgb2YgZXF1aXZhbGVudCBmZWF1cmVzLlxuICAgIC8vIE1heSBiZSBnaXZlbiBhbiBpZCwgY2Fub25pY2FsIGlkLCBvciBzeW1ib2wuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgY2ZnIChvYmopIFNhbml0aXplZCBjb25maWcgb2JqZWN0LCB3aXRoIGEgbGFuZG1hcmsgKHN0cmluZykgZmllbGQuXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgICAgVGhlIGNmZyBvYmplY3QsIHdpdGggYWRkaXRpb25hbCBmaWVsZHM6XG4gICAgLy8gICAgICAgIGxhbmRtYXJrUmVmRmVhdDogdGhlIGxhbmRtYXJrIChGZWF0dXJlIG9iaikgaW4gdGhlIHJlZiBnZW5vbWVcbiAgICAvLyAgICAgICAgbGFuZG1hcmtGZWF0czogWyBlcXVpdmFsZW50IGZlYXR1cmVzIGluIGVhY2ggZ2Vub21lIChpbmNsdWRlcyByZildXG4gICAgLy8gICAgIEFsc28sIGNoYW5nZXMgcmVmIHRvIGJlIHRoZSBnZW5vbWUgb2YgdGhlIGxhbmRtYXJrUmVmRmVhdFxuICAgIC8vICAgICBSZXR1cm5zIG51bGwgaWYgbGFuZG1hcmsgbm90IGZvdW5kIGluIGFueSBnZW5vbWUuXG4gICAgLy8gXG4gICAgcmVzb2x2ZUxhbmRtYXJrIChjZmcpIHtcblx0bGV0IHJmLCBmZWF0cztcblx0Ly8gRmluZCB0aGUgbGFuZG1hcmsgZmVhdHVyZSBpbiB0aGUgcmVmIGdlbm9tZS4gXG5cdHJmID0gdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5TGFiZWwoY2ZnLmxhbmRtYXJrLCBjZmcucmVmKVswXTtcblx0aWYgKCFyZikge1xuXHQgICAgLy8gTGFuZG1hcmsgZG9lcyBub3QgZXhpc3QgaW4gcmVmIGdlbm9tZS4gRG9lcyBpdCBleGlzdCBpbiBhbnkgc3BlY2lmaWVkIGdlbm9tZT9cblx0ICAgIHJmID0gdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5TGFiZWwoY2ZnLmxhbmRtYXJrKS5maWx0ZXIoZiA9PiBjZmcuZ2Vub21lcy5pbmRleE9mKGYuZ2Vub21lKSA+PSAwKVswXTtcblx0ICAgIGlmIChyZikge1xuXHQgICAgICAgIGNmZy5yZWYgPSByZi5nZW5vbWU7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICAvLyBMYW5kbWFyayBjYW5ub3QgYmUgcmVzb2x2ZWQuXG5cdFx0cmV0dXJuIG51bGw7XG5cdCAgICB9XG5cdH1cblx0Ly8gbGFuZG1hcmsgZXhpc3RzIGluIHJlZiBnZW5vbWUuIEdldCBlcXVpdmFsZW50IGZlYXQgaW4gZWFjaCBnZW5vbWUuXG5cdGZlYXRzID0gcmYuY2Fub25pY2FsID8gdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5Q2Fub25pY2FsSWQocmYuY2Fub25pY2FsKSA6IFtyZl07XG5cdGNmZy5sYW5kbWFya1JlZkZlYXQgPSByZjtcblx0Y2ZnLmxhbmRtYXJrRmVhdHMgPSBmZWF0cy5maWx0ZXIoZiA9PiBjZmcuZ2Vub21lcy5pbmRleE9mKGYuZ2Vub21lKSA+PSAwKTtcblx0cmV0dXJuIGNmZztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHNhbml0aXplZCB2ZXJzaW9uIG9mIHRoZSBhcmd1bWVudCBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAgICAvLyBUaGUgc2FuaXRpemVkIHZlcnNpb246XG4gICAgLy8gICAgIC0gaGFzIGEgc2V0dGluZyBmb3IgZXZlcnkgcGFyYW1ldGVyLiBQYXJhbWV0ZXJzIG5vdCBzcGVjaWZpZWQgaW4gXG4gICAgLy8gICAgICAgdGhlIGFyZ3VtZW50IGFyZSAoZ2VuZXJhbGx5KSBmaWxsZWQgaW4gd2l0aCB0aGVpciBjdXJyZW50IHZhbHVlcy5cbiAgICAvLyAgICAgLSBpcyBhbHdheXMgdmFsaWQsIGVnXG4gICAgLy8gICAgIFx0LSBoYXMgYSBsaXN0IG9mIDEgb3IgbW9yZSB2YWxpZCBnZW5vbWVzLCB3aXRoIG9uZSBvZiB0aGVtIGRlc2lnbmF0ZWQgYXMgdGhlIHJlZlxuICAgIC8vICAgICBcdC0gaGFzIGEgdmFsaWQgY29vcmRpbmF0ZSByYW5nZVxuICAgIC8vICAgICBcdCAgICAtIHN0YXJ0IGFuZCBlbmQgYXJlIGludGVnZXJzIHdpdGggc3RhcnQgPD0gZW5kXG4gICAgLy8gICAgIFx0ICAgIC0gdmFsaWQgY2hyb21vc29tZSBmb3IgcmVmIGdlbm9tZVxuICAgIC8vXG4gICAgLy8gVGhlIHNhbml0aXplZCB2ZXJzaW9uIGlzIGFsc28gXCJjb21waWxlZFwiOlxuICAgIC8vICAgICAtIGl0IGhhcyBhY3R1YWwgR2Vub21lIG9iamVjdHMsIHdoZXJlIHRoZSBhcmd1bWVudCBqdXN0IGhhcyBuYW1lc1xuICAgIC8vICAgICAtIGdyb3VwcyB0aGUgY2hyK3N0YXJ0K2VuZCBpbiBcImNvb3Jkc1wiIG9iamVjdFxuICAgIC8vXG4gICAgLy9cbiAgICBzYW5pdGl6ZUNmZyAoYykge1xuXHRsZXQgY2ZnID0ge307XG5cblx0Ly8gU2FuaXRpemUgdGhlIGlucHV0LlxuXG5cdC8vIHdpbmRvdyBzaXplIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGlmIChjLndpZHRoKSB7XG5cdCAgICBjZmcud2lkdGggPSBjLndpZHRoXG5cdH1cblxuXHQvLyByZWYgZ2Vub21lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvL1xuXHQvLyBTZXQgY2ZnLnJlZiB0byBzcGVjaWZpZWQgZ2Vub21lLCBcblx0Ly8gICB3aXRoIGZhbGxiYWNrIHRvIGN1cnJlbnQgcmVmIGdlbm9tZSwgXG5cdC8vICAgICAgd2l0aCBmYWxsYmFjayB0byBDNTdCTC82SiAoMXN0IHRpbWUgdGhydSlcblx0Ly8gRklYTUU6IGZpbmFsIGZhbGxiYWNrIHNob3VsZCBiZSBhIGNvbmZpZyBzZXR0aW5nLlxuXHRjZmcucmVmID0gKGMucmVmID8gdGhpcy5ubDJnZW5vbWVbYy5yZWZdIHx8IHRoaXMuckdlbm9tZSA6IHRoaXMuckdlbm9tZSkgfHwgdGhpcy5ubDJnZW5vbWVbJ0M1N0JMLzZKJ107XG5cblx0Ly8gY29tcGFyaXNvbiBnZW5vbWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gU2V0IGNmZy5nZW5vbWVzIHRvIGJlIHRoZSBzcGVjaWZpZWQgZ2Vub21lcyxcblx0Ly8gICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgZ2Vub21lc1xuXHQvLyAgICAgICAgd2l0aCBmYWxsYmFjayB0byBbcmVmXSAoMXN0IHRpbWUgdGhydSlcblx0Y2ZnLmdlbm9tZXMgPSBjLmdlbm9tZXMgP1xuXHQgICAgKGMuZ2Vub21lcy5tYXAoZyA9PiB0aGlzLm5sMmdlbm9tZVtnXSkuZmlsdGVyKHg9PngpKVxuXHQgICAgOlxuXHQgICAgdGhpcy52R2Vub21lcztcblx0Ly8gQWRkIHJlZiB0byBnZW5vbWVzIGlmIG5vdCB0aGVyZSBhbHJlYWR5XG5cdGlmIChjZmcuZ2Vub21lcy5pbmRleE9mKGNmZy5yZWYpID09PSAtMSlcblx0ICAgIGNmZy5nZW5vbWVzLnVuc2hpZnQoY2ZnLnJlZik7XG5cdFxuXHQvLyBhYnNvbHV0ZSBjb29yZGluYXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvL1xuXHQvLyBTZXQgY2ZnLmNociB0byBiZSB0aGUgc3BlY2lmaWVkIGNocm9tb3NvbWVcblx0Ly8gICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgY2hyXG5cdC8vICAgICAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgMXN0IGNocm9tb3NvbWUgaW4gdGhlIHJlZiBnZW5vbWVcblx0Y2ZnLmNociA9IGNmZy5yZWYuZ2V0Q2hyb21vc29tZShjLmNocik7XG5cdGlmICghY2ZnLmNocikgY2ZnLmNociA9IGNmZy5yZWYuZ2V0Q2hyb21vc29tZSggdGhpcy5jb29yZHMgPyB0aGlzLmNvb3Jkcy5jaHIgOiBcIjFcIiApO1xuXHRpZiAoIWNmZy5jaHIpIGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoMCk7XG5cdGlmICghY2ZnLmNocikgdGhyb3cgXCJObyBjaHJvbW9zb21lLlwiXG5cdFxuXHQvLyBTZXQgY2ZnLnN0YXJ0IHRvIGJlIHRoZSBzcGVjaWZpZWQgc3RhcnQgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBzdGFydFxuXHQvLyBDbGlwIGF0IGNociBib3VuZGFyaWVzXG5cdGNmZy5zdGFydCA9IGNsaXAoTWF0aC5yb3VuZCh0eXBlb2YoYy5zdGFydCkgPT09IFwibnVtYmVyXCIgPyBjLnN0YXJ0IDogdGhpcy5jb29yZHMuc3RhcnQpLCAxLCBjZmcuY2hyLmxlbmd0aCk7XG5cblx0Ly8gU2V0IGNmZy5lbmQgdG8gYmUgdGhlIHNwZWNpZmllZCBlbmQgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBlbmRcblx0Ly8gQ2xpcCBhdCBjaHIgYm91bmRhcmllc1xuXHRjZmcuZW5kID0gY2xpcChNYXRoLnJvdW5kKHR5cGVvZihjLmVuZCkgPT09IFwibnVtYmVyXCIgPyBjLmVuZCA6IHRoaXMuY29vcmRzLmVuZCksIDEsIGNmZy5jaHIubGVuZ3RoKTtcblxuXHQvLyBFbnN1cmUgc3RhcnQgPD0gZW5kXG5cdGlmIChjZmcuc3RhcnQgPiBjZmcuZW5kKSB7XG5cdCAgIGxldCB0bXAgPSBjZmcuc3RhcnQ7IGNmZy5zdGFydCA9IGNmZy5lbmQ7IGNmZy5lbmQgPSB0bXA7XG5cdH1cblxuXHQvLyBsYW5kbWFyayBjb29yZGluYXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBOT1RFIHRoYXQgbGFuZG1hcmsgY29vcmRpbmF0ZSBjYW5ub3QgYmUgZnVsbHkgcmVzb2x2ZWQgdG8gYWJzb2x1dGUgY29vcmRpbmF0ZSB1bnRpbFxuXHQvLyAqYWZ0ZXIqIGdlbm9tZSBkYXRhIGhhdmUgYmVlbiBsb2FkZWQuIFNlZSBzZXRDb250ZXh0IGFuZCByZXNvbHZlTGFuZG1hcmsgbWV0aG9kcy5cblx0Y2ZnLmxhbmRtYXJrID0gYy5sYW5kbWFyayB8fCB0aGlzLmxjb29yZHMubGFuZG1hcms7XG5cdGNmZy5kZWx0YSAgICA9IE1hdGgucm91bmQoJ2RlbHRhJyBpbiBjID8gYy5kZWx0YSA6ICh0aGlzLmxjb29yZHMuZGVsdGEgfHwgMCkpO1xuXHRpZiAoJ2ZsYW5rJyBpbiBjKXtcblx0ICAgIGNmZy5mbGFuayA9IE1hdGgucm91bmQoYy5mbGFuayk7XG5cdH1cblx0ZWxzZSBpZiAoJ2xlbmd0aCcgaW4gYykge1xuXHQgICAgY2ZnLmxlbmd0aCA9IE1hdGgucm91bmQoYy5sZW5ndGgpO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgY2ZnLmxlbmd0aCA9IE1hdGgucm91bmQodGhpcy5jb29yZHMuZW5kIC0gdGhpcy5jb29yZHMuc3RhcnQgKyAxKTtcblx0fVxuXG5cdC8vIGNtb2RlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGlmIChjLmNtb2RlICYmIGMuY21vZGUgIT09ICdtYXBwZWQnICYmIGMuY21vZGUgIT09ICdsYW5kbWFyaycpIGMuY21vZGUgPSBudWxsO1xuXHRjZmcuY21vZGUgPSBjLmNtb2RlIHx8IFxuXHQgICAgKCgnY2hyJyBpbiBjIHx8ICdzdGFydCcgaW4gYyB8fCAnZW5kJyBpbiBjKSA/XG5cdCAgICAgICAgJ21hcHBlZCcgOiBcblx0XHQoJ2xhbmRtYXJrJyBpbiBjIHx8ICdmbGFuaycgaW4gYyB8fCAnbGVuZ3RoJyBpbiBjIHx8ICdkZWx0YScgaW4gYykgP1xuXHRcdCAgICAnbGFuZG1hcmsnIDogXG5cdFx0ICAgIHRoaXMuY21vZGUgfHwgJ21hcHBlZCcpO1xuXG5cdC8vIGhpZ2hsaWdodGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIFNldCBjZmcuaGlnaGxpZ2h0XG5cdC8vICAgIHdpdGggZmFsbGJhY2sgdG8gY3VycmVudCBoaWdobGlnaHRcblx0Ly8gICAgICAgIHdpdGggZmFsbGJhY2sgdG8gW11cblx0Y2ZnLmhpZ2hsaWdodCA9IGMuaGlnaGxpZ2h0IHx8IHRoaXMuem9vbVZpZXcuaGlnaGxpZ2h0ZWQgfHwgW107XG5cblx0Ly8gZHJhd2luZyBtb2RlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gU2V0IHRoZSBkcmF3aW5nIG1vZGUgZm9yIHRoZSBab29tVmlldy5cblx0Ly8gICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgdmFsdWVcblx0aWYgKGMuZG1vZGUgPT09ICdjb21wYXJpc29uJyB8fCBjLmRtb2RlID09PSAncmVmZXJlbmNlJykgXG5cdCAgICBjZmcuZG1vZGUgPSBjLmRtb2RlO1xuXHRlbHNlXG5cdCAgICBjZmcuZG1vZGUgPSB0aGlzLnpvb21WaWV3LmRtb2RlIHx8ICdjb21wYXJpc29uJztcblxuXHQvL1xuXHRyZXR1cm4gY2ZnO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNldHMgdGhlIGN1cnJlbnQgY29udGV4dCBmcm9tIHRoZSBjb25maWcgb2JqZWN0LiBcbiAgICAvLyBPbmx5IHRob3NlIGNvbnRleHQgaXRlbXMgc3BlY2lmaWVkIGluIHRoZSBjb25maWcgYXJlIGFmZmVjdGVkLCBleGNlcHQgYXMgbm90ZWQuXG4gICAgLy9cbiAgICAvLyBBbGwgY29uZmlncyBhcmUgc2FuaXRpemVkIGJlZm9yZSBiZWluZyBhcHBsaWVkIChzZWUgc2FuaXRpemVDZmcpLlxuICAgIC8vIFxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgYyAob2JqZWN0KSBBIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHRoYXQgc3BlY2lmaWVzIHNvbWUvYWxsIGNvbmZpZyB2YWx1ZXMuXG4gICAgLy8gICAgICAgICBUaGUgcG9zc2libGUgY29uZmlnIGl0ZW1zOlxuICAgIC8vICAgICAgICAgICAgZ2Vub21lcyAgIChsaXN0IG8gc3RyaW5ncykgQWxsIHRoZSBnZW5vbWVzIHlvdSB3YW50IHRvIHNlZSwgaW4gdG9wLXRvLWJvdHRvbSBvcmRlci4gXG4gICAgLy8gICAgICAgICAgICAgICBNYXkgdXNlIGludGVybmFsIG5hbWVzIG9yIGRpc3BsYXkgbGFiZWxzLCBlZywgXCJtdXNfbXVzY3VsdXNfMTI5czFzdmltalwiIG9yIFwiMTI5UzEvU3ZJbUpcIi5cbiAgICAvLyAgICAgICAgICAgIHJlZiAgICAgICAoc3RyaW5nKSBUaGUgZ2Vub21lIHRvIHVzZSBhcyB0aGUgcmVmZXJlbmNlLiBNYXkgYmUgbmFtZSBvciBsYWJlbC5cbiAgICAvLyAgICAgICAgICAgIGhpZ2hsaWdodCAobGlzdCBvIHN0cmluZ3MpIElEcyBvZiBmZWF0dXJlcyB0byBoaWdobGlnaHRcbiAgICAvLyAgICAgICAgICAgIGRtb2RlICAgICAoc3RyaW5nKSBlaXRoZXIgJ2NvbXBhcmlzb24nIG9yICdyZWZlcmVuY2UnXG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIENvb3JkaW5hdGVzIGFyZSBzcGVjaWZpZWQgaW4gb25lIG9mIDIgZm9ybXMuXG4gICAgLy8gICAgICAgICAgICAgIGNociAgICAgICAoc3RyaW5nKSBDaHJvbW9zb21lIGZvciBjb29yZGluYXRlIHJhbmdlXG4gICAgLy8gICAgICAgICAgICAgIHN0YXJ0ICAgICAoaW50KSBDb29yZGluYXRlIHJhbmdlIHN0YXJ0IHBvc2l0aW9uXG4gICAgLy8gICAgICAgICAgICAgIGVuZCAgICAgICAoaW50KSBDb29yZGluYXRlIHJhbmdlIGVuZCBwb3NpdGlvblxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAgIERpc3BsYXlzIHRoaXMgY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBnZW5lb21zLCBhbmQgdGhlIGVxdWl2YWxlbnQgKG1hcHBlZClcbiAgICAvLyAgICAgICAgICAgICAgY29vcmRpbmF0ZSByYW5nZShzKSBpbiBlYWNoIGNvbXBhcmlzb24gZ2Vub21lLlxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICBvcjpcbiAgICAvLyAgICAgICAgICAgICAgbGFuZG1hcmsgIChzdHJpbmcpIElELCBjYW5vbmljYWwgSUQsIG9yIHN5bWJvbCwgaWRlbnRpZnlpbmcgYSBmZWF0dXJlLlxuICAgIC8vICAgICAgICAgICAgICBmbGFua3xsZW5ndGggKGludCkgSWYgZmxhbmssIHZpZXdpbmcgcmVnaW9uIHNpemUgPSBmbGFuayArIGxlbihsYW5kbWFyaykgKyBmbGFuay4gXG4gICAgLy8gICAgICAgICAgICAgICAgIElmIGxlbmd0aCwgdmlld2luZyByZWdpb24gc2l6ZSA9IGxlbmd0aC4gSW4gZWl0aGVyIGNhc2UsIHRoZSBsYW5kbWFyayBpcyBjZW50ZXJlZCBpblxuICAgIC8vICAgICAgICAgICAgICAgICB0aGUgdmlld2luZyBhcmVhLCArLy0gYW55IHNwZWNpZmllZCBkZWx0YS5cbiAgICAvLyAgICAgICAgICAgICAgZGVsdGEgICAgIChpbnQpIEFtb3VudCBpbiBicCB0byBzaGlmdCB0aGUgcmVnaW9uIGxlZnQgKDwwKSBvciByaWdodCAoPjApLlxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAgIERpc3BsYXlzIHRoZSByZWdpb24gYXJvdW5kIHRoZSBzcGVjaWZpZWQgbGFuZG1hcmsgaW4gZWFjaCBnZW5vbWUgd2hlcmUgaXQgZXhpc3RzLlxuICAgIC8vXG4gICAgLy8gICAgcXVpZXRseSAoYm9vbGVhbikgSWYgdHJ1ZSwgZG9uJ3QgdXBkYXRlIGJyb3dzZXIgaGlzdG9yeSAoYXMgd2hlbiBnb2luZyBiYWNrKVxuICAgIC8vXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgICBOb3RoaW5nXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vXHQgIFJlZHJhd3MgXG4gICAgLy9cdCAgQ2FsbHMgY29udGV4dENoYW5nZWQoKSBcbiAgICAvL1xuICAgIHNldENvbnRleHQgKGMsIHF1aWV0bHkpIHtcbiAgICAgICAgbGV0IGNmZyA9IHRoaXMuc2FuaXRpemVDZmcoYyk7XG5cdGNvbnNvbGUubG9nKFwiU2V0IGNvbnRleHQgKHJhdyk6XCIsIGMpO1xuXHRjb25zb2xlLmxvZyhcIlNldCBjb250ZXh0IChzYW5pdGl6ZWQpOlwiLCBjZmcpO1xuXHRpZiAoIWNmZykgcmV0dXJuO1xuXHR0aGlzLnNob3dCdXN5KHRydWUsICdSZXF1ZXN0aW5nIGRhdGEuLi4nKTtcblx0bGV0IHAgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmxvYWRHZW5vbWVzKGNmZy5nZW5vbWVzKS50aGVuKCgpID0+IHtcblx0ICAgIGlmIChjZmcuY21vZGUgPT09ICdsYW5kbWFyaycpIHtcblx0ICAgICAgICBjZmcgPSB0aGlzLnJlc29sdmVMYW5kbWFyayhjZmcpO1xuXHRcdGlmICghY2ZnKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTGFuZG1hcmsgZG9lcyBub3QgZXhpc3QgaW4gY3VycmVudCByZWZlcmVuY2UgZ2Vub21lLiBQbGVhc2UgY2hhbmdlIHRoZSByZWZlcmVuY2UgZ2Vub21lIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdCAgICB0aGlzLnNob3dCdXN5KGZhbHNlKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0ICAgIH1cblx0ICAgIHRoaXMudkdlbm9tZXMgPSBjZmcuZ2Vub21lcztcblx0ICAgIHRoaXMuckdlbm9tZSAgPSBjZmcucmVmO1xuXHQgICAgdGhpcy5jR2Vub21lcyA9IGNmZy5nZW5vbWVzLmZpbHRlcihnID0+IGcgIT09IGNmZy5yZWYpO1xuXHQgICAgdGhpcy5zZXRSZWZHZW5vbWVTZWxlY3Rpb24odGhpcy5yR2Vub21lLm5hbWUpO1xuXHQgICAgdGhpcy5zZXRDb21wR2Vub21lc1NlbGVjdGlvbih0aGlzLnZHZW5vbWVzLm1hcChnPT5nLm5hbWUpKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLmNtb2RlID0gY2ZnLmNtb2RlO1xuXHQgICAgLy9cblx0ICAgIHJldHVybiB0aGlzLnRyYW5zbGF0b3IucmVhZHkoKTtcblx0fSkudGhlbigoKSA9PiB7XG5cdCAgICAvL1xuXHQgICAgaWYgKCFjZmcpIHJldHVybjtcblx0ICAgIHRoaXMuY29vcmRzICAgPSB7XG5cdCAgICAgICAgY2hyOiBjZmcuY2hyLm5hbWUsXG5cdFx0c3RhcnQ6IGNmZy5zdGFydCxcblx0XHRlbmQ6IGNmZy5lbmRcblx0ICAgIH07XG5cdCAgICB0aGlzLmxjb29yZHMgID0ge1xuXHQgICAgICAgIGxhbmRtYXJrOiBjZmcubGFuZG1hcmssIFxuXHRcdGxhbmRtYXJrUmVmRmVhdDogY2ZnLmxhbmRtYXJrUmVmRmVhdCxcblx0XHRsYW5kbWFya0ZlYXRzOiBjZmcubGFuZG1hcmtGZWF0cyxcblx0XHRmbGFuazogY2ZnLmZsYW5rLCBcblx0XHRsZW5ndGg6IGNmZy5sZW5ndGgsIFxuXHRcdGRlbHRhOiBjZmcuZGVsdGEgXG5cdCAgICB9O1xuXHQgICAgLy9cblx0ICAgIHRoaXMuem9vbVZpZXcuaGlnaGxpZ2h0ZWQgPSBjZmcuaGlnaGxpZ2h0O1xuXHQgICAgdGhpcy56b29tVmlldy5nZW5vbWVzID0gdGhpcy52R2Vub21lcztcblx0ICAgIHRoaXMuem9vbVZpZXcuZG1vZGUgPSBjZmcuZG1vZGU7XG5cdCAgICB0aGlzLnpvb21WaWV3LnVwZGF0ZSgpO1xuXHQgICAgLy9cblx0ICAgIHRoaXMuZ2Vub21lVmlldy5yZWRyYXcoKTtcblx0ICAgIHRoaXMuZ2Vub21lVmlldy5zZXRCcnVzaENvb3Jkcyh0aGlzLmNvb3Jkcyk7XG5cdCAgICAvL1xuXHQgICAgaWYgKCFxdWlldGx5KVxuXHQgICAgICAgIHRoaXMuY29udGV4dENoYW5nZWQoKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLnNob3dCdXN5KGZhbHNlKTtcblx0fSk7XG5cdHJldHVybiBwO1xuICAgIH1cbiBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRDb29yZGluYXRlcyAoc3RyKSB7XG5cdGxldCBjb29yZHMgPSBwYXJzZUNvb3JkcyhzdHIpO1xuXHRpZiAoISBjb29yZHMpIHtcblx0ICAgIGxldCBmZWF0cyA9IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsKHN0cik7XG5cdCAgICBsZXQgZmVhdHMyID0gZmVhdHMuZmlsdGVyKGY9PmYuZ2Vub21lID09IHRoaXMuckdlbm9tZSk7XG5cdCAgICBsZXQgZiA9IGZlYXRzMlswXSB8fCBmZWF0c1swXTtcblx0ICAgIGlmIChmKSB7XG5cdFx0Y29vcmRzID0ge1xuXHRcdCAgICByZWY6IGYuZ2Vub21lLm5hbWUsXG5cdFx0ICAgIGxhbmRtYXJrOiBzdHIsXG5cdFx0ICAgIGRlbHRhOiAwLFxuXHRcdCAgICBoaWdobGlnaHQ6IGYuaWRcblx0XHR9XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRhbGVydChcIlVuYWJsZSB0byBzZXQgY29vcmRpbmF0ZXMgd2l0aCB0aGlzIHZhbHVlOiBcIiArIHN0cik7XG5cdFx0cmV0dXJuO1xuXHQgICAgfVxuXHR9XG5cdHRoaXMuc2V0Q29udGV4dChjb29yZHMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlc2l6ZSAoKSB7XG5cdGxldCB3ID0gd2luZG93LmlubmVyV2lkdGggLSAyNDtcblx0dGhpcy5nZW5vbWVWaWV3LmZpdFRvV2lkdGgodyk7XG5cdHRoaXMuem9vbVZpZXcuZml0VG9XaWR0aCh3KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgY3VycmVudCBjb250ZXh0IGFzIGEgcGFyYW1ldGVyIHN0cmluZ1xuICAgIC8vIEN1cnJlbnQgY29udGV4dCA9IHJlZiBnZW5vbWUgKyBjb21wIGdlbm9tZXMgKyBjdXJyZW50IHJhbmdlIChjaHIsc3RhcnQsZW5kKVxuICAgIGdldFBhcmFtU3RyaW5nICgpIHtcblx0bGV0IGMgPSB0aGlzLmdldENvbnRleHQoKTtcbiAgICAgICAgbGV0IHJlZiA9IGByZWY9JHtjLnJlZn1gO1xuICAgICAgICBsZXQgZ2Vub21lcyA9IGBnZW5vbWVzPSR7Yy5nZW5vbWVzLmpvaW4oXCIrXCIpfWA7XG5cdGxldCBjb29yZHMgPSBgY2hyPSR7Yy5jaHJ9JnN0YXJ0PSR7Yy5zdGFydH0mZW5kPSR7Yy5lbmR9YDtcblx0bGV0IGxmbGYgPSBjLmZsYW5rID8gJyZmbGFuaz0nK2MuZmxhbmsgOiAnJmxlbmd0aD0nK2MubGVuZ3RoO1xuXHRsZXQgbGNvb3JkcyA9IGBsYW5kbWFyaz0ke2MubGFuZG1hcmt9JmRlbHRhPSR7Yy5kZWx0YX0ke2xmbGZ9YDtcblx0bGV0IGhscyA9IGBoaWdobGlnaHQ9JHtjLmhpZ2hsaWdodC5qb2luKFwiK1wiKX1gO1xuXHRsZXQgZG1vZGUgPSBgZG1vZGU9JHtjLmRtb2RlfWA7XG5cdHJldHVybiBgJHt0aGlzLmNtb2RlPT09J21hcHBlZCc/Y29vcmRzOmxjb29yZHN9JiR7ZG1vZGV9JiR7cmVmfSYke2dlbm9tZXN9JiR7aGxzfWA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGN1cnJlbnRMaXN0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Vyckxpc3Q7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldCBjdXJyZW50TGlzdCAobHN0KSB7XG4gICAgXHQvL1xuXHRsZXQgcHJldkxpc3QgPSB0aGlzLmN1cnJMaXN0O1xuXHR0aGlzLmN1cnJMaXN0ID0gbHN0O1xuXHQvL1xuXHRsZXQgbGlzdHMgPSBkMy5zZWxlY3QoJyNteWxpc3RzJykuc2VsZWN0QWxsKCcubGlzdEluZm8nKTtcblx0bGlzdHMuY2xhc3NlZChcImN1cnJlbnRcIiwgZCA9PiBkID09PSBsc3QpO1xuXHQvL1xuXHRpZiAobHN0ICYmIGxzdC5pZHMubGVuZ3RoID4gMCkge1xuXHQgICAgaWYgKGxzdCA9PT0gcHJldkxpc3QpXG5cdCAgICAgICAgdGhpcy5jdXJyTGlzdENvdW50ZXIgPSAodGhpcy5jdXJyTGlzdENvdW50ZXIgKyAxKSAlIHRoaXMuY3Vyckxpc3QuaWRzLmxlbmd0aDtcblx0ICAgIGVsc2Vcblx0ICAgICAgICB0aGlzLmN1cnJMaXN0Q291bnRlciA9IDA7XG5cdCAgICBsZXQgY3VycklkID0gbHN0Lmlkc1t0aGlzLmN1cnJMaXN0Q291bnRlcl07XG5cdCAgICAvLyBzaG93IHRoaXMgbGlzdCBhcyB0aWNrIG1hcmtzIGluIHRoZSBnZW5vbWUgdmlld1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdUaWNrcyhsc3QuaWRzKTtcblx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3VGl0bGUoKTtcblx0ICAgIHRoaXMuc2V0Q29vcmRpbmF0ZXMoY3VycklkKTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuY3Vyckxpc3RDb3VudGVyID0gMDtcblx0ICAgIC8vXG5cdCAgICB0aGlzLnpvb21WaWV3LmhpRmVhdHMgPSB7fTtcblx0ICAgIHRoaXMuem9vbVZpZXcudXBkYXRlKCk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdUaWNrcyhbXSk7XG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd1RpdGxlKCk7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBwYW56b29tKHBmYWN0b3IsIHpmYWN0b3IpIHtcblx0Ly9cblx0IXBmYWN0b3IgJiYgKHBmYWN0b3IgPSAwKTtcblx0IXpmYWN0b3IgJiYgKHpmYWN0b3IgPSAxKTtcblx0Ly9cblx0bGV0IGMgPSB0aGlzLmNvb3Jkcztcblx0bGV0IHdpZHRoID0gYy5lbmQgLSBjLnN0YXJ0ICsgMTtcblx0bGV0IG1pZCA9IChjLnN0YXJ0ICsgYy5lbmQpLzI7XG5cdGxldCBjaHIgPSB0aGlzLnJHZW5vbWUuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSB0aGlzLmNvb3Jkcy5jaHIpWzBdO1xuXHRsZXQgbmN4dCA9IHt9OyAvLyBuZXcgY29udGV4dFxuXHRsZXQgbWluRCA9IC0oYy5zdGFydC0xKTsgLy8gbWluIGRlbHRhIChhdCBjdXJyZW50IHpvb20pXG5cdGxldCBtYXhEID0gY2hyLmxlbmd0aCAtIGMuZW5kOyAvLyBtYXggZGVsdGEgKGF0IGN1cnJlbnQgem9vbSlcblx0bGV0IGQgPSBjbGlwKHBmYWN0b3IgKiB3aWR0aCwgbWluRCwgbWF4RCk7IC8vIGRlbHRhIChhdCBuZXcgem9vbSlcblx0bGV0IG5ld3dpZHRoID0gemZhY3RvciAqIHdpZHRoO1xuXHRsZXQgbmV3c3RhcnQgPSBtaWQgLSBuZXd3aWR0aC8yICsgZDtcblx0Ly9cblx0aWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKSB7XG5cdCAgICBuY3h0LmNociA9IGMuY2hyO1xuXHQgICAgbmN4dC5zdGFydCA9IG5ld3N0YXJ0O1xuXHQgICAgbmN4dC5lbmQgPSBuZXdzdGFydCArIG5ld3dpZHRoIC0gMTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIG5jeHQubGVuZ3RoID0gbmV3d2lkdGg7XG5cdCAgICBuY3h0LmRlbHRhID0gdGhpcy5sY29vcmRzLmRlbHRhICsgZCA7XG5cdH1cblx0dGhpcy5zZXRDb250ZXh0KG5jeHQpO1xuICAgIH1cbiAgICB6b29tIChmYWN0b3IpIHtcbiAgICAgICAgdGhpcy5wYW56b29tKG51bGwsIGZhY3Rvcik7XG4gICAgfVxuICAgIHBhbiAoZmFjdG9yKSB7XG4gICAgICAgIHRoaXMucGFuem9vbShmYWN0b3IsIG51bGwpO1xuICAgIH1cdFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFpvb21zIGluL291dCBieSBmYWN0b3IuIE5ldyB6b29tIHdpZHRoIGlzIGZhY3RvciAqIHRoZSBjdXJyZW50IHdpZHRoLlxuICAgIC8vIEZhY3RvciA+IDEgem9vbXMgb3V0LCAwIDwgZmFjdG9yIDwgMSB6b29tcyBpbi5cbiAgICB4em9vbSAoZmFjdG9yKSB7XG5cdGxldCBsZW4gPSB0aGlzLmNvb3Jkcy5lbmQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDE7XG5cdGxldCBuZXdsZW4gPSBNYXRoLnJvdW5kKGZhY3RvciAqIGxlbik7XG5cdGxldCB4ID0gKHRoaXMuY29vcmRzLnN0YXJ0ICsgdGhpcy5jb29yZHMuZW5kKS8yO1xuXHRpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpIHtcblx0ICAgIGxldCBuZXdzdGFydCA9IE1hdGgucm91bmQoeCAtIG5ld2xlbi8yKTtcblx0ICAgIHRoaXMuc2V0Q29udGV4dCh7IGNocjogdGhpcy5jb29yZHMuY2hyLCBzdGFydDogbmV3c3RhcnQsIGVuZDogbmV3c3RhcnQgKyBuZXdsZW4gLSAxIH0pO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgbGVuZ3RoOiBuZXdsZW4gfSk7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQYW5zIHRoZSB2aWV3IGxlZnQgb3IgcmlnaHQgYnkgZmFjdG9yLiBUaGUgZGlzdGFuY2UgbW92ZWQgaXMgZmFjdG9yIHRpbWVzIHRoZSBjdXJyZW50IHpvb20gd2lkdGguXG4gICAgLy8gTmVnYXRpdmUgdmFsdWVzIHBhbiBsZWZ0LiBQb3NpdGl2ZSB2YWx1ZXMgcGFuIHJpZ2h0LiAoTm90ZSB0aGF0IHBhbm5pbmcgbW92ZXMgdGhlIFwiY2FtZXJhXCIuIFBhbm5pbmcgdG8gdGhlXG4gICAgLy8gcmlnaHQgbWFrZXMgdGhlIG9iamVjdHMgaW4gdGhlIHNjZW5lIGFwcGVhciB0byBtb3ZlIHRvIHRoZSBsZWZ0LCBhbmQgdmljZSB2ZXJzYS4pXG4gICAgLy9cbiAgICB4cGFuIChmYWN0b3IpIHtcblx0bGV0IGMgPSB0aGlzLmNvb3Jkcztcblx0bGV0IGNociA9IHRoaXMuckdlbm9tZS5jaHJvbW9zb21lcy5maWx0ZXIoYyA9PiBjLm5hbWUgPT09IHRoaXMuY29vcmRzLmNocilbMF07XG5cdGxldCB3aWR0aCA9IGMuZW5kIC0gYy5zdGFydCArIDE7XG5cdGxldCBtaW5EID0gLShjLnN0YXJ0LTEpO1xuXHRsZXQgbWF4RCA9IGNoci5sZW5ndGggLSBjLmVuZDtcblx0bGV0IGQgPSBjbGlwKGZhY3RvciAqIHdpZHRoLCBtaW5ELCBtYXhEKTtcblx0aWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKSB7XG5cdCAgICB0aGlzLnNldENvbnRleHQoeyBjaHI6IGMuY2hyLCBzdGFydDogYy5zdGFydCtkLCBlbmQ6IGMuZW5kK2QgfSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICB0aGlzLnNldENvbnRleHQoeyBkZWx0YTogdGhpcy5sY29vcmRzLmRlbHRhICsgZCB9KTtcblx0fVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXRGZWF0VHlwZUNvbnRyb2wgKGZhY2V0KSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0bGV0IGNvbG9ycyA9IHRoaXMuY3NjYWxlLmRvbWFpbigpLm1hcChsYmwgPT4ge1xuXHQgICAgcmV0dXJuIHsgbGJsOmxibCwgY2xyOnRoaXMuY3NjYWxlKGxibCkgfTtcblx0fSk7XG5cdGxldCBja2VzID0gZDMuc2VsZWN0KFwiLmNvbG9yS2V5XCIpXG5cdCAgICAuc2VsZWN0QWxsKCcuY29sb3JLZXlFbnRyeScpXG5cdFx0LmRhdGEoY29sb3JzKTtcblx0bGV0IG5jcyA9IGNrZXMuZW50ZXIoKS5hcHBlbmQoXCJkaXZcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjb2xvcktleUVudHJ5IGZsZXhyb3dcIik7XG5cdG5jcy5hcHBlbmQoXCJkaXZcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcInN3YXRjaFwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGMgPT4gYy5sYmwpXG5cdCAgICAuc3R5bGUoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGMgPT4gYy5jbHIpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IHQgPSBkMy5zZWxlY3QodGhpcyk7XG5cdCAgICAgICAgdC5jbGFzc2VkKFwiY2hlY2tlZFwiLCAhIHQuY2xhc3NlZChcImNoZWNrZWRcIikpO1xuXHRcdGxldCBzd2F0Y2hlcyA9IGQzLnNlbGVjdEFsbChcIi5zd2F0Y2guY2hlY2tlZFwiKVswXTtcblx0XHRsZXQgZnRzID0gc3dhdGNoZXMubWFwKHM9PnMuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSlcblx0XHRmYWNldC5zZXRWYWx1ZXMoZnRzKTtcblx0XHRzZWxmLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHQgICAgfSlcblx0ICAgIC5hcHBlbmQoXCJpXCIpXG5cdCAgICAgICAgLmF0dHIoXCJjbGFzc1wiLFwibWF0ZXJpYWwtaWNvbnNcIik7XG5cdG5jcy5hcHBlbmQoXCJzcGFuXCIpXG5cdCAgICAudGV4dChjID0+IGMubGJsKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsaW5rVG9NZ2lTbnBSZXBvcnQgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRsZXQgdXJsQmFzZSA9ICdodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvc25wL3N1bW1hcnknO1xuXHRsZXQgdGFiQXJnID0gJ3NlbGVjdGVkVGFiPTEnO1xuXHRsZXQgc2VhcmNoQnlBcmcgPSAnc2VhcmNoQnlTYW1lRGlmZj0nO1xuXHRsZXQgY2hyQXJnID0gYHNlbGVjdGVkQ2hyb21vc29tZT0ke2MuY2hyfWA7XG5cdGxldCBjb29yZEFyZyA9IGBjb29yZGluYXRlPSR7Yy5zdGFydH0tJHtjLmVuZH1gO1xuXHRsZXQgdW5pdEFyZyA9ICdjb29yZGluYXRlVW5pdD1icCc7XG5cdGxldCBjc0FyZ3MgPSBjLmdlbm9tZXMubWFwKGcgPT4gYHNlbGVjdGVkU3RyYWlucz0ke2d9YClcblx0bGV0IHJzQXJnID0gYHJlZmVyZW5jZVN0cmFpbj0ke2MucmVmfWA7XG5cdGxldCBsaW5rVXJsID0gYCR7dXJsQmFzZX0/JHt0YWJBcmd9JiR7c2VhcmNoQnlBcmd9JiR7Y2hyQXJnfSYke2Nvb3JkQXJnfSYke3VuaXRBcmd9JiR7cnNBcmd9JiR7Y3NBcmdzLmpvaW4oJyYnKX1gXG5cdHdpbmRvdy5vcGVuKGxpbmtVcmwsIFwiX2JsYW5rXCIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsaW5rVG9NZ2lRVExzICgpIHtcblx0bGV0IGMgICAgICAgID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdGxldCB1cmxCYXNlICA9ICdodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvYWxsZWxlL3N1bW1hcnknO1xuXHRsZXQgY2hyQXJnICAgPSBgY2hyb21vc29tZT0ke2MuY2hyfWA7XG5cdGxldCBjb29yZEFyZyA9IGBjb29yZGluYXRlPSR7Yy5zdGFydH0tJHtjLmVuZH1gO1xuXHRsZXQgdW5pdEFyZyAgPSAnY29vcmRVbml0PWJwJztcblx0bGV0IHR5cGVBcmcgID0gJ2FsbGVsZVR5cGU9UVRMJztcblx0bGV0IGxpbmtVcmwgID0gYCR7dXJsQmFzZX0/JHtjaHJBcmd9JiR7Y29vcmRBcmd9JiR7dW5pdEFyZ30mJHt0eXBlQXJnfWA7XG5cdHdpbmRvdy5vcGVuKGxpbmtVcmwsIFwiX2JsYW5rXCIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsaW5rVG9NZ2lKQnJvd3NlICgpIHtcblx0bGV0IGMgPSB0aGlzLmdldENvbnRleHQoKTtcblx0bGV0IHVybEJhc2UgPSAnaHR0cDovL2picm93c2UuaW5mb3JtYXRpY3MuamF4Lm9yZy8nO1xuXHRsZXQgZGF0YUFyZyA9ICdkYXRhPWRhdGElMkZtb3VzZSc7IC8vIFwiZGF0YS9tb3VzZVwiXG5cdGxldCBsb2NBcmcgID0gYGxvYz1jaHIke2MuY2hyfSUzQSR7Yy5zdGFydH0uLiR7Yy5lbmR9YDtcblx0bGV0IHRyYWNrcyAgPSBbJ0ROQScsJ01HSV9HZW5vbWVfRmVhdHVyZXMnLCdOQ0JJX0NDRFMnLCdOQ0JJJywnRU5TRU1CTCddO1xuXHRsZXQgdHJhY2tzQXJnPWB0cmFja3M9JHt0cmFja3Muam9pbignLCcpfWA7XG5cdGxldCBoaWdobGlnaHRBcmcgPSAnaGlnaGxpZ2h0PSc7XG5cdGxldCBsaW5rVXJsID0gYCR7dXJsQmFzZX0/JHsgW2RhdGFBcmcsbG9jQXJnLHRyYWNrc0FyZyxoaWdobGlnaHRBcmddLmpvaW4oJyYnKSB9YDtcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgTUdWQXBwXG5cbmV4cG9ydCB7IE1HVkFwcCB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTUdWQXBwLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIEdlbm9tZSB7XG4gIGNvbnN0cnVjdG9yIChjZmcpIHtcbiAgICB0aGlzLm5hbWUgPSBjZmcubmFtZTtcbiAgICB0aGlzLmxhYmVsPSBjZmcubGFiZWw7XG4gICAgdGhpcy5jaHJvbW9zb21lcyA9IFtdO1xuICAgIHRoaXMubWF4bGVuID0gLTE7XG4gICAgdGhpcy54c2NhbGUgPSBudWxsO1xuICAgIHRoaXMueXNjYWxlID0gbnVsbDtcbiAgICB0aGlzLnpvb21ZICA9IC0xO1xuICB9XG4gIGdldENocm9tb3NvbWUgKG4pIHtcbiAgICAgIGlmICh0eXBlb2YobikgPT09ICdzdHJpbmcnKVxuXHQgIHJldHVybiB0aGlzLmNocm9tb3NvbWVzLmZpbHRlcihjID0+IGMubmFtZSA9PT0gbilbMF07XG4gICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2hyb21vc29tZXNbbl07XG4gIH1cbiAgaGFzQ2hyb21vc29tZSAobikge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2hyb21vc29tZShuKSA/IHRydWUgOiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgeyBHZW5vbWUgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0dlbm9tZS5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge2QzanNvbiwgb3ZlcmxhcHMsIHN1YnRyYWN0fSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7RmVhdHVyZX0gZnJvbSAnLi9GZWF0dXJlJztcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBIb3cgdGhlIGFwcCBsb2FkcyBmZWF0dXJlIGRhdGEuIFByb3ZpZGVzIHR3byBjYWxsczpcbi8vICAgLSBnZXQgZmVhdHVyZXMgaW4gcmFuZ2Vcbi8vICAgLSBnZXQgZmVhdHVyZXMgYnkgaWRcbi8vIFJlcXVlc3RzIGZlYXR1cmVzIGZyb20gdGhlIHNlcnZlciBhbmQgcmVnaXN0ZXJzIHRoZW0gaW4gYSBjYWNoZS5cbi8vIEludGVyYWN0cyB3aXRoIHRoZSBiYWNrIGVuZCB0byBsb2FkIGZlYXR1cmVzOyB0cmllcyBub3QgdG8gcmVxdWVzdFxuLy8gdGhlIHNhbWUgcmVnaW9uIHR3aWNlLlxuLy9cbmNsYXNzIEZlYXR1cmVNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLmlkMmZlYXQgPSB7fTtcdFx0Ly8gaW5kZXggZnJvbSAgZmVhdHVyZSBJRCB0byBmZWF0dXJlXG5cdHRoaXMuY2Fub25pY2FsMmZlYXRzID0ge307XHQvLyBpbmRleCBmcm9tIGNhbm9uaWNhbCBJRCAtPiBbIGZlYXR1cmVzIHRhZ2dlZCB3aXRoIHRoYXQgaWQgXVxuXHR0aGlzLnN5bWJvbDJmZWF0cyA9IHt9XHRcdC8vIGluZGV4IGZyb20gc3ltYm9sIC0+IFsgZmVhdHVyZXMgaGF2aW5nIHRoYXQgc3ltYm9sIF1cblx0dGhpcy5jYWNoZSA9IHt9O1x0XHQvLyB7Z2Vub21lLm5hbWUgLT4ge2Noci5uYW1lIC0+IGxpc3Qgb2YgYmxvY2tzfX1cblx0dGhpcy5taW5lRmVhdHVyZUNhY2hlID0ge307XHQvLyBhdXhpbGlhcnkgaW5mbyBwdWxsZWQgZnJvbSBNb3VzZU1pbmUgXG5cdHRoaXMubG9hZGVkR2Vub21lcyA9IG5ldyBTZXQoKTsgLy8gdGhlIHNldCBvZiBHZW5vbWVzIHRoYXQgaGF2ZSBiZWVuIGZ1bGx5IGxvYWRlZFxuICAgIH1cbiBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQcm9jZXNzZXMgdGhlIFwicmF3XCIgZmVhdHVyZXMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlci5cbiAgICAvLyBUdXJucyB0aGVtIGludG8gRmVhdHVyZSBvYmplY3RzIGFuZCByZWdpc3RlcnMgdGhlbS5cbiAgICAvLyBJZiB0aGUgc2FtZSByYXcgZmVhdHVyZSBpcyByZWdpc3RlcmVkIGFnYWluLFxuICAgIC8vIHRoZSBGZWF0dXJlIG9iamVjdCBjcmVhdGVkIHRoZSBmaXJzdCB0aW1lIGlzIHJldHVybmVkLlxuICAgIC8vIChJLmUuLCByZWdpc3RlcmluZyB0aGUgc2FtZSBmZWF0dXJlIG11bHRpcGxlIHRpbWVzIGlzIG9rKVxuICAgIC8vXG4gICAgcHJvY2Vzc0ZlYXR1cmVzIChmZWF0cywgZ2Vub21lKSB7XG5cdHJldHVybiBmZWF0cy5tYXAoZCA9PiB7XG5cdCAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCB0aGlzIG9uZSBpbiB0aGUgY2FjaGUsIHJldHVybiBpdC5cblx0ICAgIGxldCBmID0gdGhpcy5pZDJmZWF0W2QubWdwaWRdO1xuXHQgICAgaWYgKGYpIHJldHVybiBmO1xuXHQgICAgLy8gQ3JlYXRlIGEgbmV3IEZlYXR1cmVcblx0ICAgIGQuZ2Vub21lID0gZ2Vub21lXG5cdCAgICBmID0gbmV3IEZlYXR1cmUoZCk7XG5cdCAgICAvLyBSZWdpc3RlciBpdC5cblx0ICAgIHRoaXMuaWQyZmVhdFtmLm1ncGlkXSA9IGY7XG5cdCAgICBpZiAoZi5tZ2lpZCAmJiBmLm1naWlkICE9PSAnLicpIHtcblx0XHRsZXQgbHN0ID0gdGhpcy5jYW5vbmljYWwyZmVhdHNbZi5tZ2lpZF0gPSAodGhpcy5jYW5vbmljYWwyZmVhdHNbZi5tZ2lpZF0gfHwgW10pO1xuXHRcdGxzdC5wdXNoKGYpO1xuXHQgICAgfVxuXHQgICAgaWYgKGYuc3ltYm9sICYmIGYuc3ltYm9sICE9PSAnLicpIHtcblx0XHRsZXQgbHN0ID0gdGhpcy5zeW1ib2wyZmVhdHNbZi5zeW1ib2xdID0gKHRoaXMuc3ltYm9sMmZlYXRzW2Yuc3ltYm9sXSB8fCBbXSk7XG5cdFx0bHN0LnB1c2goZik7XG5cdCAgICB9XG5cdCAgICAvLyBoZXJlIHknZ28uXG5cdCAgICByZXR1cm4gZjtcblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmVnaXN0ZXJzIGFuIGluZGV4IGJsb2NrIGZvciB0aGUgZ2l2ZW4gZ2Vub21lLiBBbiBpbmRleCBibG9ja1xuICAgIC8vIGlzIGEgY29udGlndW91cyBjaHVuayBvZiBmZWF0dWVzIGZyb20gdGhlIEdGRiBmaWxlIGZvciB0aGF0IGdlbm9tZS5cbiAgICAvLyBSZWdpc3RlcmluZyB0aGUgc2FtZSBibG9jayBtdWx0aXBsZSB0aW1lcyBpcyBvayAtIHN1Y2Nlc3NpdmUgdGltZXNcbiAgICAvLyBoYXZlIG5vIGVmZmVjdC5cbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICBBZGRzIHRoZSBibG9jayB0byB0aGUgY2FjaGVcbiAgICAvLyAgIFJlcGxhY2VzIGVhY2ggcmF3IGZlYXR1cmUgaW4gdGhlIGJsb2NrIHdpdGggYSBGZWF0dXJlIG9iamVjdC5cbiAgICAvLyAgIFJlZ2lzdGVycyBuZXcgRmVhdHVyZXMgaW4gYSBsb29rdXAuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgIGdlbm9tZSAob2JqZWN0KSBUaGUgZ2Vub21lIHRoZSBibG9jayBpcyBmb3IsXG4gICAgLy8gICBibGsgKG9iamVjdCkgQW4gaW5kZXggYmxvY2ssIHdoaWNoIGhhcyBhIGNociwgc3RhcnQsIGVuZCxcbiAgICAvLyAgIFx0YW5kIGEgbGlzdCBvZiBcInJhd1wiIGZlYXR1cmUgb2JqZWN0cy5cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgbm90aGluZ1xuICAgIC8vXG4gICAgX3JlZ2lzdGVyQmxvY2sgKGdlbm9tZSwgYmxrKSB7XG5cdC8vIGdlbm9tZSBjYWNoZVxuICAgICAgICBsZXQgZ2MgPSB0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXSA9ICh0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXSB8fCB7fSk7XG5cdC8vIGNocm9tb3NvbWUgY2FjaGUgKHcvaW4gZ2Vub21lKVxuXHRsZXQgY2MgPSBnY1tibGsuY2hyXSA9IChnY1tibGsuY2hyXSB8fCBbXSk7XG5cdGlmIChjYy5maWx0ZXIoYiA9PiBiLmlkID09PSBibGsuaWQpLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgYmxrLmZlYXR1cmVzID0gdGhpcy5wcm9jZXNzRmVhdHVyZXMoIGJsay5mZWF0dXJlcywgZ2Vub21lICk7XG5cdCAgICBibGsuZ2Vub21lID0gZ2Vub21lO1xuXHQgICAgY2MucHVzaChibGspO1xuXHQgICAgY2Muc29ydCggKGEsYikgPT4gYS5zdGFydCAtIGIuc3RhcnQgKTtcblx0fVxuXHQvL2Vsc2Vcblx0ICAgIC8vY29uc29sZS5sb2coXCJTa2lwcGVkIGJsb2NrLiBBbHJlYWR5IHNlZW4uXCIsIGdlbm9tZS5uYW1lLCBibGsuaWQpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIHJlbWFpbmRlciBvZiB0aGUgZ2l2ZW4gcmFuZ2UgYWZ0ZXJcbiAgICAvLyBzdWJ0cmFjdGluZyB0aGUgYWxyZWFkeS1lbnN1cmVkIHJhbmdlcy5cbiAgICAvLyBcbiAgICBfc3VidHJhY3RSYW5nZShnZW5vbWUsIHJhbmdlKXtcblx0bGV0IGdjID0gdGhpcy5jYWNoZVtnZW5vbWUubmFtZV07XG5cdGlmICghZ2MpIHRocm93IFwiTm8gc3VjaCBnZW5vbWU6IFwiICsgZ2Vub21lLm5hbWU7XG5cdGxldCBnQmxrcyA9IGdjW3JhbmdlLmNocl0gfHwgW107XG5cdGxldCBhbnMgPSBbXTtcblx0bGV0IHJuZyA9IHJhbmdlO1xuXHRnQmxrcy5mb3JFYWNoKCBiID0+IHtcblx0ICAgIGxldCBzdWIgPSBybmcgPyBzdWJ0cmFjdCggcm5nLCBiICkgOiBbXTtcblx0ICAgIGlmIChzdWIubGVuZ3RoID09PSAwKVxuXHQgICAgICAgIHJuZyA9IG51bGw7XG5cdCAgICBpZiAoc3ViLmxlbmd0aCA9PT0gMSlcblx0ICAgICAgICBybmcgPSBzdWJbMF07XG5cdCAgICBlbHNlIGlmIChzdWIubGVuZ3RoID09PSAyKXtcblx0ICAgICAgICBhbnMucHVzaChzdWJbMF0pO1xuXHRcdHJuZyA9IHN1YlsxXTtcblx0ICAgIH1cblx0fSlcblx0cm5nICYmIGFucy5wdXNoKHJuZyk7XG5cdGFucy5zb3J0KCAoYSxiKSA9PiBhLnN0YXJ0IC0gYi5zdGFydCApO1xuXHRyZXR1cm4gYW5zO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDYWxscyBzdWJ0cmFjdFJhbmdlIGZvciBlYWNoIHJhbmdlIGluIHRoZSBsaXN0IGFuZCByZXR1cm5zXG4gICAgLy8gdGhlIGFjY3VtdWxhdGVkIHJlc3VsdHMuXG4gICAgLy9cbiAgICBfc3VidHJhY3RSYW5nZXMoZ2Vub21lLCByYW5nZXMpIHtcblx0bGV0IGdjID0gdGhpcy5jYWNoZVtnZW5vbWUubmFtZV07XG5cdGlmICghZ2MpIHJldHVybiByYW5nZXM7XG5cdGxldCBuZXdyYW5nZXMgPSBbXTtcblx0cmFuZ2VzLmZvckVhY2gociA9PiB7XG5cdCAgICBuZXdyYW5nZXMgPSBuZXdyYW5nZXMuY29uY2F0KHRoaXMuX3N1YnRyYWN0UmFuZ2UoZ2Vub21lLCByKSk7XG5cdH0sIHRoaXMpXG5cdHJldHVybiBuZXdyYW5nZXM7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRW5zdXJlcyB0aGF0IGFsbCBmZWF0dXJlcyBpbiB0aGUgc3BlY2lmaWVkIHJhbmdlKHMpIGluIHRoZSBzcGVjaWZpZWQgZ2Vub21lXG4gICAgLy8gYXJlIGluIHRoZSBjYWNoZS4gUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0cnVlIHdoZW4gdGhlIGNvbmRpdGlvbiBpcyBtZXQuXG4gICAgX2Vuc3VyZUZlYXR1cmVzQnlSYW5nZSAoZ2Vub21lLCByYW5nZXMpIHtcblx0bGV0IG5ld3JhbmdlcyA9IHRoaXMuX3N1YnRyYWN0UmFuZ2VzKGdlbm9tZSwgcmFuZ2VzKTtcblx0aWYgKG5ld3Jhbmdlcy5sZW5ndGggPT09IDApIFxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHRsZXQgY29vcmRzQXJnID0gbmV3cmFuZ2VzLm1hcChyID0+IGAke3IuY2hyfToke3Iuc3RhcnR9Li4ke3IuZW5kfWApLmpvaW4oJywnKTtcblx0bGV0IGRhdGFTdHJpbmcgPSBgZ2Vub21lPSR7Z2Vub21lLm5hbWV9JmNvb3Jkcz0ke2Nvb3Jkc0FyZ31gO1xuXHRsZXQgdXJsID0gXCIuL2Jpbi9nZXRGZWF0dXJlcy5jZ2k/XCIgKyBkYXRhU3RyaW5nO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdGNvbnNvbGUubG9nKFwiUmVxdWVzdGluZzpcIiwgZ2Vub21lLm5hbWUsIG5ld3Jhbmdlcyk7XG5cdHJldHVybiBkM2pzb24odXJsKS50aGVuKGZ1bmN0aW9uKGJsb2Nrcyl7XG5cdCAgICBibG9ja3MuZm9yRWFjaCggYiA9PiBzZWxmLl9yZWdpc3RlckJsb2NrKGdlbm9tZSwgYikgKTtcblx0ICAgIHNlbGYuYXBwLnNob3dTdGF0dXMoYExvYWRlZDogJHtnZW5vbWUubmFtZX1gKTtcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9KTtcbiAgICB9XG4gXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgX2Vuc3VyZUZlYXR1cmVzQnlHZW5vbWUgKGdlbm9tZSkge1xuXHRpZiggdGhpcy5sb2FkZWRHZW5vbWVzLmhhcyhnZW5vbWUpIClcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICAgIGxldCByYW5nZXMgPSBnZW5vbWUuY2hyb21vc29tZXMubWFwKGMgPT4geyBcblx0ICAgIHJldHVybiB7IGNocjogYy5uYW1lLCBzdGFydDogMSwgZW5kOiBjLmxlbmd0aCB9O1xuXHR9KTtcblx0cmV0dXJuIHRoaXMuX2Vuc3VyZUZlYXR1cmVzQnlSYW5nZShnZW5vbWUsIHJhbmdlcykudGhlbih4PT57IHRoaXMubG9hZGVkR2Vub21lcy5hZGQoZ2Vub21lKTsgcmV0dXJuIHRydWU7fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbG9hZEdlbm9tZXMgKGdlbm9tZXMpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGdlbm9tZXMubWFwKGcgPT4gdGhpcy5fZW5zdXJlRmVhdHVyZXNCeUdlbm9tZSAoZykpKS50aGVuKCgpPT50cnVlKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBfZ2V0Q2FjaGVkRmVhdHVyZXMgKGdlbm9tZSwgcmFuZ2UpIHtcbiAgICAgICAgbGV0IGdjID0gdGhpcy5jYWNoZVtnZW5vbWUubmFtZV0gO1xuXHRpZiAoIWdjKSByZXR1cm4gW107XG5cdGxldCBjQmxvY2tzID0gZ2NbcmFuZ2UuY2hyXTtcblx0aWYgKCFjQmxvY2tzKSByZXR1cm4gW107XG5cdGxldCBmZWF0cyA9IGNCbG9ja3Ncblx0ICAgIC5maWx0ZXIoY2IgPT4gb3ZlcmxhcHMoY2IsIHJhbmdlKSlcblx0ICAgIC5tYXAoIGNiID0+IGNiLmZlYXR1cmVzLmZpbHRlciggZiA9PiBvdmVybGFwcyggZiwgcmFuZ2UpICkgKVxuXHQgICAgLnJlZHVjZSggKGFjYywgdmFsKSA9PiBhY2MuY29uY2F0KHZhbCksIFtdKTtcbiAgICAgICAgcmV0dXJuIGZlYXRzO1x0XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhbGwgY2FjaGVkIGZlYXR1cmVzIGhhdmluZyB0aGUgZ2l2ZW4gY2Fub25pY2FsIGlkLlxuICAgIGdldENhY2hlZEZlYXR1cmVCeUlkIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pZDJmZWF0c1tpZF07XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhbGwgY2FjaGVkIGZlYXR1cmVzIGhhdmluZyB0aGUgZ2l2ZW4gY2Fub25pY2FsIGlkLlxuICAgIGdldENhY2hlZEZlYXR1cmVzQnlDYW5vbmljYWxJZCAoY2lkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbm9uaWNhbDJmZWF0c1tjaWRdIHx8IFtdO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBsaXN0IG9mIGZlYXR1cmVzIHRoYXQgbWF0Y2ggdGhlIGdpdmVuIGxhYmVsLCB3aGljaCBjYW4gYmUgYW4gaWQsIGNhbm9uaWNhbCBpZCwgb3Igc3ltYm9sLlxuICAgIC8vIElmIGdlbm9tZSBpcyBzcGVjaWZpZWQsIGxpbWl0IHJlc3VsdHMgdG8gZmVhdHVyZXMgZnJvbSB0aGF0IGdlbm9tZS5cbiAgICAvLyBcbiAgICBnZXRDYWNoZWRGZWF0dXJlc0J5TGFiZWwgKGxhYmVsLCBnZW5vbWUpIHtcblx0bGV0IGYgPSB0aGlzLmlkMmZlYXRbbGFiZWxdXG5cdGxldCBmZWF0cyA9IGYgPyBbZl0gOiB0aGlzLmNhbm9uaWNhbDJmZWF0c1tsYWJlbF0gfHwgdGhpcy5zeW1ib2wyZmVhdHNbbGFiZWxdIHx8IFtdO1xuXHRyZXR1cm4gZ2Vub21lID8gZmVhdHMuZmlsdGVyKGY9PiBmLmdlbm9tZSA9PT0gZ2Vub21lKSA6IGZlYXRzO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgZmVhdHVyZXMgaW4gXG4gICAgLy8gdGhlIHNwZWNpZmllZCByYW5nZXMgb2YgdGhlIHNwZWNpZmllZCBnZW5vbWUuXG4gICAgZ2V0RmVhdHVyZXMgKGdlbm9tZSwgcmFuZ2VzKSB7XG5cdHJldHVybiB0aGlzLl9lbnN1cmVGZWF0dXJlc0J5R2Vub21lKGdlbm9tZSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJhbmdlcy5mb3JFYWNoKCByID0+IHtcblx0ICAgICAgICByLmZlYXR1cmVzID0gdGhpcy5fZ2V0Q2FjaGVkRmVhdHVyZXMoZ2Vub21lLCByKSBcblx0XHRyLmdlbm9tZSA9IGdlbm9tZTtcblx0ICAgIH0pO1xuXHQgICAgcmV0dXJuIHsgZ2Vub21lLCBibG9ja3M6cmFuZ2VzIH07XG5cdH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgZmVhdHVyZXMgaGF2aW5nIHRoZSBzcGVjaWZpZWQgaWRzIGZyb20gdGhlIHNwZWNpZmllZCBnZW5vbWUuXG4gICAgZ2V0RmVhdHVyZXNCeUlkIChnZW5vbWUsIGlkcykge1xuICAgICAgICByZXR1cm4gdGhpcy5fZW5zdXJlRmVhdHVyZXNCeUdlbm9tZShnZW5vbWUpLnRoZW4oICgpID0+IHtcblx0ICAgIGxldCBmZWF0cyA9IFtdO1xuXHQgICAgbGV0IHNlZW4gPSBuZXcgU2V0KCk7XG5cdCAgICBsZXQgYWRkZiA9IChmKSA9PiB7XG5cdFx0aWYgKGYuZ2Vub21lICE9PSBnZW5vbWUpIHJldHVybjtcblx0XHRpZiAoc2Vlbi5oYXMoZi5pZCkpIHJldHVybjtcblx0XHRzZWVuLmFkZChmLmlkKTtcblx0XHRmZWF0cy5wdXNoKGYpO1xuXHQgICAgfTtcblx0ICAgIGxldCBhZGQgPSAoZikgPT4ge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGYpKSBcblx0XHQgICAgZi5mb3JFYWNoKGZmID0+IGFkZGYoZmYpKTtcblx0XHRlbHNlXG5cdFx0ICAgIGFkZGYoZik7XG5cdCAgICB9O1xuXHQgICAgZm9yIChsZXQgaSBvZiBpZHMpe1xuXHRcdGxldCBmID0gdGhpcy5jYW5vbmljYWwyZmVhdHNbaV0gfHwgdGhpcy5pZDJmZWF0W2ldO1xuXHRcdGYgJiYgYWRkKGYpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZlYXRzO1xuXHR9KTtcbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIEZlYXR1cmUgTWFuYWdlclxuXG5leHBvcnQgeyBGZWF0dXJlTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgaW5pdE9wdExpc3QgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IEF1eERhdGFNYW5hZ2VyIH0gZnJvbSAnLi9BdXhEYXRhTWFuYWdlcic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgUXVlcnlNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQsIGNmZykge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMuY2ZnID0gY2ZnO1xuXHR0aGlzLmF1eERhdGFNYW5hZ2VyID0gbmV3IEF1eERhdGFNYW5hZ2VyKCk7XG5cdHRoaXMuc2VsZWN0ID0gbnVsbDtcdC8vIG15IDxzZWxlY3Q+IGVsZW1lbnRcblx0dGhpcy50ZXJtID0gbnVsbDtcdC8vIG15IDxpbnB1dD4gZWxlbWVudFxuXHR0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdHRoaXMuc2VsZWN0ID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzZWFyY2h0eXBlXCJdJyk7XG5cdHRoaXMudGVybSAgID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzZWFyY2h0ZXJtXCJdJyk7XG5cdC8vXG5cdHRoaXMudGVybS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgdGhpcy5jZmdbMF0ucGxhY2Vob2xkZXIpXG5cdGluaXRPcHRMaXN0KHRoaXMuc2VsZWN0WzBdWzBdLCB0aGlzLmNmZywgYz0+Yy5tZXRob2QsIGM9PmMubGFiZWwpO1xuXHQvLyBXaGVuIHVzZXIgY2hhbmdlcyB0aGUgcXVlcnkgdHlwZSAoc2VsZWN0b3IpLCBjaGFuZ2UgdGhlIHBsYWNlaG9sZGVyIHRleHQuXG5cdHRoaXMuc2VsZWN0Lm9uKFwiY2hhbmdlXCIsICgpID0+IHtcblx0ICAgIGxldCBvcHQgPSB0aGlzLnNlbGVjdC5wcm9wZXJ0eShcInNlbGVjdGVkT3B0aW9uc1wiKVswXTtcblx0ICAgIHRoaXMudGVybS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgb3B0Ll9fZGF0YV9fLnBsYWNlaG9sZGVyKVxuXHQgICAgXG5cdH0pO1xuXHQvLyBXaGVuIHVzZXIgZW50ZXJzIGEgc2VhcmNoIHRlcm0sIHJ1biBhIHF1ZXJ5XG5cdHRoaXMudGVybS5vbihcImNoYW5nZVwiLCAoKSA9PiB7XG5cdCAgICBsZXQgdGVybSA9IHRoaXMudGVybS5wcm9wZXJ0eShcInZhbHVlXCIpO1xuXHQgICAgdGhpcy50ZXJtLnByb3BlcnR5KFwidmFsdWVcIixcIlwiKTtcblx0ICAgIGxldCBzZWFyY2hUeXBlICA9IHRoaXMuc2VsZWN0LnByb3BlcnR5KFwidmFsdWVcIik7XG5cdCAgICBsZXQgbHN0TmFtZSA9IHRlcm07XG5cdCAgICBkMy5zZWxlY3QoXCIjbXlsaXN0c1wiKS5jbGFzc2VkKFwiYnVzeVwiLHRydWUpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHQgICAgdGhpcy5hdXhEYXRhTWFuYWdlcltzZWFyY2hUeXBlXSh0ZXJtKVx0Ly8gPC0gcnVuIHRoZSBxdWVyeVxuXHQgICAgICAudGhlbihmZWF0cyA9PiB7XG5cdFx0ICAvLyBGSVhNRSAtIHJlYWNob3ZlciAtIHRoaXMgd2hvbGUgaGFuZGxlclxuXHRcdCAgbGV0IGxzdCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLmNyZWF0ZUxpc3QobHN0TmFtZSwgZmVhdHMubWFwKGYgPT4gZi5wcmltYXJ5SWRlbnRpZmllcikpXG5cdFx0ICB0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGUobHN0KTtcblx0XHQgIC8vXG5cdFx0ICB0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzID0ge307XG5cdFx0ICBmZWF0cy5mb3JFYWNoKGYgPT4gdGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0c1tmLm1naWlkXSA9IGYubWdpaWQpO1xuXHRcdCAgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdFx0ICAvL1xuXHRcdCAgdGhpcy5hcHAuY3VycmVudExpc3QgPSBsc3Q7XG5cdFx0ICAvL1xuXHRcdCAgZDMuc2VsZWN0KFwiI215bGlzdHNcIikuY2xhc3NlZChcImJ1c3lcIixmYWxzZSk7XG5cdCAgICAgIH0pO1xuXHR9KVxuICAgIH1cbn1cblxuZXhwb3J0IHsgUXVlcnlNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9RdWVyeU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGQzanNvbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEF1eERhdGFNYW5hZ2VyIC0ga25vd3MgaG93IHRvIHF1ZXJ5IGFuIGV4dGVybmFsIHNvdXJjZSAoaS5lLiwgTW91c2VNaW5lKSBmb3IgZ2VuZXNcbi8vIGFubm90YXRlZCB0byBkaWZmZXJlbnQgb250b2xvZ2llcy4gXG5jbGFzcyBBdXhEYXRhTWFuYWdlciB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0QXV4RGF0YSAocSkge1xuXHRsZXQgZm9ybWF0ID0gJ2pzb25vYmplY3RzJztcblx0bGV0IHF1ZXJ5ID0gZW5jb2RlVVJJQ29tcG9uZW50KHEpO1xuXHRsZXQgdXJsID0gYGh0dHA6Ly93d3cubW91c2VtaW5lLm9yZy9tb3VzZW1pbmUvc2VydmljZS9xdWVyeS9yZXN1bHRzP2Zvcm1hdD0ke2Zvcm1hdH0mcXVlcnk9JHtxdWVyeX1gO1xuXHRyZXR1cm4gZDNqc29uKHVybCkudGhlbihkYXRhID0+IGRhdGEucmVzdWx0c3x8W10pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGRvIGEgTE9PS1VQIHF1ZXJ5IGZvciBTZXF1ZW5jZUZlYXR1cmVzIGZyb20gTW91c2VNaW5lXG4gICAgZmVhdHVyZXNCeUxvb2t1cCAocXJ5U3RyaW5nKSB7XG5cdGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgICB2aWV3PVwiU2VxdWVuY2VGZWF0dXJlLnByaW1hcnlJZGVudGlmaWVyIFNlcXVlbmNlRmVhdHVyZS5zeW1ib2xcIiBcblx0ICAgIGxvbmdEZXNjcmlwdGlvbj1cIlwiIFxuXHQgICAgY29uc3RyYWludExvZ2ljPVwiQSBhbmQgQiBhbmQgQ1wiPlxuXHRcdDxjb25zdHJhaW50IGNvZGU9XCJBXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZVwiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdFx0PGNvbnN0cmFpbnQgY29kZT1cIkJcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9yZ2FuaXNtLnRheG9uSWRcIiBvcD1cIj1cIiB2YWx1ZT1cIjEwMDkwXCIvPlxuXHRcdDxjb25zdHJhaW50IGNvZGU9XCJDXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5zZXF1ZW5jZU9udG9sb2d5VGVybS5uYW1lXCIgb3A9XCIhPVwiIHZhbHVlPVwidHJhbnNnZW5lXCIvPlxuXHQgICAgPC9xdWVyeT5gO1xuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmZWF0dXJlc0J5T250b2xvZ3lUZXJtIChxcnlTdHJpbmcsIHRlcm1UeXBlKSB7XG4gICAgICAgIGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgdmlldz1cIlNlcXVlbmNlRmVhdHVyZS5wcmltYXJ5SWRlbnRpZmllciBTZXF1ZW5jZUZlYXR1cmUuc3ltYm9sXCIgbG9uZ0Rlc2NyaXB0aW9uPVwiXCIgc29ydE9yZGVyPVwiU2VxdWVuY2VGZWF0dXJlLnN5bWJvbCBhc2NcIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCIGFuZCBDXCI+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm1cIiB0eXBlPVwiJHt0ZXJtVHlwZX1cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm0ucGFyZW50c1wiIHR5cGU9XCIke3Rlcm1UeXBlfVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9udG9sb2d5QW5ub3RhdGlvbnMub250b2xvZ3lUZXJtLnBhcmVudHNcIiBvcD1cIkxPT0tVUFwiIHZhbHVlPVwiJHtxcnlTdHJpbmd9XCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiQlwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub3JnYW5pc20udGF4b25JZFwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJDXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5zZXF1ZW5jZU9udG9sb2d5VGVybS5uYW1lXCIgb3A9XCIhPVwiIHZhbHVlPVwidHJhbnNnZW5lXCIvPlxuXHQgIDwvcXVlcnk+YFxuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAobm90IGN1cnJlbnRseSBpbiB1c2UuLi4pXG4gICAgZmVhdHVyZXNCeVBhdGh3YXlUZXJtIChxcnlTdHJpbmcpIHtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICB2aWV3PVwiUGF0aHdheS5nZW5lcy5wcmltYXJ5SWRlbnRpZmllciBQYXRod2F5LmdlbmVzLnN5bWJvbFwiIGxvbmdEZXNjcmlwdGlvbj1cIlwiIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEJcIj5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlBhdGh3YXlcIiBjb2RlPVwiQVwiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJQYXRod2F5LmdlbmVzLm9yZ2FuaXNtLnRheG9uSWRcIiBjb2RlPVwiQlwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdCAgPC9xdWVyeT5gO1xuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmZWF0dXJlc0J5SWQgICAgICAgIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeUxvb2t1cChxcnlTdHJpbmcpOyB9XG4gICAgZmVhdHVyZXNCeUZ1bmN0aW9uICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBcIkdPVGVybVwiKTsgfVxuICAgIC8vZmVhdHVyZXNCeVBhdGh3YXkgICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlQYXRod2F5VGVybShxcnlTdHJpbmcpOyB9XG4gICAgZmVhdHVyZXNCeVBoZW5vdHlwZSAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBcIk1QVGVybVwiKTsgfVxuICAgIGZlYXR1cmVzQnlEaXNlYXNlICAgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5T250b2xvZ3lUZXJtKHFyeVN0cmluZywgXCJET1Rlcm1cIik7IH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbn1cblxuZXhwb3J0IHsgQXV4RGF0YU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0F1eERhdGFNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSAnLi9TdG9yYWdlTWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB9IGZyb20gJy4vTGlzdEZvcm11bGFFdmFsdWF0b3InO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE1haW50YWlucyBuYW1lZCBsaXN0cyBvZiBJRHMuIExpc3RzIG1heSBiZSB0ZW1wb3JhcnksIGxhc3Rpbmcgb25seSBmb3IgdGhlIHNlc3Npb24sIG9yIHBlcm1hbmVudCxcbi8vIGxhc3RpbmcgdW50aWwgdGhlIHVzZXIgY2xlYXJzIHRoZSBicm93c2VyIGxvY2FsIHN0b3JhZ2UgYXJlYS5cbi8vXG4vLyBVc2VzIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSBhbmQgd2luZG93LmxvY2FsU3RvcmFnZSB0byBzYXZlIGxpc3RzXG4vLyB0ZW1wb3JhcmlseSBvciBwZXJtYW5lbnRseSwgcmVzcC4gIEZJWE1FOiBzaG91bGQgYmUgdXNpbmcgd2luZG93LmluZGV4ZWREQlxuLy9cbmNsYXNzIExpc3RNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLm5hbWUybGlzdCA9IG51bGw7XG5cdHRoaXMuX2xpc3RzID0gbmV3IExvY2FsU3RvcmFnZU1hbmFnZXIgIChcImxpc3RNYW5hZ2VyLmxpc3RzXCIpXG5cdHRoaXMuZm9ybXVsYUV2YWwgPSBuZXcgTGlzdEZvcm11bGFFdmFsdWF0b3IodGhpcyk7XG5cdHRoaXMuX2xvYWQoKTtcblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuXHQvLyBCdXR0b246IHNob3cvaGlkZSB3YXJuaW5nIG1lc3NhZ2Vcblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbi53YXJuaW5nJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IHcgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cIm1lc3NhZ2VcIl0nKTtcblx0XHR3LmNsYXNzZWQoJ3Nob3dpbmcnLCAhdy5jbGFzc2VkKCdzaG93aW5nJykpO1xuXHQgICAgfSk7XG5cdC8vIEJ1dHRvbjogY3JlYXRlIGxpc3QgZnJvbSBjdXJyZW50IHNlbGVjdGlvblxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJuZXdmcm9tc2VsZWN0aW9uXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgaWRzID0gT2JqZWN0LmtleXModGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0cyk7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdFx0aWYgKGlkcy5sZW5ndGggPT09IDApIHtcblx0XHQgICAgYWxlcnQoXCJOb3RoaW5nIHNlbGVjdGVkLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbmV3bGlzdCA9IHRoaXMuY3JlYXRlTGlzdChcInNlbGVjdGlvblwiLCBpZHMpO1xuXHRcdHRoaXMudXBkYXRlKG5ld2xpc3QpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBjb21iaW5lIGxpc3RzOiBvcGVuIGxpc3QgZWRpdG9yIHdpdGggZm9ybXVsYSBlZGl0b3Igb3BlblxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJjb21iaW5lXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAodGhpcy5nZXROYW1lcygpLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vIGxpc3RzLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbGUgPSB0aGlzLmFwcC5saXN0RWRpdG9yO1xuXHRcdGxlLm9wZW4oKTtcblx0XHRsZS5vcGVuRm9ybXVsYUVkaXRvcigpO1xuXHQgICAgfSk7XG5cdC8vIEJ1dHRvbjogZGVsZXRlIGFsbCBsaXN0cyAoZ2V0IGNvbmZpcm1hdGlvbiBmaXJzdCkuXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cInB1cmdlXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAodGhpcy5nZXROYW1lcygpLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vIGxpc3RzLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0ICAgICAgICBpZiAod2luZG93LmNvbmZpcm0oXCJEZWxldGUgYWxsIGxpc3RzLiBBcmUgeW91IHN1cmU/XCIpKSB7XG5cdFx0ICAgIHRoaXMucHVyZ2UoKTtcblx0XHQgICAgdGhpcy51cGRhdGUoKTtcblx0XHR9XG5cdCAgICB9KTtcbiAgICB9XG4gICAgX2xvYWQgKCkge1xuXHR0aGlzLm5hbWUybGlzdCA9IHRoaXMuX2xpc3RzLmdldChcImFsbFwiKTtcblx0aWYgKCF0aGlzLm5hbWUybGlzdCl7XG5cdCAgICB0aGlzLm5hbWUybGlzdCA9IHt9O1xuXHQgICAgdGhpcy5fc2F2ZSgpO1xuXHR9XG4gICAgfVxuICAgIF9zYXZlICgpIHtcbiAgICAgICAgdGhpcy5fbGlzdHMucHV0KFwiYWxsXCIsIHRoaXMubmFtZTJsaXN0KTtcbiAgICB9XG4gICAgLy9cbiAgICAvLyByZXR1cm5zIHRoZSBuYW1lcyBvZiBhbGwgdGhlIGxpc3RzLCBzb3J0ZWRcbiAgICBnZXROYW1lcyAoKSB7XG4gICAgICAgIGxldCBubXMgPSBPYmplY3Qua2V5cyh0aGlzLm5hbWUybGlzdCk7XG5cdG5tcy5zb3J0KCk7XG5cdHJldHVybiBubXM7XG4gICAgfVxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZmYgYSBsaXN0IGV4aXN0cyB3aXRoIHRoaXMgbmFtZVxuICAgIGhhcyAobmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZSBpbiB0aGlzLm5hbWUybGlzdDtcbiAgICB9XG4gICAgLy8gSWYgbm8gbGlzdCB3aXRoIHRoZSBnaXZlbiBuYW1lIGV4aXN0cywgcmV0dXJuIHRoZSBuYW1lLlxuICAgIC8vIE90aGVyd2lzZSwgcmV0dXJuIGEgbW9kaWZpZWQgdmVyc2lvbiBvZiBuYW1lIHRoYXQgaXMgdW5pcXVlLlxuICAgIC8vIFVuaXF1ZSBuYW1lcyBhcmUgY3JlYXRlZCBieSBhcHBlbmRpbmcgYSBjb3VudGVyLlxuICAgIC8vIEUuZy4sIHVuaXF1aWZ5KFwiZm9vXCIpIC0+IFwiZm9vLjFcIiBvciBcImZvby4yXCIgb3Igd2hhdGV2ZXIuXG4gICAgLy9cbiAgICB1bmlxdWlmeSAobmFtZSkge1xuXHRpZiAoIXRoaXMuaGFzKG5hbWUpKSBcblx0ICAgIHJldHVybiBuYW1lO1xuXHRmb3IgKGxldCBpID0gMTsgOyBpICs9IDEpIHtcblx0ICAgIGxldCBubiA9IGAke25hbWV9LiR7aX1gO1xuXHQgICAgaWYgKCF0aGlzLmhhcyhubikpXG5cdCAgICAgICAgcmV0dXJuIG5uO1xuXHR9XG4gICAgfVxuICAgIC8vIHJldHVybnMgdGhlIGxpc3Qgd2l0aCB0aGlzIG5hbWUsIG9yIG51bGwgaWYgbm8gc3VjaCBsaXN0XG4gICAgZ2V0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLm5hbWUybGlzdFtuYW1lXTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIHJldHVybnMgYWxsIHRoZSBsaXN0cywgc29ydGVkIGJ5IG5hbWVcbiAgICBnZXRBbGwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXROYW1lcygpLm1hcChuID0+IHRoaXMuZ2V0KG4pKVxuICAgIH1cbiAgICAvLyBcbiAgICBjcmVhdGVPclVwZGF0ZSAobmFtZSwgaWRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMudXBkYXRlTGlzdChuYW1lLG51bGwsaWRzKSA6IHRoaXMuY3JlYXRlTGlzdChuYW1lLCBpZHMpO1xuICAgIH1cbiAgICAvLyBjcmVhdGVzIGEgbmV3IGxpc3Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgaWRzLlxuICAgIGNyZWF0ZUxpc3QgKG5hbWUsIGlkcywgZm9ybXVsYSkge1xuXHRpZiAobmFtZSAhPT0gXCJfXCIpXG5cdCAgICBuYW1lID0gdGhpcy51bmlxdWlmeShuYW1lKTtcblx0Ly9cblx0bGV0IGR0ID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMubmFtZTJsaXN0W25hbWVdID0ge1xuXHQgICAgbmFtZTogICAgIG5hbWUsXG5cdCAgICBpZHM6ICAgICAgaWRzLFxuXHQgICAgZm9ybXVsYTogIGZvcm11bGEgfHwgXCJcIixcblx0ICAgIGNyZWF0ZWQ6ICBkdCxcblx0ICAgIG1vZGlmaWVkOiBkdFxuXHR9O1xuXHR0aGlzLl9zYXZlKCk7XG5cdHJldHVybiB0aGlzLm5hbWUybGlzdFtuYW1lXTtcbiAgICB9XG4gICAgLy8gUHJvdmlkZSBhY2Nlc3MgdG8gZXZhbHVhdGlvbiBzZXJ2aWNlXG4gICAgZXZhbEZvcm11bGEgKGV4cHIpIHtcblx0cmV0dXJuIHRoaXMuZm9ybXVsYUV2YWwuZXZhbChleHByKTtcbiAgICB9XG4gICAgLy8gUmVmcmVzaGVzIGEgbGlzdCBhbmQgcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZWZyZXNoZWQgbGlzdC5cbiAgICAvLyBJZiB0aGUgbGlzdCBpZiBhIFBPTE8sIHByb21pc2UgcmVzb2x2ZXMgaW1tZWRpYXRlbHkgdG8gdGhlIGxpc3QuXG4gICAgLy8gT3RoZXJ3aXNlLCBzdGFydHMgYSByZWV2YWx1YXRpb24gb2YgdGhlIGZvcm11bGEgdGhhdCByZXNvbHZlcyBhZnRlciB0aGVcbiAgICAvLyBsaXN0J3MgaWRzIGhhdmUgYmVlbiB1cGRhdGVkLlxuICAgIC8vIElmIHRoZXJlIGlzIGFuIGVycm9yLCB0aGUgcmV0dXJuZWQgcHJvbWlzZSByZWplY3RzIHdpdGggdGhlIGVycm9yLlxuICAgIHJlZnJlc2hMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdGxzdC5tb2RpZmllZCA9IFwiXCIrbmV3IERhdGUoKTtcblx0aWYgKCFsc3QuZm9ybXVsYSlcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobHN0KTtcblx0ZWxzZSB7XG5cdCAgICBsZXQgcCA9IHRoaXMuZm9ybXVhbEV2YWwuZXZhbChsc3QuZm9ybXVsYSkudGhlbiggaWRzID0+IHtcblx0XHQgICAgbHN0LmlkcyA9IGlkcztcblx0XHQgICAgcmV0dXJuIGxzdDtcblx0XHR9KTtcblx0ICAgIHJldHVybiBwO1xuXHR9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlcyB0aGUgaWRzIGluIHRoZSBnaXZlbiBsaXN0XG4gICAgdXBkYXRlTGlzdCAobmFtZSwgbmV3bmFtZSwgbmV3aWRzLCBuZXdmb3JtdWxhKSB7XG5cdGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcbiAgICAgICAgaWYgKCEgbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuYW1lO1xuXHRpZiAobmV3bmFtZSkge1xuXHQgICAgZGVsZXRlIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXTtcblx0ICAgIGxzdC5uYW1lID0gdGhpcy51bmlxdWlmeShuZXduYW1lKTtcblx0ICAgIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXSA9IGxzdDtcblx0fVxuXHRpZiAobmV3aWRzKSBsc3QuaWRzICA9IG5ld2lkcztcblx0aWYgKG5ld2Zvcm11bGEgfHwgbmV3Zm9ybXVsYT09PVwiXCIpIGxzdC5mb3JtdWxhID0gbmV3Zm9ybXVsYTtcblx0bHN0Lm1vZGlmaWVkID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMuX3NhdmUoKTtcblx0cmV0dXJuIGxzdDtcbiAgICB9XG4gICAgLy8gZGVsZXRlcyB0aGUgc3BlY2lmaWVkIGxpc3RcbiAgICBkZWxldGVMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0ZGVsZXRlIHRoaXMubmFtZTJsaXN0W25hbWVdO1xuXHR0aGlzLl9zYXZlKCk7XG5cdC8vIEZJWE1FOiB1c2UgZXZlbnRzISFcblx0aWYgKGxzdCA9PT0gdGhpcy5hcHAuY3VycmVudExpc3QpIHRoaXMuYXBwLmN1cnJlbnRMaXN0ID0gbnVsbDtcblx0aWYgKGxzdCA9PT0gdGhpcy5hcHAubGlzdEVkaXRvci5saXN0KSB0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QgPSBudWxsO1xuXHRyZXR1cm4gbHN0O1xuICAgIH1cbiAgICAvLyBkZWxldGUgYWxsIGxpc3RzXG4gICAgcHVyZ2UgKCkge1xuICAgICAgICB0aGlzLm5hbWUybGlzdCA9IHt9XG5cdHRoaXMuX3NhdmUoKTtcblx0Ly9cblx0dGhpcy5hcHAuY3VycmVudExpc3QgPSBudWxsO1xuXHR0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QgPSBudWxsOyAvLyBGSVhNRSAtIHJlYWNoYWNyb3NzXG4gICAgfVxuICAgIC8vIFJldHVybnMgdHJ1ZSBpZmYgZXhwciBpcyB2YWxpZCwgd2hpY2ggbWVhbnMgaXQgaXMgYm90aCBzeW50YWN0aWNhbGx5IGNvcnJlY3QgXG4gICAgLy8gYW5kIGFsbCBtZW50aW9uZWQgbGlzdHMgZXhpc3QuXG4gICAgaXNWYWxpZCAoZXhwcikge1xuXHRyZXR1cm4gdGhpcy5mb3JtdWxhRXZhbC5pc1ZhbGlkKGV4cHIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIHRoZSBcIk15IGxpc3RzXCIgYm94IHdpdGggdGhlIGN1cnJlbnRseSBhdmFpbGFibGUgbGlzdHMuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgIG5ld2xpc3QgKExpc3QpIG9wdGlvbmFsLiBJZiBzcGVjaWZpZWQsIHdlIGp1c3QgY3JlYXRlZCB0aGF0IGxpc3QsIGFuZCBpdHMgbmFtZSBpc1xuICAgIC8vICAgXHRhIGdlbmVyYXRlZCBkZWZhdWx0LiBQbGFjZSBmb2N1cyB0aGVyZSBzbyB1c2VyIGNhbiB0eXBlIG5ldyBuYW1lLlxuICAgIHVwZGF0ZSAobmV3bGlzdCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBsaXN0cyA9IHRoaXMuZ2V0QWxsKCk7XG5cdGxldCBieU5hbWUgPSAoYSxiKSA9PiB7XG5cdCAgICBsZXQgYW4gPSBhLm5hbWUudG9Mb3dlckNhc2UoKTtcblx0ICAgIGxldCBibiA9IGIubmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgcmV0dXJuIChhbiA8IGJuID8gLTEgOiBhbiA+IGJuID8gKzEgOiAwKTtcblx0fTtcblx0bGV0IGJ5RGF0ZSA9IChhLGIpID0+ICgobmV3IERhdGUoYi5tb2RpZmllZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLm1vZGlmaWVkKSkuZ2V0VGltZSgpKTtcblx0bGlzdHMuc29ydChieU5hbWUpO1xuXHRsZXQgaXRlbXMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImxpc3RzXCJdJykuc2VsZWN0QWxsKFwiLmxpc3RJbmZvXCIpXG5cdCAgICAuZGF0YShsaXN0cyk7XG5cdGxldCBuZXdpdGVtcyA9IGl0ZW1zLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJsaXN0SW5mbyBmbGV4cm93XCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcImlcIikuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29ucyBidXR0b25cIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLFwiZWRpdFwiKVxuXHQgICAgLnRleHQoXCJtb2RlX2VkaXRcIilcblx0ICAgIC5hdHRyKFwidGl0bGVcIixcIkVkaXQgdGhpcyBsaXN0LlwiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJzcGFuXCIpLmF0dHIoXCJuYW1lXCIsXCJuYW1lXCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcInNpemVcIik7XG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcImRhdGVcIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwiaVwiKS5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zIGJ1dHRvblwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJkZWxldGVcIilcblx0ICAgIC50ZXh0KFwiaGlnaGxpZ2h0X29mZlwiKVxuXHQgICAgLmF0dHIoXCJ0aXRsZVwiLFwiRGVsZXRlIHRoaXMgbGlzdC5cIik7XG5cblx0aWYgKG5ld2l0ZW1zWzBdWzBdKSB7XG5cdCAgICBsZXQgbGFzdCA9IG5ld2l0ZW1zWzBdW25ld2l0ZW1zWzBdLmxlbmd0aC0xXTtcblx0ICAgIGxhc3Quc2Nyb2xsSW50b1ZpZXcoKTtcblx0fVxuXG5cdGl0ZW1zXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgbHN0PT5sc3QubmFtZSlcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChsc3QpIHtcblx0XHRpZiAoZDMuZXZlbnQuYWx0S2V5KSB7XG5cdFx0ICAgIC8vIGFsdC1jbGljayBjb3BpZXMgdGhlIGxpc3QncyBuYW1lIGludG8gdGhlIGZvcm11bGEgZWRpdG9yXG5cdFx0ICAgIGxldCBsZSA9IHNlbGYuYXBwLmxpc3RFZGl0b3I7IC8vIEZJWE1FIHJlYWNob3ZlclxuXHRcdCAgICBsZXQgcyA9IGxzdC5uYW1lO1xuXHRcdCAgICBsZXQgcmUgPSAvWyA9KCkrKi1dLztcblx0XHQgICAgaWYgKHMuc2VhcmNoKHJlKSA+PSAwKVxuXHRcdFx0cyA9ICdcIicgKyBzICsgJ1wiJztcblx0XHQgICAgaWYgKCFsZS5pc0VkaXRpbmdGb3JtdWxhKSB7XG5cdFx0ICAgICAgICBsZS5vcGVuKCk7XG5cdFx0XHRsZS5vcGVuRm9ybXVsYUVkaXRvcigpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vXG5cdFx0ICAgIGxlLmFkZFRvTGlzdEV4cHIocysnICcpO1xuXHRcdH1cblx0XHQvLyBvdGhlcndpc2UsIHNldCB0aGlzIGFzIHRoZSBjdXJyZW50IGxpc3Rcblx0XHRlbHNlIFxuXHRcdCAgICBzZWxmLmFwcC5jdXJyZW50TGlzdCA9IGxzdDsgLy8gRklYTUUgcmVhY2hvdmVyXG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJlZGl0XCJdJylcblx0ICAgIC8vIGVkaXQ6IGNsaWNrIFxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24obHN0KSB7XG5cdCAgICAgICAgc2VsZi5hcHAubGlzdEVkaXRvci5vcGVuKGxzdCk7XG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCdzcGFuW25hbWU9XCJuYW1lXCJdJylcblx0ICAgIC50ZXh0KGxzdCA9PiBsc3QubmFtZSk7XG5cdGl0ZW1zLnNlbGVjdCgnc3BhbltuYW1lPVwiZGF0ZVwiXScpLnRleHQobHN0ID0+IHtcblx0ICAgIGxldCBtZCA9IG5ldyBEYXRlKGxzdC5tb2RpZmllZCk7XG5cdCAgICBsZXQgZCA9IGAke21kLmdldEZ1bGxZZWFyKCl9LSR7bWQuZ2V0TW9udGgoKSsxfS0ke21kLmdldERhdGUoKX0gYCBcblx0ICAgICAgICAgICsgYDoke21kLmdldEhvdXJzKCl9LiR7bWQuZ2V0TWludXRlcygpfS4ke21kLmdldFNlY29uZHMoKX1gO1xuXHQgICAgcmV0dXJuIGQ7XG5cdH0pO1xuXHRpdGVtcy5zZWxlY3QoJ3NwYW5bbmFtZT1cInNpemVcIl0nKS50ZXh0KGxzdCA9PiBsc3QuaWRzLmxlbmd0aCk7XG5cdGl0ZW1zLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZGVsZXRlXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsIGxzdCA9PiB7XG5cdCAgICAgICAgdGhpcy5kZWxldGVMaXN0KGxzdC5uYW1lKTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXG5cdFx0Ly8gTm90IHN1cmUgd2h5IHRoaXMgaXMgbmVjZXNzYXJ5IGhlcmUuIEJ1dCB3aXRob3V0IGl0LCB0aGUgbGlzdCBpdGVtIGFmdGVyIHRoZSBvbmUgYmVpbmdcblx0XHQvLyBkZWxldGVkIGhlcmUgd2lsbCByZWNlaXZlIGEgY2xpY2sgZXZlbnQuXG5cdFx0ZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0Ly9cblx0ICAgIH0pO1xuXG5cdC8vXG5cdGl0ZW1zLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0aWYgKG5ld2xpc3QpIHtcblx0ICAgIGxldCBsc3RlbHQgPSBcblx0ICAgICAgICBkMy5zZWxlY3QoYCNteWxpc3RzIFtuYW1lPVwibGlzdHNcIl0gW25hbWU9XCIke25ld2xpc3QubmFtZX1cIl1gKVswXVswXTtcbiAgICAgICAgICAgIGxzdGVsdC5zY3JvbGxJbnRvVmlldyhmYWxzZSk7XG5cdH1cbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIExpc3RNYW5hZ2VyXG5cbmV4cG9ydCB7IExpc3RNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfSBmcm9tICcuL0xpc3RGb3JtdWxhUGFyc2VyJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBLbm93cyBob3cgdG8gcGFyc2UgYW5kIGV2YWx1YXRlIGEgbGlzdCBmb3JtdWxhIChha2EgbGlzdCBleHByZXNzaW9uKS5cbmNsYXNzIExpc3RGb3JtdWxhRXZhbHVhdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAobGlzdE1hbmFnZXIpIHtcblx0dGhpcy5saXN0TWFuYWdlciA9IGxpc3RNYW5hZ2VyO1xuICAgICAgICB0aGlzLnBhcnNlciA9IG5ldyBMaXN0Rm9ybXVsYVBhcnNlcigpO1xuICAgIH1cbiAgICAvLyBFdmFsdWF0ZXMgdGhlIGV4cHJlc3Npb24gYW5kIHJldHVybnMgYSBQcm9taXNlIGZvciB0aGUgbGlzdCBvZiBpZHMuXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gZXJyb3IsIHRoZSBwcm9taXNlIHJlamVjdHMgd2l0aCB0aGUgZXJyb3IgbWVzc2FnZS5cbiAgICBldmFsIChleHByKSB7XG5cdCByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICAgdHJ5IHtcblx0XHRsZXQgYXN0ID0gdGhpcy5wYXJzZXIucGFyc2UoZXhwcik7XG5cdFx0bGV0IGxtID0gdGhpcy5saXN0TWFuYWdlcjtcblx0XHRsZXQgcmVhY2ggPSAobikgPT4ge1xuXHRcdCAgICBpZiAodHlwZW9mKG4pID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdFx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG47XG5cdFx0XHRyZXR1cm4gbmV3IFNldChsc3QuaWRzKTtcblx0XHQgICAgfVxuXHRcdCAgICBlbHNlIHtcblx0XHRcdGxldCBsID0gcmVhY2gobi5sZWZ0KTtcblx0XHRcdGxldCByID0gcmVhY2gobi5yaWdodCk7XG5cdFx0XHRyZXR1cm4gbFtuLm9wXShyKTtcblx0XHQgICAgfVxuXHRcdH1cblx0XHRsZXQgaWRzID0gcmVhY2goYXN0KTtcblx0XHRyZXNvbHZlKEFycmF5LmZyb20oaWRzKSk7XG5cdCAgICB9XG5cdCAgICBjYXRjaCAoZSkge1xuXHRcdHJlamVjdChlKTtcblx0ICAgIH1cblx0IH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIC8vIENoZWNrcyB0aGUgY3VycmVudCBleHByZXNzaW9uIGZvciBzeW50YWN0aWMgYW5kIHNlbWFudGljIHZhbGlkaXR5IGFuZCBzZXRzIHRoZSBcbiAgICAvLyB2YWxpZC9pbnZhbGlkIGNsYXNzIGFjY29yZGluZ2x5LiBTZW1hbnRpYyB2YWxpZGl0eSBzaW1wbHkgbWVhbnMgYWxsIG5hbWVzIGluIHRoZVxuICAgIC8vIGV4cHJlc3Npb24gYXJlIGJvdW5kLlxuICAgIC8vXG4gICAgaXNWYWxpZCAgKGV4cHIpIHtcblx0dHJ5IHtcblx0ICAgIC8vIGZpcnN0IGNoZWNrIHN5bnRheFxuXHQgICAgbGV0IGFzdCA9IHRoaXMucGFyc2VyLnBhcnNlKGV4cHIpO1xuXHQgICAgbGV0IGxtICA9IHRoaXMubGlzdE1hbmFnZXI7IFxuXHQgICAgLy8gbm93IGNoZWNrIGxpc3QgbmFtZXNcblx0ICAgIChmdW5jdGlvbiByZWFjaChuKSB7XG5cdFx0aWYgKHR5cGVvZihuKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdCAgICBsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdCAgICBpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgblxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHQgICAgcmVhY2gobi5sZWZ0KTtcblx0XHQgICAgcmVhY2gobi5yaWdodCk7XG5cdFx0fVxuXHQgICAgfSkoYXN0KTtcblxuXHQgICAgLy8gVGh1bWJzIHVwIVxuXHQgICAgcmV0dXJuIHRydWU7XG5cdH1cblx0Y2F0Y2ggKGUpIHtcblx0ICAgIC8vIHN5bnRheCBlcnJvciBvciB1bmtub3duIGxpc3QgbmFtZVxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEZvcm11bGFFdmFsdWF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHNldENhcmV0UG9zaXRpb24sIG1vdmVDYXJldFBvc2l0aW9uLCBnZXRDYXJldFJhbmdlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9IGZyb20gJy4vTGlzdEZvcm11bGFQYXJzZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIExpc3RFZGl0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuXHRzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMucGFyc2VyID0gbmV3IExpc3RGb3JtdWxhUGFyc2VyKCk7XG5cdHRoaXMuZm9ybSA9IG51bGw7XG5cdHRoaXMuaW5pdERvbSgpO1xuXHR0aGlzLmlzRWRpdGluZ0Zvcm11bGEgPSBmYWxzZTtcblx0Ly9cblx0dGhpcy5saXN0ID0gbnVsbDtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0dGhpcy5mb3JtID0gdGhpcy5yb290LnNlbGVjdChcImZvcm1cIilbMF1bMF07XG5cdGlmICghdGhpcy5mb3JtKSB0aHJvdyBcIkNvdWxkIG5vdCBpbml0IExpc3RFZGl0b3IuIE5vIGZvcm0gZWxlbWVudC5cIjtcblx0ZDMuc2VsZWN0KHRoaXMuZm9ybSlcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgdCA9IGQzLmV2ZW50LnRhcmdldDtcblx0XHRpZiAoXCJidXR0b25cIiA9PT0gdC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpe1xuXHRcdCAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCAgICBsZXQgZiA9IHRoaXMuZm9ybTtcblx0XHQgICAgbGV0IHMgPSBmLmlkcy52YWx1ZS5yZXBsYWNlKC9bLHxdL2csICcgJykudHJpbSgpO1xuXHRcdCAgICBsZXQgaWRzID0gcyA/IHMuc3BsaXQoL1xccysvKSA6IFtdO1xuXHRcdCAgICAvLyBzYXZlIGxpc3Rcblx0XHQgICAgaWYgKHQubmFtZSA9PT0gXCJzYXZlXCIpIHtcblx0XHRcdGlmICghdGhpcy5saXN0KSByZXR1cm47XG5cdFx0XHR0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGVMaXN0KHRoaXMubGlzdC5uYW1lLCBmLm5hbWUudmFsdWUsIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNyZWF0ZSBuZXcgbGlzdFxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwibmV3XCIpIHtcblx0XHRcdGxldCBuID0gZi5uYW1lLnZhbHVlLnRyaW0oKTtcblx0XHRcdGlmICghbikge1xuXHRcdFx0ICAgYWxlcnQoXCJZb3VyIGxpc3QgaGFzIG5vIG5hbWUgYW5kIGlzIHZlcnkgc2FkLiBQbGVhc2UgZ2l2ZSBpdCBhIG5hbWUgYW5kIHRyeSBhZ2Fpbi5cIik7XG5cdFx0XHQgICByZXR1cm5cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKG4uaW5kZXhPZignXCInKSA+PSAwKSB7XG5cdFx0XHQgICBhbGVydChcIk9oIGRlYXIsIHlvdXIgbGlzdCdzIG5hbWUgaGFzIGEgZG91YmxlIHF1b3RlIGNoYXJhY3RlciwgYW5kIEknbSBhZmFyYWlkIHRoYXQncyBub3QgYWxsb3dlZC4gUGxlYXNlIHJlbW92ZSB0aGUgJ1xcXCInIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdFx0ICAgcmV0dXJuXG5cdFx0XHR9XG5cdFx0ICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5jcmVhdGVMaXN0KG4sIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNsZWFyIGZvcm1cblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcImNsZWFyXCIpIHtcblx0XHQgICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG5cdFx0ICAgIH1cblx0XHQgICAgLy8gZm9yd2FyZCB0byBNR0lcblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcInRvTWdpXCIpIHtcblx0XHQgICAgICAgIGxldCBmcm0gPSBkMy5zZWxlY3QoJyNtZ2liYXRjaGZvcm0nKVswXVswXTtcblx0XHRcdGZybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIiBcIik7XG5cdFx0XHRmcm0uc3VibWl0KClcblx0XHQgICAgfVxuXHRcdCAgICAvLyBmb3J3YXJkIHRvIE1vdXNlTWluZVxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwidG9Nb3VzZU1pbmVcIikge1xuXHRcdCAgICAgICAgbGV0IGZybSA9IGQzLnNlbGVjdCgnI21vdXNlbWluZWZvcm0nKVswXVswXTtcblx0XHRcdGZybS5leHRlcm5hbGlkcy52YWx1ZSA9IGlkcy5qb2luKFwiLFwiKTtcblx0XHRcdGZybS5zdWJtaXQoKVxuXHRcdCAgICB9XG5cdFx0fVxuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBzaG93L2hpZGUgZm9ybXVsYSBlZGl0b3Jcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNlY3Rpb25cIl0gLmJ1dHRvbltuYW1lPVwiZWRpdGZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGVGb3JtdWxhRWRpdG9yKCkpO1xuXHQgICAgXG5cdC8vIElucHV0IGJveDogZm9ybXVsYTogdmFsaWRhdGUgb24gYW55IGlucHV0XG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIHRoaXMudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBGb3J3YXJkIC0+IE1HSS9Nb3VzZU1pbmU6IGRpc2FibGUgYnV0dG9ucyBpZiBubyBpZHNcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIGxldCBlbXB0eSA9IHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMDtcblx0XHR0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0aGlzLmZvcm0udG9Nb3VzZU1pbmUuZGlzYWJsZWQgPSBlbXB0eTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbnM6IHRoZSBsaXN0IG9wZXJhdG9yIGJ1dHRvbnMgKHVuaW9uLCBpbnRlcnNlY3Rpb24sIGV0Yy4pXG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uLmxpc3RvcCcpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gYWRkIG15IHN5bWJvbCB0byB0aGUgZm9ybXVsYVxuXHRcdGxldCBpbmVsdCA9IHNlbGYuZm9ybS5mb3JtdWxhO1xuXHRcdGxldCBvcCA9IGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwibmFtZVwiKTtcblx0XHRzZWxmLmFkZFRvTGlzdEV4cHIob3ApO1xuXHRcdHNlbGYudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IHJlZnJlc2ggYnV0dG9uIGZvciBydW5uaW5nIHRoZSBmb3JtdWxhXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uW25hbWU9XCJyZWZyZXNoXCJdJylcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgZW1lc3NhZ2U9XCJJJ20gdGVycmlibHkgc29ycnksIGJ1dCB0aGVyZSBhcHBlYXJzIHRvIGJlIGEgcHJvYmxlbSB3aXRoIHlvdXIgbGlzdCBleHByZXNzaW9uOiBcIjtcblx0XHRsZXQgZm9ybXVsYSA9IHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlLnRyaW0oKTtcblx0XHRpZiAoZm9ybXVsYS5sZW5ndGggPT09IDApXG5cdFx0ICAgIHJldHVybjtcblx0ICAgICAgICB0aGlzLmFwcC5saXN0TWFuYWdlclxuXHRcdCAgICAuZXZhbEZvcm11bGEoZm9ybXVsYSlcblx0XHQgICAgLnRoZW4oaWRzID0+IHtcblx0XHQgICAgICAgIHRoaXMuZm9ybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIlxcblwiKTtcblx0XHQgICAgIH0pXG5cdFx0ICAgIC5jYXRjaChlID0+IGFsZXJ0KGVtZXNzYWdlICsgZSkpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBjbG9zZSBmb3JtdWxhIGVkaXRvclxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gLmJ1dHRvbltuYW1lPVwiY2xvc2VcIl0nKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5jbG9zZUZvcm11bGFFZGl0b3IoKSApO1xuXHRcblx0Ly8gQ2xpY2tpbmcgdGhlIGJveCBjb2xsYXBzZSBidXR0b24gc2hvdWxkIGNsZWFyIHRoZSBmb3JtXG5cdHRoaXMucm9vdC5zZWxlY3QoXCIuYnV0dG9uLmNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5leHRyYVwiLCAoKSA9PiB7XG5cdCAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0XHR0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpO1xuXHQgICAgfSk7XG4gICAgfVxuICAgIHBhcnNlSWRzIChzKSB7XG5cdHJldHVybiBzLnJlcGxhY2UoL1ssfF0vZywgJyAnKS50cmltKCkuc3BsaXQoL1xccysvKTtcbiAgICB9XG4gICAgZ2V0IGxpc3QgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdDtcbiAgICB9XG4gICAgc2V0IGxpc3QgKGxzdCkge1xuICAgICAgICB0aGlzLl9saXN0ID0gbHN0O1xuXHR0aGlzLl9zeW5jRGlzcGxheSgpO1xuICAgIH1cbiAgICBfc3luY0Rpc3BsYXkgKCkge1xuXHRsZXQgbHN0ID0gdGhpcy5fbGlzdDtcblx0aWYgKCFsc3QpIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0ubW9kaWZpZWQudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uc2F2ZS5kaXNhYmxlZCA9IHRydWU7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkID0gdHJ1ZTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gbHN0Lm5hbWU7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gbHN0Lmlkcy5qb2luKCdcXG4nKTtcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gbHN0LmZvcm11bGEgfHwgXCJcIjtcblx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZS50cmltKCkubGVuZ3RoID4gMDtcblx0ICAgIHRoaXMuZm9ybS5tb2RpZmllZC52YWx1ZSA9IGxzdC5tb2RpZmllZDtcblx0ICAgIHRoaXMuZm9ybS5zYXZlLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgXG5cdCAgICAgID0gdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkIFxuXHQgICAgICAgID0gKHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMCk7XG5cdH1cblx0dGhpcy52YWxpZGF0ZUV4cHIoKTtcbiAgICB9XG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuICAgIH1cbiAgICBvcGVuIChsc3QpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbHN0O1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiLCBmYWxzZSk7XG4gICAgfVxuICAgIGNsb3NlICgpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIiwgdHJ1ZSk7XG4gICAgfVxuICAgIG9wZW5Gb3JtdWxhRWRpdG9yICgpIHtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJlZGl0aW5nZm9ybXVsYVwiLCB0cnVlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gdHJ1ZTtcblx0bGV0IGYgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZTtcblx0dGhpcy5mb3JtLmZvcm11bGEuZm9jdXMoKTtcblx0c2V0Q2FyZXRQb3NpdGlvbih0aGlzLmZvcm0uZm9ybXVsYSwgZi5sZW5ndGgpO1xuICAgIH1cbiAgICBjbG9zZUZvcm11bGFFZGl0b3IgKCkge1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImVkaXRpbmdmb3JtdWxhXCIsIGZhbHNlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gZmFsc2U7XG4gICAgfVxuICAgIHRvZ2dsZUZvcm11bGFFZGl0b3IgKCkge1xuXHRsZXQgc2hvd2luZyA9IHRoaXMucm9vdC5jbGFzc2VkKFwiZWRpdGluZ2Zvcm11bGFcIik7XG5cdHNob3dpbmcgPyB0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpIDogdGhpcy5vcGVuRm9ybXVsYUVkaXRvcigpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDaGVja3MgdGhlIGN1cnJlbnQgZXhwcmVzc2lvbiBhbmQgc2V0cyB0aGUgdmFsaWQvaW52YWxpZCBjbGFzcy5cbiAgICB2YWxpZGF0ZUV4cHIgICgpIHtcblx0bGV0IGlucCA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKTtcblx0bGV0IGV4cHIgPSBpbnBbMF1bMF0udmFsdWUudHJpbSgpO1xuXHRpZiAoIWV4cHIpIHtcblx0ICAgIGlucC5jbGFzc2VkKFwidmFsaWRcIixmYWxzZSkuY2xhc3NlZChcImludmFsaWRcIixmYWxzZSk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IGZhbHNlO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgbGV0IGlzVmFsaWQgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5pc1ZhbGlkKGV4cHIpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHQgICAgaW5wLmNsYXNzZWQoXCJ2YWxpZFwiLCBpc1ZhbGlkKS5jbGFzc2VkKFwiaW52YWxpZFwiLCAhaXNWYWxpZCk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IHRydWU7XG5cdH1cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYWRkVG9MaXN0RXhwciAodGV4dCkge1xuXHRsZXQgaW5wID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIFtuYW1lPVwiZm9ybXVsYVwiXScpO1xuXHRsZXQgaWVsdCA9IGlucFswXVswXTtcblx0bGV0IHYgPSBpZWx0LnZhbHVlO1xuXHRsZXQgc3BsaWNlID0gZnVuY3Rpb24gKGUsdCl7XG5cdCAgICBsZXQgdiA9IGUudmFsdWU7XG5cdCAgICBsZXQgciA9IGdldENhcmV0UmFuZ2UoZSk7XG5cdCAgICBlLnZhbHVlID0gdi5zbGljZSgwLHJbMF0pICsgdCArIHYuc2xpY2UoclsxXSk7XG5cdCAgICBzZXRDYXJldFBvc2l0aW9uKGUsIHJbMF0rdC5sZW5ndGgpO1xuXHQgICAgZS5mb2N1cygpO1xuXHR9XG5cdGxldCByYW5nZSA9IGdldENhcmV0UmFuZ2UoaWVsdCk7XG5cdGlmIChyYW5nZVswXSA9PT0gcmFuZ2VbMV0pIHtcblx0ICAgIC8vIG5vIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dCk7XG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKSBcblx0XHRtb3ZlQ2FyZXRQb3NpdGlvbihpZWx0LCAtMSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICAvLyB0aGVyZSBpcyBhIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKVxuXHRcdC8vIHN1cnJvdW5kIGN1cnJlbnQgc2VsZWN0aW9uIHdpdGggcGFyZW5zLCB0aGVuIG1vdmUgY2FyZXQgYWZ0ZXJcblx0XHR0ZXh0ID0gJygnICsgdi5zbGljZShyYW5nZVswXSxyYW5nZVsxXSkgKyAnKSc7XG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dClcblx0fVxuXHR0aGlzLnZhbGlkYXRlRXhwcigpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIExpc3RFZGl0b3JcblxuZXhwb3J0IHsgTGlzdEVkaXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEVkaXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTG9jYWxTdG9yYWdlTWFuYWdlciB9IGZyb20gJy4vU3RvcmFnZU1hbmFnZXInO1xuXG5jb25zdCBNR1JfTkFNRSA9IFwicHJlZnNNYW5hZ2VyXCI7XG5jb25zdCBJVEVNX05BTUU9IFwidXNlclByZWZzXCI7XG5cbmNsYXNzIFVzZXJQcmVmc01hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZU1hbmFnZXIoTUdSX05BTUUpO1xuXHR0aGlzLmRhdGEgPSBudWxsO1xuXHR0aGlzLl9sb2FkKCk7XG4gICAgfVxuICAgIF9sb2FkICgpIHtcblx0dGhpcy5kYXRhID0gdGhpcy5zdG9yYWdlLmdldChJVEVNX05BTUUpO1xuXHRpZiAoIXRoaXMuZGF0YSl7XG5cdCAgICB0aGlzLmRhdGEgPSB7fTtcblx0ICAgIHRoaXMuX3NhdmUoKTtcblx0fVxuICAgIH1cbiAgICBfc2F2ZSAoKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5wdXQoSVRFTV9OQU1FLCB0aGlzLmRhdGEpO1xuICAgIH1cbiAgICBoYXMgKG4pIHtcbiAgICB9XG4gICAgZ2V0IChuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbbl07XG4gICAgfVxuICAgIGdldEFsbCAoKSB7XG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRhdGEpXG4gICAgfVxuICAgIHNldCAobiwgdikge1xuICAgICAgICB0aGlzLmRhdGFbbl0gPSB2O1xuXHR0aGlzLl9zYXZlKCk7XG4gICAgfVxuICAgIHNldEFsbCAodikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuZGF0YSwgdik7XG5cdHRoaXMuX3NhdmUoKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IFVzZXJQcmVmc01hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1VzZXJQcmVmc01hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEZhY2V0IH0gZnJvbSAnLi9GYWNldCc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgRmFjZXRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwKSB7XG5cdHRoaXMuYXBwID0gYXBwO1xuXHR0aGlzLmZhY2V0cyA9IFtdO1xuXHR0aGlzLm5hbWUyZmFjZXQgPSB7fVxuICAgIH1cbiAgICBhZGRGYWNldCAobmFtZSwgdmFsdWVGY24pIHtcblx0aWYgKHRoaXMubmFtZTJmYWNldFtuYW1lXSkgdGhyb3cgXCJEdXBsaWNhdGUgZmFjZXQgbmFtZS4gXCIgKyBuYW1lO1xuXHRsZXQgZmFjZXQgPSBuZXcgRmFjZXQobmFtZSwgdGhpcywgdmFsdWVGY24pO1xuICAgICAgICB0aGlzLmZhY2V0cy5wdXNoKCBmYWNldCApO1xuXHR0aGlzLm5hbWUyZmFjZXRbbmFtZV0gPSBmYWNldDtcblx0cmV0dXJuIGZhY2V0XG4gICAgfVxuICAgIHRlc3QgKGYpIHtcbiAgICAgICAgbGV0IHZhbHMgPSB0aGlzLmZhY2V0cy5tYXAoIGZhY2V0ID0+IGZhY2V0LnRlc3QoZikgKTtcblx0cmV0dXJuIHZhbHMucmVkdWNlKChhY2N1bSwgdmFsKSA9PiBhY2N1bSAmJiB2YWwsIHRydWUpO1xuICAgIH1cbiAgICBhcHBseUFsbCAoKSB7XG5cdGxldCBzaG93ID0gbnVsbDtcblx0bGV0IGhpZGUgPSBcIm5vbmVcIjtcblx0Ly8gRklYTUU6IG1ham9yIHJlYWNob3ZlclxuXHR0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcImcuc3RyaXBzXCIpLnNlbGVjdEFsbCgncmVjdC5mZWF0dXJlJylcblx0ICAgIC5zdHlsZShcImRpc3BsYXlcIiwgZiA9PiB0aGlzLnRlc3QoZikgPyBzaG93IDogaGlkZSk7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgRmFjZXRNYW5hZ2VyXG5cbmV4cG9ydCB7IEZhY2V0TWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmFjZXRNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIEZhY2V0IHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSwgbWFuYWdlciwgdmFsdWVGY24pIHtcblx0dGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcblx0dGhpcy52YWx1ZXMgPSBbXTtcblx0dGhpcy52YWx1ZUZjbiA9IHZhbHVlRmNuO1xuICAgIH1cbiAgICBzZXRWYWx1ZXMgKHZhbHVlcywgcXVpZXRseSkge1xuICAgICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcblx0aWYgKCEgcXVpZXRseSkge1xuXHQgICAgdGhpcy5tYW5hZ2VyLmFwcGx5QWxsKCk7XG5cdCAgICB0aGlzLm1hbmFnZXIuYXBwLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9XG4gICAgfVxuICAgIHRlc3QgKGYpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLnZhbHVlcyB8fCB0aGlzLnZhbHVlcy5sZW5ndGggPT09IDAgfHwgdGhpcy52YWx1ZXMuaW5kZXhPZiggdGhpcy52YWx1ZUZjbihmKSApID49IDA7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgRmFjZXRcblxuZXhwb3J0IHsgRmFjZXQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZhY2V0LmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBkM3RzdiB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQmxvY2tUcmFuc2xhdG9yIH0gZnJvbSAnLi9CbG9ja1RyYW5zbGF0b3InO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEJsb2NrVHJhbnNsYXRvciBtYW5hZ2VyIGNsYXNzLiBGb3IgYW55IGdpdmVuIHBhaXIgb2YgZ2Vub21lcywgQSBhbmQgQiwgbG9hZHMgdGhlIHNpbmdsZSBibG9jayBmaWxlXG4vLyBmb3IgdHJhbnNsYXRpbmcgYmV0d2VlbiB0aGVtLCBhbmQgaW5kZXhlcyBpdCBcImZyb20gYm90aCBkaXJlY3Rpb25zXCI6XG4vLyBcdEEtPkItPiBbQUJfQmxvY2tGaWxlXSA8LUE8LUJcbi8vXG5jbGFzcyBCVE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG5cdHRoaXMucmNCbG9ja3MgPSB7fTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZWdpc3RlckJsb2NrcyAodXJsLCBhR2Vub21lLCBiR2Vub21lLCBibG9ja3MpIHtcblx0Y29uc29sZS5sb2coXCJSZWdpc3RlcmluZyBibG9ja3MgZnJvbTogXCIgKyB1cmwsIGJsb2Nrcyk7XG5cdGxldCBhbmFtZSA9IGFHZW5vbWUubmFtZTtcblx0bGV0IGJuYW1lID0gYkdlbm9tZS5uYW1lO1xuXHRsZXQgYmxrRmlsZSA9IG5ldyBCbG9ja1RyYW5zbGF0b3IodXJsLGFHZW5vbWUsYkdlbm9tZSxibG9ja3MpO1xuXHRpZiggISB0aGlzLnJjQmxvY2tzW2FuYW1lXSkgdGhpcy5yY0Jsb2Nrc1thbmFtZV0gPSB7fTtcblx0aWYoICEgdGhpcy5yY0Jsb2Nrc1tibmFtZV0pIHRoaXMucmNCbG9ja3NbYm5hbWVdID0ge307XG5cdHRoaXMucmNCbG9ja3NbYW5hbWVdW2JuYW1lXSA9IGJsa0ZpbGU7XG5cdHRoaXMucmNCbG9ja3NbYm5hbWVdW2FuYW1lXSA9IGJsa0ZpbGU7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gTG9hZHMgdGhlIHN5bnRlbnkgYmxvY2sgZmlsZSBmb3IgZ2Vub21lcyBhR2Vub21lIGFuZCBiR2Vub21lLlxuICAgIC8vIFxuICAgIGdldEJsb2NrRmlsZSAoYUdlbm9tZSwgYkdlbm9tZSkge1xuXHQvLyBCZSBhIGxpdHRsZSBzbWFydCBhYm91dCB0aGUgb3JkZXIgd2UgdHJ5IHRoZSBuYW1lcy4uLlxuXHRpZiAoYkdlbm9tZS5uYW1lIDwgYUdlbm9tZS5uYW1lKSB7XG5cdCAgICBsZXQgdG1wID0gYUdlbm9tZTsgYUdlbm9tZSA9IGJHZW5vbWU7IGJHZW5vbWUgPSB0bXA7XG5cdH1cblx0Ly8gRmlyc3QsIHNlZSBpZiB3ZSBhbHJlYWR5IGhhdmUgdGhpcyBwYWlyXG5cdGxldCBhbmFtZSA9IGFHZW5vbWUubmFtZTtcblx0bGV0IGJuYW1lID0gYkdlbm9tZS5uYW1lO1xuXHRsZXQgYmYgPSAodGhpcy5yY0Jsb2Nrc1thbmFtZV0gfHwge30pW2JuYW1lXTtcblx0aWYgKGJmKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShiZik7XG5cdFxuXHQvLyBGb3IgYW55IGdpdmVuIGdlbm9tZSBwYWlyLCBvbmx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIHR3byBmaWxlc1xuXHQvLyBpcyBnZW5lcmF0ZWQgYnkgdGhlIGJhY2sgZW5kXG5cdGxldCBmbjEgPSBgLi9kYXRhL2Jsb2NrZmlsZXMvJHthR2Vub21lLm5hbWV9LSR7Ykdlbm9tZS5uYW1lfS50c3ZgXG5cdGxldCBmbjIgPSBgLi9kYXRhL2Jsb2NrZmlsZXMvJHtiR2Vub21lLm5hbWV9LSR7YUdlbm9tZS5uYW1lfS50c3ZgXG5cdC8vIFRoZSBmaWxlIGZvciBBLT5CIGlzIHNpbXBseSBhIHJlLXNvcnQgb2YgdGhlIGZpbGUgZnJvbSBCLT5BLiBTbyB0aGUgXG5cdC8vIGJhY2sgZW5kIG9ubHkgY3JlYXRlcyBvbmUgb2YgdGhlbS5cblx0Ly8gV2UnbGwgdHJ5IG9uZSBhbmQgaWYgdGhhdCdzIG5vdCBpdCwgdGhlbiB0cnkgdGhlIG90aGVyLlxuXHQvLyAoQW5kIGlmIFRIQVQncyBub3QgaXQsIHRoZW4gY3J5IGEgcml2ZXIuLi4pXG5cdGxldCBzZWxmID0gdGhpcztcblx0cmV0dXJuIGQzdHN2KGZuMSlcblx0ICAudGhlbihmdW5jdGlvbihibG9ja3Mpe1xuXHQgICAgICAvLyB5dXAsIGl0IHdhcyBBLUJcblx0ICAgICAgc2VsZi5yZWdpc3RlckJsb2NrcyhmbjEsIGFHZW5vbWUsIGJHZW5vbWUsIGJsb2Nrcyk7XG5cdCAgICAgIHJldHVybiBibG9ja3Ncblx0ICB9KVxuXHQgIC5jYXRjaChmdW5jdGlvbihlKXtcblx0ICAgICAgY29uc29sZS5sb2coYElORk86IERpc3JlZ2FyZCB0aGF0IDQwNCBtZXNzYWdlISAke2ZuMX0gd2FzIG5vdCBmb3VuZC4gVHJ5aW5nICR7Zm4yfS5gKTtcblx0ICAgICAgcmV0dXJuIGQzdHN2KGZuMilcblx0XHQgIC50aGVuKGZ1bmN0aW9uKGJsb2Nrcyl7XG5cdFx0ICAgICAgLy8gbm9wZSwgaXQgd2FzIEItQVxuXHRcdCAgICAgIHNlbGYucmVnaXN0ZXJCbG9ja3MoZm4yLCBiR2Vub21lLCBhR2Vub21lLCBibG9ja3MpO1xuXHRcdCAgICAgIHJldHVybiBibG9ja3Ncblx0XHQgIH0pXG5cdFx0ICAuY2F0Y2goZnVuY3Rpb24oZSl7XG5cdFx0ICAgICAgY29uc29sZS5sb2coJ0J1dCBUSEFUIDQwNCBtZXNzYWdlIGlzIGEgcHJvYmxlbS4nKTtcblx0XHQgICAgICB0aHJvdyBgQ2Fubm90IGdldCBibG9jayBmaWxlIGZvciB0aGlzIGdlbm9tZSBwYWlyOiAke2FHZW5vbWUubmFtZX0gJHtiR2Vub21lLm5hbWV9LlxcbihFcnJvcj0ke2V9KWA7XG5cdFx0ICB9KTtcblx0ICB9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHRoZSB0cmFuc2xhdG9yIGhhcyBsb2FkZWQgYWxsIHRoZSBkYXRhIG5lZWRlZFxuICAgIC8vIGZvciB0cmFuc2xhdGluZyBjb29yZGluYXRlcyBiZXR3ZWVuIHRoZSBjdXJyZW50IHJlZiBzdHJhaW4gYW5kIHRoZSBjdXJyZW50IGNvbXBhcmlzb24gc3RyYWlucy5cbiAgICAvL1xuICAgIHJlYWR5ICgpIHtcblx0bGV0IHByb21pc2VzID0gdGhpcy5hcHAuY0dlbm9tZXMubWFwKGNnID0+IHRoaXMuZ2V0QmxvY2tGaWxlKHRoaXMuYXBwLnJHZW5vbWUsIGNnKSk7XG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBzeW50ZW55IGJsb2NrIHRyYW5zbGF0b3IgdGhhdCBtYXBzIHRoZSBjdXJyZW50IHJlZiBnZW5vbWUgdG8gdGhlIHNwZWNpZmllZCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIGdldEJsb2NrcyAoZnJvbUdlbm9tZSwgdG9HZW5vbWUpIHtcbiAgICAgICAgbGV0IGJsa1RyYW5zID0gdGhpcy5yY0Jsb2Nrc1tmcm9tR2Vub21lLm5hbWVdW3RvR2Vub21lLm5hbWVdO1xuXHRyZXR1cm4gYmxrVHJhbnMuZ2V0QmxvY2tzKGZyb21HZW5vbWUpXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVHJhbnNsYXRlcyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSBzcGVjaWZpZWQgZnJvbUdlbm9tZSB0byB0aGUgc3BlY2lmaWVkIHRvR2Vub21lLlxuICAgIC8vIFJldHVybnMgYSBsaXN0IG9mIHplcm8gb3IgbW9yZSBjb29yZGluYXRlIHJhbmdlcyBpbiB0aGUgdG9HZW5vbWUuXG4gICAgLy9cbiAgICB0cmFuc2xhdGUgKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCwgdG9HZW5vbWUsIGludmVydGVkKSB7XG5cdC8vIGdldCB0aGUgcmlnaHQgYmxvY2sgZmlsZVxuXHRsZXQgYmxrVHJhbnMgPSB0aGlzLnJjQmxvY2tzW2Zyb21HZW5vbWUubmFtZV1bdG9HZW5vbWUubmFtZV07XG5cdGlmICghYmxrVHJhbnMpIHRocm93IFwiSW50ZXJuYWwgZXJyb3IuIE5vIGJsb2NrIGZpbGUgZm91bmQgaW4gaW5kZXguXCJcblx0Ly8gdHJhbnNsYXRlIVxuXHRsZXQgcmFuZ2VzID0gYmxrVHJhbnMudHJhbnNsYXRlKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCwgaW52ZXJ0ZWQpO1xuXHRyZXR1cm4gcmFuZ2VzO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEJUTWFuYWdlclxuXG5leHBvcnQgeyBCVE1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0JUTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTb21ldGhpbmcgdGhhdCBrbm93cyBob3cgdG8gdHJhbnNsYXRlIGNvb3JkaW5hdGVzIGJldHdlZW4gdHdvIGdlbm9tZXMuXG4vL1xuLy9cbmNsYXNzIEJsb2NrVHJhbnNsYXRvciB7XG4gICAgY29uc3RydWN0b3IodXJsLCBhR2Vub21lLCBiR2Vub21lLCBibG9ja3Mpe1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcblx0dGhpcy5hR2Vub21lID0gYUdlbm9tZTtcblx0dGhpcy5iR2Vub21lID0gYkdlbm9tZTtcblx0dGhpcy5ibG9ja3MgPSBibG9ja3MubWFwKGIgPT4gdGhpcy5wcm9jZXNzQmxvY2soYikpXG5cdHRoaXMuY3VycmVudFNvcnQgPSBcImFcIjsgLy8gZWl0aGVyICdhJyBvciAnYidcbiAgICB9XG4gICAgcHJvY2Vzc0Jsb2NrIChibGspIHsgXG4gICAgICAgIGJsay5hSW5kZXggPSBwYXJzZUludChibGsuYUluZGV4KTtcbiAgICAgICAgYmxrLmJJbmRleCA9IHBhcnNlSW50KGJsay5iSW5kZXgpO1xuICAgICAgICBibGsuYVN0YXJ0ID0gcGFyc2VJbnQoYmxrLmFTdGFydCk7XG4gICAgICAgIGJsay5iU3RhcnQgPSBwYXJzZUludChibGsuYlN0YXJ0KTtcbiAgICAgICAgYmxrLmFFbmQgICA9IHBhcnNlSW50KGJsay5hRW5kKTtcbiAgICAgICAgYmxrLmJFbmQgICA9IHBhcnNlSW50KGJsay5iRW5kKTtcbiAgICAgICAgYmxrLmFMZW5ndGggICA9IHBhcnNlSW50KGJsay5hTGVuZ3RoKTtcbiAgICAgICAgYmxrLmJMZW5ndGggICA9IHBhcnNlSW50KGJsay5iTGVuZ3RoKTtcbiAgICAgICAgYmxrLmJsb2NrQ291bnQgICA9IHBhcnNlSW50KGJsay5ibG9ja0NvdW50KTtcbiAgICAgICAgYmxrLmJsb2NrUmF0aW8gICA9IHBhcnNlRmxvYXQoYmxrLmJsb2NrUmF0aW8pO1xuXHRibGsuYWJNYXAgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHQgICAgLmRvbWFpbihbYmxrLmFTdGFydCxibGsuYUVuZF0pXG5cdCAgICAucmFuZ2UoIGJsay5ibG9ja09yaT09PVwiLVwiID8gW2Jsay5iRW5kLGJsay5iU3RhcnRdIDogW2Jsay5iU3RhcnQsYmxrLmJFbmRdKTtcblx0YmxrLmJhTWFwID0gYmxrLmFiTWFwLmludmVydFxuXHRyZXR1cm4gYmxrO1xuICAgIH1cbiAgICBzZXRTb3J0ICh3aGljaCkge1xuXHRpZiAod2hpY2ggIT09ICdhJyAmJiB3aGljaCAhPT0gJ2InKSB0aHJvdyBcIkJhZCBhcmd1bWVudDpcIiArIHdoaWNoO1xuXHRsZXQgc29ydENvbCA9IHdoaWNoICsgXCJJbmRleFwiO1xuXHRsZXQgY21wID0gKHgseSkgPT4geFtzb3J0Q29sXSAtIHlbc29ydENvbF07XG5cdHRoaXMuYmxvY2tzLnNvcnQoY21wKTtcblx0dGhpcy5jdXJyU29ydCA9IHdoaWNoO1xuICAgIH1cbiAgICBmbGlwU29ydCAoKSB7XG5cdHRoaXMuc2V0U29ydCh0aGlzLmN1cnJTb3J0ID09PSBcImFcIiA/IFwiYlwiIDogXCJhXCIpO1xuICAgIH1cbiAgICAvLyBHaXZlbiBhIGdlbm9tZSAoZWl0aGVyIHRoZSBhIG9yIGIgZ2Vub21lKSBhbmQgYSBjb29yZGluYXRlIHJhbmdlLFxuICAgIC8vIHJldHVybnMgdGhlIGVxdWl2YWxlbnQgY29vcmRpbmF0ZSByYW5nZShzKSBpbiB0aGUgb3RoZXIgZ2Vub21lXG4gICAgdHJhbnNsYXRlIChmcm9tR2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQsIGludmVydCkge1xuXHQvL1xuXHRlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHN0YXJ0IDogZW5kO1xuXHQvLyBmcm9tID0gXCJhXCIgb3IgXCJiXCIsIGRlcGVuZGluZyBvbiB3aGljaCBnZW5vbWUgaXMgZ2l2ZW4uXG4gICAgICAgIGxldCBmcm9tID0gKGZyb21HZW5vbWUgPT09IHRoaXMuYUdlbm9tZSA/IFwiYVwiIDogZnJvbUdlbm9tZSA9PT0gdGhpcy5iR2Vub21lID8gXCJiXCIgOiBudWxsKTtcblx0aWYgKCFmcm9tKSB0aHJvdyBcIkJhZCBhcmd1bWVudC4gR2Vub21lIG5laXRoZXIgQSBub3IgQi5cIjtcblx0Ly8gdG8gPSBcImJcIiBvciBcImFcIiwgb3Bwb3NpdGUgb2YgZnJvbVxuXHRsZXQgdG8gPSAoZnJvbSA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcblx0Ly8gbWFrZSBzdXJlIHRoZSBibG9ja3MgYXJlIHNvcnRlZCBieSB0aGUgZnJvbSBnZW5vbWVcblx0dGhpcy5zZXRTb3J0KGZyb20pO1xuXHQvL1xuXHRsZXQgZnJvbUMgPSBmcm9tK1wiQ2hyXCI7XG5cdGxldCBmcm9tUyA9IGZyb20rXCJTdGFydFwiO1xuXHRsZXQgZnJvbUUgPSBmcm9tK1wiRW5kXCI7XG5cdGxldCBmcm9tSSA9IGZyb20rXCJJbmRleFwiO1xuXHRsZXQgdG9DID0gdG8rXCJDaHJcIjtcblx0bGV0IHRvUyA9IHRvK1wiU3RhcnRcIjtcblx0bGV0IHRvRSA9IHRvK1wiRW5kXCI7XG5cdGxldCB0b0kgPSB0bytcIkluZGV4XCI7XG5cdGxldCBtYXBwZXIgPSBmcm9tK3RvK1wiTWFwXCI7XG5cdC8vIFxuXHRsZXQgYmxrcyA9IHRoaXMuYmxvY2tzXG5cdCAgICAvLyBGaXJzdCBmaWx0ZXIgZm9yIGJsb2NrcyB0aGF0IG92ZXJsYXAgdGhlIGdpdmVuIGNvb3JkaW5hdGUgcmFuZ2UgaW4gdGhlIGZyb20gZ2Vub21lXG5cdCAgICAuZmlsdGVyKGJsayA9PiBibGtbZnJvbUNdID09PSBjaHIgJiYgYmxrW2Zyb21TXSA8PSBlbmQgJiYgYmxrW2Zyb21FXSA+PSBzdGFydClcblx0ICAgIC8vIG1hcCBlYWNoIGJsb2NrLiBcblx0ICAgIC5tYXAoYmxrID0+IHtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgZnJvbSBzaWRlLlxuXHRcdGxldCBzID0gTWF0aC5tYXgoc3RhcnQsIGJsa1tmcm9tU10pO1xuXHRcdGxldCBlID0gTWF0aC5taW4oZW5kLCBibGtbZnJvbUVdKTtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgdG8gc2lkZS5cblx0XHRsZXQgczIgPSBNYXRoLmNlaWwoYmxrW21hcHBlcl0ocykpO1xuXHRcdGxldCBlMiA9IE1hdGguZmxvb3IoYmxrW21hcHBlcl0oZSkpO1xuXHQgICAgICAgIHJldHVybiBpbnZlcnQgPyB7XG5cdFx0ICAgIGNocjogICBibGtbZnJvbUNdLFxuXHRcdCAgICBzdGFydDogcyxcblx0XHQgICAgZW5kOiAgIGUsXG5cdFx0ICAgIG9yaTogICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGluZGV4OiBibGtbZnJvbUldLFxuXHRcdCAgICAvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZHMgZm9yIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0ICAgIGZDaHI6ICAgYmxrW3RvQ10sXG5cdFx0ICAgIGZTdGFydDogTWF0aC5taW4oczIsZTIpLFxuXHRcdCAgICBmRW5kOiAgIE1hdGgubWF4KHMyLGUyKSxcblx0XHQgICAgZkluZGV4OiBibGtbdG9JXSxcblx0XHQgICAgLy8gaW5jbHVkZSB0aGUgYmxvY2sgaWQgYW5kIGZ1bGwgYmxvY2sgY29vcmRzXG5cdFx0ICAgIGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdCAgICBibG9ja1N0YXJ0OiBibGtbZnJvbVNdLFxuXHRcdCAgICBibG9ja0VuZDogYmxrW2Zyb21FXVxuXHRcdCAgICB9IDoge1xuXHRcdCAgICBjaHI6ICAgYmxrW3RvQ10sXG5cdFx0ICAgIHN0YXJ0OiBNYXRoLm1pbihzMixlMiksXG5cdFx0ICAgIGVuZDogICBNYXRoLm1heChzMixlMiksXG5cdFx0ICAgIG9yaTogICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGluZGV4OiBibGtbdG9JXSxcblx0XHQgICAgLy8gYWxzbyByZXR1cm4gdGhlIGZyb21HZW5vbWUgY29vcmRzIGZvciB0aGlzIHBpZWNlIG9mIHRoZSB0cmFuc2xhdGlvblxuXHRcdCAgICBmQ2hyOiAgIGJsa1tmcm9tQ10sXG5cdFx0ICAgIGZTdGFydDogcyxcblx0XHQgICAgZkVuZDogICBlLFxuXHRcdCAgICBmSW5kZXg6IGJsa1tmcm9tSV0sXG5cdFx0ICAgIC8vIGluY2x1ZGUgdGhlIGJsb2NrIGlkIGFuZCBmdWxsIGJsb2NrIGNvb3Jkc1xuXHRcdCAgICBibG9ja0lkOiBibGsuYmxvY2tJZCxcblx0XHQgICAgYmxvY2tTdGFydDogYmxrW3RvU10sXG5cdFx0ICAgIGJsb2NrRW5kOiBibGtbdG9FXVxuXHRcdH07XG5cdCAgICB9KVxuXHQvLyBcblx0cmV0dXJuIGJsa3M7XG4gICAgfVxuICAgIC8vIEdpdmVuIGEgZ2Vub21lIChlaXRoZXIgdGhlIGEgb3IgYiBnZW5vbWUpXG4gICAgLy8gcmV0dXJucyB0aGUgYmxvY2tzIGZvciB0cmFuc2xhdGluZyB0byB0aGUgb3RoZXIgKGIgb3IgYSkgZ2Vub21lLlxuICAgIC8vXG4gICAgZ2V0QmxvY2tzIChmcm9tR2Vub21lKSB7XG5cdC8vIGZyb20gPSBcImFcIiBvciBcImJcIiwgZGVwZW5kaW5nIG9uIHdoaWNoIGdlbm9tZSBpcyBnaXZlbi5cbiAgICAgICAgbGV0IGZyb20gPSAoZnJvbUdlbm9tZSA9PT0gdGhpcy5hR2Vub21lID8gXCJhXCIgOiBmcm9tR2Vub21lID09PSB0aGlzLmJHZW5vbWUgPyBcImJcIiA6IG51bGwpO1xuXHRpZiAoIWZyb20pIHRocm93IFwiQmFkIGFyZ3VtZW50LiBHZW5vbWUgbmVpdGhlciBBIG5vciBCLlwiO1xuXHQvLyB0byA9IFwiYlwiIG9yIFwiYVwiLCBvcHBvc2l0ZSBvZiBmcm9tXG5cdGxldCB0byA9IChmcm9tID09PSBcImFcIiA/IFwiYlwiIDogXCJhXCIpO1xuXHQvLyBtYWtlIHN1cmUgdGhlIGJsb2NrcyBhcmUgc29ydGVkIGJ5IHRoZSBmcm9tIGdlbm9tZVxuXHR0aGlzLnNldFNvcnQoZnJvbSk7XG5cdC8vXG5cdGxldCBmcm9tQyA9IGZyb20rXCJDaHJcIjtcblx0bGV0IGZyb21TID0gZnJvbStcIlN0YXJ0XCI7XG5cdGxldCBmcm9tRSA9IGZyb20rXCJFbmRcIjtcblx0bGV0IGZyb21JID0gZnJvbStcIkluZGV4XCI7XG5cdGxldCB0b0MgPSB0bytcIkNoclwiO1xuXHRsZXQgdG9TID0gdG8rXCJTdGFydFwiO1xuXHRsZXQgdG9FID0gdG8rXCJFbmRcIjtcblx0bGV0IHRvSSA9IHRvK1wiSW5kZXhcIjtcblx0bGV0IG1hcHBlciA9IGZyb20rdG8rXCJNYXBcIjtcblx0Ly8gXG5cdGxldCBibGtzID0gdGhpcy5ibG9ja3Ncblx0ICAgIC5tYXAoYmxrID0+IHtcblx0ICAgICAgICByZXR1cm4ge1xuXHRcdCAgICBibG9ja0lkOiAgIGJsay5ibG9ja0lkLFxuXHRcdCAgICBvcmk6ICAgICAgIGJsay5ibG9ja09yaSxcblx0XHQgICAgZnJvbUNocjogICBibGtbZnJvbUNdLFxuXHRcdCAgICBmcm9tU3RhcnQ6IGJsa1tmcm9tU10sXG5cdFx0ICAgIGZyb21FbmQ6ICAgYmxrW2Zyb21FXSxcblx0XHQgICAgZnJvbUluZGV4OiBibGtbZnJvbUldLFxuXHRcdCAgICB0b0NocjogICAgIGJsa1t0b0NdLFxuXHRcdCAgICB0b1N0YXJ0OiAgIGJsa1t0b1NdLFxuXHRcdCAgICB0b0VuZDogICAgIGJsa1t0b0VdLFxuXHRcdCAgICB0b0luZGV4OiAgIGJsa1t0b0ldXG5cdFx0fTtcblx0ICAgIH0pXG5cdC8vIFxuXHRyZXR1cm4gYmxrcztcbiAgICB9XG59XG5cbmV4cG9ydCB7IEJsb2NrVHJhbnNsYXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQmxvY2tUcmFuc2xhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTVkdWaWV3IH0gZnJvbSAnLi9TVkdWaWV3JztcbmltcG9ydCB7IGNvb3Jkc0FmdGVyVHJhbnNmb3JtIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgR2Vub21lVmlldyBleHRlbmRzIFNWR1ZpZXcge1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCk7XG5cdHRoaXMub3BlbldpZHRoID0gdGhpcy5vdXRlcldpZHRoO1xuXHR0aGlzLm9wZW5IZWlnaHQ9IHRoaXMub3V0ZXJIZWlnaHQ7XG5cdHRoaXMudG90YWxDaHJXaWR0aCA9IDQwOyAvLyB0b3RhbCB3aWR0aCBvZiBvbmUgY2hyb21vc29tZSAoYmFja2JvbmUrYmxvY2tzK2ZlYXRzKVxuXHR0aGlzLmN3aWR0aCA9IDIwOyAgICAgICAgLy8gY2hyb21vc29tZSB3aWR0aFxuXHR0aGlzLnRpY2tMZW5ndGggPSAxMDtcdCAvLyBmZWF0dXJlIHRpY2sgbWFyayBsZW5ndGhcblx0dGhpcy5icnVzaENociA9IG51bGw7XHQgLy8gd2hpY2ggY2hyIGhhcyB0aGUgY3VycmVudCBicnVzaFxuXHR0aGlzLmJ3aWR0aCA9IHRoaXMuY3dpZHRoLzI7ICAvLyBibG9jayB3aWR0aFxuXHR0aGlzLmN1cnJCbG9ja3MgPSBudWxsO1xuXHR0aGlzLmN1cnJUaWNrcyA9IG51bGw7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzID0gdGhpcy5zdmdNYWluLmFwcGVuZCgnZycpLmF0dHIoXCJuYW1lXCIsIFwiY2hyb21vc29tZXNcIik7XG5cdHRoaXMudGl0bGUgICAgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCd0ZXh0JykuYXR0cihcImNsYXNzXCIsIFwidGl0bGVcIik7XG5cdHRoaXMuc2Nyb2xsQW1vdW50ID0gMDtcblx0Ly9cblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZpdFRvV2lkdGggKHcpe1xuICAgICAgICBzdXBlci5maXRUb1dpZHRoKHcpO1xuXHR0aGlzLm9wZW5XaWR0aCA9IHRoaXMub3V0ZXJXaWR0aDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdERvbSAoKSB7XG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b24uY2xvc2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHRoaXMucmVkcmF3KCkpO1xuXHR0aGlzLnN2Zy5vbihcIndoZWVsXCIsICgpID0+IHtcblx0ICAgIGlmICghdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIikpIHJldHVybjtcblx0ICAgIHRoaXMuc2Nyb2xsV2hlZWwoZDMuZXZlbnQuZGVsdGFZKVxuXHQgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fSk7XG5cdGxldCBzYnMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInN2Z2NvbnRhaW5lclwiXSA+IFtuYW1lPVwic2Nyb2xsYnV0dG9uc1wiXScpXG5cdHNicy5zZWxlY3QoJy5idXR0b25bbmFtZT1cInVwXCJdJykub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNjcm9sbENocm9tb3NvbWVzVXAoKSk7XG5cdHNicy5zZWxlY3QoJy5idXR0b25bbmFtZT1cImRuXCJdJykub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNjcm9sbENocm9tb3NvbWVzRG93bigpKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRCcnVzaENvb3JkcyAoY29vcmRzKSB7XG5cdHRoaXMuY2xlYXJCcnVzaGVzKCk7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdChgLmNocm9tb3NvbWVbbmFtZT1cIiR7Y29vcmRzLmNocn1cIl0gZ1tuYW1lPVwiYnJ1c2hcIl1gKVxuXHQgIC5lYWNoKGZ1bmN0aW9uKGNocil7XG5cdCAgICBjaHIuYnJ1c2guZXh0ZW50KFtjb29yZHMuc3RhcnQsY29vcmRzLmVuZF0pO1xuXHQgICAgY2hyLmJydXNoKGQzLnNlbGVjdCh0aGlzKSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBicnVzaHN0YXJ0IChjaHIpe1xuXHR0aGlzLmNsZWFyQnJ1c2hlcyhjaHIuYnJ1c2gpO1xuXHR0aGlzLmJydXNoQ2hyID0gY2hyO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJydXNoZW5kICgpe1xuXHRpZighdGhpcy5icnVzaENocikgcmV0dXJuO1xuXHRsZXQgY2MgPSB0aGlzLmFwcC5jb29yZHM7XG5cdHZhciB4dG50ID0gdGhpcy5icnVzaENoci5icnVzaC5leHRlbnQoKTtcblx0aWYgKE1hdGguYWJzKHh0bnRbMF0gLSB4dG50WzFdKSA8PSAxMCl7XG5cdCAgICAvLyB1c2VyIGNsaWNrZWRcblx0ICAgIGxldCB3ID0gY2MuZW5kIC0gY2Muc3RhcnQgKyAxO1xuXHQgICAgeHRudFswXSAtPSB3LzI7XG5cdCAgICB4dG50WzFdICs9IHcvMjtcblx0fVxuXHRsZXQgY29vcmRzID0geyBjaHI6dGhpcy5icnVzaENoci5uYW1lLCBzdGFydDpNYXRoLmZsb29yKHh0bnRbMF0pLCBlbmQ6IE1hdGguZmxvb3IoeHRudFsxXSkgfTtcblx0dGhpcy5hcHAuc2V0Q29udGV4dChjb29yZHMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQnJ1c2hlcyAoZXhjZXB0KXtcblx0dGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKCdbbmFtZT1cImJydXNoXCJdJykuZWFjaChmdW5jdGlvbihjaHIpe1xuXHQgICAgaWYgKGNoci5icnVzaCAhPT0gZXhjZXB0KSB7XG5cdFx0Y2hyLmJydXNoLmNsZWFyKCk7XG5cdFx0Y2hyLmJydXNoKGQzLnNlbGVjdCh0aGlzKSk7XG5cdCAgICB9XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldFggKGNocikge1xuXHRsZXQgeCA9IHRoaXMuYXBwLnJHZW5vbWUueHNjYWxlKGNocik7XG5cdGlmIChpc05hTih4KSkgdGhyb3cgXCJ4IGlzIE5hTlwiXG5cdHJldHVybiB4O1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRZIChwb3MpIHtcblx0bGV0IHkgPSB0aGlzLmFwcC5yR2Vub21lLnlzY2FsZShwb3MpO1xuXHRpZiAoaXNOYU4oeSkpIHRocm93IFwieSBpcyBOYU5cIlxuXHRyZXR1cm4geTtcbiAgICB9XG4gICAgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVkcmF3ICgpIHtcbiAgICAgICAgdGhpcy5kcmF3KHRoaXMuY3VyclRpY2tzLCB0aGlzLmN1cnJCbG9ja3MpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRyYXcgKHRpY2tEYXRhLCBibG9ja0RhdGEpIHtcblx0dGhpcy5kcmF3Q2hyb21vc29tZXMoKTtcblx0dGhpcy5kcmF3QmxvY2tzKGJsb2NrRGF0YSk7XG5cdHRoaXMuZHJhd1RpY2tzKHRpY2tEYXRhKTtcblx0dGhpcy5kcmF3VGl0bGUoKTtcblx0dGhpcy5zZXRCcnVzaENvb3Jkcyh0aGlzLmFwcC5jb29yZHMpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSBjaHJvbW9zb21lcyBvZiB0aGUgcmVmZXJlbmNlIGdlbm9tZS5cbiAgICAvLyBJbmNsdWRlcyBiYWNrYm9uZXMsIGxhYmVscywgYW5kIGJydXNoZXMuXG4gICAgLy8gVGhlIGJhY2tib25lcyBhcmUgZHJhd24gYXMgdmVydGljYWwgbGluZSBzZW1lbnRzLFxuICAgIC8vIGRpc3RyaWJ1dGVkIGhvcml6b250YWxseS4gT3JkZXJpbmcgaXMgZGVmaW5lZCBieVxuICAgIC8vIHRoZSBtb2RlbCAoR2Vub21lIG9iamVjdCkuXG4gICAgLy8gTGFiZWxzIGFyZSBkcmF3biBhYm92ZSB0aGUgYmFja2JvbmVzLlxuICAgIC8vXG4gICAgLy8gTW9kaWZpY2F0aW9uOlxuICAgIC8vIERyYXdzIHRoZSBzY2VuZSBpbiBvbmUgb2YgdHdvIHN0YXRlczogb3BlbiBvciBjbG9zZWQuXG4gICAgLy8gVGhlIG9wZW4gc3RhdGUgaXMgYXMgZGVzY3JpYmVkIC0gYWxsIGNocm9tb3NvbWVzIHNob3duLlxuICAgIC8vIEluIHRoZSBjbG9zZWQgc3RhdGU6IFxuICAgIC8vICAgICAqIG9ubHkgb25lIGNocm9tb3NvbWUgc2hvd3MgKHRoZSBjdXJyZW50IG9uZSlcbiAgICAvLyAgICAgKiBkcmF3biBob3Jpem9udGFsbHkgYW5kIHBvc2l0aW9uZWQgYmVzaWRlIHRoZSBcIkdlbm9tZSBWaWV3XCIgdGl0bGVcbiAgICAvL1xuICAgIGRyYXdDaHJvbW9zb21lcyAoKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblxuXHRsZXQgcmcgPSB0aGlzLmFwcC5yR2Vub21lOyAvLyByZWYgZ2Vub21lXG5cdGxldCByQ2hycyA9IHJnLmNocm9tb3NvbWVzO1xuXG4gICAgICAgIC8vIENocm9tb3NvbWUgZ3JvdXBzXG5cdGxldCBjaHJzID0gdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKFwiLmNocm9tb3NvbWVcIilcblx0ICAgIC5kYXRhKHJDaHJzLCBjID0+IGMubmFtZSk7XG5cdGxldCBuZXdjaHJzID0gY2hycy5lbnRlcigpLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjaHJvbW9zb21lXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgYyA9PiBjLm5hbWUpO1xuXHRcblx0bmV3Y2hycy5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJuYW1lXCIsXCJsYWJlbFwiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJsaW5lXCIpLmF0dHIoXCJuYW1lXCIsXCJiYWNrYm9uZVwiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJzeW5CbG9ja3NcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwidGlja3NcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwiYnJ1c2hcIik7XG5cblxuXHRsZXQgY2xvc2VkID0gdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIik7XG5cdGlmIChjbG9zZWQpIHtcblx0ICAgIC8vIFJlc2V0IHRoZSBTVkcgc2l6ZSB0byBiZSAxLWNocm9tb3NvbWUgd2lkZS5cblx0ICAgIC8vIFRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAgc28gdGhhdCB0aGUgY3VycmVudCBjaHJvbW9zb21lIGFwcGVhcnMgaW4gdGhlIHN2ZyBhcmVhLlxuXHQgICAgLy8gVHVybiBpdCA5MCBkZWcuXG5cblx0ICAgIC8vIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBTVkcgYXJlYSB0byAxIGNocm9tb3NvbWUncyB3aWR0aFxuXHQgICAgdGhpcy5zZXRHZW9tKHsgaGVpZ2h0OiB0aGlzLnRvdGFsQ2hyV2lkdGgsIHJvdGF0aW9uOiAtOTAsIHRyYW5zbGF0aW9uOiBbLXRoaXMudG90YWxDaHJXaWR0aC8yLDMwXSB9KTtcblx0ICAgIC8vIFxuXHQgICAgbGV0IGRlbHRhID0gMTA7XG5cdCAgICByZy54c2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcblx0XHQgLmRvbWFpbihyQ2hycy5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHgubmFtZTt9KSlcblx0XHQgLy8gaW4gY2xvc2VkIG1vZGUsIHRoZSBjaHJvbW9zb21lcyBoYXZlIGZpeGVkIHNwYWNpbmdcblx0XHQgLnJhbmdlUG9pbnRzKFtkZWx0YSwgZGVsdGErdGhpcy50b3RhbENocldpZHRoKihyQ2hycy5sZW5ndGgtMSldKTtcblx0ICAgIC8vXG5cdCAgICByZy55c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdCAuZG9tYWluKFsxLHJnLm1heGxlbl0pXG5cdFx0IC5yYW5nZShbMCwgdGhpcy53aWR0aF0pO1xuXG5cdCAgICAvLyB0cmFuc2xhdGUgZWFjaCBjaHJvbW9zb21lIGludG8gcG9zaXRpb25cblx0ICAgIGNocnMuYXR0cihcInRyYW5zZm9ybVwiLCBjID0+IGB0cmFuc2xhdGUoJHtyZy54c2NhbGUoYy5uYW1lKX0sIDApYCk7XG4gICAgICAgICAgICAvLyB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKC1yZy54c2NhbGUodGhpcy5hcHAuY29vcmRzLmNocikpO1xuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIC8vIFdoZW4gb3BlbiwgZHJhdyBhbGwgdGhlIGNocm9tb3NvbWVzLiBFYWNoIGNocm9tIGlzIGEgdmVydGljYWwgbGluZS5cblx0ICAgIC8vIENocm9tcyBhcmUgZGlzdHJpYnV0ZWQgZXZlbmx5IGFjcm9zcyB0aGUgYXZhaWxhYmxlIGhvcml6b250YWwgc3BhY2UuXG5cdCAgICB0aGlzLnNldEdlb20oeyB3aWR0aDogdGhpcy5vcGVuV2lkdGgsIGhlaWdodDogdGhpcy5vcGVuSGVpZ2h0LCByb3RhdGlvbjogMCwgdHJhbnNsYXRpb246IFswLDBdIH0pO1xuXHQgICAgLy8gXG5cdCAgICByZy54c2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcblx0XHQgLmRvbWFpbihyQ2hycy5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHgubmFtZTt9KSlcblx0XHQgLy8gaW4gY2xvc2VkIG1vZGUsIHRoZSBjaHJvbW9zb21lcyBzcHJlYWQgdG8gZmlsbCB0aGUgc3BhY2Vcblx0XHQgLnJhbmdlUG9pbnRzKFswLCB0aGlzLm9wZW5XaWR0aCAtIDMwXSwgMC41KTtcblx0ICAgIHJnLnlzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0IC5kb21haW4oWzEscmcubWF4bGVuXSlcblx0XHQgLnJhbmdlKFswLCB0aGlzLmhlaWdodF0pO1xuXG5cdCAgICAvLyB0cmFuc2xhdGUgZWFjaCBjaHJvbW9zb21lIGludG8gcG9zaXRpb25cblx0ICAgIGNocnMuYXR0cihcInRyYW5zZm9ybVwiLCBjID0+IGB0cmFuc2xhdGUoJHtyZy54c2NhbGUoYy5uYW1lKX0sIDApYCk7XG4gICAgICAgICAgICAvLyB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKDApO1xuXHR9XG5cblx0ckNocnMuZm9yRWFjaChjaHIgPT4ge1xuXHQgICAgdmFyIHNjID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQuZG9tYWluKFsxLGNoci5sZW5ndGhdKVxuXHRcdC5yYW5nZShbMCwgcmcueXNjYWxlKGNoci5sZW5ndGgpXSk7XG5cdCAgICBjaHIuYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKS55KHNjKVxuXHQgICAgICAgLm9uKFwiYnJ1c2hzdGFydFwiLCBjaHIgPT4gdGhpcy5icnVzaHN0YXJ0KGNocikpXG5cdCAgICAgICAub24oXCJicnVzaGVuZFwiLCAoKSA9PiB0aGlzLmJydXNoZW5kKCkpO1xuXHQgIH0sIHRoaXMpO1xuXG5cbiAgICAgICAgY2hycy5zZWxlY3QoJ1tuYW1lPVwibGFiZWxcIl0nKVxuXHQgICAgLnRleHQoYz0+Yy5uYW1lKVxuXHQgICAgLmF0dHIoXCJ4XCIsIDApIFxuXHQgICAgLmF0dHIoXCJ5XCIsIC0yKVxuXHQgICAgO1xuXG5cdGNocnMuc2VsZWN0KCdbbmFtZT1cImJhY2tib25lXCJdJylcblx0ICAgIC5hdHRyKFwieDFcIiwgMClcblx0ICAgIC5hdHRyKFwieTFcIiwgMClcblx0ICAgIC5hdHRyKFwieDJcIiwgMClcblx0ICAgIC5hdHRyKFwieTJcIiwgYyA9PiByZy55c2NhbGUoYy5sZW5ndGgpKVxuXHQgICAgO1xuXHQgICBcblx0Y2hycy5zZWxlY3QoJ1tuYW1lPVwiYnJ1c2hcIl0nKVxuXHQgICAgLmVhY2goZnVuY3Rpb24oZCl7ZDMuc2VsZWN0KHRoaXMpLmNhbGwoZC5icnVzaCk7fSlcblx0ICAgIC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHQgICAgIC5hdHRyKCd3aWR0aCcsMTYpXG5cdCAgICAgLmF0dHIoJ3gnLCAtOClcblx0ICAgIDtcblxuXHRjaHJzLmV4aXQoKS5yZW1vdmUoKTtcblx0XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2Nyb2xsIHdoZWVsIGV2ZW50IGhhbmRsZXIuXG4gICAgc2Nyb2xsV2hlZWwgKGR5KSB7XG5cdC8vIEFkZCBkeSB0byB0b3RhbCBzY3JvbGwgYW1vdW50LiBUaGVuIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNCeShkeSk7XG5cdC8vIEFmdGVyIGEgMjAwIG1zIHBhdXNlIGluIHNjcm9sbGluZywgc25hcCB0byBuZWFyZXN0IGNocm9tb3NvbWVcblx0dGhpcy50b3V0ICYmIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50b3V0KTtcblx0dGhpcy50b3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCk9PnRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCksIDIwMCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzVG8gKHgpIHtcbiAgICAgICAgaWYgKHggPT09IHVuZGVmaW5lZCkgeCA9IHRoaXMuc2Nyb2xsQW1vdW50O1xuXHR0aGlzLnNjcm9sbEFtb3VudCA9IE1hdGgubWF4KE1hdGgubWluKHgsMTUpLCAtdGhpcy50b3RhbENocldpZHRoICogKHRoaXMuYXBwLnJHZW5vbWUuY2hyb21vc29tZXMubGVuZ3RoLTEpKTtcblx0dGhpcy5nQ2hyb21vc29tZXMuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7dGhpcy5zY3JvbGxBbW91bnR9LDApYCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzQnkgKGR4KSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbyh0aGlzLnNjcm9sbEFtb3VudCArIGR4KTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNTbmFwICgpIHtcblx0bGV0IGkgPSBNYXRoLnJvdW5kKHRoaXMuc2Nyb2xsQW1vdW50IC8gdGhpcy50b3RhbENocldpZHRoKVxuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oaSp0aGlzLnRvdGFsQ2hyV2lkdGgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc1VwICgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc0J5KC10aGlzLnRvdGFsQ2hyV2lkdGgpO1xuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc0Rvd24gKCkge1xuICAgICAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzQnkodGhpcy50b3RhbENocldpZHRoKTtcblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZHJhd1RpdGxlICgpIHtcblx0bGV0IHJlZmcgPSB0aGlzLmFwcC5yR2Vub21lLmxhYmVsO1xuXHRsZXQgYmxvY2tnID0gdGhpcy5jdXJyQmxvY2tzID8gXG5cdCAgICB0aGlzLmN1cnJCbG9ja3MuY29tcCAhPT0gdGhpcy5hcHAuckdlbm9tZSA/XG5cdCAgICAgICAgdGhpcy5jdXJyQmxvY2tzLmNvbXAubGFiZWxcblx0XHQ6XG5cdFx0bnVsbFxuXHQgICAgOlxuXHQgICAgbnVsbDtcblx0bGV0IGxzdCA9IHRoaXMuYXBwLmN1cnJMaXN0ID8gdGhpcy5hcHAuY3Vyckxpc3QubmFtZSA6IG51bGw7XG5cblx0dGhpcy5yb290LnNlbGVjdChcImxhYmVsIHNwYW4udGl0bGVcIikudGV4dChyZWZnKTtcblxuXHRsZXQgbGluZXMgPSBbXTtcblx0YmxvY2tnICYmIGxpbmVzLnB1c2goYEJsb2NrcyB2cy4gJHtibG9ja2d9YCk7XG5cdGxzdCAmJiBsaW5lcy5wdXNoKGBGZWF0dXJlcyBmcm9tIGxpc3QgXCIke2xzdH1cImApO1xuXHRsZXQgc3VidCA9IGxpbmVzLmpvaW4oXCIgOjogXCIpO1xuXHR0aGlzLnJvb3Quc2VsZWN0KFwibGFiZWwgc3Bhbi5zdWJ0aXRsZVwiKS50ZXh0KChzdWJ0ID8gXCI6OiBcIiA6IFwiXCIpICsgc3VidCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIG91dGxpbmVzIG9mIHN5bnRlbnkgYmxvY2tzIG9mIHRoZSByZWYgZ2Vub21lIHZzLlxuICAgIC8vIHRoZSBnaXZlbiBnZW5vbWUuXG4gICAgLy8gUGFzc2luZyBudWxsIGVyYXNlcyBhbGwgc3ludGVueSBibG9ja3MuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBkYXRhID09IHsgcmVmOkdlbm9tZSwgY29tcDpHZW5vbWUsIGJsb2NrczogbGlzdCBvZiBzeW50ZW55IGJsb2NrcyB9XG4gICAgLy8gICAgRWFjaCBzYmxvY2sgPT09IHsgYmxvY2tJZDppbnQsIG9yaTorLy0sIGZyb21DaHIsIGZyb21TdGFydCwgZnJvbUVuZCwgdG9DaHIsIHRvU3RhcnQsIHRvRW5kIH1cbiAgICBkcmF3QmxvY2tzIChkYXRhKSB7XG5cdC8vXG4gICAgICAgIGxldCBzYmdycHMgPSB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoXCIuY2hyb21vc29tZVwiKS5zZWxlY3QoJ1tuYW1lPVwic3luQmxvY2tzXCJdJyk7XG5cdGlmICghZGF0YSB8fCAhZGF0YS5ibG9ja3MgfHwgZGF0YS5ibG9ja3MubGVuZ3RoID09PSAwKSB7XG5cdCAgICB0aGlzLmN1cnJCbG9ja3MgPSBudWxsO1xuXHQgICAgc2JncnBzLmh0bWwoJycpO1xuXHQgICAgdGhpcy5kcmF3VGl0bGUoKTtcblx0ICAgIHJldHVybjtcblx0fVxuXHR0aGlzLmN1cnJCbG9ja3MgPSBkYXRhO1xuXHQvLyByZW9yZ2FuaXplIGRhdGEgdG8gcmVmbGVjdCBTVkcgc3RydWN0dXJlIHdlIHdhbnQsIGllLCBncm91cGVkIGJ5IGNocm9tb3NvbWVcbiAgICAgICAgbGV0IGR4ID0gZGF0YS5ibG9ja3MucmVkdWNlKChhLHNiKSA9PiB7XG5cdFx0aWYgKCFhW3NiLmZyb21DaHJdKSBhW3NiLmZyb21DaHJdID0gW107XG5cdFx0YVtzYi5mcm9tQ2hyXS5wdXNoKHNiKTtcblx0XHRyZXR1cm4gYTtcblx0ICAgIH0sIHt9KTtcblx0c2JncnBzLmVhY2goZnVuY3Rpb24oYyl7XG5cdCAgICBkMy5zZWxlY3QodGhpcykuZGF0dW0oe2NocjogYy5uYW1lLCBibG9ja3M6IGR4W2MubmFtZV0gfHwgW10gfSk7XG5cdH0pO1xuXG5cdGxldCBid2lkdGggPSAxMDtcbiAgICAgICAgbGV0IHNibG9ja3MgPSBzYmdycHMuc2VsZWN0QWxsKCdyZWN0LnNibG9jaycpLmRhdGEoYj0+Yi5ibG9ja3MpO1xuICAgICAgICBsZXQgbmV3YnMgPSBzYmxvY2tzLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuYXR0cignY2xhc3MnLCdzYmxvY2snKTtcblx0c2Jsb2Nrc1xuXHQgICAgLmF0dHIoXCJ4XCIsIC1id2lkdGgvMiApXG5cdCAgICAuYXR0cihcInlcIiwgYiA9PiB0aGlzLmdldFkoYi5mcm9tU3RhcnQpKVxuXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCBid2lkdGgpXG5cdCAgICAuYXR0cihcImhlaWdodFwiLCBiID0+IE1hdGgubWF4KDAsdGhpcy5nZXRZKGIuZnJvbUVuZCAtIGIuZnJvbVN0YXJ0ICsgMSkpKVxuXHQgICAgLmNsYXNzZWQoXCJpbnZlcnNpb25cIiwgYiA9PiBiLm9yaSA9PT0gXCItXCIpXG5cdCAgICAuY2xhc3NlZChcInRyYW5zbG9jYXRpb25cIiwgYiA9PiBiLmZyb21DaHIgIT09IGIudG9DaHIpXG5cdCAgICA7XG5cbiAgICAgICAgc2Jsb2Nrcy5leGl0KCkucmVtb3ZlKCk7XG5cblx0dGhpcy5kcmF3VGl0bGUoKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3VGlja3MgKGlkcykge1xuXHR0aGlzLmN1cnJUaWNrcyA9IGlkcyB8fCBbXTtcblx0dGhpcy5hcHAuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXNCeUlkKHRoaXMuYXBwLnJHZW5vbWUsIHRoaXMuY3VyclRpY2tzKVxuXHQgICAgLnRoZW4oIGZlYXRzID0+IHsgdGhpcy5fZHJhd1RpY2tzKGZlYXRzKTsgfSk7XG4gICAgfVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIF9kcmF3VGlja3MgKGZlYXR1cmVzKSB7XG5cdGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7IC8vIHJlZiBnZW5vbWVcblx0Ly8gZmVhdHVyZSB0aWNrIG1hcmtzXG5cdGlmICghZmVhdHVyZXMgfHwgZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XG5cdCAgICB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoJ1tuYW1lPVwidGlja3NcIl0nKS5zZWxlY3RBbGwoXCIuZmVhdHVyZVwiKS5yZW1vdmUoKTtcblx0ICAgIHJldHVybjtcblx0fVxuXG5cdC8vXG5cdGxldCB0R3JwcyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpLnNlbGVjdCgnW25hbWU9XCJ0aWNrc1wiXScpO1xuXG5cdC8vIGdyb3VwIGZlYXR1cmVzIGJ5IGNocm9tb3NvbWVcbiAgICAgICAgbGV0IGZpeCA9IGZlYXR1cmVzLnJlZHVjZSgoYSxmKSA9PiB7IFxuXHQgICAgaWYgKCEgYVtmLmNocl0pIGFbZi5jaHJdID0gW107XG5cdCAgICBhW2YuY2hyXS5wdXNoKGYpO1xuXHQgICAgcmV0dXJuIGE7XG5cdH0sIHt9KVxuXHR0R3Jwcy5lYWNoKGZ1bmN0aW9uKGMpIHtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5kYXR1bSggeyBjaHI6IGMsIGZlYXR1cmVzOiBmaXhbYy5uYW1lXSAgfHwgW119ICk7XG5cdH0pO1xuXG5cdC8vIHRoZSB0aWNrIGVsZW1lbnRzXG4gICAgICAgIGxldCBmZWF0cyA9IHRHcnBzLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpXG5cdCAgICAuZGF0YShkID0+IGQuZmVhdHVyZXMsIGQgPT4gZC5tZ3BpZCk7XG5cdC8vXG5cdGxldCB4QWRqID0gZiA9PiAoZi5zdHJhbmQgPT09IFwiK1wiID8gdGhpcy50aWNrTGVuZ3RoIDogLXRoaXMudGlja0xlbmd0aCk7XG5cdC8vXG5cdGxldCBzaGFwZSA9IFwiY2lyY2xlXCI7ICAvLyBcImNpcmNsZVwiIG9yIFwibGluZVwiXG5cdC8vXG5cdGxldCBuZXdmcyA9IGZlYXRzLmVudGVyKClcblx0ICAgIC5hcHBlbmQoc2hhcGUpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJmZWF0dXJlXCIpXG5cdCAgICAub24oJ2NsaWNrJywgKGYpID0+IHtcblx0XHRsZXQgaSA9IGYuY2Fub25pY2FsfHxmLklEO1xuXHQgICAgICAgIHRoaXMuYXBwLnNldENvbnRleHQoe2xhbmRtYXJrOmksIGhpZ2hsaWdodDpbaV19KTtcblx0ICAgIH0pIDtcblx0bmV3ZnMuYXBwZW5kKFwidGl0bGVcIilcblx0XHQudGV4dChmPT5mLnN5bWJvbCB8fCBmLmlkKTtcblx0aWYgKHNoYXBlID09PSBcImxpbmVcIikge1xuXHQgICAgZmVhdHMuYXR0cihcIngxXCIsIGYgPT4geEFkaihmKSArIDUpXG5cdCAgICBmZWF0cy5hdHRyKFwieTFcIiwgZiA9PiByZy55c2NhbGUoZi5zdGFydCkpXG5cdCAgICBmZWF0cy5hdHRyKFwieDJcIiwgZiA9PiB4QWRqKGYpICsgdGhpcy50aWNrTGVuZ3RoICsgNSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ5MlwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0fVxuXHRlbHNlIHtcblx0ICAgIGZlYXRzLmF0dHIoXCJjeFwiLCBmID0+IHhBZGooZikpXG5cdCAgICBmZWF0cy5hdHRyKFwiY3lcIiwgZiA9PiByZy55c2NhbGUoZi5zdGFydCkpXG5cdCAgICBmZWF0cy5hdHRyKFwiclwiLCAgdGhpcy50aWNrTGVuZ3RoIC8gMik7XG5cdH1cblx0Ly9cblx0ZmVhdHMuZXhpdCgpLnJlbW92ZSgpXG4gICAgfVxufSAvLyBlbmQgY2xhc3MgR2Vub21lVmlld1xuXG5leHBvcnQgeyBHZW5vbWVWaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9HZW5vbWVWaWV3LmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5cbmNsYXNzIEZlYXR1cmVEZXRhaWxzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLmluaXREb20gKCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdERvbSAoKSB7XG5cdC8vXG5cdHRoaXMucm9vdC5zZWxlY3QgKFwiLmJ1dHRvbi5jbG9zZVwiKVxuXHQgICAgLm9uKFwiY2xpY2suZXh0cmFcIiwgKCkgPT4gdGhpcy51cGRhdGUoKSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy9cbiAgICB1cGRhdGUoZikge1xuXHQvLyBpZiBjYWxsZWQgd2l0aCBubyBhcmdzLCB1cGRhdGUgdXNpbmcgdGhlIHByZXZpb3VzIGZlYXR1cmVcblx0ZiA9IGYgfHwgdGhpcy5sYXN0RmVhdHVyZTtcblx0aWYgKCFmKSB7XG5cdCAgIC8vIEZJWE1FOiBtYWpvciByZWFjaG92ZXIgaW4gdGhpcyBzZWN0aW9uXG5cdCAgIC8vXG5cdCAgIC8vIGZhbGxiYWNrLiB0YWtlIHRoZSBmaXJzdCBoaWdobGlnaHRlZC5cblx0ICAgbGV0IHIgPSB0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcInJlY3QuZmVhdHVyZS5oaWdobGlnaHRcIilbMF1bMF07XG5cdCAgIC8vIGZhbGxiYWNrLiB0YWtlIHRoZSBmaXJzdCBmZWF0dXJlXG5cdCAgIGlmICghcikgciA9IHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwicmVjdC5mZWF0dXJlXCIpWzBdWzBdO1xuXHQgICBpZiAocikgZiA9IHIuX19kYXRhX187XG5cdH1cblx0Ly8gcmVtZW1iZXJcbiAgICAgICAgaWYgKCFmKSB0aHJvdyBcIkNhbm5vdCB1cGRhdGUgZmVhdHVyZSBkZXRhaWxzLiBObyBmZWF0dXJlLlwiO1xuXHR0aGlzLmxhc3RGZWF0dXJlID0gZjtcblxuXHQvLyBsaXN0IG9mIGZlYXR1cmVzIHRvIHNob3cgaW4gZGV0YWlscyBhcmVhLlxuXHQvLyB0aGUgZ2l2ZW4gZmVhdHVyZSBhbmQgYWxsIGVxdWl2YWxlbnRzIGluIG90aGVyIGdlbm9tZXMuXG5cdGxldCBmbGlzdCA9IFtmXTtcblx0aWYgKGYubWdpaWQpIHtcblx0ICAgIC8vIEZJWE1FOiByZWFjaG92ZXJcblx0ICAgIGZsaXN0ID0gdGhpcy5hcHAuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkKGYubWdpaWQpO1xuXHR9XG5cdC8vIEdvdCB0aGUgbGlzdC4gTm93IG9yZGVyIGl0IHRoZSBzYW1lIGFzIHRoZSBkaXNwbGF5ZWQgZ2Vub21lc1xuXHQvLyBidWlsZCBpbmRleCBvZiBnZW5vbWUgbmFtZSAtPiBmZWF0dXJlIGluIGZsaXN0XG5cdGxldCBpeCA9IGZsaXN0LnJlZHVjZSgoYWNjLGYpID0+IHsgYWNjW2YuZ2Vub21lLm5hbWVdID0gZjsgcmV0dXJuIGFjYzsgfSwge30pXG5cdGxldCBnZW5vbWVPcmRlciA9IChbdGhpcy5hcHAuckdlbm9tZV0uY29uY2F0KHRoaXMuYXBwLmNHZW5vbWVzKSk7XG5cdGZsaXN0ID0gZ2Vub21lT3JkZXIubWFwKGcgPT4gaXhbZy5uYW1lXSB8fCBudWxsKTtcblx0Ly9cblx0bGV0IGNvbEhlYWRlcnMgPSBbXG5cdCAgICAvLyBjb2x1bW5zIGhlYWRlcnMgYW5kIHRoZWlyICUgd2lkdGhzXG5cdCAgICBbXCJNR0kgaWRcIiAgICAgLDEwXSxcblx0ICAgIFtcIk1HSSBzeW1ib2xcIiAsMTBdLFxuXHQgICAgW1wiR2Vub21lXCIgICAgICw5XSxcblx0ICAgIFtcIk1HUCBpZFwiICAgICAsMTddLFxuXHQgICAgW1wiVHlwZVwiICAgICAgICwxMC41XSxcblx0ICAgIFtcIkJpb1R5cGVcIiAgICAsMTguNV0sXG5cdCAgICBbXCJDb29yZGluYXRlc1wiLDE4XSxcblx0ICAgIFtcIkxlbmd0aFwiICAgICAsN11cblx0XTtcblx0Ly8gSW4gdGhlIGNsb3NlZCBzdGF0ZSwgb25seSBzaG93IHRoZSBoZWFkZXIgYW5kIHRoZSByb3cgZm9yIHRoZSBwYXNzZWQgZmVhdHVyZVxuXHRpZiAodGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgZmxpc3QgPSBmbGlzdC5maWx0ZXIoIChmZiwgaSkgPT4gZmYgPT09IGYgKTtcblx0Ly8gRHJhdyB0aGUgdGFibGVcblx0bGV0IHQgPSB0aGlzLnJvb3Quc2VsZWN0KCd0YWJsZScpO1xuXHRsZXQgcm93cyA9IHQuc2VsZWN0QWxsKCd0cicpLmRhdGEoIFtjb2xIZWFkZXJzXS5jb25jYXQoZmxpc3QpICk7XG5cdHJvd3MuZW50ZXIoKS5hcHBlbmQoJ3RyJylcblx0ICAub24oXCJtb3VzZWVudGVyXCIsIChmLGkpID0+IGkgIT09IDAgJiYgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KGYsIHRydWUpKVxuXHQgIC5vbihcIm1vdXNlbGVhdmVcIiwgKGYsaSkgPT4gaSAhPT0gMCAmJiB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoKSk7XG5cdCAgICAgIFxuXHRyb3dzLmV4aXQoKS5yZW1vdmUoKTtcblx0cm93cy5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIChmZiwgaSkgPT4gKGkgIT09IDAgJiYgZmYgPT09IGYpKTtcblx0Ly9cblx0Ly8gR2l2ZW4gYSBmZWF0dXJlLCByZXR1cm5zIGEgbGlzdCBvZiBzdHJpbmdzIGZvciBwb3B1bGF0aW5nIGEgdGFibGUgcm93LlxuXHQvLyBJZiBpPT09MCwgdGhlbiBmIGlzIG5vdCBhIGZlYXR1cmUsIGJ1dCBhIGxpc3QgY29sdW1ucyBuYW1lcyt3aWR0aHMuXG5cdC8vIFxuXHRsZXQgY2VsbERhdGEgPSBmdW5jdGlvbiAoZiwgaSkge1xuXHQgICAgaWYgKGkgPT09IDApIHtcblx0XHRyZXR1cm4gZjtcblx0ICAgIH1cblx0ICAgIGxldCBjZWxsRGF0YSA9IFsgXCIuXCIsIFwiLlwiLCBnZW5vbWVPcmRlcltpLTFdLmxhYmVsLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiwgXCIuXCIgXTtcblx0ICAgIC8vIGYgaXMgbnVsbCBpZiBpdCBkb2Vzbid0IGV4aXN0IGZvciBnZW5vbWUgaSBcblx0ICAgIGlmIChmKSB7XG5cdFx0bGV0IGxpbmsgPSBcIlwiO1xuXHRcdGxldCBtZ2lpZCA9IGYubWdpaWQgfHwgXCJcIjtcblx0XHRpZiAobWdpaWQpIHtcblx0XHQgICAgbGV0IHVybCA9IGBodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvYWNjZXNzaW9uLyR7bWdpaWR9YDtcblx0XHQgICAgbGluayA9IGA8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHt1cmx9XCI+JHttZ2lpZH08L2E+YDtcblx0XHR9XG5cdFx0Y2VsbERhdGEgPSBbXG5cdFx0ICAgIGxpbmsgfHwgbWdpaWQsXG5cdFx0ICAgIGYuc3ltYm9sLFxuXHRcdCAgICBmLmdlbm9tZS5sYWJlbCxcblx0XHQgICAgZi5tZ3BpZCxcblx0XHQgICAgZi50eXBlLFxuXHRcdCAgICBmLmJpb3R5cGUsXG5cdFx0ICAgIGAke2YuY2hyfToke2Yuc3RhcnR9Li4ke2YuZW5kfSAoJHtmLnN0cmFuZH0pYCxcblx0XHQgICAgYCR7Zi5lbmQgLSBmLnN0YXJ0ICsgMX0gYnBgXG5cdFx0XTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBjZWxsRGF0YTtcblx0fTtcblx0bGV0IGNlbGxzID0gcm93cy5zZWxlY3RBbGwoXCJ0ZFwiKVxuXHQgICAgLmRhdGEoKGYsaSkgPT4gY2VsbERhdGEoZixpKSk7XG5cdGNlbGxzLmVudGVyKCkuYXBwZW5kKFwidGRcIik7XG5cdGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcblx0Y2VsbHMuaHRtbCgoZCxpLGopID0+IHtcblx0ICAgIHJldHVybiBqID09PSAwID8gZFswXSA6IGRcblx0fSlcblx0LnN0eWxlKFwid2lkdGhcIiwgKGQsaSxqKSA9PiBqID09PSAwID8gYCR7ZFsxXX0lYCA6IG51bGwpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgRmVhdHVyZURldGFpbHMgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTVkdWaWV3IH0gZnJvbSAnLi9TVkdWaWV3JztcbmltcG9ydCB7IEZlYXR1cmUgfSBmcm9tICcuL0ZlYXR1cmUnO1xuaW1wb3J0IHsgY2xpcCwgcGFyc2VDb29yZHMsIGZvcm1hdENvb3JkcywgY29vcmRzQWZ0ZXJUcmFuc2Zvcm0sIHJlbW92ZUR1cHMgfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBab29tVmlldyBleHRlbmRzIFNWR1ZpZXcge1xuICAgIC8vXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0LCBpbml0aWFsQ29vcmRzLCBpbml0aWFsSGkpIHtcbiAgICAgIHN1cGVyKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIC8vXG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAvL1xuICAgICAgdGhpcy5taW5TdmdIZWlnaHQgPSAyNTA7XG4gICAgICB0aGlzLmJsb2NrSGVpZ2h0ID0gNDA7XG4gICAgICB0aGlzLnRvcE9mZnNldCA9IDQ1O1xuICAgICAgdGhpcy5mZWF0SGVpZ2h0ID0gNjtcdC8vIGhlaWdodCBvZiBhIHJlY3RhbmdsZSByZXByZXNlbnRpbmcgYSBmZWF0dXJlXG4gICAgICB0aGlzLmxhbmVHYXAgPSAyO1x0ICAgICAgICAvLyBzcGFjZSBiZXR3ZWVuIHN3aW0gbGFuZXNcbiAgICAgIHRoaXMubGFuZUhlaWdodCA9IHRoaXMuZmVhdEhlaWdodCArIHRoaXMubGFuZUdhcDtcbiAgICAgIHRoaXMuc3RyaXBIZWlnaHQgPSA3MDsgICAgLy8gaGVpZ2h0IHBlciBnZW5vbWUgaW4gdGhlIHpvb20gdmlld1xuICAgICAgdGhpcy5zdHJpcEdhcCA9IDIwO1x0Ly8gc3BhY2UgYmV0d2VlbiBzdHJpcHNcbiAgICAgIHRoaXMubWF4U0JnYXAgPSAyMDtcdC8vIG1heCBnYXAgYWxsb3dlZCBiZXR3ZWVuIGJsb2Nrcy5cbiAgICAgIHRoaXMuZG1vZGUgPSAnY29tcGFyaXNvbic7Ly8gZHJhd2luZyBtb2RlLiAnY29tcGFyaXNvbicgb3IgJ3JlZmVyZW5jZSdcblxuICAgICAgLy9cbiAgICAgIC8vIElEcyBvZiBGZWF0dXJlcyB3ZSdyZSBoaWdobGlnaHRpbmcuIE1heSBiZSBtZ3BpZCAgb3IgbWdpSWRcbiAgICAgIC8vIGhpRmVhdHMgaXMgYW4gb2JqIHdob3NlIGtleXMgYXJlIHRoZSBJRHNcbiAgICAgIHRoaXMuaGlGZWF0cyA9IChpbml0aWFsSGkgfHwgW10pLnJlZHVjZSggKGEsdikgPT4geyBhW3ZdPXY7IHJldHVybiBhOyB9LCB7fSApO1xuICAgICAgLy9cbiAgICAgIHRoaXMuZmlkdWNpYWxzID0gdGhpcy5zdmcuaW5zZXJ0KFwiZ1wiLFwiOmZpcnN0LWNoaWxkXCIpIC8vIFxuICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJmaWR1Y2lhbHNcIik7XG4gICAgICB0aGlzLnN0cmlwc0dycCA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIixcInN0cmlwc1wiKTtcbiAgICAgIHRoaXMuYXhpcyA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIixcImF4aXNcIik7XG4gICAgICB0aGlzLmN4dE1lbnUgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImN4dE1lbnVcIl0nKTtcbiAgICAgIC8vXG4gICAgICB0aGlzLmRyYWdnaW5nID0gbnVsbDtcbiAgICAgIHRoaXMuZHJhZ2dlciA9IHRoaXMuZ2V0RHJhZ2dlcigpO1xuICAgICAgLy9cbiAgICAgIHRoaXMuaW5pdERvbSgpO1xuICAgIH1cbiAgICAvL1xuICAgIGluaXREb20gKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCByID0gdGhpcy5yb290O1xuXHRsZXQgYSA9IHRoaXMuYXBwO1xuXHQvL1xuXHRyLnNlbGVjdCgnLmJ1dHRvbi5jbG9zZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4gdGhpcy51cGRhdGUoKSk7XG5cblx0Ly8gem9vbSBjb250cm9sc1xuXHRyLnNlbGVjdChcIiN6b29tT3V0XCIpLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKGEuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdChcIiN6b29tSW5cIikgLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKDEvYS5kZWZhdWx0Wm9vbSkgfSk7XG5cdHIuc2VsZWN0KFwiI3pvb21PdXRNb3JlXCIpLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKDIqYS5kZWZhdWx0Wm9vbSkgfSk7XG5cdHIuc2VsZWN0KFwiI3pvb21Jbk1vcmVcIikgLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKDEvKDIqYS5kZWZhdWx0Wm9vbSkpIH0pO1xuXG5cdC8vIHBhbiBjb250cm9sc1xuXHRyLnNlbGVjdChcIiNwYW5MZWZ0XCIpIC5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEucGFuKC1hLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdChcIiNwYW5SaWdodFwiKS5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEucGFuKCthLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdChcIiNwYW5MZWZ0TW9yZVwiKSAub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigtNSphLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdChcIiNwYW5SaWdodE1vcmVcIikub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigrNSphLmRlZmF1bHRQYW4pIH0pO1xuXG5cdC8vIENyZWF0ZSBjb250ZXh0IG1lbnUuIFxuXHR0aGlzLmluaXRDb250ZXh0TWVudShbe1xuICAgICAgICAgICAgbGFiZWw6IFwiTUdJIFNOUHNcIiwgXG5cdCAgICBpY29uOiBcIm9wZW5faW5fbmV3XCIsXG5cdCAgICB0b29sdGlwOiBcIlZpZXcgU05QcyBhdCBNR0kgZm9yIHRoZSBjdXJyZW50IHN0cmFpbnMgaW4gdGhlIGN1cnJlbnQgcmVnaW9uLiAoU29tZSBzdHJhaW5zIG5vdCBhdmFpbGFibGUuKVwiLFxuXHQgICAgaGFuZGxlcjogKCk9PiB0aGlzLmFwcC5saW5rVG9NZ2lTbnBSZXBvcnQoKVxuXHR9LHtcbiAgICAgICAgICAgIGxhYmVsOiBcIk1HSSBRVExzXCIsIFxuXHQgICAgaWNvbjogIFwib3Blbl9pbl9uZXdcIixcblx0ICAgIHRvb2x0aXA6IFwiVmlldyBRVEwgYXQgTUdJIHRoYXQgb3ZlcmxhcCB0aGUgY3VycmVudCByZWdpb24uXCIsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naVFUTHMoKVxuXHR9LHtcbiAgICAgICAgICAgIGxhYmVsOiBcIk1HSSBKQnJvd3NlXCIsIFxuXHQgICAgaWNvbjogXCJvcGVuX2luX25ld1wiLFxuXHQgICAgdG9vbHRpcDogXCJPcGVuIE1HSSBKQnJvd3NlIChDNTdCTC82SiBHUkNtMzgpIHdpdGggdGhlIGN1cnJlbnQgY29vcmRpbmF0ZSByYW5nZS5cIixcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpSkJyb3dzZSgpXG5cdH1dKTtcblx0dGhpcy5yb290XG5cdCAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHQgICAgICAvLyBjbGljayBvbiBiYWNrZ3JvdW5kID0+IGhpZGUgY29udGV4dCBtZW51XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICh0Z3QudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlcIiAmJiB0Z3QuaW5uZXJIVE1MID09PSBcIm1lbnVcIilcblx0XHQgIC8vIGV4Y2VwdGlvbjogdGhlIGNvbnRleHQgbWVudSBidXR0b24gaXRzZWxmXG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgIGVsc2Vcblx0XHQgIHRoaXMuaGlkZUNvbnRleHRNZW51KClcblx0ICAgICAgXG5cdCAgfSlcblx0ICAub24oJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oKXtcblx0ICAgICAgLy8gcmlnaHQtY2xpY2sgb24gYSBmZWF0dXJlID0+IGZlYXR1cmUgY29udGV4dCBtZW51XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICghdGd0LmNsYXNzTGlzdC5jb250YWlucyhcImZlYXR1cmVcIikpIHJldHVybjtcblx0ICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0ICAgICAgZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgfSk7XG5cblx0Ly9cblx0Ly9cblx0bGV0IGZDbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZiwgZXZ0LCBwcmVzZXJ2ZSkge1xuXHQgICAgbGV0IGlkID0gZi5tZ2lpZCB8fCBmLm1ncGlkO1xuXHQgICAgaWYgKGV2dC5tZXRhS2V5KSB7XG5cdFx0aWYgKCFldnQuc2hpZnRLZXkgJiYgIXByZXNlcnZlKSB0aGlzLmhpRmVhdHMgPSB7fTtcblx0XHR0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICAgICAgdGhpcy5hcHAuc2V0Q29udGV4dCh7bGFuZG1hcms6KGYuY2Fub25pY2FsIHx8IGYuSUQpLCBkZWx0YTowfSlcblx0XHRyZXR1cm47XG5cdCAgICB9XG5cdCAgICBpZiAoZXZ0LnNoaWZ0S2V5KSB7XG5cdFx0aWYgKHRoaXMuaGlGZWF0c1tpZF0pXG5cdFx0ICAgIGRlbGV0ZSB0aGlzLmhpRmVhdHNbaWRdXG5cdFx0ZWxzZVxuXHRcdCAgICB0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRpZiAoIXByZXNlcnZlKSB0aGlzLmhpRmVhdHMgPSB7fTtcblx0XHR0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdCAgICAvLyBGSVhNRTogcmVhY2hvdmVyXG5cdCAgICB0aGlzLmFwcC5mZWF0dXJlRGV0YWlscy51cGRhdGUoZik7XG5cdH0uYmluZCh0aGlzKTtcblx0Ly9cblx0bGV0IGZNb3VzZU92ZXJIYW5kbGVyID0gZnVuY3Rpb24oZikge1xuXHRcdGlmIChkMy5ldmVudC5hbHRLZXkpIHtcblx0XHQgICAgLy8gSWYgdXNlciBpcyBob2xkaW5nIHRoZSBhbHQga2V5LCBzZWxlY3QgZXZlcnl0aGluZyB0b3VjaGVkLlxuXHRcdCAgICBmQ2xpY2tIYW5kbGVyKGYsIGQzLmV2ZW50LCB0cnVlKTtcblx0XHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0XHQgICAgLy8gRG9uJ3QgcmVnaXN0ZXIgY29udGV4dCBjaGFuZ2VzIHVudGlsIHVzZXIgaGFzIHBhdXNlZCBmb3IgYXQgbGVhc3QgMXMuXG5cdFx0ICAgIGlmICh0aGlzLnRpbWVvdXQpIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcblx0XHQgICAgdGhpcy50aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXsgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTsgfS5iaW5kKHRoaXMpLCAxMDAwKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIHRoaXMuaGlnaGxpZ2h0KGYpO1xuXHRcdCAgICBpZiAoZDMuZXZlbnQuY3RybEtleSlcblx0XHQgICAgICAgIHRoaXMuYXBwLmZlYXR1cmVEZXRhaWxzLnVwZGF0ZShmKTtcblx0XHR9XG5cdH0uYmluZCh0aGlzKTtcblx0Ly9cblx0bGV0IGZNb3VzZU91dEhhbmRsZXIgPSBmdW5jdGlvbihmKSB7XG5cdFx0dGhpcy5oaWdobGlnaHQoKTsgXG5cdH0uYmluZCh0aGlzKTtcblxuXHQvLyBcbiAgICAgICAgdGhpcy5zdmdcblx0ICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0ID0gZDMuZXZlbnQudGFyZ2V0O1xuXHQgICAgICBsZXQgdGd0ID0gZDMuc2VsZWN0KHQpO1xuXHQgICAgICBpZiAodC50YWdOYW1lID09IFwicmVjdFwiICYmIHQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmVhdHVyZVwiKSkge1xuXHRcdCAgLy8gdXNlciBjbGlja2VkIG9uIGEgZmVhdHVyZVxuXHRcdCAgZkNsaWNrSGFuZGxlcih0Ll9fZGF0YV9fLCBkMy5ldmVudCk7XG5cdFx0ICB0aGlzLmhpZ2hsaWdodCgpO1xuXHQgICAgICAgICAgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTtcblx0ICAgICAgfVxuXHQgICAgICBlbHNlIGlmICh0LnRhZ05hbWUgPT0gXCJyZWN0XCIgJiYgdC5jbGFzc0xpc3QuY29udGFpbnMoXCJibG9ja1wiKSAmJiAhZDMuZXZlbnQuc2hpZnRLZXkpIHtcblx0XHQgIC8vIHVzZXIgY2xpY2tlZCBvbiBhIHN5bnRlbnkgYmxvY2sgYmFja2dyb3VuZFxuXHRcdCAgdGhpcy5oaUZlYXRzID0ge307XG5cdFx0ICB0aGlzLmhpZ2hsaWdodCgpO1xuXHRcdCAgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTtcblx0ICAgICAgfVxuXHQgICAgICBlbHNlIGlmICh0LnRhZ05hbWUgPT0gXCJyZWN0XCIgJiYgdGd0LmF0dHIoJ25hbWUnKSA9PT0gJ3pvb21TdHJpcEhhbmRsZScgJiYgZDMuZXZlbnQuc2hpZnRLZXkpIHtcblx0ICAgICAgICAgIHRoaXMuYXBwLnNldENvbnRleHQoe3JlZjp0Ll9fZGF0YV9fLmdlbm9tZS5uYW1lfSk7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbihcIm1vdXNlb3ZlclwiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU92ZXJIYW5kbGVyKGYpO1xuXHQgICAgICB9XG5cdCAgfSlcblx0ICAub24oXCJtb3VzZW91dFwiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU91dEhhbmRsZXIoZik7XG5cdCAgICAgIH1cblx0ICB9KTtcblxuXHQvLyBCdXR0b246IERyb3AgZG93biBtZW51IGluIHpvb20gdmlld1xuXHR0aGlzLnJvb3Quc2VsZWN0KFwiLm1lbnUgPiAuYnV0dG9uXCIpXG5cdCAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICAvLyBzaG93IGNvbnRleHQgbWVudSBhdCBtb3VzZSBldmVudCBjb29yZGluYXRlc1xuXHQgICAgICBsZXQgY3ggPSBkMy5ldmVudC5jbGllbnRYO1xuXHQgICAgICBsZXQgY3kgPSBkMy5ldmVudC5jbGllbnRZO1xuXHQgICAgICBsZXQgYmIgPSBkMy5zZWxlY3QodGhpcylbMF1bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICBzZWxmLnNob3dDb250ZXh0TWVudShjeC1iYi5sZWZ0LGN5LWJiLnRvcCk7XG5cdCAgfSk7XG5cdC8vIHpvb20gY29vcmRpbmF0ZXMgYm94XG5cdHRoaXMucm9vdC5zZWxlY3QoXCIjem9vbUNvb3Jkc1wiKVxuXHQgICAgLmNhbGwoemNzID0+IHpjc1swXVswXS52YWx1ZSA9IGZvcm1hdENvb3Jkcyh0aGlzLmFwcC5jb29yZHMpKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkgeyB0aGlzLnNlbGVjdCgpOyB9KVxuXHQgICAgLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHsgc2VsZi5hcHAuc2V0Q29vcmRpbmF0ZXModGhpcy52YWx1ZSk7IH0pO1xuXG5cdC8vIHpvb20gd2luZG93IHNpemUgYm94XG5cdHRoaXMucm9vdC5zZWxlY3QoXCIjem9vbVdTaXplXCIpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7IHRoaXMuc2VsZWN0KCk7IH0pXG5cdCAgICAub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgbGV0IHdzID0gcGFyc2VJbnQodGhpcy52YWx1ZSk7XG5cdFx0bGV0IGMgPSBzZWxmLmFwcC5jb29yZHM7XG5cdFx0aWYgKGlzTmFOKHdzKSB8fCB3cyA8IDEwMCkge1xuXHRcdCAgICBhbGVydChcIkludmFsaWQgd2luZG93IHNpemUuIFBsZWFzZSBlbnRlciBhbiBpbnRlZ2VyID49IDEwMC5cIik7XG5cdFx0ICAgIHRoaXMudmFsdWUgPSBNYXRoLnJvdW5kKGMuZW5kIC0gYy5zdGFydCArIDEpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHQgICAgbGV0IG1pZCA9IChjLnN0YXJ0ICsgYy5lbmQpIC8gMjtcblx0XHQgICAgbGV0IG5ld3MgPSBNYXRoLnJvdW5kKG1pZCAtIHdzLzIpO1xuXHRcdCAgICBsZXQgbmV3ZSA9IG5ld3MgKyB3cyAtIDE7XG5cdFx0ICAgIHNlbGYuYXBwLnNldENvbnRleHQoe1xuXHRcdCAgICAgICAgY2hyOiBjLmNocixcblx0XHRcdHN0YXJ0OiBuZXdzLFxuXHRcdFx0ZW5kOiBuZXdlLFxuXHRcdFx0bGVuZ3RoOiBuZXdlLW5ld3MrMVxuXHRcdCAgICB9KTtcblx0XHR9XG5cdCAgICB9KTtcblx0Ly8gem9vbSBkcmF3aW5nIG1vZGUgXG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ2RpdltuYW1lPVwiem9vbURtb2RlXCJdIC5idXR0b24nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0bGV0IHIgPSBzZWxmLnJvb3Q7XG5cdFx0bGV0IGlzQyA9IHIuY2xhc3NlZCgnY29tcGFyaXNvbicpO1xuXHRcdHIuY2xhc3NlZCgnY29tcGFyaXNvbicsICFpc0MpO1xuXHRcdHIuY2xhc3NlZCgncmVmZXJlbmNlJywgaXNDKTtcblx0XHRzZWxmLmFwcC5zZXRDb250ZXh0KHtkbW9kZTogci5jbGFzc2VkKCdjb21wYXJpc29uJykgPyAnY29tcGFyaXNvbicgOiAncmVmZXJlbmNlJ30pO1xuXHQgICAgfSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIGRhdGEgKGxpc3Qgb2YgbWVudUl0ZW0gY29uZmlncykgRWFjaCBjb25maWcgbG9va3MgbGlrZSB7bGFiZWw6c3RyaW5nLCBoYW5kbGVyOiBmdW5jdGlvbn1cbiAgICBpbml0Q29udGV4dE1lbnUgKGRhdGEpIHtcblx0dGhpcy5jeHRNZW51LnNlbGVjdEFsbChcIi5tZW51SXRlbVwiKS5yZW1vdmUoKTsgLy8gaW4gY2FzZSBvZiByZS1pbml0XG4gICAgICAgIGxldCBtaXRlbXMgPSB0aGlzLmN4dE1lbnVcblx0ICAuc2VsZWN0QWxsKFwiLm1lbnVJdGVtXCIpXG5cdCAgLmRhdGEoZGF0YSk7XG5cdGxldCBuZXdzID0gbWl0ZW1zLmVudGVyKClcblx0ICAuYXBwZW5kKFwiZGl2XCIpXG5cdCAgLmF0dHIoXCJjbGFzc1wiLCBcIm1lbnVJdGVtIGZsZXhyb3dcIilcblx0ICAuYXR0cihcInRpdGxlXCIsIGQgPT4gZC50b29sdGlwIHx8IG51bGwgKTtcblx0bmV3cy5hcHBlbmQoXCJsYWJlbFwiKVxuXHQgIC50ZXh0KGQgPT4gZC5sYWJlbClcblx0ICAub24oXCJjbGlja1wiLCBkID0+IHtcblx0ICAgICAgZC5oYW5kbGVyKCk7XG5cdCAgICAgIHRoaXMuaGlkZUNvbnRleHRNZW51KCk7XG5cdCAgfSk7XG5cdG5ld3MuYXBwZW5kKFwiaVwiKVxuXHQgIC5hdHRyKFwiY2xhc3NcIiwgXCJtYXRlcmlhbC1pY29uc1wiKVxuXHQgIC50ZXh0KCBkPT5kLmljb24gKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0IGhpZ2hsaWdodGVkIChobHMpIHtcblx0aWYgKHR5cGVvZihobHMpID09PSBcInN0cmluZ1wiKVxuXHQgICAgaGxzID0gW2hsc107XG5cdC8vXG5cdHRoaXMuaGlGZWF0cyA9IHt9O1xuICAgICAgICBmb3IobGV0IGggb2YgaGxzKXtcblx0ICAgIHRoaXMuaGlGZWF0c1toXSA9IGg7XG5cdH1cbiAgICB9XG4gICAgZ2V0IGhpZ2hsaWdodGVkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlGZWF0cyA/IE9iamVjdC5rZXlzKHRoaXMuaGlGZWF0cykgOiBbXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93Q29udGV4dE1lbnUgKHgseSkge1xuICAgICAgICB0aGlzLmN4dE1lbnVcblx0ICAgIC5jbGFzc2VkKFwic2hvd2luZ1wiLCB0cnVlKVxuXHQgICAgLnN0eWxlKFwibGVmdFwiLCBgJHt4fXB4YClcblx0ICAgIC5zdHlsZShcInRvcFwiLCBgJHt5fXB4YClcblx0ICAgIDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaGlkZUNvbnRleHRNZW51ICgpIHtcbiAgICAgICAgdGhpcy5jeHRNZW51LmNsYXNzZWQoXCJzaG93aW5nXCIsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBncyAobGlzdCBvZiBHZW5vbWVzKVxuICAgIC8vIFNpZGUgZWZmZWN0czpcbiAgICAvLyAgICAgRm9yIGVhY2ggR2Vub21lLCBzZXRzIGcuem9vbVkgXG4gICAgc2V0IGdlbm9tZXMgKGdzKSB7XG4gICAgICAgZ3MuZm9yRWFjaCggKGcsaSkgPT4ge2cuem9vbVkgPSB0aGlzLnRvcE9mZnNldCArIGkgKiAodGhpcy5zdHJpcEhlaWdodCArIHRoaXMuc3RyaXBHYXApfSApO1xuICAgICAgIHRoaXMuX2dlbm9tZXMgPSBncztcbiAgICB9XG4gICAgZ2V0IGdlbm9tZXMgKCkge1xuICAgICAgIHJldHVybiB0aGlzLl9nZW5vbWVzO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzIChzdHJpcGVzKSBpbiB0b3AtdG8tYm90dG9tIG9yZGVyLlxuICAgIC8vXG4gICAgZ2V0R2Vub21lWU9yZGVyICgpIHtcbiAgICAgICAgbGV0IHN0cmlwcyA9IHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoXCIuem9vbVN0cmlwXCIpO1xuICAgICAgICBsZXQgc3MgPSBzdHJpcHNbMF0ubWFwKGc9PiB7XG5cdCAgICBsZXQgYmIgPSBnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgcmV0dXJuIFtiYi55LCBnLl9fZGF0YV9fLmdlbm9tZS5uYW1lXTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBucyA9IHNzLnNvcnQoIChhLGIpID0+IGFbMF0gLSBiWzBdICkubWFwKCB4ID0+IHhbMV0gKVxuXHRyZXR1cm4gbnM7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNldHMgdGhlIHRvcC10by1ib3R0b20gb3JkZXIgb2YgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcyBhY2NvcmRpbmcgdG8gXG4gICAgLy8gdGhlIGdpdmVuIG5hbWUgbGlzdCBvZiBuYW1lcy4gQmVjYXVzZSB3ZSBjYW4ndCBndWFyYW50ZWUgdGhlIGdpdmVuIG5hbWVzIGNvcnJlc3BvbmRcbiAgICAvLyB0byBhY3R1YWwgem9vbSBzdHJpcHMsIG9yIHRoYXQgYWxsIHN0cmlwcyBhcmUgcmVwcmVzZW50ZWQsIGV0Yy5cbiAgICAvLyBUaGVyZWZvcmUsIHRoZSBsaXN0IGlzIHByZXByZWNlc3NlZCBhcyBmb2xsb3dzOlxuICAgIC8vICAgICAqIGR1cGxpY2F0ZSBuYW1lcywgaWYgdGhleSBleGlzdCwgYXJlIHJlbW92ZWRcbiAgICAvLyAgICAgKiBuYW1lcyB0aGF0IGRvIG5vdCBjb3JyZXNwb25kIHRvIGV4aXN0aW5nIHpvb21TdHJpcHMgYXJlIHJlbW92ZWRcbiAgICAvLyAgICAgKiBuYW1lcyBvZiBleGlzdGluZyB6b29tIHN0cmlwcyB0aGF0IGRvbid0IGFwcGVhciBpbiB0aGUgbGlzdCBhcmUgYWRkZWQgdG8gdGhlIGVuZFxuICAgIC8vIFRoZSByZXN1bHQgaXMgYSBsaXN0IG9mIG5hbWVzIHdpdGggdGhlc2UgcHJvcGVydGllczpcbiAgICAvLyAgICAgKiB0aGVyZSBpcyBhIDE6MSBjb3JyZXNwb25kZW5jZSBiZXR3ZWVuIG5hbWVzIGFuZCBhY3R1YWwgem9vbSBzdHJpcHNcbiAgICAvLyAgICAgKiB0aGUgbmFtZSBvcmRlciBpcyBjb25zaXN0ZW50IHdpdGggdGhlIGlucHV0IGxpc3RcbiAgICAvLyBUaGlzIGlzIHRoZSBsaXN0IHVzZWQgdG8gKHJlKW9yZGVyIHRoZSB6b29tIHN0cmlwcy5cbiAgICAvL1xuICAgIC8vIEdpdmVuIHRoZSBsaXN0IG9yZGVyOiBcbiAgICAvLyAgICAgKiBhIFktcG9zaXRpb24gaXMgYXNzaWduZWQgdG8gZWFjaCBnZW5vbWVcbiAgICAvLyAgICAgKiB6b29tIHN0cmlwcyB0aGF0IGFyZSBOT1QgQ1VSUkVOVExZIEJFSU5HIERSQUdHRUQgYXJlIHRyYW5zbGF0ZWQgdG8gdGhlaXIgbmV3IGxvY2F0aW9uc1xuICAgIC8vXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgbnMgKGxpc3Qgb2Ygc3RyaW5ncykgTmFtZXMgb2YgdGhlIGdlbm9tZXMuXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgICAgbm90aGluZ1xuICAgIC8vIFNpZGUgZWZmZWN0czpcbiAgICAvLyAgICAgUmVjYWxjdWxhdGVzIHRoZSBZLWNvb3JkaW5hdGVzIGZvciBlYWNoIHN0cmlwZSBiYXNlZCBvbiB0aGUgZ2l2ZW4gb3JkZXIsIHRoZW4gdHJhbnNsYXRlc1xuICAgIC8vICAgICBlYWNoIHN0cmlwIHRvIGl0cyBuZXcgcG9zaXRpb24uXG4gICAgLy9cbiAgICBzZXRHZW5vbWVZT3JkZXIgKG5zKSB7XG5cdHRoaXMuZ2Vub21lcyA9IHJlbW92ZUR1cHMobnMpLm1hcChuPT4gdGhpcy5hcHAubmFtZTJnZW5vbWVbbl0gKS5maWx0ZXIoeD0+eCk7XG4gICAgICAgIHRoaXMuZ2Vub21lcy5mb3JFYWNoKCAoZyxpKSA9PiB7XG5cdCAgICBsZXQgc3RyaXAgPSBkMy5zZWxlY3QoYCN6b29tVmlldyAuem9vbVN0cmlwW25hbWU9XCIke2cubmFtZX1cIl1gKTtcblx0ICAgIGlmICghc3RyaXAuY2xhc3NlZChcImRyYWdnaW5nXCIpKVxuXHQgICAgICAgIHN0cmlwLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwLCR7Zy56b29tWX0pYCk7XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBkcmFnZ2VyIChkMy5iZWhhdmlvci5kcmFnKSB0byBiZSBhdHRhY2hlZCB0byBlYWNoIHpvb20gc3RyaXAuXG4gICAgLy8gQWxsb3dzIHN0cmlwcyB0byBiZSByZW9yZGVyZWQgYnkgZHJhZ2dpbmcuXG4gICAgZ2V0RHJhZ2dlciAoKSB7ICBcbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBkMy5iZWhhdmlvci5kcmFnKClcblx0ICAub3JpZ2luKGZ1bmN0aW9uKGQsaSl7XG5cdCAgICAgIHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIH0pXG4gICAgICAgICAgLm9uKFwiZHJhZ3N0YXJ0LnpcIiwgZnVuY3Rpb24oZykge1xuXHQgICAgICBsZXQgdCA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50LnRhcmdldDtcblx0ICAgICAgaWYgKGQzLmV2ZW50LnNvdXJjZUV2ZW50LnNoaWZ0S2V5IHx8IGQzLnNlbGVjdCh0KS5hdHRyKFwibmFtZVwiKSAhPT0gJ3pvb21TdHJpcEhhbmRsZScpe1xuXHQgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICB9XG5cdCAgICAgIGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICBsZXQgc3RyaXAgPSB0aGlzLmNsb3Nlc3QoXCIuem9vbVN0cmlwXCIpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nID0gZDMuc2VsZWN0KHN0cmlwKS5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgdHJ1ZSk7XG5cdCAgfSlcblx0ICAub24oXCJkcmFnLnpcIiwgZnVuY3Rpb24gKGcpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIGxldCBteCA9IGQzLm1vdXNlKHNlbGYuc3ZnTWFpblswXVswXSlbMF07XG5cdCAgICAgIGxldCBteSA9IGQzLm1vdXNlKHNlbGYuc3ZnTWFpblswXVswXSlbMV07XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7bXh9LCAke215fSlgKTtcblx0ICAgICAgc2VsZi5zZXRHZW5vbWVZT3JkZXIoc2VsZi5nZXRHZW5vbWVZT3JkZXIoKSk7XG5cdCAgICAgIHNlbGYuZHJhd0ZpZHVjaWFscygpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZ2VuZC56XCIsIGZ1bmN0aW9uIChnKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICAvL1xuXHQgICAgICBzZWxmLmRyYWdnaW5nLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCBmYWxzZSk7XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgPSBudWxsO1xuXHQgICAgICBzZWxmLnNldEdlbm9tZVlPcmRlcihzZWxmLmdldEdlbm9tZVlPcmRlcigpKTtcblx0ICAgICAgc2VsZi5hcHAuc2V0Q29udGV4dCh7IGdlbm9tZXM6IHNlbGYuZ2V0R2Vub21lWU9yZGVyKCkgfSk7XG5cdCAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCBzZWxmLmRyYXdGaWR1Y2lhbHMuYmluZChzZWxmKSwgNTAgKTtcblx0ICB9KVxuXHQgIDtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhckJydXNoZXMgKCkge1xuXHR0aGlzLnJvb3Quc2VsZWN0QWxsKFwiZy5icnVzaFwiKVxuXHQgICAgLmVhY2goIGZ1bmN0aW9uIChiKSB7XG5cdCAgICAgICAgYi5icnVzaC5jbGVhcigpO1xuXHRcdGQzLnNlbGVjdCh0aGlzKS5jYWxsKGIuYnJ1c2gpO1xuXHQgICAgfSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgY3VycmVudCBicnVzaCBjb29yZGluYXRlcywgdHJhbnNsYXRlZCAoaWYgbmVlZGVkKSB0byByZWYgZ2Vub21lIGNvb3JkaW5hdGVzLlxuICAgIGJiR2V0UmVmQ29vcmRzICgpIHtcbiAgICAgIGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7XG4gICAgICBsZXQgYmxrID0gdGhpcy5icnVzaGluZztcbiAgICAgIGxldCBleHQgPSBibGsuYnJ1c2guZXh0ZW50KCk7XG4gICAgICBsZXQgciA9IHsgY2hyOiBibGsuY2hyLCBzdGFydDogZXh0WzBdLCBlbmQ6IGV4dFsxXSwgYmxvY2tJZDpibGsuYmxvY2tJZCB9O1xuICAgICAgbGV0IHRyID0gdGhpcy5hcHAudHJhbnNsYXRvcjtcbiAgICAgIGlmKCBibGsuZ2Vub21lICE9PSByZyApIHtcbiAgICAgICAgIC8vIHVzZXIgaXMgYnJ1c2hpbmcgYSBjb21wIGdlbm9tZXMgc28gZmlyc3QgdHJhbnNsYXRlXG5cdCAvLyBjb29yZGluYXRlcyB0byByZWYgZ2Vub21lXG5cdCBsZXQgcnMgPSB0aGlzLmFwcC50cmFuc2xhdG9yLnRyYW5zbGF0ZShibGsuZ2Vub21lLCByLmNociwgci5zdGFydCwgci5lbmQsIHJnKTtcblx0IGlmIChycy5sZW5ndGggPT09IDApIHJldHVybjtcblx0IHIgPSByc1swXTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAgIHIuYmxvY2tJZCA9IHJnLm5hbWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gcjtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gaGFuZGxlciBmb3IgdGhlIHN0YXJ0IG9mIGEgYnJ1c2ggYWN0aW9uIGJ5IHRoZSB1c2VyIG9uIGEgYmxvY2tcbiAgICBiYlN0YXJ0IChibGssYkVsdCkge1xuICAgICAgdGhpcy5icnVzaGluZyA9IGJsaztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYmJFbmQgKCkge1xuICAgICAgbGV0IHNlID0gZDMuZXZlbnQuc291cmNlRXZlbnQ7XG4gICAgICBsZXQgeHQgPSB0aGlzLmJydXNoaW5nLmJydXNoLmV4dGVudCgpO1xuICAgICAgbGV0IHIgPSB0aGlzLmJiR2V0UmVmQ29vcmRzKCk7XG4gICAgICB0aGlzLmJydXNoaW5nID0gbnVsbDtcbiAgICAgIC8vXG4gICAgICBpZiAoc2UuY3RybEtleSB8fCBzZS5hbHRLZXkgfHwgc2UubWV0YUtleSkge1xuXHQgIHRoaXMuY2xlYXJCcnVzaGVzKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy9cbiAgICAgIGlmIChNYXRoLmFicyh4dFswXSAtIHh0WzFdKSA8PSAxMCkge1xuXHQgIC8vIFVzZXIgY2xpY2tlZC4gUmVjZW50ZXIgdmlldy5cblx0ICBsZXQgY2MgICAgICAgID0gdGhpcy5hcHAuY29vcmRzOyBcblx0ICBsZXQgY3VycldpZHRoID0gY2MuZW5kIC0gY2Muc3RhcnQgKyAxO1xuXHQgIGxldCBtaWQgICAgICAgPSAoY2Muc3RhcnQgKyBjYy5lbmQpLzI7XG4gICAgICAgICAgbGV0IGQgPSAoeHRbMF0gKyB4dFsxXSkvMiAtIG1pZDtcblx0ICB0aGlzLmFwcC5zZXRDb250ZXh0KHsgc3RhcnQ6IGNjLnN0YXJ0K2QsIGVuZDogY2MuZW5kK2QgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcblx0ICAvLyBVc2VyIGRyYWdnZWQuIFpvb20gaW4gb3Igb3V0LlxuXHQgIHRoaXMuYXBwLnNldENvbnRleHQoeyBzdGFydDp4dFswXSwgZW5kOnh0WzFdIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWdobGlnaHRTdHJpcCAoZywgZWx0KSB7XG5cdGlmIChnID09PSB0aGlzLmN1cnJlbnRITEcpIHJldHVybjtcblx0dGhpcy5jdXJyZW50SExHID0gZztcblx0Ly9cblx0dGhpcy5zdmdNYWluLnNlbGVjdEFsbCgnLnpvb21TdHJpcCcpXG5cdCAgICAuY2xhc3NlZChcImhpZ2hsaWdodGVkXCIsIGQgPT4gZC5nZW5vbWUgPT09IGcpO1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0QWxsKCcuem9vbVN0cmlwSGFuZGxlJylcblx0ICAgIC5jbGFzc2VkKFwiaGlnaGxpZ2h0ZWRcIiwgZCA9PiBkLmdlbm9tZSA9PT0gZyk7XG5cdHRoaXMuYXBwLnNob3dCbG9ja3MoZyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyB0aGUgWm9vbVZpZXcgdG8gc2hvdyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSByZWcgZ2Vub21lIGFuZCB0aGUgY29ycmVzcG9uZGluZ1xuICAgIC8vIHJhbmdlKHMpIGluIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy9cbiAgICB1cGRhdGVWaWFNYXBwZWRDb29yZGluYXRlcyAoY29vcmRzKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0bGV0IGMgPSAoY29vcmRzIHx8IHRoaXMuYXBwLmNvb3Jkcyk7XG5cdGQzLnNlbGVjdChcIiN6b29tQ29vcmRzXCIpWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCk7XG5cdGQzLnNlbGVjdChcIiN6b29tV1NpemVcIilbMF1bMF0udmFsdWUgPSBNYXRoLnJvdW5kKGMuZW5kIC0gYy5zdGFydCArIDEpXG5cdC8vXG4gICAgICAgIGxldCBtZ3YgPSB0aGlzLmFwcDtcblx0Ly8gd2hlbiB0aGUgdHJhbnNsYXRvciBpcyByZWFkeSwgd2UgY2FuIHRyYW5zbGF0ZSB0aGUgcmVmIGNvb3JkcyB0byBlYWNoIGdlbm9tZSBhbmRcblx0Ly8gaXNzdWUgcmVxdWVzdHMgdG8gbG9hZCB0aGUgZmVhdHVyZXMgaW4gdGhvc2UgcmVnaW9ucy5cblx0cmV0dXJuIG1ndi50cmFuc2xhdG9yLnJlYWR5KCkudGhlbihmdW5jdGlvbigpe1xuXHQgICAgLy8gTm93IGlzc3VlIHJlcXVlc3RzIGZvciBmZWF0dXJlcy4gT25lIHJlcXVlc3QgcGVyIGdlbm9tZSwgZWFjaCByZXF1ZXN0IHNwZWNpZmllcyBvbmUgb3IgbW9yZVxuXHQgICAgLy8gY29vcmRpbmF0ZSByYW5nZXMuXG5cdCAgICAvLyBXYWl0IGZvciBhbGwgdGhlIGRhdGEgdG8gYmVjb21lIGF2YWlsYWJsZSwgdGhlbiBkcmF3LlxuXHQgICAgLy9cblx0ICAgIGxldCBwcm9taXNlcyA9IFtdO1xuXG5cdCAgICAvLyBGaXJzdCByZXF1ZXN0IGlzIGZvciB0aGUgdGhlIHJlZmVyZW5jZSBnZW5vbWUuIEdldCBhbGwgdGhlIGZlYXR1cmVzIGluIHRoZSByYW5nZS5cblx0ICAgIHByb21pc2VzLnB1c2gobWd2LmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzKG1ndi5yR2Vub21lLCBbe1xuXHRcdC8vIE5lZWQgdG8gc2ltdWxhdGUgdGhlIHJlc3VsdHMgZnJvbSBjYWxsaW5nIHRoZSB0cmFuc2xhdG9yLiBcblx0XHQvLyBcblx0XHRjaHIgICAgOiBjLmNocixcblx0XHRzdGFydCAgOiBjLnN0YXJ0LFxuXHRcdGVuZCAgICA6IGMuZW5kLFxuXHRcdGluZGV4ICA6IDAsXG5cdFx0ZkNociAgIDogYy5jaHIsXG5cdFx0ZlN0YXJ0IDogYy5zdGFydCxcblx0XHRmRW5kICAgOiBjLmVuZCxcblx0XHRmSW5kZXggIDogMCxcblx0XHRvcmkgICAgOiBcIitcIixcblx0XHRibG9ja0lkOiBtZ3Yuckdlbm9tZS5uYW1lXG5cdFx0fV0pKTtcblx0ICAgIGlmICghIHNlbGYucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIpKSB7XG5cdFx0Ly8gQWRkIGEgcmVxdWVzdCBmb3IgZWFjaCBjb21wYXJpc29uIGdlbm9tZSwgdXNpbmcgdHJhbnNsYXRlZCBjb29yZGluYXRlcy4gXG5cdFx0bWd2LmNHZW5vbWVzLmZvckVhY2goY0dlbm9tZSA9PiB7XG5cdFx0ICAgIGxldCByYW5nZXMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUoIG1ndi5yR2Vub21lLCBjLmNociwgYy5zdGFydCwgYy5lbmQsIGNHZW5vbWUgKTtcblx0XHQgICAgbGV0IHAgPSBtZ3YuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXMoY0dlbm9tZSwgcmFuZ2VzKTtcblx0XHQgICAgcHJvbWlzZXMucHVzaChwKTtcblx0XHR9KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcblx0fSk7XG4gICAgfVxuICAgIC8vIFVwZGF0ZXMgdGhlIFpvb21WaWV3IHRvIHNob3cgdGhlIHJlZ2lvbiBhcm91bmQgYSBsYW5kbWFyayBpbiBlYWNoIGdlbm9tZS5cbiAgICAvL1xuICAgIC8vIGNvb3JkcyA9IHtcbiAgICAvLyAgICAgbGFuZG1hcmsgOiBpZCBvZiBhIGZlYXR1cmUgdG8gdXNlIGFzIGEgcmVmZXJlbmNlXG4gICAgLy8gICAgIGZsYW5rfHdpZHRoIDogc3BlY2lmeSBvbmUgb2YgZmxhbmsgb3Igd2lkdGguIFxuICAgIC8vICAgICAgICAgZmxhbmsgPSBhbW91bnQgb2YgZmxhbmtpbmcgcmVnaW9uIChicCkgdG8gaW5jbHVkZSBhdCBib3RoIGVuZHMgb2YgdGhlIGxhbmRtYXJrLCBcbiAgICAvLyAgICAgICAgIHNvIHRoZSB0b3RhbCB2aWV3aW5nIHJlZ2lvbiA9IGZsYW5rICsgbGVuZ3RoKGxhbmRtYXJrKSArIGZsYW5rLlxuICAgIC8vICAgICAgICAgd2lkdGggPSB0b3RhbCB2aWV3aW5nIHJlZ2lvbiB3aWR0aC4gSWYgYm90aCB3aWR0aCBhbmQgZmxhbmsgYXJlIHNwZWNpZmllZCwgZmxhbmsgaXMgaWdub3JlZC5cbiAgICAvLyAgICAgZGVsdGEgOiBhbW91bnQgdG8gc2hpZnQgdGhlIHZpZXcgbGVmdC9yaWdodFxuICAgIC8vIH1cbiAgICAvLyBcbiAgICAvLyBUaGUgbGFuZG1hcmsgbXVzdCBleGlzdCBpbiB0aGUgY3VycmVudCByZWZlcmVuY2UgZ2Vub21lLiBcbiAgICAvL1xuICAgIHVwZGF0ZVZpYUxhbmRtYXJrQ29vcmRpbmF0ZXMgKGNvb3Jkcykge1xuXHRsZXQgYyA9IGNvb3Jkcztcblx0bGV0IG1ndiA9IHRoaXMuYXBwO1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCByZiA9IGNvb3Jkcy5sYW5kbWFya1JlZkZlYXQ7XG5cdGxldCBmZWF0cyA9IGNvb3Jkcy5sYW5kbWFya0ZlYXRzO1xuXHRpZiAodGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgZmVhdHMgPSBmZWF0cy5maWx0ZXIoZiA9PiBmLmdlbm9tZSA9PT0gdGhpcy5hcHAuckdlbm9tZSk7XG5cdGxldCBkZWx0YSA9IGNvb3Jkcy5kZWx0YSB8fCAwO1xuXHQvLyBjb21wdXRlIHJhbmdlcyBhcm91bmQgbGFuZG1hcmsgaW4gZWFjaCBnZW5vbWVcblx0bGV0IHJhbmdlcyA9IGZlYXRzLm1hcChmID0+IHtcblx0ICAgIGxldCBmbGFuayA9IGMubGVuZ3RoID8gKGMubGVuZ3RoIC0gZi5sZW5ndGgpIC8gMiA6IGMuZmxhbms7XG5cdCAgICBsZXQgY2xlbmd0aCA9IGYuZ2Vub21lLmdldENocm9tb3NvbWUoZi5jaHIpLmxlbmd0aDtcblx0ICAgIGxldCB3ICAgICA9IGMubGVuZ3RoID8gYy5sZW5ndGggOiAoZi5sZW5ndGggKyAyKmZsYW5rKTtcblx0ICAgIGxldCBzdGFydCA9IGNsaXAoTWF0aC5yb3VuZChkZWx0YSArIGYuc3RhcnQgLSBmbGFuayksIDEsIGNsZW5ndGgpO1xuXHQgICAgbGV0IGVuZCAgID0gY2xpcChNYXRoLnJvdW5kKHN0YXJ0ICsgdyksIHN0YXJ0LCBjbGVuZ3RoKVxuXHQgICAgbGV0IHJhbmdlID0ge1xuXHRcdGdlbm9tZTpcdGYuZ2Vub21lLFxuXHRcdGNocjpcdGYuY2hyLFxuXHRcdHN0YXJ0Olx0c3RhcnQsXG5cdFx0ZW5kOlx0ZW5kXG5cdCAgICB9IDtcblx0ICAgIGlmIChmLmdlbm9tZSA9PT0gbWd2LnJHZW5vbWUpIHtcblx0XHRsZXQgYyA9IHRoaXMuYXBwLmNvb3JkcyA9IHJhbmdlO1xuXHRcdGQzLnNlbGVjdChcIiN6b29tQ29vcmRzXCIpWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCk7XG5cdFx0ZDMuc2VsZWN0KFwiI3pvb21XU2l6ZVwiKVswXVswXS52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSlcblx0ICAgIH1cblx0ICAgIHJldHVybiByYW5nZTtcblx0fSk7XG5cdGxldCBzZWVuR2Vub21lcyA9IG5ldyBTZXQoKTtcblx0bGV0IHJDb29yZHM7XG5cdC8vIEdldCAocHJvbWlzZXMgZm9yKSB0aGUgZmVhdHVyZXMgaW4gZWFjaCByYW5nZS5cblx0bGV0IHByb21pc2VzID0gcmFuZ2VzLm1hcChyID0+IHtcbiAgICAgICAgICAgIGxldCBycnM7XG5cdCAgICBzZWVuR2Vub21lcy5hZGQoci5nZW5vbWUpO1xuXHQgICAgaWYgKHIuZ2Vub21lID09PSBtZ3Yuckdlbm9tZSl7XG5cdFx0Ly8gdGhlIHJlZiBnZW5vbWUgcmFuZ2Vcblx0XHRyQ29vcmRzID0gcjtcblx0ICAgICAgICBycnMgPSBbe1xuXHRcdCAgICBjaHIgICAgOiByLmNocixcblx0XHQgICAgc3RhcnQgIDogci5zdGFydCxcblx0XHQgICAgZW5kICAgIDogci5lbmQsXG5cdFx0ICAgIGluZGV4ICA6IDAsXG5cdFx0ICAgIGZDaHIgICA6IHIuY2hyLFxuXHRcdCAgICBmU3RhcnQgOiByLnN0YXJ0LFxuXHRcdCAgICBmRW5kICAgOiByLmVuZCxcblx0XHQgICAgZkluZGV4ICA6IDAsXG5cdFx0ICAgIG9yaSAgICA6IFwiK1wiLFxuXHRcdCAgICBibG9ja0lkOiBtZ3Yuckdlbm9tZS5uYW1lXG5cdFx0fV07XG5cdCAgICB9XG5cdCAgICBlbHNlIHsgXG5cdFx0Ly8gdHVybiB0aGUgc2luZ2xlIHJhbmdlIGludG8gYSByYW5nZSBmb3IgZWFjaCBvdmVybGFwcGluZyBzeW50ZW55IGJsb2NrIHdpdGggdGhlIHJlZiBnZW5vbWVcblx0ICAgICAgICBycnMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUoci5nZW5vbWUsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgbWd2LnJHZW5vbWUsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhyLmdlbm9tZSwgcnJzKTtcblx0fSk7XG5cdC8vIEZvciBlYWNoIGdlbm9tZSB3aGVyZSB0aGUgbGFuZG1hcmsgZG9lcyBub3QgZXhpc3QsIGNvbXB1dGUgYSBtYXBwZWQgcmFuZ2UgKGFzIGluIG1hcHBlZCBjbW9kZSkuXG5cdGlmICghdGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgbWd2LmNHZW5vbWVzLmZvckVhY2goZyA9PiB7XG5cdFx0aWYgKCEgc2Vlbkdlbm9tZXMuaGFzKGcpKSB7XG5cdFx0ICAgIGxldCBycnMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUobWd2LnJHZW5vbWUsIHJDb29yZHMuY2hyLCByQ29vcmRzLnN0YXJ0LCByQ29vcmRzLmVuZCwgZyk7XG5cdFx0ICAgIHByb21pc2VzLnB1c2goIG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhnLCBycnMpICk7XG5cdFx0fVxuXHQgICAgfSk7XG5cdC8vIFdoZW4gYWxsIHRoZSBkYXRhIGlzIHJlYWR5LCBkcmF3LlxuXHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH1cbiAgICAvL1xuICAgIHVwZGF0ZSAoKSB7XG5cdGxldCBwO1xuXHRpZiAodGhpcy5hcHAuY21vZGUgPT09ICdtYXBwZWQnKVxuXHQgICAgcCA9IHRoaXMudXBkYXRlVmlhTWFwcGVkQ29vcmRpbmF0ZXModGhpcy5hcHAuY29vcmRzKTtcblx0ZWxzZVxuXHQgICAgcCA9IHRoaXMudXBkYXRlVmlhTGFuZG1hcmtDb29yZGluYXRlcyh0aGlzLmFwcC5sY29vcmRzKTtcblx0cC50aGVuKCBkYXRhID0+IHtcblx0ICAgIHRoaXMuZHJhdyhkYXRhKTtcblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgb3JkZXJTQmxvY2tzIChzYmxvY2tzKSB7XG5cdC8vIFNvcnQgdGhlIHNibG9ja3MgaW4gZWFjaCBzdHJpcCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgZHJhd2luZyBtb2RlLlxuXHRsZXQgY21wRmllbGQgPSB0aGlzLmRtb2RlID09PSAnY29tcGFyaXNvbicgPyAnaW5kZXgnIDogJ2ZJbmRleCc7XG5cdGxldCBjbXBGdW5jID0gKGEsYikgPT4gYS5fX2RhdGFfX1tjbXBGaWVsZF0tYi5fX2RhdGFfX1tjbXBGaWVsZF07XG5cdHNibG9ja3MuZm9yRWFjaCggc3RyaXAgPT4gc3RyaXAuc29ydCggY21wRnVuYyApICk7XG5cdC8vIHBpeGVscyBwZXIgYmFzZVxuXHRsZXQgcHBiID0gdGhpcy53aWR0aCAvICh0aGlzLmFwcC5jb29yZHMuZW5kIC0gdGhpcy5hcHAuY29vcmRzLnN0YXJ0ICsgMSk7XG5cdGxldCBwc3RhcnQgPSBbXTsgLy8gb2Zmc2V0IChpbiBwaXhlbHMpIG9mIHN0YXJ0IHBvc2l0aW9uIG9mIG5leHQgYmxvY2ssIGJ5IHN0cmlwIGluZGV4ICgwPT09cmVmKVxuXHRsZXQgYnN0YXJ0ID0gW107IC8vIGJsb2NrIHN0YXJ0IHBvcyAoaW4gYnApIGFzc29jIHdpdGggcHN0YXJ0XG5cdGxldCBjY2hyID0gbnVsbDtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgZHg7XG5cdGxldCBwZW5kO1xuXHRzYmxvY2tzLmVhY2goIGZ1bmN0aW9uIChiLGksaikgeyAvLyBiPWJsb2NrLCBpPWluZGV4IHdpdGhpbiBzdHJpcCwgaj1zdHJpcCBpbmRleFxuXHQgICAgbGV0IGJsZW4gPSBwcGIgKiAoYi5lbmQgLSBiLnN0YXJ0ICsgMSk7IC8vIHRvdGFsIHNjcmVlbiB3aWR0aCBvZiB0aGlzIHNibG9ja1xuXHQgICAgYi5mbGlwID0gYi5vcmkgPT09ICctJyAmJiBzZWxmLmRtb2RlID09PSAncmVmZXJlbmNlJztcblx0ICAgIGIueHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFtiLnN0YXJ0LCBiLmVuZF0pLnJhbmdlKCBiLmZsaXAgPyBbYmxlbiwgMF0gOiBbMCwgYmxlbl0gKTtcblx0ICAgIC8vXG5cdCAgICBpZiAoaT09PTApIHtcblx0XHQvLyBmaXJzdCBibG9jayBpbiBlYWNoIHN0cmlwIGluaXRzXG5cdFx0cHN0YXJ0W2pdID0gMDtcblx0XHRic3RhcnRbal0gPSBiLnN0YXJ0O1xuXHRcdGR4ID0gMDtcblx0XHRjY2hyID0gYi5jaHI7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRkeCA9IGIuY2hyID09PSBjY2hyID8gcHN0YXJ0W2pdICsgcHBiICogKGIuc3RhcnQgLSBic3RhcnRbal0pIDogSW5maW5pdHk7XG5cdFx0aWYgKGR4ID4gc2VsZi5tYXhTQmdhcCkge1xuXHRcdCAgICAvLyBDaGFuZ2VkIGNociBvciBqdW1wZWQgYSBsYXJnZSBnYXBcblx0XHQgICAgcHN0YXJ0W2pdID0gcGVuZCArIDE2O1xuXHRcdCAgICBic3RhcnRbal0gPSBiLnN0YXJ0O1xuXHRcdCAgICBkeCA9IHBzdGFydFtqXTtcblx0XHR9XG5cdCAgICB9XG5cdCAgICBkMy5zZWxlY3QodGhpcykuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7ZHh9LDApYCk7XG5cdCAgICBwZW5kID0gZHggKyBibGVuO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBtZXJnZVNibG9ja1J1bnMgKGRhdGEpIHtcblx0Ly8gLS0tLS1cblx0Ly8gUmVkdWNlciBmdW5jdGlvbi4gV2lsbCBiZSBjYWxsZWQgd2l0aCB0aGVzZSBhcmdzOlxuXHQvLyAgIG5ibGNrcyAobGlzdCkgTmV3IGJsb2Nrcy4gKGN1cnJlbnQgYWNjdW11bGF0b3IgdmFsdWUpXG5cdC8vICAgXHRBIGxpc3Qgb2YgbGlzdHMgb2Ygc3ludGVueSBibG9ja3MuXG5cdC8vICAgYmxrIChzeW50ZW55IGJsb2NrKSB0aGUgY3VycmVudCBzeW50ZW55IGJsb2NrXG5cdC8vICAgaSAoaW50KSBUaGUgaXRlcmF0aW9uIGNvdW50LlxuXHQvLyBSZXR1cm5zOlxuXHQvLyAgIGxpc3Qgb2YgbGlzdHMgb2YgYmxvY2tzXG5cdGxldCBtZXJnZXIgPSBmdW5jdGlvbihuYmxrcywgYiwgaSkge1xuXHQgICAgbGV0IGluaXRCbGsgPSBmdW5jdGlvbiAoYmIpIHtcblx0XHRsZXQgbmIgPSBPYmplY3QuYXNzaWduKHt9LCBiYik7XG5cdFx0bmIuZmVhdHVyZXMgPSBiYi5mZWF0dXJlcy5jb25jYXQoKTtcblx0XHRuYi5zYmxvY2tzID0gW2JiXTtcblx0XHRuYi5vcmkgPSAnKyc7XG5cdCAgICAgICAgcmV0dXJuIG5iO1xuXHQgICAgfTtcblx0ICAgIGlmIChpID09PSAwKXtcblx0XHRuYmxrcy5wdXNoKGluaXRCbGsoYikpO1xuXHRcdHJldHVybiBuYmxrcztcblx0ICAgIH1cblx0ICAgIGxldCBsYXN0QmxrID0gbmJsa3NbbmJsa3MubGVuZ3RoIC0gMV07XG5cdCAgICBpZiAoYi5jaHIgIT09IGxhc3RCbGsuY2hyIHx8IGIuaW5kZXggLSBsYXN0QmxrLmluZGV4ID4gMikge1xuXHQgICAgICAgIG5ibGtzLnB1c2goaW5pdEJsayhiKSk7XG5cdFx0cmV0dXJuIG5ibGtzO1xuXHQgICAgfVxuXHQgICAgLy8gbWVyZ2Vcblx0ICAgIGxhc3RCbGsuaW5kZXggPSBiLmluZGV4O1xuXHQgICAgbGFzdEJsay5lbmQgPSBiLmVuZDtcblx0ICAgIGxhc3RCbGsuYmxvY2tFbmQgPSBiLmJsb2NrRW5kO1xuXHQgICAgbGFzdEJsay5mZWF0dXJlcyA9IGxhc3RCbGsuZmVhdHVyZXMuY29uY2F0KGIuZmVhdHVyZXMpO1xuXHQgICAgLy9iLmZlYXR1cmVzID0gbnVsbDtcblx0ICAgIGxhc3RCbGsuc2Jsb2Nrcy5wdXNoKGIpO1xuXHQgICAgcmV0dXJuIG5ibGtzO1xuXHR9O1xuXHQvLyAtLS0tLVxuICAgICAgICBkYXRhLmZvckVhY2goKGdkYXRhLGkpID0+IHtcblx0ICAgIGdkYXRhLmJsb2Nrcy5zb3J0KCAoYSxiKSA9PiBhLmluZGV4IC0gYi5pbmRleCApO1xuXHQgICAgZ2RhdGEuYmxvY2tzID0gZ2RhdGEuYmxvY2tzLnJlZHVjZShtZXJnZXIsW10pO1xuXHR9KTtcblx0cmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBzeW50ZW55IGJsb2Nrcy4gRWFjaCB6b29tIHN0cmlwIGhhcyBhIGxpc3Qgb2YgMSBvciBtb3JlIHNibG9ja3MuXG4gICAgLy8gVGhlIHJlZmVyZW5jZSBnZW5vbWUgYWx3YXlzIGhhcyBqdXN0IDEuIFRoZSBjb21wIGdlbm9tZXMgbWFueSBoYXZlXG4gICAgLy8gMSBvciBtb3JlIChhbmQgaW4gcmFyZSBjYXNlcywgMCkuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB1bmlxaWZ5QmxvY2tzIChibG9ja3MpIHtcblx0Ly8gaGVscGVyIGZ1bmN0aW9uLiBXaGVuIHNibG9jayByZWxhdGlvbnNoaXAgYmV0d2VlbiBnZW5vbWVzIGlzIGNvbmZ1c2VkLCByZXF1ZXN0aW5nIG9uZVxuXHQvLyByZWdpb24gaW4gZ2Vub21lIEEgY2FuIGVuZCB1cCByZXF1ZXN0aW5nIHRoZSBzYW1lIHJlZ2lvbiBpbiBnZW5vbWUgQiBtdWx0aXBsZSB0aW1lcy5cblx0Ly8gVGhpcyBmdW5jdGlvbiBhdm9pZHMgZHJhd2luZyB0aGUgc2FtZSBzYmxvY2sgdHdpY2UuIChOQjogUmVhbGx5IG5vdCBzdXJlIHdoZXJlIHRoaXMgXG5cdC8vIGNoZWNrIGlzIGJlc3QgZG9uZS4gQ291bGQgcHVzaCBpdCBmYXJ0aGVyIHVwc3RyZWFtLilcblx0bGV0IHNlZW4gPSBuZXcgU2V0KCk7XG5cdHJldHVybiBibG9ja3MuZmlsdGVyKCBiID0+IHsgXG5cdCAgICBpZiAoc2Vlbi5oYXMoYi5pbmRleCkpIHJldHVybiBmYWxzZTtcblx0ICAgIHNlZW4uYWRkKGIuaW5kZXgpO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdH0pO1xuICAgIH07XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQXBwbGllcyBzZXZlcmFsIHRyYW5zZm9ybWF0aW9uIHN0ZXBzIG9uIHRoZSBkYXRhIGFzIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIgdG8gcHJlcGFyZSBmb3IgZHJhd2luZy5cbiAgICAvLyBJbnB1dCBkYXRhIGlzIHN0cnVjdHVyZWQgYXMgZm9sbG93czpcbiAgICAvLyAgICAgZGF0YSA9IFsgem9vbVN0cmlwX2RhdGEgXVxuICAgIC8vICAgICB6b29tU3RyaXBfZGF0YSA9IHsgZ2Vub21lIFsgem9vbUJsb2NrX2RhdGEgXSB9XG4gICAgLy8gICAgIHpvb21CbG9ja19kYXRhID0geyB4c2NhbGUsIGNociwgc3RhcnQsIGVuZCwgaW5kZXgsIGZDaHIsIGZTdGFydCwgZkVuZCwgZkluZGV4LCBvcmksIFsgZmVhdHVyZV9kYXRhIF0gfVxuICAgIC8vICAgICBmZWF0dXJlX2RhdGEgPSB7IG1ncGlkLCBtZ2lpZCwgc3ltYm9sLCBjaHIsIHN0YXJ0LCBlbmQsIHN0cmFuZCwgdHlwZSwgYmlvdHlwZSB9XG4gICAgLy9cbiAgICAvLyBBZ2FpbiwgaW4gRW5nbGlzaDpcbiAgICAvLyAgLSBkYXRhIGlzIGEgbGlzdCBvZiBpdGVtcywgb25lIHBlciBzdHJpcCB0byBiZSBkaXNwbGF5ZWQuIEl0ZW1bMF0gaXMgZGF0YSBmb3IgdGhlIHJlZiBnZW5vbWUuXG4gICAgLy8gICAgSXRlbXNbMStdIGFyZSBkYXRhIGZvciB0aGUgY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy8gIC0gZWFjaCBzdHJpcCBpdGVtIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGEgZ2Vub21lIGFuZCBhIGxpc3Qgb2YgYmxvY2tzLiBJdGVtWzBdIGFsd2F5cyBoYXMgXG4gICAgLy8gICAgYSBzaW5nbGUgYmxvY2suXG4gICAgLy8gIC0gZWFjaCBibG9jayBpcyBhbiBvYmplY3QgY29udGFpbmluZyBhIGNocm9tb3NvbWUsIHN0YXJ0LCBlbmQsIG9yaWVudGF0aW9uLCBldGMsIGFuZCBhIGxpc3Qgb2YgZmVhdHVyZXMuXG4gICAgLy8gIC0gZWFjaCBmZWF0dXJlIGhhcyBjaHIsc3RhcnQsZW5kLHN0cmFuZCx0eXBlLGJpb3R5cGUsbWdwaWRcbiAgICAvL1xuICAgIC8vIEJlY2F1c2UgU0Jsb2NrcyBjYW4gYmUgdmVyeSBmcmFnbWVudGVkLCBvbmUgY29udGlndW91cyByZWdpb24gaW4gdGhlIHJlZiBnZW5vbWUgY2FuIHR1cm4gaW50byBcbiAgICAvLyBhIGJhemlsbGlvbiB0aW55IGJsb2NrcyBpbiB0aGUgY29tcGFyaXNvbi4gVGhlIHJlc3VsdGluZyByZW5kZXJpbmcgaXMgamFycmluZyBhbmQgdW51c2FibGUuXG4gICAgLy8gVGhlIGRyYXdpbmcgcm91dGluZSBtb2RpZmllcyB0aGUgZGF0YSBieSBtZXJnaW5nIHJ1bnMgb2YgY29uc2VjdXRpdmUgYmxvY2tzIGluIGVhY2ggY29tcCBnZW5vbWUuXG4gICAgLy8gVGhlIGRhdGEgY2hhbmdlIGlzIHRvIGluc2VydCBhIGdyb3VwaW5nIGxheWVyIG9uIHRvcCBvZiB0aGUgc2Jsb2Nrcywgc3BlY2lmaWNhbGx5LCBcbiAgICAvLyAgICAgem9vbVN0cmlwX2RhdGEgPSB7IGdlbm9tZSBbIHpvb21CbG9ja19kYXRhIF0gfVxuICAgIC8vIGJlY29tZXNcbiAgICAvLyAgICAgem9vbVN0cmlwX2RhdGEgPSB7IGdlbm9tZSBbIHpvb21TdXBlckJsb2NrX2RhdGEgXSB9XG4gICAgLy8gICAgIHpvb21TdXBlckJsb2NrX2RhdGEgPSB7IGNociBzdGFydCBlbmQgYmxvY2tzIFsgem9vbUJsb2NrX2RhdGEgXSB9XG4gICAgLy9cbiAgICBtdW5nZURhdGEgKGRhdGEpIHtcbiAgICAgICAgZGF0YS5mb3JFYWNoKGdEYXRhID0+IGdEYXRhLmJsb2NrcyA9IHRoaXMudW5pcWlmeUJsb2NrcyhnRGF0YS5ibG9ja3MpKTtcblx0ZGF0YSA9IHRoaXMubWVyZ2VTYmxvY2tSdW5zKGRhdGEpO1xuXHRyZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgem9vbSB2aWV3IHBhbmVsIHdpdGggdGhlIGdpdmVuIGRhdGEuXG4gICAgLy9cbiAgICBkcmF3IChkYXRhKSB7XG4gICAgICAgIGRhdGEgPSB0aGlzLm11bmdlRGF0YShkYXRhKTtcblx0Ly8gXG5cdGxldCBzZWxmID0gdGhpcztcblxuXHRsZXQgY2xvc2VkID0gdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIik7XG5cblx0Ly8gcmVzZXQgdGhlIHN2ZyBzaXplIGJhc2VkIG9uIG51bWJlciBvZiBzdHJpcHNcblx0bGV0IHRvdGFsSGVpZ2h0ID0gKHRoaXMuc3RyaXBIZWlnaHQrdGhpcy5zdHJpcEdhcCkgKiBkYXRhLmxlbmd0aCArIDIwO1xuXHR0aGlzLnN2Z1xuXHQgICAgLmF0dHIoXCJoZWlnaHRcIiwgdG90YWxIZWlnaHQpO1xuXG5cdC8vIERyYXcgdGhlIHRpdGxlIG9uIHRoZSB6b29tdmlldyBwb3NpdGlvbiBjb250cm9sc1xuXHRkMy5zZWxlY3QoXCIjem9vbVZpZXcgLnpvb21Db29yZHMgbGFiZWxcIilcblx0ICAgIC50ZXh0KHRoaXMuYXBwLnJHZW5vbWUubGFiZWwgKyBcIiBjb29yZHNcIik7XG5cdFxuXHQvLyB0aGUgcmVmZXJlbmNlIGdlbm9tZSBibG9jayAoYWx3YXlzIGp1c3QgMSBvZiB0aGVzZSkuXG5cdGxldCByRGF0YSA9IGRhdGEuZmlsdGVyKGRkID0+IGRkLmdlbm9tZSA9PT0gdGhpcy5hcHAuckdlbm9tZSlbMF07XG5cdGxldCByQmxvY2sgPSByRGF0YS5ibG9ja3NbMF07XG5cblx0Ly8geC1zY2FsZSBhbmQgeC1heGlzIGJhc2VkIG9uIHRoZSByZWYgZ2Vub21lIGRhdGEuXG5cdHRoaXMueHNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0ICAgIC5kb21haW4oW3JCbG9jay5zdGFydCxyQmxvY2suZW5kXSlcblx0ICAgIC5yYW5nZShbMCx0aGlzLndpZHRoXSk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gZHJhdyB0aGUgY29vcmRpbmF0ZSBheGlzXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdHRoaXMuYXhpc0Z1bmMgPSBkMy5zdmcuYXhpcygpXG5cdCAgICAuc2NhbGUodGhpcy54c2NhbGUpXG5cdCAgICAub3JpZW50KFwidG9wXCIpXG5cdCAgICAub3V0ZXJUaWNrU2l6ZSgyKVxuXHQgICAgLnRpY2tzKDUpXG5cdCAgICAudGlja1NpemUoNSlcblx0ICAgIDtcblx0dGhpcy5heGlzLmNhbGwodGhpcy5heGlzRnVuYyk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gem9vbSBzdHJpcHMgKG9uZSBwZXIgZ2Vub21lKVxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBsZXQgenN0cmlwcyA9IHRoaXMuc3RyaXBzR3JwXG5cdCAgICAgICAgLnNlbGVjdEFsbChcImcuem9vbVN0cmlwXCIpXG5cdFx0LmRhdGEoZGF0YSwgZCA9PiBkLmdlbm9tZS5uYW1lKTtcblx0Ly8gQ3JlYXRlIHRoZSBncm91cFxuXHRsZXQgbmV3enMgPSB6c3RyaXBzLmVudGVyKClcblx0ICAgICAgICAuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIixcInpvb21TdHJpcFwiKVxuXHRcdC5hdHRyKFwibmFtZVwiLCBkID0+IGQuZ2Vub21lLm5hbWUpXG5cdFx0Lm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGcpIHtcblx0XHQgICAgc2VsZi5oaWdobGlnaHRTdHJpcChnLmdlbm9tZSwgdGhpcyk7XG5cdFx0fSlcblx0XHQuY2FsbCh0aGlzLmRyYWdnZXIpXG5cdFx0O1xuXHQvLyBTdHJpcCBsYWJlbFxuXHRuZXd6cy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgXCJnZW5vbWVMYWJlbFwiKVxuXHQgICAgLnRleHQoIGQgPT4gZC5nZW5vbWUubGFiZWwpXG5cdCAgICAuYXR0cihcInhcIiwgMClcblx0ICAgIC5hdHRyKFwieVwiLCB0aGlzLmJsb2NrSGVpZ2h0LzIgKyAyMClcblx0ICAgIC5hdHRyKFwiZm9udC1mYW1pbHlcIixcInNhbnMtc2VyaWZcIilcblx0ICAgIC5hdHRyKFwiZm9udC1zaXplXCIsIDEwKVxuXHQgICAgO1xuXG5cdG5ld3pzLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBcInNCbG9ja3NcIik7XG5cdG5ld3pzLmFwcGVuZChcInJlY3RcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBcInpvb21TdHJpcEhhbmRsZVwiKVxuXHQgICAgLmF0dHIoXCJ4XCIsIC0xNSlcblx0ICAgIC5hdHRyKFwieVwiLCAtdGhpcy5ibG9ja0hlaWdodCAvIDIpXG5cdCAgICAuYXR0cihcIndpZHRoXCIsIDE1KVxuXHQgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5ibG9ja0hlaWdodClcblx0ICAgIDtcblxuXHR6c3RyaXBzXG5cdCAgICAuY2xhc3NlZChcInJlZmVyZW5jZVwiLCBkID0+IGQuZ2Vub21lID09PSB0aGlzLmFwcC5yR2Vub21lKVxuXHQgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZyA9PiBgdHJhbnNsYXRlKDAsJHtjbG9zZWQgPyB0aGlzLnRvcE9mZnNldCA6IGcuZ2Vub21lLnpvb21ZfSlgKVxuXHQgICAgO1xuICAgICAgICB6c3RyaXBzLmV4aXQoKVxuXHQgICAgLm9uKFwiLmRyYWdcIiwgbnVsbClcblx0ICAgIC5yZW1vdmUoKTtcblxuXHQvLyAtLS0tIFN5bnRlbnkgYmxvY2tzIC0tLS1cbiAgICAgICAgbGV0IHNibG9ja3MgPSB6c3RyaXBzLnNlbGVjdCgnW25hbWU9XCJzQmxvY2tzXCJdJykuc2VsZWN0QWxsKCdnLnNCbG9jaycpXG5cdCAgICAuZGF0YShkPT5kLmJsb2NrcywgYiA9PiBiLmJsb2NrSWQpO1xuXHRsZXQgbmV3c2JzID0gc2Jsb2Nrcy5lbnRlcigpXG5cdCAgICAuYXBwZW5kKFwiZ1wiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBiID0+IFwic0Jsb2NrIFwiICsgXG5cdCAgICAgICAgKGIub3JpPT09XCIrXCIgPyBcInBsdXNcIiA6IGIub3JpPT09XCItXCIgPyBcIm1pbnVzXCI6IFwiY29uZnVzZWRcIikgKyBcblx0XHQoYi5jaHIgIT09IGIuZkNociA/IFwiIHRyYW5zbG9jYXRpb25cIiA6IFwiXCIpKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGI9PmIuaW5kZXgpXG5cdCAgICA7XG5cdGxldCBsMCA9IG5ld3Nicy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsIFwibGF5ZXIwXCIpO1xuXHRsZXQgbDEgPSBuZXdzYnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLCBcImxheWVyMVwiKTtcblxuXHQvL1xuXHR0aGlzLm9yZGVyU0Jsb2NrcyhzYmxvY2tzKTtcblxuXHQvLyByZWN0YW5nbGUgZm9yIGVhY2ggc3ludGVueSBibG9ja1xuXHRsZXQgc2JyZWN0cyA9IHNibG9ja3Muc2VsZWN0KCdnW25hbWU9XCJsYXllcjBcIl0nKS5zZWxlY3RBbGwoJ3JlY3QuYmxvY2snKS5kYXRhKGQ9PiB7XG5cdCAgICBkLnNibG9ja3MuZm9yRWFjaChiPT5iLnhzY2FsZSA9IGQueHNjYWxlKTtcblx0ICAgIHJldHVybiBkLnNibG9ja3Ncblx0ICAgIH0sIHNiPT5zYi5pbmRleCk7XG4gICAgICAgIHNicmVjdHMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBiID0+IFwiYmxvY2sgXCIgKyBcblx0ICAgICAgICAoYi5vcmk9PT1cIitcIiA/IFwicGx1c1wiIDogYi5vcmk9PT1cIi1cIiA/IFwibWludXNcIjogXCJjb25mdXNlZFwiKSArIFxuXHRcdChiLmNociAhPT0gYi5mQ2hyID8gXCIgdHJhbnNsb2NhdGlvblwiIDogXCJcIikpXG5cdCAgICA7XG5cdHNicmVjdHNcblx0ICAuYXR0cihcInhcIiwgICAgIGIgPT4gYi54c2NhbGUoYi5mbGlwID8gYi5lbmQgOiBiLnN0YXJ0KSlcblx0ICAuYXR0cihcInlcIiwgICAgIGIgPT4gLXRoaXMuYmxvY2tIZWlnaHQgLyAyKVxuXHQgIC5hdHRyKFwid2lkdGhcIiwgYiA9PiBNYXRoLm1heCg0LCBNYXRoLmFicyhiLnhzY2FsZShiLmVuZCktYi54c2NhbGUoYi5zdGFydCkpKSlcblx0ICAuYXR0cihcImhlaWdodFwiLHRoaXMuYmxvY2tIZWlnaHQpO1xuXHQgIDtcblx0c2JyZWN0cy5leGl0KCkucmVtb3ZlKCk7XG5cblx0Ly8gdGhlIGF4aXMgbGluZVxuXHRsMC5hcHBlbmQoXCJsaW5lXCIpLmF0dHIoXCJjbGFzc1wiLFwiYXhpc1wiKTtcblx0XG5cdHNibG9ja3Muc2VsZWN0KFwibGluZS5heGlzXCIpXG5cdCAgICAuYXR0cihcIngxXCIsIGIgPT4gYi54c2NhbGUoYi5zdGFydCkpXG5cdCAgICAuYXR0cihcInkxXCIsIDApXG5cdCAgICAuYXR0cihcIngyXCIsIGIgPT4gYi54c2NhbGUoYi5lbmQpKVxuXHQgICAgLmF0dHIoXCJ5MlwiLCAwKVxuXHQgICAgO1xuXHQvLyBsYWJlbFxuXHRsMC5hcHBlbmQoXCJ0ZXh0XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJibG9ja0xhYmVsXCIpIDtcblx0Ly8gYnJ1c2hcblx0bDAuYXBwZW5kKFwiZ1wiKS5hdHRyKFwiY2xhc3NcIixcImJydXNoXCIpO1xuXG5cdC8vXG5cdHNibG9ja3MuZXhpdCgpLnJlbW92ZSgpO1xuXG5cdC8vIHN5bnRlbnkgYmxvY2sgbGFiZWxzXG5cdHNibG9ja3Muc2VsZWN0KFwidGV4dC5ibG9ja0xhYmVsXCIpXG5cdCAgICAudGV4dCggYiA9PiBiLmNociApXG5cdCAgICAuYXR0cihcInhcIiwgYiA9PiAoYi54c2NhbGUoYi5zdGFydCkgKyBiLnhzY2FsZShiLmVuZCkpLzIgKVxuXHQgICAgLmF0dHIoXCJ5XCIsIHRoaXMuYmxvY2tIZWlnaHQgLyAyICsgMTApXG5cdCAgICA7XG5cblx0Ly8gYnJ1c2hcblx0c2Jsb2Nrcy5zZWxlY3QoXCJnLmJydXNoXCIpXG5cdCAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBiID0+IGB0cmFuc2xhdGUoMCwke3RoaXMuYmxvY2tIZWlnaHQgLyAyfSlgKVxuXHQgICAgLmVhY2goZnVuY3Rpb24oYikge1xuXHRcdGlmICghYi5icnVzaCkge1xuXHRcdCAgICBiLmJydXNoID0gZDMuc3ZnLmJydXNoKClcblx0XHRcdC5vbihcImJydXNoc3RhcnRcIiwgZnVuY3Rpb24oKXsgc2VsZi5iYlN0YXJ0KCBiLCB0aGlzICk7IH0pXG5cdFx0XHQub24oXCJicnVzaGVuZFwiLCAgIGZ1bmN0aW9uKCl7IHNlbGYuYmJFbmQoIGIsIHRoaXMgKTsgfSlcblx0XHR9XG5cdFx0Yi5icnVzaC54KGIueHNjYWxlKS5jbGVhcigpO1xuXHRcdGQzLnNlbGVjdCh0aGlzKS5jYWxsKGIuYnJ1c2gpO1xuXHQgICAgfSlcblx0ICAgIC5zZWxlY3RBbGwoXCJyZWN0XCIpXG5cdFx0LmF0dHIoXCJoZWlnaHRcIiwgMTApO1xuXG5cdHRoaXMuZHJhd0ZlYXR1cmVzKHNibG9ja3MpO1xuXG5cdC8vXG5cdHRoaXMuYXBwLmZhY2V0TWFuYWdlci5hcHBseUFsbCgpO1xuXG5cdC8vIFdlIG5lZWQgdG8gbGV0IHRoZSB2aWV3IHJlbmRlciBiZWZvcmUgZG9pbmcgdGhlIGhpZ2hsaWdodGluZywgc2luY2UgaXQgZGVwZW5kcyBvblxuXHQvLyB0aGUgcG9zaXRpb25zIG9mIHJlY3RhbmdsZXMgaW4gdGhlIHNjZW5lLlxuXHR3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG5cdCAgICAvL3RoaXMuc2V0R2Vub21lWU9yZGVyKCB0aGlzLmdlbm9tZXMubWFwKGcgPT4gZy5uYW1lKSApO1xuXHQgICAgLy93aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLmhpZ2hsaWdodCgpLCA1MCk7XG5cdCAgICB0aGlzLmhpZ2hsaWdodCgpO1xuXHR9LCA1MCk7XG4gICAgfTtcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSBmZWF0dXJlcyAocmVjdGFuZ2xlcykgZm9yIHRoZSBzcGVjaWZpZWQgc3ludGVueSBibG9ja3MuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgc2Jsb2NrcyAoRDMgc2VsZWN0aW9uIG9mIGcuc2Jsb2NrIG5vZGVzKSAtIG11bHRpbGV2ZWwgc2VsZWN0aW9uLlxuICAgIC8vICAgICAgICBBcnJheSAoY29ycmVzcG9uZGluZyB0byBzdHJpcHMpIG9mIGFycmF5cyBvZiBzeW50ZW55IGJsb2Nrcy5cbiAgICAvL1xuICAgIGRyYXdGZWF0dXJlcyAoc2Jsb2Nrcykge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdC8vXG5cdC8vIG5ldmVyIGRyYXcgdGhlIHNhbWUgZmVhdHVyZSB0d2ljZVxuXHRsZXQgZHJhd24gPSBuZXcgU2V0KCk7XHQvLyBzZXQgb2YgbWdwaWRzIG9mIGRyYXduIGZlYXR1cmVzXG5cdGxldCBmaWx0ZXJEcmF3biA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICAvLyByZXR1cm5zIHRydWUgaWYgd2UndmUgbm90IHNlZW4gdGhpcyBvbmUgYmVmb3JlLlxuXHQgICAgLy8gcmVnaXN0ZXJzIHRoYXQgd2UndmUgc2VlbiBpdC5cblx0ICAgIGxldCBmaWQgPSBmLm1ncGlkO1xuXHQgICAgbGV0IHYgPSAhIGRyYXduLmhhcyhmaWQpO1xuXHQgICAgZHJhd24uYWRkKGZpZCk7XG5cdCAgICByZXR1cm4gdjtcblx0fTtcblx0bGV0IGZlYXRzID0gc2Jsb2Nrcy5zZWxlY3QoJ1tuYW1lPVwibGF5ZXIxXCJdJykuc2VsZWN0QWxsKFwiLmZlYXR1cmVcIilcblx0ICAgIC5kYXRhKGQ9PmQuZmVhdHVyZXMuZmlsdGVyKGZpbHRlckRyYXduKSwgZD0+ZC5tZ3BpZCk7XG5cdGZlYXRzLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0bGV0IG5ld0ZlYXRzID0gZmVhdHMuZW50ZXIoKS5hcHBlbmQoXCJyZWN0XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsIGYgPT4gXCJmZWF0dXJlXCIgKyAoZi5zdHJhbmQ9PT1cIi1cIiA/IFwiIG1pbnVzXCIgOiBcIiBwbHVzXCIpKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGYgPT4gZi5tZ3BpZClcblx0ICAgIC5zdHlsZShcImZpbGxcIiwgZiA9PiBzZWxmLmFwcC5jc2NhbGUoZi5nZXRNdW5nZWRUeXBlKCkpKVxuXHQgICAgO1xuXG5cdC8vIGRyYXcgdGhlIHJlY3RhbmdsZXNcblxuXHQvLyByZXR1cm5zIHRoZSBzeW50ZW55IGJsb2NrIGNvbnRhaW5pbmcgdGhpcyBmZWF0dXJlXG5cdGxldCBmQmxvY2sgPSBmdW5jdGlvbiAoZmVhdEVsdCkge1xuXHQgICAgbGV0IGJsa0VsdCA9IGZlYXRFbHQucGFyZW50Tm9kZTtcblx0ICAgIHJldHVybiBibGtFbHQuX19kYXRhX187XG5cdH1cblx0bGV0IGZ4ID0gZnVuY3Rpb24oZikge1xuXHQgICAgbGV0IGIgPSBmQmxvY2sodGhpcyk7XG5cdCAgICByZXR1cm4gYi54c2NhbGUoTWF0aC5tYXgoZi5zdGFydCxiLnN0YXJ0KSlcblx0fTtcblx0bGV0IGZ3ID0gZnVuY3Rpb24gKGYpIHtcblx0ICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgcmV0dXJuIE1hdGguYWJzKGIueHNjYWxlKE1hdGgubWluKGYuZW5kLGIuZW5kKSkgLSBiLnhzY2FsZShNYXRoLm1heChmLnN0YXJ0LGIuc3RhcnQpKSkgKyAxO1xuXHR9O1xuXHRsZXQgZnkgPSBmdW5jdGlvbiAoZikge1xuXHQgICAgICAgbGV0IGIgPSBmQmxvY2sodGhpcyk7XG5cdCAgICAgICBpZiAoZi5zdHJhbmQgPT0gXCIrXCIpe1xuXHRcdCAgIGlmIChiLmZsaXApIFxuXHRcdCAgICAgICByZXR1cm4gc2VsZi5sYW5lSGVpZ2h0KmYubGFuZSAtIHNlbGYuZmVhdEhlaWdodDsgXG5cdFx0ICAgZWxzZSBcblx0XHQgICAgICAgcmV0dXJuIC1zZWxmLmxhbmVIZWlnaHQqZi5sYW5lO1xuXHQgICAgICAgfVxuXHQgICAgICAgZWxzZSB7XG5cdFx0ICAgLy8gZi5sYW5lIGlzIG5lZ2F0aXZlIGZvciBcIi1cIiBzdHJhbmRcblx0XHQgICBpZiAoYi5mbGlwKSBcblx0XHQgICAgICAgcmV0dXJuIHNlbGYubGFuZUhlaWdodCpmLmxhbmU7XG5cdFx0ICAgZWxzZVxuXHRcdCAgICAgICByZXR1cm4gLXNlbGYubGFuZUhlaWdodCpmLmxhbmUgLSBzZWxmLmZlYXRIZWlnaHQ7IFxuXHQgICAgICAgfVxuXHQgICB9O1xuXG5cdGZlYXRzXG5cdCAgLmF0dHIoXCJ4XCIsIGZ4KVxuXHQgIC5hdHRyKFwid2lkdGhcIiwgZncpXG5cdCAgLmF0dHIoXCJ5XCIsIGZ5KVxuXHQgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMuZmVhdEhlaWdodClcblx0ICA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyBmZWF0dXJlIGhpZ2hsaWdodGluZyBpbiB0aGUgY3VycmVudCB6b29tIHZpZXcuXG4gICAgLy8gRmVhdHVyZXMgdG8gYmUgaGlnaGxpZ2h0ZWQgaW5jbHVkZSB0aG9zZSBpbiB0aGUgaGlGZWF0cyBsaXN0IHBsdXMgdGhlIGZlYXR1cmVcbiAgICAvLyBjb3JyZXNwb25kaW5nIHRvIHRoZSByZWN0YW5nbGUgYXJndW1lbnQsIGlmIGdpdmVuLiAoVGhlIG1vdXNlb3ZlciBmZWF0dXJlLilcbiAgICAvL1xuICAgIC8vIERyYXdzIGZpZHVjaWFscyBmb3IgZmVhdHVyZXMgaW4gdGhpcyBsaXN0IHRoYXQ6XG4gICAgLy8gMS4gb3ZlcmxhcCB0aGUgY3VycmVudCB6b29tVmlldyBjb29yZCByYW5nZVxuICAgIC8vIDIuIGFyZSBub3QgcmVuZGVyZWQgaW52aXNpYmxlIGJ5IGN1cnJlbnQgZmFjZXQgc2V0dGluZ3NcbiAgICAvL1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgY3VycmVudCAocmVjdCBlbGVtZW50KSBPcHRpb25hbC4gQWRkJ2wgcmVjdGFuZ2xlIGVsZW1lbnQsIGUuZy4sIHRoYXQgd2FzIG1vdXNlZC1vdmVyLiBIaWdobGlnaHRpbmdcbiAgICAvLyAgICAgICAgd2lsbCBpbmNsdWRlIHRoZSBmZWF0dXJlIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyByZWN0IGFsb25nIHdpdGggdGhvc2UgaW4gdGhlIGhpZ2hsaWdodCBsaXN0LlxuICAgIC8vICAgIHB1bHNlQ3VycmVudCAoYm9vbGVhbikgSWYgdHJ1ZSBhbmQgY3VycmVudCBpcyBnaXZlbiwgY2F1c2UgaXQgdG8gcHVsc2UgYnJpZWZseS5cbiAgICAvL1xuICAgIGhpZ2hsaWdodCAoY3VycmVudCwgcHVsc2VDdXJyZW50KSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0Ly8gY3VycmVudCBmZWF0dXJlXG5cdGxldCBjdXJyRmVhdCA9IGN1cnJlbnQgPyAoY3VycmVudCBpbnN0YW5jZW9mIEZlYXR1cmUgPyBjdXJyZW50IDogY3VycmVudC5fX2RhdGFfXykgOiBudWxsO1xuXHQvLyBjcmVhdGUgbG9jYWwgY29weSBvZiBoaUZlYXRzLCB3aXRoIGN1cnJlbnQgZmVhdHVyZSBhZGRlZFxuXHRsZXQgaGlGZWF0cyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuaGlGZWF0cyk7XG5cdGlmIChjdXJyRmVhdCkge1xuXHQgICAgaGlGZWF0c1tjdXJyRmVhdC5pZF0gPSBjdXJyRmVhdC5pZDtcblx0fVxuXG5cdC8vIEZpbHRlciBhbGwgZmVhdHVyZXMgKHJlY3RhbmdsZXMpIGluIHRoZSBzY2VuZSBmb3IgdGhvc2UgYmVpbmcgaGlnaGxpZ2h0ZWQuXG5cdC8vIEFsb25nIHRoZSB3YXksIGJ1aWxkIGluZGV4IG1hcHBpbmcgZmVhdHVyZSBpZCB0byBpdHMgXCJzdGFja1wiIG9mIGVxdWl2YWxlbnQgZmVhdHVyZXMsXG5cdC8vIGkuZS4gYSBsaXN0IG9mIGl0cyBnZW5vbG9ncyBzb3J0ZWQgYnkgeSBjb29yZGluYXRlLlxuXHQvLyBBbHNvLCBtYWtlIGVhY2ggaGlnaGxpZ2h0ZWQgZmVhdHVyZSB0YWxsZXIgKHNvIGl0IHN0YW5kcyBhYm92ZSBpdHMgbmVpZ2hib3JzKVxuXHQvLyBhbmQgZ2l2ZSBpdCB0aGUgXCIuaGlnaGxpZ2h0XCIgY2xhc3MuXG5cdC8vXG5cdHRoaXMuc3RhY2tzID0ge307IC8vIGZpZCAtPiBbIHJlY3RzIF0gXG5cdGxldCBkaCA9IHRoaXMuYmxvY2tIZWlnaHQvMiAtIHRoaXMuZmVhdEhlaWdodDtcbiAgICAgICAgbGV0IGZlYXRzID0gdGhpcy5zdmdNYWluLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpXG5cdCAgLy8gZmlsdGVyIHJlY3QuZmVhdHVyZXMgZm9yIHRob3NlIGluIHRoZSBoaWdobGlnaHQgbGlzdFxuXHQgIC5maWx0ZXIoZnVuY3Rpb24oZmYpe1xuXHQgICAgICAvLyBoaWdobGlnaHQgZmYgaWYgZWl0aGVyIGlkIGlzIGluIHRoZSBsaXN0IEFORCBpdCdzIG5vdCBiZWVuIGhpZGRlblxuXHQgICAgICBsZXQgbWdpID0gaGlGZWF0c1tmZi5tZ2lpZF07XG5cdCAgICAgIGxldCBtZ3AgPSBoaUZlYXRzW2ZmLm1ncGlkXTtcblx0ICAgICAgbGV0IHNob3dpbmcgPSBkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJkaXNwbGF5XCIpICE9PSBcIm5vbmVcIjtcblx0ICAgICAgbGV0IGhsID0gc2hvd2luZyAmJiAobWdpIHx8IG1ncCk7XG5cdCAgICAgIGlmIChobCkge1xuXHRcdCAgLy8gZm9yIGVhY2ggaGlnaGxpZ2h0ZWQgZmVhdHVyZSwgYWRkIGl0cyByZWN0YW5nbGUgdG8gdGhlIGxpc3Rcblx0XHQgIGxldCBrID0gZmYuaWQ7XG5cdFx0ICBpZiAoIXNlbGYuc3RhY2tzW2tdKSBzZWxmLnN0YWNrc1trXSA9IFtdXG5cdFx0ICBzZWxmLnN0YWNrc1trXS5wdXNoKHRoaXMpXG5cdCAgICAgIH1cblx0ICAgICAgLy8gXG5cdCAgICAgIGQzLnNlbGVjdCh0aGlzKVxuXHRcdCAgLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgaGwpXG5cdFx0ICAuY2xhc3NlZChcImN1cnJlbnRcIiwgaGwgJiYgY3VyckZlYXQgJiYgdGhpcy5fX2RhdGFfXy5pZCA9PT0gY3VyckZlYXQuaWQpXG5cdFx0ICAuY2xhc3NlZChcImV4dHJhXCIsIHB1bHNlQ3VycmVudCAmJiBmZiA9PT0gY3VyckZlYXQpXG5cdCAgICAgIHJldHVybiBobDtcblx0ICB9KVxuXHQgIDtcblxuXHR0aGlzLmRyYXdGaWR1Y2lhbHMoY3VyckZlYXQpO1xuXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgcG9seWdvbnMgdGhhdCBjb25uZWN0IGhpZ2hsaWdodGVkIGZlYXR1cmVzIGluIHRoZSB2aWV3XG4gICAgLy8gQXJnczpcbiAgICAvLyAgIGRhdGEgOiBsaXN0IG9mIHtcbiAgICAvLyAgICAgICBmaWQ6IGZlYXR1cmUtaWQsIFxuICAgIC8vICAgICAgIGNsczogZXh0cmEgY2xhc3MgZm9yIC5mZWF0dXJlTWFyayBncm91cCxcbiAgICAvLyAgICAgICByZWN0czogbGlzdCBvZiBbcmVjdDEscmVjdDJdIHBhaXJzLCBcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICBjdXJyRmVhdCA6IGN1cnJlbnQgKG1vdXNlb3ZlcikgZmVhdHVyZSAoaWYgYW55KVxuICAgIC8vXG4gICAgZHJhd0ZpZHVjaWFscyAoY3VyckZlYXQpIHtcblx0Ly8gYnVpbGQgZGF0YSBhcnJheSBmb3IgZHJhd2luZyBmaWR1Y2lhbHMgYmV0d2VlbiBlcXVpdmFsZW50IGZlYXR1cmVzXG5cdGxldCBkYXRhID0gW107XG5cdGZvciAobGV0IGsgaW4gdGhpcy5zdGFja3MpIHtcblx0ICAgIC8vIGZvciBlYWNoIGhpZ2hsaWdodGVkIGZlYXR1cmUsIHNvcnQgdGhlIHJlY3RhbmdsZXMgaW4gaXRzIGxpc3QgYnkgWS1jb29yZGluYXRlXG5cdCAgICBsZXQgcmVjdHMgPSB0aGlzLnN0YWNrc1trXTtcblx0ICAgIHJlY3RzLnNvcnQoIChhLGIpID0+IHBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJ5XCIpKSAtIHBhcnNlRmxvYXQoYi5nZXRBdHRyaWJ1dGUoXCJ5XCIpKSApO1xuXHQgICAgcmVjdHMuc29ydCggKGEsYikgPT4ge1xuXHRcdHJldHVybiBhLl9fZGF0YV9fLmdlbm9tZS56b29tWSAtIGIuX19kYXRhX18uZ2Vub21lLnpvb21ZO1xuXHQgICAgfSk7XG5cdCAgICAvLyBXYW50IGEgcG9seWdvbiBiZXR3ZWVuIGVhY2ggc3VjY2Vzc2l2ZSBwYWlyIG9mIGl0ZW1zLiBUaGUgZm9sbG93aW5nIGNyZWF0ZXMgYSBsaXN0IG9mXG5cdCAgICAvLyBuIHBhaXJzLCB3aGVyZSByZWN0W2ldIGlzIHBhaXJlZCB3aXRoIHJlY3RbaSsxXS4gVGhlIGxhc3QgcGFpciBjb25zaXN0cyBvZiB0aGUgbGFzdFxuXHQgICAgLy8gcmVjdGFuZ2xlIHBhaXJlZCB3aXRoIHVuZGVmaW5lZC4gKFdlIHdhbnQgdGhpcy4pXG5cdCAgICBsZXQgcGFpcnMgPSByZWN0cy5tYXAoKHIsIGkpID0+IFtyLHJlY3RzW2krMV1dKTtcblx0ICAgIC8vIEFkZCBhIGNsYXNzIChcImN1cnJlbnRcIikgZm9yIHRoZSBwb2x5Z29ucyBhc3NvY2lhdGVkIHdpdGggdGhlIG1vdXNlb3ZlciBmZWF0dXJlIHNvIHRoZXlcblx0ICAgIC8vIGNhbiBiZSBkaXN0aW5ndWlzaGVkIGZyb20gb3RoZXJzLlxuXHQgICAgZGF0YS5wdXNoKHsgZmlkOiBrLCByZWN0czogcGFpcnMsIGNsczogKGN1cnJGZWF0ICYmIGN1cnJGZWF0LmlkID09PSBrID8gJ2N1cnJlbnQnIDogJycpIH0pO1xuXHR9XG5cblx0bGV0IHNlbGYgPSB0aGlzO1xuXHQvL1xuXHQvLyBwdXQgZmlkdWNpYWwgbWFya3MgaW4gdGhlaXIgb3duIGdyb3VwIFxuXHRsZXQgZkdycCA9IHRoaXMuZmlkdWNpYWxzLmNsYXNzZWQoXCJoaWRkZW5cIiwgZmFsc2UpO1xuXG5cdC8vIEJpbmQgZmlyc3QgbGV2ZWwgZGF0YSB0byBcImZlYXR1cmVNYXJrc1wiIGdyb3Vwc1xuXHRsZXQgZmZHcnBzID0gZkdycC5zZWxlY3RBbGwoXCJnLmZlYXR1cmVNYXJrc1wiKVxuXHQgICAgLmRhdGEoZGF0YSwgZCA9PiBkLmZpZCk7XG5cdGZmR3Jwcy5lbnRlcigpLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBkID0+IGQuZmlkKTtcblx0ZmZHcnBzLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0ZmZHcnBzLmF0dHIoXCJjbGFzc1wiLGQgPT4gXCJmZWF0dXJlTWFya3MgXCIgKyAoZC5jbHMgfHwgXCJcIikpXG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBEcmF3IHRoZSBjb25uZWN0b3IgcG9seWdvbnMuXG5cdC8vIEJpbmQgc2Vjb25kIGxldmVsIGRhdGEgKHJlY3RhbmdsZSBwYWlycykgdG8gcG9seWdvbnMgaW4gdGhlIGdyb3VwXG5cdGxldCBwZ29ucyA9IGZmR3Jwcy5zZWxlY3RBbGwoXCJwb2x5Z29uXCIpXG5cdCAgICAuZGF0YShkPT5kLnJlY3RzLmZpbHRlcihyID0+IHJbMF0gJiYgclsxXSkpO1xuXHRwZ29ucy5leGl0KCkucmVtb3ZlKCk7XG5cdHBnb25zLmVudGVyKCkuYXBwZW5kKFwicG9seWdvblwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwiZmlkdWNpYWxcIilcblx0ICAgIDtcblx0Ly9cblx0cGdvbnMuYXR0cihcInBvaW50c1wiLCByID0+IHtcblx0ICAgIC8vIHBvbHlnb24gY29ubmVjdHMgYm90dG9tIGNvcm5lcnMgb2YgMXN0IHJlY3QgdG8gdG9wIGNvcm5lcnMgb2YgMm5kIHJlY3Rcblx0ICAgIGxldCBjMSA9IGNvb3Jkc0FmdGVyVHJhbnNmb3JtKHJbMF0pOyAvLyB0cmFuc2Zvcm0gY29vcmRzIGZvciAxc3QgcmVjdFxuXHQgICAgbGV0IGMyID0gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0oclsxXSk7ICAvLyB0cmFuc2Zvcm0gY29vcmRzIGZvciAybmQgcmVjdFxuXHQgICAgci50Y29vcmRzID0gW2MxLGMyXTtcblx0ICAgIC8vIGZvdXIgcG9seWdvbiBwb2ludHNcblx0ICAgIGxldCBzID0gYCR7YzEueH0sJHtjMS55K2MxLmhlaWdodH0gJHtjMi54fSwke2MyLnl9ICR7YzIueCtjMi53aWR0aH0sJHtjMi55fSAke2MxLngrYzEud2lkdGh9LCR7YzEueStjMS5oZWlnaHR9YFxuXHQgICAgcmV0dXJuIHM7XG5cdH0pXG5cdC8vXG5cdC8vIG1vdXNpbmcgb3ZlciB0aGUgZmlkdWNpYWwgaGlnaGxpZ2h0cyAoYXMgaWYgdGhlIHVzZXIgaGFkIG1vdXNlZCBvdmVyIHRoZSBmZWF0dXJlIGl0c2VsZilcblx0Lm9uKFwibW91c2VvdmVyXCIsIChwKSA9PiB7XG5cdCAgICB0aGlzLmhpZ2hsaWdodChwWzBdKTtcblx0fSlcblx0Lm9uKFwibW91c2VvdXRcIiwgIChwKSA9PiB7XG5cdCAgICB0aGlzLmhpZ2hsaWdodCgpO1xuXHR9KTtcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBEcmF3IGZlYXR1cmUgbGFiZWxzLiBFYWNoIGxhYmVsIGlzIGRyYXduIG9uY2UsIGFib3ZlIHRoZSBmaXJzdCByZWN0YW5nbGUgaW4gaXRzIGxpc3QuXG5cdC8vIFRoZSBleGNlcHRpb24gaXMgdGhlIGN1cnJlbnQgKG1vdXNlb3ZlcikgZmVhdHVyZSwgd2hlcmUgdGhlIGxhYmVsIGlzIGRyYXduIGFib3ZlIHRoYXQgZmVhdHVyZS5cblx0bGV0IGxhYmVscyA9IGZmR3Jwcy5zZWxlY3RBbGwoJ3RleHQuZmVhdExhYmVsJylcblx0ICAgIC5kYXRhKGQgPT4ge1xuXHRcdGxldCByID0gZC5yZWN0c1swXVswXTtcblx0XHRpZiAoY3VyckZlYXQgJiYgKGQuZmlkID09PSBjdXJyRmVhdC5JRCB8fCBkLmZpZCA9PT0gY3VyckZlYXQuY2Fub25pY2FsKSl7XG5cdFx0ICAgIGxldCByMiA9IHIgPSBkLnJlY3RzLm1hcCggcnIgPT5cblx0XHQgICAgICAgcnJbMF0uX19kYXRhX18gPT09IGN1cnJGZWF0ID8gcnJbMF0gOiByclsxXSYmcnJbMV0uX19kYXRhX18gPT09IGN1cnJGZWF0ID8gcnJbMV0gOiBudWxsXG5cdFx0ICAgICAgICkuZmlsdGVyKHg9PngpWzBdO1xuXHRcdCAgICByID0gcjIgPyByMiA6IHI7XG5cdFx0fVxuXHQgICAgICAgIHJldHVybiBbe1xuXHRcdCAgICBmaWQ6IGQuZmlkLFxuXHRcdCAgICByZWN0OiByLFxuXHRcdCAgICB0cmVjdDogY29vcmRzQWZ0ZXJUcmFuc2Zvcm0ocilcblx0XHR9XTtcblx0ICAgIH0pO1xuXG5cdC8vIERyYXcgdGhlIHRleHQuXG5cdGxhYmVscy5lbnRlcigpLmFwcGVuZCgndGV4dCcpLmF0dHIoJ2NsYXNzJywnZmVhdExhYmVsJyk7XG5cdGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XG5cdGxhYmVsc1xuXHQgIC5hdHRyKFwieFwiLCBkID0+IGQudHJlY3QueCArIGQudHJlY3Qud2lkdGgvMiApXG5cdCAgLmF0dHIoXCJ5XCIsIGQgPT4gZC5yZWN0Ll9fZGF0YV9fLmdlbm9tZS56b29tWSAtIDMpXG5cdCAgLnRleHQoZCA9PiB7XG5cdCAgICAgICBsZXQgZiA9IGQucmVjdC5fX2RhdGFfXztcblx0ICAgICAgIGxldCBzeW0gPSBmLnN5bWJvbCB8fCBmLm1ncGlkO1xuXHQgICAgICAgcmV0dXJuIHN5bTtcblx0ICB9KTtcblxuXHQvLyBQdXQgYSByZWN0YW5nbGUgYmVoaW5kIGVhY2ggbGFiZWwgYXMgYSBiYWNrZ3JvdW5kXG5cdGxldCBsYmxCb3hEYXRhID0gbGFiZWxzLm1hcChsYmwgPT4gbGJsWzBdLmdldEJCb3goKSlcblx0bGV0IGxibEJveGVzID0gZmZHcnBzLnNlbGVjdEFsbCgncmVjdC5mZWF0TGFiZWxCb3gnKVxuXHQgICAgLmRhdGEoKGQsaSkgPT4gW2xibEJveERhdGFbaV1dKTtcblx0bGJsQm94ZXMuZW50ZXIoKS5pbnNlcnQoJ3JlY3QnLCd0ZXh0JykuYXR0cignY2xhc3MnLCdmZWF0TGFiZWxCb3gnKTtcblx0bGJsQm94ZXMuZXhpdCgpLnJlbW92ZSgpO1xuXHRsYmxCb3hlc1xuXHQgICAgLmF0dHIoXCJ4XCIsICAgICAgYmIgPT4gYmIueC0yKVxuXHQgICAgLmF0dHIoXCJ5XCIsICAgICAgYmIgPT4gYmIueS0xKVxuXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCAgYmIgPT4gYmIud2lkdGgrNClcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGJiID0+IGJiLmhlaWdodCsyKVxuXHQgICAgO1xuXHRcblx0Ly8gaWYgdGhlcmUgaXMgYSBjdXJyRmVhdCwgbW92ZSBpdHMgZmlkdWNpYWxzIHRvIHRoZSBlbmQgKHNvIHRoZXkncmUgb24gdG9wIG9mIGV2ZXJ5b25lIGVsc2UpXG5cdGlmIChjdXJyRmVhdCkge1xuXHQgICAgLy8gZ2V0IGxpc3Qgb2YgZ3JvdXAgZWxlbWVudHMgZnJvbSB0aGUgZDMgc2VsZWN0aW9uXG5cdCAgICBsZXQgZmZMaXN0ID0gZmZHcnBzWzBdO1xuXHQgICAgLy8gZmluZCB0aGUgb25lIHdob3NlIGZlYXR1cmUgaXMgY3VyckZlYXRcblx0ICAgIGxldCBpID0gLTE7XG5cdCAgICBmZkxpc3QuZm9yRWFjaCggKGcsaikgPT4geyBpZiAoZy5fX2RhdGFfXy5maWQgPT09IGN1cnJGZWF0LmlkKSBpID0gajsgfSk7XG5cdCAgICAvLyBpZiB3ZSBmb3VuZCBpdCBhbmQgaXQncyBub3QgYWxyZWFkeSB0aGUgbGFzdCwgbW92ZSBpdCB0byB0aGVcblx0ICAgIC8vIGxhc3QgcG9zaXRpb24gYW5kIHJlb3JkZXIgaW4gdGhlIERPTS5cblx0ICAgIGlmIChpID49IDApIHtcblx0XHRsZXQgbGFzdGkgPSBmZkxpc3QubGVuZ3RoIC0gMTtcblx0ICAgICAgICBsZXQgeCA9IGZmTGlzdFtpXTtcblx0XHRmZkxpc3RbaV0gPSBmZkxpc3RbbGFzdGldO1xuXHRcdGZmTGlzdFtsYXN0aV0gPSB4O1xuXHRcdGZmR3Jwcy5vcmRlcigpO1xuXHQgICAgfVxuXHR9XG5cdFxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWRlRmlkdWNpYWxzICgpIHtcblx0dGhpcy5zdmdNYWluLnNlbGVjdChcImcuZmlkdWNpYWxzXCIpXG5cdCAgICAuY2xhc3NlZChcImhpZGRlblwiLCB0cnVlKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBab29tVmlld1xuXG5leHBvcnQgeyBab29tVmlldyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvWm9vbVZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=