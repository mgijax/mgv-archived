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
	this.queryManager = new __WEBPACK_IMPORTED_MODULE_4__QueryManager__["a" /* QueryManager */](this, "#findGenesBox");
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
	if (typeof(c.flank) === 'number'){
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
	//console.log("Set context (raw):", c);
	//console.log("Set context (sanitized):", cfg);
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
		chromosome: cfg.chr,
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
					// want case insensitive searches, so keys are lower cased
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
		let s = f.symbol.toLowerCase();
		let lst = this.symbol2feats[s] = (this.symbol2feats[s] || []);
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
	let feats = f ? [f] : this.canonical2feats[label] || this.symbol2feats[label.toLowerCase()] || [];
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
// Not sure where this should go
let searchTypes = [{
    method: "featuresByPhenotype",
    label: "...by phenotype or disease",
    template: "",
    placeholder: "Pheno/disease (MP/DO) term or IDs"
},{
    method: "featuresByFunction",
    label: "...by cellular function",
    template: "",
    placeholder: "Gene Ontology (GO) terms or IDs"
},{
    method: "featuresByPathway",
    label: "...by pathway",
    template: "",
    placeholder: "Reactome pathways names, IDs"
},{
    method: "featuresById",
    label: "...by nomenclature",
    template: "",
    placeholder: "MGI names, synonyms, etc."
}];
// ---------------------------------------------
class QueryManager extends __WEBPACK_IMPORTED_MODULE_1__Component__["a" /* Component */] {
    constructor (app, elt) {
        super(app, elt);
	this.cfg = searchTypes;
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
	    constraintLogic="A and B and C">
		<constraint code="A" path="SequenceFeature" op="LOOKUP" value="${qryString}"/>
		<constraint code="B" path="SequenceFeature.organism.taxonId" op="=" value="10090"/>
		<constraint code="C" path="SequenceFeature.sequenceOntologyTerm.name" op="!=" value="transgene"/>
	    </query>`;
	return this.getAuxData(q);
    }
    //----------------------------------------------
    featuresByOntologyTerm (qryString, termTypes) {
        let q = `<query name="" model="genomic" 
	  view="SequenceFeature.primaryIdentifier SequenceFeature.symbol" constraintLogic="A and B and C and D">
	      <constraint code="A" path="SequenceFeature.ontologyAnnotations.ontologyTerm.parents" op="LOOKUP" value="*${qryString}*"/>
	      <constraint code="B" path="SequenceFeature.organism.taxonId" op="=" value="10090"/>
	      <constraint code="C" path="SequenceFeature.sequenceOntologyTerm.name" op="!=" value="transgene"/>
	      <constraint code="D" path="SequenceFeature.ontologyAnnotations.ontologyTerm.ontology.name" op="ONE OF">
		  ${ termTypes.map(tt=> '<value>'+tt+'</value>').join('') }
	      </constraint>
	  </query>`
	return this.getAuxData(q);
    }
    //----------------------------------------------
    // (not currently in use...)
    featuresByPathwayTerm (qryString) {
        let q = `<query name="" model="genomic" 
	  view="Gene.primaryIdentifier Gene.symbol" constraintLogic="A and B">
	      <constraint path="Gene.pathways" code="A" op="LOOKUP" value="${qryString}"/>
	      <constraint path="Gene.organism.taxonId" code="B" op="=" value="10090"/>
	  </query>`;
	return this.getAuxData(q);
    }
    //----------------------------------------------
    featuresById        (qryString) { return this.featuresByLookup(qryString); }
    featuresByFunction  (qryString) { return this.featuresByOntologyTerm(qryString, ["Gene Ontology"]); }
    featuresByPhenotype (qryString) { return this.featuresByOntologyTerm(qryString, ["Mammalian Phenotype","Disease Ontology"]); }
    featuresByPathway   (qryString) { return this.featuresByPathwayTerm(qryString); }
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
	this.currSort = "a"; // either 'a' or 'b'
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
	    });
	if (!invert) {
	    // Look for 1-block gaps and fill them in. 
	    blks.sort((a,b) => a.index - b.index);
	    let nbs = [];
	    blks.forEach( (b, i) => {
		if (i === 0) return;
		if (blks[i].index - blks[i - 1].index === 2) {
		    let blk = this.blocks.filter( b => b[toI] === blks[i].index - 1 )[0];
		    nbs.push({
			chr:   blk[toC],
			start: blk[toS],
			end:   blk[toE],
			ori:   blk.blockOri,
			index: blk[toI],
			// also return the fromGenome coords for this piece of the translation
			fChr:   blk[fromC],
			fStart: blk[fromS],
			fEnd:   blk[fromE],
			fIndex: blk[fromI],
			// include the block id and full block coords
			blockId: blk.blockId,
			blockStart: blk[toS],
			blockEnd: blk[toE]
		    });
		    console.log("Found 1-block gap. Added:", nbs[nbs.length - 1]);
		}
	    });
	    blks = blks.concat(nbs);
	}
	blks.sort((a,b) => a.fIndex - b.fIndex);
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
      this.deltaX = 0;
      this.deltaB = 0;

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
	  })
	  .on('wheel', function(d) {
	    let e = d3.event;
	    // only interested in horizontal motion events
	    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) 
	        return;
	    let db = e.deltaX / self.ppb; // delta in bases on for this event
	    let c  = self.app.coords;
	    self.deltaB = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* clip */])(self.deltaB + db, -c.start, c.chromosome.length - c.end)
	    self.deltaX = self.deltaB * self.ppb;
	    d3.select(this).selectAll('g.zoomStrip > g[name="sBlocks"]')
		.attr('transform',`translate(${-self.deltaX},0)`);
	    self.drawFiducials();
	    e.stopPropagation();
	    e.preventDefault();
	    if (self.timeout)
	        window.clearTimeout(self.timeout);
	    self.timeout = window.setTimeout(() => {
		self.timeout = null;
		let ccxt = self.app.getContext();
		if (ccxt.landmark) {
		    ccxt.delta += self.deltaB;
		}
		else {
		    ccxt.start += self.deltaB;
		    ccxt.end += self.deltaB;
		}
		self.deltaB = self.deltaX = 0;
		self.app.setContext(ccxt);
	    }, 50);
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
	      self.dragging.attr("transform", `translate(0, ${my})`);
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
      let g = this.brushing.genome.label;
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
	  this.app.setContext({ ref:g, start:xt[0], end:xt[1] });
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
	this.ppb = this.width / (this.app.coords.end - this.app.coords.start + 1);
	let pstart = []; // offset (in pixels) of start position of next block, by strip index (0===ref)
	let bstart = []; // block start pos (in bp) assoc with pstart
	let cchr = null;
	let self = this;
	let dx;
	let pend;
	sblocks.each( function (b,i,j) { // b=block, i=index within strip, j=strip index
	    let blen = self.ppb * (b.end - b.start + 1); // total screen width of this sblock
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
		dx = b.chr === cchr ? pstart[j] + self.ppb * (b.start - bstart[j]) : Infinity;
		if (dx < 0 || dx > self.maxSBgap) {
		    // Changed chr or jumped a large gap
		    pstart[j] = pend + 16;
		    bstart[j] = b.start;
		    dx = pstart[j];
		    cchr = b.chr;
		}
	    }
	    d3.select(this).attr("transform", `translate(${dx},0)`);
	    pend = dx + blen;
	});
    }

    // ------------------------------------
    //
    mergeSblockRuns (data) {
	// -----
	// Reducer function. Will be called with these args:
	//   nblcks (list) New blocks. (current accumulator value)
	//   	A list of lists of synteny blocks.
	//   blk (synteny block) the current synteny block
	//   i (int) The iteration count.
	// Returns:
	//   list of lists of blocks
	let merger = (nblks, b, i) => {
	    let initBlk = function (bb) {
		let nb = Object.assign({}, bb);
		nb.superBlock = true;
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
	    if (b.chr !== lastBlk.chr || b.index - lastBlk.index !== 1) {
	        nblks.push(initBlk(b));
		return nblks;
	    }
	    // merge
	    lastBlk.index = b.index;
	    lastBlk.end = b.end;
	    lastBlk.blockEnd = b.blockEnd;
	    lastBlk.features = lastBlk.features.concat(b.features);
	    let lastSb = lastBlk.sblocks[lastBlk.sblocks.length - 1];
	    let d = b.start - lastSb.end;
	    lastSb.end += d/2;
	    b.start -= d/2;
	    lastBlk.sblocks.push(b);
	    return nblks;
	};
	// -----
        data.forEach((gdata,i) => {
	    gdata.blocks.sort( (a,b) => a.index - b.index );
	    gdata.blocks = gdata.blocks.reduce(merger,[]);
	    /*
	    // first sort by ref genome order
	    gdata.blocks.sort( (a,b) => a.fIndex - b.fIndex );
	    // Sub-group into runs of same comp genome chromosome.
            let tmp = gdata.blocks.reduce((nbs, b, i) => {
	        if (i === 0 || nbs[nbs.length - 1][0].chr !== b.chr)
		    nbs.push([b]);
		else
		    nbs[nbs.length - 1].push(b);
		return nbs;
	    }, []);
	    // Sort each subgroup into comparison genome order
	    tmp.forEach( subgrp => subgrp.sort((a,b) => a.index - b.index) );
	    // Flatten the list
	    tmp = tmp.reduce((lst, curr) => lst.concat(curr), []);
            // Now create the supergroups.
	    gdata.blocks = tmp.reduce(merger,[]);
	    */
	});
	return data;
    }

    // ---------------------------------------------------
    //
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
	//
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
	//
	this.deltaX = 0;
        zstrips.select('g[name="sBlocks"]')
	    .attr('transform',`translate(0,0)`);
	// ---- Synteny super blocks ----
        let sblocks = zstrips.select('[name="sBlocks"]').selectAll('g.sBlock')
	    .data(d=>d.blocks, b => b.blockId);
	let newsbs = sblocks.enter()
	    .append("g")
	    .attr("class", "sBlock")
	    .attr("name", b=>b.index)
	    ;
	let l0 = newsbs.append("g").attr("name", "layer0");
	let l1 = newsbs.append("g").attr("name", "layer1");

	//
	this.orderSBlocks(sblocks);

	// rectangle for each individual synteny block
	let sbrects = sblocks.select('g[name="layer0"]').selectAll('rect.block').data(d=> {
	    d.sblocks.forEach(b=>b.xscale = d.xscale);
	    return d.sblocks
	    }, sb=>sb.index);
        sbrects.enter().append('rect') ;
	sbrects.exit().remove();
	sbrects
	   .attr("class", b => "block " + 
	       (b.ori==="+" ? "plus" : b.ori==="-" ? "minus": "confused") + 
	       (b.chr !== b.fChr ? " translocation" : ""))
	   .attr("x",     b => b.xscale(b.flip ? b.end : b.start))
	   .attr("y",     b => -this.blockHeight / 2)
	   .attr("width", b => Math.max(4, Math.abs(b.xscale(b.end)-b.xscale(b.start))))
	   .attr("height",this.blockHeight);
	   ;

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
		    let r2 = d.rects.map( rr =>
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjZkY2MwNjYyYWFlOTQ0NWE3ZjgiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1N0b3JhZ2VNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvU1ZHVmlldy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvdmlld2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9NR1ZBcHAuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZS5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1F1ZXJ5TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQXV4RGF0YU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYUV2YWx1YXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvTGlzdEVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvVXNlclByZWZzTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmFjZXRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GYWNldC5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQlRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9CbG9ja1RyYW5zbGF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZVZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzIiwid2VicGFjazovLy8u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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQW9CQTs7Ozs7Ozs7QUN6VkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7OztBQ3JCUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7OztBQ3JFUjtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLG9CQUFvQjtBQUNyRCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFFBQVEsVUFBVSxFQUFFLElBQUk7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0IscUJBQXFCO0FBQzdDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixNQUFNO0FBQy9CLGlDQUFpQyxvQkFBb0I7QUFDckQscUJBQXFCLE1BQU0sU0FBUyxRQUFRLE9BQU8sTUFBTTtBQUN6RDtBQUNBLDJCQUEyQixXQUFXLFNBQVMsUUFBUSxFQUFFLEtBQUs7QUFDOUQsd0JBQXdCLHNCQUFzQjtBQUM5QyxzQkFBc0IsUUFBUTtBQUM5QixXQUFXLHFDQUFxQyxHQUFHLE1BQU0sR0FBRyxJQUFJLEdBQUcsUUFBUSxHQUFHLElBQUk7QUFDbEY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2YseUJBQXlCO0FBQ3pCLCtCQUErQjtBQUMvQixtR0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLG9FQUFvRTtBQUMxRjtBQUNBO0FBQ0Esc0JBQXNCLGlCQUFpQjtBQUN2QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDZDQUE2QztBQUNuRTtBQUNBO0FBQ0Esc0JBQXNCLGdDQUFnQztBQUN0RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxNQUFNO0FBQzFDLDhCQUE4QixRQUFRLEdBQUcsTUFBTTtBQUMvQztBQUNBLG9EQUFvRCxFQUFFO0FBQ3RELGdDQUFnQyxNQUFNO0FBQ3RDLGtCQUFrQixRQUFRLEdBQUcsT0FBTyxHQUFHLFlBQVksR0FBRyxPQUFPLEdBQUcsU0FBUyxHQUFHLFFBQVEsR0FBRyxNQUFNLEdBQUcsaUJBQWlCO0FBQ2pIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixNQUFNO0FBQ3BDLDhCQUE4QixRQUFRLEdBQUcsTUFBTTtBQUMvQztBQUNBO0FBQ0EsbUJBQW1CLFFBQVEsR0FBRyxPQUFPLEdBQUcsU0FBUyxHQUFHLFFBQVEsR0FBRyxRQUFRO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyx5QkFBeUIsTUFBTSxLQUFLLFFBQVEsSUFBSSxNQUFNO0FBQ3REO0FBQ0EseUJBQXlCLGlCQUFpQjtBQUMxQztBQUNBLGtCQUFrQixRQUFRLEdBQUcsb0RBQW9EO0FBQ2pGO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7OztBQzc1QlI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7Ozs7OztBQ3JCMkI7QUFDbkI7O0FBRWhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwyQkFBMkI7QUFDM0IsdUJBQXVCO0FBQ3ZCO0FBQ0EsaUJBQWlCLE1BQU0sZ0JBQWdCO0FBQ3ZDLDRCQUE0QjtBQUM1QixnQ0FBZ0M7QUFDaEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQXlFO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsTUFBTSxHQUFHLFFBQVEsSUFBSSxNQUFNO0FBQ2xFLDRCQUE0QixZQUFZLFVBQVUsVUFBVTtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFlBQVk7QUFDaEQ7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRDtBQUNBLGFBQWE7QUFDYixFQUFFO0FBQ0YsNkRBQTZELGdDQUFnQyxjQUFjO0FBQzNHOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sYUFBYTtBQUNiLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUEsQ0FBQzs7QUFFTzs7Ozs7Ozs7Ozs7O0FDek9jO0FBQ0Y7QUFDSzs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixFQUFFO0FBQ0Y7QUFDQTs7QUFFUTs7Ozs7Ozs7OztBQzFFUzs7QUFFakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhFQUE4RSxPQUFPLFNBQVMsTUFBTTtBQUNwRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUFtRSxVQUFVO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtIQUFrSCxVQUFVO0FBQzVIO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzRUFBc0UsVUFBVTtBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLHlDQUF5QztBQUM5RSxxQ0FBcUMsa0VBQWtFO0FBQ3ZHLHFDQUFxQywyRkFBMkY7QUFDaEkscUNBQXFDLDhDQUE4QztBQUNuRjtBQUNBOztBQUVROzs7Ozs7Ozs7Ozs7QUN6RFk7QUFDVTtBQUNDOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixFQUFFO0FBQ2xCLGlCQUFpQixLQUFLLEdBQUcsRUFBRTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakMsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQixHQUFHLGdCQUFnQixHQUFHLGFBQWE7QUFDcEUsaUJBQWlCLGNBQWMsR0FBRyxnQkFBZ0IsR0FBRyxnQkFBZ0I7QUFDckU7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxhQUFhO0FBQ2xFO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVPOzs7Ozs7Ozs7O0FDaFNvQjs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7Ozs7OztBQ25FcUQ7QUFDekM7QUFDUTs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRDtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxXO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELEdBQUc7QUFDdkQ7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUM3QiwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQSw2QkFBNkI7QUFDN0Isa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsMkNBQTJDLEVBQUU7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTyIsImZpbGUiOiJtZ3YuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZjZkY2MwNjYyYWFlOTQ0NWE3ZjgiLCJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gICAgICAgICAgICAgICAgICAgIFVUSUxTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAoUmUtKUluaXRpYWxpemVzIGFuIG9wdGlvbiBsaXN0LlxuLy8gQXJnczpcbi8vICAgc2VsZWN0b3IgKHN0cmluZyBvciBOb2RlKSBDU1Mgc2VsZWN0b3Igb2YgdGhlIGNvbnRhaW5lciA8c2VsZWN0PiBlbGVtZW50LiBPciB0aGUgZWxlbWVudCBpdHNlbGYuXG4vLyAgIG9wdHMgKGxpc3QpIExpc3Qgb2Ygb3B0aW9uIGRhdGEgb2JqZWN0cy4gTWF5IGJlIHNpbXBsZSBzdHJpbmdzLiBNYXkgYmUgbW9yZSBjb21wbGV4LlxuLy8gICB2YWx1ZSAoZnVuY3Rpb24gb3IgbnVsbCkgRnVuY3Rpb24gdG8gcHJvZHVjZSB0aGUgPG9wdGlvbj4gdmFsdWUgZnJvbSBhbiBvcHRzIGl0ZW1cbi8vICAgICAgIERlZmF1bHRzIHRvIHRoZSBpZGVudGl0eSBmdW5jdGlvbiAoeD0+eCkuXG4vLyAgIGxhYmVsIChmdW5jdGlvbiBvciBudWxsKSBGdW5jdGlvbiB0byBwcm9kdWNlIHRoZSA8b3B0aW9uPiBsYWJlbCBmcm9tIGFuIG9wdHMgaXRlbVxuLy8gICAgICAgRGVmYXVsdHMgdG8gdGhlIHZhbHVlIGZ1bmN0aW9uLlxuLy8gICBtdWx0aSAoYm9vbGVhbikgU3BlY2lmaWVzIGlmIHRoZSBsaXN0IHN1cHBvcnQgbXVsdGlwbGUgc2VsZWN0aW9ucy4gKGRlZmF1bHQgPSBmYWxzZSlcbi8vICAgc2VsZWN0ZWQgKGZ1bmN0aW9uIG9yIG51bGwpIEZ1bmN0aW9uIHRvIGRldGVybWluZSBpZiBhIGdpdmVuIG9wdGlvbiBpcyBzZWxlY3RkLlxuLy8gICAgICAgRGVmYXVsdHMgdG8gZD0+RmFsc2UuIE5vdGUgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIG9ubHkgYXBwbGllZCB0byBuZXcgb3B0aW9ucy5cbi8vICAgc29ydEJ5IChmdW5jdGlvbikgT3B0aW9uYWwuIElmIHByb3ZpZGVkLCBhIGNvbXBhcmlzb24gZnVuY3Rpb24gdG8gdXNlIGZvciBzb3J0aW5nIHRoZSBvcHRpb25zLlxuLy8gICBcdCBUaGUgY29tcGFyaXNvbiBmdW5jdGlvbiBpcyBwYXNzZXMgdGhlIGRhdGEgb2JqZWN0cyBjb3JyZXNwb25kaW5nIHRvIHR3byBvcHRpb25zIGFuZCBzaG91bGRcbi8vICAgXHQgcmV0dXJuIC0xLCAwIG9yICsxLiBJZiBub3QgcHJvdmlkZWQsIHRoZSBvcHRpb24gbGlzdCB3aWxsIGhhdmUgdGhlIHNhbWUgc29ydCBvcmRlciBhcyB0aGUgb3B0cyBhcmd1bWVudC5cbi8vIFJldHVybnM6XG4vLyAgIFRoZSBvcHRpb24gbGlzdCBpbiBhIEQzIHNlbGVjdGlvbi5cbmZ1bmN0aW9uIGluaXRPcHRMaXN0KHNlbGVjdG9yLCBvcHRzLCB2YWx1ZSwgbGFiZWwsIG11bHRpLCBzZWxlY3RlZCwgc29ydEJ5KSB7XG5cbiAgICAvLyBzZXQgdXAgdGhlIGZ1bmN0aW9uc1xuICAgIGxldCBpZGVudCA9IGQgPT4gZDtcbiAgICB2YWx1ZSA9IHZhbHVlIHx8IGlkZW50O1xuICAgIGxhYmVsID0gbGFiZWwgfHwgdmFsdWU7XG4gICAgc2VsZWN0ZWQgPSBzZWxlY3RlZCB8fCAoeCA9PiBmYWxzZSk7XG5cbiAgICAvLyB0aGUgPHNlbGVjdD4gZWx0XG4gICAgbGV0IHMgPSBkMy5zZWxlY3Qoc2VsZWN0b3IpO1xuXG4gICAgLy8gbXVsdGlzZWxlY3RcbiAgICBzLnByb3BlcnR5KCdtdWx0aXBsZScsIG11bHRpIHx8IG51bGwpIDtcblxuICAgIC8vIGJpbmQgdGhlIG9wdHMuXG4gICAgbGV0IG9zID0gcy5zZWxlY3RBbGwoXCJvcHRpb25cIilcbiAgICAgICAgLmRhdGEob3B0cywgbGFiZWwpO1xuICAgIG9zLmVudGVyKClcbiAgICAgICAgLmFwcGVuZChcIm9wdGlvblwiKSBcbiAgICAgICAgLmF0dHIoXCJ2YWx1ZVwiLCB2YWx1ZSlcbiAgICAgICAgLnByb3BlcnR5KFwic2VsZWN0ZWRcIiwgbyA9PiBzZWxlY3RlZChvKSB8fCBudWxsKVxuICAgICAgICAudGV4dChsYWJlbCkgXG4gICAgICAgIDtcbiAgICAvL1xuICAgIG9zLmV4aXQoKS5yZW1vdmUoKSA7XG5cbiAgICAvLyBzb3J0IHRoZSByZXN1bHRzXG4gICAgaWYgKCFzb3J0QnkpIHNvcnRCeSA9IChhLGIpID0+IHtcbiAgICBcdGxldCBhaSA9IG9wdHMuaW5kZXhPZihhKTtcblx0bGV0IGJpID0gb3B0cy5pbmRleE9mKGIpO1xuXHRyZXR1cm4gYWkgLSBiaTtcbiAgICB9XG4gICAgb3Muc29ydChzb3J0QnkpO1xuXG4gICAgLy9cbiAgICByZXR1cm4gcztcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcm9taXNpZmllcyBhIGNhbGwgdG8gZDMudHN2LlxuLy8gQXJnczpcbi8vICAgdXJsIChzdHJpbmcpIFRoZSB1cmwgb2YgdGhlIHRzdiByZXNvdXJjZVxuLy8gUmV0dXJuczpcbi8vICAgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGxpc3Qgb2Ygcm93IG9iamVjdHNcbmZ1bmN0aW9uIGQzdHN2KHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZDMudHN2KHVybCwgZnVuY3Rpb24oZXJyb3IsIHZhbCl7XG4gICAgICAgICAgICBlcnJvciA/IHJlamVjdCh7IHN0YXR1czogZXJyb3Iuc3RhdHVzLCBzdGF0dXNUZXh0OiBlcnJvci5zdGF0dXNUZXh0fSkgOiByZXNvbHZlKHZhbCk7XG4gICAgICAgIH0pICBcbiAgICB9KTsgXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJvbWlzaWZpZXMgYSBjYWxsIHRvIGQzLmpzb24uXG4vLyBBcmdzOlxuLy8gICB1cmwgKHN0cmluZykgVGhlIHVybCBvZiB0aGUganNvbiByZXNvdXJjZVxuLy8gUmV0dXJuczpcbi8vICAgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGpzb24gb2JqZWN0IHZhbHVlLCBvciByZWplY3RzIHdpdGggYW4gZXJyb3JcbmZ1bmN0aW9uIGQzanNvbih1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGQzLmpzb24odXJsLCBmdW5jdGlvbihlcnJvciwgdmFsKXtcbiAgICAgICAgICAgIGVycm9yID8gcmVqZWN0KHsgc3RhdHVzOiBlcnJvci5zdGF0dXMsIHN0YXR1c1RleHQ6IGVycm9yLnN0YXR1c1RleHR9KSA6IHJlc29sdmUodmFsKTtcbiAgICAgICAgfSkgIFxuICAgIH0pOyBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIGEgZGVlcCBjb3B5IG9mIG9iamVjdCBvLiBcbi8vIEFyZ3M6XG4vLyAgIG8gIChvYmplY3QpIE11c3QgYmUgYSBKU09OIG9iamVjdCAobm8gY3VyY3VsYXIgcmVmcywgbm8gZnVuY3Rpb25zKS5cbi8vIFJldHVybnM6XG4vLyAgIGEgZGVlcCBjb3B5IG9mIG9cbmZ1bmN0aW9uIGRlZXBjKG8pIHtcbiAgICBpZiAoIW8pIHJldHVybiBvO1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvKSk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUGFyc2VzIGEgc3RyaW5nIG9mIHRoZSBmb3JtIFwiY2hyOnN0YXJ0Li5lbmRcIi5cbi8vIFJldHVybnM6XG4vLyAgIG9iamVjdCBjb250aW5pbmcgdGhlIHBhcnNlZCBmaWVsZHMuXG4vLyBFeGFtcGxlOlxuLy8gICBwYXJzZUNvb3JkcyhcIjEwOjEwMDAwMDAwLi4yMDAwMDAwMFwiKSAtPiB7Y2hyOlwiMTBcIiwgc3RhcnQ6MTAwMDAwMDAsIGVuZDoyMDAwMDAwMH1cbmZ1bmN0aW9uIHBhcnNlQ29vcmRzIChjb29yZHMpIHtcbiAgICBsZXQgcmUgPSAvKFteOl0rKTooXFxkKylcXC5cXC4oXFxkKykvO1xuICAgIGxldCBtID0gY29vcmRzLm1hdGNoKHJlKTtcbiAgICByZXR1cm4gbSA/IHtjaHI6bVsxXSwgc3RhcnQ6cGFyc2VJbnQobVsyXSksIGVuZDpwYXJzZUludChtWzNdKX0gOiBudWxsO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEZvcm1hdHMgYSBjaHJvbW9zb21lIG5hbWUsIHN0YXJ0IGFuZCBlbmQgcG9zaXRpb24gYXMgYSBzdHJpbmcuXG4vLyBBcmdzIChmb3JtIDEpOlxuLy8gICBjb29yZHMgKG9iamVjdCkgT2YgdGhlIGZvcm0ge2NocjpzdHJpbmcsIHN0YXJ0OmludCwgZW5kOmludH1cbi8vIEFyZ3MgKGZvcm0gMik6XG4vLyAgIGNociBzdHJpbmdcbi8vICAgc3RhcnQgaW50XG4vLyAgIGVuZCBpbnRcbi8vIFJldHVybnM6XG4vLyAgICAgc3RyaW5nXG4vLyBFeGFtcGxlOlxuLy8gICAgIGZvcm1hdENvb3JkcyhcIjEwXCIsIDEwMDAwMDAwLCAyMDAwMDAwMCkgLT4gXCIxMDoxMDAwMDAwMC4uMjAwMDAwMDBcIlxuZnVuY3Rpb24gZm9ybWF0Q29vcmRzIChjaHIsIHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHRsZXQgYyA9IGNocjtcblx0Y2hyID0gYy5jaHI7XG5cdHN0YXJ0ID0gYy5zdGFydDtcblx0ZW5kID0gYy5lbmQ7XG4gICAgfVxuICAgIHJldHVybiBgJHtjaHJ9OiR7c3RhcnR9Li4ke2VuZH1gXG59XG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdHJ1ZSBpZmYgdGhlIHR3byByYW5nZXMgb3ZlcmxhcCBieSBhdCBsZWFzdCAxLlxuLy8gRWFjaCByYW5nZSBtdXN0IGhhdmUgYSBjaHIsIHN0YXJ0LCBhbmQgZW5kLlxuLy9cbmZ1bmN0aW9uIG92ZXJsYXBzIChhLCBiKSB7XG4gICAgcmV0dXJuIGEuY2hyID09PSBiLmNociAmJiBhLnN0YXJ0IDw9IGIuZW5kICYmIGEuZW5kID49IGIuc3RhcnQ7XG59XG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEdpdmVuIHR3byByYW5nZXMsIGEgYW5kIGIsIHJldHVybnMgYSAtIGIuXG4vLyBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiAwLCAxIG9yIDIgbmV3IHJhbmdlcywgZGVwZW5kaW5nIG9uIGEgYW5kIGIuXG5mdW5jdGlvbiBzdWJ0cmFjdChhLCBiKSB7XG4gICAgaWYgKGEuY2hyICE9PSBiLmNocikgcmV0dXJuIFsgYSBdO1xuICAgIGxldCBhYkxlZnQgPSB7IGNocjphLmNociwgc3RhcnQ6YS5zdGFydCwgICAgICAgICAgICAgICAgICAgIGVuZDpNYXRoLm1pbihhLmVuZCwgYi5zdGFydC0xKSB9O1xuICAgIGxldCBhYlJpZ2h0PSB7IGNocjphLmNociwgc3RhcnQ6TWF0aC5tYXgoYS5zdGFydCwgYi5lbmQrMSksIGVuZDphLmVuZCB9O1xuICAgIGxldCBhbnMgPSBbIGFiTGVmdCwgYWJSaWdodCBdLmZpbHRlciggciA9PiByLnN0YXJ0IDw9IHIuZW5kICk7XG4gICAgcmV0dXJuIGFucztcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBDcmVhdGVzIGEgbGlzdCBvZiBrZXksdmFsdWUgcGFpcnMgZnJvbSB0aGUgb2JqLlxuZnVuY3Rpb24gb2JqMmxpc3QgKG8pIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMobykubWFwKGsgPT4gW2ssIG9ba11dKSAgICBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRydWUgaWZmIHRoZSB0d28gbGlzdHMgaGF2ZSB0aGUgc2FtZSBjb250ZW50cyAoYmFzZWQgb24gaW5kZXhPZikuXG4vLyBCcnV0ZSBmb3JjZSBhcHByb2FjaC4gQmUgY2FyZWZ1bCB3aGVyZSB5b3UgdXNlIHRoaXMuXG5mdW5jdGlvbiBzYW1lIChhbHN0LGJsc3QpIHtcbiAgIHJldHVybiBhbHN0Lmxlbmd0aCA9PT0gYmxzdC5sZW5ndGggJiYgXG4gICAgICAgYWxzdC5yZWR1Y2UoKGFjYyx4KSA9PiAoYWNjICYmIGJsc3QuaW5kZXhPZih4KT49MCksIHRydWUpO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQWRkIGJhc2ljIHNldCBvcHMgdG8gU2V0IHByb3RvdHlwZS5cbi8vIExpZnRlZCBmcm9tOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TZXRcblNldC5wcm90b3R5cGUudW5pb24gPSBmdW5jdGlvbihzZXRCKSB7XG4gICAgdmFyIHVuaW9uID0gbmV3IFNldCh0aGlzKTtcbiAgICBmb3IgKHZhciBlbGVtIG9mIHNldEIpIHtcbiAgICAgICAgdW5pb24uYWRkKGVsZW0pO1xuICAgIH1cbiAgICByZXR1cm4gdW5pb247XG59XG5cblNldC5wcm90b3R5cGUuaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oc2V0Qikge1xuICAgIHZhciBpbnRlcnNlY3Rpb24gPSBuZXcgU2V0KCk7XG4gICAgZm9yICh2YXIgZWxlbSBvZiBzZXRCKSB7XG4gICAgICAgIGlmICh0aGlzLmhhcyhlbGVtKSkge1xuICAgICAgICAgICAgaW50ZXJzZWN0aW9uLmFkZChlbGVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW50ZXJzZWN0aW9uO1xufVxuXG5TZXQucHJvdG90eXBlLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihzZXRCKSB7XG4gICAgdmFyIGRpZmZlcmVuY2UgPSBuZXcgU2V0KHRoaXMpO1xuICAgIGZvciAodmFyIGVsZW0gb2Ygc2V0Qikge1xuICAgICAgICBkaWZmZXJlbmNlLmRlbGV0ZShlbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpZmZlcmVuY2U7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGdldENhcmV0UmFuZ2UgKGVsdCkge1xuICAgIC8vIEZJWE1FOiBkb2VzIG5vdCB3b3JrIGZvciBJRVxuICAgIHJldHVybiBbZWx0LnNlbGVjdGlvblN0YXJ0LCBlbHQuc2VsZWN0aW9uRW5kXTtcbn1cbmZ1bmN0aW9uIHNldENhcmV0UmFuZ2UgKGVsdCwgcmFuZ2UpIHtcbiAgICAvLyBGSVhNRTogZG9lcyBub3Qgd29yayBmb3IgSUVcbiAgICBlbHQuc2VsZWN0aW9uU3RhcnQgPSByYW5nZVswXTtcbiAgICBlbHQuc2VsZWN0aW9uRW5kICAgPSByYW5nZVsxXTtcbn1cbmZ1bmN0aW9uIHNldENhcmV0UG9zaXRpb24gKGVsdCwgcG9zKSB7XG4gICAgc2V0Q2FyZXRSYW5nZShlbHQsIFtwb3MscG9zXSk7XG59XG5mdW5jdGlvbiBtb3ZlQ2FyZXRQb3NpdGlvbiAoZWx0LCBkZWx0YSkge1xuICAgIHNldENhcmV0UG9zaXRpb24oZWx0LCBnZXRDYXJldFBvc2l0aW9uKGVsdCkgKyBkZWx0YSk7XG59XG5mdW5jdGlvbiBnZXRDYXJldFBvc2l0aW9uIChlbHQpIHtcbiAgICBsZXQgciA9IGdldENhcmV0UmFuZ2UoZWx0KTtcbiAgICByZXR1cm4gclsxXTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRoZSBzY3JlZW4gY29vcmRpbmF0ZXMgb2YgYW4gU1ZHIHNoYXBlIChjaXJjbGUsIHJlY3QsIHBvbHlnb24sIGxpbmUpXG4vLyBhZnRlciBhbGwgdHJhbnNmb3JtcyBoYXZlIGJlZW4gYXBwbGllZC5cbi8vXG4vLyBBcmdzOlxuLy8gICAgIHNoYXBlIChub2RlKSBUaGUgU1ZHIHNoYXBlLlxuLy9cbi8vIFJldHVybnM6XG4vLyAgICAgVGhlIGZvcm0gb2YgdGhlIHJldHVybmVkIHZhbHVlIGRlcGVuZHMgb24gdGhlIHNoYXBlLlxuLy8gICAgIGNpcmNsZTogIHsgY3gsIGN5LCByIH1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgY2VudGVyIHBvaW50IGFuZCB0cmFuc2Zvcm1lZCByYWRpdXMgICAgICAgICBcbi8vICAgICBsaW5lOlx0eyB4MSwgeTEsIHgyLCB5MiB9XG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGVuZHBvaW50c1xuLy8gICAgIHJlY3Q6XHR7IHgsIHksIHdpZHRoLCBoZWlnaHQgfVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBjb3JuZXIgcG9pbnQgYW5kIHRyYW5zZm9ybWVkIHdpZHRoK2hlaWdodC5cbi8vICAgICBwb2x5Z29uOiBbIHt4LHl9LCB7eCx5fSAsIC4uLiBdXG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGxpc3Qgb2YgcG9pbnRzXG4vL1xuLy8gQWRhcHRlZCBmcm9tOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82ODU4NDc5L3JlY3RhbmdsZS1jb29yZGluYXRlcy1hZnRlci10cmFuc2Zvcm0/cnE9MVxuLy9cbmZ1bmN0aW9uIGNvb3Jkc0FmdGVyVHJhbnNmb3JtIChzaGFwZSkge1xuICAgIC8vXG4gICAgbGV0IGRzaGFwZSA9IGQzLnNlbGVjdChzaGFwZSk7XG4gICAgbGV0IHN2ZyA9IHNoYXBlLmNsb3Nlc3QoXCJzdmdcIik7XG4gICAgaWYgKCFzdmcpIHRocm93IFwiQ291bGQgbm90IGZpbmQgc3ZnIGFuY2VzdG9yLlwiO1xuICAgIGxldCBzdHlwZSA9IHNoYXBlLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgbWF0cml4ID0gc2hhcGUuZ2V0Q1RNKCk7XG4gICAgbGV0IHAgPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICBsZXQgcDI9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgIC8vXG4gICAgc3dpdGNoIChzdHlwZSkge1xuICAgIC8vXG4gICAgY2FzZSAnY2lyY2xlJzpcblx0cC54ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJjeFwiKSk7XG5cdHAueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiY3lcIikpO1xuXHRwMi54ID0gcC54ICsgcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInJcIikpO1xuXHRwMi55ID0gcC55O1xuXHRwICAgID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0cDIgICA9IHAyLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHQvLyBjYWxjIG5ldyByYWRpdXMgYXMgZGlzdGFuY2UgYmV0d2VlbiB0cmFuc2Zvcm1lZCBwb2ludHNcblx0bGV0IGR4ID0gTWF0aC5hYnMocC54IC0gcDIueCk7XG5cdGxldCBkeSA9IE1hdGguYWJzKHAueSAtIHAyLnkpO1xuXHRsZXQgciA9IE1hdGguc3FydChkeCpkeCArIGR5KmR5KTtcbiAgICAgICAgcmV0dXJuIHsgY3g6IHAueCwgY3k6IHAueSwgcjpyIH07XG4gICAgLy9cbiAgICBjYXNlICdyZWN0Jzpcblx0Ly8gRklYTUU6IGRvZXMgbm90IGhhbmRsZSByb3RhdGlvbnMgY29ycmVjdGx5LiBUbyBmaXgsIHRyYW5zbGF0ZSBjb3JuZXIgcG9pbnRzIHNlcGFyYXRlbHkgYW5kIHRoZW5cblx0Ly8gY2FsY3VsYXRlIHRoZSB0cmFuc2Zvcm1lZCB3aWR0aCBhbmQgaGVpZ2h0LiBBcyBhIGNvbnZlbmllbmNlIHRvIHRoZSB1c2VyLCBtaWdodCBiZSBuaWNlIHRvIHJldHVyblxuXHQvLyB0aGUgdHJhbnNmb3JtZWQgY29ybmVyIHBvaW50cyBhbmQgcG9zc2libHkgdGhlIGZpbmFsIGFuZ2xlIG9mIHJvdGF0aW9uLlxuXHRwLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInhcIikpO1xuXHRwLnkgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInlcIikpO1xuXHRwMi54ID0gcC54ICsgcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcIndpZHRoXCIpKTtcblx0cDIueSA9IHAueSArIHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJoZWlnaHRcIikpO1xuXHQvL1xuXHRwICA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdHAyID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdC8vXG4gICAgICAgIHJldHVybiB7IHg6IHAueCwgeTogcC55LCB3aWR0aDogcDIueC1wLngsIGhlaWdodDogcDIueS1wLnkgfTtcbiAgICAvL1xuICAgIGNhc2UgJ3BvbHlnb24nOlxuICAgICAgICBsZXQgcHRzID0gZHNoYXBlLmF0dHIoXCJwb2ludHNcIikudHJpbSgpLnNwbGl0KC8gKy8pO1xuXHRyZXR1cm4gcHRzLm1hcCggcHQgPT4ge1xuXHQgICAgbGV0IHh5ID0gcHQuc3BsaXQoXCIsXCIpO1xuXHQgICAgcC54ID0gcGFyc2VGbG9hdCh4eVswXSlcblx0ICAgIHAueSA9IHBhcnNlRmxvYXQoeHlbMV0pXG5cdCAgICBwID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0ICAgIHJldHVybiB7IHg6IHAueCwgeTogcC55IH07XG5cdH0pO1xuICAgIC8vXG4gICAgY2FzZSAnbGluZSc6XG5cdHAueCAgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcIngxXCIpKTtcblx0cC55ICAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieTFcIikpO1xuXHRwMi54ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ4MlwiKSk7XG5cdHAyLnkgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInkyXCIpKTtcblx0cCAgICAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRwMiAgICA9IHAyLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuICAgICAgICByZXR1cm4geyB4MTogcC54LCB5MTogcC55LCB4MjogcDIueCwgeDI6IHAyLnkgfTtcbiAgICAvL1xuICAgIC8vIEZJWE1FOiBhZGQgY2FzZSAndGV4dCdcbiAgICAvL1xuXG4gICAgZGVmYXVsdDpcblx0dGhyb3cgXCJVbnN1cHBvcnRlZCBub2RlIHR5cGU6IFwiICsgc3R5cGU7XG4gICAgfVxuXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmVtb3ZlcyBkdXBsaWNhdGVzIGZyb20gYSBsaXN0IHdoaWxlIHByZXNlcnZpbmcgbGlzdCBvcmRlci5cbi8vIEFyZ3M6XG4vLyAgICAgbHN0IChsaXN0KVxuLy8gUmV0dXJuczpcbi8vICAgICBBIHByb2Nlc3NlZCBjb3B5IG9mIGxzdCBpbiB3aGljaCBhbnkgZHVwcyBoYXZlIGJlZW4gcmVtb3ZlZC5cbmZ1bmN0aW9uIHJlbW92ZUR1cHMgKGxzdCkge1xuICAgIGxldCBsc3QyID0gW107XG4gICAgbGV0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgbHN0LmZvckVhY2goeCA9PiB7XG5cdC8vIHJlbW92ZSBkdXBzIHdoaWxlIHByZXNlcnZpbmcgb3JkZXJcblx0aWYgKHNlZW4uaGFzKHgpKSByZXR1cm47XG5cdGxzdDIucHVzaCh4KTtcblx0c2Vlbi5hZGQoeCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGxzdDI7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ2xpcHMgYSB2YWx1ZSB0byBhIHJhbmdlLlxuZnVuY3Rpb24gY2xpcCAobiwgbWluLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIG4pKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB7XG4gICAgaW5pdE9wdExpc3QsXG4gICAgZDN0c3YsXG4gICAgZDNqc29uLFxuICAgIGRlZXBjLFxuICAgIHBhcnNlQ29vcmRzLFxuICAgIGZvcm1hdENvb3JkcyxcbiAgICBvdmVybGFwcyxcbiAgICBzdWJ0cmFjdCxcbiAgICBvYmoybGlzdCxcbiAgICBzYW1lLFxuICAgIGdldENhcmV0UmFuZ2UsXG4gICAgc2V0Q2FyZXRSYW5nZSxcbiAgICBzZXRDYXJldFBvc2l0aW9uLFxuICAgIG1vdmVDYXJldFBvc2l0aW9uLFxuICAgIGdldENhcmV0UG9zaXRpb24sXG4gICAgY29vcmRzQWZ0ZXJUcmFuc2Zvcm0sXG4gICAgcmVtb3ZlRHVwcyxcbiAgICBjbGlwXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvdXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBDb21wb25lbnQge1xuICAgIC8vIGFwcCAtIHRoZSBvd25pbmcgYXBwIG9iamVjdFxuICAgIC8vIGVsdCAtIGNvbnRhaW5lci4gbWF5IGJlIGEgc3RyaW5nIChzZWxlY3RvciksIGEgRE9NIG5vZGUsIG9yIGEgZDMgc2VsZWN0aW9uIG9mIDEgbm9kZS5cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcblx0dGhpcy5hcHAgPSBhcHBcblx0aWYgKHR5cGVvZihlbHQpID09PSBcInN0cmluZ1wiKVxuXHQgICAgLy8gZWx0IGlzIGEgQ1NTIHNlbGVjdG9yXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5zZWxlY3RBbGwpID09PSBcImZ1bmN0aW9uXCIpXG5cdCAgICAvLyBlbHQgaXMgYSBkMyBzZWxlY3Rpb25cblx0ICAgIHRoaXMucm9vdCA9IGVsdDtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSkgPT09IFwiZnVuY3Rpb25cIilcblx0ICAgIC8vIGVsdCBpcyBhIERPTSBub2RlXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRlIG1lXG4gICAgfVxufVxuXG5leHBvcnQgeyBDb21wb25lbnQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0NvbXBvbmVudC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBGZWF0dXJlIHtcbiAgICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG4gICAgICAgIHRoaXMuY2hyICAgICA9IGNmZy5jaHIgfHwgY2ZnLmNocm9tb3NvbWU7XG4gICAgICAgIHRoaXMuc3RhcnQgICA9IGNmZy5zdGFydDtcbiAgICAgICAgdGhpcy5lbmQgICAgID0gY2ZnLmVuZDtcbiAgICAgICAgdGhpcy5zdHJhbmQgID0gY2ZnLnN0cmFuZDtcbiAgICAgICAgdGhpcy50eXBlICAgID0gY2ZnLnR5cGU7XG4gICAgICAgIHRoaXMuYmlvdHlwZSA9IGNmZy5iaW90eXBlO1xuICAgICAgICB0aGlzLm1ncGlkICAgPSBjZmcubWdwaWQgfHwgY2ZnLmlkO1xuICAgICAgICB0aGlzLm1naWlkICAgPSBjZmcubWdpaWQ7XG4gICAgICAgIHRoaXMuc3ltYm9sICA9IGNmZy5zeW1ib2w7XG4gICAgICAgIHRoaXMuZ2Vub21lICA9IGNmZy5nZW5vbWU7XG5cdHRoaXMuY29udGlnICA9IHBhcnNlSW50KGNmZy5jb250aWcpO1xuXHR0aGlzLmxhbmUgICAgPSBwYXJzZUludChjZmcubGFuZSk7XG4gICAgICAgIGlmICh0aGlzLm1naWlkID09PSBcIi5cIikgdGhpcy5tZ2lpZCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLnN5bWJvbCA9PT0gXCIuXCIpIHRoaXMuc3ltYm9sID0gbnVsbDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IElEICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdwaWQ7XG4gICAgfVxuICAgIGdldCBjYW5vbmljYWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZ2lpZDtcbiAgICB9XG4gICAgZ2V0IGlkICgpIHtcblx0Ly8gRklYTUU6IHJlbW92ZSB0aGlzIG1ldGhvZFxuICAgICAgICByZXR1cm4gdGhpcy5tZ2lpZCB8fCB0aGlzLm1ncGlkO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgbGFiZWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2wgfHwgdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGxlbmd0aCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuZCAtIHRoaXMuc3RhcnQgKyAxO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRNdW5nZWRUeXBlICgpIHtcblx0cmV0dXJuIHRoaXMudHlwZSA9PT0gXCJnZW5lXCIgP1xuXHQgICAgKHRoaXMuYmlvdHlwZSA9PT0gXCJwcm90ZWluX2NvZGluZ1wiIHx8IHRoaXMuYmlvdHlwZSA9PT0gXCJwcm90ZWluIGNvZGluZyBnZW5lXCIpID9cblx0XHRcInByb3RlaW5fY29kaW5nX2dlbmVcIlxuXHRcdDpcblx0XHR0aGlzLmJpb3R5cGUuaW5kZXhPZihcInBzZXVkb2dlbmVcIikgPj0gMCA/XG5cdFx0ICAgIFwicHNldWRvZ2VuZVwiXG5cdFx0ICAgIDpcblx0XHQgICAgKHRoaXMuYmlvdHlwZS5pbmRleE9mKFwiUk5BXCIpID49IDAgfHwgdGhpcy5iaW90eXBlLmluZGV4T2YoXCJhbnRpc2Vuc2VcIikgPj0gMCkgP1xuXHRcdFx0XCJuY1JOQV9nZW5lXCJcblx0XHRcdDpcblx0XHRcdHRoaXMuYmlvdHlwZS5pbmRleE9mKFwic2VnbWVudFwiKSA+PSAwID9cblx0XHRcdCAgICBcImdlbmVfc2VnbWVudFwiXG5cdFx0XHQgICAgOlxuXHRcdFx0ICAgIFwib3RoZXJfZ2VuZVwiXG5cdCAgICA6XG5cdCAgICB0aGlzLnR5cGUgPT09IFwicHNldWRvZ2VuZVwiID9cblx0XHRcInBzZXVkb2dlbmVcIlxuXHRcdDpcblx0XHR0aGlzLnR5cGUuaW5kZXhPZihcImdlbmVfc2VnbWVudFwiKSA+PSAwID9cblx0XHQgICAgXCJnZW5lX3NlZ21lbnRcIlxuXHRcdCAgICA6XG5cdFx0ICAgIHRoaXMudHlwZS5pbmRleE9mKFwiUk5BXCIpID49IDAgP1xuXHRcdFx0XCJuY1JOQV9nZW5lXCJcblx0XHRcdDpcblx0XHRcdHRoaXMudHlwZS5pbmRleE9mKFwiZ2VuZVwiKSA+PSAwID9cblx0XHRcdCAgICBcIm90aGVyX2dlbmVcIlxuXHRcdFx0ICAgIDpcblx0XHRcdCAgICBcIm90aGVyX2ZlYXR1cmVfdHlwZVwiO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgRmVhdHVyZSB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmVhdHVyZS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBQUkVGSVg9XCJhcHBzLm1ndi5cIjtcbiBcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW50ZXJhY3RzIHdpdGggbG9jYWxTdG9yYWdlLlxuLy9cbmNsYXNzIFN0b3JhZ2VNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSwgc3RvcmFnZSkge1xuXHR0aGlzLm5hbWUgPSBQUkVGSVgrbmFtZTtcblx0dGhpcy5zdG9yYWdlID0gc3RvcmFnZTtcblx0dGhpcy5teURhdGFPYmogPSBudWxsO1xuXHQvL1xuXHR0aGlzLl9sb2FkKCk7XG4gICAgfVxuICAgIF9sb2FkICgpIHtcblx0Ly8gbG9hZHMgbXlEYXRhT2JqIGZyb20gc3RvcmFnZVxuICAgICAgICBsZXQgcyA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZSk7XG5cdHRoaXMubXlEYXRhT2JqID0gcyA/IEpTT04ucGFyc2UocykgOiB7fTtcbiAgICB9XG4gICAgX3NhdmUgKCkge1xuXHQvLyB3cml0ZXMgbXlEYXRhT2JqIHRvIHN0b3JhZ2VcbiAgICAgICAgbGV0IHMgPSBKU09OLnN0cmluZ2lmeSh0aGlzLm15RGF0YU9iaik7XG5cdHRoaXMuc3RvcmFnZS5zZXRJdGVtKHRoaXMubmFtZSwgcylcbiAgICB9XG4gICAgZ2V0IChuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm15RGF0YU9ialtuXTtcbiAgICB9XG4gICAgcHV0IChuLCB2KSB7XG4gICAgICAgIHRoaXMubXlEYXRhT2JqW25dID0gdjtcblx0dGhpcy5fc2F2ZSgpO1xuICAgIH1cbn1cbi8vXG5jbGFzcyBTZXNzaW9uU3RvcmFnZU1hbmFnZXIgZXh0ZW5kcyBTdG9yYWdlTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUpIHtcbiAgICAgICAgc3VwZXIobmFtZSwgd2luZG93LnNlc3Npb25TdG9yYWdlKTtcbiAgICB9XG59XG4vL1xuY2xhc3MgTG9jYWxTdG9yYWdlTWFuYWdlciBleHRlbmRzIFN0b3JhZ2VNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSkge1xuICAgICAgICBzdXBlcihuYW1lLCB3aW5kb3cubG9jYWxTdG9yYWdlKTtcbiAgICB9XG59XG4vL1xuZXhwb3J0IHsgU2Vzc2lvblN0b3JhZ2VNYW5hZ2VyLCBMb2NhbFN0b3JhZ2VNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9TdG9yYWdlTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBhcnNlcyBhIGxpc3Qgb3BlcmF0b3IgZXhwcmVzc2lvbiwgZWcgXCIoYSArIGIpKmMgLSBkXCJcbi8vIFJldHVybnMgYW4gYWJzdHJhY3Qgc3ludGF4IHRyZWUuXG4vLyAgICAgTGVhZiBub2RlcyA9IGxpc3QgbmFtZXMuIFRoZXkgYXJlIHNpbXBsZSBzdHJpbmdzLlxuLy8gICAgIEludGVyaW9yIG5vZGVzID0gb3BlcmF0aW9ucy4gVGhleSBsb29rIGxpa2U6IHtsZWZ0Om5vZGUsIG9wOnN0cmluZywgcmlnaHQ6bm9kZX1cbi8vIFxuY2xhc3MgTGlzdEZvcm11bGFQYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcblx0dGhpcy5yX29wICAgID0gL1srLV0vO1xuXHR0aGlzLnJfb3AyICAgPSAvWypdLztcblx0dGhpcy5yX29wcyAgID0gL1soKSsqLV0vO1xuXHR0aGlzLnJfaWRlbnQgPSAvW2EtekEtWl9dW2EtekEtWjAtOV9dKi87XG5cdHRoaXMucl9xc3RyICA9IC9cIlteXCJdKlwiLztcblx0dGhpcy5yZSA9IG5ldyBSZWdFeHAoYCgke3RoaXMucl9vcHMuc291cmNlfXwke3RoaXMucl9xc3RyLnNvdXJjZX18JHt0aGlzLnJfaWRlbnQuc291cmNlfSlgLCAnZycpO1xuXHQvL3RoaXMucmUgPSAvKFsoKSsqLV18XCJbXlwiXStcInxbYS16QS1aX11bYS16QS1aMC05X10qKS9nXG5cdHRoaXMuX2luaXQoXCJcIik7XG4gICAgfVxuICAgIF9pbml0IChzKSB7XG4gICAgICAgIHRoaXMuZXhwciA9IHM7XG5cdHRoaXMudG9rZW5zID0gdGhpcy5leHByLm1hdGNoKHRoaXMucmUpIHx8IFtdO1xuXHR0aGlzLmkgPSAwO1xuICAgIH1cbiAgICBfcGVla1Rva2VuKCkge1xuXHRyZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5pXTtcbiAgICB9XG4gICAgX25leHRUb2tlbiAoKSB7XG5cdGxldCB0O1xuICAgICAgICBpZiAodGhpcy5pIDwgdGhpcy50b2tlbnMubGVuZ3RoKSB7XG5cdCAgICB0ID0gdGhpcy50b2tlbnNbdGhpcy5pXTtcblx0ICAgIHRoaXMuaSArPSAxO1xuXHR9XG5cdHJldHVybiB0O1xuICAgIH1cbiAgICBfZXhwciAoKSB7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fdGVybSgpO1xuXHRsZXQgb3AgPSB0aGlzLl9wZWVrVG9rZW4oKTtcblx0aWYgKG9wID09PSBcIitcIiB8fCBvcCA9PT0gXCItXCIpIHtcblx0ICAgIHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgbm9kZSA9IHsgbGVmdDpub2RlLCBvcDpvcD09PVwiK1wiP1widW5pb25cIjpcImRpZmZlcmVuY2VcIiwgcmlnaHQ6IHRoaXMuX2V4cHIoKSB9XG5cdCAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfSAgICAgICAgICAgICAgIFxuXHRlbHNlIGlmIChvcCA9PT0gXCIpXCIgfHwgb3AgPT09IHVuZGVmaW5lZCB8fCBvcCA9PT0gbnVsbClcblx0ICAgIHJldHVybiBub2RlO1xuXHRlbHNlXG5cdCAgICB0aGlzLl9lcnJvcihcIlVOSU9OIG9yIElOVEVSU0VDVElPTiBvciApIG9yIE5VTExcIiwgb3ApO1xuICAgIH1cbiAgICBfdGVybSAoKSB7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fZmFjdG9yKCk7XG5cdGxldCBvcCA9IHRoaXMuX3BlZWtUb2tlbigpO1xuXHRpZiAob3AgPT09IFwiKlwiKSB7XG5cdCAgICB0aGlzLl9uZXh0VG9rZW4oKTtcblx0ICAgIG5vZGUgPSB7IGxlZnQ6bm9kZSwgb3A6XCJpbnRlcnNlY3Rpb25cIiwgcmlnaHQ6IHRoaXMuX2ZhY3RvcigpIH1cblx0fVxuXHRyZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgX2ZhY3RvciAoKSB7XG4gICAgICAgIGxldCB0ID0gdGhpcy5fbmV4dFRva2VuKCk7XG5cdGlmICh0ID09PSBcIihcIil7XG5cdCAgICBsZXQgbm9kZSA9IHRoaXMuX2V4cHIoKTtcblx0ICAgIGxldCBudCA9IHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgaWYgKG50ICE9PSBcIilcIikgdGhpcy5fZXJyb3IoXCInKSdcIiwgbnQpO1xuXHQgICAgcmV0dXJuIG5vZGU7XG5cdH1cblx0ZWxzZSBpZiAodCAmJiAodC5zdGFydHNXaXRoKCdcIicpKSkge1xuXHQgICAgcmV0dXJuIHQuc3Vic3RyaW5nKDEsIHQubGVuZ3RoLTEpO1xuXHR9XG5cdGVsc2UgaWYgKHQgJiYgdC5tYXRjaCgvW2EtekEtWl9dLykpIHtcblx0ICAgIHJldHVybiB0O1xuXHR9XG5cdGVsc2Vcblx0ICAgIHRoaXMuX2Vycm9yKFwiRVhQUiBvciBJREVOVFwiLCB0fHxcIk5VTExcIik7XG5cdHJldHVybiB0O1xuXHQgICAgXG4gICAgfVxuICAgIF9lcnJvciAoZXhwZWN0ZWQsIHNhdykge1xuICAgICAgICB0aHJvdyBgUGFyc2UgZXJyb3I6IGV4cGVjdGVkICR7ZXhwZWN0ZWR9IGJ1dCBzYXcgJHtzYXd9LmA7XG4gICAgfVxuICAgIC8vIFBhcnNlcyB0aGUgc3RyaW5nIGFuZCByZXR1cm5zIHRoZSBhYnN0cmFjdCBzeW50YXggdHJlZS5cbiAgICAvLyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIHRoZXJlIGlzIGEgc3ludGF4IGVycm9yLlxuICAgIHBhcnNlIChzKSB7XG5cdHRoaXMuX2luaXQocyk7XG5cdHJldHVybiB0aGlzLl9leHByKCk7XG4gICAgfVxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZmYgc3RyaW5nIGlzIHN5bnRhY3RpY2FsbHkgdmFsaWRcbiAgICBpc1ZhbGlkIChzKSB7XG4gICAgICAgIHRyeSB7XG5cdCAgICB0aGlzLnBhcnNlKHMpO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdH1cblx0Y2F0Y2ggKGUpIHtcblx0ICAgIHJldHVybiBmYWxzZTtcblx0fVxuICAgIH1cbn1cblxuZXhwb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0xpc3RGb3JtdWxhUGFyc2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBTVkdWaWV3IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQsIG1hcmdpbnMsIHJvdGF0aW9uLCB0cmFuc2xhdGlvbikge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG4gICAgICAgIHRoaXMuc3ZnID0gdGhpcy5yb290LnNlbGVjdChcInN2Z1wiKTtcbiAgICAgICAgdGhpcy5zdmdNYWluID0gdGhpcy5zdmdcbiAgICAgICAgICAgIC5hcHBlbmQoXCJnXCIpICAgIC8vIHRoZSBtYXJnaW4tdHJhbnNsYXRlZCBncm91cFxuICAgICAgICAgICAgLmFwcGVuZChcImdcIilcdCAgLy8gbWFpbiBncm91cCBmb3IgdGhlIGRyYXdpbmdcblx0ICAgIC5hdHRyKFwibmFtZVwiLFwic3ZnbWFpblwiKTtcblx0dGhpcy5vdXRlcldpZHRoID0gMTAwO1xuXHR0aGlzLndpZHRoID0gMTAwO1xuXHR0aGlzLm91dGVySGVpZ2h0ID0gMTAwO1xuXHR0aGlzLmhlaWdodCA9IDEwMDtcblx0dGhpcy5tYXJnaW5zID0ge3RvcDogMTgsIHJpZ2h0OiAxMiwgYm90dG9tOiAxMiwgbGVmdDogMTJ9O1xuXHR0aGlzLnJvdGF0aW9uID0gMDtcblx0dGhpcy50cmFuc2xhdGlvbiA9IFswLDBdO1xuXHQvL1xuICAgICAgICB0aGlzLnNldEdlb20oe3dpZHRoLCBoZWlnaHQsIG1hcmdpbnMsIHJvdGF0aW9uLCB0cmFuc2xhdGlvbn0pO1xuICAgIH1cbiAgICBzZXRHZW9tIChjZmcpIHtcbiAgICAgICAgdGhpcy5vdXRlcldpZHRoICA9IGNmZy53aWR0aCAgICAgICB8fCB0aGlzLm91dGVyV2lkdGg7XG4gICAgICAgIHRoaXMub3V0ZXJIZWlnaHQgPSBjZmcuaGVpZ2h0ICAgICAgfHwgdGhpcy5vdXRlckhlaWdodDtcbiAgICAgICAgdGhpcy5tYXJnaW5zICAgICA9IGNmZy5tYXJnaW5zICAgICB8fCB0aGlzLm1hcmdpbnM7XG5cdHRoaXMucm90YXRpb24gICAgPSB0eXBlb2YoY2ZnLnJvdGF0aW9uKSA9PT0gXCJudW1iZXJcIiA/IGNmZy5yb3RhdGlvbiA6IHRoaXMucm90YXRpb247XG5cdHRoaXMudHJhbnNsYXRpb24gPSBjZmcudHJhbnNsYXRpb24gfHwgdGhpcy50cmFuc2xhdGlvbjtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy53aWR0aCAgPSB0aGlzLm91dGVyV2lkdGggIC0gdGhpcy5tYXJnaW5zLmxlZnQgLSB0aGlzLm1hcmdpbnMucmlnaHQ7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5vdXRlckhlaWdodCAtIHRoaXMubWFyZ2lucy50b3AgIC0gdGhpcy5tYXJnaW5zLmJvdHRvbTtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy5zdmcuYXR0cihcIndpZHRoXCIsIHRoaXMub3V0ZXJXaWR0aClcbiAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5vdXRlckhlaWdodClcbiAgICAgICAgICAgIC5zZWxlY3QoJ2dbbmFtZT1cInN2Z21haW5cIl0nKVxuICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7dGhpcy5tYXJnaW5zLmxlZnR9LCR7dGhpcy5tYXJnaW5zLnRvcH0pIHJvdGF0ZSgke3RoaXMucm90YXRpb259KSB0cmFuc2xhdGUoJHt0aGlzLnRyYW5zbGF0aW9uWzBdfSwke3RoaXMudHJhbnNsYXRpb25bMV19KWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2V0TWFyZ2lucyggdG0sIHJtLCBibSwgbG0gKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG5cdCAgICBybSA9IGJtID0gbG0gPSB0bTtcblx0fVxuXHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG5cdCAgICBibSA9IHRtO1xuXHQgICAgbG0gPSBybTtcblx0fVxuXHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSA0KVxuXHQgICAgdGhyb3cgXCJCYWQgYXJndW1lbnRzLlwiO1xuICAgICAgICAvL1xuXHR0aGlzLnNldEdlb20oe3RvcDogdG0sIHJpZ2h0OiBybSwgYm90dG9tOiBibSwgbGVmdDogbG19KTtcblx0Ly9cblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJvdGF0ZSAoZGVnKSB7XG4gICAgICAgIHRoaXMuc2V0R2VvbSh7cm90YXRpb246ZGVnfSk7XG5cdHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0cmFuc2xhdGUgKGR4LCBkeSkge1xuICAgICAgICB0aGlzLnNldEdlb20oe3RyYW5zbGF0aW9uOltkeCxkeV19KTtcblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICB0aGUgd2luZG93IHdpZHRoXG4gICAgZml0VG9XaWR0aCAod2lkdGgpIHtcbiAgICAgICAgbGV0IHIgPSB0aGlzLnN2Z1swXVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy5zZXRHZW9tKHt3aWR0aDogd2lkdGggLSByLnh9KVxuXHRyZXR1cm4gdGhpcztcbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIFNWR1ZpZXdcblxuZXhwb3J0IHsgU1ZHVmlldyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvU1ZHVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBNR1ZBcHAgfSBmcm9tICcuL01HVkFwcCc7XG5pbXBvcnQgeyByZW1vdmVEdXBzIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vL1xuLy8gcHFzdHJpbmcgPSBQYXJzZSBxc3RyaW5nLiBQYXJzZXMgdGhlIHBhcmFtZXRlciBwb3J0aW9uIG9mIHRoZSBVUkwuXG4vL1xuZnVuY3Rpb24gcHFzdHJpbmcgKHFzdHJpbmcpIHtcbiAgICAvL1xuICAgIGxldCBjZmcgPSB7fTtcblxuICAgIC8vIEZJWE1FOiBVUkxTZWFyY2hQYXJhbXMgQVBJIGlzIG5vdCBzdXBwb3J0ZWQgaW4gYWxsIGJyb3dzZXJzLlxuICAgIC8vIE9LIGZvciBkZXZlbG9wbWVudCBidXQgbmVlZCBhIGZhbGxiYWNrIGV2ZW50dWFsbHkuXG4gICAgbGV0IHBybXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHFzdHJpbmcpO1xuICAgIGxldCBnZW5vbWVzID0gW107XG5cbiAgICAvLyAtLS0tLSBnZW5vbWVzIC0tLS0tLS0tLS0tLVxuICAgIGxldCBwZ2Vub21lcyA9IHBybXMuZ2V0KFwiZ2Vub21lc1wiKSB8fCBcIlwiO1xuICAgIC8vIEZvciBub3csIGFsbG93IFwiY29tcHNcIiBhcyBzeW5vbnltIGZvciBcImdlbm9tZXNcIi4gRXZlbnR1YWxseSwgZG9uJ3Qgc3VwcG9ydCBcImNvbXBzXCIuXG4gICAgcGdlbm9tZXMgPSAocGdlbm9tZXMgKyAgXCIgXCIgKyAocHJtcy5nZXQoXCJjb21wc1wiKSB8fCBcIlwiKSk7XG4gICAgLy9cbiAgICBwZ2Vub21lcyA9IHJlbW92ZUR1cHMocGdlbm9tZXMudHJpbSgpLnNwbGl0KC8gKy8pKTtcbiAgICBwZ2Vub21lcy5sZW5ndGggPiAwICYmIChjZmcuZ2Vub21lcyA9IHBnZW5vbWVzKTtcblxuICAgIC8vIC0tLS0tIHJlZiBnZW5vbWUgLS0tLS0tLS0tLS0tXG4gICAgbGV0IHJlZiA9IHBybXMuZ2V0KFwicmVmXCIpO1xuICAgIHJlZiAmJiAoY2ZnLnJlZiA9IHJlZik7XG5cbiAgICAvLyAtLS0tLSBoaWdobGlnaHQgSURzIC0tLS0tLS0tLS0tLS0tXG4gICAgbGV0IGhscyA9IG5ldyBTZXQoKTtcbiAgICBsZXQgaGxzMCA9IHBybXMuZ2V0KFwiaGlnaGxpZ2h0XCIpO1xuICAgIGlmIChobHMwKSB7XG5cdGhsczAgPSBobHMwLnJlcGxhY2UoL1sgLF0rL2csICcgJykuc3BsaXQoJyAnKS5maWx0ZXIoeD0+eCk7XG5cdGhsczAubGVuZ3RoID4gMCAmJiAoY2ZnLmhpZ2hsaWdodCA9IGhsczApO1xuICAgIH1cblxuICAgIC8vIC0tLS0tIGNvb3JkaW5hdGVzIC0tLS0tLS0tLS0tLS0tXG4gICAgLy9cbiAgICBsZXQgY2hyICAgPSBwcm1zLmdldChcImNoclwiKTtcbiAgICBsZXQgc3RhcnQgPSBwcm1zLmdldChcInN0YXJ0XCIpO1xuICAgIGxldCBlbmQgICA9IHBybXMuZ2V0KFwiZW5kXCIpO1xuICAgIGNociAgICYmIChjZmcuY2hyID0gY2hyKTtcbiAgICBzdGFydCAmJiAoY2ZnLnN0YXJ0ID0gcGFyc2VJbnQoc3RhcnQpKTtcbiAgICBlbmQgICAmJiAoY2ZnLmVuZCA9IHBhcnNlSW50KGVuZCkpO1xuICAgIC8vXG4gICAgbGV0IGxhbmRtYXJrID0gcHJtcy5nZXQoXCJsYW5kbWFya1wiKTtcbiAgICBsZXQgZmxhbmsgICAgPSBwcm1zLmdldChcImZsYW5rXCIpO1xuICAgIGxldCBsZW5ndGggICA9IHBybXMuZ2V0KFwibGVuZ3RoXCIpO1xuICAgIGxldCBkZWx0YSAgICA9IHBybXMuZ2V0KFwiZGVsdGFcIik7XG4gICAgbGFuZG1hcmsgJiYgKGNmZy5sYW5kbWFyayA9IGxhbmRtYXJrKTtcbiAgICBmbGFuayAgICAmJiAoY2ZnLmZsYW5rID0gcGFyc2VJbnQoZmxhbmspKTtcbiAgICBsZW5ndGggICAmJiAoY2ZnLmxlbmd0aCA9IHBhcnNlSW50KGxlbmd0aCkpO1xuICAgIGRlbHRhICAgICYmIChjZmcuZGVsdGEgPSBwYXJzZUludChkZWx0YSkpO1xuICAgIC8vXG4gICAgLy8gLS0tLS0gZHJhd2luZyBtb2RlIC0tLS0tLS0tLS0tLS1cbiAgICBsZXQgZG1vZGUgPSBwcm1zLmdldChcImRtb2RlXCIpO1xuICAgIGRtb2RlICYmIChjZmcuZG1vZGUgPSBkbW9kZSk7XG4gICAgLy9cbiAgICByZXR1cm4gY2ZnO1xufVxuXG5cbi8vIFRoZSBtYWluIHByb2dyYW0sIHdoZXJlaW4gdGhlIGFwcCBpcyBjcmVhdGVkIGFuZCB3aXJlZCB0byB0aGUgYnJvd3Nlci4gXG4vL1xuZnVuY3Rpb24gX19tYWluX18gKHNlbGVjdG9yKSB7XG4gICAgLy8gQmVob2xkLCB0aGUgTUdWIGFwcGxpY2F0aW9uIG9iamVjdC4uLlxuICAgIGxldCBtZ3YgPSBudWxsO1xuXG4gICAgLy8gQ2FsbGJhY2sgdG8gcGFzcyBpbnRvIHRoZSBhcHAgdG8gcmVnaXN0ZXIgY2hhbmdlcyBpbiBjb250ZXh0LlxuICAgIC8vIFVzZXMgdGhlIGN1cnJlbnQgYXBwIGNvbnRleHQgdG8gc2V0IHRoZSBoYXNoIHBhcnQgb2YgdGhlXG4gICAgLy8gYnJvd3NlcidzIGxvY2F0aW9uLiBUaGlzIGFsc28gcmVnaXN0ZXJzIHRoZSBjaGFuZ2UgaW4gXG4gICAgLy8gdGhlIGJyb3dzZXIgaGlzdG9yeS5cbiAgICBmdW5jdGlvbiBzZXRIYXNoICgpIHtcblx0bGV0IG5ld0hhc2ggPSBtZ3YuZ2V0UGFyYW1TdHJpbmcoKTtcblx0aWYgKCcjJytuZXdIYXNoID09PSB3aW5kb3cubG9jYXRpb24uaGFzaClcblx0ICAgIHJldHVybjtcblx0Ly8gdGVtcG9yYXJpbHkgZGlzYWJsZSBwb3BzdGF0ZSBoYW5kbGVyXG5cdGxldCBmID0gd2luZG93Lm9ucG9wc3RhdGU7XG5cdHdpbmRvdy5vbnBvcHN0YXRlID0gbnVsbDtcblx0Ly8gbm93IHNldCB0aGUgaGFzaFxuXHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IG5ld0hhc2g7XG5cdC8vIHJlLWVuYWJsZVxuXHR3aW5kb3cub25wb3BzdGF0ZSA9IGY7XG4gICAgfVxuICAgIC8vIEhhbmRsZXIgY2FsbGVkIHdoZW4gdXNlciBjbGlja3MgdGhlIGJyb3dzZXIncyBiYWNrIG9yIGZvcndhcmQgYnV0dG9ucy5cbiAgICAvLyBTZXRzIHRoZSBhcHAncyBjb250ZXh0IGJhc2VkIG9uIHRoZSBoYXNoIHBhcnQgb2YgdGhlIGJyb3dzZXInc1xuICAgIC8vIGxvY2F0aW9uLlxuICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0bGV0IGNmZyA9IHBxc3RyaW5nKGRvY3VtZW50LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcblx0bWd2LnNldENvbnRleHQoY2ZnLCB0cnVlKTtcbiAgICB9O1xuICAgIC8vIGdldCBpbml0aWFsIHNldCBvZiBjb250ZXh0IHBhcmFtcyBcbiAgICBsZXQgcXN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKTtcbiAgICBsZXQgY2ZnID0gcHFzdHJpbmcocXN0cmluZyk7XG4gICAgY2ZnLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgY2ZnLm9uY29udGV4dGNoYW5nZSA9IHNldEhhc2g7XG5cbiAgICAvLyBjcmVhdGUgdGhlIGFwcFxuICAgIHdpbmRvdy5tZ3YgPSBtZ3YgPSBuZXcgTUdWQXBwKHNlbGVjdG9yLCBjZmcpO1xuICAgIFxuICAgIC8vIGhhbmRsZSByZXNpemUgZXZlbnRzXG4gICAgd2luZG93Lm9ucmVzaXplID0gKCkgPT4ge21ndi5yZXNpemUoKTttZ3Yuc2V0Q29udGV4dCh7fSk7fVxufVxuXG5cbl9fbWFpbl9fKFwiI21ndlwiKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL3ZpZXdlci5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBwYXJzZUNvb3JkcywgZm9ybWF0Q29vcmRzLCBkM3RzdiwgaW5pdE9wdExpc3QsIHNhbWUsIGNsaXAgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEdlbm9tZSB9ICAgICAgICAgIGZyb20gJy4vR2Vub21lJztcbmltcG9ydCB7IENvbXBvbmVudCB9ICAgICAgIGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IEZlYXR1cmVNYW5hZ2VyIH0gIGZyb20gJy4vRmVhdHVyZU1hbmFnZXInO1xuaW1wb3J0IHsgUXVlcnlNYW5hZ2VyIH0gICAgZnJvbSAnLi9RdWVyeU1hbmFnZXInO1xuaW1wb3J0IHsgTGlzdE1hbmFnZXIgfSAgICAgZnJvbSAnLi9MaXN0TWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0RWRpdG9yIH0gICAgICBmcm9tICcuL0xpc3RFZGl0b3InO1xuaW1wb3J0IHsgVXNlclByZWZzTWFuYWdlciB9IGZyb20gJy4vVXNlclByZWZzTWFuYWdlcic7XG5pbXBvcnQgeyBGYWNldE1hbmFnZXIgfSAgICBmcm9tICcuL0ZhY2V0TWFuYWdlcic7XG5pbXBvcnQgeyBCVE1hbmFnZXIgfSAgICAgICBmcm9tICcuL0JUTWFuYWdlcic7XG5pbXBvcnQgeyBHZW5vbWVWaWV3IH0gICAgICBmcm9tICcuL0dlbm9tZVZpZXcnO1xuaW1wb3J0IHsgRmVhdHVyZURldGFpbHMgfSAgZnJvbSAnLi9GZWF0dXJlRGV0YWlscyc7XG5pbXBvcnQgeyBab29tVmlldyB9ICAgICAgICBmcm9tICcuL1pvb21WaWV3JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBNR1ZBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChzZWxlY3RvciwgY2ZnKSB7XG5cdHN1cGVyKG51bGwsIHNlbGVjdG9yKTtcblx0dGhpcy5hcHAgPSB0aGlzO1xuXHQvL1xuXHR0aGlzLmluaXRpYWxDZmcgPSBjZmc7XG5cdC8vXG5cdHRoaXMuY29udGV4dENoYW5nZWQgPSAoY2ZnLm9uY29udGV4dGNoYW5nZSB8fCBmdW5jdGlvbigpe30pO1xuXHQvL1xuXHR0aGlzLm5hbWUyZ2Vub21lID0ge307ICAvLyBtYXAgZnJvbSBnZW5vbWUgbmFtZSAtPiBnZW5vbWUgZGF0YSBvYmpcblx0dGhpcy5sYWJlbDJnZW5vbWUgPSB7fTsgLy8gbWFwIGZyb20gZ2Vub21lIGxhYmVsIC0+IGdlbm9tZSBkYXRhIG9ialxuXHR0aGlzLm5sMmdlbm9tZSA9IHt9OyAgICAvLyBjb21iaW5lcyBpbmRleGVzXG5cdC8vXG5cdHRoaXMuYWxsR2Vub21lcyA9IFtdOyAgIC8vIGxpc3Qgb2YgYWxsIGF2YWlsYWJsZSBnZW5vbWVzXG5cdHRoaXMuckdlbm9tZSA9IG51bGw7ICAgIC8vIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBnZW5vbWVcblx0dGhpcy5jR2Vub21lcyA9IFtdOyAgICAgLy8gY3VycmVudCBjb21wYXJpc29uIGdlbm9tZXMgKHJHZW5vbWUgaXMgKm5vdCogaW5jbHVkZWQpLlxuXHR0aGlzLnZHZW5vbWVzID0gW107XHQvLyBsaXN0IG9mIGFsbCBjdXJyZW50eSB2aWV3ZWQgZ2Vub21lcyAocmVmK2NvbXBzKSBpbiBZLW9yZGVyLlxuXHQvL1xuXHR0aGlzLmR1ciA9IDI1MDsgICAgICAgICAvLyBhbmltYXRpb24gZHVyYXRpb24sIGluIG1zXG5cdHRoaXMuZGVmYXVsdFpvb20gPSAyO1x0Ly8gbXVsdGlwbGllciBvZiBjdXJyZW50IHJhbmdlIHdpZHRoLiBNdXN0IGJlID49IDEuIDEgPT0gbm8gem9vbS5cblx0XHRcdFx0Ly8gKHpvb21pbmcgaW4gdXNlcyAxL3RoaXMgYW1vdW50KVxuXHR0aGlzLmRlZmF1bHRQYW4gID0gMC4xNTsvLyBmcmFjdGlvbiBvZiBjdXJyZW50IHJhbmdlIHdpZHRoXG5cblx0Ly8gQ29vcmRpbmF0ZXMgbWF5IGJlIHNwZWNpZmllZCBpbiBvbmUgb2YgdHdvIHdheXM6IG1hcHBlZCBvciBsYW5kbWFyay4gXG5cdC8vIE1hcHBlZCBjb29yZGluYXRlcyBhcmUgc3BlY2lmaWVkIGFzIGNocm9tb3NvbWUrc3RhcnQrZW5kLiBUaGlzIGNvb3JkaW5hdGUgcmFuZ2UgaXMgZGVmaW5lZCByZWxhdGl2ZSB0byBcblx0Ly8gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZSwgYW5kIGlzIG1hcHBlZCB0byB0aGUgY29ycmVzcG9uZGluZyByYW5nZShzKSBpbiBlYWNoIGNvbXBhcmlzb24gZ2Vub21lLlxuXHQvLyBMYW5kbWFyayBjb29yZGluYXRlcyBhcmUgc3BlY2lmaWVkIGFzIGxhbmRtYXJrK1tmbGFua3x3aWR0aF0rZGVsdGEuIFRoZSBsYW5kbWFyayBpcyBsb29rZWQgdXAgaW4gZWFjaCBcblx0Ly8gZ2Vub21lLiBJdHMgY29vcmRpbmF0ZXMsIGNvbWJpbmVkIHdpdGggZmxhbmt8bGVuZ3RoIGFuZCBkZWx0YSwgZGV0ZXJtaW5lIHRoZSBhYnNvbHV0ZSBjb29yZGluYXRlIHJhbmdlXG5cdC8vIGluIHRoYXQgZ2Vub21lLiBJZiB0aGUgbGFuZG1hcmsgZG9lcyBub3QgZXhpc3QgaW4gYSBnaXZlbiBnZW5vbWUsIHRoZW4gbWFwcGVkIGNvb3JkaW5hdGUgYXJlIHVzZWQuXG5cdC8vIFxuXHR0aGlzLmNtb2RlID0gJ21hcHBlZCcgLy8gJ21hcHBlZCcgb3IgJ2xhbmRtYXJrJ1xuXHR0aGlzLmNvb3JkcyA9IHsgY2hyOiAnMScsIHN0YXJ0OiAxMDAwMDAwLCBlbmQ6IDEwMDAwMDAwIH07ICAvLyBtYXBwZWRcblx0dGhpcy5sY29vcmRzID0geyBsYW5kbWFyazogJ1BheDYnLCBmbGFuazogNTAwMDAwLCBkZWx0YTowIH07Ly8gbGFuZG1hcmtcblxuXHR0aGlzLmluaXREb20oKTtcblxuXHQvL1xuXHQvL1xuXHR0aGlzLmdlbm9tZVZpZXcgPSBuZXcgR2Vub21lVmlldyh0aGlzLCAnI2dlbm9tZVZpZXcnLCA4MDAsIDI1MCk7XG5cdHRoaXMuem9vbVZpZXcgICA9IG5ldyBab29tVmlldyAgKHRoaXMsICcjem9vbVZpZXcnLCA4MDAsIDI1MCwgdGhpcy5jb29yZHMpO1xuXHR0aGlzLnJlc2l6ZSgpO1xuICAgICAgICAvL1xuXHR0aGlzLmZlYXR1cmVEZXRhaWxzID0gbmV3IEZlYXR1cmVEZXRhaWxzKHRoaXMsICcjZmVhdHVyZURldGFpbHMnKTtcblxuXHQvLyBDYXRlZ29yaWNhbCBjb2xvciBzY2FsZSBmb3IgZmVhdHVyZSB0eXBlc1xuXHR0aGlzLmNzY2FsZSA9IGQzLnNjYWxlLmNhdGVnb3J5MTAoKS5kb21haW4oW1xuXHQgICAgJ3Byb3RlaW5fY29kaW5nX2dlbmUnLFxuXHQgICAgJ3BzZXVkb2dlbmUnLFxuXHQgICAgJ25jUk5BX2dlbmUnLFxuXHQgICAgJ2dlbmVfc2VnbWVudCcsXG5cdCAgICAnb3RoZXJfZ2VuZScsXG5cdCAgICAnb3RoZXJfZmVhdHVyZV90eXBlJ1xuXHRdKTtcblx0Ly9cblx0Ly9cblx0dGhpcy5saXN0TWFuYWdlciAgICA9IG5ldyBMaXN0TWFuYWdlcih0aGlzLCBcIiNteWxpc3RzXCIpO1xuXHR0aGlzLmxpc3RNYW5hZ2VyLnVwZGF0ZSgpO1xuXHQvL1xuXHR0aGlzLmxpc3RFZGl0b3IgPSBuZXcgTGlzdEVkaXRvcih0aGlzLCAnI2xpc3RlZGl0b3InKTtcblx0Ly9cblx0dGhpcy50cmFuc2xhdG9yICAgICA9IG5ldyBCVE1hbmFnZXIodGhpcyk7XG5cdHRoaXMuZmVhdHVyZU1hbmFnZXIgPSBuZXcgRmVhdHVyZU1hbmFnZXIodGhpcyk7XG5cdHRoaXMucXVlcnlNYW5hZ2VyID0gbmV3IFF1ZXJ5TWFuYWdlcih0aGlzLCBcIiNmaW5kR2VuZXNCb3hcIik7XG5cdC8vXG5cdHRoaXMudXNlclByZWZzTWFuYWdlciA9IG5ldyBVc2VyUHJlZnNNYW5hZ2VyKCk7XG5cdFxuXHQvL1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIEZhY2V0c1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vXG5cdHRoaXMuZmFjZXRNYW5hZ2VyID0gbmV3IEZhY2V0TWFuYWdlcih0aGlzKTtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdC8vIEZlYXR1cmUtdHlwZSBmYWNldFxuXHRsZXQgZnRGYWNldCAgPSB0aGlzLmZhY2V0TWFuYWdlci5hZGRGYWNldChcIkZlYXR1cmVUeXBlXCIsIGYgPT4gZi5nZXRNdW5nZWRUeXBlKCkpO1xuXHR0aGlzLmluaXRGZWF0VHlwZUNvbnRyb2woZnRGYWNldCk7XG5cblx0Ly8gSGFzLU1HSS1pZCBmYWNldFxuXHRsZXQgbWdpRmFjZXQgPSB0aGlzLmZhY2V0TWFuYWdlci5hZGRGYWNldChcIkhhc01naUlkXCIsICAgIGYgPT4gZi5tZ2lpZCAgPyBcInllc1wiIDogXCJub1wiICk7XG5cdGQzLnNlbGVjdEFsbCgnaW5wdXRbbmFtZT1cIm1naUZhY2V0XCJdJykub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKXtcblx0ICAgIG1naUZhY2V0LnNldFZhbHVlcyh0aGlzLnZhbHVlID09PSBcIlwiID8gW10gOiBbdGhpcy52YWx1ZV0pO1xuXHQgICAgc2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0fSk7XG5cblx0Ly8gSXMtaGlnaGxpZ2h0ZWQgZmFjZXRcblx0bGV0IGhpRmFjZXQgPSB0aGlzLmZhY2V0TWFuYWdlci5hZGRGYWNldChcIklzSGlcIiwgZiA9PiB7XG5cdCAgICBsZXQgaXNoaSA9IHRoaXMuem9vbVZpZXcuaGlGZWF0c1tmLm1naWlkXSB8fCB0aGlzLnpvb21WaWV3LmhpRmVhdHNbZi5tZ3BpZF07XG5cdCAgICByZXR1cm4gaXNoaSA/IFwieWVzXCIgOiBcIm5vXCI7XG5cdH0pO1xuXHRkMy5zZWxlY3RBbGwoJ2lucHV0W25hbWU9XCJoaUZhY2V0XCJdJykub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKXtcblx0ICAgIGhpRmFjZXQuc2V0VmFsdWVzKHRoaXMudmFsdWUgPT09IFwiXCIgPyBbXSA6IFt0aGlzLnZhbHVlXSk7XG5cdCAgICBzZWxmLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9KTtcblxuXG5cdC8vXG5cdHRoaXMuc2V0VUlGcm9tUHJlZnMoKTtcblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0Ly8gVGhpbmdzIGFyZSBhbGwgd2lyZWQgdXAuIE5vdyBsZXQncyBnZXQgc29tZSBkYXRhLlxuXHQvLyBTdGFydCB3aXRoIHRoZSBmaWxlIG9mIGFsbCB0aGUgZ2Vub21lcy5cblx0ZDN0c3YoXCIuL2RhdGEvZ2Vub21lTGlzdC50c3ZcIikudGhlbihkYXRhID0+IHtcblx0ICAgIC8vIGNyZWF0ZSBHZW5vbWUgb2JqZWN0cyBmcm9tIHRoZSByYXcgZGF0YS5cblx0ICAgIHRoaXMuYWxsR2Vub21lcyAgID0gZGF0YS5tYXAoZyA9PiBuZXcgR2Vub21lKGcpKTtcblx0ICAgIHRoaXMuYWxsR2Vub21lcy5zb3J0KCAoYSxiKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuIGEubGFiZWwgPCBiLmxhYmVsID8gLTEgOiBhLmxhYmVsID4gYi5sYWJlbCA/ICsxIDogMDtcblx0ICAgIH0pO1xuXHQgICAgLy9cblx0ICAgIC8vIGJ1aWxkIGEgbmFtZS0+R2Vub21lIGluZGV4XG5cdCAgICB0aGlzLm5sMmdlbm9tZSA9IHt9OyAvLyBhbHNvIGJ1aWxkIHRoZSBjb21iaW5lZCBsaXN0IGF0IHRoZSBzYW1lIHRpbWUuLi5cblx0ICAgIHRoaXMubmFtZTJnZW5vbWUgID0gdGhpcy5hbGxHZW5vbWVzXG5cdCAgICAgICAgLnJlZHVjZSgoYWNjLGcpID0+IHsgdGhpcy5ubDJnZW5vbWVbZy5uYW1lXSA9IGFjY1tnLm5hbWVdID0gZzsgcmV0dXJuIGFjYzsgfSwge30pO1xuXHQgICAgLy8gYnVpbGQgYSBsYWJlbC0+R2Vub21lIGluZGV4XG5cdCAgICB0aGlzLmxhYmVsMmdlbm9tZSA9IHRoaXMuYWxsR2Vub21lc1xuXHQgICAgICAgIC5yZWR1Y2UoKGFjYyxnKSA9PiB7IHRoaXMubmwyZ2Vub21lW2cubGFiZWxdID0gYWNjW2cubGFiZWxdID0gZzsgcmV0dXJuIGFjYzsgfSwge30pO1xuXG5cdCAgICAvLyBOb3cgcHJlbG9hZCBhbGwgdGhlIGNocm9tb3NvbWUgZmlsZXMgZm9yIGFsbCB0aGUgZ2Vub21lc1xuXHQgICAgbGV0IGNkcHMgPSB0aGlzLmFsbEdlbm9tZXMubWFwKGcgPT4gZDN0c3YoYC4vZGF0YS9nZW5vbWVkYXRhLyR7Zy5uYW1lfS1jaHJvbW9zb21lcy50c3ZgKSk7XG5cdCAgICByZXR1cm4gUHJvbWlzZS5hbGwoY2Rwcyk7XG5cdH0pXG5cdC50aGVuKCBkYXRhID0+IHtcblxuXHQgICAgLy9cblx0ICAgIHRoaXMucHJvY2Vzc0Nocm9tb3NvbWVzKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5pbml0RG9tUGFydDIoKTtcblx0ICAgIC8vXG5cdCAgICAvLyBGSU5BTExZISBXZSBhcmUgcmVhZHkgdG8gZHJhdyB0aGUgaW5pdGlhbCBzY2VuZS5cblx0ICAgIHRoaXMuc2V0Q29udGV4dCh0aGlzLmluaXRpYWxDZmcpO1xuXG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBcbiAgICBpbml0RG9tICgpIHtcblx0c2VsZiA9IHRoaXM7XG5cdC8vXG5cdC8vIFRPRE86IHJlZmFjdG9yIHBhZ2Vib3gsIGRyYWdnYWJsZSwgYW5kIGZyaWVuZHMgaW50byBhIGZyYW1ld29yayBtb2R1bGUsXG5cdC8vIFxuXHR0aGlzLnBiRHJhZ2dlciA9IHRoaXMuZ2V0Q29udGVudERyYWdnZXIoKTtcblx0ZDMuc2VsZWN0QWxsKCcucGFnZWJveCcpXG5cdCAgICAuY2FsbCh0aGlzLnBiRHJhZ2dlcilcblx0ICAgIC5hcHBlbmQoJ2knKVxuXHQgICAgLmF0dHIoJ2NsYXNzJywnbWF0ZXJpYWwtaWNvbnMgYnVzeSByb3RhdGluZycpXG5cdCAgICA7XG5cdGQzLnNlbGVjdEFsbCgnLmNsb3NhYmxlJylcblx0ICAgIC5hcHBlbmQoJ2knKVxuXHRcdC5hdHRyKCdjbGFzcycsJ21hdGVyaWFsLWljb25zIGJ1dHRvbiBjbG9zZScpXG5cdFx0LmF0dHIoJ3RpdGxlJywnQ2xpY2sgdG8gb3Blbi9jbG9zZS4nKVxuXHRcdC5vbignY2xpY2suZGVmYXVsdCcsIGZ1bmN0aW9uICgpIHtcblx0XHQgICAgbGV0IHAgPSBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlKTtcblx0XHQgICAgcC5jbGFzc2VkKCdjbG9zZWQnLCAhIHAuY2xhc3NlZCgnY2xvc2VkJykpO1xuXHRcdCAgICBkMy5zZWxlY3QodGhpcykuYXR0cigndGl0bGUnLCdDbGljayB0byAnICsgIChwLmNsYXNzZWQoJ2Nsb3NlZCcpID8gJ29wZW4nIDogJ2Nsb3NlJykgKyAnLicpXG5cdFx0ICAgIHNlbGYuc2V0UHJlZnNGcm9tVUkoKTtcblx0XHR9KTtcblx0ZDMuc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUgPiAqJylcblx0ICAgIC5hcHBlbmQoJ2knKVxuXHRcdC5hdHRyKCd0aXRsZScsJ0RyYWcgdXAvZG93biB0byByZXBvc2l0aW9uLicpXG5cdFx0LmF0dHIoJ2NsYXNzJywnbWF0ZXJpYWwtaWNvbnMgYnV0dG9uIGRyYWdoYW5kbGUnKTtcblxuXHQvLyBcbiAgICAgICAgZDMuc2VsZWN0KCcjc3RhdHVzTWVzc2FnZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4geyB0aGlzLnNob3dTdGF0dXMoZmFsc2UpOyB9KTtcblx0XG5cdC8vXG5cdC8vIEJ1dHRvbjogR2VhciBpY29uIHRvIHNob3cvaGlkZSBsZWZ0IGNvbHVtblxuXHRkMy5zZWxlY3QoXCIjaGVhZGVyID4gLmdlYXIuYnV0dG9uXCIpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IGxjID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJsZWZ0Y29sdW1uXCJdJyk7XG5cdFx0bGMuY2xhc3NlZChcImNsb3NlZFwiLCAoKSA9PiAhIGxjLmNsYXNzZWQoXCJjbG9zZWRcIikpO1xuXHRcdHdpbmRvdy5zZXRUaW1lb3V0KCgpPT57XG5cdFx0ICAgIHRoaXMucmVzaXplKClcblx0XHQgICAgdGhpcy5zZXRDb250ZXh0KHt9KTtcblx0XHQgICAgdGhpcy5zZXRQcmVmc0Zyb21VSSgpO1xuXHRcdH0sIDI1MCk7XG5cdCAgICB9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRG9tIGluaXRpYWxpenRpb24gdGhhdCBtdXN0IHdhaXQgdW50aWwgYWZ0ZXIgZ2Vub21lIG1ldGEgZGF0YSBpcyBsb2FkZWQuXG4gICAgaW5pdERvbVBhcnQyICgpIHtcblx0Ly9cblx0bGV0IGNmZyA9IHRoaXMuc2FuaXRpemVDZmcodGhpcy5pbml0aWFsQ2ZnKTtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdC8vIGluaXRpYWxpemUgdGhlIHJlZiBhbmQgY29tcCBnZW5vbWUgb3B0aW9uIGxpc3RzXG5cdGluaXRPcHRMaXN0KFwiI3JlZkdlbm9tZVwiLCAgIHRoaXMuYWxsR2Vub21lcywgZz0+Zy5uYW1lLCBnPT5nLmxhYmVsLCBmYWxzZSwgZyA9PiBnID09PSBjZmcucmVmKTtcblx0aW5pdE9wdExpc3QoXCIjY29tcEdlbm9tZXNcIiwgdGhpcy5hbGxHZW5vbWVzLCBnPT5nLm5hbWUsIGc9PmcubGFiZWwsIHRydWUsICBnID0+IGNmZy5nZW5vbWVzLmluZGV4T2YoZykgIT09IC0xKTtcblx0ZDMuc2VsZWN0KFwiI3JlZkdlbm9tZVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0ICAgIHNlbGYuc2V0Q29udGV4dCh7IHJlZjogdGhpcy52YWx1ZSB9KTtcblx0fSk7XG5cdGQzLnNlbGVjdChcIiNjb21wR2Vub21lc1wiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0ICAgIGxldCBzZWxlY3RlZE5hbWVzID0gW107XG5cdCAgICBmb3IobGV0IHggb2YgdGhpcy5zZWxlY3RlZE9wdGlvbnMpe1xuXHRcdHNlbGVjdGVkTmFtZXMucHVzaCh4LnZhbHVlKTtcblx0ICAgIH1cblx0ICAgIC8vIHdhbnQgdG8gcHJlc2VydmUgY3VycmVudCBnZW5vbWUgb3JkZXIgYXMgbXVjaCBhcyBwb3NzaWJsZSBcblx0ICAgIGxldCBnTmFtZXMgPSBzZWxmLnZHZW5vbWVzLm1hcChnPT5nLm5hbWUpXG5cdFx0LmZpbHRlcihuID0+IHtcblx0XHQgICAgcmV0dXJuIHNlbGVjdGVkTmFtZXMuaW5kZXhPZihuKSA+PSAwIHx8IG4gPT09IHNlbGYuckdlbm9tZS5uYW1lO1xuXHRcdH0pO1xuXHQgICAgZ05hbWVzID0gZ05hbWVzLmNvbmNhdChzZWxlY3RlZE5hbWVzLmZpbHRlcihuID0+IGdOYW1lcy5pbmRleE9mKG4pID09PSAtMSkpO1xuXHQgICAgc2VsZi5zZXRDb250ZXh0KHsgZ2Vub21lczogZ05hbWVzIH0pO1xuXHR9KTtcblx0ZDN0c3YoXCIuL2RhdGEvZ2Vub21lU2V0cy50c3ZcIikudGhlbihzZXRzID0+IHtcblx0ICAgIC8vIENyZWF0ZSBzZWxlY3Rpb24gYnV0dG9ucy5cblx0ICAgIHNldHMuZm9yRWFjaCggcyA9PiBzLmdlbm9tZXMgPSBzLmdlbm9tZXMuc3BsaXQoXCIsXCIpICk7XG5cdCAgICBsZXQgY2diID0gZDMuc2VsZWN0KCcjY29tcEdlbm9tZXNCb3gnKS5zZWxlY3RBbGwoJ2J1dHRvbicpLmRhdGEoc2V0cyk7XG5cdCAgICBjZ2IuZW50ZXIoKS5hcHBlbmQoJ2J1dHRvbicpXG5cdFx0LnRleHQoZD0+ZC5uYW1lKVxuXHRcdC5hdHRyKCd0aXRsZScsIGQ9PmQuZGVzY3JpcHRpb24pXG5cdFx0Lm9uKCdjbGljaycsIGQgPT4ge1xuXHRcdCAgICBzZWxmLnNldENvbnRleHQoZCk7XG5cdFx0fSlcblx0XHQ7XG5cdH0pLmNhdGNoKCgpPT57XG5cdCAgICBjb25zb2xlLmxvZyhcIk5vIGdlbm9tZVNldHMgZmlsZSBmb3VuZC5cIik7XG5cdH0pOyAvLyBPSyBpZiBubyBnZW5vbWVTZXRzIGZpbGVcblxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBwcm9jZXNzQ2hyb21vc29tZXMgKGRhdGEpIHtcblx0Ly8gZGF0YSBpcyBhIGxpc3Qgb2YgY2hyb21vc29tZSBsaXN0cywgb25lIHBlciBnZW5vbWVcblx0Ly8gRmlsbCBpbiB0aGUgZ2Vub21lQ2hycyBtYXAgKGdlbm9tZSAtPiBjaHIgbGlzdClcblx0dGhpcy5hbGxHZW5vbWVzLmZvckVhY2goKGcsaSkgPT4ge1xuXHQgICAgLy8gbmljZWx5IHNvcnQgdGhlIGNocm9tb3NvbWVzXG5cdCAgICBsZXQgY2hycyA9IGRhdGFbaV07XG5cdCAgICBnLm1heGxlbiA9IDA7XG5cdCAgICBjaHJzLmZvckVhY2goIGMgPT4ge1xuXHRcdC8vXG5cdFx0Yy5sZW5ndGggPSBwYXJzZUludChjLmxlbmd0aClcblx0XHRnLm1heGxlbiA9IE1hdGgubWF4KGcubWF4bGVuLCBjLmxlbmd0aCk7XG5cdFx0Ly8gYmVjYXVzZSBJJ2QgcmF0aGVyIHNheSBcImNocm9tb3NvbWUubmFtZVwiIHRoYW4gXCJjaHJvbW9zb21lLmNocm9tb3NvbWVcIlxuXHRcdGMubmFtZSA9IGMuY2hyb21vc29tZTtcblx0XHRkZWxldGUgYy5jaHJvbW9zb21lO1xuXHQgICAgfSk7XG5cdCAgICAvLyBuaWNlbHkgc29ydCB0aGUgY2hyb21vc29tZXNcblx0ICAgIGNocnMuc29ydCgoYSxiKSA9PiB7XG5cdFx0bGV0IGFhID0gcGFyc2VJbnQoYS5uYW1lKSAtIHBhcnNlSW50KGIubmFtZSk7XG5cdFx0aWYgKCFpc05hTihhYSkpIHJldHVybiBhYTtcblx0XHRyZXR1cm4gYS5uYW1lIDwgYi5uYW1lID8gLTEgOiBhLm5hbWUgPiBiLm5hbWUgPyArMSA6IDA7XG5cdCAgICB9KTtcblx0ICAgIGcuY2hyb21vc29tZXMgPSBjaHJzO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0Q29udGVudERyYWdnZXIgKCkge1xuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgLy8gSGVscGVyIGZ1bmN0aW9uIGZvciB0aGUgZHJhZyBiZWhhdmlvci4gUmVvcmRlcnMgdGhlIGNvbnRlbnRzIGJhc2VkIG9uXG4gICAgICAvLyBjdXJyZW50IHNjcmVlbiBwb3NpdGlvbiBvZiB0aGUgZHJhZ2dlZCBpdGVtLlxuICAgICAgZnVuY3Rpb24gcmVvcmRlckJ5RG9tKCkge1xuXHQgIC8vIExvY2F0ZSB0aGUgc2liIHdob3NlIHBvc2l0aW9uIGlzIGJleW9uZCB0aGUgZHJhZ2dlZCBpdGVtIGJ5IHRoZSBsZWFzdCBhbW91bnRcblx0ICBsZXQgZHIgPSBzZWxmLmRyYWdnaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIGxldCBiU2liID0gbnVsbDtcblx0ICBsZXQgeHkgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnUGFyZW50KS5jbGFzc2VkKFwiZmxleHJvd1wiKSA/IFwieFwiIDogXCJ5XCI7XG5cdCAgZm9yIChsZXQgcyBvZiBzZWxmLmRyYWdTaWJzKSB7XG5cdCAgICAgIGxldCBzciA9IHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIGlmIChkclt4eV0gPCBzclt4eV0pIHtcblx0XHQgICBsZXQgZGlzdCA9IHNyW3h5XSAtIGRyW3h5XTtcblx0XHQgICBpZiAoIWJTaWIgfHwgZGlzdCA8IGJTaWJbeHldIC0gZHJbeHldKVxuXHRcdCAgICAgICBiU2liID0gcztcblx0ICAgICAgfVxuXHQgIH1cblx0ICAvLyBJbnNlcnQgdGhlIGRyYWdnZWQgaXRlbSBiZWZvcmUgdGhlIGxvY2F0ZWQgc2liIChvciBhcHBlbmQgaWYgbm8gc2liIGZvdW5kKVxuXHQgIHNlbGYuZHJhZ1BhcmVudC5pbnNlcnRCZWZvcmUoc2VsZi5kcmFnZ2luZywgYlNpYik7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiByZW9yZGVyQnlTdHlsZSgpIHtcblx0ICBsZXQgZGQgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZyk7XG5cdCAgLy8gTG9jYXRlIHRoZSBzaWIgdGhhdCBjb250YWlucyB0aGUgZHJhZ2dlZCBpdGVtJ3Mgb3JpZ2luLlxuXHQgIGxldCBkciA9IHNlbGYuZHJhZ2dpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgbGV0IGJTaWIgPSBudWxsO1xuXHQgIGxldCB4eSA9IGQzLnNlbGVjdChzZWxmLmRyYWdQYXJlbnQpLmNsYXNzZWQoXCJmbGV4cm93XCIpID8gXCJ4XCIgOiBcInlcIjtcblx0ICBsZXQgc3ogPSB4eSA9PT0gXCJ4XCIgPyBcIndpZHRoXCIgOiBcImhlaWdodFwiO1xuXHQgIGxldCBzdHk9IHh5ID09PSBcInhcIiA/IFwibGVmdFwiIDogXCJ0b3BcIjtcblx0ICBmb3IgKGxldCBzIG9mIHNlbGYuZHJhZ1NpYnMpIHtcblx0ICAgICAgLy8gc2tpcCB0aGUgZHJhZ2dlZCBpdGVtXG5cdCAgICAgIGlmIChzID09PSBzZWxmLmRyYWdnaW5nKSBjb250aW51ZTtcblx0ICAgICAgbGV0IGRzID0gZDMuc2VsZWN0KHMpO1xuXHQgICAgICBsZXQgc3IgPSBzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICAvLyBpZncgdGhlIGRyYWdnZWQgaXRlbSdzIG9yaWdpbiBpcyBiZXR3ZWVuIHRoZSBzdGFydCBhbmQgZW5kIG9mIHNpYiwgd2UgZm91bmQgaXQuXG5cdCAgICAgIGlmIChkclt4eV0gPj0gc3JbeHldICYmIGRyW3h5XSA8PSAoc3JbeHldICsgc3Jbc3pdKSkge1xuXHRcdCAgIC8vIG1vdmUgc2liIHRvd2FyZCB0aGUgaG9sZSwgYW1vdW50ID0gdGhlIHNpemUgb2YgdGhlIGhvbGVcblx0XHQgICBsZXQgYW10ID0gc2VsZi5kcmFnSG9sZVtzel0gKiAoc2VsZi5kcmFnSG9sZVt4eV0gPCBzclt4eV0gPyAtMSA6IDEpO1xuXHRcdCAgIGRzLnN0eWxlKHN0eSwgcGFyc2VJbnQoZHMuc3R5bGUoc3R5KSkgKyBhbXQgKyBcInB4XCIpO1xuXHRcdCAgIHNlbGYuZHJhZ0hvbGVbeHldIC09IGFtdDtcbiAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgfVxuXHQgIH1cbiAgICAgIH1cbiAgICAgIC8vXG4gICAgICByZXR1cm4gZDMuYmVoYXZpb3IuZHJhZygpXG5cdCAgLm9yaWdpbihmdW5jdGlvbihkLGkpe1xuXHQgICAgICByZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICB9KVxuICAgICAgICAgIC5vbihcImRyYWdzdGFydC5tXCIsIGZ1bmN0aW9uKCkge1xuXHQgICAgICBsZXQgdCA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50LnRhcmdldDtcblx0ICAgICAgaWYgKCEgZDMuc2VsZWN0KHQpLmNsYXNzZWQoXCJkcmFnaGFuZGxlXCIpKSByZXR1cm47XG5cdCAgICAgIGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICAvL1xuXHQgICAgICBzZWxmLmRyYWdnaW5nICAgID0gdGhpcy5jbG9zZXN0KFwiLnBhZ2Vib3hcIik7XG5cdCAgICAgIHNlbGYuZHJhZ0hvbGUgICAgPSBzZWxmLmRyYWdnaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICBzZWxmLmRyYWdQYXJlbnQgID0gc2VsZi5kcmFnZ2luZy5wYXJlbnROb2RlO1xuXHQgICAgICBzZWxmLmRyYWdTaWJzICAgID0gc2VsZi5kcmFnUGFyZW50LmNoaWxkcmVuO1xuXHQgICAgICAvL1xuXHQgICAgICBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZykuY2xhc3NlZChcImRyYWdnaW5nXCIsIHRydWUpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZy5tXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIGxldCBkZCA9IGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKTtcblx0ICAgICAgbGV0IHRwID0gcGFyc2VJbnQoZGQuc3R5bGUoXCJ0b3BcIikpXG5cdCAgICAgIGRkLnN0eWxlKFwidG9wXCIsIHRwICsgZDMuZXZlbnQuZHkgKyBcInB4XCIpO1xuXHQgICAgICAvL3Jlb3JkZXJCeVN0eWxlKCk7XG5cdCAgfSlcblx0ICAub24oXCJkcmFnZW5kLm1cIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgcmVvcmRlckJ5RG9tKCk7XG5cdCAgICAgIHNlbGYuc2V0UHJlZnNGcm9tVUkoKTtcblx0ICAgICAgbGV0IGRkID0gZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpO1xuXHQgICAgICBkZC5zdHlsZShcInRvcFwiLCBcIjBweFwiKTtcblx0ICAgICAgZGQuY2xhc3NlZChcImRyYWdnaW5nXCIsIGZhbHNlKTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZyAgICA9IG51bGw7XG5cdCAgICAgIHNlbGYuZHJhZ0hvbGUgICAgPSBudWxsO1xuXHQgICAgICBzZWxmLmRyYWdQYXJlbnQgID0gbnVsbDtcblx0ICAgICAgc2VsZi5kcmFnU2licyAgICA9IG51bGw7XG5cdCAgfSlcblx0ICA7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldFVJRnJvbVByZWZzICgpIHtcbiAgICAgICAgbGV0IHByZWZzID0gdGhpcy51c2VyUHJlZnNNYW5hZ2VyLmdldEFsbCgpO1xuXHRjb25zb2xlLmxvZyhcIkdvdCBwcmVmcyBmcm9tIHN0b3JhZ2VcIiwgcHJlZnMpO1xuXG5cdC8vIHNldCBvcGVuL2Nsb3NlZCBzdGF0ZXNcblx0KHByZWZzLmNsb3NhYmxlcyB8fCBbXSkuZm9yRWFjaCggYyA9PiB7XG5cdCAgICBsZXQgaWQgPSBjWzBdO1xuXHQgICAgbGV0IHN0YXRlID0gY1sxXTtcblx0ICAgIGQzLnNlbGVjdCgnIycraWQpLmNsYXNzZWQoJ2Nsb3NlZCcsIHN0YXRlID09PSBcImNsb3NlZFwiIHx8IG51bGwpO1xuXHR9KTtcblxuXHQvLyBzZXQgZHJhZ2dhYmxlcycgb3JkZXJcblx0KHByZWZzLmRyYWdnYWJsZXMgfHwgW10pLmZvckVhY2goIGQgPT4ge1xuXHQgICAgbGV0IGN0cklkID0gZFswXTtcblx0ICAgIGxldCBjb250ZW50SWRzID0gZFsxXTtcblx0ICAgIGxldCBjdHIgPSBkMy5zZWxlY3QoJyMnK2N0cklkKTtcblx0ICAgIGxldCBjb250ZW50cyA9IGN0ci5zZWxlY3RBbGwoJyMnK2N0cklkKycgPiAqJyk7XG5cdCAgICBjb250ZW50c1swXS5zb3J0KCAoYSxiKSA9PiB7XG5cdCAgICAgICAgbGV0IGFpID0gY29udGVudElkcy5pbmRleE9mKGEuZ2V0QXR0cmlidXRlKCdpZCcpKTtcblx0ICAgICAgICBsZXQgYmkgPSBjb250ZW50SWRzLmluZGV4T2YoYi5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuXHRcdHJldHVybiBhaSAtIGJpO1xuXHQgICAgfSk7XG5cdCAgICBjb250ZW50cy5vcmRlcigpO1xuXHR9KTtcbiAgICB9XG4gICAgc2V0UHJlZnNGcm9tVUkgKCkge1xuICAgICAgICAvLyBzYXZlIG9wZW4vY2xvc2VkIHN0YXRlc1xuXHRsZXQgY2xvc2FibGVzID0gdGhpcy5yb290LnNlbGVjdEFsbCgnLmNsb3NhYmxlJyk7XG5cdGxldCBvY0RhdGEgPSBjbG9zYWJsZXNbMF0ubWFwKCBjID0+IHtcblx0ICAgIGxldCBkYyA9IGQzLnNlbGVjdChjKTtcblx0ICAgIHJldHVybiBbZGMuYXR0cignaWQnKSwgZGMuY2xhc3NlZChcImNsb3NlZFwiKSA/IFwiY2xvc2VkXCIgOiBcIm9wZW5cIl07XG5cdH0pO1xuXHQvLyBzYXZlIGRyYWdnYWJsZXMnIG9yZGVyXG5cdGxldCBkcmFnQ3RycyA9IHRoaXMucm9vdC5zZWxlY3RBbGwoJy5jb250ZW50LWRyYWdnYWJsZScpO1xuXHRsZXQgZHJhZ2dhYmxlcyA9IGRyYWdDdHJzLnNlbGVjdEFsbCgnLmNvbnRlbnQtZHJhZ2dhYmxlID4gKicpO1xuXHRsZXQgZGREYXRhID0gZHJhZ2dhYmxlcy5tYXAoIChkLGkpID0+IHtcblx0ICAgIGxldCBjdHIgPSBkMy5zZWxlY3QoZHJhZ0N0cnNbMF1baV0pO1xuXHQgICAgcmV0dXJuIFtjdHIuYXR0cignaWQnKSwgZC5tYXAoIGRkID0+IGQzLnNlbGVjdChkZCkuYXR0cignaWQnKSldO1xuXHR9KTtcblx0bGV0IHByZWZzID0ge1xuXHQgICAgY2xvc2FibGVzOiBvY0RhdGEsXG5cdCAgICBkcmFnZ2FibGVzOiBkZERhdGFcblx0fVxuXHRjb25zb2xlLmxvZyhcIlNhdmluZyBwcmVmcyB0byBzdG9yYWdlXCIsIHByZWZzKTtcblx0dGhpcy51c2VyUHJlZnNNYW5hZ2VyLnNldEFsbChwcmVmcyk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dCbG9ja3MgKGNvbXApIHtcblx0bGV0IHJlZiA9IHRoaXMuckdlbm9tZTtcblx0aWYgKCEgY29tcCkgY29tcCA9IHRoaXMuY0dlbm9tZXNbMF07XG5cdGlmICghIGNvbXApIHJldHVybjtcblx0dGhpcy50cmFuc2xhdG9yLnJlYWR5KCkudGhlbiggKCkgPT4ge1xuXHQgICAgbGV0IGJsb2NrcyA9IGNvbXAgPT09IHJlZiA/IFtdIDogdGhpcy50cmFuc2xhdG9yLmdldEJsb2NrcyhyZWYsIGNvbXApO1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdCbG9ja3MoeyByZWYsIGNvbXAsIGJsb2NrcyB9KTtcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dCdXN5IChpc0J1c3ksIG1lc3NhZ2UpIHtcbiAgICAgICAgZDMuc2VsZWN0KFwiI2hlYWRlciA+IC5nZWFyLmJ1dHRvblwiKVxuXHQgICAgLmNsYXNzZWQoXCJyb3RhdGluZ1wiLCBpc0J1c3kpO1xuICAgICAgICBkMy5zZWxlY3QoXCIjem9vbVZpZXdcIikuY2xhc3NlZChcImJ1c3lcIiwgaXNCdXN5KTtcblx0aWYgKGlzQnVzeSAmJiBtZXNzYWdlKSB0aGlzLnNob3dTdGF0dXMobWVzc2FnZSk7XG5cdGlmICghaXNCdXN5KSB0aGlzLnNob3dTdGF0dXMoJycpXG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dTdGF0dXMgKG1zZykge1xuXHRpZiAobXNnKVxuXHQgICAgZDMuc2VsZWN0KCcjc3RhdHVzTWVzc2FnZScpXG5cdFx0LmNsYXNzZWQoJ3Nob3dpbmcnLCB0cnVlKVxuXHRcdC5zZWxlY3QoJ3NwYW4nKVxuXHRcdCAgICAudGV4dChtc2cpO1xuXHRlbHNlXG5cdCAgICBkMy5zZWxlY3QoJyNzdGF0dXNNZXNzYWdlJykuY2xhc3NlZCgnc2hvd2luZycsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRSZWZHZW5vbWVTZWxlY3Rpb24gKCkge1xuXHRkMy5zZWxlY3RBbGwoXCIjcmVmR2Vub21lIG9wdGlvblwiKVxuXHQgICAgLnByb3BlcnR5KFwic2VsZWN0ZWRcIiwgIGdnID0+IChnZy5sYWJlbCA9PT0gdGhpcy5yR2Vub21lLmxhYmVsICB8fCBudWxsKSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldENvbXBHZW5vbWVzU2VsZWN0aW9uICgpIHtcblx0bGV0IGNnbnMgPSB0aGlzLnZHZW5vbWVzLm1hcChnPT5nLmxhYmVsKTtcblx0ZDMuc2VsZWN0QWxsKFwiI2NvbXBHZW5vbWVzIG9wdGlvblwiKVxuXHQgICAgICAgIC5wcm9wZXJ0eShcInNlbGVjdGVkXCIsICBnZyA9PiBjZ25zLmluZGV4T2YoZ2cubGFiZWwpID49IDApO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTZXRzIG9yIHJldHVybnNcbiAgICBzZXRIaWdobGlnaHQgKGZsaXN0KSB7XG5cdGlmICghZmxpc3QpIHJldHVybiBmYWxzZTtcblx0dGhpcy56b29tVmlldy5oaUZlYXRzID0gZmxpc3QucmVkdWNlKChhLHYpID0+IHsgYVt2XT12OyByZXR1cm4gYTsgfSwge30pO1xuXHRyZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgY3VycmVudCBjb250ZXh0IGFzIGFuIG9iamVjdC5cbiAgICAvLyBDdXJyZW50IGNvbnRleHQgPSByZWYgZ2Vub21lICsgY29tcCBnZW5vbWVzICsgY3VycmVudCByYW5nZSAoY2hyLHN0YXJ0LGVuZClcbiAgICBnZXRDb250ZXh0ICgpIHtcblx0aWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKSB7XG5cdCAgICBsZXQgYyA9IHRoaXMuY29vcmRzO1xuXHQgICAgcmV0dXJuIHtcblx0XHRyZWYgOiB0aGlzLnJHZW5vbWUubGFiZWwsXG5cdFx0Z2Vub21lczogdGhpcy52R2Vub21lcy5tYXAoZz0+Zy5sYWJlbCksXG5cdFx0Y2hyOiBjLmNocixcblx0XHRzdGFydDogYy5zdGFydCxcblx0XHRlbmQ6IGMuZW5kLFxuXHRcdGhpZ2hsaWdodDogT2JqZWN0LmtleXModGhpcy56b29tVmlldy5oaUZlYXRzKS5zb3J0KCksXG5cdFx0ZG1vZGU6IHRoaXMuem9vbVZpZXcuZG1vZGVcblx0ICAgIH1cblx0fSBlbHNlIHtcblx0ICAgIGxldCBjID0gdGhpcy5sY29vcmRzO1xuXHQgICAgcmV0dXJuIHtcblx0XHRyZWYgOiB0aGlzLnJHZW5vbWUubGFiZWwsXG5cdFx0Z2Vub21lczogdGhpcy52R2Vub21lcy5tYXAoZz0+Zy5sYWJlbCksXG5cdFx0bGFuZG1hcms6IGMubGFuZG1hcmssXG5cdFx0Zmxhbms6IGMuZmxhbmssXG5cdFx0bGVuZ3RoOiBjLmxlbmd0aCxcblx0XHRkZWx0YTogYy5kZWx0YSxcblx0XHRoaWdobGlnaHQ6IE9iamVjdC5rZXlzKHRoaXMuem9vbVZpZXcuaGlGZWF0cykuc29ydCgpLFxuXHRcdGRtb2RlOiB0aGlzLnpvb21WaWV3LmRtb2RlXG5cdCAgICB9XG5cdH1cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmVzb2x2ZXMgdGhlIHNwZWNpZmllZCBsYW5kbWFyayB0byBhIGZlYXR1cmUgYW5kIHRoZSBsaXN0IG9mIGVxdWl2YWxlbnQgZmVhdXJlcy5cbiAgICAvLyBNYXkgYmUgZ2l2ZW4gYW4gaWQsIGNhbm9uaWNhbCBpZCwgb3Igc3ltYm9sLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIGNmZyAob2JqKSBTYW5pdGl6ZWQgY29uZmlnIG9iamVjdCwgd2l0aCBhIGxhbmRtYXJrIChzdHJpbmcpIGZpZWxkLlxuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgIFRoZSBjZmcgb2JqZWN0LCB3aXRoIGFkZGl0aW9uYWwgZmllbGRzOlxuICAgIC8vICAgICAgICBsYW5kbWFya1JlZkZlYXQ6IHRoZSBsYW5kbWFyayAoRmVhdHVyZSBvYmopIGluIHRoZSByZWYgZ2Vub21lXG4gICAgLy8gICAgICAgIGxhbmRtYXJrRmVhdHM6IFsgZXF1aXZhbGVudCBmZWF0dXJlcyBpbiBlYWNoIGdlbm9tZSAoaW5jbHVkZXMgcmYpXVxuICAgIC8vICAgICBBbHNvLCBjaGFuZ2VzIHJlZiB0byBiZSB0aGUgZ2Vub21lIG9mIHRoZSBsYW5kbWFya1JlZkZlYXRcbiAgICAvLyAgICAgUmV0dXJucyBudWxsIGlmIGxhbmRtYXJrIG5vdCBmb3VuZCBpbiBhbnkgZ2Vub21lLlxuICAgIC8vIFxuICAgIHJlc29sdmVMYW5kbWFyayAoY2ZnKSB7XG5cdGxldCByZiwgZmVhdHM7XG5cdC8vIEZpbmQgdGhlIGxhbmRtYXJrIGZlYXR1cmUgaW4gdGhlIHJlZiBnZW5vbWUuIFxuXHRyZiA9IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsKGNmZy5sYW5kbWFyaywgY2ZnLnJlZilbMF07XG5cdGlmICghcmYpIHtcblx0ICAgIC8vIExhbmRtYXJrIGRvZXMgbm90IGV4aXN0IGluIHJlZiBnZW5vbWUuIERvZXMgaXQgZXhpc3QgaW4gYW55IHNwZWNpZmllZCBnZW5vbWU/XG5cdCAgICByZiA9IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsKGNmZy5sYW5kbWFyaykuZmlsdGVyKGYgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihmLmdlbm9tZSkgPj0gMClbMF07XG5cdCAgICBpZiAocmYpIHtcblx0ICAgICAgICBjZmcucmVmID0gcmYuZ2Vub21lO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgLy8gTGFuZG1hcmsgY2Fubm90IGJlIHJlc29sdmVkLlxuXHRcdHJldHVybiBudWxsO1xuXHQgICAgfVxuXHR9XG5cdC8vIGxhbmRtYXJrIGV4aXN0cyBpbiByZWYgZ2Vub21lLiBHZXQgZXF1aXZhbGVudCBmZWF0IGluIGVhY2ggZ2Vub21lLlxuXHRmZWF0cyA9IHJmLmNhbm9uaWNhbCA/IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkKHJmLmNhbm9uaWNhbCkgOiBbcmZdO1xuXHRjZmcubGFuZG1hcmtSZWZGZWF0ID0gcmY7XG5cdGNmZy5sYW5kbWFya0ZlYXRzID0gZmVhdHMuZmlsdGVyKGYgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihmLmdlbm9tZSkgPj0gMCk7XG5cdHJldHVybiBjZmc7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBzYW5pdGl6ZWQgdmVyc2lvbiBvZiB0aGUgYXJndW1lbnQgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAgLy8gVGhlIHNhbml0aXplZCB2ZXJzaW9uOlxuICAgIC8vICAgICAtIGhhcyBhIHNldHRpbmcgZm9yIGV2ZXJ5IHBhcmFtZXRlci4gUGFyYW1ldGVycyBub3Qgc3BlY2lmaWVkIGluIFxuICAgIC8vICAgICAgIHRoZSBhcmd1bWVudCBhcmUgKGdlbmVyYWxseSkgZmlsbGVkIGluIHdpdGggdGhlaXIgY3VycmVudCB2YWx1ZXMuXG4gICAgLy8gICAgIC0gaXMgYWx3YXlzIHZhbGlkLCBlZ1xuICAgIC8vICAgICBcdC0gaGFzIGEgbGlzdCBvZiAxIG9yIG1vcmUgdmFsaWQgZ2Vub21lcywgd2l0aCBvbmUgb2YgdGhlbSBkZXNpZ25hdGVkIGFzIHRoZSByZWZcbiAgICAvLyAgICAgXHQtIGhhcyBhIHZhbGlkIGNvb3JkaW5hdGUgcmFuZ2VcbiAgICAvLyAgICAgXHQgICAgLSBzdGFydCBhbmQgZW5kIGFyZSBpbnRlZ2VycyB3aXRoIHN0YXJ0IDw9IGVuZFxuICAgIC8vICAgICBcdCAgICAtIHZhbGlkIGNocm9tb3NvbWUgZm9yIHJlZiBnZW5vbWVcbiAgICAvL1xuICAgIC8vIFRoZSBzYW5pdGl6ZWQgdmVyc2lvbiBpcyBhbHNvIFwiY29tcGlsZWRcIjpcbiAgICAvLyAgICAgLSBpdCBoYXMgYWN0dWFsIEdlbm9tZSBvYmplY3RzLCB3aGVyZSB0aGUgYXJndW1lbnQganVzdCBoYXMgbmFtZXNcbiAgICAvLyAgICAgLSBncm91cHMgdGhlIGNocitzdGFydCtlbmQgaW4gXCJjb29yZHNcIiBvYmplY3RcbiAgICAvL1xuICAgIC8vXG4gICAgc2FuaXRpemVDZmcgKGMpIHtcblx0bGV0IGNmZyA9IHt9O1xuXG5cdC8vIFNhbml0aXplIHRoZSBpbnB1dC5cblxuXHQvLyB3aW5kb3cgc2l6ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRpZiAoYy53aWR0aCkge1xuXHQgICAgY2ZnLndpZHRoID0gYy53aWR0aFxuXHR9XG5cblx0Ly8gcmVmIGdlbm9tZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0Ly8gU2V0IGNmZy5yZWYgdG8gc3BlY2lmaWVkIGdlbm9tZSwgXG5cdC8vICAgd2l0aCBmYWxsYmFjayB0byBjdXJyZW50IHJlZiBnZW5vbWUsIFxuXHQvLyAgICAgIHdpdGggZmFsbGJhY2sgdG8gQzU3QkwvNkogKDFzdCB0aW1lIHRocnUpXG5cdC8vIEZJWE1FOiBmaW5hbCBmYWxsYmFjayBzaG91bGQgYmUgYSBjb25maWcgc2V0dGluZy5cblx0Y2ZnLnJlZiA9IChjLnJlZiA/IHRoaXMubmwyZ2Vub21lW2MucmVmXSB8fCB0aGlzLnJHZW5vbWUgOiB0aGlzLnJHZW5vbWUpIHx8IHRoaXMubmwyZ2Vub21lWydDNTdCTC82SiddO1xuXG5cdC8vIGNvbXBhcmlzb24gZ2Vub21lcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIFNldCBjZmcuZ2Vub21lcyB0byBiZSB0aGUgc3BlY2lmaWVkIGdlbm9tZXMsXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGdlbm9tZXNcblx0Ly8gICAgICAgIHdpdGggZmFsbGJhY2sgdG8gW3JlZl0gKDFzdCB0aW1lIHRocnUpXG5cdGNmZy5nZW5vbWVzID0gYy5nZW5vbWVzID9cblx0ICAgIChjLmdlbm9tZXMubWFwKGcgPT4gdGhpcy5ubDJnZW5vbWVbZ10pLmZpbHRlcih4PT54KSlcblx0ICAgIDpcblx0ICAgIHRoaXMudkdlbm9tZXM7XG5cdC8vIEFkZCByZWYgdG8gZ2Vub21lcyBpZiBub3QgdGhlcmUgYWxyZWFkeVxuXHRpZiAoY2ZnLmdlbm9tZXMuaW5kZXhPZihjZmcucmVmKSA9PT0gLTEpXG5cdCAgICBjZmcuZ2Vub21lcy51bnNoaWZ0KGNmZy5yZWYpO1xuXHRcblx0Ly8gYWJzb2x1dGUgY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0Ly8gU2V0IGNmZy5jaHIgdG8gYmUgdGhlIHNwZWNpZmllZCBjaHJvbW9zb21lXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGNoclxuXHQvLyAgICAgICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIDFzdCBjaHJvbW9zb21lIGluIHRoZSByZWYgZ2Vub21lXG5cdGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoYy5jaHIpO1xuXHRpZiAoIWNmZy5jaHIpIGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoIHRoaXMuY29vcmRzID8gdGhpcy5jb29yZHMuY2hyIDogXCIxXCIgKTtcblx0aWYgKCFjZmcuY2hyKSBjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKDApO1xuXHRpZiAoIWNmZy5jaHIpIHRocm93IFwiTm8gY2hyb21vc29tZS5cIlxuXHRcblx0Ly8gU2V0IGNmZy5zdGFydCB0byBiZSB0aGUgc3BlY2lmaWVkIHN0YXJ0IHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgc3RhcnRcblx0Ly8gQ2xpcCBhdCBjaHIgYm91bmRhcmllc1xuXHRjZmcuc3RhcnQgPSBjbGlwKE1hdGgucm91bmQodHlwZW9mKGMuc3RhcnQpID09PSBcIm51bWJlclwiID8gYy5zdGFydCA6IHRoaXMuY29vcmRzLnN0YXJ0KSwgMSwgY2ZnLmNoci5sZW5ndGgpO1xuXG5cdC8vIFNldCBjZmcuZW5kIHRvIGJlIHRoZSBzcGVjaWZpZWQgZW5kIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgZW5kXG5cdC8vIENsaXAgYXQgY2hyIGJvdW5kYXJpZXNcblx0Y2ZnLmVuZCA9IGNsaXAoTWF0aC5yb3VuZCh0eXBlb2YoYy5lbmQpID09PSBcIm51bWJlclwiID8gYy5lbmQgOiB0aGlzLmNvb3Jkcy5lbmQpLCAxLCBjZmcuY2hyLmxlbmd0aCk7XG5cblx0Ly8gRW5zdXJlIHN0YXJ0IDw9IGVuZFxuXHRpZiAoY2ZnLnN0YXJ0ID4gY2ZnLmVuZCkge1xuXHQgICBsZXQgdG1wID0gY2ZnLnN0YXJ0OyBjZmcuc3RhcnQgPSBjZmcuZW5kOyBjZmcuZW5kID0gdG1wO1xuXHR9XG5cblx0Ly8gbGFuZG1hcmsgY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gTk9URSB0aGF0IGxhbmRtYXJrIGNvb3JkaW5hdGUgY2Fubm90IGJlIGZ1bGx5IHJlc29sdmVkIHRvIGFic29sdXRlIGNvb3JkaW5hdGUgdW50aWxcblx0Ly8gKmFmdGVyKiBnZW5vbWUgZGF0YSBoYXZlIGJlZW4gbG9hZGVkLiBTZWUgc2V0Q29udGV4dCBhbmQgcmVzb2x2ZUxhbmRtYXJrIG1ldGhvZHMuXG5cdGNmZy5sYW5kbWFyayA9IGMubGFuZG1hcmsgfHwgdGhpcy5sY29vcmRzLmxhbmRtYXJrO1xuXHRjZmcuZGVsdGEgICAgPSBNYXRoLnJvdW5kKCdkZWx0YScgaW4gYyA/IGMuZGVsdGEgOiAodGhpcy5sY29vcmRzLmRlbHRhIHx8IDApKTtcblx0aWYgKHR5cGVvZihjLmZsYW5rKSA9PT0gJ251bWJlcicpe1xuXHQgICAgY2ZnLmZsYW5rID0gTWF0aC5yb3VuZChjLmZsYW5rKTtcblx0fVxuXHRlbHNlIGlmICgnbGVuZ3RoJyBpbiBjKSB7XG5cdCAgICBjZmcubGVuZ3RoID0gTWF0aC5yb3VuZChjLmxlbmd0aCk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICBjZmcubGVuZ3RoID0gTWF0aC5yb3VuZCh0aGlzLmNvb3Jkcy5lbmQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDEpO1xuXHR9XG5cblx0Ly8gY21vZGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0aWYgKGMuY21vZGUgJiYgYy5jbW9kZSAhPT0gJ21hcHBlZCcgJiYgYy5jbW9kZSAhPT0gJ2xhbmRtYXJrJykgYy5jbW9kZSA9IG51bGw7XG5cdGNmZy5jbW9kZSA9IGMuY21vZGUgfHwgXG5cdCAgICAoKCdjaHInIGluIGMgfHwgJ3N0YXJ0JyBpbiBjIHx8ICdlbmQnIGluIGMpID9cblx0ICAgICAgICAnbWFwcGVkJyA6IFxuXHRcdCgnbGFuZG1hcmsnIGluIGMgfHwgJ2ZsYW5rJyBpbiBjIHx8ICdsZW5ndGgnIGluIGMgfHwgJ2RlbHRhJyBpbiBjKSA/XG5cdFx0ICAgICdsYW5kbWFyaycgOiBcblx0XHQgICAgdGhpcy5jbW9kZSB8fCAnbWFwcGVkJyk7XG5cblx0Ly8gaGlnaGxpZ2h0aW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gU2V0IGNmZy5oaWdobGlnaHRcblx0Ly8gICAgd2l0aCBmYWxsYmFjayB0byBjdXJyZW50IGhpZ2hsaWdodFxuXHQvLyAgICAgICAgd2l0aCBmYWxsYmFjayB0byBbXVxuXHRjZmcuaGlnaGxpZ2h0ID0gYy5oaWdobGlnaHQgfHwgdGhpcy56b29tVmlldy5oaWdobGlnaHRlZCB8fCBbXTtcblxuXHQvLyBkcmF3aW5nIG1vZGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBTZXQgdGhlIGRyYXdpbmcgbW9kZSBmb3IgdGhlIFpvb21WaWV3LlxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCB2YWx1ZVxuXHRpZiAoYy5kbW9kZSA9PT0gJ2NvbXBhcmlzb24nIHx8IGMuZG1vZGUgPT09ICdyZWZlcmVuY2UnKSBcblx0ICAgIGNmZy5kbW9kZSA9IGMuZG1vZGU7XG5cdGVsc2Vcblx0ICAgIGNmZy5kbW9kZSA9IHRoaXMuem9vbVZpZXcuZG1vZGUgfHwgJ2NvbXBhcmlzb24nO1xuXG5cdC8vXG5cdHJldHVybiBjZmc7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyB0aGUgY3VycmVudCBjb250ZXh0IGZyb20gdGhlIGNvbmZpZyBvYmplY3QuIFxuICAgIC8vIE9ubHkgdGhvc2UgY29udGV4dCBpdGVtcyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZyBhcmUgYWZmZWN0ZWQsIGV4Y2VwdCBhcyBub3RlZC5cbiAgICAvL1xuICAgIC8vIEFsbCBjb25maWdzIGFyZSBzYW5pdGl6ZWQgYmVmb3JlIGJlaW5nIGFwcGxpZWQgKHNlZSBzYW5pdGl6ZUNmZykuXG4gICAgLy8gXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBjIChvYmplY3QpIEEgY29uZmlndXJhdGlvbiBvYmplY3QgdGhhdCBzcGVjaWZpZXMgc29tZS9hbGwgY29uZmlnIHZhbHVlcy5cbiAgICAvLyAgICAgICAgIFRoZSBwb3NzaWJsZSBjb25maWcgaXRlbXM6XG4gICAgLy8gICAgICAgICAgICBnZW5vbWVzICAgKGxpc3QgbyBzdHJpbmdzKSBBbGwgdGhlIGdlbm9tZXMgeW91IHdhbnQgdG8gc2VlLCBpbiB0b3AtdG8tYm90dG9tIG9yZGVyLiBcbiAgICAvLyAgICAgICAgICAgICAgIE1heSB1c2UgaW50ZXJuYWwgbmFtZXMgb3IgZGlzcGxheSBsYWJlbHMsIGVnLCBcIm11c19tdXNjdWx1c18xMjlzMXN2aW1qXCIgb3IgXCIxMjlTMS9TdkltSlwiLlxuICAgIC8vICAgICAgICAgICAgcmVmICAgICAgIChzdHJpbmcpIFRoZSBnZW5vbWUgdG8gdXNlIGFzIHRoZSByZWZlcmVuY2UuIE1heSBiZSBuYW1lIG9yIGxhYmVsLlxuICAgIC8vICAgICAgICAgICAgaGlnaGxpZ2h0IChsaXN0IG8gc3RyaW5ncykgSURzIG9mIGZlYXR1cmVzIHRvIGhpZ2hsaWdodFxuICAgIC8vICAgICAgICAgICAgZG1vZGUgICAgIChzdHJpbmcpIGVpdGhlciAnY29tcGFyaXNvbicgb3IgJ3JlZmVyZW5jZSdcbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgQ29vcmRpbmF0ZXMgYXJlIHNwZWNpZmllZCBpbiBvbmUgb2YgMiBmb3Jtcy5cbiAgICAvLyAgICAgICAgICAgICAgY2hyICAgICAgIChzdHJpbmcpIENocm9tb3NvbWUgZm9yIGNvb3JkaW5hdGUgcmFuZ2VcbiAgICAvLyAgICAgICAgICAgICAgc3RhcnQgICAgIChpbnQpIENvb3JkaW5hdGUgcmFuZ2Ugc3RhcnQgcG9zaXRpb25cbiAgICAvLyAgICAgICAgICAgICAgZW5kICAgICAgIChpbnQpIENvb3JkaW5hdGUgcmFuZ2UgZW5kIHBvc2l0aW9uXG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgICAgRGlzcGxheXMgdGhpcyBjb29yZGluYXRlIHJhbmdlIGZyb20gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbmVvbXMsIGFuZCB0aGUgZXF1aXZhbGVudCAobWFwcGVkKVxuICAgIC8vICAgICAgICAgICAgICBjb29yZGluYXRlIHJhbmdlKHMpIGluIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIG9yOlxuICAgIC8vICAgICAgICAgICAgICBsYW5kbWFyayAgKHN0cmluZykgSUQsIGNhbm9uaWNhbCBJRCwgb3Igc3ltYm9sLCBpZGVudGlmeWluZyBhIGZlYXR1cmUuXG4gICAgLy8gICAgICAgICAgICAgIGZsYW5rfGxlbmd0aCAoaW50KSBJZiBmbGFuaywgdmlld2luZyByZWdpb24gc2l6ZSA9IGZsYW5rICsgbGVuKGxhbmRtYXJrKSArIGZsYW5rLiBcbiAgICAvLyAgICAgICAgICAgICAgICAgSWYgbGVuZ3RoLCB2aWV3aW5nIHJlZ2lvbiBzaXplID0gbGVuZ3RoLiBJbiBlaXRoZXIgY2FzZSwgdGhlIGxhbmRtYXJrIGlzIGNlbnRlcmVkIGluXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoZSB2aWV3aW5nIGFyZWEsICsvLSBhbnkgc3BlY2lmaWVkIGRlbHRhLlxuICAgIC8vICAgICAgICAgICAgICBkZWx0YSAgICAgKGludCkgQW1vdW50IGluIGJwIHRvIHNoaWZ0IHRoZSByZWdpb24gbGVmdCAoPDApIG9yIHJpZ2h0ICg+MCkuXG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgICAgRGlzcGxheXMgdGhlIHJlZ2lvbiBhcm91bmQgdGhlIHNwZWNpZmllZCBsYW5kbWFyayBpbiBlYWNoIGdlbm9tZSB3aGVyZSBpdCBleGlzdHMuXG4gICAgLy9cbiAgICAvLyAgICBxdWlldGx5IChib29sZWFuKSBJZiB0cnVlLCBkb24ndCB1cGRhdGUgYnJvd3NlciBoaXN0b3J5IChhcyB3aGVuIGdvaW5nIGJhY2spXG4gICAgLy9cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgIE5vdGhpbmdcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy9cdCAgUmVkcmF3cyBcbiAgICAvL1x0ICBDYWxscyBjb250ZXh0Q2hhbmdlZCgpIFxuICAgIC8vXG4gICAgc2V0Q29udGV4dCAoYywgcXVpZXRseSkge1xuICAgICAgICBsZXQgY2ZnID0gdGhpcy5zYW5pdGl6ZUNmZyhjKTtcblx0Ly9jb25zb2xlLmxvZyhcIlNldCBjb250ZXh0IChyYXcpOlwiLCBjKTtcblx0Ly9jb25zb2xlLmxvZyhcIlNldCBjb250ZXh0IChzYW5pdGl6ZWQpOlwiLCBjZmcpO1xuXHRpZiAoIWNmZykgcmV0dXJuO1xuXHR0aGlzLnNob3dCdXN5KHRydWUsICdSZXF1ZXN0aW5nIGRhdGEuLi4nKTtcblx0bGV0IHAgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmxvYWRHZW5vbWVzKGNmZy5nZW5vbWVzKS50aGVuKCgpID0+IHtcblx0ICAgIGlmIChjZmcuY21vZGUgPT09ICdsYW5kbWFyaycpIHtcblx0ICAgICAgICBjZmcgPSB0aGlzLnJlc29sdmVMYW5kbWFyayhjZmcpO1xuXHRcdGlmICghY2ZnKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTGFuZG1hcmsgZG9lcyBub3QgZXhpc3QgaW4gY3VycmVudCByZWZlcmVuY2UgZ2Vub21lLiBQbGVhc2UgY2hhbmdlIHRoZSByZWZlcmVuY2UgZ2Vub21lIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdCAgICB0aGlzLnNob3dCdXN5KGZhbHNlKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0ICAgIH1cblx0ICAgIHRoaXMudkdlbm9tZXMgPSBjZmcuZ2Vub21lcztcblx0ICAgIHRoaXMuckdlbm9tZSAgPSBjZmcucmVmO1xuXHQgICAgdGhpcy5jR2Vub21lcyA9IGNmZy5nZW5vbWVzLmZpbHRlcihnID0+IGcgIT09IGNmZy5yZWYpO1xuXHQgICAgdGhpcy5zZXRSZWZHZW5vbWVTZWxlY3Rpb24odGhpcy5yR2Vub21lLm5hbWUpO1xuXHQgICAgdGhpcy5zZXRDb21wR2Vub21lc1NlbGVjdGlvbih0aGlzLnZHZW5vbWVzLm1hcChnPT5nLm5hbWUpKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLmNtb2RlID0gY2ZnLmNtb2RlO1xuXHQgICAgLy9cblx0ICAgIHJldHVybiB0aGlzLnRyYW5zbGF0b3IucmVhZHkoKTtcblx0fSkudGhlbigoKSA9PiB7XG5cdCAgICAvL1xuXHQgICAgaWYgKCFjZmcpIHJldHVybjtcblx0ICAgIHRoaXMuY29vcmRzICAgPSB7XG5cdCAgICAgICAgY2hyOiBjZmcuY2hyLm5hbWUsXG5cdFx0Y2hyb21vc29tZTogY2ZnLmNocixcblx0XHRzdGFydDogY2ZnLnN0YXJ0LFxuXHRcdGVuZDogY2ZnLmVuZFxuXHQgICAgfTtcblx0ICAgIHRoaXMubGNvb3JkcyAgPSB7XG5cdCAgICAgICAgbGFuZG1hcms6IGNmZy5sYW5kbWFyaywgXG5cdFx0bGFuZG1hcmtSZWZGZWF0OiBjZmcubGFuZG1hcmtSZWZGZWF0LFxuXHRcdGxhbmRtYXJrRmVhdHM6IGNmZy5sYW5kbWFya0ZlYXRzLFxuXHRcdGZsYW5rOiBjZmcuZmxhbmssIFxuXHRcdGxlbmd0aDogY2ZnLmxlbmd0aCwgXG5cdFx0ZGVsdGE6IGNmZy5kZWx0YSBcblx0ICAgIH07XG5cdCAgICAvL1xuXHQgICAgdGhpcy56b29tVmlldy5oaWdobGlnaHRlZCA9IGNmZy5oaWdobGlnaHQ7XG5cdCAgICB0aGlzLnpvb21WaWV3Lmdlbm9tZXMgPSB0aGlzLnZHZW5vbWVzO1xuXHQgICAgdGhpcy56b29tVmlldy5kbW9kZSA9IGNmZy5kbW9kZTtcblx0ICAgIHRoaXMuem9vbVZpZXcudXBkYXRlKCk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LnJlZHJhdygpO1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LnNldEJydXNoQ29vcmRzKHRoaXMuY29vcmRzKTtcblx0ICAgIC8vXG5cdCAgICBpZiAoIXF1aWV0bHkpXG5cdCAgICAgICAgdGhpcy5jb250ZXh0Q2hhbmdlZCgpO1xuXHQgICAgLy9cblx0ICAgIHRoaXMuc2hvd0J1c3koZmFsc2UpO1xuXHR9KTtcblx0cmV0dXJuIHA7XG4gICAgfVxuIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldENvb3JkaW5hdGVzIChzdHIpIHtcblx0bGV0IGNvb3JkcyA9IHBhcnNlQ29vcmRzKHN0cik7XG5cdGlmICghIGNvb3Jkcykge1xuXHQgICAgbGV0IGZlYXRzID0gdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5TGFiZWwoc3RyKTtcblx0ICAgIGxldCBmZWF0czIgPSBmZWF0cy5maWx0ZXIoZj0+Zi5nZW5vbWUgPT0gdGhpcy5yR2Vub21lKTtcblx0ICAgIGxldCBmID0gZmVhdHMyWzBdIHx8IGZlYXRzWzBdO1xuXHQgICAgaWYgKGYpIHtcblx0XHRjb29yZHMgPSB7XG5cdFx0ICAgIHJlZjogZi5nZW5vbWUubmFtZSxcblx0XHQgICAgbGFuZG1hcms6IHN0cixcblx0XHQgICAgZGVsdGE6IDAsXG5cdFx0ICAgIGhpZ2hsaWdodDogZi5pZFxuXHRcdH1cblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHRcdGFsZXJ0KFwiVW5hYmxlIHRvIHNldCBjb29yZGluYXRlcyB3aXRoIHRoaXMgdmFsdWU6IFwiICsgc3RyKTtcblx0XHRyZXR1cm47XG5cdCAgICB9XG5cdH1cblx0dGhpcy5zZXRDb250ZXh0KGNvb3Jkcyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVzaXplICgpIHtcblx0bGV0IHcgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDI0O1xuXHR0aGlzLmdlbm9tZVZpZXcuZml0VG9XaWR0aCh3KTtcblx0dGhpcy56b29tVmlldy5maXRUb1dpZHRoKHcpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGNvbnRleHQgYXMgYSBwYXJhbWV0ZXIgc3RyaW5nXG4gICAgLy8gQ3VycmVudCBjb250ZXh0ID0gcmVmIGdlbm9tZSArIGNvbXAgZ2Vub21lcyArIGN1cnJlbnQgcmFuZ2UgKGNocixzdGFydCxlbmQpXG4gICAgZ2V0UGFyYW1TdHJpbmcgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuICAgICAgICBsZXQgcmVmID0gYHJlZj0ke2MucmVmfWA7XG4gICAgICAgIGxldCBnZW5vbWVzID0gYGdlbm9tZXM9JHtjLmdlbm9tZXMuam9pbihcIitcIil9YDtcblx0bGV0IGNvb3JkcyA9IGBjaHI9JHtjLmNocn0mc3RhcnQ9JHtjLnN0YXJ0fSZlbmQ9JHtjLmVuZH1gO1xuXHRsZXQgbGZsZiA9IGMuZmxhbmsgPyAnJmZsYW5rPScrYy5mbGFuayA6ICcmbGVuZ3RoPScrYy5sZW5ndGg7XG5cdGxldCBsY29vcmRzID0gYGxhbmRtYXJrPSR7Yy5sYW5kbWFya30mZGVsdGE9JHtjLmRlbHRhfSR7bGZsZn1gO1xuXHRsZXQgaGxzID0gYGhpZ2hsaWdodD0ke2MuaGlnaGxpZ2h0LmpvaW4oXCIrXCIpfWA7XG5cdGxldCBkbW9kZSA9IGBkbW9kZT0ke2MuZG1vZGV9YDtcblx0cmV0dXJuIGAke3RoaXMuY21vZGU9PT0nbWFwcGVkJz9jb29yZHM6bGNvb3Jkc30mJHtkbW9kZX0mJHtyZWZ9JiR7Z2Vub21lc30mJHtobHN9YDtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgY3VycmVudExpc3QgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyTGlzdDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0IGN1cnJlbnRMaXN0IChsc3QpIHtcbiAgICBcdC8vXG5cdGxldCBwcmV2TGlzdCA9IHRoaXMuY3Vyckxpc3Q7XG5cdHRoaXMuY3Vyckxpc3QgPSBsc3Q7XG5cdC8vXG5cdGxldCBsaXN0cyA9IGQzLnNlbGVjdCgnI215bGlzdHMnKS5zZWxlY3RBbGwoJy5saXN0SW5mbycpO1xuXHRsaXN0cy5jbGFzc2VkKFwiY3VycmVudFwiLCBkID0+IGQgPT09IGxzdCk7XG5cdC8vXG5cdGlmIChsc3QgJiYgbHN0Lmlkcy5sZW5ndGggPiAwKSB7XG5cdCAgICBpZiAobHN0ID09PSBwcmV2TGlzdClcblx0ICAgICAgICB0aGlzLmN1cnJMaXN0Q291bnRlciA9ICh0aGlzLmN1cnJMaXN0Q291bnRlciArIDEpICUgdGhpcy5jdXJyTGlzdC5pZHMubGVuZ3RoO1xuXHQgICAgZWxzZVxuXHQgICAgICAgIHRoaXMuY3Vyckxpc3RDb3VudGVyID0gMDtcblx0ICAgIGxldCBjdXJySWQgPSBsc3QuaWRzW3RoaXMuY3Vyckxpc3RDb3VudGVyXTtcblx0ICAgIC8vIHNob3cgdGhpcyBsaXN0IGFzIHRpY2sgbWFya3MgaW4gdGhlIGdlbm9tZSB2aWV3XG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd1RpY2tzKGxzdC5pZHMpO1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdUaXRsZSgpO1xuXHQgICAgdGhpcy5zZXRDb29yZGluYXRlcyhjdXJySWQpO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy5jdXJyTGlzdENvdW50ZXIgPSAwO1xuXHQgICAgLy9cblx0ICAgIHRoaXMuem9vbVZpZXcuaGlGZWF0cyA9IHt9O1xuXHQgICAgdGhpcy56b29tVmlldy51cGRhdGUoKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd1RpY2tzKFtdKTtcblx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3VGl0bGUoKTtcblx0fVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHBhbnpvb20ocGZhY3RvciwgemZhY3Rvcikge1xuXHQvL1xuXHQhcGZhY3RvciAmJiAocGZhY3RvciA9IDApO1xuXHQhemZhY3RvciAmJiAoemZhY3RvciA9IDEpO1xuXHQvL1xuXHRsZXQgYyA9IHRoaXMuY29vcmRzO1xuXHRsZXQgd2lkdGggPSBjLmVuZCAtIGMuc3RhcnQgKyAxO1xuXHRsZXQgbWlkID0gKGMuc3RhcnQgKyBjLmVuZCkvMjtcblx0bGV0IGNociA9IHRoaXMuckdlbm9tZS5jaHJvbW9zb21lcy5maWx0ZXIoYyA9PiBjLm5hbWUgPT09IHRoaXMuY29vcmRzLmNocilbMF07XG5cdGxldCBuY3h0ID0ge307IC8vIG5ldyBjb250ZXh0XG5cdGxldCBtaW5EID0gLShjLnN0YXJ0LTEpOyAvLyBtaW4gZGVsdGEgKGF0IGN1cnJlbnQgem9vbSlcblx0bGV0IG1heEQgPSBjaHIubGVuZ3RoIC0gYy5lbmQ7IC8vIG1heCBkZWx0YSAoYXQgY3VycmVudCB6b29tKVxuXHRsZXQgZCA9IGNsaXAocGZhY3RvciAqIHdpZHRoLCBtaW5ELCBtYXhEKTsgLy8gZGVsdGEgKGF0IG5ldyB6b29tKVxuXHRsZXQgbmV3d2lkdGggPSB6ZmFjdG9yICogd2lkdGg7XG5cdGxldCBuZXdzdGFydCA9IG1pZCAtIG5ld3dpZHRoLzIgKyBkO1xuXHQvL1xuXHRpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpIHtcblx0ICAgIG5jeHQuY2hyID0gYy5jaHI7XG5cdCAgICBuY3h0LnN0YXJ0ID0gbmV3c3RhcnQ7XG5cdCAgICBuY3h0LmVuZCA9IG5ld3N0YXJ0ICsgbmV3d2lkdGggLSAxO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgbmN4dC5sZW5ndGggPSBuZXd3aWR0aDtcblx0ICAgIG5jeHQuZGVsdGEgPSB0aGlzLmxjb29yZHMuZGVsdGEgKyBkIDtcblx0fVxuXHR0aGlzLnNldENvbnRleHQobmN4dCk7XG4gICAgfVxuICAgIHpvb20gKGZhY3Rvcikge1xuICAgICAgICB0aGlzLnBhbnpvb20obnVsbCwgZmFjdG9yKTtcbiAgICB9XG4gICAgcGFuIChmYWN0b3IpIHtcbiAgICAgICAgdGhpcy5wYW56b29tKGZhY3RvciwgbnVsbCk7XG4gICAgfVx0XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gWm9vbXMgaW4vb3V0IGJ5IGZhY3Rvci4gTmV3IHpvb20gd2lkdGggaXMgZmFjdG9yICogdGhlIGN1cnJlbnQgd2lkdGguXG4gICAgLy8gRmFjdG9yID4gMSB6b29tcyBvdXQsIDAgPCBmYWN0b3IgPCAxIHpvb21zIGluLlxuICAgIHh6b29tIChmYWN0b3IpIHtcblx0bGV0IGxlbiA9IHRoaXMuY29vcmRzLmVuZCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMTtcblx0bGV0IG5ld2xlbiA9IE1hdGgucm91bmQoZmFjdG9yICogbGVuKTtcblx0bGV0IHggPSAodGhpcy5jb29yZHMuc3RhcnQgKyB0aGlzLmNvb3Jkcy5lbmQpLzI7XG5cdGlmICh0aGlzLmNtb2RlID09PSAnbWFwcGVkJykge1xuXHQgICAgbGV0IG5ld3N0YXJ0ID0gTWF0aC5yb3VuZCh4IC0gbmV3bGVuLzIpO1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgY2hyOiB0aGlzLmNvb3Jkcy5jaHIsIHN0YXJ0OiBuZXdzdGFydCwgZW5kOiBuZXdzdGFydCArIG5ld2xlbiAtIDEgfSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICB0aGlzLnNldENvbnRleHQoeyBsZW5ndGg6IG5ld2xlbiB9KTtcblx0fVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFBhbnMgdGhlIHZpZXcgbGVmdCBvciByaWdodCBieSBmYWN0b3IuIFRoZSBkaXN0YW5jZSBtb3ZlZCBpcyBmYWN0b3IgdGltZXMgdGhlIGN1cnJlbnQgem9vbSB3aWR0aC5cbiAgICAvLyBOZWdhdGl2ZSB2YWx1ZXMgcGFuIGxlZnQuIFBvc2l0aXZlIHZhbHVlcyBwYW4gcmlnaHQuIChOb3RlIHRoYXQgcGFubmluZyBtb3ZlcyB0aGUgXCJjYW1lcmFcIi4gUGFubmluZyB0byB0aGVcbiAgICAvLyByaWdodCBtYWtlcyB0aGUgb2JqZWN0cyBpbiB0aGUgc2NlbmUgYXBwZWFyIHRvIG1vdmUgdG8gdGhlIGxlZnQsIGFuZCB2aWNlIHZlcnNhLilcbiAgICAvL1xuICAgIHhwYW4gKGZhY3Rvcikge1xuXHRsZXQgYyA9IHRoaXMuY29vcmRzO1xuXHRsZXQgY2hyID0gdGhpcy5yR2Vub21lLmNocm9tb3NvbWVzLmZpbHRlcihjID0+IGMubmFtZSA9PT0gdGhpcy5jb29yZHMuY2hyKVswXTtcblx0bGV0IHdpZHRoID0gYy5lbmQgLSBjLnN0YXJ0ICsgMTtcblx0bGV0IG1pbkQgPSAtKGMuc3RhcnQtMSk7XG5cdGxldCBtYXhEID0gY2hyLmxlbmd0aCAtIGMuZW5kO1xuXHRsZXQgZCA9IGNsaXAoZmFjdG9yICogd2lkdGgsIG1pbkQsIG1heEQpO1xuXHRpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpIHtcblx0ICAgIHRoaXMuc2V0Q29udGV4dCh7IGNocjogYy5jaHIsIHN0YXJ0OiBjLnN0YXJ0K2QsIGVuZDogYy5lbmQrZCB9KTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuc2V0Q29udGV4dCh7IGRlbHRhOiB0aGlzLmxjb29yZHMuZGVsdGEgKyBkIH0pO1xuXHR9XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdEZlYXRUeXBlQ29udHJvbCAoZmFjZXQpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgY29sb3JzID0gdGhpcy5jc2NhbGUuZG9tYWluKCkubWFwKGxibCA9PiB7XG5cdCAgICByZXR1cm4geyBsYmw6bGJsLCBjbHI6dGhpcy5jc2NhbGUobGJsKSB9O1xuXHR9KTtcblx0bGV0IGNrZXMgPSBkMy5zZWxlY3QoXCIuY29sb3JLZXlcIilcblx0ICAgIC5zZWxlY3RBbGwoJy5jb2xvcktleUVudHJ5Jylcblx0XHQuZGF0YShjb2xvcnMpO1xuXHRsZXQgbmNzID0gY2tlcy5lbnRlcigpLmFwcGVuZChcImRpdlwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBcImNvbG9yS2V5RW50cnkgZmxleHJvd1wiKTtcblx0bmNzLmFwcGVuZChcImRpdlwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwic3dhdGNoXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgYyA9PiBjLmxibClcblx0ICAgIC5zdHlsZShcImJhY2tncm91bmQtY29sb3JcIiwgYyA9PiBjLmNscilcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgdCA9IGQzLnNlbGVjdCh0aGlzKTtcblx0ICAgICAgICB0LmNsYXNzZWQoXCJjaGVja2VkXCIsICEgdC5jbGFzc2VkKFwiY2hlY2tlZFwiKSk7XG5cdFx0bGV0IHN3YXRjaGVzID0gZDMuc2VsZWN0QWxsKFwiLnN3YXRjaC5jaGVja2VkXCIpWzBdO1xuXHRcdGxldCBmdHMgPSBzd2F0Y2hlcy5tYXAocz0+cy5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpKVxuXHRcdGZhY2V0LnNldFZhbHVlcyhmdHMpO1xuXHRcdHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdCAgICB9KVxuXHQgICAgLmFwcGVuZChcImlcIilcblx0ICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29uc1wiKTtcblx0bmNzLmFwcGVuZChcInNwYW5cIilcblx0ICAgIC50ZXh0KGMgPT4gYy5sYmwpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naVNucFJlcG9ydCAoKSB7XG5cdGxldCBjID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdGxldCB1cmxCYXNlID0gJ2h0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9zbnAvc3VtbWFyeSc7XG5cdGxldCB0YWJBcmcgPSAnc2VsZWN0ZWRUYWI9MSc7XG5cdGxldCBzZWFyY2hCeUFyZyA9ICdzZWFyY2hCeVNhbWVEaWZmPSc7XG5cdGxldCBjaHJBcmcgPSBgc2VsZWN0ZWRDaHJvbW9zb21lPSR7Yy5jaHJ9YDtcblx0bGV0IGNvb3JkQXJnID0gYGNvb3JkaW5hdGU9JHtjLnN0YXJ0fS0ke2MuZW5kfWA7XG5cdGxldCB1bml0QXJnID0gJ2Nvb3JkaW5hdGVVbml0PWJwJztcblx0bGV0IGNzQXJncyA9IGMuZ2Vub21lcy5tYXAoZyA9PiBgc2VsZWN0ZWRTdHJhaW5zPSR7Z31gKVxuXHRsZXQgcnNBcmcgPSBgcmVmZXJlbmNlU3RyYWluPSR7Yy5yZWZ9YDtcblx0bGV0IGxpbmtVcmwgPSBgJHt1cmxCYXNlfT8ke3RhYkFyZ30mJHtzZWFyY2hCeUFyZ30mJHtjaHJBcmd9JiR7Y29vcmRBcmd9JiR7dW5pdEFyZ30mJHtyc0FyZ30mJHtjc0FyZ3Muam9pbignJicpfWBcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naVFUTHMgKCkge1xuXHRsZXQgYyAgICAgICAgPSB0aGlzLmdldENvbnRleHQoKTtcblx0bGV0IHVybEJhc2UgID0gJ2h0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9hbGxlbGUvc3VtbWFyeSc7XG5cdGxldCBjaHJBcmcgICA9IGBjaHJvbW9zb21lPSR7Yy5jaHJ9YDtcblx0bGV0IGNvb3JkQXJnID0gYGNvb3JkaW5hdGU9JHtjLnN0YXJ0fS0ke2MuZW5kfWA7XG5cdGxldCB1bml0QXJnICA9ICdjb29yZFVuaXQ9YnAnO1xuXHRsZXQgdHlwZUFyZyAgPSAnYWxsZWxlVHlwZT1RVEwnO1xuXHRsZXQgbGlua1VybCAgPSBgJHt1cmxCYXNlfT8ke2NockFyZ30mJHtjb29yZEFyZ30mJHt1bml0QXJnfSYke3R5cGVBcmd9YDtcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naUpCcm93c2UgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRsZXQgdXJsQmFzZSA9ICdodHRwOi8vamJyb3dzZS5pbmZvcm1hdGljcy5qYXgub3JnLyc7XG5cdGxldCBkYXRhQXJnID0gJ2RhdGE9ZGF0YSUyRm1vdXNlJzsgLy8gXCJkYXRhL21vdXNlXCJcblx0bGV0IGxvY0FyZyAgPSBgbG9jPWNociR7Yy5jaHJ9JTNBJHtjLnN0YXJ0fS4uJHtjLmVuZH1gO1xuXHRsZXQgdHJhY2tzICA9IFsnRE5BJywnTUdJX0dlbm9tZV9GZWF0dXJlcycsJ05DQklfQ0NEUycsJ05DQkknLCdFTlNFTUJMJ107XG5cdGxldCB0cmFja3NBcmc9YHRyYWNrcz0ke3RyYWNrcy5qb2luKCcsJyl9YDtcblx0bGV0IGhpZ2hsaWdodEFyZyA9ICdoaWdobGlnaHQ9Jztcblx0bGV0IGxpbmtVcmwgPSBgJHt1cmxCYXNlfT8keyBbZGF0YUFyZyxsb2NBcmcsdHJhY2tzQXJnLGhpZ2hsaWdodEFyZ10uam9pbignJicpIH1gO1xuXHR3aW5kb3cub3BlbihsaW5rVXJsLCBcIl9ibGFua1wiKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBNR1ZBcHBcblxuZXhwb3J0IHsgTUdWQXBwIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9NR1ZBcHAuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgR2Vub21lIHtcbiAgY29uc3RydWN0b3IgKGNmZykge1xuICAgIHRoaXMubmFtZSA9IGNmZy5uYW1lO1xuICAgIHRoaXMubGFiZWw9IGNmZy5sYWJlbDtcbiAgICB0aGlzLmNocm9tb3NvbWVzID0gW107XG4gICAgdGhpcy5tYXhsZW4gPSAtMTtcbiAgICB0aGlzLnhzY2FsZSA9IG51bGw7XG4gICAgdGhpcy55c2NhbGUgPSBudWxsO1xuICAgIHRoaXMuem9vbVkgID0gLTE7XG4gIH1cbiAgZ2V0Q2hyb21vc29tZSAobikge1xuICAgICAgaWYgKHR5cGVvZihuKSA9PT0gJ3N0cmluZycpXG5cdCAgcmV0dXJuIHRoaXMuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSBuKVswXTtcbiAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gdGhpcy5jaHJvbW9zb21lc1tuXTtcbiAgfVxuICBoYXNDaHJvbW9zb21lIChuKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDaHJvbW9zb21lKG4pID8gdHJ1ZSA6IGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCB7IEdlbm9tZSB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvR2Vub21lLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7ZDNqc29uLCBvdmVybGFwcywgc3VidHJhY3R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtGZWF0dXJlfSBmcm9tICcuL0ZlYXR1cmUnO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEhvdyB0aGUgYXBwIGxvYWRzIGZlYXR1cmUgZGF0YS4gUHJvdmlkZXMgdHdvIGNhbGxzOlxuLy8gICAtIGdldCBmZWF0dXJlcyBpbiByYW5nZVxuLy8gICAtIGdldCBmZWF0dXJlcyBieSBpZFxuLy8gUmVxdWVzdHMgZmVhdHVyZXMgZnJvbSB0aGUgc2VydmVyIGFuZCByZWdpc3RlcnMgdGhlbSBpbiBhIGNhY2hlLlxuLy8gSW50ZXJhY3RzIHdpdGggdGhlIGJhY2sgZW5kIHRvIGxvYWQgZmVhdHVyZXM7IHRyaWVzIG5vdCB0byByZXF1ZXN0XG4vLyB0aGUgc2FtZSByZWdpb24gdHdpY2UuXG4vL1xuY2xhc3MgRmVhdHVyZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMuaWQyZmVhdCA9IHt9O1x0XHQvLyBpbmRleCBmcm9tICBmZWF0dXJlIElEIHRvIGZlYXR1cmVcblx0dGhpcy5jYW5vbmljYWwyZmVhdHMgPSB7fTtcdC8vIGluZGV4IGZyb20gY2Fub25pY2FsIElEIC0+IFsgZmVhdHVyZXMgdGFnZ2VkIHdpdGggdGhhdCBpZCBdXG5cdHRoaXMuc3ltYm9sMmZlYXRzID0ge31cdFx0Ly8gaW5kZXggZnJvbSBzeW1ib2wgLT4gWyBmZWF0dXJlcyBoYXZpbmcgdGhhdCBzeW1ib2wgXVxuXHRcdFx0XHRcdC8vIHdhbnQgY2FzZSBpbnNlbnNpdGl2ZSBzZWFyY2hlcywgc28ga2V5cyBhcmUgbG93ZXIgY2FzZWRcblx0dGhpcy5jYWNoZSA9IHt9O1x0XHQvLyB7Z2Vub21lLm5hbWUgLT4ge2Noci5uYW1lIC0+IGxpc3Qgb2YgYmxvY2tzfX1cblx0dGhpcy5taW5lRmVhdHVyZUNhY2hlID0ge307XHQvLyBhdXhpbGlhcnkgaW5mbyBwdWxsZWQgZnJvbSBNb3VzZU1pbmUgXG5cdHRoaXMubG9hZGVkR2Vub21lcyA9IG5ldyBTZXQoKTsgLy8gdGhlIHNldCBvZiBHZW5vbWVzIHRoYXQgaGF2ZSBiZWVuIGZ1bGx5IGxvYWRlZFxuICAgIH1cbiBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQcm9jZXNzZXMgdGhlIFwicmF3XCIgZmVhdHVyZXMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlci5cbiAgICAvLyBUdXJucyB0aGVtIGludG8gRmVhdHVyZSBvYmplY3RzIGFuZCByZWdpc3RlcnMgdGhlbS5cbiAgICAvLyBJZiB0aGUgc2FtZSByYXcgZmVhdHVyZSBpcyByZWdpc3RlcmVkIGFnYWluLFxuICAgIC8vIHRoZSBGZWF0dXJlIG9iamVjdCBjcmVhdGVkIHRoZSBmaXJzdCB0aW1lIGlzIHJldHVybmVkLlxuICAgIC8vIChJLmUuLCByZWdpc3RlcmluZyB0aGUgc2FtZSBmZWF0dXJlIG11bHRpcGxlIHRpbWVzIGlzIG9rKVxuICAgIC8vXG4gICAgcHJvY2Vzc0ZlYXR1cmVzIChmZWF0cywgZ2Vub21lKSB7XG5cdHJldHVybiBmZWF0cy5tYXAoZCA9PiB7XG5cdCAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCB0aGlzIG9uZSBpbiB0aGUgY2FjaGUsIHJldHVybiBpdC5cblx0ICAgIGxldCBmID0gdGhpcy5pZDJmZWF0W2QubWdwaWRdO1xuXHQgICAgaWYgKGYpIHJldHVybiBmO1xuXHQgICAgLy8gQ3JlYXRlIGEgbmV3IEZlYXR1cmVcblx0ICAgIGQuZ2Vub21lID0gZ2Vub21lXG5cdCAgICBmID0gbmV3IEZlYXR1cmUoZCk7XG5cdCAgICAvLyBSZWdpc3RlciBpdC5cblx0ICAgIHRoaXMuaWQyZmVhdFtmLm1ncGlkXSA9IGY7XG5cdCAgICBpZiAoZi5tZ2lpZCAmJiBmLm1naWlkICE9PSAnLicpIHtcblx0XHRsZXQgbHN0ID0gdGhpcy5jYW5vbmljYWwyZmVhdHNbZi5tZ2lpZF0gPSAodGhpcy5jYW5vbmljYWwyZmVhdHNbZi5tZ2lpZF0gfHwgW10pO1xuXHRcdGxzdC5wdXNoKGYpO1xuXHQgICAgfVxuXHQgICAgaWYgKGYuc3ltYm9sICYmIGYuc3ltYm9sICE9PSAnLicpIHtcblx0XHRsZXQgcyA9IGYuc3ltYm9sLnRvTG93ZXJDYXNlKCk7XG5cdFx0bGV0IGxzdCA9IHRoaXMuc3ltYm9sMmZlYXRzW3NdID0gKHRoaXMuc3ltYm9sMmZlYXRzW3NdIHx8IFtdKTtcblx0XHRsc3QucHVzaChmKTtcblx0ICAgIH1cblx0ICAgIC8vIGhlcmUgeSdnby5cblx0ICAgIHJldHVybiBmO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZWdpc3RlcnMgYW4gaW5kZXggYmxvY2sgZm9yIHRoZSBnaXZlbiBnZW5vbWUuIEFuIGluZGV4IGJsb2NrXG4gICAgLy8gaXMgYSBjb250aWd1b3VzIGNodW5rIG9mIGZlYXR1ZXMgZnJvbSB0aGUgR0ZGIGZpbGUgZm9yIHRoYXQgZ2Vub21lLlxuICAgIC8vIFJlZ2lzdGVyaW5nIHRoZSBzYW1lIGJsb2NrIG11bHRpcGxlIHRpbWVzIGlzIG9rIC0gc3VjY2Vzc2l2ZSB0aW1lc1xuICAgIC8vIGhhdmUgbm8gZWZmZWN0LlxuICAgIC8vIFNpZGUgZWZmZWN0czpcbiAgICAvLyAgIEFkZHMgdGhlIGJsb2NrIHRvIHRoZSBjYWNoZVxuICAgIC8vICAgUmVwbGFjZXMgZWFjaCByYXcgZmVhdHVyZSBpbiB0aGUgYmxvY2sgd2l0aCBhIEZlYXR1cmUgb2JqZWN0LlxuICAgIC8vICAgUmVnaXN0ZXJzIG5ldyBGZWF0dXJlcyBpbiBhIGxvb2t1cC5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgZ2Vub21lIChvYmplY3QpIFRoZSBnZW5vbWUgdGhlIGJsb2NrIGlzIGZvcixcbiAgICAvLyAgIGJsayAob2JqZWN0KSBBbiBpbmRleCBibG9jaywgd2hpY2ggaGFzIGEgY2hyLCBzdGFydCwgZW5kLFxuICAgIC8vICAgXHRhbmQgYSBsaXN0IG9mIFwicmF3XCIgZmVhdHVyZSBvYmplY3RzLlxuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICBub3RoaW5nXG4gICAgLy9cbiAgICBfcmVnaXN0ZXJCbG9jayAoZ2Vub21lLCBibGspIHtcblx0Ly8gZ2Vub21lIGNhY2hlXG4gICAgICAgIGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdID0gKHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdIHx8IHt9KTtcblx0Ly8gY2hyb21vc29tZSBjYWNoZSAody9pbiBnZW5vbWUpXG5cdGxldCBjYyA9IGdjW2Jsay5jaHJdID0gKGdjW2Jsay5jaHJdIHx8IFtdKTtcblx0aWYgKGNjLmZpbHRlcihiID0+IGIuaWQgPT09IGJsay5pZCkubGVuZ3RoID09PSAwKSB7XG5cdCAgICBibGsuZmVhdHVyZXMgPSB0aGlzLnByb2Nlc3NGZWF0dXJlcyggYmxrLmZlYXR1cmVzLCBnZW5vbWUgKTtcblx0ICAgIGJsay5nZW5vbWUgPSBnZW5vbWU7XG5cdCAgICBjYy5wdXNoKGJsayk7XG5cdCAgICBjYy5zb3J0KCAoYSxiKSA9PiBhLnN0YXJ0IC0gYi5zdGFydCApO1xuXHR9XG5cdC8vZWxzZVxuXHQgICAgLy9jb25zb2xlLmxvZyhcIlNraXBwZWQgYmxvY2suIEFscmVhZHkgc2Vlbi5cIiwgZ2Vub21lLm5hbWUsIGJsay5pZCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgcmVtYWluZGVyIG9mIHRoZSBnaXZlbiByYW5nZSBhZnRlclxuICAgIC8vIHN1YnRyYWN0aW5nIHRoZSBhbHJlYWR5LWVuc3VyZWQgcmFuZ2VzLlxuICAgIC8vIFxuICAgIF9zdWJ0cmFjdFJhbmdlKGdlbm9tZSwgcmFuZ2Upe1xuXHRsZXQgZ2MgPSB0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXTtcblx0aWYgKCFnYykgdGhyb3cgXCJObyBzdWNoIGdlbm9tZTogXCIgKyBnZW5vbWUubmFtZTtcblx0bGV0IGdCbGtzID0gZ2NbcmFuZ2UuY2hyXSB8fCBbXTtcblx0bGV0IGFucyA9IFtdO1xuXHRsZXQgcm5nID0gcmFuZ2U7XG5cdGdCbGtzLmZvckVhY2goIGIgPT4ge1xuXHQgICAgbGV0IHN1YiA9IHJuZyA/IHN1YnRyYWN0KCBybmcsIGIgKSA6IFtdO1xuXHQgICAgaWYgKHN1Yi5sZW5ndGggPT09IDApXG5cdCAgICAgICAgcm5nID0gbnVsbDtcblx0ICAgIGlmIChzdWIubGVuZ3RoID09PSAxKVxuXHQgICAgICAgIHJuZyA9IHN1YlswXTtcblx0ICAgIGVsc2UgaWYgKHN1Yi5sZW5ndGggPT09IDIpe1xuXHQgICAgICAgIGFucy5wdXNoKHN1YlswXSk7XG5cdFx0cm5nID0gc3ViWzFdO1xuXHQgICAgfVxuXHR9KVxuXHRybmcgJiYgYW5zLnB1c2gocm5nKTtcblx0YW5zLnNvcnQoIChhLGIpID0+IGEuc3RhcnQgLSBiLnN0YXJ0ICk7XG5cdHJldHVybiBhbnM7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENhbGxzIHN1YnRyYWN0UmFuZ2UgZm9yIGVhY2ggcmFuZ2UgaW4gdGhlIGxpc3QgYW5kIHJldHVybnNcbiAgICAvLyB0aGUgYWNjdW11bGF0ZWQgcmVzdWx0cy5cbiAgICAvL1xuICAgIF9zdWJ0cmFjdFJhbmdlcyhnZW5vbWUsIHJhbmdlcykge1xuXHRsZXQgZ2MgPSB0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXTtcblx0aWYgKCFnYykgcmV0dXJuIHJhbmdlcztcblx0bGV0IG5ld3JhbmdlcyA9IFtdO1xuXHRyYW5nZXMuZm9yRWFjaChyID0+IHtcblx0ICAgIG5ld3JhbmdlcyA9IG5ld3Jhbmdlcy5jb25jYXQodGhpcy5fc3VidHJhY3RSYW5nZShnZW5vbWUsIHIpKTtcblx0fSwgdGhpcylcblx0cmV0dXJuIG5ld3JhbmdlcztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBFbnN1cmVzIHRoYXQgYWxsIGZlYXR1cmVzIGluIHRoZSBzcGVjaWZpZWQgcmFuZ2UocykgaW4gdGhlIHNwZWNpZmllZCBnZW5vbWVcbiAgICAvLyBhcmUgaW4gdGhlIGNhY2hlLiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRydWUgd2hlbiB0aGUgY29uZGl0aW9uIGlzIG1ldC5cbiAgICBfZW5zdXJlRmVhdHVyZXNCeVJhbmdlIChnZW5vbWUsIHJhbmdlcykge1xuXHRsZXQgbmV3cmFuZ2VzID0gdGhpcy5fc3VidHJhY3RSYW5nZXMoZ2Vub21lLCByYW5nZXMpO1xuXHRpZiAobmV3cmFuZ2VzLmxlbmd0aCA9PT0gMCkgXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdGxldCBjb29yZHNBcmcgPSBuZXdyYW5nZXMubWFwKHIgPT4gYCR7ci5jaHJ9OiR7ci5zdGFydH0uLiR7ci5lbmR9YCkuam9pbignLCcpO1xuXHRsZXQgZGF0YVN0cmluZyA9IGBnZW5vbWU9JHtnZW5vbWUubmFtZX0mY29vcmRzPSR7Y29vcmRzQXJnfWA7XG5cdGxldCB1cmwgPSBcIi4vYmluL2dldEZlYXR1cmVzLmNnaT9cIiArIGRhdGFTdHJpbmc7XG5cdGxldCBzZWxmID0gdGhpcztcblx0Y29uc29sZS5sb2coXCJSZXF1ZXN0aW5nOlwiLCBnZW5vbWUubmFtZSwgbmV3cmFuZ2VzKTtcblx0cmV0dXJuIGQzanNvbih1cmwpLnRoZW4oZnVuY3Rpb24oYmxvY2tzKXtcblx0ICAgIGJsb2Nrcy5mb3JFYWNoKCBiID0+IHNlbGYuX3JlZ2lzdGVyQmxvY2soZ2Vub21lLCBiKSApO1xuXHQgICAgc2VsZi5hcHAuc2hvd1N0YXR1cyhgTG9hZGVkOiAke2dlbm9tZS5uYW1lfWApO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdH0pO1xuICAgIH1cbiBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBfZW5zdXJlRmVhdHVyZXNCeUdlbm9tZSAoZ2Vub21lKSB7XG5cdGlmKCB0aGlzLmxvYWRlZEdlbm9tZXMuaGFzKGdlbm9tZSkgKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgbGV0IHJhbmdlcyA9IGdlbm9tZS5jaHJvbW9zb21lcy5tYXAoYyA9PiB7IFxuXHQgICAgcmV0dXJuIHsgY2hyOiBjLm5hbWUsIHN0YXJ0OiAxLCBlbmQ6IGMubGVuZ3RoIH07XG5cdH0pO1xuXHRyZXR1cm4gdGhpcy5fZW5zdXJlRmVhdHVyZXNCeVJhbmdlKGdlbm9tZSwgcmFuZ2VzKS50aGVuKHg9PnsgdGhpcy5sb2FkZWRHZW5vbWVzLmFkZChnZW5vbWUpOyByZXR1cm4gdHJ1ZTt9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsb2FkR2Vub21lcyAoZ2Vub21lcykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoZ2Vub21lcy5tYXAoZyA9PiB0aGlzLl9lbnN1cmVGZWF0dXJlc0J5R2Vub21lIChnKSkpLnRoZW4oKCk9PnRydWUpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIF9nZXRDYWNoZWRGZWF0dXJlcyAoZ2Vub21lLCByYW5nZSkge1xuICAgICAgICBsZXQgZ2MgPSB0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXSA7XG5cdGlmICghZ2MpIHJldHVybiBbXTtcblx0bGV0IGNCbG9ja3MgPSBnY1tyYW5nZS5jaHJdO1xuXHRpZiAoIWNCbG9ja3MpIHJldHVybiBbXTtcblx0bGV0IGZlYXRzID0gY0Jsb2Nrc1xuXHQgICAgLmZpbHRlcihjYiA9PiBvdmVybGFwcyhjYiwgcmFuZ2UpKVxuXHQgICAgLm1hcCggY2IgPT4gY2IuZmVhdHVyZXMuZmlsdGVyKCBmID0+IG92ZXJsYXBzKCBmLCByYW5nZSkgKSApXG5cdCAgICAucmVkdWNlKCAoYWNjLCB2YWwpID0+IGFjYy5jb25jYXQodmFsKSwgW10pO1xuICAgICAgICByZXR1cm4gZmVhdHM7XHRcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGFsbCBjYWNoZWQgZmVhdHVyZXMgaGF2aW5nIHRoZSBnaXZlbiBjYW5vbmljYWwgaWQuXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZUJ5SWQgKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkMmZlYXRzW2lkXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGFsbCBjYWNoZWQgZmVhdHVyZXMgaGF2aW5nIHRoZSBnaXZlbiBjYW5vbmljYWwgaWQuXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkIChjaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2Fub25pY2FsMmZlYXRzW2NpZF0gfHwgW107XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIGxpc3Qgb2YgZmVhdHVyZXMgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gbGFiZWwsIHdoaWNoIGNhbiBiZSBhbiBpZCwgY2Fub25pY2FsIGlkLCBvciBzeW1ib2wuXG4gICAgLy8gSWYgZ2Vub21lIGlzIHNwZWNpZmllZCwgbGltaXQgcmVzdWx0cyB0byBmZWF0dXJlcyBmcm9tIHRoYXQgZ2Vub21lLlxuICAgIC8vIFxuICAgIGdldENhY2hlZEZlYXR1cmVzQnlMYWJlbCAobGFiZWwsIGdlbm9tZSkge1xuXHRsZXQgZiA9IHRoaXMuaWQyZmVhdFtsYWJlbF1cblx0bGV0IGZlYXRzID0gZiA/IFtmXSA6IHRoaXMuY2Fub25pY2FsMmZlYXRzW2xhYmVsXSB8fCB0aGlzLnN5bWJvbDJmZWF0c1tsYWJlbC50b0xvd2VyQ2FzZSgpXSB8fCBbXTtcblx0cmV0dXJuIGdlbm9tZSA/IGZlYXRzLmZpbHRlcihmPT4gZi5nZW5vbWUgPT09IGdlbm9tZSkgOiBmZWF0cztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIGZlYXR1cmVzIGluIFxuICAgIC8vIHRoZSBzcGVjaWZpZWQgcmFuZ2VzIG9mIHRoZSBzcGVjaWZpZWQgZ2Vub21lLlxuICAgIGdldEZlYXR1cmVzIChnZW5vbWUsIHJhbmdlcykge1xuXHRyZXR1cm4gdGhpcy5fZW5zdXJlRmVhdHVyZXNCeUdlbm9tZShnZW5vbWUpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByYW5nZXMuZm9yRWFjaCggciA9PiB7XG5cdCAgICAgICAgci5mZWF0dXJlcyA9IHRoaXMuX2dldENhY2hlZEZlYXR1cmVzKGdlbm9tZSwgcikgXG5cdFx0ci5nZW5vbWUgPSBnZW5vbWU7XG5cdCAgICB9KTtcblx0ICAgIHJldHVybiB7IGdlbm9tZSwgYmxvY2tzOnJhbmdlcyB9O1xuXHR9LmJpbmQodGhpcykpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIGZlYXR1cmVzIGhhdmluZyB0aGUgc3BlY2lmaWVkIGlkcyBmcm9tIHRoZSBzcGVjaWZpZWQgZ2Vub21lLlxuICAgIGdldEZlYXR1cmVzQnlJZCAoZ2Vub21lLCBpZHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Vuc3VyZUZlYXR1cmVzQnlHZW5vbWUoZ2Vub21lKS50aGVuKCAoKSA9PiB7XG5cdCAgICBsZXQgZmVhdHMgPSBbXTtcblx0ICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuXHQgICAgbGV0IGFkZGYgPSAoZikgPT4ge1xuXHRcdGlmIChmLmdlbm9tZSAhPT0gZ2Vub21lKSByZXR1cm47XG5cdFx0aWYgKHNlZW4uaGFzKGYuaWQpKSByZXR1cm47XG5cdFx0c2Vlbi5hZGQoZi5pZCk7XG5cdFx0ZmVhdHMucHVzaChmKTtcblx0ICAgIH07XG5cdCAgICBsZXQgYWRkID0gKGYpID0+IHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShmKSkgXG5cdFx0ICAgIGYuZm9yRWFjaChmZiA9PiBhZGRmKGZmKSk7XG5cdFx0ZWxzZVxuXHRcdCAgICBhZGRmKGYpO1xuXHQgICAgfTtcblx0ICAgIGZvciAobGV0IGkgb2YgaWRzKXtcblx0XHRsZXQgZiA9IHRoaXMuY2Fub25pY2FsMmZlYXRzW2ldIHx8IHRoaXMuaWQyZmVhdFtpXTtcblx0XHRmICYmIGFkZChmKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmZWF0cztcblx0fSk7XG4gICAgfVxuXG59IC8vIGVuZCBjbGFzcyBGZWF0dXJlIE1hbmFnZXJcblxuZXhwb3J0IHsgRmVhdHVyZU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZlYXR1cmVNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGluaXRPcHRMaXN0IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBBdXhEYXRhTWFuYWdlciB9IGZyb20gJy4vQXV4RGF0YU1hbmFnZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE5vdCBzdXJlIHdoZXJlIHRoaXMgc2hvdWxkIGdvXG5sZXQgc2VhcmNoVHlwZXMgPSBbe1xuICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5UGhlbm90eXBlXCIsXG4gICAgbGFiZWw6IFwiLi4uYnkgcGhlbm90eXBlIG9yIGRpc2Vhc2VcIixcbiAgICB0ZW1wbGF0ZTogXCJcIixcbiAgICBwbGFjZWhvbGRlcjogXCJQaGVuby9kaXNlYXNlIChNUC9ETykgdGVybSBvciBJRHNcIlxufSx7XG4gICAgbWV0aG9kOiBcImZlYXR1cmVzQnlGdW5jdGlvblwiLFxuICAgIGxhYmVsOiBcIi4uLmJ5IGNlbGx1bGFyIGZ1bmN0aW9uXCIsXG4gICAgdGVtcGxhdGU6IFwiXCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiR2VuZSBPbnRvbG9neSAoR08pIHRlcm1zIG9yIElEc1wiXG59LHtcbiAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeVBhdGh3YXlcIixcbiAgICBsYWJlbDogXCIuLi5ieSBwYXRod2F5XCIsXG4gICAgdGVtcGxhdGU6IFwiXCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiUmVhY3RvbWUgcGF0aHdheXMgbmFtZXMsIElEc1wiXG59LHtcbiAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeUlkXCIsXG4gICAgbGFiZWw6IFwiLi4uYnkgbm9tZW5jbGF0dXJlXCIsXG4gICAgdGVtcGxhdGU6IFwiXCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiTUdJIG5hbWVzLCBzeW5vbnltcywgZXRjLlwiXG59XTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgUXVlcnlNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLmNmZyA9IHNlYXJjaFR5cGVzO1xuXHR0aGlzLmF1eERhdGFNYW5hZ2VyID0gbmV3IEF1eERhdGFNYW5hZ2VyKCk7XG5cdHRoaXMuc2VsZWN0ID0gbnVsbDtcdC8vIG15IDxzZWxlY3Q+IGVsZW1lbnRcblx0dGhpcy50ZXJtID0gbnVsbDtcdC8vIG15IDxpbnB1dD4gZWxlbWVudFxuXHR0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdHRoaXMuc2VsZWN0ID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzZWFyY2h0eXBlXCJdJyk7XG5cdHRoaXMudGVybSAgID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzZWFyY2h0ZXJtXCJdJyk7XG5cdC8vXG5cdHRoaXMudGVybS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgdGhpcy5jZmdbMF0ucGxhY2Vob2xkZXIpXG5cdGluaXRPcHRMaXN0KHRoaXMuc2VsZWN0WzBdWzBdLCB0aGlzLmNmZywgYz0+Yy5tZXRob2QsIGM9PmMubGFiZWwpO1xuXHQvLyBXaGVuIHVzZXIgY2hhbmdlcyB0aGUgcXVlcnkgdHlwZSAoc2VsZWN0b3IpLCBjaGFuZ2UgdGhlIHBsYWNlaG9sZGVyIHRleHQuXG5cdHRoaXMuc2VsZWN0Lm9uKFwiY2hhbmdlXCIsICgpID0+IHtcblx0ICAgIGxldCBvcHQgPSB0aGlzLnNlbGVjdC5wcm9wZXJ0eShcInNlbGVjdGVkT3B0aW9uc1wiKVswXTtcblx0ICAgIHRoaXMudGVybS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgb3B0Ll9fZGF0YV9fLnBsYWNlaG9sZGVyKVxuXHQgICAgXG5cdH0pO1xuXHQvLyBXaGVuIHVzZXIgZW50ZXJzIGEgc2VhcmNoIHRlcm0sIHJ1biBhIHF1ZXJ5XG5cdHRoaXMudGVybS5vbihcImNoYW5nZVwiLCAoKSA9PiB7XG5cdCAgICBsZXQgdGVybSA9IHRoaXMudGVybS5wcm9wZXJ0eShcInZhbHVlXCIpO1xuXHQgICAgdGhpcy50ZXJtLnByb3BlcnR5KFwidmFsdWVcIixcIlwiKTtcblx0ICAgIGxldCBzZWFyY2hUeXBlICA9IHRoaXMuc2VsZWN0LnByb3BlcnR5KFwidmFsdWVcIik7XG5cdCAgICBsZXQgbHN0TmFtZSA9IHRlcm07XG5cdCAgICBkMy5zZWxlY3QoXCIjbXlsaXN0c1wiKS5jbGFzc2VkKFwiYnVzeVwiLHRydWUpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHQgICAgdGhpcy5hdXhEYXRhTWFuYWdlcltzZWFyY2hUeXBlXSh0ZXJtKVx0Ly8gPC0gcnVuIHRoZSBxdWVyeVxuXHQgICAgICAudGhlbihmZWF0cyA9PiB7XG5cdFx0ICAvLyBGSVhNRSAtIHJlYWNob3ZlciAtIHRoaXMgd2hvbGUgaGFuZGxlclxuXHRcdCAgbGV0IGxzdCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLmNyZWF0ZUxpc3QobHN0TmFtZSwgZmVhdHMubWFwKGYgPT4gZi5wcmltYXJ5SWRlbnRpZmllcikpXG5cdFx0ICB0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGUobHN0KTtcblx0XHQgIC8vXG5cdFx0ICB0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzID0ge307XG5cdFx0ICBmZWF0cy5mb3JFYWNoKGYgPT4gdGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0c1tmLm1naWlkXSA9IGYubWdpaWQpO1xuXHRcdCAgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdFx0ICAvL1xuXHRcdCAgdGhpcy5hcHAuY3VycmVudExpc3QgPSBsc3Q7XG5cdFx0ICAvL1xuXHRcdCAgZDMuc2VsZWN0KFwiI215bGlzdHNcIikuY2xhc3NlZChcImJ1c3lcIixmYWxzZSk7XG5cdCAgICAgIH0pO1xuXHR9KVxuICAgIH1cbn1cblxuZXhwb3J0IHsgUXVlcnlNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9RdWVyeU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGQzanNvbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEF1eERhdGFNYW5hZ2VyIC0ga25vd3MgaG93IHRvIHF1ZXJ5IGFuIGV4dGVybmFsIHNvdXJjZSAoaS5lLiwgTW91c2VNaW5lKSBmb3IgZ2VuZXNcbi8vIGFubm90YXRlZCB0byBkaWZmZXJlbnQgb250b2xvZ2llcy4gXG5jbGFzcyBBdXhEYXRhTWFuYWdlciB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0QXV4RGF0YSAocSkge1xuXHRsZXQgZm9ybWF0ID0gJ2pzb25vYmplY3RzJztcblx0bGV0IHF1ZXJ5ID0gZW5jb2RlVVJJQ29tcG9uZW50KHEpO1xuXHRsZXQgdXJsID0gYGh0dHA6Ly93d3cubW91c2VtaW5lLm9yZy9tb3VzZW1pbmUvc2VydmljZS9xdWVyeS9yZXN1bHRzP2Zvcm1hdD0ke2Zvcm1hdH0mcXVlcnk9JHtxdWVyeX1gO1xuXHRyZXR1cm4gZDNqc29uKHVybCkudGhlbihkYXRhID0+IGRhdGEucmVzdWx0c3x8W10pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGRvIGEgTE9PS1VQIHF1ZXJ5IGZvciBTZXF1ZW5jZUZlYXR1cmVzIGZyb20gTW91c2VNaW5lXG4gICAgZmVhdHVyZXNCeUxvb2t1cCAocXJ5U3RyaW5nKSB7XG5cdGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgICB2aWV3PVwiU2VxdWVuY2VGZWF0dXJlLnByaW1hcnlJZGVudGlmaWVyIFNlcXVlbmNlRmVhdHVyZS5zeW1ib2xcIiBcblx0ICAgIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEIgYW5kIENcIj5cblx0XHQ8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmVcIiBvcD1cIkxPT0tVUFwiIHZhbHVlPVwiJHtxcnlTdHJpbmd9XCIvPlxuXHRcdDxjb25zdHJhaW50IGNvZGU9XCJCXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vcmdhbmlzbS50YXhvbklkXCIgb3A9XCI9XCIgdmFsdWU9XCIxMDA5MFwiLz5cblx0XHQ8Y29uc3RyYWludCBjb2RlPVwiQ1wiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUuc2VxdWVuY2VPbnRvbG9neVRlcm0ubmFtZVwiIG9wPVwiIT1cIiB2YWx1ZT1cInRyYW5zZ2VuZVwiLz5cblx0ICAgIDwvcXVlcnk+YDtcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZmVhdHVyZXNCeU9udG9sb2d5VGVybSAocXJ5U3RyaW5nLCB0ZXJtVHlwZXMpIHtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICB2aWV3PVwiU2VxdWVuY2VGZWF0dXJlLnByaW1hcnlJZGVudGlmaWVyIFNlcXVlbmNlRmVhdHVyZS5zeW1ib2xcIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCIGFuZCBDIGFuZCBEXCI+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJBXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vbnRvbG9neUFubm90YXRpb25zLm9udG9sb2d5VGVybS5wYXJlbnRzXCIgb3A9XCJMT09LVVBcIiB2YWx1ZT1cIioke3FyeVN0cmluZ30qXCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiQlwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub3JnYW5pc20udGF4b25JZFwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJDXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5zZXF1ZW5jZU9udG9sb2d5VGVybS5uYW1lXCIgb3A9XCIhPVwiIHZhbHVlPVwidHJhbnNnZW5lXCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiRFwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm0ub250b2xvZ3kubmFtZVwiIG9wPVwiT05FIE9GXCI+XG5cdFx0ICAkeyB0ZXJtVHlwZXMubWFwKHR0PT4gJzx2YWx1ZT4nK3R0Kyc8L3ZhbHVlPicpLmpvaW4oJycpIH1cblx0ICAgICAgPC9jb25zdHJhaW50PlxuXHQgIDwvcXVlcnk+YFxuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAobm90IGN1cnJlbnRseSBpbiB1c2UuLi4pXG4gICAgZmVhdHVyZXNCeVBhdGh3YXlUZXJtIChxcnlTdHJpbmcpIHtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICB2aWV3PVwiR2VuZS5wcmltYXJ5SWRlbnRpZmllciBHZW5lLnN5bWJvbFwiIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEJcIj5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkdlbmUucGF0aHdheXNcIiBjb2RlPVwiQVwiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJHZW5lLm9yZ2FuaXNtLnRheG9uSWRcIiBjb2RlPVwiQlwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdCAgPC9xdWVyeT5gO1xuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmZWF0dXJlc0J5SWQgICAgICAgIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeUxvb2t1cChxcnlTdHJpbmcpOyB9XG4gICAgZmVhdHVyZXNCeUZ1bmN0aW9uICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBbXCJHZW5lIE9udG9sb2d5XCJdKTsgfVxuICAgIGZlYXR1cmVzQnlQaGVub3R5cGUgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5T250b2xvZ3lUZXJtKHFyeVN0cmluZywgW1wiTWFtbWFsaWFuIFBoZW5vdHlwZVwiLFwiRGlzZWFzZSBPbnRvbG9neVwiXSk7IH1cbiAgICBmZWF0dXJlc0J5UGF0aHdheSAgIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeVBhdGh3YXlUZXJtKHFyeVN0cmluZyk7IH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbn1cblxuZXhwb3J0IHsgQXV4RGF0YU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0F1eERhdGFNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSAnLi9TdG9yYWdlTWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB9IGZyb20gJy4vTGlzdEZvcm11bGFFdmFsdWF0b3InO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE1haW50YWlucyBuYW1lZCBsaXN0cyBvZiBJRHMuIExpc3RzIG1heSBiZSB0ZW1wb3JhcnksIGxhc3Rpbmcgb25seSBmb3IgdGhlIHNlc3Npb24sIG9yIHBlcm1hbmVudCxcbi8vIGxhc3RpbmcgdW50aWwgdGhlIHVzZXIgY2xlYXJzIHRoZSBicm93c2VyIGxvY2FsIHN0b3JhZ2UgYXJlYS5cbi8vXG4vLyBVc2VzIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSBhbmQgd2luZG93LmxvY2FsU3RvcmFnZSB0byBzYXZlIGxpc3RzXG4vLyB0ZW1wb3JhcmlseSBvciBwZXJtYW5lbnRseSwgcmVzcC4gIEZJWE1FOiBzaG91bGQgYmUgdXNpbmcgd2luZG93LmluZGV4ZWREQlxuLy9cbmNsYXNzIExpc3RNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLm5hbWUybGlzdCA9IG51bGw7XG5cdHRoaXMuX2xpc3RzID0gbmV3IExvY2FsU3RvcmFnZU1hbmFnZXIgIChcImxpc3RNYW5hZ2VyLmxpc3RzXCIpXG5cdHRoaXMuZm9ybXVsYUV2YWwgPSBuZXcgTGlzdEZvcm11bGFFdmFsdWF0b3IodGhpcyk7XG5cdHRoaXMuX2xvYWQoKTtcblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuXHQvLyBCdXR0b246IHNob3cvaGlkZSB3YXJuaW5nIG1lc3NhZ2Vcblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbi53YXJuaW5nJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IHcgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cIm1lc3NhZ2VcIl0nKTtcblx0XHR3LmNsYXNzZWQoJ3Nob3dpbmcnLCAhdy5jbGFzc2VkKCdzaG93aW5nJykpO1xuXHQgICAgfSk7XG5cdC8vIEJ1dHRvbjogY3JlYXRlIGxpc3QgZnJvbSBjdXJyZW50IHNlbGVjdGlvblxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJuZXdmcm9tc2VsZWN0aW9uXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgaWRzID0gT2JqZWN0LmtleXModGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0cyk7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdFx0aWYgKGlkcy5sZW5ndGggPT09IDApIHtcblx0XHQgICAgYWxlcnQoXCJOb3RoaW5nIHNlbGVjdGVkLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbmV3bGlzdCA9IHRoaXMuY3JlYXRlTGlzdChcInNlbGVjdGlvblwiLCBpZHMpO1xuXHRcdHRoaXMudXBkYXRlKG5ld2xpc3QpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBjb21iaW5lIGxpc3RzOiBvcGVuIGxpc3QgZWRpdG9yIHdpdGggZm9ybXVsYSBlZGl0b3Igb3BlblxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJjb21iaW5lXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAodGhpcy5nZXROYW1lcygpLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vIGxpc3RzLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbGUgPSB0aGlzLmFwcC5saXN0RWRpdG9yO1xuXHRcdGxlLm9wZW4oKTtcblx0XHRsZS5vcGVuRm9ybXVsYUVkaXRvcigpO1xuXHQgICAgfSk7XG5cdC8vIEJ1dHRvbjogZGVsZXRlIGFsbCBsaXN0cyAoZ2V0IGNvbmZpcm1hdGlvbiBmaXJzdCkuXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cInB1cmdlXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAodGhpcy5nZXROYW1lcygpLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vIGxpc3RzLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0ICAgICAgICBpZiAod2luZG93LmNvbmZpcm0oXCJEZWxldGUgYWxsIGxpc3RzLiBBcmUgeW91IHN1cmU/XCIpKSB7XG5cdFx0ICAgIHRoaXMucHVyZ2UoKTtcblx0XHQgICAgdGhpcy51cGRhdGUoKTtcblx0XHR9XG5cdCAgICB9KTtcbiAgICB9XG4gICAgX2xvYWQgKCkge1xuXHR0aGlzLm5hbWUybGlzdCA9IHRoaXMuX2xpc3RzLmdldChcImFsbFwiKTtcblx0aWYgKCF0aGlzLm5hbWUybGlzdCl7XG5cdCAgICB0aGlzLm5hbWUybGlzdCA9IHt9O1xuXHQgICAgdGhpcy5fc2F2ZSgpO1xuXHR9XG4gICAgfVxuICAgIF9zYXZlICgpIHtcbiAgICAgICAgdGhpcy5fbGlzdHMucHV0KFwiYWxsXCIsIHRoaXMubmFtZTJsaXN0KTtcbiAgICB9XG4gICAgLy9cbiAgICAvLyByZXR1cm5zIHRoZSBuYW1lcyBvZiBhbGwgdGhlIGxpc3RzLCBzb3J0ZWRcbiAgICBnZXROYW1lcyAoKSB7XG4gICAgICAgIGxldCBubXMgPSBPYmplY3Qua2V5cyh0aGlzLm5hbWUybGlzdCk7XG5cdG5tcy5zb3J0KCk7XG5cdHJldHVybiBubXM7XG4gICAgfVxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZmYgYSBsaXN0IGV4aXN0cyB3aXRoIHRoaXMgbmFtZVxuICAgIGhhcyAobmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZSBpbiB0aGlzLm5hbWUybGlzdDtcbiAgICB9XG4gICAgLy8gSWYgbm8gbGlzdCB3aXRoIHRoZSBnaXZlbiBuYW1lIGV4aXN0cywgcmV0dXJuIHRoZSBuYW1lLlxuICAgIC8vIE90aGVyd2lzZSwgcmV0dXJuIGEgbW9kaWZpZWQgdmVyc2lvbiBvZiBuYW1lIHRoYXQgaXMgdW5pcXVlLlxuICAgIC8vIFVuaXF1ZSBuYW1lcyBhcmUgY3JlYXRlZCBieSBhcHBlbmRpbmcgYSBjb3VudGVyLlxuICAgIC8vIEUuZy4sIHVuaXF1aWZ5KFwiZm9vXCIpIC0+IFwiZm9vLjFcIiBvciBcImZvby4yXCIgb3Igd2hhdGV2ZXIuXG4gICAgLy9cbiAgICB1bmlxdWlmeSAobmFtZSkge1xuXHRpZiAoIXRoaXMuaGFzKG5hbWUpKSBcblx0ICAgIHJldHVybiBuYW1lO1xuXHRmb3IgKGxldCBpID0gMTsgOyBpICs9IDEpIHtcblx0ICAgIGxldCBubiA9IGAke25hbWV9LiR7aX1gO1xuXHQgICAgaWYgKCF0aGlzLmhhcyhubikpXG5cdCAgICAgICAgcmV0dXJuIG5uO1xuXHR9XG4gICAgfVxuICAgIC8vIHJldHVybnMgdGhlIGxpc3Qgd2l0aCB0aGlzIG5hbWUsIG9yIG51bGwgaWYgbm8gc3VjaCBsaXN0XG4gICAgZ2V0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLm5hbWUybGlzdFtuYW1lXTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIHJldHVybnMgYWxsIHRoZSBsaXN0cywgc29ydGVkIGJ5IG5hbWVcbiAgICBnZXRBbGwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXROYW1lcygpLm1hcChuID0+IHRoaXMuZ2V0KG4pKVxuICAgIH1cbiAgICAvLyBcbiAgICBjcmVhdGVPclVwZGF0ZSAobmFtZSwgaWRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMudXBkYXRlTGlzdChuYW1lLG51bGwsaWRzKSA6IHRoaXMuY3JlYXRlTGlzdChuYW1lLCBpZHMpO1xuICAgIH1cbiAgICAvLyBjcmVhdGVzIGEgbmV3IGxpc3Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgaWRzLlxuICAgIGNyZWF0ZUxpc3QgKG5hbWUsIGlkcywgZm9ybXVsYSkge1xuXHRpZiAobmFtZSAhPT0gXCJfXCIpXG5cdCAgICBuYW1lID0gdGhpcy51bmlxdWlmeShuYW1lKTtcblx0Ly9cblx0bGV0IGR0ID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMubmFtZTJsaXN0W25hbWVdID0ge1xuXHQgICAgbmFtZTogICAgIG5hbWUsXG5cdCAgICBpZHM6ICAgICAgaWRzLFxuXHQgICAgZm9ybXVsYTogIGZvcm11bGEgfHwgXCJcIixcblx0ICAgIGNyZWF0ZWQ6ICBkdCxcblx0ICAgIG1vZGlmaWVkOiBkdFxuXHR9O1xuXHR0aGlzLl9zYXZlKCk7XG5cdHJldHVybiB0aGlzLm5hbWUybGlzdFtuYW1lXTtcbiAgICB9XG4gICAgLy8gUHJvdmlkZSBhY2Nlc3MgdG8gZXZhbHVhdGlvbiBzZXJ2aWNlXG4gICAgZXZhbEZvcm11bGEgKGV4cHIpIHtcblx0cmV0dXJuIHRoaXMuZm9ybXVsYUV2YWwuZXZhbChleHByKTtcbiAgICB9XG4gICAgLy8gUmVmcmVzaGVzIGEgbGlzdCBhbmQgcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZWZyZXNoZWQgbGlzdC5cbiAgICAvLyBJZiB0aGUgbGlzdCBpZiBhIFBPTE8sIHByb21pc2UgcmVzb2x2ZXMgaW1tZWRpYXRlbHkgdG8gdGhlIGxpc3QuXG4gICAgLy8gT3RoZXJ3aXNlLCBzdGFydHMgYSByZWV2YWx1YXRpb24gb2YgdGhlIGZvcm11bGEgdGhhdCByZXNvbHZlcyBhZnRlciB0aGVcbiAgICAvLyBsaXN0J3MgaWRzIGhhdmUgYmVlbiB1cGRhdGVkLlxuICAgIC8vIElmIHRoZXJlIGlzIGFuIGVycm9yLCB0aGUgcmV0dXJuZWQgcHJvbWlzZSByZWplY3RzIHdpdGggdGhlIGVycm9yLlxuICAgIHJlZnJlc2hMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdGxzdC5tb2RpZmllZCA9IFwiXCIrbmV3IERhdGUoKTtcblx0aWYgKCFsc3QuZm9ybXVsYSlcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobHN0KTtcblx0ZWxzZSB7XG5cdCAgICBsZXQgcCA9IHRoaXMuZm9ybXVhbEV2YWwuZXZhbChsc3QuZm9ybXVsYSkudGhlbiggaWRzID0+IHtcblx0XHQgICAgbHN0LmlkcyA9IGlkcztcblx0XHQgICAgcmV0dXJuIGxzdDtcblx0XHR9KTtcblx0ICAgIHJldHVybiBwO1xuXHR9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlcyB0aGUgaWRzIGluIHRoZSBnaXZlbiBsaXN0XG4gICAgdXBkYXRlTGlzdCAobmFtZSwgbmV3bmFtZSwgbmV3aWRzLCBuZXdmb3JtdWxhKSB7XG5cdGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcbiAgICAgICAgaWYgKCEgbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuYW1lO1xuXHRpZiAobmV3bmFtZSkge1xuXHQgICAgZGVsZXRlIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXTtcblx0ICAgIGxzdC5uYW1lID0gdGhpcy51bmlxdWlmeShuZXduYW1lKTtcblx0ICAgIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXSA9IGxzdDtcblx0fVxuXHRpZiAobmV3aWRzKSBsc3QuaWRzICA9IG5ld2lkcztcblx0aWYgKG5ld2Zvcm11bGEgfHwgbmV3Zm9ybXVsYT09PVwiXCIpIGxzdC5mb3JtdWxhID0gbmV3Zm9ybXVsYTtcblx0bHN0Lm1vZGlmaWVkID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMuX3NhdmUoKTtcblx0cmV0dXJuIGxzdDtcbiAgICB9XG4gICAgLy8gZGVsZXRlcyB0aGUgc3BlY2lmaWVkIGxpc3RcbiAgICBkZWxldGVMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0ZGVsZXRlIHRoaXMubmFtZTJsaXN0W25hbWVdO1xuXHR0aGlzLl9zYXZlKCk7XG5cdC8vIEZJWE1FOiB1c2UgZXZlbnRzISFcblx0aWYgKGxzdCA9PT0gdGhpcy5hcHAuY3VycmVudExpc3QpIHRoaXMuYXBwLmN1cnJlbnRMaXN0ID0gbnVsbDtcblx0aWYgKGxzdCA9PT0gdGhpcy5hcHAubGlzdEVkaXRvci5saXN0KSB0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QgPSBudWxsO1xuXHRyZXR1cm4gbHN0O1xuICAgIH1cbiAgICAvLyBkZWxldGUgYWxsIGxpc3RzXG4gICAgcHVyZ2UgKCkge1xuICAgICAgICB0aGlzLm5hbWUybGlzdCA9IHt9XG5cdHRoaXMuX3NhdmUoKTtcblx0Ly9cblx0dGhpcy5hcHAuY3VycmVudExpc3QgPSBudWxsO1xuXHR0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QgPSBudWxsOyAvLyBGSVhNRSAtIHJlYWNoYWNyb3NzXG4gICAgfVxuICAgIC8vIFJldHVybnMgdHJ1ZSBpZmYgZXhwciBpcyB2YWxpZCwgd2hpY2ggbWVhbnMgaXQgaXMgYm90aCBzeW50YWN0aWNhbGx5IGNvcnJlY3QgXG4gICAgLy8gYW5kIGFsbCBtZW50aW9uZWQgbGlzdHMgZXhpc3QuXG4gICAgaXNWYWxpZCAoZXhwcikge1xuXHRyZXR1cm4gdGhpcy5mb3JtdWxhRXZhbC5pc1ZhbGlkKGV4cHIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIHRoZSBcIk15IGxpc3RzXCIgYm94IHdpdGggdGhlIGN1cnJlbnRseSBhdmFpbGFibGUgbGlzdHMuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgIG5ld2xpc3QgKExpc3QpIG9wdGlvbmFsLiBJZiBzcGVjaWZpZWQsIHdlIGp1c3QgY3JlYXRlZCB0aGF0IGxpc3QsIGFuZCBpdHMgbmFtZSBpc1xuICAgIC8vICAgXHRhIGdlbmVyYXRlZCBkZWZhdWx0LiBQbGFjZSBmb2N1cyB0aGVyZSBzbyB1c2VyIGNhbiB0eXBlIG5ldyBuYW1lLlxuICAgIHVwZGF0ZSAobmV3bGlzdCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBsaXN0cyA9IHRoaXMuZ2V0QWxsKCk7XG5cdGxldCBieU5hbWUgPSAoYSxiKSA9PiB7XG5cdCAgICBsZXQgYW4gPSBhLm5hbWUudG9Mb3dlckNhc2UoKTtcblx0ICAgIGxldCBibiA9IGIubmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgcmV0dXJuIChhbiA8IGJuID8gLTEgOiBhbiA+IGJuID8gKzEgOiAwKTtcblx0fTtcblx0bGV0IGJ5RGF0ZSA9IChhLGIpID0+ICgobmV3IERhdGUoYi5tb2RpZmllZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLm1vZGlmaWVkKSkuZ2V0VGltZSgpKTtcblx0bGlzdHMuc29ydChieU5hbWUpO1xuXHRsZXQgaXRlbXMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImxpc3RzXCJdJykuc2VsZWN0QWxsKFwiLmxpc3RJbmZvXCIpXG5cdCAgICAuZGF0YShsaXN0cyk7XG5cdGxldCBuZXdpdGVtcyA9IGl0ZW1zLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJsaXN0SW5mbyBmbGV4cm93XCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcImlcIikuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29ucyBidXR0b25cIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLFwiZWRpdFwiKVxuXHQgICAgLnRleHQoXCJtb2RlX2VkaXRcIilcblx0ICAgIC5hdHRyKFwidGl0bGVcIixcIkVkaXQgdGhpcyBsaXN0LlwiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJzcGFuXCIpLmF0dHIoXCJuYW1lXCIsXCJuYW1lXCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcInNpemVcIik7XG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcImRhdGVcIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwiaVwiKS5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zIGJ1dHRvblwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJkZWxldGVcIilcblx0ICAgIC50ZXh0KFwiaGlnaGxpZ2h0X29mZlwiKVxuXHQgICAgLmF0dHIoXCJ0aXRsZVwiLFwiRGVsZXRlIHRoaXMgbGlzdC5cIik7XG5cblx0aWYgKG5ld2l0ZW1zWzBdWzBdKSB7XG5cdCAgICBsZXQgbGFzdCA9IG5ld2l0ZW1zWzBdW25ld2l0ZW1zWzBdLmxlbmd0aC0xXTtcblx0ICAgIGxhc3Quc2Nyb2xsSW50b1ZpZXcoKTtcblx0fVxuXG5cdGl0ZW1zXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgbHN0PT5sc3QubmFtZSlcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChsc3QpIHtcblx0XHRpZiAoZDMuZXZlbnQuYWx0S2V5KSB7XG5cdFx0ICAgIC8vIGFsdC1jbGljayBjb3BpZXMgdGhlIGxpc3QncyBuYW1lIGludG8gdGhlIGZvcm11bGEgZWRpdG9yXG5cdFx0ICAgIGxldCBsZSA9IHNlbGYuYXBwLmxpc3RFZGl0b3I7IC8vIEZJWE1FIHJlYWNob3ZlclxuXHRcdCAgICBsZXQgcyA9IGxzdC5uYW1lO1xuXHRcdCAgICBsZXQgcmUgPSAvWyA9KCkrKi1dLztcblx0XHQgICAgaWYgKHMuc2VhcmNoKHJlKSA+PSAwKVxuXHRcdFx0cyA9ICdcIicgKyBzICsgJ1wiJztcblx0XHQgICAgaWYgKCFsZS5pc0VkaXRpbmdGb3JtdWxhKSB7XG5cdFx0ICAgICAgICBsZS5vcGVuKCk7XG5cdFx0XHRsZS5vcGVuRm9ybXVsYUVkaXRvcigpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vXG5cdFx0ICAgIGxlLmFkZFRvTGlzdEV4cHIocysnICcpO1xuXHRcdH1cblx0XHQvLyBvdGhlcndpc2UsIHNldCB0aGlzIGFzIHRoZSBjdXJyZW50IGxpc3Rcblx0XHRlbHNlIFxuXHRcdCAgICBzZWxmLmFwcC5jdXJyZW50TGlzdCA9IGxzdDsgLy8gRklYTUUgcmVhY2hvdmVyXG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJlZGl0XCJdJylcblx0ICAgIC8vIGVkaXQ6IGNsaWNrIFxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24obHN0KSB7XG5cdCAgICAgICAgc2VsZi5hcHAubGlzdEVkaXRvci5vcGVuKGxzdCk7XG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCdzcGFuW25hbWU9XCJuYW1lXCJdJylcblx0ICAgIC50ZXh0KGxzdCA9PiBsc3QubmFtZSk7XG5cdGl0ZW1zLnNlbGVjdCgnc3BhbltuYW1lPVwiZGF0ZVwiXScpLnRleHQobHN0ID0+IHtcblx0ICAgIGxldCBtZCA9IG5ldyBEYXRlKGxzdC5tb2RpZmllZCk7XG5cdCAgICBsZXQgZCA9IGAke21kLmdldEZ1bGxZZWFyKCl9LSR7bWQuZ2V0TW9udGgoKSsxfS0ke21kLmdldERhdGUoKX0gYCBcblx0ICAgICAgICAgICsgYDoke21kLmdldEhvdXJzKCl9LiR7bWQuZ2V0TWludXRlcygpfS4ke21kLmdldFNlY29uZHMoKX1gO1xuXHQgICAgcmV0dXJuIGQ7XG5cdH0pO1xuXHRpdGVtcy5zZWxlY3QoJ3NwYW5bbmFtZT1cInNpemVcIl0nKS50ZXh0KGxzdCA9PiBsc3QuaWRzLmxlbmd0aCk7XG5cdGl0ZW1zLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZGVsZXRlXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsIGxzdCA9PiB7XG5cdCAgICAgICAgdGhpcy5kZWxldGVMaXN0KGxzdC5uYW1lKTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXG5cdFx0Ly8gTm90IHN1cmUgd2h5IHRoaXMgaXMgbmVjZXNzYXJ5IGhlcmUuIEJ1dCB3aXRob3V0IGl0LCB0aGUgbGlzdCBpdGVtIGFmdGVyIHRoZSBvbmUgYmVpbmdcblx0XHQvLyBkZWxldGVkIGhlcmUgd2lsbCByZWNlaXZlIGEgY2xpY2sgZXZlbnQuXG5cdFx0ZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0Ly9cblx0ICAgIH0pO1xuXG5cdC8vXG5cdGl0ZW1zLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0aWYgKG5ld2xpc3QpIHtcblx0ICAgIGxldCBsc3RlbHQgPSBcblx0ICAgICAgICBkMy5zZWxlY3QoYCNteWxpc3RzIFtuYW1lPVwibGlzdHNcIl0gW25hbWU9XCIke25ld2xpc3QubmFtZX1cIl1gKVswXVswXTtcbiAgICAgICAgICAgIGxzdGVsdC5zY3JvbGxJbnRvVmlldyhmYWxzZSk7XG5cdH1cbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIExpc3RNYW5hZ2VyXG5cbmV4cG9ydCB7IExpc3RNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfSBmcm9tICcuL0xpc3RGb3JtdWxhUGFyc2VyJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBLbm93cyBob3cgdG8gcGFyc2UgYW5kIGV2YWx1YXRlIGEgbGlzdCBmb3JtdWxhIChha2EgbGlzdCBleHByZXNzaW9uKS5cbmNsYXNzIExpc3RGb3JtdWxhRXZhbHVhdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAobGlzdE1hbmFnZXIpIHtcblx0dGhpcy5saXN0TWFuYWdlciA9IGxpc3RNYW5hZ2VyO1xuICAgICAgICB0aGlzLnBhcnNlciA9IG5ldyBMaXN0Rm9ybXVsYVBhcnNlcigpO1xuICAgIH1cbiAgICAvLyBFdmFsdWF0ZXMgdGhlIGV4cHJlc3Npb24gYW5kIHJldHVybnMgYSBQcm9taXNlIGZvciB0aGUgbGlzdCBvZiBpZHMuXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gZXJyb3IsIHRoZSBwcm9taXNlIHJlamVjdHMgd2l0aCB0aGUgZXJyb3IgbWVzc2FnZS5cbiAgICBldmFsIChleHByKSB7XG5cdCByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICAgdHJ5IHtcblx0XHRsZXQgYXN0ID0gdGhpcy5wYXJzZXIucGFyc2UoZXhwcik7XG5cdFx0bGV0IGxtID0gdGhpcy5saXN0TWFuYWdlcjtcblx0XHRsZXQgcmVhY2ggPSAobikgPT4ge1xuXHRcdCAgICBpZiAodHlwZW9mKG4pID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdFx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG47XG5cdFx0XHRyZXR1cm4gbmV3IFNldChsc3QuaWRzKTtcblx0XHQgICAgfVxuXHRcdCAgICBlbHNlIHtcblx0XHRcdGxldCBsID0gcmVhY2gobi5sZWZ0KTtcblx0XHRcdGxldCByID0gcmVhY2gobi5yaWdodCk7XG5cdFx0XHRyZXR1cm4gbFtuLm9wXShyKTtcblx0XHQgICAgfVxuXHRcdH1cblx0XHRsZXQgaWRzID0gcmVhY2goYXN0KTtcblx0XHRyZXNvbHZlKEFycmF5LmZyb20oaWRzKSk7XG5cdCAgICB9XG5cdCAgICBjYXRjaCAoZSkge1xuXHRcdHJlamVjdChlKTtcblx0ICAgIH1cblx0IH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIC8vIENoZWNrcyB0aGUgY3VycmVudCBleHByZXNzaW9uIGZvciBzeW50YWN0aWMgYW5kIHNlbWFudGljIHZhbGlkaXR5IGFuZCBzZXRzIHRoZSBcbiAgICAvLyB2YWxpZC9pbnZhbGlkIGNsYXNzIGFjY29yZGluZ2x5LiBTZW1hbnRpYyB2YWxpZGl0eSBzaW1wbHkgbWVhbnMgYWxsIG5hbWVzIGluIHRoZVxuICAgIC8vIGV4cHJlc3Npb24gYXJlIGJvdW5kLlxuICAgIC8vXG4gICAgaXNWYWxpZCAgKGV4cHIpIHtcblx0dHJ5IHtcblx0ICAgIC8vIGZpcnN0IGNoZWNrIHN5bnRheFxuXHQgICAgbGV0IGFzdCA9IHRoaXMucGFyc2VyLnBhcnNlKGV4cHIpO1xuXHQgICAgbGV0IGxtICA9IHRoaXMubGlzdE1hbmFnZXI7IFxuXHQgICAgLy8gbm93IGNoZWNrIGxpc3QgbmFtZXNcblx0ICAgIChmdW5jdGlvbiByZWFjaChuKSB7XG5cdFx0aWYgKHR5cGVvZihuKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdCAgICBsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdCAgICBpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgblxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHQgICAgcmVhY2gobi5sZWZ0KTtcblx0XHQgICAgcmVhY2gobi5yaWdodCk7XG5cdFx0fVxuXHQgICAgfSkoYXN0KTtcblxuXHQgICAgLy8gVGh1bWJzIHVwIVxuXHQgICAgcmV0dXJuIHRydWU7XG5cdH1cblx0Y2F0Y2ggKGUpIHtcblx0ICAgIC8vIHN5bnRheCBlcnJvciBvciB1bmtub3duIGxpc3QgbmFtZVxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEZvcm11bGFFdmFsdWF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHNldENhcmV0UG9zaXRpb24sIG1vdmVDYXJldFBvc2l0aW9uLCBnZXRDYXJldFJhbmdlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9IGZyb20gJy4vTGlzdEZvcm11bGFQYXJzZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIExpc3RFZGl0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuXHRzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMucGFyc2VyID0gbmV3IExpc3RGb3JtdWxhUGFyc2VyKCk7XG5cdHRoaXMuZm9ybSA9IG51bGw7XG5cdHRoaXMuaW5pdERvbSgpO1xuXHR0aGlzLmlzRWRpdGluZ0Zvcm11bGEgPSBmYWxzZTtcblx0Ly9cblx0dGhpcy5saXN0ID0gbnVsbDtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0dGhpcy5mb3JtID0gdGhpcy5yb290LnNlbGVjdChcImZvcm1cIilbMF1bMF07XG5cdGlmICghdGhpcy5mb3JtKSB0aHJvdyBcIkNvdWxkIG5vdCBpbml0IExpc3RFZGl0b3IuIE5vIGZvcm0gZWxlbWVudC5cIjtcblx0ZDMuc2VsZWN0KHRoaXMuZm9ybSlcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgdCA9IGQzLmV2ZW50LnRhcmdldDtcblx0XHRpZiAoXCJidXR0b25cIiA9PT0gdC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpe1xuXHRcdCAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCAgICBsZXQgZiA9IHRoaXMuZm9ybTtcblx0XHQgICAgbGV0IHMgPSBmLmlkcy52YWx1ZS5yZXBsYWNlKC9bLHxdL2csICcgJykudHJpbSgpO1xuXHRcdCAgICBsZXQgaWRzID0gcyA/IHMuc3BsaXQoL1xccysvKSA6IFtdO1xuXHRcdCAgICAvLyBzYXZlIGxpc3Rcblx0XHQgICAgaWYgKHQubmFtZSA9PT0gXCJzYXZlXCIpIHtcblx0XHRcdGlmICghdGhpcy5saXN0KSByZXR1cm47XG5cdFx0XHR0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGVMaXN0KHRoaXMubGlzdC5uYW1lLCBmLm5hbWUudmFsdWUsIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNyZWF0ZSBuZXcgbGlzdFxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwibmV3XCIpIHtcblx0XHRcdGxldCBuID0gZi5uYW1lLnZhbHVlLnRyaW0oKTtcblx0XHRcdGlmICghbikge1xuXHRcdFx0ICAgYWxlcnQoXCJZb3VyIGxpc3QgaGFzIG5vIG5hbWUgYW5kIGlzIHZlcnkgc2FkLiBQbGVhc2UgZ2l2ZSBpdCBhIG5hbWUgYW5kIHRyeSBhZ2Fpbi5cIik7XG5cdFx0XHQgICByZXR1cm5cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKG4uaW5kZXhPZignXCInKSA+PSAwKSB7XG5cdFx0XHQgICBhbGVydChcIk9oIGRlYXIsIHlvdXIgbGlzdCdzIG5hbWUgaGFzIGEgZG91YmxlIHF1b3RlIGNoYXJhY3RlciwgYW5kIEknbSBhZmFyYWlkIHRoYXQncyBub3QgYWxsb3dlZC4gUGxlYXNlIHJlbW92ZSB0aGUgJ1xcXCInIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdFx0ICAgcmV0dXJuXG5cdFx0XHR9XG5cdFx0ICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5jcmVhdGVMaXN0KG4sIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNsZWFyIGZvcm1cblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcImNsZWFyXCIpIHtcblx0XHQgICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG5cdFx0ICAgIH1cblx0XHQgICAgLy8gZm9yd2FyZCB0byBNR0lcblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcInRvTWdpXCIpIHtcblx0XHQgICAgICAgIGxldCBmcm0gPSBkMy5zZWxlY3QoJyNtZ2liYXRjaGZvcm0nKVswXVswXTtcblx0XHRcdGZybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIiBcIik7XG5cdFx0XHRmcm0uc3VibWl0KClcblx0XHQgICAgfVxuXHRcdCAgICAvLyBmb3J3YXJkIHRvIE1vdXNlTWluZVxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwidG9Nb3VzZU1pbmVcIikge1xuXHRcdCAgICAgICAgbGV0IGZybSA9IGQzLnNlbGVjdCgnI21vdXNlbWluZWZvcm0nKVswXVswXTtcblx0XHRcdGZybS5leHRlcm5hbGlkcy52YWx1ZSA9IGlkcy5qb2luKFwiLFwiKTtcblx0XHRcdGZybS5zdWJtaXQoKVxuXHRcdCAgICB9XG5cdFx0fVxuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBzaG93L2hpZGUgZm9ybXVsYSBlZGl0b3Jcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNlY3Rpb25cIl0gLmJ1dHRvbltuYW1lPVwiZWRpdGZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGVGb3JtdWxhRWRpdG9yKCkpO1xuXHQgICAgXG5cdC8vIElucHV0IGJveDogZm9ybXVsYTogdmFsaWRhdGUgb24gYW55IGlucHV0XG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIHRoaXMudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBGb3J3YXJkIC0+IE1HSS9Nb3VzZU1pbmU6IGRpc2FibGUgYnV0dG9ucyBpZiBubyBpZHNcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIGxldCBlbXB0eSA9IHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMDtcblx0XHR0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0aGlzLmZvcm0udG9Nb3VzZU1pbmUuZGlzYWJsZWQgPSBlbXB0eTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbnM6IHRoZSBsaXN0IG9wZXJhdG9yIGJ1dHRvbnMgKHVuaW9uLCBpbnRlcnNlY3Rpb24sIGV0Yy4pXG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uLmxpc3RvcCcpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gYWRkIG15IHN5bWJvbCB0byB0aGUgZm9ybXVsYVxuXHRcdGxldCBpbmVsdCA9IHNlbGYuZm9ybS5mb3JtdWxhO1xuXHRcdGxldCBvcCA9IGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwibmFtZVwiKTtcblx0XHRzZWxmLmFkZFRvTGlzdEV4cHIob3ApO1xuXHRcdHNlbGYudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IHJlZnJlc2ggYnV0dG9uIGZvciBydW5uaW5nIHRoZSBmb3JtdWxhXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uW25hbWU9XCJyZWZyZXNoXCJdJylcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgZW1lc3NhZ2U9XCJJJ20gdGVycmlibHkgc29ycnksIGJ1dCB0aGVyZSBhcHBlYXJzIHRvIGJlIGEgcHJvYmxlbSB3aXRoIHlvdXIgbGlzdCBleHByZXNzaW9uOiBcIjtcblx0XHRsZXQgZm9ybXVsYSA9IHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlLnRyaW0oKTtcblx0XHRpZiAoZm9ybXVsYS5sZW5ndGggPT09IDApXG5cdFx0ICAgIHJldHVybjtcblx0ICAgICAgICB0aGlzLmFwcC5saXN0TWFuYWdlclxuXHRcdCAgICAuZXZhbEZvcm11bGEoZm9ybXVsYSlcblx0XHQgICAgLnRoZW4oaWRzID0+IHtcblx0XHQgICAgICAgIHRoaXMuZm9ybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIlxcblwiKTtcblx0XHQgICAgIH0pXG5cdFx0ICAgIC5jYXRjaChlID0+IGFsZXJ0KGVtZXNzYWdlICsgZSkpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBjbG9zZSBmb3JtdWxhIGVkaXRvclxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gLmJ1dHRvbltuYW1lPVwiY2xvc2VcIl0nKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5jbG9zZUZvcm11bGFFZGl0b3IoKSApO1xuXHRcblx0Ly8gQ2xpY2tpbmcgdGhlIGJveCBjb2xsYXBzZSBidXR0b24gc2hvdWxkIGNsZWFyIHRoZSBmb3JtXG5cdHRoaXMucm9vdC5zZWxlY3QoXCIuYnV0dG9uLmNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5leHRyYVwiLCAoKSA9PiB7XG5cdCAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0XHR0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpO1xuXHQgICAgfSk7XG4gICAgfVxuICAgIHBhcnNlSWRzIChzKSB7XG5cdHJldHVybiBzLnJlcGxhY2UoL1ssfF0vZywgJyAnKS50cmltKCkuc3BsaXQoL1xccysvKTtcbiAgICB9XG4gICAgZ2V0IGxpc3QgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdDtcbiAgICB9XG4gICAgc2V0IGxpc3QgKGxzdCkge1xuICAgICAgICB0aGlzLl9saXN0ID0gbHN0O1xuXHR0aGlzLl9zeW5jRGlzcGxheSgpO1xuICAgIH1cbiAgICBfc3luY0Rpc3BsYXkgKCkge1xuXHRsZXQgbHN0ID0gdGhpcy5fbGlzdDtcblx0aWYgKCFsc3QpIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0ubW9kaWZpZWQudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uc2F2ZS5kaXNhYmxlZCA9IHRydWU7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkID0gdHJ1ZTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gbHN0Lm5hbWU7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gbHN0Lmlkcy5qb2luKCdcXG4nKTtcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gbHN0LmZvcm11bGEgfHwgXCJcIjtcblx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZS50cmltKCkubGVuZ3RoID4gMDtcblx0ICAgIHRoaXMuZm9ybS5tb2RpZmllZC52YWx1ZSA9IGxzdC5tb2RpZmllZDtcblx0ICAgIHRoaXMuZm9ybS5zYXZlLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgXG5cdCAgICAgID0gdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkIFxuXHQgICAgICAgID0gKHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMCk7XG5cdH1cblx0dGhpcy52YWxpZGF0ZUV4cHIoKTtcbiAgICB9XG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuICAgIH1cbiAgICBvcGVuIChsc3QpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbHN0O1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiLCBmYWxzZSk7XG4gICAgfVxuICAgIGNsb3NlICgpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIiwgdHJ1ZSk7XG4gICAgfVxuICAgIG9wZW5Gb3JtdWxhRWRpdG9yICgpIHtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJlZGl0aW5nZm9ybXVsYVwiLCB0cnVlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gdHJ1ZTtcblx0bGV0IGYgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZTtcblx0dGhpcy5mb3JtLmZvcm11bGEuZm9jdXMoKTtcblx0c2V0Q2FyZXRQb3NpdGlvbih0aGlzLmZvcm0uZm9ybXVsYSwgZi5sZW5ndGgpO1xuICAgIH1cbiAgICBjbG9zZUZvcm11bGFFZGl0b3IgKCkge1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImVkaXRpbmdmb3JtdWxhXCIsIGZhbHNlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gZmFsc2U7XG4gICAgfVxuICAgIHRvZ2dsZUZvcm11bGFFZGl0b3IgKCkge1xuXHRsZXQgc2hvd2luZyA9IHRoaXMucm9vdC5jbGFzc2VkKFwiZWRpdGluZ2Zvcm11bGFcIik7XG5cdHNob3dpbmcgPyB0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpIDogdGhpcy5vcGVuRm9ybXVsYUVkaXRvcigpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDaGVja3MgdGhlIGN1cnJlbnQgZXhwcmVzc2lvbiBhbmQgc2V0cyB0aGUgdmFsaWQvaW52YWxpZCBjbGFzcy5cbiAgICB2YWxpZGF0ZUV4cHIgICgpIHtcblx0bGV0IGlucCA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKTtcblx0bGV0IGV4cHIgPSBpbnBbMF1bMF0udmFsdWUudHJpbSgpO1xuXHRpZiAoIWV4cHIpIHtcblx0ICAgIGlucC5jbGFzc2VkKFwidmFsaWRcIixmYWxzZSkuY2xhc3NlZChcImludmFsaWRcIixmYWxzZSk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IGZhbHNlO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgbGV0IGlzVmFsaWQgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5pc1ZhbGlkKGV4cHIpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHQgICAgaW5wLmNsYXNzZWQoXCJ2YWxpZFwiLCBpc1ZhbGlkKS5jbGFzc2VkKFwiaW52YWxpZFwiLCAhaXNWYWxpZCk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IHRydWU7XG5cdH1cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYWRkVG9MaXN0RXhwciAodGV4dCkge1xuXHRsZXQgaW5wID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIFtuYW1lPVwiZm9ybXVsYVwiXScpO1xuXHRsZXQgaWVsdCA9IGlucFswXVswXTtcblx0bGV0IHYgPSBpZWx0LnZhbHVlO1xuXHRsZXQgc3BsaWNlID0gZnVuY3Rpb24gKGUsdCl7XG5cdCAgICBsZXQgdiA9IGUudmFsdWU7XG5cdCAgICBsZXQgciA9IGdldENhcmV0UmFuZ2UoZSk7XG5cdCAgICBlLnZhbHVlID0gdi5zbGljZSgwLHJbMF0pICsgdCArIHYuc2xpY2UoclsxXSk7XG5cdCAgICBzZXRDYXJldFBvc2l0aW9uKGUsIHJbMF0rdC5sZW5ndGgpO1xuXHQgICAgZS5mb2N1cygpO1xuXHR9XG5cdGxldCByYW5nZSA9IGdldENhcmV0UmFuZ2UoaWVsdCk7XG5cdGlmIChyYW5nZVswXSA9PT0gcmFuZ2VbMV0pIHtcblx0ICAgIC8vIG5vIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dCk7XG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKSBcblx0XHRtb3ZlQ2FyZXRQb3NpdGlvbihpZWx0LCAtMSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICAvLyB0aGVyZSBpcyBhIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKVxuXHRcdC8vIHN1cnJvdW5kIGN1cnJlbnQgc2VsZWN0aW9uIHdpdGggcGFyZW5zLCB0aGVuIG1vdmUgY2FyZXQgYWZ0ZXJcblx0XHR0ZXh0ID0gJygnICsgdi5zbGljZShyYW5nZVswXSxyYW5nZVsxXSkgKyAnKSc7XG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dClcblx0fVxuXHR0aGlzLnZhbGlkYXRlRXhwcigpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIExpc3RFZGl0b3JcblxuZXhwb3J0IHsgTGlzdEVkaXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEVkaXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTG9jYWxTdG9yYWdlTWFuYWdlciB9IGZyb20gJy4vU3RvcmFnZU1hbmFnZXInO1xuXG5jb25zdCBNR1JfTkFNRSA9IFwicHJlZnNNYW5hZ2VyXCI7XG5jb25zdCBJVEVNX05BTUU9IFwidXNlclByZWZzXCI7XG5cbmNsYXNzIFVzZXJQcmVmc01hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlID0gbmV3IExvY2FsU3RvcmFnZU1hbmFnZXIoTUdSX05BTUUpO1xuXHR0aGlzLmRhdGEgPSBudWxsO1xuXHR0aGlzLl9sb2FkKCk7XG4gICAgfVxuICAgIF9sb2FkICgpIHtcblx0dGhpcy5kYXRhID0gdGhpcy5zdG9yYWdlLmdldChJVEVNX05BTUUpO1xuXHRpZiAoIXRoaXMuZGF0YSl7XG5cdCAgICB0aGlzLmRhdGEgPSB7fTtcblx0ICAgIHRoaXMuX3NhdmUoKTtcblx0fVxuICAgIH1cbiAgICBfc2F2ZSAoKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5wdXQoSVRFTV9OQU1FLCB0aGlzLmRhdGEpO1xuICAgIH1cbiAgICBoYXMgKG4pIHtcbiAgICB9XG4gICAgZ2V0IChuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbbl07XG4gICAgfVxuICAgIGdldEFsbCAoKSB7XG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRhdGEpXG4gICAgfVxuICAgIHNldCAobiwgdikge1xuICAgICAgICB0aGlzLmRhdGFbbl0gPSB2O1xuXHR0aGlzLl9zYXZlKCk7XG4gICAgfVxuICAgIHNldEFsbCAodikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuZGF0YSwgdik7XG5cdHRoaXMuX3NhdmUoKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IFVzZXJQcmVmc01hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1VzZXJQcmVmc01hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEZhY2V0IH0gZnJvbSAnLi9GYWNldCc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgRmFjZXRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwKSB7XG5cdHRoaXMuYXBwID0gYXBwO1xuXHR0aGlzLmZhY2V0cyA9IFtdO1xuXHR0aGlzLm5hbWUyZmFjZXQgPSB7fVxuICAgIH1cbiAgICBhZGRGYWNldCAobmFtZSwgdmFsdWVGY24pIHtcblx0aWYgKHRoaXMubmFtZTJmYWNldFtuYW1lXSkgdGhyb3cgXCJEdXBsaWNhdGUgZmFjZXQgbmFtZS4gXCIgKyBuYW1lO1xuXHRsZXQgZmFjZXQgPSBuZXcgRmFjZXQobmFtZSwgdGhpcywgdmFsdWVGY24pO1xuICAgICAgICB0aGlzLmZhY2V0cy5wdXNoKCBmYWNldCApO1xuXHR0aGlzLm5hbWUyZmFjZXRbbmFtZV0gPSBmYWNldDtcblx0cmV0dXJuIGZhY2V0XG4gICAgfVxuICAgIHRlc3QgKGYpIHtcbiAgICAgICAgbGV0IHZhbHMgPSB0aGlzLmZhY2V0cy5tYXAoIGZhY2V0ID0+IGZhY2V0LnRlc3QoZikgKTtcblx0cmV0dXJuIHZhbHMucmVkdWNlKChhY2N1bSwgdmFsKSA9PiBhY2N1bSAmJiB2YWwsIHRydWUpO1xuICAgIH1cbiAgICBhcHBseUFsbCAoKSB7XG5cdGxldCBzaG93ID0gbnVsbDtcblx0bGV0IGhpZGUgPSBcIm5vbmVcIjtcblx0Ly8gRklYTUU6IG1ham9yIHJlYWNob3ZlclxuXHR0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcImcuc3RyaXBzXCIpLnNlbGVjdEFsbCgncmVjdC5mZWF0dXJlJylcblx0ICAgIC5zdHlsZShcImRpc3BsYXlcIiwgZiA9PiB0aGlzLnRlc3QoZikgPyBzaG93IDogaGlkZSk7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgRmFjZXRNYW5hZ2VyXG5cbmV4cG9ydCB7IEZhY2V0TWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmFjZXRNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIEZhY2V0IHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSwgbWFuYWdlciwgdmFsdWVGY24pIHtcblx0dGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcblx0dGhpcy52YWx1ZXMgPSBbXTtcblx0dGhpcy52YWx1ZUZjbiA9IHZhbHVlRmNuO1xuICAgIH1cbiAgICBzZXRWYWx1ZXMgKHZhbHVlcywgcXVpZXRseSkge1xuICAgICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcblx0aWYgKCEgcXVpZXRseSkge1xuXHQgICAgdGhpcy5tYW5hZ2VyLmFwcGx5QWxsKCk7XG5cdCAgICB0aGlzLm1hbmFnZXIuYXBwLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9XG4gICAgfVxuICAgIHRlc3QgKGYpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLnZhbHVlcyB8fCB0aGlzLnZhbHVlcy5sZW5ndGggPT09IDAgfHwgdGhpcy52YWx1ZXMuaW5kZXhPZiggdGhpcy52YWx1ZUZjbihmKSApID49IDA7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgRmFjZXRcblxuZXhwb3J0IHsgRmFjZXQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZhY2V0LmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBkM3RzdiB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQmxvY2tUcmFuc2xhdG9yIH0gZnJvbSAnLi9CbG9ja1RyYW5zbGF0b3InO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEJsb2NrVHJhbnNsYXRvciBtYW5hZ2VyIGNsYXNzLiBGb3IgYW55IGdpdmVuIHBhaXIgb2YgZ2Vub21lcywgQSBhbmQgQiwgbG9hZHMgdGhlIHNpbmdsZSBibG9jayBmaWxlXG4vLyBmb3IgdHJhbnNsYXRpbmcgYmV0d2VlbiB0aGVtLCBhbmQgaW5kZXhlcyBpdCBcImZyb20gYm90aCBkaXJlY3Rpb25zXCI6XG4vLyBcdEEtPkItPiBbQUJfQmxvY2tGaWxlXSA8LUE8LUJcbi8vXG5jbGFzcyBCVE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG5cdHRoaXMucmNCbG9ja3MgPSB7fTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZWdpc3RlckJsb2NrcyAodXJsLCBhR2Vub21lLCBiR2Vub21lLCBibG9ja3MpIHtcblx0Y29uc29sZS5sb2coXCJSZWdpc3RlcmluZyBibG9ja3MgZnJvbTogXCIgKyB1cmwsIGJsb2Nrcyk7XG5cdGxldCBhbmFtZSA9IGFHZW5vbWUubmFtZTtcblx0bGV0IGJuYW1lID0gYkdlbm9tZS5uYW1lO1xuXHRsZXQgYmxrRmlsZSA9IG5ldyBCbG9ja1RyYW5zbGF0b3IodXJsLGFHZW5vbWUsYkdlbm9tZSxibG9ja3MpO1xuXHRpZiggISB0aGlzLnJjQmxvY2tzW2FuYW1lXSkgdGhpcy5yY0Jsb2Nrc1thbmFtZV0gPSB7fTtcblx0aWYoICEgdGhpcy5yY0Jsb2Nrc1tibmFtZV0pIHRoaXMucmNCbG9ja3NbYm5hbWVdID0ge307XG5cdHRoaXMucmNCbG9ja3NbYW5hbWVdW2JuYW1lXSA9IGJsa0ZpbGU7XG5cdHRoaXMucmNCbG9ja3NbYm5hbWVdW2FuYW1lXSA9IGJsa0ZpbGU7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gTG9hZHMgdGhlIHN5bnRlbnkgYmxvY2sgZmlsZSBmb3IgZ2Vub21lcyBhR2Vub21lIGFuZCBiR2Vub21lLlxuICAgIC8vIFxuICAgIGdldEJsb2NrRmlsZSAoYUdlbm9tZSwgYkdlbm9tZSkge1xuXHQvLyBCZSBhIGxpdHRsZSBzbWFydCBhYm91dCB0aGUgb3JkZXIgd2UgdHJ5IHRoZSBuYW1lcy4uLlxuXHRpZiAoYkdlbm9tZS5uYW1lIDwgYUdlbm9tZS5uYW1lKSB7XG5cdCAgICBsZXQgdG1wID0gYUdlbm9tZTsgYUdlbm9tZSA9IGJHZW5vbWU7IGJHZW5vbWUgPSB0bXA7XG5cdH1cblx0Ly8gRmlyc3QsIHNlZSBpZiB3ZSBhbHJlYWR5IGhhdmUgdGhpcyBwYWlyXG5cdGxldCBhbmFtZSA9IGFHZW5vbWUubmFtZTtcblx0bGV0IGJuYW1lID0gYkdlbm9tZS5uYW1lO1xuXHRsZXQgYmYgPSAodGhpcy5yY0Jsb2Nrc1thbmFtZV0gfHwge30pW2JuYW1lXTtcblx0aWYgKGJmKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShiZik7XG5cdFxuXHQvLyBGb3IgYW55IGdpdmVuIGdlbm9tZSBwYWlyLCBvbmx5IG9uZSBvZiB0aGUgZm9sbG93aW5nIHR3byBmaWxlc1xuXHQvLyBpcyBnZW5lcmF0ZWQgYnkgdGhlIGJhY2sgZW5kXG5cdGxldCBmbjEgPSBgLi9kYXRhL2Jsb2NrZmlsZXMvJHthR2Vub21lLm5hbWV9LSR7Ykdlbm9tZS5uYW1lfS50c3ZgXG5cdGxldCBmbjIgPSBgLi9kYXRhL2Jsb2NrZmlsZXMvJHtiR2Vub21lLm5hbWV9LSR7YUdlbm9tZS5uYW1lfS50c3ZgXG5cdC8vIFRoZSBmaWxlIGZvciBBLT5CIGlzIHNpbXBseSBhIHJlLXNvcnQgb2YgdGhlIGZpbGUgZnJvbSBCLT5BLiBTbyB0aGUgXG5cdC8vIGJhY2sgZW5kIG9ubHkgY3JlYXRlcyBvbmUgb2YgdGhlbS5cblx0Ly8gV2UnbGwgdHJ5IG9uZSBhbmQgaWYgdGhhdCdzIG5vdCBpdCwgdGhlbiB0cnkgdGhlIG90aGVyLlxuXHQvLyAoQW5kIGlmIFRIQVQncyBub3QgaXQsIHRoZW4gY3J5IGEgcml2ZXIuLi4pXG5cdGxldCBzZWxmID0gdGhpcztcblx0cmV0dXJuIGQzdHN2KGZuMSlcblx0ICAudGhlbihmdW5jdGlvbihibG9ja3Mpe1xuXHQgICAgICAvLyB5dXAsIGl0IHdhcyBBLUJcblx0ICAgICAgc2VsZi5yZWdpc3RlckJsb2NrcyhmbjEsIGFHZW5vbWUsIGJHZW5vbWUsIGJsb2Nrcyk7XG5cdCAgICAgIHJldHVybiBibG9ja3Ncblx0ICB9KVxuXHQgIC5jYXRjaChmdW5jdGlvbihlKXtcblx0ICAgICAgY29uc29sZS5sb2coYElORk86IERpc3JlZ2FyZCB0aGF0IDQwNCBtZXNzYWdlISAke2ZuMX0gd2FzIG5vdCBmb3VuZC4gVHJ5aW5nICR7Zm4yfS5gKTtcblx0ICAgICAgcmV0dXJuIGQzdHN2KGZuMilcblx0XHQgIC50aGVuKGZ1bmN0aW9uKGJsb2Nrcyl7XG5cdFx0ICAgICAgLy8gbm9wZSwgaXQgd2FzIEItQVxuXHRcdCAgICAgIHNlbGYucmVnaXN0ZXJCbG9ja3MoZm4yLCBiR2Vub21lLCBhR2Vub21lLCBibG9ja3MpO1xuXHRcdCAgICAgIHJldHVybiBibG9ja3Ncblx0XHQgIH0pXG5cdFx0ICAuY2F0Y2goZnVuY3Rpb24oZSl7XG5cdFx0ICAgICAgY29uc29sZS5sb2coJ0J1dCBUSEFUIDQwNCBtZXNzYWdlIGlzIGEgcHJvYmxlbS4nKTtcblx0XHQgICAgICB0aHJvdyBgQ2Fubm90IGdldCBibG9jayBmaWxlIGZvciB0aGlzIGdlbm9tZSBwYWlyOiAke2FHZW5vbWUubmFtZX0gJHtiR2Vub21lLm5hbWV9LlxcbihFcnJvcj0ke2V9KWA7XG5cdFx0ICB9KTtcblx0ICB9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHRoZSB0cmFuc2xhdG9yIGhhcyBsb2FkZWQgYWxsIHRoZSBkYXRhIG5lZWRlZFxuICAgIC8vIGZvciB0cmFuc2xhdGluZyBjb29yZGluYXRlcyBiZXR3ZWVuIHRoZSBjdXJyZW50IHJlZiBzdHJhaW4gYW5kIHRoZSBjdXJyZW50IGNvbXBhcmlzb24gc3RyYWlucy5cbiAgICAvL1xuICAgIHJlYWR5ICgpIHtcblx0bGV0IHByb21pc2VzID0gdGhpcy5hcHAuY0dlbm9tZXMubWFwKGNnID0+IHRoaXMuZ2V0QmxvY2tGaWxlKHRoaXMuYXBwLnJHZW5vbWUsIGNnKSk7XG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBzeW50ZW55IGJsb2NrIHRyYW5zbGF0b3IgdGhhdCBtYXBzIHRoZSBjdXJyZW50IHJlZiBnZW5vbWUgdG8gdGhlIHNwZWNpZmllZCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIGdldEJsb2NrcyAoZnJvbUdlbm9tZSwgdG9HZW5vbWUpIHtcbiAgICAgICAgbGV0IGJsa1RyYW5zID0gdGhpcy5yY0Jsb2Nrc1tmcm9tR2Vub21lLm5hbWVdW3RvR2Vub21lLm5hbWVdO1xuXHRyZXR1cm4gYmxrVHJhbnMuZ2V0QmxvY2tzKGZyb21HZW5vbWUpXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVHJhbnNsYXRlcyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSBzcGVjaWZpZWQgZnJvbUdlbm9tZSB0byB0aGUgc3BlY2lmaWVkIHRvR2Vub21lLlxuICAgIC8vIFJldHVybnMgYSBsaXN0IG9mIHplcm8gb3IgbW9yZSBjb29yZGluYXRlIHJhbmdlcyBpbiB0aGUgdG9HZW5vbWUuXG4gICAgLy9cbiAgICB0cmFuc2xhdGUgKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCwgdG9HZW5vbWUsIGludmVydGVkKSB7XG5cdC8vIGdldCB0aGUgcmlnaHQgYmxvY2sgZmlsZVxuXHRsZXQgYmxrVHJhbnMgPSB0aGlzLnJjQmxvY2tzW2Zyb21HZW5vbWUubmFtZV1bdG9HZW5vbWUubmFtZV07XG5cdGlmICghYmxrVHJhbnMpIHRocm93IFwiSW50ZXJuYWwgZXJyb3IuIE5vIGJsb2NrIGZpbGUgZm91bmQgaW4gaW5kZXguXCJcblx0Ly8gdHJhbnNsYXRlIVxuXHRsZXQgcmFuZ2VzID0gYmxrVHJhbnMudHJhbnNsYXRlKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCwgaW52ZXJ0ZWQpO1xuXHRyZXR1cm4gcmFuZ2VzO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEJUTWFuYWdlclxuXG5leHBvcnQgeyBCVE1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0JUTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTb21ldGhpbmcgdGhhdCBrbm93cyBob3cgdG8gdHJhbnNsYXRlIGNvb3JkaW5hdGVzIGJldHdlZW4gdHdvIGdlbm9tZXMuXG4vL1xuLy9cbmNsYXNzIEJsb2NrVHJhbnNsYXRvciB7XG4gICAgY29uc3RydWN0b3IodXJsLCBhR2Vub21lLCBiR2Vub21lLCBibG9ja3Mpe1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcblx0dGhpcy5hR2Vub21lID0gYUdlbm9tZTtcblx0dGhpcy5iR2Vub21lID0gYkdlbm9tZTtcblx0dGhpcy5ibG9ja3MgPSBibG9ja3MubWFwKGIgPT4gdGhpcy5wcm9jZXNzQmxvY2soYikpXG5cdHRoaXMuY3VyclNvcnQgPSBcImFcIjsgLy8gZWl0aGVyICdhJyBvciAnYidcbiAgICB9XG4gICAgcHJvY2Vzc0Jsb2NrIChibGspIHsgXG4gICAgICAgIGJsay5hSW5kZXggPSBwYXJzZUludChibGsuYUluZGV4KTtcbiAgICAgICAgYmxrLmJJbmRleCA9IHBhcnNlSW50KGJsay5iSW5kZXgpO1xuICAgICAgICBibGsuYVN0YXJ0ID0gcGFyc2VJbnQoYmxrLmFTdGFydCk7XG4gICAgICAgIGJsay5iU3RhcnQgPSBwYXJzZUludChibGsuYlN0YXJ0KTtcbiAgICAgICAgYmxrLmFFbmQgICA9IHBhcnNlSW50KGJsay5hRW5kKTtcbiAgICAgICAgYmxrLmJFbmQgICA9IHBhcnNlSW50KGJsay5iRW5kKTtcbiAgICAgICAgYmxrLmFMZW5ndGggICA9IHBhcnNlSW50KGJsay5hTGVuZ3RoKTtcbiAgICAgICAgYmxrLmJMZW5ndGggICA9IHBhcnNlSW50KGJsay5iTGVuZ3RoKTtcbiAgICAgICAgYmxrLmJsb2NrQ291bnQgICA9IHBhcnNlSW50KGJsay5ibG9ja0NvdW50KTtcbiAgICAgICAgYmxrLmJsb2NrUmF0aW8gICA9IHBhcnNlRmxvYXQoYmxrLmJsb2NrUmF0aW8pO1xuXHRibGsuYWJNYXAgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHQgICAgLmRvbWFpbihbYmxrLmFTdGFydCxibGsuYUVuZF0pXG5cdCAgICAucmFuZ2UoIGJsay5ibG9ja09yaT09PVwiLVwiID8gW2Jsay5iRW5kLGJsay5iU3RhcnRdIDogW2Jsay5iU3RhcnQsYmxrLmJFbmRdKTtcblx0YmxrLmJhTWFwID0gYmxrLmFiTWFwLmludmVydFxuXHRyZXR1cm4gYmxrO1xuICAgIH1cbiAgICBzZXRTb3J0ICh3aGljaCkge1xuXHRpZiAod2hpY2ggIT09ICdhJyAmJiB3aGljaCAhPT0gJ2InKSB0aHJvdyBcIkJhZCBhcmd1bWVudDpcIiArIHdoaWNoO1xuXHRsZXQgc29ydENvbCA9IHdoaWNoICsgXCJJbmRleFwiO1xuXHRsZXQgY21wID0gKHgseSkgPT4geFtzb3J0Q29sXSAtIHlbc29ydENvbF07XG5cdHRoaXMuYmxvY2tzLnNvcnQoY21wKTtcblx0dGhpcy5jdXJyU29ydCA9IHdoaWNoO1xuICAgIH1cbiAgICBmbGlwU29ydCAoKSB7XG5cdHRoaXMuc2V0U29ydCh0aGlzLmN1cnJTb3J0ID09PSBcImFcIiA/IFwiYlwiIDogXCJhXCIpO1xuICAgIH1cbiAgICAvLyBHaXZlbiBhIGdlbm9tZSAoZWl0aGVyIHRoZSBhIG9yIGIgZ2Vub21lKSBhbmQgYSBjb29yZGluYXRlIHJhbmdlLFxuICAgIC8vIHJldHVybnMgdGhlIGVxdWl2YWxlbnQgY29vcmRpbmF0ZSByYW5nZShzKSBpbiB0aGUgb3RoZXIgZ2Vub21lXG4gICAgdHJhbnNsYXRlIChmcm9tR2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQsIGludmVydCkge1xuXHQvL1xuXHRlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHN0YXJ0IDogZW5kO1xuXHQvLyBmcm9tID0gXCJhXCIgb3IgXCJiXCIsIGRlcGVuZGluZyBvbiB3aGljaCBnZW5vbWUgaXMgZ2l2ZW4uXG4gICAgICAgIGxldCBmcm9tID0gKGZyb21HZW5vbWUgPT09IHRoaXMuYUdlbm9tZSA/IFwiYVwiIDogZnJvbUdlbm9tZSA9PT0gdGhpcy5iR2Vub21lID8gXCJiXCIgOiBudWxsKTtcblx0aWYgKCFmcm9tKSB0aHJvdyBcIkJhZCBhcmd1bWVudC4gR2Vub21lIG5laXRoZXIgQSBub3IgQi5cIjtcblx0Ly8gdG8gPSBcImJcIiBvciBcImFcIiwgb3Bwb3NpdGUgb2YgZnJvbVxuXHRsZXQgdG8gPSAoZnJvbSA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcblx0Ly8gbWFrZSBzdXJlIHRoZSBibG9ja3MgYXJlIHNvcnRlZCBieSB0aGUgZnJvbSBnZW5vbWVcblx0dGhpcy5zZXRTb3J0KGZyb20pO1xuXHQvL1xuXHRsZXQgZnJvbUMgPSBmcm9tK1wiQ2hyXCI7XG5cdGxldCBmcm9tUyA9IGZyb20rXCJTdGFydFwiO1xuXHRsZXQgZnJvbUUgPSBmcm9tK1wiRW5kXCI7XG5cdGxldCBmcm9tSSA9IGZyb20rXCJJbmRleFwiO1xuXHRsZXQgdG9DID0gdG8rXCJDaHJcIjtcblx0bGV0IHRvUyA9IHRvK1wiU3RhcnRcIjtcblx0bGV0IHRvRSA9IHRvK1wiRW5kXCI7XG5cdGxldCB0b0kgPSB0bytcIkluZGV4XCI7XG5cdGxldCBtYXBwZXIgPSBmcm9tK3RvK1wiTWFwXCI7XG5cdC8vIFxuXHRsZXQgYmxrcyA9IHRoaXMuYmxvY2tzXG5cdCAgICAvLyBGaXJzdCBmaWx0ZXIgZm9yIGJsb2NrcyB0aGF0IG92ZXJsYXAgdGhlIGdpdmVuIGNvb3JkaW5hdGUgcmFuZ2UgaW4gdGhlIGZyb20gZ2Vub21lXG5cdCAgICAuZmlsdGVyKGJsayA9PiBibGtbZnJvbUNdID09PSBjaHIgJiYgYmxrW2Zyb21TXSA8PSBlbmQgJiYgYmxrW2Zyb21FXSA+PSBzdGFydClcblx0ICAgIC8vIG1hcCBlYWNoIGJsb2NrLiBcblx0ICAgIC5tYXAoYmxrID0+IHtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgZnJvbSBzaWRlLlxuXHRcdGxldCBzID0gTWF0aC5tYXgoc3RhcnQsIGJsa1tmcm9tU10pO1xuXHRcdGxldCBlID0gTWF0aC5taW4oZW5kLCBibGtbZnJvbUVdKTtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgdG8gc2lkZS5cblx0XHRsZXQgczIgPSBNYXRoLmNlaWwoYmxrW21hcHBlcl0ocykpO1xuXHRcdGxldCBlMiA9IE1hdGguZmxvb3IoYmxrW21hcHBlcl0oZSkpO1xuXHQgICAgICAgIHJldHVybiBpbnZlcnQgPyB7XG5cdFx0ICAgIGNocjogICBibGtbZnJvbUNdLFxuXHRcdCAgICBzdGFydDogcyxcblx0XHQgICAgZW5kOiAgIGUsXG5cdFx0ICAgIG9yaTogICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGluZGV4OiBibGtbZnJvbUldLFxuXHRcdCAgICAvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZHMgZm9yIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0ICAgIGZDaHI6ICAgYmxrW3RvQ10sXG5cdFx0ICAgIGZTdGFydDogTWF0aC5taW4oczIsZTIpLFxuXHRcdCAgICBmRW5kOiAgIE1hdGgubWF4KHMyLGUyKSxcblx0XHQgICAgZkluZGV4OiBibGtbdG9JXSxcblx0XHQgICAgLy8gaW5jbHVkZSB0aGUgYmxvY2sgaWQgYW5kIGZ1bGwgYmxvY2sgY29vcmRzXG5cdFx0ICAgIGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdCAgICBibG9ja1N0YXJ0OiBibGtbZnJvbVNdLFxuXHRcdCAgICBibG9ja0VuZDogYmxrW2Zyb21FXVxuXHRcdH0gOiB7XG5cdFx0ICAgIGNocjogICBibGtbdG9DXSxcblx0XHQgICAgc3RhcnQ6IE1hdGgubWluKHMyLGUyKSxcblx0XHQgICAgZW5kOiAgIE1hdGgubWF4KHMyLGUyKSxcblx0XHQgICAgb3JpOiAgIGJsay5ibG9ja09yaSxcblx0XHQgICAgaW5kZXg6IGJsa1t0b0ldLFxuXHRcdCAgICAvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZHMgZm9yIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0ICAgIGZDaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgZlN0YXJ0OiBzLFxuXHRcdCAgICBmRW5kOiAgIGUsXG5cdFx0ICAgIGZJbmRleDogYmxrW2Zyb21JXSxcblx0XHQgICAgLy8gaW5jbHVkZSB0aGUgYmxvY2sgaWQgYW5kIGZ1bGwgYmxvY2sgY29vcmRzXG5cdFx0ICAgIGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdCAgICBibG9ja1N0YXJ0OiBibGtbdG9TXSxcblx0XHQgICAgYmxvY2tFbmQ6IGJsa1t0b0VdXG5cdFx0fTtcblx0ICAgIH0pO1xuXHRpZiAoIWludmVydCkge1xuXHQgICAgLy8gTG9vayBmb3IgMS1ibG9jayBnYXBzIGFuZCBmaWxsIHRoZW0gaW4uIFxuXHQgICAgYmxrcy5zb3J0KChhLGIpID0+IGEuaW5kZXggLSBiLmluZGV4KTtcblx0ICAgIGxldCBuYnMgPSBbXTtcblx0ICAgIGJsa3MuZm9yRWFjaCggKGIsIGkpID0+IHtcblx0XHRpZiAoaSA9PT0gMCkgcmV0dXJuO1xuXHRcdGlmIChibGtzW2ldLmluZGV4IC0gYmxrc1tpIC0gMV0uaW5kZXggPT09IDIpIHtcblx0XHQgICAgbGV0IGJsayA9IHRoaXMuYmxvY2tzLmZpbHRlciggYiA9PiBiW3RvSV0gPT09IGJsa3NbaV0uaW5kZXggLSAxIClbMF07XG5cdFx0ICAgIG5icy5wdXNoKHtcblx0XHRcdGNocjogICBibGtbdG9DXSxcblx0XHRcdHN0YXJ0OiBibGtbdG9TXSxcblx0XHRcdGVuZDogICBibGtbdG9FXSxcblx0XHRcdG9yaTogICBibGsuYmxvY2tPcmksXG5cdFx0XHRpbmRleDogYmxrW3RvSV0sXG5cdFx0XHQvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZHMgZm9yIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0XHRmQ2hyOiAgIGJsa1tmcm9tQ10sXG5cdFx0XHRmU3RhcnQ6IGJsa1tmcm9tU10sXG5cdFx0XHRmRW5kOiAgIGJsa1tmcm9tRV0sXG5cdFx0XHRmSW5kZXg6IGJsa1tmcm9tSV0sXG5cdFx0XHQvLyBpbmNsdWRlIHRoZSBibG9jayBpZCBhbmQgZnVsbCBibG9jayBjb29yZHNcblx0XHRcdGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdFx0YmxvY2tTdGFydDogYmxrW3RvU10sXG5cdFx0XHRibG9ja0VuZDogYmxrW3RvRV1cblx0XHQgICAgfSk7XG5cdFx0ICAgIGNvbnNvbGUubG9nKFwiRm91bmQgMS1ibG9jayBnYXAuIEFkZGVkOlwiLCBuYnNbbmJzLmxlbmd0aCAtIDFdKTtcblx0XHR9XG5cdCAgICB9KTtcblx0ICAgIGJsa3MgPSBibGtzLmNvbmNhdChuYnMpO1xuXHR9XG5cdGJsa3Muc29ydCgoYSxiKSA9PiBhLmZJbmRleCAtIGIuZkluZGV4KTtcblx0cmV0dXJuIGJsa3M7XG4gICAgfVxuICAgIC8vIEdpdmVuIGEgZ2Vub21lIChlaXRoZXIgdGhlIGEgb3IgYiBnZW5vbWUpXG4gICAgLy8gcmV0dXJucyB0aGUgYmxvY2tzIGZvciB0cmFuc2xhdGluZyB0byB0aGUgb3RoZXIgKGIgb3IgYSkgZ2Vub21lLlxuICAgIC8vXG4gICAgZ2V0QmxvY2tzIChmcm9tR2Vub21lKSB7XG5cdC8vIGZyb20gPSBcImFcIiBvciBcImJcIiwgZGVwZW5kaW5nIG9uIHdoaWNoIGdlbm9tZSBpcyBnaXZlbi5cbiAgICAgICAgbGV0IGZyb20gPSAoZnJvbUdlbm9tZSA9PT0gdGhpcy5hR2Vub21lID8gXCJhXCIgOiBmcm9tR2Vub21lID09PSB0aGlzLmJHZW5vbWUgPyBcImJcIiA6IG51bGwpO1xuXHRpZiAoIWZyb20pIHRocm93IFwiQmFkIGFyZ3VtZW50LiBHZW5vbWUgbmVpdGhlciBBIG5vciBCLlwiO1xuXHQvLyB0byA9IFwiYlwiIG9yIFwiYVwiLCBvcHBvc2l0ZSBvZiBmcm9tXG5cdGxldCB0byA9IChmcm9tID09PSBcImFcIiA/IFwiYlwiIDogXCJhXCIpO1xuXHQvLyBtYWtlIHN1cmUgdGhlIGJsb2NrcyBhcmUgc29ydGVkIGJ5IHRoZSBmcm9tIGdlbm9tZVxuXHR0aGlzLnNldFNvcnQoZnJvbSk7XG5cdC8vXG5cdGxldCBmcm9tQyA9IGZyb20rXCJDaHJcIjtcblx0bGV0IGZyb21TID0gZnJvbStcIlN0YXJ0XCI7XG5cdGxldCBmcm9tRSA9IGZyb20rXCJFbmRcIjtcblx0bGV0IGZyb21JID0gZnJvbStcIkluZGV4XCI7XG5cdGxldCB0b0MgPSB0bytcIkNoclwiO1xuXHRsZXQgdG9TID0gdG8rXCJTdGFydFwiO1xuXHRsZXQgdG9FID0gdG8rXCJFbmRcIjtcblx0bGV0IHRvSSA9IHRvK1wiSW5kZXhcIjtcblx0bGV0IG1hcHBlciA9IGZyb20rdG8rXCJNYXBcIjtcblx0Ly8gXG5cdGxldCBibGtzID0gdGhpcy5ibG9ja3Ncblx0ICAgIC5tYXAoYmxrID0+IHtcblx0ICAgICAgICByZXR1cm4ge1xuXHRcdCAgICBibG9ja0lkOiAgIGJsay5ibG9ja0lkLFxuXHRcdCAgICBvcmk6ICAgICAgIGJsay5ibG9ja09yaSxcblx0XHQgICAgZnJvbUNocjogICBibGtbZnJvbUNdLFxuXHRcdCAgICBmcm9tU3RhcnQ6IGJsa1tmcm9tU10sXG5cdFx0ICAgIGZyb21FbmQ6ICAgYmxrW2Zyb21FXSxcblx0XHQgICAgZnJvbUluZGV4OiBibGtbZnJvbUldLFxuXHRcdCAgICB0b0NocjogICAgIGJsa1t0b0NdLFxuXHRcdCAgICB0b1N0YXJ0OiAgIGJsa1t0b1NdLFxuXHRcdCAgICB0b0VuZDogICAgIGJsa1t0b0VdLFxuXHRcdCAgICB0b0luZGV4OiAgIGJsa1t0b0ldXG5cdFx0fTtcblx0ICAgIH0pXG5cdC8vIFxuXHRyZXR1cm4gYmxrcztcbiAgICB9XG59XG5cbmV4cG9ydCB7IEJsb2NrVHJhbnNsYXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQmxvY2tUcmFuc2xhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTVkdWaWV3IH0gZnJvbSAnLi9TVkdWaWV3JztcbmltcG9ydCB7IGNvb3Jkc0FmdGVyVHJhbnNmb3JtIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgR2Vub21lVmlldyBleHRlbmRzIFNWR1ZpZXcge1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCk7XG5cdHRoaXMub3BlbldpZHRoID0gdGhpcy5vdXRlcldpZHRoO1xuXHR0aGlzLm9wZW5IZWlnaHQ9IHRoaXMub3V0ZXJIZWlnaHQ7XG5cdHRoaXMudG90YWxDaHJXaWR0aCA9IDQwOyAvLyB0b3RhbCB3aWR0aCBvZiBvbmUgY2hyb21vc29tZSAoYmFja2JvbmUrYmxvY2tzK2ZlYXRzKVxuXHR0aGlzLmN3aWR0aCA9IDIwOyAgICAgICAgLy8gY2hyb21vc29tZSB3aWR0aFxuXHR0aGlzLnRpY2tMZW5ndGggPSAxMDtcdCAvLyBmZWF0dXJlIHRpY2sgbWFyayBsZW5ndGhcblx0dGhpcy5icnVzaENociA9IG51bGw7XHQgLy8gd2hpY2ggY2hyIGhhcyB0aGUgY3VycmVudCBicnVzaFxuXHR0aGlzLmJ3aWR0aCA9IHRoaXMuY3dpZHRoLzI7ICAvLyBibG9jayB3aWR0aFxuXHR0aGlzLmN1cnJCbG9ja3MgPSBudWxsO1xuXHR0aGlzLmN1cnJUaWNrcyA9IG51bGw7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzID0gdGhpcy5zdmdNYWluLmFwcGVuZCgnZycpLmF0dHIoXCJuYW1lXCIsIFwiY2hyb21vc29tZXNcIik7XG5cdHRoaXMudGl0bGUgICAgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCd0ZXh0JykuYXR0cihcImNsYXNzXCIsIFwidGl0bGVcIik7XG5cdHRoaXMuc2Nyb2xsQW1vdW50ID0gMDtcblx0Ly9cblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZpdFRvV2lkdGggKHcpe1xuICAgICAgICBzdXBlci5maXRUb1dpZHRoKHcpO1xuXHR0aGlzLm9wZW5XaWR0aCA9IHRoaXMub3V0ZXJXaWR0aDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdERvbSAoKSB7XG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b24uY2xvc2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHRoaXMucmVkcmF3KCkpO1xuXHR0aGlzLnN2Zy5vbihcIndoZWVsXCIsICgpID0+IHtcblx0ICAgIGlmICghdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIikpIHJldHVybjtcblx0ICAgIHRoaXMuc2Nyb2xsV2hlZWwoZDMuZXZlbnQuZGVsdGFZKVxuXHQgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fSk7XG5cdGxldCBzYnMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInN2Z2NvbnRhaW5lclwiXSA+IFtuYW1lPVwic2Nyb2xsYnV0dG9uc1wiXScpXG5cdHNicy5zZWxlY3QoJy5idXR0b25bbmFtZT1cInVwXCJdJykub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNjcm9sbENocm9tb3NvbWVzVXAoKSk7XG5cdHNicy5zZWxlY3QoJy5idXR0b25bbmFtZT1cImRuXCJdJykub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNjcm9sbENocm9tb3NvbWVzRG93bigpKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRCcnVzaENvb3JkcyAoY29vcmRzKSB7XG5cdHRoaXMuY2xlYXJCcnVzaGVzKCk7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdChgLmNocm9tb3NvbWVbbmFtZT1cIiR7Y29vcmRzLmNocn1cIl0gZ1tuYW1lPVwiYnJ1c2hcIl1gKVxuXHQgIC5lYWNoKGZ1bmN0aW9uKGNocil7XG5cdCAgICBjaHIuYnJ1c2guZXh0ZW50KFtjb29yZHMuc3RhcnQsY29vcmRzLmVuZF0pO1xuXHQgICAgY2hyLmJydXNoKGQzLnNlbGVjdCh0aGlzKSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBicnVzaHN0YXJ0IChjaHIpe1xuXHR0aGlzLmNsZWFyQnJ1c2hlcyhjaHIuYnJ1c2gpO1xuXHR0aGlzLmJydXNoQ2hyID0gY2hyO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJydXNoZW5kICgpe1xuXHRpZighdGhpcy5icnVzaENocikgcmV0dXJuO1xuXHRsZXQgY2MgPSB0aGlzLmFwcC5jb29yZHM7XG5cdHZhciB4dG50ID0gdGhpcy5icnVzaENoci5icnVzaC5leHRlbnQoKTtcblx0aWYgKE1hdGguYWJzKHh0bnRbMF0gLSB4dG50WzFdKSA8PSAxMCl7XG5cdCAgICAvLyB1c2VyIGNsaWNrZWRcblx0ICAgIGxldCB3ID0gY2MuZW5kIC0gY2Muc3RhcnQgKyAxO1xuXHQgICAgeHRudFswXSAtPSB3LzI7XG5cdCAgICB4dG50WzFdICs9IHcvMjtcblx0fVxuXHRsZXQgY29vcmRzID0geyBjaHI6dGhpcy5icnVzaENoci5uYW1lLCBzdGFydDpNYXRoLmZsb29yKHh0bnRbMF0pLCBlbmQ6IE1hdGguZmxvb3IoeHRudFsxXSkgfTtcblx0dGhpcy5hcHAuc2V0Q29udGV4dChjb29yZHMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQnJ1c2hlcyAoZXhjZXB0KXtcblx0dGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKCdbbmFtZT1cImJydXNoXCJdJykuZWFjaChmdW5jdGlvbihjaHIpe1xuXHQgICAgaWYgKGNoci5icnVzaCAhPT0gZXhjZXB0KSB7XG5cdFx0Y2hyLmJydXNoLmNsZWFyKCk7XG5cdFx0Y2hyLmJydXNoKGQzLnNlbGVjdCh0aGlzKSk7XG5cdCAgICB9XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldFggKGNocikge1xuXHRsZXQgeCA9IHRoaXMuYXBwLnJHZW5vbWUueHNjYWxlKGNocik7XG5cdGlmIChpc05hTih4KSkgdGhyb3cgXCJ4IGlzIE5hTlwiXG5cdHJldHVybiB4O1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRZIChwb3MpIHtcblx0bGV0IHkgPSB0aGlzLmFwcC5yR2Vub21lLnlzY2FsZShwb3MpO1xuXHRpZiAoaXNOYU4oeSkpIHRocm93IFwieSBpcyBOYU5cIlxuXHRyZXR1cm4geTtcbiAgICB9XG4gICAgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVkcmF3ICgpIHtcbiAgICAgICAgdGhpcy5kcmF3KHRoaXMuY3VyclRpY2tzLCB0aGlzLmN1cnJCbG9ja3MpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRyYXcgKHRpY2tEYXRhLCBibG9ja0RhdGEpIHtcblx0dGhpcy5kcmF3Q2hyb21vc29tZXMoKTtcblx0dGhpcy5kcmF3QmxvY2tzKGJsb2NrRGF0YSk7XG5cdHRoaXMuZHJhd1RpY2tzKHRpY2tEYXRhKTtcblx0dGhpcy5kcmF3VGl0bGUoKTtcblx0dGhpcy5zZXRCcnVzaENvb3Jkcyh0aGlzLmFwcC5jb29yZHMpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSBjaHJvbW9zb21lcyBvZiB0aGUgcmVmZXJlbmNlIGdlbm9tZS5cbiAgICAvLyBJbmNsdWRlcyBiYWNrYm9uZXMsIGxhYmVscywgYW5kIGJydXNoZXMuXG4gICAgLy8gVGhlIGJhY2tib25lcyBhcmUgZHJhd24gYXMgdmVydGljYWwgbGluZSBzZW1lbnRzLFxuICAgIC8vIGRpc3RyaWJ1dGVkIGhvcml6b250YWxseS4gT3JkZXJpbmcgaXMgZGVmaW5lZCBieVxuICAgIC8vIHRoZSBtb2RlbCAoR2Vub21lIG9iamVjdCkuXG4gICAgLy8gTGFiZWxzIGFyZSBkcmF3biBhYm92ZSB0aGUgYmFja2JvbmVzLlxuICAgIC8vXG4gICAgLy8gTW9kaWZpY2F0aW9uOlxuICAgIC8vIERyYXdzIHRoZSBzY2VuZSBpbiBvbmUgb2YgdHdvIHN0YXRlczogb3BlbiBvciBjbG9zZWQuXG4gICAgLy8gVGhlIG9wZW4gc3RhdGUgaXMgYXMgZGVzY3JpYmVkIC0gYWxsIGNocm9tb3NvbWVzIHNob3duLlxuICAgIC8vIEluIHRoZSBjbG9zZWQgc3RhdGU6IFxuICAgIC8vICAgICAqIG9ubHkgb25lIGNocm9tb3NvbWUgc2hvd3MgKHRoZSBjdXJyZW50IG9uZSlcbiAgICAvLyAgICAgKiBkcmF3biBob3Jpem9udGFsbHkgYW5kIHBvc2l0aW9uZWQgYmVzaWRlIHRoZSBcIkdlbm9tZSBWaWV3XCIgdGl0bGVcbiAgICAvL1xuICAgIGRyYXdDaHJvbW9zb21lcyAoKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblxuXHRsZXQgcmcgPSB0aGlzLmFwcC5yR2Vub21lOyAvLyByZWYgZ2Vub21lXG5cdGxldCByQ2hycyA9IHJnLmNocm9tb3NvbWVzO1xuXG4gICAgICAgIC8vIENocm9tb3NvbWUgZ3JvdXBzXG5cdGxldCBjaHJzID0gdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKFwiLmNocm9tb3NvbWVcIilcblx0ICAgIC5kYXRhKHJDaHJzLCBjID0+IGMubmFtZSk7XG5cdGxldCBuZXdjaHJzID0gY2hycy5lbnRlcigpLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjaHJvbW9zb21lXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgYyA9PiBjLm5hbWUpO1xuXHRcblx0bmV3Y2hycy5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJuYW1lXCIsXCJsYWJlbFwiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJsaW5lXCIpLmF0dHIoXCJuYW1lXCIsXCJiYWNrYm9uZVwiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJzeW5CbG9ja3NcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwidGlja3NcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwiYnJ1c2hcIik7XG5cblxuXHRsZXQgY2xvc2VkID0gdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIik7XG5cdGlmIChjbG9zZWQpIHtcblx0ICAgIC8vIFJlc2V0IHRoZSBTVkcgc2l6ZSB0byBiZSAxLWNocm9tb3NvbWUgd2lkZS5cblx0ICAgIC8vIFRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAgc28gdGhhdCB0aGUgY3VycmVudCBjaHJvbW9zb21lIGFwcGVhcnMgaW4gdGhlIHN2ZyBhcmVhLlxuXHQgICAgLy8gVHVybiBpdCA5MCBkZWcuXG5cblx0ICAgIC8vIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBTVkcgYXJlYSB0byAxIGNocm9tb3NvbWUncyB3aWR0aFxuXHQgICAgdGhpcy5zZXRHZW9tKHsgaGVpZ2h0OiB0aGlzLnRvdGFsQ2hyV2lkdGgsIHJvdGF0aW9uOiAtOTAsIHRyYW5zbGF0aW9uOiBbLXRoaXMudG90YWxDaHJXaWR0aC8yLDMwXSB9KTtcblx0ICAgIC8vIFxuXHQgICAgbGV0IGRlbHRhID0gMTA7XG5cdCAgICByZy54c2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcblx0XHQgLmRvbWFpbihyQ2hycy5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHgubmFtZTt9KSlcblx0XHQgLy8gaW4gY2xvc2VkIG1vZGUsIHRoZSBjaHJvbW9zb21lcyBoYXZlIGZpeGVkIHNwYWNpbmdcblx0XHQgLnJhbmdlUG9pbnRzKFtkZWx0YSwgZGVsdGErdGhpcy50b3RhbENocldpZHRoKihyQ2hycy5sZW5ndGgtMSldKTtcblx0ICAgIC8vXG5cdCAgICByZy55c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdCAuZG9tYWluKFsxLHJnLm1heGxlbl0pXG5cdFx0IC5yYW5nZShbMCwgdGhpcy53aWR0aF0pO1xuXG5cdCAgICAvLyB0cmFuc2xhdGUgZWFjaCBjaHJvbW9zb21lIGludG8gcG9zaXRpb25cblx0ICAgIGNocnMuYXR0cihcInRyYW5zZm9ybVwiLCBjID0+IGB0cmFuc2xhdGUoJHtyZy54c2NhbGUoYy5uYW1lKX0sIDApYCk7XG4gICAgICAgICAgICAvLyB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKC1yZy54c2NhbGUodGhpcy5hcHAuY29vcmRzLmNocikpO1xuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIC8vIFdoZW4gb3BlbiwgZHJhdyBhbGwgdGhlIGNocm9tb3NvbWVzLiBFYWNoIGNocm9tIGlzIGEgdmVydGljYWwgbGluZS5cblx0ICAgIC8vIENocm9tcyBhcmUgZGlzdHJpYnV0ZWQgZXZlbmx5IGFjcm9zcyB0aGUgYXZhaWxhYmxlIGhvcml6b250YWwgc3BhY2UuXG5cdCAgICB0aGlzLnNldEdlb20oeyB3aWR0aDogdGhpcy5vcGVuV2lkdGgsIGhlaWdodDogdGhpcy5vcGVuSGVpZ2h0LCByb3RhdGlvbjogMCwgdHJhbnNsYXRpb246IFswLDBdIH0pO1xuXHQgICAgLy8gXG5cdCAgICByZy54c2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcblx0XHQgLmRvbWFpbihyQ2hycy5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHgubmFtZTt9KSlcblx0XHQgLy8gaW4gY2xvc2VkIG1vZGUsIHRoZSBjaHJvbW9zb21lcyBzcHJlYWQgdG8gZmlsbCB0aGUgc3BhY2Vcblx0XHQgLnJhbmdlUG9pbnRzKFswLCB0aGlzLm9wZW5XaWR0aCAtIDMwXSwgMC41KTtcblx0ICAgIHJnLnlzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0IC5kb21haW4oWzEscmcubWF4bGVuXSlcblx0XHQgLnJhbmdlKFswLCB0aGlzLmhlaWdodF0pO1xuXG5cdCAgICAvLyB0cmFuc2xhdGUgZWFjaCBjaHJvbW9zb21lIGludG8gcG9zaXRpb25cblx0ICAgIGNocnMuYXR0cihcInRyYW5zZm9ybVwiLCBjID0+IGB0cmFuc2xhdGUoJHtyZy54c2NhbGUoYy5uYW1lKX0sIDApYCk7XG4gICAgICAgICAgICAvLyB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKDApO1xuXHR9XG5cblx0ckNocnMuZm9yRWFjaChjaHIgPT4ge1xuXHQgICAgdmFyIHNjID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQuZG9tYWluKFsxLGNoci5sZW5ndGhdKVxuXHRcdC5yYW5nZShbMCwgcmcueXNjYWxlKGNoci5sZW5ndGgpXSk7XG5cdCAgICBjaHIuYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKS55KHNjKVxuXHQgICAgICAgLm9uKFwiYnJ1c2hzdGFydFwiLCBjaHIgPT4gdGhpcy5icnVzaHN0YXJ0KGNocikpXG5cdCAgICAgICAub24oXCJicnVzaGVuZFwiLCAoKSA9PiB0aGlzLmJydXNoZW5kKCkpO1xuXHQgIH0sIHRoaXMpO1xuXG5cbiAgICAgICAgY2hycy5zZWxlY3QoJ1tuYW1lPVwibGFiZWxcIl0nKVxuXHQgICAgLnRleHQoYz0+Yy5uYW1lKVxuXHQgICAgLmF0dHIoXCJ4XCIsIDApIFxuXHQgICAgLmF0dHIoXCJ5XCIsIC0yKVxuXHQgICAgO1xuXG5cdGNocnMuc2VsZWN0KCdbbmFtZT1cImJhY2tib25lXCJdJylcblx0ICAgIC5hdHRyKFwieDFcIiwgMClcblx0ICAgIC5hdHRyKFwieTFcIiwgMClcblx0ICAgIC5hdHRyKFwieDJcIiwgMClcblx0ICAgIC5hdHRyKFwieTJcIiwgYyA9PiByZy55c2NhbGUoYy5sZW5ndGgpKVxuXHQgICAgO1xuXHQgICBcblx0Y2hycy5zZWxlY3QoJ1tuYW1lPVwiYnJ1c2hcIl0nKVxuXHQgICAgLmVhY2goZnVuY3Rpb24oZCl7ZDMuc2VsZWN0KHRoaXMpLmNhbGwoZC5icnVzaCk7fSlcblx0ICAgIC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHQgICAgIC5hdHRyKCd3aWR0aCcsMTYpXG5cdCAgICAgLmF0dHIoJ3gnLCAtOClcblx0ICAgIDtcblxuXHRjaHJzLmV4aXQoKS5yZW1vdmUoKTtcblx0XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2Nyb2xsIHdoZWVsIGV2ZW50IGhhbmRsZXIuXG4gICAgc2Nyb2xsV2hlZWwgKGR5KSB7XG5cdC8vIEFkZCBkeSB0byB0b3RhbCBzY3JvbGwgYW1vdW50LiBUaGVuIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNCeShkeSk7XG5cdC8vIEFmdGVyIGEgMjAwIG1zIHBhdXNlIGluIHNjcm9sbGluZywgc25hcCB0byBuZWFyZXN0IGNocm9tb3NvbWVcblx0dGhpcy50b3V0ICYmIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50b3V0KTtcblx0dGhpcy50b3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCk9PnRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCksIDIwMCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzVG8gKHgpIHtcbiAgICAgICAgaWYgKHggPT09IHVuZGVmaW5lZCkgeCA9IHRoaXMuc2Nyb2xsQW1vdW50O1xuXHR0aGlzLnNjcm9sbEFtb3VudCA9IE1hdGgubWF4KE1hdGgubWluKHgsMTUpLCAtdGhpcy50b3RhbENocldpZHRoICogKHRoaXMuYXBwLnJHZW5vbWUuY2hyb21vc29tZXMubGVuZ3RoLTEpKTtcblx0dGhpcy5nQ2hyb21vc29tZXMuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7dGhpcy5zY3JvbGxBbW91bnR9LDApYCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzQnkgKGR4KSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbyh0aGlzLnNjcm9sbEFtb3VudCArIGR4KTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNTbmFwICgpIHtcblx0bGV0IGkgPSBNYXRoLnJvdW5kKHRoaXMuc2Nyb2xsQW1vdW50IC8gdGhpcy50b3RhbENocldpZHRoKVxuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oaSp0aGlzLnRvdGFsQ2hyV2lkdGgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc1VwICgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc0J5KC10aGlzLnRvdGFsQ2hyV2lkdGgpO1xuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc0Rvd24gKCkge1xuICAgICAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzQnkodGhpcy50b3RhbENocldpZHRoKTtcblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZHJhd1RpdGxlICgpIHtcblx0bGV0IHJlZmcgPSB0aGlzLmFwcC5yR2Vub21lLmxhYmVsO1xuXHRsZXQgYmxvY2tnID0gdGhpcy5jdXJyQmxvY2tzID8gXG5cdCAgICB0aGlzLmN1cnJCbG9ja3MuY29tcCAhPT0gdGhpcy5hcHAuckdlbm9tZSA/XG5cdCAgICAgICAgdGhpcy5jdXJyQmxvY2tzLmNvbXAubGFiZWxcblx0XHQ6XG5cdFx0bnVsbFxuXHQgICAgOlxuXHQgICAgbnVsbDtcblx0bGV0IGxzdCA9IHRoaXMuYXBwLmN1cnJMaXN0ID8gdGhpcy5hcHAuY3Vyckxpc3QubmFtZSA6IG51bGw7XG5cblx0dGhpcy5yb290LnNlbGVjdChcImxhYmVsIHNwYW4udGl0bGVcIikudGV4dChyZWZnKTtcblxuXHRsZXQgbGluZXMgPSBbXTtcblx0YmxvY2tnICYmIGxpbmVzLnB1c2goYEJsb2NrcyB2cy4gJHtibG9ja2d9YCk7XG5cdGxzdCAmJiBsaW5lcy5wdXNoKGBGZWF0dXJlcyBmcm9tIGxpc3QgXCIke2xzdH1cImApO1xuXHRsZXQgc3VidCA9IGxpbmVzLmpvaW4oXCIgOjogXCIpO1xuXHR0aGlzLnJvb3Quc2VsZWN0KFwibGFiZWwgc3Bhbi5zdWJ0aXRsZVwiKS50ZXh0KChzdWJ0ID8gXCI6OiBcIiA6IFwiXCIpICsgc3VidCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIG91dGxpbmVzIG9mIHN5bnRlbnkgYmxvY2tzIG9mIHRoZSByZWYgZ2Vub21lIHZzLlxuICAgIC8vIHRoZSBnaXZlbiBnZW5vbWUuXG4gICAgLy8gUGFzc2luZyBudWxsIGVyYXNlcyBhbGwgc3ludGVueSBibG9ja3MuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBkYXRhID09IHsgcmVmOkdlbm9tZSwgY29tcDpHZW5vbWUsIGJsb2NrczogbGlzdCBvZiBzeW50ZW55IGJsb2NrcyB9XG4gICAgLy8gICAgRWFjaCBzYmxvY2sgPT09IHsgYmxvY2tJZDppbnQsIG9yaTorLy0sIGZyb21DaHIsIGZyb21TdGFydCwgZnJvbUVuZCwgdG9DaHIsIHRvU3RhcnQsIHRvRW5kIH1cbiAgICBkcmF3QmxvY2tzIChkYXRhKSB7XG5cdC8vXG4gICAgICAgIGxldCBzYmdycHMgPSB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoXCIuY2hyb21vc29tZVwiKS5zZWxlY3QoJ1tuYW1lPVwic3luQmxvY2tzXCJdJyk7XG5cdGlmICghZGF0YSB8fCAhZGF0YS5ibG9ja3MgfHwgZGF0YS5ibG9ja3MubGVuZ3RoID09PSAwKSB7XG5cdCAgICB0aGlzLmN1cnJCbG9ja3MgPSBudWxsO1xuXHQgICAgc2JncnBzLmh0bWwoJycpO1xuXHQgICAgdGhpcy5kcmF3VGl0bGUoKTtcblx0ICAgIHJldHVybjtcblx0fVxuXHR0aGlzLmN1cnJCbG9ja3MgPSBkYXRhO1xuXHQvLyByZW9yZ2FuaXplIGRhdGEgdG8gcmVmbGVjdCBTVkcgc3RydWN0dXJlIHdlIHdhbnQsIGllLCBncm91cGVkIGJ5IGNocm9tb3NvbWVcbiAgICAgICAgbGV0IGR4ID0gZGF0YS5ibG9ja3MucmVkdWNlKChhLHNiKSA9PiB7XG5cdFx0aWYgKCFhW3NiLmZyb21DaHJdKSBhW3NiLmZyb21DaHJdID0gW107XG5cdFx0YVtzYi5mcm9tQ2hyXS5wdXNoKHNiKTtcblx0XHRyZXR1cm4gYTtcblx0ICAgIH0sIHt9KTtcblx0c2JncnBzLmVhY2goZnVuY3Rpb24oYyl7XG5cdCAgICBkMy5zZWxlY3QodGhpcykuZGF0dW0oe2NocjogYy5uYW1lLCBibG9ja3M6IGR4W2MubmFtZV0gfHwgW10gfSk7XG5cdH0pO1xuXG5cdGxldCBid2lkdGggPSAxMDtcbiAgICAgICAgbGV0IHNibG9ja3MgPSBzYmdycHMuc2VsZWN0QWxsKCdyZWN0LnNibG9jaycpLmRhdGEoYj0+Yi5ibG9ja3MpO1xuICAgICAgICBsZXQgbmV3YnMgPSBzYmxvY2tzLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuYXR0cignY2xhc3MnLCdzYmxvY2snKTtcblx0c2Jsb2Nrc1xuXHQgICAgLmF0dHIoXCJ4XCIsIC1id2lkdGgvMiApXG5cdCAgICAuYXR0cihcInlcIiwgYiA9PiB0aGlzLmdldFkoYi5mcm9tU3RhcnQpKVxuXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCBid2lkdGgpXG5cdCAgICAuYXR0cihcImhlaWdodFwiLCBiID0+IE1hdGgubWF4KDAsdGhpcy5nZXRZKGIuZnJvbUVuZCAtIGIuZnJvbVN0YXJ0ICsgMSkpKVxuXHQgICAgLmNsYXNzZWQoXCJpbnZlcnNpb25cIiwgYiA9PiBiLm9yaSA9PT0gXCItXCIpXG5cdCAgICAuY2xhc3NlZChcInRyYW5zbG9jYXRpb25cIiwgYiA9PiBiLmZyb21DaHIgIT09IGIudG9DaHIpXG5cdCAgICA7XG5cbiAgICAgICAgc2Jsb2Nrcy5leGl0KCkucmVtb3ZlKCk7XG5cblx0dGhpcy5kcmF3VGl0bGUoKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3VGlja3MgKGlkcykge1xuXHR0aGlzLmN1cnJUaWNrcyA9IGlkcyB8fCBbXTtcblx0dGhpcy5hcHAuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXNCeUlkKHRoaXMuYXBwLnJHZW5vbWUsIHRoaXMuY3VyclRpY2tzKVxuXHQgICAgLnRoZW4oIGZlYXRzID0+IHsgdGhpcy5fZHJhd1RpY2tzKGZlYXRzKTsgfSk7XG4gICAgfVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIF9kcmF3VGlja3MgKGZlYXR1cmVzKSB7XG5cdGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7IC8vIHJlZiBnZW5vbWVcblx0Ly8gZmVhdHVyZSB0aWNrIG1hcmtzXG5cdGlmICghZmVhdHVyZXMgfHwgZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XG5cdCAgICB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoJ1tuYW1lPVwidGlja3NcIl0nKS5zZWxlY3RBbGwoXCIuZmVhdHVyZVwiKS5yZW1vdmUoKTtcblx0ICAgIHJldHVybjtcblx0fVxuXG5cdC8vXG5cdGxldCB0R3JwcyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpLnNlbGVjdCgnW25hbWU9XCJ0aWNrc1wiXScpO1xuXG5cdC8vIGdyb3VwIGZlYXR1cmVzIGJ5IGNocm9tb3NvbWVcbiAgICAgICAgbGV0IGZpeCA9IGZlYXR1cmVzLnJlZHVjZSgoYSxmKSA9PiB7IFxuXHQgICAgaWYgKCEgYVtmLmNocl0pIGFbZi5jaHJdID0gW107XG5cdCAgICBhW2YuY2hyXS5wdXNoKGYpO1xuXHQgICAgcmV0dXJuIGE7XG5cdH0sIHt9KVxuXHR0R3Jwcy5lYWNoKGZ1bmN0aW9uKGMpIHtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5kYXR1bSggeyBjaHI6IGMsIGZlYXR1cmVzOiBmaXhbYy5uYW1lXSAgfHwgW119ICk7XG5cdH0pO1xuXG5cdC8vIHRoZSB0aWNrIGVsZW1lbnRzXG4gICAgICAgIGxldCBmZWF0cyA9IHRHcnBzLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpXG5cdCAgICAuZGF0YShkID0+IGQuZmVhdHVyZXMsIGQgPT4gZC5tZ3BpZCk7XG5cdC8vXG5cdGxldCB4QWRqID0gZiA9PiAoZi5zdHJhbmQgPT09IFwiK1wiID8gdGhpcy50aWNrTGVuZ3RoIDogLXRoaXMudGlja0xlbmd0aCk7XG5cdC8vXG5cdGxldCBzaGFwZSA9IFwiY2lyY2xlXCI7ICAvLyBcImNpcmNsZVwiIG9yIFwibGluZVwiXG5cdC8vXG5cdGxldCBuZXdmcyA9IGZlYXRzLmVudGVyKClcblx0ICAgIC5hcHBlbmQoc2hhcGUpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJmZWF0dXJlXCIpXG5cdCAgICAub24oJ2NsaWNrJywgKGYpID0+IHtcblx0XHRsZXQgaSA9IGYuY2Fub25pY2FsfHxmLklEO1xuXHQgICAgICAgIHRoaXMuYXBwLnNldENvbnRleHQoe2xhbmRtYXJrOmksIGhpZ2hsaWdodDpbaV19KTtcblx0ICAgIH0pIDtcblx0bmV3ZnMuYXBwZW5kKFwidGl0bGVcIilcblx0XHQudGV4dChmPT5mLnN5bWJvbCB8fCBmLmlkKTtcblx0aWYgKHNoYXBlID09PSBcImxpbmVcIikge1xuXHQgICAgZmVhdHMuYXR0cihcIngxXCIsIGYgPT4geEFkaihmKSArIDUpXG5cdCAgICBmZWF0cy5hdHRyKFwieTFcIiwgZiA9PiByZy55c2NhbGUoZi5zdGFydCkpXG5cdCAgICBmZWF0cy5hdHRyKFwieDJcIiwgZiA9PiB4QWRqKGYpICsgdGhpcy50aWNrTGVuZ3RoICsgNSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ5MlwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0fVxuXHRlbHNlIHtcblx0ICAgIGZlYXRzLmF0dHIoXCJjeFwiLCBmID0+IHhBZGooZikpXG5cdCAgICBmZWF0cy5hdHRyKFwiY3lcIiwgZiA9PiByZy55c2NhbGUoZi5zdGFydCkpXG5cdCAgICBmZWF0cy5hdHRyKFwiclwiLCAgdGhpcy50aWNrTGVuZ3RoIC8gMik7XG5cdH1cblx0Ly9cblx0ZmVhdHMuZXhpdCgpLnJlbW92ZSgpXG4gICAgfVxufSAvLyBlbmQgY2xhc3MgR2Vub21lVmlld1xuXG5leHBvcnQgeyBHZW5vbWVWaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9HZW5vbWVWaWV3LmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5cbmNsYXNzIEZlYXR1cmVEZXRhaWxzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLmluaXREb20gKCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdERvbSAoKSB7XG5cdC8vXG5cdHRoaXMucm9vdC5zZWxlY3QgKFwiLmJ1dHRvbi5jbG9zZVwiKVxuXHQgICAgLm9uKFwiY2xpY2suZXh0cmFcIiwgKCkgPT4gdGhpcy51cGRhdGUoKSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy9cbiAgICB1cGRhdGUoZikge1xuXHQvLyBpZiBjYWxsZWQgd2l0aCBubyBhcmdzLCB1cGRhdGUgdXNpbmcgdGhlIHByZXZpb3VzIGZlYXR1cmVcblx0ZiA9IGYgfHwgdGhpcy5sYXN0RmVhdHVyZTtcblx0aWYgKCFmKSB7XG5cdCAgIC8vIEZJWE1FOiBtYWpvciByZWFjaG92ZXIgaW4gdGhpcyBzZWN0aW9uXG5cdCAgIC8vXG5cdCAgIC8vIGZhbGxiYWNrLiB0YWtlIHRoZSBmaXJzdCBoaWdobGlnaHRlZC5cblx0ICAgbGV0IHIgPSB0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcInJlY3QuZmVhdHVyZS5oaWdobGlnaHRcIilbMF1bMF07XG5cdCAgIC8vIGZhbGxiYWNrLiB0YWtlIHRoZSBmaXJzdCBmZWF0dXJlXG5cdCAgIGlmICghcikgciA9IHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwicmVjdC5mZWF0dXJlXCIpWzBdWzBdO1xuXHQgICBpZiAocikgZiA9IHIuX19kYXRhX187XG5cdH1cblx0Ly8gcmVtZW1iZXJcbiAgICAgICAgaWYgKCFmKSB0aHJvdyBcIkNhbm5vdCB1cGRhdGUgZmVhdHVyZSBkZXRhaWxzLiBObyBmZWF0dXJlLlwiO1xuXHR0aGlzLmxhc3RGZWF0dXJlID0gZjtcblxuXHQvLyBsaXN0IG9mIGZlYXR1cmVzIHRvIHNob3cgaW4gZGV0YWlscyBhcmVhLlxuXHQvLyB0aGUgZ2l2ZW4gZmVhdHVyZSBhbmQgYWxsIGVxdWl2YWxlbnRzIGluIG90aGVyIGdlbm9tZXMuXG5cdGxldCBmbGlzdCA9IFtmXTtcblx0aWYgKGYubWdpaWQpIHtcblx0ICAgIC8vIEZJWE1FOiByZWFjaG92ZXJcblx0ICAgIGZsaXN0ID0gdGhpcy5hcHAuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkKGYubWdpaWQpO1xuXHR9XG5cdC8vIEdvdCB0aGUgbGlzdC4gTm93IG9yZGVyIGl0IHRoZSBzYW1lIGFzIHRoZSBkaXNwbGF5ZWQgZ2Vub21lc1xuXHQvLyBidWlsZCBpbmRleCBvZiBnZW5vbWUgbmFtZSAtPiBmZWF0dXJlIGluIGZsaXN0XG5cdGxldCBpeCA9IGZsaXN0LnJlZHVjZSgoYWNjLGYpID0+IHsgYWNjW2YuZ2Vub21lLm5hbWVdID0gZjsgcmV0dXJuIGFjYzsgfSwge30pXG5cdGxldCBnZW5vbWVPcmRlciA9IChbdGhpcy5hcHAuckdlbm9tZV0uY29uY2F0KHRoaXMuYXBwLmNHZW5vbWVzKSk7XG5cdGZsaXN0ID0gZ2Vub21lT3JkZXIubWFwKGcgPT4gaXhbZy5uYW1lXSB8fCBudWxsKTtcblx0Ly9cblx0bGV0IGNvbEhlYWRlcnMgPSBbXG5cdCAgICAvLyBjb2x1bW5zIGhlYWRlcnMgYW5kIHRoZWlyICUgd2lkdGhzXG5cdCAgICBbXCJNR0kgaWRcIiAgICAgLDEwXSxcblx0ICAgIFtcIk1HSSBzeW1ib2xcIiAsMTBdLFxuXHQgICAgW1wiR2Vub21lXCIgICAgICw5XSxcblx0ICAgIFtcIk1HUCBpZFwiICAgICAsMTddLFxuXHQgICAgW1wiVHlwZVwiICAgICAgICwxMC41XSxcblx0ICAgIFtcIkJpb1R5cGVcIiAgICAsMTguNV0sXG5cdCAgICBbXCJDb29yZGluYXRlc1wiLDE4XSxcblx0ICAgIFtcIkxlbmd0aFwiICAgICAsN11cblx0XTtcblx0Ly8gSW4gdGhlIGNsb3NlZCBzdGF0ZSwgb25seSBzaG93IHRoZSBoZWFkZXIgYW5kIHRoZSByb3cgZm9yIHRoZSBwYXNzZWQgZmVhdHVyZVxuXHRpZiAodGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgZmxpc3QgPSBmbGlzdC5maWx0ZXIoIChmZiwgaSkgPT4gZmYgPT09IGYgKTtcblx0Ly8gRHJhdyB0aGUgdGFibGVcblx0bGV0IHQgPSB0aGlzLnJvb3Quc2VsZWN0KCd0YWJsZScpO1xuXHRsZXQgcm93cyA9IHQuc2VsZWN0QWxsKCd0cicpLmRhdGEoIFtjb2xIZWFkZXJzXS5jb25jYXQoZmxpc3QpICk7XG5cdHJvd3MuZW50ZXIoKS5hcHBlbmQoJ3RyJylcblx0ICAub24oXCJtb3VzZWVudGVyXCIsIChmLGkpID0+IGkgIT09IDAgJiYgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KGYsIHRydWUpKVxuXHQgIC5vbihcIm1vdXNlbGVhdmVcIiwgKGYsaSkgPT4gaSAhPT0gMCAmJiB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoKSk7XG5cdCAgICAgIFxuXHRyb3dzLmV4aXQoKS5yZW1vdmUoKTtcblx0cm93cy5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIChmZiwgaSkgPT4gKGkgIT09IDAgJiYgZmYgPT09IGYpKTtcblx0Ly9cblx0Ly8gR2l2ZW4gYSBmZWF0dXJlLCByZXR1cm5zIGEgbGlzdCBvZiBzdHJpbmdzIGZvciBwb3B1bGF0aW5nIGEgdGFibGUgcm93LlxuXHQvLyBJZiBpPT09MCwgdGhlbiBmIGlzIG5vdCBhIGZlYXR1cmUsIGJ1dCBhIGxpc3QgY29sdW1ucyBuYW1lcyt3aWR0aHMuXG5cdC8vIFxuXHRsZXQgY2VsbERhdGEgPSBmdW5jdGlvbiAoZiwgaSkge1xuXHQgICAgaWYgKGkgPT09IDApIHtcblx0XHRyZXR1cm4gZjtcblx0ICAgIH1cblx0ICAgIGxldCBjZWxsRGF0YSA9IFsgXCIuXCIsIFwiLlwiLCBnZW5vbWVPcmRlcltpLTFdLmxhYmVsLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiwgXCIuXCIgXTtcblx0ICAgIC8vIGYgaXMgbnVsbCBpZiBpdCBkb2Vzbid0IGV4aXN0IGZvciBnZW5vbWUgaSBcblx0ICAgIGlmIChmKSB7XG5cdFx0bGV0IGxpbmsgPSBcIlwiO1xuXHRcdGxldCBtZ2lpZCA9IGYubWdpaWQgfHwgXCJcIjtcblx0XHRpZiAobWdpaWQpIHtcblx0XHQgICAgbGV0IHVybCA9IGBodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvYWNjZXNzaW9uLyR7bWdpaWR9YDtcblx0XHQgICAgbGluayA9IGA8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHt1cmx9XCI+JHttZ2lpZH08L2E+YDtcblx0XHR9XG5cdFx0Y2VsbERhdGEgPSBbXG5cdFx0ICAgIGxpbmsgfHwgbWdpaWQsXG5cdFx0ICAgIGYuc3ltYm9sLFxuXHRcdCAgICBmLmdlbm9tZS5sYWJlbCxcblx0XHQgICAgZi5tZ3BpZCxcblx0XHQgICAgZi50eXBlLFxuXHRcdCAgICBmLmJpb3R5cGUsXG5cdFx0ICAgIGAke2YuY2hyfToke2Yuc3RhcnR9Li4ke2YuZW5kfSAoJHtmLnN0cmFuZH0pYCxcblx0XHQgICAgYCR7Zi5lbmQgLSBmLnN0YXJ0ICsgMX0gYnBgXG5cdFx0XTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBjZWxsRGF0YTtcblx0fTtcblx0bGV0IGNlbGxzID0gcm93cy5zZWxlY3RBbGwoXCJ0ZFwiKVxuXHQgICAgLmRhdGEoKGYsaSkgPT4gY2VsbERhdGEoZixpKSk7XG5cdGNlbGxzLmVudGVyKCkuYXBwZW5kKFwidGRcIik7XG5cdGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcblx0Y2VsbHMuaHRtbCgoZCxpLGopID0+IHtcblx0ICAgIHJldHVybiBqID09PSAwID8gZFswXSA6IGRcblx0fSlcblx0LnN0eWxlKFwid2lkdGhcIiwgKGQsaSxqKSA9PiBqID09PSAwID8gYCR7ZFsxXX0lYCA6IG51bGwpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgRmVhdHVyZURldGFpbHMgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTVkdWaWV3IH0gZnJvbSAnLi9TVkdWaWV3JztcbmltcG9ydCB7IEZlYXR1cmUgfSBmcm9tICcuL0ZlYXR1cmUnO1xuaW1wb3J0IHsgY2xpcCwgcGFyc2VDb29yZHMsIGZvcm1hdENvb3JkcywgY29vcmRzQWZ0ZXJUcmFuc2Zvcm0sIHJlbW92ZUR1cHMgfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBab29tVmlldyBleHRlbmRzIFNWR1ZpZXcge1xuICAgIC8vXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0LCBpbml0aWFsQ29vcmRzLCBpbml0aWFsSGkpIHtcbiAgICAgIHN1cGVyKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIC8vXG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAvL1xuICAgICAgdGhpcy5taW5TdmdIZWlnaHQgPSAyNTA7XG4gICAgICB0aGlzLmJsb2NrSGVpZ2h0ID0gNDA7XG4gICAgICB0aGlzLnRvcE9mZnNldCA9IDQ1O1xuICAgICAgdGhpcy5mZWF0SGVpZ2h0ID0gNjtcdC8vIGhlaWdodCBvZiBhIHJlY3RhbmdsZSByZXByZXNlbnRpbmcgYSBmZWF0dXJlXG4gICAgICB0aGlzLmxhbmVHYXAgPSAyO1x0ICAgICAgICAvLyBzcGFjZSBiZXR3ZWVuIHN3aW0gbGFuZXNcbiAgICAgIHRoaXMubGFuZUhlaWdodCA9IHRoaXMuZmVhdEhlaWdodCArIHRoaXMubGFuZUdhcDtcbiAgICAgIHRoaXMuc3RyaXBIZWlnaHQgPSA3MDsgICAgLy8gaGVpZ2h0IHBlciBnZW5vbWUgaW4gdGhlIHpvb20gdmlld1xuICAgICAgdGhpcy5zdHJpcEdhcCA9IDIwO1x0Ly8gc3BhY2UgYmV0d2VlbiBzdHJpcHNcbiAgICAgIHRoaXMubWF4U0JnYXAgPSAyMDtcdC8vIG1heCBnYXAgYWxsb3dlZCBiZXR3ZWVuIGJsb2Nrcy5cbiAgICAgIHRoaXMuZG1vZGUgPSAnY29tcGFyaXNvbic7Ly8gZHJhd2luZyBtb2RlLiAnY29tcGFyaXNvbicgb3IgJ3JlZmVyZW5jZSdcbiAgICAgIHRoaXMuZGVsdGFYID0gMDtcbiAgICAgIHRoaXMuZGVsdGFCID0gMDtcblxuICAgICAgLy9cbiAgICAgIC8vIElEcyBvZiBGZWF0dXJlcyB3ZSdyZSBoaWdobGlnaHRpbmcuIE1heSBiZSBtZ3BpZCAgb3IgbWdpSWRcbiAgICAgIC8vIGhpRmVhdHMgaXMgYW4gb2JqIHdob3NlIGtleXMgYXJlIHRoZSBJRHNcbiAgICAgIHRoaXMuaGlGZWF0cyA9IChpbml0aWFsSGkgfHwgW10pLnJlZHVjZSggKGEsdikgPT4geyBhW3ZdPXY7IHJldHVybiBhOyB9LCB7fSApO1xuICAgICAgLy9cbiAgICAgIHRoaXMuZmlkdWNpYWxzID0gdGhpcy5zdmcuaW5zZXJ0KFwiZ1wiLFwiOmZpcnN0LWNoaWxkXCIpIC8vIFxuICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJmaWR1Y2lhbHNcIik7XG4gICAgICB0aGlzLnN0cmlwc0dycCA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIixcInN0cmlwc1wiKTtcbiAgICAgIHRoaXMuYXhpcyA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoXCJnXCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIixcImF4aXNcIik7XG4gICAgICB0aGlzLmN4dE1lbnUgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImN4dE1lbnVcIl0nKTtcbiAgICAgIC8vXG4gICAgICB0aGlzLmRyYWdnaW5nID0gbnVsbDtcbiAgICAgIHRoaXMuZHJhZ2dlciA9IHRoaXMuZ2V0RHJhZ2dlcigpO1xuICAgICAgLy9cbiAgICAgIHRoaXMuaW5pdERvbSgpO1xuICAgIH1cbiAgICAvL1xuICAgIGluaXREb20gKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCByID0gdGhpcy5yb290O1xuXHRsZXQgYSA9IHRoaXMuYXBwO1xuXHQvL1xuXHRyLnNlbGVjdCgnLmJ1dHRvbi5jbG9zZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4gdGhpcy51cGRhdGUoKSk7XG5cblx0Ly8gem9vbSBjb250cm9sc1xuXHRyLnNlbGVjdChcIiN6b29tT3V0XCIpLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKGEuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdChcIiN6b29tSW5cIikgLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKDEvYS5kZWZhdWx0Wm9vbSkgfSk7XG5cdHIuc2VsZWN0KFwiI3pvb21PdXRNb3JlXCIpLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKDIqYS5kZWZhdWx0Wm9vbSkgfSk7XG5cdHIuc2VsZWN0KFwiI3pvb21Jbk1vcmVcIikgLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS56b29tKDEvKDIqYS5kZWZhdWx0Wm9vbSkpIH0pO1xuXG5cdC8vIHBhbiBjb250cm9sc1xuXHRyLnNlbGVjdChcIiNwYW5MZWZ0XCIpIC5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEucGFuKC1hLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdChcIiNwYW5SaWdodFwiKS5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEucGFuKCthLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdChcIiNwYW5MZWZ0TW9yZVwiKSAub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigtNSphLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdChcIiNwYW5SaWdodE1vcmVcIikub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigrNSphLmRlZmF1bHRQYW4pIH0pO1xuXG5cdC8vIENyZWF0ZSBjb250ZXh0IG1lbnUuIFxuXHR0aGlzLmluaXRDb250ZXh0TWVudShbe1xuICAgICAgICAgICAgbGFiZWw6IFwiTUdJIFNOUHNcIiwgXG5cdCAgICBpY29uOiBcIm9wZW5faW5fbmV3XCIsXG5cdCAgICB0b29sdGlwOiBcIlZpZXcgU05QcyBhdCBNR0kgZm9yIHRoZSBjdXJyZW50IHN0cmFpbnMgaW4gdGhlIGN1cnJlbnQgcmVnaW9uLiAoU29tZSBzdHJhaW5zIG5vdCBhdmFpbGFibGUuKVwiLFxuXHQgICAgaGFuZGxlcjogKCk9PiB0aGlzLmFwcC5saW5rVG9NZ2lTbnBSZXBvcnQoKVxuXHR9LHtcbiAgICAgICAgICAgIGxhYmVsOiBcIk1HSSBRVExzXCIsIFxuXHQgICAgaWNvbjogIFwib3Blbl9pbl9uZXdcIixcblx0ICAgIHRvb2x0aXA6IFwiVmlldyBRVEwgYXQgTUdJIHRoYXQgb3ZlcmxhcCB0aGUgY3VycmVudCByZWdpb24uXCIsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naVFUTHMoKVxuXHR9LHtcbiAgICAgICAgICAgIGxhYmVsOiBcIk1HSSBKQnJvd3NlXCIsIFxuXHQgICAgaWNvbjogXCJvcGVuX2luX25ld1wiLFxuXHQgICAgdG9vbHRpcDogXCJPcGVuIE1HSSBKQnJvd3NlIChDNTdCTC82SiBHUkNtMzgpIHdpdGggdGhlIGN1cnJlbnQgY29vcmRpbmF0ZSByYW5nZS5cIixcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpSkJyb3dzZSgpXG5cdH1dKTtcblx0dGhpcy5yb290XG5cdCAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHQgICAgICAvLyBjbGljayBvbiBiYWNrZ3JvdW5kID0+IGhpZGUgY29udGV4dCBtZW51XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICh0Z3QudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlcIiAmJiB0Z3QuaW5uZXJIVE1MID09PSBcIm1lbnVcIilcblx0XHQgIC8vIGV4Y2VwdGlvbjogdGhlIGNvbnRleHQgbWVudSBidXR0b24gaXRzZWxmXG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgIGVsc2Vcblx0XHQgIHRoaXMuaGlkZUNvbnRleHRNZW51KClcblx0ICAgICAgXG5cdCAgfSlcblx0ICAub24oJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oKXtcblx0ICAgICAgLy8gcmlnaHQtY2xpY2sgb24gYSBmZWF0dXJlID0+IGZlYXR1cmUgY29udGV4dCBtZW51XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICghdGd0LmNsYXNzTGlzdC5jb250YWlucyhcImZlYXR1cmVcIikpIHJldHVybjtcblx0ICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0ICAgICAgZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgfSk7XG5cblx0Ly9cblx0Ly9cblx0bGV0IGZDbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZiwgZXZ0LCBwcmVzZXJ2ZSkge1xuXHQgICAgbGV0IGlkID0gZi5tZ2lpZCB8fCBmLm1ncGlkO1xuXHQgICAgaWYgKGV2dC5tZXRhS2V5KSB7XG5cdFx0aWYgKCFldnQuc2hpZnRLZXkgJiYgIXByZXNlcnZlKSB0aGlzLmhpRmVhdHMgPSB7fTtcblx0XHR0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICAgICAgdGhpcy5hcHAuc2V0Q29udGV4dCh7bGFuZG1hcms6KGYuY2Fub25pY2FsIHx8IGYuSUQpLCBkZWx0YTowfSlcblx0XHRyZXR1cm47XG5cdCAgICB9XG5cdCAgICBpZiAoZXZ0LnNoaWZ0S2V5KSB7XG5cdFx0aWYgKHRoaXMuaGlGZWF0c1tpZF0pXG5cdFx0ICAgIGRlbGV0ZSB0aGlzLmhpRmVhdHNbaWRdXG5cdFx0ZWxzZVxuXHRcdCAgICB0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRpZiAoIXByZXNlcnZlKSB0aGlzLmhpRmVhdHMgPSB7fTtcblx0XHR0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdCAgICAvLyBGSVhNRTogcmVhY2hvdmVyXG5cdCAgICB0aGlzLmFwcC5mZWF0dXJlRGV0YWlscy51cGRhdGUoZik7XG5cdH0uYmluZCh0aGlzKTtcblx0Ly9cblx0bGV0IGZNb3VzZU92ZXJIYW5kbGVyID0gZnVuY3Rpb24oZikge1xuXHRcdGlmIChkMy5ldmVudC5hbHRLZXkpIHtcblx0XHQgICAgLy8gSWYgdXNlciBpcyBob2xkaW5nIHRoZSBhbHQga2V5LCBzZWxlY3QgZXZlcnl0aGluZyB0b3VjaGVkLlxuXHRcdCAgICBmQ2xpY2tIYW5kbGVyKGYsIGQzLmV2ZW50LCB0cnVlKTtcblx0XHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0XHQgICAgLy8gRG9uJ3QgcmVnaXN0ZXIgY29udGV4dCBjaGFuZ2VzIHVudGlsIHVzZXIgaGFzIHBhdXNlZCBmb3IgYXQgbGVhc3QgMXMuXG5cdFx0ICAgIGlmICh0aGlzLnRpbWVvdXQpIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcblx0XHQgICAgdGhpcy50aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXsgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTsgfS5iaW5kKHRoaXMpLCAxMDAwKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIHRoaXMuaGlnaGxpZ2h0KGYpO1xuXHRcdCAgICBpZiAoZDMuZXZlbnQuY3RybEtleSlcblx0XHQgICAgICAgIHRoaXMuYXBwLmZlYXR1cmVEZXRhaWxzLnVwZGF0ZShmKTtcblx0XHR9XG5cdH0uYmluZCh0aGlzKTtcblx0Ly9cblx0bGV0IGZNb3VzZU91dEhhbmRsZXIgPSBmdW5jdGlvbihmKSB7XG5cdFx0dGhpcy5oaWdobGlnaHQoKTsgXG5cdH0uYmluZCh0aGlzKTtcblxuXHQvLyBcbiAgICAgICAgdGhpcy5zdmdcblx0ICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0ID0gZDMuZXZlbnQudGFyZ2V0O1xuXHQgICAgICBsZXQgdGd0ID0gZDMuc2VsZWN0KHQpO1xuXHQgICAgICBpZiAodC50YWdOYW1lID09IFwicmVjdFwiICYmIHQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmVhdHVyZVwiKSkge1xuXHRcdCAgLy8gdXNlciBjbGlja2VkIG9uIGEgZmVhdHVyZVxuXHRcdCAgZkNsaWNrSGFuZGxlcih0Ll9fZGF0YV9fLCBkMy5ldmVudCk7XG5cdFx0ICB0aGlzLmhpZ2hsaWdodCgpO1xuXHQgICAgICAgICAgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTtcblx0ICAgICAgfVxuXHQgICAgICBlbHNlIGlmICh0LnRhZ05hbWUgPT0gXCJyZWN0XCIgJiYgdC5jbGFzc0xpc3QuY29udGFpbnMoXCJibG9ja1wiKSAmJiAhZDMuZXZlbnQuc2hpZnRLZXkpIHtcblx0XHQgIC8vIHVzZXIgY2xpY2tlZCBvbiBhIHN5bnRlbnkgYmxvY2sgYmFja2dyb3VuZFxuXHRcdCAgdGhpcy5oaUZlYXRzID0ge307XG5cdFx0ICB0aGlzLmhpZ2hsaWdodCgpO1xuXHRcdCAgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTtcblx0ICAgICAgfVxuXHQgICAgICBlbHNlIGlmICh0LnRhZ05hbWUgPT0gXCJyZWN0XCIgJiYgdGd0LmF0dHIoJ25hbWUnKSA9PT0gJ3pvb21TdHJpcEhhbmRsZScgJiYgZDMuZXZlbnQuc2hpZnRLZXkpIHtcblx0ICAgICAgICAgIHRoaXMuYXBwLnNldENvbnRleHQoe3JlZjp0Ll9fZGF0YV9fLmdlbm9tZS5uYW1lfSk7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbihcIm1vdXNlb3ZlclwiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU92ZXJIYW5kbGVyKGYpO1xuXHQgICAgICB9XG5cdCAgfSlcblx0ICAub24oXCJtb3VzZW91dFwiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU91dEhhbmRsZXIoZik7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbignd2hlZWwnLCBmdW5jdGlvbihkKSB7XG5cdCAgICBsZXQgZSA9IGQzLmV2ZW50O1xuXHQgICAgLy8gb25seSBpbnRlcmVzdGVkIGluIGhvcml6b250YWwgbW90aW9uIGV2ZW50c1xuXHQgICAgaWYgKE1hdGguYWJzKGUuZGVsdGFYKSA8IE1hdGguYWJzKGUuZGVsdGFZKSkgXG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgbGV0IGRiID0gZS5kZWx0YVggLyBzZWxmLnBwYjsgLy8gZGVsdGEgaW4gYmFzZXMgb24gZm9yIHRoaXMgZXZlbnRcblx0ICAgIGxldCBjICA9IHNlbGYuYXBwLmNvb3Jkcztcblx0ICAgIHNlbGYuZGVsdGFCID0gY2xpcChzZWxmLmRlbHRhQiArIGRiLCAtYy5zdGFydCwgYy5jaHJvbW9zb21lLmxlbmd0aCAtIGMuZW5kKVxuXHQgICAgc2VsZi5kZWx0YVggPSBzZWxmLmRlbHRhQiAqIHNlbGYucHBiO1xuXHQgICAgZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbCgnZy56b29tU3RyaXAgPiBnW25hbWU9XCJzQmxvY2tzXCJdJylcblx0XHQuYXR0cigndHJhbnNmb3JtJyxgdHJhbnNsYXRlKCR7LXNlbGYuZGVsdGFYfSwwKWApO1xuXHQgICAgc2VsZi5kcmF3RmlkdWNpYWxzKCk7XG5cdCAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgaWYgKHNlbGYudGltZW91dClcblx0ICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dCk7XG5cdCAgICBzZWxmLnRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0c2VsZi50aW1lb3V0ID0gbnVsbDtcblx0XHRsZXQgY2N4dCA9IHNlbGYuYXBwLmdldENvbnRleHQoKTtcblx0XHRpZiAoY2N4dC5sYW5kbWFyaykge1xuXHRcdCAgICBjY3h0LmRlbHRhICs9IHNlbGYuZGVsdGFCO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHQgICAgY2N4dC5zdGFydCArPSBzZWxmLmRlbHRhQjtcblx0XHQgICAgY2N4dC5lbmQgKz0gc2VsZi5kZWx0YUI7XG5cdFx0fVxuXHRcdHNlbGYuZGVsdGFCID0gc2VsZi5kZWx0YVggPSAwO1xuXHRcdHNlbGYuYXBwLnNldENvbnRleHQoY2N4dCk7XG5cdCAgICB9LCA1MCk7XG5cdH0pO1xuXG5cblx0Ly8gQnV0dG9uOiBEcm9wIGRvd24gbWVudSBpbiB6b29tIHZpZXdcblx0dGhpcy5yb290LnNlbGVjdChcIi5tZW51ID4gLmJ1dHRvblwiKVxuXHQgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgLy8gc2hvdyBjb250ZXh0IG1lbnUgYXQgbW91c2UgZXZlbnQgY29vcmRpbmF0ZXNcblx0ICAgICAgbGV0IGN4ID0gZDMuZXZlbnQuY2xpZW50WDtcblx0ICAgICAgbGV0IGN5ID0gZDMuZXZlbnQuY2xpZW50WTtcblx0ICAgICAgbGV0IGJiID0gZDMuc2VsZWN0KHRoaXMpWzBdWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICBkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgc2VsZi5zaG93Q29udGV4dE1lbnUoY3gtYmIubGVmdCxjeS1iYi50b3ApO1xuXHQgIH0pO1xuXHQvLyB6b29tIGNvb3JkaW5hdGVzIGJveFxuXHR0aGlzLnJvb3Quc2VsZWN0KFwiI3pvb21Db29yZHNcIilcblx0ICAgIC5jYWxsKHpjcyA9PiB6Y3NbMF1bMF0udmFsdWUgPSBmb3JtYXRDb29yZHModGhpcy5hcHAuY29vcmRzKSlcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHsgdGhpcy5zZWxlY3QoKTsgfSlcblx0ICAgIC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7IHNlbGYuYXBwLnNldENvb3JkaW5hdGVzKHRoaXMudmFsdWUpOyB9KTtcblxuXHQvLyB6b29tIHdpbmRvdyBzaXplIGJveFxuXHR0aGlzLnJvb3Quc2VsZWN0KFwiI3pvb21XU2l6ZVwiKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkgeyB0aGlzLnNlbGVjdCgpOyB9KVxuXHQgICAgLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIGxldCB3cyA9IHBhcnNlSW50KHRoaXMudmFsdWUpO1xuXHRcdGxldCBjID0gc2VsZi5hcHAuY29vcmRzO1xuXHRcdGlmIChpc05hTih3cykgfHwgd3MgPCAxMDApIHtcblx0XHQgICAgYWxlcnQoXCJJbnZhbGlkIHdpbmRvdyBzaXplLiBQbGVhc2UgZW50ZXIgYW4gaW50ZWdlciA+PSAxMDAuXCIpO1xuXHRcdCAgICB0aGlzLnZhbHVlID0gTWF0aC5yb3VuZChjLmVuZCAtIGMuc3RhcnQgKyAxKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIGxldCBtaWQgPSAoYy5zdGFydCArIGMuZW5kKSAvIDI7XG5cdFx0ICAgIGxldCBuZXdzID0gTWF0aC5yb3VuZChtaWQgLSB3cy8yKTtcblx0XHQgICAgbGV0IG5ld2UgPSBuZXdzICsgd3MgLSAxO1xuXHRcdCAgICBzZWxmLmFwcC5zZXRDb250ZXh0KHtcblx0XHQgICAgICAgIGNocjogYy5jaHIsXG5cdFx0XHRzdGFydDogbmV3cyxcblx0XHRcdGVuZDogbmV3ZSxcblx0XHRcdGxlbmd0aDogbmV3ZS1uZXdzKzFcblx0XHQgICAgfSk7XG5cdFx0fVxuXHQgICAgfSk7XG5cdC8vIHpvb20gZHJhd2luZyBtb2RlIFxuXHR0aGlzLnJvb3Quc2VsZWN0QWxsKCdkaXZbbmFtZT1cInpvb21EbW9kZVwiXSAuYnV0dG9uJylcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdGxldCByID0gc2VsZi5yb290O1xuXHRcdGxldCBpc0MgPSByLmNsYXNzZWQoJ2NvbXBhcmlzb24nKTtcblx0XHRyLmNsYXNzZWQoJ2NvbXBhcmlzb24nLCAhaXNDKTtcblx0XHRyLmNsYXNzZWQoJ3JlZmVyZW5jZScsIGlzQyk7XG5cdFx0c2VsZi5hcHAuc2V0Q29udGV4dCh7ZG1vZGU6IHIuY2xhc3NlZCgnY29tcGFyaXNvbicpID8gJ2NvbXBhcmlzb24nIDogJ3JlZmVyZW5jZSd9KTtcblx0ICAgIH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBkYXRhIChsaXN0IG9mIG1lbnVJdGVtIGNvbmZpZ3MpIEVhY2ggY29uZmlnIGxvb2tzIGxpa2Uge2xhYmVsOnN0cmluZywgaGFuZGxlcjogZnVuY3Rpb259XG4gICAgaW5pdENvbnRleHRNZW51IChkYXRhKSB7XG5cdHRoaXMuY3h0TWVudS5zZWxlY3RBbGwoXCIubWVudUl0ZW1cIikucmVtb3ZlKCk7IC8vIGluIGNhc2Ugb2YgcmUtaW5pdFxuICAgICAgICBsZXQgbWl0ZW1zID0gdGhpcy5jeHRNZW51XG5cdCAgLnNlbGVjdEFsbChcIi5tZW51SXRlbVwiKVxuXHQgIC5kYXRhKGRhdGEpO1xuXHRsZXQgbmV3cyA9IG1pdGVtcy5lbnRlcigpXG5cdCAgLmFwcGVuZChcImRpdlwiKVxuXHQgIC5hdHRyKFwiY2xhc3NcIiwgXCJtZW51SXRlbSBmbGV4cm93XCIpXG5cdCAgLmF0dHIoXCJ0aXRsZVwiLCBkID0+IGQudG9vbHRpcCB8fCBudWxsICk7XG5cdG5ld3MuYXBwZW5kKFwibGFiZWxcIilcblx0ICAudGV4dChkID0+IGQubGFiZWwpXG5cdCAgLm9uKFwiY2xpY2tcIiwgZCA9PiB7XG5cdCAgICAgIGQuaGFuZGxlcigpO1xuXHQgICAgICB0aGlzLmhpZGVDb250ZXh0TWVudSgpO1xuXHQgIH0pO1xuXHRuZXdzLmFwcGVuZChcImlcIilcblx0ICAuYXR0cihcImNsYXNzXCIsIFwibWF0ZXJpYWwtaWNvbnNcIilcblx0ICAudGV4dCggZD0+ZC5pY29uICk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldCBoaWdobGlnaHRlZCAoaGxzKSB7XG5cdGlmICh0eXBlb2YoaGxzKSA9PT0gXCJzdHJpbmdcIilcblx0ICAgIGhscyA9IFtobHNdO1xuXHQvL1xuXHR0aGlzLmhpRmVhdHMgPSB7fTtcbiAgICAgICAgZm9yKGxldCBoIG9mIGhscyl7XG5cdCAgICB0aGlzLmhpRmVhdHNbaF0gPSBoO1xuXHR9XG4gICAgfVxuICAgIGdldCBoaWdobGlnaHRlZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpRmVhdHMgPyBPYmplY3Qua2V5cyh0aGlzLmhpRmVhdHMpIDogW107XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd0NvbnRleHRNZW51ICh4LHkpIHtcbiAgICAgICAgdGhpcy5jeHRNZW51XG5cdCAgICAuY2xhc3NlZChcInNob3dpbmdcIiwgdHJ1ZSlcblx0ICAgIC5zdHlsZShcImxlZnRcIiwgYCR7eH1weGApXG5cdCAgICAuc3R5bGUoXCJ0b3BcIiwgYCR7eX1weGApXG5cdCAgICA7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZGVDb250ZXh0TWVudSAoKSB7XG4gICAgICAgIHRoaXMuY3h0TWVudS5jbGFzc2VkKFwic2hvd2luZ1wiLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgZ3MgKGxpc3Qgb2YgR2Vub21lcylcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICAgIEZvciBlYWNoIEdlbm9tZSwgc2V0cyBnLnpvb21ZIFxuICAgIHNldCBnZW5vbWVzIChncykge1xuICAgICAgIGdzLmZvckVhY2goIChnLGkpID0+IHtnLnpvb21ZID0gdGhpcy50b3BPZmZzZXQgKyBpICogKHRoaXMuc3RyaXBIZWlnaHQgKyB0aGlzLnN0cmlwR2FwKX0gKTtcbiAgICAgICB0aGlzLl9nZW5vbWVzID0gZ3M7XG4gICAgfVxuICAgIGdldCBnZW5vbWVzICgpIHtcbiAgICAgICByZXR1cm4gdGhpcy5fZ2Vub21lcztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcyAoc3RyaXBlcykgaW4gdG9wLXRvLWJvdHRvbSBvcmRlci5cbiAgICAvL1xuICAgIGdldEdlbm9tZVlPcmRlciAoKSB7XG4gICAgICAgIGxldCBzdHJpcHMgPSB0aGlzLnN2Z01haW4uc2VsZWN0QWxsKFwiLnpvb21TdHJpcFwiKTtcbiAgICAgICAgbGV0IHNzID0gc3RyaXBzWzBdLm1hcChnPT4ge1xuXHQgICAgbGV0IGJiID0gZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgIHJldHVybiBbYmIueSwgZy5fX2RhdGFfXy5nZW5vbWUubmFtZV07XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgbnMgPSBzcy5zb3J0KCAoYSxiKSA9PiBhWzBdIC0gYlswXSApLm1hcCggeCA9PiB4WzFdIClcblx0cmV0dXJuIG5zO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTZXRzIHRoZSB0b3AtdG8tYm90dG9tIG9yZGVyIG9mIHRoZSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMgYWNjb3JkaW5nIHRvIFxuICAgIC8vIHRoZSBnaXZlbiBuYW1lIGxpc3Qgb2YgbmFtZXMuIEJlY2F1c2Ugd2UgY2FuJ3QgZ3VhcmFudGVlIHRoZSBnaXZlbiBuYW1lcyBjb3JyZXNwb25kXG4gICAgLy8gdG8gYWN0dWFsIHpvb20gc3RyaXBzLCBvciB0aGF0IGFsbCBzdHJpcHMgYXJlIHJlcHJlc2VudGVkLCBldGMuXG4gICAgLy8gVGhlcmVmb3JlLCB0aGUgbGlzdCBpcyBwcmVwcmVjZXNzZWQgYXMgZm9sbG93czpcbiAgICAvLyAgICAgKiBkdXBsaWNhdGUgbmFtZXMsIGlmIHRoZXkgZXhpc3QsIGFyZSByZW1vdmVkXG4gICAgLy8gICAgICogbmFtZXMgdGhhdCBkbyBub3QgY29ycmVzcG9uZCB0byBleGlzdGluZyB6b29tU3RyaXBzIGFyZSByZW1vdmVkXG4gICAgLy8gICAgICogbmFtZXMgb2YgZXhpc3Rpbmcgem9vbSBzdHJpcHMgdGhhdCBkb24ndCBhcHBlYXIgaW4gdGhlIGxpc3QgYXJlIGFkZGVkIHRvIHRoZSBlbmRcbiAgICAvLyBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiBuYW1lcyB3aXRoIHRoZXNlIHByb3BlcnRpZXM6XG4gICAgLy8gICAgICogdGhlcmUgaXMgYSAxOjEgY29ycmVzcG9uZGVuY2UgYmV0d2VlbiBuYW1lcyBhbmQgYWN0dWFsIHpvb20gc3RyaXBzXG4gICAgLy8gICAgICogdGhlIG5hbWUgb3JkZXIgaXMgY29uc2lzdGVudCB3aXRoIHRoZSBpbnB1dCBsaXN0XG4gICAgLy8gVGhpcyBpcyB0aGUgbGlzdCB1c2VkIHRvIChyZSlvcmRlciB0aGUgem9vbSBzdHJpcHMuXG4gICAgLy9cbiAgICAvLyBHaXZlbiB0aGUgbGlzdCBvcmRlcjogXG4gICAgLy8gICAgICogYSBZLXBvc2l0aW9uIGlzIGFzc2lnbmVkIHRvIGVhY2ggZ2Vub21lXG4gICAgLy8gICAgICogem9vbSBzdHJpcHMgdGhhdCBhcmUgTk9UIENVUlJFTlRMWSBCRUlORyBEUkFHR0VEIGFyZSB0cmFuc2xhdGVkIHRvIHRoZWlyIG5ldyBsb2NhdGlvbnNcbiAgICAvL1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIG5zIChsaXN0IG9mIHN0cmluZ3MpIE5hbWVzIG9mIHRoZSBnZW5vbWVzLlxuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgIG5vdGhpbmdcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICAgIFJlY2FsY3VsYXRlcyB0aGUgWS1jb29yZGluYXRlcyBmb3IgZWFjaCBzdHJpcGUgYmFzZWQgb24gdGhlIGdpdmVuIG9yZGVyLCB0aGVuIHRyYW5zbGF0ZXNcbiAgICAvLyAgICAgZWFjaCBzdHJpcCB0byBpdHMgbmV3IHBvc2l0aW9uLlxuICAgIC8vXG4gICAgc2V0R2Vub21lWU9yZGVyIChucykge1xuXHR0aGlzLmdlbm9tZXMgPSByZW1vdmVEdXBzKG5zKS5tYXAobj0+IHRoaXMuYXBwLm5hbWUyZ2Vub21lW25dICkuZmlsdGVyKHg9PngpO1xuICAgICAgICB0aGlzLmdlbm9tZXMuZm9yRWFjaCggKGcsaSkgPT4ge1xuXHQgICAgbGV0IHN0cmlwID0gZDMuc2VsZWN0KGAjem9vbVZpZXcgLnpvb21TdHJpcFtuYW1lPVwiJHtnLm5hbWV9XCJdYCk7XG5cdCAgICBpZiAoIXN0cmlwLmNsYXNzZWQoXCJkcmFnZ2luZ1wiKSlcblx0ICAgICAgICBzdHJpcC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoMCwke2cuem9vbVl9KWApO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgZHJhZ2dlciAoZDMuYmVoYXZpb3IuZHJhZykgdG8gYmUgYXR0YWNoZWQgdG8gZWFjaCB6b29tIHN0cmlwLlxuICAgIC8vIEFsbG93cyBzdHJpcHMgdG8gYmUgcmVvcmRlcmVkIGJ5IGRyYWdnaW5nLlxuICAgIGdldERyYWdnZXIgKCkgeyAgXG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICByZXR1cm4gZDMuYmVoYXZpb3IuZHJhZygpXG5cdCAgLm9yaWdpbihmdW5jdGlvbihkLGkpe1xuXHQgICAgICByZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICB9KVxuICAgICAgICAgIC5vbihcImRyYWdzdGFydC56XCIsIGZ1bmN0aW9uKGcpIHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC5zb3VyY2VFdmVudC50YXJnZXQ7XG5cdCAgICAgIGlmIChkMy5ldmVudC5zb3VyY2VFdmVudC5zaGlmdEtleSB8fCBkMy5zZWxlY3QodCkuYXR0cihcIm5hbWVcIikgIT09ICd6b29tU3RyaXBIYW5kbGUnKXtcblx0ICAgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgfVxuXHQgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgbGV0IHN0cmlwID0gdGhpcy5jbG9zZXN0KFwiLnpvb21TdHJpcFwiKTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZyA9IGQzLnNlbGVjdChzdHJpcCkuY2xhc3NlZChcImRyYWdnaW5nXCIsIHRydWUpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZy56XCIsIGZ1bmN0aW9uIChnKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICBsZXQgbXggPSBkMy5tb3VzZShzZWxmLnN2Z01haW5bMF1bMF0pWzBdO1xuXHQgICAgICBsZXQgbXkgPSBkMy5tb3VzZShzZWxmLnN2Z01haW5bMF1bMF0pWzFdO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwLCAke215fSlgKTtcblx0ICAgICAgc2VsZi5zZXRHZW5vbWVZT3JkZXIoc2VsZi5nZXRHZW5vbWVZT3JkZXIoKSk7XG5cdCAgICAgIHNlbGYuZHJhd0ZpZHVjaWFscygpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZ2VuZC56XCIsIGZ1bmN0aW9uIChnKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICAvL1xuXHQgICAgICBzZWxmLmRyYWdnaW5nLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCBmYWxzZSk7XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgPSBudWxsO1xuXHQgICAgICBzZWxmLnNldEdlbm9tZVlPcmRlcihzZWxmLmdldEdlbm9tZVlPcmRlcigpKTtcblx0ICAgICAgc2VsZi5hcHAuc2V0Q29udGV4dCh7IGdlbm9tZXM6IHNlbGYuZ2V0R2Vub21lWU9yZGVyKCkgfSk7XG5cdCAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCBzZWxmLmRyYXdGaWR1Y2lhbHMuYmluZChzZWxmKSwgNTAgKTtcblx0ICB9KVxuXHQgIDtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhckJydXNoZXMgKCkge1xuXHR0aGlzLnJvb3Quc2VsZWN0QWxsKFwiZy5icnVzaFwiKVxuXHQgICAgLmVhY2goIGZ1bmN0aW9uIChiKSB7XG5cdCAgICAgICAgYi5icnVzaC5jbGVhcigpO1xuXHRcdGQzLnNlbGVjdCh0aGlzKS5jYWxsKGIuYnJ1c2gpO1xuXHQgICAgfSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgY3VycmVudCBicnVzaCBjb29yZGluYXRlcywgdHJhbnNsYXRlZCAoaWYgbmVlZGVkKSB0byByZWYgZ2Vub21lIGNvb3JkaW5hdGVzLlxuICAgIGJiR2V0UmVmQ29vcmRzICgpIHtcbiAgICAgIGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7XG4gICAgICBsZXQgYmxrID0gdGhpcy5icnVzaGluZztcbiAgICAgIGxldCBleHQgPSBibGsuYnJ1c2guZXh0ZW50KCk7XG4gICAgICBsZXQgciA9IHsgY2hyOiBibGsuY2hyLCBzdGFydDogZXh0WzBdLCBlbmQ6IGV4dFsxXSwgYmxvY2tJZDpibGsuYmxvY2tJZCB9O1xuICAgICAgbGV0IHRyID0gdGhpcy5hcHAudHJhbnNsYXRvcjtcbiAgICAgIGlmKCBibGsuZ2Vub21lICE9PSByZyApIHtcbiAgICAgICAgIC8vIHVzZXIgaXMgYnJ1c2hpbmcgYSBjb21wIGdlbm9tZXMgc28gZmlyc3QgdHJhbnNsYXRlXG5cdCAvLyBjb29yZGluYXRlcyB0byByZWYgZ2Vub21lXG5cdCBsZXQgcnMgPSB0aGlzLmFwcC50cmFuc2xhdG9yLnRyYW5zbGF0ZShibGsuZ2Vub21lLCByLmNociwgci5zdGFydCwgci5lbmQsIHJnKTtcblx0IGlmIChycy5sZW5ndGggPT09IDApIHJldHVybjtcblx0IHIgPSByc1swXTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAgIHIuYmxvY2tJZCA9IHJnLm5hbWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gcjtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gaGFuZGxlciBmb3IgdGhlIHN0YXJ0IG9mIGEgYnJ1c2ggYWN0aW9uIGJ5IHRoZSB1c2VyIG9uIGEgYmxvY2tcbiAgICBiYlN0YXJ0IChibGssYkVsdCkge1xuICAgICAgdGhpcy5icnVzaGluZyA9IGJsaztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYmJFbmQgKCkge1xuICAgICAgbGV0IHNlID0gZDMuZXZlbnQuc291cmNlRXZlbnQ7XG4gICAgICBsZXQgeHQgPSB0aGlzLmJydXNoaW5nLmJydXNoLmV4dGVudCgpO1xuICAgICAgbGV0IGcgPSB0aGlzLmJydXNoaW5nLmdlbm9tZS5sYWJlbDtcbiAgICAgIHRoaXMuYnJ1c2hpbmcgPSBudWxsO1xuICAgICAgLy9cbiAgICAgIGlmIChzZS5jdHJsS2V5IHx8IHNlLmFsdEtleSB8fCBzZS5tZXRhS2V5KSB7XG5cdCAgdGhpcy5jbGVhckJydXNoZXMoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvL1xuICAgICAgaWYgKE1hdGguYWJzKHh0WzBdIC0geHRbMV0pIDw9IDEwKSB7XG5cdCAgLy8gVXNlciBjbGlja2VkLiBSZWNlbnRlciB2aWV3LlxuXHQgIGxldCBjYyAgICAgICAgPSB0aGlzLmFwcC5jb29yZHM7IFxuXHQgIGxldCBjdXJyV2lkdGggPSBjYy5lbmQgLSBjYy5zdGFydCArIDE7XG5cdCAgbGV0IG1pZCAgICAgICA9IChjYy5zdGFydCArIGNjLmVuZCkvMjtcbiAgICAgICAgICBsZXQgZCA9ICh4dFswXSArIHh0WzFdKS8yIC0gbWlkO1xuXHQgIHRoaXMuYXBwLnNldENvbnRleHQoeyBzdGFydDogY2Muc3RhcnQrZCwgZW5kOiBjYy5lbmQrZCB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuXHQgIC8vIFVzZXIgZHJhZ2dlZC4gWm9vbSBpbiBvciBvdXQuXG5cdCAgdGhpcy5hcHAuc2V0Q29udGV4dCh7IHJlZjpnLCBzdGFydDp4dFswXSwgZW5kOnh0WzFdIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWdobGlnaHRTdHJpcCAoZywgZWx0KSB7XG5cdGlmIChnID09PSB0aGlzLmN1cnJlbnRITEcpIHJldHVybjtcblx0dGhpcy5jdXJyZW50SExHID0gZztcblx0Ly9cblx0dGhpcy5zdmdNYWluLnNlbGVjdEFsbCgnLnpvb21TdHJpcCcpXG5cdCAgICAuY2xhc3NlZChcImhpZ2hsaWdodGVkXCIsIGQgPT4gZC5nZW5vbWUgPT09IGcpO1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0QWxsKCcuem9vbVN0cmlwSGFuZGxlJylcblx0ICAgIC5jbGFzc2VkKFwiaGlnaGxpZ2h0ZWRcIiwgZCA9PiBkLmdlbm9tZSA9PT0gZyk7XG5cdHRoaXMuYXBwLnNob3dCbG9ja3MoZyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyB0aGUgWm9vbVZpZXcgdG8gc2hvdyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSByZWcgZ2Vub21lIGFuZCB0aGUgY29ycmVzcG9uZGluZ1xuICAgIC8vIHJhbmdlKHMpIGluIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy9cbiAgICB1cGRhdGVWaWFNYXBwZWRDb29yZGluYXRlcyAoY29vcmRzKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0bGV0IGMgPSAoY29vcmRzIHx8IHRoaXMuYXBwLmNvb3Jkcyk7XG5cdGQzLnNlbGVjdChcIiN6b29tQ29vcmRzXCIpWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCk7XG5cdGQzLnNlbGVjdChcIiN6b29tV1NpemVcIilbMF1bMF0udmFsdWUgPSBNYXRoLnJvdW5kKGMuZW5kIC0gYy5zdGFydCArIDEpXG5cdC8vXG4gICAgICAgIGxldCBtZ3YgPSB0aGlzLmFwcDtcblx0Ly8gd2hlbiB0aGUgdHJhbnNsYXRvciBpcyByZWFkeSwgd2UgY2FuIHRyYW5zbGF0ZSB0aGUgcmVmIGNvb3JkcyB0byBlYWNoIGdlbm9tZSBhbmRcblx0Ly8gaXNzdWUgcmVxdWVzdHMgdG8gbG9hZCB0aGUgZmVhdHVyZXMgaW4gdGhvc2UgcmVnaW9ucy5cblx0cmV0dXJuIG1ndi50cmFuc2xhdG9yLnJlYWR5KCkudGhlbihmdW5jdGlvbigpe1xuXHQgICAgLy8gTm93IGlzc3VlIHJlcXVlc3RzIGZvciBmZWF0dXJlcy4gT25lIHJlcXVlc3QgcGVyIGdlbm9tZSwgZWFjaCByZXF1ZXN0IHNwZWNpZmllcyBvbmUgb3IgbW9yZVxuXHQgICAgLy8gY29vcmRpbmF0ZSByYW5nZXMuXG5cdCAgICAvLyBXYWl0IGZvciBhbGwgdGhlIGRhdGEgdG8gYmVjb21lIGF2YWlsYWJsZSwgdGhlbiBkcmF3LlxuXHQgICAgLy9cblx0ICAgIGxldCBwcm9taXNlcyA9IFtdO1xuXG5cdCAgICAvLyBGaXJzdCByZXF1ZXN0IGlzIGZvciB0aGUgdGhlIHJlZmVyZW5jZSBnZW5vbWUuIEdldCBhbGwgdGhlIGZlYXR1cmVzIGluIHRoZSByYW5nZS5cblx0ICAgIHByb21pc2VzLnB1c2gobWd2LmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzKG1ndi5yR2Vub21lLCBbe1xuXHRcdC8vIE5lZWQgdG8gc2ltdWxhdGUgdGhlIHJlc3VsdHMgZnJvbSBjYWxsaW5nIHRoZSB0cmFuc2xhdG9yLiBcblx0XHQvLyBcblx0XHRjaHIgICAgOiBjLmNocixcblx0XHRzdGFydCAgOiBjLnN0YXJ0LFxuXHRcdGVuZCAgICA6IGMuZW5kLFxuXHRcdGluZGV4ICA6IDAsXG5cdFx0ZkNociAgIDogYy5jaHIsXG5cdFx0ZlN0YXJ0IDogYy5zdGFydCxcblx0XHRmRW5kICAgOiBjLmVuZCxcblx0XHRmSW5kZXggIDogMCxcblx0XHRvcmkgICAgOiBcIitcIixcblx0XHRibG9ja0lkOiBtZ3Yuckdlbm9tZS5uYW1lXG5cdFx0fV0pKTtcblx0ICAgIGlmICghIHNlbGYucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIpKSB7XG5cdFx0Ly8gQWRkIGEgcmVxdWVzdCBmb3IgZWFjaCBjb21wYXJpc29uIGdlbm9tZSwgdXNpbmcgdHJhbnNsYXRlZCBjb29yZGluYXRlcy4gXG5cdFx0bWd2LmNHZW5vbWVzLmZvckVhY2goY0dlbm9tZSA9PiB7XG5cdFx0ICAgIGxldCByYW5nZXMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUoIG1ndi5yR2Vub21lLCBjLmNociwgYy5zdGFydCwgYy5lbmQsIGNHZW5vbWUgKTtcblx0XHQgICAgbGV0IHAgPSBtZ3YuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXMoY0dlbm9tZSwgcmFuZ2VzKTtcblx0XHQgICAgcHJvbWlzZXMucHVzaChwKTtcblx0XHR9KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcblx0fSk7XG4gICAgfVxuICAgIC8vIFVwZGF0ZXMgdGhlIFpvb21WaWV3IHRvIHNob3cgdGhlIHJlZ2lvbiBhcm91bmQgYSBsYW5kbWFyayBpbiBlYWNoIGdlbm9tZS5cbiAgICAvL1xuICAgIC8vIGNvb3JkcyA9IHtcbiAgICAvLyAgICAgbGFuZG1hcmsgOiBpZCBvZiBhIGZlYXR1cmUgdG8gdXNlIGFzIGEgcmVmZXJlbmNlXG4gICAgLy8gICAgIGZsYW5rfHdpZHRoIDogc3BlY2lmeSBvbmUgb2YgZmxhbmsgb3Igd2lkdGguIFxuICAgIC8vICAgICAgICAgZmxhbmsgPSBhbW91bnQgb2YgZmxhbmtpbmcgcmVnaW9uIChicCkgdG8gaW5jbHVkZSBhdCBib3RoIGVuZHMgb2YgdGhlIGxhbmRtYXJrLCBcbiAgICAvLyAgICAgICAgIHNvIHRoZSB0b3RhbCB2aWV3aW5nIHJlZ2lvbiA9IGZsYW5rICsgbGVuZ3RoKGxhbmRtYXJrKSArIGZsYW5rLlxuICAgIC8vICAgICAgICAgd2lkdGggPSB0b3RhbCB2aWV3aW5nIHJlZ2lvbiB3aWR0aC4gSWYgYm90aCB3aWR0aCBhbmQgZmxhbmsgYXJlIHNwZWNpZmllZCwgZmxhbmsgaXMgaWdub3JlZC5cbiAgICAvLyAgICAgZGVsdGEgOiBhbW91bnQgdG8gc2hpZnQgdGhlIHZpZXcgbGVmdC9yaWdodFxuICAgIC8vIH1cbiAgICAvLyBcbiAgICAvLyBUaGUgbGFuZG1hcmsgbXVzdCBleGlzdCBpbiB0aGUgY3VycmVudCByZWZlcmVuY2UgZ2Vub21lLiBcbiAgICAvL1xuICAgIHVwZGF0ZVZpYUxhbmRtYXJrQ29vcmRpbmF0ZXMgKGNvb3Jkcykge1xuXHRsZXQgYyA9IGNvb3Jkcztcblx0bGV0IG1ndiA9IHRoaXMuYXBwO1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCByZiA9IGNvb3Jkcy5sYW5kbWFya1JlZkZlYXQ7XG5cdGxldCBmZWF0cyA9IGNvb3Jkcy5sYW5kbWFya0ZlYXRzO1xuXHRpZiAodGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgZmVhdHMgPSBmZWF0cy5maWx0ZXIoZiA9PiBmLmdlbm9tZSA9PT0gdGhpcy5hcHAuckdlbm9tZSk7XG5cdGxldCBkZWx0YSA9IGNvb3Jkcy5kZWx0YSB8fCAwO1xuXHQvLyBjb21wdXRlIHJhbmdlcyBhcm91bmQgbGFuZG1hcmsgaW4gZWFjaCBnZW5vbWVcblx0bGV0IHJhbmdlcyA9IGZlYXRzLm1hcChmID0+IHtcblx0ICAgIGxldCBmbGFuayA9IGMubGVuZ3RoID8gKGMubGVuZ3RoIC0gZi5sZW5ndGgpIC8gMiA6IGMuZmxhbms7XG5cdCAgICBsZXQgY2xlbmd0aCA9IGYuZ2Vub21lLmdldENocm9tb3NvbWUoZi5jaHIpLmxlbmd0aDtcblx0ICAgIGxldCB3ICAgICA9IGMubGVuZ3RoID8gYy5sZW5ndGggOiAoZi5sZW5ndGggKyAyKmZsYW5rKTtcblx0ICAgIGxldCBzdGFydCA9IGNsaXAoTWF0aC5yb3VuZChkZWx0YSArIGYuc3RhcnQgLSBmbGFuayksIDEsIGNsZW5ndGgpO1xuXHQgICAgbGV0IGVuZCAgID0gY2xpcChNYXRoLnJvdW5kKHN0YXJ0ICsgdyksIHN0YXJ0LCBjbGVuZ3RoKVxuXHQgICAgbGV0IHJhbmdlID0ge1xuXHRcdGdlbm9tZTpcdGYuZ2Vub21lLFxuXHRcdGNocjpcdGYuY2hyLFxuXHRcdHN0YXJ0Olx0c3RhcnQsXG5cdFx0ZW5kOlx0ZW5kXG5cdCAgICB9IDtcblx0ICAgIGlmIChmLmdlbm9tZSA9PT0gbWd2LnJHZW5vbWUpIHtcblx0XHRsZXQgYyA9IHRoaXMuYXBwLmNvb3JkcyA9IHJhbmdlO1xuXHRcdGQzLnNlbGVjdChcIiN6b29tQ29vcmRzXCIpWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCk7XG5cdFx0ZDMuc2VsZWN0KFwiI3pvb21XU2l6ZVwiKVswXVswXS52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSlcblx0ICAgIH1cblx0ICAgIHJldHVybiByYW5nZTtcblx0fSk7XG5cdGxldCBzZWVuR2Vub21lcyA9IG5ldyBTZXQoKTtcblx0bGV0IHJDb29yZHM7XG5cdC8vIEdldCAocHJvbWlzZXMgZm9yKSB0aGUgZmVhdHVyZXMgaW4gZWFjaCByYW5nZS5cblx0bGV0IHByb21pc2VzID0gcmFuZ2VzLm1hcChyID0+IHtcbiAgICAgICAgICAgIGxldCBycnM7XG5cdCAgICBzZWVuR2Vub21lcy5hZGQoci5nZW5vbWUpO1xuXHQgICAgaWYgKHIuZ2Vub21lID09PSBtZ3Yuckdlbm9tZSl7XG5cdFx0Ly8gdGhlIHJlZiBnZW5vbWUgcmFuZ2Vcblx0XHRyQ29vcmRzID0gcjtcblx0ICAgICAgICBycnMgPSBbe1xuXHRcdCAgICBjaHIgICAgOiByLmNocixcblx0XHQgICAgc3RhcnQgIDogci5zdGFydCxcblx0XHQgICAgZW5kICAgIDogci5lbmQsXG5cdFx0ICAgIGluZGV4ICA6IDAsXG5cdFx0ICAgIGZDaHIgICA6IHIuY2hyLFxuXHRcdCAgICBmU3RhcnQgOiByLnN0YXJ0LFxuXHRcdCAgICBmRW5kICAgOiByLmVuZCxcblx0XHQgICAgZkluZGV4ICA6IDAsXG5cdFx0ICAgIG9yaSAgICA6IFwiK1wiLFxuXHRcdCAgICBibG9ja0lkOiBtZ3Yuckdlbm9tZS5uYW1lXG5cdFx0fV07XG5cdCAgICB9XG5cdCAgICBlbHNlIHsgXG5cdFx0Ly8gdHVybiB0aGUgc2luZ2xlIHJhbmdlIGludG8gYSByYW5nZSBmb3IgZWFjaCBvdmVybGFwcGluZyBzeW50ZW55IGJsb2NrIHdpdGggdGhlIHJlZiBnZW5vbWVcblx0ICAgICAgICBycnMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUoci5nZW5vbWUsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgbWd2LnJHZW5vbWUsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhyLmdlbm9tZSwgcnJzKTtcblx0fSk7XG5cdC8vIEZvciBlYWNoIGdlbm9tZSB3aGVyZSB0aGUgbGFuZG1hcmsgZG9lcyBub3QgZXhpc3QsIGNvbXB1dGUgYSBtYXBwZWQgcmFuZ2UgKGFzIGluIG1hcHBlZCBjbW9kZSkuXG5cdGlmICghdGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgbWd2LmNHZW5vbWVzLmZvckVhY2goZyA9PiB7XG5cdFx0aWYgKCEgc2Vlbkdlbm9tZXMuaGFzKGcpKSB7XG5cdFx0ICAgIGxldCBycnMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUobWd2LnJHZW5vbWUsIHJDb29yZHMuY2hyLCByQ29vcmRzLnN0YXJ0LCByQ29vcmRzLmVuZCwgZyk7XG5cdFx0ICAgIHByb21pc2VzLnB1c2goIG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhnLCBycnMpICk7XG5cdFx0fVxuXHQgICAgfSk7XG5cdC8vIFdoZW4gYWxsIHRoZSBkYXRhIGlzIHJlYWR5LCBkcmF3LlxuXHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH1cbiAgICAvL1xuICAgIHVwZGF0ZSAoKSB7XG5cdGxldCBwO1xuXHRpZiAodGhpcy5hcHAuY21vZGUgPT09ICdtYXBwZWQnKVxuXHQgICAgcCA9IHRoaXMudXBkYXRlVmlhTWFwcGVkQ29vcmRpbmF0ZXModGhpcy5hcHAuY29vcmRzKTtcblx0ZWxzZVxuXHQgICAgcCA9IHRoaXMudXBkYXRlVmlhTGFuZG1hcmtDb29yZGluYXRlcyh0aGlzLmFwcC5sY29vcmRzKTtcblx0cC50aGVuKCBkYXRhID0+IHtcblx0ICAgIHRoaXMuZHJhdyhkYXRhKTtcblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgb3JkZXJTQmxvY2tzIChzYmxvY2tzKSB7XG5cdC8vIFNvcnQgdGhlIHNibG9ja3MgaW4gZWFjaCBzdHJpcCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgZHJhd2luZyBtb2RlLlxuXHRsZXQgY21wRmllbGQgPSB0aGlzLmRtb2RlID09PSAnY29tcGFyaXNvbicgPyAnaW5kZXgnIDogJ2ZJbmRleCc7XG5cdGxldCBjbXBGdW5jID0gKGEsYikgPT4gYS5fX2RhdGFfX1tjbXBGaWVsZF0tYi5fX2RhdGFfX1tjbXBGaWVsZF07XG5cdHNibG9ja3MuZm9yRWFjaCggc3RyaXAgPT4gc3RyaXAuc29ydCggY21wRnVuYyApICk7XG5cdC8vIHBpeGVscyBwZXIgYmFzZVxuXHR0aGlzLnBwYiA9IHRoaXMud2lkdGggLyAodGhpcy5hcHAuY29vcmRzLmVuZCAtIHRoaXMuYXBwLmNvb3Jkcy5zdGFydCArIDEpO1xuXHRsZXQgcHN0YXJ0ID0gW107IC8vIG9mZnNldCAoaW4gcGl4ZWxzKSBvZiBzdGFydCBwb3NpdGlvbiBvZiBuZXh0IGJsb2NrLCBieSBzdHJpcCBpbmRleCAoMD09PXJlZilcblx0bGV0IGJzdGFydCA9IFtdOyAvLyBibG9jayBzdGFydCBwb3MgKGluIGJwKSBhc3NvYyB3aXRoIHBzdGFydFxuXHRsZXQgY2NociA9IG51bGw7XG5cdGxldCBzZWxmID0gdGhpcztcblx0bGV0IGR4O1xuXHRsZXQgcGVuZDtcblx0c2Jsb2Nrcy5lYWNoKCBmdW5jdGlvbiAoYixpLGopIHsgLy8gYj1ibG9jaywgaT1pbmRleCB3aXRoaW4gc3RyaXAsIGo9c3RyaXAgaW5kZXhcblx0ICAgIGxldCBibGVuID0gc2VsZi5wcGIgKiAoYi5lbmQgLSBiLnN0YXJ0ICsgMSk7IC8vIHRvdGFsIHNjcmVlbiB3aWR0aCBvZiB0aGlzIHNibG9ja1xuXHQgICAgYi5mbGlwID0gYi5vcmkgPT09ICctJyAmJiBzZWxmLmRtb2RlID09PSAncmVmZXJlbmNlJztcblx0ICAgIGIueHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFtiLnN0YXJ0LCBiLmVuZF0pLnJhbmdlKCBiLmZsaXAgPyBbYmxlbiwgMF0gOiBbMCwgYmxlbl0gKTtcblx0ICAgIC8vXG5cdCAgICBpZiAoaT09PTApIHtcblx0XHQvLyBmaXJzdCBibG9jayBpbiBlYWNoIHN0cmlwIGluaXRzXG5cdFx0cHN0YXJ0W2pdID0gMDtcblx0XHRic3RhcnRbal0gPSBiLnN0YXJ0O1xuXHRcdGR4ID0gMDtcblx0XHRjY2hyID0gYi5jaHI7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRkeCA9IGIuY2hyID09PSBjY2hyID8gcHN0YXJ0W2pdICsgc2VsZi5wcGIgKiAoYi5zdGFydCAtIGJzdGFydFtqXSkgOiBJbmZpbml0eTtcblx0XHRpZiAoZHggPCAwIHx8IGR4ID4gc2VsZi5tYXhTQmdhcCkge1xuXHRcdCAgICAvLyBDaGFuZ2VkIGNociBvciBqdW1wZWQgYSBsYXJnZSBnYXBcblx0XHQgICAgcHN0YXJ0W2pdID0gcGVuZCArIDE2O1xuXHRcdCAgICBic3RhcnRbal0gPSBiLnN0YXJ0O1xuXHRcdCAgICBkeCA9IHBzdGFydFtqXTtcblx0XHQgICAgY2NociA9IGIuY2hyO1xuXHRcdH1cblx0ICAgIH1cblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHtkeH0sMClgKTtcblx0ICAgIHBlbmQgPSBkeCArIGJsZW47XG5cdH0pO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgbWVyZ2VTYmxvY2tSdW5zIChkYXRhKSB7XG5cdC8vIC0tLS0tXG5cdC8vIFJlZHVjZXIgZnVuY3Rpb24uIFdpbGwgYmUgY2FsbGVkIHdpdGggdGhlc2UgYXJnczpcblx0Ly8gICBuYmxja3MgKGxpc3QpIE5ldyBibG9ja3MuIChjdXJyZW50IGFjY3VtdWxhdG9yIHZhbHVlKVxuXHQvLyAgIFx0QSBsaXN0IG9mIGxpc3RzIG9mIHN5bnRlbnkgYmxvY2tzLlxuXHQvLyAgIGJsayAoc3ludGVueSBibG9jaykgdGhlIGN1cnJlbnQgc3ludGVueSBibG9ja1xuXHQvLyAgIGkgKGludCkgVGhlIGl0ZXJhdGlvbiBjb3VudC5cblx0Ly8gUmV0dXJuczpcblx0Ly8gICBsaXN0IG9mIGxpc3RzIG9mIGJsb2Nrc1xuXHRsZXQgbWVyZ2VyID0gKG5ibGtzLCBiLCBpKSA9PiB7XG5cdCAgICBsZXQgaW5pdEJsayA9IGZ1bmN0aW9uIChiYikge1xuXHRcdGxldCBuYiA9IE9iamVjdC5hc3NpZ24oe30sIGJiKTtcblx0XHRuYi5zdXBlckJsb2NrID0gdHJ1ZTtcblx0XHRuYi5mZWF0dXJlcyA9IGJiLmZlYXR1cmVzLmNvbmNhdCgpO1xuXHRcdG5iLnNibG9ja3MgPSBbYmJdO1xuXHRcdG5iLm9yaSA9ICcrJztcblx0XHRyZXR1cm4gbmI7XG5cdCAgICB9O1xuXHQgICAgaWYgKGkgPT09IDApe1xuXHRcdG5ibGtzLnB1c2goaW5pdEJsayhiKSk7XG5cdFx0cmV0dXJuIG5ibGtzO1xuXHQgICAgfVxuXHQgICAgbGV0IGxhc3RCbGsgPSBuYmxrc1tuYmxrcy5sZW5ndGggLSAxXTtcblx0ICAgIGlmIChiLmNociAhPT0gbGFzdEJsay5jaHIgfHwgYi5pbmRleCAtIGxhc3RCbGsuaW5kZXggIT09IDEpIHtcblx0ICAgICAgICBuYmxrcy5wdXNoKGluaXRCbGsoYikpO1xuXHRcdHJldHVybiBuYmxrcztcblx0ICAgIH1cblx0ICAgIC8vIG1lcmdlXG5cdCAgICBsYXN0QmxrLmluZGV4ID0gYi5pbmRleDtcblx0ICAgIGxhc3RCbGsuZW5kID0gYi5lbmQ7XG5cdCAgICBsYXN0QmxrLmJsb2NrRW5kID0gYi5ibG9ja0VuZDtcblx0ICAgIGxhc3RCbGsuZmVhdHVyZXMgPSBsYXN0QmxrLmZlYXR1cmVzLmNvbmNhdChiLmZlYXR1cmVzKTtcblx0ICAgIGxldCBsYXN0U2IgPSBsYXN0QmxrLnNibG9ja3NbbGFzdEJsay5zYmxvY2tzLmxlbmd0aCAtIDFdO1xuXHQgICAgbGV0IGQgPSBiLnN0YXJ0IC0gbGFzdFNiLmVuZDtcblx0ICAgIGxhc3RTYi5lbmQgKz0gZC8yO1xuXHQgICAgYi5zdGFydCAtPSBkLzI7XG5cdCAgICBsYXN0QmxrLnNibG9ja3MucHVzaChiKTtcblx0ICAgIHJldHVybiBuYmxrcztcblx0fTtcblx0Ly8gLS0tLS1cbiAgICAgICAgZGF0YS5mb3JFYWNoKChnZGF0YSxpKSA9PiB7XG5cdCAgICBnZGF0YS5ibG9ja3Muc29ydCggKGEsYikgPT4gYS5pbmRleCAtIGIuaW5kZXggKTtcblx0ICAgIGdkYXRhLmJsb2NrcyA9IGdkYXRhLmJsb2Nrcy5yZWR1Y2UobWVyZ2VyLFtdKTtcblx0ICAgIC8qXG5cdCAgICAvLyBmaXJzdCBzb3J0IGJ5IHJlZiBnZW5vbWUgb3JkZXJcblx0ICAgIGdkYXRhLmJsb2Nrcy5zb3J0KCAoYSxiKSA9PiBhLmZJbmRleCAtIGIuZkluZGV4ICk7XG5cdCAgICAvLyBTdWItZ3JvdXAgaW50byBydW5zIG9mIHNhbWUgY29tcCBnZW5vbWUgY2hyb21vc29tZS5cbiAgICAgICAgICAgIGxldCB0bXAgPSBnZGF0YS5ibG9ja3MucmVkdWNlKChuYnMsIGIsIGkpID0+IHtcblx0ICAgICAgICBpZiAoaSA9PT0gMCB8fCBuYnNbbmJzLmxlbmd0aCAtIDFdWzBdLmNociAhPT0gYi5jaHIpXG5cdFx0ICAgIG5icy5wdXNoKFtiXSk7XG5cdFx0ZWxzZVxuXHRcdCAgICBuYnNbbmJzLmxlbmd0aCAtIDFdLnB1c2goYik7XG5cdFx0cmV0dXJuIG5icztcblx0ICAgIH0sIFtdKTtcblx0ICAgIC8vIFNvcnQgZWFjaCBzdWJncm91cCBpbnRvIGNvbXBhcmlzb24gZ2Vub21lIG9yZGVyXG5cdCAgICB0bXAuZm9yRWFjaCggc3ViZ3JwID0+IHN1YmdycC5zb3J0KChhLGIpID0+IGEuaW5kZXggLSBiLmluZGV4KSApO1xuXHQgICAgLy8gRmxhdHRlbiB0aGUgbGlzdFxuXHQgICAgdG1wID0gdG1wLnJlZHVjZSgobHN0LCBjdXJyKSA9PiBsc3QuY29uY2F0KGN1cnIpLCBbXSk7XG4gICAgICAgICAgICAvLyBOb3cgY3JlYXRlIHRoZSBzdXBlcmdyb3Vwcy5cblx0ICAgIGdkYXRhLmJsb2NrcyA9IHRtcC5yZWR1Y2UobWVyZ2VyLFtdKTtcblx0ICAgICovXG5cdH0pO1xuXHRyZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIHVuaXFpZnlCbG9ja3MgKGJsb2Nrcykge1xuXHQvLyBoZWxwZXIgZnVuY3Rpb24uIFdoZW4gc2Jsb2NrIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIGdlbm9tZXMgaXMgY29uZnVzZWQsIHJlcXVlc3Rpbmcgb25lXG5cdC8vIHJlZ2lvbiBpbiBnZW5vbWUgQSBjYW4gZW5kIHVwIHJlcXVlc3RpbmcgdGhlIHNhbWUgcmVnaW9uIGluIGdlbm9tZSBCIG11bHRpcGxlIHRpbWVzLlxuXHQvLyBUaGlzIGZ1bmN0aW9uIGF2b2lkcyBkcmF3aW5nIHRoZSBzYW1lIHNibG9jayB0d2ljZS4gKE5COiBSZWFsbHkgbm90IHN1cmUgd2hlcmUgdGhpcyBcblx0Ly8gY2hlY2sgaXMgYmVzdCBkb25lLiBDb3VsZCBwdXNoIGl0IGZhcnRoZXIgdXBzdHJlYW0uKVxuXHRsZXQgc2VlbiA9IG5ldyBTZXQoKTtcblx0cmV0dXJuIGJsb2Nrcy5maWx0ZXIoIGIgPT4geyBcblx0ICAgIGlmIChzZWVuLmhhcyhiLmluZGV4KSkgcmV0dXJuIGZhbHNlO1xuXHQgICAgc2Vlbi5hZGQoYi5pbmRleCk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fSk7XG4gICAgfTtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBcHBsaWVzIHNldmVyYWwgdHJhbnNmb3JtYXRpb24gc3RlcHMgb24gdGhlIGRhdGEgYXMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlciB0byBwcmVwYXJlIGZvciBkcmF3aW5nLlxuICAgIC8vIElucHV0IGRhdGEgaXMgc3RydWN0dXJlZCBhcyBmb2xsb3dzOlxuICAgIC8vICAgICBkYXRhID0gWyB6b29tU3RyaXBfZGF0YSBdXG4gICAgLy8gICAgIHpvb21TdHJpcF9kYXRhID0geyBnZW5vbWUgWyB6b29tQmxvY2tfZGF0YSBdIH1cbiAgICAvLyAgICAgem9vbUJsb2NrX2RhdGEgPSB7IHhzY2FsZSwgY2hyLCBzdGFydCwgZW5kLCBpbmRleCwgZkNociwgZlN0YXJ0LCBmRW5kLCBmSW5kZXgsIG9yaSwgWyBmZWF0dXJlX2RhdGEgXSB9XG4gICAgLy8gICAgIGZlYXR1cmVfZGF0YSA9IHsgbWdwaWQsIG1naWlkLCBzeW1ib2wsIGNociwgc3RhcnQsIGVuZCwgc3RyYW5kLCB0eXBlLCBiaW90eXBlIH1cbiAgICAvL1xuICAgIC8vIEFnYWluLCBpbiBFbmdsaXNoOlxuICAgIC8vICAtIGRhdGEgaXMgYSBsaXN0IG9mIGl0ZW1zLCBvbmUgcGVyIHN0cmlwIHRvIGJlIGRpc3BsYXllZC4gSXRlbVswXSBpcyBkYXRhIGZvciB0aGUgcmVmIGdlbm9tZS5cbiAgICAvLyAgICBJdGVtc1sxK10gYXJlIGRhdGEgZm9yIHRoZSBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvLyAgLSBlYWNoIHN0cmlwIGl0ZW0gaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBnZW5vbWUgYW5kIGEgbGlzdCBvZiBibG9ja3MuIEl0ZW1bMF0gYWx3YXlzIGhhcyBcbiAgICAvLyAgICBhIHNpbmdsZSBibG9jay5cbiAgICAvLyAgLSBlYWNoIGJsb2NrIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGEgY2hyb21vc29tZSwgc3RhcnQsIGVuZCwgb3JpZW50YXRpb24sIGV0YywgYW5kIGEgbGlzdCBvZiBmZWF0dXJlcy5cbiAgICAvLyAgLSBlYWNoIGZlYXR1cmUgaGFzIGNocixzdGFydCxlbmQsc3RyYW5kLHR5cGUsYmlvdHlwZSxtZ3BpZFxuICAgIC8vXG4gICAgLy8gQmVjYXVzZSBTQmxvY2tzIGNhbiBiZSB2ZXJ5IGZyYWdtZW50ZWQsIG9uZSBjb250aWd1b3VzIHJlZ2lvbiBpbiB0aGUgcmVmIGdlbm9tZSBjYW4gdHVybiBpbnRvIFxuICAgIC8vIGEgYmF6aWxsaW9uIHRpbnkgYmxvY2tzIGluIHRoZSBjb21wYXJpc29uLiBUaGUgcmVzdWx0aW5nIHJlbmRlcmluZyBpcyBqYXJyaW5nIGFuZCB1bnVzYWJsZS5cbiAgICAvLyBUaGUgZHJhd2luZyByb3V0aW5lIG1vZGlmaWVzIHRoZSBkYXRhIGJ5IG1lcmdpbmcgcnVucyBvZiBjb25zZWN1dGl2ZSBibG9ja3MgaW4gZWFjaCBjb21wIGdlbm9tZS5cbiAgICAvLyBUaGUgZGF0YSBjaGFuZ2UgaXMgdG8gaW5zZXJ0IGEgZ3JvdXBpbmcgbGF5ZXIgb24gdG9wIG9mIHRoZSBzYmxvY2tzLCBzcGVjaWZpY2FsbHksIFxuICAgIC8vICAgICB6b29tU3RyaXBfZGF0YSA9IHsgZ2Vub21lIFsgem9vbUJsb2NrX2RhdGEgXSB9XG4gICAgLy8gYmVjb21lc1xuICAgIC8vICAgICB6b29tU3RyaXBfZGF0YSA9IHsgZ2Vub21lIFsgem9vbVN1cGVyQmxvY2tfZGF0YSBdIH1cbiAgICAvLyAgICAgem9vbVN1cGVyQmxvY2tfZGF0YSA9IHsgY2hyIHN0YXJ0IGVuZCBibG9ja3MgWyB6b29tQmxvY2tfZGF0YSBdIH1cbiAgICAvL1xuICAgIG11bmdlRGF0YSAoZGF0YSkge1xuICAgICAgICBkYXRhLmZvckVhY2goZ0RhdGEgPT4gZ0RhdGEuYmxvY2tzID0gdGhpcy51bmlxaWZ5QmxvY2tzKGdEYXRhLmJsb2NrcykpO1xuXHRkYXRhID0gdGhpcy5tZXJnZVNibG9ja1J1bnMoZGF0YSk7XG5cdHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSB6b29tIHZpZXcgcGFuZWwgd2l0aCB0aGUgZ2l2ZW4gZGF0YS5cbiAgICAvL1xuICAgIGRyYXcgKGRhdGEpIHtcbiAgICAgICAgZGF0YSA9IHRoaXMubXVuZ2VEYXRhKGRhdGEpO1xuXHQvLyBcblx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdGxldCBjbG9zZWQgPSB0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiKTtcblxuXHQvLyByZXNldCB0aGUgc3ZnIHNpemUgYmFzZWQgb24gbnVtYmVyIG9mIHN0cmlwc1xuXHRsZXQgdG90YWxIZWlnaHQgPSAodGhpcy5zdHJpcEhlaWdodCt0aGlzLnN0cmlwR2FwKSAqIGRhdGEubGVuZ3RoICsgMjA7XG5cdHRoaXMuc3ZnXG5cdCAgICAuYXR0cihcImhlaWdodFwiLCB0b3RhbEhlaWdodCk7XG5cblx0Ly8gRHJhdyB0aGUgdGl0bGUgb24gdGhlIHpvb212aWV3IHBvc2l0aW9uIGNvbnRyb2xzXG5cdGQzLnNlbGVjdChcIiN6b29tVmlldyAuem9vbUNvb3JkcyBsYWJlbFwiKVxuXHQgICAgLnRleHQodGhpcy5hcHAuckdlbm9tZS5sYWJlbCArIFwiIGNvb3Jkc1wiKTtcblx0XG5cdC8vIHRoZSByZWZlcmVuY2UgZ2Vub21lIGJsb2NrIChhbHdheXMganVzdCAxIG9mIHRoZXNlKS5cblx0bGV0IHJEYXRhID0gZGF0YS5maWx0ZXIoZGQgPT4gZGQuZ2Vub21lID09PSB0aGlzLmFwcC5yR2Vub21lKVswXTtcblx0bGV0IHJCbG9jayA9IHJEYXRhLmJsb2Nrc1swXTtcblxuXHQvLyB4LXNjYWxlIGFuZCB4LWF4aXMgYmFzZWQgb24gdGhlIHJlZiBnZW5vbWUgZGF0YS5cblx0dGhpcy54c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHQgICAgLmRvbWFpbihbckJsb2NrLnN0YXJ0LHJCbG9jay5lbmRdKVxuXHQgICAgLnJhbmdlKFswLHRoaXMud2lkdGhdKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBkcmF3IHRoZSBjb29yZGluYXRlIGF4aXNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0dGhpcy5heGlzRnVuYyA9IGQzLnN2Zy5heGlzKClcblx0ICAgIC5zY2FsZSh0aGlzLnhzY2FsZSlcblx0ICAgIC5vcmllbnQoXCJ0b3BcIilcblx0ICAgIC5vdXRlclRpY2tTaXplKDIpXG5cdCAgICAudGlja3MoNSlcblx0ICAgIC50aWNrU2l6ZSg1KVxuXHQgICAgO1xuXHR0aGlzLmF4aXMuY2FsbCh0aGlzLmF4aXNGdW5jKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyB6b29tIHN0cmlwcyAob25lIHBlciBnZW5vbWUpXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGxldCB6c3RyaXBzID0gdGhpcy5zdHJpcHNHcnBcblx0ICAgICAgICAuc2VsZWN0QWxsKFwiZy56b29tU3RyaXBcIilcblx0XHQuZGF0YShkYXRhLCBkID0+IGQuZ2Vub21lLm5hbWUpO1xuXHQvLyBDcmVhdGUgdGhlIGdyb3VwXG5cdGxldCBuZXd6cyA9IHpzdHJpcHMuZW50ZXIoKVxuXHQgICAgICAgIC5hcHBlbmQoXCJnXCIpXG5cdFx0LmF0dHIoXCJjbGFzc1wiLFwiem9vbVN0cmlwXCIpXG5cdFx0LmF0dHIoXCJuYW1lXCIsIGQgPT4gZC5nZW5vbWUubmFtZSlcblx0XHQub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZykge1xuXHRcdCAgICBzZWxmLmhpZ2hsaWdodFN0cmlwKGcuZ2Vub21lLCB0aGlzKTtcblx0XHR9KVxuXHRcdC5jYWxsKHRoaXMuZHJhZ2dlcilcblx0XHQ7XG5cdC8vXG5cdC8vIFN0cmlwIGxhYmVsXG5cdG5ld3pzLmFwcGVuZChcInRleHRcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBcImdlbm9tZUxhYmVsXCIpXG5cdCAgICAudGV4dCggZCA9PiBkLmdlbm9tZS5sYWJlbClcblx0ICAgIC5hdHRyKFwieFwiLCAwKVxuXHQgICAgLmF0dHIoXCJ5XCIsIHRoaXMuYmxvY2tIZWlnaHQvMiArIDIwKVxuXHQgICAgLmF0dHIoXCJmb250LWZhbWlseVwiLFwic2Fucy1zZXJpZlwiKVxuXHQgICAgLmF0dHIoXCJmb250LXNpemVcIiwgMTApXG5cdCAgICA7XG5cblx0bmV3enMuYXBwZW5kKFwiZ1wiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIFwic0Jsb2Nrc1wiKTtcblx0bmV3enMuYXBwZW5kKFwicmVjdFwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIFwiem9vbVN0cmlwSGFuZGxlXCIpXG5cdCAgICAuYXR0cihcInhcIiwgLTE1KVxuXHQgICAgLmF0dHIoXCJ5XCIsIC10aGlzLmJsb2NrSGVpZ2h0IC8gMilcblx0ICAgIC5hdHRyKFwid2lkdGhcIiwgMTUpXG5cdCAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLmJsb2NrSGVpZ2h0KVxuXHQgICAgO1xuXHR6c3RyaXBzXG5cdCAgICAuY2xhc3NlZChcInJlZmVyZW5jZVwiLCBkID0+IGQuZ2Vub21lID09PSB0aGlzLmFwcC5yR2Vub21lKVxuXHQgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZyA9PiBgdHJhbnNsYXRlKDAsJHtjbG9zZWQgPyB0aGlzLnRvcE9mZnNldCA6IGcuZ2Vub21lLnpvb21ZfSlgKVxuXHQgICAgO1xuICAgICAgICB6c3RyaXBzLmV4aXQoKVxuXHQgICAgLm9uKFwiLmRyYWdcIiwgbnVsbClcblx0ICAgIC5yZW1vdmUoKTtcblx0Ly9cblx0dGhpcy5kZWx0YVggPSAwO1xuICAgICAgICB6c3RyaXBzLnNlbGVjdCgnZ1tuYW1lPVwic0Jsb2Nrc1wiXScpXG5cdCAgICAuYXR0cigndHJhbnNmb3JtJyxgdHJhbnNsYXRlKDAsMClgKTtcblx0Ly8gLS0tLSBTeW50ZW55IHN1cGVyIGJsb2NrcyAtLS0tXG4gICAgICAgIGxldCBzYmxvY2tzID0genN0cmlwcy5zZWxlY3QoJ1tuYW1lPVwic0Jsb2Nrc1wiXScpLnNlbGVjdEFsbCgnZy5zQmxvY2snKVxuXHQgICAgLmRhdGEoZD0+ZC5ibG9ja3MsIGIgPT4gYi5ibG9ja0lkKTtcblx0bGV0IG5ld3NicyA9IHNibG9ja3MuZW50ZXIoKVxuXHQgICAgLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJzQmxvY2tcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBiPT5iLmluZGV4KVxuXHQgICAgO1xuXHRsZXQgbDAgPSBuZXdzYnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLCBcImxheWVyMFwiKTtcblx0bGV0IGwxID0gbmV3c2JzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIiwgXCJsYXllcjFcIik7XG5cblx0Ly9cblx0dGhpcy5vcmRlclNCbG9ja3Moc2Jsb2Nrcyk7XG5cblx0Ly8gcmVjdGFuZ2xlIGZvciBlYWNoIGluZGl2aWR1YWwgc3ludGVueSBibG9ja1xuXHRsZXQgc2JyZWN0cyA9IHNibG9ja3Muc2VsZWN0KCdnW25hbWU9XCJsYXllcjBcIl0nKS5zZWxlY3RBbGwoJ3JlY3QuYmxvY2snKS5kYXRhKGQ9PiB7XG5cdCAgICBkLnNibG9ja3MuZm9yRWFjaChiPT5iLnhzY2FsZSA9IGQueHNjYWxlKTtcblx0ICAgIHJldHVybiBkLnNibG9ja3Ncblx0ICAgIH0sIHNiPT5zYi5pbmRleCk7XG4gICAgICAgIHNicmVjdHMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKSA7XG5cdHNicmVjdHMuZXhpdCgpLnJlbW92ZSgpO1xuXHRzYnJlY3RzXG5cdCAgIC5hdHRyKFwiY2xhc3NcIiwgYiA9PiBcImJsb2NrIFwiICsgXG5cdCAgICAgICAoYi5vcmk9PT1cIitcIiA/IFwicGx1c1wiIDogYi5vcmk9PT1cIi1cIiA/IFwibWludXNcIjogXCJjb25mdXNlZFwiKSArIFxuXHQgICAgICAgKGIuY2hyICE9PSBiLmZDaHIgPyBcIiB0cmFuc2xvY2F0aW9uXCIgOiBcIlwiKSlcblx0ICAgLmF0dHIoXCJ4XCIsICAgICBiID0+IGIueHNjYWxlKGIuZmxpcCA/IGIuZW5kIDogYi5zdGFydCkpXG5cdCAgIC5hdHRyKFwieVwiLCAgICAgYiA9PiAtdGhpcy5ibG9ja0hlaWdodCAvIDIpXG5cdCAgIC5hdHRyKFwid2lkdGhcIiwgYiA9PiBNYXRoLm1heCg0LCBNYXRoLmFicyhiLnhzY2FsZShiLmVuZCktYi54c2NhbGUoYi5zdGFydCkpKSlcblx0ICAgLmF0dHIoXCJoZWlnaHRcIix0aGlzLmJsb2NrSGVpZ2h0KTtcblx0ICAgO1xuXG5cdC8vIHRoZSBheGlzIGxpbmVcblx0bDAuYXBwZW5kKFwibGluZVwiKS5hdHRyKFwiY2xhc3NcIixcImF4aXNcIik7XG5cdFxuXHRzYmxvY2tzLnNlbGVjdChcImxpbmUuYXhpc1wiKVxuXHQgICAgLmF0dHIoXCJ4MVwiLCBiID0+IGIueHNjYWxlKGIuc3RhcnQpKVxuXHQgICAgLmF0dHIoXCJ5MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ4MlwiLCBiID0+IGIueHNjYWxlKGIuZW5kKSlcblx0ICAgIC5hdHRyKFwieTJcIiwgMClcblx0ICAgIDtcblx0Ly8gbGFiZWxcblx0bDAuYXBwZW5kKFwidGV4dFwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwiYmxvY2tMYWJlbFwiKSA7XG5cdC8vIGJydXNoXG5cdGwwLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsXCJicnVzaFwiKTtcblxuXHQvL1xuXHRzYmxvY2tzLmV4aXQoKS5yZW1vdmUoKTtcblxuXHQvLyBzeW50ZW55IGJsb2NrIGxhYmVsc1xuXHRzYmxvY2tzLnNlbGVjdChcInRleHQuYmxvY2tMYWJlbFwiKVxuXHQgICAgLnRleHQoIGIgPT4gYi5jaHIgKVxuXHQgICAgLmF0dHIoXCJ4XCIsIGIgPT4gKGIueHNjYWxlKGIuc3RhcnQpICsgYi54c2NhbGUoYi5lbmQpKS8yIClcblx0ICAgIC5hdHRyKFwieVwiLCB0aGlzLmJsb2NrSGVpZ2h0IC8gMiArIDEwKVxuXHQgICAgO1xuXG5cdC8vIGJydXNoXG5cdHNibG9ja3Muc2VsZWN0KFwiZy5icnVzaFwiKVxuXHQgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYiA9PiBgdHJhbnNsYXRlKDAsJHt0aGlzLmJsb2NrSGVpZ2h0IC8gMn0pYClcblx0ICAgIC5lYWNoKGZ1bmN0aW9uKGIpIHtcblx0XHRpZiAoIWIuYnJ1c2gpIHtcblx0XHQgICAgYi5icnVzaCA9IGQzLnN2Zy5icnVzaCgpXG5cdFx0XHQub24oXCJicnVzaHN0YXJ0XCIsIGZ1bmN0aW9uKCl7IHNlbGYuYmJTdGFydCggYiwgdGhpcyApOyB9KVxuXHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgICBmdW5jdGlvbigpeyBzZWxmLmJiRW5kKCBiLCB0aGlzICk7IH0pXG5cdFx0fVxuXHRcdGIuYnJ1c2gueChiLnhzY2FsZSkuY2xlYXIoKTtcblx0XHRkMy5zZWxlY3QodGhpcykuY2FsbChiLmJydXNoKTtcblx0ICAgIH0pXG5cdCAgICAuc2VsZWN0QWxsKFwicmVjdFwiKVxuXHRcdC5hdHRyKFwiaGVpZ2h0XCIsIDEwKTtcblxuXHR0aGlzLmRyYXdGZWF0dXJlcyhzYmxvY2tzKTtcblxuXHQvL1xuXHR0aGlzLmFwcC5mYWNldE1hbmFnZXIuYXBwbHlBbGwoKTtcblxuXHQvLyBXZSBuZWVkIHRvIGxldCB0aGUgdmlldyByZW5kZXIgYmVmb3JlIGRvaW5nIHRoZSBoaWdobGlnaHRpbmcsIHNpbmNlIGl0IGRlcGVuZHMgb25cblx0Ly8gdGhlIHBvc2l0aW9ucyBvZiByZWN0YW5nbGVzIGluIHRoZSBzY2VuZS5cblx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuXHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0fSwgNTApO1xuICAgIH07XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgZmVhdHVyZXMgKHJlY3RhbmdsZXMpIGZvciB0aGUgc3BlY2lmaWVkIHN5bnRlbnkgYmxvY2tzLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIHNibG9ja3MgKEQzIHNlbGVjdGlvbiBvZiBnLnNibG9jayBub2RlcykgLSBtdWx0aWxldmVsIHNlbGVjdGlvbi5cbiAgICAvLyAgICAgICAgQXJyYXkgKGNvcnJlc3BvbmRpbmcgdG8gc3RyaXBzKSBvZiBhcnJheXMgb2Ygc3ludGVueSBibG9ja3MuXG4gICAgLy9cbiAgICBkcmF3RmVhdHVyZXMgKHNibG9ja3MpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHQvL1xuXHQvLyBuZXZlciBkcmF3IHRoZSBzYW1lIGZlYXR1cmUgdHdpY2Vcblx0bGV0IGRyYXduID0gbmV3IFNldCgpO1x0Ly8gc2V0IG9mIG1ncGlkcyBvZiBkcmF3biBmZWF0dXJlc1xuXHRsZXQgZmlsdGVyRHJhd24gPSBmdW5jdGlvbiAoZikge1xuXHQgICAgLy8gcmV0dXJucyB0cnVlIGlmIHdlJ3ZlIG5vdCBzZWVuIHRoaXMgb25lIGJlZm9yZS5cblx0ICAgIC8vIHJlZ2lzdGVycyB0aGF0IHdlJ3ZlIHNlZW4gaXQuXG5cdCAgICBsZXQgZmlkID0gZi5tZ3BpZDtcblx0ICAgIGxldCB2ID0gISBkcmF3bi5oYXMoZmlkKTtcblx0ICAgIGRyYXduLmFkZChmaWQpO1xuXHQgICAgcmV0dXJuIHY7XG5cdH07XG5cdGxldCBmZWF0cyA9IHNibG9ja3Muc2VsZWN0KCdbbmFtZT1cImxheWVyMVwiXScpLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpXG5cdCAgICAuZGF0YShkPT5kLmZlYXR1cmVzLmZpbHRlcihmaWx0ZXJEcmF3biksIGQ9PmQubWdwaWQpO1xuXHRmZWF0cy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGxldCBuZXdGZWF0cyA9IGZlYXRzLmVudGVyKCkuYXBwZW5kKFwicmVjdFwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBmID0+IFwiZmVhdHVyZVwiICsgKGYuc3RyYW5kPT09XCItXCIgPyBcIiBtaW51c1wiIDogXCIgcGx1c1wiKSlcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBmID0+IGYubWdwaWQpXG5cdCAgICAuc3R5bGUoXCJmaWxsXCIsIGYgPT4gc2VsZi5hcHAuY3NjYWxlKGYuZ2V0TXVuZ2VkVHlwZSgpKSlcblx0ICAgIDtcblxuXHQvLyBkcmF3IHRoZSByZWN0YW5nbGVzXG5cblx0Ly8gcmV0dXJucyB0aGUgc3ludGVueSBibG9jayBjb250YWluaW5nIHRoaXMgZmVhdHVyZVxuXHRsZXQgZkJsb2NrID0gZnVuY3Rpb24gKGZlYXRFbHQpIHtcblx0ICAgIGxldCBibGtFbHQgPSBmZWF0RWx0LnBhcmVudE5vZGU7XG5cdCAgICByZXR1cm4gYmxrRWx0Ll9fZGF0YV9fO1xuXHR9XG5cdGxldCBmeCA9IGZ1bmN0aW9uKGYpIHtcblx0ICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgcmV0dXJuIGIueHNjYWxlKE1hdGgubWF4KGYuc3RhcnQsYi5zdGFydCkpXG5cdH07XG5cdGxldCBmdyA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICBsZXQgYiA9IGZCbG9jayh0aGlzKTtcblx0ICAgIHJldHVybiBNYXRoLmFicyhiLnhzY2FsZShNYXRoLm1pbihmLmVuZCxiLmVuZCkpIC0gYi54c2NhbGUoTWF0aC5tYXgoZi5zdGFydCxiLnN0YXJ0KSkpICsgMTtcblx0fTtcblx0bGV0IGZ5ID0gZnVuY3Rpb24gKGYpIHtcblx0ICAgICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgICAgaWYgKGYuc3RyYW5kID09IFwiK1wiKXtcblx0XHQgICBpZiAoYi5mbGlwKSBcblx0XHQgICAgICAgcmV0dXJuIHNlbGYubGFuZUhlaWdodCpmLmxhbmUgLSBzZWxmLmZlYXRIZWlnaHQ7IFxuXHRcdCAgIGVsc2UgXG5cdFx0ICAgICAgIHJldHVybiAtc2VsZi5sYW5lSGVpZ2h0KmYubGFuZTtcblx0ICAgICAgIH1cblx0ICAgICAgIGVsc2Uge1xuXHRcdCAgIC8vIGYubGFuZSBpcyBuZWdhdGl2ZSBmb3IgXCItXCIgc3RyYW5kXG5cdFx0ICAgaWYgKGIuZmxpcCkgXG5cdFx0ICAgICAgIHJldHVybiBzZWxmLmxhbmVIZWlnaHQqZi5sYW5lO1xuXHRcdCAgIGVsc2Vcblx0XHQgICAgICAgcmV0dXJuIC1zZWxmLmxhbmVIZWlnaHQqZi5sYW5lIC0gc2VsZi5mZWF0SGVpZ2h0OyBcblx0ICAgICAgIH1cblx0ICAgfTtcblxuXHRmZWF0c1xuXHQgIC5hdHRyKFwieFwiLCBmeClcblx0ICAuYXR0cihcIndpZHRoXCIsIGZ3KVxuXHQgIC5hdHRyKFwieVwiLCBmeSlcblx0ICAuYXR0cihcImhlaWdodFwiLCB0aGlzLmZlYXRIZWlnaHQpXG5cdCAgO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFVwZGF0ZXMgZmVhdHVyZSBoaWdobGlnaHRpbmcgaW4gdGhlIGN1cnJlbnQgem9vbSB2aWV3LlxuICAgIC8vIEZlYXR1cmVzIHRvIGJlIGhpZ2hsaWdodGVkIGluY2x1ZGUgdGhvc2UgaW4gdGhlIGhpRmVhdHMgbGlzdCBwbHVzIHRoZSBmZWF0dXJlXG4gICAgLy8gY29ycmVzcG9uZGluZyB0byB0aGUgcmVjdGFuZ2xlIGFyZ3VtZW50LCBpZiBnaXZlbi4gKFRoZSBtb3VzZW92ZXIgZmVhdHVyZS4pXG4gICAgLy9cbiAgICAvLyBEcmF3cyBmaWR1Y2lhbHMgZm9yIGZlYXR1cmVzIGluIHRoaXMgbGlzdCB0aGF0OlxuICAgIC8vIDEuIG92ZXJsYXAgdGhlIGN1cnJlbnQgem9vbVZpZXcgY29vcmQgcmFuZ2VcbiAgICAvLyAyLiBhcmUgbm90IHJlbmRlcmVkIGludmlzaWJsZSBieSBjdXJyZW50IGZhY2V0IHNldHRpbmdzXG4gICAgLy9cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgIGN1cnJlbnQgKHJlY3QgZWxlbWVudCkgT3B0aW9uYWwuIEFkZCdsIHJlY3RhbmdsZSBlbGVtZW50LCBlLmcuLCB0aGF0IHdhcyBtb3VzZWQtb3Zlci4gSGlnaGxpZ2h0aW5nXG4gICAgLy8gICAgICAgIHdpbGwgaW5jbHVkZSB0aGUgZmVhdHVyZSBjb3JyZXNwb25kaW5nIHRvIHRoaXMgcmVjdCBhbG9uZyB3aXRoIHRob3NlIGluIHRoZSBoaWdobGlnaHQgbGlzdC5cbiAgICAvLyAgICBwdWxzZUN1cnJlbnQgKGJvb2xlYW4pIElmIHRydWUgYW5kIGN1cnJlbnQgaXMgZ2l2ZW4sIGNhdXNlIGl0IHRvIHB1bHNlIGJyaWVmbHkuXG4gICAgLy9cbiAgICBoaWdobGlnaHQgKGN1cnJlbnQsIHB1bHNlQ3VycmVudCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdC8vIGN1cnJlbnQgZmVhdHVyZVxuXHRsZXQgY3VyckZlYXQgPSBjdXJyZW50ID8gKGN1cnJlbnQgaW5zdGFuY2VvZiBGZWF0dXJlID8gY3VycmVudCA6IGN1cnJlbnQuX19kYXRhX18pIDogbnVsbDtcblx0Ly8gY3JlYXRlIGxvY2FsIGNvcHkgb2YgaGlGZWF0cywgd2l0aCBjdXJyZW50IGZlYXR1cmUgYWRkZWRcblx0bGV0IGhpRmVhdHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmhpRmVhdHMpO1xuXHRpZiAoY3VyckZlYXQpIHtcblx0ICAgIGhpRmVhdHNbY3VyckZlYXQuaWRdID0gY3VyckZlYXQuaWQ7XG5cdH1cblxuXHQvLyBGaWx0ZXIgYWxsIGZlYXR1cmVzIChyZWN0YW5nbGVzKSBpbiB0aGUgc2NlbmUgZm9yIHRob3NlIGJlaW5nIGhpZ2hsaWdodGVkLlxuXHQvLyBBbG9uZyB0aGUgd2F5LCBidWlsZCBpbmRleCBtYXBwaW5nIGZlYXR1cmUgaWQgdG8gaXRzIFwic3RhY2tcIiBvZiBlcXVpdmFsZW50IGZlYXR1cmVzLFxuXHQvLyBpLmUuIGEgbGlzdCBvZiBpdHMgZ2Vub2xvZ3Mgc29ydGVkIGJ5IHkgY29vcmRpbmF0ZS5cblx0Ly8gQWxzbywgbWFrZSBlYWNoIGhpZ2hsaWdodGVkIGZlYXR1cmUgdGFsbGVyIChzbyBpdCBzdGFuZHMgYWJvdmUgaXRzIG5laWdoYm9ycylcblx0Ly8gYW5kIGdpdmUgaXQgdGhlIFwiLmhpZ2hsaWdodFwiIGNsYXNzLlxuXHQvL1xuXHR0aGlzLnN0YWNrcyA9IHt9OyAvLyBmaWQgLT4gWyByZWN0cyBdIFxuXHRsZXQgZGggPSB0aGlzLmJsb2NrSGVpZ2h0LzIgLSB0aGlzLmZlYXRIZWlnaHQ7XG4gICAgICAgIGxldCBmZWF0cyA9IHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoXCIuZmVhdHVyZVwiKVxuXHQgIC8vIGZpbHRlciByZWN0LmZlYXR1cmVzIGZvciB0aG9zZSBpbiB0aGUgaGlnaGxpZ2h0IGxpc3Rcblx0ICAuZmlsdGVyKGZ1bmN0aW9uKGZmKXtcblx0ICAgICAgLy8gaGlnaGxpZ2h0IGZmIGlmIGVpdGhlciBpZCBpcyBpbiB0aGUgbGlzdCBBTkQgaXQncyBub3QgYmVlbiBoaWRkZW5cblx0ICAgICAgbGV0IG1naSA9IGhpRmVhdHNbZmYubWdpaWRdO1xuXHQgICAgICBsZXQgbWdwID0gaGlGZWF0c1tmZi5tZ3BpZF07XG5cdCAgICAgIGxldCBzaG93aW5nID0gZDMuc2VsZWN0KHRoaXMpLnN0eWxlKFwiZGlzcGxheVwiKSAhPT0gXCJub25lXCI7XG5cdCAgICAgIGxldCBobCA9IHNob3dpbmcgJiYgKG1naSB8fCBtZ3ApO1xuXHQgICAgICBpZiAoaGwpIHtcblx0XHQgIC8vIGZvciBlYWNoIGhpZ2hsaWdodGVkIGZlYXR1cmUsIGFkZCBpdHMgcmVjdGFuZ2xlIHRvIHRoZSBsaXN0XG5cdFx0ICBsZXQgayA9IGZmLmlkO1xuXHRcdCAgaWYgKCFzZWxmLnN0YWNrc1trXSkgc2VsZi5zdGFja3Nba10gPSBbXVxuXHRcdCAgc2VsZi5zdGFja3Nba10ucHVzaCh0aGlzKVxuXHQgICAgICB9XG5cdCAgICAgIC8vIFxuXHQgICAgICBkMy5zZWxlY3QodGhpcylcblx0XHQgIC5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIGhsKVxuXHRcdCAgLmNsYXNzZWQoXCJjdXJyZW50XCIsIGhsICYmIGN1cnJGZWF0ICYmIHRoaXMuX19kYXRhX18uaWQgPT09IGN1cnJGZWF0LmlkKVxuXHRcdCAgLmNsYXNzZWQoXCJleHRyYVwiLCBwdWxzZUN1cnJlbnQgJiYgZmYgPT09IGN1cnJGZWF0KVxuXHQgICAgICByZXR1cm4gaGw7XG5cdCAgfSlcblx0ICA7XG5cblx0dGhpcy5kcmF3RmlkdWNpYWxzKGN1cnJGZWF0KTtcblxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHBvbHlnb25zIHRoYXQgY29ubmVjdCBoaWdobGlnaHRlZCBmZWF0dXJlcyBpbiB0aGUgdmlld1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICBkYXRhIDogbGlzdCBvZiB7XG4gICAgLy8gICAgICAgZmlkOiBmZWF0dXJlLWlkLCBcbiAgICAvLyAgICAgICBjbHM6IGV4dHJhIGNsYXNzIGZvciAuZmVhdHVyZU1hcmsgZ3JvdXAsXG4gICAgLy8gICAgICAgcmVjdHM6IGxpc3Qgb2YgW3JlY3QxLHJlY3QyXSBwYWlycywgXG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgY3VyckZlYXQgOiBjdXJyZW50IChtb3VzZW92ZXIpIGZlYXR1cmUgKGlmIGFueSlcbiAgICAvL1xuICAgIGRyYXdGaWR1Y2lhbHMgKGN1cnJGZWF0KSB7XG5cdC8vIGJ1aWxkIGRhdGEgYXJyYXkgZm9yIGRyYXdpbmcgZmlkdWNpYWxzIGJldHdlZW4gZXF1aXZhbGVudCBmZWF0dXJlc1xuXHRsZXQgZGF0YSA9IFtdO1xuXHRmb3IgKGxldCBrIGluIHRoaXMuc3RhY2tzKSB7XG5cdCAgICAvLyBmb3IgZWFjaCBoaWdobGlnaHRlZCBmZWF0dXJlLCBzb3J0IHRoZSByZWN0YW5nbGVzIGluIGl0cyBsaXN0IGJ5IFktY29vcmRpbmF0ZVxuXHQgICAgbGV0IHJlY3RzID0gdGhpcy5zdGFja3Nba107XG5cdCAgICByZWN0cy5zb3J0KCAoYSxiKSA9PiBwYXJzZUZsb2F0KGEuZ2V0QXR0cmlidXRlKFwieVwiKSkgLSBwYXJzZUZsb2F0KGIuZ2V0QXR0cmlidXRlKFwieVwiKSkgKTtcblx0ICAgIHJlY3RzLnNvcnQoIChhLGIpID0+IHtcblx0XHRyZXR1cm4gYS5fX2RhdGFfXy5nZW5vbWUuem9vbVkgLSBiLl9fZGF0YV9fLmdlbm9tZS56b29tWTtcblx0ICAgIH0pO1xuXHQgICAgLy8gV2FudCBhIHBvbHlnb24gYmV0d2VlbiBlYWNoIHN1Y2Nlc3NpdmUgcGFpciBvZiBpdGVtcy4gVGhlIGZvbGxvd2luZyBjcmVhdGVzIGEgbGlzdCBvZlxuXHQgICAgLy8gbiBwYWlycywgd2hlcmUgcmVjdFtpXSBpcyBwYWlyZWQgd2l0aCByZWN0W2krMV0uIFRoZSBsYXN0IHBhaXIgY29uc2lzdHMgb2YgdGhlIGxhc3Rcblx0ICAgIC8vIHJlY3RhbmdsZSBwYWlyZWQgd2l0aCB1bmRlZmluZWQuIChXZSB3YW50IHRoaXMuKVxuXHQgICAgbGV0IHBhaXJzID0gcmVjdHMubWFwKChyLCBpKSA9PiBbcixyZWN0c1tpKzFdXSk7XG5cdCAgICAvLyBBZGQgYSBjbGFzcyAoXCJjdXJyZW50XCIpIGZvciB0aGUgcG9seWdvbnMgYXNzb2NpYXRlZCB3aXRoIHRoZSBtb3VzZW92ZXIgZmVhdHVyZSBzbyB0aGV5XG5cdCAgICAvLyBjYW4gYmUgZGlzdGluZ3Vpc2hlZCBmcm9tIG90aGVycy5cblx0ICAgIGRhdGEucHVzaCh7IGZpZDogaywgcmVjdHM6IHBhaXJzLCBjbHM6IChjdXJyRmVhdCAmJiBjdXJyRmVhdC5pZCA9PT0gayA/ICdjdXJyZW50JyA6ICcnKSB9KTtcblx0fVxuXG5cdGxldCBzZWxmID0gdGhpcztcblx0Ly9cblx0Ly8gcHV0IGZpZHVjaWFsIG1hcmtzIGluIHRoZWlyIG93biBncm91cCBcblx0bGV0IGZHcnAgPSB0aGlzLmZpZHVjaWFscy5jbGFzc2VkKFwiaGlkZGVuXCIsIGZhbHNlKTtcblxuXHQvLyBCaW5kIGZpcnN0IGxldmVsIGRhdGEgdG8gXCJmZWF0dXJlTWFya3NcIiBncm91cHNcblx0bGV0IGZmR3JwcyA9IGZHcnAuc2VsZWN0QWxsKFwiZy5mZWF0dXJlTWFya3NcIilcblx0ICAgIC5kYXRhKGRhdGEsIGQgPT4gZC5maWQpO1xuXHRmZkdycHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgZCA9PiBkLmZpZCk7XG5cdGZmR3Jwcy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGZmR3Jwcy5hdHRyKFwiY2xhc3NcIixkID0+IFwiZmVhdHVyZU1hcmtzIFwiICsgKGQuY2xzIHx8IFwiXCIpKVxuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRHJhdyB0aGUgY29ubmVjdG9yIHBvbHlnb25zLlxuXHQvLyBCaW5kIHNlY29uZCBsZXZlbCBkYXRhIChyZWN0YW5nbGUgcGFpcnMpIHRvIHBvbHlnb25zIGluIHRoZSBncm91cFxuXHRsZXQgcGdvbnMgPSBmZkdycHMuc2VsZWN0QWxsKFwicG9seWdvblwiKVxuXHQgICAgLmRhdGEoZD0+ZC5yZWN0cy5maWx0ZXIociA9PiByWzBdICYmIHJbMV0pKTtcblx0cGdvbnMuZXhpdCgpLnJlbW92ZSgpO1xuXHRwZ29ucy5lbnRlcigpLmFwcGVuZChcInBvbHlnb25cIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImZpZHVjaWFsXCIpXG5cdCAgICA7XG5cdC8vXG5cdHBnb25zLmF0dHIoXCJwb2ludHNcIiwgciA9PiB7XG5cdCAgICAvLyBwb2x5Z29uIGNvbm5lY3RzIGJvdHRvbSBjb3JuZXJzIG9mIDFzdCByZWN0IHRvIHRvcCBjb3JuZXJzIG9mIDJuZCByZWN0XG5cdCAgICBsZXQgYzEgPSBjb29yZHNBZnRlclRyYW5zZm9ybShyWzBdKTsgLy8gdHJhbnNmb3JtIGNvb3JkcyBmb3IgMXN0IHJlY3Rcblx0ICAgIGxldCBjMiA9IGNvb3Jkc0FmdGVyVHJhbnNmb3JtKHJbMV0pOyAgLy8gdHJhbnNmb3JtIGNvb3JkcyBmb3IgMm5kIHJlY3Rcblx0ICAgIHIudGNvb3JkcyA9IFtjMSxjMl07XG5cdCAgICAvLyBmb3VyIHBvbHlnb24gcG9pbnRzXG5cdCAgICBsZXQgcyA9IGAke2MxLnh9LCR7YzEueStjMS5oZWlnaHR9ICR7YzIueH0sJHtjMi55fSAke2MyLngrYzIud2lkdGh9LCR7YzIueX0gJHtjMS54K2MxLndpZHRofSwke2MxLnkrYzEuaGVpZ2h0fWBcblx0ICAgIHJldHVybiBzO1xuXHR9KVxuXHQvL1xuXHQvLyBtb3VzaW5nIG92ZXIgdGhlIGZpZHVjaWFsIGhpZ2hsaWdodHMgKGFzIGlmIHRoZSB1c2VyIGhhZCBtb3VzZWQgb3ZlciB0aGUgZmVhdHVyZSBpdHNlbGYpXG5cdC5vbihcIm1vdXNlb3ZlclwiLCAocCkgPT4ge1xuXHQgICAgdGhpcy5oaWdobGlnaHQocFswXSk7XG5cdH0pXG5cdC5vbihcIm1vdXNlb3V0XCIsICAocCkgPT4ge1xuXHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0fSk7XG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRHJhdyBmZWF0dXJlIGxhYmVscy4gRWFjaCBsYWJlbCBpcyBkcmF3biBvbmNlLCBhYm92ZSB0aGUgZmlyc3QgcmVjdGFuZ2xlIGluIGl0cyBsaXN0LlxuXHQvLyBUaGUgZXhjZXB0aW9uIGlzIHRoZSBjdXJyZW50IChtb3VzZW92ZXIpIGZlYXR1cmUsIHdoZXJlIHRoZSBsYWJlbCBpcyBkcmF3biBhYm92ZSB0aGF0IGZlYXR1cmUuXG5cdGxldCBsYWJlbHMgPSBmZkdycHMuc2VsZWN0QWxsKCd0ZXh0LmZlYXRMYWJlbCcpXG5cdCAgICAuZGF0YShkID0+IHtcblx0XHRsZXQgciA9IGQucmVjdHNbMF1bMF07XG5cdFx0aWYgKGN1cnJGZWF0ICYmIChkLmZpZCA9PT0gY3VyckZlYXQuSUQgfHwgZC5maWQgPT09IGN1cnJGZWF0LmNhbm9uaWNhbCkpe1xuXHRcdCAgICBsZXQgcjIgPSBkLnJlY3RzLm1hcCggcnIgPT5cblx0XHQgICAgICAgcnJbMF0uX19kYXRhX18gPT09IGN1cnJGZWF0ID8gcnJbMF0gOiByclsxXSYmcnJbMV0uX19kYXRhX18gPT09IGN1cnJGZWF0ID8gcnJbMV0gOiBudWxsXG5cdFx0ICAgICAgICkuZmlsdGVyKHg9PngpWzBdO1xuXHRcdCAgICByID0gcjIgPyByMiA6IHI7XG5cdFx0fVxuXHQgICAgICAgIHJldHVybiBbe1xuXHRcdCAgICBmaWQ6IGQuZmlkLFxuXHRcdCAgICByZWN0OiByLFxuXHRcdCAgICB0cmVjdDogY29vcmRzQWZ0ZXJUcmFuc2Zvcm0ocilcblx0XHR9XTtcblx0ICAgIH0pO1xuXG5cdC8vIERyYXcgdGhlIHRleHQuXG5cdGxhYmVscy5lbnRlcigpLmFwcGVuZCgndGV4dCcpLmF0dHIoJ2NsYXNzJywnZmVhdExhYmVsJyk7XG5cdGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XG5cdGxhYmVsc1xuXHQgIC5hdHRyKFwieFwiLCBkID0+IGQudHJlY3QueCArIGQudHJlY3Qud2lkdGgvMiApXG5cdCAgLmF0dHIoXCJ5XCIsIGQgPT4gZC5yZWN0Ll9fZGF0YV9fLmdlbm9tZS56b29tWSAtIDMpXG5cdCAgLnRleHQoZCA9PiB7XG5cdCAgICAgICBsZXQgZiA9IGQucmVjdC5fX2RhdGFfXztcblx0ICAgICAgIGxldCBzeW0gPSBmLnN5bWJvbCB8fCBmLm1ncGlkO1xuXHQgICAgICAgcmV0dXJuIHN5bTtcblx0ICB9KTtcblxuXHQvLyBQdXQgYSByZWN0YW5nbGUgYmVoaW5kIGVhY2ggbGFiZWwgYXMgYSBiYWNrZ3JvdW5kXG5cdGxldCBsYmxCb3hEYXRhID0gbGFiZWxzLm1hcChsYmwgPT4gbGJsWzBdLmdldEJCb3goKSlcblx0bGV0IGxibEJveGVzID0gZmZHcnBzLnNlbGVjdEFsbCgncmVjdC5mZWF0TGFiZWxCb3gnKVxuXHQgICAgLmRhdGEoKGQsaSkgPT4gW2xibEJveERhdGFbaV1dKTtcblx0bGJsQm94ZXMuZW50ZXIoKS5pbnNlcnQoJ3JlY3QnLCd0ZXh0JykuYXR0cignY2xhc3MnLCdmZWF0TGFiZWxCb3gnKTtcblx0bGJsQm94ZXMuZXhpdCgpLnJlbW92ZSgpO1xuXHRsYmxCb3hlc1xuXHQgICAgLmF0dHIoXCJ4XCIsICAgICAgYmIgPT4gYmIueC0yKVxuXHQgICAgLmF0dHIoXCJ5XCIsICAgICAgYmIgPT4gYmIueS0xKVxuXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCAgYmIgPT4gYmIud2lkdGgrNClcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGJiID0+IGJiLmhlaWdodCsyKVxuXHQgICAgO1xuXHRcblx0Ly8gaWYgdGhlcmUgaXMgYSBjdXJyRmVhdCwgbW92ZSBpdHMgZmlkdWNpYWxzIHRvIHRoZSBlbmQgKHNvIHRoZXkncmUgb24gdG9wIG9mIGV2ZXJ5b25lIGVsc2UpXG5cdGlmIChjdXJyRmVhdCkge1xuXHQgICAgLy8gZ2V0IGxpc3Qgb2YgZ3JvdXAgZWxlbWVudHMgZnJvbSB0aGUgZDMgc2VsZWN0aW9uXG5cdCAgICBsZXQgZmZMaXN0ID0gZmZHcnBzWzBdO1xuXHQgICAgLy8gZmluZCB0aGUgb25lIHdob3NlIGZlYXR1cmUgaXMgY3VyckZlYXRcblx0ICAgIGxldCBpID0gLTE7XG5cdCAgICBmZkxpc3QuZm9yRWFjaCggKGcsaikgPT4geyBpZiAoZy5fX2RhdGFfXy5maWQgPT09IGN1cnJGZWF0LmlkKSBpID0gajsgfSk7XG5cdCAgICAvLyBpZiB3ZSBmb3VuZCBpdCBhbmQgaXQncyBub3QgYWxyZWFkeSB0aGUgbGFzdCwgbW92ZSBpdCB0byB0aGVcblx0ICAgIC8vIGxhc3QgcG9zaXRpb24gYW5kIHJlb3JkZXIgaW4gdGhlIERPTS5cblx0ICAgIGlmIChpID49IDApIHtcblx0XHRsZXQgbGFzdGkgPSBmZkxpc3QubGVuZ3RoIC0gMTtcblx0ICAgICAgICBsZXQgeCA9IGZmTGlzdFtpXTtcblx0XHRmZkxpc3RbaV0gPSBmZkxpc3RbbGFzdGldO1xuXHRcdGZmTGlzdFtsYXN0aV0gPSB4O1xuXHRcdGZmR3Jwcy5vcmRlcigpO1xuXHQgICAgfVxuXHR9XG5cdFxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWRlRmlkdWNpYWxzICgpIHtcblx0dGhpcy5zdmdNYWluLnNlbGVjdChcImcuZmlkdWNpYWxzXCIpXG5cdCAgICAuY2xhc3NlZChcImhpZGRlblwiLCB0cnVlKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBab29tVmlld1xuXG5leHBvcnQgeyBab29tVmlldyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvWm9vbVZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=