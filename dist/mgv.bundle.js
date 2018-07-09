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
      let cc        = this.app.coords; // current coordinates
      let currWidth = cc.end - cc.start + 1;
      let mid       = (cc.start + cc.end)/2;
      let dx        = (r.start + r.end)/2 - mid;
      let brushWidth= r.end - r.start + 1;
      let zfactor   = (Math.abs(xt[0] - xt[1]) <= 10) ? 1 : brushWidth / currWidth;
      se.shiftKey && (zfactor = 1/zfactor);
      this.app.panzoom(dx/currWidth, zfactor);
    }

    xbbEnd () {
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
	if (this.root.classed('closed'))
	    feats = feats.filter(f => f.genome === this.app.rGenome);
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
	if (!this.root.classed('closed'))
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
	    else {
		dx = b.chr === cchr ? pstart[j] + ppb * (b.start - bstart[j]) : Infinity;
		if (dx > self.width) {
		    // Changed chr or jumped a large gap
		    pstart[j] = pend + 6;
		    bstart[j] = b.start;
		    dx = pstart[j];
		}
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
	    .text(this.app.rGenome.label + " coords");
	
	// the reference genome block (always just 1 of these).
	let rData = data.filter(dd => dd.genome === this.app.rGenome)[0];
	let rBlock = rData.blocks[0];

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




/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDk1ZGI4MzY5ZGNkZDFkOTFiMTAiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1N0b3JhZ2VNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvU1ZHVmlldy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvdmlld2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9NR1ZBcHAuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZS5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1F1ZXJ5TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQXV4RGF0YU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYUV2YWx1YXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvTGlzdEVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvVXNlclByZWZzTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmFjZXRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GYWNldC5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQlRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9CbG9ja1RyYW5zbGF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZVZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzIiwid2VicGFjazovLy8u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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQW9CQTs7Ozs7Ozs7QUN6VkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7OztBQ3JCUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7OztBQ3JFUjtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxvQkFBb0I7QUFDckQsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxRQUFRLFVBQVUsRUFBRSxJQUFJO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLHFCQUFxQjtBQUM3Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixFQUFFO0FBQ2xCLGlCQUFpQixLQUFLLEdBQUcsRUFBRTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUIsR0FBRyxnQkFBZ0IsR0FBRyxhQUFhO0FBQ3BFLGlCQUFpQixjQUFjLEdBQUcsZ0JBQWdCLEdBQUcsZ0JBQWdCO0FBQ3JFO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsYUFBYTtBQUNsRTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFTzs7Ozs7Ozs7OztBQy9Sb0I7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7Ozs7Ozs7QUNuRXFEO0FBQ3pDO0FBQ1E7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7Ozs7QUNqT3NCOztBQUU5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7Ozs7O0FDdkNROztBQUVoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7O0FDN0JSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTzs7Ozs7Ozs7Ozs7QUNwQlE7QUFDVTs7QUFFMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsbUJBQW1CO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdDQUFnQyxhQUFhLEdBQUcsYUFBYTtBQUM3RCxnQ0FBZ0MsYUFBYSxHQUFHLGFBQWE7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSx3REFBd0QsSUFBSSx5QkFBeUIsSUFBSTtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSw2REFBNkQsYUFBYSxHQUFHLGFBQWEsWUFBWSxFQUFFO0FBQ3hHLEtBQUs7QUFDTCxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7OztBQ3RHUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0Esd0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFjLEdBQUcsS0FBSyxHQUFHLGNBQWMsR0FBRyxlQUFlO0FBQ25IO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiwyQ0FBMkMsRUFBRTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPIiwiZmlsZSI6Im1ndi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkOTVkYjgzNjlkY2RkMWQ5MWIxMCIsIlxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyAgICAgICAgICAgICAgICAgICAgVVRJTFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIChSZS0pSW5pdGlhbGl6ZXMgYW4gb3B0aW9uIGxpc3QuXG4vLyBBcmdzOlxuLy8gICBzZWxlY3RvciAoc3RyaW5nIG9yIE5vZGUpIENTUyBzZWxlY3RvciBvZiB0aGUgY29udGFpbmVyIDxzZWxlY3Q+IGVsZW1lbnQuIE9yIHRoZSBlbGVtZW50IGl0c2VsZi5cbi8vICAgb3B0cyAobGlzdCkgTGlzdCBvZiBvcHRpb24gZGF0YSBvYmplY3RzLiBNYXkgYmUgc2ltcGxlIHN0cmluZ3MuIE1heSBiZSBtb3JlIGNvbXBsZXguXG4vLyAgIHZhbHVlIChmdW5jdGlvbiBvciBudWxsKSBGdW5jdGlvbiB0byBwcm9kdWNlIHRoZSA8b3B0aW9uPiB2YWx1ZSBmcm9tIGFuIG9wdHMgaXRlbVxuLy8gICAgICAgRGVmYXVsdHMgdG8gdGhlIGlkZW50aXR5IGZ1bmN0aW9uICh4PT54KS5cbi8vICAgbGFiZWwgKGZ1bmN0aW9uIG9yIG51bGwpIEZ1bmN0aW9uIHRvIHByb2R1Y2UgdGhlIDxvcHRpb24+IGxhYmVsIGZyb20gYW4gb3B0cyBpdGVtXG4vLyAgICAgICBEZWZhdWx0cyB0byB0aGUgdmFsdWUgZnVuY3Rpb24uXG4vLyAgIG11bHRpIChib29sZWFuKSBTcGVjaWZpZXMgaWYgdGhlIGxpc3Qgc3VwcG9ydCBtdWx0aXBsZSBzZWxlY3Rpb25zLiAoZGVmYXVsdCA9IGZhbHNlKVxuLy8gICBzZWxlY3RlZCAoZnVuY3Rpb24gb3IgbnVsbCkgRnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIGEgZ2l2ZW4gb3B0aW9uIGlzIHNlbGVjdGQuXG4vLyAgICAgICBEZWZhdWx0cyB0byBkPT5GYWxzZS4gTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgb25seSBhcHBsaWVkIHRvIG5ldyBvcHRpb25zLlxuLy8gICBzb3J0QnkgKGZ1bmN0aW9uKSBPcHRpb25hbC4gSWYgcHJvdmlkZWQsIGEgY29tcGFyaXNvbiBmdW5jdGlvbiB0byB1c2UgZm9yIHNvcnRpbmcgdGhlIG9wdGlvbnMuXG4vLyAgIFx0IFRoZSBjb21wYXJpc29uIGZ1bmN0aW9uIGlzIHBhc3NlcyB0aGUgZGF0YSBvYmplY3RzIGNvcnJlc3BvbmRpbmcgdG8gdHdvIG9wdGlvbnMgYW5kIHNob3VsZFxuLy8gICBcdCByZXR1cm4gLTEsIDAgb3IgKzEuIElmIG5vdCBwcm92aWRlZCwgdGhlIG9wdGlvbiBsaXN0IHdpbGwgaGF2ZSB0aGUgc2FtZSBzb3J0IG9yZGVyIGFzIHRoZSBvcHRzIGFyZ3VtZW50LlxuLy8gUmV0dXJuczpcbi8vICAgVGhlIG9wdGlvbiBsaXN0IGluIGEgRDMgc2VsZWN0aW9uLlxuZnVuY3Rpb24gaW5pdE9wdExpc3Qoc2VsZWN0b3IsIG9wdHMsIHZhbHVlLCBsYWJlbCwgbXVsdGksIHNlbGVjdGVkLCBzb3J0QnkpIHtcblxuICAgIC8vIHNldCB1cCB0aGUgZnVuY3Rpb25zXG4gICAgbGV0IGlkZW50ID0gZCA9PiBkO1xuICAgIHZhbHVlID0gdmFsdWUgfHwgaWRlbnQ7XG4gICAgbGFiZWwgPSBsYWJlbCB8fCB2YWx1ZTtcbiAgICBzZWxlY3RlZCA9IHNlbGVjdGVkIHx8ICh4ID0+IGZhbHNlKTtcblxuICAgIC8vIHRoZSA8c2VsZWN0PiBlbHRcbiAgICBsZXQgcyA9IGQzLnNlbGVjdChzZWxlY3Rvcik7XG5cbiAgICAvLyBtdWx0aXNlbGVjdFxuICAgIHMucHJvcGVydHkoJ211bHRpcGxlJywgbXVsdGkgfHwgbnVsbCkgO1xuXG4gICAgLy8gYmluZCB0aGUgb3B0cy5cbiAgICBsZXQgb3MgPSBzLnNlbGVjdEFsbChcIm9wdGlvblwiKVxuICAgICAgICAuZGF0YShvcHRzLCBsYWJlbCk7XG4gICAgb3MuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKFwib3B0aW9uXCIpIFxuICAgICAgICAuYXR0cihcInZhbHVlXCIsIHZhbHVlKVxuICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCBvID0+IHNlbGVjdGVkKG8pIHx8IG51bGwpXG4gICAgICAgIC50ZXh0KGxhYmVsKSBcbiAgICAgICAgO1xuICAgIC8vXG4gICAgb3MuZXhpdCgpLnJlbW92ZSgpIDtcblxuICAgIC8vIHNvcnQgdGhlIHJlc3VsdHNcbiAgICBpZiAoIXNvcnRCeSkgc29ydEJ5ID0gKGEsYikgPT4ge1xuICAgIFx0bGV0IGFpID0gb3B0cy5pbmRleE9mKGEpO1xuXHRsZXQgYmkgPSBvcHRzLmluZGV4T2YoYik7XG5cdHJldHVybiBhaSAtIGJpO1xuICAgIH1cbiAgICBvcy5zb3J0KHNvcnRCeSk7XG5cbiAgICAvL1xuICAgIHJldHVybiBzO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByb21pc2lmaWVzIGEgY2FsbCB0byBkMy50c3YuXG4vLyBBcmdzOlxuLy8gICB1cmwgKHN0cmluZykgVGhlIHVybCBvZiB0aGUgdHN2IHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbGlzdCBvZiByb3cgb2JqZWN0c1xuZnVuY3Rpb24gZDN0c3YodXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkMy50c3YodXJsLCBmdW5jdGlvbihlcnJvciwgdmFsKXtcbiAgICAgICAgICAgIGVycm9yID8gcmVqZWN0KHsgc3RhdHVzOiBlcnJvci5zdGF0dXMsIHN0YXR1c1RleHQ6IGVycm9yLnN0YXR1c1RleHR9KSA6IHJlc29sdmUodmFsKTtcbiAgICAgICAgfSkgIFxuICAgIH0pOyBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcm9taXNpZmllcyBhIGNhbGwgdG8gZDMuanNvbi5cbi8vIEFyZ3M6XG4vLyAgIHVybCAoc3RyaW5nKSBUaGUgdXJsIG9mIHRoZSBqc29uIHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUganNvbiBvYmplY3QgdmFsdWUsIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvclxuZnVuY3Rpb24gZDNqc29uKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZDMuanNvbih1cmwsIGZ1bmN0aW9uKGVycm9yLCB2YWwpe1xuICAgICAgICAgICAgZXJyb3IgPyByZWplY3QoeyBzdGF0dXM6IGVycm9yLnN0YXR1cywgc3RhdHVzVGV4dDogZXJyb3Iuc3RhdHVzVGV4dH0pIDogcmVzb2x2ZSh2YWwpO1xuICAgICAgICB9KSAgXG4gICAgfSk7IFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgYSBkZWVwIGNvcHkgb2Ygb2JqZWN0IG8uIFxuLy8gQXJnczpcbi8vICAgbyAgKG9iamVjdCkgTXVzdCBiZSBhIEpTT04gb2JqZWN0IChubyBjdXJjdWxhciByZWZzLCBubyBmdW5jdGlvbnMpLlxuLy8gUmV0dXJuczpcbi8vICAgYSBkZWVwIGNvcHkgb2Ygb1xuZnVuY3Rpb24gZGVlcGMobykge1xuICAgIGlmICghbykgcmV0dXJuIG87XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG8pKTtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQYXJzZXMgYSBzdHJpbmcgb2YgdGhlIGZvcm0gXCJjaHI6c3RhcnQuLmVuZFwiLlxuLy8gUmV0dXJuczpcbi8vICAgb2JqZWN0IGNvbnRpbmluZyB0aGUgcGFyc2VkIGZpZWxkcy5cbi8vIEV4YW1wbGU6XG4vLyAgIHBhcnNlQ29vcmRzKFwiMTA6MTAwMDAwMDAuLjIwMDAwMDAwXCIpIC0+IHtjaHI6XCIxMFwiLCBzdGFydDoxMDAwMDAwMCwgZW5kOjIwMDAwMDAwfVxuZnVuY3Rpb24gcGFyc2VDb29yZHMgKGNvb3Jkcykge1xuICAgIGxldCByZSA9IC8oW146XSspOihcXGQrKVxcLlxcLihcXGQrKS87XG4gICAgbGV0IG0gPSBjb29yZHMubWF0Y2gocmUpO1xuICAgIHJldHVybiBtID8ge2NocjptWzFdLCBzdGFydDpwYXJzZUludChtWzJdKSwgZW5kOnBhcnNlSW50KG1bM10pfSA6IG51bGw7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRm9ybWF0cyBhIGNocm9tb3NvbWUgbmFtZSwgc3RhcnQgYW5kIGVuZCBwb3NpdGlvbiBhcyBhIHN0cmluZy5cbi8vIEFyZ3MgKGZvcm0gMSk6XG4vLyAgIGNvb3JkcyAob2JqZWN0KSBPZiB0aGUgZm9ybSB7Y2hyOnN0cmluZywgc3RhcnQ6aW50LCBlbmQ6aW50fVxuLy8gQXJncyAoZm9ybSAyKTpcbi8vICAgY2hyIHN0cmluZ1xuLy8gICBzdGFydCBpbnRcbi8vICAgZW5kIGludFxuLy8gUmV0dXJuczpcbi8vICAgICBzdHJpbmdcbi8vIEV4YW1wbGU6XG4vLyAgICAgZm9ybWF0Q29vcmRzKFwiMTBcIiwgMTAwMDAwMDAsIDIwMDAwMDAwKSAtPiBcIjEwOjEwMDAwMDAwLi4yMDAwMDAwMFwiXG5mdW5jdGlvbiBmb3JtYXRDb29yZHMgKGNociwgc3RhcnQsIGVuZCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG5cdGxldCBjID0gY2hyO1xuXHRjaHIgPSBjLmNocjtcblx0c3RhcnQgPSBjLnN0YXJ0O1xuXHRlbmQgPSBjLmVuZDtcbiAgICB9XG4gICAgcmV0dXJuIGAke2Nocn06JHtzdGFydH0uLiR7ZW5kfWBcbn1cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0cnVlIGlmZiB0aGUgdHdvIHJhbmdlcyBvdmVybGFwIGJ5IGF0IGxlYXN0IDEuXG4vLyBFYWNoIHJhbmdlIG11c3QgaGF2ZSBhIGNociwgc3RhcnQsIGFuZCBlbmQuXG4vL1xuZnVuY3Rpb24gb3ZlcmxhcHMgKGEsIGIpIHtcbiAgICByZXR1cm4gYS5jaHIgPT09IGIuY2hyICYmIGEuc3RhcnQgPD0gYi5lbmQgJiYgYS5lbmQgPj0gYi5zdGFydDtcbn1cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gR2l2ZW4gdHdvIHJhbmdlcywgYSBhbmQgYiwgcmV0dXJucyBhIC0gYi5cbi8vIFRoZSByZXN1bHQgaXMgYSBsaXN0IG9mIDAsIDEgb3IgMiBuZXcgcmFuZ2VzLCBkZXBlbmRpbmcgb24gYSBhbmQgYi5cbmZ1bmN0aW9uIHN1YnRyYWN0KGEsIGIpIHtcbiAgICBpZiAoYS5jaHIgIT09IGIuY2hyKSByZXR1cm4gWyBhIF07XG4gICAgbGV0IGFiTGVmdCA9IHsgY2hyOmEuY2hyLCBzdGFydDphLnN0YXJ0LCAgICAgICAgICAgICAgICAgICAgZW5kOk1hdGgubWluKGEuZW5kLCBiLnN0YXJ0LTEpIH07XG4gICAgbGV0IGFiUmlnaHQ9IHsgY2hyOmEuY2hyLCBzdGFydDpNYXRoLm1heChhLnN0YXJ0LCBiLmVuZCsxKSwgZW5kOmEuZW5kIH07XG4gICAgbGV0IGFucyA9IFsgYWJMZWZ0LCBhYlJpZ2h0IF0uZmlsdGVyKCByID0+IHIuc3RhcnQgPD0gci5lbmQgKTtcbiAgICByZXR1cm4gYW5zO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENyZWF0ZXMgYSBsaXN0IG9mIGtleSx2YWx1ZSBwYWlycyBmcm9tIHRoZSBvYmouXG5mdW5jdGlvbiBvYmoybGlzdCAobykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvKS5tYXAoayA9PiBbaywgb1trXV0pICAgIFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdHJ1ZSBpZmYgdGhlIHR3byBsaXN0cyBoYXZlIHRoZSBzYW1lIGNvbnRlbnRzIChiYXNlZCBvbiBpbmRleE9mKS5cbi8vIEJydXRlIGZvcmNlIGFwcHJvYWNoLiBCZSBjYXJlZnVsIHdoZXJlIHlvdSB1c2UgdGhpcy5cbmZ1bmN0aW9uIHNhbWUgKGFsc3QsYmxzdCkge1xuICAgcmV0dXJuIGFsc3QubGVuZ3RoID09PSBibHN0Lmxlbmd0aCAmJiBcbiAgICAgICBhbHN0LnJlZHVjZSgoYWNjLHgpID0+IChhY2MgJiYgYmxzdC5pbmRleE9mKHgpPj0wKSwgdHJ1ZSk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBZGQgYmFzaWMgc2V0IG9wcyB0byBTZXQgcHJvdG90eXBlLlxuLy8gTGlmdGVkIGZyb206IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1NldFxuU2V0LnByb3RvdHlwZS51bmlvbiA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgdW5pb24gPSBuZXcgU2V0KHRoaXMpO1xuICAgIGZvciAodmFyIGVsZW0gb2Ygc2V0Qikge1xuICAgICAgICB1bmlvbi5hZGQoZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiB1bmlvbjtcbn1cblxuU2V0LnByb3RvdHlwZS5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihzZXRCKSB7XG4gICAgdmFyIGludGVyc2VjdGlvbiA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKHZhciBlbGVtIG9mIHNldEIpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzKGVsZW0pKSB7XG4gICAgICAgICAgICBpbnRlcnNlY3Rpb24uYWRkKGVsZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnRlcnNlY3Rpb247XG59XG5cblNldC5wcm90b3R5cGUuZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgZGlmZmVyZW5jZSA9IG5ldyBTZXQodGhpcyk7XG4gICAgZm9yICh2YXIgZWxlbSBvZiBzZXRCKSB7XG4gICAgICAgIGRpZmZlcmVuY2UuZGVsZXRlKGVsZW0pO1xuICAgIH1cbiAgICByZXR1cm4gZGlmZmVyZW5jZTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gZ2V0Q2FyZXRSYW5nZSAoZWx0KSB7XG4gICAgLy8gRklYTUU6IGRvZXMgbm90IHdvcmsgZm9yIElFXG4gICAgcmV0dXJuIFtlbHQuc2VsZWN0aW9uU3RhcnQsIGVsdC5zZWxlY3Rpb25FbmRdO1xufVxuZnVuY3Rpb24gc2V0Q2FyZXRSYW5nZSAoZWx0LCByYW5nZSkge1xuICAgIC8vIEZJWE1FOiBkb2VzIG5vdCB3b3JrIGZvciBJRVxuICAgIGVsdC5zZWxlY3Rpb25TdGFydCA9IHJhbmdlWzBdO1xuICAgIGVsdC5zZWxlY3Rpb25FbmQgICA9IHJhbmdlWzFdO1xufVxuZnVuY3Rpb24gc2V0Q2FyZXRQb3NpdGlvbiAoZWx0LCBwb3MpIHtcbiAgICBzZXRDYXJldFJhbmdlKGVsdCwgW3Bvcyxwb3NdKTtcbn1cbmZ1bmN0aW9uIG1vdmVDYXJldFBvc2l0aW9uIChlbHQsIGRlbHRhKSB7XG4gICAgc2V0Q2FyZXRQb3NpdGlvbihlbHQsIGdldENhcmV0UG9zaXRpb24oZWx0KSArIGRlbHRhKTtcbn1cbmZ1bmN0aW9uIGdldENhcmV0UG9zaXRpb24gKGVsdCkge1xuICAgIGxldCByID0gZ2V0Q2FyZXRSYW5nZShlbHQpO1xuICAgIHJldHVybiByWzFdO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdGhlIHNjcmVlbiBjb29yZGluYXRlcyBvZiBhbiBTVkcgc2hhcGUgKGNpcmNsZSwgcmVjdCwgcG9seWdvbiwgbGluZSlcbi8vIGFmdGVyIGFsbCB0cmFuc2Zvcm1zIGhhdmUgYmVlbiBhcHBsaWVkLlxuLy9cbi8vIEFyZ3M6XG4vLyAgICAgc2hhcGUgKG5vZGUpIFRoZSBTVkcgc2hhcGUuXG4vL1xuLy8gUmV0dXJuczpcbi8vICAgICBUaGUgZm9ybSBvZiB0aGUgcmV0dXJuZWQgdmFsdWUgZGVwZW5kcyBvbiB0aGUgc2hhcGUuXG4vLyAgICAgY2lyY2xlOiAgeyBjeCwgY3ksIHIgfVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBjZW50ZXIgcG9pbnQgYW5kIHRyYW5zZm9ybWVkIHJhZGl1cyAgICAgICAgIFxuLy8gICAgIGxpbmU6XHR7IHgxLCB5MSwgeDIsIHkyIH1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgZW5kcG9pbnRzXG4vLyAgICAgcmVjdDpcdHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9XG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGNvcm5lciBwb2ludCBhbmQgdHJhbnNmb3JtZWQgd2lkdGgraGVpZ2h0LlxuLy8gICAgIHBvbHlnb246IFsge3gseX0sIHt4LHl9ICwgLi4uIF1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgbGlzdCBvZiBwb2ludHNcbi8vXG4vLyBBZGFwdGVkIGZyb206IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY4NTg0NzkvcmVjdGFuZ2xlLWNvb3JkaW5hdGVzLWFmdGVyLXRyYW5zZm9ybT9ycT0xXG4vL1xuZnVuY3Rpb24gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0gKHNoYXBlKSB7XG4gICAgLy9cbiAgICBsZXQgZHNoYXBlID0gZDMuc2VsZWN0KHNoYXBlKTtcbiAgICBsZXQgc3ZnID0gc2hhcGUuY2xvc2VzdChcInN2Z1wiKTtcbiAgICBpZiAoIXN2ZykgdGhyb3cgXCJDb3VsZCBub3QgZmluZCBzdmcgYW5jZXN0b3IuXCI7XG4gICAgbGV0IHN0eXBlID0gc2hhcGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGxldCBtYXRyaXggPSBzaGFwZS5nZXRDVE0oKTtcbiAgICBsZXQgcCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgIGxldCBwMj0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgLy9cbiAgICBzd2l0Y2ggKHN0eXBlKSB7XG4gICAgLy9cbiAgICBjYXNlICdjaXJjbGUnOlxuXHRwLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImN4XCIpKTtcblx0cC55ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJjeVwiKSk7XG5cdHAyLnggPSBwLnggKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiclwiKSk7XG5cdHAyLnkgPSBwLnk7XG5cdHAgICAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRwMiAgID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdC8vIGNhbGMgbmV3IHJhZGl1cyBhcyBkaXN0YW5jZSBiZXR3ZWVuIHRyYW5zZm9ybWVkIHBvaW50c1xuXHRsZXQgZHggPSBNYXRoLmFicyhwLnggLSBwMi54KTtcblx0bGV0IGR5ID0gTWF0aC5hYnMocC55IC0gcDIueSk7XG5cdGxldCByID0gTWF0aC5zcXJ0KGR4KmR4ICsgZHkqZHkpO1xuICAgICAgICByZXR1cm4geyBjeDogcC54LCBjeTogcC55LCByOnIgfTtcbiAgICAvL1xuICAgIGNhc2UgJ3JlY3QnOlxuXHQvLyBGSVhNRTogZG9lcyBub3QgaGFuZGxlIHJvdGF0aW9ucyBjb3JyZWN0bHkuIFRvIGZpeCwgdHJhbnNsYXRlIGNvcm5lciBwb2ludHMgc2VwYXJhdGVseSBhbmQgdGhlblxuXHQvLyBjYWxjdWxhdGUgdGhlIHRyYW5zZm9ybWVkIHdpZHRoIGFuZCBoZWlnaHQuIEFzIGEgY29udmVuaWVuY2UgdG8gdGhlIHVzZXIsIG1pZ2h0IGJlIG5pY2UgdG8gcmV0dXJuXG5cdC8vIHRoZSB0cmFuc2Zvcm1lZCBjb3JuZXIgcG9pbnRzIGFuZCBwb3NzaWJseSB0aGUgZmluYWwgYW5nbGUgb2Ygcm90YXRpb24uXG5cdHAueCAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieFwiKSk7XG5cdHAueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieVwiKSk7XG5cdHAyLnggPSBwLnggKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwid2lkdGhcIikpO1xuXHRwMi55ID0gcC55ICsgcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImhlaWdodFwiKSk7XG5cdC8vXG5cdHAgID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0cDIgPSBwMi5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0Ly9cbiAgICAgICAgcmV0dXJuIHsgeDogcC54LCB5OiBwLnksIHdpZHRoOiBwMi54LXAueCwgaGVpZ2h0OiBwMi55LXAueSB9O1xuICAgIC8vXG4gICAgY2FzZSAncG9seWdvbic6XG4gICAgICAgIGxldCBwdHMgPSBkc2hhcGUuYXR0cihcInBvaW50c1wiKS50cmltKCkuc3BsaXQoLyArLyk7XG5cdHJldHVybiBwdHMubWFwKCBwdCA9PiB7XG5cdCAgICBsZXQgeHkgPSBwdC5zcGxpdChcIixcIik7XG5cdCAgICBwLnggPSBwYXJzZUZsb2F0KHh5WzBdKVxuXHQgICAgcC55ID0gcGFyc2VGbG9hdCh4eVsxXSlcblx0ICAgIHAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHQgICAgcmV0dXJuIHsgeDogcC54LCB5OiBwLnkgfTtcblx0fSk7XG4gICAgLy9cbiAgICBjYXNlICdsaW5lJzpcblx0cC54ICAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieDFcIikpO1xuXHRwLnkgICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ5MVwiKSk7XG5cdHAyLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcIngyXCIpKTtcblx0cDIueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieTJcIikpO1xuXHRwICAgICA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdHAyICAgID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG4gICAgICAgIHJldHVybiB7IHgxOiBwLngsIHkxOiBwLnksIHgyOiBwMi54LCB4MjogcDIueSB9O1xuICAgIC8vXG4gICAgLy8gRklYTUU6IGFkZCBjYXNlICd0ZXh0J1xuICAgIC8vXG5cbiAgICBkZWZhdWx0OlxuXHR0aHJvdyBcIlVuc3VwcG9ydGVkIG5vZGUgdHlwZTogXCIgKyBzdHlwZTtcbiAgICB9XG5cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZW1vdmVzIGR1cGxpY2F0ZXMgZnJvbSBhIGxpc3Qgd2hpbGUgcHJlc2VydmluZyBsaXN0IG9yZGVyLlxuLy8gQXJnczpcbi8vICAgICBsc3QgKGxpc3QpXG4vLyBSZXR1cm5zOlxuLy8gICAgIEEgcHJvY2Vzc2VkIGNvcHkgb2YgbHN0IGluIHdoaWNoIGFueSBkdXBzIGhhdmUgYmVlbiByZW1vdmVkLlxuZnVuY3Rpb24gcmVtb3ZlRHVwcyAobHN0KSB7XG4gICAgbGV0IGxzdDIgPSBbXTtcbiAgICBsZXQgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICBsc3QuZm9yRWFjaCh4ID0+IHtcblx0Ly8gcmVtb3ZlIGR1cHMgd2hpbGUgcHJlc2VydmluZyBvcmRlclxuXHRpZiAoc2Vlbi5oYXMoeCkpIHJldHVybjtcblx0bHN0Mi5wdXNoKHgpO1xuXHRzZWVuLmFkZCh4KTtcbiAgICB9KTtcbiAgICByZXR1cm4gbHN0Mjtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBDbGlwcyBhIHZhbHVlIHRvIGEgcmFuZ2UuXG5mdW5jdGlvbiBjbGlwIChuLCBtaW4sIG1heCkge1xuICAgIHJldHVybiBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgbikpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IHtcbiAgICBpbml0T3B0TGlzdCxcbiAgICBkM3RzdixcbiAgICBkM2pzb24sXG4gICAgZGVlcGMsXG4gICAgcGFyc2VDb29yZHMsXG4gICAgZm9ybWF0Q29vcmRzLFxuICAgIG92ZXJsYXBzLFxuICAgIHN1YnRyYWN0LFxuICAgIG9iajJsaXN0LFxuICAgIHNhbWUsXG4gICAgZ2V0Q2FyZXRSYW5nZSxcbiAgICBzZXRDYXJldFJhbmdlLFxuICAgIHNldENhcmV0UG9zaXRpb24sXG4gICAgbW92ZUNhcmV0UG9zaXRpb24sXG4gICAgZ2V0Q2FyZXRQb3NpdGlvbixcbiAgICBjb29yZHNBZnRlclRyYW5zZm9ybSxcbiAgICByZW1vdmVEdXBzLFxuICAgIGNsaXBcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy91dGlscy5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIENvbXBvbmVudCB7XG4gICAgLy8gYXBwIC0gdGhlIG93bmluZyBhcHAgb2JqZWN0XG4gICAgLy8gZWx0IG1heSBiZSBhIHN0cmluZyAoc2VsZWN0b3IpLCBhIERPTSBub2RlLCBvciBhIGQzIHNlbGVjdGlvbiBvZiAxIG5vZGUuXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0KSB7XG5cdHRoaXMuYXBwID0gYXBwXG5cdGlmICh0eXBlb2YoZWx0KSA9PT0gXCJzdHJpbmdcIilcblx0ICAgIC8vIGVsdCBpcyBhIENTUyBzZWxlY3RvclxuXHQgICAgdGhpcy5yb290ID0gZDMuc2VsZWN0KGVsdCk7XG5cdGVsc2UgaWYgKHR5cGVvZihlbHQuc2VsZWN0QWxsKSA9PT0gXCJmdW5jdGlvblwiKVxuXHQgICAgLy8gZWx0IGlzIGEgZDMgc2VsZWN0aW9uXG5cdCAgICB0aGlzLnJvb3QgPSBlbHQ7XG5cdGVsc2UgaWYgKHR5cGVvZihlbHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUpID09PSBcImZ1bmN0aW9uXCIpXG5cdCAgICAvLyBlbHQgaXMgYSBET00gbm9kZVxuXHQgICAgdGhpcy5yb290ID0gZDMuc2VsZWN0KGVsdCk7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuICAgICAgICAvLyBvdmVycmlkZSBtZVxuICAgIH1cbn1cblxuZXhwb3J0IHsgQ29tcG9uZW50IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9Db21wb25lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgRmVhdHVyZSB7XG4gICAgY29uc3RydWN0b3IgKGNmZykge1xuICAgICAgICB0aGlzLmNociAgICAgPSBjZmcuY2hyIHx8IGNmZy5jaHJvbW9zb21lO1xuICAgICAgICB0aGlzLnN0YXJ0ICAgPSBjZmcuc3RhcnQ7XG4gICAgICAgIHRoaXMuZW5kICAgICA9IGNmZy5lbmQ7XG4gICAgICAgIHRoaXMuc3RyYW5kICA9IGNmZy5zdHJhbmQ7XG4gICAgICAgIHRoaXMudHlwZSAgICA9IGNmZy50eXBlO1xuICAgICAgICB0aGlzLmJpb3R5cGUgPSBjZmcuYmlvdHlwZTtcbiAgICAgICAgdGhpcy5tZ3BpZCAgID0gY2ZnLm1ncGlkIHx8IGNmZy5pZDtcbiAgICAgICAgdGhpcy5tZ2lpZCAgID0gY2ZnLm1naWlkO1xuICAgICAgICB0aGlzLnN5bWJvbCAgPSBjZmcuc3ltYm9sO1xuICAgICAgICB0aGlzLmdlbm9tZSAgPSBjZmcuZ2Vub21lO1xuXHR0aGlzLmNvbnRpZyAgPSBwYXJzZUludChjZmcuY29udGlnKTtcblx0dGhpcy5sYW5lICAgID0gcGFyc2VJbnQoY2ZnLmxhbmUpO1xuICAgICAgICBpZiAodGhpcy5tZ2lpZCA9PT0gXCIuXCIpIHRoaXMubWdpaWQgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5zeW1ib2wgPT09IFwiLlwiKSB0aGlzLnN5bWJvbCA9IG51bGw7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBJRCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1ncGlkO1xuICAgIH1cbiAgICBnZXQgY2Fub25pY2FsICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdpaWQ7XG4gICAgfVxuICAgIGdldCBpZCAoKSB7XG5cdC8vIEZJWE1FOiByZW1vdmUgdGhpcyBtZXRob2RcbiAgICAgICAgcmV0dXJuIHRoaXMubWdpaWQgfHwgdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGxhYmVsICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sIHx8IHRoaXMubWdwaWQ7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBsZW5ndGggKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbmQgLSB0aGlzLnN0YXJ0ICsgMTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0TXVuZ2VkVHlwZSAoKSB7XG5cdHJldHVybiB0aGlzLnR5cGUgPT09IFwiZ2VuZVwiID9cblx0ICAgICh0aGlzLmJpb3R5cGUgPT09IFwicHJvdGVpbl9jb2RpbmdcIiB8fCB0aGlzLmJpb3R5cGUgPT09IFwicHJvdGVpbiBjb2RpbmcgZ2VuZVwiKSA/XG5cdFx0XCJwcm90ZWluX2NvZGluZ19nZW5lXCJcblx0XHQ6XG5cdFx0dGhpcy5iaW90eXBlLmluZGV4T2YoXCJwc2V1ZG9nZW5lXCIpID49IDAgP1xuXHRcdCAgICBcInBzZXVkb2dlbmVcIlxuXHRcdCAgICA6XG5cdFx0ICAgICh0aGlzLmJpb3R5cGUuaW5kZXhPZihcIlJOQVwiKSA+PSAwIHx8IHRoaXMuYmlvdHlwZS5pbmRleE9mKFwiYW50aXNlbnNlXCIpID49IDApID9cblx0XHRcdFwibmNSTkFfZ2VuZVwiXG5cdFx0XHQ6XG5cdFx0XHR0aGlzLmJpb3R5cGUuaW5kZXhPZihcInNlZ21lbnRcIikgPj0gMCA/XG5cdFx0XHQgICAgXCJnZW5lX3NlZ21lbnRcIlxuXHRcdFx0ICAgIDpcblx0XHRcdCAgICBcIm90aGVyX2dlbmVcIlxuXHQgICAgOlxuXHQgICAgdGhpcy50eXBlID09PSBcInBzZXVkb2dlbmVcIiA/XG5cdFx0XCJwc2V1ZG9nZW5lXCJcblx0XHQ6XG5cdFx0dGhpcy50eXBlLmluZGV4T2YoXCJnZW5lX3NlZ21lbnRcIikgPj0gMCA/XG5cdFx0ICAgIFwiZ2VuZV9zZWdtZW50XCJcblx0XHQgICAgOlxuXHRcdCAgICB0aGlzLnR5cGUuaW5kZXhPZihcIlJOQVwiKSA+PSAwID9cblx0XHRcdFwibmNSTkFfZ2VuZVwiXG5cdFx0XHQ6XG5cdFx0XHR0aGlzLnR5cGUuaW5kZXhPZihcImdlbmVcIikgPj0gMCA/XG5cdFx0XHQgICAgXCJvdGhlcl9nZW5lXCJcblx0XHRcdCAgICA6XG5cdFx0XHQgICAgXCJvdGhlcl9mZWF0dXJlX3R5cGVcIjtcbiAgICB9XG59XG5cbmV4cG9ydCB7IEZlYXR1cmUgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZlYXR1cmUuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgUFJFRklYPVwiYXBwcy5tZ3YuXCI7XG4gXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEludGVyYWN0cyB3aXRoIGxvY2FsU3RvcmFnZS5cbi8vXG5jbGFzcyBTdG9yYWdlTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUsIHN0b3JhZ2UpIHtcblx0dGhpcy5uYW1lID0gUFJFRklYK25hbWU7XG5cdHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2U7XG5cdHRoaXMubXlEYXRhT2JqID0gbnVsbDtcblx0Ly9cblx0dGhpcy5fbG9hZCgpO1xuICAgIH1cbiAgICBfbG9hZCAoKSB7XG5cdC8vIGxvYWRzIG15RGF0YU9iaiBmcm9tIHN0b3JhZ2VcbiAgICAgICAgbGV0IHMgPSB0aGlzLnN0b3JhZ2UuZ2V0SXRlbSh0aGlzLm5hbWUpO1xuXHR0aGlzLm15RGF0YU9iaiA9IHMgPyBKU09OLnBhcnNlKHMpIDoge307XG4gICAgfVxuICAgIF9zYXZlICgpIHtcblx0Ly8gd3JpdGVzIG15RGF0YU9iaiB0byBzdG9yYWdlXG4gICAgICAgIGxldCBzID0gSlNPTi5zdHJpbmdpZnkodGhpcy5teURhdGFPYmopO1xuXHR0aGlzLnN0b3JhZ2Uuc2V0SXRlbSh0aGlzLm5hbWUsIHMpXG4gICAgfVxuICAgIGdldCAobikge1xuICAgICAgICByZXR1cm4gdGhpcy5teURhdGFPYmpbbl07XG4gICAgfVxuICAgIHB1dCAobiwgdikge1xuICAgICAgICB0aGlzLm15RGF0YU9ialtuXSA9IHY7XG5cdHRoaXMuX3NhdmUoKTtcbiAgICB9XG59XG4vL1xuY2xhc3MgU2Vzc2lvblN0b3JhZ2VNYW5hZ2VyIGV4dGVuZHMgU3RvcmFnZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lKSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSk7XG4gICAgfVxufVxuLy9cbmNsYXNzIExvY2FsU3RvcmFnZU1hbmFnZXIgZXh0ZW5kcyBTdG9yYWdlTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUpIHtcbiAgICAgICAgc3VwZXIobmFtZSwgd2luZG93LmxvY2FsU3RvcmFnZSk7XG4gICAgfVxufVxuLy9cbmV4cG9ydCB7IFNlc3Npb25TdG9yYWdlTWFuYWdlciwgTG9jYWxTdG9yYWdlTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvU3RvcmFnZU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQYXJzZXMgYSBsaXN0IG9wZXJhdG9yIGV4cHJlc3Npb24sIGVnIFwiKGEgKyBiKSpjIC0gZFwiXG4vLyBSZXR1cm5zIGFuIGFic3RyYWN0IHN5bnRheCB0cmVlLlxuLy8gICAgIExlYWYgbm9kZXMgPSBsaXN0IG5hbWVzLiBUaGV5IGFyZSBzaW1wbGUgc3RyaW5ncy5cbi8vICAgICBJbnRlcmlvciBub2RlcyA9IG9wZXJhdGlvbnMuIFRoZXkgbG9vayBsaWtlOiB7bGVmdDpub2RlLCBvcDpzdHJpbmcsIHJpZ2h0Om5vZGV9XG4vLyBcbmNsYXNzIExpc3RGb3JtdWxhUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG5cdHRoaXMucl9vcCAgICA9IC9bKy1dLztcblx0dGhpcy5yX29wMiAgID0gL1sqXS87XG5cdHRoaXMucl9vcHMgICA9IC9bKCkrKi1dLztcblx0dGhpcy5yX2lkZW50ID0gL1thLXpBLVpfXVthLXpBLVowLTlfXSovO1xuXHR0aGlzLnJfcXN0ciAgPSAvXCJbXlwiXSpcIi87XG5cdHRoaXMucmUgPSBuZXcgUmVnRXhwKGAoJHt0aGlzLnJfb3BzLnNvdXJjZX18JHt0aGlzLnJfcXN0ci5zb3VyY2V9fCR7dGhpcy5yX2lkZW50LnNvdXJjZX0pYCwgJ2cnKTtcblx0Ly90aGlzLnJlID0gLyhbKCkrKi1dfFwiW15cIl0rXCJ8W2EtekEtWl9dW2EtekEtWjAtOV9dKikvZ1xuXHR0aGlzLl9pbml0KFwiXCIpO1xuICAgIH1cbiAgICBfaW5pdCAocykge1xuICAgICAgICB0aGlzLmV4cHIgPSBzO1xuXHR0aGlzLnRva2VucyA9IHRoaXMuZXhwci5tYXRjaCh0aGlzLnJlKSB8fCBbXTtcblx0dGhpcy5pID0gMDtcbiAgICB9XG4gICAgX3BlZWtUb2tlbigpIHtcblx0cmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuaV07XG4gICAgfVxuICAgIF9uZXh0VG9rZW4gKCkge1xuXHRsZXQgdDtcbiAgICAgICAgaWYgKHRoaXMuaSA8IHRoaXMudG9rZW5zLmxlbmd0aCkge1xuXHQgICAgdCA9IHRoaXMudG9rZW5zW3RoaXMuaV07XG5cdCAgICB0aGlzLmkgKz0gMTtcblx0fVxuXHRyZXR1cm4gdDtcbiAgICB9XG4gICAgX2V4cHIgKCkge1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuX3Rlcm0oKTtcblx0bGV0IG9wID0gdGhpcy5fcGVla1Rva2VuKCk7XG5cdGlmIChvcCA9PT0gXCIrXCIgfHwgb3AgPT09IFwiLVwiKSB7XG5cdCAgICB0aGlzLl9uZXh0VG9rZW4oKTtcblx0ICAgIG5vZGUgPSB7IGxlZnQ6bm9kZSwgb3A6b3A9PT1cIitcIj9cInVuaW9uXCI6XCJkaWZmZXJlbmNlXCIsIHJpZ2h0OiB0aGlzLl9leHByKCkgfVxuXHQgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH0gICAgICAgICAgICAgICBcblx0ZWxzZSBpZiAob3AgPT09IFwiKVwiIHx8IG9wID09PSB1bmRlZmluZWQgfHwgb3AgPT09IG51bGwpXG5cdCAgICByZXR1cm4gbm9kZTtcblx0ZWxzZVxuXHQgICAgdGhpcy5fZXJyb3IoXCJVTklPTiBvciBJTlRFUlNFQ1RJT04gb3IgKSBvciBOVUxMXCIsIG9wKTtcbiAgICB9XG4gICAgX3Rlcm0gKCkge1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuX2ZhY3RvcigpO1xuXHRsZXQgb3AgPSB0aGlzLl9wZWVrVG9rZW4oKTtcblx0aWYgKG9wID09PSBcIipcIikge1xuXHQgICAgdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBub2RlID0geyBsZWZ0Om5vZGUsIG9wOlwiaW50ZXJzZWN0aW9uXCIsIHJpZ2h0OiB0aGlzLl9mYWN0b3IoKSB9XG5cdH1cblx0cmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIF9mYWN0b3IgKCkge1xuICAgICAgICBsZXQgdCA9IHRoaXMuX25leHRUb2tlbigpO1xuXHRpZiAodCA9PT0gXCIoXCIpe1xuXHQgICAgbGV0IG5vZGUgPSB0aGlzLl9leHByKCk7XG5cdCAgICBsZXQgbnQgPSB0aGlzLl9uZXh0VG9rZW4oKTtcblx0ICAgIGlmIChudCAhPT0gXCIpXCIpIHRoaXMuX2Vycm9yKFwiJyknXCIsIG50KTtcblx0ICAgIHJldHVybiBub2RlO1xuXHR9XG5cdGVsc2UgaWYgKHQgJiYgKHQuc3RhcnRzV2l0aCgnXCInKSkpIHtcblx0ICAgIHJldHVybiB0LnN1YnN0cmluZygxLCB0Lmxlbmd0aC0xKTtcblx0fVxuXHRlbHNlIGlmICh0ICYmIHQubWF0Y2goL1thLXpBLVpfXS8pKSB7XG5cdCAgICByZXR1cm4gdDtcblx0fVxuXHRlbHNlXG5cdCAgICB0aGlzLl9lcnJvcihcIkVYUFIgb3IgSURFTlRcIiwgdHx8XCJOVUxMXCIpO1xuXHRyZXR1cm4gdDtcblx0ICAgIFxuICAgIH1cbiAgICBfZXJyb3IgKGV4cGVjdGVkLCBzYXcpIHtcbiAgICAgICAgdGhyb3cgYFBhcnNlIGVycm9yOiBleHBlY3RlZCAke2V4cGVjdGVkfSBidXQgc2F3ICR7c2F3fS5gO1xuICAgIH1cbiAgICAvLyBQYXJzZXMgdGhlIHN0cmluZyBhbmQgcmV0dXJucyB0aGUgYWJzdHJhY3Qgc3ludGF4IHRyZWUuXG4gICAgLy8gVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGVyZSBpcyBhIHN5bnRheCBlcnJvci5cbiAgICBwYXJzZSAocykge1xuXHR0aGlzLl9pbml0KHMpO1xuXHRyZXR1cm4gdGhpcy5fZXhwcigpO1xuICAgIH1cbiAgICAvLyByZXR1cm5zIHRydWUgaWZmIHN0cmluZyBpcyBzeW50YWN0aWNhbGx5IHZhbGlkXG4gICAgaXNWYWxpZCAocykge1xuICAgICAgICB0cnkge1xuXHQgICAgdGhpcy5wYXJzZShzKTtcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9XG5cdGNhdGNoIChlKSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IExpc3RGb3JtdWxhUGFyc2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgU1ZHVmlldyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0LCBtYXJnaW5zLCByb3RhdGlvbiwgdHJhbnNsYXRpb24pIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuICAgICAgICB0aGlzLnN2ZyA9IHRoaXMucm9vdC5zZWxlY3QoXCJzdmdcIik7XG4gICAgICAgIHRoaXMuc3ZnTWFpbiA9IHRoaXMuc3ZnXG4gICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKSAgICAvLyB0aGUgbWFyZ2luLXRyYW5zbGF0ZWQgZ3JvdXBcbiAgICAgICAgICAgIC5hcHBlbmQoXCJnXCIpXHQgIC8vIG1haW4gZ3JvdXAgZm9yIHRoZSBkcmF3aW5nXG5cdCAgICAuYXR0cihcIm5hbWVcIixcInN2Z21haW5cIik7XG5cdHRoaXMub3V0ZXJXaWR0aCA9IDEwMDtcblx0dGhpcy53aWR0aCA9IDEwMDtcblx0dGhpcy5vdXRlckhlaWdodCA9IDEwMDtcblx0dGhpcy5oZWlnaHQgPSAxMDA7XG5cdHRoaXMubWFyZ2lucyA9IHt0b3A6IDE4LCByaWdodDogMTIsIGJvdHRvbTogMTIsIGxlZnQ6IDEyfTtcblx0dGhpcy5yb3RhdGlvbiA9IDA7XG5cdHRoaXMudHJhbnNsYXRpb24gPSBbMCwwXTtcblx0Ly9cbiAgICAgICAgdGhpcy5zZXRHZW9tKHt3aWR0aCwgaGVpZ2h0LCBtYXJnaW5zLCByb3RhdGlvbiwgdHJhbnNsYXRpb259KTtcbiAgICB9XG4gICAgc2V0R2VvbSAoY2ZnKSB7XG4gICAgICAgIHRoaXMub3V0ZXJXaWR0aCAgPSBjZmcud2lkdGggICAgICAgfHwgdGhpcy5vdXRlcldpZHRoO1xuICAgICAgICB0aGlzLm91dGVySGVpZ2h0ID0gY2ZnLmhlaWdodCAgICAgIHx8IHRoaXMub3V0ZXJIZWlnaHQ7XG4gICAgICAgIHRoaXMubWFyZ2lucyAgICAgPSBjZmcubWFyZ2lucyAgICAgfHwgdGhpcy5tYXJnaW5zO1xuXHR0aGlzLnJvdGF0aW9uICAgID0gdHlwZW9mKGNmZy5yb3RhdGlvbikgPT09IFwibnVtYmVyXCIgPyBjZmcucm90YXRpb24gOiB0aGlzLnJvdGF0aW9uO1xuXHR0aGlzLnRyYW5zbGF0aW9uID0gY2ZnLnRyYW5zbGF0aW9uIHx8IHRoaXMudHJhbnNsYXRpb247XG4gICAgICAgIC8vXG4gICAgICAgIHRoaXMud2lkdGggID0gdGhpcy5vdXRlcldpZHRoICAtIHRoaXMubWFyZ2lucy5sZWZ0IC0gdGhpcy5tYXJnaW5zLnJpZ2h0O1xuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMub3V0ZXJIZWlnaHQgLSB0aGlzLm1hcmdpbnMudG9wICAtIHRoaXMubWFyZ2lucy5ib3R0b207XG4gICAgICAgIC8vXG4gICAgICAgIHRoaXMuc3ZnLmF0dHIoXCJ3aWR0aFwiLCB0aGlzLm91dGVyV2lkdGgpXG4gICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMub3V0ZXJIZWlnaHQpXG4gICAgICAgICAgICAuc2VsZWN0KCdnW25hbWU9XCJzdmdtYWluXCJdJylcbiAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke3RoaXMubWFyZ2lucy5sZWZ0fSwke3RoaXMubWFyZ2lucy50b3B9KSByb3RhdGUoJHt0aGlzLnJvdGF0aW9ufSkgdHJhbnNsYXRlKCR7dGhpcy50cmFuc2xhdGlvblswXX0sJHt0aGlzLnRyYW5zbGF0aW9uWzFdfSlgKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldE1hcmdpbnMoIHRtLCBybSwgYm0sIGxtICkge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHQgICAgcm0gPSBibSA9IGxtID0gdG07XG5cdH1cblx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuXHQgICAgYm0gPSB0bTtcblx0ICAgIGxtID0gcm07XG5cdH1cblx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gNClcblx0ICAgIHRocm93IFwiQmFkIGFyZ3VtZW50cy5cIjtcbiAgICAgICAgLy9cblx0dGhpcy5zZXRHZW9tKHt0b3A6IHRtLCByaWdodDogcm0sIGJvdHRvbTogYm0sIGxlZnQ6IGxtfSk7XG5cdC8vXG5cdHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByb3RhdGUgKGRlZykge1xuICAgICAgICB0aGlzLnNldEdlb20oe3JvdGF0aW9uOmRlZ30pO1xuXHRyZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdHJhbnNsYXRlIChkeCwgZHkpIHtcbiAgICAgICAgdGhpcy5zZXRHZW9tKHt0cmFuc2xhdGlvbjpbZHgsZHldfSk7XG5cdHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgdGhlIHdpbmRvdyB3aWR0aFxuICAgIGZpdFRvV2lkdGggKHdpZHRoKSB7XG4gICAgICAgIGxldCByID0gdGhpcy5zdmdbMF1bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMuc2V0R2VvbSh7d2lkdGg6IHdpZHRoIC0gci54fSlcblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuXG59IC8vIGVuZCBjbGFzcyBTVkdWaWV3XG5cbmV4cG9ydCB7IFNWR1ZpZXcgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1NWR1ZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTUdWQXBwIH0gZnJvbSAnLi9NR1ZBcHAnO1xuaW1wb3J0IHsgcmVtb3ZlRHVwcyB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy9cbi8vIHBxc3RyaW5nID0gUGFyc2UgcXN0cmluZy4gUGFyc2VzIHRoZSBwYXJhbWV0ZXIgcG9ydGlvbiBvZiB0aGUgVVJMLlxuLy9cbmZ1bmN0aW9uIHBxc3RyaW5nIChxc3RyaW5nKSB7XG4gICAgLy9cbiAgICBsZXQgY2ZnID0ge307XG5cbiAgICAvLyBGSVhNRTogVVJMU2VhcmNoUGFyYW1zIEFQSSBpcyBub3Qgc3VwcG9ydGVkIGluIGFsbCBicm93c2Vycy5cbiAgICAvLyBPSyBmb3IgZGV2ZWxvcG1lbnQgYnV0IG5lZWQgYSBmYWxsYmFjayBldmVudHVhbGx5LlxuICAgIGxldCBwcm1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhxc3RyaW5nKTtcbiAgICBsZXQgZ2Vub21lcyA9IFtdO1xuXG4gICAgLy8gLS0tLS0gZ2Vub21lcyAtLS0tLS0tLS0tLS1cbiAgICBsZXQgcGdlbm9tZXMgPSBwcm1zLmdldChcImdlbm9tZXNcIikgfHwgXCJcIjtcbiAgICAvLyBGb3Igbm93LCBhbGxvdyBcImNvbXBzXCIgYXMgc3lub255bSBmb3IgXCJnZW5vbWVzXCIuIEV2ZW50dWFsbHksIGRvbid0IHN1cHBvcnQgXCJjb21wc1wiLlxuICAgIHBnZW5vbWVzID0gKHBnZW5vbWVzICsgIFwiIFwiICsgKHBybXMuZ2V0KFwiY29tcHNcIikgfHwgXCJcIikpO1xuICAgIC8vXG4gICAgcGdlbm9tZXMgPSByZW1vdmVEdXBzKHBnZW5vbWVzLnRyaW0oKS5zcGxpdCgvICsvKSk7XG4gICAgcGdlbm9tZXMubGVuZ3RoID4gMCAmJiAoY2ZnLmdlbm9tZXMgPSBwZ2Vub21lcyk7XG5cbiAgICAvLyAtLS0tLSByZWYgZ2Vub21lIC0tLS0tLS0tLS0tLVxuICAgIGxldCByZWYgPSBwcm1zLmdldChcInJlZlwiKTtcbiAgICByZWYgJiYgKGNmZy5yZWYgPSByZWYpO1xuXG4gICAgLy8gLS0tLS0gaGlnaGxpZ2h0IElEcyAtLS0tLS0tLS0tLS0tLVxuICAgIGxldCBobHMgPSBuZXcgU2V0KCk7XG4gICAgbGV0IGhsczAgPSBwcm1zLmdldChcImhpZ2hsaWdodFwiKTtcbiAgICBpZiAoaGxzMCkge1xuXHRobHMwID0gaGxzMC5yZXBsYWNlKC9bICxdKy9nLCAnICcpLnNwbGl0KCcgJykuZmlsdGVyKHg9PngpO1xuXHRobHMwLmxlbmd0aCA+IDAgJiYgKGNmZy5oaWdobGlnaHQgPSBobHMwKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLSBjb29yZGluYXRlcyAtLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgbGV0IGNociAgID0gcHJtcy5nZXQoXCJjaHJcIik7XG4gICAgbGV0IHN0YXJ0ID0gcHJtcy5nZXQoXCJzdGFydFwiKTtcbiAgICBsZXQgZW5kICAgPSBwcm1zLmdldChcImVuZFwiKTtcbiAgICBjaHIgICAmJiAoY2ZnLmNociA9IGNocik7XG4gICAgc3RhcnQgJiYgKGNmZy5zdGFydCA9IHBhcnNlSW50KHN0YXJ0KSk7XG4gICAgZW5kICAgJiYgKGNmZy5lbmQgPSBwYXJzZUludChlbmQpKTtcbiAgICAvL1xuICAgIGxldCBsYW5kbWFyayA9IHBybXMuZ2V0KFwibGFuZG1hcmtcIik7XG4gICAgbGV0IGZsYW5rICAgID0gcHJtcy5nZXQoXCJmbGFua1wiKTtcbiAgICBsZXQgbGVuZ3RoICAgPSBwcm1zLmdldChcImxlbmd0aFwiKTtcbiAgICBsZXQgZGVsdGEgICAgPSBwcm1zLmdldChcImRlbHRhXCIpO1xuICAgIGxhbmRtYXJrICYmIChjZmcubGFuZG1hcmsgPSBsYW5kbWFyayk7XG4gICAgZmxhbmsgICAgJiYgKGNmZy5mbGFuayA9IHBhcnNlSW50KGZsYW5rKSk7XG4gICAgbGVuZ3RoICAgJiYgKGNmZy5sZW5ndGggPSBwYXJzZUludChsZW5ndGgpKTtcbiAgICBkZWx0YSAgICAmJiAoY2ZnLmRlbHRhID0gcGFyc2VJbnQoZGVsdGEpKTtcbiAgICAvL1xuICAgIC8vIC0tLS0tIGRyYXdpbmcgbW9kZSAtLS0tLS0tLS0tLS0tXG4gICAgbGV0IGRtb2RlID0gcHJtcy5nZXQoXCJkbW9kZVwiKTtcbiAgICBkbW9kZSAmJiAoY2ZnLmRtb2RlID0gZG1vZGUpO1xuICAgIC8vXG4gICAgcmV0dXJuIGNmZztcbn1cblxuXG4vLyBUaGUgbWFpbiBwcm9ncmFtLCB3aGVyZWluIHRoZSBhcHAgaXMgY3JlYXRlZCBhbmQgd2lyZWQgdG8gdGhlIGJyb3dzZXIuIFxuLy9cbmZ1bmN0aW9uIF9fbWFpbl9fIChzZWxlY3Rvcikge1xuICAgIC8vIEJlaG9sZCwgdGhlIE1HViBhcHBsaWNhdGlvbiBvYmplY3QuLi5cbiAgICBsZXQgbWd2ID0gbnVsbDtcblxuICAgIC8vIENhbGxiYWNrIHRvIHBhc3MgaW50byB0aGUgYXBwIHRvIHJlZ2lzdGVyIGNoYW5nZXMgaW4gY29udGV4dC5cbiAgICAvLyBVc2VzIHRoZSBjdXJyZW50IGFwcCBjb250ZXh0IHRvIHNldCB0aGUgaGFzaCBwYXJ0IG9mIHRoZVxuICAgIC8vIGJyb3dzZXIncyBsb2NhdGlvbi4gVGhpcyBhbHNvIHJlZ2lzdGVycyB0aGUgY2hhbmdlIGluIFxuICAgIC8vIHRoZSBicm93c2VyIGhpc3RvcnkuXG4gICAgZnVuY3Rpb24gc2V0SGFzaCAoKSB7XG5cdGxldCBuZXdIYXNoID0gbWd2LmdldFBhcmFtU3RyaW5nKCk7XG5cdGlmICgnIycrbmV3SGFzaCA9PT0gd2luZG93LmxvY2F0aW9uLmhhc2gpXG5cdCAgICByZXR1cm47XG5cdC8vIHRlbXBvcmFyaWx5IGRpc2FibGUgcG9wc3RhdGUgaGFuZGxlclxuXHRsZXQgZiA9IHdpbmRvdy5vbnBvcHN0YXRlO1xuXHR3aW5kb3cub25wb3BzdGF0ZSA9IG51bGw7XG5cdC8vIG5vdyBzZXQgdGhlIGhhc2hcblx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSBuZXdIYXNoO1xuXHQvLyByZS1lbmFibGVcblx0d2luZG93Lm9ucG9wc3RhdGUgPSBmO1xuICAgIH1cbiAgICAvLyBIYW5kbGVyIGNhbGxlZCB3aGVuIHVzZXIgY2xpY2tzIHRoZSBicm93c2VyJ3MgYmFjayBvciBmb3J3YXJkIGJ1dHRvbnMuXG4gICAgLy8gU2V0cyB0aGUgYXBwJ3MgY29udGV4dCBiYXNlZCBvbiB0aGUgaGFzaCBwYXJ0IG9mIHRoZSBicm93c2VyJ3NcbiAgICAvLyBsb2NhdGlvbi5cbiAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdGxldCBjZmcgPSBwcXN0cmluZyhkb2N1bWVudC5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG5cdG1ndi5zZXRDb250ZXh0KGNmZywgdHJ1ZSk7XG4gICAgfTtcbiAgICAvLyBnZXQgaW5pdGlhbCBzZXQgb2YgY29udGV4dCBwYXJhbXMgXG4gICAgbGV0IHFzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSk7XG4gICAgbGV0IGNmZyA9IHBxc3RyaW5nKHFzdHJpbmcpO1xuICAgIGNmZy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNmZy5vbmNvbnRleHRjaGFuZ2UgPSBzZXRIYXNoO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBhcHBcbiAgICB3aW5kb3cubWd2ID0gbWd2ID0gbmV3IE1HVkFwcChzZWxlY3RvciwgY2ZnKTtcbiAgICBcbiAgICAvLyBoYW5kbGUgcmVzaXplIGV2ZW50c1xuICAgIHdpbmRvdy5vbnJlc2l6ZSA9ICgpID0+IHttZ3YucmVzaXplKCk7bWd2LnNldENvbnRleHQoe30pO31cbn1cblxuXG5fX21haW5fXyhcIiNtZ3ZcIik7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy92aWV3ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgcGFyc2VDb29yZHMsIGZvcm1hdENvb3JkcywgZDN0c3YsIGluaXRPcHRMaXN0LCBzYW1lLCBjbGlwIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBHZW5vbWUgfSAgICAgICAgICBmcm9tICcuL0dlbm9tZSc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSAgICAgICBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBGZWF0dXJlTWFuYWdlciB9ICBmcm9tICcuL0ZlYXR1cmVNYW5hZ2VyJztcbmltcG9ydCB7IFF1ZXJ5TWFuYWdlciB9ICAgIGZyb20gJy4vUXVlcnlNYW5hZ2VyJztcbmltcG9ydCB7IExpc3RNYW5hZ2VyIH0gICAgIGZyb20gJy4vTGlzdE1hbmFnZXInO1xuaW1wb3J0IHsgTGlzdEVkaXRvciB9ICAgICAgZnJvbSAnLi9MaXN0RWRpdG9yJztcbmltcG9ydCB7IFVzZXJQcmVmc01hbmFnZXIgfSBmcm9tICcuL1VzZXJQcmVmc01hbmFnZXInO1xuaW1wb3J0IHsgRmFjZXRNYW5hZ2VyIH0gICAgZnJvbSAnLi9GYWNldE1hbmFnZXInO1xuaW1wb3J0IHsgQlRNYW5hZ2VyIH0gICAgICAgZnJvbSAnLi9CVE1hbmFnZXInO1xuaW1wb3J0IHsgR2Vub21lVmlldyB9ICAgICAgZnJvbSAnLi9HZW5vbWVWaWV3JztcbmltcG9ydCB7IEZlYXR1cmVEZXRhaWxzIH0gIGZyb20gJy4vRmVhdHVyZURldGFpbHMnO1xuaW1wb3J0IHsgWm9vbVZpZXcgfSAgICAgICAgZnJvbSAnLi9ab29tVmlldyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgTUdWQXBwIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoc2VsZWN0b3IsIGNmZykge1xuXHRzdXBlcihudWxsLCBzZWxlY3Rvcik7XG5cdHRoaXMuYXBwID0gdGhpcztcblx0Ly9cblx0dGhpcy5pbml0aWFsQ2ZnID0gY2ZnO1xuXHQvL1xuXHR0aGlzLmNvbnRleHRDaGFuZ2VkID0gKGNmZy5vbmNvbnRleHRjaGFuZ2UgfHwgZnVuY3Rpb24oKXt9KTtcblx0Ly9cblx0dGhpcy5uYW1lMmdlbm9tZSA9IHt9OyAgLy8gbWFwIGZyb20gZ2Vub21lIG5hbWUgLT4gZ2Vub21lIGRhdGEgb2JqXG5cdHRoaXMubGFiZWwyZ2Vub21lID0ge307IC8vIG1hcCBmcm9tIGdlbm9tZSBsYWJlbCAtPiBnZW5vbWUgZGF0YSBvYmpcblx0dGhpcy5ubDJnZW5vbWUgPSB7fTsgICAgLy8gY29tYmluZXMgaW5kZXhlc1xuXHQvL1xuXHR0aGlzLmFsbEdlbm9tZXMgPSBbXTsgICAvLyBsaXN0IG9mIGFsbCBhdmFpbGFibGUgZ2Vub21lc1xuXHR0aGlzLnJHZW5vbWUgPSBudWxsOyAgICAvLyB0aGUgY3VycmVudCByZWZlcmVuY2UgZ2Vub21lXG5cdHRoaXMuY0dlbm9tZXMgPSBbXTsgICAgIC8vIGN1cnJlbnQgY29tcGFyaXNvbiBnZW5vbWVzIChyR2Vub21lIGlzICpub3QqIGluY2x1ZGVkKS5cblx0dGhpcy52R2Vub21lcyA9IFtdO1x0Ly8gbGlzdCBvZiBhbGwgY3VycmVudHkgdmlld2VkIGdlbm9tZXMgKHJlZitjb21wcykgaW4gWS1vcmRlci5cblx0Ly9cblx0dGhpcy5kdXIgPSAyNTA7ICAgICAgICAgLy8gYW5pbWF0aW9uIGR1cmF0aW9uLCBpbiBtc1xuXHR0aGlzLmRlZmF1bHRab29tID0gMjtcdC8vIG11bHRpcGxpZXIgb2YgY3VycmVudCByYW5nZSB3aWR0aC4gTXVzdCBiZSA+PSAxLiAxID09IG5vIHpvb20uXG5cdFx0XHRcdC8vICh6b29taW5nIGluIHVzZXMgMS90aGlzIGFtb3VudClcblx0dGhpcy5kZWZhdWx0UGFuICA9IDAuMTU7Ly8gZnJhY3Rpb24gb2YgY3VycmVudCByYW5nZSB3aWR0aFxuXG5cdC8vIENvb3JkaW5hdGVzIG1heSBiZSBzcGVjaWZpZWQgaW4gb25lIG9mIHR3byB3YXlzOiBtYXBwZWQgb3IgbGFuZG1hcmsuIFxuXHQvLyBNYXBwZWQgY29vcmRpbmF0ZXMgYXJlIHNwZWNpZmllZCBhcyBjaHJvbW9zb21lK3N0YXJ0K2VuZC4gVGhpcyBjb29yZGluYXRlIHJhbmdlIGlzIGRlZmluZWQgcmVsYXRpdmUgdG8gXG5cdC8vIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBnZW5vbWUsIGFuZCBpcyBtYXBwZWQgdG8gdGhlIGNvcnJlc3BvbmRpbmcgcmFuZ2UocykgaW4gZWFjaCBjb21wYXJpc29uIGdlbm9tZS5cblx0Ly8gTGFuZG1hcmsgY29vcmRpbmF0ZXMgYXJlIHNwZWNpZmllZCBhcyBsYW5kbWFyaytbZmxhbmt8d2lkdGhdK2RlbHRhLiBUaGUgbGFuZG1hcmsgaXMgbG9va2VkIHVwIGluIGVhY2ggXG5cdC8vIGdlbm9tZS4gSXRzIGNvb3JkaW5hdGVzLCBjb21iaW5lZCB3aXRoIGZsYW5rfGxlbmd0aCBhbmQgZGVsdGEsIGRldGVybWluZSB0aGUgYWJzb2x1dGUgY29vcmRpbmF0ZSByYW5nZVxuXHQvLyBpbiB0aGF0IGdlbm9tZS4gSWYgdGhlIGxhbmRtYXJrIGRvZXMgbm90IGV4aXN0IGluIGEgZ2l2ZW4gZ2Vub21lLCB0aGVuIG1hcHBlZCBjb29yZGluYXRlIGFyZSB1c2VkLlxuXHQvLyBcblx0dGhpcy5jbW9kZSA9ICdtYXBwZWQnIC8vICdtYXBwZWQnIG9yICdsYW5kbWFyaydcblx0dGhpcy5jb29yZHMgPSB7IGNocjogJzEnLCBzdGFydDogMTAwMDAwMCwgZW5kOiAxMDAwMDAwMCB9OyAgLy8gbWFwcGVkXG5cdHRoaXMubGNvb3JkcyA9IHsgbGFuZG1hcms6ICdQYXg2JywgZmxhbms6IDUwMDAwMCwgZGVsdGE6MCB9Oy8vIGxhbmRtYXJrXG5cblx0Ly9cblx0Ly8gVE9ETzogcmVmYWN0b3IgcGFnZWJveCwgZHJhZ2dhYmxlLCBhbmQgZnJpZW5kcyBpbnRvIGEgZnJhbWV3b3JrIG1vZHVsZSxcblx0Ly8gXG5cdHRoaXMucGJEcmFnZ2VyID0gdGhpcy5nZXRDb250ZW50RHJhZ2dlcigpO1xuXHRkMy5zZWxlY3RBbGwoJy5wYWdlYm94Jylcblx0ICAgIC5jYWxsKHRoaXMucGJEcmFnZ2VyKVxuXHQgICAgLmFwcGVuZCgnaScpXG5cdCAgICAuYXR0cignY2xhc3MnLCdtYXRlcmlhbC1pY29ucyBidXN5IHJvdGF0aW5nJylcblx0ICAgIDtcblx0ZDMuc2VsZWN0QWxsKCcuY2xvc2FibGUnKVxuXHQgICAgLmFwcGVuZCgnaScpXG5cdFx0LmF0dHIoJ2NsYXNzJywnbWF0ZXJpYWwtaWNvbnMgYnV0dG9uIGNsb3NlJylcblx0XHQuYXR0cigndGl0bGUnLCdDbGljayB0byBvcGVuL2Nsb3NlLicpXG5cdFx0Lm9uKCdjbGljay5kZWZhdWx0JywgZnVuY3Rpb24gKCkge1xuXHRcdCAgICBsZXQgcCA9IGQzLnNlbGVjdCh0aGlzLnBhcmVudE5vZGUpO1xuXHRcdCAgICBwLmNsYXNzZWQoJ2Nsb3NlZCcsICEgcC5jbGFzc2VkKCdjbG9zZWQnKSk7XG5cdFx0ICAgIGQzLnNlbGVjdCh0aGlzKS5hdHRyKCd0aXRsZScsJ0NsaWNrIHRvICcgKyAgKHAuY2xhc3NlZCgnY2xvc2VkJykgPyAnb3BlbicgOiAnY2xvc2UnKSArICcuJylcblx0XHQgICAgc2VsZi5zZXRQcmVmc0Zyb21VSSgpO1xuXHRcdH0pO1xuXHRkMy5zZWxlY3RBbGwoJy5jb250ZW50LWRyYWdnYWJsZSA+IConKVxuXHQgICAgLmFwcGVuZCgnaScpXG5cdFx0LmF0dHIoJ3RpdGxlJywnRHJhZyB1cC9kb3duIHRvIHJlcG9zaXRpb24uJylcblx0XHQuYXR0cignY2xhc3MnLCdtYXRlcmlhbC1pY29ucyBidXR0b24gZHJhZ2hhbmRsZScpO1xuXG5cdC8vIFxuICAgICAgICBkMy5zZWxlY3QoJyNzdGF0dXNNZXNzYWdlJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB7IHRoaXMuc2hvd1N0YXR1cyhmYWxzZSk7IH0pO1xuXHRcblx0Ly9cblx0Ly9cblx0dGhpcy5nZW5vbWVWaWV3ID0gbmV3IEdlbm9tZVZpZXcodGhpcywgJyNnZW5vbWVWaWV3JywgODAwLCAyNTApO1xuXHR0aGlzLnpvb21WaWV3ICAgPSBuZXcgWm9vbVZpZXcgICh0aGlzLCAnI3pvb21WaWV3JywgODAwLCAyNTAsIHRoaXMuY29vcmRzKTtcblx0dGhpcy5yZXNpemUoKTtcbiAgICAgICAgLy9cblx0dGhpcy5mZWF0dXJlRGV0YWlscyA9IG5ldyBGZWF0dXJlRGV0YWlscyh0aGlzLCAnI2ZlYXR1cmVEZXRhaWxzJyk7XG5cblx0dGhpcy5jc2NhbGUgPSBkMy5zY2FsZS5jYXRlZ29yeTEwKCkuZG9tYWluKFtcblx0ICAgICdwcm90ZWluX2NvZGluZ19nZW5lJyxcblx0ICAgICdwc2V1ZG9nZW5lJyxcblx0ICAgICduY1JOQV9nZW5lJyxcblx0ICAgICdnZW5lX3NlZ21lbnQnLFxuXHQgICAgJ290aGVyX2dlbmUnLFxuXHQgICAgJ290aGVyX2ZlYXR1cmVfdHlwZSdcblx0XSk7XG5cdC8vXG5cdC8vXG5cdHRoaXMubGlzdE1hbmFnZXIgICAgPSBuZXcgTGlzdE1hbmFnZXIodGhpcywgXCIjbXlsaXN0c1wiKTtcblx0dGhpcy5saXN0TWFuYWdlci51cGRhdGUoKTtcblx0Ly9cblx0dGhpcy5saXN0RWRpdG9yID0gbmV3IExpc3RFZGl0b3IodGhpcywgJyNsaXN0ZWRpdG9yJyk7XG5cdC8vXG5cdHRoaXMudHJhbnNsYXRvciAgICAgPSBuZXcgQlRNYW5hZ2VyKHRoaXMpO1xuXHR0aGlzLmZlYXR1cmVNYW5hZ2VyID0gbmV3IEZlYXR1cmVNYW5hZ2VyKHRoaXMpO1xuXHQvL1xuXHRsZXQgc2VhcmNoVHlwZXMgPSBbe1xuXHQgICAgbWV0aG9kOiBcImZlYXR1cmVzQnlGdW5jdGlvblwiLFxuXHQgICAgbGFiZWw6IFwiLi4uYnkgY2VsbHVsYXIgZnVuY3Rpb25cIixcblx0ICAgIHRlbXBsYXRlOiBcIlwiLFxuXHQgICAgcGxhY2Vob2xkZXI6IFwiR2VuZSBPbnRvbG9neSAoR08pIHRlcm1zL0lEc1wiXG5cdH0se1xuXHQgICAgbWV0aG9kOiBcImZlYXR1cmVzQnlQaGVub3R5cGVcIixcblx0ICAgIGxhYmVsOiBcIi4uLmJ5IG11dGFudCBwaGVub3R5cGVcIixcblx0ICAgIHRlbXBsYXRlOiBcIlwiLFxuXHQgICAgcGxhY2Vob2xkZXI6IFwiTWFtbWFsaWFuIFBoZW5vdHlwZSAoTVApIHRlcm1zL0lEc1wiXG5cdH0se1xuXHQgICAgbWV0aG9kOiBcImZlYXR1cmVzQnlEaXNlYXNlXCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBkaXNlYXNlIGltcGxpY2F0aW9uXCIsXG5cdCAgICB0ZW1wbGF0ZTogXCJcIixcblx0ICAgIHBsYWNlaG9sZGVyOiBcIkRpc2Vhc2UgT250b2xvZ3kgKERPKSB0ZXJtcy9JRHNcIlxuXHR9LHtcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5SWRcIixcblx0ICAgIGxhYmVsOiBcIi4uLmJ5IG5vbWVuY2xhdHVyZVwiLFxuXHQgICAgdGVtcGxhdGU6IFwiXCIsXG5cdCAgICBwbGFjZWhvbGRlcjogXCJNR0kgbmFtZXMsIHN5bm9ueW1zLCBldGMuXCJcblx0fV07XG5cdHRoaXMucXVlcnlNYW5hZ2VyID0gbmV3IFF1ZXJ5TWFuYWdlcih0aGlzLCBcIiNmaW5kR2VuZXNCb3hcIiwgc2VhcmNoVHlwZXMpO1xuXHQvL1xuXHR0aGlzLnVzZXJQcmVmc01hbmFnZXIgPSBuZXcgVXNlclByZWZzTWFuYWdlcigpO1xuXHQvL1xuXHQvLyBCdXR0b246IEdlYXIgaWNvbiB0byBzaG93L2hpZGUgbGVmdCBjb2x1bW5cblx0ZDMuc2VsZWN0KFwiI2hlYWRlciA+IC5nZWFyLmJ1dHRvblwiKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHQgICAgICAgIGxldCBsYyA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwibGVmdGNvbHVtblwiXScpO1xuXHRcdGxjLmNsYXNzZWQoXCJjbG9zZWRcIiwgKCkgPT4gISBsYy5jbGFzc2VkKFwiY2xvc2VkXCIpKTtcblx0XHR3aW5kb3cuc2V0VGltZW91dCgoKT0+e1xuXHRcdCAgICB0aGlzLnJlc2l6ZSgpXG5cdFx0ICAgIHRoaXMuc2V0Q29udGV4dCh7fSk7XG5cdFx0ICAgIHRoaXMuc2V0UHJlZnNGcm9tVUkoKTtcblx0XHR9LCAyNTApO1xuXHQgICAgfSk7XG5cdFxuXHQvL1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIEZhY2V0c1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vXG5cdHRoaXMuZmFjZXRNYW5hZ2VyID0gbmV3IEZhY2V0TWFuYWdlcih0aGlzKTtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdC8vIEZlYXR1cmUtdHlwZSBmYWNldFxuXHRsZXQgZnRGYWNldCAgPSB0aGlzLmZhY2V0TWFuYWdlci5hZGRGYWNldChcIkZlYXR1cmVUeXBlXCIsIGYgPT4gZi5nZXRNdW5nZWRUeXBlKCkpO1xuXHR0aGlzLmluaXRGZWF0VHlwZUNvbnRyb2woZnRGYWNldCk7XG5cblx0Ly8gSGFzLU1HSS1pZCBmYWNldFxuXHRsZXQgbWdpRmFjZXQgPSB0aGlzLmZhY2V0TWFuYWdlci5hZGRGYWNldChcIkhhc01naUlkXCIsICAgIGYgPT4gZi5tZ2lpZCAgPyBcInllc1wiIDogXCJub1wiICk7XG5cdGQzLnNlbGVjdEFsbCgnaW5wdXRbbmFtZT1cIm1naUZhY2V0XCJdJykub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKXtcblx0ICAgIG1naUZhY2V0LnNldFZhbHVlcyh0aGlzLnZhbHVlID09PSBcIlwiID8gW10gOiBbdGhpcy52YWx1ZV0pO1xuXHQgICAgc2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0fSk7XG5cblx0Ly8gSXMtaGlnaGxpZ2h0ZWQgZmFjZXRcblx0bGV0IGhpRmFjZXQgPSB0aGlzLmZhY2V0TWFuYWdlci5hZGRGYWNldChcIklzSGlcIiwgZiA9PiB7XG5cdCAgICBsZXQgaXNoaSA9IHRoaXMuem9vbVZpZXcuaGlGZWF0c1tmLm1naWlkXSB8fCB0aGlzLnpvb21WaWV3LmhpRmVhdHNbZi5tZ3BpZF07XG5cdCAgICByZXR1cm4gaXNoaSA/IFwieWVzXCIgOiBcIm5vXCI7XG5cdH0pO1xuXHRkMy5zZWxlY3RBbGwoJ2lucHV0W25hbWU9XCJoaUZhY2V0XCJdJykub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKXtcblx0ICAgIGhpRmFjZXQuc2V0VmFsdWVzKHRoaXMudmFsdWUgPT09IFwiXCIgPyBbXSA6IFt0aGlzLnZhbHVlXSk7XG5cdCAgICBzZWxmLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9KTtcblxuXG5cdC8vXG5cdHRoaXMuc2V0VUlGcm9tUHJlZnMoKTtcblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0Ly8gVGhpbmdzIGFyZSBhbGwgd2lyZWQgdXAuIE5vdyBsZXQncyBnZXQgc29tZSBkYXRhLlxuXHQvLyBTdGFydCB3aXRoIHRoZSBmaWxlIG9mIGFsbCB0aGUgZ2Vub21lcy5cblx0ZDN0c3YoXCIuL2RhdGEvZ2Vub21lTGlzdC50c3ZcIikudGhlbihmdW5jdGlvbihkYXRhKXtcblx0ICAgIC8vIGNyZWF0ZSBHZW5vbWUgb2JqZWN0cyBmcm9tIHRoZSByYXcgZGF0YS5cblx0ICAgIHRoaXMuYWxsR2Vub21lcyAgID0gZGF0YS5tYXAoZyA9PiBuZXcgR2Vub21lKGcpKTtcblx0ICAgIHRoaXMuYWxsR2Vub21lcy5zb3J0KCAoYSxiKSA9PiB7XG5cdCAgICAgICAgcmV0dXJuIGEubGFiZWwgPCBiLmxhYmVsID8gLTEgOiBhLmxhYmVsID4gYi5sYWJlbCA/ICsxIDogMDtcblx0ICAgIH0pO1xuXHQgICAgLy9cblx0ICAgIC8vIGJ1aWxkIGEgbmFtZS0+R2Vub21lIGluZGV4XG5cdCAgICB0aGlzLm5sMmdlbm9tZSA9IHt9OyAvLyBhbHNvIGJ1aWxkIHRoZSBjb21iaW5lZCBsaXN0IGF0IHRoZSBzYW1lIHRpbWUuLi5cblx0ICAgIHRoaXMubmFtZTJnZW5vbWUgID0gdGhpcy5hbGxHZW5vbWVzXG5cdCAgICAgICAgLnJlZHVjZSgoYWNjLGcpID0+IHsgdGhpcy5ubDJnZW5vbWVbZy5uYW1lXSA9IGFjY1tnLm5hbWVdID0gZzsgcmV0dXJuIGFjYzsgfSwge30pO1xuXHQgICAgLy8gYnVpbGQgYSBsYWJlbC0+R2Vub21lIGluZGV4XG5cdCAgICB0aGlzLmxhYmVsMmdlbm9tZSA9IHRoaXMuYWxsR2Vub21lc1xuXHQgICAgICAgIC5yZWR1Y2UoKGFjYyxnKSA9PiB7IHRoaXMubmwyZ2Vub21lW2cubGFiZWxdID0gYWNjW2cubGFiZWxdID0gZzsgcmV0dXJuIGFjYzsgfSwge30pO1xuXG5cdCAgICAvLyBQcmVsb2FkIGFsbCB0aGUgY2hyb21vc29tZSBmaWxlcyBmb3IgYWxsIHRoZSBnZW5vbWVzXG5cdCAgICBsZXQgY2RwcyA9IHRoaXMuYWxsR2Vub21lcy5tYXAoZyA9PiBkM3RzdihgLi9kYXRhL2dlbm9tZWRhdGEvJHtnLm5hbWV9LWNocm9tb3NvbWVzLnRzdmApKTtcblx0ICAgIHJldHVybiBQcm9taXNlLmFsbChjZHBzKTtcblx0fS5iaW5kKHRoaXMpKVxuXHQudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuXG5cdCAgICAvL1xuXHQgICAgdGhpcy5wcm9jZXNzQ2hyb21vc29tZXMoZGF0YSk7XG5cblx0ICAgIC8vXG5cdCAgICBsZXQgY2ZnID0gdGhpcy5zYW5pdGl6ZUNmZyh0aGlzLmluaXRpYWxDZmcpO1xuXHQgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG5cdCAgICAvLyBpbml0aWFsaXplIHRoZSByZWYgYW5kIGNvbXAgZ2Vub21lIG9wdGlvbiBsaXN0c1xuXHQgICAgaW5pdE9wdExpc3QoXCIjcmVmR2Vub21lXCIsICAgdGhpcy5hbGxHZW5vbWVzLCBnPT5nLm5hbWUsIGc9PmcubGFiZWwsIGZhbHNlLCBnID0+IGcgPT09IGNmZy5yZWYpO1xuXHQgICAgaW5pdE9wdExpc3QoXCIjY29tcEdlbm9tZXNcIiwgdGhpcy5hbGxHZW5vbWVzLCBnPT5nLm5hbWUsIGc9PmcubGFiZWwsIHRydWUsICBnID0+IGNmZy5nZW5vbWVzLmluZGV4T2YoZykgIT09IC0xKTtcblx0ICAgIGQzLnNlbGVjdChcIiNyZWZHZW5vbWVcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG5cdFx0c2VsZi5zZXRDb250ZXh0KHsgcmVmOiB0aGlzLnZhbHVlIH0pO1xuXHQgICAgfSk7XG5cdCAgICBkMy5zZWxlY3QoXCIjY29tcEdlbm9tZXNcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG5cdFx0bGV0IHNlbGVjdGVkTmFtZXMgPSBbXTtcblx0XHRmb3IobGV0IHggb2YgdGhpcy5zZWxlY3RlZE9wdGlvbnMpe1xuXHRcdCAgICBzZWxlY3RlZE5hbWVzLnB1c2goeC52YWx1ZSk7XG5cdFx0fVxuXHRcdC8vIHdhbnQgdG8gcHJlc2VydmUgY3VycmVudCBnZW5vbWUgb3JkZXIgYXMgbXVjaCBhcyBwb3NzaWJsZSBcblx0XHRsZXQgZ05hbWVzID0gc2VsZi52R2Vub21lcy5tYXAoZz0+Zy5uYW1lKVxuXHRcdCAgICAuZmlsdGVyKG4gPT4ge1xuXHRcdCAgICAgICAgcmV0dXJuIHNlbGVjdGVkTmFtZXMuaW5kZXhPZihuKSA+PSAwIHx8IG4gPT09IHNlbGYuckdlbm9tZS5uYW1lO1xuXHRcdCAgICB9KTtcblx0XHRnTmFtZXMgPSBnTmFtZXMuY29uY2F0KHNlbGVjdGVkTmFtZXMuZmlsdGVyKG4gPT4gZ05hbWVzLmluZGV4T2YobikgPT09IC0xKSk7XG5cdFx0c2VsZi5zZXRDb250ZXh0KHsgZ2Vub21lczogZ05hbWVzIH0pO1xuXHQgICAgfSk7XG5cdCAgICAvL1xuXHQgICAgLy8gRklOQUxMWSEgV2UgYXJlIHJlYWR5IHRvIGRyYXcgdGhlIGluaXRpYWwgc2NlbmUuXG5cdCAgICB0aGlzLnNldENvbnRleHQodGhpcy5pbml0aWFsQ2ZnKTtcblxuXHR9LmJpbmQodGhpcykpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBwcm9jZXNzQ2hyb21vc29tZXMgKGRhdGEpIHtcblx0Ly8gZGF0YSBpcyBhIGxpc3Qgb2YgY2hyb21vc29tZSBsaXN0cywgb25lIHBlciBnZW5vbWVcblx0Ly8gRmlsbCBpbiB0aGUgZ2Vub21lQ2hycyBtYXAgKGdlbm9tZSAtPiBjaHIgbGlzdClcblx0dGhpcy5hbGxHZW5vbWVzLmZvckVhY2goKGcsaSkgPT4ge1xuXHQgICAgLy8gbmljZWx5IHNvcnQgdGhlIGNocm9tb3NvbWVzXG5cdCAgICBsZXQgY2hycyA9IGRhdGFbaV07XG5cdCAgICBnLm1heGxlbiA9IDA7XG5cdCAgICBjaHJzLmZvckVhY2goIGMgPT4ge1xuXHRcdC8vXG5cdFx0Yy5sZW5ndGggPSBwYXJzZUludChjLmxlbmd0aClcblx0XHRnLm1heGxlbiA9IE1hdGgubWF4KGcubWF4bGVuLCBjLmxlbmd0aCk7XG5cdFx0Ly8gYmVjYXVzZSBJJ2QgcmF0aGVyIHNheSBcImNocm9tb3NvbWUubmFtZVwiIHRoYW4gXCJjaHJvbW9zb21lLmNocm9tb3NvbWVcIlxuXHRcdGMubmFtZSA9IGMuY2hyb21vc29tZTtcblx0XHRkZWxldGUgYy5jaHJvbW9zb21lO1xuXHQgICAgfSk7XG5cdCAgICAvLyBuaWNlbHkgc29ydCB0aGUgY2hyb21vc29tZXNcblx0ICAgIGNocnMuc29ydCgoYSxiKSA9PiB7XG5cdFx0bGV0IGFhID0gcGFyc2VJbnQoYS5uYW1lKSAtIHBhcnNlSW50KGIubmFtZSk7XG5cdFx0aWYgKCFpc05hTihhYSkpIHJldHVybiBhYTtcblx0XHRyZXR1cm4gYS5uYW1lIDwgYi5uYW1lID8gLTEgOiBhLm5hbWUgPiBiLm5hbWUgPyArMSA6IDA7XG5cdCAgICB9KTtcblx0ICAgIGcuY2hyb21vc29tZXMgPSBjaHJzO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdERvbSAoKSB7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0Q29udGVudERyYWdnZXIgKCkge1xuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgLy8gSGVscGVyIGZ1bmN0aW9uIGZvciB0aGUgZHJhZyBiZWhhdmlvci4gUmVvcmRlcnMgdGhlIGNvbnRlbnRzIGJhc2VkIG9uXG4gICAgICAvLyBjdXJyZW50IHNjcmVlbiBwb3NpdGlvbiBvZiB0aGUgZHJhZ2dlZCBpdGVtLlxuICAgICAgZnVuY3Rpb24gcmVvcmRlckJ5RG9tKCkge1xuXHQgIC8vIExvY2F0ZSB0aGUgc2liIHdob3NlIHBvc2l0aW9uIGlzIGJleW9uZCB0aGUgZHJhZ2dlZCBpdGVtIGJ5IHRoZSBsZWFzdCBhbW91bnRcblx0ICBsZXQgZHIgPSBzZWxmLmRyYWdnaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIGxldCBiU2liID0gbnVsbDtcblx0ICBsZXQgeHkgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnUGFyZW50KS5jbGFzc2VkKFwiZmxleHJvd1wiKSA/IFwieFwiIDogXCJ5XCI7XG5cdCAgZm9yIChsZXQgcyBvZiBzZWxmLmRyYWdTaWJzKSB7XG5cdCAgICAgIGxldCBzciA9IHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIGlmIChkclt4eV0gPCBzclt4eV0pIHtcblx0XHQgICBsZXQgZGlzdCA9IHNyW3h5XSAtIGRyW3h5XTtcblx0XHQgICBpZiAoIWJTaWIgfHwgZGlzdCA8IGJTaWJbeHldIC0gZHJbeHldKVxuXHRcdCAgICAgICBiU2liID0gcztcblx0ICAgICAgfVxuXHQgIH1cblx0ICAvLyBJbnNlcnQgdGhlIGRyYWdnZWQgaXRlbSBiZWZvcmUgdGhlIGxvY2F0ZWQgc2liIChvciBhcHBlbmQgaWYgbm8gc2liIGZvdW5kKVxuXHQgIHNlbGYuZHJhZ1BhcmVudC5pbnNlcnRCZWZvcmUoc2VsZi5kcmFnZ2luZywgYlNpYik7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiByZW9yZGVyQnlTdHlsZSgpIHtcblx0ICBsZXQgZGQgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZyk7XG5cdCAgLy8gTG9jYXRlIHRoZSBzaWIgdGhhdCBjb250YWlucyB0aGUgZHJhZ2dlZCBpdGVtJ3Mgb3JpZ2luLlxuXHQgIGxldCBkciA9IHNlbGYuZHJhZ2dpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgbGV0IGJTaWIgPSBudWxsO1xuXHQgIGxldCB4eSA9IGQzLnNlbGVjdChzZWxmLmRyYWdQYXJlbnQpLmNsYXNzZWQoXCJmbGV4cm93XCIpID8gXCJ4XCIgOiBcInlcIjtcblx0ICBsZXQgc3ogPSB4eSA9PT0gXCJ4XCIgPyBcIndpZHRoXCIgOiBcImhlaWdodFwiO1xuXHQgIGxldCBzdHk9IHh5ID09PSBcInhcIiA/IFwibGVmdFwiIDogXCJ0b3BcIjtcblx0ICBmb3IgKGxldCBzIG9mIHNlbGYuZHJhZ1NpYnMpIHtcblx0ICAgICAgLy8gc2tpcCB0aGUgZHJhZ2dlZCBpdGVtXG5cdCAgICAgIGlmIChzID09PSBzZWxmLmRyYWdnaW5nKSBjb250aW51ZTtcblx0ICAgICAgbGV0IGRzID0gZDMuc2VsZWN0KHMpO1xuXHQgICAgICBsZXQgc3IgPSBzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICAvLyBpZncgdGhlIGRyYWdnZWQgaXRlbSdzIG9yaWdpbiBpcyBiZXR3ZWVuIHRoZSBzdGFydCBhbmQgZW5kIG9mIHNpYiwgd2UgZm91bmQgaXQuXG5cdCAgICAgIGlmIChkclt4eV0gPj0gc3JbeHldICYmIGRyW3h5XSA8PSAoc3JbeHldICsgc3Jbc3pdKSkge1xuXHRcdCAgIC8vIG1vdmUgc2liIHRvd2FyZCB0aGUgaG9sZSwgYW1vdW50ID0gdGhlIHNpemUgb2YgdGhlIGhvbGVcblx0XHQgICBsZXQgYW10ID0gc2VsZi5kcmFnSG9sZVtzel0gKiAoc2VsZi5kcmFnSG9sZVt4eV0gPCBzclt4eV0gPyAtMSA6IDEpO1xuXHRcdCAgIGRzLnN0eWxlKHN0eSwgcGFyc2VJbnQoZHMuc3R5bGUoc3R5KSkgKyBhbXQgKyBcInB4XCIpO1xuXHRcdCAgIHNlbGYuZHJhZ0hvbGVbeHldIC09IGFtdDtcbiAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgfVxuXHQgIH1cbiAgICAgIH1cbiAgICAgIC8vXG4gICAgICByZXR1cm4gZDMuYmVoYXZpb3IuZHJhZygpXG5cdCAgLm9yaWdpbihmdW5jdGlvbihkLGkpe1xuXHQgICAgICByZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICB9KVxuICAgICAgICAgIC5vbihcImRyYWdzdGFydC5tXCIsIGZ1bmN0aW9uKCkge1xuXHQgICAgICBsZXQgdCA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50LnRhcmdldDtcblx0ICAgICAgaWYgKCEgZDMuc2VsZWN0KHQpLmNsYXNzZWQoXCJkcmFnaGFuZGxlXCIpKSByZXR1cm47XG5cdCAgICAgIGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICAvL1xuXHQgICAgICBzZWxmLmRyYWdnaW5nICAgID0gdGhpcy5jbG9zZXN0KFwiLnBhZ2Vib3hcIik7XG5cdCAgICAgIHNlbGYuZHJhZ0hvbGUgICAgPSBzZWxmLmRyYWdnaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICBzZWxmLmRyYWdQYXJlbnQgID0gc2VsZi5kcmFnZ2luZy5wYXJlbnROb2RlO1xuXHQgICAgICBzZWxmLmRyYWdTaWJzICAgID0gc2VsZi5kcmFnUGFyZW50LmNoaWxkcmVuO1xuXHQgICAgICAvL1xuXHQgICAgICBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZykuY2xhc3NlZChcImRyYWdnaW5nXCIsIHRydWUpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZy5tXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIGxldCBkZCA9IGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKTtcblx0ICAgICAgbGV0IHRwID0gcGFyc2VJbnQoZGQuc3R5bGUoXCJ0b3BcIikpXG5cdCAgICAgIGRkLnN0eWxlKFwidG9wXCIsIHRwICsgZDMuZXZlbnQuZHkgKyBcInB4XCIpO1xuXHQgICAgICAvL3Jlb3JkZXJCeVN0eWxlKCk7XG5cdCAgfSlcblx0ICAub24oXCJkcmFnZW5kLm1cIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgcmVvcmRlckJ5RG9tKCk7XG5cdCAgICAgIHNlbGYuc2V0UHJlZnNGcm9tVUkoKTtcblx0ICAgICAgbGV0IGRkID0gZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpO1xuXHQgICAgICBkZC5zdHlsZShcInRvcFwiLCBcIjBweFwiKTtcblx0ICAgICAgZGQuY2xhc3NlZChcImRyYWdnaW5nXCIsIGZhbHNlKTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZyAgICA9IG51bGw7XG5cdCAgICAgIHNlbGYuZHJhZ0hvbGUgICAgPSBudWxsO1xuXHQgICAgICBzZWxmLmRyYWdQYXJlbnQgID0gbnVsbDtcblx0ICAgICAgc2VsZi5kcmFnU2licyAgICA9IG51bGw7XG5cdCAgfSlcblx0ICA7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldFVJRnJvbVByZWZzICgpIHtcbiAgICAgICAgbGV0IHByZWZzID0gdGhpcy51c2VyUHJlZnNNYW5hZ2VyLmdldEFsbCgpO1xuXHRjb25zb2xlLmxvZyhcIkdvdCBwcmVmcyBmcm9tIHN0b3JhZ2VcIiwgcHJlZnMpO1xuXG5cdC8vIHNldCBvcGVuL2Nsb3NlZCBzdGF0ZXNcblx0KHByZWZzLmNsb3NhYmxlcyB8fCBbXSkuZm9yRWFjaCggYyA9PiB7XG5cdCAgICBsZXQgaWQgPSBjWzBdO1xuXHQgICAgbGV0IHN0YXRlID0gY1sxXTtcblx0ICAgIGQzLnNlbGVjdCgnIycraWQpLmNsYXNzZWQoJ2Nsb3NlZCcsIHN0YXRlID09PSBcImNsb3NlZFwiIHx8IG51bGwpO1xuXHR9KTtcblxuXHQvLyBzZXQgZHJhZ2dhYmxlcycgb3JkZXJcblx0KHByZWZzLmRyYWdnYWJsZXMgfHwgW10pLmZvckVhY2goIGQgPT4ge1xuXHQgICAgbGV0IGN0cklkID0gZFswXTtcblx0ICAgIGxldCBjb250ZW50SWRzID0gZFsxXTtcblx0ICAgIGxldCBjdHIgPSBkMy5zZWxlY3QoJyMnK2N0cklkKTtcblx0ICAgIGxldCBjb250ZW50cyA9IGN0ci5zZWxlY3RBbGwoJyMnK2N0cklkKycgPiAqJyk7XG5cdCAgICBjb250ZW50c1swXS5zb3J0KCAoYSxiKSA9PiB7XG5cdCAgICAgICAgbGV0IGFpID0gY29udGVudElkcy5pbmRleE9mKGEuZ2V0QXR0cmlidXRlKCdpZCcpKTtcblx0ICAgICAgICBsZXQgYmkgPSBjb250ZW50SWRzLmluZGV4T2YoYi5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuXHRcdHJldHVybiBhaSAtIGJpO1xuXHQgICAgfSk7XG5cdCAgICBjb250ZW50cy5vcmRlcigpO1xuXHR9KTtcbiAgICB9XG4gICAgc2V0UHJlZnNGcm9tVUkgKCkge1xuICAgICAgICAvLyBzYXZlIG9wZW4vY2xvc2VkIHN0YXRlc1xuXHRsZXQgY2xvc2FibGVzID0gdGhpcy5yb290LnNlbGVjdEFsbCgnLmNsb3NhYmxlJyk7XG5cdGxldCBvY0RhdGEgPSBjbG9zYWJsZXNbMF0ubWFwKCBjID0+IHtcblx0ICAgIGxldCBkYyA9IGQzLnNlbGVjdChjKTtcblx0ICAgIHJldHVybiBbZGMuYXR0cignaWQnKSwgZGMuY2xhc3NlZChcImNsb3NlZFwiKSA/IFwiY2xvc2VkXCIgOiBcIm9wZW5cIl07XG5cdH0pO1xuXHQvLyBzYXZlIGRyYWdnYWJsZXMnIG9yZGVyXG5cdGxldCBkcmFnQ3RycyA9IHRoaXMucm9vdC5zZWxlY3RBbGwoJy5jb250ZW50LWRyYWdnYWJsZScpO1xuXHRsZXQgZHJhZ2dhYmxlcyA9IGRyYWdDdHJzLnNlbGVjdEFsbCgnLmNvbnRlbnQtZHJhZ2dhYmxlID4gKicpO1xuXHRsZXQgZGREYXRhID0gZHJhZ2dhYmxlcy5tYXAoIChkLGkpID0+IHtcblx0ICAgIGxldCBjdHIgPSBkMy5zZWxlY3QoZHJhZ0N0cnNbMF1baV0pO1xuXHQgICAgcmV0dXJuIFtjdHIuYXR0cignaWQnKSwgZC5tYXAoIGRkID0+IGQzLnNlbGVjdChkZCkuYXR0cignaWQnKSldO1xuXHR9KTtcblx0bGV0IHByZWZzID0ge1xuXHQgICAgY2xvc2FibGVzOiBvY0RhdGEsXG5cdCAgICBkcmFnZ2FibGVzOiBkZERhdGFcblx0fVxuXHRjb25zb2xlLmxvZyhcIlNhdmluZyBwcmVmcyB0byBzdG9yYWdlXCIsIHByZWZzKTtcblx0dGhpcy51c2VyUHJlZnNNYW5hZ2VyLnNldEFsbChwcmVmcyk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dCbG9ja3MgKGNvbXApIHtcblx0bGV0IHJlZiA9IHRoaXMuckdlbm9tZTtcblx0aWYgKCEgY29tcCkgY29tcCA9IHRoaXMuY0dlbm9tZXNbMF07XG5cdGlmICghIGNvbXApIHJldHVybjtcblx0dGhpcy50cmFuc2xhdG9yLnJlYWR5KCkudGhlbiggKCkgPT4ge1xuXHQgICAgbGV0IGJsb2NrcyA9IGNvbXAgPT09IHJlZiA/IFtdIDogdGhpcy50cmFuc2xhdG9yLmdldEJsb2NrcyhyZWYsIGNvbXApO1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdCbG9ja3MoeyByZWYsIGNvbXAsIGJsb2NrcyB9KTtcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dCdXN5IChpc0J1c3ksIG1lc3NhZ2UpIHtcbiAgICAgICAgZDMuc2VsZWN0KFwiI2hlYWRlciA+IC5nZWFyLmJ1dHRvblwiKVxuXHQgICAgLmNsYXNzZWQoXCJyb3RhdGluZ1wiLCBpc0J1c3kpO1xuICAgICAgICBkMy5zZWxlY3QoXCIjem9vbVZpZXdcIikuY2xhc3NlZChcImJ1c3lcIiwgaXNCdXN5KTtcblx0aWYgKGlzQnVzeSAmJiBtZXNzYWdlKSB0aGlzLnNob3dTdGF0dXMobWVzc2FnZSk7XG5cdGlmICghaXNCdXN5KSB0aGlzLnNob3dTdGF0dXMoJycpXG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dTdGF0dXMgKG1zZykge1xuXHRpZiAobXNnKVxuXHQgICAgZDMuc2VsZWN0KCcjc3RhdHVzTWVzc2FnZScpXG5cdFx0LmNsYXNzZWQoJ3Nob3dpbmcnLCB0cnVlKVxuXHRcdC5zZWxlY3QoJ3NwYW4nKVxuXHRcdCAgICAudGV4dChtc2cpO1xuXHRlbHNlXG5cdCAgICBkMy5zZWxlY3QoJyNzdGF0dXNNZXNzYWdlJykuY2xhc3NlZCgnc2hvd2luZycsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRSZWZHZW5vbWVTZWxlY3Rpb24gKCkge1xuXHRkMy5zZWxlY3RBbGwoXCIjcmVmR2Vub21lIG9wdGlvblwiKVxuXHQgICAgLnByb3BlcnR5KFwic2VsZWN0ZWRcIiwgIGdnID0+IChnZy5sYWJlbCA9PT0gdGhpcy5yR2Vub21lLmxhYmVsICB8fCBudWxsKSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldENvbXBHZW5vbWVzU2VsZWN0aW9uICgpIHtcblx0bGV0IGNnbnMgPSB0aGlzLnZHZW5vbWVzLm1hcChnPT5nLmxhYmVsKTtcblx0ZDMuc2VsZWN0QWxsKFwiI2NvbXBHZW5vbWVzIG9wdGlvblwiKVxuXHQgICAgICAgIC5wcm9wZXJ0eShcInNlbGVjdGVkXCIsICBnZyA9PiBjZ25zLmluZGV4T2YoZ2cubGFiZWwpID49IDApO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTZXRzIG9yIHJldHVybnNcbiAgICBzZXRIaWdobGlnaHQgKGZsaXN0KSB7XG5cdGlmICghZmxpc3QpIHJldHVybiBmYWxzZTtcblx0dGhpcy56b29tVmlldy5oaUZlYXRzID0gZmxpc3QucmVkdWNlKChhLHYpID0+IHsgYVt2XT12OyByZXR1cm4gYTsgfSwge30pO1xuXHRyZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgY3VycmVudCBjb250ZXh0IGFzIGFuIG9iamVjdC5cbiAgICAvLyBDdXJyZW50IGNvbnRleHQgPSByZWYgZ2Vub21lICsgY29tcCBnZW5vbWVzICsgY3VycmVudCByYW5nZSAoY2hyLHN0YXJ0LGVuZClcbiAgICBnZXRDb250ZXh0ICgpIHtcblx0aWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKSB7XG5cdCAgICBsZXQgYyA9IHRoaXMuY29vcmRzO1xuXHQgICAgcmV0dXJuIHtcblx0XHRyZWYgOiB0aGlzLnJHZW5vbWUubGFiZWwsXG5cdFx0Z2Vub21lczogdGhpcy52R2Vub21lcy5tYXAoZz0+Zy5sYWJlbCksXG5cdFx0Y2hyOiBjLmNocixcblx0XHRzdGFydDogYy5zdGFydCxcblx0XHRlbmQ6IGMuZW5kLFxuXHRcdGhpZ2hsaWdodDogT2JqZWN0LmtleXModGhpcy56b29tVmlldy5oaUZlYXRzKS5zb3J0KCksXG5cdFx0ZG1vZGU6IHRoaXMuem9vbVZpZXcuZG1vZGVcblx0ICAgIH1cblx0fSBlbHNlIHtcblx0ICAgIGxldCBjID0gdGhpcy5sY29vcmRzO1xuXHQgICAgcmV0dXJuIHtcblx0XHRyZWYgOiB0aGlzLnJHZW5vbWUubGFiZWwsXG5cdFx0Z2Vub21lczogdGhpcy52R2Vub21lcy5tYXAoZz0+Zy5sYWJlbCksXG5cdFx0bGFuZG1hcms6IGMubGFuZG1hcmssXG5cdFx0Zmxhbms6IGMuZmxhbmssXG5cdFx0bGVuZ3RoOiBjLmxlbmd0aCxcblx0XHRkZWx0YTogYy5kZWx0YSxcblx0XHRoaWdobGlnaHQ6IE9iamVjdC5rZXlzKHRoaXMuem9vbVZpZXcuaGlGZWF0cykuc29ydCgpLFxuXHRcdGRtb2RlOiB0aGlzLnpvb21WaWV3LmRtb2RlXG5cdCAgICB9XG5cdH1cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmVzb2x2ZXMgdGhlIHNwZWNpZmllZCBsYW5kbWFyayB0byBhIGZlYXR1cmUgYW5kIHRoZSBsaXN0IG9mIGVxdWl2YWxlbnQgZmVhdXJlcy5cbiAgICAvLyBNYXkgYmUgZ2l2ZW4gYW4gaWQsIGNhbm9uaWNhbCBpZCwgb3Igc3ltYm9sLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIGNmZyAob2JqKSBTYW5pdGl6ZWQgY29uZmlnIG9iamVjdCwgd2l0aCBhIGxhbmRtYXJrIChzdHJpbmcpIGZpZWxkLlxuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgIFRoZSBjZmcgb2JqZWN0LCB3aXRoIGFkZGl0aW9uYWwgZmllbGRzOlxuICAgIC8vICAgICAgICBsYW5kbWFya1JlZkZlYXQ6IHRoZSBsYW5kbWFyayAoRmVhdHVyZSBvYmopIGluIHRoZSByZWYgZ2Vub21lXG4gICAgLy8gICAgICAgIGxhbmRtYXJrRmVhdHM6IFsgZXF1aXZhbGVudCBmZWF0dXJlcyBpbiBlYWNoIGdlbm9tZSAoaW5jbHVkZXMgcmYpXVxuICAgIC8vICAgICBBbHNvLCBjaGFuZ2VzIHJlZiB0byBiZSB0aGUgZ2Vub21lIG9mIHRoZSBsYW5kbWFya1JlZkZlYXRcbiAgICAvLyAgICAgUmV0dXJucyBudWxsIGlmIGxhbmRtYXJrIG5vdCBmb3VuZCBpbiBhbnkgZ2Vub21lLlxuICAgIC8vIFxuICAgIHJlc29sdmVMYW5kbWFyayAoY2ZnKSB7XG5cdGxldCByZiwgZmVhdHM7XG5cdC8vIEZpbmQgdGhlIGxhbmRtYXJrIGZlYXR1cmUgaW4gdGhlIHJlZiBnZW5vbWUuIFxuXHRyZiA9IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsKGNmZy5sYW5kbWFyaywgY2ZnLnJlZilbMF07XG5cdGlmICghcmYpIHtcblx0ICAgIC8vIExhbmRtYXJrIGRvZXMgbm90IGV4aXN0IGluIHJlZiBnZW5vbWUuIERvZXMgaXQgZXhpc3QgaW4gYW55IHNwZWNpZmllZCBnZW5vbWU/XG5cdCAgICByZiA9IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsKGNmZy5sYW5kbWFyaykuZmlsdGVyKGYgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihmLmdlbm9tZSkgPj0gMClbMF07XG5cdCAgICBpZiAocmYpIHtcblx0ICAgICAgICBjZmcucmVmID0gcmYuZ2Vub21lO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgLy8gTGFuZG1hcmsgY2Fubm90IGJlIHJlc29sdmVkLlxuXHRcdHJldHVybiBudWxsO1xuXHQgICAgfVxuXHR9XG5cdC8vIGxhbmRtYXJrIGV4aXN0cyBpbiByZWYgZ2Vub21lLiBHZXQgZXF1aXZhbGVudCBmZWF0IGluIGVhY2ggZ2Vub21lLlxuXHRmZWF0cyA9IHJmLmNhbm9uaWNhbCA/IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkKHJmLmNhbm9uaWNhbCkgOiBbcmZdO1xuXHRjZmcubGFuZG1hcmtSZWZGZWF0ID0gcmY7XG5cdGNmZy5sYW5kbWFya0ZlYXRzID0gZmVhdHMuZmlsdGVyKGYgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihmLmdlbm9tZSkgPj0gMCk7XG5cdHJldHVybiBjZmc7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBzYW5pdGl6ZWQgdmVyc2lvbiBvZiB0aGUgYXJndW1lbnQgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAgLy8gVGhlIHNhbml0aXplZCB2ZXJzaW9uOlxuICAgIC8vICAgICAtIGhhcyBhIHNldHRpbmcgZm9yIGV2ZXJ5IHBhcmFtZXRlci4gUGFyYW1ldGVycyBub3Qgc3BlY2lmaWVkIGluIFxuICAgIC8vICAgICAgIHRoZSBhcmd1bWVudCBhcmUgKGdlbmVyYWxseSkgZmlsbGVkIGluIHdpdGggdGhlaXIgY3VycmVudCB2YWx1ZXMuXG4gICAgLy8gICAgIC0gaXMgYWx3YXlzIHZhbGlkLCBlZ1xuICAgIC8vICAgICBcdC0gaGFzIGEgbGlzdCBvZiAxIG9yIG1vcmUgdmFsaWQgZ2Vub21lcywgd2l0aCBvbmUgb2YgdGhlbSBkZXNpZ25hdGVkIGFzIHRoZSByZWZcbiAgICAvLyAgICAgXHQtIGhhcyBhIHZhbGlkIGNvb3JkaW5hdGUgcmFuZ2VcbiAgICAvLyAgICAgXHQgICAgLSBzdGFydCBhbmQgZW5kIGFyZSBpbnRlZ2VycyB3aXRoIHN0YXJ0IDw9IGVuZFxuICAgIC8vICAgICBcdCAgICAtIHZhbGlkIGNocm9tb3NvbWUgZm9yIHJlZiBnZW5vbWVcbiAgICAvL1xuICAgIC8vIFRoZSBzYW5pdGl6ZWQgdmVyc2lvbiBpcyBhbHNvIFwiY29tcGlsZWRcIjpcbiAgICAvLyAgICAgLSBpdCBoYXMgYWN0dWFsIEdlbm9tZSBvYmplY3RzLCB3aGVyZSB0aGUgYXJndW1lbnQganVzdCBoYXMgbmFtZXNcbiAgICAvLyAgICAgLSBncm91cHMgdGhlIGNocitzdGFydCtlbmQgaW4gXCJjb29yZHNcIiBvYmplY3RcbiAgICAvL1xuICAgIC8vXG4gICAgc2FuaXRpemVDZmcgKGMpIHtcblx0bGV0IGNmZyA9IHt9O1xuXG5cdC8vIFNhbml0aXplIHRoZSBpbnB1dC5cblxuXHQvLyB3aW5kb3cgc2l6ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRpZiAoYy53aWR0aCkge1xuXHQgICAgY2ZnLndpZHRoID0gYy53aWR0aFxuXHR9XG5cblx0Ly8gcmVmIGdlbm9tZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0Ly8gU2V0IGNmZy5yZWYgdG8gc3BlY2lmaWVkIGdlbm9tZSwgXG5cdC8vICAgd2l0aCBmYWxsYmFjayB0byBjdXJyZW50IHJlZiBnZW5vbWUsIFxuXHQvLyAgICAgIHdpdGggZmFsbGJhY2sgdG8gQzU3QkwvNkogKDFzdCB0aW1lIHRocnUpXG5cdC8vIEZJWE1FOiBmaW5hbCBmYWxsYmFjayBzaG91bGQgYmUgYSBjb25maWcgc2V0dGluZy5cblx0Y2ZnLnJlZiA9IChjLnJlZiA/IHRoaXMubmwyZ2Vub21lW2MucmVmXSB8fCB0aGlzLnJHZW5vbWUgOiB0aGlzLnJHZW5vbWUpIHx8IHRoaXMubmwyZ2Vub21lWydDNTdCTC82SiddO1xuXG5cdC8vIGNvbXBhcmlzb24gZ2Vub21lcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIFNldCBjZmcuZ2Vub21lcyB0byBiZSB0aGUgc3BlY2lmaWVkIGdlbm9tZXMsXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGdlbm9tZXNcblx0Ly8gICAgICAgIHdpdGggZmFsbGJhY2sgdG8gW3JlZl0gKDFzdCB0aW1lIHRocnUpXG5cdGNmZy5nZW5vbWVzID0gYy5nZW5vbWVzID9cblx0ICAgIChjLmdlbm9tZXMubWFwKGcgPT4gdGhpcy5ubDJnZW5vbWVbZ10pLmZpbHRlcih4PT54KSlcblx0ICAgIDpcblx0ICAgIHRoaXMudkdlbm9tZXM7XG5cdC8vIEFkZCByZWYgdG8gZ2Vub21lcyBpZiBub3QgdGhlcmUgYWxyZWFkeVxuXHRpZiAoY2ZnLmdlbm9tZXMuaW5kZXhPZihjZmcucmVmKSA9PT0gLTEpXG5cdCAgICBjZmcuZ2Vub21lcy51bnNoaWZ0KGNmZy5yZWYpO1xuXHRcblx0Ly8gYWJzb2x1dGUgY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0Ly8gU2V0IGNmZy5jaHIgdG8gYmUgdGhlIHNwZWNpZmllZCBjaHJvbW9zb21lXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGNoclxuXHQvLyAgICAgICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIDFzdCBjaHJvbW9zb21lIGluIHRoZSByZWYgZ2Vub21lXG5cdGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoYy5jaHIpO1xuXHRpZiAoIWNmZy5jaHIpIGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoIHRoaXMuY29vcmRzID8gdGhpcy5jb29yZHMuY2hyIDogXCIxXCIgKTtcblx0aWYgKCFjZmcuY2hyKSBjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKDApO1xuXHRpZiAoIWNmZy5jaHIpIHRocm93IFwiTm8gY2hyb21vc29tZS5cIlxuXHRcblx0Ly8gU2V0IGNmZy5zdGFydCB0byBiZSB0aGUgc3BlY2lmaWVkIHN0YXJ0IHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgc3RhcnRcblx0Ly8gQ2xpcCBhdCBjaHIgYm91bmRhcmllc1xuXHRjZmcuc3RhcnQgPSBjbGlwKE1hdGgucm91bmQodHlwZW9mKGMuc3RhcnQpID09PSBcIm51bWJlclwiID8gYy5zdGFydCA6IHRoaXMuY29vcmRzLnN0YXJ0KSwgMSwgY2ZnLmNoci5sZW5ndGgpO1xuXG5cdC8vIFNldCBjZmcuZW5kIHRvIGJlIHRoZSBzcGVjaWZpZWQgZW5kIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgZW5kXG5cdC8vIENsaXAgYXQgY2hyIGJvdW5kYXJpZXNcblx0Y2ZnLmVuZCA9IGNsaXAoTWF0aC5yb3VuZCh0eXBlb2YoYy5lbmQpID09PSBcIm51bWJlclwiID8gYy5lbmQgOiB0aGlzLmNvb3Jkcy5lbmQpLCAxLCBjZmcuY2hyLmxlbmd0aCk7XG5cblx0Ly8gRW5zdXJlIHN0YXJ0IDw9IGVuZFxuXHRpZiAoY2ZnLnN0YXJ0ID4gY2ZnLmVuZCkge1xuXHQgICBsZXQgdG1wID0gY2ZnLnN0YXJ0OyBjZmcuc3RhcnQgPSBjZmcuZW5kOyBjZmcuZW5kID0gdG1wO1xuXHR9XG5cblx0Ly8gbGFuZG1hcmsgY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gTk9URSB0aGF0IGxhbmRtYXJrIGNvb3JkaW5hdGUgY2Fubm90IGJlIGZ1bGx5IHJlc29sdmVkIHRvIGFic29sdXRlIGNvb3JkaW5hdGUgdW50aWxcblx0Ly8gKmFmdGVyKiBnZW5vbWUgZGF0YSBoYXZlIGJlZW4gbG9hZGVkLiBTZWUgc2V0Q29udGV4dCBhbmQgcmVzb2x2ZUxhbmRtYXJrIG1ldGhvZHMuXG5cdGNmZy5sYW5kbWFyayA9IGMubGFuZG1hcmsgfHwgdGhpcy5sY29vcmRzLmxhbmRtYXJrO1xuXHRjZmcuZGVsdGEgICAgPSBNYXRoLnJvdW5kKCdkZWx0YScgaW4gYyA/IGMuZGVsdGEgOiAodGhpcy5sY29vcmRzLmRlbHRhIHx8IDApKTtcblx0aWYgKCdmbGFuaycgaW4gYyl7XG5cdCAgICBjZmcuZmxhbmsgPSBNYXRoLnJvdW5kKGMuZmxhbmspO1xuXHR9XG5cdGVsc2UgaWYgKCdsZW5ndGgnIGluIGMpIHtcblx0ICAgIGNmZy5sZW5ndGggPSBNYXRoLnJvdW5kKGMubGVuZ3RoKTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIGNmZy5sZW5ndGggPSBNYXRoLnJvdW5kKHRoaXMuY29vcmRzLmVuZCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMSk7XG5cdH1cblxuXHQvLyBjbW9kZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRpZiAoYy5jbW9kZSAmJiBjLmNtb2RlICE9PSAnbWFwcGVkJyAmJiBjLmNtb2RlICE9PSAnbGFuZG1hcmsnKSBjLmNtb2RlID0gbnVsbDtcblx0Y2ZnLmNtb2RlID0gYy5jbW9kZSB8fCBcblx0ICAgICgoJ2NocicgaW4gYyB8fCAnc3RhcnQnIGluIGMgfHwgJ2VuZCcgaW4gYykgP1xuXHQgICAgICAgICdtYXBwZWQnIDogXG5cdFx0KCdsYW5kbWFyaycgaW4gYyB8fCAnZmxhbmsnIGluIGMgfHwgJ2xlbmd0aCcgaW4gYyB8fCAnZGVsdGEnIGluIGMpID9cblx0XHQgICAgJ2xhbmRtYXJrJyA6IFxuXHRcdCAgICB0aGlzLmNtb2RlIHx8ICdtYXBwZWQnKTtcblxuXHQvLyBoaWdobGlnaHRpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBTZXQgY2ZnLmhpZ2hsaWdodFxuXHQvLyAgICB3aXRoIGZhbGxiYWNrIHRvIGN1cnJlbnQgaGlnaGxpZ2h0XG5cdC8vICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIFtdXG5cdGNmZy5oaWdobGlnaHQgPSBjLmhpZ2hsaWdodCB8fCB0aGlzLnpvb21WaWV3LmhpZ2hsaWdodGVkIHx8IFtdO1xuXG5cdC8vIGRyYXdpbmcgbW9kZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIFNldCB0aGUgZHJhd2luZyBtb2RlIGZvciB0aGUgWm9vbVZpZXcuXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IHZhbHVlXG5cdGlmIChjLmRtb2RlID09PSAnY29tcGFyaXNvbicgfHwgYy5kbW9kZSA9PT0gJ3JlZmVyZW5jZScpIFxuXHQgICAgY2ZnLmRtb2RlID0gYy5kbW9kZTtcblx0ZWxzZVxuXHQgICAgY2ZnLmRtb2RlID0gdGhpcy56b29tVmlldy5kbW9kZSB8fCAnY29tcGFyaXNvbic7XG5cblx0Ly9cblx0cmV0dXJuIGNmZztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTZXRzIHRoZSBjdXJyZW50IGNvbnRleHQgZnJvbSB0aGUgY29uZmlnIG9iamVjdC4gXG4gICAgLy8gT25seSB0aG9zZSBjb250ZXh0IGl0ZW1zIHNwZWNpZmllZCBpbiB0aGUgY29uZmlnIGFyZSBhZmZlY3RlZCwgZXhjZXB0IGFzIG5vdGVkLlxuICAgIC8vXG4gICAgLy8gQWxsIGNvbmZpZ3MgYXJlIHNhbml0aXplZCBiZWZvcmUgYmVpbmcgYXBwbGllZCAoc2VlIHNhbml0aXplQ2ZnKS5cbiAgICAvLyBcbiAgICAvLyBBcmdzOlxuICAgIC8vICAgIGMgKG9iamVjdCkgQSBjb25maWd1cmF0aW9uIG9iamVjdCB0aGF0IHNwZWNpZmllcyBzb21lL2FsbCBjb25maWcgdmFsdWVzLlxuICAgIC8vICAgICAgICAgVGhlIHBvc3NpYmxlIGNvbmZpZyBpdGVtczpcbiAgICAvLyAgICAgICAgICAgIGdlbm9tZXMgICAobGlzdCBvIHN0cmluZ3MpIEFsbCB0aGUgZ2Vub21lcyB5b3Ugd2FudCB0byBzZWUsIGluIHRvcC10by1ib3R0b20gb3JkZXIuIFxuICAgIC8vICAgICAgICAgICAgICAgTWF5IHVzZSBpbnRlcm5hbCBuYW1lcyBvciBkaXNwbGF5IGxhYmVscywgZWcsIFwibXVzX211c2N1bHVzXzEyOXMxc3ZpbWpcIiBvciBcIjEyOVMxL1N2SW1KXCIuXG4gICAgLy8gICAgICAgICAgICByZWYgICAgICAgKHN0cmluZykgVGhlIGdlbm9tZSB0byB1c2UgYXMgdGhlIHJlZmVyZW5jZS4gTWF5IGJlIG5hbWUgb3IgbGFiZWwuXG4gICAgLy8gICAgICAgICAgICBoaWdobGlnaHQgKGxpc3QgbyBzdHJpbmdzKSBJRHMgb2YgZmVhdHVyZXMgdG8gaGlnaGxpZ2h0XG4gICAgLy8gICAgICAgICAgICBkbW9kZSAgICAgKHN0cmluZykgZWl0aGVyICdjb21wYXJpc29uJyBvciAncmVmZXJlbmNlJ1xuICAgIC8vXG4gICAgLy8gICAgICAgICAgICBDb29yZGluYXRlcyBhcmUgc3BlY2lmaWVkIGluIG9uZSBvZiAyIGZvcm1zLlxuICAgIC8vICAgICAgICAgICAgICBjaHIgICAgICAgKHN0cmluZykgQ2hyb21vc29tZSBmb3IgY29vcmRpbmF0ZSByYW5nZVxuICAgIC8vICAgICAgICAgICAgICBzdGFydCAgICAgKGludCkgQ29vcmRpbmF0ZSByYW5nZSBzdGFydCBwb3NpdGlvblxuICAgIC8vICAgICAgICAgICAgICBlbmQgICAgICAgKGludCkgQ29vcmRpbmF0ZSByYW5nZSBlbmQgcG9zaXRpb25cbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgICBEaXNwbGF5cyB0aGlzIGNvb3JkaW5hdGUgcmFuZ2UgZnJvbSB0aGUgY3VycmVudCByZWZlcmVuY2UgZ2VuZW9tcywgYW5kIHRoZSBlcXVpdmFsZW50IChtYXBwZWQpXG4gICAgLy8gICAgICAgICAgICAgIGNvb3JkaW5hdGUgcmFuZ2UocykgaW4gZWFjaCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgb3I6XG4gICAgLy8gICAgICAgICAgICAgIGxhbmRtYXJrICAoc3RyaW5nKSBJRCwgY2Fub25pY2FsIElELCBvciBzeW1ib2wsIGlkZW50aWZ5aW5nIGEgZmVhdHVyZS5cbiAgICAvLyAgICAgICAgICAgICAgZmxhbmt8bGVuZ3RoIChpbnQpIElmIGZsYW5rLCB2aWV3aW5nIHJlZ2lvbiBzaXplID0gZmxhbmsgKyBsZW4obGFuZG1hcmspICsgZmxhbmsuIFxuICAgIC8vICAgICAgICAgICAgICAgICBJZiBsZW5ndGgsIHZpZXdpbmcgcmVnaW9uIHNpemUgPSBsZW5ndGguIEluIGVpdGhlciBjYXNlLCB0aGUgbGFuZG1hcmsgaXMgY2VudGVyZWQgaW5cbiAgICAvLyAgICAgICAgICAgICAgICAgdGhlIHZpZXdpbmcgYXJlYSwgKy8tIGFueSBzcGVjaWZpZWQgZGVsdGEuXG4gICAgLy8gICAgICAgICAgICAgIGRlbHRhICAgICAoaW50KSBBbW91bnQgaW4gYnAgdG8gc2hpZnQgdGhlIHJlZ2lvbiBsZWZ0ICg8MCkgb3IgcmlnaHQgKD4wKS5cbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgICBEaXNwbGF5cyB0aGUgcmVnaW9uIGFyb3VuZCB0aGUgc3BlY2lmaWVkIGxhbmRtYXJrIGluIGVhY2ggZ2Vub21lIHdoZXJlIGl0IGV4aXN0cy5cbiAgICAvL1xuICAgIC8vICAgIHF1aWV0bHkgKGJvb2xlYW4pIElmIHRydWUsIGRvbid0IHVwZGF0ZSBicm93c2VyIGhpc3RvcnkgKGFzIHdoZW4gZ29pbmcgYmFjaylcbiAgICAvL1xuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgTm90aGluZ1xuICAgIC8vIFNpZGUgZWZmZWN0czpcbiAgICAvL1x0ICBSZWRyYXdzIFxuICAgIC8vXHQgIENhbGxzIGNvbnRleHRDaGFuZ2VkKCkgXG4gICAgLy9cbiAgICBzZXRDb250ZXh0IChjLCBxdWlldGx5KSB7XG4gICAgICAgIGxldCBjZmcgPSB0aGlzLnNhbml0aXplQ2ZnKGMpO1xuXHRjb25zb2xlLmxvZyhcIlNldCBjb250ZXh0IChyYXcpOlwiLCBjKTtcblx0Y29uc29sZS5sb2coXCJTZXQgY29udGV4dCAoc2FuaXRpemVkKTpcIiwgY2ZnKTtcblx0aWYgKCFjZmcpIHJldHVybjtcblx0dGhpcy5zaG93QnVzeSh0cnVlLCAnUmVxdWVzdGluZyBkYXRhLi4uJyk7XG5cdGxldCBwID0gdGhpcy5mZWF0dXJlTWFuYWdlci5sb2FkR2Vub21lcyhjZmcuZ2Vub21lcykudGhlbigoKSA9PiB7XG5cdCAgICBpZiAoY2ZnLmNtb2RlID09PSAnbGFuZG1hcmsnKSB7XG5cdCAgICAgICAgY2ZnID0gdGhpcy5yZXNvbHZlTGFuZG1hcmsoY2ZnKTtcblx0XHRpZiAoIWNmZykge1xuXHRcdCAgICBhbGVydChcIkxhbmRtYXJrIGRvZXMgbm90IGV4aXN0IGluIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZS4gUGxlYXNlIGNoYW5nZSB0aGUgcmVmZXJlbmNlIGdlbm9tZSBhbmQgdHJ5IGFnYWluLlwiKTtcblx0XHQgICAgdGhpcy5zaG93QnVzeShmYWxzZSk7XG5cdFx0ICAgIHJldHVybjtcblx0XHR9XG5cdCAgICB9XG5cdCAgICB0aGlzLnZHZW5vbWVzID0gY2ZnLmdlbm9tZXM7XG5cdCAgICB0aGlzLnJHZW5vbWUgID0gY2ZnLnJlZjtcblx0ICAgIHRoaXMuY0dlbm9tZXMgPSBjZmcuZ2Vub21lcy5maWx0ZXIoZyA9PiBnICE9PSBjZmcucmVmKTtcblx0ICAgIHRoaXMuc2V0UmVmR2Vub21lU2VsZWN0aW9uKHRoaXMuckdlbm9tZS5uYW1lKTtcblx0ICAgIHRoaXMuc2V0Q29tcEdlbm9tZXNTZWxlY3Rpb24odGhpcy52R2Vub21lcy5tYXAoZz0+Zy5uYW1lKSk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5jbW9kZSA9IGNmZy5jbW9kZTtcblx0ICAgIC8vXG5cdCAgICByZXR1cm4gdGhpcy50cmFuc2xhdG9yLnJlYWR5KCk7XG5cdH0pLnRoZW4oKCkgPT4ge1xuXHQgICAgLy9cblx0ICAgIGlmICghY2ZnKSByZXR1cm47XG5cdCAgICB0aGlzLmNvb3JkcyAgID0geyBjaHI6IGNmZy5jaHIubmFtZSwgc3RhcnQ6IGNmZy5zdGFydCwgZW5kOiBjZmcuZW5kIH07XG5cdCAgICB0aGlzLmxjb29yZHMgID0ge1xuXHQgICAgICAgIGxhbmRtYXJrOiBjZmcubGFuZG1hcmssIFxuXHRcdGxhbmRtYXJrUmVmRmVhdDogY2ZnLmxhbmRtYXJrUmVmRmVhdCxcblx0XHRsYW5kbWFya0ZlYXRzOiBjZmcubGFuZG1hcmtGZWF0cyxcblx0XHRmbGFuazogY2ZnLmZsYW5rLCBcblx0XHRsZW5ndGg6IGNmZy5sZW5ndGgsIFxuXHRcdGRlbHRhOiBjZmcuZGVsdGEgXG5cdCAgICB9O1xuXHQgICAgLy9cblx0ICAgIHRoaXMuem9vbVZpZXcuaGlnaGxpZ2h0ZWQgPSBjZmcuaGlnaGxpZ2h0O1xuXHQgICAgdGhpcy56b29tVmlldy5nZW5vbWVzID0gdGhpcy52R2Vub21lcztcblx0ICAgIHRoaXMuem9vbVZpZXcuZG1vZGUgPSBjZmcuZG1vZGU7XG5cdCAgICB0aGlzLnpvb21WaWV3LnVwZGF0ZSgpO1xuXHQgICAgLy9cblx0ICAgIHRoaXMuZ2Vub21lVmlldy5yZWRyYXcoKTtcblx0ICAgIHRoaXMuZ2Vub21lVmlldy5zZXRCcnVzaENvb3Jkcyh0aGlzLmNvb3Jkcyk7XG5cdCAgICAvL1xuXHQgICAgaWYgKCFxdWlldGx5KVxuXHQgICAgICAgIHRoaXMuY29udGV4dENoYW5nZWQoKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLnNob3dCdXN5KGZhbHNlKTtcblx0fSk7XG5cdHJldHVybiBwO1xuICAgIH1cbiBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRDb29yZGluYXRlcyAoc3RyKSB7XG5cdGxldCBjb29yZHMgPSBwYXJzZUNvb3JkcyhzdHIpO1xuXHRpZiAoISBjb29yZHMpIHtcblx0ICAgIGxldCBmZWF0cyA9IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsKHN0cik7XG5cdCAgICBsZXQgZmVhdHMyID0gZmVhdHMuZmlsdGVyKGY9PmYuZ2Vub21lID09IHRoaXMuckdlbm9tZSk7XG5cdCAgICBsZXQgZiA9IGZlYXRzMlswXSB8fCBmZWF0c1swXTtcblx0ICAgIGlmIChmKSB7XG5cdFx0Y29vcmRzID0ge1xuXHRcdCAgICByZWY6IGYuZ2Vub21lLm5hbWUsXG5cdFx0ICAgIGxhbmRtYXJrOiBzdHIsXG5cdFx0ICAgIGhpZ2hsaWdodDogZi5pZFxuXHRcdH1cblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHRcdGFsZXJ0KFwiVW5hYmxlIHRvIHNldCBjb29yZGluYXRlcyB3aXRoIHRoaXMgdmFsdWU6IFwiICsgc3RyKTtcblx0XHRyZXR1cm47XG5cdCAgICB9XG5cdH1cblx0dGhpcy5zZXRDb250ZXh0KGNvb3Jkcyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVzaXplICgpIHtcblx0bGV0IHcgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDI0O1xuXHR0aGlzLmdlbm9tZVZpZXcuZml0VG9XaWR0aCh3KTtcblx0dGhpcy56b29tVmlldy5maXRUb1dpZHRoKHcpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGNvbnRleHQgYXMgYSBwYXJhbWV0ZXIgc3RyaW5nXG4gICAgLy8gQ3VycmVudCBjb250ZXh0ID0gcmVmIGdlbm9tZSArIGNvbXAgZ2Vub21lcyArIGN1cnJlbnQgcmFuZ2UgKGNocixzdGFydCxlbmQpXG4gICAgZ2V0UGFyYW1TdHJpbmcgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuICAgICAgICBsZXQgcmVmID0gYHJlZj0ke2MucmVmfWA7XG4gICAgICAgIGxldCBnZW5vbWVzID0gYGdlbm9tZXM9JHtjLmdlbm9tZXMuam9pbihcIitcIil9YDtcblx0bGV0IGNvb3JkcyA9IGBjaHI9JHtjLmNocn0mc3RhcnQ9JHtjLnN0YXJ0fSZlbmQ9JHtjLmVuZH1gO1xuXHRsZXQgbGZsZiA9IGMuZmxhbmsgPyAnJmZsYW5rPScrYy5mbGFuayA6ICcmbGVuZ3RoPScrYy5sZW5ndGg7XG5cdGxldCBsY29vcmRzID0gYGxhbmRtYXJrPSR7Yy5sYW5kbWFya30mZGVsdGE9JHtjLmRlbHRhfSR7bGZsZn1gO1xuXHRsZXQgaGxzID0gYGhpZ2hsaWdodD0ke2MuaGlnaGxpZ2h0LmpvaW4oXCIrXCIpfWA7XG5cdGxldCBkbW9kZSA9IGBkbW9kZT0ke2MuZG1vZGV9YDtcblx0cmV0dXJuIGAke3RoaXMuY21vZGU9PT0nbWFwcGVkJz9jb29yZHM6bGNvb3Jkc30mJHtkbW9kZX0mJHtyZWZ9JiR7Z2Vub21lc30mJHtobHN9YDtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgY3VycmVudExpc3QgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyTGlzdDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0IGN1cnJlbnRMaXN0IChsc3QpIHtcbiAgICBcdC8vXG5cdGxldCBwcmV2TGlzdCA9IHRoaXMuY3Vyckxpc3Q7XG5cdHRoaXMuY3Vyckxpc3QgPSBsc3Q7XG5cdC8vXG5cdGxldCBsaXN0cyA9IGQzLnNlbGVjdCgnI215bGlzdHMnKS5zZWxlY3RBbGwoJy5saXN0SW5mbycpO1xuXHRsaXN0cy5jbGFzc2VkKFwiY3VycmVudFwiLCBkID0+IGQgPT09IGxzdCk7XG5cdC8vXG5cdGlmIChsc3QpIHtcblx0ICAgIGlmIChsc3QgPT09IHByZXZMaXN0KVxuXHQgICAgICAgIHRoaXMuY3Vyckxpc3RDb3VudGVyID0gKHRoaXMuY3Vyckxpc3RDb3VudGVyICsgMSkgJSB0aGlzLmN1cnJMaXN0Lmlkcy5sZW5ndGg7XG5cdCAgICBlbHNlXG5cdCAgICAgICAgdGhpcy5jdXJyTGlzdENvdW50ZXIgPSAwO1xuXHQgICAgbGV0IGN1cnJJZCA9IGxzdC5pZHNbdGhpcy5jdXJyTGlzdENvdW50ZXJdO1xuXHQgICAgLy8gc2hvdyB0aGlzIGxpc3QgYXMgdGljayBtYXJrcyBpbiB0aGUgZ2Vub21lIHZpZXdcblx0ICAgIHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXNCeUlkKHRoaXMuckdlbm9tZSwgbHN0Lmlkcylcblx0XHQudGhlbiggZmVhdHMgPT4ge1xuXHRcdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd1RpY2tzKGZlYXRzKTtcblx0XHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdUaXRsZSgpO1xuXHRcdCAgICB0aGlzLnNldENvb3JkaW5hdGVzKGN1cnJJZCk7XG5cdFx0fSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICB0aGlzLmN1cnJMaXN0Q291bnRlciA9IDA7XG5cdCAgICAvL1xuXHQgICAgdGhpcy56b29tVmlldy5oaUZlYXRzID0ge307XG5cdCAgICB0aGlzLnpvb21WaWV3LnVwZGF0ZSgpO1xuXHQgICAgLy9cblx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3VGlja3MoW10pO1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdUaXRsZSgpO1xuXHR9XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcGFuem9vbShwZmFjdG9yLCB6ZmFjdG9yKSB7XG5cdC8vXG5cdCFwZmFjdG9yICYmIChwZmFjdG9yID0gMCk7XG5cdCF6ZmFjdG9yICYmICh6ZmFjdG9yID0gMSk7XG5cdC8vXG5cdGxldCBjID0gdGhpcy5jb29yZHM7XG5cdGxldCB3aWR0aCA9IGMuZW5kIC0gYy5zdGFydCArIDE7XG5cdGxldCBtaWQgPSAoYy5zdGFydCArIGMuZW5kKS8yO1xuXHRsZXQgY2hyID0gdGhpcy5yR2Vub21lLmNocm9tb3NvbWVzLmZpbHRlcihjID0+IGMubmFtZSA9PT0gdGhpcy5jb29yZHMuY2hyKVswXTtcblx0bGV0IG5jeHQgPSB7fTsgLy8gbmV3IGNvbnRleHRcblx0bGV0IG1pbkQgPSAtKGMuc3RhcnQtMSk7IC8vIG1pbiBkZWx0YSAoYXQgY3VycmVudCB6b29tKVxuXHRsZXQgbWF4RCA9IGNoci5sZW5ndGggLSBjLmVuZDsgLy8gbWF4IGRlbHRhIChhdCBjdXJyZW50IHpvb20pXG5cdGxldCBkID0gY2xpcChwZmFjdG9yICogd2lkdGgsIG1pbkQsIG1heEQpOyAvLyBkZWx0YSAoYXQgbmV3IHpvb20pXG5cdGxldCBuZXd3aWR0aCA9IHpmYWN0b3IgKiB3aWR0aDtcblx0bGV0IG5ld3N0YXJ0ID0gbWlkIC0gbmV3d2lkdGgvMiArIGQ7XG5cdC8vXG5cdGlmICh0aGlzLmNtb2RlID09PSAnbWFwcGVkJykge1xuXHQgICAgbmN4dC5jaHIgPSBjLmNocjtcblx0ICAgIG5jeHQuc3RhcnQgPSBuZXdzdGFydDtcblx0ICAgIG5jeHQuZW5kID0gbmV3c3RhcnQgKyBuZXd3aWR0aCAtIDE7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICBuY3h0Lmxlbmd0aCA9IG5ld3dpZHRoO1xuXHQgICAgbmN4dC5kZWx0YSA9IHRoaXMubGNvb3Jkcy5kZWx0YSArIGQgO1xuXHR9XG5cdHRoaXMuc2V0Q29udGV4dChuY3h0KTtcbiAgICB9XG4gICAgem9vbSAoZmFjdG9yKSB7XG4gICAgICAgIHRoaXMucGFuem9vbShudWxsLCBmYWN0b3IpO1xuICAgIH1cbiAgICBwYW4gKGZhY3Rvcikge1xuICAgICAgICB0aGlzLnBhbnpvb20oZmFjdG9yLCBudWxsKTtcbiAgICB9XHRcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBab29tcyBpbi9vdXQgYnkgZmFjdG9yLiBOZXcgem9vbSB3aWR0aCBpcyBmYWN0b3IgKiB0aGUgY3VycmVudCB3aWR0aC5cbiAgICAvLyBGYWN0b3IgPiAxIHpvb21zIG91dCwgMCA8IGZhY3RvciA8IDEgem9vbXMgaW4uXG4gICAgeHpvb20gKGZhY3Rvcikge1xuXHRsZXQgbGVuID0gdGhpcy5jb29yZHMuZW5kIC0gdGhpcy5jb29yZHMuc3RhcnQgKyAxO1xuXHRsZXQgbmV3bGVuID0gTWF0aC5yb3VuZChmYWN0b3IgKiBsZW4pO1xuXHRsZXQgeCA9ICh0aGlzLmNvb3Jkcy5zdGFydCArIHRoaXMuY29vcmRzLmVuZCkvMjtcblx0aWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKSB7XG5cdCAgICBsZXQgbmV3c3RhcnQgPSBNYXRoLnJvdW5kKHggLSBuZXdsZW4vMik7XG5cdCAgICB0aGlzLnNldENvbnRleHQoeyBjaHI6IHRoaXMuY29vcmRzLmNociwgc3RhcnQ6IG5ld3N0YXJ0LCBlbmQ6IG5ld3N0YXJ0ICsgbmV3bGVuIC0gMSB9KTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuc2V0Q29udGV4dCh7IGxlbmd0aDogbmV3bGVuIH0pO1xuXHR9XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUGFucyB0aGUgdmlldyBsZWZ0IG9yIHJpZ2h0IGJ5IGZhY3Rvci4gVGhlIGRpc3RhbmNlIG1vdmVkIGlzIGZhY3RvciB0aW1lcyB0aGUgY3VycmVudCB6b29tIHdpZHRoLlxuICAgIC8vIE5lZ2F0aXZlIHZhbHVlcyBwYW4gbGVmdC4gUG9zaXRpdmUgdmFsdWVzIHBhbiByaWdodC4gKE5vdGUgdGhhdCBwYW5uaW5nIG1vdmVzIHRoZSBcImNhbWVyYVwiLiBQYW5uaW5nIHRvIHRoZVxuICAgIC8vIHJpZ2h0IG1ha2VzIHRoZSBvYmplY3RzIGluIHRoZSBzY2VuZSBhcHBlYXIgdG8gbW92ZSB0byB0aGUgbGVmdCwgYW5kIHZpY2UgdmVyc2EuKVxuICAgIC8vXG4gICAgeHBhbiAoZmFjdG9yKSB7XG5cdGxldCBjID0gdGhpcy5jb29yZHM7XG5cdGxldCBjaHIgPSB0aGlzLnJHZW5vbWUuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSB0aGlzLmNvb3Jkcy5jaHIpWzBdO1xuXHRsZXQgd2lkdGggPSBjLmVuZCAtIGMuc3RhcnQgKyAxO1xuXHRsZXQgbWluRCA9IC0oYy5zdGFydC0xKTtcblx0bGV0IG1heEQgPSBjaHIubGVuZ3RoIC0gYy5lbmQ7XG5cdGxldCBkID0gY2xpcChmYWN0b3IgKiB3aWR0aCwgbWluRCwgbWF4RCk7XG5cdGlmICh0aGlzLmNtb2RlID09PSAnbWFwcGVkJykge1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgY2hyOiBjLmNociwgc3RhcnQ6IGMuc3RhcnQrZCwgZW5kOiBjLmVuZCtkIH0pO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgZGVsdGE6IHRoaXMubGNvb3Jkcy5kZWx0YSArIGQgfSk7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RmVhdFR5cGVDb250cm9sIChmYWNldCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCBjb2xvcnMgPSB0aGlzLmNzY2FsZS5kb21haW4oKS5tYXAobGJsID0+IHtcblx0ICAgIHJldHVybiB7IGxibDpsYmwsIGNscjp0aGlzLmNzY2FsZShsYmwpIH07XG5cdH0pO1xuXHRsZXQgY2tlcyA9IGQzLnNlbGVjdChcIi5jb2xvcktleVwiKVxuXHQgICAgLnNlbGVjdEFsbCgnLmNvbG9yS2V5RW50cnknKVxuXHRcdC5kYXRhKGNvbG9ycyk7XG5cdGxldCBuY3MgPSBja2VzLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsIFwiY29sb3JLZXlFbnRyeSBmbGV4cm93XCIpO1xuXHRuY3MuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJzd2F0Y2hcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBjID0+IGMubGJsKVxuXHQgICAgLnN0eWxlKFwiYmFja2dyb3VuZC1jb2xvclwiLCBjID0+IGMuY2xyKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdGxldCB0ID0gZDMuc2VsZWN0KHRoaXMpO1xuXHQgICAgICAgIHQuY2xhc3NlZChcImNoZWNrZWRcIiwgISB0LmNsYXNzZWQoXCJjaGVja2VkXCIpKTtcblx0XHRsZXQgc3dhdGNoZXMgPSBkMy5zZWxlY3RBbGwoXCIuc3dhdGNoLmNoZWNrZWRcIilbMF07XG5cdFx0bGV0IGZ0cyA9IHN3YXRjaGVzLm1hcChzPT5zLmdldEF0dHJpYnV0ZShcIm5hbWVcIikpXG5cdFx0ZmFjZXQuc2V0VmFsdWVzKGZ0cyk7XG5cdFx0c2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0ICAgIH0pXG5cdCAgICAuYXBwZW5kKFwiaVwiKVxuXHQgICAgICAgIC5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zXCIpO1xuXHRuY3MuYXBwZW5kKFwic3BhblwiKVxuXHQgICAgLnRleHQoYyA9PiBjLmxibCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGlua1RvTWdpU25wUmVwb3J0ICgpIHtcblx0bGV0IGMgPSB0aGlzLmdldENvbnRleHQoKTtcblx0bGV0IHVybEJhc2UgPSAnaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL3NucC9zdW1tYXJ5Jztcblx0bGV0IHRhYkFyZyA9ICdzZWxlY3RlZFRhYj0xJztcblx0bGV0IHNlYXJjaEJ5QXJnID0gJ3NlYXJjaEJ5U2FtZURpZmY9Jztcblx0bGV0IGNockFyZyA9IGBzZWxlY3RlZENocm9tb3NvbWU9JHtjLmNocn1gO1xuXHRsZXQgY29vcmRBcmcgPSBgY29vcmRpbmF0ZT0ke2Muc3RhcnR9LSR7Yy5lbmR9YDtcblx0bGV0IHVuaXRBcmcgPSAnY29vcmRpbmF0ZVVuaXQ9YnAnO1xuXHRsZXQgY3NBcmdzID0gYy5nZW5vbWVzLm1hcChnID0+IGBzZWxlY3RlZFN0cmFpbnM9JHtnfWApXG5cdGxldCByc0FyZyA9IGByZWZlcmVuY2VTdHJhaW49JHtjLnJlZn1gO1xuXHRsZXQgbGlua1VybCA9IGAke3VybEJhc2V9PyR7dGFiQXJnfSYke3NlYXJjaEJ5QXJnfSYke2NockFyZ30mJHtjb29yZEFyZ30mJHt1bml0QXJnfSYke3JzQXJnfSYke2NzQXJncy5qb2luKCcmJyl9YFxuXHR3aW5kb3cub3BlbihsaW5rVXJsLCBcIl9ibGFua1wiKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGlua1RvTWdpUVRMcyAoKSB7XG5cdGxldCBjICAgICAgICA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRsZXQgdXJsQmFzZSAgPSAnaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL2FsbGVsZS9zdW1tYXJ5Jztcblx0bGV0IGNockFyZyAgID0gYGNocm9tb3NvbWU9JHtjLmNocn1gO1xuXHRsZXQgY29vcmRBcmcgPSBgY29vcmRpbmF0ZT0ke2Muc3RhcnR9LSR7Yy5lbmR9YDtcblx0bGV0IHVuaXRBcmcgID0gJ2Nvb3JkVW5pdD1icCc7XG5cdGxldCB0eXBlQXJnICA9ICdhbGxlbGVUeXBlPVFUTCc7XG5cdGxldCBsaW5rVXJsICA9IGAke3VybEJhc2V9PyR7Y2hyQXJnfSYke2Nvb3JkQXJnfSYke3VuaXRBcmd9JiR7dHlwZUFyZ31gO1xuXHR3aW5kb3cub3BlbihsaW5rVXJsLCBcIl9ibGFua1wiKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGlua1RvTWdpSkJyb3dzZSAoKSB7XG5cdGxldCBjID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdGxldCB1cmxCYXNlID0gJ2h0dHA6Ly9qYnJvd3NlLmluZm9ybWF0aWNzLmpheC5vcmcvJztcblx0bGV0IGRhdGFBcmcgPSAnZGF0YT1kYXRhJTJGbW91c2UnOyAvLyBcImRhdGEvbW91c2VcIlxuXHRsZXQgbG9jQXJnICA9IGBsb2M9Y2hyJHtjLmNocn0lM0Eke2Muc3RhcnR9Li4ke2MuZW5kfWA7XG5cdGxldCB0cmFja3MgID0gWydETkEnLCdNR0lfR2Vub21lX0ZlYXR1cmVzJywnTkNCSV9DQ0RTJywnTkNCSScsJ0VOU0VNQkwnXTtcblx0bGV0IHRyYWNrc0FyZz1gdHJhY2tzPSR7dHJhY2tzLmpvaW4oJywnKX1gO1xuXHRsZXQgaGlnaGxpZ2h0QXJnID0gJ2hpZ2hsaWdodD0nO1xuXHRsZXQgbGlua1VybCA9IGAke3VybEJhc2V9PyR7IFtkYXRhQXJnLGxvY0FyZyx0cmFja3NBcmcsaGlnaGxpZ2h0QXJnXS5qb2luKCcmJykgfWA7XG5cdHdpbmRvdy5vcGVuKGxpbmtVcmwsIFwiX2JsYW5rXCIpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIE1HVkFwcFxuXG5leHBvcnQgeyBNR1ZBcHAgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL01HVkFwcC5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBHZW5vbWUge1xuICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG4gICAgdGhpcy5uYW1lID0gY2ZnLm5hbWU7XG4gICAgdGhpcy5sYWJlbD0gY2ZnLmxhYmVsO1xuICAgIHRoaXMuY2hyb21vc29tZXMgPSBbXTtcbiAgICB0aGlzLm1heGxlbiA9IC0xO1xuICAgIHRoaXMueHNjYWxlID0gbnVsbDtcbiAgICB0aGlzLnlzY2FsZSA9IG51bGw7XG4gICAgdGhpcy56b29tWSAgPSAtMTtcbiAgfVxuICBnZXRDaHJvbW9zb21lIChuKSB7XG4gICAgICBpZiAodHlwZW9mKG4pID09PSAnc3RyaW5nJylcblx0ICByZXR1cm4gdGhpcy5jaHJvbW9zb21lcy5maWx0ZXIoYyA9PiBjLm5hbWUgPT09IG4pWzBdO1xuICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiB0aGlzLmNocm9tb3NvbWVzW25dO1xuICB9XG4gIGhhc0Nocm9tb3NvbWUgKG4pIHtcbiAgICAgIHJldHVybiB0aGlzLmdldENocm9tb3NvbWUobikgPyB0cnVlIDogZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IHsgR2Vub21lIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9HZW5vbWUuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtkM2pzb24sIG92ZXJsYXBzLCBzdWJ0cmFjdH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge0ZlYXR1cmV9IGZyb20gJy4vRmVhdHVyZSc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSG93IHRoZSBhcHAgbG9hZHMgZmVhdHVyZSBkYXRhLiBQcm92aWRlcyB0d28gY2FsbHM6XG4vLyAgIC0gZ2V0IGZlYXR1cmVzIGluIHJhbmdlXG4vLyAgIC0gZ2V0IGZlYXR1cmVzIGJ5IGlkXG4vLyBSZXF1ZXN0cyBmZWF0dXJlcyBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHJlZ2lzdGVycyB0aGVtIGluIGEgY2FjaGUuXG4vLyBJbnRlcmFjdHMgd2l0aCB0aGUgYmFjayBlbmQgdG8gbG9hZCBmZWF0dXJlczsgdHJpZXMgbm90IHRvIHJlcXVlc3Rcbi8vIHRoZSBzYW1lIHJlZ2lvbiB0d2ljZS5cbi8vXG5jbGFzcyBGZWF0dXJlTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICAgICAgdGhpcy5pZDJmZWF0ID0ge307XHRcdC8vIGluZGV4IGZyb20gIGZlYXR1cmUgSUQgdG8gZmVhdHVyZVxuXHR0aGlzLmNhbm9uaWNhbDJmZWF0cyA9IHt9O1x0Ly8gaW5kZXggZnJvbSBjYW5vbmljYWwgSUQgLT4gWyBmZWF0dXJlcyB0YWdnZWQgd2l0aCB0aGF0IGlkIF1cblx0dGhpcy5zeW1ib2wyZmVhdHMgPSB7fVx0XHQvLyBpbmRleCBmcm9tIHN5bWJvbCAtPiBbIGZlYXR1cmVzIGhhdmluZyB0aGF0IHN5bWJvbCBdXG5cdHRoaXMuY2FjaGUgPSB7fTtcdFx0Ly8ge2dlbm9tZS5uYW1lIC0+IHtjaHIubmFtZSAtPiBsaXN0IG9mIGJsb2Nrc319XG5cdHRoaXMubWluZUZlYXR1cmVDYWNoZSA9IHt9O1x0Ly8gYXV4aWxpYXJ5IGluZm8gcHVsbGVkIGZyb20gTW91c2VNaW5lIFxuXHR0aGlzLmxvYWRlZEdlbm9tZXMgPSBuZXcgU2V0KCk7IC8vIHRoZSBzZXQgb2YgR2Vub21lcyB0aGF0IGhhdmUgYmVlbiBmdWxseSBsb2FkZWRcbiAgICB9XG4gXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUHJvY2Vzc2VzIHRoZSBcInJhd1wiIGZlYXR1cmVzIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgLy8gVHVybnMgdGhlbSBpbnRvIEZlYXR1cmUgb2JqZWN0cyBhbmQgcmVnaXN0ZXJzIHRoZW0uXG4gICAgLy8gSWYgdGhlIHNhbWUgcmF3IGZlYXR1cmUgaXMgcmVnaXN0ZXJlZCBhZ2FpbixcbiAgICAvLyB0aGUgRmVhdHVyZSBvYmplY3QgY3JlYXRlZCB0aGUgZmlyc3QgdGltZSBpcyByZXR1cm5lZC5cbiAgICAvLyAoSS5lLiwgcmVnaXN0ZXJpbmcgdGhlIHNhbWUgZmVhdHVyZSBtdWx0aXBsZSB0aW1lcyBpcyBvaylcbiAgICAvL1xuICAgIHByb2Nlc3NGZWF0dXJlcyAoZmVhdHMsIGdlbm9tZSkge1xuXHRyZXR1cm4gZmVhdHMubWFwKGQgPT4ge1xuXHQgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgdGhpcyBvbmUgaW4gdGhlIGNhY2hlLCByZXR1cm4gaXQuXG5cdCAgICBsZXQgZiA9IHRoaXMuaWQyZmVhdFtkLm1ncGlkXTtcblx0ICAgIGlmIChmKSByZXR1cm4gZjtcblx0ICAgIC8vIENyZWF0ZSBhIG5ldyBGZWF0dXJlXG5cdCAgICBkLmdlbm9tZSA9IGdlbm9tZVxuXHQgICAgZiA9IG5ldyBGZWF0dXJlKGQpO1xuXHQgICAgLy8gUmVnaXN0ZXIgaXQuXG5cdCAgICB0aGlzLmlkMmZlYXRbZi5tZ3BpZF0gPSBmO1xuXHQgICAgaWYgKGYubWdpaWQgJiYgZi5tZ2lpZCAhPT0gJy4nKSB7XG5cdFx0bGV0IGxzdCA9IHRoaXMuY2Fub25pY2FsMmZlYXRzW2YubWdpaWRdID0gKHRoaXMuY2Fub25pY2FsMmZlYXRzW2YubWdpaWRdIHx8IFtdKTtcblx0XHRsc3QucHVzaChmKTtcblx0ICAgIH1cblx0ICAgIGlmIChmLnN5bWJvbCAmJiBmLnN5bWJvbCAhPT0gJy4nKSB7XG5cdFx0bGV0IGxzdCA9IHRoaXMuc3ltYm9sMmZlYXRzW2Yuc3ltYm9sXSA9ICh0aGlzLnN5bWJvbDJmZWF0c1tmLnN5bWJvbF0gfHwgW10pO1xuXHRcdGxzdC5wdXNoKGYpO1xuXHQgICAgfVxuXHQgICAgLy8gaGVyZSB5J2dvLlxuXHQgICAgcmV0dXJuIGY7XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJlZ2lzdGVycyBhbiBpbmRleCBibG9jayBmb3IgdGhlIGdpdmVuIGdlbm9tZS4gQW4gaW5kZXggYmxvY2tcbiAgICAvLyBpcyBhIGNvbnRpZ3VvdXMgY2h1bmsgb2YgZmVhdHVlcyBmcm9tIHRoZSBHRkYgZmlsZSBmb3IgdGhhdCBnZW5vbWUuXG4gICAgLy8gUmVnaXN0ZXJpbmcgdGhlIHNhbWUgYmxvY2sgbXVsdGlwbGUgdGltZXMgaXMgb2sgLSBzdWNjZXNzaXZlIHRpbWVzXG4gICAgLy8gaGF2ZSBubyBlZmZlY3QuXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vICAgQWRkcyB0aGUgYmxvY2sgdG8gdGhlIGNhY2hlXG4gICAgLy8gICBSZXBsYWNlcyBlYWNoIHJhdyBmZWF0dXJlIGluIHRoZSBibG9jayB3aXRoIGEgRmVhdHVyZSBvYmplY3QuXG4gICAgLy8gICBSZWdpc3RlcnMgbmV3IEZlYXR1cmVzIGluIGEgbG9va3VwLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICBnZW5vbWUgKG9iamVjdCkgVGhlIGdlbm9tZSB0aGUgYmxvY2sgaXMgZm9yLFxuICAgIC8vICAgYmxrIChvYmplY3QpIEFuIGluZGV4IGJsb2NrLCB3aGljaCBoYXMgYSBjaHIsIHN0YXJ0LCBlbmQsXG4gICAgLy8gICBcdGFuZCBhIGxpc3Qgb2YgXCJyYXdcIiBmZWF0dXJlIG9iamVjdHMuXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgIG5vdGhpbmdcbiAgICAvL1xuICAgIF9yZWdpc3RlckJsb2NrIChnZW5vbWUsIGJsaykge1xuXHQvLyBnZW5vbWUgY2FjaGVcbiAgICAgICAgbGV0IGdjID0gdGhpcy5jYWNoZVtnZW5vbWUubmFtZV0gPSAodGhpcy5jYWNoZVtnZW5vbWUubmFtZV0gfHwge30pO1xuXHQvLyBjaHJvbW9zb21lIGNhY2hlICh3L2luIGdlbm9tZSlcblx0bGV0IGNjID0gZ2NbYmxrLmNocl0gPSAoZ2NbYmxrLmNocl0gfHwgW10pO1xuXHRpZiAoY2MuZmlsdGVyKGIgPT4gYi5pZCA9PT0gYmxrLmlkKS5sZW5ndGggPT09IDApIHtcblx0ICAgIGJsay5mZWF0dXJlcyA9IHRoaXMucHJvY2Vzc0ZlYXR1cmVzKCBibGsuZmVhdHVyZXMsIGdlbm9tZSApO1xuXHQgICAgYmxrLmdlbm9tZSA9IGdlbm9tZTtcblx0ICAgIGNjLnB1c2goYmxrKTtcblx0ICAgIGNjLnNvcnQoIChhLGIpID0+IGEuc3RhcnQgLSBiLnN0YXJ0ICk7XG5cdH1cblx0Ly9lbHNlXG5cdCAgICAvL2NvbnNvbGUubG9nKFwiU2tpcHBlZCBibG9jay4gQWxyZWFkeSBzZWVuLlwiLCBnZW5vbWUubmFtZSwgYmxrLmlkKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSByZW1haW5kZXIgb2YgdGhlIGdpdmVuIHJhbmdlIGFmdGVyXG4gICAgLy8gc3VidHJhY3RpbmcgdGhlIGFscmVhZHktZW5zdXJlZCByYW5nZXMuXG4gICAgLy8gXG4gICAgX3N1YnRyYWN0UmFuZ2UoZ2Vub21lLCByYW5nZSl7XG5cdGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdO1xuXHRpZiAoIWdjKSB0aHJvdyBcIk5vIHN1Y2ggZ2Vub21lOiBcIiArIGdlbm9tZS5uYW1lO1xuXHRsZXQgZ0Jsa3MgPSBnY1tyYW5nZS5jaHJdIHx8IFtdO1xuXHRsZXQgYW5zID0gW107XG5cdGxldCBybmcgPSByYW5nZTtcblx0Z0Jsa3MuZm9yRWFjaCggYiA9PiB7XG5cdCAgICBsZXQgc3ViID0gcm5nID8gc3VidHJhY3QoIHJuZywgYiApIDogW107XG5cdCAgICBpZiAoc3ViLmxlbmd0aCA9PT0gMClcblx0ICAgICAgICBybmcgPSBudWxsO1xuXHQgICAgaWYgKHN1Yi5sZW5ndGggPT09IDEpXG5cdCAgICAgICAgcm5nID0gc3ViWzBdO1xuXHQgICAgZWxzZSBpZiAoc3ViLmxlbmd0aCA9PT0gMil7XG5cdCAgICAgICAgYW5zLnB1c2goc3ViWzBdKTtcblx0XHRybmcgPSBzdWJbMV07XG5cdCAgICB9XG5cdH0pXG5cdHJuZyAmJiBhbnMucHVzaChybmcpO1xuXHRhbnMuc29ydCggKGEsYikgPT4gYS5zdGFydCAtIGIuc3RhcnQgKTtcblx0cmV0dXJuIGFucztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ2FsbHMgc3VidHJhY3RSYW5nZSBmb3IgZWFjaCByYW5nZSBpbiB0aGUgbGlzdCBhbmQgcmV0dXJuc1xuICAgIC8vIHRoZSBhY2N1bXVsYXRlZCByZXN1bHRzLlxuICAgIC8vXG4gICAgX3N1YnRyYWN0UmFuZ2VzKGdlbm9tZSwgcmFuZ2VzKSB7XG5cdGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdO1xuXHRpZiAoIWdjKSByZXR1cm4gcmFuZ2VzO1xuXHRsZXQgbmV3cmFuZ2VzID0gW107XG5cdHJhbmdlcy5mb3JFYWNoKHIgPT4ge1xuXHQgICAgbmV3cmFuZ2VzID0gbmV3cmFuZ2VzLmNvbmNhdCh0aGlzLl9zdWJ0cmFjdFJhbmdlKGdlbm9tZSwgcikpO1xuXHR9LCB0aGlzKVxuXHRyZXR1cm4gbmV3cmFuZ2VzO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEVuc3VyZXMgdGhhdCBhbGwgZmVhdHVyZXMgaW4gdGhlIHNwZWNpZmllZCByYW5nZShzKSBpbiB0aGUgc3BlY2lmaWVkIGdlbm9tZVxuICAgIC8vIGFyZSBpbiB0aGUgY2FjaGUuIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdHJ1ZSB3aGVuIHRoZSBjb25kaXRpb24gaXMgbWV0LlxuICAgIF9lbnN1cmVGZWF0dXJlc0J5UmFuZ2UgKGdlbm9tZSwgcmFuZ2VzKSB7XG5cdGxldCBuZXdyYW5nZXMgPSB0aGlzLl9zdWJ0cmFjdFJhbmdlcyhnZW5vbWUsIHJhbmdlcyk7XG5cdGlmIChuZXdyYW5nZXMubGVuZ3RoID09PSAwKSBcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0bGV0IGNvb3Jkc0FyZyA9IG5ld3Jhbmdlcy5tYXAociA9PiBgJHtyLmNocn06JHtyLnN0YXJ0fS4uJHtyLmVuZH1gKS5qb2luKCcsJyk7XG5cdGxldCBkYXRhU3RyaW5nID0gYGdlbm9tZT0ke2dlbm9tZS5uYW1lfSZjb29yZHM9JHtjb29yZHNBcmd9YDtcblx0bGV0IHVybCA9IFwiLi9iaW4vZ2V0RmVhdHVyZXMuY2dpP1wiICsgZGF0YVN0cmluZztcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRjb25zb2xlLmxvZyhcIlJlcXVlc3Rpbmc6XCIsIGdlbm9tZS5uYW1lLCBuZXdyYW5nZXMpO1xuXHRyZXR1cm4gZDNqc29uKHVybCkudGhlbihmdW5jdGlvbihibG9ja3Mpe1xuXHQgICAgYmxvY2tzLmZvckVhY2goIGIgPT4gc2VsZi5fcmVnaXN0ZXJCbG9jayhnZW5vbWUsIGIpICk7XG5cdCAgICBzZWxmLmFwcC5zaG93U3RhdHVzKGBMb2FkZWQ6ICR7Z2Vub21lLm5hbWV9YCk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fSk7XG4gICAgfVxuIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIF9lbnN1cmVGZWF0dXJlc0J5R2Vub21lIChnZW5vbWUpIHtcblx0aWYoIHRoaXMubG9hZGVkR2Vub21lcy5oYXMoZ2Vub21lKSApXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgICBsZXQgcmFuZ2VzID0gZ2Vub21lLmNocm9tb3NvbWVzLm1hcChjID0+IHsgXG5cdCAgICByZXR1cm4geyBjaHI6IGMubmFtZSwgc3RhcnQ6IDEsIGVuZDogYy5sZW5ndGggfTtcblx0fSk7XG5cdHJldHVybiB0aGlzLl9lbnN1cmVGZWF0dXJlc0J5UmFuZ2UoZ2Vub21lLCByYW5nZXMpLnRoZW4oeD0+eyB0aGlzLmxvYWRlZEdlbm9tZXMuYWRkKGdlbm9tZSk7IHJldHVybiB0cnVlO30pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxvYWRHZW5vbWVzIChnZW5vbWVzKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChnZW5vbWVzLm1hcChnID0+IHRoaXMuX2Vuc3VyZUZlYXR1cmVzQnlHZW5vbWUgKGcpKSkudGhlbigoKT0+dHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgX2dldENhY2hlZEZlYXR1cmVzIChnZW5vbWUsIHJhbmdlKSB7XG4gICAgICAgIGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdIDtcblx0aWYgKCFnYykgcmV0dXJuIFtdO1xuXHRsZXQgY0Jsb2NrcyA9IGdjW3JhbmdlLmNocl07XG5cdGlmICghY0Jsb2NrcykgcmV0dXJuIFtdO1xuXHRsZXQgZmVhdHMgPSBjQmxvY2tzXG5cdCAgICAuZmlsdGVyKGNiID0+IG92ZXJsYXBzKGNiLCByYW5nZSkpXG5cdCAgICAubWFwKCBjYiA9PiBjYi5mZWF0dXJlcy5maWx0ZXIoIGYgPT4gb3ZlcmxhcHMoIGYsIHJhbmdlKSApIClcblx0ICAgIC5yZWR1Y2UoIChhY2MsIHZhbCkgPT4gYWNjLmNvbmNhdCh2YWwpLCBbXSk7XG4gICAgICAgIHJldHVybiBmZWF0cztcdFxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYWxsIGNhY2hlZCBmZWF0dXJlcyBoYXZpbmcgdGhlIGdpdmVuIGNhbm9uaWNhbCBpZC5cbiAgICBnZXRDYWNoZWRGZWF0dXJlQnlJZCAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQyZmVhdHNbaWRdO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYWxsIGNhY2hlZCBmZWF0dXJlcyBoYXZpbmcgdGhlIGdpdmVuIGNhbm9uaWNhbCBpZC5cbiAgICBnZXRDYWNoZWRGZWF0dXJlc0J5Q2Fub25pY2FsSWQgKGNpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW5vbmljYWwyZmVhdHNbY2lkXSB8fCBbXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgbGlzdCBvZiBmZWF0dXJlcyB0aGF0IG1hdGNoIHRoZSBnaXZlbiBsYWJlbCwgd2hpY2ggY2FuIGJlIGFuIGlkLCBjYW5vbmljYWwgaWQsIG9yIHN5bWJvbC5cbiAgICAvLyBJZiBnZW5vbWUgaXMgc3BlY2lmaWVkLCBsaW1pdCByZXN1bHRzIHRvIGZlYXR1cmVzIGZyb20gdGhhdCBnZW5vbWUuXG4gICAgLy8gXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsIChsYWJlbCwgZ2Vub21lKSB7XG5cdGxldCBmID0gdGhpcy5pZDJmZWF0W2xhYmVsXVxuXHRsZXQgZmVhdHMgPSBmID8gW2ZdIDogdGhpcy5jYW5vbmljYWwyZmVhdHNbbGFiZWxdIHx8IHRoaXMuc3ltYm9sMmZlYXRzW2xhYmVsXSB8fCBbXTtcblx0cmV0dXJuIGdlbm9tZSA/IGZlYXRzLmZpbHRlcihmPT4gZi5nZW5vbWUgPT09IGdlbm9tZSkgOiBmZWF0cztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIGZlYXR1cmVzIGluIFxuICAgIC8vIHRoZSBzcGVjaWZpZWQgcmFuZ2VzIG9mIHRoZSBzcGVjaWZpZWQgZ2Vub21lLlxuICAgIGdldEZlYXR1cmVzIChnZW5vbWUsIHJhbmdlcykge1xuXHRyZXR1cm4gdGhpcy5fZW5zdXJlRmVhdHVyZXNCeUdlbm9tZShnZW5vbWUpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByYW5nZXMuZm9yRWFjaCggciA9PiB7XG5cdCAgICAgICAgci5mZWF0dXJlcyA9IHRoaXMuX2dldENhY2hlZEZlYXR1cmVzKGdlbm9tZSwgcikgXG5cdFx0ci5nZW5vbWUgPSBnZW5vbWU7XG5cdCAgICB9KTtcblx0ICAgIHJldHVybiB7IGdlbm9tZSwgYmxvY2tzOnJhbmdlcyB9O1xuXHR9LmJpbmQodGhpcykpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIGZlYXR1cmVzIGhhdmluZyB0aGUgc3BlY2lmaWVkIGlkcyBmcm9tIHRoZSBzcGVjaWZpZWQgZ2Vub21lLlxuICAgIGdldEZlYXR1cmVzQnlJZCAoZ2Vub21lLCBpZHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Vuc3VyZUZlYXR1cmVzQnlHZW5vbWUoZ2Vub21lKS50aGVuKCAoKSA9PiB7XG5cdCAgICBsZXQgZmVhdHMgPSBbXTtcblx0ICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuXHQgICAgbGV0IGFkZGYgPSAoZikgPT4ge1xuXHRcdGlmIChmLmdlbm9tZSAhPT0gZ2Vub21lKSByZXR1cm47XG5cdFx0aWYgKHNlZW4uaGFzKGYuaWQpKSByZXR1cm47XG5cdFx0c2Vlbi5hZGQoZi5pZCk7XG5cdFx0ZmVhdHMucHVzaChmKTtcblx0ICAgIH07XG5cdCAgICBsZXQgYWRkID0gKGYpID0+IHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShmKSkgXG5cdFx0ICAgIGYuZm9yRWFjaChmZiA9PiBhZGRmKGZmKSk7XG5cdFx0ZWxzZVxuXHRcdCAgICBhZGRmKGYpO1xuXHQgICAgfTtcblx0ICAgIGZvciAobGV0IGkgb2YgaWRzKXtcblx0XHRsZXQgZiA9IHRoaXMuY2Fub25pY2FsMmZlYXRzW2ldIHx8IHRoaXMuaWQyZmVhdFtpXTtcblx0XHRmICYmIGFkZChmKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmZWF0cztcblx0fSk7XG4gICAgfVxuXG59IC8vIGVuZCBjbGFzcyBGZWF0dXJlIE1hbmFnZXJcblxuZXhwb3J0IHsgRmVhdHVyZU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZlYXR1cmVNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGluaXRPcHRMaXN0IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBBdXhEYXRhTWFuYWdlciB9IGZyb20gJy4vQXV4RGF0YU1hbmFnZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIFF1ZXJ5TWFuYWdlciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCBjZmcpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLmNmZyA9IGNmZztcblx0dGhpcy5hdXhEYXRhTWFuYWdlciA9IG5ldyBBdXhEYXRhTWFuYWdlcigpO1xuXHR0aGlzLnNlbGVjdCA9IG51bGw7XHQvLyBteSA8c2VsZWN0PiBlbGVtZW50XG5cdHRoaXMudGVybSA9IG51bGw7XHQvLyBteSA8aW5wdXQ+IGVsZW1lbnRcblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuXHR0aGlzLnNlbGVjdCA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwic2VhcmNodHlwZVwiXScpO1xuXHR0aGlzLnRlcm0gICA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwic2VhcmNodGVybVwiXScpO1xuXHQvL1xuXHR0aGlzLnRlcm0uYXR0cihcInBsYWNlaG9sZGVyXCIsIHRoaXMuY2ZnWzBdLnBsYWNlaG9sZGVyKVxuXHRpbml0T3B0TGlzdCh0aGlzLnNlbGVjdFswXVswXSwgdGhpcy5jZmcsIGM9PmMubWV0aG9kLCBjPT5jLmxhYmVsKTtcblx0Ly8gV2hlbiB1c2VyIGNoYW5nZXMgdGhlIHF1ZXJ5IHR5cGUgKHNlbGVjdG9yKSwgY2hhbmdlIHRoZSBwbGFjZWhvbGRlciB0ZXh0LlxuXHR0aGlzLnNlbGVjdC5vbihcImNoYW5nZVwiLCAoKSA9PiB7XG5cdCAgICBsZXQgb3B0ID0gdGhpcy5zZWxlY3QucHJvcGVydHkoXCJzZWxlY3RlZE9wdGlvbnNcIilbMF07XG5cdCAgICB0aGlzLnRlcm0uYXR0cihcInBsYWNlaG9sZGVyXCIsIG9wdC5fX2RhdGFfXy5wbGFjZWhvbGRlcilcblx0ICAgIFxuXHR9KTtcblx0Ly8gV2hlbiB1c2VyIGVudGVycyBhIHNlYXJjaCB0ZXJtLCBydW4gYSBxdWVyeVxuXHR0aGlzLnRlcm0ub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xuXHQgICAgbGV0IHRlcm0gPSB0aGlzLnRlcm0ucHJvcGVydHkoXCJ2YWx1ZVwiKTtcblx0ICAgIHRoaXMudGVybS5wcm9wZXJ0eShcInZhbHVlXCIsXCJcIik7XG5cdCAgICBsZXQgc2VhcmNoVHlwZSAgPSB0aGlzLnNlbGVjdC5wcm9wZXJ0eShcInZhbHVlXCIpO1xuXHQgICAgbGV0IGxzdE5hbWUgPSB0ZXJtO1xuXHQgICAgZDMuc2VsZWN0KFwiI215bGlzdHNcIikuY2xhc3NlZChcImJ1c3lcIix0cnVlKTsgLy8gRklYTUUgLSByZWFjaG92ZXJcblx0ICAgIHRoaXMuYXV4RGF0YU1hbmFnZXJbc2VhcmNoVHlwZV0odGVybSlcdC8vIDwtIHJ1biB0aGUgcXVlcnlcblx0ICAgICAgLnRoZW4oZmVhdHMgPT4ge1xuXHRcdCAgLy8gRklYTUUgLSByZWFjaG92ZXIgLSB0aGlzIHdob2xlIGhhbmRsZXJcblx0XHQgIGxldCBsc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5jcmVhdGVMaXN0KGxzdE5hbWUsIGZlYXRzLm1hcChmID0+IGYucHJpbWFyeUlkZW50aWZpZXIpKVxuXHRcdCAgdGhpcy5hcHAubGlzdE1hbmFnZXIudXBkYXRlKGxzdCk7XG5cdFx0ICAvL1xuXHRcdCAgdGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0cyA9IHt9O1xuXHRcdCAgZmVhdHMuZm9yRWFjaChmID0+IHRoaXMuYXBwLnpvb21WaWV3LmhpRmVhdHNbZi5tZ2lpZF0gPSBmLm1naWlkKTtcblx0XHQgIHRoaXMuYXBwLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHRcdCAgLy9cblx0XHQgIHRoaXMuYXBwLmN1cnJlbnRMaXN0ID0gbHN0O1xuXHRcdCAgLy9cblx0XHQgIGQzLnNlbGVjdChcIiNteWxpc3RzXCIpLmNsYXNzZWQoXCJidXN5XCIsZmFsc2UpO1xuXHQgICAgICB9KTtcblx0fSlcbiAgICB9XG59XG5cbmV4cG9ydCB7IFF1ZXJ5TWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvUXVlcnlNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBkM2pzb24gfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBdXhEYXRhTWFuYWdlciAtIGtub3dzIGhvdyB0byBxdWVyeSBhbiBleHRlcm5hbCBzb3VyY2UgKGkuZS4sIE1vdXNlTWluZSkgZm9yIGdlbmVzXG4vLyBhbm5vdGF0ZWQgdG8gZGlmZmVyZW50IG9udG9sb2dpZXMuIFxuY2xhc3MgQXV4RGF0YU1hbmFnZXIge1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldEF1eERhdGEgKHEpIHtcblx0bGV0IGZvcm1hdCA9ICdqc29ub2JqZWN0cyc7XG5cdGxldCBxdWVyeSA9IGVuY29kZVVSSUNvbXBvbmVudChxKTtcblx0bGV0IHVybCA9IGBodHRwOi8vd3d3Lm1vdXNlbWluZS5vcmcvbW91c2VtaW5lL3NlcnZpY2UvcXVlcnkvcmVzdWx0cz9mb3JtYXQ9JHtmb3JtYXR9JnF1ZXJ5PSR7cXVlcnl9YDtcblx0cmV0dXJuIGQzanNvbih1cmwpLnRoZW4oZGF0YSA9PiBkYXRhLnJlc3VsdHN8fFtdKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBkbyBhIExPT0tVUCBxdWVyeSBmb3IgU2VxdWVuY2VGZWF0dXJlcyBmcm9tIE1vdXNlTWluZVxuICAgIGZlYXR1cmVzQnlMb29rdXAgKHFyeVN0cmluZykge1xuXHRsZXQgcSA9IGA8cXVlcnkgbmFtZT1cIlwiIG1vZGVsPVwiZ2Vub21pY1wiIFxuXHQgICAgdmlldz1cIlNlcXVlbmNlRmVhdHVyZS5wcmltYXJ5SWRlbnRpZmllciBTZXF1ZW5jZUZlYXR1cmUuc3ltYm9sXCIgXG5cdCAgICBsb25nRGVzY3JpcHRpb249XCJcIiBcblx0ICAgIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEIgYW5kIENcIj5cblx0XHQ8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmVcIiBvcD1cIkxPT0tVUFwiIHZhbHVlPVwiJHtxcnlTdHJpbmd9XCIvPlxuXHRcdDxjb25zdHJhaW50IGNvZGU9XCJCXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vcmdhbmlzbS50YXhvbklkXCIgb3A9XCI9XCIgdmFsdWU9XCIxMDA5MFwiLz5cblx0XHQ8Y29uc3RyYWludCBjb2RlPVwiQ1wiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUuc2VxdWVuY2VPbnRvbG9neVRlcm0ubmFtZVwiIG9wPVwiIT1cIiB2YWx1ZT1cInRyYW5zZ2VuZVwiLz5cblx0ICAgIDwvcXVlcnk+YDtcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZmVhdHVyZXNCeU9udG9sb2d5VGVybSAocXJ5U3RyaW5nLCB0ZXJtVHlwZSkge1xuICAgICAgICBsZXQgcSA9IGA8cXVlcnkgbmFtZT1cIlwiIG1vZGVsPVwiZ2Vub21pY1wiIFxuXHQgIHZpZXc9XCJTZXF1ZW5jZUZlYXR1cmUucHJpbWFyeUlkZW50aWZpZXIgU2VxdWVuY2VGZWF0dXJlLnN5bWJvbFwiIGxvbmdEZXNjcmlwdGlvbj1cIlwiIHNvcnRPcmRlcj1cIlNlcXVlbmNlRmVhdHVyZS5zeW1ib2wgYXNjXCIgY29uc3RyYWludExvZ2ljPVwiQSBhbmQgQiBhbmQgQ1wiPlxuXHQgICAgICA8Y29uc3RyYWludCBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9udG9sb2d5QW5ub3RhdGlvbnMub250b2xvZ3lUZXJtXCIgdHlwZT1cIiR7dGVybVR5cGV9XCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9udG9sb2d5QW5ub3RhdGlvbnMub250b2xvZ3lUZXJtLnBhcmVudHNcIiB0eXBlPVwiJHt0ZXJtVHlwZX1cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJBXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vbnRvbG9neUFubm90YXRpb25zLm9udG9sb2d5VGVybS5wYXJlbnRzXCIgb3A9XCJMT09LVVBcIiB2YWx1ZT1cIiR7cXJ5U3RyaW5nfVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkJcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9yZ2FuaXNtLnRheG9uSWRcIiBvcD1cIj1cIiB2YWx1ZT1cIjEwMDkwXCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiQ1wiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUuc2VxdWVuY2VPbnRvbG9neVRlcm0ubmFtZVwiIG9wPVwiIT1cIiB2YWx1ZT1cInRyYW5zZ2VuZVwiLz5cblx0ICA8L3F1ZXJ5PmBcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gKG5vdCBjdXJyZW50bHkgaW4gdXNlLi4uKVxuICAgIGZlYXR1cmVzQnlQYXRod2F5VGVybSAocXJ5U3RyaW5nKSB7XG4gICAgICAgIGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgdmlldz1cIlBhdGh3YXkuZ2VuZXMucHJpbWFyeUlkZW50aWZpZXIgUGF0aHdheS5nZW5lcy5zeW1ib2xcIiBsb25nRGVzY3JpcHRpb249XCJcIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCXCI+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJQYXRod2F5XCIgY29kZT1cIkFcIiBvcD1cIkxPT0tVUFwiIHZhbHVlPVwiJHtxcnlTdHJpbmd9XCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBwYXRoPVwiUGF0aHdheS5nZW5lcy5vcmdhbmlzbS50YXhvbklkXCIgY29kZT1cIkJcIiBvcD1cIj1cIiB2YWx1ZT1cIjEwMDkwXCIvPlxuXHQgIDwvcXVlcnk+YDtcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZmVhdHVyZXNCeUlkICAgICAgICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlMb29rdXAocXJ5U3RyaW5nKTsgfVxuICAgIGZlYXR1cmVzQnlGdW5jdGlvbiAgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5T250b2xvZ3lUZXJtKHFyeVN0cmluZywgXCJHT1Rlcm1cIik7IH1cbiAgICAvL2ZlYXR1cmVzQnlQYXRod2F5ICAgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5UGF0aHdheVRlcm0ocXJ5U3RyaW5nKTsgfVxuICAgIGZlYXR1cmVzQnlQaGVub3R5cGUgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5T250b2xvZ3lUZXJtKHFyeVN0cmluZywgXCJNUFRlcm1cIik7IH1cbiAgICBmZWF0dXJlc0J5RGlzZWFzZSAgIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeU9udG9sb2d5VGVybShxcnlTdHJpbmcsIFwiRE9UZXJtXCIpOyB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG59XG5cbmV4cG9ydCB7IEF1eERhdGFNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9BdXhEYXRhTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgTG9jYWxTdG9yYWdlTWFuYWdlciB9IGZyb20gJy4vU3RvcmFnZU1hbmFnZXInO1xuaW1wb3J0IHsgTGlzdEZvcm11bGFFdmFsdWF0b3IgfSBmcm9tICcuL0xpc3RGb3JtdWxhRXZhbHVhdG9yJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBNYWludGFpbnMgbmFtZWQgbGlzdHMgb2YgSURzLiBMaXN0cyBtYXkgYmUgdGVtcG9yYXJ5LCBsYXN0aW5nIG9ubHkgZm9yIHRoZSBzZXNzaW9uLCBvciBwZXJtYW5lbnQsXG4vLyBsYXN0aW5nIHVudGlsIHRoZSB1c2VyIGNsZWFycyB0aGUgYnJvd3NlciBsb2NhbCBzdG9yYWdlIGFyZWEuXG4vL1xuLy8gVXNlcyB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UgYW5kIHdpbmRvdy5sb2NhbFN0b3JhZ2UgdG8gc2F2ZSBsaXN0c1xuLy8gdGVtcG9yYXJpbHkgb3IgcGVybWFuZW50bHksIHJlc3AuICBGSVhNRTogc2hvdWxkIGJlIHVzaW5nIHdpbmRvdy5pbmRleGVkREJcbi8vXG5jbGFzcyBMaXN0TWFuYWdlciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0KSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0KTtcblx0dGhpcy5uYW1lMmxpc3QgPSBudWxsO1xuXHR0aGlzLl9saXN0cyA9IG5ldyBMb2NhbFN0b3JhZ2VNYW5hZ2VyICAoXCJsaXN0TWFuYWdlci5saXN0c1wiKVxuXHR0aGlzLmZvcm11bGFFdmFsID0gbmV3IExpc3RGb3JtdWxhRXZhbHVhdG9yKHRoaXMpO1xuXHR0aGlzLl9sb2FkKCk7XG5cdHRoaXMuaW5pdERvbSgpO1xuICAgIH1cbiAgICBpbml0RG9tICgpIHtcblx0Ly8gQnV0dG9uOiBzaG93L2hpZGUgd2FybmluZyBtZXNzYWdlXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b24ud2FybmluZycpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4ge1xuXHQgICAgICAgIGxldCB3ID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJtZXNzYWdlXCJdJyk7XG5cdFx0dy5jbGFzc2VkKCdzaG93aW5nJywgIXcuY2xhc3NlZCgnc2hvd2luZycpKTtcblx0ICAgIH0pO1xuXHQvLyBCdXR0b246IGNyZWF0ZSBsaXN0IGZyb20gY3VycmVudCBzZWxlY3Rpb25cblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwibmV3ZnJvbXNlbGVjdGlvblwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0bGV0IGlkcyA9IE9iamVjdC5rZXlzKHRoaXMuYXBwLnpvb21WaWV3LmhpRmVhdHMpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHRcdGlmIChpZHMubGVuZ3RoID09PSAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTm90aGluZyBzZWxlY3RlZC5cIik7XG5cdFx0ICAgIHJldHVybjtcblx0XHR9XG5cdFx0bGV0IG5ld2xpc3QgPSB0aGlzLmNyZWF0ZUxpc3QoXCJzZWxlY3Rpb25cIiwgaWRzKTtcblx0XHR0aGlzLnVwZGF0ZShuZXdsaXN0KTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbjogY29tYmluZSBsaXN0czogb3BlbiBsaXN0IGVkaXRvciB3aXRoIGZvcm11bGEgZWRpdG9yIG9wZW5cblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiY29tYmluZVwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0aWYgKHRoaXMuZ2V0TmFtZXMoKS5sZW5ndGggPT09IDApIHtcblx0XHQgICAgYWxlcnQoXCJObyBsaXN0cy5cIik7XG5cdFx0ICAgIHJldHVybjtcblx0XHR9XG5cdFx0bGV0IGxlID0gdGhpcy5hcHAubGlzdEVkaXRvcjtcblx0XHRsZS5vcGVuKCk7XG5cdFx0bGUub3BlbkZvcm11bGFFZGl0b3IoKTtcblx0ICAgIH0pO1xuXHQvLyBCdXR0b246IGRlbGV0ZSBhbGwgbGlzdHMgKGdldCBjb25maXJtYXRpb24gZmlyc3QpLlxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJwdXJnZVwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0aWYgKHRoaXMuZ2V0TmFtZXMoKS5sZW5ndGggPT09IDApIHtcblx0XHQgICAgYWxlcnQoXCJObyBsaXN0cy5cIik7XG5cdFx0ICAgIHJldHVybjtcblx0XHR9XG5cdCAgICAgICAgaWYgKHdpbmRvdy5jb25maXJtKFwiRGVsZXRlIGFsbCBsaXN0cy4gQXJlIHlvdSBzdXJlP1wiKSkge1xuXHRcdCAgICB0aGlzLnB1cmdlKCk7XG5cdFx0ICAgIHRoaXMudXBkYXRlKCk7XG5cdFx0fVxuXHQgICAgfSk7XG4gICAgfVxuICAgIF9sb2FkICgpIHtcblx0dGhpcy5uYW1lMmxpc3QgPSB0aGlzLl9saXN0cy5nZXQoXCJhbGxcIik7XG5cdGlmICghdGhpcy5uYW1lMmxpc3Qpe1xuXHQgICAgdGhpcy5uYW1lMmxpc3QgPSB7fTtcblx0ICAgIHRoaXMuX3NhdmUoKTtcblx0fVxuICAgIH1cbiAgICBfc2F2ZSAoKSB7XG4gICAgICAgIHRoaXMuX2xpc3RzLnB1dChcImFsbFwiLCB0aGlzLm5hbWUybGlzdCk7XG4gICAgfVxuICAgIC8vXG4gICAgLy8gcmV0dXJucyB0aGUgbmFtZXMgb2YgYWxsIHRoZSBsaXN0cywgc29ydGVkXG4gICAgZ2V0TmFtZXMgKCkge1xuICAgICAgICBsZXQgbm1zID0gT2JqZWN0LmtleXModGhpcy5uYW1lMmxpc3QpO1xuXHRubXMuc29ydCgpO1xuXHRyZXR1cm4gbm1zO1xuICAgIH1cbiAgICAvLyByZXR1cm5zIHRydWUgaWZmIGEgbGlzdCBleGlzdHMgd2l0aCB0aGlzIG5hbWVcbiAgICBoYXMgKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUgaW4gdGhpcy5uYW1lMmxpc3Q7XG4gICAgfVxuICAgIC8vIElmIG5vIGxpc3Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBleGlzdHMsIHJldHVybiB0aGUgbmFtZS5cbiAgICAvLyBPdGhlcndpc2UsIHJldHVybiBhIG1vZGlmaWVkIHZlcnNpb24gb2YgbmFtZSB0aGF0IGlzIHVuaXF1ZS5cbiAgICAvLyBVbmlxdWUgbmFtZXMgYXJlIGNyZWF0ZWQgYnkgYXBwZW5kaW5nIGEgY291bnRlci5cbiAgICAvLyBFLmcuLCB1bmlxdWlmeShcImZvb1wiKSAtPiBcImZvby4xXCIgb3IgXCJmb28uMlwiIG9yIHdoYXRldmVyLlxuICAgIC8vXG4gICAgdW5pcXVpZnkgKG5hbWUpIHtcblx0aWYgKCF0aGlzLmhhcyhuYW1lKSkgXG5cdCAgICByZXR1cm4gbmFtZTtcblx0Zm9yIChsZXQgaSA9IDE7IDsgaSArPSAxKSB7XG5cdCAgICBsZXQgbm4gPSBgJHtuYW1lfS4ke2l9YDtcblx0ICAgIGlmICghdGhpcy5oYXMobm4pKVxuXHQgICAgICAgIHJldHVybiBubjtcblx0fVxuICAgIH1cbiAgICAvLyByZXR1cm5zIHRoZSBsaXN0IHdpdGggdGhpcyBuYW1lLCBvciBudWxsIGlmIG5vIHN1Y2ggbGlzdFxuICAgIGdldCAobmFtZSkge1xuICAgICAgICBsZXQgbHN0ID0gdGhpcy5uYW1lMmxpc3RbbmFtZV07XG5cdGlmICghbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuYW1lO1xuXHRyZXR1cm4gbHN0O1xuICAgIH1cbiAgICAvLyByZXR1cm5zIGFsbCB0aGUgbGlzdHMsIHNvcnRlZCBieSBuYW1lXG4gICAgZ2V0QWxsICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TmFtZXMoKS5tYXAobiA9PiB0aGlzLmdldChuKSlcbiAgICB9XG4gICAgLy8gXG4gICAgY3JlYXRlT3JVcGRhdGUgKG5hbWUsIGlkcykge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLnVwZGF0ZUxpc3QobmFtZSxudWxsLGlkcykgOiB0aGlzLmNyZWF0ZUxpc3QobmFtZSwgaWRzKTtcbiAgICB9XG4gICAgLy8gY3JlYXRlcyBhIG5ldyBsaXN0IHdpdGggdGhlIGdpdmVuIG5hbWUgYW5kIGlkcy5cbiAgICBjcmVhdGVMaXN0IChuYW1lLCBpZHMsIGZvcm11bGEpIHtcblx0aWYgKG5hbWUgIT09IFwiX1wiKVxuXHQgICAgbmFtZSA9IHRoaXMudW5pcXVpZnkobmFtZSk7XG5cdC8vXG5cdGxldCBkdCA9IG5ldyBEYXRlKCkgKyBcIlwiO1xuXHR0aGlzLm5hbWUybGlzdFtuYW1lXSA9IHtcblx0ICAgIG5hbWU6ICAgICBuYW1lLFxuXHQgICAgaWRzOiAgICAgIGlkcyxcblx0ICAgIGZvcm11bGE6ICBmb3JtdWxhIHx8IFwiXCIsXG5cdCAgICBjcmVhdGVkOiAgZHQsXG5cdCAgICBtb2RpZmllZDogZHRcblx0fTtcblx0dGhpcy5fc2F2ZSgpO1xuXHRyZXR1cm4gdGhpcy5uYW1lMmxpc3RbbmFtZV07XG4gICAgfVxuICAgIC8vIFByb3ZpZGUgYWNjZXNzIHRvIGV2YWx1YXRpb24gc2VydmljZVxuICAgIGV2YWxGb3JtdWxhIChleHByKSB7XG5cdHJldHVybiB0aGlzLmZvcm11bGFFdmFsLmV2YWwoZXhwcik7XG4gICAgfVxuICAgIC8vIFJlZnJlc2hlcyBhIGxpc3QgYW5kIHJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgcmVmcmVzaGVkIGxpc3QuXG4gICAgLy8gSWYgdGhlIGxpc3QgaWYgYSBQT0xPLCBwcm9taXNlIHJlc29sdmVzIGltbWVkaWF0ZWx5IHRvIHRoZSBsaXN0LlxuICAgIC8vIE90aGVyd2lzZSwgc3RhcnRzIGEgcmVldmFsdWF0aW9uIG9mIHRoZSBmb3JtdWxhIHRoYXQgcmVzb2x2ZXMgYWZ0ZXIgdGhlXG4gICAgLy8gbGlzdCdzIGlkcyBoYXZlIGJlZW4gdXBkYXRlZC5cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBlcnJvciwgdGhlIHJldHVybmVkIHByb21pc2UgcmVqZWN0cyB3aXRoIHRoZSBlcnJvci5cbiAgICByZWZyZXNoTGlzdCAobmFtZSkge1xuICAgICAgICBsZXQgbHN0ID0gdGhpcy5nZXQobmFtZSk7XG5cdGlmICghbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuYW1lO1xuXHRsc3QubW9kaWZpZWQgPSBcIlwiK25ldyBEYXRlKCk7XG5cdGlmICghbHN0LmZvcm11bGEpXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGxzdCk7XG5cdGVsc2Uge1xuXHQgICAgbGV0IHAgPSB0aGlzLmZvcm11YWxFdmFsLmV2YWwobHN0LmZvcm11bGEpLnRoZW4oIGlkcyA9PiB7XG5cdFx0ICAgIGxzdC5pZHMgPSBpZHM7XG5cdFx0ICAgIHJldHVybiBsc3Q7XG5cdFx0fSk7XG5cdCAgICByZXR1cm4gcDtcblx0fVxuICAgIH1cblxuICAgIC8vIHVwZGF0ZXMgdGhlIGlkcyBpbiB0aGUgZ2l2ZW4gbGlzdFxuICAgIHVwZGF0ZUxpc3QgKG5hbWUsIG5ld25hbWUsIG5ld2lkcywgbmV3Zm9ybXVsYSkge1xuXHRsZXQgbHN0ID0gdGhpcy5nZXQobmFtZSk7XG4gICAgICAgIGlmICghIGxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgbmFtZTtcblx0aWYgKG5ld25hbWUpIHtcblx0ICAgIGRlbGV0ZSB0aGlzLm5hbWUybGlzdFtsc3QubmFtZV07XG5cdCAgICBsc3QubmFtZSA9IHRoaXMudW5pcXVpZnkobmV3bmFtZSk7XG5cdCAgICB0aGlzLm5hbWUybGlzdFtsc3QubmFtZV0gPSBsc3Q7XG5cdH1cblx0aWYgKG5ld2lkcykgbHN0LmlkcyAgPSBuZXdpZHM7XG5cdGlmIChuZXdmb3JtdWxhIHx8IG5ld2Zvcm11bGE9PT1cIlwiKSBsc3QuZm9ybXVsYSA9IG5ld2Zvcm11bGE7XG5cdGxzdC5tb2RpZmllZCA9IG5ldyBEYXRlKCkgKyBcIlwiO1xuXHR0aGlzLl9zYXZlKCk7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIGRlbGV0ZXMgdGhlIHNwZWNpZmllZCBsaXN0XG4gICAgZGVsZXRlTGlzdCAobmFtZSkge1xuICAgICAgICBsZXQgbHN0ID0gdGhpcy5nZXQobmFtZSk7XG5cdGRlbGV0ZSB0aGlzLm5hbWUybGlzdFtuYW1lXTtcblx0dGhpcy5fc2F2ZSgpO1xuXHQvLyBGSVhNRTogdXNlIGV2ZW50cyEhXG5cdGlmIChsc3QgPT09IHRoaXMuYXBwLmN1cnJlbnRMaXN0KSB0aGlzLmFwcC5jdXJyZW50TGlzdCA9IG51bGw7XG5cdGlmIChsc3QgPT09IHRoaXMuYXBwLmxpc3RFZGl0b3IubGlzdCkgdGhpcy5hcHAubGlzdEVkaXRvci5saXN0ID0gbnVsbDtcblx0cmV0dXJuIGxzdDtcbiAgICB9XG4gICAgLy8gZGVsZXRlIGFsbCBsaXN0c1xuICAgIHB1cmdlICgpIHtcbiAgICAgICAgdGhpcy5uYW1lMmxpc3QgPSB7fVxuXHR0aGlzLl9zYXZlKCk7XG5cdC8vXG5cdHRoaXMuYXBwLmN1cnJlbnRMaXN0ID0gbnVsbDtcblx0dGhpcy5hcHAubGlzdEVkaXRvci5saXN0ID0gbnVsbDsgLy8gRklYTUUgLSByZWFjaGFjcm9zc1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIHRydWUgaWZmIGV4cHIgaXMgdmFsaWQsIHdoaWNoIG1lYW5zIGl0IGlzIGJvdGggc3ludGFjdGljYWxseSBjb3JyZWN0IFxuICAgIC8vIGFuZCBhbGwgbWVudGlvbmVkIGxpc3RzIGV4aXN0LlxuICAgIGlzVmFsaWQgKGV4cHIpIHtcblx0cmV0dXJuIHRoaXMuZm9ybXVsYUV2YWwuaXNWYWxpZChleHByKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyB0aGUgXCJNeSBsaXN0c1wiIGJveCB3aXRoIHRoZSBjdXJyZW50bHkgYXZhaWxhYmxlIGxpc3RzLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICBuZXdsaXN0IChMaXN0KSBvcHRpb25hbC4gSWYgc3BlY2lmaWVkLCB3ZSBqdXN0IGNyZWF0ZWQgdGhhdCBsaXN0LCBhbmQgaXRzIG5hbWUgaXNcbiAgICAvLyAgIFx0YSBnZW5lcmF0ZWQgZGVmYXVsdC4gUGxhY2UgZm9jdXMgdGhlcmUgc28gdXNlciBjYW4gdHlwZSBuZXcgbmFtZS5cbiAgICB1cGRhdGUgKG5ld2xpc3QpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgbGlzdHMgPSB0aGlzLmdldEFsbCgpO1xuXHRsZXQgYnlOYW1lID0gKGEsYikgPT4ge1xuXHQgICAgbGV0IGFuID0gYS5uYW1lLnRvTG93ZXJDYXNlKCk7XG5cdCAgICBsZXQgYm4gPSBiLm5hbWUudG9Mb3dlckNhc2UoKTtcblx0ICAgIHJldHVybiAoYW4gPCBibiA/IC0xIDogYW4gPiBibiA/ICsxIDogMCk7XG5cdH07XG5cdGxldCBieURhdGUgPSAoYSxiKSA9PiAoKG5ldyBEYXRlKGIubW9kaWZpZWQpKS5nZXRUaW1lKCkgLSAobmV3IERhdGUoYS5tb2RpZmllZCkpLmdldFRpbWUoKSk7XG5cdGxpc3RzLnNvcnQoYnlOYW1lKTtcblx0bGV0IGl0ZW1zID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJsaXN0c1wiXScpLnNlbGVjdEFsbChcIi5saXN0SW5mb1wiKVxuXHQgICAgLmRhdGEobGlzdHMpO1xuXHRsZXQgbmV3aXRlbXMgPSBpdGVtcy5lbnRlcigpLmFwcGVuZChcImRpdlwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwibGlzdEluZm8gZmxleHJvd1wiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJpXCIpLmF0dHIoXCJjbGFzc1wiLFwibWF0ZXJpYWwtaWNvbnMgYnV0dG9uXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIixcImVkaXRcIilcblx0ICAgIC50ZXh0KFwibW9kZV9lZGl0XCIpXG5cdCAgICAuYXR0cihcInRpdGxlXCIsXCJFZGl0IHRoaXMgbGlzdC5cIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwic3BhblwiKS5hdHRyKFwibmFtZVwiLFwibmFtZVwiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJzcGFuXCIpLmF0dHIoXCJuYW1lXCIsXCJzaXplXCIpO1xuXHRuZXdpdGVtcy5hcHBlbmQoXCJzcGFuXCIpLmF0dHIoXCJuYW1lXCIsXCJkYXRlXCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcImlcIikuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29ucyBidXR0b25cIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLFwiZGVsZXRlXCIpXG5cdCAgICAudGV4dChcImhpZ2hsaWdodF9vZmZcIilcblx0ICAgIC5hdHRyKFwidGl0bGVcIixcIkRlbGV0ZSB0aGlzIGxpc3QuXCIpO1xuXG5cdGlmIChuZXdpdGVtc1swXVswXSkge1xuXHQgICAgbGV0IGxhc3QgPSBuZXdpdGVtc1swXVtuZXdpdGVtc1swXS5sZW5ndGgtMV07XG5cdCAgICBsYXN0LnNjcm9sbEludG9WaWV3KCk7XG5cdH1cblxuXHRpdGVtc1xuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGxzdD0+bHN0Lm5hbWUpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAobHN0KSB7XG5cdFx0aWYgKGQzLmV2ZW50LmFsdEtleSkge1xuXHRcdCAgICBsZXQgbGUgPSBzZWxmLmFwcC5saXN0RWRpdG9yOyAvLyBGSVhNRSByZWFjaG92ZXJcblx0XHQgICAgbGV0IHMgPSBsc3QubmFtZTtcblx0XHQgICAgbGV0IHJlID0gL1sgPSgpKyotXS87XG5cdFx0ICAgIGlmIChzLnNlYXJjaChyZSkgPj0gMClcblx0XHRcdHMgPSAnXCInICsgcyArICdcIic7XG5cdFx0ICAgIGlmICghbGUuaXNFZGl0aW5nRm9ybXVsYSkge1xuXHRcdCAgICAgICAgbGUub3BlbigpO1xuXHRcdFx0bGUub3BlbkZvcm11bGFFZGl0b3IoKTtcblx0XHQgICAgfVxuXHRcdCAgICAvL1xuXHRcdCAgICBsZS5hZGRUb0xpc3RFeHByKHMrJyAnKTtcblx0XHR9XG5cdFx0Ly8gb3RoZXJ3aXNlLCBzZXQgdGhpcyBhcyB0aGUgY3VycmVudCBsaXN0XG5cdFx0ZWxzZSBcblx0XHQgICAgc2VsZi5hcHAuY3VycmVudExpc3QgPSBsc3Q7IC8vIEZJWE1FIHJlYWNob3ZlclxuXHQgICAgfSk7XG5cdGl0ZW1zLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZWRpdFwiXScpXG5cdCAgICAvLyBlZGl0OiBjbGljayBcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGxzdCkge1xuXHQgICAgICAgIHNlbGYuYXBwLmxpc3RFZGl0b3Iub3Blbihsc3QpO1xuXHQgICAgfSk7XG5cdGl0ZW1zLnNlbGVjdCgnc3BhbltuYW1lPVwibmFtZVwiXScpXG5cdCAgICAudGV4dChsc3QgPT4gbHN0Lm5hbWUpO1xuXHRpdGVtcy5zZWxlY3QoJ3NwYW5bbmFtZT1cImRhdGVcIl0nKS50ZXh0KGxzdCA9PiB7XG5cdCAgICBsZXQgbWQgPSBuZXcgRGF0ZShsc3QubW9kaWZpZWQpO1xuXHQgICAgbGV0IGQgPSBgJHttZC5nZXRGdWxsWWVhcigpfS0ke21kLmdldE1vbnRoKCkrMX0tJHttZC5nZXREYXRlKCl9IGAgXG5cdCAgICAgICAgICArIGA6JHttZC5nZXRIb3VycygpfS4ke21kLmdldE1pbnV0ZXMoKX0uJHttZC5nZXRTZWNvbmRzKCl9YDtcblx0ICAgIHJldHVybiBkO1xuXHR9KTtcblx0aXRlbXMuc2VsZWN0KCdzcGFuW25hbWU9XCJzaXplXCJdJykudGV4dChsc3QgPT4gbHN0Lmlkcy5sZW5ndGgpO1xuXHRpdGVtcy5zZWxlY3QoJy5idXR0b25bbmFtZT1cImRlbGV0ZVwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCBsc3QgPT4ge1xuXHQgICAgICAgIHRoaXMuZGVsZXRlTGlzdChsc3QubmFtZSk7XG5cdFx0dGhpcy51cGRhdGUoKTtcblxuXHRcdC8vIE5vdCBzdXJlIHdoeSB0aGlzIGlzIG5lY2Vzc2FyeSBoZXJlLiBCdXQgd2l0aG91dCBpdCwgdGhlIGxpc3QgaXRlbSBhZnRlciB0aGUgb25lIGJlaW5nXG5cdFx0Ly8gZGVsZXRlZCBoZXJlIHdpbGwgcmVjZWl2ZSBhIGNsaWNrIGV2ZW50LlxuXHRcdGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdC8vXG5cdCAgICB9KTtcblxuXHQvL1xuXHRpdGVtcy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGlmIChuZXdsaXN0KSB7XG5cdCAgICBsZXQgbHN0ZWx0ID0gXG5cdCAgICAgICAgZDMuc2VsZWN0KGAjbXlsaXN0cyBbbmFtZT1cImxpc3RzXCJdIFtuYW1lPVwiJHtuZXdsaXN0Lm5hbWV9XCJdYClbMF1bMF07XG4gICAgICAgICAgICBsc3RlbHQuc2Nyb2xsSW50b1ZpZXcoZmFsc2UpO1xuXHR9XG4gICAgfVxuXG59IC8vIGVuZCBjbGFzcyBMaXN0TWFuYWdlclxuXG5leHBvcnQgeyBMaXN0TWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdE1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IExpc3RGb3JtdWxhUGFyc2VyIH0gZnJvbSAnLi9MaXN0Rm9ybXVsYVBhcnNlcic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gS25vd3MgaG93IHRvIHBhcnNlIGFuZCBldmFsdWF0ZSBhIGxpc3QgZm9ybXVsYSAoYWthIGxpc3QgZXhwcmVzc2lvbikuXG5jbGFzcyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB7XG4gICAgY29uc3RydWN0b3IgKGxpc3RNYW5hZ2VyKSB7XG5cdHRoaXMubGlzdE1hbmFnZXIgPSBsaXN0TWFuYWdlcjtcbiAgICAgICAgdGhpcy5wYXJzZXIgPSBuZXcgTGlzdEZvcm11bGFQYXJzZXIoKTtcbiAgICB9XG4gICAgLy8gRXZhbHVhdGVzIHRoZSBleHByZXNzaW9uIGFuZCByZXR1cm5zIGEgUHJvbWlzZSBmb3IgdGhlIGxpc3Qgb2YgaWRzLlxuICAgIC8vIElmIHRoZXJlIGlzIGFuIGVycm9yLCB0aGUgcHJvbWlzZSByZWplY3RzIHdpdGggdGhlIGVycm9yIG1lc3NhZ2UuXG4gICAgZXZhbCAoZXhwcikge1xuXHQgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHQgICAgIHRyeSB7XG5cdFx0bGV0IGFzdCA9IHRoaXMucGFyc2VyLnBhcnNlKGV4cHIpO1xuXHRcdGxldCBsbSA9IHRoaXMubGlzdE1hbmFnZXI7XG5cdFx0bGV0IHJlYWNoID0gKG4pID0+IHtcblx0XHQgICAgaWYgKHR5cGVvZihuKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0bGV0IGxzdCA9IGxtLmdldChuKTtcblx0XHRcdGlmICghbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuO1xuXHRcdFx0cmV0dXJuIG5ldyBTZXQobHN0Lmlkcyk7XG5cdFx0ICAgIH1cblx0XHQgICAgZWxzZSB7XG5cdFx0XHRsZXQgbCA9IHJlYWNoKG4ubGVmdCk7XG5cdFx0XHRsZXQgciA9IHJlYWNoKG4ucmlnaHQpO1xuXHRcdFx0cmV0dXJuIGxbbi5vcF0ocik7XG5cdFx0ICAgIH1cblx0XHR9XG5cdFx0bGV0IGlkcyA9IHJlYWNoKGFzdCk7XG5cdFx0cmVzb2x2ZShBcnJheS5mcm9tKGlkcykpO1xuXHQgICAgfVxuXHQgICAgY2F0Y2ggKGUpIHtcblx0XHRyZWplY3QoZSk7XG5cdCAgICB9XG5cdCB9LmJpbmQodGhpcykpO1xuICAgIH1cbiAgICAvLyBDaGVja3MgdGhlIGN1cnJlbnQgZXhwcmVzc2lvbiBmb3Igc3ludGFjdGljIGFuZCBzZW1hbnRpYyB2YWxpZGl0eSBhbmQgc2V0cyB0aGUgXG4gICAgLy8gdmFsaWQvaW52YWxpZCBjbGFzcyBhY2NvcmRpbmdseS4gU2VtYW50aWMgdmFsaWRpdHkgc2ltcGx5IG1lYW5zIGFsbCBuYW1lcyBpbiB0aGVcbiAgICAvLyBleHByZXNzaW9uIGFyZSBib3VuZC5cbiAgICAvL1xuICAgIGlzVmFsaWQgIChleHByKSB7XG5cdHRyeSB7XG5cdCAgICAvLyBmaXJzdCBjaGVjayBzeW50YXhcblx0ICAgIGxldCBhc3QgPSB0aGlzLnBhcnNlci5wYXJzZShleHByKTtcblx0ICAgIGxldCBsbSAgPSB0aGlzLmxpc3RNYW5hZ2VyOyBcblx0ICAgIC8vIG5vdyBjaGVjayBsaXN0IG5hbWVzXG5cdCAgICAoZnVuY3Rpb24gcmVhY2gobikge1xuXHRcdGlmICh0eXBlb2YobikgPT09IFwic3RyaW5nXCIpIHtcblx0XHQgICAgbGV0IGxzdCA9IGxtLmdldChuKTtcblx0XHQgICAgaWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIHJlYWNoKG4ubGVmdCk7XG5cdFx0ICAgIHJlYWNoKG4ucmlnaHQpO1xuXHRcdH1cblx0ICAgIH0pKGFzdCk7XG5cblx0ICAgIC8vIFRodW1icyB1cCFcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9XG5cdGNhdGNoIChlKSB7XG5cdCAgICAvLyBzeW50YXggZXJyb3Igb3IgdW5rbm93biBsaXN0IG5hbWVcblx0ICAgIHJldHVybiBmYWxzZTtcblx0fVxuICAgIH1cbn1cblxuZXhwb3J0IHsgTGlzdEZvcm11bGFFdmFsdWF0b3IgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0xpc3RGb3JtdWxhRXZhbHVhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBzZXRDYXJldFBvc2l0aW9uLCBtb3ZlQ2FyZXRQb3NpdGlvbiwgZ2V0Q2FyZXRSYW5nZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfSBmcm9tICcuL0xpc3RGb3JtdWxhUGFyc2VyJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBMaXN0RWRpdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcblx0c3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLnBhcnNlciA9IG5ldyBMaXN0Rm9ybXVsYVBhcnNlcigpO1xuXHR0aGlzLmZvcm0gPSBudWxsO1xuXHR0aGlzLmluaXREb20oKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gZmFsc2U7XG5cdC8vXG5cdHRoaXMubGlzdCA9IG51bGw7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdHRoaXMuZm9ybSA9IHRoaXMucm9vdC5zZWxlY3QoXCJmb3JtXCIpWzBdWzBdO1xuXHRpZiAoIXRoaXMuZm9ybSkgdGhyb3cgXCJDb3VsZCBub3QgaW5pdCBMaXN0RWRpdG9yLiBObyBmb3JtIGVsZW1lbnQuXCI7XG5cdGQzLnNlbGVjdCh0aGlzLmZvcm0pXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IHQgPSBkMy5ldmVudC50YXJnZXQ7XG5cdFx0aWYgKFwiYnV0dG9uXCIgPT09IHQudGFnTmFtZS50b0xvd2VyQ2FzZSgpKXtcblx0XHQgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQgICAgbGV0IGYgPSB0aGlzLmZvcm07XG5cdFx0ICAgIGxldCBzID0gZi5pZHMudmFsdWUucmVwbGFjZSgvWyx8XS9nLCAnICcpLnRyaW0oKTtcblx0XHQgICAgbGV0IGlkcyA9IHMgPyBzLnNwbGl0KC9cXHMrLykgOiBbXTtcblx0XHQgICAgLy8gc2F2ZSBsaXN0XG5cdFx0ICAgIGlmICh0Lm5hbWUgPT09IFwic2F2ZVwiKSB7XG5cdFx0XHRpZiAoIXRoaXMubGlzdCkgcmV0dXJuO1xuXHRcdFx0dGhpcy5saXN0ID0gdGhpcy5hcHAubGlzdE1hbmFnZXIudXBkYXRlTGlzdCh0aGlzLmxpc3QubmFtZSwgZi5uYW1lLnZhbHVlLCBpZHMsIGYuZm9ybXVsYS52YWx1ZSk7XG5cdFx0XHR0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGUodGhpcy5saXN0KTtcblx0XHQgICAgfVxuXHRcdCAgICAvLyBjcmVhdGUgbmV3IGxpc3Rcblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcIm5ld1wiKSB7XG5cdFx0XHRsZXQgbiA9IGYubmFtZS52YWx1ZS50cmltKCk7XG5cdFx0XHRpZiAoIW4pIHtcblx0XHRcdCAgIGFsZXJ0KFwiWW91ciBsaXN0IGhhcyBubyBuYW1lIGFuZCBpcyB2ZXJ5IHNhZC4gUGxlYXNlIGdpdmUgaXQgYSBuYW1lIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdFx0ICAgcmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChuLmluZGV4T2YoJ1wiJykgPj0gMCkge1xuXHRcdFx0ICAgYWxlcnQoXCJPaCBkZWFyLCB5b3VyIGxpc3QncyBuYW1lIGhhcyBhIGRvdWJsZSBxdW90ZSBjaGFyYWN0ZXIsIGFuZCBJJ20gYWZhcmFpZCB0aGF0J3Mgbm90IGFsbG93ZWQuIFBsZWFzZSByZW1vdmUgdGhlICdcXFwiJyBhbmQgdHJ5IGFnYWluLlwiKTtcblx0XHRcdCAgIHJldHVyblxuXHRcdFx0fVxuXHRcdCAgICAgICAgdGhpcy5saXN0ID0gdGhpcy5hcHAubGlzdE1hbmFnZXIuY3JlYXRlTGlzdChuLCBpZHMsIGYuZm9ybXVsYS52YWx1ZSk7XG5cdFx0XHR0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGUodGhpcy5saXN0KTtcblx0XHQgICAgfVxuXHRcdCAgICAvLyBjbGVhciBmb3JtXG5cdFx0ICAgIGVsc2UgaWYgKHQubmFtZSA9PT0gXCJjbGVhclwiKSB7XG5cdFx0ICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGZvcndhcmQgdG8gTUdJXG5cdFx0ICAgIGVsc2UgaWYgKHQubmFtZSA9PT0gXCJ0b01naVwiKSB7XG5cdFx0ICAgICAgICBsZXQgZnJtID0gZDMuc2VsZWN0KCcjbWdpYmF0Y2hmb3JtJylbMF1bMF07XG5cdFx0XHRmcm0uaWRzLnZhbHVlID0gaWRzLmpvaW4oXCIgXCIpO1xuXHRcdFx0ZnJtLnN1Ym1pdCgpXG5cdFx0ICAgIH1cblx0XHQgICAgLy8gZm9yd2FyZCB0byBNb3VzZU1pbmVcblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcInRvTW91c2VNaW5lXCIpIHtcblx0XHQgICAgICAgIGxldCBmcm0gPSBkMy5zZWxlY3QoJyNtb3VzZW1pbmVmb3JtJylbMF1bMF07XG5cdFx0XHRmcm0uZXh0ZXJuYWxpZHMudmFsdWUgPSBpZHMuam9pbihcIixcIik7XG5cdFx0XHRmcm0uc3VibWl0KClcblx0XHQgICAgfVxuXHRcdH1cblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbjogc2hvdy9oaWRlIGZvcm11bGEgZWRpdG9yXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiaWRzZWN0aW9uXCJdIC5idXR0b25bbmFtZT1cImVkaXRmb3JtdWxhXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlRm9ybXVsYUVkaXRvcigpKTtcblx0ICAgIFxuXHQvLyBJbnB1dCBib3g6IGZvcm11bGE6IHZhbGlkYXRlIG9uIGFueSBpbnB1dFxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gW25hbWU9XCJmb3JtdWxhXCJdJylcblx0ICAgIC5vbihcImlucHV0XCIsICgpID0+IHtcblx0ICAgICAgICB0aGlzLnZhbGlkYXRlRXhwcigpO1xuXHQgICAgfSk7XG5cblx0Ly8gRm9yd2FyZCAtPiBNR0kvTW91c2VNaW5lOiBkaXNhYmxlIGJ1dHRvbnMgaWYgbm8gaWRzXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiaWRzXCJdJylcblx0ICAgIC5vbihcImlucHV0XCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgZW1wdHkgPSB0aGlzLmZvcm0uaWRzLnZhbHVlLnRyaW0oKS5sZW5ndGggPT09IDA7XG5cdFx0dGhpcy5mb3JtLnRvTWdpLmRpc2FibGVkID0gdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkID0gZW1wdHk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b25zOiB0aGUgbGlzdCBvcGVyYXRvciBidXR0b25zICh1bmlvbiwgaW50ZXJzZWN0aW9uLCBldGMuKVxuXHR0aGlzLnJvb3Quc2VsZWN0QWxsKCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gLmJ1dHRvbi5saXN0b3AnKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdC8vIGFkZCBteSBzeW1ib2wgdG8gdGhlIGZvcm11bGFcblx0XHRsZXQgaW5lbHQgPSBzZWxmLmZvcm0uZm9ybXVsYTtcblx0XHRsZXQgb3AgPSBkMy5zZWxlY3QodGhpcykuYXR0cihcIm5hbWVcIik7XG5cdFx0c2VsZi5hZGRUb0xpc3RFeHByKG9wKTtcblx0XHRzZWxmLnZhbGlkYXRlRXhwcigpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiByZWZyZXNoIGJ1dHRvbiBmb3IgcnVubmluZyB0aGUgZm9ybXVsYVxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gLmJ1dHRvbltuYW1lPVwicmVmcmVzaFwiXScpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0bGV0IGVtZXNzYWdlPVwiSSdtIHRlcnJpYmx5IHNvcnJ5LCBidXQgdGhlcmUgYXBwZWFycyB0byBiZSBhIHByb2JsZW0gd2l0aCB5b3VyIGxpc3QgZXhwcmVzc2lvbjogXCI7XG5cdFx0bGV0IGZvcm11bGEgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZS50cmltKCk7XG5cdFx0aWYgKGZvcm11bGEubGVuZ3RoID09PSAwKVxuXHRcdCAgICByZXR1cm47XG5cdCAgICAgICAgdGhpcy5hcHAubGlzdE1hbmFnZXJcblx0XHQgICAgLmV2YWxGb3JtdWxhKGZvcm11bGEpXG5cdFx0ICAgIC50aGVuKGlkcyA9PiB7XG5cdFx0ICAgICAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gaWRzLmpvaW4oXCJcXG5cIik7XG5cdFx0ICAgICB9KVxuXHRcdCAgICAuY2F0Y2goZSA9PiBhbGVydChlbWVzc2FnZSArIGUpKTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbjogY2xvc2UgZm9ybXVsYSBlZGl0b3Jcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIC5idXR0b25bbmFtZT1cImNsb3NlXCJdJylcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsICgpID0+IHRoaXMuY2xvc2VGb3JtdWxhRWRpdG9yKCkgKTtcblx0XG5cdC8vIENsaWNraW5nIHRoZSBib3ggY29sbGFwc2UgYnV0dG9uIHNob3VsZCBjbGVhciB0aGUgZm9ybVxuXHR0aGlzLnJvb3Quc2VsZWN0KFwiLmJ1dHRvbi5jbG9zZVwiKVxuXHQgICAgLm9uKFwiY2xpY2suZXh0cmFcIiwgKCkgPT4ge1xuXHQgICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG5cdFx0dGhpcy5jbG9zZUZvcm11bGFFZGl0b3IoKTtcblx0ICAgIH0pO1xuICAgIH1cbiAgICBwYXJzZUlkcyAocykge1xuXHRyZXR1cm4gcy5yZXBsYWNlKC9bLHxdL2csICcgJykudHJpbSgpLnNwbGl0KC9cXHMrLyk7XG4gICAgfVxuICAgIGdldCBsaXN0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3Q7XG4gICAgfVxuICAgIHNldCBsaXN0IChsc3QpIHtcbiAgICAgICAgdGhpcy5fbGlzdCA9IGxzdDtcblx0dGhpcy5fc3luY0Rpc3BsYXkoKTtcbiAgICB9XG4gICAgX3N5bmNEaXNwbGF5ICgpIHtcblx0bGV0IGxzdCA9IHRoaXMuX2xpc3Q7XG5cdGlmICghbHN0KSB7XG5cdCAgICB0aGlzLmZvcm0ubmFtZS52YWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5mb3JtLmlkcy52YWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IGZhbHNlO1xuXHQgICAgdGhpcy5mb3JtLm1vZGlmaWVkLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5mb3JtLnNhdmUuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5mb3JtLnRvTWdpLmRpc2FibGVkID0gdHJ1ZTtcblx0ICAgIHRoaXMuZm9ybS50b01vdXNlTWluZS5kaXNhYmxlZCA9IHRydWU7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICB0aGlzLmZvcm0ubmFtZS52YWx1ZSA9IGxzdC5uYW1lO1xuXHQgICAgdGhpcy5mb3JtLmlkcy52YWx1ZSA9IGxzdC5pZHMuam9pbignXFxuJyk7XG5cdCAgICB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZSA9IGxzdC5mb3JtdWxhIHx8IFwiXCI7XG5cdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gdGhpcy5mb3JtLmZvcm11bGEudmFsdWUudHJpbSgpLmxlbmd0aCA+IDA7XG5cdCAgICB0aGlzLmZvcm0ubW9kaWZpZWQudmFsdWUgPSBsc3QubW9kaWZpZWQ7XG5cdCAgICB0aGlzLmZvcm0uc2F2ZS5kaXNhYmxlZCA9IGZhbHNlO1xuXHQgICAgdGhpcy5mb3JtLnRvTWdpLmRpc2FibGVkIFxuXHQgICAgICA9IHRoaXMuZm9ybS50b01vdXNlTWluZS5kaXNhYmxlZCBcblx0ICAgICAgICA9ICh0aGlzLmZvcm0uaWRzLnZhbHVlLnRyaW0oKS5sZW5ndGggPT09IDApO1xuXHR9XG5cdHRoaXMudmFsaWRhdGVFeHByKCk7XG4gICAgfVxuICAgIGNsZWFyICgpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcbiAgICB9XG4gICAgb3BlbiAobHN0KSB7XG4gICAgICAgIHRoaXMubGlzdCA9IGxzdDtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIiwgZmFsc2UpO1xuICAgIH1cbiAgICBjbG9zZSAoKSB7XG4gICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG5cdHRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIsIHRydWUpO1xuICAgIH1cbiAgICBvcGVuRm9ybXVsYUVkaXRvciAoKSB7XG5cdHRoaXMucm9vdC5jbGFzc2VkKFwiZWRpdGluZ2Zvcm11bGFcIiwgdHJ1ZSk7XG5cdHRoaXMuaXNFZGl0aW5nRm9ybXVsYSA9IHRydWU7XG5cdGxldCBmID0gdGhpcy5mb3JtLmZvcm11bGEudmFsdWU7XG5cdHRoaXMuZm9ybS5mb3JtdWxhLmZvY3VzKCk7XG5cdHNldENhcmV0UG9zaXRpb24odGhpcy5mb3JtLmZvcm11bGEsIGYubGVuZ3RoKTtcbiAgICB9XG4gICAgY2xvc2VGb3JtdWxhRWRpdG9yICgpIHtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJlZGl0aW5nZm9ybXVsYVwiLCBmYWxzZSk7XG5cdHRoaXMuaXNFZGl0aW5nRm9ybXVsYSA9IGZhbHNlO1xuICAgIH1cbiAgICB0b2dnbGVGb3JtdWxhRWRpdG9yICgpIHtcblx0bGV0IHNob3dpbmcgPSB0aGlzLnJvb3QuY2xhc3NlZChcImVkaXRpbmdmb3JtdWxhXCIpO1xuXHRzaG93aW5nID8gdGhpcy5jbG9zZUZvcm11bGFFZGl0b3IoKSA6IHRoaXMub3BlbkZvcm11bGFFZGl0b3IoKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ2hlY2tzIHRoZSBjdXJyZW50IGV4cHJlc3Npb24gYW5kIHNldHMgdGhlIHZhbGlkL2ludmFsaWQgY2xhc3MuXG4gICAgdmFsaWRhdGVFeHByICAoKSB7XG5cdGxldCBpbnAgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gW25hbWU9XCJmb3JtdWxhXCJdJyk7XG5cdGxldCBleHByID0gaW5wWzBdWzBdLnZhbHVlLnRyaW0oKTtcblx0aWYgKCFleHByKSB7XG5cdCAgICBpbnAuY2xhc3NlZChcInZhbGlkXCIsZmFsc2UpLmNsYXNzZWQoXCJpbnZhbGlkXCIsZmFsc2UpO1xuIFx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSBmYWxzZTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIGxldCBpc1ZhbGlkID0gdGhpcy5hcHAubGlzdE1hbmFnZXIuaXNWYWxpZChleHByKTsgLy8gRklYTUUgLSByZWFjaG92ZXJcblx0ICAgIGlucC5jbGFzc2VkKFwidmFsaWRcIiwgaXNWYWxpZCkuY2xhc3NlZChcImludmFsaWRcIiwgIWlzVmFsaWQpO1xuIFx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSB0cnVlO1xuXHR9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGFkZFRvTGlzdEV4cHIgKHRleHQpIHtcblx0bGV0IGlucCA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKTtcblx0bGV0IGllbHQgPSBpbnBbMF1bMF07XG5cdGxldCB2ID0gaWVsdC52YWx1ZTtcblx0bGV0IHNwbGljZSA9IGZ1bmN0aW9uIChlLHQpe1xuXHQgICAgbGV0IHYgPSBlLnZhbHVlO1xuXHQgICAgbGV0IHIgPSBnZXRDYXJldFJhbmdlKGUpO1xuXHQgICAgZS52YWx1ZSA9IHYuc2xpY2UoMCxyWzBdKSArIHQgKyB2LnNsaWNlKHJbMV0pO1xuXHQgICAgc2V0Q2FyZXRQb3NpdGlvbihlLCByWzBdK3QubGVuZ3RoKTtcblx0ICAgIGUuZm9jdXMoKTtcblx0fVxuXHRsZXQgcmFuZ2UgPSBnZXRDYXJldFJhbmdlKGllbHQpO1xuXHRpZiAocmFuZ2VbMF0gPT09IHJhbmdlWzFdKSB7XG5cdCAgICAvLyBubyBjdXJyZW50IHNlbGVjdGlvblxuXHQgICAgc3BsaWNlKGllbHQsIHRleHQpO1xuXHQgICAgaWYgKHRleHQgPT09IFwiKClcIikgXG5cdFx0bW92ZUNhcmV0UG9zaXRpb24oaWVsdCwgLTEpO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgLy8gdGhlcmUgaXMgYSBjdXJyZW50IHNlbGVjdGlvblxuXHQgICAgaWYgKHRleHQgPT09IFwiKClcIilcblx0XHQvLyBzdXJyb3VuZCBjdXJyZW50IHNlbGVjdGlvbiB3aXRoIHBhcmVucywgdGhlbiBtb3ZlIGNhcmV0IGFmdGVyXG5cdFx0dGV4dCA9ICcoJyArIHYuc2xpY2UocmFuZ2VbMF0scmFuZ2VbMV0pICsgJyknO1xuXHQgICAgc3BsaWNlKGllbHQsIHRleHQpXG5cdH1cblx0dGhpcy52YWxpZGF0ZUV4cHIoKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBMaXN0RWRpdG9yXG5cbmV4cG9ydCB7IExpc3RFZGl0b3IgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0xpc3RFZGl0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IExvY2FsU3RvcmFnZU1hbmFnZXIgfSBmcm9tICcuL1N0b3JhZ2VNYW5hZ2VyJztcblxuY29uc3QgTUdSX05BTUUgPSBcInByZWZzTWFuYWdlclwiO1xuY29uc3QgSVRFTV9OQU1FPSBcInVzZXJQcmVmc1wiO1xuXG5jbGFzcyBVc2VyUHJlZnNNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IG5ldyBMb2NhbFN0b3JhZ2VNYW5hZ2VyKE1HUl9OQU1FKTtcblx0dGhpcy5kYXRhID0gbnVsbDtcblx0dGhpcy5fbG9hZCgpO1xuICAgIH1cbiAgICBfbG9hZCAoKSB7XG5cdHRoaXMuZGF0YSA9IHRoaXMuc3RvcmFnZS5nZXQoSVRFTV9OQU1FKTtcblx0aWYgKCF0aGlzLmRhdGEpe1xuXHQgICAgdGhpcy5kYXRhID0ge307XG5cdCAgICB0aGlzLl9zYXZlKCk7XG5cdH1cbiAgICB9XG4gICAgX3NhdmUgKCkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UucHV0KElURU1fTkFNRSwgdGhpcy5kYXRhKTtcbiAgICB9XG4gICAgaGFzIChuKSB7XG4gICAgfVxuICAgIGdldCAobikge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhW25dO1xuICAgIH1cbiAgICBnZXRBbGwgKCkge1xuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kYXRhKVxuICAgIH1cbiAgICBzZXQgKG4sIHYpIHtcbiAgICAgICAgdGhpcy5kYXRhW25dID0gdjtcblx0dGhpcy5fc2F2ZSgpO1xuICAgIH1cbiAgICBzZXRBbGwgKHYpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmRhdGEsIHYpO1xuXHR0aGlzLl9zYXZlKCk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBVc2VyUHJlZnNNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9Vc2VyUHJlZnNNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBGYWNldCB9IGZyb20gJy4vRmFjZXQnO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIEZhY2V0TWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKGFwcCkge1xuXHR0aGlzLmFwcCA9IGFwcDtcblx0dGhpcy5mYWNldHMgPSBbXTtcblx0dGhpcy5uYW1lMmZhY2V0ID0ge31cbiAgICB9XG4gICAgYWRkRmFjZXQgKG5hbWUsIHZhbHVlRmNuKSB7XG5cdGlmICh0aGlzLm5hbWUyZmFjZXRbbmFtZV0pIHRocm93IFwiRHVwbGljYXRlIGZhY2V0IG5hbWUuIFwiICsgbmFtZTtcblx0bGV0IGZhY2V0ID0gbmV3IEZhY2V0KG5hbWUsIHRoaXMsIHZhbHVlRmNuKTtcbiAgICAgICAgdGhpcy5mYWNldHMucHVzaCggZmFjZXQgKTtcblx0dGhpcy5uYW1lMmZhY2V0W25hbWVdID0gZmFjZXQ7XG5cdHJldHVybiBmYWNldFxuICAgIH1cbiAgICB0ZXN0IChmKSB7XG4gICAgICAgIGxldCB2YWxzID0gdGhpcy5mYWNldHMubWFwKCBmYWNldCA9PiBmYWNldC50ZXN0KGYpICk7XG5cdHJldHVybiB2YWxzLnJlZHVjZSgoYWNjdW0sIHZhbCkgPT4gYWNjdW0gJiYgdmFsLCB0cnVlKTtcbiAgICB9XG4gICAgYXBwbHlBbGwgKCkge1xuXHRsZXQgc2hvdyA9IG51bGw7XG5cdGxldCBoaWRlID0gXCJub25lXCI7XG5cdC8vIEZJWE1FOiBtYWpvciByZWFjaG92ZXJcblx0dGhpcy5hcHAuem9vbVZpZXcuc3ZnTWFpbi5zZWxlY3QoXCJnLnN0cmlwc1wiKS5zZWxlY3RBbGwoJ3JlY3QuZmVhdHVyZScpXG5cdCAgICAuc3R5bGUoXCJkaXNwbGF5XCIsIGYgPT4gdGhpcy50ZXN0KGYpID8gc2hvdyA6IGhpZGUpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEZhY2V0TWFuYWdlclxuXG5leHBvcnQgeyBGYWNldE1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZhY2V0TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBGYWNldCB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUsIG1hbmFnZXIsIHZhbHVlRmNuKSB7XG5cdHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cdHRoaXMudmFsdWVzID0gW107XG5cdHRoaXMudmFsdWVGY24gPSB2YWx1ZUZjbjtcbiAgICB9XG4gICAgc2V0VmFsdWVzICh2YWx1ZXMsIHF1aWV0bHkpIHtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG5cdGlmICghIHF1aWV0bHkpIHtcblx0ICAgIHRoaXMubWFuYWdlci5hcHBseUFsbCgpO1xuXHQgICAgdGhpcy5tYW5hZ2VyLmFwcC56b29tVmlldy5oaWdobGlnaHQoKTtcblx0fVxuICAgIH1cbiAgICB0ZXN0IChmKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy52YWx1ZXMgfHwgdGhpcy52YWx1ZXMubGVuZ3RoID09PSAwIHx8IHRoaXMudmFsdWVzLmluZGV4T2YoIHRoaXMudmFsdWVGY24oZikgKSA+PSAwO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEZhY2V0XG5cbmV4cG9ydCB7IEZhY2V0IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GYWNldC5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgZDN0c3YgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEJsb2NrVHJhbnNsYXRvciB9IGZyb20gJy4vQmxvY2tUcmFuc2xhdG9yJztcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBCbG9ja1RyYW5zbGF0b3IgbWFuYWdlciBjbGFzcy4gRm9yIGFueSBnaXZlbiBwYWlyIG9mIGdlbm9tZXMsIEEgYW5kIEIsIGxvYWRzIHRoZSBzaW5nbGUgYmxvY2sgZmlsZVxuLy8gZm9yIHRyYW5zbGF0aW5nIGJldHdlZW4gdGhlbSwgYW5kIGluZGV4ZXMgaXQgXCJmcm9tIGJvdGggZGlyZWN0aW9uc1wiOlxuLy8gXHRBLT5CLT4gW0FCX0Jsb2NrRmlsZV0gPC1BPC1CXG4vL1xuY2xhc3MgQlRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuXHR0aGlzLnJjQmxvY2tzID0ge307XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVnaXN0ZXJCbG9ja3MgKHVybCwgYUdlbm9tZSwgYkdlbm9tZSwgYmxvY2tzKSB7XG5cdGNvbnNvbGUubG9nKFwiUmVnaXN0ZXJpbmcgYmxvY2tzIGZyb206IFwiICsgdXJsLCBibG9ja3MpO1xuXHRsZXQgYW5hbWUgPSBhR2Vub21lLm5hbWU7XG5cdGxldCBibmFtZSA9IGJHZW5vbWUubmFtZTtcblx0bGV0IGJsa0ZpbGUgPSBuZXcgQmxvY2tUcmFuc2xhdG9yKHVybCxhR2Vub21lLGJHZW5vbWUsYmxvY2tzKTtcblx0aWYoICEgdGhpcy5yY0Jsb2Nrc1thbmFtZV0pIHRoaXMucmNCbG9ja3NbYW5hbWVdID0ge307XG5cdGlmKCAhIHRoaXMucmNCbG9ja3NbYm5hbWVdKSB0aGlzLnJjQmxvY2tzW2JuYW1lXSA9IHt9O1xuXHR0aGlzLnJjQmxvY2tzW2FuYW1lXVtibmFtZV0gPSBibGtGaWxlO1xuXHR0aGlzLnJjQmxvY2tzW2JuYW1lXVthbmFtZV0gPSBibGtGaWxlO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIExvYWRzIHRoZSBzeW50ZW55IGJsb2NrIGZpbGUgZm9yIGdlbm9tZXMgYUdlbm9tZSBhbmQgYkdlbm9tZS5cbiAgICAvLyBcbiAgICBnZXRCbG9ja0ZpbGUgKGFHZW5vbWUsIGJHZW5vbWUpIHtcblx0Ly8gQmUgYSBsaXR0bGUgc21hcnQgYWJvdXQgdGhlIG9yZGVyIHdlIHRyeSB0aGUgbmFtZXMuLi5cblx0aWYgKGJHZW5vbWUubmFtZSA8IGFHZW5vbWUubmFtZSkge1xuXHQgICAgbGV0IHRtcCA9IGFHZW5vbWU7IGFHZW5vbWUgPSBiR2Vub21lOyBiR2Vub21lID0gdG1wO1xuXHR9XG5cdC8vIEZpcnN0LCBzZWUgaWYgd2UgYWxyZWFkeSBoYXZlIHRoaXMgcGFpclxuXHRsZXQgYW5hbWUgPSBhR2Vub21lLm5hbWU7XG5cdGxldCBibmFtZSA9IGJHZW5vbWUubmFtZTtcblx0bGV0IGJmID0gKHRoaXMucmNCbG9ja3NbYW5hbWVdIHx8IHt9KVtibmFtZV07XG5cdGlmIChiZilcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoYmYpO1xuXHRcblx0Ly8gRm9yIGFueSBnaXZlbiBnZW5vbWUgcGFpciwgb25seSBvbmUgb2YgdGhlIGZvbGxvd2luZyB0d28gZmlsZXNcblx0Ly8gaXMgZ2VuZXJhdGVkIGJ5IHRoZSBiYWNrIGVuZFxuXHRsZXQgZm4xID0gYC4vZGF0YS9ibG9ja2ZpbGVzLyR7YUdlbm9tZS5uYW1lfS0ke2JHZW5vbWUubmFtZX0udHN2YFxuXHRsZXQgZm4yID0gYC4vZGF0YS9ibG9ja2ZpbGVzLyR7Ykdlbm9tZS5uYW1lfS0ke2FHZW5vbWUubmFtZX0udHN2YFxuXHQvLyBUaGUgZmlsZSBmb3IgQS0+QiBpcyBzaW1wbHkgYSByZS1zb3J0IG9mIHRoZSBmaWxlIGZyb20gQi0+QS4gU28gdGhlIFxuXHQvLyBiYWNrIGVuZCBvbmx5IGNyZWF0ZXMgb25lIG9mIHRoZW0uXG5cdC8vIFdlJ2xsIHRyeSBvbmUgYW5kIGlmIHRoYXQncyBub3QgaXQsIHRoZW4gdHJ5IHRoZSBvdGhlci5cblx0Ly8gKEFuZCBpZiBUSEFUJ3Mgbm90IGl0LCB0aGVuIGNyeSBhIHJpdmVyLi4uKVxuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdHJldHVybiBkM3RzdihmbjEpXG5cdCAgLnRoZW4oZnVuY3Rpb24oYmxvY2tzKXtcblx0ICAgICAgLy8geXVwLCBpdCB3YXMgQS1CXG5cdCAgICAgIHNlbGYucmVnaXN0ZXJCbG9ja3MoZm4xLCBhR2Vub21lLCBiR2Vub21lLCBibG9ja3MpO1xuXHQgICAgICByZXR1cm4gYmxvY2tzXG5cdCAgfSlcblx0ICAuY2F0Y2goZnVuY3Rpb24oZSl7XG5cdCAgICAgIGNvbnNvbGUubG9nKGBJTkZPOiBEaXNyZWdhcmQgdGhhdCA0MDQgbWVzc2FnZSEgJHtmbjF9IHdhcyBub3QgZm91bmQuIFRyeWluZyAke2ZuMn0uYCk7XG5cdCAgICAgIHJldHVybiBkM3RzdihmbjIpXG5cdFx0ICAudGhlbihmdW5jdGlvbihibG9ja3Mpe1xuXHRcdCAgICAgIC8vIG5vcGUsIGl0IHdhcyBCLUFcblx0XHQgICAgICBzZWxmLnJlZ2lzdGVyQmxvY2tzKGZuMiwgYkdlbm9tZSwgYUdlbm9tZSwgYmxvY2tzKTtcblx0XHQgICAgICByZXR1cm4gYmxvY2tzXG5cdFx0ICB9KVxuXHRcdCAgLmNhdGNoKGZ1bmN0aW9uKGUpe1xuXHRcdCAgICAgIGNvbnNvbGUubG9nKCdCdXQgVEhBVCA0MDQgbWVzc2FnZSBpcyBhIHByb2JsZW0uJyk7XG5cdFx0ICAgICAgdGhyb3cgYENhbm5vdCBnZXQgYmxvY2sgZmlsZSBmb3IgdGhpcyBnZW5vbWUgcGFpcjogJHthR2Vub21lLm5hbWV9ICR7Ykdlbm9tZS5uYW1lfS5cXG4oRXJyb3I9JHtlfSlgO1xuXHRcdCAgfSk7XG5cdCAgfSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiB0aGUgdHJhbnNsYXRvciBoYXMgbG9hZGVkIGFsbCB0aGUgZGF0YSBuZWVkZWRcbiAgICAvLyBmb3IgdHJhbnNsYXRpbmcgY29vcmRpbmF0ZXMgYmV0d2VlbiB0aGUgY3VycmVudCByZWYgc3RyYWluIGFuZCB0aGUgY3VycmVudCBjb21wYXJpc29uIHN0cmFpbnMuXG4gICAgLy9cbiAgICByZWFkeSAoKSB7XG5cdGxldCBwcm9taXNlcyA9IHRoaXMuYXBwLmNHZW5vbWVzLm1hcChjZyA9PiB0aGlzLmdldEJsb2NrRmlsZSh0aGlzLmFwcC5yR2Vub21lLCBjZykpO1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgc3ludGVueSBibG9jayB0cmFuc2xhdG9yIHRoYXQgbWFwcyB0aGUgY3VycmVudCByZWYgZ2Vub21lIHRvIHRoZSBzcGVjaWZpZWQgY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy9cbiAgICBnZXRCbG9ja3MgKGZyb21HZW5vbWUsIHRvR2Vub21lKSB7XG4gICAgICAgIGxldCBibGtUcmFucyA9IHRoaXMucmNCbG9ja3NbZnJvbUdlbm9tZS5uYW1lXVt0b0dlbm9tZS5uYW1lXTtcblx0cmV0dXJuIGJsa1RyYW5zLmdldEJsb2Nrcyhmcm9tR2Vub21lKVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFRyYW5zbGF0ZXMgdGhlIGdpdmVuIGNvb3JkaW5hdGUgcmFuZ2UgZnJvbSB0aGUgc3BlY2lmaWVkIGZyb21HZW5vbWUgdG8gdGhlIHNwZWNpZmllZCB0b0dlbm9tZS5cbiAgICAvLyBSZXR1cm5zIGEgbGlzdCBvZiB6ZXJvIG9yIG1vcmUgY29vcmRpbmF0ZSByYW5nZXMgaW4gdGhlIHRvR2Vub21lLlxuICAgIC8vXG4gICAgdHJhbnNsYXRlIChmcm9tR2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQsIHRvR2Vub21lLCBpbnZlcnRlZCkge1xuXHQvLyBnZXQgdGhlIHJpZ2h0IGJsb2NrIGZpbGVcblx0bGV0IGJsa1RyYW5zID0gdGhpcy5yY0Jsb2Nrc1tmcm9tR2Vub21lLm5hbWVdW3RvR2Vub21lLm5hbWVdO1xuXHRpZiAoIWJsa1RyYW5zKSB0aHJvdyBcIkludGVybmFsIGVycm9yLiBObyBibG9jayBmaWxlIGZvdW5kIGluIGluZGV4LlwiXG5cdC8vIHRyYW5zbGF0ZSFcblx0bGV0IHJhbmdlcyA9IGJsa1RyYW5zLnRyYW5zbGF0ZShmcm9tR2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQsIGludmVydGVkKTtcblx0cmV0dXJuIHJhbmdlcztcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBCVE1hbmFnZXJcblxuZXhwb3J0IHsgQlRNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9CVE1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU29tZXRoaW5nIHRoYXQga25vd3MgaG93IHRvIHRyYW5zbGF0ZSBjb29yZGluYXRlcyBiZXR3ZWVuIHR3byBnZW5vbWVzLlxuLy9cbi8vXG5jbGFzcyBCbG9ja1RyYW5zbGF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKHVybCwgYUdlbm9tZSwgYkdlbm9tZSwgYmxvY2tzKXtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG5cdHRoaXMuYUdlbm9tZSA9IGFHZW5vbWU7XG5cdHRoaXMuYkdlbm9tZSA9IGJHZW5vbWU7XG5cdHRoaXMuYmxvY2tzID0gYmxvY2tzLm1hcChiID0+IHRoaXMucHJvY2Vzc0Jsb2NrKGIpKVxuXHR0aGlzLmN1cnJlbnRTb3J0ID0gXCJhXCI7IC8vIGVpdGhlciAnYScgb3IgJ2InXG4gICAgfVxuICAgIHByb2Nlc3NCbG9jayAoYmxrKSB7IFxuICAgICAgICBibGsuYUluZGV4ID0gcGFyc2VJbnQoYmxrLmFJbmRleCk7XG4gICAgICAgIGJsay5iSW5kZXggPSBwYXJzZUludChibGsuYkluZGV4KTtcbiAgICAgICAgYmxrLmFTdGFydCA9IHBhcnNlSW50KGJsay5hU3RhcnQpO1xuICAgICAgICBibGsuYlN0YXJ0ID0gcGFyc2VJbnQoYmxrLmJTdGFydCk7XG4gICAgICAgIGJsay5hRW5kICAgPSBwYXJzZUludChibGsuYUVuZCk7XG4gICAgICAgIGJsay5iRW5kICAgPSBwYXJzZUludChibGsuYkVuZCk7XG4gICAgICAgIGJsay5hTGVuZ3RoICAgPSBwYXJzZUludChibGsuYUxlbmd0aCk7XG4gICAgICAgIGJsay5iTGVuZ3RoICAgPSBwYXJzZUludChibGsuYkxlbmd0aCk7XG4gICAgICAgIGJsay5ibG9ja0NvdW50ICAgPSBwYXJzZUludChibGsuYmxvY2tDb3VudCk7XG4gICAgICAgIGJsay5ibG9ja1JhdGlvICAgPSBwYXJzZUZsb2F0KGJsay5ibG9ja1JhdGlvKTtcblx0YmxrLmFiTWFwID0gZDMuc2NhbGUubGluZWFyKClcblx0ICAgIC5kb21haW4oW2Jsay5hU3RhcnQsYmxrLmFFbmRdKVxuXHQgICAgLnJhbmdlKCBibGsuYmxvY2tPcmk9PT1cIi1cIiA/IFtibGsuYkVuZCxibGsuYlN0YXJ0XSA6IFtibGsuYlN0YXJ0LGJsay5iRW5kXSk7XG5cdGJsay5iYU1hcCA9IGJsay5hYk1hcC5pbnZlcnRcblx0cmV0dXJuIGJsaztcbiAgICB9XG4gICAgc2V0U29ydCAod2hpY2gpIHtcblx0aWYgKHdoaWNoICE9PSAnYScgJiYgd2hpY2ggIT09ICdiJykgdGhyb3cgXCJCYWQgYXJndW1lbnQ6XCIgKyB3aGljaDtcblx0bGV0IHNvcnRDb2wgPSB3aGljaCArIFwiSW5kZXhcIjtcblx0bGV0IGNtcCA9ICh4LHkpID0+IHhbc29ydENvbF0gLSB5W3NvcnRDb2xdO1xuXHR0aGlzLmJsb2Nrcy5zb3J0KGNtcCk7XG5cdHRoaXMuY3VyclNvcnQgPSB3aGljaDtcbiAgICB9XG4gICAgZmxpcFNvcnQgKCkge1xuXHR0aGlzLnNldFNvcnQodGhpcy5jdXJyU29ydCA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcbiAgICB9XG4gICAgLy8gR2l2ZW4gYSBnZW5vbWUgKGVpdGhlciB0aGUgYSBvciBiIGdlbm9tZSkgYW5kIGEgY29vcmRpbmF0ZSByYW5nZSxcbiAgICAvLyByZXR1cm5zIHRoZSBlcXVpdmFsZW50IGNvb3JkaW5hdGUgcmFuZ2UocykgaW4gdGhlIG90aGVyIGdlbm9tZVxuICAgIHRyYW5zbGF0ZSAoZnJvbUdlbm9tZSwgY2hyLCBzdGFydCwgZW5kLCBpbnZlcnQpIHtcblx0Ly9cblx0ZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBzdGFydCA6IGVuZDtcblx0Ly8gZnJvbSA9IFwiYVwiIG9yIFwiYlwiLCBkZXBlbmRpbmcgb24gd2hpY2ggZ2Vub21lIGlzIGdpdmVuLlxuICAgICAgICBsZXQgZnJvbSA9IChmcm9tR2Vub21lID09PSB0aGlzLmFHZW5vbWUgPyBcImFcIiA6IGZyb21HZW5vbWUgPT09IHRoaXMuYkdlbm9tZSA/IFwiYlwiIDogbnVsbCk7XG5cdGlmICghZnJvbSkgdGhyb3cgXCJCYWQgYXJndW1lbnQuIEdlbm9tZSBuZWl0aGVyIEEgbm9yIEIuXCI7XG5cdC8vIHRvID0gXCJiXCIgb3IgXCJhXCIsIG9wcG9zaXRlIG9mIGZyb21cblx0bGV0IHRvID0gKGZyb20gPT09IFwiYVwiID8gXCJiXCIgOiBcImFcIik7XG5cdC8vIG1ha2Ugc3VyZSB0aGUgYmxvY2tzIGFyZSBzb3J0ZWQgYnkgdGhlIGZyb20gZ2Vub21lXG5cdHRoaXMuc2V0U29ydChmcm9tKTtcblx0Ly9cblx0bGV0IGZyb21DID0gZnJvbStcIkNoclwiO1xuXHRsZXQgZnJvbVMgPSBmcm9tK1wiU3RhcnRcIjtcblx0bGV0IGZyb21FID0gZnJvbStcIkVuZFwiO1xuXHRsZXQgZnJvbUkgPSBmcm9tK1wiSW5kZXhcIjtcblx0bGV0IHRvQyA9IHRvK1wiQ2hyXCI7XG5cdGxldCB0b1MgPSB0bytcIlN0YXJ0XCI7XG5cdGxldCB0b0UgPSB0bytcIkVuZFwiO1xuXHRsZXQgdG9JID0gdG8rXCJJbmRleFwiO1xuXHRsZXQgbWFwcGVyID0gZnJvbSt0bytcIk1hcFwiO1xuXHQvLyBcblx0bGV0IGJsa3MgPSB0aGlzLmJsb2Nrc1xuXHQgICAgLy8gRmlyc3QgZmlsdGVyIGZvciBibG9ja3MgdGhhdCBvdmVybGFwIHRoZSBnaXZlbiBjb29yZGluYXRlIHJhbmdlIGluIHRoZSBmcm9tIGdlbm9tZVxuXHQgICAgLmZpbHRlcihibGsgPT4gYmxrW2Zyb21DXSA9PT0gY2hyICYmIGJsa1tmcm9tU10gPD0gZW5kICYmIGJsa1tmcm9tRV0gPj0gc3RhcnQpXG5cdCAgICAvLyBtYXAgZWFjaCBibG9jay4gXG5cdCAgICAubWFwKGJsayA9PiB7XG5cdFx0Ly8gY29vcmQgcmFuZ2Ugb24gdGhlIGZyb20gc2lkZS5cblx0XHRsZXQgcyA9IE1hdGgubWF4KHN0YXJ0LCBibGtbZnJvbVNdKTtcblx0XHRsZXQgZSA9IE1hdGgubWluKGVuZCwgYmxrW2Zyb21FXSk7XG5cdFx0Ly8gY29vcmQgcmFuZ2Ugb24gdGhlIHRvIHNpZGUuXG5cdFx0bGV0IHMyID0gTWF0aC5jZWlsKGJsa1ttYXBwZXJdKHMpKTtcblx0XHRsZXQgZTIgPSBNYXRoLmZsb29yKGJsa1ttYXBwZXJdKGUpKTtcblx0ICAgICAgICByZXR1cm4gaW52ZXJ0ID8ge1xuXHRcdCAgICBjaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgc3RhcnQ6IHMsXG5cdFx0ICAgIGVuZDogICBlLFxuXHRcdCAgICBvcmk6ICAgYmxrLmJsb2NrT3JpLFxuXHRcdCAgICBpbmRleDogYmxrW2Zyb21JXSxcblx0XHQgICAgLy8gYWxzbyByZXR1cm4gdGhlIGZyb21HZW5vbWUgY29vcmRzIGZvciB0aGlzIHBpZWNlIG9mIHRoZSB0cmFuc2xhdGlvblxuXHRcdCAgICBmQ2hyOiAgIGJsa1t0b0NdLFxuXHRcdCAgICBmU3RhcnQ6IE1hdGgubWluKHMyLGUyKSxcblx0XHQgICAgZkVuZDogICBNYXRoLm1heChzMixlMiksXG5cdFx0ICAgIGZJbmRleDogYmxrW3RvSV0sXG5cdFx0ICAgIC8vIGluY2x1ZGUgdGhlIGJsb2NrIGlkIGFuZCBmdWxsIGJsb2NrIGNvb3Jkc1xuXHRcdCAgICBibG9ja0lkOiBibGsuYmxvY2tJZCxcblx0XHQgICAgYmxvY2tTdGFydDogYmxrW2Zyb21TXSxcblx0XHQgICAgYmxvY2tFbmQ6IGJsa1tmcm9tRV1cblx0XHQgICAgfSA6IHtcblx0XHQgICAgY2hyOiAgIGJsa1t0b0NdLFxuXHRcdCAgICBzdGFydDogTWF0aC5taW4oczIsZTIpLFxuXHRcdCAgICBlbmQ6ICAgTWF0aC5tYXgoczIsZTIpLFxuXHRcdCAgICBvcmk6ICAgYmxrLmJsb2NrT3JpLFxuXHRcdCAgICBpbmRleDogYmxrW3RvSV0sXG5cdFx0ICAgIC8vIGFsc28gcmV0dXJuIHRoZSBmcm9tR2Vub21lIGNvb3JkcyBmb3IgdGhpcyBwaWVjZSBvZiB0aGUgdHJhbnNsYXRpb25cblx0XHQgICAgZkNocjogICBibGtbZnJvbUNdLFxuXHRcdCAgICBmU3RhcnQ6IHMsXG5cdFx0ICAgIGZFbmQ6ICAgZSxcblx0XHQgICAgZkluZGV4OiBibGtbZnJvbUldLFxuXHRcdCAgICAvLyBpbmNsdWRlIHRoZSBibG9jayBpZCBhbmQgZnVsbCBibG9jayBjb29yZHNcblx0XHQgICAgYmxvY2tJZDogYmxrLmJsb2NrSWQsXG5cdFx0ICAgIGJsb2NrU3RhcnQ6IGJsa1t0b1NdLFxuXHRcdCAgICBibG9ja0VuZDogYmxrW3RvRV1cblx0XHR9O1xuXHQgICAgfSlcblx0Ly8gXG5cdHJldHVybiBibGtzO1xuICAgIH1cbiAgICAvLyBHaXZlbiBhIGdlbm9tZSAoZWl0aGVyIHRoZSBhIG9yIGIgZ2Vub21lKVxuICAgIC8vIHJldHVybnMgdGhlIGJsb2NrcyBmb3IgdHJhbnNsYXRpbmcgdG8gdGhlIG90aGVyIChiIG9yIGEpIGdlbm9tZS5cbiAgICAvL1xuICAgIGdldEJsb2NrcyAoZnJvbUdlbm9tZSkge1xuXHQvLyBmcm9tID0gXCJhXCIgb3IgXCJiXCIsIGRlcGVuZGluZyBvbiB3aGljaCBnZW5vbWUgaXMgZ2l2ZW4uXG4gICAgICAgIGxldCBmcm9tID0gKGZyb21HZW5vbWUgPT09IHRoaXMuYUdlbm9tZSA/IFwiYVwiIDogZnJvbUdlbm9tZSA9PT0gdGhpcy5iR2Vub21lID8gXCJiXCIgOiBudWxsKTtcblx0aWYgKCFmcm9tKSB0aHJvdyBcIkJhZCBhcmd1bWVudC4gR2Vub21lIG5laXRoZXIgQSBub3IgQi5cIjtcblx0Ly8gdG8gPSBcImJcIiBvciBcImFcIiwgb3Bwb3NpdGUgb2YgZnJvbVxuXHRsZXQgdG8gPSAoZnJvbSA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcblx0Ly8gbWFrZSBzdXJlIHRoZSBibG9ja3MgYXJlIHNvcnRlZCBieSB0aGUgZnJvbSBnZW5vbWVcblx0dGhpcy5zZXRTb3J0KGZyb20pO1xuXHQvL1xuXHRsZXQgZnJvbUMgPSBmcm9tK1wiQ2hyXCI7XG5cdGxldCBmcm9tUyA9IGZyb20rXCJTdGFydFwiO1xuXHRsZXQgZnJvbUUgPSBmcm9tK1wiRW5kXCI7XG5cdGxldCBmcm9tSSA9IGZyb20rXCJJbmRleFwiO1xuXHRsZXQgdG9DID0gdG8rXCJDaHJcIjtcblx0bGV0IHRvUyA9IHRvK1wiU3RhcnRcIjtcblx0bGV0IHRvRSA9IHRvK1wiRW5kXCI7XG5cdGxldCB0b0kgPSB0bytcIkluZGV4XCI7XG5cdGxldCBtYXBwZXIgPSBmcm9tK3RvK1wiTWFwXCI7XG5cdC8vIFxuXHRsZXQgYmxrcyA9IHRoaXMuYmxvY2tzXG5cdCAgICAubWFwKGJsayA9PiB7XG5cdCAgICAgICAgcmV0dXJuIHtcblx0XHQgICAgYmxvY2tJZDogICBibGsuYmxvY2tJZCxcblx0XHQgICAgb3JpOiAgICAgICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGZyb21DaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgZnJvbVN0YXJ0OiBibGtbZnJvbVNdLFxuXHRcdCAgICBmcm9tRW5kOiAgIGJsa1tmcm9tRV0sXG5cdFx0ICAgIGZyb21JbmRleDogYmxrW2Zyb21JXSxcblx0XHQgICAgdG9DaHI6ICAgICBibGtbdG9DXSxcblx0XHQgICAgdG9TdGFydDogICBibGtbdG9TXSxcblx0XHQgICAgdG9FbmQ6ICAgICBibGtbdG9FXSxcblx0XHQgICAgdG9JbmRleDogICBibGtbdG9JXVxuXHRcdH07XG5cdCAgICB9KVxuXHQvLyBcblx0cmV0dXJuIGJsa3M7XG4gICAgfVxufVxuXG5leHBvcnQgeyBCbG9ja1RyYW5zbGF0b3IgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0Jsb2NrVHJhbnNsYXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgU1ZHVmlldyB9IGZyb20gJy4vU1ZHVmlldyc7XG5pbXBvcnQgeyBjb29yZHNBZnRlclRyYW5zZm9ybSB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIEdlbm9tZVZpZXcgZXh0ZW5kcyBTVkdWaWV3IHtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQpO1xuXHR0aGlzLm9wZW5XaWR0aCA9IHRoaXMub3V0ZXJXaWR0aDtcblx0dGhpcy5vcGVuSGVpZ2h0PSB0aGlzLm91dGVySGVpZ2h0O1xuXHR0aGlzLnRvdGFsQ2hyV2lkdGggPSA0MDsgLy8gdG90YWwgd2lkdGggb2Ygb25lIGNocm9tb3NvbWUgKGJhY2tib25lK2Jsb2NrcytmZWF0cylcblx0dGhpcy5jd2lkdGggPSAyMDsgICAgICAgIC8vIGNocm9tb3NvbWUgd2lkdGhcblx0dGhpcy50aWNrTGVuZ3RoID0gMTA7XHQgLy8gZmVhdHVyZSB0aWNrIG1hcmsgbGVuZ3RoXG5cdHRoaXMuYnJ1c2hDaHIgPSBudWxsO1x0IC8vIHdoaWNoIGNociBoYXMgdGhlIGN1cnJlbnQgYnJ1c2hcblx0dGhpcy5id2lkdGggPSB0aGlzLmN3aWR0aC8yOyAgLy8gYmxvY2sgd2lkdGhcblx0dGhpcy5jdXJyQmxvY2tzID0gbnVsbDtcblx0dGhpcy5jdXJyVGlja3MgPSBudWxsO1xuXHR0aGlzLmdDaHJvbW9zb21lcyA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ2cnKS5hdHRyKFwibmFtZVwiLCBcImNocm9tb3NvbWVzXCIpO1xuXHR0aGlzLnRpdGxlICAgID0gdGhpcy5zdmdNYWluLmFwcGVuZCgndGV4dCcpLmF0dHIoXCJjbGFzc1wiLCBcInRpdGxlXCIpO1xuXHR0aGlzLnNjcm9sbEFtb3VudCA9IDA7XG5cdC8vXG5cdHRoaXMuaW5pdERvbSgpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmaXRUb1dpZHRoICh3KXtcbiAgICAgICAgc3VwZXIuZml0VG9XaWR0aCh3KTtcblx0dGhpcy5vcGVuV2lkdGggPSB0aGlzLm91dGVyV2lkdGg7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXREb20gKCkge1xuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uLmNsb3NlJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB0aGlzLnJlZHJhdygpKTtcblx0dGhpcy5zdmcub24oXCJ3aGVlbFwiLCAoKSA9PiB7XG5cdCAgICBpZiAoIXRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIpKSByZXR1cm47XG5cdCAgICB0aGlzLnNjcm9sbFdoZWVsKGQzLmV2ZW50LmRlbHRhWSlcblx0ICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH0pO1xuXHRsZXQgc2JzID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzdmdjb250YWluZXJcIl0gPiBbbmFtZT1cInNjcm9sbGJ1dHRvbnNcIl0nKVxuXHRzYnMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJ1cFwiXScpLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zY3JvbGxDaHJvbW9zb21lc1VwKCkpO1xuXHRzYnMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJkblwiXScpLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zY3JvbGxDaHJvbW9zb21lc0Rvd24oKSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0QnJ1c2hDb29yZHMgKGNvb3Jkcykge1xuXHR0aGlzLmNsZWFyQnJ1c2hlcygpO1xuXHR0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3QoYC5jaHJvbW9zb21lW25hbWU9XCIke2Nvb3Jkcy5jaHJ9XCJdIGdbbmFtZT1cImJydXNoXCJdYClcblx0ICAuZWFjaChmdW5jdGlvbihjaHIpe1xuXHQgICAgY2hyLmJydXNoLmV4dGVudChbY29vcmRzLnN0YXJ0LGNvb3Jkcy5lbmRdKTtcblx0ICAgIGNoci5icnVzaChkMy5zZWxlY3QodGhpcykpO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYnJ1c2hzdGFydCAoY2hyKXtcblx0dGhpcy5jbGVhckJydXNoZXMoY2hyLmJydXNoKTtcblx0dGhpcy5icnVzaENociA9IGNocjtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBicnVzaGVuZCAoKXtcblx0aWYoIXRoaXMuYnJ1c2hDaHIpIHJldHVybjtcblx0bGV0IGNjID0gdGhpcy5hcHAuY29vcmRzO1xuXHR2YXIgeHRudCA9IHRoaXMuYnJ1c2hDaHIuYnJ1c2guZXh0ZW50KCk7XG5cdGlmIChNYXRoLmFicyh4dG50WzBdIC0geHRudFsxXSkgPD0gMTApe1xuXHQgICAgLy8gdXNlciBjbGlja2VkXG5cdCAgICBsZXQgdyA9IGNjLmVuZCAtIGNjLnN0YXJ0ICsgMTtcblx0ICAgIHh0bnRbMF0gLT0gdy8yO1xuXHQgICAgeHRudFsxXSArPSB3LzI7XG5cdH1cblx0bGV0IGNvb3JkcyA9IHsgY2hyOnRoaXMuYnJ1c2hDaHIubmFtZSwgc3RhcnQ6TWF0aC5mbG9vcih4dG50WzBdKSwgZW5kOiBNYXRoLmZsb29yKHh0bnRbMV0pIH07XG5cdHRoaXMuYXBwLnNldENvbnRleHQoY29vcmRzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhckJydXNoZXMgKGV4Y2VwdCl7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbCgnW25hbWU9XCJicnVzaFwiXScpLmVhY2goZnVuY3Rpb24oY2hyKXtcblx0ICAgIGlmIChjaHIuYnJ1c2ggIT09IGV4Y2VwdCkge1xuXHRcdGNoci5icnVzaC5jbGVhcigpO1xuXHRcdGNoci5icnVzaChkMy5zZWxlY3QodGhpcykpO1xuXHQgICAgfVxuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRYIChjaHIpIHtcblx0bGV0IHggPSB0aGlzLmFwcC5yR2Vub21lLnhzY2FsZShjaHIpO1xuXHRpZiAoaXNOYU4oeCkpIHRocm93IFwieCBpcyBOYU5cIlxuXHRyZXR1cm4geDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0WSAocG9zKSB7XG5cdGxldCB5ID0gdGhpcy5hcHAuckdlbm9tZS55c2NhbGUocG9zKTtcblx0aWYgKGlzTmFOKHkpKSB0aHJvdyBcInkgaXMgTmFOXCJcblx0cmV0dXJuIHk7XG4gICAgfVxuICAgIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlZHJhdyAoKSB7XG4gICAgICAgIHRoaXMuZHJhdyh0aGlzLmN1cnJUaWNrcywgdGhpcy5jdXJyQmxvY2tzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3ICh0aWNrRGF0YSwgYmxvY2tEYXRhKSB7XG5cdHRoaXMuZHJhd0Nocm9tb3NvbWVzKCk7XG5cdHRoaXMuZHJhd0Jsb2NrcyhibG9ja0RhdGEpO1xuXHR0aGlzLmRyYXdUaWNrcyh0aWNrRGF0YSk7XG5cdHRoaXMuZHJhd1RpdGxlKCk7XG5cdHRoaXMuc2V0QnJ1c2hDb29yZHModGhpcy5hcHAuY29vcmRzKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgY2hyb21vc29tZXMgb2YgdGhlIHJlZmVyZW5jZSBnZW5vbWUuXG4gICAgLy8gSW5jbHVkZXMgYmFja2JvbmVzLCBsYWJlbHMsIGFuZCBicnVzaGVzLlxuICAgIC8vIFRoZSBiYWNrYm9uZXMgYXJlIGRyYXduIGFzIHZlcnRpY2FsIGxpbmUgc2VtZW50cyxcbiAgICAvLyBkaXN0cmlidXRlZCBob3Jpem9udGFsbHkuIE9yZGVyaW5nIGlzIGRlZmluZWQgYnlcbiAgICAvLyB0aGUgbW9kZWwgKEdlbm9tZSBvYmplY3QpLlxuICAgIC8vIExhYmVscyBhcmUgZHJhd24gYWJvdmUgdGhlIGJhY2tib25lcy5cbiAgICAvL1xuICAgIC8vIE1vZGlmaWNhdGlvbjpcbiAgICAvLyBEcmF3cyB0aGUgc2NlbmUgaW4gb25lIG9mIHR3byBzdGF0ZXM6IG9wZW4gb3IgY2xvc2VkLlxuICAgIC8vIFRoZSBvcGVuIHN0YXRlIGlzIGFzIGRlc2NyaWJlZCAtIGFsbCBjaHJvbW9zb21lcyBzaG93bi5cbiAgICAvLyBJbiB0aGUgY2xvc2VkIHN0YXRlOiBcbiAgICAvLyAgICAgKiBvbmx5IG9uZSBjaHJvbW9zb21lIHNob3dzICh0aGUgY3VycmVudCBvbmUpXG4gICAgLy8gICAgICogZHJhd24gaG9yaXpvbnRhbGx5IGFuZCBwb3NpdGlvbmVkIGJlc2lkZSB0aGUgXCJHZW5vbWUgVmlld1wiIHRpdGxlXG4gICAgLy9cbiAgICBkcmF3Q2hyb21vc29tZXMgKCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0bGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTsgLy8gcmVmIGdlbm9tZVxuXHRsZXQgckNocnMgPSByZy5jaHJvbW9zb21lcztcblxuICAgICAgICAvLyBDaHJvbW9zb21lIGdyb3Vwc1xuXHRsZXQgY2hycyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpXG5cdCAgICAuZGF0YShyQ2hycywgYyA9PiBjLm5hbWUpO1xuXHRsZXQgbmV3Y2hycyA9IGNocnMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsIFwiY2hyb21vc29tZVwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGMgPT4gYy5uYW1lKTtcblx0XG5cdG5ld2NocnMuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwibmFtZVwiLFwibGFiZWxcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwibGluZVwiKS5hdHRyKFwibmFtZVwiLFwiYmFja2JvbmVcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwic3luQmxvY2tzXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIixcInRpY2tzXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIixcImJydXNoXCIpO1xuXG5cblx0bGV0IGNsb3NlZCA9IHRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIpO1xuXHRpZiAoY2xvc2VkKSB7XG5cdCAgICAvLyBSZXNldCB0aGUgU1ZHIHNpemUgdG8gYmUgMS1jaHJvbW9zb21lIHdpZGUuXG5cdCAgICAvLyBUcmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwIHNvIHRoYXQgdGhlIGN1cnJlbnQgY2hyb21vc29tZSBhcHBlYXJzIGluIHRoZSBzdmcgYXJlYS5cblx0ICAgIC8vIFR1cm4gaXQgOTAgZGVnLlxuXG5cdCAgICAvLyBTZXQgdGhlIGhlaWdodCBvZiB0aGUgU1ZHIGFyZWEgdG8gMSBjaHJvbW9zb21lJ3Mgd2lkdGhcblx0ICAgIHRoaXMuc2V0R2VvbSh7IGhlaWdodDogdGhpcy50b3RhbENocldpZHRoLCByb3RhdGlvbjogLTkwLCB0cmFuc2xhdGlvbjogWy10aGlzLnRvdGFsQ2hyV2lkdGgvMiwzMF0gfSk7XG5cdCAgICAvLyBcblx0ICAgIGxldCBkZWx0YSA9IDEwO1xuXHQgICAgcmcueHNjYWxlID0gZDMuc2NhbGUub3JkaW5hbCgpXG5cdFx0IC5kb21haW4ockNocnMubWFwKGZ1bmN0aW9uKHgpe3JldHVybiB4Lm5hbWU7fSkpXG5cdFx0IC8vIGluIGNsb3NlZCBtb2RlLCB0aGUgY2hyb21vc29tZXMgaGF2ZSBmaXhlZCBzcGFjaW5nXG5cdFx0IC5yYW5nZVBvaW50cyhbZGVsdGEsIGRlbHRhK3RoaXMudG90YWxDaHJXaWR0aCoockNocnMubGVuZ3RoLTEpXSk7XG5cdCAgICAvL1xuXHQgICAgcmcueXNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQgLmRvbWFpbihbMSxyZy5tYXhsZW5dKVxuXHRcdCAucmFuZ2UoWzAsIHRoaXMud2lkdGhdKTtcblxuXHQgICAgLy8gdHJhbnNsYXRlIGVhY2ggY2hyb21vc29tZSBpbnRvIHBvc2l0aW9uXG5cdCAgICBjaHJzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYyA9PiBgdHJhbnNsYXRlKCR7cmcueHNjYWxlKGMubmFtZSl9LCAwKWApO1xuICAgICAgICAgICAgLy8gdHJhbnNsYXRlIHRoZSBjaHJvbW9zb21lcyBncm91cC5cblx0ICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbygtcmcueHNjYWxlKHRoaXMuYXBwLmNvb3Jkcy5jaHIpKTtcblx0ICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICAvLyBXaGVuIG9wZW4sIGRyYXcgYWxsIHRoZSBjaHJvbW9zb21lcy4gRWFjaCBjaHJvbSBpcyBhIHZlcnRpY2FsIGxpbmUuXG5cdCAgICAvLyBDaHJvbXMgYXJlIGRpc3RyaWJ1dGVkIGV2ZW5seSBhY3Jvc3MgdGhlIGF2YWlsYWJsZSBob3Jpem9udGFsIHNwYWNlLlxuXHQgICAgdGhpcy5zZXRHZW9tKHsgd2lkdGg6IHRoaXMub3BlbldpZHRoLCBoZWlnaHQ6IHRoaXMub3BlbkhlaWdodCwgcm90YXRpb246IDAsIHRyYW5zbGF0aW9uOiBbMCwwXSB9KTtcblx0ICAgIC8vIFxuXHQgICAgcmcueHNjYWxlID0gZDMuc2NhbGUub3JkaW5hbCgpXG5cdFx0IC5kb21haW4ockNocnMubWFwKGZ1bmN0aW9uKHgpe3JldHVybiB4Lm5hbWU7fSkpXG5cdFx0IC8vIGluIGNsb3NlZCBtb2RlLCB0aGUgY2hyb21vc29tZXMgc3ByZWFkIHRvIGZpbGwgdGhlIHNwYWNlXG5cdFx0IC5yYW5nZVBvaW50cyhbMCwgdGhpcy5vcGVuV2lkdGggLSAzMF0sIDAuNSk7XG5cdCAgICByZy55c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdCAuZG9tYWluKFsxLHJnLm1heGxlbl0pXG5cdFx0IC5yYW5nZShbMCwgdGhpcy5oZWlnaHRdKTtcblxuXHQgICAgLy8gdHJhbnNsYXRlIGVhY2ggY2hyb21vc29tZSBpbnRvIHBvc2l0aW9uXG5cdCAgICBjaHJzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYyA9PiBgdHJhbnNsYXRlKCR7cmcueHNjYWxlKGMubmFtZSl9LCAwKWApO1xuICAgICAgICAgICAgLy8gdHJhbnNsYXRlIHRoZSBjaHJvbW9zb21lcyBncm91cC5cblx0ICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbygwKTtcblx0fVxuXG5cdHJDaHJzLmZvckVhY2goY2hyID0+IHtcblx0ICAgIHZhciBzYyA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0LmRvbWFpbihbMSxjaHIubGVuZ3RoXSlcblx0XHQucmFuZ2UoWzAsIHJnLnlzY2FsZShjaHIubGVuZ3RoKV0pO1xuXHQgICAgY2hyLmJydXNoID0gZDMuc3ZnLmJydXNoKCkueShzYylcblx0ICAgICAgIC5vbihcImJydXNoc3RhcnRcIiwgY2hyID0+IHRoaXMuYnJ1c2hzdGFydChjaHIpKVxuXHQgICAgICAgLm9uKFwiYnJ1c2hlbmRcIiwgKCkgPT4gdGhpcy5icnVzaGVuZCgpKTtcblx0ICB9LCB0aGlzKTtcblxuXG4gICAgICAgIGNocnMuc2VsZWN0KCdbbmFtZT1cImxhYmVsXCJdJylcblx0ICAgIC50ZXh0KGM9PmMubmFtZSlcblx0ICAgIC5hdHRyKFwieFwiLCAwKSBcblx0ICAgIC5hdHRyKFwieVwiLCAtMilcblx0ICAgIDtcblxuXHRjaHJzLnNlbGVjdCgnW25hbWU9XCJiYWNrYm9uZVwiXScpXG5cdCAgICAuYXR0cihcIngxXCIsIDApXG5cdCAgICAuYXR0cihcInkxXCIsIDApXG5cdCAgICAuYXR0cihcIngyXCIsIDApXG5cdCAgICAuYXR0cihcInkyXCIsIGMgPT4gcmcueXNjYWxlKGMubGVuZ3RoKSlcblx0ICAgIDtcblx0ICAgXG5cdGNocnMuc2VsZWN0KCdbbmFtZT1cImJydXNoXCJdJylcblx0ICAgIC5lYWNoKGZ1bmN0aW9uKGQpe2QzLnNlbGVjdCh0aGlzKS5jYWxsKGQuYnJ1c2gpO30pXG5cdCAgICAuc2VsZWN0QWxsKCdyZWN0Jylcblx0ICAgICAuYXR0cignd2lkdGgnLDEwKVxuXHQgICAgIC5hdHRyKCd4JywgLTUpXG5cdCAgICA7XG5cblx0Y2hycy5leGl0KCkucmVtb3ZlKCk7XG5cdFxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNjcm9sbCB3aGVlbCBldmVudCBoYW5kbGVyLlxuICAgIHNjcm9sbFdoZWVsIChkeSkge1xuXHQvLyBBZGQgZHkgdG8gdG90YWwgc2Nyb2xsIGFtb3VudC4gVGhlbiB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzQnkoZHkpO1xuXHQvLyBBZnRlciBhIDIwMCBtcyBwYXVzZSBpbiBzY3JvbGxpbmcsIHNuYXAgdG8gbmVhcmVzdCBjaHJvbW9zb21lXG5cdHRoaXMudG91dCAmJiB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudG91dCk7XG5cdHRoaXMudG91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpPT50aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpLCAyMDApO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc1RvICh4KSB7XG4gICAgICAgIGlmICh4ID09PSB1bmRlZmluZWQpIHggPSB0aGlzLnNjcm9sbEFtb3VudDtcblx0dGhpcy5zY3JvbGxBbW91bnQgPSBNYXRoLm1heChNYXRoLm1pbih4LDE1KSwgLXRoaXMudG90YWxDaHJXaWR0aCAqICh0aGlzLmFwcC5yR2Vub21lLmNocm9tb3NvbWVzLmxlbmd0aC0xKSk7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke3RoaXMuc2Nyb2xsQW1vdW50fSwwKWApO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc0J5IChkeCkge1xuICAgICAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8odGhpcy5zY3JvbGxBbW91bnQgKyBkeCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzU25hcCAoKSB7XG5cdGxldCBpID0gTWF0aC5yb3VuZCh0aGlzLnNjcm9sbEFtb3VudCAvIHRoaXMudG90YWxDaHJXaWR0aClcblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKGkqdGhpcy50b3RhbENocldpZHRoKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNVcCAoKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNCeSgtdGhpcy50b3RhbENocldpZHRoKTtcblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNEb3duICgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc0J5KHRoaXMudG90YWxDaHJXaWR0aCk7XG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCk7XG4gICAgfVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRyYXdUaXRsZSAoKSB7XG5cdGxldCByZWZnID0gdGhpcy5hcHAuckdlbm9tZS5sYWJlbDtcblx0bGV0IGJsb2NrZyA9IHRoaXMuY3VyckJsb2NrcyA/IFxuXHQgICAgdGhpcy5jdXJyQmxvY2tzLmNvbXAgIT09IHRoaXMuYXBwLnJHZW5vbWUgP1xuXHQgICAgICAgIHRoaXMuY3VyckJsb2Nrcy5jb21wLmxhYmVsXG5cdFx0OlxuXHRcdG51bGxcblx0ICAgIDpcblx0ICAgIG51bGw7XG5cdGxldCBsc3QgPSB0aGlzLmFwcC5jdXJyTGlzdCA/IHRoaXMuYXBwLmN1cnJMaXN0Lm5hbWUgOiBudWxsO1xuXG5cdHRoaXMucm9vdC5zZWxlY3QoXCJsYWJlbCBzcGFuLnRpdGxlXCIpLnRleHQocmVmZyk7XG5cblx0bGV0IGxpbmVzID0gW107XG5cdGJsb2NrZyAmJiBsaW5lcy5wdXNoKGBCbG9ja3MgdnMuICR7YmxvY2tnfWApO1xuXHRsc3QgJiYgbGluZXMucHVzaChgRmVhdHVyZXMgZnJvbSBsaXN0IFwiJHtsc3R9XCJgKTtcblx0bGV0IHN1YnQgPSBsaW5lcy5qb2luKFwiIDo6IFwiKTtcblx0dGhpcy5yb290LnNlbGVjdChcImxhYmVsIHNwYW4uc3VidGl0bGVcIikudGV4dCgoc3VidCA/IFwiOjogXCIgOiBcIlwiKSArIHN1YnQpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSBvdXRsaW5lcyBvZiBzeW50ZW55IGJsb2NrcyBvZiB0aGUgcmVmIGdlbm9tZSB2cy5cbiAgICAvLyB0aGUgZ2l2ZW4gZ2Vub21lLlxuICAgIC8vIFBhc3NpbmcgbnVsbCBlcmFzZXMgYWxsIHN5bnRlbnkgYmxvY2tzLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgZGF0YSA9PSB7IHJlZjpHZW5vbWUsIGNvbXA6R2Vub21lLCBibG9ja3M6IGxpc3Qgb2Ygc3ludGVueSBibG9ja3MgfVxuICAgIC8vICAgIEVhY2ggc2Jsb2NrID09PSB7IGJsb2NrSWQ6aW50LCBvcmk6Ky8tLCBmcm9tQ2hyLCBmcm9tU3RhcnQsIGZyb21FbmQsIHRvQ2hyLCB0b1N0YXJ0LCB0b0VuZCB9XG4gICAgZHJhd0Jsb2NrcyAoZGF0YSkge1xuXHQvL1xuICAgICAgICBsZXQgc2JncnBzID0gdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKFwiLmNocm9tb3NvbWVcIikuc2VsZWN0KCdbbmFtZT1cInN5bkJsb2Nrc1wiXScpO1xuXHRpZiAoIWRhdGEgfHwgIWRhdGEuYmxvY2tzIHx8IGRhdGEuYmxvY2tzLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgdGhpcy5jdXJyQmxvY2tzID0gbnVsbDtcblx0ICAgIHNiZ3Jwcy5odG1sKCcnKTtcblx0ICAgIHRoaXMuZHJhd1RpdGxlKCk7XG5cdCAgICByZXR1cm47XG5cdH1cblx0dGhpcy5jdXJyQmxvY2tzID0gZGF0YTtcblx0Ly8gcmVvcmdhbml6ZSBkYXRhIHRvIHJlZmxlY3QgU1ZHIHN0cnVjdHVyZSB3ZSB3YW50LCBpZSwgZ3JvdXBlZCBieSBjaHJvbW9zb21lXG4gICAgICAgIGxldCBkeCA9IGRhdGEuYmxvY2tzLnJlZHVjZSgoYSxzYikgPT4ge1xuXHRcdGlmICghYVtzYi5mcm9tQ2hyXSkgYVtzYi5mcm9tQ2hyXSA9IFtdO1xuXHRcdGFbc2IuZnJvbUNocl0ucHVzaChzYik7XG5cdFx0cmV0dXJuIGE7XG5cdCAgICB9LCB7fSk7XG5cdHNiZ3Jwcy5lYWNoKGZ1bmN0aW9uKGMpe1xuXHQgICAgZDMuc2VsZWN0KHRoaXMpLmRhdHVtKHtjaHI6IGMubmFtZSwgYmxvY2tzOiBkeFtjLm5hbWVdIHx8IFtdIH0pO1xuXHR9KTtcblxuXHRsZXQgYndpZHRoID0gMTA7XG4gICAgICAgIGxldCBzYmxvY2tzID0gc2JncnBzLnNlbGVjdEFsbCgncmVjdC5zYmxvY2snKS5kYXRhKGI9PmIuYmxvY2tzKTtcbiAgICAgICAgbGV0IG5ld2JzID0gc2Jsb2Nrcy5lbnRlcigpLmFwcGVuZCgncmVjdCcpLmF0dHIoJ2NsYXNzJywnc2Jsb2NrJyk7XG5cdHNibG9ja3Ncblx0ICAgIC5hdHRyKFwieFwiLCAtYndpZHRoLzIgKVxuXHQgICAgLmF0dHIoXCJ5XCIsIGIgPT4gdGhpcy5nZXRZKGIuZnJvbVN0YXJ0KSlcblx0ICAgIC5hdHRyKFwid2lkdGhcIiwgYndpZHRoKVxuXHQgICAgLmF0dHIoXCJoZWlnaHRcIiwgYiA9PiBNYXRoLm1heCgwLHRoaXMuZ2V0WShiLmZyb21FbmQgLSBiLmZyb21TdGFydCArIDEpKSlcblx0ICAgIC5jbGFzc2VkKFwiaW52ZXJzaW9uXCIsIGIgPT4gYi5vcmkgPT09IFwiLVwiKVxuXHQgICAgLmNsYXNzZWQoXCJ0cmFuc2xvY2F0aW9uXCIsIGIgPT4gYi5mcm9tQ2hyICE9PSBiLnRvQ2hyKVxuXHQgICAgO1xuXG4gICAgICAgIHNibG9ja3MuZXhpdCgpLnJlbW92ZSgpO1xuXG5cdHRoaXMuZHJhd1RpdGxlKCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZHJhd1RpY2tzIChmZWF0dXJlcykge1xuXHR0aGlzLmN1cnJUaWNrcyA9IGZlYXR1cmVzO1xuXHRsZXQgcmcgPSB0aGlzLmFwcC5yR2Vub21lOyAvLyByZWYgZ2Vub21lXG5cdC8vIGZlYXR1cmUgdGljayBtYXJrc1xuXHRpZiAoIWZlYXR1cmVzIHx8IGZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKCdbbmFtZT1cInRpY2tzXCJdJykuc2VsZWN0QWxsKFwiLmZlYXR1cmVcIikucmVtb3ZlKCk7XG5cdCAgICByZXR1cm47XG5cdH1cblxuXHQvL1xuXHRsZXQgdEdycHMgPSB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoXCIuY2hyb21vc29tZVwiKS5zZWxlY3QoJ1tuYW1lPVwidGlja3NcIl0nKTtcblxuXHQvLyBncm91cCBmZWF0dXJlcyBieSBjaHJvbW9zb21lXG4gICAgICAgIGxldCBmaXggPSBmZWF0dXJlcy5yZWR1Y2UoKGEsZikgPT4geyBcblx0ICAgIGlmICghIGFbZi5jaHJdKSBhW2YuY2hyXSA9IFtdO1xuXHQgICAgYVtmLmNocl0ucHVzaChmKTtcblx0ICAgIHJldHVybiBhO1xuXHR9LCB7fSlcblx0dEdycHMuZWFjaChmdW5jdGlvbihjKSB7XG5cdCAgICBkMy5zZWxlY3QodGhpcykuZGF0dW0oIHsgY2hyOiBjLCBmZWF0dXJlczogZml4W2MubmFtZV0gIHx8IFtdfSApO1xuXHR9KTtcblxuXHQvLyB0aGUgdGljayBlbGVtZW50c1xuICAgICAgICBsZXQgZmVhdHMgPSB0R3Jwcy5zZWxlY3RBbGwoXCIuZmVhdHVyZVwiKVxuXHQgICAgLmRhdGEoZCA9PiBkLmZlYXR1cmVzLCBkID0+IGQubWdwaWQpO1xuXHQvL1xuXHRsZXQgeEFkaiA9IGYgPT4gKGYuc3RyYW5kID09PSBcIitcIiA/IHRoaXMudGlja0xlbmd0aCA6IC10aGlzLnRpY2tMZW5ndGgpO1xuXHQvL1xuXHRsZXQgc2hhcGUgPSBcImNpcmNsZVwiOyAgLy8gXCJjaXJjbGVcIiBvciBcImxpbmVcIlxuXHQvL1xuXHRsZXQgbmV3ZnMgPSBmZWF0cy5lbnRlcigpXG5cdCAgICAuYXBwZW5kKHNoYXBlKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwiZmVhdHVyZVwiKVxuXHQgICAgLm9uKCdjbGljaycsIChmKSA9PiB7XG5cdFx0bGV0IGkgPSBmLmNhbm9uaWNhbHx8Zi5JRDtcblx0ICAgICAgICB0aGlzLmFwcC5zZXRDb250ZXh0KHtsYW5kbWFyazppLCBoaWdobGlnaHQ6W2ldfSk7XG5cdCAgICB9KSA7XG5cdG5ld2ZzLmFwcGVuZChcInRpdGxlXCIpXG5cdFx0LnRleHQoZj0+Zi5zeW1ib2wgfHwgZi5pZCk7XG5cdGlmIChzaGFwZSA9PT0gXCJsaW5lXCIpIHtcblx0ICAgIGZlYXRzLmF0dHIoXCJ4MVwiLCBmID0+IHhBZGooZikgKyA1KVxuXHQgICAgZmVhdHMuYXR0cihcInkxXCIsIGYgPT4gcmcueXNjYWxlKGYuc3RhcnQpKVxuXHQgICAgZmVhdHMuYXR0cihcIngyXCIsIGYgPT4geEFkaihmKSArIHRoaXMudGlja0xlbmd0aCArIDUpXG5cdCAgICBmZWF0cy5hdHRyKFwieTJcIiwgZiA9PiByZy55c2NhbGUoZi5zdGFydCkpXG5cdH1cblx0ZWxzZSB7XG5cdCAgICBmZWF0cy5hdHRyKFwiY3hcIiwgZiA9PiB4QWRqKGYpKVxuXHQgICAgZmVhdHMuYXR0cihcImN5XCIsIGYgPT4gcmcueXNjYWxlKGYuc3RhcnQpKVxuXHQgICAgZmVhdHMuYXR0cihcInJcIiwgIHRoaXMudGlja0xlbmd0aCAvIDIpO1xuXHR9XG5cdC8vXG5cdGZlYXRzLmV4aXQoKS5yZW1vdmUoKVxuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEdlbm9tZVZpZXdcblxuZXhwb3J0IHsgR2Vub21lVmlldyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvR2Vub21lVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuXG5jbGFzcyBGZWF0dXJlRGV0YWlscyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0KSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0KTtcblx0dGhpcy5pbml0RG9tICgpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXREb20gKCkge1xuXHQvL1xuXHR0aGlzLnJvb3Quc2VsZWN0IChcIi5idXR0b24uY2xvc2VcIilcblx0ICAgIC5vbihcImNsaWNrLmV4dHJhXCIsICgpID0+IHRoaXMudXBkYXRlKCkpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgdXBkYXRlKGYpIHtcblx0Ly8gaWYgY2FsbGVkIHdpdGggbm8gYXJncywgdXBkYXRlIHVzaW5nIHRoZSBwcmV2aW91cyBmZWF0dXJlXG5cdGYgPSBmIHx8IHRoaXMubGFzdEZlYXR1cmU7XG5cdGlmICghZikge1xuXHQgICAvLyBGSVhNRTogbWFqb3IgcmVhY2hvdmVyIGluIHRoaXMgc2VjdGlvblxuXHQgICAvL1xuXHQgICAvLyBmYWxsYmFjay4gdGFrZSB0aGUgZmlyc3QgaGlnaGxpZ2h0ZWQuXG5cdCAgIGxldCByID0gdGhpcy5hcHAuem9vbVZpZXcuc3ZnTWFpbi5zZWxlY3QoXCJyZWN0LmZlYXR1cmUuaGlnaGxpZ2h0XCIpWzBdWzBdO1xuXHQgICAvLyBmYWxsYmFjay4gdGFrZSB0aGUgZmlyc3QgZmVhdHVyZVxuXHQgICBpZiAoIXIpIHIgPSB0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcInJlY3QuZmVhdHVyZVwiKVswXVswXTtcblx0ICAgaWYgKHIpIGYgPSByLl9fZGF0YV9fO1xuXHR9XG5cdC8vIHJlbWVtYmVyXG4gICAgICAgIGlmICghZikgdGhyb3cgXCJDYW5ub3QgdXBkYXRlIGZlYXR1cmUgZGV0YWlscy4gTm8gZmVhdHVyZS5cIjtcblx0dGhpcy5sYXN0RmVhdHVyZSA9IGY7XG5cblx0Ly8gbGlzdCBvZiBmZWF0dXJlcyB0byBzaG93IGluIGRldGFpbHMgYXJlYS5cblx0Ly8gdGhlIGdpdmVuIGZlYXR1cmUgYW5kIGFsbCBlcXVpdmFsZW50cyBpbiBvdGhlciBnZW5vbWVzLlxuXHRsZXQgZmxpc3QgPSBbZl07XG5cdGlmIChmLm1naWlkKSB7XG5cdCAgICAvLyBGSVhNRTogcmVhY2hvdmVyXG5cdCAgICBmbGlzdCA9IHRoaXMuYXBwLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlDYW5vbmljYWxJZChmLm1naWlkKTtcblx0fVxuXHQvLyBHb3QgdGhlIGxpc3QuIE5vdyBvcmRlciBpdCB0aGUgc2FtZSBhcyB0aGUgZGlzcGxheWVkIGdlbm9tZXNcblx0Ly8gYnVpbGQgaW5kZXggb2YgZ2Vub21lIG5hbWUgLT4gZmVhdHVyZSBpbiBmbGlzdFxuXHRsZXQgaXggPSBmbGlzdC5yZWR1Y2UoKGFjYyxmKSA9PiB7IGFjY1tmLmdlbm9tZS5uYW1lXSA9IGY7IHJldHVybiBhY2M7IH0sIHt9KVxuXHRsZXQgZ2Vub21lT3JkZXIgPSAoW3RoaXMuYXBwLnJHZW5vbWVdLmNvbmNhdCh0aGlzLmFwcC5jR2Vub21lcykpO1xuXHRmbGlzdCA9IGdlbm9tZU9yZGVyLm1hcChnID0+IGl4W2cubmFtZV0gfHwgbnVsbCk7XG5cdC8vXG5cdGxldCBjb2xIZWFkZXJzID0gW1xuXHQgICAgLy8gY29sdW1ucyBoZWFkZXJzIGFuZCB0aGVpciAlIHdpZHRoc1xuXHQgICAgW1wiR2Vub21lXCIgICAgICw5XSxcblx0ICAgIFtcIk1HUCBpZFwiICAgICAsMTddLFxuXHQgICAgW1wiVHlwZVwiICAgICAgICwxMC41XSxcblx0ICAgIFtcIkJpb1R5cGVcIiAgICAsMTguNV0sXG5cdCAgICBbXCJDb29yZHNcIiAgICAgLDE4XSxcblx0ICAgIFtcIkxlbmd0aFwiICAgICAsN10sXG5cdCAgICBbXCJNR0kgaWRcIiAgICAgLDEwXSxcblx0ICAgIFtcIk1HSSBzeW1ib2xcIiAsMTBdXG5cdF07XG5cdC8vIEluIHRoZSBjbG9zZWQgc3RhdGUsIG9ubHkgc2hvdyB0aGUgaGVhZGVyIGFuZCB0aGUgcm93IGZvciB0aGUgcGFzc2VkIGZlYXR1cmVcblx0aWYgKHRoaXMucm9vdC5jbGFzc2VkKCdjbG9zZWQnKSlcblx0ICAgIGZsaXN0ID0gZmxpc3QuZmlsdGVyKCAoZmYsIGkpID0+IGZmID09PSBmICk7XG5cdC8vIERyYXcgdGhlIHRhYmxlXG5cdGxldCB0ID0gdGhpcy5yb290LnNlbGVjdCgndGFibGUnKTtcblx0bGV0IHJvd3MgPSB0LnNlbGVjdEFsbCgndHInKS5kYXRhKCBbY29sSGVhZGVyc10uY29uY2F0KGZsaXN0KSApO1xuXHRyb3dzLmVudGVyKCkuYXBwZW5kKCd0cicpXG5cdCAgLm9uKFwibW91c2VlbnRlclwiLCAoZixpKSA9PiBpICE9PSAwICYmIHRoaXMuYXBwLnpvb21WaWV3LmhpZ2hsaWdodChmLCB0cnVlKSlcblx0ICAub24oXCJtb3VzZWxlYXZlXCIsIChmLGkpID0+IGkgIT09IDAgJiYgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KCkpO1xuXHQgICAgICBcblx0cm93cy5leGl0KCkucmVtb3ZlKCk7XG5cdHJvd3MuY2xhc3NlZChcImhpZ2hsaWdodFwiLCAoZmYsIGkpID0+IChpICE9PSAwICYmIGZmID09PSBmKSk7XG5cdC8vXG5cdC8vIEdpdmVuIGEgZmVhdHVyZSwgcmV0dXJucyBhIGxpc3Qgb2Ygc3RyaW5ncyBmb3IgcG9wdWxhdGluZyBhIHRhYmxlIHJvdy5cblx0Ly8gSWYgaT09PTAsIHRoZW4gZiBpcyBub3QgYSBmZWF0dXJlLCBidXQgYSBsaXN0IGNvbHVtbnMgbmFtZXMrd2lkdGhzLlxuXHQvLyBcblx0bGV0IGNlbGxEYXRhID0gZnVuY3Rpb24gKGYsIGkpIHtcblx0ICAgIGlmIChpID09PSAwKSB7XG5cdFx0cmV0dXJuIGY7XG5cdCAgICB9XG5cdCAgICBsZXQgY2VsbERhdGEgPSBbIGdlbm9tZU9yZGVyW2ktMV0ubGFiZWwsIFwiLlwiLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiwgXCIuXCIsIFwiLlwiIF07XG5cdCAgICAvLyBmIGlzIG51bGwgaWYgaXQgZG9lc24ndCBleGlzdCBmb3IgZ2Vub21lIGkgXG5cdCAgICBpZiAoZikge1xuXHRcdGxldCBsaW5rID0gXCJcIjtcblx0XHRsZXQgbWdpaWQgPSBmLm1naWlkIHx8IFwiXCI7XG5cdFx0aWYgKG1naWlkKSB7XG5cdFx0ICAgIGxldCB1cmwgPSBgaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL2FjY2Vzc2lvbi8ke21naWlkfWA7XG5cdFx0ICAgIGxpbmsgPSBgPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7dXJsfVwiPiR7bWdpaWR9PC9hPmA7XG5cdFx0fVxuXHRcdGNlbGxEYXRhID0gW1xuXHRcdCAgICBmLmdlbm9tZS5sYWJlbCxcblx0XHQgICAgZi5tZ3BpZCxcblx0XHQgICAgZi50eXBlLFxuXHRcdCAgICBmLmJpb3R5cGUsXG5cdFx0ICAgIGAke2YuY2hyfToke2Yuc3RhcnR9Li4ke2YuZW5kfSAoJHtmLnN0cmFuZH0pYCxcblx0XHQgICAgYCR7Zi5lbmQgLSBmLnN0YXJ0ICsgMX0gYnBgLFxuXHRcdCAgICBsaW5rIHx8IG1naWlkLFxuXHRcdCAgICBmLnN5bWJvbFxuXHRcdF07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gY2VsbERhdGE7XG5cdH07XG5cdGxldCBjZWxscyA9IHJvd3Muc2VsZWN0QWxsKFwidGRcIilcblx0ICAgIC5kYXRhKChmLGkpID0+IGNlbGxEYXRhKGYsaSkpO1xuXHRjZWxscy5lbnRlcigpLmFwcGVuZChcInRkXCIpO1xuXHRjZWxscy5leGl0KCkucmVtb3ZlKCk7XG5cdGNlbGxzLmh0bWwoKGQsaSxqKSA9PiB7XG5cdCAgICByZXR1cm4gaiA9PT0gMCA/IGRbMF0gOiBkXG5cdH0pXG5cdC5zdHlsZShcIndpZHRoXCIsIChkLGksaikgPT4gaiA9PT0gMCA/IGAke2RbMV19JWAgOiBudWxsKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IEZlYXR1cmVEZXRhaWxzIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlRGV0YWlscy5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgU1ZHVmlldyB9IGZyb20gJy4vU1ZHVmlldyc7XG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSAnLi9GZWF0dXJlJztcbmltcG9ydCB7IHBhcnNlQ29vcmRzLCBmb3JtYXRDb29yZHMsIGNvb3Jkc0FmdGVyVHJhbnNmb3JtLCByZW1vdmVEdXBzIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgWm9vbVZpZXcgZXh0ZW5kcyBTVkdWaWV3IHtcbiAgICAvL1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCwgaW5pdGlhbENvb3JkcywgaW5pdGlhbEhpKSB7XG4gICAgICBzdXBlcihhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAvL1xuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgLy9cbiAgICAgIHRoaXMubWluU3ZnSGVpZ2h0ID0gMjUwO1xuICAgICAgdGhpcy5ibG9ja0hlaWdodCA9IDQwO1xuICAgICAgdGhpcy50b3BPZmZzZXQgPSA0NTtcbiAgICAgIHRoaXMuZmVhdEhlaWdodCA9IDY7XHQvLyBoZWlnaHQgb2YgYSByZWN0YW5nbGUgcmVwcmVzZW50aW5nIGEgZmVhdHVyZVxuICAgICAgdGhpcy5sYW5lR2FwID0gMjtcdCAgICAgICAgLy8gc3BhY2UgYmV0d2VlbiBzd2ltIGxhbmVzXG4gICAgICB0aGlzLmxhbmVIZWlnaHQgPSB0aGlzLmZlYXRIZWlnaHQgKyB0aGlzLmxhbmVHYXA7XG4gICAgICB0aGlzLnN0cmlwSGVpZ2h0ID0gNzA7ICAgIC8vIGhlaWdodCBwZXIgZ2Vub21lIGluIHRoZSB6b29tIHZpZXdcbiAgICAgIHRoaXMuc3RyaXBHYXAgPSAyMDtcdC8vIHNwYWNlIGJldHdlZW4gc3RyaXBzXG4gICAgICB0aGlzLmRtb2RlID0gJ2NvbXBhcmlzb24nOy8vIGRyYXdpbmcgbW9kZS4gJ2NvbXBhcmlzb24nIG9yICdyZWZlcmVuY2UnXG5cbiAgICAgIC8vXG4gICAgICAvLyBJRHMgb2YgRmVhdHVyZXMgd2UncmUgaGlnaGxpZ2h0aW5nLiBNYXkgYmUgbWdwaWQgIG9yIG1naUlkXG4gICAgICAvLyBoaUZlYXRzIGlzIGFuIG9iaiB3aG9zZSBrZXlzIGFyZSB0aGUgSURzXG4gICAgICB0aGlzLmhpRmVhdHMgPSAoaW5pdGlhbEhpIHx8IFtdKS5yZWR1Y2UoIChhLHYpID0+IHsgYVt2XT12OyByZXR1cm4gYTsgfSwge30gKTtcbiAgICAgIC8vXG4gICAgICB0aGlzLmZpZHVjaWFscyA9IHRoaXMuc3ZnLmluc2VydChcImdcIixcIjpmaXJzdC1jaGlsZFwiKSAvLyBcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLFwiZmlkdWNpYWxzXCIpO1xuICAgICAgdGhpcy5zdHJpcHNHcnAgPSB0aGlzLnN2Z01haW4uYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJzdHJpcHNcIik7XG4gICAgICB0aGlzLmF4aXMgPSB0aGlzLnN2Z01haW4uYXBwZW5kKFwiZ1wiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJheGlzXCIpO1xuICAgICAgdGhpcy5jeHRNZW51ID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJjeHRNZW51XCJdJyk7XG4gICAgICAvL1xuICAgICAgdGhpcy5kcmFnZ2luZyA9IG51bGw7XG4gICAgICB0aGlzLmRyYWdnZXIgPSB0aGlzLmdldERyYWdnZXIoKTtcbiAgICAgIC8vXG4gICAgICB0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgLy9cbiAgICBpbml0RG9tICgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgciA9IHRoaXMucm9vdDtcblx0bGV0IGEgPSB0aGlzLmFwcDtcblx0Ly9cblx0ci5zZWxlY3QoJy5idXR0b24uY2xvc2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHRoaXMudXBkYXRlKCkpO1xuXG5cdC8vIHpvb20gY29udHJvbHNcblx0ci5zZWxlY3QoXCIjem9vbU91dFwiKS5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEuem9vbShhLmRlZmF1bHRab29tKSB9KTtcblx0ci5zZWxlY3QoXCIjem9vbUluXCIpIC5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgxL2EuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdChcIiN6b29tT3V0TW9yZVwiKS5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgyKmEuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdChcIiN6b29tSW5Nb3JlXCIpIC5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgxLygyKmEuZGVmYXVsdFpvb20pKSB9KTtcblxuXHQvLyBwYW4gY29udHJvbHNcblx0ci5zZWxlY3QoXCIjcGFuTGVmdFwiKSAub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigtYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoXCIjcGFuUmlnaHRcIikub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnBhbigrYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoXCIjcGFuTGVmdE1vcmVcIikgLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS5wYW4oLTUqYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoXCIjcGFuUmlnaHRNb3JlXCIpLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS5wYW4oKzUqYS5kZWZhdWx0UGFuKSB9KTtcblxuXHQvLyBDcmVhdGUgY29udGV4dCBtZW51LiBcblx0dGhpcy5pbml0Q29udGV4dE1lbnUoW3tcbiAgICAgICAgICAgIGxhYmVsOiBcIk1HSSBTTlBzXCIsIFxuXHQgICAgaWNvbjogXCJvcGVuX2luX25ld1wiLFxuXHQgICAgdG9vbHRpcDogXCJWaWV3IFNOUHMgYXQgTUdJIGZvciB0aGUgY3VycmVudCBzdHJhaW5zIGluIHRoZSBjdXJyZW50IHJlZ2lvbi4gKFNvbWUgc3RyYWlucyBub3QgYXZhaWxhYmxlLilcIixcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpU25wUmVwb3J0KClcblx0fSx7XG4gICAgICAgICAgICBsYWJlbDogXCJNR0kgUVRMc1wiLCBcblx0ICAgIGljb246ICBcIm9wZW5faW5fbmV3XCIsXG5cdCAgICB0b29sdGlwOiBcIlZpZXcgUVRMIGF0IE1HSSB0aGF0IG92ZXJsYXAgdGhlIGN1cnJlbnQgcmVnaW9uLlwiLFxuXHQgICAgaGFuZGxlcjogKCk9PiB0aGlzLmFwcC5saW5rVG9NZ2lRVExzKClcblx0fSx7XG4gICAgICAgICAgICBsYWJlbDogXCJNR0kgSkJyb3dzZVwiLCBcblx0ICAgIGljb246IFwib3Blbl9pbl9uZXdcIixcblx0ICAgIHRvb2x0aXA6IFwiT3BlbiBNR0kgSkJyb3dzZSAoQzU3QkwvNkogR1JDbTM4KSB3aXRoIHRoZSBjdXJyZW50IGNvb3JkaW5hdGUgcmFuZ2UuXCIsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naUpCcm93c2UoKVxuXHR9XSk7XG5cdHRoaXMucm9vdFxuXHQgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgLy8gY2xpY2sgb24gYmFja2dyb3VuZCA9PiBoaWRlIGNvbnRleHQgbWVudVxuXHQgICAgICBsZXQgdGd0ID0gZDMuZXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAodGd0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpXCIgJiYgdGd0LmlubmVySFRNTCA9PT0gXCJtZW51XCIpXG5cdFx0ICAvLyBleGNlcHRpb246IHRoZSBjb250ZXh0IG1lbnUgYnV0dG9uIGl0c2VsZlxuXHQgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICBlbHNlXG5cdFx0ICB0aGlzLmhpZGVDb250ZXh0TWVudSgpXG5cdCAgICAgIFxuXHQgIH0pXG5cdCAgLm9uKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKCl7XG5cdCAgICAgIC8vIHJpZ2h0LWNsaWNrIG9uIGEgZmVhdHVyZSA9PiBmZWF0dXJlIGNvbnRleHQgbWVudVxuXHQgICAgICBsZXQgdGd0ID0gZDMuZXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAoIXRndC5jbGFzc0xpc3QuY29udGFpbnMoXCJmZWF0dXJlXCIpKSByZXR1cm47XG5cdCAgICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgIH0pO1xuXG5cdC8vXG5cdC8vXG5cdGxldCBmQ2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKGYsIGV2dCwgcHJlc2VydmUpIHtcblx0ICAgIGxldCBpZCA9IGYubWdpaWQgfHwgZi5tZ3BpZDtcblx0ICAgIGlmIChldnQubWV0YUtleSkge1xuXHRcdGlmICghZXZ0LnNoaWZ0S2V5ICYmICFwcmVzZXJ2ZSkgdGhpcy5oaUZlYXRzID0ge307XG5cdFx0dGhpcy5oaUZlYXRzW2lkXSA9IGlkO1xuXHQgICAgICAgIHRoaXMuYXBwLnNldENvbnRleHQoe2xhbmRtYXJrOihmLmNhbm9uaWNhbCB8fCBmLklEKSwgZGVsdGE6MH0pXG5cdFx0cmV0dXJuO1xuXHQgICAgfVxuXHQgICAgaWYgKGV2dC5zaGlmdEtleSkge1xuXHRcdGlmICh0aGlzLmhpRmVhdHNbaWRdKVxuXHRcdCAgICBkZWxldGUgdGhpcy5oaUZlYXRzW2lkXVxuXHRcdGVsc2Vcblx0XHQgICAgdGhpcy5oaUZlYXRzW2lkXSA9IGlkO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0aWYgKCFwcmVzZXJ2ZSkgdGhpcy5oaUZlYXRzID0ge307XG5cdFx0dGhpcy5oaUZlYXRzW2lkXSA9IGlkO1xuXHQgICAgfVxuXHR9LmJpbmQodGhpcyk7XG5cdC8vXG5cdGxldCBmTW91c2VPdmVySGFuZGxlciA9IGZ1bmN0aW9uKGYpIHtcblx0XHRpZiAoZDMuZXZlbnQuYWx0S2V5KSB7XG5cdFx0ICAgIC8vIElmIHVzZXIgaXMgaG9sZGluZyB0aGUgYWx0IGtleSwgc2VsZWN0IGV2ZXJ5dGhpbmcgdG91Y2hlZC5cblx0XHQgICAgZkNsaWNrSGFuZGxlcihmLCBkMy5ldmVudCwgdHJ1ZSk7XG5cdFx0ICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdFx0ICAgIC8vIERvbid0IHJlZ2lzdGVyIGNvbnRleHQgY2hhbmdlcyB1bnRpbCB1c2VyIGhhcyBwYXVzZWQgZm9yIGF0IGxlYXN0IDFzLlxuXHRcdCAgICBpZiAodGhpcy50aW1lb3V0KSB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cdFx0ICAgIHRoaXMudGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHRoaXMuYXBwLmNvbnRleHRDaGFuZ2VkKCk7IH0uYmluZCh0aGlzKSwgMTAwMCk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCFkMy5ldmVudC5jdHJsS2V5KSBcblx0XHQgICAgdGhpcy5oaWdobGlnaHQoZik7XG5cdH0uYmluZCh0aGlzKTtcblx0Ly9cblx0bGV0IGZNb3VzZU91dEhhbmRsZXIgPSBmdW5jdGlvbihmKSB7XG5cdCAgICBpZiAoIWQzLmV2ZW50LmN0cmxLZXkpXG5cdFx0dGhpcy5oaWdobGlnaHQoKTsgXG5cdH0uYmluZCh0aGlzKTtcblxuXHQvLyBcbiAgICAgICAgdGhpcy5zdmdcblx0ICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0ID0gZDMuZXZlbnQudGFyZ2V0O1xuXHQgICAgICBsZXQgdGd0ID0gZDMuc2VsZWN0KHQpO1xuXHQgICAgICBpZiAodC50YWdOYW1lID09IFwicmVjdFwiICYmIHQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmVhdHVyZVwiKSkge1xuXHRcdCAgLy8gdXNlciBjbGlja2VkIG9uIGEgZmVhdHVyZVxuXHRcdCAgZkNsaWNrSGFuZGxlcih0Ll9fZGF0YV9fLCBkMy5ldmVudCk7XG5cdFx0ICB0aGlzLmhpZ2hsaWdodCgpO1xuXHQgICAgICAgICAgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTtcblx0ICAgICAgfVxuXHQgICAgICBlbHNlIGlmICh0LnRhZ05hbWUgPT0gXCJyZWN0XCIgJiYgdC5jbGFzc0xpc3QuY29udGFpbnMoXCJibG9ja1wiKSAmJiAhZDMuZXZlbnQuc2hpZnRLZXkpIHtcblx0XHQgIC8vIHVzZXIgY2xpY2tlZCBvbiBhIHN5bnRlbnkgYmxvY2sgYmFja2dyb3VuZFxuXHRcdCAgdGhpcy5oaUZlYXRzID0ge307XG5cdFx0ICB0aGlzLmhpZ2hsaWdodCgpO1xuXHRcdCAgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTtcblx0ICAgICAgfVxuXHQgICAgICBlbHNlIGlmICh0LnRhZ05hbWUgPT0gXCJyZWN0XCIgJiYgdGd0LmF0dHIoJ25hbWUnKSA9PT0gJ3pvb21TdHJpcEhhbmRsZScgJiYgZDMuZXZlbnQuc2hpZnRLZXkpIHtcblx0ICAgICAgICAgIHRoaXMuYXBwLnNldENvbnRleHQoe3JlZjp0Ll9fZGF0YV9fLmdlbm9tZS5uYW1lfSk7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbihcIm1vdXNlb3ZlclwiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU92ZXJIYW5kbGVyKGYpO1xuXHQgICAgICB9XG5cdCAgfSlcblx0ICAub24oXCJtb3VzZW91dFwiLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU91dEhhbmRsZXIoZik7XG5cdCAgICAgIH1cblx0ICB9KTtcblxuXHQvLyBCdXR0b246IERyb3AgZG93biBtZW51IGluIHpvb20gdmlld1xuXHR0aGlzLnJvb3Quc2VsZWN0KFwiLm1lbnUgPiAuYnV0dG9uXCIpXG5cdCAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICAvLyBzaG93IGNvbnRleHQgbWVudSBhdCBtb3VzZSBldmVudCBjb29yZGluYXRlc1xuXHQgICAgICBsZXQgY3ggPSBkMy5ldmVudC5jbGllbnRYO1xuXHQgICAgICBsZXQgY3kgPSBkMy5ldmVudC5jbGllbnRZO1xuXHQgICAgICBsZXQgYmIgPSBkMy5zZWxlY3QodGhpcylbMF1bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICBzZWxmLnNob3dDb250ZXh0TWVudShjeC1iYi5sZWZ0LGN5LWJiLnRvcCk7XG5cdCAgfSk7XG5cdC8vIHpvb20gY29vcmRpbmF0ZXMgYm94XG5cdHRoaXMucm9vdC5zZWxlY3QoXCIjem9vbUNvb3Jkc1wiKVxuXHQgICAgLmNhbGwoemNzID0+IHpjc1swXVswXS52YWx1ZSA9IGZvcm1hdENvb3Jkcyh0aGlzLmFwcC5jb29yZHMpKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkgeyB0aGlzLnNlbGVjdCgpOyB9KVxuXHQgICAgLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHsgc2VsZi5hcHAuc2V0Q29vcmRpbmF0ZXModGhpcy52YWx1ZSk7IH0pO1xuXG5cdC8vIHpvb20gd2luZG93IHNpemUgYm94XG5cdHRoaXMucm9vdC5zZWxlY3QoXCIjem9vbVdTaXplXCIpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7IHRoaXMuc2VsZWN0KCk7IH0pXG5cdCAgICAub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgbGV0IHdzID0gcGFyc2VJbnQodGhpcy52YWx1ZSk7XG5cdFx0bGV0IGMgPSBzZWxmLmFwcC5jb29yZHM7XG5cdFx0aWYgKGlzTmFOKHdzKSB8fCB3cyA8IDEwMCkge1xuXHRcdCAgICBhbGVydChcIkludmFsaWQgd2luZG93IHNpemUuIFBsZWFzZSBlbnRlciBhbiBpbnRlZ2VyID49IDEwMC5cIik7XG5cdFx0ICAgIHRoaXMudmFsdWUgPSBNYXRoLnJvdW5kKGMuZW5kIC0gYy5zdGFydCArIDEpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHQgICAgbGV0IG1pZCA9IChjLnN0YXJ0ICsgYy5lbmQpIC8gMjtcblx0XHQgICAgbGV0IG5ld3MgPSBNYXRoLnJvdW5kKG1pZCAtIHdzLzIpO1xuXHRcdCAgICBsZXQgbmV3ZSA9IG5ld3MgKyB3cyAtIDE7XG5cdFx0ICAgIHNlbGYuYXBwLnNldENvbnRleHQoe1xuXHRcdCAgICAgICAgY2hyOiBjLmNocixcblx0XHRcdHN0YXJ0OiBuZXdzLFxuXHRcdFx0ZW5kOiBuZXdlLFxuXHRcdFx0bGVuZ3RoOiBuZXdlLW5ld3MrMVxuXHRcdCAgICB9KTtcblx0XHR9XG5cdCAgICB9KTtcblx0Ly8gem9vbSBkcmF3aW5nIG1vZGUgXG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ2RpdltuYW1lPVwiem9vbURtb2RlXCJdIC5idXR0b24nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0bGV0IHIgPSBzZWxmLnJvb3Q7XG5cdFx0bGV0IGlzQyA9IHIuY2xhc3NlZCgnY29tcGFyaXNvbicpO1xuXHRcdHIuY2xhc3NlZCgnY29tcGFyaXNvbicsICFpc0MpO1xuXHRcdHIuY2xhc3NlZCgncmVmZXJlbmNlJywgaXNDKTtcblx0XHRzZWxmLmFwcC5zZXRDb250ZXh0KHtkbW9kZTogci5jbGFzc2VkKCdjb21wYXJpc29uJykgPyAnY29tcGFyaXNvbicgOiAncmVmZXJlbmNlJ30pO1xuXHQgICAgfSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIGRhdGEgKGxpc3Qgb2YgbWVudUl0ZW0gY29uZmlncykgRWFjaCBjb25maWcgbG9va3MgbGlrZSB7bGFiZWw6c3RyaW5nLCBoYW5kbGVyOiBmdW5jdGlvbn1cbiAgICBpbml0Q29udGV4dE1lbnUgKGRhdGEpIHtcblx0dGhpcy5jeHRNZW51LnNlbGVjdEFsbChcIi5tZW51SXRlbVwiKS5yZW1vdmUoKTsgLy8gaW4gY2FzZSBvZiByZS1pbml0XG4gICAgICAgIGxldCBtaXRlbXMgPSB0aGlzLmN4dE1lbnVcblx0ICAuc2VsZWN0QWxsKFwiLm1lbnVJdGVtXCIpXG5cdCAgLmRhdGEoZGF0YSk7XG5cdGxldCBuZXdzID0gbWl0ZW1zLmVudGVyKClcblx0ICAuYXBwZW5kKFwiZGl2XCIpXG5cdCAgLmF0dHIoXCJjbGFzc1wiLCBcIm1lbnVJdGVtIGZsZXhyb3dcIilcblx0ICAuYXR0cihcInRpdGxlXCIsIGQgPT4gZC50b29sdGlwIHx8IG51bGwgKTtcblx0bmV3cy5hcHBlbmQoXCJsYWJlbFwiKVxuXHQgIC50ZXh0KGQgPT4gZC5sYWJlbClcblx0ICAub24oXCJjbGlja1wiLCBkID0+IHtcblx0ICAgICAgZC5oYW5kbGVyKCk7XG5cdCAgICAgIHRoaXMuaGlkZUNvbnRleHRNZW51KCk7XG5cdCAgfSk7XG5cdG5ld3MuYXBwZW5kKFwiaVwiKVxuXHQgIC5hdHRyKFwiY2xhc3NcIiwgXCJtYXRlcmlhbC1pY29uc1wiKVxuXHQgIC50ZXh0KCBkPT5kLmljb24gKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0IGhpZ2hsaWdodGVkIChobHMpIHtcblx0aWYgKHR5cGVvZihobHMpID09PSBcInN0cmluZ1wiKVxuXHQgICAgaGxzID0gW2hsc107XG5cdC8vXG5cdHRoaXMuaGlGZWF0cyA9IHt9O1xuICAgICAgICBmb3IobGV0IGggb2YgaGxzKXtcblx0ICAgIHRoaXMuaGlGZWF0c1toXSA9IGg7XG5cdH1cbiAgICB9XG4gICAgZ2V0IGhpZ2hsaWdodGVkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlGZWF0cyA/IE9iamVjdC5rZXlzKHRoaXMuaGlGZWF0cykgOiBbXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93Q29udGV4dE1lbnUgKHgseSkge1xuICAgICAgICB0aGlzLmN4dE1lbnVcblx0ICAgIC5jbGFzc2VkKFwic2hvd2luZ1wiLCB0cnVlKVxuXHQgICAgLnN0eWxlKFwibGVmdFwiLCBgJHt4fXB4YClcblx0ICAgIC5zdHlsZShcInRvcFwiLCBgJHt5fXB4YClcblx0ICAgIDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaGlkZUNvbnRleHRNZW51ICgpIHtcbiAgICAgICAgdGhpcy5jeHRNZW51LmNsYXNzZWQoXCJzaG93aW5nXCIsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBncyAobGlzdCBvZiBHZW5vbWVzKVxuICAgIC8vIFNpZGUgZWZmZWN0czpcbiAgICAvLyAgICAgRm9yIGVhY2ggR2Vub21lLCBzZXRzIGcuem9vbVkgXG4gICAgc2V0IGdlbm9tZXMgKGdzKSB7XG4gICAgICAgZ3MuZm9yRWFjaCggKGcsaSkgPT4ge2cuem9vbVkgPSB0aGlzLnRvcE9mZnNldCArIGkgKiAodGhpcy5zdHJpcEhlaWdodCArIHRoaXMuc3RyaXBHYXApfSApO1xuICAgICAgIHRoaXMuX2dlbm9tZXMgPSBncztcbiAgICB9XG4gICAgZ2V0IGdlbm9tZXMgKCkge1xuICAgICAgIHJldHVybiB0aGlzLl9nZW5vbWVzO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzIChzdHJpcGVzKSBpbiB0b3AtdG8tYm90dG9tIG9yZGVyLlxuICAgIC8vXG4gICAgZ2V0R2Vub21lWU9yZGVyICgpIHtcbiAgICAgICAgbGV0IHN0cmlwcyA9IHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoXCIuem9vbVN0cmlwXCIpO1xuICAgICAgICBsZXQgc3MgPSBzdHJpcHNbMF0ubWFwKGc9PiB7XG5cdCAgICBsZXQgYmIgPSBnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgcmV0dXJuIFtiYi55LCBnLl9fZGF0YV9fLmdlbm9tZS5uYW1lXTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBucyA9IHNzLnNvcnQoIChhLGIpID0+IGFbMF0gLSBiWzBdICkubWFwKCB4ID0+IHhbMV0gKVxuXHRyZXR1cm4gbnM7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNldHMgdGhlIHRvcC10by1ib3R0b20gb3JkZXIgb2YgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcyBhY2NvcmRpbmcgdG8gXG4gICAgLy8gdGhlIGdpdmVuIG5hbWUgbGlzdCBvZiBuYW1lcy4gQmVjYXVzZSB3ZSBjYW4ndCBndWFyYW50ZWUgdGhlIGdpdmVuIG5hbWVzIGNvcnJlc3BvbmRcbiAgICAvLyB0byBhY3R1YWwgem9vbSBzdHJpcHMsIG9yIHRoYXQgYWxsIHN0cmlwcyBhcmUgcmVwcmVzZW50ZWQsIGV0Yy5cbiAgICAvLyBUaGVyZWZvcmUsIHRoZSBsaXN0IGlzIHByZXByZWNlc3NlZCBhcyBmb2xsb3dzOlxuICAgIC8vICAgICAqIGR1cGxpY2F0ZSBuYW1lcywgaWYgdGhleSBleGlzdCwgYXJlIHJlbW92ZWRcbiAgICAvLyAgICAgKiBuYW1lcyB0aGF0IGRvIG5vdCBjb3JyZXNwb25kIHRvIGV4aXN0aW5nIHpvb21TdHJpcHMgYXJlIHJlbW92ZWRcbiAgICAvLyAgICAgKiBuYW1lcyBvZiBleGlzdGluZyB6b29tIHN0cmlwcyB0aGF0IGRvbid0IGFwcGVhciBpbiB0aGUgbGlzdCBhcmUgYWRkZWQgdG8gdGhlIGVuZFxuICAgIC8vIFRoZSByZXN1bHQgaXMgYSBsaXN0IG9mIG5hbWVzIHdpdGggdGhlc2UgcHJvcGVydGllczpcbiAgICAvLyAgICAgKiB0aGVyZSBpcyBhIDE6MSBjb3JyZXNwb25kZW5jZSBiZXR3ZWVuIG5hbWVzIGFuZCBhY3R1YWwgem9vbSBzdHJpcHNcbiAgICAvLyAgICAgKiB0aGUgbmFtZSBvcmRlciBpcyBjb25zaXN0ZW50IHdpdGggdGhlIGlucHV0IGxpc3RcbiAgICAvLyBUaGlzIGlzIHRoZSBsaXN0IHVzZWQgdG8gKHJlKW9yZGVyIHRoZSB6b29tIHN0cmlwcy5cbiAgICAvL1xuICAgIC8vIEdpdmVuIHRoZSBsaXN0IG9yZGVyOiBcbiAgICAvLyAgICAgKiBhIFktcG9zaXRpb24gaXMgYXNzaWduZWQgdG8gZWFjaCBnZW5vbWVcbiAgICAvLyAgICAgKiB6b29tIHN0cmlwcyB0aGF0IGFyZSBOT1QgQ1VSUkVOVExZIEJFSU5HIERSQUdHRUQgYXJlIHRyYW5zbGF0ZWQgdG8gdGhlaXIgbmV3IGxvY2F0aW9uc1xuICAgIC8vXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgbnMgKGxpc3Qgb2Ygc3RyaW5ncykgTmFtZXMgb2YgdGhlIGdlbm9tZXMuXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgICAgbm90aGluZ1xuICAgIC8vIFNpZGUgZWZmZWN0czpcbiAgICAvLyAgICAgUmVjYWxjdWxhdGVzIHRoZSBZLWNvb3JkaW5hdGVzIGZvciBlYWNoIHN0cmlwZSBiYXNlZCBvbiB0aGUgZ2l2ZW4gb3JkZXIsIHRoZW4gdHJhbnNsYXRlc1xuICAgIC8vICAgICBlYWNoIHN0cmlwIHRvIGl0cyBuZXcgcG9zaXRpb24uXG4gICAgLy9cbiAgICBzZXRHZW5vbWVZT3JkZXIgKG5zKSB7XG5cdHRoaXMuZ2Vub21lcyA9IHJlbW92ZUR1cHMobnMpLm1hcChuPT4gdGhpcy5hcHAubmFtZTJnZW5vbWVbbl0gKS5maWx0ZXIoeD0+eCk7XG4gICAgICAgIHRoaXMuZ2Vub21lcy5mb3JFYWNoKCAoZyxpKSA9PiB7XG5cdCAgICBsZXQgc3RyaXAgPSBkMy5zZWxlY3QoYCN6b29tVmlldyAuem9vbVN0cmlwW25hbWU9XCIke2cubmFtZX1cIl1gKTtcblx0ICAgIGlmICghc3RyaXAuY2xhc3NlZChcImRyYWdnaW5nXCIpKVxuXHQgICAgICAgIHN0cmlwLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwLCR7Zy56b29tWX0pYCk7XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBkcmFnZ2VyIChkMy5iZWhhdmlvci5kcmFnKSB0byBiZSBhdHRhY2hlZCB0byBlYWNoIHpvb20gc3RyaXAuXG4gICAgLy8gQWxsb3dzIHN0cmlwcyB0byBiZSByZW9yZGVyZWQgYnkgZHJhZ2dpbmcuXG4gICAgZ2V0RHJhZ2dlciAoKSB7ICBcbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBkMy5iZWhhdmlvci5kcmFnKClcblx0ICAub3JpZ2luKGZ1bmN0aW9uKGQsaSl7XG5cdCAgICAgIHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIH0pXG4gICAgICAgICAgLm9uKFwiZHJhZ3N0YXJ0LnpcIiwgZnVuY3Rpb24oZykge1xuXHQgICAgICBsZXQgdCA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50LnRhcmdldDtcblx0ICAgICAgaWYgKGQzLmV2ZW50LnNvdXJjZUV2ZW50LnNoaWZ0S2V5IHx8IGQzLnNlbGVjdCh0KS5hdHRyKFwibmFtZVwiKSAhPT0gJ3pvb21TdHJpcEhhbmRsZScpe1xuXHQgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICB9XG5cdCAgICAgIGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICBsZXQgc3RyaXAgPSB0aGlzLmNsb3Nlc3QoXCIuem9vbVN0cmlwXCIpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nID0gZDMuc2VsZWN0KHN0cmlwKS5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgdHJ1ZSk7XG5cdCAgfSlcblx0ICAub24oXCJkcmFnLnpcIiwgZnVuY3Rpb24gKGcpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIGxldCBteSA9IGQzLm1vdXNlKHNlbGYuc3ZnTWFpblswXVswXSlbMV07XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKDAsICR7bXl9KWApO1xuXHQgICAgICBzZWxmLnNldEdlbm9tZVlPcmRlcihzZWxmLmdldEdlbm9tZVlPcmRlcigpKTtcblx0ICAgICAgc2VsZi5oaWdobGlnaHQoKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWdlbmQuelwiLCBmdW5jdGlvbiAoZykge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgLy9cblx0ICAgICAgc2VsZi5kcmFnZ2luZy5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgZmFsc2UpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nID0gbnVsbDtcblx0ICAgICAgc2VsZi5zZXRHZW5vbWVZT3JkZXIoc2VsZi5nZXRHZW5vbWVZT3JkZXIoKSk7XG5cdCAgICAgIHNlbGYuYXBwLnNldENvbnRleHQoeyBnZW5vbWVzOiBzZWxmLmdldEdlbm9tZVlPcmRlcigpIH0pO1xuXHQgICAgICB3aW5kb3cuc2V0VGltZW91dCggc2VsZi5oaWdobGlnaHQuYmluZChzZWxmKSwgMjUwICk7XG5cdCAgfSlcblx0ICA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJCcnVzaGVzICgpIHtcblx0dGhpcy5yb290LnNlbGVjdEFsbChcImcuYnJ1c2hcIilcblx0ICAgIC5lYWNoKCBmdW5jdGlvbiAoYikge1xuXHQgICAgICAgIGIuYnJ1c2guY2xlYXIoKTtcblx0XHRkMy5zZWxlY3QodGhpcykuY2FsbChiLmJydXNoKTtcblx0ICAgIH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIGN1cnJlbnQgYnJ1c2ggY29vcmRpbmF0ZXMsIHRyYW5zbGF0ZWQgKGlmIG5lZWRlZCkgdG8gcmVmIGdlbm9tZSBjb29yZGluYXRlcy5cbiAgICBiYkdldFJlZkNvb3JkcyAoKSB7XG4gICAgICBsZXQgcmcgPSB0aGlzLmFwcC5yR2Vub21lO1xuICAgICAgbGV0IGJsayA9IHRoaXMuYnJ1c2hpbmc7XG4gICAgICBsZXQgZXh0ID0gYmxrLmJydXNoLmV4dGVudCgpO1xuICAgICAgbGV0IHIgPSB7IGNocjogYmxrLmNociwgc3RhcnQ6IGV4dFswXSwgZW5kOiBleHRbMV0sIGJsb2NrSWQ6YmxrLmJsb2NrSWQgfTtcbiAgICAgIGxldCB0ciA9IHRoaXMuYXBwLnRyYW5zbGF0b3I7XG4gICAgICBpZiggYmxrLmdlbm9tZSAhPT0gcmcgKSB7XG4gICAgICAgICAvLyB1c2VyIGlzIGJydXNoaW5nIGEgY29tcCBnZW5vbWVzIHNvIGZpcnN0IHRyYW5zbGF0ZVxuXHQgLy8gY29vcmRpbmF0ZXMgdG8gcmVmIGdlbm9tZVxuXHQgbGV0IHJzID0gdGhpcy5hcHAudHJhbnNsYXRvci50cmFuc2xhdGUoYmxrLmdlbm9tZSwgci5jaHIsIHIuc3RhcnQsIHIuZW5kLCByZyk7XG5cdCBpZiAocnMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cdCByID0gcnNbMF07XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgICByLmJsb2NrSWQgPSByZy5uYW1lO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHI7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGhhbmRsZXIgZm9yIHRoZSBzdGFydCBvZiBhIGJydXNoIGFjdGlvbiBieSB0aGUgdXNlciBvbiBhIGJsb2NrXG4gICAgYmJTdGFydCAoYmxrLGJFbHQpIHtcbiAgICAgIHRoaXMuYnJ1c2hpbmcgPSBibGs7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGhhbmRsZXIgZm9yIGJydXNoIG1vdGlvbi4gTWFpbiBqb2IgaXMgdG8gcmVmbGVjdCB0aGUgYnJ1c2hcbiAgICAvLyBpbiBwYXJhbGxlbCBhY3Jvc3MgdGhlIGdlbm9tZXMgaW4gdGhlIHZpZXcuIFRoZSBjdXJybnQgYnJ1c2ggZXh0ZW50IFxuICAgIC8vIGlzIHRyYW5zbGF0ZWQgKGlmIG5lY2Vzc2FyeSkgdG8gcmVmIGdlbm9tZSBzcGFjZS4gVGhlbiB0aG9zZVxuICAgIC8vIGNvb3JkaW5hdGVzIGFyZSB0cmFuc2xhdGVkIHRvIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUgc3BhY2UsIGFuZCB0aGUgYXBwcm9wcmlhdGVcbiAgICAvLyBicnVzaChlcykgdXBkYXRlZC5cbiAgICAvL1xuICAgIGJiQnJ1c2ggKCkge1xuICAgICAgbGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTsgLy8gdGhlIHJlZmVyZW5jZSBnZW5vbWVcbiAgICAgIGxldCBncyA9IFtyZ10uY29uY2F0KHRoaXMuYXBwLmNHZW5vbWVzKTsgLy8gYWxsIHRoZSBnZW5vbWVzIGluIHRoZSB2aWV3XG4gICAgICBsZXQgdHIgPSB0aGlzLmFwcC50cmFuc2xhdG9yOyAvLyBmb3IgdHJhbnNsYXRpbmcgY29vcmRzIGJldHdlZW4gZ2Vub21lc1xuICAgICAgbGV0IGJsayA9IHRoaXMuYnJ1c2hpbmc7IC8vIHRoZSBibG9jayBjdXJyZW5seSBiZWluZyBicnVzaGVkXG4gICAgICBsZXQgciA9IHRoaXMuYmJHZXRSZWZDb29yZHMoKTsgLy8gY3VycmVudCBicnVzaCBleHRlbnQsIGluIHJlZiBnZW5vbWUgc3BhY2VcbiAgICAgIGdzLmZvckVhY2goIGcgPT4ge1xuXHQgIC8vIGlmIGcgaXMgdGhlIHJlZkdlbm9tZSwgbm8gbmVlZCB0byB0cmFuc2xhdGUuIE90aGVyd2lzZSwgdHJhbnNsYXRlIGZyb20gXG5cdCAgLy8gcmVmIGdlbm9tZSB0byBjb21wYXJpc29uIGdlbm9tZSBnLlxuICAgICAgICAgIGxldCBycztcblx0ICBpZiAoZyA9PT0gcmcpIHtcblx0ICAgICAgci5ibG9ja0lkID0gcmcubmFtZTtcblx0ICAgICAgcnMgPSBbcl07XG5cdCAgfVxuXHQgIGVsc2Uge1xuXHQgICAgICBycyA9IHRyLnRyYW5zbGF0ZShyZywgci5jaHIsIHIuc3RhcnQsIHIuZW5kLCBnKTtcblx0ICB9XG5cdCAgLy8gbm90ZSB0aGF0IHRyYW5zbGF0ZWQgcmVzdWx0cyBpbmNsdWRlIGJsb2NrIGlkZW50aWZpZXJzLCB3aGljaCB0ZWxsXG5cdCAgLy8gdXMgdGhlIGJsb2NrIChhbmQgaGVuY2UsIGJydXNoZXMpIGluIHRoZSBkaXNwbGF5IHRvIHRhcmdldC5cblx0ICBycy5mb3JFYWNoKCByciA9PiB7XG5cdCAgICAgIGxldCBiYiA9IHRoaXMuc3ZnTWFpbi5zZWxlY3QoYC56b29tU3RyaXBbbmFtZT1cIiR7Zy5uYW1lfVwiXSAuc0Jsb2NrW25hbWU9XCIke3JyLmJsb2NrSWR9XCJdIC5icnVzaGApXG5cdCAgICAgIGJiLmVhY2goIGZ1bmN0aW9uKGIpIHtcblx0ICAgICAgICAgIGIuYnJ1c2guZXh0ZW50KFtyci5zdGFydCwgcnIuZW5kXSk7XG5cdFx0ICBkMy5zZWxlY3QodGhpcykuY2FsbChiLmJydXNoKTtcblx0ICAgICAgfSk7XG5cdCAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYmJFbmQgKCkge1xuICAgICAgbGV0IHNlID0gZDMuZXZlbnQuc291cmNlRXZlbnQ7XG4gICAgICBsZXQgeHQgPSB0aGlzLmJydXNoaW5nLmJydXNoLmV4dGVudCgpO1xuICAgICAgbGV0IHIgPSB0aGlzLmJiR2V0UmVmQ29vcmRzKCk7XG4gICAgICB0aGlzLmJydXNoaW5nID0gbnVsbDtcbiAgICAgIC8vXG4gICAgICBpZiAoc2UuY3RybEtleSB8fCBzZS5hbHRLZXkgfHwgc2UubWV0YUtleSkge1xuXHQgIHRoaXMuY2xlYXJCcnVzaGVzKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy9cbiAgICAgIGxldCBjYyAgICAgICAgPSB0aGlzLmFwcC5jb29yZHM7IC8vIGN1cnJlbnQgY29vcmRpbmF0ZXNcbiAgICAgIGxldCBjdXJyV2lkdGggPSBjYy5lbmQgLSBjYy5zdGFydCArIDE7XG4gICAgICBsZXQgbWlkICAgICAgID0gKGNjLnN0YXJ0ICsgY2MuZW5kKS8yO1xuICAgICAgbGV0IGR4ICAgICAgICA9IChyLnN0YXJ0ICsgci5lbmQpLzIgLSBtaWQ7XG4gICAgICBsZXQgYnJ1c2hXaWR0aD0gci5lbmQgLSByLnN0YXJ0ICsgMTtcbiAgICAgIGxldCB6ZmFjdG9yICAgPSAoTWF0aC5hYnMoeHRbMF0gLSB4dFsxXSkgPD0gMTApID8gMSA6IGJydXNoV2lkdGggLyBjdXJyV2lkdGg7XG4gICAgICBzZS5zaGlmdEtleSAmJiAoemZhY3RvciA9IDEvemZhY3Rvcik7XG4gICAgICB0aGlzLmFwcC5wYW56b29tKGR4L2N1cnJXaWR0aCwgemZhY3Rvcik7XG4gICAgfVxuXG4gICAgeGJiRW5kICgpIHtcbiAgICAgIGxldCB4dCA9IHRoaXMuYnJ1c2hpbmcuYnJ1c2guZXh0ZW50KCk7XG4gICAgICBsZXQgciA9IHRoaXMuYmJHZXRSZWZDb29yZHMoKTtcbiAgICAgIHRoaXMuYnJ1c2hpbmcgPSBudWxsO1xuICAgICAgLy9cbiAgICAgIGxldCBzZSA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50O1xuICAgICAgaWYgKHNlLmN0cmxLZXkgfHwgc2UuYWx0S2V5IHx8IHNlLm1ldGFLZXkpIHtcblx0ICB0aGlzLmNsZWFyQnJ1c2hlcygpO1xuXHQgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vXG4gICAgICBpZiAoTWF0aC5hYnMoeHRbMF0gLSB4dFsxXSkgPD0gMTApe1xuXHQgIC8vIHVzZXIgY2xpY2tlZCBpbnN0ZWFkIG9mIGRyYWdnZWQuIFJlY2VudGVyIHRoZSB2aWV3IGluc3RlYWQgb2Ygem9vbWluZy5cblx0ICBsZXQgY3h0ID0gdGhpcy5hcHAuZ2V0Q29udGV4dCgpO1xuXHQgIGxldCB3ID0gY3h0LmVuZCAtIGN4dC5zdGFydCArIDE7XG5cdCAgci5zdGFydCAtPSB3LzI7XG5cdCAgci5lbmQgKz0gdy8yO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoc2Uuc2hpZnRLZXkpIHtcblx0ICAvLyB6b29tIG91dFxuXHQgIGxldCBjdXJyV2lkdGggPSB0aGlzLmNvb3Jkcy5lbmQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDE7XG5cdCAgbGV0IGJydXNoV2lkdGggPSByLmVuZCAtIHIuc3RhcnQgKyAxO1xuXHQgIGxldCBmYWN0b3IgPSBjdXJyV2lkdGggLyBicnVzaFdpZHRoO1xuXHQgIGxldCBuZXdXaWR0aCA9IGZhY3RvciAqIGN1cnJXaWR0aDtcblx0ICBsZXQgZHMgPSAoKHIuc3RhcnQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDEpL2N1cnJXaWR0aCkgKiBuZXdXaWR0aDtcblx0ICByLnN0YXJ0ID0gdGhpcy5jb29yZHMuc3RhcnQgLSBkcztcblx0ICByLmVuZCA9IHIuc3RhcnQgKyBuZXdXaWR0aCAtIDE7XG4gICAgICB9XG4gICAgICB0aGlzLmFwcC5zZXRDb250ZXh0KHIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWdobGlnaHRTdHJpcCAoZywgZWx0KSB7XG5cdGlmIChnID09PSB0aGlzLmN1cnJlbnRITEcpIHJldHVybjtcblx0dGhpcy5jdXJyZW50SExHID0gZztcblx0Ly9cblx0dGhpcy5zdmdNYWluLnNlbGVjdEFsbCgnLnpvb21TdHJpcCcpXG5cdCAgICAuY2xhc3NlZChcImhpZ2hsaWdodGVkXCIsIGQgPT4gZC5nZW5vbWUgPT09IGcpO1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0QWxsKCcuem9vbVN0cmlwSGFuZGxlJylcblx0ICAgIC5jbGFzc2VkKFwiaGlnaGxpZ2h0ZWRcIiwgZCA9PiBkLmdlbm9tZSA9PT0gZyk7XG5cdHRoaXMuYXBwLnNob3dCbG9ja3MoZyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyB0aGUgWm9vbVZpZXcgdG8gc2hvdyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSByZWcgZ2Vub21lIGFuZCB0aGUgY29ycmVzcG9uZGluZ1xuICAgIC8vIHJhbmdlKHMpIGluIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy9cbiAgICB1cGRhdGVWaWFNYXBwZWRDb29yZGluYXRlcyAoY29vcmRzKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0bGV0IGMgPSAoY29vcmRzIHx8IHRoaXMuYXBwLmNvb3Jkcyk7XG5cdGQzLnNlbGVjdChcIiN6b29tQ29vcmRzXCIpWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCk7XG5cdGQzLnNlbGVjdChcIiN6b29tV1NpemVcIilbMF1bMF0udmFsdWUgPSBNYXRoLnJvdW5kKGMuZW5kIC0gYy5zdGFydCArIDEpXG5cdC8vXG4gICAgICAgIGxldCBtZ3YgPSB0aGlzLmFwcDtcblx0Ly8gd2hlbiB0aGUgdHJhbnNsYXRvciBpcyByZWFkeSwgd2UgY2FuIHRyYW5zbGF0ZSB0aGUgcmVmIGNvb3JkcyB0byBlYWNoIGdlbm9tZSBhbmRcblx0Ly8gaXNzdWUgcmVxdWVzdHMgdG8gbG9hZCB0aGUgZmVhdHVyZXMgaW4gdGhvc2UgcmVnaW9ucy5cblx0bWd2LnRyYW5zbGF0b3IucmVhZHkoKS50aGVuKGZ1bmN0aW9uKCl7XG5cdCAgICAvLyBOb3cgaXNzdWUgcmVxdWVzdHMgZm9yIGZlYXR1cmVzLiBPbmUgcmVxdWVzdCBwZXIgZ2Vub21lLCBlYWNoIHJlcXVlc3Qgc3BlY2lmaWVzIG9uZSBvciBtb3JlXG5cdCAgICAvLyBjb29yZGluYXRlIHJhbmdlcy5cblx0ICAgIC8vIFdhaXQgZm9yIGFsbCB0aGUgZGF0YSB0byBiZWNvbWUgYXZhaWxhYmxlLCB0aGVuIGRyYXcuXG5cdCAgICAvL1xuXHQgICAgbGV0IHByb21pc2VzID0gW107XG5cblx0ICAgIC8vIEZpcnN0IHJlcXVlc3QgaXMgZm9yIHRoZSB0aGUgcmVmZXJlbmNlIGdlbm9tZS4gR2V0IGFsbCB0aGUgZmVhdHVyZXMgaW4gdGhlIHJhbmdlLlxuXHQgICAgcHJvbWlzZXMucHVzaChtZ3YuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXMobWd2LnJHZW5vbWUsIFt7XG5cdFx0Ly8gTmVlZCB0byBzaW11bGF0ZSB0aGUgcmVzdWx0cyBmcm9tIGNhbGxpbmcgdGhlIHRyYW5zbGF0b3IuIFxuXHRcdC8vIFxuXHRcdGNociAgICA6IGMuY2hyLFxuXHRcdHN0YXJ0ICA6IGMuc3RhcnQsXG5cdFx0ZW5kICAgIDogYy5lbmQsXG5cdFx0aW5kZXggIDogMCxcblx0XHRmQ2hyICAgOiBjLmNocixcblx0XHRmU3RhcnQgOiBjLnN0YXJ0LFxuXHRcdGZFbmQgICA6IGMuZW5kLFxuXHRcdGZJbmRleCAgOiAwLFxuXHRcdG9yaSAgICA6IFwiK1wiLFxuXHRcdGJsb2NrSWQ6IG1ndi5yR2Vub21lLm5hbWVcblx0XHR9XSkpO1xuXHQgICAgaWYgKCEgc2VsZi5yb290LmNsYXNzZWQoXCJjbG9zZWRcIikpIHtcblx0XHQvLyBBZGQgYSByZXF1ZXN0IGZvciBlYWNoIGNvbXBhcmlzb24gZ2Vub21lLCB1c2luZyB0cmFuc2xhdGVkIGNvb3JkaW5hdGVzLiBcblx0XHRtZ3YuY0dlbm9tZXMuZm9yRWFjaChjR2Vub21lID0+IHtcblx0XHQgICAgbGV0IHJhbmdlcyA9IG1ndi50cmFuc2xhdG9yLnRyYW5zbGF0ZSggbWd2LnJHZW5vbWUsIGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCwgY0dlbm9tZSApO1xuXHRcdCAgICBsZXQgcCA9IG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhjR2Vub21lLCByYW5nZXMpO1xuXHRcdCAgICBwcm9taXNlcy5wdXNoKHApO1xuXHRcdH0pO1xuXHQgICAgfVxuXHQgICAgLy8gd2hlbiBldmVyeXRoaW5nIGlzIHJlYWR5LCBjYWxsIHRoZSBkcmF3IGZ1bmN0aW9uXG5cdCAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbiggZGF0YSA9PiB7XG5cdCAgICAgICAgc2VsZi5kcmF3KGRhdGEpO1xuICAgICAgICAgICAgfSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLyBVcGRhdGVzIHRoZSBab29tVmlldyB0byBzaG93IHRoZSByZWdpb24gYXJvdW5kIGEgbGFuZG1hcmsgaW4gZWFjaCBnZW5vbWUuXG4gICAgLy9cbiAgICAvLyBjb29yZHMgPSB7XG4gICAgLy8gICAgIGxhbmRtYXJrIDogaWQgb2YgYSBmZWF0dXJlIHRvIHVzZSBhcyBhIHJlZmVyZW5jZVxuICAgIC8vICAgICBmbGFua3x3aWR0aCA6IHNwZWNpZnkgb25lIG9mIGZsYW5rIG9yIHdpZHRoLiBcbiAgICAvLyAgICAgICAgIGZsYW5rID0gYW1vdW50IG9mIGZsYW5raW5nIHJlZ2lvbiAoYnApIHRvIGluY2x1ZGUgYXQgYm90aCBlbmRzIG9mIHRoZSBsYW5kbWFyaywgXG4gICAgLy8gICAgICAgICBzbyB0aGUgdG90YWwgdmlld2luZyByZWdpb24gPSBmbGFuayArIGxlbmd0aChsYW5kbWFyaykgKyBmbGFuay5cbiAgICAvLyAgICAgICAgIHdpZHRoID0gdG90YWwgdmlld2luZyByZWdpb24gd2lkdGguIElmIGJvdGggd2lkdGggYW5kIGZsYW5rIGFyZSBzcGVjaWZpZWQsIGZsYW5rIGlzIGlnbm9yZWQuXG4gICAgLy8gICAgIGRlbHRhIDogYW1vdW50IHRvIHNoaWZ0IHRoZSB2aWV3IGxlZnQvcmlnaHRcbiAgICAvLyB9XG4gICAgLy8gXG4gICAgLy8gVGhlIGxhbmRtYXJrIG11c3QgZXhpc3QgaW4gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZS4gXG4gICAgLy9cbiAgICB1cGRhdGVWaWFMYW5kbWFya0Nvb3JkaW5hdGVzIChjb29yZHMpIHtcblx0bGV0IGMgPSBjb29yZHM7XG5cdGxldCBtZ3YgPSB0aGlzLmFwcDtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgcmYgPSBjb29yZHMubGFuZG1hcmtSZWZGZWF0O1xuXHRsZXQgZmVhdHMgPSBjb29yZHMubGFuZG1hcmtGZWF0cztcblx0aWYgKHRoaXMucm9vdC5jbGFzc2VkKCdjbG9zZWQnKSlcblx0ICAgIGZlYXRzID0gZmVhdHMuZmlsdGVyKGYgPT4gZi5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpO1xuXHRsZXQgZGVsdGEgPSBjb29yZHMuZGVsdGEgfHwgMDtcblx0Ly8gY29tcHV0ZSByYW5nZXMgYXJvdW5kIGxhbmRtYXJrIGluIGVhY2ggZ2Vub21lXG5cdGxldCByYW5nZXMgPSBmZWF0cy5tYXAoZiA9PiB7XG5cdCAgICBsZXQgZmxhbmsgPSBjLmxlbmd0aCA/IChjLmxlbmd0aCAtIGYubGVuZ3RoKSAvIDIgOiBjLmZsYW5rO1xuXHQgICAgbGV0IHJhbmdlID0ge1xuXHRcdGdlbm9tZTpcdGYuZ2Vub21lLFxuXHRcdGNocjpcdGYuY2hyLFxuXHRcdHN0YXJ0Olx0TWF0aC5yb3VuZChmLnN0YXJ0IC0gZmxhbmsgKyBkZWx0YSksXG5cdFx0ZW5kOlx0TWF0aC5yb3VuZChmLmVuZCArIGZsYW5rICsgZGVsdGEpXG5cdCAgICB9IDtcblx0ICAgIGlmIChmLmdlbm9tZSA9PT0gbWd2LnJHZW5vbWUpIHtcblx0XHRsZXQgYyA9IHRoaXMuYXBwLmNvb3JkcyA9IHJhbmdlO1xuXHRcdGQzLnNlbGVjdChcIiN6b29tQ29vcmRzXCIpWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCk7XG5cdFx0ZDMuc2VsZWN0KFwiI3pvb21XU2l6ZVwiKVswXVswXS52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSlcblx0ICAgIH1cblx0ICAgIHJldHVybiByYW5nZTtcblx0fSk7XG5cdGxldCBzZWVuR2Vub21lcyA9IG5ldyBTZXQoKTtcblx0bGV0IHJDb29yZHM7XG5cdC8vIEdldCAocHJvbWlzZXMgZm9yKSB0aGUgZmVhdHVyZXMgaW4gZWFjaCByYW5nZS5cblx0bGV0IHByb21pc2VzID0gcmFuZ2VzLm1hcChyID0+IHtcbiAgICAgICAgICAgIGxldCBycnM7XG5cdCAgICBzZWVuR2Vub21lcy5hZGQoci5nZW5vbWUpO1xuXHQgICAgaWYgKHIuZ2Vub21lID09PSBtZ3Yuckdlbm9tZSl7XG5cdFx0Ly8gdGhlIHJlZiBnZW5vbWUgcmFuZ2Vcblx0XHRyQ29vcmRzID0gcjtcblx0ICAgICAgICBycnMgPSBbe1xuXHRcdCAgICBjaHIgICAgOiByLmNocixcblx0XHQgICAgc3RhcnQgIDogci5zdGFydCxcblx0XHQgICAgZW5kICAgIDogci5lbmQsXG5cdFx0ICAgIGluZGV4ICA6IDAsXG5cdFx0ICAgIGZDaHIgICA6IHIuY2hyLFxuXHRcdCAgICBmU3RhcnQgOiByLnN0YXJ0LFxuXHRcdCAgICBmRW5kICAgOiByLmVuZCxcblx0XHQgICAgZkluZGV4ICA6IDAsXG5cdFx0ICAgIG9yaSAgICA6IFwiK1wiLFxuXHRcdCAgICBibG9ja0lkOiBtZ3Yuckdlbm9tZS5uYW1lXG5cdFx0fV07XG5cdCAgICB9XG5cdCAgICBlbHNlIHsgXG5cdFx0Ly8gdHVybiB0aGUgc2luZ2xlIHJhbmdlIGludG8gYSByYW5nZSBmb3IgZWFjaCBvdmVybGFwcGluZyBzeW50ZW55IGJsb2NrIHdpdGggdGhlIHJlZiBnZW5vbWVcblx0ICAgICAgICBycnMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUoci5nZW5vbWUsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgbWd2LnJHZW5vbWUsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhyLmdlbm9tZSwgcnJzKTtcblx0fSk7XG5cdC8vIEZvciBlYWNoIGdlbm9tZSB3aGVyZSB0aGUgbGFuZG1hcmsgZG9lcyBub3QgZXhpc3QsIGNvbXB1dGUgYSBtYXBwZWQgcmFuZ2UgKGFzIGluIG1hcHBlZCBjbW9kZSkuXG5cdGlmICghdGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgbWd2LmNHZW5vbWVzLmZvckVhY2goZyA9PiB7XG5cdFx0aWYgKCEgc2Vlbkdlbm9tZXMuaGFzKGcpKSB7XG5cdFx0ICAgIGxldCBycnMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUobWd2LnJHZW5vbWUsIHJDb29yZHMuY2hyLCByQ29vcmRzLnN0YXJ0LCByQ29vcmRzLmVuZCwgZyk7XG5cdFx0ICAgIHByb21pc2VzLnB1c2goIG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhnLCBycnMpICk7XG5cdFx0fVxuXHQgICAgfSk7XG5cdC8vIFdoZW4gYWxsIHRoZSBkYXRhIGlzIHJlYWR5LCBkcmF3LlxuXHRQcm9taXNlLmFsbChwcm9taXNlcykudGhlbiggZGF0YSA9PiB7XG5cdCAgICBzZWxmLmRyYXcoZGF0YSk7XG5cdH0pO1xuICAgIH1cbiAgICAvL1xuICAgIHVwZGF0ZSAoKSB7XG5cdGlmICh0aGlzLmFwcC5jbW9kZSA9PT0gJ21hcHBlZCcpXG5cdCAgICB0aGlzLnVwZGF0ZVZpYU1hcHBlZENvb3JkaW5hdGVzKHRoaXMuYXBwLmNvb3Jkcyk7XG5cdGVsc2Vcblx0ICAgIHRoaXMudXBkYXRlVmlhTGFuZG1hcmtDb29yZGluYXRlcyh0aGlzLmFwcC5sY29vcmRzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBvcmRlclNCbG9ja3MgKHNibG9ja3MpIHtcblx0Ly8gU29ydCB0aGUgc2Jsb2NrcyBpbiBlYWNoIHN0cmlwIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBkcmF3aW5nIG1vZGUuXG5cdGxldCBjbXBGaWVsZCA9IHRoaXMuZG1vZGUgPT09ICdjb21wYXJpc29uJyA/ICdpbmRleCcgOiAnZkluZGV4Jztcblx0bGV0IGNtcEZ1bmMgPSAoYSxiKSA9PiBhLl9fZGF0YV9fW2NtcEZpZWxkXS1iLl9fZGF0YV9fW2NtcEZpZWxkXTtcblx0c2Jsb2Nrcy5mb3JFYWNoKCBzdHJpcCA9PiBzdHJpcC5zb3J0KCBjbXBGdW5jICkgKTtcblx0Ly8gcGl4ZWxzIHBlciBiYXNlXG5cdGxldCBwcGIgPSB0aGlzLndpZHRoIC8gKHRoaXMuYXBwLmNvb3Jkcy5lbmQgLSB0aGlzLmFwcC5jb29yZHMuc3RhcnQgKyAxKTtcblx0bGV0IHBzdGFydCA9IFtdOyAvLyBvZmZzZXQgKGluIHBpeGVscykgb2Ygc3RhcnQgcG9zaXRpb24gb2YgbmV4dCBibG9jaywgYnkgc3RyaXAgaW5kZXggKDA9PT1yZWYpXG5cdGxldCBic3RhcnQgPSBbXTsgLy8gYmxvY2sgc3RhcnQgcG9zIChpbiBicCkgYXNzb2Mgd2l0aCBwc3RhcnRcblx0bGV0IGNjaHIgPSBudWxsO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCBkeDtcblx0bGV0IHBlbmQ7XG5cdHNibG9ja3MuZWFjaCggZnVuY3Rpb24gKGIsaSxqKSB7IC8vIGI9YmxvY2ssIGk9aW5kZXggd2l0aGluIHN0cmlwLCBqPXN0cmlwIGluZGV4XG5cdCAgICBsZXQgYmxlbiA9IHBwYiAqIChiLmVuZCAtIGIuc3RhcnQgKyAxKTsgLy8gdG90YWwgc2NyZWVuIHdpZHRoIG9mIHRoaXMgc2Jsb2NrXG5cdCAgICBiLmZsaXAgPSBiLm9yaSA9PT0gJy0nICYmIHNlbGYuZG1vZGUgPT09ICdyZWZlcmVuY2UnO1xuXHQgICAgYi54c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW2Iuc3RhcnQsIGIuZW5kXSkucmFuZ2UoIGIuZmxpcCA/IFtibGVuLCAwXSA6IFswLCBibGVuXSApO1xuXHQgICAgLy9cblx0ICAgIGlmIChpPT09MCkge1xuXHRcdC8vIGZpcnN0IGJsb2NrIGluIGVhY2ggc3RyaXAgaW5pdHNcblx0XHRwc3RhcnRbal0gPSAwO1xuXHRcdGJzdGFydFtqXSA9IGIuc3RhcnQ7XG5cdFx0ZHggPSAwO1xuXHRcdGNjaHIgPSBiLmNocjtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHRcdGR4ID0gYi5jaHIgPT09IGNjaHIgPyBwc3RhcnRbal0gKyBwcGIgKiAoYi5zdGFydCAtIGJzdGFydFtqXSkgOiBJbmZpbml0eTtcblx0XHRpZiAoZHggPiBzZWxmLndpZHRoKSB7XG5cdFx0ICAgIC8vIENoYW5nZWQgY2hyIG9yIGp1bXBlZCBhIGxhcmdlIGdhcFxuXHRcdCAgICBwc3RhcnRbal0gPSBwZW5kICsgNjtcblx0XHQgICAgYnN0YXJ0W2pdID0gYi5zdGFydDtcblx0XHQgICAgZHggPSBwc3RhcnRbal07XG5cdFx0fVxuXHQgICAgfVxuXHQgICAgZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke2R4fSwwKWApO1xuXHQgICAgcGVuZCA9IGR4ICsgYmxlbjtcblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIHpvb20gdmlldyBwYW5lbCB3aXRoIHRoZSBnaXZlbiBkYXRhLlxuICAgIC8vXG4gICAgLy8gRGF0YSBpcyBzdHJ1Y3R1cmVkIGFzIGZvbGxvd3M6XG4gICAgLy8gICAgIGRhdGEgPSBbIHpvb21TdHJpcF9kYXRhIF1cbiAgICAvLyAgICAgem9vbVN0cmlwX2RhdGEgPSB7IGdlbm9tZSBbIHpvb21CbG9ja19kYXRhIF0gfVxuICAgIC8vICAgICB6b29tQmxvY2tfZGF0YSA9IHsgeHNjYWxlLCBjaHIsIHN0YXJ0LCBlbmQsIGZDaHIsIGZTdGFydCwgZkVuZCwgb3JpLCBbIGZlYXR1cmVfZGF0YSBdIH1cbiAgICAvLyAgICAgZmVhdHVyZV9kYXRhID0geyBtZ3BpZCwgbWdpaWQsIHN5bWJvbCwgY2hyLCBzdGFydCwgZW5kLCBzdHJhbmQsIHR5cGUsIGJpb3R5cGUgfVxuICAgIC8vXG4gICAgLy8gQWdhaW4sIGluIEVuZ2xpc2g6XG4gICAgLy8gIC0gZGF0YSBpcyBhIGxpc3Qgb2YgaXRlbXMsIG9uZSBwZXIgc3RyaXAgdG8gYmUgZGlzcGxheWVkLiBJdGVtWzBdIGlzIGRhdGEgZm9yIHRoZSByZWYgZ2Vub21lLlxuICAgIC8vICAgIEl0ZW1zWzErXSBhcmUgZGF0YSBmb3IgdGhlIGNvbXBhcmlzb24gZ2Vub21lLlxuICAgIC8vICAtIGVhY2ggc3RyaXAgaXRlbSBpcyBhbiBvYmplY3QgY29udGFpbmluZyBhIGdlbm9tZSBhbmQgYSBsaXN0IG9mIGJsb2Nrcy4gSXRlbVswXSBhbHdheXMgaGFzIFxuICAgIC8vICAgIGEgc2luZ2xlIGJsb2NrLlxuICAgIC8vICAtIGVhY2ggYmxvY2sgaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBjaHJvbW9zb21lLCBzdGFydCwgZW5kLCBvcmllbnRhdGlvbiwgZXRjLCBhbmQgYSBsaXN0IG9mIGZlYXR1cmVzLlxuICAgIC8vICAtIGVhY2ggZmVhdHVyZSBoYXMgY2hyLHN0YXJ0LGVuZCxzdHJhbmQsdHlwZSxiaW90eXBlLG1ncGlkXG4gICAgLy9cbiAgICBkcmF3IChkYXRhKSB7XG5cdC8vIFxuXHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0bGV0IGNsb3NlZCA9IHRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIpO1xuXG5cdC8vIHJlc2V0IHRoZSBzdmcgc2l6ZSBiYXNlZCBvbiBudW1iZXIgb2Ygc3RyaXBzXG5cdGxldCB0b3RhbEhlaWdodCA9ICh0aGlzLnN0cmlwSGVpZ2h0K3RoaXMuc3RyaXBHYXApICogZGF0YS5sZW5ndGggKyAxMjtcblx0dGhpcy5zdmdcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRvdGFsSGVpZ2h0KTtcblxuXHQvLyBEcmF3IHRoZSB0aXRsZSBvbiB0aGUgem9vbXZpZXcgcG9zaXRpb24gY29udHJvbHNcblx0ZDMuc2VsZWN0KFwiI3pvb21WaWV3IC56b29tQ29vcmRzIGxhYmVsXCIpXG5cdCAgICAudGV4dCh0aGlzLmFwcC5yR2Vub21lLmxhYmVsICsgXCIgY29vcmRzXCIpO1xuXHRcblx0Ly8gdGhlIHJlZmVyZW5jZSBnZW5vbWUgYmxvY2sgKGFsd2F5cyBqdXN0IDEgb2YgdGhlc2UpLlxuXHRsZXQgckRhdGEgPSBkYXRhLmZpbHRlcihkZCA9PiBkZC5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpWzBdO1xuXHRsZXQgckJsb2NrID0gckRhdGEuYmxvY2tzWzBdO1xuXG5cdC8vIHgtc2NhbGUgYW5kIHgtYXhpcyBiYXNlZCBvbiB0aGUgcmVmIGdlbm9tZSBkYXRhLlxuXHR0aGlzLnhzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdCAgICAuZG9tYWluKFtyQmxvY2suc3RhcnQsckJsb2NrLmVuZF0pXG5cdCAgICAucmFuZ2UoWzAsdGhpcy53aWR0aF0pO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIGRyYXcgdGhlIGF4aXNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0dGhpcy5heGlzRnVuYyA9IGQzLnN2Zy5heGlzKClcblx0ICAgIC5zY2FsZSh0aGlzLnhzY2FsZSlcblx0ICAgIC5vcmllbnQoXCJ0b3BcIilcblx0ICAgIC5vdXRlclRpY2tTaXplKDApXG5cdCAgICAudGlja3MoNSlcblx0ICAgIDtcblx0dGhpcy5heGlzLmNhbGwodGhpcy5heGlzRnVuYyk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gem9vbSBzdHJpcHMgKG9uZSBwZXIgZ2Vub21lKVxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBsZXQgenN0cmlwcyA9IHRoaXMuc3RyaXBzR3JwXG5cdCAgICAgICAgLnNlbGVjdEFsbChcImcuem9vbVN0cmlwXCIpXG5cdFx0LmRhdGEoZGF0YSwgZCA9PiBkLmdlbm9tZS5uYW1lKTtcblx0bGV0IG5ld3pzID0genN0cmlwcy5lbnRlcigpXG5cdCAgICAgICAgLmFwcGVuZChcImdcIilcblx0XHQuYXR0cihcImNsYXNzXCIsXCJ6b29tU3RyaXBcIilcblx0XHQuYXR0cihcIm5hbWVcIiwgZCA9PiBkLmdlbm9tZS5uYW1lKVxuXHRcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChnKSB7XG5cdFx0ICAgIHNlbGYuaGlnaGxpZ2h0U3RyaXAoZy5nZW5vbWUsIHRoaXMpO1xuXHRcdH0pXG5cdFx0LmNhbGwodGhpcy5kcmFnZ2VyKVxuXHRcdDtcblx0bmV3enMuYXBwZW5kKFwidGV4dFwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIFwiZ2Vub21lTGFiZWxcIilcblx0ICAgIC50ZXh0KCBkID0+IGQuZ2Vub21lLmxhYmVsKVxuXHQgICAgLmF0dHIoXCJ4XCIsIDApXG5cdCAgICAuYXR0cihcInlcIiwgdGhpcy5ibG9ja0hlaWdodC8yICsgMjApXG5cdCAgICAuYXR0cihcImZvbnQtZmFtaWx5XCIsXCJzYW5zLXNlcmlmXCIpXG5cdCAgICAuYXR0cihcImZvbnQtc2l6ZVwiLCAxMClcblx0ICAgIDtcblx0bmV3enMuYXBwZW5kKFwiZ1wiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIFwic0Jsb2Nrc1wiKTtcblx0bmV3enMuYXBwZW5kKFwicmVjdFwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIFwiem9vbVN0cmlwSGFuZGxlXCIpXG5cdCAgICAuYXR0cihcInhcIiwgLTE1KVxuXHQgICAgLmF0dHIoXCJ5XCIsIC10aGlzLmJsb2NrSGVpZ2h0IC8gMilcblx0ICAgIC5hdHRyKFwid2lkdGhcIiwgMTUpXG5cdCAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLmJsb2NrSGVpZ2h0KVxuXHQgICAgO1xuXG5cdHpzdHJpcHNcblx0ICAgIC5jbGFzc2VkKFwicmVmZXJlbmNlXCIsIGQgPT4gZC5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpXG5cdCAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBnID0+IGB0cmFuc2xhdGUoMCwke2Nsb3NlZCA/IHRoaXMudG9wT2Zmc2V0IDogZy5nZW5vbWUuem9vbVl9KWApXG5cdCAgICA7XG5cbiAgICAgICAgenN0cmlwcy5leGl0KClcblx0ICAgIC5vbihcIi5kcmFnXCIsIG51bGwpXG5cdCAgICAucmVtb3ZlKCk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gc3ludGVueSBibG9ja3MuIEVhY2ggem9vbSBzdHJpcCBoYXMgYSBsaXN0IG9mIDEgb3IgbW9yZSBzYmxvY2tzLlxuXHQvLyBUaGUgcmVmZXJlbmNlIGdlbm9tZSBhbHdheXMgaGFzIGp1c3QgMS4gVGhlIGNvbXAgZ2Vub21lcyBtYW55IGhhdmVcblx0Ly8gMSBvciBtb3JlIChhbmQgaW4gcmFyZSBjYXNlcywgMCkuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGxldCB1bmlxaWZ5ID0gYmxvY2tzID0+IHtcblx0ICAgIC8vIGhlbHBlciBmdW5jdGlvbi4gV2hlbiBzYmxvY2sgcmVsYXRpb25zaGlwIGJldHdlZW4gZ2Vub21lcyBpcyBjb25mdXNlZCwgcmVxdWVzdGluZyBvbmVcblx0ICAgIC8vIHJlZ2lvbiBpbiBnZW5vbWUgQSBjYW4gZW5kIHVwIHJlcXVlc3RpbmcgdGhlIHNhbWUgcmVnaW9uIGluIGdlbm9tZSBCIHR3aWNlLiBUaGlzIGZ1bmN0aW9uXG5cdCAgICAvLyBhdm9pZHMgZHJhd2luZyB0aGUgc2FtZSBzYmxvY2sgdHdpY2UuIChOQjogUmVhbGx5IG5vdCBzdXJlIHdoZXJlIHRoaXMgY2hlY2sgaXMgYmVzdCBkb25lLlxuXHQgICAgLy8gQ291bGQgcHVzaCBpdCBmYXJ0aGVyIHVwc3RyZWFtLilcblx0ICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuXHQgICAgcmV0dXJuIGJsb2Nrcy5maWx0ZXIoIGIgPT4geyBcblx0ICAgICAgICBpZiAoc2Vlbi5oYXMoYi5pbmRleCkpIHJldHVybiBmYWxzZTtcblx0XHRzZWVuLmFkZChiLmluZGV4KTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0ICAgIH0pO1xuXHR9O1xuICAgICAgICBsZXQgc2Jsb2NrcyA9IHpzdHJpcHMuc2VsZWN0KCdbbmFtZT1cInNCbG9ja3NcIl0nKS5zZWxlY3RBbGwoJ2cuc0Jsb2NrJylcblx0ICAgIC5kYXRhKGQgPT4ge1xuXHQgICAgICAgIHJldHVybiB1bmlxaWZ5KGQuYmxvY2tzKTtcblx0ICAgIH0sIGIgPT4gYi5ibG9ja0lkKTtcblx0bGV0IG5ld3NicyA9IHNibG9ja3MuZW50ZXIoKVxuXHQgICAgLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgYiA9PiBcInNCbG9jayBcIiArIFxuXHQgICAgICAgIChiLm9yaT09PVwiK1wiID8gXCJwbHVzXCIgOiBiLm9yaT09PVwiLVwiID8gXCJtaW51c1wiOiBcImNvbmZ1c2VkXCIpICsgXG5cdFx0KGIuY2hyICE9PSBiLmZDaHIgPyBcIiB0cmFuc2xvY2F0aW9uXCIgOiBcIlwiKSlcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBiPT5iLmluZGV4KVxuXHQgICAgO1xuXHRsZXQgbDAgPSBuZXdzYnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLCBcImxheWVyMFwiKTtcblx0bGV0IGwxID0gbmV3c2JzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIiwgXCJsYXllcjFcIik7XG5cblx0Ly8gcmVjdGFuZ2xlIGZvciB0aGUgd2hvbGUgYmxvY2tcblx0bDAuYXBwZW5kKFwicmVjdFwiKS5hdHRyKFwiY2xhc3NcIiwgXCJibG9ja1wiKTtcblx0Ly8gdGhlIGF4aXMgbGluZVxuXHRsMC5hcHBlbmQoXCJsaW5lXCIpLmF0dHIoXCJjbGFzc1wiLFwiYXhpc1wiKSA7XG5cdC8vIGxhYmVsXG5cdGwwLmFwcGVuZChcInRleHRcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImJsb2NrTGFiZWxcIikgO1xuXHQvLyBicnVzaFxuXHRsMC5hcHBlbmQoXCJnXCIpLmF0dHIoXCJjbGFzc1wiLFwiYnJ1c2hcIik7XG5cblx0c2Jsb2Nrcy5leGl0KCkucmVtb3ZlKCk7XG5cblx0dGhpcy5vcmRlclNCbG9ja3Moc2Jsb2Nrcyk7XG5cblx0Ly8gc3ludGVueSBibG9jayBsYWJlbHNcblx0c2Jsb2Nrcy5zZWxlY3QoXCJ0ZXh0LmJsb2NrTGFiZWxcIilcblx0ICAgIC50ZXh0KCBiID0+IGIuY2hyIClcblx0ICAgIC5hdHRyKFwieFwiLCBiID0+IChiLnhzY2FsZShiLnN0YXJ0KSArIGIueHNjYWxlKGIuZW5kKSkvMiApXG5cdCAgICAuYXR0cihcInlcIiwgdGhpcy5ibG9ja0hlaWdodCAvIDIgKyAxMClcblx0ICAgIDtcblxuXHQvLyBzeW50ZW55IGJsb2NrIHJlY3RzXG5cdHNibG9ja3Muc2VsZWN0KFwicmVjdC5ibG9ja1wiKVxuXHQgIC5hdHRyKFwieFwiLCAgICAgYiA9PiBiLnhzY2FsZShiLmZsaXAgPyBiLmVuZCA6IGIuc3RhcnQpKVxuXHQgIC5hdHRyKFwieVwiLCAgICAgYiA9PiAtdGhpcy5ibG9ja0hlaWdodCAvIDIpXG5cdCAgLmF0dHIoXCJ3aWR0aFwiLCBiID0+IE1hdGguYWJzKGIueHNjYWxlKGIuZW5kKS1iLnhzY2FsZShiLnN0YXJ0KSkpXG5cdCAgLmF0dHIoXCJoZWlnaHRcIix0aGlzLmJsb2NrSGVpZ2h0KTtcblxuXHQvLyBzeW50ZW55IGJsb2NrIGF4aXMgbGluZXNcblx0c2Jsb2Nrcy5zZWxlY3QoXCJsaW5lLmF4aXNcIilcblx0ICAgIC5hdHRyKFwieDFcIiwgYiA9PiBiLnhzY2FsZS5yYW5nZSgpWzBdKVxuXHQgICAgLmF0dHIoXCJ5MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ4MlwiLCBiID0+IGIueHNjYWxlLnJhbmdlKClbMV0pXG5cdCAgICAuYXR0cihcInkyXCIsIDApXG5cdCAgICA7XG5cblx0Ly8gYnJ1c2hcblx0c2Jsb2Nrcy5zZWxlY3QoXCJnLmJydXNoXCIpXG5cdCAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBiID0+IGB0cmFuc2xhdGUoMCwke3RoaXMuYmxvY2tIZWlnaHQgLyAyfSlgKVxuXHQgICAgLmVhY2goZnVuY3Rpb24oYikge1xuXHRcdGlmICghYi5icnVzaCkge1xuXHRcdCAgICBiLmJydXNoID0gZDMuc3ZnLmJydXNoKClcblx0XHRcdC5vbihcImJydXNoc3RhcnRcIiwgZnVuY3Rpb24oKXsgc2VsZi5iYlN0YXJ0KCBiLCB0aGlzICk7IH0pXG5cdFx0XHQub24oXCJicnVzaFwiLCAgICAgIGZ1bmN0aW9uKCl7IHNlbGYuYmJCcnVzaCggYiwgdGhpcyApOyB9KVxuXHRcdFx0Lm9uKFwiYnJ1c2hlbmRcIiwgICBmdW5jdGlvbigpeyBzZWxmLmJiRW5kKCBiLCB0aGlzICk7IH0pXG5cdFx0fVxuXHRcdGIuYnJ1c2gueChiLnhzY2FsZSkuY2xlYXIoKTtcblx0XHRkMy5zZWxlY3QodGhpcykuY2FsbChiLmJydXNoKTtcblx0ICAgIH0pXG5cdCAgICAuc2VsZWN0QWxsKFwicmVjdFwiKVxuXHRcdC5hdHRyKFwiaGVpZ2h0XCIsIDEwKTtcblxuXHR0aGlzLmRyYXdGZWF0dXJlcyhzYmxvY2tzKTtcblxuXHQvL1xuXHR0aGlzLmFwcC5mYWNldE1hbmFnZXIuYXBwbHlBbGwoKTtcblxuXHQvLyBXZSBuZWVkIHRvIGxldCB0aGUgdmlldyByZW5kZXIgYmVmb3JlIGRvaW5nIHRoZSBoaWdobGlnaHRpbmcsIHNpbmNlIGl0IGRlcGVuZHMgb25cblx0Ly8gdGhlIHBvc2l0aW9ucyBvZiByZWN0YW5nbGVzIGluIHRoZSBzY2VuZS5cblx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuXHQgICAgLy90aGlzLnNldEdlbm9tZVlPcmRlciggdGhpcy5nZW5vbWVzLm1hcChnID0+IGcubmFtZSkgKTtcblx0ICAgIC8vd2luZG93LnNldFRpbWVvdXQoKCkgPT4gdGhpcy5oaWdobGlnaHQoKSwgNTApO1xuXHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0fSwgNTApO1xuICAgIH07XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgZmVhdHVyZXMgKHJlY3RhbmdsZXMpIGZvciB0aGUgc3BlY2lmaWVkIHN5bnRlbnkgYmxvY2tzLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIHNibG9ja3MgKEQzIHNlbGVjdGlvbiBvZiBnLnNibG9jayBub2RlcykgLSBtdWx0aWxldmVsIHNlbGVjdGlvbi5cbiAgICAvLyAgICAgICAgQXJyYXkgKGNvcnJlc3BvbmRpbmcgdG8gc3RyaXBzKSBvZiBhcnJheXMgb2Ygc3ludGVueSBibG9ja3MuXG4gICAgLy9cbiAgICBkcmF3RmVhdHVyZXMgKHNibG9ja3MpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHQvL1xuXHQvLyBuZXZlciBkcmF3IHRoZSBzYW1lIGZlYXR1cmUgdHdpY2Vcblx0bGV0IGRyYXduID0gbmV3IFNldCgpO1x0Ly8gc2V0IG9mIG1ncGlkcyBvZiBkcmF3biBmZWF0dXJlc1xuXHRsZXQgZmlsdGVyRHJhd24gPSBmdW5jdGlvbiAoZikge1xuXHQgICAgLy8gcmV0dXJucyB0cnVlIGlmIHdlJ3ZlIG5vdCBzZWVuIHRoaXMgb25lIGJlZm9yZS5cblx0ICAgIC8vIHJlZ2lzdGVycyB0aGF0IHdlJ3ZlIHNlZW4gaXQuXG5cdCAgICBsZXQgZmlkID0gZi5tZ3BpZDtcblx0ICAgIGxldCB2ID0gISBkcmF3bi5oYXMoZmlkKTtcblx0ICAgIGRyYXduLmFkZChmaWQpO1xuXHQgICAgcmV0dXJuIHY7XG5cdH07XG5cdGxldCBmZWF0cyA9IHNibG9ja3Muc2VsZWN0KCdbbmFtZT1cImxheWVyMVwiXScpLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpXG5cdCAgICAuZGF0YShkPT5kLmZlYXR1cmVzLmZpbHRlcihmaWx0ZXJEcmF3biksIGQ9PmQubWdwaWQpO1xuXHRmZWF0cy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGxldCBuZXdGZWF0cyA9IGZlYXRzLmVudGVyKCkuYXBwZW5kKFwicmVjdFwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBmID0+IFwiZmVhdHVyZVwiICsgKGYuc3RyYW5kPT09XCItXCIgPyBcIiBtaW51c1wiIDogXCIgcGx1c1wiKSlcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBmID0+IGYubWdwaWQpXG5cdCAgICAuc3R5bGUoXCJmaWxsXCIsIGYgPT4gc2VsZi5hcHAuY3NjYWxlKGYuZ2V0TXVuZ2VkVHlwZSgpKSlcblx0ICAgIDtcblxuXHQvLyBkcmF3IHRoZSByZWN0YW5nbGVzXG5cblx0Ly8gcmV0dXJucyB0aGUgc3ludGVueSBibG9jayBjb250YWluaW5nIHRoaXMgZmVhdHVyZVxuXHRsZXQgZkJsb2NrID0gZnVuY3Rpb24gKGZlYXRFbHQpIHtcblx0ICAgIGxldCBibGtFbHQgPSBmZWF0RWx0LnBhcmVudE5vZGU7XG5cdCAgICByZXR1cm4gYmxrRWx0Ll9fZGF0YV9fO1xuXHR9XG5cdGxldCBmeCA9IGZ1bmN0aW9uKGYpIHtcblx0ICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgcmV0dXJuIGIueHNjYWxlKE1hdGgubWF4KGYuc3RhcnQsYi5zdGFydCkpXG5cdH07XG5cdGxldCBmdyA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICBsZXQgYiA9IGZCbG9jayh0aGlzKTtcblx0ICAgIHJldHVybiBNYXRoLmFicyhiLnhzY2FsZShNYXRoLm1pbihmLmVuZCxiLmVuZCkpIC0gYi54c2NhbGUoTWF0aC5tYXgoZi5zdGFydCxiLnN0YXJ0KSkpICsgMTtcblx0fTtcblx0bGV0IGZ5ID0gZnVuY3Rpb24gKGYpIHtcblx0ICAgICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgICAgaWYgKGYuc3RyYW5kID09IFwiK1wiKXtcblx0XHQgICBpZiAoYi5mbGlwKSBcblx0XHQgICAgICAgcmV0dXJuIHNlbGYubGFuZUhlaWdodCpmLmxhbmUgLSBzZWxmLmZlYXRIZWlnaHQ7IFxuXHRcdCAgIGVsc2UgXG5cdFx0ICAgICAgIHJldHVybiAtc2VsZi5sYW5lSGVpZ2h0KmYubGFuZTtcblx0ICAgICAgIH1cblx0ICAgICAgIGVsc2Uge1xuXHRcdCAgIC8vIGYubGFuZSBpcyBuZWdhdGl2ZSBmb3IgXCItXCIgc3RyYW5kXG5cdFx0ICAgaWYgKGIuZmxpcCkgXG5cdFx0ICAgICAgIHJldHVybiBzZWxmLmxhbmVIZWlnaHQqZi5sYW5lO1xuXHRcdCAgIGVsc2Vcblx0XHQgICAgICAgcmV0dXJuIC1zZWxmLmxhbmVIZWlnaHQqZi5sYW5lIC0gc2VsZi5mZWF0SGVpZ2h0OyBcblx0ICAgICAgIH1cblx0ICAgfTtcblxuXHRmZWF0c1xuXHQgIC5hdHRyKFwieFwiLCBmeClcblx0ICAuYXR0cihcIndpZHRoXCIsIGZ3KVxuXHQgIC5hdHRyKFwieVwiLCBmeSlcblx0ICAuYXR0cihcImhlaWdodFwiLCB0aGlzLmZlYXRIZWlnaHQpXG5cdCAgO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFVwZGF0ZXMgZmVhdHVyZSBoaWdobGlnaHRpbmcgaW4gdGhlIGN1cnJlbnQgem9vbSB2aWV3LlxuICAgIC8vIEZlYXR1cmVzIHRvIGJlIGhpZ2hsaWdodGVkIGluY2x1ZGUgdGhvc2UgaW4gdGhlIGhpRmVhdHMgbGlzdCBwbHVzIHRoZSBmZWF0dXJlXG4gICAgLy8gY29ycmVzcG9uZGluZyB0byB0aGUgcmVjdGFuZ2xlIGFyZ3VtZW50LCBpZiBnaXZlbi4gKFRoZSBtb3VzZW92ZXIgZmVhdHVyZS4pXG4gICAgLy9cbiAgICAvLyBEcmF3cyBmaWR1Y2lhbHMgZm9yIGZlYXR1cmVzIGluIHRoaXMgbGlzdCB0aGF0OlxuICAgIC8vIDEuIG92ZXJsYXAgdGhlIGN1cnJlbnQgem9vbVZpZXcgY29vcmQgcmFuZ2VcbiAgICAvLyAyLiBhcmUgbm90IHJlbmRlcmVkIGludmlzaWJsZSBieSBjdXJyZW50IGZhY2V0IHNldHRpbmdzXG4gICAgLy9cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgIGN1cnJlbnQgKHJlY3QgZWxlbWVudCkgT3B0aW9uYWwuIEFkZCdsIHJlY3RhbmdsZSBlbGVtZW50LCBlLmcuLCB0aGF0IHdhcyBtb3VzZWQtb3Zlci4gSGlnaGxpZ2h0aW5nXG4gICAgLy8gICAgICAgIHdpbGwgaW5jbHVkZSB0aGUgZmVhdHVyZSBjb3JyZXNwb25kaW5nIHRvIHRoaXMgcmVjdCBhbG9uZyB3aXRoIHRob3NlIGluIHRoZSBoaWdobGlnaHQgbGlzdC5cbiAgICAvLyAgICBwdWxzZUN1cnJlbnQgKGJvb2xlYW4pIElmIHRydWUgYW5kIGN1cnJlbnQgaXMgZ2l2ZW4sIGNhdXNlIGl0IHRvIHB1bHNlIGJyaWVmbHkuXG4gICAgLy9cbiAgICBoaWdobGlnaHQgKGN1cnJlbnQsIHB1bHNlQ3VycmVudCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdC8vIGN1cnJlbnQgZmVhdHVyZVxuXHRsZXQgY3VyckZlYXQgPSBjdXJyZW50ID8gKGN1cnJlbnQgaW5zdGFuY2VvZiBGZWF0dXJlID8gY3VycmVudCA6IGN1cnJlbnQuX19kYXRhX18pIDogbnVsbDtcblx0Ly8gY3JlYXRlIGxvY2FsIGNvcHkgb2YgaGlGZWF0cywgd2l0aCBjdXJyZW50IGZlYXR1cmUgYWRkZWRcblx0bGV0IGhpRmVhdHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmhpRmVhdHMpO1xuXHRpZiAoY3VyckZlYXQpIHtcblx0ICAgIGhpRmVhdHNbY3VyckZlYXQuaWRdID0gY3VyckZlYXQuaWQ7XG5cdH1cblxuXHQvLyBGaWx0ZXIgYWxsIGZlYXR1cmVzIChyZWN0YW5nbGVzKSBpbiB0aGUgc2NlbmUgZm9yIHRob3NlIGJlaW5nIGhpZ2hsaWdodGVkLlxuXHQvLyBBbG9uZyB0aGUgd2F5LCBidWlsZCBpbmRleCBtYXBwaW5nIGZlYXR1cmUgaWQgdG8gaXRzIFwic3RhY2tcIiBvZiBlcXVpdmFsZW50IGZlYXR1cmVzLFxuXHQvLyBpLmUuIGEgbGlzdCBvZiBpdHMgZ2Vub2xvZ3Mgc29ydGVkIGJ5IHkgY29vcmRpbmF0ZS5cblx0Ly8gQWxzbywgbWFrZSBlYWNoIGhpZ2hsaWdodGVkIGZlYXR1cmUgdGFsbGVyIChzbyBpdCBzdGFuZHMgYWJvdmUgaXRzIG5laWdoYm9ycylcblx0Ly8gYW5kIGdpdmUgaXQgdGhlIFwiLmhpZ2hsaWdodFwiIGNsYXNzLlxuXHQvL1xuXHRsZXQgc3RhY2tzID0ge307IC8vIGZpZCAtPiBbIHJlY3RzIF0gXG5cdGxldCBkaCA9IHRoaXMuYmxvY2tIZWlnaHQvMiAtIHRoaXMuZmVhdEhlaWdodDtcbiAgICAgICAgbGV0IGZlYXRzID0gdGhpcy5zdmdNYWluLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpXG5cdCAgLy8gZmlsdGVyIHJlY3QuZmVhdHVyZXMgZm9yIHRob3NlIGluIHRoZSBoaWdobGlnaHQgbGlzdFxuXHQgIC5maWx0ZXIoZnVuY3Rpb24oZmYpe1xuXHQgICAgICAvLyBoaWdobGlnaHQgZmYgaWYgZWl0aGVyIGlkIGlzIGluIHRoZSBsaXN0IEFORCBpdCdzIG5vdCBiZWVuIGhpZGRlblxuXHQgICAgICBsZXQgbWdpID0gaGlGZWF0c1tmZi5tZ2lpZF07XG5cdCAgICAgIGxldCBtZ3AgPSBoaUZlYXRzW2ZmLm1ncGlkXTtcblx0ICAgICAgbGV0IHNob3dpbmcgPSBkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJkaXNwbGF5XCIpICE9PSBcIm5vbmVcIjtcblx0ICAgICAgbGV0IGhsID0gc2hvd2luZyAmJiAobWdpIHx8IG1ncCk7XG5cdCAgICAgIGlmIChobCkge1xuXHRcdCAgLy8gZm9yIGVhY2ggaGlnaGxpZ2h0ZWQgZmVhdHVyZSwgYWRkIGl0cyByZWN0YW5nbGUgdG8gdGhlIGxpc3Rcblx0XHQgIGxldCBrID0gZmYuaWQ7XG5cdFx0ICBpZiAoIXN0YWNrc1trXSkgc3RhY2tzW2tdID0gW11cblx0XHQgIHN0YWNrc1trXS5wdXNoKHRoaXMpXG5cdCAgICAgIH1cblx0ICAgICAgLy8gXG5cdCAgICAgIGQzLnNlbGVjdCh0aGlzKVxuXHRcdCAgLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgaGwpXG5cdFx0ICAuY2xhc3NlZChcImN1cnJlbnRcIiwgaGwgJiYgY3VyckZlYXQgJiYgdGhpcy5fX2RhdGFfXy5pZCA9PT0gY3VyckZlYXQuaWQpXG5cdFx0ICAuY2xhc3NlZChcImV4dHJhXCIsIHB1bHNlQ3VycmVudCAmJiBmZiA9PT0gY3VyckZlYXQpXG5cdCAgICAgIHJldHVybiBobDtcblx0ICB9KVxuXHQgIDtcblxuXHQvLyBidWlsZCBkYXRhIGFycmF5IGZvciBkcmF3aW5nIGZpZHVjaWFscyBiZXR3ZWVuIGVxdWl2YWxlbnQgZmVhdHVyZXNcblx0bGV0IGRhdGEgPSBbXTtcblx0Zm9yIChsZXQgayBpbiBzdGFja3MpIHtcblx0ICAgIC8vIGZvciBlYWNoIGhpZ2hsaWdodGVkIGZlYXR1cmUsIHNvcnQgdGhlIHJlY3RhbmdsZXMgaW4gaXRzIGxpc3QgYnkgWS1jb29yZGluYXRlXG5cdCAgICBsZXQgcmVjdHMgPSBzdGFja3Nba107XG5cdCAgICByZWN0cy5zb3J0KCAoYSxiKSA9PiBwYXJzZUZsb2F0KGEuZ2V0QXR0cmlidXRlKFwieVwiKSkgLSBwYXJzZUZsb2F0KGIuZ2V0QXR0cmlidXRlKFwieVwiKSkgKTtcblx0ICAgIHJlY3RzLnNvcnQoIChhLGIpID0+IHtcblx0XHRyZXR1cm4gYS5fX2RhdGFfXy5nZW5vbWUuem9vbVkgLSBiLl9fZGF0YV9fLmdlbm9tZS56b29tWTtcblx0ICAgIH0pO1xuXHQgICAgLy8gV2FudCBhIHBvbHlnb24gYmV0d2VlbiBlYWNoIHN1Y2Nlc3NpdmUgcGFpciBvZiBpdGVtcy4gVGhlIGZvbGxvd2luZyBjcmVhdGVzIGEgbGlzdCBvZlxuXHQgICAgLy8gbiBwYWlycywgd2hlcmUgcmVjdFtpXSBpcyBwYWlyZWQgd2l0aCByZWN0W2krMV0uIFRoZSBsYXN0IHBhaXIgY29uc2lzdHMgb2YgdGhlIGxhc3Rcblx0ICAgIC8vIHJlY3RhbmdsZSBwYWlyZWQgd2l0aCB1bmRlZmluZWQuIChXZSB3YW50IHRoaXMuKVxuXHQgICAgbGV0IHBhaXJzID0gcmVjdHMubWFwKChyLCBpKSA9PiBbcixyZWN0c1tpKzFdXSk7XG5cdCAgICAvLyBBZGQgYSBjbGFzcyAoXCJjdXJyZW50XCIpIGZvciB0aGUgcG9seWdvbnMgYXNzb2NpYXRlZCB3aXRoIHRoZSBtb3VzZW92ZXIgZmVhdHVyZSBzbyB0aGV5XG5cdCAgICAvLyBjYW4gYmUgZGlzdGluZ3Vpc2hlZCBmcm9tIG90aGVycy5cblx0ICAgIGRhdGEucHVzaCh7IGZpZDogaywgcmVjdHM6IHBhaXJzLCBjbHM6IChjdXJyRmVhdCAmJiBjdXJyRmVhdC5pZCA9PT0gayA/ICdjdXJyZW50JyA6ICcnKSB9KTtcblx0fVxuXHR0aGlzLmRyYXdGaWR1Y2lhbHMoZGF0YSwgY3VyckZlYXQpO1xuXG5cdC8vIEZJWE1FOiByZWFjaG92ZXJcblx0dGhpcy5hcHAuZmVhdHVyZURldGFpbHMudXBkYXRlKGN1cnJGZWF0KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyBwb2x5Z29ucyB0aGF0IGNvbm5lY3QgaGlnaGxpZ2h0ZWQgZmVhdHVyZXMgaW4gdGhlIHZpZXdcbiAgICAvLyBBcmdzOlxuICAgIC8vICAgZGF0YSA6IGxpc3Qgb2Yge1xuICAgIC8vICAgICAgIGZpZDogZmVhdHVyZS1pZCwgXG4gICAgLy8gICAgICAgY2xzOiBleHRyYSBjbGFzcyBmb3IgLmZlYXR1cmVNYXJrIGdyb3VwLFxuICAgIC8vICAgICAgIHJlY3RzOiBsaXN0IG9mIFtyZWN0MSxyZWN0Ml0gcGFpcnMsIFxuICAgIC8vICAgICAgIH1cbiAgICAvLyAgIGN1cnJGZWF0IDogY3VycmVudCAobW91c2VvdmVyKSBmZWF0dXJlIChpZiBhbnkpXG4gICAgLy9cbiAgICBkcmF3RmlkdWNpYWxzIChkYXRhLCBjdXJyRmVhdCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdC8vXG5cdC8vIHB1dCBmaWR1Y2lhbCBtYXJrcyBpbiB0aGVpciBvd24gZ3JvdXAgXG5cdGxldCBmR3JwID0gdGhpcy5maWR1Y2lhbHMuY2xhc3NlZChcImhpZGRlblwiLCBmYWxzZSk7XG5cblx0Ly8gQmluZCBmaXJzdCBsZXZlbCBkYXRhIHRvIFwiZmVhdHVyZU1hcmtzXCIgZ3JvdXBzXG5cdGxldCBmZkdycHMgPSBmR3JwLnNlbGVjdEFsbChcImcuZmVhdHVyZU1hcmtzXCIpXG5cdCAgICAuZGF0YShkYXRhLCBkID0+IGQuZmlkKTtcblx0ZmZHcnBzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGQgPT4gZC5maWQpO1xuXHRmZkdycHMuZXhpdCgpLnJlbW92ZSgpO1xuXHQvL1xuXHRmZkdycHMuYXR0cihcImNsYXNzXCIsZCA9PiBcImZlYXR1cmVNYXJrcyBcIiArIChkLmNscyB8fCBcIlwiKSlcblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIERyYXcgdGhlIGNvbm5lY3RvciBwb2x5Z29ucy5cblx0Ly8gQmluZCBzZWNvbmQgbGV2ZWwgZGF0YSAocmVjdGFuZ2xlIHBhaXJzKSB0byBwb2x5Z29ucyBpbiB0aGUgZ3JvdXBcblx0bGV0IHBnb25zID0gZmZHcnBzLnNlbGVjdEFsbChcInBvbHlnb25cIilcblx0ICAgIC5kYXRhKGQ9PmQucmVjdHMuZmlsdGVyKHIgPT4gclswXSAmJiByWzFdKSk7XG5cdHBnb25zLmV4aXQoKS5yZW1vdmUoKTtcblx0cGdvbnMuZW50ZXIoKS5hcHBlbmQoXCJwb2x5Z29uXCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJmaWR1Y2lhbFwiKVxuXHQgICAgO1xuXHQvL1xuXHRwZ29ucy5hdHRyKFwicG9pbnRzXCIsIHIgPT4ge1xuXHQgICAgLy8gcG9seWdvbiBjb25uZWN0cyBib3R0b20gY29ybmVycyBvZiAxc3QgcmVjdCB0byB0b3AgY29ybmVycyBvZiAybmQgcmVjdFxuXHQgICAgbGV0IGMxID0gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0oclswXSk7IC8vIHRyYW5zZm9ybSBjb29yZHMgZm9yIDFzdCByZWN0XG5cdCAgICBsZXQgYzI9IGNvb3Jkc0FmdGVyVHJhbnNmb3JtKHJbMV0pOyAgLy8gdHJhbnNmb3JtIGNvb3JkcyBmb3IgMm5kIHJlY3Rcblx0ICAgIC8vIGZvdXIgcG9seWdvbiBwb2ludHNcblx0ICAgIGxldCBzID0gYCR7YzEueH0sJHtjMS55K2MxLmhlaWdodH0gJHtjMi54fSwke2MyLnl9ICR7YzIueCtjMi53aWR0aH0sJHtjMi55fSAke2MxLngrYzEud2lkdGh9LCR7YzEueStjMS5oZWlnaHR9YFxuXHQgICAgcmV0dXJuIHM7XG5cdH0pXG5cdC8vIG1vdXNpbmcgb3ZlciB0aGUgZmlkdWNpYWwgaGlnaGxpZ2h0cyAoYXMgaWYgdGhlIHVzZXIgaGFkIG1vdXNlZCBvdmVyIHRoZSBmZWF0dXJlIGl0c2VsZilcblx0Lm9uKFwibW91c2VvdmVyXCIsIChwKSA9PiB7XG5cdCAgICBpZiAoIWQzLmV2ZW50LmN0cmxLZXkpXG5cdCAgICAgICAgdGhpcy5oaWdobGlnaHQocFswXSk7XG5cdH0pXG5cdC5vbihcIm1vdXNlb3V0XCIsICAocCkgPT4ge1xuXHQgICAgaWYgKCFkMy5ldmVudC5jdHJsS2V5KVxuXHQgICAgICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIERyYXcgZmVhdHVyZSBsYWJlbHMuIEVhY2ggbGFiZWwgaXMgZHJhd24gb25jZSwgYWJvdmUgdGhlIGZpcnN0IHJlY3RhbmdsZSBpbiBpdHMgbGlzdC5cblx0Ly8gVGhlIGV4Y2VwdGlvbiBpcyB0aGUgY3VycmVudCAobW91c2VvdmVyKSBmZWF0dXJlLCB3aGVyZSB0aGUgbGFiZWwgaXMgZHJhd24gYWJvdmUgdGhhdCBmZWF0dXJlLlxuXHRsZXQgbGFiZWxzID0gZmZHcnBzLnNlbGVjdEFsbCgndGV4dC5mZWF0TGFiZWwnKVxuXHQgICAgLmRhdGEoZCA9PiB7XG5cdFx0bGV0IHIgPSBkLnJlY3RzWzBdWzBdO1xuXHRcdGlmIChjdXJyRmVhdCAmJiAoZC5maWQgPT09IGN1cnJGZWF0LklEIHx8IGQuZmlkID09PSBjdXJyRmVhdC5jYW5vbmljYWwpKXtcblx0XHQgICAgciA9IGQucmVjdHMubWFwKCByciA9PlxuXHRcdCAgICAgICByclswXS5fX2RhdGFfXyA9PT0gY3VyckZlYXQgPyByclswXSA6IHJyWzFdJiZyclsxXS5fX2RhdGFfXyA9PT0gY3VyckZlYXQgPyByclsxXSA6IG51bGxcblx0XHQgICAgICAgKS5maWx0ZXIoeD0+eClbMF07XG5cdFx0fVxuXHQgICAgICAgIHJldHVybiBbe1xuXHRcdCAgICBmaWQ6IGQuZmlkLFxuXHRcdCAgICByZWN0OiByLFxuXHRcdCAgICB0cmVjdDogY29vcmRzQWZ0ZXJUcmFuc2Zvcm0ocilcblx0XHR9XTtcblx0ICAgIH0pO1xuXG5cdC8vIERyYXcgdGhlIHRleHQuXG5cdGxhYmVscy5lbnRlcigpLmFwcGVuZCgndGV4dCcpLmF0dHIoJ2NsYXNzJywnZmVhdExhYmVsJyk7XG5cdGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XG5cdGxhYmVsc1xuXHQgIC5hdHRyKFwieFwiLCBkID0+IGQudHJlY3QueCArIGQudHJlY3Qud2lkdGgvMiApXG5cdCAgLmF0dHIoXCJ5XCIsIGQgPT4gZC5yZWN0Ll9fZGF0YV9fLmdlbm9tZS56b29tWSAtIDMpXG5cdCAgLnRleHQoZCA9PiB7XG5cdCAgICAgICBsZXQgZiA9IGQucmVjdC5fX2RhdGFfXztcblx0ICAgICAgIGxldCBzeW0gPSBmLnN5bWJvbCB8fCBmLm1ncGlkO1xuXHQgICAgICAgcmV0dXJuIHN5bTtcblx0ICB9KTtcblxuXHQvLyBQdXQgYSByZWN0YW5nbGUgYmVoaW5kIGVhY2ggbGFiZWwgYXMgYSBiYWNrZ3JvdW5kXG5cdGxldCBsYmxCb3hEYXRhID0gbGFiZWxzLm1hcChsYmwgPT4gbGJsWzBdLmdldEJCb3goKSlcblx0bGV0IGxibEJveGVzID0gZmZHcnBzLnNlbGVjdEFsbCgncmVjdC5mZWF0TGFiZWxCb3gnKVxuXHQgICAgLmRhdGEoKGQsaSkgPT4gW2xibEJveERhdGFbaV1dKTtcblx0bGJsQm94ZXMuZW50ZXIoKS5pbnNlcnQoJ3JlY3QnLCd0ZXh0JykuYXR0cignY2xhc3MnLCdmZWF0TGFiZWxCb3gnKTtcblx0bGJsQm94ZXMuZXhpdCgpLnJlbW92ZSgpO1xuXHRsYmxCb3hlc1xuXHQgICAgLmF0dHIoXCJ4XCIsICAgICAgYmIgPT4gYmIueC0yKVxuXHQgICAgLmF0dHIoXCJ5XCIsICAgICAgYmIgPT4gYmIueS0xKVxuXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCAgYmIgPT4gYmIud2lkdGgrNClcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGJiID0+IGJiLmhlaWdodCsyKVxuXHQgICAgO1xuXHRcblx0Ly8gaWYgdGhlcmUgaXMgYSBjdXJyRmVhdCwgbW92ZSBpdHMgZmlkdWNpYWxzIHRvIHRoZSBlbmQgKHNvIHRoZXkncmUgb24gdG9wIG9mIGV2ZXJ5b25lIGVsc2UpXG5cdGlmIChjdXJyRmVhdCkge1xuXHQgICAgLy8gZ2V0IGxpc3Qgb2YgZ3JvdXAgZWxlbWVudHMgZnJvbSB0aGUgZDMgc2VsZWN0aW9uXG5cdCAgICBsZXQgZmZMaXN0ID0gZmZHcnBzWzBdO1xuXHQgICAgLy8gZmluZCB0aGUgb25lIHdob3NlIGZlYXR1cmUgaXMgY3VyckZlYXRcblx0ICAgIGxldCBpID0gLTE7XG5cdCAgICBmZkxpc3QuZm9yRWFjaCggKGcsaikgPT4geyBpZiAoZy5fX2RhdGFfXy5maWQgPT09IGN1cnJGZWF0LmlkKSBpID0gajsgfSk7XG5cdCAgICAvLyBpZiB3ZSBmb3VuZCBpdCBhbmQgaXQncyBub3QgYWxyZWFkeSB0aGUgbGFzdCwgbW92ZSBpdCB0byB0aGVcblx0ICAgIC8vIGxhc3QgcG9zaXRpb24gYW5kIHJlb3JkZXIgaW4gdGhlIERPTS5cblx0ICAgIGlmIChpID49IDApIHtcblx0XHRsZXQgbGFzdGkgPSBmZkxpc3QubGVuZ3RoIC0gMTtcblx0ICAgICAgICBsZXQgeCA9IGZmTGlzdFtpXTtcblx0XHRmZkxpc3RbaV0gPSBmZkxpc3RbbGFzdGldO1xuXHRcdGZmTGlzdFtsYXN0aV0gPSB4O1xuXHRcdGZmR3Jwcy5vcmRlcigpO1xuXHQgICAgfVxuXHR9XG5cdFxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWRlRmlkdWNpYWxzICgpIHtcblx0dGhpcy5zdmdNYWluLnNlbGVjdChcImcuZmlkdWNpYWxzXCIpXG5cdCAgICAuY2xhc3NlZChcImhpZGRlblwiLCB0cnVlKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBab29tVmlld1xuXG5leHBvcnQgeyBab29tVmlldyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvWm9vbVZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=