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
	// Add open/close button to closables and wire them up.
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
	//
	// Set up draggables.
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
let MouseMine = 'public'; // one of: public, test, dev

let MINES = {
    'dev' : 'http://bhmgimm-dev:8080/mousemine',
    'test': 'http://test.mousemine.org/mousemine',
    'public' : 'http://www.mousemine.org/mousemine',
};

// ---------------------------------------------
// AuxDataManager - knows how to query an external source (i.e., MouseMine) for genes
// annotated to different ontologies. 
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
    // Equivalently: for every feature that overlaps the given range in the given genome, returns promise 
    // for all its exons in that genome.
    exonsByRange	(genome, chr, start, end) {
	let view = [
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
	    this.setGeom({ height: this.totalChrWidth, rotation: -90, translation: [-this.totalChrWidth/2 + 10,30] });
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
	      if (t.tagName == 'rect' && t.classList.contains('feature')) {
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
	let newFeats = feats.enter().append('rect')
	    .attr('class', f => 'feature' + (f.strand==='-' ? ' minus' : ' plus'))
	    .attr('name', f => f.ID)
	    .style('fill', f => self.app.cscale(f.getMungedType()))
	    ;
	// NB: if you are looking for click handlers, they are at the svg level (see initDom above).

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

	feats
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
		  self.stacks[k].push(this)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWRkZGE5N2I0NTg3ZjY4MGI2NmYiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0tleVN0b3JlLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GZWF0dXJlLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0Rm9ybXVsYVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvU1ZHVmlldy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvdmlld2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9NR1ZBcHAuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0dlbm9tZS5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2lkYi1rZXl2YWwvZGlzdC9pZGIta2V5dmFsLm1qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvUXVlcnlNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9BdXhEYXRhTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvTGlzdE1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RGb3JtdWxhRXZhbHVhdG9yLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0RWRpdG9yLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GYWNldE1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZhY2V0LmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9CVE1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0Jsb2NrVHJhbnNsYXRvci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvR2Vub21lVmlldy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZURldGFpbHMuanMiLCJ3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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7OztBQ3JEUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7OztBQ3BFUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsa0JBQWtCLEdBQUcsbUJBQW1CLEdBQUcsb0JBQW9CO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1Q0FBdUMs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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxzQkFBc0Isa0JBQWtCO0FBQ3hDLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFLEVBQUU7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsTUFBTTtBQUNOLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxvQkFBb0I7QUFDckQsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsUUFBUSxVQUFVLEVBQUUsSUFBSTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixhQUFhO0FBQ2IsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFTzs7Ozs7Ozs7Ozs7OztBQ3JMUjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFUTs7Ozs7Ozs7Ozs7O0FDL0RjO0FBQ0Y7QUFDSzs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixFQUFFO0FBQ0Y7QUFDQTs7QUFFUTs7Ozs7Ozs7OztBQzFFaUI7O0FBRXpCO0FBQ0E7QUFDQSx5QkFBeUI7O0FBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLE9BQU8sU0FBUyxNQUFNO0FBQ3ZEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRSxFQUFFO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQW1FLFVBQVU7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpSEFBaUgsVUFBVTtBQUMzSDtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0VBQXNFLFVBQVU7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx5Q0FBeUM7QUFDOUUscUNBQXFDLGtFQUFrRTtBQUN2RyxxQ0FBcUMsMkZBQTJGO0FBQ2hJLHFDQUFxQyw4Q0FBOEM7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxLQUFLO0FBQ3JEO0FBQ0EsV0FBVyxJQUFJLEdBQUcsTUFBTSxJQUFJLElBQUk7QUFDaEM7QUFDQSxrRUFBa0UsT0FBTztBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELEtBQUs7QUFDckQsdUZBQXVGLE1BQU07QUFDN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLEVBQUU7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQsS0FBSztBQUMvRDtBQUNBLDBFQUEwRSxNQUFNO0FBQ2hGLFFBQVEsR0FBRztBQUNYOztBQUVBO0FBQ0E7QUFDQSxnRUFBZ0UsS0FBSztBQUNyRTtBQUNBLHFGQUFxRixNQUFNO0FBQzNGLFFBQVEsR0FBRztBQUNYOztBQUVBO0FBQ0E7QUFDQSwwREFBMEQsS0FBSztBQUMvRDtBQUNBLCtFQUErRSxNQUFNO0FBQ3JGLFFBQVEsR0FBRztBQUNYO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxLQUFLO0FBQzlEO0FBQ0EsOEVBQThFLE1BQU07QUFDcEYsUUFBUSxHQUFHO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFLE1BQU07QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkUsTUFBTTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRSxNQUFNO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FLE1BQU07QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHNCQUFzQjtBQUNuRDtBQUNBLDRCQUE0Qix5QkFBeUI7QUFDckQ7QUFDQTtBQUNBOztBQUVROzs7Ozs7Ozs7Ozs7QUN6Tlk7QUFDVztBQUNaOztBQUVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsNERBQTREO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLEVBQUU7QUFDbEIsaUJBQWlCLEtBQUssR0FBRyxFQUFFO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsaUJBQWlCLEdBQUcsZ0JBQWdCLEdBQUcsYUFBYTtBQUNwRSxpQkFBaUIsY0FBYyxHQUFHLGdCQUFnQixHQUFHLGdCQUFnQjtBQUNyRTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELGFBQWE7QUFDbEU7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRU87Ozs7Ozs7Ozs7QUM3U29COztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUTs7Ozs7Ozs7Ozs7O0FDbkVxRDtBQUN6QztBQUNROztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7Ozs7O0FDak9ROztBQUVoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7O0FDN0JSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTzs7Ozs7Ozs7Ozs7O0FDcEJRO0FBQ1U7QUFDUDs7QUFFbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxNQUFNLE1BQU0sTUFBTTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sSUFBSTtBQUNYO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7O0FDOUdSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0Esd0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsVztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsMkNBQTJDLEVBQUU7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTyIsImZpbGUiOiJtZ3YuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNWRkZGE5N2I0NTg3ZjY4MGI2NmYiLCJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gICAgICAgICAgICAgICAgICAgIFVUSUxTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAoUmUtKUluaXRpYWxpemVzIGFuIG9wdGlvbiBsaXN0LlxuLy8gQXJnczpcbi8vICAgc2VsZWN0b3IgKHN0cmluZyBvciBOb2RlKSBDU1Mgc2VsZWN0b3Igb2YgdGhlIGNvbnRhaW5lciA8c2VsZWN0PiBlbGVtZW50LiBPciB0aGUgZWxlbWVudCBpdHNlbGYuXG4vLyAgIG9wdHMgKGxpc3QpIExpc3Qgb2Ygb3B0aW9uIGRhdGEgb2JqZWN0cy4gTWF5IGJlIHNpbXBsZSBzdHJpbmdzLiBNYXkgYmUgbW9yZSBjb21wbGV4LlxuLy8gICB2YWx1ZSAoZnVuY3Rpb24gb3IgbnVsbCkgRnVuY3Rpb24gdG8gcHJvZHVjZSB0aGUgPG9wdGlvbj4gdmFsdWUgZnJvbSBhbiBvcHRzIGl0ZW1cbi8vICAgICAgIERlZmF1bHRzIHRvIHRoZSBpZGVudGl0eSBmdW5jdGlvbiAoeD0+eCkuXG4vLyAgIGxhYmVsIChmdW5jdGlvbiBvciBudWxsKSBGdW5jdGlvbiB0byBwcm9kdWNlIHRoZSA8b3B0aW9uPiBsYWJlbCBmcm9tIGFuIG9wdHMgaXRlbVxuLy8gICAgICAgRGVmYXVsdHMgdG8gdGhlIHZhbHVlIGZ1bmN0aW9uLlxuLy8gICBtdWx0aSAoYm9vbGVhbikgU3BlY2lmaWVzIGlmIHRoZSBsaXN0IHN1cHBvcnQgbXVsdGlwbGUgc2VsZWN0aW9ucy4gKGRlZmF1bHQgPSBmYWxzZSlcbi8vICAgc2VsZWN0ZWQgKGZ1bmN0aW9uIG9yIG51bGwpIEZ1bmN0aW9uIHRvIGRldGVybWluZSBpZiBhIGdpdmVuIG9wdGlvbiBpcyBzZWxlY3RkLlxuLy8gICAgICAgRGVmYXVsdHMgdG8gZD0+RmFsc2UuIE5vdGUgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIG9ubHkgYXBwbGllZCB0byBuZXcgb3B0aW9ucy5cbi8vICAgc29ydEJ5IChmdW5jdGlvbikgT3B0aW9uYWwuIElmIHByb3ZpZGVkLCBhIGNvbXBhcmlzb24gZnVuY3Rpb24gdG8gdXNlIGZvciBzb3J0aW5nIHRoZSBvcHRpb25zLlxuLy8gICBcdCBUaGUgY29tcGFyaXNvbiBmdW5jdGlvbiBpcyBwYXNzZXMgdGhlIGRhdGEgb2JqZWN0cyBjb3JyZXNwb25kaW5nIHRvIHR3byBvcHRpb25zIGFuZCBzaG91bGRcbi8vICAgXHQgcmV0dXJuIC0xLCAwIG9yICsxLiBJZiBub3QgcHJvdmlkZWQsIHRoZSBvcHRpb24gbGlzdCB3aWxsIGhhdmUgdGhlIHNhbWUgc29ydCBvcmRlciBhcyB0aGUgb3B0cyBhcmd1bWVudC5cbi8vIFJldHVybnM6XG4vLyAgIFRoZSBvcHRpb24gbGlzdCBpbiBhIEQzIHNlbGVjdGlvbi5cbmZ1bmN0aW9uIGluaXRPcHRMaXN0KHNlbGVjdG9yLCBvcHRzLCB2YWx1ZSwgbGFiZWwsIG11bHRpLCBzZWxlY3RlZCwgc29ydEJ5KSB7XG5cbiAgICAvLyBzZXQgdXAgdGhlIGZ1bmN0aW9uc1xuICAgIGxldCBpZGVudCA9IGQgPT4gZDtcbiAgICB2YWx1ZSA9IHZhbHVlIHx8IGlkZW50O1xuICAgIGxhYmVsID0gbGFiZWwgfHwgdmFsdWU7XG4gICAgc2VsZWN0ZWQgPSBzZWxlY3RlZCB8fCAoeCA9PiBmYWxzZSk7XG5cbiAgICAvLyB0aGUgPHNlbGVjdD4gZWx0XG4gICAgbGV0IHMgPSBkMy5zZWxlY3Qoc2VsZWN0b3IpO1xuXG4gICAgLy8gbXVsdGlzZWxlY3RcbiAgICBzLnByb3BlcnR5KCdtdWx0aXBsZScsIG11bHRpIHx8IG51bGwpIDtcblxuICAgIC8vIGJpbmQgdGhlIG9wdHMuXG4gICAgbGV0IG9zID0gcy5zZWxlY3RBbGwoXCJvcHRpb25cIilcbiAgICAgICAgLmRhdGEob3B0cywgbGFiZWwpO1xuICAgIG9zLmVudGVyKClcbiAgICAgICAgLmFwcGVuZChcIm9wdGlvblwiKSBcbiAgICAgICAgLmF0dHIoXCJ2YWx1ZVwiLCB2YWx1ZSlcbiAgICAgICAgLnByb3BlcnR5KFwic2VsZWN0ZWRcIiwgbyA9PiBzZWxlY3RlZChvKSB8fCBudWxsKVxuICAgICAgICAudGV4dChsYWJlbCkgXG4gICAgICAgIDtcbiAgICAvL1xuICAgIG9zLmV4aXQoKS5yZW1vdmUoKSA7XG5cbiAgICAvLyBzb3J0IHRoZSByZXN1bHRzXG4gICAgaWYgKCFzb3J0QnkpIHNvcnRCeSA9IChhLGIpID0+IHtcbiAgICBcdGxldCBhaSA9IG9wdHMuaW5kZXhPZihhKTtcblx0bGV0IGJpID0gb3B0cy5pbmRleE9mKGIpO1xuXHRyZXR1cm4gYWkgLSBiaTtcbiAgICB9XG4gICAgb3Muc29ydChzb3J0QnkpO1xuXG4gICAgLy9cbiAgICByZXR1cm4gcztcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcm9taXNpZmllcyBhIGNhbGwgdG8gZDMudHN2LlxuLy8gQXJnczpcbi8vICAgdXJsIChzdHJpbmcpIFRoZSB1cmwgb2YgdGhlIHRzdiByZXNvdXJjZVxuLy8gUmV0dXJuczpcbi8vICAgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGxpc3Qgb2Ygcm93IG9iamVjdHNcbmZ1bmN0aW9uIGQzdHN2KHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZDMudHN2KHVybCwgZnVuY3Rpb24oZXJyb3IsIHZhbCl7XG4gICAgICAgICAgICBlcnJvciA/IHJlamVjdCh7IHN0YXR1czogZXJyb3Iuc3RhdHVzLCBzdGF0dXNUZXh0OiBlcnJvci5zdGF0dXNUZXh0fSkgOiByZXNvbHZlKHZhbCk7XG4gICAgICAgIH0pICBcbiAgICB9KTsgXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJvbWlzaWZpZXMgYSBjYWxsIHRvIGQzLmpzb24uXG4vLyBBcmdzOlxuLy8gICB1cmwgKHN0cmluZykgVGhlIHVybCBvZiB0aGUganNvbiByZXNvdXJjZVxuLy8gUmV0dXJuczpcbi8vICAgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGpzb24gb2JqZWN0IHZhbHVlLCBvciByZWplY3RzIHdpdGggYW4gZXJyb3JcbmZ1bmN0aW9uIGQzanNvbih1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGQzLmpzb24odXJsLCBmdW5jdGlvbihlcnJvciwgdmFsKXtcbiAgICAgICAgICAgIGVycm9yID8gcmVqZWN0KHsgc3RhdHVzOiBlcnJvci5zdGF0dXMsIHN0YXR1c1RleHQ6IGVycm9yLnN0YXR1c1RleHR9KSA6IHJlc29sdmUodmFsKTtcbiAgICAgICAgfSkgIFxuICAgIH0pOyBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcm9taXNpZmllcyBhIGNhbGwgdG8gZDMudGV4dC5cbi8vIEFyZ3M6XG4vLyAgIHVybCAoc3RyaW5nKSBUaGUgdXJsIG9mIHRoZSB0ZXh0IHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUganNvbiBvYmplY3QgdmFsdWUsIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvclxuZnVuY3Rpb24gZDN0ZXh0KHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZDMudGV4dCh1cmwsICd0ZXh0L3BsYWluJywgZnVuY3Rpb24oZXJyb3IsIHZhbCl7XG4gICAgICAgICAgICBlcnJvciA/IHJlamVjdCh7IHN0YXR1czogZXJyb3Iuc3RhdHVzLCBzdGF0dXNUZXh0OiBlcnJvci5zdGF0dXNUZXh0fSkgOiByZXNvbHZlKHZhbCk7XG4gICAgICAgIH0pICBcbiAgICB9KTsgXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyBhIGRlZXAgY29weSBvZiBvYmplY3Qgby4gXG4vLyBBcmdzOlxuLy8gICBvICAob2JqZWN0KSBNdXN0IGJlIGEgSlNPTiBvYmplY3QgKG5vIGN1cmN1bGFyIHJlZnMsIG5vIGZ1bmN0aW9ucykuXG4vLyBSZXR1cm5zOlxuLy8gICBhIGRlZXAgY29weSBvZiBvXG5mdW5jdGlvbiBkZWVwYyhvKSB7XG4gICAgaWYgKCFvKSByZXR1cm4gbztcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobykpO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBhcnNlcyBhIHN0cmluZyBvZiB0aGUgZm9ybSBcImNocjpzdGFydC4uZW5kXCIuXG4vLyBSZXR1cm5zOlxuLy8gICBvYmplY3QgY29udGluaW5nIHRoZSBwYXJzZWQgZmllbGRzLlxuLy8gRXhhbXBsZTpcbi8vICAgcGFyc2VDb29yZHMoXCIxMDoxMDAwMDAwMC4uMjAwMDAwMDBcIikgLT4ge2NocjpcIjEwXCIsIHN0YXJ0OjEwMDAwMDAwLCBlbmQ6MjAwMDAwMDB9XG5mdW5jdGlvbiBwYXJzZUNvb3JkcyAoY29vcmRzKSB7XG4gICAgbGV0IHJlID0gLyhbXjpdKyk6KFxcZCspXFwuXFwuKFxcZCspLztcbiAgICBsZXQgbSA9IGNvb3Jkcy5tYXRjaChyZSk7XG4gICAgcmV0dXJuIG0gPyB7Y2hyOm1bMV0sIHN0YXJ0OnBhcnNlSW50KG1bMl0pLCBlbmQ6cGFyc2VJbnQobVszXSl9IDogbnVsbDtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBGb3JtYXRzIGEgY2hyb21vc29tZSBuYW1lLCBzdGFydCBhbmQgZW5kIHBvc2l0aW9uIGFzIGEgc3RyaW5nLlxuLy8gQXJncyAoZm9ybSAxKTpcbi8vICAgY29vcmRzIChvYmplY3QpIE9mIHRoZSBmb3JtIHtjaHI6c3RyaW5nLCBzdGFydDppbnQsIGVuZDppbnR9XG4vLyBBcmdzIChmb3JtIDIpOlxuLy8gICBjaHIgc3RyaW5nXG4vLyAgIHN0YXJ0IGludFxuLy8gICBlbmQgaW50XG4vLyBSZXR1cm5zOlxuLy8gICAgIHN0cmluZ1xuLy8gRXhhbXBsZTpcbi8vICAgICBmb3JtYXRDb29yZHMoXCIxMFwiLCAxMDAwMDAwMCwgMjAwMDAwMDApIC0+IFwiMTA6MTAwMDAwMDAuLjIwMDAwMDAwXCJcbmZ1bmN0aW9uIGZvcm1hdENvb3JkcyAoY2hyLCBzdGFydCwgZW5kKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0bGV0IGMgPSBjaHI7XG5cdGNociA9IGMuY2hyO1xuXHRzdGFydCA9IGMuc3RhcnQ7XG5cdGVuZCA9IGMuZW5kO1xuICAgIH1cbiAgICByZXR1cm4gYCR7Y2hyfToke3N0YXJ0fS4uJHtlbmR9YFxufVxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRydWUgaWZmIHRoZSB0d28gcmFuZ2VzIG92ZXJsYXAgYnkgYXQgbGVhc3QgMS5cbi8vIEVhY2ggcmFuZ2UgbXVzdCBoYXZlIGEgY2hyLCBzdGFydCwgYW5kIGVuZC5cbi8vXG5mdW5jdGlvbiBvdmVybGFwcyAoYSwgYikge1xuICAgIHJldHVybiBhLmNociA9PT0gYi5jaHIgJiYgYS5zdGFydCA8PSBiLmVuZCAmJiBhLmVuZCA+PSBiLnN0YXJ0O1xufVxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBHaXZlbiB0d28gcmFuZ2VzLCBhIGFuZCBiLCByZXR1cm5zIGEgLSBiLlxuLy8gVGhlIHJlc3VsdCBpcyBhIGxpc3Qgb2YgMCwgMSBvciAyIG5ldyByYW5nZXMsIGRlcGVuZGluZyBvbiBhIGFuZCBiLlxuZnVuY3Rpb24gc3VidHJhY3QoYSwgYikge1xuICAgIGlmIChhLmNociAhPT0gYi5jaHIpIHJldHVybiBbIGEgXTtcbiAgICBsZXQgYWJMZWZ0ID0geyBjaHI6YS5jaHIsIHN0YXJ0OmEuc3RhcnQsICAgICAgICAgICAgICAgICAgICBlbmQ6TWF0aC5taW4oYS5lbmQsIGIuc3RhcnQtMSkgfTtcbiAgICBsZXQgYWJSaWdodD0geyBjaHI6YS5jaHIsIHN0YXJ0Ok1hdGgubWF4KGEuc3RhcnQsIGIuZW5kKzEpLCBlbmQ6YS5lbmQgfTtcbiAgICBsZXQgYW5zID0gWyBhYkxlZnQsIGFiUmlnaHQgXS5maWx0ZXIoIHIgPT4gci5zdGFydCA8PSByLmVuZCApO1xuICAgIHJldHVybiBhbnM7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ3JlYXRlcyBhIGxpc3Qgb2Yga2V5LHZhbHVlIHBhaXJzIGZyb20gdGhlIG9iai5cbmZ1bmN0aW9uIG9iajJsaXN0IChvKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG8pLm1hcChrID0+IFtrLCBvW2tdXSkgICAgXG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0cnVlIGlmZiB0aGUgdHdvIGxpc3RzIGhhdmUgdGhlIHNhbWUgY29udGVudHMgKGJhc2VkIG9uIGluZGV4T2YpLlxuLy8gQnJ1dGUgZm9yY2UgYXBwcm9hY2guIEJlIGNhcmVmdWwgd2hlcmUgeW91IHVzZSB0aGlzLlxuZnVuY3Rpb24gc2FtZSAoYWxzdCxibHN0KSB7XG4gICByZXR1cm4gYWxzdC5sZW5ndGggPT09IGJsc3QubGVuZ3RoICYmIFxuICAgICAgIGFsc3QucmVkdWNlKChhY2MseCkgPT4gKGFjYyAmJiBibHN0LmluZGV4T2YoeCk+PTApLCB0cnVlKTtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFkZCBiYXNpYyBzZXQgb3BzIHRvIFNldCBwcm90b3R5cGUuXG4vLyBMaWZ0ZWQgZnJvbTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU2V0XG5TZXQucHJvdG90eXBlLnVuaW9uID0gZnVuY3Rpb24oc2V0Qikge1xuICAgIHZhciB1bmlvbiA9IG5ldyBTZXQodGhpcyk7XG4gICAgZm9yICh2YXIgZWxlbSBvZiBzZXRCKSB7XG4gICAgICAgIHVuaW9uLmFkZChlbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuaW9uO1xufVxuXG5TZXQucHJvdG90eXBlLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKHNldEIpIHtcbiAgICB2YXIgaW50ZXJzZWN0aW9uID0gbmV3IFNldCgpO1xuICAgIGZvciAodmFyIGVsZW0gb2Ygc2V0Qikge1xuICAgICAgICBpZiAodGhpcy5oYXMoZWxlbSkpIHtcbiAgICAgICAgICAgIGludGVyc2VjdGlvbi5hZGQoZWxlbSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGludGVyc2VjdGlvbjtcbn1cblxuU2V0LnByb3RvdHlwZS5kaWZmZXJlbmNlID0gZnVuY3Rpb24oc2V0Qikge1xuICAgIHZhciBkaWZmZXJlbmNlID0gbmV3IFNldCh0aGlzKTtcbiAgICBmb3IgKHZhciBlbGVtIG9mIHNldEIpIHtcbiAgICAgICAgZGlmZmVyZW5jZS5kZWxldGUoZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiBkaWZmZXJlbmNlO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBnZXRDYXJldFJhbmdlIChlbHQpIHtcbiAgICAvLyBGSVhNRTogZG9lcyBub3Qgd29yayBmb3IgSUVcbiAgICByZXR1cm4gW2VsdC5zZWxlY3Rpb25TdGFydCwgZWx0LnNlbGVjdGlvbkVuZF07XG59XG5mdW5jdGlvbiBzZXRDYXJldFJhbmdlIChlbHQsIHJhbmdlKSB7XG4gICAgLy8gRklYTUU6IGRvZXMgbm90IHdvcmsgZm9yIElFXG4gICAgZWx0LnNlbGVjdGlvblN0YXJ0ID0gcmFuZ2VbMF07XG4gICAgZWx0LnNlbGVjdGlvbkVuZCAgID0gcmFuZ2VbMV07XG59XG5mdW5jdGlvbiBzZXRDYXJldFBvc2l0aW9uIChlbHQsIHBvcykge1xuICAgIHNldENhcmV0UmFuZ2UoZWx0LCBbcG9zLHBvc10pO1xufVxuZnVuY3Rpb24gbW92ZUNhcmV0UG9zaXRpb24gKGVsdCwgZGVsdGEpIHtcbiAgICBzZXRDYXJldFBvc2l0aW9uKGVsdCwgZ2V0Q2FyZXRQb3NpdGlvbihlbHQpICsgZGVsdGEpO1xufVxuZnVuY3Rpb24gZ2V0Q2FyZXRQb3NpdGlvbiAoZWx0KSB7XG4gICAgbGV0IHIgPSBnZXRDYXJldFJhbmdlKGVsdCk7XG4gICAgcmV0dXJuIHJbMV07XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0aGUgc2NyZWVuIGNvb3JkaW5hdGVzIG9mIGFuIFNWRyBzaGFwZSAoY2lyY2xlLCByZWN0LCBwb2x5Z29uLCBsaW5lKVxuLy8gYWZ0ZXIgYWxsIHRyYW5zZm9ybXMgaGF2ZSBiZWVuIGFwcGxpZWQuXG4vL1xuLy8gQXJnczpcbi8vICAgICBzaGFwZSAobm9kZSkgVGhlIFNWRyBzaGFwZS5cbi8vXG4vLyBSZXR1cm5zOlxuLy8gICAgIFRoZSBmb3JtIG9mIHRoZSByZXR1cm5lZCB2YWx1ZSBkZXBlbmRzIG9uIHRoZSBzaGFwZS5cbi8vICAgICBjaXJjbGU6ICB7IGN4LCBjeSwgciB9XG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGNlbnRlciBwb2ludCBhbmQgdHJhbnNmb3JtZWQgcmFkaXVzICAgICAgICAgXG4vLyAgICAgbGluZTpcdHsgeDEsIHkxLCB4MiwgeTIgfVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBlbmRwb2ludHNcbi8vICAgICByZWN0Olx0eyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgY29ybmVyIHBvaW50IGFuZCB0cmFuc2Zvcm1lZCB3aWR0aCtoZWlnaHQuXG4vLyAgICAgcG9seWdvbjogWyB7eCx5fSwge3gseX0gLCAuLi4gXVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBsaXN0IG9mIHBvaW50c1xuLy9cbi8vIEFkYXB0ZWQgZnJvbTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjg1ODQ3OS9yZWN0YW5nbGUtY29vcmRpbmF0ZXMtYWZ0ZXItdHJhbnNmb3JtP3JxPTFcbi8vXG5mdW5jdGlvbiBjb29yZHNBZnRlclRyYW5zZm9ybSAoc2hhcGUpIHtcbiAgICAvL1xuICAgIGxldCBkc2hhcGUgPSBkMy5zZWxlY3Qoc2hhcGUpO1xuICAgIGxldCBzdmcgPSBzaGFwZS5jbG9zZXN0KFwic3ZnXCIpO1xuICAgIGlmICghc3ZnKSB0aHJvdyBcIkNvdWxkIG5vdCBmaW5kIHN2ZyBhbmNlc3Rvci5cIjtcbiAgICBsZXQgc3R5cGUgPSBzaGFwZS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgbGV0IG1hdHJpeCA9IHNoYXBlLmdldENUTSgpO1xuICAgIGxldCBwID0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgbGV0IHAyPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICAvL1xuICAgIHN3aXRjaCAoc3R5cGUpIHtcbiAgICAvL1xuICAgIGNhc2UgJ2NpcmNsZSc6XG5cdHAueCAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiY3hcIikpO1xuXHRwLnkgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcImN5XCIpKTtcblx0cDIueCA9IHAueCArIHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJyXCIpKTtcblx0cDIueSA9IHAueTtcblx0cCAgICA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdHAyICAgPSBwMi5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0Ly8gY2FsYyBuZXcgcmFkaXVzIGFzIGRpc3RhbmNlIGJldHdlZW4gdHJhbnNmb3JtZWQgcG9pbnRzXG5cdGxldCBkeCA9IE1hdGguYWJzKHAueCAtIHAyLngpO1xuXHRsZXQgZHkgPSBNYXRoLmFicyhwLnkgLSBwMi55KTtcblx0bGV0IHIgPSBNYXRoLnNxcnQoZHgqZHggKyBkeSpkeSk7XG4gICAgICAgIHJldHVybiB7IGN4OiBwLngsIGN5OiBwLnksIHI6ciB9O1xuICAgIC8vXG4gICAgY2FzZSAncmVjdCc6XG5cdC8vIEZJWE1FOiBkb2VzIG5vdCBoYW5kbGUgcm90YXRpb25zIGNvcnJlY3RseS4gVG8gZml4LCB0cmFuc2xhdGUgY29ybmVyIHBvaW50cyBzZXBhcmF0ZWx5IGFuZCB0aGVuXG5cdC8vIGNhbGN1bGF0ZSB0aGUgdHJhbnNmb3JtZWQgd2lkdGggYW5kIGhlaWdodC4gQXMgYSBjb252ZW5pZW5jZSB0byB0aGUgdXNlciwgbWlnaHQgYmUgbmljZSB0byByZXR1cm5cblx0Ly8gdGhlIHRyYW5zZm9ybWVkIGNvcm5lciBwb2ludHMgYW5kIHBvc3NpYmx5IHRoZSBmaW5hbCBhbmdsZSBvZiByb3RhdGlvbi5cblx0cC54ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ4XCIpKTtcblx0cC55ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ5XCIpKTtcblx0cDIueCA9IHAueCArIHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ3aWR0aFwiKSk7XG5cdHAyLnkgPSBwLnkgKyBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiaGVpZ2h0XCIpKTtcblx0Ly9cblx0cCAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRwMiA9IHAyLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHQvL1xuICAgICAgICByZXR1cm4geyB4OiBwLngsIHk6IHAueSwgd2lkdGg6IHAyLngtcC54LCBoZWlnaHQ6IHAyLnktcC55IH07XG4gICAgLy9cbiAgICBjYXNlICdwb2x5Z29uJzpcbiAgICAgICAgbGV0IHB0cyA9IGRzaGFwZS5hdHRyKFwicG9pbnRzXCIpLnRyaW0oKS5zcGxpdCgvICsvKTtcblx0cmV0dXJuIHB0cy5tYXAoIHB0ID0+IHtcblx0ICAgIGxldCB4eSA9IHB0LnNwbGl0KFwiLFwiKTtcblx0ICAgIHAueCA9IHBhcnNlRmxvYXQoeHlbMF0pXG5cdCAgICBwLnkgPSBwYXJzZUZsb2F0KHh5WzFdKVxuXHQgICAgcCA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdCAgICByZXR1cm4geyB4OiBwLngsIHk6IHAueSB9O1xuXHR9KTtcbiAgICAvL1xuICAgIGNhc2UgJ2xpbmUnOlxuXHRwLnggICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ4MVwiKSk7XG5cdHAueSAgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInkxXCIpKTtcblx0cDIueCAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieDJcIikpO1xuXHRwMi55ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ5MlwiKSk7XG5cdHAgICAgID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0cDIgICAgPSBwMi5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcbiAgICAgICAgcmV0dXJuIHsgeDE6IHAueCwgeTE6IHAueSwgeDI6IHAyLngsIHgyOiBwMi55IH07XG4gICAgLy9cbiAgICAvLyBGSVhNRTogYWRkIGNhc2UgJ3RleHQnXG4gICAgLy9cblxuICAgIGRlZmF1bHQ6XG5cdHRocm93IFwiVW5zdXBwb3J0ZWQgbm9kZSB0eXBlOiBcIiArIHN0eXBlO1xuICAgIH1cblxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJlbW92ZXMgZHVwbGljYXRlcyBmcm9tIGEgbGlzdCB3aGlsZSBwcmVzZXJ2aW5nIGxpc3Qgb3JkZXIuXG4vLyBBcmdzOlxuLy8gICAgIGxzdCAobGlzdClcbi8vIFJldHVybnM6XG4vLyAgICAgQSBwcm9jZXNzZWQgY29weSBvZiBsc3QgaW4gd2hpY2ggYW55IGR1cHMgaGF2ZSBiZWVuIHJlbW92ZWQuXG5mdW5jdGlvbiByZW1vdmVEdXBzIChsc3QpIHtcbiAgICBsZXQgbHN0MiA9IFtdO1xuICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuICAgIGxzdC5mb3JFYWNoKHggPT4ge1xuXHQvLyByZW1vdmUgZHVwcyB3aGlsZSBwcmVzZXJ2aW5nIG9yZGVyXG5cdGlmIChzZWVuLmhhcyh4KSkgcmV0dXJuO1xuXHRsc3QyLnB1c2goeCk7XG5cdHNlZW4uYWRkKHgpO1xuICAgIH0pO1xuICAgIHJldHVybiBsc3QyO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENsaXBzIGEgdmFsdWUgdG8gYSByYW5nZS5cbmZ1bmN0aW9uIGNsaXAgKG4sIG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCBuKSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyB0aGUgZ2l2ZW4gYmFzZXBhaXIgYW1vdW50IFwicHJldHR5IHByaW50ZWRcIiB0byBhbiBhcHBvcnByaWF0ZSBzY2FsZSwgcHJlY2lzaW9uLCBhbmQgdW5pdHMuXG4vLyBFZywgIFxuLy8gICAgMTI3ID0+ICcxMjcgYnAnXG4vLyAgICAxMjM0NTY3ODkgPT4gJzEyMy41IE1iJ1xuZnVuY3Rpb24gcHJldHR5UHJpbnRCYXNlcyAobikge1xuICAgIGxldCBhYnNuID0gTWF0aC5hYnMobik7XG4gICAgaWYgKGFic24gPCAxMDAwKSB7XG4gICAgICAgIHJldHVybiBgJHtufSBicGA7XG4gICAgfVxuICAgIGlmIChhYnNuID49IDEwMDAgJiYgYWJzbiA8IDEwMDAwMDApIHtcbiAgICAgICAgcmV0dXJuIGAkeyhuLzEwMDApLnRvRml4ZWQoMil9IGtiYDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBgJHsobi8xMDAwMDAwKS50b0ZpeGVkKDIpfSBNYmA7XG4gICAgfVxuICAgIHJldHVybiBcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQge1xuICAgIGluaXRPcHRMaXN0LFxuICAgIGQzdHN2LFxuICAgIGQzanNvbixcbiAgICBkM3RleHQsXG4gICAgZGVlcGMsXG4gICAgcGFyc2VDb29yZHMsXG4gICAgZm9ybWF0Q29vcmRzLFxuICAgIG92ZXJsYXBzLFxuICAgIHN1YnRyYWN0LFxuICAgIG9iajJsaXN0LFxuICAgIHNhbWUsXG4gICAgZ2V0Q2FyZXRSYW5nZSxcbiAgICBzZXRDYXJldFJhbmdlLFxuICAgIHNldENhcmV0UG9zaXRpb24sXG4gICAgbW92ZUNhcmV0UG9zaXRpb24sXG4gICAgZ2V0Q2FyZXRQb3NpdGlvbixcbiAgICBjb29yZHNBZnRlclRyYW5zZm9ybSxcbiAgICByZW1vdmVEdXBzLFxuICAgIGNsaXAsXG4gICAgcHJldHR5UHJpbnRCYXNlc1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgQ29tcG9uZW50IHtcbiAgICAvLyBhcHAgLSB0aGUgb3duaW5nIGFwcCBvYmplY3RcbiAgICAvLyBlbHQgLSBjb250YWluZXIuIG1heSBiZSBhIHN0cmluZyAoc2VsZWN0b3IpLCBhIERPTSBub2RlLCBvciBhIGQzIHNlbGVjdGlvbiBvZiAxIG5vZGUuXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0KSB7XG5cdHRoaXMuYXBwID0gYXBwXG5cdGlmICh0eXBlb2YoZWx0KSA9PT0gXCJzdHJpbmdcIilcblx0ICAgIC8vIGVsdCBpcyBhIENTUyBzZWxlY3RvclxuXHQgICAgdGhpcy5yb290ID0gZDMuc2VsZWN0KGVsdCk7XG5cdGVsc2UgaWYgKHR5cGVvZihlbHQuc2VsZWN0QWxsKSA9PT0gXCJmdW5jdGlvblwiKVxuXHQgICAgLy8gZWx0IGlzIGEgZDMgc2VsZWN0aW9uXG5cdCAgICB0aGlzLnJvb3QgPSBlbHQ7XG5cdGVsc2UgaWYgKHR5cGVvZihlbHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUpID09PSBcImZ1bmN0aW9uXCIpXG5cdCAgICAvLyBlbHQgaXMgYSBET00gbm9kZVxuXHQgICAgdGhpcy5yb290ID0gZDMuc2VsZWN0KGVsdCk7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuICAgICAgICAvLyBvdmVycmlkZSBtZVxuICAgIH1cbn1cblxuZXhwb3J0IHsgQ29tcG9uZW50IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9Db21wb25lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgU3RvcmUsIHNldCwgZ2V0LCBkZWwsIGNsZWFyLCBrZXlzIH0gZnJvbSAnaWRiLWtleXZhbCc7XG5cbmNvbnN0IERCX05BTUVfUFJFRklYID0gJ21ndi1kYXRhY2FjaGUtJztcblxuY2xhc3MgS2V5U3RvcmUge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lKSB7XG5cdHRyeSB7XG5cdCAgICB0aGlzLnN0b3JlID0gbmV3IFN0b3JlKERCX05BTUVfUFJFRklYK25hbWUsIG5hbWUpO1xuXHQgICAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xuXHQgICAgY29uc29sZS5sb2coYEtleVN0b3JlOiAke0RCX05BTUVfUFJFRklYK25hbWV9YCk7XG5cdH1cblx0Y2F0Y2ggKGVycikge1xuXHQgICAgdGhpcy5zdG9yZSA9IG51bGw7XG5cdCAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcblx0ICAgIHRoaXMubnVsbFAgPSBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cdCAgICBjb25zb2xlLmxvZyhgS2V5U3RvcmU6IGVycm9yIGluIGNvbnN0cnVjdG9yOiAke2Vycn0gXFxuIERpc2FibGVkLmApXG5cdH1cbiAgICB9XG4gICAgZ2V0IChrZXkpIHtcblx0aWYgKHRoaXMuZGlzYWJsZWQpIFxuXHQgICAgcmV0dXJuIHRoaXMubnVsbFA7XG4gICAgICAgIHJldHVybiBnZXQoa2V5LCB0aGlzLnN0b3JlKTtcbiAgICB9XG4gICAgZGVsIChrZXkpIHtcblx0aWYgKHRoaXMuZGlzYWJsZWQpIFxuXHQgICAgcmV0dXJuIHRoaXMubnVsbFA7XG4gICAgICAgIHJldHVybiBkZWwoa2V5LCB0aGlzLnN0b3JlKTtcbiAgICB9XG4gICAgc2V0IChrZXksIHZhbHVlKSB7XG5cdGlmICh0aGlzLmRpc2FibGVkKSBcblx0ICAgIHJldHVybiB0aGlzLm51bGxQO1xuICAgICAgICByZXR1cm4gc2V0KGtleSwgdmFsdWUsIHRoaXMuc3RvcmUpO1xuICAgIH1cbiAgICBwdXQgKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0KGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICBrZXlzICgpIHtcblx0aWYgKHRoaXMuZGlzYWJsZWQpIFxuXHQgICAgcmV0dXJuIHRoaXMubnVsbFA7XG4gICAgICAgIHJldHVybiBrZXlzKHRoaXMuc3RvcmUpO1xuICAgIH1cbiAgICBjb250YWlucyAoa2V5KSB7XG5cdGlmICh0aGlzLmRpc2FibGVkKSBcblx0ICAgIHJldHVybiB0aGlzLm51bGxQO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoa2V5KS50aGVuKHggPT4geCAhPT0gdW5kZWZpbmVkKTtcbiAgICB9XG4gICAgY2xlYXIgKCkge1xuXHRpZiAodGhpcy5kaXNhYmxlZCkgXG5cdCAgICByZXR1cm4gdGhpcy5udWxsUDtcbiAgICAgICAgcmV0dXJuIGNsZWFyKHRoaXMuc3RvcmUpO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IEtleVN0b3JlIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9LZXlTdG9yZS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBGZWF0dXJlIHtcbiAgICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG4gICAgICAgIHRoaXMuY2hyICAgICA9IGNmZy5jaHIgfHwgY2ZnLmNocm9tb3NvbWU7XG4gICAgICAgIHRoaXMuc3RhcnQgICA9IHBhcnNlSW50KGNmZy5zdGFydCk7XG4gICAgICAgIHRoaXMuZW5kICAgICA9IHBhcnNlSW50KGNmZy5lbmQpO1xuICAgICAgICB0aGlzLnN0cmFuZCAgPSBjZmcuc3RyYW5kO1xuICAgICAgICB0aGlzLnR5cGUgICAgPSBjZmcudHlwZTtcbiAgICAgICAgdGhpcy5iaW90eXBlID0gY2ZnLmJpb3R5cGU7XG4gICAgICAgIHRoaXMubWdwaWQgICA9IGNmZy5tZ3BpZCB8fCBjZmcuaWQ7XG4gICAgICAgIHRoaXMubWdpaWQgICA9IGNmZy5tZ2lpZDtcbiAgICAgICAgdGhpcy5zeW1ib2wgID0gY2ZnLnN5bWJvbDtcbiAgICAgICAgdGhpcy5nZW5vbWUgID0gY2ZnLmdlbm9tZTtcblx0dGhpcy5jb250aWcgID0gcGFyc2VJbnQoY2ZnLmNvbnRpZyk7XG5cdHRoaXMubGFuZSAgICA9IHBhcnNlSW50KGNmZy5sYW5lKTtcbiAgICAgICAgaWYgKHRoaXMubWdpaWQgPT09IFwiLlwiKSB0aGlzLm1naWlkID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuc3ltYm9sID09PSBcIi5cIikgdGhpcy5zeW1ib2wgPSBudWxsO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgSUQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgZ2V0IGNhbm9uaWNhbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1naWlkO1xuICAgIH1cbiAgICBnZXQgaWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZ2lpZCB8fCB0aGlzLm1ncGlkO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgbGFiZWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW1ib2wgfHwgdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGxlbmd0aCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuZCAtIHRoaXMuc3RhcnQgKyAxO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRNdW5nZWRUeXBlICgpIHtcblx0cmV0dXJuIHRoaXMudHlwZSA9PT0gXCJnZW5lXCIgP1xuXHQgICAgKHRoaXMuYmlvdHlwZSA9PT0gXCJwcm90ZWluX2NvZGluZ1wiIHx8IHRoaXMuYmlvdHlwZSA9PT0gXCJwcm90ZWluIGNvZGluZyBnZW5lXCIpID9cblx0XHRcInByb3RlaW5fY29kaW5nX2dlbmVcIlxuXHRcdDpcblx0XHR0aGlzLmJpb3R5cGUuaW5kZXhPZihcInBzZXVkb2dlbmVcIikgPj0gMCA/XG5cdFx0ICAgIFwicHNldWRvZ2VuZVwiXG5cdFx0ICAgIDpcblx0XHQgICAgKHRoaXMuYmlvdHlwZS5pbmRleE9mKFwiUk5BXCIpID49IDAgfHwgdGhpcy5iaW90eXBlLmluZGV4T2YoXCJhbnRpc2Vuc2VcIikgPj0gMCkgP1xuXHRcdFx0XCJuY1JOQV9nZW5lXCJcblx0XHRcdDpcblx0XHRcdHRoaXMuYmlvdHlwZS5pbmRleE9mKFwic2VnbWVudFwiKSA+PSAwID9cblx0XHRcdCAgICBcImdlbmVfc2VnbWVudFwiXG5cdFx0XHQgICAgOlxuXHRcdFx0ICAgIFwib3RoZXJfZ2VuZVwiXG5cdCAgICA6XG5cdCAgICB0aGlzLnR5cGUgPT09IFwicHNldWRvZ2VuZVwiID9cblx0XHRcInBzZXVkb2dlbmVcIlxuXHRcdDpcblx0XHR0aGlzLnR5cGUuaW5kZXhPZihcImdlbmVfc2VnbWVudFwiKSA+PSAwID9cblx0XHQgICAgXCJnZW5lX3NlZ21lbnRcIlxuXHRcdCAgICA6XG5cdFx0ICAgIHRoaXMudHlwZS5pbmRleE9mKFwiUk5BXCIpID49IDAgP1xuXHRcdFx0XCJuY1JOQV9nZW5lXCJcblx0XHRcdDpcblx0XHRcdHRoaXMudHlwZS5pbmRleE9mKFwiZ2VuZVwiKSA+PSAwID9cblx0XHRcdCAgICBcIm90aGVyX2dlbmVcIlxuXHRcdFx0ICAgIDpcblx0XHRcdCAgICBcIm90aGVyX2ZlYXR1cmVfdHlwZVwiO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgRmVhdHVyZSB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmVhdHVyZS5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBhcnNlcyBhIGxpc3Qgb3BlcmF0b3IgZXhwcmVzc2lvbiwgZWcgXCIoYSArIGIpKmMgLSBkXCJcbi8vIFJldHVybnMgYW4gYWJzdHJhY3Qgc3ludGF4IHRyZWUuXG4vLyAgICAgTGVhZiBub2RlcyA9IGxpc3QgbmFtZXMuIFRoZXkgYXJlIHNpbXBsZSBzdHJpbmdzLlxuLy8gICAgIEludGVyaW9yIG5vZGVzID0gb3BlcmF0aW9ucy4gVGhleSBsb29rIGxpa2U6IHtsZWZ0Om5vZGUsIG9wOnN0cmluZywgcmlnaHQ6bm9kZX1cbi8vIFxuY2xhc3MgTGlzdEZvcm11bGFQYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcblx0dGhpcy5yX29wICAgID0gL1srLV0vO1xuXHR0aGlzLnJfb3AyICAgPSAvWypdLztcblx0dGhpcy5yX29wcyAgID0gL1soKSsqLV0vO1xuXHR0aGlzLnJfaWRlbnQgPSAvW2EtekEtWl9dW2EtekEtWjAtOV9dKi87XG5cdHRoaXMucl9xc3RyICA9IC9cIlteXCJdKlwiLztcblx0dGhpcy5yZSA9IG5ldyBSZWdFeHAoYCgke3RoaXMucl9vcHMuc291cmNlfXwke3RoaXMucl9xc3RyLnNvdXJjZX18JHt0aGlzLnJfaWRlbnQuc291cmNlfSlgLCAnZycpO1xuXHQvL3RoaXMucmUgPSAvKFsoKSsqLV18XCJbXlwiXStcInxbYS16QS1aX11bYS16QS1aMC05X10qKS9nXG5cdHRoaXMuX2luaXQoXCJcIik7XG4gICAgfVxuICAgIF9pbml0IChzKSB7XG4gICAgICAgIHRoaXMuZXhwciA9IHM7XG5cdHRoaXMudG9rZW5zID0gdGhpcy5leHByLm1hdGNoKHRoaXMucmUpIHx8IFtdO1xuXHR0aGlzLmkgPSAwO1xuICAgIH1cbiAgICBfcGVla1Rva2VuKCkge1xuXHRyZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5pXTtcbiAgICB9XG4gICAgX25leHRUb2tlbiAoKSB7XG5cdGxldCB0O1xuICAgICAgICBpZiAodGhpcy5pIDwgdGhpcy50b2tlbnMubGVuZ3RoKSB7XG5cdCAgICB0ID0gdGhpcy50b2tlbnNbdGhpcy5pXTtcblx0ICAgIHRoaXMuaSArPSAxO1xuXHR9XG5cdHJldHVybiB0O1xuICAgIH1cbiAgICBfZXhwciAoKSB7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fdGVybSgpO1xuXHRsZXQgb3AgPSB0aGlzLl9wZWVrVG9rZW4oKTtcblx0aWYgKG9wID09PSBcIitcIiB8fCBvcCA9PT0gXCItXCIpIHtcblx0ICAgIHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgbm9kZSA9IHsgbGVmdDpub2RlLCBvcDpvcD09PVwiK1wiP1widW5pb25cIjpcImRpZmZlcmVuY2VcIiwgcmlnaHQ6IHRoaXMuX2V4cHIoKSB9XG5cdCAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfSAgICAgICAgICAgICAgIFxuXHRlbHNlIGlmIChvcCA9PT0gXCIpXCIgfHwgb3AgPT09IHVuZGVmaW5lZCB8fCBvcCA9PT0gbnVsbClcblx0ICAgIHJldHVybiBub2RlO1xuXHRlbHNlXG5cdCAgICB0aGlzLl9lcnJvcihcIlVOSU9OIG9yIElOVEVSU0VDVElPTiBvciApIG9yIE5VTExcIiwgb3ApO1xuICAgIH1cbiAgICBfdGVybSAoKSB7XG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fZmFjdG9yKCk7XG5cdGxldCBvcCA9IHRoaXMuX3BlZWtUb2tlbigpO1xuXHRpZiAob3AgPT09IFwiKlwiKSB7XG5cdCAgICB0aGlzLl9uZXh0VG9rZW4oKTtcblx0ICAgIG5vZGUgPSB7IGxlZnQ6bm9kZSwgb3A6XCJpbnRlcnNlY3Rpb25cIiwgcmlnaHQ6IHRoaXMuX2ZhY3RvcigpIH1cblx0fVxuXHRyZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgX2ZhY3RvciAoKSB7XG4gICAgICAgIGxldCB0ID0gdGhpcy5fbmV4dFRva2VuKCk7XG5cdGlmICh0ID09PSBcIihcIil7XG5cdCAgICBsZXQgbm9kZSA9IHRoaXMuX2V4cHIoKTtcblx0ICAgIGxldCBudCA9IHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgaWYgKG50ICE9PSBcIilcIikgdGhpcy5fZXJyb3IoXCInKSdcIiwgbnQpO1xuXHQgICAgcmV0dXJuIG5vZGU7XG5cdH1cblx0ZWxzZSBpZiAodCAmJiAodC5zdGFydHNXaXRoKCdcIicpKSkge1xuXHQgICAgcmV0dXJuIHQuc3Vic3RyaW5nKDEsIHQubGVuZ3RoLTEpO1xuXHR9XG5cdGVsc2UgaWYgKHQgJiYgdC5tYXRjaCgvW2EtekEtWl9dLykpIHtcblx0ICAgIHJldHVybiB0O1xuXHR9XG5cdGVsc2Vcblx0ICAgIHRoaXMuX2Vycm9yKFwiRVhQUiBvciBJREVOVFwiLCB0fHxcIk5VTExcIik7XG5cdHJldHVybiB0O1xuXHQgICAgXG4gICAgfVxuICAgIF9lcnJvciAoZXhwZWN0ZWQsIHNhdykge1xuICAgICAgICB0aHJvdyBgUGFyc2UgZXJyb3I6IGV4cGVjdGVkICR7ZXhwZWN0ZWR9IGJ1dCBzYXcgJHtzYXd9LmA7XG4gICAgfVxuICAgIC8vIFBhcnNlcyB0aGUgc3RyaW5nIGFuZCByZXR1cm5zIHRoZSBhYnN0cmFjdCBzeW50YXggdHJlZS5cbiAgICAvLyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIHRoZXJlIGlzIGEgc3ludGF4IGVycm9yLlxuICAgIHBhcnNlIChzKSB7XG5cdHRoaXMuX2luaXQocyk7XG5cdHJldHVybiB0aGlzLl9leHByKCk7XG4gICAgfVxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZmYgc3RyaW5nIGlzIHN5bnRhY3RpY2FsbHkgdmFsaWRcbiAgICBpc1ZhbGlkIChzKSB7XG4gICAgICAgIHRyeSB7XG5cdCAgICB0aGlzLnBhcnNlKHMpO1xuXHQgICAgcmV0dXJuIHRydWU7XG5cdH1cblx0Y2F0Y2ggKGUpIHtcblx0ICAgIHJldHVybiBmYWxzZTtcblx0fVxuICAgIH1cbn1cblxuZXhwb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0xpc3RGb3JtdWxhUGFyc2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBTVkdWaWV3IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQsIG1hcmdpbnMsIHJvdGF0aW9uLCB0cmFuc2xhdGlvbikge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG4gICAgICAgIHRoaXMuc3ZnID0gdGhpcy5yb290LnNlbGVjdChcInN2Z1wiKTtcbiAgICAgICAgdGhpcy5zdmdNYWluID0gdGhpcy5zdmdcbiAgICAgICAgICAgIC5hcHBlbmQoXCJnXCIpICAgIC8vIHRoZSBtYXJnaW4tdHJhbnNsYXRlZCBncm91cFxuICAgICAgICAgICAgLmFwcGVuZChcImdcIilcdCAgLy8gbWFpbiBncm91cCBmb3IgdGhlIGRyYXdpbmdcblx0ICAgIC5hdHRyKFwibmFtZVwiLFwic3ZnbWFpblwiKTtcblx0dGhpcy5vdXRlcldpZHRoID0gMTAwO1xuXHR0aGlzLndpZHRoID0gMTAwO1xuXHR0aGlzLm91dGVySGVpZ2h0ID0gMTAwO1xuXHR0aGlzLmhlaWdodCA9IDEwMDtcblx0dGhpcy5tYXJnaW5zID0ge3RvcDogMTgsIHJpZ2h0OiAxMiwgYm90dG9tOiAxMiwgbGVmdDogMTJ9O1xuXHR0aGlzLnJvdGF0aW9uID0gMDtcblx0dGhpcy50cmFuc2xhdGlvbiA9IFswLDBdO1xuXHQvL1xuICAgICAgICB0aGlzLnNldEdlb20oe3dpZHRoLCBoZWlnaHQsIG1hcmdpbnMsIHJvdGF0aW9uLCB0cmFuc2xhdGlvbn0pO1xuICAgIH1cbiAgICBzZXRHZW9tIChjZmcpIHtcbiAgICAgICAgdGhpcy5vdXRlcldpZHRoICA9IGNmZy53aWR0aCAgICAgICB8fCB0aGlzLm91dGVyV2lkdGg7XG4gICAgICAgIHRoaXMub3V0ZXJIZWlnaHQgPSBjZmcuaGVpZ2h0ICAgICAgfHwgdGhpcy5vdXRlckhlaWdodDtcbiAgICAgICAgdGhpcy5tYXJnaW5zICAgICA9IGNmZy5tYXJnaW5zICAgICB8fCB0aGlzLm1hcmdpbnM7XG5cdHRoaXMucm90YXRpb24gICAgPSB0eXBlb2YoY2ZnLnJvdGF0aW9uKSA9PT0gXCJudW1iZXJcIiA/IGNmZy5yb3RhdGlvbiA6IHRoaXMucm90YXRpb247XG5cdHRoaXMudHJhbnNsYXRpb24gPSBjZmcudHJhbnNsYXRpb24gfHwgdGhpcy50cmFuc2xhdGlvbjtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy53aWR0aCAgPSB0aGlzLm91dGVyV2lkdGggIC0gdGhpcy5tYXJnaW5zLmxlZnQgLSB0aGlzLm1hcmdpbnMucmlnaHQ7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5vdXRlckhlaWdodCAtIHRoaXMubWFyZ2lucy50b3AgIC0gdGhpcy5tYXJnaW5zLmJvdHRvbTtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy5zdmcuYXR0cihcIndpZHRoXCIsIHRoaXMub3V0ZXJXaWR0aClcbiAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5vdXRlckhlaWdodClcbiAgICAgICAgICAgIC5zZWxlY3QoJ2dbbmFtZT1cInN2Z21haW5cIl0nKVxuICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7dGhpcy5tYXJnaW5zLmxlZnR9LCR7dGhpcy5tYXJnaW5zLnRvcH0pIHJvdGF0ZSgke3RoaXMucm90YXRpb259KSB0cmFuc2xhdGUoJHt0aGlzLnRyYW5zbGF0aW9uWzBdfSwke3RoaXMudHJhbnNsYXRpb25bMV19KWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2V0TWFyZ2lucyggdG0sIHJtLCBibSwgbG0gKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG5cdCAgICBybSA9IGJtID0gbG0gPSB0bTtcblx0fVxuXHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG5cdCAgICBibSA9IHRtO1xuXHQgICAgbG0gPSBybTtcblx0fVxuXHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSA0KVxuXHQgICAgdGhyb3cgXCJCYWQgYXJndW1lbnRzLlwiO1xuICAgICAgICAvL1xuXHR0aGlzLnNldEdlb20oe3RvcDogdG0sIHJpZ2h0OiBybSwgYm90dG9tOiBibSwgbGVmdDogbG19KTtcblx0Ly9cblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJvdGF0ZSAoZGVnKSB7XG4gICAgICAgIHRoaXMuc2V0R2VvbSh7cm90YXRpb246ZGVnfSk7XG5cdHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0cmFuc2xhdGUgKGR4LCBkeSkge1xuICAgICAgICB0aGlzLnNldEdlb20oe3RyYW5zbGF0aW9uOltkeCxkeV19KTtcblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICB0aGUgd2luZG93IHdpZHRoXG4gICAgZml0VG9XaWR0aCAod2lkdGgpIHtcbiAgICAgICAgbGV0IHIgPSB0aGlzLnN2Z1swXVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy5zZXRHZW9tKHt3aWR0aDogd2lkdGggLSByLnh9KVxuXHRyZXR1cm4gdGhpcztcbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIFNWR1ZpZXdcblxuZXhwb3J0IHsgU1ZHVmlldyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvU1ZHVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBNR1ZBcHAgfSBmcm9tICcuL01HVkFwcCc7XG5pbXBvcnQgeyByZW1vdmVEdXBzIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vL1xuLy8gcHFzdHJpbmcgPSBQYXJzZSBxc3RyaW5nLiBQYXJzZXMgdGhlIHBhcmFtZXRlciBwb3J0aW9uIG9mIHRoZSBVUkwuXG4vL1xuZnVuY3Rpb24gcHFzdHJpbmcgKHFzdHJpbmcpIHtcbiAgICAvL1xuICAgIGxldCBjZmcgPSB7fTtcblxuICAgIC8vIEZJWE1FOiBVUkxTZWFyY2hQYXJhbXMgQVBJIGlzIG5vdCBzdXBwb3J0ZWQgaW4gYWxsIGJyb3dzZXJzLlxuICAgIC8vIE9LIGZvciBkZXZlbG9wbWVudCBidXQgbmVlZCBhIGZhbGxiYWNrIGV2ZW50dWFsbHkuXG4gICAgbGV0IHBybXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHFzdHJpbmcpO1xuICAgIGxldCBnZW5vbWVzID0gW107XG5cbiAgICAvLyAtLS0tLSBnZW5vbWVzIC0tLS0tLS0tLS0tLVxuICAgIGxldCBwZ2Vub21lcyA9IHBybXMuZ2V0KFwiZ2Vub21lc1wiKSB8fCBcIlwiO1xuICAgIC8vIEZvciBub3csIGFsbG93IFwiY29tcHNcIiBhcyBzeW5vbnltIGZvciBcImdlbm9tZXNcIi4gRXZlbnR1YWxseSwgZG9uJ3Qgc3VwcG9ydCBcImNvbXBzXCIuXG4gICAgcGdlbm9tZXMgPSAocGdlbm9tZXMgKyAgXCIgXCIgKyAocHJtcy5nZXQoXCJjb21wc1wiKSB8fCBcIlwiKSk7XG4gICAgLy9cbiAgICBwZ2Vub21lcyA9IHJlbW92ZUR1cHMocGdlbm9tZXMudHJpbSgpLnNwbGl0KC8gKy8pKTtcbiAgICBwZ2Vub21lcy5sZW5ndGggPiAwICYmIChjZmcuZ2Vub21lcyA9IHBnZW5vbWVzKTtcblxuICAgIC8vIC0tLS0tIHJlZiBnZW5vbWUgLS0tLS0tLS0tLS0tXG4gICAgbGV0IHJlZiA9IHBybXMuZ2V0KFwicmVmXCIpO1xuICAgIHJlZiAmJiAoY2ZnLnJlZiA9IHJlZik7XG5cbiAgICAvLyAtLS0tLSBoaWdobGlnaHQgSURzIC0tLS0tLS0tLS0tLS0tXG4gICAgbGV0IGhscyA9IG5ldyBTZXQoKTtcbiAgICBsZXQgaGxzMCA9IHBybXMuZ2V0KFwiaGlnaGxpZ2h0XCIpO1xuICAgIGlmIChobHMwKSB7XG5cdGhsczAgPSBobHMwLnJlcGxhY2UoL1sgLF0rL2csICcgJykuc3BsaXQoJyAnKS5maWx0ZXIoeD0+eCk7XG5cdGhsczAubGVuZ3RoID4gMCAmJiAoY2ZnLmhpZ2hsaWdodCA9IGhsczApO1xuICAgIH1cblxuICAgIC8vIC0tLS0tIGNvb3JkaW5hdGVzIC0tLS0tLS0tLS0tLS0tXG4gICAgLy9cbiAgICBsZXQgY2hyICAgPSBwcm1zLmdldChcImNoclwiKTtcbiAgICBsZXQgc3RhcnQgPSBwcm1zLmdldChcInN0YXJ0XCIpO1xuICAgIGxldCBlbmQgICA9IHBybXMuZ2V0KFwiZW5kXCIpO1xuICAgIGNociAgICYmIChjZmcuY2hyID0gY2hyKTtcbiAgICBzdGFydCAmJiAoY2ZnLnN0YXJ0ID0gcGFyc2VJbnQoc3RhcnQpKTtcbiAgICBlbmQgICAmJiAoY2ZnLmVuZCA9IHBhcnNlSW50KGVuZCkpO1xuICAgIC8vXG4gICAgbGV0IGxhbmRtYXJrID0gcHJtcy5nZXQoXCJsYW5kbWFya1wiKTtcbiAgICBsZXQgZmxhbmsgICAgPSBwcm1zLmdldChcImZsYW5rXCIpO1xuICAgIGxldCBsZW5ndGggICA9IHBybXMuZ2V0KFwibGVuZ3RoXCIpO1xuICAgIGxldCBkZWx0YSAgICA9IHBybXMuZ2V0KFwiZGVsdGFcIik7XG4gICAgbGFuZG1hcmsgJiYgKGNmZy5sYW5kbWFyayA9IGxhbmRtYXJrKTtcbiAgICBmbGFuayAgICAmJiAoY2ZnLmZsYW5rID0gcGFyc2VJbnQoZmxhbmspKTtcbiAgICBsZW5ndGggICAmJiAoY2ZnLmxlbmd0aCA9IHBhcnNlSW50KGxlbmd0aCkpO1xuICAgIGRlbHRhICAgICYmIChjZmcuZGVsdGEgPSBwYXJzZUludChkZWx0YSkpO1xuICAgIC8vXG4gICAgLy8gLS0tLS0gZHJhd2luZyBtb2RlIC0tLS0tLS0tLS0tLS1cbiAgICBsZXQgZG1vZGUgPSBwcm1zLmdldChcImRtb2RlXCIpO1xuICAgIGRtb2RlICYmIChjZmcuZG1vZGUgPSBkbW9kZSk7XG4gICAgLy9cbiAgICByZXR1cm4gY2ZnO1xufVxuXG5cbi8vIFRoZSBtYWluIHByb2dyYW0sIHdoZXJlaW4gdGhlIGFwcCBpcyBjcmVhdGVkIGFuZCB3aXJlZCB0byB0aGUgYnJvd3Nlci4gXG4vL1xuZnVuY3Rpb24gX19tYWluX18gKHNlbGVjdG9yKSB7XG4gICAgLy8gQmVob2xkLCB0aGUgTUdWIGFwcGxpY2F0aW9uIG9iamVjdC4uLlxuICAgIGxldCBtZ3YgPSBudWxsO1xuXG4gICAgLy8gQ2FsbGJhY2sgdG8gcGFzcyBpbnRvIHRoZSBhcHAgdG8gcmVnaXN0ZXIgY2hhbmdlcyBpbiBjb250ZXh0LlxuICAgIC8vIFVzZXMgdGhlIGN1cnJlbnQgYXBwIGNvbnRleHQgdG8gc2V0IHRoZSBoYXNoIHBhcnQgb2YgdGhlXG4gICAgLy8gYnJvd3NlcidzIGxvY2F0aW9uLiBUaGlzIGFsc28gcmVnaXN0ZXJzIHRoZSBjaGFuZ2UgaW4gXG4gICAgLy8gdGhlIGJyb3dzZXIgaGlzdG9yeS5cbiAgICBmdW5jdGlvbiBzZXRIYXNoICgpIHtcblx0bGV0IG5ld0hhc2ggPSBtZ3YuZ2V0UGFyYW1TdHJpbmcoKTtcblx0aWYgKCcjJytuZXdIYXNoID09PSB3aW5kb3cubG9jYXRpb24uaGFzaClcblx0ICAgIHJldHVybjtcblx0Ly8gdGVtcG9yYXJpbHkgZGlzYWJsZSBwb3BzdGF0ZSBoYW5kbGVyXG5cdGxldCBmID0gd2luZG93Lm9ucG9wc3RhdGU7XG5cdHdpbmRvdy5vbnBvcHN0YXRlID0gbnVsbDtcblx0Ly8gbm93IHNldCB0aGUgaGFzaFxuXHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IG5ld0hhc2g7XG5cdC8vIHJlLWVuYWJsZVxuXHR3aW5kb3cub25wb3BzdGF0ZSA9IGY7XG4gICAgfVxuICAgIC8vIEhhbmRsZXIgY2FsbGVkIHdoZW4gdXNlciBjbGlja3MgdGhlIGJyb3dzZXIncyBiYWNrIG9yIGZvcndhcmQgYnV0dG9ucy5cbiAgICAvLyBTZXRzIHRoZSBhcHAncyBjb250ZXh0IGJhc2VkIG9uIHRoZSBoYXNoIHBhcnQgb2YgdGhlIGJyb3dzZXInc1xuICAgIC8vIGxvY2F0aW9uLlxuICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0bGV0IGNmZyA9IHBxc3RyaW5nKGRvY3VtZW50LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcblx0bWd2LnNldENvbnRleHQoY2ZnLCB0cnVlKTtcbiAgICB9O1xuICAgIC8vIGdldCBpbml0aWFsIHNldCBvZiBjb250ZXh0IHBhcmFtcyBcbiAgICBsZXQgcXN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKTtcbiAgICBsZXQgY2ZnID0gcHFzdHJpbmcocXN0cmluZyk7XG4gICAgY2ZnLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgY2ZnLm9uY29udGV4dGNoYW5nZSA9IHNldEhhc2g7XG5cbiAgICAvLyBjcmVhdGUgdGhlIGFwcFxuICAgIHdpbmRvdy5tZ3YgPSBtZ3YgPSBuZXcgTUdWQXBwKHNlbGVjdG9yLCBjZmcpO1xuICAgIFxuICAgIC8vIGhhbmRsZSByZXNpemUgZXZlbnRzXG4gICAgd2luZG93Lm9ucmVzaXplID0gKCkgPT4ge21ndi5yZXNpemUoKTttZ3Yuc2V0Q29udGV4dCh7fSk7fVxufVxuXG5cbl9fbWFpbl9fKFwiI21ndlwiKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL3ZpZXdlci5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBwYXJzZUNvb3JkcywgZm9ybWF0Q29vcmRzLCBkM3RzdiwgZDNqc29uLCBpbml0T3B0TGlzdCwgc2FtZSwgY2xpcCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgR2Vub21lIH0gICAgICAgICAgZnJvbSAnLi9HZW5vbWUnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gICAgICAgZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgRmVhdHVyZU1hbmFnZXIgfSAgZnJvbSAnLi9GZWF0dXJlTWFuYWdlcic7XG5pbXBvcnQgeyBRdWVyeU1hbmFnZXIgfSAgICBmcm9tICcuL1F1ZXJ5TWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0TWFuYWdlciB9ICAgICBmcm9tICcuL0xpc3RNYW5hZ2VyJztcbmltcG9ydCB7IExpc3RFZGl0b3IgfSAgICAgIGZyb20gJy4vTGlzdEVkaXRvcic7XG5pbXBvcnQgeyBGYWNldE1hbmFnZXIgfSAgICBmcm9tICcuL0ZhY2V0TWFuYWdlcic7XG5pbXBvcnQgeyBCVE1hbmFnZXIgfSAgICAgICBmcm9tICcuL0JUTWFuYWdlcic7XG5pbXBvcnQgeyBHZW5vbWVWaWV3IH0gICAgICBmcm9tICcuL0dlbm9tZVZpZXcnO1xuaW1wb3J0IHsgRmVhdHVyZURldGFpbHMgfSAgZnJvbSAnLi9GZWF0dXJlRGV0YWlscyc7XG5pbXBvcnQgeyBab29tVmlldyB9ICAgICAgICBmcm9tICcuL1pvb21WaWV3JztcbmltcG9ydCB7IEtleVN0b3JlIH0gICAgICAgIGZyb20gJy4vS2V5U3RvcmUnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIE1HVkFwcCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHNlbGVjdG9yLCBjZmcpIHtcblx0c3VwZXIobnVsbCwgc2VsZWN0b3IpO1xuXHR0aGlzLmFwcCA9IHRoaXM7XG5cdC8vXG5cdHRoaXMuaW5pdGlhbENmZyA9IGNmZztcblx0Ly9cblx0dGhpcy5jb250ZXh0Q2hhbmdlZCA9IChjZmcub25jb250ZXh0Y2hhbmdlIHx8IGZ1bmN0aW9uKCl7fSk7XG5cdC8vXG5cdHRoaXMubmFtZTJnZW5vbWUgPSB7fTsgIC8vIG1hcCBmcm9tIGdlbm9tZSBuYW1lIC0+IGdlbm9tZSBkYXRhIG9ialxuXHR0aGlzLmxhYmVsMmdlbm9tZSA9IHt9OyAvLyBtYXAgZnJvbSBnZW5vbWUgbGFiZWwgLT4gZ2Vub21lIGRhdGEgb2JqXG5cdHRoaXMubmwyZ2Vub21lID0ge307ICAgIC8vIGNvbWJpbmVzIGluZGV4ZXNcblx0Ly9cblx0dGhpcy5hbGxHZW5vbWVzID0gW107ICAgLy8gbGlzdCBvZiBhbGwgYXZhaWxhYmxlIGdlbm9tZXNcblx0dGhpcy5yR2Vub21lID0gbnVsbDsgICAgLy8gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZVxuXHR0aGlzLmNHZW5vbWVzID0gW107ICAgICAvLyBjdXJyZW50IGNvbXBhcmlzb24gZ2Vub21lcyAockdlbm9tZSBpcyAqbm90KiBpbmNsdWRlZCkuXG5cdHRoaXMudkdlbm9tZXMgPSBbXTtcdC8vIGxpc3Qgb2YgYWxsIGN1cnJlbnR5IHZpZXdlZCBnZW5vbWVzIChyZWYrY29tcHMpIGluIFktb3JkZXIuXG5cdC8vXG5cdHRoaXMuZHVyID0gMjUwOyAgICAgICAgIC8vIGFuaW1hdGlvbiBkdXJhdGlvbiwgaW4gbXNcblx0dGhpcy5kZWZhdWx0Wm9vbSA9IDI7XHQvLyBtdWx0aXBsaWVyIG9mIGN1cnJlbnQgcmFuZ2Ugd2lkdGguIE11c3QgYmUgPj0gMS4gMSA9PSBubyB6b29tLlxuXHRcdFx0XHQvLyAoem9vbWluZyBpbiB1c2VzIDEvdGhpcyBhbW91bnQpXG5cdHRoaXMuZGVmYXVsdFBhbiAgPSAwLjE1Oy8vIGZyYWN0aW9uIG9mIGN1cnJlbnQgcmFuZ2Ugd2lkdGhcblx0dGhpcy5jdXJyTGlzdEluZGV4ID0ge307XG5cdHRoaXMuY3Vyckxpc3RDb3VudGVyID0gMDtcblxuXG5cdC8vIENvb3JkaW5hdGVzIG1heSBiZSBzcGVjaWZpZWQgaW4gb25lIG9mIHR3byB3YXlzOiBtYXBwZWQgb3IgbGFuZG1hcmsuIFxuXHQvLyBNYXBwZWQgY29vcmRpbmF0ZXMgYXJlIHNwZWNpZmllZCBhcyBjaHJvbW9zb21lK3N0YXJ0K2VuZC4gVGhpcyBjb29yZGluYXRlIHJhbmdlIGlzIGRlZmluZWQgcmVsYXRpdmUgdG8gXG5cdC8vIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBnZW5vbWUsIGFuZCBpcyBtYXBwZWQgdG8gdGhlIGNvcnJlc3BvbmRpbmcgcmFuZ2UocykgaW4gZWFjaCBjb21wYXJpc29uIGdlbm9tZS5cblx0Ly8gTGFuZG1hcmsgY29vcmRpbmF0ZXMgYXJlIHNwZWNpZmllZCBhcyBsYW5kbWFyaytbZmxhbmt8d2lkdGhdK2RlbHRhLiBUaGUgbGFuZG1hcmsgaXMgbG9va2VkIHVwIGluIGVhY2ggXG5cdC8vIGdlbm9tZS4gSXRzIGNvb3JkaW5hdGVzLCBjb21iaW5lZCB3aXRoIGZsYW5rfGxlbmd0aCBhbmQgZGVsdGEsIGRldGVybWluZSB0aGUgYWJzb2x1dGUgY29vcmRpbmF0ZSByYW5nZVxuXHQvLyBpbiB0aGF0IGdlbm9tZS4gSWYgdGhlIGxhbmRtYXJrIGRvZXMgbm90IGV4aXN0IGluIGEgZ2l2ZW4gZ2Vub21lLCB0aGVuIG1hcHBlZCBjb29yZGluYXRlIGFyZSB1c2VkLlxuXHQvLyBcblx0dGhpcy5jbW9kZSA9ICdtYXBwZWQnIC8vICdtYXBwZWQnIG9yICdsYW5kbWFyaydcblx0dGhpcy5jb29yZHMgPSB7IGNocjogJzEnLCBzdGFydDogMTAwMDAwMCwgZW5kOiAxMDAwMDAwMCB9OyAgLy8gbWFwcGVkXG5cdHRoaXMubGNvb3JkcyA9IHsgbGFuZG1hcms6ICdQYXg2JywgZmxhbms6IDUwMDAwMCwgZGVsdGE6MCB9Oy8vIGxhbmRtYXJrXG5cblx0dGhpcy5pbml0RG9tKCk7XG5cblx0Ly9cblx0Ly9cblx0dGhpcy5nZW5vbWVWaWV3ID0gbmV3IEdlbm9tZVZpZXcodGhpcywgJyNnZW5vbWVWaWV3JywgODAwLCAyNTApO1xuXHR0aGlzLnpvb21WaWV3ICAgPSBuZXcgWm9vbVZpZXcgICh0aGlzLCAnI3pvb21WaWV3JywgODAwLCAyNTAsIHRoaXMuY29vcmRzKTtcblx0dGhpcy5yZXNpemUoKTtcbiAgICAgICAgLy9cblx0dGhpcy5mZWF0dXJlRGV0YWlscyA9IG5ldyBGZWF0dXJlRGV0YWlscyh0aGlzLCAnI2ZlYXR1cmVEZXRhaWxzJyk7XG5cblx0Ly8gQ2F0ZWdvcmljYWwgY29sb3Igc2NhbGUgZm9yIGZlYXR1cmUgdHlwZXNcblx0dGhpcy5jc2NhbGUgPSBkMy5zY2FsZS5jYXRlZ29yeTEwKCkuZG9tYWluKFtcblx0ICAgICdwcm90ZWluX2NvZGluZ19nZW5lJyxcblx0ICAgICdwc2V1ZG9nZW5lJyxcblx0ICAgICduY1JOQV9nZW5lJyxcblx0ICAgICdnZW5lX3NlZ21lbnQnLFxuXHQgICAgJ290aGVyX2dlbmUnLFxuXHQgICAgJ290aGVyX2ZlYXR1cmVfdHlwZSdcblx0XSk7XG5cdC8vXG5cdC8vXG5cdHRoaXMubGlzdE1hbmFnZXIgICAgPSBuZXcgTGlzdE1hbmFnZXIodGhpcywgXCIjbXlsaXN0c1wiKTtcblx0dGhpcy5saXN0TWFuYWdlci5yZWFkeS50aGVuKCAoKSA9PiB0aGlzLmxpc3RNYW5hZ2VyLnVwZGF0ZSgpICk7XG5cdC8vXG5cdHRoaXMubGlzdEVkaXRvciA9IG5ldyBMaXN0RWRpdG9yKHRoaXMsICcjbGlzdGVkaXRvcicpO1xuXHQvL1xuXHR0aGlzLnRyYW5zbGF0b3IgICAgID0gbmV3IEJUTWFuYWdlcih0aGlzKTtcblx0dGhpcy5mZWF0dXJlTWFuYWdlciA9IG5ldyBGZWF0dXJlTWFuYWdlcih0aGlzKTtcblx0dGhpcy5xdWVyeU1hbmFnZXIgPSBuZXcgUXVlcnlNYW5hZ2VyKHRoaXMsIFwiI2ZpbmRHZW5lc0JveFwiKTtcblx0Ly9cblx0dGhpcy51c2VyUHJlZnNTdG9yZSA9IG5ldyBLZXlTdG9yZShcInVzZXItcHJlZmVyZW5jZXNcIik7XG5cdFxuXHQvL1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIEZhY2V0c1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vXG5cdHRoaXMuZmFjZXRNYW5hZ2VyID0gbmV3IEZhY2V0TWFuYWdlcih0aGlzKTtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdC8vIEZlYXR1cmUtdHlwZSBmYWNldFxuXHRsZXQgZnRGYWNldCAgPSB0aGlzLmZhY2V0TWFuYWdlci5hZGRGYWNldChcIkZlYXR1cmVUeXBlXCIsIGYgPT4gZi5nZXRNdW5nZWRUeXBlKCkpO1xuXHR0aGlzLmluaXRGZWF0VHlwZUNvbnRyb2woZnRGYWNldCk7XG5cblx0Ly8gSGFzLU1HSS1pZCBmYWNldFxuXHRsZXQgbWdpRmFjZXQgPSB0aGlzLmZhY2V0TWFuYWdlci5hZGRGYWNldChcIkhhc0Nhbm9uaWNhbElkXCIsICAgIGYgPT4gZi5jYW5vbmljYWwgID8gXCJ5ZXNcIiA6IFwibm9cIiApO1xuXHRkMy5zZWxlY3RBbGwoJ2lucHV0W25hbWU9XCJtZ2lGYWNldFwiXScpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCl7XG5cdCAgICBtZ2lGYWNldC5zZXRWYWx1ZXModGhpcy52YWx1ZSA9PT0gXCJcIiA/IFtdIDogW3RoaXMudmFsdWVdKTtcblx0ICAgIHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXG5cdC8vIElzLWhpZ2hsaWdodGVkIGZhY2V0XG5cdGxldCBoaUZhY2V0ID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJJc0hpXCIsIGYgPT4ge1xuXHQgICAgbGV0IGlzaGkgPSB0aGlzLnpvb21WaWV3LmhpRmVhdHNbZi5pZF0gfHwgdGhpcy5jdXJyTGlzdEluZGV4W2YuaWRdO1xuXHQgICAgcmV0dXJuIGlzaGkgPyBcInllc1wiIDogXCJub1wiO1xuXHR9KTtcblx0ZDMuc2VsZWN0QWxsKCdpbnB1dFtuYW1lPVwiaGlGYWNldFwiXScpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCl7XG5cdCAgICBoaUZhY2V0LnNldFZhbHVlcyh0aGlzLnZhbHVlID09PSBcIlwiID8gW10gOiBbdGhpcy52YWx1ZV0pO1xuXHQgICAgc2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0fSk7XG5cblxuXHQvL1xuXHR0aGlzLnNldFVJRnJvbVByZWZzKCk7XG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdC8vIFRoaW5ncyBhcmUgYWxsIHdpcmVkIHVwLiBOb3cgbGV0J3MgZ2V0IHNvbWUgZGF0YS5cblx0Ly8gU3RhcnQgd2l0aCB0aGUgZmlsZSBvZiBhbGwgdGhlIGdlbm9tZXMuXG5cdHRoaXMuY2hlY2tUaW1lc3RhbXAoKS50aGVuKCAoKSA9PiB7XG5cdCAgICBkM3RzdihcIi4vZGF0YS9nZW5vbWVkYXRhL2FsbEdlbm9tZXMudHN2XCIpLnRoZW4oZGF0YSA9PiB7XG5cdFx0Ly8gY3JlYXRlIEdlbm9tZSBvYmplY3RzIGZyb20gdGhlIHJhdyBkYXRhLlxuXHRcdHRoaXMuYWxsR2Vub21lcyAgID0gZGF0YS5tYXAoZyA9PiBuZXcgR2Vub21lKGcpKTtcblx0XHR0aGlzLmFsbEdlbm9tZXMuc29ydCggKGEsYikgPT4ge1xuXHRcdCAgICByZXR1cm4gYS5sYWJlbCA8IGIubGFiZWwgPyAtMSA6IGEubGFiZWwgPiBiLmxhYmVsID8gKzEgOiAwO1xuXHRcdH0pO1xuXHRcdC8vXG5cdFx0Ly8gYnVpbGQgYSBuYW1lLT5HZW5vbWUgaW5kZXhcblx0XHR0aGlzLm5sMmdlbm9tZSA9IHt9OyAvLyBhbHNvIGJ1aWxkIHRoZSBjb21iaW5lZCBsaXN0IGF0IHRoZSBzYW1lIHRpbWUuLi5cblx0XHR0aGlzLm5hbWUyZ2Vub21lICA9IHRoaXMuYWxsR2Vub21lc1xuXHRcdCAgICAucmVkdWNlKChhY2MsZykgPT4geyB0aGlzLm5sMmdlbm9tZVtnLm5hbWVdID0gYWNjW2cubmFtZV0gPSBnOyByZXR1cm4gYWNjOyB9LCB7fSk7XG5cdFx0Ly8gYnVpbGQgYSBsYWJlbC0+R2Vub21lIGluZGV4XG5cdFx0dGhpcy5sYWJlbDJnZW5vbWUgPSB0aGlzLmFsbEdlbm9tZXNcblx0XHQgICAgLnJlZHVjZSgoYWNjLGcpID0+IHsgdGhpcy5ubDJnZW5vbWVbZy5sYWJlbF0gPSBhY2NbZy5sYWJlbF0gPSBnOyByZXR1cm4gYWNjOyB9LCB7fSk7XG5cblx0XHQvLyBOb3cgcHJlbG9hZCBhbGwgdGhlIGNocm9tb3NvbWUgZmlsZXMgZm9yIGFsbCB0aGUgZ2Vub21lc1xuXHRcdGxldCBjZHBzID0gdGhpcy5hbGxHZW5vbWVzLm1hcChnID0+IGQzdHN2KGAuL2RhdGEvZ2Vub21lZGF0YS8ke2cubmFtZX0tY2hyb21vc29tZXMudHN2YCkpO1xuXHRcdHJldHVybiBQcm9taXNlLmFsbChjZHBzKTtcblx0ICAgIH0pXG5cdCAgICAudGhlbiggZGF0YSA9PiB7XG5cblx0XHQvL1xuXHRcdHRoaXMucHJvY2Vzc0Nocm9tb3NvbWVzKGRhdGEpO1xuXHRcdHRoaXMuaW5pdERvbVBhcnQyKCk7XG5cdFx0Ly9cblx0XHQvLyBGSU5BTExZISBXZSBhcmUgcmVhZHkgdG8gZHJhdyB0aGUgaW5pdGlhbCBzY2VuZS5cblx0XHR0aGlzLnNldENvbnRleHQodGhpcy5pbml0aWFsQ2ZnKTtcblxuXHQgICAgfSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjaGVja1RpbWVzdGFtcCAoKSB7XG4gICAgICAgIGxldCB0U3RvcmUgPSBuZXcgS2V5U3RvcmUoJ3RpbWVzdGFtcCcpO1xuXHRyZXR1cm4gZDN0c3YoJy4vZGF0YS9nZW5vbWVkYXRhL1RJTUVTVEFNUC50c3YnKS50aGVuKCB0cyA9PiB7XG5cdCAgICBsZXQgbmV3VGltZVN0YW1wID0gIG5ldyBEYXRlKERhdGUucGFyc2UodHNbMF0uVElNRVNUQU1QKSk7XG5cdCAgICByZXR1cm4gdFN0b3JlLmdldCgnVElNRVNUQU1QJykudGhlbiggb2xkVGltZVN0YW1wID0+IHtcblx0ICAgICAgICBpZiAoIW9sZFRpbWVTdGFtcCB8fCBuZXdUaW1lU3RhbXAgPiBvbGRUaW1lU3RhbXApIHtcblx0XHQgICAgdFN0b3JlLnB1dCgnVElNRVNUQU1QJyxuZXdUaW1lU3RhbXApO1xuXHRcdCAgICByZXR1cm4gdGhpcy5jbGVhckNhY2hlZERhdGEoKTtcblx0XHR9XG5cdCAgICB9KVxuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gXG4gICAgaW5pdERvbSAoKSB7XG5cdHNlbGYgPSB0aGlzO1xuXHR0aGlzLnJvb3QgPSBkMy5zZWxlY3QoJyNtZ3YnKTtcblx0Ly9cblx0Ly8gVE9ETzogcmVmYWN0b3IgcGFnZWJveCwgZHJhZ2dhYmxlLCBhbmQgZnJpZW5kcyBpbnRvIGEgZnJhbWV3b3JrIG1vZHVsZSxcblx0Ly8gXG5cdHRoaXMucGJEcmFnZ2VyID0gdGhpcy5nZXRDb250ZW50RHJhZ2dlcigpO1xuXHQvLyBBZGQgYnVzeSBpY29uLCBjdXJyZW50bHkgaW52aXNpYmUuXG5cdGQzLnNlbGVjdEFsbCgnLnBhZ2Vib3gnKVxuXHQgICAgLmFwcGVuZCgnaScpXG5cdFx0LmF0dHIoJ2NsYXNzJywnbWF0ZXJpYWwtaWNvbnMgYnVzeSByb3RhdGluZycpXG5cdCAgICA7XG5cdC8vXG5cdC8vIElmIGEgcGFnZWJveCBoYXMgdGl0bGUgdGV4dCwgYXBwZW5kIGEgaGVscCBpY29uIHRvIHRoZSBsYWJlbCBhbmQgbW92ZSB0aGUgdGV4dCB0aGVyZVxuXHRkMy5zZWxlY3RBbGwoJy5wYWdlYm94W3RpdGxlXScpXG5cdCAgICAuYXBwZW5kKCdpJylcblx0ICAgICAgICAuYXR0cignY2xhc3MnLCAnbWF0ZXJpYWwtaWNvbnMgYnV0dG9uIGhlbHAnKVxuXHQgICAgICAgIC5hdHRyKCd0aXRsZScsIGZ1bmN0aW9uKCl7XG5cdFx0ICAgIGxldCBwID0gZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSk7XG5cdFx0ICAgIGxldCB0ID0gcC5hdHRyKCd0aXRsZScpO1xuXHRcdCAgICBwLmF0dHIoJ3RpdGxlJywgbnVsbCk7XG5cdFx0ICAgIHJldHVybiB0O1xuXHRcdH0pXG5cdFx0Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdCAgICBzZWxmLnNob3dTdGF0dXMoZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ3RpdGxlJyksIGQzLmV2ZW50LmNsaWVudFgsIGQzLmV2ZW50LmNsaWVudFkpO1xuXHRcdH0pXG5cdFx0O1xuXHQvLyBcblx0Ly8gQWRkIG9wZW4vY2xvc2UgYnV0dG9uIHRvIGNsb3NhYmxlcyBhbmQgd2lyZSB0aGVtIHVwLlxuXHRkMy5zZWxlY3RBbGwoJy5jbG9zYWJsZScpXG5cdCAgICAuYXBwZW5kKCdpJylcblx0XHQuYXR0cignY2xhc3MnLCdtYXRlcmlhbC1pY29ucyBidXR0b24gY2xvc2UnKVxuXHRcdC5hdHRyKCd0aXRsZScsJ0NsaWNrIHRvIG9wZW4vY2xvc2UuJylcblx0XHQub24oJ2NsaWNrLmRlZmF1bHQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0ICAgIGxldCBwID0gZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSk7XG5cdFx0ICAgIHAuY2xhc3NlZCgnY2xvc2VkJywgISBwLmNsYXNzZWQoJ2Nsb3NlZCcpKTtcblx0XHQgICAgZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ3RpdGxlJywnQ2xpY2sgdG8gJyArICAocC5jbGFzc2VkKCdjbG9zZWQnKSA/ICdvcGVuJyA6ICdjbG9zZScpICsgJy4nKVxuXHRcdCAgICBzZWxmLnNldFByZWZzRnJvbVVJKCk7XG5cdFx0fSk7XG5cdC8vXG5cdC8vIFNldCB1cCBkcmFnZ2FibGVzLlxuXHRkMy5zZWxlY3RBbGwoJy5jb250ZW50LWRyYWdnYWJsZSA+IConKVxuXHQgICAgLmFwcGVuZCgnaScpXG5cdFx0LmF0dHIoJ3RpdGxlJywnRHJhZyB1cC9kb3duIHRvIHJlcG9zaXRpb24uJylcblx0XHQuYXR0cignY2xhc3MnLCdtYXRlcmlhbC1pY29ucyBidXR0b24gZHJhZ2hhbmRsZScpXG5cdFx0Lm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKXtcblx0XHQgICAgLy8gQXR0YWNoIHRoZSBkcmFnIGJlaGF2aW9yIHdoZW4gdGhlIHVzZXIgbW91c2VzIG92ZXIgdGhlIGRyYWcgaGFuZGxlLCBhbmQgcmVtb3ZlIHRoZSBiZWhhdmlvclxuXHRcdCAgICAvLyB3aGVuIHVzZXIgbW91c2VzIG91dC4gV2h5IGRvIGl0IHRoaXMgd2F5PyBCZWNhdXNlIGlmIHRoZSBkcmFnIGJlaGF2aW9yIHN0YXlzIG9uIGFsbCB0aGUgdGltZSxcblx0XHQgICAgLy8gdGhlIHVzZXIgY2Fubm90IHNlbGVjdCBhbnkgdGV4dCB3aXRoaW4gdGhlIGJveC5cblx0XHQgICAgbGV0IHBiID0gdGhpcy5jbG9zZXN0KCcucGFnZWJveCcpO1xuXHRcdCAgICBpZiAoIXBiKSByZXR1cm47XG5cdFx0ICAgIGQzLnNlbGVjdChwYikuY2FsbChzZWxmLnBiRHJhZ2dlcik7XG5cdFx0fSlcblx0XHQub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpe1xuXHRcdCAgICBsZXQgcGIgPSB0aGlzLmNsb3Nlc3QoJy5wYWdlYm94Jyk7XG5cdFx0ICAgIGlmICghcGIpIHJldHVybjtcblx0XHQgICAgZDMuc2VsZWN0KHBiKS5vbignLmRyYWcnLG51bGwpO1xuXHRcdH0pO1xuXG5cdC8vIFxuICAgICAgICBkMy5zZWxlY3QoJyNzdGF0dXNNZXNzYWdlJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB7IHRoaXMuc2hvd1N0YXR1cyhmYWxzZSk7IH0pO1xuXHRcblx0Ly9cblx0Ly8gQnV0dG9uOiBHZWFyIGljb24gdG8gc2hvdy9oaWRlIGxlZnQgY29sdW1uXG5cdGQzLnNlbGVjdChcIiNoZWFkZXIgPiAuZ2Vhci5idXR0b25cIilcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgbGMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImxlZnRjb2x1bW5cIl0nKTtcblx0XHRsYy5jbGFzc2VkKFwiY2xvc2VkXCIsICgpID0+ICEgbGMuY2xhc3NlZChcImNsb3NlZFwiKSk7XG5cdFx0d2luZG93LnNldFRpbWVvdXQoKCk9Pntcblx0XHQgICAgdGhpcy5yZXNpemUoKVxuXHRcdCAgICB0aGlzLnNldENvbnRleHQoe30pO1xuXHRcdCAgICB0aGlzLnNldFByZWZzRnJvbVVJKCk7XG5cdFx0fSwgMjUwKTtcblx0ICAgIH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEb20gaW5pdGlhbGl6dGlvbiB0aGF0IG11c3Qgd2FpdCB1bnRpbCBhZnRlciBnZW5vbWUgbWV0YSBkYXRhIGlzIGxvYWRlZC5cbiAgICBpbml0RG9tUGFydDIgKCkge1xuXHQvL1xuXHRsZXQgY2ZnID0gdGhpcy5zYW5pdGl6ZUNmZyh0aGlzLmluaXRpYWxDZmcpO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0Ly8gaW5pdGlhbGl6ZSB0aGUgcmVmIGFuZCBjb21wIGdlbm9tZSBvcHRpb24gbGlzdHNcblx0aW5pdE9wdExpc3QoXCIjcmVmR2Vub21lXCIsICAgdGhpcy5hbGxHZW5vbWVzLCBnPT5nLm5hbWUsIGc9PmcubGFiZWwsIGZhbHNlLCBnID0+IGcgPT09IGNmZy5yZWYpO1xuXHRpbml0T3B0TGlzdChcIiNjb21wR2Vub21lc1wiLCB0aGlzLmFsbEdlbm9tZXMsIGc9PmcubmFtZSwgZz0+Zy5sYWJlbCwgdHJ1ZSwgIGcgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihnKSAhPT0gLTEpO1xuXHRkMy5zZWxlY3QoXCIjcmVmR2Vub21lXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuXHQgICAgc2VsZi5zZXRDb250ZXh0KHsgcmVmOiB0aGlzLnZhbHVlIH0pO1xuXHR9KTtcblx0ZDMuc2VsZWN0KFwiI2NvbXBHZW5vbWVzXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuXHQgICAgbGV0IHNlbGVjdGVkTmFtZXMgPSBbXTtcblx0ICAgIGZvcihsZXQgeCBvZiB0aGlzLnNlbGVjdGVkT3B0aW9ucyl7XG5cdFx0c2VsZWN0ZWROYW1lcy5wdXNoKHgudmFsdWUpO1xuXHQgICAgfVxuXHQgICAgLy8gd2FudCB0byBwcmVzZXJ2ZSBjdXJyZW50IGdlbm9tZSBvcmRlciBhcyBtdWNoIGFzIHBvc3NpYmxlIFxuXHQgICAgbGV0IGdOYW1lcyA9IHNlbGYudkdlbm9tZXMubWFwKGc9PmcubmFtZSlcblx0XHQuZmlsdGVyKG4gPT4ge1xuXHRcdCAgICByZXR1cm4gc2VsZWN0ZWROYW1lcy5pbmRleE9mKG4pID49IDAgfHwgbiA9PT0gc2VsZi5yR2Vub21lLm5hbWU7XG5cdFx0fSk7XG5cdCAgICBnTmFtZXMgPSBnTmFtZXMuY29uY2F0KHNlbGVjdGVkTmFtZXMuZmlsdGVyKG4gPT4gZ05hbWVzLmluZGV4T2YobikgPT09IC0xKSk7XG5cdCAgICBzZWxmLnNldENvbnRleHQoeyBnZW5vbWVzOiBnTmFtZXMgfSk7XG5cdH0pO1xuXHRkM3RzdihcIi4vZGF0YS9nZW5vbWVkYXRhL2dlbm9tZVNldHMudHN2XCIpLnRoZW4oc2V0cyA9PiB7XG5cdCAgICAvLyBDcmVhdGUgc2VsZWN0aW9uIGJ1dHRvbnMuXG5cdCAgICBzZXRzLmZvckVhY2goIHMgPT4gcy5nZW5vbWVzID0gcy5nZW5vbWVzLnNwbGl0KFwiLFwiKSApO1xuXHQgICAgbGV0IGNnYiA9IGQzLnNlbGVjdCgnI2NvbXBHZW5vbWVzQm94Jykuc2VsZWN0QWxsKCdidXR0b24nKS5kYXRhKHNldHMpO1xuXHQgICAgY2diLmVudGVyKCkuYXBwZW5kKCdidXR0b24nKVxuXHRcdC50ZXh0KGQ9PmQubmFtZSlcblx0XHQuYXR0cigndGl0bGUnLCBkPT5kLmRlc2NyaXB0aW9uKVxuXHRcdC5vbignY2xpY2snLCBkID0+IHtcblx0XHQgICAgc2VsZi5zZXRDb250ZXh0KGQpO1xuXHRcdH0pXG5cdFx0O1xuXHR9KS5jYXRjaCgoKT0+e1xuXHQgICAgY29uc29sZS5sb2coXCJObyBnZW5vbWVTZXRzIGZpbGUgZm91bmQuXCIpO1xuXHR9KTsgLy8gT0sgaWYgbm8gZ2Vub21lU2V0cyBmaWxlXG5cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcHJvY2Vzc0Nocm9tb3NvbWVzIChkYXRhKSB7XG5cdC8vIGRhdGEgaXMgYSBsaXN0IG9mIGNocm9tb3NvbWUgbGlzdHMsIG9uZSBwZXIgZ2Vub21lXG5cdC8vIEZpbGwgaW4gdGhlIGdlbm9tZUNocnMgbWFwIChnZW5vbWUgLT4gY2hyIGxpc3QpXG5cdHRoaXMuYWxsR2Vub21lcy5mb3JFYWNoKChnLGkpID0+IHtcblx0ICAgIC8vIG5pY2VseSBzb3J0IHRoZSBjaHJvbW9zb21lc1xuXHQgICAgbGV0IGNocnMgPSBkYXRhW2ldO1xuXHQgICAgZy5tYXhsZW4gPSAwO1xuXHQgICAgY2hycy5mb3JFYWNoKCBjID0+IHtcblx0XHQvL1xuXHRcdGMubGVuZ3RoID0gcGFyc2VJbnQoYy5sZW5ndGgpXG5cdFx0Zy5tYXhsZW4gPSBNYXRoLm1heChnLm1heGxlbiwgYy5sZW5ndGgpO1xuXHRcdC8vIGJlY2F1c2UgSSdkIHJhdGhlciBzYXkgXCJjaHJvbW9zb21lLm5hbWVcIiB0aGFuIFwiY2hyb21vc29tZS5jaHJvbW9zb21lXCJcblx0XHRjLm5hbWUgPSBjLmNocm9tb3NvbWU7XG5cdFx0ZGVsZXRlIGMuY2hyb21vc29tZTtcblx0ICAgIH0pO1xuXHQgICAgLy8gbmljZWx5IHNvcnQgdGhlIGNocm9tb3NvbWVzXG5cdCAgICBjaHJzLnNvcnQoKGEsYikgPT4ge1xuXHRcdGxldCBhYSA9IHBhcnNlSW50KGEubmFtZSkgLSBwYXJzZUludChiLm5hbWUpO1xuXHRcdGlmICghaXNOYU4oYWEpKSByZXR1cm4gYWE7XG5cdFx0cmV0dXJuIGEubmFtZSA8IGIubmFtZSA/IC0xIDogYS5uYW1lID4gYi5uYW1lID8gKzEgOiAwO1xuXHQgICAgfSk7XG5cdCAgICBnLmNocm9tb3NvbWVzID0gY2hycztcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldENvbnRlbnREcmFnZ2VyICgpIHtcbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIC8vIEhlbHBlciBmdW5jdGlvbiBmb3IgdGhlIGRyYWcgYmVoYXZpb3IuIFJlb3JkZXJzIHRoZSBjb250ZW50cyBiYXNlZCBvblxuICAgICAgLy8gY3VycmVudCBzY3JlZW4gcG9zaXRpb24gb2YgdGhlIGRyYWdnZWQgaXRlbS5cbiAgICAgIGZ1bmN0aW9uIHJlb3JkZXJCeURvbSgpIHtcblx0ICAvLyBMb2NhdGUgdGhlIHNpYiB3aG9zZSBwb3NpdGlvbiBpcyBiZXlvbmQgdGhlIGRyYWdnZWQgaXRlbSBieSB0aGUgbGVhc3QgYW1vdW50XG5cdCAgbGV0IGRyID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICBsZXQgYlNpYiA9IG51bGw7XG5cdCAgbGV0IHh5ID0gZDMuc2VsZWN0KHNlbGYuZHJhZ1BhcmVudCkuY2xhc3NlZChcImZsZXhyb3dcIikgPyBcInhcIiA6IFwieVwiO1xuXHQgIGZvciAobGV0IHMgb2Ygc2VsZi5kcmFnU2licykge1xuXHQgICAgICBsZXQgc3IgPSBzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICBpZiAoZHJbeHldIDwgc3JbeHldKSB7XG5cdFx0ICAgbGV0IGRpc3QgPSBzclt4eV0gLSBkclt4eV07XG5cdFx0ICAgaWYgKCFiU2liIHx8IGRpc3QgPCBiU2liW3h5XSAtIGRyW3h5XSlcblx0XHQgICAgICAgYlNpYiA9IHM7XG5cdCAgICAgIH1cblx0ICB9XG5cdCAgLy8gSW5zZXJ0IHRoZSBkcmFnZ2VkIGl0ZW0gYmVmb3JlIHRoZSBsb2NhdGVkIHNpYiAob3IgYXBwZW5kIGlmIG5vIHNpYiBmb3VuZClcblx0ICBzZWxmLmRyYWdQYXJlbnQuaW5zZXJ0QmVmb3JlKHNlbGYuZHJhZ2dpbmcsIGJTaWIpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gcmVvcmRlckJ5U3R5bGUoKSB7XG5cdCAgbGV0IGRkID0gZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpO1xuXHQgIC8vIExvY2F0ZSB0aGUgc2liIHRoYXQgY29udGFpbnMgdGhlIGRyYWdnZWQgaXRlbSdzIG9yaWdpbi5cblx0ICBsZXQgZHIgPSBzZWxmLmRyYWdnaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIGxldCBiU2liID0gbnVsbDtcblx0ICBsZXQgeHkgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnUGFyZW50KS5jbGFzc2VkKFwiZmxleHJvd1wiKSA/IFwieFwiIDogXCJ5XCI7XG5cdCAgbGV0IHN6ID0geHkgPT09IFwieFwiID8gXCJ3aWR0aFwiIDogXCJoZWlnaHRcIjtcblx0ICBsZXQgc3R5PSB4eSA9PT0gXCJ4XCIgPyBcImxlZnRcIiA6IFwidG9wXCI7XG5cdCAgZm9yIChsZXQgcyBvZiBzZWxmLmRyYWdTaWJzKSB7XG5cdCAgICAgIC8vIHNraXAgdGhlIGRyYWdnZWQgaXRlbVxuXHQgICAgICBpZiAocyA9PT0gc2VsZi5kcmFnZ2luZykgY29udGludWU7XG5cdCAgICAgIGxldCBkcyA9IGQzLnNlbGVjdChzKTtcblx0ICAgICAgbGV0IHNyID0gcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgLy8gaWZ3IHRoZSBkcmFnZ2VkIGl0ZW0ncyBvcmlnaW4gaXMgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCBvZiBzaWIsIHdlIGZvdW5kIGl0LlxuXHQgICAgICBpZiAoZHJbeHldID49IHNyW3h5XSAmJiBkclt4eV0gPD0gKHNyW3h5XSArIHNyW3N6XSkpIHtcblx0XHQgICAvLyBtb3ZlIHNpYiB0b3dhcmQgdGhlIGhvbGUsIGFtb3VudCA9IHRoZSBzaXplIG9mIHRoZSBob2xlXG5cdFx0ICAgbGV0IGFtdCA9IHNlbGYuZHJhZ0hvbGVbc3pdICogKHNlbGYuZHJhZ0hvbGVbeHldIDwgc3JbeHldID8gLTEgOiAxKTtcblx0XHQgICBkcy5zdHlsZShzdHksIHBhcnNlSW50KGRzLnN0eWxlKHN0eSkpICsgYW10ICsgXCJweFwiKTtcblx0XHQgICBzZWxmLmRyYWdIb2xlW3h5XSAtPSBhbXQ7XG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgIH1cblx0ICB9XG4gICAgICB9XG4gICAgICAvL1xuICAgICAgcmV0dXJuIGQzLmJlaGF2aW9yLmRyYWcoKVxuXHQgIC5vcmlnaW4oZnVuY3Rpb24oZCxpKXtcblx0ICAgICAgcmV0dXJuIHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgfSlcbiAgICAgICAgICAub24oXCJkcmFnc3RhcnQubVwiLCBmdW5jdGlvbigpIHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC5zb3VyY2VFdmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICghIGQzLnNlbGVjdCh0KS5jbGFzc2VkKFwiZHJhZ2hhbmRsZVwiKSkgcmV0dXJuO1xuXHQgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgLy9cblx0ICAgICAgc2VsZi5kcmFnZ2luZyAgICA9IHRoaXMuY2xvc2VzdChcIi5wYWdlYm94XCIpO1xuXHQgICAgICBzZWxmLmRyYWdIb2xlICAgID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgc2VsZi5kcmFnUGFyZW50ICA9IHNlbGYuZHJhZ2dpbmcucGFyZW50Tm9kZTtcblx0ICAgICAgc2VsZi5kcmFnU2licyAgICA9IHNlbGYuZHJhZ1BhcmVudC5jaGlsZHJlbjtcblx0ICAgICAgLy9cblx0ICAgICAgZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCB0cnVlKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWcubVwiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICBsZXQgZGQgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZyk7XG5cdCAgICAgIGxldCB0cCA9IHBhcnNlSW50KGRkLnN0eWxlKFwidG9wXCIpKVxuXHQgICAgICBkZC5zdHlsZShcInRvcFwiLCB0cCArIGQzLmV2ZW50LmR5ICsgXCJweFwiKTtcblx0ICAgICAgLy9yZW9yZGVyQnlTdHlsZSgpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZ2VuZC5tXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIHJlb3JkZXJCeURvbSgpO1xuXHQgICAgICBzZWxmLnNldFByZWZzRnJvbVVJKCk7XG5cdCAgICAgIGxldCBkZCA9IGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKTtcblx0ICAgICAgZGQuc3R5bGUoXCJ0b3BcIiwgXCIwcHhcIik7XG5cdCAgICAgIGRkLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCBmYWxzZSk7XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgICAgPSBudWxsO1xuXHQgICAgICBzZWxmLmRyYWdIb2xlICAgID0gbnVsbDtcblx0ICAgICAgc2VsZi5kcmFnUGFyZW50ICA9IG51bGw7XG5cdCAgICAgIHNlbGYuZHJhZ1NpYnMgICAgPSBudWxsO1xuXHQgIH0pXG5cdCAgO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRVSUZyb21QcmVmcyAoKSB7XG5cdHRoaXMudXNlclByZWZzU3RvcmUuZ2V0KFwicHJlZnNcIikudGhlbiggcHJlZnMgPT4ge1xuXHQgICAgcHJlZnMgPSBwcmVmcyB8fCB7fTtcblx0ICAgIGNvbnNvbGUubG9nKFwiR290IHByZWZzIGZyb20gc3RvcmFnZVwiLCBwcmVmcyk7XG5cblx0ICAgIC8vIHNldCBvcGVuL2Nsb3NlZCBzdGF0ZXNcblx0ICAgIChwcmVmcy5jbG9zYWJsZXMgfHwgW10pLmZvckVhY2goIGMgPT4ge1xuXHRcdGxldCBpZCA9IGNbMF07XG5cdFx0bGV0IHN0YXRlID0gY1sxXTtcblx0XHRkMy5zZWxlY3QoJyMnK2lkKS5jbGFzc2VkKCdjbG9zZWQnLCBzdGF0ZSA9PT0gXCJjbG9zZWRcIiB8fCBudWxsKTtcblx0ICAgIH0pO1xuXG5cdCAgICAvLyBzZXQgZHJhZ2dhYmxlcycgb3JkZXJcblx0ICAgIChwcmVmcy5kcmFnZ2FibGVzIHx8IFtdKS5mb3JFYWNoKCBkID0+IHtcblx0XHRsZXQgY3RySWQgPSBkWzBdO1xuXHRcdGxldCBjb250ZW50SWRzID0gZFsxXTtcblx0XHRsZXQgY3RyID0gZDMuc2VsZWN0KCcjJytjdHJJZCk7XG5cdFx0bGV0IGNvbnRlbnRzID0gY3RyLnNlbGVjdEFsbCgnIycrY3RySWQrJyA+IConKTtcblx0XHRjb250ZW50c1swXS5zb3J0KCAoYSxiKSA9PiB7XG5cdFx0ICAgIGxldCBhaSA9IGNvbnRlbnRJZHMuaW5kZXhPZihhLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG5cdFx0ICAgIGxldCBiaSA9IGNvbnRlbnRJZHMuaW5kZXhPZihiLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG5cdFx0ICAgIHJldHVybiBhaSAtIGJpO1xuXHRcdH0pO1xuXHRcdGNvbnRlbnRzLm9yZGVyKCk7XG5cdCAgICB9KTtcblx0fSk7XG4gICAgfVxuICAgIHNldFByZWZzRnJvbVVJICgpIHtcbiAgICAgICAgLy8gc2F2ZSBvcGVuL2Nsb3NlZCBzdGF0ZXNcblx0bGV0IGNsb3NhYmxlcyA9IHRoaXMucm9vdC5zZWxlY3RBbGwoJy5jbG9zYWJsZScpO1xuXHRsZXQgb2NEYXRhID0gY2xvc2FibGVzWzBdLm1hcCggYyA9PiB7XG5cdCAgICBsZXQgZGMgPSBkMy5zZWxlY3QoYyk7XG5cdCAgICByZXR1cm4gW2RjLmF0dHIoJ2lkJyksIGRjLmNsYXNzZWQoXCJjbG9zZWRcIikgPyBcImNsb3NlZFwiIDogXCJvcGVuXCJdO1xuXHR9KTtcblx0Ly8gc2F2ZSBkcmFnZ2FibGVzJyBvcmRlclxuXHRsZXQgZHJhZ0N0cnMgPSB0aGlzLnJvb3Quc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUnKTtcblx0bGV0IGRyYWdnYWJsZXMgPSBkcmFnQ3Rycy5zZWxlY3RBbGwoJy5jb250ZW50LWRyYWdnYWJsZSA+IConKTtcblx0bGV0IGRkRGF0YSA9IGRyYWdnYWJsZXMubWFwKCAoZCxpKSA9PiB7XG5cdCAgICBsZXQgY3RyID0gZDMuc2VsZWN0KGRyYWdDdHJzWzBdW2ldKTtcblx0ICAgIHJldHVybiBbY3RyLmF0dHIoJ2lkJyksIGQubWFwKCBkZCA9PiBkMy5zZWxlY3QoZGQpLmF0dHIoJ2lkJykpXTtcblx0fSk7XG5cdGxldCBwcmVmcyA9IHtcblx0ICAgIGNsb3NhYmxlczogb2NEYXRhLFxuXHQgICAgZHJhZ2dhYmxlczogZGREYXRhXG5cdH1cblx0Y29uc29sZS5sb2coXCJTYXZpbmcgcHJlZnMgdG8gc3RvcmFnZVwiLCBwcmVmcyk7XG5cdHRoaXMudXNlclByZWZzU3RvcmUuc2V0KFwicHJlZnNcIiwgcHJlZnMpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93QmxvY2tzIChjb21wKSB7XG5cdGxldCByZWYgPSB0aGlzLnJHZW5vbWU7XG5cdGlmICghIGNvbXApIGNvbXAgPSB0aGlzLmNHZW5vbWVzWzBdO1xuXHRpZiAoISBjb21wKSByZXR1cm47XG5cdHRoaXMudHJhbnNsYXRvci5yZWFkeSgpLnRoZW4oICgpID0+IHtcblx0ICAgIGxldCBibG9ja3MgPSBjb21wID09PSByZWYgPyBbXSA6IHRoaXMudHJhbnNsYXRvci5nZXRCbG9ja3MocmVmLCBjb21wKTtcblx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3QmxvY2tzKHsgcmVmLCBjb21wLCBibG9ja3MgfSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93QnVzeSAoaXNCdXN5LCBtZXNzYWdlKSB7XG4gICAgICAgIGQzLnNlbGVjdChcIiNoZWFkZXIgPiAuZ2Vhci5idXR0b25cIilcblx0ICAgIC5jbGFzc2VkKFwicm90YXRpbmdcIiwgaXNCdXN5KTtcbiAgICAgICAgZDMuc2VsZWN0KFwiI3pvb21WaWV3XCIpLmNsYXNzZWQoXCJidXN5XCIsIGlzQnVzeSk7XG5cdGlmIChpc0J1c3kgJiYgbWVzc2FnZSkgdGhpcy5zaG93U3RhdHVzKG1lc3NhZ2UpO1xuXHRpZiAoIWlzQnVzeSkgdGhpcy5zaG93U3RhdHVzKCcnKVxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93aW5nU3RhdHVzICgpIHtcbiAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCgnI3N0YXR1c01lc3NhZ2UnKS5jbGFzc2VkKCdzaG93aW5nJyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd1N0YXR1cyAobXNnLCBuZWFyWCwgbmVhclkpIHtcblx0bGV0IGJiID0gdGhpcy5yb290Lm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0bGV0IF8gPSAobiwgbGVuLCBubWF4KSA9PiB7XG5cdCAgICBpZiAobiA9PT0gdW5kZWZpbmVkKVxuXHQgICAgICAgIHJldHVybiAnNTAlJztcblx0ICAgIGVsc2UgaWYgKHR5cGVvZihuKSA9PT0gJ3N0cmluZycpXG5cdCAgICAgICAgcmV0dXJuIG47XG5cdCAgICBlbHNlIGlmICggbiArIGxlbiA8IG5tYXggKSB7XG5cdCAgICAgICAgcmV0dXJuIG4gKyAncHgnO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgcmV0dXJuIChubWF4IC0gbGVuKSArICdweCc7XG5cdCAgICB9XG5cdH07XG5cdG5lYXJYID0gXyhuZWFyWCwgMjUwLCBiYi53aWR0aCk7XG5cdG5lYXJZID0gXyhuZWFyWSwgMTUwLCBiYi5oZWlnaHQpO1xuXHRpZiAobXNnKVxuXHQgICAgZDMuc2VsZWN0KCcjc3RhdHVzTWVzc2FnZScpXG5cdFx0LmNsYXNzZWQoJ3Nob3dpbmcnLCB0cnVlKVxuXHRcdC5zdHlsZSgnbGVmdCcsIG5lYXJYKVxuXHRcdC5zdHlsZSgndG9wJywgIG5lYXJZKVxuXHRcdC5zZWxlY3QoJ3NwYW4nKVxuXHRcdCAgICAudGV4dChtc2cpO1xuXHRlbHNlXG5cdCAgICBkMy5zZWxlY3QoJyNzdGF0dXNNZXNzYWdlJykuY2xhc3NlZCgnc2hvd2luZycsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRSZWZHZW5vbWVTZWxlY3Rpb24gKCkge1xuXHRkMy5zZWxlY3RBbGwoXCIjcmVmR2Vub21lIG9wdGlvblwiKVxuXHQgICAgLnByb3BlcnR5KFwic2VsZWN0ZWRcIiwgIGdnID0+IChnZy5sYWJlbCA9PT0gdGhpcy5yR2Vub21lLmxhYmVsICB8fCBudWxsKSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldENvbXBHZW5vbWVzU2VsZWN0aW9uICgpIHtcblx0bGV0IGNnbnMgPSB0aGlzLnZHZW5vbWVzLm1hcChnPT5nLmxhYmVsKTtcblx0ZDMuc2VsZWN0QWxsKFwiI2NvbXBHZW5vbWVzIG9wdGlvblwiKVxuXHQgICAgICAgIC5wcm9wZXJ0eShcInNlbGVjdGVkXCIsICBnZyA9PiBjZ25zLmluZGV4T2YoZ2cubGFiZWwpID49IDApO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTZXRzIG9yIHJldHVybnNcbiAgICBzZXRIaWdobGlnaHQgKGZsaXN0KSB7XG5cdGlmICghZmxpc3QpIHJldHVybiBmYWxzZTtcblx0dGhpcy56b29tVmlldy5oaUZlYXRzID0gZmxpc3QucmVkdWNlKChhLHYpID0+IHsgYVt2XT12OyByZXR1cm4gYTsgfSwge30pO1xuXHRyZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgY3VycmVudCBjb250ZXh0IGFzIGFuIG9iamVjdC5cbiAgICAvLyBDdXJyZW50IGNvbnRleHQgPSByZWYgZ2Vub21lICsgY29tcCBnZW5vbWVzICsgY3VycmVudCByYW5nZSAoY2hyLHN0YXJ0LGVuZClcbiAgICBnZXRDb250ZXh0ICgpIHtcblx0aWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKSB7XG5cdCAgICBsZXQgYyA9IHRoaXMuY29vcmRzO1xuXHQgICAgcmV0dXJuIHtcblx0XHRyZWYgOiB0aGlzLnJHZW5vbWUubGFiZWwsXG5cdFx0Z2Vub21lczogdGhpcy52R2Vub21lcy5tYXAoZz0+Zy5sYWJlbCksXG5cdFx0Y2hyOiBjLmNocixcblx0XHRzdGFydDogYy5zdGFydCxcblx0XHRlbmQ6IGMuZW5kLFxuXHRcdGhpZ2hsaWdodDogT2JqZWN0LmtleXModGhpcy56b29tVmlldy5oaUZlYXRzKS5zb3J0KCksXG5cdFx0ZG1vZGU6IHRoaXMuem9vbVZpZXcuZG1vZGVcblx0ICAgIH1cblx0fSBlbHNlIHtcblx0ICAgIGxldCBjID0gdGhpcy5sY29vcmRzO1xuXHQgICAgcmV0dXJuIHtcblx0XHRyZWYgOiB0aGlzLnJHZW5vbWUubGFiZWwsXG5cdFx0Z2Vub21lczogdGhpcy52R2Vub21lcy5tYXAoZz0+Zy5sYWJlbCksXG5cdFx0bGFuZG1hcms6IGMubGFuZG1hcmssXG5cdFx0Zmxhbms6IGMuZmxhbmssXG5cdFx0bGVuZ3RoOiBjLmxlbmd0aCxcblx0XHRkZWx0YTogYy5kZWx0YSxcblx0XHRoaWdobGlnaHQ6IE9iamVjdC5rZXlzKHRoaXMuem9vbVZpZXcuaGlGZWF0cykuc29ydCgpLFxuXHRcdGRtb2RlOiB0aGlzLnpvb21WaWV3LmRtb2RlXG5cdCAgICB9XG5cdH1cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmVzb2x2ZXMgdGhlIHNwZWNpZmllZCBsYW5kbWFyayB0byBhIGZlYXR1cmUgYW5kIHRoZSBsaXN0IG9mIGVxdWl2YWxlbnQgZmVhdXJlcy5cbiAgICAvLyBNYXkgYmUgZ2l2ZW4gYW4gaWQsIGNhbm9uaWNhbCBpZCwgb3Igc3ltYm9sLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIGNmZyAob2JqKSBTYW5pdGl6ZWQgY29uZmlnIG9iamVjdCwgd2l0aCBhIGxhbmRtYXJrIChzdHJpbmcpIGZpZWxkLlxuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgIFRoZSBjZmcgb2JqZWN0LCB3aXRoIGFkZGl0aW9uYWwgZmllbGRzOlxuICAgIC8vICAgICAgICBsYW5kbWFya1JlZkZlYXQ6IHRoZSBsYW5kbWFyayAoRmVhdHVyZSBvYmopIGluIHRoZSByZWYgZ2Vub21lXG4gICAgLy8gICAgICAgIGxhbmRtYXJrRmVhdHM6IFsgZXF1aXZhbGVudCBmZWF0dXJlcyBpbiBlYWNoIGdlbm9tZSAoaW5jbHVkZXMgcmYpXVxuICAgIC8vICAgICBBbHNvLCBjaGFuZ2VzIHJlZiB0byBiZSB0aGUgZ2Vub21lIG9mIHRoZSBsYW5kbWFya1JlZkZlYXRcbiAgICAvLyAgICAgUmV0dXJucyBudWxsIGlmIGxhbmRtYXJrIG5vdCBmb3VuZCBpbiBhbnkgZ2Vub21lLlxuICAgIC8vIFxuICAgIHJlc29sdmVMYW5kbWFyayAoY2ZnKSB7XG5cdGxldCByZiwgZmVhdHM7XG5cdC8vIEZpbmQgdGhlIGxhbmRtYXJrIGZlYXR1cmUgaW4gdGhlIHJlZiBnZW5vbWUuIFxuXHRyZiA9IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsKGNmZy5sYW5kbWFyaywgY2ZnLnJlZilbMF07XG5cdGlmICghcmYpIHtcblx0ICAgIC8vIExhbmRtYXJrIGRvZXMgbm90IGV4aXN0IGluIHJlZiBnZW5vbWUuIERvZXMgaXQgZXhpc3QgaW4gYW55IHNwZWNpZmllZCBnZW5vbWU/XG5cdCAgICByZiA9IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsKGNmZy5sYW5kbWFyaykuZmlsdGVyKGYgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihmLmdlbm9tZSkgPj0gMClbMF07XG5cdCAgICBpZiAocmYpIHtcblx0ICAgICAgICBjZmcucmVmID0gcmYuZ2Vub21lO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgLy8gTGFuZG1hcmsgY2Fubm90IGJlIHJlc29sdmVkLlxuXHRcdHJldHVybiBudWxsO1xuXHQgICAgfVxuXHR9XG5cdC8vIGxhbmRtYXJrIGV4aXN0cyBpbiByZWYgZ2Vub21lLiBHZXQgZXF1aXZhbGVudCBmZWF0IGluIGVhY2ggZ2Vub21lLlxuXHRmZWF0cyA9IHJmLmNhbm9uaWNhbCA/IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkKHJmLmNhbm9uaWNhbCkgOiBbcmZdO1xuXHRjZmcubGFuZG1hcmtSZWZGZWF0ID0gcmY7XG5cdGNmZy5sYW5kbWFya0ZlYXRzID0gZmVhdHMuZmlsdGVyKGYgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihmLmdlbm9tZSkgPj0gMCk7XG5cdHJldHVybiBjZmc7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBzYW5pdGl6ZWQgdmVyc2lvbiBvZiB0aGUgYXJndW1lbnQgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAgLy8gVGhlIHNhbml0aXplZCB2ZXJzaW9uOlxuICAgIC8vICAgICAtIGhhcyBhIHNldHRpbmcgZm9yIGV2ZXJ5IHBhcmFtZXRlci4gUGFyYW1ldGVycyBub3Qgc3BlY2lmaWVkIGluIFxuICAgIC8vICAgICAgIHRoZSBhcmd1bWVudCBhcmUgKGdlbmVyYWxseSkgZmlsbGVkIGluIHdpdGggdGhlaXIgY3VycmVudCB2YWx1ZXMuXG4gICAgLy8gICAgIC0gaXMgYWx3YXlzIHZhbGlkLCBlZ1xuICAgIC8vICAgICBcdC0gaGFzIGEgbGlzdCBvZiAxIG9yIG1vcmUgdmFsaWQgZ2Vub21lcywgd2l0aCBvbmUgb2YgdGhlbSBkZXNpZ25hdGVkIGFzIHRoZSByZWZcbiAgICAvLyAgICAgXHQtIGhhcyBhIHZhbGlkIGNvb3JkaW5hdGUgcmFuZ2VcbiAgICAvLyAgICAgXHQgICAgLSBzdGFydCBhbmQgZW5kIGFyZSBpbnRlZ2VycyB3aXRoIHN0YXJ0IDw9IGVuZFxuICAgIC8vICAgICBcdCAgICAtIHZhbGlkIGNocm9tb3NvbWUgZm9yIHJlZiBnZW5vbWVcbiAgICAvL1xuICAgIC8vIFRoZSBzYW5pdGl6ZWQgdmVyc2lvbiBpcyBhbHNvIFwiY29tcGlsZWRcIjpcbiAgICAvLyAgICAgLSBpdCBoYXMgYWN0dWFsIEdlbm9tZSBvYmplY3RzLCB3aGVyZSB0aGUgYXJndW1lbnQganVzdCBoYXMgbmFtZXNcbiAgICAvLyAgICAgLSBncm91cHMgdGhlIGNocitzdGFydCtlbmQgaW4gXCJjb29yZHNcIiBvYmplY3RcbiAgICAvL1xuICAgIC8vXG4gICAgc2FuaXRpemVDZmcgKGMpIHtcblx0bGV0IGNmZyA9IHt9O1xuXG5cdC8vIFNhbml0aXplIHRoZSBpbnB1dC5cblxuXHQvLyB3aW5kb3cgc2l6ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRpZiAoYy53aWR0aCkge1xuXHQgICAgY2ZnLndpZHRoID0gYy53aWR0aFxuXHR9XG5cblx0Ly8gcmVmIGdlbm9tZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0Ly8gU2V0IGNmZy5yZWYgdG8gc3BlY2lmaWVkIGdlbm9tZSwgXG5cdC8vICAgd2l0aCBmYWxsYmFjayB0byBjdXJyZW50IHJlZiBnZW5vbWUsIFxuXHQvLyAgICAgIHdpdGggZmFsbGJhY2sgdG8gQzU3QkwvNkogKDFzdCB0aW1lIHRocnUpXG5cdC8vIEZJWE1FOiBmaW5hbCBmYWxsYmFjayBzaG91bGQgYmUgYSBjb25maWcgc2V0dGluZy5cblx0Y2ZnLnJlZiA9IChjLnJlZiA/IHRoaXMubmwyZ2Vub21lW2MucmVmXSB8fCB0aGlzLnJHZW5vbWUgOiB0aGlzLnJHZW5vbWUpIHx8IHRoaXMubmwyZ2Vub21lWydDNTdCTC82SiddO1xuXG5cdC8vIGNvbXBhcmlzb24gZ2Vub21lcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIFNldCBjZmcuZ2Vub21lcyB0byBiZSB0aGUgc3BlY2lmaWVkIGdlbm9tZXMsXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGdlbm9tZXNcblx0Ly8gICAgICAgIHdpdGggZmFsbGJhY2sgdG8gW3JlZl0gKDFzdCB0aW1lIHRocnUpXG5cdGNmZy5nZW5vbWVzID0gYy5nZW5vbWVzID9cblx0ICAgIChjLmdlbm9tZXMubWFwKGcgPT4gdGhpcy5ubDJnZW5vbWVbZ10pLmZpbHRlcih4PT54KSlcblx0ICAgIDpcblx0ICAgIHRoaXMudkdlbm9tZXM7XG5cdC8vIEFkZCByZWYgdG8gZ2Vub21lcyBpZiBub3QgdGhlcmUgYWxyZWFkeVxuXHRpZiAoY2ZnLmdlbm9tZXMuaW5kZXhPZihjZmcucmVmKSA9PT0gLTEpXG5cdCAgICBjZmcuZ2Vub21lcy51bnNoaWZ0KGNmZy5yZWYpO1xuXHRcblx0Ly8gYWJzb2x1dGUgY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0Ly8gU2V0IGNmZy5jaHIgdG8gYmUgdGhlIHNwZWNpZmllZCBjaHJvbW9zb21lXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGNoclxuXHQvLyAgICAgICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIDFzdCBjaHJvbW9zb21lIGluIHRoZSByZWYgZ2Vub21lXG5cdGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoYy5jaHIpO1xuXHRpZiAoIWNmZy5jaHIpIGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoIHRoaXMuY29vcmRzID8gdGhpcy5jb29yZHMuY2hyIDogXCIxXCIgKTtcblx0aWYgKCFjZmcuY2hyKSBjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKDApO1xuXHRpZiAoIWNmZy5jaHIpIHRocm93IFwiTm8gY2hyb21vc29tZS5cIlxuXHRcblx0Ly8gU2V0IGNmZy5zdGFydCB0byBiZSB0aGUgc3BlY2lmaWVkIHN0YXJ0IHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgc3RhcnRcblx0Ly8gQ2xpcCBhdCBjaHIgYm91bmRhcmllc1xuXHRjZmcuc3RhcnQgPSBjbGlwKE1hdGgucm91bmQodHlwZW9mKGMuc3RhcnQpID09PSBcIm51bWJlclwiID8gYy5zdGFydCA6IHRoaXMuY29vcmRzLnN0YXJ0KSwgMSwgY2ZnLmNoci5sZW5ndGgpO1xuXG5cdC8vIFNldCBjZmcuZW5kIHRvIGJlIHRoZSBzcGVjaWZpZWQgZW5kIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgZW5kXG5cdC8vIENsaXAgYXQgY2hyIGJvdW5kYXJpZXNcblx0Y2ZnLmVuZCA9IGNsaXAoTWF0aC5yb3VuZCh0eXBlb2YoYy5lbmQpID09PSBcIm51bWJlclwiID8gYy5lbmQgOiB0aGlzLmNvb3Jkcy5lbmQpLCAxLCBjZmcuY2hyLmxlbmd0aCk7XG5cblx0Ly8gRW5zdXJlIHN0YXJ0IDw9IGVuZFxuXHRpZiAoY2ZnLnN0YXJ0ID4gY2ZnLmVuZCkge1xuXHQgICBsZXQgdG1wID0gY2ZnLnN0YXJ0OyBjZmcuc3RhcnQgPSBjZmcuZW5kOyBjZmcuZW5kID0gdG1wO1xuXHR9XG5cblx0Ly8gbGFuZG1hcmsgY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gTk9URSB0aGF0IGxhbmRtYXJrIGNvb3JkaW5hdGUgY2Fubm90IGJlIGZ1bGx5IHJlc29sdmVkIHRvIGFic29sdXRlIGNvb3JkaW5hdGUgdW50aWxcblx0Ly8gKmFmdGVyKiBnZW5vbWUgZGF0YSBoYXZlIGJlZW4gbG9hZGVkLiBTZWUgc2V0Q29udGV4dCBhbmQgcmVzb2x2ZUxhbmRtYXJrIG1ldGhvZHMuXG5cdGNmZy5sYW5kbWFyayA9IGMubGFuZG1hcmsgfHwgdGhpcy5sY29vcmRzLmxhbmRtYXJrO1xuXHRjZmcuZGVsdGEgICAgPSBNYXRoLnJvdW5kKCdkZWx0YScgaW4gYyA/IGMuZGVsdGEgOiAodGhpcy5sY29vcmRzLmRlbHRhIHx8IDApKTtcblx0aWYgKHR5cGVvZihjLmZsYW5rKSA9PT0gJ251bWJlcicpe1xuXHQgICAgY2ZnLmZsYW5rID0gTWF0aC5yb3VuZChjLmZsYW5rKTtcblx0fVxuXHRlbHNlIGlmICgnbGVuZ3RoJyBpbiBjKSB7XG5cdCAgICBjZmcubGVuZ3RoID0gTWF0aC5yb3VuZChjLmxlbmd0aCk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICBjZmcubGVuZ3RoID0gTWF0aC5yb3VuZCh0aGlzLmNvb3Jkcy5lbmQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDEpO1xuXHR9XG5cblx0Ly8gY21vZGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0aWYgKGMuY21vZGUgJiYgYy5jbW9kZSAhPT0gJ21hcHBlZCcgJiYgYy5jbW9kZSAhPT0gJ2xhbmRtYXJrJykgYy5jbW9kZSA9IG51bGw7XG5cdGNmZy5jbW9kZSA9IGMuY21vZGUgfHwgXG5cdCAgICAoKCdjaHInIGluIGMgfHwgJ3N0YXJ0JyBpbiBjIHx8ICdlbmQnIGluIGMpID9cblx0ICAgICAgICAnbWFwcGVkJyA6IFxuXHRcdCgnbGFuZG1hcmsnIGluIGMgfHwgJ2ZsYW5rJyBpbiBjIHx8ICdsZW5ndGgnIGluIGMgfHwgJ2RlbHRhJyBpbiBjKSA/XG5cdFx0ICAgICdsYW5kbWFyaycgOiBcblx0XHQgICAgdGhpcy5jbW9kZSB8fCAnbWFwcGVkJyk7XG5cblx0Ly8gaGlnaGxpZ2h0aW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gU2V0IGNmZy5oaWdobGlnaHRcblx0Ly8gICAgd2l0aCBmYWxsYmFjayB0byBjdXJyZW50IGhpZ2hsaWdodFxuXHQvLyAgICAgICAgd2l0aCBmYWxsYmFjayB0byBbXVxuXHRjZmcuaGlnaGxpZ2h0ID0gYy5oaWdobGlnaHQgfHwgdGhpcy56b29tVmlldy5oaWdobGlnaHRlZCB8fCBbXTtcblxuXHQvLyBkcmF3aW5nIG1vZGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBTZXQgdGhlIGRyYXdpbmcgbW9kZSBmb3IgdGhlIFpvb21WaWV3LlxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCB2YWx1ZVxuXHRpZiAoYy5kbW9kZSA9PT0gJ2NvbXBhcmlzb24nIHx8IGMuZG1vZGUgPT09ICdyZWZlcmVuY2UnKSBcblx0ICAgIGNmZy5kbW9kZSA9IGMuZG1vZGU7XG5cdGVsc2Vcblx0ICAgIGNmZy5kbW9kZSA9IHRoaXMuem9vbVZpZXcuZG1vZGUgfHwgJ2NvbXBhcmlzb24nO1xuXG5cdC8vXG5cdHJldHVybiBjZmc7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyB0aGUgY3VycmVudCBjb250ZXh0IGZyb20gdGhlIGNvbmZpZyBvYmplY3QuIFxuICAgIC8vIE9ubHkgdGhvc2UgY29udGV4dCBpdGVtcyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZyBhcmUgYWZmZWN0ZWQsIGV4Y2VwdCBhcyBub3RlZC5cbiAgICAvL1xuICAgIC8vIEFsbCBjb25maWdzIGFyZSBzYW5pdGl6ZWQgYmVmb3JlIGJlaW5nIGFwcGxpZWQgKHNlZSBzYW5pdGl6ZUNmZykuXG4gICAgLy8gXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBjIChvYmplY3QpIEEgY29uZmlndXJhdGlvbiBvYmplY3QgdGhhdCBzcGVjaWZpZXMgc29tZS9hbGwgY29uZmlnIHZhbHVlcy5cbiAgICAvLyAgICAgICAgIFRoZSBwb3NzaWJsZSBjb25maWcgaXRlbXM6XG4gICAgLy8gICAgICAgICAgICBnZW5vbWVzICAgKGxpc3QgbyBzdHJpbmdzKSBBbGwgdGhlIGdlbm9tZXMgeW91IHdhbnQgdG8gc2VlLCBpbiB0b3AtdG8tYm90dG9tIG9yZGVyLiBcbiAgICAvLyAgICAgICAgICAgICAgIE1heSB1c2UgaW50ZXJuYWwgbmFtZXMgb3IgZGlzcGxheSBsYWJlbHMsIGVnLCBcIm11c19tdXNjdWx1c18xMjlzMXN2aW1qXCIgb3IgXCIxMjlTMS9TdkltSlwiLlxuICAgIC8vICAgICAgICAgICAgcmVmICAgICAgIChzdHJpbmcpIFRoZSBnZW5vbWUgdG8gdXNlIGFzIHRoZSByZWZlcmVuY2UuIE1heSBiZSBuYW1lIG9yIGxhYmVsLlxuICAgIC8vICAgICAgICAgICAgaGlnaGxpZ2h0IChsaXN0IG8gc3RyaW5ncykgSURzIG9mIGZlYXR1cmVzIHRvIGhpZ2hsaWdodFxuICAgIC8vICAgICAgICAgICAgZG1vZGUgICAgIChzdHJpbmcpIGVpdGhlciAnY29tcGFyaXNvbicgb3IgJ3JlZmVyZW5jZSdcbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgQ29vcmRpbmF0ZXMgYXJlIHNwZWNpZmllZCBpbiBvbmUgb2YgMiBmb3Jtcy5cbiAgICAvLyAgICAgICAgICAgICAgY2hyICAgICAgIChzdHJpbmcpIENocm9tb3NvbWUgZm9yIGNvb3JkaW5hdGUgcmFuZ2VcbiAgICAvLyAgICAgICAgICAgICAgc3RhcnQgICAgIChpbnQpIENvb3JkaW5hdGUgcmFuZ2Ugc3RhcnQgcG9zaXRpb25cbiAgICAvLyAgICAgICAgICAgICAgZW5kICAgICAgIChpbnQpIENvb3JkaW5hdGUgcmFuZ2UgZW5kIHBvc2l0aW9uXG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgICAgRGlzcGxheXMgdGhpcyBjb29yZGluYXRlIHJhbmdlIGZyb20gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbmVvbXMsIGFuZCB0aGUgZXF1aXZhbGVudCAobWFwcGVkKVxuICAgIC8vICAgICAgICAgICAgICBjb29yZGluYXRlIHJhbmdlKHMpIGluIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIG9yOlxuICAgIC8vICAgICAgICAgICAgICBsYW5kbWFyayAgKHN0cmluZykgSUQsIGNhbm9uaWNhbCBJRCwgb3Igc3ltYm9sLCBpZGVudGlmeWluZyBhIGZlYXR1cmUuXG4gICAgLy8gICAgICAgICAgICAgIGZsYW5rfGxlbmd0aCAoaW50KSBJZiBmbGFuaywgdmlld2luZyByZWdpb24gc2l6ZSA9IGZsYW5rICsgbGVuKGxhbmRtYXJrKSArIGZsYW5rLiBcbiAgICAvLyAgICAgICAgICAgICAgICAgSWYgbGVuZ3RoLCB2aWV3aW5nIHJlZ2lvbiBzaXplID0gbGVuZ3RoLiBJbiBlaXRoZXIgY2FzZSwgdGhlIGxhbmRtYXJrIGlzIGNlbnRlcmVkIGluXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoZSB2aWV3aW5nIGFyZWEsICsvLSBhbnkgc3BlY2lmaWVkIGRlbHRhLlxuICAgIC8vICAgICAgICAgICAgICBkZWx0YSAgICAgKGludCkgQW1vdW50IGluIGJwIHRvIHNoaWZ0IHRoZSByZWdpb24gbGVmdCAoPDApIG9yIHJpZ2h0ICg+MCkuXG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgICAgRGlzcGxheXMgdGhlIHJlZ2lvbiBhcm91bmQgdGhlIHNwZWNpZmllZCBsYW5kbWFyayBpbiBlYWNoIGdlbm9tZSB3aGVyZSBpdCBleGlzdHMuXG4gICAgLy9cbiAgICAvLyAgICBxdWlldGx5IChib29sZWFuKSBJZiB0cnVlLCBkb24ndCB1cGRhdGUgYnJvd3NlciBoaXN0b3J5IChhcyB3aGVuIGdvaW5nIGJhY2spXG4gICAgLy9cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgIE5vdGhpbmdcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy9cdCAgUmVkcmF3cyBcbiAgICAvL1x0ICBDYWxscyBjb250ZXh0Q2hhbmdlZCgpIFxuICAgIC8vXG4gICAgc2V0Q29udGV4dCAoYywgcXVpZXRseSkge1xuICAgICAgICBsZXQgY2ZnID0gdGhpcy5zYW5pdGl6ZUNmZyhjKTtcblx0Ly9jb25zb2xlLmxvZyhcIlNldCBjb250ZXh0IChyYXcpOlwiLCBjKTtcblx0Ly9jb25zb2xlLmxvZyhcIlNldCBjb250ZXh0IChzYW5pdGl6ZWQpOlwiLCBjZmcpO1xuXHRpZiAoIWNmZykgcmV0dXJuO1xuXHR0aGlzLnNob3dCdXN5KHRydWUsICdSZXF1ZXN0aW5nIGRhdGEuLi4nKTtcblx0bGV0IHAgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmxvYWRHZW5vbWVzKGNmZy5nZW5vbWVzKS50aGVuKCgpID0+IHtcblx0ICAgIGlmIChjZmcuY21vZGUgPT09ICdsYW5kbWFyaycpIHtcblx0ICAgICAgICBjZmcgPSB0aGlzLnJlc29sdmVMYW5kbWFyayhjZmcpO1xuXHRcdGlmICghY2ZnKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTGFuZG1hcmsgZG9lcyBub3QgZXhpc3QgaW4gY3VycmVudCByZWZlcmVuY2UgZ2Vub21lLiBQbGVhc2UgY2hhbmdlIHRoZSByZWZlcmVuY2UgZ2Vub21lIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdCAgICB0aGlzLnNob3dCdXN5KGZhbHNlKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0ICAgIH1cblx0ICAgIHRoaXMudkdlbm9tZXMgPSBjZmcuZ2Vub21lcztcblx0ICAgIHRoaXMuckdlbm9tZSAgPSBjZmcucmVmO1xuXHQgICAgdGhpcy5jR2Vub21lcyA9IGNmZy5nZW5vbWVzLmZpbHRlcihnID0+IGcgIT09IGNmZy5yZWYpO1xuXHQgICAgdGhpcy5zZXRSZWZHZW5vbWVTZWxlY3Rpb24odGhpcy5yR2Vub21lLm5hbWUpO1xuXHQgICAgdGhpcy5zZXRDb21wR2Vub21lc1NlbGVjdGlvbih0aGlzLnZHZW5vbWVzLm1hcChnPT5nLm5hbWUpKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLmNtb2RlID0gY2ZnLmNtb2RlO1xuXHQgICAgLy9cblx0ICAgIHJldHVybiB0aGlzLnRyYW5zbGF0b3IucmVhZHkoKTtcblx0fSkudGhlbigoKSA9PiB7XG5cdCAgICAvL1xuXHQgICAgaWYgKCFjZmcpIHJldHVybjtcblx0ICAgIHRoaXMuY29vcmRzICAgPSB7XG5cdFx0Y2hyOiBjZmcuY2hyLm5hbWUsXG5cdFx0Y2hyb21vc29tZTogY2ZnLmNocixcblx0XHRzdGFydDogY2ZnLnN0YXJ0LFxuXHRcdGVuZDogY2ZnLmVuZFxuXHQgICAgfTtcblx0ICAgIHRoaXMubGNvb3JkcyAgPSB7XG5cdCAgICAgICAgbGFuZG1hcms6IGNmZy5sYW5kbWFyaywgXG5cdFx0bGFuZG1hcmtSZWZGZWF0OiBjZmcubGFuZG1hcmtSZWZGZWF0LFxuXHRcdGxhbmRtYXJrRmVhdHM6IGNmZy5sYW5kbWFya0ZlYXRzLFxuXHRcdGZsYW5rOiBjZmcuZmxhbmssIFxuXHRcdGxlbmd0aDogY2ZnLmxlbmd0aCwgXG5cdFx0ZGVsdGE6IGNmZy5kZWx0YSBcblx0ICAgIH07XG5cdCAgICAvL1xuXHQgICAgdGhpcy56b29tVmlldy51cGRhdGUoY2ZnKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLmdlbm9tZVZpZXcucmVkcmF3KCk7XG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuc2V0QnJ1c2hDb29yZHModGhpcy5jb29yZHMpO1xuXHQgICAgLy9cblx0ICAgIGlmICghcXVpZXRseSlcblx0ICAgICAgICB0aGlzLmNvbnRleHRDaGFuZ2VkKCk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5zaG93QnVzeShmYWxzZSk7XG5cdH0pO1xuXHRyZXR1cm4gcDtcbiAgICB9XG4gXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0Q29vcmRpbmF0ZXMgKHN0cikge1xuXHRsZXQgY29vcmRzID0gcGFyc2VDb29yZHMoc3RyKTtcblx0aWYgKCEgY29vcmRzKSB7XG5cdCAgICBsZXQgZmVhdHMgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlMYWJlbChzdHIpO1xuXHQgICAgbGV0IGZlYXRzMiA9IGZlYXRzLmZpbHRlcihmPT5mLmdlbm9tZSA9PSB0aGlzLnJHZW5vbWUpO1xuXHQgICAgbGV0IGYgPSBmZWF0czJbMF0gfHwgZmVhdHNbMF07XG5cdCAgICBpZiAoZikge1xuXHRcdGNvb3JkcyA9IHtcblx0XHQgICAgcmVmOiBmLmdlbm9tZS5uYW1lLFxuXHRcdCAgICBsYW5kbWFyazogc3RyLFxuXHRcdCAgICBkZWx0YTogMCxcblx0XHQgICAgaGlnaGxpZ2h0OiBmLmlkXG5cdFx0fVxuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0YWxlcnQoXCJVbmFibGUgdG8gc2V0IGNvb3JkaW5hdGVzIHdpdGggdGhpcyB2YWx1ZTogXCIgKyBzdHIpO1xuXHRcdHJldHVybjtcblx0ICAgIH1cblx0fVxuXHR0aGlzLnNldENvbnRleHQoY29vcmRzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXNpemUgKCkge1xuXHRsZXQgdyA9IHdpbmRvdy5pbm5lcldpZHRoIC0gMjQ7XG5cdHRoaXMuZ2Vub21lVmlldy5maXRUb1dpZHRoKHcpO1xuXHR0aGlzLnpvb21WaWV3LmZpdFRvV2lkdGgodyk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIGN1cnJlbnQgY29udGV4dCBhcyBhIHBhcmFtZXRlciBzdHJpbmdcbiAgICAvLyBDdXJyZW50IGNvbnRleHQgPSByZWYgZ2Vub21lICsgY29tcCBnZW5vbWVzICsgY3VycmVudCByYW5nZSAoY2hyLHN0YXJ0LGVuZClcbiAgICBnZXRQYXJhbVN0cmluZyAoKSB7XG5cdGxldCBjID0gdGhpcy5nZXRDb250ZXh0KCk7XG4gICAgICAgIGxldCByZWYgPSBgcmVmPSR7Yy5yZWZ9YDtcbiAgICAgICAgbGV0IGdlbm9tZXMgPSBgZ2Vub21lcz0ke2MuZ2Vub21lcy5qb2luKFwiK1wiKX1gO1xuXHRsZXQgY29vcmRzID0gYGNocj0ke2MuY2hyfSZzdGFydD0ke2Muc3RhcnR9JmVuZD0ke2MuZW5kfWA7XG5cdGxldCBsZmxmID0gYy5mbGFuayA/ICcmZmxhbms9JytjLmZsYW5rIDogJyZsZW5ndGg9JytjLmxlbmd0aDtcblx0bGV0IGxjb29yZHMgPSBgbGFuZG1hcms9JHtjLmxhbmRtYXJrfSZkZWx0YT0ke2MuZGVsdGF9JHtsZmxmfWA7XG5cdGxldCBobHMgPSBgaGlnaGxpZ2h0PSR7Yy5oaWdobGlnaHQuam9pbihcIitcIil9YDtcblx0bGV0IGRtb2RlID0gYGRtb2RlPSR7Yy5kbW9kZX1gO1xuXHRyZXR1cm4gYCR7dGhpcy5jbW9kZT09PSdtYXBwZWQnP2Nvb3JkczpsY29vcmRzfSYke2Rtb2RlfSYke3JlZn0mJHtnZW5vbWVzfSYke2hsc31gO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldEN1cnJlbnRMaXN0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Vyckxpc3Q7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldEN1cnJlbnRMaXN0IChsc3QsIGdvVG9GaXJzdCkge1xuICAgIFx0Ly9cblx0bGV0IHByZXZMaXN0ID0gdGhpcy5jdXJyTGlzdDtcblx0dGhpcy5jdXJyTGlzdCA9IGxzdDtcblx0aWYgKGxzdCAhPT0gcHJldkxpc3QpIHtcblx0ICAgIHRoaXMuY3Vyckxpc3RJbmRleCA9IGxzdCA/IGxzdC5pZHMucmVkdWNlKCAoeCxpKSA9PiB7IHhbaV09aTsgcmV0dXJuIHg7IH0sIHt9KSA6IHt9O1xuXHQgICAgdGhpcy5jdXJyTGlzdENvdW50ZXIgPSAwO1xuXHR9XG5cdC8vXG5cdGxldCBsaXN0cyA9IGQzLnNlbGVjdCgnI215bGlzdHMnKS5zZWxlY3RBbGwoJy5saXN0SW5mbycpO1xuXHRsaXN0cy5jbGFzc2VkKFwiY3VycmVudFwiLCBkID0+IGQgPT09IGxzdCk7XG5cdC8vXG5cdC8vIHNob3cgdGhpcyBsaXN0IGFzIHRpY2sgbWFya3MgaW4gdGhlIGdlbm9tZSB2aWV3XG5cdHRoaXMuZ2Vub21lVmlldy5kcmF3VGlja3MobHN0ID8gbHN0LmlkcyA6IFtdKTtcblx0dGhpcy5nZW5vbWVWaWV3LmRyYXdUaXRsZSgpO1xuXHR0aGlzLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHQvL1xuXHRpZiAoZ29Ub0ZpcnN0KSB0aGlzLmdvVG9OZXh0TGlzdEVsZW1lbnQoKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ29Ub05leHRMaXN0RWxlbWVudCAoKSB7XG5cdGlmICghdGhpcy5jdXJyTGlzdCB8fCB0aGlzLmN1cnJMaXN0Lmlkcy5sZW5ndGggPT09IDApIHJldHVybjtcblx0bGV0IGN1cnJJZCA9IHRoaXMuY3Vyckxpc3QuaWRzW3RoaXMuY3Vyckxpc3RDb3VudGVyXTtcbiAgICAgICAgdGhpcy5jdXJyTGlzdENvdW50ZXIgPSAodGhpcy5jdXJyTGlzdENvdW50ZXIgKyAxKSAlIHRoaXMuY3Vyckxpc3QuaWRzLmxlbmd0aDtcblx0dGhpcy5zZXRDb29yZGluYXRlcyhjdXJySWQpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBwYW56b29tKHBmYWN0b3IsIHpmYWN0b3IpIHtcblx0Ly9cblx0IXBmYWN0b3IgJiYgKHBmYWN0b3IgPSAwKTtcblx0IXpmYWN0b3IgJiYgKHpmYWN0b3IgPSAxKTtcblx0Ly9cblx0bGV0IGMgPSB0aGlzLmNvb3Jkcztcblx0bGV0IHdpZHRoID0gYy5lbmQgLSBjLnN0YXJ0ICsgMTtcblx0bGV0IG1pZCA9IChjLnN0YXJ0ICsgYy5lbmQpLzI7XG5cdGxldCBjaHIgPSB0aGlzLnJHZW5vbWUuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSB0aGlzLmNvb3Jkcy5jaHIpWzBdO1xuXHRsZXQgbmN4dCA9IHt9OyAvLyBuZXcgY29udGV4dFxuXHRsZXQgbWluRCA9IC0oYy5zdGFydC0xKTsgLy8gbWluIGRlbHRhIChhdCBjdXJyZW50IHpvb20pXG5cdGxldCBtYXhEID0gY2hyLmxlbmd0aCAtIGMuZW5kOyAvLyBtYXggZGVsdGEgKGF0IGN1cnJlbnQgem9vbSlcblx0bGV0IGQgPSBjbGlwKHBmYWN0b3IgKiB3aWR0aCwgbWluRCwgbWF4RCk7IC8vIGRlbHRhIChhdCBuZXcgem9vbSlcblx0bGV0IG5ld3dpZHRoID0gemZhY3RvciAqIHdpZHRoO1xuXHRsZXQgbmV3c3RhcnQgPSBtaWQgLSBuZXd3aWR0aC8yICsgZDtcblx0Ly9cblx0aWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKSB7XG5cdCAgICBuY3h0LmNociA9IGMuY2hyO1xuXHQgICAgbmN4dC5zdGFydCA9IG5ld3N0YXJ0O1xuXHQgICAgbmN4dC5lbmQgPSBuZXdzdGFydCArIG5ld3dpZHRoIC0gMTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIG5jeHQubGVuZ3RoID0gbmV3d2lkdGg7XG5cdCAgICBuY3h0LmRlbHRhID0gdGhpcy5sY29vcmRzLmRlbHRhICsgZCA7XG5cdH1cblx0dGhpcy5zZXRDb250ZXh0KG5jeHQpO1xuICAgIH1cbiAgICB6b29tIChmYWN0b3IpIHtcbiAgICAgICAgdGhpcy5wYW56b29tKG51bGwsIGZhY3Rvcik7XG4gICAgfVxuICAgIHBhbiAoZmFjdG9yKSB7XG4gICAgICAgIHRoaXMucGFuem9vbShmYWN0b3IsIG51bGwpO1xuICAgIH1cdFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFpvb21zIGluL291dCBieSBmYWN0b3IuIE5ldyB6b29tIHdpZHRoIGlzIGZhY3RvciAqIHRoZSBjdXJyZW50IHdpZHRoLlxuICAgIC8vIEZhY3RvciA+IDEgem9vbXMgb3V0LCAwIDwgZmFjdG9yIDwgMSB6b29tcyBpbi5cbiAgICB4em9vbSAoZmFjdG9yKSB7XG5cdGxldCBsZW4gPSB0aGlzLmNvb3Jkcy5lbmQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDE7XG5cdGxldCBuZXdsZW4gPSBNYXRoLnJvdW5kKGZhY3RvciAqIGxlbik7XG5cdGxldCB4ID0gKHRoaXMuY29vcmRzLnN0YXJ0ICsgdGhpcy5jb29yZHMuZW5kKS8yO1xuXHRpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpIHtcblx0ICAgIGxldCBuZXdzdGFydCA9IE1hdGgucm91bmQoeCAtIG5ld2xlbi8yKTtcblx0ICAgIHRoaXMuc2V0Q29udGV4dCh7IGNocjogdGhpcy5jb29yZHMuY2hyLCBzdGFydDogbmV3c3RhcnQsIGVuZDogbmV3c3RhcnQgKyBuZXdsZW4gLSAxIH0pO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgbGVuZ3RoOiBuZXdsZW4gfSk7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQYW5zIHRoZSB2aWV3IGxlZnQgb3IgcmlnaHQgYnkgZmFjdG9yLiBUaGUgZGlzdGFuY2UgbW92ZWQgaXMgZmFjdG9yIHRpbWVzIHRoZSBjdXJyZW50IHpvb20gd2lkdGguXG4gICAgLy8gTmVnYXRpdmUgdmFsdWVzIHBhbiBsZWZ0LiBQb3NpdGl2ZSB2YWx1ZXMgcGFuIHJpZ2h0LiAoTm90ZSB0aGF0IHBhbm5pbmcgbW92ZXMgdGhlIFwiY2FtZXJhXCIuIFBhbm5pbmcgdG8gdGhlXG4gICAgLy8gcmlnaHQgbWFrZXMgdGhlIG9iamVjdHMgaW4gdGhlIHNjZW5lIGFwcGVhciB0byBtb3ZlIHRvIHRoZSBsZWZ0LCBhbmQgdmljZSB2ZXJzYS4pXG4gICAgLy9cbiAgICB4cGFuIChmYWN0b3IpIHtcblx0bGV0IGMgPSB0aGlzLmNvb3Jkcztcblx0bGV0IGNociA9IHRoaXMuckdlbm9tZS5jaHJvbW9zb21lcy5maWx0ZXIoYyA9PiBjLm5hbWUgPT09IHRoaXMuY29vcmRzLmNocilbMF07XG5cdGxldCB3aWR0aCA9IGMuZW5kIC0gYy5zdGFydCArIDE7XG5cdGxldCBtaW5EID0gLShjLnN0YXJ0LTEpO1xuXHRsZXQgbWF4RCA9IGNoci5sZW5ndGggLSBjLmVuZDtcblx0bGV0IGQgPSBjbGlwKGZhY3RvciAqIHdpZHRoLCBtaW5ELCBtYXhEKTtcblx0aWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKSB7XG5cdCAgICB0aGlzLnNldENvbnRleHQoeyBjaHI6IGMuY2hyLCBzdGFydDogYy5zdGFydCtkLCBlbmQ6IGMuZW5kK2QgfSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICB0aGlzLnNldENvbnRleHQoeyBkZWx0YTogdGhpcy5sY29vcmRzLmRlbHRhICsgZCB9KTtcblx0fVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXRGZWF0VHlwZUNvbnRyb2wgKGZhY2V0KSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0bGV0IGNvbG9ycyA9IHRoaXMuY3NjYWxlLmRvbWFpbigpLm1hcChsYmwgPT4ge1xuXHQgICAgcmV0dXJuIHsgbGJsOmxibCwgY2xyOnRoaXMuY3NjYWxlKGxibCkgfTtcblx0fSk7XG5cdGxldCBja2VzID0gZDMuc2VsZWN0KFwiLmNvbG9yS2V5XCIpXG5cdCAgICAuc2VsZWN0QWxsKCcuY29sb3JLZXlFbnRyeScpXG5cdFx0LmRhdGEoY29sb3JzKTtcblx0bGV0IG5jcyA9IGNrZXMuZW50ZXIoKS5hcHBlbmQoXCJkaXZcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjb2xvcktleUVudHJ5IGZsZXhyb3dcIik7XG5cdG5jcy5hcHBlbmQoXCJkaXZcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcInN3YXRjaFwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGMgPT4gYy5sYmwpXG5cdCAgICAuc3R5bGUoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGMgPT4gYy5jbHIpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IHQgPSBkMy5zZWxlY3QodGhpcyk7XG5cdCAgICAgICAgdC5jbGFzc2VkKFwiY2hlY2tlZFwiLCAhIHQuY2xhc3NlZChcImNoZWNrZWRcIikpO1xuXHRcdGxldCBzd2F0Y2hlcyA9IGQzLnNlbGVjdEFsbChcIi5zd2F0Y2guY2hlY2tlZFwiKVswXTtcblx0XHRsZXQgZnRzID0gc3dhdGNoZXMubWFwKHM9PnMuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSlcblx0XHRmYWNldC5zZXRWYWx1ZXMoZnRzKTtcblx0XHRzZWxmLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHQgICAgfSlcblx0ICAgIC5hcHBlbmQoXCJpXCIpXG5cdCAgICAgICAgLmF0dHIoXCJjbGFzc1wiLFwibWF0ZXJpYWwtaWNvbnNcIik7XG5cdG5jcy5hcHBlbmQoXCJzcGFuXCIpXG5cdCAgICAudGV4dChjID0+IGMubGJsKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJDYWNoZWREYXRhIChhc2spIHtcblx0aWYgKCFhc2sgfHwgd2luZG93LmNvbmZpcm0oJ0RlbGV0ZSBhbGwgY2FjaGVkIGRhdGEuIEFyZSB5b3Ugc3VyZT8nKSkge1xuXHQgICAgdGhpcy5mZWF0dXJlTWFuYWdlci5jbGVhckNhY2hlZERhdGEoKTtcblx0ICAgIHRoaXMudHJhbnNsYXRvci5jbGVhckNhY2hlZERhdGEoKTtcblx0fVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naVNucFJlcG9ydCAoKSB7XG5cdGxldCBjID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdGxldCB1cmxCYXNlID0gJ2h0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9zbnAvc3VtbWFyeSc7XG5cdGxldCB0YWJBcmcgPSAnc2VsZWN0ZWRUYWI9MSc7XG5cdGxldCBzZWFyY2hCeUFyZyA9ICdzZWFyY2hCeVNhbWVEaWZmPSc7XG5cdGxldCBjaHJBcmcgPSBgc2VsZWN0ZWRDaHJvbW9zb21lPSR7Yy5jaHJ9YDtcblx0bGV0IGNvb3JkQXJnID0gYGNvb3JkaW5hdGU9JHtjLnN0YXJ0fS0ke2MuZW5kfWA7XG5cdGxldCB1bml0QXJnID0gJ2Nvb3JkaW5hdGVVbml0PWJwJztcblx0bGV0IGNzQXJncyA9IGMuZ2Vub21lcy5tYXAoZyA9PiBgc2VsZWN0ZWRTdHJhaW5zPSR7Z31gKVxuXHRsZXQgcnNBcmcgPSBgcmVmZXJlbmNlU3RyYWluPSR7Yy5yZWZ9YDtcblx0bGV0IGxpbmtVcmwgPSBgJHt1cmxCYXNlfT8ke3RhYkFyZ30mJHtzZWFyY2hCeUFyZ30mJHtjaHJBcmd9JiR7Y29vcmRBcmd9JiR7dW5pdEFyZ30mJHtyc0FyZ30mJHtjc0FyZ3Muam9pbignJicpfWBcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naVFUTHMgKCkge1xuXHRsZXQgYyAgICAgICAgPSB0aGlzLmdldENvbnRleHQoKTtcblx0bGV0IHVybEJhc2UgID0gJ2h0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9hbGxlbGUvc3VtbWFyeSc7XG5cdGxldCBjaHJBcmcgICA9IGBjaHJvbW9zb21lPSR7Yy5jaHJ9YDtcblx0bGV0IGNvb3JkQXJnID0gYGNvb3JkaW5hdGU9JHtjLnN0YXJ0fS0ke2MuZW5kfWA7XG5cdGxldCB1bml0QXJnICA9ICdjb29yZFVuaXQ9YnAnO1xuXHRsZXQgdHlwZUFyZyAgPSAnYWxsZWxlVHlwZT1RVEwnO1xuXHRsZXQgbGlua1VybCAgPSBgJHt1cmxCYXNlfT8ke2NockFyZ30mJHtjb29yZEFyZ30mJHt1bml0QXJnfSYke3R5cGVBcmd9YDtcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naUpCcm93c2UgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRsZXQgdXJsQmFzZSA9ICdodHRwOi8vamJyb3dzZS5pbmZvcm1hdGljcy5qYXgub3JnLyc7XG5cdGxldCBkYXRhQXJnID0gJ2RhdGE9ZGF0YSUyRm1vdXNlJzsgLy8gXCJkYXRhL21vdXNlXCJcblx0bGV0IGxvY0FyZyAgPSBgbG9jPWNociR7Yy5jaHJ9JTNBJHtjLnN0YXJ0fS4uJHtjLmVuZH1gO1xuXHRsZXQgdHJhY2tzICA9IFsnRE5BJywnTUdJX0dlbm9tZV9GZWF0dXJlcycsJ05DQklfQ0NEUycsJ05DQkknLCdFTlNFTUJMJ107XG5cdGxldCB0cmFja3NBcmc9YHRyYWNrcz0ke3RyYWNrcy5qb2luKCcsJyl9YDtcblx0bGV0IGhpZ2hsaWdodEFyZyA9ICdoaWdobGlnaHQ9Jztcblx0bGV0IGxpbmtVcmwgPSBgJHt1cmxCYXNlfT8keyBbZGF0YUFyZyxsb2NBcmcsdHJhY2tzQXJnLGhpZ2hsaWdodEFyZ10uam9pbignJicpIH1gO1xuXHR3aW5kb3cub3BlbihsaW5rVXJsLCBcIl9ibGFua1wiKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRG93bmxvYWRzIEROQSBzZXF1ZW5jZXMgb2YgdGhlIHNwZWNpZmllZCB0eXBlIGluIEZBU1RBIGZvcm1hdCBmb3IgdGhlIHNwZWNpZmllZCBmZWF0dXJlLlxuICAgIC8vIElmIGdlbm9tZXMgaXMgc3BlY2lmaWVkLCBsaXN0cyB0aGUgc3BlY2lmaWMgZ2Vub21lcyB0byByZXRyaWV2ZSBmcm9tOyBvdGhlcndpc2UgcmV0cmlldmVzIGZyb20gYWxsIGdlbm9tZXMuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgZiAob2JqZWN0KSB0aGUgZmVhdHVyZVxuICAgIC8vICAgICB0eXBlIChzdHJpbmcpIHdoaWNoIHNlcXVlbmNlcyB0byBkb3dubG9hZDogJ2dlbm9taWMnLCdleG9uJywnQ0RTJyxcbiAgICAvLyAgICAgZ2Vub21lcyAobGlzdCBvZiBzdHJpbmdzKSBuYW1lcyBvZiBnZW5vbWVzIHRvIHJldHJpZXZlIGZyb20uIElmIG5vdCBzcGVjaWZpZWQsXG4gICAgLy8gICAgICAgICByZXRyaWV2ZXMgc2VxdWVuZWNzIGZyb20gYWxsIGF2YWlsYWJsZSBtb3VzZSBnZW5vbWVzLlxuICAgIC8vXG4gICAgZG93bmxvYWRGYXN0YSAoZiwgdHlwZSwgZ2Vub21lcykge1xuXHRsZXQgcSA9IHRoaXMucXVlcnlNYW5hZ2VyLmF1eERhdGFNYW5hZ2VyLnNlcXVlbmNlc0ZvckZlYXR1cmUoZiwgdHlwZSwgZ2Vub21lcylcblx0aWYgKHEpIHdpbmRvdy5vcGVuKHEsXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIGxpbmtUb1JlcG9ydFBhZ2UgKGYpIHtcbiAgICAgICAgbGV0IHUgPSB0aGlzLnF1ZXJ5TWFuYWdlci5hdXhEYXRhTWFuYWdlci5saW5rVG9SZXBvcnRQYWdlKGYuaWQpO1xuXHR3aW5kb3cub3Blbih1LCAnX2JsYW5rJylcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBNR1ZBcHBcblxuZXhwb3J0IHsgTUdWQXBwIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9NR1ZBcHAuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgR2Vub21lIHtcbiAgY29uc3RydWN0b3IgKGNmZykge1xuICAgIHRoaXMubmFtZSA9IGNmZy5uYW1lO1xuICAgIHRoaXMubGFiZWw9IGNmZy5sYWJlbDtcbiAgICB0aGlzLmNocm9tb3NvbWVzID0gW107XG4gICAgdGhpcy5tYXhsZW4gPSAtMTtcbiAgICB0aGlzLnhzY2FsZSA9IG51bGw7XG4gICAgdGhpcy55c2NhbGUgPSBudWxsO1xuICAgIHRoaXMuem9vbVkgID0gLTE7XG4gIH1cbiAgZ2V0Q2hyb21vc29tZSAobikge1xuICAgICAgaWYgKHR5cGVvZihuKSA9PT0gJ3N0cmluZycpXG5cdCAgcmV0dXJuIHRoaXMuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSBuKVswXTtcbiAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gdGhpcy5jaHJvbW9zb21lc1tuXTtcbiAgfVxuICBoYXNDaHJvbW9zb21lIChuKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDaHJvbW9zb21lKG4pID8gdHJ1ZSA6IGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCB7IEdlbm9tZSB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvR2Vub21lLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7ZDNqc29uLCBkM3Rzdiwgb3ZlcmxhcHMsIHN1YnRyYWN0fSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7RmVhdHVyZX0gZnJvbSAnLi9GZWF0dXJlJztcbmltcG9ydCB7S2V5U3RvcmV9IGZyb20gJy4vS2V5U3RvcmUnO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEhvdyB0aGUgYXBwIGxvYWRzIGZlYXR1cmUgZGF0YS4gUHJvdmlkZXMgdHdvIGNhbGxzOlxuLy8gICAtIGdldCBmZWF0dXJlcyBpbiByYW5nZVxuLy8gICAtIGdldCBmZWF0dXJlcyBieSBpZFxuLy8gUmVxdWVzdHMgZmVhdHVyZXMgZnJvbSB0aGUgc2VydmVyIGFuZCByZWdpc3RlcnMgdGhlbSBpbiBhIGNhY2hlLlxuLy8gSW50ZXJhY3RzIHdpdGggdGhlIGJhY2sgZW5kIHRvIGxvYWQgZmVhdHVyZXM7IHRyaWVzIG5vdCB0byByZXF1ZXN0XG4vLyB0aGUgc2FtZSByZWdpb24gdHdpY2UuXG4vL1xuY2xhc3MgRmVhdHVyZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMuaWQyZmVhdCA9IHt9O1x0XHQvLyBpbmRleCBmcm9tICBmZWF0dXJlIElEIHRvIGZlYXR1cmVcblx0dGhpcy5jYW5vbmljYWwyZmVhdHMgPSB7fTtcdC8vIGluZGV4IGZyb20gY2Fub25pY2FsIElEIC0+IFsgZmVhdHVyZXMgdGFnZ2VkIHdpdGggdGhhdCBpZCBdXG5cdHRoaXMuc3ltYm9sMmZlYXRzID0ge31cdFx0Ly8gaW5kZXggZnJvbSBzeW1ib2wgLT4gWyBmZWF0dXJlcyBoYXZpbmcgdGhhdCBzeW1ib2wgXVxuXHRcdFx0XHRcdC8vIHdhbnQgY2FzZSBpbnNlbnNpdGl2ZSBzZWFyY2hlcywgc28ga2V5cyBhcmUgbG93ZXIgY2FzZWRcblx0dGhpcy5jYWNoZSA9IHt9O1x0XHQvLyB7Z2Vub21lLm5hbWUgLT4ge2Noci5uYW1lIC0+IGxpc3Qgb2YgYmxvY2tzfX1cblx0dGhpcy5taW5lRmVhdHVyZUNhY2hlID0ge307XHQvLyBhdXhpbGlhcnkgaW5mbyBwdWxsZWQgZnJvbSBNb3VzZU1pbmUgXG5cdHRoaXMubG9hZGVkR2Vub21lcyA9IG5ldyBTZXQoKTsgLy8gdGhlIHNldCBvZiBHZW5vbWVzIHRoYXQgaGF2ZSBiZWVuIGZ1bGx5IGxvYWRlZFxuXHQvL1xuXHR0aGlzLmZTdG9yZSA9IG5ldyBLZXlTdG9yZSgnZmVhdHVyZXMnKTsgLy8gbWFwcyBnZW5vbWUgbmFtZSAtPiBsaXN0IG9mIGZlYXR1cmVzXG4gICAgfVxuIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHByb2Nlc3NGZWF0dXJlIChnZW5vbWUsIGQpIHtcblx0Ly8gSWYgd2UndmUgYWxyZWFkeSBnb3QgdGhpcyBvbmUgaW4gdGhlIGNhY2hlLCByZXR1cm4gaXQuXG5cdGxldCBmID0gdGhpcy5pZDJmZWF0W2QuSURdO1xuXHRpZiAoZikgcmV0dXJuIGY7XG5cdC8vIENyZWF0ZSBhIG5ldyBGZWF0dXJlXG5cdGYgPSBuZXcgRmVhdHVyZShkKTtcblx0Zi5nZW5vbWUgPSBnZW5vbWVcblx0Ly8gUmVnaXN0ZXIgaXQuXG5cdHRoaXMuaWQyZmVhdFtmLklEXSA9IGY7XG5cdC8vIGdlbm9tZSBjYWNoZVxuXHRsZXQgZ2MgPSB0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXSA9ICh0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXSB8fCB7fSk7XG5cdC8vIGNocm9tb3NvbWUgY2FjaGUgKHcvaW4gZ2Vub21lKVxuXHRsZXQgY2MgPSBnY1tmLmNocl0gPSAoZ2NbZi5jaHJdIHx8IFtdKTtcblx0Y2MucHVzaChmKTtcblx0Ly9cblx0aWYgKGYuY2Fub25pY2FsICYmIGYuY2Fub25pY2FsICE9PSAnLicpIHtcblx0ICAgIGxldCBsc3QgPSB0aGlzLmNhbm9uaWNhbDJmZWF0c1tmLmNhbm9uaWNhbF0gPSAodGhpcy5jYW5vbmljYWwyZmVhdHNbZi5jYW5vbmljYWxdIHx8IFtdKTtcblx0ICAgIGxzdC5wdXNoKGYpO1xuXHR9XG5cdGlmIChmLnN5bWJvbCAmJiBmLnN5bWJvbCAhPT0gJy4nKSB7XG5cdCAgICBsZXQgcyA9IGYuc3ltYm9sLnRvTG93ZXJDYXNlKCk7XG5cdCAgICBsZXQgbHN0ID0gdGhpcy5zeW1ib2wyZmVhdHNbc10gPSAodGhpcy5zeW1ib2wyZmVhdHNbc10gfHwgW10pO1xuXHQgICAgbHN0LnB1c2goZik7XG5cdH1cblx0Ly8gaGVyZSB5J2dvLlxuXHRyZXR1cm4gZjtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQcm9jZXNzZXMgdGhlIFwicmF3XCIgZmVhdHVyZXMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlci5cbiAgICAvLyBUdXJucyB0aGVtIGludG8gRmVhdHVyZSBvYmplY3RzIGFuZCByZWdpc3RlcnMgdGhlbS5cbiAgICAvLyBJZiB0aGUgc2FtZSByYXcgZmVhdHVyZSBpcyByZWdpc3RlcmVkIGFnYWluLFxuICAgIC8vIHRoZSBGZWF0dXJlIG9iamVjdCBjcmVhdGVkIHRoZSBmaXJzdCB0aW1lIGlzIHJldHVybmVkLlxuICAgIC8vIChJLmUuLCByZWdpc3RlcmluZyB0aGUgc2FtZSBmZWF0dXJlIG11bHRpcGxlIHRpbWVzIGlzIG9rKVxuICAgIC8vXG4gICAgcHJvY2Vzc0ZlYXR1cmVzIChnZW5vbWUsIGZlYXRzKSB7XG5cdGZlYXRzLnNvcnQoIChhLGIpID0+IHtcblx0ICAgIGlmIChhLmNociA8IGIuY2hyKVxuXHRcdHJldHVybiAtMTtcblx0ICAgIGVsc2UgaWYgKGEuY2hyID4gYi5jaHIpXG5cdFx0cmV0dXJuIDE7XG5cdCAgICBlbHNlXG5cdFx0cmV0dXJuIGEuc3RhcnQgLSBiLnN0YXJ0O1xuXHR9KTtcblx0dGhpcy5mU3RvcmUuc2V0KGdlbm9tZS5uYW1lLCBmZWF0cyk7XG5cdHJldHVybiBmZWF0cy5tYXAoZCA9PiB0aGlzLnByb2Nlc3NGZWF0dXJlKGdlbm9tZSwgZCkpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGVuc3VyZUZlYXR1cmVzQnlHZW5vbWUgKGdlbm9tZSkge1xuXHRpZiAodGhpcy5sb2FkZWRHZW5vbWVzLmhhcyhnZW5vbWUpKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcblx0cmV0dXJuIHRoaXMuZlN0b3JlLmdldChnZW5vbWUubmFtZSkudGhlbihkYXRhID0+IHtcblx0ICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcblx0XHRjb25zb2xlLmxvZyhcIlJlcXVlc3Rpbmc6XCIsIGdlbm9tZS5uYW1lLCApO1xuXHRcdGxldCB1cmwgPSBgLi9kYXRhL2dlbm9tZWRhdGEvJHtnZW5vbWUubmFtZX0tZmVhdHVyZXMudHN2YDtcblx0XHRyZXR1cm4gZDN0c3YodXJsKS50aGVuKCBmZWF0cyA9PiB7XG5cdFx0ICAgIGZlYXRzID0gdGhpcy5wcm9jZXNzRmVhdHVyZXMoZ2Vub21lLCBmZWF0cyk7XG5cdFx0fSk7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRjb25zb2xlLmxvZyhcIkZvdW5kIGluIGNhY2hlOlwiLCBnZW5vbWUubmFtZSwgKTtcblx0XHRsZXQgZmVhdHMgPSB0aGlzLnByb2Nlc3NGZWF0dXJlcyhnZW5vbWUsIGRhdGEpO1xuXHRcdHJldHVybiB0cnVlO1xuXHQgICAgfVxuXHR9KS50aGVuKCAoKT0+IHtcblx0ICAgIHRoaXMubG9hZGVkR2Vub21lcy5hZGQoZ2Vub21lKTsgIFxuXHQgICAgdGhpcy5hcHAuc2hvd1N0YXR1cyhgTG9hZGVkOiAke2dlbm9tZS5uYW1lfWApO1xuXHQgICAgcmV0dXJuIHRydWU7IFxuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsb2FkR2Vub21lcyAoZ2Vub21lcykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoZ2Vub21lcy5tYXAoZyA9PiB0aGlzLmVuc3VyZUZlYXR1cmVzQnlHZW5vbWUgKGcpKSkudGhlbigoKT0+dHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXMgKGdlbm9tZSwgcmFuZ2UpIHtcbiAgICAgICAgbGV0IGdjID0gdGhpcy5jYWNoZVtnZW5vbWUubmFtZV0gO1xuXHRpZiAoIWdjKSByZXR1cm4gW107XG5cdGxldCBjRmVhdHMgPSBnY1tyYW5nZS5jaHJdO1xuXHRpZiAoIWNGZWF0cykgcmV0dXJuIFtdO1xuXHRsZXQgZmVhdHMgPSBjRmVhdHMuZmlsdGVyKGNmID0+IG92ZXJsYXBzKGNmLCByYW5nZSkpO1xuICAgICAgICByZXR1cm4gZmVhdHM7XHRcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGFsbCBjYWNoZWQgZmVhdHVyZXMgaGF2aW5nIHRoZSBnaXZlbiBjYW5vbmljYWwgaWQuXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZUJ5SWQgKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkMmZlYXRzW2lkXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGFsbCBjYWNoZWQgZmVhdHVyZXMgaGF2aW5nIHRoZSBnaXZlbiBjYW5vbmljYWwgaWQuXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkIChjaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2Fub25pY2FsMmZlYXRzW2NpZF0gfHwgW107XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIGxpc3Qgb2YgZmVhdHVyZXMgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gbGFiZWwsIHdoaWNoIGNhbiBiZSBhbiBpZCwgY2Fub25pY2FsIGlkLCBvciBzeW1ib2wuXG4gICAgLy8gSWYgZ2Vub21lIGlzIHNwZWNpZmllZCwgbGltaXQgcmVzdWx0cyB0byBmZWF0dXJlcyBmcm9tIHRoYXQgZ2Vub21lLlxuICAgIC8vIFxuICAgIGdldENhY2hlZEZlYXR1cmVzQnlMYWJlbCAobGFiZWwsIGdlbm9tZSkge1xuXHRsZXQgZiA9IHRoaXMuaWQyZmVhdFtsYWJlbF1cblx0bGV0IGZlYXRzID0gZiA/IFtmXSA6IHRoaXMuY2Fub25pY2FsMmZlYXRzW2xhYmVsXSB8fCB0aGlzLnN5bWJvbDJmZWF0c1tsYWJlbC50b0xvd2VyQ2FzZSgpXSB8fCBbXTtcblx0cmV0dXJuIGdlbm9tZSA/IGZlYXRzLmZpbHRlcihmPT4gZi5nZW5vbWUgPT09IGdlbm9tZSkgOiBmZWF0cztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIGZlYXR1cmVzIGluIFxuICAgIC8vIHRoZSBzcGVjaWZpZWQgcmFuZ2VzIG9mIHRoZSBzcGVjaWZpZWQgZ2Vub21lLlxuICAgIGdldEZlYXR1cmVzIChnZW5vbWUsIHJhbmdlcykge1xuXHRyZXR1cm4gdGhpcy5lbnN1cmVGZWF0dXJlc0J5R2Vub21lKGdlbm9tZSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJhbmdlcy5mb3JFYWNoKCByID0+IHtcblx0ICAgICAgICByLmZlYXR1cmVzID0gdGhpcy5nZXRDYWNoZWRGZWF0dXJlcyhnZW5vbWUsIHIpIFxuXHRcdHIuZ2Vub21lID0gZ2Vub21lO1xuXHQgICAgfSk7XG5cdCAgICByZXR1cm4geyBnZW5vbWUsIGJsb2NrczpyYW5nZXMgfTtcblx0fS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBmZWF0dXJlcyBoYXZpbmcgdGhlIHNwZWNpZmllZCBpZHMgZnJvbSB0aGUgc3BlY2lmaWVkIGdlbm9tZS5cbiAgICBnZXRGZWF0dXJlc0J5SWQgKGdlbm9tZSwgaWRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuc3VyZUZlYXR1cmVzQnlHZW5vbWUoZ2Vub21lKS50aGVuKCAoKSA9PiB7XG5cdCAgICBsZXQgZmVhdHMgPSBbXTtcblx0ICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuXHQgICAgbGV0IGFkZGYgPSAoZikgPT4ge1xuXHRcdGlmIChmLmdlbm9tZSAhPT0gZ2Vub21lKSByZXR1cm47XG5cdFx0aWYgKHNlZW4uaGFzKGYuaWQpKSByZXR1cm47XG5cdFx0c2Vlbi5hZGQoZi5pZCk7XG5cdFx0ZmVhdHMucHVzaChmKTtcblx0ICAgIH07XG5cdCAgICBsZXQgYWRkID0gKGYpID0+IHtcblx0XHRpZiAoQXJyYXkuaXNBcnJheShmKSkgXG5cdFx0ICAgIGYuZm9yRWFjaChmZiA9PiBhZGRmKGZmKSk7XG5cdFx0ZWxzZVxuXHRcdCAgICBhZGRmKGYpO1xuXHQgICAgfTtcblx0ICAgIGZvciAobGV0IGkgb2YgaWRzKXtcblx0XHRsZXQgZiA9IHRoaXMuY2Fub25pY2FsMmZlYXRzW2ldIHx8IHRoaXMuaWQyZmVhdFtpXTtcblx0XHRmICYmIGFkZChmKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmZWF0cztcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQ2FjaGVkRGF0YSAoKSB7XG5cdGNvbnNvbGUubG9nKFwiRmVhdHVyZU1hbmFnZXI6IENhY2hlIGNsZWFyZWQuXCIpXG4gICAgICAgIHJldHVybiB0aGlzLmZTdG9yZS5jbGVhcigpO1xuICAgIH1cblxufSAvLyBlbmQgY2xhc3MgRmVhdHVyZSBNYW5hZ2VyXG5cbmV4cG9ydCB7IEZlYXR1cmVNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBTdG9yZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihkYk5hbWUgPSAna2V5dmFsLXN0b3JlJywgc3RvcmVOYW1lID0gJ2tleXZhbCcpIHtcclxuICAgICAgICB0aGlzLnN0b3JlTmFtZSA9IHN0b3JlTmFtZTtcclxuICAgICAgICB0aGlzLl9kYnAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wZW5yZXEgPSBpbmRleGVkREIub3BlbihkYk5hbWUsIDEpO1xyXG4gICAgICAgICAgICBvcGVucmVxLm9uZXJyb3IgPSAoKSA9PiByZWplY3Qob3BlbnJlcS5lcnJvcik7XHJcbiAgICAgICAgICAgIG9wZW5yZXEub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZShvcGVucmVxLnJlc3VsdCk7XHJcbiAgICAgICAgICAgIC8vIEZpcnN0IHRpbWUgc2V0dXA6IGNyZWF0ZSBhbiBlbXB0eSBvYmplY3Qgc3RvcmVcclxuICAgICAgICAgICAgb3BlbnJlcS5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvcGVucmVxLnJlc3VsdC5jcmVhdGVPYmplY3RTdG9yZShzdG9yZU5hbWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgX3dpdGhJREJTdG9yZSh0eXBlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYnAudGhlbihkYiA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24odGhpcy5zdG9yZU5hbWUsIHR5cGUpO1xyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gKCkgPT4gcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmFib3J0ID0gdHJhbnNhY3Rpb24ub25lcnJvciA9ICgpID0+IHJlamVjdCh0cmFuc2FjdGlvbi5lcnJvcik7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuc3RvcmVOYW1lKSk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG59XHJcbmxldCBzdG9yZTtcclxuZnVuY3Rpb24gZ2V0RGVmYXVsdFN0b3JlKCkge1xyXG4gICAgaWYgKCFzdG9yZSlcclxuICAgICAgICBzdG9yZSA9IG5ldyBTdG9yZSgpO1xyXG4gICAgcmV0dXJuIHN0b3JlO1xyXG59XHJcbmZ1bmN0aW9uIGdldChrZXksIHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIGxldCByZXE7XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZG9ubHknLCBzdG9yZSA9PiB7XHJcbiAgICAgICAgcmVxID0gc3RvcmUuZ2V0KGtleSk7XHJcbiAgICB9KS50aGVuKCgpID0+IHJlcS5yZXN1bHQpO1xyXG59XHJcbmZ1bmN0aW9uIHNldChrZXksIHZhbHVlLCBzdG9yZSA9IGdldERlZmF1bHRTdG9yZSgpKSB7XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZHdyaXRlJywgc3RvcmUgPT4ge1xyXG4gICAgICAgIHN0b3JlLnB1dCh2YWx1ZSwga2V5KTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGRlbChrZXksIHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkd3JpdGUnLCBzdG9yZSA9PiB7XHJcbiAgICAgICAgc3RvcmUuZGVsZXRlKGtleSk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBjbGVhcihzdG9yZSA9IGdldERlZmF1bHRTdG9yZSgpKSB7XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZHdyaXRlJywgc3RvcmUgPT4ge1xyXG4gICAgICAgIHN0b3JlLmNsZWFyKCk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBrZXlzKHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIGNvbnN0IGtleXMgPSBbXTtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkb25seScsIHN0b3JlID0+IHtcclxuICAgICAgICAvLyBUaGlzIHdvdWxkIGJlIHN0b3JlLmdldEFsbEtleXMoKSwgYnV0IGl0IGlzbid0IHN1cHBvcnRlZCBieSBFZGdlIG9yIFNhZmFyaS5cclxuICAgICAgICAvLyBBbmQgb3BlbktleUN1cnNvciBpc24ndCBzdXBwb3J0ZWQgYnkgU2FmYXJpLlxyXG4gICAgICAgIChzdG9yZS5vcGVuS2V5Q3Vyc29yIHx8IHN0b3JlLm9wZW5DdXJzb3IpLmNhbGwoc3RvcmUpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlc3VsdClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAga2V5cy5wdXNoKHRoaXMucmVzdWx0LmtleSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzdWx0LmNvbnRpbnVlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pLnRoZW4oKCkgPT4ga2V5cyk7XHJcbn1cblxuZXhwb3J0IHsgU3RvcmUsIGdldCwgc2V0LCBkZWwsIGNsZWFyLCBrZXlzIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9pZGIta2V5dmFsL2Rpc3QvaWRiLWtleXZhbC5tanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGluaXRPcHRMaXN0IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBBdXhEYXRhTWFuYWdlciB9IGZyb20gJy4vQXV4RGF0YU1hbmFnZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE5vdCBzdXJlIHdoZXJlIHRoaXMgc2hvdWxkIGdvXG5sZXQgc2VhcmNoVHlwZXMgPSBbe1xuICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5UGhlbm90eXBlXCIsXG4gICAgbGFiZWw6IFwiLi4uYnkgcGhlbm90eXBlIG9yIGRpc2Vhc2VcIixcbiAgICB0ZW1wbGF0ZTogXCJcIixcbiAgICBwbGFjZWhvbGRlcjogXCJQaGVuby9kaXNlYXNlIChNUC9ETykgdGVybSBvciBJRHNcIlxufSx7XG4gICAgbWV0aG9kOiBcImZlYXR1cmVzQnlGdW5jdGlvblwiLFxuICAgIGxhYmVsOiBcIi4uLmJ5IGNlbGx1bGFyIGZ1bmN0aW9uXCIsXG4gICAgdGVtcGxhdGU6IFwiXCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiR2VuZSBPbnRvbG9neSAoR08pIHRlcm1zIG9yIElEc1wiXG59LHtcbiAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeVBhdGh3YXlcIixcbiAgICBsYWJlbDogXCIuLi5ieSBwYXRod2F5XCIsXG4gICAgdGVtcGxhdGU6IFwiXCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiUmVhY3RvbWUgcGF0aHdheXMgbmFtZXMsIElEc1wiXG59LHtcbiAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeUlkXCIsXG4gICAgbGFiZWw6IFwiLi4uYnkgc3ltYm9sL0lEXCIsXG4gICAgdGVtcGxhdGU6IFwiXCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiTUdJIG5hbWVzLCBzeW5vbnltcywgZXRjLlwiXG59XTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgUXVlcnlNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLmNmZyA9IHNlYXJjaFR5cGVzO1xuXHR0aGlzLmF1eERhdGFNYW5hZ2VyID0gbmV3IEF1eERhdGFNYW5hZ2VyKCk7XG5cdHRoaXMuc2VsZWN0ID0gbnVsbDtcdC8vIG15IDxzZWxlY3Q+IGVsZW1lbnRcblx0dGhpcy50ZXJtID0gbnVsbDtcdC8vIG15IDxpbnB1dD4gZWxlbWVudFxuXHR0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdHRoaXMuc2VsZWN0ID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzZWFyY2h0eXBlXCJdJyk7XG5cdHRoaXMudGVybSAgID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzZWFyY2h0ZXJtXCJdJyk7XG5cdC8vXG5cdHRoaXMudGVybS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgdGhpcy5jZmdbMF0ucGxhY2Vob2xkZXIpXG5cdGluaXRPcHRMaXN0KHRoaXMuc2VsZWN0WzBdWzBdLCB0aGlzLmNmZywgYz0+Yy5tZXRob2QsIGM9PmMubGFiZWwpO1xuXHQvLyBXaGVuIHVzZXIgY2hhbmdlcyB0aGUgcXVlcnkgdHlwZSAoc2VsZWN0b3IpLCBjaGFuZ2UgdGhlIHBsYWNlaG9sZGVyIHRleHQuXG5cdHRoaXMuc2VsZWN0Lm9uKFwiY2hhbmdlXCIsICgpID0+IHtcblx0ICAgIGxldCBvcHQgPSB0aGlzLnNlbGVjdC5wcm9wZXJ0eShcInNlbGVjdGVkT3B0aW9uc1wiKVswXTtcblx0ICAgIHRoaXMudGVybS5hdHRyKFwicGxhY2Vob2xkZXJcIiwgb3B0Ll9fZGF0YV9fLnBsYWNlaG9sZGVyKVxuXHQgICAgXG5cdH0pO1xuXHQvLyBXaGVuIHVzZXIgZW50ZXJzIGEgc2VhcmNoIHRlcm0sIHJ1biBhIHF1ZXJ5XG5cdHRoaXMudGVybS5vbihcImNoYW5nZVwiLCAoKSA9PiB7XG5cdCAgICBsZXQgdGVybSA9IHRoaXMudGVybS5wcm9wZXJ0eShcInZhbHVlXCIpO1xuXHQgICAgdGhpcy50ZXJtLnByb3BlcnR5KFwidmFsdWVcIixcIlwiKTtcblx0ICAgIGxldCBzZWFyY2hUeXBlICA9IHRoaXMuc2VsZWN0LnByb3BlcnR5KFwidmFsdWVcIik7XG5cdCAgICBsZXQgbHN0TmFtZSA9IHRlcm07XG5cdCAgICBkMy5zZWxlY3QoXCIjbXlsaXN0c1wiKS5jbGFzc2VkKFwiYnVzeVwiLHRydWUpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHQgICAgdGhpcy5hdXhEYXRhTWFuYWdlcltzZWFyY2hUeXBlXSh0ZXJtKVx0Ly8gPC0gcnVuIHRoZSBxdWVyeVxuXHQgICAgICAudGhlbihmZWF0cyA9PiB7XG5cdFx0ICAvLyBGSVhNRSAtIHJlYWNob3ZlciAtIHRoaXMgd2hvbGUgaGFuZGxlclxuXHRcdCAgbGV0IGxzdCA9IHRoaXMuYXBwLmxpc3RNYW5hZ2VyLmNyZWF0ZUxpc3QobHN0TmFtZSwgZmVhdHMubWFwKGYgPT4gZi5wcmltYXJ5SWRlbnRpZmllcikpXG5cdFx0ICB0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGUobHN0KTtcblx0XHQgIC8vXG5cdFx0ICB0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzID0ge307XG5cdFx0ICBmZWF0cy5mb3JFYWNoKGYgPT4gdGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0c1tmLmNhbm9uaWNhbF0gPSBmLmNhbm9uaWNhbCk7XG5cdFx0ICB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoKTtcblx0XHQgIC8vXG5cdFx0ICB0aGlzLmFwcC5zZXRDdXJyZW50TGlzdChsc3QsdHJ1ZSk7XG5cdFx0ICAvL1xuXHRcdCAgZDMuc2VsZWN0KFwiI215bGlzdHNcIikuY2xhc3NlZChcImJ1c3lcIixmYWxzZSk7XG5cdCAgICAgIH0pO1xuXHR9KVxuICAgIH1cbn1cblxuZXhwb3J0IHsgUXVlcnlNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9RdWVyeU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGQzanNvbiwgZDN0ZXh0IH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVGhpcyBiZWxvbmdzIGluIGEgY29uZmlnIGJ1dCBmb3Igbm93Li4uXG5sZXQgTW91c2VNaW5lID0gJ3B1YmxpYyc7IC8vIG9uZSBvZjogcHVibGljLCB0ZXN0LCBkZXZcblxubGV0IE1JTkVTID0ge1xuICAgICdkZXYnIDogJ2h0dHA6Ly9iaG1naW1tLWRldjo4MDgwL21vdXNlbWluZScsXG4gICAgJ3Rlc3QnOiAnaHR0cDovL3Rlc3QubW91c2VtaW5lLm9yZy9tb3VzZW1pbmUnLFxuICAgICdwdWJsaWMnIDogJ2h0dHA6Ly93d3cubW91c2VtaW5lLm9yZy9tb3VzZW1pbmUnLFxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBdXhEYXRhTWFuYWdlciAtIGtub3dzIGhvdyB0byBxdWVyeSBhbiBleHRlcm5hbCBzb3VyY2UgKGkuZS4sIE1vdXNlTWluZSkgZm9yIGdlbmVzXG4vLyBhbm5vdGF0ZWQgdG8gZGlmZmVyZW50IG9udG9sb2dpZXMuIFxuY2xhc3MgQXV4RGF0YU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcblx0aWYgKCFNSU5FU1tNb3VzZU1pbmVdKSBcblx0ICAgIHRocm93IFwiVW5rbm93biBtaW5lIG5hbWU6IFwiICsgTW91c2VNaW5lO1xuXHR0aGlzLmJhc2VVcmwgPSBNSU5FU1tNb3VzZU1pbmVdO1xuXHRjb25zb2xlLmxvZyhcIk1vdXNlTWluZSB1cmw6XCIsIHRoaXMuYmFzZVVybCk7XG4gICAgICAgIHRoaXMucVVybCA9IHRoaXMuYmFzZVVybCArICcvc2VydmljZS9xdWVyeS9yZXN1bHRzPyc7XG5cdHRoaXMuclVybCA9IHRoaXMuYmFzZVVybCArICcvcG9ydGFsLmRvP2NsYXNzPVNlcXVlbmNlRmVhdHVyZSZleHRlcm5hbGlkcz0nXG5cdHRoaXMuZmFVcmwgPSB0aGlzLmJhc2VVcmwgKyAnL3NlcnZpY2UvcXVlcnkvcmVzdWx0cy9mYXN0YT8nO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRBdXhEYXRhIChxLCBmb3JtYXQpIHtcblx0Y29uc29sZS5sb2coJ1F1ZXJ5OiAnICsgcSk7XG5cdGZvcm1hdCA9IGZvcm1hdCB8fCAnanNvbm9iamVjdHMnO1xuXHRsZXQgcXVlcnkgPSBlbmNvZGVVUklDb21wb25lbnQocSk7XG5cdGxldCB1cmwgPSB0aGlzLnFVcmwgKyBgZm9ybWF0PSR7Zm9ybWF0fSZxdWVyeT0ke3F1ZXJ5fWA7XG5cdHJldHVybiBkM2pzb24odXJsKS50aGVuKGRhdGEgPT4gZGF0YS5yZXN1bHRzfHxbXSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaXNJZGVudGlmaWVyIChxKSB7XG4gICAgICAgIGxldCBwdHMgPSBxLnNwbGl0KCc6Jyk7XG4gICAgICAgIGlmIChwdHMubGVuZ3RoID09PSAyICYmIHB0c1sxXS5tYXRjaCgvXlswLTldKyQvKSlcblx0ICAgIHJldHVybiB0cnVlO1xuXHRpZiAocS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoJ3ItbW11LScpKVxuXHQgICAgcmV0dXJuIHRydWU7XG5cdHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYWRkV2lsZGNhcmRzIChxKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5pc0lkZW50aWZpZXIocSkgfHwgcS5pbmRleE9mKCcqJyk+PTApID8gcSA6IGAqJHtxfSpgO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBkbyBhIExPT0tVUCBxdWVyeSBmb3IgU2VxdWVuY2VGZWF0dXJlcyBmcm9tIE1vdXNlTWluZVxuICAgIGZlYXR1cmVzQnlMb29rdXAgKHFyeVN0cmluZykge1xuXHRsZXQgcSA9IGA8cXVlcnkgbmFtZT1cIlwiIG1vZGVsPVwiZ2Vub21pY1wiIFxuXHQgICAgdmlldz1cIlNlcXVlbmNlRmVhdHVyZS5wcmltYXJ5SWRlbnRpZmllciBTZXF1ZW5jZUZlYXR1cmUuc3ltYm9sXCIgXG5cdCAgICBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCIGFuZCBDXCI+XG5cdFx0PGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlXCIgb3A9XCJMT09LVVBcIiB2YWx1ZT1cIiR7cXJ5U3RyaW5nfVwiLz5cblx0XHQ8Y29uc3RyYWludCBjb2RlPVwiQlwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub3JnYW5pc20udGF4b25JZFwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdFx0PGNvbnN0cmFpbnQgY29kZT1cIkNcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLnNlcXVlbmNlT250b2xvZ3lUZXJtLm5hbWVcIiBvcD1cIiE9XCIgdmFsdWU9XCJ0cmFuc2dlbmVcIi8+XG5cdCAgICA8L3F1ZXJ5PmA7XG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZlYXR1cmVzQnlPbnRvbG9neVRlcm0gKHFyeVN0cmluZywgdGVybVR5cGVzKSB7XG5cdHFyeVN0cmluZyA9IHRoaXMuYWRkV2lsZGNhcmRzKHFyeVN0cmluZyk7XG4gICAgICAgIGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgdmlldz1cIlNlcXVlbmNlRmVhdHVyZS5wcmltYXJ5SWRlbnRpZmllciBTZXF1ZW5jZUZlYXR1cmUuc3ltYm9sXCIgY29uc3RyYWludExvZ2ljPVwiQSBhbmQgQiBhbmQgQyBhbmQgRFwiPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm0ucGFyZW50c1wiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJCXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vcmdhbmlzbS50YXhvbklkXCIgb3A9XCI9XCIgdmFsdWU9XCIxMDA5MFwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkNcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLnNlcXVlbmNlT250b2xvZ3lUZXJtLm5hbWVcIiBvcD1cIiE9XCIgdmFsdWU9XCJ0cmFuc2dlbmVcIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJEXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vbnRvbG9neUFubm90YXRpb25zLm9udG9sb2d5VGVybS5vbnRvbG9neS5uYW1lXCIgb3A9XCJPTkUgT0ZcIj5cblx0XHQgICR7IHRlcm1UeXBlcy5tYXAodHQ9PiAnPHZhbHVlPicrdHQrJzwvdmFsdWU+Jykuam9pbignJykgfVxuXHQgICAgICA8L2NvbnN0cmFpbnQ+XG5cdCAgPC9xdWVyeT5gXG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZlYXR1cmVzQnlQYXRod2F5VGVybSAocXJ5U3RyaW5nKSB7XG5cdHFyeVN0cmluZyA9IHRoaXMuYWRkV2lsZGNhcmRzKHFyeVN0cmluZyk7XG4gICAgICAgIGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgdmlldz1cIkdlbmUucHJpbWFyeUlkZW50aWZpZXIgR2VuZS5zeW1ib2xcIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCXCI+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJHZW5lLnBhdGh3YXlzXCIgY29kZT1cIkFcIiBvcD1cIkxPT0tVUFwiIHZhbHVlPVwiJHtxcnlTdHJpbmd9XCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBwYXRoPVwiR2VuZS5vcmdhbmlzbS50YXhvbklkXCIgY29kZT1cIkJcIiBvcD1cIj1cIiB2YWx1ZT1cIjEwMDkwXCIvPlxuXHQgIDwvcXVlcnk+YDtcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZmVhdHVyZXNCeUlkICAgICAgICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlMb29rdXAocXJ5U3RyaW5nKTsgfVxuICAgIGZlYXR1cmVzQnlGdW5jdGlvbiAgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5T250b2xvZ3lUZXJtKHFyeVN0cmluZywgW1wiR2VuZSBPbnRvbG9neVwiXSk7IH1cbiAgICBmZWF0dXJlc0J5UGhlbm90eXBlIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeU9udG9sb2d5VGVybShxcnlTdHJpbmcsIFtcIk1hbW1hbGlhbiBQaGVub3R5cGVcIixcIkRpc2Vhc2UgT250b2xvZ3lcIl0pOyB9XG4gICAgZmVhdHVyZXNCeVBhdGh3YXkgICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlQYXRod2F5VGVybShxcnlTdHJpbmcpOyB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIGFsbCBleG9ucyBvZiBmZWF0dXJlcyBvdmVybGFwcGluZyBhIHNwZWNpZmllZCByYW5nZSBpbiB0aGUgc3BlY2lmZWQgZ2Vub21lLlxuICAgIC8vIEVxdWl2YWxlbnRseTogZm9yIGV2ZXJ5IGZlYXR1cmUgdGhhdCBvdmVybGFwcyB0aGUgZ2l2ZW4gcmFuZ2UgaW4gdGhlIGdpdmVuIGdlbm9tZSwgcmV0dXJucyBwcm9taXNlIFxuICAgIC8vIGZvciBhbGwgaXRzIGV4b25zIGluIHRoYXQgZ2Vub21lLlxuICAgIGV4b25zQnlSYW5nZVx0KGdlbm9tZSwgY2hyLCBzdGFydCwgZW5kKSB7XG5cdGxldCB2aWV3ID0gW1xuXHQnRXhvbi5nZW5lLnByaW1hcnlJZGVudGlmaWVyJyxcblx0J0V4b24udHJhbnNjcmlwdHMucHJpbWFyeUlkZW50aWZpZXInLFxuXHQnRXhvbi5wcmltYXJ5SWRlbnRpZmllcicsXG5cdCdFeG9uLmNocm9tb3NvbWUucHJpbWFyeUlkZW50aWZpZXInLFxuXHQnRXhvbi5jaHJvbW9zb21lTG9jYXRpb24uc3RhcnQnLFxuXHQnRXhvbi5jaHJvbW9zb21lTG9jYXRpb24uZW5kJyxcblx0J0V4b24uc3RyYWluLm5hbWUnXG5cdF0uam9pbignICcpO1xuICAgICAgICBsZXQgcSA9IGA8cXVlcnkgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIiR7dmlld31cIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCXCI+XG5cdCAgICA8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJFeG9uLmdlbmUuY2hyb21vc29tZUxvY2F0aW9uXCIgb3A9XCJPVkVSTEFQU1wiPlxuXHRcdDx2YWx1ZT4ke2Nocn06JHtzdGFydH0uLiR7ZW5kfTwvdmFsdWU+XG5cdCAgICA8L2NvbnN0cmFpbnQ+XG5cdCAgICA8Y29uc3RyYWludCBjb2RlPVwiQlwiIHBhdGg9XCJFeG9uLnN0cmFpbi5uYW1lXCIgb3A9XCI9XCIgdmFsdWU9XCIke2dlbm9tZX1cIi8+XG5cdCAgICA8L3F1ZXJ5PmBcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxLCdqc29uJyk7XG4gICAgfVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIGZvciBhbGwgZXhvbnMgb2YgYWxsIGdlbm9sb2dzIG9mIHRoZSBzcGVjaWZpZWQgY2Fub25pY2FsIGdlbmVcbiAgICBleG9uc0J5Q2Fub25pY2FsSWRcdChpZGVudCkge1xuXHRsZXQgdmlldyA9IFtcblx0J0V4b24uZ2VuZS5wcmltYXJ5SWRlbnRpZmllcicsXG5cdCdFeG9uLnRyYW5zY3JpcHRzLnByaW1hcnlJZGVudGlmaWVyJyxcblx0J0V4b24ucHJpbWFyeUlkZW50aWZpZXInLFxuXHQnRXhvbi5jaHJvbW9zb21lLnByaW1hcnlJZGVudGlmaWVyJyxcblx0J0V4b24uY2hyb21vc29tZUxvY2F0aW9uLnN0YXJ0Jyxcblx0J0V4b24uY2hyb21vc29tZUxvY2F0aW9uLmVuZCcsXG5cdCdFeG9uLnN0cmFpbi5uYW1lJ1xuXHRdLmpvaW4oJyAnKTtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCIke3ZpZXd9XCIgPlxuXHQgICAgPGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiRXhvbi5nZW5lLmNhbm9uaWNhbC5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIiAvPlxuXHQgICAgPC9xdWVyeT5gXG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSwnanNvbicpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDb25zdHJ1Y3RzIGEgVVJMIGZvciBsaW5raW5nIHRvIGEgTW91c2VNaW5lIHJlcG9ydCBwYWdlIGJ5IGlkXG4gICAgbGlua1RvUmVwb3J0UGFnZSAoaWRlbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuclVybCArIGlkZW50O1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDb25zdHJ1Y3RzIGEgVVJMIHRvIHJldHJpZXZlIG1vdXNlIHNlcXVlbmNlcyBmcm9tIE1vdXNlTWluZSBmb3IgdGhlIHNwZWNpZmllZCBmZWF0dXJlLlxuICAgIHNlcXVlbmNlc0ZvckZlYXR1cmUgKGYsIHR5cGUsIGdlbm9tZXMpIHtcblx0bGV0IHE7XG5cdGxldCB1cmw7XG5cdGxldCB2aWV3O1xuXHRsZXQgaWRlbnQ7XG4gICAgICAgIC8vXG5cdHR5cGUgPSB0eXBlID8gdHlwZS50b0xvd2VyQ2FzZSgpIDogJ2dlbm9taWMnO1xuXHQvL1xuXHRpZiAoZi5jYW5vbmljYWwpIHtcblx0ICAgIGlkZW50ID0gZi5jYW5vbmljYWxcblx0ICAgIC8vXG5cdCAgICBsZXQgZ3MgPSAnJ1xuXHQgICAgbGV0IHZhbHM7XG5cdCAgICBpZiAoZ2Vub21lcykge1xuXHRcdHZhbHMgPSBnZW5vbWVzLm1hcCgoZykgPT4gYDx2YWx1ZT4ke2d9PC92YWx1ZT5gKS5qb2luKCcnKTtcblx0ICAgIH1cblx0ICAgIHN3aXRjaCAodHlwZSkge1xuXHQgICAgY2FzZSAnZ2Vub21pYyc6XG5cdFx0dmlldyA9ICdHZW5lLmNhbm9uaWNhbC5wcmltYXJ5SWRlbnRpZmllcic7XG5cdFx0Z3MgPSBgPGNvbnN0cmFpbnQgcGF0aD1cIkdlbmUuc3RyYWluLm5hbWVcIiBvcD1cIk9ORSBPRlwiPiR7dmFsc308L2NvbnN0cmFpbnQ+YFxuXHRcdHEgPSBgPHF1ZXJ5IG5hbWU9XCJzZXF1ZW5jZXNCeUNhbm9uaWNhbElkXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIkdlbmUucHJpbWFyeUlkZW50aWZpZXJcIiA+XG5cdFx0ICAgIDxjb25zdHJhaW50IHBhdGg9XCJHZW5lLmNhbm9uaWNhbC5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIi8+XG5cdFx0ICAgICR7Z3N9PC9xdWVyeT5gO1xuXHRcdGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd0cmFuc2NyaXB0Jzpcblx0XHR2aWV3ID0gJ1RyYW5zY3JpcHQuZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXInO1xuXHRcdGdzID0gYDxjb25zdHJhaW50IHBhdGg9XCJUcmFuc2NyaXB0LnN0cmFpbi5uYW1lXCIgb3A9XCJPTkUgT0ZcIj4ke3ZhbHN9PC9jb25zdHJhaW50PmBcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwidHJhbnNjcmlwdFNlcXVlbmNlc0J5Q2Fub25pY2FsSWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiVHJhbnNjcmlwdC5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlRyYW5zY3JpcHQuZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgICAke2dzfTwvcXVlcnk+YDtcblx0ICAgICAgICBicmVhaztcblxuXHQgICAgY2FzZSAnZXhvbic6XG5cdFx0dmlldyA9ICdFeG9uLmdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyJztcblx0XHRncyA9IGA8Y29uc3RyYWludCBwYXRoPVwiRXhvbi5zdHJhaW4ubmFtZVwiIG9wPVwiT05FIE9GXCI+JHt2YWxzfTwvY29uc3RyYWludD5gXG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cImV4b25TZXF1ZW5jZXNCeUNhbm9uaWNhbElkXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIkV4b24ucHJpbWFyeUlkZW50aWZpZXJcIiA+XG5cdFx0ICAgIDxjb25zdHJhaW50IHBhdGg9XCJFeG9uLmdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiLz5cblx0XHQgICAgJHtnc308L3F1ZXJ5PmA7XG5cdCAgICAgICAgYnJlYWs7XG5cdCAgICBjYXNlICdjZHMnOlxuXHRcdHZpZXcgPSAnQ0RTLmdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyJztcblx0XHRncyA9IGA8Y29uc3RyYWludCBwYXRoPVwiQ0RTLnN0cmFpbi5uYW1lXCIgb3A9XCJPTkUgT0ZcIj4ke3ZhbHN9PC9jb25zdHJhaW50PmBcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwiY2RzU2VxdWVuY2VzQnlDYW5vbmljYWxJZFwiIG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCJDRFMucHJpbWFyeUlkZW50aWZpZXJcIiA+XG5cdFx0ICAgIDxjb25zdHJhaW50IHBhdGg9XCJDRFMuZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgICAke2dzfTwvcXVlcnk+YDtcblx0ICAgICAgICBicmVhaztcblx0ICAgIH1cblx0fVxuXHRlbHNlIHtcblx0ICAgIGlkZW50ID0gZi5JRDtcblx0ICAgIHZpZXcgPSAnJ1xuXHQgICAgc3dpdGNoICh0eXBlKSB7XG5cdCAgICBjYXNlICdnZW5vbWljJzpcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwic2VxdWVuY2VzQnlJZFwiIG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCJHZW5lLnByaW1hcnlJZGVudGlmaWVyXCIgPlxuXHRcdCAgICA8Y29uc3RyYWludCBwYXRoPVwiR2VuZS5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIi8+XG5cdFx0ICA8L3F1ZXJ5PmA7XG5cdFx0YnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0cmFuc2NyaXB0Jzpcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwidHJhbnNjcmlwdFNlcXVlbmNlc0J5SWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiVHJhbnNjcmlwdC5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlRyYW5zY3JpcHQuZ2VuZS5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIi8+XG5cdFx0ICA8L3F1ZXJ5PmA7XG5cdCAgICAgICAgYnJlYWs7XG5cdCAgICBjYXNlICdleG9uJzpcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwiZXhvblNlcXVlbmNlc0J5SWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiRXhvbi5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkV4b24uZ2VuZS5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIi8+XG5cdFx0ICA8L3F1ZXJ5PmA7XG5cdCAgICAgICAgYnJlYWs7XG5cdCAgICBjYXNlICdjZHMnOlxuXHRcdHEgPSBgPHF1ZXJ5IG5hbWU9XCJjZHNTZXF1ZW5jZXNCeUlkXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIkNEUy5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkNEUy5nZW5lLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiLz5cblx0XHQgIDwvcXVlcnk+YDtcblx0ICAgICAgICBicmVhaztcblx0ICAgIH1cblx0fVxuXHRpZiAoIXEpIHJldHVybiBudWxsO1xuXHRjb25zb2xlLmxvZyhxLCB2aWV3KTtcblx0dXJsID0gdGhpcy5mYVVybCArIGBxdWVyeT0ke2VuY29kZVVSSUNvbXBvbmVudChxKX1gO1xuXHRpZiAodmlldylcbiAgICAgICAgICAgIHVybCArPSBgJnZpZXc9JHtlbmNvZGVVUklDb21wb25lbnQodmlldyl9YDtcblx0cmV0dXJuIHVybDtcbiAgICB9XG59XG5cbmV4cG9ydCB7IEF1eERhdGFNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9BdXhEYXRhTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgTGlzdEZvcm11bGFFdmFsdWF0b3IgfSBmcm9tICcuL0xpc3RGb3JtdWxhRXZhbHVhdG9yJztcbmltcG9ydCB7IEtleVN0b3JlIH0gZnJvbSAnLi9LZXlTdG9yZSc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTWFpbnRhaW5zIG5hbWVkIGxpc3RzIG9mIElEcy4gTGlzdHMgbWF5IGJlIHRlbXBvcmFyeSwgbGFzdGluZyBvbmx5IGZvciB0aGUgc2Vzc2lvbiwgb3IgcGVybWFuZW50LFxuLy8gbGFzdGluZyB1bnRpbCB0aGUgdXNlciBjbGVhcnMgdGhlIGJyb3dzZXIgbG9jYWwgc3RvcmFnZSBhcmVhLlxuLy9cbi8vIFVzZXMgd2luZG93LnNlc3Npb25TdG9yYWdlIGFuZCB3aW5kb3cubG9jYWxTdG9yYWdlIHRvIHNhdmUgbGlzdHNcbi8vIHRlbXBvcmFyaWx5IG9yIHBlcm1hbmVudGx5LCByZXNwLiAgRklYTUU6IHNob3VsZCBiZSB1c2luZyB3aW5kb3cuaW5kZXhlZERCXG4vL1xuY2xhc3MgTGlzdE1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMubmFtZTJsaXN0ID0gbnVsbDtcblx0dGhpcy5saXN0U3RvcmUgPSBuZXcgS2V5U3RvcmUoJ3VzZXItbGlzdHMnKTtcblx0dGhpcy5mb3JtdWxhRXZhbCA9IG5ldyBMaXN0Rm9ybXVsYUV2YWx1YXRvcih0aGlzKTtcblx0dGhpcy5yZWFkeSA9IHRoaXMuX2xvYWQoKS50aGVuKCAoKT0+dGhpcy5pbml0RG9tKCkgKTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdC8vIEJ1dHRvbjogc2hvdy9oaWRlIHdhcm5pbmcgbWVzc2FnZVxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uLndhcm5pbmcnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHtcblx0ICAgICAgICBsZXQgdyA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwibWVzc2FnZVwiXScpO1xuXHRcdHcuY2xhc3NlZCgnc2hvd2luZycsICF3LmNsYXNzZWQoJ3Nob3dpbmcnKSk7XG5cdCAgICB9KTtcblx0Ly8gQnV0dG9uOiBjcmVhdGUgbGlzdCBmcm9tIGN1cnJlbnQgc2VsZWN0aW9uXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cIm5ld2Zyb21zZWxlY3Rpb25cIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGxldCBpZHMgPSBuZXcgU2V0KE9iamVjdC5rZXlzKHRoaXMuYXBwLnpvb21WaWV3LmhpRmVhdHMpKTsgLy8gRklYTUUgLSByZWFjaG92ZXJcblx0XHRsZXQgbHN0ID0gdGhpcy5hcHAuZ2V0Q3VycmVudExpc3QoKTtcblx0XHRpZiAobHN0KVxuXHRcdCAgICBpZHMgPSBpZHMudW5pb24obHN0Lmlkcyk7XG5cdFx0aWYgKGlkcy5zaXplID09PSAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTm90aGluZyBzZWxlY3RlZC5cIik7XG5cdFx0ICAgIHJldHVybjtcblx0XHR9XG5cdFx0bGV0IG5ld2xpc3QgPSB0aGlzLmNyZWF0ZUxpc3QoXCJzZWxlY3Rpb25cIiwgQXJyYXkuZnJvbShpZHMpKTtcblx0XHR0aGlzLnVwZGF0ZShuZXdsaXN0KTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbjogY29tYmluZSBsaXN0czogb3BlbiBsaXN0IGVkaXRvciB3aXRoIGZvcm11bGEgZWRpdG9yIG9wZW5cblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiY29tYmluZVwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0aWYgKHRoaXMuZ2V0TmFtZXMoKS5sZW5ndGggPT09IDApIHtcblx0XHQgICAgYWxlcnQoXCJObyBsaXN0cy5cIik7XG5cdFx0ICAgIHJldHVybjtcblx0XHR9XG5cdFx0bGV0IGxlID0gdGhpcy5hcHAubGlzdEVkaXRvcjtcblx0XHRsZS5vcGVuKCk7XG5cdFx0bGUub3BlbkZvcm11bGFFZGl0b3IoKTtcblx0ICAgIH0pO1xuXHQvLyBCdXR0b246IGRlbGV0ZSBhbGwgbGlzdHMgKGdldCBjb25maXJtYXRpb24gZmlyc3QpLlxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJwdXJnZVwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0aWYgKHRoaXMuZ2V0TmFtZXMoKS5sZW5ndGggPT09IDApIHtcblx0XHQgICAgYWxlcnQoXCJObyBsaXN0cy5cIik7XG5cdFx0ICAgIHJldHVybjtcblx0XHR9XG5cdCAgICAgICAgaWYgKHdpbmRvdy5jb25maXJtKFwiRGVsZXRlIGFsbCBsaXN0cy4gQXJlIHlvdSBzdXJlP1wiKSkge1xuXHRcdCAgICB0aGlzLnB1cmdlKCk7XG5cdFx0ICAgIHRoaXMudXBkYXRlKCk7XG5cdFx0fVxuXHQgICAgfSk7XG4gICAgfVxuICAgIF9sb2FkICgpIHtcblx0cmV0dXJuIHRoaXMubGlzdFN0b3JlLmdldChcImFsbFwiKS50aGVuKGFsbCA9PiB7XG5cdCAgICB0aGlzLm5hbWUybGlzdCA9IGFsbCB8fCB7fTtcblx0fSk7XG4gICAgfVxuICAgIF9zYXZlICgpIHtcblx0cmV0dXJuIHRoaXMubGlzdFN0b3JlLnNldChcImFsbFwiLCB0aGlzLm5hbWUybGlzdClcbiAgICB9XG4gICAgLy9cbiAgICAvLyByZXR1cm5zIHRoZSBuYW1lcyBvZiBhbGwgdGhlIGxpc3RzLCBzb3J0ZWRcbiAgICBnZXROYW1lcyAoKSB7XG4gICAgICAgIGxldCBubXMgPSBPYmplY3Qua2V5cyh0aGlzLm5hbWUybGlzdCk7XG5cdG5tcy5zb3J0KCk7XG5cdHJldHVybiBubXM7XG4gICAgfVxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZmYgYSBsaXN0IGV4aXN0cyB3aXRoIHRoaXMgbmFtZVxuICAgIGhhcyAobmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZSBpbiB0aGlzLm5hbWUybGlzdDtcbiAgICB9XG4gICAgLy8gSWYgbm8gbGlzdCB3aXRoIHRoZSBnaXZlbiBuYW1lIGV4aXN0cywgcmV0dXJuIHRoZSBuYW1lLlxuICAgIC8vIE90aGVyd2lzZSwgcmV0dXJuIGEgbW9kaWZpZWQgdmVyc2lvbiBvZiBuYW1lIHRoYXQgaXMgdW5pcXVlLlxuICAgIC8vIFVuaXF1ZSBuYW1lcyBhcmUgY3JlYXRlZCBieSBhcHBlbmRpbmcgYSBjb3VudGVyLlxuICAgIC8vIEUuZy4sIHVuaXF1aWZ5KFwiZm9vXCIpIC0+IFwiZm9vLjFcIiBvciBcImZvby4yXCIgb3Igd2hhdGV2ZXIuXG4gICAgLy9cbiAgICB1bmlxdWlmeSAobmFtZSkge1xuXHRpZiAoIXRoaXMuaGFzKG5hbWUpKSBcblx0ICAgIHJldHVybiBuYW1lO1xuXHRmb3IgKGxldCBpID0gMTsgOyBpICs9IDEpIHtcblx0ICAgIGxldCBubiA9IGAke25hbWV9LiR7aX1gO1xuXHQgICAgaWYgKCF0aGlzLmhhcyhubikpXG5cdCAgICAgICAgcmV0dXJuIG5uO1xuXHR9XG4gICAgfVxuICAgIC8vIHJldHVybnMgdGhlIGxpc3Qgd2l0aCB0aGlzIG5hbWUsIG9yIG51bGwgaWYgbm8gc3VjaCBsaXN0XG4gICAgZ2V0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLm5hbWUybGlzdFtuYW1lXTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIHJldHVybnMgYWxsIHRoZSBsaXN0cywgc29ydGVkIGJ5IG5hbWVcbiAgICBnZXRBbGwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXROYW1lcygpLm1hcChuID0+IHRoaXMuZ2V0KG4pKVxuICAgIH1cbiAgICAvLyBcbiAgICBjcmVhdGVPclVwZGF0ZSAobmFtZSwgaWRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMudXBkYXRlTGlzdChuYW1lLG51bGwsaWRzKSA6IHRoaXMuY3JlYXRlTGlzdChuYW1lLCBpZHMpO1xuICAgIH1cbiAgICAvLyBjcmVhdGVzIGEgbmV3IGxpc3Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgaWRzLlxuICAgIGNyZWF0ZUxpc3QgKG5hbWUsIGlkcywgZm9ybXVsYSkge1xuXHRpZiAobmFtZSAhPT0gXCJfXCIpXG5cdCAgICBuYW1lID0gdGhpcy51bmlxdWlmeShuYW1lKTtcblx0Ly9cblx0bGV0IGR0ID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMubmFtZTJsaXN0W25hbWVdID0ge1xuXHQgICAgbmFtZTogICAgIG5hbWUsXG5cdCAgICBpZHM6ICAgICAgaWRzLFxuXHQgICAgZm9ybXVsYTogIGZvcm11bGEgfHwgXCJcIixcblx0ICAgIGNyZWF0ZWQ6ICBkdCxcblx0ICAgIG1vZGlmaWVkOiBkdFxuXHR9O1xuXHR0aGlzLl9zYXZlKCk7XG5cdHJldHVybiB0aGlzLm5hbWUybGlzdFtuYW1lXTtcbiAgICB9XG4gICAgLy8gUHJvdmlkZSBhY2Nlc3MgdG8gZXZhbHVhdGlvbiBzZXJ2aWNlXG4gICAgZXZhbEZvcm11bGEgKGV4cHIpIHtcblx0cmV0dXJuIHRoaXMuZm9ybXVsYUV2YWwuZXZhbChleHByKTtcbiAgICB9XG4gICAgLy8gUmVmcmVzaGVzIGEgbGlzdCBhbmQgcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZWZyZXNoZWQgbGlzdC5cbiAgICAvLyBJZiB0aGUgbGlzdCBpZiBhIFBPTE8sIHByb21pc2UgcmVzb2x2ZXMgaW1tZWRpYXRlbHkgdG8gdGhlIGxpc3QuXG4gICAgLy8gT3RoZXJ3aXNlLCBzdGFydHMgYSByZWV2YWx1YXRpb24gb2YgdGhlIGZvcm11bGEgdGhhdCByZXNvbHZlcyBhZnRlciB0aGVcbiAgICAvLyBsaXN0J3MgaWRzIGhhdmUgYmVlbiB1cGRhdGVkLlxuICAgIC8vIElmIHRoZXJlIGlzIGFuIGVycm9yLCB0aGUgcmV0dXJuZWQgcHJvbWlzZSByZWplY3RzIHdpdGggdGhlIGVycm9yLlxuICAgIHJlZnJlc2hMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdGxzdC5tb2RpZmllZCA9IFwiXCIrbmV3IERhdGUoKTtcblx0aWYgKCFsc3QuZm9ybXVsYSlcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobHN0KTtcblx0ZWxzZSB7XG5cdCAgICBsZXQgcCA9IHRoaXMuZm9ybXVhbEV2YWwuZXZhbChsc3QuZm9ybXVsYSkudGhlbiggaWRzID0+IHtcblx0XHQgICAgbHN0LmlkcyA9IGlkcztcblx0XHQgICAgcmV0dXJuIGxzdDtcblx0XHR9KTtcblx0ICAgIHJldHVybiBwO1xuXHR9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlcyB0aGUgaWRzIGluIHRoZSBnaXZlbiBsaXN0XG4gICAgdXBkYXRlTGlzdCAobmFtZSwgbmV3bmFtZSwgbmV3aWRzLCBuZXdmb3JtdWxhKSB7XG5cdGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcbiAgICAgICAgaWYgKCEgbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuYW1lO1xuXHRpZiAobmV3bmFtZSkge1xuXHQgICAgZGVsZXRlIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXTtcblx0ICAgIGxzdC5uYW1lID0gdGhpcy51bmlxdWlmeShuZXduYW1lKTtcblx0ICAgIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXSA9IGxzdDtcblx0fVxuXHRpZiAobmV3aWRzKSBsc3QuaWRzICA9IG5ld2lkcztcblx0aWYgKG5ld2Zvcm11bGEgfHwgbmV3Zm9ybXVsYT09PVwiXCIpIGxzdC5mb3JtdWxhID0gbmV3Zm9ybXVsYTtcblx0bHN0Lm1vZGlmaWVkID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMuX3NhdmUoKTtcblx0cmV0dXJuIGxzdDtcbiAgICB9XG4gICAgLy8gZGVsZXRlcyB0aGUgc3BlY2lmaWVkIGxpc3RcbiAgICBkZWxldGVMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0ZGVsZXRlIHRoaXMubmFtZTJsaXN0W25hbWVdO1xuXHR0aGlzLl9zYXZlKCk7XG5cdC8vIEZJWE1FOiB1c2UgZXZlbnRzISFcblx0aWYgKGxzdCA9PT0gdGhpcy5hcHAuZ2V0Q3VycmVudExpc3QoKSkgdGhpcy5hcHAuc2V0Q3VycmVudExpc3QobnVsbCk7XG5cdGlmIChsc3QgPT09IHRoaXMuYXBwLmxpc3RFZGl0b3IubGlzdCkgdGhpcy5hcHAubGlzdEVkaXRvci5saXN0ID0gbnVsbDtcblx0cmV0dXJuIGxzdDtcbiAgICB9XG4gICAgLy8gZGVsZXRlIGFsbCBsaXN0c1xuICAgIHB1cmdlICgpIHtcbiAgICAgICAgdGhpcy5uYW1lMmxpc3QgPSB7fVxuXHR0aGlzLl9zYXZlKCk7XG5cdC8vXG5cdHRoaXMuYXBwLnNldEN1cnJlbnRMaXN0KG51bGwpO1xuXHR0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QgPSBudWxsOyAvLyBGSVhNRSAtIHJlYWNoYWNyb3NzXG4gICAgfVxuICAgIC8vIFJldHVybnMgdHJ1ZSBpZmYgZXhwciBpcyB2YWxpZCwgd2hpY2ggbWVhbnMgaXQgaXMgYm90aCBzeW50YWN0aWNhbGx5IGNvcnJlY3QgXG4gICAgLy8gYW5kIGFsbCBtZW50aW9uZWQgbGlzdHMgZXhpc3QuXG4gICAgaXNWYWxpZCAoZXhwcikge1xuXHRyZXR1cm4gdGhpcy5mb3JtdWxhRXZhbC5pc1ZhbGlkKGV4cHIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIHRoZSBcIk15IGxpc3RzXCIgYm94IHdpdGggdGhlIGN1cnJlbnRseSBhdmFpbGFibGUgbGlzdHMuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgIG5ld2xpc3QgKExpc3QpIG9wdGlvbmFsLiBJZiBzcGVjaWZpZWQsIHdlIGp1c3QgY3JlYXRlZCB0aGF0IGxpc3QsIGFuZCBpdHMgbmFtZSBpc1xuICAgIC8vICAgXHRhIGdlbmVyYXRlZCBkZWZhdWx0LiBQbGFjZSBmb2N1cyB0aGVyZSBzbyB1c2VyIGNhbiB0eXBlIG5ldyBuYW1lLlxuICAgIHVwZGF0ZSAobmV3bGlzdCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBsaXN0cyA9IHRoaXMuZ2V0QWxsKCk7XG5cdGxldCBieU5hbWUgPSAoYSxiKSA9PiB7XG5cdCAgICBsZXQgYW4gPSBhLm5hbWUudG9Mb3dlckNhc2UoKTtcblx0ICAgIGxldCBibiA9IGIubmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgcmV0dXJuIChhbiA8IGJuID8gLTEgOiBhbiA+IGJuID8gKzEgOiAwKTtcblx0fTtcblx0bGV0IGJ5RGF0ZSA9IChhLGIpID0+ICgobmV3IERhdGUoYi5tb2RpZmllZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLm1vZGlmaWVkKSkuZ2V0VGltZSgpKTtcblx0bGlzdHMuc29ydChieU5hbWUpO1xuXHRsZXQgaXRlbXMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImxpc3RzXCJdJykuc2VsZWN0QWxsKFwiLmxpc3RJbmZvXCIpXG5cdCAgICAuZGF0YShsaXN0cyk7XG5cdGxldCBuZXdpdGVtcyA9IGl0ZW1zLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJsaXN0SW5mbyBmbGV4cm93XCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcImlcIikuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29ucyBidXR0b25cIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLFwiZWRpdFwiKVxuXHQgICAgLnRleHQoXCJtb2RlX2VkaXRcIilcblx0ICAgIC5hdHRyKFwidGl0bGVcIixcIkVkaXQgdGhpcyBsaXN0LlwiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJzcGFuXCIpLmF0dHIoXCJuYW1lXCIsXCJuYW1lXCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcInNpemVcIik7XG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcImRhdGVcIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwiaVwiKS5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zIGJ1dHRvblwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJkZWxldGVcIilcblx0ICAgIC50ZXh0KFwiaGlnaGxpZ2h0X29mZlwiKVxuXHQgICAgLmF0dHIoXCJ0aXRsZVwiLFwiRGVsZXRlIHRoaXMgbGlzdC5cIik7XG5cblx0aWYgKG5ld2l0ZW1zWzBdWzBdKSB7XG5cdCAgICBsZXQgbGFzdCA9IG5ld2l0ZW1zWzBdW25ld2l0ZW1zWzBdLmxlbmd0aC0xXTtcblx0ICAgIGxhc3Quc2Nyb2xsSW50b1ZpZXcoKTtcblx0fVxuXG5cdGl0ZW1zXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgbHN0PT5sc3QubmFtZSlcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChsc3QpIHtcblx0XHRpZiAoZDMuZXZlbnQuYWx0S2V5KSB7XG5cdFx0ICAgIC8vIGFsdC1jbGljayBjb3BpZXMgdGhlIGxpc3QncyBuYW1lIGludG8gdGhlIGZvcm11bGEgZWRpdG9yXG5cdFx0ICAgIGxldCBsZSA9IHNlbGYuYXBwLmxpc3RFZGl0b3I7IC8vIEZJWE1FIHJlYWNob3ZlclxuXHRcdCAgICBsZXQgcyA9IGxzdC5uYW1lO1xuXHRcdCAgICBsZXQgcmUgPSAvWyA9KCkrKi1dLztcblx0XHQgICAgaWYgKHMuc2VhcmNoKHJlKSA+PSAwKVxuXHRcdFx0cyA9ICdcIicgKyBzICsgJ1wiJztcblx0XHQgICAgaWYgKCFsZS5pc0VkaXRpbmdGb3JtdWxhKSB7XG5cdFx0ICAgICAgICBsZS5vcGVuKCk7XG5cdFx0XHRsZS5vcGVuRm9ybXVsYUVkaXRvcigpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vXG5cdFx0ICAgIGxlLmFkZFRvTGlzdEV4cHIocysnICcpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChkMy5ldmVudC5zaGlmdEtleSkge1xuXHRcdCAgICAvLyBzaGlmdC1jbGljayBnb2VzIHRvIG5leHQgbGlzdCBlbGVtZW50IGlmIGl0J3MgdGhlIHNhbWUgbGlzdCxcblx0XHQgICAgLy8gb3IgZWxzZSBzZXRzIHRoZSBsaXN0IGFuZCBnb2VzIHRvIHRoZSBmaXJzdCBlbGVtZW50LlxuXHRcdCAgICBpZiAoc2VsZi5hcHAuZ2V0Q3VycmVudExpc3QoKSAhPT0gbHN0KVxuXHRcdFx0c2VsZi5hcHAuc2V0Q3VycmVudExpc3QobHN0LCB0cnVlKTtcblx0XHQgICAgZWxzZVxuXHRcdFx0c2VsZi5hcHAuZ29Ub05leHRMaXN0RWxlbWVudChsc3QpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHQgICAgLy8gcGxhaW4gY2xpY2sgc2V0cyB0aGUgc2V0IGlmIGl0J3MgYSBkaWZmZXJlbnQgbGlzdCxcblx0XHQgICAgLy8gb3IgZWxzZSB1bnNldHMgdGhlIGxpc3QuXG5cdFx0ICAgIGlmIChzZWxmLmFwcC5nZXRDdXJyZW50TGlzdCgpICE9PSBsc3QpXG5cdFx0ICAgICAgICBzZWxmLmFwcC5zZXRDdXJyZW50TGlzdChsc3QpO1xuXHRcdCAgICBlbHNlXG5cdFx0ICAgICAgICBzZWxmLmFwcC5zZXRDdXJyZW50TGlzdChudWxsKTtcblx0XHR9XG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJlZGl0XCJdJylcblx0ICAgIC8vIGVkaXQ6IGNsaWNrIFxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24obHN0KSB7XG5cdCAgICAgICAgc2VsZi5hcHAubGlzdEVkaXRvci5vcGVuKGxzdCk7XG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCdzcGFuW25hbWU9XCJuYW1lXCJdJylcblx0ICAgIC50ZXh0KGxzdCA9PiBsc3QubmFtZSk7XG5cdGl0ZW1zLnNlbGVjdCgnc3BhbltuYW1lPVwiZGF0ZVwiXScpLnRleHQobHN0ID0+IHtcblx0ICAgIGxldCBtZCA9IG5ldyBEYXRlKGxzdC5tb2RpZmllZCk7XG5cdCAgICBsZXQgZCA9IGAke21kLmdldEZ1bGxZZWFyKCl9LSR7bWQuZ2V0TW9udGgoKSsxfS0ke21kLmdldERhdGUoKX0gYCBcblx0ICAgICAgICAgICsgYDoke21kLmdldEhvdXJzKCl9LiR7bWQuZ2V0TWludXRlcygpfS4ke21kLmdldFNlY29uZHMoKX1gO1xuXHQgICAgcmV0dXJuIGQ7XG5cdH0pO1xuXHRpdGVtcy5zZWxlY3QoJ3NwYW5bbmFtZT1cInNpemVcIl0nKS50ZXh0KGxzdCA9PiBsc3QuaWRzLmxlbmd0aCk7XG5cdGl0ZW1zLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZGVsZXRlXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsIGxzdCA9PiB7XG5cdCAgICAgICAgdGhpcy5kZWxldGVMaXN0KGxzdC5uYW1lKTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXG5cdFx0Ly8gTm90IHN1cmUgd2h5IHRoaXMgaXMgbmVjZXNzYXJ5IGhlcmUuIEJ1dCB3aXRob3V0IGl0LCB0aGUgbGlzdCBpdGVtIGFmdGVyIHRoZSBvbmUgYmVpbmdcblx0XHQvLyBkZWxldGVkIGhlcmUgd2lsbCByZWNlaXZlIGEgY2xpY2sgZXZlbnQuXG5cdFx0ZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0Ly9cblx0ICAgIH0pO1xuXG5cdC8vXG5cdGl0ZW1zLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0aWYgKG5ld2xpc3QpIHtcblx0ICAgIGxldCBsc3RlbHQgPSBcblx0ICAgICAgICBkMy5zZWxlY3QoYCNteWxpc3RzIFtuYW1lPVwibGlzdHNcIl0gW25hbWU9XCIke25ld2xpc3QubmFtZX1cIl1gKVswXVswXTtcbiAgICAgICAgICAgIGxzdGVsdC5zY3JvbGxJbnRvVmlldyhmYWxzZSk7XG5cdH1cbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIExpc3RNYW5hZ2VyXG5cbmV4cG9ydCB7IExpc3RNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfSBmcm9tICcuL0xpc3RGb3JtdWxhUGFyc2VyJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBLbm93cyBob3cgdG8gcGFyc2UgYW5kIGV2YWx1YXRlIGEgbGlzdCBmb3JtdWxhIChha2EgbGlzdCBleHByZXNzaW9uKS5cbmNsYXNzIExpc3RGb3JtdWxhRXZhbHVhdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAobGlzdE1hbmFnZXIpIHtcblx0dGhpcy5saXN0TWFuYWdlciA9IGxpc3RNYW5hZ2VyO1xuICAgICAgICB0aGlzLnBhcnNlciA9IG5ldyBMaXN0Rm9ybXVsYVBhcnNlcigpO1xuICAgIH1cbiAgICAvLyBFdmFsdWF0ZXMgdGhlIGV4cHJlc3Npb24gYW5kIHJldHVybnMgYSBQcm9taXNlIGZvciB0aGUgbGlzdCBvZiBpZHMuXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gZXJyb3IsIHRoZSBwcm9taXNlIHJlamVjdHMgd2l0aCB0aGUgZXJyb3IgbWVzc2FnZS5cbiAgICBldmFsIChleHByKSB7XG5cdCByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICAgdHJ5IHtcblx0XHRsZXQgYXN0ID0gdGhpcy5wYXJzZXIucGFyc2UoZXhwcik7XG5cdFx0bGV0IGxtID0gdGhpcy5saXN0TWFuYWdlcjtcblx0XHRsZXQgcmVhY2ggPSAobikgPT4ge1xuXHRcdCAgICBpZiAodHlwZW9mKG4pID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdFx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG47XG5cdFx0XHRyZXR1cm4gbmV3IFNldChsc3QuaWRzKTtcblx0XHQgICAgfVxuXHRcdCAgICBlbHNlIHtcblx0XHRcdGxldCBsID0gcmVhY2gobi5sZWZ0KTtcblx0XHRcdGxldCByID0gcmVhY2gobi5yaWdodCk7XG5cdFx0XHRyZXR1cm4gbFtuLm9wXShyKTtcblx0XHQgICAgfVxuXHRcdH1cblx0XHRsZXQgaWRzID0gcmVhY2goYXN0KTtcblx0XHRyZXNvbHZlKEFycmF5LmZyb20oaWRzKSk7XG5cdCAgICB9XG5cdCAgICBjYXRjaCAoZSkge1xuXHRcdHJlamVjdChlKTtcblx0ICAgIH1cblx0IH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIC8vIENoZWNrcyB0aGUgY3VycmVudCBleHByZXNzaW9uIGZvciBzeW50YWN0aWMgYW5kIHNlbWFudGljIHZhbGlkaXR5IGFuZCBzZXRzIHRoZSBcbiAgICAvLyB2YWxpZC9pbnZhbGlkIGNsYXNzIGFjY29yZGluZ2x5LiBTZW1hbnRpYyB2YWxpZGl0eSBzaW1wbHkgbWVhbnMgYWxsIG5hbWVzIGluIHRoZVxuICAgIC8vIGV4cHJlc3Npb24gYXJlIGJvdW5kLlxuICAgIC8vXG4gICAgaXNWYWxpZCAgKGV4cHIpIHtcblx0dHJ5IHtcblx0ICAgIC8vIGZpcnN0IGNoZWNrIHN5bnRheFxuXHQgICAgbGV0IGFzdCA9IHRoaXMucGFyc2VyLnBhcnNlKGV4cHIpO1xuXHQgICAgbGV0IGxtICA9IHRoaXMubGlzdE1hbmFnZXI7IFxuXHQgICAgLy8gbm93IGNoZWNrIGxpc3QgbmFtZXNcblx0ICAgIChmdW5jdGlvbiByZWFjaChuKSB7XG5cdFx0aWYgKHR5cGVvZihuKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdCAgICBsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdCAgICBpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgblxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHQgICAgcmVhY2gobi5sZWZ0KTtcblx0XHQgICAgcmVhY2gobi5yaWdodCk7XG5cdFx0fVxuXHQgICAgfSkoYXN0KTtcblxuXHQgICAgLy8gVGh1bWJzIHVwIVxuXHQgICAgcmV0dXJuIHRydWU7XG5cdH1cblx0Y2F0Y2ggKGUpIHtcblx0ICAgIC8vIHN5bnRheCBlcnJvciBvciB1bmtub3duIGxpc3QgbmFtZVxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEZvcm11bGFFdmFsdWF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHNldENhcmV0UG9zaXRpb24sIG1vdmVDYXJldFBvc2l0aW9uLCBnZXRDYXJldFJhbmdlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9IGZyb20gJy4vTGlzdEZvcm11bGFQYXJzZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIExpc3RFZGl0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuXHRzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMucGFyc2VyID0gbmV3IExpc3RGb3JtdWxhUGFyc2VyKCk7XG5cdHRoaXMuZm9ybSA9IG51bGw7XG5cdHRoaXMuaW5pdERvbSgpO1xuXHR0aGlzLmlzRWRpdGluZ0Zvcm11bGEgPSBmYWxzZTtcblx0Ly9cblx0dGhpcy5saXN0ID0gbnVsbDtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0dGhpcy5mb3JtID0gdGhpcy5yb290LnNlbGVjdChcImZvcm1cIilbMF1bMF07XG5cdGlmICghdGhpcy5mb3JtKSB0aHJvdyBcIkNvdWxkIG5vdCBpbml0IExpc3RFZGl0b3IuIE5vIGZvcm0gZWxlbWVudC5cIjtcblx0ZDMuc2VsZWN0KHRoaXMuZm9ybSlcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgdCA9IGQzLmV2ZW50LnRhcmdldDtcblx0XHRpZiAoXCJidXR0b25cIiA9PT0gdC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpe1xuXHRcdCAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCAgICBsZXQgZiA9IHRoaXMuZm9ybTtcblx0XHQgICAgbGV0IHMgPSBmLmlkcy52YWx1ZS5yZXBsYWNlKC9bLHxdL2csICcgJykudHJpbSgpO1xuXHRcdCAgICBsZXQgaWRzID0gcyA/IHMuc3BsaXQoL1xccysvKSA6IFtdO1xuXHRcdCAgICAvLyBzYXZlIGxpc3Rcblx0XHQgICAgaWYgKHQubmFtZSA9PT0gXCJzYXZlXCIpIHtcblx0XHRcdGlmICghdGhpcy5saXN0KSByZXR1cm47XG5cdFx0XHR0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGVMaXN0KHRoaXMubGlzdC5uYW1lLCBmLm5hbWUudmFsdWUsIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNyZWF0ZSBuZXcgbGlzdFxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwibmV3XCIpIHtcblx0XHRcdGxldCBuID0gZi5uYW1lLnZhbHVlLnRyaW0oKTtcblx0XHRcdGlmICghbikge1xuXHRcdFx0ICAgYWxlcnQoXCJZb3VyIGxpc3QgaGFzIG5vIG5hbWUgYW5kIGlzIHZlcnkgc2FkLiBQbGVhc2UgZ2l2ZSBpdCBhIG5hbWUgYW5kIHRyeSBhZ2Fpbi5cIik7XG5cdFx0XHQgICByZXR1cm5cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKG4uaW5kZXhPZignXCInKSA+PSAwKSB7XG5cdFx0XHQgICBhbGVydChcIk9oIGRlYXIsIHlvdXIgbGlzdCdzIG5hbWUgaGFzIGEgZG91YmxlIHF1b3RlIGNoYXJhY3RlciwgYW5kIEknbSBhZmFyYWlkIHRoYXQncyBub3QgYWxsb3dlZC4gUGxlYXNlIHJlbW92ZSB0aGUgJ1xcXCInIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdFx0ICAgcmV0dXJuXG5cdFx0XHR9XG5cdFx0ICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5jcmVhdGVMaXN0KG4sIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNsZWFyIGZvcm1cblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcImNsZWFyXCIpIHtcblx0XHQgICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG5cdFx0ICAgIH1cblx0XHQgICAgLy8gZm9yd2FyZCB0byBNR0lcblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcInRvTWdpXCIpIHtcblx0XHQgICAgICAgIGxldCBmcm0gPSBkMy5zZWxlY3QoJyNtZ2liYXRjaGZvcm0nKVswXVswXTtcblx0XHRcdGZybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIiBcIik7XG5cdFx0XHRmcm0uc3VibWl0KClcblx0XHQgICAgfVxuXHRcdCAgICAvLyBmb3J3YXJkIHRvIE1vdXNlTWluZVxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwidG9Nb3VzZU1pbmVcIikge1xuXHRcdCAgICAgICAgbGV0IGZybSA9IGQzLnNlbGVjdCgnI21vdXNlbWluZWZvcm0nKVswXVswXTtcblx0XHRcdGZybS5leHRlcm5hbGlkcy52YWx1ZSA9IGlkcy5qb2luKFwiLFwiKTtcblx0XHRcdGZybS5zdWJtaXQoKVxuXHRcdCAgICB9XG5cdFx0fVxuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBzaG93L2hpZGUgZm9ybXVsYSBlZGl0b3Jcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNlY3Rpb25cIl0gLmJ1dHRvbltuYW1lPVwiZWRpdGZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGVGb3JtdWxhRWRpdG9yKCkpO1xuXHQgICAgXG5cdC8vIElucHV0IGJveDogZm9ybXVsYTogdmFsaWRhdGUgb24gYW55IGlucHV0XG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIHRoaXMudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBGb3J3YXJkIC0+IE1HSS9Nb3VzZU1pbmU6IGRpc2FibGUgYnV0dG9ucyBpZiBubyBpZHNcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIGxldCBlbXB0eSA9IHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMDtcblx0XHR0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0aGlzLmZvcm0udG9Nb3VzZU1pbmUuZGlzYWJsZWQgPSBlbXB0eTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbnM6IHRoZSBsaXN0IG9wZXJhdG9yIGJ1dHRvbnMgKHVuaW9uLCBpbnRlcnNlY3Rpb24sIGV0Yy4pXG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uLmxpc3RvcCcpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gYWRkIG15IHN5bWJvbCB0byB0aGUgZm9ybXVsYVxuXHRcdGxldCBpbmVsdCA9IHNlbGYuZm9ybS5mb3JtdWxhO1xuXHRcdGxldCBvcCA9IGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwibmFtZVwiKTtcblx0XHRzZWxmLmFkZFRvTGlzdEV4cHIob3ApO1xuXHRcdHNlbGYudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IHJlZnJlc2ggYnV0dG9uIGZvciBydW5uaW5nIHRoZSBmb3JtdWxhXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uW25hbWU9XCJyZWZyZXNoXCJdJylcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgZW1lc3NhZ2U9XCJJJ20gdGVycmlibHkgc29ycnksIGJ1dCB0aGVyZSBhcHBlYXJzIHRvIGJlIGEgcHJvYmxlbSB3aXRoIHlvdXIgbGlzdCBleHByZXNzaW9uOiBcIjtcblx0XHRsZXQgZm9ybXVsYSA9IHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlLnRyaW0oKTtcblx0XHRpZiAoZm9ybXVsYS5sZW5ndGggPT09IDApXG5cdFx0ICAgIHJldHVybjtcblx0ICAgICAgICB0aGlzLmFwcC5saXN0TWFuYWdlclxuXHRcdCAgICAuZXZhbEZvcm11bGEoZm9ybXVsYSlcblx0XHQgICAgLnRoZW4oaWRzID0+IHtcblx0XHQgICAgICAgIHRoaXMuZm9ybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIlxcblwiKTtcblx0XHQgICAgIH0pXG5cdFx0ICAgIC5jYXRjaChlID0+IGFsZXJ0KGVtZXNzYWdlICsgZSkpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBjbG9zZSBmb3JtdWxhIGVkaXRvclxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gLmJ1dHRvbltuYW1lPVwiY2xvc2VcIl0nKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5jbG9zZUZvcm11bGFFZGl0b3IoKSApO1xuXHRcblx0Ly8gQ2xpY2tpbmcgdGhlIGJveCBjb2xsYXBzZSBidXR0b24gc2hvdWxkIGNsZWFyIHRoZSBmb3JtXG5cdHRoaXMucm9vdC5zZWxlY3QoXCIuYnV0dG9uLmNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5leHRyYVwiLCAoKSA9PiB7XG5cdCAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0XHR0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpO1xuXHQgICAgfSk7XG4gICAgfVxuICAgIHBhcnNlSWRzIChzKSB7XG5cdHJldHVybiBzLnJlcGxhY2UoL1ssfF0vZywgJyAnKS50cmltKCkuc3BsaXQoL1xccysvKTtcbiAgICB9XG4gICAgZ2V0IGxpc3QgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdDtcbiAgICB9XG4gICAgc2V0IGxpc3QgKGxzdCkge1xuICAgICAgICB0aGlzLl9saXN0ID0gbHN0O1xuXHR0aGlzLl9zeW5jRGlzcGxheSgpO1xuICAgIH1cbiAgICBfc3luY0Rpc3BsYXkgKCkge1xuXHRsZXQgbHN0ID0gdGhpcy5fbGlzdDtcblx0aWYgKCFsc3QpIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0ubW9kaWZpZWQudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uc2F2ZS5kaXNhYmxlZCA9IHRydWU7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkID0gdHJ1ZTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gbHN0Lm5hbWU7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gbHN0Lmlkcy5qb2luKCdcXG4nKTtcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gbHN0LmZvcm11bGEgfHwgXCJcIjtcblx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZS50cmltKCkubGVuZ3RoID4gMDtcblx0ICAgIHRoaXMuZm9ybS5tb2RpZmllZC52YWx1ZSA9IGxzdC5tb2RpZmllZDtcblx0ICAgIHRoaXMuZm9ybS5zYXZlLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgXG5cdCAgICAgID0gdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkIFxuXHQgICAgICAgID0gKHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMCk7XG5cdH1cblx0dGhpcy52YWxpZGF0ZUV4cHIoKTtcbiAgICB9XG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuICAgIH1cbiAgICBvcGVuIChsc3QpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbHN0O1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiLCBmYWxzZSk7XG4gICAgfVxuICAgIGNsb3NlICgpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIiwgdHJ1ZSk7XG4gICAgfVxuICAgIG9wZW5Gb3JtdWxhRWRpdG9yICgpIHtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJlZGl0aW5nZm9ybXVsYVwiLCB0cnVlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gdHJ1ZTtcblx0bGV0IGYgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZTtcblx0dGhpcy5mb3JtLmZvcm11bGEuZm9jdXMoKTtcblx0c2V0Q2FyZXRQb3NpdGlvbih0aGlzLmZvcm0uZm9ybXVsYSwgZi5sZW5ndGgpO1xuICAgIH1cbiAgICBjbG9zZUZvcm11bGFFZGl0b3IgKCkge1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImVkaXRpbmdmb3JtdWxhXCIsIGZhbHNlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gZmFsc2U7XG4gICAgfVxuICAgIHRvZ2dsZUZvcm11bGFFZGl0b3IgKCkge1xuXHRsZXQgc2hvd2luZyA9IHRoaXMucm9vdC5jbGFzc2VkKFwiZWRpdGluZ2Zvcm11bGFcIik7XG5cdHNob3dpbmcgPyB0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpIDogdGhpcy5vcGVuRm9ybXVsYUVkaXRvcigpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDaGVja3MgdGhlIGN1cnJlbnQgZXhwcmVzc2lvbiBhbmQgc2V0cyB0aGUgdmFsaWQvaW52YWxpZCBjbGFzcy5cbiAgICB2YWxpZGF0ZUV4cHIgICgpIHtcblx0bGV0IGlucCA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKTtcblx0bGV0IGV4cHIgPSBpbnBbMF1bMF0udmFsdWUudHJpbSgpO1xuXHRpZiAoIWV4cHIpIHtcblx0ICAgIGlucC5jbGFzc2VkKFwidmFsaWRcIixmYWxzZSkuY2xhc3NlZChcImludmFsaWRcIixmYWxzZSk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IGZhbHNlO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgbGV0IGlzVmFsaWQgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5pc1ZhbGlkKGV4cHIpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHQgICAgaW5wLmNsYXNzZWQoXCJ2YWxpZFwiLCBpc1ZhbGlkKS5jbGFzc2VkKFwiaW52YWxpZFwiLCAhaXNWYWxpZCk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IHRydWU7XG5cdH1cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYWRkVG9MaXN0RXhwciAodGV4dCkge1xuXHRsZXQgaW5wID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIFtuYW1lPVwiZm9ybXVsYVwiXScpO1xuXHRsZXQgaWVsdCA9IGlucFswXVswXTtcblx0bGV0IHYgPSBpZWx0LnZhbHVlO1xuXHRsZXQgc3BsaWNlID0gZnVuY3Rpb24gKGUsdCl7XG5cdCAgICBsZXQgdiA9IGUudmFsdWU7XG5cdCAgICBsZXQgciA9IGdldENhcmV0UmFuZ2UoZSk7XG5cdCAgICBlLnZhbHVlID0gdi5zbGljZSgwLHJbMF0pICsgdCArIHYuc2xpY2UoclsxXSk7XG5cdCAgICBzZXRDYXJldFBvc2l0aW9uKGUsIHJbMF0rdC5sZW5ndGgpO1xuXHQgICAgZS5mb2N1cygpO1xuXHR9XG5cdGxldCByYW5nZSA9IGdldENhcmV0UmFuZ2UoaWVsdCk7XG5cdGlmIChyYW5nZVswXSA9PT0gcmFuZ2VbMV0pIHtcblx0ICAgIC8vIG5vIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dCk7XG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKSBcblx0XHRtb3ZlQ2FyZXRQb3NpdGlvbihpZWx0LCAtMSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICAvLyB0aGVyZSBpcyBhIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKVxuXHRcdC8vIHN1cnJvdW5kIGN1cnJlbnQgc2VsZWN0aW9uIHdpdGggcGFyZW5zLCB0aGVuIG1vdmUgY2FyZXQgYWZ0ZXJcblx0XHR0ZXh0ID0gJygnICsgdi5zbGljZShyYW5nZVswXSxyYW5nZVsxXSkgKyAnKSc7XG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dClcblx0fVxuXHR0aGlzLnZhbGlkYXRlRXhwcigpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIExpc3RFZGl0b3JcblxuZXhwb3J0IHsgTGlzdEVkaXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEVkaXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgRmFjZXQgfSBmcm9tICcuL0ZhY2V0JztcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBGYWNldE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcblx0dGhpcy5hcHAgPSBhcHA7XG5cdHRoaXMuZmFjZXRzID0gW107XG5cdHRoaXMubmFtZTJmYWNldCA9IHt9XG4gICAgfVxuICAgIGFkZEZhY2V0IChuYW1lLCB2YWx1ZUZjbikge1xuXHRpZiAodGhpcy5uYW1lMmZhY2V0W25hbWVdKSB0aHJvdyBcIkR1cGxpY2F0ZSBmYWNldCBuYW1lLiBcIiArIG5hbWU7XG5cdGxldCBmYWNldCA9IG5ldyBGYWNldChuYW1lLCB0aGlzLCB2YWx1ZUZjbik7XG4gICAgICAgIHRoaXMuZmFjZXRzLnB1c2goIGZhY2V0ICk7XG5cdHRoaXMubmFtZTJmYWNldFtuYW1lXSA9IGZhY2V0O1xuXHRyZXR1cm4gZmFjZXRcbiAgICB9XG4gICAgdGVzdCAoZikge1xuICAgICAgICBsZXQgdmFscyA9IHRoaXMuZmFjZXRzLm1hcCggZmFjZXQgPT4gZmFjZXQudGVzdChmKSApO1xuXHRyZXR1cm4gdmFscy5yZWR1Y2UoKGFjY3VtLCB2YWwpID0+IGFjY3VtICYmIHZhbCwgdHJ1ZSk7XG4gICAgfVxuICAgIGFwcGx5QWxsICgpIHtcblx0bGV0IHNob3cgPSBudWxsO1xuXHRsZXQgaGlkZSA9IFwibm9uZVwiO1xuXHQvLyBGSVhNRTogbWFqb3IgcmVhY2hvdmVyXG5cdHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwiZy5zdHJpcHNcIikuc2VsZWN0QWxsKCdyZWN0LmZlYXR1cmUnKVxuXHQgICAgLnN0eWxlKFwiZGlzcGxheVwiLCBmID0+IHRoaXMudGVzdChmKSA/IHNob3cgOiBoaWRlKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBGYWNldE1hbmFnZXJcblxuZXhwb3J0IHsgRmFjZXRNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GYWNldE1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgRmFjZXQge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lLCBtYW5hZ2VyLCB2YWx1ZUZjbikge1xuXHR0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXHR0aGlzLnZhbHVlcyA9IFtdO1xuXHR0aGlzLnZhbHVlRmNuID0gdmFsdWVGY247XG4gICAgfVxuICAgIHNldFZhbHVlcyAodmFsdWVzLCBxdWlldGx5KSB7XG4gICAgICAgIHRoaXMudmFsdWVzID0gdmFsdWVzO1xuXHRpZiAoISBxdWlldGx5KSB7XG5cdCAgICB0aGlzLm1hbmFnZXIuYXBwbHlBbGwoKTtcblx0ICAgIHRoaXMubWFuYWdlci5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH1cbiAgICB9XG4gICAgdGVzdCAoZikge1xuICAgICAgICByZXR1cm4gIXRoaXMudmFsdWVzIHx8IHRoaXMudmFsdWVzLmxlbmd0aCA9PT0gMCB8fCB0aGlzLnZhbHVlcy5pbmRleE9mKCB0aGlzLnZhbHVlRmNuKGYpICkgPj0gMDtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBGYWNldFxuXG5leHBvcnQgeyBGYWNldCB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmFjZXQuanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGQzdHN2IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBCbG9ja1RyYW5zbGF0b3IgfSBmcm9tICcuL0Jsb2NrVHJhbnNsYXRvcic7XG5pbXBvcnQgeyBLZXlTdG9yZSB9IGZyb20gJy4vS2V5U3RvcmUnO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEJsb2NrVHJhbnNsYXRvciBtYW5hZ2VyIGNsYXNzLiBGb3IgYW55IGdpdmVuIHBhaXIgb2YgZ2Vub21lcywgQSBhbmQgQiwgbG9hZHMgdGhlIHNpbmdsZSBibG9jayBmaWxlXG4vLyBmb3IgdHJhbnNsYXRpbmcgYmV0d2VlbiB0aGVtLCBhbmQgaW5kZXhlcyBpdCBcImZyb20gYm90aCBkaXJlY3Rpb25zXCI6XG4vLyBcdEEtPkItPiBbQUJfQmxvY2tGaWxlXSA8LUE8LUJcbi8vXG5jbGFzcyBCVE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG5cdHRoaXMucmNCbG9ja3MgPSB7fTtcblx0dGhpcy5ibG9ja1N0b3JlID0gbmV3IEtleVN0b3JlKCdzeW50ZW55LWJsb2NrcycpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlZ2lzdGVyQmxvY2tzIChhR2Vub21lLCBiR2Vub21lLCBibG9ja3MpIHtcblx0bGV0IGFuYW1lID0gYUdlbm9tZS5uYW1lO1xuXHRsZXQgYm5hbWUgPSBiR2Vub21lLm5hbWU7XG5cdGNvbnNvbGUubG9nKGBSZWdpc3RlcmluZyBibG9ja3M6ICR7YW5hbWV9IHZzICR7Ym5hbWV9YCwgYmxvY2tzKTtcblx0bGV0IGJsa0ZpbGUgPSBuZXcgQmxvY2tUcmFuc2xhdG9yKGFHZW5vbWUsYkdlbm9tZSxibG9ja3MpO1xuXHRpZiggISB0aGlzLnJjQmxvY2tzW2FuYW1lXSkgdGhpcy5yY0Jsb2Nrc1thbmFtZV0gPSB7fTtcblx0aWYoICEgdGhpcy5yY0Jsb2Nrc1tibmFtZV0pIHRoaXMucmNCbG9ja3NbYm5hbWVdID0ge307XG5cdHRoaXMucmNCbG9ja3NbYW5hbWVdW2JuYW1lXSA9IGJsa0ZpbGU7XG5cdHRoaXMucmNCbG9ja3NbYm5hbWVdW2FuYW1lXSA9IGJsa0ZpbGU7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gTG9hZHMgdGhlIHN5bnRlbnkgYmxvY2sgZmlsZSBmb3IgZ2Vub21lcyBhR2Vub21lIGFuZCBiR2Vub21lLlxuICAgIC8vIFxuICAgIGdldEJsb2NrRmlsZSAoYUdlbm9tZSwgYkdlbm9tZSkge1xuXHQvLyBCZSBhIGxpdHRsZSBzbWFydCBhYm91dCB0aGUgb3JkZXIgd2UgdHJ5IHRoZSBuYW1lcy4uLlxuXHRpZiAoYkdlbm9tZS5uYW1lIDwgYUdlbm9tZS5uYW1lKSB7XG5cdCAgICBsZXQgdG1wID0gYUdlbm9tZTsgYUdlbm9tZSA9IGJHZW5vbWU7IGJHZW5vbWUgPSB0bXA7XG5cdH1cblx0Ly8gRmlyc3QsIHNlZSBpZiB3ZSBhbHJlYWR5IGhhdmUgdGhpcyBwYWlyXG5cdGxldCBhbmFtZSA9IGFHZW5vbWUubmFtZTtcblx0bGV0IGJuYW1lID0gYkdlbm9tZS5uYW1lO1xuXHRsZXQgYmYgPSAodGhpcy5yY0Jsb2Nrc1thbmFtZV0gfHwge30pW2JuYW1lXTtcblx0aWYgKGJmKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShiZik7XG5cdFxuXHQvLyBTZWNvbmQsIHRyeSBsb2NhbCBkaXNrIGNhY2hlXG5cdGxldCBrZXkgPSBhbmFtZSArICctJyArIGJuYW1lO1xuXHRyZXR1cm4gdGhpcy5ibG9ja1N0b3JlLmdldChrZXkpLnRoZW4oZGF0YSA9PiB7XG5cdCAgICBpZiAoZGF0YSkge1xuXHRcdGNvbnNvbGUubG9nKFwiRm91bmQgYmxvY2tzIGluIGNhY2hlLlwiKTtcblx0ICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RlckJsb2NrcyhhR2Vub21lLCBiR2Vub21lLCBkYXRhKTtcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYgKHRoaXMuc2VydmVyUmVxdWVzdCkge1xuXHQgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFuIG91dHN0YW5kaW5nIHJlcXVlc3QsIHdhaXQgdW50aWwgaXQncyBkb25lIGFuZCB0cnkgYWdhaW4uXG5cdFx0dGhpcy5zZXJ2ZXJSZXF1ZXN0LnRoZW4oKCk9PnRoaXMuZ2V0QmxvY2tGaWxlKGFHZW5vbWUsIGJHZW5vbWUpKTtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHRcdC8vIFRoaXJkLCBsb2FkIGZyb20gc2VydmVyLlxuXHRcdGxldCBmbiA9IGAuL2RhdGEvZ2Vub21lZGF0YS9ibG9ja3MudHN2YFxuXHRcdGNvbnNvbGUubG9nKFwiUmVxdWVzdGluZyBibG9jayBmaWxlIGZyb206IFwiICsgZm4pO1xuXHRcdHRoaXMuc2VydmVyUmVxdWVzdCA9IGQzdHN2KGZuKS50aGVuKGJsb2NrcyA9PiB7XG5cdFx0ICAgIGxldCByYnMgPSBibG9ja3MucmVkdWNlKCAoYSxiKSA9PiB7XG5cdFx0ICAgIGxldCBrID0gYi5hR2Vub21lICsgJy0nICsgYi5iR2Vub21lO1xuXHRcdCAgICBpZiAoIShrIGluIGEpKSBhW2tdID0gW107XG5cdFx0ICAgICAgICBhW2tdLnB1c2goYik7XG5cdFx0XHRyZXR1cm4gYTtcblx0XHQgICAgfSwge30pO1xuXHRcdCAgICBmb3IgKGxldCBuIGluIHJicykge1xuXHRcdCAgICAgICAgdGhpcy5ibG9ja1N0b3JlLnNldChuLCByYnNbbl0pO1xuXHRcdCAgICB9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXMuc2VydmVyUmVxdWVzdDtcblx0ICAgIH1cblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiB0aGUgdHJhbnNsYXRvciBoYXMgbG9hZGVkIGFsbCB0aGUgZGF0YSBuZWVkZWRcbiAgICAvLyBmb3IgdHJhbnNsYXRpbmcgY29vcmRpbmF0ZXMgYmV0d2VlbiB0aGUgY3VycmVudCByZWYgc3RyYWluIGFuZCB0aGUgY3VycmVudCBjb21wYXJpc29uIHN0cmFpbnMuXG4gICAgLy9cbiAgICByZWFkeSAoKSB7XG5cdGxldCBwcm9taXNlcyA9IHRoaXMuYXBwLmNHZW5vbWVzLm1hcChjZyA9PiB0aGlzLmdldEJsb2NrRmlsZSh0aGlzLmFwcC5yR2Vub21lLCBjZykpO1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgc3ludGVueSBibG9jayB0cmFuc2xhdG9yIHRoYXQgbWFwcyB0aGUgY3VycmVudCByZWYgZ2Vub21lIHRvIHRoZSBzcGVjaWZpZWQgY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy9cbiAgICBnZXRCbG9ja3MgKGZyb21HZW5vbWUsIHRvR2Vub21lKSB7XG4gICAgICAgIGxldCBibGtUcmFucyA9IHRoaXMucmNCbG9ja3NbZnJvbUdlbm9tZS5uYW1lXVt0b0dlbm9tZS5uYW1lXTtcblx0cmV0dXJuIGJsa1RyYW5zLmdldEJsb2Nrcyhmcm9tR2Vub21lKVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFRyYW5zbGF0ZXMgdGhlIGdpdmVuIGNvb3JkaW5hdGUgcmFuZ2UgZnJvbSB0aGUgc3BlY2lmaWVkIGZyb21HZW5vbWUgdG8gdGhlIHNwZWNpZmllZCB0b0dlbm9tZS5cbiAgICAvLyBSZXR1cm5zIGEgbGlzdCBvZiB6ZXJvIG9yIG1vcmUgY29vcmRpbmF0ZSByYW5nZXMgaW4gdGhlIHRvR2Vub21lLlxuICAgIC8vXG4gICAgdHJhbnNsYXRlIChmcm9tR2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQsIHRvR2Vub21lLCBpbnZlcnRlZCkge1xuXHQvLyBnZXQgdGhlIHJpZ2h0IGJsb2NrIGZpbGVcblx0bGV0IGJsa1RyYW5zID0gdGhpcy5yY0Jsb2Nrc1tmcm9tR2Vub21lLm5hbWVdW3RvR2Vub21lLm5hbWVdO1xuXHRpZiAoIWJsa1RyYW5zKSB0aHJvdyBcIkludGVybmFsIGVycm9yLiBObyBibG9jayBmaWxlIGZvdW5kIGluIGluZGV4LlwiXG5cdC8vIHRyYW5zbGF0ZSFcblx0bGV0IHJhbmdlcyA9IGJsa1RyYW5zLnRyYW5zbGF0ZShmcm9tR2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQsIGludmVydGVkKTtcblx0cmV0dXJuIHJhbmdlcztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJDYWNoZWREYXRhICgpIHtcblx0Y29uc29sZS5sb2coXCJCVE1hbmFnZXI6IENhY2hlIGNsZWFyZWQuXCIpXG4gICAgICAgIHJldHVybiB0aGlzLmJsb2NrU3RvcmUuY2xlYXIoKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBCVE1hbmFnZXJcblxuZXhwb3J0IHsgQlRNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9CVE1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU29tZXRoaW5nIHRoYXQga25vd3MgaG93IHRvIHRyYW5zbGF0ZSBjb29yZGluYXRlcyBiZXR3ZWVuIHR3byBnZW5vbWVzLlxuLy9cbi8vXG5jbGFzcyBCbG9ja1RyYW5zbGF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKGFHZW5vbWUsIGJHZW5vbWUsIGJsb2Nrcyl7XG5cdHRoaXMuYUdlbm9tZSA9IGFHZW5vbWU7XG5cdHRoaXMuYkdlbm9tZSA9IGJHZW5vbWU7XG5cdHRoaXMuYmxvY2tzID0gYmxvY2tzLm1hcChiID0+IHRoaXMucHJvY2Vzc0Jsb2NrKGIpKVxuXHR0aGlzLmN1cnJTb3J0ID0gXCJhXCI7IC8vIGVpdGhlciAnYScgb3IgJ2InXG4gICAgfVxuICAgIHByb2Nlc3NCbG9jayAoYmxrKSB7IFxuICAgICAgICBibGsuYUluZGV4ID0gcGFyc2VJbnQoYmxrLmFJbmRleCk7XG4gICAgICAgIGJsay5iSW5kZXggPSBwYXJzZUludChibGsuYkluZGV4KTtcbiAgICAgICAgYmxrLmFTdGFydCA9IHBhcnNlSW50KGJsay5hU3RhcnQpO1xuICAgICAgICBibGsuYlN0YXJ0ID0gcGFyc2VJbnQoYmxrLmJTdGFydCk7XG4gICAgICAgIGJsay5hRW5kICAgPSBwYXJzZUludChibGsuYUVuZCk7XG4gICAgICAgIGJsay5iRW5kICAgPSBwYXJzZUludChibGsuYkVuZCk7XG4gICAgICAgIGJsay5hTGVuZ3RoICAgPSBwYXJzZUludChibGsuYUxlbmd0aCk7XG4gICAgICAgIGJsay5iTGVuZ3RoICAgPSBwYXJzZUludChibGsuYkxlbmd0aCk7XG4gICAgICAgIGJsay5ibG9ja0NvdW50ICAgPSBwYXJzZUludChibGsuYmxvY2tDb3VudCk7XG4gICAgICAgIGJsay5ibG9ja1JhdGlvICAgPSBwYXJzZUZsb2F0KGJsay5ibG9ja1JhdGlvKTtcblx0YmxrLmFiTWFwID0gZDMuc2NhbGUubGluZWFyKClcblx0ICAgIC5kb21haW4oW2Jsay5hU3RhcnQsYmxrLmFFbmRdKVxuXHQgICAgLnJhbmdlKCBibGsuYmxvY2tPcmk9PT1cIi1cIiA/IFtibGsuYkVuZCxibGsuYlN0YXJ0XSA6IFtibGsuYlN0YXJ0LGJsay5iRW5kXSk7XG5cdGJsay5iYU1hcCA9IGJsay5hYk1hcC5pbnZlcnRcblx0cmV0dXJuIGJsaztcbiAgICB9XG4gICAgc2V0U29ydCAod2hpY2gpIHtcblx0aWYgKHdoaWNoICE9PSAnYScgJiYgd2hpY2ggIT09ICdiJykgdGhyb3cgXCJCYWQgYXJndW1lbnQ6XCIgKyB3aGljaDtcblx0bGV0IHNvcnRDb2wgPSB3aGljaCArIFwiSW5kZXhcIjtcblx0bGV0IGNtcCA9ICh4LHkpID0+IHhbc29ydENvbF0gLSB5W3NvcnRDb2xdO1xuXHR0aGlzLmJsb2Nrcy5zb3J0KGNtcCk7XG5cdHRoaXMuY3VyclNvcnQgPSB3aGljaDtcbiAgICB9XG4gICAgZmxpcFNvcnQgKCkge1xuXHR0aGlzLnNldFNvcnQodGhpcy5jdXJyU29ydCA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcbiAgICB9XG4gICAgLy8gR2l2ZW4gYSBnZW5vbWUgKGVpdGhlciB0aGUgYSBvciBiIGdlbm9tZSkgYW5kIGEgY29vcmRpbmF0ZSByYW5nZSxcbiAgICAvLyByZXR1cm5zIHRoZSBlcXVpdmFsZW50IGNvb3JkaW5hdGUgcmFuZ2UocykgaW4gdGhlIG90aGVyIGdlbm9tZVxuICAgIHRyYW5zbGF0ZSAoZnJvbUdlbm9tZSwgY2hyLCBzdGFydCwgZW5kLCBpbnZlcnQpIHtcblx0Ly9cblx0ZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBzdGFydCA6IGVuZDtcblx0Ly8gZnJvbSA9IFwiYVwiIG9yIFwiYlwiLCBkZXBlbmRpbmcgb24gd2hpY2ggZ2Vub21lIGlzIGdpdmVuLlxuICAgICAgICBsZXQgZnJvbSA9IChmcm9tR2Vub21lID09PSB0aGlzLmFHZW5vbWUgPyBcImFcIiA6IGZyb21HZW5vbWUgPT09IHRoaXMuYkdlbm9tZSA/IFwiYlwiIDogbnVsbCk7XG5cdGlmICghZnJvbSkgdGhyb3cgXCJCYWQgYXJndW1lbnQuIEdlbm9tZSBuZWl0aGVyIEEgbm9yIEIuXCI7XG5cdC8vIHRvID0gXCJiXCIgb3IgXCJhXCIsIG9wcG9zaXRlIG9mIGZyb21cblx0bGV0IHRvID0gKGZyb20gPT09IFwiYVwiID8gXCJiXCIgOiBcImFcIik7XG5cdC8vIG1ha2Ugc3VyZSB0aGUgYmxvY2tzIGFyZSBzb3J0ZWQgYnkgdGhlIGZyb20gZ2Vub21lXG5cdHRoaXMuc2V0U29ydChmcm9tKTtcblx0Ly9cblx0bGV0IGZyb21DID0gZnJvbStcIkNoclwiO1xuXHRsZXQgZnJvbVMgPSBmcm9tK1wiU3RhcnRcIjtcblx0bGV0IGZyb21FID0gZnJvbStcIkVuZFwiO1xuXHRsZXQgZnJvbUkgPSBmcm9tK1wiSW5kZXhcIjtcblx0bGV0IHRvQyA9IHRvK1wiQ2hyXCI7XG5cdGxldCB0b1MgPSB0bytcIlN0YXJ0XCI7XG5cdGxldCB0b0UgPSB0bytcIkVuZFwiO1xuXHRsZXQgdG9JID0gdG8rXCJJbmRleFwiO1xuXHRsZXQgbWFwcGVyID0gZnJvbSt0bytcIk1hcFwiO1xuXHQvLyBcblx0bGV0IGJsa3MgPSB0aGlzLmJsb2Nrc1xuXHQgICAgLy8gRmlyc3QgZmlsdGVyIGZvciBibG9ja3MgdGhhdCBvdmVybGFwIHRoZSBnaXZlbiBjb29yZGluYXRlIHJhbmdlIGluIHRoZSBmcm9tIGdlbm9tZVxuXHQgICAgLmZpbHRlcihibGsgPT4gYmxrW2Zyb21DXSA9PT0gY2hyICYmIGJsa1tmcm9tU10gPD0gZW5kICYmIGJsa1tmcm9tRV0gPj0gc3RhcnQpXG5cdCAgICAvLyBtYXAgZWFjaCBibG9jay4gXG5cdCAgICAubWFwKGJsayA9PiB7XG5cdFx0Ly8gY29vcmQgcmFuZ2Ugb24gdGhlIGZyb20gc2lkZS5cblx0XHRsZXQgcyA9IE1hdGgubWF4KHN0YXJ0LCBibGtbZnJvbVNdKTtcblx0XHRsZXQgZSA9IE1hdGgubWluKGVuZCwgYmxrW2Zyb21FXSk7XG5cdFx0Ly8gY29vcmQgcmFuZ2Ugb24gdGhlIHRvIHNpZGUuXG5cdFx0bGV0IHMyID0gTWF0aC5jZWlsKGJsa1ttYXBwZXJdKHMpKTtcblx0XHRsZXQgZTIgPSBNYXRoLmZsb29yKGJsa1ttYXBwZXJdKGUpKTtcblx0ICAgICAgICByZXR1cm4gaW52ZXJ0ID8ge1xuXHRcdCAgICBjaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgc3RhcnQ6IHMsXG5cdFx0ICAgIGVuZDogICBlLFxuXHRcdCAgICBvcmk6ICAgYmxrLmJsb2NrT3JpLFxuXHRcdCAgICBpbmRleDogYmxrW2Zyb21JXSxcblx0XHQgICAgLy8gYWxzbyByZXR1cm4gdGhlIGZyb21HZW5vbWUgY29vcmRzIGZvciB0aGlzIHBpZWNlIG9mIHRoZSB0cmFuc2xhdGlvblxuXHRcdCAgICBmQ2hyOiAgIGJsa1t0b0NdLFxuXHRcdCAgICBmU3RhcnQ6IE1hdGgubWluKHMyLGUyKSxcblx0XHQgICAgZkVuZDogICBNYXRoLm1heChzMixlMiksXG5cdFx0ICAgIGZJbmRleDogYmxrW3RvSV0sXG5cdFx0ICAgIC8vIGluY2x1ZGUgdGhlIGJsb2NrIGlkIGFuZCBmdWxsIGJsb2NrIGNvb3Jkc1xuXHRcdCAgICBibG9ja0lkOiBibGsuYmxvY2tJZCxcblx0XHQgICAgYmxvY2tTdGFydDogYmxrW2Zyb21TXSxcblx0XHQgICAgYmxvY2tFbmQ6IGJsa1tmcm9tRV1cblx0XHR9IDoge1xuXHRcdCAgICBjaHI6ICAgYmxrW3RvQ10sXG5cdFx0ICAgIHN0YXJ0OiBNYXRoLm1pbihzMixlMiksXG5cdFx0ICAgIGVuZDogICBNYXRoLm1heChzMixlMiksXG5cdFx0ICAgIG9yaTogICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGluZGV4OiBibGtbdG9JXSxcblx0XHQgICAgLy8gYWxzbyByZXR1cm4gdGhlIGZyb21HZW5vbWUgY29vcmRzIGZvciB0aGlzIHBpZWNlIG9mIHRoZSB0cmFuc2xhdGlvblxuXHRcdCAgICBmQ2hyOiAgIGJsa1tmcm9tQ10sXG5cdFx0ICAgIGZTdGFydDogcyxcblx0XHQgICAgZkVuZDogICBlLFxuXHRcdCAgICBmSW5kZXg6IGJsa1tmcm9tSV0sXG5cdFx0ICAgIC8vIGluY2x1ZGUgdGhlIGJsb2NrIGlkIGFuZCBmdWxsIGJsb2NrIGNvb3Jkc1xuXHRcdCAgICBibG9ja0lkOiBibGsuYmxvY2tJZCxcblx0XHQgICAgYmxvY2tTdGFydDogYmxrW3RvU10sXG5cdFx0ICAgIGJsb2NrRW5kOiBibGtbdG9FXVxuXHRcdH07XG5cdCAgICB9KTtcblx0aWYgKCFpbnZlcnQpIHtcblx0ICAgIC8vIExvb2sgZm9yIDEtYmxvY2sgZ2FwcyBhbmQgZmlsbCB0aGVtIGluLiBcblx0ICAgIGJsa3Muc29ydCgoYSxiKSA9PiBhLmluZGV4IC0gYi5pbmRleCk7XG5cdCAgICBsZXQgbmJzID0gW107XG5cdCAgICBibGtzLmZvckVhY2goIChiLCBpKSA9PiB7XG5cdFx0aWYgKGkgPT09IDApIHJldHVybjtcblx0XHRpZiAoYmxrc1tpXS5pbmRleCAtIGJsa3NbaSAtIDFdLmluZGV4ID09PSAyKSB7XG5cdFx0ICAgIGxldCBibGsgPSB0aGlzLmJsb2Nrcy5maWx0ZXIoIGIgPT4gYlt0b0ldID09PSBibGtzW2ldLmluZGV4IC0gMSApWzBdO1xuXHRcdCAgICBuYnMucHVzaCh7XG5cdFx0XHRjaHI6ICAgYmxrW3RvQ10sXG5cdFx0XHRzdGFydDogYmxrW3RvU10sXG5cdFx0XHRlbmQ6ICAgYmxrW3RvRV0sXG5cdFx0XHRvcmk6ICAgYmxrLmJsb2NrT3JpLFxuXHRcdFx0aW5kZXg6IGJsa1t0b0ldLFxuXHRcdFx0Ly8gYWxzbyByZXR1cm4gdGhlIGZyb21HZW5vbWUgY29vcmRzIGZvciB0aGlzIHBpZWNlIG9mIHRoZSB0cmFuc2xhdGlvblxuXHRcdFx0ZkNocjogICBibGtbZnJvbUNdLFxuXHRcdFx0ZlN0YXJ0OiBibGtbZnJvbVNdLFxuXHRcdFx0ZkVuZDogICBibGtbZnJvbUVdLFxuXHRcdFx0ZkluZGV4OiBibGtbZnJvbUldLFxuXHRcdFx0Ly8gaW5jbHVkZSB0aGUgYmxvY2sgaWQgYW5kIGZ1bGwgYmxvY2sgY29vcmRzXG5cdFx0XHRibG9ja0lkOiBibGsuYmxvY2tJZCxcblx0XHRcdGJsb2NrU3RhcnQ6IGJsa1t0b1NdLFxuXHRcdFx0YmxvY2tFbmQ6IGJsa1t0b0VdXG5cdFx0ICAgIH0pO1xuXHRcdH1cblx0ICAgIH0pO1xuXHQgICAgYmxrcyA9IGJsa3MuY29uY2F0KG5icyk7XG5cdH1cblx0Ymxrcy5zb3J0KChhLGIpID0+IGEuZkluZGV4IC0gYi5mSW5kZXgpO1xuXHRyZXR1cm4gYmxrcztcbiAgICB9XG4gICAgLy8gR2l2ZW4gYSBnZW5vbWUgKGVpdGhlciB0aGUgYSBvciBiIGdlbm9tZSlcbiAgICAvLyByZXR1cm5zIHRoZSBibG9ja3MgZm9yIHRyYW5zbGF0aW5nIHRvIHRoZSBvdGhlciAoYiBvciBhKSBnZW5vbWUuXG4gICAgLy9cbiAgICBnZXRCbG9ja3MgKGZyb21HZW5vbWUpIHtcblx0Ly8gZnJvbSA9IFwiYVwiIG9yIFwiYlwiLCBkZXBlbmRpbmcgb24gd2hpY2ggZ2Vub21lIGlzIGdpdmVuLlxuICAgICAgICBsZXQgZnJvbSA9IChmcm9tR2Vub21lID09PSB0aGlzLmFHZW5vbWUgPyBcImFcIiA6IGZyb21HZW5vbWUgPT09IHRoaXMuYkdlbm9tZSA/IFwiYlwiIDogbnVsbCk7XG5cdGlmICghZnJvbSkgdGhyb3cgXCJCYWQgYXJndW1lbnQuIEdlbm9tZSBuZWl0aGVyIEEgbm9yIEIuXCI7XG5cdC8vIHRvID0gXCJiXCIgb3IgXCJhXCIsIG9wcG9zaXRlIG9mIGZyb21cblx0bGV0IHRvID0gKGZyb20gPT09IFwiYVwiID8gXCJiXCIgOiBcImFcIik7XG5cdC8vIG1ha2Ugc3VyZSB0aGUgYmxvY2tzIGFyZSBzb3J0ZWQgYnkgdGhlIGZyb20gZ2Vub21lXG5cdHRoaXMuc2V0U29ydChmcm9tKTtcblx0Ly9cblx0bGV0IGZyb21DID0gZnJvbStcIkNoclwiO1xuXHRsZXQgZnJvbVMgPSBmcm9tK1wiU3RhcnRcIjtcblx0bGV0IGZyb21FID0gZnJvbStcIkVuZFwiO1xuXHRsZXQgZnJvbUkgPSBmcm9tK1wiSW5kZXhcIjtcblx0bGV0IHRvQyA9IHRvK1wiQ2hyXCI7XG5cdGxldCB0b1MgPSB0bytcIlN0YXJ0XCI7XG5cdGxldCB0b0UgPSB0bytcIkVuZFwiO1xuXHRsZXQgdG9JID0gdG8rXCJJbmRleFwiO1xuXHRsZXQgbWFwcGVyID0gZnJvbSt0bytcIk1hcFwiO1xuXHQvLyBcblx0bGV0IGJsa3MgPSB0aGlzLmJsb2Nrc1xuXHQgICAgLm1hcChibGsgPT4ge1xuXHQgICAgICAgIHJldHVybiB7XG5cdFx0ICAgIGJsb2NrSWQ6ICAgYmxrLmJsb2NrSWQsXG5cdFx0ICAgIG9yaTogICAgICAgYmxrLmJsb2NrT3JpLFxuXHRcdCAgICBmcm9tQ2hyOiAgIGJsa1tmcm9tQ10sXG5cdFx0ICAgIGZyb21TdGFydDogYmxrW2Zyb21TXSxcblx0XHQgICAgZnJvbUVuZDogICBibGtbZnJvbUVdLFxuXHRcdCAgICBmcm9tSW5kZXg6IGJsa1tmcm9tSV0sXG5cdFx0ICAgIHRvQ2hyOiAgICAgYmxrW3RvQ10sXG5cdFx0ICAgIHRvU3RhcnQ6ICAgYmxrW3RvU10sXG5cdFx0ICAgIHRvRW5kOiAgICAgYmxrW3RvRV0sXG5cdFx0ICAgIHRvSW5kZXg6ICAgYmxrW3RvSV1cblx0XHR9O1xuXHQgICAgfSlcblx0Ly8gXG5cdHJldHVybiBibGtzO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgQmxvY2tUcmFuc2xhdG9yIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9CbG9ja1RyYW5zbGF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFNWR1ZpZXcgfSBmcm9tICcuL1NWR1ZpZXcnO1xuaW1wb3J0IHsgY29vcmRzQWZ0ZXJUcmFuc2Zvcm0gfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBHZW5vbWVWaWV3IGV4dGVuZHMgU1ZHVmlldyB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0KTtcblx0dGhpcy5vcGVuV2lkdGggPSB0aGlzLm91dGVyV2lkdGg7XG5cdHRoaXMub3BlbkhlaWdodD0gdGhpcy5vdXRlckhlaWdodDtcblx0dGhpcy50b3RhbENocldpZHRoID0gNDA7IC8vIHRvdGFsIHdpZHRoIG9mIG9uZSBjaHJvbW9zb21lIChiYWNrYm9uZStibG9ja3MrZmVhdHMpXG5cdHRoaXMuY3dpZHRoID0gMjA7ICAgICAgICAvLyBjaHJvbW9zb21lIHdpZHRoXG5cdHRoaXMudGlja0xlbmd0aCA9IDEwO1x0IC8vIGZlYXR1cmUgdGljayBtYXJrIGxlbmd0aFxuXHR0aGlzLmJydXNoQ2hyID0gbnVsbDtcdCAvLyB3aGljaCBjaHIgaGFzIHRoZSBjdXJyZW50IGJydXNoXG5cdHRoaXMuYndpZHRoID0gdGhpcy5jd2lkdGgvMjsgIC8vIGJsb2NrIHdpZHRoXG5cdHRoaXMuY3VyckJsb2NrcyA9IG51bGw7XG5cdHRoaXMuY3VyclRpY2tzID0gbnVsbDtcblx0dGhpcy5nQ2hyb21vc29tZXMgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCdnJykuYXR0cihcIm5hbWVcIiwgXCJjaHJvbW9zb21lc1wiKTtcblx0dGhpcy50aXRsZSAgICA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ3RleHQnKS5hdHRyKFwiY2xhc3NcIiwgXCJ0aXRsZVwiKTtcblx0dGhpcy5zY3JvbGxBbW91bnQgPSAwO1xuXHQvL1xuXHR0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZml0VG9XaWR0aCAodyl7XG4gICAgICAgIHN1cGVyLmZpdFRvV2lkdGgodyk7XG5cdHRoaXMub3BlbldpZHRoID0gdGhpcy5vdXRlcldpZHRoO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RG9tICgpIHtcblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbi5jbG9zZScpXG5cdCAgICAub24oJ2NsaWNrJywgKCkgPT4gdGhpcy5yZWRyYXcoKSk7XG5cdHRoaXMuc3ZnLm9uKFwid2hlZWxcIiwgKCkgPT4ge1xuXHQgICAgaWYgKCF0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiKSkgcmV0dXJuO1xuXHQgICAgdGhpcy5zY3JvbGxXaGVlbChkMy5ldmVudC5kZWx0YVkpXG5cdCAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9KTtcblx0bGV0IHNicyA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwic3ZnY29udGFpbmVyXCJdID4gW25hbWU9XCJzY3JvbGxidXR0b25zXCJdJylcblx0c2JzLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwidXBcIl0nKS5vbihcImNsaWNrXCIsICgpID0+IHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNVcCgpKTtcblx0c2JzLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZG5cIl0nKS5vbihcImNsaWNrXCIsICgpID0+IHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNEb3duKCkpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldEJydXNoQ29vcmRzIChjb29yZHMpIHtcblx0dGhpcy5jbGVhckJydXNoZXMoKTtcblx0dGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0KGAuY2hyb21vc29tZVtuYW1lPVwiJHtjb29yZHMuY2hyfVwiXSBnW25hbWU9XCJicnVzaFwiXWApXG5cdCAgLmVhY2goZnVuY3Rpb24oY2hyKXtcblx0ICAgIGNoci5icnVzaC5leHRlbnQoW2Nvb3Jkcy5zdGFydCxjb29yZHMuZW5kXSk7XG5cdCAgICBjaHIuYnJ1c2goZDMuc2VsZWN0KHRoaXMpKTtcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJydXNoc3RhcnQgKGNocil7XG5cdHRoaXMuY2xlYXJCcnVzaGVzKGNoci5icnVzaCk7XG5cdHRoaXMuYnJ1c2hDaHIgPSBjaHI7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYnJ1c2hlbmQgKCl7XG5cdGlmKCF0aGlzLmJydXNoQ2hyKSByZXR1cm47XG5cdGxldCBjYyA9IHRoaXMuYXBwLmNvb3Jkcztcblx0dmFyIHh0bnQgPSB0aGlzLmJydXNoQ2hyLmJydXNoLmV4dGVudCgpO1xuXHRpZiAoTWF0aC5hYnMoeHRudFswXSAtIHh0bnRbMV0pIDw9IDEwKXtcblx0ICAgIC8vIHVzZXIgY2xpY2tlZFxuXHQgICAgbGV0IHcgPSBjYy5lbmQgLSBjYy5zdGFydCArIDE7XG5cdCAgICB4dG50WzBdIC09IHcvMjtcblx0ICAgIHh0bnRbMV0gKz0gdy8yO1xuXHR9XG5cdGxldCBjb29yZHMgPSB7IGNocjp0aGlzLmJydXNoQ2hyLm5hbWUsIHN0YXJ0Ok1hdGguZmxvb3IoeHRudFswXSksIGVuZDogTWF0aC5mbG9vcih4dG50WzFdKSB9O1xuXHR0aGlzLmFwcC5zZXRDb250ZXh0KGNvb3Jkcyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJCcnVzaGVzIChleGNlcHQpe1xuXHR0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoJ1tuYW1lPVwiYnJ1c2hcIl0nKS5lYWNoKGZ1bmN0aW9uKGNocil7XG5cdCAgICBpZiAoY2hyLmJydXNoICE9PSBleGNlcHQpIHtcblx0XHRjaHIuYnJ1c2guY2xlYXIoKTtcblx0XHRjaHIuYnJ1c2goZDMuc2VsZWN0KHRoaXMpKTtcblx0ICAgIH1cblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0WCAoY2hyKSB7XG5cdGxldCB4ID0gdGhpcy5hcHAuckdlbm9tZS54c2NhbGUoY2hyKTtcblx0aWYgKGlzTmFOKHgpKSB0aHJvdyBcInggaXMgTmFOXCJcblx0cmV0dXJuIHg7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldFkgKHBvcykge1xuXHRsZXQgeSA9IHRoaXMuYXBwLnJHZW5vbWUueXNjYWxlKHBvcyk7XG5cdGlmIChpc05hTih5KSkgdGhyb3cgXCJ5IGlzIE5hTlwiXG5cdHJldHVybiB5O1xuICAgIH1cbiAgICBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZWRyYXcgKCkge1xuICAgICAgICB0aGlzLmRyYXcodGhpcy5jdXJyVGlja3MsIHRoaXMuY3VyckJsb2Nrcyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZHJhdyAodGlja0RhdGEsIGJsb2NrRGF0YSkge1xuXHR0aGlzLmRyYXdDaHJvbW9zb21lcygpO1xuXHR0aGlzLmRyYXdCbG9ja3MoYmxvY2tEYXRhKTtcblx0dGhpcy5kcmF3VGlja3ModGlja0RhdGEpO1xuXHR0aGlzLmRyYXdUaXRsZSgpO1xuXHR0aGlzLnNldEJydXNoQ29vcmRzKHRoaXMuYXBwLmNvb3Jkcyk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIGNocm9tb3NvbWVzIG9mIHRoZSByZWZlcmVuY2UgZ2Vub21lLlxuICAgIC8vIEluY2x1ZGVzIGJhY2tib25lcywgbGFiZWxzLCBhbmQgYnJ1c2hlcy5cbiAgICAvLyBUaGUgYmFja2JvbmVzIGFyZSBkcmF3biBhcyB2ZXJ0aWNhbCBsaW5lIHNlbWVudHMsXG4gICAgLy8gZGlzdHJpYnV0ZWQgaG9yaXpvbnRhbGx5LiBPcmRlcmluZyBpcyBkZWZpbmVkIGJ5XG4gICAgLy8gdGhlIG1vZGVsIChHZW5vbWUgb2JqZWN0KS5cbiAgICAvLyBMYWJlbHMgYXJlIGRyYXduIGFib3ZlIHRoZSBiYWNrYm9uZXMuXG4gICAgLy9cbiAgICAvLyBNb2RpZmljYXRpb246XG4gICAgLy8gRHJhd3MgdGhlIHNjZW5lIGluIG9uZSBvZiB0d28gc3RhdGVzOiBvcGVuIG9yIGNsb3NlZC5cbiAgICAvLyBUaGUgb3BlbiBzdGF0ZSBpcyBhcyBkZXNjcmliZWQgLSBhbGwgY2hyb21vc29tZXMgc2hvd24uXG4gICAgLy8gSW4gdGhlIGNsb3NlZCBzdGF0ZTogXG4gICAgLy8gICAgICogb25seSBvbmUgY2hyb21vc29tZSBzaG93cyAodGhlIGN1cnJlbnQgb25lKVxuICAgIC8vICAgICAqIGRyYXduIGhvcml6b250YWxseSBhbmQgcG9zaXRpb25lZCBiZXNpZGUgdGhlIFwiR2Vub21lIFZpZXdcIiB0aXRsZVxuICAgIC8vXG4gICAgZHJhd0Nocm9tb3NvbWVzICgpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7IC8vIHJlZiBnZW5vbWVcblx0bGV0IHJDaHJzID0gcmcuY2hyb21vc29tZXM7XG5cbiAgICAgICAgLy8gQ2hyb21vc29tZSBncm91cHNcblx0bGV0IGNocnMgPSB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoXCIuY2hyb21vc29tZVwiKVxuXHQgICAgLmRhdGEockNocnMsIGMgPT4gYy5uYW1lKTtcblx0bGV0IG5ld2NocnMgPSBjaHJzLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBcImNocm9tb3NvbWVcIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLCBjID0+IGMubmFtZSk7XG5cdFxuXHRuZXdjaHJzLmFwcGVuZChcInRleHRcIikuYXR0cihcIm5hbWVcIixcImxhYmVsXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImxpbmVcIikuYXR0cihcIm5hbWVcIixcImJhY2tib25lXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIixcInN5bkJsb2Nrc1wiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJ0aWNrc1wiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJicnVzaFwiKTtcblxuXG5cdGxldCBjbG9zZWQgPSB0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiKTtcblx0Ly8gc2V0IGRpcmVjdGlvbiBvZiB0aGUgcmVzaXplIGN1cnNvci5cblx0Y2hycy5zZWxlY3RBbGwoJ2dbbmFtZT1cImJydXNoXCJdIGcucmVzaXplJykuc3R5bGUoJ2N1cnNvcicsIGNsb3NlZCA/ICdldy1yZXNpemUnIDogJ25zLXJlc2l6ZScpXG5cdC8vXG5cdGlmIChjbG9zZWQpIHtcblx0ICAgIC8vIFJlc2V0IHRoZSBTVkcgc2l6ZSB0byBiZSAxLWNocm9tb3NvbWUgd2lkZS5cblx0ICAgIC8vIFRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAgc28gdGhhdCB0aGUgY3VycmVudCBjaHJvbW9zb21lIGFwcGVhcnMgaW4gdGhlIHN2ZyBhcmVhLlxuXHQgICAgLy8gVHVybiBpdCA5MCBkZWcuXG5cblx0ICAgIC8vIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBTVkcgYXJlYSB0byAxIGNocm9tb3NvbWUncyB3aWR0aFxuXHQgICAgdGhpcy5zZXRHZW9tKHsgaGVpZ2h0OiB0aGlzLnRvdGFsQ2hyV2lkdGgsIHJvdGF0aW9uOiAtOTAsIHRyYW5zbGF0aW9uOiBbLXRoaXMudG90YWxDaHJXaWR0aC8yICsgMTAsMzBdIH0pO1xuXHQgICAgLy8gXG5cdCAgICBsZXQgZGVsdGEgPSAxMDtcblx0ICAgIHJnLnhzY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuXHRcdCAuZG9tYWluKHJDaHJzLm1hcChmdW5jdGlvbih4KXtyZXR1cm4geC5uYW1lO30pKVxuXHRcdCAvLyBpbiBjbG9zZWQgbW9kZSwgdGhlIGNocm9tb3NvbWVzIGhhdmUgZml4ZWQgc3BhY2luZ1xuXHRcdCAucmFuZ2VQb2ludHMoW2RlbHRhLCBkZWx0YSt0aGlzLnRvdGFsQ2hyV2lkdGgqKHJDaHJzLmxlbmd0aC0xKV0pO1xuXHQgICAgLy9cblx0ICAgIHJnLnlzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0IC5kb21haW4oWzEscmcubWF4bGVuXSlcblx0XHQgLnJhbmdlKFswLCB0aGlzLndpZHRoXSk7XG5cblx0ICAgIC8vIHRyYW5zbGF0ZSBlYWNoIGNocm9tb3NvbWUgaW50byBwb3NpdGlvblxuXHQgICAgY2hycy5hdHRyKFwidHJhbnNmb3JtXCIsIGMgPT4gYHRyYW5zbGF0ZSgke3JnLnhzY2FsZShjLm5hbWUpfSwgMClgKTtcbiAgICAgICAgICAgIC8vIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oLXJnLnhzY2FsZSh0aGlzLmFwcC5jb29yZHMuY2hyKSk7XG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgLy8gV2hlbiBvcGVuLCBkcmF3IGFsbCB0aGUgY2hyb21vc29tZXMuIEVhY2ggY2hyb20gaXMgYSB2ZXJ0aWNhbCBsaW5lLlxuXHQgICAgLy8gQ2hyb21zIGFyZSBkaXN0cmlidXRlZCBldmVubHkgYWNyb3NzIHRoZSBhdmFpbGFibGUgaG9yaXpvbnRhbCBzcGFjZS5cblx0ICAgIHRoaXMuc2V0R2VvbSh7IHdpZHRoOiB0aGlzLm9wZW5XaWR0aCwgaGVpZ2h0OiB0aGlzLm9wZW5IZWlnaHQsIHJvdGF0aW9uOiAwLCB0cmFuc2xhdGlvbjogWzAsMF0gfSk7XG5cdCAgICAvLyBcblx0ICAgIHJnLnhzY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuXHRcdCAuZG9tYWluKHJDaHJzLm1hcChmdW5jdGlvbih4KXtyZXR1cm4geC5uYW1lO30pKVxuXHRcdCAvLyBpbiBjbG9zZWQgbW9kZSwgdGhlIGNocm9tb3NvbWVzIHNwcmVhZCB0byBmaWxsIHRoZSBzcGFjZVxuXHRcdCAucmFuZ2VQb2ludHMoWzAsIHRoaXMub3BlbldpZHRoIC0gMzBdLCAwLjUpO1xuXHQgICAgcmcueXNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQgLmRvbWFpbihbMSxyZy5tYXhsZW5dKVxuXHRcdCAucmFuZ2UoWzAsIHRoaXMuaGVpZ2h0XSk7XG5cblx0ICAgIC8vIHRyYW5zbGF0ZSBlYWNoIGNocm9tb3NvbWUgaW50byBwb3NpdGlvblxuXHQgICAgY2hycy5hdHRyKFwidHJhbnNmb3JtXCIsIGMgPT4gYHRyYW5zbGF0ZSgke3JnLnhzY2FsZShjLm5hbWUpfSwgMClgKTtcbiAgICAgICAgICAgIC8vIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oMCk7XG5cdH1cblxuXHRyQ2hycy5mb3JFYWNoKGNociA9PiB7XG5cdCAgICB2YXIgc2MgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdC5kb21haW4oWzEsY2hyLmxlbmd0aF0pXG5cdFx0LnJhbmdlKFswLCByZy55c2NhbGUoY2hyLmxlbmd0aCldKTtcblx0ICAgIGNoci5icnVzaCA9IGQzLnN2Zy5icnVzaCgpLnkoc2MpXG5cdCAgICAgICAub24oXCJicnVzaHN0YXJ0XCIsIGNociA9PiB0aGlzLmJydXNoc3RhcnQoY2hyKSlcblx0ICAgICAgIC5vbihcImJydXNoZW5kXCIsICgpID0+IHRoaXMuYnJ1c2hlbmQoKSk7XG5cdCAgfSwgdGhpcyk7XG5cblxuICAgICAgICBjaHJzLnNlbGVjdCgnW25hbWU9XCJsYWJlbFwiXScpXG5cdCAgICAudGV4dChjPT5jLm5hbWUpXG5cdCAgICAuYXR0cihcInhcIiwgMCkgXG5cdCAgICAuYXR0cihcInlcIiwgLTIpXG5cdCAgICA7XG5cblx0Y2hycy5zZWxlY3QoJ1tuYW1lPVwiYmFja2JvbmVcIl0nKVxuXHQgICAgLmF0dHIoXCJ4MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ5MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ4MlwiLCAwKVxuXHQgICAgLmF0dHIoXCJ5MlwiLCBjID0+IHJnLnlzY2FsZShjLmxlbmd0aCkpXG5cdCAgICA7XG5cdCAgIFxuXHRjaHJzLnNlbGVjdCgnW25hbWU9XCJicnVzaFwiXScpXG5cdCAgICAuZWFjaChmdW5jdGlvbihkKXtkMy5zZWxlY3QodGhpcykuY2FsbChkLmJydXNoKTt9KVxuXHQgICAgLnNlbGVjdEFsbCgncmVjdCcpXG5cdCAgICAgLmF0dHIoJ3dpZHRoJywxNilcblx0ICAgICAuYXR0cigneCcsIC04KVxuXHQgICAgO1xuXG5cdGNocnMuZXhpdCgpLnJlbW92ZSgpO1xuXHRcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTY3JvbGwgd2hlZWwgZXZlbnQgaGFuZGxlci5cbiAgICBzY3JvbGxXaGVlbCAoZHkpIHtcblx0Ly8gQWRkIGR5IHRvIHRvdGFsIHNjcm9sbCBhbW91bnQuIFRoZW4gdHJhbnNsYXRlIHRoZSBjaHJvbW9zb21lcyBncm91cC5cblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc0J5KGR5KTtcblx0Ly8gQWZ0ZXIgYSAyMDAgbXMgcGF1c2UgaW4gc2Nyb2xsaW5nLCBzbmFwIHRvIG5lYXJlc3QgY2hyb21vc29tZVxuXHR0aGlzLnRvdXQgJiYgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRvdXQpO1xuXHR0aGlzLnRvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKT0+dGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKSwgMjAwKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNUbyAoeCkge1xuICAgICAgICBpZiAoeCA9PT0gdW5kZWZpbmVkKSB4ID0gdGhpcy5zY3JvbGxBbW91bnQ7XG5cdHRoaXMuc2Nyb2xsQW1vdW50ID0gTWF0aC5tYXgoTWF0aC5taW4oeCwxNSksIC10aGlzLnRvdGFsQ2hyV2lkdGggKiAodGhpcy5hcHAuckdlbm9tZS5jaHJvbW9zb21lcy5sZW5ndGgtMSkpO1xuXHR0aGlzLmdDaHJvbW9zb21lcy5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHt0aGlzLnNjcm9sbEFtb3VudH0sMClgKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNCeSAoZHgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKHRoaXMuc2Nyb2xsQW1vdW50ICsgZHgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc1NuYXAgKCkge1xuXHRsZXQgaSA9IE1hdGgucm91bmQodGhpcy5zY3JvbGxBbW91bnQgLyB0aGlzLnRvdGFsQ2hyV2lkdGgpXG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbyhpKnRoaXMudG90YWxDaHJXaWR0aCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzVXAgKCkge1xuICAgICAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzQnkoLXRoaXMudG90YWxDaHJXaWR0aCk7XG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzRG93biAoKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNCeSh0aGlzLnRvdGFsQ2hyV2lkdGgpO1xuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3VGl0bGUgKCkge1xuXHRsZXQgcmVmZyA9IHRoaXMuYXBwLnJHZW5vbWUubGFiZWw7XG5cdGxldCBibG9ja2cgPSB0aGlzLmN1cnJCbG9ja3MgPyBcblx0ICAgIHRoaXMuY3VyckJsb2Nrcy5jb21wICE9PSB0aGlzLmFwcC5yR2Vub21lID9cblx0ICAgICAgICB0aGlzLmN1cnJCbG9ja3MuY29tcC5sYWJlbFxuXHRcdDpcblx0XHRudWxsXG5cdCAgICA6XG5cdCAgICBudWxsO1xuXHRsZXQgbHN0ID0gdGhpcy5hcHAuY3Vyckxpc3QgPyB0aGlzLmFwcC5jdXJyTGlzdC5uYW1lIDogbnVsbDtcblxuXHR0aGlzLnJvb3Quc2VsZWN0KFwibGFiZWwgc3Bhbi50aXRsZVwiKS50ZXh0KHJlZmcpO1xuXG5cdGxldCBsaW5lcyA9IFtdO1xuXHRibG9ja2cgJiYgbGluZXMucHVzaChgQmxvY2tzIHZzLiAke2Jsb2NrZ31gKTtcblx0bHN0ICYmIGxpbmVzLnB1c2goYEZlYXR1cmVzIGZyb20gbGlzdCBcIiR7bHN0fVwiYCk7XG5cdGxldCBzdWJ0ID0gbGluZXMuam9pbihcIiA6OiBcIik7XG5cdHRoaXMucm9vdC5zZWxlY3QoXCJsYWJlbCBzcGFuLnN1YnRpdGxlXCIpLnRleHQoKHN1YnQgPyBcIjo6IFwiIDogXCJcIikgKyBzdWJ0KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgb3V0bGluZXMgb2Ygc3ludGVueSBibG9ja3Mgb2YgdGhlIHJlZiBnZW5vbWUgdnMuXG4gICAgLy8gdGhlIGdpdmVuIGdlbm9tZS5cbiAgICAvLyBQYXNzaW5nIG51bGwgZXJhc2VzIGFsbCBzeW50ZW55IGJsb2Nrcy5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgIGRhdGEgPT0geyByZWY6R2Vub21lLCBjb21wOkdlbm9tZSwgYmxvY2tzOiBsaXN0IG9mIHN5bnRlbnkgYmxvY2tzIH1cbiAgICAvLyAgICBFYWNoIHNibG9jayA9PT0geyBibG9ja0lkOmludCwgb3JpOisvLSwgZnJvbUNociwgZnJvbVN0YXJ0LCBmcm9tRW5kLCB0b0NociwgdG9TdGFydCwgdG9FbmQgfVxuICAgIGRyYXdCbG9ja3MgKGRhdGEpIHtcblx0Ly9cbiAgICAgICAgbGV0IHNiZ3JwcyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpLnNlbGVjdCgnW25hbWU9XCJzeW5CbG9ja3NcIl0nKTtcblx0aWYgKCFkYXRhIHx8ICFkYXRhLmJsb2NrcyB8fCBkYXRhLmJsb2Nrcy5sZW5ndGggPT09IDApIHtcblx0ICAgIHRoaXMuY3VyckJsb2NrcyA9IG51bGw7XG5cdCAgICBzYmdycHMuaHRtbCgnJyk7XG5cdCAgICB0aGlzLmRyYXdUaXRsZSgpO1xuXHQgICAgcmV0dXJuO1xuXHR9XG5cdHRoaXMuY3VyckJsb2NrcyA9IGRhdGE7XG5cdC8vIHJlb3JnYW5pemUgZGF0YSB0byByZWZsZWN0IFNWRyBzdHJ1Y3R1cmUgd2Ugd2FudCwgaWUsIGdyb3VwZWQgYnkgY2hyb21vc29tZVxuICAgICAgICBsZXQgZHggPSBkYXRhLmJsb2Nrcy5yZWR1Y2UoKGEsc2IpID0+IHtcblx0XHRpZiAoIWFbc2IuZnJvbUNocl0pIGFbc2IuZnJvbUNocl0gPSBbXTtcblx0XHRhW3NiLmZyb21DaHJdLnB1c2goc2IpO1xuXHRcdHJldHVybiBhO1xuXHQgICAgfSwge30pO1xuXHRzYmdycHMuZWFjaChmdW5jdGlvbihjKXtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5kYXR1bSh7Y2hyOiBjLm5hbWUsIGJsb2NrczogZHhbYy5uYW1lXSB8fCBbXSB9KTtcblx0fSk7XG5cblx0bGV0IGJ3aWR0aCA9IDEwO1xuICAgICAgICBsZXQgc2Jsb2NrcyA9IHNiZ3Jwcy5zZWxlY3RBbGwoJ3JlY3Quc2Jsb2NrJykuZGF0YShiPT5iLmJsb2Nrcyk7XG4gICAgICAgIGxldCBuZXdicyA9IHNibG9ja3MuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsJ3NibG9jaycpO1xuXHRzYmxvY2tzXG5cdCAgICAuYXR0cihcInhcIiwgLWJ3aWR0aC8yIClcblx0ICAgIC5hdHRyKFwieVwiLCBiID0+IHRoaXMuZ2V0WShiLmZyb21TdGFydCkpXG5cdCAgICAuYXR0cihcIndpZHRoXCIsIGJ3aWR0aClcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGIgPT4gTWF0aC5tYXgoMCx0aGlzLmdldFkoYi5mcm9tRW5kIC0gYi5mcm9tU3RhcnQgKyAxKSkpXG5cdCAgICAuY2xhc3NlZChcImludmVyc2lvblwiLCBiID0+IGIub3JpID09PSBcIi1cIilcblx0ICAgIC5jbGFzc2VkKFwidHJhbnNsb2NhdGlvblwiLCBiID0+IGIuZnJvbUNociAhPT0gYi50b0Nocilcblx0ICAgIDtcblxuICAgICAgICBzYmxvY2tzLmV4aXQoKS5yZW1vdmUoKTtcblxuXHR0aGlzLmRyYXdUaXRsZSgpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRyYXdUaWNrcyAoaWRzKSB7XG5cdHRoaXMuY3VyclRpY2tzID0gaWRzIHx8IFtdO1xuXHR0aGlzLmFwcC5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlc0J5SWQodGhpcy5hcHAuckdlbm9tZSwgdGhpcy5jdXJyVGlja3MpXG5cdCAgICAudGhlbiggZmVhdHMgPT4geyB0aGlzLl9kcmF3VGlja3MoZmVhdHMpOyB9KTtcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgX2RyYXdUaWNrcyAoZmVhdHVyZXMpIHtcblx0bGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTsgLy8gcmVmIGdlbm9tZVxuXHQvLyBmZWF0dXJlIHRpY2sgbWFya3Ncblx0aWYgKCFmZWF0dXJlcyB8fCBmZWF0dXJlcy5sZW5ndGggPT09IDApIHtcblx0ICAgIHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbCgnW25hbWU9XCJ0aWNrc1wiXScpLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpLnJlbW92ZSgpO1xuXHQgICAgcmV0dXJuO1xuXHR9XG5cblx0Ly9cblx0bGV0IHRHcnBzID0gdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKFwiLmNocm9tb3NvbWVcIikuc2VsZWN0KCdbbmFtZT1cInRpY2tzXCJdJyk7XG5cblx0Ly8gZ3JvdXAgZmVhdHVyZXMgYnkgY2hyb21vc29tZVxuICAgICAgICBsZXQgZml4ID0gZmVhdHVyZXMucmVkdWNlKChhLGYpID0+IHsgXG5cdCAgICBpZiAoISBhW2YuY2hyXSkgYVtmLmNocl0gPSBbXTtcblx0ICAgIGFbZi5jaHJdLnB1c2goZik7XG5cdCAgICByZXR1cm4gYTtcblx0fSwge30pXG5cdHRHcnBzLmVhY2goZnVuY3Rpb24oYykge1xuXHQgICAgZDMuc2VsZWN0KHRoaXMpLmRhdHVtKCB7IGNocjogYywgZmVhdHVyZXM6IGZpeFtjLm5hbWVdICB8fCBbXX0gKTtcblx0fSk7XG5cblx0Ly8gdGhlIHRpY2sgZWxlbWVudHNcbiAgICAgICAgbGV0IGZlYXRzID0gdEdycHMuc2VsZWN0QWxsKFwiLmZlYXR1cmVcIilcblx0ICAgIC5kYXRhKGQgPT4gZC5mZWF0dXJlcywgZCA9PiBkLklEKTtcblx0Ly9cblx0bGV0IHhBZGogPSBmID0+IChmLnN0cmFuZCA9PT0gXCIrXCIgPyB0aGlzLnRpY2tMZW5ndGggOiAtdGhpcy50aWNrTGVuZ3RoKTtcblx0Ly9cblx0bGV0IHNoYXBlID0gXCJjaXJjbGVcIjsgIC8vIFwiY2lyY2xlXCIgb3IgXCJsaW5lXCJcblx0Ly9cblx0bGV0IG5ld2ZzID0gZmVhdHMuZW50ZXIoKVxuXHQgICAgLmFwcGVuZChzaGFwZSlcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImZlYXR1cmVcIilcblx0ICAgIC5vbignY2xpY2snLCAoZikgPT4ge1xuXHRcdGxldCBpID0gZi5jYW5vbmljYWx8fGYuSUQ7XG5cdCAgICAgICAgdGhpcy5hcHAuc2V0Q29udGV4dCh7bGFuZG1hcms6aSwgaGlnaGxpZ2h0OltpXX0pO1xuXHQgICAgfSkgO1xuXHRuZXdmcy5hcHBlbmQoXCJ0aXRsZVwiKVxuXHRcdC50ZXh0KGY9PmYuc3ltYm9sIHx8IGYuaWQpO1xuXHRpZiAoc2hhcGUgPT09IFwibGluZVwiKSB7XG5cdCAgICBmZWF0cy5hdHRyKFwieDFcIiwgZiA9PiB4QWRqKGYpICsgNSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ5MVwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ4MlwiLCBmID0+IHhBZGooZikgKyB0aGlzLnRpY2tMZW5ndGggKyA1KVxuXHQgICAgZmVhdHMuYXR0cihcInkyXCIsIGYgPT4gcmcueXNjYWxlKGYuc3RhcnQpKVxuXHR9XG5cdGVsc2Uge1xuXHQgICAgZmVhdHMuYXR0cihcImN4XCIsIGYgPT4geEFkaihmKSlcblx0ICAgIGZlYXRzLmF0dHIoXCJjeVwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0ICAgIGZlYXRzLmF0dHIoXCJyXCIsICB0aGlzLnRpY2tMZW5ndGggLyAyKTtcblx0fVxuXHQvL1xuXHRmZWF0cy5leGl0KCkucmVtb3ZlKClcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBHZW5vbWVWaWV3XG5cbmV4cG9ydCB7IEdlbm9tZVZpZXcgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0dlbm9tZVZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcblxuY2xhc3MgRmVhdHVyZURldGFpbHMgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMuaW5pdERvbSAoKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RG9tICgpIHtcblx0Ly9cblx0dGhpcy5yb290LnNlbGVjdCAoXCIuYnV0dG9uLmNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5leHRyYVwiLCAoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIHVwZGF0ZShmKSB7XG5cdC8vIGlmIGNhbGxlZCB3aXRoIG5vIGFyZ3MsIHVwZGF0ZSB1c2luZyB0aGUgcHJldmlvdXMgZmVhdHVyZVxuXHRmID0gZiB8fCB0aGlzLmxhc3RGZWF0dXJlO1xuXHRpZiAoIWYpIHtcblx0ICAgLy8gRklYTUU6IG1ham9yIHJlYWNob3ZlciBpbiB0aGlzIHNlY3Rpb25cblx0ICAgLy9cblx0ICAgLy8gZmFsbGJhY2suIHRha2UgdGhlIGZpcnN0IGhpZ2hsaWdodGVkLlxuXHQgICBsZXQgciA9IHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwicmVjdC5mZWF0dXJlLmhpZ2hsaWdodFwiKVswXVswXTtcblx0ICAgLy8gZmFsbGJhY2suIHRha2UgdGhlIGZpcnN0IGZlYXR1cmVcblx0ICAgaWYgKCFyKSByID0gdGhpcy5hcHAuem9vbVZpZXcuc3ZnTWFpbi5zZWxlY3QoXCJyZWN0LmZlYXR1cmVcIilbMF1bMF07XG5cdCAgIGlmIChyKSBmID0gci5fX2RhdGFfXztcblx0fVxuXHQvLyByZW1lbWJlclxuICAgICAgICBpZiAoIWYpIHRocm93IFwiQ2Fubm90IHVwZGF0ZSBmZWF0dXJlIGRldGFpbHMuIE5vIGZlYXR1cmUuXCI7XG5cdHRoaXMubGFzdEZlYXR1cmUgPSBmO1xuXG5cdC8vIGxpc3Qgb2YgZmVhdHVyZXMgdG8gc2hvdyBpbiBkZXRhaWxzIGFyZWEuXG5cdC8vIHRoZSBnaXZlbiBmZWF0dXJlIGFuZCBhbGwgZXF1aXZhbGVudHMgaW4gb3RoZXIgZ2Vub21lcy5cblx0bGV0IGZsaXN0ID0gW2ZdO1xuXHRpZiAoZi5jYW5vbmljYWwpIHtcblx0ICAgIC8vIEZJWE1FOiByZWFjaG92ZXJcblx0ICAgIGZsaXN0ID0gdGhpcy5hcHAuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkKGYuY2Fub25pY2FsKTtcblx0fVxuXHQvLyBHb3QgdGhlIGxpc3QuIE5vdyBvcmRlciBpdCB0aGUgc2FtZSBhcyB0aGUgZGlzcGxheWVkIGdlbm9tZXNcblx0Ly8gYnVpbGQgaW5kZXggb2YgZ2Vub21lIG5hbWUgLT4gZmVhdHVyZSBpbiBmbGlzdFxuXHRsZXQgaXggPSBmbGlzdC5yZWR1Y2UoKGFjYyxmKSA9PiB7IGFjY1tmLmdlbm9tZS5uYW1lXSA9IGY7IHJldHVybiBhY2M7IH0sIHt9KVxuXHRsZXQgZ2Vub21lT3JkZXIgPSAoW3RoaXMuYXBwLnJHZW5vbWVdLmNvbmNhdCh0aGlzLmFwcC5jR2Vub21lcykpO1xuXHRmbGlzdCA9IGdlbm9tZU9yZGVyLm1hcChnID0+IGl4W2cubmFtZV0gfHwgbnVsbCk7XG5cdC8vXG5cdGxldCBjb2xIZWFkZXJzID0gW1xuXHQgICAgLy8gY29sdW1ucyBoZWFkZXJzIGFuZCB0aGVpciAlIHdpZHRoc1xuXHQgICAgW1wiQ2Fub25pY2FsIGlkXCIgICAgICwxMF0sXG5cdCAgICBbXCJDYW5vbmljYWwgc3ltYm9sXCIgLDEwXSxcblx0ICAgIFtcIkdlbm9tZVwiICAgICAsOV0sXG5cdCAgICBbXCJJRFwiICAgICAsMTddLFxuXHQgICAgW1wiVHlwZVwiICAgICAgICwxMC41XSxcblx0ICAgIFtcIkJpb1R5cGVcIiAgICAsMTguNV0sXG5cdCAgICBbXCJDb29yZGluYXRlc1wiLDE4XSxcblx0ICAgIFtcIkxlbmd0aFwiICAgICAsN11cblx0XTtcblx0Ly8gSW4gdGhlIGNsb3NlZCBzdGF0ZSwgb25seSBzaG93IHRoZSBoZWFkZXIgYW5kIHRoZSByb3cgZm9yIHRoZSBwYXNzZWQgZmVhdHVyZVxuXHRpZiAodGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgZmxpc3QgPSBmbGlzdC5maWx0ZXIoIChmZiwgaSkgPT4gZmYgPT09IGYgKTtcblx0Ly8gRHJhdyB0aGUgdGFibGVcblx0bGV0IHQgPSB0aGlzLnJvb3Quc2VsZWN0KCd0YWJsZScpO1xuXHRsZXQgcm93cyA9IHQuc2VsZWN0QWxsKCd0cicpLmRhdGEoIFtjb2xIZWFkZXJzXS5jb25jYXQoZmxpc3QpICk7XG5cdHJvd3MuZW50ZXIoKS5hcHBlbmQoJ3RyJylcblx0ICAub24oXCJtb3VzZWVudGVyXCIsIChmLGkpID0+IGkgIT09IDAgJiYgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KGYsIHRydWUpKVxuXHQgIC5vbihcIm1vdXNlbGVhdmVcIiwgKGYsaSkgPT4gaSAhPT0gMCAmJiB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoKSk7XG5cdCAgICAgIFxuXHRyb3dzLmV4aXQoKS5yZW1vdmUoKTtcblx0cm93cy5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIChmZiwgaSkgPT4gKGkgIT09IDAgJiYgZmYgPT09IGYpKTtcblx0Ly9cblx0Ly8gR2l2ZW4gYSBmZWF0dXJlLCByZXR1cm5zIGEgbGlzdCBvZiBzdHJpbmdzIGZvciBwb3B1bGF0aW5nIGEgdGFibGUgcm93LlxuXHQvLyBJZiBpPT09MCwgdGhlbiBmIGlzIG5vdCBhIGZlYXR1cmUsIGJ1dCBhIGxpc3QgY29sdW1ucyBuYW1lcyt3aWR0aHMuXG5cdC8vIFxuXHRsZXQgY2VsbERhdGEgPSBmdW5jdGlvbiAoZiwgaSkge1xuXHQgICAgaWYgKGkgPT09IDApIHtcblx0XHRyZXR1cm4gZjtcblx0ICAgIH1cblx0ICAgIGxldCBjZWxsRGF0YSA9IFsgXCIuXCIsIFwiLlwiLCBnZW5vbWVPcmRlcltpLTFdLmxhYmVsLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiwgXCIuXCIgXTtcblx0ICAgIC8vIGYgaXMgbnVsbCBpZiBpdCBkb2Vzbid0IGV4aXN0IGZvciBnZW5vbWUgaSBcblx0ICAgIGlmIChmKSB7XG5cdFx0bGV0IGxpbmsgPSBcIlwiO1xuXHRcdGxldCBjYW5vbmljYWwgPSBmLmNhbm9uaWNhbCB8fCBcIlwiO1xuXHRcdGlmIChjYW5vbmljYWwpIHtcblx0XHQgICAgbGV0IHVybCA9IGBodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvYWNjZXNzaW9uLyR7Y2Fub25pY2FsfWA7XG5cdFx0ICAgIGxpbmsgPSBgPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7dXJsfVwiPiR7Y2Fub25pY2FsfTwvYT5gO1xuXHRcdH1cblx0XHRjZWxsRGF0YSA9IFtcblx0XHQgICAgbGluayB8fCBjYW5vbmljYWwsXG5cdFx0ICAgIGYuc3ltYm9sLFxuXHRcdCAgICBmLmdlbm9tZS5sYWJlbCxcblx0XHQgICAgZi5JRCxcblx0XHQgICAgZi50eXBlLFxuXHRcdCAgICBmLmJpb3R5cGUsXG5cdFx0ICAgIGAke2YuY2hyfToke2Yuc3RhcnR9Li4ke2YuZW5kfSAoJHtmLnN0cmFuZH0pYCxcblx0XHQgICAgYCR7Zi5lbmQgLSBmLnN0YXJ0ICsgMX0gYnBgXG5cdFx0XTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBjZWxsRGF0YTtcblx0fTtcblx0bGV0IGNlbGxzID0gcm93cy5zZWxlY3RBbGwoXCJ0ZFwiKVxuXHQgICAgLmRhdGEoKGYsaSkgPT4gY2VsbERhdGEoZixpKSk7XG5cdGNlbGxzLmVudGVyKCkuYXBwZW5kKFwidGRcIik7XG5cdGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcblx0Y2VsbHMuaHRtbCgoZCxpLGopID0+IHtcblx0ICAgIHJldHVybiBqID09PSAwID8gZFswXSA6IGRcblx0fSlcblx0LnN0eWxlKFwid2lkdGhcIiwgKGQsaSxqKSA9PiBqID09PSAwID8gYCR7ZFsxXX0lYCA6IG51bGwpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgRmVhdHVyZURldGFpbHMgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTVkdWaWV3IH0gZnJvbSAnLi9TVkdWaWV3JztcbmltcG9ydCB7IEZlYXR1cmUgfSBmcm9tICcuL0ZlYXR1cmUnO1xuaW1wb3J0IHsgcHJldHR5UHJpbnRCYXNlcywgY2xpcCwgcGFyc2VDb29yZHMsIGZvcm1hdENvb3JkcywgY29vcmRzQWZ0ZXJUcmFuc2Zvcm0sIHJlbW92ZUR1cHMgfSBmcm9tICcuL3V0aWxzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBab29tVmlldyBleHRlbmRzIFNWR1ZpZXcge1xuICAgIC8vXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0LCBpbml0aWFsQ29vcmRzLCBpbml0aWFsSGkpIHtcbiAgICAgIHN1cGVyKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIC8vXG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAvL1xuICAgICAgdGhpcy5taW5TdmdIZWlnaHQgPSAyNTA7XG4gICAgICB0aGlzLmJsb2NrSGVpZ2h0ID0gNjA7XG4gICAgICB0aGlzLnRvcE9mZnNldCA9IDE1O1xuICAgICAgdGhpcy5mZWF0SGVpZ2h0ID0gODtcdC8vIGhlaWdodCBvZiBhIHJlY3RhbmdsZSByZXByZXNlbnRpbmcgYSBmZWF0dXJlXG4gICAgICB0aGlzLmxhbmVHYXAgPSAyO1x0ICAgICAgICAvLyBzcGFjZSBiZXR3ZWVuIHN3aW0gbGFuZXNcbiAgICAgIHRoaXMubGFuZUhlaWdodCA9IHRoaXMuZmVhdEhlaWdodCArIHRoaXMubGFuZUdhcDtcbiAgICAgIHRoaXMubWluU3RyaXBIZWlnaHQgPSA3NTsgICAgLy8gaGVpZ2h0IHBlciBnZW5vbWUgaW4gdGhlIHpvb20gdmlld1xuICAgICAgdGhpcy5zdHJpcEdhcCA9IDIwO1x0Ly8gc3BhY2UgYmV0d2VlbiBzdHJpcHNcbiAgICAgIHRoaXMubWF4U0JnYXAgPSAyMDtcdC8vIG1heCBnYXAgYWxsb3dlZCBiZXR3ZWVuIGJsb2Nrcy5cbiAgICAgIHRoaXMuZG1vZGUgPSAnY29tcGFyaXNvbic7Ly8gZHJhd2luZyBtb2RlLiAnY29tcGFyaXNvbicgb3IgJ3JlZmVyZW5jZSdcbiAgICAgIHRoaXMud2hlZWxUaHJlc2hvbGQgPSAzO1x0Ly8gbWluaW11bSB3aGVlbCBkaXN0YW5jZSBcblxuICAgICAgLy9cbiAgICAgIC8vIElEcyBvZiBGZWF0dXJlcyB3ZSdyZSBoaWdobGlnaHRpbmcuIE1heSBiZSBmZWF0dXJlJ3MgSUQgIG9yIGNhbm9uaWNhbCBJRHIuL1xuICAgICAgLy8gaGlGZWF0cyBpcyBhbiBvYmogd2hvc2Uga2V5cyBhcmUgdGhlIElEc1xuICAgICAgdGhpcy5oaUZlYXRzID0gKGluaXRpYWxIaSB8fCBbXSkucmVkdWNlKCAoYSx2KSA9PiB7IGFbdl09djsgcmV0dXJuIGE7IH0sIHt9ICk7XG4gICAgICAvL1xuICAgICAgdGhpcy5maWR1Y2lhbHMgPSB0aGlzLnN2Zy5pbnNlcnQoJ2cnLCc6Zmlyc3QtY2hpbGQnKSAvLyBcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywnZmlkdWNpYWxzJyk7XG4gICAgICB0aGlzLnN0cmlwc0dycCA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCdzdHJpcHMnKTtcbiAgICAgIHRoaXMuYXhpcyA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ2cnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCdheGlzJyk7XG4gICAgICB0aGlzLmZsb2F0aW5nVGV4dCA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCdmbG9hdGluZ1RleHQnKTtcbiAgICAgIHRoaXMuY3h0TWVudSA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiY3h0TWVudVwiXScpO1xuICAgICAgLy9cbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBudWxsO1xuICAgICAgdGhpcy5kcmFnZ2VyID0gdGhpcy5nZXREcmFnZ2VyKCk7XG4gICAgICAvL1xuXHQvLyBDb25maWcgZm9yIG1lbnUgdW5kZXIgbWVudSBidXR0b25cblx0dGhpcy5jeHRNZW51Q2ZnID0gW3tcblx0ICAgIG5hbWU6ICdsaW5rVG9TbnBzJyxcblx0ICAgIGxhYmVsOiAnTUdJIFNOUHMnLCBcblx0ICAgIGljb246ICdvcGVuX2luX25ldycsXG5cdCAgICB0b29sdGlwOiAnVmlldyBTTlBzIGF0IE1HSSBmb3IgdGhlIGN1cnJlbnQgc3RyYWlucyBpbiB0aGUgY3VycmVudCByZWdpb24uIChTb21lIHN0cmFpbnMgbm90IGF2YWlsYWJsZS4pJyxcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpU25wUmVwb3J0KClcblx0fSx7XG5cdCAgICBuYW1lOiAnbGlua1RvUXRsJyxcblx0ICAgIGxhYmVsOiAnTUdJIFFUTHMnLCBcblx0ICAgIGljb246ICAnb3Blbl9pbl9uZXcnLFxuXHQgICAgdG9vbHRpcDogJ1ZpZXcgUVRMIGF0IE1HSSB0aGF0IG92ZXJsYXAgdGhlIGN1cnJlbnQgcmVnaW9uLicsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naVFUTHMoKVxuXHR9LHtcblx0ICAgIG5hbWU6ICdsaW5rVG9KYnJvd3NlJyxcblx0ICAgIGxhYmVsOiAnTUdJIEpCcm93c2UnLCBcblx0ICAgIGljb246ICdvcGVuX2luX25ldycsXG5cdCAgICB0b29sdGlwOiAnT3BlbiBNR0kgSkJyb3dzZSAoQzU3QkwvNkogR1JDbTM4KSB3aXRoIHRoZSBjdXJyZW50IGNvb3JkaW5hdGUgcmFuZ2UuJyxcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpSkJyb3dzZSgpXG5cdH0se1xuXHQgICAgbmFtZTogJ2NsZWFyQ2FjaGUnLFxuXHQgICAgbGFiZWw6ICdDbGVhciBjYWNoZScsIFxuXHQgICAgaWNvbjogJ2RlbGV0ZV9zd2VlcCcsXG5cdCAgICB0b29sdGlwOiAnRGVsZXRlIGNhY2hlZCBmZWF0dXJlcy4gRGF0YSB3aWxsIGJlIHJlbG9hZGVkIGZyb20gdGhlIHNlcnZlciBvbiBuZXh0IHVzZS4nLFxuXHQgICAgaGFuZGxlcjogKCk9PiB0aGlzLmFwcC5jbGVhckNhY2hlZERhdGEodHJ1ZSlcblx0fV07XG5cblx0Ly8gY29uZmlnIGZvciBhIGZlYXR1cmUncyBjb250ZXh0IG1lbnVcblx0dGhpcy5mY3h0TWVudUNmZyA9IFt7XG5cdCAgICBuYW1lOiAnbWVudVRpdGxlJyxcblx0ICAgIGxhYmVsOiAoZCkgPT4gYCR7ZC5zeW1ib2wgfHwgZC5JRH1gLCBcblx0ICAgIGNsczogJ21lbnVUaXRsZSdcblx0fSx7XG5cdCAgICBuYW1lOiAnbGluZVVwT25GZWF0dXJlJyxcblx0ICAgIGxhYmVsOiAnQWxpZ24gb24gdGhpcyBmZWF0dXJlLicsXG5cdCAgICBpY29uOiAnZm9ybWF0X2FsaWduX2NlbnRlcicsXG5cdCAgICB0b29sdGlwOiAnQWxpZ25zIHRoZSBkaXNwbGF5ZWQgZ2Vub21lcyBhcm91bmQgdGhpcyBmZWF0dXJlLicsXG5cdCAgICBoYW5kbGVyOiAoZikgPT4ge1xuXHRcdGxldCBpZHMgPSAobmV3IFNldChPYmplY3Qua2V5cyh0aGlzLmhpRmVhdHMpKSkuYWRkKGYuaWQpO1xuXHQgICAgICAgIHRoaXMuYXBwLnNldENvbnRleHQoe2xhbmRtYXJrOmYuaWQsIGRlbHRhOjAsIGhpZ2hsaWdodDpBcnJheS5mcm9tKGlkcyl9KVxuXHQgICAgfVxuXHR9LHtcblx0ICAgIG5hbWU6ICd0b01HSScsXG5cdCAgICBsYWJlbDogJ0ZlYXR1cmVATUdJJywgXG5cdCAgICBpY29uOiAnb3Blbl9pbl9uZXcnLFxuXHQgICAgdG9vbHRpcDogJ1NlZSBkZXRhaWxzIGZvciB0aGlzIGZlYXR1cmUgYXQgTUdJLicsXG5cdCAgICBoYW5kbGVyOiAoZikgPT4geyB3aW5kb3cub3BlbihgaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL2FjY2Vzc2lvbi8ke2YuaWR9YCwgJ19ibGFuaycpIH1cblx0fSx7XG5cdCAgICBuYW1lOiAndG9Nb3VzZU1pbmUnLFxuXHQgICAgbGFiZWw6ICdGZWF0dXJlQE1vdXNlTWluZScsIFxuXHQgICAgaWNvbjogJ29wZW5faW5fbmV3Jyxcblx0ICAgIHRvb2x0aXA6ICdTZWUgZGV0YWlscyBmb3IgdGhpcyBmZWF0dXJlIGF0IE1vdXNlTWluZS4nLFxuXHQgICAgaGFuZGxlcjogKGYpID0+IHRoaXMuYXBwLmxpbmtUb1JlcG9ydFBhZ2UoZilcblx0fSx7XG5cdCAgICBuYW1lOiAnZ2Vub21pY1NlcURvd25sb2FkJyxcblx0ICAgIGxhYmVsOiAnR2Vub21pYyBzZXF1ZW5jZXMnLCBcblx0ICAgIGljb246ICdjbG91ZF9kb3dubG9hZCcsXG5cdCAgICB0b29sdGlwOiAnRG93bmxvYWQgZ2Vub21pYyBzZXF1ZW5jZXMgZm9yIHRoaXMgZmVhdHVyZSBmcm9tIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcy4nLFxuXHQgICAgaGFuZGxlcjogKGYpID0+IHsgXG5cdFx0dGhpcy5hcHAuZG93bmxvYWRGYXN0YShmLCAnZ2Vub21pYycsIHRoaXMuYXBwLnZHZW5vbWVzLm1hcCh2Zz0+dmcubGFiZWwpKTtcblx0ICAgIH1cbiAgICAgICAgfSx7XG5cdCAgICBuYW1lOiAndHhwU2VxRG93bmxvYWQnLFxuXHQgICAgbGFiZWw6ICdUcmFuc2NyaXB0IHNlcXVlbmNlcycsIFxuXHQgICAgaWNvbjogJ2Nsb3VkX2Rvd25sb2FkJyxcblx0ICAgIHRvb2x0aXA6ICdEb3dubG9hZCB0cmFuc2NyaXB0IHNlcXVlbmNlcyBvZiB0aGlzIGZlYXR1cmUgZnJvbSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMuJyxcblx0ICAgIGhhbmRsZXI6IChmKSA9PiB7IFxuXHRcdHRoaXMuYXBwLmRvd25sb2FkRmFzdGEoZiwgJ3RyYW5zY3JpcHQnLCB0aGlzLmFwcC52R2Vub21lcy5tYXAodmc9PnZnLmxhYmVsKSk7XG5cdCAgICB9XG5cdH0se1xuXHQgICAgbmFtZTogJ2Nkc1NlcURvd25sb2FkJyxcblx0ICAgIGxhYmVsOiAnQ0RTIHNlcXVlbmNlcycsIFxuXHQgICAgaWNvbjogJ2Nsb3VkX2Rvd25sb2FkJyxcblx0ICAgIHRvb2x0aXA6ICdEb3dubG9hZCBjb2Rpbmcgc2VxdWVuY2VzIG9mIHRoaXMgZmVhdHVyZSBmcm9tIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcy4nLFxuXHQgICAgZGlzYWJsZXI6IChmKSA9PiBmLmJpb3R5cGUuaW5kZXhPZigncHJvdGVpbicpID09PSAtMSwgLy8gZGlzYWJsZSBpZiBmIGlzIG5vdCBwcm90ZWluIGNvZGluZ1xuXHQgICAgaGFuZGxlcjogKGYpID0+IHsgXG5cdFx0dGhpcy5hcHAuZG93bmxvYWRGYXN0YShmLCAnY2RzJywgdGhpcy5hcHAudkdlbm9tZXMubWFwKHZnPT52Zy5sYWJlbCkpO1xuXHQgICAgfVxuXHR9LHtcblx0ICAgIG5hbWU6ICdleG9uU2VxRG93bmxvYWQnLFxuXHQgICAgbGFiZWw6ICdFeG9uIHNlcXVlbmNlcycsIFxuXHQgICAgaWNvbjogJ2Nsb3VkX2Rvd25sb2FkJyxcblx0ICAgIHRvb2x0aXA6ICdEb3dubG9hZCBleG9uIHNlcXVlbmNlcyBvZiB0aGlzIGZlYXR1cmUgZnJvbSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMuJyxcblx0ICAgIGRpc2FibGVyOiAoZikgPT4gZi50eXBlLmluZGV4T2YoJ2dlbmUnKSA9PT0gLTEsXG5cdCAgICBoYW5kbGVyOiAoZikgPT4geyBcblx0XHR0aGlzLmFwcC5kb3dubG9hZEZhc3RhKGYsICdleG9uJywgdGhpcy5hcHAudkdlbm9tZXMubWFwKHZnPT52Zy5sYWJlbCkpO1xuXHQgICAgfVxuXHR9XTtcbiAgICAgIC8vXG4gICAgICB0aGlzLmluaXREb20oKTtcbiAgICB9XG4gICAgLy9cbiAgICBpbml0RG9tICgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgciA9IHRoaXMucm9vdDtcblx0bGV0IGEgPSB0aGlzLmFwcDtcblx0Ly9cblx0ci5zZWxlY3QoJy5idXR0b24uY2xvc2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHRoaXMudXBkYXRlKCkpO1xuXG5cdC8vIHpvb20gY29udHJvbHNcblx0ci5zZWxlY3QoJyN6b29tT3V0Jykub24oJ2NsaWNrJyxcblx0ICAgICgpID0+IHsgYS56b29tKGEuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdCgnI3pvb21JbicpIC5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnpvb20oMS9hLmRlZmF1bHRab29tKSB9KTtcblx0ci5zZWxlY3QoJyN6b29tT3V0TW9yZScpLm9uKCdjbGljaycsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgyKmEuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdCgnI3pvb21Jbk1vcmUnKSAub24oJ2NsaWNrJyxcblx0ICAgICgpID0+IHsgYS56b29tKDEvKDIqYS5kZWZhdWx0Wm9vbSkpIH0pO1xuXG5cdC8vIHBhbiBjb250cm9sc1xuXHRyLnNlbGVjdCgnI3BhbkxlZnQnKSAub24oJ2NsaWNrJyxcblx0ICAgICgpID0+IHsgYS5wYW4oLWEuZGVmYXVsdFBhbikgfSk7XG5cdHIuc2VsZWN0KCcjcGFuUmlnaHQnKS5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnBhbigrYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoJyNwYW5MZWZ0TW9yZScpIC5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnBhbigtNSphLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdCgnI3BhblJpZ2h0TW9yZScpLm9uKCdjbGljaycsXG5cdCAgICAoKSA9PiB7IGEucGFuKCs1KmEuZGVmYXVsdFBhbikgfSk7XG5cblx0Ly9cblx0dGhpcy5yb290XG5cdCAgLm9uKCdjbGljaycsICgpID0+IHtcblx0ICAgICAgLy8gY2xpY2sgb24gYmFja2dyb3VuZCA9PiBoaWRlIGNvbnRleHQgbWVudVxuXHQgICAgICBsZXQgdGd0ID0gZDMuZXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAodGd0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2knICYmIHRndC5pbm5lckhUTUwgPT09ICdtZW51Jylcblx0XHQgIC8vIGV4Y2VwdGlvbjogdGhlIGNvbnRleHQgbWVudSBidXR0b24gaXRzZWxmXG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgIGVsc2Vcblx0XHQgIHRoaXMuaGlkZUNvbnRleHRNZW51KClcblx0ICB9KTtcblxuXHQvLyBGZWF0dXJlIG1vdXNlIGV2ZW50IGhhbmRsZXJzLlxuXHQvL1xuXHRsZXQgZkNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChmLCBldnQsIHByZXNlcnZlKSB7XG5cdCAgICBsZXQgaWQgPSBmLmlkO1xuXHQgICAgaWYgKGV2dC5jdHJsS2V5KSB7XG5cdCAgICAgICAgbGV0IGN4ID0gZDMuZXZlbnQuY2xpZW50WDtcblx0ICAgICAgICBsZXQgY3kgPSBkMy5ldmVudC5jbGllbnRZO1xuXHQgICAgICAgIGxldCBiYiA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiem9vbWNvbnRyb2xzXCJdID4gLm1lbnUgPiAuYnV0dG9uJykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHR0aGlzLnNob3dDb250ZXh0TWVudSh0aGlzLmZjeHRNZW51Q2ZnLCBmLCBjeC1iYi54LCBjeS1iYi55KTtcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYgKGV2dC5zaGlmdEtleSkge1xuXHRcdGlmICh0aGlzLmhpRmVhdHNbaWRdKVxuXHRcdCAgICBkZWxldGUgdGhpcy5oaUZlYXRzW2lkXVxuXHRcdGVsc2Vcblx0XHQgICAgdGhpcy5oaUZlYXRzW2lkXSA9IGlkO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0aWYgKCFwcmVzZXJ2ZSkgdGhpcy5oaUZlYXRzID0ge307XG5cdFx0dGhpcy5oaUZlYXRzW2lkXSA9IGlkO1xuXHQgICAgfVxuXHQgICAgLy8gRklYTUU6IHJlYWNob3ZlclxuXHQgICAgdGhpcy5hcHAuZmVhdHVyZURldGFpbHMudXBkYXRlKGYpO1xuXHR9LmJpbmQodGhpcyk7XG5cdC8vXG5cdGxldCBmTW91c2VPdmVySGFuZGxlciA9IGZ1bmN0aW9uKGYpIHtcblx0XHRpZiAoZDMuZXZlbnQuYWx0S2V5KSB7XG5cdFx0ICAgIC8vIElmIHVzZXIgaXMgaG9sZGluZyB0aGUgYWx0IGtleSwgc2VsZWN0IGV2ZXJ5dGhpbmcgdG91Y2hlZC5cblx0XHQgICAgZkNsaWNrSGFuZGxlcihmLCBkMy5ldmVudCwgdHJ1ZSk7XG5cdFx0ICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdFx0ICAgIC8vIERvbid0IHJlZ2lzdGVyIGNvbnRleHQgY2hhbmdlcyB1bnRpbCB1c2VyIGhhcyBwYXVzZWQgZm9yIGF0IGxlYXN0IDFzLlxuXHRcdCAgICBpZiAodGhpcy50aW1lb3V0KSB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cdFx0ICAgIHRoaXMudGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHRoaXMuYXBwLmNvbnRleHRDaGFuZ2VkKCk7IH0uYmluZCh0aGlzKSwgMTAwMCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICB0aGlzLmhpZ2hsaWdodChmKTtcblx0XHQgICAgaWYgKGQzLmV2ZW50LmN0cmxLZXkpXG5cdFx0ICAgICAgICB0aGlzLmFwcC5mZWF0dXJlRGV0YWlscy51cGRhdGUoZik7XG5cdFx0fVxuXHR9LmJpbmQodGhpcyk7XG5cdC8vXG5cdGxldCBmTW91c2VPdXRIYW5kbGVyID0gZnVuY3Rpb24oZikge1xuXHRcdHRoaXMuaGlnaGxpZ2h0KCk7IFxuXHR9LmJpbmQodGhpcyk7XG5cblx0Ly8gXG4gICAgICAgIHRoaXMuc3ZnXG5cdCAgLm9uKCdjbGljaycsICgpID0+IHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QodCk7XG5cdCAgICAgIGlmICh0aGlzLmRlYWxXaXRoVW53YW50ZWRDbGlja0V2ZW50KSB7XG5cdCAgICAgICAgICB0aGlzLmRlYWxXaXRoVW53YW50ZWRDbGlja0V2ZW50ID0gZmFsc2U7XG5cdFx0ICByZXR1cm47XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKHQudGFnTmFtZSA9PSAncmVjdCcgJiYgdC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZlYXR1cmUnKSkge1xuXHRcdCAgLy8gdXNlciBjbGlja2VkIG9uIGEgZmVhdHVyZVxuXHRcdCAgZkNsaWNrSGFuZGxlcih0Ll9fZGF0YV9fLCBkMy5ldmVudCk7XG5cdFx0ICB0aGlzLmhpZ2hsaWdodCgpO1xuXHQgICAgICAgICAgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTtcblx0ICAgICAgfVxuXHQgICAgICBlbHNlIGlmICghZDMuZXZlbnQuc2hpZnRLZXkgJiYgXG5cdCAgICAgICAgICAodC50YWdOYW1lID09PSAnc3ZnJyBcblx0XHQgIHx8IHQudGFnTmFtZSA9PSAncmVjdCcgJiYgdC5jbGFzc0xpc3QuY29udGFpbnMoJ2Jsb2NrJylcblx0XHQgIHx8IHQudGFnTmFtZSA9PSAncmVjdCcgJiYgdC5jbGFzc0xpc3QuY29udGFpbnMoJ3VuZGVybGF5Jylcblx0XHQgICkpe1xuXHRcdCAgLy8gdXNlciBjbGlja2VkIG9uIGJhY2tncm91bmRcblx0XHQgIHRoaXMuaGlGZWF0cyA9IHt9O1xuXHRcdCAgdGhpcy5oaWdobGlnaHQoKTtcblx0XHQgIHRoaXMuYXBwLmNvbnRleHRDaGFuZ2VkKCk7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbignY29udGV4dG1lbnUnLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZDbGlja0hhbmRsZXIoZiwgZDMuZXZlbnQpO1xuXHQgICAgICB9XG5cdCAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgIH0pXG5cdCAgLm9uKCdtb3VzZW92ZXInLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU92ZXJIYW5kbGVyKGYpO1xuXHQgICAgICB9XG5cdCAgfSlcblx0ICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuXHQgICAgICBsZXQgdGd0ID0gZDMuc2VsZWN0KGQzLmV2ZW50LnRhcmdldCk7XG5cdCAgICAgIGxldCBmID0gdGd0LmRhdGEoKVswXTtcblx0ICAgICAgaWYgKGYgaW5zdGFuY2VvZiBGZWF0dXJlKSB7XG5cdFx0ICBmTW91c2VPdXRIYW5kbGVyKGYpO1xuXHQgICAgICB9XG5cdCAgfSlcblx0ICAub24oJ3doZWVsJywgZnVuY3Rpb24oZCkge1xuXHQgICAgbGV0IGUgPSBkMy5ldmVudDtcblx0ICAgIC8vIGxldCB0aGUgYnJvd3NlciBoYW5kbGVyIHZlcnRpY2FsIG1vdGlvblxuXHQgICAgaWYgKE1hdGguYWJzKGUuZGVsdGFYKSA8IE1hdGguYWJzKGUuZGVsdGFZKSlcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAvLyB3ZSBoYW5kbGUgaG9yaXpvbnRhbCBtb3Rpb24uXG5cdCAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgLy8gZmlsdGVyIG91dCB0aW55IG1vdGlvbnNcblx0ICAgIGlmIChNYXRoLmFicyhlLmRlbHRhWCkgPCB0aGlzLndoZWVsVGhyZXNob2xkKSBcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAvLyBnZXQgdGhlIHpvb20gc3RyaXAgdGFyZ2V0LCBpZiBpdCBleGlzdHMsIGVsc2UgdGhlIHJlZiB6b29tIHN0cmlwLlxuXHQgICAgbGV0IHogPSBlLnRhcmdldC5jbG9zZXN0KCdnLnpvb21TdHJpcCcpIHx8IGQzLnNlbGVjdCgnZy56b29tU3RyaXAucmVmZXJlbmNlJylbMF1bMF07XG5cdCAgICBpZiAoIXopIHJldHVybjtcblxuXHQgICAgbGV0IGRiID0gZS5kZWx0YVggLyBzZWxmLnBwYjsgLy8gZGVsdGEgaW4gYmFzZXMgZm9yIHRoaXMgZXZlbnRcblx0ICAgIGxldCB6ZCA9IHouX19kYXRhX187XG5cdCAgICBpZiAoZS5jdHJsS2V5KSB7XG5cdFx0Ly8gQ3RybC13aGVlbCBzaW1wbHkgc2xpZGVzIHRoZSBzdHJpcCBob3Jpem9udGFsbHkgKHRlbXBvcmFyeSlcblx0XHQvLyBGb3IgY29tcGFyaXNvbiBnZW5vbWVzLCBqdXN0IHRyYW5zbGF0ZSB0aGUgYmxvY2tzIGJ5IHRoZSB3aGVlbCBhbW91bnQsIHNvIHRoZSB1c2VyIGNhbiBcblx0XHQvLyBzZWUgZXZlcnl0aGluZy5cblx0XHR6ZC5kZWx0YUIgKz0gZGI7XG5cdCAgICAgICAgZDMuc2VsZWN0KHopLnNlbGVjdCgnZ1tuYW1lPVwic0Jsb2Nrc1wiXScpLmF0dHIoJ3RyYW5zZm9ybScsYHRyYW5zbGF0ZSgkey16ZC5kZWx0YUIgKiBzZWxmLnBwYn0sMClzY2FsZSgke3pkLnhTY2FsZX0sMSlgKTtcblx0XHRzZWxmLmRyYXdGaWR1Y2lhbHMoKTtcblx0XHRyZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIC8vIE5vcm1hbCB3aGVlbCBldmVudCA9IHBhbiB0aGUgdmlldy5cblx0ICAgIC8vXG5cdCAgICBsZXQgYyAgPSBzZWxmLmFwcC5jb29yZHM7XG5cdCAgICAvLyBMaW1pdCBkZWx0YSBieSBjaHIgZW5kc1xuXHQgICAgLy8gRGVsdGEgaW4gYmFzZXM6XG5cdCAgICB6ZC5kZWx0YUIgPSBjbGlwKHpkLmRlbHRhQiArIGRiLCAtYy5zdGFydCwgYy5jaHJvbW9zb21lLmxlbmd0aCAtIGMuZW5kKVxuXHQgICAgLy8gdHJhbnNsYXRlXG5cdCAgICBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKCdnLnpvb21TdHJpcCA+IGdbbmFtZT1cInNCbG9ja3NcIl0nKVxuXHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCBjeiA9PiBgdHJhbnNsYXRlKCR7LXpkLmRlbHRhQiAqIHNlbGYucHBifSwwKXNjYWxlKCR7Y3oueFNjYWxlfSwxKWApO1xuXHQgICAgc2VsZi5kcmF3RmlkdWNpYWxzKCk7XG5cdCAgICAvLyBXYWl0IHVudGlsIHdoZWVsIGV2ZW50cyBoYXZlIHN0b3BwZWQgZm9yIGEgd2hpbGUsIHRoZW4gc2Nyb2xsIHRoZSB2aWV3LlxuXHQgICAgaWYgKHNlbGYudGltZW91dClcblx0ICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dCk7XG5cdCAgICBzZWxmLnRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0c2VsZi50aW1lb3V0ID0gbnVsbDtcblx0XHRsZXQgY2N4dCA9IHNlbGYuYXBwLmdldENvbnRleHQoKTtcblx0XHRpZiAoY2N4dC5sYW5kbWFyaykge1xuXHRcdCAgICBzZWxmLmFwcC5zZXRDb250ZXh0KHsgZGVsdGE6IGNjeHQuZGVsdGEgKyB6ZC5kZWx0YUIgfSk7XG5cdFx0ICAgIHpkLmRlbHRhQiA9IDA7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICBzZWxmLmFwcC5zZXRDb250ZXh0KHsgXG5cdFx0ICAgICAgICBzdGFydDogY2N4dC5zdGFydCArIHpkLmRlbHRhQixcblx0XHQgICAgICAgIGVuZDogY2N4dC5lbmQgKyB6ZC5kZWx0YUJcblx0XHRcdH0pO1xuXHRcdCAgICB6ZC5kZWx0YUIgPSAwO1xuXHRcdH1cblx0ICAgIH0sIDUwKTtcblx0fSk7XG5cblxuXHQvLyBCdXR0b246IERyb3AgZG93biBtZW51IGluIHpvb20gdmlld1xuXHR0aGlzLnJvb3Quc2VsZWN0KCcubWVudSA+IC5idXR0b24nKVxuXHQgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIC8vIHNob3cgY29udGV4dCBtZW51IGF0IG1vdXNlIGV2ZW50IGNvb3JkaW5hdGVzXG5cdCAgICAgIGxldCBjeCA9IGQzLmV2ZW50LmNsaWVudFg7XG5cdCAgICAgIGxldCBjeSA9IGQzLmV2ZW50LmNsaWVudFk7XG5cdCAgICAgIGxldCBiYiA9IGQzLnNlbGVjdCh0aGlzKVswXVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIHNlbGYuc2hvd0NvbnRleHRNZW51KHNlbGYuY3h0TWVudUNmZywgbnVsbCwgY3gtYmIubGVmdCwgY3ktYmIudG9wKTtcblx0ICB9KTtcblx0Ly8gem9vbSBjb29yZGluYXRlcyBib3hcblx0dGhpcy5yb290LnNlbGVjdCgnI3pvb21Db29yZHMnKVxuXHQgICAgLmNhbGwoemNzID0+IHpjc1swXVswXS52YWx1ZSA9IGZvcm1hdENvb3Jkcyh0aGlzLmFwcC5jb29yZHMpKVxuXHQgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHsgdGhpcy5zZWxlY3QoKTsgfSlcblx0ICAgIC5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkgeyBzZWxmLmFwcC5zZXRDb29yZGluYXRlcyh0aGlzLnZhbHVlKTsgfSk7XG5cblx0Ly8gem9vbSB3aW5kb3cgc2l6ZSBib3hcblx0dGhpcy5yb290LnNlbGVjdCgnI3pvb21XU2l6ZScpXG5cdCAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkgeyB0aGlzLnNlbGVjdCgpOyB9KVxuXHQgICAgLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0ICAgICAgICBsZXQgd3MgPSBwYXJzZUludCh0aGlzLnZhbHVlKTtcblx0XHRsZXQgYyA9IHNlbGYuYXBwLmNvb3Jkcztcblx0XHRpZiAoaXNOYU4od3MpIHx8IHdzIDwgMTAwKSB7XG5cdFx0ICAgIGFsZXJ0KCdJbnZhbGlkIHdpbmRvdyBzaXplLiBQbGVhc2UgZW50ZXIgYW4gaW50ZWdlciA+PSAxMDAuJyk7XG5cdFx0ICAgIHRoaXMudmFsdWUgPSBNYXRoLnJvdW5kKGMuZW5kIC0gYy5zdGFydCArIDEpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHQgICAgbGV0IG1pZCA9IChjLnN0YXJ0ICsgYy5lbmQpIC8gMjtcblx0XHQgICAgbGV0IG5ld3MgPSBNYXRoLnJvdW5kKG1pZCAtIHdzLzIpO1xuXHRcdCAgICBsZXQgbmV3ZSA9IG5ld3MgKyB3cyAtIDE7XG5cdFx0ICAgIHNlbGYuYXBwLnNldENvbnRleHQoe1xuXHRcdCAgICAgICAgY2hyOiBjLmNocixcblx0XHRcdHN0YXJ0OiBuZXdzLFxuXHRcdFx0ZW5kOiBuZXdlLFxuXHRcdFx0bGVuZ3RoOiBuZXdlLW5ld3MrMVxuXHRcdCAgICB9KTtcblx0XHR9XG5cdCAgICB9KTtcblx0Ly8gem9vbSBkcmF3aW5nIG1vZGUgXG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ2RpdltuYW1lPVwiem9vbURtb2RlXCJdIC5idXR0b24nKVxuXHQgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdGlmIChkMy5zZWxlY3QodGhpcykuYXR0cignZGlzYWJsZWQnKSlcblx0XHQgICAgcmV0dXJuO1xuXHRcdGxldCByID0gc2VsZi5yb290O1xuXHRcdGxldCBpc0MgPSByLmNsYXNzZWQoJ2NvbXBhcmlzb24nKTtcblx0XHRyLmNsYXNzZWQoJ2NvbXBhcmlzb24nLCAhaXNDKTtcblx0XHRyLmNsYXNzZWQoJ3JlZmVyZW5jZScsIGlzQyk7XG5cdFx0c2VsZi5hcHAuc2V0Q29udGV4dCh7ZG1vZGU6IHIuY2xhc3NlZCgnY29tcGFyaXNvbicpID8gJ2NvbXBhcmlzb24nIDogJ3JlZmVyZW5jZSd9KTtcblx0ICAgIH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXQgaGlnaGxpZ2h0ZWQgKGhscykge1xuXHRpZiAodHlwZW9mKGhscykgPT09ICdzdHJpbmcnKVxuXHQgICAgaGxzID0gW2hsc107XG5cdC8vXG5cdHRoaXMuaGlGZWF0cyA9IHt9O1xuICAgICAgICBmb3IobGV0IGggb2YgaGxzKXtcblx0ICAgIHRoaXMuaGlGZWF0c1toXSA9IGg7XG5cdH1cbiAgICB9XG4gICAgZ2V0IGhpZ2hsaWdodGVkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlGZWF0cyA/IE9iamVjdC5rZXlzKHRoaXMuaGlGZWF0cykgOiBbXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93RmxvYXRpbmdUZXh0ICh0ZXh0LCB4LCB5KSB7XG5cdGxldCBzciA9IHRoaXMuc3ZnLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0eCA9IHgtc3IueC0xMjtcblx0eSA9IHktc3IueTtcblx0bGV0IGFuY2hvciA9IHggPCA2MCA/ICdzdGFydCcgOiB0aGlzLndpZHRoLXggPCA2MCA/ICdlbmQnIDogJ21pZGRsZSc7XG5cdHRoaXMuZmxvYXRpbmdUZXh0XG5cdCAgICAudGV4dCh0ZXh0KVxuXHQgICAgLnN0eWxlKCd0ZXh0LWFuY2hvcicsYW5jaG9yKVxuXHQgICAgLmF0dHIoJ3gnLCB4KVxuXHQgICAgLmF0dHIoJ3knLCB5KVxuICAgIH1cbiAgICBoaWRlRmxvYXRpbmdUZXh0ICgpIHtcblx0dGhpcy5mbG9hdGluZ1RleHQudGV4dCgnJyk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXRDb250ZXh0TWVudSAoaXRlbXMsb2JqKSB7XG5cdHRoaXMuY3h0TWVudS5zZWxlY3RBbGwoJy5tZW51SXRlbScpLnJlbW92ZSgpOyAvLyBpbiBjYXNlIG9mIHJlLWluaXRcbiAgICAgICAgbGV0IG1pdGVtcyA9IHRoaXMuY3h0TWVudVxuXHQgIC5zZWxlY3RBbGwoJy5tZW51SXRlbScpXG5cdCAgLmRhdGEoaXRlbXMpO1xuXHRsZXQgbmV3cyA9IG1pdGVtcy5lbnRlcigpXG5cdCAgLmFwcGVuZCgnZGl2Jylcblx0ICAuYXR0cignY2xhc3MnLCAoZCkgPT4gYG1lbnVJdGVtIGZsZXhyb3cgJHtkLmNsc3x8Jyd9YClcblx0ICAuY2xhc3NlZCgnZGlzYWJsZWQnLCBkID0+IGQuZGlzYWJsZXIgPyBkLmRpc2FibGVyKG9iaikgOiBmYWxzZSlcblx0ICAuYXR0cignbmFtZScsIGQgPT4gZC5uYW1lIHx8IG51bGwgKVxuXHQgIC5hdHRyKCd0aXRsZScsIGQgPT4gZC50b29sdGlwIHx8IG51bGwgKTtcblxuXHRsZXQgaGFuZGxlciA9IGQgPT4ge1xuXHQgICAgICBpZiAoZC5kaXNhYmxlciAmJiBkLmRpc2FibGVyKG9iaikpXG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgIGQuaGFuZGxlciAmJiBkLmhhbmRsZXIob2JqKTtcblx0ICAgICAgdGhpcy5oaWRlQ29udGV4dE1lbnUoKTtcblx0ICAgICAgZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH07XG5cdG5ld3MuYXBwZW5kKCdsYWJlbCcpXG5cdCAgLnRleHQoZCA9PiB0eXBlb2YoZC5sYWJlbCkgPT09ICdmdW5jdGlvbicgPyBkLmxhYmVsKG9iaikgOiBkLmxhYmVsKVxuXHQgIC5vbignY2xpY2snLCBoYW5kbGVyKVxuXHQgIC5vbignY29udGV4dG1lbnUnLCBoYW5kbGVyKTtcblx0bmV3cy5hcHBlbmQoJ2knKVxuXHQgIC5hdHRyKCdjbGFzcycsICdtYXRlcmlhbC1pY29ucycpXG5cdCAgLnRleHQoIGQ9PmQuaWNvbiApO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93Q29udGV4dE1lbnUgKGNmZyxmLHgseSkge1xuICAgICAgICB0aGlzLmluaXRDb250ZXh0TWVudShjZmcsIGYpO1xuICAgICAgICB0aGlzLmN4dE1lbnVcblx0ICAgIC5jbGFzc2VkKCdzaG93aW5nJywgdHJ1ZSlcblx0ICAgIC5zdHlsZSgnbGVmdCcsIGAke3h9cHhgKVxuXHQgICAgLnN0eWxlKCd0b3AnLCBgJHt5fXB4YClcblx0ICAgIDtcblx0aWYgKGYpIHtcblx0ICAgIHRoaXMuY3h0TWVudS5vbignbW91c2VlbnRlcicsICgpPT50aGlzLmhpZ2hsaWdodChmKSk7XG5cdCAgICB0aGlzLmN4dE1lbnUub24oJ21vdXNlbGVhdmUnLCAoKT0+IHtcblx0ICAgICAgICB0aGlzLmhpZ2hsaWdodCgpO1xuXHRcdHRoaXMuaGlkZUNvbnRleHRNZW51KCk7XG5cdCAgICB9KTtcblx0fVxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWRlQ29udGV4dE1lbnUgKCkge1xuICAgICAgICB0aGlzLmN4dE1lbnUuY2xhc3NlZCgnc2hvd2luZycsIGZhbHNlKTtcblx0dGhpcy5jeHRNZW51Lm9uKCdtb3VzZWVudGVyJywgbnVsbCk7XG5cdHRoaXMuY3h0TWVudS5vbignbW91c2VsZWF2ZScsIG51bGwpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIGdzIChsaXN0IG9mIEdlbm9tZXMpXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vICAgICBGb3IgZWFjaCBHZW5vbWUsIHNldHMgZy56b29tWSBcbiAgICBzZXQgZ2Vub21lcyAoZ3MpIHtcbiAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy50b3BPZmZzZXQ7XG4gICAgICAgZ3MuZm9yRWFjaCggZyA9PiB7XG4gICAgICAgICAgIGcuem9vbVkgPSBvZmZzZXQ7XG5cdCAgIG9mZnNldCArPSB0aGlzLm1pblN0cmlwSGVpZ2h0ICsgdGhpcy5zdHJpcEdhcDtcbiAgICAgICB9KTtcbiAgICAgICB0aGlzLl9nZW5vbWVzID0gZ3M7XG4gICAgfVxuICAgIGdldCBnZW5vbWVzICgpIHtcbiAgICAgICByZXR1cm4gdGhpcy5fZ2Vub21lcztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcyAoc3RyaXBlcykgaW4gdG9wLXRvLWJvdHRvbSBvcmRlci5cbiAgICAvL1xuICAgIGdldEdlbm9tZVlPcmRlciAoKSB7XG4gICAgICAgIGxldCBzdHJpcHMgPSB0aGlzLnN2Z01haW4uc2VsZWN0QWxsKCcuem9vbVN0cmlwJyk7XG4gICAgICAgIGxldCBzcyA9IHN0cmlwc1swXS5tYXAoZz0+IHtcblx0ICAgIGxldCBiYiA9IGcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICByZXR1cm4gW2JiLnksIGcuX19kYXRhX18uZ2Vub21lLm5hbWVdO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IG5zID0gc3Muc29ydCggKGEsYikgPT4gYVswXSAtIGJbMF0gKS5tYXAoIHggPT4geFsxXSApXG5cdHJldHVybiBucztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyB0aGUgdG9wLXRvLWJvdHRvbSBvcmRlciBvZiB0aGUgY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzIGFjY29yZGluZyB0byBcbiAgICAvLyB0aGUgZ2l2ZW4gbmFtZSBsaXN0IG9mIG5hbWVzLiBCZWNhdXNlIHdlIGNhbid0IGd1YXJhbnRlZSB0aGUgZ2l2ZW4gbmFtZXMgY29ycmVzcG9uZFxuICAgIC8vIHRvIGFjdHVhbCB6b29tIHN0cmlwcywgb3IgdGhhdCBhbGwgc3RyaXBzIGFyZSByZXByZXNlbnRlZCwgZXRjLlxuICAgIC8vIFRoZXJlZm9yZSwgdGhlIGxpc3QgaXMgcHJlcHJlY2Vzc2VkIGFzIGZvbGxvd3M6XG4gICAgLy8gICAgICogZHVwbGljYXRlIG5hbWVzLCBpZiB0aGV5IGV4aXN0LCBhcmUgcmVtb3ZlZFxuICAgIC8vICAgICAqIG5hbWVzIHRoYXQgZG8gbm90IGNvcnJlc3BvbmQgdG8gZXhpc3Rpbmcgem9vbVN0cmlwcyBhcmUgcmVtb3ZlZFxuICAgIC8vICAgICAqIG5hbWVzIG9mIGV4aXN0aW5nIHpvb20gc3RyaXBzIHRoYXQgZG9uJ3QgYXBwZWFyIGluIHRoZSBsaXN0IGFyZSBhZGRlZCB0byB0aGUgZW5kXG4gICAgLy8gVGhlIHJlc3VsdCBpcyBhIGxpc3Qgb2YgbmFtZXMgd2l0aCB0aGVzZSBwcm9wZXJ0aWVzOlxuICAgIC8vICAgICAqIHRoZXJlIGlzIGEgMToxIGNvcnJlc3BvbmRlbmNlIGJldHdlZW4gbmFtZXMgYW5kIGFjdHVhbCB6b29tIHN0cmlwc1xuICAgIC8vICAgICAqIHRoZSBuYW1lIG9yZGVyIGlzIGNvbnNpc3RlbnQgd2l0aCB0aGUgaW5wdXQgbGlzdFxuICAgIC8vIFRoaXMgaXMgdGhlIGxpc3QgdXNlZCB0byAocmUpb3JkZXIgdGhlIHpvb20gc3RyaXBzLlxuICAgIC8vXG4gICAgLy8gR2l2ZW4gdGhlIGxpc3Qgb3JkZXI6IFxuICAgIC8vICAgICAqIGEgWS1wb3NpdGlvbiBpcyBhc3NpZ25lZCB0byBlYWNoIGdlbm9tZVxuICAgIC8vICAgICAqIHpvb20gc3RyaXBzIHRoYXQgYXJlIE5PVCBDVVJSRU5UTFkgQkVJTkcgRFJBR0dFRCBhcmUgdHJhbnNsYXRlZCB0byB0aGVpciBuZXcgbG9jYXRpb25zXG4gICAgLy9cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBucyAobGlzdCBvZiBzdHJpbmdzKSBOYW1lcyBvZiB0aGUgZ2Vub21lcy5cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgICBub3RoaW5nXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vICAgICBSZWNhbGN1bGF0ZXMgdGhlIFktY29vcmRpbmF0ZXMgZm9yIGVhY2ggc3RyaXAgYmFzZWQgb24gdGhlIGdpdmVuIG9yZGVyLCB0aGVuIHRyYW5zbGF0ZXNcbiAgICAvLyAgICAgZWFjaCBzdHJpcCB0byBpdHMgbmV3IHBvc2l0aW9uLlxuICAgIC8vXG4gICAgc2V0R2Vub21lWU9yZGVyIChucykge1xuXHR0aGlzLmdlbm9tZXMgPSByZW1vdmVEdXBzKG5zKS5tYXAobj0+IHRoaXMuYXBwLm5hbWUyZ2Vub21lW25dICkuZmlsdGVyKHg9PngpO1xuXHRsZXQgbyA9IHRoaXMudG9wT2Zmc2V0O1xuICAgICAgICB0aGlzLmdlbm9tZXMuZm9yRWFjaCggKGcsaSkgPT4ge1xuXHQgICAgbGV0IHN0cmlwID0gZDMuc2VsZWN0KGAjem9vbVZpZXcgLnpvb21TdHJpcFtuYW1lPVwiJHtnLm5hbWV9XCJdYCk7XG5cdCAgICBpZiAoIXN0cmlwLmNsYXNzZWQoJ2RyYWdnaW5nJykpXG5cdCAgICAgICAgc3RyaXAuYXR0cigndHJhbnNmb3JtJywgZ2QgPT4gYHRyYW5zbGF0ZSgwLCR7byArIGdkLnplcm9PZmZzZXR9KWApO1xuXHQgICAgbyArPSBzdHJpcC5kYXRhKClbMF0uc3RyaXBIZWlnaHQgKyB0aGlzLnN0cmlwR2FwO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgZHJhZ2dlciAoZDMuYmVoYXZpb3IuZHJhZykgdG8gYmUgYXR0YWNoZWQgdG8gZWFjaCB6b29tIHN0cmlwLlxuICAgIC8vIEFsbG93cyBzdHJpcHMgdG8gYmUgcmVvcmRlcmVkIGJ5IGRyYWdnaW5nLlxuICAgIGdldERyYWdnZXIgKCkgeyAgXG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICByZXR1cm4gZDMuYmVoYXZpb3IuZHJhZygpXG5cdCAgLm9yaWdpbihmdW5jdGlvbihkLGkpe1xuXHQgICAgICByZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICB9KVxuICAgICAgICAgIC5vbignZHJhZ3N0YXJ0LnonLCBmdW5jdGlvbihnKSB7XG5cdCAgICAgIGxldCB0ID0gZDMuZXZlbnQuc291cmNlRXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAoZDMuZXZlbnQuc291cmNlRXZlbnQuc2hpZnRLZXkgfHwgISBkMy5zZWxlY3QodCkuY2xhc3NlZCgnem9vbVN0cmlwSGFuZGxlJykpe1xuXHQgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICB9XG5cdCAgICAgIGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICBsZXQgc3RyaXAgPSB0aGlzLmNsb3Nlc3QoJy56b29tU3RyaXAnKTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZyA9IGQzLnNlbGVjdChzdHJpcCkuY2xhc3NlZCgnZHJhZ2dpbmcnLCB0cnVlKTtcblx0ICB9KVxuXHQgIC5vbignZHJhZy56JywgZnVuY3Rpb24gKGcpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIGxldCBteCA9IGQzLm1vdXNlKHNlbGYuc3ZnTWFpblswXVswXSlbMF07XG5cdCAgICAgIGxldCBteSA9IGQzLm1vdXNlKHNlbGYuc3ZnTWFpblswXVswXSlbMV07XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke215fSlgKTtcblx0ICAgICAgc2VsZi5zZXRHZW5vbWVZT3JkZXIoc2VsZi5nZXRHZW5vbWVZT3JkZXIoKSk7XG5cdCAgICAgIHNlbGYuZHJhd0ZpZHVjaWFscygpO1xuXHQgIH0pXG5cdCAgLm9uKCdkcmFnZW5kLnonLCBmdW5jdGlvbiAoZykge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgLy9cblx0ICAgICAgc2VsZi5kcmFnZ2luZy5jbGFzc2VkKCdkcmFnZ2luZycsIGZhbHNlKTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZyA9IG51bGw7XG5cdCAgICAgIHNlbGYuc2V0R2Vub21lWU9yZGVyKHNlbGYuZ2V0R2Vub21lWU9yZGVyKCkpO1xuXHQgICAgICBzZWxmLmFwcC5zZXRDb250ZXh0KHsgZ2Vub21lczogc2VsZi5nZXRHZW5vbWVZT3JkZXIoKSB9KTtcblx0ICAgICAgd2luZG93LnNldFRpbWVvdXQoIHNlbGYuZHJhd0ZpZHVjaWFscy5iaW5kKHNlbGYpLCA1MCApO1xuXHQgIH0pXG5cdCAgO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQnJ1c2hlcyAoKSB7XG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ2cuYnJ1c2gnKVxuXHQgICAgLmVhY2goIGZ1bmN0aW9uIChiKSB7XG5cdCAgICAgICAgYi5icnVzaC5jbGVhcigpO1xuXHRcdGQzLnNlbGVjdCh0aGlzKS5jYWxsKGIuYnJ1c2gpO1xuXHQgICAgfSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgY3VycmVudCBicnVzaCBjb29yZGluYXRlcywgdHJhbnNsYXRlZCAoaWYgbmVlZGVkKSB0byByZWYgZ2Vub21lIGNvb3JkaW5hdGVzLlxuICAgIGJiR2V0UmVmQ29vcmRzICgpIHtcbiAgICAgIGxldCByZyA9IHRoaXMuYXBwLnJHZW5vbWU7XG4gICAgICBsZXQgYmxrID0gdGhpcy5icnVzaGluZztcbiAgICAgIGxldCBleHQgPSBibGsuYnJ1c2guZXh0ZW50KCk7XG4gICAgICBsZXQgciA9IHsgY2hyOiBibGsuY2hyLCBzdGFydDogZXh0WzBdLCBlbmQ6IGV4dFsxXSwgYmxvY2tJZDpibGsuYmxvY2tJZCB9O1xuICAgICAgbGV0IHRyID0gdGhpcy5hcHAudHJhbnNsYXRvcjtcbiAgICAgIGlmKCBibGsuZ2Vub21lICE9PSByZyApIHtcbiAgICAgICAgIC8vIHVzZXIgaXMgYnJ1c2hpbmcgYSBjb21wIGdlbm9tZXMgc28gZmlyc3QgdHJhbnNsYXRlXG5cdCAvLyBjb29yZGluYXRlcyB0byByZWYgZ2Vub21lXG5cdCBsZXQgcnMgPSB0aGlzLmFwcC50cmFuc2xhdG9yLnRyYW5zbGF0ZShibGsuZ2Vub21lLCByLmNociwgci5zdGFydCwgci5lbmQsIHJnKTtcblx0IGlmIChycy5sZW5ndGggPT09IDApIHJldHVybjtcblx0IHIgPSByc1swXTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAgIHIuYmxvY2tJZCA9IHJnLm5hbWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gcjtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gaGFuZGxlciBmb3IgdGhlIHN0YXJ0IG9mIGEgYnJ1c2ggYWN0aW9uIGJ5IHRoZSB1c2VyIG9uIGEgYmxvY2tcbiAgICBiYlN0YXJ0IChibGssYkVsdCkge1xuICAgICAgdGhpcy5icnVzaGluZyA9IGJsaztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYmJCcnVzaCAoKSB7XG4gICAgICAgIGxldCBldiA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50O1xuXHRsZXQgeHQgPSB0aGlzLmJydXNoaW5nLmJydXNoLmV4dGVudCgpO1xuXHRsZXQgcyA9IE1hdGgucm91bmQoeHRbMF0pO1xuXHRsZXQgZSA9IE1hdGgucm91bmQoeHRbMV0pO1xuXHR0aGlzLnNob3dGbG9hdGluZ1RleHQoYCR7dGhpcy5icnVzaGluZy5jaHJ9OiR7c30uLiR7ZX1gLCBldi5jbGllbnRYLCBldi5jbGllbnRZKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYmJFbmQgKCkge1xuICAgICAgbGV0IHNlID0gZDMuZXZlbnQuc291cmNlRXZlbnQ7XG4gICAgICBsZXQgeHQgPSB0aGlzLmJydXNoaW5nLmJydXNoLmV4dGVudCgpO1xuICAgICAgbGV0IGcgPSB0aGlzLmJydXNoaW5nLmdlbm9tZS5sYWJlbDtcbiAgICAgIC8vXG4gICAgICB0aGlzLmhpZGVGbG9hdGluZ1RleHQoKTtcbiAgICAgIC8vXG4gICAgICBpZiAoc2UuY3RybEtleSB8fCBzZS5hbHRLZXkgfHwgc2UubWV0YUtleSkge1xuXHQgIHRoaXMuY2xlYXJCcnVzaGVzKCk7XG5cdCAgdGhpcy5icnVzaGluZyA9IG51bGw7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy9cbiAgICAgIGlmIChNYXRoLmFicyh4dFswXSAtIHh0WzFdKSA8PSAxMCkge1xuXHQgIC8vIFVzZXIgY2xpY2tlZC4gUmVjZW50ZXIgdmlldy5cblx0ICBsZXQgeG1pZCA9ICh4dFswXSArIHh0WzFdKS8yO1xuXHQgIGxldCB3ID0gdGhpcy5hcHAuY29vcmRzLmVuZCAtIHRoaXMuYXBwLmNvb3Jkcy5zdGFydCArIDE7XG5cdCAgbGV0IHMgPSBNYXRoLnJvdW5kKHhtaWQgLSB3LzIpO1xuXHQgIHRoaXMuYXBwLnNldENvbnRleHQoeyByZWY6ZywgY2hyOiB0aGlzLmJydXNoaW5nLmNociwgc3RhcnQ6IHMsIGVuZDogcyArIHcgLSAxIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG5cdCAgLy8gVXNlciBkcmFnZ2VkLiBab29tIGluIG9yIG91dC5cblx0ICB0aGlzLmFwcC5zZXRDb250ZXh0KHsgcmVmOmcsIGNocjogdGhpcy5icnVzaGluZy5jaHIsIHN0YXJ0Onh0WzBdLCBlbmQ6eHRbMV0gfSk7XG4gICAgICB9XG4gICAgICB0aGlzLmNsZWFyQnJ1c2hlcygpO1xuICAgICAgdGhpcy5icnVzaGluZyA9IG51bGw7XG4gICAgICB0aGlzLmRlYWxXaXRoVW53YW50ZWRDbGlja0V2ZW50ID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaGlnaGxpZ2h0U3RyaXAgKGcsIGVsdCkge1xuXHRpZiAoZyA9PT0gdGhpcy5jdXJyZW50SExHKSByZXR1cm47XG5cdHRoaXMuY3VycmVudEhMRyA9IGc7XG5cdC8vXG5cdHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoJy56b29tU3RyaXAnKVxuXHQgICAgLmNsYXNzZWQoJ2hpZ2hsaWdodGVkJywgZCA9PiBkLmdlbm9tZSA9PT0gZyk7XG5cdHRoaXMuYXBwLnNob3dCbG9ja3MoZyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyB0aGUgWm9vbVZpZXcgdG8gc2hvdyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSByZWcgZ2Vub21lIGFuZCB0aGUgY29ycmVzcG9uZGluZ1xuICAgIC8vIHJhbmdlKHMpIGluIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy9cbiAgICB1cGRhdGVWaWFNYXBwZWRDb29yZGluYXRlcyAoY29vcmRzKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0bGV0IGMgPSAoY29vcmRzIHx8IHRoaXMuYXBwLmNvb3Jkcyk7XG5cdGQzLnNlbGVjdCgnI3pvb21Db29yZHMnKVswXVswXS52YWx1ZSA9IGZvcm1hdENvb3JkcyhjLmNociwgYy5zdGFydCwgYy5lbmQpO1xuXHRkMy5zZWxlY3QoJyN6b29tV1NpemUnKVswXVswXS52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSlcblx0Ly9cbiAgICAgICAgbGV0IG1ndiA9IHRoaXMuYXBwO1xuXHQvLyBJc3N1ZSByZXF1ZXN0cyBmb3IgZmVhdHVyZXMuIE9uZSByZXF1ZXN0IHBlciBnZW5vbWUsIGVhY2ggcmVxdWVzdCBzcGVjaWZpZXMgb25lIG9yIG1vcmVcblx0Ly8gY29vcmRpbmF0ZSByYW5nZXMuXG5cdC8vIFdhaXQgZm9yIGFsbCB0aGUgZGF0YSB0byBiZWNvbWUgYXZhaWxhYmxlLCB0aGVuIGRyYXcuXG5cdC8vXG5cdGxldCBwcm9taXNlcyA9IFtdO1xuXG5cdC8vIEZpcnN0IHJlcXVlc3QgaXMgZm9yIHRoZSB0aGUgcmVmZXJlbmNlIGdlbm9tZS4gR2V0IGFsbCB0aGUgZmVhdHVyZXMgaW4gdGhlIHJhbmdlLlxuXHRwcm9taXNlcy5wdXNoKG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlcyhtZ3Yuckdlbm9tZSwgW3tcblx0ICAgIC8vIE5lZWQgdG8gc2ltdWxhdGUgdGhlIHJlc3VsdHMgZnJvbSBjYWxsaW5nIHRoZSB0cmFuc2xhdG9yLiBcblx0ICAgIC8vIFxuXHQgICAgY2hyICAgIDogYy5jaHIsXG5cdCAgICBzdGFydCAgOiBjLnN0YXJ0LFxuXHQgICAgZW5kICAgIDogYy5lbmQsXG5cdCAgICBpbmRleCAgOiAwLFxuXHQgICAgZkNociAgIDogYy5jaHIsXG5cdCAgICBmU3RhcnQgOiBjLnN0YXJ0LFxuXHQgICAgZkVuZCAgIDogYy5lbmQsXG5cdCAgICBmSW5kZXggIDogMCxcblx0ICAgIG9yaSAgICA6ICcrJyxcblx0ICAgIGJsb2NrSWQ6IG1ndi5yR2Vub21lLm5hbWVcblx0ICAgIH1dKSk7XG5cdGlmICghIHNlbGYucm9vdC5jbGFzc2VkKCdjbG9zZWQnKSkge1xuXHQgICAgLy8gQWRkIGEgcmVxdWVzdCBmb3IgZWFjaCBjb21wYXJpc29uIGdlbm9tZSwgdXNpbmcgdHJhbnNsYXRlZCBjb29yZGluYXRlcy4gXG5cdCAgICBtZ3YuY0dlbm9tZXMuZm9yRWFjaChjR2Vub21lID0+IHtcblx0XHRsZXQgcmFuZ2VzID0gbWd2LnRyYW5zbGF0b3IudHJhbnNsYXRlKCBtZ3Yuckdlbm9tZSwgYy5jaHIsIGMuc3RhcnQsIGMuZW5kLCBjR2Vub21lICk7XG5cdFx0bGV0IHAgPSBtZ3YuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXMoY0dlbm9tZSwgcmFuZ2VzKTtcblx0XHRwcm9taXNlcy5wdXNoKHApO1xuXHQgICAgfSk7XG5cdH1cblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgIH1cbiAgICAvLyBVcGRhdGVzIHRoZSBab29tVmlldyB0byBzaG93IHRoZSByZWdpb24gYXJvdW5kIGEgbGFuZG1hcmsgaW4gZWFjaCBnZW5vbWUuXG4gICAgLy9cbiAgICAvLyBjb29yZHMgPSB7XG4gICAgLy8gICAgIGxhbmRtYXJrIDogaWQgb2YgYSBmZWF0dXJlIHRvIHVzZSBhcyBhIHJlZmVyZW5jZVxuICAgIC8vICAgICBmbGFua3x3aWR0aCA6IHNwZWNpZnkgb25lIG9mIGZsYW5rIG9yIHdpZHRoLiBcbiAgICAvLyAgICAgICAgIGZsYW5rID0gYW1vdW50IG9mIGZsYW5raW5nIHJlZ2lvbiAoYnApIHRvIGluY2x1ZGUgYXQgYm90aCBlbmRzIG9mIHRoZSBsYW5kbWFyaywgXG4gICAgLy8gICAgICAgICBzbyB0aGUgdG90YWwgdmlld2luZyByZWdpb24gPSBmbGFuayArIGxlbmd0aChsYW5kbWFyaykgKyBmbGFuay5cbiAgICAvLyAgICAgICAgIHdpZHRoID0gdG90YWwgdmlld2luZyByZWdpb24gd2lkdGguIElmIGJvdGggd2lkdGggYW5kIGZsYW5rIGFyZSBzcGVjaWZpZWQsIGZsYW5rIGlzIGlnbm9yZWQuXG4gICAgLy8gICAgIGRlbHRhIDogYW1vdW50IHRvIHNoaWZ0IHRoZSB2aWV3IGxlZnQvcmlnaHRcbiAgICAvLyB9XG4gICAgLy8gXG4gICAgLy8gVGhlIGxhbmRtYXJrIG11c3QgZXhpc3QgaW4gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZS4gXG4gICAgLy9cbiAgICB1cGRhdGVWaWFMYW5kbWFya0Nvb3JkaW5hdGVzIChjb29yZHMpIHtcblx0bGV0IGMgPSBjb29yZHM7XG5cdGxldCBtZ3YgPSB0aGlzLmFwcDtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgcmYgPSBjb29yZHMubGFuZG1hcmtSZWZGZWF0O1xuXHRsZXQgZmVhdHMgPSBjb29yZHMubGFuZG1hcmtGZWF0cztcblx0aWYgKHRoaXMucm9vdC5jbGFzc2VkKCdjbG9zZWQnKSlcblx0ICAgIGZlYXRzID0gZmVhdHMuZmlsdGVyKGYgPT4gZi5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpO1xuXHRsZXQgZGVsdGEgPSBjb29yZHMuZGVsdGEgfHwgMDtcblx0Ly8gY29tcHV0ZSByYW5nZXMgYXJvdW5kIGxhbmRtYXJrIGluIGVhY2ggZ2Vub21lXG5cdGxldCByYW5nZXMgPSBmZWF0cy5tYXAoZiA9PiB7XG5cdCAgICBsZXQgZmxhbmsgPSBjLmxlbmd0aCA/IChjLmxlbmd0aCAtIGYubGVuZ3RoKSAvIDIgOiBjLmZsYW5rO1xuXHQgICAgbGV0IGNsZW5ndGggPSBmLmdlbm9tZS5nZXRDaHJvbW9zb21lKGYuY2hyKS5sZW5ndGg7XG5cdCAgICBsZXQgdyAgICAgPSBjLmxlbmd0aCA/IGMubGVuZ3RoIDogKGYubGVuZ3RoICsgMipmbGFuayk7XG5cdCAgICBsZXQgc3RhcnQgPSBjbGlwKE1hdGgucm91bmQoZGVsdGEgKyBmLnN0YXJ0IC0gZmxhbmspLCAxLCBjbGVuZ3RoKTtcblx0ICAgIGxldCBlbmQgICA9IGNsaXAoTWF0aC5yb3VuZChzdGFydCArIHcpLCBzdGFydCwgY2xlbmd0aClcblx0ICAgIGxldCByYW5nZSA9IHtcblx0XHRnZW5vbWU6XHRmLmdlbm9tZSxcblx0XHRjaHI6XHRmLmNocixcblx0XHRjaHJvbW9zb21lOiBmLmdlbm9tZS5nZXRDaHJvbW9zb21lKGYuY2hyKSxcblx0XHRzdGFydDpcdHN0YXJ0LFxuXHRcdGVuZDpcdGVuZFxuXHQgICAgfSA7XG5cdCAgICBpZiAoZi5nZW5vbWUgPT09IG1ndi5yR2Vub21lKSB7XG5cdFx0bGV0IGMgPSB0aGlzLmFwcC5jb29yZHMgPSByYW5nZTtcblx0XHRkMy5zZWxlY3QoJyN6b29tQ29vcmRzJylbMF1bMF0udmFsdWUgPSBmb3JtYXRDb29yZHMoYy5jaHIsIGMuc3RhcnQsIGMuZW5kKTtcblx0XHRkMy5zZWxlY3QoJyN6b29tV1NpemUnKVswXVswXS52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSlcblx0ICAgIH1cblx0ICAgIHJldHVybiByYW5nZTtcblx0fSk7XG5cdGxldCBzZWVuR2Vub21lcyA9IG5ldyBTZXQoKTtcblx0bGV0IHJDb29yZHM7XG5cdC8vIEdldCAocHJvbWlzZXMgZm9yKSB0aGUgZmVhdHVyZXMgaW4gZWFjaCByYW5nZS5cblx0bGV0IHByb21pc2VzID0gcmFuZ2VzLm1hcChyID0+IHtcbiAgICAgICAgICAgIGxldCBycnM7XG5cdCAgICBzZWVuR2Vub21lcy5hZGQoci5nZW5vbWUpO1xuXHQgICAgaWYgKHIuZ2Vub21lID09PSBtZ3Yuckdlbm9tZSl7XG5cdFx0Ly8gdGhlIHJlZiBnZW5vbWUgcmFuZ2Vcblx0XHRyQ29vcmRzID0gcjtcblx0ICAgICAgICBycnMgPSBbe1xuXHRcdCAgICBjaHIgICAgOiByLmNocixcblx0XHQgICAgc3RhcnQgIDogci5zdGFydCxcblx0XHQgICAgZW5kICAgIDogci5lbmQsXG5cdFx0ICAgIGluZGV4ICA6IDAsXG5cdFx0ICAgIGZDaHIgICA6IHIuY2hyLFxuXHRcdCAgICBmU3RhcnQgOiByLnN0YXJ0LFxuXHRcdCAgICBmRW5kICAgOiByLmVuZCxcblx0XHQgICAgZkluZGV4ICA6IDAsXG5cdFx0ICAgIG9yaSAgICA6ICcrJyxcblx0XHQgICAgYmxvY2tJZDogbWd2LnJHZW5vbWUubmFtZVxuXHRcdH1dO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7IFxuXHRcdC8vIHR1cm4gdGhlIHNpbmdsZSByYW5nZSBpbnRvIGEgcmFuZ2UgZm9yIGVhY2ggb3ZlcmxhcHBpbmcgc3ludGVueSBibG9jayB3aXRoIHRoZSByZWYgZ2Vub21lXG5cdCAgICAgICAgcnJzID0gbWd2LnRyYW5zbGF0b3IudHJhbnNsYXRlKHIuZ2Vub21lLCByLmNociwgci5zdGFydCwgci5lbmQsIG1ndi5yR2Vub21lLCB0cnVlKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBtZ3YuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXMoci5nZW5vbWUsIHJycyk7XG5cdH0pO1xuXHQvLyBGb3IgZWFjaCBnZW5vbWUgd2hlcmUgdGhlIGxhbmRtYXJrIGRvZXMgbm90IGV4aXN0LCBjb21wdXRlIGEgbWFwcGVkIHJhbmdlIChhcyBpbiBtYXBwZWQgY21vZGUpLlxuXHRpZiAoIXRoaXMucm9vdC5jbGFzc2VkKCdjbG9zZWQnKSlcblx0ICAgIG1ndi5jR2Vub21lcy5mb3JFYWNoKGcgPT4ge1xuXHRcdGlmICghIHNlZW5HZW5vbWVzLmhhcyhnKSkge1xuXHRcdCAgICBsZXQgcnJzID0gbWd2LnRyYW5zbGF0b3IudHJhbnNsYXRlKG1ndi5yR2Vub21lLCByQ29vcmRzLmNociwgckNvb3Jkcy5zdGFydCwgckNvb3Jkcy5lbmQsIGcpO1xuXHRcdCAgICBwcm9taXNlcy5wdXNoKCBtZ3YuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXMoZywgcnJzKSApO1xuXHRcdH1cblx0ICAgIH0pO1xuXHQvLyBXaGVuIGFsbCB0aGUgZGF0YSBpcyByZWFkeSwgZHJhdy5cblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG4gICAgLy9cbiAgICB1cGRhdGUgKGNmZykge1xuXHR0aGlzLmNmZyA9IGNmZyB8fCB0aGlzLmNmZztcblx0dGhpcy5oaWdobGlnaHRlZCA9IHRoaXMuY2ZnLmhpZ2hsaWdodDtcblx0dGhpcy5nZW5vbWVzID0gdGhpcy5jZmcuZ2Vub21lcztcblx0dGhpcy5kbW9kZSA9IHRoaXMuY2ZnLmRtb2RlO1xuXHR0aGlzLmNtb2RlID0gdGhpcy5jZmcuY21vZGU7XG5cdHRoaXMuYXBwLnRyYW5zbGF0b3IucmVhZHkoKS50aGVuKCgpID0+IHtcblx0ICAgIGxldCBwO1xuXHQgICAgaWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKVxuXHRcdHAgPSB0aGlzLnVwZGF0ZVZpYU1hcHBlZENvb3JkaW5hdGVzKHRoaXMuYXBwLmNvb3Jkcyk7XG5cdCAgICBlbHNlXG5cdFx0cCA9IHRoaXMudXBkYXRlVmlhTGFuZG1hcmtDb29yZGluYXRlcyh0aGlzLmFwcC5sY29vcmRzKTtcblx0ICAgIHAudGhlbiggZGF0YSA9PiB7XG5cdFx0dGhpcy5kcmF3KHRoaXMubXVuZ2VEYXRhKGRhdGEpKTtcblx0ICAgIH0pO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIG1lcmdlU2Jsb2NrUnVucyAoZGF0YSkge1xuXHQvLyAtLS0tLVxuXHQvLyBSZWR1Y2VyIGZ1bmN0aW9uLiBXaWxsIGJlIGNhbGxlZCB3aXRoIHRoZXNlIGFyZ3M6XG5cdC8vICAgbmJsY2tzIChsaXN0KSBOZXcgYmxvY2tzLiAoY3VycmVudCBhY2N1bXVsYXRvciB2YWx1ZSlcblx0Ly8gICBcdEEgbGlzdCBvZiBsaXN0cyBvZiBzeW50ZW55IGJsb2Nrcy5cblx0Ly8gICBibGsgKHN5bnRlbnkgYmxvY2spIHRoZSBjdXJyZW50IHN5bnRlbnkgYmxvY2tcblx0Ly8gICBpIChpbnQpIFRoZSBpdGVyYXRpb24gY291bnQuXG5cdC8vIFJldHVybnM6XG5cdC8vICAgbGlzdCBvZiBsaXN0cyBvZiBibG9ja3Ncblx0bGV0IG1lcmdlciA9IChuYmxrcywgYiwgaSkgPT4ge1xuXHQgICAgbGV0IGluaXRCbGsgPSBmdW5jdGlvbiAoYmIpIHtcblx0XHRsZXQgbmIgPSBPYmplY3QuYXNzaWduKHt9LCBiYik7XG5cdFx0bmIuc3VwZXJCbG9jayA9IHRydWU7XG5cdFx0bmIuZmVhdHVyZXMgPSBiYi5mZWF0dXJlcy5jb25jYXQoKTtcblx0XHRuYi5zYmxvY2tzID0gW2JiXTtcblx0XHRuYi5vcmkgPSAnKydcblx0XHRyZXR1cm4gbmI7XG5cdCAgICB9O1xuXHQgICAgaWYgKGkgPT09IDApe1xuXHRcdG5ibGtzLnB1c2goaW5pdEJsayhiKSk7XG5cdFx0cmV0dXJuIG5ibGtzO1xuXHQgICAgfVxuXHQgICAgbGV0IGxhc3RCbGsgPSBuYmxrc1tuYmxrcy5sZW5ndGggLSAxXTtcblx0ICAgIGlmIChiLmNociAhPT0gbGFzdEJsay5jaHIgfHwgYi5pbmRleCAtIGxhc3RCbGsuaW5kZXggIT09IDEpIHtcblx0ICAgICAgICBuYmxrcy5wdXNoKGluaXRCbGsoYikpO1xuXHRcdHJldHVybiBuYmxrcztcblx0ICAgIH1cblx0ICAgIC8vIG1lcmdlXG5cdCAgICBsYXN0QmxrLmluZGV4ID0gYi5pbmRleDtcblx0ICAgIGxhc3RCbGsuZW5kID0gYi5lbmQ7XG5cdCAgICBsYXN0QmxrLmJsb2NrRW5kID0gYi5ibG9ja0VuZDtcblx0ICAgIGxhc3RCbGsuZmVhdHVyZXMgPSBsYXN0QmxrLmZlYXR1cmVzLmNvbmNhdChiLmZlYXR1cmVzKTtcblx0ICAgIGxldCBsYXN0U2IgPSBsYXN0QmxrLnNibG9ja3NbbGFzdEJsay5zYmxvY2tzLmxlbmd0aCAtIDFdO1xuXHQgICAgbGV0IGQgPSBiLnN0YXJ0IC0gbGFzdFNiLmVuZDtcblx0ICAgIGxhc3RTYi5lbmQgKz0gZC8yO1xuXHQgICAgYi5zdGFydCAtPSBkLzI7XG5cdCAgICBsYXN0QmxrLnNibG9ja3MucHVzaChiKTtcblx0ICAgIHJldHVybiBuYmxrcztcblx0fTtcblx0Ly8gLS0tLS1cbiAgICAgICAgZGF0YS5mb3JFYWNoKChnZGF0YSxpKSA9PiB7XG5cdCAgICBpZiAodGhpcy5kbW9kZSA9PT0gJ2NvbXBhcmlzb24nKSB7XG5cdFx0Z2RhdGEuYmxvY2tzLnNvcnQoIChhLGIpID0+IGEuaW5kZXggLSBiLmluZGV4ICk7XG5cdFx0Z2RhdGEuYmxvY2tzID0gZ2RhdGEuYmxvY2tzLnJlZHVjZShtZXJnZXIsW10pO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0Ly8gZmlyc3Qgc29ydCBieSByZWYgZ2Vub21lIG9yZGVyXG5cdFx0Z2RhdGEuYmxvY2tzLnNvcnQoIChhLGIpID0+IGEuZkluZGV4IC0gYi5mSW5kZXggKTtcblx0XHQvLyBTdWItZ3JvdXAgaW50byBydW5zIG9mIHNhbWUgY29tcCBnZW5vbWUgY2hyb21vc29tZS5cblx0XHRsZXQgdG1wID0gZ2RhdGEuYmxvY2tzLnJlZHVjZSgobmJzLCBiLCBpKSA9PiB7XG5cdFx0ICAgIGlmIChpID09PSAwIHx8IG5ic1tuYnMubGVuZ3RoIC0gMV1bMF0uY2hyICE9PSBiLmNocilcblx0XHRcdG5icy5wdXNoKFtiXSk7XG5cdFx0ICAgIGVsc2Vcblx0XHRcdG5ic1tuYnMubGVuZ3RoIC0gMV0ucHVzaChiKTtcblx0XHQgICAgcmV0dXJuIG5icztcblx0XHR9LCBbXSk7XG5cdFx0Ly8gU29ydCBlYWNoIHN1Ymdyb3VwIGludG8gY29tcGFyaXNvbiBnZW5vbWUgb3JkZXJcblx0XHR0bXAuZm9yRWFjaCggc3ViZ3JwID0+IHN1YmdycC5zb3J0KChhLGIpID0+IGEuaW5kZXggLSBiLmluZGV4KSApO1xuXHRcdC8vIEZsYXR0ZW4gdGhlIGxpc3Rcblx0XHR0bXAgPSB0bXAucmVkdWNlKChsc3QsIGN1cnIpID0+IGxzdC5jb25jYXQoY3VyciksIFtdKTtcblx0XHQvLyBOb3cgY3JlYXRlIHRoZSBzdXBlcmdyb3Vwcy5cblx0XHRnZGF0YS5ibG9ja3MgPSB0bXAucmVkdWNlKG1lcmdlcixbXSk7XG5cdCAgICB9XG5cdH0pO1xuXHRyZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIHVuaXFpZnlCbG9ja3MgKGJsb2Nrcykge1xuXHQvLyBoZWxwZXIgZnVuY3Rpb24uIFdoZW4gc2Jsb2NrIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIGdlbm9tZXMgaXMgY29uZnVzZWQsIHJlcXVlc3Rpbmcgb25lXG5cdC8vIHJlZ2lvbiBpbiBnZW5vbWUgQSBjYW4gZW5kIHVwIHJlcXVlc3RpbmcgdGhlIHNhbWUgcmVnaW9uIGluIGdlbm9tZSBCIG11bHRpcGxlIHRpbWVzLlxuXHQvLyBUaGlzIGZ1bmN0aW9uIGF2b2lkcyBkcmF3aW5nIHRoZSBzYW1lIHNibG9jayB0d2ljZS4gKE5COiBSZWFsbHkgbm90IHN1cmUgd2hlcmUgdGhpcyBcblx0Ly8gY2hlY2sgaXMgYmVzdCBkb25lLiBDb3VsZCBwdXNoIGl0IGZhcnRoZXIgdXBzdHJlYW0uKVxuXHRsZXQgc2VlbiA9IG5ldyBTZXQoKTtcblx0cmV0dXJuIGJsb2Nrcy5maWx0ZXIoIGIgPT4geyBcblx0ICAgIGlmIChzZWVuLmhhcyhiLmluZGV4KSkgcmV0dXJuIGZhbHNlO1xuXHQgICAgc2Vlbi5hZGQoYi5pbmRleCk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fSk7XG4gICAgfTtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBcHBsaWVzIHNldmVyYWwgdHJhbnNmb3JtYXRpb24gc3RlcHMgb24gdGhlIGRhdGEgYXMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlciB0byBwcmVwYXJlIGZvciBkcmF3aW5nLlxuICAgIC8vIElucHV0IGRhdGEgaXMgc3RydWN0dXJlZCBhcyBmb2xsb3dzOlxuICAgIC8vICAgICBkYXRhID0gWyB6b29tU3RyaXBfZGF0YSBdXG4gICAgLy8gICAgIHpvb21TdHJpcF9kYXRhID0geyBnZW5vbWUgWyB6b29tQmxvY2tfZGF0YSBdIH1cbiAgICAvLyAgICAgem9vbUJsb2NrX2RhdGEgPSB7IHhzY2FsZSwgY2hyLCBzdGFydCwgZW5kLCBpbmRleCwgZkNociwgZlN0YXJ0LCBmRW5kLCBmSW5kZXgsIG9yaSwgWyBmZWF0dXJlX2RhdGEgXSB9XG4gICAgLy8gICAgIGZlYXR1cmVfZGF0YSA9IHsgSUQsIGNhbm9uaWNhbCwgc3ltYm9sLCBjaHIsIHN0YXJ0LCBlbmQsIHN0cmFuZCwgdHlwZSwgYmlvdHlwZSB9XG4gICAgLy9cbiAgICAvLyBBZ2FpbiwgaW4gRW5nbGlzaDpcbiAgICAvLyAgLSBkYXRhIGlzIGEgbGlzdCBvZiBpdGVtcywgb25lIHBlciBzdHJpcCB0byBiZSBkaXNwbGF5ZWQuIEl0ZW1bMF0gaXMgZGF0YSBmb3IgdGhlIHJlZiBnZW5vbWUuXG4gICAgLy8gICAgSXRlbXNbMStdIGFyZSBkYXRhIGZvciB0aGUgY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy8gIC0gZWFjaCBzdHJpcCBpdGVtIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGEgZ2Vub21lIGFuZCBhIGxpc3Qgb2YgYmxvY2tzLiBJdGVtWzBdIGFsd2F5cyBoYXMgXG4gICAgLy8gICAgYSBzaW5nbGUgYmxvY2suXG4gICAgLy8gIC0gZWFjaCBibG9jayBpcyBhbiBvYmplY3QgY29udGFpbmluZyBhIGNocm9tb3NvbWUsIHN0YXJ0LCBlbmQsIG9yaWVudGF0aW9uLCBldGMsIGFuZCBhIGxpc3Qgb2YgZmVhdHVyZXMuXG4gICAgLy8gIC0gZWFjaCBmZWF0dXJlIGhhcyBjaHIsc3RhcnQsZW5kLHN0cmFuZCx0eXBlLGJpb3R5cGUsSURcbiAgICAvL1xuICAgIC8vIEJlY2F1c2UgU0Jsb2NrcyBjYW4gYmUgdmVyeSBmcmFnbWVudGVkLCBvbmUgY29udGlndW91cyByZWdpb24gaW4gdGhlIHJlZiBnZW5vbWUgY2FuIHR1cm4gaW50byBcbiAgICAvLyBhIGJhemlsbGlvbiB0aW55IGJsb2NrcyBpbiB0aGUgY29tcGFyaXNvbi4gVGhlIHJlc3VsdGluZyByZW5kZXJpbmcgaXMgamFycmluZyBhbmQgdW51c2FibGUuXG4gICAgLy8gVGhlIGRyYXdpbmcgcm91dGluZSBtb2RpZmllcyB0aGUgZGF0YSBieSBtZXJnaW5nIHJ1bnMgb2YgY29uc2VjdXRpdmUgYmxvY2tzIGluIGVhY2ggY29tcCBnZW5vbWUuXG4gICAgLy8gVGhlIGRhdGEgY2hhbmdlIGlzIHRvIGluc2VydCBhIGdyb3VwaW5nIGxheWVyIG9uIHRvcCBvZiB0aGUgc2Jsb2Nrcywgc3BlY2lmaWNhbGx5LCBcbiAgICAvLyAgICAgem9vbVN0cmlwX2RhdGEgPSB7IGdlbm9tZSBbIHpvb21CbG9ja19kYXRhIF0gfVxuICAgIC8vIGJlY29tZXNcbiAgICAvLyAgICAgem9vbVN0cmlwX2RhdGEgPSB7IGdlbm9tZSBbIHpvb21TdXBlckJsb2NrX2RhdGEgXSB9XG4gICAgLy8gICAgIHpvb21TdXBlckJsb2NrX2RhdGEgPSB7IGNociBzdGFydCBlbmQgYmxvY2tzIFsgem9vbUJsb2NrX2RhdGEgXSB9XG4gICAgLy9cbiAgICBtdW5nZURhdGEgKGRhdGEpIHtcbiAgICAgICAgZGF0YS5mb3JFYWNoKGdEYXRhID0+IHtcblx0ICAgIGdEYXRhLmJsb2NrcyA9IHRoaXMudW5pcWlmeUJsb2NrcyhnRGF0YS5ibG9ja3MpXG5cdCAgICAvLyBFYWNoIHN0cmlwIGlzIGluZGVwZW5kZW50bHkgc2Nyb2xsYWJsZS4gSW5pdCBpdHMgb2Zmc2V0IChpbiBieXRlcykuXG5cdCAgICBnRGF0YS5kZWx0YUIgPSAwO1xuXHQgICAgLy8gRWFjaCBzdHJpcCBpcyBpbmRlcGVuZGVudGx5IHNjYWxhYmxlLiBJbml0IHNjYWxlLlxuXHQgICAgZ0RhdGEueFNjYWxlID0gMS4wO1xuXHR9KTtcblx0ZGF0YSA9IHRoaXMubWVyZ2VTYmxvY2tSdW5zKGRhdGEpO1xuXHQvLyBcblx0ZGF0YS5mb3JFYWNoKCBnRGF0YSA9PiB7XG5cdCAgLy8gbWluaW11bSBvZiAzIGxhbmVzIG9uIGVhY2ggc2lkZVxuXHQgIGdEYXRhLm1heExhbmVzUCA9IDM7XG5cdCAgZ0RhdGEubWF4TGFuZXNOID0gMztcblx0ICBnRGF0YS5ibG9ja3MuZm9yRWFjaCggc2I9PiB7XG5cdCAgICBzYi5mZWF0dXJlcy5mb3JFYWNoKGYgPT4ge1xuXHRcdGlmIChmLmxhbmUgPiAwKVxuXHRcdCAgICBnRGF0YS5tYXhMYW5lc1AgPSBNYXRoLm1heChnRGF0YS5tYXhMYW5lc1AsIGYubGFuZSlcblx0XHRlbHNlXG5cdFx0ICAgIGdEYXRhLm1heExhbmVzTiA9IE1hdGgubWF4KGdEYXRhLm1heExhbmVzTiwgLWYubGFuZSlcblx0ICAgIH0pO1xuXHQgIH0pO1xuXHQgIGlmIChnRGF0YS5ibG9ja3MubGVuZ3RoID4gMSlcblx0ICAgICAgZ0RhdGEuYmxvY2tzID0gZ0RhdGEuYmxvY2tzLmZpbHRlcihiPT5iLmZlYXR1cmVzLmxlbmd0aCA+IDApO1xuXHQgIGdEYXRhLnN0cmlwSGVpZ2h0ID0gMTUgKyB0aGlzLmxhbmVIZWlnaHQgKiAoZ0RhdGEubWF4TGFuZXNQICsgZ0RhdGEubWF4TGFuZXNOKTtcblx0ICBnRGF0YS56ZXJvT2Zmc2V0ID0gdGhpcy5sYW5lSGVpZ2h0ICogZ0RhdGEubWF4TGFuZXNQO1xuXHR9KTtcblx0cmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gT3JkZXJzIHNibG9ja3MgaG9yaXpvbnRhbGx5IHdpdGhpbiBlYWNoIGdlbm9tZS4gVHJhbnNsYXRlcyB0aGVtIGludG8gcG9zaXRpb24uXG4gICAgLy9cbiAgICBsYXlvdXRTQmxvY2tzIChzYmxvY2tzKSB7XG5cdC8vIFNvcnQgdGhlIHNibG9ja3MgaW4gZWFjaCBzdHJpcCBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgZHJhd2luZyBtb2RlLlxuXHRsZXQgY21wRmllbGQgPSB0aGlzLmRtb2RlID09PSAnY29tcGFyaXNvbicgPyAnaW5kZXgnIDogJ2ZJbmRleCc7XG5cdGxldCBjbXBGdW5jID0gKGEsYikgPT4gYS5fX2RhdGFfX1tjbXBGaWVsZF0tYi5fX2RhdGFfX1tjbXBGaWVsZF07XG5cdHNibG9ja3MuZm9yRWFjaCggc3RyaXAgPT4gc3RyaXAuc29ydCggY21wRnVuYyApICk7XG5cdGxldCBwc3RhcnQgPSBbXTsgLy8gb2Zmc2V0IChpbiBwaXhlbHMpIG9mIHN0YXJ0IHBvc2l0aW9uIG9mIG5leHQgYmxvY2ssIGJ5IHN0cmlwIGluZGV4ICgwPT09cmVmKVxuXHRsZXQgYnN0YXJ0ID0gW107IC8vIGJsb2NrIHN0YXJ0IHBvcyAoaW4gYnApIGFzc29jIHdpdGggcHN0YXJ0XG5cdGxldCBjY2hyID0gbnVsbDtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgR0FQICA9IDE2OyAgIC8vIGxlbmd0aCBvZiBnYXAgYmV0d2VlbiBibG9ja3Mgb2YgZGlmZiBjaHJvbXMuXG5cdGxldCBkeDtcblx0bGV0IHBlbmQ7XG5cdHNibG9ja3MuZWFjaCggZnVuY3Rpb24gKGIsaSxqKSB7IC8vIGI9YmxvY2ssIGk9aW5kZXggd2l0aGluIHN0cmlwLCBqPXN0cmlwIGluZGV4XG5cdCAgICBsZXQgZ2QgPSB0aGlzLl9fZGF0YV9fLmdlbm9tZTtcblx0ICAgIGxldCBibGVuID0gc2VsZi5wcGIgKiAoYi5lbmQgLSBiLnN0YXJ0ICsgMSk7IC8vIHRvdGFsIHNjcmVlbiB3aWR0aCBvZiB0aGlzIHNibG9ja1xuXHQgICAgYi5mbGlwID0gYi5vcmkgPT09ICctJyAmJiBzZWxmLmRtb2RlID09PSAncmVmZXJlbmNlJztcblx0ICAgIGIueHNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFtiLnN0YXJ0LCBiLmVuZF0pLnJhbmdlKCBiLmZsaXAgPyBbYmxlbiwgMF0gOiBbMCwgYmxlbl0gKTtcblx0ICAgIC8vXG5cdCAgICBpZiAoaT09PTApIHtcblx0XHQvLyBmaXJzdCBibG9jayBpbiBlYWNoIHN0cmlwIGluaXRzXG5cdFx0cHN0YXJ0W2pdID0gMDtcblx0XHRnZC5wd2lkdGggPSBibGVuO1xuXHRcdGJzdGFydFtqXSA9IGIuc3RhcnQ7XG5cdFx0ZHggPSAwO1xuXHRcdGNjaHIgPSBiLmNocjtcblx0ICAgIH1cblx0ICAgIGVsc2Uge1xuXHRcdGdkLnB3aWR0aCArPSBibGVuO1xuXHRcdGR4ID0gYi5jaHIgPT09IGNjaHIgPyBwc3RhcnRbal0gKyBzZWxmLnBwYiAqIChiLnN0YXJ0IC0gYnN0YXJ0W2pdKSA6IEluZmluaXR5O1xuXHRcdGlmIChkeCA8IDAgfHwgZHggPiBzZWxmLm1heFNCZ2FwKSB7XG5cdFx0ICAgIC8vIENoYW5nZWQgY2hyIG9yIGp1bXBlZCBhIGxhcmdlIGdhcFxuXHRcdCAgICBwc3RhcnRbal0gPSBwZW5kICsgR0FQO1xuXHRcdCAgICBic3RhcnRbal0gPSBiLnN0YXJ0O1xuXHRcdCAgICBnZC5wd2lkdGggKz0gR0FQO1xuXHRcdCAgICBkeCA9IHBzdGFydFtqXTtcblx0XHQgICAgY2NociA9IGIuY2hyO1xuXHRcdH1cblx0ICAgIH1cblx0ICAgIHBlbmQgPSBkeCArIGJsZW47XG5cdCAgICBkMy5zZWxlY3QodGhpcykuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke2R4fSwwKWApO1xuXHR9KTtcblx0dGhpcy5zcXVpc2goKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTY2FsZXMgZWFjaCB6b29tIHN0cmlwIGhvcml6b250YWxseSB0byBmaXQgdGhlIHdpZHRoLiBPbmx5IHNjYWxlcyBkb3duLlxuICAgIHNxdWlzaCAoKSB7XG4gICAgICAgIGxldCBzYnMgPSBkMy5zZWxlY3RBbGwoJy56b29tU3RyaXAgW25hbWU9XCJzQmxvY2tzXCJdJyk7XG5cdGxldCBzZWxmID0gdGhpcztcblx0c2JzLmVhY2goZnVuY3Rpb24gKHNiLGkpIHtcblx0ICAgIGlmIChzYi5nZW5vbWUucHdpZHRoID4gc2VsZi53aWR0aCkge1xuXHQgICAgICAgIGxldCBzID0gc2VsZi53aWR0aCAvIHNiLmdlbm9tZS5wd2lkdGg7XG5cdFx0c2IueFNjYWxlID0gcztcblx0XHRsZXQgdCA9IGQzLnNlbGVjdCh0aGlzKTtcblx0XHR0LmF0dHIoJ3RyYW5zZm9ybScsICgpPT4gYHRyYW5zbGF0ZSgkey1zYi5kZWx0YUIgKiBzZWxmLnBwYn0sMClzY2FsZSgke3NiLnhTY2FsZX0sMSlgKTtcblx0ICAgIH1cblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSB6b29tIHZpZXcgcGFuZWwgd2l0aCB0aGUgZ2l2ZW4gZGF0YS5cbiAgICAvL1xuICAgIGRyYXcgKGRhdGEpIHtcblx0Ly8gXG5cdGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gSXMgWm9vbVZpZXcgY3VycmVudGx5IGNsb3NlZD9cblx0bGV0IGNsb3NlZCA9IHRoaXMucm9vdC5jbGFzc2VkKCdjbG9zZWQnKTtcblx0Ly8gU2hvdyByZWYgZ2Vub21lIG5hbWVcblx0ZDMuc2VsZWN0KCcjem9vbVZpZXcgLnpvb21Db29yZHMgbGFiZWwnKVxuXHQgICAgLnRleHQodGhpcy5hcHAuckdlbm9tZS5sYWJlbCArICcgY29vcmRzJyk7XG5cdC8vIFNob3cgbGFuZG1hcmsgbGFiZWwsIGlmIGFwcGxpY2FibGVcblx0bGV0IGxtdHh0ID0gJyc7XG5cdGlmICh0aGlzLmNtb2RlID09PSAnbGFuZG1hcmsnKSB7XG5cdCAgICBsZXQgcmYgPSB0aGlzLmFwcC5sY29vcmRzLmxhbmRtYXJrUmVmRmVhdDtcblx0ICAgIGxldCBkID0gdGhpcy5hcHAubGNvb3Jkcy5kZWx0YTtcblx0ICAgIGxldCBkdHh0ID0gZCA/IGAgKCR7ZCA+IDAgPyAnKycgOiAnJ30ke3ByZXR0eVByaW50QmFzZXMoZCl9KWAgOiAnJztcblx0ICAgIGxtdHh0ID0gYEFsaWduZWQgb24gJHtyZi5zeW1ib2wgfHwgcmYuaWR9JHtkdHh0fWA7XG5cdH1cblx0Ly8gZGlzYWJsZSB0aGUgUi9DIGJ1dHRvbiBpbiBsYW5kbWFyayBtb2RlXG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ1tuYW1lPVwiem9vbWNvbnRyb2xzXCJdIFtuYW1lPVwiem9vbURtb2RlXCJdIC5idXR0b24nKVxuXHQgICAgLmF0dHIoJ2Rpc2FibGVkJywgdGhpcy5jbW9kZSA9PT0gJ2xhbmRtYXJrJyB8fCBudWxsKTtcblx0Ly8gZGlzcGxheSBsYW5kbWFyayB0ZXh0XG5cdGQzLnNlbGVjdCgnI3pvb21WaWV3IC56b29tQ29vcmRzIHNwYW4nKS50ZXh0KCBsbXR4dCApO1xuXHRcblx0Ly8gdGhlIHJlZmVyZW5jZSBnZW5vbWUgYmxvY2sgKGFsd2F5cyBqdXN0IDEgb2YgdGhlc2UpLlxuXHRsZXQgckRhdGEgPSBkYXRhLmZpbHRlcihkZCA9PiBkZC5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpWzBdO1xuXHRsZXQgckJsb2NrID0gckRhdGEuYmxvY2tzWzBdO1xuXG5cdC8vIHgtc2NhbGUgYW5kIHgtYXhpcyBiYXNlZCBvbiB0aGUgcmVmIGdlbm9tZS5cblx0dGhpcy54c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHQgICAgLmRvbWFpbihbckJsb2NrLnN0YXJ0LHJCbG9jay5lbmRdKVxuXHQgICAgLnJhbmdlKFswLHRoaXMud2lkdGhdKTtcblxuXHQvLyBwaXhlbHMgcGVyIGJhc2Vcblx0dGhpcy5wcGIgPSB0aGlzLndpZHRoIC8gKHRoaXMuYXBwLmNvb3Jkcy5lbmQgLSB0aGlzLmFwcC5jb29yZHMuc3RhcnQgKyAxKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBkcmF3IHRoZSBjb29yZGluYXRlIGF4aXNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0dGhpcy5heGlzRnVuYyA9IGQzLnN2Zy5heGlzKClcblx0ICAgIC5zY2FsZSh0aGlzLnhzY2FsZSlcblx0ICAgIC5vcmllbnQoJ3RvcCcpXG5cdCAgICAub3V0ZXJUaWNrU2l6ZSgyKVxuXHQgICAgLnRpY2tzKDUpXG5cdCAgICAudGlja1NpemUoNSlcblx0ICAgIDtcblx0dGhpcy5heGlzLmNhbGwodGhpcy5heGlzRnVuYyk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gem9vbSBzdHJpcHMgKG9uZSBwZXIgZ2Vub21lKVxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBsZXQgenN0cmlwcyA9IHRoaXMuc3RyaXBzR3JwXG5cdCAgICAgICAgLnNlbGVjdEFsbCgnZy56b29tU3RyaXAnKVxuXHRcdC5kYXRhKGRhdGEsIGQgPT4gZC5nZW5vbWUubmFtZSk7XG5cdC8vIENyZWF0ZSB0aGUgZ3JvdXBcblx0bGV0IG5ld3pzID0genN0cmlwcy5lbnRlcigpXG5cdCAgICAgICAgLmFwcGVuZCgnZycpXG5cdFx0LmF0dHIoJ2NsYXNzJywnem9vbVN0cmlwJylcblx0XHQuYXR0cignbmFtZScsIGQgPT4gZC5nZW5vbWUubmFtZSlcblx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGcpIHtcblx0XHQgICAgc2VsZi5oaWdobGlnaHRTdHJpcChnLmdlbm9tZSwgdGhpcyk7XG5cdFx0fSlcblx0XHQuY2FsbCh0aGlzLmRyYWdnZXIpXG5cdFx0O1xuXHQvL1xuXHQvLyBTdHJpcCBsYWJlbFxuXHRuZXd6cy5hcHBlbmQoJ3RleHQnKVxuXHQgICAgLmF0dHIoJ25hbWUnLCAnZ2Vub21lTGFiZWwnKVxuXHQgICAgLnRleHQoIGQgPT4gZC5nZW5vbWUubGFiZWwpXG5cdCAgICAuYXR0cigneCcsIDApXG5cdCAgICAuYXR0cigneScsIHRoaXMuYmxvY2tIZWlnaHQvMiArIDIwKVxuXHQgICAgLmF0dHIoJ2ZvbnQtZmFtaWx5Jywnc2Fucy1zZXJpZicpXG5cdCAgICAuYXR0cignZm9udC1zaXplJywgMTApXG5cdCAgICA7XG5cdC8vIFN0cmlwIHVuZGVybGF5XG5cdG5ld3pzLmFwcGVuZCgncmVjdCcpXG5cdCAgICAuYXR0cignY2xhc3MnLCd1bmRlcmxheScpXG5cdCAgICAuYXR0cigneScsIC10aGlzLmJsb2NrSGVpZ2h0LzIpXG5cdCAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5ibG9ja0hlaWdodClcblx0ICAgIC5zdHlsZSgnd2lkdGgnLCcxMDAlJylcblx0ICAgIC5zdHlsZSgnb3BhY2l0eScsMClcblx0ICAgIDtcblx0Ly8gR3JvdXAgZm9yIHNCbG9ja3Ncblx0bmV3enMuYXBwZW5kKCdnJylcblx0ICAgIC5hdHRyKCduYW1lJywgJ3NCbG9ja3MnKTtcblx0Ly8gU3RyaXAgZW5kIGNhcFxuXHRuZXd6cy5hcHBlbmQoJ3JlY3QnKVxuXHQgICAgLmF0dHIoJ2NsYXNzJywgJ21hdGVyaWFsLWljb25zIHpvb21TdHJpcEVuZENhcCcpXG5cdCAgICAuYXR0cigneCcsIC0xNSlcblx0ICAgIC5hdHRyKCd5JywgLXRoaXMuYmxvY2tIZWlnaHQgLyAyKVxuXHQgICAgLmF0dHIoJ3dpZHRoJywgMTUpXG5cdCAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5ibG9ja0hlaWdodCArIDEwKVxuXHQgICAgO1xuXHQvLyBTdHJpcCBkcmFnLWhhbmRsZVxuXHRuZXd6cy5hcHBlbmQoJ3RleHQnKVxuXHQgICAgLmF0dHIoJ2NsYXNzJywgJ21hdGVyaWFsLWljb25zIHpvb21TdHJpcEhhbmRsZScpXG5cdCAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsICcxOHB4Jylcblx0ICAgIC5hdHRyKCd4JywgLTE1KVxuXHQgICAgLmF0dHIoJ3knLCA5KVxuXHQgICAgLnRleHQoJ2RyYWdfaW5kaWNhdG9yJylcblx0ICAgIC5hcHBlbmQoJ3RpdGxlJylcblx0ICAgICAgICAudGV4dCgnRHJhZyB1cC9kb3duIHRvIHJlb3JkZXIgdGhlIGdlbm9tZXMuJylcblx0ICAgIDtcblx0Ly8gdHJhbnNsYXRlIHN0cmlwcyBpbnRvIHBvc2l0aW9uXG5cdGxldCBvZmZzZXQgPSB0aGlzLnRvcE9mZnNldDtcblx0bGV0IHJIZWlnaHQgPSAwO1xuXHR0aGlzLmFwcC52R2Vub21lcy5mb3JFYWNoKCB2ZyA9PiB7XG5cdCAgICBsZXQgcyA9IHRoaXMuc3RyaXBzR3JwLnNlbGVjdChgLnpvb21TdHJpcFtuYW1lPVwiJHt2Zy5uYW1lfVwiXWApO1xuXHQgICAgcy5jbGFzc2VkKCdyZWZlcmVuY2UnLCBkID0+IGQuZ2Vub21lID09PSB0aGlzLmFwcC5yR2Vub21lKVxuXHQgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBkID0+IHtcblx0XHQgICAgLy9yZXR1cm4gYHRyYW5zbGF0ZSgwLCR7Y2xvc2VkID8gdGhpcy50b3BPZmZzZXQgOiBnLmdlbm9tZS56b29tWX0pYFxuXHRcdCAgICBpZiAoZC5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpXG5cdFx0ICAgICAgICBySGVpZ2h0ID0gZC5zdHJpcEhlaWdodCArIGQuemVyb09mZnNldDtcblx0XHQgICAgbGV0IG8gPSBvZmZzZXQgKyBkLnplcm9PZmZzZXQ7XG5cdFx0ICAgIGQuem9vbVkgPSBvZmZzZXQ7XG5cdFx0ICAgIG9mZnNldCArPSBkLnN0cmlwSGVpZ2h0ICsgdGhpcy5zdHJpcEdhcDtcblx0XHQgICAgcmV0dXJuIGB0cmFuc2xhdGUoMCwke2Nsb3NlZCA/IHRoaXMudG9wT2Zmc2V0K2QuemVyb09mZnNldCA6IG99KWBcblx0XHR9KTtcblx0fSk7XG5cdC8vIHJlc2V0IHRoZSBzdmcgc2l6ZSBiYXNlZCBvbiBzdHJpcCB3aWR0aHNcblx0dGhpcy5zdmcuYXR0cignaGVpZ2h0JywgKGNsb3NlZCA/IHJIZWlnaHQgOiBvZmZzZXQpICsgMTUpO1xuXG4gICAgICAgIHpzdHJpcHMuZXhpdCgpXG5cdCAgICAub24oJy5kcmFnJywgbnVsbClcblx0ICAgIC5yZW1vdmUoKTtcblx0Ly9cbiAgICAgICAgenN0cmlwcy5zZWxlY3QoJ2dbbmFtZT1cInNCbG9ja3NcIl0nKVxuXHQgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGcgPT4gYHRyYW5zbGF0ZSgke2cuZGVsdGFCICogdGhpcy5wcGJ9LDApYClcblx0ICAgIDtcblx0Ly8gLS0tLSBTeW50ZW55IHN1cGVyIGJsb2NrcyAtLS0tXG4gICAgICAgIGxldCBzYmxvY2tzID0genN0cmlwcy5zZWxlY3QoJ1tuYW1lPVwic0Jsb2Nrc1wiXScpLnNlbGVjdEFsbCgnZy5zQmxvY2snKVxuXHQgICAgLmRhdGEoZD0+ZC5ibG9ja3MsIGIgPT4gYi5ibG9ja0lkKTtcblx0bGV0IG5ld3NicyA9IHNibG9ja3MuZW50ZXIoKVxuXHQgICAgLmFwcGVuZCgnZycpXG5cdCAgICAuYXR0cignY2xhc3MnLCAnc0Jsb2NrJylcblx0ICAgIC5hdHRyKCduYW1lJywgYj0+Yi5pbmRleClcblx0ICAgIDtcblx0bGV0IGwwID0gbmV3c2JzLmFwcGVuZCgnZycpLmF0dHIoJ25hbWUnLCAnbGF5ZXIwJyk7XG5cdGxldCBsMSA9IG5ld3Nicy5hcHBlbmQoJ2cnKS5hdHRyKCduYW1lJywgJ2xheWVyMScpO1xuXG5cdC8vXG5cdHRoaXMubGF5b3V0U0Jsb2NrcyhzYmxvY2tzKTtcblxuXHQvLyByZWN0YW5nbGUgZm9yIGVhY2ggaW5kaXZpZHVhbCBzeW50ZW55IGJsb2NrXG5cdGxldCBzYnJlY3RzID0gc2Jsb2Nrcy5zZWxlY3QoJ2dbbmFtZT1cImxheWVyMFwiXScpLnNlbGVjdEFsbCgncmVjdC5ibG9jaycpLmRhdGEoZD0+IHtcblx0ICAgIGQuc2Jsb2Nrcy5mb3JFYWNoKGI9PmIueHNjYWxlID0gZC54c2NhbGUpO1xuXHQgICAgcmV0dXJuIGQuc2Jsb2Nrc1xuXHQgICAgfSwgc2I9PnNiLmluZGV4KTtcbiAgICAgICAgc2JyZWN0cy5lbnRlcigpLmFwcGVuZCgncmVjdCcpLmFwcGVuZCgndGl0bGUnKTtcblx0c2JyZWN0cy5leGl0KCkucmVtb3ZlKCk7XG5cdHNicmVjdHNcblx0ICAgLmF0dHIoJ2NsYXNzJywgYiA9PiAnYmxvY2sgJyArIFxuXHQgICAgICAgKGIub3JpPT09JysnID8gJ3BsdXMnIDogYi5vcmk9PT0nLScgPyAnbWludXMnOiAnY29uZnVzZWQnKSArIFxuXHQgICAgICAgKGIuY2hyICE9PSBiLmZDaHIgPyAnIHRyYW5zbG9jYXRpb24nIDogJycpKVxuXHQgICAuYXR0cigneCcsICAgICBiID0+IGIueHNjYWxlKGIuZmxpcCA/IGIuZW5kIDogYi5zdGFydCkpXG5cdCAgIC5hdHRyKCd5JywgICAgIGIgPT4gLXRoaXMuYmxvY2tIZWlnaHQgLyAyKVxuXHQgICAuYXR0cignd2lkdGgnLCBiID0+IE1hdGgubWF4KDQsIE1hdGguYWJzKGIueHNjYWxlKGIuZW5kKS1iLnhzY2FsZShiLnN0YXJ0KSkpKVxuXHQgICAuYXR0cignaGVpZ2h0Jyx0aGlzLmJsb2NrSGVpZ2h0KTtcblx0ICAgO1xuXHRzYnJlY3RzLnNlbGVjdCgndGl0bGUnKVxuXHQgICAudGV4dCggYiA9PiB7XG5cdCAgICAgICBsZXQgYWRqZWN0aXZlcyA9IFtdO1xuXHQgICAgICAgYi5vcmkgPT09ICctJyAmJiBhZGplY3RpdmVzLnB1c2goJ2ludmVydGVkJyk7XG5cdCAgICAgICBiLmNociAhPT0gYi5mQ2hyICYmIGFkamVjdGl2ZXMucHVzaCgndHJhbnNsb2NhdGVkJyk7XG5cdCAgICAgICByZXR1cm4gYWRqZWN0aXZlcy5sZW5ndGggPyBhZGplY3RpdmVzLmpvaW4oJywgJykgKyAnIGJsb2NrJyA6ICcnO1xuXHQgICB9KTtcblxuXHQvLyB0aGUgYXhpcyBsaW5lXG5cdGwwLmFwcGVuZCgnbGluZScpLmF0dHIoJ2NsYXNzJywnYXhpcycpO1xuXHRcblx0c2Jsb2Nrcy5zZWxlY3QoJ2xpbmUuYXhpcycpXG5cdCAgICAuYXR0cigneDEnLCBiID0+IGIueHNjYWxlKGIuc3RhcnQpKVxuXHQgICAgLmF0dHIoJ3kxJywgMClcblx0ICAgIC5hdHRyKCd4MicsIGIgPT4gYi54c2NhbGUoYi5lbmQpKVxuXHQgICAgLmF0dHIoJ3kyJywgMClcblx0ICAgIDtcblx0Ly8gbGFiZWxcblx0bDAuYXBwZW5kKCd0ZXh0Jylcblx0ICAgIC5hdHRyKCdjbGFzcycsJ2Jsb2NrTGFiZWwnKSA7XG5cdC8vIGJydXNoXG5cdGwwLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywnYnJ1c2gnKTtcblx0Ly9cblx0c2Jsb2Nrcy5leGl0KCkucmVtb3ZlKCk7XG5cblx0Ly8gc3ludGVueSBibG9jayBsYWJlbHNcblx0c2Jsb2Nrcy5zZWxlY3QoJ3RleHQuYmxvY2tMYWJlbCcpXG5cdCAgICAudGV4dCggYiA9PiBiLmNociApXG5cdCAgICAuYXR0cigneCcsIGIgPT4gKGIueHNjYWxlKGIuc3RhcnQpICsgYi54c2NhbGUoYi5lbmQpKS8yIClcblx0ICAgIC5hdHRyKCd5JywgdGhpcy5ibG9ja0hlaWdodCAvIDIgKyAxMClcblx0ICAgIDtcblxuXHQvLyBicnVzaFxuXHRzYmxvY2tzLnNlbGVjdCgnZy5icnVzaCcpXG5cdCAgICAuYXR0cigndHJhbnNmb3JtJywgYiA9PiBgdHJhbnNsYXRlKDAsJHt0aGlzLmJsb2NrSGVpZ2h0IC8gMn0pYClcblx0ICAgIC5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oYikge1xuXHQgICAgICAgIGxldCBjciA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0bGV0IHggPSBkMy5ldmVudC5jbGllbnRYIC0gY3IueDtcblx0XHRsZXQgYyA9IE1hdGgucm91bmQoYi54c2NhbGUuaW52ZXJ0KHgpKTtcblx0XHRzZWxmLnNob3dGbG9hdGluZ1RleHQoYCR7Yi5jaHJ9OiR7Y31gLCBkMy5ldmVudC5jbGllbnRYLCBkMy5ldmVudC5jbGllbnRZKTtcblx0ICAgIH0pXG5cdCAgICAub24oJ21vdXNlb3V0JywgYiA9PiB0aGlzLmhpZGVGbG9hdGluZ1RleHQoKSlcblx0ICAgIC5lYWNoKGZ1bmN0aW9uKGIpIHtcblx0XHRpZiAoIWIuYnJ1c2gpIHtcblx0XHQgICAgYi5icnVzaCA9IGQzLnN2Zy5icnVzaCgpXG5cdFx0XHQub24oJ2JydXNoc3RhcnQnLCBmdW5jdGlvbigpeyBzZWxmLmJiU3RhcnQoIGIsIHRoaXMgKTsgfSlcblx0XHRcdC5vbignYnJ1c2gnLCAgICAgIGZ1bmN0aW9uKCl7IHNlbGYuYmJCcnVzaCggYiwgdGhpcyApOyB9KVxuXHRcdFx0Lm9uKCdicnVzaGVuZCcsICAgZnVuY3Rpb24oKXsgc2VsZi5iYkVuZCggYiwgdGhpcyApOyB9KVxuXHRcdH1cblx0XHRiLmJydXNoLngoYi54c2NhbGUpLmNsZWFyKCk7XG5cdFx0ZDMuc2VsZWN0KHRoaXMpLmNhbGwoYi5icnVzaCk7XG5cdCAgICB9KVxuXHQgICAgLnNlbGVjdEFsbCgncmVjdCcpXG5cdFx0LmF0dHIoJ2hlaWdodCcsIDEwKTtcblxuXHR0aGlzLmRyYXdGZWF0dXJlcyhzYmxvY2tzKTtcblxuXHQvL1xuXHR0aGlzLmFwcC5mYWNldE1hbmFnZXIuYXBwbHlBbGwoKTtcblxuXHQvLyBXZSBuZWVkIHRvIGxldCB0aGUgdmlldyByZW5kZXIgYmVmb3JlIGRvaW5nIHRoZSBoaWdobGlnaHRpbmcsIHNpbmNlIGl0IGRlcGVuZHMgb25cblx0Ly8gdGhlIHBvc2l0aW9ucyBvZiByZWN0YW5nbGVzIGluIHRoZSBzY2VuZS5cblx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuXHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0fSwgMTUwKTtcbiAgICB9O1xuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIGZlYXR1cmVzIChyZWN0YW5nbGVzKSBmb3IgdGhlIHNwZWNpZmllZCBzeW50ZW55IGJsb2Nrcy5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBzYmxvY2tzIChEMyBzZWxlY3Rpb24gb2YgZy5zYmxvY2sgbm9kZXMpIC0gbXVsdGlsZXZlbCBzZWxlY3Rpb24uXG4gICAgLy8gICAgICAgIEFycmF5IChjb3JyZXNwb25kaW5nIHRvIHN0cmlwcykgb2YgYXJyYXlzIG9mIHN5bnRlbnkgYmxvY2tzLlxuICAgIC8vXG4gICAgZHJhd0ZlYXR1cmVzIChzYmxvY2tzKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblx0Ly9cblx0Ly8gbmV2ZXIgZHJhdyB0aGUgc2FtZSBmZWF0dXJlIHR3aWNlIGluIG9uZSByZW5kZXJpbmcgcGFzc1xuXHRsZXQgZHJhd24gPSBuZXcgU2V0KCk7XHQvLyBzZXQgb2YgSURzIG9mIGRyYXduIGZlYXR1cmVzXG5cdGxldCBmaWx0ZXJEcmF3biA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICAvLyByZXR1cm5zIHRydWUgaWYgd2UndmUgbm90IHNlZW4gdGhpcyBvbmUgYmVmb3JlLlxuXHQgICAgLy8gcmVnaXN0ZXJzIHRoYXQgd2UndmUgc2VlbiBpdC5cblx0ICAgIGxldCBmaWQgPSBmLklEO1xuXHQgICAgbGV0IHYgPSAhIGRyYXduLmhhcyhmaWQpO1xuXHQgICAgZHJhd24uYWRkKGZpZCk7XG5cdCAgICByZXR1cm4gdjtcblx0fTtcblx0bGV0IGZlYXRzID0gc2Jsb2Nrcy5zZWxlY3QoJ1tuYW1lPVwibGF5ZXIxXCJdJykuc2VsZWN0QWxsKCcuZmVhdHVyZScpXG5cdCAgICAuZGF0YShkPT5kLmZlYXR1cmVzLmZpbHRlcihmaWx0ZXJEcmF3biksIGQ9PmQuSUQpO1xuXHRmZWF0cy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGxldCBuZXdGZWF0cyA9IGZlYXRzLmVudGVyKCkuYXBwZW5kKCdyZWN0Jylcblx0ICAgIC5hdHRyKCdjbGFzcycsIGYgPT4gJ2ZlYXR1cmUnICsgKGYuc3RyYW5kPT09Jy0nID8gJyBtaW51cycgOiAnIHBsdXMnKSlcblx0ICAgIC5hdHRyKCduYW1lJywgZiA9PiBmLklEKVxuXHQgICAgLnN0eWxlKCdmaWxsJywgZiA9PiBzZWxmLmFwcC5jc2NhbGUoZi5nZXRNdW5nZWRUeXBlKCkpKVxuXHQgICAgO1xuXHQvLyBOQjogaWYgeW91IGFyZSBsb29raW5nIGZvciBjbGljayBoYW5kbGVycywgdGhleSBhcmUgYXQgdGhlIHN2ZyBsZXZlbCAoc2VlIGluaXREb20gYWJvdmUpLlxuXG5cdC8vIHJldHVybnMgdGhlIHN5bnRlbnkgYmxvY2sgY29udGFpbmluZyB0aGlzIGZlYXR1cmVcblx0bGV0IGZCbG9jayA9IGZ1bmN0aW9uIChmZWF0RWx0KSB7XG5cdCAgICBsZXQgYmxrRWx0ID0gZmVhdEVsdC5wYXJlbnROb2RlO1xuXHQgICAgcmV0dXJuIGJsa0VsdC5fX2RhdGFfXztcblx0fVxuXHRsZXQgZnggPSBmdW5jdGlvbihmKSB7XG5cdCAgICBsZXQgYiA9IGZCbG9jayh0aGlzKTtcblx0ICAgIHJldHVybiBiLnhzY2FsZShNYXRoLm1heChmLnN0YXJ0LGIuc3RhcnQpKVxuXHR9O1xuXHRsZXQgZncgPSBmdW5jdGlvbiAoZikge1xuXHQgICAgbGV0IGIgPSBmQmxvY2sodGhpcyk7XG5cdCAgICByZXR1cm4gTWF0aC5hYnMoYi54c2NhbGUoTWF0aC5taW4oZi5lbmQsYi5lbmQpKSAtIGIueHNjYWxlKE1hdGgubWF4KGYuc3RhcnQsYi5zdGFydCkpKSArIDE7XG5cdH07XG5cdGxldCBmeSA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICAgICBsZXQgYiA9IGZCbG9jayh0aGlzKTtcblx0ICAgICAgIGlmIChmLnN0cmFuZCA9PSAnKycpe1xuXHRcdCAgIGlmIChiLmZsaXApIFxuXHRcdCAgICAgICByZXR1cm4gc2VsZi5sYW5lSGVpZ2h0KmYubGFuZSAtIHNlbGYuZmVhdEhlaWdodDsgXG5cdFx0ICAgZWxzZSBcblx0XHQgICAgICAgcmV0dXJuIC1zZWxmLmxhbmVIZWlnaHQqZi5sYW5lO1xuXHQgICAgICAgfVxuXHQgICAgICAgZWxzZSB7XG5cdFx0ICAgLy8gZi5sYW5lIGlzIG5lZ2F0aXZlIGZvciAnLScgc3RyYW5kXG5cdFx0ICAgaWYgKGIuZmxpcCkgXG5cdFx0ICAgICAgIHJldHVybiBzZWxmLmxhbmVIZWlnaHQqZi5sYW5lO1xuXHRcdCAgIGVsc2Vcblx0XHQgICAgICAgcmV0dXJuIC1zZWxmLmxhbmVIZWlnaHQqZi5sYW5lIC0gc2VsZi5mZWF0SGVpZ2h0OyBcblx0ICAgICAgIH1cblx0ICAgfTtcblxuXHRmZWF0c1xuXHQgIC5hdHRyKCd4JywgZngpXG5cdCAgLmF0dHIoJ3dpZHRoJywgZncpXG5cdCAgLmF0dHIoJ3knLCBmeSlcblx0ICAuYXR0cignaGVpZ2h0JywgdGhpcy5mZWF0SGVpZ2h0KVxuXHQgIDtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIGZlYXR1cmUgaGlnaGxpZ2h0aW5nIGluIHRoZSBjdXJyZW50IHpvb20gdmlldy5cbiAgICAvLyBGZWF0dXJlcyB0byBiZSBoaWdobGlnaHRlZCBpbmNsdWRlIHRob3NlIGluIHRoZSBoaUZlYXRzIGxpc3QgcGx1cyB0aGUgZmVhdHVyZVxuICAgIC8vIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHJlY3RhbmdsZSBhcmd1bWVudCwgaWYgZ2l2ZW4uIChUaGUgbW91c2VvdmVyIGZlYXR1cmUuKVxuICAgIC8vXG4gICAgLy8gRHJhd3MgZmlkdWNpYWxzIGZvciBmZWF0dXJlcyBpbiB0aGlzIGxpc3QgdGhhdDpcbiAgICAvLyAxLiBvdmVybGFwIHRoZSBjdXJyZW50IHpvb21WaWV3IGNvb3JkIHJhbmdlXG4gICAgLy8gMi4gYXJlIG5vdCByZW5kZXJlZCBpbnZpc2libGUgYnkgY3VycmVudCBmYWNldCBzZXR0aW5nc1xuICAgIC8vXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBjdXJyZW50IChyZWN0IGVsZW1lbnQpIE9wdGlvbmFsLiBBZGQnbCByZWN0YW5nbGUgZWxlbWVudCwgZS5nLiwgdGhhdCB3YXMgbW91c2VkLW92ZXIuIEhpZ2hsaWdodGluZ1xuICAgIC8vICAgICAgICB3aWxsIGluY2x1ZGUgdGhlIGZlYXR1cmUgY29ycmVzcG9uZGluZyB0byB0aGlzIHJlY3QgYWxvbmcgd2l0aCB0aG9zZSBpbiB0aGUgaGlnaGxpZ2h0IGxpc3QuXG4gICAgLy8gICAgcHVsc2VDdXJyZW50IChib29sZWFuKSBJZiB0cnVlIGFuZCBjdXJyZW50IGlzIGdpdmVuLCBjYXVzZSBpdCB0byBwdWxzZSBicmllZmx5LlxuICAgIC8vXG4gICAgaGlnaGxpZ2h0IChjdXJyZW50LCBwdWxzZUN1cnJlbnQpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHQvLyBjdXJyZW50IGZlYXR1cmVcblx0bGV0IGN1cnJGZWF0ID0gY3VycmVudCA/IChjdXJyZW50IGluc3RhbmNlb2YgRmVhdHVyZSA/IGN1cnJlbnQgOiBjdXJyZW50Ll9fZGF0YV9fKSA6IG51bGw7XG5cdC8vIGNyZWF0ZSBsb2NhbCBjb3B5IG9mIGhpRmVhdHMsIHdpdGggY3VycmVudCBmZWF0dXJlIGFkZGVkXG5cdGxldCBoaUZlYXRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5oaUZlYXRzLCB0aGlzLmFwcC5jdXJyTGlzdEluZGV4IHx8e30pO1xuXHRpZiAoY3VyckZlYXQpIHtcblx0ICAgIGhpRmVhdHNbY3VyckZlYXQuaWRdID0gY3VyckZlYXQuaWQ7XG5cdH1cblxuXHQvLyBGaWx0ZXIgYWxsIGZlYXR1cmVzIChyZWN0YW5nbGVzKSBpbiB0aGUgc2NlbmUgZm9yIHRob3NlIGJlaW5nIGhpZ2hsaWdodGVkLlxuXHQvLyBBbG9uZyB0aGUgd2F5LCBidWlsZCBpbmRleCBtYXBwaW5nIGZlYXR1cmUgaWQgdG8gaXRzICdzdGFjaycgb2YgZXF1aXZhbGVudCBmZWF0dXJlcyxcblx0Ly8gaS5lLiBhIGxpc3Qgb2YgaXRzIGdlbm9sb2dzIHNvcnRlZCBieSB5IGNvb3JkaW5hdGUuXG5cdC8vXG5cdHRoaXMuc3RhY2tzID0ge307IC8vIGZpZCAtPiBbIHJlY3RzIF0gXG5cdGxldCBkaCA9IHRoaXMuYmxvY2tIZWlnaHQvMiAtIHRoaXMuZmVhdEhlaWdodDtcbiAgICAgICAgbGV0IGZlYXRzID0gdGhpcy5zdmdNYWluLnNlbGVjdEFsbCgnLmZlYXR1cmUnKVxuXHQgIC8vIGZpbHRlciByZWN0LmZlYXR1cmVzIGZvciB0aG9zZSBpbiB0aGUgaGlnaGxpZ2h0IGxpc3Rcblx0ICAuZmlsdGVyKGZ1bmN0aW9uKGZmKXtcblx0ICAgICAgLy8gaGlnaGxpZ2h0IGZmIGlmIGVpdGhlciBpZCBpcyBpbiB0aGUgbGlzdCBBTkQgaXQncyBub3QgYmVlbiBoaWRkZW5cblx0ICAgICAgbGV0IG1naSA9IGhpRmVhdHNbZmYuY2Fub25pY2FsXTtcblx0ICAgICAgbGV0IG1ncCA9IGhpRmVhdHNbZmYuSURdO1xuXHQgICAgICBsZXQgc2hvd2luZyA9IGQzLnNlbGVjdCh0aGlzKS5zdHlsZSgnZGlzcGxheScpICE9PSAnbm9uZSc7XG5cdCAgICAgIGxldCBobCA9IHNob3dpbmcgJiYgKG1naSB8fCBtZ3ApO1xuXHQgICAgICBpZiAoaGwpIHtcblx0XHQgIC8vIGZvciBlYWNoIGhpZ2hsaWdodGVkIGZlYXR1cmUsIGFkZCBpdHMgcmVjdGFuZ2xlIHRvIHRoZSBsaXN0XG5cdFx0ICBsZXQgayA9IGZmLmlkO1xuXHRcdCAgaWYgKCFzZWxmLnN0YWNrc1trXSkgc2VsZi5zdGFja3Nba10gPSBbXVxuXHRcdCAgc2VsZi5zdGFja3Nba10ucHVzaCh0aGlzKVxuXHQgICAgICB9XG5cdCAgICAgIC8vIFxuXHQgICAgICBkMy5zZWxlY3QodGhpcylcblx0XHQgIC5jbGFzc2VkKCdoaWdobGlnaHQnLCBobClcblx0XHQgIC5jbGFzc2VkKCdjdXJyZW50JywgaGwgJiYgY3VyckZlYXQgJiYgdGhpcy5fX2RhdGFfXy5pZCA9PT0gY3VyckZlYXQuaWQpXG5cdFx0ICAuY2xhc3NlZCgnZXh0cmEnLCBwdWxzZUN1cnJlbnQgJiYgZmYgPT09IGN1cnJGZWF0KVxuXHQgICAgICByZXR1cm4gaGw7XG5cdCAgfSlcblx0ICA7XG5cblx0dGhpcy5kcmF3RmlkdWNpYWxzKGN1cnJGZWF0KTtcblxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHBvbHlnb25zIHRoYXQgY29ubmVjdCBoaWdobGlnaHRlZCBmZWF0dXJlcyBpbiB0aGUgdmlld1xuICAgIC8vXG4gICAgZHJhd0ZpZHVjaWFscyAoY3VyckZlYXQpIHtcblx0Ly8gYnVpbGQgZGF0YSBhcnJheSBmb3IgZHJhd2luZyBmaWR1Y2lhbHMgYmV0d2VlbiBlcXVpdmFsZW50IGZlYXR1cmVzXG5cdGxldCBkYXRhID0gW107XG5cdGZvciAobGV0IGsgaW4gdGhpcy5zdGFja3MpIHtcblx0ICAgIC8vIGZvciBlYWNoIGhpZ2hsaWdodGVkIGZlYXR1cmUsIHNvcnQgdGhlIHJlY3RhbmdsZXMgaW4gaXRzIGxpc3QgYnkgWS1jb29yZGluYXRlXG5cdCAgICBsZXQgcmVjdHMgPSB0aGlzLnN0YWNrc1trXTtcblx0ICAgIHJlY3RzLnNvcnQoIChhLGIpID0+IHBhcnNlRmxvYXQoYS5nZXRBdHRyaWJ1dGUoJ3knKSkgLSBwYXJzZUZsb2F0KGIuZ2V0QXR0cmlidXRlKCd5JykpICk7XG5cdCAgICByZWN0cy5zb3J0KCAoYSxiKSA9PiB7XG5cdFx0cmV0dXJuIGEuX19kYXRhX18uZ2Vub21lLnpvb21ZIC0gYi5fX2RhdGFfXy5nZW5vbWUuem9vbVk7XG5cdCAgICB9KTtcblx0ICAgIC8vIFdhbnQgYSBwb2x5Z29uIGJldHdlZW4gZWFjaCBzdWNjZXNzaXZlIHBhaXIgb2YgaXRlbXMuIFRoZSBmb2xsb3dpbmcgY3JlYXRlcyBhIGxpc3Qgb2Zcblx0ICAgIC8vIG4gcGFpcnMsIHdoZXJlIHJlY3RbaV0gaXMgcGFpcmVkIHdpdGggcmVjdFtpKzFdLiBUaGUgbGFzdCBwYWlyIGNvbnNpc3RzIG9mIHRoZSBsYXN0XG5cdCAgICAvLyByZWN0YW5nbGUgcGFpcmVkIHdpdGggdW5kZWZpbmVkLiAoV2Ugd2FudCB0aGlzLilcblx0ICAgIGxldCBwYWlycyA9IHJlY3RzLm1hcCgociwgaSkgPT4gW3IscmVjdHNbaSsxXV0pO1xuXHQgICAgLy8gQWRkIGEgY2xhc3MgKCdjdXJyZW50JykgZm9yIHRoZSBwb2x5Z29ucyBhc3NvY2lhdGVkIHdpdGggdGhlIG1vdXNlb3ZlciBmZWF0dXJlIHNvIHRoZXlcblx0ICAgIC8vIGNhbiBiZSBkaXN0aW5ndWlzaGVkIGZyb20gb3RoZXJzLlxuXHQgICAgZGF0YS5wdXNoKHsgZmlkOiBrLCByZWN0czogcGFpcnMsIGNsczogKGN1cnJGZWF0ICYmIGN1cnJGZWF0LmlkID09PSBrID8gJ2N1cnJlbnQnIDogJycpIH0pO1xuXHR9XG5cblx0bGV0IHNlbGYgPSB0aGlzO1xuXHQvL1xuXHQvLyBwdXQgZmlkdWNpYWwgbWFya3MgaW4gdGhlaXIgb3duIGdyb3VwIFxuXHRsZXQgZkdycCA9IHRoaXMuZmlkdWNpYWxzLmNsYXNzZWQoJ2hpZGRlbicsIGZhbHNlKTtcblxuXHQvLyBCaW5kIGZpcnN0IGxldmVsIGRhdGEgdG8gJ2ZlYXR1cmVNYXJrcycgZ3JvdXBzXG5cdGxldCBmZkdycHMgPSBmR3JwLnNlbGVjdEFsbCgnZy5mZWF0dXJlTWFya3MnKVxuXHQgICAgLmRhdGEoZGF0YSwgZCA9PiBkLmZpZCk7XG5cdGZmR3Jwcy5lbnRlcigpLmFwcGVuZCgnZycpXG5cdCAgICAuYXR0cignbmFtZScsIGQgPT4gZC5maWQpO1xuXHRmZkdycHMuZXhpdCgpLnJlbW92ZSgpO1xuXHQvL1xuXHRmZkdycHMuYXR0cignY2xhc3MnLCBkID0+IHtcbiAgICAgICAgICAgIGxldCBjbGFzc2VzID0gWydmZWF0dXJlTWFya3MnXTtcblx0ICAgIGQuY2xzICYmIGNsYXNzZXMucHVzaChkLmNscyk7XG5cdCAgICB0aGlzLmFwcC5jdXJyTGlzdEluZGV4W2QuZmlkXSAmJiBjbGFzc2VzLnB1c2goJ2xpc3RJdGVtJylcblx0ICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcblx0fSk7XG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBEcmF3IHRoZSBjb25uZWN0b3IgcG9seWdvbnMuXG5cdC8vIEJpbmQgc2Vjb25kIGxldmVsIGRhdGEgKHJlY3RhbmdsZSBwYWlycykgdG8gcG9seWdvbnMgaW4gdGhlIGdyb3VwXG5cdGxldCBwZ29ucyA9IGZmR3Jwcy5zZWxlY3RBbGwoJ3BvbHlnb24nKVxuXHQgICAgLmRhdGEoZD0+ZC5yZWN0cy5maWx0ZXIociA9PiByWzBdICYmIHJbMV0pKTtcblx0cGdvbnMuZW50ZXIoKS5hcHBlbmQoJ3BvbHlnb24nKVxuXHQgICAgLmF0dHIoJ2NsYXNzJywnZmlkdWNpYWwnKVxuXHQgICAgO1xuXHQvL1xuXHRwZ29ucy5hdHRyKCdwb2ludHMnLCByID0+IHtcblx0ICAgIC8vIHBvbHlnb24gY29ubmVjdHMgYm90dG9tIGNvcm5lcnMgb2YgMXN0IHJlY3QgdG8gdG9wIGNvcm5lcnMgb2YgMm5kIHJlY3Rcblx0ICAgIGxldCBjMSA9IGNvb3Jkc0FmdGVyVHJhbnNmb3JtKHJbMF0pOyAvLyB0cmFuc2Zvcm0gY29vcmRzIGZvciAxc3QgcmVjdFxuXHQgICAgbGV0IGMyID0gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0oclsxXSk7ICAvLyB0cmFuc2Zvcm0gY29vcmRzIGZvciAybmQgcmVjdFxuXHQgICAgci50Y29vcmRzID0gW2MxLGMyXTtcblx0ICAgIC8vIGZvdXIgcG9seWdvbiBwb2ludHNcblx0ICAgIGxldCBzID0gYCR7YzEueH0sJHtjMS55K2MxLmhlaWdodH0gJHtjMi54fSwke2MyLnl9ICR7YzIueCtjMi53aWR0aH0sJHtjMi55fSAke2MxLngrYzEud2lkdGh9LCR7YzEueStjMS5oZWlnaHR9YFxuXHQgICAgcmV0dXJuIHM7XG5cdH0pXG5cdC8vXG5cdC8vIG1vdXNpbmcgb3ZlciB0aGUgZmlkdWNpYWwgaGlnaGxpZ2h0cyAoYXMgaWYgdGhlIHVzZXIgaGFkIG1vdXNlZCBvdmVyIHRoZSBmZWF0dXJlIGl0c2VsZilcblx0Lm9uKCdtb3VzZW92ZXInLCAocCkgPT4ge1xuXHQgICAgdGhpcy5oaWdobGlnaHQocFswXSk7XG5cdH0pXG5cdC5vbignbW91c2VvdXQnLCAgKHApID0+IHtcblx0ICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXHQvL1xuXHRwZ29ucy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRHJhdyBmZWF0dXJlIGxhYmVscy4gRWFjaCBsYWJlbCBpcyBkcmF3biBvbmNlLCBhYm92ZSB0aGUgZmlyc3QgcmVjdGFuZ2xlIGluIGl0cyBsaXN0LlxuXHQvLyBUaGUgZXhjZXB0aW9uIGlzIHRoZSBjdXJyZW50IChtb3VzZW92ZXIpIGZlYXR1cmUsIHdoZXJlIHRoZSBsYWJlbCBpcyBkcmF3biBhYm92ZSB0aGF0IGZlYXR1cmUuXG5cdGxldCBsYWJlbHMgPSBmZkdycHMuc2VsZWN0QWxsKCd0ZXh0LmZlYXRMYWJlbCcpXG5cdCAgICAuZGF0YShkID0+IHtcblx0XHRsZXQgciA9IGQucmVjdHNbMF1bMF07XG5cdFx0aWYgKGN1cnJGZWF0ICYmIChkLmZpZCA9PT0gY3VyckZlYXQuSUQgfHwgZC5maWQgPT09IGN1cnJGZWF0LmNhbm9uaWNhbCkpe1xuXHRcdCAgICBsZXQgcjIgPSBkLnJlY3RzLm1hcCggcnIgPT5cblx0XHQgICAgICAgcnJbMF0uX19kYXRhX18gPT09IGN1cnJGZWF0ID8gcnJbMF0gOiByclsxXSYmcnJbMV0uX19kYXRhX18gPT09IGN1cnJGZWF0ID8gcnJbMV0gOiBudWxsXG5cdFx0ICAgICAgICkuZmlsdGVyKHg9PngpWzBdO1xuXHRcdCAgICByID0gcjIgPyByMiA6IHI7XG5cdFx0fVxuXHQgICAgICAgIHJldHVybiBbe1xuXHRcdCAgICBmaWQ6IGQuZmlkLFxuXHRcdCAgICByZWN0OiByLFxuXHRcdCAgICB0cmVjdDogY29vcmRzQWZ0ZXJUcmFuc2Zvcm0ocilcblx0XHR9XTtcblx0ICAgIH0pO1xuXG5cdC8vIERyYXcgdGhlIHRleHQuXG5cdGxhYmVscy5lbnRlcigpLmFwcGVuZCgndGV4dCcpLmF0dHIoJ2NsYXNzJywnZmVhdExhYmVsJyk7XG5cdGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XG5cdGxhYmVsc1xuXHQgIC5hdHRyKCd4JywgZCA9PiBkLnRyZWN0LnggKyBkLnRyZWN0LndpZHRoLzIgKVxuXHQgIC5hdHRyKCd5JywgZCA9PiBkLnJlY3QuX19kYXRhX18uZ2Vub21lLnpvb21ZKzE1KVxuXHQgIC50ZXh0KGQgPT4ge1xuXHQgICAgICAgbGV0IGYgPSBkLnJlY3QuX19kYXRhX187XG5cdCAgICAgICBsZXQgc3ltID0gZi5zeW1ib2wgfHwgZi5JRDtcblx0ICAgICAgIHJldHVybiBzeW07XG5cdCAgfSk7XG5cblx0Ly8gUHV0IGEgcmVjdGFuZ2xlIGJlaGluZCBlYWNoIGxhYmVsIGFzIGEgYmFja2dyb3VuZFxuXHRsZXQgbGJsQm94RGF0YSA9IGxhYmVscy5tYXAobGJsID0+IGxibFswXS5nZXRCQm94KCkpXG5cdGxldCBsYmxCb3hlcyA9IGZmR3Jwcy5zZWxlY3RBbGwoJ3JlY3QuZmVhdExhYmVsQm94Jylcblx0ICAgIC5kYXRhKChkLGkpID0+IFtsYmxCb3hEYXRhW2ldXSk7XG5cdGxibEJveGVzLmVudGVyKCkuaW5zZXJ0KCdyZWN0JywndGV4dCcpLmF0dHIoJ2NsYXNzJywnZmVhdExhYmVsQm94Jyk7XG5cdGxibEJveGVzLmV4aXQoKS5yZW1vdmUoKTtcblx0bGJsQm94ZXNcblx0ICAgIC5hdHRyKCd4JywgICAgICBiYiA9PiBiYi54LTIpXG5cdCAgICAuYXR0cigneScsICAgICAgYmIgPT4gYmIueS0xKVxuXHQgICAgLmF0dHIoJ3dpZHRoJywgIGJiID0+IGJiLndpZHRoKzQpXG5cdCAgICAuYXR0cignaGVpZ2h0JywgYmIgPT4gYmIuaGVpZ2h0KzIpXG5cdCAgICA7XG5cdFxuXHQvLyBpZiB0aGVyZSBpcyBhIGN1cnJGZWF0LCBtb3ZlIGl0cyBmaWR1Y2lhbHMgdG8gdGhlIGVuZCAoc28gdGhleSdyZSBvbiB0b3Agb2YgZXZlcnlvbmUgZWxzZSlcblx0aWYgKGN1cnJGZWF0KSB7XG5cdCAgICAvLyBnZXQgbGlzdCBvZiBncm91cCBlbGVtZW50cyBmcm9tIHRoZSBkMyBzZWxlY3Rpb25cblx0ICAgIGxldCBmZkxpc3QgPSBmZkdycHNbMF07XG5cdCAgICAvLyBmaW5kIHRoZSBvbmUgd2hvc2UgZmVhdHVyZSBpcyBjdXJyRmVhdFxuXHQgICAgbGV0IGkgPSAtMTtcblx0ICAgIGZmTGlzdC5mb3JFYWNoKCAoZyxqKSA9PiB7IGlmIChnLl9fZGF0YV9fLmZpZCA9PT0gY3VyckZlYXQuaWQpIGkgPSBqOyB9KTtcblx0ICAgIC8vIGlmIHdlIGZvdW5kIGl0IGFuZCBpdCdzIG5vdCBhbHJlYWR5IHRoZSBsYXN0LCBtb3ZlIGl0IHRvIHRoZVxuXHQgICAgLy8gbGFzdCBwb3NpdGlvbiBhbmQgcmVvcmRlciBpbiB0aGUgRE9NLlxuXHQgICAgaWYgKGkgPj0gMCkge1xuXHRcdGxldCBsYXN0aSA9IGZmTGlzdC5sZW5ndGggLSAxO1xuXHQgICAgICAgIGxldCB4ID0gZmZMaXN0W2ldO1xuXHRcdGZmTGlzdFtpXSA9IGZmTGlzdFtsYXN0aV07XG5cdFx0ZmZMaXN0W2xhc3RpXSA9IHg7XG5cdFx0ZmZHcnBzLm9yZGVyKCk7XG5cdCAgICB9XG5cdH1cblx0XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZGVGaWR1Y2lhbHMgKCkge1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0KCdnLmZpZHVjaWFscycpXG5cdCAgICAuY2xhc3NlZCgnaGlkZGVuJywgdHJ1ZSk7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgWm9vbVZpZXdcblxuZXhwb3J0IHsgWm9vbVZpZXcgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1pvb21WaWV3LmpzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9