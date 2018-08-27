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
class Feature {
    constructor (cfg) {
        this.chr     = cfg.chr || cfg.chromosome;
        this.start   = parseInt(cfg.start);
        this.end     = parseInt(cfg.end);
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
	this.translator     = new __WEBPACK_IMPORTED_MODULE_8__BTManager__["a" /* BTManager */](this);
	this.featureManager = new __WEBPACK_IMPORTED_MODULE_3__FeatureManager__["a" /* FeatureManager */](this);
	this.queryManager = new __WEBPACK_IMPORTED_MODULE_4__QueryManager__["a" /* QueryManager */](this, "#findGenesBox");
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
    // Returns a promise for all the exons of all genes that overlap the given range
    // in the given genome.
    ensureExonsByRange (genome, chr, start, end) {
	let ep = this.app.auxDataManager.exonsByRange(genome, chr, start, end);

    }

    //----------------------------------------------
    loadGenomes (genomes) {
        return Promise.all(genomes.map(g => this.ensureFeaturesByGenome (g))).then(()=>true);
    }

    //----------------------------------------------
    getCachedFeatures (genome, range) {
        let gc = this.cache[genome.name] ;
	if (!gc) return [];
	let cFeats = gc[range.chr];
	if (!cFeats) return [];
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
    getFeatures (genome, ranges) {
	return this.ensureFeaturesByGenome(genome).then(function() {
            ranges.forEach( r => {
	        r.features = this.getCachedFeatures(genome, r) 
		r.genome = genome;
	    });
	    return { genome, blocks:ranges };
	}.bind(this));
    }
    //----------------------------------------------
    // Returns a promise for the features having the specified ids from the specified genome.
    getFeaturesById (genome, ids) {
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
    exonsByRange	(genome, chr, start, end) {
	let view = [
	'Exon.gene.canonical.primaryIdentifier',
	'Exon.gene.primaryIdentifier',
	'Exon.transcripts.primaryIdentifier',
	'Exon.primaryIdentifier',
	'Exon.chromosome.primaryIdentifier',
	'Exon.chromosomeLocation.start',
	'Exon.chromosomeLocation.end',
	'Exon.strain.name'
	].join(' ');
        let q = `<query model="genomic" view="${view}" constraintLogic="A and B">
	    <constraint code="A" path="Exon.gene.chromosomeLocation" op="OVERLAPS">
		<value>${chr}:${start}..${end}</value>
	    </constraint>
	    <constraint code="B" path="Exon.strain.name" op="=" value="${genome}"/>
	    </query>`
	return this.getAuxData(q,'json');
    }
    // Returns a promise for all exons of all genologs of the specified canonical gene
    exonsByCanonicalId	(ident) {
	let view = [
	'Exon.gene.canonical.primaryIdentifier',
	'Exon.gene.primaryIdentifier',
	'Exon.transcripts.primaryIdentifier',
	'Exon.primaryIdentifier',
	'Exon.chromosome.primaryIdentifier',
	'Exon.chromosomeLocation.start',
	'Exon.chromosomeLocation.end',
	'Exon.strain.name'
	].join(' ');
        let q = `<query model="genomic" view="${view}" >
	    <constraint code="A" path="Exon.gene.canonical.primaryIdentifier" op="=" value="${ident}" />
	    </query>`
	return this.getAuxData(q,'json');
    }
    //----------------------------------------------
    // Constructs a URL for linking to a MouseMine report page by id
    linkToReportPage (ident) {
        return this.rUrl + ident;
    }
    //----------------------------------------------
    // Constructs a URL to retrieve mouse sequences from MouseMine for the specified feature.
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
      this.showFeatureDetails = false; // if true, show exon structure

      //
      // IDs of Features we're highlighting. May be feature's ID  or canonical IDr./
      // hiFeats is an obj whose keys are the IDs
      this.hiFeats = (initialHi || []).reduce( (a,v) => { a[v]=v; return a; }, {} );
      //
      this.fiducials = this.svg.insert('g',':first-child') // 
        .attr('class','fiducials');
      this.stripsGrp = this.svgMain.append('g')
        .attr('class','strips');
      this.axis = this.svgMain.append('g')
        .attr('class','axis');
      this.floatingText = this.svgMain.append('text')
        .attr('class','floatingText');
      this.cxtMenu = this.root.select('[name="cxtMenu"]');
      //
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
	      if (f instanceof __WEBPACK_IMPORTED_MODULE_1__Feature__["a" /* Feature */]) {
		  fClickHandler(f, d3.event);
	      }
	      d3.event.stopPropagation();
	      d3.event.preventDefault();
	  })
	  .on('mouseover', () => {
	      let tgt = d3.select(d3.event.target);
	      let f = tgt.data()[0];
	      if (f instanceof __WEBPACK_IMPORTED_MODULE_1__Feature__["a" /* Feature */]) {
		  fMouseOverHandler(f);
	      }
	  })
	  .on('mouseout', () => {
	      let tgt = d3.select(d3.event.target);
	      let f = tgt.data()[0];
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
    // Updates the ZoomView to show the given coordinate range from the reg genome and the corresponding
    // range(s) in each comparison genome.
    //
    updateViaMappedCoordinates (coords) {
	let self = this;
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
	    ori    : '+',
	    blockId: mgv.rGenome.name
	    }]));
	if (! self.root.classed('closed')) {
	    // Add a request for each comparison genome, using translated coordinates. 
	    mgv.cGenomes.forEach(cGenome => {
		let ranges = mgv.translator.translate( mgv.rGenome, c.chr, c.start, c.end, cGenome );
		let p = mgv.featureManager.getFeatures(cGenome, ranges);
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
	    let range = {
		genome:	f.genome,
		chr:	f.chr,
		chromosome: f.genome.getChromosome(f.chr),
		start:	start,
		end:	end
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
	let feats = sblocks.select('[name="layer1"]').selectAll('.feature')
	    .data(d=>d.features.filter(filterDrawn), d=>d.ID);
	feats.exit().remove();
	//
	let newFeats;
	if (this.showFeatureDetails) 
	    newFeats = feats.enter().append('g')
		.attr('class', f => 'feature' + (f.strand==='-' ? ' minus' : ' plus'))
		.attr('name', f => f.ID)
		.append('rect')
		    .style('fill', f => self.app.cscale(f.getMungedType()))
		    ;
	else
	    newFeats = feats.enter().append('rect')
		.attr('class', f => 'feature' + (f.strand==='-' ? ' minus' : ' plus'))
		.attr('name', f => f.ID)
		.style('fill', f => self.app.cscale(f.getMungedType()))
		;
	// NB: if you are looking for click handlers, they are at the svg level (see initDom above).

	// returns the synteny block containing this feature
	let fBlock = function (featElt) {
	    let blkElt = featElt.closest('.sBlock');
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

	(this.showFeatureDetails ? feats.select('rect') : feats)
	  .attr('x', fx)
	  .attr('width', fw)
	  .attr('y', fy)
	  .attr('height', this.featHeight)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNGU1YWJhMmFjMWI0ZWU0YWU5YWUiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0tleVN0b3JlLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GZWF0dXJlLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvU1ZHVmlldy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvdmlld2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9NR1ZBcHAuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZS5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2lkYi1rZXl2YWwvZGlzdC9pZGIta2V5dmFsLm1qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvUXVlcnlNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9BdXhEYXRhTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvTGlzdE1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RGb3JtdWxhRXZhbHVhdG9yLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0RWRpdG9yLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GYWNldE1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZhY2V0LmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9CVE1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0Jsb2NrVHJhbnNsYXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvR2Vub21lVmlldy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZURldGFpbHMuanMiLCJ3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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7OztBQ3JEUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7OztBQ3BFUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsa0JBQWtCLEdBQUcsbUJBQW1CLEdBQUcsb0JBQW9CO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1Q0FBdUMs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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxzQkFBc0Isa0JBQWtCO0FBQ3hDLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFLEVBQUU7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsTUFBTTtBQUNOLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxvQkFBb0I7QUFDckQsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsUUFBUSxVQUFVLEVBQUUsSUFBSTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNB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Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixhQUFhO0FBQ2IsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFTzs7Ozs7Ozs7Ozs7OztBQzFMUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFUTs7Ozs7Ozs7Ozs7O0FDL0RjO0FBQ0Y7QUFDSzs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLEVBQUU7QUFDbEIsaUJBQWlCLEtBQUssR0FBRyxFQUFFO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsaUJBQWlCLEdBQUcsZ0JBQWdCLEdBQUcsYUFBYTtBQUNwRSxpQkFBaUIsY0FBYyxHQUFHLGdCQUFnQixHQUFHLGdCQUFnQjtBQUNyRTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELGFBQWE7QUFDbEU7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRU87Ozs7Ozs7Ozs7QUM3U29COztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUTs7Ozs7Ozs7Ozs7O0FDbkVxRDtBQUN6QztBQUNROztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7Ozs7O0FDak9ROztBQUVoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7O0FDN0JSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTzs7Ozs7Ozs7Ozs7O0FDcEJRO0FBQ1U7QUFDUDs7QUFFbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxNQUFNLE1BQU0sTUFBTTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sSUFBSTtBQUNYO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7O0FDOUdSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0Esd0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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O0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLFc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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MkMsRUFBRTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPIiwiZmlsZSI6Im1ndi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0ZTVhYmEyYWMxYjRlZTRhZTlhZSIsIlxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyAgICAgICAgICAgICAgICAgICAgVVRJTFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIChSZS0pSW5pdGlhbGl6ZXMgYW4gb3B0aW9uIGxpc3QuXG4vLyBBcmdzOlxuLy8gICBzZWxlY3RvciAoc3RyaW5nIG9yIE5vZGUpIENTUyBzZWxlY3RvciBvZiB0aGUgY29udGFpbmVyIDxzZWxlY3Q+IGVsZW1lbnQuIE9yIHRoZSBlbGVtZW50IGl0c2VsZi5cbi8vICAgb3B0cyAobGlzdCkgTGlzdCBvZiBvcHRpb24gZGF0YSBvYmplY3RzLiBNYXkgYmUgc2ltcGxlIHN0cmluZ3MuIE1heSBiZSBtb3JlIGNvbXBsZXguXG4vLyAgIHZhbHVlIChmdW5jdGlvbiBvciBudWxsKSBGdW5jdGlvbiB0byBwcm9kdWNlIHRoZSA8b3B0aW9uPiB2YWx1ZSBmcm9tIGFuIG9wdHMgaXRlbVxuLy8gICAgICAgRGVmYXVsdHMgdG8gdGhlIGlkZW50aXR5IGZ1bmN0aW9uICh4PT54KS5cbi8vICAgbGFiZWwgKGZ1bmN0aW9uIG9yIG51bGwpIEZ1bmN0aW9uIHRvIHByb2R1Y2UgdGhlIDxvcHRpb24+IGxhYmVsIGZyb20gYW4gb3B0cyBpdGVtXG4vLyAgICAgICBEZWZhdWx0cyB0byB0aGUgdmFsdWUgZnVuY3Rpb24uXG4vLyAgIG11bHRpIChib29sZWFuKSBTcGVjaWZpZXMgaWYgdGhlIGxpc3Qgc3VwcG9ydCBtdWx0aXBsZSBzZWxlY3Rpb25zLiAoZGVmYXVsdCA9IGZhbHNlKVxuLy8gICBzZWxlY3RlZCAoZnVuY3Rpb24gb3IgbnVsbCkgRnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIGEgZ2l2ZW4gb3B0aW9uIGlzIHNlbGVjdGQuXG4vLyAgICAgICBEZWZhdWx0cyB0byBkPT5GYWxzZS4gTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgb25seSBhcHBsaWVkIHRvIG5ldyBvcHRpb25zLlxuLy8gICBzb3J0QnkgKGZ1bmN0aW9uKSBPcHRpb25hbC4gSWYgcHJvdmlkZWQsIGEgY29tcGFyaXNvbiBmdW5jdGlvbiB0byB1c2UgZm9yIHNvcnRpbmcgdGhlIG9wdGlvbnMuXG4vLyAgIFx0IFRoZSBjb21wYXJpc29uIGZ1bmN0aW9uIGlzIHBhc3NlcyB0aGUgZGF0YSBvYmplY3RzIGNvcnJlc3BvbmRpbmcgdG8gdHdvIG9wdGlvbnMgYW5kIHNob3VsZFxuLy8gICBcdCByZXR1cm4gLTEsIDAgb3IgKzEuIElmIG5vdCBwcm92aWRlZCwgdGhlIG9wdGlvbiBsaXN0IHdpbGwgaGF2ZSB0aGUgc2FtZSBzb3J0IG9yZGVyIGFzIHRoZSBvcHRzIGFyZ3VtZW50LlxuLy8gUmV0dXJuczpcbi8vICAgVGhlIG9wdGlvbiBsaXN0IGluIGEgRDMgc2VsZWN0aW9uLlxuZnVuY3Rpb24gaW5pdE9wdExpc3Qoc2VsZWN0b3IsIG9wdHMsIHZhbHVlLCBsYWJlbCwgbXVsdGksIHNlbGVjdGVkLCBzb3J0QnkpIHtcblxuICAgIC8vIHNldCB1cCB0aGUgZnVuY3Rpb25zXG4gICAgbGV0IGlkZW50ID0gZCA9PiBkO1xuICAgIHZhbHVlID0gdmFsdWUgfHwgaWRlbnQ7XG4gICAgbGFiZWwgPSBsYWJlbCB8fCB2YWx1ZTtcbiAgICBzZWxlY3RlZCA9IHNlbGVjdGVkIHx8ICh4ID0+IGZhbHNlKTtcblxuICAgIC8vIHRoZSA8c2VsZWN0PiBlbHRcbiAgICBsZXQgcyA9IGQzLnNlbGVjdChzZWxlY3Rvcik7XG5cbiAgICAvLyBtdWx0aXNlbGVjdFxuICAgIHMucHJvcGVydHkoJ211bHRpcGxlJywgbXVsdGkgfHwgbnVsbCkgO1xuXG4gICAgLy8gYmluZCB0aGUgb3B0cy5cbiAgICBsZXQgb3MgPSBzLnNlbGVjdEFsbChcIm9wdGlvblwiKVxuICAgICAgICAuZGF0YShvcHRzLCBsYWJlbCk7XG4gICAgb3MuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKFwib3B0aW9uXCIpIFxuICAgICAgICAuYXR0cihcInZhbHVlXCIsIHZhbHVlKVxuICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCBvID0+IHNlbGVjdGVkKG8pIHx8IG51bGwpXG4gICAgICAgIC50ZXh0KGxhYmVsKSBcbiAgICAgICAgO1xuICAgIC8vXG4gICAgb3MuZXhpdCgpLnJlbW92ZSgpIDtcblxuICAgIC8vIHNvcnQgdGhlIHJlc3VsdHNcbiAgICBpZiAoIXNvcnRCeSkgc29ydEJ5ID0gKGEsYikgPT4ge1xuICAgIFx0bGV0IGFpID0gb3B0cy5pbmRleE9mKGEpO1xuXHRsZXQgYmkgPSBvcHRzLmluZGV4T2YoYik7XG5cdHJldHVybiBhaSAtIGJpO1xuICAgIH1cbiAgICBvcy5zb3J0KHNvcnRCeSk7XG5cbiAgICAvL1xuICAgIHJldHVybiBzO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByb21pc2lmaWVzIGEgY2FsbCB0byBkMy50c3YuXG4vLyBBcmdzOlxuLy8gICB1cmwgKHN0cmluZykgVGhlIHVybCBvZiB0aGUgdHN2IHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbGlzdCBvZiByb3cgb2JqZWN0c1xuZnVuY3Rpb24gZDN0c3YodXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkMy50c3YodXJsLCBmdW5jdGlvbihlcnJvciwgdmFsKXtcbiAgICAgICAgICAgIGVycm9yID8gcmVqZWN0KHsgc3RhdHVzOiBlcnJvci5zdGF0dXMsIHN0YXR1c1RleHQ6IGVycm9yLnN0YXR1c1RleHR9KSA6IHJlc29sdmUodmFsKTtcbiAgICAgICAgfSkgIFxuICAgIH0pOyBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcm9taXNpZmllcyBhIGNhbGwgdG8gZDMuanNvbi5cbi8vIEFyZ3M6XG4vLyAgIHVybCAoc3RyaW5nKSBUaGUgdXJsIG9mIHRoZSBqc29uIHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUganNvbiBvYmplY3QgdmFsdWUsIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvclxuZnVuY3Rpb24gZDNqc29uKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZDMuanNvbih1cmwsIGZ1bmN0aW9uKGVycm9yLCB2YWwpe1xuICAgICAgICAgICAgZXJyb3IgPyByZWplY3QoeyBzdGF0dXM6IGVycm9yLnN0YXR1cywgc3RhdHVzVGV4dDogZXJyb3Iuc3RhdHVzVGV4dH0pIDogcmVzb2x2ZSh2YWwpO1xuICAgICAgICB9KSAgXG4gICAgfSk7IFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByb21pc2lmaWVzIGEgY2FsbCB0byBkMy50ZXh0LlxuLy8gQXJnczpcbi8vICAgdXJsIChzdHJpbmcpIFRoZSB1cmwgb2YgdGhlIHRleHQgcmVzb3VyY2Vcbi8vIFJldHVybnM6XG4vLyAgIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBqc29uIG9iamVjdCB2YWx1ZSwgb3IgcmVqZWN0cyB3aXRoIGFuIGVycm9yXG5mdW5jdGlvbiBkM3RleHQodXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkMy50ZXh0KHVybCwgJ3RleHQvcGxhaW4nLCBmdW5jdGlvbihlcnJvciwgdmFsKXtcbiAgICAgICAgICAgIGVycm9yID8gcmVqZWN0KHsgc3RhdHVzOiBlcnJvci5zdGF0dXMsIHN0YXR1c1RleHQ6IGVycm9yLnN0YXR1c1RleHR9KSA6IHJlc29sdmUodmFsKTtcbiAgICAgICAgfSkgIFxuICAgIH0pOyBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIGEgZGVlcCBjb3B5IG9mIG9iamVjdCBvLiBcbi8vIEFyZ3M6XG4vLyAgIG8gIChvYmplY3QpIE11c3QgYmUgYSBKU09OIG9iamVjdCAobm8gY3VyY3VsYXIgcmVmcywgbm8gZnVuY3Rpb25zKS5cbi8vIFJldHVybnM6XG4vLyAgIGEgZGVlcCBjb3B5IG9mIG9cbmZ1bmN0aW9uIGRlZXBjKG8pIHtcbiAgICBpZiAoIW8pIHJldHVybiBvO1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvKSk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUGFyc2VzIGEgc3RyaW5nIG9mIHRoZSBmb3JtIFwiY2hyOnN0YXJ0Li5lbmRcIi5cbi8vIFJldHVybnM6XG4vLyAgIG9iamVjdCBjb250aW5pbmcgdGhlIHBhcnNlZCBmaWVsZHMuXG4vLyBFeGFtcGxlOlxuLy8gICBwYXJzZUNvb3JkcyhcIjEwOjEwMDAwMDAwLi4yMDAwMDAwMFwiKSAtPiB7Y2hyOlwiMTBcIiwgc3RhcnQ6MTAwMDAwMDAsIGVuZDoyMDAwMDAwMH1cbmZ1bmN0aW9uIHBhcnNlQ29vcmRzIChjb29yZHMpIHtcbiAgICBsZXQgcmUgPSAvKFteOl0rKTooXFxkKylcXC5cXC4oXFxkKykvO1xuICAgIGxldCBtID0gY29vcmRzLm1hdGNoKHJlKTtcbiAgICByZXR1cm4gbSA/IHtjaHI6bVsxXSwgc3RhcnQ6cGFyc2VJbnQobVsyXSksIGVuZDpwYXJzZUludChtWzNdKX0gOiBudWxsO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEZvcm1hdHMgYSBjaHJvbW9zb21lIG5hbWUsIHN0YXJ0IGFuZCBlbmQgcG9zaXRpb24gYXMgYSBzdHJpbmcuXG4vLyBBcmdzIChmb3JtIDEpOlxuLy8gICBjb29yZHMgKG9iamVjdCkgT2YgdGhlIGZvcm0ge2NocjpzdHJpbmcsIHN0YXJ0OmludCwgZW5kOmludH1cbi8vIEFyZ3MgKGZvcm0gMik6XG4vLyAgIGNociBzdHJpbmdcbi8vICAgc3RhcnQgaW50XG4vLyAgIGVuZCBpbnRcbi8vIFJldHVybnM6XG4vLyAgICAgc3RyaW5nXG4vLyBFeGFtcGxlOlxuLy8gICAgIGZvcm1hdENvb3JkcyhcIjEwXCIsIDEwMDAwMDAwLCAyMDAwMDAwMCkgLT4gXCIxMDoxMDAwMDAwMC4uMjAwMDAwMDBcIlxuZnVuY3Rpb24gZm9ybWF0Q29vcmRzIChjaHIsIHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHRsZXQgYyA9IGNocjtcblx0Y2hyID0gYy5jaHI7XG5cdHN0YXJ0ID0gYy5zdGFydDtcblx0ZW5kID0gYy5lbmQ7XG4gICAgfVxuICAgIHJldHVybiBgJHtjaHJ9OiR7c3RhcnR9Li4ke2VuZH1gXG59XG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdHJ1ZSBpZmYgdGhlIHR3byByYW5nZXMgb3ZlcmxhcCBieSBhdCBsZWFzdCAxLlxuLy8gRWFjaCByYW5nZSBtdXN0IGhhdmUgYSBjaHIsIHN0YXJ0LCBhbmQgZW5kLlxuLy9cbmZ1bmN0aW9uIG92ZXJsYXBzIChhLCBiKSB7XG4gICAgcmV0dXJuIGEuY2hyID09PSBiLmNociAmJiBhLnN0YXJ0IDw9IGIuZW5kICYmIGEuZW5kID49IGIuc3RhcnQ7XG59XG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEdpdmVuIHR3byByYW5nZXMsIGEgYW5kIGIsIHJldHVybnMgYSAtIGIuXG4vLyBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiAwLCAxIG9yIDIgbmV3IHJhbmdlcywgZGVwZW5kaW5nIG9uIGEgYW5kIGIuXG5mdW5jdGlvbiBzdWJ0cmFjdChhLCBiKSB7XG4gICAgaWYgKGEuY2hyICE9PSBiLmNocikgcmV0dXJuIFsgYSBdO1xuICAgIGxldCBhYkxlZnQgPSB7IGNocjphLmNociwgc3RhcnQ6YS5zdGFydCwgICAgICAgICAgICAgICAgICAgIGVuZDpNYXRoLm1pbihhLmVuZCwgYi5zdGFydC0xKSB9O1xuICAgIGxldCBhYlJpZ2h0PSB7IGNocjphLmNociwgc3RhcnQ6TWF0aC5tYXgoYS5zdGFydCwgYi5lbmQrMSksIGVuZDphLmVuZCB9O1xuICAgIGxldCBhbnMgPSBbIGFiTGVmdCwgYWJSaWdodCBdLmZpbHRlciggciA9PiByLnN0YXJ0IDw9IHIuZW5kICk7XG4gICAgcmV0dXJuIGFucztcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBDcmVhdGVzIGEgbGlzdCBvZiBrZXksdmFsdWUgcGFpcnMgZnJvbSB0aGUgb2JqLlxuZnVuY3Rpb24gb2JqMmxpc3QgKG8pIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMobykubWFwKGsgPT4gW2ssIG9ba11dKSAgICBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRydWUgaWZmIHRoZSB0d28gbGlzdHMgaGF2ZSB0aGUgc2FtZSBjb250ZW50cyAoYmFzZWQgb24gaW5kZXhPZikuXG4vLyBCcnV0ZSBmb3JjZSBhcHByb2FjaC4gQmUgY2FyZWZ1bCB3aGVyZSB5b3UgdXNlIHRoaXMuXG5mdW5jdGlvbiBzYW1lIChhbHN0LGJsc3QpIHtcbiAgIHJldHVybiBhbHN0Lmxlbmd0aCA9PT0gYmxzdC5sZW5ndGggJiYgXG4gICAgICAgYWxzdC5yZWR1Y2UoKGFjYyx4KSA9PiAoYWNjICYmIGJsc3QuaW5kZXhPZih4KT49MCksIHRydWUpO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQWRkIGJhc2ljIHNldCBvcHMgdG8gU2V0IHByb3RvdHlwZS5cbi8vIExpZnRlZCBmcm9tOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TZXRcblNldC5wcm90b3R5cGUudW5pb24gPSBmdW5jdGlvbihzZXRCKSB7XG4gICAgdmFyIHVuaW9uID0gbmV3IFNldCh0aGlzKTtcbiAgICBmb3IgKHZhciBlbGVtIG9mIHNldEIpIHtcbiAgICAgICAgdW5pb24uYWRkKGVsZW0pO1xuICAgIH1cbiAgICByZXR1cm4gdW5pb247XG59XG5cblNldC5wcm90b3R5cGUuaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oc2V0Qikge1xuICAgIHZhciBpbnRlcnNlY3Rpb24gPSBuZXcgU2V0KCk7XG4gICAgZm9yICh2YXIgZWxlbSBvZiBzZXRCKSB7XG4gICAgICAgIGlmICh0aGlzLmhhcyhlbGVtKSkge1xuICAgICAgICAgICAgaW50ZXJzZWN0aW9uLmFkZChlbGVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW50ZXJzZWN0aW9uO1xufVxuXG5TZXQucHJvdG90eXBlLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihzZXRCKSB7XG4gICAgdmFyIGRpZmZlcmVuY2UgPSBuZXcgU2V0KHRoaXMpO1xuICAgIGZvciAodmFyIGVsZW0gb2Ygc2V0Qikge1xuICAgICAgICBkaWZmZXJlbmNlLmRlbGV0ZShlbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpZmZlcmVuY2U7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGdldENhcmV0UmFuZ2UgKGVsdCkge1xuICAgIC8vIEZJWE1FOiBkb2VzIG5vdCB3b3JrIGZvciBJRVxuICAgIHJldHVybiBbZWx0LnNlbGVjdGlvblN0YXJ0LCBlbHQuc2VsZWN0aW9uRW5kXTtcbn1cbmZ1bmN0aW9uIHNldENhcmV0UmFuZ2UgKGVsdCwgcmFuZ2UpIHtcbiAgICAvLyBGSVhNRTogZG9lcyBub3Qgd29yayBmb3IgSUVcbiAgICBlbHQuc2VsZWN0aW9uU3RhcnQgPSByYW5nZVswXTtcbiAgICBlbHQuc2VsZWN0aW9uRW5kICAgPSByYW5nZVsxXTtcbn1cbmZ1bmN0aW9uIHNldENhcmV0UG9zaXRpb24gKGVsdCwgcG9zKSB7XG4gICAgc2V0Q2FyZXRSYW5nZShlbHQsIFtwb3MscG9zXSk7XG59XG5mdW5jdGlvbiBtb3ZlQ2FyZXRQb3NpdGlvbiAoZWx0LCBkZWx0YSkge1xuICAgIHNldENhcmV0UG9zaXRpb24oZWx0LCBnZXRDYXJldFBvc2l0aW9uKGVsdCkgKyBkZWx0YSk7XG59XG5mdW5jdGlvbiBnZXRDYXJldFBvc2l0aW9uIChlbHQpIHtcbiAgICBsZXQgciA9IGdldENhcmV0UmFuZ2UoZWx0KTtcbiAgICByZXR1cm4gclsxXTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRoZSBzY3JlZW4gY29vcmRpbmF0ZXMgb2YgYW4gU1ZHIHNoYXBlIChjaXJjbGUsIHJlY3QsIHBvbHlnb24sIGxpbmUpXG4vLyBhZnRlciBhbGwgdHJhbnNmb3JtcyBoYXZlIGJlZW4gYXBwbGllZC5cbi8vXG4vLyBBcmdzOlxuLy8gICAgIHNoYXBlIChub2RlKSBUaGUgU1ZHIHNoYXBlLlxuLy9cbi8vIFJldHVybnM6XG4vLyAgICAgVGhlIGZvcm0gb2YgdGhlIHJldHVybmVkIHZhbHVlIGRlcGVuZHMgb24gdGhlIHNoYXBlLlxuLy8gICAgIGNpcmNsZTogIHsgY3gsIGN5LCByIH1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgY2VudGVyIHBvaW50IGFuZCB0cmFuc2Zvcm1lZCByYWRpdXMgICAgICAgICBcbi8vICAgICBsaW5lOlx0eyB4MSwgeTEsIHgyLCB5MiB9XG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGVuZHBvaW50c1xuLy8gICAgIHJlY3Q6XHR7IHgsIHksIHdpZHRoLCBoZWlnaHQgfVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBjb3JuZXIgcG9pbnQgYW5kIHRyYW5zZm9ybWVkIHdpZHRoK2hlaWdodC5cbi8vICAgICBwb2x5Z29uOiBbIHt4LHl9LCB7eCx5fSAsIC4uLiBdXG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGxpc3Qgb2YgcG9pbnRzXG4vL1xuLy8gQWRhcHRlZCBmcm9tOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82ODU4NDc5L3JlY3RhbmdsZS1jb29yZGluYXRlcy1hZnRlci10cmFuc2Zvcm0/cnE9MVxuLy9cbmZ1bmN0aW9uIGNvb3Jkc0FmdGVyVHJhbnNmb3JtIChzaGFwZSkge1xuICAgIC8vXG4gICAgbGV0IGRzaGFwZSA9IGQzLnNlbGVjdChzaGFwZSk7XG4gICAgbGV0IHN2ZyA9IHNoYXBlLmNsb3Nlc3QoXCJzdmdcIik7XG4gICAgaWYgKCFzdmcpIHRocm93IFwiQ291bGQgbm90IGZpbmQgc3ZnIGFuY2VzdG9yLlwiO1xuICAgIGxldCBzdHlwZSA9IHNoYXBlLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgbWF0cml4ID0gc2hhcGUuZ2V0Q1RNKCk7XG4gICAgbGV0IHAgPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICBsZXQgcDI9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgIC8vXG4gICAgc3dpdGNoIChzdHlwZSkge1xuICAgIC8vXG4gICAgY2FzZSAnY2lyY2xlJzpcblx0cC54ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJjeFwiKSk7XG5cdHAueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiY3lcIikpO1xuXHRwMi54ID0gcC54ICsgcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInJcIikpO1xuXHRwMi55ID0gcC55O1xuXHRwICAgID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0cDIgICA9IHAyLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHQvLyBjYWxjIG5ldyByYWRpdXMgYXMgZGlzdGFuY2UgYmV0d2VlbiB0cmFuc2Zvcm1lZCBwb2ludHNcblx0bGV0IGR4ID0gTWF0aC5hYnMocC54IC0gcDIueCk7XG5cdGxldCBkeSA9IE1hdGguYWJzKHAueSAtIHAyLnkpO1xuXHRsZXQgciA9IE1hdGguc3FydChkeCpkeCArIGR5KmR5KTtcbiAgICAgICAgcmV0dXJuIHsgY3g6IHAueCwgY3k6IHAueSwgcjpyIH07XG4gICAgLy9cbiAgICBjYXNlICdyZWN0Jzpcblx0Ly8gRklYTUU6IGRvZXMgbm90IGhhbmRsZSByb3RhdGlvbnMgY29ycmVjdGx5LiBUbyBmaXgsIHRyYW5zbGF0ZSBjb3JuZXIgcG9pbnRzIHNlcGFyYXRlbHkgYW5kIHRoZW5cblx0Ly8gY2FsY3VsYXRlIHRoZSB0cmFuc2Zvcm1lZCB3aWR0aCBhbmQgaGVpZ2h0LiBBcyBhIGNvbnZlbmllbmNlIHRvIHRoZSB1c2VyLCBtaWdodCBiZSBuaWNlIHRvIHJldHVyblxuXHQvLyB0aGUgdHJhbnNmb3JtZWQgY29ybmVyIHBvaW50cyBhbmQgcG9zc2libHkgdGhlIGZpbmFsIGFuZ2xlIG9mIHJvdGF0aW9uLlxuXHRwLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInhcIikpO1xuXHRwLnkgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInlcIikpO1xuXHRwMi54ID0gcC54ICsgcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcIndpZHRoXCIpKTtcblx0cDIueSA9IHAueSArIHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJoZWlnaHRcIikpO1xuXHQvL1xuXHRwICA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdHAyID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdC8vXG4gICAgICAgIHJldHVybiB7IHg6IHAueCwgeTogcC55LCB3aWR0aDogcDIueC1wLngsIGhlaWdodDogcDIueS1wLnkgfTtcbiAgICAvL1xuICAgIGNhc2UgJ3BvbHlnb24nOlxuICAgICAgICBsZXQgcHRzID0gZHNoYXBlLmF0dHIoXCJwb2ludHNcIikudHJpbSgpLnNwbGl0KC8gKy8pO1xuXHRyZXR1cm4gcHRzLm1hcCggcHQgPT4ge1xuXHQgICAgbGV0IHh5ID0gcHQuc3BsaXQoXCIsXCIpO1xuXHQgICAgcC54ID0gcGFyc2VGbG9hdCh4eVswXSlcblx0ICAgIHAueSA9IHBhcnNlRmxvYXQoeHlbMV0pXG5cdCAgICBwID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0ICAgIHJldHVybiB7IHg6IHAueCwgeTogcC55IH07XG5cdH0pO1xuICAgIC8vXG4gICAgY2FzZSAnbGluZSc6XG5cdHAueCAgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcIngxXCIpKTtcblx0cC55ICAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieTFcIikpO1xuXHRwMi54ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ4MlwiKSk7XG5cdHAyLnkgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInkyXCIpKTtcblx0cCAgICAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRwMiAgICA9IHAyLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuICAgICAgICByZXR1cm4geyB4MTogcC54LCB5MTogcC55LCB4MjogcDIueCwgeDI6IHAyLnkgfTtcbiAgICAvL1xuICAgIC8vIEZJWE1FOiBhZGQgY2FzZSAndGV4dCdcbiAgICAvL1xuXG4gICAgZGVmYXVsdDpcblx0dGhyb3cgXCJVbnN1cHBvcnRlZCBub2RlIHR5cGU6IFwiICsgc3R5cGU7XG4gICAgfVxuXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmVtb3ZlcyBkdXBsaWNhdGVzIGZyb20gYSBsaXN0IHdoaWxlIHByZXNlcnZpbmcgbGlzdCBvcmRlci5cbi8vIEFyZ3M6XG4vLyAgICAgbHN0IChsaXN0KVxuLy8gUmV0dXJuczpcbi8vICAgICBBIHByb2Nlc3NlZCBjb3B5IG9mIGxzdCBpbiB3aGljaCBhbnkgZHVwcyBoYXZlIGJlZW4gcmVtb3ZlZC5cbmZ1bmN0aW9uIHJlbW92ZUR1cHMgKGxzdCkge1xuICAgIGxldCBsc3QyID0gW107XG4gICAgbGV0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgbHN0LmZvckVhY2goeCA9PiB7XG5cdC8vIHJlbW92ZSBkdXBzIHdoaWxlIHByZXNlcnZpbmcgb3JkZXJcblx0aWYgKHNlZW4uaGFzKHgpKSByZXR1cm47XG5cdGxzdDIucHVzaCh4KTtcblx0c2Vlbi5hZGQoeCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGxzdDI7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ2xpcHMgYSB2YWx1ZSB0byBhIHJhbmdlLlxuZnVuY3Rpb24gY2xpcCAobiwgbWluLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIG4pKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRoZSBnaXZlbiBiYXNlcGFpciBhbW91bnQgXCJwcmV0dHkgcHJpbnRlZFwiIHRvIGFuIGFwcG9ycHJpYXRlIHNjYWxlLCBwcmVjaXNpb24sIGFuZCB1bml0cy5cbi8vIEVnLCAgXG4vLyAgICAxMjcgPT4gJzEyNyBicCdcbi8vICAgIDEyMzQ1Njc4OSA9PiAnMTIzLjUgTWInXG5mdW5jdGlvbiBwcmV0dHlQcmludEJhc2VzIChuKSB7XG4gICAgbGV0IGFic24gPSBNYXRoLmFicyhuKTtcbiAgICBpZiAoYWJzbiA8IDEwMDApIHtcbiAgICAgICAgcmV0dXJuIGAke259IGJwYDtcbiAgICB9XG4gICAgaWYgKGFic24gPj0gMTAwMCAmJiBhYnNuIDwgMTAwMDAwMCkge1xuICAgICAgICByZXR1cm4gYCR7KG4vMTAwMCkudG9GaXhlZCgyKX0ga2JgO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGAkeyhuLzEwMDAwMDApLnRvRml4ZWQoMil9IE1iYDtcbiAgICB9XG4gICAgcmV0dXJuIFxufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB7XG4gICAgaW5pdE9wdExpc3QsXG4gICAgZDN0c3YsXG4gICAgZDNqc29uLFxuICAgIGQzdGV4dCxcbiAgICBkZWVwYyxcbiAgICBwYXJzZUNvb3JkcyxcbiAgICBmb3JtYXRDb29yZHMsXG4gICAgb3ZlcmxhcHMsXG4gICAgc3VidHJhY3QsXG4gICAgb2JqMmxpc3QsXG4gICAgc2FtZSxcbiAgICBnZXRDYXJldFJhbmdlLFxuICAgIHNldENhcmV0UmFuZ2UsXG4gICAgc2V0Q2FyZXRQb3NpdGlvbixcbiAgICBtb3ZlQ2FyZXRQb3NpdGlvbixcbiAgICBnZXRDYXJldFBvc2l0aW9uLFxuICAgIGNvb3Jkc0FmdGVyVHJhbnNmb3JtLFxuICAgIHJlbW92ZUR1cHMsXG4gICAgY2xpcCxcbiAgICBwcmV0dHlQcmludEJhc2VzXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvdXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBDb21wb25lbnQge1xuICAgIC8vIGFwcCAtIHRoZSBvd25pbmcgYXBwIG9iamVjdFxuICAgIC8vIGVsdCAtIGNvbnRhaW5lci4gbWF5IGJlIGEgc3RyaW5nIChzZWxlY3RvciksIGEgRE9NIG5vZGUsIG9yIGEgZDMgc2VsZWN0aW9uIG9mIDEgbm9kZS5cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcblx0dGhpcy5hcHAgPSBhcHBcblx0aWYgKHR5cGVvZihlbHQpID09PSBcInN0cmluZ1wiKVxuXHQgICAgLy8gZWx0IGlzIGEgQ1NTIHNlbGVjdG9yXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5zZWxlY3RBbGwpID09PSBcImZ1bmN0aW9uXCIpXG5cdCAgICAvLyBlbHQgaXMgYSBkMyBzZWxlY3Rpb25cblx0ICAgIHRoaXMucm9vdCA9IGVsdDtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSkgPT09IFwiZnVuY3Rpb25cIilcblx0ICAgIC8vIGVsdCBpcyBhIERPTSBub2RlXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRlIG1lXG4gICAgfVxufVxuXG5leHBvcnQgeyBDb21wb25lbnQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0NvbXBvbmVudC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTdG9yZSwgc2V0LCBnZXQsIGRlbCwgY2xlYXIsIGtleXMgfSBmcm9tICdpZGIta2V5dmFsJztcblxuY29uc3QgREJfTkFNRV9QUkVGSVggPSAnbWd2LWRhdGFjYWNoZS0nO1xuXG5jbGFzcyBLZXlTdG9yZSB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUpIHtcblx0dHJ5IHtcblx0ICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoREJfTkFNRV9QUkVGSVgrbmFtZSwgbmFtZSk7XG5cdCAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICBjb25zb2xlLmxvZyhgS2V5U3RvcmU6ICR7REJfTkFNRV9QUkVGSVgrbmFtZX1gKTtcblx0fVxuXHRjYXRjaCAoZXJyKSB7XG5cdCAgICB0aGlzLnN0b3JlID0gbnVsbDtcblx0ICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5udWxsUCA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblx0ICAgIGNvbnNvbGUubG9nKGBLZXlTdG9yZTogZXJyb3IgaW4gY29uc3RydWN0b3I6ICR7ZXJyfSBcXG4gRGlzYWJsZWQuYClcblx0fVxuICAgIH1cbiAgICBnZXQgKGtleSkge1xuXHRpZiAodGhpcy5kaXNhYmxlZCkgXG5cdCAgICByZXR1cm4gdGhpcy5udWxsUDtcbiAgICAgICAgcmV0dXJuIGdldChrZXksIHRoaXMuc3RvcmUpO1xuICAgIH1cbiAgICBkZWwgKGtleSkge1xuXHRpZiAodGhpcy5kaXNhYmxlZCkgXG5cdCAgICByZXR1cm4gdGhpcy5udWxsUDtcbiAgICAgICAgcmV0dXJuIGRlbChrZXksIHRoaXMuc3RvcmUpO1xuICAgIH1cbiAgICBzZXQgKGtleSwgdmFsdWUpIHtcblx0aWYgKHRoaXMuZGlzYWJsZWQpIFxuXHQgICAgcmV0dXJuIHRoaXMubnVsbFA7XG4gICAgICAgIHJldHVybiBzZXQoa2V5LCB2YWx1ZSwgdGhpcy5zdG9yZSk7XG4gICAgfVxuICAgIHB1dCAoa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfVxuICAgIGtleXMgKCkge1xuXHRpZiAodGhpcy5kaXNhYmxlZCkgXG5cdCAgICByZXR1cm4gdGhpcy5udWxsUDtcbiAgICAgICAgcmV0dXJuIGtleXModGhpcy5zdG9yZSk7XG4gICAgfVxuICAgIGNvbnRhaW5zIChrZXkpIHtcblx0aWYgKHRoaXMuZGlzYWJsZWQpIFxuXHQgICAgcmV0dXJuIHRoaXMubnVsbFA7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChrZXkpLnRoZW4oeCA9PiB4ICE9PSB1bmRlZmluZWQpO1xuICAgIH1cbiAgICBjbGVhciAoKSB7XG5cdGlmICh0aGlzLmRpc2FibGVkKSBcblx0ICAgIHJldHVybiB0aGlzLm51bGxQO1xuICAgICAgICByZXR1cm4gY2xlYXIodGhpcy5zdG9yZSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgS2V5U3RvcmUgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0tleVN0b3JlLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIEZlYXR1cmUge1xuICAgIGNvbnN0cnVjdG9yIChjZmcpIHtcbiAgICAgICAgdGhpcy5jaHIgICAgID0gY2ZnLmNociB8fCBjZmcuY2hyb21vc29tZTtcbiAgICAgICAgdGhpcy5zdGFydCAgID0gcGFyc2VJbnQoY2ZnLnN0YXJ0KTtcbiAgICAgICAgdGhpcy5lbmQgICAgID0gcGFyc2VJbnQoY2ZnLmVuZCk7XG4gICAgICAgIHRoaXMuc3RyYW5kICA9IGNmZy5zdHJhbmQ7XG4gICAgICAgIHRoaXMudHlwZSAgICA9IGNmZy50eXBlO1xuICAgICAgICB0aGlzLmJpb3R5cGUgPSBjZmcuYmlvdHlwZTtcbiAgICAgICAgdGhpcy5tZ3BpZCAgID0gY2ZnLm1ncGlkIHx8IGNmZy5pZDtcbiAgICAgICAgdGhpcy5tZ2lpZCAgID0gY2ZnLm1naWlkO1xuICAgICAgICB0aGlzLnN5bWJvbCAgPSBjZmcuc3ltYm9sO1xuICAgICAgICB0aGlzLmdlbm9tZSAgPSBjZmcuZ2Vub21lO1xuXHR0aGlzLmNvbnRpZyAgPSBwYXJzZUludChjZmcuY29udGlnKTtcblx0dGhpcy5sYW5lICAgID0gcGFyc2VJbnQoY2ZnLmxhbmUpO1xuICAgICAgICBpZiAodGhpcy5tZ2lpZCA9PT0gXCIuXCIpIHRoaXMubWdpaWQgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5zeW1ib2wgPT09IFwiLlwiKSB0aGlzLnN5bWJvbCA9IG51bGw7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBJRCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1ncGlkO1xuICAgIH1cbiAgICBnZXQgY2Fub25pY2FsICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdpaWQ7XG4gICAgfVxuICAgIGdldCBpZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1naWlkIHx8IHRoaXMubWdwaWQ7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBsYWJlbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bWJvbCB8fCB0aGlzLm1ncGlkO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgbGVuZ3RoICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5kIC0gdGhpcy5zdGFydCArIDE7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldE11bmdlZFR5cGUgKCkge1xuXHRyZXR1cm4gdGhpcy50eXBlID09PSBcImdlbmVcIiA/XG5cdCAgICAodGhpcy5iaW90eXBlID09PSBcInByb3RlaW5fY29kaW5nXCIgfHwgdGhpcy5iaW90eXBlID09PSBcInByb3RlaW4gY29kaW5nIGdlbmVcIikgP1xuXHRcdFwicHJvdGVpbl9jb2RpbmdfZ2VuZVwiXG5cdFx0OlxuXHRcdHRoaXMuYmlvdHlwZS5pbmRleE9mKFwicHNldWRvZ2VuZVwiKSA+PSAwID9cblx0XHQgICAgXCJwc2V1ZG9nZW5lXCJcblx0XHQgICAgOlxuXHRcdCAgICAodGhpcy5iaW90eXBlLmluZGV4T2YoXCJSTkFcIikgPj0gMCB8fCB0aGlzLmJpb3R5cGUuaW5kZXhPZihcImFudGlzZW5zZVwiKSA+PSAwKSA/XG5cdFx0XHRcIm5jUk5BX2dlbmVcIlxuXHRcdFx0OlxuXHRcdFx0dGhpcy5iaW90eXBlLmluZGV4T2YoXCJzZWdtZW50XCIpID49IDAgP1xuXHRcdFx0ICAgIFwiZ2VuZV9zZWdtZW50XCJcblx0XHRcdCAgICA6XG5cdFx0XHQgICAgXCJvdGhlcl9nZW5lXCJcblx0ICAgIDpcblx0ICAgIHRoaXMudHlwZSA9PT0gXCJwc2V1ZG9nZW5lXCIgP1xuXHRcdFwicHNldWRvZ2VuZVwiXG5cdFx0OlxuXHRcdHRoaXMudHlwZS5pbmRleE9mKFwiZ2VuZV9zZWdtZW50XCIpID49IDAgP1xuXHRcdCAgICBcImdlbmVfc2VnbWVudFwiXG5cdFx0ICAgIDpcblx0XHQgICAgdGhpcy50eXBlLmluZGV4T2YoXCJSTkFcIikgPj0gMCA/XG5cdFx0XHRcIm5jUk5BX2dlbmVcIlxuXHRcdFx0OlxuXHRcdFx0dGhpcy50eXBlLmluZGV4T2YoXCJnZW5lXCIpID49IDAgP1xuXHRcdFx0ICAgIFwib3RoZXJfZ2VuZVwiXG5cdFx0XHQgICAgOlxuXHRcdFx0ICAgIFwib3RoZXJfZmVhdHVyZV90eXBlXCI7XG4gICAgfVxufVxuXG5leHBvcnQgeyBGZWF0dXJlIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUGFyc2VzIGEgbGlzdCBvcGVyYXRvciBleHByZXNzaW9uLCBlZyBcIihhICsgYikqYyAtIGRcIlxuLy8gUmV0dXJucyBhbiBhYnN0cmFjdCBzeW50YXggdHJlZS5cbi8vICAgICBMZWFmIG5vZGVzID0gbGlzdCBuYW1lcy4gVGhleSBhcmUgc2ltcGxlIHN0cmluZ3MuXG4vLyAgICAgSW50ZXJpb3Igbm9kZXMgPSBvcGVyYXRpb25zLiBUaGV5IGxvb2sgbGlrZToge2xlZnQ6bm9kZSwgb3A6c3RyaW5nLCByaWdodDpub2RlfVxuLy8gXG5jbGFzcyBMaXN0Rm9ybXVsYVBhcnNlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuXHR0aGlzLnJfb3AgICAgPSAvWystXS87XG5cdHRoaXMucl9vcDIgICA9IC9bKl0vO1xuXHR0aGlzLnJfb3BzICAgPSAvWygpKyotXS87XG5cdHRoaXMucl9pZGVudCA9IC9bYS16QS1aX11bYS16QS1aMC05X10qLztcblx0dGhpcy5yX3FzdHIgID0gL1wiW15cIl0qXCIvO1xuXHR0aGlzLnJlID0gbmV3IFJlZ0V4cChgKCR7dGhpcy5yX29wcy5zb3VyY2V9fCR7dGhpcy5yX3FzdHIuc291cmNlfXwke3RoaXMucl9pZGVudC5zb3VyY2V9KWAsICdnJyk7XG5cdC8vdGhpcy5yZSA9IC8oWygpKyotXXxcIlteXCJdK1wifFthLXpBLVpfXVthLXpBLVowLTlfXSopL2dcblx0dGhpcy5faW5pdChcIlwiKTtcbiAgICB9XG4gICAgX2luaXQgKHMpIHtcbiAgICAgICAgdGhpcy5leHByID0gcztcblx0dGhpcy50b2tlbnMgPSB0aGlzLmV4cHIubWF0Y2godGhpcy5yZSkgfHwgW107XG5cdHRoaXMuaSA9IDA7XG4gICAgfVxuICAgIF9wZWVrVG9rZW4oKSB7XG5cdHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmldO1xuICAgIH1cbiAgICBfbmV4dFRva2VuICgpIHtcblx0bGV0IHQ7XG4gICAgICAgIGlmICh0aGlzLmkgPCB0aGlzLnRva2Vucy5sZW5ndGgpIHtcblx0ICAgIHQgPSB0aGlzLnRva2Vuc1t0aGlzLmldO1xuXHQgICAgdGhpcy5pICs9IDE7XG5cdH1cblx0cmV0dXJuIHQ7XG4gICAgfVxuICAgIF9leHByICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl90ZXJtKCk7XG5cdGxldCBvcCA9IHRoaXMuX3BlZWtUb2tlbigpO1xuXHRpZiAob3AgPT09IFwiK1wiIHx8IG9wID09PSBcIi1cIikge1xuXHQgICAgdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBub2RlID0geyBsZWZ0Om5vZGUsIG9wOm9wPT09XCIrXCI/XCJ1bmlvblwiOlwiZGlmZmVyZW5jZVwiLCByaWdodDogdGhpcy5fZXhwcigpIH1cblx0ICAgIHJldHVybiBub2RlO1xuICAgICAgICB9ICAgICAgICAgICAgICAgXG5cdGVsc2UgaWYgKG9wID09PSBcIilcIiB8fCBvcCA9PT0gdW5kZWZpbmVkIHx8IG9wID09PSBudWxsKVxuXHQgICAgcmV0dXJuIG5vZGU7XG5cdGVsc2Vcblx0ICAgIHRoaXMuX2Vycm9yKFwiVU5JT04gb3IgSU5URVJTRUNUSU9OIG9yICkgb3IgTlVMTFwiLCBvcCk7XG4gICAgfVxuICAgIF90ZXJtICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl9mYWN0b3IoKTtcblx0bGV0IG9wID0gdGhpcy5fcGVla1Rva2VuKCk7XG5cdGlmIChvcCA9PT0gXCIqXCIpIHtcblx0ICAgIHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgbm9kZSA9IHsgbGVmdDpub2RlLCBvcDpcImludGVyc2VjdGlvblwiLCByaWdodDogdGhpcy5fZmFjdG9yKCkgfVxuXHR9XG5cdHJldHVybiBub2RlO1xuICAgIH1cbiAgICBfZmFjdG9yICgpIHtcbiAgICAgICAgbGV0IHQgPSB0aGlzLl9uZXh0VG9rZW4oKTtcblx0aWYgKHQgPT09IFwiKFwiKXtcblx0ICAgIGxldCBub2RlID0gdGhpcy5fZXhwcigpO1xuXHQgICAgbGV0IG50ID0gdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBpZiAobnQgIT09IFwiKVwiKSB0aGlzLl9lcnJvcihcIicpJ1wiLCBudCk7XG5cdCAgICByZXR1cm4gbm9kZTtcblx0fVxuXHRlbHNlIGlmICh0ICYmICh0LnN0YXJ0c1dpdGgoJ1wiJykpKSB7XG5cdCAgICByZXR1cm4gdC5zdWJzdHJpbmcoMSwgdC5sZW5ndGgtMSk7XG5cdH1cblx0ZWxzZSBpZiAodCAmJiB0Lm1hdGNoKC9bYS16QS1aX10vKSkge1xuXHQgICAgcmV0dXJuIHQ7XG5cdH1cblx0ZWxzZVxuXHQgICAgdGhpcy5fZXJyb3IoXCJFWFBSIG9yIElERU5UXCIsIHR8fFwiTlVMTFwiKTtcblx0cmV0dXJuIHQ7XG5cdCAgICBcbiAgICB9XG4gICAgX2Vycm9yIChleHBlY3RlZCwgc2F3KSB7XG4gICAgICAgIHRocm93IGBQYXJzZSBlcnJvcjogZXhwZWN0ZWQgJHtleHBlY3RlZH0gYnV0IHNhdyAke3Nhd30uYDtcbiAgICB9XG4gICAgLy8gUGFyc2VzIHRoZSBzdHJpbmcgYW5kIHJldHVybnMgdGhlIGFic3RyYWN0IHN5bnRheCB0cmVlLlxuICAgIC8vIFRocm93cyBhbiBleGNlcHRpb24gaWYgdGhlcmUgaXMgYSBzeW50YXggZXJyb3IuXG4gICAgcGFyc2UgKHMpIHtcblx0dGhpcy5faW5pdChzKTtcblx0cmV0dXJuIHRoaXMuX2V4cHIoKTtcbiAgICB9XG4gICAgLy8gcmV0dXJucyB0cnVlIGlmZiBzdHJpbmcgaXMgc3ludGFjdGljYWxseSB2YWxpZFxuICAgIGlzVmFsaWQgKHMpIHtcbiAgICAgICAgdHJ5IHtcblx0ICAgIHRoaXMucGFyc2Uocyk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fVxuXHRjYXRjaCAoZSkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEZvcm11bGFQYXJzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIFNWR1ZpZXcgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCwgbWFyZ2lucywgcm90YXRpb24sIHRyYW5zbGF0aW9uKSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0KTtcbiAgICAgICAgdGhpcy5zdmcgPSB0aGlzLnJvb3Quc2VsZWN0KFwic3ZnXCIpO1xuICAgICAgICB0aGlzLnN2Z01haW4gPSB0aGlzLnN2Z1xuICAgICAgICAgICAgLmFwcGVuZChcImdcIikgICAgLy8gdGhlIG1hcmdpbi10cmFuc2xhdGVkIGdyb3VwXG4gICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVx0ICAvLyBtYWluIGdyb3VwIGZvciB0aGUgZHJhd2luZ1xuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJzdmdtYWluXCIpO1xuXHR0aGlzLm91dGVyV2lkdGggPSAxMDA7XG5cdHRoaXMud2lkdGggPSAxMDA7XG5cdHRoaXMub3V0ZXJIZWlnaHQgPSAxMDA7XG5cdHRoaXMuaGVpZ2h0ID0gMTAwO1xuXHR0aGlzLm1hcmdpbnMgPSB7dG9wOiAxOCwgcmlnaHQ6IDEyLCBib3R0b206IDEyLCBsZWZ0OiAxMn07XG5cdHRoaXMucm90YXRpb24gPSAwO1xuXHR0aGlzLnRyYW5zbGF0aW9uID0gWzAsMF07XG5cdC8vXG4gICAgICAgIHRoaXMuc2V0R2VvbSh7d2lkdGgsIGhlaWdodCwgbWFyZ2lucywgcm90YXRpb24sIHRyYW5zbGF0aW9ufSk7XG4gICAgfVxuICAgIHNldEdlb20gKGNmZykge1xuICAgICAgICB0aGlzLm91dGVyV2lkdGggID0gY2ZnLndpZHRoICAgICAgIHx8IHRoaXMub3V0ZXJXaWR0aDtcbiAgICAgICAgdGhpcy5vdXRlckhlaWdodCA9IGNmZy5oZWlnaHQgICAgICB8fCB0aGlzLm91dGVySGVpZ2h0O1xuICAgICAgICB0aGlzLm1hcmdpbnMgICAgID0gY2ZnLm1hcmdpbnMgICAgIHx8IHRoaXMubWFyZ2lucztcblx0dGhpcy5yb3RhdGlvbiAgICA9IHR5cGVvZihjZmcucm90YXRpb24pID09PSBcIm51bWJlclwiID8gY2ZnLnJvdGF0aW9uIDogdGhpcy5yb3RhdGlvbjtcblx0dGhpcy50cmFuc2xhdGlvbiA9IGNmZy50cmFuc2xhdGlvbiB8fCB0aGlzLnRyYW5zbGF0aW9uO1xuICAgICAgICAvL1xuICAgICAgICB0aGlzLndpZHRoICA9IHRoaXMub3V0ZXJXaWR0aCAgLSB0aGlzLm1hcmdpbnMubGVmdCAtIHRoaXMubWFyZ2lucy5yaWdodDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLm91dGVySGVpZ2h0IC0gdGhpcy5tYXJnaW5zLnRvcCAgLSB0aGlzLm1hcmdpbnMuYm90dG9tO1xuICAgICAgICAvL1xuICAgICAgICB0aGlzLnN2Zy5hdHRyKFwid2lkdGhcIiwgdGhpcy5vdXRlcldpZHRoKVxuICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLm91dGVySGVpZ2h0KVxuICAgICAgICAgICAgLnNlbGVjdCgnZ1tuYW1lPVwic3ZnbWFpblwiXScpXG4gICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHt0aGlzLm1hcmdpbnMubGVmdH0sJHt0aGlzLm1hcmdpbnMudG9wfSkgcm90YXRlKCR7dGhpcy5yb3RhdGlvbn0pIHRyYW5zbGF0ZSgke3RoaXMudHJhbnNsYXRpb25bMF19LCR7dGhpcy50cmFuc2xhdGlvblsxXX0pYCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzZXRNYXJnaW5zKCB0bSwgcm0sIGJtLCBsbSApIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0ICAgIHJtID0gYm0gPSBsbSA9IHRtO1xuXHR9XG5cdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcblx0ICAgIGJtID0gdG07XG5cdCAgICBsbSA9IHJtO1xuXHR9XG5cdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDQpXG5cdCAgICB0aHJvdyBcIkJhZCBhcmd1bWVudHMuXCI7XG4gICAgICAgIC8vXG5cdHRoaXMuc2V0R2VvbSh7dG9wOiB0bSwgcmlnaHQ6IHJtLCBib3R0b206IGJtLCBsZWZ0OiBsbX0pO1xuXHQvL1xuXHRyZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcm90YXRlIChkZWcpIHtcbiAgICAgICAgdGhpcy5zZXRHZW9tKHtyb3RhdGlvbjpkZWd9KTtcblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRyYW5zbGF0ZSAoZHgsIGR5KSB7XG4gICAgICAgIHRoaXMuc2V0R2VvbSh7dHJhbnNsYXRpb246W2R4LGR5XX0pO1xuXHRyZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy8gQXJnczpcbiAgICAvLyAgIHRoZSB3aW5kb3cgd2lkdGhcbiAgICBmaXRUb1dpZHRoICh3aWR0aCkge1xuICAgICAgICBsZXQgciA9IHRoaXMuc3ZnWzBdWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLnNldEdlb20oe3dpZHRoOiB3aWR0aCAtIHIueH0pXG5cdHJldHVybiB0aGlzO1xuICAgIH1cblxufSAvLyBlbmQgY2xhc3MgU1ZHVmlld1xuXG5leHBvcnQgeyBTVkdWaWV3IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9TVkdWaWV3LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IE1HVkFwcCB9IGZyb20gJy4vTUdWQXBwJztcbmltcG9ydCB7IHJlbW92ZUR1cHMgfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vXG4vLyBwcXN0cmluZyA9IFBhcnNlIHFzdHJpbmcuIFBhcnNlcyB0aGUgcGFyYW1ldGVyIHBvcnRpb24gb2YgdGhlIFVSTC5cbi8vXG5mdW5jdGlvbiBwcXN0cmluZyAocXN0cmluZykge1xuICAgIC8vXG4gICAgbGV0IGNmZyA9IHt9O1xuXG4gICAgLy8gRklYTUU6IFVSTFNlYXJjaFBhcmFtcyBBUEkgaXMgbm90IHN1cHBvcnRlZCBpbiBhbGwgYnJvd3NlcnMuXG4gICAgLy8gT0sgZm9yIGRldmVsb3BtZW50IGJ1dCBuZWVkIGEgZmFsbGJhY2sgZXZlbnR1YWxseS5cbiAgICBsZXQgcHJtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocXN0cmluZyk7XG4gICAgbGV0IGdlbm9tZXMgPSBbXTtcblxuICAgIC8vIC0tLS0tIGdlbm9tZXMgLS0tLS0tLS0tLS0tXG4gICAgbGV0IHBnZW5vbWVzID0gcHJtcy5nZXQoXCJnZW5vbWVzXCIpIHx8IFwiXCI7XG4gICAgLy8gRm9yIG5vdywgYWxsb3cgXCJjb21wc1wiIGFzIHN5bm9ueW0gZm9yIFwiZ2Vub21lc1wiLiBFdmVudHVhbGx5LCBkb24ndCBzdXBwb3J0IFwiY29tcHNcIi5cbiAgICBwZ2Vub21lcyA9IChwZ2Vub21lcyArICBcIiBcIiArIChwcm1zLmdldChcImNvbXBzXCIpIHx8IFwiXCIpKTtcbiAgICAvL1xuICAgIHBnZW5vbWVzID0gcmVtb3ZlRHVwcyhwZ2Vub21lcy50cmltKCkuc3BsaXQoLyArLykpO1xuICAgIHBnZW5vbWVzLmxlbmd0aCA+IDAgJiYgKGNmZy5nZW5vbWVzID0gcGdlbm9tZXMpO1xuXG4gICAgLy8gLS0tLS0gcmVmIGdlbm9tZSAtLS0tLS0tLS0tLS1cbiAgICBsZXQgcmVmID0gcHJtcy5nZXQoXCJyZWZcIik7XG4gICAgcmVmICYmIChjZmcucmVmID0gcmVmKTtcblxuICAgIC8vIC0tLS0tIGhpZ2hsaWdodCBJRHMgLS0tLS0tLS0tLS0tLS1cbiAgICBsZXQgaGxzID0gbmV3IFNldCgpO1xuICAgIGxldCBobHMwID0gcHJtcy5nZXQoXCJoaWdobGlnaHRcIik7XG4gICAgaWYgKGhsczApIHtcblx0aGxzMCA9IGhsczAucmVwbGFjZSgvWyAsXSsvZywgJyAnKS5zcGxpdCgnICcpLmZpbHRlcih4PT54KTtcblx0aGxzMC5sZW5ndGggPiAwICYmIChjZmcuaGlnaGxpZ2h0ID0gaGxzMCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0gY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIGxldCBjaHIgICA9IHBybXMuZ2V0KFwiY2hyXCIpO1xuICAgIGxldCBzdGFydCA9IHBybXMuZ2V0KFwic3RhcnRcIik7XG4gICAgbGV0IGVuZCAgID0gcHJtcy5nZXQoXCJlbmRcIik7XG4gICAgY2hyICAgJiYgKGNmZy5jaHIgPSBjaHIpO1xuICAgIHN0YXJ0ICYmIChjZmcuc3RhcnQgPSBwYXJzZUludChzdGFydCkpO1xuICAgIGVuZCAgICYmIChjZmcuZW5kID0gcGFyc2VJbnQoZW5kKSk7XG4gICAgLy9cbiAgICBsZXQgbGFuZG1hcmsgPSBwcm1zLmdldChcImxhbmRtYXJrXCIpO1xuICAgIGxldCBmbGFuayAgICA9IHBybXMuZ2V0KFwiZmxhbmtcIik7XG4gICAgbGV0IGxlbmd0aCAgID0gcHJtcy5nZXQoXCJsZW5ndGhcIik7XG4gICAgbGV0IGRlbHRhICAgID0gcHJtcy5nZXQoXCJkZWx0YVwiKTtcbiAgICBsYW5kbWFyayAmJiAoY2ZnLmxhbmRtYXJrID0gbGFuZG1hcmspO1xuICAgIGZsYW5rICAgICYmIChjZmcuZmxhbmsgPSBwYXJzZUludChmbGFuaykpO1xuICAgIGxlbmd0aCAgICYmIChjZmcubGVuZ3RoID0gcGFyc2VJbnQobGVuZ3RoKSk7XG4gICAgZGVsdGEgICAgJiYgKGNmZy5kZWx0YSA9IHBhcnNlSW50KGRlbHRhKSk7XG4gICAgLy9cbiAgICAvLyAtLS0tLSBkcmF3aW5nIG1vZGUgLS0tLS0tLS0tLS0tLVxuICAgIGxldCBkbW9kZSA9IHBybXMuZ2V0KFwiZG1vZGVcIik7XG4gICAgZG1vZGUgJiYgKGNmZy5kbW9kZSA9IGRtb2RlKTtcbiAgICAvL1xuICAgIHJldHVybiBjZmc7XG59XG5cblxuLy8gVGhlIG1haW4gcHJvZ3JhbSwgd2hlcmVpbiB0aGUgYXBwIGlzIGNyZWF0ZWQgYW5kIHdpcmVkIHRvIHRoZSBicm93c2VyLiBcbi8vXG5mdW5jdGlvbiBfX21haW5fXyAoc2VsZWN0b3IpIHtcbiAgICAvLyBCZWhvbGQsIHRoZSBNR1YgYXBwbGljYXRpb24gb2JqZWN0Li4uXG4gICAgbGV0IG1ndiA9IG51bGw7XG5cbiAgICAvLyBDYWxsYmFjayB0byBwYXNzIGludG8gdGhlIGFwcCB0byByZWdpc3RlciBjaGFuZ2VzIGluIGNvbnRleHQuXG4gICAgLy8gVXNlcyB0aGUgY3VycmVudCBhcHAgY29udGV4dCB0byBzZXQgdGhlIGhhc2ggcGFydCBvZiB0aGVcbiAgICAvLyBicm93c2VyJ3MgbG9jYXRpb24uIFRoaXMgYWxzbyByZWdpc3RlcnMgdGhlIGNoYW5nZSBpbiBcbiAgICAvLyB0aGUgYnJvd3NlciBoaXN0b3J5LlxuICAgIGZ1bmN0aW9uIHNldEhhc2ggKCkge1xuXHRsZXQgbmV3SGFzaCA9IG1ndi5nZXRQYXJhbVN0cmluZygpO1xuXHRpZiAoJyMnK25ld0hhc2ggPT09IHdpbmRvdy5sb2NhdGlvbi5oYXNoKVxuXHQgICAgcmV0dXJuO1xuXHQvLyB0ZW1wb3JhcmlseSBkaXNhYmxlIHBvcHN0YXRlIGhhbmRsZXJcblx0bGV0IGYgPSB3aW5kb3cub25wb3BzdGF0ZTtcblx0d2luZG93Lm9ucG9wc3RhdGUgPSBudWxsO1xuXHQvLyBub3cgc2V0IHRoZSBoYXNoXG5cdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gbmV3SGFzaDtcblx0Ly8gcmUtZW5hYmxlXG5cdHdpbmRvdy5vbnBvcHN0YXRlID0gZjtcbiAgICB9XG4gICAgLy8gSGFuZGxlciBjYWxsZWQgd2hlbiB1c2VyIGNsaWNrcyB0aGUgYnJvd3NlcidzIGJhY2sgb3IgZm9yd2FyZCBidXR0b25zLlxuICAgIC8vIFNldHMgdGhlIGFwcCdzIGNvbnRleHQgYmFzZWQgb24gdGhlIGhhc2ggcGFydCBvZiB0aGUgYnJvd3NlcidzXG4gICAgLy8gbG9jYXRpb24uXG4gICAgd2luZG93Lm9ucG9wc3RhdGUgPSBmdW5jdGlvbihldmVudCkge1xuXHRsZXQgY2ZnID0gcHFzdHJpbmcoZG9jdW1lbnQubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuXHRtZ3Yuc2V0Q29udGV4dChjZmcsIHRydWUpO1xuICAgIH07XG4gICAgLy8gZ2V0IGluaXRpYWwgc2V0IG9mIGNvbnRleHQgcGFyYW1zIFxuICAgIGxldCBxc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpO1xuICAgIGxldCBjZmcgPSBwcXN0cmluZyhxc3RyaW5nKTtcbiAgICBjZmcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjZmcub25jb250ZXh0Y2hhbmdlID0gc2V0SGFzaDtcblxuICAgIC8vIGNyZWF0ZSB0aGUgYXBwXG4gICAgd2luZG93Lm1ndiA9IG1ndiA9IG5ldyBNR1ZBcHAoc2VsZWN0b3IsIGNmZyk7XG4gICAgXG4gICAgLy8gaGFuZGxlIHJlc2l6ZSBldmVudHNcbiAgICB3aW5kb3cub25yZXNpemUgPSAoKSA9PiB7bWd2LnJlc2l6ZSgpO21ndi5zZXRDb250ZXh0KHt9KTt9XG59XG5cblxuX19tYWluX18oXCIjbWd2XCIpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvdmlld2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHBhcnNlQ29vcmRzLCBmb3JtYXRDb29yZHMsIGQzdHN2LCBkM2pzb24sIGluaXRPcHRMaXN0LCBzYW1lLCBjbGlwIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBHZW5vbWUgfSAgICAgICAgICBmcm9tICcuL0dlbm9tZSc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSAgICAgICBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBGZWF0dXJlTWFuYWdlciB9ICBmcm9tICcuL0ZlYXR1cmVNYW5hZ2VyJztcbmltcG9ydCB7IFF1ZXJ5TWFuYWdlciB9ICAgIGZyb20gJy4vUXVlcnlNYW5hZ2VyJztcbmltcG9ydCB7IExpc3RNYW5hZ2VyIH0gICAgIGZyb20gJy4vTGlzdE1hbmFnZXInO1xuaW1wb3J0IHsgTGlzdEVkaXRvciB9ICAgICAgZnJvbSAnLi9MaXN0RWRpdG9yJztcbmltcG9ydCB7IEZhY2V0TWFuYWdlciB9ICAgIGZyb20gJy4vRmFjZXRNYW5hZ2VyJztcbmltcG9ydCB7IEJUTWFuYWdlciB9ICAgICAgIGZyb20gJy4vQlRNYW5hZ2VyJztcbmltcG9ydCB7IEdlbm9tZVZpZXcgfSAgICAgIGZyb20gJy4vR2Vub21lVmlldyc7XG5pbXBvcnQgeyBGZWF0dXJlRGV0YWlscyB9ICBmcm9tICcuL0ZlYXR1cmVEZXRhaWxzJztcbmltcG9ydCB7IFpvb21WaWV3IH0gICAgICAgIGZyb20gJy4vWm9vbVZpZXcnO1xuaW1wb3J0IHsgS2V5U3RvcmUgfSAgICAgICAgZnJvbSAnLi9LZXlTdG9yZSc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgTUdWQXBwIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoc2VsZWN0b3IsIGNmZykge1xuXHRzdXBlcihudWxsLCBzZWxlY3Rvcik7XG5cdHRoaXMuYXBwID0gdGhpcztcblx0Ly9cblx0dGhpcy5pbml0aWFsQ2ZnID0gY2ZnO1xuXHQvL1xuXHR0aGlzLmNvbnRleHRDaGFuZ2VkID0gKGNmZy5vbmNvbnRleHRjaGFuZ2UgfHwgZnVuY3Rpb24oKXt9KTtcblx0Ly9cblx0dGhpcy5uYW1lMmdlbm9tZSA9IHt9OyAgLy8gbWFwIGZyb20gZ2Vub21lIG5hbWUgLT4gZ2Vub21lIGRhdGEgb2JqXG5cdHRoaXMubGFiZWwyZ2Vub21lID0ge307IC8vIG1hcCBmcm9tIGdlbm9tZSBsYWJlbCAtPiBnZW5vbWUgZGF0YSBvYmpcblx0dGhpcy5ubDJnZW5vbWUgPSB7fTsgICAgLy8gY29tYmluZXMgaW5kZXhlc1xuXHQvL1xuXHR0aGlzLmFsbEdlbm9tZXMgPSBbXTsgICAvLyBsaXN0IG9mIGFsbCBhdmFpbGFibGUgZ2Vub21lc1xuXHR0aGlzLnJHZW5vbWUgPSBudWxsOyAgICAvLyB0aGUgY3VycmVudCByZWZlcmVuY2UgZ2Vub21lXG5cdHRoaXMuY0dlbm9tZXMgPSBbXTsgICAgIC8vIGN1cnJlbnQgY29tcGFyaXNvbiBnZW5vbWVzIChyR2Vub21lIGlzICpub3QqIGluY2x1ZGVkKS5cblx0dGhpcy52R2Vub21lcyA9IFtdO1x0Ly8gbGlzdCBvZiBhbGwgY3VycmVudHkgdmlld2VkIGdlbm9tZXMgKHJlZitjb21wcykgaW4gWS1vcmRlci5cblx0Ly9cblx0dGhpcy5kdXIgPSAyNTA7ICAgICAgICAgLy8gYW5pbWF0aW9uIGR1cmF0aW9uLCBpbiBtc1xuXHR0aGlzLmRlZmF1bHRab29tID0gMjtcdC8vIG11bHRpcGxpZXIgb2YgY3VycmVudCByYW5nZSB3aWR0aC4gTXVzdCBiZSA+PSAxLiAxID09IG5vIHpvb20uXG5cdFx0XHRcdC8vICh6b29taW5nIGluIHVzZXMgMS90aGlzIGFtb3VudClcblx0dGhpcy5kZWZhdWx0UGFuICA9IDAuMTU7Ly8gZnJhY3Rpb24gb2YgY3VycmVudCByYW5nZSB3aWR0aFxuXHR0aGlzLmN1cnJMaXN0SW5kZXggPSB7fTtcblx0dGhpcy5jdXJyTGlzdENvdW50ZXIgPSAwO1xuXG5cblx0Ly8gQ29vcmRpbmF0ZXMgbWF5IGJlIHNwZWNpZmllZCBpbiBvbmUgb2YgdHdvIHdheXM6IG1hcHBlZCBvciBsYW5kbWFyay4gXG5cdC8vIE1hcHBlZCBjb29yZGluYXRlcyBhcmUgc3BlY2lmaWVkIGFzIGNocm9tb3NvbWUrc3RhcnQrZW5kLiBUaGlzIGNvb3JkaW5hdGUgcmFuZ2UgaXMgZGVmaW5lZCByZWxhdGl2ZSB0byBcblx0Ly8gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZSwgYW5kIGlzIG1hcHBlZCB0byB0aGUgY29ycmVzcG9uZGluZyByYW5nZShzKSBpbiBlYWNoIGNvbXBhcmlzb24gZ2Vub21lLlxuXHQvLyBMYW5kbWFyayBjb29yZGluYXRlcyBhcmUgc3BlY2lmaWVkIGFzIGxhbmRtYXJrK1tmbGFua3x3aWR0aF0rZGVsdGEuIFRoZSBsYW5kbWFyayBpcyBsb29rZWQgdXAgaW4gZWFjaCBcblx0Ly8gZ2Vub21lLiBJdHMgY29vcmRpbmF0ZXMsIGNvbWJpbmVkIHdpdGggZmxhbmt8bGVuZ3RoIGFuZCBkZWx0YSwgZGV0ZXJtaW5lIHRoZSBhYnNvbHV0ZSBjb29yZGluYXRlIHJhbmdlXG5cdC8vIGluIHRoYXQgZ2Vub21lLiBJZiB0aGUgbGFuZG1hcmsgZG9lcyBub3QgZXhpc3QgaW4gYSBnaXZlbiBnZW5vbWUsIHRoZW4gbWFwcGVkIGNvb3JkaW5hdGUgYXJlIHVzZWQuXG5cdC8vIFxuXHR0aGlzLmNtb2RlID0gJ21hcHBlZCcgLy8gJ21hcHBlZCcgb3IgJ2xhbmRtYXJrJ1xuXHR0aGlzLmNvb3JkcyA9IHsgY2hyOiAnMScsIHN0YXJ0OiAxMDAwMDAwLCBlbmQ6IDEwMDAwMDAwIH07ICAvLyBtYXBwZWRcblx0dGhpcy5sY29vcmRzID0geyBsYW5kbWFyazogJ1BheDYnLCBmbGFuazogNTAwMDAwLCBkZWx0YTowIH07Ly8gbGFuZG1hcmtcblxuXHR0aGlzLmluaXREb20oKTtcblxuXHQvL1xuXHQvL1xuXHR0aGlzLmdlbm9tZVZpZXcgPSBuZXcgR2Vub21lVmlldyh0aGlzLCAnI2dlbm9tZVZpZXcnLCA4MDAsIDI1MCk7XG5cdHRoaXMuem9vbVZpZXcgICA9IG5ldyBab29tVmlldyAgKHRoaXMsICcjem9vbVZpZXcnLCA4MDAsIDI1MCwgdGhpcy5jb29yZHMpO1xuXHR0aGlzLnJlc2l6ZSgpO1xuICAgICAgICAvL1xuXHR0aGlzLmZlYXR1cmVEZXRhaWxzID0gbmV3IEZlYXR1cmVEZXRhaWxzKHRoaXMsICcjZmVhdHVyZURldGFpbHMnKTtcblxuXHQvLyBDYXRlZ29yaWNhbCBjb2xvciBzY2FsZSBmb3IgZmVhdHVyZSB0eXBlc1xuXHR0aGlzLmNzY2FsZSA9IGQzLnNjYWxlLmNhdGVnb3J5MTAoKS5kb21haW4oW1xuXHQgICAgJ3Byb3RlaW5fY29kaW5nX2dlbmUnLFxuXHQgICAgJ3BzZXVkb2dlbmUnLFxuXHQgICAgJ25jUk5BX2dlbmUnLFxuXHQgICAgJ2dlbmVfc2VnbWVudCcsXG5cdCAgICAnb3RoZXJfZ2VuZScsXG5cdCAgICAnb3RoZXJfZmVhdHVyZV90eXBlJ1xuXHRdKTtcblx0Ly9cblx0Ly9cblx0dGhpcy5saXN0TWFuYWdlciAgICA9IG5ldyBMaXN0TWFuYWdlcih0aGlzLCBcIiNteWxpc3RzXCIpO1xuXHR0aGlzLmxpc3RNYW5hZ2VyLnJlYWR5LnRoZW4oICgpID0+IHRoaXMubGlzdE1hbmFnZXIudXBkYXRlKCkgKTtcblx0Ly9cblx0dGhpcy5saXN0RWRpdG9yID0gbmV3IExpc3RFZGl0b3IodGhpcywgJyNsaXN0ZWRpdG9yJyk7XG5cdC8vXG5cdHRoaXMudHJhbnNsYXRvciAgICAgPSBuZXcgQlRNYW5hZ2VyKHRoaXMpO1xuXHR0aGlzLmZlYXR1cmVNYW5hZ2VyID0gbmV3IEZlYXR1cmVNYW5hZ2VyKHRoaXMpO1xuXHR0aGlzLnF1ZXJ5TWFuYWdlciA9IG5ldyBRdWVyeU1hbmFnZXIodGhpcywgXCIjZmluZEdlbmVzQm94XCIpO1xuXHQvL1xuXHR0aGlzLnVzZXJQcmVmc1N0b3JlID0gbmV3IEtleVN0b3JlKFwidXNlci1wcmVmZXJlbmNlc1wiKTtcblx0XG5cdC8vXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRmFjZXRzXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0dGhpcy5mYWNldE1hbmFnZXIgPSBuZXcgRmFjZXRNYW5hZ2VyKHRoaXMpO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0Ly8gRmVhdHVyZS10eXBlIGZhY2V0XG5cdGxldCBmdEZhY2V0ICA9IHRoaXMuZmFjZXRNYW5hZ2VyLmFkZEZhY2V0KFwiRmVhdHVyZVR5cGVcIiwgZiA9PiBmLmdldE11bmdlZFR5cGUoKSk7XG5cdHRoaXMuaW5pdEZlYXRUeXBlQ29udHJvbChmdEZhY2V0KTtcblxuXHQvLyBIYXMtTUdJLWlkIGZhY2V0XG5cdGxldCBtZ2lGYWNldCA9IHRoaXMuZmFjZXRNYW5hZ2VyLmFkZEZhY2V0KFwiSGFzQ2Fub25pY2FsSWRcIiwgICAgZiA9PiBmLmNhbm9uaWNhbCAgPyBcInllc1wiIDogXCJub1wiICk7XG5cdGQzLnNlbGVjdEFsbCgnaW5wdXRbbmFtZT1cIm1naUZhY2V0XCJdJykub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKXtcblx0ICAgIG1naUZhY2V0LnNldFZhbHVlcyh0aGlzLnZhbHVlID09PSBcIlwiID8gW10gOiBbdGhpcy52YWx1ZV0pO1xuXHQgICAgc2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0fSk7XG5cblx0Ly8gSXMtaGlnaGxpZ2h0ZWQgZmFjZXRcblx0bGV0IGhpRmFjZXQgPSB0aGlzLmZhY2V0TWFuYWdlci5hZGRGYWNldChcIklzSGlcIiwgZiA9PiB7XG5cdCAgICBsZXQgaXNoaSA9IHRoaXMuem9vbVZpZXcuaGlGZWF0c1tmLmlkXSB8fCB0aGlzLmN1cnJMaXN0SW5kZXhbZi5pZF07XG5cdCAgICByZXR1cm4gaXNoaSA/IFwieWVzXCIgOiBcIm5vXCI7XG5cdH0pO1xuXHRkMy5zZWxlY3RBbGwoJ2lucHV0W25hbWU9XCJoaUZhY2V0XCJdJykub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKXtcblx0ICAgIGhpRmFjZXQuc2V0VmFsdWVzKHRoaXMudmFsdWUgPT09IFwiXCIgPyBbXSA6IFt0aGlzLnZhbHVlXSk7XG5cdCAgICBzZWxmLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9KTtcblxuXG5cdC8vXG5cdHRoaXMuc2V0VUlGcm9tUHJlZnMoKTtcblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0Ly8gVGhpbmdzIGFyZSBhbGwgd2lyZWQgdXAuIE5vdyBsZXQncyBnZXQgc29tZSBkYXRhLlxuXHQvLyBTdGFydCB3aXRoIHRoZSBmaWxlIG9mIGFsbCB0aGUgZ2Vub21lcy5cblx0dGhpcy5jaGVja1RpbWVzdGFtcCgpLnRoZW4oICgpID0+IHtcblx0ICAgIGQzdHN2KFwiLi9kYXRhL2dlbm9tZWRhdGEvYWxsR2Vub21lcy50c3ZcIikudGhlbihkYXRhID0+IHtcblx0XHQvLyBjcmVhdGUgR2Vub21lIG9iamVjdHMgZnJvbSB0aGUgcmF3IGRhdGEuXG5cdFx0dGhpcy5hbGxHZW5vbWVzICAgPSBkYXRhLm1hcChnID0+IG5ldyBHZW5vbWUoZykpO1xuXHRcdHRoaXMuYWxsR2Vub21lcy5zb3J0KCAoYSxiKSA9PiB7XG5cdFx0ICAgIHJldHVybiBhLmxhYmVsIDwgYi5sYWJlbCA/IC0xIDogYS5sYWJlbCA+IGIubGFiZWwgPyArMSA6IDA7XG5cdFx0fSk7XG5cdFx0Ly9cblx0XHQvLyBidWlsZCBhIG5hbWUtPkdlbm9tZSBpbmRleFxuXHRcdHRoaXMubmwyZ2Vub21lID0ge307IC8vIGFsc28gYnVpbGQgdGhlIGNvbWJpbmVkIGxpc3QgYXQgdGhlIHNhbWUgdGltZS4uLlxuXHRcdHRoaXMubmFtZTJnZW5vbWUgID0gdGhpcy5hbGxHZW5vbWVzXG5cdFx0ICAgIC5yZWR1Y2UoKGFjYyxnKSA9PiB7IHRoaXMubmwyZ2Vub21lW2cubmFtZV0gPSBhY2NbZy5uYW1lXSA9IGc7IHJldHVybiBhY2M7IH0sIHt9KTtcblx0XHQvLyBidWlsZCBhIGxhYmVsLT5HZW5vbWUgaW5kZXhcblx0XHR0aGlzLmxhYmVsMmdlbm9tZSA9IHRoaXMuYWxsR2Vub21lc1xuXHRcdCAgICAucmVkdWNlKChhY2MsZykgPT4geyB0aGlzLm5sMmdlbm9tZVtnLmxhYmVsXSA9IGFjY1tnLmxhYmVsXSA9IGc7IHJldHVybiBhY2M7IH0sIHt9KTtcblxuXHRcdC8vIE5vdyBwcmVsb2FkIGFsbCB0aGUgY2hyb21vc29tZSBmaWxlcyBmb3IgYWxsIHRoZSBnZW5vbWVzXG5cdFx0bGV0IGNkcHMgPSB0aGlzLmFsbEdlbm9tZXMubWFwKGcgPT4gZDN0c3YoYC4vZGF0YS9nZW5vbWVkYXRhLyR7Zy5uYW1lfS1jaHJvbW9zb21lcy50c3ZgKSk7XG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKGNkcHMpO1xuXHQgICAgfSlcblx0ICAgIC50aGVuKCBkYXRhID0+IHtcblxuXHRcdC8vXG5cdFx0dGhpcy5wcm9jZXNzQ2hyb21vc29tZXMoZGF0YSk7XG5cdFx0dGhpcy5pbml0RG9tUGFydDIoKTtcblx0XHQvL1xuXHRcdC8vIEZJTkFMTFkhIFdlIGFyZSByZWFkeSB0byBkcmF3IHRoZSBpbml0aWFsIHNjZW5lLlxuXHRcdHRoaXMuc2V0Q29udGV4dCh0aGlzLmluaXRpYWxDZmcpO1xuXG5cdCAgICB9KTtcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNoZWNrVGltZXN0YW1wICgpIHtcbiAgICAgICAgbGV0IHRTdG9yZSA9IG5ldyBLZXlTdG9yZSgndGltZXN0YW1wJyk7XG5cdHJldHVybiBkM3RzdignLi9kYXRhL2dlbm9tZWRhdGEvVElNRVNUQU1QLnRzdicpLnRoZW4oIHRzID0+IHtcblx0ICAgIGxldCBuZXdUaW1lU3RhbXAgPSAgbmV3IERhdGUoRGF0ZS5wYXJzZSh0c1swXS5USU1FU1RBTVApKTtcblx0ICAgIHJldHVybiB0U3RvcmUuZ2V0KCdUSU1FU1RBTVAnKS50aGVuKCBvbGRUaW1lU3RhbXAgPT4ge1xuXHQgICAgICAgIGlmICghb2xkVGltZVN0YW1wIHx8IG5ld1RpbWVTdGFtcCA+IG9sZFRpbWVTdGFtcCkge1xuXHRcdCAgICB0U3RvcmUucHV0KCdUSU1FU1RBTVAnLG5ld1RpbWVTdGFtcCk7XG5cdFx0ICAgIHJldHVybiB0aGlzLmNsZWFyQ2FjaGVkRGF0YSgpO1xuXHRcdH1cblx0ICAgIH0pXG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBcbiAgICBpbml0RG9tICgpIHtcblx0c2VsZiA9IHRoaXM7XG5cdHRoaXMucm9vdCA9IGQzLnNlbGVjdCgnI21ndicpO1xuXHQvL1xuXHQvLyBUT0RPOiByZWZhY3RvciBwYWdlYm94LCBkcmFnZ2FibGUsIGFuZCBmcmllbmRzIGludG8gYSBmcmFtZXdvcmsgbW9kdWxlLFxuXHQvLyBcblx0dGhpcy5wYkRyYWdnZXIgPSB0aGlzLmdldENvbnRlbnREcmFnZ2VyKCk7XG5cdC8vIEFkZCBidXN5IGljb24sIGN1cnJlbnRseSBpbnZpc2liZS5cblx0ZDMuc2VsZWN0QWxsKCcucGFnZWJveCcpXG5cdCAgICAuYXBwZW5kKCdpJylcblx0XHQuYXR0cignY2xhc3MnLCdtYXRlcmlhbC1pY29ucyBidXN5IHJvdGF0aW5nJylcblx0ICAgIDtcblx0Ly9cblx0Ly8gSWYgYSBwYWdlYm94IGhhcyB0aXRsZSB0ZXh0LCBhcHBlbmQgYSBoZWxwIGljb24gdG8gdGhlIGxhYmVsIGFuZCBtb3ZlIHRoZSB0ZXh0IHRoZXJlXG5cdGQzLnNlbGVjdEFsbCgnLnBhZ2Vib3hbdGl0bGVdJylcblx0ICAgIC5hcHBlbmQoJ2knKVxuXHQgICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXRlcmlhbC1pY29ucyBidXR0b24gaGVscCcpXG5cdCAgICAgICAgLmF0dHIoJ3RpdGxlJywgZnVuY3Rpb24oKXtcblx0XHQgICAgbGV0IHAgPSBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlKTtcblx0XHQgICAgbGV0IHQgPSBwLmF0dHIoJ3RpdGxlJyk7XG5cdFx0ICAgIHAuYXR0cigndGl0bGUnLCBudWxsKTtcblx0XHQgICAgcmV0dXJuIHQ7XG5cdFx0fSlcblx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0ICAgIHNlbGYuc2hvd1N0YXR1cyhkMy5zZWxlY3QodGhpcykuYXR0cigndGl0bGUnKSwgZDMuZXZlbnQuY2xpZW50WCwgZDMuZXZlbnQuY2xpZW50WSk7XG5cdFx0fSlcblx0XHQ7XG5cdC8vXG5cdGQzLnNlbGVjdEFsbCgnLmNsb3NhYmxlJylcblx0ICAgIC5hcHBlbmQoJ2knKVxuXHRcdC5hdHRyKCdjbGFzcycsJ21hdGVyaWFsLWljb25zIGJ1dHRvbiBjbG9zZScpXG5cdFx0LmF0dHIoJ3RpdGxlJywnQ2xpY2sgdG8gb3Blbi9jbG9zZS4nKVxuXHRcdC5vbignY2xpY2suZGVmYXVsdCcsIGZ1bmN0aW9uICgpIHtcblx0XHQgICAgbGV0IHAgPSBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlKTtcblx0XHQgICAgcC5jbGFzc2VkKCdjbG9zZWQnLCAhIHAuY2xhc3NlZCgnY2xvc2VkJykpO1xuXHRcdCAgICBkMy5zZWxlY3QodGhpcykuYXR0cigndGl0bGUnLCdDbGljayB0byAnICsgIChwLmNsYXNzZWQoJ2Nsb3NlZCcpID8gJ29wZW4nIDogJ2Nsb3NlJykgKyAnLicpXG5cdFx0ICAgIHNlbGYuc2V0UHJlZnNGcm9tVUkoKTtcblx0XHR9KTtcblx0ZDMuc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUgPiAqJylcblx0ICAgIC5hcHBlbmQoJ2knKVxuXHRcdC5hdHRyKCd0aXRsZScsJ0RyYWcgdXAvZG93biB0byByZXBvc2l0aW9uLicpXG5cdFx0LmF0dHIoJ2NsYXNzJywnbWF0ZXJpYWwtaWNvbnMgYnV0dG9uIGRyYWdoYW5kbGUnKVxuXHRcdC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XG5cdFx0ICAgIC8vIEF0dGFjaCB0aGUgZHJhZyBiZWhhdmlvciB3aGVuIHRoZSB1c2VyIG1vdXNlcyBvdmVyIHRoZSBkcmFnIGhhbmRsZSwgYW5kIHJlbW92ZSB0aGUgYmVoYXZpb3Jcblx0XHQgICAgLy8gd2hlbiB1c2VyIG1vdXNlcyBvdXQuIFdoeSBkbyBpdCB0aGlzIHdheT8gQmVjYXVzZSBpZiB0aGUgZHJhZyBiZWhhdmlvciBzdGF5cyBvbiBhbGwgdGhlIHRpbWUsXG5cdFx0ICAgIC8vIHRoZSB1c2VyIGNhbm5vdCBzZWxlY3QgYW55IHRleHQgd2l0aGluIHRoZSBib3guXG5cdFx0ICAgIGxldCBwYiA9IHRoaXMuY2xvc2VzdCgnLnBhZ2Vib3gnKTtcblx0XHQgICAgaWYgKCFwYikgcmV0dXJuO1xuXHRcdCAgICBkMy5zZWxlY3QocGIpLmNhbGwoc2VsZi5wYkRyYWdnZXIpO1xuXHRcdH0pXG5cdFx0Lm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKXtcblx0XHQgICAgbGV0IHBiID0gdGhpcy5jbG9zZXN0KCcucGFnZWJveCcpO1xuXHRcdCAgICBpZiAoIXBiKSByZXR1cm47XG5cdFx0ICAgIGQzLnNlbGVjdChwYikub24oJy5kcmFnJyxudWxsKTtcblx0XHR9KTtcblxuXHQvLyBcbiAgICAgICAgZDMuc2VsZWN0KCcjc3RhdHVzTWVzc2FnZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4geyB0aGlzLnNob3dTdGF0dXMoZmFsc2UpOyB9KTtcblx0XG5cdC8vXG5cdC8vIEJ1dHRvbjogR2VhciBpY29uIHRvIHNob3cvaGlkZSBsZWZ0IGNvbHVtblxuXHRkMy5zZWxlY3QoXCIjaGVhZGVyID4gLmdlYXIuYnV0dG9uXCIpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IGxjID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJsZWZ0Y29sdW1uXCJdJyk7XG5cdFx0bGMuY2xhc3NlZChcImNsb3NlZFwiLCAoKSA9PiAhIGxjLmNsYXNzZWQoXCJjbG9zZWRcIikpO1xuXHRcdHdpbmRvdy5zZXRUaW1lb3V0KCgpPT57XG5cdFx0ICAgIHRoaXMucmVzaXplKClcblx0XHQgICAgdGhpcy5zZXRDb250ZXh0KHt9KTtcblx0XHQgICAgdGhpcy5zZXRQcmVmc0Zyb21VSSgpO1xuXHRcdH0sIDI1MCk7XG5cdCAgICB9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRG9tIGluaXRpYWxpenRpb24gdGhhdCBtdXN0IHdhaXQgdW50aWwgYWZ0ZXIgZ2Vub21lIG1ldGEgZGF0YSBpcyBsb2FkZWQuXG4gICAgaW5pdERvbVBhcnQyICgpIHtcblx0Ly9cblx0bGV0IGNmZyA9IHRoaXMuc2FuaXRpemVDZmcodGhpcy5pbml0aWFsQ2ZnKTtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdC8vIGluaXRpYWxpemUgdGhlIHJlZiBhbmQgY29tcCBnZW5vbWUgb3B0aW9uIGxpc3RzXG5cdGluaXRPcHRMaXN0KFwiI3JlZkdlbm9tZVwiLCAgIHRoaXMuYWxsR2Vub21lcywgZz0+Zy5uYW1lLCBnPT5nLmxhYmVsLCBmYWxzZSwgZyA9PiBnID09PSBjZmcucmVmKTtcblx0aW5pdE9wdExpc3QoXCIjY29tcEdlbm9tZXNcIiwgdGhpcy5hbGxHZW5vbWVzLCBnPT5nLm5hbWUsIGc9PmcubGFiZWwsIHRydWUsICBnID0+IGNmZy5nZW5vbWVzLmluZGV4T2YoZykgIT09IC0xKTtcblx0ZDMuc2VsZWN0KFwiI3JlZkdlbm9tZVwiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0ICAgIHNlbGYuc2V0Q29udGV4dCh7IHJlZjogdGhpcy52YWx1ZSB9KTtcblx0fSk7XG5cdGQzLnNlbGVjdChcIiNjb21wR2Vub21lc1wiKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpIHtcblx0ICAgIGxldCBzZWxlY3RlZE5hbWVzID0gW107XG5cdCAgICBmb3IobGV0IHggb2YgdGhpcy5zZWxlY3RlZE9wdGlvbnMpe1xuXHRcdHNlbGVjdGVkTmFtZXMucHVzaCh4LnZhbHVlKTtcblx0ICAgIH1cblx0ICAgIC8vIHdhbnQgdG8gcHJlc2VydmUgY3VycmVudCBnZW5vbWUgb3JkZXIgYXMgbXVjaCBhcyBwb3NzaWJsZSBcblx0ICAgIGxldCBnTmFtZXMgPSBzZWxmLnZHZW5vbWVzLm1hcChnPT5nLm5hbWUpXG5cdFx0LmZpbHRlcihuID0+IHtcblx0XHQgICAgcmV0dXJuIHNlbGVjdGVkTmFtZXMuaW5kZXhPZihuKSA+PSAwIHx8IG4gPT09IHNlbGYuckdlbm9tZS5uYW1lO1xuXHRcdH0pO1xuXHQgICAgZ05hbWVzID0gZ05hbWVzLmNvbmNhdChzZWxlY3RlZE5hbWVzLmZpbHRlcihuID0+IGdOYW1lcy5pbmRleE9mKG4pID09PSAtMSkpO1xuXHQgICAgc2VsZi5zZXRDb250ZXh0KHsgZ2Vub21lczogZ05hbWVzIH0pO1xuXHR9KTtcblx0ZDN0c3YoXCIuL2RhdGEvZ2Vub21lZGF0YS9nZW5vbWVTZXRzLnRzdlwiKS50aGVuKHNldHMgPT4ge1xuXHQgICAgLy8gQ3JlYXRlIHNlbGVjdGlvbiBidXR0b25zLlxuXHQgICAgc2V0cy5mb3JFYWNoKCBzID0+IHMuZ2Vub21lcyA9IHMuZ2Vub21lcy5zcGxpdChcIixcIikgKTtcblx0ICAgIGxldCBjZ2IgPSBkMy5zZWxlY3QoJyNjb21wR2Vub21lc0JveCcpLnNlbGVjdEFsbCgnYnV0dG9uJykuZGF0YShzZXRzKTtcblx0ICAgIGNnYi5lbnRlcigpLmFwcGVuZCgnYnV0dG9uJylcblx0XHQudGV4dChkPT5kLm5hbWUpXG5cdFx0LmF0dHIoJ3RpdGxlJywgZD0+ZC5kZXNjcmlwdGlvbilcblx0XHQub24oJ2NsaWNrJywgZCA9PiB7XG5cdFx0ICAgIHNlbGYuc2V0Q29udGV4dChkKTtcblx0XHR9KVxuXHRcdDtcblx0fSkuY2F0Y2goKCk9Pntcblx0ICAgIGNvbnNvbGUubG9nKFwiTm8gZ2Vub21lU2V0cyBmaWxlIGZvdW5kLlwiKTtcblx0fSk7IC8vIE9LIGlmIG5vIGdlbm9tZVNldHMgZmlsZVxuXG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHByb2Nlc3NDaHJvbW9zb21lcyAoZGF0YSkge1xuXHQvLyBkYXRhIGlzIGEgbGlzdCBvZiBjaHJvbW9zb21lIGxpc3RzLCBvbmUgcGVyIGdlbm9tZVxuXHQvLyBGaWxsIGluIHRoZSBnZW5vbWVDaHJzIG1hcCAoZ2Vub21lIC0+IGNociBsaXN0KVxuXHR0aGlzLmFsbEdlbm9tZXMuZm9yRWFjaCgoZyxpKSA9PiB7XG5cdCAgICAvLyBuaWNlbHkgc29ydCB0aGUgY2hyb21vc29tZXNcblx0ICAgIGxldCBjaHJzID0gZGF0YVtpXTtcblx0ICAgIGcubWF4bGVuID0gMDtcblx0ICAgIGNocnMuZm9yRWFjaCggYyA9PiB7XG5cdFx0Ly9cblx0XHRjLmxlbmd0aCA9IHBhcnNlSW50KGMubGVuZ3RoKVxuXHRcdGcubWF4bGVuID0gTWF0aC5tYXgoZy5tYXhsZW4sIGMubGVuZ3RoKTtcblx0XHQvLyBiZWNhdXNlIEknZCByYXRoZXIgc2F5IFwiY2hyb21vc29tZS5uYW1lXCIgdGhhbiBcImNocm9tb3NvbWUuY2hyb21vc29tZVwiXG5cdFx0Yy5uYW1lID0gYy5jaHJvbW9zb21lO1xuXHRcdGRlbGV0ZSBjLmNocm9tb3NvbWU7XG5cdCAgICB9KTtcblx0ICAgIC8vIG5pY2VseSBzb3J0IHRoZSBjaHJvbW9zb21lc1xuXHQgICAgY2hycy5zb3J0KChhLGIpID0+IHtcblx0XHRsZXQgYWEgPSBwYXJzZUludChhLm5hbWUpIC0gcGFyc2VJbnQoYi5uYW1lKTtcblx0XHRpZiAoIWlzTmFOKGFhKSkgcmV0dXJuIGFhO1xuXHRcdHJldHVybiBhLm5hbWUgPCBiLm5hbWUgPyAtMSA6IGEubmFtZSA+IGIubmFtZSA/ICsxIDogMDtcblx0ICAgIH0pO1xuXHQgICAgZy5jaHJvbW9zb21lcyA9IGNocnM7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRDb250ZW50RHJhZ2dlciAoKSB7XG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAvLyBIZWxwZXIgZnVuY3Rpb24gZm9yIHRoZSBkcmFnIGJlaGF2aW9yLiBSZW9yZGVycyB0aGUgY29udGVudHMgYmFzZWQgb25cbiAgICAgIC8vIGN1cnJlbnQgc2NyZWVuIHBvc2l0aW9uIG9mIHRoZSBkcmFnZ2VkIGl0ZW0uXG4gICAgICBmdW5jdGlvbiByZW9yZGVyQnlEb20oKSB7XG5cdCAgLy8gTG9jYXRlIHRoZSBzaWIgd2hvc2UgcG9zaXRpb24gaXMgYmV5b25kIHRoZSBkcmFnZ2VkIGl0ZW0gYnkgdGhlIGxlYXN0IGFtb3VudFxuXHQgIGxldCBkciA9IHNlbGYuZHJhZ2dpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgbGV0IGJTaWIgPSBudWxsO1xuXHQgIGxldCB4eSA9IGQzLnNlbGVjdChzZWxmLmRyYWdQYXJlbnQpLmNsYXNzZWQoXCJmbGV4cm93XCIpID8gXCJ4XCIgOiBcInlcIjtcblx0ICBmb3IgKGxldCBzIG9mIHNlbGYuZHJhZ1NpYnMpIHtcblx0ICAgICAgbGV0IHNyID0gcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgaWYgKGRyW3h5XSA8IHNyW3h5XSkge1xuXHRcdCAgIGxldCBkaXN0ID0gc3JbeHldIC0gZHJbeHldO1xuXHRcdCAgIGlmICghYlNpYiB8fCBkaXN0IDwgYlNpYlt4eV0gLSBkclt4eV0pXG5cdFx0ICAgICAgIGJTaWIgPSBzO1xuXHQgICAgICB9XG5cdCAgfVxuXHQgIC8vIEluc2VydCB0aGUgZHJhZ2dlZCBpdGVtIGJlZm9yZSB0aGUgbG9jYXRlZCBzaWIgKG9yIGFwcGVuZCBpZiBubyBzaWIgZm91bmQpXG5cdCAgc2VsZi5kcmFnUGFyZW50Lmluc2VydEJlZm9yZShzZWxmLmRyYWdnaW5nLCBiU2liKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIHJlb3JkZXJCeVN0eWxlKCkge1xuXHQgIGxldCBkZCA9IGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKTtcblx0ICAvLyBMb2NhdGUgdGhlIHNpYiB0aGF0IGNvbnRhaW5zIHRoZSBkcmFnZ2VkIGl0ZW0ncyBvcmlnaW4uXG5cdCAgbGV0IGRyID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICBsZXQgYlNpYiA9IG51bGw7XG5cdCAgbGV0IHh5ID0gZDMuc2VsZWN0KHNlbGYuZHJhZ1BhcmVudCkuY2xhc3NlZChcImZsZXhyb3dcIikgPyBcInhcIiA6IFwieVwiO1xuXHQgIGxldCBzeiA9IHh5ID09PSBcInhcIiA/IFwid2lkdGhcIiA6IFwiaGVpZ2h0XCI7XG5cdCAgbGV0IHN0eT0geHkgPT09IFwieFwiID8gXCJsZWZ0XCIgOiBcInRvcFwiO1xuXHQgIGZvciAobGV0IHMgb2Ygc2VsZi5kcmFnU2licykge1xuXHQgICAgICAvLyBza2lwIHRoZSBkcmFnZ2VkIGl0ZW1cblx0ICAgICAgaWYgKHMgPT09IHNlbGYuZHJhZ2dpbmcpIGNvbnRpbnVlO1xuXHQgICAgICBsZXQgZHMgPSBkMy5zZWxlY3Qocyk7XG5cdCAgICAgIGxldCBzciA9IHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIC8vIGlmdyB0aGUgZHJhZ2dlZCBpdGVtJ3Mgb3JpZ2luIGlzIGJldHdlZW4gdGhlIHN0YXJ0IGFuZCBlbmQgb2Ygc2liLCB3ZSBmb3VuZCBpdC5cblx0ICAgICAgaWYgKGRyW3h5XSA+PSBzclt4eV0gJiYgZHJbeHldIDw9IChzclt4eV0gKyBzcltzel0pKSB7XG5cdFx0ICAgLy8gbW92ZSBzaWIgdG93YXJkIHRoZSBob2xlLCBhbW91bnQgPSB0aGUgc2l6ZSBvZiB0aGUgaG9sZVxuXHRcdCAgIGxldCBhbXQgPSBzZWxmLmRyYWdIb2xlW3N6XSAqIChzZWxmLmRyYWdIb2xlW3h5XSA8IHNyW3h5XSA/IC0xIDogMSk7XG5cdFx0ICAgZHMuc3R5bGUoc3R5LCBwYXJzZUludChkcy5zdHlsZShzdHkpKSArIGFtdCArIFwicHhcIik7XG5cdFx0ICAgc2VsZi5kcmFnSG9sZVt4eV0gLT0gYW10O1xuICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICB9XG5cdCAgfVxuICAgICAgfVxuICAgICAgLy9cbiAgICAgIHJldHVybiBkMy5iZWhhdmlvci5kcmFnKClcblx0ICAub3JpZ2luKGZ1bmN0aW9uKGQsaSl7XG5cdCAgICAgIHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIH0pXG4gICAgICAgICAgLm9uKFwiZHJhZ3N0YXJ0Lm1cIiwgZnVuY3Rpb24oKSB7XG5cdCAgICAgIGxldCB0ID0gZDMuZXZlbnQuc291cmNlRXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAoISBkMy5zZWxlY3QodCkuY2xhc3NlZChcImRyYWdoYW5kbGVcIikpIHJldHVybjtcblx0ICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIC8vXG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgICAgPSB0aGlzLmNsb3Nlc3QoXCIucGFnZWJveFwiKTtcblx0ICAgICAgc2VsZi5kcmFnSG9sZSAgICA9IHNlbGYuZHJhZ2dpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIHNlbGYuZHJhZ1BhcmVudCAgPSBzZWxmLmRyYWdnaW5nLnBhcmVudE5vZGU7XG5cdCAgICAgIHNlbGYuZHJhZ1NpYnMgICAgPSBzZWxmLmRyYWdQYXJlbnQuY2hpbGRyZW47XG5cdCAgICAgIC8vXG5cdCAgICAgIGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKS5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgdHJ1ZSk7XG5cdCAgfSlcblx0ICAub24oXCJkcmFnLm1cIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgbGV0IGRkID0gZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpO1xuXHQgICAgICBsZXQgdHAgPSBwYXJzZUludChkZC5zdHlsZShcInRvcFwiKSlcblx0ICAgICAgZGQuc3R5bGUoXCJ0b3BcIiwgdHAgKyBkMy5ldmVudC5keSArIFwicHhcIik7XG5cdCAgICAgIC8vcmVvcmRlckJ5U3R5bGUoKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWdlbmQubVwiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICByZW9yZGVyQnlEb20oKTtcblx0ICAgICAgc2VsZi5zZXRQcmVmc0Zyb21VSSgpO1xuXHQgICAgICBsZXQgZGQgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZyk7XG5cdCAgICAgIGRkLnN0eWxlKFwidG9wXCIsIFwiMHB4XCIpO1xuXHQgICAgICBkZC5jbGFzc2VkKFwiZHJhZ2dpbmdcIiwgZmFsc2UpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nICAgID0gbnVsbDtcblx0ICAgICAgc2VsZi5kcmFnSG9sZSAgICA9IG51bGw7XG5cdCAgICAgIHNlbGYuZHJhZ1BhcmVudCAgPSBudWxsO1xuXHQgICAgICBzZWxmLmRyYWdTaWJzICAgID0gbnVsbDtcblx0ICB9KVxuXHQgIDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0VUlGcm9tUHJlZnMgKCkge1xuXHR0aGlzLnVzZXJQcmVmc1N0b3JlLmdldChcInByZWZzXCIpLnRoZW4oIHByZWZzID0+IHtcblx0ICAgIHByZWZzID0gcHJlZnMgfHwge307XG5cdCAgICBjb25zb2xlLmxvZyhcIkdvdCBwcmVmcyBmcm9tIHN0b3JhZ2VcIiwgcHJlZnMpO1xuXG5cdCAgICAvLyBzZXQgb3Blbi9jbG9zZWQgc3RhdGVzXG5cdCAgICAocHJlZnMuY2xvc2FibGVzIHx8IFtdKS5mb3JFYWNoKCBjID0+IHtcblx0XHRsZXQgaWQgPSBjWzBdO1xuXHRcdGxldCBzdGF0ZSA9IGNbMV07XG5cdFx0ZDMuc2VsZWN0KCcjJytpZCkuY2xhc3NlZCgnY2xvc2VkJywgc3RhdGUgPT09IFwiY2xvc2VkXCIgfHwgbnVsbCk7XG5cdCAgICB9KTtcblxuXHQgICAgLy8gc2V0IGRyYWdnYWJsZXMnIG9yZGVyXG5cdCAgICAocHJlZnMuZHJhZ2dhYmxlcyB8fCBbXSkuZm9yRWFjaCggZCA9PiB7XG5cdFx0bGV0IGN0cklkID0gZFswXTtcblx0XHRsZXQgY29udGVudElkcyA9IGRbMV07XG5cdFx0bGV0IGN0ciA9IGQzLnNlbGVjdCgnIycrY3RySWQpO1xuXHRcdGxldCBjb250ZW50cyA9IGN0ci5zZWxlY3RBbGwoJyMnK2N0cklkKycgPiAqJyk7XG5cdFx0Y29udGVudHNbMF0uc29ydCggKGEsYikgPT4ge1xuXHRcdCAgICBsZXQgYWkgPSBjb250ZW50SWRzLmluZGV4T2YoYS5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuXHRcdCAgICBsZXQgYmkgPSBjb250ZW50SWRzLmluZGV4T2YoYi5nZXRBdHRyaWJ1dGUoJ2lkJykpO1xuXHRcdCAgICByZXR1cm4gYWkgLSBiaTtcblx0XHR9KTtcblx0XHRjb250ZW50cy5vcmRlcigpO1xuXHQgICAgfSk7XG5cdH0pO1xuICAgIH1cbiAgICBzZXRQcmVmc0Zyb21VSSAoKSB7XG4gICAgICAgIC8vIHNhdmUgb3Blbi9jbG9zZWQgc3RhdGVzXG5cdGxldCBjbG9zYWJsZXMgPSB0aGlzLnJvb3Quc2VsZWN0QWxsKCcuY2xvc2FibGUnKTtcblx0bGV0IG9jRGF0YSA9IGNsb3NhYmxlc1swXS5tYXAoIGMgPT4ge1xuXHQgICAgbGV0IGRjID0gZDMuc2VsZWN0KGMpO1xuXHQgICAgcmV0dXJuIFtkYy5hdHRyKCdpZCcpLCBkYy5jbGFzc2VkKFwiY2xvc2VkXCIpID8gXCJjbG9zZWRcIiA6IFwib3BlblwiXTtcblx0fSk7XG5cdC8vIHNhdmUgZHJhZ2dhYmxlcycgb3JkZXJcblx0bGV0IGRyYWdDdHJzID0gdGhpcy5yb290LnNlbGVjdEFsbCgnLmNvbnRlbnQtZHJhZ2dhYmxlJyk7XG5cdGxldCBkcmFnZ2FibGVzID0gZHJhZ0N0cnMuc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUgPiAqJyk7XG5cdGxldCBkZERhdGEgPSBkcmFnZ2FibGVzLm1hcCggKGQsaSkgPT4ge1xuXHQgICAgbGV0IGN0ciA9IGQzLnNlbGVjdChkcmFnQ3Ryc1swXVtpXSk7XG5cdCAgICByZXR1cm4gW2N0ci5hdHRyKCdpZCcpLCBkLm1hcCggZGQgPT4gZDMuc2VsZWN0KGRkKS5hdHRyKCdpZCcpKV07XG5cdH0pO1xuXHRsZXQgcHJlZnMgPSB7XG5cdCAgICBjbG9zYWJsZXM6IG9jRGF0YSxcblx0ICAgIGRyYWdnYWJsZXM6IGRkRGF0YVxuXHR9XG5cdGNvbnNvbGUubG9nKFwiU2F2aW5nIHByZWZzIHRvIHN0b3JhZ2VcIiwgcHJlZnMpO1xuXHR0aGlzLnVzZXJQcmVmc1N0b3JlLnNldChcInByZWZzXCIsIHByZWZzKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd0Jsb2NrcyAoY29tcCkge1xuXHRsZXQgcmVmID0gdGhpcy5yR2Vub21lO1xuXHRpZiAoISBjb21wKSBjb21wID0gdGhpcy5jR2Vub21lc1swXTtcblx0aWYgKCEgY29tcCkgcmV0dXJuO1xuXHR0aGlzLnRyYW5zbGF0b3IucmVhZHkoKS50aGVuKCAoKSA9PiB7XG5cdCAgICBsZXQgYmxvY2tzID0gY29tcCA9PT0gcmVmID8gW10gOiB0aGlzLnRyYW5zbGF0b3IuZ2V0QmxvY2tzKHJlZiwgY29tcCk7XG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuZHJhd0Jsb2Nrcyh7IHJlZiwgY29tcCwgYmxvY2tzIH0pO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd0J1c3kgKGlzQnVzeSwgbWVzc2FnZSkge1xuICAgICAgICBkMy5zZWxlY3QoXCIjaGVhZGVyID4gLmdlYXIuYnV0dG9uXCIpXG5cdCAgICAuY2xhc3NlZChcInJvdGF0aW5nXCIsIGlzQnVzeSk7XG4gICAgICAgIGQzLnNlbGVjdChcIiN6b29tVmlld1wiKS5jbGFzc2VkKFwiYnVzeVwiLCBpc0J1c3kpO1xuXHRpZiAoaXNCdXN5ICYmIG1lc3NhZ2UpIHRoaXMuc2hvd1N0YXR1cyhtZXNzYWdlKTtcblx0aWYgKCFpc0J1c3kpIHRoaXMuc2hvd1N0YXR1cygnJylcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd2luZ1N0YXR1cyAoKSB7XG4gICAgICAgIHJldHVybiBkMy5zZWxlY3QoJyNzdGF0dXNNZXNzYWdlJykuY2xhc3NlZCgnc2hvd2luZycpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dTdGF0dXMgKG1zZywgbmVhclgsIG5lYXJZKSB7XG5cdGxldCBiYiA9IHRoaXMucm9vdC5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdGxldCBfID0gKG4sIGxlbiwgbm1heCkgPT4ge1xuXHQgICAgaWYgKG4gPT09IHVuZGVmaW5lZClcblx0ICAgICAgICByZXR1cm4gJzUwJSc7XG5cdCAgICBlbHNlIGlmICh0eXBlb2YobikgPT09ICdzdHJpbmcnKVxuXHQgICAgICAgIHJldHVybiBuO1xuXHQgICAgZWxzZSBpZiAoIG4gKyBsZW4gPCBubWF4ICkge1xuXHQgICAgICAgIHJldHVybiBuICsgJ3B4Jztcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIHJldHVybiAobm1heCAtIGxlbikgKyAncHgnO1xuXHQgICAgfVxuXHR9O1xuXHRuZWFyWCA9IF8obmVhclgsIDI1MCwgYmIud2lkdGgpO1xuXHRuZWFyWSA9IF8obmVhclksIDE1MCwgYmIuaGVpZ2h0KTtcblx0aWYgKG1zZylcblx0ICAgIGQzLnNlbGVjdCgnI3N0YXR1c01lc3NhZ2UnKVxuXHRcdC5jbGFzc2VkKCdzaG93aW5nJywgdHJ1ZSlcblx0XHQuc3R5bGUoJ2xlZnQnLCBuZWFyWClcblx0XHQuc3R5bGUoJ3RvcCcsICBuZWFyWSlcblx0XHQuc2VsZWN0KCdzcGFuJylcblx0XHQgICAgLnRleHQobXNnKTtcblx0ZWxzZVxuXHQgICAgZDMuc2VsZWN0KCcjc3RhdHVzTWVzc2FnZScpLmNsYXNzZWQoJ3Nob3dpbmcnLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0UmVmR2Vub21lU2VsZWN0aW9uICgpIHtcblx0ZDMuc2VsZWN0QWxsKFwiI3JlZkdlbm9tZSBvcHRpb25cIilcblx0ICAgIC5wcm9wZXJ0eShcInNlbGVjdGVkXCIsICBnZyA9PiAoZ2cubGFiZWwgPT09IHRoaXMuckdlbm9tZS5sYWJlbCAgfHwgbnVsbCkpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRDb21wR2Vub21lc1NlbGVjdGlvbiAoKSB7XG5cdGxldCBjZ25zID0gdGhpcy52R2Vub21lcy5tYXAoZz0+Zy5sYWJlbCk7XG5cdGQzLnNlbGVjdEFsbChcIiNjb21wR2Vub21lcyBvcHRpb25cIilcblx0ICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCAgZ2cgPT4gY2ducy5pbmRleE9mKGdnLmxhYmVsKSA+PSAwKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyBvciByZXR1cm5zXG4gICAgc2V0SGlnaGxpZ2h0IChmbGlzdCkge1xuXHRpZiAoIWZsaXN0KSByZXR1cm4gZmFsc2U7XG5cdHRoaXMuem9vbVZpZXcuaGlGZWF0cyA9IGZsaXN0LnJlZHVjZSgoYSx2KSA9PiB7IGFbdl09djsgcmV0dXJuIGE7IH0sIHt9KTtcblx0cmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIGN1cnJlbnQgY29udGV4dCBhcyBhbiBvYmplY3QuXG4gICAgLy8gQ3VycmVudCBjb250ZXh0ID0gcmVmIGdlbm9tZSArIGNvbXAgZ2Vub21lcyArIGN1cnJlbnQgcmFuZ2UgKGNocixzdGFydCxlbmQpXG4gICAgZ2V0Q29udGV4dCAoKSB7XG5cdGlmICh0aGlzLmNtb2RlID09PSAnbWFwcGVkJykge1xuXHQgICAgbGV0IGMgPSB0aGlzLmNvb3Jkcztcblx0ICAgIHJldHVybiB7XG5cdFx0cmVmIDogdGhpcy5yR2Vub21lLmxhYmVsLFxuXHRcdGdlbm9tZXM6IHRoaXMudkdlbm9tZXMubWFwKGc9PmcubGFiZWwpLFxuXHRcdGNocjogYy5jaHIsXG5cdFx0c3RhcnQ6IGMuc3RhcnQsXG5cdFx0ZW5kOiBjLmVuZCxcblx0XHRoaWdobGlnaHQ6IE9iamVjdC5rZXlzKHRoaXMuem9vbVZpZXcuaGlGZWF0cykuc29ydCgpLFxuXHRcdGRtb2RlOiB0aGlzLnpvb21WaWV3LmRtb2RlXG5cdCAgICB9XG5cdH0gZWxzZSB7XG5cdCAgICBsZXQgYyA9IHRoaXMubGNvb3Jkcztcblx0ICAgIHJldHVybiB7XG5cdFx0cmVmIDogdGhpcy5yR2Vub21lLmxhYmVsLFxuXHRcdGdlbm9tZXM6IHRoaXMudkdlbm9tZXMubWFwKGc9PmcubGFiZWwpLFxuXHRcdGxhbmRtYXJrOiBjLmxhbmRtYXJrLFxuXHRcdGZsYW5rOiBjLmZsYW5rLFxuXHRcdGxlbmd0aDogYy5sZW5ndGgsXG5cdFx0ZGVsdGE6IGMuZGVsdGEsXG5cdFx0aGlnaGxpZ2h0OiBPYmplY3Qua2V5cyh0aGlzLnpvb21WaWV3LmhpRmVhdHMpLnNvcnQoKSxcblx0XHRkbW9kZTogdGhpcy56b29tVmlldy5kbW9kZVxuXHQgICAgfVxuXHR9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJlc29sdmVzIHRoZSBzcGVjaWZpZWQgbGFuZG1hcmsgdG8gYSBmZWF0dXJlIGFuZCB0aGUgbGlzdCBvZiBlcXVpdmFsZW50IGZlYXVyZXMuXG4gICAgLy8gTWF5IGJlIGdpdmVuIGFuIGlkLCBjYW5vbmljYWwgaWQsIG9yIHN5bWJvbC5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBjZmcgKG9iaikgU2FuaXRpemVkIGNvbmZpZyBvYmplY3QsIHdpdGggYSBsYW5kbWFyayAoc3RyaW5nKSBmaWVsZC5cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgICBUaGUgY2ZnIG9iamVjdCwgd2l0aCBhZGRpdGlvbmFsIGZpZWxkczpcbiAgICAvLyAgICAgICAgbGFuZG1hcmtSZWZGZWF0OiB0aGUgbGFuZG1hcmsgKEZlYXR1cmUgb2JqKSBpbiB0aGUgcmVmIGdlbm9tZVxuICAgIC8vICAgICAgICBsYW5kbWFya0ZlYXRzOiBbIGVxdWl2YWxlbnQgZmVhdHVyZXMgaW4gZWFjaCBnZW5vbWUgKGluY2x1ZGVzIHJmKV1cbiAgICAvLyAgICAgQWxzbywgY2hhbmdlcyByZWYgdG8gYmUgdGhlIGdlbm9tZSBvZiB0aGUgbGFuZG1hcmtSZWZGZWF0XG4gICAgLy8gICAgIFJldHVybnMgbnVsbCBpZiBsYW5kbWFyayBub3QgZm91bmQgaW4gYW55IGdlbm9tZS5cbiAgICAvLyBcbiAgICByZXNvbHZlTGFuZG1hcmsgKGNmZykge1xuXHRsZXQgcmYsIGZlYXRzO1xuXHQvLyBGaW5kIHRoZSBsYW5kbWFyayBmZWF0dXJlIGluIHRoZSByZWYgZ2Vub21lLiBcblx0cmYgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlMYWJlbChjZmcubGFuZG1hcmssIGNmZy5yZWYpWzBdO1xuXHRpZiAoIXJmKSB7XG5cdCAgICAvLyBMYW5kbWFyayBkb2VzIG5vdCBleGlzdCBpbiByZWYgZ2Vub21lLiBEb2VzIGl0IGV4aXN0IGluIGFueSBzcGVjaWZpZWQgZ2Vub21lP1xuXHQgICAgcmYgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlMYWJlbChjZmcubGFuZG1hcmspLmZpbHRlcihmID0+IGNmZy5nZW5vbWVzLmluZGV4T2YoZi5nZW5vbWUpID49IDApWzBdO1xuXHQgICAgaWYgKHJmKSB7XG5cdCAgICAgICAgY2ZnLnJlZiA9IHJmLmdlbm9tZTtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHQgICAgICAgIC8vIExhbmRtYXJrIGNhbm5vdCBiZSByZXNvbHZlZC5cblx0XHRyZXR1cm4gbnVsbDtcblx0ICAgIH1cblx0fVxuXHQvLyBsYW5kbWFyayBleGlzdHMgaW4gcmVmIGdlbm9tZS4gR2V0IGVxdWl2YWxlbnQgZmVhdCBpbiBlYWNoIGdlbm9tZS5cblx0ZmVhdHMgPSByZi5jYW5vbmljYWwgPyB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlDYW5vbmljYWxJZChyZi5jYW5vbmljYWwpIDogW3JmXTtcblx0Y2ZnLmxhbmRtYXJrUmVmRmVhdCA9IHJmO1xuXHRjZmcubGFuZG1hcmtGZWF0cyA9IGZlYXRzLmZpbHRlcihmID0+IGNmZy5nZW5vbWVzLmluZGV4T2YoZi5nZW5vbWUpID49IDApO1xuXHRyZXR1cm4gY2ZnO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgc2FuaXRpemVkIHZlcnNpb24gb2YgdGhlIGFyZ3VtZW50IGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICAgIC8vIFRoZSBzYW5pdGl6ZWQgdmVyc2lvbjpcbiAgICAvLyAgICAgLSBoYXMgYSBzZXR0aW5nIGZvciBldmVyeSBwYXJhbWV0ZXIuIFBhcmFtZXRlcnMgbm90IHNwZWNpZmllZCBpbiBcbiAgICAvLyAgICAgICB0aGUgYXJndW1lbnQgYXJlIChnZW5lcmFsbHkpIGZpbGxlZCBpbiB3aXRoIHRoZWlyIGN1cnJlbnQgdmFsdWVzLlxuICAgIC8vICAgICAtIGlzIGFsd2F5cyB2YWxpZCwgZWdcbiAgICAvLyAgICAgXHQtIGhhcyBhIGxpc3Qgb2YgMSBvciBtb3JlIHZhbGlkIGdlbm9tZXMsIHdpdGggb25lIG9mIHRoZW0gZGVzaWduYXRlZCBhcyB0aGUgcmVmXG4gICAgLy8gICAgIFx0LSBoYXMgYSB2YWxpZCBjb29yZGluYXRlIHJhbmdlXG4gICAgLy8gICAgIFx0ICAgIC0gc3RhcnQgYW5kIGVuZCBhcmUgaW50ZWdlcnMgd2l0aCBzdGFydCA8PSBlbmRcbiAgICAvLyAgICAgXHQgICAgLSB2YWxpZCBjaHJvbW9zb21lIGZvciByZWYgZ2Vub21lXG4gICAgLy9cbiAgICAvLyBUaGUgc2FuaXRpemVkIHZlcnNpb24gaXMgYWxzbyBcImNvbXBpbGVkXCI6XG4gICAgLy8gICAgIC0gaXQgaGFzIGFjdHVhbCBHZW5vbWUgb2JqZWN0cywgd2hlcmUgdGhlIGFyZ3VtZW50IGp1c3QgaGFzIG5hbWVzXG4gICAgLy8gICAgIC0gZ3JvdXBzIHRoZSBjaHIrc3RhcnQrZW5kIGluIFwiY29vcmRzXCIgb2JqZWN0XG4gICAgLy9cbiAgICAvL1xuICAgIHNhbml0aXplQ2ZnIChjKSB7XG5cdGxldCBjZmcgPSB7fTtcblxuXHQvLyBTYW5pdGl6ZSB0aGUgaW5wdXQuXG5cblx0Ly8gd2luZG93IHNpemUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0aWYgKGMud2lkdGgpIHtcblx0ICAgIGNmZy53aWR0aCA9IGMud2lkdGhcblx0fVxuXG5cdC8vIHJlZiBnZW5vbWUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vXG5cdC8vIFNldCBjZmcucmVmIHRvIHNwZWNpZmllZCBnZW5vbWUsIFxuXHQvLyAgIHdpdGggZmFsbGJhY2sgdG8gY3VycmVudCByZWYgZ2Vub21lLCBcblx0Ly8gICAgICB3aXRoIGZhbGxiYWNrIHRvIEM1N0JMLzZKICgxc3QgdGltZSB0aHJ1KVxuXHQvLyBGSVhNRTogZmluYWwgZmFsbGJhY2sgc2hvdWxkIGJlIGEgY29uZmlnIHNldHRpbmcuXG5cdGNmZy5yZWYgPSAoYy5yZWYgPyB0aGlzLm5sMmdlbm9tZVtjLnJlZl0gfHwgdGhpcy5yR2Vub21lIDogdGhpcy5yR2Vub21lKSB8fCB0aGlzLm5sMmdlbm9tZVsnQzU3QkwvNkonXTtcblxuXHQvLyBjb21wYXJpc29uIGdlbm9tZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBTZXQgY2ZnLmdlbm9tZXMgdG8gYmUgdGhlIHNwZWNpZmllZCBnZW5vbWVzLFxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBnZW5vbWVzXG5cdC8vICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIFtyZWZdICgxc3QgdGltZSB0aHJ1KVxuXHRjZmcuZ2Vub21lcyA9IGMuZ2Vub21lcyA/XG5cdCAgICAoYy5nZW5vbWVzLm1hcChnID0+IHRoaXMubmwyZ2Vub21lW2ddKS5maWx0ZXIoeD0+eCkpXG5cdCAgICA6XG5cdCAgICB0aGlzLnZHZW5vbWVzO1xuXHQvLyBBZGQgcmVmIHRvIGdlbm9tZXMgaWYgbm90IHRoZXJlIGFscmVhZHlcblx0aWYgKGNmZy5nZW5vbWVzLmluZGV4T2YoY2ZnLnJlZikgPT09IC0xKVxuXHQgICAgY2ZnLmdlbm9tZXMudW5zaGlmdChjZmcucmVmKTtcblx0XG5cdC8vIGFic29sdXRlIGNvb3JkaW5hdGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vXG5cdC8vIFNldCBjZmcuY2hyIHRvIGJlIHRoZSBzcGVjaWZpZWQgY2hyb21vc29tZVxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBjaHJcblx0Ly8gICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSAxc3QgY2hyb21vc29tZSBpbiB0aGUgcmVmIGdlbm9tZVxuXHRjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKGMuY2hyKTtcblx0aWYgKCFjZmcuY2hyKSBjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKCB0aGlzLmNvb3JkcyA/IHRoaXMuY29vcmRzLmNociA6IFwiMVwiICk7XG5cdGlmICghY2ZnLmNocikgY2ZnLmNociA9IGNmZy5yZWYuZ2V0Q2hyb21vc29tZSgwKTtcblx0aWYgKCFjZmcuY2hyKSB0aHJvdyBcIk5vIGNocm9tb3NvbWUuXCJcblx0XG5cdC8vIFNldCBjZmcuc3RhcnQgdG8gYmUgdGhlIHNwZWNpZmllZCBzdGFydCB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IHN0YXJ0XG5cdC8vIENsaXAgYXQgY2hyIGJvdW5kYXJpZXNcblx0Y2ZnLnN0YXJ0ID0gY2xpcChNYXRoLnJvdW5kKHR5cGVvZihjLnN0YXJ0KSA9PT0gXCJudW1iZXJcIiA/IGMuc3RhcnQgOiB0aGlzLmNvb3Jkcy5zdGFydCksIDEsIGNmZy5jaHIubGVuZ3RoKTtcblxuXHQvLyBTZXQgY2ZnLmVuZCB0byBiZSB0aGUgc3BlY2lmaWVkIGVuZCB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGVuZFxuXHQvLyBDbGlwIGF0IGNociBib3VuZGFyaWVzXG5cdGNmZy5lbmQgPSBjbGlwKE1hdGgucm91bmQodHlwZW9mKGMuZW5kKSA9PT0gXCJudW1iZXJcIiA/IGMuZW5kIDogdGhpcy5jb29yZHMuZW5kKSwgMSwgY2ZnLmNoci5sZW5ndGgpO1xuXG5cdC8vIEVuc3VyZSBzdGFydCA8PSBlbmRcblx0aWYgKGNmZy5zdGFydCA+IGNmZy5lbmQpIHtcblx0ICAgbGV0IHRtcCA9IGNmZy5zdGFydDsgY2ZnLnN0YXJ0ID0gY2ZnLmVuZDsgY2ZnLmVuZCA9IHRtcDtcblx0fVxuXG5cdC8vIGxhbmRtYXJrIGNvb3JkaW5hdGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIE5PVEUgdGhhdCBsYW5kbWFyayBjb29yZGluYXRlIGNhbm5vdCBiZSBmdWxseSByZXNvbHZlZCB0byBhYnNvbHV0ZSBjb29yZGluYXRlIHVudGlsXG5cdC8vICphZnRlciogZ2Vub21lIGRhdGEgaGF2ZSBiZWVuIGxvYWRlZC4gU2VlIHNldENvbnRleHQgYW5kIHJlc29sdmVMYW5kbWFyayBtZXRob2RzLlxuXHRjZmcubGFuZG1hcmsgPSBjLmxhbmRtYXJrIHx8IHRoaXMubGNvb3Jkcy5sYW5kbWFyaztcblx0Y2ZnLmRlbHRhICAgID0gTWF0aC5yb3VuZCgnZGVsdGEnIGluIGMgPyBjLmRlbHRhIDogKHRoaXMubGNvb3Jkcy5kZWx0YSB8fCAwKSk7XG5cdGlmICh0eXBlb2YoYy5mbGFuaykgPT09ICdudW1iZXInKXtcblx0ICAgIGNmZy5mbGFuayA9IE1hdGgucm91bmQoYy5mbGFuayk7XG5cdH1cblx0ZWxzZSBpZiAoJ2xlbmd0aCcgaW4gYykge1xuXHQgICAgY2ZnLmxlbmd0aCA9IE1hdGgucm91bmQoYy5sZW5ndGgpO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgY2ZnLmxlbmd0aCA9IE1hdGgucm91bmQodGhpcy5jb29yZHMuZW5kIC0gdGhpcy5jb29yZHMuc3RhcnQgKyAxKTtcblx0fVxuXG5cdC8vIGNtb2RlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGlmIChjLmNtb2RlICYmIGMuY21vZGUgIT09ICdtYXBwZWQnICYmIGMuY21vZGUgIT09ICdsYW5kbWFyaycpIGMuY21vZGUgPSBudWxsO1xuXHRjZmcuY21vZGUgPSBjLmNtb2RlIHx8IFxuXHQgICAgKCgnY2hyJyBpbiBjIHx8ICdzdGFydCcgaW4gYyB8fCAnZW5kJyBpbiBjKSA/XG5cdCAgICAgICAgJ21hcHBlZCcgOiBcblx0XHQoJ2xhbmRtYXJrJyBpbiBjIHx8ICdmbGFuaycgaW4gYyB8fCAnbGVuZ3RoJyBpbiBjIHx8ICdkZWx0YScgaW4gYykgP1xuXHRcdCAgICAnbGFuZG1hcmsnIDogXG5cdFx0ICAgIHRoaXMuY21vZGUgfHwgJ21hcHBlZCcpO1xuXG5cdC8vIGhpZ2hsaWdodGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIFNldCBjZmcuaGlnaGxpZ2h0XG5cdC8vICAgIHdpdGggZmFsbGJhY2sgdG8gY3VycmVudCBoaWdobGlnaHRcblx0Ly8gICAgICAgIHdpdGggZmFsbGJhY2sgdG8gW11cblx0Y2ZnLmhpZ2hsaWdodCA9IGMuaGlnaGxpZ2h0IHx8IHRoaXMuem9vbVZpZXcuaGlnaGxpZ2h0ZWQgfHwgW107XG5cblx0Ly8gZHJhd2luZyBtb2RlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gU2V0IHRoZSBkcmF3aW5nIG1vZGUgZm9yIHRoZSBab29tVmlldy5cblx0Ly8gICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgdmFsdWVcblx0aWYgKGMuZG1vZGUgPT09ICdjb21wYXJpc29uJyB8fCBjLmRtb2RlID09PSAncmVmZXJlbmNlJykgXG5cdCAgICBjZmcuZG1vZGUgPSBjLmRtb2RlO1xuXHRlbHNlXG5cdCAgICBjZmcuZG1vZGUgPSB0aGlzLnpvb21WaWV3LmRtb2RlIHx8ICdjb21wYXJpc29uJztcblxuXHQvL1xuXHRyZXR1cm4gY2ZnO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNldHMgdGhlIGN1cnJlbnQgY29udGV4dCBmcm9tIHRoZSBjb25maWcgb2JqZWN0LiBcbiAgICAvLyBPbmx5IHRob3NlIGNvbnRleHQgaXRlbXMgc3BlY2lmaWVkIGluIHRoZSBjb25maWcgYXJlIGFmZmVjdGVkLCBleGNlcHQgYXMgbm90ZWQuXG4gICAgLy9cbiAgICAvLyBBbGwgY29uZmlncyBhcmUgc2FuaXRpemVkIGJlZm9yZSBiZWluZyBhcHBsaWVkIChzZWUgc2FuaXRpemVDZmcpLlxuICAgIC8vIFxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgYyAob2JqZWN0KSBBIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHRoYXQgc3BlY2lmaWVzIHNvbWUvYWxsIGNvbmZpZyB2YWx1ZXMuXG4gICAgLy8gICAgICAgICBUaGUgcG9zc2libGUgY29uZmlnIGl0ZW1zOlxuICAgIC8vICAgICAgICAgICAgZ2Vub21lcyAgIChsaXN0IG8gc3RyaW5ncykgQWxsIHRoZSBnZW5vbWVzIHlvdSB3YW50IHRvIHNlZSwgaW4gdG9wLXRvLWJvdHRvbSBvcmRlci4gXG4gICAgLy8gICAgICAgICAgICAgICBNYXkgdXNlIGludGVybmFsIG5hbWVzIG9yIGRpc3BsYXkgbGFiZWxzLCBlZywgXCJtdXNfbXVzY3VsdXNfMTI5czFzdmltalwiIG9yIFwiMTI5UzEvU3ZJbUpcIi5cbiAgICAvLyAgICAgICAgICAgIHJlZiAgICAgICAoc3RyaW5nKSBUaGUgZ2Vub21lIHRvIHVzZSBhcyB0aGUgcmVmZXJlbmNlLiBNYXkgYmUgbmFtZSBvciBsYWJlbC5cbiAgICAvLyAgICAgICAgICAgIGhpZ2hsaWdodCAobGlzdCBvIHN0cmluZ3MpIElEcyBvZiBmZWF0dXJlcyB0byBoaWdobGlnaHRcbiAgICAvLyAgICAgICAgICAgIGRtb2RlICAgICAoc3RyaW5nKSBlaXRoZXIgJ2NvbXBhcmlzb24nIG9yICdyZWZlcmVuY2UnXG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIENvb3JkaW5hdGVzIGFyZSBzcGVjaWZpZWQgaW4gb25lIG9mIDIgZm9ybXMuXG4gICAgLy8gICAgICAgICAgICAgIGNociAgICAgICAoc3RyaW5nKSBDaHJvbW9zb21lIGZvciBjb29yZGluYXRlIHJhbmdlXG4gICAgLy8gICAgICAgICAgICAgIHN0YXJ0ICAgICAoaW50KSBDb29yZGluYXRlIHJhbmdlIHN0YXJ0IHBvc2l0aW9uXG4gICAgLy8gICAgICAgICAgICAgIGVuZCAgICAgICAoaW50KSBDb29yZGluYXRlIHJhbmdlIGVuZCBwb3NpdGlvblxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAgIERpc3BsYXlzIHRoaXMgY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBnZW5lb21zLCBhbmQgdGhlIGVxdWl2YWxlbnQgKG1hcHBlZClcbiAgICAvLyAgICAgICAgICAgICAgY29vcmRpbmF0ZSByYW5nZShzKSBpbiBlYWNoIGNvbXBhcmlzb24gZ2Vub21lLlxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICBvcjpcbiAgICAvLyAgICAgICAgICAgICAgbGFuZG1hcmsgIChzdHJpbmcpIElELCBjYW5vbmljYWwgSUQsIG9yIHN5bWJvbCwgaWRlbnRpZnlpbmcgYSBmZWF0dXJlLlxuICAgIC8vICAgICAgICAgICAgICBmbGFua3xsZW5ndGggKGludCkgSWYgZmxhbmssIHZpZXdpbmcgcmVnaW9uIHNpemUgPSBmbGFuayArIGxlbihsYW5kbWFyaykgKyBmbGFuay4gXG4gICAgLy8gICAgICAgICAgICAgICAgIElmIGxlbmd0aCwgdmlld2luZyByZWdpb24gc2l6ZSA9IGxlbmd0aC4gSW4gZWl0aGVyIGNhc2UsIHRoZSBsYW5kbWFyayBpcyBjZW50ZXJlZCBpblxuICAgIC8vICAgICAgICAgICAgICAgICB0aGUgdmlld2luZyBhcmVhLCArLy0gYW55IHNwZWNpZmllZCBkZWx0YS5cbiAgICAvLyAgICAgICAgICAgICAgZGVsdGEgICAgIChpbnQpIEFtb3VudCBpbiBicCB0byBzaGlmdCB0aGUgcmVnaW9uIGxlZnQgKDwwKSBvciByaWdodCAoPjApLlxuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAgIERpc3BsYXlzIHRoZSByZWdpb24gYXJvdW5kIHRoZSBzcGVjaWZpZWQgbGFuZG1hcmsgaW4gZWFjaCBnZW5vbWUgd2hlcmUgaXQgZXhpc3RzLlxuICAgIC8vXG4gICAgLy8gICAgcXVpZXRseSAoYm9vbGVhbikgSWYgdHJ1ZSwgZG9uJ3QgdXBkYXRlIGJyb3dzZXIgaGlzdG9yeSAoYXMgd2hlbiBnb2luZyBiYWNrKVxuICAgIC8vXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgICBOb3RoaW5nXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vXHQgIFJlZHJhd3MgXG4gICAgLy9cdCAgQ2FsbHMgY29udGV4dENoYW5nZWQoKSBcbiAgICAvL1xuICAgIHNldENvbnRleHQgKGMsIHF1aWV0bHkpIHtcbiAgICAgICAgbGV0IGNmZyA9IHRoaXMuc2FuaXRpemVDZmcoYyk7XG5cdC8vY29uc29sZS5sb2coXCJTZXQgY29udGV4dCAocmF3KTpcIiwgYyk7XG5cdC8vY29uc29sZS5sb2coXCJTZXQgY29udGV4dCAoc2FuaXRpemVkKTpcIiwgY2ZnKTtcblx0aWYgKCFjZmcpIHJldHVybjtcblx0dGhpcy5zaG93QnVzeSh0cnVlLCAnUmVxdWVzdGluZyBkYXRhLi4uJyk7XG5cdGxldCBwID0gdGhpcy5mZWF0dXJlTWFuYWdlci5sb2FkR2Vub21lcyhjZmcuZ2Vub21lcykudGhlbigoKSA9PiB7XG5cdCAgICBpZiAoY2ZnLmNtb2RlID09PSAnbGFuZG1hcmsnKSB7XG5cdCAgICAgICAgY2ZnID0gdGhpcy5yZXNvbHZlTGFuZG1hcmsoY2ZnKTtcblx0XHRpZiAoIWNmZykge1xuXHRcdCAgICBhbGVydChcIkxhbmRtYXJrIGRvZXMgbm90IGV4aXN0IGluIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZS4gUGxlYXNlIGNoYW5nZSB0aGUgcmVmZXJlbmNlIGdlbm9tZSBhbmQgdHJ5IGFnYWluLlwiKTtcblx0XHQgICAgdGhpcy5zaG93QnVzeShmYWxzZSk7XG5cdFx0ICAgIHJldHVybjtcblx0XHR9XG5cdCAgICB9XG5cdCAgICB0aGlzLnZHZW5vbWVzID0gY2ZnLmdlbm9tZXM7XG5cdCAgICB0aGlzLnJHZW5vbWUgID0gY2ZnLnJlZjtcblx0ICAgIHRoaXMuY0dlbm9tZXMgPSBjZmcuZ2Vub21lcy5maWx0ZXIoZyA9PiBnICE9PSBjZmcucmVmKTtcblx0ICAgIHRoaXMuc2V0UmVmR2Vub21lU2VsZWN0aW9uKHRoaXMuckdlbm9tZS5uYW1lKTtcblx0ICAgIHRoaXMuc2V0Q29tcEdlbm9tZXNTZWxlY3Rpb24odGhpcy52R2Vub21lcy5tYXAoZz0+Zy5uYW1lKSk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5jbW9kZSA9IGNmZy5jbW9kZTtcblx0ICAgIC8vXG5cdCAgICByZXR1cm4gdGhpcy50cmFuc2xhdG9yLnJlYWR5KCk7XG5cdH0pLnRoZW4oKCkgPT4ge1xuXHQgICAgLy9cblx0ICAgIGlmICghY2ZnKSByZXR1cm47XG5cdCAgICB0aGlzLmNvb3JkcyAgID0ge1xuXHRcdGNocjogY2ZnLmNoci5uYW1lLFxuXHRcdGNocm9tb3NvbWU6IGNmZy5jaHIsXG5cdFx0c3RhcnQ6IGNmZy5zdGFydCxcblx0XHRlbmQ6IGNmZy5lbmRcblx0ICAgIH07XG5cdCAgICB0aGlzLmxjb29yZHMgID0ge1xuXHQgICAgICAgIGxhbmRtYXJrOiBjZmcubGFuZG1hcmssIFxuXHRcdGxhbmRtYXJrUmVmRmVhdDogY2ZnLmxhbmRtYXJrUmVmRmVhdCxcblx0XHRsYW5kbWFya0ZlYXRzOiBjZmcubGFuZG1hcmtGZWF0cyxcblx0XHRmbGFuazogY2ZnLmZsYW5rLCBcblx0XHRsZW5ndGg6IGNmZy5sZW5ndGgsIFxuXHRcdGRlbHRhOiBjZmcuZGVsdGEgXG5cdCAgICB9O1xuXHQgICAgLy9cblx0ICAgIHRoaXMuem9vbVZpZXcudXBkYXRlKGNmZyk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LnJlZHJhdygpO1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LnNldEJydXNoQ29vcmRzKHRoaXMuY29vcmRzKTtcblx0ICAgIC8vXG5cdCAgICBpZiAoIXF1aWV0bHkpXG5cdCAgICAgICAgdGhpcy5jb250ZXh0Q2hhbmdlZCgpO1xuXHQgICAgLy9cblx0ICAgIHRoaXMuc2hvd0J1c3koZmFsc2UpO1xuXHR9KTtcblx0cmV0dXJuIHA7XG4gICAgfVxuIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldENvb3JkaW5hdGVzIChzdHIpIHtcblx0bGV0IGNvb3JkcyA9IHBhcnNlQ29vcmRzKHN0cik7XG5cdGlmICghIGNvb3Jkcykge1xuXHQgICAgbGV0IGZlYXRzID0gdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5TGFiZWwoc3RyKTtcblx0ICAgIGxldCBmZWF0czIgPSBmZWF0cy5maWx0ZXIoZj0+Zi5nZW5vbWUgPT0gdGhpcy5yR2Vub21lKTtcblx0ICAgIGxldCBmID0gZmVhdHMyWzBdIHx8IGZlYXRzWzBdO1xuXHQgICAgaWYgKGYpIHtcblx0XHRjb29yZHMgPSB7XG5cdFx0ICAgIHJlZjogZi5nZW5vbWUubmFtZSxcblx0XHQgICAgbGFuZG1hcms6IHN0cixcblx0XHQgICAgZGVsdGE6IDAsXG5cdFx0ICAgIGhpZ2hsaWdodDogZi5pZFxuXHRcdH1cblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHRcdGFsZXJ0KFwiVW5hYmxlIHRvIHNldCBjb29yZGluYXRlcyB3aXRoIHRoaXMgdmFsdWU6IFwiICsgc3RyKTtcblx0XHRyZXR1cm47XG5cdCAgICB9XG5cdH1cblx0dGhpcy5zZXRDb250ZXh0KGNvb3Jkcyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVzaXplICgpIHtcblx0bGV0IHcgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDI0O1xuXHR0aGlzLmdlbm9tZVZpZXcuZml0VG9XaWR0aCh3KTtcblx0dGhpcy56b29tVmlldy5maXRUb1dpZHRoKHcpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGNvbnRleHQgYXMgYSBwYXJhbWV0ZXIgc3RyaW5nXG4gICAgLy8gQ3VycmVudCBjb250ZXh0ID0gcmVmIGdlbm9tZSArIGNvbXAgZ2Vub21lcyArIGN1cnJlbnQgcmFuZ2UgKGNocixzdGFydCxlbmQpXG4gICAgZ2V0UGFyYW1TdHJpbmcgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuICAgICAgICBsZXQgcmVmID0gYHJlZj0ke2MucmVmfWA7XG4gICAgICAgIGxldCBnZW5vbWVzID0gYGdlbm9tZXM9JHtjLmdlbm9tZXMuam9pbihcIitcIil9YDtcblx0bGV0IGNvb3JkcyA9IGBjaHI9JHtjLmNocn0mc3RhcnQ9JHtjLnN0YXJ0fSZlbmQ9JHtjLmVuZH1gO1xuXHRsZXQgbGZsZiA9IGMuZmxhbmsgPyAnJmZsYW5rPScrYy5mbGFuayA6ICcmbGVuZ3RoPScrYy5sZW5ndGg7XG5cdGxldCBsY29vcmRzID0gYGxhbmRtYXJrPSR7Yy5sYW5kbWFya30mZGVsdGE9JHtjLmRlbHRhfSR7bGZsZn1gO1xuXHRsZXQgaGxzID0gYGhpZ2hsaWdodD0ke2MuaGlnaGxpZ2h0LmpvaW4oXCIrXCIpfWA7XG5cdGxldCBkbW9kZSA9IGBkbW9kZT0ke2MuZG1vZGV9YDtcblx0cmV0dXJuIGAke3RoaXMuY21vZGU9PT0nbWFwcGVkJz9jb29yZHM6bGNvb3Jkc30mJHtkbW9kZX0mJHtyZWZ9JiR7Z2Vub21lc30mJHtobHN9YDtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRDdXJyZW50TGlzdCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJMaXN0O1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRDdXJyZW50TGlzdCAobHN0LCBnb1RvRmlyc3QpIHtcbiAgICBcdC8vXG5cdGxldCBwcmV2TGlzdCA9IHRoaXMuY3Vyckxpc3Q7XG5cdHRoaXMuY3Vyckxpc3QgPSBsc3Q7XG5cdGlmIChsc3QgIT09IHByZXZMaXN0KSB7XG5cdCAgICB0aGlzLmN1cnJMaXN0SW5kZXggPSBsc3QgPyBsc3QuaWRzLnJlZHVjZSggKHgsaSkgPT4geyB4W2ldPWk7IHJldHVybiB4OyB9LCB7fSkgOiB7fTtcblx0ICAgIHRoaXMuY3Vyckxpc3RDb3VudGVyID0gMDtcblx0fVxuXHQvL1xuXHRsZXQgbGlzdHMgPSBkMy5zZWxlY3QoJyNteWxpc3RzJykuc2VsZWN0QWxsKCcubGlzdEluZm8nKTtcblx0bGlzdHMuY2xhc3NlZChcImN1cnJlbnRcIiwgZCA9PiBkID09PSBsc3QpO1xuXHQvL1xuXHQvLyBzaG93IHRoaXMgbGlzdCBhcyB0aWNrIG1hcmtzIGluIHRoZSBnZW5vbWUgdmlld1xuXHR0aGlzLmdlbm9tZVZpZXcuZHJhd1RpY2tzKGxzdCA/IGxzdC5pZHMgOiBbXSk7XG5cdHRoaXMuZ2Vub21lVmlldy5kcmF3VGl0bGUoKTtcblx0dGhpcy56b29tVmlldy5oaWdobGlnaHQoKTtcblx0Ly9cblx0aWYgKGdvVG9GaXJzdCkgdGhpcy5nb1RvTmV4dExpc3RFbGVtZW50KCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdvVG9OZXh0TGlzdEVsZW1lbnQgKCkge1xuXHRpZiAoIXRoaXMuY3Vyckxpc3QgfHwgdGhpcy5jdXJyTGlzdC5pZHMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cdGxldCBjdXJySWQgPSB0aGlzLmN1cnJMaXN0Lmlkc1t0aGlzLmN1cnJMaXN0Q291bnRlcl07XG4gICAgICAgIHRoaXMuY3Vyckxpc3RDb3VudGVyID0gKHRoaXMuY3Vyckxpc3RDb3VudGVyICsgMSkgJSB0aGlzLmN1cnJMaXN0Lmlkcy5sZW5ndGg7XG5cdHRoaXMuc2V0Q29vcmRpbmF0ZXMoY3VycklkKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcGFuem9vbShwZmFjdG9yLCB6ZmFjdG9yKSB7XG5cdC8vXG5cdCFwZmFjdG9yICYmIChwZmFjdG9yID0gMCk7XG5cdCF6ZmFjdG9yICYmICh6ZmFjdG9yID0gMSk7XG5cdC8vXG5cdGxldCBjID0gdGhpcy5jb29yZHM7XG5cdGxldCB3aWR0aCA9IGMuZW5kIC0gYy5zdGFydCArIDE7XG5cdGxldCBtaWQgPSAoYy5zdGFydCArIGMuZW5kKS8yO1xuXHRsZXQgY2hyID0gdGhpcy5yR2Vub21lLmNocm9tb3NvbWVzLmZpbHRlcihjID0+IGMubmFtZSA9PT0gdGhpcy5jb29yZHMuY2hyKVswXTtcblx0bGV0IG5jeHQgPSB7fTsgLy8gbmV3IGNvbnRleHRcblx0bGV0IG1pbkQgPSAtKGMuc3RhcnQtMSk7IC8vIG1pbiBkZWx0YSAoYXQgY3VycmVudCB6b29tKVxuXHRsZXQgbWF4RCA9IGNoci5sZW5ndGggLSBjLmVuZDsgLy8gbWF4IGRlbHRhIChhdCBjdXJyZW50IHpvb20pXG5cdGxldCBkID0gY2xpcChwZmFjdG9yICogd2lkdGgsIG1pbkQsIG1heEQpOyAvLyBkZWx0YSAoYXQgbmV3IHpvb20pXG5cdGxldCBuZXd3aWR0aCA9IHpmYWN0b3IgKiB3aWR0aDtcblx0bGV0IG5ld3N0YXJ0ID0gbWlkIC0gbmV3d2lkdGgvMiArIGQ7XG5cdC8vXG5cdGlmICh0aGlzLmNtb2RlID09PSAnbWFwcGVkJykge1xuXHQgICAgbmN4dC5jaHIgPSBjLmNocjtcblx0ICAgIG5jeHQuc3RhcnQgPSBuZXdzdGFydDtcblx0ICAgIG5jeHQuZW5kID0gbmV3c3RhcnQgKyBuZXd3aWR0aCAtIDE7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICBuY3h0Lmxlbmd0aCA9IG5ld3dpZHRoO1xuXHQgICAgbmN4dC5kZWx0YSA9IHRoaXMubGNvb3Jkcy5kZWx0YSArIGQgO1xuXHR9XG5cdHRoaXMuc2V0Q29udGV4dChuY3h0KTtcbiAgICB9XG4gICAgem9vbSAoZmFjdG9yKSB7XG4gICAgICAgIHRoaXMucGFuem9vbShudWxsLCBmYWN0b3IpO1xuICAgIH1cbiAgICBwYW4gKGZhY3Rvcikge1xuICAgICAgICB0aGlzLnBhbnpvb20oZmFjdG9yLCBudWxsKTtcbiAgICB9XHRcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBab29tcyBpbi9vdXQgYnkgZmFjdG9yLiBOZXcgem9vbSB3aWR0aCBpcyBmYWN0b3IgKiB0aGUgY3VycmVudCB3aWR0aC5cbiAgICAvLyBGYWN0b3IgPiAxIHpvb21zIG91dCwgMCA8IGZhY3RvciA8IDEgem9vbXMgaW4uXG4gICAgeHpvb20gKGZhY3Rvcikge1xuXHRsZXQgbGVuID0gdGhpcy5jb29yZHMuZW5kIC0gdGhpcy5jb29yZHMuc3RhcnQgKyAxO1xuXHRsZXQgbmV3bGVuID0gTWF0aC5yb3VuZChmYWN0b3IgKiBsZW4pO1xuXHRsZXQgeCA9ICh0aGlzLmNvb3Jkcy5zdGFydCArIHRoaXMuY29vcmRzLmVuZCkvMjtcblx0aWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKSB7XG5cdCAgICBsZXQgbmV3c3RhcnQgPSBNYXRoLnJvdW5kKHggLSBuZXdsZW4vMik7XG5cdCAgICB0aGlzLnNldENvbnRleHQoeyBjaHI6IHRoaXMuY29vcmRzLmNociwgc3RhcnQ6IG5ld3N0YXJ0LCBlbmQ6IG5ld3N0YXJ0ICsgbmV3bGVuIC0gMSB9KTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuc2V0Q29udGV4dCh7IGxlbmd0aDogbmV3bGVuIH0pO1xuXHR9XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUGFucyB0aGUgdmlldyBsZWZ0IG9yIHJpZ2h0IGJ5IGZhY3Rvci4gVGhlIGRpc3RhbmNlIG1vdmVkIGlzIGZhY3RvciB0aW1lcyB0aGUgY3VycmVudCB6b29tIHdpZHRoLlxuICAgIC8vIE5lZ2F0aXZlIHZhbHVlcyBwYW4gbGVmdC4gUG9zaXRpdmUgdmFsdWVzIHBhbiByaWdodC4gKE5vdGUgdGhhdCBwYW5uaW5nIG1vdmVzIHRoZSBcImNhbWVyYVwiLiBQYW5uaW5nIHRvIHRoZVxuICAgIC8vIHJpZ2h0IG1ha2VzIHRoZSBvYmplY3RzIGluIHRoZSBzY2VuZSBhcHBlYXIgdG8gbW92ZSB0byB0aGUgbGVmdCwgYW5kIHZpY2UgdmVyc2EuKVxuICAgIC8vXG4gICAgeHBhbiAoZmFjdG9yKSB7XG5cdGxldCBjID0gdGhpcy5jb29yZHM7XG5cdGxldCBjaHIgPSB0aGlzLnJHZW5vbWUuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSB0aGlzLmNvb3Jkcy5jaHIpWzBdO1xuXHRsZXQgd2lkdGggPSBjLmVuZCAtIGMuc3RhcnQgKyAxO1xuXHRsZXQgbWluRCA9IC0oYy5zdGFydC0xKTtcblx0bGV0IG1heEQgPSBjaHIubGVuZ3RoIC0gYy5lbmQ7XG5cdGxldCBkID0gY2xpcChmYWN0b3IgKiB3aWR0aCwgbWluRCwgbWF4RCk7XG5cdGlmICh0aGlzLmNtb2RlID09PSAnbWFwcGVkJykge1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgY2hyOiBjLmNociwgc3RhcnQ6IGMuc3RhcnQrZCwgZW5kOiBjLmVuZCtkIH0pO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgZGVsdGE6IHRoaXMubGNvb3Jkcy5kZWx0YSArIGQgfSk7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RmVhdFR5cGVDb250cm9sIChmYWNldCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCBjb2xvcnMgPSB0aGlzLmNzY2FsZS5kb21haW4oKS5tYXAobGJsID0+IHtcblx0ICAgIHJldHVybiB7IGxibDpsYmwsIGNscjp0aGlzLmNzY2FsZShsYmwpIH07XG5cdH0pO1xuXHRsZXQgY2tlcyA9IGQzLnNlbGVjdChcIi5jb2xvcktleVwiKVxuXHQgICAgLnNlbGVjdEFsbCgnLmNvbG9yS2V5RW50cnknKVxuXHRcdC5kYXRhKGNvbG9ycyk7XG5cdGxldCBuY3MgPSBja2VzLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsIFwiY29sb3JLZXlFbnRyeSBmbGV4cm93XCIpO1xuXHRuY3MuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJzd2F0Y2hcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBjID0+IGMubGJsKVxuXHQgICAgLnN0eWxlKFwiYmFja2dyb3VuZC1jb2xvclwiLCBjID0+IGMuY2xyKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdGxldCB0ID0gZDMuc2VsZWN0KHRoaXMpO1xuXHQgICAgICAgIHQuY2xhc3NlZChcImNoZWNrZWRcIiwgISB0LmNsYXNzZWQoXCJjaGVja2VkXCIpKTtcblx0XHRsZXQgc3dhdGNoZXMgPSBkMy5zZWxlY3RBbGwoXCIuc3dhdGNoLmNoZWNrZWRcIilbMF07XG5cdFx0bGV0IGZ0cyA9IHN3YXRjaGVzLm1hcChzPT5zLmdldEF0dHJpYnV0ZShcIm5hbWVcIikpXG5cdFx0ZmFjZXQuc2V0VmFsdWVzKGZ0cyk7XG5cdFx0c2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0ICAgIH0pXG5cdCAgICAuYXBwZW5kKFwiaVwiKVxuXHQgICAgICAgIC5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zXCIpO1xuXHRuY3MuYXBwZW5kKFwic3BhblwiKVxuXHQgICAgLnRleHQoYyA9PiBjLmxibCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQ2FjaGVkRGF0YSAoYXNrKSB7XG5cdGlmICghYXNrIHx8IHdpbmRvdy5jb25maXJtKCdEZWxldGUgYWxsIGNhY2hlZCBkYXRhLiBBcmUgeW91IHN1cmU/JykpIHtcblx0ICAgIHRoaXMuZmVhdHVyZU1hbmFnZXIuY2xlYXJDYWNoZWREYXRhKCk7XG5cdCAgICB0aGlzLnRyYW5zbGF0b3IuY2xlYXJDYWNoZWREYXRhKCk7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsaW5rVG9NZ2lTbnBSZXBvcnQgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRsZXQgdXJsQmFzZSA9ICdodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvc25wL3N1bW1hcnknO1xuXHRsZXQgdGFiQXJnID0gJ3NlbGVjdGVkVGFiPTEnO1xuXHRsZXQgc2VhcmNoQnlBcmcgPSAnc2VhcmNoQnlTYW1lRGlmZj0nO1xuXHRsZXQgY2hyQXJnID0gYHNlbGVjdGVkQ2hyb21vc29tZT0ke2MuY2hyfWA7XG5cdGxldCBjb29yZEFyZyA9IGBjb29yZGluYXRlPSR7Yy5zdGFydH0tJHtjLmVuZH1gO1xuXHRsZXQgdW5pdEFyZyA9ICdjb29yZGluYXRlVW5pdD1icCc7XG5cdGxldCBjc0FyZ3MgPSBjLmdlbm9tZXMubWFwKGcgPT4gYHNlbGVjdGVkU3RyYWlucz0ke2d9YClcblx0bGV0IHJzQXJnID0gYHJlZmVyZW5jZVN0cmFpbj0ke2MucmVmfWA7XG5cdGxldCBsaW5rVXJsID0gYCR7dXJsQmFzZX0/JHt0YWJBcmd9JiR7c2VhcmNoQnlBcmd9JiR7Y2hyQXJnfSYke2Nvb3JkQXJnfSYke3VuaXRBcmd9JiR7cnNBcmd9JiR7Y3NBcmdzLmpvaW4oJyYnKX1gXG5cdHdpbmRvdy5vcGVuKGxpbmtVcmwsIFwiX2JsYW5rXCIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsaW5rVG9NZ2lRVExzICgpIHtcblx0bGV0IGMgICAgICAgID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdGxldCB1cmxCYXNlICA9ICdodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvYWxsZWxlL3N1bW1hcnknO1xuXHRsZXQgY2hyQXJnICAgPSBgY2hyb21vc29tZT0ke2MuY2hyfWA7XG5cdGxldCBjb29yZEFyZyA9IGBjb29yZGluYXRlPSR7Yy5zdGFydH0tJHtjLmVuZH1gO1xuXHRsZXQgdW5pdEFyZyAgPSAnY29vcmRVbml0PWJwJztcblx0bGV0IHR5cGVBcmcgID0gJ2FsbGVsZVR5cGU9UVRMJztcblx0bGV0IGxpbmtVcmwgID0gYCR7dXJsQmFzZX0/JHtjaHJBcmd9JiR7Y29vcmRBcmd9JiR7dW5pdEFyZ30mJHt0eXBlQXJnfWA7XG5cdHdpbmRvdy5vcGVuKGxpbmtVcmwsIFwiX2JsYW5rXCIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsaW5rVG9NZ2lKQnJvd3NlICgpIHtcblx0bGV0IGMgPSB0aGlzLmdldENvbnRleHQoKTtcblx0bGV0IHVybEJhc2UgPSAnaHR0cDovL2picm93c2UuaW5mb3JtYXRpY3MuamF4Lm9yZy8nO1xuXHRsZXQgZGF0YUFyZyA9ICdkYXRhPWRhdGElMkZtb3VzZSc7IC8vIFwiZGF0YS9tb3VzZVwiXG5cdGxldCBsb2NBcmcgID0gYGxvYz1jaHIke2MuY2hyfSUzQSR7Yy5zdGFydH0uLiR7Yy5lbmR9YDtcblx0bGV0IHRyYWNrcyAgPSBbJ0ROQScsJ01HSV9HZW5vbWVfRmVhdHVyZXMnLCdOQ0JJX0NDRFMnLCdOQ0JJJywnRU5TRU1CTCddO1xuXHRsZXQgdHJhY2tzQXJnPWB0cmFja3M9JHt0cmFja3Muam9pbignLCcpfWA7XG5cdGxldCBoaWdobGlnaHRBcmcgPSAnaGlnaGxpZ2h0PSc7XG5cdGxldCBsaW5rVXJsID0gYCR7dXJsQmFzZX0/JHsgW2RhdGFBcmcsbG9jQXJnLHRyYWNrc0FyZyxoaWdobGlnaHRBcmddLmpvaW4oJyYnKSB9YDtcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERvd25sb2FkcyBETkEgc2VxdWVuY2VzIG9mIHRoZSBzcGVjaWZpZWQgdHlwZSBpbiBGQVNUQSBmb3JtYXQgZm9yIHRoZSBzcGVjaWZpZWQgZmVhdHVyZS5cbiAgICAvLyBJZiBnZW5vbWVzIGlzIHNwZWNpZmllZCwgbGlzdHMgdGhlIHNwZWNpZmljIGdlbm9tZXMgdG8gcmV0cmlldmUgZnJvbTsgb3RoZXJ3aXNlIHJldHJpZXZlcyBmcm9tIGFsbCBnZW5vbWVzLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIGYgKG9iamVjdCkgdGhlIGZlYXR1cmVcbiAgICAvLyAgICAgdHlwZSAoc3RyaW5nKSB3aGljaCBzZXF1ZW5jZXMgdG8gZG93bmxvYWQ6ICdnZW5vbWljJywnZXhvbicsJ0NEUycsXG4gICAgLy8gICAgIGdlbm9tZXMgKGxpc3Qgb2Ygc3RyaW5ncykgbmFtZXMgb2YgZ2Vub21lcyB0byByZXRyaWV2ZSBmcm9tLiBJZiBub3Qgc3BlY2lmaWVkLFxuICAgIC8vICAgICAgICAgcmV0cmlldmVzIHNlcXVlbmVjcyBmcm9tIGFsbCBhdmFpbGFibGUgbW91c2UgZ2Vub21lcy5cbiAgICAvL1xuICAgIGRvd25sb2FkRmFzdGEgKGYsIHR5cGUsIGdlbm9tZXMpIHtcblx0bGV0IHEgPSB0aGlzLnF1ZXJ5TWFuYWdlci5hdXhEYXRhTWFuYWdlci5zZXF1ZW5jZXNGb3JGZWF0dXJlKGYsIHR5cGUsIGdlbm9tZXMpXG5cdGlmIChxKSB3aW5kb3cub3BlbihxLFwiX2JsYW5rXCIpO1xuICAgIH1cbiAgICBsaW5rVG9SZXBvcnRQYWdlIChmKSB7XG4gICAgICAgIGxldCB1ID0gdGhpcy5xdWVyeU1hbmFnZXIuYXV4RGF0YU1hbmFnZXIubGlua1RvUmVwb3J0UGFnZShmLmlkKTtcblx0d2luZG93Lm9wZW4odSwgJ19ibGFuaycpXG4gICAgfVxufSAvLyBlbmQgY2xhc3MgTUdWQXBwXG5cbmV4cG9ydCB7IE1HVkFwcCB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTUdWQXBwLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIEdlbm9tZSB7XG4gIGNvbnN0cnVjdG9yIChjZmcpIHtcbiAgICB0aGlzLm5hbWUgPSBjZmcubmFtZTtcbiAgICB0aGlzLmxhYmVsPSBjZmcubGFiZWw7XG4gICAgdGhpcy5jaHJvbW9zb21lcyA9IFtdO1xuICAgIHRoaXMubWF4bGVuID0gLTE7XG4gICAgdGhpcy54c2NhbGUgPSBudWxsO1xuICAgIHRoaXMueXNjYWxlID0gbnVsbDtcbiAgICB0aGlzLnpvb21ZICA9IC0xO1xuICB9XG4gIGdldENocm9tb3NvbWUgKG4pIHtcbiAgICAgIGlmICh0eXBlb2YobikgPT09ICdzdHJpbmcnKVxuXHQgIHJldHVybiB0aGlzLmNocm9tb3NvbWVzLmZpbHRlcihjID0+IGMubmFtZSA9PT0gbilbMF07XG4gICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIHRoaXMuY2hyb21vc29tZXNbbl07XG4gIH1cbiAgaGFzQ2hyb21vc29tZSAobikge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2hyb21vc29tZShuKSA/IHRydWUgOiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgeyBHZW5vbWUgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0dlbm9tZS5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge2QzanNvbiwgZDN0c3YsIG92ZXJsYXBzLCBzdWJ0cmFjdH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge0ZlYXR1cmV9IGZyb20gJy4vRmVhdHVyZSc7XG5pbXBvcnQge0tleVN0b3JlfSBmcm9tICcuL0tleVN0b3JlJztcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBIb3cgdGhlIGFwcCBsb2FkcyBmZWF0dXJlIGRhdGEuIFByb3ZpZGVzIHR3byBjYWxsczpcbi8vIFJlcXVlc3RzIGZlYXR1cmVzIGZyb20gdGhlIHNlcnZlciBhbmQgcmVnaXN0ZXJzIHRoZW0gaW4gYSBjYWNoZS5cbi8vIEludGVyYWN0cyB3aXRoIHRoZSBiYWNrIGVuZCB0byBsb2FkIGZlYXR1cmVzLlxuLy9cbmNsYXNzIEZlYXR1cmVNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLmlkMmZlYXQgPSB7fTtcdFx0Ly8gaW5kZXggZnJvbSAgZmVhdHVyZSBJRCB0byBmZWF0dXJlXG5cdHRoaXMuY2Fub25pY2FsMmZlYXRzID0ge307XHQvLyBpbmRleCBmcm9tIGNhbm9uaWNhbCBJRCAtPiBbIGZlYXR1cmVzIHRhZ2dlZCB3aXRoIHRoYXQgaWQgXVxuXHR0aGlzLnN5bWJvbDJmZWF0cyA9IHt9XHRcdC8vIGluZGV4IGZyb20gc3ltYm9sIC0+IFsgZmVhdHVyZXMgaGF2aW5nIHRoYXQgc3ltYm9sIF1cblx0XHRcdFx0XHQvLyB3YW50IGNhc2UgaW5zZW5zaXRpdmUgc2VhcmNoZXMsIHNvIGtleXMgYXJlIGxvd2VyIGNhc2VkXG5cdHRoaXMuY2FjaGUgPSB7fTtcdFx0Ly8ge2dlbm9tZS5uYW1lIC0+IHtjaHIubmFtZSAtPiBsaXN0IG9mIGJsb2Nrc319XG5cdHRoaXMubWluZUZlYXR1cmVDYWNoZSA9IHt9O1x0Ly8gYXV4aWxpYXJ5IGluZm8gcHVsbGVkIGZyb20gTW91c2VNaW5lIFxuXHR0aGlzLmxvYWRlZEdlbm9tZXMgPSBuZXcgU2V0KCk7IC8vIHRoZSBzZXQgb2YgR2Vub21lcyB0aGF0IGhhdmUgYmVlbiBmdWxseSBsb2FkZWRcblx0Ly9cblx0dGhpcy5mU3RvcmUgPSBuZXcgS2V5U3RvcmUoJ2ZlYXR1cmVzJyk7IC8vIG1hcHMgZ2Vub21lIG5hbWUgLT4gbGlzdCBvZiBmZWF0dXJlc1xuICAgIH1cbiBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBwcm9jZXNzRmVhdHVyZSAoZ2Vub21lLCBkKSB7XG5cdC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IHRoaXMgb25lIGluIHRoZSBjYWNoZSwgcmV0dXJuIGl0LlxuXHRsZXQgZiA9IHRoaXMuaWQyZmVhdFtkLklEXTtcblx0aWYgKGYpIHJldHVybiBmO1xuXHQvLyBDcmVhdGUgYSBuZXcgRmVhdHVyZVxuXHRmID0gbmV3IEZlYXR1cmUoZCk7XG5cdGYuZ2Vub21lID0gZ2Vub21lXG5cdC8vIFJlZ2lzdGVyIGl0LlxuXHR0aGlzLmlkMmZlYXRbZi5JRF0gPSBmO1xuXHQvLyBnZW5vbWUgY2FjaGVcblx0bGV0IGdjID0gdGhpcy5jYWNoZVtnZW5vbWUubmFtZV0gPSAodGhpcy5jYWNoZVtnZW5vbWUubmFtZV0gfHwge30pO1xuXHQvLyBjaHJvbW9zb21lIGNhY2hlICh3L2luIGdlbm9tZSlcblx0bGV0IGNjID0gZ2NbZi5jaHJdID0gKGdjW2YuY2hyXSB8fCBbXSk7XG5cdGNjLnB1c2goZik7XG5cdC8vXG5cdGlmIChmLmNhbm9uaWNhbCAmJiBmLmNhbm9uaWNhbCAhPT0gJy4nKSB7XG5cdCAgICBsZXQgbHN0ID0gdGhpcy5jYW5vbmljYWwyZmVhdHNbZi5jYW5vbmljYWxdID0gKHRoaXMuY2Fub25pY2FsMmZlYXRzW2YuY2Fub25pY2FsXSB8fCBbXSk7XG5cdCAgICBsc3QucHVzaChmKTtcblx0fVxuXHRpZiAoZi5zeW1ib2wgJiYgZi5zeW1ib2wgIT09ICcuJykge1xuXHQgICAgbGV0IHMgPSBmLnN5bWJvbC50b0xvd2VyQ2FzZSgpO1xuXHQgICAgbGV0IGxzdCA9IHRoaXMuc3ltYm9sMmZlYXRzW3NdID0gKHRoaXMuc3ltYm9sMmZlYXRzW3NdIHx8IFtdKTtcblx0ICAgIGxzdC5wdXNoKGYpO1xuXHR9XG5cdC8vIGhlcmUgeSdnby5cblx0cmV0dXJuIGY7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUHJvY2Vzc2VzIHRoZSBcInJhd1wiIGZlYXR1cmVzIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgLy8gVHVybnMgdGhlbSBpbnRvIEZlYXR1cmUgb2JqZWN0cyBhbmQgcmVnaXN0ZXJzIHRoZW0uXG4gICAgLy8gSWYgdGhlIHNhbWUgcmF3IGZlYXR1cmUgaXMgcmVnaXN0ZXJlZCBhZ2FpbixcbiAgICAvLyB0aGUgRmVhdHVyZSBvYmplY3QgY3JlYXRlZCB0aGUgZmlyc3QgdGltZSBpcyByZXR1cm5lZC5cbiAgICAvLyAoSS5lLiwgcmVnaXN0ZXJpbmcgdGhlIHNhbWUgZmVhdHVyZSBtdWx0aXBsZSB0aW1lcyBpcyBvaylcbiAgICAvL1xuICAgIHByb2Nlc3NGZWF0dXJlcyAoZ2Vub21lLCBmZWF0cykge1xuXHRmZWF0cy5zb3J0KCAoYSxiKSA9PiB7XG5cdCAgICBpZiAoYS5jaHIgPCBiLmNocilcblx0XHRyZXR1cm4gLTE7XG5cdCAgICBlbHNlIGlmIChhLmNociA+IGIuY2hyKVxuXHRcdHJldHVybiAxO1xuXHQgICAgZWxzZVxuXHRcdHJldHVybiBhLnN0YXJ0IC0gYi5zdGFydDtcblx0fSk7XG5cdHRoaXMuZlN0b3JlLnNldChnZW5vbWUubmFtZSwgZmVhdHMpO1xuXHRyZXR1cm4gZmVhdHMubWFwKGQgPT4gdGhpcy5wcm9jZXNzRmVhdHVyZShnZW5vbWUsIGQpKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBlbnN1cmVGZWF0dXJlc0J5R2Vub21lIChnZW5vbWUpIHtcblx0aWYgKHRoaXMubG9hZGVkR2Vub21lcy5oYXMoZ2Vub21lKSlcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG5cdHJldHVybiB0aGlzLmZTdG9yZS5nZXQoZ2Vub21lLm5hbWUpLnRoZW4oZGF0YSA9PiB7XG5cdCAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0Y29uc29sZS5sb2coXCJSZXF1ZXN0aW5nOlwiLCBnZW5vbWUubmFtZSwgKTtcblx0XHRsZXQgdXJsID0gYC4vZGF0YS9nZW5vbWVkYXRhLyR7Z2Vub21lLm5hbWV9LWZlYXR1cmVzLnRzdmA7XG5cdFx0cmV0dXJuIGQzdHN2KHVybCkudGhlbiggZmVhdHMgPT4ge1xuXHRcdCAgICBmZWF0cyA9IHRoaXMucHJvY2Vzc0ZlYXR1cmVzKGdlbm9tZSwgZmVhdHMpO1xuXHRcdH0pO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0Y29uc29sZS5sb2coXCJGb3VuZCBpbiBjYWNoZTpcIiwgZ2Vub21lLm5hbWUsICk7XG5cdFx0bGV0IGZlYXRzID0gdGhpcy5wcm9jZXNzRmVhdHVyZXMoZ2Vub21lLCBkYXRhKTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0ICAgIH1cblx0fSkudGhlbiggKCk9PiB7XG5cdCAgICB0aGlzLmxvYWRlZEdlbm9tZXMuYWRkKGdlbm9tZSk7ICBcblx0ICAgIHRoaXMuYXBwLnNob3dTdGF0dXMoYExvYWRlZDogJHtnZW5vbWUubmFtZX1gKTtcblx0ICAgIHJldHVybiB0cnVlOyBcblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIGFsbCB0aGUgZXhvbnMgb2YgYWxsIGdlbmVzIHRoYXQgb3ZlcmxhcCB0aGUgZ2l2ZW4gcmFuZ2VcbiAgICAvLyBpbiB0aGUgZ2l2ZW4gZ2Vub21lLlxuICAgIGVuc3VyZUV4b25zQnlSYW5nZSAoZ2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQpIHtcblx0bGV0IGVwID0gdGhpcy5hcHAuYXV4RGF0YU1hbmFnZXIuZXhvbnNCeVJhbmdlKGdlbm9tZSwgY2hyLCBzdGFydCwgZW5kKTtcblxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxvYWRHZW5vbWVzIChnZW5vbWVzKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChnZW5vbWVzLm1hcChnID0+IHRoaXMuZW5zdXJlRmVhdHVyZXNCeUdlbm9tZSAoZykpKS50aGVuKCgpPT50cnVlKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRDYWNoZWRGZWF0dXJlcyAoZ2Vub21lLCByYW5nZSkge1xuICAgICAgICBsZXQgZ2MgPSB0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXSA7XG5cdGlmICghZ2MpIHJldHVybiBbXTtcblx0bGV0IGNGZWF0cyA9IGdjW3JhbmdlLmNocl07XG5cdGlmICghY0ZlYXRzKSByZXR1cm4gW107XG5cdGxldCBmZWF0cyA9IGNGZWF0cy5maWx0ZXIoY2YgPT4gb3ZlcmxhcHMoY2YsIHJhbmdlKSk7XG4gICAgICAgIHJldHVybiBmZWF0cztcdFxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYWxsIGNhY2hlZCBmZWF0dXJlcyBoYXZpbmcgdGhlIGdpdmVuIGNhbm9uaWNhbCBpZC5cbiAgICBnZXRDYWNoZWRGZWF0dXJlQnlJZCAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQyZmVhdHNbaWRdO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYWxsIGNhY2hlZCBmZWF0dXJlcyBoYXZpbmcgdGhlIGdpdmVuIGNhbm9uaWNhbCBpZC5cbiAgICBnZXRDYWNoZWRGZWF0dXJlc0J5Q2Fub25pY2FsSWQgKGNpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW5vbmljYWwyZmVhdHNbY2lkXSB8fCBbXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgbGlzdCBvZiBmZWF0dXJlcyB0aGF0IG1hdGNoIHRoZSBnaXZlbiBsYWJlbCwgd2hpY2ggY2FuIGJlIGFuIGlkLCBjYW5vbmljYWwgaWQsIG9yIHN5bWJvbC5cbiAgICAvLyBJZiBnZW5vbWUgaXMgc3BlY2lmaWVkLCBsaW1pdCByZXN1bHRzIHRvIGZlYXR1cmVzIGZyb20gdGhhdCBnZW5vbWUuXG4gICAgLy8gXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsIChsYWJlbCwgZ2Vub21lKSB7XG5cdGxldCBmID0gdGhpcy5pZDJmZWF0W2xhYmVsXVxuXHRsZXQgZmVhdHMgPSBmID8gW2ZdIDogdGhpcy5jYW5vbmljYWwyZmVhdHNbbGFiZWxdIHx8IHRoaXMuc3ltYm9sMmZlYXRzW2xhYmVsLnRvTG93ZXJDYXNlKCldIHx8IFtdO1xuXHRyZXR1cm4gZ2Vub21lID8gZmVhdHMuZmlsdGVyKGY9PiBmLmdlbm9tZSA9PT0gZ2Vub21lKSA6IGZlYXRzO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgZmVhdHVyZXMgaW4gXG4gICAgLy8gdGhlIHNwZWNpZmllZCByYW5nZXMgb2YgdGhlIHNwZWNpZmllZCBnZW5vbWUuXG4gICAgZ2V0RmVhdHVyZXMgKGdlbm9tZSwgcmFuZ2VzKSB7XG5cdHJldHVybiB0aGlzLmVuc3VyZUZlYXR1cmVzQnlHZW5vbWUoZ2Vub21lKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmFuZ2VzLmZvckVhY2goIHIgPT4ge1xuXHQgICAgICAgIHIuZmVhdHVyZXMgPSB0aGlzLmdldENhY2hlZEZlYXR1cmVzKGdlbm9tZSwgcikgXG5cdFx0ci5nZW5vbWUgPSBnZW5vbWU7XG5cdCAgICB9KTtcblx0ICAgIHJldHVybiB7IGdlbm9tZSwgYmxvY2tzOnJhbmdlcyB9O1xuXHR9LmJpbmQodGhpcykpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIGZlYXR1cmVzIGhhdmluZyB0aGUgc3BlY2lmaWVkIGlkcyBmcm9tIHRoZSBzcGVjaWZpZWQgZ2Vub21lLlxuICAgIGdldEZlYXR1cmVzQnlJZCAoZ2Vub21lLCBpZHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5zdXJlRmVhdHVyZXNCeUdlbm9tZShnZW5vbWUpLnRoZW4oICgpID0+IHtcblx0ICAgIGxldCBmZWF0cyA9IFtdO1xuXHQgICAgbGV0IHNlZW4gPSBuZXcgU2V0KCk7XG5cdCAgICBsZXQgYWRkZiA9IChmKSA9PiB7XG5cdFx0aWYgKGYuZ2Vub21lICE9PSBnZW5vbWUpIHJldHVybjtcblx0XHRpZiAoc2Vlbi5oYXMoZi5pZCkpIHJldHVybjtcblx0XHRzZWVuLmFkZChmLmlkKTtcblx0XHRmZWF0cy5wdXNoKGYpO1xuXHQgICAgfTtcblx0ICAgIGxldCBhZGQgPSAoZikgPT4ge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGYpKSBcblx0XHQgICAgZi5mb3JFYWNoKGZmID0+IGFkZGYoZmYpKTtcblx0XHRlbHNlXG5cdFx0ICAgIGFkZGYoZik7XG5cdCAgICB9O1xuXHQgICAgZm9yIChsZXQgaSBvZiBpZHMpe1xuXHRcdGxldCBmID0gdGhpcy5jYW5vbmljYWwyZmVhdHNbaV0gfHwgdGhpcy5pZDJmZWF0W2ldO1xuXHRcdGYgJiYgYWRkKGYpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZlYXRzO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJDYWNoZWREYXRhICgpIHtcblx0Y29uc29sZS5sb2coXCJGZWF0dXJlTWFuYWdlcjogQ2FjaGUgY2xlYXJlZC5cIilcbiAgICAgICAgcmV0dXJuIHRoaXMuZlN0b3JlLmNsZWFyKCk7XG4gICAgfVxuXG59IC8vIGVuZCBjbGFzcyBGZWF0dXJlIE1hbmFnZXJcblxuZXhwb3J0IHsgRmVhdHVyZU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZlYXR1cmVNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIFN0b3JlIHtcclxuICAgIGNvbnN0cnVjdG9yKGRiTmFtZSA9ICdrZXl2YWwtc3RvcmUnLCBzdG9yZU5hbWUgPSAna2V5dmFsJykge1xyXG4gICAgICAgIHRoaXMuc3RvcmVOYW1lID0gc3RvcmVOYW1lO1xyXG4gICAgICAgIHRoaXMuX2RicCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb3BlbnJlcSA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSwgMSk7XHJcbiAgICAgICAgICAgIG9wZW5yZXEub25lcnJvciA9ICgpID0+IHJlamVjdChvcGVucmVxLmVycm9yKTtcclxuICAgICAgICAgICAgb3BlbnJlcS5vbnN1Y2Nlc3MgPSAoKSA9PiByZXNvbHZlKG9wZW5yZXEucmVzdWx0KTtcclxuICAgICAgICAgICAgLy8gRmlyc3QgdGltZSBzZXR1cDogY3JlYXRlIGFuIGVtcHR5IG9iamVjdCBzdG9yZVxyXG4gICAgICAgICAgICBvcGVucmVxLm9udXBncmFkZW5lZWRlZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIG9wZW5yZXEucmVzdWx0LmNyZWF0ZU9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBfd2l0aElEQlN0b3JlKHR5cGUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RicC50aGVuKGRiID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbih0aGlzLnN0b3JlTmFtZSwgdHlwZSk7XHJcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uY29tcGxldGUgPSAoKSA9PiByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uYWJvcnQgPSB0cmFuc2FjdGlvbi5vbmVycm9yID0gKCkgPT4gcmVqZWN0KHRyYW5zYWN0aW9uLmVycm9yKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sodHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodGhpcy5zdG9yZU5hbWUpKTtcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbn1cclxubGV0IHN0b3JlO1xyXG5mdW5jdGlvbiBnZXREZWZhdWx0U3RvcmUoKSB7XHJcbiAgICBpZiAoIXN0b3JlKVxyXG4gICAgICAgIHN0b3JlID0gbmV3IFN0b3JlKCk7XHJcbiAgICByZXR1cm4gc3RvcmU7XHJcbn1cclxuZnVuY3Rpb24gZ2V0KGtleSwgc3RvcmUgPSBnZXREZWZhdWx0U3RvcmUoKSkge1xyXG4gICAgbGV0IHJlcTtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkb25seScsIHN0b3JlID0+IHtcclxuICAgICAgICByZXEgPSBzdG9yZS5nZXQoa2V5KTtcclxuICAgIH0pLnRoZW4oKCkgPT4gcmVxLnJlc3VsdCk7XHJcbn1cclxuZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUsIHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkd3JpdGUnLCBzdG9yZSA9PiB7XHJcbiAgICAgICAgc3RvcmUucHV0KHZhbHVlLCBrZXkpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gZGVsKGtleSwgc3RvcmUgPSBnZXREZWZhdWx0U3RvcmUoKSkge1xyXG4gICAgcmV0dXJuIHN0b3JlLl93aXRoSURCU3RvcmUoJ3JlYWR3cml0ZScsIHN0b3JlID0+IHtcclxuICAgICAgICBzdG9yZS5kZWxldGUoa2V5KTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGNsZWFyKHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkd3JpdGUnLCBzdG9yZSA9PiB7XHJcbiAgICAgICAgc3RvcmUuY2xlYXIoKTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGtleXMoc3RvcmUgPSBnZXREZWZhdWx0U3RvcmUoKSkge1xyXG4gICAgY29uc3Qga2V5cyA9IFtdO1xyXG4gICAgcmV0dXJuIHN0b3JlLl93aXRoSURCU3RvcmUoJ3JlYWRvbmx5Jywgc3RvcmUgPT4ge1xyXG4gICAgICAgIC8vIFRoaXMgd291bGQgYmUgc3RvcmUuZ2V0QWxsS2V5cygpLCBidXQgaXQgaXNuJ3Qgc3VwcG9ydGVkIGJ5IEVkZ2Ugb3IgU2FmYXJpLlxyXG4gICAgICAgIC8vIEFuZCBvcGVuS2V5Q3Vyc29yIGlzbid0IHN1cHBvcnRlZCBieSBTYWZhcmkuXHJcbiAgICAgICAgKHN0b3JlLm9wZW5LZXlDdXJzb3IgfHwgc3RvcmUub3BlbkN1cnNvcikuY2FsbChzdG9yZSkub25zdWNjZXNzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBrZXlzLnB1c2godGhpcy5yZXN1bHQua2V5KTtcclxuICAgICAgICAgICAgdGhpcy5yZXN1bHQuY29udGludWUoKTtcclxuICAgICAgICB9O1xyXG4gICAgfSkudGhlbigoKSA9PiBrZXlzKTtcclxufVxuXG5leHBvcnQgeyBTdG9yZSwgZ2V0LCBzZXQsIGRlbCwgY2xlYXIsIGtleXMgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2lkYi1rZXl2YWwvZGlzdC9pZGIta2V5dmFsLm1qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgaW5pdE9wdExpc3QgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IEF1eERhdGFNYW5hZ2VyIH0gZnJvbSAnLi9BdXhEYXRhTWFuYWdlcic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTm90IHN1cmUgd2hlcmUgdGhpcyBzaG91bGQgZ29cbmxldCBzZWFyY2hUeXBlcyA9IFt7XG4gICAgbWV0aG9kOiBcImZlYXR1cmVzQnlQaGVub3R5cGVcIixcbiAgICBsYWJlbDogXCIuLi5ieSBwaGVub3R5cGUgb3IgZGlzZWFzZVwiLFxuICAgIHRlbXBsYXRlOiBcIlwiLFxuICAgIHBsYWNlaG9sZGVyOiBcIlBoZW5vL2Rpc2Vhc2UgKE1QL0RPKSB0ZXJtIG9yIElEc1wiXG59LHtcbiAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeUZ1bmN0aW9uXCIsXG4gICAgbGFiZWw6IFwiLi4uYnkgY2VsbHVsYXIgZnVuY3Rpb25cIixcbiAgICB0ZW1wbGF0ZTogXCJcIixcbiAgICBwbGFjZWhvbGRlcjogXCJHZW5lIE9udG9sb2d5IChHTykgdGVybXMgb3IgSURzXCJcbn0se1xuICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5UGF0aHdheVwiLFxuICAgIGxhYmVsOiBcIi4uLmJ5IHBhdGh3YXlcIixcbiAgICB0ZW1wbGF0ZTogXCJcIixcbiAgICBwbGFjZWhvbGRlcjogXCJSZWFjdG9tZSBwYXRod2F5cyBuYW1lcywgSURzXCJcbn0se1xuICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5SWRcIixcbiAgICBsYWJlbDogXCIuLi5ieSBzeW1ib2wvSURcIixcbiAgICB0ZW1wbGF0ZTogXCJcIixcbiAgICBwbGFjZWhvbGRlcjogXCJNR0kgbmFtZXMsIHN5bm9ueW1zLCBldGMuXCJcbn1dO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBRdWVyeU1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMuY2ZnID0gc2VhcmNoVHlwZXM7XG5cdHRoaXMuYXV4RGF0YU1hbmFnZXIgPSBuZXcgQXV4RGF0YU1hbmFnZXIoKTtcblx0dGhpcy5zZWxlY3QgPSBudWxsO1x0Ly8gbXkgPHNlbGVjdD4gZWxlbWVudFxuXHR0aGlzLnRlcm0gPSBudWxsO1x0Ly8gbXkgPGlucHV0PiBlbGVtZW50XG5cdHRoaXMuaW5pdERvbSgpO1xuICAgIH1cbiAgICBpbml0RG9tICgpIHtcblx0dGhpcy5zZWxlY3QgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInNlYXJjaHR5cGVcIl0nKTtcblx0dGhpcy50ZXJtICAgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInNlYXJjaHRlcm1cIl0nKTtcblx0Ly9cblx0dGhpcy50ZXJtLmF0dHIoXCJwbGFjZWhvbGRlclwiLCB0aGlzLmNmZ1swXS5wbGFjZWhvbGRlcilcblx0aW5pdE9wdExpc3QodGhpcy5zZWxlY3RbMF1bMF0sIHRoaXMuY2ZnLCBjPT5jLm1ldGhvZCwgYz0+Yy5sYWJlbCk7XG5cdC8vIFdoZW4gdXNlciBjaGFuZ2VzIHRoZSBxdWVyeSB0eXBlIChzZWxlY3RvciksIGNoYW5nZSB0aGUgcGxhY2Vob2xkZXIgdGV4dC5cblx0dGhpcy5zZWxlY3Qub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xuXHQgICAgbGV0IG9wdCA9IHRoaXMuc2VsZWN0LnByb3BlcnR5KFwic2VsZWN0ZWRPcHRpb25zXCIpWzBdO1xuXHQgICAgdGhpcy50ZXJtLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBvcHQuX19kYXRhX18ucGxhY2Vob2xkZXIpXG5cdCAgICBcblx0fSk7XG5cdC8vIFdoZW4gdXNlciBlbnRlcnMgYSBzZWFyY2ggdGVybSwgcnVuIGEgcXVlcnlcblx0dGhpcy50ZXJtLm9uKFwiY2hhbmdlXCIsICgpID0+IHtcblx0ICAgIGxldCB0ZXJtID0gdGhpcy50ZXJtLnByb3BlcnR5KFwidmFsdWVcIik7XG5cdCAgICB0aGlzLnRlcm0ucHJvcGVydHkoXCJ2YWx1ZVwiLFwiXCIpO1xuXHQgICAgbGV0IHNlYXJjaFR5cGUgID0gdGhpcy5zZWxlY3QucHJvcGVydHkoXCJ2YWx1ZVwiKTtcblx0ICAgIGxldCBsc3ROYW1lID0gdGVybTtcblx0ICAgIGQzLnNlbGVjdChcIiNteWxpc3RzXCIpLmNsYXNzZWQoXCJidXN5XCIsdHJ1ZSk7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdCAgICB0aGlzLmF1eERhdGFNYW5hZ2VyW3NlYXJjaFR5cGVdKHRlcm0pXHQvLyA8LSBydW4gdGhlIHF1ZXJ5XG5cdCAgICAgIC50aGVuKGZlYXRzID0+IHtcblx0XHQgIC8vIEZJWE1FIC0gcmVhY2hvdmVyIC0gdGhpcyB3aG9sZSBoYW5kbGVyXG5cdFx0ICBsZXQgbHN0ID0gdGhpcy5hcHAubGlzdE1hbmFnZXIuY3JlYXRlTGlzdChsc3ROYW1lLCBmZWF0cy5tYXAoZiA9PiBmLnByaW1hcnlJZGVudGlmaWVyKSlcblx0XHQgIHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZShsc3QpO1xuXHRcdCAgLy9cblx0XHQgIHRoaXMuYXBwLnpvb21WaWV3LmhpRmVhdHMgPSB7fTtcblx0XHQgIGZlYXRzLmZvckVhY2goZiA9PiB0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzW2YuY2Fub25pY2FsXSA9IGYuY2Fub25pY2FsKTtcblx0XHQgIHRoaXMuYXBwLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHRcdCAgLy9cblx0XHQgIHRoaXMuYXBwLnNldEN1cnJlbnRMaXN0KGxzdCx0cnVlKTtcblx0XHQgIC8vXG5cdFx0ICBkMy5zZWxlY3QoXCIjbXlsaXN0c1wiKS5jbGFzc2VkKFwiYnVzeVwiLGZhbHNlKTtcblx0ICAgICAgfSk7XG5cdH0pXG4gICAgfVxufVxuXG5leHBvcnQgeyBRdWVyeU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1F1ZXJ5TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgZDNqc29uLCBkM3RleHQgfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUaGlzIGJlbG9uZ3MgaW4gYSBjb25maWcgYnV0IGZvciBub3cuLi5cbmxldCBNb3VzZU1pbmUgPSAndGVzdCc7IC8vIG9uZSBvZjogcHVibGljLCB0ZXN0LCBkZXZcblxubGV0IE1JTkVTID0ge1xuICAgICdkZXYnIDogJ2h0dHA6Ly9iaG1naW1tLWRldjo4MDgwL21vdXNlbWluZScsXG4gICAgJ3Rlc3QnOiAnaHR0cDovL3Rlc3QubW91c2VtaW5lLm9yZy9tb3VzZW1pbmUnLFxuICAgICdwdWJsaWMnIDogJ2h0dHA6Ly93d3cubW91c2VtaW5lLm9yZy9tb3VzZW1pbmUnLFxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBdXhEYXRhTWFuYWdlciAtIGtub3dzIGhvdyB0byBxdWVyeSBhbiBleHRlcm5hbCBzb3VyY2UgKGkuZS4sIE1vdXNlTWluZSkgZm9yIGdlbmVzXG4vLyBhbm5vdGF0ZWQgdG8gZGlmZmVyZW50IG9udG9sb2dpZXMgYW5kIGZvciBleG9ucyBhc3NvY2lhdGVkIHdpdGggc3BlY2lmaWMgZ2VuZXMgb3IgcmVnaW9ucy5cbmNsYXNzIEF1eERhdGFNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG5cdGlmICghTUlORVNbTW91c2VNaW5lXSkgXG5cdCAgICB0aHJvdyBcIlVua25vd24gbWluZSBuYW1lOiBcIiArIE1vdXNlTWluZTtcblx0dGhpcy5iYXNlVXJsID0gTUlORVNbTW91c2VNaW5lXTtcblx0Y29uc29sZS5sb2coXCJNb3VzZU1pbmUgdXJsOlwiLCB0aGlzLmJhc2VVcmwpO1xuICAgICAgICB0aGlzLnFVcmwgPSB0aGlzLmJhc2VVcmwgKyAnL3NlcnZpY2UvcXVlcnkvcmVzdWx0cz8nO1xuXHR0aGlzLnJVcmwgPSB0aGlzLmJhc2VVcmwgKyAnL3BvcnRhbC5kbz9jbGFzcz1TZXF1ZW5jZUZlYXR1cmUmZXh0ZXJuYWxpZHM9J1xuXHR0aGlzLmZhVXJsID0gdGhpcy5iYXNlVXJsICsgJy9zZXJ2aWNlL3F1ZXJ5L3Jlc3VsdHMvZmFzdGE/JztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0QXV4RGF0YSAocSwgZm9ybWF0KSB7XG5cdGNvbnNvbGUubG9nKCdRdWVyeTogJyArIHEpO1xuXHRmb3JtYXQgPSBmb3JtYXQgfHwgJ2pzb25vYmplY3RzJztcblx0bGV0IHF1ZXJ5ID0gZW5jb2RlVVJJQ29tcG9uZW50KHEpO1xuXHRsZXQgdXJsID0gdGhpcy5xVXJsICsgYGZvcm1hdD0ke2Zvcm1hdH0mcXVlcnk9JHtxdWVyeX1gO1xuXHRyZXR1cm4gZDNqc29uKHVybCkudGhlbihkYXRhID0+IGRhdGEucmVzdWx0c3x8W10pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlzSWRlbnRpZmllciAocSkge1xuICAgICAgICBsZXQgcHRzID0gcS5zcGxpdCgnOicpO1xuICAgICAgICBpZiAocHRzLmxlbmd0aCA9PT0gMiAmJiBwdHNbMV0ubWF0Y2goL15bMC05XSskLykpXG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0aWYgKHEudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKCdyLW1tdS0nKSlcblx0ICAgIHJldHVybiB0cnVlO1xuXHRyZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGFkZFdpbGRjYXJkcyAocSkge1xuICAgICAgICByZXR1cm4gKHRoaXMuaXNJZGVudGlmaWVyKHEpIHx8IHEuaW5kZXhPZignKicpPj0wKSA/IHEgOiBgKiR7cX0qYDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gZG8gYSBMT09LVVAgcXVlcnkgZm9yIFNlcXVlbmNlRmVhdHVyZXMgZnJvbSBNb3VzZU1pbmVcbiAgICBmZWF0dXJlc0J5TG9va3VwIChxcnlTdHJpbmcpIHtcblx0bGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICAgIHZpZXc9XCJTZXF1ZW5jZUZlYXR1cmUucHJpbWFyeUlkZW50aWZpZXIgU2VxdWVuY2VGZWF0dXJlLnN5bWJvbFwiIFxuXHQgICAgY29uc3RyYWludExvZ2ljPVwiQSBhbmQgQiBhbmQgQ1wiPlxuXHRcdDxjb25zdHJhaW50IGNvZGU9XCJBXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZVwiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdFx0PGNvbnN0cmFpbnQgY29kZT1cIkJcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9yZ2FuaXNtLnRheG9uSWRcIiBvcD1cIj1cIiB2YWx1ZT1cIjEwMDkwXCIvPlxuXHRcdDxjb25zdHJhaW50IGNvZGU9XCJDXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5zZXF1ZW5jZU9udG9sb2d5VGVybS5uYW1lXCIgb3A9XCIhPVwiIHZhbHVlPVwidHJhbnNnZW5lXCIvPlxuXHQgICAgPC9xdWVyeT5gO1xuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmZWF0dXJlc0J5T250b2xvZ3lUZXJtIChxcnlTdHJpbmcsIHRlcm1UeXBlcykge1xuXHRxcnlTdHJpbmcgPSB0aGlzLmFkZFdpbGRjYXJkcyhxcnlTdHJpbmcpO1xuICAgICAgICBsZXQgcSA9IGA8cXVlcnkgbmFtZT1cIlwiIG1vZGVsPVwiZ2Vub21pY1wiIFxuXHQgIHZpZXc9XCJTZXF1ZW5jZUZlYXR1cmUucHJpbWFyeUlkZW50aWZpZXIgU2VxdWVuY2VGZWF0dXJlLnN5bWJvbFwiIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEIgYW5kIEMgYW5kIERcIj5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9udG9sb2d5QW5ub3RhdGlvbnMub250b2xvZ3lUZXJtLnBhcmVudHNcIiBvcD1cIkxPT0tVUFwiIHZhbHVlPVwiJHtxcnlTdHJpbmd9XCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiQlwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub3JnYW5pc20udGF4b25JZFwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJDXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5zZXF1ZW5jZU9udG9sb2d5VGVybS5uYW1lXCIgb3A9XCIhPVwiIHZhbHVlPVwidHJhbnNnZW5lXCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiRFwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm0ub250b2xvZ3kubmFtZVwiIG9wPVwiT05FIE9GXCI+XG5cdFx0ICAkeyB0ZXJtVHlwZXMubWFwKHR0PT4gJzx2YWx1ZT4nK3R0Kyc8L3ZhbHVlPicpLmpvaW4oJycpIH1cblx0ICAgICAgPC9jb25zdHJhaW50PlxuXHQgIDwvcXVlcnk+YFxuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmZWF0dXJlc0J5UGF0aHdheVRlcm0gKHFyeVN0cmluZykge1xuXHRxcnlTdHJpbmcgPSB0aGlzLmFkZFdpbGRjYXJkcyhxcnlTdHJpbmcpO1xuICAgICAgICBsZXQgcSA9IGA8cXVlcnkgbmFtZT1cIlwiIG1vZGVsPVwiZ2Vub21pY1wiIFxuXHQgIHZpZXc9XCJHZW5lLnByaW1hcnlJZGVudGlmaWVyIEdlbmUuc3ltYm9sXCIgY29uc3RyYWludExvZ2ljPVwiQSBhbmQgQlwiPlxuXHQgICAgICA8Y29uc3RyYWludCBwYXRoPVwiR2VuZS5wYXRod2F5c1wiIGNvZGU9XCJBXCIgb3A9XCJMT09LVVBcIiB2YWx1ZT1cIiR7cXJ5U3RyaW5nfVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkdlbmUub3JnYW5pc20udGF4b25JZFwiIGNvZGU9XCJCXCIgb3A9XCI9XCIgdmFsdWU9XCIxMDA5MFwiLz5cblx0ICA8L3F1ZXJ5PmA7XG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZlYXR1cmVzQnlJZCAgICAgICAgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5TG9va3VwKHFyeVN0cmluZyk7IH1cbiAgICBmZWF0dXJlc0J5RnVuY3Rpb24gIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeU9udG9sb2d5VGVybShxcnlTdHJpbmcsIFtcIkdlbmUgT250b2xvZ3lcIl0pOyB9XG4gICAgZmVhdHVyZXNCeVBoZW5vdHlwZSAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBbXCJNYW1tYWxpYW4gUGhlbm90eXBlXCIsXCJEaXNlYXNlIE9udG9sb2d5XCJdKTsgfVxuICAgIGZlYXR1cmVzQnlQYXRod2F5ICAgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5UGF0aHdheVRlcm0ocXJ5U3RyaW5nKTsgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIGZvciBhbGwgZXhvbnMgb2YgZmVhdHVyZXMgb3ZlcmxhcHBpbmcgYSBzcGVjaWZpZWQgcmFuZ2UgaW4gdGhlIHNwZWNpZmVkIGdlbm9tZS5cbiAgICBleG9uc0J5UmFuZ2VcdChnZW5vbWUsIGNociwgc3RhcnQsIGVuZCkge1xuXHRsZXQgdmlldyA9IFtcblx0J0V4b24uZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXInLFxuXHQnRXhvbi5nZW5lLnByaW1hcnlJZGVudGlmaWVyJyxcblx0J0V4b24udHJhbnNjcmlwdHMucHJpbWFyeUlkZW50aWZpZXInLFxuXHQnRXhvbi5wcmltYXJ5SWRlbnRpZmllcicsXG5cdCdFeG9uLmNocm9tb3NvbWUucHJpbWFyeUlkZW50aWZpZXInLFxuXHQnRXhvbi5jaHJvbW9zb21lTG9jYXRpb24uc3RhcnQnLFxuXHQnRXhvbi5jaHJvbW9zb21lTG9jYXRpb24uZW5kJyxcblx0J0V4b24uc3RyYWluLm5hbWUnXG5cdF0uam9pbignICcpO1xuICAgICAgICBsZXQgcSA9IGA8cXVlcnkgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIiR7dmlld31cIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCXCI+XG5cdCAgICA8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJFeG9uLmdlbmUuY2hyb21vc29tZUxvY2F0aW9uXCIgb3A9XCJPVkVSTEFQU1wiPlxuXHRcdDx2YWx1ZT4ke2Nocn06JHtzdGFydH0uLiR7ZW5kfTwvdmFsdWU+XG5cdCAgICA8L2NvbnN0cmFpbnQ+XG5cdCAgICA8Y29uc3RyYWludCBjb2RlPVwiQlwiIHBhdGg9XCJFeG9uLnN0cmFpbi5uYW1lXCIgb3A9XCI9XCIgdmFsdWU9XCIke2dlbm9tZX1cIi8+XG5cdCAgICA8L3F1ZXJ5PmBcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxLCdqc29uJyk7XG4gICAgfVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIGZvciBhbGwgZXhvbnMgb2YgYWxsIGdlbm9sb2dzIG9mIHRoZSBzcGVjaWZpZWQgY2Fub25pY2FsIGdlbmVcbiAgICBleG9uc0J5Q2Fub25pY2FsSWRcdChpZGVudCkge1xuXHRsZXQgdmlldyA9IFtcblx0J0V4b24uZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXInLFxuXHQnRXhvbi5nZW5lLnByaW1hcnlJZGVudGlmaWVyJyxcblx0J0V4b24udHJhbnNjcmlwdHMucHJpbWFyeUlkZW50aWZpZXInLFxuXHQnRXhvbi5wcmltYXJ5SWRlbnRpZmllcicsXG5cdCdFeG9uLmNocm9tb3NvbWUucHJpbWFyeUlkZW50aWZpZXInLFxuXHQnRXhvbi5jaHJvbW9zb21lTG9jYXRpb24uc3RhcnQnLFxuXHQnRXhvbi5jaHJvbW9zb21lTG9jYXRpb24uZW5kJyxcblx0J0V4b24uc3RyYWluLm5hbWUnXG5cdF0uam9pbignICcpO1xuICAgICAgICBsZXQgcSA9IGA8cXVlcnkgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIiR7dmlld31cIiA+XG5cdCAgICA8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJFeG9uLmdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiIC8+XG5cdCAgICA8L3F1ZXJ5PmBcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxLCdqc29uJyk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENvbnN0cnVjdHMgYSBVUkwgZm9yIGxpbmtpbmcgdG8gYSBNb3VzZU1pbmUgcmVwb3J0IHBhZ2UgYnkgaWRcbiAgICBsaW5rVG9SZXBvcnRQYWdlIChpZGVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yVXJsICsgaWRlbnQ7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENvbnN0cnVjdHMgYSBVUkwgdG8gcmV0cmlldmUgbW91c2Ugc2VxdWVuY2VzIGZyb20gTW91c2VNaW5lIGZvciB0aGUgc3BlY2lmaWVkIGZlYXR1cmUuXG4gICAgc2VxdWVuY2VzRm9yRmVhdHVyZSAoZiwgdHlwZSwgZ2Vub21lcykge1xuXHRsZXQgcTtcblx0bGV0IHVybDtcblx0bGV0IHZpZXc7XG5cdGxldCBpZGVudDtcbiAgICAgICAgLy9cblx0dHlwZSA9IHR5cGUgPyB0eXBlLnRvTG93ZXJDYXNlKCkgOiAnZ2Vub21pYyc7XG5cdC8vXG5cdGlmIChmLmNhbm9uaWNhbCkge1xuXHQgICAgaWRlbnQgPSBmLmNhbm9uaWNhbFxuXHQgICAgLy9cblx0ICAgIGxldCBncyA9ICcnXG5cdCAgICBsZXQgdmFscztcblx0ICAgIGlmIChnZW5vbWVzKSB7XG5cdFx0dmFscyA9IGdlbm9tZXMubWFwKChnKSA9PiBgPHZhbHVlPiR7Z308L3ZhbHVlPmApLmpvaW4oJycpO1xuXHQgICAgfVxuXHQgICAgc3dpdGNoICh0eXBlKSB7XG5cdCAgICBjYXNlICdnZW5vbWljJzpcblx0XHR2aWV3ID0gJ0dlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyJztcblx0XHRncyA9IGA8Y29uc3RyYWludCBwYXRoPVwiR2VuZS5zdHJhaW4ubmFtZVwiIG9wPVwiT05FIE9GXCI+JHt2YWxzfTwvY29uc3RyYWludD5gXG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cInNlcXVlbmNlc0J5Q2Fub25pY2FsSWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiR2VuZS5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiLz5cblx0XHQgICAgJHtnc308L3F1ZXJ5PmA7XG5cdFx0YnJlYWs7XG5cdCAgICBjYXNlICdleG9uJzpcblx0XHR2aWV3ID0gJ0V4b24uZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXInO1xuXHRcdGdzID0gYDxjb25zdHJhaW50IHBhdGg9XCJFeG9uLnN0cmFpbi5uYW1lXCIgb3A9XCJPTkUgT0ZcIj4ke3ZhbHN9PC9jb25zdHJhaW50PmBcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwiZXhvblNlcXVlbmNlc0J5Q2Fub25pY2FsSWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiRXhvbi5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkV4b24uZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgICAke2dzfTwvcXVlcnk+YDtcblx0ICAgICAgICBicmVhaztcblx0ICAgIGNhc2UgJ2Nkcyc6XG5cdFx0dmlldyA9ICdDRFMuZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXInO1xuXHRcdGdzID0gYDxjb25zdHJhaW50IHBhdGg9XCJDRFMuc3RyYWluLm5hbWVcIiBvcD1cIk9ORSBPRlwiPiR7dmFsc308L2NvbnN0cmFpbnQ+YFxuXHRcdHEgPSBgPHF1ZXJ5IG5hbWU9XCJjZHNTZXF1ZW5jZXNCeUNhbm9uaWNhbElkXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIkNEUy5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkNEUy5nZW5lLmNhbm9uaWNhbC5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIi8+XG5cdFx0ICAgICR7Z3N9PC9xdWVyeT5gO1xuXHQgICAgICAgIGJyZWFrO1xuXHQgICAgfVxuXHR9XG5cdGVsc2Uge1xuXHQgICAgaWRlbnQgPSBmLklEO1xuXHQgICAgdmlldyA9ICcnXG5cdCAgICBzd2l0Y2ggKHR5cGUpIHtcblx0ICAgIGNhc2UgJ2dlbm9taWMnOlxuXHRcdHEgPSBgPHF1ZXJ5IG5hbWU9XCJzZXF1ZW5jZXNCeUlkXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIkdlbmUucHJpbWFyeUlkZW50aWZpZXJcIiA+XG5cdFx0ICAgIDxjb25zdHJhaW50IHBhdGg9XCJHZW5lLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiLz5cblx0XHQgIDwvcXVlcnk+YDtcblx0XHRicmVhaztcblx0ICAgIGNhc2UgJ2V4b24nOlxuXHRcdHEgPSBgPHF1ZXJ5IG5hbWU9XCJleG9uU2VxdWVuY2VzQnlJZFwiIG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCJFeG9uLnByaW1hcnlJZGVudGlmaWVyXCIgPlxuXHRcdCAgICA8Y29uc3RyYWludCBwYXRoPVwiRXhvbi5nZW5lLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiLz5cblx0XHQgIDwvcXVlcnk+YDtcblx0ICAgICAgICBicmVhaztcblx0ICAgIGNhc2UgJ2Nkcyc6XG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cImNkc1NlcXVlbmNlc0J5SWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiQ0RTLnByaW1hcnlJZGVudGlmaWVyXCIgPlxuXHRcdCAgICA8Y29uc3RyYWludCBwYXRoPVwiQ0RTLmdlbmUucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgPC9xdWVyeT5gO1xuXHQgICAgICAgIGJyZWFrO1xuXHQgICAgfVxuXHR9XG5cdGlmICghcSkgcmV0dXJuIG51bGw7XG5cdGNvbnNvbGUubG9nKHEsIHZpZXcpO1xuXHR1cmwgPSB0aGlzLmZhVXJsICsgYHF1ZXJ5PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHEpfWA7XG5cdGlmICh2aWV3KVxuICAgICAgICAgICAgdXJsICs9IGAmdmlldz0ke2VuY29kZVVSSUNvbXBvbmVudCh2aWV3KX1gO1xuXHRyZXR1cm4gdXJsO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgQXV4RGF0YU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0F1eERhdGFNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB9IGZyb20gJy4vTGlzdEZvcm11bGFFdmFsdWF0b3InO1xuaW1wb3J0IHsgS2V5U3RvcmUgfSBmcm9tICcuL0tleVN0b3JlJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBNYWludGFpbnMgbmFtZWQgbGlzdHMgb2YgSURzLiBMaXN0cyBtYXkgYmUgdGVtcG9yYXJ5LCBsYXN0aW5nIG9ubHkgZm9yIHRoZSBzZXNzaW9uLCBvciBwZXJtYW5lbnQsXG4vLyBsYXN0aW5nIHVudGlsIHRoZSB1c2VyIGNsZWFycyB0aGUgYnJvd3NlciBsb2NhbCBzdG9yYWdlIGFyZWEuXG4vL1xuLy8gVXNlcyB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UgYW5kIHdpbmRvdy5sb2NhbFN0b3JhZ2UgdG8gc2F2ZSBsaXN0c1xuLy8gdGVtcG9yYXJpbHkgb3IgcGVybWFuZW50bHksIHJlc3AuICBGSVhNRTogc2hvdWxkIGJlIHVzaW5nIHdpbmRvdy5pbmRleGVkREJcbi8vXG5jbGFzcyBMaXN0TWFuYWdlciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0KSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0KTtcblx0dGhpcy5uYW1lMmxpc3QgPSBudWxsO1xuXHR0aGlzLmxpc3RTdG9yZSA9IG5ldyBLZXlTdG9yZSgndXNlci1saXN0cycpO1xuXHR0aGlzLmZvcm11bGFFdmFsID0gbmV3IExpc3RGb3JtdWxhRXZhbHVhdG9yKHRoaXMpO1xuXHR0aGlzLnJlYWR5ID0gdGhpcy5fbG9hZCgpLnRoZW4oICgpPT50aGlzLmluaXREb20oKSApO1xuICAgIH1cbiAgICBpbml0RG9tICgpIHtcblx0Ly8gQnV0dG9uOiBzaG93L2hpZGUgd2FybmluZyBtZXNzYWdlXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b24ud2FybmluZycpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4ge1xuXHQgICAgICAgIGxldCB3ID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJtZXNzYWdlXCJdJyk7XG5cdFx0dy5jbGFzc2VkKCdzaG93aW5nJywgIXcuY2xhc3NlZCgnc2hvd2luZycpKTtcblx0ICAgIH0pO1xuXHQvLyBCdXR0b246IGNyZWF0ZSBsaXN0IGZyb20gY3VycmVudCBzZWxlY3Rpb25cblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwibmV3ZnJvbXNlbGVjdGlvblwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0bGV0IGlkcyA9IG5ldyBTZXQoT2JqZWN0LmtleXModGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0cykpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHRcdGxldCBsc3QgPSB0aGlzLmFwcC5nZXRDdXJyZW50TGlzdCgpO1xuXHRcdGlmIChsc3QpXG5cdFx0ICAgIGlkcyA9IGlkcy51bmlvbihsc3QuaWRzKTtcblx0XHRpZiAoaWRzLnNpemUgPT09IDApIHtcblx0XHQgICAgYWxlcnQoXCJOb3RoaW5nIHNlbGVjdGVkLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbmV3bGlzdCA9IHRoaXMuY3JlYXRlTGlzdChcInNlbGVjdGlvblwiLCBBcnJheS5mcm9tKGlkcykpO1xuXHRcdHRoaXMudXBkYXRlKG5ld2xpc3QpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBjb21iaW5lIGxpc3RzOiBvcGVuIGxpc3QgZWRpdG9yIHdpdGggZm9ybXVsYSBlZGl0b3Igb3BlblxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJjb21iaW5lXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAodGhpcy5nZXROYW1lcygpLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vIGxpc3RzLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgbGUgPSB0aGlzLmFwcC5saXN0RWRpdG9yO1xuXHRcdGxlLm9wZW4oKTtcblx0XHRsZS5vcGVuRm9ybXVsYUVkaXRvcigpO1xuXHQgICAgfSk7XG5cdC8vIEJ1dHRvbjogZGVsZXRlIGFsbCBsaXN0cyAoZ2V0IGNvbmZpcm1hdGlvbiBmaXJzdCkuXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cInB1cmdlXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRpZiAodGhpcy5nZXROYW1lcygpLmxlbmd0aCA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vIGxpc3RzLlwiKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0ICAgICAgICBpZiAod2luZG93LmNvbmZpcm0oXCJEZWxldGUgYWxsIGxpc3RzLiBBcmUgeW91IHN1cmU/XCIpKSB7XG5cdFx0ICAgIHRoaXMucHVyZ2UoKTtcblx0XHQgICAgdGhpcy51cGRhdGUoKTtcblx0XHR9XG5cdCAgICB9KTtcbiAgICB9XG4gICAgX2xvYWQgKCkge1xuXHRyZXR1cm4gdGhpcy5saXN0U3RvcmUuZ2V0KFwiYWxsXCIpLnRoZW4oYWxsID0+IHtcblx0ICAgIHRoaXMubmFtZTJsaXN0ID0gYWxsIHx8IHt9O1xuXHR9KTtcbiAgICB9XG4gICAgX3NhdmUgKCkge1xuXHRyZXR1cm4gdGhpcy5saXN0U3RvcmUuc2V0KFwiYWxsXCIsIHRoaXMubmFtZTJsaXN0KVxuICAgIH1cbiAgICAvL1xuICAgIC8vIHJldHVybnMgdGhlIG5hbWVzIG9mIGFsbCB0aGUgbGlzdHMsIHNvcnRlZFxuICAgIGdldE5hbWVzICgpIHtcbiAgICAgICAgbGV0IG5tcyA9IE9iamVjdC5rZXlzKHRoaXMubmFtZTJsaXN0KTtcblx0bm1zLnNvcnQoKTtcblx0cmV0dXJuIG5tcztcbiAgICB9XG4gICAgLy8gcmV0dXJucyB0cnVlIGlmZiBhIGxpc3QgZXhpc3RzIHdpdGggdGhpcyBuYW1lXG4gICAgaGFzIChuYW1lKSB7XG4gICAgICAgIHJldHVybiBuYW1lIGluIHRoaXMubmFtZTJsaXN0O1xuICAgIH1cbiAgICAvLyBJZiBubyBsaXN0IHdpdGggdGhlIGdpdmVuIG5hbWUgZXhpc3RzLCByZXR1cm4gdGhlIG5hbWUuXG4gICAgLy8gT3RoZXJ3aXNlLCByZXR1cm4gYSBtb2RpZmllZCB2ZXJzaW9uIG9mIG5hbWUgdGhhdCBpcyB1bmlxdWUuXG4gICAgLy8gVW5pcXVlIG5hbWVzIGFyZSBjcmVhdGVkIGJ5IGFwcGVuZGluZyBhIGNvdW50ZXIuXG4gICAgLy8gRS5nLiwgdW5pcXVpZnkoXCJmb29cIikgLT4gXCJmb28uMVwiIG9yIFwiZm9vLjJcIiBvciB3aGF0ZXZlci5cbiAgICAvL1xuICAgIHVuaXF1aWZ5IChuYW1lKSB7XG5cdGlmICghdGhpcy5oYXMobmFtZSkpIFxuXHQgICAgcmV0dXJuIG5hbWU7XG5cdGZvciAobGV0IGkgPSAxOyA7IGkgKz0gMSkge1xuXHQgICAgbGV0IG5uID0gYCR7bmFtZX0uJHtpfWA7XG5cdCAgICBpZiAoIXRoaXMuaGFzKG5uKSlcblx0ICAgICAgICByZXR1cm4gbm47XG5cdH1cbiAgICB9XG4gICAgLy8gcmV0dXJucyB0aGUgbGlzdCB3aXRoIHRoaXMgbmFtZSwgb3IgbnVsbCBpZiBubyBzdWNoIGxpc3RcbiAgICBnZXQgKG5hbWUpIHtcbiAgICAgICAgbGV0IGxzdCA9IHRoaXMubmFtZTJsaXN0W25hbWVdO1xuXHRpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgbmFtZTtcblx0cmV0dXJuIGxzdDtcbiAgICB9XG4gICAgLy8gcmV0dXJucyBhbGwgdGhlIGxpc3RzLCBzb3J0ZWQgYnkgbmFtZVxuICAgIGdldEFsbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE5hbWVzKCkubWFwKG4gPT4gdGhpcy5nZXQobikpXG4gICAgfVxuICAgIC8vIFxuICAgIGNyZWF0ZU9yVXBkYXRlIChuYW1lLCBpZHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy51cGRhdGVMaXN0KG5hbWUsbnVsbCxpZHMpIDogdGhpcy5jcmVhdGVMaXN0KG5hbWUsIGlkcyk7XG4gICAgfVxuICAgIC8vIGNyZWF0ZXMgYSBuZXcgbGlzdCB3aXRoIHRoZSBnaXZlbiBuYW1lIGFuZCBpZHMuXG4gICAgY3JlYXRlTGlzdCAobmFtZSwgaWRzLCBmb3JtdWxhKSB7XG5cdGlmIChuYW1lICE9PSBcIl9cIilcblx0ICAgIG5hbWUgPSB0aGlzLnVuaXF1aWZ5KG5hbWUpO1xuXHQvL1xuXHRsZXQgZHQgPSBuZXcgRGF0ZSgpICsgXCJcIjtcblx0dGhpcy5uYW1lMmxpc3RbbmFtZV0gPSB7XG5cdCAgICBuYW1lOiAgICAgbmFtZSxcblx0ICAgIGlkczogICAgICBpZHMsXG5cdCAgICBmb3JtdWxhOiAgZm9ybXVsYSB8fCBcIlwiLFxuXHQgICAgY3JlYXRlZDogIGR0LFxuXHQgICAgbW9kaWZpZWQ6IGR0XG5cdH07XG5cdHRoaXMuX3NhdmUoKTtcblx0cmV0dXJuIHRoaXMubmFtZTJsaXN0W25hbWVdO1xuICAgIH1cbiAgICAvLyBQcm92aWRlIGFjY2VzcyB0byBldmFsdWF0aW9uIHNlcnZpY2VcbiAgICBldmFsRm9ybXVsYSAoZXhwcikge1xuXHRyZXR1cm4gdGhpcy5mb3JtdWxhRXZhbC5ldmFsKGV4cHIpO1xuICAgIH1cbiAgICAvLyBSZWZyZXNoZXMgYSBsaXN0IGFuZCByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHJlZnJlc2hlZCBsaXN0LlxuICAgIC8vIElmIHRoZSBsaXN0IGlmIGEgUE9MTywgcHJvbWlzZSByZXNvbHZlcyBpbW1lZGlhdGVseSB0byB0aGUgbGlzdC5cbiAgICAvLyBPdGhlcndpc2UsIHN0YXJ0cyBhIHJlZXZhbHVhdGlvbiBvZiB0aGUgZm9ybXVsYSB0aGF0IHJlc29sdmVzIGFmdGVyIHRoZVxuICAgIC8vIGxpc3QncyBpZHMgaGF2ZSBiZWVuIHVwZGF0ZWQuXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gZXJyb3IsIHRoZSByZXR1cm5lZCBwcm9taXNlIHJlamVjdHMgd2l0aCB0aGUgZXJyb3IuXG4gICAgcmVmcmVzaExpc3QgKG5hbWUpIHtcbiAgICAgICAgbGV0IGxzdCA9IHRoaXMuZ2V0KG5hbWUpO1xuXHRpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgbmFtZTtcblx0bHN0Lm1vZGlmaWVkID0gXCJcIituZXcgRGF0ZSgpO1xuXHRpZiAoIWxzdC5mb3JtdWxhKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShsc3QpO1xuXHRlbHNlIHtcblx0ICAgIGxldCBwID0gdGhpcy5mb3JtdWFsRXZhbC5ldmFsKGxzdC5mb3JtdWxhKS50aGVuKCBpZHMgPT4ge1xuXHRcdCAgICBsc3QuaWRzID0gaWRzO1xuXHRcdCAgICByZXR1cm4gbHN0O1xuXHRcdH0pO1xuXHQgICAgcmV0dXJuIHA7XG5cdH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGVzIHRoZSBpZHMgaW4gdGhlIGdpdmVuIGxpc3RcbiAgICB1cGRhdGVMaXN0IChuYW1lLCBuZXduYW1lLCBuZXdpZHMsIG5ld2Zvcm11bGEpIHtcblx0bGV0IGxzdCA9IHRoaXMuZ2V0KG5hbWUpO1xuICAgICAgICBpZiAoISBsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdGlmIChuZXduYW1lKSB7XG5cdCAgICBkZWxldGUgdGhpcy5uYW1lMmxpc3RbbHN0Lm5hbWVdO1xuXHQgICAgbHN0Lm5hbWUgPSB0aGlzLnVuaXF1aWZ5KG5ld25hbWUpO1xuXHQgICAgdGhpcy5uYW1lMmxpc3RbbHN0Lm5hbWVdID0gbHN0O1xuXHR9XG5cdGlmIChuZXdpZHMpIGxzdC5pZHMgID0gbmV3aWRzO1xuXHRpZiAobmV3Zm9ybXVsYSB8fCBuZXdmb3JtdWxhPT09XCJcIikgbHN0LmZvcm11bGEgPSBuZXdmb3JtdWxhO1xuXHRsc3QubW9kaWZpZWQgPSBuZXcgRGF0ZSgpICsgXCJcIjtcblx0dGhpcy5fc2F2ZSgpO1xuXHRyZXR1cm4gbHN0O1xuICAgIH1cbiAgICAvLyBkZWxldGVzIHRoZSBzcGVjaWZpZWQgbGlzdFxuICAgIGRlbGV0ZUxpc3QgKG5hbWUpIHtcbiAgICAgICAgbGV0IGxzdCA9IHRoaXMuZ2V0KG5hbWUpO1xuXHRkZWxldGUgdGhpcy5uYW1lMmxpc3RbbmFtZV07XG5cdHRoaXMuX3NhdmUoKTtcblx0Ly8gRklYTUU6IHVzZSBldmVudHMhIVxuXHRpZiAobHN0ID09PSB0aGlzLmFwcC5nZXRDdXJyZW50TGlzdCgpKSB0aGlzLmFwcC5zZXRDdXJyZW50TGlzdChudWxsKTtcblx0aWYgKGxzdCA9PT0gdGhpcy5hcHAubGlzdEVkaXRvci5saXN0KSB0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QgPSBudWxsO1xuXHRyZXR1cm4gbHN0O1xuICAgIH1cbiAgICAvLyBkZWxldGUgYWxsIGxpc3RzXG4gICAgcHVyZ2UgKCkge1xuICAgICAgICB0aGlzLm5hbWUybGlzdCA9IHt9XG5cdHRoaXMuX3NhdmUoKTtcblx0Ly9cblx0dGhpcy5hcHAuc2V0Q3VycmVudExpc3QobnVsbCk7XG5cdHRoaXMuYXBwLmxpc3RFZGl0b3IubGlzdCA9IG51bGw7IC8vIEZJWE1FIC0gcmVhY2hhY3Jvc3NcbiAgICB9XG4gICAgLy8gUmV0dXJucyB0cnVlIGlmZiBleHByIGlzIHZhbGlkLCB3aGljaCBtZWFucyBpdCBpcyBib3RoIHN5bnRhY3RpY2FsbHkgY29ycmVjdCBcbiAgICAvLyBhbmQgYWxsIG1lbnRpb25lZCBsaXN0cyBleGlzdC5cbiAgICBpc1ZhbGlkIChleHByKSB7XG5cdHJldHVybiB0aGlzLmZvcm11bGFFdmFsLmlzVmFsaWQoZXhwcik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFVwZGF0ZXMgdGhlIFwiTXkgbGlzdHNcIiBib3ggd2l0aCB0aGUgY3VycmVudGx5IGF2YWlsYWJsZSBsaXN0cy5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgbmV3bGlzdCAoTGlzdCkgb3B0aW9uYWwuIElmIHNwZWNpZmllZCwgd2UganVzdCBjcmVhdGVkIHRoYXQgbGlzdCwgYW5kIGl0cyBuYW1lIGlzXG4gICAgLy8gICBcdGEgZ2VuZXJhdGVkIGRlZmF1bHQuIFBsYWNlIGZvY3VzIHRoZXJlIHNvIHVzZXIgY2FuIHR5cGUgbmV3IG5hbWUuXG4gICAgdXBkYXRlIChuZXdsaXN0KSB7XG5cdGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGxpc3RzID0gdGhpcy5nZXRBbGwoKTtcblx0bGV0IGJ5TmFtZSA9IChhLGIpID0+IHtcblx0ICAgIGxldCBhbiA9IGEubmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgbGV0IGJuID0gYi5uYW1lLnRvTG93ZXJDYXNlKCk7XG5cdCAgICByZXR1cm4gKGFuIDwgYm4gPyAtMSA6IGFuID4gYm4gPyArMSA6IDApO1xuXHR9O1xuXHRsZXQgYnlEYXRlID0gKGEsYikgPT4gKChuZXcgRGF0ZShiLm1vZGlmaWVkKSkuZ2V0VGltZSgpIC0gKG5ldyBEYXRlKGEubW9kaWZpZWQpKS5nZXRUaW1lKCkpO1xuXHRsaXN0cy5zb3J0KGJ5TmFtZSk7XG5cdGxldCBpdGVtcyA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwibGlzdHNcIl0nKS5zZWxlY3RBbGwoXCIubGlzdEluZm9cIilcblx0ICAgIC5kYXRhKGxpc3RzKTtcblx0bGV0IG5ld2l0ZW1zID0gaXRlbXMuZW50ZXIoKS5hcHBlbmQoXCJkaXZcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImxpc3RJbmZvIGZsZXhyb3dcIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwiaVwiKS5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zIGJ1dHRvblwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJlZGl0XCIpXG5cdCAgICAudGV4dChcIm1vZGVfZWRpdFwiKVxuXHQgICAgLmF0dHIoXCJ0aXRsZVwiLFwiRWRpdCB0aGlzIGxpc3QuXCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcIm5hbWVcIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwic3BhblwiKS5hdHRyKFwibmFtZVwiLFwic2l6ZVwiKTtcblx0bmV3aXRlbXMuYXBwZW5kKFwic3BhblwiKS5hdHRyKFwibmFtZVwiLFwiZGF0ZVwiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJpXCIpLmF0dHIoXCJjbGFzc1wiLFwibWF0ZXJpYWwtaWNvbnMgYnV0dG9uXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIixcImRlbGV0ZVwiKVxuXHQgICAgLnRleHQoXCJoaWdobGlnaHRfb2ZmXCIpXG5cdCAgICAuYXR0cihcInRpdGxlXCIsXCJEZWxldGUgdGhpcyBsaXN0LlwiKTtcblxuXHRpZiAobmV3aXRlbXNbMF1bMF0pIHtcblx0ICAgIGxldCBsYXN0ID0gbmV3aXRlbXNbMF1bbmV3aXRlbXNbMF0ubGVuZ3RoLTFdO1xuXHQgICAgbGFzdC5zY3JvbGxJbnRvVmlldygpO1xuXHR9XG5cblx0aXRlbXNcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBsc3Q9PmxzdC5uYW1lKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGxzdCkge1xuXHRcdGlmIChkMy5ldmVudC5hbHRLZXkpIHtcblx0XHQgICAgLy8gYWx0LWNsaWNrIGNvcGllcyB0aGUgbGlzdCdzIG5hbWUgaW50byB0aGUgZm9ybXVsYSBlZGl0b3Jcblx0XHQgICAgbGV0IGxlID0gc2VsZi5hcHAubGlzdEVkaXRvcjsgLy8gRklYTUUgcmVhY2hvdmVyXG5cdFx0ICAgIGxldCBzID0gbHN0Lm5hbWU7XG5cdFx0ICAgIGxldCByZSA9IC9bID0oKSsqLV0vO1xuXHRcdCAgICBpZiAocy5zZWFyY2gocmUpID49IDApXG5cdFx0XHRzID0gJ1wiJyArIHMgKyAnXCInO1xuXHRcdCAgICBpZiAoIWxlLmlzRWRpdGluZ0Zvcm11bGEpIHtcblx0XHQgICAgICAgIGxlLm9wZW4oKTtcblx0XHRcdGxlLm9wZW5Gb3JtdWxhRWRpdG9yKCk7XG5cdFx0ICAgIH1cblx0XHQgICAgLy9cblx0XHQgICAgbGUuYWRkVG9MaXN0RXhwcihzKycgJyk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGQzLmV2ZW50LnNoaWZ0S2V5KSB7XG5cdFx0ICAgIC8vIHNoaWZ0LWNsaWNrIGdvZXMgdG8gbmV4dCBsaXN0IGVsZW1lbnQgaWYgaXQncyB0aGUgc2FtZSBsaXN0LFxuXHRcdCAgICAvLyBvciBlbHNlIHNldHMgdGhlIGxpc3QgYW5kIGdvZXMgdG8gdGhlIGZpcnN0IGVsZW1lbnQuXG5cdFx0ICAgIGlmIChzZWxmLmFwcC5nZXRDdXJyZW50TGlzdCgpICE9PSBsc3QpXG5cdFx0XHRzZWxmLmFwcC5zZXRDdXJyZW50TGlzdChsc3QsIHRydWUpO1xuXHRcdCAgICBlbHNlXG5cdFx0XHRzZWxmLmFwcC5nb1RvTmV4dExpc3RFbGVtZW50KGxzdCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICAvLyBwbGFpbiBjbGljayBzZXRzIHRoZSBzZXQgaWYgaXQncyBhIGRpZmZlcmVudCBsaXN0LFxuXHRcdCAgICAvLyBvciBlbHNlIHVuc2V0cyB0aGUgbGlzdC5cblx0XHQgICAgaWYgKHNlbGYuYXBwLmdldEN1cnJlbnRMaXN0KCkgIT09IGxzdClcblx0XHQgICAgICAgIHNlbGYuYXBwLnNldEN1cnJlbnRMaXN0KGxzdCk7XG5cdFx0ICAgIGVsc2Vcblx0XHQgICAgICAgIHNlbGYuYXBwLnNldEN1cnJlbnRMaXN0KG51bGwpO1xuXHRcdH1cblx0ICAgIH0pO1xuXHRpdGVtcy5zZWxlY3QoJy5idXR0b25bbmFtZT1cImVkaXRcIl0nKVxuXHQgICAgLy8gZWRpdDogY2xpY2sgXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbihsc3QpIHtcblx0ICAgICAgICBzZWxmLmFwcC5saXN0RWRpdG9yLm9wZW4obHN0KTtcblx0ICAgIH0pO1xuXHRpdGVtcy5zZWxlY3QoJ3NwYW5bbmFtZT1cIm5hbWVcIl0nKVxuXHQgICAgLnRleHQobHN0ID0+IGxzdC5uYW1lKTtcblx0aXRlbXMuc2VsZWN0KCdzcGFuW25hbWU9XCJkYXRlXCJdJykudGV4dChsc3QgPT4ge1xuXHQgICAgbGV0IG1kID0gbmV3IERhdGUobHN0Lm1vZGlmaWVkKTtcblx0ICAgIGxldCBkID0gYCR7bWQuZ2V0RnVsbFllYXIoKX0tJHttZC5nZXRNb250aCgpKzF9LSR7bWQuZ2V0RGF0ZSgpfSBgIFxuXHQgICAgICAgICAgKyBgOiR7bWQuZ2V0SG91cnMoKX0uJHttZC5nZXRNaW51dGVzKCl9LiR7bWQuZ2V0U2Vjb25kcygpfWA7XG5cdCAgICByZXR1cm4gZDtcblx0fSk7XG5cdGl0ZW1zLnNlbGVjdCgnc3BhbltuYW1lPVwic2l6ZVwiXScpLnRleHQobHN0ID0+IGxzdC5pZHMubGVuZ3RoKTtcblx0aXRlbXMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJkZWxldGVcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgbHN0ID0+IHtcblx0ICAgICAgICB0aGlzLmRlbGV0ZUxpc3QobHN0Lm5hbWUpO1xuXHRcdHRoaXMudXBkYXRlKCk7XG5cblx0XHQvLyBOb3Qgc3VyZSB3aHkgdGhpcyBpcyBuZWNlc3NhcnkgaGVyZS4gQnV0IHdpdGhvdXQgaXQsIHRoZSBsaXN0IGl0ZW0gYWZ0ZXIgdGhlIG9uZSBiZWluZ1xuXHRcdC8vIGRlbGV0ZWQgaGVyZSB3aWxsIHJlY2VpdmUgYSBjbGljayBldmVudC5cblx0XHRkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHQvL1xuXHQgICAgfSk7XG5cblx0Ly9cblx0aXRlbXMuZXhpdCgpLnJlbW92ZSgpO1xuXHQvL1xuXHRpZiAobmV3bGlzdCkge1xuXHQgICAgbGV0IGxzdGVsdCA9IFxuXHQgICAgICAgIGQzLnNlbGVjdChgI215bGlzdHMgW25hbWU9XCJsaXN0c1wiXSBbbmFtZT1cIiR7bmV3bGlzdC5uYW1lfVwiXWApWzBdWzBdO1xuICAgICAgICAgICAgbHN0ZWx0LnNjcm9sbEludG9WaWV3KGZhbHNlKTtcblx0fVxuICAgIH1cblxufSAvLyBlbmQgY2xhc3MgTGlzdE1hbmFnZXJcblxuZXhwb3J0IHsgTGlzdE1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0xpc3RNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9IGZyb20gJy4vTGlzdEZvcm11bGFQYXJzZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEtub3dzIGhvdyB0byBwYXJzZSBhbmQgZXZhbHVhdGUgYSBsaXN0IGZvcm11bGEgKGFrYSBsaXN0IGV4cHJlc3Npb24pLlxuY2xhc3MgTGlzdEZvcm11bGFFdmFsdWF0b3Ige1xuICAgIGNvbnN0cnVjdG9yIChsaXN0TWFuYWdlcikge1xuXHR0aGlzLmxpc3RNYW5hZ2VyID0gbGlzdE1hbmFnZXI7XG4gICAgICAgIHRoaXMucGFyc2VyID0gbmV3IExpc3RGb3JtdWxhUGFyc2VyKCk7XG4gICAgfVxuICAgIC8vIEV2YWx1YXRlcyB0aGUgZXhwcmVzc2lvbiBhbmQgcmV0dXJucyBhIFByb21pc2UgZm9yIHRoZSBsaXN0IG9mIGlkcy5cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBlcnJvciwgdGhlIHByb21pc2UgcmVqZWN0cyB3aXRoIHRoZSBlcnJvciBtZXNzYWdlLlxuICAgIGV2YWwgKGV4cHIpIHtcblx0IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0ICAgICB0cnkge1xuXHRcdGxldCBhc3QgPSB0aGlzLnBhcnNlci5wYXJzZShleHByKTtcblx0XHRsZXQgbG0gPSB0aGlzLmxpc3RNYW5hZ2VyO1xuXHRcdGxldCByZWFjaCA9IChuKSA9PiB7XG5cdFx0ICAgIGlmICh0eXBlb2YobikgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdGxldCBsc3QgPSBsbS5nZXQobik7XG5cdFx0XHRpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgbjtcblx0XHRcdHJldHVybiBuZXcgU2V0KGxzdC5pZHMpO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVsc2Uge1xuXHRcdFx0bGV0IGwgPSByZWFjaChuLmxlZnQpO1xuXHRcdFx0bGV0IHIgPSByZWFjaChuLnJpZ2h0KTtcblx0XHRcdHJldHVybiBsW24ub3BdKHIpO1xuXHRcdCAgICB9XG5cdFx0fVxuXHRcdGxldCBpZHMgPSByZWFjaChhc3QpO1xuXHRcdHJlc29sdmUoQXJyYXkuZnJvbShpZHMpKTtcblx0ICAgIH1cblx0ICAgIGNhdGNoIChlKSB7XG5cdFx0cmVqZWN0KGUpO1xuXHQgICAgfVxuXHQgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgLy8gQ2hlY2tzIHRoZSBjdXJyZW50IGV4cHJlc3Npb24gZm9yIHN5bnRhY3RpYyBhbmQgc2VtYW50aWMgdmFsaWRpdHkgYW5kIHNldHMgdGhlIFxuICAgIC8vIHZhbGlkL2ludmFsaWQgY2xhc3MgYWNjb3JkaW5nbHkuIFNlbWFudGljIHZhbGlkaXR5IHNpbXBseSBtZWFucyBhbGwgbmFtZXMgaW4gdGhlXG4gICAgLy8gZXhwcmVzc2lvbiBhcmUgYm91bmQuXG4gICAgLy9cbiAgICBpc1ZhbGlkICAoZXhwcikge1xuXHR0cnkge1xuXHQgICAgLy8gZmlyc3QgY2hlY2sgc3ludGF4XG5cdCAgICBsZXQgYXN0ID0gdGhpcy5wYXJzZXIucGFyc2UoZXhwcik7XG5cdCAgICBsZXQgbG0gID0gdGhpcy5saXN0TWFuYWdlcjsgXG5cdCAgICAvLyBub3cgY2hlY2sgbGlzdCBuYW1lc1xuXHQgICAgKGZ1bmN0aW9uIHJlYWNoKG4pIHtcblx0XHRpZiAodHlwZW9mKG4pID09PSBcInN0cmluZ1wiKSB7XG5cdFx0ICAgIGxldCBsc3QgPSBsbS5nZXQobik7XG5cdFx0ICAgIGlmICghbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICByZWFjaChuLmxlZnQpO1xuXHRcdCAgICByZWFjaChuLnJpZ2h0KTtcblx0XHR9XG5cdCAgICB9KShhc3QpO1xuXG5cdCAgICAvLyBUaHVtYnMgdXAhXG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fVxuXHRjYXRjaCAoZSkge1xuXHQgICAgLy8gc3ludGF4IGVycm9yIG9yIHVua25vd24gbGlzdCBuYW1lXG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IExpc3RGb3JtdWxhRXZhbHVhdG9yIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0Rm9ybXVsYUV2YWx1YXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgc2V0Q2FyZXRQb3NpdGlvbiwgbW92ZUNhcmV0UG9zaXRpb24sIGdldENhcmV0UmFuZ2UgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IExpc3RGb3JtdWxhUGFyc2VyIH0gZnJvbSAnLi9MaXN0Rm9ybXVsYVBhcnNlcic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgTGlzdEVkaXRvciBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0KSB7XG5cdHN1cGVyKGFwcCwgZWx0KTtcblx0dGhpcy5wYXJzZXIgPSBuZXcgTGlzdEZvcm11bGFQYXJzZXIoKTtcblx0dGhpcy5mb3JtID0gbnVsbDtcblx0dGhpcy5pbml0RG9tKCk7XG5cdHRoaXMuaXNFZGl0aW5nRm9ybXVsYSA9IGZhbHNlO1xuXHQvL1xuXHR0aGlzLmxpc3QgPSBudWxsO1xuICAgIH1cbiAgICBpbml0RG9tICgpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHR0aGlzLmZvcm0gPSB0aGlzLnJvb3Quc2VsZWN0KFwiZm9ybVwiKVswXVswXTtcblx0aWYgKCF0aGlzLmZvcm0pIHRocm93IFwiQ291bGQgbm90IGluaXQgTGlzdEVkaXRvci4gTm8gZm9ybSBlbGVtZW50LlwiO1xuXHRkMy5zZWxlY3QodGhpcy5mb3JtKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHQgICAgICAgIGxldCB0ID0gZDMuZXZlbnQudGFyZ2V0O1xuXHRcdGlmIChcImJ1dHRvblwiID09PSB0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSl7XG5cdFx0ICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ICAgIGxldCBmID0gdGhpcy5mb3JtO1xuXHRcdCAgICBsZXQgcyA9IGYuaWRzLnZhbHVlLnJlcGxhY2UoL1ssfF0vZywgJyAnKS50cmltKCk7XG5cdFx0ICAgIGxldCBpZHMgPSBzID8gcy5zcGxpdCgvXFxzKy8pIDogW107XG5cdFx0ICAgIC8vIHNhdmUgbGlzdFxuXHRcdCAgICBpZiAodC5uYW1lID09PSBcInNhdmVcIikge1xuXHRcdFx0aWYgKCF0aGlzLmxpc3QpIHJldHVybjtcblx0XHRcdHRoaXMubGlzdCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZUxpc3QodGhpcy5saXN0Lm5hbWUsIGYubmFtZS52YWx1ZSwgaWRzLCBmLmZvcm11bGEudmFsdWUpO1xuXHRcdFx0dGhpcy5hcHAubGlzdE1hbmFnZXIudXBkYXRlKHRoaXMubGlzdCk7XG5cdFx0ICAgIH1cblx0XHQgICAgLy8gY3JlYXRlIG5ldyBsaXN0XG5cdFx0ICAgIGVsc2UgaWYgKHQubmFtZSA9PT0gXCJuZXdcIikge1xuXHRcdFx0bGV0IG4gPSBmLm5hbWUudmFsdWUudHJpbSgpO1xuXHRcdFx0aWYgKCFuKSB7XG5cdFx0XHQgICBhbGVydChcIllvdXIgbGlzdCBoYXMgbm8gbmFtZSBhbmQgaXMgdmVyeSBzYWQuIFBsZWFzZSBnaXZlIGl0IGEgbmFtZSBhbmQgdHJ5IGFnYWluLlwiKTtcblx0XHRcdCAgIHJldHVyblxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAobi5pbmRleE9mKCdcIicpID49IDApIHtcblx0XHRcdCAgIGFsZXJ0KFwiT2ggZGVhciwgeW91ciBsaXN0J3MgbmFtZSBoYXMgYSBkb3VibGUgcXVvdGUgY2hhcmFjdGVyLCBhbmQgSSdtIGFmYXJhaWQgdGhhdCdzIG5vdCBhbGxvd2VkLiBQbGVhc2UgcmVtb3ZlIHRoZSAnXFxcIicgYW5kIHRyeSBhZ2Fpbi5cIik7XG5cdFx0XHQgICByZXR1cm5cblx0XHRcdH1cblx0XHQgICAgICAgIHRoaXMubGlzdCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLmNyZWF0ZUxpc3QobiwgaWRzLCBmLmZvcm11bGEudmFsdWUpO1xuXHRcdFx0dGhpcy5hcHAubGlzdE1hbmFnZXIudXBkYXRlKHRoaXMubGlzdCk7XG5cdFx0ICAgIH1cblx0XHQgICAgLy8gY2xlYXIgZm9ybVxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwiY2xlYXJcIikge1xuXHRcdCAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0XHQgICAgfVxuXHRcdCAgICAvLyBmb3J3YXJkIHRvIE1HSVxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwidG9NZ2lcIikge1xuXHRcdCAgICAgICAgbGV0IGZybSA9IGQzLnNlbGVjdCgnI21naWJhdGNoZm9ybScpWzBdWzBdO1xuXHRcdFx0ZnJtLmlkcy52YWx1ZSA9IGlkcy5qb2luKFwiIFwiKTtcblx0XHRcdGZybS5zdWJtaXQoKVxuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGZvcndhcmQgdG8gTW91c2VNaW5lXG5cdFx0ICAgIGVsc2UgaWYgKHQubmFtZSA9PT0gXCJ0b01vdXNlTWluZVwiKSB7XG5cdFx0ICAgICAgICBsZXQgZnJtID0gZDMuc2VsZWN0KCcjbW91c2VtaW5lZm9ybScpWzBdWzBdO1xuXHRcdFx0ZnJtLmV4dGVybmFsaWRzLnZhbHVlID0gaWRzLmpvaW4oXCIsXCIpO1xuXHRcdFx0ZnJtLnN1Ym1pdCgpXG5cdFx0ICAgIH1cblx0XHR9XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IHNob3cvaGlkZSBmb3JtdWxhIGVkaXRvclxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImlkc2VjdGlvblwiXSAuYnV0dG9uW25hbWU9XCJlZGl0Zm9ybXVsYVwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnRvZ2dsZUZvcm11bGFFZGl0b3IoKSk7XG5cdCAgICBcblx0Ly8gSW5wdXQgYm94OiBmb3JtdWxhOiB2YWxpZGF0ZSBvbiBhbnkgaW5wdXRcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIFtuYW1lPVwiZm9ybXVsYVwiXScpXG5cdCAgICAub24oXCJpbnB1dFwiLCAoKSA9PiB7XG5cdCAgICAgICAgdGhpcy52YWxpZGF0ZUV4cHIoKTtcblx0ICAgIH0pO1xuXG5cdC8vIEZvcndhcmQgLT4gTUdJL01vdXNlTWluZTogZGlzYWJsZSBidXR0b25zIGlmIG5vIGlkc1xuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImlkc1wiXScpXG5cdCAgICAub24oXCJpbnB1dFwiLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IGVtcHR5ID0gdGhpcy5mb3JtLmlkcy52YWx1ZS50cmltKCkubGVuZ3RoID09PSAwO1xuXHRcdHRoaXMuZm9ybS50b01naS5kaXNhYmxlZCA9IHRoaXMuZm9ybS50b01vdXNlTWluZS5kaXNhYmxlZCA9IGVtcHR5O1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uczogdGhlIGxpc3Qgb3BlcmF0b3IgYnV0dG9ucyAodW5pb24sIGludGVyc2VjdGlvbiwgZXRjLilcblx0dGhpcy5yb290LnNlbGVjdEFsbCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIC5idXR0b24ubGlzdG9wJylcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHQvLyBhZGQgbXkgc3ltYm9sIHRvIHRoZSBmb3JtdWxhXG5cdFx0bGV0IGluZWx0ID0gc2VsZi5mb3JtLmZvcm11bGE7XG5cdFx0bGV0IG9wID0gZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJuYW1lXCIpO1xuXHRcdHNlbGYuYWRkVG9MaXN0RXhwcihvcCk7XG5cdFx0c2VsZi52YWxpZGF0ZUV4cHIoKTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbjogcmVmcmVzaCBidXR0b24gZm9yIHJ1bm5pbmcgdGhlIGZvcm11bGFcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIC5idXR0b25bbmFtZT1cInJlZnJlc2hcIl0nKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGxldCBlbWVzc2FnZT1cIkknbSB0ZXJyaWJseSBzb3JyeSwgYnV0IHRoZXJlIGFwcGVhcnMgdG8gYmUgYSBwcm9ibGVtIHdpdGggeW91ciBsaXN0IGV4cHJlc3Npb246IFwiO1xuXHRcdGxldCBmb3JtdWxhID0gdGhpcy5mb3JtLmZvcm11bGEudmFsdWUudHJpbSgpO1xuXHRcdGlmIChmb3JtdWxhLmxlbmd0aCA9PT0gMClcblx0XHQgICAgcmV0dXJuO1xuXHQgICAgICAgIHRoaXMuYXBwLmxpc3RNYW5hZ2VyXG5cdFx0ICAgIC5ldmFsRm9ybXVsYShmb3JtdWxhKVxuXHRcdCAgICAudGhlbihpZHMgPT4ge1xuXHRcdCAgICAgICAgdGhpcy5mb3JtLmlkcy52YWx1ZSA9IGlkcy5qb2luKFwiXFxuXCIpO1xuXHRcdCAgICAgfSlcblx0XHQgICAgLmNhdGNoKGUgPT4gYWxlcnQoZW1lc3NhZ2UgKyBlKSk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IGNsb3NlIGZvcm11bGEgZWRpdG9yXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uW25hbWU9XCJjbG9zZVwiXScpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpICk7XG5cdFxuXHQvLyBDbGlja2luZyB0aGUgYm94IGNvbGxhcHNlIGJ1dHRvbiBzaG91bGQgY2xlYXIgdGhlIGZvcm1cblx0dGhpcy5yb290LnNlbGVjdChcIi5idXR0b24uY2xvc2VcIilcblx0ICAgIC5vbihcImNsaWNrLmV4dHJhXCIsICgpID0+IHtcblx0ICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuXHRcdHRoaXMuY2xvc2VGb3JtdWxhRWRpdG9yKCk7XG5cdCAgICB9KTtcbiAgICB9XG4gICAgcGFyc2VJZHMgKHMpIHtcblx0cmV0dXJuIHMucmVwbGFjZSgvWyx8XS9nLCAnICcpLnRyaW0oKS5zcGxpdCgvXFxzKy8pO1xuICAgIH1cbiAgICBnZXQgbGlzdCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0O1xuICAgIH1cbiAgICBzZXQgbGlzdCAobHN0KSB7XG4gICAgICAgIHRoaXMuX2xpc3QgPSBsc3Q7XG5cdHRoaXMuX3N5bmNEaXNwbGF5KCk7XG4gICAgfVxuICAgIF9zeW5jRGlzcGxheSAoKSB7XG5cdGxldCBsc3QgPSB0aGlzLl9saXN0O1xuXHRpZiAoIWxzdCkge1xuXHQgICAgdGhpcy5mb3JtLm5hbWUudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5pZHMudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSBmYWxzZTtcblx0ICAgIHRoaXMuZm9ybS5tb2RpZmllZC52YWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5mb3JtLmZvcm11bGEudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5zYXZlLmRpc2FibGVkID0gdHJ1ZTtcblx0ICAgIHRoaXMuZm9ybS50b01naS5kaXNhYmxlZCA9IHRydWU7XG5cdCAgICB0aGlzLmZvcm0udG9Nb3VzZU1pbmUuZGlzYWJsZWQgPSB0cnVlO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy5mb3JtLm5hbWUudmFsdWUgPSBsc3QubmFtZTtcblx0ICAgIHRoaXMuZm9ybS5pZHMudmFsdWUgPSBsc3QuaWRzLmpvaW4oJ1xcbicpO1xuXHQgICAgdGhpcy5mb3JtLmZvcm11bGEudmFsdWUgPSBsc3QuZm9ybXVsYSB8fCBcIlwiO1xuXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlLnRyaW0oKS5sZW5ndGggPiAwO1xuXHQgICAgdGhpcy5mb3JtLm1vZGlmaWVkLnZhbHVlID0gbHN0Lm1vZGlmaWVkO1xuXHQgICAgdGhpcy5mb3JtLnNhdmUuZGlzYWJsZWQgPSBmYWxzZTtcblx0ICAgIHRoaXMuZm9ybS50b01naS5kaXNhYmxlZCBcblx0ICAgICAgPSB0aGlzLmZvcm0udG9Nb3VzZU1pbmUuZGlzYWJsZWQgXG5cdCAgICAgICAgPSAodGhpcy5mb3JtLmlkcy52YWx1ZS50cmltKCkubGVuZ3RoID09PSAwKTtcblx0fVxuXHR0aGlzLnZhbGlkYXRlRXhwcigpO1xuICAgIH1cbiAgICBjbGVhciAoKSB7XG4gICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG4gICAgfVxuICAgIG9wZW4gKGxzdCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBsc3Q7XG5cdHRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIsIGZhbHNlKTtcbiAgICB9XG4gICAgY2xvc2UgKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiLCB0cnVlKTtcbiAgICB9XG4gICAgb3BlbkZvcm11bGFFZGl0b3IgKCkge1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImVkaXRpbmdmb3JtdWxhXCIsIHRydWUpO1xuXHR0aGlzLmlzRWRpdGluZ0Zvcm11bGEgPSB0cnVlO1xuXHRsZXQgZiA9IHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlO1xuXHR0aGlzLmZvcm0uZm9ybXVsYS5mb2N1cygpO1xuXHRzZXRDYXJldFBvc2l0aW9uKHRoaXMuZm9ybS5mb3JtdWxhLCBmLmxlbmd0aCk7XG4gICAgfVxuICAgIGNsb3NlRm9ybXVsYUVkaXRvciAoKSB7XG5cdHRoaXMucm9vdC5jbGFzc2VkKFwiZWRpdGluZ2Zvcm11bGFcIiwgZmFsc2UpO1xuXHR0aGlzLmlzRWRpdGluZ0Zvcm11bGEgPSBmYWxzZTtcbiAgICB9XG4gICAgdG9nZ2xlRm9ybXVsYUVkaXRvciAoKSB7XG5cdGxldCBzaG93aW5nID0gdGhpcy5yb290LmNsYXNzZWQoXCJlZGl0aW5nZm9ybXVsYVwiKTtcblx0c2hvd2luZyA/IHRoaXMuY2xvc2VGb3JtdWxhRWRpdG9yKCkgOiB0aGlzLm9wZW5Gb3JtdWxhRWRpdG9yKCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENoZWNrcyB0aGUgY3VycmVudCBleHByZXNzaW9uIGFuZCBzZXRzIHRoZSB2YWxpZC9pbnZhbGlkIGNsYXNzLlxuICAgIHZhbGlkYXRlRXhwciAgKCkge1xuXHRsZXQgaW5wID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIFtuYW1lPVwiZm9ybXVsYVwiXScpO1xuXHRsZXQgZXhwciA9IGlucFswXVswXS52YWx1ZS50cmltKCk7XG5cdGlmICghZXhwcikge1xuXHQgICAgaW5wLmNsYXNzZWQoXCJ2YWxpZFwiLGZhbHNlKS5jbGFzc2VkKFwiaW52YWxpZFwiLGZhbHNlKTtcbiBcdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gZmFsc2U7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICBsZXQgaXNWYWxpZCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLmlzVmFsaWQoZXhwcik7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdCAgICBpbnAuY2xhc3NlZChcInZhbGlkXCIsIGlzVmFsaWQpLmNsYXNzZWQoXCJpbnZhbGlkXCIsICFpc1ZhbGlkKTtcbiBcdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gdHJ1ZTtcblx0fVxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhZGRUb0xpc3RFeHByICh0ZXh0KSB7XG5cdGxldCBpbnAgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gW25hbWU9XCJmb3JtdWxhXCJdJyk7XG5cdGxldCBpZWx0ID0gaW5wWzBdWzBdO1xuXHRsZXQgdiA9IGllbHQudmFsdWU7XG5cdGxldCBzcGxpY2UgPSBmdW5jdGlvbiAoZSx0KXtcblx0ICAgIGxldCB2ID0gZS52YWx1ZTtcblx0ICAgIGxldCByID0gZ2V0Q2FyZXRSYW5nZShlKTtcblx0ICAgIGUudmFsdWUgPSB2LnNsaWNlKDAsclswXSkgKyB0ICsgdi5zbGljZShyWzFdKTtcblx0ICAgIHNldENhcmV0UG9zaXRpb24oZSwgclswXSt0Lmxlbmd0aCk7XG5cdCAgICBlLmZvY3VzKCk7XG5cdH1cblx0bGV0IHJhbmdlID0gZ2V0Q2FyZXRSYW5nZShpZWx0KTtcblx0aWYgKHJhbmdlWzBdID09PSByYW5nZVsxXSkge1xuXHQgICAgLy8gbm8gY3VycmVudCBzZWxlY3Rpb25cblx0ICAgIHNwbGljZShpZWx0LCB0ZXh0KTtcblx0ICAgIGlmICh0ZXh0ID09PSBcIigpXCIpIFxuXHRcdG1vdmVDYXJldFBvc2l0aW9uKGllbHQsIC0xKTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIC8vIHRoZXJlIGlzIGEgY3VycmVudCBzZWxlY3Rpb25cblx0ICAgIGlmICh0ZXh0ID09PSBcIigpXCIpXG5cdFx0Ly8gc3Vycm91bmQgY3VycmVudCBzZWxlY3Rpb24gd2l0aCBwYXJlbnMsIHRoZW4gbW92ZSBjYXJldCBhZnRlclxuXHRcdHRleHQgPSAnKCcgKyB2LnNsaWNlKHJhbmdlWzBdLHJhbmdlWzFdKSArICcpJztcblx0ICAgIHNwbGljZShpZWx0LCB0ZXh0KVxuXHR9XG5cdHRoaXMudmFsaWRhdGVFeHByKCk7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgTGlzdEVkaXRvclxuXG5leHBvcnQgeyBMaXN0RWRpdG9yIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0RWRpdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBGYWNldCB9IGZyb20gJy4vRmFjZXQnO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIEZhY2V0TWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKGFwcCkge1xuXHR0aGlzLmFwcCA9IGFwcDtcblx0dGhpcy5mYWNldHMgPSBbXTtcblx0dGhpcy5uYW1lMmZhY2V0ID0ge31cbiAgICB9XG4gICAgYWRkRmFjZXQgKG5hbWUsIHZhbHVlRmNuKSB7XG5cdGlmICh0aGlzLm5hbWUyZmFjZXRbbmFtZV0pIHRocm93IFwiRHVwbGljYXRlIGZhY2V0IG5hbWUuIFwiICsgbmFtZTtcblx0bGV0IGZhY2V0ID0gbmV3IEZhY2V0KG5hbWUsIHRoaXMsIHZhbHVlRmNuKTtcbiAgICAgICAgdGhpcy5mYWNldHMucHVzaCggZmFjZXQgKTtcblx0dGhpcy5uYW1lMmZhY2V0W25hbWVdID0gZmFjZXQ7XG5cdHJldHVybiBmYWNldFxuICAgIH1cbiAgICB0ZXN0IChmKSB7XG4gICAgICAgIGxldCB2YWxzID0gdGhpcy5mYWNldHMubWFwKCBmYWNldCA9PiBmYWNldC50ZXN0KGYpICk7XG5cdHJldHVybiB2YWxzLnJlZHVjZSgoYWNjdW0sIHZhbCkgPT4gYWNjdW0gJiYgdmFsLCB0cnVlKTtcbiAgICB9XG4gICAgYXBwbHlBbGwgKCkge1xuXHRsZXQgc2hvdyA9IG51bGw7XG5cdGxldCBoaWRlID0gXCJub25lXCI7XG5cdC8vIEZJWE1FOiBtYWpvciByZWFjaG92ZXJcblx0dGhpcy5hcHAuem9vbVZpZXcuc3ZnTWFpbi5zZWxlY3QoXCJnLnN0cmlwc1wiKS5zZWxlY3RBbGwoJ3JlY3QuZmVhdHVyZScpXG5cdCAgICAuc3R5bGUoXCJkaXNwbGF5XCIsIGYgPT4gdGhpcy50ZXN0KGYpID8gc2hvdyA6IGhpZGUpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEZhY2V0TWFuYWdlclxuXG5leHBvcnQgeyBGYWNldE1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZhY2V0TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBGYWNldCB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUsIG1hbmFnZXIsIHZhbHVlRmNuKSB7XG5cdHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cdHRoaXMudmFsdWVzID0gW107XG5cdHRoaXMudmFsdWVGY24gPSB2YWx1ZUZjbjtcbiAgICB9XG4gICAgc2V0VmFsdWVzICh2YWx1ZXMsIHF1aWV0bHkpIHtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG5cdGlmICghIHF1aWV0bHkpIHtcblx0ICAgIHRoaXMubWFuYWdlci5hcHBseUFsbCgpO1xuXHQgICAgdGhpcy5tYW5hZ2VyLmFwcC56b29tVmlldy5oaWdobGlnaHQoKTtcblx0fVxuICAgIH1cbiAgICB0ZXN0IChmKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy52YWx1ZXMgfHwgdGhpcy52YWx1ZXMubGVuZ3RoID09PSAwIHx8IHRoaXMudmFsdWVzLmluZGV4T2YoIHRoaXMudmFsdWVGY24oZikgKSA+PSAwO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEZhY2V0XG5cbmV4cG9ydCB7IEZhY2V0IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GYWNldC5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgZDN0c3YgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEJsb2NrVHJhbnNsYXRvciB9IGZyb20gJy4vQmxvY2tUcmFuc2xhdG9yJztcbmltcG9ydCB7IEtleVN0b3JlIH0gZnJvbSAnLi9LZXlTdG9yZSc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQmxvY2tUcmFuc2xhdG9yIG1hbmFnZXIgY2xhc3MuIEZvciBhbnkgZ2l2ZW4gcGFpciBvZiBnZW5vbWVzLCBBIGFuZCBCLCBsb2FkcyB0aGUgc2luZ2xlIGJsb2NrIGZpbGVcbi8vIGZvciB0cmFuc2xhdGluZyBiZXR3ZWVuIHRoZW0sIGFuZCBpbmRleGVzIGl0IFwiZnJvbSBib3RoIGRpcmVjdGlvbnNcIjpcbi8vIFx0QS0+Qi0+IFtBQl9CbG9ja0ZpbGVdIDwtQTwtQlxuLy9cbmNsYXNzIEJUTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcblx0dGhpcy5yY0Jsb2NrcyA9IHt9O1xuXHR0aGlzLmJsb2NrU3RvcmUgPSBuZXcgS2V5U3RvcmUoJ3N5bnRlbnktYmxvY2tzJyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVnaXN0ZXJCbG9ja3MgKGFHZW5vbWUsIGJHZW5vbWUsIGJsb2Nrcykge1xuXHRsZXQgYW5hbWUgPSBhR2Vub21lLm5hbWU7XG5cdGxldCBibmFtZSA9IGJHZW5vbWUubmFtZTtcblx0Y29uc29sZS5sb2coYFJlZ2lzdGVyaW5nIGJsb2NrczogJHthbmFtZX0gdnMgJHtibmFtZX1gLCBibG9ja3MpO1xuXHRsZXQgYmxrRmlsZSA9IG5ldyBCbG9ja1RyYW5zbGF0b3IoYUdlbm9tZSxiR2Vub21lLGJsb2Nrcyk7XG5cdGlmKCAhIHRoaXMucmNCbG9ja3NbYW5hbWVdKSB0aGlzLnJjQmxvY2tzW2FuYW1lXSA9IHt9O1xuXHRpZiggISB0aGlzLnJjQmxvY2tzW2JuYW1lXSkgdGhpcy5yY0Jsb2Nrc1tibmFtZV0gPSB7fTtcblx0dGhpcy5yY0Jsb2Nrc1thbmFtZV1bYm5hbWVdID0gYmxrRmlsZTtcblx0dGhpcy5yY0Jsb2Nrc1tibmFtZV1bYW5hbWVdID0gYmxrRmlsZTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBMb2FkcyB0aGUgc3ludGVueSBibG9jayBmaWxlIGZvciBnZW5vbWVzIGFHZW5vbWUgYW5kIGJHZW5vbWUuXG4gICAgLy8gXG4gICAgZ2V0QmxvY2tGaWxlIChhR2Vub21lLCBiR2Vub21lKSB7XG5cdC8vIEJlIGEgbGl0dGxlIHNtYXJ0IGFib3V0IHRoZSBvcmRlciB3ZSB0cnkgdGhlIG5hbWVzLi4uXG5cdGlmIChiR2Vub21lLm5hbWUgPCBhR2Vub21lLm5hbWUpIHtcblx0ICAgIGxldCB0bXAgPSBhR2Vub21lOyBhR2Vub21lID0gYkdlbm9tZTsgYkdlbm9tZSA9IHRtcDtcblx0fVxuXHQvLyBGaXJzdCwgc2VlIGlmIHdlIGFscmVhZHkgaGF2ZSB0aGlzIHBhaXJcblx0bGV0IGFuYW1lID0gYUdlbm9tZS5uYW1lO1xuXHRsZXQgYm5hbWUgPSBiR2Vub21lLm5hbWU7XG5cdGxldCBiZiA9ICh0aGlzLnJjQmxvY2tzW2FuYW1lXSB8fCB7fSlbYm5hbWVdO1xuXHRpZiAoYmYpXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGJmKTtcblx0XG5cdC8vIFNlY29uZCwgdHJ5IGxvY2FsIGRpc2sgY2FjaGVcblx0bGV0IGtleSA9IGFuYW1lICsgJy0nICsgYm5hbWU7XG5cdHJldHVybiB0aGlzLmJsb2NrU3RvcmUuZ2V0KGtleSkudGhlbihkYXRhID0+IHtcblx0ICAgIGlmIChkYXRhKSB7XG5cdFx0Y29uc29sZS5sb2coXCJGb3VuZCBibG9ja3MgaW4gY2FjaGUuXCIpO1xuXHQgICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdGVyQmxvY2tzKGFHZW5vbWUsIGJHZW5vbWUsIGRhdGEpO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZiAodGhpcy5zZXJ2ZXJSZXF1ZXN0KSB7XG5cdCAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW4gb3V0c3RhbmRpbmcgcmVxdWVzdCwgd2FpdCB1bnRpbCBpdCdzIGRvbmUgYW5kIHRyeSBhZ2Fpbi5cblx0XHR0aGlzLnNlcnZlclJlcXVlc3QudGhlbigoKT0+dGhpcy5nZXRCbG9ja0ZpbGUoYUdlbm9tZSwgYkdlbm9tZSkpO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0Ly8gVGhpcmQsIGxvYWQgZnJvbSBzZXJ2ZXIuXG5cdFx0bGV0IGZuID0gYC4vZGF0YS9nZW5vbWVkYXRhL2Jsb2Nrcy50c3ZgXG5cdFx0Y29uc29sZS5sb2coXCJSZXF1ZXN0aW5nIGJsb2NrIGZpbGUgZnJvbTogXCIgKyBmbik7XG5cdFx0dGhpcy5zZXJ2ZXJSZXF1ZXN0ID0gZDN0c3YoZm4pLnRoZW4oYmxvY2tzID0+IHtcblx0XHQgICAgbGV0IHJicyA9IGJsb2Nrcy5yZWR1Y2UoIChhLGIpID0+IHtcblx0XHQgICAgbGV0IGsgPSBiLmFHZW5vbWUgKyAnLScgKyBiLmJHZW5vbWU7XG5cdFx0ICAgIGlmICghKGsgaW4gYSkpIGFba10gPSBbXTtcblx0XHQgICAgICAgIGFba10ucHVzaChiKTtcblx0XHRcdHJldHVybiBhO1xuXHRcdCAgICB9LCB7fSk7XG5cdFx0ICAgIGZvciAobGV0IG4gaW4gcmJzKSB7XG5cdFx0ICAgICAgICB0aGlzLmJsb2NrU3RvcmUuc2V0KG4sIHJic1tuXSk7XG5cdFx0ICAgIH1cblx0XHR9KTtcblx0XHRyZXR1cm4gdGhpcy5zZXJ2ZXJSZXF1ZXN0O1xuXHQgICAgfVxuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHRoZSB0cmFuc2xhdG9yIGhhcyBsb2FkZWQgYWxsIHRoZSBkYXRhIG5lZWRlZFxuICAgIC8vIGZvciB0cmFuc2xhdGluZyBjb29yZGluYXRlcyBiZXR3ZWVuIHRoZSBjdXJyZW50IHJlZiBzdHJhaW4gYW5kIHRoZSBjdXJyZW50IGNvbXBhcmlzb24gc3RyYWlucy5cbiAgICAvL1xuICAgIHJlYWR5ICgpIHtcblx0bGV0IHByb21pc2VzID0gdGhpcy5hcHAuY0dlbm9tZXMubWFwKGNnID0+IHRoaXMuZ2V0QmxvY2tGaWxlKHRoaXMuYXBwLnJHZW5vbWUsIGNnKSk7XG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBzeW50ZW55IGJsb2NrIHRyYW5zbGF0b3IgdGhhdCBtYXBzIHRoZSBjdXJyZW50IHJlZiBnZW5vbWUgdG8gdGhlIHNwZWNpZmllZCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIGdldEJsb2NrcyAoZnJvbUdlbm9tZSwgdG9HZW5vbWUpIHtcbiAgICAgICAgbGV0IGJsa1RyYW5zID0gdGhpcy5yY0Jsb2Nrc1tmcm9tR2Vub21lLm5hbWVdW3RvR2Vub21lLm5hbWVdO1xuXHRyZXR1cm4gYmxrVHJhbnMuZ2V0QmxvY2tzKGZyb21HZW5vbWUpXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVHJhbnNsYXRlcyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSBzcGVjaWZpZWQgZnJvbUdlbm9tZSB0byB0aGUgc3BlY2lmaWVkIHRvR2Vub21lLlxuICAgIC8vIFJldHVybnMgYSBsaXN0IG9mIHplcm8gb3IgbW9yZSBjb29yZGluYXRlIHJhbmdlcyBpbiB0aGUgdG9HZW5vbWUuXG4gICAgLy9cbiAgICB0cmFuc2xhdGUgKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCwgdG9HZW5vbWUsIGludmVydGVkKSB7XG5cdC8vIGdldCB0aGUgcmlnaHQgYmxvY2sgZmlsZVxuXHRsZXQgYmxrVHJhbnMgPSB0aGlzLnJjQmxvY2tzW2Zyb21HZW5vbWUubmFtZV1bdG9HZW5vbWUubmFtZV07XG5cdGlmICghYmxrVHJhbnMpIHRocm93IFwiSW50ZXJuYWwgZXJyb3IuIE5vIGJsb2NrIGZpbGUgZm91bmQgaW4gaW5kZXguXCJcblx0Ly8gdHJhbnNsYXRlIVxuXHRsZXQgcmFuZ2VzID0gYmxrVHJhbnMudHJhbnNsYXRlKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCwgaW52ZXJ0ZWQpO1xuXHRyZXR1cm4gcmFuZ2VzO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhckNhY2hlZERhdGEgKCkge1xuXHRjb25zb2xlLmxvZyhcIkJUTWFuYWdlcjogQ2FjaGUgY2xlYXJlZC5cIilcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvY2tTdG9yZS5jbGVhcigpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEJUTWFuYWdlclxuXG5leHBvcnQgeyBCVE1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0JUTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTb21ldGhpbmcgdGhhdCBrbm93cyBob3cgdG8gdHJhbnNsYXRlIGNvb3JkaW5hdGVzIGJldHdlZW4gdHdvIGdlbm9tZXMuXG4vL1xuLy9cbmNsYXNzIEJsb2NrVHJhbnNsYXRvciB7XG4gICAgY29uc3RydWN0b3IoYUdlbm9tZSwgYkdlbm9tZSwgYmxvY2tzKXtcblx0dGhpcy5hR2Vub21lID0gYUdlbm9tZTtcblx0dGhpcy5iR2Vub21lID0gYkdlbm9tZTtcblx0dGhpcy5ibG9ja3MgPSBibG9ja3MubWFwKGIgPT4gdGhpcy5wcm9jZXNzQmxvY2soYikpXG5cdHRoaXMuY3VyclNvcnQgPSBcImFcIjsgLy8gZWl0aGVyICdhJyBvciAnYidcbiAgICB9XG4gICAgcHJvY2Vzc0Jsb2NrIChibGspIHsgXG4gICAgICAgIGJsay5hSW5kZXggPSBwYXJzZUludChibGsuYUluZGV4KTtcbiAgICAgICAgYmxrLmJJbmRleCA9IHBhcnNlSW50KGJsay5iSW5kZXgpO1xuICAgICAgICBibGsuYVN0YXJ0ID0gcGFyc2VJbnQoYmxrLmFTdGFydCk7XG4gICAgICAgIGJsay5iU3RhcnQgPSBwYXJzZUludChibGsuYlN0YXJ0KTtcbiAgICAgICAgYmxrLmFFbmQgICA9IHBhcnNlSW50KGJsay5hRW5kKTtcbiAgICAgICAgYmxrLmJFbmQgICA9IHBhcnNlSW50KGJsay5iRW5kKTtcbiAgICAgICAgYmxrLmFMZW5ndGggICA9IHBhcnNlSW50KGJsay5hTGVuZ3RoKTtcbiAgICAgICAgYmxrLmJMZW5ndGggICA9IHBhcnNlSW50KGJsay5iTGVuZ3RoKTtcbiAgICAgICAgYmxrLmJsb2NrQ291bnQgICA9IHBhcnNlSW50KGJsay5ibG9ja0NvdW50KTtcbiAgICAgICAgYmxrLmJsb2NrUmF0aW8gICA9IHBhcnNlRmxvYXQoYmxrLmJsb2NrUmF0aW8pO1xuXHRibGsuYWJNYXAgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHQgICAgLmRvbWFpbihbYmxrLmFTdGFydCxibGsuYUVuZF0pXG5cdCAgICAucmFuZ2UoIGJsay5ibG9ja09yaT09PVwiLVwiID8gW2Jsay5iRW5kLGJsay5iU3RhcnRdIDogW2Jsay5iU3RhcnQsYmxrLmJFbmRdKTtcblx0YmxrLmJhTWFwID0gYmxrLmFiTWFwLmludmVydFxuXHRyZXR1cm4gYmxrO1xuICAgIH1cbiAgICBzZXRTb3J0ICh3aGljaCkge1xuXHRpZiAod2hpY2ggIT09ICdhJyAmJiB3aGljaCAhPT0gJ2InKSB0aHJvdyBcIkJhZCBhcmd1bWVudDpcIiArIHdoaWNoO1xuXHRsZXQgc29ydENvbCA9IHdoaWNoICsgXCJJbmRleFwiO1xuXHRsZXQgY21wID0gKHgseSkgPT4geFtzb3J0Q29sXSAtIHlbc29ydENvbF07XG5cdHRoaXMuYmxvY2tzLnNvcnQoY21wKTtcblx0dGhpcy5jdXJyU29ydCA9IHdoaWNoO1xuICAgIH1cbiAgICBmbGlwU29ydCAoKSB7XG5cdHRoaXMuc2V0U29ydCh0aGlzLmN1cnJTb3J0ID09PSBcImFcIiA/IFwiYlwiIDogXCJhXCIpO1xuICAgIH1cbiAgICAvLyBHaXZlbiBhIGdlbm9tZSAoZWl0aGVyIHRoZSBhIG9yIGIgZ2Vub21lKSBhbmQgYSBjb29yZGluYXRlIHJhbmdlLFxuICAgIC8vIHJldHVybnMgdGhlIGVxdWl2YWxlbnQgY29vcmRpbmF0ZSByYW5nZShzKSBpbiB0aGUgb3RoZXIgZ2Vub21lXG4gICAgdHJhbnNsYXRlIChmcm9tR2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQsIGludmVydCkge1xuXHQvL1xuXHRlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHN0YXJ0IDogZW5kO1xuXHQvLyBmcm9tID0gXCJhXCIgb3IgXCJiXCIsIGRlcGVuZGluZyBvbiB3aGljaCBnZW5vbWUgaXMgZ2l2ZW4uXG4gICAgICAgIGxldCBmcm9tID0gKGZyb21HZW5vbWUgPT09IHRoaXMuYUdlbm9tZSA/IFwiYVwiIDogZnJvbUdlbm9tZSA9PT0gdGhpcy5iR2Vub21lID8gXCJiXCIgOiBudWxsKTtcblx0aWYgKCFmcm9tKSB0aHJvdyBcIkJhZCBhcmd1bWVudC4gR2Vub21lIG5laXRoZXIgQSBub3IgQi5cIjtcblx0Ly8gdG8gPSBcImJcIiBvciBcImFcIiwgb3Bwb3NpdGUgb2YgZnJvbVxuXHRsZXQgdG8gPSAoZnJvbSA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcblx0Ly8gbWFrZSBzdXJlIHRoZSBibG9ja3MgYXJlIHNvcnRlZCBieSB0aGUgZnJvbSBnZW5vbWVcblx0dGhpcy5zZXRTb3J0KGZyb20pO1xuXHQvL1xuXHRsZXQgZnJvbUMgPSBmcm9tK1wiQ2hyXCI7XG5cdGxldCBmcm9tUyA9IGZyb20rXCJTdGFydFwiO1xuXHRsZXQgZnJvbUUgPSBmcm9tK1wiRW5kXCI7XG5cdGxldCBmcm9tSSA9IGZyb20rXCJJbmRleFwiO1xuXHRsZXQgdG9DID0gdG8rXCJDaHJcIjtcblx0bGV0IHRvUyA9IHRvK1wiU3RhcnRcIjtcblx0bGV0IHRvRSA9IHRvK1wiRW5kXCI7XG5cdGxldCB0b0kgPSB0bytcIkluZGV4XCI7XG5cdGxldCBtYXBwZXIgPSBmcm9tK3RvK1wiTWFwXCI7XG5cdC8vIFxuXHRsZXQgYmxrcyA9IHRoaXMuYmxvY2tzXG5cdCAgICAvLyBGaXJzdCBmaWx0ZXIgZm9yIGJsb2NrcyB0aGF0IG92ZXJsYXAgdGhlIGdpdmVuIGNvb3JkaW5hdGUgcmFuZ2UgaW4gdGhlIGZyb20gZ2Vub21lXG5cdCAgICAuZmlsdGVyKGJsayA9PiBibGtbZnJvbUNdID09PSBjaHIgJiYgYmxrW2Zyb21TXSA8PSBlbmQgJiYgYmxrW2Zyb21FXSA+PSBzdGFydClcblx0ICAgIC8vIG1hcCBlYWNoIGJsb2NrLiBcblx0ICAgIC5tYXAoYmxrID0+IHtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgZnJvbSBzaWRlLlxuXHRcdGxldCBzID0gTWF0aC5tYXgoc3RhcnQsIGJsa1tmcm9tU10pO1xuXHRcdGxldCBlID0gTWF0aC5taW4oZW5kLCBibGtbZnJvbUVdKTtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgdG8gc2lkZS5cblx0XHRsZXQgczIgPSBNYXRoLmNlaWwoYmxrW21hcHBlcl0ocykpO1xuXHRcdGxldCBlMiA9IE1hdGguZmxvb3IoYmxrW21hcHBlcl0oZSkpO1xuXHQgICAgICAgIHJldHVybiBpbnZlcnQgPyB7XG5cdFx0ICAgIGNocjogICBibGtbZnJvbUNdLFxuXHRcdCAgICBzdGFydDogcyxcblx0XHQgICAgZW5kOiAgIGUsXG5cdFx0ICAgIG9yaTogICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGluZGV4OiBibGtbZnJvbUldLFxuXHRcdCAgICAvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZHMgZm9yIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0ICAgIGZDaHI6ICAgYmxrW3RvQ10sXG5cdFx0ICAgIGZTdGFydDogTWF0aC5taW4oczIsZTIpLFxuXHRcdCAgICBmRW5kOiAgIE1hdGgubWF4KHMyLGUyKSxcblx0XHQgICAgZkluZGV4OiBibGtbdG9JXSxcblx0XHQgICAgLy8gaW5jbHVkZSB0aGUgYmxvY2sgaWQgYW5kIGZ1bGwgYmxvY2sgY29vcmRzXG5cdFx0ICAgIGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdCAgICBibG9ja1N0YXJ0OiBibGtbZnJvbVNdLFxuXHRcdCAgICBibG9ja0VuZDogYmxrW2Zyb21FXVxuXHRcdH0gOiB7XG5cdFx0ICAgIGNocjogICBibGtbdG9DXSxcblx0XHQgICAgc3RhcnQ6IE1hdGgubWluKHMyLGUyKSxcblx0XHQgICAgZW5kOiAgIE1hdGgubWF4KHMyLGUyKSxcblx0XHQgICAgb3JpOiAgIGJsay5ibG9ja09yaSxcblx0XHQgICAgaW5kZXg6IGJsa1t0b0ldLFxuXHRcdCAgICAvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZHMgZm9yIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0ICAgIGZDaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgZlN0YXJ0OiBzLFxuXHRcdCAgICBmRW5kOiAgIGUsXG5cdFx0ICAgIGZJbmRleDogYmxrW2Zyb21JXSxcblx0XHQgICAgLy8gaW5jbHVkZSB0aGUgYmxvY2sgaWQgYW5kIGZ1bGwgYmxvY2sgY29vcmRzXG5cdFx0ICAgIGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdCAgICBibG9ja1N0YXJ0OiBibGtbdG9TXSxcblx0XHQgICAgYmxvY2tFbmQ6IGJsa1t0b0VdXG5cdFx0fTtcblx0ICAgIH0pO1xuXHRpZiAoIWludmVydCkge1xuXHQgICAgLy8gTG9vayBmb3IgMS1ibG9jayBnYXBzIGFuZCBmaWxsIHRoZW0gaW4uIFxuXHQgICAgYmxrcy5zb3J0KChhLGIpID0+IGEuaW5kZXggLSBiLmluZGV4KTtcblx0ICAgIGxldCBuYnMgPSBbXTtcblx0ICAgIGJsa3MuZm9yRWFjaCggKGIsIGkpID0+IHtcblx0XHRpZiAoaSA9PT0gMCkgcmV0dXJuO1xuXHRcdGlmIChibGtzW2ldLmluZGV4IC0gYmxrc1tpIC0gMV0uaW5kZXggPT09IDIpIHtcblx0XHQgICAgbGV0IGJsayA9IHRoaXMuYmxvY2tzLmZpbHRlciggYiA9PiBiW3RvSV0gPT09IGJsa3NbaV0uaW5kZXggLSAxIClbMF07XG5cdFx0ICAgIG5icy5wdXNoKHtcblx0XHRcdGNocjogICBibGtbdG9DXSxcblx0XHRcdHN0YXJ0OiBibGtbdG9TXSxcblx0XHRcdGVuZDogICBibGtbdG9FXSxcblx0XHRcdG9yaTogICBibGsuYmxvY2tPcmksXG5cdFx0XHRpbmRleDogYmxrW3RvSV0sXG5cdFx0XHQvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZHMgZm9yIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0XHRmQ2hyOiAgIGJsa1tmcm9tQ10sXG5cdFx0XHRmU3RhcnQ6IGJsa1tmcm9tU10sXG5cdFx0XHRmRW5kOiAgIGJsa1tmcm9tRV0sXG5cdFx0XHRmSW5kZXg6IGJsa1tmcm9tSV0sXG5cdFx0XHQvLyBpbmNsdWRlIHRoZSBibG9jayBpZCBhbmQgZnVsbCBibG9jayBjb29yZHNcblx0XHRcdGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdFx0YmxvY2tTdGFydDogYmxrW3RvU10sXG5cdFx0XHRibG9ja0VuZDogYmxrW3RvRV1cblx0XHQgICAgfSk7XG5cdFx0fVxuXHQgICAgfSk7XG5cdCAgICBibGtzID0gYmxrcy5jb25jYXQobmJzKTtcblx0fVxuXHRibGtzLnNvcnQoKGEsYikgPT4gYS5mSW5kZXggLSBiLmZJbmRleCk7XG5cdHJldHVybiBibGtzO1xuICAgIH1cbiAgICAvLyBHaXZlbiBhIGdlbm9tZSAoZWl0aGVyIHRoZSBhIG9yIGIgZ2Vub21lKVxuICAgIC8vIHJldHVybnMgdGhlIGJsb2NrcyBmb3IgdHJhbnNsYXRpbmcgdG8gdGhlIG90aGVyIChiIG9yIGEpIGdlbm9tZS5cbiAgICAvL1xuICAgIGdldEJsb2NrcyAoZnJvbUdlbm9tZSkge1xuXHQvLyBmcm9tID0gXCJhXCIgb3IgXCJiXCIsIGRlcGVuZGluZyBvbiB3aGljaCBnZW5vbWUgaXMgZ2l2ZW4uXG4gICAgICAgIGxldCBmcm9tID0gKGZyb21HZW5vbWUgPT09IHRoaXMuYUdlbm9tZSA/IFwiYVwiIDogZnJvbUdlbm9tZSA9PT0gdGhpcy5iR2Vub21lID8gXCJiXCIgOiBudWxsKTtcblx0aWYgKCFmcm9tKSB0aHJvdyBcIkJhZCBhcmd1bWVudC4gR2Vub21lIG5laXRoZXIgQSBub3IgQi5cIjtcblx0Ly8gdG8gPSBcImJcIiBvciBcImFcIiwgb3Bwb3NpdGUgb2YgZnJvbVxuXHRsZXQgdG8gPSAoZnJvbSA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcblx0Ly8gbWFrZSBzdXJlIHRoZSBibG9ja3MgYXJlIHNvcnRlZCBieSB0aGUgZnJvbSBnZW5vbWVcblx0dGhpcy5zZXRTb3J0KGZyb20pO1xuXHQvL1xuXHRsZXQgZnJvbUMgPSBmcm9tK1wiQ2hyXCI7XG5cdGxldCBmcm9tUyA9IGZyb20rXCJTdGFydFwiO1xuXHRsZXQgZnJvbUUgPSBmcm9tK1wiRW5kXCI7XG5cdGxldCBmcm9tSSA9IGZyb20rXCJJbmRleFwiO1xuXHRsZXQgdG9DID0gdG8rXCJDaHJcIjtcblx0bGV0IHRvUyA9IHRvK1wiU3RhcnRcIjtcblx0bGV0IHRvRSA9IHRvK1wiRW5kXCI7XG5cdGxldCB0b0kgPSB0bytcIkluZGV4XCI7XG5cdGxldCBtYXBwZXIgPSBmcm9tK3RvK1wiTWFwXCI7XG5cdC8vIFxuXHRsZXQgYmxrcyA9IHRoaXMuYmxvY2tzXG5cdCAgICAubWFwKGJsayA9PiB7XG5cdCAgICAgICAgcmV0dXJuIHtcblx0XHQgICAgYmxvY2tJZDogICBibGsuYmxvY2tJZCxcblx0XHQgICAgb3JpOiAgICAgICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGZyb21DaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgZnJvbVN0YXJ0OiBibGtbZnJvbVNdLFxuXHRcdCAgICBmcm9tRW5kOiAgIGJsa1tmcm9tRV0sXG5cdFx0ICAgIGZyb21JbmRleDogYmxrW2Zyb21JXSxcblx0XHQgICAgdG9DaHI6ICAgICBibGtbdG9DXSxcblx0XHQgICAgdG9TdGFydDogICBibGtbdG9TXSxcblx0XHQgICAgdG9FbmQ6ICAgICBibGtbdG9FXSxcblx0XHQgICAgdG9JbmRleDogICBibGtbdG9JXVxuXHRcdH07XG5cdCAgICB9KVxuXHQvLyBcblx0cmV0dXJuIGJsa3M7XG4gICAgfVxufVxuXG5leHBvcnQgeyBCbG9ja1RyYW5zbGF0b3IgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0Jsb2NrVHJhbnNsYXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgU1ZHVmlldyB9IGZyb20gJy4vU1ZHVmlldyc7XG5pbXBvcnQgeyBjb29yZHNBZnRlclRyYW5zZm9ybSB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIEdlbm9tZVZpZXcgZXh0ZW5kcyBTVkdWaWV3IHtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQpO1xuXHR0aGlzLm9wZW5XaWR0aCA9IHRoaXMub3V0ZXJXaWR0aDtcblx0dGhpcy5vcGVuSGVpZ2h0PSB0aGlzLm91dGVySGVpZ2h0O1xuXHR0aGlzLnRvdGFsQ2hyV2lkdGggPSA0MDsgLy8gdG90YWwgd2lkdGggb2Ygb25lIGNocm9tb3NvbWUgKGJhY2tib25lK2Jsb2NrcytmZWF0cylcblx0dGhpcy5jd2lkdGggPSAyMDsgICAgICAgIC8vIGNocm9tb3NvbWUgd2lkdGhcblx0dGhpcy50aWNrTGVuZ3RoID0gMTA7XHQgLy8gZmVhdHVyZSB0aWNrIG1hcmsgbGVuZ3RoXG5cdHRoaXMuYnJ1c2hDaHIgPSBudWxsO1x0IC8vIHdoaWNoIGNociBoYXMgdGhlIGN1cnJlbnQgYnJ1c2hcblx0dGhpcy5id2lkdGggPSB0aGlzLmN3aWR0aC8yOyAgLy8gYmxvY2sgd2lkdGhcblx0dGhpcy5jdXJyQmxvY2tzID0gbnVsbDtcblx0dGhpcy5jdXJyVGlja3MgPSBudWxsO1xuXHR0aGlzLmdDaHJvbW9zb21lcyA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ2cnKS5hdHRyKFwibmFtZVwiLCBcImNocm9tb3NvbWVzXCIpO1xuXHR0aGlzLnRpdGxlICAgID0gdGhpcy5zdmdNYWluLmFwcGVuZCgndGV4dCcpLmF0dHIoXCJjbGFzc1wiLCBcInRpdGxlXCIpO1xuXHR0aGlzLnNjcm9sbEFtb3VudCA9IDA7XG5cdC8vXG5cdHRoaXMuaW5pdERvbSgpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmaXRUb1dpZHRoICh3KXtcbiAgICAgICAgc3VwZXIuZml0VG9XaWR0aCh3KTtcblx0dGhpcy5vcGVuV2lkdGggPSB0aGlzLm91dGVyV2lkdGg7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXREb20gKCkge1xuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uLmNsb3NlJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB0aGlzLnJlZHJhdygpKTtcblx0dGhpcy5zdmcub24oXCJ3aGVlbFwiLCAoKSA9PiB7XG5cdCAgICBpZiAoIXRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIpKSByZXR1cm47XG5cdCAgICB0aGlzLnNjcm9sbFdoZWVsKGQzLmV2ZW50LmRlbHRhWSlcblx0ICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH0pO1xuXHRsZXQgc2JzID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzdmdjb250YWluZXJcIl0gPiBbbmFtZT1cInNjcm9sbGJ1dHRvbnNcIl0nKVxuXHRzYnMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJ1cFwiXScpLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zY3JvbGxDaHJvbW9zb21lc1VwKCkpO1xuXHRzYnMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJkblwiXScpLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zY3JvbGxDaHJvbW9zb21lc0Rvd24oKSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0QnJ1c2hDb29yZHMgKGNvb3Jkcykge1xuXHR0aGlzLmNsZWFyQnJ1c2hlcygpO1xuXHR0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3QoYC5jaHJvbW9zb21lW25hbWU9XCIke2Nvb3Jkcy5jaHJ9XCJdIGdbbmFtZT1cImJydXNoXCJdYClcblx0ICAuZWFjaChmdW5jdGlvbihjaHIpe1xuXHQgICAgY2hyLmJydXNoLmV4dGVudChbY29vcmRzLnN0YXJ0LGNvb3Jkcy5lbmRdKTtcblx0ICAgIGNoci5icnVzaChkMy5zZWxlY3QodGhpcykpO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYnJ1c2hzdGFydCAoY2hyKXtcblx0dGhpcy5jbGVhckJydXNoZXMoY2hyLmJydXNoKTtcblx0dGhpcy5icnVzaENociA9IGNocjtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBicnVzaGVuZCAoKXtcblx0aWYoIXRoaXMuYnJ1c2hDaHIpIHJldHVybjtcblx0bGV0IGNjID0gdGhpcy5hcHAuY29vcmRzO1xuXHR2YXIgeHRudCA9IHRoaXMuYnJ1c2hDaHIuYnJ1c2guZXh0ZW50KCk7XG5cdGlmIChNYXRoLmFicyh4dG50WzBdIC0geHRudFsxXSkgPD0gMTApe1xuXHQgICAgLy8gdXNlciBjbGlja2VkXG5cdCAgICBsZXQgdyA9IGNjLmVuZCAtIGNjLnN0YXJ0ICsgMTtcblx0ICAgIHh0bnRbMF0gLT0gdy8yO1xuXHQgICAgeHRudFsxXSArPSB3LzI7XG5cdH1cblx0bGV0IGNvb3JkcyA9IHsgY2hyOnRoaXMuYnJ1c2hDaHIubmFtZSwgc3RhcnQ6TWF0aC5mbG9vcih4dG50WzBdKSwgZW5kOiBNYXRoLmZsb29yKHh0bnRbMV0pIH07XG5cdHRoaXMuYXBwLnNldENvbnRleHQoY29vcmRzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhckJydXNoZXMgKGV4Y2VwdCl7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbCgnW25hbWU9XCJicnVzaFwiXScpLmVhY2goZnVuY3Rpb24oY2hyKXtcblx0ICAgIGlmIChjaHIuYnJ1c2ggIT09IGV4Y2VwdCkge1xuXHRcdGNoci5icnVzaC5jbGVhcigpO1xuXHRcdGNoci5icnVzaChkMy5zZWxlY3QodGhpcykpO1xuXHQgICAgfVxuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRYIChjaHIpIHtcblx0bGV0IHggPSB0aGlzLmFwcC5yR2Vub21lLnhzY2FsZShjaHIpO1xuXHRpZiAoaXNOYU4oeCkpIHRocm93IFwieCBpcyBOYU5cIlxuXHRyZXR1cm4geDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0WSAocG9zKSB7XG5cdGxldCB5ID0gdGhpcy5hcHAuckdlbm9tZS55c2NhbGUocG9zKTtcblx0aWYgKGlzTmFOKHkpKSB0aHJvdyBcInkgaXMgTmFOXCJcblx0cmV0dXJuIHk7XG4gICAgfVxuICAgIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlZHJhdyAoKSB7XG4gICAgICAgIHRoaXMuZHJhdyh0aGlzLmN1cnJUaWNrcywgdGhpcy5jdXJyQmxvY2tzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3ICh0aWNrRGF0YSwgYmxvY2tEYXRhKSB7XG5cdHRoaXMuZHJhd0Nocm9tb3NvbWVzKCk7XG5cdHRoaXMuZHJhd0Jsb2NrcyhibG9ja0RhdGEpO1xuXHR0aGlzLmRyYXdUaWNrcyh0aWNrRGF0YSk7XG5cdHRoaXMuZHJhd1RpdGxlKCk7XG5cdHRoaXMuc2V0QnJ1c2hDb29yZHModGhpcy5hcHAuY29vcmRzKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgY2hyb21vc29tZXMgb2YgdGhlIHJlZmVyZW5jZSBnZW5vbWUuXG4gICAgLy8gSW5jbHVkZXMgYmFja2JvbmVzLCBsYWJlbHMsIGFuZCBicnVzaGVzLlxuICAgIC8vIFRoZSBiYWNrYm9uZXMgYXJlIGRyYXduIGFzIHZlcnRpY2FsIGxpbmUgc2VtZW50cyxcbiAgICAvLyBkaXN0cmlidXRlZCBob3Jpem9udGFsbHkuIE9yZGVyaW5nIGlzIGRlZmluZWQgYnlcbiAgICAvLyB0aGUgbW9kZWwgKEdlbm9tZSBvYmplY3QpLlxuICAgIC8vIExhYmVscyBhcmUgZHJhd24gYWJvdmUgdGhlIGJhY2tib25lcy5cbiAgICAvL1xuICAgIC8vIE1vZGlmaWNhdGlvbjpcbiAgICAvLyBEcmF3cyB0aGUgc2NlbmUgaW4gb25lIG9mIHR3byBzdGF0ZXM6IG9wZW4gb3IgY2xvc2VkLlxuICAgIC8vIFRoZSBvcGVuIHN0YXRlIGlzIGFzIGRlc2NyaWJlZCAtIGFsbCBjaHJvbW9zb21lcyBzaG93bi5cbiAgICAvLyBJbiB0aGUgY2xvc2VkIHN0YXRlOiBcbiAgICAvLyAgICAgKiBvbmx5IG9uZSBjaHJvbW9zb21lIHNob3dzICh0aGUgY3VycmVudCBvbmUpXG4gICAgLy8gICAgICogZHJhd24gaG9yaXpvbnRhbGx5IGFuZCBwb3NpdGlvbmVkIGJlc2lkZSB0aGUgXCJHZW5vbWUgVmlld1wiIHRpdGxlXG4gICAgLy9cbiAgICBkcmF3Q2hyb21vc29tZXMgKCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0bGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTsgLy8gcmVmIGdlbm9tZVxuXHRsZXQgckNocnMgPSByZy5jaHJvbW9zb21lcztcblxuICAgICAgICAvLyBDaHJvbW9zb21lIGdyb3Vwc1xuXHRsZXQgY2hycyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpXG5cdCAgICAuZGF0YShyQ2hycywgYyA9PiBjLm5hbWUpO1xuXHRsZXQgbmV3Y2hycyA9IGNocnMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsIFwiY2hyb21vc29tZVwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGMgPT4gYy5uYW1lKTtcblx0XG5cdG5ld2NocnMuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwibmFtZVwiLFwibGFiZWxcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwibGluZVwiKS5hdHRyKFwibmFtZVwiLFwiYmFja2JvbmVcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwic3luQmxvY2tzXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIixcInRpY2tzXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIixcImJydXNoXCIpO1xuXG5cblx0bGV0IGNsb3NlZCA9IHRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIpO1xuXHQvLyBzZXQgZGlyZWN0aW9uIG9mIHRoZSByZXNpemUgY3Vyc29yLlxuXHRjaHJzLnNlbGVjdEFsbCgnZ1tuYW1lPVwiYnJ1c2hcIl0gZy5yZXNpemUnKS5zdHlsZSgnY3Vyc29yJywgY2xvc2VkID8gJ2V3LXJlc2l6ZScgOiAnbnMtcmVzaXplJylcblx0Ly9cblx0aWYgKGNsb3NlZCkge1xuXHQgICAgLy8gUmVzZXQgdGhlIFNWRyBzaXplIHRvIGJlIDEtY2hyb21vc29tZSB3aWRlLlxuXHQgICAgLy8gVHJhbnNsYXRlIHRoZSBjaHJvbW9zb21lcyBncm91cCBzbyB0aGF0IHRoZSBjdXJyZW50IGNocm9tb3NvbWUgYXBwZWFycyBpbiB0aGUgc3ZnIGFyZWEuXG5cdCAgICAvLyBUdXJuIGl0IDkwIGRlZy5cblxuXHQgICAgLy8gU2V0IHRoZSBoZWlnaHQgb2YgdGhlIFNWRyBhcmVhIHRvIDEgY2hyb21vc29tZSdzIHdpZHRoXG5cdCAgICB0aGlzLnNldEdlb20oeyBoZWlnaHQ6IHRoaXMudG90YWxDaHJXaWR0aCwgcm90YXRpb246IC05MCwgdHJhbnNsYXRpb246IFstdGhpcy50b3RhbENocldpZHRoLzIsMzBdIH0pO1xuXHQgICAgLy8gXG5cdCAgICBsZXQgZGVsdGEgPSAxMDtcblx0ICAgIHJnLnhzY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuXHRcdCAuZG9tYWluKHJDaHJzLm1hcChmdW5jdGlvbih4KXtyZXR1cm4geC5uYW1lO30pKVxuXHRcdCAvLyBpbiBjbG9zZWQgbW9kZSwgdGhlIGNocm9tb3NvbWVzIGhhdmUgZml4ZWQgc3BhY2luZ1xuXHRcdCAucmFuZ2VQb2ludHMoW2RlbHRhLCBkZWx0YSt0aGlzLnRvdGFsQ2hyV2lkdGgqKHJDaHJzLmxlbmd0aC0xKV0pO1xuXHQgICAgLy9cblx0ICAgIHJnLnlzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0IC5kb21haW4oWzEscmcubWF4bGVuXSlcblx0XHQgLnJhbmdlKFswLCB0aGlzLndpZHRoXSk7XG5cblx0ICAgIC8vIHRyYW5zbGF0ZSBlYWNoIGNocm9tb3NvbWUgaW50byBwb3NpdGlvblxuXHQgICAgY2hycy5hdHRyKFwidHJhbnNmb3JtXCIsIGMgPT4gYHRyYW5zbGF0ZSgke3JnLnhzY2FsZShjLm5hbWUpfSwgMClgKTtcbiAgICAgICAgICAgIC8vIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oLXJnLnhzY2FsZSh0aGlzLmFwcC5jb29yZHMuY2hyKSk7XG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgLy8gV2hlbiBvcGVuLCBkcmF3IGFsbCB0aGUgY2hyb21vc29tZXMuIEVhY2ggY2hyb20gaXMgYSB2ZXJ0aWNhbCBsaW5lLlxuXHQgICAgLy8gQ2hyb21zIGFyZSBkaXN0cmlidXRlZCBldmVubHkgYWNyb3NzIHRoZSBhdmFpbGFibGUgaG9yaXpvbnRhbCBzcGFjZS5cblx0ICAgIHRoaXMuc2V0R2VvbSh7IHdpZHRoOiB0aGlzLm9wZW5XaWR0aCwgaGVpZ2h0OiB0aGlzLm9wZW5IZWlnaHQsIHJvdGF0aW9uOiAwLCB0cmFuc2xhdGlvbjogWzAsMF0gfSk7XG5cdCAgICAvLyBcblx0ICAgIHJnLnhzY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuXHRcdCAuZG9tYWluKHJDaHJzLm1hcChmdW5jdGlvbih4KXtyZXR1cm4geC5uYW1lO30pKVxuXHRcdCAvLyBpbiBjbG9zZWQgbW9kZSwgdGhlIGNocm9tb3NvbWVzIHNwcmVhZCB0byBmaWxsIHRoZSBzcGFjZVxuXHRcdCAucmFuZ2VQb2ludHMoWzAsIHRoaXMub3BlbldpZHRoIC0gMzBdLCAwLjUpO1xuXHQgICAgcmcueXNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQgLmRvbWFpbihbMSxyZy5tYXhsZW5dKVxuXHRcdCAucmFuZ2UoWzAsIHRoaXMuaGVpZ2h0XSk7XG5cblx0ICAgIC8vIHRyYW5zbGF0ZSBlYWNoIGNocm9tb3NvbWUgaW50byBwb3NpdGlvblxuXHQgICAgY2hycy5hdHRyKFwidHJhbnNmb3JtXCIsIGMgPT4gYHRyYW5zbGF0ZSgke3JnLnhzY2FsZShjLm5hbWUpfSwgMClgKTtcbiAgICAgICAgICAgIC8vIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oMCk7XG5cdH1cblxuXHRyQ2hycy5mb3JFYWNoKGNociA9PiB7XG5cdCAgICB2YXIgc2MgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdC5kb21haW4oWzEsY2hyLmxlbmd0aF0pXG5cdFx0LnJhbmdlKFswLCByZy55c2NhbGUoY2hyLmxlbmd0aCldKTtcblx0ICAgIGNoci5icnVzaCA9IGQzLnN2Zy5icnVzaCgpLnkoc2MpXG5cdCAgICAgICAub24oXCJicnVzaHN0YXJ0XCIsIGNociA9PiB0aGlzLmJydXNoc3RhcnQoY2hyKSlcblx0ICAgICAgIC5vbihcImJydXNoZW5kXCIsICgpID0+IHRoaXMuYnJ1c2hlbmQoKSk7XG5cdCAgfSwgdGhpcyk7XG5cblxuICAgICAgICBjaHJzLnNlbGVjdCgnW25hbWU9XCJsYWJlbFwiXScpXG5cdCAgICAudGV4dChjPT5jLm5hbWUpXG5cdCAgICAuYXR0cihcInhcIiwgMCkgXG5cdCAgICAuYXR0cihcInlcIiwgLTIpXG5cdCAgICA7XG5cblx0Y2hycy5zZWxlY3QoJ1tuYW1lPVwiYmFja2JvbmVcIl0nKVxuXHQgICAgLmF0dHIoXCJ4MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ5MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ4MlwiLCAwKVxuXHQgICAgLmF0dHIoXCJ5MlwiLCBjID0+IHJnLnlzY2FsZShjLmxlbmd0aCkpXG5cdCAgICA7XG5cdCAgIFxuXHRjaHJzLnNlbGVjdCgnW25hbWU9XCJicnVzaFwiXScpXG5cdCAgICAuZWFjaChmdW5jdGlvbihkKXtkMy5zZWxlY3QodGhpcykuY2FsbChkLmJydXNoKTt9KVxuXHQgICAgLnNlbGVjdEFsbCgncmVjdCcpXG5cdCAgICAgLmF0dHIoJ3dpZHRoJywxNilcblx0ICAgICAuYXR0cigneCcsIC04KVxuXHQgICAgO1xuXG5cdGNocnMuZXhpdCgpLnJlbW92ZSgpO1xuXHRcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTY3JvbGwgd2hlZWwgZXZlbnQgaGFuZGxlci5cbiAgICBzY3JvbGxXaGVlbCAoZHkpIHtcblx0Ly8gQWRkIGR5IHRvIHRvdGFsIHNjcm9sbCBhbW91bnQuIFRoZW4gdHJhbnNsYXRlIHRoZSBjaHJvbW9zb21lcyBncm91cC5cblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc0J5KGR5KTtcblx0Ly8gQWZ0ZXIgYSAyMDAgbXMgcGF1c2UgaW4gc2Nyb2xsaW5nLCBzbmFwIHRvIG5lYXJlc3QgY2hyb21vc29tZVxuXHR0aGlzLnRvdXQgJiYgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRvdXQpO1xuXHR0aGlzLnRvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKT0+dGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKSwgMjAwKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNUbyAoeCkge1xuICAgICAgICBpZiAoeCA9PT0gdW5kZWZpbmVkKSB4ID0gdGhpcy5zY3JvbGxBbW91bnQ7XG5cdHRoaXMuc2Nyb2xsQW1vdW50ID0gTWF0aC5tYXgoTWF0aC5taW4oeCwxNSksIC10aGlzLnRvdGFsQ2hyV2lkdGggKiAodGhpcy5hcHAuckdlbm9tZS5jaHJvbW9zb21lcy5sZW5ndGgtMSkpO1xuXHR0aGlzLmdDaHJvbW9zb21lcy5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHt0aGlzLnNjcm9sbEFtb3VudH0sMClgKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNCeSAoZHgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKHRoaXMuc2Nyb2xsQW1vdW50ICsgZHgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc1NuYXAgKCkge1xuXHRsZXQgaSA9IE1hdGgucm91bmQodGhpcy5zY3JvbGxBbW91bnQgLyB0aGlzLnRvdGFsQ2hyV2lkdGgpXG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbyhpKnRoaXMudG90YWxDaHJXaWR0aCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzVXAgKCkge1xuICAgICAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzQnkoLXRoaXMudG90YWxDaHJXaWR0aCk7XG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzRG93biAoKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNCeSh0aGlzLnRvdGFsQ2hyV2lkdGgpO1xuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3VGl0bGUgKCkge1xuXHRsZXQgcmVmZyA9IHRoaXMuYXBwLnJHZW5vbWUubGFiZWw7XG5cdGxldCBibG9ja2cgPSB0aGlzLmN1cnJCbG9ja3MgPyBcblx0ICAgIHRoaXMuY3VyckJsb2Nrcy5jb21wICE9PSB0aGlzLmFwcC5yR2Vub21lID9cblx0ICAgICAgICB0aGlzLmN1cnJCbG9ja3MuY29tcC5sYWJlbFxuXHRcdDpcblx0XHRudWxsXG5cdCAgICA6XG5cdCAgICBudWxsO1xuXHRsZXQgbHN0ID0gdGhpcy5hcHAuY3Vyckxpc3QgPyB0aGlzLmFwcC5jdXJyTGlzdC5uYW1lIDogbnVsbDtcblxuXHR0aGlzLnJvb3Quc2VsZWN0KFwibGFiZWwgc3Bhbi50aXRsZVwiKS50ZXh0KHJlZmcpO1xuXG5cdGxldCBsaW5lcyA9IFtdO1xuXHRibG9ja2cgJiYgbGluZXMucHVzaChgQmxvY2tzIHZzLiAke2Jsb2NrZ31gKTtcblx0bHN0ICYmIGxpbmVzLnB1c2goYEZlYXR1cmVzIGZyb20gbGlzdCBcIiR7bHN0fVwiYCk7XG5cdGxldCBzdWJ0ID0gbGluZXMuam9pbihcIiA6OiBcIik7XG5cdHRoaXMucm9vdC5zZWxlY3QoXCJsYWJlbCBzcGFuLnN1YnRpdGxlXCIpLnRleHQoKHN1YnQgPyBcIjo6IFwiIDogXCJcIikgKyBzdWJ0KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgb3V0bGluZXMgb2Ygc3ludGVueSBibG9ja3Mgb2YgdGhlIHJlZiBnZW5vbWUgdnMuXG4gICAgLy8gdGhlIGdpdmVuIGdlbm9tZS5cbiAgICAvLyBQYXNzaW5nIG51bGwgZXJhc2VzIGFsbCBzeW50ZW55IGJsb2Nrcy5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgIGRhdGEgPT0geyByZWY6R2Vub21lLCBjb21wOkdlbm9tZSwgYmxvY2tzOiBsaXN0IG9mIHN5bnRlbnkgYmxvY2tzIH1cbiAgICAvLyAgICBFYWNoIHNibG9jayA9PT0geyBibG9ja0lkOmludCwgb3JpOisvLSwgZnJvbUNociwgZnJvbVN0YXJ0LCBmcm9tRW5kLCB0b0NociwgdG9TdGFydCwgdG9FbmQgfVxuICAgIGRyYXdCbG9ja3MgKGRhdGEpIHtcblx0Ly9cbiAgICAgICAgbGV0IHNiZ3JwcyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpLnNlbGVjdCgnW25hbWU9XCJzeW5CbG9ja3NcIl0nKTtcblx0aWYgKCFkYXRhIHx8ICFkYXRhLmJsb2NrcyB8fCBkYXRhLmJsb2Nrcy5sZW5ndGggPT09IDApIHtcblx0ICAgIHRoaXMuY3VyckJsb2NrcyA9IG51bGw7XG5cdCAgICBzYmdycHMuaHRtbCgnJyk7XG5cdCAgICB0aGlzLmRyYXdUaXRsZSgpO1xuXHQgICAgcmV0dXJuO1xuXHR9XG5cdHRoaXMuY3VyckJsb2NrcyA9IGRhdGE7XG5cdC8vIHJlb3JnYW5pemUgZGF0YSB0byByZWZsZWN0IFNWRyBzdHJ1Y3R1cmUgd2Ugd2FudCwgaWUsIGdyb3VwZWQgYnkgY2hyb21vc29tZVxuICAgICAgICBsZXQgZHggPSBkYXRhLmJsb2Nrcy5yZWR1Y2UoKGEsc2IpID0+IHtcblx0XHRpZiAoIWFbc2IuZnJvbUNocl0pIGFbc2IuZnJvbUNocl0gPSBbXTtcblx0XHRhW3NiLmZyb21DaHJdLnB1c2goc2IpO1xuXHRcdHJldHVybiBhO1xuXHQgICAgfSwge30pO1xuXHRzYmdycHMuZWFjaChmdW5jdGlvbihjKXtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5kYXR1bSh7Y2hyOiBjLm5hbWUsIGJsb2NrczogZHhbYy5uYW1lXSB8fCBbXSB9KTtcblx0fSk7XG5cblx0bGV0IGJ3aWR0aCA9IDEwO1xuICAgICAgICBsZXQgc2Jsb2NrcyA9IHNiZ3Jwcy5zZWxlY3RBbGwoJ3JlY3Quc2Jsb2NrJykuZGF0YShiPT5iLmJsb2Nrcyk7XG4gICAgICAgIGxldCBuZXdicyA9IHNibG9ja3MuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsJ3NibG9jaycpO1xuXHRzYmxvY2tzXG5cdCAgICAuYXR0cihcInhcIiwgLWJ3aWR0aC8yIClcblx0ICAgIC5hdHRyKFwieVwiLCBiID0+IHRoaXMuZ2V0WShiLmZyb21TdGFydCkpXG5cdCAgICAuYXR0cihcIndpZHRoXCIsIGJ3aWR0aClcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGIgPT4gTWF0aC5tYXgoMCx0aGlzLmdldFkoYi5mcm9tRW5kIC0gYi5mcm9tU3RhcnQgKyAxKSkpXG5cdCAgICAuY2xhc3NlZChcImludmVyc2lvblwiLCBiID0+IGIub3JpID09PSBcIi1cIilcblx0ICAgIC5jbGFzc2VkKFwidHJhbnNsb2NhdGlvblwiLCBiID0+IGIuZnJvbUNociAhPT0gYi50b0Nocilcblx0ICAgIDtcblxuICAgICAgICBzYmxvY2tzLmV4aXQoKS5yZW1vdmUoKTtcblxuXHR0aGlzLmRyYXdUaXRsZSgpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRyYXdUaWNrcyAoaWRzKSB7XG5cdHRoaXMuY3VyclRpY2tzID0gaWRzIHx8IFtdO1xuXHR0aGlzLmFwcC5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlc0J5SWQodGhpcy5hcHAuckdlbm9tZSwgdGhpcy5jdXJyVGlja3MpXG5cdCAgICAudGhlbiggZmVhdHMgPT4geyB0aGlzLl9kcmF3VGlja3MoZmVhdHMpOyB9KTtcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgX2RyYXdUaWNrcyAoZmVhdHVyZXMpIHtcblx0bGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTsgLy8gcmVmIGdlbm9tZVxuXHQvLyBmZWF0dXJlIHRpY2sgbWFya3Ncblx0aWYgKCFmZWF0dXJlcyB8fCBmZWF0dXJlcy5sZW5ndGggPT09IDApIHtcblx0ICAgIHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbCgnW25hbWU9XCJ0aWNrc1wiXScpLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpLnJlbW92ZSgpO1xuXHQgICAgcmV0dXJuO1xuXHR9XG5cblx0Ly9cblx0bGV0IHRHcnBzID0gdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKFwiLmNocm9tb3NvbWVcIikuc2VsZWN0KCdbbmFtZT1cInRpY2tzXCJdJyk7XG5cblx0Ly8gZ3JvdXAgZmVhdHVyZXMgYnkgY2hyb21vc29tZVxuICAgICAgICBsZXQgZml4ID0gZmVhdHVyZXMucmVkdWNlKChhLGYpID0+IHsgXG5cdCAgICBpZiAoISBhW2YuY2hyXSkgYVtmLmNocl0gPSBbXTtcblx0ICAgIGFbZi5jaHJdLnB1c2goZik7XG5cdCAgICByZXR1cm4gYTtcblx0fSwge30pXG5cdHRHcnBzLmVhY2goZnVuY3Rpb24oYykge1xuXHQgICAgZDMuc2VsZWN0KHRoaXMpLmRhdHVtKCB7IGNocjogYywgZmVhdHVyZXM6IGZpeFtjLm5hbWVdICB8fCBbXX0gKTtcblx0fSk7XG5cblx0Ly8gdGhlIHRpY2sgZWxlbWVudHNcbiAgICAgICAgbGV0IGZlYXRzID0gdEdycHMuc2VsZWN0QWxsKFwiLmZlYXR1cmVcIilcblx0ICAgIC5kYXRhKGQgPT4gZC5mZWF0dXJlcywgZCA9PiBkLklEKTtcblx0Ly9cblx0bGV0IHhBZGogPSBmID0+IChmLnN0cmFuZCA9PT0gXCIrXCIgPyB0aGlzLnRpY2tMZW5ndGggOiAtdGhpcy50aWNrTGVuZ3RoKTtcblx0Ly9cblx0bGV0IHNoYXBlID0gXCJjaXJjbGVcIjsgIC8vIFwiY2lyY2xlXCIgb3IgXCJsaW5lXCJcblx0Ly9cblx0bGV0IG5ld2ZzID0gZmVhdHMuZW50ZXIoKVxuXHQgICAgLmFwcGVuZChzaGFwZSlcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImZlYXR1cmVcIilcblx0ICAgIC5vbignY2xpY2snLCAoZikgPT4ge1xuXHRcdGxldCBpID0gZi5jYW5vbmljYWx8fGYuSUQ7XG5cdCAgICAgICAgdGhpcy5hcHAuc2V0Q29udGV4dCh7bGFuZG1hcms6aSwgaGlnaGxpZ2h0OltpXX0pO1xuXHQgICAgfSkgO1xuXHRuZXdmcy5hcHBlbmQoXCJ0aXRsZVwiKVxuXHRcdC50ZXh0KGY9PmYuc3ltYm9sIHx8IGYuaWQpO1xuXHRpZiAoc2hhcGUgPT09IFwibGluZVwiKSB7XG5cdCAgICBmZWF0cy5hdHRyKFwieDFcIiwgZiA9PiB4QWRqKGYpICsgNSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ5MVwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ4MlwiLCBmID0+IHhBZGooZikgKyB0aGlzLnRpY2tMZW5ndGggKyA1KVxuXHQgICAgZmVhdHMuYXR0cihcInkyXCIsIGYgPT4gcmcueXNjYWxlKGYuc3RhcnQpKVxuXHR9XG5cdGVsc2Uge1xuXHQgICAgZmVhdHMuYXR0cihcImN4XCIsIGYgPT4geEFkaihmKSlcblx0ICAgIGZlYXRzLmF0dHIoXCJjeVwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0ICAgIGZlYXRzLmF0dHIoXCJyXCIsICB0aGlzLnRpY2tMZW5ndGggLyAyKTtcblx0fVxuXHQvL1xuXHRmZWF0cy5leGl0KCkucmVtb3ZlKClcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBHZW5vbWVWaWV3XG5cbmV4cG9ydCB7IEdlbm9tZVZpZXcgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0dlbm9tZVZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcblxuY2xhc3MgRmVhdHVyZURldGFpbHMgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMuaW5pdERvbSAoKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RG9tICgpIHtcblx0Ly9cblx0dGhpcy5yb290LnNlbGVjdCAoXCIuYnV0dG9uLmNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5leHRyYVwiLCAoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIHVwZGF0ZShmKSB7XG5cdC8vIGlmIGNhbGxlZCB3aXRoIG5vIGFyZ3MsIHVwZGF0ZSB1c2luZyB0aGUgcHJldmlvdXMgZmVhdHVyZVxuXHRmID0gZiB8fCB0aGlzLmxhc3RGZWF0dXJlO1xuXHRpZiAoIWYpIHtcblx0ICAgLy8gRklYTUU6IG1ham9yIHJlYWNob3ZlciBpbiB0aGlzIHNlY3Rpb25cblx0ICAgLy9cblx0ICAgLy8gZmFsbGJhY2suIHRha2UgdGhlIGZpcnN0IGhpZ2hsaWdodGVkLlxuXHQgICBsZXQgciA9IHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwicmVjdC5mZWF0dXJlLmhpZ2hsaWdodFwiKVswXVswXTtcblx0ICAgLy8gZmFsbGJhY2suIHRha2UgdGhlIGZpcnN0IGZlYXR1cmVcblx0ICAgaWYgKCFyKSByID0gdGhpcy5hcHAuem9vbVZpZXcuc3ZnTWFpbi5zZWxlY3QoXCJyZWN0LmZlYXR1cmVcIilbMF1bMF07XG5cdCAgIGlmIChyKSBmID0gci5fX2RhdGFfXztcblx0fVxuXHQvLyByZW1lbWJlclxuICAgICAgICBpZiAoIWYpIHRocm93IFwiQ2Fubm90IHVwZGF0ZSBmZWF0dXJlIGRldGFpbHMuIE5vIGZlYXR1cmUuXCI7XG5cdHRoaXMubGFzdEZlYXR1cmUgPSBmO1xuXG5cdC8vIGxpc3Qgb2YgZmVhdHVyZXMgdG8gc2hvdyBpbiBkZXRhaWxzIGFyZWEuXG5cdC8vIHRoZSBnaXZlbiBmZWF0dXJlIGFuZCBhbGwgZXF1aXZhbGVudHMgaW4gb3RoZXIgZ2Vub21lcy5cblx0bGV0IGZsaXN0ID0gW2ZdO1xuXHRpZiAoZi5jYW5vbmljYWwpIHtcblx0ICAgIC8vIEZJWE1FOiByZWFjaG92ZXJcblx0ICAgIGZsaXN0ID0gdGhpcy5hcHAuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkKGYuY2Fub25pY2FsKTtcblx0fVxuXHQvLyBHb3QgdGhlIGxpc3QuIE5vdyBvcmRlciBpdCB0aGUgc2FtZSBhcyB0aGUgZGlzcGxheWVkIGdlbm9tZXNcblx0Ly8gYnVpbGQgaW5kZXggb2YgZ2Vub21lIG5hbWUgLT4gZmVhdHVyZSBpbiBmbGlzdFxuXHRsZXQgaXggPSBmbGlzdC5yZWR1Y2UoKGFjYyxmKSA9PiB7IGFjY1tmLmdlbm9tZS5uYW1lXSA9IGY7IHJldHVybiBhY2M7IH0sIHt9KVxuXHRsZXQgZ2Vub21lT3JkZXIgPSAoW3RoaXMuYXBwLnJHZW5vbWVdLmNvbmNhdCh0aGlzLmFwcC5jR2Vub21lcykpO1xuXHRmbGlzdCA9IGdlbm9tZU9yZGVyLm1hcChnID0+IGl4W2cubmFtZV0gfHwgbnVsbCk7XG5cdC8vXG5cdGxldCBjb2xIZWFkZXJzID0gW1xuXHQgICAgLy8gY29sdW1ucyBoZWFkZXJzIGFuZCB0aGVpciAlIHdpZHRoc1xuXHQgICAgW1wiQ2Fub25pY2FsIGlkXCIgICAgICwxMF0sXG5cdCAgICBbXCJDYW5vbmljYWwgc3ltYm9sXCIgLDEwXSxcblx0ICAgIFtcIkdlbm9tZVwiICAgICAsOV0sXG5cdCAgICBbXCJJRFwiICAgICAsMTddLFxuXHQgICAgW1wiVHlwZVwiICAgICAgICwxMC41XSxcblx0ICAgIFtcIkJpb1R5cGVcIiAgICAsMTguNV0sXG5cdCAgICBbXCJDb29yZGluYXRlc1wiLDE4XSxcblx0ICAgIFtcIkxlbmd0aFwiICAgICAsN11cblx0XTtcblx0Ly8gSW4gdGhlIGNsb3NlZCBzdGF0ZSwgb25seSBzaG93IHRoZSBoZWFkZXIgYW5kIHRoZSByb3cgZm9yIHRoZSBwYXNzZWQgZmVhdHVyZVxuXHRpZiAodGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgZmxpc3QgPSBmbGlzdC5maWx0ZXIoIChmZiwgaSkgPT4gZmYgPT09IGYgKTtcblx0Ly8gRHJhdyB0aGUgdGFibGVcblx0bGV0IHQgPSB0aGlzLnJvb3Quc2VsZWN0KCd0YWJsZScpO1xuXHRsZXQgcm93cyA9IHQuc2VsZWN0QWxsKCd0cicpLmRhdGEoIFtjb2xIZWFkZXJzXS5jb25jYXQoZmxpc3QpICk7XG5cdHJvd3MuZW50ZXIoKS5hcHBlbmQoJ3RyJylcblx0ICAub24oXCJtb3VzZWVudGVyXCIsIChmLGkpID0+IGkgIT09IDAgJiYgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KGYsIHRydWUpKVxuXHQgIC5vbihcIm1vdXNlbGVhdmVcIiwgKGYsaSkgPT4gaSAhPT0gMCAmJiB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoKSk7XG5cdCAgICAgIFxuXHRyb3dzLmV4aXQoKS5yZW1vdmUoKTtcblx0cm93cy5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIChmZiwgaSkgPT4gKGkgIT09IDAgJiYgZmYgPT09IGYpKTtcblx0Ly9cblx0Ly8gR2l2ZW4gYSBmZWF0dXJlLCByZXR1cm5zIGEgbGlzdCBvZiBzdHJpbmdzIGZvciBwb3B1bGF0aW5nIGEgdGFibGUgcm93LlxuXHQvLyBJZiBpPT09MCwgdGhlbiBmIGlzIG5vdCBhIGZlYXR1cmUsIGJ1dCBhIGxpc3QgY29sdW1ucyBuYW1lcyt3aWR0aHMuXG5cdC8vIFxuXHRsZXQgY2VsbERhdGEgPSBmdW5jdGlvbiAoZiwgaSkge1xuXHQgICAgaWYgKGkgPT09IDApIHtcblx0XHRyZXR1cm4gZjtcblx0ICAgIH1cblx0ICAgIGxldCBjZWxsRGF0YSA9IFsgXCIuXCIsIFwiLlwiLCBnZW5vbWVPcmRlcltpLTFdLmxhYmVsLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiwgXCIuXCIgXTtcblx0ICAgIC8vIGYgaXMgbnVsbCBpZiBpdCBkb2Vzbid0IGV4aXN0IGZvciBnZW5vbWUgaSBcblx0ICAgIGlmIChmKSB7XG5cdFx0bGV0IGxpbmsgPSBcIlwiO1xuXHRcdGxldCBjYW5vbmljYWwgPSBmLmNhbm9uaWNhbCB8fCBcIlwiO1xuXHRcdGlmIChjYW5vbmljYWwpIHtcblx0XHQgICAgbGV0IHVybCA9IGBodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvYWNjZXNzaW9uLyR7Y2Fub25pY2FsfWA7XG5cdFx0ICAgIGxpbmsgPSBgPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7dXJsfVwiPiR7Y2Fub25pY2FsfTwvYT5gO1xuXHRcdH1cblx0XHRjZWxsRGF0YSA9IFtcblx0XHQgICAgbGluayB8fCBjYW5vbmljYWwsXG5cdFx0ICAgIGYuc3ltYm9sLFxuXHRcdCAgICBmLmdlbm9tZS5sYWJlbCxcblx0XHQgICAgZi5JRCxcblx0XHQgICAgZi50eXBlLFxuXHRcdCAgICBmLmJpb3R5cGUsXG5cdFx0ICAgIGAke2YuY2hyfToke2Yuc3RhcnR9Li4ke2YuZW5kfSAoJHtmLnN0cmFuZH0pYCxcblx0XHQgICAgYCR7Zi5lbmQgLSBmLnN0YXJ0ICsgMX0gYnBgXG5cdFx0XTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBjZWxsRGF0YTtcblx0fTtcblx0bGV0IGNlbGxzID0gcm93cy5zZWxlY3RBbGwoXCJ0ZFwiKVxuXHQgICAgLmRhdGEoKGYsaSkgPT4gY2VsbERhdGEoZixpKSk7XG5cdGNlbGxzLmVudGVyKCkuYXBwZW5kKFwidGRcIik7XG5cdGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcblx0Y2VsbHMuaHRtbCgoZCxpLGopID0+IHtcblx0ICAgIHJldHVybiBqID09PSAwID8gZFswXSA6IGRcblx0fSlcblx0LnN0eWxlKFwid2lkdGhcIiwgKGQsaSxqKSA9PiBqID09PSAwID8gYCR7ZFsxXX0lYCA6IG51bGwpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgRmVhdHVyZURldGFpbHMgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTVkdWaWV3IH0gZnJvbSAnLi9TVkdWaWV3JztcbmltcG9ydCB7IEZlYXR1cmUgfSBmcm9tICcuL0ZlYXR1cmUnO1xuaW1wb3J0IHsgcHJldHR5UHJpbnRCYXNlcywgY2xpcCwgcGFyc2VDb29yZHMsIGZvcm1hdENvb3JkcywgY29vcmRzQWZ0ZXJUcmFuc2Zvcm0sIHJlbW92ZUR1cHMgfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBab29tVmlldyBleHRlbmRzIFNWR1ZpZXcge1xuICAgIC8vXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0LCBpbml0aWFsQ29vcmRzLCBpbml0aWFsSGkpIHtcbiAgICAgIHN1cGVyKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIC8vXG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAvL1xuICAgICAgdGhpcy5taW5TdmdIZWlnaHQgPSAyNTA7XG4gICAgICB0aGlzLmJsb2NrSGVpZ2h0ID0gNjA7XG4gICAgICB0aGlzLnRvcE9mZnNldCA9IDE1O1xuICAgICAgdGhpcy5mZWF0SGVpZ2h0ID0gODtcdC8vIGhlaWdodCBvZiBhIHJlY3RhbmdsZSByZXByZXNlbnRpbmcgYSBmZWF0dXJlXG4gICAgICB0aGlzLmxhbmVHYXAgPSAyO1x0ICAgICAgICAvLyBzcGFjZSBiZXR3ZWVuIHN3aW0gbGFuZXNcbiAgICAgIHRoaXMubGFuZUhlaWdodCA9IHRoaXMuZmVhdEhlaWdodCArIHRoaXMubGFuZUdhcDtcbiAgICAgIHRoaXMubWluU3RyaXBIZWlnaHQgPSA3NTsgICAgLy8gaGVpZ2h0IHBlciBnZW5vbWUgaW4gdGhlIHpvb20gdmlld1xuICAgICAgdGhpcy5zdHJpcEdhcCA9IDIwO1x0Ly8gc3BhY2UgYmV0d2VlbiBzdHJpcHNcbiAgICAgIHRoaXMubWF4U0JnYXAgPSAyMDtcdC8vIG1heCBnYXAgYWxsb3dlZCBiZXR3ZWVuIGJsb2Nrcy5cbiAgICAgIHRoaXMuZG1vZGUgPSAnY29tcGFyaXNvbic7Ly8gZHJhd2luZyBtb2RlLiAnY29tcGFyaXNvbicgb3IgJ3JlZmVyZW5jZSdcbiAgICAgIHRoaXMud2hlZWxUaHJlc2hvbGQgPSAzO1x0Ly8gbWluaW11bSB3aGVlbCBkaXN0YW5jZSBcbiAgICAgIHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzID0gZmFsc2U7IC8vIGlmIHRydWUsIHNob3cgZXhvbiBzdHJ1Y3R1cmVcblxuICAgICAgLy9cbiAgICAgIC8vIElEcyBvZiBGZWF0dXJlcyB3ZSdyZSBoaWdobGlnaHRpbmcuIE1heSBiZSBmZWF0dXJlJ3MgSUQgIG9yIGNhbm9uaWNhbCBJRHIuL1xuICAgICAgLy8gaGlGZWF0cyBpcyBhbiBvYmogd2hvc2Uga2V5cyBhcmUgdGhlIElEc1xuICAgICAgdGhpcy5oaUZlYXRzID0gKGluaXRpYWxIaSB8fCBbXSkucmVkdWNlKCAoYSx2KSA9PiB7IGFbdl09djsgcmV0dXJuIGE7IH0sIHt9ICk7XG4gICAgICAvL1xuICAgICAgdGhpcy5maWR1Y2lhbHMgPSB0aGlzLnN2Zy5pbnNlcnQoJ2cnLCc6Zmlyc3QtY2hpbGQnKSAvLyBcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywnZmlkdWNpYWxzJyk7XG4gICAgICB0aGlzLnN0cmlwc0dycCA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCdzdHJpcHMnKTtcbiAgICAgIHRoaXMuYXhpcyA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCdheGlzJyk7XG4gICAgICB0aGlzLmZsb2F0aW5nVGV4dCA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCdmbG9hdGluZ1RleHQnKTtcbiAgICAgIHRoaXMuY3h0TWVudSA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiY3h0TWVudVwiXScpO1xuICAgICAgLy9cbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBudWxsO1xuICAgICAgdGhpcy5kcmFnZ2VyID0gdGhpcy5nZXREcmFnZ2VyKCk7XG4gICAgICAvL1xuXHQvLyBDb25maWcgZm9yIG1lbnUgdW5kZXIgbWVudSBidXR0b25cblx0dGhpcy5jeHRNZW51Q2ZnID0gW3tcblx0ICAgIG5hbWU6ICdsaW5rVG9TbnBzJyxcblx0ICAgIGxhYmVsOiAnTUdJIFNOUHMnLCBcblx0ICAgIGljb246ICdvcGVuX2luX25ldycsXG5cdCAgICB0b29sdGlwOiAnVmlldyBTTlBzIGF0IE1HSSBmb3IgdGhlIGN1cnJlbnQgc3RyYWlucyBpbiB0aGUgY3VycmVudCByZWdpb24uIChTb21lIHN0cmFpbnMgbm90IGF2YWlsYWJsZS4pJyxcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpU25wUmVwb3J0KClcblx0fSx7XG5cdCAgICBuYW1lOiAnbGlua1RvUXRsJyxcblx0ICAgIGxhYmVsOiAnTUdJIFFUTHMnLCBcblx0ICAgIGljb246ICAnb3Blbl9pbl9uZXcnLFxuXHQgICAgdG9vbHRpcDogJ1ZpZXcgUVRMIGF0IE1HSSB0aGF0IG92ZXJsYXAgdGhlIGN1cnJlbnQgcmVnaW9uLicsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naVFUTHMoKVxuXHR9LHtcblx0ICAgIG5hbWU6ICdsaW5rVG9KYnJvd3NlJyxcblx0ICAgIGxhYmVsOiAnTUdJIEpCcm93c2UnLCBcblx0ICAgIGljb246ICdvcGVuX2luX25ldycsXG5cdCAgICB0b29sdGlwOiAnT3BlbiBNR0kgSkJyb3dzZSAoQzU3QkwvNkogR1JDbTM4KSB3aXRoIHRoZSBjdXJyZW50IGNvb3JkaW5hdGUgcmFuZ2UuJyxcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpSkJyb3dzZSgpXG5cdH0se1xuXHQgICAgbmFtZTogJ2NsZWFyQ2FjaGUnLFxuXHQgICAgbGFiZWw6ICdDbGVhciBjYWNoZScsIFxuXHQgICAgaWNvbjogJ2RlbGV0ZV9zd2VlcCcsXG5cdCAgICB0b29sdGlwOiAnRGVsZXRlIGNhY2hlZCBmZWF0dXJlcy4gRGF0YSB3aWxsIGJlIHJlbG9hZGVkIGZyb20gdGhlIHNlcnZlciBvbiBuZXh0IHVzZS4nLFxuXHQgICAgaGFuZGxlcjogKCk9PiB0aGlzLmFwcC5jbGVhckNhY2hlZERhdGEodHJ1ZSlcblx0fV07XG5cblx0Ly8gY29uZmlnIGZvciBhIGZlYXR1cmUncyBjb250ZXh0IG1lbnVcblx0dGhpcy5mY3h0TWVudUNmZyA9IFt7XG5cdCAgICBuYW1lOiAnbWVudVRpdGxlJyxcblx0ICAgIGxhYmVsOiAoZCkgPT4gYCR7ZC5zeW1ib2wgfHwgZC5JRH1gLCBcblx0ICAgIGNsczogJ21lbnVUaXRsZSdcblx0fSx7XG5cdCAgICBuYW1lOiAnbGluZVVwT25GZWF0dXJlJyxcblx0ICAgIGxhYmVsOiAnQWxpZ24gb24gdGhpcyBmZWF0dXJlLicsXG5cdCAgICBpY29uOiAnZm9ybWF0X2FsaWduX2NlbnRlcicsXG5cdCAgICB0b29sdGlwOiAnQWxpZ25zIHRoZSBkaXNwbGF5ZWQgZ2Vub21lcyBhcm91bmQgdGhpcyBmZWF0dXJlLicsXG5cdCAgICBoYW5kbGVyOiAoZikgPT4ge1xuXHRcdGxldCBpZHMgPSAobmV3IFNldChPYmplY3Qua2V5cyh0aGlzLmhpRmVhdHMpKSkuYWRkKGYuaWQpO1xuXHQgICAgICAgIHRoaXMuYXBwLnNldENvbnRleHQoe2xhbmRtYXJrOmYuaWQsIGRlbHRhOjAsIGhpZ2hsaWdodDpBcnJheS5mcm9tKGlkcyl9KVxuXHQgICAgfVxuXHR9LHtcblx0ICAgIG5hbWU6ICd0b01HSScsXG5cdCAgICBsYWJlbDogJ0ZlYXR1cmVATUdJJywgXG5cdCAgICBpY29uOiAnb3Blbl9pbl9uZXcnLFxuXHQgICAgdG9vbHRpcDogJ1NlZSBkZXRhaWxzIGZvciB0aGlzIGZlYXR1cmUgYXQgTUdJLicsXG5cdCAgICBoYW5kbGVyOiAoZikgPT4geyB3aW5kb3cub3BlbihgaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL2FjY2Vzc2lvbi8ke2YuaWR9YCwgJ19ibGFuaycpIH1cblx0fSx7XG5cdCAgICBuYW1lOiAndG9Nb3VzZU1pbmUnLFxuXHQgICAgbGFiZWw6ICdGZWF0dXJlQE1vdXNlTWluZScsIFxuXHQgICAgaWNvbjogJ29wZW5faW5fbmV3Jyxcblx0ICAgIHRvb2x0aXA6ICdTZWUgZGV0YWlscyBmb3IgdGhpcyBmZWF0dXJlIGF0IE1vdXNlTWluZS4nLFxuXHQgICAgaGFuZGxlcjogKGYpID0+IHRoaXMuYXBwLmxpbmtUb1JlcG9ydFBhZ2UoZilcblx0fSx7XG5cdCAgICBuYW1lOiAnZ2Vub21pY1NlcURvd25sb2FkJyxcblx0ICAgIGxhYmVsOiAnR2Vub21pYyBzZXF1ZW5jZXMnLCBcblx0ICAgIGljb246ICdjbG91ZF9kb3dubG9hZCcsXG5cdCAgICB0b29sdGlwOiAnRG93bmxvYWQgZ2Vub21pYyBzZXF1ZW5jZXMgZm9yIHRoaXMgZmVhdHVyZSBmcm9tIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcy4nLFxuXHQgICAgaGFuZGxlcjogKGYpID0+IHsgXG5cdFx0dGhpcy5hcHAuZG93bmxvYWRGYXN0YShmLCAnZ2Vub21pYycsIHRoaXMuYXBwLnZHZW5vbWVzLm1hcCh2Zz0+dmcubGFiZWwpKTtcblx0ICAgIH1cblx0fSx7XG5cdCAgICBuYW1lOiAnY2RzU2VxRG93bmxvYWQnLFxuXHQgICAgbGFiZWw6ICdDRFMgc2VxdWVuY2VzJywgXG5cdCAgICBpY29uOiAnY2xvdWRfZG93bmxvYWQnLFxuXHQgICAgdG9vbHRpcDogJ0Rvd25sb2FkIGNvZGluZyBzZXF1ZW5jZXMgb2YgdGhpcyBmZWF0dXJlIGZyb20gY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzLicsXG5cdCAgICBkaXNhYmxlcjogKGYpID0+IGYuYmlvdHlwZS5pbmRleE9mKCdwcm90ZWluJykgPT09IC0xLCAvLyBkaXNhYmxlIGlmIGYgaXMgbm90IHByb3RlaW4gY29kaW5nXG5cdCAgICBoYW5kbGVyOiAoZikgPT4geyBcblx0XHR0aGlzLmFwcC5kb3dubG9hZEZhc3RhKGYsICdjZHMnLCB0aGlzLmFwcC52R2Vub21lcy5tYXAodmc9PnZnLmxhYmVsKSk7XG5cdCAgICB9XG5cdH0se1xuXHQgICAgbmFtZTogJ2V4b25TZXFEb3dubG9hZCcsXG5cdCAgICBsYWJlbDogJ0V4b24gc2VxdWVuY2VzJywgXG5cdCAgICBpY29uOiAnY2xvdWRfZG93bmxvYWQnLFxuXHQgICAgdG9vbHRpcDogJ0Rvd25sb2FkIGV4b24gc2VxdWVuY2VzIG9mIHRoaXMgZmVhdHVyZSBmcm9tIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcy4nLFxuXHQgICAgZGlzYWJsZXI6IChmKSA9PiBmLnR5cGUuaW5kZXhPZignZ2VuZScpID09PSAtMSxcblx0ICAgIGhhbmRsZXI6IChmKSA9PiB7IFxuXHRcdHRoaXMuYXBwLmRvd25sb2FkRmFzdGEoZiwgJ2V4b24nLCB0aGlzLmFwcC52R2Vub21lcy5tYXAodmc9PnZnLmxhYmVsKSk7XG5cdCAgICB9XG5cdH1dO1xuICAgICAgLy9cbiAgICAgIHRoaXMuaW5pdERvbSgpO1xuICAgIH1cbiAgICAvL1xuICAgIGluaXREb20gKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCByID0gdGhpcy5yb290O1xuXHRsZXQgYSA9IHRoaXMuYXBwO1xuXHQvL1xuXHRyLnNlbGVjdCgnLmJ1dHRvbi5jbG9zZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4gdGhpcy51cGRhdGUoKSk7XG5cblx0Ly8gem9vbSBjb250cm9sc1xuXHRyLnNlbGVjdCgnI3pvb21PdXQnKS5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnpvb20oYS5kZWZhdWx0Wm9vbSkgfSk7XG5cdHIuc2VsZWN0KCcjem9vbUluJykgLm9uKCdjbGljaycsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgxL2EuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdCgnI3pvb21PdXRNb3JlJykub24oJ2NsaWNrJyxcblx0ICAgICgpID0+IHsgYS56b29tKDIqYS5kZWZhdWx0Wm9vbSkgfSk7XG5cdHIuc2VsZWN0KCcjem9vbUluTW9yZScpIC5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnpvb20oMS8oMiphLmRlZmF1bHRab29tKSkgfSk7XG5cblx0Ly8gcGFuIGNvbnRyb2xzXG5cdHIuc2VsZWN0KCcjcGFuTGVmdCcpIC5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnBhbigtYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoJyNwYW5SaWdodCcpLm9uKCdjbGljaycsXG5cdCAgICAoKSA9PiB7IGEucGFuKCthLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdCgnI3BhbkxlZnRNb3JlJykgLm9uKCdjbGljaycsXG5cdCAgICAoKSA9PiB7IGEucGFuKC01KmEuZGVmYXVsdFBhbikgfSk7XG5cdHIuc2VsZWN0KCcjcGFuUmlnaHRNb3JlJykub24oJ2NsaWNrJyxcblx0ICAgICgpID0+IHsgYS5wYW4oKzUqYS5kZWZhdWx0UGFuKSB9KTtcblxuXHQvL1xuXHR0aGlzLnJvb3Rcblx0ICAub24oJ2NsaWNrJywgKCkgPT4ge1xuXHQgICAgICAvLyBjbGljayBvbiBiYWNrZ3JvdW5kID0+IGhpZGUgY29udGV4dCBtZW51XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICh0Z3QudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnaScgJiYgdGd0LmlubmVySFRNTCA9PT0gJ21lbnUnKVxuXHRcdCAgLy8gZXhjZXB0aW9uOiB0aGUgY29udGV4dCBtZW51IGJ1dHRvbiBpdHNlbGZcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgZWxzZVxuXHRcdCAgdGhpcy5oaWRlQ29udGV4dE1lbnUoKVxuXHQgIH0pO1xuXG5cdC8vIEZlYXR1cmUgbW91c2UgZXZlbnQgaGFuZGxlcnMuXG5cdC8vXG5cdGxldCBmQ2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKGYsIGV2dCwgcHJlc2VydmUpIHtcblx0ICAgIGxldCBpZCA9IGYuaWQ7XG5cdCAgICBpZiAoZXZ0LmN0cmxLZXkpIHtcblx0ICAgICAgICBsZXQgY3ggPSBkMy5ldmVudC5jbGllbnRYO1xuXHQgICAgICAgIGxldCBjeSA9IGQzLmV2ZW50LmNsaWVudFk7XG5cdCAgICAgICAgbGV0IGJiID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJ6b29tY29udHJvbHNcIl0gPiAubWVudSA+IC5idXR0b24nKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0ZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRoaXMuc2hvd0NvbnRleHRNZW51KHRoaXMuZmN4dE1lbnVDZmcsIGYsIGN4LWJiLngsIGN5LWJiLnkpO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZiAoZXZ0LnNoaWZ0S2V5KSB7XG5cdFx0aWYgKHRoaXMuaGlGZWF0c1tpZF0pXG5cdFx0ICAgIGRlbGV0ZSB0aGlzLmhpRmVhdHNbaWRdXG5cdFx0ZWxzZVxuXHRcdCAgICB0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRpZiAoIXByZXNlcnZlKSB0aGlzLmhpRmVhdHMgPSB7fTtcblx0XHR0aGlzLmhpRmVhdHNbaWRdID0gaWQ7XG5cdCAgICB9XG5cdCAgICAvLyBGSVhNRTogcmVhY2hvdmVyXG5cdCAgICB0aGlzLmFwcC5mZWF0dXJlRGV0YWlscy51cGRhdGUoZik7XG5cdH0uYmluZCh0aGlzKTtcblx0Ly9cblx0bGV0IGZNb3VzZU92ZXJIYW5kbGVyID0gZnVuY3Rpb24oZikge1xuXHRcdGlmIChkMy5ldmVudC5hbHRLZXkpIHtcblx0XHQgICAgLy8gSWYgdXNlciBpcyBob2xkaW5nIHRoZSBhbHQga2V5LCBzZWxlY3QgZXZlcnl0aGluZyB0b3VjaGVkLlxuXHRcdCAgICBmQ2xpY2tIYW5kbGVyKGYsIGQzLmV2ZW50LCB0cnVlKTtcblx0XHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0XHQgICAgLy8gRG9uJ3QgcmVnaXN0ZXIgY29udGV4dCBjaGFuZ2VzIHVudGlsIHVzZXIgaGFzIHBhdXNlZCBmb3IgYXQgbGVhc3QgMXMuXG5cdFx0ICAgIGlmICh0aGlzLnRpbWVvdXQpIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcblx0XHQgICAgdGhpcy50aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKXsgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTsgfS5iaW5kKHRoaXMpLCAxMDAwKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIHRoaXMuaGlnaGxpZ2h0KGYpO1xuXHRcdCAgICBpZiAoZDMuZXZlbnQuY3RybEtleSlcblx0XHQgICAgICAgIHRoaXMuYXBwLmZlYXR1cmVEZXRhaWxzLnVwZGF0ZShmKTtcblx0XHR9XG5cdH0uYmluZCh0aGlzKTtcblx0Ly9cblx0bGV0IGZNb3VzZU91dEhhbmRsZXIgPSBmdW5jdGlvbihmKSB7XG5cdFx0dGhpcy5oaWdobGlnaHQoKTsgXG5cdH0uYmluZCh0aGlzKTtcblxuXHQvLyBcbiAgICAgICAgdGhpcy5zdmdcblx0ICAub24oJ2NsaWNrJywgKCkgPT4ge1xuXHQgICAgICBsZXQgdCA9IGQzLmV2ZW50LnRhcmdldDtcblx0ICAgICAgbGV0IHRndCA9IGQzLnNlbGVjdCh0KTtcblx0ICAgICAgaWYgKHRoaXMuZGVhbFdpdGhVbndhbnRlZENsaWNrRXZlbnQpIHtcblx0ICAgICAgICAgIHRoaXMuZGVhbFdpdGhVbndhbnRlZENsaWNrRXZlbnQgPSBmYWxzZTtcblx0XHQgIHJldHVybjtcblx0ICAgICAgfVxuXHQgICAgICBpZiAodC50YWdOYW1lID09ICdyZWN0JyAmJiAodC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZlYXR1cmUnKSB8fCB0LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmZWF0dXJlJykpKSB7XG5cdFx0ICAvLyB1c2VyIGNsaWNrZWQgb24gYSBmZWF0dXJlXG5cdFx0ICBmQ2xpY2tIYW5kbGVyKHQuX19kYXRhX18sIGQzLmV2ZW50KTtcblx0XHQgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdCAgICAgICAgICB0aGlzLmFwcC5jb250ZXh0Q2hhbmdlZCgpO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2UgaWYgKCFkMy5ldmVudC5zaGlmdEtleSAmJiBcblx0ICAgICAgICAgICh0LnRhZ05hbWUgPT09ICdzdmcnIFxuXHRcdCAgfHwgdC50YWdOYW1lID09ICdyZWN0JyAmJiB0LmNsYXNzTGlzdC5jb250YWlucygnYmxvY2snKVxuXHRcdCAgfHwgdC50YWdOYW1lID09ICdyZWN0JyAmJiB0LmNsYXNzTGlzdC5jb250YWlucygndW5kZXJsYXknKVxuXHRcdCAgKSl7XG5cdFx0ICAvLyB1c2VyIGNsaWNrZWQgb24gYmFja2dyb3VuZFxuXHRcdCAgdGhpcy5oaUZlYXRzID0ge307XG5cdFx0ICB0aGlzLmhpZ2hsaWdodCgpO1xuXHRcdCAgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTtcblx0ICAgICAgfVxuXHQgIH0pXG5cdCAgLm9uKCdjb250ZXh0bWVudScsICgpID0+IHtcblx0ICAgICAgbGV0IHRndCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpO1xuXHQgICAgICBsZXQgZiA9IHRndC5kYXRhKClbMF07XG5cdCAgICAgIGlmIChmIGluc3RhbmNlb2YgRmVhdHVyZSkge1xuXHRcdCAgZkNsaWNrSGFuZGxlcihmLCBkMy5ldmVudCk7XG5cdCAgICAgIH1cblx0ICAgICAgZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgfSlcblx0ICAub24oJ21vdXNlb3ZlcicsICgpID0+IHtcblx0ICAgICAgbGV0IHRndCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpO1xuXHQgICAgICBsZXQgZiA9IHRndC5kYXRhKClbMF07XG5cdCAgICAgIGlmIChmIGluc3RhbmNlb2YgRmVhdHVyZSkge1xuXHRcdCAgZk1vdXNlT3ZlckhhbmRsZXIoZik7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU91dEhhbmRsZXIoZik7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbignd2hlZWwnLCBmdW5jdGlvbihkKSB7XG5cdCAgICBsZXQgZSA9IGQzLmV2ZW50O1xuXHQgICAgLy8gbGV0IHRoZSBicm93c2VyIGhhbmRsZXIgdmVydGljYWwgbW90aW9uXG5cdCAgICBpZiAoTWF0aC5hYnMoZS5kZWx0YVgpIDwgTWF0aC5hYnMoZS5kZWx0YVkpKVxuXHQgICAgICAgIHJldHVybjtcblx0ICAgIC8vIHdlIGhhbmRsZSBob3Jpem9udGFsIG1vdGlvbi5cblx0ICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAvLyBmaWx0ZXIgb3V0IHRpbnkgbW90aW9uc1xuXHQgICAgaWYgKE1hdGguYWJzKGUuZGVsdGFYKSA8IHRoaXMud2hlZWxUaHJlc2hvbGQpIFxuXHQgICAgICAgIHJldHVybjtcblx0ICAgIC8vIGdldCB0aGUgem9vbSBzdHJpcCB0YXJnZXQsIGlmIGl0IGV4aXN0cywgZWxzZSB0aGUgcmVmIHpvb20gc3RyaXAuXG5cdCAgICBsZXQgeiA9IGUudGFyZ2V0LmNsb3Nlc3QoJ2cuem9vbVN0cmlwJykgfHwgZDMuc2VsZWN0KCdnLnpvb21TdHJpcC5yZWZlcmVuY2UnKVswXVswXTtcblx0ICAgIGlmICgheikgcmV0dXJuO1xuXG5cdCAgICBsZXQgZGIgPSBlLmRlbHRhWCAvIHNlbGYucHBiOyAvLyBkZWx0YSBpbiBiYXNlcyBmb3IgdGhpcyBldmVudFxuXHQgICAgbGV0IHpkID0gei5fX2RhdGFfXztcblx0ICAgIGlmIChlLmN0cmxLZXkpIHtcblx0XHQvLyBDdHJsLXdoZWVsIHNpbXBseSBzbGlkZXMgdGhlIHN0cmlwIGhvcml6b250YWxseSAodGVtcG9yYXJ5KVxuXHRcdC8vIEZvciBjb21wYXJpc29uIGdlbm9tZXMsIGp1c3QgdHJhbnNsYXRlIHRoZSBibG9ja3MgYnkgdGhlIHdoZWVsIGFtb3VudCwgc28gdGhlIHVzZXIgY2FuIFxuXHRcdC8vIHNlZSBldmVyeXRoaW5nLlxuXHRcdHpkLmRlbHRhQiArPSBkYjtcblx0ICAgICAgICBkMy5zZWxlY3Qoeikuc2VsZWN0KCdnW25hbWU9XCJzQmxvY2tzXCJdJykuYXR0cigndHJhbnNmb3JtJyxgdHJhbnNsYXRlKCR7LXpkLmRlbHRhQiAqIHNlbGYucHBifSwwKXNjYWxlKCR7emQueFNjYWxlfSwxKWApO1xuXHRcdHNlbGYuZHJhd0ZpZHVjaWFscygpO1xuXHRcdHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgLy8gTm9ybWFsIHdoZWVsIGV2ZW50ID0gcGFuIHRoZSB2aWV3LlxuXHQgICAgLy9cblx0ICAgIGxldCBjICA9IHNlbGYuYXBwLmNvb3Jkcztcblx0ICAgIC8vIExpbWl0IGRlbHRhIGJ5IGNociBlbmRzXG5cdCAgICAvLyBEZWx0YSBpbiBiYXNlczpcblx0ICAgIHpkLmRlbHRhQiA9IGNsaXAoemQuZGVsdGFCICsgZGIsIC1jLnN0YXJ0LCBjLmNocm9tb3NvbWUubGVuZ3RoIC0gYy5lbmQpXG5cdCAgICAvLyB0cmFuc2xhdGVcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5zZWxlY3RBbGwoJ2cuem9vbVN0cmlwID4gZ1tuYW1lPVwic0Jsb2Nrc1wiXScpXG5cdFx0LmF0dHIoJ3RyYW5zZm9ybScsIGN6ID0+IGB0cmFuc2xhdGUoJHstemQuZGVsdGFCICogc2VsZi5wcGJ9LDApc2NhbGUoJHtjei54U2NhbGV9LDEpYCk7XG5cdCAgICBzZWxmLmRyYXdGaWR1Y2lhbHMoKTtcblx0ICAgIC8vIFdhaXQgdW50aWwgd2hlZWwgZXZlbnRzIGhhdmUgc3RvcHBlZCBmb3IgYSB3aGlsZSwgdGhlbiBzY3JvbGwgdGhlIHZpZXcuXG5cdCAgICBpZiAoc2VsZi50aW1lb3V0KVxuXHQgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KTtcblx0ICAgIHNlbGYudGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcblx0XHRzZWxmLnRpbWVvdXQgPSBudWxsO1xuXHRcdGxldCBjY3h0ID0gc2VsZi5hcHAuZ2V0Q29udGV4dCgpO1xuXHRcdGlmIChjY3h0LmxhbmRtYXJrKSB7XG5cdFx0ICAgIHNlbGYuYXBwLnNldENvbnRleHQoeyBkZWx0YTogY2N4dC5kZWx0YSArIHpkLmRlbHRhQiB9KTtcblx0XHQgICAgemQuZGVsdGFCID0gMDtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIHNlbGYuYXBwLnNldENvbnRleHQoeyBcblx0XHQgICAgICAgIHN0YXJ0OiBjY3h0LnN0YXJ0ICsgemQuZGVsdGFCLFxuXHRcdCAgICAgICAgZW5kOiBjY3h0LmVuZCArIHpkLmRlbHRhQlxuXHRcdFx0fSk7XG5cdFx0ICAgIHpkLmRlbHRhQiA9IDA7XG5cdFx0fVxuXHQgICAgfSwgNTApO1xuXHR9KTtcblxuXG5cdC8vIEJ1dHRvbjogRHJvcCBkb3duIG1lbnUgaW4gem9vbSB2aWV3XG5cdHRoaXMucm9vdC5zZWxlY3QoJy5tZW51ID4gLmJ1dHRvbicpXG5cdCAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgLy8gc2hvdyBjb250ZXh0IG1lbnUgYXQgbW91c2UgZXZlbnQgY29vcmRpbmF0ZXNcblx0ICAgICAgbGV0IGN4ID0gZDMuZXZlbnQuY2xpZW50WDtcblx0ICAgICAgbGV0IGN5ID0gZDMuZXZlbnQuY2xpZW50WTtcblx0ICAgICAgbGV0IGJiID0gZDMuc2VsZWN0KHRoaXMpWzBdWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICBkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgc2VsZi5zaG93Q29udGV4dE1lbnUoc2VsZi5jeHRNZW51Q2ZnLCBudWxsLCBjeC1iYi5sZWZ0LCBjeS1iYi50b3ApO1xuXHQgIH0pO1xuXHQvLyB6b29tIGNvb3JkaW5hdGVzIGJveFxuXHR0aGlzLnJvb3Quc2VsZWN0KCcjem9vbUNvb3JkcycpXG5cdCAgICAuY2FsbCh6Y3MgPT4gemNzWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKHRoaXMuYXBwLmNvb3JkcykpXG5cdCAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkgeyB0aGlzLnNlbGVjdCgpOyB9KVxuXHQgICAgLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7IHNlbGYuYXBwLnNldENvb3JkaW5hdGVzKHRoaXMudmFsdWUpOyB9KTtcblxuXHQvLyB6b29tIHdpbmRvdyBzaXplIGJveFxuXHR0aGlzLnJvb3Quc2VsZWN0KCcjem9vbVdTaXplJylcblx0ICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7IHRoaXMuc2VsZWN0KCk7IH0pXG5cdCAgICAub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIGxldCB3cyA9IHBhcnNlSW50KHRoaXMudmFsdWUpO1xuXHRcdGxldCBjID0gc2VsZi5hcHAuY29vcmRzO1xuXHRcdGlmIChpc05hTih3cykgfHwgd3MgPCAxMDApIHtcblx0XHQgICAgYWxlcnQoJ0ludmFsaWQgd2luZG93IHNpemUuIFBsZWFzZSBlbnRlciBhbiBpbnRlZ2VyID49IDEwMC4nKTtcblx0XHQgICAgdGhpcy52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICBsZXQgbWlkID0gKGMuc3RhcnQgKyBjLmVuZCkgLyAyO1xuXHRcdCAgICBsZXQgbmV3cyA9IE1hdGgucm91bmQobWlkIC0gd3MvMik7XG5cdFx0ICAgIGxldCBuZXdlID0gbmV3cyArIHdzIC0gMTtcblx0XHQgICAgc2VsZi5hcHAuc2V0Q29udGV4dCh7XG5cdFx0ICAgICAgICBjaHI6IGMuY2hyLFxuXHRcdFx0c3RhcnQ6IG5ld3MsXG5cdFx0XHRlbmQ6IG5ld2UsXG5cdFx0XHRsZW5ndGg6IG5ld2UtbmV3cysxXG5cdFx0ICAgIH0pO1xuXHRcdH1cblx0ICAgIH0pO1xuXHQvLyB6b29tIGRyYXdpbmcgbW9kZSBcblx0dGhpcy5yb290LnNlbGVjdEFsbCgnZGl2W25hbWU9XCJ6b29tRG1vZGVcIl0gLmJ1dHRvbicpXG5cdCAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0aWYgKGQzLnNlbGVjdCh0aGlzKS5hdHRyKCdkaXNhYmxlZCcpKVxuXHRcdCAgICByZXR1cm47XG5cdFx0bGV0IHIgPSBzZWxmLnJvb3Q7XG5cdFx0bGV0IGlzQyA9IHIuY2xhc3NlZCgnY29tcGFyaXNvbicpO1xuXHRcdHIuY2xhc3NlZCgnY29tcGFyaXNvbicsICFpc0MpO1xuXHRcdHIuY2xhc3NlZCgncmVmZXJlbmNlJywgaXNDKTtcblx0XHRzZWxmLmFwcC5zZXRDb250ZXh0KHtkbW9kZTogci5jbGFzc2VkKCdjb21wYXJpc29uJykgPyAnY29tcGFyaXNvbicgOiAncmVmZXJlbmNlJ30pO1xuXHQgICAgfSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldCBoaWdobGlnaHRlZCAoaGxzKSB7XG5cdGlmICh0eXBlb2YoaGxzKSA9PT0gJ3N0cmluZycpXG5cdCAgICBobHMgPSBbaGxzXTtcblx0Ly9cblx0dGhpcy5oaUZlYXRzID0ge307XG4gICAgICAgIGZvcihsZXQgaCBvZiBobHMpe1xuXHQgICAgdGhpcy5oaUZlYXRzW2hdID0gaDtcblx0fVxuICAgIH1cbiAgICBnZXQgaGlnaGxpZ2h0ZWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaUZlYXRzID8gT2JqZWN0LmtleXModGhpcy5oaUZlYXRzKSA6IFtdO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dGbG9hdGluZ1RleHQgKHRleHQsIHgsIHkpIHtcblx0bGV0IHNyID0gdGhpcy5zdmcubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHR4ID0geC1zci54LTEyO1xuXHR5ID0geS1zci55O1xuXHRsZXQgYW5jaG9yID0geCA8IDYwID8gJ3N0YXJ0JyA6IHRoaXMud2lkdGgteCA8IDYwID8gJ2VuZCcgOiAnbWlkZGxlJztcblx0dGhpcy5mbG9hdGluZ1RleHRcblx0ICAgIC50ZXh0KHRleHQpXG5cdCAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJyxhbmNob3IpXG5cdCAgICAuYXR0cigneCcsIHgpXG5cdCAgICAuYXR0cigneScsIHkpXG4gICAgfVxuICAgIGhpZGVGbG9hdGluZ1RleHQgKCkge1xuXHR0aGlzLmZsb2F0aW5nVGV4dC50ZXh0KCcnKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdENvbnRleHRNZW51IChpdGVtcyxvYmopIHtcblx0dGhpcy5jeHRNZW51LnNlbGVjdEFsbCgnLm1lbnVJdGVtJykucmVtb3ZlKCk7IC8vIGluIGNhc2Ugb2YgcmUtaW5pdFxuICAgICAgICBsZXQgbWl0ZW1zID0gdGhpcy5jeHRNZW51XG5cdCAgLnNlbGVjdEFsbCgnLm1lbnVJdGVtJylcblx0ICAuZGF0YShpdGVtcyk7XG5cdGxldCBuZXdzID0gbWl0ZW1zLmVudGVyKClcblx0ICAuYXBwZW5kKCdkaXYnKVxuXHQgIC5hdHRyKCdjbGFzcycsIChkKSA9PiBgbWVudUl0ZW0gZmxleHJvdyAke2QuY2xzfHwnJ31gKVxuXHQgIC5jbGFzc2VkKCdkaXNhYmxlZCcsIGQgPT4gZC5kaXNhYmxlciA/IGQuZGlzYWJsZXIob2JqKSA6IGZhbHNlKVxuXHQgIC5hdHRyKCduYW1lJywgZCA9PiBkLm5hbWUgfHwgbnVsbCApXG5cdCAgLmF0dHIoJ3RpdGxlJywgZCA9PiBkLnRvb2x0aXAgfHwgbnVsbCApO1xuXG5cdGxldCBoYW5kbGVyID0gZCA9PiB7XG5cdCAgICAgIGlmIChkLmRpc2FibGVyICYmIGQuZGlzYWJsZXIob2JqKSlcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgZC5oYW5kbGVyICYmIGQuaGFuZGxlcihvYmopO1xuXHQgICAgICB0aGlzLmhpZGVDb250ZXh0TWVudSgpO1xuXHQgICAgICBkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fTtcblx0bmV3cy5hcHBlbmQoJ2xhYmVsJylcblx0ICAudGV4dChkID0+IHR5cGVvZihkLmxhYmVsKSA9PT0gJ2Z1bmN0aW9uJyA/IGQubGFiZWwob2JqKSA6IGQubGFiZWwpXG5cdCAgLm9uKCdjbGljaycsIGhhbmRsZXIpXG5cdCAgLm9uKCdjb250ZXh0bWVudScsIGhhbmRsZXIpO1xuXHRuZXdzLmFwcGVuZCgnaScpXG5cdCAgLmF0dHIoJ2NsYXNzJywgJ21hdGVyaWFsLWljb25zJylcblx0ICAudGV4dCggZD0+ZC5pY29uICk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dDb250ZXh0TWVudSAoY2ZnLGYseCx5KSB7XG4gICAgICAgIHRoaXMuaW5pdENvbnRleHRNZW51KGNmZywgZik7XG4gICAgICAgIHRoaXMuY3h0TWVudVxuXHQgICAgLmNsYXNzZWQoJ3Nob3dpbmcnLCB0cnVlKVxuXHQgICAgLnN0eWxlKCdsZWZ0JywgYCR7eH1weGApXG5cdCAgICAuc3R5bGUoJ3RvcCcsIGAke3l9cHhgKVxuXHQgICAgO1xuXHRpZiAoZikge1xuXHQgICAgdGhpcy5jeHRNZW51Lm9uKCdtb3VzZWVudGVyJywgKCk9PnRoaXMuaGlnaGxpZ2h0KGYpKTtcblx0ICAgIHRoaXMuY3h0TWVudS5vbignbW91c2VsZWF2ZScsICgpPT4ge1xuXHQgICAgICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdFx0dGhpcy5oaWRlQ29udGV4dE1lbnUoKTtcblx0ICAgIH0pO1xuXHR9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZGVDb250ZXh0TWVudSAoKSB7XG4gICAgICAgIHRoaXMuY3h0TWVudS5jbGFzc2VkKCdzaG93aW5nJywgZmFsc2UpO1xuXHR0aGlzLmN4dE1lbnUub24oJ21vdXNlZW50ZXInLCBudWxsKTtcblx0dGhpcy5jeHRNZW51Lm9uKCdtb3VzZWxlYXZlJywgbnVsbCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgZ3MgKGxpc3Qgb2YgR2Vub21lcylcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICAgIEZvciBlYWNoIEdlbm9tZSwgc2V0cyBnLnpvb21ZIFxuICAgIHNldCBnZW5vbWVzIChncykge1xuICAgICAgIGxldCBvZmZzZXQgPSB0aGlzLnRvcE9mZnNldDtcbiAgICAgICBncy5mb3JFYWNoKCBnID0+IHtcbiAgICAgICAgICAgZy56b29tWSA9IG9mZnNldDtcblx0ICAgb2Zmc2V0ICs9IHRoaXMubWluU3RyaXBIZWlnaHQgKyB0aGlzLnN0cmlwR2FwO1xuICAgICAgIH0pO1xuICAgICAgIHRoaXMuX2dlbm9tZXMgPSBncztcbiAgICB9XG4gICAgZ2V0IGdlbm9tZXMgKCkge1xuICAgICAgIHJldHVybiB0aGlzLl9nZW5vbWVzO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzIChzdHJpcGVzKSBpbiB0b3AtdG8tYm90dG9tIG9yZGVyLlxuICAgIC8vXG4gICAgZ2V0R2Vub21lWU9yZGVyICgpIHtcbiAgICAgICAgbGV0IHN0cmlwcyA9IHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoJy56b29tU3RyaXAnKTtcbiAgICAgICAgbGV0IHNzID0gc3RyaXBzWzBdLm1hcChnPT4ge1xuXHQgICAgbGV0IGJiID0gZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgIHJldHVybiBbYmIueSwgZy5fX2RhdGFfXy5nZW5vbWUubmFtZV07XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgbnMgPSBzcy5zb3J0KCAoYSxiKSA9PiBhWzBdIC0gYlswXSApLm1hcCggeCA9PiB4WzFdIClcblx0cmV0dXJuIG5zO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTZXRzIHRoZSB0b3AtdG8tYm90dG9tIG9yZGVyIG9mIHRoZSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMgYWNjb3JkaW5nIHRvIFxuICAgIC8vIHRoZSBnaXZlbiBuYW1lIGxpc3Qgb2YgbmFtZXMuIEJlY2F1c2Ugd2UgY2FuJ3QgZ3VhcmFudGVlIHRoZSBnaXZlbiBuYW1lcyBjb3JyZXNwb25kXG4gICAgLy8gdG8gYWN0dWFsIHpvb20gc3RyaXBzLCBvciB0aGF0IGFsbCBzdHJpcHMgYXJlIHJlcHJlc2VudGVkLCBldGMuXG4gICAgLy8gVGhlcmVmb3JlLCB0aGUgbGlzdCBpcyBwcmVwcmVjZXNzZWQgYXMgZm9sbG93czpcbiAgICAvLyAgICAgKiBkdXBsaWNhdGUgbmFtZXMsIGlmIHRoZXkgZXhpc3QsIGFyZSByZW1vdmVkXG4gICAgLy8gICAgICogbmFtZXMgdGhhdCBkbyBub3QgY29ycmVzcG9uZCB0byBleGlzdGluZyB6b29tU3RyaXBzIGFyZSByZW1vdmVkXG4gICAgLy8gICAgICogbmFtZXMgb2YgZXhpc3Rpbmcgem9vbSBzdHJpcHMgdGhhdCBkb24ndCBhcHBlYXIgaW4gdGhlIGxpc3QgYXJlIGFkZGVkIHRvIHRoZSBlbmRcbiAgICAvLyBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiBuYW1lcyB3aXRoIHRoZXNlIHByb3BlcnRpZXM6XG4gICAgLy8gICAgICogdGhlcmUgaXMgYSAxOjEgY29ycmVzcG9uZGVuY2UgYmV0d2VlbiBuYW1lcyBhbmQgYWN0dWFsIHpvb20gc3RyaXBzXG4gICAgLy8gICAgICogdGhlIG5hbWUgb3JkZXIgaXMgY29uc2lzdGVudCB3aXRoIHRoZSBpbnB1dCBsaXN0XG4gICAgLy8gVGhpcyBpcyB0aGUgbGlzdCB1c2VkIHRvIChyZSlvcmRlciB0aGUgem9vbSBzdHJpcHMuXG4gICAgLy9cbiAgICAvLyBHaXZlbiB0aGUgbGlzdCBvcmRlcjogXG4gICAgLy8gICAgICogYSBZLXBvc2l0aW9uIGlzIGFzc2lnbmVkIHRvIGVhY2ggZ2Vub21lXG4gICAgLy8gICAgICogem9vbSBzdHJpcHMgdGhhdCBhcmUgTk9UIENVUlJFTlRMWSBCRUlORyBEUkFHR0VEIGFyZSB0cmFuc2xhdGVkIHRvIHRoZWlyIG5ldyBsb2NhdGlvbnNcbiAgICAvL1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIG5zIChsaXN0IG9mIHN0cmluZ3MpIE5hbWVzIG9mIHRoZSBnZW5vbWVzLlxuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgIG5vdGhpbmdcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICAgIFJlY2FsY3VsYXRlcyB0aGUgWS1jb29yZGluYXRlcyBmb3IgZWFjaCBzdHJpcCBiYXNlZCBvbiB0aGUgZ2l2ZW4gb3JkZXIsIHRoZW4gdHJhbnNsYXRlc1xuICAgIC8vICAgICBlYWNoIHN0cmlwIHRvIGl0cyBuZXcgcG9zaXRpb24uXG4gICAgLy9cbiAgICBzZXRHZW5vbWVZT3JkZXIgKG5zKSB7XG5cdHRoaXMuZ2Vub21lcyA9IHJlbW92ZUR1cHMobnMpLm1hcChuPT4gdGhpcy5hcHAubmFtZTJnZW5vbWVbbl0gKS5maWx0ZXIoeD0+eCk7XG5cdGxldCBvID0gdGhpcy50b3BPZmZzZXQ7XG4gICAgICAgIHRoaXMuZ2Vub21lcy5mb3JFYWNoKCAoZyxpKSA9PiB7XG5cdCAgICBsZXQgc3RyaXAgPSBkMy5zZWxlY3QoYCN6b29tVmlldyAuem9vbVN0cmlwW25hbWU9XCIke2cubmFtZX1cIl1gKTtcblx0ICAgIGlmICghc3RyaXAuY2xhc3NlZCgnZHJhZ2dpbmcnKSlcblx0ICAgICAgICBzdHJpcC5hdHRyKCd0cmFuc2Zvcm0nLCBnZCA9PiBgdHJhbnNsYXRlKDAsJHtvICsgZ2QuemVyb09mZnNldH0pYCk7XG5cdCAgICBvICs9IHN0cmlwLmRhdGEoKVswXS5zdHJpcEhlaWdodCArIHRoaXMuc3RyaXBHYXA7XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBkcmFnZ2VyIChkMy5iZWhhdmlvci5kcmFnKSB0byBiZSBhdHRhY2hlZCB0byBlYWNoIHpvb20gc3RyaXAuXG4gICAgLy8gQWxsb3dzIHN0cmlwcyB0byBiZSByZW9yZGVyZWQgYnkgZHJhZ2dpbmcuXG4gICAgZ2V0RHJhZ2dlciAoKSB7ICBcbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBkMy5iZWhhdmlvci5kcmFnKClcblx0ICAub3JpZ2luKGZ1bmN0aW9uKGQsaSl7XG5cdCAgICAgIHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIH0pXG4gICAgICAgICAgLm9uKCdkcmFnc3RhcnQueicsIGZ1bmN0aW9uKGcpIHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC5zb3VyY2VFdmVudC50YXJnZXQ7XG5cdCAgICAgIGlmIChkMy5ldmVudC5zb3VyY2VFdmVudC5zaGlmdEtleSB8fCAhIGQzLnNlbGVjdCh0KS5jbGFzc2VkKCd6b29tU3RyaXBIYW5kbGUnKSl7XG5cdCAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgIH1cblx0ICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIGxldCBzdHJpcCA9IHRoaXMuY2xvc2VzdCgnLnpvb21TdHJpcCcpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nID0gZDMuc2VsZWN0KHN0cmlwKS5jbGFzc2VkKCdkcmFnZ2luZycsIHRydWUpO1xuXHQgIH0pXG5cdCAgLm9uKCdkcmFnLnonLCBmdW5jdGlvbiAoZykge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgbGV0IG14ID0gZDMubW91c2Uoc2VsZi5zdmdNYWluWzBdWzBdKVswXTtcblx0ICAgICAgbGV0IG15ID0gZDMubW91c2Uoc2VsZi5zdmdNYWluWzBdWzBdKVsxXTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZy5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bXl9KWApO1xuXHQgICAgICBzZWxmLnNldEdlbm9tZVlPcmRlcihzZWxmLmdldEdlbm9tZVlPcmRlcigpKTtcblx0ICAgICAgc2VsZi5kcmF3RmlkdWNpYWxzKCk7XG5cdCAgfSlcblx0ICAub24oJ2RyYWdlbmQueicsIGZ1bmN0aW9uIChnKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICAvL1xuXHQgICAgICBzZWxmLmRyYWdnaW5nLmNsYXNzZWQoJ2RyYWdnaW5nJywgZmFsc2UpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nID0gbnVsbDtcblx0ICAgICAgc2VsZi5zZXRHZW5vbWVZT3JkZXIoc2VsZi5nZXRHZW5vbWVZT3JkZXIoKSk7XG5cdCAgICAgIHNlbGYuYXBwLnNldENvbnRleHQoeyBnZW5vbWVzOiBzZWxmLmdldEdlbm9tZVlPcmRlcigpIH0pO1xuXHQgICAgICB3aW5kb3cuc2V0VGltZW91dCggc2VsZi5kcmF3RmlkdWNpYWxzLmJpbmQoc2VsZiksIDUwICk7XG5cdCAgfSlcblx0ICA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJCcnVzaGVzICgpIHtcblx0dGhpcy5yb290LnNlbGVjdEFsbCgnZy5icnVzaCcpXG5cdCAgICAuZWFjaCggZnVuY3Rpb24gKGIpIHtcblx0ICAgICAgICBiLmJydXNoLmNsZWFyKCk7XG5cdFx0ZDMuc2VsZWN0KHRoaXMpLmNhbGwoYi5icnVzaCk7XG5cdCAgICB9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGJydXNoIGNvb3JkaW5hdGVzLCB0cmFuc2xhdGVkIChpZiBuZWVkZWQpIHRvIHJlZiBnZW5vbWUgY29vcmRpbmF0ZXMuXG4gICAgYmJHZXRSZWZDb29yZHMgKCkge1xuICAgICAgbGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTtcbiAgICAgIGxldCBibGsgPSB0aGlzLmJydXNoaW5nO1xuICAgICAgbGV0IGV4dCA9IGJsay5icnVzaC5leHRlbnQoKTtcbiAgICAgIGxldCByID0geyBjaHI6IGJsay5jaHIsIHN0YXJ0OiBleHRbMF0sIGVuZDogZXh0WzFdLCBibG9ja0lkOmJsay5ibG9ja0lkIH07XG4gICAgICBsZXQgdHIgPSB0aGlzLmFwcC50cmFuc2xhdG9yO1xuICAgICAgaWYoIGJsay5nZW5vbWUgIT09IHJnICkge1xuICAgICAgICAgLy8gdXNlciBpcyBicnVzaGluZyBhIGNvbXAgZ2Vub21lcyBzbyBmaXJzdCB0cmFuc2xhdGVcblx0IC8vIGNvb3JkaW5hdGVzIHRvIHJlZiBnZW5vbWVcblx0IGxldCBycyA9IHRoaXMuYXBwLnRyYW5zbGF0b3IudHJhbnNsYXRlKGJsay5nZW5vbWUsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgcmcpO1xuXHQgaWYgKHJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHQgciA9IHJzWzBdO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICAgci5ibG9ja0lkID0gcmcubmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBoYW5kbGVyIGZvciB0aGUgc3RhcnQgb2YgYSBicnVzaCBhY3Rpb24gYnkgdGhlIHVzZXIgb24gYSBibG9ja1xuICAgIGJiU3RhcnQgKGJsayxiRWx0KSB7XG4gICAgICB0aGlzLmJydXNoaW5nID0gYmxrO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBiYkJydXNoICgpIHtcbiAgICAgICAgbGV0IGV2ID0gZDMuZXZlbnQuc291cmNlRXZlbnQ7XG5cdGxldCB4dCA9IHRoaXMuYnJ1c2hpbmcuYnJ1c2guZXh0ZW50KCk7XG5cdGxldCBzID0gTWF0aC5yb3VuZCh4dFswXSk7XG5cdGxldCBlID0gTWF0aC5yb3VuZCh4dFsxXSk7XG5cdHRoaXMuc2hvd0Zsb2F0aW5nVGV4dChgJHt0aGlzLmJydXNoaW5nLmNocn06JHtzfS4uJHtlfWAsIGV2LmNsaWVudFgsIGV2LmNsaWVudFkpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBiYkVuZCAoKSB7XG4gICAgICBsZXQgc2UgPSBkMy5ldmVudC5zb3VyY2VFdmVudDtcbiAgICAgIGxldCB4dCA9IHRoaXMuYnJ1c2hpbmcuYnJ1c2guZXh0ZW50KCk7XG4gICAgICBsZXQgZyA9IHRoaXMuYnJ1c2hpbmcuZ2Vub21lLmxhYmVsO1xuICAgICAgLy9cbiAgICAgIHRoaXMuaGlkZUZsb2F0aW5nVGV4dCgpO1xuICAgICAgLy9cbiAgICAgIGlmIChzZS5jdHJsS2V5IHx8IHNlLmFsdEtleSB8fCBzZS5tZXRhS2V5KSB7XG5cdCAgdGhpcy5jbGVhckJydXNoZXMoKTtcblx0ICB0aGlzLmJydXNoaW5nID0gbnVsbDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvL1xuICAgICAgaWYgKE1hdGguYWJzKHh0WzBdIC0geHRbMV0pIDw9IDEwKSB7XG5cdCAgLy8gVXNlciBjbGlja2VkLiBSZWNlbnRlciB2aWV3LlxuXHQgIGxldCB4bWlkID0gKHh0WzBdICsgeHRbMV0pLzI7XG5cdCAgbGV0IHcgPSB0aGlzLmFwcC5jb29yZHMuZW5kIC0gdGhpcy5hcHAuY29vcmRzLnN0YXJ0ICsgMTtcblx0ICBsZXQgcyA9IE1hdGgucm91bmQoeG1pZCAtIHcvMik7XG5cdCAgdGhpcy5hcHAuc2V0Q29udGV4dCh7IHJlZjpnLCBjaHI6IHRoaXMuYnJ1c2hpbmcuY2hyLCBzdGFydDogcywgZW5kOiBzICsgdyAtIDEgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcblx0ICAvLyBVc2VyIGRyYWdnZWQuIFpvb20gaW4gb3Igb3V0LlxuXHQgIHRoaXMuYXBwLnNldENvbnRleHQoeyByZWY6ZywgY2hyOiB0aGlzLmJydXNoaW5nLmNociwgc3RhcnQ6eHRbMF0sIGVuZDp4dFsxXSB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2xlYXJCcnVzaGVzKCk7XG4gICAgICB0aGlzLmJydXNoaW5nID0gbnVsbDtcbiAgICAgIHRoaXMuZGVhbFdpdGhVbndhbnRlZENsaWNrRXZlbnQgPSB0cnVlO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWdobGlnaHRTdHJpcCAoZywgZWx0KSB7XG5cdGlmIChnID09PSB0aGlzLmN1cnJlbnRITEcpIHJldHVybjtcblx0dGhpcy5jdXJyZW50SExHID0gZztcblx0Ly9cblx0dGhpcy5zdmdNYWluLnNlbGVjdEFsbCgnLnpvb21TdHJpcCcpXG5cdCAgICAuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCBkID0+IGQuZ2Vub21lID09PSBnKTtcblx0dGhpcy5hcHAuc2hvd0Jsb2NrcyhnKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIHRoZSBab29tVmlldyB0byBzaG93IHRoZSBnaXZlbiBjb29yZGluYXRlIHJhbmdlIGZyb20gdGhlIHJlZyBnZW5vbWUgYW5kIHRoZSBjb3JyZXNwb25kaW5nXG4gICAgLy8gcmFuZ2UocykgaW4gZWFjaCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIHVwZGF0ZVZpYU1hcHBlZENvb3JkaW5hdGVzIChjb29yZHMpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgYyA9IChjb29yZHMgfHwgdGhpcy5hcHAuY29vcmRzKTtcblx0ZDMuc2VsZWN0KCcjem9vbUNvb3JkcycpWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCk7XG5cdGQzLnNlbGVjdCgnI3pvb21XU2l6ZScpWzBdWzBdLnZhbHVlID0gTWF0aC5yb3VuZChjLmVuZCAtIGMuc3RhcnQgKyAxKVxuXHQvL1xuICAgICAgICBsZXQgbWd2ID0gdGhpcy5hcHA7XG5cdC8vIElzc3VlIHJlcXVlc3RzIGZvciBmZWF0dXJlcy4gT25lIHJlcXVlc3QgcGVyIGdlbm9tZSwgZWFjaCByZXF1ZXN0IHNwZWNpZmllcyBvbmUgb3IgbW9yZVxuXHQvLyBjb29yZGluYXRlIHJhbmdlcy5cblx0Ly8gV2FpdCBmb3IgYWxsIHRoZSBkYXRhIHRvIGJlY29tZSBhdmFpbGFibGUsIHRoZW4gZHJhdy5cblx0Ly9cblx0bGV0IHByb21pc2VzID0gW107XG5cblx0Ly8gRmlyc3QgcmVxdWVzdCBpcyBmb3IgdGhlIHRoZSByZWZlcmVuY2UgZ2Vub21lLiBHZXQgYWxsIHRoZSBmZWF0dXJlcyBpbiB0aGUgcmFuZ2UuXG5cdHByb21pc2VzLnB1c2gobWd2LmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzKG1ndi5yR2Vub21lLCBbe1xuXHQgICAgLy8gTmVlZCB0byBzaW11bGF0ZSB0aGUgcmVzdWx0cyBmcm9tIGNhbGxpbmcgdGhlIHRyYW5zbGF0b3IuIFxuXHQgICAgLy8gXG5cdCAgICBjaHIgICAgOiBjLmNocixcblx0ICAgIHN0YXJ0ICA6IGMuc3RhcnQsXG5cdCAgICBlbmQgICAgOiBjLmVuZCxcblx0ICAgIGluZGV4ICA6IDAsXG5cdCAgICBmQ2hyICAgOiBjLmNocixcblx0ICAgIGZTdGFydCA6IGMuc3RhcnQsXG5cdCAgICBmRW5kICAgOiBjLmVuZCxcblx0ICAgIGZJbmRleCAgOiAwLFxuXHQgICAgb3JpICAgIDogJysnLFxuXHQgICAgYmxvY2tJZDogbWd2LnJHZW5vbWUubmFtZVxuXHQgICAgfV0pKTtcblx0aWYgKCEgc2VsZi5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKSB7XG5cdCAgICAvLyBBZGQgYSByZXF1ZXN0IGZvciBlYWNoIGNvbXBhcmlzb24gZ2Vub21lLCB1c2luZyB0cmFuc2xhdGVkIGNvb3JkaW5hdGVzLiBcblx0ICAgIG1ndi5jR2Vub21lcy5mb3JFYWNoKGNHZW5vbWUgPT4ge1xuXHRcdGxldCByYW5nZXMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUoIG1ndi5yR2Vub21lLCBjLmNociwgYy5zdGFydCwgYy5lbmQsIGNHZW5vbWUgKTtcblx0XHRsZXQgcCA9IG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhjR2Vub21lLCByYW5nZXMpO1xuXHRcdHByb21pc2VzLnB1c2gocCk7XG5cdCAgICB9KTtcblx0fVxuXHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgfVxuICAgIC8vIFVwZGF0ZXMgdGhlIFpvb21WaWV3IHRvIHNob3cgdGhlIHJlZ2lvbiBhcm91bmQgYSBsYW5kbWFyayBpbiBlYWNoIGdlbm9tZS5cbiAgICAvL1xuICAgIC8vIGNvb3JkcyA9IHtcbiAgICAvLyAgICAgbGFuZG1hcmsgOiBpZCBvZiBhIGZlYXR1cmUgdG8gdXNlIGFzIGEgcmVmZXJlbmNlXG4gICAgLy8gICAgIGZsYW5rfHdpZHRoIDogc3BlY2lmeSBvbmUgb2YgZmxhbmsgb3Igd2lkdGguIFxuICAgIC8vICAgICAgICAgZmxhbmsgPSBhbW91bnQgb2YgZmxhbmtpbmcgcmVnaW9uIChicCkgdG8gaW5jbHVkZSBhdCBib3RoIGVuZHMgb2YgdGhlIGxhbmRtYXJrLCBcbiAgICAvLyAgICAgICAgIHNvIHRoZSB0b3RhbCB2aWV3aW5nIHJlZ2lvbiA9IGZsYW5rICsgbGVuZ3RoKGxhbmRtYXJrKSArIGZsYW5rLlxuICAgIC8vICAgICAgICAgd2lkdGggPSB0b3RhbCB2aWV3aW5nIHJlZ2lvbiB3aWR0aC4gSWYgYm90aCB3aWR0aCBhbmQgZmxhbmsgYXJlIHNwZWNpZmllZCwgZmxhbmsgaXMgaWdub3JlZC5cbiAgICAvLyAgICAgZGVsdGEgOiBhbW91bnQgdG8gc2hpZnQgdGhlIHZpZXcgbGVmdC9yaWdodFxuICAgIC8vIH1cbiAgICAvLyBcbiAgICAvLyBUaGUgbGFuZG1hcmsgbXVzdCBleGlzdCBpbiB0aGUgY3VycmVudCByZWZlcmVuY2UgZ2Vub21lLiBcbiAgICAvL1xuICAgIHVwZGF0ZVZpYUxhbmRtYXJrQ29vcmRpbmF0ZXMgKGNvb3Jkcykge1xuXHRsZXQgYyA9IGNvb3Jkcztcblx0bGV0IG1ndiA9IHRoaXMuYXBwO1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCByZiA9IGNvb3Jkcy5sYW5kbWFya1JlZkZlYXQ7XG5cdGxldCBmZWF0cyA9IGNvb3Jkcy5sYW5kbWFya0ZlYXRzO1xuXHRpZiAodGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgZmVhdHMgPSBmZWF0cy5maWx0ZXIoZiA9PiBmLmdlbm9tZSA9PT0gdGhpcy5hcHAuckdlbm9tZSk7XG5cdGxldCBkZWx0YSA9IGNvb3Jkcy5kZWx0YSB8fCAwO1xuXHQvLyBjb21wdXRlIHJhbmdlcyBhcm91bmQgbGFuZG1hcmsgaW4gZWFjaCBnZW5vbWVcblx0bGV0IHJhbmdlcyA9IGZlYXRzLm1hcChmID0+IHtcblx0ICAgIGxldCBmbGFuayA9IGMubGVuZ3RoID8gKGMubGVuZ3RoIC0gZi5sZW5ndGgpIC8gMiA6IGMuZmxhbms7XG5cdCAgICBsZXQgY2xlbmd0aCA9IGYuZ2Vub21lLmdldENocm9tb3NvbWUoZi5jaHIpLmxlbmd0aDtcblx0ICAgIGxldCB3ICAgICA9IGMubGVuZ3RoID8gYy5sZW5ndGggOiAoZi5sZW5ndGggKyAyKmZsYW5rKTtcblx0ICAgIGxldCBzdGFydCA9IGNsaXAoTWF0aC5yb3VuZChkZWx0YSArIGYuc3RhcnQgLSBmbGFuayksIDEsIGNsZW5ndGgpO1xuXHQgICAgbGV0IGVuZCAgID0gY2xpcChNYXRoLnJvdW5kKHN0YXJ0ICsgdyksIHN0YXJ0LCBjbGVuZ3RoKVxuXHQgICAgbGV0IHJhbmdlID0ge1xuXHRcdGdlbm9tZTpcdGYuZ2Vub21lLFxuXHRcdGNocjpcdGYuY2hyLFxuXHRcdGNocm9tb3NvbWU6IGYuZ2Vub21lLmdldENocm9tb3NvbWUoZi5jaHIpLFxuXHRcdHN0YXJ0Olx0c3RhcnQsXG5cdFx0ZW5kOlx0ZW5kXG5cdCAgICB9IDtcblx0ICAgIGlmIChmLmdlbm9tZSA9PT0gbWd2LnJHZW5vbWUpIHtcblx0XHRsZXQgYyA9IHRoaXMuYXBwLmNvb3JkcyA9IHJhbmdlO1xuXHRcdGQzLnNlbGVjdCgnI3pvb21Db29yZHMnKVswXVswXS52YWx1ZSA9IGZvcm1hdENvb3JkcyhjLmNociwgYy5zdGFydCwgYy5lbmQpO1xuXHRcdGQzLnNlbGVjdCgnI3pvb21XU2l6ZScpWzBdWzBdLnZhbHVlID0gTWF0aC5yb3VuZChjLmVuZCAtIGMuc3RhcnQgKyAxKVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIHJhbmdlO1xuXHR9KTtcblx0bGV0IHNlZW5HZW5vbWVzID0gbmV3IFNldCgpO1xuXHRsZXQgckNvb3Jkcztcblx0Ly8gR2V0IChwcm9taXNlcyBmb3IpIHRoZSBmZWF0dXJlcyBpbiBlYWNoIHJhbmdlLlxuXHRsZXQgcHJvbWlzZXMgPSByYW5nZXMubWFwKHIgPT4ge1xuICAgICAgICAgICAgbGV0IHJycztcblx0ICAgIHNlZW5HZW5vbWVzLmFkZChyLmdlbm9tZSk7XG5cdCAgICBpZiAoci5nZW5vbWUgPT09IG1ndi5yR2Vub21lKXtcblx0XHQvLyB0aGUgcmVmIGdlbm9tZSByYW5nZVxuXHRcdHJDb29yZHMgPSByO1xuXHQgICAgICAgIHJycyA9IFt7XG5cdFx0ICAgIGNociAgICA6IHIuY2hyLFxuXHRcdCAgICBzdGFydCAgOiByLnN0YXJ0LFxuXHRcdCAgICBlbmQgICAgOiByLmVuZCxcblx0XHQgICAgaW5kZXggIDogMCxcblx0XHQgICAgZkNociAgIDogci5jaHIsXG5cdFx0ICAgIGZTdGFydCA6IHIuc3RhcnQsXG5cdFx0ICAgIGZFbmQgICA6IHIuZW5kLFxuXHRcdCAgICBmSW5kZXggIDogMCxcblx0XHQgICAgb3JpICAgIDogJysnLFxuXHRcdCAgICBibG9ja0lkOiBtZ3Yuckdlbm9tZS5uYW1lXG5cdFx0fV07XG5cdCAgICB9XG5cdCAgICBlbHNlIHsgXG5cdFx0Ly8gdHVybiB0aGUgc2luZ2xlIHJhbmdlIGludG8gYSByYW5nZSBmb3IgZWFjaCBvdmVybGFwcGluZyBzeW50ZW55IGJsb2NrIHdpdGggdGhlIHJlZiBnZW5vbWVcblx0ICAgICAgICBycnMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUoci5nZW5vbWUsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgbWd2LnJHZW5vbWUsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhyLmdlbm9tZSwgcnJzKTtcblx0fSk7XG5cdC8vIEZvciBlYWNoIGdlbm9tZSB3aGVyZSB0aGUgbGFuZG1hcmsgZG9lcyBub3QgZXhpc3QsIGNvbXB1dGUgYSBtYXBwZWQgcmFuZ2UgKGFzIGluIG1hcHBlZCBjbW9kZSkuXG5cdGlmICghdGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgbWd2LmNHZW5vbWVzLmZvckVhY2goZyA9PiB7XG5cdFx0aWYgKCEgc2Vlbkdlbm9tZXMuaGFzKGcpKSB7XG5cdFx0ICAgIGxldCBycnMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUobWd2LnJHZW5vbWUsIHJDb29yZHMuY2hyLCByQ29vcmRzLnN0YXJ0LCByQ29vcmRzLmVuZCwgZyk7XG5cdFx0ICAgIHByb21pc2VzLnB1c2goIG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhnLCBycnMpICk7XG5cdFx0fVxuXHQgICAgfSk7XG5cdC8vIFdoZW4gYWxsIHRoZSBkYXRhIGlzIHJlYWR5LCBkcmF3LlxuXHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIH1cbiAgICAvL1xuICAgIHVwZGF0ZSAoY2ZnKSB7XG5cdHRoaXMuY2ZnID0gY2ZnIHx8IHRoaXMuY2ZnO1xuXHR0aGlzLmhpZ2hsaWdodGVkID0gdGhpcy5jZmcuaGlnaGxpZ2h0O1xuXHR0aGlzLmdlbm9tZXMgPSB0aGlzLmNmZy5nZW5vbWVzO1xuXHR0aGlzLmRtb2RlID0gdGhpcy5jZmcuZG1vZGU7XG5cdHRoaXMuY21vZGUgPSB0aGlzLmNmZy5jbW9kZTtcblx0dGhpcy5hcHAudHJhbnNsYXRvci5yZWFkeSgpLnRoZW4oKCkgPT4ge1xuXHQgICAgbGV0IHA7XG5cdCAgICBpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpXG5cdFx0cCA9IHRoaXMudXBkYXRlVmlhTWFwcGVkQ29vcmRpbmF0ZXModGhpcy5hcHAuY29vcmRzKTtcblx0ICAgIGVsc2Vcblx0XHRwID0gdGhpcy51cGRhdGVWaWFMYW5kbWFya0Nvb3JkaW5hdGVzKHRoaXMuYXBwLmxjb29yZHMpO1xuXHQgICAgcC50aGVuKCBkYXRhID0+IHtcblx0XHR0aGlzLmRyYXcodGhpcy5tdW5nZURhdGEoZGF0YSkpO1xuXHQgICAgfSk7XG5cdH0pO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgbWVyZ2VTYmxvY2tSdW5zIChkYXRhKSB7XG5cdC8vIC0tLS0tXG5cdC8vIFJlZHVjZXIgZnVuY3Rpb24uIFdpbGwgYmUgY2FsbGVkIHdpdGggdGhlc2UgYXJnczpcblx0Ly8gICBuYmxja3MgKGxpc3QpIE5ldyBibG9ja3MuIChjdXJyZW50IGFjY3VtdWxhdG9yIHZhbHVlKVxuXHQvLyAgIFx0QSBsaXN0IG9mIGxpc3RzIG9mIHN5bnRlbnkgYmxvY2tzLlxuXHQvLyAgIGJsayAoc3ludGVueSBibG9jaykgdGhlIGN1cnJlbnQgc3ludGVueSBibG9ja1xuXHQvLyAgIGkgKGludCkgVGhlIGl0ZXJhdGlvbiBjb3VudC5cblx0Ly8gUmV0dXJuczpcblx0Ly8gICBsaXN0IG9mIGxpc3RzIG9mIGJsb2Nrc1xuXHRsZXQgbWVyZ2VyID0gKG5ibGtzLCBiLCBpKSA9PiB7XG5cdCAgICBsZXQgaW5pdEJsayA9IGZ1bmN0aW9uIChiYikge1xuXHRcdGxldCBuYiA9IE9iamVjdC5hc3NpZ24oe30sIGJiKTtcblx0XHRuYi5zdXBlckJsb2NrID0gdHJ1ZTtcblx0XHRuYi5mZWF0dXJlcyA9IGJiLmZlYXR1cmVzLmNvbmNhdCgpO1xuXHRcdG5iLnNibG9ja3MgPSBbYmJdO1xuXHRcdG5iLm9yaSA9ICcrJ1xuXHRcdHJldHVybiBuYjtcblx0ICAgIH07XG5cdCAgICBpZiAoaSA9PT0gMCl7XG5cdFx0bmJsa3MucHVzaChpbml0QmxrKGIpKTtcblx0XHRyZXR1cm4gbmJsa3M7XG5cdCAgICB9XG5cdCAgICBsZXQgbGFzdEJsayA9IG5ibGtzW25ibGtzLmxlbmd0aCAtIDFdO1xuXHQgICAgaWYgKGIuY2hyICE9PSBsYXN0QmxrLmNociB8fCBiLmluZGV4IC0gbGFzdEJsay5pbmRleCAhPT0gMSkge1xuXHQgICAgICAgIG5ibGtzLnB1c2goaW5pdEJsayhiKSk7XG5cdFx0cmV0dXJuIG5ibGtzO1xuXHQgICAgfVxuXHQgICAgLy8gbWVyZ2Vcblx0ICAgIGxhc3RCbGsuaW5kZXggPSBiLmluZGV4O1xuXHQgICAgbGFzdEJsay5lbmQgPSBiLmVuZDtcblx0ICAgIGxhc3RCbGsuYmxvY2tFbmQgPSBiLmJsb2NrRW5kO1xuXHQgICAgbGFzdEJsay5mZWF0dXJlcyA9IGxhc3RCbGsuZmVhdHVyZXMuY29uY2F0KGIuZmVhdHVyZXMpO1xuXHQgICAgbGV0IGxhc3RTYiA9IGxhc3RCbGsuc2Jsb2Nrc1tsYXN0QmxrLnNibG9ja3MubGVuZ3RoIC0gMV07XG5cdCAgICBsZXQgZCA9IGIuc3RhcnQgLSBsYXN0U2IuZW5kO1xuXHQgICAgbGFzdFNiLmVuZCArPSBkLzI7XG5cdCAgICBiLnN0YXJ0IC09IGQvMjtcblx0ICAgIGxhc3RCbGsuc2Jsb2Nrcy5wdXNoKGIpO1xuXHQgICAgcmV0dXJuIG5ibGtzO1xuXHR9O1xuXHQvLyAtLS0tLVxuICAgICAgICBkYXRhLmZvckVhY2goKGdkYXRhLGkpID0+IHtcblx0ICAgIGlmICh0aGlzLmRtb2RlID09PSAnY29tcGFyaXNvbicpIHtcblx0XHRnZGF0YS5ibG9ja3Muc29ydCggKGEsYikgPT4gYS5pbmRleCAtIGIuaW5kZXggKTtcblx0XHRnZGF0YS5ibG9ja3MgPSBnZGF0YS5ibG9ja3MucmVkdWNlKG1lcmdlcixbXSk7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHQvLyBmaXJzdCBzb3J0IGJ5IHJlZiBnZW5vbWUgb3JkZXJcblx0XHRnZGF0YS5ibG9ja3Muc29ydCggKGEsYikgPT4gYS5mSW5kZXggLSBiLmZJbmRleCApO1xuXHRcdC8vIFN1Yi1ncm91cCBpbnRvIHJ1bnMgb2Ygc2FtZSBjb21wIGdlbm9tZSBjaHJvbW9zb21lLlxuXHRcdGxldCB0bXAgPSBnZGF0YS5ibG9ja3MucmVkdWNlKChuYnMsIGIsIGkpID0+IHtcblx0XHQgICAgaWYgKGkgPT09IDAgfHwgbmJzW25icy5sZW5ndGggLSAxXVswXS5jaHIgIT09IGIuY2hyKVxuXHRcdFx0bmJzLnB1c2goW2JdKTtcblx0XHQgICAgZWxzZVxuXHRcdFx0bmJzW25icy5sZW5ndGggLSAxXS5wdXNoKGIpO1xuXHRcdCAgICByZXR1cm4gbmJzO1xuXHRcdH0sIFtdKTtcblx0XHQvLyBTb3J0IGVhY2ggc3ViZ3JvdXAgaW50byBjb21wYXJpc29uIGdlbm9tZSBvcmRlclxuXHRcdHRtcC5mb3JFYWNoKCBzdWJncnAgPT4gc3ViZ3JwLnNvcnQoKGEsYikgPT4gYS5pbmRleCAtIGIuaW5kZXgpICk7XG5cdFx0Ly8gRmxhdHRlbiB0aGUgbGlzdFxuXHRcdHRtcCA9IHRtcC5yZWR1Y2UoKGxzdCwgY3VycikgPT4gbHN0LmNvbmNhdChjdXJyKSwgW10pO1xuXHRcdC8vIE5vdyBjcmVhdGUgdGhlIHN1cGVyZ3JvdXBzLlxuXHRcdGdkYXRhLmJsb2NrcyA9IHRtcC5yZWR1Y2UobWVyZ2VyLFtdKTtcblx0ICAgIH1cblx0fSk7XG5cdHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgdW5pcWlmeUJsb2NrcyAoYmxvY2tzKSB7XG5cdC8vIGhlbHBlciBmdW5jdGlvbi4gV2hlbiBzYmxvY2sgcmVsYXRpb25zaGlwIGJldHdlZW4gZ2Vub21lcyBpcyBjb25mdXNlZCwgcmVxdWVzdGluZyBvbmVcblx0Ly8gcmVnaW9uIGluIGdlbm9tZSBBIGNhbiBlbmQgdXAgcmVxdWVzdGluZyB0aGUgc2FtZSByZWdpb24gaW4gZ2Vub21lIEIgbXVsdGlwbGUgdGltZXMuXG5cdC8vIFRoaXMgZnVuY3Rpb24gYXZvaWRzIGRyYXdpbmcgdGhlIHNhbWUgc2Jsb2NrIHR3aWNlLiAoTkI6IFJlYWxseSBub3Qgc3VyZSB3aGVyZSB0aGlzIFxuXHQvLyBjaGVjayBpcyBiZXN0IGRvbmUuIENvdWxkIHB1c2ggaXQgZmFydGhlciB1cHN0cmVhbS4pXG5cdGxldCBzZWVuID0gbmV3IFNldCgpO1xuXHRyZXR1cm4gYmxvY2tzLmZpbHRlciggYiA9PiB7IFxuXHQgICAgaWYgKHNlZW4uaGFzKGIuaW5kZXgpKSByZXR1cm4gZmFsc2U7XG5cdCAgICBzZWVuLmFkZChiLmluZGV4KTtcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9KTtcbiAgICB9O1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFwcGxpZXMgc2V2ZXJhbCB0cmFuc2Zvcm1hdGlvbiBzdGVwcyBvbiB0aGUgZGF0YSBhcyByZXR1cm5lZCBieSB0aGUgc2VydmVyIHRvIHByZXBhcmUgZm9yIGRyYXdpbmcuXG4gICAgLy8gSW5wdXQgZGF0YSBpcyBzdHJ1Y3R1cmVkIGFzIGZvbGxvd3M6XG4gICAgLy8gICAgIGRhdGEgPSBbIHpvb21TdHJpcF9kYXRhIF1cbiAgICAvLyAgICAgem9vbVN0cmlwX2RhdGEgPSB7IGdlbm9tZSBbIHpvb21CbG9ja19kYXRhIF0gfVxuICAgIC8vICAgICB6b29tQmxvY2tfZGF0YSA9IHsgeHNjYWxlLCBjaHIsIHN0YXJ0LCBlbmQsIGluZGV4LCBmQ2hyLCBmU3RhcnQsIGZFbmQsIGZJbmRleCwgb3JpLCBbIGZlYXR1cmVfZGF0YSBdIH1cbiAgICAvLyAgICAgZmVhdHVyZV9kYXRhID0geyBJRCwgY2Fub25pY2FsLCBzeW1ib2wsIGNociwgc3RhcnQsIGVuZCwgc3RyYW5kLCB0eXBlLCBiaW90eXBlIH1cbiAgICAvL1xuICAgIC8vIEFnYWluLCBpbiBFbmdsaXNoOlxuICAgIC8vICAtIGRhdGEgaXMgYSBsaXN0IG9mIGl0ZW1zLCBvbmUgcGVyIHN0cmlwIHRvIGJlIGRpc3BsYXllZC4gSXRlbVswXSBpcyBkYXRhIGZvciB0aGUgcmVmIGdlbm9tZS5cbiAgICAvLyAgICBJdGVtc1sxK10gYXJlIGRhdGEgZm9yIHRoZSBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvLyAgLSBlYWNoIHN0cmlwIGl0ZW0gaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBnZW5vbWUgYW5kIGEgbGlzdCBvZiBibG9ja3MuIEl0ZW1bMF0gYWx3YXlzIGhhcyBcbiAgICAvLyAgICBhIHNpbmdsZSBibG9jay5cbiAgICAvLyAgLSBlYWNoIGJsb2NrIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGEgY2hyb21vc29tZSwgc3RhcnQsIGVuZCwgb3JpZW50YXRpb24sIGV0YywgYW5kIGEgbGlzdCBvZiBmZWF0dXJlcy5cbiAgICAvLyAgLSBlYWNoIGZlYXR1cmUgaGFzIGNocixzdGFydCxlbmQsc3RyYW5kLHR5cGUsYmlvdHlwZSxJRFxuICAgIC8vXG4gICAgLy8gQmVjYXVzZSBTQmxvY2tzIGNhbiBiZSB2ZXJ5IGZyYWdtZW50ZWQsIG9uZSBjb250aWd1b3VzIHJlZ2lvbiBpbiB0aGUgcmVmIGdlbm9tZSBjYW4gdHVybiBpbnRvIFxuICAgIC8vIGEgYmF6aWxsaW9uIHRpbnkgYmxvY2tzIGluIHRoZSBjb21wYXJpc29uLiBUaGUgcmVzdWx0aW5nIHJlbmRlcmluZyBpcyBqYXJyaW5nIGFuZCB1bnVzYWJsZS5cbiAgICAvLyBUaGUgZHJhd2luZyByb3V0aW5lIG1vZGlmaWVzIHRoZSBkYXRhIGJ5IG1lcmdpbmcgcnVucyBvZiBjb25zZWN1dGl2ZSBibG9ja3MgaW4gZWFjaCBjb21wIGdlbm9tZS5cbiAgICAvLyBUaGUgZGF0YSBjaGFuZ2UgaXMgdG8gaW5zZXJ0IGEgZ3JvdXBpbmcgbGF5ZXIgb24gdG9wIG9mIHRoZSBzYmxvY2tzLCBzcGVjaWZpY2FsbHksIFxuICAgIC8vICAgICB6b29tU3RyaXBfZGF0YSA9IHsgZ2Vub21lIFsgem9vbUJsb2NrX2RhdGEgXSB9XG4gICAgLy8gYmVjb21lc1xuICAgIC8vICAgICB6b29tU3RyaXBfZGF0YSA9IHsgZ2Vub21lIFsgem9vbVN1cGVyQmxvY2tfZGF0YSBdIH1cbiAgICAvLyAgICAgem9vbVN1cGVyQmxvY2tfZGF0YSA9IHsgY2hyIHN0YXJ0IGVuZCBibG9ja3MgWyB6b29tQmxvY2tfZGF0YSBdIH1cbiAgICAvL1xuICAgIG11bmdlRGF0YSAoZGF0YSkge1xuICAgICAgICBkYXRhLmZvckVhY2goZ0RhdGEgPT4ge1xuXHQgICAgZ0RhdGEuYmxvY2tzID0gdGhpcy51bmlxaWZ5QmxvY2tzKGdEYXRhLmJsb2Nrcylcblx0ICAgIC8vIEVhY2ggc3RyaXAgaXMgaW5kZXBlbmRlbnRseSBzY3JvbGxhYmxlLiBJbml0IGl0cyBvZmZzZXQgKGluIGJ5dGVzKS5cblx0ICAgIGdEYXRhLmRlbHRhQiA9IDA7XG5cdCAgICAvLyBFYWNoIHN0cmlwIGlzIGluZGVwZW5kZW50bHkgc2NhbGFibGUuIEluaXQgc2NhbGUuXG5cdCAgICBnRGF0YS54U2NhbGUgPSAxLjA7XG5cdH0pO1xuXHRkYXRhID0gdGhpcy5tZXJnZVNibG9ja1J1bnMoZGF0YSk7XG5cdC8vIFxuXHRkYXRhLmZvckVhY2goIGdEYXRhID0+IHtcblx0ICAvLyBtaW5pbXVtIG9mIDMgbGFuZXMgb24gZWFjaCBzaWRlXG5cdCAgZ0RhdGEubWF4TGFuZXNQID0gMztcblx0ICBnRGF0YS5tYXhMYW5lc04gPSAzO1xuXHQgIGdEYXRhLmJsb2Nrcy5mb3JFYWNoKCBzYj0+IHtcblx0ICAgIHNiLmZlYXR1cmVzLmZvckVhY2goZiA9PiB7XG5cdFx0aWYgKGYubGFuZSA+IDApXG5cdFx0ICAgIGdEYXRhLm1heExhbmVzUCA9IE1hdGgubWF4KGdEYXRhLm1heExhbmVzUCwgZi5sYW5lKVxuXHRcdGVsc2Vcblx0XHQgICAgZ0RhdGEubWF4TGFuZXNOID0gTWF0aC5tYXgoZ0RhdGEubWF4TGFuZXNOLCAtZi5sYW5lKVxuXHQgICAgfSk7XG5cdCAgfSk7XG5cdCAgaWYgKGdEYXRhLmJsb2Nrcy5sZW5ndGggPiAxKVxuXHQgICAgICBnRGF0YS5ibG9ja3MgPSBnRGF0YS5ibG9ja3MuZmlsdGVyKGI9PmIuZmVhdHVyZXMubGVuZ3RoID4gMCk7XG5cdCAgZ0RhdGEuc3RyaXBIZWlnaHQgPSAxNSArIHRoaXMubGFuZUhlaWdodCAqIChnRGF0YS5tYXhMYW5lc1AgKyBnRGF0YS5tYXhMYW5lc04pO1xuXHQgIGdEYXRhLnplcm9PZmZzZXQgPSB0aGlzLmxhbmVIZWlnaHQgKiBnRGF0YS5tYXhMYW5lc1A7XG5cdH0pO1xuXHRyZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBPcmRlcnMgc2Jsb2NrcyBob3Jpem9udGFsbHkgd2l0aGluIGVhY2ggZ2Vub21lLiBUcmFuc2xhdGVzIHRoZW0gaW50byBwb3NpdGlvbi5cbiAgICAvL1xuICAgIGxheW91dFNCbG9ja3MgKHNibG9ja3MpIHtcblx0Ly8gU29ydCB0aGUgc2Jsb2NrcyBpbiBlYWNoIHN0cmlwIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBkcmF3aW5nIG1vZGUuXG5cdGxldCBjbXBGaWVsZCA9IHRoaXMuZG1vZGUgPT09ICdjb21wYXJpc29uJyA/ICdpbmRleCcgOiAnZkluZGV4Jztcblx0bGV0IGNtcEZ1bmMgPSAoYSxiKSA9PiBhLl9fZGF0YV9fW2NtcEZpZWxkXS1iLl9fZGF0YV9fW2NtcEZpZWxkXTtcblx0c2Jsb2Nrcy5mb3JFYWNoKCBzdHJpcCA9PiBzdHJpcC5zb3J0KCBjbXBGdW5jICkgKTtcblx0bGV0IHBzdGFydCA9IFtdOyAvLyBvZmZzZXQgKGluIHBpeGVscykgb2Ygc3RhcnQgcG9zaXRpb24gb2YgbmV4dCBibG9jaywgYnkgc3RyaXAgaW5kZXggKDA9PT1yZWYpXG5cdGxldCBic3RhcnQgPSBbXTsgLy8gYmxvY2sgc3RhcnQgcG9zIChpbiBicCkgYXNzb2Mgd2l0aCBwc3RhcnRcblx0bGV0IGNjaHIgPSBudWxsO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCBHQVAgID0gMTY7ICAgLy8gbGVuZ3RoIG9mIGdhcCBiZXR3ZWVuIGJsb2NrcyBvZiBkaWZmIGNocm9tcy5cblx0bGV0IGR4O1xuXHRsZXQgcGVuZDtcblx0c2Jsb2Nrcy5lYWNoKCBmdW5jdGlvbiAoYixpLGopIHsgLy8gYj1ibG9jaywgaT1pbmRleCB3aXRoaW4gc3RyaXAsIGo9c3RyaXAgaW5kZXhcblx0ICAgIGxldCBnZCA9IHRoaXMuX19kYXRhX18uZ2Vub21lO1xuXHQgICAgbGV0IGJsZW4gPSBzZWxmLnBwYiAqIChiLmVuZCAtIGIuc3RhcnQgKyAxKTsgLy8gdG90YWwgc2NyZWVuIHdpZHRoIG9mIHRoaXMgc2Jsb2NrXG5cdCAgICBiLmZsaXAgPSBiLm9yaSA9PT0gJy0nICYmIHNlbGYuZG1vZGUgPT09ICdyZWZlcmVuY2UnO1xuXHQgICAgYi54c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW2Iuc3RhcnQsIGIuZW5kXSkucmFuZ2UoIGIuZmxpcCA/IFtibGVuLCAwXSA6IFswLCBibGVuXSApO1xuXHQgICAgLy9cblx0ICAgIGlmIChpPT09MCkge1xuXHRcdC8vIGZpcnN0IGJsb2NrIGluIGVhY2ggc3RyaXAgaW5pdHNcblx0XHRwc3RhcnRbal0gPSAwO1xuXHRcdGdkLnB3aWR0aCA9IGJsZW47XG5cdFx0YnN0YXJ0W2pdID0gYi5zdGFydDtcblx0XHRkeCA9IDA7XG5cdFx0Y2NociA9IGIuY2hyO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0Z2QucHdpZHRoICs9IGJsZW47XG5cdFx0ZHggPSBiLmNociA9PT0gY2NociA/IHBzdGFydFtqXSArIHNlbGYucHBiICogKGIuc3RhcnQgLSBic3RhcnRbal0pIDogSW5maW5pdHk7XG5cdFx0aWYgKGR4IDwgMCB8fCBkeCA+IHNlbGYubWF4U0JnYXApIHtcblx0XHQgICAgLy8gQ2hhbmdlZCBjaHIgb3IganVtcGVkIGEgbGFyZ2UgZ2FwXG5cdFx0ICAgIHBzdGFydFtqXSA9IHBlbmQgKyBHQVA7XG5cdFx0ICAgIGJzdGFydFtqXSA9IGIuc3RhcnQ7XG5cdFx0ICAgIGdkLnB3aWR0aCArPSBHQVA7XG5cdFx0ICAgIGR4ID0gcHN0YXJ0W2pdO1xuXHRcdCAgICBjY2hyID0gYi5jaHI7XG5cdFx0fVxuXHQgICAgfVxuXHQgICAgcGVuZCA9IGR4ICsgYmxlbjtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7ZHh9LDApYCk7XG5cdH0pO1xuXHR0aGlzLnNxdWlzaCgpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNjYWxlcyBlYWNoIHpvb20gc3RyaXAgaG9yaXpvbnRhbGx5IHRvIGZpdCB0aGUgd2lkdGguIE9ubHkgc2NhbGVzIGRvd24uXG4gICAgc3F1aXNoICgpIHtcbiAgICAgICAgbGV0IHNicyA9IGQzLnNlbGVjdEFsbCgnLnpvb21TdHJpcCBbbmFtZT1cInNCbG9ja3NcIl0nKTtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRzYnMuZWFjaChmdW5jdGlvbiAoc2IsaSkge1xuXHQgICAgaWYgKHNiLmdlbm9tZS5wd2lkdGggPiBzZWxmLndpZHRoKSB7XG5cdCAgICAgICAgbGV0IHMgPSBzZWxmLndpZHRoIC8gc2IuZ2Vub21lLnB3aWR0aDtcblx0XHRzYi54U2NhbGUgPSBzO1xuXHRcdGxldCB0ID0gZDMuc2VsZWN0KHRoaXMpO1xuXHRcdHQuYXR0cigndHJhbnNmb3JtJywgKCk9PiBgdHJhbnNsYXRlKCR7LXNiLmRlbHRhQiAqIHNlbGYucHBifSwwKXNjYWxlKCR7c2IueFNjYWxlfSwxKWApO1xuXHQgICAgfVxuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIHpvb20gdmlldyBwYW5lbCB3aXRoIHRoZSBnaXZlbiBkYXRhLlxuICAgIC8vXG4gICAgZHJhdyAoZGF0YSkge1xuXHQvLyBcblx0bGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBJcyBab29tVmlldyBjdXJyZW50bHkgY2xvc2VkP1xuXHRsZXQgY2xvc2VkID0gdGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpO1xuXHQvLyBTaG93IHJlZiBnZW5vbWUgbmFtZVxuXHRkMy5zZWxlY3QoJyN6b29tVmlldyAuem9vbUNvb3JkcyBsYWJlbCcpXG5cdCAgICAudGV4dCh0aGlzLmFwcC5yR2Vub21lLmxhYmVsICsgJyBjb29yZHMnKTtcblx0Ly8gU2hvdyBsYW5kbWFyayBsYWJlbCwgaWYgYXBwbGljYWJsZVxuXHRsZXQgbG10eHQgPSAnJztcblx0aWYgKHRoaXMuY21vZGUgPT09ICdsYW5kbWFyaycpIHtcblx0ICAgIGxldCByZiA9IHRoaXMuYXBwLmxjb29yZHMubGFuZG1hcmtSZWZGZWF0O1xuXHQgICAgbGV0IGQgPSB0aGlzLmFwcC5sY29vcmRzLmRlbHRhO1xuXHQgICAgbGV0IGR0eHQgPSBkID8gYCAoJHtkID4gMCA/ICcrJyA6ICcnfSR7cHJldHR5UHJpbnRCYXNlcyhkKX0pYCA6ICcnO1xuXHQgICAgbG10eHQgPSBgQWxpZ25lZCBvbiAke3JmLnN5bWJvbCB8fCByZi5pZH0ke2R0eHR9YDtcblx0fVxuXHQvLyBkaXNhYmxlIHRoZSBSL0MgYnV0dG9uIGluIGxhbmRtYXJrIG1vZGVcblx0dGhpcy5yb290LnNlbGVjdEFsbCgnW25hbWU9XCJ6b29tY29udHJvbHNcIl0gW25hbWU9XCJ6b29tRG1vZGVcIl0gLmJ1dHRvbicpXG5cdCAgICAuYXR0cignZGlzYWJsZWQnLCB0aGlzLmNtb2RlID09PSAnbGFuZG1hcmsnIHx8IG51bGwpO1xuXHQvLyBkaXNwbGF5IGxhbmRtYXJrIHRleHRcblx0ZDMuc2VsZWN0KCcjem9vbVZpZXcgLnpvb21Db29yZHMgc3BhbicpLnRleHQoIGxtdHh0ICk7XG5cdFxuXHQvLyB0aGUgcmVmZXJlbmNlIGdlbm9tZSBibG9jayAoYWx3YXlzIGp1c3QgMSBvZiB0aGVzZSkuXG5cdGxldCByRGF0YSA9IGRhdGEuZmlsdGVyKGRkID0+IGRkLmdlbm9tZSA9PT0gdGhpcy5hcHAuckdlbm9tZSlbMF07XG5cdGxldCByQmxvY2sgPSByRGF0YS5ibG9ja3NbMF07XG5cblx0Ly8geC1zY2FsZSBhbmQgeC1heGlzIGJhc2VkIG9uIHRoZSByZWYgZ2Vub21lLlxuXHR0aGlzLnhzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdCAgICAuZG9tYWluKFtyQmxvY2suc3RhcnQsckJsb2NrLmVuZF0pXG5cdCAgICAucmFuZ2UoWzAsdGhpcy53aWR0aF0pO1xuXG5cdC8vIHBpeGVscyBwZXIgYmFzZVxuXHR0aGlzLnBwYiA9IHRoaXMud2lkdGggLyAodGhpcy5hcHAuY29vcmRzLmVuZCAtIHRoaXMuYXBwLmNvb3Jkcy5zdGFydCArIDEpO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIGRyYXcgdGhlIGNvb3JkaW5hdGUgYXhpc1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHR0aGlzLmF4aXNGdW5jID0gZDMuc3ZnLmF4aXMoKVxuXHQgICAgLnNjYWxlKHRoaXMueHNjYWxlKVxuXHQgICAgLm9yaWVudCgndG9wJylcblx0ICAgIC5vdXRlclRpY2tTaXplKDIpXG5cdCAgICAudGlja3MoNSlcblx0ICAgIC50aWNrU2l6ZSg1KVxuXHQgICAgO1xuXHR0aGlzLmF4aXMuY2FsbCh0aGlzLmF4aXNGdW5jKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyB6b29tIHN0cmlwcyAob25lIHBlciBnZW5vbWUpXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGxldCB6c3RyaXBzID0gdGhpcy5zdHJpcHNHcnBcblx0ICAgICAgICAuc2VsZWN0QWxsKCdnLnpvb21TdHJpcCcpXG5cdFx0LmRhdGEoZGF0YSwgZCA9PiBkLmdlbm9tZS5uYW1lKTtcblx0Ly8gQ3JlYXRlIHRoZSBncm91cFxuXHRsZXQgbmV3enMgPSB6c3RyaXBzLmVudGVyKClcblx0ICAgICAgICAuYXBwZW5kKCdnJylcblx0XHQuYXR0cignY2xhc3MnLCd6b29tU3RyaXAnKVxuXHRcdC5hdHRyKCduYW1lJywgZCA9PiBkLmdlbm9tZS5uYW1lKVxuXHRcdC5vbignY2xpY2snLCBmdW5jdGlvbiAoZykge1xuXHRcdCAgICBzZWxmLmhpZ2hsaWdodFN0cmlwKGcuZ2Vub21lLCB0aGlzKTtcblx0XHR9KVxuXHRcdC5jYWxsKHRoaXMuZHJhZ2dlcilcblx0XHQ7XG5cdC8vXG5cdC8vIFN0cmlwIGxhYmVsXG5cdG5ld3pzLmFwcGVuZCgndGV4dCcpXG5cdCAgICAuYXR0cignbmFtZScsICdnZW5vbWVMYWJlbCcpXG5cdCAgICAudGV4dCggZCA9PiBkLmdlbm9tZS5sYWJlbClcblx0ICAgIC5hdHRyKCd4JywgMClcblx0ICAgIC5hdHRyKCd5JywgdGhpcy5ibG9ja0hlaWdodC8yICsgMjApXG5cdCAgICAuYXR0cignZm9udC1mYW1pbHknLCdzYW5zLXNlcmlmJylcblx0ICAgIC5hdHRyKCdmb250LXNpemUnLCAxMClcblx0ICAgIDtcblx0Ly8gU3RyaXAgdW5kZXJsYXlcblx0bmV3enMuYXBwZW5kKCdyZWN0Jylcblx0ICAgIC5hdHRyKCdjbGFzcycsJ3VuZGVybGF5Jylcblx0ICAgIC5hdHRyKCd5JywgLXRoaXMuYmxvY2tIZWlnaHQvMilcblx0ICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmJsb2NrSGVpZ2h0KVxuXHQgICAgLnN0eWxlKCd3aWR0aCcsJzEwMCUnKVxuXHQgICAgLnN0eWxlKCdvcGFjaXR5JywwKVxuXHQgICAgO1xuXHQvLyBHcm91cCBmb3Igc0Jsb2Nrc1xuXHRuZXd6cy5hcHBlbmQoJ2cnKVxuXHQgICAgLmF0dHIoJ25hbWUnLCAnc0Jsb2NrcycpO1xuXHQvLyBTdHJpcCBlbmQgY2FwXG5cdG5ld3pzLmFwcGVuZCgncmVjdCcpXG5cdCAgICAuYXR0cignY2xhc3MnLCAnbWF0ZXJpYWwtaWNvbnMgem9vbVN0cmlwRW5kQ2FwJylcblx0ICAgIC5hdHRyKCd4JywgLTE1KVxuXHQgICAgLmF0dHIoJ3knLCAtdGhpcy5ibG9ja0hlaWdodCAvIDIpXG5cdCAgICAuYXR0cignd2lkdGgnLCAxNSlcblx0ICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmJsb2NrSGVpZ2h0ICsgMTApXG5cdCAgICA7XG5cdC8vIFN0cmlwIGRyYWctaGFuZGxlXG5cdG5ld3pzLmFwcGVuZCgndGV4dCcpXG5cdCAgICAuYXR0cignY2xhc3MnLCAnbWF0ZXJpYWwtaWNvbnMgem9vbVN0cmlwSGFuZGxlJylcblx0ICAgIC5zdHlsZSgnZm9udC1zaXplJywgJzE4cHgnKVxuXHQgICAgLmF0dHIoJ3gnLCAtMTUpXG5cdCAgICAuYXR0cigneScsIDkpXG5cdCAgICAudGV4dCgnZHJhZ19pbmRpY2F0b3InKVxuXHQgICAgLmFwcGVuZCgndGl0bGUnKVxuXHQgICAgICAgIC50ZXh0KCdEcmFnIHVwL2Rvd24gdG8gcmVvcmRlciB0aGUgZ2Vub21lcy4nKVxuXHQgICAgO1xuXHQvLyB0cmFuc2xhdGUgc3RyaXBzIGludG8gcG9zaXRpb25cblx0bGV0IG9mZnNldCA9IHRoaXMudG9wT2Zmc2V0O1xuXHRsZXQgckhlaWdodCA9IDA7XG5cdHRoaXMuYXBwLnZHZW5vbWVzLmZvckVhY2goIHZnID0+IHtcblx0ICAgIGxldCBzID0gdGhpcy5zdHJpcHNHcnAuc2VsZWN0KGAuem9vbVN0cmlwW25hbWU9XCIke3ZnLm5hbWV9XCJdYCk7XG5cdCAgICBzLmNsYXNzZWQoJ3JlZmVyZW5jZScsIGQgPT4gZC5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpXG5cdCAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGQgPT4ge1xuXHRcdCAgICAvL3JldHVybiBgdHJhbnNsYXRlKDAsJHtjbG9zZWQgPyB0aGlzLnRvcE9mZnNldCA6IGcuZ2Vub21lLnpvb21ZfSlgXG5cdFx0ICAgIGlmIChkLmdlbm9tZSA9PT0gdGhpcy5hcHAuckdlbm9tZSlcblx0XHQgICAgICAgIHJIZWlnaHQgPSBkLnN0cmlwSGVpZ2h0ICsgZC56ZXJvT2Zmc2V0O1xuXHRcdCAgICBsZXQgbyA9IG9mZnNldCArIGQuemVyb09mZnNldDtcblx0XHQgICAgZC56b29tWSA9IG9mZnNldDtcblx0XHQgICAgb2Zmc2V0ICs9IGQuc3RyaXBIZWlnaHQgKyB0aGlzLnN0cmlwR2FwO1xuXHRcdCAgICByZXR1cm4gYHRyYW5zbGF0ZSgwLCR7Y2xvc2VkID8gdGhpcy50b3BPZmZzZXQrZC56ZXJvT2Zmc2V0IDogb30pYFxuXHRcdH0pO1xuXHR9KTtcblx0Ly8gcmVzZXQgdGhlIHN2ZyBzaXplIGJhc2VkIG9uIHN0cmlwIHdpZHRoc1xuXHR0aGlzLnN2Zy5hdHRyKCdoZWlnaHQnLCAoY2xvc2VkID8gckhlaWdodCA6IG9mZnNldCkgKyAxNSk7XG5cbiAgICAgICAgenN0cmlwcy5leGl0KClcblx0ICAgIC5vbignLmRyYWcnLCBudWxsKVxuXHQgICAgLnJlbW92ZSgpO1xuXHQvL1xuICAgICAgICB6c3RyaXBzLnNlbGVjdCgnZ1tuYW1lPVwic0Jsb2Nrc1wiXScpXG5cdCAgICAuYXR0cigndHJhbnNmb3JtJywgZyA9PiBgdHJhbnNsYXRlKCR7Zy5kZWx0YUIgKiB0aGlzLnBwYn0sMClgKVxuXHQgICAgO1xuXHQvLyAtLS0tIFN5bnRlbnkgc3VwZXIgYmxvY2tzIC0tLS1cbiAgICAgICAgbGV0IHNibG9ja3MgPSB6c3RyaXBzLnNlbGVjdCgnW25hbWU9XCJzQmxvY2tzXCJdJykuc2VsZWN0QWxsKCdnLnNCbG9jaycpXG5cdCAgICAuZGF0YShkPT5kLmJsb2NrcywgYiA9PiBiLmJsb2NrSWQpO1xuXHRsZXQgbmV3c2JzID0gc2Jsb2Nrcy5lbnRlcigpXG5cdCAgICAuYXBwZW5kKCdnJylcblx0ICAgIC5hdHRyKCdjbGFzcycsICdzQmxvY2snKVxuXHQgICAgLmF0dHIoJ25hbWUnLCBiPT5iLmluZGV4KVxuXHQgICAgO1xuXHRsZXQgbDAgPSBuZXdzYnMuYXBwZW5kKCdnJykuYXR0cignbmFtZScsICdsYXllcjAnKTtcblx0bGV0IGwxID0gbmV3c2JzLmFwcGVuZCgnZycpLmF0dHIoJ25hbWUnLCAnbGF5ZXIxJyk7XG5cblx0Ly9cblx0dGhpcy5sYXlvdXRTQmxvY2tzKHNibG9ja3MpO1xuXG5cdC8vIHJlY3RhbmdsZSBmb3IgZWFjaCBpbmRpdmlkdWFsIHN5bnRlbnkgYmxvY2tcblx0bGV0IHNicmVjdHMgPSBzYmxvY2tzLnNlbGVjdCgnZ1tuYW1lPVwibGF5ZXIwXCJdJykuc2VsZWN0QWxsKCdyZWN0LmJsb2NrJykuZGF0YShkPT4ge1xuXHQgICAgZC5zYmxvY2tzLmZvckVhY2goYj0+Yi54c2NhbGUgPSBkLnhzY2FsZSk7XG5cdCAgICByZXR1cm4gZC5zYmxvY2tzXG5cdCAgICB9LCBzYj0+c2IuaW5kZXgpO1xuICAgICAgICBzYnJlY3RzLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuYXBwZW5kKCd0aXRsZScpO1xuXHRzYnJlY3RzLmV4aXQoKS5yZW1vdmUoKTtcblx0c2JyZWN0c1xuXHQgICAuYXR0cignY2xhc3MnLCBiID0+ICdibG9jayAnICsgXG5cdCAgICAgICAoYi5vcmk9PT0nKycgPyAncGx1cycgOiBiLm9yaT09PSctJyA/ICdtaW51cyc6ICdjb25mdXNlZCcpICsgXG5cdCAgICAgICAoYi5jaHIgIT09IGIuZkNociA/ICcgdHJhbnNsb2NhdGlvbicgOiAnJykpXG5cdCAgIC5hdHRyKCd4JywgICAgIGIgPT4gYi54c2NhbGUoYi5mbGlwID8gYi5lbmQgOiBiLnN0YXJ0KSlcblx0ICAgLmF0dHIoJ3knLCAgICAgYiA9PiAtdGhpcy5ibG9ja0hlaWdodCAvIDIpXG5cdCAgIC5hdHRyKCd3aWR0aCcsIGIgPT4gTWF0aC5tYXgoNCwgTWF0aC5hYnMoYi54c2NhbGUoYi5lbmQpLWIueHNjYWxlKGIuc3RhcnQpKSkpXG5cdCAgIC5hdHRyKCdoZWlnaHQnLHRoaXMuYmxvY2tIZWlnaHQpO1xuXHQgICA7XG5cdHNicmVjdHMuc2VsZWN0KCd0aXRsZScpXG5cdCAgIC50ZXh0KCBiID0+IHtcblx0ICAgICAgIGxldCBhZGplY3RpdmVzID0gW107XG5cdCAgICAgICBiLm9yaSA9PT0gJy0nICYmIGFkamVjdGl2ZXMucHVzaCgnaW52ZXJ0ZWQnKTtcblx0ICAgICAgIGIuY2hyICE9PSBiLmZDaHIgJiYgYWRqZWN0aXZlcy5wdXNoKCd0cmFuc2xvY2F0ZWQnKTtcblx0ICAgICAgIHJldHVybiBhZGplY3RpdmVzLmxlbmd0aCA/IGFkamVjdGl2ZXMuam9pbignLCAnKSArICcgYmxvY2snIDogJyc7XG5cdCAgIH0pO1xuXG5cdC8vIHRoZSBheGlzIGxpbmVcblx0bDAuYXBwZW5kKCdsaW5lJykuYXR0cignY2xhc3MnLCdheGlzJyk7XG5cdFxuXHRzYmxvY2tzLnNlbGVjdCgnbGluZS5heGlzJylcblx0ICAgIC5hdHRyKCd4MScsIGIgPT4gYi54c2NhbGUoYi5zdGFydCkpXG5cdCAgICAuYXR0cigneTEnLCAwKVxuXHQgICAgLmF0dHIoJ3gyJywgYiA9PiBiLnhzY2FsZShiLmVuZCkpXG5cdCAgICAuYXR0cigneTInLCAwKVxuXHQgICAgO1xuXHQvLyBsYWJlbFxuXHRsMC5hcHBlbmQoJ3RleHQnKVxuXHQgICAgLmF0dHIoJ2NsYXNzJywnYmxvY2tMYWJlbCcpIDtcblx0Ly8gYnJ1c2hcblx0bDAuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCdicnVzaCcpO1xuXHQvL1xuXHRzYmxvY2tzLmV4aXQoKS5yZW1vdmUoKTtcblxuXHQvLyBzeW50ZW55IGJsb2NrIGxhYmVsc1xuXHRzYmxvY2tzLnNlbGVjdCgndGV4dC5ibG9ja0xhYmVsJylcblx0ICAgIC50ZXh0KCBiID0+IGIuY2hyIClcblx0ICAgIC5hdHRyKCd4JywgYiA9PiAoYi54c2NhbGUoYi5zdGFydCkgKyBiLnhzY2FsZShiLmVuZCkpLzIgKVxuXHQgICAgLmF0dHIoJ3knLCB0aGlzLmJsb2NrSGVpZ2h0IC8gMiArIDEwKVxuXHQgICAgO1xuXG5cdC8vIGJydXNoXG5cdHNibG9ja3Muc2VsZWN0KCdnLmJydXNoJylcblx0ICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBiID0+IGB0cmFuc2xhdGUoMCwke3RoaXMuYmxvY2tIZWlnaHQgLyAyfSlgKVxuXHQgICAgLm9uKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihiKSB7XG5cdCAgICAgICAgbGV0IGNyID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRsZXQgeCA9IGQzLmV2ZW50LmNsaWVudFggLSBjci54O1xuXHRcdGxldCBjID0gTWF0aC5yb3VuZChiLnhzY2FsZS5pbnZlcnQoeCkpO1xuXHRcdHNlbGYuc2hvd0Zsb2F0aW5nVGV4dChgJHtiLmNocn06JHtjfWAsIGQzLmV2ZW50LmNsaWVudFgsIGQzLmV2ZW50LmNsaWVudFkpO1xuXHQgICAgfSlcblx0ICAgIC5vbignbW91c2VvdXQnLCBiID0+IHRoaXMuaGlkZUZsb2F0aW5nVGV4dCgpKVxuXHQgICAgLmVhY2goZnVuY3Rpb24oYikge1xuXHRcdGlmICghYi5icnVzaCkge1xuXHRcdCAgICBiLmJydXNoID0gZDMuc3ZnLmJydXNoKClcblx0XHRcdC5vbignYnJ1c2hzdGFydCcsIGZ1bmN0aW9uKCl7IHNlbGYuYmJTdGFydCggYiwgdGhpcyApOyB9KVxuXHRcdFx0Lm9uKCdicnVzaCcsICAgICAgZnVuY3Rpb24oKXsgc2VsZi5iYkJydXNoKCBiLCB0aGlzICk7IH0pXG5cdFx0XHQub24oJ2JydXNoZW5kJywgICBmdW5jdGlvbigpeyBzZWxmLmJiRW5kKCBiLCB0aGlzICk7IH0pXG5cdFx0fVxuXHRcdGIuYnJ1c2gueChiLnhzY2FsZSkuY2xlYXIoKTtcblx0XHRkMy5zZWxlY3QodGhpcykuY2FsbChiLmJydXNoKTtcblx0ICAgIH0pXG5cdCAgICAuc2VsZWN0QWxsKCdyZWN0Jylcblx0XHQuYXR0cignaGVpZ2h0JywgMTApO1xuXG5cdHRoaXMuZHJhd0ZlYXR1cmVzKHNibG9ja3MpO1xuXG5cdC8vXG5cdHRoaXMuYXBwLmZhY2V0TWFuYWdlci5hcHBseUFsbCgpO1xuXG5cdC8vIFdlIG5lZWQgdG8gbGV0IHRoZSB2aWV3IHJlbmRlciBiZWZvcmUgZG9pbmcgdGhlIGhpZ2hsaWdodGluZywgc2luY2UgaXQgZGVwZW5kcyBvblxuXHQvLyB0aGUgcG9zaXRpb25zIG9mIHJlY3RhbmdsZXMgaW4gdGhlIHNjZW5lLlxuXHR3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG5cdCAgICB0aGlzLmhpZ2hsaWdodCgpO1xuXHR9LCAxNTApO1xuICAgIH07XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgZmVhdHVyZXMgKHJlY3RhbmdsZXMpIGZvciB0aGUgc3BlY2lmaWVkIHN5bnRlbnkgYmxvY2tzLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIHNibG9ja3MgKEQzIHNlbGVjdGlvbiBvZiBnLnNibG9jayBub2RlcykgLSBtdWx0aWxldmVsIHNlbGVjdGlvbi5cbiAgICAvLyAgICAgICAgQXJyYXkgKGNvcnJlc3BvbmRpbmcgdG8gc3RyaXBzKSBvZiBhcnJheXMgb2Ygc3ludGVueSBibG9ja3MuXG4gICAgLy8gICAgIGRldGFpbGVkIChib29sZWFuKSBpZiB0cnVlLCBkcmF3cyBlYWNoIGZlYXR1cmUgaW4gZnVsbCBkZXRhaWwgKGllLFxuICAgIC8vICAgICAgICBzaG93IGV4b24gc3RydWN0dXJlIGlmIGF2YWlsYWJsZSkuIE90aGVyd2lzZSAodGhlIGRlZmF1bHQpLCBkcmF3XG4gICAgLy8gICAgICAgIGVhY2ggZmVhdHVyZSBhcyBqdXN0IGEgcmVjdGFuZ2xlLlxuICAgIC8vXG4gICAgZHJhd0ZlYXR1cmVzIChzYmxvY2tzKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblx0Ly9cblx0Ly8gbmV2ZXIgZHJhdyB0aGUgc2FtZSBmZWF0dXJlIHR3aWNlIGluIG9uZSByZW5kZXJpbmcgcGFzc1xuXHRsZXQgZHJhd24gPSBuZXcgU2V0KCk7XHQvLyBzZXQgb2YgSURzIG9mIGRyYXduIGZlYXR1cmVzXG5cdGxldCBmaWx0ZXJEcmF3biA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICAvLyByZXR1cm5zIHRydWUgaWYgd2UndmUgbm90IHNlZW4gdGhpcyBvbmUgYmVmb3JlLlxuXHQgICAgLy8gcmVnaXN0ZXJzIHRoYXQgd2UndmUgc2VlbiBpdC5cblx0ICAgIGxldCBmaWQgPSBmLklEO1xuXHQgICAgbGV0IHYgPSAhIGRyYXduLmhhcyhmaWQpO1xuXHQgICAgZHJhd24uYWRkKGZpZCk7XG5cdCAgICByZXR1cm4gdjtcblx0fTtcblx0bGV0IGZlYXRzID0gc2Jsb2Nrcy5zZWxlY3QoJ1tuYW1lPVwibGF5ZXIxXCJdJykuc2VsZWN0QWxsKCcuZmVhdHVyZScpXG5cdCAgICAuZGF0YShkPT5kLmZlYXR1cmVzLmZpbHRlcihmaWx0ZXJEcmF3biksIGQ9PmQuSUQpO1xuXHRmZWF0cy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGxldCBuZXdGZWF0cztcblx0aWYgKHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzKSBcblx0ICAgIG5ld0ZlYXRzID0gZmVhdHMuZW50ZXIoKS5hcHBlbmQoJ2cnKVxuXHRcdC5hdHRyKCdjbGFzcycsIGYgPT4gJ2ZlYXR1cmUnICsgKGYuc3RyYW5kPT09Jy0nID8gJyBtaW51cycgOiAnIHBsdXMnKSlcblx0XHQuYXR0cignbmFtZScsIGYgPT4gZi5JRClcblx0XHQuYXBwZW5kKCdyZWN0Jylcblx0XHQgICAgLnN0eWxlKCdmaWxsJywgZiA9PiBzZWxmLmFwcC5jc2NhbGUoZi5nZXRNdW5nZWRUeXBlKCkpKVxuXHRcdCAgICA7XG5cdGVsc2Vcblx0ICAgIG5ld0ZlYXRzID0gZmVhdHMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuXHRcdC5hdHRyKCdjbGFzcycsIGYgPT4gJ2ZlYXR1cmUnICsgKGYuc3RyYW5kPT09Jy0nID8gJyBtaW51cycgOiAnIHBsdXMnKSlcblx0XHQuYXR0cignbmFtZScsIGYgPT4gZi5JRClcblx0XHQuc3R5bGUoJ2ZpbGwnLCBmID0+IHNlbGYuYXBwLmNzY2FsZShmLmdldE11bmdlZFR5cGUoKSkpXG5cdFx0O1xuXHQvLyBOQjogaWYgeW91IGFyZSBsb29raW5nIGZvciBjbGljayBoYW5kbGVycywgdGhleSBhcmUgYXQgdGhlIHN2ZyBsZXZlbCAoc2VlIGluaXREb20gYWJvdmUpLlxuXG5cdC8vIHJldHVybnMgdGhlIHN5bnRlbnkgYmxvY2sgY29udGFpbmluZyB0aGlzIGZlYXR1cmVcblx0bGV0IGZCbG9jayA9IGZ1bmN0aW9uIChmZWF0RWx0KSB7XG5cdCAgICBsZXQgYmxrRWx0ID0gZmVhdEVsdC5jbG9zZXN0KCcuc0Jsb2NrJyk7XG5cdCAgICByZXR1cm4gYmxrRWx0Ll9fZGF0YV9fO1xuXHR9XG5cdGxldCBmeCA9IGZ1bmN0aW9uKGYpIHtcblx0ICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgcmV0dXJuIGIueHNjYWxlKE1hdGgubWF4KGYuc3RhcnQsYi5zdGFydCkpXG5cdH07XG5cdGxldCBmdyA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICBsZXQgYiA9IGZCbG9jayh0aGlzKTtcblx0ICAgIHJldHVybiBNYXRoLmFicyhiLnhzY2FsZShNYXRoLm1pbihmLmVuZCxiLmVuZCkpIC0gYi54c2NhbGUoTWF0aC5tYXgoZi5zdGFydCxiLnN0YXJ0KSkpICsgMTtcblx0fTtcblx0bGV0IGZ5ID0gZnVuY3Rpb24gKGYpIHtcblx0ICAgICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgICAgaWYgKGYuc3RyYW5kID09ICcrJyl7XG5cdFx0ICAgaWYgKGIuZmxpcCkgXG5cdFx0ICAgICAgIHJldHVybiBzZWxmLmxhbmVIZWlnaHQqZi5sYW5lIC0gc2VsZi5mZWF0SGVpZ2h0OyBcblx0XHQgICBlbHNlIFxuXHRcdCAgICAgICByZXR1cm4gLXNlbGYubGFuZUhlaWdodCpmLmxhbmU7XG5cdCAgICAgICB9XG5cdCAgICAgICBlbHNlIHtcblx0XHQgICAvLyBmLmxhbmUgaXMgbmVnYXRpdmUgZm9yICctJyBzdHJhbmRcblx0XHQgICBpZiAoYi5mbGlwKSBcblx0XHQgICAgICAgcmV0dXJuIHNlbGYubGFuZUhlaWdodCpmLmxhbmU7XG5cdFx0ICAgZWxzZVxuXHRcdCAgICAgICByZXR1cm4gLXNlbGYubGFuZUhlaWdodCpmLmxhbmUgLSBzZWxmLmZlYXRIZWlnaHQ7IFxuXHQgICAgICAgfVxuXHQgICB9O1xuXG5cdCh0aGlzLnNob3dGZWF0dXJlRGV0YWlscyA/IGZlYXRzLnNlbGVjdCgncmVjdCcpIDogZmVhdHMpXG5cdCAgLmF0dHIoJ3gnLCBmeClcblx0ICAuYXR0cignd2lkdGgnLCBmdylcblx0ICAuYXR0cigneScsIGZ5KVxuXHQgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmZlYXRIZWlnaHQpXG5cdCAgO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFVwZGF0ZXMgZmVhdHVyZSBoaWdobGlnaHRpbmcgaW4gdGhlIGN1cnJlbnQgem9vbSB2aWV3LlxuICAgIC8vIEZlYXR1cmVzIHRvIGJlIGhpZ2hsaWdodGVkIGluY2x1ZGUgdGhvc2UgaW4gdGhlIGhpRmVhdHMgbGlzdCBwbHVzIHRoZSBmZWF0dXJlXG4gICAgLy8gY29ycmVzcG9uZGluZyB0byB0aGUgcmVjdGFuZ2xlIGFyZ3VtZW50LCBpZiBnaXZlbi4gKFRoZSBtb3VzZW92ZXIgZmVhdHVyZS4pXG4gICAgLy9cbiAgICAvLyBEcmF3cyBmaWR1Y2lhbHMgZm9yIGZlYXR1cmVzIGluIHRoaXMgbGlzdCB0aGF0OlxuICAgIC8vIDEuIG92ZXJsYXAgdGhlIGN1cnJlbnQgem9vbVZpZXcgY29vcmQgcmFuZ2VcbiAgICAvLyAyLiBhcmUgbm90IHJlbmRlcmVkIGludmlzaWJsZSBieSBjdXJyZW50IGZhY2V0IHNldHRpbmdzXG4gICAgLy9cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgIGN1cnJlbnQgKHJlY3QgZWxlbWVudCkgT3B0aW9uYWwuIEFkZCdsIHJlY3RhbmdsZSBlbGVtZW50LCBlLmcuLCB0aGF0IHdhcyBtb3VzZWQtb3Zlci4gSGlnaGxpZ2h0aW5nXG4gICAgLy8gICAgICAgIHdpbGwgaW5jbHVkZSB0aGUgZmVhdHVyZSBjb3JyZXNwb25kaW5nIHRvIHRoaXMgcmVjdCBhbG9uZyB3aXRoIHRob3NlIGluIHRoZSBoaWdobGlnaHQgbGlzdC5cbiAgICAvLyAgICBwdWxzZUN1cnJlbnQgKGJvb2xlYW4pIElmIHRydWUgYW5kIGN1cnJlbnQgaXMgZ2l2ZW4sIGNhdXNlIGl0IHRvIHB1bHNlIGJyaWVmbHkuXG4gICAgLy9cbiAgICBoaWdobGlnaHQgKGN1cnJlbnQsIHB1bHNlQ3VycmVudCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdC8vIGN1cnJlbnQgZmVhdHVyZVxuXHRsZXQgY3VyckZlYXQgPSBjdXJyZW50ID8gKGN1cnJlbnQgaW5zdGFuY2VvZiBGZWF0dXJlID8gY3VycmVudCA6IGN1cnJlbnQuX19kYXRhX18pIDogbnVsbDtcblx0Ly8gY3JlYXRlIGxvY2FsIGNvcHkgb2YgaGlGZWF0cywgd2l0aCBjdXJyZW50IGZlYXR1cmUgYWRkZWRcblx0bGV0IGhpRmVhdHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmhpRmVhdHMsIHRoaXMuYXBwLmN1cnJMaXN0SW5kZXggfHx7fSk7XG5cdGlmIChjdXJyRmVhdCkge1xuXHQgICAgaGlGZWF0c1tjdXJyRmVhdC5pZF0gPSBjdXJyRmVhdC5pZDtcblx0fVxuXG5cdC8vIEZpbHRlciBhbGwgZmVhdHVyZXMgKHJlY3RhbmdsZXMpIGluIHRoZSBzY2VuZSBmb3IgdGhvc2UgYmVpbmcgaGlnaGxpZ2h0ZWQuXG5cdC8vIEFsb25nIHRoZSB3YXksIGJ1aWxkIGluZGV4IG1hcHBpbmcgZmVhdHVyZSBpZCB0byBpdHMgJ3N0YWNrJyBvZiBlcXVpdmFsZW50IGZlYXR1cmVzLFxuXHQvLyBpLmUuIGEgbGlzdCBvZiBpdHMgZ2Vub2xvZ3Mgc29ydGVkIGJ5IHkgY29vcmRpbmF0ZS5cblx0Ly9cblx0dGhpcy5zdGFja3MgPSB7fTsgLy8gZmlkIC0+IFsgcmVjdHMgXSBcblx0bGV0IGRoID0gdGhpcy5ibG9ja0hlaWdodC8yIC0gdGhpcy5mZWF0SGVpZ2h0O1xuICAgICAgICBsZXQgZmVhdHMgPSB0aGlzLnN2Z01haW4uc2VsZWN0QWxsKCcuZmVhdHVyZScpXG5cdCAgLy8gZmlsdGVyIHJlY3QuZmVhdHVyZXMgZm9yIHRob3NlIGluIHRoZSBoaWdobGlnaHQgbGlzdFxuXHQgIC5maWx0ZXIoZnVuY3Rpb24oZmYpe1xuXHQgICAgICAvLyBoaWdobGlnaHQgZmYgaWYgZWl0aGVyIGlkIGlzIGluIHRoZSBsaXN0IEFORCBpdCdzIG5vdCBiZWVuIGhpZGRlblxuXHQgICAgICBsZXQgbWdpID0gaGlGZWF0c1tmZi5jYW5vbmljYWxdO1xuXHQgICAgICBsZXQgbWdwID0gaGlGZWF0c1tmZi5JRF07XG5cdCAgICAgIGxldCBzaG93aW5nID0gZDMuc2VsZWN0KHRoaXMpLnN0eWxlKCdkaXNwbGF5JykgIT09ICdub25lJztcblx0ICAgICAgbGV0IGhsID0gc2hvd2luZyAmJiAobWdpIHx8IG1ncCk7XG5cdCAgICAgIGlmIChobCkge1xuXHRcdCAgLy8gZm9yIGVhY2ggaGlnaGxpZ2h0ZWQgZmVhdHVyZSwgYWRkIGl0cyByZWN0YW5nbGUgdG8gdGhlIGxpc3Rcblx0XHQgIGxldCBrID0gZmYuaWQ7XG5cdFx0ICBpZiAoIXNlbGYuc3RhY2tzW2tdKSBzZWxmLnN0YWNrc1trXSA9IFtdXG5cdFx0ICAvLyBpZiBzaG93aW5nIGZlYXR1cmUgZGV0YWlscywgLmZlYXR1cmUgaXMgYSBncm91cCB3aXRoIHRoZSByZWN0IGFzIHRoZSBmaXJzdCBjaGlsZC5cblx0XHQgIC8vIG90aGVyd2lzZSwgLmZlYXR1cmUgaXMgdGhlIHJlY3QgaXRzZWxmLlxuXHRcdCAgc2VsZi5zdGFja3Nba10ucHVzaCh0aGlzLnRhZ05hbWUgPT09ICdnJyA/IHRoaXMuY2hpbGROb2Rlc1swXSA6IHRoaXMpXG5cdCAgICAgIH1cblx0ICAgICAgLy8gXG5cdCAgICAgIGQzLnNlbGVjdCh0aGlzKVxuXHRcdCAgLmNsYXNzZWQoJ2hpZ2hsaWdodCcsIGhsKVxuXHRcdCAgLmNsYXNzZWQoJ2N1cnJlbnQnLCBobCAmJiBjdXJyRmVhdCAmJiB0aGlzLl9fZGF0YV9fLmlkID09PSBjdXJyRmVhdC5pZClcblx0XHQgIC5jbGFzc2VkKCdleHRyYScsIHB1bHNlQ3VycmVudCAmJiBmZiA9PT0gY3VyckZlYXQpXG5cdCAgICAgIHJldHVybiBobDtcblx0ICB9KVxuXHQgIDtcblxuXHR0aGlzLmRyYXdGaWR1Y2lhbHMoY3VyckZlYXQpO1xuXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgcG9seWdvbnMgdGhhdCBjb25uZWN0IGhpZ2hsaWdodGVkIGZlYXR1cmVzIGluIHRoZSB2aWV3XG4gICAgLy9cbiAgICBkcmF3RmlkdWNpYWxzIChjdXJyRmVhdCkge1xuXHQvLyBidWlsZCBkYXRhIGFycmF5IGZvciBkcmF3aW5nIGZpZHVjaWFscyBiZXR3ZWVuIGVxdWl2YWxlbnQgZmVhdHVyZXNcblx0bGV0IGRhdGEgPSBbXTtcblx0Zm9yIChsZXQgayBpbiB0aGlzLnN0YWNrcykge1xuXHQgICAgLy8gZm9yIGVhY2ggaGlnaGxpZ2h0ZWQgZmVhdHVyZSwgc29ydCB0aGUgcmVjdGFuZ2xlcyBpbiBpdHMgbGlzdCBieSBZLWNvb3JkaW5hdGVcblx0ICAgIGxldCByZWN0cyA9IHRoaXMuc3RhY2tzW2tdO1xuXHQgICAgcmVjdHMuc29ydCggKGEsYikgPT4gcGFyc2VGbG9hdChhLmdldEF0dHJpYnV0ZSgneScpKSAtIHBhcnNlRmxvYXQoYi5nZXRBdHRyaWJ1dGUoJ3knKSkgKTtcblx0ICAgIHJlY3RzLnNvcnQoIChhLGIpID0+IHtcblx0XHRyZXR1cm4gYS5fX2RhdGFfXy5nZW5vbWUuem9vbVkgLSBiLl9fZGF0YV9fLmdlbm9tZS56b29tWTtcblx0ICAgIH0pO1xuXHQgICAgLy8gV2FudCBhIHBvbHlnb24gYmV0d2VlbiBlYWNoIHN1Y2Nlc3NpdmUgcGFpciBvZiBpdGVtcy4gVGhlIGZvbGxvd2luZyBjcmVhdGVzIGEgbGlzdCBvZlxuXHQgICAgLy8gbiBwYWlycywgd2hlcmUgcmVjdFtpXSBpcyBwYWlyZWQgd2l0aCByZWN0W2krMV0uIFRoZSBsYXN0IHBhaXIgY29uc2lzdHMgb2YgdGhlIGxhc3Rcblx0ICAgIC8vIHJlY3RhbmdsZSBwYWlyZWQgd2l0aCB1bmRlZmluZWQuIChXZSB3YW50IHRoaXMuKVxuXHQgICAgbGV0IHBhaXJzID0gcmVjdHMubWFwKChyLCBpKSA9PiBbcixyZWN0c1tpKzFdXSk7XG5cdCAgICAvLyBBZGQgYSBjbGFzcyAoJ2N1cnJlbnQnKSBmb3IgdGhlIHBvbHlnb25zIGFzc29jaWF0ZWQgd2l0aCB0aGUgbW91c2VvdmVyIGZlYXR1cmUgc28gdGhleVxuXHQgICAgLy8gY2FuIGJlIGRpc3Rpbmd1aXNoZWQgZnJvbSBvdGhlcnMuXG5cdCAgICBkYXRhLnB1c2goeyBmaWQ6IGssIHJlY3RzOiBwYWlycywgY2xzOiAoY3VyckZlYXQgJiYgY3VyckZlYXQuaWQgPT09IGsgPyAnY3VycmVudCcgOiAnJykgfSk7XG5cdH1cblxuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdC8vXG5cdC8vIHB1dCBmaWR1Y2lhbCBtYXJrcyBpbiB0aGVpciBvd24gZ3JvdXAgXG5cdGxldCBmR3JwID0gdGhpcy5maWR1Y2lhbHMuY2xhc3NlZCgnaGlkZGVuJywgZmFsc2UpO1xuXG5cdC8vIEJpbmQgZmlyc3QgbGV2ZWwgZGF0YSB0byAnZmVhdHVyZU1hcmtzJyBncm91cHNcblx0bGV0IGZmR3JwcyA9IGZHcnAuc2VsZWN0QWxsKCdnLmZlYXR1cmVNYXJrcycpXG5cdCAgICAuZGF0YShkYXRhLCBkID0+IGQuZmlkKTtcblx0ZmZHcnBzLmVudGVyKCkuYXBwZW5kKCdnJylcblx0ICAgIC5hdHRyKCduYW1lJywgZCA9PiBkLmZpZCk7XG5cdGZmR3Jwcy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGZmR3Jwcy5hdHRyKCdjbGFzcycsIGQgPT4ge1xuICAgICAgICAgICAgbGV0IGNsYXNzZXMgPSBbJ2ZlYXR1cmVNYXJrcyddO1xuXHQgICAgZC5jbHMgJiYgY2xhc3Nlcy5wdXNoKGQuY2xzKTtcblx0ICAgIHRoaXMuYXBwLmN1cnJMaXN0SW5kZXhbZC5maWRdICYmIGNsYXNzZXMucHVzaCgnbGlzdEl0ZW0nKVxuXHQgICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuXHR9KTtcblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIERyYXcgdGhlIGNvbm5lY3RvciBwb2x5Z29ucy5cblx0Ly8gQmluZCBzZWNvbmQgbGV2ZWwgZGF0YSAocmVjdGFuZ2xlIHBhaXJzKSB0byBwb2x5Z29ucyBpbiB0aGUgZ3JvdXBcblx0bGV0IHBnb25zID0gZmZHcnBzLnNlbGVjdEFsbCgncG9seWdvbicpXG5cdCAgICAuZGF0YShkPT5kLnJlY3RzLmZpbHRlcihyID0+IHJbMF0gJiYgclsxXSkpO1xuXHRwZ29ucy5lbnRlcigpLmFwcGVuZCgncG9seWdvbicpXG5cdCAgICAuYXR0cignY2xhc3MnLCdmaWR1Y2lhbCcpXG5cdCAgICA7XG5cdC8vXG5cdHBnb25zLmF0dHIoJ3BvaW50cycsIHIgPT4ge1xuXHQgICAgLy8gcG9seWdvbiBjb25uZWN0cyBib3R0b20gY29ybmVycyBvZiAxc3QgcmVjdCB0byB0b3AgY29ybmVycyBvZiAybmQgcmVjdFxuXHQgICAgbGV0IGMxID0gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0oclswXSk7IC8vIHRyYW5zZm9ybSBjb29yZHMgZm9yIDFzdCByZWN0XG5cdCAgICBsZXQgYzIgPSBjb29yZHNBZnRlclRyYW5zZm9ybShyWzFdKTsgIC8vIHRyYW5zZm9ybSBjb29yZHMgZm9yIDJuZCByZWN0XG5cdCAgICByLnRjb29yZHMgPSBbYzEsYzJdO1xuXHQgICAgLy8gZm91ciBwb2x5Z29uIHBvaW50c1xuXHQgICAgbGV0IHMgPSBgJHtjMS54fSwke2MxLnkrYzEuaGVpZ2h0fSAke2MyLnh9LCR7YzIueX0gJHtjMi54K2MyLndpZHRofSwke2MyLnl9ICR7YzEueCtjMS53aWR0aH0sJHtjMS55K2MxLmhlaWdodH1gXG5cdCAgICByZXR1cm4gcztcblx0fSlcblx0Ly9cblx0Ly8gbW91c2luZyBvdmVyIHRoZSBmaWR1Y2lhbCBoaWdobGlnaHRzIChhcyBpZiB0aGUgdXNlciBoYWQgbW91c2VkIG92ZXIgdGhlIGZlYXR1cmUgaXRzZWxmKVxuXHQub24oJ21vdXNlb3ZlcicsIChwKSA9PiB7XG5cdCAgICB0aGlzLmhpZ2hsaWdodChwWzBdKTtcblx0fSlcblx0Lm9uKCdtb3VzZW91dCcsICAocCkgPT4ge1xuXHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0fSk7XG5cdC8vXG5cdHBnb25zLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBEcmF3IGZlYXR1cmUgbGFiZWxzLiBFYWNoIGxhYmVsIGlzIGRyYXduIG9uY2UsIGFib3ZlIHRoZSBmaXJzdCByZWN0YW5nbGUgaW4gaXRzIGxpc3QuXG5cdC8vIFRoZSBleGNlcHRpb24gaXMgdGhlIGN1cnJlbnQgKG1vdXNlb3ZlcikgZmVhdHVyZSwgd2hlcmUgdGhlIGxhYmVsIGlzIGRyYXduIGFib3ZlIHRoYXQgZmVhdHVyZS5cblx0bGV0IGxhYmVscyA9IGZmR3Jwcy5zZWxlY3RBbGwoJ3RleHQuZmVhdExhYmVsJylcblx0ICAgIC5kYXRhKGQgPT4ge1xuXHRcdGxldCByID0gZC5yZWN0c1swXVswXTtcblx0XHRpZiAoY3VyckZlYXQgJiYgKGQuZmlkID09PSBjdXJyRmVhdC5JRCB8fCBkLmZpZCA9PT0gY3VyckZlYXQuY2Fub25pY2FsKSl7XG5cdFx0ICAgIGxldCByMiA9IGQucmVjdHMubWFwKCByciA9PlxuXHRcdCAgICAgICByclswXS5fX2RhdGFfXyA9PT0gY3VyckZlYXQgPyByclswXSA6IHJyWzFdJiZyclsxXS5fX2RhdGFfXyA9PT0gY3VyckZlYXQgPyByclsxXSA6IG51bGxcblx0XHQgICAgICAgKS5maWx0ZXIoeD0+eClbMF07XG5cdFx0ICAgIHIgPSByMiA/IHIyIDogcjtcblx0XHR9XG5cdCAgICAgICAgcmV0dXJuIFt7XG5cdFx0ICAgIGZpZDogZC5maWQsXG5cdFx0ICAgIHJlY3Q6IHIsXG5cdFx0ICAgIHRyZWN0OiBjb29yZHNBZnRlclRyYW5zZm9ybShyKVxuXHRcdH1dO1xuXHQgICAgfSk7XG5cblx0Ly8gRHJhdyB0aGUgdGV4dC5cblx0bGFiZWxzLmVudGVyKCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCdmZWF0TGFiZWwnKTtcblx0bGFiZWxzLmV4aXQoKS5yZW1vdmUoKTtcblx0bGFiZWxzXG5cdCAgLmF0dHIoJ3gnLCBkID0+IGQudHJlY3QueCArIGQudHJlY3Qud2lkdGgvMiApXG5cdCAgLmF0dHIoJ3knLCBkID0+IGQucmVjdC5fX2RhdGFfXy5nZW5vbWUuem9vbVkrMTUpXG5cdCAgLnRleHQoZCA9PiB7XG5cdCAgICAgICBsZXQgZiA9IGQucmVjdC5fX2RhdGFfXztcblx0ICAgICAgIGxldCBzeW0gPSBmLnN5bWJvbCB8fCBmLklEO1xuXHQgICAgICAgcmV0dXJuIHN5bTtcblx0ICB9KTtcblxuXHQvLyBQdXQgYSByZWN0YW5nbGUgYmVoaW5kIGVhY2ggbGFiZWwgYXMgYSBiYWNrZ3JvdW5kXG5cdGxldCBsYmxCb3hEYXRhID0gbGFiZWxzLm1hcChsYmwgPT4gbGJsWzBdLmdldEJCb3goKSlcblx0bGV0IGxibEJveGVzID0gZmZHcnBzLnNlbGVjdEFsbCgncmVjdC5mZWF0TGFiZWxCb3gnKVxuXHQgICAgLmRhdGEoKGQsaSkgPT4gW2xibEJveERhdGFbaV1dKTtcblx0bGJsQm94ZXMuZW50ZXIoKS5pbnNlcnQoJ3JlY3QnLCd0ZXh0JykuYXR0cignY2xhc3MnLCdmZWF0TGFiZWxCb3gnKTtcblx0bGJsQm94ZXMuZXhpdCgpLnJlbW92ZSgpO1xuXHRsYmxCb3hlc1xuXHQgICAgLmF0dHIoJ3gnLCAgICAgIGJiID0+IGJiLngtMilcblx0ICAgIC5hdHRyKCd5JywgICAgICBiYiA9PiBiYi55LTEpXG5cdCAgICAuYXR0cignd2lkdGgnLCAgYmIgPT4gYmIud2lkdGgrNClcblx0ICAgIC5hdHRyKCdoZWlnaHQnLCBiYiA9PiBiYi5oZWlnaHQrMilcblx0ICAgIDtcblx0XG5cdC8vIGlmIHRoZXJlIGlzIGEgY3VyckZlYXQsIG1vdmUgaXRzIGZpZHVjaWFscyB0byB0aGUgZW5kIChzbyB0aGV5J3JlIG9uIHRvcCBvZiBldmVyeW9uZSBlbHNlKVxuXHRpZiAoY3VyckZlYXQpIHtcblx0ICAgIC8vIGdldCBsaXN0IG9mIGdyb3VwIGVsZW1lbnRzIGZyb20gdGhlIGQzIHNlbGVjdGlvblxuXHQgICAgbGV0IGZmTGlzdCA9IGZmR3Jwc1swXTtcblx0ICAgIC8vIGZpbmQgdGhlIG9uZSB3aG9zZSBmZWF0dXJlIGlzIGN1cnJGZWF0XG5cdCAgICBsZXQgaSA9IC0xO1xuXHQgICAgZmZMaXN0LmZvckVhY2goIChnLGopID0+IHsgaWYgKGcuX19kYXRhX18uZmlkID09PSBjdXJyRmVhdC5pZCkgaSA9IGo7IH0pO1xuXHQgICAgLy8gaWYgd2UgZm91bmQgaXQgYW5kIGl0J3Mgbm90IGFscmVhZHkgdGhlIGxhc3QsIG1vdmUgaXQgdG8gdGhlXG5cdCAgICAvLyBsYXN0IHBvc2l0aW9uIGFuZCByZW9yZGVyIGluIHRoZSBET00uXG5cdCAgICBpZiAoaSA+PSAwKSB7XG5cdFx0bGV0IGxhc3RpID0gZmZMaXN0Lmxlbmd0aCAtIDE7XG5cdCAgICAgICAgbGV0IHggPSBmZkxpc3RbaV07XG5cdFx0ZmZMaXN0W2ldID0gZmZMaXN0W2xhc3RpXTtcblx0XHRmZkxpc3RbbGFzdGldID0geDtcblx0XHRmZkdycHMub3JkZXIoKTtcblx0ICAgIH1cblx0fVxuXHRcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaGlkZUZpZHVjaWFscyAoKSB7XG5cdHRoaXMuc3ZnTWFpbi5zZWxlY3QoJ2cuZmlkdWNpYWxzJylcblx0ICAgIC5jbGFzc2VkKCdoaWRkZW4nLCB0cnVlKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBab29tVmlld1xuXG5leHBvcnQgeyBab29tVmlldyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvWm9vbVZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=