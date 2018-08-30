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
/* unused harmony export d3text */
/* unused harmony export deepc */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return parseCoords; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return formatCoords; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return overlaps; });
/* unused harmony export subtract */
/* unused harmony export obj2list */
/* unused harmony export same */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getCaretRange; });
/* unused harmony export setCaretRange */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return setCaretPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return moveCaretPosition; });
/* unused harmony export getCaretPosition */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return coordsAfterTransform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return removeDups; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return clip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return prettyPrintBases; });

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
// Promisifies a call to d3.text.
// Args:
//   url (string) The url of the text resource
// Returns:
//   a promise that resolves to the json object value, or rejects with an error
function d3text(url) {
    return new Promise(function(resolve, reject) {
        d3.text(url, 'text/plain', function(error, val){
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
// Returns the given basepair amount "pretty printed" to an apporpriate scale, precision, and units.
// Eg,  
//    127 => '127 bp'
//    123456789 => '123.5 Mb'
function prettyPrintBases (n) {
    let absn = Math.abs(n);
    if (absn < 1000) {
        return `${n} bp`;
    }
    if (absn >= 1000 && absn < 1000000) {
        return `${(n/1000).toFixed(2)} kb`;
    }
    else {
        return `${(n/1000000).toFixed(2)} Mb`;
    }
    return 
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return KeyStore; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_idb_keyval__ = __webpack_require__(10);


const DB_NAME_PREFIX = 'mgv-datacache-';

class KeyStore {
    constructor (name) {
	try {
	    this.store = new __WEBPACK_IMPORTED_MODULE_0_idb_keyval__["a" /* Store */](DB_NAME_PREFIX+name, name);
	    this.disabled = false;
	    console.log(`KeyStore: ${DB_NAME_PREFIX+name}`);
	}
	catch (err) {
	    this.store = null;
	    this.disabled = true;
	    this.nullP = Promise.resolve(null);
	    console.log(`KeyStore: error in constructor: ${err} \n Disabled.`)
	}
    }
    get (key) {
	if (this.disabled) 
	    return this.nullP;
        return Object(__WEBPACK_IMPORTED_MODULE_0_idb_keyval__["d" /* get */])(key, this.store);
    }
    del (key) {
	if (this.disabled) 
	    return this.nullP;
        return Object(__WEBPACK_IMPORTED_MODULE_0_idb_keyval__["c" /* del */])(key, this.store);
    }
    set (key, value) {
	if (this.disabled) 
	    return this.nullP;
        return Object(__WEBPACK_IMPORTED_MODULE_0_idb_keyval__["f" /* set */])(key, value, this.store);
    }
    put (key, value) {
        return this.set(key, value);
    }
    keys () {
	if (this.disabled) 
	    return this.nullP;
        return Object(__WEBPACK_IMPORTED_MODULE_0_idb_keyval__["e" /* keys */])(this.store);
    }
    contains (key) {
	if (this.disabled) 
	    return this.nullP;
        return this.get(key).then(x => x !== undefined);
    }
    clear () {
	if (this.disabled) 
	    return this.nullP;
        return Object(__WEBPACK_IMPORTED_MODULE_0_idb_keyval__["b" /* clear */])(this.store);
    }
};




/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Feature; });
class GenomicInterval {
    constructor (cfg) {
        this.genome  = cfg.genome;
        this.chr     = cfg.chr || cfg.chromosome;
        this.start   = parseInt(cfg.start);
        this.end     = parseInt(cfg.end);
        this.strand  = cfg.strand;
    }
    //----------------------------------------------
    get length () {
        return this.end - this.start + 1;
    }
}

class Exon extends GenomicInterval {
    constructor (cfg) {
        super(cfg);
	this.ID = cfg.primaryIdentifier;
	this.chr;
    }
}

class Feature extends GenomicInterval {
    constructor (cfg) {
	super(cfg);
        this.type    = cfg.type;
        this.biotype = cfg.biotype;
        this.mgpid   = cfg.mgpid || cfg.id;
        this.mgiid   = cfg.mgiid;
        this.symbol  = cfg.symbol;
	this.contig  = parseInt(cfg.contig);
	this.lane    = parseInt(cfg.lane);
        if (this.mgiid === ".") this.mgiid = null;
        if (this.symbol === ".") this.symbol = null;
	//
	this.exons = null; // list of exons. Null means not yet leaded.
    }
    //----------------------------------------------
    get ID () {
        return this.mgpid;
    }
    get canonical () {
        return this.mgiid;
    }
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
    pgenomes = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["l" /* removeDups */])(pgenomes.trim().split(/ +/));
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__QueryManager__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ListManager__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ListEditor__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__FacetManager__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__BTManager__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__GenomeView__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__FeatureDetails__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ZoomView__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__KeyStore__ = __webpack_require__(2);














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
	this.currListIndex = {};
	this.currListCounter = 0;


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
	this.genomeView = new __WEBPACK_IMPORTED_MODULE_9__GenomeView__["a" /* GenomeView */](this, '#genomeView', 800, 250);
	this.zoomView   = new __WEBPACK_IMPORTED_MODULE_11__ZoomView__["a" /* ZoomView */]  (this, '#zoomView', 800, 250, this.coords);
	this.resize();
        //
	this.featureDetails = new __WEBPACK_IMPORTED_MODULE_10__FeatureDetails__["a" /* FeatureDetails */](this, '#featureDetails');

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
	this.listManager.ready.then( () => this.listManager.update() );
	//
	this.listEditor = new __WEBPACK_IMPORTED_MODULE_6__ListEditor__["a" /* ListEditor */](this, '#listeditor');
	//
	this.queryManager = new __WEBPACK_IMPORTED_MODULE_4__QueryManager__["a" /* QueryManager */](this, "#findGenesBox");
	// 
	this.translator     = new __WEBPACK_IMPORTED_MODULE_8__BTManager__["a" /* BTManager */](this);
	this.featureManager = new __WEBPACK_IMPORTED_MODULE_3__FeatureManager__["a" /* FeatureManager */](this);
	//
	this.userPrefsStore = new __WEBPACK_IMPORTED_MODULE_12__KeyStore__["a" /* KeyStore */]("user-preferences");
	
	//
	// -------------------------------------------------------------------
	// Facets
	// -------------------------------------------------------------------
	//
	this.facetManager = new __WEBPACK_IMPORTED_MODULE_7__FacetManager__["a" /* FacetManager */](this);
	let self = this;

	// Feature-type facet
	let ftFacet  = this.facetManager.addFacet("FeatureType", f => f.getMungedType());
	this.initFeatTypeControl(ftFacet);

	// Has-MGI-id facet
	let mgiFacet = this.facetManager.addFacet("HasCanonicalId",    f => f.canonical  ? "yes" : "no" );
	d3.selectAll('input[name="mgiFacet"]').on("change", function(){
	    mgiFacet.setValues(this.value === "" ? [] : [this.value]);
	    self.zoomView.highlight();
	});

	// Is-in-current-list facet
	let inCurrListFacet = this.facetManager.addFacet("InCurrList", f => {
	    return this.currListIndex[f.id] ? "yes" : "no";
	});
	d3.selectAll('input[name="inCurrListFacet"]').on("change", function(){
	    inCurrListFacet.setValues(this.value === "" ? [] : [this.value]);
	    self.zoomView.highlight();
	});

	// Is-highlighted facet
	let hiFacet = this.facetManager.addFacet("IsHi", f => {
	    let ishi = this.zoomView.hiFeats[f.id] || this.currListIndex[f.id];
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
	this.checkTimestamp().then( () => {
	    Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* d3tsv */])("./data/genomedata/allGenomes.tsv").then(data => {
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
	});
    }
    //----------------------------------------------
    checkTimestamp () {
        let tStore = new __WEBPACK_IMPORTED_MODULE_12__KeyStore__["a" /* KeyStore */]('timestamp');
	return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* d3tsv */])('./data/genomedata/TIMESTAMP.tsv').then( ts => {
	    let newTimeStamp =  new Date(Date.parse(ts[0].TIMESTAMP));
	    return tStore.get('TIMESTAMP').then( oldTimeStamp => {
	        if (!oldTimeStamp || newTimeStamp > oldTimeStamp) {
		    tStore.put('TIMESTAMP',newTimeStamp);
		    return this.clearCachedData();
		}
	    })
	});
    }
    //----------------------------------------------
    // 
    initDom () {
	self = this;
	this.root = d3.select('#mgv');
	//
	// TODO: refactor pagebox, draggable, and friends into a framework module,
	// 
	this.pbDragger = this.getContentDragger();
	// Add busy icon, currently invisibe.
	d3.selectAll('.pagebox')
	    .append('i')
		.attr('class','material-icons busy rotating')
	    ;
	//
	// If a pagebox has title text, append a help icon to the label and move the text there
	d3.selectAll('.pagebox[title]')
	    .append('i')
	        .attr('class', 'material-icons button help')
	        .attr('title', function(){
		    let p = d3.select(this.parentNode);
		    let t = p.attr('title');
		    p.attr('title', null);
		    return t;
		})
		.on('click', function() {
		    self.showStatus(d3.select(this).attr('title'), d3.event.clientX, d3.event.clientY);
		})
		;
	//
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
		.attr('class','material-icons button draghandle')
		.on('mouseenter', function(){
		    // Attach the drag behavior when the user mouses over the drag handle, and remove the behavior
		    // when user mouses out. Why do it this way? Because if the drag behavior stays on all the time,
		    // the user cannot select any text within the box.
		    let pb = this.closest('.pagebox');
		    if (!pb) return;
		    d3.select(pb).call(self.pbDragger);
		})
		.on('mouseleave', function(){
		    let pb = this.closest('.pagebox');
		    if (!pb) return;
		    d3.select(pb).on('.drag',null);
		});

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
	Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* d3tsv */])("./data/genomedata/genomeSets.tsv").then(sets => {
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
	this.userPrefsStore.get("prefs").then( prefs => {
	    prefs = prefs || {};
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
	this.userPrefsStore.set("prefs", prefs);
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
    showingStatus () {
        return d3.select('#statusMessage').classed('showing');
    }

    //----------------------------------------------
    showStatus (msg, nearX, nearY) {
	let bb = this.root.node().getBoundingClientRect();
	let _ = (n, len, nmax) => {
	    if (n === undefined)
	        return '50%';
	    else if (typeof(n) === 'string')
	        return n;
	    else if ( n + len < nmax ) {
	        return n + 'px';
	    }
	    else {
	        return (nmax - len) + 'px';
	    }
	};
	nearX = _(nearX, 250, bb.width);
	nearY = _(nearY, 150, bb.height);
	if (msg)
	    d3.select('#statusMessage')
		.classed('showing', true)
		.style('left', nearX)
		.style('top',  nearY)
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
	    this.zoomView.update(cfg);
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
    getCurrentList () {
        return this.currList;
    }
    //----------------------------------------------
    setCurrentList (lst, goToFirst) {
    	//
	let prevList = this.currList;
	this.currList = lst;
	if (lst !== prevList) {
	    this.currListIndex = lst ? lst.ids.reduce( (x,i) => { x[i]=i; return x; }, {}) : {};
	    this.currListCounter = 0;
	}
	//
	let lists = d3.select('#mylists').selectAll('.listInfo');
	lists.classed("current", d => d === lst);
	//
	// show this list as tick marks in the genome view
	this.genomeView.drawTicks(lst ? lst.ids : []);
	this.genomeView.drawTitle();
	this.zoomView.highlight();
	//
	if (goToFirst) this.goToNextListElement();
    }
    //----------------------------------------------
    goToNextListElement () {
	if (!this.currList || this.currList.ids.length === 0) return;
	let currId = this.currList.ids[this.currListCounter];
        this.currListCounter = (this.currListCounter + 1) % this.currList.ids.length;
	this.setCoordinates(currId);
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
    clearCachedData (ask) {
	if (!ask || window.confirm('Delete all cached data. Are you sure?')) {
	    this.featureManager.clearCachedData();
	    this.translator.clearCachedData();
	}
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
    //----------------------------------------------
    // Downloads DNA sequences of the specified type in FASTA format for the specified feature.
    // If genomes is specified, lists the specific genomes to retrieve from; otherwise retrieves from all genomes.
    // Args:
    //     f (object) the feature
    //     type (string) which sequences to download: 'genomic','exon','CDS',
    //     genomes (list of strings) names of genomes to retrieve from. If not specified,
    //         retrieves sequenecs from all available mouse genomes.
    //
    downloadFasta (f, type, genomes) {
	let q = this.queryManager.auxDataManager.sequencesForFeature(f, type, genomes)
	if (q) window.open(q,"_blank");
    }
    linkToReportPage (f) {
        let u = this.queryManager.auxDataManager.linkToReportPage(f.id);
	window.open(u, '_blank')
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Feature__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__KeyStore__ = __webpack_require__(2);




//----------------------------------------------
// How the app loads feature data. Provides two calls:
// Requests features from the server and registers them in a cache.
// Interacts with the back end to load features.
//
class FeatureManager {
    constructor (app) {
        this.app = app;
	this.auxDataManager = this.app.queryManager.auxDataManager;
        this.id2feat = {};		// index from  feature ID to feature
	this.canonical2feats = {};	// index from canonical ID -> [ features tagged with that id ]
	this.symbol2feats = {}		// index from symbol -> [ features having that symbol ]
					// want case insensitive searches, so keys are lower cased
	this.cache = {};		// {genome.name -> {chr.name -> list of blocks}}
	this.mineFeatureCache = {};	// auxiliary info pulled from MouseMine 
	this.loadedGenomes = new Set(); // the set of Genomes that have been fully loaded
	//
	this.fStore = new __WEBPACK_IMPORTED_MODULE_2__KeyStore__["a" /* KeyStore */]('features'); // maps genome name -> list of features
    }
 
    //----------------------------------------------
    processFeature (genome, d) {
	// If we've already got this one in the cache, return it.
	let f = this.id2feat[d.ID];
	if (f) return f;
	// Create a new Feature
	f = new __WEBPACK_IMPORTED_MODULE_1__Feature__["a" /* Feature */](d);
	f.genome = genome
	// Register it.
	this.id2feat[f.ID] = f;
	// genome cache
	let gc = this.cache[genome.name] = (this.cache[genome.name] || {});
	// chromosome cache (w/in genome)
	let cc = gc[f.chr] = (gc[f.chr] || []);
	cc.push(f);
	//
	if (f.canonical && f.canonical !== '.') {
	    let lst = this.canonical2feats[f.canonical] = (this.canonical2feats[f.canonical] || []);
	    lst.push(f);
	}
	if (f.symbol && f.symbol !== '.') {
	    let s = f.symbol.toLowerCase();
	    let lst = this.symbol2feats[s] = (this.symbol2feats[s] || []);
	    lst.push(f);
	}
	// here y'go.
	return f;
    }
    //
    processExon (e) {
        // console.log("process exon: ", e);
	let feat = this.id2feat[e.gene.primaryIdentifier];
	if (feat.exons === null)
	    feat.exons = [];
	feat.exons.push({
	    ID: e.primaryIdentifier,
	    transcriptIDs: e.transcripts.map(t => t.primaryIdentifier),
	    chr: e.chromosome.primaryIdentifier,
	    start: e.chromosomeLocation.start,
	    end:   e.chromosomeLocation.end,
	    feature: feat
	});
    }

    //----------------------------------------------
    // Processes the "raw" features returned by the server.
    // Turns them into Feature objects and registers them.
    // If the same raw feature is registered again,
    // the Feature object created the first time is returned.
    // (I.e., registering the same feature multiple times is ok)
    //
    processFeatures (genome, feats) {
	feats.sort( (a,b) => {
	    if (a.chr < b.chr)
		return -1;
	    else if (a.chr > b.chr)
		return 1;
	    else
		return a.start - b.start;
	});
	this.fStore.set(genome.name, feats);
	return feats.map(d => this.processFeature(genome, d));
    }

    //----------------------------------------------
    ensureFeaturesByGenome (genome) {
	if (this.loadedGenomes.has(genome))
	    return Promise.resolve(true);
	return this.fStore.get(genome.name).then(data => {
	    if (data === undefined) {
		console.log("Requesting:", genome.name, );
		let url = `./data/genomedata/${genome.name}-features.tsv`;
		return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* d3tsv */])(url).then( feats => {
		    feats = this.processFeatures(genome, feats);
		});
	    }
	    else {
		console.log("Found in cache:", genome.name, );
		let feats = this.processFeatures(genome, data);
		return true;
	    }
	}).then( ()=> {
	    this.loadedGenomes.add(genome);  
	    this.app.showStatus(`Loaded: ${genome.name}`);
	    return true; 
	});
    }

    //----------------------------------------------
    // Returns a promise that resolves when all exons for the given set of gene ids.
    // Gene IDs are genome-specific, NOT canonical.
    //
    ensureExonsByGeneIds (ids) {
	// Map ids to Feature objects, filter for those where exons have not been retrieved yet
	// Exons accumulate in their features - no cache eviction implemented yet. FIXME.
	// 
	let feats = (ids||[]).map(i => this.id2feat[i]).filter(f => {
	    if (! f || f.exons !== null)
	        return false;
	    // make sure we only check for this feature once
	    f.exons = [];
	    return true;
	});
	if (feats.length === 0)
	    return Promise.resolve();
	return this.auxDataManager.exonsByGeneIds(feats.map(f=>f.ID)).then(exons => {
	    exons.forEach( e => { this.processExon(e); });
	});
    }

    /*
    //----------------------------------------------
    // Returns a promise that resolves to all exons for genes in the specified genome
    // that overlap the specified range.
    //
    ensureExonsByRange (genome, chr, start, end) {
	return this.auxDataManager.exonsByRange(genome,chr,start,end).then(exons => {
	    exons.forEach( e => {
	        this.processExon(e);
	    });
	});
    }
    */

    //----------------------------------------------
    loadGenomes (genomes) {
        return Promise.all(genomes.map(g => this.ensureFeaturesByGenome (g))).then(()=>true);
    }

    //----------------------------------------------
    getCachedFeaturesByRange (genome, range) {
        let gc = this.cache[genome.name] ;
	if (!gc) return [];
	let cFeats = gc[range.chr];
	if (!cFeats) return [];
	// FIXME: should be smarter than testing every feature!
	let feats = cFeats.filter(cf => Object(__WEBPACK_IMPORTED_MODULE_0__utils__["i" /* overlaps */])(cf, range));
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
    getFeaturesByRange (genome, ranges, getExons) {
	let fids = []
	let p = this.ensureFeaturesByGenome(genome).then(() => {
            ranges.forEach( r => {
	        r.features = this.getCachedFeaturesByRange(genome, r) 
		r.genome = genome;
		fids = fids.concat(r.features.map(f => f.ID))
	    });
	    let results = { genome, blocks:ranges };
	    return results;
	});
	if (getExons)
	    p = p.then(results => {
	        return this.ensureExonsByGeneIds(fids).then(()=>results);
		});
	return p;
    }
    //----------------------------------------------
    // Returns a promise for the features having the specified ids from the specified genome.
    getFeaturesById (genome, ids, getExons) {
        return this.ensureFeaturesByGenome(genome).then( () => {
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
	    if (getExons) {
	        return this.ensureExonsByGeneIds(feats.map(f=>f.ID)).then(()=>feats);
	    }
	    else
		return feats;
	});
    }
    //----------------------------------------------
    clearCachedData () {
	console.log("FeatureManager: Cache cleared.")
        return this.fStore.clear();
    }

} // end class Feature Manager




/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return set; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return del; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return clear; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return keys; });
class Store {
    constructor(dbName = 'keyval-store', storeName = 'keyval') {
        this.storeName = storeName;
        this._dbp = new Promise((resolve, reject) => {
            const openreq = indexedDB.open(dbName, 1);
            openreq.onerror = () => reject(openreq.error);
            openreq.onsuccess = () => resolve(openreq.result);
            // First time setup: create an empty object store
            openreq.onupgradeneeded = () => {
                openreq.result.createObjectStore(storeName);
            };
        });
    }
    _withIDBStore(type, callback) {
        return this._dbp.then(db => new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, type);
            transaction.oncomplete = () => resolve();
            transaction.onabort = transaction.onerror = () => reject(transaction.error);
            callback(transaction.objectStore(this.storeName));
        }));
    }
}
let store;
function getDefaultStore() {
    if (!store)
        store = new Store();
    return store;
}
function get(key, store = getDefaultStore()) {
    let req;
    return store._withIDBStore('readonly', store => {
        req = store.get(key);
    }).then(() => req.result);
}
function set(key, value, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.put(value, key);
    });
}
function del(key, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.delete(key);
    });
}
function clear(store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.clear();
    });
}
function keys(store = getDefaultStore()) {
    const keys = [];
    return store._withIDBStore('readonly', store => {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {
            if (!this.result)
                return;
            keys.push(this.result.key);
            this.result.continue();
        };
    }).then(() => keys);
}




/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QueryManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__AuxDataManager__ = __webpack_require__(12);




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
    label: "...by symbol/ID",
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
		  feats.forEach(f => this.app.zoomView.hiFeats[f.canonical] = f.canonical);
		  this.app.zoomView.highlight();
		  //
		  this.app.setCurrentList(lst,true);
		  //
		  d3.select("#mylists").classed("busy",false);
	      });
	})
    }
}




/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuxDataManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);


// ---------------------------------------------
// This belongs in a config but for now...
let MouseMine = 'test'; // one of: public, test, dev

let MINES = {
    'dev' : 'http://bhmgimm-dev:8080/mousemine',
    'test': 'http://test.mousemine.org/mousemine',
    'public' : 'http://www.mousemine.org/mousemine',
};

// ---------------------------------------------
// AuxDataManager - knows how to query an external source (i.e., MouseMine) for genes
// annotated to different ontologies and for exons associated with specific genes or regions.
class AuxDataManager {
    constructor () {
	if (!MINES[MouseMine]) 
	    throw "Unknown mine name: " + MouseMine;
	this.baseUrl = MINES[MouseMine];
	console.log("MouseMine url:", this.baseUrl);
        this.qUrl = this.baseUrl + '/service/query/results?';
	this.rUrl = this.baseUrl + '/portal.do?class=SequenceFeature&externalids='
	this.faUrl = this.baseUrl + '/service/query/results/fasta?';
    }
    //----------------------------------------------
    getAuxData (q, format) {
	console.log('Query: ' + q);
	format = format || 'jsonobjects';
	let query = encodeURIComponent(q);
	let url = this.qUrl + `format=${format}&query=${query}`;
	return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* d3json */])(url).then(data => data.results||[]);
    }

    //----------------------------------------------
    isIdentifier (q) {
        let pts = q.split(':');
        if (pts.length === 2 && pts[1].match(/^[0-9]+$/))
	    return true;
	if (q.toLowerCase().startsWith('r-mmu-'))
	    return true;
	return false;
    }
    //----------------------------------------------
    addWildcards (q) {
        return (this.isIdentifier(q) || q.indexOf('*')>=0) ? q : `*${q}*`;
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
	qryString = this.addWildcards(qryString);
        let q = `<query name="" model="genomic" 
	  view="SequenceFeature.primaryIdentifier SequenceFeature.symbol" constraintLogic="A and B and C and D">
	      <constraint code="A" path="SequenceFeature.ontologyAnnotations.ontologyTerm.parents" op="LOOKUP" value="${qryString}"/>
	      <constraint code="B" path="SequenceFeature.organism.taxonId" op="=" value="10090"/>
	      <constraint code="C" path="SequenceFeature.sequenceOntologyTerm.name" op="!=" value="transgene"/>
	      <constraint code="D" path="SequenceFeature.ontologyAnnotations.ontologyTerm.ontology.name" op="ONE OF">
		  ${ termTypes.map(tt=> '<value>'+tt+'</value>').join('') }
	      </constraint>
	  </query>`
	return this.getAuxData(q);
    }
    //----------------------------------------------
    featuresByPathwayTerm (qryString) {
	qryString = this.addWildcards(qryString);
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
    // Returns a promise for all exons of features overlapping a specified range in the specifed genome.
    exonView () {
	return [
	    'Exon.gene.canonical.primaryIdentifier',
	    'Exon.gene.primaryIdentifier',
	    'Exon.transcripts.primaryIdentifier',
	    'Exon.primaryIdentifier',
	    'Exon.chromosome.primaryIdentifier',
	    'Exon.chromosomeLocation.start',
	    'Exon.chromosomeLocation.end',
	    'Exon.strain.name'
	].join(' ');
    }
    // Returns a promise for all exons from the given genome where the exon's gene overlaps the given coordinates.
    exonsByRange	(genome, chr, start, end) {
        let q = `<query model="genomic" view="${this.exonView()}" constraintLogic="A and B">
	    <constraint code="A" path="Exon.gene.chromosomeLocation" op="OVERLAPS">
		<value>${chr}:${start}..${end}</value>
	    </constraint>
	    <constraint code="B" path="Exon.strain.name" op="=" value="${genome}"/>
	    </query>`
	return this.getAuxData(q);
    }
    // Returns a promise for all exons of all genologs of the specified canonical gene
    exonsByCanonicalId	(ident) {
        let q = `<query model="genomic" view="${this.exonView()}" >
	    <constraint code="A" path="Exon.gene.canonical.primaryIdentifier" op="=" value="${ident}" />
	    </query>`
	return this.getAuxData(q);
    }
    // Returns a promise for all exons of the specified gene.
    exonsByGeneId	(ident) {
        let q = `<query model="genomic" view="${this.exonView()}" >
	    <constraint code="A" path="Exon.gene.primaryIdentifier" op="=" value="${ident}" />
	    </query>`
	return this.getAuxData(q);
    }
    // Returns a promise for all exons of the specified gene.
    exonsByGeneIds	(idents) {
	let vals = idents.map(i => `<value>${i}</value>`).join('');
        let q = `<query model="genomic" view="${this.exonView()}" >
	    <constraint code="A" path="Exon.gene.primaryIdentifier" op="ONE OF">${vals}</constraint>
	    </query>`
	return this.getAuxData(q);
    }
    //----------------------------------------------
    // Constructs a URL for linking to a MouseMine report page by id
    linkToReportPage (ident) {
        return this.rUrl + ident;
    }
    //----------------------------------------------
    // Constructs a URL to retrieve mouse sequences of the specified type for the specified feature.
    sequencesForFeature (f, type, genomes) {
	let q;
	let url;
	let view;
	let ident;
        //
	type = type ? type.toLowerCase() : 'genomic';
	//
	if (f.canonical) {
	    ident = f.canonical
	    //
	    let gs = ''
	    let vals;
	    if (genomes) {
		vals = genomes.map((g) => `<value>${g}</value>`).join('');
	    }
	    switch (type) {
	    case 'genomic':
		view = 'Gene.canonical.primaryIdentifier';
		gs = `<constraint path="Gene.strain.name" op="ONE OF">${vals}</constraint>`
		q = `<query name="sequencesByCanonicalId" model="genomic" view="Gene.primaryIdentifier" >
		    <constraint path="Gene.canonical.primaryIdentifier" op="=" value="${ident}"/>
		    ${gs}</query>`;
		break;
	    case 'transcript':
		view = 'Transcript.gene.canonical.primaryIdentifier';
		gs = `<constraint path="Transcript.strain.name" op="ONE OF">${vals}</constraint>`
		q = `<query name="transcriptSequencesByCanonicalId" model="genomic" view="Transcript.primaryIdentifier" >
		    <constraint path="Transcript.gene.canonical.primaryIdentifier" op="=" value="${ident}"/>
		    ${gs}</query>`;
	        break;
	    case 'exon':
		view = 'Exon.gene.canonical.primaryIdentifier';
		gs = `<constraint path="Exon.strain.name" op="ONE OF">${vals}</constraint>`
		q = `<query name="exonSequencesByCanonicalId" model="genomic" view="Exon.primaryIdentifier" >
		    <constraint path="Exon.gene.canonical.primaryIdentifier" op="=" value="${ident}"/>
		    ${gs}</query>`;
	        break;
	    case 'cds':
		view = 'CDS.gene.canonical.primaryIdentifier';
		gs = `<constraint path="CDS.strain.name" op="ONE OF">${vals}</constraint>`
		q = `<query name="cdsSequencesByCanonicalId" model="genomic" view="CDS.primaryIdentifier" >
		    <constraint path="CDS.gene.canonical.primaryIdentifier" op="=" value="${ident}"/>
		    ${gs}</query>`;
	        break;
	    }
	}
	else {
	    ident = f.ID;
	    view = ''
	    switch (type) {
	    case 'genomic':
		q = `<query name="sequencesById" model="genomic" view="Gene.primaryIdentifier" >
		    <constraint path="Gene.primaryIdentifier" op="=" value="${ident}"/>
		  </query>`;
		break;
	    case 'transcript':
		q = `<query name="transcriptSequencesById" model="genomic" view="Transcript.primaryIdentifier" >
		    <constraint path="Transcript.gene.primaryIdentifier" op="=" value="${ident}"/>
		  </query>`;
	        break;
	    case 'exon':
		q = `<query name="exonSequencesById" model="genomic" view="Exon.primaryIdentifier" >
		    <constraint path="Exon.gene.primaryIdentifier" op="=" value="${ident}"/>
		  </query>`;
	        break;
	    case 'cds':
		q = `<query name="cdsSequencesById" model="genomic" view="CDS.primaryIdentifier" >
		    <constraint path="CDS.gene.primaryIdentifier" op="=" value="${ident}"/>
		  </query>`;
	        break;
	    }
	}
	if (!q) return null;
	console.log(q, view);
	url = this.faUrl + `query=${encodeURIComponent(q)}`;
	if (view)
            url += `&view=${encodeURIComponent(view)}`;
	return url;
    }
}




/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ListFormulaEvaluator__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__KeyStore__ = __webpack_require__(2);




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
	this.listStore = new __WEBPACK_IMPORTED_MODULE_2__KeyStore__["a" /* KeyStore */]('user-lists');
	this.formulaEval = new __WEBPACK_IMPORTED_MODULE_1__ListFormulaEvaluator__["a" /* ListFormulaEvaluator */](this);
	this.ready = this._load().then( ()=>this.initDom() );
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
		let ids = new Set(Object.keys(this.app.zoomView.hiFeats)); // FIXME - reachover
		let lst = this.app.getCurrentList();
		if (lst)
		    ids = ids.union(lst.ids);
		if (ids.size === 0) {
		    alert("Nothing selected.");
		    return;
		}
		let newlist = this.createList("selection", Array.from(ids));
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
	return this.listStore.get("all").then(all => {
	    this.name2list = all || {};
	});
    }
    _save () {
	return this.listStore.set("all", this.name2list)
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
	if (lst === this.app.getCurrentList()) this.app.setCurrentList(null);
	if (lst === this.app.listEditor.list) this.app.listEditor.list = null;
	return lst;
    }
    // delete all lists
    purge () {
        this.name2list = {}
	this._save();
	//
	this.app.setCurrentList(null);
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
		else if (d3.event.shiftKey) {
		    // shift-click goes to next list element if it's the same list,
		    // or else sets the list and goes to the first element.
		    if (self.app.getCurrentList() !== lst)
			self.app.setCurrentList(lst, true);
		    else
			self.app.goToNextListElement(lst);
		}
		else {
		    // plain click sets the set if it's a different list,
		    // or else unsets the list.
		    if (self.app.getCurrentList() !== lst)
		        self.app.setCurrentList(lst);
		    else
		        self.app.setCurrentList(null);
		}
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
/* 14 */
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
/* 15 */
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
	Object(__WEBPACK_IMPORTED_MODULE_0__utils__["m" /* setCaretPosition */])(this.form.formula, f.length);
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
	    Object(__WEBPACK_IMPORTED_MODULE_0__utils__["m" /* setCaretPosition */])(e, r[0]+t.length);
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
	this.app.zoomView.svgMain.select("g.strips").selectAll('.feature')
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__KeyStore__ = __webpack_require__(2);




//----------------------------------------------
// BlockTranslator manager class. For any given pair of genomes, A and B, loads the single block file
// for translating between them, and indexes it "from both directions":
// 	A->B-> [AB_BlockFile] <-A<-B
//
class BTManager {
    constructor (app) {
        this.app = app;
	this.rcBlocks = {};
	this.blockStore = new __WEBPACK_IMPORTED_MODULE_2__KeyStore__["a" /* KeyStore */]('synteny-blocks');
    }

    //----------------------------------------------
    registerBlocks (aGenome, bGenome, blocks) {
	let aname = aGenome.name;
	let bname = bGenome.name;
	console.log(`Registering blocks: ${aname} vs ${bname}`, blocks);
	let blkFile = new __WEBPACK_IMPORTED_MODULE_1__BlockTranslator__["a" /* BlockTranslator */](aGenome,bGenome,blocks);
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
	
	// Second, try local disk cache
	let key = aname + '-' + bname;
	return this.blockStore.get(key).then(data => {
	    if (data) {
		console.log("Found blocks in cache.");
	        return this.registerBlocks(aGenome, bGenome, data);
	    }
	    else if (this.serverRequest) {
	        // if there is an outstanding request, wait until it's done and try again.
		this.serverRequest.then(()=>this.getBlockFile(aGenome, bGenome));
	    }
	    else {
		// Third, load from server.
		let fn = `./data/genomedata/blocks.tsv`
		console.log("Requesting block file from: " + fn);
		this.serverRequest = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* d3tsv */])(fn).then(blocks => {
		    let rbs = blocks.reduce( (a,b) => {
		    let k = b.aGenome + '-' + b.bGenome;
		    if (!(k in a)) a[k] = [];
		        a[k].push(b);
			return a;
		    }, {});
		    for (let n in rbs) {
		        this.blockStore.set(n, rbs[n]);
		    }
		});
		return this.serverRequest;
	    }
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
    //----------------------------------------------
    clearCachedData () {
	console.log("BTManager: Cache cleared.")
        return this.blockStore.clear();
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
    constructor(aGenome, bGenome, blocks){
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
	// set direction of the resize cursor.
	chrs.selectAll('g[name="brush"] g.resize').style('cursor', closed ? 'ew-resize' : 'ns-resize')
	//
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
	    .data(d => d.features, d => d.ID);
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
	if (f.canonical) {
	    // FIXME: reachover
	    flist = this.app.featureManager.getCachedFeaturesByCanonicalId(f.canonical);
	}
	// Got the list. Now order it the same as the displayed genomes
	// build index of genome name -> feature in flist
	let ix = flist.reduce((acc,f) => { acc[f.genome.name] = f; return acc; }, {})
	let genomeOrder = ([this.app.rGenome].concat(this.app.cGenomes));
	flist = genomeOrder.map(g => ix[g.name] || null);
	//
	let colHeaders = [
	    // columns headers and their % widths
	    ["Canonical id"     ,10],
	    ["Canonical symbol" ,10],
	    ["Genome"     ,9],
	    ["ID"     ,17],
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
		let canonical = f.canonical || "";
		if (canonical) {
		    let url = `http://www.informatics.jax.org/accession/${canonical}`;
		    link = `<a target="_blank" href="${url}">${canonical}</a>`;
		}
		cellData = [
		    link || canonical,
		    f.symbol,
		    f.genome.label,
		    f.ID,
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Feature__ = __webpack_require__(3);
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
      this.blockHeight = 60;
      this.topOffset = 15;
      this.featHeight = 8;	// height of a rectangle representing a feature
      this.laneGap = 2;	        // space between swim lanes
      this.laneHeight = this.featHeight + this.laneGap;
      this.minStripHeight = 75;    // height per genome in the zoom view
      this.stripGap = 20;	// space between strips
      this.maxSBgap = 20;	// max gap allowed between blocks.
      this.dmode = 'comparison';// drawing mode. 'comparison' or 'reference'
      this.wheelThreshold = 3;	// minimum wheel distance 
      // A feature may be rendered in one of two ways: as a simple rect, or as a group containing the 
      // rect and other stuff like text, an axis line, etc.
      this.showFeatureDetails = false; // if true, show exon structure
      this.featureDetailThreshold = 2000000; // if width <= thresh, draw feature details.
      this.clearAll = false; // if true, remove/rerender all existing features on next draw

      //
      // IDs of Features we're highlighting. May be feature's ID  or canonical IDr./
      // hiFeats is an obj whose keys are the IDs
      this.hiFeats = (initialHi || []).reduce( (a,v) => { a[v]=v; return a; }, {} );
      this.dragging = null;
      this.dragger = this.getDragger();
      //
	// Config for menu under menu button
	this.cxtMenuCfg = [{
	    name: 'linkToSnps',
	    label: 'MGI SNPs', 
	    icon: 'open_in_new',
	    tooltip: 'View SNPs at MGI for the current strains in the current region. (Some strains not available.)',
	    handler: ()=> this.app.linkToMgiSnpReport()
	},{
	    name: 'linkToQtl',
	    label: 'MGI QTLs', 
	    icon:  'open_in_new',
	    tooltip: 'View QTL at MGI that overlap the current region.',
	    handler: ()=> this.app.linkToMgiQTLs()
	},{
	    name: 'linkToJbrowse',
	    label: 'MGI JBrowse', 
	    icon: 'open_in_new',
	    tooltip: 'Open MGI JBrowse (C57BL/6J GRCm38) with the current coordinate range.',
	    handler: ()=> this.app.linkToMgiJBrowse()
	},{
	    name: 'clearCache',
	    label: 'Clear cache', 
	    icon: 'delete_sweep',
	    tooltip: 'Delete cached features. Data will be reloaded from the server on next use.',
	    handler: ()=> this.app.clearCachedData(true)
	}];

	// config for a feature's context menu
	this.fcxtMenuCfg = [{
	    name: 'menuTitle',
	    label: (d) => `${d.symbol || d.ID}`, 
	    cls: 'menuTitle'
	},{
	    name: 'lineUpOnFeature',
	    label: 'Align on this feature.',
	    icon: 'format_align_center',
	    tooltip: 'Aligns the displayed genomes around this feature.',
	    handler: (f) => {
		let ids = (new Set(Object.keys(this.hiFeats))).add(f.id);
	        this.app.setContext({landmark:f.id, delta:0, highlight:Array.from(ids)})
	    }
	},{
	    name: 'toMGI',
	    label: 'Feature@MGI', 
	    icon: 'open_in_new',
	    tooltip: 'See details for this feature at MGI.',
	    handler: (f) => { window.open(`http://www.informatics.jax.org/accession/${f.id}`, '_blank') }
	},{
	    name: 'toMouseMine',
	    label: 'Feature@MouseMine', 
	    icon: 'open_in_new',
	    tooltip: 'See details for this feature at MouseMine.',
	    handler: (f) => this.app.linkToReportPage(f)
	},{
	    name: 'genomicSeqDownload',
	    label: 'Genomic sequences', 
	    icon: 'cloud_download',
	    tooltip: 'Download genomic sequences for this feature from currently displayed genomes.',
	    handler: (f) => { 
		this.app.downloadFasta(f, 'genomic', this.app.vGenomes.map(vg=>vg.label));
	    }
	},{
	    name: 'txpSeqDownload',
	    label: 'Transcript sequences', 
	    icon: 'cloud_download',
	    tooltip: 'Download transcript sequences of this feature from currently displayed genomes.',
	    handler: (f) => { 
		this.app.downloadFasta(f, 'transcript', this.app.vGenomes.map(vg=>vg.label));
	    }
	},{
	    name: 'cdsSeqDownload',
	    label: 'CDS sequences', 
	    icon: 'cloud_download',
	    tooltip: 'Download coding sequences of this feature from currently displayed genomes.',
	    disabler: (f) => f.biotype.indexOf('protein') === -1, // disable if f is not protein coding
	    handler: (f) => { 
		this.app.downloadFasta(f, 'cds', this.app.vGenomes.map(vg=>vg.label));
	    }
	},{
	    name: 'exonSeqDownload',
	    label: 'Exon sequences', 
	    icon: 'cloud_download',
	    tooltip: 'Download exon sequences of this feature from currently displayed genomes.',
	    disabler: (f) => f.type.indexOf('gene') === -1,
	    handler: (f) => { 
		this.app.downloadFasta(f, 'exon', this.app.vGenomes.map(vg=>vg.label));
	    }
	}];
      //
      this.initDom();
    }
    //
    initDom () {
        let self = this;
	let r = this.root;
	let a = this.app;
        //
        this.fiducials = this.svg.insert('g',':first-child')
          .attr('class','fiducials');
        this.stripsGrp = this.svgMain.append('g')
          .attr('class','strips');
        this.axis = this.svgMain.append('g')
          .attr('class','axis');
        this.floatingText = this.svgMain.append('text')
          .attr('class','floatingText');
        this.cxtMenu = this.root.select('[name="cxtMenu"]');
        //
	//
	r.select('.button.close')
	    .on('click', () => this.update());

	// zoom controls
	r.select('#zoomOut').on('click',
	    () => { a.zoom(a.defaultZoom) });
	r.select('#zoomIn') .on('click',
	    () => { a.zoom(1/a.defaultZoom) });
	r.select('#zoomOutMore').on('click',
	    () => { a.zoom(2*a.defaultZoom) });
	r.select('#zoomInMore') .on('click',
	    () => { a.zoom(1/(2*a.defaultZoom)) });

	// pan controls
	r.select('#panLeft') .on('click',
	    () => { a.pan(-a.defaultPan) });
	r.select('#panRight').on('click',
	    () => { a.pan(+a.defaultPan) });
	r.select('#panLeftMore') .on('click',
	    () => { a.pan(-5*a.defaultPan) });
	r.select('#panRightMore').on('click',
	    () => { a.pan(+5*a.defaultPan) });

	//
	this.root
	  .on('click', () => {
	      // click on background => hide context menu
	      let tgt = d3.event.target;
	      if (tgt.tagName.toLowerCase() === 'i' && tgt.innerHTML === 'menu')
		  // exception: the context menu button itself
	          return;
	      else
		  this.hideContextMenu()
	  });

	// Feature mouse event handlers.
	//
	let fClickHandler = function (f, evt, preserve) {
	    let id = f.id;
	    if (evt.ctrlKey) {
	        let cx = d3.event.clientX;
	        let cy = d3.event.clientY;
	        let bb = this.root.select('[name="zoomcontrols"] > .menu > .button').node().getBoundingClientRect();
		evt.stopPropagation();
		evt.preventDefault();
		this.showContextMenu(this.fcxtMenuCfg, f, cx-bb.x, cy-bb.y);
	    }
	    else if (evt.shiftKey) {
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
	  .on('click', () => {
	      let t = d3.event.target;
	      let tgt = d3.select(t);
	      if (this.dealWithUnwantedClickEvent) {
	          this.dealWithUnwantedClickEvent = false;
		  return;
	      }
	      if (t.tagName == 'rect' && (t.classList.contains('feature') || t.parentNode.classList.contains('feature'))) {
		  // user clicked on a feature
		  fClickHandler(t.__data__, d3.event);
		  this.highlight();
	          this.app.contextChanged();
	      }
	      else if (t.tagName == 'rect' && t.classList.contains('exon')) {
		  // user clicked on a feature
		  fClickHandler(t.__data__.feature, d3.event);
		  this.highlight();
	          this.app.contextChanged();
	      }
	      else if (!d3.event.shiftKey && 
	          (t.tagName === 'svg' 
		  || t.tagName == 'rect' && t.classList.contains('block')
		  || t.tagName == 'rect' && t.classList.contains('underlay')
		  )){
		  // user clicked on background
		  this.hiFeats = {};
		  this.highlight();
		  this.app.contextChanged();
	      }
	  })
	  .on('contextmenu', () => {
	      let tgt = d3.select(d3.event.target);
	      let f = tgt.data()[0];
	      f = f ? f.feature || f : f;
	      if (f instanceof __WEBPACK_IMPORTED_MODULE_1__Feature__["a" /* Feature */]) {
		  fClickHandler(f, d3.event);
	      }
	      d3.event.stopPropagation();
	      d3.event.preventDefault();
	  })
	  .on('mouseover', () => {
	      let tgt = d3.select(d3.event.target);
	      let f = tgt.data()[0];
	      f = f ? f.feature || f : f;
	      if (f instanceof __WEBPACK_IMPORTED_MODULE_1__Feature__["a" /* Feature */]) {
		  fMouseOverHandler(f);
	      }
	  })
	  .on('mouseout', () => {
	      let tgt = d3.select(d3.event.target);
	      let f = tgt.data()[0];
	      f = f ? f.feature || f : f;
	      if (f instanceof __WEBPACK_IMPORTED_MODULE_1__Feature__["a" /* Feature */]) {
		  fMouseOutHandler(f);
	      }
	  })
	  .on('wheel', function(d) {
	    let e = d3.event;
	    // let the browser handler vertical motion
	    if (Math.abs(e.deltaX) < Math.abs(e.deltaY))
	        return;
	    // we handle horizontal motion.
	    e.stopPropagation();
	    e.preventDefault();
	    // filter out tiny motions
	    if (Math.abs(e.deltaX) < this.wheelThreshold) 
	        return;
	    // get the zoom strip target, if it exists, else the ref zoom strip.
	    let z = e.target.closest('g.zoomStrip') || d3.select('g.zoomStrip.reference')[0][0];
	    if (!z) return;

	    let db = e.deltaX / self.ppb; // delta in bases for this event
	    let zd = z.__data__;
	    if (e.ctrlKey) {
		// Ctrl-wheel simply slides the strip horizontally (temporary)
		// For comparison genomes, just translate the blocks by the wheel amount, so the user can 
		// see everything.
		zd.deltaB += db;
	        d3.select(z).select('g[name="sBlocks"]').attr('transform',`translate(${-zd.deltaB * self.ppb},0)scale(${zd.xScale},1)`);
		self.drawFiducials();
		return;
	    }

	    // Normal wheel event = pan the view.
	    //
	    let c  = self.app.coords;
	    // Limit delta by chr ends
	    // Delta in bases:
	    zd.deltaB = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* clip */])(zd.deltaB + db, -c.start, c.chromosome.length - c.end)
	    // translate
	    d3.select(this).selectAll('g.zoomStrip > g[name="sBlocks"]')
		.attr('transform', cz => `translate(${-zd.deltaB * self.ppb},0)scale(${cz.xScale},1)`);
	    self.drawFiducials();
	    // Wait until wheel events have stopped for a while, then scroll the view.
	    if (self.timeout)
	        window.clearTimeout(self.timeout);
	    self.timeout = window.setTimeout(() => {
		self.timeout = null;
		let ccxt = self.app.getContext();
		if (ccxt.landmark) {
		    self.app.setContext({ delta: ccxt.delta + zd.deltaB });
		    zd.deltaB = 0;
		}
		else {
		    self.app.setContext({ 
		        start: ccxt.start + zd.deltaB,
		        end: ccxt.end + zd.deltaB
			});
		    zd.deltaB = 0;
		}
	    }, 50);
	});


	// Button: Drop down menu in zoom view
	this.root.select('.menu > .button')
	  .on('click', function () {
	      // show context menu at mouse event coordinates
	      let cx = d3.event.clientX;
	      let cy = d3.event.clientY;
	      let bb = d3.select(this)[0][0].getBoundingClientRect();
	      d3.event.stopPropagation();
	      self.showContextMenu(self.cxtMenuCfg, null, cx-bb.left, cy-bb.top);
	  });
	// zoom coordinates box
	this.root.select('#zoomCoords')
	    .call(zcs => zcs[0][0].value = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["e" /* formatCoords */])(this.app.coords))
	    .on('click', function () { this.select(); })
	    .on('change', function () { self.app.setCoordinates(this.value); });

	// zoom window size box
	this.root.select('#zoomWSize')
	    .on('click', function () { this.select(); })
	    .on('change', function() {
	        let ws = parseInt(this.value);
		let c = self.app.coords;
		if (isNaN(ws) || ws < 100) {
		    alert('Invalid window size. Please enter an integer >= 100.');
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
	    .on('click', function() {
		if (d3.select(this).attr('disabled'))
		    return;
		let r = self.root;
		let isC = r.classed('comparison');
		r.classed('comparison', !isC);
		r.classed('reference', isC);
		self.app.setContext({dmode: r.classed('comparison') ? 'comparison' : 'reference'});
	    });
    }
    //----------------------------------------------
    set highlighted (hls) {
	if (typeof(hls) === 'string')
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
    showFloatingText (text, x, y) {
	let sr = this.svg.node().getBoundingClientRect();
	x = x-sr.x-12;
	y = y-sr.y;
	let anchor = x < 60 ? 'start' : this.width-x < 60 ? 'end' : 'middle';
	this.floatingText
	    .text(text)
	    .style('text-anchor',anchor)
	    .attr('x', x)
	    .attr('y', y)
    }
    hideFloatingText () {
	this.floatingText.text('');
    }
    //----------------------------------------------
    initContextMenu (items,obj) {
	this.cxtMenu.selectAll('.menuItem').remove(); // in case of re-init
        let mitems = this.cxtMenu
	  .selectAll('.menuItem')
	  .data(items);
	let news = mitems.enter()
	  .append('div')
	  .attr('class', (d) => `menuItem flexrow ${d.cls||''}`)
	  .classed('disabled', d => d.disabler ? d.disabler(obj) : false)
	  .attr('name', d => d.name || null )
	  .attr('title', d => d.tooltip || null );

	let handler = d => {
	      if (d.disabler && d.disabler(obj))
	          return;
	      d.handler && d.handler(obj);
	      this.hideContextMenu();
	      d3.event.stopPropagation();
	      d3.event.preventDefault();
	};
	news.append('label')
	  .text(d => typeof(d.label) === 'function' ? d.label(obj) : d.label)
	  .on('click', handler)
	  .on('contextmenu', handler);
	news.append('i')
	  .attr('class', 'material-icons')
	  .text( d=>d.icon );
    }
    //----------------------------------------------
    showContextMenu (cfg,f,x,y) {
        this.initContextMenu(cfg, f);
        this.cxtMenu
	    .classed('showing', true)
	    .style('left', `${x}px`)
	    .style('top', `${y}px`)
	    ;
	if (f) {
	    this.cxtMenu.on('mouseenter', ()=>this.highlight(f));
	    this.cxtMenu.on('mouseleave', ()=> {
	        this.highlight();
		this.hideContextMenu();
	    });
	}
    }
    //----------------------------------------------
    hideContextMenu () {
        this.cxtMenu.classed('showing', false);
	this.cxtMenu.on('mouseenter', null);
	this.cxtMenu.on('mouseleave', null);
    }

    //----------------------------------------------
    // Args:
    //     gs (list of Genomes)
    // Side effects:
    //     For each Genome, sets g.zoomY 
    set genomes (gs) {
       let offset = this.topOffset;
       gs.forEach( g => {
           g.zoomY = offset;
	   offset += this.minStripHeight + this.stripGap;
       });
       this._genomes = gs;
    }
    get genomes () {
       return this._genomes;
    }
    //----------------------------------------------
    // Returns the names of the currently displayed genomes (stripes) in top-to-bottom order.
    //
    getGenomeYOrder () {
        let strips = this.svgMain.selectAll('.zoomStrip');
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
    //     Recalculates the Y-coordinates for each strip based on the given order, then translates
    //     each strip to its new position.
    //
    setGenomeYOrder (ns) {
	this.genomes = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["l" /* removeDups */])(ns).map(n=> this.app.name2genome[n] ).filter(x=>x);
	let o = this.topOffset;
        this.genomes.forEach( (g,i) => {
	    let strip = d3.select(`#zoomView .zoomStrip[name="${g.name}"]`);
	    if (!strip.classed('dragging'))
	        strip.attr('transform', gd => `translate(0,${o + gd.zeroOffset})`);
	    o += strip.data()[0].stripHeight + this.stripGap;
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
          .on('dragstart.z', function(g) {
	      let t = d3.event.sourceEvent.target;
	      if (d3.event.sourceEvent.shiftKey || ! d3.select(t).classed('zoomStripHandle')){
	          return false;
	      }
	      d3.event.sourceEvent.stopPropagation();
	      let strip = this.closest('.zoomStrip');
	      self.dragging = d3.select(strip).classed('dragging', true);
	  })
	  .on('drag.z', function (g) {
	      if (!self.dragging) return;
	      let mx = d3.mouse(self.svgMain[0][0])[0];
	      let my = d3.mouse(self.svgMain[0][0])[1];
	      self.dragging.attr('transform', `translate(0, ${my})`);
	      self.setGenomeYOrder(self.getGenomeYOrder());
	      self.drawFiducials();
	  })
	  .on('dragend.z', function (g) {
	      if (!self.dragging) return;
	      //
	      self.dragging.classed('dragging', false);
	      self.dragging = null;
	      self.setGenomeYOrder(self.getGenomeYOrder());
	      self.app.setContext({ genomes: self.getGenomeYOrder() });
	      window.setTimeout( self.drawFiducials.bind(self), 50 );
	  })
	  ;
    }

    //----------------------------------------------
    clearBrushes () {
	this.root.selectAll('g.brush')
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
    bbBrush () {
        let ev = d3.event.sourceEvent;
	let xt = this.brushing.brush.extent();
	let s = Math.round(xt[0]);
	let e = Math.round(xt[1]);
	this.showFloatingText(`${this.brushing.chr}:${s}..${e}`, ev.clientX, ev.clientY);
    }
    //----------------------------------------------
    bbEnd () {
      let se = d3.event.sourceEvent;
      let xt = this.brushing.brush.extent();
      let g = this.brushing.genome.label;
      //
      this.hideFloatingText();
      //
      if (se.ctrlKey || se.altKey || se.metaKey) {
	  this.clearBrushes();
	  this.brushing = null;
          return;
      }
      //
      if (Math.abs(xt[0] - xt[1]) <= 10) {
	  // User clicked. Recenter view.
	  let xmid = (xt[0] + xt[1])/2;
	  let w = this.app.coords.end - this.app.coords.start + 1;
	  let s = Math.round(xmid - w/2);
	  this.app.setContext({ ref:g, chr: this.brushing.chr, start: s, end: s + w - 1 });
      }
      else {
	  // User dragged. Zoom in or out.
	  this.app.setContext({ ref:g, chr: this.brushing.chr, start:xt[0], end:xt[1] });
      }
      this.clearBrushes();
      this.brushing = null;
      this.dealWithUnwantedClickEvent = true;
    }
    //----------------------------------------------
    highlightStrip (g, elt) {
	if (g === this.currentHLG) return;
	this.currentHLG = g;
	//
	this.svgMain.selectAll('.zoomStrip')
	    .classed('highlighted', d => d.genome === g);
	this.app.showBlocks(g);
    }

    //----------------------------------------------
    // Based on the given coordinate range, sets the showFeatureDetails flag to true or false.
    // Also sets the clearAll flag to true if the showFeatureDetails flag changed value.
    //
    setShowFeatureDetails (c) {
	//
	let prevSFD = this.showFeatureDetails;
	this.showFeatureDetails = (c.end - c.start + 1) <= this.featureDetailThreshold;
	this.clearAll = prevSFD !== this.showFeatureDetails;
    }

    //----------------------------------------------
    // Updates the ZoomView to show the given coordinate range from the reg genome and the corresponding
    // range(s) in each comparison genome.
    //
    updateViaMappedCoordinates (coords) {
	let c = (coords || this.app.coords);
	d3.select('#zoomCoords')[0][0].value = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["e" /* formatCoords */])(c.chr, c.start, c.end);
	d3.select('#zoomWSize')[0][0].value = Math.round(c.end - c.start + 1)
	//
        let mgv = this.app;
	// Issue requests for features. One request per genome, each request specifies one or more
	// coordinate ranges.
	// Wait for all the data to become available, then draw.
	//
	let promises = [];

	//
	this.setShowFeatureDetails(c);

	// First request is for the the reference genome. Get all the features in the range.
	promises.push(mgv.featureManager.getFeaturesByRange(mgv.rGenome, [{
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
	    ori    : '+',
	    blockId: mgv.rGenome.name
	}], this.showFeatureDetails));
	if (! this.root.classed('closed')) {
	    // Add a request for each comparison genome, using translated coordinates. 
	    mgv.cGenomes.forEach(cGenome => {
		let ranges = mgv.translator.translate( mgv.rGenome, c.chr, c.start, c.end, cGenome );
		let p = mgv.featureManager.getFeaturesByRange(cGenome, ranges, this.showFeatureDetails);
		promises.push(p);
	    });
	}
	return Promise.all(promises)
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
	    let fdelta = (f.strand === '-' ? 1 : -1) * f.length / 2;
	    let range = {
		genome:	f.genome,
		chr:	f.chr,
		chromosome: f.genome.getChromosome(f.chr),
		start:	start + fdelta,
		end:	end + fdelta
	    } ;
	    if (f.genome === mgv.rGenome) {
		let c = this.app.coords = range;
		d3.select('#zoomCoords')[0][0].value = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["e" /* formatCoords */])(c.chr, c.start, c.end);
		d3.select('#zoomWSize')[0][0].value = Math.round(c.end - c.start + 1)
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
		//
		this.setShowFeatureDetails(r);
		//
	        rrs = [{
		    chr    : r.chr,
		    start  : r.start,
		    end    : r.end,
		    index  : 0,
		    fChr   : r.chr,
		    fStart : r.start,
		    fEnd   : r.end,
		    fIndex  : 0,
		    ori    : '+',
		    blockId: mgv.rGenome.name
		}];
	    }
	    else { 
		// turn the single range into a range for each overlapping synteny block with the ref genome
	        rrs = mgv.translator.translate(r.genome, r.chr, r.start, r.end, mgv.rGenome, true);
	    }
	    return mgv.featureManager.getFeaturesByRange(r.genome, rrs, this.showFeatureDetails);
	});
	// For each genome where the landmark does not exist, compute a mapped range (as in mapped cmode).
	if (!this.root.classed('closed'))
	    mgv.cGenomes.forEach(g => {
		if (! seenGenomes.has(g)) {
		    let rrs = mgv.translator.translate(mgv.rGenome, rCoords.chr, rCoords.start, rCoords.end, g);
		    promises.push( mgv.featureManager.getFeaturesByRange(g, rrs, this.showFeatureDetails) );
		}
	    });
	// When all the data is ready, draw.
	return Promise.all(promises);
    }
    //
    update (cfg) {
	this.cfg = cfg || this.cfg;
	this.highlighted = this.cfg.highlight;
	this.genomes = this.cfg.genomes;
	this.dmode = this.cfg.dmode;
	this.cmode = this.cfg.cmode;
	this.app.translator.ready().then(() => {
	    let p;
	    if (this.cmode === 'mapped')
		p = this.updateViaMappedCoordinates(this.app.coords);
	    else
		p = this.updateViaLandmarkCoordinates(this.app.lcoords);
	    p.then( data => {
		this.draw(this.mungeData(data));
	    });
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
		nb.ori = '+'
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
	    if (this.dmode === 'comparison') {
		gdata.blocks.sort( (a,b) => a.index - b.index );
		gdata.blocks = gdata.blocks.reduce(merger,[]);
	    }
	    else {
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
	    }
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
    //     feature_data = { ID, canonical, symbol, chr, start, end, strand, type, biotype }
    //
    // Again, in English:
    //  - data is a list of items, one per strip to be displayed. Item[0] is data for the ref genome.
    //    Items[1+] are data for the comparison genome.
    //  - each strip item is an object containing a genome and a list of blocks. Item[0] always has 
    //    a single block.
    //  - each block is an object containing a chromosome, start, end, orientation, etc, and a list of features.
    //  - each feature has chr,start,end,strand,type,biotype,ID
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
        data.forEach(gData => {
	    gData.blocks = this.uniqifyBlocks(gData.blocks)
	    // Each strip is independently scrollable. Init its offset (in bytes).
	    gData.deltaB = 0;
	    // Each strip is independently scalable. Init scale.
	    gData.xScale = 1.0;
	});
	data = this.mergeSblockRuns(data);
	// 
	data.forEach( gData => {
	  // minimum of 3 lanes on each side
	  gData.maxLanesP = 3;
	  gData.maxLanesN = 3;
	  gData.blocks.forEach( sb=> {
	    sb.features.forEach(f => {
		if (f.lane > 0)
		    gData.maxLanesP = Math.max(gData.maxLanesP, f.lane)
		else
		    gData.maxLanesN = Math.max(gData.maxLanesN, -f.lane)
	    });
	  });
	  if (gData.blocks.length > 1)
	      gData.blocks = gData.blocks.filter(b=>b.features.length > 0);
	  gData.stripHeight = 15 + this.laneHeight * (gData.maxLanesP + gData.maxLanesN);
	  gData.zeroOffset = this.laneHeight * gData.maxLanesP;
	});
	return data;
    }

    //----------------------------------------------
    // Orders sblocks horizontally within each genome. Translates them into position.
    //
    layoutSBlocks (sblocks) {
	// Sort the sblocks in each strip according to the current drawing mode.
	let cmpField = this.dmode === 'comparison' ? 'index' : 'fIndex';
	let cmpFunc = (a,b) => a.__data__[cmpField]-b.__data__[cmpField];
	sblocks.forEach( strip => strip.sort( cmpFunc ) );
	let pstart = []; // offset (in pixels) of start position of next block, by strip index (0===ref)
	let bstart = []; // block start pos (in bp) assoc with pstart
	let cchr = null;
	let self = this;
	let GAP  = 16;   // length of gap between blocks of diff chroms.
	let dx;
	let pend;
	sblocks.each( function (b,i,j) { // b=block, i=index within strip, j=strip index
	    let gd = this.__data__.genome;
	    let blen = self.ppb * (b.end - b.start + 1); // total screen width of this sblock
	    b.flip = b.ori === '-' && self.dmode === 'reference';
	    b.xscale = d3.scale.linear().domain([b.start, b.end]).range( b.flip ? [blen, 0] : [0, blen] );
	    //
	    if (i===0) {
		// first block in each strip inits
		pstart[j] = 0;
		gd.pwidth = blen;
		bstart[j] = b.start;
		dx = 0;
		cchr = b.chr;
	    }
	    else {
		gd.pwidth += blen;
		dx = b.chr === cchr ? pstart[j] + self.ppb * (b.start - bstart[j]) : Infinity;
		if (dx < 0 || dx > self.maxSBgap) {
		    // Changed chr or jumped a large gap
		    pstart[j] = pend + GAP;
		    bstart[j] = b.start;
		    gd.pwidth += GAP;
		    dx = pstart[j];
		    cchr = b.chr;
		}
	    }
	    pend = dx + blen;
	    d3.select(this).attr('transform', `translate(${dx},0)`);
	});
	this.squish();
    }

    //----------------------------------------------
    // Scales each zoom strip horizontally to fit the width. Only scales down.
    squish () {
        let sbs = d3.selectAll('.zoomStrip [name="sBlocks"]');
	let self = this;
	sbs.each(function (sb,i) {
	    if (sb.genome.pwidth > self.width) {
	        let s = self.width / sb.genome.pwidth;
		sb.xScale = s;
		let t = d3.select(this);
		t.attr('transform', ()=> `translate(${-sb.deltaB * self.ppb},0)scale(${sb.xScale},1)`);
	    }
	});
    }
    //----------------------------------------------
    // Draws the zoom view panel with the given data.
    //
    draw (data) {
	// 
	let self = this;
        // Is ZoomView currently closed?
	let closed = this.root.classed('closed');
	// Show ref genome name
	d3.select('#zoomView .zoomCoords label')
	    .text(this.app.rGenome.label + ' coords');
	// Show landmark label, if applicable
	let lmtxt = '';
	if (this.cmode === 'landmark') {
	    let rf = this.app.lcoords.landmarkRefFeat;
	    let d = this.app.lcoords.delta;
	    let dtxt = d ? ` (${d > 0 ? '+' : ''}${Object(__WEBPACK_IMPORTED_MODULE_2__utils__["k" /* prettyPrintBases */])(d)})` : '';
	    lmtxt = `Aligned on ${rf.symbol || rf.id}${dtxt}`;
	}
	// disable the R/C button in landmark mode
	this.root.selectAll('[name="zoomcontrols"] [name="zoomDmode"] .button')
	    .attr('disabled', this.cmode === 'landmark' || null);
	// display landmark text
	d3.select('#zoomView .zoomCoords span').text( lmtxt );
	
	// the reference genome block (always just 1 of these).
	let rData = data.filter(dd => dd.genome === this.app.rGenome)[0];
	let rBlock = rData.blocks[0];

	// x-scale and x-axis based on the ref genome.
	this.xscale = d3.scale.linear()
	    .domain([rBlock.start,rBlock.end])
	    .range([0,this.width]);
	//
	// pixels per base
	this.ppb = this.width / (this.app.coords.end - this.app.coords.start + 1);

        // -----------------------------------------------------
	// draw the coordinate axis
        // -----------------------------------------------------
	this.axisFunc = d3.svg.axis()
	    .scale(this.xscale)
	    .orient('top')
	    .outerTickSize(2)
	    .ticks(5)
	    .tickSize(5)
	    ;
	this.axis.call(this.axisFunc);

        // -----------------------------------------------------
	// zoom strips (one per genome)
        // -----------------------------------------------------
        let zstrips = this.stripsGrp
	        .selectAll('g.zoomStrip')
		.data(data, d => d.genome.name);
	// Create the group
	let newzs = zstrips.enter()
	        .append('g')
		.attr('class','zoomStrip')
		.attr('name', d => d.genome.name)
		.on('click', function (g) {
		    self.highlightStrip(g.genome, this);
		})
		.call(this.dragger)
		;
	//
	// Strip label
	newzs.append('text')
	    .attr('name', 'genomeLabel')
	    .text( d => d.genome.label)
	    .attr('x', 0)
	    .attr('y', this.blockHeight/2 + 20)
	    .attr('font-family','sans-serif')
	    .attr('font-size', 10)
	    ;
	// Strip underlay
	newzs.append('rect')
	    .attr('class','underlay')
	    .attr('y', -this.blockHeight/2)
	    .attr('height', this.blockHeight)
	    .style('width','100%')
	    .style('opacity',0)
	    ;
	// Group for sBlocks
	newzs.append('g')
	    .attr('name', 'sBlocks');
	// Strip end cap
	newzs.append('rect')
	    .attr('class', 'material-icons zoomStripEndCap')
	    .attr('x', -15)
	    .attr('y', -this.blockHeight / 2)
	    .attr('width', 15)
	    .attr('height', this.blockHeight + 10)
	    ;
	// Strip drag-handle
	newzs.append('text')
	    .attr('class', 'material-icons zoomStripHandle')
	    .style('font-size', '18px')
	    .attr('x', -15)
	    .attr('y', 9)
	    .text('drag_indicator')
	    .append('title')
	        .text('Drag up/down to reorder the genomes.')
	    ;
	// translate strips into position
	let offset = this.topOffset;
	let rHeight = 0;
	this.app.vGenomes.forEach( vg => {
	    let s = this.stripsGrp.select(`.zoomStrip[name="${vg.name}"]`);
	    s.classed('reference', d => d.genome === this.app.rGenome)
	        .attr('transform', d => {
		    //return `translate(0,${closed ? this.topOffset : g.genome.zoomY})`
		    if (d.genome === this.app.rGenome)
		        rHeight = d.stripHeight + d.zeroOffset;
		    let o = offset + d.zeroOffset;
		    d.zoomY = offset;
		    offset += d.stripHeight + this.stripGap;
		    return `translate(0,${closed ? this.topOffset+d.zeroOffset : o})`
		});
	});
	// reset the svg size based on strip widths
	this.svg.attr('height', (closed ? rHeight : offset) + 15);

        zstrips.exit()
	    .on('.drag', null)
	    .remove();
	//
        zstrips.select('g[name="sBlocks"]')
	    .attr('transform', g => `translate(${g.deltaB * this.ppb},0)`)
	    ;
	// ---- Synteny super blocks ----
        let sblocks = zstrips.select('[name="sBlocks"]').selectAll('g.sBlock')
	    .data(d=>d.blocks, b => b.blockId);
	let newsbs = sblocks.enter()
	    .append('g')
	    .attr('class', 'sBlock')
	    .attr('name', b=>b.index)
	    ;
	let l0 = newsbs.append('g').attr('name', 'layer0');
	let l1 = newsbs.append('g').attr('name', 'layer1');

	//
	this.layoutSBlocks(sblocks);

	// rectangle for each individual synteny block
	let sbrects = sblocks.select('g[name="layer0"]').selectAll('rect.block').data(d=> {
	    d.sblocks.forEach(b=>b.xscale = d.xscale);
	    return d.sblocks
	    }, sb=>sb.index);
        sbrects.enter().append('rect').append('title');
	sbrects.exit().remove();
	sbrects
	   .attr('class', b => 'block ' + 
	       (b.ori==='+' ? 'plus' : b.ori==='-' ? 'minus': 'confused') + 
	       (b.chr !== b.fChr ? ' translocation' : ''))
	   .attr('x',     b => b.xscale(b.flip ? b.end : b.start))
	   .attr('y',     b => -this.blockHeight / 2)
	   .attr('width', b => Math.max(4, Math.abs(b.xscale(b.end)-b.xscale(b.start))))
	   .attr('height',this.blockHeight);
	   ;
	sbrects.select('title')
	   .text( b => {
	       let adjectives = [];
	       b.ori === '-' && adjectives.push('inverted');
	       b.chr !== b.fChr && adjectives.push('translocated');
	       return adjectives.length ? adjectives.join(', ') + ' block' : '';
	   });

	// the axis line
	l0.append('line').attr('class','axis');
	
	sblocks.select('line.axis')
	    .attr('x1', b => b.xscale(b.start))
	    .attr('y1', 0)
	    .attr('x2', b => b.xscale(b.end))
	    .attr('y2', 0)
	    ;
	// label
	l0.append('text')
	    .attr('class','blockLabel') ;
	// brush
	l0.append('g').attr('class','brush');
	//
	sblocks.exit().remove();

	// synteny block labels
	sblocks.select('text.blockLabel')
	    .text( b => b.chr )
	    .attr('x', b => (b.xscale(b.start) + b.xscale(b.end))/2 )
	    .attr('y', this.blockHeight / 2 + 10)
	    ;

	// brush
	sblocks.select('g.brush')
	    .attr('transform', b => `translate(0,${this.blockHeight / 2})`)
	    .on('mousemove', function(b) {
	        let cr = this.getBoundingClientRect();
		let x = d3.event.clientX - cr.x;
		let c = Math.round(b.xscale.invert(x));
		self.showFloatingText(`${b.chr}:${c}`, d3.event.clientX, d3.event.clientY);
	    })
	    .on('mouseout', b => this.hideFloatingText())
	    .each(function(b) {
		if (!b.brush) {
		    b.brush = d3.svg.brush()
			.on('brushstart', function(){ self.bbStart( b, this ); })
			.on('brush',      function(){ self.bbBrush( b, this ); })
			.on('brushend',   function(){ self.bbEnd( b, this ); })
		}
		b.brush.x(b.xscale).clear();
		d3.select(this).call(b.brush);
	    })
	    .selectAll('rect')
		.attr('height', 10);

	this.drawFeatures(sblocks);

	//
	this.app.facetManager.applyAll();

	// We need to let the view render before doing the highlighting, since it depends on
	// the positions of rectangles in the scene.
	window.setTimeout(() => {
	    this.highlight();
	}, 150);
    };

    //----------------------------------------------
    // Draws the features (rectangles) for the specified synteny blocks.
    // Args:
    //     sblocks (D3 selection of g.sblock nodes) - multilevel selection.
    //        Array (corresponding to strips) of arrays of synteny blocks.
    //     detailed (boolean) if true, draws each feature in full detail (ie,
    //        show exon structure if available). Otherwise (the default), draw
    //        each feature as just a rectangle.
    //
    drawFeatures (sblocks) {
	// before doing anything else...
	if (this.clearAll)
	    sblocks.selectAll('.feature').remove();
	// ok, now that's taken care of...
        let self = this;
	//
	// never draw the same feature twice in one rendering pass
	let drawn = new Set();	// set of IDs of drawn features
	let filterDrawn = function (f) {
	    // returns true if we've not seen this one before.
	    // registers that we've seen it.
	    let fid = f.ID;
	    let v = ! drawn.has(fid);
	    drawn.add(fid);
	    return v;
	};
	//
	let feats = sblocks.select('[name="layer1"]').selectAll('.feature')
	    .data(d=>d.features.filter(filterDrawn), d=>d.ID);
	feats.exit().remove();
	//
	let newFeats;
	if (this.showFeatureDetails) {
	    // draw detailed features
	    newFeats = feats.enter().append('g')
		.attr('class', f => 'feature detailed ' + (f.strand==='-' ? ' minus' : ' plus'))
		.attr('name', f => f.ID)
		;
	    newFeats.append('rect')
		.style('fill', f => self.app.cscale(f.getMungedType()))
		;
	    newFeats.append('line')
	        .attr('class','axis')
	        ;
	    newFeats.append('g')
	        .attr('class','exons')
		;
	}
	else {
	    // draw simple features
	    newFeats = feats.enter().append('rect')
		.attr('class', f => 'feature' + (f.strand==='-' ? ' minus' : ' plus'))
		.attr('name', f => f.ID)
		.style('fill', f => self.app.cscale(f.getMungedType()))
		;
	}
	// NB: if you are looking for click handlers, they are at the svg level (see initDom above).

	// returns the synteny block containing this feature
	let fBlock = function (featElt) {
	    let blkElt = featElt.closest('.sBlock');
	    return blkElt.__data__;
	}
	// Returns the scene x coordinate for the given feature.
	let fx = function(f) {
	    let b = fBlock(this);
	    return b.xscale(Math.max(f.start,b.start))
	};
	// Returns the scene width for the given feature.
	let fw = function (f) {
	    let b = fBlock(this);
	    if (f.end < b.start || f.start > b.end) return 0;
	    return Math.abs(b.xscale(Math.min(f.end,b.end)) - b.xscale(Math.max(f.start,b.start))) + 1;
	};
	// Returns the scene y coordinate (px) for the given feature.
	let fy = function (f) {
	       let b = fBlock(this);
	       if (f.strand == '+'){
		   if (b.flip) 
		       return self.laneHeight*f.lane - self.featHeight; 
		   else 
		       return -self.laneHeight*f.lane;
	       }
	       else {
		   // f.lane is negative for '-' strand
		   if (b.flip) 
		       return self.laneHeight*f.lane;
		   else
		       return -self.laneHeight*f.lane - self.featHeight; 
	       }
	   };

	// Set position and size attributes of the overall feature rect.
	(this.showFeatureDetails ? feats.select('rect') : feats)
	  .attr('x', fx)
	  .attr('y', fy)
	  .attr('width', fw)
	  .attr('height', this.featHeight)
	  ;

	// draw detailed feature
	if (this.showFeatureDetails) {
	    // draw axis line
	    feats.select('line')
	        .attr('x1', fx)
		.attr('y1', fy)
		.attr('x2', function (f) { return fx.bind(this)(f) + fw.bind(this)(f) - 1 })
		.attr('y2', fy)
		.attr('transform',`translate(0,${this.featHeight/2})`)
		.attr('stroke', f => this.app.cscale(f.getMungedType()))
		;
	    // draw exons
	    let fData = feats.data();
	    let geneIds = fData.map(f => f.ID);
	    let egrps = feats.select('g.exons');
	    let exons = egrps.selectAll('.exon')
		.data(f => f.exons || [], e => e.ID)
		;
	    exons.enter().append('rect')
		.attr('class','exon')
		.style('fill', e => this.app.cscale(e.feature.getMungedType()))
		.append('title')
		    .text(e => e.ID)
		    ;
	    exons.exit().remove();
	    exons.attr('name', e => e.primaryIdentifier)
	        .attr('x', fx)
	        .attr('y', function(e) {return fy.bind(this)(e.feature)})
	        .attr('width', fw)
	        .attr('height', this.featHeight)
		;
	}
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
	let hiFeats = Object.assign({}, this.hiFeats, this.app.currListIndex ||{});
	if (currFeat) {
	    hiFeats[currFeat.id] = currFeat.id;
	}

	// Filter all features (rectangles) in the scene for those being highlighted.
	// Along the way, build index mapping feature id to its 'stack' of equivalent features,
	// i.e. a list of its genologs sorted by y coordinate.
	//
	this.stacks = {}; // fid -> [ rects ] 
	let dh = this.blockHeight/2 - this.featHeight;
        let feats = this.svgMain.selectAll('.feature')
	  // filter rect.features for those in the highlight list
	  .filter(function(ff){
	      // highlight ff if either id is in the list AND it's not been hidden
	      let mgi = hiFeats[ff.canonical];
	      let mgp = hiFeats[ff.ID];
	      let showing = d3.select(this).style('display') !== 'none';
	      let hl = showing && (mgi || mgp);
	      if (hl) {
		  // for each highlighted feature, add its rectangle to the list
		  let k = ff.id;
		  if (!self.stacks[k]) self.stacks[k] = []
		  // if showing feature details, .feature is a group with the rect as the first child.
		  // otherwise, .feature is the rect itself.
		  self.stacks[k].push(this.tagName === 'g' ? this.childNodes[0] : this)
	      }
	      // 
	      d3.select(this)
		  .classed('highlight', hl)
		  .classed('current', hl && currFeat && this.__data__.id === currFeat.id)
		  .classed('extra', pulseCurrent && ff === currFeat)
	      return hl;
	  })
	  ;

	this.drawFiducials(currFeat);

    }

    //----------------------------------------------
    // Draws polygons that connect highlighted features in the view
    //
    drawFiducials (currFeat) {
	// build data array for drawing fiducials between equivalent features
	let data = [];
	for (let k in this.stacks) {
	    // for each highlighted feature, sort the rectangles in its list by Y-coordinate
	    let rects = this.stacks[k];
	    rects.sort( (a,b) => parseFloat(a.getAttribute('y')) - parseFloat(b.getAttribute('y')) );
	    rects.sort( (a,b) => {
		return a.__data__.genome.zoomY - b.__data__.genome.zoomY;
	    });
	    // Want a polygon between each successive pair of items. The following creates a list of
	    // n pairs, where rect[i] is paired with rect[i+1]. The last pair consists of the last
	    // rectangle paired with undefined. (We want this.)
	    let pairs = rects.map((r, i) => [r,rects[i+1]]);
	    // Add a class ('current') for the polygons associated with the mouseover feature so they
	    // can be distinguished from others.
	    data.push({ fid: k, rects: pairs, cls: (currFeat && currFeat.id === k ? 'current' : '') });
	}

	let self = this;
	//
	// put fiducial marks in their own group 
	let fGrp = this.fiducials.classed('hidden', false);

	// Bind first level data to 'featureMarks' groups
	let ffGrps = fGrp.selectAll('g.featureMarks')
	    .data(data, d => d.fid);
	ffGrps.enter().append('g')
	    .attr('name', d => d.fid);
	ffGrps.exit().remove();
	//
	ffGrps.attr('class', d => {
            let classes = ['featureMarks'];
	    d.cls && classes.push(d.cls);
	    this.app.currListIndex[d.fid] && classes.push('listItem')
	    return classes.join(' ');
	});

	// -------------------------------------
	// Draw the connector polygons.
	// Bind second level data (rectangle pairs) to polygons in the group
	let pgons = ffGrps.selectAll('polygon')
	    .data(d=>d.rects.filter(r => r[0] && r[1]));
	pgons.enter().append('polygon')
	    .attr('class','fiducial')
	    ;
	//
	pgons.attr('points', r => {
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
	.on('mouseover', (p) => {
	    this.highlight(p[0]);
	})
	.on('mouseout',  (p) => {
	    this.highlight();
	});
	//
	pgons.exit().remove();
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
	  .attr('x', d => d.trect.x + d.trect.width/2 )
	  .attr('y', d => d.rect.__data__.genome.zoomY+15)
	  .text(d => {
	       let f = d.rect.__data__;
	       let sym = f.symbol || f.ID;
	       return sym;
	  });

	// Put a rectangle behind each label as a background
	let lblBoxData = labels.map(lbl => lbl[0].getBBox())
	let lblBoxes = ffGrps.selectAll('rect.featLabelBox')
	    .data((d,i) => [lblBoxData[i]]);
	lblBoxes.enter().insert('rect','text').attr('class','featLabelBox');
	lblBoxes.exit().remove();
	lblBoxes
	    .attr('x',      bb => bb.x-2)
	    .attr('y',      bb => bb.y-1)
	    .attr('width',  bb => bb.width+4)
	    .attr('height', bb => bb.height+2)
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
	this.svgMain.select('g.fiducials')
	    .classed('hidden', true);
    }
} // end class ZoomView




/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjAyM2Y3ZjcyNjg3OGVkNDBmNmYiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0tleVN0b3JlLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GZWF0dXJlLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvU1ZHVmlldy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvdmlld2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9NR1ZBcHAuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZS5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2lkYi1rZXl2YWwvZGlzdC9pZGIta2V5dmFsLm1qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvUXVlcnlNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9BdXhEYXRhTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvTGlzdE1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RGb3JtdWxhRXZhbHVhdG9yLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0RWRpdG9yLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GYWNldE1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZhY2V0LmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9CVE1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0Jsb2NrVHJhbnNsYXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvR2Vub21lVmlldy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZURldGFpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL1pvb21WaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1REE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsb0RBQW9EO0FBQ2hGLFNBQVM7QUFDVCxLQUFLLEU7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsb0RBQW9EO0FBQ2hGLFNBQVM7QUFDVCxLQUFLLEU7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsb0RBQW9EO0FBQ2hGLFNBQVM7QUFDVCxLQUFLLEU7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixtREFBbUQ7QUFDbkU7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsSUFBSSxHQUFHLE1BQU0sSUFBSSxJQUFJO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBLG1CQUFtQixJQUFJLEdBQUcsSUFBSTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsRUFBRTtBQUNwQjtBQUNBO0FBQ0Esa0JBQWtCLG9CQUFvQjtBQUN0QztBQUNBO0FBQ0Esa0JBQWtCLHVCQUF1QjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBc0JBOzs7Ozs7OztBQzNYQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7Ozs7QUNyQm9DOztBQUU1Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLG9CQUFvQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELElBQUk7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7OztBQ3JEUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7O0FDcEZSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixrQkFBa0IsR0FBRyxtQkFBbUIsR0FBRyxvQkFBb0I7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsUztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVDQUF1QyxTQUFTLFdBQVcsSUFBSTtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7Ozs7QUMvRlk7O0FBRXBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQiw4Q0FBOEM7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxrQkFBa0IsR0FBRyxpQkFBaUIsV0FBVyxjQUFjLGNBQWMsb0JBQW9CLEdBQUcsb0JBQW9CO0FBQ3RLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSx5Q0FBeUM7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsYUFBYTtBQUNuQztBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isb0JBQW9CO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixtQkFBbUI7QUFDekM7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7Ozs7O0FDckVTO0FBQ0k7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCLGFBQWEsaUJBQWlCO0FBQzNEOzs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFHNEU7QUFDM0Q7QUFDRztBQUNLO0FBQ0Y7QUFDRDtBQUNEO0FBQ0U7QUFDSDtBQUNDO0FBQ0k7QUFDTjtBQUNBOztBQUVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJEO0FBQzNEO0FBQ0EsdUJBQXVCO0FBQ3ZCLHdCQUF3QjtBQUN4QixxQkFBcUI7QUFDckI7QUFDQSxzQkFBc0I7QUFDdEIscUJBQXFCO0FBQ3JCLG9CQUFvQjtBQUNwQixvQkFBb0I7QUFDcEI7QUFDQSxnQkFBZ0I7QUFDaEIsc0JBQXNCO0FBQ3RCO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsMkNBQTJDO0FBQzNELGlCQUFpQiw0Q0FBNEM7O0FBRTdEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0EsMEJBQTBCLDBDQUEwQyxZQUFZLEVBQUUsSUFBSTtBQUN0RjtBQUNBO0FBQ0EsMEJBQTBCLDRDQUE0QyxZQUFZLEVBQUUsSUFBSTs7QUFFeEY7QUFDQSx5SEFBaUUsT0FBTztBQUN4RTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTTtBQUNOLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLHlCQUF5Qix3QkFBd0IsRUFBRTs7QUFFbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBLEdBQUc7QUFDSCxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isa0JBQWtCO0FBQ3hDLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxzQkFBc0Isa0JBQWtCO0FBQ3hDLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFLEVBQUU7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsTUFBTTtBQUNOLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxvQkFBb0I7QUFDckQsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsUUFBUSxVQUFVLEVBQUUsSUFBSTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsRUFBRTtBQUNsQixpQkFBaUIsS0FBSyxHQUFHLEVBQUU7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUIsR0FBRyxnQkFBZ0IsR0FBRyxhQUFhO0FBQ3BFLGlCQUFpQixjQUFjLEdBQUcsZ0JBQWdCLEdBQUcsZ0JBQWdCO0FBQ3JFO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsYUFBYTtBQUNsRTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFTzs7Ozs7Ozs7OztBQzdTb0I7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7Ozs7Ozs7QUNuRXFEO0FBQ3pDO0FBQ1E7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7Ozs7QUNqT1E7O0FBRWhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTzs7Ozs7Ozs7QUM3QlI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7Ozs7Ozs7QUNwQlE7QUFDVTtBQUNQOztBQUVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLE1BQU0sTUFBTSxNQUFNO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsbUJBQW1CO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxJQUFJO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTzs7Ozs7Ozs7QUM5R1I7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSx3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxHQUFHO0FBQzFEO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLGtDQUFrQztBQUM5RDtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGtCQUFrQixHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMERBQTBEO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix3REFBd0Q7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxXO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsMkNBQTJDLEVBQUU7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTyIsImZpbGUiOiJtZ3YuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZjAyM2Y3ZjcyNjg3OGVkNDBmNmYiLCJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gICAgICAgICAgICAgICAgICAgIFVUSUxTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAoUmUtKUluaXRpYWxpemVzIGFuIG9wdGlvbiBsaXN0LlxuLy8gQXJnczpcbi8vICAgc2VsZWN0b3IgKHN0cmluZyBvciBOb2RlKSBDU1Mgc2VsZWN0b3Igb2YgdGhlIGNvbnRhaW5lciA8c2VsZWN0PiBlbGVtZW50LiBPciB0aGUgZWxlbWVudCBpdHNlbGYuXG4vLyAgIG9wdHMgKGxpc3QpIExpc3Qgb2Ygb3B0aW9uIGRhdGEgb2JqZWN0cy4gTWF5IGJlIHNpbXBsZSBzdHJpbmdzLiBNYXkgYmUgbW9yZSBjb21wbGV4LlxuLy8gICB2YWx1ZSAoZnVuY3Rpb24gb3IgbnVsbCkgRnVuY3Rpb24gdG8gcHJvZHVjZSB0aGUgPG9wdGlvbj4gdmFsdWUgZnJvbSBhbiBvcHRzIGl0ZW1cbi8vICAgICAgIERlZmF1bHRzIHRvIHRoZSBpZGVudGl0eSBmdW5jdGlvbiAoeD0+eCkuXG4vLyAgIGxhYmVsIChmdW5jdGlvbiBvciBudWxsKSBGdW5jdGlvbiB0byBwcm9kdWNlIHRoZSA8b3B0aW9uPiBsYWJlbCBmcm9tIGFuIG9wdHMgaXRlbVxuLy8gICAgICAgRGVmYXVsdHMgdG8gdGhlIHZhbHVlIGZ1bmN0aW9uLlxuLy8gICBtdWx0aSAoYm9vbGVhbikgU3BlY2lmaWVzIGlmIHRoZSBsaXN0IHN1cHBvcnQgbXVsdGlwbGUgc2VsZWN0aW9ucy4gKGRlZmF1bHQgPSBmYWxzZSlcbi8vICAgc2VsZWN0ZWQgKGZ1bmN0aW9uIG9yIG51bGwpIEZ1bmN0aW9uIHRvIGRldGVybWluZSBpZiBhIGdpdmVuIG9wdGlvbiBpcyBzZWxlY3RkLlxuLy8gICAgICAgRGVmYXVsdHMgdG8gZD0+RmFsc2UuIE5vdGUgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIG9ubHkgYXBwbGllZCB0byBuZXcgb3B0aW9ucy5cbi8vICAgc29ydEJ5IChmdW5jdGlvbikgT3B0aW9uYWwuIElmIHByb3ZpZGVkLCBhIGNvbXBhcmlzb24gZnVuY3Rpb24gdG8gdXNlIGZvciBzb3J0aW5nIHRoZSBvcHRpb25zLlxuLy8gICBcdCBUaGUgY29tcGFyaXNvbiBmdW5jdGlvbiBpcyBwYXNzZXMgdGhlIGRhdGEgb2JqZWN0cyBjb3JyZXNwb25kaW5nIHRvIHR3byBvcHRpb25zIGFuZCBzaG91bGRcbi8vICAgXHQgcmV0dXJuIC0xLCAwIG9yICsxLiBJZiBub3QgcHJvdmlkZWQsIHRoZSBvcHRpb24gbGlzdCB3aWxsIGhhdmUgdGhlIHNhbWUgc29ydCBvcmRlciBhcyB0aGUgb3B0cyBhcmd1bWVudC5cbi8vIFJldHVybnM6XG4vLyAgIFRoZSBvcHRpb24gbGlzdCBpbiBhIEQzIHNlbGVjdGlvbi5cbmZ1bmN0aW9uIGluaXRPcHRMaXN0KHNlbGVjdG9yLCBvcHRzLCB2YWx1ZSwgbGFiZWwsIG11bHRpLCBzZWxlY3RlZCwgc29ydEJ5KSB7XG5cbiAgICAvLyBzZXQgdXAgdGhlIGZ1bmN0aW9uc1xuICAgIGxldCBpZGVudCA9IGQgPT4gZDtcbiAgICB2YWx1ZSA9IHZhbHVlIHx8IGlkZW50O1xuICAgIGxhYmVsID0gbGFiZWwgfHwgdmFsdWU7XG4gICAgc2VsZWN0ZWQgPSBzZWxlY3RlZCB8fCAoeCA9PiBmYWxzZSk7XG5cbiAgICAvLyB0aGUgPHNlbGVjdD4gZWx0XG4gICAgbGV0IHMgPSBkMy5zZWxlY3Qoc2VsZWN0b3IpO1xuXG4gICAgLy8gbXVsdGlzZWxlY3RcbiAgICBzLnByb3BlcnR5KCdtdWx0aXBsZScsIG11bHRpIHx8IG51bGwpIDtcblxuICAgIC8vIGJpbmQgdGhlIG9wdHMuXG4gICAgbGV0IG9zID0gcy5zZWxlY3RBbGwoXCJvcHRpb25cIilcbiAgICAgICAgLmRhdGEob3B0cywgbGFiZWwpO1xuICAgIG9zLmVudGVyKClcbiAgICAgICAgLmFwcGVuZChcIm9wdGlvblwiKSBcbiAgICAgICAgLmF0dHIoXCJ2YWx1ZVwiLCB2YWx1ZSlcbiAgICAgICAgLnByb3BlcnR5KFwic2VsZWN0ZWRcIiwgbyA9PiBzZWxlY3RlZChvKSB8fCBudWxsKVxuICAgICAgICAudGV4dChsYWJlbCkgXG4gICAgICAgIDtcbiAgICAvL1xuICAgIG9zLmV4aXQoKS5yZW1vdmUoKSA7XG5cbiAgICAvLyBzb3J0IHRoZSByZXN1bHRzXG4gICAgaWYgKCFzb3J0QnkpIHNvcnRCeSA9IChhLGIpID0+IHtcbiAgICBcdGxldCBhaSA9IG9wdHMuaW5kZXhPZihhKTtcblx0bGV0IGJpID0gb3B0cy5pbmRleE9mKGIpO1xuXHRyZXR1cm4gYWkgLSBiaTtcbiAgICB9XG4gICAgb3Muc29ydChzb3J0QnkpO1xuXG4gICAgLy9cbiAgICByZXR1cm4gcztcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcm9taXNpZmllcyBhIGNhbGwgdG8gZDMudHN2LlxuLy8gQXJnczpcbi8vICAgdXJsIChzdHJpbmcpIFRoZSB1cmwgb2YgdGhlIHRzdiByZXNvdXJjZVxuLy8gUmV0dXJuczpcbi8vICAgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGxpc3Qgb2Ygcm93IG9iamVjdHNcbmZ1bmN0aW9uIGQzdHN2KHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZDMudHN2KHVybCwgZnVuY3Rpb24oZXJyb3IsIHZhbCl7XG4gICAgICAgICAgICBlcnJvciA/IHJlamVjdCh7IHN0YXR1czogZXJyb3Iuc3RhdHVzLCBzdGF0dXNUZXh0OiBlcnJvci5zdGF0dXNUZXh0fSkgOiByZXNvbHZlKHZhbCk7XG4gICAgICAgIH0pICBcbiAgICB9KTsgXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJvbWlzaWZpZXMgYSBjYWxsIHRvIGQzLmpzb24uXG4vLyBBcmdzOlxuLy8gICB1cmwgKHN0cmluZykgVGhlIHVybCBvZiB0aGUganNvbiByZXNvdXJjZVxuLy8gUmV0dXJuczpcbi8vICAgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGpzb24gb2JqZWN0IHZhbHVlLCBvciByZWplY3RzIHdpdGggYW4gZXJyb3JcbmZ1bmN0aW9uIGQzanNvbih1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGQzLmpzb24odXJsLCBmdW5jdGlvbihlcnJvciwgdmFsKXtcbiAgICAgICAgICAgIGVycm9yID8gcmVqZWN0KHsgc3RhdHVzOiBlcnJvci5zdGF0dXMsIHN0YXR1c1RleHQ6IGVycm9yLnN0YXR1c1RleHR9KSA6IHJlc29sdmUodmFsKTtcbiAgICAgICAgfSkgIFxuICAgIH0pOyBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcm9taXNpZmllcyBhIGNhbGwgdG8gZDMudGV4dC5cbi8vIEFyZ3M6XG4vLyAgIHVybCAoc3RyaW5nKSBUaGUgdXJsIG9mIHRoZSB0ZXh0IHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUganNvbiBvYmplY3QgdmFsdWUsIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvclxuZnVuY3Rpb24gZDN0ZXh0KHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZDMudGV4dCh1cmwsICd0ZXh0L3BsYWluJywgZnVuY3Rpb24oZXJyb3IsIHZhbCl7XG4gICAgICAgICAgICBlcnJvciA/IHJlamVjdCh7IHN0YXR1czogZXJyb3Iuc3RhdHVzLCBzdGF0dXNUZXh0OiBlcnJvci5zdGF0dXNUZXh0fSkgOiByZXNvbHZlKHZhbCk7XG4gICAgICAgIH0pICBcbiAgICB9KTsgXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyBhIGRlZXAgY29weSBvZiBvYmplY3Qgby4gXG4vLyBBcmdzOlxuLy8gICBvICAob2JqZWN0KSBNdXN0IGJlIGEgSlNPTiBvYmplY3QgKG5vIGN1cmN1bGFyIHJlZnMsIG5vIGZ1bmN0aW9ucykuXG4vLyBSZXR1cm5zOlxuLy8gICBhIGRlZXAgY29weSBvZiBvXG5mdW5jdGlvbiBkZWVwYyhvKSB7XG4gICAgaWYgKCFvKSByZXR1cm4gbztcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobykpO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBhcnNlcyBhIHN0cmluZyBvZiB0aGUgZm9ybSBcImNocjpzdGFydC4uZW5kXCIuXG4vLyBSZXR1cm5zOlxuLy8gICBvYmplY3QgY29udGluaW5nIHRoZSBwYXJzZWQgZmllbGRzLlxuLy8gRXhhbXBsZTpcbi8vICAgcGFyc2VDb29yZHMoXCIxMDoxMDAwMDAwMC4uMjAwMDAwMDBcIikgLT4ge2NocjpcIjEwXCIsIHN0YXJ0OjEwMDAwMDAwLCBlbmQ6MjAwMDAwMDB9XG5mdW5jdGlvbiBwYXJzZUNvb3JkcyAoY29vcmRzKSB7XG4gICAgbGV0IHJlID0gLyhbXjpdKyk6KFxcZCspXFwuXFwuKFxcZCspLztcbiAgICBsZXQgbSA9IGNvb3Jkcy5tYXRjaChyZSk7XG4gICAgcmV0dXJuIG0gPyB7Y2hyOm1bMV0sIHN0YXJ0OnBhcnNlSW50KG1bMl0pLCBlbmQ6cGFyc2VJbnQobVszXSl9IDogbnVsbDtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBGb3JtYXRzIGEgY2hyb21vc29tZSBuYW1lLCBzdGFydCBhbmQgZW5kIHBvc2l0aW9uIGFzIGEgc3RyaW5nLlxuLy8gQXJncyAoZm9ybSAxKTpcbi8vICAgY29vcmRzIChvYmplY3QpIE9mIHRoZSBmb3JtIHtjaHI6c3RyaW5nLCBzdGFydDppbnQsIGVuZDppbnR9XG4vLyBBcmdzIChmb3JtIDIpOlxuLy8gICBjaHIgc3RyaW5nXG4vLyAgIHN0YXJ0IGludFxuLy8gICBlbmQgaW50XG4vLyBSZXR1cm5zOlxuLy8gICAgIHN0cmluZ1xuLy8gRXhhbXBsZTpcbi8vICAgICBmb3JtYXRDb29yZHMoXCIxMFwiLCAxMDAwMDAwMCwgMjAwMDAwMDApIC0+IFwiMTA6MTAwMDAwMDAuLjIwMDAwMDAwXCJcbmZ1bmN0aW9uIGZvcm1hdENvb3JkcyAoY2hyLCBzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0bGV0IGMgPSBjaHI7XG5cdGNociA9IGMuY2hyO1xuXHRzdGFydCA9IGMuc3RhcnQ7XG5cdGVuZCA9IGMuZW5kO1xuICAgIH1cbiAgICByZXR1cm4gYCR7Y2hyfToke3N0YXJ0fS4uJHtlbmR9YFxufVxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRydWUgaWZmIHRoZSB0d28gcmFuZ2VzIG92ZXJsYXAgYnkgYXQgbGVhc3QgMS5cbi8vIEVhY2ggcmFuZ2UgbXVzdCBoYXZlIGEgY2hyLCBzdGFydCwgYW5kIGVuZC5cbi8vXG5mdW5jdGlvbiBvdmVybGFwcyAoYSwgYikge1xuICAgIHJldHVybiBhLmNociA9PT0gYi5jaHIgJiYgYS5zdGFydCA8PSBiLmVuZCAmJiBhLmVuZCA+PSBiLnN0YXJ0O1xufVxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBHaXZlbiB0d28gcmFuZ2VzLCBhIGFuZCBiLCByZXR1cm5zIGEgLSBiLlxuLy8gVGhlIHJlc3VsdCBpcyBhIGxpc3Qgb2YgMCwgMSBvciAyIG5ldyByYW5nZXMsIGRlcGVuZGluZyBvbiBhIGFuZCBiLlxuZnVuY3Rpb24gc3VidHJhY3QoYSwgYikge1xuICAgIGlmIChhLmNociAhPT0gYi5jaHIpIHJldHVybiBbIGEgXTtcbiAgICBsZXQgYWJMZWZ0ID0geyBjaHI6YS5jaHIsIHN0YXJ0OmEuc3RhcnQsICAgICAgICAgICAgICAgICAgICBlbmQ6TWF0aC5taW4oYS5lbmQsIGIuc3RhcnQtMSkgfTtcbiAgICBsZXQgYWJSaWdodD0geyBjaHI6YS5jaHIsIHN0YXJ0Ok1hdGgubWF4KGEuc3RhcnQsIGIuZW5kKzEpLCBlbmQ6YS5lbmQgfTtcbiAgICBsZXQgYW5zID0gWyBhYkxlZnQsIGFiUmlnaHQgXS5maWx0ZXIoIHIgPT4gci5zdGFydCA8PSByLmVuZCApO1xuICAgIHJldHVybiBhbnM7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ3JlYXRlcyBhIGxpc3Qgb2Yga2V5LHZhbHVlIHBhaXJzIGZyb20gdGhlIG9iai5cbmZ1bmN0aW9uIG9iajJsaXN0IChvKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG8pLm1hcChrID0+IFtrLCBvW2tdXSkgICAgXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0cnVlIGlmZiB0aGUgdHdvIGxpc3RzIGhhdmUgdGhlIHNhbWUgY29udGVudHMgKGJhc2VkIG9uIGluZGV4T2YpLlxuLy8gQnJ1dGUgZm9yY2UgYXBwcm9hY2guIEJlIGNhcmVmdWwgd2hlcmUgeW91IHVzZSB0aGlzLlxuZnVuY3Rpb24gc2FtZSAoYWxzdCxibHN0KSB7XG4gICByZXR1cm4gYWxzdC5sZW5ndGggPT09IGJsc3QubGVuZ3RoICYmIFxuICAgICAgIGFsc3QucmVkdWNlKChhY2MseCkgPT4gKGFjYyAmJiBibHN0LmluZGV4T2YoeCk+PTApLCB0cnVlKTtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFkZCBiYXNpYyBzZXQgb3BzIHRvIFNldCBwcm90b3R5cGUuXG4vLyBMaWZ0ZWQgZnJvbTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU2V0XG5TZXQucHJvdG90eXBlLnVuaW9uID0gZnVuY3Rpb24oc2V0Qikge1xuICAgIHZhciB1bmlvbiA9IG5ldyBTZXQodGhpcyk7XG4gICAgZm9yICh2YXIgZWxlbSBvZiBzZXRCKSB7XG4gICAgICAgIHVuaW9uLmFkZChlbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuaW9uO1xufVxuXG5TZXQucHJvdG90eXBlLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgaW50ZXJzZWN0aW9uID0gbmV3IFNldCgpO1xuICAgIGZvciAodmFyIGVsZW0gb2Ygc2V0Qikge1xuICAgICAgICBpZiAodGhpcy5oYXMoZWxlbSkpIHtcbiAgICAgICAgICAgIGludGVyc2VjdGlvbi5hZGQoZWxlbSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGludGVyc2VjdGlvbjtcbn1cblxuU2V0LnByb3RvdHlwZS5kaWZmZXJlbmNlID0gZnVuY3Rpb24oc2V0Qikge1xuICAgIHZhciBkaWZmZXJlbmNlID0gbmV3IFNldCh0aGlzKTtcbiAgICBmb3IgKHZhciBlbGVtIG9mIHNldEIpIHtcbiAgICAgICAgZGlmZmVyZW5jZS5kZWxldGUoZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiBkaWZmZXJlbmNlO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBnZXRDYXJldFJhbmdlIChlbHQpIHtcbiAgICAvLyBGSVhNRTogZG9lcyBub3Qgd29yayBmb3IgSUVcbiAgICByZXR1cm4gW2VsdC5zZWxlY3Rpb25TdGFydCwgZWx0LnNlbGVjdGlvbkVuZF07XG59XG5mdW5jdGlvbiBzZXRDYXJldFJhbmdlIChlbHQsIHJhbmdlKSB7XG4gICAgLy8gRklYTUU6IGRvZXMgbm90IHdvcmsgZm9yIElFXG4gICAgZWx0LnNlbGVjdGlvblN0YXJ0ID0gcmFuZ2VbMF07XG4gICAgZWx0LnNlbGVjdGlvbkVuZCAgID0gcmFuZ2VbMV07XG59XG5mdW5jdGlvbiBzZXRDYXJldFBvc2l0aW9uIChlbHQsIHBvcykge1xuICAgIHNldENhcmV0UmFuZ2UoZWx0LCBbcG9zLHBvc10pO1xufVxuZnVuY3Rpb24gbW92ZUNhcmV0UG9zaXRpb24gKGVsdCwgZGVsdGEpIHtcbiAgICBzZXRDYXJldFBvc2l0aW9uKGVsdCwgZ2V0Q2FyZXRQb3NpdGlvbihlbHQpICsgZGVsdGEpO1xufVxuZnVuY3Rpb24gZ2V0Q2FyZXRQb3NpdGlvbiAoZWx0KSB7XG4gICAgbGV0IHIgPSBnZXRDYXJldFJhbmdlKGVsdCk7XG4gICAgcmV0dXJuIHJbMV07XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0aGUgc2NyZWVuIGNvb3JkaW5hdGVzIG9mIGFuIFNWRyBzaGFwZSAoY2lyY2xlLCByZWN0LCBwb2x5Z29uLCBsaW5lKVxuLy8gYWZ0ZXIgYWxsIHRyYW5zZm9ybXMgaGF2ZSBiZWVuIGFwcGxpZWQuXG4vL1xuLy8gQXJnczpcbi8vICAgICBzaGFwZSAobm9kZSkgVGhlIFNWRyBzaGFwZS5cbi8vXG4vLyBSZXR1cm5zOlxuLy8gICAgIFRoZSBmb3JtIG9mIHRoZSByZXR1cm5lZCB2YWx1ZSBkZXBlbmRzIG9uIHRoZSBzaGFwZS5cbi8vICAgICBjaXJjbGU6ICB7IGN4LCBjeSwgciB9XG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGNlbnRlciBwb2ludCBhbmQgdHJhbnNmb3JtZWQgcmFkaXVzICAgICAgICAgXG4vLyAgICAgbGluZTpcdHsgeDEsIHkxLCB4MiwgeTIgfVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBlbmRwb2ludHNcbi8vICAgICByZWN0Olx0eyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgY29ybmVyIHBvaW50IGFuZCB0cmFuc2Zvcm1lZCB3aWR0aCtoZWlnaHQuXG4vLyAgICAgcG9seWdvbjogWyB7eCx5fSwge3gseX0gLCAuLi4gXVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBsaXN0IG9mIHBvaW50c1xuLy9cbi8vIEFkYXB0ZWQgZnJvbTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjg1ODQ3OS9yZWN0YW5nbGUtY29vcmRpbmF0ZXMtYWZ0ZXItdHJhbnNmb3JtP3JxPTFcbi8vXG5mdW5jdGlvbiBjb29yZHNBZnRlclRyYW5zZm9ybSAoc2hhcGUpIHtcbiAgICAvL1xuICAgIGxldCBkc2hhcGUgPSBkMy5zZWxlY3Qoc2hhcGUpO1xuICAgIGxldCBzdmcgPSBzaGFwZS5jbG9zZXN0KFwic3ZnXCIpO1xuICAgIGlmICghc3ZnKSB0aHJvdyBcIkNvdWxkIG5vdCBmaW5kIHN2ZyBhbmNlc3Rvci5cIjtcbiAgICBsZXQgc3R5cGUgPSBzaGFwZS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgbGV0IG1hdHJpeCA9IHNoYXBlLmdldENUTSgpO1xuICAgIGxldCBwID0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgbGV0IHAyPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICAvL1xuICAgIHN3aXRjaCAoc3R5cGUpIHtcbiAgICAvL1xuICAgIGNhc2UgJ2NpcmNsZSc6XG5cdHAueCAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiY3hcIikpO1xuXHRwLnkgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImN5XCIpKTtcblx0cDIueCA9IHAueCArIHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJyXCIpKTtcblx0cDIueSA9IHAueTtcblx0cCAgICA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdHAyICAgPSBwMi5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0Ly8gY2FsYyBuZXcgcmFkaXVzIGFzIGRpc3RhbmNlIGJldHdlZW4gdHJhbnNmb3JtZWQgcG9pbnRzXG5cdGxldCBkeCA9IE1hdGguYWJzKHAueCAtIHAyLngpO1xuXHRsZXQgZHkgPSBNYXRoLmFicyhwLnkgLSBwMi55KTtcblx0bGV0IHIgPSBNYXRoLnNxcnQoZHgqZHggKyBkeSpkeSk7XG4gICAgICAgIHJldHVybiB7IGN4OiBwLngsIGN5OiBwLnksIHI6ciB9O1xuICAgIC8vXG4gICAgY2FzZSAncmVjdCc6XG5cdC8vIEZJWE1FOiBkb2VzIG5vdCBoYW5kbGUgcm90YXRpb25zIGNvcnJlY3RseS4gVG8gZml4LCB0cmFuc2xhdGUgY29ybmVyIHBvaW50cyBzZXBhcmF0ZWx5IGFuZCB0aGVuXG5cdC8vIGNhbGN1bGF0ZSB0aGUgdHJhbnNmb3JtZWQgd2lkdGggYW5kIGhlaWdodC4gQXMgYSBjb252ZW5pZW5jZSB0byB0aGUgdXNlciwgbWlnaHQgYmUgbmljZSB0byByZXR1cm5cblx0Ly8gdGhlIHRyYW5zZm9ybWVkIGNvcm5lciBwb2ludHMgYW5kIHBvc3NpYmx5IHRoZSBmaW5hbCBhbmdsZSBvZiByb3RhdGlvbi5cblx0cC54ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ4XCIpKTtcblx0cC55ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ5XCIpKTtcblx0cDIueCA9IHAueCArIHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ3aWR0aFwiKSk7XG5cdHAyLnkgPSBwLnkgKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiaGVpZ2h0XCIpKTtcblx0Ly9cblx0cCAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRwMiA9IHAyLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHQvL1xuICAgICAgICByZXR1cm4geyB4OiBwLngsIHk6IHAueSwgd2lkdGg6IHAyLngtcC54LCBoZWlnaHQ6IHAyLnktcC55IH07XG4gICAgLy9cbiAgICBjYXNlICdwb2x5Z29uJzpcbiAgICAgICAgbGV0IHB0cyA9IGRzaGFwZS5hdHRyKFwicG9pbnRzXCIpLnRyaW0oKS5zcGxpdCgvICsvKTtcblx0cmV0dXJuIHB0cy5tYXAoIHB0ID0+IHtcblx0ICAgIGxldCB4eSA9IHB0LnNwbGl0KFwiLFwiKTtcblx0ICAgIHAueCA9IHBhcnNlRmxvYXQoeHlbMF0pXG5cdCAgICBwLnkgPSBwYXJzZUZsb2F0KHh5WzFdKVxuXHQgICAgcCA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdCAgICByZXR1cm4geyB4OiBwLngsIHk6IHAueSB9O1xuXHR9KTtcbiAgICAvL1xuICAgIGNhc2UgJ2xpbmUnOlxuXHRwLnggICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ4MVwiKSk7XG5cdHAueSAgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInkxXCIpKTtcblx0cDIueCAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieDJcIikpO1xuXHRwMi55ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ5MlwiKSk7XG5cdHAgICAgID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0cDIgICAgPSBwMi5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcbiAgICAgICAgcmV0dXJuIHsgeDE6IHAueCwgeTE6IHAueSwgeDI6IHAyLngsIHgyOiBwMi55IH07XG4gICAgLy9cbiAgICAvLyBGSVhNRTogYWRkIGNhc2UgJ3RleHQnXG4gICAgLy9cblxuICAgIGRlZmF1bHQ6XG5cdHRocm93IFwiVW5zdXBwb3J0ZWQgbm9kZSB0eXBlOiBcIiArIHN0eXBlO1xuICAgIH1cblxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJlbW92ZXMgZHVwbGljYXRlcyBmcm9tIGEgbGlzdCB3aGlsZSBwcmVzZXJ2aW5nIGxpc3Qgb3JkZXIuXG4vLyBBcmdzOlxuLy8gICAgIGxzdCAobGlzdClcbi8vIFJldHVybnM6XG4vLyAgICAgQSBwcm9jZXNzZWQgY29weSBvZiBsc3QgaW4gd2hpY2ggYW55IGR1cHMgaGF2ZSBiZWVuIHJlbW92ZWQuXG5mdW5jdGlvbiByZW1vdmVEdXBzIChsc3QpIHtcbiAgICBsZXQgbHN0MiA9IFtdO1xuICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuICAgIGxzdC5mb3JFYWNoKHggPT4ge1xuXHQvLyByZW1vdmUgZHVwcyB3aGlsZSBwcmVzZXJ2aW5nIG9yZGVyXG5cdGlmIChzZWVuLmhhcyh4KSkgcmV0dXJuO1xuXHRsc3QyLnB1c2goeCk7XG5cdHNlZW4uYWRkKHgpO1xuICAgIH0pO1xuICAgIHJldHVybiBsc3QyO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENsaXBzIGEgdmFsdWUgdG8gYSByYW5nZS5cbmZ1bmN0aW9uIGNsaXAgKG4sIG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCBuKSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0aGUgZ2l2ZW4gYmFzZXBhaXIgYW1vdW50IFwicHJldHR5IHByaW50ZWRcIiB0byBhbiBhcHBvcnByaWF0ZSBzY2FsZSwgcHJlY2lzaW9uLCBhbmQgdW5pdHMuXG4vLyBFZywgIFxuLy8gICAgMTI3ID0+ICcxMjcgYnAnXG4vLyAgICAxMjM0NTY3ODkgPT4gJzEyMy41IE1iJ1xuZnVuY3Rpb24gcHJldHR5UHJpbnRCYXNlcyAobikge1xuICAgIGxldCBhYnNuID0gTWF0aC5hYnMobik7XG4gICAgaWYgKGFic24gPCAxMDAwKSB7XG4gICAgICAgIHJldHVybiBgJHtufSBicGA7XG4gICAgfVxuICAgIGlmIChhYnNuID49IDEwMDAgJiYgYWJzbiA8IDEwMDAwMDApIHtcbiAgICAgICAgcmV0dXJuIGAkeyhuLzEwMDApLnRvRml4ZWQoMil9IGtiYDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBgJHsobi8xMDAwMDAwKS50b0ZpeGVkKDIpfSBNYmA7XG4gICAgfVxuICAgIHJldHVybiBcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQge1xuICAgIGluaXRPcHRMaXN0LFxuICAgIGQzdHN2LFxuICAgIGQzanNvbixcbiAgICBkM3RleHQsXG4gICAgZGVlcGMsXG4gICAgcGFyc2VDb29yZHMsXG4gICAgZm9ybWF0Q29vcmRzLFxuICAgIG92ZXJsYXBzLFxuICAgIHN1YnRyYWN0LFxuICAgIG9iajJsaXN0LFxuICAgIHNhbWUsXG4gICAgZ2V0Q2FyZXRSYW5nZSxcbiAgICBzZXRDYXJldFJhbmdlLFxuICAgIHNldENhcmV0UG9zaXRpb24sXG4gICAgbW92ZUNhcmV0UG9zaXRpb24sXG4gICAgZ2V0Q2FyZXRQb3NpdGlvbixcbiAgICBjb29yZHNBZnRlclRyYW5zZm9ybSxcbiAgICByZW1vdmVEdXBzLFxuICAgIGNsaXAsXG4gICAgcHJldHR5UHJpbnRCYXNlc1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgQ29tcG9uZW50IHtcbiAgICAvLyBhcHAgLSB0aGUgb3duaW5nIGFwcCBvYmplY3RcbiAgICAvLyBlbHQgLSBjb250YWluZXIuIG1heSBiZSBhIHN0cmluZyAoc2VsZWN0b3IpLCBhIERPTSBub2RlLCBvciBhIGQzIHNlbGVjdGlvbiBvZiAxIG5vZGUuXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0KSB7XG5cdHRoaXMuYXBwID0gYXBwXG5cdGlmICh0eXBlb2YoZWx0KSA9PT0gXCJzdHJpbmdcIilcblx0ICAgIC8vIGVsdCBpcyBhIENTUyBzZWxlY3RvclxuXHQgICAgdGhpcy5yb290ID0gZDMuc2VsZWN0KGVsdCk7XG5cdGVsc2UgaWYgKHR5cGVvZihlbHQuc2VsZWN0QWxsKSA9PT0gXCJmdW5jdGlvblwiKVxuXHQgICAgLy8gZWx0IGlzIGEgZDMgc2VsZWN0aW9uXG5cdCAgICB0aGlzLnJvb3QgPSBlbHQ7XG5cdGVsc2UgaWYgKHR5cGVvZihlbHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUpID09PSBcImZ1bmN0aW9uXCIpXG5cdCAgICAvLyBlbHQgaXMgYSBET00gbm9kZVxuXHQgICAgdGhpcy5yb290ID0gZDMuc2VsZWN0KGVsdCk7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuICAgICAgICAvLyBvdmVycmlkZSBtZVxuICAgIH1cbn1cblxuZXhwb3J0IHsgQ29tcG9uZW50IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9Db21wb25lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgU3RvcmUsIHNldCwgZ2V0LCBkZWwsIGNsZWFyLCBrZXlzIH0gZnJvbSAnaWRiLWtleXZhbCc7XG5cbmNvbnN0IERCX05BTUVfUFJFRklYID0gJ21ndi1kYXRhY2FjaGUtJztcblxuY2xhc3MgS2V5U3RvcmUge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lKSB7XG5cdHRyeSB7XG5cdCAgICB0aGlzLnN0b3JlID0gbmV3IFN0b3JlKERCX05BTUVfUFJFRklYK25hbWUsIG5hbWUpO1xuXHQgICAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xuXHQgICAgY29uc29sZS5sb2coYEtleVN0b3JlOiAke0RCX05BTUVfUFJFRklYK25hbWV9YCk7XG5cdH1cblx0Y2F0Y2ggKGVycikge1xuXHQgICAgdGhpcy5zdG9yZSA9IG51bGw7XG5cdCAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcblx0ICAgIHRoaXMubnVsbFAgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cdCAgICBjb25zb2xlLmxvZyhgS2V5U3RvcmU6IGVycm9yIGluIGNvbnN0cnVjdG9yOiAke2Vycn0gXFxuIERpc2FibGVkLmApXG5cdH1cbiAgICB9XG4gICAgZ2V0IChrZXkpIHtcblx0aWYgKHRoaXMuZGlzYWJsZWQpIFxuXHQgICAgcmV0dXJuIHRoaXMubnVsbFA7XG4gICAgICAgIHJldHVybiBnZXQoa2V5LCB0aGlzLnN0b3JlKTtcbiAgICB9XG4gICAgZGVsIChrZXkpIHtcblx0aWYgKHRoaXMuZGlzYWJsZWQpIFxuXHQgICAgcmV0dXJuIHRoaXMubnVsbFA7XG4gICAgICAgIHJldHVybiBkZWwoa2V5LCB0aGlzLnN0b3JlKTtcbiAgICB9XG4gICAgc2V0IChrZXksIHZhbHVlKSB7XG5cdGlmICh0aGlzLmRpc2FibGVkKSBcblx0ICAgIHJldHVybiB0aGlzLm51bGxQO1xuICAgICAgICByZXR1cm4gc2V0KGtleSwgdmFsdWUsIHRoaXMuc3RvcmUpO1xuICAgIH1cbiAgICBwdXQgKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0KGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICBrZXlzICgpIHtcblx0aWYgKHRoaXMuZGlzYWJsZWQpIFxuXHQgICAgcmV0dXJuIHRoaXMubnVsbFA7XG4gICAgICAgIHJldHVybiBrZXlzKHRoaXMuc3RvcmUpO1xuICAgIH1cbiAgICBjb250YWlucyAoa2V5KSB7XG5cdGlmICh0aGlzLmRpc2FibGVkKSBcblx0ICAgIHJldHVybiB0aGlzLm51bGxQO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoa2V5KS50aGVuKHggPT4geCAhPT0gdW5kZWZpbmVkKTtcbiAgICB9XG4gICAgY2xlYXIgKCkge1xuXHRpZiAodGhpcy5kaXNhYmxlZCkgXG5cdCAgICByZXR1cm4gdGhpcy5udWxsUDtcbiAgICAgICAgcmV0dXJuIGNsZWFyKHRoaXMuc3RvcmUpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IEtleVN0b3JlIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9LZXlTdG9yZS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBHZW5vbWljSW50ZXJ2YWwge1xuICAgIGNvbnN0cnVjdG9yIChjZmcpIHtcbiAgICAgICAgdGhpcy5nZW5vbWUgID0gY2ZnLmdlbm9tZTtcbiAgICAgICAgdGhpcy5jaHIgICAgID0gY2ZnLmNociB8fCBjZmcuY2hyb21vc29tZTtcbiAgICAgICAgdGhpcy5zdGFydCAgID0gcGFyc2VJbnQoY2ZnLnN0YXJ0KTtcbiAgICAgICAgdGhpcy5lbmQgICAgID0gcGFyc2VJbnQoY2ZnLmVuZCk7XG4gICAgICAgIHRoaXMuc3RyYW5kICA9IGNmZy5zdHJhbmQ7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBsZW5ndGggKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbmQgLSB0aGlzLnN0YXJ0ICsgMTtcbiAgICB9XG59XG5cbmNsYXNzIEV4b24gZXh0ZW5kcyBHZW5vbWljSW50ZXJ2YWwge1xuICAgIGNvbnN0cnVjdG9yIChjZmcpIHtcbiAgICAgICAgc3VwZXIoY2ZnKTtcblx0dGhpcy5JRCA9IGNmZy5wcmltYXJ5SWRlbnRpZmllcjtcblx0dGhpcy5jaHI7XG4gICAgfVxufVxuXG5jbGFzcyBGZWF0dXJlIGV4dGVuZHMgR2Vub21pY0ludGVydmFsIHtcbiAgICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG5cdHN1cGVyKGNmZyk7XG4gICAgICAgIHRoaXMudHlwZSAgICA9IGNmZy50eXBlO1xuICAgICAgICB0aGlzLmJpb3R5cGUgPSBjZmcuYmlvdHlwZTtcbiAgICAgICAgdGhpcy5tZ3BpZCAgID0gY2ZnLm1ncGlkIHx8IGNmZy5pZDtcbiAgICAgICAgdGhpcy5tZ2lpZCAgID0gY2ZnLm1naWlkO1xuICAgICAgICB0aGlzLnN5bWJvbCAgPSBjZmcuc3ltYm9sO1xuXHR0aGlzLmNvbnRpZyAgPSBwYXJzZUludChjZmcuY29udGlnKTtcblx0dGhpcy5sYW5lICAgID0gcGFyc2VJbnQoY2ZnLmxhbmUpO1xuICAgICAgICBpZiAodGhpcy5tZ2lpZCA9PT0gXCIuXCIpIHRoaXMubWdpaWQgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5zeW1ib2wgPT09IFwiLlwiKSB0aGlzLnN5bWJvbCA9IG51bGw7XG5cdC8vXG5cdHRoaXMuZXhvbnMgPSBudWxsOyAvLyBsaXN0IG9mIGV4b25zLiBOdWxsIG1lYW5zIG5vdCB5ZXQgbGVhZGVkLlxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgSUQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgZ2V0IGNhbm9uaWNhbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1naWlkO1xuICAgIH1cbiAgICBnZXQgaWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZ2lpZCB8fCB0aGlzLm1ncGlkO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgbGFiZWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2wgfHwgdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0TXVuZ2VkVHlwZSAoKSB7XG5cdHJldHVybiB0aGlzLnR5cGUgPT09IFwiZ2VuZVwiID9cblx0ICAgICh0aGlzLmJpb3R5cGUgPT09IFwicHJvdGVpbl9jb2RpbmdcIiB8fCB0aGlzLmJpb3R5cGUgPT09IFwicHJvdGVpbiBjb2RpbmcgZ2VuZVwiKSA/XG5cdFx0XCJwcm90ZWluX2NvZGluZ19nZW5lXCJcblx0XHQ6XG5cdFx0dGhpcy5iaW90eXBlLmluZGV4T2YoXCJwc2V1ZG9nZW5lXCIpID49IDAgP1xuXHRcdCAgICBcInBzZXVkb2dlbmVcIlxuXHRcdCAgICA6XG5cdFx0ICAgICh0aGlzLmJpb3R5cGUuaW5kZXhPZihcIlJOQVwiKSA+PSAwIHx8IHRoaXMuYmlvdHlwZS5pbmRleE9mKFwiYW50aXNlbnNlXCIpID49IDApID9cblx0XHRcdFwibmNSTkFfZ2VuZVwiXG5cdFx0XHQ6XG5cdFx0XHR0aGlzLmJpb3R5cGUuaW5kZXhPZihcInNlZ21lbnRcIikgPj0gMCA/XG5cdFx0XHQgICAgXCJnZW5lX3NlZ21lbnRcIlxuXHRcdFx0ICAgIDpcblx0XHRcdCAgICBcIm90aGVyX2dlbmVcIlxuXHQgICAgOlxuXHQgICAgdGhpcy50eXBlID09PSBcInBzZXVkb2dlbmVcIiA/XG5cdFx0XCJwc2V1ZG9nZW5lXCJcblx0XHQ6XG5cdFx0dGhpcy50eXBlLmluZGV4T2YoXCJnZW5lX3NlZ21lbnRcIikgPj0gMCA/XG5cdFx0ICAgIFwiZ2VuZV9zZWdtZW50XCJcblx0XHQgICAgOlxuXHRcdCAgICB0aGlzLnR5cGUuaW5kZXhPZihcIlJOQVwiKSA+PSAwID9cblx0XHRcdFwibmNSTkFfZ2VuZVwiXG5cdFx0XHQ6XG5cdFx0XHR0aGlzLnR5cGUuaW5kZXhPZihcImdlbmVcIikgPj0gMCA/XG5cdFx0XHQgICAgXCJvdGhlcl9nZW5lXCJcblx0XHRcdCAgICA6XG5cdFx0XHQgICAgXCJvdGhlcl9mZWF0dXJlX3R5cGVcIjtcbiAgICB9XG59XG5cbmV4cG9ydCB7IEZlYXR1cmUgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZlYXR1cmUuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQYXJzZXMgYSBsaXN0IG9wZXJhdG9yIGV4cHJlc3Npb24sIGVnIFwiKGEgKyBiKSpjIC0gZFwiXG4vLyBSZXR1cm5zIGFuIGFic3RyYWN0IHN5bnRheCB0cmVlLlxuLy8gICAgIExlYWYgbm9kZXMgPSBsaXN0IG5hbWVzLiBUaGV5IGFyZSBzaW1wbGUgc3RyaW5ncy5cbi8vICAgICBJbnRlcmlvciBub2RlcyA9IG9wZXJhdGlvbnMuIFRoZXkgbG9vayBsaWtlOiB7bGVmdDpub2RlLCBvcDpzdHJpbmcsIHJpZ2h0Om5vZGV9XG4vLyBcbmNsYXNzIExpc3RGb3JtdWxhUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG5cdHRoaXMucl9vcCAgICA9IC9bKy1dLztcblx0dGhpcy5yX29wMiAgID0gL1sqXS87XG5cdHRoaXMucl9vcHMgICA9IC9bKCkrKi1dLztcblx0dGhpcy5yX2lkZW50ID0gL1thLXpBLVpfXVthLXpBLVowLTlfXSovO1xuXHR0aGlzLnJfcXN0ciAgPSAvXCJbXlwiXSpcIi87XG5cdHRoaXMucmUgPSBuZXcgUmVnRXhwKGAoJHt0aGlzLnJfb3BzLnNvdXJjZX18JHt0aGlzLnJfcXN0ci5zb3VyY2V9fCR7dGhpcy5yX2lkZW50LnNvdXJjZX0pYCwgJ2cnKTtcblx0Ly90aGlzLnJlID0gLyhbKCkrKi1dfFwiW15cIl0rXCJ8W2EtekEtWl9dW2EtekEtWjAtOV9dKikvZ1xuXHR0aGlzLl9pbml0KFwiXCIpO1xuICAgIH1cbiAgICBfaW5pdCAocykge1xuICAgICAgICB0aGlzLmV4cHIgPSBzO1xuXHR0aGlzLnRva2VucyA9IHRoaXMuZXhwci5tYXRjaCh0aGlzLnJlKSB8fCBbXTtcblx0dGhpcy5pID0gMDtcbiAgICB9XG4gICAgX3BlZWtUb2tlbigpIHtcblx0cmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuaV07XG4gICAgfVxuICAgIF9uZXh0VG9rZW4gKCkge1xuXHRsZXQgdDtcbiAgICAgICAgaWYgKHRoaXMuaSA8IHRoaXMudG9rZW5zLmxlbmd0aCkge1xuXHQgICAgdCA9IHRoaXMudG9rZW5zW3RoaXMuaV07XG5cdCAgICB0aGlzLmkgKz0gMTtcblx0fVxuXHRyZXR1cm4gdDtcbiAgICB9XG4gICAgX2V4cHIgKCkge1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuX3Rlcm0oKTtcblx0bGV0IG9wID0gdGhpcy5fcGVla1Rva2VuKCk7XG5cdGlmIChvcCA9PT0gXCIrXCIgfHwgb3AgPT09IFwiLVwiKSB7XG5cdCAgICB0aGlzLl9uZXh0VG9rZW4oKTtcblx0ICAgIG5vZGUgPSB7IGxlZnQ6bm9kZSwgb3A6b3A9PT1cIitcIj9cInVuaW9uXCI6XCJkaWZmZXJlbmNlXCIsIHJpZ2h0OiB0aGlzLl9leHByKCkgfVxuXHQgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH0gICAgICAgICAgICAgICBcblx0ZWxzZSBpZiAob3AgPT09IFwiKVwiIHx8IG9wID09PSB1bmRlZmluZWQgfHwgb3AgPT09IG51bGwpXG5cdCAgICByZXR1cm4gbm9kZTtcblx0ZWxzZVxuXHQgICAgdGhpcy5fZXJyb3IoXCJVTklPTiBvciBJTlRFUlNFQ1RJT04gb3IgKSBvciBOVUxMXCIsIG9wKTtcbiAgICB9XG4gICAgX3Rlcm0gKCkge1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMuX2ZhY3RvcigpO1xuXHRsZXQgb3AgPSB0aGlzLl9wZWVrVG9rZW4oKTtcblx0aWYgKG9wID09PSBcIipcIikge1xuXHQgICAgdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBub2RlID0geyBsZWZ0Om5vZGUsIG9wOlwiaW50ZXJzZWN0aW9uXCIsIHJpZ2h0OiB0aGlzLl9mYWN0b3IoKSB9XG5cdH1cblx0cmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIF9mYWN0b3IgKCkge1xuICAgICAgICBsZXQgdCA9IHRoaXMuX25leHRUb2tlbigpO1xuXHRpZiAodCA9PT0gXCIoXCIpe1xuXHQgICAgbGV0IG5vZGUgPSB0aGlzLl9leHByKCk7XG5cdCAgICBsZXQgbnQgPSB0aGlzLl9uZXh0VG9rZW4oKTtcblx0ICAgIGlmIChudCAhPT0gXCIpXCIpIHRoaXMuX2Vycm9yKFwiJyknXCIsIG50KTtcblx0ICAgIHJldHVybiBub2RlO1xuXHR9XG5cdGVsc2UgaWYgKHQgJiYgKHQuc3RhcnRzV2l0aCgnXCInKSkpIHtcblx0ICAgIHJldHVybiB0LnN1YnN0cmluZygxLCB0Lmxlbmd0aC0xKTtcblx0fVxuXHRlbHNlIGlmICh0ICYmIHQubWF0Y2goL1thLXpBLVpfXS8pKSB7XG5cdCAgICByZXR1cm4gdDtcblx0fVxuXHRlbHNlXG5cdCAgICB0aGlzLl9lcnJvcihcIkVYUFIgb3IgSURFTlRcIiwgdHx8XCJOVUxMXCIpO1xuXHRyZXR1cm4gdDtcblx0ICAgIFxuICAgIH1cbiAgICBfZXJyb3IgKGV4cGVjdGVkLCBzYXcpIHtcbiAgICAgICAgdGhyb3cgYFBhcnNlIGVycm9yOiBleHBlY3RlZCAke2V4cGVjdGVkfSBidXQgc2F3ICR7c2F3fS5gO1xuICAgIH1cbiAgICAvLyBQYXJzZXMgdGhlIHN0cmluZyBhbmQgcmV0dXJucyB0aGUgYWJzdHJhY3Qgc3ludGF4IHRyZWUuXG4gICAgLy8gVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGVyZSBpcyBhIHN5bnRheCBlcnJvci5cbiAgICBwYXJzZSAocykge1xuXHR0aGlzLl9pbml0KHMpO1xuXHRyZXR1cm4gdGhpcy5fZXhwcigpO1xuICAgIH1cbiAgICAvLyByZXR1cm5zIHRydWUgaWZmIHN0cmluZyBpcyBzeW50YWN0aWNhbGx5IHZhbGlkXG4gICAgaXNWYWxpZCAocykge1xuICAgICAgICB0cnkge1xuXHQgICAgdGhpcy5wYXJzZShzKTtcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9XG5cdGNhdGNoIChlKSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IExpc3RGb3JtdWxhUGFyc2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgU1ZHVmlldyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0LCBtYXJnaW5zLCByb3RhdGlvbiwgdHJhbnNsYXRpb24pIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuICAgICAgICB0aGlzLnN2ZyA9IHRoaXMucm9vdC5zZWxlY3QoXCJzdmdcIik7XG4gICAgICAgIHRoaXMuc3ZnTWFpbiA9IHRoaXMuc3ZnXG4gICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKSAgICAvLyB0aGUgbWFyZ2luLXRyYW5zbGF0ZWQgZ3JvdXBcbiAgICAgICAgICAgIC5hcHBlbmQoXCJnXCIpXHQgIC8vIG1haW4gZ3JvdXAgZm9yIHRoZSBkcmF3aW5nXG5cdCAgICAuYXR0cihcIm5hbWVcIixcInN2Z21haW5cIik7XG5cdHRoaXMub3V0ZXJXaWR0aCA9IDEwMDtcblx0dGhpcy53aWR0aCA9IDEwMDtcblx0dGhpcy5vdXRlckhlaWdodCA9IDEwMDtcblx0dGhpcy5oZWlnaHQgPSAxMDA7XG5cdHRoaXMubWFyZ2lucyA9IHt0b3A6IDE4LCByaWdodDogMTIsIGJvdHRvbTogMTIsIGxlZnQ6IDEyfTtcblx0dGhpcy5yb3RhdGlvbiA9IDA7XG5cdHRoaXMudHJhbnNsYXRpb24gPSBbMCwwXTtcblx0Ly9cbiAgICAgICAgdGhpcy5zZXRHZW9tKHt3aWR0aCwgaGVpZ2h0LCBtYXJnaW5zLCByb3RhdGlvbiwgdHJhbnNsYXRpb259KTtcbiAgICB9XG4gICAgc2V0R2VvbSAoY2ZnKSB7XG4gICAgICAgIHRoaXMub3V0ZXJXaWR0aCAgPSBjZmcud2lkdGggICAgICAgfHwgdGhpcy5vdXRlcldpZHRoO1xuICAgICAgICB0aGlzLm91dGVySGVpZ2h0ID0gY2ZnLmhlaWdodCAgICAgIHx8IHRoaXMub3V0ZXJIZWlnaHQ7XG4gICAgICAgIHRoaXMubWFyZ2lucyAgICAgPSBjZmcubWFyZ2lucyAgICAgfHwgdGhpcy5tYXJnaW5zO1xuXHR0aGlzLnJvdGF0aW9uICAgID0gdHlwZW9mKGNmZy5yb3RhdGlvbikgPT09IFwibnVtYmVyXCIgPyBjZmcucm90YXRpb24gOiB0aGlzLnJvdGF0aW9uO1xuXHR0aGlzLnRyYW5zbGF0aW9uID0gY2ZnLnRyYW5zbGF0aW9uIHx8IHRoaXMudHJhbnNsYXRpb247XG4gICAgICAgIC8vXG4gICAgICAgIHRoaXMud2lkdGggID0gdGhpcy5vdXRlcldpZHRoICAtIHRoaXMubWFyZ2lucy5sZWZ0IC0gdGhpcy5tYXJnaW5zLnJpZ2h0O1xuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMub3V0ZXJIZWlnaHQgLSB0aGlzLm1hcmdpbnMudG9wICAtIHRoaXMubWFyZ2lucy5ib3R0b207XG4gICAgICAgIC8vXG4gICAgICAgIHRoaXMuc3ZnLmF0dHIoXCJ3aWR0aFwiLCB0aGlzLm91dGVyV2lkdGgpXG4gICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMub3V0ZXJIZWlnaHQpXG4gICAgICAgICAgICAuc2VsZWN0KCdnW25hbWU9XCJzdmdtYWluXCJdJylcbiAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke3RoaXMubWFyZ2lucy5sZWZ0fSwke3RoaXMubWFyZ2lucy50b3B9KSByb3RhdGUoJHt0aGlzLnJvdGF0aW9ufSkgdHJhbnNsYXRlKCR7dGhpcy50cmFuc2xhdGlvblswXX0sJHt0aGlzLnRyYW5zbGF0aW9uWzFdfSlgKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldE1hcmdpbnMoIHRtLCBybSwgYm0sIGxtICkge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHQgICAgcm0gPSBibSA9IGxtID0gdG07XG5cdH1cblx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuXHQgICAgYm0gPSB0bTtcblx0ICAgIGxtID0gcm07XG5cdH1cblx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gNClcblx0ICAgIHRocm93IFwiQmFkIGFyZ3VtZW50cy5cIjtcbiAgICAgICAgLy9cblx0dGhpcy5zZXRHZW9tKHt0b3A6IHRtLCByaWdodDogcm0sIGJvdHRvbTogYm0sIGxlZnQ6IGxtfSk7XG5cdC8vXG5cdHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByb3RhdGUgKGRlZykge1xuICAgICAgICB0aGlzLnNldEdlb20oe3JvdGF0aW9uOmRlZ30pO1xuXHRyZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdHJhbnNsYXRlIChkeCwgZHkpIHtcbiAgICAgICAgdGhpcy5zZXRHZW9tKHt0cmFuc2xhdGlvbjpbZHgsZHldfSk7XG5cdHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgdGhlIHdpbmRvdyB3aWR0aFxuICAgIGZpdFRvV2lkdGggKHdpZHRoKSB7XG4gICAgICAgIGxldCByID0gdGhpcy5zdmdbMF1bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMuc2V0R2VvbSh7d2lkdGg6IHdpZHRoIC0gci54fSlcblx0cmV0dXJuIHRoaXM7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgU1ZHVmlld1xuXG5leHBvcnQgeyBTVkdWaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9TVkdWaWV3LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IE1HVkFwcCB9IGZyb20gJy4vTUdWQXBwJztcbmltcG9ydCB7IHJlbW92ZUR1cHMgfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vXG4vLyBwcXN0cmluZyA9IFBhcnNlIHFzdHJpbmcuIFBhcnNlcyB0aGUgcGFyYW1ldGVyIHBvcnRpb24gb2YgdGhlIFVSTC5cbi8vXG5mdW5jdGlvbiBwcXN0cmluZyAocXN0cmluZykge1xuICAgIC8vXG4gICAgbGV0IGNmZyA9IHt9O1xuXG4gICAgLy8gRklYTUU6IFVSTFNlYXJjaFBhcmFtcyBBUEkgaXMgbm90IHN1cHBvcnRlZCBpbiBhbGwgYnJvd3NlcnMuXG4gICAgLy8gT0sgZm9yIGRldmVsb3BtZW50IGJ1dCBuZWVkIGEgZmFsbGJhY2sgZXZlbnR1YWxseS5cbiAgICBsZXQgcHJtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocXN0cmluZyk7XG4gICAgbGV0IGdlbm9tZXMgPSBbXTtcblxuICAgIC8vIC0tLS0tIGdlbm9tZXMgLS0tLS0tLS0tLS0tXG4gICAgbGV0IHBnZW5vbWVzID0gcHJtcy5nZXQoXCJnZW5vbWVzXCIpIHx8IFwiXCI7XG4gICAgLy8gRm9yIG5vdywgYWxsb3cgXCJjb21wc1wiIGFzIHN5bm9ueW0gZm9yIFwiZ2Vub21lc1wiLiBFdmVudHVhbGx5LCBkb24ndCBzdXBwb3J0IFwiY29tcHNcIi5cbiAgICBwZ2Vub21lcyA9IChwZ2Vub21lcyArICBcIiBcIiArIChwcm1zLmdldChcImNvbXBzXCIpIHx8IFwiXCIpKTtcbiAgICAvL1xuICAgIHBnZW5vbWVzID0gcmVtb3ZlRHVwcyhwZ2Vub21lcy50cmltKCkuc3BsaXQoLyArLykpO1xuICAgIHBnZW5vbWVzLmxlbmd0aCA+IDAgJiYgKGNmZy5nZW5vbWVzID0gcGdlbm9tZXMpO1xuXG4gICAgLy8gLS0tLS0gcmVmIGdlbm9tZSAtLS0tLS0tLS0tLS1cbiAgICBsZXQgcmVmID0gcHJtcy5nZXQoXCJyZWZcIik7XG4gICAgcmVmICYmIChjZmcucmVmID0gcmVmKTtcblxuICAgIC8vIC0tLS0tIGhpZ2hsaWdodCBJRHMgLS0tLS0tLS0tLS0tLS1cbiAgICBsZXQgaGxzID0gbmV3IFNldCgpO1xuICAgIGxldCBobHMwID0gcHJtcy5nZXQoXCJoaWdobGlnaHRcIik7XG4gICAgaWYgKGhsczApIHtcblx0aGxzMCA9IGhsczAucmVwbGFjZSgvWyAsXSsvZywgJyAnKS5zcGxpdCgnICcpLmZpbHRlcih4PT54KTtcblx0aGxzMC5sZW5ndGggPiAwICYmIChjZmcuaGlnaGxpZ2h0ID0gaGxzMCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0gY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIGxldCBjaHIgICA9IHBybXMuZ2V0KFwiY2hyXCIpO1xuICAgIGxldCBzdGFydCA9IHBybXMuZ2V0KFwic3RhcnRcIik7XG4gICAgbGV0IGVuZCAgID0gcHJtcy5nZXQoXCJlbmRcIik7XG4gICAgY2hyICAgJiYgKGNmZy5jaHIgPSBjaHIpO1xuICAgIHN0YXJ0ICYmIChjZmcuc3RhcnQgPSBwYXJzZUludChzdGFydCkpO1xuICAgIGVuZCAgICYmIChjZmcuZW5kID0gcGFyc2VJbnQoZW5kKSk7XG4gICAgLy9cbiAgICBsZXQgbGFuZG1hcmsgPSBwcm1zLmdldChcImxhbmRtYXJrXCIpO1xuICAgIGxldCBmbGFuayAgICA9IHBybXMuZ2V0KFwiZmxhbmtcIik7XG4gICAgbGV0IGxlbmd0aCAgID0gcHJtcy5nZXQoXCJsZW5ndGhcIik7XG4gICAgbGV0IGRlbHRhICAgID0gcHJtcy5nZXQoXCJkZWx0YVwiKTtcbiAgICBsYW5kbWFyayAmJiAoY2ZnLmxhbmRtYXJrID0gbGFuZG1hcmspO1xuICAgIGZsYW5rICAgICYmIChjZmcuZmxhbmsgPSBwYXJzZUludChmbGFuaykpO1xuICAgIGxlbmd0aCAgICYmIChjZmcubGVuZ3RoID0gcGFyc2VJbnQobGVuZ3RoKSk7XG4gICAgZGVsdGEgICAgJiYgKGNmZy5kZWx0YSA9IHBhcnNlSW50KGRlbHRhKSk7XG4gICAgLy9cbiAgICAvLyAtLS0tLSBkcmF3aW5nIG1vZGUgLS0tLS0tLS0tLS0tLVxuICAgIGxldCBkbW9kZSA9IHBybXMuZ2V0KFwiZG1vZGVcIik7XG4gICAgZG1vZGUgJiYgKGNmZy5kbW9kZSA9IGRtb2RlKTtcbiAgICAvL1xuICAgIHJldHVybiBjZmc7XG59XG5cblxuLy8gVGhlIG1haW4gcHJvZ3JhbSwgd2hlcmVpbiB0aGUgYXBwIGlzIGNyZWF0ZWQgYW5kIHdpcmVkIHRvIHRoZSBicm93c2VyLiBcbi8vXG5mdW5jdGlvbiBfX21haW5fXyAoc2VsZWN0b3IpIHtcbiAgICAvLyBCZWhvbGQsIHRoZSBNR1YgYXBwbGljYXRpb24gb2JqZWN0Li4uXG4gICAgbGV0IG1ndiA9IG51bGw7XG5cbiAgICAvLyBDYWxsYmFjayB0byBwYXNzIGludG8gdGhlIGFwcCB0byByZWdpc3RlciBjaGFuZ2VzIGluIGNvbnRleHQuXG4gICAgLy8gVXNlcyB0aGUgY3VycmVudCBhcHAgY29udGV4dCB0byBzZXQgdGhlIGhhc2ggcGFydCBvZiB0aGVcbiAgICAvLyBicm93c2VyJ3MgbG9jYXRpb24uIFRoaXMgYWxzbyByZWdpc3RlcnMgdGhlIGNoYW5nZSBpbiBcbiAgICAvLyB0aGUgYnJvd3NlciBoaXN0b3J5LlxuICAgIGZ1bmN0aW9uIHNldEhhc2ggKCkge1xuXHRsZXQgbmV3SGFzaCA9IG1ndi5nZXRQYXJhbVN0cmluZygpO1xuXHRpZiAoJyMnK25ld0hhc2ggPT09IHdpbmRvdy5sb2NhdGlvbi5oYXNoKVxuXHQgICAgcmV0dXJuO1xuXHQvLyB0ZW1wb3JhcmlseSBkaXNhYmxlIHBvcHN0YXRlIGhhbmRsZXJcblx0bGV0IGYgPSB3aW5kb3cub25wb3BzdGF0ZTtcblx0d2luZG93Lm9ucG9wc3RhdGUgPSBudWxsO1xuXHQvLyBub3cgc2V0IHRoZSBoYXNoXG5cdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gbmV3SGFzaDtcblx0Ly8gcmUtZW5hYmxlXG5cdHdpbmRvdy5vbnBvcHN0YXRlID0gZjtcbiAgICB9XG4gICAgLy8gSGFuZGxlciBjYWxsZWQgd2hlbiB1c2VyIGNsaWNrcyB0aGUgYnJvd3NlcidzIGJhY2sgb3IgZm9yd2FyZCBidXR0b25zLlxuICAgIC8vIFNldHMgdGhlIGFwcCdzIGNvbnRleHQgYmFzZWQgb24gdGhlIGhhc2ggcGFydCBvZiB0aGUgYnJvd3NlcidzXG4gICAgLy8gbG9jYXRpb24uXG4gICAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbihldmVudCkge1xuXHRsZXQgY2ZnID0gcHFzdHJpbmcoZG9jdW1lbnQubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuXHRtZ3Yuc2V0Q29udGV4dChjZmcsIHRydWUpO1xuICAgIH07XG4gICAgLy8gZ2V0IGluaXRpYWwgc2V0IG9mIGNvbnRleHQgcGFyYW1zIFxuICAgIGxldCBxc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpO1xuICAgIGxldCBjZmcgPSBwcXN0cmluZyhxc3RyaW5nKTtcbiAgICBjZmcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjZmcub25jb250ZXh0Y2hhbmdlID0gc2V0SGFzaDtcblxuICAgIC8vIGNyZWF0ZSB0aGUgYXBwXG4gICAgd2luZG93Lm1ndiA9IG1ndiA9IG5ldyBNR1ZBcHAoc2VsZWN0b3IsIGNmZyk7XG4gICAgXG4gICAgLy8gaGFuZGxlIHJlc2l6ZSBldmVudHNcbiAgICB3aW5kb3cub25yZXNpemUgPSAoKSA9PiB7bWd2LnJlc2l6ZSgpO21ndi5zZXRDb250ZXh0KHt9KTt9XG59XG5cblxuX19tYWluX18oXCIjbWd2XCIpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvdmlld2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHBhcnNlQ29vcmRzLCBmb3JtYXRDb29yZHMsIGQzdHN2LCBkM2pzb24sIGluaXRPcHRMaXN0LCBzYW1lLCBjbGlwIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBHZW5vbWUgfSAgICAgICAgICBmcm9tICcuL0dlbm9tZSc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSAgICAgICBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBGZWF0dXJlTWFuYWdlciB9ICBmcm9tICcuL0ZlYXR1cmVNYW5hZ2VyJztcbmltcG9ydCB7IFF1ZXJ5TWFuYWdlciB9ICAgIGZyb20gJy4vUXVlcnlNYW5hZ2VyJztcbmltcG9ydCB7IExpc3RNYW5hZ2VyIH0gICAgIGZyb20gJy4vTGlzdE1hbmFnZXInO1xuaW1wb3J0IHsgTGlzdEVkaXRvciB9ICAgICAgZnJvbSAnLi9MaXN0RWRpdG9yJztcbmltcG9ydCB7IEZhY2V0TWFuYWdlciB9ICAgIGZyb20gJy4vRmFjZXRNYW5hZ2VyJztcbmltcG9ydCB7IEJUTWFuYWdlciB9ICAgICAgIGZyb20gJy4vQlRNYW5hZ2VyJztcbmltcG9ydCB7IEdlbm9tZVZpZXcgfSAgICAgIGZyb20gJy4vR2Vub21lVmlldyc7XG5pbXBvcnQgeyBGZWF0dXJlRGV0YWlscyB9ICBmcm9tICcuL0ZlYXR1cmVEZXRhaWxzJztcbmltcG9ydCB7IFpvb21WaWV3IH0gICAgICAgIGZyb20gJy4vWm9vbVZpZXcnO1xuaW1wb3J0IHsgS2V5U3RvcmUgfSAgICAgICAgZnJvbSAnLi9LZXlTdG9yZSc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgTUdWQXBwIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoc2VsZWN0b3IsIGNmZykge1xuXHRzdXBlcihudWxsLCBzZWxlY3Rvcik7XG5cdHRoaXMuYXBwID0gdGhpcztcblx0Ly9cblx0dGhpcy5pbml0aWFsQ2ZnID0gY2ZnO1xuXHQvL1xuXHR0aGlzLmNvbnRleHRDaGFuZ2VkID0gKGNmZy5vbmNvbnRleHRjaGFuZ2UgfHwgZnVuY3Rpb24oKXt9KTtcblx0Ly9cblx0dGhpcy5uYW1lMmdlbm9tZSA9IHt9OyAgLy8gbWFwIGZyb20gZ2Vub21lIG5hbWUgLT4gZ2Vub21lIGRhdGEgb2JqXG5cdHRoaXMubGFiZWwyZ2Vub21lID0ge307IC8vIG1hcCBmcm9tIGdlbm9tZSBsYWJlbCAtPiBnZW5vbWUgZGF0YSBvYmpcblx0dGhpcy5ubDJnZW5vbWUgPSB7fTsgICAgLy8gY29tYmluZXMgaW5kZXhlc1xuXHQvL1xuXHR0aGlzLmFsbEdlbm9tZXMgPSBbXTsgICAvLyBsaXN0IG9mIGFsbCBhdmFpbGFibGUgZ2Vub21lc1xuXHR0aGlzLnJHZW5vbWUgPSBudWxsOyAgICAvLyB0aGUgY3VycmVudCByZWZlcmVuY2UgZ2Vub21lXG5cdHRoaXMuY0dlbm9tZXMgPSBbXTsgICAgIC8vIGN1cnJlbnQgY29tcGFyaXNvbiBnZW5vbWVzIChyR2Vub21lIGlzICpub3QqIGluY2x1ZGVkKS5cblx0dGhpcy52R2Vub21lcyA9IFtdO1x0Ly8gbGlzdCBvZiBhbGwgY3VycmVudHkgdmlld2VkIGdlbm9tZXMgKHJlZitjb21wcykgaW4gWS1vcmRlci5cblx0Ly9cblx0dGhpcy5kdXIgPSAyNTA7ICAgICAgICAgLy8gYW5pbWF0aW9uIGR1cmF0aW9uLCBpbiBtc1xuXHR0aGlzLmRlZmF1bHRab29tID0gMjtcdC8vIG11bHRpcGxpZXIgb2YgY3VycmVudCByYW5nZSB3aWR0aC4gTXVzdCBiZSA+PSAxLiAxID09IG5vIHpvb20uXG5cdFx0XHRcdC8vICh6b29taW5nIGluIHVzZXMgMS90aGlzIGFtb3VudClcblx0dGhpcy5kZWZhdWx0UGFuICA9IDAuMTU7Ly8gZnJhY3Rpb24gb2YgY3VycmVudCByYW5nZSB3aWR0aFxuXHR0aGlzLmN1cnJMaXN0SW5kZXggPSB7fTtcblx0dGhpcy5jdXJyTGlzdENvdW50ZXIgPSAwO1xuXG5cblx0Ly8gQ29vcmRpbmF0ZXMgbWF5IGJlIHNwZWNpZmllZCBpbiBvbmUgb2YgdHdvIHdheXM6IG1hcHBlZCBvciBsYW5kbWFyay4gXG5cdC8vIE1hcHBlZCBjb29yZGluYXRlcyBhcmUgc3BlY2lmaWVkIGFzIGNocm9tb3NvbWUrc3RhcnQrZW5kLiBUaGlzIGNvb3JkaW5hdGUgcmFuZ2UgaXMgZGVmaW5lZCByZWxhdGl2ZSB0byBcblx0Ly8gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZSwgYW5kIGlzIG1hcHBlZCB0byB0aGUgY29ycmVzcG9uZGluZyByYW5nZShzKSBpbiBlYWNoIGNvbXBhcmlzb24gZ2Vub21lLlxuXHQvLyBMYW5kbWFyayBjb29yZGluYXRlcyBhcmUgc3BlY2lmaWVkIGFzIGxhbmRtYXJrK1tmbGFua3x3aWR0aF0rZGVsdGEuIFRoZSBsYW5kbWFyayBpcyBsb29rZWQgdXAgaW4gZWFjaCBcblx0Ly8gZ2Vub21lLiBJdHMgY29vcmRpbmF0ZXMsIGNvbWJpbmVkIHdpdGggZmxhbmt8bGVuZ3RoIGFuZCBkZWx0YSwgZGV0ZXJtaW5lIHRoZSBhYnNvbHV0ZSBjb29yZGluYXRlIHJhbmdlXG5cdC8vIGluIHRoYXQgZ2Vub21lLiBJZiB0aGUgbGFuZG1hcmsgZG9lcyBub3QgZXhpc3QgaW4gYSBnaXZlbiBnZW5vbWUsIHRoZW4gbWFwcGVkIGNvb3JkaW5hdGUgYXJlIHVzZWQuXG5cdC8vIFxuXHR0aGlzLmNtb2RlID0gJ21hcHBlZCcgLy8gJ21hcHBlZCcgb3IgJ2xhbmRtYXJrJ1xuXHR0aGlzLmNvb3JkcyA9IHsgY2hyOiAnMScsIHN0YXJ0OiAxMDAwMDAwLCBlbmQ6IDEwMDAwMDAwIH07ICAvLyBtYXBwZWRcblx0dGhpcy5sY29vcmRzID0geyBsYW5kbWFyazogJ1BheDYnLCBmbGFuazogNTAwMDAwLCBkZWx0YTowIH07Ly8gbGFuZG1hcmtcblxuXHR0aGlzLmluaXREb20oKTtcblxuXHQvL1xuXHQvL1xuXHR0aGlzLmdlbm9tZVZpZXcgPSBuZXcgR2Vub21lVmlldyh0aGlzLCAnI2dlbm9tZVZpZXcnLCA4MDAsIDI1MCk7XG5cdHRoaXMuem9vbVZpZXcgICA9IG5ldyBab29tVmlldyAgKHRoaXMsICcjem9vbVZpZXcnLCA4MDAsIDI1MCwgdGhpcy5jb29yZHMpO1xuXHR0aGlzLnJlc2l6ZSgpO1xuICAgICAgICAvL1xuXHR0aGlzLmZlYXR1cmVEZXRhaWxzID0gbmV3IEZlYXR1cmVEZXRhaWxzKHRoaXMsICcjZmVhdHVyZURldGFpbHMnKTtcblxuXHQvLyBDYXRlZ29yaWNhbCBjb2xvciBzY2FsZSBmb3IgZmVhdHVyZSB0eXBlc1xuXHR0aGlzLmNzY2FsZSA9IGQzLnNjYWxlLmNhdGVnb3J5MTAoKS5kb21haW4oW1xuXHQgICAgJ3Byb3RlaW5fY29kaW5nX2dlbmUnLFxuXHQgICAgJ3BzZXVkb2dlbmUnLFxuXHQgICAgJ25jUk5BX2dlbmUnLFxuXHQgICAgJ2dlbmVfc2VnbWVudCcsXG5cdCAgICAnb3RoZXJfZ2VuZScsXG5cdCAgICAnb3RoZXJfZmVhdHVyZV90eXBlJ1xuXHRdKTtcblx0Ly9cblx0Ly9cblx0dGhpcy5saXN0TWFuYWdlciAgICA9IG5ldyBMaXN0TWFuYWdlcih0aGlzLCBcIiNteWxpc3RzXCIpO1xuXHR0aGlzLmxpc3RNYW5hZ2VyLnJlYWR5LnRoZW4oICgpID0+IHRoaXMubGlzdE1hbmFnZXIudXBkYXRlKCkgKTtcblx0Ly9cblx0dGhpcy5saXN0RWRpdG9yID0gbmV3IExpc3RFZGl0b3IodGhpcywgJyNsaXN0ZWRpdG9yJyk7XG5cdC8vXG5cdHRoaXMucXVlcnlNYW5hZ2VyID0gbmV3IFF1ZXJ5TWFuYWdlcih0aGlzLCBcIiNmaW5kR2VuZXNCb3hcIik7XG5cdC8vIFxuXHR0aGlzLnRyYW5zbGF0b3IgICAgID0gbmV3IEJUTWFuYWdlcih0aGlzKTtcblx0dGhpcy5mZWF0dXJlTWFuYWdlciA9IG5ldyBGZWF0dXJlTWFuYWdlcih0aGlzKTtcblx0Ly9cblx0dGhpcy51c2VyUHJlZnNTdG9yZSA9IG5ldyBLZXlTdG9yZShcInVzZXItcHJlZmVyZW5jZXNcIik7XG5cdFxuXHQvL1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIEZhY2V0c1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vXG5cdHRoaXMuZmFjZXRNYW5hZ2VyID0gbmV3IEZhY2V0TWFuYWdlcih0aGlzKTtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdC8vIEZlYXR1cmUtdHlwZSBmYWNldFxuXHRsZXQgZnRGYWNldCAgPSB0aGlzLmZhY2V0TWFuYWdlci5hZGRGYWNldChcIkZlYXR1cmVUeXBlXCIsIGYgPT4gZi5nZXRNdW5nZWRUeXBlKCkpO1xuXHR0aGlzLmluaXRGZWF0VHlwZUNvbnRyb2woZnRGYWNldCk7XG5cblx0Ly8gSGFzLU1HSS1pZCBmYWNldFxuXHRsZXQgbWdpRmFjZXQgPSB0aGlzLmZhY2V0TWFuYWdlci5hZGRGYWNldChcIkhhc0Nhbm9uaWNhbElkXCIsICAgIGYgPT4gZi5jYW5vbmljYWwgID8gXCJ5ZXNcIiA6IFwibm9cIiApO1xuXHRkMy5zZWxlY3RBbGwoJ2lucHV0W25hbWU9XCJtZ2lGYWNldFwiXScpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCl7XG5cdCAgICBtZ2lGYWNldC5zZXRWYWx1ZXModGhpcy52YWx1ZSA9PT0gXCJcIiA/IFtdIDogW3RoaXMudmFsdWVdKTtcblx0ICAgIHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXG5cdC8vIElzLWluLWN1cnJlbnQtbGlzdCBmYWNldFxuXHRsZXQgaW5DdXJyTGlzdEZhY2V0ID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJJbkN1cnJMaXN0XCIsIGYgPT4ge1xuXHQgICAgcmV0dXJuIHRoaXMuY3Vyckxpc3RJbmRleFtmLmlkXSA/IFwieWVzXCIgOiBcIm5vXCI7XG5cdH0pO1xuXHRkMy5zZWxlY3RBbGwoJ2lucHV0W25hbWU9XCJpbkN1cnJMaXN0RmFjZXRcIl0nKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpe1xuXHQgICAgaW5DdXJyTGlzdEZhY2V0LnNldFZhbHVlcyh0aGlzLnZhbHVlID09PSBcIlwiID8gW10gOiBbdGhpcy52YWx1ZV0pO1xuXHQgICAgc2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0fSk7XG5cblx0Ly8gSXMtaGlnaGxpZ2h0ZWQgZmFjZXRcblx0bGV0IGhpRmFjZXQgPSB0aGlzLmZhY2V0TWFuYWdlci5hZGRGYWNldChcIklzSGlcIiwgZiA9PiB7XG5cdCAgICBsZXQgaXNoaSA9IHRoaXMuem9vbVZpZXcuaGlGZWF0c1tmLmlkXSB8fCB0aGlzLmN1cnJMaXN0SW5kZXhbZi5pZF07XG5cdCAgICByZXR1cm4gaXNoaSA/IFwieWVzXCIgOiBcIm5vXCI7XG5cdH0pO1xuXHRkMy5zZWxlY3RBbGwoJ2lucHV0W25hbWU9XCJoaUZhY2V0XCJdJykub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKXtcblx0ICAgIGhpRmFjZXQuc2V0VmFsdWVzKHRoaXMudmFsdWUgPT09IFwiXCIgPyBbXSA6IFt0aGlzLnZhbHVlXSk7XG5cdCAgICBzZWxmLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9KTtcblxuXG5cdC8vXG5cdHRoaXMuc2V0VUlGcm9tUHJlZnMoKTtcblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0Ly8gVGhpbmdzIGFyZSBhbGwgd2lyZWQgdXAuIE5vdyBsZXQncyBnZXQgc29tZSBkYXRhLlxuXHQvLyBTdGFydCB3aXRoIHRoZSBmaWxlIG9mIGFsbCB0aGUgZ2Vub21lcy5cblx0dGhpcy5jaGVja1RpbWVzdGFtcCgpLnRoZW4oICgpID0+IHtcblx0ICAgIGQzdHN2KFwiLi9kYXRhL2dlbm9tZWRhdGEvYWxsR2Vub21lcy50c3ZcIikudGhlbihkYXRhID0+IHtcblx0XHQvLyBjcmVhdGUgR2Vub21lIG9iamVjdHMgZnJvbSB0aGUgcmF3IGRhdGEuXG5cdFx0dGhpcy5hbGxHZW5vbWVzICAgPSBkYXRhLm1hcChnID0+IG5ldyBHZW5vbWUoZykpO1xuXHRcdHRoaXMuYWxsR2Vub21lcy5zb3J0KCAoYSxiKSA9PiB7XG5cdFx0ICAgIHJldHVybiBhLmxhYmVsIDwgYi5sYWJlbCA/IC0xIDogYS5sYWJlbCA+IGIubGFiZWwgPyArMSA6IDA7XG5cdFx0fSk7XG5cdFx0Ly9cblx0XHQvLyBidWlsZCBhIG5hbWUtPkdlbm9tZSBpbmRleFxuXHRcdHRoaXMubmwyZ2Vub21lID0ge307IC8vIGFsc28gYnVpbGQgdGhlIGNvbWJpbmVkIGxpc3QgYXQgdGhlIHNhbWUgdGltZS4uLlxuXHRcdHRoaXMubmFtZTJnZW5vbWUgID0gdGhpcy5hbGxHZW5vbWVzXG5cdFx0ICAgIC5yZWR1Y2UoKGFjYyxnKSA9PiB7IHRoaXMubmwyZ2Vub21lW2cubmFtZV0gPSBhY2NbZy5uYW1lXSA9IGc7IHJldHVybiBhY2M7IH0sIHt9KTtcblx0XHQvLyBidWlsZCBhIGxhYmVsLT5HZW5vbWUgaW5kZXhcblx0XHR0aGlzLmxhYmVsMmdlbm9tZSA9IHRoaXMuYWxsR2Vub21lc1xuXHRcdCAgICAucmVkdWNlKChhY2MsZykgPT4geyB0aGlzLm5sMmdlbm9tZVtnLmxhYmVsXSA9IGFjY1tnLmxhYmVsXSA9IGc7IHJldHVybiBhY2M7IH0sIHt9KTtcblxuXHRcdC8vIE5vdyBwcmVsb2FkIGFsbCB0aGUgY2hyb21vc29tZSBmaWxlcyBmb3IgYWxsIHRoZSBnZW5vbWVzXG5cdFx0bGV0IGNkcHMgPSB0aGlzLmFsbEdlbm9tZXMubWFwKGcgPT4gZDN0c3YoYC4vZGF0YS9nZW5vbWVkYXRhLyR7Zy5uYW1lfS1jaHJvbW9zb21lcy50c3ZgKSk7XG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKGNkcHMpO1xuXHQgICAgfSlcblx0ICAgIC50aGVuKCBkYXRhID0+IHtcblxuXHRcdC8vXG5cdFx0dGhpcy5wcm9jZXNzQ2hyb21vc29tZXMoZGF0YSk7XG5cdFx0dGhpcy5pbml0RG9tUGFydDIoKTtcblx0XHQvL1xuXHRcdC8vIEZJTkFMTFkhIFdlIGFyZSByZWFkeSB0byBkcmF3IHRoZSBpbml0aWFsIHNjZW5lLlxuXHRcdHRoaXMuc2V0Q29udGV4dCh0aGlzLmluaXRpYWxDZmcpO1xuXG5cdCAgICB9KTtcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNoZWNrVGltZXN0YW1wICgpIHtcbiAgICAgICAgbGV0IHRTdG9yZSA9IG5ldyBLZXlTdG9yZSgndGltZXN0YW1wJyk7XG5cdHJldHVybiBkM3RzdignLi9kYXRhL2dlbm9tZWRhdGEvVElNRVNUQU1QLnRzdicpLnRoZW4oIHRzID0+IHtcblx0ICAgIGxldCBuZXdUaW1lU3RhbXAgPSAgbmV3IERhdGUoRGF0ZS5wYXJzZSh0c1swXS5USU1FU1RBTVApKTtcblx0ICAgIHJldHVybiB0U3RvcmUuZ2V0KCdUSU1FU1RBTVAnKS50aGVuKCBvbGRUaW1lU3RhbXAgPT4ge1xuXHQgICAgICAgIGlmICghb2xkVGltZVN0YW1wIHx8IG5ld1RpbWVTdGFtcCA+IG9sZFRpbWVTdGFtcCkge1xuXHRcdCAgICB0U3RvcmUucHV0KCdUSU1FU1RBTVAnLG5ld1RpbWVTdGFtcCk7XG5cdFx0ICAgIHJldHVybiB0aGlzLmNsZWFyQ2FjaGVkRGF0YSgpO1xuXHRcdH1cblx0ICAgIH0pXG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBcbiAgICBpbml0RG9tICgpIHtcblx0c2VsZiA9IHRoaXM7XG5cdHRoaXMucm9vdCA9IGQzLnNlbGVjdCgnI21ndicpO1xuXHQvL1xuXHQvLyBUT0RPOiByZWZhY3RvciBwYWdlYm94LCBkcmFnZ2FibGUsIGFuZCBmcmllbmRzIGludG8gYSBmcmFtZXdvcmsgbW9kdWxlLFxuXHQvLyBcblx0dGhpcy5wYkRyYWdnZXIgPSB0aGlzLmdldENvbnRlbnREcmFnZ2VyKCk7XG5cdC8vIEFkZCBidXN5IGljb24sIGN1cnJlbnRseSBpbnZpc2liZS5cblx0ZDMuc2VsZWN0QWxsKCcucGFnZWJveCcpXG5cdCAgICAuYXBwZW5kKCdpJylcblx0XHQuYXR0cignY2xhc3MnLCdtYXRlcmlhbC1pY29ucyBidXN5IHJvdGF0aW5nJylcblx0ICAgIDtcblx0Ly9cblx0Ly8gSWYgYSBwYWdlYm94IGhhcyB0aXRsZSB0ZXh0LCBhcHBlbmQgYSBoZWxwIGljb24gdG8gdGhlIGxhYmVsIGFuZCBtb3ZlIHRoZSB0ZXh0IHRoZXJlXG5cdGQzLnNlbGVjdEFsbCgnLnBhZ2Vib3hbdGl0bGVdJylcblx0ICAgIC5hcHBlbmQoJ2knKVxuXHQgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXRlcmlhbC1pY29ucyBidXR0b24gaGVscCcpXG5cdCAgICAgICAgLmF0dHIoJ3RpdGxlJywgZnVuY3Rpb24oKXtcblx0XHQgICAgbGV0IHAgPSBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlKTtcblx0XHQgICAgbGV0IHQgPSBwLmF0dHIoJ3RpdGxlJyk7XG5cdFx0ICAgIHAuYXR0cigndGl0bGUnLCBudWxsKTtcblx0XHQgICAgcmV0dXJuIHQ7XG5cdFx0fSlcblx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0ICAgIHNlbGYuc2hvd1N0YXR1cyhkMy5zZWxlY3QodGhpcykuYXR0cigndGl0bGUnKSwgZDMuZXZlbnQuY2xpZW50WCwgZDMuZXZlbnQuY2xpZW50WSk7XG5cdFx0fSlcblx0XHQ7XG5cdC8vXG5cdGQzLnNlbGVjdEFsbCgnLmNsb3NhYmxlJylcblx0ICAgIC5hcHBlbmQoJ2knKVxuXHRcdC5hdHRyKCdjbGFzcycsJ21hdGVyaWFsLWljb25zIGJ1dHRvbiBjbG9zZScpXG5cdFx0LmF0dHIoJ3RpdGxlJywnQ2xpY2sgdG8gb3Blbi9jbG9zZS4nKVxuXHRcdC5vbignY2xpY2suZGVmYXVsdCcsIGZ1bmN0aW9uICgpIHtcblx0XHQgICAgbGV0IHAgPSBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlKTtcblx0XHQgICAgcC5jbGFzc2VkKCdjbG9zZWQnLCAhIHAuY2xhc3NlZCgnY2xvc2VkJykpO1xuXHRcdCAgICBkMy5zZWxlY3QodGhpcykuYXR0cigndGl0bGUnLCdDbGljayB0byAnICsgIChwLmNsYXNzZWQoJ2Nsb3NlZCcpID8gJ29wZW4nIDogJ2Nsb3NlJykgKyAnLicpXG5cdFx0ICAgIHNlbGYuc2V0UHJlZnNGcm9tVUkoKTtcblx0XHR9KTtcblx0ZDMuc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUgPiAqJylcblx0ICAgIC5hcHBlbmQoJ2knKVxuXHRcdC5hdHRyKCd0aXRsZScsJ0RyYWcgdXAvZG93biB0byByZXBvc2l0aW9uLicpXG5cdFx0LmF0dHIoJ2NsYXNzJywnbWF0ZXJpYWwtaWNvbnMgYnV0dG9uIGRyYWdoYW5kbGUnKVxuXHRcdC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XG5cdFx0ICAgIC8vIEF0dGFjaCB0aGUgZHJhZyBiZWhhdmlvciB3aGVuIHRoZSB1c2VyIG1vdXNlcyBvdmVyIHRoZSBkcmFnIGhhbmRsZSwgYW5kIHJlbW92ZSB0aGUgYmVoYXZpb3Jcblx0XHQgICAgLy8gd2hlbiB1c2VyIG1vdXNlcyBvdXQuIFdoeSBkbyBpdCB0aGlzIHdheT8gQmVjYXVzZSBpZiB0aGUgZHJhZyBiZWhhdmlvciBzdGF5cyBvbiBhbGwgdGhlIHRpbWUsXG5cdFx0ICAgIC8vIHRoZSB1c2VyIGNhbm5vdCBzZWxlY3QgYW55IHRleHQgd2l0aGluIHRoZSBib3guXG5cdFx0ICAgIGxldCBwYiA9IHRoaXMuY2xvc2VzdCgnLnBhZ2Vib3gnKTtcblx0XHQgICAgaWYgKCFwYikgcmV0dXJuO1xuXHRcdCAgICBkMy5zZWxlY3QocGIpLmNhbGwoc2VsZi5wYkRyYWdnZXIpO1xuXHRcdH0pXG5cdFx0Lm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKXtcblx0XHQgICAgbGV0IHBiID0gdGhpcy5jbG9zZXN0KCcucGFnZWJveCcpO1xuXHRcdCAgICBpZiAoIXBiKSByZXR1cm47XG5cdFx0ICAgIGQzLnNlbGVjdChwYikub24oJy5kcmFnJyxudWxsKTtcblx0XHR9KTtcblxuXHQvLyBcbiAgICAgICAgZDMuc2VsZWN0KCcjc3RhdHVzTWVzc2FnZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4geyB0aGlzLnNob3dTdGF0dXMoZmFsc2UpOyB9KTtcblx0XG5cdC8vXG5cdC8vIEJ1dHRvbjogR2VhciBpY29uIHRvIHNob3cvaGlkZSBsZWZ0IGNvbHVtblxuXHRkMy5zZWxlY3QoXCIjaGVhZGVyID4gLmdlYXIuYnV0dG9uXCIpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IGxjID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJsZWZ0Y29sdW1uXCJdJyk7XG5cdFx0bGMuY2xhc3NlZChcImNsb3NlZFwiLCAoKSA9PiAhIGxjLmNsYXNzZWQoXCJjbG9zZWRcIikpO1xuXHRcdHdpbmRvdy5zZXRUaW1lb3V0KCgpPT57XG5cdFx0ICAgIHRoaXMucmVzaXplKClcblx0XHQgICAgdGhpcy5zZXRDb250ZXh0KHt9KTtcblx0XHQgICAgdGhpcy5zZXRQcmVmc0Zyb21VSSgpO1xuXHRcdH0sIDI1MCk7XG5cdCAgICB9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRG9tIGluaXRpYWxpenRpb24gdGhhdCBtdXN0IHdhaXQgdW50aWwgYWZ0ZXIgZ2Vub21lIG1ldGEgZGF0YSBpcyBsb2FkZWQuXG4gICAgaW5pdERvbVBhcnQyICgpIHtcblx0Ly9cblx0bGV0IGNmZyA9IHRoaXMuc2FuaXRpemVDZmcodGhpcy5pbml0aWFsQ2ZnKTtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdC8vIGluaXRpYWxpemUgdGhlIHJlZiBhbmQgY29tcCBnZW5vbWUgb3B0aW9uIGxpc3RzXG5cdGluaXRPcHRMaXN0KFwiI3JlZkdlbm9tZVwiLCAgIHRoaXMuYWxsR2Vub21lcywgZz0+Zy5uYW1lLCBnPT5nLmxhYmVsLCBmYWxzZSwgZyA9PiBnID09PSBjZmcucmVmKTtcblx0aW5pdE9wdExpc3QoXCIjY29tcEdlbm9tZXNcIiwgdGhpcy5hbGxHZW5vbWVzLCBnPT5nLm5hbWUsIGc9PmcubGFiZWwsIHRydWUsICBnID0+IGNmZy5nZW5vbWVzLmluZGV4T2YoZykgIT09IC0xKTtcblx0ZDMuc2VsZWN0KFwiI3JlZkdlbm9tZVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0ICAgIHNlbGYuc2V0Q29udGV4dCh7IHJlZjogdGhpcy52YWx1ZSB9KTtcblx0fSk7XG5cdGQzLnNlbGVjdChcIiNjb21wR2Vub21lc1wiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0ICAgIGxldCBzZWxlY3RlZE5hbWVzID0gW107XG5cdCAgICBmb3IobGV0IHggb2YgdGhpcy5zZWxlY3RlZE9wdGlvbnMpe1xuXHRcdHNlbGVjdGVkTmFtZXMucHVzaCh4LnZhbHVlKTtcblx0ICAgIH1cblx0ICAgIC8vIHdhbnQgdG8gcHJlc2VydmUgY3VycmVudCBnZW5vbWUgb3JkZXIgYXMgbXVjaCBhcyBwb3NzaWJsZSBcblx0ICAgIGxldCBnTmFtZXMgPSBzZWxmLnZHZW5vbWVzLm1hcChnPT5nLm5hbWUpXG5cdFx0LmZpbHRlcihuID0+IHtcblx0XHQgICAgcmV0dXJuIHNlbGVjdGVkTmFtZXMuaW5kZXhPZihuKSA+PSAwIHx8IG4gPT09IHNlbGYuckdlbm9tZS5uYW1lO1xuXHRcdH0pO1xuXHQgICAgZ05hbWVzID0gZ05hbWVzLmNvbmNhdChzZWxlY3RlZE5hbWVzLmZpbHRlcihuID0+IGdOYW1lcy5pbmRleE9mKG4pID09PSAtMSkpO1xuXHQgICAgc2VsZi5zZXRDb250ZXh0KHsgZ2Vub21lczogZ05hbWVzIH0pO1xuXHR9KTtcblx0ZDN0c3YoXCIuL2RhdGEvZ2Vub21lZGF0YS9nZW5vbWVTZXRzLnRzdlwiKS50aGVuKHNldHMgPT4ge1xuXHQgICAgLy8gQ3JlYXRlIHNlbGVjdGlvbiBidXR0b25zLlxuXHQgICAgc2V0cy5mb3JFYWNoKCBzID0+IHMuZ2Vub21lcyA9IHMuZ2Vub21lcy5zcGxpdChcIixcIikgKTtcblx0ICAgIGxldCBjZ2IgPSBkMy5zZWxlY3QoJyNjb21wR2Vub21lc0JveCcpLnNlbGVjdEFsbCgnYnV0dG9uJykuZGF0YShzZXRzKTtcblx0ICAgIGNnYi5lbnRlcigpLmFwcGVuZCgnYnV0dG9uJylcblx0XHQudGV4dChkPT5kLm5hbWUpXG5cdFx0LmF0dHIoJ3RpdGxlJywgZD0+ZC5kZXNjcmlwdGlvbilcblx0XHQub24oJ2NsaWNrJywgZCA9PiB7XG5cdFx0ICAgIHNlbGYuc2V0Q29udGV4dChkKTtcblx0XHR9KVxuXHRcdDtcblx0fSkuY2F0Y2goKCk9Pntcblx0ICAgIGNvbnNvbGUubG9nKFwiTm8gZ2Vub21lU2V0cyBmaWxlIGZvdW5kLlwiKTtcblx0fSk7IC8vIE9LIGlmIG5vIGdlbm9tZVNldHMgZmlsZVxuXG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHByb2Nlc3NDaHJvbW9zb21lcyAoZGF0YSkge1xuXHQvLyBkYXRhIGlzIGEgbGlzdCBvZiBjaHJvbW9zb21lIGxpc3RzLCBvbmUgcGVyIGdlbm9tZVxuXHQvLyBGaWxsIGluIHRoZSBnZW5vbWVDaHJzIG1hcCAoZ2Vub21lIC0+IGNociBsaXN0KVxuXHR0aGlzLmFsbEdlbm9tZXMuZm9yRWFjaCgoZyxpKSA9PiB7XG5cdCAgICAvLyBuaWNlbHkgc29ydCB0aGUgY2hyb21vc29tZXNcblx0ICAgIGxldCBjaHJzID0gZGF0YVtpXTtcblx0ICAgIGcubWF4bGVuID0gMDtcblx0ICAgIGNocnMuZm9yRWFjaCggYyA9PiB7XG5cdFx0Ly9cblx0XHRjLmxlbmd0aCA9IHBhcnNlSW50KGMubGVuZ3RoKVxuXHRcdGcubWF4bGVuID0gTWF0aC5tYXgoZy5tYXhsZW4sIGMubGVuZ3RoKTtcblx0XHQvLyBiZWNhdXNlIEknZCByYXRoZXIgc2F5IFwiY2hyb21vc29tZS5uYW1lXCIgdGhhbiBcImNocm9tb3NvbWUuY2hyb21vc29tZVwiXG5cdFx0Yy5uYW1lID0gYy5jaHJvbW9zb21lO1xuXHRcdGRlbGV0ZSBjLmNocm9tb3NvbWU7XG5cdCAgICB9KTtcblx0ICAgIC8vIG5pY2VseSBzb3J0IHRoZSBjaHJvbW9zb21lc1xuXHQgICAgY2hycy5zb3J0KChhLGIpID0+IHtcblx0XHRsZXQgYWEgPSBwYXJzZUludChhLm5hbWUpIC0gcGFyc2VJbnQoYi5uYW1lKTtcblx0XHRpZiAoIWlzTmFOKGFhKSkgcmV0dXJuIGFhO1xuXHRcdHJldHVybiBhLm5hbWUgPCBiLm5hbWUgPyAtMSA6IGEubmFtZSA+IGIubmFtZSA/ICsxIDogMDtcblx0ICAgIH0pO1xuXHQgICAgZy5jaHJvbW9zb21lcyA9IGNocnM7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRDb250ZW50RHJhZ2dlciAoKSB7XG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAvLyBIZWxwZXIgZnVuY3Rpb24gZm9yIHRoZSBkcmFnIGJlaGF2aW9yLiBSZW9yZGVycyB0aGUgY29udGVudHMgYmFzZWQgb25cbiAgICAgIC8vIGN1cnJlbnQgc2NyZWVuIHBvc2l0aW9uIG9mIHRoZSBkcmFnZ2VkIGl0ZW0uXG4gICAgICBmdW5jdGlvbiByZW9yZGVyQnlEb20oKSB7XG5cdCAgLy8gTG9jYXRlIHRoZSBzaWIgd2hvc2UgcG9zaXRpb24gaXMgYmV5b25kIHRoZSBkcmFnZ2VkIGl0ZW0gYnkgdGhlIGxlYXN0IGFtb3VudFxuXHQgIGxldCBkciA9IHNlbGYuZHJhZ2dpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgbGV0IGJTaWIgPSBudWxsO1xuXHQgIGxldCB4eSA9IGQzLnNlbGVjdChzZWxmLmRyYWdQYXJlbnQpLmNsYXNzZWQoXCJmbGV4cm93XCIpID8gXCJ4XCIgOiBcInlcIjtcblx0ICBmb3IgKGxldCBzIG9mIHNlbGYuZHJhZ1NpYnMpIHtcblx0ICAgICAgbGV0IHNyID0gcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgaWYgKGRyW3h5XSA8IHNyW3h5XSkge1xuXHRcdCAgIGxldCBkaXN0ID0gc3JbeHldIC0gZHJbeHldO1xuXHRcdCAgIGlmICghYlNpYiB8fCBkaXN0IDwgYlNpYlt4eV0gLSBkclt4eV0pXG5cdFx0ICAgICAgIGJTaWIgPSBzO1xuXHQgICAgICB9XG5cdCAgfVxuXHQgIC8vIEluc2VydCB0aGUgZHJhZ2dlZCBpdGVtIGJlZm9yZSB0aGUgbG9jYXRlZCBzaWIgKG9yIGFwcGVuZCBpZiBubyBzaWIgZm91bmQpXG5cdCAgc2VsZi5kcmFnUGFyZW50Lmluc2VydEJlZm9yZShzZWxmLmRyYWdnaW5nLCBiU2liKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHJlb3JkZXJCeVN0eWxlKCkge1xuXHQgIGxldCBkZCA9IGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKTtcblx0ICAvLyBMb2NhdGUgdGhlIHNpYiB0aGF0IGNvbnRhaW5zIHRoZSBkcmFnZ2VkIGl0ZW0ncyBvcmlnaW4uXG5cdCAgbGV0IGRyID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICBsZXQgYlNpYiA9IG51bGw7XG5cdCAgbGV0IHh5ID0gZDMuc2VsZWN0KHNlbGYuZHJhZ1BhcmVudCkuY2xhc3NlZChcImZsZXhyb3dcIikgPyBcInhcIiA6IFwieVwiO1xuXHQgIGxldCBzeiA9IHh5ID09PSBcInhcIiA/IFwid2lkdGhcIiA6IFwiaGVpZ2h0XCI7XG5cdCAgbGV0IHN0eT0geHkgPT09IFwieFwiID8gXCJsZWZ0XCIgOiBcInRvcFwiO1xuXHQgIGZvciAobGV0IHMgb2Ygc2VsZi5kcmFnU2licykge1xuXHQgICAgICAvLyBza2lwIHRoZSBkcmFnZ2VkIGl0ZW1cblx0ICAgICAgaWYgKHMgPT09IHNlbGYuZHJhZ2dpbmcpIGNvbnRpbnVlO1xuXHQgICAgICBsZXQgZHMgPSBkMy5zZWxlY3Qocyk7XG5cdCAgICAgIGxldCBzciA9IHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIC8vIGlmdyB0aGUgZHJhZ2dlZCBpdGVtJ3Mgb3JpZ2luIGlzIGJldHdlZW4gdGhlIHN0YXJ0IGFuZCBlbmQgb2Ygc2liLCB3ZSBmb3VuZCBpdC5cblx0ICAgICAgaWYgKGRyW3h5XSA+PSBzclt4eV0gJiYgZHJbeHldIDw9IChzclt4eV0gKyBzcltzel0pKSB7XG5cdFx0ICAgLy8gbW92ZSBzaWIgdG93YXJkIHRoZSBob2xlLCBhbW91bnQgPSB0aGUgc2l6ZSBvZiB0aGUgaG9sZVxuXHRcdCAgIGxldCBhbXQgPSBzZWxmLmRyYWdIb2xlW3N6XSAqIChzZWxmLmRyYWdIb2xlW3h5XSA8IHNyW3h5XSA/IC0xIDogMSk7XG5cdFx0ICAgZHMuc3R5bGUoc3R5LCBwYXJzZUludChkcy5zdHlsZShzdHkpKSArIGFtdCArIFwicHhcIik7XG5cdFx0ICAgc2VsZi5kcmFnSG9sZVt4eV0gLT0gYW10O1xuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICB9XG5cdCAgfVxuICAgICAgfVxuICAgICAgLy9cbiAgICAgIHJldHVybiBkMy5iZWhhdmlvci5kcmFnKClcblx0ICAub3JpZ2luKGZ1bmN0aW9uKGQsaSl7XG5cdCAgICAgIHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIH0pXG4gICAgICAgICAgLm9uKFwiZHJhZ3N0YXJ0Lm1cIiwgZnVuY3Rpb24oKSB7XG5cdCAgICAgIGxldCB0ID0gZDMuZXZlbnQuc291cmNlRXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAoISBkMy5zZWxlY3QodCkuY2xhc3NlZChcImRyYWdoYW5kbGVcIikpIHJldHVybjtcblx0ICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIC8vXG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgICAgPSB0aGlzLmNsb3Nlc3QoXCIucGFnZWJveFwiKTtcblx0ICAgICAgc2VsZi5kcmFnSG9sZSAgICA9IHNlbGYuZHJhZ2dpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIHNlbGYuZHJhZ1BhcmVudCAgPSBzZWxmLmRyYWdnaW5nLnBhcmVudE5vZGU7XG5cdCAgICAgIHNlbGYuZHJhZ1NpYnMgICAgPSBzZWxmLmRyYWdQYXJlbnQuY2hpbGRyZW47XG5cdCAgICAgIC8vXG5cdCAgICAgIGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKS5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgdHJ1ZSk7XG5cdCAgfSlcblx0ICAub24oXCJkcmFnLm1cIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgbGV0IGRkID0gZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpO1xuXHQgICAgICBsZXQgdHAgPSBwYXJzZUludChkZC5zdHlsZShcInRvcFwiKSlcblx0ICAgICAgZGQuc3R5bGUoXCJ0b3BcIiwgdHAgKyBkMy5ldmVudC5keSArIFwicHhcIik7XG5cdCAgICAgIC8vcmVvcmRlckJ5U3R5bGUoKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWdlbmQubVwiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICByZW9yZGVyQnlEb20oKTtcblx0ICAgICAgc2VsZi5zZXRQcmVmc0Zyb21VSSgpO1xuXHQgICAgICBsZXQgZGQgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZyk7XG5cdCAgICAgIGRkLnN0eWxlKFwidG9wXCIsIFwiMHB4XCIpO1xuXHQgICAgICBkZC5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgZmFsc2UpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nICAgID0gbnVsbDtcblx0ICAgICAgc2VsZi5kcmFnSG9sZSAgICA9IG51bGw7XG5cdCAgICAgIHNlbGYuZHJhZ1BhcmVudCAgPSBudWxsO1xuXHQgICAgICBzZWxmLmRyYWdTaWJzICAgID0gbnVsbDtcblx0ICB9KVxuXHQgIDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0VUlGcm9tUHJlZnMgKCkge1xuXHR0aGlzLnVzZXJQcmVmc1N0b3JlLmdldChcInByZWZzXCIpLnRoZW4oIHByZWZzID0+IHtcblx0ICAgIHByZWZzID0gcHJlZnMgfHwge307XG5cdCAgICBjb25zb2xlLmxvZyhcIkdvdCBwcmVmcyBmcm9tIHN0b3JhZ2VcIiwgcHJlZnMpO1xuXG5cdCAgICAvLyBzZXQgb3Blbi9jbG9zZWQgc3RhdGVzXG5cdCAgICAocHJlZnMuY2xvc2FibGVzIHx8IFtdKS5mb3JFYWNoKCBjID0+IHtcblx0XHRsZXQgaWQgPSBjWzBdO1xuXHRcdGxldCBzdGF0ZSA9IGNbMV07XG5cdFx0ZDMuc2VsZWN0KCcjJytpZCkuY2xhc3NlZCgnY2xvc2VkJywgc3RhdGUgPT09IFwiY2xvc2VkXCIgfHwgbnVsbCk7XG5cdCAgICB9KTtcblxuXHQgICAgLy8gc2V0IGRyYWdnYWJsZXMnIG9yZGVyXG5cdCAgICAocHJlZnMuZHJhZ2dhYmxlcyB8fCBbXSkuZm9yRWFjaCggZCA9PiB7XG5cdFx0bGV0IGN0cklkID0gZFswXTtcblx0XHRsZXQgY29udGVudElkcyA9IGRbMV07XG5cdFx0bGV0IGN0ciA9IGQzLnNlbGVjdCgnIycrY3RySWQpO1xuXHRcdGxldCBjb250ZW50cyA9IGN0ci5zZWxlY3RBbGwoJyMnK2N0cklkKycgPiAqJyk7XG5cdFx0Y29udGVudHNbMF0uc29ydCggKGEsYikgPT4ge1xuXHRcdCAgICBsZXQgYWkgPSBjb250ZW50SWRzLmluZGV4T2YoYS5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuXHRcdCAgICBsZXQgYmkgPSBjb250ZW50SWRzLmluZGV4T2YoYi5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuXHRcdCAgICByZXR1cm4gYWkgLSBiaTtcblx0XHR9KTtcblx0XHRjb250ZW50cy5vcmRlcigpO1xuXHQgICAgfSk7XG5cdH0pO1xuICAgIH1cbiAgICBzZXRQcmVmc0Zyb21VSSAoKSB7XG4gICAgICAgIC8vIHNhdmUgb3Blbi9jbG9zZWQgc3RhdGVzXG5cdGxldCBjbG9zYWJsZXMgPSB0aGlzLnJvb3Quc2VsZWN0QWxsKCcuY2xvc2FibGUnKTtcblx0bGV0IG9jRGF0YSA9IGNsb3NhYmxlc1swXS5tYXAoIGMgPT4ge1xuXHQgICAgbGV0IGRjID0gZDMuc2VsZWN0KGMpO1xuXHQgICAgcmV0dXJuIFtkYy5hdHRyKCdpZCcpLCBkYy5jbGFzc2VkKFwiY2xvc2VkXCIpID8gXCJjbG9zZWRcIiA6IFwib3BlblwiXTtcblx0fSk7XG5cdC8vIHNhdmUgZHJhZ2dhYmxlcycgb3JkZXJcblx0bGV0IGRyYWdDdHJzID0gdGhpcy5yb290LnNlbGVjdEFsbCgnLmNvbnRlbnQtZHJhZ2dhYmxlJyk7XG5cdGxldCBkcmFnZ2FibGVzID0gZHJhZ0N0cnMuc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUgPiAqJyk7XG5cdGxldCBkZERhdGEgPSBkcmFnZ2FibGVzLm1hcCggKGQsaSkgPT4ge1xuXHQgICAgbGV0IGN0ciA9IGQzLnNlbGVjdChkcmFnQ3Ryc1swXVtpXSk7XG5cdCAgICByZXR1cm4gW2N0ci5hdHRyKCdpZCcpLCBkLm1hcCggZGQgPT4gZDMuc2VsZWN0KGRkKS5hdHRyKCdpZCcpKV07XG5cdH0pO1xuXHRsZXQgcHJlZnMgPSB7XG5cdCAgICBjbG9zYWJsZXM6IG9jRGF0YSxcblx0ICAgIGRyYWdnYWJsZXM6IGRkRGF0YVxuXHR9XG5cdGNvbnNvbGUubG9nKFwiU2F2aW5nIHByZWZzIHRvIHN0b3JhZ2VcIiwgcHJlZnMpO1xuXHR0aGlzLnVzZXJQcmVmc1N0b3JlLnNldChcInByZWZzXCIsIHByZWZzKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd0Jsb2NrcyAoY29tcCkge1xuXHRsZXQgcmVmID0gdGhpcy5yR2Vub21lO1xuXHRpZiAoISBjb21wKSBjb21wID0gdGhpcy5jR2Vub21lc1swXTtcblx0aWYgKCEgY29tcCkgcmV0dXJuO1xuXHR0aGlzLnRyYW5zbGF0b3IucmVhZHkoKS50aGVuKCAoKSA9PiB7XG5cdCAgICBsZXQgYmxvY2tzID0gY29tcCA9PT0gcmVmID8gW10gOiB0aGlzLnRyYW5zbGF0b3IuZ2V0QmxvY2tzKHJlZiwgY29tcCk7XG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd0Jsb2Nrcyh7IHJlZiwgY29tcCwgYmxvY2tzIH0pO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd0J1c3kgKGlzQnVzeSwgbWVzc2FnZSkge1xuICAgICAgICBkMy5zZWxlY3QoXCIjaGVhZGVyID4gLmdlYXIuYnV0dG9uXCIpXG5cdCAgICAuY2xhc3NlZChcInJvdGF0aW5nXCIsIGlzQnVzeSk7XG4gICAgICAgIGQzLnNlbGVjdChcIiN6b29tVmlld1wiKS5jbGFzc2VkKFwiYnVzeVwiLCBpc0J1c3kpO1xuXHRpZiAoaXNCdXN5ICYmIG1lc3NhZ2UpIHRoaXMuc2hvd1N0YXR1cyhtZXNzYWdlKTtcblx0aWYgKCFpc0J1c3kpIHRoaXMuc2hvd1N0YXR1cygnJylcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd2luZ1N0YXR1cyAoKSB7XG4gICAgICAgIHJldHVybiBkMy5zZWxlY3QoJyNzdGF0dXNNZXNzYWdlJykuY2xhc3NlZCgnc2hvd2luZycpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dTdGF0dXMgKG1zZywgbmVhclgsIG5lYXJZKSB7XG5cdGxldCBiYiA9IHRoaXMucm9vdC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdGxldCBfID0gKG4sIGxlbiwgbm1heCkgPT4ge1xuXHQgICAgaWYgKG4gPT09IHVuZGVmaW5lZClcblx0ICAgICAgICByZXR1cm4gJzUwJSc7XG5cdCAgICBlbHNlIGlmICh0eXBlb2YobikgPT09ICdzdHJpbmcnKVxuXHQgICAgICAgIHJldHVybiBuO1xuXHQgICAgZWxzZSBpZiAoIG4gKyBsZW4gPCBubWF4ICkge1xuXHQgICAgICAgIHJldHVybiBuICsgJ3B4Jztcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIHJldHVybiAobm1heCAtIGxlbikgKyAncHgnO1xuXHQgICAgfVxuXHR9O1xuXHRuZWFyWCA9IF8obmVhclgsIDI1MCwgYmIud2lkdGgpO1xuXHRuZWFyWSA9IF8obmVhclksIDE1MCwgYmIuaGVpZ2h0KTtcblx0aWYgKG1zZylcblx0ICAgIGQzLnNlbGVjdCgnI3N0YXR1c01lc3NhZ2UnKVxuXHRcdC5jbGFzc2VkKCdzaG93aW5nJywgdHJ1ZSlcblx0XHQuc3R5bGUoJ2xlZnQnLCBuZWFyWClcblx0XHQuc3R5bGUoJ3RvcCcsICBuZWFyWSlcblx0XHQuc2VsZWN0KCdzcGFuJylcblx0XHQgICAgLnRleHQobXNnKTtcblx0ZWxzZVxuXHQgICAgZDMuc2VsZWN0KCcjc3RhdHVzTWVzc2FnZScpLmNsYXNzZWQoJ3Nob3dpbmcnLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0UmVmR2Vub21lU2VsZWN0aW9uICgpIHtcblx0ZDMuc2VsZWN0QWxsKFwiI3JlZkdlbm9tZSBvcHRpb25cIilcblx0ICAgIC5wcm9wZXJ0eShcInNlbGVjdGVkXCIsICBnZyA9PiAoZ2cubGFiZWwgPT09IHRoaXMuckdlbm9tZS5sYWJlbCAgfHwgbnVsbCkpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRDb21wR2Vub21lc1NlbGVjdGlvbiAoKSB7XG5cdGxldCBjZ25zID0gdGhpcy52R2Vub21lcy5tYXAoZz0+Zy5sYWJlbCk7XG5cdGQzLnNlbGVjdEFsbChcIiNjb21wR2Vub21lcyBvcHRpb25cIilcblx0ICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCAgZ2cgPT4gY2ducy5pbmRleE9mKGdnLmxhYmVsKSA+PSAwKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyBvciByZXR1cm5zXG4gICAgc2V0SGlnaGxpZ2h0IChmbGlzdCkge1xuXHRpZiAoIWZsaXN0KSByZXR1cm4gZmFsc2U7XG5cdHRoaXMuem9vbVZpZXcuaGlGZWF0cyA9IGZsaXN0LnJlZHVjZSgoYSx2KSA9PiB7IGFbdl09djsgcmV0dXJuIGE7IH0sIHt9KTtcblx0cmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIGN1cnJlbnQgY29udGV4dCBhcyBhbiBvYmplY3QuXG4gICAgLy8gQ3VycmVudCBjb250ZXh0ID0gcmVmIGdlbm9tZSArIGNvbXAgZ2Vub21lcyArIGN1cnJlbnQgcmFuZ2UgKGNocixzdGFydCxlbmQpXG4gICAgZ2V0Q29udGV4dCAoKSB7XG5cdGlmICh0aGlzLmNtb2RlID09PSAnbWFwcGVkJykge1xuXHQgICAgbGV0IGMgPSB0aGlzLmNvb3Jkcztcblx0ICAgIHJldHVybiB7XG5cdFx0cmVmIDogdGhpcy5yR2Vub21lLmxhYmVsLFxuXHRcdGdlbm9tZXM6IHRoaXMudkdlbm9tZXMubWFwKGc9PmcubGFiZWwpLFxuXHRcdGNocjogYy5jaHIsXG5cdFx0c3RhcnQ6IGMuc3RhcnQsXG5cdFx0ZW5kOiBjLmVuZCxcblx0XHRoaWdobGlnaHQ6IE9iamVjdC5rZXlzKHRoaXMuem9vbVZpZXcuaGlGZWF0cykuc29ydCgpLFxuXHRcdGRtb2RlOiB0aGlzLnpvb21WaWV3LmRtb2RlXG5cdCAgICB9XG5cdH0gZWxzZSB7XG5cdCAgICBsZXQgYyA9IHRoaXMubGNvb3Jkcztcblx0ICAgIHJldHVybiB7XG5cdFx0cmVmIDogdGhpcy5yR2Vub21lLmxhYmVsLFxuXHRcdGdlbm9tZXM6IHRoaXMudkdlbm9tZXMubWFwKGc9PmcubGFiZWwpLFxuXHRcdGxhbmRtYXJrOiBjLmxhbmRtYXJrLFxuXHRcdGZsYW5rOiBjLmZsYW5rLFxuXHRcdGxlbmd0aDogYy5sZW5ndGgsXG5cdFx0ZGVsdGE6IGMuZGVsdGEsXG5cdFx0aGlnaGxpZ2h0OiBPYmplY3Qua2V5cyh0aGlzLnpvb21WaWV3LmhpRmVhdHMpLnNvcnQoKSxcblx0XHRkbW9kZTogdGhpcy56b29tVmlldy5kbW9kZVxuXHQgICAgfVxuXHR9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJlc29sdmVzIHRoZSBzcGVjaWZpZWQgbGFuZG1hcmsgdG8gYSBmZWF0dXJlIGFuZCB0aGUgbGlzdCBvZiBlcXVpdmFsZW50IGZlYXVyZXMuXG4gICAgLy8gTWF5IGJlIGdpdmVuIGFuIGlkLCBjYW5vbmljYWwgaWQsIG9yIHN5bWJvbC5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBjZmcgKG9iaikgU2FuaXRpemVkIGNvbmZpZyBvYmplY3QsIHdpdGggYSBsYW5kbWFyayAoc3RyaW5nKSBmaWVsZC5cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgICBUaGUgY2ZnIG9iamVjdCwgd2l0aCBhZGRpdGlvbmFsIGZpZWxkczpcbiAgICAvLyAgICAgICAgbGFuZG1hcmtSZWZGZWF0OiB0aGUgbGFuZG1hcmsgKEZlYXR1cmUgb2JqKSBpbiB0aGUgcmVmIGdlbm9tZVxuICAgIC8vICAgICAgICBsYW5kbWFya0ZlYXRzOiBbIGVxdWl2YWxlbnQgZmVhdHVyZXMgaW4gZWFjaCBnZW5vbWUgKGluY2x1ZGVzIHJmKV1cbiAgICAvLyAgICAgQWxzbywgY2hhbmdlcyByZWYgdG8gYmUgdGhlIGdlbm9tZSBvZiB0aGUgbGFuZG1hcmtSZWZGZWF0XG4gICAgLy8gICAgIFJldHVybnMgbnVsbCBpZiBsYW5kbWFyayBub3QgZm91bmQgaW4gYW55IGdlbm9tZS5cbiAgICAvLyBcbiAgICByZXNvbHZlTGFuZG1hcmsgKGNmZykge1xuXHRsZXQgcmYsIGZlYXRzO1xuXHQvLyBGaW5kIHRoZSBsYW5kbWFyayBmZWF0dXJlIGluIHRoZSByZWYgZ2Vub21lLiBcblx0cmYgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlMYWJlbChjZmcubGFuZG1hcmssIGNmZy5yZWYpWzBdO1xuXHRpZiAoIXJmKSB7XG5cdCAgICAvLyBMYW5kbWFyayBkb2VzIG5vdCBleGlzdCBpbiByZWYgZ2Vub21lLiBEb2VzIGl0IGV4aXN0IGluIGFueSBzcGVjaWZpZWQgZ2Vub21lP1xuXHQgICAgcmYgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlMYWJlbChjZmcubGFuZG1hcmspLmZpbHRlcihmID0+IGNmZy5nZW5vbWVzLmluZGV4T2YoZi5nZW5vbWUpID49IDApWzBdO1xuXHQgICAgaWYgKHJmKSB7XG5cdCAgICAgICAgY2ZnLnJlZiA9IHJmLmdlbm9tZTtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIC8vIExhbmRtYXJrIGNhbm5vdCBiZSByZXNvbHZlZC5cblx0XHRyZXR1cm4gbnVsbDtcblx0ICAgIH1cblx0fVxuXHQvLyBsYW5kbWFyayBleGlzdHMgaW4gcmVmIGdlbm9tZS4gR2V0IGVxdWl2YWxlbnQgZmVhdCBpbiBlYWNoIGdlbm9tZS5cblx0ZmVhdHMgPSByZi5jYW5vbmljYWwgPyB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlDYW5vbmljYWxJZChyZi5jYW5vbmljYWwpIDogW3JmXTtcblx0Y2ZnLmxhbmRtYXJrUmVmRmVhdCA9IHJmO1xuXHRjZmcubGFuZG1hcmtGZWF0cyA9IGZlYXRzLmZpbHRlcihmID0+IGNmZy5nZW5vbWVzLmluZGV4T2YoZi5nZW5vbWUpID49IDApO1xuXHRyZXR1cm4gY2ZnO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgc2FuaXRpemVkIHZlcnNpb24gb2YgdGhlIGFyZ3VtZW50IGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICAgIC8vIFRoZSBzYW5pdGl6ZWQgdmVyc2lvbjpcbiAgICAvLyAgICAgLSBoYXMgYSBzZXR0aW5nIGZvciBldmVyeSBwYXJhbWV0ZXIuIFBhcmFtZXRlcnMgbm90IHNwZWNpZmllZCBpbiBcbiAgICAvLyAgICAgICB0aGUgYXJndW1lbnQgYXJlIChnZW5lcmFsbHkpIGZpbGxlZCBpbiB3aXRoIHRoZWlyIGN1cnJlbnQgdmFsdWVzLlxuICAgIC8vICAgICAtIGlzIGFsd2F5cyB2YWxpZCwgZWdcbiAgICAvLyAgICAgXHQtIGhhcyBhIGxpc3Qgb2YgMSBvciBtb3JlIHZhbGlkIGdlbm9tZXMsIHdpdGggb25lIG9mIHRoZW0gZGVzaWduYXRlZCBhcyB0aGUgcmVmXG4gICAgLy8gICAgIFx0LSBoYXMgYSB2YWxpZCBjb29yZGluYXRlIHJhbmdlXG4gICAgLy8gICAgIFx0ICAgIC0gc3RhcnQgYW5kIGVuZCBhcmUgaW50ZWdlcnMgd2l0aCBzdGFydCA8PSBlbmRcbiAgICAvLyAgICAgXHQgICAgLSB2YWxpZCBjaHJvbW9zb21lIGZvciByZWYgZ2Vub21lXG4gICAgLy9cbiAgICAvLyBUaGUgc2FuaXRpemVkIHZlcnNpb24gaXMgYWxzbyBcImNvbXBpbGVkXCI6XG4gICAgLy8gICAgIC0gaXQgaGFzIGFjdHVhbCBHZW5vbWUgb2JqZWN0cywgd2hlcmUgdGhlIGFyZ3VtZW50IGp1c3QgaGFzIG5hbWVzXG4gICAgLy8gICAgIC0gZ3JvdXBzIHRoZSBjaHIrc3RhcnQrZW5kIGluIFwiY29vcmRzXCIgb2JqZWN0XG4gICAgLy9cbiAgICAvL1xuICAgIHNhbml0aXplQ2ZnIChjKSB7XG5cdGxldCBjZmcgPSB7fTtcblxuXHQvLyBTYW5pdGl6ZSB0aGUgaW5wdXQuXG5cblx0Ly8gd2luZG93IHNpemUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0aWYgKGMud2lkdGgpIHtcblx0ICAgIGNmZy53aWR0aCA9IGMud2lkdGhcblx0fVxuXG5cdC8vIHJlZiBnZW5vbWUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vXG5cdC8vIFNldCBjZmcucmVmIHRvIHNwZWNpZmllZCBnZW5vbWUsIFxuXHQvLyAgIHdpdGggZmFsbGJhY2sgdG8gY3VycmVudCByZWYgZ2Vub21lLCBcblx0Ly8gICAgICB3aXRoIGZhbGxiYWNrIHRvIEM1N0JMLzZKICgxc3QgdGltZSB0aHJ1KVxuXHQvLyBGSVhNRTogZmluYWwgZmFsbGJhY2sgc2hvdWxkIGJlIGEgY29uZmlnIHNldHRpbmcuXG5cdGNmZy5yZWYgPSAoYy5yZWYgPyB0aGlzLm5sMmdlbm9tZVtjLnJlZl0gfHwgdGhpcy5yR2Vub21lIDogdGhpcy5yR2Vub21lKSB8fCB0aGlzLm5sMmdlbm9tZVsnQzU3QkwvNkonXTtcblxuXHQvLyBjb21wYXJpc29uIGdlbm9tZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBTZXQgY2ZnLmdlbm9tZXMgdG8gYmUgdGhlIHNwZWNpZmllZCBnZW5vbWVzLFxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBnZW5vbWVzXG5cdC8vICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIFtyZWZdICgxc3QgdGltZSB0aHJ1KVxuXHRjZmcuZ2Vub21lcyA9IGMuZ2Vub21lcyA/XG5cdCAgICAoYy5nZW5vbWVzLm1hcChnID0+IHRoaXMubmwyZ2Vub21lW2ddKS5maWx0ZXIoeD0+eCkpXG5cdCAgICA6XG5cdCAgICB0aGlzLnZHZW5vbWVzO1xuXHQvLyBBZGQgcmVmIHRvIGdlbm9tZXMgaWYgbm90IHRoZXJlIGFscmVhZHlcblx0aWYgKGNmZy5nZW5vbWVzLmluZGV4T2YoY2ZnLnJlZikgPT09IC0xKVxuXHQgICAgY2ZnLmdlbm9tZXMudW5zaGlmdChjZmcucmVmKTtcblx0XG5cdC8vIGFic29sdXRlIGNvb3JkaW5hdGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vXG5cdC8vIFNldCBjZmcuY2hyIHRvIGJlIHRoZSBzcGVjaWZpZWQgY2hyb21vc29tZVxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBjaHJcblx0Ly8gICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSAxc3QgY2hyb21vc29tZSBpbiB0aGUgcmVmIGdlbm9tZVxuXHRjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKGMuY2hyKTtcblx0aWYgKCFjZmcuY2hyKSBjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKCB0aGlzLmNvb3JkcyA/IHRoaXMuY29vcmRzLmNociA6IFwiMVwiICk7XG5cdGlmICghY2ZnLmNocikgY2ZnLmNociA9IGNmZy5yZWYuZ2V0Q2hyb21vc29tZSgwKTtcblx0aWYgKCFjZmcuY2hyKSB0aHJvdyBcIk5vIGNocm9tb3NvbWUuXCJcblx0XG5cdC8vIFNldCBjZmcuc3RhcnQgdG8gYmUgdGhlIHNwZWNpZmllZCBzdGFydCB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IHN0YXJ0XG5cdC8vIENsaXAgYXQgY2hyIGJvdW5kYXJpZXNcblx0Y2ZnLnN0YXJ0ID0gY2xpcChNYXRoLnJvdW5kKHR5cGVvZihjLnN0YXJ0KSA9PT0gXCJudW1iZXJcIiA/IGMuc3RhcnQgOiB0aGlzLmNvb3Jkcy5zdGFydCksIDEsIGNmZy5jaHIubGVuZ3RoKTtcblxuXHQvLyBTZXQgY2ZnLmVuZCB0byBiZSB0aGUgc3BlY2lmaWVkIGVuZCB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGVuZFxuXHQvLyBDbGlwIGF0IGNociBib3VuZGFyaWVzXG5cdGNmZy5lbmQgPSBjbGlwKE1hdGgucm91bmQodHlwZW9mKGMuZW5kKSA9PT0gXCJudW1iZXJcIiA/IGMuZW5kIDogdGhpcy5jb29yZHMuZW5kKSwgMSwgY2ZnLmNoci5sZW5ndGgpO1xuXG5cdC8vIEVuc3VyZSBzdGFydCA8PSBlbmRcblx0aWYgKGNmZy5zdGFydCA+IGNmZy5lbmQpIHtcblx0ICAgbGV0IHRtcCA9IGNmZy5zdGFydDsgY2ZnLnN0YXJ0ID0gY2ZnLmVuZDsgY2ZnLmVuZCA9IHRtcDtcblx0fVxuXG5cdC8vIGxhbmRtYXJrIGNvb3JkaW5hdGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIE5PVEUgdGhhdCBsYW5kbWFyayBjb29yZGluYXRlIGNhbm5vdCBiZSBmdWxseSByZXNvbHZlZCB0byBhYnNvbHV0ZSBjb29yZGluYXRlIHVudGlsXG5cdC8vICphZnRlciogZ2Vub21lIGRhdGEgaGF2ZSBiZWVuIGxvYWRlZC4gU2VlIHNldENvbnRleHQgYW5kIHJlc29sdmVMYW5kbWFyayBtZXRob2RzLlxuXHRjZmcubGFuZG1hcmsgPSBjLmxhbmRtYXJrIHx8IHRoaXMubGNvb3Jkcy5sYW5kbWFyaztcblx0Y2ZnLmRlbHRhICAgID0gTWF0aC5yb3VuZCgnZGVsdGEnIGluIGMgPyBjLmRlbHRhIDogKHRoaXMubGNvb3Jkcy5kZWx0YSB8fCAwKSk7XG5cdGlmICh0eXBlb2YoYy5mbGFuaykgPT09ICdudW1iZXInKXtcblx0ICAgIGNmZy5mbGFuayA9IE1hdGgucm91bmQoYy5mbGFuayk7XG5cdH1cblx0ZWxzZSBpZiAoJ2xlbmd0aCcgaW4gYykge1xuXHQgICAgY2ZnLmxlbmd0aCA9IE1hdGgucm91bmQoYy5sZW5ndGgpO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgY2ZnLmxlbmd0aCA9IE1hdGgucm91bmQodGhpcy5jb29yZHMuZW5kIC0gdGhpcy5jb29yZHMuc3RhcnQgKyAxKTtcblx0fVxuXG5cdC8vIGNtb2RlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGlmIChjLmNtb2RlICYmIGMuY21vZGUgIT09ICdtYXBwZWQnICYmIGMuY21vZGUgIT09ICdsYW5kbWFyaycpIGMuY21vZGUgPSBudWxsO1xuXHRjZmcuY21vZGUgPSBjLmNtb2RlIHx8IFxuXHQgICAgKCgnY2hyJyBpbiBjIHx8ICdzdGFydCcgaW4gYyB8fCAnZW5kJyBpbiBjKSA/XG5cdCAgICAgICAgJ21hcHBlZCcgOiBcblx0XHQoJ2xhbmRtYXJrJyBpbiBjIHx8ICdmbGFuaycgaW4gYyB8fCAnbGVuZ3RoJyBpbiBjIHx8ICdkZWx0YScgaW4gYykgP1xuXHRcdCAgICAnbGFuZG1hcmsnIDogXG5cdFx0ICAgIHRoaXMuY21vZGUgfHwgJ21hcHBlZCcpO1xuXG5cdC8vIGhpZ2hsaWdodGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIFNldCBjZmcuaGlnaGxpZ2h0XG5cdC8vICAgIHdpdGggZmFsbGJhY2sgdG8gY3VycmVudCBoaWdobGlnaHRcblx0Ly8gICAgICAgIHdpdGggZmFsbGJhY2sgdG8gW11cblx0Y2ZnLmhpZ2hsaWdodCA9IGMuaGlnaGxpZ2h0IHx8IHRoaXMuem9vbVZpZXcuaGlnaGxpZ2h0ZWQgfHwgW107XG5cblx0Ly8gZHJhd2luZyBtb2RlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gU2V0IHRoZSBkcmF3aW5nIG1vZGUgZm9yIHRoZSBab29tVmlldy5cblx0Ly8gICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgdmFsdWVcblx0aWYgKGMuZG1vZGUgPT09ICdjb21wYXJpc29uJyB8fCBjLmRtb2RlID09PSAncmVmZXJlbmNlJykgXG5cdCAgICBjZmcuZG1vZGUgPSBjLmRtb2RlO1xuXHRlbHNlXG5cdCAgICBjZmcuZG1vZGUgPSB0aGlzLnpvb21WaWV3LmRtb2RlIHx8ICdjb21wYXJpc29uJztcblxuXHQvL1xuXHRyZXR1cm4gY2ZnO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNldHMgdGhlIGN1cnJlbnQgY29udGV4dCBmcm9tIHRoZSBjb25maWcgb2JqZWN0LiBcbiAgICAvLyBPbmx5IHRob3NlIGNvbnRleHQgaXRlbXMgc3BlY2lmaWVkIGluIHRoZSBjb25maWcgYXJlIGFmZmVjdGVkLCBleGNlcHQgYXMgbm90ZWQuXG4gICAgLy9cbiAgICAvLyBBbGwgY29uZmlncyBhcmUgc2FuaXRpemVkIGJlZm9yZSBiZWluZyBhcHBsaWVkIChzZWUgc2FuaXRpemVDZmcpLlxuICAgIC8vIFxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgYyAob2JqZWN0KSBBIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHRoYXQgc3BlY2lmaWVzIHNvbWUvYWxsIGNvbmZpZyB2YWx1ZXMuXG4gICAgLy8gICAgICAgICBUaGUgcG9zc2libGUgY29uZmlnIGl0ZW1zOlxuICAgIC8vICAgICAgICAgICAgZ2Vub21lcyAgIChsaXN0IG8gc3RyaW5ncykgQWxsIHRoZSBnZW5vbWVzIHlvdSB3YW50IHRvIHNlZSwgaW4gdG9wLXRvLWJvdHRvbSBvcmRlci4gXG4gICAgLy8gICAgICAgICAgICAgICBNYXkgdXNlIGludGVybmFsIG5hbWVzIG9yIGRpc3BsYXkgbGFiZWxzLCBlZywgXCJtdXNfbXVzY3VsdXNfMTI5czFzdmltalwiIG9yIFwiMTI5UzEvU3ZJbUpcIi5cbiAgICAvLyAgICAgICAgICAgIHJlZiAgICAgICAoc3RyaW5nKSBUaGUgZ2Vub21lIHRvIHVzZSBhcyB0aGUgcmVmZXJlbmNlLiBNYXkgYmUgbmFtZSBvciBsYWJlbC5cbiAgICAvLyAgICAgICAgICAgIGhpZ2hsaWdodCAobGlzdCBvIHN0cmluZ3MpIElEcyBvZiBmZWF0dXJlcyB0byBoaWdobGlnaHRcbiAgICAvLyAgICAgICAgICAgIGRtb2RlICAgICAoc3RyaW5nKSBlaXRoZXIgJ2NvbXBhcmlzb24nIG9yICdyZWZlcmVuY2UnXG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIENvb3JkaW5hdGVzIGFyZSBzcGVjaWZpZWQgaW4gb25lIG9mIDIgZm9ybXMuXG4gICAgLy8gICAgICAgICAgICAgIGNociAgICAgICAoc3RyaW5nKSBDaHJvbW9zb21lIGZvciBjb29yZGluYXRlIHJhbmdlXG4gICAgLy8gICAgICAgICAgICAgIHN0YXJ0ICAgICAoaW50KSBDb29yZGluYXRlIHJhbmdlIHN0YXJ0IHBvc2l0aW9uXG4gICAgLy8gICAgICAgICAgICAgIGVuZCAgICAgICAoaW50KSBDb29yZGluYXRlIHJhbmdlIGVuZCBwb3NpdGlvblxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAgIERpc3BsYXlzIHRoaXMgY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBnZW5lb21zLCBhbmQgdGhlIGVxdWl2YWxlbnQgKG1hcHBlZClcbiAgICAvLyAgICAgICAgICAgICAgY29vcmRpbmF0ZSByYW5nZShzKSBpbiBlYWNoIGNvbXBhcmlzb24gZ2Vub21lLlxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICBvcjpcbiAgICAvLyAgICAgICAgICAgICAgbGFuZG1hcmsgIChzdHJpbmcpIElELCBjYW5vbmljYWwgSUQsIG9yIHN5bWJvbCwgaWRlbnRpZnlpbmcgYSBmZWF0dXJlLlxuICAgIC8vICAgICAgICAgICAgICBmbGFua3xsZW5ndGggKGludCkgSWYgZmxhbmssIHZpZXdpbmcgcmVnaW9uIHNpemUgPSBmbGFuayArIGxlbihsYW5kbWFyaykgKyBmbGFuay4gXG4gICAgLy8gICAgICAgICAgICAgICAgIElmIGxlbmd0aCwgdmlld2luZyByZWdpb24gc2l6ZSA9IGxlbmd0aC4gSW4gZWl0aGVyIGNhc2UsIHRoZSBsYW5kbWFyayBpcyBjZW50ZXJlZCBpblxuICAgIC8vICAgICAgICAgICAgICAgICB0aGUgdmlld2luZyBhcmVhLCArLy0gYW55IHNwZWNpZmllZCBkZWx0YS5cbiAgICAvLyAgICAgICAgICAgICAgZGVsdGEgICAgIChpbnQpIEFtb3VudCBpbiBicCB0byBzaGlmdCB0aGUgcmVnaW9uIGxlZnQgKDwwKSBvciByaWdodCAoPjApLlxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAgIERpc3BsYXlzIHRoZSByZWdpb24gYXJvdW5kIHRoZSBzcGVjaWZpZWQgbGFuZG1hcmsgaW4gZWFjaCBnZW5vbWUgd2hlcmUgaXQgZXhpc3RzLlxuICAgIC8vXG4gICAgLy8gICAgcXVpZXRseSAoYm9vbGVhbikgSWYgdHJ1ZSwgZG9uJ3QgdXBkYXRlIGJyb3dzZXIgaGlzdG9yeSAoYXMgd2hlbiBnb2luZyBiYWNrKVxuICAgIC8vXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgICBOb3RoaW5nXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vXHQgIFJlZHJhd3MgXG4gICAgLy9cdCAgQ2FsbHMgY29udGV4dENoYW5nZWQoKSBcbiAgICAvL1xuICAgIHNldENvbnRleHQgKGMsIHF1aWV0bHkpIHtcbiAgICAgICAgbGV0IGNmZyA9IHRoaXMuc2FuaXRpemVDZmcoYyk7XG5cdC8vY29uc29sZS5sb2coXCJTZXQgY29udGV4dCAocmF3KTpcIiwgYyk7XG5cdC8vY29uc29sZS5sb2coXCJTZXQgY29udGV4dCAoc2FuaXRpemVkKTpcIiwgY2ZnKTtcblx0aWYgKCFjZmcpIHJldHVybjtcblx0dGhpcy5zaG93QnVzeSh0cnVlLCAnUmVxdWVzdGluZyBkYXRhLi4uJyk7XG5cdGxldCBwID0gdGhpcy5mZWF0dXJlTWFuYWdlci5sb2FkR2Vub21lcyhjZmcuZ2Vub21lcykudGhlbigoKSA9PiB7XG5cdCAgICBpZiAoY2ZnLmNtb2RlID09PSAnbGFuZG1hcmsnKSB7XG5cdCAgICAgICAgY2ZnID0gdGhpcy5yZXNvbHZlTGFuZG1hcmsoY2ZnKTtcblx0XHRpZiAoIWNmZykge1xuXHRcdCAgICBhbGVydChcIkxhbmRtYXJrIGRvZXMgbm90IGV4aXN0IGluIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZS4gUGxlYXNlIGNoYW5nZSB0aGUgcmVmZXJlbmNlIGdlbm9tZSBhbmQgdHJ5IGFnYWluLlwiKTtcblx0XHQgICAgdGhpcy5zaG93QnVzeShmYWxzZSk7XG5cdFx0ICAgIHJldHVybjtcblx0XHR9XG5cdCAgICB9XG5cdCAgICB0aGlzLnZHZW5vbWVzID0gY2ZnLmdlbm9tZXM7XG5cdCAgICB0aGlzLnJHZW5vbWUgID0gY2ZnLnJlZjtcblx0ICAgIHRoaXMuY0dlbm9tZXMgPSBjZmcuZ2Vub21lcy5maWx0ZXIoZyA9PiBnICE9PSBjZmcucmVmKTtcblx0ICAgIHRoaXMuc2V0UmVmR2Vub21lU2VsZWN0aW9uKHRoaXMuckdlbm9tZS5uYW1lKTtcblx0ICAgIHRoaXMuc2V0Q29tcEdlbm9tZXNTZWxlY3Rpb24odGhpcy52R2Vub21lcy5tYXAoZz0+Zy5uYW1lKSk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5jbW9kZSA9IGNmZy5jbW9kZTtcblx0ICAgIC8vXG5cdCAgICByZXR1cm4gdGhpcy50cmFuc2xhdG9yLnJlYWR5KCk7XG5cdH0pLnRoZW4oKCkgPT4ge1xuXHQgICAgLy9cblx0ICAgIGlmICghY2ZnKSByZXR1cm47XG5cdCAgICB0aGlzLmNvb3JkcyAgID0ge1xuXHRcdGNocjogY2ZnLmNoci5uYW1lLFxuXHRcdGNocm9tb3NvbWU6IGNmZy5jaHIsXG5cdFx0c3RhcnQ6IGNmZy5zdGFydCxcblx0XHRlbmQ6IGNmZy5lbmRcblx0ICAgIH07XG5cdCAgICB0aGlzLmxjb29yZHMgID0ge1xuXHQgICAgICAgIGxhbmRtYXJrOiBjZmcubGFuZG1hcmssIFxuXHRcdGxhbmRtYXJrUmVmRmVhdDogY2ZnLmxhbmRtYXJrUmVmRmVhdCxcblx0XHRsYW5kbWFya0ZlYXRzOiBjZmcubGFuZG1hcmtGZWF0cyxcblx0XHRmbGFuazogY2ZnLmZsYW5rLCBcblx0XHRsZW5ndGg6IGNmZy5sZW5ndGgsIFxuXHRcdGRlbHRhOiBjZmcuZGVsdGEgXG5cdCAgICB9O1xuXHQgICAgLy9cblx0ICAgIHRoaXMuem9vbVZpZXcudXBkYXRlKGNmZyk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LnJlZHJhdygpO1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LnNldEJydXNoQ29vcmRzKHRoaXMuY29vcmRzKTtcblx0ICAgIC8vXG5cdCAgICBpZiAoIXF1aWV0bHkpXG5cdCAgICAgICAgdGhpcy5jb250ZXh0Q2hhbmdlZCgpO1xuXHQgICAgLy9cblx0ICAgIHRoaXMuc2hvd0J1c3koZmFsc2UpO1xuXHR9KTtcblx0cmV0dXJuIHA7XG4gICAgfVxuIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldENvb3JkaW5hdGVzIChzdHIpIHtcblx0bGV0IGNvb3JkcyA9IHBhcnNlQ29vcmRzKHN0cik7XG5cdGlmICghIGNvb3Jkcykge1xuXHQgICAgbGV0IGZlYXRzID0gdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5TGFiZWwoc3RyKTtcblx0ICAgIGxldCBmZWF0czIgPSBmZWF0cy5maWx0ZXIoZj0+Zi5nZW5vbWUgPT0gdGhpcy5yR2Vub21lKTtcblx0ICAgIGxldCBmID0gZmVhdHMyWzBdIHx8IGZlYXRzWzBdO1xuXHQgICAgaWYgKGYpIHtcblx0XHRjb29yZHMgPSB7XG5cdFx0ICAgIHJlZjogZi5nZW5vbWUubmFtZSxcblx0XHQgICAgbGFuZG1hcms6IHN0cixcblx0XHQgICAgZGVsdGE6IDAsXG5cdFx0ICAgIGhpZ2hsaWdodDogZi5pZFxuXHRcdH1cblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHRcdGFsZXJ0KFwiVW5hYmxlIHRvIHNldCBjb29yZGluYXRlcyB3aXRoIHRoaXMgdmFsdWU6IFwiICsgc3RyKTtcblx0XHRyZXR1cm47XG5cdCAgICB9XG5cdH1cblx0dGhpcy5zZXRDb250ZXh0KGNvb3Jkcyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVzaXplICgpIHtcblx0bGV0IHcgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDI0O1xuXHR0aGlzLmdlbm9tZVZpZXcuZml0VG9XaWR0aCh3KTtcblx0dGhpcy56b29tVmlldy5maXRUb1dpZHRoKHcpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGNvbnRleHQgYXMgYSBwYXJhbWV0ZXIgc3RyaW5nXG4gICAgLy8gQ3VycmVudCBjb250ZXh0ID0gcmVmIGdlbm9tZSArIGNvbXAgZ2Vub21lcyArIGN1cnJlbnQgcmFuZ2UgKGNocixzdGFydCxlbmQpXG4gICAgZ2V0UGFyYW1TdHJpbmcgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuICAgICAgICBsZXQgcmVmID0gYHJlZj0ke2MucmVmfWA7XG4gICAgICAgIGxldCBnZW5vbWVzID0gYGdlbm9tZXM9JHtjLmdlbm9tZXMuam9pbihcIitcIil9YDtcblx0bGV0IGNvb3JkcyA9IGBjaHI9JHtjLmNocn0mc3RhcnQ9JHtjLnN0YXJ0fSZlbmQ9JHtjLmVuZH1gO1xuXHRsZXQgbGZsZiA9IGMuZmxhbmsgPyAnJmZsYW5rPScrYy5mbGFuayA6ICcmbGVuZ3RoPScrYy5sZW5ndGg7XG5cdGxldCBsY29vcmRzID0gYGxhbmRtYXJrPSR7Yy5sYW5kbWFya30mZGVsdGE9JHtjLmRlbHRhfSR7bGZsZn1gO1xuXHRsZXQgaGxzID0gYGhpZ2hsaWdodD0ke2MuaGlnaGxpZ2h0LmpvaW4oXCIrXCIpfWA7XG5cdGxldCBkbW9kZSA9IGBkbW9kZT0ke2MuZG1vZGV9YDtcblx0cmV0dXJuIGAke3RoaXMuY21vZGU9PT0nbWFwcGVkJz9jb29yZHM6bGNvb3Jkc30mJHtkbW9kZX0mJHtyZWZ9JiR7Z2Vub21lc30mJHtobHN9YDtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRDdXJyZW50TGlzdCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJMaXN0O1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRDdXJyZW50TGlzdCAobHN0LCBnb1RvRmlyc3QpIHtcbiAgICBcdC8vXG5cdGxldCBwcmV2TGlzdCA9IHRoaXMuY3Vyckxpc3Q7XG5cdHRoaXMuY3Vyckxpc3QgPSBsc3Q7XG5cdGlmIChsc3QgIT09IHByZXZMaXN0KSB7XG5cdCAgICB0aGlzLmN1cnJMaXN0SW5kZXggPSBsc3QgPyBsc3QuaWRzLnJlZHVjZSggKHgsaSkgPT4geyB4W2ldPWk7IHJldHVybiB4OyB9LCB7fSkgOiB7fTtcblx0ICAgIHRoaXMuY3Vyckxpc3RDb3VudGVyID0gMDtcblx0fVxuXHQvL1xuXHRsZXQgbGlzdHMgPSBkMy5zZWxlY3QoJyNteWxpc3RzJykuc2VsZWN0QWxsKCcubGlzdEluZm8nKTtcblx0bGlzdHMuY2xhc3NlZChcImN1cnJlbnRcIiwgZCA9PiBkID09PSBsc3QpO1xuXHQvL1xuXHQvLyBzaG93IHRoaXMgbGlzdCBhcyB0aWNrIG1hcmtzIGluIHRoZSBnZW5vbWUgdmlld1xuXHR0aGlzLmdlbm9tZVZpZXcuZHJhd1RpY2tzKGxzdCA/IGxzdC5pZHMgOiBbXSk7XG5cdHRoaXMuZ2Vub21lVmlldy5kcmF3VGl0bGUoKTtcblx0dGhpcy56b29tVmlldy5oaWdobGlnaHQoKTtcblx0Ly9cblx0aWYgKGdvVG9GaXJzdCkgdGhpcy5nb1RvTmV4dExpc3RFbGVtZW50KCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdvVG9OZXh0TGlzdEVsZW1lbnQgKCkge1xuXHRpZiAoIXRoaXMuY3Vyckxpc3QgfHwgdGhpcy5jdXJyTGlzdC5pZHMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cdGxldCBjdXJySWQgPSB0aGlzLmN1cnJMaXN0Lmlkc1t0aGlzLmN1cnJMaXN0Q291bnRlcl07XG4gICAgICAgIHRoaXMuY3Vyckxpc3RDb3VudGVyID0gKHRoaXMuY3Vyckxpc3RDb3VudGVyICsgMSkgJSB0aGlzLmN1cnJMaXN0Lmlkcy5sZW5ndGg7XG5cdHRoaXMuc2V0Q29vcmRpbmF0ZXMoY3VycklkKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcGFuem9vbShwZmFjdG9yLCB6ZmFjdG9yKSB7XG5cdC8vXG5cdCFwZmFjdG9yICYmIChwZmFjdG9yID0gMCk7XG5cdCF6ZmFjdG9yICYmICh6ZmFjdG9yID0gMSk7XG5cdC8vXG5cdGxldCBjID0gdGhpcy5jb29yZHM7XG5cdGxldCB3aWR0aCA9IGMuZW5kIC0gYy5zdGFydCArIDE7XG5cdGxldCBtaWQgPSAoYy5zdGFydCArIGMuZW5kKS8yO1xuXHRsZXQgY2hyID0gdGhpcy5yR2Vub21lLmNocm9tb3NvbWVzLmZpbHRlcihjID0+IGMubmFtZSA9PT0gdGhpcy5jb29yZHMuY2hyKVswXTtcblx0bGV0IG5jeHQgPSB7fTsgLy8gbmV3IGNvbnRleHRcblx0bGV0IG1pbkQgPSAtKGMuc3RhcnQtMSk7IC8vIG1pbiBkZWx0YSAoYXQgY3VycmVudCB6b29tKVxuXHRsZXQgbWF4RCA9IGNoci5sZW5ndGggLSBjLmVuZDsgLy8gbWF4IGRlbHRhIChhdCBjdXJyZW50IHpvb20pXG5cdGxldCBkID0gY2xpcChwZmFjdG9yICogd2lkdGgsIG1pbkQsIG1heEQpOyAvLyBkZWx0YSAoYXQgbmV3IHpvb20pXG5cdGxldCBuZXd3aWR0aCA9IHpmYWN0b3IgKiB3aWR0aDtcblx0bGV0IG5ld3N0YXJ0ID0gbWlkIC0gbmV3d2lkdGgvMiArIGQ7XG5cdC8vXG5cdGlmICh0aGlzLmNtb2RlID09PSAnbWFwcGVkJykge1xuXHQgICAgbmN4dC5jaHIgPSBjLmNocjtcblx0ICAgIG5jeHQuc3RhcnQgPSBuZXdzdGFydDtcblx0ICAgIG5jeHQuZW5kID0gbmV3c3RhcnQgKyBuZXd3aWR0aCAtIDE7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICBuY3h0Lmxlbmd0aCA9IG5ld3dpZHRoO1xuXHQgICAgbmN4dC5kZWx0YSA9IHRoaXMubGNvb3Jkcy5kZWx0YSArIGQgO1xuXHR9XG5cdHRoaXMuc2V0Q29udGV4dChuY3h0KTtcbiAgICB9XG4gICAgem9vbSAoZmFjdG9yKSB7XG4gICAgICAgIHRoaXMucGFuem9vbShudWxsLCBmYWN0b3IpO1xuICAgIH1cbiAgICBwYW4gKGZhY3Rvcikge1xuICAgICAgICB0aGlzLnBhbnpvb20oZmFjdG9yLCBudWxsKTtcbiAgICB9XHRcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBab29tcyBpbi9vdXQgYnkgZmFjdG9yLiBOZXcgem9vbSB3aWR0aCBpcyBmYWN0b3IgKiB0aGUgY3VycmVudCB3aWR0aC5cbiAgICAvLyBGYWN0b3IgPiAxIHpvb21zIG91dCwgMCA8IGZhY3RvciA8IDEgem9vbXMgaW4uXG4gICAgeHpvb20gKGZhY3Rvcikge1xuXHRsZXQgbGVuID0gdGhpcy5jb29yZHMuZW5kIC0gdGhpcy5jb29yZHMuc3RhcnQgKyAxO1xuXHRsZXQgbmV3bGVuID0gTWF0aC5yb3VuZChmYWN0b3IgKiBsZW4pO1xuXHRsZXQgeCA9ICh0aGlzLmNvb3Jkcy5zdGFydCArIHRoaXMuY29vcmRzLmVuZCkvMjtcblx0aWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKSB7XG5cdCAgICBsZXQgbmV3c3RhcnQgPSBNYXRoLnJvdW5kKHggLSBuZXdsZW4vMik7XG5cdCAgICB0aGlzLnNldENvbnRleHQoeyBjaHI6IHRoaXMuY29vcmRzLmNociwgc3RhcnQ6IG5ld3N0YXJ0LCBlbmQ6IG5ld3N0YXJ0ICsgbmV3bGVuIC0gMSB9KTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuc2V0Q29udGV4dCh7IGxlbmd0aDogbmV3bGVuIH0pO1xuXHR9XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUGFucyB0aGUgdmlldyBsZWZ0IG9yIHJpZ2h0IGJ5IGZhY3Rvci4gVGhlIGRpc3RhbmNlIG1vdmVkIGlzIGZhY3RvciB0aW1lcyB0aGUgY3VycmVudCB6b29tIHdpZHRoLlxuICAgIC8vIE5lZ2F0aXZlIHZhbHVlcyBwYW4gbGVmdC4gUG9zaXRpdmUgdmFsdWVzIHBhbiByaWdodC4gKE5vdGUgdGhhdCBwYW5uaW5nIG1vdmVzIHRoZSBcImNhbWVyYVwiLiBQYW5uaW5nIHRvIHRoZVxuICAgIC8vIHJpZ2h0IG1ha2VzIHRoZSBvYmplY3RzIGluIHRoZSBzY2VuZSBhcHBlYXIgdG8gbW92ZSB0byB0aGUgbGVmdCwgYW5kIHZpY2UgdmVyc2EuKVxuICAgIC8vXG4gICAgeHBhbiAoZmFjdG9yKSB7XG5cdGxldCBjID0gdGhpcy5jb29yZHM7XG5cdGxldCBjaHIgPSB0aGlzLnJHZW5vbWUuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSB0aGlzLmNvb3Jkcy5jaHIpWzBdO1xuXHRsZXQgd2lkdGggPSBjLmVuZCAtIGMuc3RhcnQgKyAxO1xuXHRsZXQgbWluRCA9IC0oYy5zdGFydC0xKTtcblx0bGV0IG1heEQgPSBjaHIubGVuZ3RoIC0gYy5lbmQ7XG5cdGxldCBkID0gY2xpcChmYWN0b3IgKiB3aWR0aCwgbWluRCwgbWF4RCk7XG5cdGlmICh0aGlzLmNtb2RlID09PSAnbWFwcGVkJykge1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgY2hyOiBjLmNociwgc3RhcnQ6IGMuc3RhcnQrZCwgZW5kOiBjLmVuZCtkIH0pO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgZGVsdGE6IHRoaXMubGNvb3Jkcy5kZWx0YSArIGQgfSk7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RmVhdFR5cGVDb250cm9sIChmYWNldCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCBjb2xvcnMgPSB0aGlzLmNzY2FsZS5kb21haW4oKS5tYXAobGJsID0+IHtcblx0ICAgIHJldHVybiB7IGxibDpsYmwsIGNscjp0aGlzLmNzY2FsZShsYmwpIH07XG5cdH0pO1xuXHRsZXQgY2tlcyA9IGQzLnNlbGVjdChcIi5jb2xvcktleVwiKVxuXHQgICAgLnNlbGVjdEFsbCgnLmNvbG9yS2V5RW50cnknKVxuXHRcdC5kYXRhKGNvbG9ycyk7XG5cdGxldCBuY3MgPSBja2VzLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsIFwiY29sb3JLZXlFbnRyeSBmbGV4cm93XCIpO1xuXHRuY3MuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJzd2F0Y2hcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBjID0+IGMubGJsKVxuXHQgICAgLnN0eWxlKFwiYmFja2dyb3VuZC1jb2xvclwiLCBjID0+IGMuY2xyKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdGxldCB0ID0gZDMuc2VsZWN0KHRoaXMpO1xuXHQgICAgICAgIHQuY2xhc3NlZChcImNoZWNrZWRcIiwgISB0LmNsYXNzZWQoXCJjaGVja2VkXCIpKTtcblx0XHRsZXQgc3dhdGNoZXMgPSBkMy5zZWxlY3RBbGwoXCIuc3dhdGNoLmNoZWNrZWRcIilbMF07XG5cdFx0bGV0IGZ0cyA9IHN3YXRjaGVzLm1hcChzPT5zLmdldEF0dHJpYnV0ZShcIm5hbWVcIikpXG5cdFx0ZmFjZXQuc2V0VmFsdWVzKGZ0cyk7XG5cdFx0c2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0ICAgIH0pXG5cdCAgICAuYXBwZW5kKFwiaVwiKVxuXHQgICAgICAgIC5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zXCIpO1xuXHRuY3MuYXBwZW5kKFwic3BhblwiKVxuXHQgICAgLnRleHQoYyA9PiBjLmxibCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQ2FjaGVkRGF0YSAoYXNrKSB7XG5cdGlmICghYXNrIHx8IHdpbmRvdy5jb25maXJtKCdEZWxldGUgYWxsIGNhY2hlZCBkYXRhLiBBcmUgeW91IHN1cmU/JykpIHtcblx0ICAgIHRoaXMuZmVhdHVyZU1hbmFnZXIuY2xlYXJDYWNoZWREYXRhKCk7XG5cdCAgICB0aGlzLnRyYW5zbGF0b3IuY2xlYXJDYWNoZWREYXRhKCk7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsaW5rVG9NZ2lTbnBSZXBvcnQgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRsZXQgdXJsQmFzZSA9ICdodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvc25wL3N1bW1hcnknO1xuXHRsZXQgdGFiQXJnID0gJ3NlbGVjdGVkVGFiPTEnO1xuXHRsZXQgc2VhcmNoQnlBcmcgPSAnc2VhcmNoQnlTYW1lRGlmZj0nO1xuXHRsZXQgY2hyQXJnID0gYHNlbGVjdGVkQ2hyb21vc29tZT0ke2MuY2hyfWA7XG5cdGxldCBjb29yZEFyZyA9IGBjb29yZGluYXRlPSR7Yy5zdGFydH0tJHtjLmVuZH1gO1xuXHRsZXQgdW5pdEFyZyA9ICdjb29yZGluYXRlVW5pdD1icCc7XG5cdGxldCBjc0FyZ3MgPSBjLmdlbm9tZXMubWFwKGcgPT4gYHNlbGVjdGVkU3RyYWlucz0ke2d9YClcblx0bGV0IHJzQXJnID0gYHJlZmVyZW5jZVN0cmFpbj0ke2MucmVmfWA7XG5cdGxldCBsaW5rVXJsID0gYCR7dXJsQmFzZX0/JHt0YWJBcmd9JiR7c2VhcmNoQnlBcmd9JiR7Y2hyQXJnfSYke2Nvb3JkQXJnfSYke3VuaXRBcmd9JiR7cnNBcmd9JiR7Y3NBcmdzLmpvaW4oJyYnKX1gXG5cdHdpbmRvdy5vcGVuKGxpbmtVcmwsIFwiX2JsYW5rXCIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsaW5rVG9NZ2lRVExzICgpIHtcblx0bGV0IGMgICAgICAgID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdGxldCB1cmxCYXNlICA9ICdodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvYWxsZWxlL3N1bW1hcnknO1xuXHRsZXQgY2hyQXJnICAgPSBgY2hyb21vc29tZT0ke2MuY2hyfWA7XG5cdGxldCBjb29yZEFyZyA9IGBjb29yZGluYXRlPSR7Yy5zdGFydH0tJHtjLmVuZH1gO1xuXHRsZXQgdW5pdEFyZyAgPSAnY29vcmRVbml0PWJwJztcblx0bGV0IHR5cGVBcmcgID0gJ2FsbGVsZVR5cGU9UVRMJztcblx0bGV0IGxpbmtVcmwgID0gYCR7dXJsQmFzZX0/JHtjaHJBcmd9JiR7Y29vcmRBcmd9JiR7dW5pdEFyZ30mJHt0eXBlQXJnfWA7XG5cdHdpbmRvdy5vcGVuKGxpbmtVcmwsIFwiX2JsYW5rXCIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsaW5rVG9NZ2lKQnJvd3NlICgpIHtcblx0bGV0IGMgPSB0aGlzLmdldENvbnRleHQoKTtcblx0bGV0IHVybEJhc2UgPSAnaHR0cDovL2picm93c2UuaW5mb3JtYXRpY3MuamF4Lm9yZy8nO1xuXHRsZXQgZGF0YUFyZyA9ICdkYXRhPWRhdGElMkZtb3VzZSc7IC8vIFwiZGF0YS9tb3VzZVwiXG5cdGxldCBsb2NBcmcgID0gYGxvYz1jaHIke2MuY2hyfSUzQSR7Yy5zdGFydH0uLiR7Yy5lbmR9YDtcblx0bGV0IHRyYWNrcyAgPSBbJ0ROQScsJ01HSV9HZW5vbWVfRmVhdHVyZXMnLCdOQ0JJX0NDRFMnLCdOQ0JJJywnRU5TRU1CTCddO1xuXHRsZXQgdHJhY2tzQXJnPWB0cmFja3M9JHt0cmFja3Muam9pbignLCcpfWA7XG5cdGxldCBoaWdobGlnaHRBcmcgPSAnaGlnaGxpZ2h0PSc7XG5cdGxldCBsaW5rVXJsID0gYCR7dXJsQmFzZX0/JHsgW2RhdGFBcmcsbG9jQXJnLHRyYWNrc0FyZyxoaWdobGlnaHRBcmddLmpvaW4oJyYnKSB9YDtcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERvd25sb2FkcyBETkEgc2VxdWVuY2VzIG9mIHRoZSBzcGVjaWZpZWQgdHlwZSBpbiBGQVNUQSBmb3JtYXQgZm9yIHRoZSBzcGVjaWZpZWQgZmVhdHVyZS5cbiAgICAvLyBJZiBnZW5vbWVzIGlzIHNwZWNpZmllZCwgbGlzdHMgdGhlIHNwZWNpZmljIGdlbm9tZXMgdG8gcmV0cmlldmUgZnJvbTsgb3RoZXJ3aXNlIHJldHJpZXZlcyBmcm9tIGFsbCBnZW5vbWVzLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIGYgKG9iamVjdCkgdGhlIGZlYXR1cmVcbiAgICAvLyAgICAgdHlwZSAoc3RyaW5nKSB3aGljaCBzZXF1ZW5jZXMgdG8gZG93bmxvYWQ6ICdnZW5vbWljJywnZXhvbicsJ0NEUycsXG4gICAgLy8gICAgIGdlbm9tZXMgKGxpc3Qgb2Ygc3RyaW5ncykgbmFtZXMgb2YgZ2Vub21lcyB0byByZXRyaWV2ZSBmcm9tLiBJZiBub3Qgc3BlY2lmaWVkLFxuICAgIC8vICAgICAgICAgcmV0cmlldmVzIHNlcXVlbmVjcyBmcm9tIGFsbCBhdmFpbGFibGUgbW91c2UgZ2Vub21lcy5cbiAgICAvL1xuICAgIGRvd25sb2FkRmFzdGEgKGYsIHR5cGUsIGdlbm9tZXMpIHtcblx0bGV0IHEgPSB0aGlzLnF1ZXJ5TWFuYWdlci5hdXhEYXRhTWFuYWdlci5zZXF1ZW5jZXNGb3JGZWF0dXJlKGYsIHR5cGUsIGdlbm9tZXMpXG5cdGlmIChxKSB3aW5kb3cub3BlbihxLFwiX2JsYW5rXCIpO1xuICAgIH1cbiAgICBsaW5rVG9SZXBvcnRQYWdlIChmKSB7XG4gICAgICAgIGxldCB1ID0gdGhpcy5xdWVyeU1hbmFnZXIuYXV4RGF0YU1hbmFnZXIubGlua1RvUmVwb3J0UGFnZShmLmlkKTtcblx0d2luZG93Lm9wZW4odSwgJ19ibGFuaycpXG4gICAgfVxufSAvLyBlbmQgY2xhc3MgTUdWQXBwXG5cbmV4cG9ydCB7IE1HVkFwcCB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTUdWQXBwLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIEdlbm9tZSB7XG4gIGNvbnN0cnVjdG9yIChjZmcpIHtcbiAgICB0aGlzLm5hbWUgPSBjZmcubmFtZTtcbiAgICB0aGlzLmxhYmVsPSBjZmcubGFiZWw7XG4gICAgdGhpcy5jaHJvbW9zb21lcyA9IFtdO1xuICAgIHRoaXMubWF4bGVuID0gLTE7XG4gICAgdGhpcy54c2NhbGUgPSBudWxsO1xuICAgIHRoaXMueXNjYWxlID0gbnVsbDtcbiAgICB0aGlzLnpvb21ZICA9IC0xO1xuICB9XG4gIGdldENocm9tb3NvbWUgKG4pIHtcbiAgICAgIGlmICh0eXBlb2YobikgPT09ICdzdHJpbmcnKVxuXHQgIHJldHVybiB0aGlzLmNocm9tb3NvbWVzLmZpbHRlcihjID0+IGMubmFtZSA9PT0gbilbMF07XG4gICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2hyb21vc29tZXNbbl07XG4gIH1cbiAgaGFzQ2hyb21vc29tZSAobikge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2hyb21vc29tZShuKSA/IHRydWUgOiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgeyBHZW5vbWUgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0dlbm9tZS5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge2QzanNvbiwgZDN0c3YsIG92ZXJsYXBzLCBzdWJ0cmFjdH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge0ZlYXR1cmV9IGZyb20gJy4vRmVhdHVyZSc7XG5pbXBvcnQge0tleVN0b3JlfSBmcm9tICcuL0tleVN0b3JlJztcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBIb3cgdGhlIGFwcCBsb2FkcyBmZWF0dXJlIGRhdGEuIFByb3ZpZGVzIHR3byBjYWxsczpcbi8vIFJlcXVlc3RzIGZlYXR1cmVzIGZyb20gdGhlIHNlcnZlciBhbmQgcmVnaXN0ZXJzIHRoZW0gaW4gYSBjYWNoZS5cbi8vIEludGVyYWN0cyB3aXRoIHRoZSBiYWNrIGVuZCB0byBsb2FkIGZlYXR1cmVzLlxuLy9cbmNsYXNzIEZlYXR1cmVNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuXHR0aGlzLmF1eERhdGFNYW5hZ2VyID0gdGhpcy5hcHAucXVlcnlNYW5hZ2VyLmF1eERhdGFNYW5hZ2VyO1xuICAgICAgICB0aGlzLmlkMmZlYXQgPSB7fTtcdFx0Ly8gaW5kZXggZnJvbSAgZmVhdHVyZSBJRCB0byBmZWF0dXJlXG5cdHRoaXMuY2Fub25pY2FsMmZlYXRzID0ge307XHQvLyBpbmRleCBmcm9tIGNhbm9uaWNhbCBJRCAtPiBbIGZlYXR1cmVzIHRhZ2dlZCB3aXRoIHRoYXQgaWQgXVxuXHR0aGlzLnN5bWJvbDJmZWF0cyA9IHt9XHRcdC8vIGluZGV4IGZyb20gc3ltYm9sIC0+IFsgZmVhdHVyZXMgaGF2aW5nIHRoYXQgc3ltYm9sIF1cblx0XHRcdFx0XHQvLyB3YW50IGNhc2UgaW5zZW5zaXRpdmUgc2VhcmNoZXMsIHNvIGtleXMgYXJlIGxvd2VyIGNhc2VkXG5cdHRoaXMuY2FjaGUgPSB7fTtcdFx0Ly8ge2dlbm9tZS5uYW1lIC0+IHtjaHIubmFtZSAtPiBsaXN0IG9mIGJsb2Nrc319XG5cdHRoaXMubWluZUZlYXR1cmVDYWNoZSA9IHt9O1x0Ly8gYXV4aWxpYXJ5IGluZm8gcHVsbGVkIGZyb20gTW91c2VNaW5lIFxuXHR0aGlzLmxvYWRlZEdlbm9tZXMgPSBuZXcgU2V0KCk7IC8vIHRoZSBzZXQgb2YgR2Vub21lcyB0aGF0IGhhdmUgYmVlbiBmdWxseSBsb2FkZWRcblx0Ly9cblx0dGhpcy5mU3RvcmUgPSBuZXcgS2V5U3RvcmUoJ2ZlYXR1cmVzJyk7IC8vIG1hcHMgZ2Vub21lIG5hbWUgLT4gbGlzdCBvZiBmZWF0dXJlc1xuICAgIH1cbiBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBwcm9jZXNzRmVhdHVyZSAoZ2Vub21lLCBkKSB7XG5cdC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IHRoaXMgb25lIGluIHRoZSBjYWNoZSwgcmV0dXJuIGl0LlxuXHRsZXQgZiA9IHRoaXMuaWQyZmVhdFtkLklEXTtcblx0aWYgKGYpIHJldHVybiBmO1xuXHQvLyBDcmVhdGUgYSBuZXcgRmVhdHVyZVxuXHRmID0gbmV3IEZlYXR1cmUoZCk7XG5cdGYuZ2Vub21lID0gZ2Vub21lXG5cdC8vIFJlZ2lzdGVyIGl0LlxuXHR0aGlzLmlkMmZlYXRbZi5JRF0gPSBmO1xuXHQvLyBnZW5vbWUgY2FjaGVcblx0bGV0IGdjID0gdGhpcy5jYWNoZVtnZW5vbWUubmFtZV0gPSAodGhpcy5jYWNoZVtnZW5vbWUubmFtZV0gfHwge30pO1xuXHQvLyBjaHJvbW9zb21lIGNhY2hlICh3L2luIGdlbm9tZSlcblx0bGV0IGNjID0gZ2NbZi5jaHJdID0gKGdjW2YuY2hyXSB8fCBbXSk7XG5cdGNjLnB1c2goZik7XG5cdC8vXG5cdGlmIChmLmNhbm9uaWNhbCAmJiBmLmNhbm9uaWNhbCAhPT0gJy4nKSB7XG5cdCAgICBsZXQgbHN0ID0gdGhpcy5jYW5vbmljYWwyZmVhdHNbZi5jYW5vbmljYWxdID0gKHRoaXMuY2Fub25pY2FsMmZlYXRzW2YuY2Fub25pY2FsXSB8fCBbXSk7XG5cdCAgICBsc3QucHVzaChmKTtcblx0fVxuXHRpZiAoZi5zeW1ib2wgJiYgZi5zeW1ib2wgIT09ICcuJykge1xuXHQgICAgbGV0IHMgPSBmLnN5bWJvbC50b0xvd2VyQ2FzZSgpO1xuXHQgICAgbGV0IGxzdCA9IHRoaXMuc3ltYm9sMmZlYXRzW3NdID0gKHRoaXMuc3ltYm9sMmZlYXRzW3NdIHx8IFtdKTtcblx0ICAgIGxzdC5wdXNoKGYpO1xuXHR9XG5cdC8vIGhlcmUgeSdnby5cblx0cmV0dXJuIGY7XG4gICAgfVxuICAgIC8vXG4gICAgcHJvY2Vzc0V4b24gKGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcm9jZXNzIGV4b246IFwiLCBlKTtcblx0bGV0IGZlYXQgPSB0aGlzLmlkMmZlYXRbZS5nZW5lLnByaW1hcnlJZGVudGlmaWVyXTtcblx0aWYgKGZlYXQuZXhvbnMgPT09IG51bGwpXG5cdCAgICBmZWF0LmV4b25zID0gW107XG5cdGZlYXQuZXhvbnMucHVzaCh7XG5cdCAgICBJRDogZS5wcmltYXJ5SWRlbnRpZmllcixcblx0ICAgIHRyYW5zY3JpcHRJRHM6IGUudHJhbnNjcmlwdHMubWFwKHQgPT4gdC5wcmltYXJ5SWRlbnRpZmllciksXG5cdCAgICBjaHI6IGUuY2hyb21vc29tZS5wcmltYXJ5SWRlbnRpZmllcixcblx0ICAgIHN0YXJ0OiBlLmNocm9tb3NvbWVMb2NhdGlvbi5zdGFydCxcblx0ICAgIGVuZDogICBlLmNocm9tb3NvbWVMb2NhdGlvbi5lbmQsXG5cdCAgICBmZWF0dXJlOiBmZWF0XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFByb2Nlc3NlcyB0aGUgXCJyYXdcIiBmZWF0dXJlcyByZXR1cm5lZCBieSB0aGUgc2VydmVyLlxuICAgIC8vIFR1cm5zIHRoZW0gaW50byBGZWF0dXJlIG9iamVjdHMgYW5kIHJlZ2lzdGVycyB0aGVtLlxuICAgIC8vIElmIHRoZSBzYW1lIHJhdyBmZWF0dXJlIGlzIHJlZ2lzdGVyZWQgYWdhaW4sXG4gICAgLy8gdGhlIEZlYXR1cmUgb2JqZWN0IGNyZWF0ZWQgdGhlIGZpcnN0IHRpbWUgaXMgcmV0dXJuZWQuXG4gICAgLy8gKEkuZS4sIHJlZ2lzdGVyaW5nIHRoZSBzYW1lIGZlYXR1cmUgbXVsdGlwbGUgdGltZXMgaXMgb2spXG4gICAgLy9cbiAgICBwcm9jZXNzRmVhdHVyZXMgKGdlbm9tZSwgZmVhdHMpIHtcblx0ZmVhdHMuc29ydCggKGEsYikgPT4ge1xuXHQgICAgaWYgKGEuY2hyIDwgYi5jaHIpXG5cdFx0cmV0dXJuIC0xO1xuXHQgICAgZWxzZSBpZiAoYS5jaHIgPiBiLmNocilcblx0XHRyZXR1cm4gMTtcblx0ICAgIGVsc2Vcblx0XHRyZXR1cm4gYS5zdGFydCAtIGIuc3RhcnQ7XG5cdH0pO1xuXHR0aGlzLmZTdG9yZS5zZXQoZ2Vub21lLm5hbWUsIGZlYXRzKTtcblx0cmV0dXJuIGZlYXRzLm1hcChkID0+IHRoaXMucHJvY2Vzc0ZlYXR1cmUoZ2Vub21lLCBkKSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZW5zdXJlRmVhdHVyZXNCeUdlbm9tZSAoZ2Vub21lKSB7XG5cdGlmICh0aGlzLmxvYWRlZEdlbm9tZXMuaGFzKGdlbm9tZSkpXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuXHRyZXR1cm4gdGhpcy5mU3RvcmUuZ2V0KGdlbm9tZS5uYW1lKS50aGVuKGRhdGEgPT4ge1xuXHQgICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuXHRcdGNvbnNvbGUubG9nKFwiUmVxdWVzdGluZzpcIiwgZ2Vub21lLm5hbWUsICk7XG5cdFx0bGV0IHVybCA9IGAuL2RhdGEvZ2Vub21lZGF0YS8ke2dlbm9tZS5uYW1lfS1mZWF0dXJlcy50c3ZgO1xuXHRcdHJldHVybiBkM3Rzdih1cmwpLnRoZW4oIGZlYXRzID0+IHtcblx0XHQgICAgZmVhdHMgPSB0aGlzLnByb2Nlc3NGZWF0dXJlcyhnZW5vbWUsIGZlYXRzKTtcblx0XHR9KTtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHRcdGNvbnNvbGUubG9nKFwiRm91bmQgaW4gY2FjaGU6XCIsIGdlbm9tZS5uYW1lLCApO1xuXHRcdGxldCBmZWF0cyA9IHRoaXMucHJvY2Vzc0ZlYXR1cmVzKGdlbm9tZSwgZGF0YSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdCAgICB9XG5cdH0pLnRoZW4oICgpPT4ge1xuXHQgICAgdGhpcy5sb2FkZWRHZW5vbWVzLmFkZChnZW5vbWUpOyAgXG5cdCAgICB0aGlzLmFwcC5zaG93U3RhdHVzKGBMb2FkZWQ6ICR7Z2Vub21lLm5hbWV9YCk7XG5cdCAgICByZXR1cm4gdHJ1ZTsgXG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiBhbGwgZXhvbnMgZm9yIHRoZSBnaXZlbiBzZXQgb2YgZ2VuZSBpZHMuXG4gICAgLy8gR2VuZSBJRHMgYXJlIGdlbm9tZS1zcGVjaWZpYywgTk9UIGNhbm9uaWNhbC5cbiAgICAvL1xuICAgIGVuc3VyZUV4b25zQnlHZW5lSWRzIChpZHMpIHtcblx0Ly8gTWFwIGlkcyB0byBGZWF0dXJlIG9iamVjdHMsIGZpbHRlciBmb3IgdGhvc2Ugd2hlcmUgZXhvbnMgaGF2ZSBub3QgYmVlbiByZXRyaWV2ZWQgeWV0XG5cdC8vIEV4b25zIGFjY3VtdWxhdGUgaW4gdGhlaXIgZmVhdHVyZXMgLSBubyBjYWNoZSBldmljdGlvbiBpbXBsZW1lbnRlZCB5ZXQuIEZJWE1FLlxuXHQvLyBcblx0bGV0IGZlYXRzID0gKGlkc3x8W10pLm1hcChpID0+IHRoaXMuaWQyZmVhdFtpXSkuZmlsdGVyKGYgPT4ge1xuXHQgICAgaWYgKCEgZiB8fCBmLmV4b25zICE9PSBudWxsKVxuXHQgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgIC8vIG1ha2Ugc3VyZSB3ZSBvbmx5IGNoZWNrIGZvciB0aGlzIGZlYXR1cmUgb25jZVxuXHQgICAgZi5leG9ucyA9IFtdO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdH0pO1xuXHRpZiAoZmVhdHMubGVuZ3RoID09PSAwKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHRyZXR1cm4gdGhpcy5hdXhEYXRhTWFuYWdlci5leG9uc0J5R2VuZUlkcyhmZWF0cy5tYXAoZj0+Zi5JRCkpLnRoZW4oZXhvbnMgPT4ge1xuXHQgICAgZXhvbnMuZm9yRWFjaCggZSA9PiB7IHRoaXMucHJvY2Vzc0V4b24oZSk7IH0pO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvKlxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYWxsIGV4b25zIGZvciBnZW5lcyBpbiB0aGUgc3BlY2lmaWVkIGdlbm9tZVxuICAgIC8vIHRoYXQgb3ZlcmxhcCB0aGUgc3BlY2lmaWVkIHJhbmdlLlxuICAgIC8vXG4gICAgZW5zdXJlRXhvbnNCeVJhbmdlIChnZW5vbWUsIGNociwgc3RhcnQsIGVuZCkge1xuXHRyZXR1cm4gdGhpcy5hdXhEYXRhTWFuYWdlci5leG9uc0J5UmFuZ2UoZ2Vub21lLGNocixzdGFydCxlbmQpLnRoZW4oZXhvbnMgPT4ge1xuXHQgICAgZXhvbnMuZm9yRWFjaCggZSA9PiB7XG5cdCAgICAgICAgdGhpcy5wcm9jZXNzRXhvbihlKTtcblx0ICAgIH0pO1xuXHR9KTtcbiAgICB9XG4gICAgKi9cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxvYWRHZW5vbWVzIChnZW5vbWVzKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChnZW5vbWVzLm1hcChnID0+IHRoaXMuZW5zdXJlRmVhdHVyZXNCeUdlbm9tZSAoZykpKS50aGVuKCgpPT50cnVlKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRDYWNoZWRGZWF0dXJlc0J5UmFuZ2UgKGdlbm9tZSwgcmFuZ2UpIHtcbiAgICAgICAgbGV0IGdjID0gdGhpcy5jYWNoZVtnZW5vbWUubmFtZV0gO1xuXHRpZiAoIWdjKSByZXR1cm4gW107XG5cdGxldCBjRmVhdHMgPSBnY1tyYW5nZS5jaHJdO1xuXHRpZiAoIWNGZWF0cykgcmV0dXJuIFtdO1xuXHQvLyBGSVhNRTogc2hvdWxkIGJlIHNtYXJ0ZXIgdGhhbiB0ZXN0aW5nIGV2ZXJ5IGZlYXR1cmUhXG5cdGxldCBmZWF0cyA9IGNGZWF0cy5maWx0ZXIoY2YgPT4gb3ZlcmxhcHMoY2YsIHJhbmdlKSk7XG4gICAgICAgIHJldHVybiBmZWF0cztcdFxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYWxsIGNhY2hlZCBmZWF0dXJlcyBoYXZpbmcgdGhlIGdpdmVuIGNhbm9uaWNhbCBpZC5cbiAgICBnZXRDYWNoZWRGZWF0dXJlQnlJZCAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQyZmVhdHNbaWRdO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYWxsIGNhY2hlZCBmZWF0dXJlcyBoYXZpbmcgdGhlIGdpdmVuIGNhbm9uaWNhbCBpZC5cbiAgICBnZXRDYWNoZWRGZWF0dXJlc0J5Q2Fub25pY2FsSWQgKGNpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW5vbmljYWwyZmVhdHNbY2lkXSB8fCBbXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgbGlzdCBvZiBmZWF0dXJlcyB0aGF0IG1hdGNoIHRoZSBnaXZlbiBsYWJlbCwgd2hpY2ggY2FuIGJlIGFuIGlkLCBjYW5vbmljYWwgaWQsIG9yIHN5bWJvbC5cbiAgICAvLyBJZiBnZW5vbWUgaXMgc3BlY2lmaWVkLCBsaW1pdCByZXN1bHRzIHRvIGZlYXR1cmVzIGZyb20gdGhhdCBnZW5vbWUuXG4gICAgLy8gXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsIChsYWJlbCwgZ2Vub21lKSB7XG5cdGxldCBmID0gdGhpcy5pZDJmZWF0W2xhYmVsXVxuXHRsZXQgZmVhdHMgPSBmID8gW2ZdIDogdGhpcy5jYW5vbmljYWwyZmVhdHNbbGFiZWxdIHx8IHRoaXMuc3ltYm9sMmZlYXRzW2xhYmVsLnRvTG93ZXJDYXNlKCldIHx8IFtdO1xuXHRyZXR1cm4gZ2Vub21lID8gZmVhdHMuZmlsdGVyKGY9PiBmLmdlbm9tZSA9PT0gZ2Vub21lKSA6IGZlYXRzO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgZmVhdHVyZXMgaW4gXG4gICAgLy8gdGhlIHNwZWNpZmllZCByYW5nZXMgb2YgdGhlIHNwZWNpZmllZCBnZW5vbWUuXG4gICAgZ2V0RmVhdHVyZXNCeVJhbmdlIChnZW5vbWUsIHJhbmdlcywgZ2V0RXhvbnMpIHtcblx0bGV0IGZpZHMgPSBbXVxuXHRsZXQgcCA9IHRoaXMuZW5zdXJlRmVhdHVyZXNCeUdlbm9tZShnZW5vbWUpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmFuZ2VzLmZvckVhY2goIHIgPT4ge1xuXHQgICAgICAgIHIuZmVhdHVyZXMgPSB0aGlzLmdldENhY2hlZEZlYXR1cmVzQnlSYW5nZShnZW5vbWUsIHIpIFxuXHRcdHIuZ2Vub21lID0gZ2Vub21lO1xuXHRcdGZpZHMgPSBmaWRzLmNvbmNhdChyLmZlYXR1cmVzLm1hcChmID0+IGYuSUQpKVxuXHQgICAgfSk7XG5cdCAgICBsZXQgcmVzdWx0cyA9IHsgZ2Vub21lLCBibG9ja3M6cmFuZ2VzIH07XG5cdCAgICByZXR1cm4gcmVzdWx0cztcblx0fSk7XG5cdGlmIChnZXRFeG9ucylcblx0ICAgIHAgPSBwLnRoZW4ocmVzdWx0cyA9PiB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZW5zdXJlRXhvbnNCeUdlbmVJZHMoZmlkcykudGhlbigoKT0+cmVzdWx0cyk7XG5cdFx0fSk7XG5cdHJldHVybiBwO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIGZlYXR1cmVzIGhhdmluZyB0aGUgc3BlY2lmaWVkIGlkcyBmcm9tIHRoZSBzcGVjaWZpZWQgZ2Vub21lLlxuICAgIGdldEZlYXR1cmVzQnlJZCAoZ2Vub21lLCBpZHMsIGdldEV4b25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuc3VyZUZlYXR1cmVzQnlHZW5vbWUoZ2Vub21lKS50aGVuKCAoKSA9PiB7XG5cdCAgICBsZXQgZmVhdHMgPSBbXTtcblx0ICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuXHQgICAgbGV0IGFkZGYgPSAoZikgPT4ge1xuXHRcdGlmIChmLmdlbm9tZSAhPT0gZ2Vub21lKSByZXR1cm47XG5cdFx0aWYgKHNlZW4uaGFzKGYuaWQpKSByZXR1cm47XG5cdFx0c2Vlbi5hZGQoZi5pZCk7XG5cdFx0ZmVhdHMucHVzaChmKTtcblx0ICAgIH07XG5cdCAgICBsZXQgYWRkID0gKGYpID0+IHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShmKSkgXG5cdFx0ICAgIGYuZm9yRWFjaChmZiA9PiBhZGRmKGZmKSk7XG5cdFx0ZWxzZVxuXHRcdCAgICBhZGRmKGYpO1xuXHQgICAgfTtcblx0ICAgIGZvciAobGV0IGkgb2YgaWRzKXtcblx0XHRsZXQgZiA9IHRoaXMuY2Fub25pY2FsMmZlYXRzW2ldIHx8IHRoaXMuaWQyZmVhdFtpXTtcblx0XHRmICYmIGFkZChmKTtcblx0ICAgIH1cblx0ICAgIGlmIChnZXRFeG9ucykge1xuXHQgICAgICAgIHJldHVybiB0aGlzLmVuc3VyZUV4b25zQnlHZW5lSWRzKGZlYXRzLm1hcChmPT5mLklEKSkudGhlbigoKT0+ZmVhdHMpO1xuXHQgICAgfVxuXHQgICAgZWxzZVxuXHRcdHJldHVybiBmZWF0cztcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQ2FjaGVkRGF0YSAoKSB7XG5cdGNvbnNvbGUubG9nKFwiRmVhdHVyZU1hbmFnZXI6IENhY2hlIGNsZWFyZWQuXCIpXG4gICAgICAgIHJldHVybiB0aGlzLmZTdG9yZS5jbGVhcigpO1xuICAgIH1cblxufSAvLyBlbmQgY2xhc3MgRmVhdHVyZSBNYW5hZ2VyXG5cbmV4cG9ydCB7IEZlYXR1cmVNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBTdG9yZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihkYk5hbWUgPSAna2V5dmFsLXN0b3JlJywgc3RvcmVOYW1lID0gJ2tleXZhbCcpIHtcclxuICAgICAgICB0aGlzLnN0b3JlTmFtZSA9IHN0b3JlTmFtZTtcclxuICAgICAgICB0aGlzLl9kYnAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wZW5yZXEgPSBpbmRleGVkREIub3BlbihkYk5hbWUsIDEpO1xyXG4gICAgICAgICAgICBvcGVucmVxLm9uZXJyb3IgPSAoKSA9PiByZWplY3Qob3BlbnJlcS5lcnJvcik7XHJcbiAgICAgICAgICAgIG9wZW5yZXEub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZShvcGVucmVxLnJlc3VsdCk7XHJcbiAgICAgICAgICAgIC8vIEZpcnN0IHRpbWUgc2V0dXA6IGNyZWF0ZSBhbiBlbXB0eSBvYmplY3Qgc3RvcmVcclxuICAgICAgICAgICAgb3BlbnJlcS5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvcGVucmVxLnJlc3VsdC5jcmVhdGVPYmplY3RTdG9yZShzdG9yZU5hbWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgX3dpdGhJREJTdG9yZSh0eXBlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYnAudGhlbihkYiA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24odGhpcy5zdG9yZU5hbWUsIHR5cGUpO1xyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gKCkgPT4gcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmFib3J0ID0gdHJhbnNhY3Rpb24ub25lcnJvciA9ICgpID0+IHJlamVjdCh0cmFuc2FjdGlvbi5lcnJvcik7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuc3RvcmVOYW1lKSk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG59XHJcbmxldCBzdG9yZTtcclxuZnVuY3Rpb24gZ2V0RGVmYXVsdFN0b3JlKCkge1xyXG4gICAgaWYgKCFzdG9yZSlcclxuICAgICAgICBzdG9yZSA9IG5ldyBTdG9yZSgpO1xyXG4gICAgcmV0dXJuIHN0b3JlO1xyXG59XHJcbmZ1bmN0aW9uIGdldChrZXksIHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIGxldCByZXE7XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZG9ubHknLCBzdG9yZSA9PiB7XHJcbiAgICAgICAgcmVxID0gc3RvcmUuZ2V0KGtleSk7XHJcbiAgICB9KS50aGVuKCgpID0+IHJlcS5yZXN1bHQpO1xyXG59XHJcbmZ1bmN0aW9uIHNldChrZXksIHZhbHVlLCBzdG9yZSA9IGdldERlZmF1bHRTdG9yZSgpKSB7XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZHdyaXRlJywgc3RvcmUgPT4ge1xyXG4gICAgICAgIHN0b3JlLnB1dCh2YWx1ZSwga2V5KTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGRlbChrZXksIHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkd3JpdGUnLCBzdG9yZSA9PiB7XHJcbiAgICAgICAgc3RvcmUuZGVsZXRlKGtleSk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBjbGVhcihzdG9yZSA9IGdldERlZmF1bHRTdG9yZSgpKSB7XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZHdyaXRlJywgc3RvcmUgPT4ge1xyXG4gICAgICAgIHN0b3JlLmNsZWFyKCk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBrZXlzKHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIGNvbnN0IGtleXMgPSBbXTtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkb25seScsIHN0b3JlID0+IHtcclxuICAgICAgICAvLyBUaGlzIHdvdWxkIGJlIHN0b3JlLmdldEFsbEtleXMoKSwgYnV0IGl0IGlzbid0IHN1cHBvcnRlZCBieSBFZGdlIG9yIFNhZmFyaS5cclxuICAgICAgICAvLyBBbmQgb3BlbktleUN1cnNvciBpc24ndCBzdXBwb3J0ZWQgYnkgU2FmYXJpLlxyXG4gICAgICAgIChzdG9yZS5vcGVuS2V5Q3Vyc29yIHx8IHN0b3JlLm9wZW5DdXJzb3IpLmNhbGwoc3RvcmUpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlc3VsdClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAga2V5cy5wdXNoKHRoaXMucmVzdWx0LmtleSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzdWx0LmNvbnRpbnVlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pLnRoZW4oKCkgPT4ga2V5cyk7XHJcbn1cblxuZXhwb3J0IHsgU3RvcmUsIGdldCwgc2V0LCBkZWwsIGNsZWFyLCBrZXlzIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9pZGIta2V5dmFsL2Rpc3QvaWRiLWtleXZhbC5tanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGluaXRPcHRMaXN0IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBBdXhEYXRhTWFuYWdlciB9IGZyb20gJy4vQXV4RGF0YU1hbmFnZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE5vdCBzdXJlIHdoZXJlIHRoaXMgc2hvdWxkIGdvXG5sZXQgc2VhcmNoVHlwZXMgPSBbe1xuICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5UGhlbm90eXBlXCIsXG4gICAgbGFiZWw6IFwiLi4uYnkgcGhlbm90eXBlIG9yIGRpc2Vhc2VcIixcbiAgICB0ZW1wbGF0ZTogXCJcIixcbiAgICBwbGFjZWhvbGRlcjogXCJQaGVuby9kaXNlYXNlIChNUC9ETykgdGVybSBvciBJRHNcIlxufSx7XG4gICAgbWV0aG9kOiBcImZlYXR1cmVzQnlGdW5jdGlvblwiLFxuICAgIGxhYmVsOiBcIi4uLmJ5IGNlbGx1bGFyIGZ1bmN0aW9uXCIsXG4gICAgdGVtcGxhdGU6IFwiXCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiR2VuZSBPbnRvbG9neSAoR08pIHRlcm1zIG9yIElEc1wiXG59LHtcbiAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeVBhdGh3YXlcIixcbiAgICBsYWJlbDogXCIuLi5ieSBwYXRod2F5XCIsXG4gICAgdGVtcGxhdGU6IFwiXCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiUmVhY3RvbWUgcGF0aHdheXMgbmFtZXMsIElEc1wiXG59LHtcbiAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeUlkXCIsXG4gICAgbGFiZWw6IFwiLi4uYnkgc3ltYm9sL0lEXCIsXG4gICAgdGVtcGxhdGU6IFwiXCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiTUdJIG5hbWVzLCBzeW5vbnltcywgZXRjLlwiXG59XTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgUXVlcnlNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLmNmZyA9IHNlYXJjaFR5cGVzO1xuXHR0aGlzLmF1eERhdGFNYW5hZ2VyID0gbmV3IEF1eERhdGFNYW5hZ2VyKCk7XG5cdHRoaXMuc2VsZWN0ID0gbnVsbDtcdC8vIG15IDxzZWxlY3Q+IGVsZW1lbnRcblx0dGhpcy50ZXJtID0gbnVsbDtcdC8vIG15IDxpbnB1dD4gZWxlbWVudFxuXHR0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdHRoaXMuc2VsZWN0ID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzZWFyY2h0eXBlXCJdJyk7XG5cdHRoaXMudGVybSAgID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzZWFyY2h0ZXJtXCJdJyk7XG5cdC8vXG5cdHRoaXMudGVybS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgdGhpcy5jZmdbMF0ucGxhY2Vob2xkZXIpXG5cdGluaXRPcHRMaXN0KHRoaXMuc2VsZWN0WzBdWzBdLCB0aGlzLmNmZywgYz0+Yy5tZXRob2QsIGM9PmMubGFiZWwpO1xuXHQvLyBXaGVuIHVzZXIgY2hhbmdlcyB0aGUgcXVlcnkgdHlwZSAoc2VsZWN0b3IpLCBjaGFuZ2UgdGhlIHBsYWNlaG9sZGVyIHRleHQuXG5cdHRoaXMuc2VsZWN0Lm9uKFwiY2hhbmdlXCIsICgpID0+IHtcblx0ICAgIGxldCBvcHQgPSB0aGlzLnNlbGVjdC5wcm9wZXJ0eShcInNlbGVjdGVkT3B0aW9uc1wiKVswXTtcblx0ICAgIHRoaXMudGVybS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgb3B0Ll9fZGF0YV9fLnBsYWNlaG9sZGVyKVxuXHQgICAgXG5cdH0pO1xuXHQvLyBXaGVuIHVzZXIgZW50ZXJzIGEgc2VhcmNoIHRlcm0sIHJ1biBhIHF1ZXJ5XG5cdHRoaXMudGVybS5vbihcImNoYW5nZVwiLCAoKSA9PiB7XG5cdCAgICBsZXQgdGVybSA9IHRoaXMudGVybS5wcm9wZXJ0eShcInZhbHVlXCIpO1xuXHQgICAgdGhpcy50ZXJtLnByb3BlcnR5KFwidmFsdWVcIixcIlwiKTtcblx0ICAgIGxldCBzZWFyY2hUeXBlICA9IHRoaXMuc2VsZWN0LnByb3BlcnR5KFwidmFsdWVcIik7XG5cdCAgICBsZXQgbHN0TmFtZSA9IHRlcm07XG5cdCAgICBkMy5zZWxlY3QoXCIjbXlsaXN0c1wiKS5jbGFzc2VkKFwiYnVzeVwiLHRydWUpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHQgICAgdGhpcy5hdXhEYXRhTWFuYWdlcltzZWFyY2hUeXBlXSh0ZXJtKVx0Ly8gPC0gcnVuIHRoZSBxdWVyeVxuXHQgICAgICAudGhlbihmZWF0cyA9PiB7XG5cdFx0ICAvLyBGSVhNRSAtIHJlYWNob3ZlciAtIHRoaXMgd2hvbGUgaGFuZGxlclxuXHRcdCAgbGV0IGxzdCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLmNyZWF0ZUxpc3QobHN0TmFtZSwgZmVhdHMubWFwKGYgPT4gZi5wcmltYXJ5SWRlbnRpZmllcikpXG5cdFx0ICB0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGUobHN0KTtcblx0XHQgIC8vXG5cdFx0ICB0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzID0ge307XG5cdFx0ICBmZWF0cy5mb3JFYWNoKGYgPT4gdGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0c1tmLmNhbm9uaWNhbF0gPSBmLmNhbm9uaWNhbCk7XG5cdFx0ICB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoKTtcblx0XHQgIC8vXG5cdFx0ICB0aGlzLmFwcC5zZXRDdXJyZW50TGlzdChsc3QsdHJ1ZSk7XG5cdFx0ICAvL1xuXHRcdCAgZDMuc2VsZWN0KFwiI215bGlzdHNcIikuY2xhc3NlZChcImJ1c3lcIixmYWxzZSk7XG5cdCAgICAgIH0pO1xuXHR9KVxuICAgIH1cbn1cblxuZXhwb3J0IHsgUXVlcnlNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9RdWVyeU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGQzanNvbiwgZDN0ZXh0IH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVGhpcyBiZWxvbmdzIGluIGEgY29uZmlnIGJ1dCBmb3Igbm93Li4uXG5sZXQgTW91c2VNaW5lID0gJ3Rlc3QnOyAvLyBvbmUgb2Y6IHB1YmxpYywgdGVzdCwgZGV2XG5cbmxldCBNSU5FUyA9IHtcbiAgICAnZGV2JyA6ICdodHRwOi8vYmhtZ2ltbS1kZXY6ODA4MC9tb3VzZW1pbmUnLFxuICAgICd0ZXN0JzogJ2h0dHA6Ly90ZXN0Lm1vdXNlbWluZS5vcmcvbW91c2VtaW5lJyxcbiAgICAncHVibGljJyA6ICdodHRwOi8vd3d3Lm1vdXNlbWluZS5vcmcvbW91c2VtaW5lJyxcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXV4RGF0YU1hbmFnZXIgLSBrbm93cyBob3cgdG8gcXVlcnkgYW4gZXh0ZXJuYWwgc291cmNlIChpLmUuLCBNb3VzZU1pbmUpIGZvciBnZW5lc1xuLy8gYW5ub3RhdGVkIHRvIGRpZmZlcmVudCBvbnRvbG9naWVzIGFuZCBmb3IgZXhvbnMgYXNzb2NpYXRlZCB3aXRoIHNwZWNpZmljIGdlbmVzIG9yIHJlZ2lvbnMuXG5jbGFzcyBBdXhEYXRhTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuXHRpZiAoIU1JTkVTW01vdXNlTWluZV0pIFxuXHQgICAgdGhyb3cgXCJVbmtub3duIG1pbmUgbmFtZTogXCIgKyBNb3VzZU1pbmU7XG5cdHRoaXMuYmFzZVVybCA9IE1JTkVTW01vdXNlTWluZV07XG5cdGNvbnNvbGUubG9nKFwiTW91c2VNaW5lIHVybDpcIiwgdGhpcy5iYXNlVXJsKTtcbiAgICAgICAgdGhpcy5xVXJsID0gdGhpcy5iYXNlVXJsICsgJy9zZXJ2aWNlL3F1ZXJ5L3Jlc3VsdHM/Jztcblx0dGhpcy5yVXJsID0gdGhpcy5iYXNlVXJsICsgJy9wb3J0YWwuZG8/Y2xhc3M9U2VxdWVuY2VGZWF0dXJlJmV4dGVybmFsaWRzPSdcblx0dGhpcy5mYVVybCA9IHRoaXMuYmFzZVVybCArICcvc2VydmljZS9xdWVyeS9yZXN1bHRzL2Zhc3RhPyc7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldEF1eERhdGEgKHEsIGZvcm1hdCkge1xuXHRjb25zb2xlLmxvZygnUXVlcnk6ICcgKyBxKTtcblx0Zm9ybWF0ID0gZm9ybWF0IHx8ICdqc29ub2JqZWN0cyc7XG5cdGxldCBxdWVyeSA9IGVuY29kZVVSSUNvbXBvbmVudChxKTtcblx0bGV0IHVybCA9IHRoaXMucVVybCArIGBmb3JtYXQ9JHtmb3JtYXR9JnF1ZXJ5PSR7cXVlcnl9YDtcblx0cmV0dXJuIGQzanNvbih1cmwpLnRoZW4oZGF0YSA9PiBkYXRhLnJlc3VsdHN8fFtdKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpc0lkZW50aWZpZXIgKHEpIHtcbiAgICAgICAgbGV0IHB0cyA9IHEuc3BsaXQoJzonKTtcbiAgICAgICAgaWYgKHB0cy5sZW5ndGggPT09IDIgJiYgcHRzWzFdLm1hdGNoKC9eWzAtOV0rJC8pKVxuXHQgICAgcmV0dXJuIHRydWU7XG5cdGlmIChxLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCgnci1tbXUtJykpXG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0cmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhZGRXaWxkY2FyZHMgKHEpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmlzSWRlbnRpZmllcihxKSB8fCBxLmluZGV4T2YoJyonKT49MCkgPyBxIDogYCoke3F9KmA7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGRvIGEgTE9PS1VQIHF1ZXJ5IGZvciBTZXF1ZW5jZUZlYXR1cmVzIGZyb20gTW91c2VNaW5lXG4gICAgZmVhdHVyZXNCeUxvb2t1cCAocXJ5U3RyaW5nKSB7XG5cdGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgICB2aWV3PVwiU2VxdWVuY2VGZWF0dXJlLnByaW1hcnlJZGVudGlmaWVyIFNlcXVlbmNlRmVhdHVyZS5zeW1ib2xcIiBcblx0ICAgIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEIgYW5kIENcIj5cblx0XHQ8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmVcIiBvcD1cIkxPT0tVUFwiIHZhbHVlPVwiJHtxcnlTdHJpbmd9XCIvPlxuXHRcdDxjb25zdHJhaW50IGNvZGU9XCJCXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vcmdhbmlzbS50YXhvbklkXCIgb3A9XCI9XCIgdmFsdWU9XCIxMDA5MFwiLz5cblx0XHQ8Y29uc3RyYWludCBjb2RlPVwiQ1wiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUuc2VxdWVuY2VPbnRvbG9neVRlcm0ubmFtZVwiIG9wPVwiIT1cIiB2YWx1ZT1cInRyYW5zZ2VuZVwiLz5cblx0ICAgIDwvcXVlcnk+YDtcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZmVhdHVyZXNCeU9udG9sb2d5VGVybSAocXJ5U3RyaW5nLCB0ZXJtVHlwZXMpIHtcblx0cXJ5U3RyaW5nID0gdGhpcy5hZGRXaWxkY2FyZHMocXJ5U3RyaW5nKTtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICB2aWV3PVwiU2VxdWVuY2VGZWF0dXJlLnByaW1hcnlJZGVudGlmaWVyIFNlcXVlbmNlRmVhdHVyZS5zeW1ib2xcIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCIGFuZCBDIGFuZCBEXCI+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJBXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vbnRvbG9neUFubm90YXRpb25zLm9udG9sb2d5VGVybS5wYXJlbnRzXCIgb3A9XCJMT09LVVBcIiB2YWx1ZT1cIiR7cXJ5U3RyaW5nfVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkJcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9yZ2FuaXNtLnRheG9uSWRcIiBvcD1cIj1cIiB2YWx1ZT1cIjEwMDkwXCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiQ1wiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUuc2VxdWVuY2VPbnRvbG9neVRlcm0ubmFtZVwiIG9wPVwiIT1cIiB2YWx1ZT1cInRyYW5zZ2VuZVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkRcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9udG9sb2d5QW5ub3RhdGlvbnMub250b2xvZ3lUZXJtLm9udG9sb2d5Lm5hbWVcIiBvcD1cIk9ORSBPRlwiPlxuXHRcdCAgJHsgdGVybVR5cGVzLm1hcCh0dD0+ICc8dmFsdWU+Jyt0dCsnPC92YWx1ZT4nKS5qb2luKCcnKSB9XG5cdCAgICAgIDwvY29uc3RyYWludD5cblx0ICA8L3F1ZXJ5PmBcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZmVhdHVyZXNCeVBhdGh3YXlUZXJtIChxcnlTdHJpbmcpIHtcblx0cXJ5U3RyaW5nID0gdGhpcy5hZGRXaWxkY2FyZHMocXJ5U3RyaW5nKTtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICB2aWV3PVwiR2VuZS5wcmltYXJ5SWRlbnRpZmllciBHZW5lLnN5bWJvbFwiIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEJcIj5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkdlbmUucGF0aHdheXNcIiBjb2RlPVwiQVwiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJHZW5lLm9yZ2FuaXNtLnRheG9uSWRcIiBjb2RlPVwiQlwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdCAgPC9xdWVyeT5gO1xuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmZWF0dXJlc0J5SWQgICAgICAgIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeUxvb2t1cChxcnlTdHJpbmcpOyB9XG4gICAgZmVhdHVyZXNCeUZ1bmN0aW9uICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBbXCJHZW5lIE9udG9sb2d5XCJdKTsgfVxuICAgIGZlYXR1cmVzQnlQaGVub3R5cGUgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5T250b2xvZ3lUZXJtKHFyeVN0cmluZywgW1wiTWFtbWFsaWFuIFBoZW5vdHlwZVwiLFwiRGlzZWFzZSBPbnRvbG9neVwiXSk7IH1cbiAgICBmZWF0dXJlc0J5UGF0aHdheSAgIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeVBhdGh3YXlUZXJtKHFyeVN0cmluZyk7IH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgYWxsIGV4b25zIG9mIGZlYXR1cmVzIG92ZXJsYXBwaW5nIGEgc3BlY2lmaWVkIHJhbmdlIGluIHRoZSBzcGVjaWZlZCBnZW5vbWUuXG4gICAgZXhvblZpZXcgKCkge1xuXHRyZXR1cm4gW1xuXHQgICAgJ0V4b24uZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXInLFxuXHQgICAgJ0V4b24uZ2VuZS5wcmltYXJ5SWRlbnRpZmllcicsXG5cdCAgICAnRXhvbi50cmFuc2NyaXB0cy5wcmltYXJ5SWRlbnRpZmllcicsXG5cdCAgICAnRXhvbi5wcmltYXJ5SWRlbnRpZmllcicsXG5cdCAgICAnRXhvbi5jaHJvbW9zb21lLnByaW1hcnlJZGVudGlmaWVyJyxcblx0ICAgICdFeG9uLmNocm9tb3NvbWVMb2NhdGlvbi5zdGFydCcsXG5cdCAgICAnRXhvbi5jaHJvbW9zb21lTG9jYXRpb24uZW5kJyxcblx0ICAgICdFeG9uLnN0cmFpbi5uYW1lJ1xuXHRdLmpvaW4oJyAnKTtcbiAgICB9XG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIGFsbCBleG9ucyBmcm9tIHRoZSBnaXZlbiBnZW5vbWUgd2hlcmUgdGhlIGV4b24ncyBnZW5lIG92ZXJsYXBzIHRoZSBnaXZlbiBjb29yZGluYXRlcy5cbiAgICBleG9uc0J5UmFuZ2VcdChnZW5vbWUsIGNociwgc3RhcnQsIGVuZCkge1xuICAgICAgICBsZXQgcSA9IGA8cXVlcnkgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIiR7dGhpcy5leG9uVmlldygpfVwiIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEJcIj5cblx0ICAgIDxjb25zdHJhaW50IGNvZGU9XCJBXCIgcGF0aD1cIkV4b24uZ2VuZS5jaHJvbW9zb21lTG9jYXRpb25cIiBvcD1cIk9WRVJMQVBTXCI+XG5cdFx0PHZhbHVlPiR7Y2hyfToke3N0YXJ0fS4uJHtlbmR9PC92YWx1ZT5cblx0ICAgIDwvY29uc3RyYWludD5cblx0ICAgIDxjb25zdHJhaW50IGNvZGU9XCJCXCIgcGF0aD1cIkV4b24uc3RyYWluLm5hbWVcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7Z2Vub21lfVwiLz5cblx0ICAgIDwvcXVlcnk+YFxuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgYWxsIGV4b25zIG9mIGFsbCBnZW5vbG9ncyBvZiB0aGUgc3BlY2lmaWVkIGNhbm9uaWNhbCBnZW5lXG4gICAgZXhvbnNCeUNhbm9uaWNhbElkXHQoaWRlbnQpIHtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCIke3RoaXMuZXhvblZpZXcoKX1cIiA+XG5cdCAgICA8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJFeG9uLmdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiIC8+XG5cdCAgICA8L3F1ZXJ5PmBcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIGFsbCBleG9ucyBvZiB0aGUgc3BlY2lmaWVkIGdlbmUuXG4gICAgZXhvbnNCeUdlbmVJZFx0KGlkZW50KSB7XG4gICAgICAgIGxldCBxID0gYDxxdWVyeSBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiJHt0aGlzLmV4b25WaWV3KCl9XCIgPlxuXHQgICAgPGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiRXhvbi5nZW5lLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiIC8+XG5cdCAgICA8L3F1ZXJ5PmBcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIGFsbCBleG9ucyBvZiB0aGUgc3BlY2lmaWVkIGdlbmUuXG4gICAgZXhvbnNCeUdlbmVJZHNcdChpZGVudHMpIHtcblx0bGV0IHZhbHMgPSBpZGVudHMubWFwKGkgPT4gYDx2YWx1ZT4ke2l9PC92YWx1ZT5gKS5qb2luKCcnKTtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCIke3RoaXMuZXhvblZpZXcoKX1cIiA+XG5cdCAgICA8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJFeG9uLmdlbmUucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIk9ORSBPRlwiPiR7dmFsc308L2NvbnN0cmFpbnQ+XG5cdCAgICA8L3F1ZXJ5PmBcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ29uc3RydWN0cyBhIFVSTCBmb3IgbGlua2luZyB0byBhIE1vdXNlTWluZSByZXBvcnQgcGFnZSBieSBpZFxuICAgIGxpbmtUb1JlcG9ydFBhZ2UgKGlkZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJVcmwgKyBpZGVudDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ29uc3RydWN0cyBhIFVSTCB0byByZXRyaWV2ZSBtb3VzZSBzZXF1ZW5jZXMgb2YgdGhlIHNwZWNpZmllZCB0eXBlIGZvciB0aGUgc3BlY2lmaWVkIGZlYXR1cmUuXG4gICAgc2VxdWVuY2VzRm9yRmVhdHVyZSAoZiwgdHlwZSwgZ2Vub21lcykge1xuXHRsZXQgcTtcblx0bGV0IHVybDtcblx0bGV0IHZpZXc7XG5cdGxldCBpZGVudDtcbiAgICAgICAgLy9cblx0dHlwZSA9IHR5cGUgPyB0eXBlLnRvTG93ZXJDYXNlKCkgOiAnZ2Vub21pYyc7XG5cdC8vXG5cdGlmIChmLmNhbm9uaWNhbCkge1xuXHQgICAgaWRlbnQgPSBmLmNhbm9uaWNhbFxuXHQgICAgLy9cblx0ICAgIGxldCBncyA9ICcnXG5cdCAgICBsZXQgdmFscztcblx0ICAgIGlmIChnZW5vbWVzKSB7XG5cdFx0dmFscyA9IGdlbm9tZXMubWFwKChnKSA9PiBgPHZhbHVlPiR7Z308L3ZhbHVlPmApLmpvaW4oJycpO1xuXHQgICAgfVxuXHQgICAgc3dpdGNoICh0eXBlKSB7XG5cdCAgICBjYXNlICdnZW5vbWljJzpcblx0XHR2aWV3ID0gJ0dlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyJztcblx0XHRncyA9IGA8Y29uc3RyYWludCBwYXRoPVwiR2VuZS5zdHJhaW4ubmFtZVwiIG9wPVwiT05FIE9GXCI+JHt2YWxzfTwvY29uc3RyYWludD5gXG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cInNlcXVlbmNlc0J5Q2Fub25pY2FsSWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiR2VuZS5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiLz5cblx0XHQgICAgJHtnc308L3F1ZXJ5PmA7XG5cdFx0YnJlYWs7XG5cdCAgICBjYXNlICd0cmFuc2NyaXB0Jzpcblx0XHR2aWV3ID0gJ1RyYW5zY3JpcHQuZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXInO1xuXHRcdGdzID0gYDxjb25zdHJhaW50IHBhdGg9XCJUcmFuc2NyaXB0LnN0cmFpbi5uYW1lXCIgb3A9XCJPTkUgT0ZcIj4ke3ZhbHN9PC9jb25zdHJhaW50PmBcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwidHJhbnNjcmlwdFNlcXVlbmNlc0J5Q2Fub25pY2FsSWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiVHJhbnNjcmlwdC5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlRyYW5zY3JpcHQuZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgICAke2dzfTwvcXVlcnk+YDtcblx0ICAgICAgICBicmVhaztcblx0ICAgIGNhc2UgJ2V4b24nOlxuXHRcdHZpZXcgPSAnRXhvbi5nZW5lLmNhbm9uaWNhbC5wcmltYXJ5SWRlbnRpZmllcic7XG5cdFx0Z3MgPSBgPGNvbnN0cmFpbnQgcGF0aD1cIkV4b24uc3RyYWluLm5hbWVcIiBvcD1cIk9ORSBPRlwiPiR7dmFsc308L2NvbnN0cmFpbnQ+YFxuXHRcdHEgPSBgPHF1ZXJ5IG5hbWU9XCJleG9uU2VxdWVuY2VzQnlDYW5vbmljYWxJZFwiIG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCJFeG9uLnByaW1hcnlJZGVudGlmaWVyXCIgPlxuXHRcdCAgICA8Y29uc3RyYWludCBwYXRoPVwiRXhvbi5nZW5lLmNhbm9uaWNhbC5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIi8+XG5cdFx0ICAgICR7Z3N9PC9xdWVyeT5gO1xuXHQgICAgICAgIGJyZWFrO1xuXHQgICAgY2FzZSAnY2RzJzpcblx0XHR2aWV3ID0gJ0NEUy5nZW5lLmNhbm9uaWNhbC5wcmltYXJ5SWRlbnRpZmllcic7XG5cdFx0Z3MgPSBgPGNvbnN0cmFpbnQgcGF0aD1cIkNEUy5zdHJhaW4ubmFtZVwiIG9wPVwiT05FIE9GXCI+JHt2YWxzfTwvY29uc3RyYWludD5gXG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cImNkc1NlcXVlbmNlc0J5Q2Fub25pY2FsSWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiQ0RTLnByaW1hcnlJZGVudGlmaWVyXCIgPlxuXHRcdCAgICA8Y29uc3RyYWludCBwYXRoPVwiQ0RTLmdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiLz5cblx0XHQgICAgJHtnc308L3F1ZXJ5PmA7XG5cdCAgICAgICAgYnJlYWs7XG5cdCAgICB9XG5cdH1cblx0ZWxzZSB7XG5cdCAgICBpZGVudCA9IGYuSUQ7XG5cdCAgICB2aWV3ID0gJydcblx0ICAgIHN3aXRjaCAodHlwZSkge1xuXHQgICAgY2FzZSAnZ2Vub21pYyc6XG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cInNlcXVlbmNlc0J5SWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiR2VuZS5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkdlbmUucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgPC9xdWVyeT5gO1xuXHRcdGJyZWFrO1xuXHQgICAgY2FzZSAndHJhbnNjcmlwdCc6XG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cInRyYW5zY3JpcHRTZXF1ZW5jZXNCeUlkXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIlRyYW5zY3JpcHQucHJpbWFyeUlkZW50aWZpZXJcIiA+XG5cdFx0ICAgIDxjb25zdHJhaW50IHBhdGg9XCJUcmFuc2NyaXB0LmdlbmUucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgPC9xdWVyeT5gO1xuXHQgICAgICAgIGJyZWFrO1xuXHQgICAgY2FzZSAnZXhvbic6XG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cImV4b25TZXF1ZW5jZXNCeUlkXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIkV4b24ucHJpbWFyeUlkZW50aWZpZXJcIiA+XG5cdFx0ICAgIDxjb25zdHJhaW50IHBhdGg9XCJFeG9uLmdlbmUucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgPC9xdWVyeT5gO1xuXHQgICAgICAgIGJyZWFrO1xuXHQgICAgY2FzZSAnY2RzJzpcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwiY2RzU2VxdWVuY2VzQnlJZFwiIG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCJDRFMucHJpbWFyeUlkZW50aWZpZXJcIiA+XG5cdFx0ICAgIDxjb25zdHJhaW50IHBhdGg9XCJDRFMuZ2VuZS5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIi8+XG5cdFx0ICA8L3F1ZXJ5PmA7XG5cdCAgICAgICAgYnJlYWs7XG5cdCAgICB9XG5cdH1cblx0aWYgKCFxKSByZXR1cm4gbnVsbDtcblx0Y29uc29sZS5sb2cocSwgdmlldyk7XG5cdHVybCA9IHRoaXMuZmFVcmwgKyBgcXVlcnk9JHtlbmNvZGVVUklDb21wb25lbnQocSl9YDtcblx0aWYgKHZpZXcpXG4gICAgICAgICAgICB1cmwgKz0gYCZ2aWV3PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHZpZXcpfWA7XG5cdHJldHVybiB1cmw7XG4gICAgfVxufVxuXG5leHBvcnQgeyBBdXhEYXRhTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQXV4RGF0YU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IExpc3RGb3JtdWxhRXZhbHVhdG9yIH0gZnJvbSAnLi9MaXN0Rm9ybXVsYUV2YWx1YXRvcic7XG5pbXBvcnQgeyBLZXlTdG9yZSB9IGZyb20gJy4vS2V5U3RvcmUnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE1haW50YWlucyBuYW1lZCBsaXN0cyBvZiBJRHMuIExpc3RzIG1heSBiZSB0ZW1wb3JhcnksIGxhc3Rpbmcgb25seSBmb3IgdGhlIHNlc3Npb24sIG9yIHBlcm1hbmVudCxcbi8vIGxhc3RpbmcgdW50aWwgdGhlIHVzZXIgY2xlYXJzIHRoZSBicm93c2VyIGxvY2FsIHN0b3JhZ2UgYXJlYS5cbi8vXG4vLyBVc2VzIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSBhbmQgd2luZG93LmxvY2FsU3RvcmFnZSB0byBzYXZlIGxpc3RzXG4vLyB0ZW1wb3JhcmlseSBvciBwZXJtYW5lbnRseSwgcmVzcC4gIEZJWE1FOiBzaG91bGQgYmUgdXNpbmcgd2luZG93LmluZGV4ZWREQlxuLy9cbmNsYXNzIExpc3RNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLm5hbWUybGlzdCA9IG51bGw7XG5cdHRoaXMubGlzdFN0b3JlID0gbmV3IEtleVN0b3JlKCd1c2VyLWxpc3RzJyk7XG5cdHRoaXMuZm9ybXVsYUV2YWwgPSBuZXcgTGlzdEZvcm11bGFFdmFsdWF0b3IodGhpcyk7XG5cdHRoaXMucmVhZHkgPSB0aGlzLl9sb2FkKCkudGhlbiggKCk9PnRoaXMuaW5pdERvbSgpICk7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuXHQvLyBCdXR0b246IHNob3cvaGlkZSB3YXJuaW5nIG1lc3NhZ2Vcblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbi53YXJuaW5nJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IHcgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cIm1lc3NhZ2VcIl0nKTtcblx0XHR3LmNsYXNzZWQoJ3Nob3dpbmcnLCAhdy5jbGFzc2VkKCdzaG93aW5nJykpO1xuXHQgICAgfSk7XG5cdC8vIEJ1dHRvbjogY3JlYXRlIGxpc3QgZnJvbSBjdXJyZW50IHNlbGVjdGlvblxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJuZXdmcm9tc2VsZWN0aW9uXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgaWRzID0gbmV3IFNldChPYmplY3Qua2V5cyh0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzKSk7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdFx0bGV0IGxzdCA9IHRoaXMuYXBwLmdldEN1cnJlbnRMaXN0KCk7XG5cdFx0aWYgKGxzdClcblx0XHQgICAgaWRzID0gaWRzLnVuaW9uKGxzdC5pZHMpO1xuXHRcdGlmIChpZHMuc2l6ZSA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vdGhpbmcgc2VsZWN0ZWQuXCIpO1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHRcdGxldCBuZXdsaXN0ID0gdGhpcy5jcmVhdGVMaXN0KFwic2VsZWN0aW9uXCIsIEFycmF5LmZyb20oaWRzKSk7XG5cdFx0dGhpcy51cGRhdGUobmV3bGlzdCk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IGNvbWJpbmUgbGlzdHM6IG9wZW4gbGlzdCBlZGl0b3Igd2l0aCBmb3JtdWxhIGVkaXRvciBvcGVuXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cImNvbWJpbmVcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlmICh0aGlzLmdldE5hbWVzKCkubGVuZ3RoID09PSAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTm8gbGlzdHMuXCIpO1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHRcdGxldCBsZSA9IHRoaXMuYXBwLmxpc3RFZGl0b3I7XG5cdFx0bGUub3BlbigpO1xuXHRcdGxlLm9wZW5Gb3JtdWxhRWRpdG9yKCk7XG5cdCAgICB9KTtcblx0Ly8gQnV0dG9uOiBkZWxldGUgYWxsIGxpc3RzIChnZXQgY29uZmlybWF0aW9uIGZpcnN0KS5cblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwicHVyZ2VcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlmICh0aGlzLmdldE5hbWVzKCkubGVuZ3RoID09PSAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTm8gbGlzdHMuXCIpO1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHQgICAgICAgIGlmICh3aW5kb3cuY29uZmlybShcIkRlbGV0ZSBhbGwgbGlzdHMuIEFyZSB5b3Ugc3VyZT9cIikpIHtcblx0XHQgICAgdGhpcy5wdXJnZSgpO1xuXHRcdCAgICB0aGlzLnVwZGF0ZSgpO1xuXHRcdH1cblx0ICAgIH0pO1xuICAgIH1cbiAgICBfbG9hZCAoKSB7XG5cdHJldHVybiB0aGlzLmxpc3RTdG9yZS5nZXQoXCJhbGxcIikudGhlbihhbGwgPT4ge1xuXHQgICAgdGhpcy5uYW1lMmxpc3QgPSBhbGwgfHwge307XG5cdH0pO1xuICAgIH1cbiAgICBfc2F2ZSAoKSB7XG5cdHJldHVybiB0aGlzLmxpc3RTdG9yZS5zZXQoXCJhbGxcIiwgdGhpcy5uYW1lMmxpc3QpXG4gICAgfVxuICAgIC8vXG4gICAgLy8gcmV0dXJucyB0aGUgbmFtZXMgb2YgYWxsIHRoZSBsaXN0cywgc29ydGVkXG4gICAgZ2V0TmFtZXMgKCkge1xuICAgICAgICBsZXQgbm1zID0gT2JqZWN0LmtleXModGhpcy5uYW1lMmxpc3QpO1xuXHRubXMuc29ydCgpO1xuXHRyZXR1cm4gbm1zO1xuICAgIH1cbiAgICAvLyByZXR1cm5zIHRydWUgaWZmIGEgbGlzdCBleGlzdHMgd2l0aCB0aGlzIG5hbWVcbiAgICBoYXMgKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUgaW4gdGhpcy5uYW1lMmxpc3Q7XG4gICAgfVxuICAgIC8vIElmIG5vIGxpc3Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBleGlzdHMsIHJldHVybiB0aGUgbmFtZS5cbiAgICAvLyBPdGhlcndpc2UsIHJldHVybiBhIG1vZGlmaWVkIHZlcnNpb24gb2YgbmFtZSB0aGF0IGlzIHVuaXF1ZS5cbiAgICAvLyBVbmlxdWUgbmFtZXMgYXJlIGNyZWF0ZWQgYnkgYXBwZW5kaW5nIGEgY291bnRlci5cbiAgICAvLyBFLmcuLCB1bmlxdWlmeShcImZvb1wiKSAtPiBcImZvby4xXCIgb3IgXCJmb28uMlwiIG9yIHdoYXRldmVyLlxuICAgIC8vXG4gICAgdW5pcXVpZnkgKG5hbWUpIHtcblx0aWYgKCF0aGlzLmhhcyhuYW1lKSkgXG5cdCAgICByZXR1cm4gbmFtZTtcblx0Zm9yIChsZXQgaSA9IDE7IDsgaSArPSAxKSB7XG5cdCAgICBsZXQgbm4gPSBgJHtuYW1lfS4ke2l9YDtcblx0ICAgIGlmICghdGhpcy5oYXMobm4pKVxuXHQgICAgICAgIHJldHVybiBubjtcblx0fVxuICAgIH1cbiAgICAvLyByZXR1cm5zIHRoZSBsaXN0IHdpdGggdGhpcyBuYW1lLCBvciBudWxsIGlmIG5vIHN1Y2ggbGlzdFxuICAgIGdldCAobmFtZSkge1xuICAgICAgICBsZXQgbHN0ID0gdGhpcy5uYW1lMmxpc3RbbmFtZV07XG5cdGlmICghbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuYW1lO1xuXHRyZXR1cm4gbHN0O1xuICAgIH1cbiAgICAvLyByZXR1cm5zIGFsbCB0aGUgbGlzdHMsIHNvcnRlZCBieSBuYW1lXG4gICAgZ2V0QWxsICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TmFtZXMoKS5tYXAobiA9PiB0aGlzLmdldChuKSlcbiAgICB9XG4gICAgLy8gXG4gICAgY3JlYXRlT3JVcGRhdGUgKG5hbWUsIGlkcykge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLnVwZGF0ZUxpc3QobmFtZSxudWxsLGlkcykgOiB0aGlzLmNyZWF0ZUxpc3QobmFtZSwgaWRzKTtcbiAgICB9XG4gICAgLy8gY3JlYXRlcyBhIG5ldyBsaXN0IHdpdGggdGhlIGdpdmVuIG5hbWUgYW5kIGlkcy5cbiAgICBjcmVhdGVMaXN0IChuYW1lLCBpZHMsIGZvcm11bGEpIHtcblx0aWYgKG5hbWUgIT09IFwiX1wiKVxuXHQgICAgbmFtZSA9IHRoaXMudW5pcXVpZnkobmFtZSk7XG5cdC8vXG5cdGxldCBkdCA9IG5ldyBEYXRlKCkgKyBcIlwiO1xuXHR0aGlzLm5hbWUybGlzdFtuYW1lXSA9IHtcblx0ICAgIG5hbWU6ICAgICBuYW1lLFxuXHQgICAgaWRzOiAgICAgIGlkcyxcblx0ICAgIGZvcm11bGE6ICBmb3JtdWxhIHx8IFwiXCIsXG5cdCAgICBjcmVhdGVkOiAgZHQsXG5cdCAgICBtb2RpZmllZDogZHRcblx0fTtcblx0dGhpcy5fc2F2ZSgpO1xuXHRyZXR1cm4gdGhpcy5uYW1lMmxpc3RbbmFtZV07XG4gICAgfVxuICAgIC8vIFByb3ZpZGUgYWNjZXNzIHRvIGV2YWx1YXRpb24gc2VydmljZVxuICAgIGV2YWxGb3JtdWxhIChleHByKSB7XG5cdHJldHVybiB0aGlzLmZvcm11bGFFdmFsLmV2YWwoZXhwcik7XG4gICAgfVxuICAgIC8vIFJlZnJlc2hlcyBhIGxpc3QgYW5kIHJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgcmVmcmVzaGVkIGxpc3QuXG4gICAgLy8gSWYgdGhlIGxpc3QgaWYgYSBQT0xPLCBwcm9taXNlIHJlc29sdmVzIGltbWVkaWF0ZWx5IHRvIHRoZSBsaXN0LlxuICAgIC8vIE90aGVyd2lzZSwgc3RhcnRzIGEgcmVldmFsdWF0aW9uIG9mIHRoZSBmb3JtdWxhIHRoYXQgcmVzb2x2ZXMgYWZ0ZXIgdGhlXG4gICAgLy8gbGlzdCdzIGlkcyBoYXZlIGJlZW4gdXBkYXRlZC5cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBlcnJvciwgdGhlIHJldHVybmVkIHByb21pc2UgcmVqZWN0cyB3aXRoIHRoZSBlcnJvci5cbiAgICByZWZyZXNoTGlzdCAobmFtZSkge1xuICAgICAgICBsZXQgbHN0ID0gdGhpcy5nZXQobmFtZSk7XG5cdGlmICghbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuYW1lO1xuXHRsc3QubW9kaWZpZWQgPSBcIlwiK25ldyBEYXRlKCk7XG5cdGlmICghbHN0LmZvcm11bGEpXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGxzdCk7XG5cdGVsc2Uge1xuXHQgICAgbGV0IHAgPSB0aGlzLmZvcm11YWxFdmFsLmV2YWwobHN0LmZvcm11bGEpLnRoZW4oIGlkcyA9PiB7XG5cdFx0ICAgIGxzdC5pZHMgPSBpZHM7XG5cdFx0ICAgIHJldHVybiBsc3Q7XG5cdFx0fSk7XG5cdCAgICByZXR1cm4gcDtcblx0fVxuICAgIH1cblxuICAgIC8vIHVwZGF0ZXMgdGhlIGlkcyBpbiB0aGUgZ2l2ZW4gbGlzdFxuICAgIHVwZGF0ZUxpc3QgKG5hbWUsIG5ld25hbWUsIG5ld2lkcywgbmV3Zm9ybXVsYSkge1xuXHRsZXQgbHN0ID0gdGhpcy5nZXQobmFtZSk7XG4gICAgICAgIGlmICghIGxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgbmFtZTtcblx0aWYgKG5ld25hbWUpIHtcblx0ICAgIGRlbGV0ZSB0aGlzLm5hbWUybGlzdFtsc3QubmFtZV07XG5cdCAgICBsc3QubmFtZSA9IHRoaXMudW5pcXVpZnkobmV3bmFtZSk7XG5cdCAgICB0aGlzLm5hbWUybGlzdFtsc3QubmFtZV0gPSBsc3Q7XG5cdH1cblx0aWYgKG5ld2lkcykgbHN0LmlkcyAgPSBuZXdpZHM7XG5cdGlmIChuZXdmb3JtdWxhIHx8IG5ld2Zvcm11bGE9PT1cIlwiKSBsc3QuZm9ybXVsYSA9IG5ld2Zvcm11bGE7XG5cdGxzdC5tb2RpZmllZCA9IG5ldyBEYXRlKCkgKyBcIlwiO1xuXHR0aGlzLl9zYXZlKCk7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIGRlbGV0ZXMgdGhlIHNwZWNpZmllZCBsaXN0XG4gICAgZGVsZXRlTGlzdCAobmFtZSkge1xuICAgICAgICBsZXQgbHN0ID0gdGhpcy5nZXQobmFtZSk7XG5cdGRlbGV0ZSB0aGlzLm5hbWUybGlzdFtuYW1lXTtcblx0dGhpcy5fc2F2ZSgpO1xuXHQvLyBGSVhNRTogdXNlIGV2ZW50cyEhXG5cdGlmIChsc3QgPT09IHRoaXMuYXBwLmdldEN1cnJlbnRMaXN0KCkpIHRoaXMuYXBwLnNldEN1cnJlbnRMaXN0KG51bGwpO1xuXHRpZiAobHN0ID09PSB0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QpIHRoaXMuYXBwLmxpc3RFZGl0b3IubGlzdCA9IG51bGw7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIGRlbGV0ZSBhbGwgbGlzdHNcbiAgICBwdXJnZSAoKSB7XG4gICAgICAgIHRoaXMubmFtZTJsaXN0ID0ge31cblx0dGhpcy5fc2F2ZSgpO1xuXHQvL1xuXHR0aGlzLmFwcC5zZXRDdXJyZW50TGlzdChudWxsKTtcblx0dGhpcy5hcHAubGlzdEVkaXRvci5saXN0ID0gbnVsbDsgLy8gRklYTUUgLSByZWFjaGFjcm9zc1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIHRydWUgaWZmIGV4cHIgaXMgdmFsaWQsIHdoaWNoIG1lYW5zIGl0IGlzIGJvdGggc3ludGFjdGljYWxseSBjb3JyZWN0IFxuICAgIC8vIGFuZCBhbGwgbWVudGlvbmVkIGxpc3RzIGV4aXN0LlxuICAgIGlzVmFsaWQgKGV4cHIpIHtcblx0cmV0dXJuIHRoaXMuZm9ybXVsYUV2YWwuaXNWYWxpZChleHByKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyB0aGUgXCJNeSBsaXN0c1wiIGJveCB3aXRoIHRoZSBjdXJyZW50bHkgYXZhaWxhYmxlIGxpc3RzLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICBuZXdsaXN0IChMaXN0KSBvcHRpb25hbC4gSWYgc3BlY2lmaWVkLCB3ZSBqdXN0IGNyZWF0ZWQgdGhhdCBsaXN0LCBhbmQgaXRzIG5hbWUgaXNcbiAgICAvLyAgIFx0YSBnZW5lcmF0ZWQgZGVmYXVsdC4gUGxhY2UgZm9jdXMgdGhlcmUgc28gdXNlciBjYW4gdHlwZSBuZXcgbmFtZS5cbiAgICB1cGRhdGUgKG5ld2xpc3QpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgbGlzdHMgPSB0aGlzLmdldEFsbCgpO1xuXHRsZXQgYnlOYW1lID0gKGEsYikgPT4ge1xuXHQgICAgbGV0IGFuID0gYS5uYW1lLnRvTG93ZXJDYXNlKCk7XG5cdCAgICBsZXQgYm4gPSBiLm5hbWUudG9Mb3dlckNhc2UoKTtcblx0ICAgIHJldHVybiAoYW4gPCBibiA/IC0xIDogYW4gPiBibiA/ICsxIDogMCk7XG5cdH07XG5cdGxldCBieURhdGUgPSAoYSxiKSA9PiAoKG5ldyBEYXRlKGIubW9kaWZpZWQpKS5nZXRUaW1lKCkgLSAobmV3IERhdGUoYS5tb2RpZmllZCkpLmdldFRpbWUoKSk7XG5cdGxpc3RzLnNvcnQoYnlOYW1lKTtcblx0bGV0IGl0ZW1zID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJsaXN0c1wiXScpLnNlbGVjdEFsbChcIi5saXN0SW5mb1wiKVxuXHQgICAgLmRhdGEobGlzdHMpO1xuXHRsZXQgbmV3aXRlbXMgPSBpdGVtcy5lbnRlcigpLmFwcGVuZChcImRpdlwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwibGlzdEluZm8gZmxleHJvd1wiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJpXCIpLmF0dHIoXCJjbGFzc1wiLFwibWF0ZXJpYWwtaWNvbnMgYnV0dG9uXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIixcImVkaXRcIilcblx0ICAgIC50ZXh0KFwibW9kZV9lZGl0XCIpXG5cdCAgICAuYXR0cihcInRpdGxlXCIsXCJFZGl0IHRoaXMgbGlzdC5cIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwic3BhblwiKS5hdHRyKFwibmFtZVwiLFwibmFtZVwiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJzcGFuXCIpLmF0dHIoXCJuYW1lXCIsXCJzaXplXCIpO1xuXHRuZXdpdGVtcy5hcHBlbmQoXCJzcGFuXCIpLmF0dHIoXCJuYW1lXCIsXCJkYXRlXCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcImlcIikuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29ucyBidXR0b25cIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLFwiZGVsZXRlXCIpXG5cdCAgICAudGV4dChcImhpZ2hsaWdodF9vZmZcIilcblx0ICAgIC5hdHRyKFwidGl0bGVcIixcIkRlbGV0ZSB0aGlzIGxpc3QuXCIpO1xuXG5cdGlmIChuZXdpdGVtc1swXVswXSkge1xuXHQgICAgbGV0IGxhc3QgPSBuZXdpdGVtc1swXVtuZXdpdGVtc1swXS5sZW5ndGgtMV07XG5cdCAgICBsYXN0LnNjcm9sbEludG9WaWV3KCk7XG5cdH1cblxuXHRpdGVtc1xuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGxzdD0+bHN0Lm5hbWUpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAobHN0KSB7XG5cdFx0aWYgKGQzLmV2ZW50LmFsdEtleSkge1xuXHRcdCAgICAvLyBhbHQtY2xpY2sgY29waWVzIHRoZSBsaXN0J3MgbmFtZSBpbnRvIHRoZSBmb3JtdWxhIGVkaXRvclxuXHRcdCAgICBsZXQgbGUgPSBzZWxmLmFwcC5saXN0RWRpdG9yOyAvLyBGSVhNRSByZWFjaG92ZXJcblx0XHQgICAgbGV0IHMgPSBsc3QubmFtZTtcblx0XHQgICAgbGV0IHJlID0gL1sgPSgpKyotXS87XG5cdFx0ICAgIGlmIChzLnNlYXJjaChyZSkgPj0gMClcblx0XHRcdHMgPSAnXCInICsgcyArICdcIic7XG5cdFx0ICAgIGlmICghbGUuaXNFZGl0aW5nRm9ybXVsYSkge1xuXHRcdCAgICAgICAgbGUub3BlbigpO1xuXHRcdFx0bGUub3BlbkZvcm11bGFFZGl0b3IoKTtcblx0XHQgICAgfVxuXHRcdCAgICAvL1xuXHRcdCAgICBsZS5hZGRUb0xpc3RFeHByKHMrJyAnKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZDMuZXZlbnQuc2hpZnRLZXkpIHtcblx0XHQgICAgLy8gc2hpZnQtY2xpY2sgZ29lcyB0byBuZXh0IGxpc3QgZWxlbWVudCBpZiBpdCdzIHRoZSBzYW1lIGxpc3QsXG5cdFx0ICAgIC8vIG9yIGVsc2Ugc2V0cyB0aGUgbGlzdCBhbmQgZ29lcyB0byB0aGUgZmlyc3QgZWxlbWVudC5cblx0XHQgICAgaWYgKHNlbGYuYXBwLmdldEN1cnJlbnRMaXN0KCkgIT09IGxzdClcblx0XHRcdHNlbGYuYXBwLnNldEN1cnJlbnRMaXN0KGxzdCwgdHJ1ZSk7XG5cdFx0ICAgIGVsc2Vcblx0XHRcdHNlbGYuYXBwLmdvVG9OZXh0TGlzdEVsZW1lbnQobHN0KTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIC8vIHBsYWluIGNsaWNrIHNldHMgdGhlIHNldCBpZiBpdCdzIGEgZGlmZmVyZW50IGxpc3QsXG5cdFx0ICAgIC8vIG9yIGVsc2UgdW5zZXRzIHRoZSBsaXN0LlxuXHRcdCAgICBpZiAoc2VsZi5hcHAuZ2V0Q3VycmVudExpc3QoKSAhPT0gbHN0KVxuXHRcdCAgICAgICAgc2VsZi5hcHAuc2V0Q3VycmVudExpc3QobHN0KTtcblx0XHQgICAgZWxzZVxuXHRcdCAgICAgICAgc2VsZi5hcHAuc2V0Q3VycmVudExpc3QobnVsbCk7XG5cdFx0fVxuXHQgICAgfSk7XG5cdGl0ZW1zLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZWRpdFwiXScpXG5cdCAgICAvLyBlZGl0OiBjbGljayBcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGxzdCkge1xuXHQgICAgICAgIHNlbGYuYXBwLmxpc3RFZGl0b3Iub3Blbihsc3QpO1xuXHQgICAgfSk7XG5cdGl0ZW1zLnNlbGVjdCgnc3BhbltuYW1lPVwibmFtZVwiXScpXG5cdCAgICAudGV4dChsc3QgPT4gbHN0Lm5hbWUpO1xuXHRpdGVtcy5zZWxlY3QoJ3NwYW5bbmFtZT1cImRhdGVcIl0nKS50ZXh0KGxzdCA9PiB7XG5cdCAgICBsZXQgbWQgPSBuZXcgRGF0ZShsc3QubW9kaWZpZWQpO1xuXHQgICAgbGV0IGQgPSBgJHttZC5nZXRGdWxsWWVhcigpfS0ke21kLmdldE1vbnRoKCkrMX0tJHttZC5nZXREYXRlKCl9IGAgXG5cdCAgICAgICAgICArIGA6JHttZC5nZXRIb3VycygpfS4ke21kLmdldE1pbnV0ZXMoKX0uJHttZC5nZXRTZWNvbmRzKCl9YDtcblx0ICAgIHJldHVybiBkO1xuXHR9KTtcblx0aXRlbXMuc2VsZWN0KCdzcGFuW25hbWU9XCJzaXplXCJdJykudGV4dChsc3QgPT4gbHN0Lmlkcy5sZW5ndGgpO1xuXHRpdGVtcy5zZWxlY3QoJy5idXR0b25bbmFtZT1cImRlbGV0ZVwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCBsc3QgPT4ge1xuXHQgICAgICAgIHRoaXMuZGVsZXRlTGlzdChsc3QubmFtZSk7XG5cdFx0dGhpcy51cGRhdGUoKTtcblxuXHRcdC8vIE5vdCBzdXJlIHdoeSB0aGlzIGlzIG5lY2Vzc2FyeSBoZXJlLiBCdXQgd2l0aG91dCBpdCwgdGhlIGxpc3QgaXRlbSBhZnRlciB0aGUgb25lIGJlaW5nXG5cdFx0Ly8gZGVsZXRlZCBoZXJlIHdpbGwgcmVjZWl2ZSBhIGNsaWNrIGV2ZW50LlxuXHRcdGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdC8vXG5cdCAgICB9KTtcblxuXHQvL1xuXHRpdGVtcy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGlmIChuZXdsaXN0KSB7XG5cdCAgICBsZXQgbHN0ZWx0ID0gXG5cdCAgICAgICAgZDMuc2VsZWN0KGAjbXlsaXN0cyBbbmFtZT1cImxpc3RzXCJdIFtuYW1lPVwiJHtuZXdsaXN0Lm5hbWV9XCJdYClbMF1bMF07XG4gICAgICAgICAgICBsc3RlbHQuc2Nyb2xsSW50b1ZpZXcoZmFsc2UpO1xuXHR9XG4gICAgfVxuXG59IC8vIGVuZCBjbGFzcyBMaXN0TWFuYWdlclxuXG5leHBvcnQgeyBMaXN0TWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdE1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IExpc3RGb3JtdWxhUGFyc2VyIH0gZnJvbSAnLi9MaXN0Rm9ybXVsYVBhcnNlcic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gS25vd3MgaG93IHRvIHBhcnNlIGFuZCBldmFsdWF0ZSBhIGxpc3QgZm9ybXVsYSAoYWthIGxpc3QgZXhwcmVzc2lvbikuXG5jbGFzcyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB7XG4gICAgY29uc3RydWN0b3IgKGxpc3RNYW5hZ2VyKSB7XG5cdHRoaXMubGlzdE1hbmFnZXIgPSBsaXN0TWFuYWdlcjtcbiAgICAgICAgdGhpcy5wYXJzZXIgPSBuZXcgTGlzdEZvcm11bGFQYXJzZXIoKTtcbiAgICB9XG4gICAgLy8gRXZhbHVhdGVzIHRoZSBleHByZXNzaW9uIGFuZCByZXR1cm5zIGEgUHJvbWlzZSBmb3IgdGhlIGxpc3Qgb2YgaWRzLlxuICAgIC8vIElmIHRoZXJlIGlzIGFuIGVycm9yLCB0aGUgcHJvbWlzZSByZWplY3RzIHdpdGggdGhlIGVycm9yIG1lc3NhZ2UuXG4gICAgZXZhbCAoZXhwcikge1xuXHQgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHQgICAgIHRyeSB7XG5cdFx0bGV0IGFzdCA9IHRoaXMucGFyc2VyLnBhcnNlKGV4cHIpO1xuXHRcdGxldCBsbSA9IHRoaXMubGlzdE1hbmFnZXI7XG5cdFx0bGV0IHJlYWNoID0gKG4pID0+IHtcblx0XHQgICAgaWYgKHR5cGVvZihuKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0bGV0IGxzdCA9IGxtLmdldChuKTtcblx0XHRcdGlmICghbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuO1xuXHRcdFx0cmV0dXJuIG5ldyBTZXQobHN0Lmlkcyk7XG5cdFx0ICAgIH1cblx0XHQgICAgZWxzZSB7XG5cdFx0XHRsZXQgbCA9IHJlYWNoKG4ubGVmdCk7XG5cdFx0XHRsZXQgciA9IHJlYWNoKG4ucmlnaHQpO1xuXHRcdFx0cmV0dXJuIGxbbi5vcF0ocik7XG5cdFx0ICAgIH1cblx0XHR9XG5cdFx0bGV0IGlkcyA9IHJlYWNoKGFzdCk7XG5cdFx0cmVzb2x2ZShBcnJheS5mcm9tKGlkcykpO1xuXHQgICAgfVxuXHQgICAgY2F0Y2ggKGUpIHtcblx0XHRyZWplY3QoZSk7XG5cdCAgICB9XG5cdCB9LmJpbmQodGhpcykpO1xuICAgIH1cbiAgICAvLyBDaGVja3MgdGhlIGN1cnJlbnQgZXhwcmVzc2lvbiBmb3Igc3ludGFjdGljIGFuZCBzZW1hbnRpYyB2YWxpZGl0eSBhbmQgc2V0cyB0aGUgXG4gICAgLy8gdmFsaWQvaW52YWxpZCBjbGFzcyBhY2NvcmRpbmdseS4gU2VtYW50aWMgdmFsaWRpdHkgc2ltcGx5IG1lYW5zIGFsbCBuYW1lcyBpbiB0aGVcbiAgICAvLyBleHByZXNzaW9uIGFyZSBib3VuZC5cbiAgICAvL1xuICAgIGlzVmFsaWQgIChleHByKSB7XG5cdHRyeSB7XG5cdCAgICAvLyBmaXJzdCBjaGVjayBzeW50YXhcblx0ICAgIGxldCBhc3QgPSB0aGlzLnBhcnNlci5wYXJzZShleHByKTtcblx0ICAgIGxldCBsbSAgPSB0aGlzLmxpc3RNYW5hZ2VyOyBcblx0ICAgIC8vIG5vdyBjaGVjayBsaXN0IG5hbWVzXG5cdCAgICAoZnVuY3Rpb24gcmVhY2gobikge1xuXHRcdGlmICh0eXBlb2YobikgPT09IFwic3RyaW5nXCIpIHtcblx0XHQgICAgbGV0IGxzdCA9IGxtLmdldChuKTtcblx0XHQgICAgaWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIHJlYWNoKG4ubGVmdCk7XG5cdFx0ICAgIHJlYWNoKG4ucmlnaHQpO1xuXHRcdH1cblx0ICAgIH0pKGFzdCk7XG5cblx0ICAgIC8vIFRodW1icyB1cCFcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9XG5cdGNhdGNoIChlKSB7XG5cdCAgICAvLyBzeW50YXggZXJyb3Igb3IgdW5rbm93biBsaXN0IG5hbWVcblx0ICAgIHJldHVybiBmYWxzZTtcblx0fVxuICAgIH1cbn1cblxuZXhwb3J0IHsgTGlzdEZvcm11bGFFdmFsdWF0b3IgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0xpc3RGb3JtdWxhRXZhbHVhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBzZXRDYXJldFBvc2l0aW9uLCBtb3ZlQ2FyZXRQb3NpdGlvbiwgZ2V0Q2FyZXRSYW5nZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfSBmcm9tICcuL0xpc3RGb3JtdWxhUGFyc2VyJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBMaXN0RWRpdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcblx0c3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLnBhcnNlciA9IG5ldyBMaXN0Rm9ybXVsYVBhcnNlcigpO1xuXHR0aGlzLmZvcm0gPSBudWxsO1xuXHR0aGlzLmluaXREb20oKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gZmFsc2U7XG5cdC8vXG5cdHRoaXMubGlzdCA9IG51bGw7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdHRoaXMuZm9ybSA9IHRoaXMucm9vdC5zZWxlY3QoXCJmb3JtXCIpWzBdWzBdO1xuXHRpZiAoIXRoaXMuZm9ybSkgdGhyb3cgXCJDb3VsZCBub3QgaW5pdCBMaXN0RWRpdG9yLiBObyBmb3JtIGVsZW1lbnQuXCI7XG5cdGQzLnNlbGVjdCh0aGlzLmZvcm0pXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IHQgPSBkMy5ldmVudC50YXJnZXQ7XG5cdFx0aWYgKFwiYnV0dG9uXCIgPT09IHQudGFnTmFtZS50b0xvd2VyQ2FzZSgpKXtcblx0XHQgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQgICAgbGV0IGYgPSB0aGlzLmZvcm07XG5cdFx0ICAgIGxldCBzID0gZi5pZHMudmFsdWUucmVwbGFjZSgvWyx8XS9nLCAnICcpLnRyaW0oKTtcblx0XHQgICAgbGV0IGlkcyA9IHMgPyBzLnNwbGl0KC9cXHMrLykgOiBbXTtcblx0XHQgICAgLy8gc2F2ZSBsaXN0XG5cdFx0ICAgIGlmICh0Lm5hbWUgPT09IFwic2F2ZVwiKSB7XG5cdFx0XHRpZiAoIXRoaXMubGlzdCkgcmV0dXJuO1xuXHRcdFx0dGhpcy5saXN0ID0gdGhpcy5hcHAubGlzdE1hbmFnZXIudXBkYXRlTGlzdCh0aGlzLmxpc3QubmFtZSwgZi5uYW1lLnZhbHVlLCBpZHMsIGYuZm9ybXVsYS52YWx1ZSk7XG5cdFx0XHR0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGUodGhpcy5saXN0KTtcblx0XHQgICAgfVxuXHRcdCAgICAvLyBjcmVhdGUgbmV3IGxpc3Rcblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcIm5ld1wiKSB7XG5cdFx0XHRsZXQgbiA9IGYubmFtZS52YWx1ZS50cmltKCk7XG5cdFx0XHRpZiAoIW4pIHtcblx0XHRcdCAgIGFsZXJ0KFwiWW91ciBsaXN0IGhhcyBubyBuYW1lIGFuZCBpcyB2ZXJ5IHNhZC4gUGxlYXNlIGdpdmUgaXQgYSBuYW1lIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdFx0ICAgcmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChuLmluZGV4T2YoJ1wiJykgPj0gMCkge1xuXHRcdFx0ICAgYWxlcnQoXCJPaCBkZWFyLCB5b3VyIGxpc3QncyBuYW1lIGhhcyBhIGRvdWJsZSBxdW90ZSBjaGFyYWN0ZXIsIGFuZCBJJ20gYWZhcmFpZCB0aGF0J3Mgbm90IGFsbG93ZWQuIFBsZWFzZSByZW1vdmUgdGhlICdcXFwiJyBhbmQgdHJ5IGFnYWluLlwiKTtcblx0XHRcdCAgIHJldHVyblxuXHRcdFx0fVxuXHRcdCAgICAgICAgdGhpcy5saXN0ID0gdGhpcy5hcHAubGlzdE1hbmFnZXIuY3JlYXRlTGlzdChuLCBpZHMsIGYuZm9ybXVsYS52YWx1ZSk7XG5cdFx0XHR0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGUodGhpcy5saXN0KTtcblx0XHQgICAgfVxuXHRcdCAgICAvLyBjbGVhciBmb3JtXG5cdFx0ICAgIGVsc2UgaWYgKHQubmFtZSA9PT0gXCJjbGVhclwiKSB7XG5cdFx0ICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGZvcndhcmQgdG8gTUdJXG5cdFx0ICAgIGVsc2UgaWYgKHQubmFtZSA9PT0gXCJ0b01naVwiKSB7XG5cdFx0ICAgICAgICBsZXQgZnJtID0gZDMuc2VsZWN0KCcjbWdpYmF0Y2hmb3JtJylbMF1bMF07XG5cdFx0XHRmcm0uaWRzLnZhbHVlID0gaWRzLmpvaW4oXCIgXCIpO1xuXHRcdFx0ZnJtLnN1Ym1pdCgpXG5cdFx0ICAgIH1cblx0XHQgICAgLy8gZm9yd2FyZCB0byBNb3VzZU1pbmVcblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcInRvTW91c2VNaW5lXCIpIHtcblx0XHQgICAgICAgIGxldCBmcm0gPSBkMy5zZWxlY3QoJyNtb3VzZW1pbmVmb3JtJylbMF1bMF07XG5cdFx0XHRmcm0uZXh0ZXJuYWxpZHMudmFsdWUgPSBpZHMuam9pbihcIixcIik7XG5cdFx0XHRmcm0uc3VibWl0KClcblx0XHQgICAgfVxuXHRcdH1cblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbjogc2hvdy9oaWRlIGZvcm11bGEgZWRpdG9yXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiaWRzZWN0aW9uXCJdIC5idXR0b25bbmFtZT1cImVkaXRmb3JtdWxhXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlRm9ybXVsYUVkaXRvcigpKTtcblx0ICAgIFxuXHQvLyBJbnB1dCBib3g6IGZvcm11bGE6IHZhbGlkYXRlIG9uIGFueSBpbnB1dFxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gW25hbWU9XCJmb3JtdWxhXCJdJylcblx0ICAgIC5vbihcImlucHV0XCIsICgpID0+IHtcblx0ICAgICAgICB0aGlzLnZhbGlkYXRlRXhwcigpO1xuXHQgICAgfSk7XG5cblx0Ly8gRm9yd2FyZCAtPiBNR0kvTW91c2VNaW5lOiBkaXNhYmxlIGJ1dHRvbnMgaWYgbm8gaWRzXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiaWRzXCJdJylcblx0ICAgIC5vbihcImlucHV0XCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgZW1wdHkgPSB0aGlzLmZvcm0uaWRzLnZhbHVlLnRyaW0oKS5sZW5ndGggPT09IDA7XG5cdFx0dGhpcy5mb3JtLnRvTWdpLmRpc2FibGVkID0gdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkID0gZW1wdHk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b25zOiB0aGUgbGlzdCBvcGVyYXRvciBidXR0b25zICh1bmlvbiwgaW50ZXJzZWN0aW9uLCBldGMuKVxuXHR0aGlzLnJvb3Quc2VsZWN0QWxsKCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gLmJ1dHRvbi5saXN0b3AnKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdC8vIGFkZCBteSBzeW1ib2wgdG8gdGhlIGZvcm11bGFcblx0XHRsZXQgaW5lbHQgPSBzZWxmLmZvcm0uZm9ybXVsYTtcblx0XHRsZXQgb3AgPSBkMy5zZWxlY3QodGhpcykuYXR0cihcIm5hbWVcIik7XG5cdFx0c2VsZi5hZGRUb0xpc3RFeHByKG9wKTtcblx0XHRzZWxmLnZhbGlkYXRlRXhwcigpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiByZWZyZXNoIGJ1dHRvbiBmb3IgcnVubmluZyB0aGUgZm9ybXVsYVxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gLmJ1dHRvbltuYW1lPVwicmVmcmVzaFwiXScpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0bGV0IGVtZXNzYWdlPVwiSSdtIHRlcnJpYmx5IHNvcnJ5LCBidXQgdGhlcmUgYXBwZWFycyB0byBiZSBhIHByb2JsZW0gd2l0aCB5b3VyIGxpc3QgZXhwcmVzc2lvbjogXCI7XG5cdFx0bGV0IGZvcm11bGEgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZS50cmltKCk7XG5cdFx0aWYgKGZvcm11bGEubGVuZ3RoID09PSAwKVxuXHRcdCAgICByZXR1cm47XG5cdCAgICAgICAgdGhpcy5hcHAubGlzdE1hbmFnZXJcblx0XHQgICAgLmV2YWxGb3JtdWxhKGZvcm11bGEpXG5cdFx0ICAgIC50aGVuKGlkcyA9PiB7XG5cdFx0ICAgICAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gaWRzLmpvaW4oXCJcXG5cIik7XG5cdFx0ICAgICB9KVxuXHRcdCAgICAuY2F0Y2goZSA9PiBhbGVydChlbWVzc2FnZSArIGUpKTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbjogY2xvc2UgZm9ybXVsYSBlZGl0b3Jcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIC5idXR0b25bbmFtZT1cImNsb3NlXCJdJylcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsICgpID0+IHRoaXMuY2xvc2VGb3JtdWxhRWRpdG9yKCkgKTtcblx0XG5cdC8vIENsaWNraW5nIHRoZSBib3ggY29sbGFwc2UgYnV0dG9uIHNob3VsZCBjbGVhciB0aGUgZm9ybVxuXHR0aGlzLnJvb3Quc2VsZWN0KFwiLmJ1dHRvbi5jbG9zZVwiKVxuXHQgICAgLm9uKFwiY2xpY2suZXh0cmFcIiwgKCkgPT4ge1xuXHQgICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG5cdFx0dGhpcy5jbG9zZUZvcm11bGFFZGl0b3IoKTtcblx0ICAgIH0pO1xuICAgIH1cbiAgICBwYXJzZUlkcyAocykge1xuXHRyZXR1cm4gcy5yZXBsYWNlKC9bLHxdL2csICcgJykudHJpbSgpLnNwbGl0KC9cXHMrLyk7XG4gICAgfVxuICAgIGdldCBsaXN0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3Q7XG4gICAgfVxuICAgIHNldCBsaXN0IChsc3QpIHtcbiAgICAgICAgdGhpcy5fbGlzdCA9IGxzdDtcblx0dGhpcy5fc3luY0Rpc3BsYXkoKTtcbiAgICB9XG4gICAgX3N5bmNEaXNwbGF5ICgpIHtcblx0bGV0IGxzdCA9IHRoaXMuX2xpc3Q7XG5cdGlmICghbHN0KSB7XG5cdCAgICB0aGlzLmZvcm0ubmFtZS52YWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5mb3JtLmlkcy52YWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IGZhbHNlO1xuXHQgICAgdGhpcy5mb3JtLm1vZGlmaWVkLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5mb3JtLnNhdmUuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5mb3JtLnRvTWdpLmRpc2FibGVkID0gdHJ1ZTtcblx0ICAgIHRoaXMuZm9ybS50b01vdXNlTWluZS5kaXNhYmxlZCA9IHRydWU7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICB0aGlzLmZvcm0ubmFtZS52YWx1ZSA9IGxzdC5uYW1lO1xuXHQgICAgdGhpcy5mb3JtLmlkcy52YWx1ZSA9IGxzdC5pZHMuam9pbignXFxuJyk7XG5cdCAgICB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZSA9IGxzdC5mb3JtdWxhIHx8IFwiXCI7XG5cdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gdGhpcy5mb3JtLmZvcm11bGEudmFsdWUudHJpbSgpLmxlbmd0aCA+IDA7XG5cdCAgICB0aGlzLmZvcm0ubW9kaWZpZWQudmFsdWUgPSBsc3QubW9kaWZpZWQ7XG5cdCAgICB0aGlzLmZvcm0uc2F2ZS5kaXNhYmxlZCA9IGZhbHNlO1xuXHQgICAgdGhpcy5mb3JtLnRvTWdpLmRpc2FibGVkIFxuXHQgICAgICA9IHRoaXMuZm9ybS50b01vdXNlTWluZS5kaXNhYmxlZCBcblx0ICAgICAgICA9ICh0aGlzLmZvcm0uaWRzLnZhbHVlLnRyaW0oKS5sZW5ndGggPT09IDApO1xuXHR9XG5cdHRoaXMudmFsaWRhdGVFeHByKCk7XG4gICAgfVxuICAgIGNsZWFyICgpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcbiAgICB9XG4gICAgb3BlbiAobHN0KSB7XG4gICAgICAgIHRoaXMubGlzdCA9IGxzdDtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIiwgZmFsc2UpO1xuICAgIH1cbiAgICBjbG9zZSAoKSB7XG4gICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG5cdHRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIsIHRydWUpO1xuICAgIH1cbiAgICBvcGVuRm9ybXVsYUVkaXRvciAoKSB7XG5cdHRoaXMucm9vdC5jbGFzc2VkKFwiZWRpdGluZ2Zvcm11bGFcIiwgdHJ1ZSk7XG5cdHRoaXMuaXNFZGl0aW5nRm9ybXVsYSA9IHRydWU7XG5cdGxldCBmID0gdGhpcy5mb3JtLmZvcm11bGEudmFsdWU7XG5cdHRoaXMuZm9ybS5mb3JtdWxhLmZvY3VzKCk7XG5cdHNldENhcmV0UG9zaXRpb24odGhpcy5mb3JtLmZvcm11bGEsIGYubGVuZ3RoKTtcbiAgICB9XG4gICAgY2xvc2VGb3JtdWxhRWRpdG9yICgpIHtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJlZGl0aW5nZm9ybXVsYVwiLCBmYWxzZSk7XG5cdHRoaXMuaXNFZGl0aW5nRm9ybXVsYSA9IGZhbHNlO1xuICAgIH1cbiAgICB0b2dnbGVGb3JtdWxhRWRpdG9yICgpIHtcblx0bGV0IHNob3dpbmcgPSB0aGlzLnJvb3QuY2xhc3NlZChcImVkaXRpbmdmb3JtdWxhXCIpO1xuXHRzaG93aW5nID8gdGhpcy5jbG9zZUZvcm11bGFFZGl0b3IoKSA6IHRoaXMub3BlbkZvcm11bGFFZGl0b3IoKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ2hlY2tzIHRoZSBjdXJyZW50IGV4cHJlc3Npb24gYW5kIHNldHMgdGhlIHZhbGlkL2ludmFsaWQgY2xhc3MuXG4gICAgdmFsaWRhdGVFeHByICAoKSB7XG5cdGxldCBpbnAgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gW25hbWU9XCJmb3JtdWxhXCJdJyk7XG5cdGxldCBleHByID0gaW5wWzBdWzBdLnZhbHVlLnRyaW0oKTtcblx0aWYgKCFleHByKSB7XG5cdCAgICBpbnAuY2xhc3NlZChcInZhbGlkXCIsZmFsc2UpLmNsYXNzZWQoXCJpbnZhbGlkXCIsZmFsc2UpO1xuIFx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSBmYWxzZTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIGxldCBpc1ZhbGlkID0gdGhpcy5hcHAubGlzdE1hbmFnZXIuaXNWYWxpZChleHByKTsgLy8gRklYTUUgLSByZWFjaG92ZXJcblx0ICAgIGlucC5jbGFzc2VkKFwidmFsaWRcIiwgaXNWYWxpZCkuY2xhc3NlZChcImludmFsaWRcIiwgIWlzVmFsaWQpO1xuIFx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSB0cnVlO1xuXHR9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGFkZFRvTGlzdEV4cHIgKHRleHQpIHtcblx0bGV0IGlucCA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKTtcblx0bGV0IGllbHQgPSBpbnBbMF1bMF07XG5cdGxldCB2ID0gaWVsdC52YWx1ZTtcblx0bGV0IHNwbGljZSA9IGZ1bmN0aW9uIChlLHQpe1xuXHQgICAgbGV0IHYgPSBlLnZhbHVlO1xuXHQgICAgbGV0IHIgPSBnZXRDYXJldFJhbmdlKGUpO1xuXHQgICAgZS52YWx1ZSA9IHYuc2xpY2UoMCxyWzBdKSArIHQgKyB2LnNsaWNlKHJbMV0pO1xuXHQgICAgc2V0Q2FyZXRQb3NpdGlvbihlLCByWzBdK3QubGVuZ3RoKTtcblx0ICAgIGUuZm9jdXMoKTtcblx0fVxuXHRsZXQgcmFuZ2UgPSBnZXRDYXJldFJhbmdlKGllbHQpO1xuXHRpZiAocmFuZ2VbMF0gPT09IHJhbmdlWzFdKSB7XG5cdCAgICAvLyBubyBjdXJyZW50IHNlbGVjdGlvblxuXHQgICAgc3BsaWNlKGllbHQsIHRleHQpO1xuXHQgICAgaWYgKHRleHQgPT09IFwiKClcIikgXG5cdFx0bW92ZUNhcmV0UG9zaXRpb24oaWVsdCwgLTEpO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgLy8gdGhlcmUgaXMgYSBjdXJyZW50IHNlbGVjdGlvblxuXHQgICAgaWYgKHRleHQgPT09IFwiKClcIilcblx0XHQvLyBzdXJyb3VuZCBjdXJyZW50IHNlbGVjdGlvbiB3aXRoIHBhcmVucywgdGhlbiBtb3ZlIGNhcmV0IGFmdGVyXG5cdFx0dGV4dCA9ICcoJyArIHYuc2xpY2UocmFuZ2VbMF0scmFuZ2VbMV0pICsgJyknO1xuXHQgICAgc3BsaWNlKGllbHQsIHRleHQpXG5cdH1cblx0dGhpcy52YWxpZGF0ZUV4cHIoKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBMaXN0RWRpdG9yXG5cbmV4cG9ydCB7IExpc3RFZGl0b3IgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0xpc3RFZGl0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEZhY2V0IH0gZnJvbSAnLi9GYWNldCc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgRmFjZXRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwKSB7XG5cdHRoaXMuYXBwID0gYXBwO1xuXHR0aGlzLmZhY2V0cyA9IFtdO1xuXHR0aGlzLm5hbWUyZmFjZXQgPSB7fVxuICAgIH1cbiAgICBhZGRGYWNldCAobmFtZSwgdmFsdWVGY24pIHtcblx0aWYgKHRoaXMubmFtZTJmYWNldFtuYW1lXSkgdGhyb3cgXCJEdXBsaWNhdGUgZmFjZXQgbmFtZS4gXCIgKyBuYW1lO1xuXHRsZXQgZmFjZXQgPSBuZXcgRmFjZXQobmFtZSwgdGhpcywgdmFsdWVGY24pO1xuICAgICAgICB0aGlzLmZhY2V0cy5wdXNoKCBmYWNldCApO1xuXHR0aGlzLm5hbWUyZmFjZXRbbmFtZV0gPSBmYWNldDtcblx0cmV0dXJuIGZhY2V0XG4gICAgfVxuICAgIHRlc3QgKGYpIHtcbiAgICAgICAgbGV0IHZhbHMgPSB0aGlzLmZhY2V0cy5tYXAoIGZhY2V0ID0+IGZhY2V0LnRlc3QoZikgKTtcblx0cmV0dXJuIHZhbHMucmVkdWNlKChhY2N1bSwgdmFsKSA9PiBhY2N1bSAmJiB2YWwsIHRydWUpO1xuICAgIH1cbiAgICBhcHBseUFsbCAoKSB7XG5cdGxldCBzaG93ID0gbnVsbDtcblx0bGV0IGhpZGUgPSBcIm5vbmVcIjtcblx0Ly8gRklYTUU6IG1ham9yIHJlYWNob3ZlclxuXHR0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcImcuc3RyaXBzXCIpLnNlbGVjdEFsbCgnLmZlYXR1cmUnKVxuXHQgICAgLnN0eWxlKFwiZGlzcGxheVwiLCBmID0+IHRoaXMudGVzdChmKSA/IHNob3cgOiBoaWRlKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBGYWNldE1hbmFnZXJcblxuZXhwb3J0IHsgRmFjZXRNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GYWNldE1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgRmFjZXQge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lLCBtYW5hZ2VyLCB2YWx1ZUZjbikge1xuXHR0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXHR0aGlzLnZhbHVlcyA9IFtdO1xuXHR0aGlzLnZhbHVlRmNuID0gdmFsdWVGY247XG4gICAgfVxuICAgIHNldFZhbHVlcyAodmFsdWVzLCBxdWlldGx5KSB7XG4gICAgICAgIHRoaXMudmFsdWVzID0gdmFsdWVzO1xuXHRpZiAoISBxdWlldGx5KSB7XG5cdCAgICB0aGlzLm1hbmFnZXIuYXBwbHlBbGwoKTtcblx0ICAgIHRoaXMubWFuYWdlci5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH1cbiAgICB9XG4gICAgdGVzdCAoZikge1xuICAgICAgICByZXR1cm4gIXRoaXMudmFsdWVzIHx8IHRoaXMudmFsdWVzLmxlbmd0aCA9PT0gMCB8fCB0aGlzLnZhbHVlcy5pbmRleE9mKCB0aGlzLnZhbHVlRmNuKGYpICkgPj0gMDtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBGYWNldFxuXG5leHBvcnQgeyBGYWNldCB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmFjZXQuanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGQzdHN2IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBCbG9ja1RyYW5zbGF0b3IgfSBmcm9tICcuL0Jsb2NrVHJhbnNsYXRvcic7XG5pbXBvcnQgeyBLZXlTdG9yZSB9IGZyb20gJy4vS2V5U3RvcmUnO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEJsb2NrVHJhbnNsYXRvciBtYW5hZ2VyIGNsYXNzLiBGb3IgYW55IGdpdmVuIHBhaXIgb2YgZ2Vub21lcywgQSBhbmQgQiwgbG9hZHMgdGhlIHNpbmdsZSBibG9jayBmaWxlXG4vLyBmb3IgdHJhbnNsYXRpbmcgYmV0d2VlbiB0aGVtLCBhbmQgaW5kZXhlcyBpdCBcImZyb20gYm90aCBkaXJlY3Rpb25zXCI6XG4vLyBcdEEtPkItPiBbQUJfQmxvY2tGaWxlXSA8LUE8LUJcbi8vXG5jbGFzcyBCVE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG5cdHRoaXMucmNCbG9ja3MgPSB7fTtcblx0dGhpcy5ibG9ja1N0b3JlID0gbmV3IEtleVN0b3JlKCdzeW50ZW55LWJsb2NrcycpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlZ2lzdGVyQmxvY2tzIChhR2Vub21lLCBiR2Vub21lLCBibG9ja3MpIHtcblx0bGV0IGFuYW1lID0gYUdlbm9tZS5uYW1lO1xuXHRsZXQgYm5hbWUgPSBiR2Vub21lLm5hbWU7XG5cdGNvbnNvbGUubG9nKGBSZWdpc3RlcmluZyBibG9ja3M6ICR7YW5hbWV9IHZzICR7Ym5hbWV9YCwgYmxvY2tzKTtcblx0bGV0IGJsa0ZpbGUgPSBuZXcgQmxvY2tUcmFuc2xhdG9yKGFHZW5vbWUsYkdlbm9tZSxibG9ja3MpO1xuXHRpZiggISB0aGlzLnJjQmxvY2tzW2FuYW1lXSkgdGhpcy5yY0Jsb2Nrc1thbmFtZV0gPSB7fTtcblx0aWYoICEgdGhpcy5yY0Jsb2Nrc1tibmFtZV0pIHRoaXMucmNCbG9ja3NbYm5hbWVdID0ge307XG5cdHRoaXMucmNCbG9ja3NbYW5hbWVdW2JuYW1lXSA9IGJsa0ZpbGU7XG5cdHRoaXMucmNCbG9ja3NbYm5hbWVdW2FuYW1lXSA9IGJsa0ZpbGU7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gTG9hZHMgdGhlIHN5bnRlbnkgYmxvY2sgZmlsZSBmb3IgZ2Vub21lcyBhR2Vub21lIGFuZCBiR2Vub21lLlxuICAgIC8vIFxuICAgIGdldEJsb2NrRmlsZSAoYUdlbm9tZSwgYkdlbm9tZSkge1xuXHQvLyBCZSBhIGxpdHRsZSBzbWFydCBhYm91dCB0aGUgb3JkZXIgd2UgdHJ5IHRoZSBuYW1lcy4uLlxuXHRpZiAoYkdlbm9tZS5uYW1lIDwgYUdlbm9tZS5uYW1lKSB7XG5cdCAgICBsZXQgdG1wID0gYUdlbm9tZTsgYUdlbm9tZSA9IGJHZW5vbWU7IGJHZW5vbWUgPSB0bXA7XG5cdH1cblx0Ly8gRmlyc3QsIHNlZSBpZiB3ZSBhbHJlYWR5IGhhdmUgdGhpcyBwYWlyXG5cdGxldCBhbmFtZSA9IGFHZW5vbWUubmFtZTtcblx0bGV0IGJuYW1lID0gYkdlbm9tZS5uYW1lO1xuXHRsZXQgYmYgPSAodGhpcy5yY0Jsb2Nrc1thbmFtZV0gfHwge30pW2JuYW1lXTtcblx0aWYgKGJmKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShiZik7XG5cdFxuXHQvLyBTZWNvbmQsIHRyeSBsb2NhbCBkaXNrIGNhY2hlXG5cdGxldCBrZXkgPSBhbmFtZSArICctJyArIGJuYW1lO1xuXHRyZXR1cm4gdGhpcy5ibG9ja1N0b3JlLmdldChrZXkpLnRoZW4oZGF0YSA9PiB7XG5cdCAgICBpZiAoZGF0YSkge1xuXHRcdGNvbnNvbGUubG9nKFwiRm91bmQgYmxvY2tzIGluIGNhY2hlLlwiKTtcblx0ICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RlckJsb2NrcyhhR2Vub21lLCBiR2Vub21lLCBkYXRhKTtcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYgKHRoaXMuc2VydmVyUmVxdWVzdCkge1xuXHQgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFuIG91dHN0YW5kaW5nIHJlcXVlc3QsIHdhaXQgdW50aWwgaXQncyBkb25lIGFuZCB0cnkgYWdhaW4uXG5cdFx0dGhpcy5zZXJ2ZXJSZXF1ZXN0LnRoZW4oKCk9PnRoaXMuZ2V0QmxvY2tGaWxlKGFHZW5vbWUsIGJHZW5vbWUpKTtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHRcdC8vIFRoaXJkLCBsb2FkIGZyb20gc2VydmVyLlxuXHRcdGxldCBmbiA9IGAuL2RhdGEvZ2Vub21lZGF0YS9ibG9ja3MudHN2YFxuXHRcdGNvbnNvbGUubG9nKFwiUmVxdWVzdGluZyBibG9jayBmaWxlIGZyb206IFwiICsgZm4pO1xuXHRcdHRoaXMuc2VydmVyUmVxdWVzdCA9IGQzdHN2KGZuKS50aGVuKGJsb2NrcyA9PiB7XG5cdFx0ICAgIGxldCByYnMgPSBibG9ja3MucmVkdWNlKCAoYSxiKSA9PiB7XG5cdFx0ICAgIGxldCBrID0gYi5hR2Vub21lICsgJy0nICsgYi5iR2Vub21lO1xuXHRcdCAgICBpZiAoIShrIGluIGEpKSBhW2tdID0gW107XG5cdFx0ICAgICAgICBhW2tdLnB1c2goYik7XG5cdFx0XHRyZXR1cm4gYTtcblx0XHQgICAgfSwge30pO1xuXHRcdCAgICBmb3IgKGxldCBuIGluIHJicykge1xuXHRcdCAgICAgICAgdGhpcy5ibG9ja1N0b3JlLnNldChuLCByYnNbbl0pO1xuXHRcdCAgICB9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXMuc2VydmVyUmVxdWVzdDtcblx0ICAgIH1cblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiB0aGUgdHJhbnNsYXRvciBoYXMgbG9hZGVkIGFsbCB0aGUgZGF0YSBuZWVkZWRcbiAgICAvLyBmb3IgdHJhbnNsYXRpbmcgY29vcmRpbmF0ZXMgYmV0d2VlbiB0aGUgY3VycmVudCByZWYgc3RyYWluIGFuZCB0aGUgY3VycmVudCBjb21wYXJpc29uIHN0cmFpbnMuXG4gICAgLy9cbiAgICByZWFkeSAoKSB7XG5cdGxldCBwcm9taXNlcyA9IHRoaXMuYXBwLmNHZW5vbWVzLm1hcChjZyA9PiB0aGlzLmdldEJsb2NrRmlsZSh0aGlzLmFwcC5yR2Vub21lLCBjZykpO1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgc3ludGVueSBibG9jayB0cmFuc2xhdG9yIHRoYXQgbWFwcyB0aGUgY3VycmVudCByZWYgZ2Vub21lIHRvIHRoZSBzcGVjaWZpZWQgY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy9cbiAgICBnZXRCbG9ja3MgKGZyb21HZW5vbWUsIHRvR2Vub21lKSB7XG4gICAgICAgIGxldCBibGtUcmFucyA9IHRoaXMucmNCbG9ja3NbZnJvbUdlbm9tZS5uYW1lXVt0b0dlbm9tZS5uYW1lXTtcblx0cmV0dXJuIGJsa1RyYW5zLmdldEJsb2Nrcyhmcm9tR2Vub21lKVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFRyYW5zbGF0ZXMgdGhlIGdpdmVuIGNvb3JkaW5hdGUgcmFuZ2UgZnJvbSB0aGUgc3BlY2lmaWVkIGZyb21HZW5vbWUgdG8gdGhlIHNwZWNpZmllZCB0b0dlbm9tZS5cbiAgICAvLyBSZXR1cm5zIGEgbGlzdCBvZiB6ZXJvIG9yIG1vcmUgY29vcmRpbmF0ZSByYW5nZXMgaW4gdGhlIHRvR2Vub21lLlxuICAgIC8vXG4gICAgdHJhbnNsYXRlIChmcm9tR2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQsIHRvR2Vub21lLCBpbnZlcnRlZCkge1xuXHQvLyBnZXQgdGhlIHJpZ2h0IGJsb2NrIGZpbGVcblx0bGV0IGJsa1RyYW5zID0gdGhpcy5yY0Jsb2Nrc1tmcm9tR2Vub21lLm5hbWVdW3RvR2Vub21lLm5hbWVdO1xuXHRpZiAoIWJsa1RyYW5zKSB0aHJvdyBcIkludGVybmFsIGVycm9yLiBObyBibG9jayBmaWxlIGZvdW5kIGluIGluZGV4LlwiXG5cdC8vIHRyYW5zbGF0ZSFcblx0bGV0IHJhbmdlcyA9IGJsa1RyYW5zLnRyYW5zbGF0ZShmcm9tR2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQsIGludmVydGVkKTtcblx0cmV0dXJuIHJhbmdlcztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJDYWNoZWREYXRhICgpIHtcblx0Y29uc29sZS5sb2coXCJCVE1hbmFnZXI6IENhY2hlIGNsZWFyZWQuXCIpXG4gICAgICAgIHJldHVybiB0aGlzLmJsb2NrU3RvcmUuY2xlYXIoKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBCVE1hbmFnZXJcblxuZXhwb3J0IHsgQlRNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9CVE1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU29tZXRoaW5nIHRoYXQga25vd3MgaG93IHRvIHRyYW5zbGF0ZSBjb29yZGluYXRlcyBiZXR3ZWVuIHR3byBnZW5vbWVzLlxuLy9cbi8vXG5jbGFzcyBCbG9ja1RyYW5zbGF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKGFHZW5vbWUsIGJHZW5vbWUsIGJsb2Nrcyl7XG5cdHRoaXMuYUdlbm9tZSA9IGFHZW5vbWU7XG5cdHRoaXMuYkdlbm9tZSA9IGJHZW5vbWU7XG5cdHRoaXMuYmxvY2tzID0gYmxvY2tzLm1hcChiID0+IHRoaXMucHJvY2Vzc0Jsb2NrKGIpKVxuXHR0aGlzLmN1cnJTb3J0ID0gXCJhXCI7IC8vIGVpdGhlciAnYScgb3IgJ2InXG4gICAgfVxuICAgIHByb2Nlc3NCbG9jayAoYmxrKSB7IFxuICAgICAgICBibGsuYUluZGV4ID0gcGFyc2VJbnQoYmxrLmFJbmRleCk7XG4gICAgICAgIGJsay5iSW5kZXggPSBwYXJzZUludChibGsuYkluZGV4KTtcbiAgICAgICAgYmxrLmFTdGFydCA9IHBhcnNlSW50KGJsay5hU3RhcnQpO1xuICAgICAgICBibGsuYlN0YXJ0ID0gcGFyc2VJbnQoYmxrLmJTdGFydCk7XG4gICAgICAgIGJsay5hRW5kICAgPSBwYXJzZUludChibGsuYUVuZCk7XG4gICAgICAgIGJsay5iRW5kICAgPSBwYXJzZUludChibGsuYkVuZCk7XG4gICAgICAgIGJsay5hTGVuZ3RoICAgPSBwYXJzZUludChibGsuYUxlbmd0aCk7XG4gICAgICAgIGJsay5iTGVuZ3RoICAgPSBwYXJzZUludChibGsuYkxlbmd0aCk7XG4gICAgICAgIGJsay5ibG9ja0NvdW50ICAgPSBwYXJzZUludChibGsuYmxvY2tDb3VudCk7XG4gICAgICAgIGJsay5ibG9ja1JhdGlvICAgPSBwYXJzZUZsb2F0KGJsay5ibG9ja1JhdGlvKTtcblx0YmxrLmFiTWFwID0gZDMuc2NhbGUubGluZWFyKClcblx0ICAgIC5kb21haW4oW2Jsay5hU3RhcnQsYmxrLmFFbmRdKVxuXHQgICAgLnJhbmdlKCBibGsuYmxvY2tPcmk9PT1cIi1cIiA/IFtibGsuYkVuZCxibGsuYlN0YXJ0XSA6IFtibGsuYlN0YXJ0LGJsay5iRW5kXSk7XG5cdGJsay5iYU1hcCA9IGJsay5hYk1hcC5pbnZlcnRcblx0cmV0dXJuIGJsaztcbiAgICB9XG4gICAgc2V0U29ydCAod2hpY2gpIHtcblx0aWYgKHdoaWNoICE9PSAnYScgJiYgd2hpY2ggIT09ICdiJykgdGhyb3cgXCJCYWQgYXJndW1lbnQ6XCIgKyB3aGljaDtcblx0bGV0IHNvcnRDb2wgPSB3aGljaCArIFwiSW5kZXhcIjtcblx0bGV0IGNtcCA9ICh4LHkpID0+IHhbc29ydENvbF0gLSB5W3NvcnRDb2xdO1xuXHR0aGlzLmJsb2Nrcy5zb3J0KGNtcCk7XG5cdHRoaXMuY3VyclNvcnQgPSB3aGljaDtcbiAgICB9XG4gICAgZmxpcFNvcnQgKCkge1xuXHR0aGlzLnNldFNvcnQodGhpcy5jdXJyU29ydCA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcbiAgICB9XG4gICAgLy8gR2l2ZW4gYSBnZW5vbWUgKGVpdGhlciB0aGUgYSBvciBiIGdlbm9tZSkgYW5kIGEgY29vcmRpbmF0ZSByYW5nZSxcbiAgICAvLyByZXR1cm5zIHRoZSBlcXVpdmFsZW50IGNvb3JkaW5hdGUgcmFuZ2UocykgaW4gdGhlIG90aGVyIGdlbm9tZVxuICAgIHRyYW5zbGF0ZSAoZnJvbUdlbm9tZSwgY2hyLCBzdGFydCwgZW5kLCBpbnZlcnQpIHtcblx0Ly9cblx0ZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBzdGFydCA6IGVuZDtcblx0Ly8gZnJvbSA9IFwiYVwiIG9yIFwiYlwiLCBkZXBlbmRpbmcgb24gd2hpY2ggZ2Vub21lIGlzIGdpdmVuLlxuICAgICAgICBsZXQgZnJvbSA9IChmcm9tR2Vub21lID09PSB0aGlzLmFHZW5vbWUgPyBcImFcIiA6IGZyb21HZW5vbWUgPT09IHRoaXMuYkdlbm9tZSA/IFwiYlwiIDogbnVsbCk7XG5cdGlmICghZnJvbSkgdGhyb3cgXCJCYWQgYXJndW1lbnQuIEdlbm9tZSBuZWl0aGVyIEEgbm9yIEIuXCI7XG5cdC8vIHRvID0gXCJiXCIgb3IgXCJhXCIsIG9wcG9zaXRlIG9mIGZyb21cblx0bGV0IHRvID0gKGZyb20gPT09IFwiYVwiID8gXCJiXCIgOiBcImFcIik7XG5cdC8vIG1ha2Ugc3VyZSB0aGUgYmxvY2tzIGFyZSBzb3J0ZWQgYnkgdGhlIGZyb20gZ2Vub21lXG5cdHRoaXMuc2V0U29ydChmcm9tKTtcblx0Ly9cblx0bGV0IGZyb21DID0gZnJvbStcIkNoclwiO1xuXHRsZXQgZnJvbVMgPSBmcm9tK1wiU3RhcnRcIjtcblx0bGV0IGZyb21FID0gZnJvbStcIkVuZFwiO1xuXHRsZXQgZnJvbUkgPSBmcm9tK1wiSW5kZXhcIjtcblx0bGV0IHRvQyA9IHRvK1wiQ2hyXCI7XG5cdGxldCB0b1MgPSB0bytcIlN0YXJ0XCI7XG5cdGxldCB0b0UgPSB0bytcIkVuZFwiO1xuXHRsZXQgdG9JID0gdG8rXCJJbmRleFwiO1xuXHRsZXQgbWFwcGVyID0gZnJvbSt0bytcIk1hcFwiO1xuXHQvLyBcblx0bGV0IGJsa3MgPSB0aGlzLmJsb2Nrc1xuXHQgICAgLy8gRmlyc3QgZmlsdGVyIGZvciBibG9ja3MgdGhhdCBvdmVybGFwIHRoZSBnaXZlbiBjb29yZGluYXRlIHJhbmdlIGluIHRoZSBmcm9tIGdlbm9tZVxuXHQgICAgLmZpbHRlcihibGsgPT4gYmxrW2Zyb21DXSA9PT0gY2hyICYmIGJsa1tmcm9tU10gPD0gZW5kICYmIGJsa1tmcm9tRV0gPj0gc3RhcnQpXG5cdCAgICAvLyBtYXAgZWFjaCBibG9jay4gXG5cdCAgICAubWFwKGJsayA9PiB7XG5cdFx0Ly8gY29vcmQgcmFuZ2Ugb24gdGhlIGZyb20gc2lkZS5cblx0XHRsZXQgcyA9IE1hdGgubWF4KHN0YXJ0LCBibGtbZnJvbVNdKTtcblx0XHRsZXQgZSA9IE1hdGgubWluKGVuZCwgYmxrW2Zyb21FXSk7XG5cdFx0Ly8gY29vcmQgcmFuZ2Ugb24gdGhlIHRvIHNpZGUuXG5cdFx0bGV0IHMyID0gTWF0aC5jZWlsKGJsa1ttYXBwZXJdKHMpKTtcblx0XHRsZXQgZTIgPSBNYXRoLmZsb29yKGJsa1ttYXBwZXJdKGUpKTtcblx0ICAgICAgICByZXR1cm4gaW52ZXJ0ID8ge1xuXHRcdCAgICBjaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgc3RhcnQ6IHMsXG5cdFx0ICAgIGVuZDogICBlLFxuXHRcdCAgICBvcmk6ICAgYmxrLmJsb2NrT3JpLFxuXHRcdCAgICBpbmRleDogYmxrW2Zyb21JXSxcblx0XHQgICAgLy8gYWxzbyByZXR1cm4gdGhlIGZyb21HZW5vbWUgY29vcmRzIGZvciB0aGlzIHBpZWNlIG9mIHRoZSB0cmFuc2xhdGlvblxuXHRcdCAgICBmQ2hyOiAgIGJsa1t0b0NdLFxuXHRcdCAgICBmU3RhcnQ6IE1hdGgubWluKHMyLGUyKSxcblx0XHQgICAgZkVuZDogICBNYXRoLm1heChzMixlMiksXG5cdFx0ICAgIGZJbmRleDogYmxrW3RvSV0sXG5cdFx0ICAgIC8vIGluY2x1ZGUgdGhlIGJsb2NrIGlkIGFuZCBmdWxsIGJsb2NrIGNvb3Jkc1xuXHRcdCAgICBibG9ja0lkOiBibGsuYmxvY2tJZCxcblx0XHQgICAgYmxvY2tTdGFydDogYmxrW2Zyb21TXSxcblx0XHQgICAgYmxvY2tFbmQ6IGJsa1tmcm9tRV1cblx0XHR9IDoge1xuXHRcdCAgICBjaHI6ICAgYmxrW3RvQ10sXG5cdFx0ICAgIHN0YXJ0OiBNYXRoLm1pbihzMixlMiksXG5cdFx0ICAgIGVuZDogICBNYXRoLm1heChzMixlMiksXG5cdFx0ICAgIG9yaTogICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGluZGV4OiBibGtbdG9JXSxcblx0XHQgICAgLy8gYWxzbyByZXR1cm4gdGhlIGZyb21HZW5vbWUgY29vcmRzIGZvciB0aGlzIHBpZWNlIG9mIHRoZSB0cmFuc2xhdGlvblxuXHRcdCAgICBmQ2hyOiAgIGJsa1tmcm9tQ10sXG5cdFx0ICAgIGZTdGFydDogcyxcblx0XHQgICAgZkVuZDogICBlLFxuXHRcdCAgICBmSW5kZXg6IGJsa1tmcm9tSV0sXG5cdFx0ICAgIC8vIGluY2x1ZGUgdGhlIGJsb2NrIGlkIGFuZCBmdWxsIGJsb2NrIGNvb3Jkc1xuXHRcdCAgICBibG9ja0lkOiBibGsuYmxvY2tJZCxcblx0XHQgICAgYmxvY2tTdGFydDogYmxrW3RvU10sXG5cdFx0ICAgIGJsb2NrRW5kOiBibGtbdG9FXVxuXHRcdH07XG5cdCAgICB9KTtcblx0aWYgKCFpbnZlcnQpIHtcblx0ICAgIC8vIExvb2sgZm9yIDEtYmxvY2sgZ2FwcyBhbmQgZmlsbCB0aGVtIGluLiBcblx0ICAgIGJsa3Muc29ydCgoYSxiKSA9PiBhLmluZGV4IC0gYi5pbmRleCk7XG5cdCAgICBsZXQgbmJzID0gW107XG5cdCAgICBibGtzLmZvckVhY2goIChiLCBpKSA9PiB7XG5cdFx0aWYgKGkgPT09IDApIHJldHVybjtcblx0XHRpZiAoYmxrc1tpXS5pbmRleCAtIGJsa3NbaSAtIDFdLmluZGV4ID09PSAyKSB7XG5cdFx0ICAgIGxldCBibGsgPSB0aGlzLmJsb2Nrcy5maWx0ZXIoIGIgPT4gYlt0b0ldID09PSBibGtzW2ldLmluZGV4IC0gMSApWzBdO1xuXHRcdCAgICBuYnMucHVzaCh7XG5cdFx0XHRjaHI6ICAgYmxrW3RvQ10sXG5cdFx0XHRzdGFydDogYmxrW3RvU10sXG5cdFx0XHRlbmQ6ICAgYmxrW3RvRV0sXG5cdFx0XHRvcmk6ICAgYmxrLmJsb2NrT3JpLFxuXHRcdFx0aW5kZXg6IGJsa1t0b0ldLFxuXHRcdFx0Ly8gYWxzbyByZXR1cm4gdGhlIGZyb21HZW5vbWUgY29vcmRzIGZvciB0aGlzIHBpZWNlIG9mIHRoZSB0cmFuc2xhdGlvblxuXHRcdFx0ZkNocjogICBibGtbZnJvbUNdLFxuXHRcdFx0ZlN0YXJ0OiBibGtbZnJvbVNdLFxuXHRcdFx0ZkVuZDogICBibGtbZnJvbUVdLFxuXHRcdFx0ZkluZGV4OiBibGtbZnJvbUldLFxuXHRcdFx0Ly8gaW5jbHVkZSB0aGUgYmxvY2sgaWQgYW5kIGZ1bGwgYmxvY2sgY29vcmRzXG5cdFx0XHRibG9ja0lkOiBibGsuYmxvY2tJZCxcblx0XHRcdGJsb2NrU3RhcnQ6IGJsa1t0b1NdLFxuXHRcdFx0YmxvY2tFbmQ6IGJsa1t0b0VdXG5cdFx0ICAgIH0pO1xuXHRcdH1cblx0ICAgIH0pO1xuXHQgICAgYmxrcyA9IGJsa3MuY29uY2F0KG5icyk7XG5cdH1cblx0Ymxrcy5zb3J0KChhLGIpID0+IGEuZkluZGV4IC0gYi5mSW5kZXgpO1xuXHRyZXR1cm4gYmxrcztcbiAgICB9XG4gICAgLy8gR2l2ZW4gYSBnZW5vbWUgKGVpdGhlciB0aGUgYSBvciBiIGdlbm9tZSlcbiAgICAvLyByZXR1cm5zIHRoZSBibG9ja3MgZm9yIHRyYW5zbGF0aW5nIHRvIHRoZSBvdGhlciAoYiBvciBhKSBnZW5vbWUuXG4gICAgLy9cbiAgICBnZXRCbG9ja3MgKGZyb21HZW5vbWUpIHtcblx0Ly8gZnJvbSA9IFwiYVwiIG9yIFwiYlwiLCBkZXBlbmRpbmcgb24gd2hpY2ggZ2Vub21lIGlzIGdpdmVuLlxuICAgICAgICBsZXQgZnJvbSA9IChmcm9tR2Vub21lID09PSB0aGlzLmFHZW5vbWUgPyBcImFcIiA6IGZyb21HZW5vbWUgPT09IHRoaXMuYkdlbm9tZSA/IFwiYlwiIDogbnVsbCk7XG5cdGlmICghZnJvbSkgdGhyb3cgXCJCYWQgYXJndW1lbnQuIEdlbm9tZSBuZWl0aGVyIEEgbm9yIEIuXCI7XG5cdC8vIHRvID0gXCJiXCIgb3IgXCJhXCIsIG9wcG9zaXRlIG9mIGZyb21cblx0bGV0IHRvID0gKGZyb20gPT09IFwiYVwiID8gXCJiXCIgOiBcImFcIik7XG5cdC8vIG1ha2Ugc3VyZSB0aGUgYmxvY2tzIGFyZSBzb3J0ZWQgYnkgdGhlIGZyb20gZ2Vub21lXG5cdHRoaXMuc2V0U29ydChmcm9tKTtcblx0Ly9cblx0bGV0IGZyb21DID0gZnJvbStcIkNoclwiO1xuXHRsZXQgZnJvbVMgPSBmcm9tK1wiU3RhcnRcIjtcblx0bGV0IGZyb21FID0gZnJvbStcIkVuZFwiO1xuXHRsZXQgZnJvbUkgPSBmcm9tK1wiSW5kZXhcIjtcblx0bGV0IHRvQyA9IHRvK1wiQ2hyXCI7XG5cdGxldCB0b1MgPSB0bytcIlN0YXJ0XCI7XG5cdGxldCB0b0UgPSB0bytcIkVuZFwiO1xuXHRsZXQgdG9JID0gdG8rXCJJbmRleFwiO1xuXHRsZXQgbWFwcGVyID0gZnJvbSt0bytcIk1hcFwiO1xuXHQvLyBcblx0bGV0IGJsa3MgPSB0aGlzLmJsb2Nrc1xuXHQgICAgLm1hcChibGsgPT4ge1xuXHQgICAgICAgIHJldHVybiB7XG5cdFx0ICAgIGJsb2NrSWQ6ICAgYmxrLmJsb2NrSWQsXG5cdFx0ICAgIG9yaTogICAgICAgYmxrLmJsb2NrT3JpLFxuXHRcdCAgICBmcm9tQ2hyOiAgIGJsa1tmcm9tQ10sXG5cdFx0ICAgIGZyb21TdGFydDogYmxrW2Zyb21TXSxcblx0XHQgICAgZnJvbUVuZDogICBibGtbZnJvbUVdLFxuXHRcdCAgICBmcm9tSW5kZXg6IGJsa1tmcm9tSV0sXG5cdFx0ICAgIHRvQ2hyOiAgICAgYmxrW3RvQ10sXG5cdFx0ICAgIHRvU3RhcnQ6ICAgYmxrW3RvU10sXG5cdFx0ICAgIHRvRW5kOiAgICAgYmxrW3RvRV0sXG5cdFx0ICAgIHRvSW5kZXg6ICAgYmxrW3RvSV1cblx0XHR9O1xuXHQgICAgfSlcblx0Ly8gXG5cdHJldHVybiBibGtzO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgQmxvY2tUcmFuc2xhdG9yIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9CbG9ja1RyYW5zbGF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFNWR1ZpZXcgfSBmcm9tICcuL1NWR1ZpZXcnO1xuaW1wb3J0IHsgY29vcmRzQWZ0ZXJUcmFuc2Zvcm0gfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBHZW5vbWVWaWV3IGV4dGVuZHMgU1ZHVmlldyB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0KTtcblx0dGhpcy5vcGVuV2lkdGggPSB0aGlzLm91dGVyV2lkdGg7XG5cdHRoaXMub3BlbkhlaWdodD0gdGhpcy5vdXRlckhlaWdodDtcblx0dGhpcy50b3RhbENocldpZHRoID0gNDA7IC8vIHRvdGFsIHdpZHRoIG9mIG9uZSBjaHJvbW9zb21lIChiYWNrYm9uZStibG9ja3MrZmVhdHMpXG5cdHRoaXMuY3dpZHRoID0gMjA7ICAgICAgICAvLyBjaHJvbW9zb21lIHdpZHRoXG5cdHRoaXMudGlja0xlbmd0aCA9IDEwO1x0IC8vIGZlYXR1cmUgdGljayBtYXJrIGxlbmd0aFxuXHR0aGlzLmJydXNoQ2hyID0gbnVsbDtcdCAvLyB3aGljaCBjaHIgaGFzIHRoZSBjdXJyZW50IGJydXNoXG5cdHRoaXMuYndpZHRoID0gdGhpcy5jd2lkdGgvMjsgIC8vIGJsb2NrIHdpZHRoXG5cdHRoaXMuY3VyckJsb2NrcyA9IG51bGw7XG5cdHRoaXMuY3VyclRpY2tzID0gbnVsbDtcblx0dGhpcy5nQ2hyb21vc29tZXMgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCdnJykuYXR0cihcIm5hbWVcIiwgXCJjaHJvbW9zb21lc1wiKTtcblx0dGhpcy50aXRsZSAgICA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ3RleHQnKS5hdHRyKFwiY2xhc3NcIiwgXCJ0aXRsZVwiKTtcblx0dGhpcy5zY3JvbGxBbW91bnQgPSAwO1xuXHQvL1xuXHR0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZml0VG9XaWR0aCAodyl7XG4gICAgICAgIHN1cGVyLmZpdFRvV2lkdGgodyk7XG5cdHRoaXMub3BlbldpZHRoID0gdGhpcy5vdXRlcldpZHRoO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RG9tICgpIHtcblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbi5jbG9zZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4gdGhpcy5yZWRyYXcoKSk7XG5cdHRoaXMuc3ZnLm9uKFwid2hlZWxcIiwgKCkgPT4ge1xuXHQgICAgaWYgKCF0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiKSkgcmV0dXJuO1xuXHQgICAgdGhpcy5zY3JvbGxXaGVlbChkMy5ldmVudC5kZWx0YVkpXG5cdCAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9KTtcblx0bGV0IHNicyA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwic3ZnY29udGFpbmVyXCJdID4gW25hbWU9XCJzY3JvbGxidXR0b25zXCJdJylcblx0c2JzLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwidXBcIl0nKS5vbihcImNsaWNrXCIsICgpID0+IHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNVcCgpKTtcblx0c2JzLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZG5cIl0nKS5vbihcImNsaWNrXCIsICgpID0+IHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNEb3duKCkpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldEJydXNoQ29vcmRzIChjb29yZHMpIHtcblx0dGhpcy5jbGVhckJydXNoZXMoKTtcblx0dGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0KGAuY2hyb21vc29tZVtuYW1lPVwiJHtjb29yZHMuY2hyfVwiXSBnW25hbWU9XCJicnVzaFwiXWApXG5cdCAgLmVhY2goZnVuY3Rpb24oY2hyKXtcblx0ICAgIGNoci5icnVzaC5leHRlbnQoW2Nvb3Jkcy5zdGFydCxjb29yZHMuZW5kXSk7XG5cdCAgICBjaHIuYnJ1c2goZDMuc2VsZWN0KHRoaXMpKTtcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJydXNoc3RhcnQgKGNocil7XG5cdHRoaXMuY2xlYXJCcnVzaGVzKGNoci5icnVzaCk7XG5cdHRoaXMuYnJ1c2hDaHIgPSBjaHI7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYnJ1c2hlbmQgKCl7XG5cdGlmKCF0aGlzLmJydXNoQ2hyKSByZXR1cm47XG5cdGxldCBjYyA9IHRoaXMuYXBwLmNvb3Jkcztcblx0dmFyIHh0bnQgPSB0aGlzLmJydXNoQ2hyLmJydXNoLmV4dGVudCgpO1xuXHRpZiAoTWF0aC5hYnMoeHRudFswXSAtIHh0bnRbMV0pIDw9IDEwKXtcblx0ICAgIC8vIHVzZXIgY2xpY2tlZFxuXHQgICAgbGV0IHcgPSBjYy5lbmQgLSBjYy5zdGFydCArIDE7XG5cdCAgICB4dG50WzBdIC09IHcvMjtcblx0ICAgIHh0bnRbMV0gKz0gdy8yO1xuXHR9XG5cdGxldCBjb29yZHMgPSB7IGNocjp0aGlzLmJydXNoQ2hyLm5hbWUsIHN0YXJ0Ok1hdGguZmxvb3IoeHRudFswXSksIGVuZDogTWF0aC5mbG9vcih4dG50WzFdKSB9O1xuXHR0aGlzLmFwcC5zZXRDb250ZXh0KGNvb3Jkcyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJCcnVzaGVzIChleGNlcHQpe1xuXHR0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoJ1tuYW1lPVwiYnJ1c2hcIl0nKS5lYWNoKGZ1bmN0aW9uKGNocil7XG5cdCAgICBpZiAoY2hyLmJydXNoICE9PSBleGNlcHQpIHtcblx0XHRjaHIuYnJ1c2guY2xlYXIoKTtcblx0XHRjaHIuYnJ1c2goZDMuc2VsZWN0KHRoaXMpKTtcblx0ICAgIH1cblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0WCAoY2hyKSB7XG5cdGxldCB4ID0gdGhpcy5hcHAuckdlbm9tZS54c2NhbGUoY2hyKTtcblx0aWYgKGlzTmFOKHgpKSB0aHJvdyBcInggaXMgTmFOXCJcblx0cmV0dXJuIHg7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldFkgKHBvcykge1xuXHRsZXQgeSA9IHRoaXMuYXBwLnJHZW5vbWUueXNjYWxlKHBvcyk7XG5cdGlmIChpc05hTih5KSkgdGhyb3cgXCJ5IGlzIE5hTlwiXG5cdHJldHVybiB5O1xuICAgIH1cbiAgICBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZWRyYXcgKCkge1xuICAgICAgICB0aGlzLmRyYXcodGhpcy5jdXJyVGlja3MsIHRoaXMuY3VyckJsb2Nrcyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZHJhdyAodGlja0RhdGEsIGJsb2NrRGF0YSkge1xuXHR0aGlzLmRyYXdDaHJvbW9zb21lcygpO1xuXHR0aGlzLmRyYXdCbG9ja3MoYmxvY2tEYXRhKTtcblx0dGhpcy5kcmF3VGlja3ModGlja0RhdGEpO1xuXHR0aGlzLmRyYXdUaXRsZSgpO1xuXHR0aGlzLnNldEJydXNoQ29vcmRzKHRoaXMuYXBwLmNvb3Jkcyk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIGNocm9tb3NvbWVzIG9mIHRoZSByZWZlcmVuY2UgZ2Vub21lLlxuICAgIC8vIEluY2x1ZGVzIGJhY2tib25lcywgbGFiZWxzLCBhbmQgYnJ1c2hlcy5cbiAgICAvLyBUaGUgYmFja2JvbmVzIGFyZSBkcmF3biBhcyB2ZXJ0aWNhbCBsaW5lIHNlbWVudHMsXG4gICAgLy8gZGlzdHJpYnV0ZWQgaG9yaXpvbnRhbGx5LiBPcmRlcmluZyBpcyBkZWZpbmVkIGJ5XG4gICAgLy8gdGhlIG1vZGVsIChHZW5vbWUgb2JqZWN0KS5cbiAgICAvLyBMYWJlbHMgYXJlIGRyYXduIGFib3ZlIHRoZSBiYWNrYm9uZXMuXG4gICAgLy9cbiAgICAvLyBNb2RpZmljYXRpb246XG4gICAgLy8gRHJhd3MgdGhlIHNjZW5lIGluIG9uZSBvZiB0d28gc3RhdGVzOiBvcGVuIG9yIGNsb3NlZC5cbiAgICAvLyBUaGUgb3BlbiBzdGF0ZSBpcyBhcyBkZXNjcmliZWQgLSBhbGwgY2hyb21vc29tZXMgc2hvd24uXG4gICAgLy8gSW4gdGhlIGNsb3NlZCBzdGF0ZTogXG4gICAgLy8gICAgICogb25seSBvbmUgY2hyb21vc29tZSBzaG93cyAodGhlIGN1cnJlbnQgb25lKVxuICAgIC8vICAgICAqIGRyYXduIGhvcml6b250YWxseSBhbmQgcG9zaXRpb25lZCBiZXNpZGUgdGhlIFwiR2Vub21lIFZpZXdcIiB0aXRsZVxuICAgIC8vXG4gICAgZHJhd0Nocm9tb3NvbWVzICgpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7IC8vIHJlZiBnZW5vbWVcblx0bGV0IHJDaHJzID0gcmcuY2hyb21vc29tZXM7XG5cbiAgICAgICAgLy8gQ2hyb21vc29tZSBncm91cHNcblx0bGV0IGNocnMgPSB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoXCIuY2hyb21vc29tZVwiKVxuXHQgICAgLmRhdGEockNocnMsIGMgPT4gYy5uYW1lKTtcblx0bGV0IG5ld2NocnMgPSBjaHJzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBcImNocm9tb3NvbWVcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBjID0+IGMubmFtZSk7XG5cdFxuXHRuZXdjaHJzLmFwcGVuZChcInRleHRcIikuYXR0cihcIm5hbWVcIixcImxhYmVsXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImxpbmVcIikuYXR0cihcIm5hbWVcIixcImJhY2tib25lXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIixcInN5bkJsb2Nrc1wiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJ0aWNrc1wiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJicnVzaFwiKTtcblxuXG5cdGxldCBjbG9zZWQgPSB0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiKTtcblx0Ly8gc2V0IGRpcmVjdGlvbiBvZiB0aGUgcmVzaXplIGN1cnNvci5cblx0Y2hycy5zZWxlY3RBbGwoJ2dbbmFtZT1cImJydXNoXCJdIGcucmVzaXplJykuc3R5bGUoJ2N1cnNvcicsIGNsb3NlZCA/ICdldy1yZXNpemUnIDogJ25zLXJlc2l6ZScpXG5cdC8vXG5cdGlmIChjbG9zZWQpIHtcblx0ICAgIC8vIFJlc2V0IHRoZSBTVkcgc2l6ZSB0byBiZSAxLWNocm9tb3NvbWUgd2lkZS5cblx0ICAgIC8vIFRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAgc28gdGhhdCB0aGUgY3VycmVudCBjaHJvbW9zb21lIGFwcGVhcnMgaW4gdGhlIHN2ZyBhcmVhLlxuXHQgICAgLy8gVHVybiBpdCA5MCBkZWcuXG5cblx0ICAgIC8vIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBTVkcgYXJlYSB0byAxIGNocm9tb3NvbWUncyB3aWR0aFxuXHQgICAgdGhpcy5zZXRHZW9tKHsgaGVpZ2h0OiB0aGlzLnRvdGFsQ2hyV2lkdGgsIHJvdGF0aW9uOiAtOTAsIHRyYW5zbGF0aW9uOiBbLXRoaXMudG90YWxDaHJXaWR0aC8yLDMwXSB9KTtcblx0ICAgIC8vIFxuXHQgICAgbGV0IGRlbHRhID0gMTA7XG5cdCAgICByZy54c2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcblx0XHQgLmRvbWFpbihyQ2hycy5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHgubmFtZTt9KSlcblx0XHQgLy8gaW4gY2xvc2VkIG1vZGUsIHRoZSBjaHJvbW9zb21lcyBoYXZlIGZpeGVkIHNwYWNpbmdcblx0XHQgLnJhbmdlUG9pbnRzKFtkZWx0YSwgZGVsdGErdGhpcy50b3RhbENocldpZHRoKihyQ2hycy5sZW5ndGgtMSldKTtcblx0ICAgIC8vXG5cdCAgICByZy55c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdCAuZG9tYWluKFsxLHJnLm1heGxlbl0pXG5cdFx0IC5yYW5nZShbMCwgdGhpcy53aWR0aF0pO1xuXG5cdCAgICAvLyB0cmFuc2xhdGUgZWFjaCBjaHJvbW9zb21lIGludG8gcG9zaXRpb25cblx0ICAgIGNocnMuYXR0cihcInRyYW5zZm9ybVwiLCBjID0+IGB0cmFuc2xhdGUoJHtyZy54c2NhbGUoYy5uYW1lKX0sIDApYCk7XG4gICAgICAgICAgICAvLyB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKC1yZy54c2NhbGUodGhpcy5hcHAuY29vcmRzLmNocikpO1xuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIC8vIFdoZW4gb3BlbiwgZHJhdyBhbGwgdGhlIGNocm9tb3NvbWVzLiBFYWNoIGNocm9tIGlzIGEgdmVydGljYWwgbGluZS5cblx0ICAgIC8vIENocm9tcyBhcmUgZGlzdHJpYnV0ZWQgZXZlbmx5IGFjcm9zcyB0aGUgYXZhaWxhYmxlIGhvcml6b250YWwgc3BhY2UuXG5cdCAgICB0aGlzLnNldEdlb20oeyB3aWR0aDogdGhpcy5vcGVuV2lkdGgsIGhlaWdodDogdGhpcy5vcGVuSGVpZ2h0LCByb3RhdGlvbjogMCwgdHJhbnNsYXRpb246IFswLDBdIH0pO1xuXHQgICAgLy8gXG5cdCAgICByZy54c2NhbGUgPSBkMy5zY2FsZS5vcmRpbmFsKClcblx0XHQgLmRvbWFpbihyQ2hycy5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHgubmFtZTt9KSlcblx0XHQgLy8gaW4gY2xvc2VkIG1vZGUsIHRoZSBjaHJvbW9zb21lcyBzcHJlYWQgdG8gZmlsbCB0aGUgc3BhY2Vcblx0XHQgLnJhbmdlUG9pbnRzKFswLCB0aGlzLm9wZW5XaWR0aCAtIDMwXSwgMC41KTtcblx0ICAgIHJnLnlzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0IC5kb21haW4oWzEscmcubWF4bGVuXSlcblx0XHQgLnJhbmdlKFswLCB0aGlzLmhlaWdodF0pO1xuXG5cdCAgICAvLyB0cmFuc2xhdGUgZWFjaCBjaHJvbW9zb21lIGludG8gcG9zaXRpb25cblx0ICAgIGNocnMuYXR0cihcInRyYW5zZm9ybVwiLCBjID0+IGB0cmFuc2xhdGUoJHtyZy54c2NhbGUoYy5uYW1lKX0sIDApYCk7XG4gICAgICAgICAgICAvLyB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHQgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKDApO1xuXHR9XG5cblx0ckNocnMuZm9yRWFjaChjaHIgPT4ge1xuXHQgICAgdmFyIHNjID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQuZG9tYWluKFsxLGNoci5sZW5ndGhdKVxuXHRcdC5yYW5nZShbMCwgcmcueXNjYWxlKGNoci5sZW5ndGgpXSk7XG5cdCAgICBjaHIuYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKS55KHNjKVxuXHQgICAgICAgLm9uKFwiYnJ1c2hzdGFydFwiLCBjaHIgPT4gdGhpcy5icnVzaHN0YXJ0KGNocikpXG5cdCAgICAgICAub24oXCJicnVzaGVuZFwiLCAoKSA9PiB0aGlzLmJydXNoZW5kKCkpO1xuXHQgIH0sIHRoaXMpO1xuXG5cbiAgICAgICAgY2hycy5zZWxlY3QoJ1tuYW1lPVwibGFiZWxcIl0nKVxuXHQgICAgLnRleHQoYz0+Yy5uYW1lKVxuXHQgICAgLmF0dHIoXCJ4XCIsIDApIFxuXHQgICAgLmF0dHIoXCJ5XCIsIC0yKVxuXHQgICAgO1xuXG5cdGNocnMuc2VsZWN0KCdbbmFtZT1cImJhY2tib25lXCJdJylcblx0ICAgIC5hdHRyKFwieDFcIiwgMClcblx0ICAgIC5hdHRyKFwieTFcIiwgMClcblx0ICAgIC5hdHRyKFwieDJcIiwgMClcblx0ICAgIC5hdHRyKFwieTJcIiwgYyA9PiByZy55c2NhbGUoYy5sZW5ndGgpKVxuXHQgICAgO1xuXHQgICBcblx0Y2hycy5zZWxlY3QoJ1tuYW1lPVwiYnJ1c2hcIl0nKVxuXHQgICAgLmVhY2goZnVuY3Rpb24oZCl7ZDMuc2VsZWN0KHRoaXMpLmNhbGwoZC5icnVzaCk7fSlcblx0ICAgIC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHQgICAgIC5hdHRyKCd3aWR0aCcsMTYpXG5cdCAgICAgLmF0dHIoJ3gnLCAtOClcblx0ICAgIDtcblxuXHRjaHJzLmV4aXQoKS5yZW1vdmUoKTtcblx0XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2Nyb2xsIHdoZWVsIGV2ZW50IGhhbmRsZXIuXG4gICAgc2Nyb2xsV2hlZWwgKGR5KSB7XG5cdC8vIEFkZCBkeSB0byB0b3RhbCBzY3JvbGwgYW1vdW50LiBUaGVuIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNCeShkeSk7XG5cdC8vIEFmdGVyIGEgMjAwIG1zIHBhdXNlIGluIHNjcm9sbGluZywgc25hcCB0byBuZWFyZXN0IGNocm9tb3NvbWVcblx0dGhpcy50b3V0ICYmIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50b3V0KTtcblx0dGhpcy50b3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCk9PnRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCksIDIwMCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzVG8gKHgpIHtcbiAgICAgICAgaWYgKHggPT09IHVuZGVmaW5lZCkgeCA9IHRoaXMuc2Nyb2xsQW1vdW50O1xuXHR0aGlzLnNjcm9sbEFtb3VudCA9IE1hdGgubWF4KE1hdGgubWluKHgsMTUpLCAtdGhpcy50b3RhbENocldpZHRoICogKHRoaXMuYXBwLnJHZW5vbWUuY2hyb21vc29tZXMubGVuZ3RoLTEpKTtcblx0dGhpcy5nQ2hyb21vc29tZXMuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7dGhpcy5zY3JvbGxBbW91bnR9LDApYCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzQnkgKGR4KSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbyh0aGlzLnNjcm9sbEFtb3VudCArIGR4KTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNTbmFwICgpIHtcblx0bGV0IGkgPSBNYXRoLnJvdW5kKHRoaXMuc2Nyb2xsQW1vdW50IC8gdGhpcy50b3RhbENocldpZHRoKVxuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oaSp0aGlzLnRvdGFsQ2hyV2lkdGgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc1VwICgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc0J5KC10aGlzLnRvdGFsQ2hyV2lkdGgpO1xuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc0Rvd24gKCkge1xuICAgICAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzQnkodGhpcy50b3RhbENocldpZHRoKTtcblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZHJhd1RpdGxlICgpIHtcblx0bGV0IHJlZmcgPSB0aGlzLmFwcC5yR2Vub21lLmxhYmVsO1xuXHRsZXQgYmxvY2tnID0gdGhpcy5jdXJyQmxvY2tzID8gXG5cdCAgICB0aGlzLmN1cnJCbG9ja3MuY29tcCAhPT0gdGhpcy5hcHAuckdlbm9tZSA/XG5cdCAgICAgICAgdGhpcy5jdXJyQmxvY2tzLmNvbXAubGFiZWxcblx0XHQ6XG5cdFx0bnVsbFxuXHQgICAgOlxuXHQgICAgbnVsbDtcblx0bGV0IGxzdCA9IHRoaXMuYXBwLmN1cnJMaXN0ID8gdGhpcy5hcHAuY3Vyckxpc3QubmFtZSA6IG51bGw7XG5cblx0dGhpcy5yb290LnNlbGVjdChcImxhYmVsIHNwYW4udGl0bGVcIikudGV4dChyZWZnKTtcblxuXHRsZXQgbGluZXMgPSBbXTtcblx0YmxvY2tnICYmIGxpbmVzLnB1c2goYEJsb2NrcyB2cy4gJHtibG9ja2d9YCk7XG5cdGxzdCAmJiBsaW5lcy5wdXNoKGBGZWF0dXJlcyBmcm9tIGxpc3QgXCIke2xzdH1cImApO1xuXHRsZXQgc3VidCA9IGxpbmVzLmpvaW4oXCIgOjogXCIpO1xuXHR0aGlzLnJvb3Quc2VsZWN0KFwibGFiZWwgc3Bhbi5zdWJ0aXRsZVwiKS50ZXh0KChzdWJ0ID8gXCI6OiBcIiA6IFwiXCIpICsgc3VidCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIG91dGxpbmVzIG9mIHN5bnRlbnkgYmxvY2tzIG9mIHRoZSByZWYgZ2Vub21lIHZzLlxuICAgIC8vIHRoZSBnaXZlbiBnZW5vbWUuXG4gICAgLy8gUGFzc2luZyBudWxsIGVyYXNlcyBhbGwgc3ludGVueSBibG9ja3MuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBkYXRhID09IHsgcmVmOkdlbm9tZSwgY29tcDpHZW5vbWUsIGJsb2NrczogbGlzdCBvZiBzeW50ZW55IGJsb2NrcyB9XG4gICAgLy8gICAgRWFjaCBzYmxvY2sgPT09IHsgYmxvY2tJZDppbnQsIG9yaTorLy0sIGZyb21DaHIsIGZyb21TdGFydCwgZnJvbUVuZCwgdG9DaHIsIHRvU3RhcnQsIHRvRW5kIH1cbiAgICBkcmF3QmxvY2tzIChkYXRhKSB7XG5cdC8vXG4gICAgICAgIGxldCBzYmdycHMgPSB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoXCIuY2hyb21vc29tZVwiKS5zZWxlY3QoJ1tuYW1lPVwic3luQmxvY2tzXCJdJyk7XG5cdGlmICghZGF0YSB8fCAhZGF0YS5ibG9ja3MgfHwgZGF0YS5ibG9ja3MubGVuZ3RoID09PSAwKSB7XG5cdCAgICB0aGlzLmN1cnJCbG9ja3MgPSBudWxsO1xuXHQgICAgc2JncnBzLmh0bWwoJycpO1xuXHQgICAgdGhpcy5kcmF3VGl0bGUoKTtcblx0ICAgIHJldHVybjtcblx0fVxuXHR0aGlzLmN1cnJCbG9ja3MgPSBkYXRhO1xuXHQvLyByZW9yZ2FuaXplIGRhdGEgdG8gcmVmbGVjdCBTVkcgc3RydWN0dXJlIHdlIHdhbnQsIGllLCBncm91cGVkIGJ5IGNocm9tb3NvbWVcbiAgICAgICAgbGV0IGR4ID0gZGF0YS5ibG9ja3MucmVkdWNlKChhLHNiKSA9PiB7XG5cdFx0aWYgKCFhW3NiLmZyb21DaHJdKSBhW3NiLmZyb21DaHJdID0gW107XG5cdFx0YVtzYi5mcm9tQ2hyXS5wdXNoKHNiKTtcblx0XHRyZXR1cm4gYTtcblx0ICAgIH0sIHt9KTtcblx0c2JncnBzLmVhY2goZnVuY3Rpb24oYyl7XG5cdCAgICBkMy5zZWxlY3QodGhpcykuZGF0dW0oe2NocjogYy5uYW1lLCBibG9ja3M6IGR4W2MubmFtZV0gfHwgW10gfSk7XG5cdH0pO1xuXG5cdGxldCBid2lkdGggPSAxMDtcbiAgICAgICAgbGV0IHNibG9ja3MgPSBzYmdycHMuc2VsZWN0QWxsKCdyZWN0LnNibG9jaycpLmRhdGEoYj0+Yi5ibG9ja3MpO1xuICAgICAgICBsZXQgbmV3YnMgPSBzYmxvY2tzLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuYXR0cignY2xhc3MnLCdzYmxvY2snKTtcblx0c2Jsb2Nrc1xuXHQgICAgLmF0dHIoXCJ4XCIsIC1id2lkdGgvMiApXG5cdCAgICAuYXR0cihcInlcIiwgYiA9PiB0aGlzLmdldFkoYi5mcm9tU3RhcnQpKVxuXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCBid2lkdGgpXG5cdCAgICAuYXR0cihcImhlaWdodFwiLCBiID0+IE1hdGgubWF4KDAsdGhpcy5nZXRZKGIuZnJvbUVuZCAtIGIuZnJvbVN0YXJ0ICsgMSkpKVxuXHQgICAgLmNsYXNzZWQoXCJpbnZlcnNpb25cIiwgYiA9PiBiLm9yaSA9PT0gXCItXCIpXG5cdCAgICAuY2xhc3NlZChcInRyYW5zbG9jYXRpb25cIiwgYiA9PiBiLmZyb21DaHIgIT09IGIudG9DaHIpXG5cdCAgICA7XG5cbiAgICAgICAgc2Jsb2Nrcy5leGl0KCkucmVtb3ZlKCk7XG5cblx0dGhpcy5kcmF3VGl0bGUoKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3VGlja3MgKGlkcykge1xuXHR0aGlzLmN1cnJUaWNrcyA9IGlkcyB8fCBbXTtcblx0dGhpcy5hcHAuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXNCeUlkKHRoaXMuYXBwLnJHZW5vbWUsIHRoaXMuY3VyclRpY2tzKVxuXHQgICAgLnRoZW4oIGZlYXRzID0+IHsgdGhpcy5fZHJhd1RpY2tzKGZlYXRzKTsgfSk7XG4gICAgfVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIF9kcmF3VGlja3MgKGZlYXR1cmVzKSB7XG5cdGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7IC8vIHJlZiBnZW5vbWVcblx0Ly8gZmVhdHVyZSB0aWNrIG1hcmtzXG5cdGlmICghZmVhdHVyZXMgfHwgZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XG5cdCAgICB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoJ1tuYW1lPVwidGlja3NcIl0nKS5zZWxlY3RBbGwoXCIuZmVhdHVyZVwiKS5yZW1vdmUoKTtcblx0ICAgIHJldHVybjtcblx0fVxuXG5cdC8vXG5cdGxldCB0R3JwcyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpLnNlbGVjdCgnW25hbWU9XCJ0aWNrc1wiXScpO1xuXG5cdC8vIGdyb3VwIGZlYXR1cmVzIGJ5IGNocm9tb3NvbWVcbiAgICAgICAgbGV0IGZpeCA9IGZlYXR1cmVzLnJlZHVjZSgoYSxmKSA9PiB7IFxuXHQgICAgaWYgKCEgYVtmLmNocl0pIGFbZi5jaHJdID0gW107XG5cdCAgICBhW2YuY2hyXS5wdXNoKGYpO1xuXHQgICAgcmV0dXJuIGE7XG5cdH0sIHt9KVxuXHR0R3Jwcy5lYWNoKGZ1bmN0aW9uKGMpIHtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5kYXR1bSggeyBjaHI6IGMsIGZlYXR1cmVzOiBmaXhbYy5uYW1lXSAgfHwgW119ICk7XG5cdH0pO1xuXG5cdC8vIHRoZSB0aWNrIGVsZW1lbnRzXG4gICAgICAgIGxldCBmZWF0cyA9IHRHcnBzLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpXG5cdCAgICAuZGF0YShkID0+IGQuZmVhdHVyZXMsIGQgPT4gZC5JRCk7XG5cdC8vXG5cdGxldCB4QWRqID0gZiA9PiAoZi5zdHJhbmQgPT09IFwiK1wiID8gdGhpcy50aWNrTGVuZ3RoIDogLXRoaXMudGlja0xlbmd0aCk7XG5cdC8vXG5cdGxldCBzaGFwZSA9IFwiY2lyY2xlXCI7ICAvLyBcImNpcmNsZVwiIG9yIFwibGluZVwiXG5cdC8vXG5cdGxldCBuZXdmcyA9IGZlYXRzLmVudGVyKClcblx0ICAgIC5hcHBlbmQoc2hhcGUpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJmZWF0dXJlXCIpXG5cdCAgICAub24oJ2NsaWNrJywgKGYpID0+IHtcblx0XHRsZXQgaSA9IGYuY2Fub25pY2FsfHxmLklEO1xuXHQgICAgICAgIHRoaXMuYXBwLnNldENvbnRleHQoe2xhbmRtYXJrOmksIGhpZ2hsaWdodDpbaV19KTtcblx0ICAgIH0pIDtcblx0bmV3ZnMuYXBwZW5kKFwidGl0bGVcIilcblx0XHQudGV4dChmPT5mLnN5bWJvbCB8fCBmLmlkKTtcblx0aWYgKHNoYXBlID09PSBcImxpbmVcIikge1xuXHQgICAgZmVhdHMuYXR0cihcIngxXCIsIGYgPT4geEFkaihmKSArIDUpXG5cdCAgICBmZWF0cy5hdHRyKFwieTFcIiwgZiA9PiByZy55c2NhbGUoZi5zdGFydCkpXG5cdCAgICBmZWF0cy5hdHRyKFwieDJcIiwgZiA9PiB4QWRqKGYpICsgdGhpcy50aWNrTGVuZ3RoICsgNSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ5MlwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0fVxuXHRlbHNlIHtcblx0ICAgIGZlYXRzLmF0dHIoXCJjeFwiLCBmID0+IHhBZGooZikpXG5cdCAgICBmZWF0cy5hdHRyKFwiY3lcIiwgZiA9PiByZy55c2NhbGUoZi5zdGFydCkpXG5cdCAgICBmZWF0cy5hdHRyKFwiclwiLCAgdGhpcy50aWNrTGVuZ3RoIC8gMik7XG5cdH1cblx0Ly9cblx0ZmVhdHMuZXhpdCgpLnJlbW92ZSgpXG4gICAgfVxufSAvLyBlbmQgY2xhc3MgR2Vub21lVmlld1xuXG5leHBvcnQgeyBHZW5vbWVWaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9HZW5vbWVWaWV3LmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5cbmNsYXNzIEZlYXR1cmVEZXRhaWxzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLmluaXREb20gKCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdERvbSAoKSB7XG5cdC8vXG5cdHRoaXMucm9vdC5zZWxlY3QgKFwiLmJ1dHRvbi5jbG9zZVwiKVxuXHQgICAgLm9uKFwiY2xpY2suZXh0cmFcIiwgKCkgPT4gdGhpcy51cGRhdGUoKSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy9cbiAgICB1cGRhdGUoZikge1xuXHQvLyBpZiBjYWxsZWQgd2l0aCBubyBhcmdzLCB1cGRhdGUgdXNpbmcgdGhlIHByZXZpb3VzIGZlYXR1cmVcblx0ZiA9IGYgfHwgdGhpcy5sYXN0RmVhdHVyZTtcblx0aWYgKCFmKSB7XG5cdCAgIC8vIEZJWE1FOiBtYWpvciByZWFjaG92ZXIgaW4gdGhpcyBzZWN0aW9uXG5cdCAgIC8vXG5cdCAgIC8vIGZhbGxiYWNrLiB0YWtlIHRoZSBmaXJzdCBoaWdobGlnaHRlZC5cblx0ICAgbGV0IHIgPSB0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcInJlY3QuZmVhdHVyZS5oaWdobGlnaHRcIilbMF1bMF07XG5cdCAgIC8vIGZhbGxiYWNrLiB0YWtlIHRoZSBmaXJzdCBmZWF0dXJlXG5cdCAgIGlmICghcikgciA9IHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwicmVjdC5mZWF0dXJlXCIpWzBdWzBdO1xuXHQgICBpZiAocikgZiA9IHIuX19kYXRhX187XG5cdH1cblx0Ly8gcmVtZW1iZXJcbiAgICAgICAgaWYgKCFmKSB0aHJvdyBcIkNhbm5vdCB1cGRhdGUgZmVhdHVyZSBkZXRhaWxzLiBObyBmZWF0dXJlLlwiO1xuXHR0aGlzLmxhc3RGZWF0dXJlID0gZjtcblxuXHQvLyBsaXN0IG9mIGZlYXR1cmVzIHRvIHNob3cgaW4gZGV0YWlscyBhcmVhLlxuXHQvLyB0aGUgZ2l2ZW4gZmVhdHVyZSBhbmQgYWxsIGVxdWl2YWxlbnRzIGluIG90aGVyIGdlbm9tZXMuXG5cdGxldCBmbGlzdCA9IFtmXTtcblx0aWYgKGYuY2Fub25pY2FsKSB7XG5cdCAgICAvLyBGSVhNRTogcmVhY2hvdmVyXG5cdCAgICBmbGlzdCA9IHRoaXMuYXBwLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlDYW5vbmljYWxJZChmLmNhbm9uaWNhbCk7XG5cdH1cblx0Ly8gR290IHRoZSBsaXN0LiBOb3cgb3JkZXIgaXQgdGhlIHNhbWUgYXMgdGhlIGRpc3BsYXllZCBnZW5vbWVzXG5cdC8vIGJ1aWxkIGluZGV4IG9mIGdlbm9tZSBuYW1lIC0+IGZlYXR1cmUgaW4gZmxpc3Rcblx0bGV0IGl4ID0gZmxpc3QucmVkdWNlKChhY2MsZikgPT4geyBhY2NbZi5nZW5vbWUubmFtZV0gPSBmOyByZXR1cm4gYWNjOyB9LCB7fSlcblx0bGV0IGdlbm9tZU9yZGVyID0gKFt0aGlzLmFwcC5yR2Vub21lXS5jb25jYXQodGhpcy5hcHAuY0dlbm9tZXMpKTtcblx0Zmxpc3QgPSBnZW5vbWVPcmRlci5tYXAoZyA9PiBpeFtnLm5hbWVdIHx8IG51bGwpO1xuXHQvL1xuXHRsZXQgY29sSGVhZGVycyA9IFtcblx0ICAgIC8vIGNvbHVtbnMgaGVhZGVycyBhbmQgdGhlaXIgJSB3aWR0aHNcblx0ICAgIFtcIkNhbm9uaWNhbCBpZFwiICAgICAsMTBdLFxuXHQgICAgW1wiQ2Fub25pY2FsIHN5bWJvbFwiICwxMF0sXG5cdCAgICBbXCJHZW5vbWVcIiAgICAgLDldLFxuXHQgICAgW1wiSURcIiAgICAgLDE3XSxcblx0ICAgIFtcIlR5cGVcIiAgICAgICAsMTAuNV0sXG5cdCAgICBbXCJCaW9UeXBlXCIgICAgLDE4LjVdLFxuXHQgICAgW1wiQ29vcmRpbmF0ZXNcIiwxOF0sXG5cdCAgICBbXCJMZW5ndGhcIiAgICAgLDddXG5cdF07XG5cdC8vIEluIHRoZSBjbG9zZWQgc3RhdGUsIG9ubHkgc2hvdyB0aGUgaGVhZGVyIGFuZCB0aGUgcm93IGZvciB0aGUgcGFzc2VkIGZlYXR1cmVcblx0aWYgKHRoaXMucm9vdC5jbGFzc2VkKCdjbG9zZWQnKSlcblx0ICAgIGZsaXN0ID0gZmxpc3QuZmlsdGVyKCAoZmYsIGkpID0+IGZmID09PSBmICk7XG5cdC8vIERyYXcgdGhlIHRhYmxlXG5cdGxldCB0ID0gdGhpcy5yb290LnNlbGVjdCgndGFibGUnKTtcblx0bGV0IHJvd3MgPSB0LnNlbGVjdEFsbCgndHInKS5kYXRhKCBbY29sSGVhZGVyc10uY29uY2F0KGZsaXN0KSApO1xuXHRyb3dzLmVudGVyKCkuYXBwZW5kKCd0cicpXG5cdCAgLm9uKFwibW91c2VlbnRlclwiLCAoZixpKSA9PiBpICE9PSAwICYmIHRoaXMuYXBwLnpvb21WaWV3LmhpZ2hsaWdodChmLCB0cnVlKSlcblx0ICAub24oXCJtb3VzZWxlYXZlXCIsIChmLGkpID0+IGkgIT09IDAgJiYgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KCkpO1xuXHQgICAgICBcblx0cm93cy5leGl0KCkucmVtb3ZlKCk7XG5cdHJvd3MuY2xhc3NlZChcImhpZ2hsaWdodFwiLCAoZmYsIGkpID0+IChpICE9PSAwICYmIGZmID09PSBmKSk7XG5cdC8vXG5cdC8vIEdpdmVuIGEgZmVhdHVyZSwgcmV0dXJucyBhIGxpc3Qgb2Ygc3RyaW5ncyBmb3IgcG9wdWxhdGluZyBhIHRhYmxlIHJvdy5cblx0Ly8gSWYgaT09PTAsIHRoZW4gZiBpcyBub3QgYSBmZWF0dXJlLCBidXQgYSBsaXN0IGNvbHVtbnMgbmFtZXMrd2lkdGhzLlxuXHQvLyBcblx0bGV0IGNlbGxEYXRhID0gZnVuY3Rpb24gKGYsIGkpIHtcblx0ICAgIGlmIChpID09PSAwKSB7XG5cdFx0cmV0dXJuIGY7XG5cdCAgICB9XG5cdCAgICBsZXQgY2VsbERhdGEgPSBbIFwiLlwiLCBcIi5cIiwgZ2Vub21lT3JkZXJbaS0xXS5sYWJlbCwgXCIuXCIsIFwiLlwiLCBcIi5cIiwgXCIuXCIsIFwiLlwiIF07XG5cdCAgICAvLyBmIGlzIG51bGwgaWYgaXQgZG9lc24ndCBleGlzdCBmb3IgZ2Vub21lIGkgXG5cdCAgICBpZiAoZikge1xuXHRcdGxldCBsaW5rID0gXCJcIjtcblx0XHRsZXQgY2Fub25pY2FsID0gZi5jYW5vbmljYWwgfHwgXCJcIjtcblx0XHRpZiAoY2Fub25pY2FsKSB7XG5cdFx0ICAgIGxldCB1cmwgPSBgaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL2FjY2Vzc2lvbi8ke2Nhbm9uaWNhbH1gO1xuXHRcdCAgICBsaW5rID0gYDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIke3VybH1cIj4ke2Nhbm9uaWNhbH08L2E+YDtcblx0XHR9XG5cdFx0Y2VsbERhdGEgPSBbXG5cdFx0ICAgIGxpbmsgfHwgY2Fub25pY2FsLFxuXHRcdCAgICBmLnN5bWJvbCxcblx0XHQgICAgZi5nZW5vbWUubGFiZWwsXG5cdFx0ICAgIGYuSUQsXG5cdFx0ICAgIGYudHlwZSxcblx0XHQgICAgZi5iaW90eXBlLFxuXHRcdCAgICBgJHtmLmNocn06JHtmLnN0YXJ0fS4uJHtmLmVuZH0gKCR7Zi5zdHJhbmR9KWAsXG5cdFx0ICAgIGAke2YuZW5kIC0gZi5zdGFydCArIDF9IGJwYFxuXHRcdF07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gY2VsbERhdGE7XG5cdH07XG5cdGxldCBjZWxscyA9IHJvd3Muc2VsZWN0QWxsKFwidGRcIilcblx0ICAgIC5kYXRhKChmLGkpID0+IGNlbGxEYXRhKGYsaSkpO1xuXHRjZWxscy5lbnRlcigpLmFwcGVuZChcInRkXCIpO1xuXHRjZWxscy5leGl0KCkucmVtb3ZlKCk7XG5cdGNlbGxzLmh0bWwoKGQsaSxqKSA9PiB7XG5cdCAgICByZXR1cm4gaiA9PT0gMCA/IGRbMF0gOiBkXG5cdH0pXG5cdC5zdHlsZShcIndpZHRoXCIsIChkLGksaikgPT4gaiA9PT0gMCA/IGAke2RbMV19JWAgOiBudWxsKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IEZlYXR1cmVEZXRhaWxzIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlRGV0YWlscy5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgU1ZHVmlldyB9IGZyb20gJy4vU1ZHVmlldyc7XG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSAnLi9GZWF0dXJlJztcbmltcG9ydCB7IHByZXR0eVByaW50QmFzZXMsIGNsaXAsIHBhcnNlQ29vcmRzLCBmb3JtYXRDb29yZHMsIGNvb3Jkc0FmdGVyVHJhbnNmb3JtLCByZW1vdmVEdXBzIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgWm9vbVZpZXcgZXh0ZW5kcyBTVkdWaWV3IHtcbiAgICAvL1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCwgaW5pdGlhbENvb3JkcywgaW5pdGlhbEhpKSB7XG4gICAgICBzdXBlcihhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAvL1xuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgLy9cbiAgICAgIHRoaXMubWluU3ZnSGVpZ2h0ID0gMjUwO1xuICAgICAgdGhpcy5ibG9ja0hlaWdodCA9IDYwO1xuICAgICAgdGhpcy50b3BPZmZzZXQgPSAxNTtcbiAgICAgIHRoaXMuZmVhdEhlaWdodCA9IDg7XHQvLyBoZWlnaHQgb2YgYSByZWN0YW5nbGUgcmVwcmVzZW50aW5nIGEgZmVhdHVyZVxuICAgICAgdGhpcy5sYW5lR2FwID0gMjtcdCAgICAgICAgLy8gc3BhY2UgYmV0d2VlbiBzd2ltIGxhbmVzXG4gICAgICB0aGlzLmxhbmVIZWlnaHQgPSB0aGlzLmZlYXRIZWlnaHQgKyB0aGlzLmxhbmVHYXA7XG4gICAgICB0aGlzLm1pblN0cmlwSGVpZ2h0ID0gNzU7ICAgIC8vIGhlaWdodCBwZXIgZ2Vub21lIGluIHRoZSB6b29tIHZpZXdcbiAgICAgIHRoaXMuc3RyaXBHYXAgPSAyMDtcdC8vIHNwYWNlIGJldHdlZW4gc3RyaXBzXG4gICAgICB0aGlzLm1heFNCZ2FwID0gMjA7XHQvLyBtYXggZ2FwIGFsbG93ZWQgYmV0d2VlbiBibG9ja3MuXG4gICAgICB0aGlzLmRtb2RlID0gJ2NvbXBhcmlzb24nOy8vIGRyYXdpbmcgbW9kZS4gJ2NvbXBhcmlzb24nIG9yICdyZWZlcmVuY2UnXG4gICAgICB0aGlzLndoZWVsVGhyZXNob2xkID0gMztcdC8vIG1pbmltdW0gd2hlZWwgZGlzdGFuY2UgXG4gICAgICAvLyBBIGZlYXR1cmUgbWF5IGJlIHJlbmRlcmVkIGluIG9uZSBvZiB0d28gd2F5czogYXMgYSBzaW1wbGUgcmVjdCwgb3IgYXMgYSBncm91cCBjb250YWluaW5nIHRoZSBcbiAgICAgIC8vIHJlY3QgYW5kIG90aGVyIHN0dWZmIGxpa2UgdGV4dCwgYW4gYXhpcyBsaW5lLCBldGMuXG4gICAgICB0aGlzLnNob3dGZWF0dXJlRGV0YWlscyA9IGZhbHNlOyAvLyBpZiB0cnVlLCBzaG93IGV4b24gc3RydWN0dXJlXG4gICAgICB0aGlzLmZlYXR1cmVEZXRhaWxUaHJlc2hvbGQgPSAyMDAwMDAwOyAvLyBpZiB3aWR0aCA8PSB0aHJlc2gsIGRyYXcgZmVhdHVyZSBkZXRhaWxzLlxuICAgICAgdGhpcy5jbGVhckFsbCA9IGZhbHNlOyAvLyBpZiB0cnVlLCByZW1vdmUvcmVyZW5kZXIgYWxsIGV4aXN0aW5nIGZlYXR1cmVzIG9uIG5leHQgZHJhd1xuXG4gICAgICAvL1xuICAgICAgLy8gSURzIG9mIEZlYXR1cmVzIHdlJ3JlIGhpZ2hsaWdodGluZy4gTWF5IGJlIGZlYXR1cmUncyBJRCAgb3IgY2Fub25pY2FsIElEci4vXG4gICAgICAvLyBoaUZlYXRzIGlzIGFuIG9iaiB3aG9zZSBrZXlzIGFyZSB0aGUgSURzXG4gICAgICB0aGlzLmhpRmVhdHMgPSAoaW5pdGlhbEhpIHx8IFtdKS5yZWR1Y2UoIChhLHYpID0+IHsgYVt2XT12OyByZXR1cm4gYTsgfSwge30gKTtcbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBudWxsO1xuICAgICAgdGhpcy5kcmFnZ2VyID0gdGhpcy5nZXREcmFnZ2VyKCk7XG4gICAgICAvL1xuXHQvLyBDb25maWcgZm9yIG1lbnUgdW5kZXIgbWVudSBidXR0b25cblx0dGhpcy5jeHRNZW51Q2ZnID0gW3tcblx0ICAgIG5hbWU6ICdsaW5rVG9TbnBzJyxcblx0ICAgIGxhYmVsOiAnTUdJIFNOUHMnLCBcblx0ICAgIGljb246ICdvcGVuX2luX25ldycsXG5cdCAgICB0b29sdGlwOiAnVmlldyBTTlBzIGF0IE1HSSBmb3IgdGhlIGN1cnJlbnQgc3RyYWlucyBpbiB0aGUgY3VycmVudCByZWdpb24uIChTb21lIHN0cmFpbnMgbm90IGF2YWlsYWJsZS4pJyxcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpU25wUmVwb3J0KClcblx0fSx7XG5cdCAgICBuYW1lOiAnbGlua1RvUXRsJyxcblx0ICAgIGxhYmVsOiAnTUdJIFFUTHMnLCBcblx0ICAgIGljb246ICAnb3Blbl9pbl9uZXcnLFxuXHQgICAgdG9vbHRpcDogJ1ZpZXcgUVRMIGF0IE1HSSB0aGF0IG92ZXJsYXAgdGhlIGN1cnJlbnQgcmVnaW9uLicsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naVFUTHMoKVxuXHR9LHtcblx0ICAgIG5hbWU6ICdsaW5rVG9KYnJvd3NlJyxcblx0ICAgIGxhYmVsOiAnTUdJIEpCcm93c2UnLCBcblx0ICAgIGljb246ICdvcGVuX2luX25ldycsXG5cdCAgICB0b29sdGlwOiAnT3BlbiBNR0kgSkJyb3dzZSAoQzU3QkwvNkogR1JDbTM4KSB3aXRoIHRoZSBjdXJyZW50IGNvb3JkaW5hdGUgcmFuZ2UuJyxcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpSkJyb3dzZSgpXG5cdH0se1xuXHQgICAgbmFtZTogJ2NsZWFyQ2FjaGUnLFxuXHQgICAgbGFiZWw6ICdDbGVhciBjYWNoZScsIFxuXHQgICAgaWNvbjogJ2RlbGV0ZV9zd2VlcCcsXG5cdCAgICB0b29sdGlwOiAnRGVsZXRlIGNhY2hlZCBmZWF0dXJlcy4gRGF0YSB3aWxsIGJlIHJlbG9hZGVkIGZyb20gdGhlIHNlcnZlciBvbiBuZXh0IHVzZS4nLFxuXHQgICAgaGFuZGxlcjogKCk9PiB0aGlzLmFwcC5jbGVhckNhY2hlZERhdGEodHJ1ZSlcblx0fV07XG5cblx0Ly8gY29uZmlnIGZvciBhIGZlYXR1cmUncyBjb250ZXh0IG1lbnVcblx0dGhpcy5mY3h0TWVudUNmZyA9IFt7XG5cdCAgICBuYW1lOiAnbWVudVRpdGxlJyxcblx0ICAgIGxhYmVsOiAoZCkgPT4gYCR7ZC5zeW1ib2wgfHwgZC5JRH1gLCBcblx0ICAgIGNsczogJ21lbnVUaXRsZSdcblx0fSx7XG5cdCAgICBuYW1lOiAnbGluZVVwT25GZWF0dXJlJyxcblx0ICAgIGxhYmVsOiAnQWxpZ24gb24gdGhpcyBmZWF0dXJlLicsXG5cdCAgICBpY29uOiAnZm9ybWF0X2FsaWduX2NlbnRlcicsXG5cdCAgICB0b29sdGlwOiAnQWxpZ25zIHRoZSBkaXNwbGF5ZWQgZ2Vub21lcyBhcm91bmQgdGhpcyBmZWF0dXJlLicsXG5cdCAgICBoYW5kbGVyOiAoZikgPT4ge1xuXHRcdGxldCBpZHMgPSAobmV3IFNldChPYmplY3Qua2V5cyh0aGlzLmhpRmVhdHMpKSkuYWRkKGYuaWQpO1xuXHQgICAgICAgIHRoaXMuYXBwLnNldENvbnRleHQoe2xhbmRtYXJrOmYuaWQsIGRlbHRhOjAsIGhpZ2hsaWdodDpBcnJheS5mcm9tKGlkcyl9KVxuXHQgICAgfVxuXHR9LHtcblx0ICAgIG5hbWU6ICd0b01HSScsXG5cdCAgICBsYWJlbDogJ0ZlYXR1cmVATUdJJywgXG5cdCAgICBpY29uOiAnb3Blbl9pbl9uZXcnLFxuXHQgICAgdG9vbHRpcDogJ1NlZSBkZXRhaWxzIGZvciB0aGlzIGZlYXR1cmUgYXQgTUdJLicsXG5cdCAgICBoYW5kbGVyOiAoZikgPT4geyB3aW5kb3cub3BlbihgaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL2FjY2Vzc2lvbi8ke2YuaWR9YCwgJ19ibGFuaycpIH1cblx0fSx7XG5cdCAgICBuYW1lOiAndG9Nb3VzZU1pbmUnLFxuXHQgICAgbGFiZWw6ICdGZWF0dXJlQE1vdXNlTWluZScsIFxuXHQgICAgaWNvbjogJ29wZW5faW5fbmV3Jyxcblx0ICAgIHRvb2x0aXA6ICdTZWUgZGV0YWlscyBmb3IgdGhpcyBmZWF0dXJlIGF0IE1vdXNlTWluZS4nLFxuXHQgICAgaGFuZGxlcjogKGYpID0+IHRoaXMuYXBwLmxpbmtUb1JlcG9ydFBhZ2UoZilcblx0fSx7XG5cdCAgICBuYW1lOiAnZ2Vub21pY1NlcURvd25sb2FkJyxcblx0ICAgIGxhYmVsOiAnR2Vub21pYyBzZXF1ZW5jZXMnLCBcblx0ICAgIGljb246ICdjbG91ZF9kb3dubG9hZCcsXG5cdCAgICB0b29sdGlwOiAnRG93bmxvYWQgZ2Vub21pYyBzZXF1ZW5jZXMgZm9yIHRoaXMgZmVhdHVyZSBmcm9tIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcy4nLFxuXHQgICAgaGFuZGxlcjogKGYpID0+IHsgXG5cdFx0dGhpcy5hcHAuZG93bmxvYWRGYXN0YShmLCAnZ2Vub21pYycsIHRoaXMuYXBwLnZHZW5vbWVzLm1hcCh2Zz0+dmcubGFiZWwpKTtcblx0ICAgIH1cblx0fSx7XG5cdCAgICBuYW1lOiAndHhwU2VxRG93bmxvYWQnLFxuXHQgICAgbGFiZWw6ICdUcmFuc2NyaXB0IHNlcXVlbmNlcycsIFxuXHQgICAgaWNvbjogJ2Nsb3VkX2Rvd25sb2FkJyxcblx0ICAgIHRvb2x0aXA6ICdEb3dubG9hZCB0cmFuc2NyaXB0IHNlcXVlbmNlcyBvZiB0aGlzIGZlYXR1cmUgZnJvbSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMuJyxcblx0ICAgIGhhbmRsZXI6IChmKSA9PiB7IFxuXHRcdHRoaXMuYXBwLmRvd25sb2FkRmFzdGEoZiwgJ3RyYW5zY3JpcHQnLCB0aGlzLmFwcC52R2Vub21lcy5tYXAodmc9PnZnLmxhYmVsKSk7XG5cdCAgICB9XG5cdH0se1xuXHQgICAgbmFtZTogJ2Nkc1NlcURvd25sb2FkJyxcblx0ICAgIGxhYmVsOiAnQ0RTIHNlcXVlbmNlcycsIFxuXHQgICAgaWNvbjogJ2Nsb3VkX2Rvd25sb2FkJyxcblx0ICAgIHRvb2x0aXA6ICdEb3dubG9hZCBjb2Rpbmcgc2VxdWVuY2VzIG9mIHRoaXMgZmVhdHVyZSBmcm9tIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcy4nLFxuXHQgICAgZGlzYWJsZXI6IChmKSA9PiBmLmJpb3R5cGUuaW5kZXhPZigncHJvdGVpbicpID09PSAtMSwgLy8gZGlzYWJsZSBpZiBmIGlzIG5vdCBwcm90ZWluIGNvZGluZ1xuXHQgICAgaGFuZGxlcjogKGYpID0+IHsgXG5cdFx0dGhpcy5hcHAuZG93bmxvYWRGYXN0YShmLCAnY2RzJywgdGhpcy5hcHAudkdlbm9tZXMubWFwKHZnPT52Zy5sYWJlbCkpO1xuXHQgICAgfVxuXHR9LHtcblx0ICAgIG5hbWU6ICdleG9uU2VxRG93bmxvYWQnLFxuXHQgICAgbGFiZWw6ICdFeG9uIHNlcXVlbmNlcycsIFxuXHQgICAgaWNvbjogJ2Nsb3VkX2Rvd25sb2FkJyxcblx0ICAgIHRvb2x0aXA6ICdEb3dubG9hZCBleG9uIHNlcXVlbmNlcyBvZiB0aGlzIGZlYXR1cmUgZnJvbSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMuJyxcblx0ICAgIGRpc2FibGVyOiAoZikgPT4gZi50eXBlLmluZGV4T2YoJ2dlbmUnKSA9PT0gLTEsXG5cdCAgICBoYW5kbGVyOiAoZikgPT4geyBcblx0XHR0aGlzLmFwcC5kb3dubG9hZEZhc3RhKGYsICdleG9uJywgdGhpcy5hcHAudkdlbm9tZXMubWFwKHZnPT52Zy5sYWJlbCkpO1xuXHQgICAgfVxuXHR9XTtcbiAgICAgIC8vXG4gICAgICB0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgLy9cbiAgICBpbml0RG9tICgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgciA9IHRoaXMucm9vdDtcblx0bGV0IGEgPSB0aGlzLmFwcDtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy5maWR1Y2lhbHMgPSB0aGlzLnN2Zy5pbnNlcnQoJ2cnLCc6Zmlyc3QtY2hpbGQnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ2ZpZHVjaWFscycpO1xuICAgICAgICB0aGlzLnN0cmlwc0dycCA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ2cnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ3N0cmlwcycpO1xuICAgICAgICB0aGlzLmF4aXMgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCdheGlzJyk7XG4gICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0ID0gdGhpcy5zdmdNYWluLmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywnZmxvYXRpbmdUZXh0Jyk7XG4gICAgICAgIHRoaXMuY3h0TWVudSA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiY3h0TWVudVwiXScpO1xuICAgICAgICAvL1xuXHQvL1xuXHRyLnNlbGVjdCgnLmJ1dHRvbi5jbG9zZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4gdGhpcy51cGRhdGUoKSk7XG5cblx0Ly8gem9vbSBjb250cm9sc1xuXHRyLnNlbGVjdCgnI3pvb21PdXQnKS5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnpvb20oYS5kZWZhdWx0Wm9vbSkgfSk7XG5cdHIuc2VsZWN0KCcjem9vbUluJykgLm9uKCdjbGljaycsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgxL2EuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdCgnI3pvb21PdXRNb3JlJykub24oJ2NsaWNrJyxcblx0ICAgICgpID0+IHsgYS56b29tKDIqYS5kZWZhdWx0Wm9vbSkgfSk7XG5cdHIuc2VsZWN0KCcjem9vbUluTW9yZScpIC5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnpvb20oMS8oMiphLmRlZmF1bHRab29tKSkgfSk7XG5cblx0Ly8gcGFuIGNvbnRyb2xzXG5cdHIuc2VsZWN0KCcjcGFuTGVmdCcpIC5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnBhbigtYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoJyNwYW5SaWdodCcpLm9uKCdjbGljaycsXG5cdCAgICAoKSA9PiB7IGEucGFuKCthLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdCgnI3BhbkxlZnRNb3JlJykgLm9uKCdjbGljaycsXG5cdCAgICAoKSA9PiB7IGEucGFuKC01KmEuZGVmYXVsdFBhbikgfSk7XG5cdHIuc2VsZWN0KCcjcGFuUmlnaHRNb3JlJykub24oJ2NsaWNrJyxcblx0ICAgICgpID0+IHsgYS5wYW4oKzUqYS5kZWZhdWx0UGFuKSB9KTtcblxuXHQvL1xuXHR0aGlzLnJvb3Rcblx0ICAub24oJ2NsaWNrJywgKCkgPT4ge1xuXHQgICAgICAvLyBjbGljayBvbiBiYWNrZ3JvdW5kID0+IGhpZGUgY29udGV4dCBtZW51XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICh0Z3QudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaScgJiYgdGd0LmlubmVySFRNTCA9PT0gJ21lbnUnKVxuXHRcdCAgLy8gZXhjZXB0aW9uOiB0aGUgY29udGV4dCBtZW51IGJ1dHRvbiBpdHNlbGZcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgZWxzZVxuXHRcdCAgdGhpcy5oaWRlQ29udGV4dE1lbnUoKVxuXHQgIH0pO1xuXG5cdC8vIEZlYXR1cmUgbW91c2UgZXZlbnQgaGFuZGxlcnMuXG5cdC8vXG5cdGxldCBmQ2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKGYsIGV2dCwgcHJlc2VydmUpIHtcblx0ICAgIGxldCBpZCA9IGYuaWQ7XG5cdCAgICBpZiAoZXZ0LmN0cmxLZXkpIHtcblx0ICAgICAgICBsZXQgY3ggPSBkMy5ldmVudC5jbGllbnRYO1xuXHQgICAgICAgIGxldCBjeSA9IGQzLmV2ZW50LmNsaWVudFk7XG5cdCAgICAgICAgbGV0IGJiID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJ6b29tY29udHJvbHNcIl0gPiAubWVudSA+IC5idXR0b24nKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0ZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRoaXMuc2hvd0NvbnRleHRNZW51KHRoaXMuZmN4dE1lbnVDZmcsIGYsIGN4LWJiLngsIGN5LWJiLnkpO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZiAoZXZ0LnNoaWZ0S2V5KSB7XG5cdFx0aWYgKHRoaXMuaGlGZWF0c1tpZF0pXG5cdFx0ICAgIGRlbGV0ZSB0aGlzLmhpRmVhdHNbaWRdXG5cdFx0ZWxzZVxuXHRcdCAgICB0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRpZiAoIXByZXNlcnZlKSB0aGlzLmhpRmVhdHMgPSB7fTtcblx0XHR0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdCAgICAvLyBGSVhNRTogcmVhY2hvdmVyXG5cdCAgICB0aGlzLmFwcC5mZWF0dXJlRGV0YWlscy51cGRhdGUoZik7XG5cdH0uYmluZCh0aGlzKTtcblx0Ly9cblx0bGV0IGZNb3VzZU92ZXJIYW5kbGVyID0gZnVuY3Rpb24oZikge1xuXHRcdGlmIChkMy5ldmVudC5hbHRLZXkpIHtcblx0XHQgICAgLy8gSWYgdXNlciBpcyBob2xkaW5nIHRoZSBhbHQga2V5LCBzZWxlY3QgZXZlcnl0aGluZyB0b3VjaGVkLlxuXHRcdCAgICBmQ2xpY2tIYW5kbGVyKGYsIGQzLmV2ZW50LCB0cnVlKTtcblx0XHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0XHQgICAgLy8gRG9uJ3QgcmVnaXN0ZXIgY29udGV4dCBjaGFuZ2VzIHVudGlsIHVzZXIgaGFzIHBhdXNlZCBmb3IgYXQgbGVhc3QgMXMuXG5cdFx0ICAgIGlmICh0aGlzLnRpbWVvdXQpIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcblx0XHQgICAgdGhpcy50aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXsgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTsgfS5iaW5kKHRoaXMpLCAxMDAwKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIHRoaXMuaGlnaGxpZ2h0KGYpO1xuXHRcdCAgICBpZiAoZDMuZXZlbnQuY3RybEtleSlcblx0XHQgICAgICAgIHRoaXMuYXBwLmZlYXR1cmVEZXRhaWxzLnVwZGF0ZShmKTtcblx0XHR9XG5cdH0uYmluZCh0aGlzKTtcblx0Ly9cblx0bGV0IGZNb3VzZU91dEhhbmRsZXIgPSBmdW5jdGlvbihmKSB7XG5cdFx0dGhpcy5oaWdobGlnaHQoKTsgXG5cdH0uYmluZCh0aGlzKTtcblxuXHQvLyBcbiAgICAgICAgdGhpcy5zdmdcblx0ICAub24oJ2NsaWNrJywgKCkgPT4ge1xuXHQgICAgICBsZXQgdCA9IGQzLmV2ZW50LnRhcmdldDtcblx0ICAgICAgbGV0IHRndCA9IGQzLnNlbGVjdCh0KTtcblx0ICAgICAgaWYgKHRoaXMuZGVhbFdpdGhVbndhbnRlZENsaWNrRXZlbnQpIHtcblx0ICAgICAgICAgIHRoaXMuZGVhbFdpdGhVbndhbnRlZENsaWNrRXZlbnQgPSBmYWxzZTtcblx0XHQgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICBpZiAodC50YWdOYW1lID09ICdyZWN0JyAmJiAodC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZlYXR1cmUnKSB8fCB0LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmZWF0dXJlJykpKSB7XG5cdFx0ICAvLyB1c2VyIGNsaWNrZWQgb24gYSBmZWF0dXJlXG5cdFx0ICBmQ2xpY2tIYW5kbGVyKHQuX19kYXRhX18sIGQzLmV2ZW50KTtcblx0XHQgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdCAgICAgICAgICB0aGlzLmFwcC5jb250ZXh0Q2hhbmdlZCgpO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2UgaWYgKHQudGFnTmFtZSA9PSAncmVjdCcgJiYgdC5jbGFzc0xpc3QuY29udGFpbnMoJ2V4b24nKSkge1xuXHRcdCAgLy8gdXNlciBjbGlja2VkIG9uIGEgZmVhdHVyZVxuXHRcdCAgZkNsaWNrSGFuZGxlcih0Ll9fZGF0YV9fLmZlYXR1cmUsIGQzLmV2ZW50KTtcblx0XHQgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdCAgICAgICAgICB0aGlzLmFwcC5jb250ZXh0Q2hhbmdlZCgpO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2UgaWYgKCFkMy5ldmVudC5zaGlmdEtleSAmJiBcblx0ICAgICAgICAgICh0LnRhZ05hbWUgPT09ICdzdmcnIFxuXHRcdCAgfHwgdC50YWdOYW1lID09ICdyZWN0JyAmJiB0LmNsYXNzTGlzdC5jb250YWlucygnYmxvY2snKVxuXHRcdCAgfHwgdC50YWdOYW1lID09ICdyZWN0JyAmJiB0LmNsYXNzTGlzdC5jb250YWlucygndW5kZXJsYXknKVxuXHRcdCAgKSl7XG5cdFx0ICAvLyB1c2VyIGNsaWNrZWQgb24gYmFja2dyb3VuZFxuXHRcdCAgdGhpcy5oaUZlYXRzID0ge307XG5cdFx0ICB0aGlzLmhpZ2hsaWdodCgpO1xuXHRcdCAgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTtcblx0ICAgICAgfVxuXHQgIH0pXG5cdCAgLm9uKCdjb250ZXh0bWVudScsICgpID0+IHtcblx0ICAgICAgbGV0IHRndCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpO1xuXHQgICAgICBsZXQgZiA9IHRndC5kYXRhKClbMF07XG5cdCAgICAgIGYgPSBmID8gZi5mZWF0dXJlIHx8IGYgOiBmO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZDbGlja0hhbmRsZXIoZiwgZDMuZXZlbnQpO1xuXHQgICAgICB9XG5cdCAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgIH0pXG5cdCAgLm9uKCdtb3VzZW92ZXInLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBmID0gZiA/IGYuZmVhdHVyZSB8fCBmIDogZjtcblx0ICAgICAgaWYgKGYgaW5zdGFuY2VvZiBGZWF0dXJlKSB7XG5cdFx0ICBmTW91c2VPdmVySGFuZGxlcihmKTtcblx0ICAgICAgfVxuXHQgIH0pXG5cdCAgLm9uKCdtb3VzZW91dCcsICgpID0+IHtcblx0ICAgICAgbGV0IHRndCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpO1xuXHQgICAgICBsZXQgZiA9IHRndC5kYXRhKClbMF07XG5cdCAgICAgIGYgPSBmID8gZi5mZWF0dXJlIHx8IGYgOiBmO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU91dEhhbmRsZXIoZik7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbignd2hlZWwnLCBmdW5jdGlvbihkKSB7XG5cdCAgICBsZXQgZSA9IGQzLmV2ZW50O1xuXHQgICAgLy8gbGV0IHRoZSBicm93c2VyIGhhbmRsZXIgdmVydGljYWwgbW90aW9uXG5cdCAgICBpZiAoTWF0aC5hYnMoZS5kZWx0YVgpIDwgTWF0aC5hYnMoZS5kZWx0YVkpKVxuXHQgICAgICAgIHJldHVybjtcblx0ICAgIC8vIHdlIGhhbmRsZSBob3Jpem9udGFsIG1vdGlvbi5cblx0ICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAvLyBmaWx0ZXIgb3V0IHRpbnkgbW90aW9uc1xuXHQgICAgaWYgKE1hdGguYWJzKGUuZGVsdGFYKSA8IHRoaXMud2hlZWxUaHJlc2hvbGQpIFxuXHQgICAgICAgIHJldHVybjtcblx0ICAgIC8vIGdldCB0aGUgem9vbSBzdHJpcCB0YXJnZXQsIGlmIGl0IGV4aXN0cywgZWxzZSB0aGUgcmVmIHpvb20gc3RyaXAuXG5cdCAgICBsZXQgeiA9IGUudGFyZ2V0LmNsb3Nlc3QoJ2cuem9vbVN0cmlwJykgfHwgZDMuc2VsZWN0KCdnLnpvb21TdHJpcC5yZWZlcmVuY2UnKVswXVswXTtcblx0ICAgIGlmICgheikgcmV0dXJuO1xuXG5cdCAgICBsZXQgZGIgPSBlLmRlbHRhWCAvIHNlbGYucHBiOyAvLyBkZWx0YSBpbiBiYXNlcyBmb3IgdGhpcyBldmVudFxuXHQgICAgbGV0IHpkID0gei5fX2RhdGFfXztcblx0ICAgIGlmIChlLmN0cmxLZXkpIHtcblx0XHQvLyBDdHJsLXdoZWVsIHNpbXBseSBzbGlkZXMgdGhlIHN0cmlwIGhvcml6b250YWxseSAodGVtcG9yYXJ5KVxuXHRcdC8vIEZvciBjb21wYXJpc29uIGdlbm9tZXMsIGp1c3QgdHJhbnNsYXRlIHRoZSBibG9ja3MgYnkgdGhlIHdoZWVsIGFtb3VudCwgc28gdGhlIHVzZXIgY2FuIFxuXHRcdC8vIHNlZSBldmVyeXRoaW5nLlxuXHRcdHpkLmRlbHRhQiArPSBkYjtcblx0ICAgICAgICBkMy5zZWxlY3Qoeikuc2VsZWN0KCdnW25hbWU9XCJzQmxvY2tzXCJdJykuYXR0cigndHJhbnNmb3JtJyxgdHJhbnNsYXRlKCR7LXpkLmRlbHRhQiAqIHNlbGYucHBifSwwKXNjYWxlKCR7emQueFNjYWxlfSwxKWApO1xuXHRcdHNlbGYuZHJhd0ZpZHVjaWFscygpO1xuXHRcdHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgLy8gTm9ybWFsIHdoZWVsIGV2ZW50ID0gcGFuIHRoZSB2aWV3LlxuXHQgICAgLy9cblx0ICAgIGxldCBjICA9IHNlbGYuYXBwLmNvb3Jkcztcblx0ICAgIC8vIExpbWl0IGRlbHRhIGJ5IGNociBlbmRzXG5cdCAgICAvLyBEZWx0YSBpbiBiYXNlczpcblx0ICAgIHpkLmRlbHRhQiA9IGNsaXAoemQuZGVsdGFCICsgZGIsIC1jLnN0YXJ0LCBjLmNocm9tb3NvbWUubGVuZ3RoIC0gYy5lbmQpXG5cdCAgICAvLyB0cmFuc2xhdGVcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoJ2cuem9vbVN0cmlwID4gZ1tuYW1lPVwic0Jsb2Nrc1wiXScpXG5cdFx0LmF0dHIoJ3RyYW5zZm9ybScsIGN6ID0+IGB0cmFuc2xhdGUoJHstemQuZGVsdGFCICogc2VsZi5wcGJ9LDApc2NhbGUoJHtjei54U2NhbGV9LDEpYCk7XG5cdCAgICBzZWxmLmRyYXdGaWR1Y2lhbHMoKTtcblx0ICAgIC8vIFdhaXQgdW50aWwgd2hlZWwgZXZlbnRzIGhhdmUgc3RvcHBlZCBmb3IgYSB3aGlsZSwgdGhlbiBzY3JvbGwgdGhlIHZpZXcuXG5cdCAgICBpZiAoc2VsZi50aW1lb3V0KVxuXHQgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KTtcblx0ICAgIHNlbGYudGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcblx0XHRzZWxmLnRpbWVvdXQgPSBudWxsO1xuXHRcdGxldCBjY3h0ID0gc2VsZi5hcHAuZ2V0Q29udGV4dCgpO1xuXHRcdGlmIChjY3h0LmxhbmRtYXJrKSB7XG5cdFx0ICAgIHNlbGYuYXBwLnNldENvbnRleHQoeyBkZWx0YTogY2N4dC5kZWx0YSArIHpkLmRlbHRhQiB9KTtcblx0XHQgICAgemQuZGVsdGFCID0gMDtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIHNlbGYuYXBwLnNldENvbnRleHQoeyBcblx0XHQgICAgICAgIHN0YXJ0OiBjY3h0LnN0YXJ0ICsgemQuZGVsdGFCLFxuXHRcdCAgICAgICAgZW5kOiBjY3h0LmVuZCArIHpkLmRlbHRhQlxuXHRcdFx0fSk7XG5cdFx0ICAgIHpkLmRlbHRhQiA9IDA7XG5cdFx0fVxuXHQgICAgfSwgNTApO1xuXHR9KTtcblxuXG5cdC8vIEJ1dHRvbjogRHJvcCBkb3duIG1lbnUgaW4gem9vbSB2aWV3XG5cdHRoaXMucm9vdC5zZWxlY3QoJy5tZW51ID4gLmJ1dHRvbicpXG5cdCAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgLy8gc2hvdyBjb250ZXh0IG1lbnUgYXQgbW91c2UgZXZlbnQgY29vcmRpbmF0ZXNcblx0ICAgICAgbGV0IGN4ID0gZDMuZXZlbnQuY2xpZW50WDtcblx0ICAgICAgbGV0IGN5ID0gZDMuZXZlbnQuY2xpZW50WTtcblx0ICAgICAgbGV0IGJiID0gZDMuc2VsZWN0KHRoaXMpWzBdWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICBkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgc2VsZi5zaG93Q29udGV4dE1lbnUoc2VsZi5jeHRNZW51Q2ZnLCBudWxsLCBjeC1iYi5sZWZ0LCBjeS1iYi50b3ApO1xuXHQgIH0pO1xuXHQvLyB6b29tIGNvb3JkaW5hdGVzIGJveFxuXHR0aGlzLnJvb3Quc2VsZWN0KCcjem9vbUNvb3JkcycpXG5cdCAgICAuY2FsbCh6Y3MgPT4gemNzWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKHRoaXMuYXBwLmNvb3JkcykpXG5cdCAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkgeyB0aGlzLnNlbGVjdCgpOyB9KVxuXHQgICAgLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7IHNlbGYuYXBwLnNldENvb3JkaW5hdGVzKHRoaXMudmFsdWUpOyB9KTtcblxuXHQvLyB6b29tIHdpbmRvdyBzaXplIGJveFxuXHR0aGlzLnJvb3Quc2VsZWN0KCcjem9vbVdTaXplJylcblx0ICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7IHRoaXMuc2VsZWN0KCk7IH0pXG5cdCAgICAub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIGxldCB3cyA9IHBhcnNlSW50KHRoaXMudmFsdWUpO1xuXHRcdGxldCBjID0gc2VsZi5hcHAuY29vcmRzO1xuXHRcdGlmIChpc05hTih3cykgfHwgd3MgPCAxMDApIHtcblx0XHQgICAgYWxlcnQoJ0ludmFsaWQgd2luZG93IHNpemUuIFBsZWFzZSBlbnRlciBhbiBpbnRlZ2VyID49IDEwMC4nKTtcblx0XHQgICAgdGhpcy52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICBsZXQgbWlkID0gKGMuc3RhcnQgKyBjLmVuZCkgLyAyO1xuXHRcdCAgICBsZXQgbmV3cyA9IE1hdGgucm91bmQobWlkIC0gd3MvMik7XG5cdFx0ICAgIGxldCBuZXdlID0gbmV3cyArIHdzIC0gMTtcblx0XHQgICAgc2VsZi5hcHAuc2V0Q29udGV4dCh7XG5cdFx0ICAgICAgICBjaHI6IGMuY2hyLFxuXHRcdFx0c3RhcnQ6IG5ld3MsXG5cdFx0XHRlbmQ6IG5ld2UsXG5cdFx0XHRsZW5ndGg6IG5ld2UtbmV3cysxXG5cdFx0ICAgIH0pO1xuXHRcdH1cblx0ICAgIH0pO1xuXHQvLyB6b29tIGRyYXdpbmcgbW9kZSBcblx0dGhpcy5yb290LnNlbGVjdEFsbCgnZGl2W25hbWU9XCJ6b29tRG1vZGVcIl0gLmJ1dHRvbicpXG5cdCAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0aWYgKGQzLnNlbGVjdCh0aGlzKS5hdHRyKCdkaXNhYmxlZCcpKVxuXHRcdCAgICByZXR1cm47XG5cdFx0bGV0IHIgPSBzZWxmLnJvb3Q7XG5cdFx0bGV0IGlzQyA9IHIuY2xhc3NlZCgnY29tcGFyaXNvbicpO1xuXHRcdHIuY2xhc3NlZCgnY29tcGFyaXNvbicsICFpc0MpO1xuXHRcdHIuY2xhc3NlZCgncmVmZXJlbmNlJywgaXNDKTtcblx0XHRzZWxmLmFwcC5zZXRDb250ZXh0KHtkbW9kZTogci5jbGFzc2VkKCdjb21wYXJpc29uJykgPyAnY29tcGFyaXNvbicgOiAncmVmZXJlbmNlJ30pO1xuXHQgICAgfSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldCBoaWdobGlnaHRlZCAoaGxzKSB7XG5cdGlmICh0eXBlb2YoaGxzKSA9PT0gJ3N0cmluZycpXG5cdCAgICBobHMgPSBbaGxzXTtcblx0Ly9cblx0dGhpcy5oaUZlYXRzID0ge307XG4gICAgICAgIGZvcihsZXQgaCBvZiBobHMpe1xuXHQgICAgdGhpcy5oaUZlYXRzW2hdID0gaDtcblx0fVxuICAgIH1cbiAgICBnZXQgaGlnaGxpZ2h0ZWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaUZlYXRzID8gT2JqZWN0LmtleXModGhpcy5oaUZlYXRzKSA6IFtdO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dGbG9hdGluZ1RleHQgKHRleHQsIHgsIHkpIHtcblx0bGV0IHNyID0gdGhpcy5zdmcubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHR4ID0geC1zci54LTEyO1xuXHR5ID0geS1zci55O1xuXHRsZXQgYW5jaG9yID0geCA8IDYwID8gJ3N0YXJ0JyA6IHRoaXMud2lkdGgteCA8IDYwID8gJ2VuZCcgOiAnbWlkZGxlJztcblx0dGhpcy5mbG9hdGluZ1RleHRcblx0ICAgIC50ZXh0KHRleHQpXG5cdCAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJyxhbmNob3IpXG5cdCAgICAuYXR0cigneCcsIHgpXG5cdCAgICAuYXR0cigneScsIHkpXG4gICAgfVxuICAgIGhpZGVGbG9hdGluZ1RleHQgKCkge1xuXHR0aGlzLmZsb2F0aW5nVGV4dC50ZXh0KCcnKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdENvbnRleHRNZW51IChpdGVtcyxvYmopIHtcblx0dGhpcy5jeHRNZW51LnNlbGVjdEFsbCgnLm1lbnVJdGVtJykucmVtb3ZlKCk7IC8vIGluIGNhc2Ugb2YgcmUtaW5pdFxuICAgICAgICBsZXQgbWl0ZW1zID0gdGhpcy5jeHRNZW51XG5cdCAgLnNlbGVjdEFsbCgnLm1lbnVJdGVtJylcblx0ICAuZGF0YShpdGVtcyk7XG5cdGxldCBuZXdzID0gbWl0ZW1zLmVudGVyKClcblx0ICAuYXBwZW5kKCdkaXYnKVxuXHQgIC5hdHRyKCdjbGFzcycsIChkKSA9PiBgbWVudUl0ZW0gZmxleHJvdyAke2QuY2xzfHwnJ31gKVxuXHQgIC5jbGFzc2VkKCdkaXNhYmxlZCcsIGQgPT4gZC5kaXNhYmxlciA/IGQuZGlzYWJsZXIob2JqKSA6IGZhbHNlKVxuXHQgIC5hdHRyKCduYW1lJywgZCA9PiBkLm5hbWUgfHwgbnVsbCApXG5cdCAgLmF0dHIoJ3RpdGxlJywgZCA9PiBkLnRvb2x0aXAgfHwgbnVsbCApO1xuXG5cdGxldCBoYW5kbGVyID0gZCA9PiB7XG5cdCAgICAgIGlmIChkLmRpc2FibGVyICYmIGQuZGlzYWJsZXIob2JqKSlcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgZC5oYW5kbGVyICYmIGQuaGFuZGxlcihvYmopO1xuXHQgICAgICB0aGlzLmhpZGVDb250ZXh0TWVudSgpO1xuXHQgICAgICBkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fTtcblx0bmV3cy5hcHBlbmQoJ2xhYmVsJylcblx0ICAudGV4dChkID0+IHR5cGVvZihkLmxhYmVsKSA9PT0gJ2Z1bmN0aW9uJyA/IGQubGFiZWwob2JqKSA6IGQubGFiZWwpXG5cdCAgLm9uKCdjbGljaycsIGhhbmRsZXIpXG5cdCAgLm9uKCdjb250ZXh0bWVudScsIGhhbmRsZXIpO1xuXHRuZXdzLmFwcGVuZCgnaScpXG5cdCAgLmF0dHIoJ2NsYXNzJywgJ21hdGVyaWFsLWljb25zJylcblx0ICAudGV4dCggZD0+ZC5pY29uICk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dDb250ZXh0TWVudSAoY2ZnLGYseCx5KSB7XG4gICAgICAgIHRoaXMuaW5pdENvbnRleHRNZW51KGNmZywgZik7XG4gICAgICAgIHRoaXMuY3h0TWVudVxuXHQgICAgLmNsYXNzZWQoJ3Nob3dpbmcnLCB0cnVlKVxuXHQgICAgLnN0eWxlKCdsZWZ0JywgYCR7eH1weGApXG5cdCAgICAuc3R5bGUoJ3RvcCcsIGAke3l9cHhgKVxuXHQgICAgO1xuXHRpZiAoZikge1xuXHQgICAgdGhpcy5jeHRNZW51Lm9uKCdtb3VzZWVudGVyJywgKCk9PnRoaXMuaGlnaGxpZ2h0KGYpKTtcblx0ICAgIHRoaXMuY3h0TWVudS5vbignbW91c2VsZWF2ZScsICgpPT4ge1xuXHQgICAgICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdFx0dGhpcy5oaWRlQ29udGV4dE1lbnUoKTtcblx0ICAgIH0pO1xuXHR9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZGVDb250ZXh0TWVudSAoKSB7XG4gICAgICAgIHRoaXMuY3h0TWVudS5jbGFzc2VkKCdzaG93aW5nJywgZmFsc2UpO1xuXHR0aGlzLmN4dE1lbnUub24oJ21vdXNlZW50ZXInLCBudWxsKTtcblx0dGhpcy5jeHRNZW51Lm9uKCdtb3VzZWxlYXZlJywgbnVsbCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgZ3MgKGxpc3Qgb2YgR2Vub21lcylcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICAgIEZvciBlYWNoIEdlbm9tZSwgc2V0cyBnLnpvb21ZIFxuICAgIHNldCBnZW5vbWVzIChncykge1xuICAgICAgIGxldCBvZmZzZXQgPSB0aGlzLnRvcE9mZnNldDtcbiAgICAgICBncy5mb3JFYWNoKCBnID0+IHtcbiAgICAgICAgICAgZy56b29tWSA9IG9mZnNldDtcblx0ICAgb2Zmc2V0ICs9IHRoaXMubWluU3RyaXBIZWlnaHQgKyB0aGlzLnN0cmlwR2FwO1xuICAgICAgIH0pO1xuICAgICAgIHRoaXMuX2dlbm9tZXMgPSBncztcbiAgICB9XG4gICAgZ2V0IGdlbm9tZXMgKCkge1xuICAgICAgIHJldHVybiB0aGlzLl9nZW5vbWVzO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzIChzdHJpcGVzKSBpbiB0b3AtdG8tYm90dG9tIG9yZGVyLlxuICAgIC8vXG4gICAgZ2V0R2Vub21lWU9yZGVyICgpIHtcbiAgICAgICAgbGV0IHN0cmlwcyA9IHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoJy56b29tU3RyaXAnKTtcbiAgICAgICAgbGV0IHNzID0gc3RyaXBzWzBdLm1hcChnPT4ge1xuXHQgICAgbGV0IGJiID0gZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgIHJldHVybiBbYmIueSwgZy5fX2RhdGFfXy5nZW5vbWUubmFtZV07XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgbnMgPSBzcy5zb3J0KCAoYSxiKSA9PiBhWzBdIC0gYlswXSApLm1hcCggeCA9PiB4WzFdIClcblx0cmV0dXJuIG5zO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTZXRzIHRoZSB0b3AtdG8tYm90dG9tIG9yZGVyIG9mIHRoZSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMgYWNjb3JkaW5nIHRvIFxuICAgIC8vIHRoZSBnaXZlbiBuYW1lIGxpc3Qgb2YgbmFtZXMuIEJlY2F1c2Ugd2UgY2FuJ3QgZ3VhcmFudGVlIHRoZSBnaXZlbiBuYW1lcyBjb3JyZXNwb25kXG4gICAgLy8gdG8gYWN0dWFsIHpvb20gc3RyaXBzLCBvciB0aGF0IGFsbCBzdHJpcHMgYXJlIHJlcHJlc2VudGVkLCBldGMuXG4gICAgLy8gVGhlcmVmb3JlLCB0aGUgbGlzdCBpcyBwcmVwcmVjZXNzZWQgYXMgZm9sbG93czpcbiAgICAvLyAgICAgKiBkdXBsaWNhdGUgbmFtZXMsIGlmIHRoZXkgZXhpc3QsIGFyZSByZW1vdmVkXG4gICAgLy8gICAgICogbmFtZXMgdGhhdCBkbyBub3QgY29ycmVzcG9uZCB0byBleGlzdGluZyB6b29tU3RyaXBzIGFyZSByZW1vdmVkXG4gICAgLy8gICAgICogbmFtZXMgb2YgZXhpc3Rpbmcgem9vbSBzdHJpcHMgdGhhdCBkb24ndCBhcHBlYXIgaW4gdGhlIGxpc3QgYXJlIGFkZGVkIHRvIHRoZSBlbmRcbiAgICAvLyBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiBuYW1lcyB3aXRoIHRoZXNlIHByb3BlcnRpZXM6XG4gICAgLy8gICAgICogdGhlcmUgaXMgYSAxOjEgY29ycmVzcG9uZGVuY2UgYmV0d2VlbiBuYW1lcyBhbmQgYWN0dWFsIHpvb20gc3RyaXBzXG4gICAgLy8gICAgICogdGhlIG5hbWUgb3JkZXIgaXMgY29uc2lzdGVudCB3aXRoIHRoZSBpbnB1dCBsaXN0XG4gICAgLy8gVGhpcyBpcyB0aGUgbGlzdCB1c2VkIHRvIChyZSlvcmRlciB0aGUgem9vbSBzdHJpcHMuXG4gICAgLy9cbiAgICAvLyBHaXZlbiB0aGUgbGlzdCBvcmRlcjogXG4gICAgLy8gICAgICogYSBZLXBvc2l0aW9uIGlzIGFzc2lnbmVkIHRvIGVhY2ggZ2Vub21lXG4gICAgLy8gICAgICogem9vbSBzdHJpcHMgdGhhdCBhcmUgTk9UIENVUlJFTlRMWSBCRUlORyBEUkFHR0VEIGFyZSB0cmFuc2xhdGVkIHRvIHRoZWlyIG5ldyBsb2NhdGlvbnNcbiAgICAvL1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIG5zIChsaXN0IG9mIHN0cmluZ3MpIE5hbWVzIG9mIHRoZSBnZW5vbWVzLlxuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgIG5vdGhpbmdcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICAgIFJlY2FsY3VsYXRlcyB0aGUgWS1jb29yZGluYXRlcyBmb3IgZWFjaCBzdHJpcCBiYXNlZCBvbiB0aGUgZ2l2ZW4gb3JkZXIsIHRoZW4gdHJhbnNsYXRlc1xuICAgIC8vICAgICBlYWNoIHN0cmlwIHRvIGl0cyBuZXcgcG9zaXRpb24uXG4gICAgLy9cbiAgICBzZXRHZW5vbWVZT3JkZXIgKG5zKSB7XG5cdHRoaXMuZ2Vub21lcyA9IHJlbW92ZUR1cHMobnMpLm1hcChuPT4gdGhpcy5hcHAubmFtZTJnZW5vbWVbbl0gKS5maWx0ZXIoeD0+eCk7XG5cdGxldCBvID0gdGhpcy50b3BPZmZzZXQ7XG4gICAgICAgIHRoaXMuZ2Vub21lcy5mb3JFYWNoKCAoZyxpKSA9PiB7XG5cdCAgICBsZXQgc3RyaXAgPSBkMy5zZWxlY3QoYCN6b29tVmlldyAuem9vbVN0cmlwW25hbWU9XCIke2cubmFtZX1cIl1gKTtcblx0ICAgIGlmICghc3RyaXAuY2xhc3NlZCgnZHJhZ2dpbmcnKSlcblx0ICAgICAgICBzdHJpcC5hdHRyKCd0cmFuc2Zvcm0nLCBnZCA9PiBgdHJhbnNsYXRlKDAsJHtvICsgZ2QuemVyb09mZnNldH0pYCk7XG5cdCAgICBvICs9IHN0cmlwLmRhdGEoKVswXS5zdHJpcEhlaWdodCArIHRoaXMuc3RyaXBHYXA7XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBkcmFnZ2VyIChkMy5iZWhhdmlvci5kcmFnKSB0byBiZSBhdHRhY2hlZCB0byBlYWNoIHpvb20gc3RyaXAuXG4gICAgLy8gQWxsb3dzIHN0cmlwcyB0byBiZSByZW9yZGVyZWQgYnkgZHJhZ2dpbmcuXG4gICAgZ2V0RHJhZ2dlciAoKSB7ICBcbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBkMy5iZWhhdmlvci5kcmFnKClcblx0ICAub3JpZ2luKGZ1bmN0aW9uKGQsaSl7XG5cdCAgICAgIHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIH0pXG4gICAgICAgICAgLm9uKCdkcmFnc3RhcnQueicsIGZ1bmN0aW9uKGcpIHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC5zb3VyY2VFdmVudC50YXJnZXQ7XG5cdCAgICAgIGlmIChkMy5ldmVudC5zb3VyY2VFdmVudC5zaGlmdEtleSB8fCAhIGQzLnNlbGVjdCh0KS5jbGFzc2VkKCd6b29tU3RyaXBIYW5kbGUnKSl7XG5cdCAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgIH1cblx0ICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIGxldCBzdHJpcCA9IHRoaXMuY2xvc2VzdCgnLnpvb21TdHJpcCcpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nID0gZDMuc2VsZWN0KHN0cmlwKS5jbGFzc2VkKCdkcmFnZ2luZycsIHRydWUpO1xuXHQgIH0pXG5cdCAgLm9uKCdkcmFnLnonLCBmdW5jdGlvbiAoZykge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgbGV0IG14ID0gZDMubW91c2Uoc2VsZi5zdmdNYWluWzBdWzBdKVswXTtcblx0ICAgICAgbGV0IG15ID0gZDMubW91c2Uoc2VsZi5zdmdNYWluWzBdWzBdKVsxXTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZy5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bXl9KWApO1xuXHQgICAgICBzZWxmLnNldEdlbm9tZVlPcmRlcihzZWxmLmdldEdlbm9tZVlPcmRlcigpKTtcblx0ICAgICAgc2VsZi5kcmF3RmlkdWNpYWxzKCk7XG5cdCAgfSlcblx0ICAub24oJ2RyYWdlbmQueicsIGZ1bmN0aW9uIChnKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICAvL1xuXHQgICAgICBzZWxmLmRyYWdnaW5nLmNsYXNzZWQoJ2RyYWdnaW5nJywgZmFsc2UpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nID0gbnVsbDtcblx0ICAgICAgc2VsZi5zZXRHZW5vbWVZT3JkZXIoc2VsZi5nZXRHZW5vbWVZT3JkZXIoKSk7XG5cdCAgICAgIHNlbGYuYXBwLnNldENvbnRleHQoeyBnZW5vbWVzOiBzZWxmLmdldEdlbm9tZVlPcmRlcigpIH0pO1xuXHQgICAgICB3aW5kb3cuc2V0VGltZW91dCggc2VsZi5kcmF3RmlkdWNpYWxzLmJpbmQoc2VsZiksIDUwICk7XG5cdCAgfSlcblx0ICA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJCcnVzaGVzICgpIHtcblx0dGhpcy5yb290LnNlbGVjdEFsbCgnZy5icnVzaCcpXG5cdCAgICAuZWFjaCggZnVuY3Rpb24gKGIpIHtcblx0ICAgICAgICBiLmJydXNoLmNsZWFyKCk7XG5cdFx0ZDMuc2VsZWN0KHRoaXMpLmNhbGwoYi5icnVzaCk7XG5cdCAgICB9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGJydXNoIGNvb3JkaW5hdGVzLCB0cmFuc2xhdGVkIChpZiBuZWVkZWQpIHRvIHJlZiBnZW5vbWUgY29vcmRpbmF0ZXMuXG4gICAgYmJHZXRSZWZDb29yZHMgKCkge1xuICAgICAgbGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTtcbiAgICAgIGxldCBibGsgPSB0aGlzLmJydXNoaW5nO1xuICAgICAgbGV0IGV4dCA9IGJsay5icnVzaC5leHRlbnQoKTtcbiAgICAgIGxldCByID0geyBjaHI6IGJsay5jaHIsIHN0YXJ0OiBleHRbMF0sIGVuZDogZXh0WzFdLCBibG9ja0lkOmJsay5ibG9ja0lkIH07XG4gICAgICBsZXQgdHIgPSB0aGlzLmFwcC50cmFuc2xhdG9yO1xuICAgICAgaWYoIGJsay5nZW5vbWUgIT09IHJnICkge1xuICAgICAgICAgLy8gdXNlciBpcyBicnVzaGluZyBhIGNvbXAgZ2Vub21lcyBzbyBmaXJzdCB0cmFuc2xhdGVcblx0IC8vIGNvb3JkaW5hdGVzIHRvIHJlZiBnZW5vbWVcblx0IGxldCBycyA9IHRoaXMuYXBwLnRyYW5zbGF0b3IudHJhbnNsYXRlKGJsay5nZW5vbWUsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgcmcpO1xuXHQgaWYgKHJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHQgciA9IHJzWzBdO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICAgci5ibG9ja0lkID0gcmcubmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBoYW5kbGVyIGZvciB0aGUgc3RhcnQgb2YgYSBicnVzaCBhY3Rpb24gYnkgdGhlIHVzZXIgb24gYSBibG9ja1xuICAgIGJiU3RhcnQgKGJsayxiRWx0KSB7XG4gICAgICB0aGlzLmJydXNoaW5nID0gYmxrO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBiYkJydXNoICgpIHtcbiAgICAgICAgbGV0IGV2ID0gZDMuZXZlbnQuc291cmNlRXZlbnQ7XG5cdGxldCB4dCA9IHRoaXMuYnJ1c2hpbmcuYnJ1c2guZXh0ZW50KCk7XG5cdGxldCBzID0gTWF0aC5yb3VuZCh4dFswXSk7XG5cdGxldCBlID0gTWF0aC5yb3VuZCh4dFsxXSk7XG5cdHRoaXMuc2hvd0Zsb2F0aW5nVGV4dChgJHt0aGlzLmJydXNoaW5nLmNocn06JHtzfS4uJHtlfWAsIGV2LmNsaWVudFgsIGV2LmNsaWVudFkpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBiYkVuZCAoKSB7XG4gICAgICBsZXQgc2UgPSBkMy5ldmVudC5zb3VyY2VFdmVudDtcbiAgICAgIGxldCB4dCA9IHRoaXMuYnJ1c2hpbmcuYnJ1c2guZXh0ZW50KCk7XG4gICAgICBsZXQgZyA9IHRoaXMuYnJ1c2hpbmcuZ2Vub21lLmxhYmVsO1xuICAgICAgLy9cbiAgICAgIHRoaXMuaGlkZUZsb2F0aW5nVGV4dCgpO1xuICAgICAgLy9cbiAgICAgIGlmIChzZS5jdHJsS2V5IHx8IHNlLmFsdEtleSB8fCBzZS5tZXRhS2V5KSB7XG5cdCAgdGhpcy5jbGVhckJydXNoZXMoKTtcblx0ICB0aGlzLmJydXNoaW5nID0gbnVsbDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvL1xuICAgICAgaWYgKE1hdGguYWJzKHh0WzBdIC0geHRbMV0pIDw9IDEwKSB7XG5cdCAgLy8gVXNlciBjbGlja2VkLiBSZWNlbnRlciB2aWV3LlxuXHQgIGxldCB4bWlkID0gKHh0WzBdICsgeHRbMV0pLzI7XG5cdCAgbGV0IHcgPSB0aGlzLmFwcC5jb29yZHMuZW5kIC0gdGhpcy5hcHAuY29vcmRzLnN0YXJ0ICsgMTtcblx0ICBsZXQgcyA9IE1hdGgucm91bmQoeG1pZCAtIHcvMik7XG5cdCAgdGhpcy5hcHAuc2V0Q29udGV4dCh7IHJlZjpnLCBjaHI6IHRoaXMuYnJ1c2hpbmcuY2hyLCBzdGFydDogcywgZW5kOiBzICsgdyAtIDEgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcblx0ICAvLyBVc2VyIGRyYWdnZWQuIFpvb20gaW4gb3Igb3V0LlxuXHQgIHRoaXMuYXBwLnNldENvbnRleHQoeyByZWY6ZywgY2hyOiB0aGlzLmJydXNoaW5nLmNociwgc3RhcnQ6eHRbMF0sIGVuZDp4dFsxXSB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2xlYXJCcnVzaGVzKCk7XG4gICAgICB0aGlzLmJydXNoaW5nID0gbnVsbDtcbiAgICAgIHRoaXMuZGVhbFdpdGhVbndhbnRlZENsaWNrRXZlbnQgPSB0cnVlO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWdobGlnaHRTdHJpcCAoZywgZWx0KSB7XG5cdGlmIChnID09PSB0aGlzLmN1cnJlbnRITEcpIHJldHVybjtcblx0dGhpcy5jdXJyZW50SExHID0gZztcblx0Ly9cblx0dGhpcy5zdmdNYWluLnNlbGVjdEFsbCgnLnpvb21TdHJpcCcpXG5cdCAgICAuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCBkID0+IGQuZ2Vub21lID09PSBnKTtcblx0dGhpcy5hcHAuc2hvd0Jsb2NrcyhnKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBCYXNlZCBvbiB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSwgc2V0cyB0aGUgc2hvd0ZlYXR1cmVEZXRhaWxzIGZsYWcgdG8gdHJ1ZSBvciBmYWxzZS5cbiAgICAvLyBBbHNvIHNldHMgdGhlIGNsZWFyQWxsIGZsYWcgdG8gdHJ1ZSBpZiB0aGUgc2hvd0ZlYXR1cmVEZXRhaWxzIGZsYWcgY2hhbmdlZCB2YWx1ZS5cbiAgICAvL1xuICAgIHNldFNob3dGZWF0dXJlRGV0YWlscyAoYykge1xuXHQvL1xuXHRsZXQgcHJldlNGRCA9IHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzO1xuXHR0aGlzLnNob3dGZWF0dXJlRGV0YWlscyA9IChjLmVuZCAtIGMuc3RhcnQgKyAxKSA8PSB0aGlzLmZlYXR1cmVEZXRhaWxUaHJlc2hvbGQ7XG5cdHRoaXMuY2xlYXJBbGwgPSBwcmV2U0ZEICE9PSB0aGlzLnNob3dGZWF0dXJlRGV0YWlscztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIHRoZSBab29tVmlldyB0byBzaG93IHRoZSBnaXZlbiBjb29yZGluYXRlIHJhbmdlIGZyb20gdGhlIHJlZyBnZW5vbWUgYW5kIHRoZSBjb3JyZXNwb25kaW5nXG4gICAgLy8gcmFuZ2UocykgaW4gZWFjaCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIHVwZGF0ZVZpYU1hcHBlZENvb3JkaW5hdGVzIChjb29yZHMpIHtcblx0bGV0IGMgPSAoY29vcmRzIHx8IHRoaXMuYXBwLmNvb3Jkcyk7XG5cdGQzLnNlbGVjdCgnI3pvb21Db29yZHMnKVswXVswXS52YWx1ZSA9IGZvcm1hdENvb3JkcyhjLmNociwgYy5zdGFydCwgYy5lbmQpO1xuXHRkMy5zZWxlY3QoJyN6b29tV1NpemUnKVswXVswXS52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSlcblx0Ly9cbiAgICAgICAgbGV0IG1ndiA9IHRoaXMuYXBwO1xuXHQvLyBJc3N1ZSByZXF1ZXN0cyBmb3IgZmVhdHVyZXMuIE9uZSByZXF1ZXN0IHBlciBnZW5vbWUsIGVhY2ggcmVxdWVzdCBzcGVjaWZpZXMgb25lIG9yIG1vcmVcblx0Ly8gY29vcmRpbmF0ZSByYW5nZXMuXG5cdC8vIFdhaXQgZm9yIGFsbCB0aGUgZGF0YSB0byBiZWNvbWUgYXZhaWxhYmxlLCB0aGVuIGRyYXcuXG5cdC8vXG5cdGxldCBwcm9taXNlcyA9IFtdO1xuXG5cdC8vXG5cdHRoaXMuc2V0U2hvd0ZlYXR1cmVEZXRhaWxzKGMpO1xuXG5cdC8vIEZpcnN0IHJlcXVlc3QgaXMgZm9yIHRoZSB0aGUgcmVmZXJlbmNlIGdlbm9tZS4gR2V0IGFsbCB0aGUgZmVhdHVyZXMgaW4gdGhlIHJhbmdlLlxuXHRwcm9taXNlcy5wdXNoKG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlc0J5UmFuZ2UobWd2LnJHZW5vbWUsIFt7XG5cdCAgICAvLyBOZWVkIHRvIHNpbXVsYXRlIHRoZSByZXN1bHRzIGZyb20gY2FsbGluZyB0aGUgdHJhbnNsYXRvci4gXG5cdCAgICAvLyBcblx0ICAgIGNociAgICA6IGMuY2hyLFxuXHQgICAgc3RhcnQgIDogYy5zdGFydCxcblx0ICAgIGVuZCAgICA6IGMuZW5kLFxuXHQgICAgaW5kZXggIDogMCxcblx0ICAgIGZDaHIgICA6IGMuY2hyLFxuXHQgICAgZlN0YXJ0IDogYy5zdGFydCxcblx0ICAgIGZFbmQgICA6IGMuZW5kLFxuXHQgICAgZkluZGV4ICA6IDAsXG5cdCAgICBvcmkgICAgOiAnKycsXG5cdCAgICBibG9ja0lkOiBtZ3Yuckdlbm9tZS5uYW1lXG5cdH1dLCB0aGlzLnNob3dGZWF0dXJlRGV0YWlscykpO1xuXHRpZiAoISB0aGlzLnJvb3QuY2xhc3NlZCgnY2xvc2VkJykpIHtcblx0ICAgIC8vIEFkZCBhIHJlcXVlc3QgZm9yIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUsIHVzaW5nIHRyYW5zbGF0ZWQgY29vcmRpbmF0ZXMuIFxuXHQgICAgbWd2LmNHZW5vbWVzLmZvckVhY2goY0dlbm9tZSA9PiB7XG5cdFx0bGV0IHJhbmdlcyA9IG1ndi50cmFuc2xhdG9yLnRyYW5zbGF0ZSggbWd2LnJHZW5vbWUsIGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCwgY0dlbm9tZSApO1xuXHRcdGxldCBwID0gbWd2LmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzQnlSYW5nZShjR2Vub21lLCByYW5nZXMsIHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzKTtcblx0XHRwcm9taXNlcy5wdXNoKHApO1xuXHQgICAgfSk7XG5cdH1cblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgIH1cbiAgICAvLyBVcGRhdGVzIHRoZSBab29tVmlldyB0byBzaG93IHRoZSByZWdpb24gYXJvdW5kIGEgbGFuZG1hcmsgaW4gZWFjaCBnZW5vbWUuXG4gICAgLy9cbiAgICAvLyBjb29yZHMgPSB7XG4gICAgLy8gICAgIGxhbmRtYXJrIDogaWQgb2YgYSBmZWF0dXJlIHRvIHVzZSBhcyBhIHJlZmVyZW5jZVxuICAgIC8vICAgICBmbGFua3x3aWR0aCA6IHNwZWNpZnkgb25lIG9mIGZsYW5rIG9yIHdpZHRoLiBcbiAgICAvLyAgICAgICAgIGZsYW5rID0gYW1vdW50IG9mIGZsYW5raW5nIHJlZ2lvbiAoYnApIHRvIGluY2x1ZGUgYXQgYm90aCBlbmRzIG9mIHRoZSBsYW5kbWFyaywgXG4gICAgLy8gICAgICAgICBzbyB0aGUgdG90YWwgdmlld2luZyByZWdpb24gPSBmbGFuayArIGxlbmd0aChsYW5kbWFyaykgKyBmbGFuay5cbiAgICAvLyAgICAgICAgIHdpZHRoID0gdG90YWwgdmlld2luZyByZWdpb24gd2lkdGguIElmIGJvdGggd2lkdGggYW5kIGZsYW5rIGFyZSBzcGVjaWZpZWQsIGZsYW5rIGlzIGlnbm9yZWQuXG4gICAgLy8gICAgIGRlbHRhIDogYW1vdW50IHRvIHNoaWZ0IHRoZSB2aWV3IGxlZnQvcmlnaHRcbiAgICAvLyB9XG4gICAgLy8gXG4gICAgLy8gVGhlIGxhbmRtYXJrIG11c3QgZXhpc3QgaW4gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZS4gXG4gICAgLy9cbiAgICB1cGRhdGVWaWFMYW5kbWFya0Nvb3JkaW5hdGVzIChjb29yZHMpIHtcblx0bGV0IGMgPSBjb29yZHM7XG5cdGxldCBtZ3YgPSB0aGlzLmFwcDtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgcmYgPSBjb29yZHMubGFuZG1hcmtSZWZGZWF0O1xuXHRsZXQgZmVhdHMgPSBjb29yZHMubGFuZG1hcmtGZWF0cztcblx0aWYgKHRoaXMucm9vdC5jbGFzc2VkKCdjbG9zZWQnKSlcblx0ICAgIGZlYXRzID0gZmVhdHMuZmlsdGVyKGYgPT4gZi5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpO1xuXHRsZXQgZGVsdGEgPSBjb29yZHMuZGVsdGEgfHwgMDtcblx0Ly8gY29tcHV0ZSByYW5nZXMgYXJvdW5kIGxhbmRtYXJrIGluIGVhY2ggZ2Vub21lXG5cdGxldCByYW5nZXMgPSBmZWF0cy5tYXAoZiA9PiB7XG5cdCAgICBsZXQgZmxhbmsgPSBjLmxlbmd0aCA/IChjLmxlbmd0aCAtIGYubGVuZ3RoKSAvIDIgOiBjLmZsYW5rO1xuXHQgICAgbGV0IGNsZW5ndGggPSBmLmdlbm9tZS5nZXRDaHJvbW9zb21lKGYuY2hyKS5sZW5ndGg7XG5cdCAgICBsZXQgdyAgICAgPSBjLmxlbmd0aCA/IGMubGVuZ3RoIDogKGYubGVuZ3RoICsgMipmbGFuayk7XG5cdCAgICBsZXQgc3RhcnQgPSBjbGlwKE1hdGgucm91bmQoZGVsdGEgKyBmLnN0YXJ0IC0gZmxhbmspLCAxLCBjbGVuZ3RoKTtcblx0ICAgIGxldCBlbmQgICA9IGNsaXAoTWF0aC5yb3VuZChzdGFydCArIHcpLCBzdGFydCwgY2xlbmd0aClcblx0ICAgIGxldCBmZGVsdGEgPSAoZi5zdHJhbmQgPT09ICctJyA/IDEgOiAtMSkgKiBmLmxlbmd0aCAvIDI7XG5cdCAgICBsZXQgcmFuZ2UgPSB7XG5cdFx0Z2Vub21lOlx0Zi5nZW5vbWUsXG5cdFx0Y2hyOlx0Zi5jaHIsXG5cdFx0Y2hyb21vc29tZTogZi5nZW5vbWUuZ2V0Q2hyb21vc29tZShmLmNociksXG5cdFx0c3RhcnQ6XHRzdGFydCArIGZkZWx0YSxcblx0XHRlbmQ6XHRlbmQgKyBmZGVsdGFcblx0ICAgIH0gO1xuXHQgICAgaWYgKGYuZ2Vub21lID09PSBtZ3Yuckdlbm9tZSkge1xuXHRcdGxldCBjID0gdGhpcy5hcHAuY29vcmRzID0gcmFuZ2U7XG5cdFx0ZDMuc2VsZWN0KCcjem9vbUNvb3JkcycpWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCk7XG5cdFx0ZDMuc2VsZWN0KCcjem9vbVdTaXplJylbMF1bMF0udmFsdWUgPSBNYXRoLnJvdW5kKGMuZW5kIC0gYy5zdGFydCArIDEpXG5cdCAgICB9XG5cdCAgICByZXR1cm4gcmFuZ2U7XG5cdH0pO1xuXHRsZXQgc2Vlbkdlbm9tZXMgPSBuZXcgU2V0KCk7XG5cdGxldCByQ29vcmRzO1xuXHQvLyBHZXQgKHByb21pc2VzIGZvcikgdGhlIGZlYXR1cmVzIGluIGVhY2ggcmFuZ2UuXG5cdGxldCBwcm9taXNlcyA9IHJhbmdlcy5tYXAociA9PiB7XG4gICAgICAgICAgICBsZXQgcnJzO1xuXHQgICAgc2Vlbkdlbm9tZXMuYWRkKHIuZ2Vub21lKTtcblx0ICAgIGlmIChyLmdlbm9tZSA9PT0gbWd2LnJHZW5vbWUpe1xuXHRcdC8vIHRoZSByZWYgZ2Vub21lIHJhbmdlXG5cdFx0ckNvb3JkcyA9IHI7XG5cdFx0Ly9cblx0XHR0aGlzLnNldFNob3dGZWF0dXJlRGV0YWlscyhyKTtcblx0XHQvL1xuXHQgICAgICAgIHJycyA9IFt7XG5cdFx0ICAgIGNociAgICA6IHIuY2hyLFxuXHRcdCAgICBzdGFydCAgOiByLnN0YXJ0LFxuXHRcdCAgICBlbmQgICAgOiByLmVuZCxcblx0XHQgICAgaW5kZXggIDogMCxcblx0XHQgICAgZkNociAgIDogci5jaHIsXG5cdFx0ICAgIGZTdGFydCA6IHIuc3RhcnQsXG5cdFx0ICAgIGZFbmQgICA6IHIuZW5kLFxuXHRcdCAgICBmSW5kZXggIDogMCxcblx0XHQgICAgb3JpICAgIDogJysnLFxuXHRcdCAgICBibG9ja0lkOiBtZ3Yuckdlbm9tZS5uYW1lXG5cdFx0fV07XG5cdCAgICB9XG5cdCAgICBlbHNlIHsgXG5cdFx0Ly8gdHVybiB0aGUgc2luZ2xlIHJhbmdlIGludG8gYSByYW5nZSBmb3IgZWFjaCBvdmVybGFwcGluZyBzeW50ZW55IGJsb2NrIHdpdGggdGhlIHJlZiBnZW5vbWVcblx0ICAgICAgICBycnMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUoci5nZW5vbWUsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgbWd2LnJHZW5vbWUsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlc0J5UmFuZ2Uoci5nZW5vbWUsIHJycywgdGhpcy5zaG93RmVhdHVyZURldGFpbHMpO1xuXHR9KTtcblx0Ly8gRm9yIGVhY2ggZ2Vub21lIHdoZXJlIHRoZSBsYW5kbWFyayBkb2VzIG5vdCBleGlzdCwgY29tcHV0ZSBhIG1hcHBlZCByYW5nZSAoYXMgaW4gbWFwcGVkIGNtb2RlKS5cblx0aWYgKCF0aGlzLnJvb3QuY2xhc3NlZCgnY2xvc2VkJykpXG5cdCAgICBtZ3YuY0dlbm9tZXMuZm9yRWFjaChnID0+IHtcblx0XHRpZiAoISBzZWVuR2Vub21lcy5oYXMoZykpIHtcblx0XHQgICAgbGV0IHJycyA9IG1ndi50cmFuc2xhdG9yLnRyYW5zbGF0ZShtZ3Yuckdlbm9tZSwgckNvb3Jkcy5jaHIsIHJDb29yZHMuc3RhcnQsIHJDb29yZHMuZW5kLCBnKTtcblx0XHQgICAgcHJvbWlzZXMucHVzaCggbWd2LmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzQnlSYW5nZShnLCBycnMsIHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzKSApO1xuXHRcdH1cblx0ICAgIH0pO1xuXHQvLyBXaGVuIGFsbCB0aGUgZGF0YSBpcyByZWFkeSwgZHJhdy5cblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG4gICAgLy9cbiAgICB1cGRhdGUgKGNmZykge1xuXHR0aGlzLmNmZyA9IGNmZyB8fCB0aGlzLmNmZztcblx0dGhpcy5oaWdobGlnaHRlZCA9IHRoaXMuY2ZnLmhpZ2hsaWdodDtcblx0dGhpcy5nZW5vbWVzID0gdGhpcy5jZmcuZ2Vub21lcztcblx0dGhpcy5kbW9kZSA9IHRoaXMuY2ZnLmRtb2RlO1xuXHR0aGlzLmNtb2RlID0gdGhpcy5jZmcuY21vZGU7XG5cdHRoaXMuYXBwLnRyYW5zbGF0b3IucmVhZHkoKS50aGVuKCgpID0+IHtcblx0ICAgIGxldCBwO1xuXHQgICAgaWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKVxuXHRcdHAgPSB0aGlzLnVwZGF0ZVZpYU1hcHBlZENvb3JkaW5hdGVzKHRoaXMuYXBwLmNvb3Jkcyk7XG5cdCAgICBlbHNlXG5cdFx0cCA9IHRoaXMudXBkYXRlVmlhTGFuZG1hcmtDb29yZGluYXRlcyh0aGlzLmFwcC5sY29vcmRzKTtcblx0ICAgIHAudGhlbiggZGF0YSA9PiB7XG5cdFx0dGhpcy5kcmF3KHRoaXMubXVuZ2VEYXRhKGRhdGEpKTtcblx0ICAgIH0pO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIG1lcmdlU2Jsb2NrUnVucyAoZGF0YSkge1xuXHQvLyAtLS0tLVxuXHQvLyBSZWR1Y2VyIGZ1bmN0aW9uLiBXaWxsIGJlIGNhbGxlZCB3aXRoIHRoZXNlIGFyZ3M6XG5cdC8vICAgbmJsY2tzIChsaXN0KSBOZXcgYmxvY2tzLiAoY3VycmVudCBhY2N1bXVsYXRvciB2YWx1ZSlcblx0Ly8gICBcdEEgbGlzdCBvZiBsaXN0cyBvZiBzeW50ZW55IGJsb2Nrcy5cblx0Ly8gICBibGsgKHN5bnRlbnkgYmxvY2spIHRoZSBjdXJyZW50IHN5bnRlbnkgYmxvY2tcblx0Ly8gICBpIChpbnQpIFRoZSBpdGVyYXRpb24gY291bnQuXG5cdC8vIFJldHVybnM6XG5cdC8vICAgbGlzdCBvZiBsaXN0cyBvZiBibG9ja3Ncblx0bGV0IG1lcmdlciA9IChuYmxrcywgYiwgaSkgPT4ge1xuXHQgICAgbGV0IGluaXRCbGsgPSBmdW5jdGlvbiAoYmIpIHtcblx0XHRsZXQgbmIgPSBPYmplY3QuYXNzaWduKHt9LCBiYik7XG5cdFx0bmIuc3VwZXJCbG9jayA9IHRydWU7XG5cdFx0bmIuZmVhdHVyZXMgPSBiYi5mZWF0dXJlcy5jb25jYXQoKTtcblx0XHRuYi5zYmxvY2tzID0gW2JiXTtcblx0XHRuYi5vcmkgPSAnKydcblx0XHRyZXR1cm4gbmI7XG5cdCAgICB9O1xuXHQgICAgaWYgKGkgPT09IDApe1xuXHRcdG5ibGtzLnB1c2goaW5pdEJsayhiKSk7XG5cdFx0cmV0dXJuIG5ibGtzO1xuXHQgICAgfVxuXHQgICAgbGV0IGxhc3RCbGsgPSBuYmxrc1tuYmxrcy5sZW5ndGggLSAxXTtcblx0ICAgIGlmIChiLmNociAhPT0gbGFzdEJsay5jaHIgfHwgYi5pbmRleCAtIGxhc3RCbGsuaW5kZXggIT09IDEpIHtcblx0ICAgICAgICBuYmxrcy5wdXNoKGluaXRCbGsoYikpO1xuXHRcdHJldHVybiBuYmxrcztcblx0ICAgIH1cblx0ICAgIC8vIG1lcmdlXG5cdCAgICBsYXN0QmxrLmluZGV4ID0gYi5pbmRleDtcblx0ICAgIGxhc3RCbGsuZW5kID0gYi5lbmQ7XG5cdCAgICBsYXN0QmxrLmJsb2NrRW5kID0gYi5ibG9ja0VuZDtcblx0ICAgIGxhc3RCbGsuZmVhdHVyZXMgPSBsYXN0QmxrLmZlYXR1cmVzLmNvbmNhdChiLmZlYXR1cmVzKTtcblx0ICAgIGxldCBsYXN0U2IgPSBsYXN0QmxrLnNibG9ja3NbbGFzdEJsay5zYmxvY2tzLmxlbmd0aCAtIDFdO1xuXHQgICAgbGV0IGQgPSBiLnN0YXJ0IC0gbGFzdFNiLmVuZDtcblx0ICAgIGxhc3RTYi5lbmQgKz0gZC8yO1xuXHQgICAgYi5zdGFydCAtPSBkLzI7XG5cdCAgICBsYXN0QmxrLnNibG9ja3MucHVzaChiKTtcblx0ICAgIHJldHVybiBuYmxrcztcblx0fTtcblx0Ly8gLS0tLS1cbiAgICAgICAgZGF0YS5mb3JFYWNoKChnZGF0YSxpKSA9PiB7XG5cdCAgICBpZiAodGhpcy5kbW9kZSA9PT0gJ2NvbXBhcmlzb24nKSB7XG5cdFx0Z2RhdGEuYmxvY2tzLnNvcnQoIChhLGIpID0+IGEuaW5kZXggLSBiLmluZGV4ICk7XG5cdFx0Z2RhdGEuYmxvY2tzID0gZ2RhdGEuYmxvY2tzLnJlZHVjZShtZXJnZXIsW10pO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0Ly8gZmlyc3Qgc29ydCBieSByZWYgZ2Vub21lIG9yZGVyXG5cdFx0Z2RhdGEuYmxvY2tzLnNvcnQoIChhLGIpID0+IGEuZkluZGV4IC0gYi5mSW5kZXggKTtcblx0XHQvLyBTdWItZ3JvdXAgaW50byBydW5zIG9mIHNhbWUgY29tcCBnZW5vbWUgY2hyb21vc29tZS5cblx0XHRsZXQgdG1wID0gZ2RhdGEuYmxvY2tzLnJlZHVjZSgobmJzLCBiLCBpKSA9PiB7XG5cdFx0ICAgIGlmIChpID09PSAwIHx8IG5ic1tuYnMubGVuZ3RoIC0gMV1bMF0uY2hyICE9PSBiLmNocilcblx0XHRcdG5icy5wdXNoKFtiXSk7XG5cdFx0ICAgIGVsc2Vcblx0XHRcdG5ic1tuYnMubGVuZ3RoIC0gMV0ucHVzaChiKTtcblx0XHQgICAgcmV0dXJuIG5icztcblx0XHR9LCBbXSk7XG5cdFx0Ly8gU29ydCBlYWNoIHN1Ymdyb3VwIGludG8gY29tcGFyaXNvbiBnZW5vbWUgb3JkZXJcblx0XHR0bXAuZm9yRWFjaCggc3ViZ3JwID0+IHN1YmdycC5zb3J0KChhLGIpID0+IGEuaW5kZXggLSBiLmluZGV4KSApO1xuXHRcdC8vIEZsYXR0ZW4gdGhlIGxpc3Rcblx0XHR0bXAgPSB0bXAucmVkdWNlKChsc3QsIGN1cnIpID0+IGxzdC5jb25jYXQoY3VyciksIFtdKTtcblx0XHQvLyBOb3cgY3JlYXRlIHRoZSBzdXBlcmdyb3Vwcy5cblx0XHRnZGF0YS5ibG9ja3MgPSB0bXAucmVkdWNlKG1lcmdlcixbXSk7XG5cdCAgICB9XG5cdH0pO1xuXHRyZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIHVuaXFpZnlCbG9ja3MgKGJsb2Nrcykge1xuXHQvLyBoZWxwZXIgZnVuY3Rpb24uIFdoZW4gc2Jsb2NrIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIGdlbm9tZXMgaXMgY29uZnVzZWQsIHJlcXVlc3Rpbmcgb25lXG5cdC8vIHJlZ2lvbiBpbiBnZW5vbWUgQSBjYW4gZW5kIHVwIHJlcXVlc3RpbmcgdGhlIHNhbWUgcmVnaW9uIGluIGdlbm9tZSBCIG11bHRpcGxlIHRpbWVzLlxuXHQvLyBUaGlzIGZ1bmN0aW9uIGF2b2lkcyBkcmF3aW5nIHRoZSBzYW1lIHNibG9jayB0d2ljZS4gKE5COiBSZWFsbHkgbm90IHN1cmUgd2hlcmUgdGhpcyBcblx0Ly8gY2hlY2sgaXMgYmVzdCBkb25lLiBDb3VsZCBwdXNoIGl0IGZhcnRoZXIgdXBzdHJlYW0uKVxuXHRsZXQgc2VlbiA9IG5ldyBTZXQoKTtcblx0cmV0dXJuIGJsb2Nrcy5maWx0ZXIoIGIgPT4geyBcblx0ICAgIGlmIChzZWVuLmhhcyhiLmluZGV4KSkgcmV0dXJuIGZhbHNlO1xuXHQgICAgc2Vlbi5hZGQoYi5pbmRleCk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fSk7XG4gICAgfTtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBcHBsaWVzIHNldmVyYWwgdHJhbnNmb3JtYXRpb24gc3RlcHMgb24gdGhlIGRhdGEgYXMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlciB0byBwcmVwYXJlIGZvciBkcmF3aW5nLlxuICAgIC8vIElucHV0IGRhdGEgaXMgc3RydWN0dXJlZCBhcyBmb2xsb3dzOlxuICAgIC8vICAgICBkYXRhID0gWyB6b29tU3RyaXBfZGF0YSBdXG4gICAgLy8gICAgIHpvb21TdHJpcF9kYXRhID0geyBnZW5vbWUgWyB6b29tQmxvY2tfZGF0YSBdIH1cbiAgICAvLyAgICAgem9vbUJsb2NrX2RhdGEgPSB7IHhzY2FsZSwgY2hyLCBzdGFydCwgZW5kLCBpbmRleCwgZkNociwgZlN0YXJ0LCBmRW5kLCBmSW5kZXgsIG9yaSwgWyBmZWF0dXJlX2RhdGEgXSB9XG4gICAgLy8gICAgIGZlYXR1cmVfZGF0YSA9IHsgSUQsIGNhbm9uaWNhbCwgc3ltYm9sLCBjaHIsIHN0YXJ0LCBlbmQsIHN0cmFuZCwgdHlwZSwgYmlvdHlwZSB9XG4gICAgLy9cbiAgICAvLyBBZ2FpbiwgaW4gRW5nbGlzaDpcbiAgICAvLyAgLSBkYXRhIGlzIGEgbGlzdCBvZiBpdGVtcywgb25lIHBlciBzdHJpcCB0byBiZSBkaXNwbGF5ZWQuIEl0ZW1bMF0gaXMgZGF0YSBmb3IgdGhlIHJlZiBnZW5vbWUuXG4gICAgLy8gICAgSXRlbXNbMStdIGFyZSBkYXRhIGZvciB0aGUgY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy8gIC0gZWFjaCBzdHJpcCBpdGVtIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGEgZ2Vub21lIGFuZCBhIGxpc3Qgb2YgYmxvY2tzLiBJdGVtWzBdIGFsd2F5cyBoYXMgXG4gICAgLy8gICAgYSBzaW5nbGUgYmxvY2suXG4gICAgLy8gIC0gZWFjaCBibG9jayBpcyBhbiBvYmplY3QgY29udGFpbmluZyBhIGNocm9tb3NvbWUsIHN0YXJ0LCBlbmQsIG9yaWVudGF0aW9uLCBldGMsIGFuZCBhIGxpc3Qgb2YgZmVhdHVyZXMuXG4gICAgLy8gIC0gZWFjaCBmZWF0dXJlIGhhcyBjaHIsc3RhcnQsZW5kLHN0cmFuZCx0eXBlLGJpb3R5cGUsSURcbiAgICAvL1xuICAgIC8vIEJlY2F1c2UgU0Jsb2NrcyBjYW4gYmUgdmVyeSBmcmFnbWVudGVkLCBvbmUgY29udGlndW91cyByZWdpb24gaW4gdGhlIHJlZiBnZW5vbWUgY2FuIHR1cm4gaW50byBcbiAgICAvLyBhIGJhemlsbGlvbiB0aW55IGJsb2NrcyBpbiB0aGUgY29tcGFyaXNvbi4gVGhlIHJlc3VsdGluZyByZW5kZXJpbmcgaXMgamFycmluZyBhbmQgdW51c2FibGUuXG4gICAgLy8gVGhlIGRyYXdpbmcgcm91dGluZSBtb2RpZmllcyB0aGUgZGF0YSBieSBtZXJnaW5nIHJ1bnMgb2YgY29uc2VjdXRpdmUgYmxvY2tzIGluIGVhY2ggY29tcCBnZW5vbWUuXG4gICAgLy8gVGhlIGRhdGEgY2hhbmdlIGlzIHRvIGluc2VydCBhIGdyb3VwaW5nIGxheWVyIG9uIHRvcCBvZiB0aGUgc2Jsb2Nrcywgc3BlY2lmaWNhbGx5LCBcbiAgICAvLyAgICAgem9vbVN0cmlwX2RhdGEgPSB7IGdlbm9tZSBbIHpvb21CbG9ja19kYXRhIF0gfVxuICAgIC8vIGJlY29tZXNcbiAgICAvLyAgICAgem9vbVN0cmlwX2RhdGEgPSB7IGdlbm9tZSBbIHpvb21TdXBlckJsb2NrX2RhdGEgXSB9XG4gICAgLy8gICAgIHpvb21TdXBlckJsb2NrX2RhdGEgPSB7IGNociBzdGFydCBlbmQgYmxvY2tzIFsgem9vbUJsb2NrX2RhdGEgXSB9XG4gICAgLy9cbiAgICBtdW5nZURhdGEgKGRhdGEpIHtcbiAgICAgICAgZGF0YS5mb3JFYWNoKGdEYXRhID0+IHtcblx0ICAgIGdEYXRhLmJsb2NrcyA9IHRoaXMudW5pcWlmeUJsb2NrcyhnRGF0YS5ibG9ja3MpXG5cdCAgICAvLyBFYWNoIHN0cmlwIGlzIGluZGVwZW5kZW50bHkgc2Nyb2xsYWJsZS4gSW5pdCBpdHMgb2Zmc2V0IChpbiBieXRlcykuXG5cdCAgICBnRGF0YS5kZWx0YUIgPSAwO1xuXHQgICAgLy8gRWFjaCBzdHJpcCBpcyBpbmRlcGVuZGVudGx5IHNjYWxhYmxlLiBJbml0IHNjYWxlLlxuXHQgICAgZ0RhdGEueFNjYWxlID0gMS4wO1xuXHR9KTtcblx0ZGF0YSA9IHRoaXMubWVyZ2VTYmxvY2tSdW5zKGRhdGEpO1xuXHQvLyBcblx0ZGF0YS5mb3JFYWNoKCBnRGF0YSA9PiB7XG5cdCAgLy8gbWluaW11bSBvZiAzIGxhbmVzIG9uIGVhY2ggc2lkZVxuXHQgIGdEYXRhLm1heExhbmVzUCA9IDM7XG5cdCAgZ0RhdGEubWF4TGFuZXNOID0gMztcblx0ICBnRGF0YS5ibG9ja3MuZm9yRWFjaCggc2I9PiB7XG5cdCAgICBzYi5mZWF0dXJlcy5mb3JFYWNoKGYgPT4ge1xuXHRcdGlmIChmLmxhbmUgPiAwKVxuXHRcdCAgICBnRGF0YS5tYXhMYW5lc1AgPSBNYXRoLm1heChnRGF0YS5tYXhMYW5lc1AsIGYubGFuZSlcblx0XHRlbHNlXG5cdFx0ICAgIGdEYXRhLm1heExhbmVzTiA9IE1hdGgubWF4KGdEYXRhLm1heExhbmVzTiwgLWYubGFuZSlcblx0ICAgIH0pO1xuXHQgIH0pO1xuXHQgIGlmIChnRGF0YS5ibG9ja3MubGVuZ3RoID4gMSlcblx0ICAgICAgZ0RhdGEuYmxvY2tzID0gZ0RhdGEuYmxvY2tzLmZpbHRlcihiPT5iLmZlYXR1cmVzLmxlbmd0aCA+IDApO1xuXHQgIGdEYXRhLnN0cmlwSGVpZ2h0ID0gMTUgKyB0aGlzLmxhbmVIZWlnaHQgKiAoZ0RhdGEubWF4TGFuZXNQICsgZ0RhdGEubWF4TGFuZXNOKTtcblx0ICBnRGF0YS56ZXJvT2Zmc2V0ID0gdGhpcy5sYW5lSGVpZ2h0ICogZ0RhdGEubWF4TGFuZXNQO1xuXHR9KTtcblx0cmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gT3JkZXJzIHNibG9ja3MgaG9yaXpvbnRhbGx5IHdpdGhpbiBlYWNoIGdlbm9tZS4gVHJhbnNsYXRlcyB0aGVtIGludG8gcG9zaXRpb24uXG4gICAgLy9cbiAgICBsYXlvdXRTQmxvY2tzIChzYmxvY2tzKSB7XG5cdC8vIFNvcnQgdGhlIHNibG9ja3MgaW4gZWFjaCBzdHJpcCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgZHJhd2luZyBtb2RlLlxuXHRsZXQgY21wRmllbGQgPSB0aGlzLmRtb2RlID09PSAnY29tcGFyaXNvbicgPyAnaW5kZXgnIDogJ2ZJbmRleCc7XG5cdGxldCBjbXBGdW5jID0gKGEsYikgPT4gYS5fX2RhdGFfX1tjbXBGaWVsZF0tYi5fX2RhdGFfX1tjbXBGaWVsZF07XG5cdHNibG9ja3MuZm9yRWFjaCggc3RyaXAgPT4gc3RyaXAuc29ydCggY21wRnVuYyApICk7XG5cdGxldCBwc3RhcnQgPSBbXTsgLy8gb2Zmc2V0IChpbiBwaXhlbHMpIG9mIHN0YXJ0IHBvc2l0aW9uIG9mIG5leHQgYmxvY2ssIGJ5IHN0cmlwIGluZGV4ICgwPT09cmVmKVxuXHRsZXQgYnN0YXJ0ID0gW107IC8vIGJsb2NrIHN0YXJ0IHBvcyAoaW4gYnApIGFzc29jIHdpdGggcHN0YXJ0XG5cdGxldCBjY2hyID0gbnVsbDtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgR0FQICA9IDE2OyAgIC8vIGxlbmd0aCBvZiBnYXAgYmV0d2VlbiBibG9ja3Mgb2YgZGlmZiBjaHJvbXMuXG5cdGxldCBkeDtcblx0bGV0IHBlbmQ7XG5cdHNibG9ja3MuZWFjaCggZnVuY3Rpb24gKGIsaSxqKSB7IC8vIGI9YmxvY2ssIGk9aW5kZXggd2l0aGluIHN0cmlwLCBqPXN0cmlwIGluZGV4XG5cdCAgICBsZXQgZ2QgPSB0aGlzLl9fZGF0YV9fLmdlbm9tZTtcblx0ICAgIGxldCBibGVuID0gc2VsZi5wcGIgKiAoYi5lbmQgLSBiLnN0YXJ0ICsgMSk7IC8vIHRvdGFsIHNjcmVlbiB3aWR0aCBvZiB0aGlzIHNibG9ja1xuXHQgICAgYi5mbGlwID0gYi5vcmkgPT09ICctJyAmJiBzZWxmLmRtb2RlID09PSAncmVmZXJlbmNlJztcblx0ICAgIGIueHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFtiLnN0YXJ0LCBiLmVuZF0pLnJhbmdlKCBiLmZsaXAgPyBbYmxlbiwgMF0gOiBbMCwgYmxlbl0gKTtcblx0ICAgIC8vXG5cdCAgICBpZiAoaT09PTApIHtcblx0XHQvLyBmaXJzdCBibG9jayBpbiBlYWNoIHN0cmlwIGluaXRzXG5cdFx0cHN0YXJ0W2pdID0gMDtcblx0XHRnZC5wd2lkdGggPSBibGVuO1xuXHRcdGJzdGFydFtqXSA9IGIuc3RhcnQ7XG5cdFx0ZHggPSAwO1xuXHRcdGNjaHIgPSBiLmNocjtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHRcdGdkLnB3aWR0aCArPSBibGVuO1xuXHRcdGR4ID0gYi5jaHIgPT09IGNjaHIgPyBwc3RhcnRbal0gKyBzZWxmLnBwYiAqIChiLnN0YXJ0IC0gYnN0YXJ0W2pdKSA6IEluZmluaXR5O1xuXHRcdGlmIChkeCA8IDAgfHwgZHggPiBzZWxmLm1heFNCZ2FwKSB7XG5cdFx0ICAgIC8vIENoYW5nZWQgY2hyIG9yIGp1bXBlZCBhIGxhcmdlIGdhcFxuXHRcdCAgICBwc3RhcnRbal0gPSBwZW5kICsgR0FQO1xuXHRcdCAgICBic3RhcnRbal0gPSBiLnN0YXJ0O1xuXHRcdCAgICBnZC5wd2lkdGggKz0gR0FQO1xuXHRcdCAgICBkeCA9IHBzdGFydFtqXTtcblx0XHQgICAgY2NociA9IGIuY2hyO1xuXHRcdH1cblx0ICAgIH1cblx0ICAgIHBlbmQgPSBkeCArIGJsZW47XG5cdCAgICBkMy5zZWxlY3QodGhpcykuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke2R4fSwwKWApO1xuXHR9KTtcblx0dGhpcy5zcXVpc2goKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTY2FsZXMgZWFjaCB6b29tIHN0cmlwIGhvcml6b250YWxseSB0byBmaXQgdGhlIHdpZHRoLiBPbmx5IHNjYWxlcyBkb3duLlxuICAgIHNxdWlzaCAoKSB7XG4gICAgICAgIGxldCBzYnMgPSBkMy5zZWxlY3RBbGwoJy56b29tU3RyaXAgW25hbWU9XCJzQmxvY2tzXCJdJyk7XG5cdGxldCBzZWxmID0gdGhpcztcblx0c2JzLmVhY2goZnVuY3Rpb24gKHNiLGkpIHtcblx0ICAgIGlmIChzYi5nZW5vbWUucHdpZHRoID4gc2VsZi53aWR0aCkge1xuXHQgICAgICAgIGxldCBzID0gc2VsZi53aWR0aCAvIHNiLmdlbm9tZS5wd2lkdGg7XG5cdFx0c2IueFNjYWxlID0gcztcblx0XHRsZXQgdCA9IGQzLnNlbGVjdCh0aGlzKTtcblx0XHR0LmF0dHIoJ3RyYW5zZm9ybScsICgpPT4gYHRyYW5zbGF0ZSgkey1zYi5kZWx0YUIgKiBzZWxmLnBwYn0sMClzY2FsZSgke3NiLnhTY2FsZX0sMSlgKTtcblx0ICAgIH1cblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSB6b29tIHZpZXcgcGFuZWwgd2l0aCB0aGUgZ2l2ZW4gZGF0YS5cbiAgICAvL1xuICAgIGRyYXcgKGRhdGEpIHtcblx0Ly8gXG5cdGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gSXMgWm9vbVZpZXcgY3VycmVudGx5IGNsb3NlZD9cblx0bGV0IGNsb3NlZCA9IHRoaXMucm9vdC5jbGFzc2VkKCdjbG9zZWQnKTtcblx0Ly8gU2hvdyByZWYgZ2Vub21lIG5hbWVcblx0ZDMuc2VsZWN0KCcjem9vbVZpZXcgLnpvb21Db29yZHMgbGFiZWwnKVxuXHQgICAgLnRleHQodGhpcy5hcHAuckdlbm9tZS5sYWJlbCArICcgY29vcmRzJyk7XG5cdC8vIFNob3cgbGFuZG1hcmsgbGFiZWwsIGlmIGFwcGxpY2FibGVcblx0bGV0IGxtdHh0ID0gJyc7XG5cdGlmICh0aGlzLmNtb2RlID09PSAnbGFuZG1hcmsnKSB7XG5cdCAgICBsZXQgcmYgPSB0aGlzLmFwcC5sY29vcmRzLmxhbmRtYXJrUmVmRmVhdDtcblx0ICAgIGxldCBkID0gdGhpcy5hcHAubGNvb3Jkcy5kZWx0YTtcblx0ICAgIGxldCBkdHh0ID0gZCA/IGAgKCR7ZCA+IDAgPyAnKycgOiAnJ30ke3ByZXR0eVByaW50QmFzZXMoZCl9KWAgOiAnJztcblx0ICAgIGxtdHh0ID0gYEFsaWduZWQgb24gJHtyZi5zeW1ib2wgfHwgcmYuaWR9JHtkdHh0fWA7XG5cdH1cblx0Ly8gZGlzYWJsZSB0aGUgUi9DIGJ1dHRvbiBpbiBsYW5kbWFyayBtb2RlXG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ1tuYW1lPVwiem9vbWNvbnRyb2xzXCJdIFtuYW1lPVwiem9vbURtb2RlXCJdIC5idXR0b24nKVxuXHQgICAgLmF0dHIoJ2Rpc2FibGVkJywgdGhpcy5jbW9kZSA9PT0gJ2xhbmRtYXJrJyB8fCBudWxsKTtcblx0Ly8gZGlzcGxheSBsYW5kbWFyayB0ZXh0XG5cdGQzLnNlbGVjdCgnI3pvb21WaWV3IC56b29tQ29vcmRzIHNwYW4nKS50ZXh0KCBsbXR4dCApO1xuXHRcblx0Ly8gdGhlIHJlZmVyZW5jZSBnZW5vbWUgYmxvY2sgKGFsd2F5cyBqdXN0IDEgb2YgdGhlc2UpLlxuXHRsZXQgckRhdGEgPSBkYXRhLmZpbHRlcihkZCA9PiBkZC5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpWzBdO1xuXHRsZXQgckJsb2NrID0gckRhdGEuYmxvY2tzWzBdO1xuXG5cdC8vIHgtc2NhbGUgYW5kIHgtYXhpcyBiYXNlZCBvbiB0aGUgcmVmIGdlbm9tZS5cblx0dGhpcy54c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHQgICAgLmRvbWFpbihbckJsb2NrLnN0YXJ0LHJCbG9jay5lbmRdKVxuXHQgICAgLnJhbmdlKFswLHRoaXMud2lkdGhdKTtcblx0Ly9cblx0Ly8gcGl4ZWxzIHBlciBiYXNlXG5cdHRoaXMucHBiID0gdGhpcy53aWR0aCAvICh0aGlzLmFwcC5jb29yZHMuZW5kIC0gdGhpcy5hcHAuY29vcmRzLnN0YXJ0ICsgMSk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gZHJhdyB0aGUgY29vcmRpbmF0ZSBheGlzXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdHRoaXMuYXhpc0Z1bmMgPSBkMy5zdmcuYXhpcygpXG5cdCAgICAuc2NhbGUodGhpcy54c2NhbGUpXG5cdCAgICAub3JpZW50KCd0b3AnKVxuXHQgICAgLm91dGVyVGlja1NpemUoMilcblx0ICAgIC50aWNrcyg1KVxuXHQgICAgLnRpY2tTaXplKDUpXG5cdCAgICA7XG5cdHRoaXMuYXhpcy5jYWxsKHRoaXMuYXhpc0Z1bmMpO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIHpvb20gc3RyaXBzIChvbmUgcGVyIGdlbm9tZSlcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgbGV0IHpzdHJpcHMgPSB0aGlzLnN0cmlwc0dycFxuXHQgICAgICAgIC5zZWxlY3RBbGwoJ2cuem9vbVN0cmlwJylcblx0XHQuZGF0YShkYXRhLCBkID0+IGQuZ2Vub21lLm5hbWUpO1xuXHQvLyBDcmVhdGUgdGhlIGdyb3VwXG5cdGxldCBuZXd6cyA9IHpzdHJpcHMuZW50ZXIoKVxuXHQgICAgICAgIC5hcHBlbmQoJ2cnKVxuXHRcdC5hdHRyKCdjbGFzcycsJ3pvb21TdHJpcCcpXG5cdFx0LmF0dHIoJ25hbWUnLCBkID0+IGQuZ2Vub21lLm5hbWUpXG5cdFx0Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChnKSB7XG5cdFx0ICAgIHNlbGYuaGlnaGxpZ2h0U3RyaXAoZy5nZW5vbWUsIHRoaXMpO1xuXHRcdH0pXG5cdFx0LmNhbGwodGhpcy5kcmFnZ2VyKVxuXHRcdDtcblx0Ly9cblx0Ly8gU3RyaXAgbGFiZWxcblx0bmV3enMuYXBwZW5kKCd0ZXh0Jylcblx0ICAgIC5hdHRyKCduYW1lJywgJ2dlbm9tZUxhYmVsJylcblx0ICAgIC50ZXh0KCBkID0+IGQuZ2Vub21lLmxhYmVsKVxuXHQgICAgLmF0dHIoJ3gnLCAwKVxuXHQgICAgLmF0dHIoJ3knLCB0aGlzLmJsb2NrSGVpZ2h0LzIgKyAyMClcblx0ICAgIC5hdHRyKCdmb250LWZhbWlseScsJ3NhbnMtc2VyaWYnKVxuXHQgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsIDEwKVxuXHQgICAgO1xuXHQvLyBTdHJpcCB1bmRlcmxheVxuXHRuZXd6cy5hcHBlbmQoJ3JlY3QnKVxuXHQgICAgLmF0dHIoJ2NsYXNzJywndW5kZXJsYXknKVxuXHQgICAgLmF0dHIoJ3knLCAtdGhpcy5ibG9ja0hlaWdodC8yKVxuXHQgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuYmxvY2tIZWlnaHQpXG5cdCAgICAuc3R5bGUoJ3dpZHRoJywnMTAwJScpXG5cdCAgICAuc3R5bGUoJ29wYWNpdHknLDApXG5cdCAgICA7XG5cdC8vIEdyb3VwIGZvciBzQmxvY2tzXG5cdG5ld3pzLmFwcGVuZCgnZycpXG5cdCAgICAuYXR0cignbmFtZScsICdzQmxvY2tzJyk7XG5cdC8vIFN0cmlwIGVuZCBjYXBcblx0bmV3enMuYXBwZW5kKCdyZWN0Jylcblx0ICAgIC5hdHRyKCdjbGFzcycsICdtYXRlcmlhbC1pY29ucyB6b29tU3RyaXBFbmRDYXAnKVxuXHQgICAgLmF0dHIoJ3gnLCAtMTUpXG5cdCAgICAuYXR0cigneScsIC10aGlzLmJsb2NrSGVpZ2h0IC8gMilcblx0ICAgIC5hdHRyKCd3aWR0aCcsIDE1KVxuXHQgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuYmxvY2tIZWlnaHQgKyAxMClcblx0ICAgIDtcblx0Ly8gU3RyaXAgZHJhZy1oYW5kbGVcblx0bmV3enMuYXBwZW5kKCd0ZXh0Jylcblx0ICAgIC5hdHRyKCdjbGFzcycsICdtYXRlcmlhbC1pY29ucyB6b29tU3RyaXBIYW5kbGUnKVxuXHQgICAgLnN0eWxlKCdmb250LXNpemUnLCAnMThweCcpXG5cdCAgICAuYXR0cigneCcsIC0xNSlcblx0ICAgIC5hdHRyKCd5JywgOSlcblx0ICAgIC50ZXh0KCdkcmFnX2luZGljYXRvcicpXG5cdCAgICAuYXBwZW5kKCd0aXRsZScpXG5cdCAgICAgICAgLnRleHQoJ0RyYWcgdXAvZG93biB0byByZW9yZGVyIHRoZSBnZW5vbWVzLicpXG5cdCAgICA7XG5cdC8vIHRyYW5zbGF0ZSBzdHJpcHMgaW50byBwb3NpdGlvblxuXHRsZXQgb2Zmc2V0ID0gdGhpcy50b3BPZmZzZXQ7XG5cdGxldCBySGVpZ2h0ID0gMDtcblx0dGhpcy5hcHAudkdlbm9tZXMuZm9yRWFjaCggdmcgPT4ge1xuXHQgICAgbGV0IHMgPSB0aGlzLnN0cmlwc0dycC5zZWxlY3QoYC56b29tU3RyaXBbbmFtZT1cIiR7dmcubmFtZX1cIl1gKTtcblx0ICAgIHMuY2xhc3NlZCgncmVmZXJlbmNlJywgZCA9PiBkLmdlbm9tZSA9PT0gdGhpcy5hcHAuckdlbm9tZSlcblx0ICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgZCA9PiB7XG5cdFx0ICAgIC8vcmV0dXJuIGB0cmFuc2xhdGUoMCwke2Nsb3NlZCA/IHRoaXMudG9wT2Zmc2V0IDogZy5nZW5vbWUuem9vbVl9KWBcblx0XHQgICAgaWYgKGQuZ2Vub21lID09PSB0aGlzLmFwcC5yR2Vub21lKVxuXHRcdCAgICAgICAgckhlaWdodCA9IGQuc3RyaXBIZWlnaHQgKyBkLnplcm9PZmZzZXQ7XG5cdFx0ICAgIGxldCBvID0gb2Zmc2V0ICsgZC56ZXJvT2Zmc2V0O1xuXHRcdCAgICBkLnpvb21ZID0gb2Zmc2V0O1xuXHRcdCAgICBvZmZzZXQgKz0gZC5zdHJpcEhlaWdodCArIHRoaXMuc3RyaXBHYXA7XG5cdFx0ICAgIHJldHVybiBgdHJhbnNsYXRlKDAsJHtjbG9zZWQgPyB0aGlzLnRvcE9mZnNldCtkLnplcm9PZmZzZXQgOiBvfSlgXG5cdFx0fSk7XG5cdH0pO1xuXHQvLyByZXNldCB0aGUgc3ZnIHNpemUgYmFzZWQgb24gc3RyaXAgd2lkdGhzXG5cdHRoaXMuc3ZnLmF0dHIoJ2hlaWdodCcsIChjbG9zZWQgPyBySGVpZ2h0IDogb2Zmc2V0KSArIDE1KTtcblxuICAgICAgICB6c3RyaXBzLmV4aXQoKVxuXHQgICAgLm9uKCcuZHJhZycsIG51bGwpXG5cdCAgICAucmVtb3ZlKCk7XG5cdC8vXG4gICAgICAgIHpzdHJpcHMuc2VsZWN0KCdnW25hbWU9XCJzQmxvY2tzXCJdJylcblx0ICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBnID0+IGB0cmFuc2xhdGUoJHtnLmRlbHRhQiAqIHRoaXMucHBifSwwKWApXG5cdCAgICA7XG5cdC8vIC0tLS0gU3ludGVueSBzdXBlciBibG9ja3MgLS0tLVxuICAgICAgICBsZXQgc2Jsb2NrcyA9IHpzdHJpcHMuc2VsZWN0KCdbbmFtZT1cInNCbG9ja3NcIl0nKS5zZWxlY3RBbGwoJ2cuc0Jsb2NrJylcblx0ICAgIC5kYXRhKGQ9PmQuYmxvY2tzLCBiID0+IGIuYmxvY2tJZCk7XG5cdGxldCBuZXdzYnMgPSBzYmxvY2tzLmVudGVyKClcblx0ICAgIC5hcHBlbmQoJ2cnKVxuXHQgICAgLmF0dHIoJ2NsYXNzJywgJ3NCbG9jaycpXG5cdCAgICAuYXR0cignbmFtZScsIGI9PmIuaW5kZXgpXG5cdCAgICA7XG5cdGxldCBsMCA9IG5ld3Nicy5hcHBlbmQoJ2cnKS5hdHRyKCduYW1lJywgJ2xheWVyMCcpO1xuXHRsZXQgbDEgPSBuZXdzYnMuYXBwZW5kKCdnJykuYXR0cignbmFtZScsICdsYXllcjEnKTtcblxuXHQvL1xuXHR0aGlzLmxheW91dFNCbG9ja3Moc2Jsb2Nrcyk7XG5cblx0Ly8gcmVjdGFuZ2xlIGZvciBlYWNoIGluZGl2aWR1YWwgc3ludGVueSBibG9ja1xuXHRsZXQgc2JyZWN0cyA9IHNibG9ja3Muc2VsZWN0KCdnW25hbWU9XCJsYXllcjBcIl0nKS5zZWxlY3RBbGwoJ3JlY3QuYmxvY2snKS5kYXRhKGQ9PiB7XG5cdCAgICBkLnNibG9ja3MuZm9yRWFjaChiPT5iLnhzY2FsZSA9IGQueHNjYWxlKTtcblx0ICAgIHJldHVybiBkLnNibG9ja3Ncblx0ICAgIH0sIHNiPT5zYi5pbmRleCk7XG4gICAgICAgIHNicmVjdHMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKS5hcHBlbmQoJ3RpdGxlJyk7XG5cdHNicmVjdHMuZXhpdCgpLnJlbW92ZSgpO1xuXHRzYnJlY3RzXG5cdCAgIC5hdHRyKCdjbGFzcycsIGIgPT4gJ2Jsb2NrICcgKyBcblx0ICAgICAgIChiLm9yaT09PScrJyA/ICdwbHVzJyA6IGIub3JpPT09Jy0nID8gJ21pbnVzJzogJ2NvbmZ1c2VkJykgKyBcblx0ICAgICAgIChiLmNociAhPT0gYi5mQ2hyID8gJyB0cmFuc2xvY2F0aW9uJyA6ICcnKSlcblx0ICAgLmF0dHIoJ3gnLCAgICAgYiA9PiBiLnhzY2FsZShiLmZsaXAgPyBiLmVuZCA6IGIuc3RhcnQpKVxuXHQgICAuYXR0cigneScsICAgICBiID0+IC10aGlzLmJsb2NrSGVpZ2h0IC8gMilcblx0ICAgLmF0dHIoJ3dpZHRoJywgYiA9PiBNYXRoLm1heCg0LCBNYXRoLmFicyhiLnhzY2FsZShiLmVuZCktYi54c2NhbGUoYi5zdGFydCkpKSlcblx0ICAgLmF0dHIoJ2hlaWdodCcsdGhpcy5ibG9ja0hlaWdodCk7XG5cdCAgIDtcblx0c2JyZWN0cy5zZWxlY3QoJ3RpdGxlJylcblx0ICAgLnRleHQoIGIgPT4ge1xuXHQgICAgICAgbGV0IGFkamVjdGl2ZXMgPSBbXTtcblx0ICAgICAgIGIub3JpID09PSAnLScgJiYgYWRqZWN0aXZlcy5wdXNoKCdpbnZlcnRlZCcpO1xuXHQgICAgICAgYi5jaHIgIT09IGIuZkNociAmJiBhZGplY3RpdmVzLnB1c2goJ3RyYW5zbG9jYXRlZCcpO1xuXHQgICAgICAgcmV0dXJuIGFkamVjdGl2ZXMubGVuZ3RoID8gYWRqZWN0aXZlcy5qb2luKCcsICcpICsgJyBibG9jaycgOiAnJztcblx0ICAgfSk7XG5cblx0Ly8gdGhlIGF4aXMgbGluZVxuXHRsMC5hcHBlbmQoJ2xpbmUnKS5hdHRyKCdjbGFzcycsJ2F4aXMnKTtcblx0XG5cdHNibG9ja3Muc2VsZWN0KCdsaW5lLmF4aXMnKVxuXHQgICAgLmF0dHIoJ3gxJywgYiA9PiBiLnhzY2FsZShiLnN0YXJ0KSlcblx0ICAgIC5hdHRyKCd5MScsIDApXG5cdCAgICAuYXR0cigneDInLCBiID0+IGIueHNjYWxlKGIuZW5kKSlcblx0ICAgIC5hdHRyKCd5MicsIDApXG5cdCAgICA7XG5cdC8vIGxhYmVsXG5cdGwwLmFwcGVuZCgndGV4dCcpXG5cdCAgICAuYXR0cignY2xhc3MnLCdibG9ja0xhYmVsJykgO1xuXHQvLyBicnVzaFxuXHRsMC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsJ2JydXNoJyk7XG5cdC8vXG5cdHNibG9ja3MuZXhpdCgpLnJlbW92ZSgpO1xuXG5cdC8vIHN5bnRlbnkgYmxvY2sgbGFiZWxzXG5cdHNibG9ja3Muc2VsZWN0KCd0ZXh0LmJsb2NrTGFiZWwnKVxuXHQgICAgLnRleHQoIGIgPT4gYi5jaHIgKVxuXHQgICAgLmF0dHIoJ3gnLCBiID0+IChiLnhzY2FsZShiLnN0YXJ0KSArIGIueHNjYWxlKGIuZW5kKSkvMiApXG5cdCAgICAuYXR0cigneScsIHRoaXMuYmxvY2tIZWlnaHQgLyAyICsgMTApXG5cdCAgICA7XG5cblx0Ly8gYnJ1c2hcblx0c2Jsb2Nrcy5zZWxlY3QoJ2cuYnJ1c2gnKVxuXHQgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGIgPT4gYHRyYW5zbGF0ZSgwLCR7dGhpcy5ibG9ja0hlaWdodCAvIDJ9KWApXG5cdCAgICAub24oJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGIpIHtcblx0ICAgICAgICBsZXQgY3IgPSB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdGxldCB4ID0gZDMuZXZlbnQuY2xpZW50WCAtIGNyLng7XG5cdFx0bGV0IGMgPSBNYXRoLnJvdW5kKGIueHNjYWxlLmludmVydCh4KSk7XG5cdFx0c2VsZi5zaG93RmxvYXRpbmdUZXh0KGAke2IuY2hyfToke2N9YCwgZDMuZXZlbnQuY2xpZW50WCwgZDMuZXZlbnQuY2xpZW50WSk7XG5cdCAgICB9KVxuXHQgICAgLm9uKCdtb3VzZW91dCcsIGIgPT4gdGhpcy5oaWRlRmxvYXRpbmdUZXh0KCkpXG5cdCAgICAuZWFjaChmdW5jdGlvbihiKSB7XG5cdFx0aWYgKCFiLmJydXNoKSB7XG5cdFx0ICAgIGIuYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxuXHRcdFx0Lm9uKCdicnVzaHN0YXJ0JywgZnVuY3Rpb24oKXsgc2VsZi5iYlN0YXJ0KCBiLCB0aGlzICk7IH0pXG5cdFx0XHQub24oJ2JydXNoJywgICAgICBmdW5jdGlvbigpeyBzZWxmLmJiQnJ1c2goIGIsIHRoaXMgKTsgfSlcblx0XHRcdC5vbignYnJ1c2hlbmQnLCAgIGZ1bmN0aW9uKCl7IHNlbGYuYmJFbmQoIGIsIHRoaXMgKTsgfSlcblx0XHR9XG5cdFx0Yi5icnVzaC54KGIueHNjYWxlKS5jbGVhcigpO1xuXHRcdGQzLnNlbGVjdCh0aGlzKS5jYWxsKGIuYnJ1c2gpO1xuXHQgICAgfSlcblx0ICAgIC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHRcdC5hdHRyKCdoZWlnaHQnLCAxMCk7XG5cblx0dGhpcy5kcmF3RmVhdHVyZXMoc2Jsb2Nrcyk7XG5cblx0Ly9cblx0dGhpcy5hcHAuZmFjZXRNYW5hZ2VyLmFwcGx5QWxsKCk7XG5cblx0Ly8gV2UgbmVlZCB0byBsZXQgdGhlIHZpZXcgcmVuZGVyIGJlZm9yZSBkb2luZyB0aGUgaGlnaGxpZ2h0aW5nLCBzaW5jZSBpdCBkZXBlbmRzIG9uXG5cdC8vIHRoZSBwb3NpdGlvbnMgb2YgcmVjdGFuZ2xlcyBpbiB0aGUgc2NlbmUuXG5cdHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcblx0ICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdH0sIDE1MCk7XG4gICAgfTtcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSBmZWF0dXJlcyAocmVjdGFuZ2xlcykgZm9yIHRoZSBzcGVjaWZpZWQgc3ludGVueSBibG9ja3MuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgc2Jsb2NrcyAoRDMgc2VsZWN0aW9uIG9mIGcuc2Jsb2NrIG5vZGVzKSAtIG11bHRpbGV2ZWwgc2VsZWN0aW9uLlxuICAgIC8vICAgICAgICBBcnJheSAoY29ycmVzcG9uZGluZyB0byBzdHJpcHMpIG9mIGFycmF5cyBvZiBzeW50ZW55IGJsb2Nrcy5cbiAgICAvLyAgICAgZGV0YWlsZWQgKGJvb2xlYW4pIGlmIHRydWUsIGRyYXdzIGVhY2ggZmVhdHVyZSBpbiBmdWxsIGRldGFpbCAoaWUsXG4gICAgLy8gICAgICAgIHNob3cgZXhvbiBzdHJ1Y3R1cmUgaWYgYXZhaWxhYmxlKS4gT3RoZXJ3aXNlICh0aGUgZGVmYXVsdCksIGRyYXdcbiAgICAvLyAgICAgICAgZWFjaCBmZWF0dXJlIGFzIGp1c3QgYSByZWN0YW5nbGUuXG4gICAgLy9cbiAgICBkcmF3RmVhdHVyZXMgKHNibG9ja3MpIHtcblx0Ly8gYmVmb3JlIGRvaW5nIGFueXRoaW5nIGVsc2UuLi5cblx0aWYgKHRoaXMuY2xlYXJBbGwpXG5cdCAgICBzYmxvY2tzLnNlbGVjdEFsbCgnLmZlYXR1cmUnKS5yZW1vdmUoKTtcblx0Ly8gb2ssIG5vdyB0aGF0J3MgdGFrZW4gY2FyZSBvZi4uLlxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdC8vXG5cdC8vIG5ldmVyIGRyYXcgdGhlIHNhbWUgZmVhdHVyZSB0d2ljZSBpbiBvbmUgcmVuZGVyaW5nIHBhc3Ncblx0bGV0IGRyYXduID0gbmV3IFNldCgpO1x0Ly8gc2V0IG9mIElEcyBvZiBkcmF3biBmZWF0dXJlc1xuXHRsZXQgZmlsdGVyRHJhd24gPSBmdW5jdGlvbiAoZikge1xuXHQgICAgLy8gcmV0dXJucyB0cnVlIGlmIHdlJ3ZlIG5vdCBzZWVuIHRoaXMgb25lIGJlZm9yZS5cblx0ICAgIC8vIHJlZ2lzdGVycyB0aGF0IHdlJ3ZlIHNlZW4gaXQuXG5cdCAgICBsZXQgZmlkID0gZi5JRDtcblx0ICAgIGxldCB2ID0gISBkcmF3bi5oYXMoZmlkKTtcblx0ICAgIGRyYXduLmFkZChmaWQpO1xuXHQgICAgcmV0dXJuIHY7XG5cdH07XG5cdC8vXG5cdGxldCBmZWF0cyA9IHNibG9ja3Muc2VsZWN0KCdbbmFtZT1cImxheWVyMVwiXScpLnNlbGVjdEFsbCgnLmZlYXR1cmUnKVxuXHQgICAgLmRhdGEoZD0+ZC5mZWF0dXJlcy5maWx0ZXIoZmlsdGVyRHJhd24pLCBkPT5kLklEKTtcblx0ZmVhdHMuZXhpdCgpLnJlbW92ZSgpO1xuXHQvL1xuXHRsZXQgbmV3RmVhdHM7XG5cdGlmICh0aGlzLnNob3dGZWF0dXJlRGV0YWlscykge1xuXHQgICAgLy8gZHJhdyBkZXRhaWxlZCBmZWF0dXJlc1xuXHQgICAgbmV3RmVhdHMgPSBmZWF0cy5lbnRlcigpLmFwcGVuZCgnZycpXG5cdFx0LmF0dHIoJ2NsYXNzJywgZiA9PiAnZmVhdHVyZSBkZXRhaWxlZCAnICsgKGYuc3RyYW5kPT09Jy0nID8gJyBtaW51cycgOiAnIHBsdXMnKSlcblx0XHQuYXR0cignbmFtZScsIGYgPT4gZi5JRClcblx0XHQ7XG5cdCAgICBuZXdGZWF0cy5hcHBlbmQoJ3JlY3QnKVxuXHRcdC5zdHlsZSgnZmlsbCcsIGYgPT4gc2VsZi5hcHAuY3NjYWxlKGYuZ2V0TXVuZ2VkVHlwZSgpKSlcblx0XHQ7XG5cdCAgICBuZXdGZWF0cy5hcHBlbmQoJ2xpbmUnKVxuXHQgICAgICAgIC5hdHRyKCdjbGFzcycsJ2F4aXMnKVxuXHQgICAgICAgIDtcblx0ICAgIG5ld0ZlYXRzLmFwcGVuZCgnZycpXG5cdCAgICAgICAgLmF0dHIoJ2NsYXNzJywnZXhvbnMnKVxuXHRcdDtcblx0fVxuXHRlbHNlIHtcblx0ICAgIC8vIGRyYXcgc2ltcGxlIGZlYXR1cmVzXG5cdCAgICBuZXdGZWF0cyA9IGZlYXRzLmVudGVyKCkuYXBwZW5kKCdyZWN0Jylcblx0XHQuYXR0cignY2xhc3MnLCBmID0+ICdmZWF0dXJlJyArIChmLnN0cmFuZD09PSctJyA/ICcgbWludXMnIDogJyBwbHVzJykpXG5cdFx0LmF0dHIoJ25hbWUnLCBmID0+IGYuSUQpXG5cdFx0LnN0eWxlKCdmaWxsJywgZiA9PiBzZWxmLmFwcC5jc2NhbGUoZi5nZXRNdW5nZWRUeXBlKCkpKVxuXHRcdDtcblx0fVxuXHQvLyBOQjogaWYgeW91IGFyZSBsb29raW5nIGZvciBjbGljayBoYW5kbGVycywgdGhleSBhcmUgYXQgdGhlIHN2ZyBsZXZlbCAoc2VlIGluaXREb20gYWJvdmUpLlxuXG5cdC8vIHJldHVybnMgdGhlIHN5bnRlbnkgYmxvY2sgY29udGFpbmluZyB0aGlzIGZlYXR1cmVcblx0bGV0IGZCbG9jayA9IGZ1bmN0aW9uIChmZWF0RWx0KSB7XG5cdCAgICBsZXQgYmxrRWx0ID0gZmVhdEVsdC5jbG9zZXN0KCcuc0Jsb2NrJyk7XG5cdCAgICByZXR1cm4gYmxrRWx0Ll9fZGF0YV9fO1xuXHR9XG5cdC8vIFJldHVybnMgdGhlIHNjZW5lIHggY29vcmRpbmF0ZSBmb3IgdGhlIGdpdmVuIGZlYXR1cmUuXG5cdGxldCBmeCA9IGZ1bmN0aW9uKGYpIHtcblx0ICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgcmV0dXJuIGIueHNjYWxlKE1hdGgubWF4KGYuc3RhcnQsYi5zdGFydCkpXG5cdH07XG5cdC8vIFJldHVybnMgdGhlIHNjZW5lIHdpZHRoIGZvciB0aGUgZ2l2ZW4gZmVhdHVyZS5cblx0bGV0IGZ3ID0gZnVuY3Rpb24gKGYpIHtcblx0ICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgaWYgKGYuZW5kIDwgYi5zdGFydCB8fCBmLnN0YXJ0ID4gYi5lbmQpIHJldHVybiAwO1xuXHQgICAgcmV0dXJuIE1hdGguYWJzKGIueHNjYWxlKE1hdGgubWluKGYuZW5kLGIuZW5kKSkgLSBiLnhzY2FsZShNYXRoLm1heChmLnN0YXJ0LGIuc3RhcnQpKSkgKyAxO1xuXHR9O1xuXHQvLyBSZXR1cm5zIHRoZSBzY2VuZSB5IGNvb3JkaW5hdGUgKHB4KSBmb3IgdGhlIGdpdmVuIGZlYXR1cmUuXG5cdGxldCBmeSA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICAgICBsZXQgYiA9IGZCbG9jayh0aGlzKTtcblx0ICAgICAgIGlmIChmLnN0cmFuZCA9PSAnKycpe1xuXHRcdCAgIGlmIChiLmZsaXApIFxuXHRcdCAgICAgICByZXR1cm4gc2VsZi5sYW5lSGVpZ2h0KmYubGFuZSAtIHNlbGYuZmVhdEhlaWdodDsgXG5cdFx0ICAgZWxzZSBcblx0XHQgICAgICAgcmV0dXJuIC1zZWxmLmxhbmVIZWlnaHQqZi5sYW5lO1xuXHQgICAgICAgfVxuXHQgICAgICAgZWxzZSB7XG5cdFx0ICAgLy8gZi5sYW5lIGlzIG5lZ2F0aXZlIGZvciAnLScgc3RyYW5kXG5cdFx0ICAgaWYgKGIuZmxpcCkgXG5cdFx0ICAgICAgIHJldHVybiBzZWxmLmxhbmVIZWlnaHQqZi5sYW5lO1xuXHRcdCAgIGVsc2Vcblx0XHQgICAgICAgcmV0dXJuIC1zZWxmLmxhbmVIZWlnaHQqZi5sYW5lIC0gc2VsZi5mZWF0SGVpZ2h0OyBcblx0ICAgICAgIH1cblx0ICAgfTtcblxuXHQvLyBTZXQgcG9zaXRpb24gYW5kIHNpemUgYXR0cmlidXRlcyBvZiB0aGUgb3ZlcmFsbCBmZWF0dXJlIHJlY3QuXG5cdCh0aGlzLnNob3dGZWF0dXJlRGV0YWlscyA/IGZlYXRzLnNlbGVjdCgncmVjdCcpIDogZmVhdHMpXG5cdCAgLmF0dHIoJ3gnLCBmeClcblx0ICAuYXR0cigneScsIGZ5KVxuXHQgIC5hdHRyKCd3aWR0aCcsIGZ3KVxuXHQgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmZlYXRIZWlnaHQpXG5cdCAgO1xuXG5cdC8vIGRyYXcgZGV0YWlsZWQgZmVhdHVyZVxuXHRpZiAodGhpcy5zaG93RmVhdHVyZURldGFpbHMpIHtcblx0ICAgIC8vIGRyYXcgYXhpcyBsaW5lXG5cdCAgICBmZWF0cy5zZWxlY3QoJ2xpbmUnKVxuXHQgICAgICAgIC5hdHRyKCd4MScsIGZ4KVxuXHRcdC5hdHRyKCd5MScsIGZ5KVxuXHRcdC5hdHRyKCd4MicsIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmeC5iaW5kKHRoaXMpKGYpICsgZncuYmluZCh0aGlzKShmKSAtIDEgfSlcblx0XHQuYXR0cigneTInLCBmeSlcblx0XHQuYXR0cigndHJhbnNmb3JtJyxgdHJhbnNsYXRlKDAsJHt0aGlzLmZlYXRIZWlnaHQvMn0pYClcblx0XHQuYXR0cignc3Ryb2tlJywgZiA9PiB0aGlzLmFwcC5jc2NhbGUoZi5nZXRNdW5nZWRUeXBlKCkpKVxuXHRcdDtcblx0ICAgIC8vIGRyYXcgZXhvbnNcblx0ICAgIGxldCBmRGF0YSA9IGZlYXRzLmRhdGEoKTtcblx0ICAgIGxldCBnZW5lSWRzID0gZkRhdGEubWFwKGYgPT4gZi5JRCk7XG5cdCAgICBsZXQgZWdycHMgPSBmZWF0cy5zZWxlY3QoJ2cuZXhvbnMnKTtcblx0ICAgIGxldCBleG9ucyA9IGVncnBzLnNlbGVjdEFsbCgnLmV4b24nKVxuXHRcdC5kYXRhKGYgPT4gZi5leG9ucyB8fCBbXSwgZSA9PiBlLklEKVxuXHRcdDtcblx0ICAgIGV4b25zLmVudGVyKCkuYXBwZW5kKCdyZWN0Jylcblx0XHQuYXR0cignY2xhc3MnLCdleG9uJylcblx0XHQuc3R5bGUoJ2ZpbGwnLCBlID0+IHRoaXMuYXBwLmNzY2FsZShlLmZlYXR1cmUuZ2V0TXVuZ2VkVHlwZSgpKSlcblx0XHQuYXBwZW5kKCd0aXRsZScpXG5cdFx0ICAgIC50ZXh0KGUgPT4gZS5JRClcblx0XHQgICAgO1xuXHQgICAgZXhvbnMuZXhpdCgpLnJlbW92ZSgpO1xuXHQgICAgZXhvbnMuYXR0cignbmFtZScsIGUgPT4gZS5wcmltYXJ5SWRlbnRpZmllcilcblx0ICAgICAgICAuYXR0cigneCcsIGZ4KVxuXHQgICAgICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oZSkge3JldHVybiBmeS5iaW5kKHRoaXMpKGUuZmVhdHVyZSl9KVxuXHQgICAgICAgIC5hdHRyKCd3aWR0aCcsIGZ3KVxuXHQgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmZlYXRIZWlnaHQpXG5cdFx0O1xuXHR9XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyBmZWF0dXJlIGhpZ2hsaWdodGluZyBpbiB0aGUgY3VycmVudCB6b29tIHZpZXcuXG4gICAgLy8gRmVhdHVyZXMgdG8gYmUgaGlnaGxpZ2h0ZWQgaW5jbHVkZSB0aG9zZSBpbiB0aGUgaGlGZWF0cyBsaXN0IHBsdXMgdGhlIGZlYXR1cmVcbiAgICAvLyBjb3JyZXNwb25kaW5nIHRvIHRoZSByZWN0YW5nbGUgYXJndW1lbnQsIGlmIGdpdmVuLiAoVGhlIG1vdXNlb3ZlciBmZWF0dXJlLilcbiAgICAvL1xuICAgIC8vIERyYXdzIGZpZHVjaWFscyBmb3IgZmVhdHVyZXMgaW4gdGhpcyBsaXN0IHRoYXQ6XG4gICAgLy8gMS4gb3ZlcmxhcCB0aGUgY3VycmVudCB6b29tVmlldyBjb29yZCByYW5nZVxuICAgIC8vIDIuIGFyZSBub3QgcmVuZGVyZWQgaW52aXNpYmxlIGJ5IGN1cnJlbnQgZmFjZXQgc2V0dGluZ3NcbiAgICAvL1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgY3VycmVudCAocmVjdCBlbGVtZW50KSBPcHRpb25hbC4gQWRkJ2wgcmVjdGFuZ2xlIGVsZW1lbnQsIGUuZy4sIHRoYXQgd2FzIG1vdXNlZC1vdmVyLiBIaWdobGlnaHRpbmdcbiAgICAvLyAgICAgICAgd2lsbCBpbmNsdWRlIHRoZSBmZWF0dXJlIGNvcnJlc3BvbmRpbmcgdG8gdGhpcyByZWN0IGFsb25nIHdpdGggdGhvc2UgaW4gdGhlIGhpZ2hsaWdodCBsaXN0LlxuICAgIC8vICAgIHB1bHNlQ3VycmVudCAoYm9vbGVhbikgSWYgdHJ1ZSBhbmQgY3VycmVudCBpcyBnaXZlbiwgY2F1c2UgaXQgdG8gcHVsc2UgYnJpZWZseS5cbiAgICAvL1xuICAgIGhpZ2hsaWdodCAoY3VycmVudCwgcHVsc2VDdXJyZW50KSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0Ly8gY3VycmVudCBmZWF0dXJlXG5cdGxldCBjdXJyRmVhdCA9IGN1cnJlbnQgPyAoY3VycmVudCBpbnN0YW5jZW9mIEZlYXR1cmUgPyBjdXJyZW50IDogY3VycmVudC5fX2RhdGFfXykgOiBudWxsO1xuXHQvLyBjcmVhdGUgbG9jYWwgY29weSBvZiBoaUZlYXRzLCB3aXRoIGN1cnJlbnQgZmVhdHVyZSBhZGRlZFxuXHRsZXQgaGlGZWF0cyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuaGlGZWF0cywgdGhpcy5hcHAuY3Vyckxpc3RJbmRleCB8fHt9KTtcblx0aWYgKGN1cnJGZWF0KSB7XG5cdCAgICBoaUZlYXRzW2N1cnJGZWF0LmlkXSA9IGN1cnJGZWF0LmlkO1xuXHR9XG5cblx0Ly8gRmlsdGVyIGFsbCBmZWF0dXJlcyAocmVjdGFuZ2xlcykgaW4gdGhlIHNjZW5lIGZvciB0aG9zZSBiZWluZyBoaWdobGlnaHRlZC5cblx0Ly8gQWxvbmcgdGhlIHdheSwgYnVpbGQgaW5kZXggbWFwcGluZyBmZWF0dXJlIGlkIHRvIGl0cyAnc3RhY2snIG9mIGVxdWl2YWxlbnQgZmVhdHVyZXMsXG5cdC8vIGkuZS4gYSBsaXN0IG9mIGl0cyBnZW5vbG9ncyBzb3J0ZWQgYnkgeSBjb29yZGluYXRlLlxuXHQvL1xuXHR0aGlzLnN0YWNrcyA9IHt9OyAvLyBmaWQgLT4gWyByZWN0cyBdIFxuXHRsZXQgZGggPSB0aGlzLmJsb2NrSGVpZ2h0LzIgLSB0aGlzLmZlYXRIZWlnaHQ7XG4gICAgICAgIGxldCBmZWF0cyA9IHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoJy5mZWF0dXJlJylcblx0ICAvLyBmaWx0ZXIgcmVjdC5mZWF0dXJlcyBmb3IgdGhvc2UgaW4gdGhlIGhpZ2hsaWdodCBsaXN0XG5cdCAgLmZpbHRlcihmdW5jdGlvbihmZil7XG5cdCAgICAgIC8vIGhpZ2hsaWdodCBmZiBpZiBlaXRoZXIgaWQgaXMgaW4gdGhlIGxpc3QgQU5EIGl0J3Mgbm90IGJlZW4gaGlkZGVuXG5cdCAgICAgIGxldCBtZ2kgPSBoaUZlYXRzW2ZmLmNhbm9uaWNhbF07XG5cdCAgICAgIGxldCBtZ3AgPSBoaUZlYXRzW2ZmLklEXTtcblx0ICAgICAgbGV0IHNob3dpbmcgPSBkMy5zZWxlY3QodGhpcykuc3R5bGUoJ2Rpc3BsYXknKSAhPT0gJ25vbmUnO1xuXHQgICAgICBsZXQgaGwgPSBzaG93aW5nICYmIChtZ2kgfHwgbWdwKTtcblx0ICAgICAgaWYgKGhsKSB7XG5cdFx0ICAvLyBmb3IgZWFjaCBoaWdobGlnaHRlZCBmZWF0dXJlLCBhZGQgaXRzIHJlY3RhbmdsZSB0byB0aGUgbGlzdFxuXHRcdCAgbGV0IGsgPSBmZi5pZDtcblx0XHQgIGlmICghc2VsZi5zdGFja3Nba10pIHNlbGYuc3RhY2tzW2tdID0gW11cblx0XHQgIC8vIGlmIHNob3dpbmcgZmVhdHVyZSBkZXRhaWxzLCAuZmVhdHVyZSBpcyBhIGdyb3VwIHdpdGggdGhlIHJlY3QgYXMgdGhlIGZpcnN0IGNoaWxkLlxuXHRcdCAgLy8gb3RoZXJ3aXNlLCAuZmVhdHVyZSBpcyB0aGUgcmVjdCBpdHNlbGYuXG5cdFx0ICBzZWxmLnN0YWNrc1trXS5wdXNoKHRoaXMudGFnTmFtZSA9PT0gJ2cnID8gdGhpcy5jaGlsZE5vZGVzWzBdIDogdGhpcylcblx0ICAgICAgfVxuXHQgICAgICAvLyBcblx0ICAgICAgZDMuc2VsZWN0KHRoaXMpXG5cdFx0ICAuY2xhc3NlZCgnaGlnaGxpZ2h0JywgaGwpXG5cdFx0ICAuY2xhc3NlZCgnY3VycmVudCcsIGhsICYmIGN1cnJGZWF0ICYmIHRoaXMuX19kYXRhX18uaWQgPT09IGN1cnJGZWF0LmlkKVxuXHRcdCAgLmNsYXNzZWQoJ2V4dHJhJywgcHVsc2VDdXJyZW50ICYmIGZmID09PSBjdXJyRmVhdClcblx0ICAgICAgcmV0dXJuIGhsO1xuXHQgIH0pXG5cdCAgO1xuXG5cdHRoaXMuZHJhd0ZpZHVjaWFscyhjdXJyRmVhdCk7XG5cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyBwb2x5Z29ucyB0aGF0IGNvbm5lY3QgaGlnaGxpZ2h0ZWQgZmVhdHVyZXMgaW4gdGhlIHZpZXdcbiAgICAvL1xuICAgIGRyYXdGaWR1Y2lhbHMgKGN1cnJGZWF0KSB7XG5cdC8vIGJ1aWxkIGRhdGEgYXJyYXkgZm9yIGRyYXdpbmcgZmlkdWNpYWxzIGJldHdlZW4gZXF1aXZhbGVudCBmZWF0dXJlc1xuXHRsZXQgZGF0YSA9IFtdO1xuXHRmb3IgKGxldCBrIGluIHRoaXMuc3RhY2tzKSB7XG5cdCAgICAvLyBmb3IgZWFjaCBoaWdobGlnaHRlZCBmZWF0dXJlLCBzb3J0IHRoZSByZWN0YW5nbGVzIGluIGl0cyBsaXN0IGJ5IFktY29vcmRpbmF0ZVxuXHQgICAgbGV0IHJlY3RzID0gdGhpcy5zdGFja3Nba107XG5cdCAgICByZWN0cy5zb3J0KCAoYSxiKSA9PiBwYXJzZUZsb2F0KGEuZ2V0QXR0cmlidXRlKCd5JykpIC0gcGFyc2VGbG9hdChiLmdldEF0dHJpYnV0ZSgneScpKSApO1xuXHQgICAgcmVjdHMuc29ydCggKGEsYikgPT4ge1xuXHRcdHJldHVybiBhLl9fZGF0YV9fLmdlbm9tZS56b29tWSAtIGIuX19kYXRhX18uZ2Vub21lLnpvb21ZO1xuXHQgICAgfSk7XG5cdCAgICAvLyBXYW50IGEgcG9seWdvbiBiZXR3ZWVuIGVhY2ggc3VjY2Vzc2l2ZSBwYWlyIG9mIGl0ZW1zLiBUaGUgZm9sbG93aW5nIGNyZWF0ZXMgYSBsaXN0IG9mXG5cdCAgICAvLyBuIHBhaXJzLCB3aGVyZSByZWN0W2ldIGlzIHBhaXJlZCB3aXRoIHJlY3RbaSsxXS4gVGhlIGxhc3QgcGFpciBjb25zaXN0cyBvZiB0aGUgbGFzdFxuXHQgICAgLy8gcmVjdGFuZ2xlIHBhaXJlZCB3aXRoIHVuZGVmaW5lZC4gKFdlIHdhbnQgdGhpcy4pXG5cdCAgICBsZXQgcGFpcnMgPSByZWN0cy5tYXAoKHIsIGkpID0+IFtyLHJlY3RzW2krMV1dKTtcblx0ICAgIC8vIEFkZCBhIGNsYXNzICgnY3VycmVudCcpIGZvciB0aGUgcG9seWdvbnMgYXNzb2NpYXRlZCB3aXRoIHRoZSBtb3VzZW92ZXIgZmVhdHVyZSBzbyB0aGV5XG5cdCAgICAvLyBjYW4gYmUgZGlzdGluZ3Vpc2hlZCBmcm9tIG90aGVycy5cblx0ICAgIGRhdGEucHVzaCh7IGZpZDogaywgcmVjdHM6IHBhaXJzLCBjbHM6IChjdXJyRmVhdCAmJiBjdXJyRmVhdC5pZCA9PT0gayA/ICdjdXJyZW50JyA6ICcnKSB9KTtcblx0fVxuXG5cdGxldCBzZWxmID0gdGhpcztcblx0Ly9cblx0Ly8gcHV0IGZpZHVjaWFsIG1hcmtzIGluIHRoZWlyIG93biBncm91cCBcblx0bGV0IGZHcnAgPSB0aGlzLmZpZHVjaWFscy5jbGFzc2VkKCdoaWRkZW4nLCBmYWxzZSk7XG5cblx0Ly8gQmluZCBmaXJzdCBsZXZlbCBkYXRhIHRvICdmZWF0dXJlTWFya3MnIGdyb3Vwc1xuXHRsZXQgZmZHcnBzID0gZkdycC5zZWxlY3RBbGwoJ2cuZmVhdHVyZU1hcmtzJylcblx0ICAgIC5kYXRhKGRhdGEsIGQgPT4gZC5maWQpO1xuXHRmZkdycHMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuXHQgICAgLmF0dHIoJ25hbWUnLCBkID0+IGQuZmlkKTtcblx0ZmZHcnBzLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0ZmZHcnBzLmF0dHIoJ2NsYXNzJywgZCA9PiB7XG4gICAgICAgICAgICBsZXQgY2xhc3NlcyA9IFsnZmVhdHVyZU1hcmtzJ107XG5cdCAgICBkLmNscyAmJiBjbGFzc2VzLnB1c2goZC5jbHMpO1xuXHQgICAgdGhpcy5hcHAuY3Vyckxpc3RJbmRleFtkLmZpZF0gJiYgY2xhc3Nlcy5wdXNoKCdsaXN0SXRlbScpXG5cdCAgICByZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XG5cdH0pO1xuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRHJhdyB0aGUgY29ubmVjdG9yIHBvbHlnb25zLlxuXHQvLyBCaW5kIHNlY29uZCBsZXZlbCBkYXRhIChyZWN0YW5nbGUgcGFpcnMpIHRvIHBvbHlnb25zIGluIHRoZSBncm91cFxuXHRsZXQgcGdvbnMgPSBmZkdycHMuc2VsZWN0QWxsKCdwb2x5Z29uJylcblx0ICAgIC5kYXRhKGQ9PmQucmVjdHMuZmlsdGVyKHIgPT4gclswXSAmJiByWzFdKSk7XG5cdHBnb25zLmVudGVyKCkuYXBwZW5kKCdwb2x5Z29uJylcblx0ICAgIC5hdHRyKCdjbGFzcycsJ2ZpZHVjaWFsJylcblx0ICAgIDtcblx0Ly9cblx0cGdvbnMuYXR0cigncG9pbnRzJywgciA9PiB7XG5cdCAgICAvLyBwb2x5Z29uIGNvbm5lY3RzIGJvdHRvbSBjb3JuZXJzIG9mIDFzdCByZWN0IHRvIHRvcCBjb3JuZXJzIG9mIDJuZCByZWN0XG5cdCAgICBsZXQgYzEgPSBjb29yZHNBZnRlclRyYW5zZm9ybShyWzBdKTsgLy8gdHJhbnNmb3JtIGNvb3JkcyBmb3IgMXN0IHJlY3Rcblx0ICAgIGxldCBjMiA9IGNvb3Jkc0FmdGVyVHJhbnNmb3JtKHJbMV0pOyAgLy8gdHJhbnNmb3JtIGNvb3JkcyBmb3IgMm5kIHJlY3Rcblx0ICAgIHIudGNvb3JkcyA9IFtjMSxjMl07XG5cdCAgICAvLyBmb3VyIHBvbHlnb24gcG9pbnRzXG5cdCAgICBsZXQgcyA9IGAke2MxLnh9LCR7YzEueStjMS5oZWlnaHR9ICR7YzIueH0sJHtjMi55fSAke2MyLngrYzIud2lkdGh9LCR7YzIueX0gJHtjMS54K2MxLndpZHRofSwke2MxLnkrYzEuaGVpZ2h0fWBcblx0ICAgIHJldHVybiBzO1xuXHR9KVxuXHQvL1xuXHQvLyBtb3VzaW5nIG92ZXIgdGhlIGZpZHVjaWFsIGhpZ2hsaWdodHMgKGFzIGlmIHRoZSB1c2VyIGhhZCBtb3VzZWQgb3ZlciB0aGUgZmVhdHVyZSBpdHNlbGYpXG5cdC5vbignbW91c2VvdmVyJywgKHApID0+IHtcblx0ICAgIHRoaXMuaGlnaGxpZ2h0KHBbMF0pO1xuXHR9KVxuXHQub24oJ21vdXNlb3V0JywgIChwKSA9PiB7XG5cdCAgICB0aGlzLmhpZ2hsaWdodCgpO1xuXHR9KTtcblx0Ly9cblx0cGdvbnMuZXhpdCgpLnJlbW92ZSgpO1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIERyYXcgZmVhdHVyZSBsYWJlbHMuIEVhY2ggbGFiZWwgaXMgZHJhd24gb25jZSwgYWJvdmUgdGhlIGZpcnN0IHJlY3RhbmdsZSBpbiBpdHMgbGlzdC5cblx0Ly8gVGhlIGV4Y2VwdGlvbiBpcyB0aGUgY3VycmVudCAobW91c2VvdmVyKSBmZWF0dXJlLCB3aGVyZSB0aGUgbGFiZWwgaXMgZHJhd24gYWJvdmUgdGhhdCBmZWF0dXJlLlxuXHRsZXQgbGFiZWxzID0gZmZHcnBzLnNlbGVjdEFsbCgndGV4dC5mZWF0TGFiZWwnKVxuXHQgICAgLmRhdGEoZCA9PiB7XG5cdFx0bGV0IHIgPSBkLnJlY3RzWzBdWzBdO1xuXHRcdGlmIChjdXJyRmVhdCAmJiAoZC5maWQgPT09IGN1cnJGZWF0LklEIHx8IGQuZmlkID09PSBjdXJyRmVhdC5jYW5vbmljYWwpKXtcblx0XHQgICAgbGV0IHIyID0gZC5yZWN0cy5tYXAoIHJyID0+XG5cdFx0ICAgICAgIHJyWzBdLl9fZGF0YV9fID09PSBjdXJyRmVhdCA/IHJyWzBdIDogcnJbMV0mJnJyWzFdLl9fZGF0YV9fID09PSBjdXJyRmVhdCA/IHJyWzFdIDogbnVsbFxuXHRcdCAgICAgICApLmZpbHRlcih4PT54KVswXTtcblx0XHQgICAgciA9IHIyID8gcjIgOiByO1xuXHRcdH1cblx0ICAgICAgICByZXR1cm4gW3tcblx0XHQgICAgZmlkOiBkLmZpZCxcblx0XHQgICAgcmVjdDogcixcblx0XHQgICAgdHJlY3Q6IGNvb3Jkc0FmdGVyVHJhbnNmb3JtKHIpXG5cdFx0fV07XG5cdCAgICB9KTtcblxuXHQvLyBEcmF3IHRoZSB0ZXh0LlxuXHRsYWJlbHMuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKS5hdHRyKCdjbGFzcycsJ2ZlYXRMYWJlbCcpO1xuXHRsYWJlbHMuZXhpdCgpLnJlbW92ZSgpO1xuXHRsYWJlbHNcblx0ICAuYXR0cigneCcsIGQgPT4gZC50cmVjdC54ICsgZC50cmVjdC53aWR0aC8yIClcblx0ICAuYXR0cigneScsIGQgPT4gZC5yZWN0Ll9fZGF0YV9fLmdlbm9tZS56b29tWSsxNSlcblx0ICAudGV4dChkID0+IHtcblx0ICAgICAgIGxldCBmID0gZC5yZWN0Ll9fZGF0YV9fO1xuXHQgICAgICAgbGV0IHN5bSA9IGYuc3ltYm9sIHx8IGYuSUQ7XG5cdCAgICAgICByZXR1cm4gc3ltO1xuXHQgIH0pO1xuXG5cdC8vIFB1dCBhIHJlY3RhbmdsZSBiZWhpbmQgZWFjaCBsYWJlbCBhcyBhIGJhY2tncm91bmRcblx0bGV0IGxibEJveERhdGEgPSBsYWJlbHMubWFwKGxibCA9PiBsYmxbMF0uZ2V0QkJveCgpKVxuXHRsZXQgbGJsQm94ZXMgPSBmZkdycHMuc2VsZWN0QWxsKCdyZWN0LmZlYXRMYWJlbEJveCcpXG5cdCAgICAuZGF0YSgoZCxpKSA9PiBbbGJsQm94RGF0YVtpXV0pO1xuXHRsYmxCb3hlcy5lbnRlcigpLmluc2VydCgncmVjdCcsJ3RleHQnKS5hdHRyKCdjbGFzcycsJ2ZlYXRMYWJlbEJveCcpO1xuXHRsYmxCb3hlcy5leGl0KCkucmVtb3ZlKCk7XG5cdGxibEJveGVzXG5cdCAgICAuYXR0cigneCcsICAgICAgYmIgPT4gYmIueC0yKVxuXHQgICAgLmF0dHIoJ3knLCAgICAgIGJiID0+IGJiLnktMSlcblx0ICAgIC5hdHRyKCd3aWR0aCcsICBiYiA9PiBiYi53aWR0aCs0KVxuXHQgICAgLmF0dHIoJ2hlaWdodCcsIGJiID0+IGJiLmhlaWdodCsyKVxuXHQgICAgO1xuXHRcblx0Ly8gaWYgdGhlcmUgaXMgYSBjdXJyRmVhdCwgbW92ZSBpdHMgZmlkdWNpYWxzIHRvIHRoZSBlbmQgKHNvIHRoZXkncmUgb24gdG9wIG9mIGV2ZXJ5b25lIGVsc2UpXG5cdGlmIChjdXJyRmVhdCkge1xuXHQgICAgLy8gZ2V0IGxpc3Qgb2YgZ3JvdXAgZWxlbWVudHMgZnJvbSB0aGUgZDMgc2VsZWN0aW9uXG5cdCAgICBsZXQgZmZMaXN0ID0gZmZHcnBzWzBdO1xuXHQgICAgLy8gZmluZCB0aGUgb25lIHdob3NlIGZlYXR1cmUgaXMgY3VyckZlYXRcblx0ICAgIGxldCBpID0gLTE7XG5cdCAgICBmZkxpc3QuZm9yRWFjaCggKGcsaikgPT4geyBpZiAoZy5fX2RhdGFfXy5maWQgPT09IGN1cnJGZWF0LmlkKSBpID0gajsgfSk7XG5cdCAgICAvLyBpZiB3ZSBmb3VuZCBpdCBhbmQgaXQncyBub3QgYWxyZWFkeSB0aGUgbGFzdCwgbW92ZSBpdCB0byB0aGVcblx0ICAgIC8vIGxhc3QgcG9zaXRpb24gYW5kIHJlb3JkZXIgaW4gdGhlIERPTS5cblx0ICAgIGlmIChpID49IDApIHtcblx0XHRsZXQgbGFzdGkgPSBmZkxpc3QubGVuZ3RoIC0gMTtcblx0ICAgICAgICBsZXQgeCA9IGZmTGlzdFtpXTtcblx0XHRmZkxpc3RbaV0gPSBmZkxpc3RbbGFzdGldO1xuXHRcdGZmTGlzdFtsYXN0aV0gPSB4O1xuXHRcdGZmR3Jwcy5vcmRlcigpO1xuXHQgICAgfVxuXHR9XG5cdFxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWRlRmlkdWNpYWxzICgpIHtcblx0dGhpcy5zdmdNYWluLnNlbGVjdCgnZy5maWR1Y2lhbHMnKVxuXHQgICAgLmNsYXNzZWQoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIFpvb21WaWV3XG5cbmV4cG9ydCB7IFpvb21WaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9ab29tVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==