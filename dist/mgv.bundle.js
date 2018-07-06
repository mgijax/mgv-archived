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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNGNlOTNlOGU2MmE3NmY1YTYxMDMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1N0b3JhZ2VNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvU1ZHVmlldy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvdmlld2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9NR1ZBcHAuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZS5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1F1ZXJ5TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQXV4RGF0YU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYUV2YWx1YXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvTGlzdEVkaXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvVXNlclByZWZzTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmFjZXRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GYWNldC5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQlRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9CbG9ja1RyYW5zbGF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZVZpZXcuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9ab29tVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVEQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixvREFBb0Q7QUFDaEYsU0FBUztBQUNULEtBQUssRTtBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixvREFBb0Q7QUFDaEYsU0FBUztBQUNULEtBQUssRTtBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLG1EQUFtRDtBQUNuRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxJQUFJLEdBQUcsTUFBTSxJQUFJLElBQUk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsY0FBYztBQUNkO0FBQ0EsY0FBYztBQUNkO0FBQ0EsbUJBQW1CLElBQUksR0FBRyxJQUFJO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQW9CQTs7Ozs7Ozs7QUN6VkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7OztBQ3JCUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7OztBQ3JFUjtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxvQkFBb0I7QUFDckQsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxRQUFRLFVBQVUsRUFBRSxJQUFJO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxhQUFhO0FBQ2xFO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVPOzs7Ozs7Ozs7O0FDL1JvQjs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7Ozs7OztBQ25FcUQ7QUFDekM7QUFDUTs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRDtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTzs7Ozs7Ozs7OztBQ2pPc0I7O0FBRTlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7Ozs7QUN2Q1E7O0FBRWhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTzs7Ozs7Ozs7QUM3QlI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7Ozs7OztBQ3BCUTtBQUNVOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixtQkFBbUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0NBQWdDLGFBQWEsR0FBRyxhQUFhO0FBQzdELGdDQUFnQyxhQUFhLEdBQUcsYUFBYTtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLHdEQUF3RCxJQUFJLHlCQUF5QixJQUFJO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLDZEQUE2RCxhQUFhLEdBQUcsYUFBYSxZQUFZLEVBQUU7QUFDeEcsS0FBSztBQUNMLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7O0FDdEdSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQSx3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7Ozs7OztBQ3RKVTtBQUNhOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qixr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QUFPLG1CQUFtQixXQUFXO0FBQzdGO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixJQUFJO0FBQ0osT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsVztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0EsK0JBQStCLDJDQUEyQyxFQUFFO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU8iLCJmaWxlIjoibWd2LmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDRjZTkzZThlNjJhNzZmNWE2MTAzIiwiXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vICAgICAgICAgICAgICAgICAgICBVVElMU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gKFJlLSlJbml0aWFsaXplcyBhbiBvcHRpb24gbGlzdC5cbi8vIEFyZ3M6XG4vLyAgIHNlbGVjdG9yIChzdHJpbmcgb3IgTm9kZSkgQ1NTIHNlbGVjdG9yIG9mIHRoZSBjb250YWluZXIgPHNlbGVjdD4gZWxlbWVudC4gT3IgdGhlIGVsZW1lbnQgaXRzZWxmLlxuLy8gICBvcHRzIChsaXN0KSBMaXN0IG9mIG9wdGlvbiBkYXRhIG9iamVjdHMuIE1heSBiZSBzaW1wbGUgc3RyaW5ncy4gTWF5IGJlIG1vcmUgY29tcGxleC5cbi8vICAgdmFsdWUgKGZ1bmN0aW9uIG9yIG51bGwpIEZ1bmN0aW9uIHRvIHByb2R1Y2UgdGhlIDxvcHRpb24+IHZhbHVlIGZyb20gYW4gb3B0cyBpdGVtXG4vLyAgICAgICBEZWZhdWx0cyB0byB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gKHg9PngpLlxuLy8gICBsYWJlbCAoZnVuY3Rpb24gb3IgbnVsbCkgRnVuY3Rpb24gdG8gcHJvZHVjZSB0aGUgPG9wdGlvbj4gbGFiZWwgZnJvbSBhbiBvcHRzIGl0ZW1cbi8vICAgICAgIERlZmF1bHRzIHRvIHRoZSB2YWx1ZSBmdW5jdGlvbi5cbi8vICAgbXVsdGkgKGJvb2xlYW4pIFNwZWNpZmllcyBpZiB0aGUgbGlzdCBzdXBwb3J0IG11bHRpcGxlIHNlbGVjdGlvbnMuIChkZWZhdWx0ID0gZmFsc2UpXG4vLyAgIHNlbGVjdGVkIChmdW5jdGlvbiBvciBudWxsKSBGdW5jdGlvbiB0byBkZXRlcm1pbmUgaWYgYSBnaXZlbiBvcHRpb24gaXMgc2VsZWN0ZC5cbi8vICAgICAgIERlZmF1bHRzIHRvIGQ9PkZhbHNlLiBOb3RlIHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBvbmx5IGFwcGxpZWQgdG8gbmV3IG9wdGlvbnMuXG4vLyAgIHNvcnRCeSAoZnVuY3Rpb24pIE9wdGlvbmFsLiBJZiBwcm92aWRlZCwgYSBjb21wYXJpc29uIGZ1bmN0aW9uIHRvIHVzZSBmb3Igc29ydGluZyB0aGUgb3B0aW9ucy5cbi8vICAgXHQgVGhlIGNvbXBhcmlzb24gZnVuY3Rpb24gaXMgcGFzc2VzIHRoZSBkYXRhIG9iamVjdHMgY29ycmVzcG9uZGluZyB0byB0d28gb3B0aW9ucyBhbmQgc2hvdWxkXG4vLyAgIFx0IHJldHVybiAtMSwgMCBvciArMS4gSWYgbm90IHByb3ZpZGVkLCB0aGUgb3B0aW9uIGxpc3Qgd2lsbCBoYXZlIHRoZSBzYW1lIHNvcnQgb3JkZXIgYXMgdGhlIG9wdHMgYXJndW1lbnQuXG4vLyBSZXR1cm5zOlxuLy8gICBUaGUgb3B0aW9uIGxpc3QgaW4gYSBEMyBzZWxlY3Rpb24uXG5mdW5jdGlvbiBpbml0T3B0TGlzdChzZWxlY3Rvciwgb3B0cywgdmFsdWUsIGxhYmVsLCBtdWx0aSwgc2VsZWN0ZWQsIHNvcnRCeSkge1xuXG4gICAgLy8gc2V0IHVwIHRoZSBmdW5jdGlvbnNcbiAgICBsZXQgaWRlbnQgPSBkID0+IGQ7XG4gICAgdmFsdWUgPSB2YWx1ZSB8fCBpZGVudDtcbiAgICBsYWJlbCA9IGxhYmVsIHx8IHZhbHVlO1xuICAgIHNlbGVjdGVkID0gc2VsZWN0ZWQgfHwgKHggPT4gZmFsc2UpO1xuXG4gICAgLy8gdGhlIDxzZWxlY3Q+IGVsdFxuICAgIGxldCBzID0gZDMuc2VsZWN0KHNlbGVjdG9yKTtcblxuICAgIC8vIG11bHRpc2VsZWN0XG4gICAgcy5wcm9wZXJ0eSgnbXVsdGlwbGUnLCBtdWx0aSB8fCBudWxsKSA7XG5cbiAgICAvLyBiaW5kIHRoZSBvcHRzLlxuICAgIGxldCBvcyA9IHMuc2VsZWN0QWxsKFwib3B0aW9uXCIpXG4gICAgICAgIC5kYXRhKG9wdHMsIGxhYmVsKTtcbiAgICBvcy5lbnRlcigpXG4gICAgICAgIC5hcHBlbmQoXCJvcHRpb25cIikgXG4gICAgICAgIC5hdHRyKFwidmFsdWVcIiwgdmFsdWUpXG4gICAgICAgIC5wcm9wZXJ0eShcInNlbGVjdGVkXCIsIG8gPT4gc2VsZWN0ZWQobykgfHwgbnVsbClcbiAgICAgICAgLnRleHQobGFiZWwpIFxuICAgICAgICA7XG4gICAgLy9cbiAgICBvcy5leGl0KCkucmVtb3ZlKCkgO1xuXG4gICAgLy8gc29ydCB0aGUgcmVzdWx0c1xuICAgIGlmICghc29ydEJ5KSBzb3J0QnkgPSAoYSxiKSA9PiB7XG4gICAgXHRsZXQgYWkgPSBvcHRzLmluZGV4T2YoYSk7XG5cdGxldCBiaSA9IG9wdHMuaW5kZXhPZihiKTtcblx0cmV0dXJuIGFpIC0gYmk7XG4gICAgfVxuICAgIG9zLnNvcnQoc29ydEJ5KTtcblxuICAgIC8vXG4gICAgcmV0dXJuIHM7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJvbWlzaWZpZXMgYSBjYWxsIHRvIGQzLnRzdi5cbi8vIEFyZ3M6XG4vLyAgIHVybCAoc3RyaW5nKSBUaGUgdXJsIG9mIHRoZSB0c3YgcmVzb3VyY2Vcbi8vIFJldHVybnM6XG4vLyAgIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBsaXN0IG9mIHJvdyBvYmplY3RzXG5mdW5jdGlvbiBkM3Rzdih1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGQzLnRzdih1cmwsIGZ1bmN0aW9uKGVycm9yLCB2YWwpe1xuICAgICAgICAgICAgZXJyb3IgPyByZWplY3QoeyBzdGF0dXM6IGVycm9yLnN0YXR1cywgc3RhdHVzVGV4dDogZXJyb3Iuc3RhdHVzVGV4dH0pIDogcmVzb2x2ZSh2YWwpO1xuICAgICAgICB9KSAgXG4gICAgfSk7IFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByb21pc2lmaWVzIGEgY2FsbCB0byBkMy5qc29uLlxuLy8gQXJnczpcbi8vICAgdXJsIChzdHJpbmcpIFRoZSB1cmwgb2YgdGhlIGpzb24gcmVzb3VyY2Vcbi8vIFJldHVybnM6XG4vLyAgIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBqc29uIG9iamVjdCB2YWx1ZSwgb3IgcmVqZWN0cyB3aXRoIGFuIGVycm9yXG5mdW5jdGlvbiBkM2pzb24odXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkMy5qc29uKHVybCwgZnVuY3Rpb24oZXJyb3IsIHZhbCl7XG4gICAgICAgICAgICBlcnJvciA/IHJlamVjdCh7IHN0YXR1czogZXJyb3Iuc3RhdHVzLCBzdGF0dXNUZXh0OiBlcnJvci5zdGF0dXNUZXh0fSkgOiByZXNvbHZlKHZhbCk7XG4gICAgICAgIH0pICBcbiAgICB9KTsgXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyBhIGRlZXAgY29weSBvZiBvYmplY3Qgby4gXG4vLyBBcmdzOlxuLy8gICBvICAob2JqZWN0KSBNdXN0IGJlIGEgSlNPTiBvYmplY3QgKG5vIGN1cmN1bGFyIHJlZnMsIG5vIGZ1bmN0aW9ucykuXG4vLyBSZXR1cm5zOlxuLy8gICBhIGRlZXAgY29weSBvZiBvXG5mdW5jdGlvbiBkZWVwYyhvKSB7XG4gICAgaWYgKCFvKSByZXR1cm4gbztcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobykpO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBhcnNlcyBhIHN0cmluZyBvZiB0aGUgZm9ybSBcImNocjpzdGFydC4uZW5kXCIuXG4vLyBSZXR1cm5zOlxuLy8gICBvYmplY3QgY29udGluaW5nIHRoZSBwYXJzZWQgZmllbGRzLlxuLy8gRXhhbXBsZTpcbi8vICAgcGFyc2VDb29yZHMoXCIxMDoxMDAwMDAwMC4uMjAwMDAwMDBcIikgLT4ge2NocjpcIjEwXCIsIHN0YXJ0OjEwMDAwMDAwLCBlbmQ6MjAwMDAwMDB9XG5mdW5jdGlvbiBwYXJzZUNvb3JkcyAoY29vcmRzKSB7XG4gICAgbGV0IHJlID0gLyhbXjpdKyk6KFxcZCspXFwuXFwuKFxcZCspLztcbiAgICBsZXQgbSA9IGNvb3Jkcy5tYXRjaChyZSk7XG4gICAgcmV0dXJuIG0gPyB7Y2hyOm1bMV0sIHN0YXJ0OnBhcnNlSW50KG1bMl0pLCBlbmQ6cGFyc2VJbnQobVszXSl9IDogbnVsbDtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBGb3JtYXRzIGEgY2hyb21vc29tZSBuYW1lLCBzdGFydCBhbmQgZW5kIHBvc2l0aW9uIGFzIGEgc3RyaW5nLlxuLy8gQXJncyAoZm9ybSAxKTpcbi8vICAgY29vcmRzIChvYmplY3QpIE9mIHRoZSBmb3JtIHtjaHI6c3RyaW5nLCBzdGFydDppbnQsIGVuZDppbnR9XG4vLyBBcmdzIChmb3JtIDIpOlxuLy8gICBjaHIgc3RyaW5nXG4vLyAgIHN0YXJ0IGludFxuLy8gICBlbmQgaW50XG4vLyBSZXR1cm5zOlxuLy8gICAgIHN0cmluZ1xuLy8gRXhhbXBsZTpcbi8vICAgICBmb3JtYXRDb29yZHMoXCIxMFwiLCAxMDAwMDAwMCwgMjAwMDAwMDApIC0+IFwiMTA6MTAwMDAwMDAuLjIwMDAwMDAwXCJcbmZ1bmN0aW9uIGZvcm1hdENvb3JkcyAoY2hyLCBzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0bGV0IGMgPSBjaHI7XG5cdGNociA9IGMuY2hyO1xuXHRzdGFydCA9IGMuc3RhcnQ7XG5cdGVuZCA9IGMuZW5kO1xuICAgIH1cbiAgICByZXR1cm4gYCR7Y2hyfToke3N0YXJ0fS4uJHtlbmR9YFxufVxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRydWUgaWZmIHRoZSB0d28gcmFuZ2VzIG92ZXJsYXAgYnkgYXQgbGVhc3QgMS5cbi8vIEVhY2ggcmFuZ2UgbXVzdCBoYXZlIGEgY2hyLCBzdGFydCwgYW5kIGVuZC5cbi8vXG5mdW5jdGlvbiBvdmVybGFwcyAoYSwgYikge1xuICAgIHJldHVybiBhLmNociA9PT0gYi5jaHIgJiYgYS5zdGFydCA8PSBiLmVuZCAmJiBhLmVuZCA+PSBiLnN0YXJ0O1xufVxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBHaXZlbiB0d28gcmFuZ2VzLCBhIGFuZCBiLCByZXR1cm5zIGEgLSBiLlxuLy8gVGhlIHJlc3VsdCBpcyBhIGxpc3Qgb2YgMCwgMSBvciAyIG5ldyByYW5nZXMsIGRlcGVuZGluZyBvbiBhIGFuZCBiLlxuZnVuY3Rpb24gc3VidHJhY3QoYSwgYikge1xuICAgIGlmIChhLmNociAhPT0gYi5jaHIpIHJldHVybiBbIGEgXTtcbiAgICBsZXQgYWJMZWZ0ID0geyBjaHI6YS5jaHIsIHN0YXJ0OmEuc3RhcnQsICAgICAgICAgICAgICAgICAgICBlbmQ6TWF0aC5taW4oYS5lbmQsIGIuc3RhcnQtMSkgfTtcbiAgICBsZXQgYWJSaWdodD0geyBjaHI6YS5jaHIsIHN0YXJ0Ok1hdGgubWF4KGEuc3RhcnQsIGIuZW5kKzEpLCBlbmQ6YS5lbmQgfTtcbiAgICBsZXQgYW5zID0gWyBhYkxlZnQsIGFiUmlnaHQgXS5maWx0ZXIoIHIgPT4gci5zdGFydCA8PSByLmVuZCApO1xuICAgIHJldHVybiBhbnM7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ3JlYXRlcyBhIGxpc3Qgb2Yga2V5LHZhbHVlIHBhaXJzIGZyb20gdGhlIG9iai5cbmZ1bmN0aW9uIG9iajJsaXN0IChvKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG8pLm1hcChrID0+IFtrLCBvW2tdXSkgICAgXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0cnVlIGlmZiB0aGUgdHdvIGxpc3RzIGhhdmUgdGhlIHNhbWUgY29udGVudHMgKGJhc2VkIG9uIGluZGV4T2YpLlxuLy8gQnJ1dGUgZm9yY2UgYXBwcm9hY2guIEJlIGNhcmVmdWwgd2hlcmUgeW91IHVzZSB0aGlzLlxuZnVuY3Rpb24gc2FtZSAoYWxzdCxibHN0KSB7XG4gICByZXR1cm4gYWxzdC5sZW5ndGggPT09IGJsc3QubGVuZ3RoICYmIFxuICAgICAgIGFsc3QucmVkdWNlKChhY2MseCkgPT4gKGFjYyAmJiBibHN0LmluZGV4T2YoeCk+PTApLCB0cnVlKTtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFkZCBiYXNpYyBzZXQgb3BzIHRvIFNldCBwcm90b3R5cGUuXG4vLyBMaWZ0ZWQgZnJvbTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU2V0XG5TZXQucHJvdG90eXBlLnVuaW9uID0gZnVuY3Rpb24oc2V0Qikge1xuICAgIHZhciB1bmlvbiA9IG5ldyBTZXQodGhpcyk7XG4gICAgZm9yICh2YXIgZWxlbSBvZiBzZXRCKSB7XG4gICAgICAgIHVuaW9uLmFkZChlbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuaW9uO1xufVxuXG5TZXQucHJvdG90eXBlLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgaW50ZXJzZWN0aW9uID0gbmV3IFNldCgpO1xuICAgIGZvciAodmFyIGVsZW0gb2Ygc2V0Qikge1xuICAgICAgICBpZiAodGhpcy5oYXMoZWxlbSkpIHtcbiAgICAgICAgICAgIGludGVyc2VjdGlvbi5hZGQoZWxlbSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGludGVyc2VjdGlvbjtcbn1cblxuU2V0LnByb3RvdHlwZS5kaWZmZXJlbmNlID0gZnVuY3Rpb24oc2V0Qikge1xuICAgIHZhciBkaWZmZXJlbmNlID0gbmV3IFNldCh0aGlzKTtcbiAgICBmb3IgKHZhciBlbGVtIG9mIHNldEIpIHtcbiAgICAgICAgZGlmZmVyZW5jZS5kZWxldGUoZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiBkaWZmZXJlbmNlO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBnZXRDYXJldFJhbmdlIChlbHQpIHtcbiAgICAvLyBGSVhNRTogZG9lcyBub3Qgd29yayBmb3IgSUVcbiAgICByZXR1cm4gW2VsdC5zZWxlY3Rpb25TdGFydCwgZWx0LnNlbGVjdGlvbkVuZF07XG59XG5mdW5jdGlvbiBzZXRDYXJldFJhbmdlIChlbHQsIHJhbmdlKSB7XG4gICAgLy8gRklYTUU6IGRvZXMgbm90IHdvcmsgZm9yIElFXG4gICAgZWx0LnNlbGVjdGlvblN0YXJ0ID0gcmFuZ2VbMF07XG4gICAgZWx0LnNlbGVjdGlvbkVuZCAgID0gcmFuZ2VbMV07XG59XG5mdW5jdGlvbiBzZXRDYXJldFBvc2l0aW9uIChlbHQsIHBvcykge1xuICAgIHNldENhcmV0UmFuZ2UoZWx0LCBbcG9zLHBvc10pO1xufVxuZnVuY3Rpb24gbW92ZUNhcmV0UG9zaXRpb24gKGVsdCwgZGVsdGEpIHtcbiAgICBzZXRDYXJldFBvc2l0aW9uKGVsdCwgZ2V0Q2FyZXRQb3NpdGlvbihlbHQpICsgZGVsdGEpO1xufVxuZnVuY3Rpb24gZ2V0Q2FyZXRQb3NpdGlvbiAoZWx0KSB7XG4gICAgbGV0IHIgPSBnZXRDYXJldFJhbmdlKGVsdCk7XG4gICAgcmV0dXJuIHJbMV07XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0aGUgc2NyZWVuIGNvb3JkaW5hdGVzIG9mIGFuIFNWRyBzaGFwZSAoY2lyY2xlLCByZWN0LCBwb2x5Z29uLCBsaW5lKVxuLy8gYWZ0ZXIgYWxsIHRyYW5zZm9ybXMgaGF2ZSBiZWVuIGFwcGxpZWQuXG4vL1xuLy8gQXJnczpcbi8vICAgICBzaGFwZSAobm9kZSkgVGhlIFNWRyBzaGFwZS5cbi8vXG4vLyBSZXR1cm5zOlxuLy8gICAgIFRoZSBmb3JtIG9mIHRoZSByZXR1cm5lZCB2YWx1ZSBkZXBlbmRzIG9uIHRoZSBzaGFwZS5cbi8vICAgICBjaXJjbGU6ICB7IGN4LCBjeSwgciB9XG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGNlbnRlciBwb2ludCBhbmQgdHJhbnNmb3JtZWQgcmFkaXVzICAgICAgICAgXG4vLyAgICAgbGluZTpcdHsgeDEsIHkxLCB4MiwgeTIgfVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBlbmRwb2ludHNcbi8vICAgICByZWN0Olx0eyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgY29ybmVyIHBvaW50IGFuZCB0cmFuc2Zvcm1lZCB3aWR0aCtoZWlnaHQuXG4vLyAgICAgcG9seWdvbjogWyB7eCx5fSwge3gseX0gLCAuLi4gXVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBsaXN0IG9mIHBvaW50c1xuLy9cbi8vIEFkYXB0ZWQgZnJvbTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjg1ODQ3OS9yZWN0YW5nbGUtY29vcmRpbmF0ZXMtYWZ0ZXItdHJhbnNmb3JtP3JxPTFcbi8vXG5mdW5jdGlvbiBjb29yZHNBZnRlclRyYW5zZm9ybSAoc2hhcGUpIHtcbiAgICAvL1xuICAgIGxldCBkc2hhcGUgPSBkMy5zZWxlY3Qoc2hhcGUpO1xuICAgIGxldCBzdmcgPSBzaGFwZS5jbG9zZXN0KFwic3ZnXCIpO1xuICAgIGlmICghc3ZnKSB0aHJvdyBcIkNvdWxkIG5vdCBmaW5kIHN2ZyBhbmNlc3Rvci5cIjtcbiAgICBsZXQgc3R5cGUgPSBzaGFwZS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgbGV0IG1hdHJpeCA9IHNoYXBlLmdldENUTSgpO1xuICAgIGxldCBwID0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgbGV0IHAyPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICAvL1xuICAgIHN3aXRjaCAoc3R5cGUpIHtcbiAgICAvL1xuICAgIGNhc2UgJ2NpcmNsZSc6XG5cdHAueCAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiY3hcIikpO1xuXHRwLnkgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImN5XCIpKTtcblx0cDIueCA9IHAueCArIHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJyXCIpKTtcblx0cDIueSA9IHAueTtcblx0cCAgICA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdHAyICAgPSBwMi5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0Ly8gY2FsYyBuZXcgcmFkaXVzIGFzIGRpc3RhbmNlIGJldHdlZW4gdHJhbnNmb3JtZWQgcG9pbnRzXG5cdGxldCBkeCA9IE1hdGguYWJzKHAueCAtIHAyLngpO1xuXHRsZXQgZHkgPSBNYXRoLmFicyhwLnkgLSBwMi55KTtcblx0bGV0IHIgPSBNYXRoLnNxcnQoZHgqZHggKyBkeSpkeSk7XG4gICAgICAgIHJldHVybiB7IGN4OiBwLngsIGN5OiBwLnksIHI6ciB9O1xuICAgIC8vXG4gICAgY2FzZSAncmVjdCc6XG5cdC8vIEZJWE1FOiBkb2VzIG5vdCBoYW5kbGUgcm90YXRpb25zIGNvcnJlY3RseS4gVG8gZml4LCB0cmFuc2xhdGUgY29ybmVyIHBvaW50cyBzZXBhcmF0ZWx5IGFuZCB0aGVuXG5cdC8vIGNhbGN1bGF0ZSB0aGUgdHJhbnNmb3JtZWQgd2lkdGggYW5kIGhlaWdodC4gQXMgYSBjb252ZW5pZW5jZSB0byB0aGUgdXNlciwgbWlnaHQgYmUgbmljZSB0byByZXR1cm5cblx0Ly8gdGhlIHRyYW5zZm9ybWVkIGNvcm5lciBwb2ludHMgYW5kIHBvc3NpYmx5IHRoZSBmaW5hbCBhbmdsZSBvZiByb3RhdGlvbi5cblx0cC54ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ4XCIpKTtcblx0cC55ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ5XCIpKTtcblx0cDIueCA9IHAueCArIHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ3aWR0aFwiKSk7XG5cdHAyLnkgPSBwLnkgKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiaGVpZ2h0XCIpKTtcblx0Ly9cblx0cCAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRwMiA9IHAyLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHQvL1xuICAgICAgICByZXR1cm4geyB4OiBwLngsIHk6IHAueSwgd2lkdGg6IHAyLngtcC54LCBoZWlnaHQ6IHAyLnktcC55IH07XG4gICAgLy9cbiAgICBjYXNlICdwb2x5Z29uJzpcbiAgICAgICAgbGV0IHB0cyA9IGRzaGFwZS5hdHRyKFwicG9pbnRzXCIpLnRyaW0oKS5zcGxpdCgvICsvKTtcblx0cmV0dXJuIHB0cy5tYXAoIHB0ID0+IHtcblx0ICAgIGxldCB4eSA9IHB0LnNwbGl0KFwiLFwiKTtcblx0ICAgIHAueCA9IHBhcnNlRmxvYXQoeHlbMF0pXG5cdCAgICBwLnkgPSBwYXJzZUZsb2F0KHh5WzFdKVxuXHQgICAgcCA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdCAgICByZXR1cm4geyB4OiBwLngsIHk6IHAueSB9O1xuXHR9KTtcbiAgICAvL1xuICAgIGNhc2UgJ2xpbmUnOlxuXHRwLnggICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ4MVwiKSk7XG5cdHAueSAgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInkxXCIpKTtcblx0cDIueCAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieDJcIikpO1xuXHRwMi55ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ5MlwiKSk7XG5cdHAgICAgID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0cDIgICAgPSBwMi5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcbiAgICAgICAgcmV0dXJuIHsgeDE6IHAueCwgeTE6IHAueSwgeDI6IHAyLngsIHgyOiBwMi55IH07XG4gICAgLy9cbiAgICAvLyBGSVhNRTogYWRkIGNhc2UgJ3RleHQnXG4gICAgLy9cblxuICAgIGRlZmF1bHQ6XG5cdHRocm93IFwiVW5zdXBwb3J0ZWQgbm9kZSB0eXBlOiBcIiArIHN0eXBlO1xuICAgIH1cblxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJlbW92ZXMgZHVwbGljYXRlcyBmcm9tIGEgbGlzdCB3aGlsZSBwcmVzZXJ2aW5nIGxpc3Qgb3JkZXIuXG4vLyBBcmdzOlxuLy8gICAgIGxzdCAobGlzdClcbi8vIFJldHVybnM6XG4vLyAgICAgQSBwcm9jZXNzZWQgY29weSBvZiBsc3QgaW4gd2hpY2ggYW55IGR1cHMgaGF2ZSBiZWVuIHJlbW92ZWQuXG5mdW5jdGlvbiByZW1vdmVEdXBzIChsc3QpIHtcbiAgICBsZXQgbHN0MiA9IFtdO1xuICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuICAgIGxzdC5mb3JFYWNoKHggPT4ge1xuXHQvLyByZW1vdmUgZHVwcyB3aGlsZSBwcmVzZXJ2aW5nIG9yZGVyXG5cdGlmIChzZWVuLmhhcyh4KSkgcmV0dXJuO1xuXHRsc3QyLnB1c2goeCk7XG5cdHNlZW4uYWRkKHgpO1xuICAgIH0pO1xuICAgIHJldHVybiBsc3QyO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENsaXBzIGEgdmFsdWUgdG8gYSByYW5nZS5cbmZ1bmN0aW9uIGNsaXAgKG4sIG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCBuKSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQge1xuICAgIGluaXRPcHRMaXN0LFxuICAgIGQzdHN2LFxuICAgIGQzanNvbixcbiAgICBkZWVwYyxcbiAgICBwYXJzZUNvb3JkcyxcbiAgICBmb3JtYXRDb29yZHMsXG4gICAgb3ZlcmxhcHMsXG4gICAgc3VidHJhY3QsXG4gICAgb2JqMmxpc3QsXG4gICAgc2FtZSxcbiAgICBnZXRDYXJldFJhbmdlLFxuICAgIHNldENhcmV0UmFuZ2UsXG4gICAgc2V0Q2FyZXRQb3NpdGlvbixcbiAgICBtb3ZlQ2FyZXRQb3NpdGlvbixcbiAgICBnZXRDYXJldFBvc2l0aW9uLFxuICAgIGNvb3Jkc0FmdGVyVHJhbnNmb3JtLFxuICAgIHJlbW92ZUR1cHMsXG4gICAgY2xpcFxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgQ29tcG9uZW50IHtcbiAgICAvLyBhcHAgLSB0aGUgb3duaW5nIGFwcCBvYmplY3RcbiAgICAvLyBlbHQgbWF5IGJlIGEgc3RyaW5nIChzZWxlY3RvciksIGEgRE9NIG5vZGUsIG9yIGEgZDMgc2VsZWN0aW9uIG9mIDEgbm9kZS5cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcblx0dGhpcy5hcHAgPSBhcHBcblx0aWYgKHR5cGVvZihlbHQpID09PSBcInN0cmluZ1wiKVxuXHQgICAgLy8gZWx0IGlzIGEgQ1NTIHNlbGVjdG9yXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5zZWxlY3RBbGwpID09PSBcImZ1bmN0aW9uXCIpXG5cdCAgICAvLyBlbHQgaXMgYSBkMyBzZWxlY3Rpb25cblx0ICAgIHRoaXMucm9vdCA9IGVsdDtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSkgPT09IFwiZnVuY3Rpb25cIilcblx0ICAgIC8vIGVsdCBpcyBhIERPTSBub2RlXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRlIG1lXG4gICAgfVxufVxuXG5leHBvcnQgeyBDb21wb25lbnQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0NvbXBvbmVudC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBGZWF0dXJlIHtcbiAgICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG4gICAgICAgIHRoaXMuY2hyICAgICA9IGNmZy5jaHIgfHwgY2ZnLmNocm9tb3NvbWU7XG4gICAgICAgIHRoaXMuc3RhcnQgICA9IGNmZy5zdGFydDtcbiAgICAgICAgdGhpcy5lbmQgICAgID0gY2ZnLmVuZDtcbiAgICAgICAgdGhpcy5zdHJhbmQgID0gY2ZnLnN0cmFuZDtcbiAgICAgICAgdGhpcy50eXBlICAgID0gY2ZnLnR5cGU7XG4gICAgICAgIHRoaXMuYmlvdHlwZSA9IGNmZy5iaW90eXBlO1xuICAgICAgICB0aGlzLm1ncGlkICAgPSBjZmcubWdwaWQgfHwgY2ZnLmlkO1xuICAgICAgICB0aGlzLm1naWlkICAgPSBjZmcubWdpaWQ7XG4gICAgICAgIHRoaXMuc3ltYm9sICA9IGNmZy5zeW1ib2w7XG4gICAgICAgIHRoaXMuZ2Vub21lICA9IGNmZy5nZW5vbWU7XG5cdHRoaXMuY29udGlnICA9IHBhcnNlSW50KGNmZy5jb250aWcpO1xuXHR0aGlzLmxhbmUgICAgPSBwYXJzZUludChjZmcubGFuZSk7XG4gICAgICAgIGlmICh0aGlzLm1naWlkID09PSBcIi5cIikgdGhpcy5tZ2lpZCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLnN5bWJvbCA9PT0gXCIuXCIpIHRoaXMuc3ltYm9sID0gbnVsbDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IElEICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdwaWQ7XG4gICAgfVxuICAgIGdldCBjYW5vbmljYWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZ2lpZDtcbiAgICB9XG4gICAgZ2V0IGlkICgpIHtcblx0Ly8gRklYTUU6IHJlbW92ZSB0aGlzIG1ldGhvZFxuICAgICAgICByZXR1cm4gdGhpcy5tZ2lpZCB8fCB0aGlzLm1ncGlkO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgbGFiZWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2wgfHwgdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGxlbmd0aCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuZCAtIHRoaXMuc3RhcnQgKyAxO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRNdW5nZWRUeXBlICgpIHtcblx0cmV0dXJuIHRoaXMudHlwZSA9PT0gXCJnZW5lXCIgP1xuXHQgICAgKHRoaXMuYmlvdHlwZSA9PT0gXCJwcm90ZWluX2NvZGluZ1wiIHx8IHRoaXMuYmlvdHlwZSA9PT0gXCJwcm90ZWluIGNvZGluZyBnZW5lXCIpID9cblx0XHRcInByb3RlaW5fY29kaW5nX2dlbmVcIlxuXHRcdDpcblx0XHR0aGlzLmJpb3R5cGUuaW5kZXhPZihcInBzZXVkb2dlbmVcIikgPj0gMCA/XG5cdFx0ICAgIFwicHNldWRvZ2VuZVwiXG5cdFx0ICAgIDpcblx0XHQgICAgKHRoaXMuYmlvdHlwZS5pbmRleE9mKFwiUk5BXCIpID49IDAgfHwgdGhpcy5iaW90eXBlLmluZGV4T2YoXCJhbnRpc2Vuc2VcIikgPj0gMCkgP1xuXHRcdFx0XCJuY1JOQV9nZW5lXCJcblx0XHRcdDpcblx0XHRcdHRoaXMuYmlvdHlwZS5pbmRleE9mKFwic2VnbWVudFwiKSA+PSAwID9cblx0XHRcdCAgICBcImdlbmVfc2VnbWVudFwiXG5cdFx0XHQgICAgOlxuXHRcdFx0ICAgIFwib3RoZXJfZ2VuZVwiXG5cdCAgICA6XG5cdCAgICB0aGlzLnR5cGUgPT09IFwicHNldWRvZ2VuZVwiID9cblx0XHRcInBzZXVkb2dlbmVcIlxuXHRcdDpcblx0XHR0aGlzLnR5cGUuaW5kZXhPZihcImdlbmVfc2VnbWVudFwiKSA+PSAwID9cblx0XHQgICAgXCJnZW5lX3NlZ21lbnRcIlxuXHRcdCAgICA6XG5cdFx0ICAgIHRoaXMudHlwZS5pbmRleE9mKFwiUk5BXCIpID49IDAgP1xuXHRcdFx0XCJuY1JOQV9nZW5lXCJcblx0XHRcdDpcblx0XHRcdHRoaXMudHlwZS5pbmRleE9mKFwiZ2VuZVwiKSA+PSAwID9cblx0XHRcdCAgICBcIm90aGVyX2dlbmVcIlxuXHRcdFx0ICAgIDpcblx0XHRcdCAgICBcIm90aGVyX2ZlYXR1cmVfdHlwZVwiO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgRmVhdHVyZSB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmVhdHVyZS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBQUkVGSVg9XCJhcHBzLm1ndi5cIjtcbiBcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW50ZXJhY3RzIHdpdGggbG9jYWxTdG9yYWdlLlxuLy9cbmNsYXNzIFN0b3JhZ2VNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSwgc3RvcmFnZSkge1xuXHR0aGlzLm5hbWUgPSBQUkVGSVgrbmFtZTtcblx0dGhpcy5zdG9yYWdlID0gc3RvcmFnZTtcblx0dGhpcy5teURhdGFPYmogPSBudWxsO1xuXHQvL1xuXHR0aGlzLl9sb2FkKCk7XG4gICAgfVxuICAgIF9sb2FkICgpIHtcblx0Ly8gbG9hZHMgbXlEYXRhT2JqIGZyb20gc3RvcmFnZVxuICAgICAgICBsZXQgcyA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKHRoaXMubmFtZSk7XG5cdHRoaXMubXlEYXRhT2JqID0gcyA/IEpTT04ucGFyc2UocykgOiB7fTtcbiAgICB9XG4gICAgX3NhdmUgKCkge1xuXHQvLyB3cml0ZXMgbXlEYXRhT2JqIHRvIHN0b3JhZ2VcbiAgICAgICAgbGV0IHMgPSBKU09OLnN0cmluZ2lmeSh0aGlzLm15RGF0YU9iaik7XG5cdHRoaXMuc3RvcmFnZS5zZXRJdGVtKHRoaXMubmFtZSwgcylcbiAgICB9XG4gICAgZ2V0IChuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm15RGF0YU9ialtuXTtcbiAgICB9XG4gICAgcHV0IChuLCB2KSB7XG4gICAgICAgIHRoaXMubXlEYXRhT2JqW25dID0gdjtcblx0dGhpcy5fc2F2ZSgpO1xuICAgIH1cbn1cbi8vXG5jbGFzcyBTZXNzaW9uU3RvcmFnZU1hbmFnZXIgZXh0ZW5kcyBTdG9yYWdlTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUpIHtcbiAgICAgICAgc3VwZXIobmFtZSwgd2luZG93LnNlc3Npb25TdG9yYWdlKTtcbiAgICB9XG59XG4vL1xuY2xhc3MgTG9jYWxTdG9yYWdlTWFuYWdlciBleHRlbmRzIFN0b3JhZ2VNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSkge1xuICAgICAgICBzdXBlcihuYW1lLCB3aW5kb3cubG9jYWxTdG9yYWdlKTtcbiAgICB9XG59XG4vL1xuZXhwb3J0IHsgU2Vzc2lvblN0b3JhZ2VNYW5hZ2VyLCBMb2NhbFN0b3JhZ2VNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9TdG9yYWdlTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBhcnNlcyBhIGxpc3Qgb3BlcmF0b3IgZXhwcmVzc2lvbiwgZWcgXCIoYSArIGIpKmMgLSBkXCJcbi8vIFJldHVybnMgYW4gYWJzdHJhY3Qgc3ludGF4IHRyZWUuXG4vLyAgICAgTGVhZiBub2RlcyA9IGxpc3QgbmFtZXMuIFRoZXkgYXJlIHNpbXBsZSBzdHJpbmdzLlxuLy8gICAgIEludGVyaW9yIG5vZGVzID0gb3BlcmF0aW9ucy4gVGhleSBsb29rIGxpa2U6IHtsZWZ0Om5vZGUsIG9wOnN0cmluZywgcmlnaHQ6bm9kZX1cbi8vIFxuY2xhc3MgTGlzdEZvcm11bGFQYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcblx0dGhpcy5yX29wICAgID0gL1srLV0vO1xuXHR0aGlzLnJfb3AyICAgPSAvWypdLztcblx0dGhpcy5yX29wcyAgID0gL1soKSsqLV0vO1xuXHR0aGlzLnJfaWRlbnQgPSAvW2EtekEtWl9dW2EtekEtWjAtOV9dKi87XG5cdHRoaXMucl9xc3RyICA9IC9cIlteXCJdKlwiLztcblx0dGhpcy5yZSA9IG5ldyBSZWdFeHAoYCgke3RoaXMucl9vcHMuc291cmNlfXwke3RoaXMucl9xc3RyLnNvdXJjZX18JHt0aGlzLnJfaWRlbnQuc291cmNlfSlgLCAnZycpO1xuXHQvL3RoaXMucmUgPSAvKFsoKSsqLV18XCJbXlwiXStcInxbYS16QS1aX11bYS16QS1aMC05X10qKS9nXG5cdHRoaXMuX2luaXQoXCJcIik7XG4gICAgfVxuICAgIF9pbml0IChzKSB7XG4gICAgICAgIHRoaXMuZXhwciA9IHM7XG5cdHRoaXMudG9rZW5zID0gdGhpcy5leHByLm1hdGNoKHRoaXMucmUpIHx8IFtdO1xuXHR0aGlzLmkgPSAwO1xuICAgIH1cbiAgICBfcGVla1Rva2VuKCkge1xuXHRyZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5pXTtcbiAgICB9XG4gICAgX25leHRUb2tlbiAoKSB7XG5cdGxldCB0O1xuICAgICAgICBpZiAodGhpcy5pIDwgdGhpcy50b2tlbnMubGVuZ3RoKSB7XG5cdCAgICB0ID0gdGhpcy50b2tlbnNbdGhpcy5pXTtcblx0ICAgIHRoaXMuaSArPSAxO1xuXHR9XG5cdHJldHVybiB0O1xuICAgIH1cbiAgICBfZXhwciAoKSB7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fdGVybSgpO1xuXHRsZXQgb3AgPSB0aGlzLl9wZWVrVG9rZW4oKTtcblx0aWYgKG9wID09PSBcIitcIiB8fCBvcCA9PT0gXCItXCIpIHtcblx0ICAgIHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgbm9kZSA9IHsgbGVmdDpub2RlLCBvcDpvcD09PVwiK1wiP1widW5pb25cIjpcImRpZmZlcmVuY2VcIiwgcmlnaHQ6IHRoaXMuX2V4cHIoKSB9XG5cdCAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfSAgICAgICAgICAgICAgIFxuXHRlbHNlIGlmIChvcCA9PT0gXCIpXCIgfHwgb3AgPT09IHVuZGVmaW5lZCB8fCBvcCA9PT0gbnVsbClcblx0ICAgIHJldHVybiBub2RlO1xuXHRlbHNlXG5cdCAgICB0aGlzLl9lcnJvcihcIlVOSU9OIG9yIElOVEVSU0VDVElPTiBvciApIG9yIE5VTExcIiwgb3ApO1xuICAgIH1cbiAgICBfdGVybSAoKSB7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fZmFjdG9yKCk7XG5cdGxldCBvcCA9IHRoaXMuX3BlZWtUb2tlbigpO1xuXHRpZiAob3AgPT09IFwiKlwiKSB7XG5cdCAgICB0aGlzLl9uZXh0VG9rZW4oKTtcblx0ICAgIG5vZGUgPSB7IGxlZnQ6bm9kZSwgb3A6XCJpbnRlcnNlY3Rpb25cIiwgcmlnaHQ6IHRoaXMuX2ZhY3RvcigpIH1cblx0fVxuXHRyZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgX2ZhY3RvciAoKSB7XG4gICAgICAgIGxldCB0ID0gdGhpcy5fbmV4dFRva2VuKCk7XG5cdGlmICh0ID09PSBcIihcIil7XG5cdCAgICBsZXQgbm9kZSA9IHRoaXMuX2V4cHIoKTtcblx0ICAgIGxldCBudCA9IHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgaWYgKG50ICE9PSBcIilcIikgdGhpcy5fZXJyb3IoXCInKSdcIiwgbnQpO1xuXHQgICAgcmV0dXJuIG5vZGU7XG5cdH1cblx0ZWxzZSBpZiAodCAmJiAodC5zdGFydHNXaXRoKCdcIicpKSkge1xuXHQgICAgcmV0dXJuIHQuc3Vic3RyaW5nKDEsIHQubGVuZ3RoLTEpO1xuXHR9XG5cdGVsc2UgaWYgKHQgJiYgdC5tYXRjaCgvW2EtekEtWl9dLykpIHtcblx0ICAgIHJldHVybiB0O1xuXHR9XG5cdGVsc2Vcblx0ICAgIHRoaXMuX2Vycm9yKFwiRVhQUiBvciBJREVOVFwiLCB0fHxcIk5VTExcIik7XG5cdHJldHVybiB0O1xuXHQgICAgXG4gICAgfVxuICAgIF9lcnJvciAoZXhwZWN0ZWQsIHNhdykge1xuICAgICAgICB0aHJvdyBgUGFyc2UgZXJyb3I6IGV4cGVjdGVkICR7ZXhwZWN0ZWR9IGJ1dCBzYXcgJHtzYXd9LmA7XG4gICAgfVxuICAgIC8vIFBhcnNlcyB0aGUgc3RyaW5nIGFuZCByZXR1cm5zIHRoZSBhYnN0cmFjdCBzeW50YXggdHJlZS5cbiAgICAvLyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIHRoZXJlIGlzIGEgc3ludGF4IGVycm9yLlxuICAgIHBhcnNlIChzKSB7XG5cdHRoaXMuX2luaXQocyk7XG5cdHJldHVybiB0aGlzLl9leHByKCk7XG4gICAgfVxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZmYgc3RyaW5nIGlzIHN5bnRhY3RpY2FsbHkgdmFsaWRcbiAgICBpc1ZhbGlkIChzKSB7XG4gICAgICAgIHRyeSB7XG5cdCAgICB0aGlzLnBhcnNlKHMpO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdH1cblx0Y2F0Y2ggKGUpIHtcblx0ICAgIHJldHVybiBmYWxzZTtcblx0fVxuICAgIH1cbn1cblxuZXhwb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0xpc3RGb3JtdWxhUGFyc2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBTVkdWaWV3IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQsIG1hcmdpbnMsIHJvdGF0aW9uLCB0cmFuc2xhdGlvbikge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG4gICAgICAgIHRoaXMuc3ZnID0gdGhpcy5yb290LnNlbGVjdChcInN2Z1wiKTtcbiAgICAgICAgdGhpcy5zdmdNYWluID0gdGhpcy5zdmdcbiAgICAgICAgICAgIC5hcHBlbmQoXCJnXCIpICAgIC8vIHRoZSBtYXJnaW4tdHJhbnNsYXRlZCBncm91cFxuICAgICAgICAgICAgLmFwcGVuZChcImdcIilcdCAgLy8gbWFpbiBncm91cCBmb3IgdGhlIGRyYXdpbmdcblx0ICAgIC5hdHRyKFwibmFtZVwiLFwic3ZnbWFpblwiKTtcblx0dGhpcy5vdXRlcldpZHRoID0gMTAwO1xuXHR0aGlzLndpZHRoID0gMTAwO1xuXHR0aGlzLm91dGVySGVpZ2h0ID0gMTAwO1xuXHR0aGlzLmhlaWdodCA9IDEwMDtcblx0dGhpcy5tYXJnaW5zID0ge3RvcDogMTgsIHJpZ2h0OiAxMiwgYm90dG9tOiAxMiwgbGVmdDogMTJ9O1xuXHR0aGlzLnJvdGF0aW9uID0gMDtcblx0dGhpcy50cmFuc2xhdGlvbiA9IFswLDBdO1xuXHQvL1xuICAgICAgICB0aGlzLnNldEdlb20oe3dpZHRoLCBoZWlnaHQsIG1hcmdpbnMsIHJvdGF0aW9uLCB0cmFuc2xhdGlvbn0pO1xuICAgIH1cbiAgICBzZXRHZW9tIChjZmcpIHtcbiAgICAgICAgdGhpcy5vdXRlcldpZHRoICA9IGNmZy53aWR0aCAgICAgICB8fCB0aGlzLm91dGVyV2lkdGg7XG4gICAgICAgIHRoaXMub3V0ZXJIZWlnaHQgPSBjZmcuaGVpZ2h0ICAgICAgfHwgdGhpcy5vdXRlckhlaWdodDtcbiAgICAgICAgdGhpcy5tYXJnaW5zICAgICA9IGNmZy5tYXJnaW5zICAgICB8fCB0aGlzLm1hcmdpbnM7XG5cdHRoaXMucm90YXRpb24gICAgPSB0eXBlb2YoY2ZnLnJvdGF0aW9uKSA9PT0gXCJudW1iZXJcIiA/IGNmZy5yb3RhdGlvbiA6IHRoaXMucm90YXRpb247XG5cdHRoaXMudHJhbnNsYXRpb24gPSBjZmcudHJhbnNsYXRpb24gfHwgdGhpcy50cmFuc2xhdGlvbjtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy53aWR0aCAgPSB0aGlzLm91dGVyV2lkdGggIC0gdGhpcy5tYXJnaW5zLmxlZnQgLSB0aGlzLm1hcmdpbnMucmlnaHQ7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5vdXRlckhlaWdodCAtIHRoaXMubWFyZ2lucy50b3AgIC0gdGhpcy5tYXJnaW5zLmJvdHRvbTtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy5zdmcuYXR0cihcIndpZHRoXCIsIHRoaXMub3V0ZXJXaWR0aClcbiAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5vdXRlckhlaWdodClcbiAgICAgICAgICAgIC5zZWxlY3QoJ2dbbmFtZT1cInN2Z21haW5cIl0nKVxuICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7dGhpcy5tYXJnaW5zLmxlZnR9LCR7dGhpcy5tYXJnaW5zLnRvcH0pIHJvdGF0ZSgke3RoaXMucm90YXRpb259KSB0cmFuc2xhdGUoJHt0aGlzLnRyYW5zbGF0aW9uWzBdfSwke3RoaXMudHJhbnNsYXRpb25bMV19KWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2V0TWFyZ2lucyggdG0sIHJtLCBibSwgbG0gKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG5cdCAgICBybSA9IGJtID0gbG0gPSB0bTtcblx0fVxuXHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG5cdCAgICBibSA9IHRtO1xuXHQgICAgbG0gPSBybTtcblx0fVxuXHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSA0KVxuXHQgICAgdGhyb3cgXCJCYWQgYXJndW1lbnRzLlwiO1xuICAgICAgICAvL1xuXHR0aGlzLnNldEdlb20oe3RvcDogdG0sIHJpZ2h0OiBybSwgYm90dG9tOiBibSwgbGVmdDogbG19KTtcblx0Ly9cblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJvdGF0ZSAoZGVnKSB7XG4gICAgICAgIHRoaXMuc2V0R2VvbSh7cm90YXRpb246ZGVnfSk7XG5cdHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0cmFuc2xhdGUgKGR4LCBkeSkge1xuICAgICAgICB0aGlzLnNldEdlb20oe3RyYW5zbGF0aW9uOltkeCxkeV19KTtcblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICB0aGUgd2luZG93IHdpZHRoXG4gICAgZml0VG9XaWR0aCAod2lkdGgpIHtcbiAgICAgICAgbGV0IHIgPSB0aGlzLnN2Z1swXVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy5zZXRHZW9tKHt3aWR0aDogd2lkdGggLSByLnh9KVxuXHRyZXR1cm4gdGhpcztcbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIFNWR1ZpZXdcblxuZXhwb3J0IHsgU1ZHVmlldyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvU1ZHVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBNR1ZBcHAgfSBmcm9tICcuL01HVkFwcCc7XG5pbXBvcnQgeyByZW1vdmVEdXBzIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vL1xuLy8gcHFzdHJpbmcgPSBQYXJzZSBxc3RyaW5nLiBQYXJzZXMgdGhlIHBhcmFtZXRlciBwb3J0aW9uIG9mIHRoZSBVUkwuXG4vL1xuZnVuY3Rpb24gcHFzdHJpbmcgKHFzdHJpbmcpIHtcbiAgICAvL1xuICAgIGxldCBjZmcgPSB7fTtcblxuICAgIC8vIEZJWE1FOiBVUkxTZWFyY2hQYXJhbXMgQVBJIGlzIG5vdCBzdXBwb3J0ZWQgaW4gYWxsIGJyb3dzZXJzLlxuICAgIC8vIE9LIGZvciBkZXZlbG9wbWVudCBidXQgbmVlZCBhIGZhbGxiYWNrIGV2ZW50dWFsbHkuXG4gICAgbGV0IHBybXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHFzdHJpbmcpO1xuICAgIGxldCBnZW5vbWVzID0gW107XG5cbiAgICAvLyAtLS0tLSBnZW5vbWVzIC0tLS0tLS0tLS0tLVxuICAgIGxldCBwZ2Vub21lcyA9IHBybXMuZ2V0KFwiZ2Vub21lc1wiKSB8fCBcIlwiO1xuICAgIC8vIEZvciBub3csIGFsbG93IFwiY29tcHNcIiBhcyBzeW5vbnltIGZvciBcImdlbm9tZXNcIi4gRXZlbnR1YWxseSwgZG9uJ3Qgc3VwcG9ydCBcImNvbXBzXCIuXG4gICAgcGdlbm9tZXMgPSAocGdlbm9tZXMgKyAgXCIgXCIgKyAocHJtcy5nZXQoXCJjb21wc1wiKSB8fCBcIlwiKSk7XG4gICAgLy9cbiAgICBwZ2Vub21lcyA9IHJlbW92ZUR1cHMocGdlbm9tZXMudHJpbSgpLnNwbGl0KC8gKy8pKTtcbiAgICBwZ2Vub21lcy5sZW5ndGggPiAwICYmIChjZmcuZ2Vub21lcyA9IHBnZW5vbWVzKTtcblxuICAgIC8vIC0tLS0tIHJlZiBnZW5vbWUgLS0tLS0tLS0tLS0tXG4gICAgbGV0IHJlZiA9IHBybXMuZ2V0KFwicmVmXCIpO1xuICAgIHJlZiAmJiAoY2ZnLnJlZiA9IHJlZik7XG5cbiAgICAvLyAtLS0tLSBoaWdobGlnaHQgSURzIC0tLS0tLS0tLS0tLS0tXG4gICAgbGV0IGhscyA9IG5ldyBTZXQoKTtcbiAgICBsZXQgaGxzMCA9IHBybXMuZ2V0KFwiaGlnaGxpZ2h0XCIpO1xuICAgIGlmIChobHMwKSB7XG5cdGhsczAgPSBobHMwLnJlcGxhY2UoL1sgLF0rL2csICcgJykuc3BsaXQoJyAnKS5maWx0ZXIoeD0+eCk7XG5cdGhsczAubGVuZ3RoID4gMCAmJiAoY2ZnLmhpZ2hsaWdodCA9IGhsczApO1xuICAgIH1cblxuICAgIC8vIC0tLS0tIGNvb3JkaW5hdGVzIC0tLS0tLS0tLS0tLS0tXG4gICAgLy9cbiAgICBsZXQgY2hyICAgPSBwcm1zLmdldChcImNoclwiKTtcbiAgICBsZXQgc3RhcnQgPSBwcm1zLmdldChcInN0YXJ0XCIpO1xuICAgIGxldCBlbmQgICA9IHBybXMuZ2V0KFwiZW5kXCIpO1xuICAgIGNociAgICYmIChjZmcuY2hyID0gY2hyKTtcbiAgICBzdGFydCAmJiAoY2ZnLnN0YXJ0ID0gcGFyc2VJbnQoc3RhcnQpKTtcbiAgICBlbmQgICAmJiAoY2ZnLmVuZCA9IHBhcnNlSW50KGVuZCkpO1xuICAgIC8vXG4gICAgbGV0IGxhbmRtYXJrID0gcHJtcy5nZXQoXCJsYW5kbWFya1wiKTtcbiAgICBsZXQgZmxhbmsgICAgPSBwcm1zLmdldChcImZsYW5rXCIpO1xuICAgIGxldCBsZW5ndGggICA9IHBybXMuZ2V0KFwibGVuZ3RoXCIpO1xuICAgIGxldCBkZWx0YSAgICA9IHBybXMuZ2V0KFwiZGVsdGFcIik7XG4gICAgbGFuZG1hcmsgJiYgKGNmZy5sYW5kbWFyayA9IGxhbmRtYXJrKTtcbiAgICBmbGFuayAgICAmJiAoY2ZnLmZsYW5rID0gcGFyc2VJbnQoZmxhbmspKTtcbiAgICBsZW5ndGggICAmJiAoY2ZnLmxlbmd0aCA9IHBhcnNlSW50KGxlbmd0aCkpO1xuICAgIGRlbHRhICAgICYmIChjZmcuZGVsdGEgPSBwYXJzZUludChkZWx0YSkpO1xuICAgIC8vXG4gICAgLy8gLS0tLS0gZHJhd2luZyBtb2RlIC0tLS0tLS0tLS0tLS1cbiAgICBsZXQgZG1vZGUgPSBwcm1zLmdldChcImRtb2RlXCIpO1xuICAgIGRtb2RlICYmIChjZmcuZG1vZGUgPSBkbW9kZSk7XG4gICAgLy9cbiAgICByZXR1cm4gY2ZnO1xufVxuXG5cbi8vIFRoZSBtYWluIHByb2dyYW0sIHdoZXJlaW4gdGhlIGFwcCBpcyBjcmVhdGVkIGFuZCB3aXJlZCB0byB0aGUgYnJvd3Nlci4gXG4vL1xuZnVuY3Rpb24gX19tYWluX18gKHNlbGVjdG9yKSB7XG4gICAgLy8gQmVob2xkLCB0aGUgTUdWIGFwcGxpY2F0aW9uIG9iamVjdC4uLlxuICAgIGxldCBtZ3YgPSBudWxsO1xuXG4gICAgLy8gQ2FsbGJhY2sgdG8gcGFzcyBpbnRvIHRoZSBhcHAgdG8gcmVnaXN0ZXIgY2hhbmdlcyBpbiBjb250ZXh0LlxuICAgIC8vIFVzZXMgdGhlIGN1cnJlbnQgYXBwIGNvbnRleHQgdG8gc2V0IHRoZSBoYXNoIHBhcnQgb2YgdGhlXG4gICAgLy8gYnJvd3NlcidzIGxvY2F0aW9uLiBUaGlzIGFsc28gcmVnaXN0ZXJzIHRoZSBjaGFuZ2UgaW4gXG4gICAgLy8gdGhlIGJyb3dzZXIgaGlzdG9yeS5cbiAgICBmdW5jdGlvbiBzZXRIYXNoICgpIHtcblx0bGV0IG5ld0hhc2ggPSBtZ3YuZ2V0UGFyYW1TdHJpbmcoKTtcblx0aWYgKCcjJytuZXdIYXNoID09PSB3aW5kb3cubG9jYXRpb24uaGFzaClcblx0ICAgIHJldHVybjtcblx0Ly8gdGVtcG9yYXJpbHkgZGlzYWJsZSBwb3BzdGF0ZSBoYW5kbGVyXG5cdGxldCBmID0gd2luZG93Lm9ucG9wc3RhdGU7XG5cdHdpbmRvdy5vbnBvcHN0YXRlID0gbnVsbDtcblx0Ly8gbm93IHNldCB0aGUgaGFzaFxuXHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IG5ld0hhc2g7XG5cdC8vIHJlLWVuYWJsZVxuXHR3aW5kb3cub25wb3BzdGF0ZSA9IGY7XG4gICAgfVxuICAgIC8vIEhhbmRsZXIgY2FsbGVkIHdoZW4gdXNlciBjbGlja3MgdGhlIGJyb3dzZXIncyBiYWNrIG9yIGZvcndhcmQgYnV0dG9ucy5cbiAgICAvLyBTZXRzIHRoZSBhcHAncyBjb250ZXh0IGJhc2VkIG9uIHRoZSBoYXNoIHBhcnQgb2YgdGhlIGJyb3dzZXInc1xuICAgIC8vIGxvY2F0aW9uLlxuICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0bGV0IGNmZyA9IHBxc3RyaW5nKGRvY3VtZW50LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcblx0bWd2LnNldENvbnRleHQoY2ZnLCB0cnVlKTtcbiAgICB9O1xuICAgIC8vIGdldCBpbml0aWFsIHNldCBvZiBjb250ZXh0IHBhcmFtcyBcbiAgICBsZXQgcXN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKTtcbiAgICBsZXQgY2ZnID0gcHFzdHJpbmcocXN0cmluZyk7XG4gICAgY2ZnLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgY2ZnLm9uY29udGV4dGNoYW5nZSA9IHNldEhhc2g7XG5cbiAgICAvLyBjcmVhdGUgdGhlIGFwcFxuICAgIHdpbmRvdy5tZ3YgPSBtZ3YgPSBuZXcgTUdWQXBwKHNlbGVjdG9yLCBjZmcpO1xuICAgIFxuICAgIC8vIGhhbmRsZSByZXNpemUgZXZlbnRzXG4gICAgd2luZG93Lm9ucmVzaXplID0gKCkgPT4ge21ndi5yZXNpemUoKTttZ3Yuc2V0Q29udGV4dCh7fSk7fVxufVxuXG5cbl9fbWFpbl9fKFwiI21ndlwiKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL3ZpZXdlci5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBwYXJzZUNvb3JkcywgZm9ybWF0Q29vcmRzLCBkM3RzdiwgaW5pdE9wdExpc3QsIHNhbWUsIGNsaXAgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEdlbm9tZSB9ICAgICAgICAgIGZyb20gJy4vR2Vub21lJztcbmltcG9ydCB7IENvbXBvbmVudCB9ICAgICAgIGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IEZlYXR1cmVNYW5hZ2VyIH0gIGZyb20gJy4vRmVhdHVyZU1hbmFnZXInO1xuaW1wb3J0IHsgUXVlcnlNYW5hZ2VyIH0gICAgZnJvbSAnLi9RdWVyeU1hbmFnZXInO1xuaW1wb3J0IHsgTGlzdE1hbmFnZXIgfSAgICAgZnJvbSAnLi9MaXN0TWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0RWRpdG9yIH0gICAgICBmcm9tICcuL0xpc3RFZGl0b3InO1xuaW1wb3J0IHsgVXNlclByZWZzTWFuYWdlciB9IGZyb20gJy4vVXNlclByZWZzTWFuYWdlcic7XG5pbXBvcnQgeyBGYWNldE1hbmFnZXIgfSAgICBmcm9tICcuL0ZhY2V0TWFuYWdlcic7XG5pbXBvcnQgeyBCVE1hbmFnZXIgfSAgICAgICBmcm9tICcuL0JUTWFuYWdlcic7XG5pbXBvcnQgeyBHZW5vbWVWaWV3IH0gICAgICBmcm9tICcuL0dlbm9tZVZpZXcnO1xuaW1wb3J0IHsgRmVhdHVyZURldGFpbHMgfSAgZnJvbSAnLi9GZWF0dXJlRGV0YWlscyc7XG5pbXBvcnQgeyBab29tVmlldyB9ICAgICAgICBmcm9tICcuL1pvb21WaWV3JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBNR1ZBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChzZWxlY3RvciwgY2ZnKSB7XG5cdHN1cGVyKG51bGwsIHNlbGVjdG9yKTtcblx0dGhpcy5hcHAgPSB0aGlzO1xuXHQvL1xuXHR0aGlzLmluaXRpYWxDZmcgPSBjZmc7XG5cdC8vXG5cdHRoaXMuY29udGV4dENoYW5nZWQgPSAoY2ZnLm9uY29udGV4dGNoYW5nZSB8fCBmdW5jdGlvbigpe30pO1xuXHQvL1xuXHR0aGlzLm5hbWUyZ2Vub21lID0ge307ICAvLyBtYXAgZnJvbSBnZW5vbWUgbmFtZSAtPiBnZW5vbWUgZGF0YSBvYmpcblx0dGhpcy5sYWJlbDJnZW5vbWUgPSB7fTsgLy8gbWFwIGZyb20gZ2Vub21lIGxhYmVsIC0+IGdlbm9tZSBkYXRhIG9ialxuXHR0aGlzLm5sMmdlbm9tZSA9IHt9OyAgICAvLyBjb21iaW5lcyBpbmRleGVzXG5cdC8vXG5cdHRoaXMuYWxsR2Vub21lcyA9IFtdOyAgIC8vIGxpc3Qgb2YgYWxsIGF2YWlsYWJsZSBnZW5vbWVzXG5cdHRoaXMuckdlbm9tZSA9IG51bGw7ICAgIC8vIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBnZW5vbWVcblx0dGhpcy5jR2Vub21lcyA9IFtdOyAgICAgLy8gY3VycmVudCBjb21wYXJpc29uIGdlbm9tZXMgKHJHZW5vbWUgaXMgKm5vdCogaW5jbHVkZWQpLlxuXHR0aGlzLnZHZW5vbWVzID0gW107XHQvLyBsaXN0IG9mIGFsbCBjdXJyZW50eSB2aWV3ZWQgZ2Vub21lcyAocmVmK2NvbXBzKSBpbiBZLW9yZGVyLlxuXHQvL1xuXHR0aGlzLmR1ciA9IDI1MDsgICAgICAgICAvLyBhbmltYXRpb24gZHVyYXRpb24sIGluIG1zXG5cdHRoaXMuZGVmYXVsdFpvb20gPSAyO1x0Ly8gbXVsdGlwbGllciBvZiBjdXJyZW50IHJhbmdlIHdpZHRoLiBNdXN0IGJlID49IDEuIDEgPT0gbm8gem9vbS5cblx0XHRcdFx0Ly8gKHpvb21pbmcgaW4gdXNlcyAxL3RoaXMgYW1vdW50KVxuXHR0aGlzLmRlZmF1bHRQYW4gID0gMC4xNTsvLyBmcmFjdGlvbiBvZiBjdXJyZW50IHJhbmdlIHdpZHRoXG5cblx0Ly8gQ29vcmRpbmF0ZXMgbWF5IGJlIHNwZWNpZmllZCBpbiBvbmUgb2YgdHdvIHdheXM6IG1hcHBlZCBvciBsYW5kbWFyay4gXG5cdC8vIE1hcHBlZCBjb29yZGluYXRlcyBhcmUgc3BlY2lmaWVkIGFzIGNocm9tb3NvbWUrc3RhcnQrZW5kLiBUaGlzIGNvb3JkaW5hdGUgcmFuZ2UgaXMgZGVmaW5lZCByZWxhdGl2ZSB0byBcblx0Ly8gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZSwgYW5kIGlzIG1hcHBlZCB0byB0aGUgY29ycmVzcG9uZGluZyByYW5nZShzKSBpbiBlYWNoIGNvbXBhcmlzb24gZ2Vub21lLlxuXHQvLyBMYW5kbWFyayBjb29yZGluYXRlcyBhcmUgc3BlY2lmaWVkIGFzIGxhbmRtYXJrK1tmbGFua3x3aWR0aF0rZGVsdGEuIFRoZSBsYW5kbWFyayBpcyBsb29rZWQgdXAgaW4gZWFjaCBcblx0Ly8gZ2Vub21lLiBJdHMgY29vcmRpbmF0ZXMsIGNvbWJpbmVkIHdpdGggZmxhbmt8bGVuZ3RoIGFuZCBkZWx0YSwgZGV0ZXJtaW5lIHRoZSBhYnNvbHV0ZSBjb29yZGluYXRlIHJhbmdlXG5cdC8vIGluIHRoYXQgZ2Vub21lLiBJZiB0aGUgbGFuZG1hcmsgZG9lcyBub3QgZXhpc3QgaW4gYSBnaXZlbiBnZW5vbWUsIHRoZW4gbWFwcGVkIGNvb3JkaW5hdGUgYXJlIHVzZWQuXG5cdC8vIFxuXHR0aGlzLmNtb2RlID0gJ21hcHBlZCcgLy8gJ21hcHBlZCcgb3IgJ2xhbmRtYXJrJ1xuXHR0aGlzLmNvb3JkcyA9IHsgY2hyOiAnMScsIHN0YXJ0OiAxMDAwMDAwLCBlbmQ6IDEwMDAwMDAwIH07ICAvLyBtYXBwZWRcblx0dGhpcy5sY29vcmRzID0geyBsYW5kbWFyazogJ1BheDYnLCBmbGFuazogNTAwMDAwLCBkZWx0YTowIH07Ly8gbGFuZG1hcmtcblxuXHQvL1xuXHQvLyBUT0RPOiByZWZhY3RvciBwYWdlYm94LCBkcmFnZ2FibGUsIGFuZCBmcmllbmRzIGludG8gYSBmcmFtZXdvcmsgbW9kdWxlLFxuXHQvLyBcblx0dGhpcy5wYkRyYWdnZXIgPSB0aGlzLmdldENvbnRlbnREcmFnZ2VyKCk7XG5cdGQzLnNlbGVjdEFsbCgnLnBhZ2Vib3gnKVxuXHQgICAgLmNhbGwodGhpcy5wYkRyYWdnZXIpXG5cdCAgICAuYXBwZW5kKCdpJylcblx0ICAgIC5hdHRyKCdjbGFzcycsJ21hdGVyaWFsLWljb25zIGJ1c3kgcm90YXRpbmcnKVxuXHQgICAgO1xuXHRkMy5zZWxlY3RBbGwoJy5jbG9zYWJsZScpXG5cdCAgICAuYXBwZW5kKCdpJylcblx0XHQuYXR0cignY2xhc3MnLCdtYXRlcmlhbC1pY29ucyBidXR0b24gY2xvc2UnKVxuXHRcdC5hdHRyKCd0aXRsZScsJ0NsaWNrIHRvIG9wZW4vY2xvc2UuJylcblx0XHQub24oJ2NsaWNrLmRlZmF1bHQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0ICAgIGxldCBwID0gZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSk7XG5cdFx0ICAgIHAuY2xhc3NlZCgnY2xvc2VkJywgISBwLmNsYXNzZWQoJ2Nsb3NlZCcpKTtcblx0XHQgICAgZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ3RpdGxlJywnQ2xpY2sgdG8gJyArICAocC5jbGFzc2VkKCdjbG9zZWQnKSA/ICdvcGVuJyA6ICdjbG9zZScpICsgJy4nKVxuXHRcdCAgICBzZWxmLnNldFByZWZzRnJvbVVJKCk7XG5cdFx0fSk7XG5cdGQzLnNlbGVjdEFsbCgnLmNvbnRlbnQtZHJhZ2dhYmxlID4gKicpXG5cdCAgICAuYXBwZW5kKCdpJylcblx0XHQuYXR0cigndGl0bGUnLCdEcmFnIHVwL2Rvd24gdG8gcmVwb3NpdGlvbi4nKVxuXHRcdC5hdHRyKCdjbGFzcycsJ21hdGVyaWFsLWljb25zIGJ1dHRvbiBkcmFnaGFuZGxlJyk7XG5cblx0Ly8gXG4gICAgICAgIGQzLnNlbGVjdCgnI3N0YXR1c01lc3NhZ2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHsgdGhpcy5zaG93U3RhdHVzKGZhbHNlKTsgfSk7XG5cdFxuXHQvL1xuXHQvL1xuXHR0aGlzLmdlbm9tZVZpZXcgPSBuZXcgR2Vub21lVmlldyh0aGlzLCAnI2dlbm9tZVZpZXcnLCA4MDAsIDI1MCk7XG5cdHRoaXMuem9vbVZpZXcgICA9IG5ldyBab29tVmlldyAgKHRoaXMsICcjem9vbVZpZXcnLCA4MDAsIDI1MCwgdGhpcy5jb29yZHMpO1xuXHR0aGlzLnJlc2l6ZSgpO1xuICAgICAgICAvL1xuXHR0aGlzLmZlYXR1cmVEZXRhaWxzID0gbmV3IEZlYXR1cmVEZXRhaWxzKHRoaXMsICcjZmVhdHVyZURldGFpbHMnKTtcblxuXHR0aGlzLmNzY2FsZSA9IGQzLnNjYWxlLmNhdGVnb3J5MTAoKS5kb21haW4oW1xuXHQgICAgJ3Byb3RlaW5fY29kaW5nX2dlbmUnLFxuXHQgICAgJ3BzZXVkb2dlbmUnLFxuXHQgICAgJ25jUk5BX2dlbmUnLFxuXHQgICAgJ2dlbmVfc2VnbWVudCcsXG5cdCAgICAnb3RoZXJfZ2VuZScsXG5cdCAgICAnb3RoZXJfZmVhdHVyZV90eXBlJ1xuXHRdKTtcblx0Ly9cblx0Ly9cblx0dGhpcy5saXN0TWFuYWdlciAgICA9IG5ldyBMaXN0TWFuYWdlcih0aGlzLCBcIiNteWxpc3RzXCIpO1xuXHR0aGlzLmxpc3RNYW5hZ2VyLnVwZGF0ZSgpO1xuXHQvL1xuXHR0aGlzLmxpc3RFZGl0b3IgPSBuZXcgTGlzdEVkaXRvcih0aGlzLCAnI2xpc3RlZGl0b3InKTtcblx0Ly9cblx0dGhpcy50cmFuc2xhdG9yICAgICA9IG5ldyBCVE1hbmFnZXIodGhpcyk7XG5cdHRoaXMuZmVhdHVyZU1hbmFnZXIgPSBuZXcgRmVhdHVyZU1hbmFnZXIodGhpcyk7XG5cdC8vXG5cdGxldCBzZWFyY2hUeXBlcyA9IFt7XG5cdCAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeUZ1bmN0aW9uXCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBjZWxsdWxhciBmdW5jdGlvblwiLFxuXHQgICAgdGVtcGxhdGU6IFwiXCIsXG5cdCAgICBwbGFjZWhvbGRlcjogXCJHZW5lIE9udG9sb2d5IChHTykgdGVybXMvSURzXCJcblx0fSx7XG5cdCAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeVBoZW5vdHlwZVwiLFxuXHQgICAgbGFiZWw6IFwiLi4uYnkgbXV0YW50IHBoZW5vdHlwZVwiLFxuXHQgICAgdGVtcGxhdGU6IFwiXCIsXG5cdCAgICBwbGFjZWhvbGRlcjogXCJNYW1tYWxpYW4gUGhlbm90eXBlIChNUCkgdGVybXMvSURzXCJcblx0fSx7XG5cdCAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeURpc2Vhc2VcIixcblx0ICAgIGxhYmVsOiBcIi4uLmJ5IGRpc2Vhc2UgaW1wbGljYXRpb25cIixcblx0ICAgIHRlbXBsYXRlOiBcIlwiLFxuXHQgICAgcGxhY2Vob2xkZXI6IFwiRGlzZWFzZSBPbnRvbG9neSAoRE8pIHRlcm1zL0lEc1wiXG5cdH0se1xuXHQgICAgbWV0aG9kOiBcImZlYXR1cmVzQnlJZFwiLFxuXHQgICAgbGFiZWw6IFwiLi4uYnkgbm9tZW5jbGF0dXJlXCIsXG5cdCAgICB0ZW1wbGF0ZTogXCJcIixcblx0ICAgIHBsYWNlaG9sZGVyOiBcIk1HSSBuYW1lcywgc3lub255bXMsIGV0Yy5cIlxuXHR9XTtcblx0dGhpcy5xdWVyeU1hbmFnZXIgPSBuZXcgUXVlcnlNYW5hZ2VyKHRoaXMsIFwiI2ZpbmRHZW5lc0JveFwiLCBzZWFyY2hUeXBlcyk7XG5cdC8vXG5cdHRoaXMudXNlclByZWZzTWFuYWdlciA9IG5ldyBVc2VyUHJlZnNNYW5hZ2VyKCk7XG5cdC8vXG5cdC8vIEJ1dHRvbjogR2VhciBpY29uIHRvIHNob3cvaGlkZSBsZWZ0IGNvbHVtblxuXHRkMy5zZWxlY3QoXCIjaGVhZGVyID4gLmdlYXIuYnV0dG9uXCIpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IGxjID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJsZWZ0Y29sdW1uXCJdJyk7XG5cdFx0bGMuY2xhc3NlZChcImNsb3NlZFwiLCAoKSA9PiAhIGxjLmNsYXNzZWQoXCJjbG9zZWRcIikpO1xuXHRcdHdpbmRvdy5zZXRUaW1lb3V0KCgpPT57XG5cdFx0ICAgIHRoaXMucmVzaXplKClcblx0XHQgICAgdGhpcy5zZXRDb250ZXh0KHt9KTtcblx0XHQgICAgdGhpcy5zZXRQcmVmc0Zyb21VSSgpO1xuXHRcdH0sIDI1MCk7XG5cdCAgICB9KTtcblx0XG5cdC8vXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRmFjZXRzXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0dGhpcy5mYWNldE1hbmFnZXIgPSBuZXcgRmFjZXRNYW5hZ2VyKHRoaXMpO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0Ly8gRmVhdHVyZS10eXBlIGZhY2V0XG5cdGxldCBmdEZhY2V0ICA9IHRoaXMuZmFjZXRNYW5hZ2VyLmFkZEZhY2V0KFwiRmVhdHVyZVR5cGVcIiwgZiA9PiBmLmdldE11bmdlZFR5cGUoKSk7XG5cdHRoaXMuaW5pdEZlYXRUeXBlQ29udHJvbChmdEZhY2V0KTtcblxuXHQvLyBIYXMtTUdJLWlkIGZhY2V0XG5cdGxldCBtZ2lGYWNldCA9IHRoaXMuZmFjZXRNYW5hZ2VyLmFkZEZhY2V0KFwiSGFzTWdpSWRcIiwgICAgZiA9PiBmLm1naWlkICA/IFwieWVzXCIgOiBcIm5vXCIgKTtcblx0ZDMuc2VsZWN0QWxsKCdpbnB1dFtuYW1lPVwibWdpRmFjZXRcIl0nKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpe1xuXHQgICAgbWdpRmFjZXQuc2V0VmFsdWVzKHRoaXMudmFsdWUgPT09IFwiXCIgPyBbXSA6IFt0aGlzLnZhbHVlXSk7XG5cdCAgICBzZWxmLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9KTtcblxuXHQvLyBJcy1oaWdobGlnaHRlZCBmYWNldFxuXHRsZXQgaGlGYWNldCA9IHRoaXMuZmFjZXRNYW5hZ2VyLmFkZEZhY2V0KFwiSXNIaVwiLCBmID0+IHtcblx0ICAgIGxldCBpc2hpID0gdGhpcy56b29tVmlldy5oaUZlYXRzW2YubWdpaWRdIHx8IHRoaXMuem9vbVZpZXcuaGlGZWF0c1tmLm1ncGlkXTtcblx0ICAgIHJldHVybiBpc2hpID8gXCJ5ZXNcIiA6IFwibm9cIjtcblx0fSk7XG5cdGQzLnNlbGVjdEFsbCgnaW5wdXRbbmFtZT1cImhpRmFjZXRcIl0nKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpe1xuXHQgICAgaGlGYWNldC5zZXRWYWx1ZXModGhpcy52YWx1ZSA9PT0gXCJcIiA/IFtdIDogW3RoaXMudmFsdWVdKTtcblx0ICAgIHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXG5cblx0Ly9cblx0dGhpcy5zZXRVSUZyb21QcmVmcygpO1xuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQvLyBUaGluZ3MgYXJlIGFsbCB3aXJlZCB1cC4gTm93IGxldCdzIGdldCBzb21lIGRhdGEuXG5cdC8vIFN0YXJ0IHdpdGggdGhlIGZpbGUgb2YgYWxsIHRoZSBnZW5vbWVzLlxuXHRkM3RzdihcIi4vZGF0YS9nZW5vbWVMaXN0LnRzdlwiKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHQgICAgLy8gY3JlYXRlIEdlbm9tZSBvYmplY3RzIGZyb20gdGhlIHJhdyBkYXRhLlxuXHQgICAgdGhpcy5hbGxHZW5vbWVzICAgPSBkYXRhLm1hcChnID0+IG5ldyBHZW5vbWUoZykpO1xuXHQgICAgdGhpcy5hbGxHZW5vbWVzLnNvcnQoIChhLGIpID0+IHtcblx0ICAgICAgICByZXR1cm4gYS5sYWJlbCA8IGIubGFiZWwgPyAtMSA6IGEubGFiZWwgPiBiLmxhYmVsID8gKzEgOiAwO1xuXHQgICAgfSk7XG5cdCAgICAvL1xuXHQgICAgLy8gYnVpbGQgYSBuYW1lLT5HZW5vbWUgaW5kZXhcblx0ICAgIHRoaXMubmwyZ2Vub21lID0ge307IC8vIGFsc28gYnVpbGQgdGhlIGNvbWJpbmVkIGxpc3QgYXQgdGhlIHNhbWUgdGltZS4uLlxuXHQgICAgdGhpcy5uYW1lMmdlbm9tZSAgPSB0aGlzLmFsbEdlbm9tZXNcblx0ICAgICAgICAucmVkdWNlKChhY2MsZykgPT4geyB0aGlzLm5sMmdlbm9tZVtnLm5hbWVdID0gYWNjW2cubmFtZV0gPSBnOyByZXR1cm4gYWNjOyB9LCB7fSk7XG5cdCAgICAvLyBidWlsZCBhIGxhYmVsLT5HZW5vbWUgaW5kZXhcblx0ICAgIHRoaXMubGFiZWwyZ2Vub21lID0gdGhpcy5hbGxHZW5vbWVzXG5cdCAgICAgICAgLnJlZHVjZSgoYWNjLGcpID0+IHsgdGhpcy5ubDJnZW5vbWVbZy5sYWJlbF0gPSBhY2NbZy5sYWJlbF0gPSBnOyByZXR1cm4gYWNjOyB9LCB7fSk7XG5cblx0ICAgIC8vIFByZWxvYWQgYWxsIHRoZSBjaHJvbW9zb21lIGZpbGVzIGZvciBhbGwgdGhlIGdlbm9tZXNcblx0ICAgIGxldCBjZHBzID0gdGhpcy5hbGxHZW5vbWVzLm1hcChnID0+IGQzdHN2KGAuL2RhdGEvZ2Vub21lZGF0YS8ke2cubmFtZX0tY2hyb21vc29tZXMudHN2YCkpO1xuXHQgICAgcmV0dXJuIFByb21pc2UuYWxsKGNkcHMpO1xuXHR9LmJpbmQodGhpcykpXG5cdC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG5cblx0ICAgIC8vXG5cdCAgICB0aGlzLnByb2Nlc3NDaHJvbW9zb21lcyhkYXRhKTtcblxuXHQgICAgLy9cblx0ICAgIGxldCBjZmcgPSB0aGlzLnNhbml0aXplQ2ZnKHRoaXMuaW5pdGlhbENmZyk7XG5cdCAgICBsZXQgc2VsZiA9IHRoaXM7XG5cblx0ICAgIC8vIGluaXRpYWxpemUgdGhlIHJlZiBhbmQgY29tcCBnZW5vbWUgb3B0aW9uIGxpc3RzXG5cdCAgICBpbml0T3B0TGlzdChcIiNyZWZHZW5vbWVcIiwgICB0aGlzLmFsbEdlbm9tZXMsIGc9PmcubmFtZSwgZz0+Zy5sYWJlbCwgZmFsc2UsIGcgPT4gZyA9PT0gY2ZnLnJlZik7XG5cdCAgICBpbml0T3B0TGlzdChcIiNjb21wR2Vub21lc1wiLCB0aGlzLmFsbEdlbm9tZXMsIGc9PmcubmFtZSwgZz0+Zy5sYWJlbCwgdHJ1ZSwgIGcgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihnKSAhPT0gLTEpO1xuXHQgICAgZDMuc2VsZWN0KFwiI3JlZkdlbm9tZVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0XHRzZWxmLnNldENvbnRleHQoeyByZWY6IHRoaXMudmFsdWUgfSk7XG5cdCAgICB9KTtcblx0ICAgIGQzLnNlbGVjdChcIiNjb21wR2Vub21lc1wiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0XHRsZXQgc2VsZWN0ZWROYW1lcyA9IFtdO1xuXHRcdGZvcihsZXQgeCBvZiB0aGlzLnNlbGVjdGVkT3B0aW9ucyl7XG5cdFx0ICAgIHNlbGVjdGVkTmFtZXMucHVzaCh4LnZhbHVlKTtcblx0XHR9XG5cdFx0Ly8gd2FudCB0byBwcmVzZXJ2ZSBjdXJyZW50IGdlbm9tZSBvcmRlciBhcyBtdWNoIGFzIHBvc3NpYmxlIFxuXHRcdGxldCBnTmFtZXMgPSBzZWxmLnZHZW5vbWVzLm1hcChnPT5nLm5hbWUpXG5cdFx0ICAgIC5maWx0ZXIobiA9PiB7XG5cdFx0ICAgICAgICByZXR1cm4gc2VsZWN0ZWROYW1lcy5pbmRleE9mKG4pID49IDAgfHwgbiA9PT0gc2VsZi5yR2Vub21lLm5hbWU7XG5cdFx0ICAgIH0pO1xuXHRcdGdOYW1lcyA9IGdOYW1lcy5jb25jYXQoc2VsZWN0ZWROYW1lcy5maWx0ZXIobiA9PiBnTmFtZXMuaW5kZXhPZihuKSA9PT0gLTEpKTtcblx0XHRzZWxmLnNldENvbnRleHQoeyBnZW5vbWVzOiBnTmFtZXMgfSk7XG5cdCAgICB9KTtcblx0ICAgIC8vXG5cdCAgICAvLyBGSU5BTExZISBXZSBhcmUgcmVhZHkgdG8gZHJhdyB0aGUgaW5pdGlhbCBzY2VuZS5cblx0ICAgIHRoaXMuc2V0Q29udGV4dCh0aGlzLmluaXRpYWxDZmcpO1xuXG5cdH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHByb2Nlc3NDaHJvbW9zb21lcyAoZGF0YSkge1xuXHQvLyBkYXRhIGlzIGEgbGlzdCBvZiBjaHJvbW9zb21lIGxpc3RzLCBvbmUgcGVyIGdlbm9tZVxuXHQvLyBGaWxsIGluIHRoZSBnZW5vbWVDaHJzIG1hcCAoZ2Vub21lIC0+IGNociBsaXN0KVxuXHR0aGlzLmFsbEdlbm9tZXMuZm9yRWFjaCgoZyxpKSA9PiB7XG5cdCAgICAvLyBuaWNlbHkgc29ydCB0aGUgY2hyb21vc29tZXNcblx0ICAgIGxldCBjaHJzID0gZGF0YVtpXTtcblx0ICAgIGcubWF4bGVuID0gMDtcblx0ICAgIGNocnMuZm9yRWFjaCggYyA9PiB7XG5cdFx0Ly9cblx0XHRjLmxlbmd0aCA9IHBhcnNlSW50KGMubGVuZ3RoKVxuXHRcdGcubWF4bGVuID0gTWF0aC5tYXgoZy5tYXhsZW4sIGMubGVuZ3RoKTtcblx0XHQvLyBiZWNhdXNlIEknZCByYXRoZXIgc2F5IFwiY2hyb21vc29tZS5uYW1lXCIgdGhhbiBcImNocm9tb3NvbWUuY2hyb21vc29tZVwiXG5cdFx0Yy5uYW1lID0gYy5jaHJvbW9zb21lO1xuXHRcdGRlbGV0ZSBjLmNocm9tb3NvbWU7XG5cdCAgICB9KTtcblx0ICAgIC8vIG5pY2VseSBzb3J0IHRoZSBjaHJvbW9zb21lc1xuXHQgICAgY2hycy5zb3J0KChhLGIpID0+IHtcblx0XHRsZXQgYWEgPSBwYXJzZUludChhLm5hbWUpIC0gcGFyc2VJbnQoYi5uYW1lKTtcblx0XHRpZiAoIWlzTmFOKGFhKSkgcmV0dXJuIGFhO1xuXHRcdHJldHVybiBhLm5hbWUgPCBiLm5hbWUgPyAtMSA6IGEubmFtZSA+IGIubmFtZSA/ICsxIDogMDtcblx0ICAgIH0pO1xuXHQgICAgZy5jaHJvbW9zb21lcyA9IGNocnM7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RG9tICgpIHtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRDb250ZW50RHJhZ2dlciAoKSB7XG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAvLyBIZWxwZXIgZnVuY3Rpb24gZm9yIHRoZSBkcmFnIGJlaGF2aW9yLiBSZW9yZGVycyB0aGUgY29udGVudHMgYmFzZWQgb25cbiAgICAgIC8vIGN1cnJlbnQgc2NyZWVuIHBvc2l0aW9uIG9mIHRoZSBkcmFnZ2VkIGl0ZW0uXG4gICAgICBmdW5jdGlvbiByZW9yZGVyQnlEb20oKSB7XG5cdCAgLy8gTG9jYXRlIHRoZSBzaWIgd2hvc2UgcG9zaXRpb24gaXMgYmV5b25kIHRoZSBkcmFnZ2VkIGl0ZW0gYnkgdGhlIGxlYXN0IGFtb3VudFxuXHQgIGxldCBkciA9IHNlbGYuZHJhZ2dpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgbGV0IGJTaWIgPSBudWxsO1xuXHQgIGxldCB4eSA9IGQzLnNlbGVjdChzZWxmLmRyYWdQYXJlbnQpLmNsYXNzZWQoXCJmbGV4cm93XCIpID8gXCJ4XCIgOiBcInlcIjtcblx0ICBmb3IgKGxldCBzIG9mIHNlbGYuZHJhZ1NpYnMpIHtcblx0ICAgICAgbGV0IHNyID0gcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgaWYgKGRyW3h5XSA8IHNyW3h5XSkge1xuXHRcdCAgIGxldCBkaXN0ID0gc3JbeHldIC0gZHJbeHldO1xuXHRcdCAgIGlmICghYlNpYiB8fCBkaXN0IDwgYlNpYlt4eV0gLSBkclt4eV0pXG5cdFx0ICAgICAgIGJTaWIgPSBzO1xuXHQgICAgICB9XG5cdCAgfVxuXHQgIC8vIEluc2VydCB0aGUgZHJhZ2dlZCBpdGVtIGJlZm9yZSB0aGUgbG9jYXRlZCBzaWIgKG9yIGFwcGVuZCBpZiBubyBzaWIgZm91bmQpXG5cdCAgc2VsZi5kcmFnUGFyZW50Lmluc2VydEJlZm9yZShzZWxmLmRyYWdnaW5nLCBiU2liKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHJlb3JkZXJCeVN0eWxlKCkge1xuXHQgIGxldCBkZCA9IGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKTtcblx0ICAvLyBMb2NhdGUgdGhlIHNpYiB0aGF0IGNvbnRhaW5zIHRoZSBkcmFnZ2VkIGl0ZW0ncyBvcmlnaW4uXG5cdCAgbGV0IGRyID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICBsZXQgYlNpYiA9IG51bGw7XG5cdCAgbGV0IHh5ID0gZDMuc2VsZWN0KHNlbGYuZHJhZ1BhcmVudCkuY2xhc3NlZChcImZsZXhyb3dcIikgPyBcInhcIiA6IFwieVwiO1xuXHQgIGxldCBzeiA9IHh5ID09PSBcInhcIiA/IFwid2lkdGhcIiA6IFwiaGVpZ2h0XCI7XG5cdCAgbGV0IHN0eT0geHkgPT09IFwieFwiID8gXCJsZWZ0XCIgOiBcInRvcFwiO1xuXHQgIGZvciAobGV0IHMgb2Ygc2VsZi5kcmFnU2licykge1xuXHQgICAgICAvLyBza2lwIHRoZSBkcmFnZ2VkIGl0ZW1cblx0ICAgICAgaWYgKHMgPT09IHNlbGYuZHJhZ2dpbmcpIGNvbnRpbnVlO1xuXHQgICAgICBsZXQgZHMgPSBkMy5zZWxlY3Qocyk7XG5cdCAgICAgIGxldCBzciA9IHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIC8vIGlmdyB0aGUgZHJhZ2dlZCBpdGVtJ3Mgb3JpZ2luIGlzIGJldHdlZW4gdGhlIHN0YXJ0IGFuZCBlbmQgb2Ygc2liLCB3ZSBmb3VuZCBpdC5cblx0ICAgICAgaWYgKGRyW3h5XSA+PSBzclt4eV0gJiYgZHJbeHldIDw9IChzclt4eV0gKyBzcltzel0pKSB7XG5cdFx0ICAgLy8gbW92ZSBzaWIgdG93YXJkIHRoZSBob2xlLCBhbW91bnQgPSB0aGUgc2l6ZSBvZiB0aGUgaG9sZVxuXHRcdCAgIGxldCBhbXQgPSBzZWxmLmRyYWdIb2xlW3N6XSAqIChzZWxmLmRyYWdIb2xlW3h5XSA8IHNyW3h5XSA/IC0xIDogMSk7XG5cdFx0ICAgZHMuc3R5bGUoc3R5LCBwYXJzZUludChkcy5zdHlsZShzdHkpKSArIGFtdCArIFwicHhcIik7XG5cdFx0ICAgc2VsZi5kcmFnSG9sZVt4eV0gLT0gYW10O1xuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICB9XG5cdCAgfVxuICAgICAgfVxuICAgICAgLy9cbiAgICAgIHJldHVybiBkMy5iZWhhdmlvci5kcmFnKClcblx0ICAub3JpZ2luKGZ1bmN0aW9uKGQsaSl7XG5cdCAgICAgIHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIH0pXG4gICAgICAgICAgLm9uKFwiZHJhZ3N0YXJ0Lm1cIiwgZnVuY3Rpb24oKSB7XG5cdCAgICAgIGxldCB0ID0gZDMuZXZlbnQuc291cmNlRXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAoISBkMy5zZWxlY3QodCkuY2xhc3NlZChcImRyYWdoYW5kbGVcIikpIHJldHVybjtcblx0ICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIC8vXG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgICAgPSB0aGlzLmNsb3Nlc3QoXCIucGFnZWJveFwiKTtcblx0ICAgICAgc2VsZi5kcmFnSG9sZSAgICA9IHNlbGYuZHJhZ2dpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIHNlbGYuZHJhZ1BhcmVudCAgPSBzZWxmLmRyYWdnaW5nLnBhcmVudE5vZGU7XG5cdCAgICAgIHNlbGYuZHJhZ1NpYnMgICAgPSBzZWxmLmRyYWdQYXJlbnQuY2hpbGRyZW47XG5cdCAgICAgIC8vXG5cdCAgICAgIGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKS5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgdHJ1ZSk7XG5cdCAgfSlcblx0ICAub24oXCJkcmFnLm1cIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgbGV0IGRkID0gZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpO1xuXHQgICAgICBsZXQgdHAgPSBwYXJzZUludChkZC5zdHlsZShcInRvcFwiKSlcblx0ICAgICAgZGQuc3R5bGUoXCJ0b3BcIiwgdHAgKyBkMy5ldmVudC5keSArIFwicHhcIik7XG5cdCAgICAgIC8vcmVvcmRlckJ5U3R5bGUoKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWdlbmQubVwiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICByZW9yZGVyQnlEb20oKTtcblx0ICAgICAgc2VsZi5zZXRQcmVmc0Zyb21VSSgpO1xuXHQgICAgICBsZXQgZGQgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZyk7XG5cdCAgICAgIGRkLnN0eWxlKFwidG9wXCIsIFwiMHB4XCIpO1xuXHQgICAgICBkZC5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgZmFsc2UpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nICAgID0gbnVsbDtcblx0ICAgICAgc2VsZi5kcmFnSG9sZSAgICA9IG51bGw7XG5cdCAgICAgIHNlbGYuZHJhZ1BhcmVudCAgPSBudWxsO1xuXHQgICAgICBzZWxmLmRyYWdTaWJzICAgID0gbnVsbDtcblx0ICB9KVxuXHQgIDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0VUlGcm9tUHJlZnMgKCkge1xuICAgICAgICBsZXQgcHJlZnMgPSB0aGlzLnVzZXJQcmVmc01hbmFnZXIuZ2V0QWxsKCk7XG5cdGNvbnNvbGUubG9nKFwiR290IHByZWZzIGZyb20gc3RvcmFnZVwiLCBwcmVmcyk7XG5cblx0Ly8gc2V0IG9wZW4vY2xvc2VkIHN0YXRlc1xuXHQocHJlZnMuY2xvc2FibGVzIHx8IFtdKS5mb3JFYWNoKCBjID0+IHtcblx0ICAgIGxldCBpZCA9IGNbMF07XG5cdCAgICBsZXQgc3RhdGUgPSBjWzFdO1xuXHQgICAgZDMuc2VsZWN0KCcjJytpZCkuY2xhc3NlZCgnY2xvc2VkJywgc3RhdGUgPT09IFwiY2xvc2VkXCIgfHwgbnVsbCk7XG5cdH0pO1xuXG5cdC8vIHNldCBkcmFnZ2FibGVzJyBvcmRlclxuXHQocHJlZnMuZHJhZ2dhYmxlcyB8fCBbXSkuZm9yRWFjaCggZCA9PiB7XG5cdCAgICBsZXQgY3RySWQgPSBkWzBdO1xuXHQgICAgbGV0IGNvbnRlbnRJZHMgPSBkWzFdO1xuXHQgICAgbGV0IGN0ciA9IGQzLnNlbGVjdCgnIycrY3RySWQpO1xuXHQgICAgbGV0IGNvbnRlbnRzID0gY3RyLnNlbGVjdEFsbCgnIycrY3RySWQrJyA+IConKTtcblx0ICAgIGNvbnRlbnRzWzBdLnNvcnQoIChhLGIpID0+IHtcblx0ICAgICAgICBsZXQgYWkgPSBjb250ZW50SWRzLmluZGV4T2YoYS5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuXHQgICAgICAgIGxldCBiaSA9IGNvbnRlbnRJZHMuaW5kZXhPZihiLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG5cdFx0cmV0dXJuIGFpIC0gYmk7XG5cdCAgICB9KTtcblx0ICAgIGNvbnRlbnRzLm9yZGVyKCk7XG5cdH0pO1xuICAgIH1cbiAgICBzZXRQcmVmc0Zyb21VSSAoKSB7XG4gICAgICAgIC8vIHNhdmUgb3Blbi9jbG9zZWQgc3RhdGVzXG5cdGxldCBjbG9zYWJsZXMgPSB0aGlzLnJvb3Quc2VsZWN0QWxsKCcuY2xvc2FibGUnKTtcblx0bGV0IG9jRGF0YSA9IGNsb3NhYmxlc1swXS5tYXAoIGMgPT4ge1xuXHQgICAgbGV0IGRjID0gZDMuc2VsZWN0KGMpO1xuXHQgICAgcmV0dXJuIFtkYy5hdHRyKCdpZCcpLCBkYy5jbGFzc2VkKFwiY2xvc2VkXCIpID8gXCJjbG9zZWRcIiA6IFwib3BlblwiXTtcblx0fSk7XG5cdC8vIHNhdmUgZHJhZ2dhYmxlcycgb3JkZXJcblx0bGV0IGRyYWdDdHJzID0gdGhpcy5yb290LnNlbGVjdEFsbCgnLmNvbnRlbnQtZHJhZ2dhYmxlJyk7XG5cdGxldCBkcmFnZ2FibGVzID0gZHJhZ0N0cnMuc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUgPiAqJyk7XG5cdGxldCBkZERhdGEgPSBkcmFnZ2FibGVzLm1hcCggKGQsaSkgPT4ge1xuXHQgICAgbGV0IGN0ciA9IGQzLnNlbGVjdChkcmFnQ3Ryc1swXVtpXSk7XG5cdCAgICByZXR1cm4gW2N0ci5hdHRyKCdpZCcpLCBkLm1hcCggZGQgPT4gZDMuc2VsZWN0KGRkKS5hdHRyKCdpZCcpKV07XG5cdH0pO1xuXHRsZXQgcHJlZnMgPSB7XG5cdCAgICBjbG9zYWJsZXM6IG9jRGF0YSxcblx0ICAgIGRyYWdnYWJsZXM6IGRkRGF0YVxuXHR9XG5cdGNvbnNvbGUubG9nKFwiU2F2aW5nIHByZWZzIHRvIHN0b3JhZ2VcIiwgcHJlZnMpO1xuXHR0aGlzLnVzZXJQcmVmc01hbmFnZXIuc2V0QWxsKHByZWZzKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd0Jsb2NrcyAoY29tcCkge1xuXHRsZXQgcmVmID0gdGhpcy5yR2Vub21lO1xuXHRpZiAoISBjb21wKSBjb21wID0gdGhpcy5jR2Vub21lc1swXTtcblx0aWYgKCEgY29tcCkgcmV0dXJuO1xuXHR0aGlzLnRyYW5zbGF0b3IucmVhZHkoKS50aGVuKCAoKSA9PiB7XG5cdCAgICBsZXQgYmxvY2tzID0gY29tcCA9PT0gcmVmID8gW10gOiB0aGlzLnRyYW5zbGF0b3IuZ2V0QmxvY2tzKHJlZiwgY29tcCk7XG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd0Jsb2Nrcyh7IHJlZiwgY29tcCwgYmxvY2tzIH0pO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd0J1c3kgKGlzQnVzeSwgbWVzc2FnZSkge1xuICAgICAgICBkMy5zZWxlY3QoXCIjaGVhZGVyID4gLmdlYXIuYnV0dG9uXCIpXG5cdCAgICAuY2xhc3NlZChcInJvdGF0aW5nXCIsIGlzQnVzeSk7XG4gICAgICAgIGQzLnNlbGVjdChcIiN6b29tVmlld1wiKS5jbGFzc2VkKFwiYnVzeVwiLCBpc0J1c3kpO1xuXHRpZiAoaXNCdXN5ICYmIG1lc3NhZ2UpIHRoaXMuc2hvd1N0YXR1cyhtZXNzYWdlKTtcblx0aWYgKCFpc0J1c3kpIHRoaXMuc2hvd1N0YXR1cygnJylcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd1N0YXR1cyAobXNnKSB7XG5cdGlmIChtc2cpXG5cdCAgICBkMy5zZWxlY3QoJyNzdGF0dXNNZXNzYWdlJylcblx0XHQuY2xhc3NlZCgnc2hvd2luZycsIHRydWUpXG5cdFx0LnNlbGVjdCgnc3BhbicpXG5cdFx0ICAgIC50ZXh0KG1zZyk7XG5cdGVsc2Vcblx0ICAgIGQzLnNlbGVjdCgnI3N0YXR1c01lc3NhZ2UnKS5jbGFzc2VkKCdzaG93aW5nJywgZmFsc2UpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldFJlZkdlbm9tZVNlbGVjdGlvbiAoKSB7XG5cdGQzLnNlbGVjdEFsbChcIiNyZWZHZW5vbWUgb3B0aW9uXCIpXG5cdCAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCAgZ2cgPT4gKGdnLmxhYmVsID09PSB0aGlzLnJHZW5vbWUubGFiZWwgIHx8IG51bGwpKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0Q29tcEdlbm9tZXNTZWxlY3Rpb24gKCkge1xuXHRsZXQgY2ducyA9IHRoaXMudkdlbm9tZXMubWFwKGc9PmcubGFiZWwpO1xuXHRkMy5zZWxlY3RBbGwoXCIjY29tcEdlbm9tZXMgb3B0aW9uXCIpXG5cdCAgICAgICAgLnByb3BlcnR5KFwic2VsZWN0ZWRcIiwgIGdnID0+IGNnbnMuaW5kZXhPZihnZy5sYWJlbCkgPj0gMCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNldHMgb3IgcmV0dXJuc1xuICAgIHNldEhpZ2hsaWdodCAoZmxpc3QpIHtcblx0aWYgKCFmbGlzdCkgcmV0dXJuIGZhbHNlO1xuXHR0aGlzLnpvb21WaWV3LmhpRmVhdHMgPSBmbGlzdC5yZWR1Y2UoKGEsdikgPT4geyBhW3ZdPXY7IHJldHVybiBhOyB9LCB7fSk7XG5cdHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGNvbnRleHQgYXMgYW4gb2JqZWN0LlxuICAgIC8vIEN1cnJlbnQgY29udGV4dCA9IHJlZiBnZW5vbWUgKyBjb21wIGdlbm9tZXMgKyBjdXJyZW50IHJhbmdlIChjaHIsc3RhcnQsZW5kKVxuICAgIGdldENvbnRleHQgKCkge1xuXHRpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpIHtcblx0ICAgIGxldCBjID0gdGhpcy5jb29yZHM7XG5cdCAgICByZXR1cm4ge1xuXHRcdHJlZiA6IHRoaXMuckdlbm9tZS5sYWJlbCxcblx0XHRnZW5vbWVzOiB0aGlzLnZHZW5vbWVzLm1hcChnPT5nLmxhYmVsKSxcblx0XHRjaHI6IGMuY2hyLFxuXHRcdHN0YXJ0OiBjLnN0YXJ0LFxuXHRcdGVuZDogYy5lbmQsXG5cdFx0aGlnaGxpZ2h0OiBPYmplY3Qua2V5cyh0aGlzLnpvb21WaWV3LmhpRmVhdHMpLnNvcnQoKSxcblx0XHRkbW9kZTogdGhpcy56b29tVmlldy5kbW9kZVxuXHQgICAgfVxuXHR9IGVsc2Uge1xuXHQgICAgbGV0IGMgPSB0aGlzLmxjb29yZHM7XG5cdCAgICByZXR1cm4ge1xuXHRcdHJlZiA6IHRoaXMuckdlbm9tZS5sYWJlbCxcblx0XHRnZW5vbWVzOiB0aGlzLnZHZW5vbWVzLm1hcChnPT5nLmxhYmVsKSxcblx0XHRsYW5kbWFyazogYy5sYW5kbWFyayxcblx0XHRmbGFuazogYy5mbGFuayxcblx0XHRsZW5ndGg6IGMubGVuZ3RoLFxuXHRcdGRlbHRhOiBjLmRlbHRhLFxuXHRcdGhpZ2hsaWdodDogT2JqZWN0LmtleXModGhpcy56b29tVmlldy5oaUZlYXRzKS5zb3J0KCksXG5cdFx0ZG1vZGU6IHRoaXMuem9vbVZpZXcuZG1vZGVcblx0ICAgIH1cblx0fVxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXNvbHZlcyB0aGUgc3BlY2lmaWVkIGxhbmRtYXJrIHRvIGEgZmVhdHVyZSBhbmQgdGhlIGxpc3Qgb2YgZXF1aXZhbGVudCBmZWF1cmVzLlxuICAgIC8vIE1heSBiZSBnaXZlbiBhbiBpZCwgY2Fub25pY2FsIGlkLCBvciBzeW1ib2wuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgY2ZnIChvYmopIFNhbml0aXplZCBjb25maWcgb2JqZWN0LCB3aXRoIGEgbGFuZG1hcmsgKHN0cmluZykgZmllbGQuXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgICAgVGhlIGNmZyBvYmplY3QsIHdpdGggYWRkaXRpb25hbCBmaWVsZHM6XG4gICAgLy8gICAgICAgIGxhbmRtYXJrUmVmRmVhdDogdGhlIGxhbmRtYXJrIChGZWF0dXJlIG9iaikgaW4gdGhlIHJlZiBnZW5vbWVcbiAgICAvLyAgICAgICAgbGFuZG1hcmtGZWF0czogWyBlcXVpdmFsZW50IGZlYXR1cmVzIGluIGVhY2ggZ2Vub21lIChpbmNsdWRlcyByZildXG4gICAgLy8gICAgIEFsc28sIGNoYW5nZXMgcmVmIHRvIGJlIHRoZSBnZW5vbWUgb2YgdGhlIGxhbmRtYXJrUmVmRmVhdFxuICAgIC8vICAgICBSZXR1cm5zIG51bGwgaWYgbGFuZG1hcmsgbm90IGZvdW5kIGluIGFueSBnZW5vbWUuXG4gICAgLy8gXG4gICAgcmVzb2x2ZUxhbmRtYXJrIChjZmcpIHtcblx0bGV0IHJmLCBmZWF0cztcblx0Ly8gRmluZCB0aGUgbGFuZG1hcmsgZmVhdHVyZSBpbiB0aGUgcmVmIGdlbm9tZS4gXG5cdHJmID0gdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5TGFiZWwoY2ZnLmxhbmRtYXJrLCBjZmcucmVmKVswXTtcblx0aWYgKHJmKSB7XG5cdCAgICAvLyBsYW5kbWFyayBleGlzdHMgaW4gcmVmIGdlbm9tZS4gR2V0IGVxdWl2YWxlbnQgZmVhdCBpbiBlYWNoIGdlbm9tZS5cblx0ICAgIGZlYXRzID0gcmYuY2Fub25pY2FsID8gdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5Q2Fub25pY2FsSWQocmYuY2Fub25pY2FsKSA6IFtyZl07XG5cdH1cblx0ZWxzZSB7XG5cdCAgICAvLyBsYW5kbWFyayBkb2VzIG5vdCBleGlzdCBpbiByZWYgZ2Vub21lLiBEb2VzIGl0IGV4aXN0IGFueXdoZXJlP1xuXHQgICAgcmYgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlMYWJlbChjZmcubGFuZG1hcmspWzBdO1xuXHQgICAgaWYgKHJmKSB7XG5cdCAgICAgICAgLy8gWWVzLCBsYW5kbWFyayBleGlzdHMgaW4gYW5vdGhlciBnZW5vbWUuXG5cdFx0Ly8gQ2hhbmdlIHJlZiBnZW5vbWUgYW5kIHByb2NlZWQuXG5cdFx0Y2ZnLnJlZiA9IHJmLmdlbm9tZTtcblx0XHRmZWF0cyA9IHJmLmNhbm9uaWNhbCA/IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkKHJmLmNhbm9uaWNhbCkgOiBbcmZdO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgLy8gbGFuZG1hcmsgZG9lc24ndCBleGlzdCBhbnl3aGVyZS4gXG5cdFx0cmV0dXJuIG51bGw7XG5cdCAgICB9XG5cdH1cblx0Y2ZnLmxhbmRtYXJrUmVmRmVhdCA9IHJmO1xuXHRjZmcubGFuZG1hcmtGZWF0cyA9IGZlYXRzXG5cdHJldHVybiBjZmc7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBzYW5pdGl6ZWQgdmVyc2lvbiBvZiB0aGUgYXJndW1lbnQgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAgLy8gVGhlIHNhbml0aXplZCB2ZXJzaW9uOlxuICAgIC8vICAgICAtIGhhcyBhIHNldHRpbmcgZm9yIGV2ZXJ5IHBhcmFtZXRlci4gUGFyYW1ldGVycyBub3Qgc3BlY2lmaWVkIGluIFxuICAgIC8vICAgICAgIHRoZSBhcmd1bWVudCBhcmUgKGdlbmVyYWxseSkgZmlsbGVkIGluIHdpdGggdGhlaXIgY3VycmVudCB2YWx1ZXMuXG4gICAgLy8gICAgIC0gaXMgYWx3YXlzIHZhbGlkLCBlZ1xuICAgIC8vICAgICBcdC0gaGFzIGEgbGlzdCBvZiAxIG9yIG1vcmUgdmFsaWQgZ2Vub21lcywgd2l0aCBvbmUgb2YgdGhlbSBkZXNpZ25hdGVkIGFzIHRoZSByZWZcbiAgICAvLyAgICAgXHQtIGhhcyBhIHZhbGlkIGNvb3JkaW5hdGUgcmFuZ2VcbiAgICAvLyAgICAgXHQgICAgLSBzdGFydCBhbmQgZW5kIGFyZSBpbnRlZ2VycyB3aXRoIHN0YXJ0IDw9IGVuZFxuICAgIC8vICAgICBcdCAgICAtIHZhbGlkIGNocm9tb3NvbWUgZm9yIHJlZiBnZW5vbWVcbiAgICAvL1xuICAgIC8vIFRoZSBzYW5pdGl6ZWQgdmVyc2lvbiBpcyBhbHNvIFwiY29tcGlsZWRcIjpcbiAgICAvLyAgICAgLSBpdCBoYXMgYWN0dWFsIEdlbm9tZSBvYmplY3RzLCB3aGVyZSB0aGUgYXJndW1lbnQganVzdCBoYXMgbmFtZXNcbiAgICAvLyAgICAgLSBncm91cHMgdGhlIGNocitzdGFydCtlbmQgaW4gXCJjb29yZHNcIiBvYmplY3RcbiAgICAvL1xuICAgIC8vXG4gICAgc2FuaXRpemVDZmcgKGMpIHtcblx0bGV0IGNmZyA9IHt9O1xuXG5cdC8vIFNhbml0aXplIHRoZSBpbnB1dC5cblxuXHQvLyB3aW5kb3cgc2l6ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRpZiAoYy53aWR0aCkge1xuXHQgICAgY2ZnLndpZHRoID0gYy53aWR0aFxuXHR9XG5cblx0Ly8gcmVmIGdlbm9tZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0Ly8gU2V0IGNmZy5yZWYgdG8gc3BlY2lmaWVkIGdlbm9tZSwgXG5cdC8vICAgd2l0aCBmYWxsYmFjayB0byBjdXJyZW50IHJlZiBnZW5vbWUsIFxuXHQvLyAgICAgIHdpdGggZmFsbGJhY2sgdG8gQzU3QkwvNkogKDFzdCB0aW1lIHRocnUpXG5cdC8vIEZJWE1FOiBmaW5hbCBmYWxsYmFjayBzaG91bGQgYmUgYSBjb25maWcgc2V0dGluZy5cblx0Y2ZnLnJlZiA9IChjLnJlZiA/IHRoaXMubmwyZ2Vub21lW2MucmVmXSB8fCB0aGlzLnJHZW5vbWUgOiB0aGlzLnJHZW5vbWUpIHx8IHRoaXMubmwyZ2Vub21lWydDNTdCTC82SiddO1xuXG5cdC8vIGNvbXBhcmlzb24gZ2Vub21lcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIFNldCBjZmcuZ2Vub21lcyB0byBiZSB0aGUgc3BlY2lmaWVkIGdlbm9tZXMsXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGdlbm9tZXNcblx0Ly8gICAgICAgIHdpdGggZmFsbGJhY2sgdG8gW3JlZl0gKDFzdCB0aW1lIHRocnUpXG5cdGNmZy5nZW5vbWVzID0gYy5nZW5vbWVzID9cblx0ICAgIChjLmdlbm9tZXMubWFwKGcgPT4gdGhpcy5ubDJnZW5vbWVbZ10pLmZpbHRlcih4PT54KSlcblx0ICAgIDpcblx0ICAgIHRoaXMudkdlbm9tZXM7XG5cdC8vIEFkZCByZWYgdG8gZ2Vub21lcyBpZiBub3QgdGhlcmUgYWxyZWFkeVxuXHRpZiAoY2ZnLmdlbm9tZXMuaW5kZXhPZihjZmcucmVmKSA9PT0gLTEpXG5cdCAgICBjZmcuZ2Vub21lcy51bnNoaWZ0KGNmZy5yZWYpO1xuXHRcblx0Ly8gYWJzb2x1dGUgY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0Ly8gU2V0IGNmZy5jaHIgdG8gYmUgdGhlIHNwZWNpZmllZCBjaHJvbW9zb21lXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGNoclxuXHQvLyAgICAgICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIDFzdCBjaHJvbW9zb21lIGluIHRoZSByZWYgZ2Vub21lXG5cdGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoYy5jaHIpO1xuXHRpZiAoIWNmZy5jaHIpIGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoIHRoaXMuY29vcmRzID8gdGhpcy5jb29yZHMuY2hyIDogXCIxXCIgKTtcblx0aWYgKCFjZmcuY2hyKSBjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKDApO1xuXHRpZiAoIWNmZy5jaHIpIHRocm93IFwiTm8gY2hyb21vc29tZS5cIlxuXHRcblx0Ly8gU2V0IGNmZy5zdGFydCB0byBiZSB0aGUgc3BlY2lmaWVkIHN0YXJ0IHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgc3RhcnRcblx0Ly8gQ2xpcCBhdCBjaHIgYm91bmRhcmllc1xuXHRjZmcuc3RhcnQgPSBjbGlwKE1hdGgucm91bmQodHlwZW9mKGMuc3RhcnQpID09PSBcIm51bWJlclwiID8gYy5zdGFydCA6IHRoaXMuY29vcmRzLnN0YXJ0KSwgMSwgY2ZnLmNoci5sZW5ndGgpO1xuXG5cdC8vIFNldCBjZmcuZW5kIHRvIGJlIHRoZSBzcGVjaWZpZWQgZW5kIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgZW5kXG5cdC8vIENsaXAgYXQgY2hyIGJvdW5kYXJpZXNcblx0Y2ZnLmVuZCA9IGNsaXAoTWF0aC5yb3VuZCh0eXBlb2YoYy5lbmQpID09PSBcIm51bWJlclwiID8gYy5lbmQgOiB0aGlzLmNvb3Jkcy5lbmQpLCAxLCBjZmcuY2hyLmxlbmd0aCk7XG5cblx0Ly8gRW5zdXJlIHN0YXJ0IDw9IGVuZFxuXHRpZiAoY2ZnLnN0YXJ0ID4gY2ZnLmVuZCkge1xuXHQgICBsZXQgdG1wID0gY2ZnLnN0YXJ0OyBjZmcuc3RhcnQgPSBjZmcuZW5kOyBjZmcuZW5kID0gdG1wO1xuXHR9XG5cblx0Ly8gbGFuZG1hcmsgY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gTk9URSB0aGF0IGxhbmRtYXJrIGNvb3JkaW5hdGUgY2Fubm90IGJlIGZ1bGx5IHJlc29sdmVkIHRvIGFic29sdXRlIGNvb3JkaW5hdGUgdW50aWxcblx0Ly8gKmFmdGVyKiBnZW5vbWUgZGF0YSBoYXZlIGJlZW4gbG9hZGVkLiBTZWUgc2V0Q29udGV4dCBhbmQgcmVzb2x2ZUxhbmRtYXJrIG1ldGhvZHMuXG5cdGNmZy5sYW5kbWFyayA9IGMubGFuZG1hcmsgfHwgdGhpcy5sY29vcmRzLmxhbmRtYXJrO1xuXHRjZmcuZGVsdGEgICAgPSBNYXRoLnJvdW5kKCdkZWx0YScgaW4gYyA/IGMuZGVsdGEgOiAodGhpcy5sY29vcmRzLmRlbHRhIHx8IDApKTtcblx0aWYgKCdmbGFuaycgaW4gYyl7XG5cdCAgICBjZmcuZmxhbmsgPSBNYXRoLnJvdW5kKGMuZmxhbmspO1xuXHR9XG5cdGVsc2UgaWYgKCdsZW5ndGgnIGluIGMpIHtcblx0ICAgIGNmZy5sZW5ndGggPSBNYXRoLnJvdW5kKGMubGVuZ3RoKTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIGNmZy5sZW5ndGggPSBNYXRoLnJvdW5kKHRoaXMuY29vcmRzLmVuZCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMSk7XG5cdH1cblxuXHQvLyBjbW9kZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRpZiAoYy5jbW9kZSAmJiBjLmNtb2RlICE9PSAnbWFwcGVkJyAmJiBjLmNtb2RlICE9PSAnbGFuZG1hcmsnKSBjLmNtb2RlID0gbnVsbDtcblx0Y2ZnLmNtb2RlID0gYy5jbW9kZSB8fCBcblx0ICAgICgoJ2NocicgaW4gYyB8fCAnc3RhcnQnIGluIGMgfHwgJ2VuZCcgaW4gYykgP1xuXHQgICAgICAgICdtYXBwZWQnIDogXG5cdFx0KCdsYW5kbWFyaycgaW4gYyB8fCAnZmxhbmsnIGluIGMgfHwgJ2xlbmd0aCcgaW4gYyB8fCAnZGVsdGEnIGluIGMpID9cblx0XHQgICAgJ2xhbmRtYXJrJyA6IFxuXHRcdCAgICB0aGlzLmNtb2RlIHx8ICdtYXBwZWQnKTtcblxuXHQvLyBoaWdobGlnaHRpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBTZXQgY2ZnLmhpZ2hsaWdodFxuXHQvLyAgICB3aXRoIGZhbGxiYWNrIHRvIGN1cnJlbnQgaGlnaGxpZ2h0XG5cdC8vICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIFtdXG5cdGNmZy5oaWdobGlnaHQgPSBjLmhpZ2hsaWdodCB8fCB0aGlzLnpvb21WaWV3LmhpZ2hsaWdodGVkIHx8IFtdO1xuXG5cdC8vIGRyYXdpbmcgbW9kZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIFNldCB0aGUgZHJhd2luZyBtb2RlIGZvciB0aGUgWm9vbVZpZXcuXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IHZhbHVlXG5cdGlmIChjLmRtb2RlID09PSAnY29tcGFyaXNvbicgfHwgYy5kbW9kZSA9PT0gJ3JlZmVyZW5jZScpIFxuXHQgICAgY2ZnLmRtb2RlID0gYy5kbW9kZTtcblx0ZWxzZVxuXHQgICAgY2ZnLmRtb2RlID0gdGhpcy56b29tVmlldy5kbW9kZSB8fCAnY29tcGFyaXNvbic7XG5cblx0Ly9cblx0cmV0dXJuIGNmZztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTZXRzIHRoZSBjdXJyZW50IGNvbnRleHQgZnJvbSB0aGUgY29uZmlnIG9iamVjdC4gXG4gICAgLy8gT25seSB0aG9zZSBjb250ZXh0IGl0ZW1zIHNwZWNpZmllZCBpbiB0aGUgY29uZmlnIGFyZSBhZmZlY3RlZCwgZXhjZXB0IGFzIG5vdGVkLlxuICAgIC8vXG4gICAgLy8gQWxsIGNvbmZpZ3MgYXJlIHNhbml0aXplZCBiZWZvcmUgYmVpbmcgYXBwbGllZCAoc2VlIHNhbml0aXplQ2ZnKS5cbiAgICAvLyBcbiAgICAvLyBBcmdzOlxuICAgIC8vICAgIGMgKG9iamVjdCkgQSBjb25maWd1cmF0aW9uIG9iamVjdCB0aGF0IHNwZWNpZmllcyBzb21lL2FsbCBjb25maWcgdmFsdWVzLlxuICAgIC8vICAgICAgICAgVGhlIHBvc3NpYmxlIGNvbmZpZyBpdGVtczpcbiAgICAvLyAgICAgICAgICAgIGdlbm9tZXMgICAobGlzdCBvIHN0cmluZ3MpIEFsbCB0aGUgZ2Vub21lcyB5b3Ugd2FudCB0byBzZWUsIGluIHRvcC10by1ib3R0b20gb3JkZXIuIFxuICAgIC8vICAgICAgICAgICAgICAgTWF5IHVzZSBpbnRlcm5hbCBuYW1lcyBvciBkaXNwbGF5IGxhYmVscywgZWcsIFwibXVzX211c2N1bHVzXzEyOXMxc3ZpbWpcIiBvciBcIjEyOVMxL1N2SW1KXCIuXG4gICAgLy8gICAgICAgICAgICByZWYgICAgICAgKHN0cmluZykgVGhlIGdlbm9tZSB0byB1c2UgYXMgdGhlIHJlZmVyZW5jZS4gTWF5IGJlIG5hbWUgb3IgbGFiZWwuXG4gICAgLy8gICAgICAgICAgICBoaWdobGlnaHQgKGxpc3QgbyBzdHJpbmdzKSBJRHMgb2YgZmVhdHVyZXMgdG8gaGlnaGxpZ2h0XG4gICAgLy8gICAgICAgICAgICBkbW9kZSAgICAgKHN0cmluZykgZWl0aGVyICdjb21wYXJpc29uJyBvciAncmVmZXJlbmNlJ1xuICAgIC8vXG4gICAgLy8gICAgICAgICAgICBDb29yZGluYXRlcyBhcmUgc3BlY2lmaWVkIGluIG9uZSBvZiAyIGZvcm1zLlxuICAgIC8vICAgICAgICAgICAgICBjaHIgICAgICAgKHN0cmluZykgQ2hyb21vc29tZSBmb3IgY29vcmRpbmF0ZSByYW5nZVxuICAgIC8vICAgICAgICAgICAgICBzdGFydCAgICAgKGludCkgQ29vcmRpbmF0ZSByYW5nZSBzdGFydCBwb3NpdGlvblxuICAgIC8vICAgICAgICAgICAgICBlbmQgICAgICAgKGludCkgQ29vcmRpbmF0ZSByYW5nZSBlbmQgcG9zaXRpb25cbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgICBEaXNwbGF5cyB0aGlzIGNvb3JkaW5hdGUgcmFuZ2UgZnJvbSB0aGUgY3VycmVudCByZWZlcmVuY2UgZ2VuZW9tcywgYW5kIHRoZSBlcXVpdmFsZW50IChtYXBwZWQpXG4gICAgLy8gICAgICAgICAgICAgIGNvb3JkaW5hdGUgcmFuZ2UocykgaW4gZWFjaCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgb3I6XG4gICAgLy8gICAgICAgICAgICAgIGxhbmRtYXJrICAoc3RyaW5nKSBJRCwgY2Fub25pY2FsIElELCBvciBzeW1ib2wsIGlkZW50aWZ5aW5nIGEgZmVhdHVyZS5cbiAgICAvLyAgICAgICAgICAgICAgZmxhbmt8bGVuZ3RoIChpbnQpIElmIGZsYW5rLCB2aWV3aW5nIHJlZ2lvbiBzaXplID0gZmxhbmsgKyBsZW4obGFuZG1hcmspICsgZmxhbmsuIFxuICAgIC8vICAgICAgICAgICAgICAgICBJZiBsZW5ndGgsIHZpZXdpbmcgcmVnaW9uIHNpemUgPSBsZW5ndGguIEluIGVpdGhlciBjYXNlLCB0aGUgbGFuZG1hcmsgaXMgY2VudGVyZWQgaW5cbiAgICAvLyAgICAgICAgICAgICAgICAgdGhlIHZpZXdpbmcgYXJlYSwgKy8tIGFueSBzcGVjaWZpZWQgZGVsdGEuXG4gICAgLy8gICAgICAgICAgICAgIGRlbHRhICAgICAoaW50KSBBbW91bnQgaW4gYnAgdG8gc2hpZnQgdGhlIHJlZ2lvbiBsZWZ0ICg8MCkgb3IgcmlnaHQgKD4wKS5cbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgICBEaXNwbGF5cyB0aGUgcmVnaW9uIGFyb3VuZCB0aGUgc3BlY2lmaWVkIGxhbmRtYXJrIGluIGVhY2ggZ2Vub21lIHdoZXJlIGl0IGV4aXN0cy5cbiAgICAvL1xuICAgIC8vICAgIHF1aWV0bHkgKGJvb2xlYW4pIElmIHRydWUsIGRvbid0IHVwZGF0ZSBicm93c2VyIGhpc3RvcnkgKGFzIHdoZW4gZ29pbmcgYmFjaylcbiAgICAvL1xuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgTm90aGluZ1xuICAgIC8vIFNpZGUgZWZmZWN0czpcbiAgICAvL1x0ICBSZWRyYXdzIFxuICAgIC8vXHQgIENhbGxzIGNvbnRleHRDaGFuZ2VkKCkgXG4gICAgLy9cbiAgICBzZXRDb250ZXh0IChjLCBxdWlldGx5KSB7XG4gICAgICAgIGxldCBjZmcgPSB0aGlzLnNhbml0aXplQ2ZnKGMpO1xuXHRjb25zb2xlLmxvZyhcIlNldCBjb250ZXh0IChyYXcpOlwiLCBjKTtcblx0Y29uc29sZS5sb2coXCJTZXQgY29udGV4dCAoc2FuaXRpemVkKTpcIiwgY2ZnKTtcblx0aWYgKCFjZmcpIHJldHVybjtcblx0dGhpcy5zaG93QnVzeSh0cnVlLCAnUmVxdWVzdGluZyBkYXRhLi4uJyk7XG5cdGxldCBwID0gdGhpcy5mZWF0dXJlTWFuYWdlci5sb2FkR2Vub21lcyhjZmcuZ2Vub21lcykudGhlbigoKSA9PiB7XG5cdCAgICBpZiAoY2ZnLmNtb2RlID09PSAnbGFuZG1hcmsnKVxuXHQgICAgICAgIHRoaXMucmVzb2x2ZUxhbmRtYXJrKGNmZyk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy52R2Vub21lcyA9IGNmZy5nZW5vbWVzO1xuXHQgICAgdGhpcy5yR2Vub21lICA9IGNmZy5yZWY7XG5cdCAgICB0aGlzLmNHZW5vbWVzID0gY2ZnLmdlbm9tZXMuZmlsdGVyKGcgPT4gZyAhPT0gY2ZnLnJlZik7XG5cdCAgICB0aGlzLnNldFJlZkdlbm9tZVNlbGVjdGlvbih0aGlzLnJHZW5vbWUubmFtZSk7XG5cdCAgICB0aGlzLnNldENvbXBHZW5vbWVzU2VsZWN0aW9uKHRoaXMudkdlbm9tZXMubWFwKGc9PmcubmFtZSkpO1xuXHQgICAgLy9cblx0ICAgIHRoaXMuY21vZGUgPSBjZmcuY21vZGU7XG5cdCAgICByZXR1cm4gdGhpcy50cmFuc2xhdG9yLnJlYWR5KCk7XG5cdH0pLnRoZW4oKCkgPT4ge1xuXHQgICAgLy9cblx0ICAgIHRoaXMuY29vcmRzICAgPSB7IGNocjogY2ZnLmNoci5uYW1lLCBzdGFydDogY2ZnLnN0YXJ0LCBlbmQ6IGNmZy5lbmQgfTtcblx0ICAgIHRoaXMubGNvb3JkcyAgPSB7XG5cdCAgICAgICAgbGFuZG1hcms6IGNmZy5sYW5kbWFyaywgXG5cdFx0bGFuZG1hcmtSZWZGZWF0OiBjZmcubGFuZG1hcmtSZWZGZWF0LFxuXHRcdGxhbmRtYXJrRmVhdHM6IGNmZy5sYW5kbWFya0ZlYXRzLFxuXHRcdGZsYW5rOiBjZmcuZmxhbmssIFxuXHRcdGxlbmd0aDogY2ZnLmxlbmd0aCwgXG5cdFx0ZGVsdGE6IGNmZy5kZWx0YSBcblx0ICAgIH07XG5cdCAgICAvL1xuXHQgICAgdGhpcy56b29tVmlldy5oaWdobGlnaHRlZCA9IGNmZy5oaWdobGlnaHQ7XG5cdCAgICB0aGlzLnpvb21WaWV3Lmdlbm9tZXMgPSB0aGlzLnZHZW5vbWVzO1xuXHQgICAgdGhpcy56b29tVmlldy5kbW9kZSA9IGNmZy5kbW9kZTtcblx0ICAgIHRoaXMuem9vbVZpZXcudXBkYXRlKCk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LnJlZHJhdygpO1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LnNldEJydXNoQ29vcmRzKHRoaXMuY29vcmRzKTtcblx0ICAgIC8vXG5cdCAgICBpZiAoIXF1aWV0bHkpXG5cdCAgICAgICAgdGhpcy5jb250ZXh0Q2hhbmdlZCgpO1xuXHQgICAgLy9cblx0ICAgIHRoaXMuc2hvd0J1c3koZmFsc2UpO1xuXHR9KTtcblx0cmV0dXJuIHA7XG4gICAgfVxuIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldENvb3JkaW5hdGVzIChzdHIpIHtcblx0bGV0IGNvb3JkcyA9IHBhcnNlQ29vcmRzKHN0cik7XG5cdGlmICghIGNvb3Jkcykge1xuXHQgICAgbGV0IGZlYXRzID0gdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5TGFiZWwoc3RyKTtcblx0ICAgIGxldCBmZWF0czIgPSBmZWF0cy5maWx0ZXIoZj0+Zi5nZW5vbWUgPT0gdGhpcy5yR2Vub21lKTtcblx0ICAgIGxldCBmID0gZmVhdHMyWzBdIHx8IGZlYXRzWzBdO1xuXHQgICAgaWYgKGYpIHtcblx0XHRjb29yZHMgPSB7XG5cdFx0ICAgIHJlZjogZi5nZW5vbWUubmFtZSxcblx0XHQgICAgbGFuZG1hcms6IHN0cixcblx0XHQgICAgaGlnaGxpZ2h0OiBmLmlkXG5cdFx0fVxuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0YWxlcnQoXCJVbmFibGUgdG8gc2V0IGNvb3JkaW5hdGVzIHdpdGggdGhpcyB2YWx1ZTogXCIgKyBzdHIpO1xuXHRcdHJldHVybjtcblx0ICAgIH1cblx0fVxuXHR0aGlzLnNldENvbnRleHQoY29vcmRzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXNpemUgKCkge1xuXHRsZXQgdyA9IHdpbmRvdy5pbm5lcldpZHRoIC0gMjQ7XG5cdHRoaXMuZ2Vub21lVmlldy5maXRUb1dpZHRoKHcpO1xuXHR0aGlzLnpvb21WaWV3LmZpdFRvV2lkdGgodyk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIGN1cnJlbnQgY29udGV4dCBhcyBhIHBhcmFtZXRlciBzdHJpbmdcbiAgICAvLyBDdXJyZW50IGNvbnRleHQgPSByZWYgZ2Vub21lICsgY29tcCBnZW5vbWVzICsgY3VycmVudCByYW5nZSAoY2hyLHN0YXJ0LGVuZClcbiAgICBnZXRQYXJhbVN0cmluZyAoKSB7XG5cdGxldCBjID0gdGhpcy5nZXRDb250ZXh0KCk7XG4gICAgICAgIGxldCByZWYgPSBgcmVmPSR7Yy5yZWZ9YDtcbiAgICAgICAgbGV0IGdlbm9tZXMgPSBgZ2Vub21lcz0ke2MuZ2Vub21lcy5qb2luKFwiK1wiKX1gO1xuXHRsZXQgY29vcmRzID0gYGNocj0ke2MuY2hyfSZzdGFydD0ke2Muc3RhcnR9JmVuZD0ke2MuZW5kfWA7XG5cdGxldCBsZmxmID0gYy5mbGFuayA/ICcmZmxhbms9JytjLmZsYW5rIDogJyZsZW5ndGg9JytjLmxlbmd0aDtcblx0bGV0IGxjb29yZHMgPSBgbGFuZG1hcms9JHtjLmxhbmRtYXJrfSZkZWx0YT0ke2MuZGVsdGF9JHtsZmxmfWA7XG5cdGxldCBobHMgPSBgaGlnaGxpZ2h0PSR7Yy5oaWdobGlnaHQuam9pbihcIitcIil9YDtcblx0bGV0IGRtb2RlID0gYGRtb2RlPSR7Yy5kbW9kZX1gO1xuXHRyZXR1cm4gYCR7dGhpcy5jbW9kZT09PSdtYXBwZWQnP2Nvb3JkczpsY29vcmRzfSYke2Rtb2RlfSYke3JlZn0mJHtnZW5vbWVzfSYke2hsc31gO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBjdXJyZW50TGlzdCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJMaXN0O1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXQgY3VycmVudExpc3QgKGxzdCkge1xuICAgIFx0Ly9cblx0bGV0IHByZXZMaXN0ID0gdGhpcy5jdXJyTGlzdDtcblx0dGhpcy5jdXJyTGlzdCA9IGxzdDtcblx0Ly9cblx0bGV0IGxpc3RzID0gZDMuc2VsZWN0KCcjbXlsaXN0cycpLnNlbGVjdEFsbCgnLmxpc3RJbmZvJyk7XG5cdGxpc3RzLmNsYXNzZWQoXCJjdXJyZW50XCIsIGQgPT4gZCA9PT0gbHN0KTtcblx0Ly9cblx0aWYgKGxzdCkge1xuXHQgICAgaWYgKGxzdCA9PT0gcHJldkxpc3QpXG5cdCAgICAgICAgdGhpcy5jdXJyTGlzdENvdW50ZXIgPSAodGhpcy5jdXJyTGlzdENvdW50ZXIgKyAxKSAlIHRoaXMuY3Vyckxpc3QuaWRzLmxlbmd0aDtcblx0ICAgIGVsc2Vcblx0ICAgICAgICB0aGlzLmN1cnJMaXN0Q291bnRlciA9IDA7XG5cdCAgICBsZXQgY3VycklkID0gbHN0Lmlkc1t0aGlzLmN1cnJMaXN0Q291bnRlcl07XG5cdCAgICAvLyBzaG93IHRoaXMgbGlzdCBhcyB0aWNrIG1hcmtzIGluIHRoZSBnZW5vbWUgdmlld1xuXHQgICAgdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlc0J5SWQodGhpcy5yR2Vub21lLCBsc3QuaWRzKVxuXHRcdC50aGVuKCBmZWF0cyA9PiB7XG5cdFx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3VGlja3MoZmVhdHMpO1xuXHRcdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd1RpdGxlKCk7XG5cdFx0ICAgIHRoaXMuc2V0Q29vcmRpbmF0ZXMoY3VycklkKTtcblx0XHR9KTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuY3Vyckxpc3RDb3VudGVyID0gMDtcblx0ICAgIC8vXG5cdCAgICB0aGlzLnpvb21WaWV3LmhpRmVhdHMgPSB7fTtcblx0ICAgIHRoaXMuem9vbVZpZXcudXBkYXRlKCk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdUaWNrcyhbXSk7XG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd1RpdGxlKCk7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBab29tcyBpbi9vdXQgYnkgZmFjdG9yLiBOZXcgem9vbSB3aWR0aCBpcyBmYWN0b3IgKiB0aGUgY3VycmVudCB3aWR0aC5cbiAgICAvLyBGYWN0b3IgPiAxIHpvb21zIG91dCwgMCA8IGZhY3RvciA8IDEgem9vbXMgaW4uXG4gICAgem9vbSAoZmFjdG9yKSB7XG5cdGxldCBsZW4gPSB0aGlzLmNvb3Jkcy5lbmQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDE7XG5cdGxldCBuZXdsZW4gPSBNYXRoLnJvdW5kKGZhY3RvciAqIGxlbik7XG5cdGxldCB4ID0gKHRoaXMuY29vcmRzLnN0YXJ0ICsgdGhpcy5jb29yZHMuZW5kKS8yO1xuXHRpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpIHtcblx0ICAgIGxldCBuZXdzdGFydCA9IE1hdGgucm91bmQoeCAtIG5ld2xlbi8yKTtcblx0ICAgIHRoaXMuc2V0Q29udGV4dCh7IGNocjogdGhpcy5jb29yZHMuY2hyLCBzdGFydDogbmV3c3RhcnQsIGVuZDogbmV3c3RhcnQgKyBuZXdsZW4gLSAxIH0pO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgbGVuZ3RoOiBuZXdsZW4gfSk7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQYW5zIHRoZSB2aWV3IGxlZnQgb3IgcmlnaHQgYnkgZmFjdG9yLiBUaGUgZGlzdGFuY2UgbW92ZWQgaXMgZmFjdG9yIHRpbWVzIHRoZSBjdXJyZW50IHpvb20gd2lkdGguXG4gICAgLy8gTmVnYXRpdmUgdmFsdWVzIHBhbiBsZWZ0LiBQb3NpdGl2ZSB2YWx1ZXMgcGFuIHJpZ2h0LiAoTm90ZSB0aGF0IHBhbm5pbmcgbW92ZXMgdGhlIFwiY2FtZXJhXCIuIFBhbm5pbmcgdG8gdGhlXG4gICAgLy8gcmlnaHQgbWFrZXMgdGhlIG9iamVjdHMgaW4gdGhlIHNjZW5lIGFwcGVhciB0byBtb3ZlIHRvIHRoZSBsZWZ0LCBhbmQgdmljZSB2ZXJzYS4pXG4gICAgLy9cbiAgICBwYW4gKGZhY3Rvcikge1xuXHRsZXQgYyA9IHRoaXMuY29vcmRzO1xuXHRsZXQgY2hyID0gdGhpcy5yR2Vub21lLmNocm9tb3NvbWVzLmZpbHRlcihjID0+IGMubmFtZSA9PT0gdGhpcy5jb29yZHMuY2hyKVswXTtcblx0bGV0IHdpZHRoID0gYy5lbmQgLSBjLnN0YXJ0ICsgMTtcblx0bGV0IG1pbkQgPSAtKGMuc3RhcnQtMSk7XG5cdGxldCBtYXhEID0gY2hyLmxlbmd0aCAtIGMuZW5kO1xuXHRsZXQgZCA9IGNsaXAoZmFjdG9yICogd2lkdGgsIG1pbkQsIG1heEQpO1xuXHRpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpIHtcblx0ICAgIHRoaXMuc2V0Q29udGV4dCh7IGNocjogYy5jaHIsIHN0YXJ0OiBjLnN0YXJ0K2QsIGVuZDogYy5lbmQrZCB9KTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuc2V0Q29udGV4dCh7IGRlbHRhOiB0aGlzLmxjb29yZHMuZGVsdGEgKyBkIH0pO1xuXHR9XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdEZlYXRUeXBlQ29udHJvbCAoZmFjZXQpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgY29sb3JzID0gdGhpcy5jc2NhbGUuZG9tYWluKCkubWFwKGxibCA9PiB7XG5cdCAgICByZXR1cm4geyBsYmw6bGJsLCBjbHI6dGhpcy5jc2NhbGUobGJsKSB9O1xuXHR9KTtcblx0bGV0IGNrZXMgPSBkMy5zZWxlY3QoXCIuY29sb3JLZXlcIilcblx0ICAgIC5zZWxlY3RBbGwoJy5jb2xvcktleUVudHJ5Jylcblx0XHQuZGF0YShjb2xvcnMpO1xuXHRsZXQgbmNzID0gY2tlcy5lbnRlcigpLmFwcGVuZChcImRpdlwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBcImNvbG9yS2V5RW50cnkgZmxleHJvd1wiKTtcblx0bmNzLmFwcGVuZChcImRpdlwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwic3dhdGNoXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgYyA9PiBjLmxibClcblx0ICAgIC5zdHlsZShcImJhY2tncm91bmQtY29sb3JcIiwgYyA9PiBjLmNscilcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgdCA9IGQzLnNlbGVjdCh0aGlzKTtcblx0ICAgICAgICB0LmNsYXNzZWQoXCJjaGVja2VkXCIsICEgdC5jbGFzc2VkKFwiY2hlY2tlZFwiKSk7XG5cdFx0bGV0IHN3YXRjaGVzID0gZDMuc2VsZWN0QWxsKFwiLnN3YXRjaC5jaGVja2VkXCIpWzBdO1xuXHRcdGxldCBmdHMgPSBzd2F0Y2hlcy5tYXAocz0+cy5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpKVxuXHRcdGZhY2V0LnNldFZhbHVlcyhmdHMpO1xuXHRcdHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdCAgICB9KVxuXHQgICAgLmFwcGVuZChcImlcIilcblx0ICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29uc1wiKTtcblx0bmNzLmFwcGVuZChcInNwYW5cIilcblx0ICAgIC50ZXh0KGMgPT4gYy5sYmwpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naVNucFJlcG9ydCAoKSB7XG5cdGxldCBjID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdGxldCB1cmxCYXNlID0gJ2h0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9zbnAvc3VtbWFyeSc7XG5cdGxldCB0YWJBcmcgPSAnc2VsZWN0ZWRUYWI9MSc7XG5cdGxldCBzZWFyY2hCeUFyZyA9ICdzZWFyY2hCeVNhbWVEaWZmPSc7XG5cdGxldCBjaHJBcmcgPSBgc2VsZWN0ZWRDaHJvbW9zb21lPSR7Yy5jaHJ9YDtcblx0bGV0IGNvb3JkQXJnID0gYGNvb3JkaW5hdGU9JHtjLnN0YXJ0fS0ke2MuZW5kfWA7XG5cdGxldCB1bml0QXJnID0gJ2Nvb3JkaW5hdGVVbml0PWJwJztcblx0bGV0IGNzQXJncyA9IGMuZ2Vub21lcy5tYXAoZyA9PiBgc2VsZWN0ZWRTdHJhaW5zPSR7Z31gKVxuXHRsZXQgcnNBcmcgPSBgcmVmZXJlbmNlU3RyYWluPSR7Yy5yZWZ9YDtcblx0bGV0IGxpbmtVcmwgPSBgJHt1cmxCYXNlfT8ke3RhYkFyZ30mJHtzZWFyY2hCeUFyZ30mJHtjaHJBcmd9JiR7Y29vcmRBcmd9JiR7dW5pdEFyZ30mJHtyc0FyZ30mJHtjc0FyZ3Muam9pbignJicpfWBcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naVFUTHMgKCkge1xuXHRsZXQgYyAgICAgICAgPSB0aGlzLmdldENvbnRleHQoKTtcblx0bGV0IHVybEJhc2UgID0gJ2h0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9hbGxlbGUvc3VtbWFyeSc7XG5cdGxldCBjaHJBcmcgICA9IGBjaHJvbW9zb21lPSR7Yy5jaHJ9YDtcblx0bGV0IGNvb3JkQXJnID0gYGNvb3JkaW5hdGU9JHtjLnN0YXJ0fS0ke2MuZW5kfWA7XG5cdGxldCB1bml0QXJnICA9ICdjb29yZFVuaXQ9YnAnO1xuXHRsZXQgdHlwZUFyZyAgPSAnYWxsZWxlVHlwZT1RVEwnO1xuXHRsZXQgbGlua1VybCAgPSBgJHt1cmxCYXNlfT8ke2NockFyZ30mJHtjb29yZEFyZ30mJHt1bml0QXJnfSYke3R5cGVBcmd9YDtcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naUpCcm93c2UgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRsZXQgdXJsQmFzZSA9ICdodHRwOi8vamJyb3dzZS5pbmZvcm1hdGljcy5qYXgub3JnLyc7XG5cdGxldCBkYXRhQXJnID0gJ2RhdGE9ZGF0YSUyRm1vdXNlJzsgLy8gXCJkYXRhL21vdXNlXCJcblx0bGV0IGxvY0FyZyAgPSBgbG9jPWNociR7Yy5jaHJ9JTNBJHtjLnN0YXJ0fS4uJHtjLmVuZH1gO1xuXHRsZXQgdHJhY2tzICA9IFsnRE5BJywnTUdJX0dlbm9tZV9GZWF0dXJlcycsJ05DQklfQ0NEUycsJ05DQkknLCdFTlNFTUJMJ107XG5cdGxldCB0cmFja3NBcmc9YHRyYWNrcz0ke3RyYWNrcy5qb2luKCcsJyl9YDtcblx0bGV0IGhpZ2hsaWdodEFyZyA9ICdoaWdobGlnaHQ9Jztcblx0bGV0IGxpbmtVcmwgPSBgJHt1cmxCYXNlfT8keyBbZGF0YUFyZyxsb2NBcmcsdHJhY2tzQXJnLGhpZ2hsaWdodEFyZ10uam9pbignJicpIH1gO1xuXHR3aW5kb3cub3BlbihsaW5rVXJsLCBcIl9ibGFua1wiKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBNR1ZBcHBcblxuZXhwb3J0IHsgTUdWQXBwIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9NR1ZBcHAuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgR2Vub21lIHtcbiAgY29uc3RydWN0b3IgKGNmZykge1xuICAgIHRoaXMubmFtZSA9IGNmZy5uYW1lO1xuICAgIHRoaXMubGFiZWw9IGNmZy5sYWJlbDtcbiAgICB0aGlzLmNocm9tb3NvbWVzID0gW107XG4gICAgdGhpcy5tYXhsZW4gPSAtMTtcbiAgICB0aGlzLnhzY2FsZSA9IG51bGw7XG4gICAgdGhpcy55c2NhbGUgPSBudWxsO1xuICAgIHRoaXMuem9vbVkgID0gLTE7XG4gIH1cbiAgZ2V0Q2hyb21vc29tZSAobikge1xuICAgICAgaWYgKHR5cGVvZihuKSA9PT0gJ3N0cmluZycpXG5cdCAgcmV0dXJuIHRoaXMuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSBuKVswXTtcbiAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gdGhpcy5jaHJvbW9zb21lc1tuXTtcbiAgfVxuICBoYXNDaHJvbW9zb21lIChuKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDaHJvbW9zb21lKG4pID8gdHJ1ZSA6IGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCB7IEdlbm9tZSB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvR2Vub21lLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7ZDNqc29uLCBvdmVybGFwcywgc3VidHJhY3R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtGZWF0dXJlfSBmcm9tICcuL0ZlYXR1cmUnO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEhvdyB0aGUgYXBwIGxvYWRzIGZlYXR1cmUgZGF0YS4gUHJvdmlkZXMgdHdvIGNhbGxzOlxuLy8gICAtIGdldCBmZWF0dXJlcyBpbiByYW5nZVxuLy8gICAtIGdldCBmZWF0dXJlcyBieSBpZFxuLy8gUmVxdWVzdHMgZmVhdHVyZXMgZnJvbSB0aGUgc2VydmVyIGFuZCByZWdpc3RlcnMgdGhlbSBpbiBhIGNhY2hlLlxuLy8gSW50ZXJhY3RzIHdpdGggdGhlIGJhY2sgZW5kIHRvIGxvYWQgZmVhdHVyZXM7IHRyaWVzIG5vdCB0byByZXF1ZXN0XG4vLyB0aGUgc2FtZSByZWdpb24gdHdpY2UuXG4vL1xuY2xhc3MgRmVhdHVyZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMuaWQyZmVhdCA9IHt9O1x0XHQvLyBpbmRleCBmcm9tICBmZWF0dXJlIElEIHRvIGZlYXR1cmVcblx0dGhpcy5jYW5vbmljYWwyZmVhdHMgPSB7fTtcdC8vIGluZGV4IGZyb20gY2Fub25pY2FsIElEIC0+IFsgZmVhdHVyZXMgdGFnZ2VkIHdpdGggdGhhdCBpZCBdXG5cdHRoaXMuc3ltYm9sMmZlYXRzID0ge31cdFx0Ly8gaW5kZXggZnJvbSBzeW1ib2wgLT4gWyBmZWF0dXJlcyBoYXZpbmcgdGhhdCBzeW1ib2wgXVxuXHR0aGlzLmNhY2hlID0ge307XHRcdC8vIHtnZW5vbWUubmFtZSAtPiB7Y2hyLm5hbWUgLT4gbGlzdCBvZiBibG9ja3N9fVxuXHR0aGlzLm1pbmVGZWF0dXJlQ2FjaGUgPSB7fTtcdC8vIGF1eGlsaWFyeSBpbmZvIHB1bGxlZCBmcm9tIE1vdXNlTWluZSBcblx0dGhpcy5sb2FkZWRHZW5vbWVzID0gbmV3IFNldCgpOyAvLyB0aGUgc2V0IG9mIEdlbm9tZXMgdGhhdCBoYXZlIGJlZW4gZnVsbHkgbG9hZGVkXG4gICAgfVxuIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFByb2Nlc3NlcyB0aGUgXCJyYXdcIiBmZWF0dXJlcyByZXR1cm5lZCBieSB0aGUgc2VydmVyLlxuICAgIC8vIFR1cm5zIHRoZW0gaW50byBGZWF0dXJlIG9iamVjdHMgYW5kIHJlZ2lzdGVycyB0aGVtLlxuICAgIC8vIElmIHRoZSBzYW1lIHJhdyBmZWF0dXJlIGlzIHJlZ2lzdGVyZWQgYWdhaW4sXG4gICAgLy8gdGhlIEZlYXR1cmUgb2JqZWN0IGNyZWF0ZWQgdGhlIGZpcnN0IHRpbWUgaXMgcmV0dXJuZWQuXG4gICAgLy8gKEkuZS4sIHJlZ2lzdGVyaW5nIHRoZSBzYW1lIGZlYXR1cmUgbXVsdGlwbGUgdGltZXMgaXMgb2spXG4gICAgLy9cbiAgICBwcm9jZXNzRmVhdHVyZXMgKGZlYXRzLCBnZW5vbWUpIHtcblx0cmV0dXJuIGZlYXRzLm1hcChkID0+IHtcblx0ICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IHRoaXMgb25lIGluIHRoZSBjYWNoZSwgcmV0dXJuIGl0LlxuXHQgICAgbGV0IGYgPSB0aGlzLmlkMmZlYXRbZC5tZ3BpZF07XG5cdCAgICBpZiAoZikgcmV0dXJuIGY7XG5cdCAgICAvLyBDcmVhdGUgYSBuZXcgRmVhdHVyZVxuXHQgICAgZC5nZW5vbWUgPSBnZW5vbWVcblx0ICAgIGYgPSBuZXcgRmVhdHVyZShkKTtcblx0ICAgIC8vIFJlZ2lzdGVyIGl0LlxuXHQgICAgdGhpcy5pZDJmZWF0W2YubWdwaWRdID0gZjtcblx0ICAgIGlmIChmLm1naWlkICYmIGYubWdpaWQgIT09ICcuJykge1xuXHRcdGxldCBsc3QgPSB0aGlzLmNhbm9uaWNhbDJmZWF0c1tmLm1naWlkXSA9ICh0aGlzLmNhbm9uaWNhbDJmZWF0c1tmLm1naWlkXSB8fCBbXSk7XG5cdFx0bHN0LnB1c2goZik7XG5cdCAgICB9XG5cdCAgICBpZiAoZi5zeW1ib2wgJiYgZi5zeW1ib2wgIT09ICcuJykge1xuXHRcdGxldCBsc3QgPSB0aGlzLnN5bWJvbDJmZWF0c1tmLnN5bWJvbF0gPSAodGhpcy5zeW1ib2wyZmVhdHNbZi5zeW1ib2xdIHx8IFtdKTtcblx0XHRsc3QucHVzaChmKTtcblx0ICAgIH1cblx0ICAgIC8vIGhlcmUgeSdnby5cblx0ICAgIHJldHVybiBmO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZWdpc3RlcnMgYW4gaW5kZXggYmxvY2sgZm9yIHRoZSBnaXZlbiBnZW5vbWUuIEFuIGluZGV4IGJsb2NrXG4gICAgLy8gaXMgYSBjb250aWd1b3VzIGNodW5rIG9mIGZlYXR1ZXMgZnJvbSB0aGUgR0ZGIGZpbGUgZm9yIHRoYXQgZ2Vub21lLlxuICAgIC8vIFJlZ2lzdGVyaW5nIHRoZSBzYW1lIGJsb2NrIG11bHRpcGxlIHRpbWVzIGlzIG9rIC0gc3VjY2Vzc2l2ZSB0aW1lc1xuICAgIC8vIGhhdmUgbm8gZWZmZWN0LlxuICAgIC8vIFNpZGUgZWZmZWN0czpcbiAgICAvLyAgIEFkZHMgdGhlIGJsb2NrIHRvIHRoZSBjYWNoZVxuICAgIC8vICAgUmVwbGFjZXMgZWFjaCByYXcgZmVhdHVyZSBpbiB0aGUgYmxvY2sgd2l0aCBhIEZlYXR1cmUgb2JqZWN0LlxuICAgIC8vICAgUmVnaXN0ZXJzIG5ldyBGZWF0dXJlcyBpbiBhIGxvb2t1cC5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgZ2Vub21lIChvYmplY3QpIFRoZSBnZW5vbWUgdGhlIGJsb2NrIGlzIGZvcixcbiAgICAvLyAgIGJsayAob2JqZWN0KSBBbiBpbmRleCBibG9jaywgd2hpY2ggaGFzIGEgY2hyLCBzdGFydCwgZW5kLFxuICAgIC8vICAgXHRhbmQgYSBsaXN0IG9mIFwicmF3XCIgZmVhdHVyZSBvYmplY3RzLlxuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICBub3RoaW5nXG4gICAgLy9cbiAgICBfcmVnaXN0ZXJCbG9jayAoZ2Vub21lLCBibGspIHtcblx0Ly8gZ2Vub21lIGNhY2hlXG4gICAgICAgIGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdID0gKHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdIHx8IHt9KTtcblx0Ly8gY2hyb21vc29tZSBjYWNoZSAody9pbiBnZW5vbWUpXG5cdGxldCBjYyA9IGdjW2Jsay5jaHJdID0gKGdjW2Jsay5jaHJdIHx8IFtdKTtcblx0aWYgKGNjLmZpbHRlcihiID0+IGIuaWQgPT09IGJsay5pZCkubGVuZ3RoID09PSAwKSB7XG5cdCAgICBibGsuZmVhdHVyZXMgPSB0aGlzLnByb2Nlc3NGZWF0dXJlcyggYmxrLmZlYXR1cmVzLCBnZW5vbWUgKTtcblx0ICAgIGJsay5nZW5vbWUgPSBnZW5vbWU7XG5cdCAgICBjYy5wdXNoKGJsayk7XG5cdCAgICBjYy5zb3J0KCAoYSxiKSA9PiBhLnN0YXJ0IC0gYi5zdGFydCApO1xuXHR9XG5cdC8vZWxzZVxuXHQgICAgLy9jb25zb2xlLmxvZyhcIlNraXBwZWQgYmxvY2suIEFscmVhZHkgc2Vlbi5cIiwgZ2Vub21lLm5hbWUsIGJsay5pZCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgcmVtYWluZGVyIG9mIHRoZSBnaXZlbiByYW5nZSBhZnRlclxuICAgIC8vIHN1YnRyYWN0aW5nIHRoZSBhbHJlYWR5LWVuc3VyZWQgcmFuZ2VzLlxuICAgIC8vIFxuICAgIF9zdWJ0cmFjdFJhbmdlKGdlbm9tZSwgcmFuZ2Upe1xuXHRsZXQgZ2MgPSB0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXTtcblx0aWYgKCFnYykgdGhyb3cgXCJObyBzdWNoIGdlbm9tZTogXCIgKyBnZW5vbWUubmFtZTtcblx0bGV0IGdCbGtzID0gZ2NbcmFuZ2UuY2hyXSB8fCBbXTtcblx0bGV0IGFucyA9IFtdO1xuXHRsZXQgcm5nID0gcmFuZ2U7XG5cdGdCbGtzLmZvckVhY2goIGIgPT4ge1xuXHQgICAgbGV0IHN1YiA9IHJuZyA/IHN1YnRyYWN0KCBybmcsIGIgKSA6IFtdO1xuXHQgICAgaWYgKHN1Yi5sZW5ndGggPT09IDApXG5cdCAgICAgICAgcm5nID0gbnVsbDtcblx0ICAgIGlmIChzdWIubGVuZ3RoID09PSAxKVxuXHQgICAgICAgIHJuZyA9IHN1YlswXTtcblx0ICAgIGVsc2UgaWYgKHN1Yi5sZW5ndGggPT09IDIpe1xuXHQgICAgICAgIGFucy5wdXNoKHN1YlswXSk7XG5cdFx0cm5nID0gc3ViWzFdO1xuXHQgICAgfVxuXHR9KVxuXHRybmcgJiYgYW5zLnB1c2gocm5nKTtcblx0YW5zLnNvcnQoIChhLGIpID0+IGEuc3RhcnQgLSBiLnN0YXJ0ICk7XG5cdHJldHVybiBhbnM7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENhbGxzIHN1YnRyYWN0UmFuZ2UgZm9yIGVhY2ggcmFuZ2UgaW4gdGhlIGxpc3QgYW5kIHJldHVybnNcbiAgICAvLyB0aGUgYWNjdW11bGF0ZWQgcmVzdWx0cy5cbiAgICAvL1xuICAgIF9zdWJ0cmFjdFJhbmdlcyhnZW5vbWUsIHJhbmdlcykge1xuXHRsZXQgZ2MgPSB0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXTtcblx0aWYgKCFnYykgcmV0dXJuIHJhbmdlcztcblx0bGV0IG5ld3JhbmdlcyA9IFtdO1xuXHRyYW5nZXMuZm9yRWFjaChyID0+IHtcblx0ICAgIG5ld3JhbmdlcyA9IG5ld3Jhbmdlcy5jb25jYXQodGhpcy5fc3VidHJhY3RSYW5nZShnZW5vbWUsIHIpKTtcblx0fSwgdGhpcylcblx0cmV0dXJuIG5ld3JhbmdlcztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBFbnN1cmVzIHRoYXQgYWxsIGZlYXR1cmVzIGluIHRoZSBzcGVjaWZpZWQgcmFuZ2UocykgaW4gdGhlIHNwZWNpZmllZCBnZW5vbWVcbiAgICAvLyBhcmUgaW4gdGhlIGNhY2hlLiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRydWUgd2hlbiB0aGUgY29uZGl0aW9uIGlzIG1ldC5cbiAgICBfZW5zdXJlRmVhdHVyZXNCeVJhbmdlIChnZW5vbWUsIHJhbmdlcykge1xuXHRsZXQgbmV3cmFuZ2VzID0gdGhpcy5fc3VidHJhY3RSYW5nZXMoZ2Vub21lLCByYW5nZXMpO1xuXHRpZiAobmV3cmFuZ2VzLmxlbmd0aCA9PT0gMCkgXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdGxldCBjb29yZHNBcmcgPSBuZXdyYW5nZXMubWFwKHIgPT4gYCR7ci5jaHJ9OiR7ci5zdGFydH0uLiR7ci5lbmR9YCkuam9pbignLCcpO1xuXHRsZXQgZGF0YVN0cmluZyA9IGBnZW5vbWU9JHtnZW5vbWUubmFtZX0mY29vcmRzPSR7Y29vcmRzQXJnfWA7XG5cdGxldCB1cmwgPSBcIi4vYmluL2dldEZlYXR1cmVzLmNnaT9cIiArIGRhdGFTdHJpbmc7XG5cdGxldCBzZWxmID0gdGhpcztcblx0Y29uc29sZS5sb2coXCJSZXF1ZXN0aW5nOlwiLCBnZW5vbWUubmFtZSwgbmV3cmFuZ2VzKTtcblx0cmV0dXJuIGQzanNvbih1cmwpLnRoZW4oZnVuY3Rpb24oYmxvY2tzKXtcblx0ICAgIGJsb2Nrcy5mb3JFYWNoKCBiID0+IHNlbGYuX3JlZ2lzdGVyQmxvY2soZ2Vub21lLCBiKSApO1xuXHQgICAgc2VsZi5hcHAuc2hvd1N0YXR1cyhgTG9hZGVkOiAke2dlbm9tZS5uYW1lfWApO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdH0pO1xuICAgIH1cbiBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBfZW5zdXJlRmVhdHVyZXNCeUdlbm9tZSAoZ2Vub21lKSB7XG5cdGlmKCB0aGlzLmxvYWRlZEdlbm9tZXMuaGFzKGdlbm9tZSkgKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgbGV0IHJhbmdlcyA9IGdlbm9tZS5jaHJvbW9zb21lcy5tYXAoYyA9PiB7IFxuXHQgICAgcmV0dXJuIHsgY2hyOiBjLm5hbWUsIHN0YXJ0OiAxLCBlbmQ6IGMubGVuZ3RoIH07XG5cdH0pO1xuXHRyZXR1cm4gdGhpcy5fZW5zdXJlRmVhdHVyZXNCeVJhbmdlKGdlbm9tZSwgcmFuZ2VzKS50aGVuKHg9PnsgdGhpcy5sb2FkZWRHZW5vbWVzLmFkZChnZW5vbWUpOyByZXR1cm4gdHJ1ZTt9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsb2FkR2Vub21lcyAoZ2Vub21lcykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoZ2Vub21lcy5tYXAoZyA9PiB0aGlzLl9lbnN1cmVGZWF0dXJlc0J5R2Vub21lIChnKSkpLnRoZW4oKCk9PnRydWUpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIF9nZXRDYWNoZWRGZWF0dXJlcyAoZ2Vub21lLCByYW5nZSkge1xuICAgICAgICBsZXQgZ2MgPSB0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXSA7XG5cdGlmICghZ2MpIHJldHVybiBbXTtcblx0bGV0IGNCbG9ja3MgPSBnY1tyYW5nZS5jaHJdO1xuXHRpZiAoIWNCbG9ja3MpIHJldHVybiBbXTtcblx0bGV0IGZlYXRzID0gY0Jsb2Nrc1xuXHQgICAgLmZpbHRlcihjYiA9PiBvdmVybGFwcyhjYiwgcmFuZ2UpKVxuXHQgICAgLm1hcCggY2IgPT4gY2IuZmVhdHVyZXMuZmlsdGVyKCBmID0+IG92ZXJsYXBzKCBmLCByYW5nZSkgKSApXG5cdCAgICAucmVkdWNlKCAoYWNjLCB2YWwpID0+IGFjYy5jb25jYXQodmFsKSwgW10pO1xuICAgICAgICByZXR1cm4gZmVhdHM7XHRcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGFsbCBjYWNoZWQgZmVhdHVyZXMgaGF2aW5nIHRoZSBnaXZlbiBjYW5vbmljYWwgaWQuXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZUJ5SWQgKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkMmZlYXRzW2lkXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGFsbCBjYWNoZWQgZmVhdHVyZXMgaGF2aW5nIHRoZSBnaXZlbiBjYW5vbmljYWwgaWQuXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkIChjaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2Fub25pY2FsMmZlYXRzW2NpZF0gfHwgW107XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIGxpc3Qgb2YgZmVhdHVyZXMgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gbGFiZWwsIHdoaWNoIGNhbiBiZSBhbiBpZCwgY2Fub25pY2FsIGlkLCBvciBzeW1ib2wuXG4gICAgLy8gSWYgZ2Vub21lIGlzIHNwZWNpZmllZCwgbGltaXQgcmVzdWx0cyB0byBmZWF0dXJlcyBmcm9tIHRoYXQgZ2Vub21lLlxuICAgIC8vIFxuICAgIGdldENhY2hlZEZlYXR1cmVzQnlMYWJlbCAobGFiZWwsIGdlbm9tZSkge1xuXHRsZXQgZiA9IHRoaXMuaWQyZmVhdFtsYWJlbF1cblx0bGV0IGZlYXRzID0gZiA/IFtmXSA6IHRoaXMuY2Fub25pY2FsMmZlYXRzW2xhYmVsXSB8fCB0aGlzLnN5bWJvbDJmZWF0c1tsYWJlbF0gfHwgW107XG5cdHJldHVybiBnZW5vbWUgPyBmZWF0cy5maWx0ZXIoZj0+IGYuZ2Vub21lID09PSBnZW5vbWUpIDogZmVhdHM7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBmZWF0dXJlcyBpbiBcbiAgICAvLyB0aGUgc3BlY2lmaWVkIHJhbmdlcyBvZiB0aGUgc3BlY2lmaWVkIGdlbm9tZS5cbiAgICBnZXRGZWF0dXJlcyAoZ2Vub21lLCByYW5nZXMpIHtcblx0cmV0dXJuIHRoaXMuX2Vuc3VyZUZlYXR1cmVzQnlHZW5vbWUoZ2Vub21lKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmFuZ2VzLmZvckVhY2goIHIgPT4ge1xuXHQgICAgICAgIHIuZmVhdHVyZXMgPSB0aGlzLl9nZXRDYWNoZWRGZWF0dXJlcyhnZW5vbWUsIHIpIFxuXHRcdHIuZ2Vub21lID0gZ2Vub21lO1xuXHQgICAgfSk7XG5cdCAgICByZXR1cm4geyBnZW5vbWUsIGJsb2NrczpyYW5nZXMgfTtcblx0fS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBmZWF0dXJlcyBoYXZpbmcgdGhlIHNwZWNpZmllZCBpZHMgZnJvbSB0aGUgc3BlY2lmaWVkIGdlbm9tZS5cbiAgICBnZXRGZWF0dXJlc0J5SWQgKGdlbm9tZSwgaWRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbnN1cmVGZWF0dXJlc0J5R2Vub21lKGdlbm9tZSkudGhlbiggKCkgPT4ge1xuXHQgICAgbGV0IGZlYXRzID0gW107XG5cdCAgICBsZXQgc2VlbiA9IG5ldyBTZXQoKTtcblx0ICAgIGxldCBhZGRmID0gKGYpID0+IHtcblx0XHRpZiAoZi5nZW5vbWUgIT09IGdlbm9tZSkgcmV0dXJuO1xuXHRcdGlmIChzZWVuLmhhcyhmLmlkKSkgcmV0dXJuO1xuXHRcdHNlZW4uYWRkKGYuaWQpO1xuXHRcdGZlYXRzLnB1c2goZik7XG5cdCAgICB9O1xuXHQgICAgbGV0IGFkZCA9IChmKSA9PiB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZikpIFxuXHRcdCAgICBmLmZvckVhY2goZmYgPT4gYWRkZihmZikpO1xuXHRcdGVsc2Vcblx0XHQgICAgYWRkZihmKTtcblx0ICAgIH07XG5cdCAgICBmb3IgKGxldCBpIG9mIGlkcyl7XG5cdFx0bGV0IGYgPSB0aGlzLmNhbm9uaWNhbDJmZWF0c1tpXSB8fCB0aGlzLmlkMmZlYXRbaV07XG5cdFx0ZiAmJiBhZGQoZik7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZmVhdHM7XG5cdH0pO1xuICAgIH1cblxufSAvLyBlbmQgY2xhc3MgRmVhdHVyZSBNYW5hZ2VyXG5cbmV4cG9ydCB7IEZlYXR1cmVNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBpbml0T3B0TGlzdCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgQXV4RGF0YU1hbmFnZXIgfSBmcm9tICcuL0F1eERhdGFNYW5hZ2VyJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBRdWVyeU1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgY2ZnKSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0KTtcblx0dGhpcy5jZmcgPSBjZmc7XG5cdHRoaXMuYXV4RGF0YU1hbmFnZXIgPSBuZXcgQXV4RGF0YU1hbmFnZXIoKTtcblx0dGhpcy5zZWxlY3QgPSBudWxsO1x0Ly8gbXkgPHNlbGVjdD4gZWxlbWVudFxuXHR0aGlzLnRlcm0gPSBudWxsO1x0Ly8gbXkgPGlucHV0PiBlbGVtZW50XG5cdHRoaXMuaW5pdERvbSgpO1xuICAgIH1cbiAgICBpbml0RG9tICgpIHtcblx0dGhpcy5zZWxlY3QgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInNlYXJjaHR5cGVcIl0nKTtcblx0dGhpcy50ZXJtICAgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInNlYXJjaHRlcm1cIl0nKTtcblx0Ly9cblx0dGhpcy50ZXJtLmF0dHIoXCJwbGFjZWhvbGRlclwiLCB0aGlzLmNmZ1swXS5wbGFjZWhvbGRlcilcblx0aW5pdE9wdExpc3QodGhpcy5zZWxlY3RbMF1bMF0sIHRoaXMuY2ZnLCBjPT5jLm1ldGhvZCwgYz0+Yy5sYWJlbCk7XG5cdC8vIFdoZW4gdXNlciBjaGFuZ2VzIHRoZSBxdWVyeSB0eXBlIChzZWxlY3RvciksIGNoYW5nZSB0aGUgcGxhY2Vob2xkZXIgdGV4dC5cblx0dGhpcy5zZWxlY3Qub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xuXHQgICAgbGV0IG9wdCA9IHRoaXMuc2VsZWN0LnByb3BlcnR5KFwic2VsZWN0ZWRPcHRpb25zXCIpWzBdO1xuXHQgICAgdGhpcy50ZXJtLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBvcHQuX19kYXRhX18ucGxhY2Vob2xkZXIpXG5cdCAgICBcblx0fSk7XG5cdC8vIFdoZW4gdXNlciBlbnRlcnMgYSBzZWFyY2ggdGVybSwgcnVuIGEgcXVlcnlcblx0dGhpcy50ZXJtLm9uKFwiY2hhbmdlXCIsICgpID0+IHtcblx0ICAgIGxldCB0ZXJtID0gdGhpcy50ZXJtLnByb3BlcnR5KFwidmFsdWVcIik7XG5cdCAgICB0aGlzLnRlcm0ucHJvcGVydHkoXCJ2YWx1ZVwiLFwiXCIpO1xuXHQgICAgbGV0IHNlYXJjaFR5cGUgID0gdGhpcy5zZWxlY3QucHJvcGVydHkoXCJ2YWx1ZVwiKTtcblx0ICAgIGxldCBsc3ROYW1lID0gdGVybTtcblx0ICAgIGQzLnNlbGVjdChcIiNteWxpc3RzXCIpLmNsYXNzZWQoXCJidXN5XCIsdHJ1ZSk7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdCAgICB0aGlzLmF1eERhdGFNYW5hZ2VyW3NlYXJjaFR5cGVdKHRlcm0pXHQvLyA8LSBydW4gdGhlIHF1ZXJ5XG5cdCAgICAgIC50aGVuKGZlYXRzID0+IHtcblx0XHQgIC8vIEZJWE1FIC0gcmVhY2hvdmVyIC0gdGhpcyB3aG9sZSBoYW5kbGVyXG5cdFx0ICBsZXQgbHN0ID0gdGhpcy5hcHAubGlzdE1hbmFnZXIuY3JlYXRlTGlzdChsc3ROYW1lLCBmZWF0cy5tYXAoZiA9PiBmLnByaW1hcnlJZGVudGlmaWVyKSlcblx0XHQgIHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZShsc3QpO1xuXHRcdCAgLy9cblx0XHQgIHRoaXMuYXBwLnpvb21WaWV3LmhpRmVhdHMgPSB7fTtcblx0XHQgIGZlYXRzLmZvckVhY2goZiA9PiB0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzW2YubWdpaWRdID0gZi5tZ2lpZCk7XG5cdFx0ICB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoKTtcblx0XHQgIC8vXG5cdFx0ICB0aGlzLmFwcC5jdXJyZW50TGlzdCA9IGxzdDtcblx0XHQgIC8vXG5cdFx0ICBkMy5zZWxlY3QoXCIjbXlsaXN0c1wiKS5jbGFzc2VkKFwiYnVzeVwiLGZhbHNlKTtcblx0ICAgICAgfSk7XG5cdH0pXG4gICAgfVxufVxuXG5leHBvcnQgeyBRdWVyeU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1F1ZXJ5TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgZDNqc29uIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXV4RGF0YU1hbmFnZXIgLSBrbm93cyBob3cgdG8gcXVlcnkgYW4gZXh0ZXJuYWwgc291cmNlIChpLmUuLCBNb3VzZU1pbmUpIGZvciBnZW5lc1xuLy8gYW5ub3RhdGVkIHRvIGRpZmZlcmVudCBvbnRvbG9naWVzLiBcbmNsYXNzIEF1eERhdGFNYW5hZ2VyIHtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRBdXhEYXRhIChxKSB7XG5cdGxldCBmb3JtYXQgPSAnanNvbm9iamVjdHMnO1xuXHRsZXQgcXVlcnkgPSBlbmNvZGVVUklDb21wb25lbnQocSk7XG5cdGxldCB1cmwgPSBgaHR0cDovL3d3dy5tb3VzZW1pbmUub3JnL21vdXNlbWluZS9zZXJ2aWNlL3F1ZXJ5L3Jlc3VsdHM/Zm9ybWF0PSR7Zm9ybWF0fSZxdWVyeT0ke3F1ZXJ5fWA7XG5cdHJldHVybiBkM2pzb24odXJsKS50aGVuKGRhdGEgPT4gZGF0YS5yZXN1bHRzfHxbXSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gZG8gYSBMT09LVVAgcXVlcnkgZm9yIFNlcXVlbmNlRmVhdHVyZXMgZnJvbSBNb3VzZU1pbmVcbiAgICBmZWF0dXJlc0J5TG9va3VwIChxcnlTdHJpbmcpIHtcblx0bGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICAgIHZpZXc9XCJTZXF1ZW5jZUZlYXR1cmUucHJpbWFyeUlkZW50aWZpZXIgU2VxdWVuY2VGZWF0dXJlLnN5bWJvbFwiIFxuXHQgICAgbG9uZ0Rlc2NyaXB0aW9uPVwiXCIgXG5cdCAgICBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCIGFuZCBDXCI+XG5cdFx0PGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlXCIgb3A9XCJMT09LVVBcIiB2YWx1ZT1cIiR7cXJ5U3RyaW5nfVwiLz5cblx0XHQ8Y29uc3RyYWludCBjb2RlPVwiQlwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub3JnYW5pc20udGF4b25JZFwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdFx0PGNvbnN0cmFpbnQgY29kZT1cIkNcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLnNlcXVlbmNlT250b2xvZ3lUZXJtLm5hbWVcIiBvcD1cIiE9XCIgdmFsdWU9XCJ0cmFuc2dlbmVcIi8+XG5cdCAgICA8L3F1ZXJ5PmA7XG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZlYXR1cmVzQnlPbnRvbG9neVRlcm0gKHFyeVN0cmluZywgdGVybVR5cGUpIHtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICB2aWV3PVwiU2VxdWVuY2VGZWF0dXJlLnByaW1hcnlJZGVudGlmaWVyIFNlcXVlbmNlRmVhdHVyZS5zeW1ib2xcIiBsb25nRGVzY3JpcHRpb249XCJcIiBzb3J0T3JkZXI9XCJTZXF1ZW5jZUZlYXR1cmUuc3ltYm9sIGFzY1wiIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEIgYW5kIENcIj5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vbnRvbG9neUFubm90YXRpb25zLm9udG9sb2d5VGVybVwiIHR5cGU9XCIke3Rlcm1UeXBlfVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vbnRvbG9neUFubm90YXRpb25zLm9udG9sb2d5VGVybS5wYXJlbnRzXCIgdHlwZT1cIiR7dGVybVR5cGV9XCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm0ucGFyZW50c1wiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJCXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vcmdhbmlzbS50YXhvbklkXCIgb3A9XCI9XCIgdmFsdWU9XCIxMDA5MFwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkNcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLnNlcXVlbmNlT250b2xvZ3lUZXJtLm5hbWVcIiBvcD1cIiE9XCIgdmFsdWU9XCJ0cmFuc2dlbmVcIi8+XG5cdCAgPC9xdWVyeT5gXG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIChub3QgY3VycmVudGx5IGluIHVzZS4uLilcbiAgICBmZWF0dXJlc0J5UGF0aHdheVRlcm0gKHFyeVN0cmluZykge1xuICAgICAgICBsZXQgcSA9IGA8cXVlcnkgbmFtZT1cIlwiIG1vZGVsPVwiZ2Vub21pY1wiIFxuXHQgIHZpZXc9XCJQYXRod2F5LmdlbmVzLnByaW1hcnlJZGVudGlmaWVyIFBhdGh3YXkuZ2VuZXMuc3ltYm9sXCIgbG9uZ0Rlc2NyaXB0aW9uPVwiXCIgY29uc3RyYWludExvZ2ljPVwiQSBhbmQgQlwiPlxuXHQgICAgICA8Y29uc3RyYWludCBwYXRoPVwiUGF0aHdheVwiIGNvZGU9XCJBXCIgb3A9XCJMT09LVVBcIiB2YWx1ZT1cIiR7cXJ5U3RyaW5nfVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlBhdGh3YXkuZ2VuZXMub3JnYW5pc20udGF4b25JZFwiIGNvZGU9XCJCXCIgb3A9XCI9XCIgdmFsdWU9XCIxMDA5MFwiLz5cblx0ICA8L3F1ZXJ5PmA7XG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZlYXR1cmVzQnlJZCAgICAgICAgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5TG9va3VwKHFyeVN0cmluZyk7IH1cbiAgICBmZWF0dXJlc0J5RnVuY3Rpb24gIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeU9udG9sb2d5VGVybShxcnlTdHJpbmcsIFwiR09UZXJtXCIpOyB9XG4gICAgLy9mZWF0dXJlc0J5UGF0aHdheSAgIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeVBhdGh3YXlUZXJtKHFyeVN0cmluZyk7IH1cbiAgICBmZWF0dXJlc0J5UGhlbm90eXBlIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeU9udG9sb2d5VGVybShxcnlTdHJpbmcsIFwiTVBUZXJtXCIpOyB9XG4gICAgZmVhdHVyZXNCeURpc2Vhc2UgICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBcIkRPVGVybVwiKTsgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufVxuXG5leHBvcnQgeyBBdXhEYXRhTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQXV4RGF0YU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IExvY2FsU3RvcmFnZU1hbmFnZXIgfSBmcm9tICcuL1N0b3JhZ2VNYW5hZ2VyJztcbmltcG9ydCB7IExpc3RGb3JtdWxhRXZhbHVhdG9yIH0gZnJvbSAnLi9MaXN0Rm9ybXVsYUV2YWx1YXRvcic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTWFpbnRhaW5zIG5hbWVkIGxpc3RzIG9mIElEcy4gTGlzdHMgbWF5IGJlIHRlbXBvcmFyeSwgbGFzdGluZyBvbmx5IGZvciB0aGUgc2Vzc2lvbiwgb3IgcGVybWFuZW50LFxuLy8gbGFzdGluZyB1bnRpbCB0aGUgdXNlciBjbGVhcnMgdGhlIGJyb3dzZXIgbG9jYWwgc3RvcmFnZSBhcmVhLlxuLy9cbi8vIFVzZXMgd2luZG93LnNlc3Npb25TdG9yYWdlIGFuZCB3aW5kb3cubG9jYWxTdG9yYWdlIHRvIHNhdmUgbGlzdHNcbi8vIHRlbXBvcmFyaWx5IG9yIHBlcm1hbmVudGx5LCByZXNwLiAgRklYTUU6IHNob3VsZCBiZSB1c2luZyB3aW5kb3cuaW5kZXhlZERCXG4vL1xuY2xhc3MgTGlzdE1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMubmFtZTJsaXN0ID0gbnVsbDtcblx0dGhpcy5fbGlzdHMgPSBuZXcgTG9jYWxTdG9yYWdlTWFuYWdlciAgKFwibGlzdE1hbmFnZXIubGlzdHNcIilcblx0dGhpcy5mb3JtdWxhRXZhbCA9IG5ldyBMaXN0Rm9ybXVsYUV2YWx1YXRvcih0aGlzKTtcblx0dGhpcy5fbG9hZCgpO1xuXHR0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdC8vIEJ1dHRvbjogc2hvdy9oaWRlIHdhcm5pbmcgbWVzc2FnZVxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uLndhcm5pbmcnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHtcblx0ICAgICAgICBsZXQgdyA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwibWVzc2FnZVwiXScpO1xuXHRcdHcuY2xhc3NlZCgnc2hvd2luZycsICF3LmNsYXNzZWQoJ3Nob3dpbmcnKSk7XG5cdCAgICB9KTtcblx0Ly8gQnV0dG9uOiBjcmVhdGUgbGlzdCBmcm9tIGN1cnJlbnQgc2VsZWN0aW9uXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cIm5ld2Zyb21zZWxlY3Rpb25cIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGxldCBpZHMgPSBPYmplY3Qua2V5cyh0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzKTsgLy8gRklYTUUgLSByZWFjaG92ZXJcblx0XHRpZiAoaWRzLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vdGhpbmcgc2VsZWN0ZWQuXCIpO1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHRcdGxldCBuZXdsaXN0ID0gdGhpcy5jcmVhdGVMaXN0KFwic2VsZWN0aW9uXCIsIGlkcyk7XG5cdFx0dGhpcy51cGRhdGUobmV3bGlzdCk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IGNvbWJpbmUgbGlzdHM6IG9wZW4gbGlzdCBlZGl0b3Igd2l0aCBmb3JtdWxhIGVkaXRvciBvcGVuXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cImNvbWJpbmVcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlmICh0aGlzLmdldE5hbWVzKCkubGVuZ3RoID09PSAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTm8gbGlzdHMuXCIpO1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHRcdGxldCBsZSA9IHRoaXMuYXBwLmxpc3RFZGl0b3I7XG5cdFx0bGUub3BlbigpO1xuXHRcdGxlLm9wZW5Gb3JtdWxhRWRpdG9yKCk7XG5cdCAgICB9KTtcblx0Ly8gQnV0dG9uOiBkZWxldGUgYWxsIGxpc3RzIChnZXQgY29uZmlybWF0aW9uIGZpcnN0KS5cblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwicHVyZ2VcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlmICh0aGlzLmdldE5hbWVzKCkubGVuZ3RoID09PSAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTm8gbGlzdHMuXCIpO1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHQgICAgICAgIGlmICh3aW5kb3cuY29uZmlybShcIkRlbGV0ZSBhbGwgbGlzdHMuIEFyZSB5b3Ugc3VyZT9cIikpIHtcblx0XHQgICAgdGhpcy5wdXJnZSgpO1xuXHRcdCAgICB0aGlzLnVwZGF0ZSgpO1xuXHRcdH1cblx0ICAgIH0pO1xuICAgIH1cbiAgICBfbG9hZCAoKSB7XG5cdHRoaXMubmFtZTJsaXN0ID0gdGhpcy5fbGlzdHMuZ2V0KFwiYWxsXCIpO1xuXHRpZiAoIXRoaXMubmFtZTJsaXN0KXtcblx0ICAgIHRoaXMubmFtZTJsaXN0ID0ge307XG5cdCAgICB0aGlzLl9zYXZlKCk7XG5cdH1cbiAgICB9XG4gICAgX3NhdmUgKCkge1xuICAgICAgICB0aGlzLl9saXN0cy5wdXQoXCJhbGxcIiwgdGhpcy5uYW1lMmxpc3QpO1xuICAgIH1cbiAgICAvL1xuICAgIC8vIHJldHVybnMgdGhlIG5hbWVzIG9mIGFsbCB0aGUgbGlzdHMsIHNvcnRlZFxuICAgIGdldE5hbWVzICgpIHtcbiAgICAgICAgbGV0IG5tcyA9IE9iamVjdC5rZXlzKHRoaXMubmFtZTJsaXN0KTtcblx0bm1zLnNvcnQoKTtcblx0cmV0dXJuIG5tcztcbiAgICB9XG4gICAgLy8gcmV0dXJucyB0cnVlIGlmZiBhIGxpc3QgZXhpc3RzIHdpdGggdGhpcyBuYW1lXG4gICAgaGFzIChuYW1lKSB7XG4gICAgICAgIHJldHVybiBuYW1lIGluIHRoaXMubmFtZTJsaXN0O1xuICAgIH1cbiAgICAvLyBJZiBubyBsaXN0IHdpdGggdGhlIGdpdmVuIG5hbWUgZXhpc3RzLCByZXR1cm4gdGhlIG5hbWUuXG4gICAgLy8gT3RoZXJ3aXNlLCByZXR1cm4gYSBtb2RpZmllZCB2ZXJzaW9uIG9mIG5hbWUgdGhhdCBpcyB1bmlxdWUuXG4gICAgLy8gVW5pcXVlIG5hbWVzIGFyZSBjcmVhdGVkIGJ5IGFwcGVuZGluZyBhIGNvdW50ZXIuXG4gICAgLy8gRS5nLiwgdW5pcXVpZnkoXCJmb29cIikgLT4gXCJmb28uMVwiIG9yIFwiZm9vLjJcIiBvciB3aGF0ZXZlci5cbiAgICAvL1xuICAgIHVuaXF1aWZ5IChuYW1lKSB7XG5cdGlmICghdGhpcy5oYXMobmFtZSkpIFxuXHQgICAgcmV0dXJuIG5hbWU7XG5cdGZvciAobGV0IGkgPSAxOyA7IGkgKz0gMSkge1xuXHQgICAgbGV0IG5uID0gYCR7bmFtZX0uJHtpfWA7XG5cdCAgICBpZiAoIXRoaXMuaGFzKG5uKSlcblx0ICAgICAgICByZXR1cm4gbm47XG5cdH1cbiAgICB9XG4gICAgLy8gcmV0dXJucyB0aGUgbGlzdCB3aXRoIHRoaXMgbmFtZSwgb3IgbnVsbCBpZiBubyBzdWNoIGxpc3RcbiAgICBnZXQgKG5hbWUpIHtcbiAgICAgICAgbGV0IGxzdCA9IHRoaXMubmFtZTJsaXN0W25hbWVdO1xuXHRpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgbmFtZTtcblx0cmV0dXJuIGxzdDtcbiAgICB9XG4gICAgLy8gcmV0dXJucyBhbGwgdGhlIGxpc3RzLCBzb3J0ZWQgYnkgbmFtZVxuICAgIGdldEFsbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE5hbWVzKCkubWFwKG4gPT4gdGhpcy5nZXQobikpXG4gICAgfVxuICAgIC8vIFxuICAgIGNyZWF0ZU9yVXBkYXRlIChuYW1lLCBpZHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy51cGRhdGVMaXN0KG5hbWUsbnVsbCxpZHMpIDogdGhpcy5jcmVhdGVMaXN0KG5hbWUsIGlkcyk7XG4gICAgfVxuICAgIC8vIGNyZWF0ZXMgYSBuZXcgbGlzdCB3aXRoIHRoZSBnaXZlbiBuYW1lIGFuZCBpZHMuXG4gICAgY3JlYXRlTGlzdCAobmFtZSwgaWRzLCBmb3JtdWxhKSB7XG5cdGlmIChuYW1lICE9PSBcIl9cIilcblx0ICAgIG5hbWUgPSB0aGlzLnVuaXF1aWZ5KG5hbWUpO1xuXHQvL1xuXHRsZXQgZHQgPSBuZXcgRGF0ZSgpICsgXCJcIjtcblx0dGhpcy5uYW1lMmxpc3RbbmFtZV0gPSB7XG5cdCAgICBuYW1lOiAgICAgbmFtZSxcblx0ICAgIGlkczogICAgICBpZHMsXG5cdCAgICBmb3JtdWxhOiAgZm9ybXVsYSB8fCBcIlwiLFxuXHQgICAgY3JlYXRlZDogIGR0LFxuXHQgICAgbW9kaWZpZWQ6IGR0XG5cdH07XG5cdHRoaXMuX3NhdmUoKTtcblx0cmV0dXJuIHRoaXMubmFtZTJsaXN0W25hbWVdO1xuICAgIH1cbiAgICAvLyBQcm92aWRlIGFjY2VzcyB0byBldmFsdWF0aW9uIHNlcnZpY2VcbiAgICBldmFsRm9ybXVsYSAoZXhwcikge1xuXHRyZXR1cm4gdGhpcy5mb3JtdWxhRXZhbC5ldmFsKGV4cHIpO1xuICAgIH1cbiAgICAvLyBSZWZyZXNoZXMgYSBsaXN0IGFuZCByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHJlZnJlc2hlZCBsaXN0LlxuICAgIC8vIElmIHRoZSBsaXN0IGlmIGEgUE9MTywgcHJvbWlzZSByZXNvbHZlcyBpbW1lZGlhdGVseSB0byB0aGUgbGlzdC5cbiAgICAvLyBPdGhlcndpc2UsIHN0YXJ0cyBhIHJlZXZhbHVhdGlvbiBvZiB0aGUgZm9ybXVsYSB0aGF0IHJlc29sdmVzIGFmdGVyIHRoZVxuICAgIC8vIGxpc3QncyBpZHMgaGF2ZSBiZWVuIHVwZGF0ZWQuXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gZXJyb3IsIHRoZSByZXR1cm5lZCBwcm9taXNlIHJlamVjdHMgd2l0aCB0aGUgZXJyb3IuXG4gICAgcmVmcmVzaExpc3QgKG5hbWUpIHtcbiAgICAgICAgbGV0IGxzdCA9IHRoaXMuZ2V0KG5hbWUpO1xuXHRpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgbmFtZTtcblx0bHN0Lm1vZGlmaWVkID0gXCJcIituZXcgRGF0ZSgpO1xuXHRpZiAoIWxzdC5mb3JtdWxhKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShsc3QpO1xuXHRlbHNlIHtcblx0ICAgIGxldCBwID0gdGhpcy5mb3JtdWFsRXZhbC5ldmFsKGxzdC5mb3JtdWxhKS50aGVuKCBpZHMgPT4ge1xuXHRcdCAgICBsc3QuaWRzID0gaWRzO1xuXHRcdCAgICByZXR1cm4gbHN0O1xuXHRcdH0pO1xuXHQgICAgcmV0dXJuIHA7XG5cdH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGVzIHRoZSBpZHMgaW4gdGhlIGdpdmVuIGxpc3RcbiAgICB1cGRhdGVMaXN0IChuYW1lLCBuZXduYW1lLCBuZXdpZHMsIG5ld2Zvcm11bGEpIHtcblx0bGV0IGxzdCA9IHRoaXMuZ2V0KG5hbWUpO1xuICAgICAgICBpZiAoISBsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdGlmIChuZXduYW1lKSB7XG5cdCAgICBkZWxldGUgdGhpcy5uYW1lMmxpc3RbbHN0Lm5hbWVdO1xuXHQgICAgbHN0Lm5hbWUgPSB0aGlzLnVuaXF1aWZ5KG5ld25hbWUpO1xuXHQgICAgdGhpcy5uYW1lMmxpc3RbbHN0Lm5hbWVdID0gbHN0O1xuXHR9XG5cdGlmIChuZXdpZHMpIGxzdC5pZHMgID0gbmV3aWRzO1xuXHRpZiAobmV3Zm9ybXVsYSB8fCBuZXdmb3JtdWxhPT09XCJcIikgbHN0LmZvcm11bGEgPSBuZXdmb3JtdWxhO1xuXHRsc3QubW9kaWZpZWQgPSBuZXcgRGF0ZSgpICsgXCJcIjtcblx0dGhpcy5fc2F2ZSgpO1xuXHRyZXR1cm4gbHN0O1xuICAgIH1cbiAgICAvLyBkZWxldGVzIHRoZSBzcGVjaWZpZWQgbGlzdFxuICAgIGRlbGV0ZUxpc3QgKG5hbWUpIHtcbiAgICAgICAgbGV0IGxzdCA9IHRoaXMuZ2V0KG5hbWUpO1xuXHRkZWxldGUgdGhpcy5uYW1lMmxpc3RbbmFtZV07XG5cdHRoaXMuX3NhdmUoKTtcblx0Ly8gRklYTUU6IHVzZSBldmVudHMhIVxuXHRpZiAobHN0ID09PSB0aGlzLmFwcC5jdXJyZW50TGlzdCkgdGhpcy5hcHAuY3VycmVudExpc3QgPSBudWxsO1xuXHRpZiAobHN0ID09PSB0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QpIHRoaXMuYXBwLmxpc3RFZGl0b3IubGlzdCA9IG51bGw7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIGRlbGV0ZSBhbGwgbGlzdHNcbiAgICBwdXJnZSAoKSB7XG4gICAgICAgIHRoaXMubmFtZTJsaXN0ID0ge31cblx0dGhpcy5fc2F2ZSgpO1xuXHQvL1xuXHR0aGlzLmFwcC5jdXJyZW50TGlzdCA9IG51bGw7XG5cdHRoaXMuYXBwLmxpc3RFZGl0b3IubGlzdCA9IG51bGw7IC8vIEZJWE1FIC0gcmVhY2hhY3Jvc3NcbiAgICB9XG4gICAgLy8gUmV0dXJucyB0cnVlIGlmZiBleHByIGlzIHZhbGlkLCB3aGljaCBtZWFucyBpdCBpcyBib3RoIHN5bnRhY3RpY2FsbHkgY29ycmVjdCBcbiAgICAvLyBhbmQgYWxsIG1lbnRpb25lZCBsaXN0cyBleGlzdC5cbiAgICBpc1ZhbGlkIChleHByKSB7XG5cdHJldHVybiB0aGlzLmZvcm11bGFFdmFsLmlzVmFsaWQoZXhwcik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFVwZGF0ZXMgdGhlIFwiTXkgbGlzdHNcIiBib3ggd2l0aCB0aGUgY3VycmVudGx5IGF2YWlsYWJsZSBsaXN0cy5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgbmV3bGlzdCAoTGlzdCkgb3B0aW9uYWwuIElmIHNwZWNpZmllZCwgd2UganVzdCBjcmVhdGVkIHRoYXQgbGlzdCwgYW5kIGl0cyBuYW1lIGlzXG4gICAgLy8gICBcdGEgZ2VuZXJhdGVkIGRlZmF1bHQuIFBsYWNlIGZvY3VzIHRoZXJlIHNvIHVzZXIgY2FuIHR5cGUgbmV3IG5hbWUuXG4gICAgdXBkYXRlIChuZXdsaXN0KSB7XG5cdGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGxpc3RzID0gdGhpcy5nZXRBbGwoKTtcblx0bGV0IGJ5TmFtZSA9IChhLGIpID0+IHtcblx0ICAgIGxldCBhbiA9IGEubmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgbGV0IGJuID0gYi5uYW1lLnRvTG93ZXJDYXNlKCk7XG5cdCAgICByZXR1cm4gKGFuIDwgYm4gPyAtMSA6IGFuID4gYm4gPyArMSA6IDApO1xuXHR9O1xuXHRsZXQgYnlEYXRlID0gKGEsYikgPT4gKChuZXcgRGF0ZShiLm1vZGlmaWVkKSkuZ2V0VGltZSgpIC0gKG5ldyBEYXRlKGEubW9kaWZpZWQpKS5nZXRUaW1lKCkpO1xuXHRsaXN0cy5zb3J0KGJ5TmFtZSk7XG5cdGxldCBpdGVtcyA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwibGlzdHNcIl0nKS5zZWxlY3RBbGwoXCIubGlzdEluZm9cIilcblx0ICAgIC5kYXRhKGxpc3RzKTtcblx0bGV0IG5ld2l0ZW1zID0gaXRlbXMuZW50ZXIoKS5hcHBlbmQoXCJkaXZcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImxpc3RJbmZvIGZsZXhyb3dcIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwiaVwiKS5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zIGJ1dHRvblwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJlZGl0XCIpXG5cdCAgICAudGV4dChcIm1vZGVfZWRpdFwiKVxuXHQgICAgLmF0dHIoXCJ0aXRsZVwiLFwiRWRpdCB0aGlzIGxpc3QuXCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcIm5hbWVcIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwic3BhblwiKS5hdHRyKFwibmFtZVwiLFwic2l6ZVwiKTtcblx0bmV3aXRlbXMuYXBwZW5kKFwic3BhblwiKS5hdHRyKFwibmFtZVwiLFwiZGF0ZVwiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJpXCIpLmF0dHIoXCJjbGFzc1wiLFwibWF0ZXJpYWwtaWNvbnMgYnV0dG9uXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIixcImRlbGV0ZVwiKVxuXHQgICAgLnRleHQoXCJoaWdobGlnaHRfb2ZmXCIpXG5cdCAgICAuYXR0cihcInRpdGxlXCIsXCJEZWxldGUgdGhpcyBsaXN0LlwiKTtcblxuXHRpZiAobmV3aXRlbXNbMF1bMF0pIHtcblx0ICAgIGxldCBsYXN0ID0gbmV3aXRlbXNbMF1bbmV3aXRlbXNbMF0ubGVuZ3RoLTFdO1xuXHQgICAgbGFzdC5zY3JvbGxJbnRvVmlldygpO1xuXHR9XG5cblx0aXRlbXNcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBsc3Q9PmxzdC5uYW1lKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGxzdCkge1xuXHRcdGlmIChkMy5ldmVudC5hbHRLZXkpIHtcblx0XHQgICAgbGV0IGxlID0gc2VsZi5hcHAubGlzdEVkaXRvcjsgLy8gRklYTUUgcmVhY2hvdmVyXG5cdFx0ICAgIGxldCBzID0gbHN0Lm5hbWU7XG5cdFx0ICAgIGxldCByZSA9IC9bID0oKSsqLV0vO1xuXHRcdCAgICBpZiAocy5zZWFyY2gocmUpID49IDApXG5cdFx0XHRzID0gJ1wiJyArIHMgKyAnXCInO1xuXHRcdCAgICBpZiAoIWxlLmlzRWRpdGluZ0Zvcm11bGEpIHtcblx0XHQgICAgICAgIGxlLm9wZW4oKTtcblx0XHRcdGxlLm9wZW5Gb3JtdWxhRWRpdG9yKCk7XG5cdFx0ICAgIH1cblx0XHQgICAgLy9cblx0XHQgICAgbGUuYWRkVG9MaXN0RXhwcihzKycgJyk7XG5cdFx0fVxuXHRcdC8vIG90aGVyd2lzZSwgc2V0IHRoaXMgYXMgdGhlIGN1cnJlbnQgbGlzdFxuXHRcdGVsc2UgXG5cdFx0ICAgIHNlbGYuYXBwLmN1cnJlbnRMaXN0ID0gbHN0OyAvLyBGSVhNRSByZWFjaG92ZXJcblx0ICAgIH0pO1xuXHRpdGVtcy5zZWxlY3QoJy5idXR0b25bbmFtZT1cImVkaXRcIl0nKVxuXHQgICAgLy8gZWRpdDogY2xpY2sgXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbihsc3QpIHtcblx0ICAgICAgICBzZWxmLmFwcC5saXN0RWRpdG9yLm9wZW4obHN0KTtcblx0ICAgIH0pO1xuXHRpdGVtcy5zZWxlY3QoJ3NwYW5bbmFtZT1cIm5hbWVcIl0nKVxuXHQgICAgLnRleHQobHN0ID0+IGxzdC5uYW1lKTtcblx0aXRlbXMuc2VsZWN0KCdzcGFuW25hbWU9XCJkYXRlXCJdJykudGV4dChsc3QgPT4ge1xuXHQgICAgbGV0IG1kID0gbmV3IERhdGUobHN0Lm1vZGlmaWVkKTtcblx0ICAgIGxldCBkID0gYCR7bWQuZ2V0RnVsbFllYXIoKX0tJHttZC5nZXRNb250aCgpKzF9LSR7bWQuZ2V0RGF0ZSgpfSBgIFxuXHQgICAgICAgICAgKyBgOiR7bWQuZ2V0SG91cnMoKX0uJHttZC5nZXRNaW51dGVzKCl9LiR7bWQuZ2V0U2Vjb25kcygpfWA7XG5cdCAgICByZXR1cm4gZDtcblx0fSk7XG5cdGl0ZW1zLnNlbGVjdCgnc3BhbltuYW1lPVwic2l6ZVwiXScpLnRleHQobHN0ID0+IGxzdC5pZHMubGVuZ3RoKTtcblx0aXRlbXMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJkZWxldGVcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgbHN0ID0+IHtcblx0ICAgICAgICB0aGlzLmRlbGV0ZUxpc3QobHN0Lm5hbWUpO1xuXHRcdHRoaXMudXBkYXRlKCk7XG5cblx0XHQvLyBOb3Qgc3VyZSB3aHkgdGhpcyBpcyBuZWNlc3NhcnkgaGVyZS4gQnV0IHdpdGhvdXQgaXQsIHRoZSBsaXN0IGl0ZW0gYWZ0ZXIgdGhlIG9uZSBiZWluZ1xuXHRcdC8vIGRlbGV0ZWQgaGVyZSB3aWxsIHJlY2VpdmUgYSBjbGljayBldmVudC5cblx0XHRkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHQvL1xuXHQgICAgfSk7XG5cblx0Ly9cblx0aXRlbXMuZXhpdCgpLnJlbW92ZSgpO1xuXHQvL1xuXHRpZiAobmV3bGlzdCkge1xuXHQgICAgbGV0IGxzdGVsdCA9IFxuXHQgICAgICAgIGQzLnNlbGVjdChgI215bGlzdHMgW25hbWU9XCJsaXN0c1wiXSBbbmFtZT1cIiR7bmV3bGlzdC5uYW1lfVwiXWApWzBdWzBdO1xuICAgICAgICAgICAgbHN0ZWx0LnNjcm9sbEludG9WaWV3KGZhbHNlKTtcblx0fVxuICAgIH1cblxufSAvLyBlbmQgY2xhc3MgTGlzdE1hbmFnZXJcblxuZXhwb3J0IHsgTGlzdE1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0xpc3RNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9IGZyb20gJy4vTGlzdEZvcm11bGFQYXJzZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEtub3dzIGhvdyB0byBwYXJzZSBhbmQgZXZhbHVhdGUgYSBsaXN0IGZvcm11bGEgKGFrYSBsaXN0IGV4cHJlc3Npb24pLlxuY2xhc3MgTGlzdEZvcm11bGFFdmFsdWF0b3Ige1xuICAgIGNvbnN0cnVjdG9yIChsaXN0TWFuYWdlcikge1xuXHR0aGlzLmxpc3RNYW5hZ2VyID0gbGlzdE1hbmFnZXI7XG4gICAgICAgIHRoaXMucGFyc2VyID0gbmV3IExpc3RGb3JtdWxhUGFyc2VyKCk7XG4gICAgfVxuICAgIC8vIEV2YWx1YXRlcyB0aGUgZXhwcmVzc2lvbiBhbmQgcmV0dXJucyBhIFByb21pc2UgZm9yIHRoZSBsaXN0IG9mIGlkcy5cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBlcnJvciwgdGhlIHByb21pc2UgcmVqZWN0cyB3aXRoIHRoZSBlcnJvciBtZXNzYWdlLlxuICAgIGV2YWwgKGV4cHIpIHtcblx0IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0ICAgICB0cnkge1xuXHRcdGxldCBhc3QgPSB0aGlzLnBhcnNlci5wYXJzZShleHByKTtcblx0XHRsZXQgbG0gPSB0aGlzLmxpc3RNYW5hZ2VyO1xuXHRcdGxldCByZWFjaCA9IChuKSA9PiB7XG5cdFx0ICAgIGlmICh0eXBlb2YobikgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdGxldCBsc3QgPSBsbS5nZXQobik7XG5cdFx0XHRpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgbjtcblx0XHRcdHJldHVybiBuZXcgU2V0KGxzdC5pZHMpO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVsc2Uge1xuXHRcdFx0bGV0IGwgPSByZWFjaChuLmxlZnQpO1xuXHRcdFx0bGV0IHIgPSByZWFjaChuLnJpZ2h0KTtcblx0XHRcdHJldHVybiBsW24ub3BdKHIpO1xuXHRcdCAgICB9XG5cdFx0fVxuXHRcdGxldCBpZHMgPSByZWFjaChhc3QpO1xuXHRcdHJlc29sdmUoQXJyYXkuZnJvbShpZHMpKTtcblx0ICAgIH1cblx0ICAgIGNhdGNoIChlKSB7XG5cdFx0cmVqZWN0KGUpO1xuXHQgICAgfVxuXHQgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgLy8gQ2hlY2tzIHRoZSBjdXJyZW50IGV4cHJlc3Npb24gZm9yIHN5bnRhY3RpYyBhbmQgc2VtYW50aWMgdmFsaWRpdHkgYW5kIHNldHMgdGhlIFxuICAgIC8vIHZhbGlkL2ludmFsaWQgY2xhc3MgYWNjb3JkaW5nbHkuIFNlbWFudGljIHZhbGlkaXR5IHNpbXBseSBtZWFucyBhbGwgbmFtZXMgaW4gdGhlXG4gICAgLy8gZXhwcmVzc2lvbiBhcmUgYm91bmQuXG4gICAgLy9cbiAgICBpc1ZhbGlkICAoZXhwcikge1xuXHR0cnkge1xuXHQgICAgLy8gZmlyc3QgY2hlY2sgc3ludGF4XG5cdCAgICBsZXQgYXN0ID0gdGhpcy5wYXJzZXIucGFyc2UoZXhwcik7XG5cdCAgICBsZXQgbG0gID0gdGhpcy5saXN0TWFuYWdlcjsgXG5cdCAgICAvLyBub3cgY2hlY2sgbGlzdCBuYW1lc1xuXHQgICAgKGZ1bmN0aW9uIHJlYWNoKG4pIHtcblx0XHRpZiAodHlwZW9mKG4pID09PSBcInN0cmluZ1wiKSB7XG5cdFx0ICAgIGxldCBsc3QgPSBsbS5nZXQobik7XG5cdFx0ICAgIGlmICghbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICByZWFjaChuLmxlZnQpO1xuXHRcdCAgICByZWFjaChuLnJpZ2h0KTtcblx0XHR9XG5cdCAgICB9KShhc3QpO1xuXG5cdCAgICAvLyBUaHVtYnMgdXAhXG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fVxuXHRjYXRjaCAoZSkge1xuXHQgICAgLy8gc3ludGF4IGVycm9yIG9yIHVua25vd24gbGlzdCBuYW1lXG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IExpc3RGb3JtdWxhRXZhbHVhdG9yIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0Rm9ybXVsYUV2YWx1YXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgc2V0Q2FyZXRQb3NpdGlvbiwgbW92ZUNhcmV0UG9zaXRpb24sIGdldENhcmV0UmFuZ2UgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IExpc3RGb3JtdWxhUGFyc2VyIH0gZnJvbSAnLi9MaXN0Rm9ybXVsYVBhcnNlcic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgTGlzdEVkaXRvciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0KSB7XG5cdHN1cGVyKGFwcCwgZWx0KTtcblx0dGhpcy5wYXJzZXIgPSBuZXcgTGlzdEZvcm11bGFQYXJzZXIoKTtcblx0dGhpcy5mb3JtID0gbnVsbDtcblx0dGhpcy5pbml0RG9tKCk7XG5cdHRoaXMuaXNFZGl0aW5nRm9ybXVsYSA9IGZhbHNlO1xuXHQvL1xuXHR0aGlzLmxpc3QgPSBudWxsO1xuICAgIH1cbiAgICBpbml0RG9tICgpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHR0aGlzLmZvcm0gPSB0aGlzLnJvb3Quc2VsZWN0KFwiZm9ybVwiKVswXVswXTtcblx0aWYgKCF0aGlzLmZvcm0pIHRocm93IFwiQ291bGQgbm90IGluaXQgTGlzdEVkaXRvci4gTm8gZm9ybSBlbGVtZW50LlwiO1xuXHRkMy5zZWxlY3QodGhpcy5mb3JtKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHQgICAgICAgIGxldCB0ID0gZDMuZXZlbnQudGFyZ2V0O1xuXHRcdGlmIChcImJ1dHRvblwiID09PSB0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSl7XG5cdFx0ICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ICAgIGxldCBmID0gdGhpcy5mb3JtO1xuXHRcdCAgICBsZXQgcyA9IGYuaWRzLnZhbHVlLnJlcGxhY2UoL1ssfF0vZywgJyAnKS50cmltKCk7XG5cdFx0ICAgIGxldCBpZHMgPSBzID8gcy5zcGxpdCgvXFxzKy8pIDogW107XG5cdFx0ICAgIC8vIHNhdmUgbGlzdFxuXHRcdCAgICBpZiAodC5uYW1lID09PSBcInNhdmVcIikge1xuXHRcdFx0aWYgKCF0aGlzLmxpc3QpIHJldHVybjtcblx0XHRcdHRoaXMubGlzdCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZUxpc3QodGhpcy5saXN0Lm5hbWUsIGYubmFtZS52YWx1ZSwgaWRzLCBmLmZvcm11bGEudmFsdWUpO1xuXHRcdFx0dGhpcy5hcHAubGlzdE1hbmFnZXIudXBkYXRlKHRoaXMubGlzdCk7XG5cdFx0ICAgIH1cblx0XHQgICAgLy8gY3JlYXRlIG5ldyBsaXN0XG5cdFx0ICAgIGVsc2UgaWYgKHQubmFtZSA9PT0gXCJuZXdcIikge1xuXHRcdFx0bGV0IG4gPSBmLm5hbWUudmFsdWUudHJpbSgpO1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHQgICBhbGVydChcIllvdXIgbGlzdCBoYXMgbm8gbmFtZSBhbmQgaXMgdmVyeSBzYWQuIFBsZWFzZSBnaXZlIGl0IGEgbmFtZSBhbmQgdHJ5IGFnYWluLlwiKTtcblx0XHRcdCAgIHJldHVyblxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAobi5pbmRleE9mKCdcIicpID49IDApIHtcblx0XHRcdCAgIGFsZXJ0KFwiT2ggZGVhciwgeW91ciBsaXN0J3MgbmFtZSBoYXMgYSBkb3VibGUgcXVvdGUgY2hhcmFjdGVyLCBhbmQgSSdtIGFmYXJhaWQgdGhhdCdzIG5vdCBhbGxvd2VkLiBQbGVhc2UgcmVtb3ZlIHRoZSAnXFxcIicgYW5kIHRyeSBhZ2Fpbi5cIik7XG5cdFx0XHQgICByZXR1cm5cblx0XHRcdH1cblx0XHQgICAgICAgIHRoaXMubGlzdCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLmNyZWF0ZUxpc3QobiwgaWRzLCBmLmZvcm11bGEudmFsdWUpO1xuXHRcdFx0dGhpcy5hcHAubGlzdE1hbmFnZXIudXBkYXRlKHRoaXMubGlzdCk7XG5cdFx0ICAgIH1cblx0XHQgICAgLy8gY2xlYXIgZm9ybVxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwiY2xlYXJcIikge1xuXHRcdCAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0XHQgICAgfVxuXHRcdCAgICAvLyBmb3J3YXJkIHRvIE1HSVxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwidG9NZ2lcIikge1xuXHRcdCAgICAgICAgbGV0IGZybSA9IGQzLnNlbGVjdCgnI21naWJhdGNoZm9ybScpWzBdWzBdO1xuXHRcdFx0ZnJtLmlkcy52YWx1ZSA9IGlkcy5qb2luKFwiIFwiKTtcblx0XHRcdGZybS5zdWJtaXQoKVxuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGZvcndhcmQgdG8gTW91c2VNaW5lXG5cdFx0ICAgIGVsc2UgaWYgKHQubmFtZSA9PT0gXCJ0b01vdXNlTWluZVwiKSB7XG5cdFx0ICAgICAgICBsZXQgZnJtID0gZDMuc2VsZWN0KCcjbW91c2VtaW5lZm9ybScpWzBdWzBdO1xuXHRcdFx0ZnJtLmV4dGVybmFsaWRzLnZhbHVlID0gaWRzLmpvaW4oXCIsXCIpO1xuXHRcdFx0ZnJtLnN1Ym1pdCgpXG5cdFx0ICAgIH1cblx0XHR9XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IHNob3cvaGlkZSBmb3JtdWxhIGVkaXRvclxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImlkc2VjdGlvblwiXSAuYnV0dG9uW25hbWU9XCJlZGl0Zm9ybXVsYVwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRvZ2dsZUZvcm11bGFFZGl0b3IoKSk7XG5cdCAgICBcblx0Ly8gSW5wdXQgYm94OiBmb3JtdWxhOiB2YWxpZGF0ZSBvbiBhbnkgaW5wdXRcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIFtuYW1lPVwiZm9ybXVsYVwiXScpXG5cdCAgICAub24oXCJpbnB1dFwiLCAoKSA9PiB7XG5cdCAgICAgICAgdGhpcy52YWxpZGF0ZUV4cHIoKTtcblx0ICAgIH0pO1xuXG5cdC8vIEZvcndhcmQgLT4gTUdJL01vdXNlTWluZTogZGlzYWJsZSBidXR0b25zIGlmIG5vIGlkc1xuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImlkc1wiXScpXG5cdCAgICAub24oXCJpbnB1dFwiLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IGVtcHR5ID0gdGhpcy5mb3JtLmlkcy52YWx1ZS50cmltKCkubGVuZ3RoID09PSAwO1xuXHRcdHRoaXMuZm9ybS50b01naS5kaXNhYmxlZCA9IHRoaXMuZm9ybS50b01vdXNlTWluZS5kaXNhYmxlZCA9IGVtcHR5O1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uczogdGhlIGxpc3Qgb3BlcmF0b3IgYnV0dG9ucyAodW5pb24sIGludGVyc2VjdGlvbiwgZXRjLilcblx0dGhpcy5yb290LnNlbGVjdEFsbCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIC5idXR0b24ubGlzdG9wJylcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHQvLyBhZGQgbXkgc3ltYm9sIHRvIHRoZSBmb3JtdWxhXG5cdFx0bGV0IGluZWx0ID0gc2VsZi5mb3JtLmZvcm11bGE7XG5cdFx0bGV0IG9wID0gZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJuYW1lXCIpO1xuXHRcdHNlbGYuYWRkVG9MaXN0RXhwcihvcCk7XG5cdFx0c2VsZi52YWxpZGF0ZUV4cHIoKTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbjogcmVmcmVzaCBidXR0b24gZm9yIHJ1bm5pbmcgdGhlIGZvcm11bGFcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIC5idXR0b25bbmFtZT1cInJlZnJlc2hcIl0nKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGxldCBlbWVzc2FnZT1cIkknbSB0ZXJyaWJseSBzb3JyeSwgYnV0IHRoZXJlIGFwcGVhcnMgdG8gYmUgYSBwcm9ibGVtIHdpdGggeW91ciBsaXN0IGV4cHJlc3Npb246IFwiO1xuXHRcdGxldCBmb3JtdWxhID0gdGhpcy5mb3JtLmZvcm11bGEudmFsdWUudHJpbSgpO1xuXHRcdGlmIChmb3JtdWxhLmxlbmd0aCA9PT0gMClcblx0XHQgICAgcmV0dXJuO1xuXHQgICAgICAgIHRoaXMuYXBwLmxpc3RNYW5hZ2VyXG5cdFx0ICAgIC5ldmFsRm9ybXVsYShmb3JtdWxhKVxuXHRcdCAgICAudGhlbihpZHMgPT4ge1xuXHRcdCAgICAgICAgdGhpcy5mb3JtLmlkcy52YWx1ZSA9IGlkcy5qb2luKFwiXFxuXCIpO1xuXHRcdCAgICAgfSlcblx0XHQgICAgLmNhdGNoKGUgPT4gYWxlcnQoZW1lc3NhZ2UgKyBlKSk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IGNsb3NlIGZvcm11bGEgZWRpdG9yXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uW25hbWU9XCJjbG9zZVwiXScpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpICk7XG5cdFxuXHQvLyBDbGlja2luZyB0aGUgYm94IGNvbGxhcHNlIGJ1dHRvbiBzaG91bGQgY2xlYXIgdGhlIGZvcm1cblx0dGhpcy5yb290LnNlbGVjdChcIi5idXR0b24uY2xvc2VcIilcblx0ICAgIC5vbihcImNsaWNrLmV4dHJhXCIsICgpID0+IHtcblx0ICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuXHRcdHRoaXMuY2xvc2VGb3JtdWxhRWRpdG9yKCk7XG5cdCAgICB9KTtcbiAgICB9XG4gICAgcGFyc2VJZHMgKHMpIHtcblx0cmV0dXJuIHMucmVwbGFjZSgvWyx8XS9nLCAnICcpLnRyaW0oKS5zcGxpdCgvXFxzKy8pO1xuICAgIH1cbiAgICBnZXQgbGlzdCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0O1xuICAgIH1cbiAgICBzZXQgbGlzdCAobHN0KSB7XG4gICAgICAgIHRoaXMuX2xpc3QgPSBsc3Q7XG5cdHRoaXMuX3N5bmNEaXNwbGF5KCk7XG4gICAgfVxuICAgIF9zeW5jRGlzcGxheSAoKSB7XG5cdGxldCBsc3QgPSB0aGlzLl9saXN0O1xuXHRpZiAoIWxzdCkge1xuXHQgICAgdGhpcy5mb3JtLm5hbWUudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5pZHMudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSBmYWxzZTtcblx0ICAgIHRoaXMuZm9ybS5tb2RpZmllZC52YWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5mb3JtLmZvcm11bGEudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5zYXZlLmRpc2FibGVkID0gdHJ1ZTtcblx0ICAgIHRoaXMuZm9ybS50b01naS5kaXNhYmxlZCA9IHRydWU7XG5cdCAgICB0aGlzLmZvcm0udG9Nb3VzZU1pbmUuZGlzYWJsZWQgPSB0cnVlO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy5mb3JtLm5hbWUudmFsdWUgPSBsc3QubmFtZTtcblx0ICAgIHRoaXMuZm9ybS5pZHMudmFsdWUgPSBsc3QuaWRzLmpvaW4oJ1xcbicpO1xuXHQgICAgdGhpcy5mb3JtLmZvcm11bGEudmFsdWUgPSBsc3QuZm9ybXVsYSB8fCBcIlwiO1xuXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlLnRyaW0oKS5sZW5ndGggPiAwO1xuXHQgICAgdGhpcy5mb3JtLm1vZGlmaWVkLnZhbHVlID0gbHN0Lm1vZGlmaWVkO1xuXHQgICAgdGhpcy5mb3JtLnNhdmUuZGlzYWJsZWQgPSBmYWxzZTtcblx0ICAgIHRoaXMuZm9ybS50b01naS5kaXNhYmxlZCBcblx0ICAgICAgPSB0aGlzLmZvcm0udG9Nb3VzZU1pbmUuZGlzYWJsZWQgXG5cdCAgICAgICAgPSAodGhpcy5mb3JtLmlkcy52YWx1ZS50cmltKCkubGVuZ3RoID09PSAwKTtcblx0fVxuXHR0aGlzLnZhbGlkYXRlRXhwcigpO1xuICAgIH1cbiAgICBjbGVhciAoKSB7XG4gICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG4gICAgfVxuICAgIG9wZW4gKGxzdCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBsc3Q7XG5cdHRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIsIGZhbHNlKTtcbiAgICB9XG4gICAgY2xvc2UgKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiLCB0cnVlKTtcbiAgICB9XG4gICAgb3BlbkZvcm11bGFFZGl0b3IgKCkge1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImVkaXRpbmdmb3JtdWxhXCIsIHRydWUpO1xuXHR0aGlzLmlzRWRpdGluZ0Zvcm11bGEgPSB0cnVlO1xuXHRsZXQgZiA9IHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlO1xuXHR0aGlzLmZvcm0uZm9ybXVsYS5mb2N1cygpO1xuXHRzZXRDYXJldFBvc2l0aW9uKHRoaXMuZm9ybS5mb3JtdWxhLCBmLmxlbmd0aCk7XG4gICAgfVxuICAgIGNsb3NlRm9ybXVsYUVkaXRvciAoKSB7XG5cdHRoaXMucm9vdC5jbGFzc2VkKFwiZWRpdGluZ2Zvcm11bGFcIiwgZmFsc2UpO1xuXHR0aGlzLmlzRWRpdGluZ0Zvcm11bGEgPSBmYWxzZTtcbiAgICB9XG4gICAgdG9nZ2xlRm9ybXVsYUVkaXRvciAoKSB7XG5cdGxldCBzaG93aW5nID0gdGhpcy5yb290LmNsYXNzZWQoXCJlZGl0aW5nZm9ybXVsYVwiKTtcblx0c2hvd2luZyA/IHRoaXMuY2xvc2VGb3JtdWxhRWRpdG9yKCkgOiB0aGlzLm9wZW5Gb3JtdWxhRWRpdG9yKCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENoZWNrcyB0aGUgY3VycmVudCBleHByZXNzaW9uIGFuZCBzZXRzIHRoZSB2YWxpZC9pbnZhbGlkIGNsYXNzLlxuICAgIHZhbGlkYXRlRXhwciAgKCkge1xuXHRsZXQgaW5wID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIFtuYW1lPVwiZm9ybXVsYVwiXScpO1xuXHRsZXQgZXhwciA9IGlucFswXVswXS52YWx1ZS50cmltKCk7XG5cdGlmICghZXhwcikge1xuXHQgICAgaW5wLmNsYXNzZWQoXCJ2YWxpZFwiLGZhbHNlKS5jbGFzc2VkKFwiaW52YWxpZFwiLGZhbHNlKTtcbiBcdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gZmFsc2U7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICBsZXQgaXNWYWxpZCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLmlzVmFsaWQoZXhwcik7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdCAgICBpbnAuY2xhc3NlZChcInZhbGlkXCIsIGlzVmFsaWQpLmNsYXNzZWQoXCJpbnZhbGlkXCIsICFpc1ZhbGlkKTtcbiBcdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gdHJ1ZTtcblx0fVxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhZGRUb0xpc3RFeHByICh0ZXh0KSB7XG5cdGxldCBpbnAgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gW25hbWU9XCJmb3JtdWxhXCJdJyk7XG5cdGxldCBpZWx0ID0gaW5wWzBdWzBdO1xuXHRsZXQgdiA9IGllbHQudmFsdWU7XG5cdGxldCBzcGxpY2UgPSBmdW5jdGlvbiAoZSx0KXtcblx0ICAgIGxldCB2ID0gZS52YWx1ZTtcblx0ICAgIGxldCByID0gZ2V0Q2FyZXRSYW5nZShlKTtcblx0ICAgIGUudmFsdWUgPSB2LnNsaWNlKDAsclswXSkgKyB0ICsgdi5zbGljZShyWzFdKTtcblx0ICAgIHNldENhcmV0UG9zaXRpb24oZSwgclswXSt0Lmxlbmd0aCk7XG5cdCAgICBlLmZvY3VzKCk7XG5cdH1cblx0bGV0IHJhbmdlID0gZ2V0Q2FyZXRSYW5nZShpZWx0KTtcblx0aWYgKHJhbmdlWzBdID09PSByYW5nZVsxXSkge1xuXHQgICAgLy8gbm8gY3VycmVudCBzZWxlY3Rpb25cblx0ICAgIHNwbGljZShpZWx0LCB0ZXh0KTtcblx0ICAgIGlmICh0ZXh0ID09PSBcIigpXCIpIFxuXHRcdG1vdmVDYXJldFBvc2l0aW9uKGllbHQsIC0xKTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIC8vIHRoZXJlIGlzIGEgY3VycmVudCBzZWxlY3Rpb25cblx0ICAgIGlmICh0ZXh0ID09PSBcIigpXCIpXG5cdFx0Ly8gc3Vycm91bmQgY3VycmVudCBzZWxlY3Rpb24gd2l0aCBwYXJlbnMsIHRoZW4gbW92ZSBjYXJldCBhZnRlclxuXHRcdHRleHQgPSAnKCcgKyB2LnNsaWNlKHJhbmdlWzBdLHJhbmdlWzFdKSArICcpJztcblx0ICAgIHNwbGljZShpZWx0LCB0ZXh0KVxuXHR9XG5cdHRoaXMudmFsaWRhdGVFeHByKCk7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgTGlzdEVkaXRvclxuXG5leHBvcnQgeyBMaXN0RWRpdG9yIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0RWRpdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBMb2NhbFN0b3JhZ2VNYW5hZ2VyIH0gZnJvbSAnLi9TdG9yYWdlTWFuYWdlcic7XG5cbmNvbnN0IE1HUl9OQU1FID0gXCJwcmVmc01hbmFnZXJcIjtcbmNvbnN0IElURU1fTkFNRT0gXCJ1c2VyUHJlZnNcIjtcblxuY2xhc3MgVXNlclByZWZzTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlTWFuYWdlcihNR1JfTkFNRSk7XG5cdHRoaXMuZGF0YSA9IG51bGw7XG5cdHRoaXMuX2xvYWQoKTtcbiAgICB9XG4gICAgX2xvYWQgKCkge1xuXHR0aGlzLmRhdGEgPSB0aGlzLnN0b3JhZ2UuZ2V0KElURU1fTkFNRSk7XG5cdGlmICghdGhpcy5kYXRhKXtcblx0ICAgIHRoaXMuZGF0YSA9IHt9O1xuXHQgICAgdGhpcy5fc2F2ZSgpO1xuXHR9XG4gICAgfVxuICAgIF9zYXZlICgpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnB1dChJVEVNX05BTUUsIHRoaXMuZGF0YSk7XG4gICAgfVxuICAgIGhhcyAobikge1xuICAgIH1cbiAgICBnZXQgKG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVtuXTtcbiAgICB9XG4gICAgZ2V0QWxsICgpIHtcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGF0YSlcbiAgICB9XG4gICAgc2V0IChuLCB2KSB7XG4gICAgICAgIHRoaXMuZGF0YVtuXSA9IHY7XG5cdHRoaXMuX3NhdmUoKTtcbiAgICB9XG4gICAgc2V0QWxsICh2KSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5kYXRhLCB2KTtcblx0dGhpcy5fc2F2ZSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgVXNlclByZWZzTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvVXNlclByZWZzTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgRmFjZXQgfSBmcm9tICcuL0ZhY2V0JztcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBGYWNldE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcblx0dGhpcy5hcHAgPSBhcHA7XG5cdHRoaXMuZmFjZXRzID0gW107XG5cdHRoaXMubmFtZTJmYWNldCA9IHt9XG4gICAgfVxuICAgIGFkZEZhY2V0IChuYW1lLCB2YWx1ZUZjbikge1xuXHRpZiAodGhpcy5uYW1lMmZhY2V0W25hbWVdKSB0aHJvdyBcIkR1cGxpY2F0ZSBmYWNldCBuYW1lLiBcIiArIG5hbWU7XG5cdGxldCBmYWNldCA9IG5ldyBGYWNldChuYW1lLCB0aGlzLCB2YWx1ZUZjbik7XG4gICAgICAgIHRoaXMuZmFjZXRzLnB1c2goIGZhY2V0ICk7XG5cdHRoaXMubmFtZTJmYWNldFtuYW1lXSA9IGZhY2V0O1xuXHRyZXR1cm4gZmFjZXRcbiAgICB9XG4gICAgdGVzdCAoZikge1xuICAgICAgICBsZXQgdmFscyA9IHRoaXMuZmFjZXRzLm1hcCggZmFjZXQgPT4gZmFjZXQudGVzdChmKSApO1xuXHRyZXR1cm4gdmFscy5yZWR1Y2UoKGFjY3VtLCB2YWwpID0+IGFjY3VtICYmIHZhbCwgdHJ1ZSk7XG4gICAgfVxuICAgIGFwcGx5QWxsICgpIHtcblx0bGV0IHNob3cgPSBudWxsO1xuXHRsZXQgaGlkZSA9IFwibm9uZVwiO1xuXHQvLyBGSVhNRTogbWFqb3IgcmVhY2hvdmVyXG5cdHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwiZy5zdHJpcHNcIikuc2VsZWN0QWxsKCdyZWN0LmZlYXR1cmUnKVxuXHQgICAgLnN0eWxlKFwiZGlzcGxheVwiLCBmID0+IHRoaXMudGVzdChmKSA/IHNob3cgOiBoaWRlKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBGYWNldE1hbmFnZXJcblxuZXhwb3J0IHsgRmFjZXRNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GYWNldE1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgRmFjZXQge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lLCBtYW5hZ2VyLCB2YWx1ZUZjbikge1xuXHR0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXHR0aGlzLnZhbHVlcyA9IFtdO1xuXHR0aGlzLnZhbHVlRmNuID0gdmFsdWVGY247XG4gICAgfVxuICAgIHNldFZhbHVlcyAodmFsdWVzLCBxdWlldGx5KSB7XG4gICAgICAgIHRoaXMudmFsdWVzID0gdmFsdWVzO1xuXHRpZiAoISBxdWlldGx5KSB7XG5cdCAgICB0aGlzLm1hbmFnZXIuYXBwbHlBbGwoKTtcblx0ICAgIHRoaXMubWFuYWdlci5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH1cbiAgICB9XG4gICAgdGVzdCAoZikge1xuICAgICAgICByZXR1cm4gIXRoaXMudmFsdWVzIHx8IHRoaXMudmFsdWVzLmxlbmd0aCA9PT0gMCB8fCB0aGlzLnZhbHVlcy5pbmRleE9mKCB0aGlzLnZhbHVlRmNuKGYpICkgPj0gMDtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBGYWNldFxuXG5leHBvcnQgeyBGYWNldCB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmFjZXQuanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGQzdHN2IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBCbG9ja1RyYW5zbGF0b3IgfSBmcm9tICcuL0Jsb2NrVHJhbnNsYXRvcic7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQmxvY2tUcmFuc2xhdG9yIG1hbmFnZXIgY2xhc3MuIEZvciBhbnkgZ2l2ZW4gcGFpciBvZiBnZW5vbWVzLCBBIGFuZCBCLCBsb2FkcyB0aGUgc2luZ2xlIGJsb2NrIGZpbGVcbi8vIGZvciB0cmFuc2xhdGluZyBiZXR3ZWVuIHRoZW0sIGFuZCBpbmRleGVzIGl0IFwiZnJvbSBib3RoIGRpcmVjdGlvbnNcIjpcbi8vIFx0QS0+Qi0+IFtBQl9CbG9ja0ZpbGVdIDwtQTwtQlxuLy9cbmNsYXNzIEJUTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcblx0dGhpcy5yY0Jsb2NrcyA9IHt9O1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlZ2lzdGVyQmxvY2tzICh1cmwsIGFHZW5vbWUsIGJHZW5vbWUsIGJsb2Nrcykge1xuXHRjb25zb2xlLmxvZyhcIlJlZ2lzdGVyaW5nIGJsb2NrcyBmcm9tOiBcIiArIHVybCwgYmxvY2tzKTtcblx0bGV0IGFuYW1lID0gYUdlbm9tZS5uYW1lO1xuXHRsZXQgYm5hbWUgPSBiR2Vub21lLm5hbWU7XG5cdGxldCBibGtGaWxlID0gbmV3IEJsb2NrVHJhbnNsYXRvcih1cmwsYUdlbm9tZSxiR2Vub21lLGJsb2Nrcyk7XG5cdGlmKCAhIHRoaXMucmNCbG9ja3NbYW5hbWVdKSB0aGlzLnJjQmxvY2tzW2FuYW1lXSA9IHt9O1xuXHRpZiggISB0aGlzLnJjQmxvY2tzW2JuYW1lXSkgdGhpcy5yY0Jsb2Nrc1tibmFtZV0gPSB7fTtcblx0dGhpcy5yY0Jsb2Nrc1thbmFtZV1bYm5hbWVdID0gYmxrRmlsZTtcblx0dGhpcy5yY0Jsb2Nrc1tibmFtZV1bYW5hbWVdID0gYmxrRmlsZTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBMb2FkcyB0aGUgc3ludGVueSBibG9jayBmaWxlIGZvciBnZW5vbWVzIGFHZW5vbWUgYW5kIGJHZW5vbWUuXG4gICAgLy8gXG4gICAgZ2V0QmxvY2tGaWxlIChhR2Vub21lLCBiR2Vub21lKSB7XG5cdC8vIEJlIGEgbGl0dGxlIHNtYXJ0IGFib3V0IHRoZSBvcmRlciB3ZSB0cnkgdGhlIG5hbWVzLi4uXG5cdGlmIChiR2Vub21lLm5hbWUgPCBhR2Vub21lLm5hbWUpIHtcblx0ICAgIGxldCB0bXAgPSBhR2Vub21lOyBhR2Vub21lID0gYkdlbm9tZTsgYkdlbm9tZSA9IHRtcDtcblx0fVxuXHQvLyBGaXJzdCwgc2VlIGlmIHdlIGFscmVhZHkgaGF2ZSB0aGlzIHBhaXJcblx0bGV0IGFuYW1lID0gYUdlbm9tZS5uYW1lO1xuXHRsZXQgYm5hbWUgPSBiR2Vub21lLm5hbWU7XG5cdGxldCBiZiA9ICh0aGlzLnJjQmxvY2tzW2FuYW1lXSB8fCB7fSlbYm5hbWVdO1xuXHRpZiAoYmYpXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGJmKTtcblx0XG5cdC8vIEZvciBhbnkgZ2l2ZW4gZ2Vub21lIHBhaXIsIG9ubHkgb25lIG9mIHRoZSBmb2xsb3dpbmcgdHdvIGZpbGVzXG5cdC8vIGlzIGdlbmVyYXRlZCBieSB0aGUgYmFjayBlbmRcblx0bGV0IGZuMSA9IGAuL2RhdGEvYmxvY2tmaWxlcy8ke2FHZW5vbWUubmFtZX0tJHtiR2Vub21lLm5hbWV9LnRzdmBcblx0bGV0IGZuMiA9IGAuL2RhdGEvYmxvY2tmaWxlcy8ke2JHZW5vbWUubmFtZX0tJHthR2Vub21lLm5hbWV9LnRzdmBcblx0Ly8gVGhlIGZpbGUgZm9yIEEtPkIgaXMgc2ltcGx5IGEgcmUtc29ydCBvZiB0aGUgZmlsZSBmcm9tIEItPkEuIFNvIHRoZSBcblx0Ly8gYmFjayBlbmQgb25seSBjcmVhdGVzIG9uZSBvZiB0aGVtLlxuXHQvLyBXZSdsbCB0cnkgb25lIGFuZCBpZiB0aGF0J3Mgbm90IGl0LCB0aGVuIHRyeSB0aGUgb3RoZXIuXG5cdC8vIChBbmQgaWYgVEhBVCdzIG5vdCBpdCwgdGhlbiBjcnkgYSByaXZlci4uLilcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRyZXR1cm4gZDN0c3YoZm4xKVxuXHQgIC50aGVuKGZ1bmN0aW9uKGJsb2Nrcyl7XG5cdCAgICAgIC8vIHl1cCwgaXQgd2FzIEEtQlxuXHQgICAgICBzZWxmLnJlZ2lzdGVyQmxvY2tzKGZuMSwgYUdlbm9tZSwgYkdlbm9tZSwgYmxvY2tzKTtcblx0ICAgICAgcmV0dXJuIGJsb2Nrc1xuXHQgIH0pXG5cdCAgLmNhdGNoKGZ1bmN0aW9uKGUpe1xuXHQgICAgICBjb25zb2xlLmxvZyhgSU5GTzogRGlzcmVnYXJkIHRoYXQgNDA0IG1lc3NhZ2UhICR7Zm4xfSB3YXMgbm90IGZvdW5kLiBUcnlpbmcgJHtmbjJ9LmApO1xuXHQgICAgICByZXR1cm4gZDN0c3YoZm4yKVxuXHRcdCAgLnRoZW4oZnVuY3Rpb24oYmxvY2tzKXtcblx0XHQgICAgICAvLyBub3BlLCBpdCB3YXMgQi1BXG5cdFx0ICAgICAgc2VsZi5yZWdpc3RlckJsb2NrcyhmbjIsIGJHZW5vbWUsIGFHZW5vbWUsIGJsb2Nrcyk7XG5cdFx0ICAgICAgcmV0dXJuIGJsb2Nrc1xuXHRcdCAgfSlcblx0XHQgIC5jYXRjaChmdW5jdGlvbihlKXtcblx0XHQgICAgICBjb25zb2xlLmxvZygnQnV0IFRIQVQgNDA0IG1lc3NhZ2UgaXMgYSBwcm9ibGVtLicpO1xuXHRcdCAgICAgIHRocm93IGBDYW5ub3QgZ2V0IGJsb2NrIGZpbGUgZm9yIHRoaXMgZ2Vub21lIHBhaXI6ICR7YUdlbm9tZS5uYW1lfSAke2JHZW5vbWUubmFtZX0uXFxuKEVycm9yPSR7ZX0pYDtcblx0XHQgIH0pO1xuXHQgIH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gdGhlIHRyYW5zbGF0b3IgaGFzIGxvYWRlZCBhbGwgdGhlIGRhdGEgbmVlZGVkXG4gICAgLy8gZm9yIHRyYW5zbGF0aW5nIGNvb3JkaW5hdGVzIGJldHdlZW4gdGhlIGN1cnJlbnQgcmVmIHN0cmFpbiBhbmQgdGhlIGN1cnJlbnQgY29tcGFyaXNvbiBzdHJhaW5zLlxuICAgIC8vXG4gICAgcmVhZHkgKCkge1xuXHRsZXQgcHJvbWlzZXMgPSB0aGlzLmFwcC5jR2Vub21lcy5tYXAoY2cgPT4gdGhpcy5nZXRCbG9ja0ZpbGUodGhpcy5hcHAuckdlbm9tZSwgY2cpKTtcblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIHN5bnRlbnkgYmxvY2sgdHJhbnNsYXRvciB0aGF0IG1hcHMgdGhlIGN1cnJlbnQgcmVmIGdlbm9tZSB0byB0aGUgc3BlY2lmaWVkIGNvbXBhcmlzb24gZ2Vub21lLlxuICAgIC8vXG4gICAgZ2V0QmxvY2tzIChmcm9tR2Vub21lLCB0b0dlbm9tZSkge1xuICAgICAgICBsZXQgYmxrVHJhbnMgPSB0aGlzLnJjQmxvY2tzW2Zyb21HZW5vbWUubmFtZV1bdG9HZW5vbWUubmFtZV07XG5cdHJldHVybiBibGtUcmFucy5nZXRCbG9ja3MoZnJvbUdlbm9tZSlcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBUcmFuc2xhdGVzIHRoZSBnaXZlbiBjb29yZGluYXRlIHJhbmdlIGZyb20gdGhlIHNwZWNpZmllZCBmcm9tR2Vub21lIHRvIHRoZSBzcGVjaWZpZWQgdG9HZW5vbWUuXG4gICAgLy8gUmV0dXJucyBhIGxpc3Qgb2YgemVybyBvciBtb3JlIGNvb3JkaW5hdGUgcmFuZ2VzIGluIHRoZSB0b0dlbm9tZS5cbiAgICAvL1xuICAgIHRyYW5zbGF0ZSAoZnJvbUdlbm9tZSwgY2hyLCBzdGFydCwgZW5kLCB0b0dlbm9tZSwgaW52ZXJ0ZWQpIHtcblx0Ly8gZ2V0IHRoZSByaWdodCBibG9jayBmaWxlXG5cdGxldCBibGtUcmFucyA9IHRoaXMucmNCbG9ja3NbZnJvbUdlbm9tZS5uYW1lXVt0b0dlbm9tZS5uYW1lXTtcblx0aWYgKCFibGtUcmFucykgdGhyb3cgXCJJbnRlcm5hbCBlcnJvci4gTm8gYmxvY2sgZmlsZSBmb3VuZCBpbiBpbmRleC5cIlxuXHQvLyB0cmFuc2xhdGUhXG5cdGxldCByYW5nZXMgPSBibGtUcmFucy50cmFuc2xhdGUoZnJvbUdlbm9tZSwgY2hyLCBzdGFydCwgZW5kLCBpbnZlcnRlZCk7XG5cdHJldHVybiByYW5nZXM7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgQlRNYW5hZ2VyXG5cbmV4cG9ydCB7IEJUTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQlRNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNvbWV0aGluZyB0aGF0IGtub3dzIGhvdyB0byB0cmFuc2xhdGUgY29vcmRpbmF0ZXMgYmV0d2VlbiB0d28gZ2Vub21lcy5cbi8vXG4vL1xuY2xhc3MgQmxvY2tUcmFuc2xhdG9yIHtcbiAgICBjb25zdHJ1Y3Rvcih1cmwsIGFHZW5vbWUsIGJHZW5vbWUsIGJsb2Nrcyl7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuXHR0aGlzLmFHZW5vbWUgPSBhR2Vub21lO1xuXHR0aGlzLmJHZW5vbWUgPSBiR2Vub21lO1xuXHR0aGlzLmJsb2NrcyA9IGJsb2Nrcy5tYXAoYiA9PiB0aGlzLnByb2Nlc3NCbG9jayhiKSlcblx0dGhpcy5jdXJyZW50U29ydCA9IFwiYVwiOyAvLyBlaXRoZXIgJ2EnIG9yICdiJ1xuICAgIH1cbiAgICBwcm9jZXNzQmxvY2sgKGJsaykgeyBcbiAgICAgICAgYmxrLmFJbmRleCA9IHBhcnNlSW50KGJsay5hSW5kZXgpO1xuICAgICAgICBibGsuYkluZGV4ID0gcGFyc2VJbnQoYmxrLmJJbmRleCk7XG4gICAgICAgIGJsay5hU3RhcnQgPSBwYXJzZUludChibGsuYVN0YXJ0KTtcbiAgICAgICAgYmxrLmJTdGFydCA9IHBhcnNlSW50KGJsay5iU3RhcnQpO1xuICAgICAgICBibGsuYUVuZCAgID0gcGFyc2VJbnQoYmxrLmFFbmQpO1xuICAgICAgICBibGsuYkVuZCAgID0gcGFyc2VJbnQoYmxrLmJFbmQpO1xuICAgICAgICBibGsuYUxlbmd0aCAgID0gcGFyc2VJbnQoYmxrLmFMZW5ndGgpO1xuICAgICAgICBibGsuYkxlbmd0aCAgID0gcGFyc2VJbnQoYmxrLmJMZW5ndGgpO1xuICAgICAgICBibGsuYmxvY2tDb3VudCAgID0gcGFyc2VJbnQoYmxrLmJsb2NrQ291bnQpO1xuICAgICAgICBibGsuYmxvY2tSYXRpbyAgID0gcGFyc2VGbG9hdChibGsuYmxvY2tSYXRpbyk7XG5cdGJsay5hYk1hcCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdCAgICAuZG9tYWluKFtibGsuYVN0YXJ0LGJsay5hRW5kXSlcblx0ICAgIC5yYW5nZSggYmxrLmJsb2NrT3JpPT09XCItXCIgPyBbYmxrLmJFbmQsYmxrLmJTdGFydF0gOiBbYmxrLmJTdGFydCxibGsuYkVuZF0pO1xuXHRibGsuYmFNYXAgPSBibGsuYWJNYXAuaW52ZXJ0XG5cdHJldHVybiBibGs7XG4gICAgfVxuICAgIHNldFNvcnQgKHdoaWNoKSB7XG5cdGlmICh3aGljaCAhPT0gJ2EnICYmIHdoaWNoICE9PSAnYicpIHRocm93IFwiQmFkIGFyZ3VtZW50OlwiICsgd2hpY2g7XG5cdGxldCBzb3J0Q29sID0gd2hpY2ggKyBcIkluZGV4XCI7XG5cdGxldCBjbXAgPSAoeCx5KSA9PiB4W3NvcnRDb2xdIC0geVtzb3J0Q29sXTtcblx0dGhpcy5ibG9ja3Muc29ydChjbXApO1xuXHR0aGlzLmN1cnJTb3J0ID0gd2hpY2g7XG4gICAgfVxuICAgIGZsaXBTb3J0ICgpIHtcblx0dGhpcy5zZXRTb3J0KHRoaXMuY3VyclNvcnQgPT09IFwiYVwiID8gXCJiXCIgOiBcImFcIik7XG4gICAgfVxuICAgIC8vIEdpdmVuIGEgZ2Vub21lIChlaXRoZXIgdGhlIGEgb3IgYiBnZW5vbWUpIGFuZCBhIGNvb3JkaW5hdGUgcmFuZ2UsXG4gICAgLy8gcmV0dXJucyB0aGUgZXF1aXZhbGVudCBjb29yZGluYXRlIHJhbmdlKHMpIGluIHRoZSBvdGhlciBnZW5vbWVcbiAgICB0cmFuc2xhdGUgKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCwgaW52ZXJ0KSB7XG5cdC8vXG5cdGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gc3RhcnQgOiBlbmQ7XG5cdC8vIGZyb20gPSBcImFcIiBvciBcImJcIiwgZGVwZW5kaW5nIG9uIHdoaWNoIGdlbm9tZSBpcyBnaXZlbi5cbiAgICAgICAgbGV0IGZyb20gPSAoZnJvbUdlbm9tZSA9PT0gdGhpcy5hR2Vub21lID8gXCJhXCIgOiBmcm9tR2Vub21lID09PSB0aGlzLmJHZW5vbWUgPyBcImJcIiA6IG51bGwpO1xuXHRpZiAoIWZyb20pIHRocm93IFwiQmFkIGFyZ3VtZW50LiBHZW5vbWUgbmVpdGhlciBBIG5vciBCLlwiO1xuXHQvLyB0byA9IFwiYlwiIG9yIFwiYVwiLCBvcHBvc2l0ZSBvZiBmcm9tXG5cdGxldCB0byA9IChmcm9tID09PSBcImFcIiA/IFwiYlwiIDogXCJhXCIpO1xuXHQvLyBtYWtlIHN1cmUgdGhlIGJsb2NrcyBhcmUgc29ydGVkIGJ5IHRoZSBmcm9tIGdlbm9tZVxuXHR0aGlzLnNldFNvcnQoZnJvbSk7XG5cdC8vXG5cdGxldCBmcm9tQyA9IGZyb20rXCJDaHJcIjtcblx0bGV0IGZyb21TID0gZnJvbStcIlN0YXJ0XCI7XG5cdGxldCBmcm9tRSA9IGZyb20rXCJFbmRcIjtcblx0bGV0IGZyb21JID0gZnJvbStcIkluZGV4XCI7XG5cdGxldCB0b0MgPSB0bytcIkNoclwiO1xuXHRsZXQgdG9TID0gdG8rXCJTdGFydFwiO1xuXHRsZXQgdG9FID0gdG8rXCJFbmRcIjtcblx0bGV0IHRvSSA9IHRvK1wiSW5kZXhcIjtcblx0bGV0IG1hcHBlciA9IGZyb20rdG8rXCJNYXBcIjtcblx0Ly8gXG5cdGxldCBibGtzID0gdGhpcy5ibG9ja3Ncblx0ICAgIC8vIEZpcnN0IGZpbHRlciBmb3IgYmxvY2tzIHRoYXQgb3ZlcmxhcCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBpbiB0aGUgZnJvbSBnZW5vbWVcblx0ICAgIC5maWx0ZXIoYmxrID0+IGJsa1tmcm9tQ10gPT09IGNociAmJiBibGtbZnJvbVNdIDw9IGVuZCAmJiBibGtbZnJvbUVdID49IHN0YXJ0KVxuXHQgICAgLy8gbWFwIGVhY2ggYmxvY2suIFxuXHQgICAgLm1hcChibGsgPT4ge1xuXHRcdC8vIGNvb3JkIHJhbmdlIG9uIHRoZSBmcm9tIHNpZGUuXG5cdFx0bGV0IHMgPSBNYXRoLm1heChzdGFydCwgYmxrW2Zyb21TXSk7XG5cdFx0bGV0IGUgPSBNYXRoLm1pbihlbmQsIGJsa1tmcm9tRV0pO1xuXHRcdC8vIGNvb3JkIHJhbmdlIG9uIHRoZSB0byBzaWRlLlxuXHRcdGxldCBzMiA9IE1hdGguY2VpbChibGtbbWFwcGVyXShzKSk7XG5cdFx0bGV0IGUyID0gTWF0aC5mbG9vcihibGtbbWFwcGVyXShlKSk7XG5cdCAgICAgICAgcmV0dXJuIGludmVydCA/IHtcblx0XHQgICAgY2hyOiAgIGJsa1tmcm9tQ10sXG5cdFx0ICAgIHN0YXJ0OiBzLFxuXHRcdCAgICBlbmQ6ICAgZSxcblx0XHQgICAgb3JpOiAgIGJsay5ibG9ja09yaSxcblx0XHQgICAgaW5kZXg6IGJsa1tmcm9tSV0sXG5cdFx0ICAgIC8vIGFsc28gcmV0dXJuIHRoZSBmcm9tR2Vub21lIGNvb3JkcyBmb3IgdGhpcyBwaWVjZSBvZiB0aGUgdHJhbnNsYXRpb25cblx0XHQgICAgZkNocjogICBibGtbdG9DXSxcblx0XHQgICAgZlN0YXJ0OiBNYXRoLm1pbihzMixlMiksXG5cdFx0ICAgIGZFbmQ6ICAgTWF0aC5tYXgoczIsZTIpLFxuXHRcdCAgICBmSW5kZXg6IGJsa1t0b0ldLFxuXHRcdCAgICAvLyBpbmNsdWRlIHRoZSBibG9jayBpZCBhbmQgZnVsbCBibG9jayBjb29yZHNcblx0XHQgICAgYmxvY2tJZDogYmxrLmJsb2NrSWQsXG5cdFx0ICAgIGJsb2NrU3RhcnQ6IGJsa1tmcm9tU10sXG5cdFx0ICAgIGJsb2NrRW5kOiBibGtbZnJvbUVdXG5cdFx0ICAgIH0gOiB7XG5cdFx0ICAgIGNocjogICBibGtbdG9DXSxcblx0XHQgICAgc3RhcnQ6IE1hdGgubWluKHMyLGUyKSxcblx0XHQgICAgZW5kOiAgIE1hdGgubWF4KHMyLGUyKSxcblx0XHQgICAgb3JpOiAgIGJsay5ibG9ja09yaSxcblx0XHQgICAgaW5kZXg6IGJsa1t0b0ldLFxuXHRcdCAgICAvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZHMgZm9yIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0ICAgIGZDaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgZlN0YXJ0OiBzLFxuXHRcdCAgICBmRW5kOiAgIGUsXG5cdFx0ICAgIGZJbmRleDogYmxrW2Zyb21JXSxcblx0XHQgICAgLy8gaW5jbHVkZSB0aGUgYmxvY2sgaWQgYW5kIGZ1bGwgYmxvY2sgY29vcmRzXG5cdFx0ICAgIGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdCAgICBibG9ja1N0YXJ0OiBibGtbdG9TXSxcblx0XHQgICAgYmxvY2tFbmQ6IGJsa1t0b0VdXG5cdFx0fTtcblx0ICAgIH0pXG5cdC8vIFxuXHRyZXR1cm4gYmxrcztcbiAgICB9XG4gICAgLy8gR2l2ZW4gYSBnZW5vbWUgKGVpdGhlciB0aGUgYSBvciBiIGdlbm9tZSlcbiAgICAvLyByZXR1cm5zIHRoZSBibG9ja3MgZm9yIHRyYW5zbGF0aW5nIHRvIHRoZSBvdGhlciAoYiBvciBhKSBnZW5vbWUuXG4gICAgLy9cbiAgICBnZXRCbG9ja3MgKGZyb21HZW5vbWUpIHtcblx0Ly8gZnJvbSA9IFwiYVwiIG9yIFwiYlwiLCBkZXBlbmRpbmcgb24gd2hpY2ggZ2Vub21lIGlzIGdpdmVuLlxuICAgICAgICBsZXQgZnJvbSA9IChmcm9tR2Vub21lID09PSB0aGlzLmFHZW5vbWUgPyBcImFcIiA6IGZyb21HZW5vbWUgPT09IHRoaXMuYkdlbm9tZSA/IFwiYlwiIDogbnVsbCk7XG5cdGlmICghZnJvbSkgdGhyb3cgXCJCYWQgYXJndW1lbnQuIEdlbm9tZSBuZWl0aGVyIEEgbm9yIEIuXCI7XG5cdC8vIHRvID0gXCJiXCIgb3IgXCJhXCIsIG9wcG9zaXRlIG9mIGZyb21cblx0bGV0IHRvID0gKGZyb20gPT09IFwiYVwiID8gXCJiXCIgOiBcImFcIik7XG5cdC8vIG1ha2Ugc3VyZSB0aGUgYmxvY2tzIGFyZSBzb3J0ZWQgYnkgdGhlIGZyb20gZ2Vub21lXG5cdHRoaXMuc2V0U29ydChmcm9tKTtcblx0Ly9cblx0bGV0IGZyb21DID0gZnJvbStcIkNoclwiO1xuXHRsZXQgZnJvbVMgPSBmcm9tK1wiU3RhcnRcIjtcblx0bGV0IGZyb21FID0gZnJvbStcIkVuZFwiO1xuXHRsZXQgZnJvbUkgPSBmcm9tK1wiSW5kZXhcIjtcblx0bGV0IHRvQyA9IHRvK1wiQ2hyXCI7XG5cdGxldCB0b1MgPSB0bytcIlN0YXJ0XCI7XG5cdGxldCB0b0UgPSB0bytcIkVuZFwiO1xuXHRsZXQgdG9JID0gdG8rXCJJbmRleFwiO1xuXHRsZXQgbWFwcGVyID0gZnJvbSt0bytcIk1hcFwiO1xuXHQvLyBcblx0bGV0IGJsa3MgPSB0aGlzLmJsb2Nrc1xuXHQgICAgLm1hcChibGsgPT4ge1xuXHQgICAgICAgIHJldHVybiB7XG5cdFx0ICAgIGJsb2NrSWQ6ICAgYmxrLmJsb2NrSWQsXG5cdFx0ICAgIG9yaTogICAgICAgYmxrLmJsb2NrT3JpLFxuXHRcdCAgICBmcm9tQ2hyOiAgIGJsa1tmcm9tQ10sXG5cdFx0ICAgIGZyb21TdGFydDogYmxrW2Zyb21TXSxcblx0XHQgICAgZnJvbUVuZDogICBibGtbZnJvbUVdLFxuXHRcdCAgICBmcm9tSW5kZXg6IGJsa1tmcm9tSV0sXG5cdFx0ICAgIHRvQ2hyOiAgICAgYmxrW3RvQ10sXG5cdFx0ICAgIHRvU3RhcnQ6ICAgYmxrW3RvU10sXG5cdFx0ICAgIHRvRW5kOiAgICAgYmxrW3RvRV0sXG5cdFx0ICAgIHRvSW5kZXg6ICAgYmxrW3RvSV1cblx0XHR9O1xuXHQgICAgfSlcblx0Ly8gXG5cdHJldHVybiBibGtzO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgQmxvY2tUcmFuc2xhdG9yIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9CbG9ja1RyYW5zbGF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFNWR1ZpZXcgfSBmcm9tICcuL1NWR1ZpZXcnO1xuaW1wb3J0IHsgY29vcmRzQWZ0ZXJUcmFuc2Zvcm0gfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBHZW5vbWVWaWV3IGV4dGVuZHMgU1ZHVmlldyB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0KTtcblx0dGhpcy5vcGVuV2lkdGggPSB0aGlzLm91dGVyV2lkdGg7XG5cdHRoaXMub3BlbkhlaWdodD0gdGhpcy5vdXRlckhlaWdodDtcblx0dGhpcy50b3RhbENocldpZHRoID0gNDA7IC8vIHRvdGFsIHdpZHRoIG9mIG9uZSBjaHJvbW9zb21lIChiYWNrYm9uZStibG9ja3MrZmVhdHMpXG5cdHRoaXMuY3dpZHRoID0gMjA7ICAgICAgICAvLyBjaHJvbW9zb21lIHdpZHRoXG5cdHRoaXMudGlja0xlbmd0aCA9IDEwO1x0IC8vIGZlYXR1cmUgdGljayBtYXJrIGxlbmd0aFxuXHR0aGlzLmJydXNoQ2hyID0gbnVsbDtcdCAvLyB3aGljaCBjaHIgaGFzIHRoZSBjdXJyZW50IGJydXNoXG5cdHRoaXMuYndpZHRoID0gdGhpcy5jd2lkdGgvMjsgIC8vIGJsb2NrIHdpZHRoXG5cdHRoaXMuY3VyckJsb2NrcyA9IG51bGw7XG5cdHRoaXMuY3VyclRpY2tzID0gbnVsbDtcblx0dGhpcy5nQ2hyb21vc29tZXMgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCdnJykuYXR0cihcIm5hbWVcIiwgXCJjaHJvbW9zb21lc1wiKTtcblx0dGhpcy50aXRsZSAgICA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ3RleHQnKS5hdHRyKFwiY2xhc3NcIiwgXCJ0aXRsZVwiKTtcblx0dGhpcy5zY3JvbGxBbW91bnQgPSAwO1xuXHQvL1xuXHR0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZml0VG9XaWR0aCAodyl7XG4gICAgICAgIHN1cGVyLmZpdFRvV2lkdGgodyk7XG5cdHRoaXMub3BlbldpZHRoID0gdGhpcy5vdXRlcldpZHRoO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RG9tICgpIHtcblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbi5jbG9zZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4gdGhpcy5yZWRyYXcoKSk7XG5cdHRoaXMuc3ZnLm9uKFwid2hlZWxcIiwgKCkgPT4ge1xuXHQgICAgaWYgKCF0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiKSkgcmV0dXJuO1xuXHQgICAgdGhpcy5zY3JvbGxXaGVlbChkMy5ldmVudC5kZWx0YVkpXG5cdCAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9KTtcblx0bGV0IHNicyA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwic3ZnY29udGFpbmVyXCJdID4gW25hbWU9XCJzY3JvbGxidXR0b25zXCJdJylcblx0c2JzLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwidXBcIl0nKS5vbihcImNsaWNrXCIsICgpID0+IHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNVcCgpKTtcblx0c2JzLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZG5cIl0nKS5vbihcImNsaWNrXCIsICgpID0+IHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNEb3duKCkpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldEJydXNoQ29vcmRzIChjb29yZHMpIHtcblx0dGhpcy5jbGVhckJydXNoZXMoKTtcblx0dGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0KGAuY2hyb21vc29tZVtuYW1lPVwiJHtjb29yZHMuY2hyfVwiXSBnW25hbWU9XCJicnVzaFwiXWApXG5cdCAgLmVhY2goZnVuY3Rpb24oY2hyKXtcblx0ICAgIGNoci5icnVzaC5leHRlbnQoW2Nvb3Jkcy5zdGFydCxjb29yZHMuZW5kXSk7XG5cdCAgICBjaHIuYnJ1c2goZDMuc2VsZWN0KHRoaXMpKTtcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJydXNoc3RhcnQgKGNocil7XG5cdHRoaXMuY2xlYXJCcnVzaGVzKGNoci5icnVzaCk7XG5cdHRoaXMuYnJ1c2hDaHIgPSBjaHI7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYnJ1c2hlbmQgKCl7XG5cdGlmKCF0aGlzLmJydXNoQ2hyKSByZXR1cm47XG5cdGxldCBjYyA9IHRoaXMuYXBwLmNvb3Jkcztcblx0dmFyIHh0bnQgPSB0aGlzLmJydXNoQ2hyLmJydXNoLmV4dGVudCgpO1xuXHRpZiAoTWF0aC5hYnMoeHRudFswXSAtIHh0bnRbMV0pIDw9IDEwKXtcblx0ICAgIC8vIHVzZXIgY2xpY2tlZFxuXHQgICAgbGV0IHcgPSBjYy5lbmQgLSBjYy5zdGFydCArIDE7XG5cdCAgICB4dG50WzBdIC09IHcvMjtcblx0ICAgIHh0bnRbMV0gKz0gdy8yO1xuXHR9XG5cdGxldCBjb29yZHMgPSB7IGNocjp0aGlzLmJydXNoQ2hyLm5hbWUsIHN0YXJ0Ok1hdGguZmxvb3IoeHRudFswXSksIGVuZDogTWF0aC5mbG9vcih4dG50WzFdKSB9O1xuXHR0aGlzLmFwcC5zZXRDb250ZXh0KGNvb3Jkcyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJCcnVzaGVzIChleGNlcHQpe1xuXHR0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoJ1tuYW1lPVwiYnJ1c2hcIl0nKS5lYWNoKGZ1bmN0aW9uKGNocil7XG5cdCAgICBpZiAoY2hyLmJydXNoICE9PSBleGNlcHQpIHtcblx0XHRjaHIuYnJ1c2guY2xlYXIoKTtcblx0XHRjaHIuYnJ1c2goZDMuc2VsZWN0KHRoaXMpKTtcblx0ICAgIH1cblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0WCAoY2hyKSB7XG5cdGxldCB4ID0gdGhpcy5hcHAuckdlbm9tZS54c2NhbGUoY2hyKTtcblx0aWYgKGlzTmFOKHgpKSB0aHJvdyBcInggaXMgTmFOXCJcblx0cmV0dXJuIHg7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldFkgKHBvcykge1xuXHRsZXQgeSA9IHRoaXMuYXBwLnJHZW5vbWUueXNjYWxlKHBvcyk7XG5cdGlmIChpc05hTih5KSkgdGhyb3cgXCJ5IGlzIE5hTlwiXG5cdHJldHVybiB5O1xuICAgIH1cbiAgICBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZWRyYXcgKCkge1xuICAgICAgICB0aGlzLmRyYXcodGhpcy5jdXJyVGlja3MsIHRoaXMuY3VyckJsb2Nrcyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZHJhdyAodGlja0RhdGEsIGJsb2NrRGF0YSkge1xuXHR0aGlzLmRyYXdDaHJvbW9zb21lcygpO1xuXHR0aGlzLmRyYXdCbG9ja3MoYmxvY2tEYXRhKTtcblx0dGhpcy5kcmF3VGlja3ModGlja0RhdGEpO1xuXHR0aGlzLmRyYXdUaXRsZSgpO1xuXHR0aGlzLnNldEJydXNoQ29vcmRzKHRoaXMuYXBwLmNvb3Jkcyk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIGNocm9tb3NvbWVzIG9mIHRoZSByZWZlcmVuY2UgZ2Vub21lLlxuICAgIC8vIEluY2x1ZGVzIGJhY2tib25lcywgbGFiZWxzLCBhbmQgYnJ1c2hlcy5cbiAgICAvLyBUaGUgYmFja2JvbmVzIGFyZSBkcmF3biBhcyB2ZXJ0aWNhbCBsaW5lIHNlbWVudHMsXG4gICAgLy8gZGlzdHJpYnV0ZWQgaG9yaXpvbnRhbGx5LiBPcmRlcmluZyBpcyBkZWZpbmVkIGJ5XG4gICAgLy8gdGhlIG1vZGVsIChHZW5vbWUgb2JqZWN0KS5cbiAgICAvLyBMYWJlbHMgYXJlIGRyYXduIGFib3ZlIHRoZSBiYWNrYm9uZXMuXG4gICAgLy9cbiAgICAvLyBNb2RpZmljYXRpb246XG4gICAgLy8gRHJhd3MgdGhlIHNjZW5lIGluIG9uZSBvZiB0d28gc3RhdGVzOiBvcGVuIG9yIGNsb3NlZC5cbiAgICAvLyBUaGUgb3BlbiBzdGF0ZSBpcyBhcyBkZXNjcmliZWQgLSBhbGwgY2hyb21vc29tZXMgc2hvd24uXG4gICAgLy8gSW4gdGhlIGNsb3NlZCBzdGF0ZTogXG4gICAgLy8gICAgICogb25seSBvbmUgY2hyb21vc29tZSBzaG93cyAodGhlIGN1cnJlbnQgb25lKVxuICAgIC8vICAgICAqIGRyYXduIGhvcml6b250YWxseSBhbmQgcG9zaXRpb25lZCBiZXNpZGUgdGhlIFwiR2Vub21lIFZpZXdcIiB0aXRsZVxuICAgIC8vXG4gICAgZHJhd0Nocm9tb3NvbWVzICgpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7IC8vIHJlZiBnZW5vbWVcblx0bGV0IHJDaHJzID0gcmcuY2hyb21vc29tZXM7XG5cbiAgICAgICAgLy8gQ2hyb21vc29tZSBncm91cHNcblx0bGV0IGNocnMgPSB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoXCIuY2hyb21vc29tZVwiKVxuXHQgICAgLmRhdGEockNocnMsIGMgPT4gYy5uYW1lKTtcblx0bGV0IG5ld2NocnMgPSBjaHJzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBcImNocm9tb3NvbWVcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBjID0+IGMubmFtZSk7XG5cdFxuXHRuZXdjaHJzLmFwcGVuZChcInRleHRcIikuYXR0cihcIm5hbWVcIixcImxhYmVsXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImxpbmVcIikuYXR0cihcIm5hbWVcIixcImJhY2tib25lXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIixcInN5bkJsb2Nrc1wiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJ0aWNrc1wiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJicnVzaFwiKTtcblxuXG5cdGxldCBjbG9zZWQgPSB0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiKTtcblx0aWYgKGNsb3NlZCkge1xuXHQgICAgLy8gUmVzZXQgdGhlIFNWRyBzaXplIHRvIGJlIDEtY2hyb21vc29tZSB3aWRlLlxuXHQgICAgLy8gVHJhbnNsYXRlIHRoZSBjaHJvbW9zb21lcyBncm91cCBzbyB0aGF0IHRoZSBjdXJyZW50IGNocm9tb3NvbWUgYXBwZWFycyBpbiB0aGUgc3ZnIGFyZWEuXG5cdCAgICAvLyBUdXJuIGl0IDkwIGRlZy5cblxuXHQgICAgLy8gU2V0IHRoZSBoZWlnaHQgb2YgdGhlIFNWRyBhcmVhIHRvIDEgY2hyb21vc29tZSdzIHdpZHRoXG5cdCAgICB0aGlzLnNldEdlb20oeyBoZWlnaHQ6IHRoaXMudG90YWxDaHJXaWR0aCwgcm90YXRpb246IC05MCwgdHJhbnNsYXRpb246IFstdGhpcy50b3RhbENocldpZHRoLzIsMzBdIH0pO1xuXHQgICAgLy8gXG5cdCAgICBsZXQgZGVsdGEgPSAxMDtcblx0ICAgIHJnLnhzY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuXHRcdCAuZG9tYWluKHJDaHJzLm1hcChmdW5jdGlvbih4KXtyZXR1cm4geC5uYW1lO30pKVxuXHRcdCAvLyBpbiBjbG9zZWQgbW9kZSwgdGhlIGNocm9tb3NvbWVzIGhhdmUgZml4ZWQgc3BhY2luZ1xuXHRcdCAucmFuZ2VQb2ludHMoW2RlbHRhLCBkZWx0YSt0aGlzLnRvdGFsQ2hyV2lkdGgqKHJDaHJzLmxlbmd0aC0xKV0pO1xuXHQgICAgLy9cblx0ICAgIHJnLnlzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0IC5kb21haW4oWzEscmcubWF4bGVuXSlcblx0XHQgLnJhbmdlKFswLCB0aGlzLndpZHRoXSk7XG5cblx0ICAgIC8vIHRyYW5zbGF0ZSBlYWNoIGNocm9tb3NvbWUgaW50byBwb3NpdGlvblxuXHQgICAgY2hycy5hdHRyKFwidHJhbnNmb3JtXCIsIGMgPT4gYHRyYW5zbGF0ZSgke3JnLnhzY2FsZShjLm5hbWUpfSwgMClgKTtcbiAgICAgICAgICAgIC8vIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oLXJnLnhzY2FsZSh0aGlzLmFwcC5jb29yZHMuY2hyKSk7XG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgLy8gV2hlbiBvcGVuLCBkcmF3IGFsbCB0aGUgY2hyb21vc29tZXMuIEVhY2ggY2hyb20gaXMgYSB2ZXJ0aWNhbCBsaW5lLlxuXHQgICAgLy8gQ2hyb21zIGFyZSBkaXN0cmlidXRlZCBldmVubHkgYWNyb3NzIHRoZSBhdmFpbGFibGUgaG9yaXpvbnRhbCBzcGFjZS5cblx0ICAgIHRoaXMuc2V0R2VvbSh7IHdpZHRoOiB0aGlzLm9wZW5XaWR0aCwgaGVpZ2h0OiB0aGlzLm9wZW5IZWlnaHQsIHJvdGF0aW9uOiAwLCB0cmFuc2xhdGlvbjogWzAsMF0gfSk7XG5cdCAgICAvLyBcblx0ICAgIHJnLnhzY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuXHRcdCAuZG9tYWluKHJDaHJzLm1hcChmdW5jdGlvbih4KXtyZXR1cm4geC5uYW1lO30pKVxuXHRcdCAvLyBpbiBjbG9zZWQgbW9kZSwgdGhlIGNocm9tb3NvbWVzIHNwcmVhZCB0byBmaWxsIHRoZSBzcGFjZVxuXHRcdCAucmFuZ2VQb2ludHMoWzAsIHRoaXMub3BlbldpZHRoIC0gMzBdLCAwLjUpO1xuXHQgICAgcmcueXNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQgLmRvbWFpbihbMSxyZy5tYXhsZW5dKVxuXHRcdCAucmFuZ2UoWzAsIHRoaXMuaGVpZ2h0XSk7XG5cblx0ICAgIC8vIHRyYW5zbGF0ZSBlYWNoIGNocm9tb3NvbWUgaW50byBwb3NpdGlvblxuXHQgICAgY2hycy5hdHRyKFwidHJhbnNmb3JtXCIsIGMgPT4gYHRyYW5zbGF0ZSgke3JnLnhzY2FsZShjLm5hbWUpfSwgMClgKTtcbiAgICAgICAgICAgIC8vIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oMCk7XG5cdH1cblxuXHRyQ2hycy5mb3JFYWNoKGNociA9PiB7XG5cdCAgICB2YXIgc2MgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdC5kb21haW4oWzEsY2hyLmxlbmd0aF0pXG5cdFx0LnJhbmdlKFswLCByZy55c2NhbGUoY2hyLmxlbmd0aCldKTtcblx0ICAgIGNoci5icnVzaCA9IGQzLnN2Zy5icnVzaCgpLnkoc2MpXG5cdCAgICAgICAub24oXCJicnVzaHN0YXJ0XCIsIGNociA9PiB0aGlzLmJydXNoc3RhcnQoY2hyKSlcblx0ICAgICAgIC5vbihcImJydXNoZW5kXCIsICgpID0+IHRoaXMuYnJ1c2hlbmQoKSk7XG5cdCAgfSwgdGhpcyk7XG5cblxuICAgICAgICBjaHJzLnNlbGVjdCgnW25hbWU9XCJsYWJlbFwiXScpXG5cdCAgICAudGV4dChjPT5jLm5hbWUpXG5cdCAgICAuYXR0cihcInhcIiwgMCkgXG5cdCAgICAuYXR0cihcInlcIiwgLTIpXG5cdCAgICA7XG5cblx0Y2hycy5zZWxlY3QoJ1tuYW1lPVwiYmFja2JvbmVcIl0nKVxuXHQgICAgLmF0dHIoXCJ4MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ5MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ4MlwiLCAwKVxuXHQgICAgLmF0dHIoXCJ5MlwiLCBjID0+IHJnLnlzY2FsZShjLmxlbmd0aCkpXG5cdCAgICA7XG5cdCAgIFxuXHRjaHJzLnNlbGVjdCgnW25hbWU9XCJicnVzaFwiXScpXG5cdCAgICAuZWFjaChmdW5jdGlvbihkKXtkMy5zZWxlY3QodGhpcykuY2FsbChkLmJydXNoKTt9KVxuXHQgICAgLnNlbGVjdEFsbCgncmVjdCcpXG5cdCAgICAgLmF0dHIoJ3dpZHRoJywxMClcblx0ICAgICAuYXR0cigneCcsIC01KVxuXHQgICAgO1xuXG5cdGNocnMuZXhpdCgpLnJlbW92ZSgpO1xuXHRcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTY3JvbGwgd2hlZWwgZXZlbnQgaGFuZGxlci5cbiAgICBzY3JvbGxXaGVlbCAoZHkpIHtcblx0Ly8gQWRkIGR5IHRvIHRvdGFsIHNjcm9sbCBhbW91bnQuIFRoZW4gdHJhbnNsYXRlIHRoZSBjaHJvbW9zb21lcyBncm91cC5cblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc0J5KGR5KTtcblx0Ly8gQWZ0ZXIgYSAyMDAgbXMgcGF1c2UgaW4gc2Nyb2xsaW5nLCBzbmFwIHRvIG5lYXJlc3QgY2hyb21vc29tZVxuXHR0aGlzLnRvdXQgJiYgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRvdXQpO1xuXHR0aGlzLnRvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKT0+dGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKSwgMjAwKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNUbyAoeCkge1xuICAgICAgICBpZiAoeCA9PT0gdW5kZWZpbmVkKSB4ID0gdGhpcy5zY3JvbGxBbW91bnQ7XG5cdHRoaXMuc2Nyb2xsQW1vdW50ID0gTWF0aC5tYXgoTWF0aC5taW4oeCwxNSksIC10aGlzLnRvdGFsQ2hyV2lkdGggKiAodGhpcy5hcHAuckdlbm9tZS5jaHJvbW9zb21lcy5sZW5ndGgtMSkpO1xuXHR0aGlzLmdDaHJvbW9zb21lcy5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHt0aGlzLnNjcm9sbEFtb3VudH0sMClgKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNCeSAoZHgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKHRoaXMuc2Nyb2xsQW1vdW50ICsgZHgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc1NuYXAgKCkge1xuXHRsZXQgaSA9IE1hdGgucm91bmQodGhpcy5zY3JvbGxBbW91bnQgLyB0aGlzLnRvdGFsQ2hyV2lkdGgpXG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbyhpKnRoaXMudG90YWxDaHJXaWR0aCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzVXAgKCkge1xuICAgICAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzQnkoLXRoaXMudG90YWxDaHJXaWR0aCk7XG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzRG93biAoKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNCeSh0aGlzLnRvdGFsQ2hyV2lkdGgpO1xuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3VGl0bGUgKCkge1xuXHRsZXQgcmVmZyA9IHRoaXMuYXBwLnJHZW5vbWUubGFiZWw7XG5cdGxldCBibG9ja2cgPSB0aGlzLmN1cnJCbG9ja3MgPyBcblx0ICAgIHRoaXMuY3VyckJsb2Nrcy5jb21wICE9PSB0aGlzLmFwcC5yR2Vub21lID9cblx0ICAgICAgICB0aGlzLmN1cnJCbG9ja3MuY29tcC5sYWJlbFxuXHRcdDpcblx0XHRudWxsXG5cdCAgICA6XG5cdCAgICBudWxsO1xuXHRsZXQgbHN0ID0gdGhpcy5hcHAuY3Vyckxpc3QgPyB0aGlzLmFwcC5jdXJyTGlzdC5uYW1lIDogbnVsbDtcblxuXHR0aGlzLnJvb3Quc2VsZWN0KFwibGFiZWwgc3Bhbi50aXRsZVwiKS50ZXh0KHJlZmcpO1xuXG5cdGxldCBsaW5lcyA9IFtdO1xuXHRibG9ja2cgJiYgbGluZXMucHVzaChgQmxvY2tzIHZzLiAke2Jsb2NrZ31gKTtcblx0bHN0ICYmIGxpbmVzLnB1c2goYEZlYXR1cmVzIGZyb20gbGlzdCBcIiR7bHN0fVwiYCk7XG5cdGxldCBzdWJ0ID0gbGluZXMuam9pbihcIiA6OiBcIik7XG5cdHRoaXMucm9vdC5zZWxlY3QoXCJsYWJlbCBzcGFuLnN1YnRpdGxlXCIpLnRleHQoKHN1YnQgPyBcIjo6IFwiIDogXCJcIikgKyBzdWJ0KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgb3V0bGluZXMgb2Ygc3ludGVueSBibG9ja3Mgb2YgdGhlIHJlZiBnZW5vbWUgdnMuXG4gICAgLy8gdGhlIGdpdmVuIGdlbm9tZS5cbiAgICAvLyBQYXNzaW5nIG51bGwgZXJhc2VzIGFsbCBzeW50ZW55IGJsb2Nrcy5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgIGRhdGEgPT0geyByZWY6R2Vub21lLCBjb21wOkdlbm9tZSwgYmxvY2tzOiBsaXN0IG9mIHN5bnRlbnkgYmxvY2tzIH1cbiAgICAvLyAgICBFYWNoIHNibG9jayA9PT0geyBibG9ja0lkOmludCwgb3JpOisvLSwgZnJvbUNociwgZnJvbVN0YXJ0LCBmcm9tRW5kLCB0b0NociwgdG9TdGFydCwgdG9FbmQgfVxuICAgIGRyYXdCbG9ja3MgKGRhdGEpIHtcblx0Ly9cbiAgICAgICAgbGV0IHNiZ3JwcyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpLnNlbGVjdCgnW25hbWU9XCJzeW5CbG9ja3NcIl0nKTtcblx0aWYgKCFkYXRhIHx8ICFkYXRhLmJsb2NrcyB8fCBkYXRhLmJsb2Nrcy5sZW5ndGggPT09IDApIHtcblx0ICAgIHRoaXMuY3VyckJsb2NrcyA9IG51bGw7XG5cdCAgICBzYmdycHMuaHRtbCgnJyk7XG5cdCAgICB0aGlzLmRyYXdUaXRsZSgpO1xuXHQgICAgcmV0dXJuO1xuXHR9XG5cdHRoaXMuY3VyckJsb2NrcyA9IGRhdGE7XG5cdC8vIHJlb3JnYW5pemUgZGF0YSB0byByZWZsZWN0IFNWRyBzdHJ1Y3R1cmUgd2Ugd2FudCwgaWUsIGdyb3VwZWQgYnkgY2hyb21vc29tZVxuICAgICAgICBsZXQgZHggPSBkYXRhLmJsb2Nrcy5yZWR1Y2UoKGEsc2IpID0+IHtcblx0XHRpZiAoIWFbc2IuZnJvbUNocl0pIGFbc2IuZnJvbUNocl0gPSBbXTtcblx0XHRhW3NiLmZyb21DaHJdLnB1c2goc2IpO1xuXHRcdHJldHVybiBhO1xuXHQgICAgfSwge30pO1xuXHRzYmdycHMuZWFjaChmdW5jdGlvbihjKXtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5kYXR1bSh7Y2hyOiBjLm5hbWUsIGJsb2NrczogZHhbYy5uYW1lXSB8fCBbXSB9KTtcblx0fSk7XG5cblx0bGV0IGJ3aWR0aCA9IDEwO1xuICAgICAgICBsZXQgc2Jsb2NrcyA9IHNiZ3Jwcy5zZWxlY3RBbGwoJ3JlY3Quc2Jsb2NrJykuZGF0YShiPT5iLmJsb2Nrcyk7XG4gICAgICAgIGxldCBuZXdicyA9IHNibG9ja3MuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsJ3NibG9jaycpO1xuXHRzYmxvY2tzXG5cdCAgICAuYXR0cihcInhcIiwgLWJ3aWR0aC8yIClcblx0ICAgIC5hdHRyKFwieVwiLCBiID0+IHRoaXMuZ2V0WShiLmZyb21TdGFydCkpXG5cdCAgICAuYXR0cihcIndpZHRoXCIsIGJ3aWR0aClcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGIgPT4gTWF0aC5tYXgoMCx0aGlzLmdldFkoYi5mcm9tRW5kIC0gYi5mcm9tU3RhcnQgKyAxKSkpXG5cdCAgICAuY2xhc3NlZChcImludmVyc2lvblwiLCBiID0+IGIub3JpID09PSBcIi1cIilcblx0ICAgIC5jbGFzc2VkKFwidHJhbnNsb2NhdGlvblwiLCBiID0+IGIuZnJvbUNociAhPT0gYi50b0Nocilcblx0ICAgIDtcblxuICAgICAgICBzYmxvY2tzLmV4aXQoKS5yZW1vdmUoKTtcblxuXHR0aGlzLmRyYXdUaXRsZSgpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRyYXdUaWNrcyAoZmVhdHVyZXMpIHtcblx0dGhpcy5jdXJyVGlja3MgPSBmZWF0dXJlcztcblx0bGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTsgLy8gcmVmIGdlbm9tZVxuXHQvLyBmZWF0dXJlIHRpY2sgbWFya3Ncblx0aWYgKCFmZWF0dXJlcyB8fCBmZWF0dXJlcy5sZW5ndGggPT09IDApIHtcblx0ICAgIHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbCgnW25hbWU9XCJ0aWNrc1wiXScpLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpLnJlbW92ZSgpO1xuXHQgICAgcmV0dXJuO1xuXHR9XG5cblx0Ly9cblx0bGV0IHRHcnBzID0gdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKFwiLmNocm9tb3NvbWVcIikuc2VsZWN0KCdbbmFtZT1cInRpY2tzXCJdJyk7XG5cblx0Ly8gZ3JvdXAgZmVhdHVyZXMgYnkgY2hyb21vc29tZVxuICAgICAgICBsZXQgZml4ID0gZmVhdHVyZXMucmVkdWNlKChhLGYpID0+IHsgXG5cdCAgICBpZiAoISBhW2YuY2hyXSkgYVtmLmNocl0gPSBbXTtcblx0ICAgIGFbZi5jaHJdLnB1c2goZik7XG5cdCAgICByZXR1cm4gYTtcblx0fSwge30pXG5cdHRHcnBzLmVhY2goZnVuY3Rpb24oYykge1xuXHQgICAgZDMuc2VsZWN0KHRoaXMpLmRhdHVtKCB7IGNocjogYywgZmVhdHVyZXM6IGZpeFtjLm5hbWVdICB8fCBbXX0gKTtcblx0fSk7XG5cblx0Ly8gdGhlIHRpY2sgZWxlbWVudHNcbiAgICAgICAgbGV0IGZlYXRzID0gdEdycHMuc2VsZWN0QWxsKFwiLmZlYXR1cmVcIilcblx0ICAgIC5kYXRhKGQgPT4gZC5mZWF0dXJlcywgZCA9PiBkLm1ncGlkKTtcblx0Ly9cblx0bGV0IHhBZGogPSBmID0+IChmLnN0cmFuZCA9PT0gXCIrXCIgPyB0aGlzLnRpY2tMZW5ndGggOiAtdGhpcy50aWNrTGVuZ3RoKTtcblx0Ly9cblx0bGV0IHNoYXBlID0gXCJjaXJjbGVcIjsgIC8vIFwiY2lyY2xlXCIgb3IgXCJsaW5lXCJcblx0Ly9cblx0bGV0IG5ld2ZzID0gZmVhdHMuZW50ZXIoKVxuXHQgICAgLmFwcGVuZChzaGFwZSlcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImZlYXR1cmVcIilcblx0ICAgIC5vbignY2xpY2snLCAoZikgPT4ge1xuXHRcdGxldCBpID0gZi5jYW5vbmljYWx8fGYuSUQ7XG5cdCAgICAgICAgdGhpcy5hcHAuc2V0Q29udGV4dCh7bGFuZG1hcms6aSwgaGlnaGxpZ2h0OltpXX0pO1xuXHQgICAgfSkgO1xuXHRuZXdmcy5hcHBlbmQoXCJ0aXRsZVwiKVxuXHRcdC50ZXh0KGY9PmYuc3ltYm9sIHx8IGYuaWQpO1xuXHRpZiAoc2hhcGUgPT09IFwibGluZVwiKSB7XG5cdCAgICBmZWF0cy5hdHRyKFwieDFcIiwgZiA9PiB4QWRqKGYpICsgNSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ5MVwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ4MlwiLCBmID0+IHhBZGooZikgKyB0aGlzLnRpY2tMZW5ndGggKyA1KVxuXHQgICAgZmVhdHMuYXR0cihcInkyXCIsIGYgPT4gcmcueXNjYWxlKGYuc3RhcnQpKVxuXHR9XG5cdGVsc2Uge1xuXHQgICAgZmVhdHMuYXR0cihcImN4XCIsIGYgPT4geEFkaihmKSlcblx0ICAgIGZlYXRzLmF0dHIoXCJjeVwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0ICAgIGZlYXRzLmF0dHIoXCJyXCIsICB0aGlzLnRpY2tMZW5ndGggLyAyKTtcblx0fVxuXHQvL1xuXHRmZWF0cy5leGl0KCkucmVtb3ZlKClcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBHZW5vbWVWaWV3XG5cbmV4cG9ydCB7IEdlbm9tZVZpZXcgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0dlbm9tZVZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcblxuY2xhc3MgRmVhdHVyZURldGFpbHMgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMuaW5pdERvbSAoKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RG9tICgpIHtcblx0Ly9cblx0dGhpcy5yb290LnNlbGVjdCAoXCIuYnV0dG9uLmNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5leHRyYVwiLCAoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIHVwZGF0ZShmKSB7XG5cdC8vIGlmIGNhbGxlZCB3aXRoIG5vIGFyZ3MsIHVwZGF0ZSB1c2luZyB0aGUgcHJldmlvdXMgZmVhdHVyZVxuXHRmID0gZiB8fCB0aGlzLmxhc3RGZWF0dXJlO1xuXHRpZiAoIWYpIHtcblx0ICAgLy8gRklYTUU6IG1ham9yIHJlYWNob3ZlciBpbiB0aGlzIHNlY3Rpb25cblx0ICAgLy9cblx0ICAgLy8gZmFsbGJhY2suIHRha2UgdGhlIGZpcnN0IGhpZ2hsaWdodGVkLlxuXHQgICBsZXQgciA9IHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwicmVjdC5mZWF0dXJlLmhpZ2hsaWdodFwiKVswXVswXTtcblx0ICAgLy8gZmFsbGJhY2suIHRha2UgdGhlIGZpcnN0IGZlYXR1cmVcblx0ICAgaWYgKCFyKSByID0gdGhpcy5hcHAuem9vbVZpZXcuc3ZnTWFpbi5zZWxlY3QoXCJyZWN0LmZlYXR1cmVcIilbMF1bMF07XG5cdCAgIGlmIChyKSBmID0gci5fX2RhdGFfXztcblx0fVxuXHQvLyByZW1lbWJlclxuICAgICAgICBpZiAoIWYpIHRocm93IFwiQ2Fubm90IHVwZGF0ZSBmZWF0dXJlIGRldGFpbHMuIE5vIGZlYXR1cmUuXCI7XG5cdHRoaXMubGFzdEZlYXR1cmUgPSBmO1xuXG5cdC8vIGxpc3Qgb2YgZmVhdHVyZXMgdG8gc2hvdyBpbiBkZXRhaWxzIGFyZWEuXG5cdC8vIHRoZSBnaXZlbiBmZWF0dXJlIGFuZCBhbGwgZXF1aXZhbGVudHMgaW4gb3RoZXIgZ2Vub21lcy5cblx0bGV0IGZsaXN0ID0gW2ZdO1xuXHRpZiAoZi5tZ2lpZCkge1xuXHQgICAgLy8gRklYTUU6IHJlYWNob3ZlclxuXHQgICAgZmxpc3QgPSB0aGlzLmFwcC5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5Q2Fub25pY2FsSWQoZi5tZ2lpZCk7XG5cdH1cblx0Ly8gR290IHRoZSBsaXN0LiBOb3cgb3JkZXIgaXQgdGhlIHNhbWUgYXMgdGhlIGRpc3BsYXllZCBnZW5vbWVzXG5cdC8vIGJ1aWxkIGluZGV4IG9mIGdlbm9tZSBuYW1lIC0+IGZlYXR1cmUgaW4gZmxpc3Rcblx0bGV0IGl4ID0gZmxpc3QucmVkdWNlKChhY2MsZikgPT4geyBhY2NbZi5nZW5vbWUubmFtZV0gPSBmOyByZXR1cm4gYWNjOyB9LCB7fSlcblx0bGV0IGdlbm9tZU9yZGVyID0gKFt0aGlzLmFwcC5yR2Vub21lXS5jb25jYXQodGhpcy5hcHAuY0dlbm9tZXMpKTtcblx0Zmxpc3QgPSBnZW5vbWVPcmRlci5tYXAoZyA9PiBpeFtnLm5hbWVdIHx8IG51bGwpO1xuXHQvL1xuXHRsZXQgY29sSGVhZGVycyA9IFtcblx0ICAgIC8vIGNvbHVtbnMgaGVhZGVycyBhbmQgdGhlaXIgJSB3aWR0aHNcblx0ICAgIFtcIkdlbm9tZVwiICAgICAsOV0sXG5cdCAgICBbXCJNR1AgaWRcIiAgICAgLDE3XSxcblx0ICAgIFtcIlR5cGVcIiAgICAgICAsMTAuNV0sXG5cdCAgICBbXCJCaW9UeXBlXCIgICAgLDE4LjVdLFxuXHQgICAgW1wiQ29vcmRzXCIgICAgICwxOF0sXG5cdCAgICBbXCJMZW5ndGhcIiAgICAgLDddLFxuXHQgICAgW1wiTUdJIGlkXCIgICAgICwxMF0sXG5cdCAgICBbXCJNR0kgc3ltYm9sXCIgLDEwXVxuXHRdO1xuXHQvLyBJbiB0aGUgY2xvc2VkIHN0YXRlLCBvbmx5IHNob3cgdGhlIGhlYWRlciBhbmQgdGhlIHJvdyBmb3IgdGhlIHBhc3NlZCBmZWF0dXJlXG5cdGlmICh0aGlzLnJvb3QuY2xhc3NlZCgnY2xvc2VkJykpXG5cdCAgICBmbGlzdCA9IGZsaXN0LmZpbHRlciggKGZmLCBpKSA9PiBmZiA9PT0gZiApO1xuXHQvLyBEcmF3IHRoZSB0YWJsZVxuXHRsZXQgdCA9IHRoaXMucm9vdC5zZWxlY3QoJ3RhYmxlJyk7XG5cdGxldCByb3dzID0gdC5zZWxlY3RBbGwoJ3RyJykuZGF0YSggW2NvbEhlYWRlcnNdLmNvbmNhdChmbGlzdCkgKTtcblx0cm93cy5lbnRlcigpLmFwcGVuZCgndHInKVxuXHQgIC5vbihcIm1vdXNlZW50ZXJcIiwgKGYsaSkgPT4gaSAhPT0gMCAmJiB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoZiwgdHJ1ZSkpXG5cdCAgLm9uKFwibW91c2VsZWF2ZVwiLCAoZixpKSA9PiBpICE9PSAwICYmIHRoaXMuYXBwLnpvb21WaWV3LmhpZ2hsaWdodCgpKTtcblx0ICAgICAgXG5cdHJvd3MuZXhpdCgpLnJlbW92ZSgpO1xuXHRyb3dzLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgKGZmLCBpKSA9PiAoaSAhPT0gMCAmJiBmZiA9PT0gZikpO1xuXHQvL1xuXHQvLyBHaXZlbiBhIGZlYXR1cmUsIHJldHVybnMgYSBsaXN0IG9mIHN0cmluZ3MgZm9yIHBvcHVsYXRpbmcgYSB0YWJsZSByb3cuXG5cdC8vIElmIGk9PT0wLCB0aGVuIGYgaXMgbm90IGEgZmVhdHVyZSwgYnV0IGEgbGlzdCBjb2x1bW5zIG5hbWVzK3dpZHRocy5cblx0Ly8gXG5cdGxldCBjZWxsRGF0YSA9IGZ1bmN0aW9uIChmLCBpKSB7XG5cdCAgICBpZiAoaSA9PT0gMCkge1xuXHRcdHJldHVybiBmO1xuXHQgICAgfVxuXHQgICAgbGV0IGNlbGxEYXRhID0gWyBnZW5vbWVPcmRlcltpLTFdLmxhYmVsLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiBdO1xuXHQgICAgLy8gZiBpcyBudWxsIGlmIGl0IGRvZXNuJ3QgZXhpc3QgZm9yIGdlbm9tZSBpIFxuXHQgICAgaWYgKGYpIHtcblx0XHRsZXQgbGluayA9IFwiXCI7XG5cdFx0bGV0IG1naWlkID0gZi5tZ2lpZCB8fCBcIlwiO1xuXHRcdGlmIChtZ2lpZCkge1xuXHRcdCAgICBsZXQgdXJsID0gYGh0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9hY2Nlc3Npb24vJHttZ2lpZH1gO1xuXHRcdCAgICBsaW5rID0gYDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIke3VybH1cIj4ke21naWlkfTwvYT5gO1xuXHRcdH1cblx0XHRjZWxsRGF0YSA9IFtcblx0XHQgICAgZi5nZW5vbWUubGFiZWwsXG5cdFx0ICAgIGYubWdwaWQsXG5cdFx0ICAgIGYudHlwZSxcblx0XHQgICAgZi5iaW90eXBlLFxuXHRcdCAgICBgJHtmLmNocn06JHtmLnN0YXJ0fS4uJHtmLmVuZH0gKCR7Zi5zdHJhbmR9KWAsXG5cdFx0ICAgIGAke2YuZW5kIC0gZi5zdGFydCArIDF9IGJwYCxcblx0XHQgICAgbGluayB8fCBtZ2lpZCxcblx0XHQgICAgZi5zeW1ib2xcblx0XHRdO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGNlbGxEYXRhO1xuXHR9O1xuXHRsZXQgY2VsbHMgPSByb3dzLnNlbGVjdEFsbChcInRkXCIpXG5cdCAgICAuZGF0YSgoZixpKSA9PiBjZWxsRGF0YShmLGkpKTtcblx0Y2VsbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZFwiKTtcblx0Y2VsbHMuZXhpdCgpLnJlbW92ZSgpO1xuXHRjZWxscy5odG1sKChkLGksaikgPT4ge1xuXHQgICAgcmV0dXJuIGogPT09IDAgPyBkWzBdIDogZFxuXHR9KVxuXHQuc3R5bGUoXCJ3aWR0aFwiLCAoZCxpLGopID0+IGogPT09IDAgPyBgJHtkWzFdfSVgIDogbnVsbCk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBGZWF0dXJlRGV0YWlscyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmVhdHVyZURldGFpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFNWR1ZpZXcgfSBmcm9tICcuL1NWR1ZpZXcnO1xuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gJy4vRmVhdHVyZSc7XG5pbXBvcnQgeyBwYXJzZUNvb3JkcywgZm9ybWF0Q29vcmRzLCBjb29yZHNBZnRlclRyYW5zZm9ybSwgcmVtb3ZlRHVwcyB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIFpvb21WaWV3IGV4dGVuZHMgU1ZHVmlldyB7XG4gICAgLy9cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQsIGluaXRpYWxDb29yZHMsIGluaXRpYWxIaSkge1xuICAgICAgc3VwZXIoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgLy9cbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIC8vXG4gICAgICB0aGlzLm1pblN2Z0hlaWdodCA9IDI1MDtcbiAgICAgIHRoaXMuYmxvY2tIZWlnaHQgPSA0MDtcbiAgICAgIHRoaXMudG9wT2Zmc2V0ID0gNDU7XG4gICAgICB0aGlzLmZlYXRIZWlnaHQgPSA2O1x0Ly8gaGVpZ2h0IG9mIGEgcmVjdGFuZ2xlIHJlcHJlc2VudGluZyBhIGZlYXR1cmVcbiAgICAgIHRoaXMubGFuZUdhcCA9IDI7XHQgICAgICAgIC8vIHNwYWNlIGJldHdlZW4gc3dpbSBsYW5lc1xuICAgICAgdGhpcy5sYW5lSGVpZ2h0ID0gdGhpcy5mZWF0SGVpZ2h0ICsgdGhpcy5sYW5lR2FwO1xuICAgICAgdGhpcy5zdHJpcEhlaWdodCA9IDcwOyAgICAvLyBoZWlnaHQgcGVyIGdlbm9tZSBpbiB0aGUgem9vbSB2aWV3XG4gICAgICB0aGlzLnN0cmlwR2FwID0gMjA7XHQvLyBzcGFjZSBiZXR3ZWVuIHN0cmlwc1xuICAgICAgdGhpcy5kbW9kZSA9ICdjb21wYXJpc29uJzsvLyBkcmF3aW5nIG1vZGUuICdjb21wYXJpc29uJyBvciAncmVmZXJlbmNlJ1xuXG4gICAgICAvL1xuICAgICAgLy8gSURzIG9mIEZlYXR1cmVzIHdlJ3JlIGhpZ2hsaWdodGluZy4gTWF5IGJlIG1ncGlkICBvciBtZ2lJZFxuICAgICAgLy8gaGlGZWF0cyBpcyBhbiBvYmogd2hvc2Uga2V5cyBhcmUgdGhlIElEc1xuICAgICAgdGhpcy5oaUZlYXRzID0gKGluaXRpYWxIaSB8fCBbXSkucmVkdWNlKCAoYSx2KSA9PiB7IGFbdl09djsgcmV0dXJuIGE7IH0sIHt9ICk7XG4gICAgICAvL1xuICAgICAgdGhpcy5maWR1Y2lhbHMgPSB0aGlzLnN2Zy5pbnNlcnQoXCJnXCIsXCI6Zmlyc3QtY2hpbGRcIikgLy8gXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIixcImZpZHVjaWFsc1wiKTtcbiAgICAgIHRoaXMuc3RyaXBzR3JwID0gdGhpcy5zdmdNYWluLmFwcGVuZChcImdcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLFwic3RyaXBzXCIpO1xuICAgICAgdGhpcy5heGlzID0gdGhpcy5zdmdNYWluLmFwcGVuZChcImdcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLFwiYXhpc1wiKTtcbiAgICAgIHRoaXMuY3h0TWVudSA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiY3h0TWVudVwiXScpO1xuICAgICAgLy9cbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBudWxsO1xuICAgICAgdGhpcy5kcmFnZ2VyID0gdGhpcy5nZXREcmFnZ2VyKCk7XG4gICAgICAvL1xuICAgICAgdGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIC8vXG4gICAgaW5pdERvbSAoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblx0bGV0IHIgPSB0aGlzLnJvb3Q7XG5cdGxldCBhID0gdGhpcy5hcHA7XG5cdC8vXG5cdHIuc2VsZWN0KCcuYnV0dG9uLmNsb3NlJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcblxuXHQvLyB6b29tIGNvbnRyb2xzXG5cdHIuc2VsZWN0KFwiI3pvb21PdXRcIikub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnpvb20oYS5kZWZhdWx0Wm9vbSkgfSk7XG5cdHIuc2VsZWN0KFwiI3pvb21JblwiKSAub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnpvb20oMS9hLmRlZmF1bHRab29tKSB9KTtcblx0ci5zZWxlY3QoXCIjem9vbU91dE1vcmVcIikub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnpvb20oMiphLmRlZmF1bHRab29tKSB9KTtcblx0ci5zZWxlY3QoXCIjem9vbUluTW9yZVwiKSAub24oXCJjbGlja1wiLFxuXHQgICAgKCkgPT4geyBhLnpvb20oMS8oMiphLmRlZmF1bHRab29tKSkgfSk7XG5cblx0Ly8gcGFuIGNvbnRyb2xzXG5cdHIuc2VsZWN0KFwiI3BhbkxlZnRcIikgLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS5wYW4oLWEuZGVmYXVsdFBhbikgfSk7XG5cdHIuc2VsZWN0KFwiI3BhblJpZ2h0XCIpLm9uKFwiY2xpY2tcIixcblx0ICAgICgpID0+IHsgYS5wYW4oK2EuZGVmYXVsdFBhbikgfSk7XG5cdHIuc2VsZWN0KFwiI3BhbkxlZnRNb3JlXCIpIC5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEucGFuKC01KmEuZGVmYXVsdFBhbikgfSk7XG5cdHIuc2VsZWN0KFwiI3BhblJpZ2h0TW9yZVwiKS5vbihcImNsaWNrXCIsXG5cdCAgICAoKSA9PiB7IGEucGFuKCs1KmEuZGVmYXVsdFBhbikgfSk7XG5cblx0Ly8gQ3JlYXRlIGNvbnRleHQgbWVudS4gXG5cdHRoaXMuaW5pdENvbnRleHRNZW51KFt7XG4gICAgICAgICAgICBsYWJlbDogXCJNR0kgU05Qc1wiLCBcblx0ICAgIGljb246IFwib3Blbl9pbl9uZXdcIixcblx0ICAgIHRvb2x0aXA6IFwiVmlldyBTTlBzIGF0IE1HSSBmb3IgdGhlIGN1cnJlbnQgc3RyYWlucyBpbiB0aGUgY3VycmVudCByZWdpb24uIChTb21lIHN0cmFpbnMgbm90IGF2YWlsYWJsZS4pXCIsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naVNucFJlcG9ydCgpXG5cdH0se1xuICAgICAgICAgICAgbGFiZWw6IFwiTUdJIFFUTHNcIiwgXG5cdCAgICBpY29uOiAgXCJvcGVuX2luX25ld1wiLFxuXHQgICAgdG9vbHRpcDogXCJWaWV3IFFUTCBhdCBNR0kgdGhhdCBvdmVybGFwIHRoZSBjdXJyZW50IHJlZ2lvbi5cIixcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpUVRMcygpXG5cdH0se1xuICAgICAgICAgICAgbGFiZWw6IFwiTUdJIEpCcm93c2VcIiwgXG5cdCAgICBpY29uOiBcIm9wZW5faW5fbmV3XCIsXG5cdCAgICB0b29sdGlwOiBcIk9wZW4gTUdJIEpCcm93c2UgKEM1N0JMLzZKIEdSQ20zOCkgd2l0aCB0aGUgY3VycmVudCBjb29yZGluYXRlIHJhbmdlLlwiLFxuXHQgICAgaGFuZGxlcjogKCk9PiB0aGlzLmFwcC5saW5rVG9NZ2lKQnJvd3NlKClcblx0fV0pO1xuXHR0aGlzLnJvb3Rcblx0ICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdCAgICAgIC8vIGNsaWNrIG9uIGJhY2tncm91bmQgPT4gaGlkZSBjb250ZXh0IG1lbnVcblx0ICAgICAgbGV0IHRndCA9IGQzLmV2ZW50LnRhcmdldDtcblx0ICAgICAgaWYgKHRndC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaVwiICYmIHRndC5pbm5lckhUTUwgPT09IFwibWVudVwiKVxuXHRcdCAgLy8gZXhjZXB0aW9uOiB0aGUgY29udGV4dCBtZW51IGJ1dHRvbiBpdHNlbGZcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgZWxzZVxuXHRcdCAgdGhpcy5oaWRlQ29udGV4dE1lbnUoKVxuXHQgICAgICBcblx0ICB9KVxuXHQgIC5vbignY29udGV4dG1lbnUnLCBmdW5jdGlvbigpe1xuXHQgICAgICAvLyByaWdodC1jbGljayBvbiBhIGZlYXR1cmUgPT4gZmVhdHVyZSBjb250ZXh0IG1lbnVcblx0ICAgICAgbGV0IHRndCA9IGQzLmV2ZW50LnRhcmdldDtcblx0ICAgICAgaWYgKCF0Z3QuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmVhdHVyZVwiKSkgcmV0dXJuO1xuXHQgICAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgICBkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICB9KTtcblxuXHQvL1xuXHQvL1xuXHRsZXQgZkNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChmLCBldnQsIHByZXNlcnZlKSB7XG5cdCAgICBsZXQgaWQgPSBmLm1naWlkIHx8IGYubWdwaWQ7XG5cdCAgICBpZiAoZXZ0Lm1ldGFLZXkpIHtcblx0XHRpZiAoIWV2dC5zaGlmdEtleSAmJiAhcHJlc2VydmUpIHRoaXMuaGlGZWF0cyA9IHt9O1xuXHRcdHRoaXMuaGlGZWF0c1tpZF0gPSBpZDtcblx0ICAgICAgICB0aGlzLmFwcC5zZXRDb250ZXh0KHtsYW5kbWFyazooZi5jYW5vbmljYWwgfHwgZi5JRCksIGRlbHRhOjB9KVxuXHRcdHJldHVybjtcblx0ICAgIH1cblx0ICAgIGlmIChldnQuc2hpZnRLZXkpIHtcblx0XHRpZiAodGhpcy5oaUZlYXRzW2lkXSlcblx0XHQgICAgZGVsZXRlIHRoaXMuaGlGZWF0c1tpZF1cblx0XHRlbHNlXG5cdFx0ICAgIHRoaXMuaGlGZWF0c1tpZF0gPSBpZDtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHRcdGlmICghcHJlc2VydmUpIHRoaXMuaGlGZWF0cyA9IHt9O1xuXHRcdHRoaXMuaGlGZWF0c1tpZF0gPSBpZDtcblx0ICAgIH1cblx0fS5iaW5kKHRoaXMpO1xuXHQvL1xuXHRsZXQgZk1vdXNlT3ZlckhhbmRsZXIgPSBmdW5jdGlvbihmKSB7XG5cdFx0aWYgKGQzLmV2ZW50LmFsdEtleSkge1xuXHRcdCAgICAvLyBJZiB1c2VyIGlzIGhvbGRpbmcgdGhlIGFsdCBrZXksIHNlbGVjdCBldmVyeXRoaW5nIHRvdWNoZWQuXG5cdFx0ICAgIGZDbGlja0hhbmRsZXIoZiwgZDMuZXZlbnQsIHRydWUpO1xuXHRcdCAgICB0aGlzLmhpZ2hsaWdodCgpO1xuXHRcdCAgICAvLyBEb24ndCByZWdpc3RlciBjb250ZXh0IGNoYW5nZXMgdW50aWwgdXNlciBoYXMgcGF1c2VkIGZvciBhdCBsZWFzdCAxcy5cblx0XHQgICAgaWYgKHRoaXMudGltZW91dCkgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuXHRcdCAgICB0aGlzLnRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpeyB0aGlzLmFwcC5jb250ZXh0Q2hhbmdlZCgpOyB9LmJpbmQodGhpcyksIDEwMDApO1xuXHRcdH1cblx0XHRlbHNlIGlmICghZDMuZXZlbnQuY3RybEtleSkgXG5cdFx0ICAgIHRoaXMuaGlnaGxpZ2h0KGYpO1xuXHR9LmJpbmQodGhpcyk7XG5cdC8vXG5cdGxldCBmTW91c2VPdXRIYW5kbGVyID0gZnVuY3Rpb24oZikge1xuXHQgICAgaWYgKCFkMy5ldmVudC5jdHJsS2V5KVxuXHRcdHRoaXMuaGlnaGxpZ2h0KCk7IFxuXHR9LmJpbmQodGhpcyk7XG5cblx0Ly8gXG4gICAgICAgIHRoaXMuc3ZnXG5cdCAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHQgICAgICBsZXQgdCA9IGQzLmV2ZW50LnRhcmdldDtcblx0ICAgICAgbGV0IHRndCA9IGQzLnNlbGVjdCh0KTtcblx0ICAgICAgaWYgKHQudGFnTmFtZSA9PSBcInJlY3RcIiAmJiB0LmNsYXNzTGlzdC5jb250YWlucyhcImZlYXR1cmVcIikpIHtcblx0XHQgIC8vIHVzZXIgY2xpY2tlZCBvbiBhIGZlYXR1cmVcblx0XHQgIGZDbGlja0hhbmRsZXIodC5fX2RhdGFfXywgZDMuZXZlbnQpO1xuXHRcdCAgdGhpcy5oaWdobGlnaHQoKTtcblx0ICAgICAgICAgIHRoaXMuYXBwLmNvbnRleHRDaGFuZ2VkKCk7XG5cdCAgICAgIH1cblx0ICAgICAgZWxzZSBpZiAodC50YWdOYW1lID09IFwicmVjdFwiICYmIHQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYmxvY2tcIikgJiYgIWQzLmV2ZW50LnNoaWZ0S2V5KSB7XG5cdFx0ICAvLyB1c2VyIGNsaWNrZWQgb24gYSBzeW50ZW55IGJsb2NrIGJhY2tncm91bmRcblx0XHQgIHRoaXMuaGlGZWF0cyA9IHt9O1xuXHRcdCAgdGhpcy5oaWdobGlnaHQoKTtcblx0XHQgIHRoaXMuYXBwLmNvbnRleHRDaGFuZ2VkKCk7XG5cdCAgICAgIH1cblx0ICAgICAgZWxzZSBpZiAodC50YWdOYW1lID09IFwicmVjdFwiICYmIHRndC5hdHRyKCduYW1lJykgPT09ICd6b29tU3RyaXBIYW5kbGUnICYmIGQzLmV2ZW50LnNoaWZ0S2V5KSB7XG5cdCAgICAgICAgICB0aGlzLmFwcC5zZXRDb250ZXh0KHtyZWY6dC5fX2RhdGFfXy5nZW5vbWUubmFtZX0pO1xuXHQgICAgICB9XG5cdCAgfSlcblx0ICAub24oXCJtb3VzZW92ZXJcIiwgKCkgPT4ge1xuXHQgICAgICBsZXQgdGd0ID0gZDMuc2VsZWN0KGQzLmV2ZW50LnRhcmdldCk7XG5cdCAgICAgIGxldCBmID0gdGd0LmRhdGEoKVswXTtcblx0ICAgICAgaWYgKGYgaW5zdGFuY2VvZiBGZWF0dXJlKSB7XG5cdFx0ICBmTW91c2VPdmVySGFuZGxlcihmKTtcblx0ICAgICAgfVxuXHQgIH0pXG5cdCAgLm9uKFwibW91c2VvdXRcIiwgKCkgPT4ge1xuXHQgICAgICBsZXQgdGd0ID0gZDMuc2VsZWN0KGQzLmV2ZW50LnRhcmdldCk7XG5cdCAgICAgIGxldCBmID0gdGd0LmRhdGEoKVswXTtcblx0ICAgICAgaWYgKGYgaW5zdGFuY2VvZiBGZWF0dXJlKSB7XG5cdFx0ICBmTW91c2VPdXRIYW5kbGVyKGYpO1xuXHQgICAgICB9XG5cdCAgfSk7XG5cblx0Ly8gQnV0dG9uOiBEcm9wIGRvd24gbWVudSBpbiB6b29tIHZpZXdcblx0dGhpcy5yb290LnNlbGVjdChcIi5tZW51ID4gLmJ1dHRvblwiKVxuXHQgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgLy8gc2hvdyBjb250ZXh0IG1lbnUgYXQgbW91c2UgZXZlbnQgY29vcmRpbmF0ZXNcblx0ICAgICAgbGV0IGN4ID0gZDMuZXZlbnQuY2xpZW50WDtcblx0ICAgICAgbGV0IGN5ID0gZDMuZXZlbnQuY2xpZW50WTtcblx0ICAgICAgbGV0IGJiID0gZDMuc2VsZWN0KHRoaXMpWzBdWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICBkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgc2VsZi5zaG93Q29udGV4dE1lbnUoY3gtYmIubGVmdCxjeS1iYi50b3ApO1xuXHQgIH0pO1xuXHQvLyB6b29tIGNvb3JkaW5hdGVzIGJveFxuXHR0aGlzLnJvb3Quc2VsZWN0KFwiI3pvb21Db29yZHNcIilcblx0ICAgIC5jYWxsKHpjcyA9PiB6Y3NbMF1bMF0udmFsdWUgPSBmb3JtYXRDb29yZHModGhpcy5hcHAuY29vcmRzKSlcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHsgdGhpcy5zZWxlY3QoKTsgfSlcblx0ICAgIC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7IHNlbGYuYXBwLnNldENvb3JkaW5hdGVzKHRoaXMudmFsdWUpOyB9KTtcblxuXHQvLyB6b29tIHdpbmRvdyBzaXplIGJveFxuXHR0aGlzLnJvb3Quc2VsZWN0KFwiI3pvb21XU2l6ZVwiKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkgeyB0aGlzLnNlbGVjdCgpOyB9KVxuXHQgICAgLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIGxldCB3cyA9IHBhcnNlSW50KHRoaXMudmFsdWUpO1xuXHRcdGxldCBjID0gc2VsZi5hcHAuY29vcmRzO1xuXHRcdGlmIChpc05hTih3cykgfHwgd3MgPCAxMDApIHtcblx0XHQgICAgYWxlcnQoXCJJbnZhbGlkIHdpbmRvdyBzaXplLiBQbGVhc2UgZW50ZXIgYW4gaW50ZWdlciA+PSAxMDAuXCIpO1xuXHRcdCAgICB0aGlzLnZhbHVlID0gTWF0aC5yb3VuZChjLmVuZCAtIGMuc3RhcnQgKyAxKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIGxldCBtaWQgPSAoYy5zdGFydCArIGMuZW5kKSAvIDI7XG5cdFx0ICAgIGxldCBuZXdzID0gTWF0aC5yb3VuZChtaWQgLSB3cy8yKTtcblx0XHQgICAgbGV0IG5ld2UgPSBuZXdzICsgd3MgLSAxO1xuXHRcdCAgICBzZWxmLmFwcC5zZXRDb250ZXh0KHtcblx0XHQgICAgICAgIGNocjogYy5jaHIsXG5cdFx0XHRzdGFydDogbmV3cyxcblx0XHRcdGVuZDogbmV3ZSxcblx0XHRcdGxlbmd0aDogbmV3ZS1uZXdzKzFcblx0XHQgICAgfSk7XG5cdFx0fVxuXHQgICAgfSk7XG5cdC8vIHpvb20gZHJhd2luZyBtb2RlIFxuXHR0aGlzLnJvb3Quc2VsZWN0QWxsKCdkaXZbbmFtZT1cInpvb21EbW9kZVwiXSAuYnV0dG9uJylcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdGxldCByID0gc2VsZi5yb290O1xuXHRcdGxldCBpc0MgPSByLmNsYXNzZWQoJ2NvbXBhcmlzb24nKTtcblx0XHRyLmNsYXNzZWQoJ2NvbXBhcmlzb24nLCAhaXNDKTtcblx0XHRyLmNsYXNzZWQoJ3JlZmVyZW5jZScsIGlzQyk7XG5cdFx0c2VsZi5hcHAuc2V0Q29udGV4dCh7ZG1vZGU6IHIuY2xhc3NlZCgnY29tcGFyaXNvbicpID8gJ2NvbXBhcmlzb24nIDogJ3JlZmVyZW5jZSd9KTtcblx0ICAgIH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBkYXRhIChsaXN0IG9mIG1lbnVJdGVtIGNvbmZpZ3MpIEVhY2ggY29uZmlnIGxvb2tzIGxpa2Uge2xhYmVsOnN0cmluZywgaGFuZGxlcjogZnVuY3Rpb259XG4gICAgaW5pdENvbnRleHRNZW51IChkYXRhKSB7XG5cdHRoaXMuY3h0TWVudS5zZWxlY3RBbGwoXCIubWVudUl0ZW1cIikucmVtb3ZlKCk7IC8vIGluIGNhc2Ugb2YgcmUtaW5pdFxuICAgICAgICBsZXQgbWl0ZW1zID0gdGhpcy5jeHRNZW51XG5cdCAgLnNlbGVjdEFsbChcIi5tZW51SXRlbVwiKVxuXHQgIC5kYXRhKGRhdGEpO1xuXHRsZXQgbmV3cyA9IG1pdGVtcy5lbnRlcigpXG5cdCAgLmFwcGVuZChcImRpdlwiKVxuXHQgIC5hdHRyKFwiY2xhc3NcIiwgXCJtZW51SXRlbSBmbGV4cm93XCIpXG5cdCAgLmF0dHIoXCJ0aXRsZVwiLCBkID0+IGQudG9vbHRpcCB8fCBudWxsICk7XG5cdG5ld3MuYXBwZW5kKFwibGFiZWxcIilcblx0ICAudGV4dChkID0+IGQubGFiZWwpXG5cdCAgLm9uKFwiY2xpY2tcIiwgZCA9PiB7XG5cdCAgICAgIGQuaGFuZGxlcigpO1xuXHQgICAgICB0aGlzLmhpZGVDb250ZXh0TWVudSgpO1xuXHQgIH0pO1xuXHRuZXdzLmFwcGVuZChcImlcIilcblx0ICAuYXR0cihcImNsYXNzXCIsIFwibWF0ZXJpYWwtaWNvbnNcIilcblx0ICAudGV4dCggZD0+ZC5pY29uICk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldCBoaWdobGlnaHRlZCAoaGxzKSB7XG5cdGlmICh0eXBlb2YoaGxzKSA9PT0gXCJzdHJpbmdcIilcblx0ICAgIGhscyA9IFtobHNdO1xuXHQvL1xuXHR0aGlzLmhpRmVhdHMgPSB7fTtcbiAgICAgICAgZm9yKGxldCBoIG9mIGhscyl7XG5cdCAgICB0aGlzLmhpRmVhdHNbaF0gPSBoO1xuXHR9XG4gICAgfVxuICAgIGdldCBoaWdobGlnaHRlZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpRmVhdHMgPyBPYmplY3Qua2V5cyh0aGlzLmhpRmVhdHMpIDogW107XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd0NvbnRleHRNZW51ICh4LHkpIHtcbiAgICAgICAgdGhpcy5jeHRNZW51XG5cdCAgICAuY2xhc3NlZChcInNob3dpbmdcIiwgdHJ1ZSlcblx0ICAgIC5zdHlsZShcImxlZnRcIiwgYCR7eH1weGApXG5cdCAgICAuc3R5bGUoXCJ0b3BcIiwgYCR7eX1weGApXG5cdCAgICA7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZGVDb250ZXh0TWVudSAoKSB7XG4gICAgICAgIHRoaXMuY3h0TWVudS5jbGFzc2VkKFwic2hvd2luZ1wiLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgZ3MgKGxpc3Qgb2YgR2Vub21lcylcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICAgIEZvciBlYWNoIEdlbm9tZSwgc2V0cyBnLnpvb21ZIFxuICAgIHNldCBnZW5vbWVzIChncykge1xuICAgICAgIGdzLmZvckVhY2goIChnLGkpID0+IHtnLnpvb21ZID0gdGhpcy50b3BPZmZzZXQgKyBpICogKHRoaXMuc3RyaXBIZWlnaHQgKyB0aGlzLnN0cmlwR2FwKX0gKTtcbiAgICAgICB0aGlzLl9nZW5vbWVzID0gZ3M7XG4gICAgfVxuICAgIGdldCBnZW5vbWVzICgpIHtcbiAgICAgICByZXR1cm4gdGhpcy5fZ2Vub21lcztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcyAoc3RyaXBlcykgaW4gdG9wLXRvLWJvdHRvbSBvcmRlci5cbiAgICAvL1xuICAgIGdldEdlbm9tZVlPcmRlciAoKSB7XG4gICAgICAgIGxldCBzdHJpcHMgPSB0aGlzLnN2Z01haW4uc2VsZWN0QWxsKFwiLnpvb21TdHJpcFwiKTtcbiAgICAgICAgbGV0IHNzID0gc3RyaXBzWzBdLm1hcChnPT4ge1xuXHQgICAgbGV0IGJiID0gZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgIHJldHVybiBbYmIueSwgZy5fX2RhdGFfXy5nZW5vbWUubmFtZV07XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgbnMgPSBzcy5zb3J0KCAoYSxiKSA9PiBhWzBdIC0gYlswXSApLm1hcCggeCA9PiB4WzFdIClcblx0cmV0dXJuIG5zO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTZXRzIHRoZSB0b3AtdG8tYm90dG9tIG9yZGVyIG9mIHRoZSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMgYWNjb3JkaW5nIHRvIFxuICAgIC8vIHRoZSBnaXZlbiBuYW1lIGxpc3Qgb2YgbmFtZXMuIEJlY2F1c2Ugd2UgY2FuJ3QgZ3VhcmFudGVlIHRoZSBnaXZlbiBuYW1lcyBjb3JyZXNwb25kXG4gICAgLy8gdG8gYWN0dWFsIHpvb20gc3RyaXBzLCBvciB0aGF0IGFsbCBzdHJpcHMgYXJlIHJlcHJlc2VudGVkLCBldGMuXG4gICAgLy8gVGhlcmVmb3JlLCB0aGUgbGlzdCBpcyBwcmVwcmVjZXNzZWQgYXMgZm9sbG93czpcbiAgICAvLyAgICAgKiBkdXBsaWNhdGUgbmFtZXMsIGlmIHRoZXkgZXhpc3QsIGFyZSByZW1vdmVkXG4gICAgLy8gICAgICogbmFtZXMgdGhhdCBkbyBub3QgY29ycmVzcG9uZCB0byBleGlzdGluZyB6b29tU3RyaXBzIGFyZSByZW1vdmVkXG4gICAgLy8gICAgICogbmFtZXMgb2YgZXhpc3Rpbmcgem9vbSBzdHJpcHMgdGhhdCBkb24ndCBhcHBlYXIgaW4gdGhlIGxpc3QgYXJlIGFkZGVkIHRvIHRoZSBlbmRcbiAgICAvLyBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiBuYW1lcyB3aXRoIHRoZXNlIHByb3BlcnRpZXM6XG4gICAgLy8gICAgICogdGhlcmUgaXMgYSAxOjEgY29ycmVzcG9uZGVuY2UgYmV0d2VlbiBuYW1lcyBhbmQgYWN0dWFsIHpvb20gc3RyaXBzXG4gICAgLy8gICAgICogdGhlIG5hbWUgb3JkZXIgaXMgY29uc2lzdGVudCB3aXRoIHRoZSBpbnB1dCBsaXN0XG4gICAgLy8gVGhpcyBpcyB0aGUgbGlzdCB1c2VkIHRvIChyZSlvcmRlciB0aGUgem9vbSBzdHJpcHMuXG4gICAgLy9cbiAgICAvLyBHaXZlbiB0aGUgbGlzdCBvcmRlcjogXG4gICAgLy8gICAgICogYSBZLXBvc2l0aW9uIGlzIGFzc2lnbmVkIHRvIGVhY2ggZ2Vub21lXG4gICAgLy8gICAgICogem9vbSBzdHJpcHMgdGhhdCBhcmUgTk9UIENVUlJFTlRMWSBCRUlORyBEUkFHR0VEIGFyZSB0cmFuc2xhdGVkIHRvIHRoZWlyIG5ldyBsb2NhdGlvbnNcbiAgICAvL1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIG5zIChsaXN0IG9mIHN0cmluZ3MpIE5hbWVzIG9mIHRoZSBnZW5vbWVzLlxuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgIG5vdGhpbmdcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICAgIFJlY2FsY3VsYXRlcyB0aGUgWS1jb29yZGluYXRlcyBmb3IgZWFjaCBzdHJpcGUgYmFzZWQgb24gdGhlIGdpdmVuIG9yZGVyLCB0aGVuIHRyYW5zbGF0ZXNcbiAgICAvLyAgICAgZWFjaCBzdHJpcCB0byBpdHMgbmV3IHBvc2l0aW9uLlxuICAgIC8vXG4gICAgc2V0R2Vub21lWU9yZGVyIChucykge1xuXHR0aGlzLmdlbm9tZXMgPSByZW1vdmVEdXBzKG5zKS5tYXAobj0+IHRoaXMuYXBwLm5hbWUyZ2Vub21lW25dICkuZmlsdGVyKHg9PngpO1xuICAgICAgICB0aGlzLmdlbm9tZXMuZm9yRWFjaCggKGcsaSkgPT4ge1xuXHQgICAgbGV0IHN0cmlwID0gZDMuc2VsZWN0KGAjem9vbVZpZXcgLnpvb21TdHJpcFtuYW1lPVwiJHtnLm5hbWV9XCJdYCk7XG5cdCAgICBpZiAoIXN0cmlwLmNsYXNzZWQoXCJkcmFnZ2luZ1wiKSlcblx0ICAgICAgICBzdHJpcC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoMCwke2cuem9vbVl9KWApO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgZHJhZ2dlciAoZDMuYmVoYXZpb3IuZHJhZykgdG8gYmUgYXR0YWNoZWQgdG8gZWFjaCB6b29tIHN0cmlwLlxuICAgIC8vIEFsbG93cyBzdHJpcHMgdG8gYmUgcmVvcmRlcmVkIGJ5IGRyYWdnaW5nLlxuICAgIGdldERyYWdnZXIgKCkgeyAgXG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICByZXR1cm4gZDMuYmVoYXZpb3IuZHJhZygpXG5cdCAgLm9yaWdpbihmdW5jdGlvbihkLGkpe1xuXHQgICAgICByZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICB9KVxuICAgICAgICAgIC5vbihcImRyYWdzdGFydC56XCIsIGZ1bmN0aW9uKGcpIHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC5zb3VyY2VFdmVudC50YXJnZXQ7XG5cdCAgICAgIGlmIChkMy5ldmVudC5zb3VyY2VFdmVudC5zaGlmdEtleSB8fCBkMy5zZWxlY3QodCkuYXR0cihcIm5hbWVcIikgIT09ICd6b29tU3RyaXBIYW5kbGUnKXtcblx0ICAgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgfVxuXHQgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgbGV0IHN0cmlwID0gdGhpcy5jbG9zZXN0KFwiLnpvb21TdHJpcFwiKTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZyA9IGQzLnNlbGVjdChzdHJpcCkuY2xhc3NlZChcImRyYWdnaW5nXCIsIHRydWUpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZy56XCIsIGZ1bmN0aW9uIChnKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICBsZXQgbXkgPSBkMy5tb3VzZShzZWxmLnN2Z01haW5bMF1bMF0pWzFdO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgwLCAke215fSlgKTtcblx0ICAgICAgc2VsZi5zZXRHZW5vbWVZT3JkZXIoc2VsZi5nZXRHZW5vbWVZT3JkZXIoKSk7XG5cdCAgICAgIHNlbGYuaGlnaGxpZ2h0KCk7XG5cdCAgfSlcblx0ICAub24oXCJkcmFnZW5kLnpcIiwgZnVuY3Rpb24gKGcpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIC8vXG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcuY2xhc3NlZChcImRyYWdnaW5nXCIsIGZhbHNlKTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZyA9IG51bGw7XG5cdCAgICAgIHNlbGYuc2V0R2Vub21lWU9yZGVyKHNlbGYuZ2V0R2Vub21lWU9yZGVyKCkpO1xuXHQgICAgICBzZWxmLmFwcC5zZXRDb250ZXh0KHsgZ2Vub21lczogc2VsZi5nZXRHZW5vbWVZT3JkZXIoKSB9KTtcblx0ICAgICAgd2luZG93LnNldFRpbWVvdXQoIHNlbGYuaGlnaGxpZ2h0LmJpbmQoc2VsZiksIDI1MCApO1xuXHQgIH0pXG5cdCAgO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQnJ1c2hlcyAoKSB7XG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoXCJnLmJydXNoXCIpXG5cdCAgICAuZWFjaCggZnVuY3Rpb24gKGIpIHtcblx0ICAgICAgICBiLmJydXNoLmNsZWFyKCk7XG5cdFx0ZDMuc2VsZWN0KHRoaXMpLmNhbGwoYi5icnVzaCk7XG5cdCAgICB9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGJydXNoIGNvb3JkaW5hdGVzLCB0cmFuc2xhdGVkIChpZiBuZWVkZWQpIHRvIHJlZiBnZW5vbWUgY29vcmRpbmF0ZXMuXG4gICAgYmJHZXRSZWZDb29yZHMgKCkge1xuICAgICAgbGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTtcbiAgICAgIGxldCBibGsgPSB0aGlzLmJydXNoaW5nO1xuICAgICAgbGV0IGV4dCA9IGJsay5icnVzaC5leHRlbnQoKTtcbiAgICAgIGxldCByID0geyBjaHI6IGJsay5jaHIsIHN0YXJ0OiBleHRbMF0sIGVuZDogZXh0WzFdLCBibG9ja0lkOmJsay5ibG9ja0lkIH07XG4gICAgICBsZXQgdHIgPSB0aGlzLmFwcC50cmFuc2xhdG9yO1xuICAgICAgaWYoIGJsay5nZW5vbWUgIT09IHJnICkge1xuICAgICAgICAgLy8gdXNlciBpcyBicnVzaGluZyBhIGNvbXAgZ2Vub21lcyBzbyBmaXJzdCB0cmFuc2xhdGVcblx0IC8vIGNvb3JkaW5hdGVzIHRvIHJlZiBnZW5vbWVcblx0IGxldCBycyA9IHRoaXMuYXBwLnRyYW5zbGF0b3IudHJhbnNsYXRlKGJsay5nZW5vbWUsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgcmcpO1xuXHQgaWYgKHJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHQgciA9IHJzWzBdO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICAgci5ibG9ja0lkID0gcmcubmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBoYW5kbGVyIGZvciB0aGUgc3RhcnQgb2YgYSBicnVzaCBhY3Rpb24gYnkgdGhlIHVzZXIgb24gYSBibG9ja1xuICAgIGJiU3RhcnQgKGJsayxiRWx0KSB7XG4gICAgICB0aGlzLmJydXNoaW5nID0gYmxrO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBoYW5kbGVyIGZvciBicnVzaCBtb3Rpb24uIE1haW4gam9iIGlzIHRvIHJlZmxlY3QgdGhlIGJydXNoXG4gICAgLy8gaW4gcGFyYWxsZWwgYWNyb3NzIHRoZSBnZW5vbWVzIGluIHRoZSB2aWV3LiBUaGUgY3Vycm50IGJydXNoIGV4dGVudCBcbiAgICAvLyBpcyB0cmFuc2xhdGVkIChpZiBuZWNlc3NhcnkpIHRvIHJlZiBnZW5vbWUgc3BhY2UuIFRoZW4gdGhvc2VcbiAgICAvLyBjb29yZGluYXRlcyBhcmUgdHJhbnNsYXRlZCB0byBlYWNoIGNvbXBhcmlzb24gZ2Vub21lIHNwYWNlLCBhbmQgdGhlIGFwcHJvcHJpYXRlXG4gICAgLy8gYnJ1c2goZXMpIHVwZGF0ZWQuXG4gICAgLy9cbiAgICBiYkJydXNoICgpIHtcbiAgICAgIGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7IC8vIHRoZSByZWZlcmVuY2UgZ2Vub21lXG4gICAgICBsZXQgZ3MgPSBbcmddLmNvbmNhdCh0aGlzLmFwcC5jR2Vub21lcyk7IC8vIGFsbCB0aGUgZ2Vub21lcyBpbiB0aGUgdmlld1xuICAgICAgbGV0IHRyID0gdGhpcy5hcHAudHJhbnNsYXRvcjsgLy8gZm9yIHRyYW5zbGF0aW5nIGNvb3JkcyBiZXR3ZWVuIGdlbm9tZXNcbiAgICAgIGxldCBibGsgPSB0aGlzLmJydXNoaW5nOyAvLyB0aGUgYmxvY2sgY3VycmVubHkgYmVpbmcgYnJ1c2hlZFxuICAgICAgbGV0IHIgPSB0aGlzLmJiR2V0UmVmQ29vcmRzKCk7IC8vIGN1cnJlbnQgYnJ1c2ggZXh0ZW50LCBpbiByZWYgZ2Vub21lIHNwYWNlXG4gICAgICBncy5mb3JFYWNoKCBnID0+IHtcblx0ICAvLyBpZiBnIGlzIHRoZSByZWZHZW5vbWUsIG5vIG5lZWQgdG8gdHJhbnNsYXRlLiBPdGhlcndpc2UsIHRyYW5zbGF0ZSBmcm9tIFxuXHQgIC8vIHJlZiBnZW5vbWUgdG8gY29tcGFyaXNvbiBnZW5vbWUgZy5cbiAgICAgICAgICBsZXQgcnM7XG5cdCAgaWYgKGcgPT09IHJnKSB7XG5cdCAgICAgIHIuYmxvY2tJZCA9IHJnLm5hbWU7XG5cdCAgICAgIHJzID0gW3JdO1xuXHQgIH1cblx0ICBlbHNlIHtcblx0ICAgICAgcnMgPSB0ci50cmFuc2xhdGUocmcsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgZyk7XG5cdCAgfVxuXHQgIC8vIG5vdGUgdGhhdCB0cmFuc2xhdGVkIHJlc3VsdHMgaW5jbHVkZSBibG9jayBpZGVudGlmaWVycywgd2hpY2ggdGVsbFxuXHQgIC8vIHVzIHRoZSBibG9jayAoYW5kIGhlbmNlLCBicnVzaGVzKSBpbiB0aGUgZGlzcGxheSB0byB0YXJnZXQuXG5cdCAgcnMuZm9yRWFjaCggcnIgPT4ge1xuXHQgICAgICBsZXQgYmIgPSB0aGlzLnN2Z01haW4uc2VsZWN0KGAuem9vbVN0cmlwW25hbWU9XCIke2cubmFtZX1cIl0gLnNCbG9ja1tuYW1lPVwiJHtyci5ibG9ja0lkfVwiXSAuYnJ1c2hgKVxuXHQgICAgICBiYi5lYWNoKCBmdW5jdGlvbihiKSB7XG5cdCAgICAgICAgICBiLmJydXNoLmV4dGVudChbcnIuc3RhcnQsIHJyLmVuZF0pO1xuXHRcdCAgZDMuc2VsZWN0KHRoaXMpLmNhbGwoYi5icnVzaCk7XG5cdCAgICAgIH0pO1xuXHQgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJiRW5kICgpIHtcbiAgICAgIGxldCBzZSA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50O1xuICAgICAgbGV0IHh0ID0gdGhpcy5icnVzaGluZy5icnVzaC5leHRlbnQoKTtcbiAgICAgIGxldCByID0gdGhpcy5iYkdldFJlZkNvb3JkcygpO1xuICAgICAgdGhpcy5icnVzaGluZyA9IG51bGw7XG4gICAgICAvL1xuICAgICAgaWYgKHNlLmN0cmxLZXkgfHwgc2UuYWx0S2V5IHx8IHNlLm1ldGFLZXkpIHtcblx0ICB0aGlzLmNsZWFyQnJ1c2hlcygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vXG4gICAgICBsZXQgY2MgPSB0aGlzLmFwcC5jb29yZHM7IC8vIGN1cnJlbnQgY29vcmRpbmF0ZXNcbiAgICAgIGxldCBjdXJyV2lkdGggPSBjYy5lbmQgLSBjYy5zdGFydCArIDE7XG4gICAgICBsZXQgbWlkID0gKGNjLnN0YXJ0ICsgY2MuZW5kKS8yO1xuICAgICAgLy9cbiAgICAgIGlmIChNYXRoLmFicyh4dFswXSAtIHh0WzFdKSA8PSAxMCl7XG4gICAgICAgICAgLy8gdXNlciBjbGlja2VkIGluc3RlYWQgb2YgZHJhZ2dlZC4gUmVjZW50ZXIgdGhlIHZpZXcgb24gdGhlIGNsaWNrZWQgcG9pbnQuXG5cdCAgbGV0IGR4ICA9IHIuc3RhcnQgLSBtaWQ7XG5cdCAgdGhpcy5hcHAucGFuKGR4L2N1cnJXaWR0aCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcblx0ICAvLyB6b29tIGluIChubyBzaGlmdCBrZXkpIG9yIG91dCAoc2hpZnQga2V5KVxuXHQgIGxldCBicnVzaFdpZHRoID0gci5lbmQgLSByLnN0YXJ0ICsgMTtcblx0ICBsZXQgZmFjdG9yID0gYnJ1c2hXaWR0aCAvIGN1cnJXaWR0aDtcblx0ICB0aGlzLmFwcC56b29tKHNlLnNoaWZ0S2V5ID8gMS9mYWN0b3IgOiBmYWN0b3IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZ2hsaWdodFN0cmlwIChnLCBlbHQpIHtcblx0aWYgKGcgPT09IHRoaXMuY3VycmVudEhMRykgcmV0dXJuO1xuXHR0aGlzLmN1cnJlbnRITEcgPSBnO1xuXHQvL1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0QWxsKCcuem9vbVN0cmlwJylcblx0ICAgIC5jbGFzc2VkKFwiaGlnaGxpZ2h0ZWRcIiwgZCA9PiBkLmdlbm9tZSA9PT0gZyk7XG5cdHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoJy56b29tU3RyaXBIYW5kbGUnKVxuXHQgICAgLmNsYXNzZWQoXCJoaWdobGlnaHRlZFwiLCBkID0+IGQuZ2Vub21lID09PSBnKTtcblx0dGhpcy5hcHAuc2hvd0Jsb2NrcyhnKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIHRoZSBab29tVmlldyB0byBzaG93IHRoZSBnaXZlbiBjb29yZGluYXRlIHJhbmdlIGZyb20gdGhlIHJlZyBnZW5vbWUgYW5kIHRoZSBjb3JyZXNwb25kaW5nXG4gICAgLy8gcmFuZ2UocykgaW4gZWFjaCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIHVwZGF0ZVZpYU1hcHBlZENvb3JkaW5hdGVzIChjb29yZHMpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgYyA9IChjb29yZHMgfHwgdGhpcy5hcHAuY29vcmRzKTtcblx0ZDMuc2VsZWN0KFwiI3pvb21Db29yZHNcIilbMF1bMF0udmFsdWUgPSBmb3JtYXRDb29yZHMoYy5jaHIsIGMuc3RhcnQsIGMuZW5kKTtcblx0ZDMuc2VsZWN0KFwiI3pvb21XU2l6ZVwiKVswXVswXS52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSlcblx0Ly9cbiAgICAgICAgbGV0IG1ndiA9IHRoaXMuYXBwO1xuXHQvLyB3aGVuIHRoZSB0cmFuc2xhdG9yIGlzIHJlYWR5LCB3ZSBjYW4gdHJhbnNsYXRlIHRoZSByZWYgY29vcmRzIHRvIGVhY2ggZ2Vub21lIGFuZFxuXHQvLyBpc3N1ZSByZXF1ZXN0cyB0byBsb2FkIHRoZSBmZWF0dXJlcyBpbiB0aG9zZSByZWdpb25zLlxuXHRtZ3YudHJhbnNsYXRvci5yZWFkeSgpLnRoZW4oZnVuY3Rpb24oKXtcblx0ICAgIC8vIE5vdyBpc3N1ZSByZXF1ZXN0cyBmb3IgZmVhdHVyZXMuIE9uZSByZXF1ZXN0IHBlciBnZW5vbWUsIGVhY2ggcmVxdWVzdCBzcGVjaWZpZXMgb25lIG9yIG1vcmVcblx0ICAgIC8vIGNvb3JkaW5hdGUgcmFuZ2VzLlxuXHQgICAgLy8gV2FpdCBmb3IgYWxsIHRoZSBkYXRhIHRvIGJlY29tZSBhdmFpbGFibGUsIHRoZW4gZHJhdy5cblx0ICAgIC8vXG5cdCAgICBsZXQgcHJvbWlzZXMgPSBbXTtcblxuXHQgICAgLy8gRmlyc3QgcmVxdWVzdCBpcyBmb3IgdGhlIHRoZSByZWZlcmVuY2UgZ2Vub21lLiBHZXQgYWxsIHRoZSBmZWF0dXJlcyBpbiB0aGUgcmFuZ2UuXG5cdCAgICBwcm9taXNlcy5wdXNoKG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhtZ3Yuckdlbm9tZSwgW3tcblx0XHQvLyBOZWVkIHRvIHNpbXVsYXRlIHRoZSByZXN1bHRzIGZyb20gY2FsbGluZyB0aGUgdHJhbnNsYXRvci4gXG5cdFx0Ly8gXG5cdFx0Y2hyICAgIDogYy5jaHIsXG5cdFx0c3RhcnQgIDogYy5zdGFydCxcblx0XHRlbmQgICAgOiBjLmVuZCxcblx0XHRpbmRleCAgOiAwLFxuXHRcdGZDaHIgICA6IGMuY2hyLFxuXHRcdGZTdGFydCA6IGMuc3RhcnQsXG5cdFx0ZkVuZCAgIDogYy5lbmQsXG5cdFx0ZkluZGV4ICA6IDAsXG5cdFx0b3JpICAgIDogXCIrXCIsXG5cdFx0YmxvY2tJZDogbWd2LnJHZW5vbWUubmFtZVxuXHRcdH1dKSk7XG5cdCAgICBpZiAoISBzZWxmLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiKSkge1xuXHRcdC8vIEFkZCBhIHJlcXVlc3QgZm9yIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUsIHVzaW5nIHRyYW5zbGF0ZWQgY29vcmRpbmF0ZXMuIFxuXHRcdG1ndi5jR2Vub21lcy5mb3JFYWNoKGNHZW5vbWUgPT4ge1xuXHRcdCAgICBsZXQgcmFuZ2VzID0gbWd2LnRyYW5zbGF0b3IudHJhbnNsYXRlKCBtZ3Yuckdlbm9tZSwgYy5jaHIsIGMuc3RhcnQsIGMuZW5kLCBjR2Vub21lICk7XG5cdFx0ICAgIGxldCBwID0gbWd2LmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzKGNHZW5vbWUsIHJhbmdlcyk7XG5cdFx0ICAgIHByb21pc2VzLnB1c2gocCk7XG5cdFx0fSk7XG5cdCAgICB9XG5cdCAgICAvLyB3aGVuIGV2ZXJ5dGhpbmcgaXMgcmVhZHksIGNhbGwgdGhlIGRyYXcgZnVuY3Rpb25cblx0ICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCBkYXRhID0+IHtcblx0ICAgICAgICBzZWxmLmRyYXcoZGF0YSk7XG4gICAgICAgICAgICB9KTtcblx0fSk7XG4gICAgfVxuICAgIC8vIFVwZGF0ZXMgdGhlIFpvb21WaWV3IHRvIHNob3cgdGhlIHJlZ2lvbiBhcm91bmQgYSBsYW5kbWFyayBpbiBlYWNoIGdlbm9tZS5cbiAgICAvL1xuICAgIC8vIGNvb3JkcyA9IHtcbiAgICAvLyAgICAgbGFuZG1hcmsgOiBpZCBvZiBhIGZlYXR1cmUgdG8gdXNlIGFzIGEgcmVmZXJlbmNlXG4gICAgLy8gICAgIGZsYW5rfHdpZHRoIDogc3BlY2lmeSBvbmUgb2YgZmxhbmsgb3Igd2lkdGguIFxuICAgIC8vICAgICAgICAgZmxhbmsgPSBhbW91bnQgb2YgZmxhbmtpbmcgcmVnaW9uIChicCkgdG8gaW5jbHVkZSBhdCBib3RoIGVuZHMgb2YgdGhlIGxhbmRtYXJrLCBcbiAgICAvLyAgICAgICAgIHNvIHRoZSB0b3RhbCB2aWV3aW5nIHJlZ2lvbiA9IGZsYW5rICsgbGVuZ3RoKGxhbmRtYXJrKSArIGZsYW5rLlxuICAgIC8vICAgICAgICAgd2lkdGggPSB0b3RhbCB2aWV3aW5nIHJlZ2lvbiB3aWR0aC4gSWYgYm90aCB3aWR0aCBhbmQgZmxhbmsgYXJlIHNwZWNpZmllZCwgZmxhbmsgaXMgaWdub3JlZC5cbiAgICAvLyAgICAgZGVsdGEgOiBhbW91bnQgdG8gc2hpZnQgdGhlIHZpZXcgbGVmdC9yaWdodFxuICAgIC8vIH1cbiAgICAvLyBcbiAgICAvLyBUaGUgbGFuZG1hcmsgbXVzdCBleGlzdCBpbiB0aGUgY3VycmVudCByZWZlcmVuY2UgZ2Vub21lLiBcbiAgICAvL1xuICAgIHVwZGF0ZVZpYUxhbmRtYXJrQ29vcmRpbmF0ZXMgKGNvb3Jkcykge1xuXHRsZXQgYyA9IGNvb3Jkcztcblx0bGV0IG1ndiA9IHRoaXMuYXBwO1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCByZiA9IGNvb3Jkcy5sYW5kbWFya1JlZkZlYXQ7XG5cdGxldCBmZWF0cyA9IGNvb3Jkcy5sYW5kbWFya0ZlYXRzO1xuXHRsZXQgZGVsdGEgPSBjb29yZHMuZGVsdGEgfHwgMDtcblx0Ly8gY29tcHV0ZSByYW5nZXMgYXJvdW5kIGxhbmRtYXJrIGluIGVhY2ggZ2Vub21lXG5cdGxldCByYW5nZXMgPSBmZWF0cy5tYXAoZiA9PiB7XG5cdCAgICBsZXQgZmxhbmsgPSBjLmxlbmd0aCA/IChjLmxlbmd0aCAtIGYubGVuZ3RoKSAvIDIgOiBjLmZsYW5rO1xuXHQgICAgbGV0IHJhbmdlID0ge1xuXHRcdGdlbm9tZTpcdGYuZ2Vub21lLFxuXHRcdGNocjpcdGYuY2hyLFxuXHRcdHN0YXJ0Olx0TWF0aC5yb3VuZChmLnN0YXJ0IC0gZmxhbmsgKyBkZWx0YSksXG5cdFx0ZW5kOlx0TWF0aC5yb3VuZChmLmVuZCArIGZsYW5rICsgZGVsdGEpXG5cdCAgICB9IDtcblx0ICAgIGlmIChmLmdlbm9tZSA9PT0gbWd2LnJHZW5vbWUpIHtcblx0XHRsZXQgYyA9IHRoaXMuYXBwLmNvb3JkcyA9IHJhbmdlO1xuXHRcdGQzLnNlbGVjdChcIiN6b29tQ29vcmRzXCIpWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCk7XG5cdFx0ZDMuc2VsZWN0KFwiI3pvb21XU2l6ZVwiKVswXVswXS52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSlcblx0ICAgIH1cblx0ICAgIHJldHVybiByYW5nZTtcblx0fSk7XG5cdGxldCBzZWVuR2Vub21lcyA9IG5ldyBTZXQoKTtcblx0bGV0IHJDb29yZHM7XG5cdC8vIEdldCAocHJvbWlzZXMgZm9yKSB0aGUgZmVhdHVyZXMgaW4gZWFjaCByYW5nZS5cblx0bGV0IHByb21pc2VzID0gcmFuZ2VzLm1hcChyID0+IHtcbiAgICAgICAgICAgIGxldCBycnM7XG5cdCAgICBzZWVuR2Vub21lcy5hZGQoci5nZW5vbWUpO1xuXHQgICAgaWYgKHIuZ2Vub21lID09PSBtZ3Yuckdlbm9tZSl7XG5cdFx0Ly8gdGhlIHJlZiBnZW5vbWUgcmFuZ2Vcblx0XHRyQ29vcmRzID0gcjtcblx0ICAgICAgICBycnMgPSBbe1xuXHRcdCAgICBjaHIgICAgOiByLmNocixcblx0XHQgICAgc3RhcnQgIDogci5zdGFydCxcblx0XHQgICAgZW5kICAgIDogci5lbmQsXG5cdFx0ICAgIGluZGV4ICA6IDAsXG5cdFx0ICAgIGZDaHIgICA6IHIuY2hyLFxuXHRcdCAgICBmU3RhcnQgOiByLnN0YXJ0LFxuXHRcdCAgICBmRW5kICAgOiByLmVuZCxcblx0XHQgICAgZkluZGV4ICA6IDAsXG5cdFx0ICAgIG9yaSAgICA6IFwiK1wiLFxuXHRcdCAgICBibG9ja0lkOiBtZ3Yuckdlbm9tZS5uYW1lXG5cdFx0fV07XG5cdCAgICB9XG5cdCAgICBlbHNlIHsgXG5cdFx0Ly8gdHVybiB0aGUgc2luZ2xlIHJhbmdlIGludG8gYSByYW5nZSBmb3IgZWFjaCBvdmVybGFwcGluZyBzeW50ZW55IGJsb2NrIHdpdGggdGhlIHJlZiBnZW5vbWVcblx0ICAgICAgICBycnMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUoci5nZW5vbWUsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgbWd2LnJHZW5vbWUsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhyLmdlbm9tZSwgcnJzKTtcblx0fSk7XG5cdC8vIEZvciBlYWNoIGdlbm9tZSB3aGVyZSB0aGUgbGFuZG1hcmsgZG9lcyBub3QgZXhpc3QsIGNvbXB1dGUgYSBtYXBwZWQgcmFuZ2UgKGFzIGluIG1hcHBlZCBjbW9kZSkuXG5cdG1ndi5jR2Vub21lcy5mb3JFYWNoKGcgPT4ge1xuXHQgICAgaWYgKCEgc2Vlbkdlbm9tZXMuaGFzKGcpKSB7XG5cdFx0bGV0IHJycyA9IG1ndi50cmFuc2xhdG9yLnRyYW5zbGF0ZShtZ3Yuckdlbm9tZSwgckNvb3Jkcy5jaHIsIHJDb29yZHMuc3RhcnQsIHJDb29yZHMuZW5kLCBnKTtcblx0XHRwcm9taXNlcy5wdXNoKCBtZ3YuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXMoZywgcnJzKSApO1xuXHQgICAgfVxuXHR9KTtcblx0Ly8gV2hlbiBhbGwgdGhlIGRhdGEgaXMgcmVhZHksIGRyYXcuXG5cdFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCBkYXRhID0+IHtcblx0ICAgIHNlbGYuZHJhdyhkYXRhKTtcblx0fSk7XG4gICAgfVxuICAgIC8vXG4gICAgdXBkYXRlICgpIHtcblx0aWYgKHRoaXMuYXBwLmNtb2RlID09PSAnbWFwcGVkJylcblx0ICAgIHRoaXMudXBkYXRlVmlhTWFwcGVkQ29vcmRpbmF0ZXModGhpcy5hcHAuY29vcmRzKTtcblx0ZWxzZVxuXHQgICAgdGhpcy51cGRhdGVWaWFMYW5kbWFya0Nvb3JkaW5hdGVzKHRoaXMuYXBwLmxjb29yZHMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIG9yZGVyU0Jsb2NrcyAoc2Jsb2Nrcykge1xuXHQvLyBTb3J0IHRoZSBzYmxvY2tzIGluIGVhY2ggc3RyaXAgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IGRyYXdpbmcgbW9kZS5cblx0bGV0IGNtcEZpZWxkID0gdGhpcy5kbW9kZSA9PT0gJ2NvbXBhcmlzb24nID8gJ2luZGV4JyA6ICdmSW5kZXgnO1xuXHRsZXQgY21wRnVuYyA9IChhLGIpID0+IGEuX19kYXRhX19bY21wRmllbGRdLWIuX19kYXRhX19bY21wRmllbGRdO1xuXHRzYmxvY2tzLmZvckVhY2goIHN0cmlwID0+IHN0cmlwLnNvcnQoIGNtcEZ1bmMgKSApO1xuXHQvLyBwaXhlbHMgcGVyIGJhc2Vcblx0bGV0IHBwYiA9IHRoaXMud2lkdGggLyAodGhpcy5hcHAuY29vcmRzLmVuZCAtIHRoaXMuYXBwLmNvb3Jkcy5zdGFydCArIDEpO1xuXHRsZXQgcHN0YXJ0ID0gW107IC8vIG9mZnNldCAoaW4gcGl4ZWxzKSBvZiBzdGFydCBwb3NpdGlvbiBvZiBuZXh0IGJsb2NrLCBieSBzdHJpcCBpbmRleCAoMD09PXJlZilcblx0bGV0IGJzdGFydCA9IFtdOyAvLyBibG9jayBzdGFydCBwb3MgKGluIGJwKSBhc3NvYyB3aXRoIHBzdGFydFxuXHRsZXQgY2NociA9IG51bGw7XG5cdGxldCBzZWxmID0gdGhpcztcblx0bGV0IGR4O1xuXHRsZXQgcGVuZDtcblx0c2Jsb2Nrcy5lYWNoKCBmdW5jdGlvbiAoYixpLGopIHsgLy8gYj1ibG9jaywgaT1pbmRleCB3aXRoaW4gc3RyaXAsIGo9c3RyaXAgaW5kZXhcblx0ICAgIGxldCBibGVuID0gcHBiICogKGIuZW5kIC0gYi5zdGFydCArIDEpOyAvLyB0b3RhbCBzY3JlZW4gd2lkdGggb2YgdGhpcyBzYmxvY2tcblx0ICAgIGIuZmxpcCA9IGIub3JpID09PSAnLScgJiYgc2VsZi5kbW9kZSA9PT0gJ3JlZmVyZW5jZSc7XG5cdCAgICBiLnhzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbYi5zdGFydCwgYi5lbmRdKS5yYW5nZSggYi5mbGlwID8gW2JsZW4sIDBdIDogWzAsIGJsZW5dICk7XG5cdCAgICAvL1xuXHQgICAgaWYgKGk9PT0wKSB7XG5cdFx0Ly8gZmlyc3QgYmxvY2sgaW4gZWFjaCBzdHJpcCBpbml0c1xuXHRcdHBzdGFydFtqXSA9IDA7XG5cdFx0YnN0YXJ0W2pdID0gYi5zdGFydDtcblx0XHRkeCA9IDA7XG5cdFx0Y2NociA9IGIuY2hyO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0ZHggPSBiLmNociA9PT0gY2NociA/IHBzdGFydFtqXSArIHBwYiAqIChiLnN0YXJ0IC0gYnN0YXJ0W2pdKSA6IEluZmluaXR5O1xuXHRcdGlmIChkeCA+IHNlbGYud2lkdGgpIHtcblx0XHQgICAgLy8gQ2hhbmdlZCBjaHIgb3IganVtcGVkIGEgbGFyZ2UgZ2FwXG5cdFx0ICAgIHBzdGFydFtqXSA9IHBlbmQgKyA2O1xuXHRcdCAgICBic3RhcnRbal0gPSBiLnN0YXJ0O1xuXHRcdCAgICBkeCA9IHBzdGFydFtqXTtcblx0XHR9XG5cdCAgICB9XG5cdCAgICBkMy5zZWxlY3QodGhpcykuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7ZHh9LDApYCk7XG5cdCAgICBwZW5kID0gZHggKyBibGVuO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgem9vbSB2aWV3IHBhbmVsIHdpdGggdGhlIGdpdmVuIGRhdGEuXG4gICAgLy9cbiAgICAvLyBEYXRhIGlzIHN0cnVjdHVyZWQgYXMgZm9sbG93czpcbiAgICAvLyAgICAgZGF0YSA9IFsgem9vbVN0cmlwX2RhdGEgXVxuICAgIC8vICAgICB6b29tU3RyaXBfZGF0YSA9IHsgZ2Vub21lIFsgem9vbUJsb2NrX2RhdGEgXSB9XG4gICAgLy8gICAgIHpvb21CbG9ja19kYXRhID0geyB4c2NhbGUsIGNociwgc3RhcnQsIGVuZCwgZkNociwgZlN0YXJ0LCBmRW5kLCBvcmksIFsgZmVhdHVyZV9kYXRhIF0gfVxuICAgIC8vICAgICBmZWF0dXJlX2RhdGEgPSB7IG1ncGlkLCBtZ2lpZCwgc3ltYm9sLCBjaHIsIHN0YXJ0LCBlbmQsIHN0cmFuZCwgdHlwZSwgYmlvdHlwZSB9XG4gICAgLy9cbiAgICAvLyBBZ2FpbiwgaW4gRW5nbGlzaDpcbiAgICAvLyAgLSBkYXRhIGlzIGEgbGlzdCBvZiBpdGVtcywgb25lIHBlciBzdHJpcCB0byBiZSBkaXNwbGF5ZWQuIEl0ZW1bMF0gaXMgZGF0YSBmb3IgdGhlIHJlZiBnZW5vbWUuXG4gICAgLy8gICAgSXRlbXNbMStdIGFyZSBkYXRhIGZvciB0aGUgY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy8gIC0gZWFjaCBzdHJpcCBpdGVtIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGEgZ2Vub21lIGFuZCBhIGxpc3Qgb2YgYmxvY2tzLiBJdGVtWzBdIGFsd2F5cyBoYXMgXG4gICAgLy8gICAgYSBzaW5nbGUgYmxvY2suXG4gICAgLy8gIC0gZWFjaCBibG9jayBpcyBhbiBvYmplY3QgY29udGFpbmluZyBhIGNocm9tb3NvbWUsIHN0YXJ0LCBlbmQsIG9yaWVudGF0aW9uLCBldGMsIGFuZCBhIGxpc3Qgb2YgZmVhdHVyZXMuXG4gICAgLy8gIC0gZWFjaCBmZWF0dXJlIGhhcyBjaHIsc3RhcnQsZW5kLHN0cmFuZCx0eXBlLGJpb3R5cGUsbWdwaWRcbiAgICAvL1xuICAgIGRyYXcgKGRhdGEpIHtcblx0Ly8gXG5cdGxldCBzZWxmID0gdGhpcztcblxuXHRsZXQgY2xvc2VkID0gdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIik7XG5cblx0Ly8gcmVzZXQgdGhlIHN2ZyBzaXplIGJhc2VkIG9uIG51bWJlciBvZiBzdHJpcHNcblx0bGV0IHRvdGFsSGVpZ2h0ID0gKHRoaXMuc3RyaXBIZWlnaHQrdGhpcy5zdHJpcEdhcCkgKiBkYXRhLmxlbmd0aCArIDEyO1xuXHR0aGlzLnN2Z1xuXHQgICAgLmF0dHIoXCJoZWlnaHRcIiwgdG90YWxIZWlnaHQpO1xuXG5cdC8vIERyYXcgdGhlIHRpdGxlIG9uIHRoZSB6b29tdmlldyBwb3NpdGlvbiBjb250cm9sc1xuXHRkMy5zZWxlY3QoXCIjem9vbVZpZXcgLnpvb21Db29yZHMgbGFiZWxcIilcblx0ICAgIC50ZXh0KGRhdGFbMF0uZ2Vub21lLmxhYmVsICsgXCIgY29vcmRzXCIpO1xuXHRcblx0Ly8gdGhlIHJlZmVyZW5jZSBnZW5vbWUgYmxvY2sgKGFsd2F5cyBqdXN0IDEgb2YgdGhlc2UpLlxuXHRsZXQgckJsb2NrID0gZGF0YVswXS5ibG9ja3NbMF07XG5cblx0Ly8geC1zY2FsZSBhbmQgeC1heGlzIGJhc2VkIG9uIHRoZSByZWYgZ2Vub21lIGRhdGEuXG5cdHRoaXMueHNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0ICAgIC5kb21haW4oW3JCbG9jay5zdGFydCxyQmxvY2suZW5kXSlcblx0ICAgIC5yYW5nZShbMCx0aGlzLndpZHRoXSk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gZHJhdyB0aGUgYXhpc1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHR0aGlzLmF4aXNGdW5jID0gZDMuc3ZnLmF4aXMoKVxuXHQgICAgLnNjYWxlKHRoaXMueHNjYWxlKVxuXHQgICAgLm9yaWVudChcInRvcFwiKVxuXHQgICAgLm91dGVyVGlja1NpemUoMClcblx0ICAgIC50aWNrcyg1KVxuXHQgICAgO1xuXHR0aGlzLmF4aXMuY2FsbCh0aGlzLmF4aXNGdW5jKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyB6b29tIHN0cmlwcyAob25lIHBlciBnZW5vbWUpXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGxldCB6c3RyaXBzID0gdGhpcy5zdHJpcHNHcnBcblx0ICAgICAgICAuc2VsZWN0QWxsKFwiZy56b29tU3RyaXBcIilcblx0XHQuZGF0YShkYXRhLCBkID0+IGQuZ2Vub21lLm5hbWUpO1xuXHRsZXQgbmV3enMgPSB6c3RyaXBzLmVudGVyKClcblx0ICAgICAgICAuYXBwZW5kKFwiZ1wiKVxuXHRcdC5hdHRyKFwiY2xhc3NcIixcInpvb21TdHJpcFwiKVxuXHRcdC5hdHRyKFwibmFtZVwiLCBkID0+IGQuZ2Vub21lLm5hbWUpXG5cdFx0Lm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGcpIHtcblx0XHQgICAgc2VsZi5oaWdobGlnaHRTdHJpcChnLmdlbm9tZSwgdGhpcyk7XG5cdFx0fSlcblx0XHQuY2FsbCh0aGlzLmRyYWdnZXIpXG5cdFx0O1xuXHRuZXd6cy5hcHBlbmQoXCJ0ZXh0XCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgXCJnZW5vbWVMYWJlbFwiKVxuXHQgICAgLnRleHQoIGQgPT4gZC5nZW5vbWUubGFiZWwpXG5cdCAgICAuYXR0cihcInhcIiwgMClcblx0ICAgIC5hdHRyKFwieVwiLCB0aGlzLmJsb2NrSGVpZ2h0LzIgKyAyMClcblx0ICAgIC5hdHRyKFwiZm9udC1mYW1pbHlcIixcInNhbnMtc2VyaWZcIilcblx0ICAgIC5hdHRyKFwiZm9udC1zaXplXCIsIDEwKVxuXHQgICAgO1xuXHRuZXd6cy5hcHBlbmQoXCJnXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgXCJzQmxvY2tzXCIpO1xuXHRuZXd6cy5hcHBlbmQoXCJyZWN0XCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgXCJ6b29tU3RyaXBIYW5kbGVcIilcblx0ICAgIC5hdHRyKFwieFwiLCAtMTUpXG5cdCAgICAuYXR0cihcInlcIiwgLXRoaXMuYmxvY2tIZWlnaHQgLyAyKVxuXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCAxNSlcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMuYmxvY2tIZWlnaHQpXG5cdCAgICA7XG5cblx0enN0cmlwc1xuXHQgICAgLmNsYXNzZWQoXCJyZWZlcmVuY2VcIiwgZCA9PiBkLmdlbm9tZSA9PT0gdGhpcy5hcHAuckdlbm9tZSlcblx0ICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGcgPT4gYHRyYW5zbGF0ZSgwLCR7Y2xvc2VkID8gdGhpcy50b3BPZmZzZXQgOiBnLmdlbm9tZS56b29tWX0pYClcblx0ICAgIDtcblxuICAgICAgICB6c3RyaXBzLmV4aXQoKVxuXHQgICAgLm9uKFwiLmRyYWdcIiwgbnVsbClcblx0ICAgIC5yZW1vdmUoKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBzeW50ZW55IGJsb2Nrcy4gRWFjaCB6b29tIHN0cmlwIGhhcyBhIGxpc3Qgb2YgMSBvciBtb3JlIHNibG9ja3MuXG5cdC8vIFRoZSByZWZlcmVuY2UgZ2Vub21lIGFsd2F5cyBoYXMganVzdCAxLiBUaGUgY29tcCBnZW5vbWVzIG1hbnkgaGF2ZVxuXHQvLyAxIG9yIG1vcmUgKGFuZCBpbiByYXJlIGNhc2VzLCAwKS5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0bGV0IHVuaXFpZnkgPSBibG9ja3MgPT4ge1xuXHQgICAgLy8gaGVscGVyIGZ1bmN0aW9uLiBXaGVuIHNibG9jayByZWxhdGlvbnNoaXAgYmV0d2VlbiBnZW5vbWVzIGlzIGNvbmZ1c2VkLCByZXF1ZXN0aW5nIG9uZVxuXHQgICAgLy8gcmVnaW9uIGluIGdlbm9tZSBBIGNhbiBlbmQgdXAgcmVxdWVzdGluZyB0aGUgc2FtZSByZWdpb24gaW4gZ2Vub21lIEIgdHdpY2UuIFRoaXMgZnVuY3Rpb25cblx0ICAgIC8vIGF2b2lkcyBkcmF3aW5nIHRoZSBzYW1lIHNibG9jayB0d2ljZS4gKE5COiBSZWFsbHkgbm90IHN1cmUgd2hlcmUgdGhpcyBjaGVjayBpcyBiZXN0IGRvbmUuXG5cdCAgICAvLyBDb3VsZCBwdXNoIGl0IGZhcnRoZXIgdXBzdHJlYW0uKVxuXHQgICAgbGV0IHNlZW4gPSBuZXcgU2V0KCk7XG5cdCAgICByZXR1cm4gYmxvY2tzLmZpbHRlciggYiA9PiB7IFxuXHQgICAgICAgIGlmIChzZWVuLmhhcyhiLmluZGV4KSkgcmV0dXJuIGZhbHNlO1xuXHRcdHNlZW4uYWRkKGIuaW5kZXgpO1xuXHRcdHJldHVybiB0cnVlO1xuXHQgICAgfSk7XG5cdH07XG4gICAgICAgIGxldCBzYmxvY2tzID0genN0cmlwcy5zZWxlY3QoJ1tuYW1lPVwic0Jsb2Nrc1wiXScpLnNlbGVjdEFsbCgnZy5zQmxvY2snKVxuXHQgICAgLmRhdGEoZCA9PiB7XG5cdCAgICAgICAgcmV0dXJuIHVuaXFpZnkoZC5ibG9ja3MpO1xuXHQgICAgfSwgYiA9PiBiLmJsb2NrSWQpO1xuXHRsZXQgbmV3c2JzID0gc2Jsb2Nrcy5lbnRlcigpXG5cdCAgICAuYXBwZW5kKFwiZ1wiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBiID0+IFwic0Jsb2NrIFwiICsgXG5cdCAgICAgICAgKGIub3JpPT09XCIrXCIgPyBcInBsdXNcIiA6IGIub3JpPT09XCItXCIgPyBcIm1pbnVzXCI6IFwiY29uZnVzZWRcIikgKyBcblx0XHQoYi5jaHIgIT09IGIuZkNociA/IFwiIHRyYW5zbG9jYXRpb25cIiA6IFwiXCIpKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGI9PmIuaW5kZXgpXG5cdCAgICA7XG5cdGxldCBsMCA9IG5ld3Nicy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsIFwibGF5ZXIwXCIpO1xuXHRsZXQgbDEgPSBuZXdzYnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLCBcImxheWVyMVwiKTtcblxuXHQvLyByZWN0YW5nbGUgZm9yIHRoZSB3aG9sZSBibG9ja1xuXHRsMC5hcHBlbmQoXCJyZWN0XCIpLmF0dHIoXCJjbGFzc1wiLCBcImJsb2NrXCIpO1xuXHQvLyB0aGUgYXhpcyBsaW5lXG5cdGwwLmFwcGVuZChcImxpbmVcIikuYXR0cihcImNsYXNzXCIsXCJheGlzXCIpIDtcblx0Ly8gbGFiZWxcblx0bDAuYXBwZW5kKFwidGV4dFwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwiYmxvY2tMYWJlbFwiKSA7XG5cdC8vIGJydXNoXG5cdGwwLmFwcGVuZChcImdcIikuYXR0cihcImNsYXNzXCIsXCJicnVzaFwiKTtcblxuXHRzYmxvY2tzLmV4aXQoKS5yZW1vdmUoKTtcblxuXHR0aGlzLm9yZGVyU0Jsb2NrcyhzYmxvY2tzKTtcblxuXHQvLyBzeW50ZW55IGJsb2NrIGxhYmVsc1xuXHRzYmxvY2tzLnNlbGVjdChcInRleHQuYmxvY2tMYWJlbFwiKVxuXHQgICAgLnRleHQoIGIgPT4gYi5jaHIgKVxuXHQgICAgLmF0dHIoXCJ4XCIsIGIgPT4gKGIueHNjYWxlKGIuc3RhcnQpICsgYi54c2NhbGUoYi5lbmQpKS8yIClcblx0ICAgIC5hdHRyKFwieVwiLCB0aGlzLmJsb2NrSGVpZ2h0IC8gMiArIDEwKVxuXHQgICAgO1xuXG5cdC8vIHN5bnRlbnkgYmxvY2sgcmVjdHNcblx0c2Jsb2Nrcy5zZWxlY3QoXCJyZWN0LmJsb2NrXCIpXG5cdCAgLmF0dHIoXCJ4XCIsICAgICBiID0+IGIueHNjYWxlKGIuZmxpcCA/IGIuZW5kIDogYi5zdGFydCkpXG5cdCAgLmF0dHIoXCJ5XCIsICAgICBiID0+IC10aGlzLmJsb2NrSGVpZ2h0IC8gMilcblx0ICAuYXR0cihcIndpZHRoXCIsIGIgPT4gTWF0aC5hYnMoYi54c2NhbGUoYi5lbmQpLWIueHNjYWxlKGIuc3RhcnQpKSlcblx0ICAuYXR0cihcImhlaWdodFwiLHRoaXMuYmxvY2tIZWlnaHQpO1xuXG5cdC8vIHN5bnRlbnkgYmxvY2sgYXhpcyBsaW5lc1xuXHRzYmxvY2tzLnNlbGVjdChcImxpbmUuYXhpc1wiKVxuXHQgICAgLmF0dHIoXCJ4MVwiLCBiID0+IGIueHNjYWxlLnJhbmdlKClbMF0pXG5cdCAgICAuYXR0cihcInkxXCIsIDApXG5cdCAgICAuYXR0cihcIngyXCIsIGIgPT4gYi54c2NhbGUucmFuZ2UoKVsxXSlcblx0ICAgIC5hdHRyKFwieTJcIiwgMClcblx0ICAgIDtcblxuXHQvLyBicnVzaFxuXHRzYmxvY2tzLnNlbGVjdChcImcuYnJ1c2hcIilcblx0ICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGIgPT4gYHRyYW5zbGF0ZSgwLCR7dGhpcy5ibG9ja0hlaWdodCAvIDJ9KWApXG5cdCAgICAuZWFjaChmdW5jdGlvbihiKSB7XG5cdFx0aWYgKCFiLmJydXNoKSB7XG5cdFx0ICAgIGIuYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxuXHRcdFx0Lm9uKFwiYnJ1c2hzdGFydFwiLCBmdW5jdGlvbigpeyBzZWxmLmJiU3RhcnQoIGIsIHRoaXMgKTsgfSlcblx0XHRcdC5vbihcImJydXNoXCIsICAgICAgZnVuY3Rpb24oKXsgc2VsZi5iYkJydXNoKCBiLCB0aGlzICk7IH0pXG5cdFx0XHQub24oXCJicnVzaGVuZFwiLCAgIGZ1bmN0aW9uKCl7IHNlbGYuYmJFbmQoIGIsIHRoaXMgKTsgfSlcblx0XHR9XG5cdFx0Yi5icnVzaC54KGIueHNjYWxlKS5jbGVhcigpO1xuXHRcdGQzLnNlbGVjdCh0aGlzKS5jYWxsKGIuYnJ1c2gpO1xuXHQgICAgfSlcblx0ICAgIC5zZWxlY3RBbGwoXCJyZWN0XCIpXG5cdFx0LmF0dHIoXCJoZWlnaHRcIiwgMTApO1xuXG5cdHRoaXMuZHJhd0ZlYXR1cmVzKHNibG9ja3MpO1xuXG5cdC8vXG5cdHRoaXMuYXBwLmZhY2V0TWFuYWdlci5hcHBseUFsbCgpO1xuXG5cdC8vIFdlIG5lZWQgdG8gbGV0IHRoZSB2aWV3IHJlbmRlciBiZWZvcmUgZG9pbmcgdGhlIGhpZ2hsaWdodGluZywgc2luY2UgaXQgZGVwZW5kcyBvblxuXHQvLyB0aGUgcG9zaXRpb25zIG9mIHJlY3RhbmdsZXMgaW4gdGhlIHNjZW5lLlxuXHR3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG5cdCAgICAvL3RoaXMuc2V0R2Vub21lWU9yZGVyKCB0aGlzLmdlbm9tZXMubWFwKGcgPT4gZy5uYW1lKSApO1xuXHQgICAgLy93aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLmhpZ2hsaWdodCgpLCA1MCk7XG5cdCAgICB0aGlzLmhpZ2hsaWdodCgpO1xuXHR9LCA1MCk7XG4gICAgfTtcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSBmZWF0dXJlcyAocmVjdGFuZ2xlcykgZm9yIHRoZSBzcGVjaWZpZWQgc3ludGVueSBibG9ja3MuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgc2Jsb2NrcyAoRDMgc2VsZWN0aW9uIG9mIGcuc2Jsb2NrIG5vZGVzKSAtIG11bHRpbGV2ZWwgc2VsZWN0aW9uLlxuICAgIC8vICAgICAgICBBcnJheSAoY29ycmVzcG9uZGluZyB0byBzdHJpcHMpIG9mIGFycmF5cyBvZiBzeW50ZW55IGJsb2Nrcy5cbiAgICAvL1xuICAgIGRyYXdGZWF0dXJlcyAoc2Jsb2Nrcykge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdC8vXG5cdC8vIG5ldmVyIGRyYXcgdGhlIHNhbWUgZmVhdHVyZSB0d2ljZVxuXHRsZXQgZHJhd24gPSBuZXcgU2V0KCk7XHQvLyBzZXQgb2YgbWdwaWRzIG9mIGRyYXduIGZlYXR1cmVzXG5cdGxldCBmaWx0ZXJEcmF3biA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICAvLyByZXR1cm5zIHRydWUgaWYgd2UndmUgbm90IHNlZW4gdGhpcyBvbmUgYmVmb3JlLlxuXHQgICAgLy8gcmVnaXN0ZXJzIHRoYXQgd2UndmUgc2VlbiBpdC5cblx0ICAgIGxldCBmaWQgPSBmLm1ncGlkO1xuXHQgICAgbGV0IHYgPSAhIGRyYXduLmhhcyhmaWQpO1xuXHQgICAgZHJhd24uYWRkKGZpZCk7XG5cdCAgICByZXR1cm4gdjtcblx0fTtcblx0bGV0IGZlYXRzID0gc2Jsb2Nrcy5zZWxlY3QoJ1tuYW1lPVwibGF5ZXIxXCJdJykuc2VsZWN0QWxsKFwiLmZlYXR1cmVcIilcblx0ICAgIC5kYXRhKGQ9PmQuZmVhdHVyZXMuZmlsdGVyKGZpbHRlckRyYXduKSwgZD0+ZC5tZ3BpZCk7XG5cdGZlYXRzLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0bGV0IG5ld0ZlYXRzID0gZmVhdHMuZW50ZXIoKS5hcHBlbmQoXCJyZWN0XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsIGYgPT4gXCJmZWF0dXJlXCIgKyAoZi5zdHJhbmQ9PT1cIi1cIiA/IFwiIG1pbnVzXCIgOiBcIiBwbHVzXCIpKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGYgPT4gZi5tZ3BpZClcblx0ICAgIC5zdHlsZShcImZpbGxcIiwgZiA9PiBzZWxmLmFwcC5jc2NhbGUoZi5nZXRNdW5nZWRUeXBlKCkpKVxuXHQgICAgO1xuXG5cdC8vIGRyYXcgdGhlIHJlY3RhbmdsZXNcblxuXHQvLyByZXR1cm5zIHRoZSBzeW50ZW55IGJsb2NrIGNvbnRhaW5pbmcgdGhpcyBmZWF0dXJlXG5cdGxldCBmQmxvY2sgPSBmdW5jdGlvbiAoZmVhdEVsdCkge1xuXHQgICAgbGV0IGJsa0VsdCA9IGZlYXRFbHQucGFyZW50Tm9kZTtcblx0ICAgIHJldHVybiBibGtFbHQuX19kYXRhX187XG5cdH1cblx0bGV0IGZ4ID0gZnVuY3Rpb24oZikge1xuXHQgICAgbGV0IGIgPSBmQmxvY2sodGhpcyk7XG5cdCAgICByZXR1cm4gYi54c2NhbGUoTWF0aC5tYXgoZi5zdGFydCxiLnN0YXJ0KSlcblx0fTtcblx0bGV0IGZ3ID0gZnVuY3Rpb24gKGYpIHtcblx0ICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgcmV0dXJuIE1hdGguYWJzKGIueHNjYWxlKE1hdGgubWluKGYuZW5kLGIuZW5kKSkgLSBiLnhzY2FsZShNYXRoLm1heChmLnN0YXJ0LGIuc3RhcnQpKSkgKyAxO1xuXHR9O1xuXHRsZXQgZnkgPSBmdW5jdGlvbiAoZikge1xuXHQgICAgICAgbGV0IGIgPSBmQmxvY2sodGhpcyk7XG5cdCAgICAgICBpZiAoZi5zdHJhbmQgPT0gXCIrXCIpe1xuXHRcdCAgIGlmIChiLmZsaXApIFxuXHRcdCAgICAgICByZXR1cm4gc2VsZi5sYW5lSGVpZ2h0KmYubGFuZSAtIHNlbGYuZmVhdEhlaWdodDsgXG5cdFx0ICAgZWxzZSBcblx0XHQgICAgICAgcmV0dXJuIC1zZWxmLmxhbmVIZWlnaHQqZi5sYW5lO1xuXHQgICAgICAgfVxuXHQgICAgICAgZWxzZSB7XG5cdFx0ICAgLy8gZi5sYW5lIGlzIG5lZ2F0aXZlIGZvciBcIi1cIiBzdHJhbmRcblx0XHQgICBpZiAoYi5mbGlwKSBcblx0XHQgICAgICAgcmV0dXJuIHNlbGYubGFuZUhlaWdodCpmLmxhbmU7XG5cdFx0ICAgZWxzZVxuXHRcdCAgICAgICByZXR1cm4gLXNlbGYubGFuZUhlaWdodCpmLmxhbmUgLSBzZWxmLmZlYXRIZWlnaHQ7IFxuXHQgICAgICAgfVxuXHQgICB9O1xuXG5cdGZlYXRzXG5cdCAgLmF0dHIoXCJ4XCIsIGZ4KVxuXHQgIC5hdHRyKFwid2lkdGhcIiwgZncpXG5cdCAgLmF0dHIoXCJ5XCIsIGZ5KVxuXHQgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMuZmVhdEhlaWdodClcblx0ICA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyBmZWF0dXJlIGhpZ2hsaWdodGluZyBpbiB0aGUgY3VycmVudCB6b29tIHZpZXcuXG4gICAgLy8gRmVhdHVyZXMgdG8gYmUgaGlnaGxpZ2h0ZWQgaW5jbHVkZSB0aG9zZSBpbiB0aGUgaGlGZWF0cyBsaXN0IHBsdXMgdGhlIGZlYXR1cmVcbiAgICAvLyBjb3JyZXNwb25kaW5nIHRvIHRoZSByZWN0YW5nbGUgYXJndW1lbnQsIGlmIGdpdmVuLiAoVGhlIG1vdXNlb3ZlciBmZWF0dXJlLilcbiAgICAvL1xuICAgIC8vIERyYXdzIGZpZHVjaWFscyBmb3IgZmVhdHVyZXMgaW4gdGhpcyBsaXN0IHRoYXQ6XG4gICAgLy8gMS4gb3ZlcmxhcCB0aGUgY3VycmVudCB6b29tVmlldyBjb29yZCByYW5nZVxuICAgIC8vIDIuIGFyZSBub3QgcmVuZGVyZWQgaW52aXNpYmxlIGJ5IGN1cnJlbnQgZmFjZXQgc2V0dGluZ3NcbiAgICAvL1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgY3VycmVudCAocmVjdCBlbGVtZW50KSBPcHRpb25hbC4gQWRkJ2wgcmVjdGFuZ2xlIGVsZW1lbnQsIGUuZy4sIHRoYXQgd2FzIG1vdXNlZC1vdmVyLiBIaWdobGlnaHRpbmdcbiAgICAvLyAgICAgICAgd2lsbCBpbmNsdWRlIHRoZSBmZWF0dXJlIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyByZWN0IGFsb25nIHdpdGggdGhvc2UgaW4gdGhlIGhpZ2hsaWdodCBsaXN0LlxuICAgIC8vICAgIHB1bHNlQ3VycmVudCAoYm9vbGVhbikgSWYgdHJ1ZSBhbmQgY3VycmVudCBpcyBnaXZlbiwgY2F1c2UgaXQgdG8gcHVsc2UgYnJpZWZseS5cbiAgICAvL1xuICAgIGhpZ2hsaWdodCAoY3VycmVudCwgcHVsc2VDdXJyZW50KSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0Ly8gY3VycmVudCBmZWF0dXJlXG5cdGxldCBjdXJyRmVhdCA9IGN1cnJlbnQgPyAoY3VycmVudCBpbnN0YW5jZW9mIEZlYXR1cmUgPyBjdXJyZW50IDogY3VycmVudC5fX2RhdGFfXykgOiBudWxsO1xuXHQvLyBjcmVhdGUgbG9jYWwgY29weSBvZiBoaUZlYXRzLCB3aXRoIGN1cnJlbnQgZmVhdHVyZSBhZGRlZFxuXHRsZXQgaGlGZWF0cyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuaGlGZWF0cyk7XG5cdGlmIChjdXJyRmVhdCkge1xuXHQgICAgaGlGZWF0c1tjdXJyRmVhdC5pZF0gPSBjdXJyRmVhdC5pZDtcblx0fVxuXG5cdC8vIEZpbHRlciBhbGwgZmVhdHVyZXMgKHJlY3RhbmdsZXMpIGluIHRoZSBzY2VuZSBmb3IgdGhvc2UgYmVpbmcgaGlnaGxpZ2h0ZWQuXG5cdC8vIEFsb25nIHRoZSB3YXksIGJ1aWxkIGluZGV4IG1hcHBpbmcgZmVhdHVyZSBpZCB0byBpdHMgXCJzdGFja1wiIG9mIGVxdWl2YWxlbnQgZmVhdHVyZXMsXG5cdC8vIGkuZS4gYSBsaXN0IG9mIGl0cyBnZW5vbG9ncyBzb3J0ZWQgYnkgeSBjb29yZGluYXRlLlxuXHQvLyBBbHNvLCBtYWtlIGVhY2ggaGlnaGxpZ2h0ZWQgZmVhdHVyZSB0YWxsZXIgKHNvIGl0IHN0YW5kcyBhYm92ZSBpdHMgbmVpZ2hib3JzKVxuXHQvLyBhbmQgZ2l2ZSBpdCB0aGUgXCIuaGlnaGxpZ2h0XCIgY2xhc3MuXG5cdC8vXG5cdGxldCBzdGFja3MgPSB7fTsgLy8gZmlkIC0+IFsgcmVjdHMgXSBcblx0bGV0IGRoID0gdGhpcy5ibG9ja0hlaWdodC8yIC0gdGhpcy5mZWF0SGVpZ2h0O1xuICAgICAgICBsZXQgZmVhdHMgPSB0aGlzLnN2Z01haW4uc2VsZWN0QWxsKFwiLmZlYXR1cmVcIilcblx0ICAvLyBmaWx0ZXIgcmVjdC5mZWF0dXJlcyBmb3IgdGhvc2UgaW4gdGhlIGhpZ2hsaWdodCBsaXN0XG5cdCAgLmZpbHRlcihmdW5jdGlvbihmZil7XG5cdCAgICAgIC8vIGhpZ2hsaWdodCBmZiBpZiBlaXRoZXIgaWQgaXMgaW4gdGhlIGxpc3QgQU5EIGl0J3Mgbm90IGJlZW4gaGlkZGVuXG5cdCAgICAgIGxldCBtZ2kgPSBoaUZlYXRzW2ZmLm1naWlkXTtcblx0ICAgICAgbGV0IG1ncCA9IGhpRmVhdHNbZmYubWdwaWRdO1xuXHQgICAgICBsZXQgc2hvd2luZyA9IGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcImRpc3BsYXlcIikgIT09IFwibm9uZVwiO1xuXHQgICAgICBsZXQgaGwgPSBzaG93aW5nICYmIChtZ2kgfHwgbWdwKTtcblx0ICAgICAgaWYgKGhsKSB7XG5cdFx0ICAvLyBmb3IgZWFjaCBoaWdobGlnaHRlZCBmZWF0dXJlLCBhZGQgaXRzIHJlY3RhbmdsZSB0byB0aGUgbGlzdFxuXHRcdCAgbGV0IGsgPSBmZi5pZDtcblx0XHQgIGlmICghc3RhY2tzW2tdKSBzdGFja3Nba10gPSBbXVxuXHRcdCAgc3RhY2tzW2tdLnB1c2godGhpcylcblx0ICAgICAgfVxuXHQgICAgICAvLyBcblx0ICAgICAgZDMuc2VsZWN0KHRoaXMpXG5cdFx0ICAuY2xhc3NlZChcImhpZ2hsaWdodFwiLCBobClcblx0XHQgIC5jbGFzc2VkKFwiY3VycmVudFwiLCBobCAmJiBjdXJyRmVhdCAmJiB0aGlzLl9fZGF0YV9fLmlkID09PSBjdXJyRmVhdC5pZClcblx0XHQgIC5jbGFzc2VkKFwiZXh0cmFcIiwgcHVsc2VDdXJyZW50ICYmIGZmID09PSBjdXJyRmVhdClcblx0ICAgICAgcmV0dXJuIGhsO1xuXHQgIH0pXG5cdCAgO1xuXG5cdC8vIGJ1aWxkIGRhdGEgYXJyYXkgZm9yIGRyYXdpbmcgZmlkdWNpYWxzIGJldHdlZW4gZXF1aXZhbGVudCBmZWF0dXJlc1xuXHRsZXQgZGF0YSA9IFtdO1xuXHRmb3IgKGxldCBrIGluIHN0YWNrcykge1xuXHQgICAgLy8gZm9yIGVhY2ggaGlnaGxpZ2h0ZWQgZmVhdHVyZSwgc29ydCB0aGUgcmVjdGFuZ2xlcyBpbiBpdHMgbGlzdCBieSBZLWNvb3JkaW5hdGVcblx0ICAgIGxldCByZWN0cyA9IHN0YWNrc1trXTtcblx0ICAgIHJlY3RzLnNvcnQoIChhLGIpID0+IHBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoXCJ5XCIpKSAtIHBhcnNlRmxvYXQoYi5nZXRBdHRyaWJ1dGUoXCJ5XCIpKSApO1xuXHQgICAgcmVjdHMuc29ydCggKGEsYikgPT4ge1xuXHRcdHJldHVybiBhLl9fZGF0YV9fLmdlbm9tZS56b29tWSAtIGIuX19kYXRhX18uZ2Vub21lLnpvb21ZO1xuXHQgICAgfSk7XG5cdCAgICAvLyBXYW50IGEgcG9seWdvbiBiZXR3ZWVuIGVhY2ggc3VjY2Vzc2l2ZSBwYWlyIG9mIGl0ZW1zLiBUaGUgZm9sbG93aW5nIGNyZWF0ZXMgYSBsaXN0IG9mXG5cdCAgICAvLyBuIHBhaXJzLCB3aGVyZSByZWN0W2ldIGlzIHBhaXJlZCB3aXRoIHJlY3RbaSsxXS4gVGhlIGxhc3QgcGFpciBjb25zaXN0cyBvZiB0aGUgbGFzdFxuXHQgICAgLy8gcmVjdGFuZ2xlIHBhaXJlZCB3aXRoIHVuZGVmaW5lZC4gKFdlIHdhbnQgdGhpcy4pXG5cdCAgICBsZXQgcGFpcnMgPSByZWN0cy5tYXAoKHIsIGkpID0+IFtyLHJlY3RzW2krMV1dKTtcblx0ICAgIC8vIEFkZCBhIGNsYXNzIChcImN1cnJlbnRcIikgZm9yIHRoZSBwb2x5Z29ucyBhc3NvY2lhdGVkIHdpdGggdGhlIG1vdXNlb3ZlciBmZWF0dXJlIHNvIHRoZXlcblx0ICAgIC8vIGNhbiBiZSBkaXN0aW5ndWlzaGVkIGZyb20gb3RoZXJzLlxuXHQgICAgZGF0YS5wdXNoKHsgZmlkOiBrLCByZWN0czogcGFpcnMsIGNsczogKGN1cnJGZWF0ICYmIGN1cnJGZWF0LmlkID09PSBrID8gJ2N1cnJlbnQnIDogJycpIH0pO1xuXHR9XG5cdHRoaXMuZHJhd0ZpZHVjaWFscyhkYXRhLCBjdXJyRmVhdCk7XG5cblx0Ly8gRklYTUU6IHJlYWNob3ZlclxuXHR0aGlzLmFwcC5mZWF0dXJlRGV0YWlscy51cGRhdGUoY3VyckZlYXQpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHBvbHlnb25zIHRoYXQgY29ubmVjdCBoaWdobGlnaHRlZCBmZWF0dXJlcyBpbiB0aGUgdmlld1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICBkYXRhIDogbGlzdCBvZiB7XG4gICAgLy8gICAgICAgZmlkOiBmZWF0dXJlLWlkLCBcbiAgICAvLyAgICAgICBjbHM6IGV4dHJhIGNsYXNzIGZvciAuZmVhdHVyZU1hcmsgZ3JvdXAsXG4gICAgLy8gICAgICAgcmVjdHM6IGxpc3Qgb2YgW3JlY3QxLHJlY3QyXSBwYWlycywgXG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgY3VyckZlYXQgOiBjdXJyZW50IChtb3VzZW92ZXIpIGZlYXR1cmUgKGlmIGFueSlcbiAgICAvL1xuICAgIGRyYXdGaWR1Y2lhbHMgKGRhdGEsIGN1cnJGZWF0KSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0Ly9cblx0Ly8gcHV0IGZpZHVjaWFsIG1hcmtzIGluIHRoZWlyIG93biBncm91cCBcblx0bGV0IGZHcnAgPSB0aGlzLmZpZHVjaWFscy5jbGFzc2VkKFwiaGlkZGVuXCIsIGZhbHNlKTtcblxuXHQvLyBCaW5kIGZpcnN0IGxldmVsIGRhdGEgdG8gXCJmZWF0dXJlTWFya3NcIiBncm91cHNcblx0bGV0IGZmR3JwcyA9IGZHcnAuc2VsZWN0QWxsKFwiZy5mZWF0dXJlTWFya3NcIilcblx0ICAgIC5kYXRhKGRhdGEsIGQgPT4gZC5maWQpO1xuXHRmZkdycHMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgZCA9PiBkLmZpZCk7XG5cdGZmR3Jwcy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGZmR3Jwcy5hdHRyKFwiY2xhc3NcIixkID0+IFwiZmVhdHVyZU1hcmtzIFwiICsgKGQuY2xzIHx8IFwiXCIpKVxuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRHJhdyB0aGUgY29ubmVjdG9yIHBvbHlnb25zLlxuXHQvLyBCaW5kIHNlY29uZCBsZXZlbCBkYXRhIChyZWN0YW5nbGUgcGFpcnMpIHRvIHBvbHlnb25zIGluIHRoZSBncm91cFxuXHRsZXQgcGdvbnMgPSBmZkdycHMuc2VsZWN0QWxsKFwicG9seWdvblwiKVxuXHQgICAgLmRhdGEoZD0+ZC5yZWN0cy5maWx0ZXIociA9PiByWzBdICYmIHJbMV0pKTtcblx0cGdvbnMuZXhpdCgpLnJlbW92ZSgpO1xuXHRwZ29ucy5lbnRlcigpLmFwcGVuZChcInBvbHlnb25cIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImZpZHVjaWFsXCIpXG5cdCAgICA7XG5cdC8vXG5cdHBnb25zLmF0dHIoXCJwb2ludHNcIiwgciA9PiB7XG5cdCAgICAvLyBwb2x5Z29uIGNvbm5lY3RzIGJvdHRvbSBjb3JuZXJzIG9mIDFzdCByZWN0IHRvIHRvcCBjb3JuZXJzIG9mIDJuZCByZWN0XG5cdCAgICBsZXQgYzEgPSBjb29yZHNBZnRlclRyYW5zZm9ybShyWzBdKTsgLy8gdHJhbnNmb3JtIGNvb3JkcyBmb3IgMXN0IHJlY3Rcblx0ICAgIGxldCBjMj0gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0oclsxXSk7ICAvLyB0cmFuc2Zvcm0gY29vcmRzIGZvciAybmQgcmVjdFxuXHQgICAgLy8gZm91ciBwb2x5Z29uIHBvaW50c1xuXHQgICAgbGV0IHMgPSBgJHtjMS54fSwke2MxLnkrYzEuaGVpZ2h0fSAke2MyLnh9LCR7YzIueX0gJHtjMi54K2MyLndpZHRofSwke2MyLnl9ICR7YzEueCtjMS53aWR0aH0sJHtjMS55K2MxLmhlaWdodH1gXG5cdCAgICByZXR1cm4gcztcblx0fSlcblx0Ly8gbW91c2luZyBvdmVyIHRoZSBmaWR1Y2lhbCBoaWdobGlnaHRzIChhcyBpZiB0aGUgdXNlciBoYWQgbW91c2VkIG92ZXIgdGhlIGZlYXR1cmUgaXRzZWxmKVxuXHQub24oXCJtb3VzZW92ZXJcIiwgKHApID0+IHtcblx0ICAgIGlmICghZDMuZXZlbnQuY3RybEtleSlcblx0ICAgICAgICB0aGlzLmhpZ2hsaWdodChwWzBdKTtcblx0fSlcblx0Lm9uKFwibW91c2VvdXRcIiwgIChwKSA9PiB7XG5cdCAgICBpZiAoIWQzLmV2ZW50LmN0cmxLZXkpXG5cdCAgICAgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0fSk7XG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRHJhdyBmZWF0dXJlIGxhYmVscy4gRWFjaCBsYWJlbCBpcyBkcmF3biBvbmNlLCBhYm92ZSB0aGUgZmlyc3QgcmVjdGFuZ2xlIGluIGl0cyBsaXN0LlxuXHQvLyBUaGUgZXhjZXB0aW9uIGlzIHRoZSBjdXJyZW50IChtb3VzZW92ZXIpIGZlYXR1cmUsIHdoZXJlIHRoZSBsYWJlbCBpcyBkcmF3biBhYm92ZSB0aGF0IGZlYXR1cmUuXG5cdGxldCBsYWJlbHMgPSBmZkdycHMuc2VsZWN0QWxsKCd0ZXh0LmZlYXRMYWJlbCcpXG5cdCAgICAuZGF0YShkID0+IHtcblx0XHRsZXQgciA9IGQucmVjdHNbMF1bMF07XG5cdFx0aWYgKGN1cnJGZWF0ICYmIChkLmZpZCA9PT0gY3VyckZlYXQuSUQgfHwgZC5maWQgPT09IGN1cnJGZWF0LmNhbm9uaWNhbCkpe1xuXHRcdCAgICByID0gZC5yZWN0cy5tYXAoIHJyID0+XG5cdFx0ICAgICAgIHJyWzBdLl9fZGF0YV9fID09PSBjdXJyRmVhdCA/IHJyWzBdIDogcnJbMV0mJnJyWzFdLl9fZGF0YV9fID09PSBjdXJyRmVhdCA/IHJyWzFdIDogbnVsbFxuXHRcdCAgICAgICApLmZpbHRlcih4PT54KVswXTtcblx0XHR9XG5cdCAgICAgICAgcmV0dXJuIFt7XG5cdFx0ICAgIGZpZDogZC5maWQsXG5cdFx0ICAgIHJlY3Q6IHIsXG5cdFx0ICAgIHRyZWN0OiBjb29yZHNBZnRlclRyYW5zZm9ybShyKVxuXHRcdH1dO1xuXHQgICAgfSk7XG5cblx0Ly8gRHJhdyB0aGUgdGV4dC5cblx0bGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCdmZWF0TGFiZWwnKTtcblx0bGFiZWxzLmV4aXQoKS5yZW1vdmUoKTtcblx0bGFiZWxzXG5cdCAgLmF0dHIoXCJ4XCIsIGQgPT4gZC50cmVjdC54ICsgZC50cmVjdC53aWR0aC8yIClcblx0ICAuYXR0cihcInlcIiwgZCA9PiBkLnJlY3QuX19kYXRhX18uZ2Vub21lLnpvb21ZIC0gMylcblx0ICAudGV4dChkID0+IHtcblx0ICAgICAgIGxldCBmID0gZC5yZWN0Ll9fZGF0YV9fO1xuXHQgICAgICAgbGV0IHN5bSA9IGYuc3ltYm9sIHx8IGYubWdwaWQ7XG5cdCAgICAgICByZXR1cm4gc3ltO1xuXHQgIH0pO1xuXG5cdC8vIFB1dCBhIHJlY3RhbmdsZSBiZWhpbmQgZWFjaCBsYWJlbCBhcyBhIGJhY2tncm91bmRcblx0bGV0IGxibEJveERhdGEgPSBsYWJlbHMubWFwKGxibCA9PiBsYmxbMF0uZ2V0QkJveCgpKVxuXHRsZXQgbGJsQm94ZXMgPSBmZkdycHMuc2VsZWN0QWxsKCdyZWN0LmZlYXRMYWJlbEJveCcpXG5cdCAgICAuZGF0YSgoZCxpKSA9PiBbbGJsQm94RGF0YVtpXV0pO1xuXHRsYmxCb3hlcy5lbnRlcigpLmluc2VydCgncmVjdCcsJ3RleHQnKS5hdHRyKCdjbGFzcycsJ2ZlYXRMYWJlbEJveCcpO1xuXHRsYmxCb3hlcy5leGl0KCkucmVtb3ZlKCk7XG5cdGxibEJveGVzXG5cdCAgICAuYXR0cihcInhcIiwgICAgICBiYiA9PiBiYi54LTIpXG5cdCAgICAuYXR0cihcInlcIiwgICAgICBiYiA9PiBiYi55LTEpXG5cdCAgICAuYXR0cihcIndpZHRoXCIsICBiYiA9PiBiYi53aWR0aCs0KVxuXHQgICAgLmF0dHIoXCJoZWlnaHRcIiwgYmIgPT4gYmIuaGVpZ2h0KzIpXG5cdCAgICA7XG5cdFxuXHQvLyBpZiB0aGVyZSBpcyBhIGN1cnJGZWF0LCBtb3ZlIGl0cyBmaWR1Y2lhbHMgdG8gdGhlIGVuZCAoc28gdGhleSdyZSBvbiB0b3Agb2YgZXZlcnlvbmUgZWxzZSlcblx0aWYgKGN1cnJGZWF0KSB7XG5cdCAgICAvLyBnZXQgbGlzdCBvZiBncm91cCBlbGVtZW50cyBmcm9tIHRoZSBkMyBzZWxlY3Rpb25cblx0ICAgIGxldCBmZkxpc3QgPSBmZkdycHNbMF07XG5cdCAgICAvLyBmaW5kIHRoZSBvbmUgd2hvc2UgZmVhdHVyZSBpcyBjdXJyRmVhdFxuXHQgICAgbGV0IGkgPSAtMTtcblx0ICAgIGZmTGlzdC5mb3JFYWNoKCAoZyxqKSA9PiB7IGlmIChnLl9fZGF0YV9fLmZpZCA9PT0gY3VyckZlYXQuaWQpIGkgPSBqOyB9KTtcblx0ICAgIC8vIGlmIHdlIGZvdW5kIGl0IGFuZCBpdCdzIG5vdCBhbHJlYWR5IHRoZSBsYXN0LCBtb3ZlIGl0IHRvIHRoZVxuXHQgICAgLy8gbGFzdCBwb3NpdGlvbiBhbmQgcmVvcmRlciBpbiB0aGUgRE9NLlxuXHQgICAgaWYgKGkgPj0gMCkge1xuXHRcdGxldCBsYXN0aSA9IGZmTGlzdC5sZW5ndGggLSAxO1xuXHQgICAgICAgIGxldCB4ID0gZmZMaXN0W2ldO1xuXHRcdGZmTGlzdFtpXSA9IGZmTGlzdFtsYXN0aV07XG5cdFx0ZmZMaXN0W2xhc3RpXSA9IHg7XG5cdFx0ZmZHcnBzLm9yZGVyKCk7XG5cdCAgICB9XG5cdH1cblx0XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZGVGaWR1Y2lhbHMgKCkge1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0KFwiZy5maWR1Y2lhbHNcIilcblx0ICAgIC5jbGFzc2VkKFwiaGlkZGVuXCIsIHRydWUpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIFpvb21WaWV3XG5cbmV4cG9ydCB7IFpvb21WaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9ab29tVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==