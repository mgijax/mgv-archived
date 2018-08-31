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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
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
    if (!svg) return null;
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
/* harmony default export */ __webpack_exports__["a"] = ({
    MGVApp : {
	name :	"Multiple Genome Viewer (MGV)",
	version :	"1.0.0", // use semantic versioning
    },
    AuxDataManager : {
	mousemine : 'test',
	allMines : {
	    'dev' : 'http://bhmgimm-dev:8080/mousemine',
	    'test': 'http://test.mousemine.org/mousemine',
	    'public' : 'http://www.mousemine.org/mousemine',
	}
    },
    SVGView : {
	outerWidth : 100,
	width : 100,
	outerHeight : 100,
	height : 100,
	margins : {top: 18, right: 12, bottom: 12, left: 12}
    },
    ZoomView : {
	topOffset : 15,		// Y offset to first strip
	featHeight : 8,		// height of a rectangle representing a feature
	laneGap : 2,	        // space between swim lanes
	laneHeight : 10,	// == featHeight + laneGap
	minLanes : 3,		// minimum number of swim lanes (each strand)
	blockHeight : 60,	// == 2 * minLanes * laneHeight
	minStripHeight : 75,    // height per genome in the zoom view
	stripGap : 20,	// space between strips
	maxSBgap : 20,	// max gap allowed between blocks.
	dmode : 'comparison',// initial drawing mode. 'comparison' or 'reference'
	wheelThreshold : 3,	// minimum wheel distance 
	featureDetailThreshold : 2000000, // if width <= thresh, draw feature details.
	wheelContextDelay : 300,  // ms delay after last wheel event before changing context
    },
    QueryManager : {
	searchTypes : [{
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
	}]
    }
});


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return KeyStore; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_idb_keyval__ = __webpack_require__(11);


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
/* 4 */
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
/* 5 */
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SVGView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Component__ = __webpack_require__(1);



// ---------------------------------------------
class SVGView extends __WEBPACK_IMPORTED_MODULE_1__Component__["a" /* Component */] {
    constructor (app, elt, width, height, margins, rotation, translation) {
        super(app, elt);
        this.svg = this.root.select("svg");
        this.svgMain = this.svg
            .append("g")    // the margin-translated group
            .append("g")	  // main group for the drawing
	    .attr("name","svgmain");
	let c = __WEBPACK_IMPORTED_MODULE_0__config__["a" /* default */].SVGView;
	this.outerWidth = c.outerWidth;
	this.width = c.width;
	this.outerHeight = c.outerHeight;
	this.height = c.height;
	this.margins = Object.assign({}, c.margins);
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MGVApp__ = __webpack_require__(8);
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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MGVApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Genome__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__FeatureManager__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__QueryManager__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ListManager__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ListEditor__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__FacetManager__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__BTManager__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__GenomeView__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__FeatureDetails__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ZoomView__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__KeyStore__ = __webpack_require__(3);















// ---------------------------------------------
class MGVApp extends __WEBPACK_IMPORTED_MODULE_3__Component__["a" /* Component */] {
    constructor (selector, cfg) {
	super(null, selector);
	this.globalConfig = __WEBPACK_IMPORTED_MODULE_0__config__["a" /* default */];
	console.log(__WEBPACK_IMPORTED_MODULE_0__config__["a" /* default */]);
	this.app = this;
	this.name = __WEBPACK_IMPORTED_MODULE_0__config__["a" /* default */].MGVApp.name;
	this.version = __WEBPACK_IMPORTED_MODULE_0__config__["a" /* default */].MGVApp.version;
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
	this.listManager    = new __WEBPACK_IMPORTED_MODULE_6__ListManager__["a" /* ListManager */](this, "#mylists");
	this.listManager.ready.then( () => this.listManager.update() );
	//
	this.listEditor = new __WEBPACK_IMPORTED_MODULE_7__ListEditor__["a" /* ListEditor */](this, '#listeditor');
	//
	this.queryManager = new __WEBPACK_IMPORTED_MODULE_5__QueryManager__["a" /* QueryManager */](this, "#findGenesBox");
	// 
	this.translator     = new __WEBPACK_IMPORTED_MODULE_9__BTManager__["a" /* BTManager */](this);
	this.featureManager = new __WEBPACK_IMPORTED_MODULE_4__FeatureManager__["a" /* FeatureManager */](this);
	//
	this.userPrefsStore = new __WEBPACK_IMPORTED_MODULE_13__KeyStore__["a" /* KeyStore */]("user-preferences");
	
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
	    Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* d3tsv */])("./data/genomedata/allGenomes.tsv").then(data => {
		// create Genome objects from the raw data.
		this.allGenomes   = data.map(g => new __WEBPACK_IMPORTED_MODULE_2__Genome__["a" /* Genome */](g));
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
		let cdps = this.allGenomes.map(g => Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* d3tsv */])(`./data/genomedata/${g.name}-chromosomes.tsv`));
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
        let tStore = new __WEBPACK_IMPORTED_MODULE_13__KeyStore__["a" /* KeyStore */]('timestamp');
	return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* d3tsv */])('./data/genomedata/TIMESTAMP.tsv').then( ts => {
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
	
	d3.select('#header label')
	    .text(this.name)
	    ;
	d3.select('#version')
	    .text('version ' + this.version)
	    ;
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
	Object(__WEBPACK_IMPORTED_MODULE_1__utils__["g" /* initOptList */])("#refGenome",   this.allGenomes, g=>g.name, g=>g.label, false, g => g === cfg.ref);
	Object(__WEBPACK_IMPORTED_MODULE_1__utils__["g" /* initOptList */])("#compGenomes", this.allGenomes, g=>g.name, g=>g.label, true,  g => cfg.genomes.indexOf(g) !== -1);
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
	Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* d3tsv */])("./data/genomedata/genomeSets.tsv").then(sets => {
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
		    return ai === -1 ? 1 : bi === -1 ? -1 : ai - bi;
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
	cfg.start = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* clip */])(Math.round(typeof(c.start) === "number" ? c.start : this.coords.start), 1, cfg.chr.length);

	// Set cfg.end to be the specified end with fallback to the current end
	// Clip at chr boundaries
	cfg.end = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* clip */])(Math.round(typeof(c.end) === "number" ? c.end : this.coords.end), 1, cfg.chr.length);

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
	let coords = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["j" /* parseCoords */])(str);
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
	let d = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* clip */])(pfactor * width, minD, maxD); // delta (at new zoom)
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
	let d = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* clip */])(factor * width, minD, maxD);
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
/* 9 */
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
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FeatureManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Feature__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__KeyStore__ = __webpack_require__(3);




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
/* 11 */
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
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QueryManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__AuxDataManager__ = __webpack_require__(13);





// ---------------------------------------------
class QueryManager extends __WEBPACK_IMPORTED_MODULE_2__Component__["a" /* Component */] {
    constructor (app, elt) {
        super(app, elt);
	this.cfg = __WEBPACK_IMPORTED_MODULE_0__config__["a" /* default */].QueryManager.searchTypes;
	this.auxDataManager = new __WEBPACK_IMPORTED_MODULE_3__AuxDataManager__["a" /* AuxDataManager */]();
	this.select = null;	// my <select> element
	this.term = null;	// my <input> element
	this.initDom();
    }
    initDom () {
	this.select = this.root.select('[name="searchtype"]');
	this.term   = this.root.select('[name="searchterm"]');
	//
	this.term.attr("placeholder", this.cfg[0].placeholder)
	Object(__WEBPACK_IMPORTED_MODULE_1__utils__["g" /* initOptList */])(this.select[0][0], this.cfg, c=>c.method, c=>c.label);
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
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuxDataManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



// ---------------------------------------------
// AuxDataManager - knows how to query an external source (i.e., MouseMine) for genes
// annotated to different ontologies and for exons associated with specific genes or regions.
class AuxDataManager {
    constructor () {
	this.cfg = __WEBPACK_IMPORTED_MODULE_0__config__["a" /* default */].AuxDataManager;
	if (!this.cfg.allMines[this.cfg.mousemine]) 
	    throw "Unknown mine name: " + this.cfg.mousemine;
	this.baseUrl = this.cfg.allMines[this.cfg.mousemine];
	console.log("MouseMine url:", this.baseUrl);
        this.qUrl = this.baseUrl + '/service/query/results?';
	this.rUrl = this.baseUrl + '/portal.do?class=SequenceFeature&externalids='
	this.faUrl = this.baseUrl + '/service/query/results/fasta?';
    }
    //----------------------------------------------
    getAuxData (q, format) {
	//console.log('Query: ' + q);
	format = format || 'jsonobjects';
	let query = encodeURIComponent(q);
	let url = this.qUrl + `format=${format}&query=${query}`;
	return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* d3json */])(url).then(data => data.results||[]);
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
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ListFormulaEvaluator__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__KeyStore__ = __webpack_require__(3);




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
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListFormulaEvaluator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ListFormulaParser__ = __webpack_require__(5);


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
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListEditor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ListFormulaParser__ = __webpack_require__(5);




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
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FacetManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Facet__ = __webpack_require__(18);


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
/* 18 */
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
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BTManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BlockTranslator__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__KeyStore__ = __webpack_require__(3);




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
	console.log(`Registering blocks: ${aname} vs ${bname}`, `#blocks=${blocks.length}`);
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
/* 20 */
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
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GenomeView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SVGView__ = __webpack_require__(6);
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
/* 22 */
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
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ZoomView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SVGView__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Feature__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(0);





// ---------------------------------------------
class ZoomView extends __WEBPACK_IMPORTED_MODULE_1__SVGView__["a" /* SVGView */] {
    //
    constructor (app, elt, width, height, initialCoords, initialHi) {
      super(app, elt, width, height);
      //
      let self = this;
      //
      this.drawCount = 0;
      this.cfg = __WEBPACK_IMPORTED_MODULE_0__config__["a" /* default */].ZoomView;
      this.dmode = 'comparison';// drawing mode. 'comparison' or 'reference'
      // A feature may be rendered in one of two ways: as a simple rect, or as a group containing the 
      // rect and other stuff like text, an axis line, etc.
      this.showFeatureDetails = false; // if true, show exon structure
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
	      if (f instanceof __WEBPACK_IMPORTED_MODULE_2__Feature__["a" /* Feature */]) {
		  fClickHandler(f, d3.event);
	      }
	      d3.event.stopPropagation();
	      d3.event.preventDefault();
	  })
	  .on('mouseover', () => {
	      let tgt = d3.select(d3.event.target);
	      let f = tgt.data()[0];
	      f = f ? f.feature || f : f;
	      if (f instanceof __WEBPACK_IMPORTED_MODULE_2__Feature__["a" /* Feature */]) {
		  fMouseOverHandler(f);
	      }
	  })
	  .on('mouseout', () => {
	      let tgt = d3.select(d3.event.target);
	      let f = tgt.data()[0];
	      f = f ? f.feature || f : f;
	      if (f instanceof __WEBPACK_IMPORTED_MODULE_2__Feature__["a" /* Feature */]) {
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
	    if (Math.abs(e.deltaX) < self.cfg.wheelThreshold) 
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
	    zd.deltaB = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* clip */])(zd.deltaB + db, -c.start, c.chromosome.length - c.end)
	    // translate
	    d3.select(this).selectAll('g.zoomStrip > g[name="sBlocks"]')
		.attr('transform', cz => `translate(${-zd.deltaB * self.ppb},0)scale(${cz.xScale},1)`);
	    self.drawFiducials();
	    // Wait until wheel events have stopped for a while, then scroll the view.
	    if (self.timeout){
		console.log("Cleared timeout", self.timeout);
	        window.clearTimeout(self.timeout);
	    }
	    self.timeout = window.setTimeout(() => {
		console.log("Timeout!", self.timeout);
		self.timeout = null;
		let ccxt = self.app.getContext();
		let ncxt;
		if (ccxt.landmark) {
		    ncxt = { delta: ccxt.delta + zd.deltaB };
		}
		else {
		    ncxt = { start: ccxt.start + zd.deltaB, end: ccxt.end + zd.deltaB };
		}
		self.app.setContext(ncxt);
		zd.deltaB = 0;
	    }, self.cfg.wheelContextDelay);
	    console.log("Set timeout", self.timeout);
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
	    .call(zcs => zcs[0][0].value = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["e" /* formatCoords */])(this.app.coords))
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
    //----------------------------------------------
    get laneGap () {
        return this.cfg.laneGap;
    }
    set laneGap (g) {
        this.cfg.laneGap = g;
	this.cfg.laneHeight = this.cfg.featHeight + this.cfg.laneGap;
	this.cfg.blockHeight = this.cfg.laneHeight * this.cfg.minLanes * 2;
	this.update();
    }

    //----------------------------------------------
    get featHeight () {
        return this.cfg.featHeight;
    }
    set featHeight (h) {
        this.cfg.featHeight = h;
	this.cfg.laneHeight = this.cfg.featHeight + this.cfg.laneGap;
	this.cfg.blockHeight = this.cfg.laneHeight * this.cfg.minLanes * 2;
	this.update();
    }

    //----------------------------------------------
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
       let offset = this.cfg.topOffset;
       gs.forEach( g => {
           g.zoomY = offset;
	   offset += this.cfg.minStripHeight + this.cfg.stripGap;
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
	this.genomes = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["l" /* removeDups */])(ns).map(n=> this.app.name2genome[n] ).filter(x=>x);
	let o = this.cfg.topOffset;
        this.genomes.forEach( (g,i) => {
	    let strip = d3.select(`#zoomView .zoomStrip[name="${g.name}"]`);
	    if (!strip.classed('dragging'))
	        strip.attr('transform', gd => `translate(0,${o + gd.zeroOffset})`);
	    o += strip.data()[0].stripHeight + this.cfg.stripGap;
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
	  // User clicked. Recenter view on the clicked coordinate. 
	  // Whichever genome the user clicked in becomes the reference.
	  // The clicked coordinate:
	  let xmid = (xt[0] + xt[1])/2;
	  // size of view
	  let w = this.app.coords.end - this.app.coords.start + 1;
	  // starting coordinate in clicked genome of new view
	  let s = Math.round(xmid - w/2);
	  //
	  let newContext = { ref:g, chr: this.brushing.chr, start: s, end: s + w - 1 };
	  if (this.cmode === 'landmark') {
	      let lmf = this.context.landmarkFeats.filter(f => f.genome === this.brushing.genome)[0];
	      if (lmf) {
		  let m = (this.brushing.end + this.brushing.start) / 2;
		  let dx = xmid - m;
		  newContext = { ref:g, delta: this.context.delta+dx };
	      }
	  }
	  this.app.setContext(newContext);
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
	this.showFeatureDetails = (c.end - c.start + 1) <= this.cfg.featureDetailThreshold;
	this.clearAll = prevSFD !== this.showFeatureDetails;
    }

    //----------------------------------------------
    // Updates the ZoomView to show the given coordinate range from the reg genome and the corresponding
    // range(s) in each comparison genome.
    //
    updateViaMappedCoordinates (coords) {
	let c = (coords || this.app.coords);
	d3.select('#zoomCoords')[0][0].value = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["e" /* formatCoords */])(c.chr, c.start, c.end);
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
	    let sign = f.strand === '-' ? -1 : 1;
	    let start = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* clip */])(Math.round(delta + f.start - flank), 1, clength);
	    let end   = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* clip */])(Math.round(start + w), start, clength)
	    let fdelta = f.length / 2;
	    let range = {
		genome:	    f.genome,
		chr:	    f.chr,
		chromosome: f.genome.getChromosome(f.chr),
		start:      start - sign * fdelta,
		end:        end   - sign * fdelta
	    } ;
	    if (f.genome === mgv.rGenome) {
		let c = this.app.coords = range;
		d3.select('#zoomCoords')[0][0].value = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["e" /* formatCoords */])(c.chr, c.start, c.end);
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
    update (context) {
	this.context = context || this.context;
	this.highlighted = this.context.highlight;
	this.genomes = this.context.genomes;
	this.dmode = this.context.dmode;
	this.cmode = this.context.cmode;
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
	  gData.stripHeight = 15 + this.cfg.laneHeight * (gData.maxLanesP + gData.maxLanesN);
	  gData.zeroOffset = this.cfg.laneHeight * gData.maxLanesP;
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
		if (dx < 0 || dx > self.cfg.maxSBgap) {
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
	this.drawCount += 1;
	console.log('Draw', this.drawCount, new Date());
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
	    let dtxt = d ? ` (${d > 0 ? '+' : ''}${Object(__WEBPACK_IMPORTED_MODULE_3__utils__["k" /* prettyPrintBases */])(d)})` : '';
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
	    .attr('y', this.cfg.blockHeight/2 + 20)
	    .attr('font-family','sans-serif')
	    .attr('font-size', 10)
	    ;
	// Strip underlay
	newzs.append('rect')
	    .attr('class','underlay')
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
	    .attr('y', -this.cfg.blockHeight / 2)
	    .attr('width', 15)
	    .attr('height', this.cfg.blockHeight + 10)
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
	// Updates
	zstrips.select('.zoomStripEndCap')
	    .attr('height', this.cfg.blockHeight + 10)
	    .attr('y', -this.cfg.blockHeight / 2)
	    ;
	zstrips.select('[name="genomeLabel"]')
	    .attr('y', this.cfg.blockHeight/2 + 20)
	    ;
	zstrips.select('.underlay')
	    .attr('y', -this.cfg.blockHeight/2)
	    .attr('height', this.cfg.blockHeight)
	    ;
	    
	// translate strips into position
	let offset = this.cfg.topOffset;
	let rHeight = 0;
	this.app.vGenomes.forEach( vg => {
	    let s = this.stripsGrp.select(`.zoomStrip[name="${vg.name}"]`);
	    s.classed('reference', d => d.genome === this.app.rGenome)
	        .attr('transform', d => {
		    //return `translate(0,${closed ? this.cfg.topOffset : g.genome.zoomY})`
		    if (d.genome === this.app.rGenome)
		        rHeight = d.stripHeight + d.zeroOffset;
		    let o = offset + d.zeroOffset;
		    d.zoomY = offset;
		    offset += d.stripHeight + this.cfg.stripGap;
		    return `translate(0,${closed ? this.cfg.topOffset+d.zeroOffset : o})`
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
	   .attr('y',     b => -this.cfg.blockHeight / 2)
	   .attr('width', b => Math.max(4, Math.abs(b.xscale(b.end)-b.xscale(b.start))))
	   .attr('height',this.cfg.blockHeight);
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
	    .attr('y', this.cfg.blockHeight / 2 + 10)
	    ;

	// brush
	sblocks.select('g.brush')
	    .attr('transform', b => `translate(0,${this.cfg.blockHeight / 2})`)
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
	    window.setTimeout(() => {
		this.highlight();
	    }, 150);
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
		       return self.cfg.laneHeight*f.lane - self.cfg.featHeight; 
		   else 
		       return -self.cfg.laneHeight*f.lane;
	       }
	       else {
		   // f.lane is negative for '-' strand
		   if (b.flip) 
		       return self.cfg.laneHeight*f.lane;
		   else
		       return -self.cfg.laneHeight*f.lane - self.cfg.featHeight; 
	       }
	   };

	// Set position and size attributes of the overall feature rect.
	(this.showFeatureDetails ? feats.select('rect') : feats)
	  .attr('x', fx)
	  .attr('y', fy)
	  .attr('width', fw)
	  .attr('height', this.cfg.featHeight)
	  ;

	// draw detailed feature
	if (this.showFeatureDetails) {
	    // draw axis line
	    feats.select('line')
	        .attr('x1', fx)
		.attr('y1', fy)
		.attr('x2', function (f) { return fx.bind(this)(f) + fw.bind(this)(f) - 1 })
		.attr('y2', fy)
		.attr('transform',`translate(0,${this.cfg.featHeight/2})`)
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
		    .text(e => 'exon: '+e.ID)
		    ;
	    exons.exit().remove();
	    exons.attr('name', e => e.primaryIdentifier)
	        .attr('x', fx)
	        .attr('y', function(e) {return fy.bind(this)(e.feature)})
	        .attr('width', fw)
	        .attr('height', this.cfg.featHeight)
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
	let currFeat = current ? (current instanceof __WEBPACK_IMPORTED_MODULE_2__Feature__["a" /* Feature */] ? current : current.__data__) : null;
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
	let dh = this.cfg.blockHeight/2 - this.cfg.featHeight;
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
	    try {
	    // polygon connects bottom corners of 1st rect to top corners of 2nd rect
	    let c1 = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["b" /* coordsAfterTransform */])(r[0]); // transform coords for 1st rect
	    let c2 = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["b" /* coordsAfterTransform */])(r[1]);  // transform coords for 2nd rect
	    r.tcoords = [c1,c2];
	    // four polygon points
	    let s = `${c1.x},${c1.y+c1.height} ${c2.x},${c2.y} ${c2.x+c2.width},${c2.y} ${c1.x+c1.width},${c1.y+c1.height}`
	    return s;
	    }
	    catch (e) {
	        console.log("Caught error:", e);
		return '';
	    }
	})
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
		    trect: Object(__WEBPACK_IMPORTED_MODULE_3__utils__["b" /* coordsAfterTransform */])(r)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOWNkMmVjODE3NmYwN2E4MmIwYjUiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvS2V5U3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RGb3JtdWxhUGFyc2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9TVkdWaWV3LmpzIiwid2VicGFjazovLy8uL3d3dy9qcy92aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL01HVkFwcC5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvR2Vub21lLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GZWF0dXJlTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaWRiLWtleXZhbC9kaXN0L2lkYi1rZXl2YWwubWpzIiwid2VicGFjazovLy8uL3d3dy9qcy9RdWVyeU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0F1eERhdGFNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvTGlzdEZvcm11bGFFdmFsdWF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RFZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZhY2V0TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmFjZXQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0JUTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQmxvY2tUcmFuc2xhdG9yLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9HZW5vbWVWaWV3LmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GZWF0dXJlRGV0YWlscy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvWm9vbVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVEQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixvREFBb0Q7QUFDaEYsU0FBUztBQUNULEtBQUssRTtBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixvREFBb0Q7QUFDaEYsU0FBUztBQUNULEtBQUssRTtBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7Ozs7Ozs7OztBQzFENEM7O0FBRTVDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsb0JBQW9CO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsSUFBSTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7O0FDckRSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxNQUFNO0FBQ04sRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLG9CQUFvQjtBQUNyRCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxRQUFRLFVBQVUsRUFBRSxJQUFJO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLHFCQUFxQjtBQUM3Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsRUFBRTtBQUNsQixpQkFBaUIsS0FBSyxHQUFHLEVBQUU7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUIsR0FBRyxnQkFBZ0IsR0FBRyxhQUFhO0FBQ3BFLGlCQUFpQixjQUFjLEdBQUcsZ0JBQWdCLEdBQUcsZ0JBQWdCO0FBQ3JFO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsYUFBYTtBQUNsRTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFTzs7Ozs7Ozs7OztBQzdTb0I7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7Ozs7Ozs7QUNuRXFEO0FBQ3pDO0FBQ1E7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7Ozs7QUNqT1E7O0FBRWhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTzs7Ozs7Ozs7QUM3QlI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7Ozs7Ozs7QUNwQlE7QUFDVTtBQUNQOztBQUVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLE1BQU0sTUFBTSxNQUFNLGNBQWMsY0FBYztBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sSUFBSTtBQUNYO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7O0FDOUdSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0Esd0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isd0RBQXdEO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsVztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0IsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0EsNkJBQTZCO0FBQzdCLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELEdBQUc7QUFDdkQsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0Msc0JBQXNCLFdBQVcsVUFBVTtBQUNuRjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGlCQUFpQixFQUFFLDRFQUFvQjtBQUNoRSwyQkFBMkIsbUJBQW1CLEVBQUUsS0FBSztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxRQUFRO0FBQy9EO0FBQ0E7QUFDQSw4QkFBOEIsNkNBQTZDO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsNkNBQTZDO0FBQ3pFLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLG9CQUFvQjtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0Qyx5QkFBeUI7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTSxHQUFHLEVBQUU7QUFDdEMsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLHlCQUF5QixFQUFFO0FBQzNELGdDQUFnQyx5QkFBeUIsRUFBRTtBQUMzRCxnQ0FBZ0MsdUJBQXVCLEVBQUU7QUFDekQ7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsaURBQWlEO0FBQzdFO0FBQ0EsbUNBQW1DLHNCQUFzQjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsZ0NBQWdDO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsMkNBQTJDO0FBQzFFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsOEVBQThFO0FBQzlGOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUdBQXlDO0FBQ3pDLGlHQUF5QztBQUN6QztBQUNBO0FBQ0EsZ0JBQWdCLEtBQUssR0FBRyxlQUFlLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxjQUFjLEdBQUcsS0FBSyxHQUFHLGNBQWMsR0FBRyxlQUFlO0FBQ25IO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiwyQ0FBMkMsRUFBRTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPIiwiZmlsZSI6Im1ndi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA3KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA5Y2QyZWM4MTc2ZjA3YTgyYjBiNSIsIlxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyAgICAgICAgICAgICAgICAgICAgVVRJTFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIChSZS0pSW5pdGlhbGl6ZXMgYW4gb3B0aW9uIGxpc3QuXG4vLyBBcmdzOlxuLy8gICBzZWxlY3RvciAoc3RyaW5nIG9yIE5vZGUpIENTUyBzZWxlY3RvciBvZiB0aGUgY29udGFpbmVyIDxzZWxlY3Q+IGVsZW1lbnQuIE9yIHRoZSBlbGVtZW50IGl0c2VsZi5cbi8vICAgb3B0cyAobGlzdCkgTGlzdCBvZiBvcHRpb24gZGF0YSBvYmplY3RzLiBNYXkgYmUgc2ltcGxlIHN0cmluZ3MuIE1heSBiZSBtb3JlIGNvbXBsZXguXG4vLyAgIHZhbHVlIChmdW5jdGlvbiBvciBudWxsKSBGdW5jdGlvbiB0byBwcm9kdWNlIHRoZSA8b3B0aW9uPiB2YWx1ZSBmcm9tIGFuIG9wdHMgaXRlbVxuLy8gICAgICAgRGVmYXVsdHMgdG8gdGhlIGlkZW50aXR5IGZ1bmN0aW9uICh4PT54KS5cbi8vICAgbGFiZWwgKGZ1bmN0aW9uIG9yIG51bGwpIEZ1bmN0aW9uIHRvIHByb2R1Y2UgdGhlIDxvcHRpb24+IGxhYmVsIGZyb20gYW4gb3B0cyBpdGVtXG4vLyAgICAgICBEZWZhdWx0cyB0byB0aGUgdmFsdWUgZnVuY3Rpb24uXG4vLyAgIG11bHRpIChib29sZWFuKSBTcGVjaWZpZXMgaWYgdGhlIGxpc3Qgc3VwcG9ydCBtdWx0aXBsZSBzZWxlY3Rpb25zLiAoZGVmYXVsdCA9IGZhbHNlKVxuLy8gICBzZWxlY3RlZCAoZnVuY3Rpb24gb3IgbnVsbCkgRnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIGEgZ2l2ZW4gb3B0aW9uIGlzIHNlbGVjdGQuXG4vLyAgICAgICBEZWZhdWx0cyB0byBkPT5GYWxzZS4gTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgb25seSBhcHBsaWVkIHRvIG5ldyBvcHRpb25zLlxuLy8gICBzb3J0QnkgKGZ1bmN0aW9uKSBPcHRpb25hbC4gSWYgcHJvdmlkZWQsIGEgY29tcGFyaXNvbiBmdW5jdGlvbiB0byB1c2UgZm9yIHNvcnRpbmcgdGhlIG9wdGlvbnMuXG4vLyAgIFx0IFRoZSBjb21wYXJpc29uIGZ1bmN0aW9uIGlzIHBhc3NlcyB0aGUgZGF0YSBvYmplY3RzIGNvcnJlc3BvbmRpbmcgdG8gdHdvIG9wdGlvbnMgYW5kIHNob3VsZFxuLy8gICBcdCByZXR1cm4gLTEsIDAgb3IgKzEuIElmIG5vdCBwcm92aWRlZCwgdGhlIG9wdGlvbiBsaXN0IHdpbGwgaGF2ZSB0aGUgc2FtZSBzb3J0IG9yZGVyIGFzIHRoZSBvcHRzIGFyZ3VtZW50LlxuLy8gUmV0dXJuczpcbi8vICAgVGhlIG9wdGlvbiBsaXN0IGluIGEgRDMgc2VsZWN0aW9uLlxuZnVuY3Rpb24gaW5pdE9wdExpc3Qoc2VsZWN0b3IsIG9wdHMsIHZhbHVlLCBsYWJlbCwgbXVsdGksIHNlbGVjdGVkLCBzb3J0QnkpIHtcblxuICAgIC8vIHNldCB1cCB0aGUgZnVuY3Rpb25zXG4gICAgbGV0IGlkZW50ID0gZCA9PiBkO1xuICAgIHZhbHVlID0gdmFsdWUgfHwgaWRlbnQ7XG4gICAgbGFiZWwgPSBsYWJlbCB8fCB2YWx1ZTtcbiAgICBzZWxlY3RlZCA9IHNlbGVjdGVkIHx8ICh4ID0+IGZhbHNlKTtcblxuICAgIC8vIHRoZSA8c2VsZWN0PiBlbHRcbiAgICBsZXQgcyA9IGQzLnNlbGVjdChzZWxlY3Rvcik7XG5cbiAgICAvLyBtdWx0aXNlbGVjdFxuICAgIHMucHJvcGVydHkoJ211bHRpcGxlJywgbXVsdGkgfHwgbnVsbCkgO1xuXG4gICAgLy8gYmluZCB0aGUgb3B0cy5cbiAgICBsZXQgb3MgPSBzLnNlbGVjdEFsbChcIm9wdGlvblwiKVxuICAgICAgICAuZGF0YShvcHRzLCBsYWJlbCk7XG4gICAgb3MuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKFwib3B0aW9uXCIpIFxuICAgICAgICAuYXR0cihcInZhbHVlXCIsIHZhbHVlKVxuICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCBvID0+IHNlbGVjdGVkKG8pIHx8IG51bGwpXG4gICAgICAgIC50ZXh0KGxhYmVsKSBcbiAgICAgICAgO1xuICAgIC8vXG4gICAgb3MuZXhpdCgpLnJlbW92ZSgpIDtcblxuICAgIC8vIHNvcnQgdGhlIHJlc3VsdHNcbiAgICBpZiAoIXNvcnRCeSkgc29ydEJ5ID0gKGEsYikgPT4ge1xuICAgIFx0bGV0IGFpID0gb3B0cy5pbmRleE9mKGEpO1xuXHRsZXQgYmkgPSBvcHRzLmluZGV4T2YoYik7XG5cdHJldHVybiBhaSAtIGJpO1xuICAgIH1cbiAgICBvcy5zb3J0KHNvcnRCeSk7XG5cbiAgICAvL1xuICAgIHJldHVybiBzO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByb21pc2lmaWVzIGEgY2FsbCB0byBkMy50c3YuXG4vLyBBcmdzOlxuLy8gICB1cmwgKHN0cmluZykgVGhlIHVybCBvZiB0aGUgdHN2IHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbGlzdCBvZiByb3cgb2JqZWN0c1xuZnVuY3Rpb24gZDN0c3YodXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkMy50c3YodXJsLCBmdW5jdGlvbihlcnJvciwgdmFsKXtcbiAgICAgICAgICAgIGVycm9yID8gcmVqZWN0KHsgc3RhdHVzOiBlcnJvci5zdGF0dXMsIHN0YXR1c1RleHQ6IGVycm9yLnN0YXR1c1RleHR9KSA6IHJlc29sdmUodmFsKTtcbiAgICAgICAgfSkgIFxuICAgIH0pOyBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcm9taXNpZmllcyBhIGNhbGwgdG8gZDMuanNvbi5cbi8vIEFyZ3M6XG4vLyAgIHVybCAoc3RyaW5nKSBUaGUgdXJsIG9mIHRoZSBqc29uIHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUganNvbiBvYmplY3QgdmFsdWUsIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvclxuZnVuY3Rpb24gZDNqc29uKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZDMuanNvbih1cmwsIGZ1bmN0aW9uKGVycm9yLCB2YWwpe1xuICAgICAgICAgICAgZXJyb3IgPyByZWplY3QoeyBzdGF0dXM6IGVycm9yLnN0YXR1cywgc3RhdHVzVGV4dDogZXJyb3Iuc3RhdHVzVGV4dH0pIDogcmVzb2x2ZSh2YWwpO1xuICAgICAgICB9KSAgXG4gICAgfSk7IFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByb21pc2lmaWVzIGEgY2FsbCB0byBkMy50ZXh0LlxuLy8gQXJnczpcbi8vICAgdXJsIChzdHJpbmcpIFRoZSB1cmwgb2YgdGhlIHRleHQgcmVzb3VyY2Vcbi8vIFJldHVybnM6XG4vLyAgIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBqc29uIG9iamVjdCB2YWx1ZSwgb3IgcmVqZWN0cyB3aXRoIGFuIGVycm9yXG5mdW5jdGlvbiBkM3RleHQodXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkMy50ZXh0KHVybCwgJ3RleHQvcGxhaW4nLCBmdW5jdGlvbihlcnJvciwgdmFsKXtcbiAgICAgICAgICAgIGVycm9yID8gcmVqZWN0KHsgc3RhdHVzOiBlcnJvci5zdGF0dXMsIHN0YXR1c1RleHQ6IGVycm9yLnN0YXR1c1RleHR9KSA6IHJlc29sdmUodmFsKTtcbiAgICAgICAgfSkgIFxuICAgIH0pOyBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIGEgZGVlcCBjb3B5IG9mIG9iamVjdCBvLiBcbi8vIEFyZ3M6XG4vLyAgIG8gIChvYmplY3QpIE11c3QgYmUgYSBKU09OIG9iamVjdCAobm8gY3VyY3VsYXIgcmVmcywgbm8gZnVuY3Rpb25zKS5cbi8vIFJldHVybnM6XG4vLyAgIGEgZGVlcCBjb3B5IG9mIG9cbmZ1bmN0aW9uIGRlZXBjKG8pIHtcbiAgICBpZiAoIW8pIHJldHVybiBvO1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvKSk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUGFyc2VzIGEgc3RyaW5nIG9mIHRoZSBmb3JtIFwiY2hyOnN0YXJ0Li5lbmRcIi5cbi8vIFJldHVybnM6XG4vLyAgIG9iamVjdCBjb250aW5pbmcgdGhlIHBhcnNlZCBmaWVsZHMuXG4vLyBFeGFtcGxlOlxuLy8gICBwYXJzZUNvb3JkcyhcIjEwOjEwMDAwMDAwLi4yMDAwMDAwMFwiKSAtPiB7Y2hyOlwiMTBcIiwgc3RhcnQ6MTAwMDAwMDAsIGVuZDoyMDAwMDAwMH1cbmZ1bmN0aW9uIHBhcnNlQ29vcmRzIChjb29yZHMpIHtcbiAgICBsZXQgcmUgPSAvKFteOl0rKTooXFxkKylcXC5cXC4oXFxkKykvO1xuICAgIGxldCBtID0gY29vcmRzLm1hdGNoKHJlKTtcbiAgICByZXR1cm4gbSA/IHtjaHI6bVsxXSwgc3RhcnQ6cGFyc2VJbnQobVsyXSksIGVuZDpwYXJzZUludChtWzNdKX0gOiBudWxsO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEZvcm1hdHMgYSBjaHJvbW9zb21lIG5hbWUsIHN0YXJ0IGFuZCBlbmQgcG9zaXRpb24gYXMgYSBzdHJpbmcuXG4vLyBBcmdzIChmb3JtIDEpOlxuLy8gICBjb29yZHMgKG9iamVjdCkgT2YgdGhlIGZvcm0ge2NocjpzdHJpbmcsIHN0YXJ0OmludCwgZW5kOmludH1cbi8vIEFyZ3MgKGZvcm0gMik6XG4vLyAgIGNociBzdHJpbmdcbi8vICAgc3RhcnQgaW50XG4vLyAgIGVuZCBpbnRcbi8vIFJldHVybnM6XG4vLyAgICAgc3RyaW5nXG4vLyBFeGFtcGxlOlxuLy8gICAgIGZvcm1hdENvb3JkcyhcIjEwXCIsIDEwMDAwMDAwLCAyMDAwMDAwMCkgLT4gXCIxMDoxMDAwMDAwMC4uMjAwMDAwMDBcIlxuZnVuY3Rpb24gZm9ybWF0Q29vcmRzIChjaHIsIHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHRsZXQgYyA9IGNocjtcblx0Y2hyID0gYy5jaHI7XG5cdHN0YXJ0ID0gYy5zdGFydDtcblx0ZW5kID0gYy5lbmQ7XG4gICAgfVxuICAgIHJldHVybiBgJHtjaHJ9OiR7c3RhcnR9Li4ke2VuZH1gXG59XG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdHJ1ZSBpZmYgdGhlIHR3byByYW5nZXMgb3ZlcmxhcCBieSBhdCBsZWFzdCAxLlxuLy8gRWFjaCByYW5nZSBtdXN0IGhhdmUgYSBjaHIsIHN0YXJ0LCBhbmQgZW5kLlxuLy9cbmZ1bmN0aW9uIG92ZXJsYXBzIChhLCBiKSB7XG4gICAgcmV0dXJuIGEuY2hyID09PSBiLmNociAmJiBhLnN0YXJ0IDw9IGIuZW5kICYmIGEuZW5kID49IGIuc3RhcnQ7XG59XG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEdpdmVuIHR3byByYW5nZXMsIGEgYW5kIGIsIHJldHVybnMgYSAtIGIuXG4vLyBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiAwLCAxIG9yIDIgbmV3IHJhbmdlcywgZGVwZW5kaW5nIG9uIGEgYW5kIGIuXG5mdW5jdGlvbiBzdWJ0cmFjdChhLCBiKSB7XG4gICAgaWYgKGEuY2hyICE9PSBiLmNocikgcmV0dXJuIFsgYSBdO1xuICAgIGxldCBhYkxlZnQgPSB7IGNocjphLmNociwgc3RhcnQ6YS5zdGFydCwgICAgICAgICAgICAgICAgICAgIGVuZDpNYXRoLm1pbihhLmVuZCwgYi5zdGFydC0xKSB9O1xuICAgIGxldCBhYlJpZ2h0PSB7IGNocjphLmNociwgc3RhcnQ6TWF0aC5tYXgoYS5zdGFydCwgYi5lbmQrMSksIGVuZDphLmVuZCB9O1xuICAgIGxldCBhbnMgPSBbIGFiTGVmdCwgYWJSaWdodCBdLmZpbHRlciggciA9PiByLnN0YXJ0IDw9IHIuZW5kICk7XG4gICAgcmV0dXJuIGFucztcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBDcmVhdGVzIGEgbGlzdCBvZiBrZXksdmFsdWUgcGFpcnMgZnJvbSB0aGUgb2JqLlxuZnVuY3Rpb24gb2JqMmxpc3QgKG8pIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMobykubWFwKGsgPT4gW2ssIG9ba11dKSAgICBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRydWUgaWZmIHRoZSB0d28gbGlzdHMgaGF2ZSB0aGUgc2FtZSBjb250ZW50cyAoYmFzZWQgb24gaW5kZXhPZikuXG4vLyBCcnV0ZSBmb3JjZSBhcHByb2FjaC4gQmUgY2FyZWZ1bCB3aGVyZSB5b3UgdXNlIHRoaXMuXG5mdW5jdGlvbiBzYW1lIChhbHN0LGJsc3QpIHtcbiAgIHJldHVybiBhbHN0Lmxlbmd0aCA9PT0gYmxzdC5sZW5ndGggJiYgXG4gICAgICAgYWxzdC5yZWR1Y2UoKGFjYyx4KSA9PiAoYWNjICYmIGJsc3QuaW5kZXhPZih4KT49MCksIHRydWUpO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQWRkIGJhc2ljIHNldCBvcHMgdG8gU2V0IHByb3RvdHlwZS5cbi8vIExpZnRlZCBmcm9tOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TZXRcblNldC5wcm90b3R5cGUudW5pb24gPSBmdW5jdGlvbihzZXRCKSB7XG4gICAgdmFyIHVuaW9uID0gbmV3IFNldCh0aGlzKTtcbiAgICBmb3IgKHZhciBlbGVtIG9mIHNldEIpIHtcbiAgICAgICAgdW5pb24uYWRkKGVsZW0pO1xuICAgIH1cbiAgICByZXR1cm4gdW5pb247XG59XG5cblNldC5wcm90b3R5cGUuaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oc2V0Qikge1xuICAgIHZhciBpbnRlcnNlY3Rpb24gPSBuZXcgU2V0KCk7XG4gICAgZm9yICh2YXIgZWxlbSBvZiBzZXRCKSB7XG4gICAgICAgIGlmICh0aGlzLmhhcyhlbGVtKSkge1xuICAgICAgICAgICAgaW50ZXJzZWN0aW9uLmFkZChlbGVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW50ZXJzZWN0aW9uO1xufVxuXG5TZXQucHJvdG90eXBlLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihzZXRCKSB7XG4gICAgdmFyIGRpZmZlcmVuY2UgPSBuZXcgU2V0KHRoaXMpO1xuICAgIGZvciAodmFyIGVsZW0gb2Ygc2V0Qikge1xuICAgICAgICBkaWZmZXJlbmNlLmRlbGV0ZShlbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpZmZlcmVuY2U7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGdldENhcmV0UmFuZ2UgKGVsdCkge1xuICAgIC8vIEZJWE1FOiBkb2VzIG5vdCB3b3JrIGZvciBJRVxuICAgIHJldHVybiBbZWx0LnNlbGVjdGlvblN0YXJ0LCBlbHQuc2VsZWN0aW9uRW5kXTtcbn1cbmZ1bmN0aW9uIHNldENhcmV0UmFuZ2UgKGVsdCwgcmFuZ2UpIHtcbiAgICAvLyBGSVhNRTogZG9lcyBub3Qgd29yayBmb3IgSUVcbiAgICBlbHQuc2VsZWN0aW9uU3RhcnQgPSByYW5nZVswXTtcbiAgICBlbHQuc2VsZWN0aW9uRW5kICAgPSByYW5nZVsxXTtcbn1cbmZ1bmN0aW9uIHNldENhcmV0UG9zaXRpb24gKGVsdCwgcG9zKSB7XG4gICAgc2V0Q2FyZXRSYW5nZShlbHQsIFtwb3MscG9zXSk7XG59XG5mdW5jdGlvbiBtb3ZlQ2FyZXRQb3NpdGlvbiAoZWx0LCBkZWx0YSkge1xuICAgIHNldENhcmV0UG9zaXRpb24oZWx0LCBnZXRDYXJldFBvc2l0aW9uKGVsdCkgKyBkZWx0YSk7XG59XG5mdW5jdGlvbiBnZXRDYXJldFBvc2l0aW9uIChlbHQpIHtcbiAgICBsZXQgciA9IGdldENhcmV0UmFuZ2UoZWx0KTtcbiAgICByZXR1cm4gclsxXTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRoZSBzY3JlZW4gY29vcmRpbmF0ZXMgb2YgYW4gU1ZHIHNoYXBlIChjaXJjbGUsIHJlY3QsIHBvbHlnb24sIGxpbmUpXG4vLyBhZnRlciBhbGwgdHJhbnNmb3JtcyBoYXZlIGJlZW4gYXBwbGllZC5cbi8vXG4vLyBBcmdzOlxuLy8gICAgIHNoYXBlIChub2RlKSBUaGUgU1ZHIHNoYXBlLlxuLy9cbi8vIFJldHVybnM6XG4vLyAgICAgVGhlIGZvcm0gb2YgdGhlIHJldHVybmVkIHZhbHVlIGRlcGVuZHMgb24gdGhlIHNoYXBlLlxuLy8gICAgIGNpcmNsZTogIHsgY3gsIGN5LCByIH1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgY2VudGVyIHBvaW50IGFuZCB0cmFuc2Zvcm1lZCByYWRpdXMgICAgICAgICBcbi8vICAgICBsaW5lOlx0eyB4MSwgeTEsIHgyLCB5MiB9XG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGVuZHBvaW50c1xuLy8gICAgIHJlY3Q6XHR7IHgsIHksIHdpZHRoLCBoZWlnaHQgfVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBjb3JuZXIgcG9pbnQgYW5kIHRyYW5zZm9ybWVkIHdpZHRoK2hlaWdodC5cbi8vICAgICBwb2x5Z29uOiBbIHt4LHl9LCB7eCx5fSAsIC4uLiBdXG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGxpc3Qgb2YgcG9pbnRzXG4vL1xuLy8gQWRhcHRlZCBmcm9tOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82ODU4NDc5L3JlY3RhbmdsZS1jb29yZGluYXRlcy1hZnRlci10cmFuc2Zvcm0/cnE9MVxuLy9cbmZ1bmN0aW9uIGNvb3Jkc0FmdGVyVHJhbnNmb3JtIChzaGFwZSkge1xuICAgIC8vXG4gICAgbGV0IGRzaGFwZSA9IGQzLnNlbGVjdChzaGFwZSk7XG4gICAgbGV0IHN2ZyA9IHNoYXBlLmNsb3Nlc3QoXCJzdmdcIik7XG4gICAgaWYgKCFzdmcpIHJldHVybiBudWxsO1xuICAgIGxldCBzdHlwZSA9IHNoYXBlLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgbWF0cml4ID0gc2hhcGUuZ2V0Q1RNKCk7XG4gICAgbGV0IHAgPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICBsZXQgcDI9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgIC8vXG4gICAgc3dpdGNoIChzdHlwZSkge1xuICAgIC8vXG4gICAgY2FzZSAnY2lyY2xlJzpcblx0cC54ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJjeFwiKSk7XG5cdHAueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiY3lcIikpO1xuXHRwMi54ID0gcC54ICsgcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInJcIikpO1xuXHRwMi55ID0gcC55O1xuXHRwICAgID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0cDIgICA9IHAyLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHQvLyBjYWxjIG5ldyByYWRpdXMgYXMgZGlzdGFuY2UgYmV0d2VlbiB0cmFuc2Zvcm1lZCBwb2ludHNcblx0bGV0IGR4ID0gTWF0aC5hYnMocC54IC0gcDIueCk7XG5cdGxldCBkeSA9IE1hdGguYWJzKHAueSAtIHAyLnkpO1xuXHRsZXQgciA9IE1hdGguc3FydChkeCpkeCArIGR5KmR5KTtcbiAgICAgICAgcmV0dXJuIHsgY3g6IHAueCwgY3k6IHAueSwgcjpyIH07XG4gICAgLy9cbiAgICBjYXNlICdyZWN0Jzpcblx0Ly8gRklYTUU6IGRvZXMgbm90IGhhbmRsZSByb3RhdGlvbnMgY29ycmVjdGx5LiBUbyBmaXgsIHRyYW5zbGF0ZSBjb3JuZXIgcG9pbnRzIHNlcGFyYXRlbHkgYW5kIHRoZW5cblx0Ly8gY2FsY3VsYXRlIHRoZSB0cmFuc2Zvcm1lZCB3aWR0aCBhbmQgaGVpZ2h0LiBBcyBhIGNvbnZlbmllbmNlIHRvIHRoZSB1c2VyLCBtaWdodCBiZSBuaWNlIHRvIHJldHVyblxuXHQvLyB0aGUgdHJhbnNmb3JtZWQgY29ybmVyIHBvaW50cyBhbmQgcG9zc2libHkgdGhlIGZpbmFsIGFuZ2xlIG9mIHJvdGF0aW9uLlxuXHRwLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInhcIikpO1xuXHRwLnkgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInlcIikpO1xuXHRwMi54ID0gcC54ICsgcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcIndpZHRoXCIpKTtcblx0cDIueSA9IHAueSArIHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJoZWlnaHRcIikpO1xuXHQvL1xuXHRwICA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdHAyID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdC8vXG4gICAgICAgIHJldHVybiB7IHg6IHAueCwgeTogcC55LCB3aWR0aDogcDIueC1wLngsIGhlaWdodDogcDIueS1wLnkgfTtcbiAgICAvL1xuICAgIGNhc2UgJ3BvbHlnb24nOlxuICAgICAgICBsZXQgcHRzID0gZHNoYXBlLmF0dHIoXCJwb2ludHNcIikudHJpbSgpLnNwbGl0KC8gKy8pO1xuXHRyZXR1cm4gcHRzLm1hcCggcHQgPT4ge1xuXHQgICAgbGV0IHh5ID0gcHQuc3BsaXQoXCIsXCIpO1xuXHQgICAgcC54ID0gcGFyc2VGbG9hdCh4eVswXSlcblx0ICAgIHAueSA9IHBhcnNlRmxvYXQoeHlbMV0pXG5cdCAgICBwID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0ICAgIHJldHVybiB7IHg6IHAueCwgeTogcC55IH07XG5cdH0pO1xuICAgIC8vXG4gICAgY2FzZSAnbGluZSc6XG5cdHAueCAgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcIngxXCIpKTtcblx0cC55ICAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieTFcIikpO1xuXHRwMi54ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ4MlwiKSk7XG5cdHAyLnkgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInkyXCIpKTtcblx0cCAgICAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRwMiAgICA9IHAyLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuICAgICAgICByZXR1cm4geyB4MTogcC54LCB5MTogcC55LCB4MjogcDIueCwgeDI6IHAyLnkgfTtcbiAgICAvL1xuICAgIC8vIEZJWE1FOiBhZGQgY2FzZSAndGV4dCdcbiAgICAvL1xuXG4gICAgZGVmYXVsdDpcblx0dGhyb3cgXCJVbnN1cHBvcnRlZCBub2RlIHR5cGU6IFwiICsgc3R5cGU7XG4gICAgfVxuXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmVtb3ZlcyBkdXBsaWNhdGVzIGZyb20gYSBsaXN0IHdoaWxlIHByZXNlcnZpbmcgbGlzdCBvcmRlci5cbi8vIEFyZ3M6XG4vLyAgICAgbHN0IChsaXN0KVxuLy8gUmV0dXJuczpcbi8vICAgICBBIHByb2Nlc3NlZCBjb3B5IG9mIGxzdCBpbiB3aGljaCBhbnkgZHVwcyBoYXZlIGJlZW4gcmVtb3ZlZC5cbmZ1bmN0aW9uIHJlbW92ZUR1cHMgKGxzdCkge1xuICAgIGxldCBsc3QyID0gW107XG4gICAgbGV0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgbHN0LmZvckVhY2goeCA9PiB7XG5cdC8vIHJlbW92ZSBkdXBzIHdoaWxlIHByZXNlcnZpbmcgb3JkZXJcblx0aWYgKHNlZW4uaGFzKHgpKSByZXR1cm47XG5cdGxzdDIucHVzaCh4KTtcblx0c2Vlbi5hZGQoeCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGxzdDI7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ2xpcHMgYSB2YWx1ZSB0byBhIHJhbmdlLlxuZnVuY3Rpb24gY2xpcCAobiwgbWluLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIG4pKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRoZSBnaXZlbiBiYXNlcGFpciBhbW91bnQgXCJwcmV0dHkgcHJpbnRlZFwiIHRvIGFuIGFwcG9ycHJpYXRlIHNjYWxlLCBwcmVjaXNpb24sIGFuZCB1bml0cy5cbi8vIEVnLCAgXG4vLyAgICAxMjcgPT4gJzEyNyBicCdcbi8vICAgIDEyMzQ1Njc4OSA9PiAnMTIzLjUgTWInXG5mdW5jdGlvbiBwcmV0dHlQcmludEJhc2VzIChuKSB7XG4gICAgbGV0IGFic24gPSBNYXRoLmFicyhuKTtcbiAgICBpZiAoYWJzbiA8IDEwMDApIHtcbiAgICAgICAgcmV0dXJuIGAke259IGJwYDtcbiAgICB9XG4gICAgaWYgKGFic24gPj0gMTAwMCAmJiBhYnNuIDwgMTAwMDAwMCkge1xuICAgICAgICByZXR1cm4gYCR7KG4vMTAwMCkudG9GaXhlZCgyKX0ga2JgO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGAkeyhuLzEwMDAwMDApLnRvRml4ZWQoMil9IE1iYDtcbiAgICB9XG4gICAgcmV0dXJuIFxufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB7XG4gICAgaW5pdE9wdExpc3QsXG4gICAgZDN0c3YsXG4gICAgZDNqc29uLFxuICAgIGQzdGV4dCxcbiAgICBkZWVwYyxcbiAgICBwYXJzZUNvb3JkcyxcbiAgICBmb3JtYXRDb29yZHMsXG4gICAgb3ZlcmxhcHMsXG4gICAgc3VidHJhY3QsXG4gICAgb2JqMmxpc3QsXG4gICAgc2FtZSxcbiAgICBnZXRDYXJldFJhbmdlLFxuICAgIHNldENhcmV0UmFuZ2UsXG4gICAgc2V0Q2FyZXRQb3NpdGlvbixcbiAgICBtb3ZlQ2FyZXRQb3NpdGlvbixcbiAgICBnZXRDYXJldFBvc2l0aW9uLFxuICAgIGNvb3Jkc0FmdGVyVHJhbnNmb3JtLFxuICAgIHJlbW92ZUR1cHMsXG4gICAgY2xpcCxcbiAgICBwcmV0dHlQcmludEJhc2VzXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvdXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBDb21wb25lbnQge1xuICAgIC8vIGFwcCAtIHRoZSBvd25pbmcgYXBwIG9iamVjdFxuICAgIC8vIGVsdCAtIGNvbnRhaW5lci4gbWF5IGJlIGEgc3RyaW5nIChzZWxlY3RvciksIGEgRE9NIG5vZGUsIG9yIGEgZDMgc2VsZWN0aW9uIG9mIDEgbm9kZS5cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcblx0dGhpcy5hcHAgPSBhcHBcblx0aWYgKHR5cGVvZihlbHQpID09PSBcInN0cmluZ1wiKVxuXHQgICAgLy8gZWx0IGlzIGEgQ1NTIHNlbGVjdG9yXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5zZWxlY3RBbGwpID09PSBcImZ1bmN0aW9uXCIpXG5cdCAgICAvLyBlbHQgaXMgYSBkMyBzZWxlY3Rpb25cblx0ICAgIHRoaXMucm9vdCA9IGVsdDtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSkgPT09IFwiZnVuY3Rpb25cIilcblx0ICAgIC8vIGVsdCBpcyBhIERPTSBub2RlXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRlIG1lXG4gICAgfVxufVxuXG5leHBvcnQgeyBDb21wb25lbnQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0NvbXBvbmVudC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgTUdWQXBwIDoge1xuXHRuYW1lIDpcdFwiTXVsdGlwbGUgR2Vub21lIFZpZXdlciAoTUdWKVwiLFxuXHR2ZXJzaW9uIDpcdFwiMS4wLjBcIiwgLy8gdXNlIHNlbWFudGljIHZlcnNpb25pbmdcbiAgICB9LFxuICAgIEF1eERhdGFNYW5hZ2VyIDoge1xuXHRtb3VzZW1pbmUgOiAndGVzdCcsXG5cdGFsbE1pbmVzIDoge1xuXHQgICAgJ2RldicgOiAnaHR0cDovL2JobWdpbW0tZGV2OjgwODAvbW91c2VtaW5lJyxcblx0ICAgICd0ZXN0JzogJ2h0dHA6Ly90ZXN0Lm1vdXNlbWluZS5vcmcvbW91c2VtaW5lJyxcblx0ICAgICdwdWJsaWMnIDogJ2h0dHA6Ly93d3cubW91c2VtaW5lLm9yZy9tb3VzZW1pbmUnLFxuXHR9XG4gICAgfSxcbiAgICBTVkdWaWV3IDoge1xuXHRvdXRlcldpZHRoIDogMTAwLFxuXHR3aWR0aCA6IDEwMCxcblx0b3V0ZXJIZWlnaHQgOiAxMDAsXG5cdGhlaWdodCA6IDEwMCxcblx0bWFyZ2lucyA6IHt0b3A6IDE4LCByaWdodDogMTIsIGJvdHRvbTogMTIsIGxlZnQ6IDEyfVxuICAgIH0sXG4gICAgWm9vbVZpZXcgOiB7XG5cdHRvcE9mZnNldCA6IDE1LFx0XHQvLyBZIG9mZnNldCB0byBmaXJzdCBzdHJpcFxuXHRmZWF0SGVpZ2h0IDogOCxcdFx0Ly8gaGVpZ2h0IG9mIGEgcmVjdGFuZ2xlIHJlcHJlc2VudGluZyBhIGZlYXR1cmVcblx0bGFuZUdhcCA6IDIsXHQgICAgICAgIC8vIHNwYWNlIGJldHdlZW4gc3dpbSBsYW5lc1xuXHRsYW5lSGVpZ2h0IDogMTAsXHQvLyA9PSBmZWF0SGVpZ2h0ICsgbGFuZUdhcFxuXHRtaW5MYW5lcyA6IDMsXHRcdC8vIG1pbmltdW0gbnVtYmVyIG9mIHN3aW0gbGFuZXMgKGVhY2ggc3RyYW5kKVxuXHRibG9ja0hlaWdodCA6IDYwLFx0Ly8gPT0gMiAqIG1pbkxhbmVzICogbGFuZUhlaWdodFxuXHRtaW5TdHJpcEhlaWdodCA6IDc1LCAgICAvLyBoZWlnaHQgcGVyIGdlbm9tZSBpbiB0aGUgem9vbSB2aWV3XG5cdHN0cmlwR2FwIDogMjAsXHQvLyBzcGFjZSBiZXR3ZWVuIHN0cmlwc1xuXHRtYXhTQmdhcCA6IDIwLFx0Ly8gbWF4IGdhcCBhbGxvd2VkIGJldHdlZW4gYmxvY2tzLlxuXHRkbW9kZSA6ICdjb21wYXJpc29uJywvLyBpbml0aWFsIGRyYXdpbmcgbW9kZS4gJ2NvbXBhcmlzb24nIG9yICdyZWZlcmVuY2UnXG5cdHdoZWVsVGhyZXNob2xkIDogMyxcdC8vIG1pbmltdW0gd2hlZWwgZGlzdGFuY2UgXG5cdGZlYXR1cmVEZXRhaWxUaHJlc2hvbGQgOiAyMDAwMDAwLCAvLyBpZiB3aWR0aCA8PSB0aHJlc2gsIGRyYXcgZmVhdHVyZSBkZXRhaWxzLlxuXHR3aGVlbENvbnRleHREZWxheSA6IDMwMCwgIC8vIG1zIGRlbGF5IGFmdGVyIGxhc3Qgd2hlZWwgZXZlbnQgYmVmb3JlIGNoYW5naW5nIGNvbnRleHRcbiAgICB9LFxuICAgIFF1ZXJ5TWFuYWdlciA6IHtcblx0c2VhcmNoVHlwZXMgOiBbe1xuXHQgICAgbWV0aG9kOiBcImZlYXR1cmVzQnlQaGVub3R5cGVcIixcblx0ICAgIGxhYmVsOiBcIi4uLmJ5IHBoZW5vdHlwZSBvciBkaXNlYXNlXCIsXG5cdCAgICB0ZW1wbGF0ZTogXCJcIixcblx0ICAgIHBsYWNlaG9sZGVyOiBcIlBoZW5vL2Rpc2Vhc2UgKE1QL0RPKSB0ZXJtIG9yIElEc1wiXG5cdH0se1xuXHQgICAgbWV0aG9kOiBcImZlYXR1cmVzQnlGdW5jdGlvblwiLFxuXHQgICAgbGFiZWw6IFwiLi4uYnkgY2VsbHVsYXIgZnVuY3Rpb25cIixcblx0ICAgIHRlbXBsYXRlOiBcIlwiLFxuXHQgICAgcGxhY2Vob2xkZXI6IFwiR2VuZSBPbnRvbG9neSAoR08pIHRlcm1zIG9yIElEc1wiXG5cdH0se1xuXHQgICAgbWV0aG9kOiBcImZlYXR1cmVzQnlQYXRod2F5XCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBwYXRod2F5XCIsXG5cdCAgICB0ZW1wbGF0ZTogXCJcIixcblx0ICAgIHBsYWNlaG9sZGVyOiBcIlJlYWN0b21lIHBhdGh3YXlzIG5hbWVzLCBJRHNcIlxuXHR9LHtcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5SWRcIixcblx0ICAgIGxhYmVsOiBcIi4uLmJ5IHN5bWJvbC9JRFwiLFxuXHQgICAgdGVtcGxhdGU6IFwiXCIsXG5cdCAgICBwbGFjZWhvbGRlcjogXCJNR0kgbmFtZXMsIHN5bm9ueW1zLCBldGMuXCJcblx0fV1cbiAgICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvY29uZmlnLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFN0b3JlLCBzZXQsIGdldCwgZGVsLCBjbGVhciwga2V5cyB9IGZyb20gJ2lkYi1rZXl2YWwnO1xuXG5jb25zdCBEQl9OQU1FX1BSRUZJWCA9ICdtZ3YtZGF0YWNhY2hlLSc7XG5cbmNsYXNzIEtleVN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvciAobmFtZSkge1xuXHR0cnkge1xuXHQgICAgdGhpcy5zdG9yZSA9IG5ldyBTdG9yZShEQl9OQU1FX1BSRUZJWCtuYW1lLCBuYW1lKTtcblx0ICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZTtcblx0ICAgIGNvbnNvbGUubG9nKGBLZXlTdG9yZTogJHtEQl9OQU1FX1BSRUZJWCtuYW1lfWApO1xuXHR9XG5cdGNhdGNoIChlcnIpIHtcblx0ICAgIHRoaXMuc3RvcmUgPSBudWxsO1xuXHQgICAgdGhpcy5kaXNhYmxlZCA9IHRydWU7XG5cdCAgICB0aGlzLm51bGxQID0gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuXHQgICAgY29uc29sZS5sb2coYEtleVN0b3JlOiBlcnJvciBpbiBjb25zdHJ1Y3RvcjogJHtlcnJ9IFxcbiBEaXNhYmxlZC5gKVxuXHR9XG4gICAgfVxuICAgIGdldCAoa2V5KSB7XG5cdGlmICh0aGlzLmRpc2FibGVkKSBcblx0ICAgIHJldHVybiB0aGlzLm51bGxQO1xuICAgICAgICByZXR1cm4gZ2V0KGtleSwgdGhpcy5zdG9yZSk7XG4gICAgfVxuICAgIGRlbCAoa2V5KSB7XG5cdGlmICh0aGlzLmRpc2FibGVkKSBcblx0ICAgIHJldHVybiB0aGlzLm51bGxQO1xuICAgICAgICByZXR1cm4gZGVsKGtleSwgdGhpcy5zdG9yZSk7XG4gICAgfVxuICAgIHNldCAoa2V5LCB2YWx1ZSkge1xuXHRpZiAodGhpcy5kaXNhYmxlZCkgXG5cdCAgICByZXR1cm4gdGhpcy5udWxsUDtcbiAgICAgICAgcmV0dXJuIHNldChrZXksIHZhbHVlLCB0aGlzLnN0b3JlKTtcbiAgICB9XG4gICAgcHV0IChrZXksIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldChrZXksIHZhbHVlKTtcbiAgICB9XG4gICAga2V5cyAoKSB7XG5cdGlmICh0aGlzLmRpc2FibGVkKSBcblx0ICAgIHJldHVybiB0aGlzLm51bGxQO1xuICAgICAgICByZXR1cm4ga2V5cyh0aGlzLnN0b3JlKTtcbiAgICB9XG4gICAgY29udGFpbnMgKGtleSkge1xuXHRpZiAodGhpcy5kaXNhYmxlZCkgXG5cdCAgICByZXR1cm4gdGhpcy5udWxsUDtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGtleSkudGhlbih4ID0+IHggIT09IHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIGNsZWFyICgpIHtcblx0aWYgKHRoaXMuZGlzYWJsZWQpIFxuXHQgICAgcmV0dXJuIHRoaXMubnVsbFA7XG4gICAgICAgIHJldHVybiBjbGVhcih0aGlzLnN0b3JlKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBLZXlTdG9yZSB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvS2V5U3RvcmUuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgR2Vub21pY0ludGVydmFsIHtcbiAgICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG4gICAgICAgIHRoaXMuZ2Vub21lICA9IGNmZy5nZW5vbWU7XG4gICAgICAgIHRoaXMuY2hyICAgICA9IGNmZy5jaHIgfHwgY2ZnLmNocm9tb3NvbWU7XG4gICAgICAgIHRoaXMuc3RhcnQgICA9IHBhcnNlSW50KGNmZy5zdGFydCk7XG4gICAgICAgIHRoaXMuZW5kICAgICA9IHBhcnNlSW50KGNmZy5lbmQpO1xuICAgICAgICB0aGlzLnN0cmFuZCAgPSBjZmcuc3RyYW5kO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgbGVuZ3RoICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5kIC0gdGhpcy5zdGFydCArIDE7XG4gICAgfVxufVxuXG5jbGFzcyBFeG9uIGV4dGVuZHMgR2Vub21pY0ludGVydmFsIHtcbiAgICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG4gICAgICAgIHN1cGVyKGNmZyk7XG5cdHRoaXMuSUQgPSBjZmcucHJpbWFyeUlkZW50aWZpZXI7XG5cdHRoaXMuY2hyO1xuICAgIH1cbn1cblxuY2xhc3MgRmVhdHVyZSBleHRlbmRzIEdlbm9taWNJbnRlcnZhbCB7XG4gICAgY29uc3RydWN0b3IgKGNmZykge1xuXHRzdXBlcihjZmcpO1xuICAgICAgICB0aGlzLnR5cGUgICAgPSBjZmcudHlwZTtcbiAgICAgICAgdGhpcy5iaW90eXBlID0gY2ZnLmJpb3R5cGU7XG4gICAgICAgIHRoaXMubWdwaWQgICA9IGNmZy5tZ3BpZCB8fCBjZmcuaWQ7XG4gICAgICAgIHRoaXMubWdpaWQgICA9IGNmZy5tZ2lpZDtcbiAgICAgICAgdGhpcy5zeW1ib2wgID0gY2ZnLnN5bWJvbDtcblx0dGhpcy5jb250aWcgID0gcGFyc2VJbnQoY2ZnLmNvbnRpZyk7XG5cdHRoaXMubGFuZSAgICA9IHBhcnNlSW50KGNmZy5sYW5lKTtcbiAgICAgICAgaWYgKHRoaXMubWdpaWQgPT09IFwiLlwiKSB0aGlzLm1naWlkID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuc3ltYm9sID09PSBcIi5cIikgdGhpcy5zeW1ib2wgPSBudWxsO1xuXHQvL1xuXHR0aGlzLmV4b25zID0gbnVsbDsgLy8gbGlzdCBvZiBleG9ucy4gTnVsbCBtZWFucyBub3QgeWV0IGxlYWRlZC5cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IElEICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdwaWQ7XG4gICAgfVxuICAgIGdldCBjYW5vbmljYWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZ2lpZDtcbiAgICB9XG4gICAgZ2V0IGlkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdpaWQgfHwgdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGxhYmVsICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sIHx8IHRoaXMubWdwaWQ7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldE11bmdlZFR5cGUgKCkge1xuXHRyZXR1cm4gdGhpcy50eXBlID09PSBcImdlbmVcIiA/XG5cdCAgICAodGhpcy5iaW90eXBlID09PSBcInByb3RlaW5fY29kaW5nXCIgfHwgdGhpcy5iaW90eXBlID09PSBcInByb3RlaW4gY29kaW5nIGdlbmVcIikgP1xuXHRcdFwicHJvdGVpbl9jb2RpbmdfZ2VuZVwiXG5cdFx0OlxuXHRcdHRoaXMuYmlvdHlwZS5pbmRleE9mKFwicHNldWRvZ2VuZVwiKSA+PSAwID9cblx0XHQgICAgXCJwc2V1ZG9nZW5lXCJcblx0XHQgICAgOlxuXHRcdCAgICAodGhpcy5iaW90eXBlLmluZGV4T2YoXCJSTkFcIikgPj0gMCB8fCB0aGlzLmJpb3R5cGUuaW5kZXhPZihcImFudGlzZW5zZVwiKSA+PSAwKSA/XG5cdFx0XHRcIm5jUk5BX2dlbmVcIlxuXHRcdFx0OlxuXHRcdFx0dGhpcy5iaW90eXBlLmluZGV4T2YoXCJzZWdtZW50XCIpID49IDAgP1xuXHRcdFx0ICAgIFwiZ2VuZV9zZWdtZW50XCJcblx0XHRcdCAgICA6XG5cdFx0XHQgICAgXCJvdGhlcl9nZW5lXCJcblx0ICAgIDpcblx0ICAgIHRoaXMudHlwZSA9PT0gXCJwc2V1ZG9nZW5lXCIgP1xuXHRcdFwicHNldWRvZ2VuZVwiXG5cdFx0OlxuXHRcdHRoaXMudHlwZS5pbmRleE9mKFwiZ2VuZV9zZWdtZW50XCIpID49IDAgP1xuXHRcdCAgICBcImdlbmVfc2VnbWVudFwiXG5cdFx0ICAgIDpcblx0XHQgICAgdGhpcy50eXBlLmluZGV4T2YoXCJSTkFcIikgPj0gMCA/XG5cdFx0XHRcIm5jUk5BX2dlbmVcIlxuXHRcdFx0OlxuXHRcdFx0dGhpcy50eXBlLmluZGV4T2YoXCJnZW5lXCIpID49IDAgP1xuXHRcdFx0ICAgIFwib3RoZXJfZ2VuZVwiXG5cdFx0XHQgICAgOlxuXHRcdFx0ICAgIFwib3RoZXJfZmVhdHVyZV90eXBlXCI7XG4gICAgfVxufVxuXG5leHBvcnQgeyBGZWF0dXJlIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUGFyc2VzIGEgbGlzdCBvcGVyYXRvciBleHByZXNzaW9uLCBlZyBcIihhICsgYikqYyAtIGRcIlxuLy8gUmV0dXJucyBhbiBhYnN0cmFjdCBzeW50YXggdHJlZS5cbi8vICAgICBMZWFmIG5vZGVzID0gbGlzdCBuYW1lcy4gVGhleSBhcmUgc2ltcGxlIHN0cmluZ3MuXG4vLyAgICAgSW50ZXJpb3Igbm9kZXMgPSBvcGVyYXRpb25zLiBUaGV5IGxvb2sgbGlrZToge2xlZnQ6bm9kZSwgb3A6c3RyaW5nLCByaWdodDpub2RlfVxuLy8gXG5jbGFzcyBMaXN0Rm9ybXVsYVBhcnNlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuXHR0aGlzLnJfb3AgICAgPSAvWystXS87XG5cdHRoaXMucl9vcDIgICA9IC9bKl0vO1xuXHR0aGlzLnJfb3BzICAgPSAvWygpKyotXS87XG5cdHRoaXMucl9pZGVudCA9IC9bYS16QS1aX11bYS16QS1aMC05X10qLztcblx0dGhpcy5yX3FzdHIgID0gL1wiW15cIl0qXCIvO1xuXHR0aGlzLnJlID0gbmV3IFJlZ0V4cChgKCR7dGhpcy5yX29wcy5zb3VyY2V9fCR7dGhpcy5yX3FzdHIuc291cmNlfXwke3RoaXMucl9pZGVudC5zb3VyY2V9KWAsICdnJyk7XG5cdC8vdGhpcy5yZSA9IC8oWygpKyotXXxcIlteXCJdK1wifFthLXpBLVpfXVthLXpBLVowLTlfXSopL2dcblx0dGhpcy5faW5pdChcIlwiKTtcbiAgICB9XG4gICAgX2luaXQgKHMpIHtcbiAgICAgICAgdGhpcy5leHByID0gcztcblx0dGhpcy50b2tlbnMgPSB0aGlzLmV4cHIubWF0Y2godGhpcy5yZSkgfHwgW107XG5cdHRoaXMuaSA9IDA7XG4gICAgfVxuICAgIF9wZWVrVG9rZW4oKSB7XG5cdHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmldO1xuICAgIH1cbiAgICBfbmV4dFRva2VuICgpIHtcblx0bGV0IHQ7XG4gICAgICAgIGlmICh0aGlzLmkgPCB0aGlzLnRva2Vucy5sZW5ndGgpIHtcblx0ICAgIHQgPSB0aGlzLnRva2Vuc1t0aGlzLmldO1xuXHQgICAgdGhpcy5pICs9IDE7XG5cdH1cblx0cmV0dXJuIHQ7XG4gICAgfVxuICAgIF9leHByICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl90ZXJtKCk7XG5cdGxldCBvcCA9IHRoaXMuX3BlZWtUb2tlbigpO1xuXHRpZiAob3AgPT09IFwiK1wiIHx8IG9wID09PSBcIi1cIikge1xuXHQgICAgdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBub2RlID0geyBsZWZ0Om5vZGUsIG9wOm9wPT09XCIrXCI/XCJ1bmlvblwiOlwiZGlmZmVyZW5jZVwiLCByaWdodDogdGhpcy5fZXhwcigpIH1cblx0ICAgIHJldHVybiBub2RlO1xuICAgICAgICB9ICAgICAgICAgICAgICAgXG5cdGVsc2UgaWYgKG9wID09PSBcIilcIiB8fCBvcCA9PT0gdW5kZWZpbmVkIHx8IG9wID09PSBudWxsKVxuXHQgICAgcmV0dXJuIG5vZGU7XG5cdGVsc2Vcblx0ICAgIHRoaXMuX2Vycm9yKFwiVU5JT04gb3IgSU5URVJTRUNUSU9OIG9yICkgb3IgTlVMTFwiLCBvcCk7XG4gICAgfVxuICAgIF90ZXJtICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl9mYWN0b3IoKTtcblx0bGV0IG9wID0gdGhpcy5fcGVla1Rva2VuKCk7XG5cdGlmIChvcCA9PT0gXCIqXCIpIHtcblx0ICAgIHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgbm9kZSA9IHsgbGVmdDpub2RlLCBvcDpcImludGVyc2VjdGlvblwiLCByaWdodDogdGhpcy5fZmFjdG9yKCkgfVxuXHR9XG5cdHJldHVybiBub2RlO1xuICAgIH1cbiAgICBfZmFjdG9yICgpIHtcbiAgICAgICAgbGV0IHQgPSB0aGlzLl9uZXh0VG9rZW4oKTtcblx0aWYgKHQgPT09IFwiKFwiKXtcblx0ICAgIGxldCBub2RlID0gdGhpcy5fZXhwcigpO1xuXHQgICAgbGV0IG50ID0gdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBpZiAobnQgIT09IFwiKVwiKSB0aGlzLl9lcnJvcihcIicpJ1wiLCBudCk7XG5cdCAgICByZXR1cm4gbm9kZTtcblx0fVxuXHRlbHNlIGlmICh0ICYmICh0LnN0YXJ0c1dpdGgoJ1wiJykpKSB7XG5cdCAgICByZXR1cm4gdC5zdWJzdHJpbmcoMSwgdC5sZW5ndGgtMSk7XG5cdH1cblx0ZWxzZSBpZiAodCAmJiB0Lm1hdGNoKC9bYS16QS1aX10vKSkge1xuXHQgICAgcmV0dXJuIHQ7XG5cdH1cblx0ZWxzZVxuXHQgICAgdGhpcy5fZXJyb3IoXCJFWFBSIG9yIElERU5UXCIsIHR8fFwiTlVMTFwiKTtcblx0cmV0dXJuIHQ7XG5cdCAgICBcbiAgICB9XG4gICAgX2Vycm9yIChleHBlY3RlZCwgc2F3KSB7XG4gICAgICAgIHRocm93IGBQYXJzZSBlcnJvcjogZXhwZWN0ZWQgJHtleHBlY3RlZH0gYnV0IHNhdyAke3Nhd30uYDtcbiAgICB9XG4gICAgLy8gUGFyc2VzIHRoZSBzdHJpbmcgYW5kIHJldHVybnMgdGhlIGFic3RyYWN0IHN5bnRheCB0cmVlLlxuICAgIC8vIFRocm93cyBhbiBleGNlcHRpb24gaWYgdGhlcmUgaXMgYSBzeW50YXggZXJyb3IuXG4gICAgcGFyc2UgKHMpIHtcblx0dGhpcy5faW5pdChzKTtcblx0cmV0dXJuIHRoaXMuX2V4cHIoKTtcbiAgICB9XG4gICAgLy8gcmV0dXJucyB0cnVlIGlmZiBzdHJpbmcgaXMgc3ludGFjdGljYWxseSB2YWxpZFxuICAgIGlzVmFsaWQgKHMpIHtcbiAgICAgICAgdHJ5IHtcblx0ICAgIHRoaXMucGFyc2Uocyk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fVxuXHRjYXRjaCAoZSkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEZvcm11bGFQYXJzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgU1ZHVmlldyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0LCBtYXJnaW5zLCByb3RhdGlvbiwgdHJhbnNsYXRpb24pIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuICAgICAgICB0aGlzLnN2ZyA9IHRoaXMucm9vdC5zZWxlY3QoXCJzdmdcIik7XG4gICAgICAgIHRoaXMuc3ZnTWFpbiA9IHRoaXMuc3ZnXG4gICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKSAgICAvLyB0aGUgbWFyZ2luLXRyYW5zbGF0ZWQgZ3JvdXBcbiAgICAgICAgICAgIC5hcHBlbmQoXCJnXCIpXHQgIC8vIG1haW4gZ3JvdXAgZm9yIHRoZSBkcmF3aW5nXG5cdCAgICAuYXR0cihcIm5hbWVcIixcInN2Z21haW5cIik7XG5cdGxldCBjID0gY29uZmlnLlNWR1ZpZXc7XG5cdHRoaXMub3V0ZXJXaWR0aCA9IGMub3V0ZXJXaWR0aDtcblx0dGhpcy53aWR0aCA9IGMud2lkdGg7XG5cdHRoaXMub3V0ZXJIZWlnaHQgPSBjLm91dGVySGVpZ2h0O1xuXHR0aGlzLmhlaWdodCA9IGMuaGVpZ2h0O1xuXHR0aGlzLm1hcmdpbnMgPSBPYmplY3QuYXNzaWduKHt9LCBjLm1hcmdpbnMpO1xuXHR0aGlzLnJvdGF0aW9uID0gMDtcblx0dGhpcy50cmFuc2xhdGlvbiA9IFswLDBdO1xuXHQvL1xuICAgICAgICB0aGlzLnNldEdlb20oe3dpZHRoLCBoZWlnaHQsIG1hcmdpbnMsIHJvdGF0aW9uLCB0cmFuc2xhdGlvbn0pO1xuICAgIH1cbiAgICBzZXRHZW9tIChjZmcpIHtcbiAgICAgICAgdGhpcy5vdXRlcldpZHRoICA9IGNmZy53aWR0aCAgICAgICB8fCB0aGlzLm91dGVyV2lkdGg7XG4gICAgICAgIHRoaXMub3V0ZXJIZWlnaHQgPSBjZmcuaGVpZ2h0ICAgICAgfHwgdGhpcy5vdXRlckhlaWdodDtcbiAgICAgICAgdGhpcy5tYXJnaW5zICAgICA9IGNmZy5tYXJnaW5zICAgICB8fCB0aGlzLm1hcmdpbnM7XG5cdHRoaXMucm90YXRpb24gICAgPSB0eXBlb2YoY2ZnLnJvdGF0aW9uKSA9PT0gXCJudW1iZXJcIiA/IGNmZy5yb3RhdGlvbiA6IHRoaXMucm90YXRpb247XG5cdHRoaXMudHJhbnNsYXRpb24gPSBjZmcudHJhbnNsYXRpb24gfHwgdGhpcy50cmFuc2xhdGlvbjtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy53aWR0aCAgPSB0aGlzLm91dGVyV2lkdGggIC0gdGhpcy5tYXJnaW5zLmxlZnQgLSB0aGlzLm1hcmdpbnMucmlnaHQ7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5vdXRlckhlaWdodCAtIHRoaXMubWFyZ2lucy50b3AgIC0gdGhpcy5tYXJnaW5zLmJvdHRvbTtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy5zdmcuYXR0cihcIndpZHRoXCIsIHRoaXMub3V0ZXJXaWR0aClcbiAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5vdXRlckhlaWdodClcbiAgICAgICAgICAgIC5zZWxlY3QoJ2dbbmFtZT1cInN2Z21haW5cIl0nKVxuICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7dGhpcy5tYXJnaW5zLmxlZnR9LCR7dGhpcy5tYXJnaW5zLnRvcH0pIHJvdGF0ZSgke3RoaXMucm90YXRpb259KSB0cmFuc2xhdGUoJHt0aGlzLnRyYW5zbGF0aW9uWzBdfSwke3RoaXMudHJhbnNsYXRpb25bMV19KWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2V0TWFyZ2lucyggdG0sIHJtLCBibSwgbG0gKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG5cdCAgICBybSA9IGJtID0gbG0gPSB0bTtcblx0fVxuXHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG5cdCAgICBibSA9IHRtO1xuXHQgICAgbG0gPSBybTtcblx0fVxuXHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSA0KVxuXHQgICAgdGhyb3cgXCJCYWQgYXJndW1lbnRzLlwiO1xuICAgICAgICAvL1xuXHR0aGlzLnNldEdlb20oe3RvcDogdG0sIHJpZ2h0OiBybSwgYm90dG9tOiBibSwgbGVmdDogbG19KTtcblx0Ly9cblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJvdGF0ZSAoZGVnKSB7XG4gICAgICAgIHRoaXMuc2V0R2VvbSh7cm90YXRpb246ZGVnfSk7XG5cdHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0cmFuc2xhdGUgKGR4LCBkeSkge1xuICAgICAgICB0aGlzLnNldEdlb20oe3RyYW5zbGF0aW9uOltkeCxkeV19KTtcblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICB0aGUgd2luZG93IHdpZHRoXG4gICAgZml0VG9XaWR0aCAod2lkdGgpIHtcbiAgICAgICAgbGV0IHIgPSB0aGlzLnN2Z1swXVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy5zZXRHZW9tKHt3aWR0aDogd2lkdGggLSByLnh9KVxuXHRyZXR1cm4gdGhpcztcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBTVkdWaWV3XG5cbmV4cG9ydCB7IFNWR1ZpZXcgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1NWR1ZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTUdWQXBwIH0gZnJvbSAnLi9NR1ZBcHAnO1xuaW1wb3J0IHsgcmVtb3ZlRHVwcyB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy9cbi8vIHBxc3RyaW5nID0gUGFyc2UgcXN0cmluZy4gUGFyc2VzIHRoZSBwYXJhbWV0ZXIgcG9ydGlvbiBvZiB0aGUgVVJMLlxuLy9cbmZ1bmN0aW9uIHBxc3RyaW5nIChxc3RyaW5nKSB7XG4gICAgLy9cbiAgICBsZXQgY2ZnID0ge307XG5cbiAgICAvLyBGSVhNRTogVVJMU2VhcmNoUGFyYW1zIEFQSSBpcyBub3Qgc3VwcG9ydGVkIGluIGFsbCBicm93c2Vycy5cbiAgICAvLyBPSyBmb3IgZGV2ZWxvcG1lbnQgYnV0IG5lZWQgYSBmYWxsYmFjayBldmVudHVhbGx5LlxuICAgIGxldCBwcm1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhxc3RyaW5nKTtcbiAgICBsZXQgZ2Vub21lcyA9IFtdO1xuXG4gICAgLy8gLS0tLS0gZ2Vub21lcyAtLS0tLS0tLS0tLS1cbiAgICBsZXQgcGdlbm9tZXMgPSBwcm1zLmdldChcImdlbm9tZXNcIikgfHwgXCJcIjtcbiAgICAvLyBGb3Igbm93LCBhbGxvdyBcImNvbXBzXCIgYXMgc3lub255bSBmb3IgXCJnZW5vbWVzXCIuIEV2ZW50dWFsbHksIGRvbid0IHN1cHBvcnQgXCJjb21wc1wiLlxuICAgIHBnZW5vbWVzID0gKHBnZW5vbWVzICsgIFwiIFwiICsgKHBybXMuZ2V0KFwiY29tcHNcIikgfHwgXCJcIikpO1xuICAgIC8vXG4gICAgcGdlbm9tZXMgPSByZW1vdmVEdXBzKHBnZW5vbWVzLnRyaW0oKS5zcGxpdCgvICsvKSk7XG4gICAgcGdlbm9tZXMubGVuZ3RoID4gMCAmJiAoY2ZnLmdlbm9tZXMgPSBwZ2Vub21lcyk7XG5cbiAgICAvLyAtLS0tLSByZWYgZ2Vub21lIC0tLS0tLS0tLS0tLVxuICAgIGxldCByZWYgPSBwcm1zLmdldChcInJlZlwiKTtcbiAgICByZWYgJiYgKGNmZy5yZWYgPSByZWYpO1xuXG4gICAgLy8gLS0tLS0gaGlnaGxpZ2h0IElEcyAtLS0tLS0tLS0tLS0tLVxuICAgIGxldCBobHMgPSBuZXcgU2V0KCk7XG4gICAgbGV0IGhsczAgPSBwcm1zLmdldChcImhpZ2hsaWdodFwiKTtcbiAgICBpZiAoaGxzMCkge1xuXHRobHMwID0gaGxzMC5yZXBsYWNlKC9bICxdKy9nLCAnICcpLnNwbGl0KCcgJykuZmlsdGVyKHg9PngpO1xuXHRobHMwLmxlbmd0aCA+IDAgJiYgKGNmZy5oaWdobGlnaHQgPSBobHMwKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLSBjb29yZGluYXRlcyAtLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgbGV0IGNociAgID0gcHJtcy5nZXQoXCJjaHJcIik7XG4gICAgbGV0IHN0YXJ0ID0gcHJtcy5nZXQoXCJzdGFydFwiKTtcbiAgICBsZXQgZW5kICAgPSBwcm1zLmdldChcImVuZFwiKTtcbiAgICBjaHIgICAmJiAoY2ZnLmNociA9IGNocik7XG4gICAgc3RhcnQgJiYgKGNmZy5zdGFydCA9IHBhcnNlSW50KHN0YXJ0KSk7XG4gICAgZW5kICAgJiYgKGNmZy5lbmQgPSBwYXJzZUludChlbmQpKTtcbiAgICAvL1xuICAgIGxldCBsYW5kbWFyayA9IHBybXMuZ2V0KFwibGFuZG1hcmtcIik7XG4gICAgbGV0IGZsYW5rICAgID0gcHJtcy5nZXQoXCJmbGFua1wiKTtcbiAgICBsZXQgbGVuZ3RoICAgPSBwcm1zLmdldChcImxlbmd0aFwiKTtcbiAgICBsZXQgZGVsdGEgICAgPSBwcm1zLmdldChcImRlbHRhXCIpO1xuICAgIGxhbmRtYXJrICYmIChjZmcubGFuZG1hcmsgPSBsYW5kbWFyayk7XG4gICAgZmxhbmsgICAgJiYgKGNmZy5mbGFuayA9IHBhcnNlSW50KGZsYW5rKSk7XG4gICAgbGVuZ3RoICAgJiYgKGNmZy5sZW5ndGggPSBwYXJzZUludChsZW5ndGgpKTtcbiAgICBkZWx0YSAgICAmJiAoY2ZnLmRlbHRhID0gcGFyc2VJbnQoZGVsdGEpKTtcbiAgICAvL1xuICAgIC8vIC0tLS0tIGRyYXdpbmcgbW9kZSAtLS0tLS0tLS0tLS0tXG4gICAgbGV0IGRtb2RlID0gcHJtcy5nZXQoXCJkbW9kZVwiKTtcbiAgICBkbW9kZSAmJiAoY2ZnLmRtb2RlID0gZG1vZGUpO1xuICAgIC8vXG4gICAgcmV0dXJuIGNmZztcbn1cblxuXG4vLyBUaGUgbWFpbiBwcm9ncmFtLCB3aGVyZWluIHRoZSBhcHAgaXMgY3JlYXRlZCBhbmQgd2lyZWQgdG8gdGhlIGJyb3dzZXIuIFxuLy9cbmZ1bmN0aW9uIF9fbWFpbl9fIChzZWxlY3Rvcikge1xuICAgIC8vIEJlaG9sZCwgdGhlIE1HViBhcHBsaWNhdGlvbiBvYmplY3QuLi5cbiAgICBsZXQgbWd2ID0gbnVsbDtcblxuICAgIC8vIENhbGxiYWNrIHRvIHBhc3MgaW50byB0aGUgYXBwIHRvIHJlZ2lzdGVyIGNoYW5nZXMgaW4gY29udGV4dC5cbiAgICAvLyBVc2VzIHRoZSBjdXJyZW50IGFwcCBjb250ZXh0IHRvIHNldCB0aGUgaGFzaCBwYXJ0IG9mIHRoZVxuICAgIC8vIGJyb3dzZXIncyBsb2NhdGlvbi4gVGhpcyBhbHNvIHJlZ2lzdGVycyB0aGUgY2hhbmdlIGluIFxuICAgIC8vIHRoZSBicm93c2VyIGhpc3RvcnkuXG4gICAgZnVuY3Rpb24gc2V0SGFzaCAoKSB7XG5cdGxldCBuZXdIYXNoID0gbWd2LmdldFBhcmFtU3RyaW5nKCk7XG5cdGlmICgnIycrbmV3SGFzaCA9PT0gd2luZG93LmxvY2F0aW9uLmhhc2gpXG5cdCAgICByZXR1cm47XG5cdC8vIHRlbXBvcmFyaWx5IGRpc2FibGUgcG9wc3RhdGUgaGFuZGxlclxuXHRsZXQgZiA9IHdpbmRvdy5vbnBvcHN0YXRlO1xuXHR3aW5kb3cub25wb3BzdGF0ZSA9IG51bGw7XG5cdC8vIG5vdyBzZXQgdGhlIGhhc2hcblx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSBuZXdIYXNoO1xuXHQvLyByZS1lbmFibGVcblx0d2luZG93Lm9ucG9wc3RhdGUgPSBmO1xuICAgIH1cbiAgICAvLyBIYW5kbGVyIGNhbGxlZCB3aGVuIHVzZXIgY2xpY2tzIHRoZSBicm93c2VyJ3MgYmFjayBvciBmb3J3YXJkIGJ1dHRvbnMuXG4gICAgLy8gU2V0cyB0aGUgYXBwJ3MgY29udGV4dCBiYXNlZCBvbiB0aGUgaGFzaCBwYXJ0IG9mIHRoZSBicm93c2VyJ3NcbiAgICAvLyBsb2NhdGlvbi5cbiAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdGxldCBjZmcgPSBwcXN0cmluZyhkb2N1bWVudC5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG5cdG1ndi5zZXRDb250ZXh0KGNmZywgdHJ1ZSk7XG4gICAgfTtcbiAgICAvLyBnZXQgaW5pdGlhbCBzZXQgb2YgY29udGV4dCBwYXJhbXMgXG4gICAgbGV0IHFzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSk7XG4gICAgbGV0IGNmZyA9IHBxc3RyaW5nKHFzdHJpbmcpO1xuICAgIGNmZy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNmZy5vbmNvbnRleHRjaGFuZ2UgPSBzZXRIYXNoO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBhcHBcbiAgICB3aW5kb3cubWd2ID0gbWd2ID0gbmV3IE1HVkFwcChzZWxlY3RvciwgY2ZnKTtcbiAgICBcbiAgICAvLyBoYW5kbGUgcmVzaXplIGV2ZW50c1xuICAgIHdpbmRvdy5vbnJlc2l6ZSA9ICgpID0+IHttZ3YucmVzaXplKCk7bWd2LnNldENvbnRleHQoe30pO31cbn1cblxuXG5fX21haW5fXyhcIiNtZ3ZcIik7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy92aWV3ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IENPTkZJRyAgICAgICAgICAgICAgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgcGFyc2VDb29yZHMsIGZvcm1hdENvb3JkcywgZDN0c3YsIGQzanNvbiwgaW5pdE9wdExpc3QsIHNhbWUsIGNsaXAgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEdlbm9tZSB9ICAgICAgICAgIGZyb20gJy4vR2Vub21lJztcbmltcG9ydCB7IENvbXBvbmVudCB9ICAgICAgIGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IEZlYXR1cmVNYW5hZ2VyIH0gIGZyb20gJy4vRmVhdHVyZU1hbmFnZXInO1xuaW1wb3J0IHsgUXVlcnlNYW5hZ2VyIH0gICAgZnJvbSAnLi9RdWVyeU1hbmFnZXInO1xuaW1wb3J0IHsgTGlzdE1hbmFnZXIgfSAgICAgZnJvbSAnLi9MaXN0TWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0RWRpdG9yIH0gICAgICBmcm9tICcuL0xpc3RFZGl0b3InO1xuaW1wb3J0IHsgRmFjZXRNYW5hZ2VyIH0gICAgZnJvbSAnLi9GYWNldE1hbmFnZXInO1xuaW1wb3J0IHsgQlRNYW5hZ2VyIH0gICAgICAgZnJvbSAnLi9CVE1hbmFnZXInO1xuaW1wb3J0IHsgR2Vub21lVmlldyB9ICAgICAgZnJvbSAnLi9HZW5vbWVWaWV3JztcbmltcG9ydCB7IEZlYXR1cmVEZXRhaWxzIH0gIGZyb20gJy4vRmVhdHVyZURldGFpbHMnO1xuaW1wb3J0IHsgWm9vbVZpZXcgfSAgICAgICAgZnJvbSAnLi9ab29tVmlldyc7XG5pbXBvcnQgeyBLZXlTdG9yZSB9ICAgICAgICBmcm9tICcuL0tleVN0b3JlJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBNR1ZBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChzZWxlY3RvciwgY2ZnKSB7XG5cdHN1cGVyKG51bGwsIHNlbGVjdG9yKTtcblx0dGhpcy5nbG9iYWxDb25maWcgPSBDT05GSUc7XG5cdGNvbnNvbGUubG9nKENPTkZJRyk7XG5cdHRoaXMuYXBwID0gdGhpcztcblx0dGhpcy5uYW1lID0gQ09ORklHLk1HVkFwcC5uYW1lO1xuXHR0aGlzLnZlcnNpb24gPSBDT05GSUcuTUdWQXBwLnZlcnNpb247XG5cdC8vXG5cdHRoaXMuaW5pdGlhbENmZyA9IGNmZztcblx0Ly9cblx0dGhpcy5jb250ZXh0Q2hhbmdlZCA9IChjZmcub25jb250ZXh0Y2hhbmdlIHx8IGZ1bmN0aW9uKCl7fSk7XG5cdC8vXG5cdHRoaXMubmFtZTJnZW5vbWUgPSB7fTsgIC8vIG1hcCBmcm9tIGdlbm9tZSBuYW1lIC0+IGdlbm9tZSBkYXRhIG9ialxuXHR0aGlzLmxhYmVsMmdlbm9tZSA9IHt9OyAvLyBtYXAgZnJvbSBnZW5vbWUgbGFiZWwgLT4gZ2Vub21lIGRhdGEgb2JqXG5cdHRoaXMubmwyZ2Vub21lID0ge307ICAgIC8vIGNvbWJpbmVzIGluZGV4ZXNcblx0Ly9cblx0dGhpcy5hbGxHZW5vbWVzID0gW107ICAgLy8gbGlzdCBvZiBhbGwgYXZhaWxhYmxlIGdlbm9tZXNcblx0dGhpcy5yR2Vub21lID0gbnVsbDsgICAgLy8gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZVxuXHR0aGlzLmNHZW5vbWVzID0gW107ICAgICAvLyBjdXJyZW50IGNvbXBhcmlzb24gZ2Vub21lcyAockdlbm9tZSBpcyAqbm90KiBpbmNsdWRlZCkuXG5cdHRoaXMudkdlbm9tZXMgPSBbXTtcdC8vIGxpc3Qgb2YgYWxsIGN1cnJlbnR5IHZpZXdlZCBnZW5vbWVzIChyZWYrY29tcHMpIGluIFktb3JkZXIuXG5cdC8vXG5cdHRoaXMuZHVyID0gMjUwOyAgICAgICAgIC8vIGFuaW1hdGlvbiBkdXJhdGlvbiwgaW4gbXNcblx0dGhpcy5kZWZhdWx0Wm9vbSA9IDI7XHQvLyBtdWx0aXBsaWVyIG9mIGN1cnJlbnQgcmFuZ2Ugd2lkdGguIE11c3QgYmUgPj0gMS4gMSA9PSBubyB6b29tLlxuXHRcdFx0XHQvLyAoem9vbWluZyBpbiB1c2VzIDEvdGhpcyBhbW91bnQpXG5cdHRoaXMuZGVmYXVsdFBhbiAgPSAwLjE1Oy8vIGZyYWN0aW9uIG9mIGN1cnJlbnQgcmFuZ2Ugd2lkdGhcblx0dGhpcy5jdXJyTGlzdEluZGV4ID0ge307XG5cdHRoaXMuY3Vyckxpc3RDb3VudGVyID0gMDtcblxuXG5cdC8vIENvb3JkaW5hdGVzIG1heSBiZSBzcGVjaWZpZWQgaW4gb25lIG9mIHR3byB3YXlzOiBtYXBwZWQgb3IgbGFuZG1hcmsuIFxuXHQvLyBNYXBwZWQgY29vcmRpbmF0ZXMgYXJlIHNwZWNpZmllZCBhcyBjaHJvbW9zb21lK3N0YXJ0K2VuZC4gVGhpcyBjb29yZGluYXRlIHJhbmdlIGlzIGRlZmluZWQgcmVsYXRpdmUgdG8gXG5cdC8vIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBnZW5vbWUsIGFuZCBpcyBtYXBwZWQgdG8gdGhlIGNvcnJlc3BvbmRpbmcgcmFuZ2UocykgaW4gZWFjaCBjb21wYXJpc29uIGdlbm9tZS5cblx0Ly8gTGFuZG1hcmsgY29vcmRpbmF0ZXMgYXJlIHNwZWNpZmllZCBhcyBsYW5kbWFyaytbZmxhbmt8d2lkdGhdK2RlbHRhLiBUaGUgbGFuZG1hcmsgaXMgbG9va2VkIHVwIGluIGVhY2ggXG5cdC8vIGdlbm9tZS4gSXRzIGNvb3JkaW5hdGVzLCBjb21iaW5lZCB3aXRoIGZsYW5rfGxlbmd0aCBhbmQgZGVsdGEsIGRldGVybWluZSB0aGUgYWJzb2x1dGUgY29vcmRpbmF0ZSByYW5nZVxuXHQvLyBpbiB0aGF0IGdlbm9tZS4gSWYgdGhlIGxhbmRtYXJrIGRvZXMgbm90IGV4aXN0IGluIGEgZ2l2ZW4gZ2Vub21lLCB0aGVuIG1hcHBlZCBjb29yZGluYXRlIGFyZSB1c2VkLlxuXHQvLyBcblx0dGhpcy5jbW9kZSA9ICdtYXBwZWQnIC8vICdtYXBwZWQnIG9yICdsYW5kbWFyaydcblx0dGhpcy5jb29yZHMgPSB7IGNocjogJzEnLCBzdGFydDogMTAwMDAwMCwgZW5kOiAxMDAwMDAwMCB9OyAgLy8gbWFwcGVkXG5cdHRoaXMubGNvb3JkcyA9IHsgbGFuZG1hcms6ICdQYXg2JywgZmxhbms6IDUwMDAwMCwgZGVsdGE6MCB9Oy8vIGxhbmRtYXJrXG5cblx0dGhpcy5pbml0RG9tKCk7XG5cblx0Ly9cblx0Ly9cblx0dGhpcy5nZW5vbWVWaWV3ID0gbmV3IEdlbm9tZVZpZXcodGhpcywgJyNnZW5vbWVWaWV3JywgODAwLCAyNTApO1xuXHR0aGlzLnpvb21WaWV3ICAgPSBuZXcgWm9vbVZpZXcgICh0aGlzLCAnI3pvb21WaWV3JywgODAwLCAyNTAsIHRoaXMuY29vcmRzKTtcblx0dGhpcy5yZXNpemUoKTtcbiAgICAgICAgLy9cblx0dGhpcy5mZWF0dXJlRGV0YWlscyA9IG5ldyBGZWF0dXJlRGV0YWlscyh0aGlzLCAnI2ZlYXR1cmVEZXRhaWxzJyk7XG5cblx0Ly8gQ2F0ZWdvcmljYWwgY29sb3Igc2NhbGUgZm9yIGZlYXR1cmUgdHlwZXNcblx0dGhpcy5jc2NhbGUgPSBkMy5zY2FsZS5jYXRlZ29yeTEwKCkuZG9tYWluKFtcblx0ICAgICdwcm90ZWluX2NvZGluZ19nZW5lJyxcblx0ICAgICdwc2V1ZG9nZW5lJyxcblx0ICAgICduY1JOQV9nZW5lJyxcblx0ICAgICdnZW5lX3NlZ21lbnQnLFxuXHQgICAgJ290aGVyX2dlbmUnLFxuXHQgICAgJ290aGVyX2ZlYXR1cmVfdHlwZSdcblx0XSk7XG5cdC8vXG5cdC8vXG5cdHRoaXMubGlzdE1hbmFnZXIgICAgPSBuZXcgTGlzdE1hbmFnZXIodGhpcywgXCIjbXlsaXN0c1wiKTtcblx0dGhpcy5saXN0TWFuYWdlci5yZWFkeS50aGVuKCAoKSA9PiB0aGlzLmxpc3RNYW5hZ2VyLnVwZGF0ZSgpICk7XG5cdC8vXG5cdHRoaXMubGlzdEVkaXRvciA9IG5ldyBMaXN0RWRpdG9yKHRoaXMsICcjbGlzdGVkaXRvcicpO1xuXHQvL1xuXHR0aGlzLnF1ZXJ5TWFuYWdlciA9IG5ldyBRdWVyeU1hbmFnZXIodGhpcywgXCIjZmluZEdlbmVzQm94XCIpO1xuXHQvLyBcblx0dGhpcy50cmFuc2xhdG9yICAgICA9IG5ldyBCVE1hbmFnZXIodGhpcyk7XG5cdHRoaXMuZmVhdHVyZU1hbmFnZXIgPSBuZXcgRmVhdHVyZU1hbmFnZXIodGhpcyk7XG5cdC8vXG5cdHRoaXMudXNlclByZWZzU3RvcmUgPSBuZXcgS2V5U3RvcmUoXCJ1c2VyLXByZWZlcmVuY2VzXCIpO1xuXHRcblx0Ly9cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBGYWNldHNcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvL1xuXHR0aGlzLmZhY2V0TWFuYWdlciA9IG5ldyBGYWNldE1hbmFnZXIodGhpcyk7XG5cdGxldCBzZWxmID0gdGhpcztcblxuXHQvLyBGZWF0dXJlLXR5cGUgZmFjZXRcblx0bGV0IGZ0RmFjZXQgID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJGZWF0dXJlVHlwZVwiLCBmID0+IGYuZ2V0TXVuZ2VkVHlwZSgpKTtcblx0dGhpcy5pbml0RmVhdFR5cGVDb250cm9sKGZ0RmFjZXQpO1xuXG5cdC8vIEhhcy1NR0ktaWQgZmFjZXRcblx0bGV0IG1naUZhY2V0ID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJIYXNDYW5vbmljYWxJZFwiLCAgICBmID0+IGYuY2Fub25pY2FsICA/IFwieWVzXCIgOiBcIm5vXCIgKTtcblx0ZDMuc2VsZWN0QWxsKCdpbnB1dFtuYW1lPVwibWdpRmFjZXRcIl0nKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpe1xuXHQgICAgbWdpRmFjZXQuc2V0VmFsdWVzKHRoaXMudmFsdWUgPT09IFwiXCIgPyBbXSA6IFt0aGlzLnZhbHVlXSk7XG5cdCAgICBzZWxmLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9KTtcblxuXHQvLyBJcy1pbi1jdXJyZW50LWxpc3QgZmFjZXRcblx0bGV0IGluQ3Vyckxpc3RGYWNldCA9IHRoaXMuZmFjZXRNYW5hZ2VyLmFkZEZhY2V0KFwiSW5DdXJyTGlzdFwiLCBmID0+IHtcblx0ICAgIHJldHVybiB0aGlzLmN1cnJMaXN0SW5kZXhbZi5pZF0gPyBcInllc1wiIDogXCJub1wiO1xuXHR9KTtcblx0ZDMuc2VsZWN0QWxsKCdpbnB1dFtuYW1lPVwiaW5DdXJyTGlzdEZhY2V0XCJdJykub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKXtcblx0ICAgIGluQ3Vyckxpc3RGYWNldC5zZXRWYWx1ZXModGhpcy52YWx1ZSA9PT0gXCJcIiA/IFtdIDogW3RoaXMudmFsdWVdKTtcblx0ICAgIHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXG5cdC8vIElzLWhpZ2hsaWdodGVkIGZhY2V0XG5cdGxldCBoaUZhY2V0ID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJJc0hpXCIsIGYgPT4ge1xuXHQgICAgbGV0IGlzaGkgPSB0aGlzLnpvb21WaWV3LmhpRmVhdHNbZi5pZF0gfHwgdGhpcy5jdXJyTGlzdEluZGV4W2YuaWRdO1xuXHQgICAgcmV0dXJuIGlzaGkgPyBcInllc1wiIDogXCJub1wiO1xuXHR9KTtcblx0ZDMuc2VsZWN0QWxsKCdpbnB1dFtuYW1lPVwiaGlGYWNldFwiXScpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCl7XG5cdCAgICBoaUZhY2V0LnNldFZhbHVlcyh0aGlzLnZhbHVlID09PSBcIlwiID8gW10gOiBbdGhpcy52YWx1ZV0pO1xuXHQgICAgc2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0fSk7XG5cblxuXHQvL1xuXHR0aGlzLnNldFVJRnJvbVByZWZzKCk7XG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdC8vIFRoaW5ncyBhcmUgYWxsIHdpcmVkIHVwLiBOb3cgbGV0J3MgZ2V0IHNvbWUgZGF0YS5cblx0Ly8gU3RhcnQgd2l0aCB0aGUgZmlsZSBvZiBhbGwgdGhlIGdlbm9tZXMuXG5cdHRoaXMuY2hlY2tUaW1lc3RhbXAoKS50aGVuKCAoKSA9PiB7XG5cdCAgICBkM3RzdihcIi4vZGF0YS9nZW5vbWVkYXRhL2FsbEdlbm9tZXMudHN2XCIpLnRoZW4oZGF0YSA9PiB7XG5cdFx0Ly8gY3JlYXRlIEdlbm9tZSBvYmplY3RzIGZyb20gdGhlIHJhdyBkYXRhLlxuXHRcdHRoaXMuYWxsR2Vub21lcyAgID0gZGF0YS5tYXAoZyA9PiBuZXcgR2Vub21lKGcpKTtcblx0XHR0aGlzLmFsbEdlbm9tZXMuc29ydCggKGEsYikgPT4ge1xuXHRcdCAgICByZXR1cm4gYS5sYWJlbCA8IGIubGFiZWwgPyAtMSA6IGEubGFiZWwgPiBiLmxhYmVsID8gKzEgOiAwO1xuXHRcdH0pO1xuXHRcdC8vXG5cdFx0Ly8gYnVpbGQgYSBuYW1lLT5HZW5vbWUgaW5kZXhcblx0XHR0aGlzLm5sMmdlbm9tZSA9IHt9OyAvLyBhbHNvIGJ1aWxkIHRoZSBjb21iaW5lZCBsaXN0IGF0IHRoZSBzYW1lIHRpbWUuLi5cblx0XHR0aGlzLm5hbWUyZ2Vub21lICA9IHRoaXMuYWxsR2Vub21lc1xuXHRcdCAgICAucmVkdWNlKChhY2MsZykgPT4geyB0aGlzLm5sMmdlbm9tZVtnLm5hbWVdID0gYWNjW2cubmFtZV0gPSBnOyByZXR1cm4gYWNjOyB9LCB7fSk7XG5cdFx0Ly8gYnVpbGQgYSBsYWJlbC0+R2Vub21lIGluZGV4XG5cdFx0dGhpcy5sYWJlbDJnZW5vbWUgPSB0aGlzLmFsbEdlbm9tZXNcblx0XHQgICAgLnJlZHVjZSgoYWNjLGcpID0+IHsgdGhpcy5ubDJnZW5vbWVbZy5sYWJlbF0gPSBhY2NbZy5sYWJlbF0gPSBnOyByZXR1cm4gYWNjOyB9LCB7fSk7XG5cblx0XHQvLyBOb3cgcHJlbG9hZCBhbGwgdGhlIGNocm9tb3NvbWUgZmlsZXMgZm9yIGFsbCB0aGUgZ2Vub21lc1xuXHRcdGxldCBjZHBzID0gdGhpcy5hbGxHZW5vbWVzLm1hcChnID0+IGQzdHN2KGAuL2RhdGEvZ2Vub21lZGF0YS8ke2cubmFtZX0tY2hyb21vc29tZXMudHN2YCkpO1xuXHRcdHJldHVybiBQcm9taXNlLmFsbChjZHBzKTtcblx0ICAgIH0pXG5cdCAgICAudGhlbiggZGF0YSA9PiB7XG5cblx0XHQvL1xuXHRcdHRoaXMucHJvY2Vzc0Nocm9tb3NvbWVzKGRhdGEpO1xuXHRcdHRoaXMuaW5pdERvbVBhcnQyKCk7XG5cdFx0Ly9cblx0XHQvLyBGSU5BTExZISBXZSBhcmUgcmVhZHkgdG8gZHJhdyB0aGUgaW5pdGlhbCBzY2VuZS5cblx0XHR0aGlzLnNldENvbnRleHQodGhpcy5pbml0aWFsQ2ZnKTtcblxuXHQgICAgfSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjaGVja1RpbWVzdGFtcCAoKSB7XG4gICAgICAgIGxldCB0U3RvcmUgPSBuZXcgS2V5U3RvcmUoJ3RpbWVzdGFtcCcpO1xuXHRyZXR1cm4gZDN0c3YoJy4vZGF0YS9nZW5vbWVkYXRhL1RJTUVTVEFNUC50c3YnKS50aGVuKCB0cyA9PiB7XG5cdCAgICBsZXQgbmV3VGltZVN0YW1wID0gIG5ldyBEYXRlKERhdGUucGFyc2UodHNbMF0uVElNRVNUQU1QKSk7XG5cdCAgICByZXR1cm4gdFN0b3JlLmdldCgnVElNRVNUQU1QJykudGhlbiggb2xkVGltZVN0YW1wID0+IHtcblx0ICAgICAgICBpZiAoIW9sZFRpbWVTdGFtcCB8fCBuZXdUaW1lU3RhbXAgPiBvbGRUaW1lU3RhbXApIHtcblx0XHQgICAgdFN0b3JlLnB1dCgnVElNRVNUQU1QJyxuZXdUaW1lU3RhbXApO1xuXHRcdCAgICByZXR1cm4gdGhpcy5jbGVhckNhY2hlZERhdGEoKTtcblx0XHR9XG5cdCAgICB9KVxuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gXG4gICAgaW5pdERvbSAoKSB7XG5cdHNlbGYgPSB0aGlzO1xuXHR0aGlzLnJvb3QgPSBkMy5zZWxlY3QoJyNtZ3YnKTtcblx0XG5cdGQzLnNlbGVjdCgnI2hlYWRlciBsYWJlbCcpXG5cdCAgICAudGV4dCh0aGlzLm5hbWUpXG5cdCAgICA7XG5cdGQzLnNlbGVjdCgnI3ZlcnNpb24nKVxuXHQgICAgLnRleHQoJ3ZlcnNpb24gJyArIHRoaXMudmVyc2lvbilcblx0ICAgIDtcblx0Ly9cblx0Ly8gVE9ETzogcmVmYWN0b3IgcGFnZWJveCwgZHJhZ2dhYmxlLCBhbmQgZnJpZW5kcyBpbnRvIGEgZnJhbWV3b3JrIG1vZHVsZSxcblx0Ly8gXG5cdHRoaXMucGJEcmFnZ2VyID0gdGhpcy5nZXRDb250ZW50RHJhZ2dlcigpO1xuXHQvLyBBZGQgYnVzeSBpY29uLCBjdXJyZW50bHkgaW52aXNpYmUuXG5cdGQzLnNlbGVjdEFsbCgnLnBhZ2Vib3gnKVxuXHQgICAgLmFwcGVuZCgnaScpXG5cdFx0LmF0dHIoJ2NsYXNzJywnbWF0ZXJpYWwtaWNvbnMgYnVzeSByb3RhdGluZycpXG5cdCAgICA7XG5cdC8vXG5cdC8vIElmIGEgcGFnZWJveCBoYXMgdGl0bGUgdGV4dCwgYXBwZW5kIGEgaGVscCBpY29uIHRvIHRoZSBsYWJlbCBhbmQgbW92ZSB0aGUgdGV4dCB0aGVyZVxuXHRkMy5zZWxlY3RBbGwoJy5wYWdlYm94W3RpdGxlXScpXG5cdCAgICAuYXBwZW5kKCdpJylcblx0ICAgICAgICAuYXR0cignY2xhc3MnLCAnbWF0ZXJpYWwtaWNvbnMgYnV0dG9uIGhlbHAnKVxuXHQgICAgICAgIC5hdHRyKCd0aXRsZScsIGZ1bmN0aW9uKCl7XG5cdFx0ICAgIGxldCBwID0gZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSk7XG5cdFx0ICAgIGxldCB0ID0gcC5hdHRyKCd0aXRsZScpO1xuXHRcdCAgICBwLmF0dHIoJ3RpdGxlJywgbnVsbCk7XG5cdFx0ICAgIHJldHVybiB0O1xuXHRcdH0pXG5cdFx0Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdCAgICBzZWxmLnNob3dTdGF0dXMoZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ3RpdGxlJyksIGQzLmV2ZW50LmNsaWVudFgsIGQzLmV2ZW50LmNsaWVudFkpO1xuXHRcdH0pXG5cdFx0O1xuXHQvL1xuXHRkMy5zZWxlY3RBbGwoJy5jbG9zYWJsZScpXG5cdCAgICAuYXBwZW5kKCdpJylcblx0XHQuYXR0cignY2xhc3MnLCdtYXRlcmlhbC1pY29ucyBidXR0b24gY2xvc2UnKVxuXHRcdC5hdHRyKCd0aXRsZScsJ0NsaWNrIHRvIG9wZW4vY2xvc2UuJylcblx0XHQub24oJ2NsaWNrLmRlZmF1bHQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0ICAgIGxldCBwID0gZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSk7XG5cdFx0ICAgIHAuY2xhc3NlZCgnY2xvc2VkJywgISBwLmNsYXNzZWQoJ2Nsb3NlZCcpKTtcblx0XHQgICAgZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ3RpdGxlJywnQ2xpY2sgdG8gJyArICAocC5jbGFzc2VkKCdjbG9zZWQnKSA/ICdvcGVuJyA6ICdjbG9zZScpICsgJy4nKVxuXHRcdCAgICBzZWxmLnNldFByZWZzRnJvbVVJKCk7XG5cdFx0fSk7XG5cdGQzLnNlbGVjdEFsbCgnLmNvbnRlbnQtZHJhZ2dhYmxlID4gKicpXG5cdCAgICAuYXBwZW5kKCdpJylcblx0XHQuYXR0cigndGl0bGUnLCdEcmFnIHVwL2Rvd24gdG8gcmVwb3NpdGlvbi4nKVxuXHRcdC5hdHRyKCdjbGFzcycsJ21hdGVyaWFsLWljb25zIGJ1dHRvbiBkcmFnaGFuZGxlJylcblx0XHQub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbigpe1xuXHRcdCAgICAvLyBBdHRhY2ggdGhlIGRyYWcgYmVoYXZpb3Igd2hlbiB0aGUgdXNlciBtb3VzZXMgb3ZlciB0aGUgZHJhZyBoYW5kbGUsIGFuZCByZW1vdmUgdGhlIGJlaGF2aW9yXG5cdFx0ICAgIC8vIHdoZW4gdXNlciBtb3VzZXMgb3V0LiBXaHkgZG8gaXQgdGhpcyB3YXk/IEJlY2F1c2UgaWYgdGhlIGRyYWcgYmVoYXZpb3Igc3RheXMgb24gYWxsIHRoZSB0aW1lLFxuXHRcdCAgICAvLyB0aGUgdXNlciBjYW5ub3Qgc2VsZWN0IGFueSB0ZXh0IHdpdGhpbiB0aGUgYm94LlxuXHRcdCAgICBsZXQgcGIgPSB0aGlzLmNsb3Nlc3QoJy5wYWdlYm94Jyk7XG5cdFx0ICAgIGlmICghcGIpIHJldHVybjtcblx0XHQgICAgZDMuc2VsZWN0KHBiKS5jYWxsKHNlbGYucGJEcmFnZ2VyKTtcblx0XHR9KVxuXHRcdC5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCl7XG5cdFx0ICAgIGxldCBwYiA9IHRoaXMuY2xvc2VzdCgnLnBhZ2Vib3gnKTtcblx0XHQgICAgaWYgKCFwYikgcmV0dXJuO1xuXHRcdCAgICBkMy5zZWxlY3QocGIpLm9uKCcuZHJhZycsbnVsbCk7XG5cdFx0fSk7XG5cblx0Ly8gXG4gICAgICAgIGQzLnNlbGVjdCgnI3N0YXR1c01lc3NhZ2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHsgdGhpcy5zaG93U3RhdHVzKGZhbHNlKTsgfSk7XG5cdFxuXHQvL1xuXHQvLyBCdXR0b246IEdlYXIgaWNvbiB0byBzaG93L2hpZGUgbGVmdCBjb2x1bW5cblx0ZDMuc2VsZWN0KFwiI2hlYWRlciA+IC5nZWFyLmJ1dHRvblwiKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHQgICAgICAgIGxldCBsYyA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwibGVmdGNvbHVtblwiXScpO1xuXHRcdGxjLmNsYXNzZWQoXCJjbG9zZWRcIiwgKCkgPT4gISBsYy5jbGFzc2VkKFwiY2xvc2VkXCIpKTtcblx0XHR3aW5kb3cuc2V0VGltZW91dCgoKT0+e1xuXHRcdCAgICB0aGlzLnJlc2l6ZSgpXG5cdFx0ICAgIHRoaXMuc2V0Q29udGV4dCh7fSk7XG5cdFx0ICAgIHRoaXMuc2V0UHJlZnNGcm9tVUkoKTtcblx0XHR9LCAyNTApO1xuXHQgICAgfSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERvbSBpbml0aWFsaXp0aW9uIHRoYXQgbXVzdCB3YWl0IHVudGlsIGFmdGVyIGdlbm9tZSBtZXRhIGRhdGEgaXMgbG9hZGVkLlxuICAgIGluaXREb21QYXJ0MiAoKSB7XG5cdC8vXG5cdGxldCBjZmcgPSB0aGlzLnNhbml0aXplQ2ZnKHRoaXMuaW5pdGlhbENmZyk7XG5cdGxldCBzZWxmID0gdGhpcztcblxuXHQvLyBpbml0aWFsaXplIHRoZSByZWYgYW5kIGNvbXAgZ2Vub21lIG9wdGlvbiBsaXN0c1xuXHRpbml0T3B0TGlzdChcIiNyZWZHZW5vbWVcIiwgICB0aGlzLmFsbEdlbm9tZXMsIGc9PmcubmFtZSwgZz0+Zy5sYWJlbCwgZmFsc2UsIGcgPT4gZyA9PT0gY2ZnLnJlZik7XG5cdGluaXRPcHRMaXN0KFwiI2NvbXBHZW5vbWVzXCIsIHRoaXMuYWxsR2Vub21lcywgZz0+Zy5uYW1lLCBnPT5nLmxhYmVsLCB0cnVlLCAgZyA9PiBjZmcuZ2Vub21lcy5pbmRleE9mKGcpICE9PSAtMSk7XG5cdGQzLnNlbGVjdChcIiNyZWZHZW5vbWVcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG5cdCAgICBzZWxmLnNldENvbnRleHQoeyByZWY6IHRoaXMudmFsdWUgfSk7XG5cdH0pO1xuXHRkMy5zZWxlY3QoXCIjY29tcEdlbm9tZXNcIikub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG5cdCAgICBsZXQgc2VsZWN0ZWROYW1lcyA9IFtdO1xuXHQgICAgZm9yKGxldCB4IG9mIHRoaXMuc2VsZWN0ZWRPcHRpb25zKXtcblx0XHRzZWxlY3RlZE5hbWVzLnB1c2goeC52YWx1ZSk7XG5cdCAgICB9XG5cdCAgICAvLyB3YW50IHRvIHByZXNlcnZlIGN1cnJlbnQgZ2Vub21lIG9yZGVyIGFzIG11Y2ggYXMgcG9zc2libGUgXG5cdCAgICBsZXQgZ05hbWVzID0gc2VsZi52R2Vub21lcy5tYXAoZz0+Zy5uYW1lKVxuXHRcdC5maWx0ZXIobiA9PiB7XG5cdFx0ICAgIHJldHVybiBzZWxlY3RlZE5hbWVzLmluZGV4T2YobikgPj0gMCB8fCBuID09PSBzZWxmLnJHZW5vbWUubmFtZTtcblx0XHR9KTtcblx0ICAgIGdOYW1lcyA9IGdOYW1lcy5jb25jYXQoc2VsZWN0ZWROYW1lcy5maWx0ZXIobiA9PiBnTmFtZXMuaW5kZXhPZihuKSA9PT0gLTEpKTtcblx0ICAgIHNlbGYuc2V0Q29udGV4dCh7IGdlbm9tZXM6IGdOYW1lcyB9KTtcblx0fSk7XG5cdGQzdHN2KFwiLi9kYXRhL2dlbm9tZWRhdGEvZ2Vub21lU2V0cy50c3ZcIikudGhlbihzZXRzID0+IHtcblx0ICAgIC8vIENyZWF0ZSBzZWxlY3Rpb24gYnV0dG9ucy5cblx0ICAgIHNldHMuZm9yRWFjaCggcyA9PiBzLmdlbm9tZXMgPSBzLmdlbm9tZXMuc3BsaXQoXCIsXCIpICk7XG5cdCAgICBsZXQgY2diID0gZDMuc2VsZWN0KCcjY29tcEdlbm9tZXNCb3gnKS5zZWxlY3RBbGwoJ2J1dHRvbicpLmRhdGEoc2V0cyk7XG5cdCAgICBjZ2IuZW50ZXIoKS5hcHBlbmQoJ2J1dHRvbicpXG5cdFx0LnRleHQoZD0+ZC5uYW1lKVxuXHRcdC5hdHRyKCd0aXRsZScsIGQ9PmQuZGVzY3JpcHRpb24pXG5cdFx0Lm9uKCdjbGljaycsIGQgPT4ge1xuXHRcdCAgICBzZWxmLnNldENvbnRleHQoZCk7XG5cdFx0fSlcblx0XHQ7XG5cdH0pLmNhdGNoKCgpPT57XG5cdCAgICBjb25zb2xlLmxvZyhcIk5vIGdlbm9tZVNldHMgZmlsZSBmb3VuZC5cIik7XG5cdH0pOyAvLyBPSyBpZiBubyBnZW5vbWVTZXRzIGZpbGVcblxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBwcm9jZXNzQ2hyb21vc29tZXMgKGRhdGEpIHtcblx0Ly8gZGF0YSBpcyBhIGxpc3Qgb2YgY2hyb21vc29tZSBsaXN0cywgb25lIHBlciBnZW5vbWVcblx0Ly8gRmlsbCBpbiB0aGUgZ2Vub21lQ2hycyBtYXAgKGdlbm9tZSAtPiBjaHIgbGlzdClcblx0dGhpcy5hbGxHZW5vbWVzLmZvckVhY2goKGcsaSkgPT4ge1xuXHQgICAgLy8gbmljZWx5IHNvcnQgdGhlIGNocm9tb3NvbWVzXG5cdCAgICBsZXQgY2hycyA9IGRhdGFbaV07XG5cdCAgICBnLm1heGxlbiA9IDA7XG5cdCAgICBjaHJzLmZvckVhY2goIGMgPT4ge1xuXHRcdC8vXG5cdFx0Yy5sZW5ndGggPSBwYXJzZUludChjLmxlbmd0aClcblx0XHRnLm1heGxlbiA9IE1hdGgubWF4KGcubWF4bGVuLCBjLmxlbmd0aCk7XG5cdFx0Ly8gYmVjYXVzZSBJJ2QgcmF0aGVyIHNheSBcImNocm9tb3NvbWUubmFtZVwiIHRoYW4gXCJjaHJvbW9zb21lLmNocm9tb3NvbWVcIlxuXHRcdGMubmFtZSA9IGMuY2hyb21vc29tZTtcblx0XHRkZWxldGUgYy5jaHJvbW9zb21lO1xuXHQgICAgfSk7XG5cdCAgICAvLyBuaWNlbHkgc29ydCB0aGUgY2hyb21vc29tZXNcblx0ICAgIGNocnMuc29ydCgoYSxiKSA9PiB7XG5cdFx0bGV0IGFhID0gcGFyc2VJbnQoYS5uYW1lKSAtIHBhcnNlSW50KGIubmFtZSk7XG5cdFx0aWYgKCFpc05hTihhYSkpIHJldHVybiBhYTtcblx0XHRyZXR1cm4gYS5uYW1lIDwgYi5uYW1lID8gLTEgOiBhLm5hbWUgPiBiLm5hbWUgPyArMSA6IDA7XG5cdCAgICB9KTtcblx0ICAgIGcuY2hyb21vc29tZXMgPSBjaHJzO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0Q29udGVudERyYWdnZXIgKCkge1xuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgLy8gSGVscGVyIGZ1bmN0aW9uIGZvciB0aGUgZHJhZyBiZWhhdmlvci4gUmVvcmRlcnMgdGhlIGNvbnRlbnRzIGJhc2VkIG9uXG4gICAgICAvLyBjdXJyZW50IHNjcmVlbiBwb3NpdGlvbiBvZiB0aGUgZHJhZ2dlZCBpdGVtLlxuICAgICAgZnVuY3Rpb24gcmVvcmRlckJ5RG9tKCkge1xuXHQgIC8vIExvY2F0ZSB0aGUgc2liIHdob3NlIHBvc2l0aW9uIGlzIGJleW9uZCB0aGUgZHJhZ2dlZCBpdGVtIGJ5IHRoZSBsZWFzdCBhbW91bnRcblx0ICBsZXQgZHIgPSBzZWxmLmRyYWdnaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIGxldCBiU2liID0gbnVsbDtcblx0ICBsZXQgeHkgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnUGFyZW50KS5jbGFzc2VkKFwiZmxleHJvd1wiKSA/IFwieFwiIDogXCJ5XCI7XG5cdCAgZm9yIChsZXQgcyBvZiBzZWxmLmRyYWdTaWJzKSB7XG5cdCAgICAgIGxldCBzciA9IHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIGlmIChkclt4eV0gPCBzclt4eV0pIHtcblx0XHQgICBsZXQgZGlzdCA9IHNyW3h5XSAtIGRyW3h5XTtcblx0XHQgICBpZiAoIWJTaWIgfHwgZGlzdCA8IGJTaWJbeHldIC0gZHJbeHldKVxuXHRcdCAgICAgICBiU2liID0gcztcblx0ICAgICAgfVxuXHQgIH1cblx0ICAvLyBJbnNlcnQgdGhlIGRyYWdnZWQgaXRlbSBiZWZvcmUgdGhlIGxvY2F0ZWQgc2liIChvciBhcHBlbmQgaWYgbm8gc2liIGZvdW5kKVxuXHQgIHNlbGYuZHJhZ1BhcmVudC5pbnNlcnRCZWZvcmUoc2VsZi5kcmFnZ2luZywgYlNpYik7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiByZW9yZGVyQnlTdHlsZSgpIHtcblx0ICBsZXQgZGQgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZyk7XG5cdCAgLy8gTG9jYXRlIHRoZSBzaWIgdGhhdCBjb250YWlucyB0aGUgZHJhZ2dlZCBpdGVtJ3Mgb3JpZ2luLlxuXHQgIGxldCBkciA9IHNlbGYuZHJhZ2dpbmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgbGV0IGJTaWIgPSBudWxsO1xuXHQgIGxldCB4eSA9IGQzLnNlbGVjdChzZWxmLmRyYWdQYXJlbnQpLmNsYXNzZWQoXCJmbGV4cm93XCIpID8gXCJ4XCIgOiBcInlcIjtcblx0ICBsZXQgc3ogPSB4eSA9PT0gXCJ4XCIgPyBcIndpZHRoXCIgOiBcImhlaWdodFwiO1xuXHQgIGxldCBzdHk9IHh5ID09PSBcInhcIiA/IFwibGVmdFwiIDogXCJ0b3BcIjtcblx0ICBmb3IgKGxldCBzIG9mIHNlbGYuZHJhZ1NpYnMpIHtcblx0ICAgICAgLy8gc2tpcCB0aGUgZHJhZ2dlZCBpdGVtXG5cdCAgICAgIGlmIChzID09PSBzZWxmLmRyYWdnaW5nKSBjb250aW51ZTtcblx0ICAgICAgbGV0IGRzID0gZDMuc2VsZWN0KHMpO1xuXHQgICAgICBsZXQgc3IgPSBzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICAvLyBpZncgdGhlIGRyYWdnZWQgaXRlbSdzIG9yaWdpbiBpcyBiZXR3ZWVuIHRoZSBzdGFydCBhbmQgZW5kIG9mIHNpYiwgd2UgZm91bmQgaXQuXG5cdCAgICAgIGlmIChkclt4eV0gPj0gc3JbeHldICYmIGRyW3h5XSA8PSAoc3JbeHldICsgc3Jbc3pdKSkge1xuXHRcdCAgIC8vIG1vdmUgc2liIHRvd2FyZCB0aGUgaG9sZSwgYW1vdW50ID0gdGhlIHNpemUgb2YgdGhlIGhvbGVcblx0XHQgICBsZXQgYW10ID0gc2VsZi5kcmFnSG9sZVtzel0gKiAoc2VsZi5kcmFnSG9sZVt4eV0gPCBzclt4eV0gPyAtMSA6IDEpO1xuXHRcdCAgIGRzLnN0eWxlKHN0eSwgcGFyc2VJbnQoZHMuc3R5bGUoc3R5KSkgKyBhbXQgKyBcInB4XCIpO1xuXHRcdCAgIHNlbGYuZHJhZ0hvbGVbeHldIC09IGFtdDtcbiAgICAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgfVxuXHQgIH1cbiAgICAgIH1cbiAgICAgIC8vXG4gICAgICByZXR1cm4gZDMuYmVoYXZpb3IuZHJhZygpXG5cdCAgLm9yaWdpbihmdW5jdGlvbihkLGkpe1xuXHQgICAgICByZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICB9KVxuICAgICAgICAgIC5vbihcImRyYWdzdGFydC5tXCIsIGZ1bmN0aW9uKCkge1xuXHQgICAgICBsZXQgdCA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50LnRhcmdldDtcblx0ICAgICAgaWYgKCEgZDMuc2VsZWN0KHQpLmNsYXNzZWQoXCJkcmFnaGFuZGxlXCIpKSByZXR1cm47XG5cdCAgICAgIGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICAvL1xuXHQgICAgICBzZWxmLmRyYWdnaW5nICAgID0gdGhpcy5jbG9zZXN0KFwiLnBhZ2Vib3hcIik7XG5cdCAgICAgIHNlbGYuZHJhZ0hvbGUgICAgPSBzZWxmLmRyYWdnaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICBzZWxmLmRyYWdQYXJlbnQgID0gc2VsZi5kcmFnZ2luZy5wYXJlbnROb2RlO1xuXHQgICAgICBzZWxmLmRyYWdTaWJzICAgID0gc2VsZi5kcmFnUGFyZW50LmNoaWxkcmVuO1xuXHQgICAgICAvL1xuXHQgICAgICBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZykuY2xhc3NlZChcImRyYWdnaW5nXCIsIHRydWUpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZy5tXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIGxldCBkZCA9IGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKTtcblx0ICAgICAgbGV0IHRwID0gcGFyc2VJbnQoZGQuc3R5bGUoXCJ0b3BcIikpXG5cdCAgICAgIGRkLnN0eWxlKFwidG9wXCIsIHRwICsgZDMuZXZlbnQuZHkgKyBcInB4XCIpO1xuXHQgICAgICAvL3Jlb3JkZXJCeVN0eWxlKCk7XG5cdCAgfSlcblx0ICAub24oXCJkcmFnZW5kLm1cIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgcmVvcmRlckJ5RG9tKCk7XG5cdCAgICAgIHNlbGYuc2V0UHJlZnNGcm9tVUkoKTtcblx0ICAgICAgbGV0IGRkID0gZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpO1xuXHQgICAgICBkZC5zdHlsZShcInRvcFwiLCBcIjBweFwiKTtcblx0ICAgICAgZGQuY2xhc3NlZChcImRyYWdnaW5nXCIsIGZhbHNlKTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZyAgICA9IG51bGw7XG5cdCAgICAgIHNlbGYuZHJhZ0hvbGUgICAgPSBudWxsO1xuXHQgICAgICBzZWxmLmRyYWdQYXJlbnQgID0gbnVsbDtcblx0ICAgICAgc2VsZi5kcmFnU2licyAgICA9IG51bGw7XG5cdCAgfSlcblx0ICA7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldFVJRnJvbVByZWZzICgpIHtcblx0dGhpcy51c2VyUHJlZnNTdG9yZS5nZXQoXCJwcmVmc1wiKS50aGVuKCBwcmVmcyA9PiB7XG5cdCAgICBwcmVmcyA9IHByZWZzIHx8IHt9O1xuXHQgICAgY29uc29sZS5sb2coXCJHb3QgcHJlZnMgZnJvbSBzdG9yYWdlXCIsIHByZWZzKTtcblxuXHQgICAgLy8gc2V0IG9wZW4vY2xvc2VkIHN0YXRlc1xuXHQgICAgKHByZWZzLmNsb3NhYmxlcyB8fCBbXSkuZm9yRWFjaCggYyA9PiB7XG5cdFx0bGV0IGlkID0gY1swXTtcblx0XHRsZXQgc3RhdGUgPSBjWzFdO1xuXHRcdGQzLnNlbGVjdCgnIycraWQpLmNsYXNzZWQoJ2Nsb3NlZCcsIHN0YXRlID09PSBcImNsb3NlZFwiIHx8IG51bGwpO1xuXHQgICAgfSk7XG5cblx0ICAgIC8vIHNldCBkcmFnZ2FibGVzJyBvcmRlclxuXHQgICAgKHByZWZzLmRyYWdnYWJsZXMgfHwgW10pLmZvckVhY2goIGQgPT4ge1xuXHRcdGxldCBjdHJJZCA9IGRbMF07XG5cdFx0bGV0IGNvbnRlbnRJZHMgPSBkWzFdO1xuXHRcdGxldCBjdHIgPSBkMy5zZWxlY3QoJyMnK2N0cklkKTtcblx0XHRsZXQgY29udGVudHMgPSBjdHIuc2VsZWN0QWxsKCcjJytjdHJJZCsnID4gKicpO1xuXHRcdGNvbnRlbnRzWzBdLnNvcnQoIChhLGIpID0+IHtcblx0XHQgICAgbGV0IGFpID0gY29udGVudElkcy5pbmRleE9mKGEuZ2V0QXR0cmlidXRlKCdpZCcpKTtcblx0XHQgICAgbGV0IGJpID0gY29udGVudElkcy5pbmRleE9mKGIuZ2V0QXR0cmlidXRlKCdpZCcpKTtcblx0XHQgICAgcmV0dXJuIGFpID09PSAtMSA/IDEgOiBiaSA9PT0gLTEgPyAtMSA6IGFpIC0gYmk7XG5cdFx0fSk7XG5cdFx0Y29udGVudHMub3JkZXIoKTtcblx0ICAgIH0pO1xuXHR9KTtcbiAgICB9XG4gICAgc2V0UHJlZnNGcm9tVUkgKCkge1xuICAgICAgICAvLyBzYXZlIG9wZW4vY2xvc2VkIHN0YXRlc1xuXHRsZXQgY2xvc2FibGVzID0gdGhpcy5yb290LnNlbGVjdEFsbCgnLmNsb3NhYmxlJyk7XG5cdGxldCBvY0RhdGEgPSBjbG9zYWJsZXNbMF0ubWFwKCBjID0+IHtcblx0ICAgIGxldCBkYyA9IGQzLnNlbGVjdChjKTtcblx0ICAgIHJldHVybiBbZGMuYXR0cignaWQnKSwgZGMuY2xhc3NlZChcImNsb3NlZFwiKSA/IFwiY2xvc2VkXCIgOiBcIm9wZW5cIl07XG5cdH0pO1xuXHQvLyBzYXZlIGRyYWdnYWJsZXMnIG9yZGVyXG5cdGxldCBkcmFnQ3RycyA9IHRoaXMucm9vdC5zZWxlY3RBbGwoJy5jb250ZW50LWRyYWdnYWJsZScpO1xuXHRsZXQgZHJhZ2dhYmxlcyA9IGRyYWdDdHJzLnNlbGVjdEFsbCgnLmNvbnRlbnQtZHJhZ2dhYmxlID4gKicpO1xuXHRsZXQgZGREYXRhID0gZHJhZ2dhYmxlcy5tYXAoIChkLGkpID0+IHtcblx0ICAgIGxldCBjdHIgPSBkMy5zZWxlY3QoZHJhZ0N0cnNbMF1baV0pO1xuXHQgICAgcmV0dXJuIFtjdHIuYXR0cignaWQnKSwgZC5tYXAoIGRkID0+IGQzLnNlbGVjdChkZCkuYXR0cignaWQnKSldO1xuXHR9KTtcblx0bGV0IHByZWZzID0ge1xuXHQgICAgY2xvc2FibGVzOiBvY0RhdGEsXG5cdCAgICBkcmFnZ2FibGVzOiBkZERhdGFcblx0fVxuXHRjb25zb2xlLmxvZyhcIlNhdmluZyBwcmVmcyB0byBzdG9yYWdlXCIsIHByZWZzKTtcblx0dGhpcy51c2VyUHJlZnNTdG9yZS5zZXQoXCJwcmVmc1wiLCBwcmVmcyk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dCbG9ja3MgKGNvbXApIHtcblx0bGV0IHJlZiA9IHRoaXMuckdlbm9tZTtcblx0aWYgKCEgY29tcCkgY29tcCA9IHRoaXMuY0dlbm9tZXNbMF07XG5cdGlmICghIGNvbXApIHJldHVybjtcblx0dGhpcy50cmFuc2xhdG9yLnJlYWR5KCkudGhlbiggKCkgPT4ge1xuXHQgICAgbGV0IGJsb2NrcyA9IGNvbXAgPT09IHJlZiA/IFtdIDogdGhpcy50cmFuc2xhdG9yLmdldEJsb2NrcyhyZWYsIGNvbXApO1xuXHQgICAgdGhpcy5nZW5vbWVWaWV3LmRyYXdCbG9ja3MoeyByZWYsIGNvbXAsIGJsb2NrcyB9KTtcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dCdXN5IChpc0J1c3ksIG1lc3NhZ2UpIHtcbiAgICAgICAgZDMuc2VsZWN0KFwiI2hlYWRlciA+IC5nZWFyLmJ1dHRvblwiKVxuXHQgICAgLmNsYXNzZWQoXCJyb3RhdGluZ1wiLCBpc0J1c3kpO1xuICAgICAgICBkMy5zZWxlY3QoXCIjem9vbVZpZXdcIikuY2xhc3NlZChcImJ1c3lcIiwgaXNCdXN5KTtcblx0aWYgKGlzQnVzeSAmJiBtZXNzYWdlKSB0aGlzLnNob3dTdGF0dXMobWVzc2FnZSk7XG5cdGlmICghaXNCdXN5KSB0aGlzLnNob3dTdGF0dXMoJycpXG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dpbmdTdGF0dXMgKCkge1xuICAgICAgICByZXR1cm4gZDMuc2VsZWN0KCcjc3RhdHVzTWVzc2FnZScpLmNsYXNzZWQoJ3Nob3dpbmcnKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93U3RhdHVzIChtc2csIG5lYXJYLCBuZWFyWSkge1xuXHRsZXQgYmIgPSB0aGlzLnJvb3Qubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRsZXQgXyA9IChuLCBsZW4sIG5tYXgpID0+IHtcblx0ICAgIGlmIChuID09PSB1bmRlZmluZWQpXG5cdCAgICAgICAgcmV0dXJuICc1MCUnO1xuXHQgICAgZWxzZSBpZiAodHlwZW9mKG4pID09PSAnc3RyaW5nJylcblx0ICAgICAgICByZXR1cm4gbjtcblx0ICAgIGVsc2UgaWYgKCBuICsgbGVuIDwgbm1heCApIHtcblx0ICAgICAgICByZXR1cm4gbiArICdweCc7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gKG5tYXggLSBsZW4pICsgJ3B4Jztcblx0ICAgIH1cblx0fTtcblx0bmVhclggPSBfKG5lYXJYLCAyNTAsIGJiLndpZHRoKTtcblx0bmVhclkgPSBfKG5lYXJZLCAxNTAsIGJiLmhlaWdodCk7XG5cdGlmIChtc2cpXG5cdCAgICBkMy5zZWxlY3QoJyNzdGF0dXNNZXNzYWdlJylcblx0XHQuY2xhc3NlZCgnc2hvd2luZycsIHRydWUpXG5cdFx0LnN0eWxlKCdsZWZ0JywgbmVhclgpXG5cdFx0LnN0eWxlKCd0b3AnLCAgbmVhclkpXG5cdFx0LnNlbGVjdCgnc3BhbicpXG5cdFx0ICAgIC50ZXh0KG1zZyk7XG5cdGVsc2Vcblx0ICAgIGQzLnNlbGVjdCgnI3N0YXR1c01lc3NhZ2UnKS5jbGFzc2VkKCdzaG93aW5nJywgZmFsc2UpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldFJlZkdlbm9tZVNlbGVjdGlvbiAoKSB7XG5cdGQzLnNlbGVjdEFsbChcIiNyZWZHZW5vbWUgb3B0aW9uXCIpXG5cdCAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCAgZ2cgPT4gKGdnLmxhYmVsID09PSB0aGlzLnJHZW5vbWUubGFiZWwgIHx8IG51bGwpKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0Q29tcEdlbm9tZXNTZWxlY3Rpb24gKCkge1xuXHRsZXQgY2ducyA9IHRoaXMudkdlbm9tZXMubWFwKGc9PmcubGFiZWwpO1xuXHRkMy5zZWxlY3RBbGwoXCIjY29tcEdlbm9tZXMgb3B0aW9uXCIpXG5cdCAgICAgICAgLnByb3BlcnR5KFwic2VsZWN0ZWRcIiwgIGdnID0+IGNnbnMuaW5kZXhPZihnZy5sYWJlbCkgPj0gMCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNldHMgb3IgcmV0dXJuc1xuICAgIHNldEhpZ2hsaWdodCAoZmxpc3QpIHtcblx0aWYgKCFmbGlzdCkgcmV0dXJuIGZhbHNlO1xuXHR0aGlzLnpvb21WaWV3LmhpRmVhdHMgPSBmbGlzdC5yZWR1Y2UoKGEsdikgPT4geyBhW3ZdPXY7IHJldHVybiBhOyB9LCB7fSk7XG5cdHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGNvbnRleHQgYXMgYW4gb2JqZWN0LlxuICAgIC8vIEN1cnJlbnQgY29udGV4dCA9IHJlZiBnZW5vbWUgKyBjb21wIGdlbm9tZXMgKyBjdXJyZW50IHJhbmdlIChjaHIsc3RhcnQsZW5kKVxuICAgIGdldENvbnRleHQgKCkge1xuXHRpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpIHtcblx0ICAgIGxldCBjID0gdGhpcy5jb29yZHM7XG5cdCAgICByZXR1cm4ge1xuXHRcdHJlZiA6IHRoaXMuckdlbm9tZS5sYWJlbCxcblx0XHRnZW5vbWVzOiB0aGlzLnZHZW5vbWVzLm1hcChnPT5nLmxhYmVsKSxcblx0XHRjaHI6IGMuY2hyLFxuXHRcdHN0YXJ0OiBjLnN0YXJ0LFxuXHRcdGVuZDogYy5lbmQsXG5cdFx0aGlnaGxpZ2h0OiBPYmplY3Qua2V5cyh0aGlzLnpvb21WaWV3LmhpRmVhdHMpLnNvcnQoKSxcblx0XHRkbW9kZTogdGhpcy56b29tVmlldy5kbW9kZVxuXHQgICAgfVxuXHR9IGVsc2Uge1xuXHQgICAgbGV0IGMgPSB0aGlzLmxjb29yZHM7XG5cdCAgICByZXR1cm4ge1xuXHRcdHJlZiA6IHRoaXMuckdlbm9tZS5sYWJlbCxcblx0XHRnZW5vbWVzOiB0aGlzLnZHZW5vbWVzLm1hcChnPT5nLmxhYmVsKSxcblx0XHRsYW5kbWFyazogYy5sYW5kbWFyayxcblx0XHRmbGFuazogYy5mbGFuayxcblx0XHRsZW5ndGg6IGMubGVuZ3RoLFxuXHRcdGRlbHRhOiBjLmRlbHRhLFxuXHRcdGhpZ2hsaWdodDogT2JqZWN0LmtleXModGhpcy56b29tVmlldy5oaUZlYXRzKS5zb3J0KCksXG5cdFx0ZG1vZGU6IHRoaXMuem9vbVZpZXcuZG1vZGVcblx0ICAgIH1cblx0fVxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXNvbHZlcyB0aGUgc3BlY2lmaWVkIGxhbmRtYXJrIHRvIGEgZmVhdHVyZSBhbmQgdGhlIGxpc3Qgb2YgZXF1aXZhbGVudCBmZWF1cmVzLlxuICAgIC8vIE1heSBiZSBnaXZlbiBhbiBpZCwgY2Fub25pY2FsIGlkLCBvciBzeW1ib2wuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgY2ZnIChvYmopIFNhbml0aXplZCBjb25maWcgb2JqZWN0LCB3aXRoIGEgbGFuZG1hcmsgKHN0cmluZykgZmllbGQuXG4gICAgLy8gUmV0dXJuczpcbiAgICAvLyAgICAgVGhlIGNmZyBvYmplY3QsIHdpdGggYWRkaXRpb25hbCBmaWVsZHM6XG4gICAgLy8gICAgICAgIGxhbmRtYXJrUmVmRmVhdDogdGhlIGxhbmRtYXJrIChGZWF0dXJlIG9iaikgaW4gdGhlIHJlZiBnZW5vbWVcbiAgICAvLyAgICAgICAgbGFuZG1hcmtGZWF0czogWyBlcXVpdmFsZW50IGZlYXR1cmVzIGluIGVhY2ggZ2Vub21lIChpbmNsdWRlcyByZildXG4gICAgLy8gICAgIEFsc28sIGNoYW5nZXMgcmVmIHRvIGJlIHRoZSBnZW5vbWUgb2YgdGhlIGxhbmRtYXJrUmVmRmVhdFxuICAgIC8vICAgICBSZXR1cm5zIG51bGwgaWYgbGFuZG1hcmsgbm90IGZvdW5kIGluIGFueSBnZW5vbWUuXG4gICAgLy8gXG4gICAgcmVzb2x2ZUxhbmRtYXJrIChjZmcpIHtcblx0bGV0IHJmLCBmZWF0cztcblx0Ly8gRmluZCB0aGUgbGFuZG1hcmsgZmVhdHVyZSBpbiB0aGUgcmVmIGdlbm9tZS4gXG5cdHJmID0gdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5TGFiZWwoY2ZnLmxhbmRtYXJrLCBjZmcucmVmKVswXTtcblx0aWYgKCFyZikge1xuXHQgICAgLy8gTGFuZG1hcmsgZG9lcyBub3QgZXhpc3QgaW4gcmVmIGdlbm9tZS4gRG9lcyBpdCBleGlzdCBpbiBhbnkgc3BlY2lmaWVkIGdlbm9tZT9cblx0ICAgIHJmID0gdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5TGFiZWwoY2ZnLmxhbmRtYXJrKS5maWx0ZXIoZiA9PiBjZmcuZ2Vub21lcy5pbmRleE9mKGYuZ2Vub21lKSA+PSAwKVswXTtcblx0ICAgIGlmIChyZikge1xuXHQgICAgICAgIGNmZy5yZWYgPSByZi5nZW5vbWU7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICAvLyBMYW5kbWFyayBjYW5ub3QgYmUgcmVzb2x2ZWQuXG5cdFx0cmV0dXJuIG51bGw7XG5cdCAgICB9XG5cdH1cblx0Ly8gbGFuZG1hcmsgZXhpc3RzIGluIHJlZiBnZW5vbWUuIEdldCBlcXVpdmFsZW50IGZlYXQgaW4gZWFjaCBnZW5vbWUuXG5cdGZlYXRzID0gcmYuY2Fub25pY2FsID8gdGhpcy5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5Q2Fub25pY2FsSWQocmYuY2Fub25pY2FsKSA6IFtyZl07XG5cdGNmZy5sYW5kbWFya1JlZkZlYXQgPSByZjtcblx0Y2ZnLmxhbmRtYXJrRmVhdHMgPSBmZWF0cy5maWx0ZXIoZiA9PiBjZmcuZ2Vub21lcy5pbmRleE9mKGYuZ2Vub21lKSA+PSAwKTtcblx0cmV0dXJuIGNmZztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHNhbml0aXplZCB2ZXJzaW9uIG9mIHRoZSBhcmd1bWVudCBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAgICAvLyBUaGUgc2FuaXRpemVkIHZlcnNpb246XG4gICAgLy8gICAgIC0gaGFzIGEgc2V0dGluZyBmb3IgZXZlcnkgcGFyYW1ldGVyLiBQYXJhbWV0ZXJzIG5vdCBzcGVjaWZpZWQgaW4gXG4gICAgLy8gICAgICAgdGhlIGFyZ3VtZW50IGFyZSAoZ2VuZXJhbGx5KSBmaWxsZWQgaW4gd2l0aCB0aGVpciBjdXJyZW50IHZhbHVlcy5cbiAgICAvLyAgICAgLSBpcyBhbHdheXMgdmFsaWQsIGVnXG4gICAgLy8gICAgIFx0LSBoYXMgYSBsaXN0IG9mIDEgb3IgbW9yZSB2YWxpZCBnZW5vbWVzLCB3aXRoIG9uZSBvZiB0aGVtIGRlc2lnbmF0ZWQgYXMgdGhlIHJlZlxuICAgIC8vICAgICBcdC0gaGFzIGEgdmFsaWQgY29vcmRpbmF0ZSByYW5nZVxuICAgIC8vICAgICBcdCAgICAtIHN0YXJ0IGFuZCBlbmQgYXJlIGludGVnZXJzIHdpdGggc3RhcnQgPD0gZW5kXG4gICAgLy8gICAgIFx0ICAgIC0gdmFsaWQgY2hyb21vc29tZSBmb3IgcmVmIGdlbm9tZVxuICAgIC8vXG4gICAgLy8gVGhlIHNhbml0aXplZCB2ZXJzaW9uIGlzIGFsc28gXCJjb21waWxlZFwiOlxuICAgIC8vICAgICAtIGl0IGhhcyBhY3R1YWwgR2Vub21lIG9iamVjdHMsIHdoZXJlIHRoZSBhcmd1bWVudCBqdXN0IGhhcyBuYW1lc1xuICAgIC8vICAgICAtIGdyb3VwcyB0aGUgY2hyK3N0YXJ0K2VuZCBpbiBcImNvb3Jkc1wiIG9iamVjdFxuICAgIC8vXG4gICAgLy9cbiAgICBzYW5pdGl6ZUNmZyAoYykge1xuXHRsZXQgY2ZnID0ge307XG5cblx0Ly8gU2FuaXRpemUgdGhlIGlucHV0LlxuXG5cdC8vIHdpbmRvdyBzaXplIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGlmIChjLndpZHRoKSB7XG5cdCAgICBjZmcud2lkdGggPSBjLndpZHRoXG5cdH1cblxuXHQvLyByZWYgZ2Vub21lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvL1xuXHQvLyBTZXQgY2ZnLnJlZiB0byBzcGVjaWZpZWQgZ2Vub21lLCBcblx0Ly8gICB3aXRoIGZhbGxiYWNrIHRvIGN1cnJlbnQgcmVmIGdlbm9tZSwgXG5cdC8vICAgICAgd2l0aCBmYWxsYmFjayB0byBDNTdCTC82SiAoMXN0IHRpbWUgdGhydSlcblx0Ly8gRklYTUU6IGZpbmFsIGZhbGxiYWNrIHNob3VsZCBiZSBhIGNvbmZpZyBzZXR0aW5nLlxuXHRjZmcucmVmID0gKGMucmVmID8gdGhpcy5ubDJnZW5vbWVbYy5yZWZdIHx8IHRoaXMuckdlbm9tZSA6IHRoaXMuckdlbm9tZSkgfHwgdGhpcy5ubDJnZW5vbWVbJ0M1N0JMLzZKJ107XG5cblx0Ly8gY29tcGFyaXNvbiBnZW5vbWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gU2V0IGNmZy5nZW5vbWVzIHRvIGJlIHRoZSBzcGVjaWZpZWQgZ2Vub21lcyxcblx0Ly8gICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgZ2Vub21lc1xuXHQvLyAgICAgICAgd2l0aCBmYWxsYmFjayB0byBbcmVmXSAoMXN0IHRpbWUgdGhydSlcblx0Y2ZnLmdlbm9tZXMgPSBjLmdlbm9tZXMgP1xuXHQgICAgKGMuZ2Vub21lcy5tYXAoZyA9PiB0aGlzLm5sMmdlbm9tZVtnXSkuZmlsdGVyKHg9PngpKVxuXHQgICAgOlxuXHQgICAgdGhpcy52R2Vub21lcztcblx0Ly8gQWRkIHJlZiB0byBnZW5vbWVzIGlmIG5vdCB0aGVyZSBhbHJlYWR5XG5cdGlmIChjZmcuZ2Vub21lcy5pbmRleE9mKGNmZy5yZWYpID09PSAtMSlcblx0ICAgIGNmZy5nZW5vbWVzLnVuc2hpZnQoY2ZnLnJlZik7XG5cdFxuXHQvLyBhYnNvbHV0ZSBjb29yZGluYXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvL1xuXHQvLyBTZXQgY2ZnLmNociB0byBiZSB0aGUgc3BlY2lmaWVkIGNocm9tb3NvbWVcblx0Ly8gICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgY2hyXG5cdC8vICAgICAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgMXN0IGNocm9tb3NvbWUgaW4gdGhlIHJlZiBnZW5vbWVcblx0Y2ZnLmNociA9IGNmZy5yZWYuZ2V0Q2hyb21vc29tZShjLmNocik7XG5cdGlmICghY2ZnLmNocikgY2ZnLmNociA9IGNmZy5yZWYuZ2V0Q2hyb21vc29tZSggdGhpcy5jb29yZHMgPyB0aGlzLmNvb3Jkcy5jaHIgOiBcIjFcIiApO1xuXHRpZiAoIWNmZy5jaHIpIGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoMCk7XG5cdGlmICghY2ZnLmNocikgdGhyb3cgXCJObyBjaHJvbW9zb21lLlwiXG5cdFxuXHQvLyBTZXQgY2ZnLnN0YXJ0IHRvIGJlIHRoZSBzcGVjaWZpZWQgc3RhcnQgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBzdGFydFxuXHQvLyBDbGlwIGF0IGNociBib3VuZGFyaWVzXG5cdGNmZy5zdGFydCA9IGNsaXAoTWF0aC5yb3VuZCh0eXBlb2YoYy5zdGFydCkgPT09IFwibnVtYmVyXCIgPyBjLnN0YXJ0IDogdGhpcy5jb29yZHMuc3RhcnQpLCAxLCBjZmcuY2hyLmxlbmd0aCk7XG5cblx0Ly8gU2V0IGNmZy5lbmQgdG8gYmUgdGhlIHNwZWNpZmllZCBlbmQgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCBlbmRcblx0Ly8gQ2xpcCBhdCBjaHIgYm91bmRhcmllc1xuXHRjZmcuZW5kID0gY2xpcChNYXRoLnJvdW5kKHR5cGVvZihjLmVuZCkgPT09IFwibnVtYmVyXCIgPyBjLmVuZCA6IHRoaXMuY29vcmRzLmVuZCksIDEsIGNmZy5jaHIubGVuZ3RoKTtcblxuXHQvLyBFbnN1cmUgc3RhcnQgPD0gZW5kXG5cdGlmIChjZmcuc3RhcnQgPiBjZmcuZW5kKSB7XG5cdCAgIGxldCB0bXAgPSBjZmcuc3RhcnQ7IGNmZy5zdGFydCA9IGNmZy5lbmQ7IGNmZy5lbmQgPSB0bXA7XG5cdH1cblxuXHQvLyBsYW5kbWFyayBjb29yZGluYXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBOT1RFIHRoYXQgbGFuZG1hcmsgY29vcmRpbmF0ZSBjYW5ub3QgYmUgZnVsbHkgcmVzb2x2ZWQgdG8gYWJzb2x1dGUgY29vcmRpbmF0ZSB1bnRpbFxuXHQvLyAqYWZ0ZXIqIGdlbm9tZSBkYXRhIGhhdmUgYmVlbiBsb2FkZWQuIFNlZSBzZXRDb250ZXh0IGFuZCByZXNvbHZlTGFuZG1hcmsgbWV0aG9kcy5cblx0Y2ZnLmxhbmRtYXJrID0gYy5sYW5kbWFyayB8fCB0aGlzLmxjb29yZHMubGFuZG1hcms7XG5cdGNmZy5kZWx0YSAgICA9IE1hdGgucm91bmQoJ2RlbHRhJyBpbiBjID8gYy5kZWx0YSA6ICh0aGlzLmxjb29yZHMuZGVsdGEgfHwgMCkpO1xuXHRpZiAodHlwZW9mKGMuZmxhbmspID09PSAnbnVtYmVyJyl7XG5cdCAgICBjZmcuZmxhbmsgPSBNYXRoLnJvdW5kKGMuZmxhbmspO1xuXHR9XG5cdGVsc2UgaWYgKCdsZW5ndGgnIGluIGMpIHtcblx0ICAgIGNmZy5sZW5ndGggPSBNYXRoLnJvdW5kKGMubGVuZ3RoKTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIGNmZy5sZW5ndGggPSBNYXRoLnJvdW5kKHRoaXMuY29vcmRzLmVuZCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMSk7XG5cdH1cblxuXHQvLyBjbW9kZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRpZiAoYy5jbW9kZSAmJiBjLmNtb2RlICE9PSAnbWFwcGVkJyAmJiBjLmNtb2RlICE9PSAnbGFuZG1hcmsnKSBjLmNtb2RlID0gbnVsbDtcblx0Y2ZnLmNtb2RlID0gYy5jbW9kZSB8fCBcblx0ICAgICgoJ2NocicgaW4gYyB8fCAnc3RhcnQnIGluIGMgfHwgJ2VuZCcgaW4gYykgP1xuXHQgICAgICAgICdtYXBwZWQnIDogXG5cdFx0KCdsYW5kbWFyaycgaW4gYyB8fCAnZmxhbmsnIGluIGMgfHwgJ2xlbmd0aCcgaW4gYyB8fCAnZGVsdGEnIGluIGMpID9cblx0XHQgICAgJ2xhbmRtYXJrJyA6IFxuXHRcdCAgICB0aGlzLmNtb2RlIHx8ICdtYXBwZWQnKTtcblxuXHQvLyBoaWdobGlnaHRpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBTZXQgY2ZnLmhpZ2hsaWdodFxuXHQvLyAgICB3aXRoIGZhbGxiYWNrIHRvIGN1cnJlbnQgaGlnaGxpZ2h0XG5cdC8vICAgICAgICB3aXRoIGZhbGxiYWNrIHRvIFtdXG5cdGNmZy5oaWdobGlnaHQgPSBjLmhpZ2hsaWdodCB8fCB0aGlzLnpvb21WaWV3LmhpZ2hsaWdodGVkIHx8IFtdO1xuXG5cdC8vIGRyYXdpbmcgbW9kZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIFNldCB0aGUgZHJhd2luZyBtb2RlIGZvciB0aGUgWm9vbVZpZXcuXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IHZhbHVlXG5cdGlmIChjLmRtb2RlID09PSAnY29tcGFyaXNvbicgfHwgYy5kbW9kZSA9PT0gJ3JlZmVyZW5jZScpIFxuXHQgICAgY2ZnLmRtb2RlID0gYy5kbW9kZTtcblx0ZWxzZVxuXHQgICAgY2ZnLmRtb2RlID0gdGhpcy56b29tVmlldy5kbW9kZSB8fCAnY29tcGFyaXNvbic7XG5cblx0Ly9cblx0cmV0dXJuIGNmZztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTZXRzIHRoZSBjdXJyZW50IGNvbnRleHQgZnJvbSB0aGUgY29uZmlnIG9iamVjdC4gXG4gICAgLy8gT25seSB0aG9zZSBjb250ZXh0IGl0ZW1zIHNwZWNpZmllZCBpbiB0aGUgY29uZmlnIGFyZSBhZmZlY3RlZCwgZXhjZXB0IGFzIG5vdGVkLlxuICAgIC8vXG4gICAgLy8gQWxsIGNvbmZpZ3MgYXJlIHNhbml0aXplZCBiZWZvcmUgYmVpbmcgYXBwbGllZCAoc2VlIHNhbml0aXplQ2ZnKS5cbiAgICAvLyBcbiAgICAvLyBBcmdzOlxuICAgIC8vICAgIGMgKG9iamVjdCkgQSBjb25maWd1cmF0aW9uIG9iamVjdCB0aGF0IHNwZWNpZmllcyBzb21lL2FsbCBjb25maWcgdmFsdWVzLlxuICAgIC8vICAgICAgICAgVGhlIHBvc3NpYmxlIGNvbmZpZyBpdGVtczpcbiAgICAvLyAgICAgICAgICAgIGdlbm9tZXMgICAobGlzdCBvIHN0cmluZ3MpIEFsbCB0aGUgZ2Vub21lcyB5b3Ugd2FudCB0byBzZWUsIGluIHRvcC10by1ib3R0b20gb3JkZXIuIFxuICAgIC8vICAgICAgICAgICAgICAgTWF5IHVzZSBpbnRlcm5hbCBuYW1lcyBvciBkaXNwbGF5IGxhYmVscywgZWcsIFwibXVzX211c2N1bHVzXzEyOXMxc3ZpbWpcIiBvciBcIjEyOVMxL1N2SW1KXCIuXG4gICAgLy8gICAgICAgICAgICByZWYgICAgICAgKHN0cmluZykgVGhlIGdlbm9tZSB0byB1c2UgYXMgdGhlIHJlZmVyZW5jZS4gTWF5IGJlIG5hbWUgb3IgbGFiZWwuXG4gICAgLy8gICAgICAgICAgICBoaWdobGlnaHQgKGxpc3QgbyBzdHJpbmdzKSBJRHMgb2YgZmVhdHVyZXMgdG8gaGlnaGxpZ2h0XG4gICAgLy8gICAgICAgICAgICBkbW9kZSAgICAgKHN0cmluZykgZWl0aGVyICdjb21wYXJpc29uJyBvciAncmVmZXJlbmNlJ1xuICAgIC8vXG4gICAgLy8gICAgICAgICAgICBDb29yZGluYXRlcyBhcmUgc3BlY2lmaWVkIGluIG9uZSBvZiAyIGZvcm1zLlxuICAgIC8vICAgICAgICAgICAgICBjaHIgICAgICAgKHN0cmluZykgQ2hyb21vc29tZSBmb3IgY29vcmRpbmF0ZSByYW5nZVxuICAgIC8vICAgICAgICAgICAgICBzdGFydCAgICAgKGludCkgQ29vcmRpbmF0ZSByYW5nZSBzdGFydCBwb3NpdGlvblxuICAgIC8vICAgICAgICAgICAgICBlbmQgICAgICAgKGludCkgQ29vcmRpbmF0ZSByYW5nZSBlbmQgcG9zaXRpb25cbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgICBEaXNwbGF5cyB0aGlzIGNvb3JkaW5hdGUgcmFuZ2UgZnJvbSB0aGUgY3VycmVudCByZWZlcmVuY2UgZ2VuZW9tcywgYW5kIHRoZSBlcXVpdmFsZW50IChtYXBwZWQpXG4gICAgLy8gICAgICAgICAgICAgIGNvb3JkaW5hdGUgcmFuZ2UocykgaW4gZWFjaCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgb3I6XG4gICAgLy8gICAgICAgICAgICAgIGxhbmRtYXJrICAoc3RyaW5nKSBJRCwgY2Fub25pY2FsIElELCBvciBzeW1ib2wsIGlkZW50aWZ5aW5nIGEgZmVhdHVyZS5cbiAgICAvLyAgICAgICAgICAgICAgZmxhbmt8bGVuZ3RoIChpbnQpIElmIGZsYW5rLCB2aWV3aW5nIHJlZ2lvbiBzaXplID0gZmxhbmsgKyBsZW4obGFuZG1hcmspICsgZmxhbmsuIFxuICAgIC8vICAgICAgICAgICAgICAgICBJZiBsZW5ndGgsIHZpZXdpbmcgcmVnaW9uIHNpemUgPSBsZW5ndGguIEluIGVpdGhlciBjYXNlLCB0aGUgbGFuZG1hcmsgaXMgY2VudGVyZWQgaW5cbiAgICAvLyAgICAgICAgICAgICAgICAgdGhlIHZpZXdpbmcgYXJlYSwgKy8tIGFueSBzcGVjaWZpZWQgZGVsdGEuXG4gICAgLy8gICAgICAgICAgICAgIGRlbHRhICAgICAoaW50KSBBbW91bnQgaW4gYnAgdG8gc2hpZnQgdGhlIHJlZ2lvbiBsZWZ0ICg8MCkgb3IgcmlnaHQgKD4wKS5cbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgICBEaXNwbGF5cyB0aGUgcmVnaW9uIGFyb3VuZCB0aGUgc3BlY2lmaWVkIGxhbmRtYXJrIGluIGVhY2ggZ2Vub21lIHdoZXJlIGl0IGV4aXN0cy5cbiAgICAvL1xuICAgIC8vICAgIHF1aWV0bHkgKGJvb2xlYW4pIElmIHRydWUsIGRvbid0IHVwZGF0ZSBicm93c2VyIGhpc3RvcnkgKGFzIHdoZW4gZ29pbmcgYmFjaylcbiAgICAvL1xuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgTm90aGluZ1xuICAgIC8vIFNpZGUgZWZmZWN0czpcbiAgICAvL1x0ICBSZWRyYXdzIFxuICAgIC8vXHQgIENhbGxzIGNvbnRleHRDaGFuZ2VkKCkgXG4gICAgLy9cbiAgICBzZXRDb250ZXh0IChjLCBxdWlldGx5KSB7XG4gICAgICAgIGxldCBjZmcgPSB0aGlzLnNhbml0aXplQ2ZnKGMpO1xuXHQvL2NvbnNvbGUubG9nKFwiU2V0IGNvbnRleHQgKHJhdyk6XCIsIGMpO1xuXHQvL2NvbnNvbGUubG9nKFwiU2V0IGNvbnRleHQgKHNhbml0aXplZCk6XCIsIGNmZyk7XG5cdGlmICghY2ZnKSByZXR1cm47XG5cdHRoaXMuc2hvd0J1c3kodHJ1ZSwgJ1JlcXVlc3RpbmcgZGF0YS4uLicpO1xuXHRsZXQgcCA9IHRoaXMuZmVhdHVyZU1hbmFnZXIubG9hZEdlbm9tZXMoY2ZnLmdlbm9tZXMpLnRoZW4oKCkgPT4ge1xuXHQgICAgaWYgKGNmZy5jbW9kZSA9PT0gJ2xhbmRtYXJrJykge1xuXHQgICAgICAgIGNmZyA9IHRoaXMucmVzb2x2ZUxhbmRtYXJrKGNmZyk7XG5cdFx0aWYgKCFjZmcpIHtcblx0XHQgICAgYWxlcnQoXCJMYW5kbWFyayBkb2VzIG5vdCBleGlzdCBpbiBjdXJyZW50IHJlZmVyZW5jZSBnZW5vbWUuIFBsZWFzZSBjaGFuZ2UgdGhlIHJlZmVyZW5jZSBnZW5vbWUgYW5kIHRyeSBhZ2Fpbi5cIik7XG5cdFx0ICAgIHRoaXMuc2hvd0J1c3koZmFsc2UpO1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHQgICAgfVxuXHQgICAgdGhpcy52R2Vub21lcyA9IGNmZy5nZW5vbWVzO1xuXHQgICAgdGhpcy5yR2Vub21lICA9IGNmZy5yZWY7XG5cdCAgICB0aGlzLmNHZW5vbWVzID0gY2ZnLmdlbm9tZXMuZmlsdGVyKGcgPT4gZyAhPT0gY2ZnLnJlZik7XG5cdCAgICB0aGlzLnNldFJlZkdlbm9tZVNlbGVjdGlvbih0aGlzLnJHZW5vbWUubmFtZSk7XG5cdCAgICB0aGlzLnNldENvbXBHZW5vbWVzU2VsZWN0aW9uKHRoaXMudkdlbm9tZXMubWFwKGc9PmcubmFtZSkpO1xuXHQgICAgLy9cblx0ICAgIHRoaXMuY21vZGUgPSBjZmcuY21vZGU7XG5cdCAgICAvL1xuXHQgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRvci5yZWFkeSgpO1xuXHR9KS50aGVuKCgpID0+IHtcblx0ICAgIC8vXG5cdCAgICBpZiAoIWNmZykgcmV0dXJuO1xuXHQgICAgdGhpcy5jb29yZHMgICA9IHtcblx0XHRjaHI6IGNmZy5jaHIubmFtZSxcblx0XHRjaHJvbW9zb21lOiBjZmcuY2hyLFxuXHRcdHN0YXJ0OiBjZmcuc3RhcnQsXG5cdFx0ZW5kOiBjZmcuZW5kXG5cdCAgICB9O1xuXHQgICAgdGhpcy5sY29vcmRzICA9IHtcblx0ICAgICAgICBsYW5kbWFyazogY2ZnLmxhbmRtYXJrLCBcblx0XHRsYW5kbWFya1JlZkZlYXQ6IGNmZy5sYW5kbWFya1JlZkZlYXQsXG5cdFx0bGFuZG1hcmtGZWF0czogY2ZnLmxhbmRtYXJrRmVhdHMsXG5cdFx0Zmxhbms6IGNmZy5mbGFuaywgXG5cdFx0bGVuZ3RoOiBjZmcubGVuZ3RoLCBcblx0XHRkZWx0YTogY2ZnLmRlbHRhIFxuXHQgICAgfTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLnpvb21WaWV3LnVwZGF0ZShjZmcpO1xuXHQgICAgLy9cblx0ICAgIHRoaXMuZ2Vub21lVmlldy5yZWRyYXcoKTtcblx0ICAgIHRoaXMuZ2Vub21lVmlldy5zZXRCcnVzaENvb3Jkcyh0aGlzLmNvb3Jkcyk7XG5cdCAgICAvL1xuXHQgICAgaWYgKCFxdWlldGx5KVxuXHQgICAgICAgIHRoaXMuY29udGV4dENoYW5nZWQoKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLnNob3dCdXN5KGZhbHNlKTtcblx0fSk7XG5cdHJldHVybiBwO1xuICAgIH1cbiBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRDb29yZGluYXRlcyAoc3RyKSB7XG5cdGxldCBjb29yZHMgPSBwYXJzZUNvb3JkcyhzdHIpO1xuXHRpZiAoISBjb29yZHMpIHtcblx0ICAgIGxldCBmZWF0cyA9IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsKHN0cik7XG5cdCAgICBsZXQgZmVhdHMyID0gZmVhdHMuZmlsdGVyKGY9PmYuZ2Vub21lID09IHRoaXMuckdlbm9tZSk7XG5cdCAgICBsZXQgZiA9IGZlYXRzMlswXSB8fCBmZWF0c1swXTtcblx0ICAgIGlmIChmKSB7XG5cdFx0Y29vcmRzID0ge1xuXHRcdCAgICByZWY6IGYuZ2Vub21lLm5hbWUsXG5cdFx0ICAgIGxhbmRtYXJrOiBzdHIsXG5cdFx0ICAgIGRlbHRhOiAwLFxuXHRcdCAgICBoaWdobGlnaHQ6IGYuaWRcblx0XHR9XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRhbGVydChcIlVuYWJsZSB0byBzZXQgY29vcmRpbmF0ZXMgd2l0aCB0aGlzIHZhbHVlOiBcIiArIHN0cik7XG5cdFx0cmV0dXJuO1xuXHQgICAgfVxuXHR9XG5cdHRoaXMuc2V0Q29udGV4dChjb29yZHMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlc2l6ZSAoKSB7XG5cdGxldCB3ID0gd2luZG93LmlubmVyV2lkdGggLSAyNDtcblx0dGhpcy5nZW5vbWVWaWV3LmZpdFRvV2lkdGgodyk7XG5cdHRoaXMuem9vbVZpZXcuZml0VG9XaWR0aCh3KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgY3VycmVudCBjb250ZXh0IGFzIGEgcGFyYW1ldGVyIHN0cmluZ1xuICAgIC8vIEN1cnJlbnQgY29udGV4dCA9IHJlZiBnZW5vbWUgKyBjb21wIGdlbm9tZXMgKyBjdXJyZW50IHJhbmdlIChjaHIsc3RhcnQsZW5kKVxuICAgIGdldFBhcmFtU3RyaW5nICgpIHtcblx0bGV0IGMgPSB0aGlzLmdldENvbnRleHQoKTtcbiAgICAgICAgbGV0IHJlZiA9IGByZWY9JHtjLnJlZn1gO1xuICAgICAgICBsZXQgZ2Vub21lcyA9IGBnZW5vbWVzPSR7Yy5nZW5vbWVzLmpvaW4oXCIrXCIpfWA7XG5cdGxldCBjb29yZHMgPSBgY2hyPSR7Yy5jaHJ9JnN0YXJ0PSR7Yy5zdGFydH0mZW5kPSR7Yy5lbmR9YDtcblx0bGV0IGxmbGYgPSBjLmZsYW5rID8gJyZmbGFuaz0nK2MuZmxhbmsgOiAnJmxlbmd0aD0nK2MubGVuZ3RoO1xuXHRsZXQgbGNvb3JkcyA9IGBsYW5kbWFyaz0ke2MubGFuZG1hcmt9JmRlbHRhPSR7Yy5kZWx0YX0ke2xmbGZ9YDtcblx0bGV0IGhscyA9IGBoaWdobGlnaHQ9JHtjLmhpZ2hsaWdodC5qb2luKFwiK1wiKX1gO1xuXHRsZXQgZG1vZGUgPSBgZG1vZGU9JHtjLmRtb2RlfWA7XG5cdHJldHVybiBgJHt0aGlzLmNtb2RlPT09J21hcHBlZCc/Y29vcmRzOmxjb29yZHN9JiR7ZG1vZGV9JiR7cmVmfSYke2dlbm9tZXN9JiR7aGxzfWA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0Q3VycmVudExpc3QgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyTGlzdDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0Q3VycmVudExpc3QgKGxzdCwgZ29Ub0ZpcnN0KSB7XG4gICAgXHQvL1xuXHRsZXQgcHJldkxpc3QgPSB0aGlzLmN1cnJMaXN0O1xuXHR0aGlzLmN1cnJMaXN0ID0gbHN0O1xuXHRpZiAobHN0ICE9PSBwcmV2TGlzdCkge1xuXHQgICAgdGhpcy5jdXJyTGlzdEluZGV4ID0gbHN0ID8gbHN0Lmlkcy5yZWR1Y2UoICh4LGkpID0+IHsgeFtpXT1pOyByZXR1cm4geDsgfSwge30pIDoge307XG5cdCAgICB0aGlzLmN1cnJMaXN0Q291bnRlciA9IDA7XG5cdH1cblx0Ly9cblx0bGV0IGxpc3RzID0gZDMuc2VsZWN0KCcjbXlsaXN0cycpLnNlbGVjdEFsbCgnLmxpc3RJbmZvJyk7XG5cdGxpc3RzLmNsYXNzZWQoXCJjdXJyZW50XCIsIGQgPT4gZCA9PT0gbHN0KTtcblx0Ly9cblx0Ly8gc2hvdyB0aGlzIGxpc3QgYXMgdGljayBtYXJrcyBpbiB0aGUgZ2Vub21lIHZpZXdcblx0dGhpcy5nZW5vbWVWaWV3LmRyYXdUaWNrcyhsc3QgPyBsc3QuaWRzIDogW10pO1xuXHR0aGlzLmdlbm9tZVZpZXcuZHJhd1RpdGxlKCk7XG5cdHRoaXMuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdC8vXG5cdGlmIChnb1RvRmlyc3QpIHRoaXMuZ29Ub05leHRMaXN0RWxlbWVudCgpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnb1RvTmV4dExpc3RFbGVtZW50ICgpIHtcblx0aWYgKCF0aGlzLmN1cnJMaXN0IHx8IHRoaXMuY3Vyckxpc3QuaWRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHRsZXQgY3VycklkID0gdGhpcy5jdXJyTGlzdC5pZHNbdGhpcy5jdXJyTGlzdENvdW50ZXJdO1xuICAgICAgICB0aGlzLmN1cnJMaXN0Q291bnRlciA9ICh0aGlzLmN1cnJMaXN0Q291bnRlciArIDEpICUgdGhpcy5jdXJyTGlzdC5pZHMubGVuZ3RoO1xuXHR0aGlzLnNldENvb3JkaW5hdGVzKGN1cnJJZCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHBhbnpvb20ocGZhY3RvciwgemZhY3Rvcikge1xuXHQvL1xuXHQhcGZhY3RvciAmJiAocGZhY3RvciA9IDApO1xuXHQhemZhY3RvciAmJiAoemZhY3RvciA9IDEpO1xuXHQvL1xuXHRsZXQgYyA9IHRoaXMuY29vcmRzO1xuXHRsZXQgd2lkdGggPSBjLmVuZCAtIGMuc3RhcnQgKyAxO1xuXHRsZXQgbWlkID0gKGMuc3RhcnQgKyBjLmVuZCkvMjtcblx0bGV0IGNociA9IHRoaXMuckdlbm9tZS5jaHJvbW9zb21lcy5maWx0ZXIoYyA9PiBjLm5hbWUgPT09IHRoaXMuY29vcmRzLmNocilbMF07XG5cdGxldCBuY3h0ID0ge307IC8vIG5ldyBjb250ZXh0XG5cdGxldCBtaW5EID0gLShjLnN0YXJ0LTEpOyAvLyBtaW4gZGVsdGEgKGF0IGN1cnJlbnQgem9vbSlcblx0bGV0IG1heEQgPSBjaHIubGVuZ3RoIC0gYy5lbmQ7IC8vIG1heCBkZWx0YSAoYXQgY3VycmVudCB6b29tKVxuXHRsZXQgZCA9IGNsaXAocGZhY3RvciAqIHdpZHRoLCBtaW5ELCBtYXhEKTsgLy8gZGVsdGEgKGF0IG5ldyB6b29tKVxuXHRsZXQgbmV3d2lkdGggPSB6ZmFjdG9yICogd2lkdGg7XG5cdGxldCBuZXdzdGFydCA9IG1pZCAtIG5ld3dpZHRoLzIgKyBkO1xuXHQvL1xuXHRpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpIHtcblx0ICAgIG5jeHQuY2hyID0gYy5jaHI7XG5cdCAgICBuY3h0LnN0YXJ0ID0gbmV3c3RhcnQ7XG5cdCAgICBuY3h0LmVuZCA9IG5ld3N0YXJ0ICsgbmV3d2lkdGggLSAxO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgbmN4dC5sZW5ndGggPSBuZXd3aWR0aDtcblx0ICAgIG5jeHQuZGVsdGEgPSB0aGlzLmxjb29yZHMuZGVsdGEgKyBkIDtcblx0fVxuXHR0aGlzLnNldENvbnRleHQobmN4dCk7XG4gICAgfVxuICAgIHpvb20gKGZhY3Rvcikge1xuICAgICAgICB0aGlzLnBhbnpvb20obnVsbCwgZmFjdG9yKTtcbiAgICB9XG4gICAgcGFuIChmYWN0b3IpIHtcbiAgICAgICAgdGhpcy5wYW56b29tKGZhY3RvciwgbnVsbCk7XG4gICAgfVx0XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gWm9vbXMgaW4vb3V0IGJ5IGZhY3Rvci4gTmV3IHpvb20gd2lkdGggaXMgZmFjdG9yICogdGhlIGN1cnJlbnQgd2lkdGguXG4gICAgLy8gRmFjdG9yID4gMSB6b29tcyBvdXQsIDAgPCBmYWN0b3IgPCAxIHpvb21zIGluLlxuICAgIHh6b29tIChmYWN0b3IpIHtcblx0bGV0IGxlbiA9IHRoaXMuY29vcmRzLmVuZCAtIHRoaXMuY29vcmRzLnN0YXJ0ICsgMTtcblx0bGV0IG5ld2xlbiA9IE1hdGgucm91bmQoZmFjdG9yICogbGVuKTtcblx0bGV0IHggPSAodGhpcy5jb29yZHMuc3RhcnQgKyB0aGlzLmNvb3Jkcy5lbmQpLzI7XG5cdGlmICh0aGlzLmNtb2RlID09PSAnbWFwcGVkJykge1xuXHQgICAgbGV0IG5ld3N0YXJ0ID0gTWF0aC5yb3VuZCh4IC0gbmV3bGVuLzIpO1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgY2hyOiB0aGlzLmNvb3Jkcy5jaHIsIHN0YXJ0OiBuZXdzdGFydCwgZW5kOiBuZXdzdGFydCArIG5ld2xlbiAtIDEgfSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICB0aGlzLnNldENvbnRleHQoeyBsZW5ndGg6IG5ld2xlbiB9KTtcblx0fVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFBhbnMgdGhlIHZpZXcgbGVmdCBvciByaWdodCBieSBmYWN0b3IuIFRoZSBkaXN0YW5jZSBtb3ZlZCBpcyBmYWN0b3IgdGltZXMgdGhlIGN1cnJlbnQgem9vbSB3aWR0aC5cbiAgICAvLyBOZWdhdGl2ZSB2YWx1ZXMgcGFuIGxlZnQuIFBvc2l0aXZlIHZhbHVlcyBwYW4gcmlnaHQuIChOb3RlIHRoYXQgcGFubmluZyBtb3ZlcyB0aGUgXCJjYW1lcmFcIi4gUGFubmluZyB0byB0aGVcbiAgICAvLyByaWdodCBtYWtlcyB0aGUgb2JqZWN0cyBpbiB0aGUgc2NlbmUgYXBwZWFyIHRvIG1vdmUgdG8gdGhlIGxlZnQsIGFuZCB2aWNlIHZlcnNhLilcbiAgICAvL1xuICAgIHhwYW4gKGZhY3Rvcikge1xuXHRsZXQgYyA9IHRoaXMuY29vcmRzO1xuXHRsZXQgY2hyID0gdGhpcy5yR2Vub21lLmNocm9tb3NvbWVzLmZpbHRlcihjID0+IGMubmFtZSA9PT0gdGhpcy5jb29yZHMuY2hyKVswXTtcblx0bGV0IHdpZHRoID0gYy5lbmQgLSBjLnN0YXJ0ICsgMTtcblx0bGV0IG1pbkQgPSAtKGMuc3RhcnQtMSk7XG5cdGxldCBtYXhEID0gY2hyLmxlbmd0aCAtIGMuZW5kO1xuXHRsZXQgZCA9IGNsaXAoZmFjdG9yICogd2lkdGgsIG1pbkQsIG1heEQpO1xuXHRpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpIHtcblx0ICAgIHRoaXMuc2V0Q29udGV4dCh7IGNocjogYy5jaHIsIHN0YXJ0OiBjLnN0YXJ0K2QsIGVuZDogYy5lbmQrZCB9KTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuc2V0Q29udGV4dCh7IGRlbHRhOiB0aGlzLmxjb29yZHMuZGVsdGEgKyBkIH0pO1xuXHR9XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdEZlYXRUeXBlQ29udHJvbCAoZmFjZXQpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgY29sb3JzID0gdGhpcy5jc2NhbGUuZG9tYWluKCkubWFwKGxibCA9PiB7XG5cdCAgICByZXR1cm4geyBsYmw6bGJsLCBjbHI6dGhpcy5jc2NhbGUobGJsKSB9O1xuXHR9KTtcblx0bGV0IGNrZXMgPSBkMy5zZWxlY3QoXCIuY29sb3JLZXlcIilcblx0ICAgIC5zZWxlY3RBbGwoJy5jb2xvcktleUVudHJ5Jylcblx0XHQuZGF0YShjb2xvcnMpO1xuXHRsZXQgbmNzID0gY2tlcy5lbnRlcigpLmFwcGVuZChcImRpdlwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBcImNvbG9yS2V5RW50cnkgZmxleHJvd1wiKTtcblx0bmNzLmFwcGVuZChcImRpdlwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwic3dhdGNoXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgYyA9PiBjLmxibClcblx0ICAgIC5zdHlsZShcImJhY2tncm91bmQtY29sb3JcIiwgYyA9PiBjLmNscilcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgdCA9IGQzLnNlbGVjdCh0aGlzKTtcblx0ICAgICAgICB0LmNsYXNzZWQoXCJjaGVja2VkXCIsICEgdC5jbGFzc2VkKFwiY2hlY2tlZFwiKSk7XG5cdFx0bGV0IHN3YXRjaGVzID0gZDMuc2VsZWN0QWxsKFwiLnN3YXRjaC5jaGVja2VkXCIpWzBdO1xuXHRcdGxldCBmdHMgPSBzd2F0Y2hlcy5tYXAocz0+cy5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpKVxuXHRcdGZhY2V0LnNldFZhbHVlcyhmdHMpO1xuXHRcdHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdCAgICB9KVxuXHQgICAgLmFwcGVuZChcImlcIilcblx0ICAgICAgICAuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29uc1wiKTtcblx0bmNzLmFwcGVuZChcInNwYW5cIilcblx0ICAgIC50ZXh0KGMgPT4gYy5sYmwpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhckNhY2hlZERhdGEgKGFzaykge1xuXHRpZiAoIWFzayB8fCB3aW5kb3cuY29uZmlybSgnRGVsZXRlIGFsbCBjYWNoZWQgZGF0YS4gQXJlIHlvdSBzdXJlPycpKSB7XG5cdCAgICB0aGlzLmZlYXR1cmVNYW5hZ2VyLmNsZWFyQ2FjaGVkRGF0YSgpO1xuXHQgICAgdGhpcy50cmFuc2xhdG9yLmNsZWFyQ2FjaGVkRGF0YSgpO1xuXHR9XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGlua1RvTWdpU25wUmVwb3J0ICgpIHtcblx0bGV0IGMgPSB0aGlzLmdldENvbnRleHQoKTtcblx0bGV0IHVybEJhc2UgPSAnaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL3NucC9zdW1tYXJ5Jztcblx0bGV0IHRhYkFyZyA9ICdzZWxlY3RlZFRhYj0xJztcblx0bGV0IHNlYXJjaEJ5QXJnID0gJ3NlYXJjaEJ5U2FtZURpZmY9Jztcblx0bGV0IGNockFyZyA9IGBzZWxlY3RlZENocm9tb3NvbWU9JHtjLmNocn1gO1xuXHRsZXQgY29vcmRBcmcgPSBgY29vcmRpbmF0ZT0ke2Muc3RhcnR9LSR7Yy5lbmR9YDtcblx0bGV0IHVuaXRBcmcgPSAnY29vcmRpbmF0ZVVuaXQ9YnAnO1xuXHRsZXQgY3NBcmdzID0gYy5nZW5vbWVzLm1hcChnID0+IGBzZWxlY3RlZFN0cmFpbnM9JHtnfWApXG5cdGxldCByc0FyZyA9IGByZWZlcmVuY2VTdHJhaW49JHtjLnJlZn1gO1xuXHRsZXQgbGlua1VybCA9IGAke3VybEJhc2V9PyR7dGFiQXJnfSYke3NlYXJjaEJ5QXJnfSYke2NockFyZ30mJHtjb29yZEFyZ30mJHt1bml0QXJnfSYke3JzQXJnfSYke2NzQXJncy5qb2luKCcmJyl9YFxuXHR3aW5kb3cub3BlbihsaW5rVXJsLCBcIl9ibGFua1wiKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGlua1RvTWdpUVRMcyAoKSB7XG5cdGxldCBjICAgICAgICA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRsZXQgdXJsQmFzZSAgPSAnaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL2FsbGVsZS9zdW1tYXJ5Jztcblx0bGV0IGNockFyZyAgID0gYGNocm9tb3NvbWU9JHtjLmNocn1gO1xuXHRsZXQgY29vcmRBcmcgPSBgY29vcmRpbmF0ZT0ke2Muc3RhcnR9LSR7Yy5lbmR9YDtcblx0bGV0IHVuaXRBcmcgID0gJ2Nvb3JkVW5pdD1icCc7XG5cdGxldCB0eXBlQXJnICA9ICdhbGxlbGVUeXBlPVFUTCc7XG5cdGxldCBsaW5rVXJsICA9IGAke3VybEJhc2V9PyR7Y2hyQXJnfSYke2Nvb3JkQXJnfSYke3VuaXRBcmd9JiR7dHlwZUFyZ31gO1xuXHR3aW5kb3cub3BlbihsaW5rVXJsLCBcIl9ibGFua1wiKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGlua1RvTWdpSkJyb3dzZSAoKSB7XG5cdGxldCBjID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdGxldCB1cmxCYXNlID0gJ2h0dHA6Ly9qYnJvd3NlLmluZm9ybWF0aWNzLmpheC5vcmcvJztcblx0bGV0IGRhdGFBcmcgPSAnZGF0YT1kYXRhJTJGbW91c2UnOyAvLyBcImRhdGEvbW91c2VcIlxuXHRsZXQgbG9jQXJnICA9IGBsb2M9Y2hyJHtjLmNocn0lM0Eke2Muc3RhcnR9Li4ke2MuZW5kfWA7XG5cdGxldCB0cmFja3MgID0gWydETkEnLCdNR0lfR2Vub21lX0ZlYXR1cmVzJywnTkNCSV9DQ0RTJywnTkNCSScsJ0VOU0VNQkwnXTtcblx0bGV0IHRyYWNrc0FyZz1gdHJhY2tzPSR7dHJhY2tzLmpvaW4oJywnKX1gO1xuXHRsZXQgaGlnaGxpZ2h0QXJnID0gJ2hpZ2hsaWdodD0nO1xuXHRsZXQgbGlua1VybCA9IGAke3VybEJhc2V9PyR7IFtkYXRhQXJnLGxvY0FyZyx0cmFja3NBcmcsaGlnaGxpZ2h0QXJnXS5qb2luKCcmJykgfWA7XG5cdHdpbmRvdy5vcGVuKGxpbmtVcmwsIFwiX2JsYW5rXCIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEb3dubG9hZHMgRE5BIHNlcXVlbmNlcyBvZiB0aGUgc3BlY2lmaWVkIHR5cGUgaW4gRkFTVEEgZm9ybWF0IGZvciB0aGUgc3BlY2lmaWVkIGZlYXR1cmUuXG4gICAgLy8gSWYgZ2Vub21lcyBpcyBzcGVjaWZpZWQsIGxpc3RzIHRoZSBzcGVjaWZpYyBnZW5vbWVzIHRvIHJldHJpZXZlIGZyb207IG90aGVyd2lzZSByZXRyaWV2ZXMgZnJvbSBhbGwgZ2Vub21lcy5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBmIChvYmplY3QpIHRoZSBmZWF0dXJlXG4gICAgLy8gICAgIHR5cGUgKHN0cmluZykgd2hpY2ggc2VxdWVuY2VzIHRvIGRvd25sb2FkOiAnZ2Vub21pYycsJ2V4b24nLCdDRFMnLFxuICAgIC8vICAgICBnZW5vbWVzIChsaXN0IG9mIHN0cmluZ3MpIG5hbWVzIG9mIGdlbm9tZXMgdG8gcmV0cmlldmUgZnJvbS4gSWYgbm90IHNwZWNpZmllZCxcbiAgICAvLyAgICAgICAgIHJldHJpZXZlcyBzZXF1ZW5lY3MgZnJvbSBhbGwgYXZhaWxhYmxlIG1vdXNlIGdlbm9tZXMuXG4gICAgLy9cbiAgICBkb3dubG9hZEZhc3RhIChmLCB0eXBlLCBnZW5vbWVzKSB7XG5cdGxldCBxID0gdGhpcy5xdWVyeU1hbmFnZXIuYXV4RGF0YU1hbmFnZXIuc2VxdWVuY2VzRm9yRmVhdHVyZShmLCB0eXBlLCBnZW5vbWVzKVxuXHRpZiAocSkgd2luZG93Lm9wZW4ocSxcIl9ibGFua1wiKTtcbiAgICB9XG4gICAgbGlua1RvUmVwb3J0UGFnZSAoZikge1xuICAgICAgICBsZXQgdSA9IHRoaXMucXVlcnlNYW5hZ2VyLmF1eERhdGFNYW5hZ2VyLmxpbmtUb1JlcG9ydFBhZ2UoZi5pZCk7XG5cdHdpbmRvdy5vcGVuKHUsICdfYmxhbmsnKVxuICAgIH1cbn0gLy8gZW5kIGNsYXNzIE1HVkFwcFxuXG5leHBvcnQgeyBNR1ZBcHAgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL01HVkFwcC5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBHZW5vbWUge1xuICBjb25zdHJ1Y3RvciAoY2ZnKSB7XG4gICAgdGhpcy5uYW1lID0gY2ZnLm5hbWU7XG4gICAgdGhpcy5sYWJlbD0gY2ZnLmxhYmVsO1xuICAgIHRoaXMuY2hyb21vc29tZXMgPSBbXTtcbiAgICB0aGlzLm1heGxlbiA9IC0xO1xuICAgIHRoaXMueHNjYWxlID0gbnVsbDtcbiAgICB0aGlzLnlzY2FsZSA9IG51bGw7XG4gICAgdGhpcy56b29tWSAgPSAtMTtcbiAgfVxuICBnZXRDaHJvbW9zb21lIChuKSB7XG4gICAgICBpZiAodHlwZW9mKG4pID09PSAnc3RyaW5nJylcblx0ICByZXR1cm4gdGhpcy5jaHJvbW9zb21lcy5maWx0ZXIoYyA9PiBjLm5hbWUgPT09IG4pWzBdO1xuICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiB0aGlzLmNocm9tb3NvbWVzW25dO1xuICB9XG4gIGhhc0Nocm9tb3NvbWUgKG4pIHtcbiAgICAgIHJldHVybiB0aGlzLmdldENocm9tb3NvbWUobikgPyB0cnVlIDogZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IHsgR2Vub21lIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9HZW5vbWUuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtkM2pzb24sIGQzdHN2LCBvdmVybGFwcywgc3VidHJhY3R9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtGZWF0dXJlfSBmcm9tICcuL0ZlYXR1cmUnO1xuaW1wb3J0IHtLZXlTdG9yZX0gZnJvbSAnLi9LZXlTdG9yZSc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSG93IHRoZSBhcHAgbG9hZHMgZmVhdHVyZSBkYXRhLiBQcm92aWRlcyB0d28gY2FsbHM6XG4vLyBSZXF1ZXN0cyBmZWF0dXJlcyBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHJlZ2lzdGVycyB0aGVtIGluIGEgY2FjaGUuXG4vLyBJbnRlcmFjdHMgd2l0aCB0aGUgYmFjayBlbmQgdG8gbG9hZCBmZWF0dXJlcy5cbi8vXG5jbGFzcyBGZWF0dXJlTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcblx0dGhpcy5hdXhEYXRhTWFuYWdlciA9IHRoaXMuYXBwLnF1ZXJ5TWFuYWdlci5hdXhEYXRhTWFuYWdlcjtcbiAgICAgICAgdGhpcy5pZDJmZWF0ID0ge307XHRcdC8vIGluZGV4IGZyb20gIGZlYXR1cmUgSUQgdG8gZmVhdHVyZVxuXHR0aGlzLmNhbm9uaWNhbDJmZWF0cyA9IHt9O1x0Ly8gaW5kZXggZnJvbSBjYW5vbmljYWwgSUQgLT4gWyBmZWF0dXJlcyB0YWdnZWQgd2l0aCB0aGF0IGlkIF1cblx0dGhpcy5zeW1ib2wyZmVhdHMgPSB7fVx0XHQvLyBpbmRleCBmcm9tIHN5bWJvbCAtPiBbIGZlYXR1cmVzIGhhdmluZyB0aGF0IHN5bWJvbCBdXG5cdFx0XHRcdFx0Ly8gd2FudCBjYXNlIGluc2Vuc2l0aXZlIHNlYXJjaGVzLCBzbyBrZXlzIGFyZSBsb3dlciBjYXNlZFxuXHR0aGlzLmNhY2hlID0ge307XHRcdC8vIHtnZW5vbWUubmFtZSAtPiB7Y2hyLm5hbWUgLT4gbGlzdCBvZiBibG9ja3N9fVxuXHR0aGlzLm1pbmVGZWF0dXJlQ2FjaGUgPSB7fTtcdC8vIGF1eGlsaWFyeSBpbmZvIHB1bGxlZCBmcm9tIE1vdXNlTWluZSBcblx0dGhpcy5sb2FkZWRHZW5vbWVzID0gbmV3IFNldCgpOyAvLyB0aGUgc2V0IG9mIEdlbm9tZXMgdGhhdCBoYXZlIGJlZW4gZnVsbHkgbG9hZGVkXG5cdC8vXG5cdHRoaXMuZlN0b3JlID0gbmV3IEtleVN0b3JlKCdmZWF0dXJlcycpOyAvLyBtYXBzIGdlbm9tZSBuYW1lIC0+IGxpc3Qgb2YgZmVhdHVyZXNcbiAgICB9XG4gXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcHJvY2Vzc0ZlYXR1cmUgKGdlbm9tZSwgZCkge1xuXHQvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCB0aGlzIG9uZSBpbiB0aGUgY2FjaGUsIHJldHVybiBpdC5cblx0bGV0IGYgPSB0aGlzLmlkMmZlYXRbZC5JRF07XG5cdGlmIChmKSByZXR1cm4gZjtcblx0Ly8gQ3JlYXRlIGEgbmV3IEZlYXR1cmVcblx0ZiA9IG5ldyBGZWF0dXJlKGQpO1xuXHRmLmdlbm9tZSA9IGdlbm9tZVxuXHQvLyBSZWdpc3RlciBpdC5cblx0dGhpcy5pZDJmZWF0W2YuSURdID0gZjtcblx0Ly8gZ2Vub21lIGNhY2hlXG5cdGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdID0gKHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdIHx8IHt9KTtcblx0Ly8gY2hyb21vc29tZSBjYWNoZSAody9pbiBnZW5vbWUpXG5cdGxldCBjYyA9IGdjW2YuY2hyXSA9IChnY1tmLmNocl0gfHwgW10pO1xuXHRjYy5wdXNoKGYpO1xuXHQvL1xuXHRpZiAoZi5jYW5vbmljYWwgJiYgZi5jYW5vbmljYWwgIT09ICcuJykge1xuXHQgICAgbGV0IGxzdCA9IHRoaXMuY2Fub25pY2FsMmZlYXRzW2YuY2Fub25pY2FsXSA9ICh0aGlzLmNhbm9uaWNhbDJmZWF0c1tmLmNhbm9uaWNhbF0gfHwgW10pO1xuXHQgICAgbHN0LnB1c2goZik7XG5cdH1cblx0aWYgKGYuc3ltYm9sICYmIGYuc3ltYm9sICE9PSAnLicpIHtcblx0ICAgIGxldCBzID0gZi5zeW1ib2wudG9Mb3dlckNhc2UoKTtcblx0ICAgIGxldCBsc3QgPSB0aGlzLnN5bWJvbDJmZWF0c1tzXSA9ICh0aGlzLnN5bWJvbDJmZWF0c1tzXSB8fCBbXSk7XG5cdCAgICBsc3QucHVzaChmKTtcblx0fVxuXHQvLyBoZXJlIHknZ28uXG5cdHJldHVybiBmO1xuICAgIH1cbiAgICAvL1xuICAgIHByb2Nlc3NFeG9uIChlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicHJvY2VzcyBleG9uOiBcIiwgZSk7XG5cdGxldCBmZWF0ID0gdGhpcy5pZDJmZWF0W2UuZ2VuZS5wcmltYXJ5SWRlbnRpZmllcl07XG5cdGlmIChmZWF0LmV4b25zID09PSBudWxsKVxuXHQgICAgZmVhdC5leG9ucyA9IFtdO1xuXHRmZWF0LmV4b25zLnB1c2goe1xuXHQgICAgSUQ6IGUucHJpbWFyeUlkZW50aWZpZXIsXG5cdCAgICB0cmFuc2NyaXB0SURzOiBlLnRyYW5zY3JpcHRzLm1hcCh0ID0+IHQucHJpbWFyeUlkZW50aWZpZXIpLFxuXHQgICAgY2hyOiBlLmNocm9tb3NvbWUucHJpbWFyeUlkZW50aWZpZXIsXG5cdCAgICBzdGFydDogZS5jaHJvbW9zb21lTG9jYXRpb24uc3RhcnQsXG5cdCAgICBlbmQ6ICAgZS5jaHJvbW9zb21lTG9jYXRpb24uZW5kLFxuXHQgICAgZmVhdHVyZTogZmVhdFxuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQcm9jZXNzZXMgdGhlIFwicmF3XCIgZmVhdHVyZXMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlci5cbiAgICAvLyBUdXJucyB0aGVtIGludG8gRmVhdHVyZSBvYmplY3RzIGFuZCByZWdpc3RlcnMgdGhlbS5cbiAgICAvLyBJZiB0aGUgc2FtZSByYXcgZmVhdHVyZSBpcyByZWdpc3RlcmVkIGFnYWluLFxuICAgIC8vIHRoZSBGZWF0dXJlIG9iamVjdCBjcmVhdGVkIHRoZSBmaXJzdCB0aW1lIGlzIHJldHVybmVkLlxuICAgIC8vIChJLmUuLCByZWdpc3RlcmluZyB0aGUgc2FtZSBmZWF0dXJlIG11bHRpcGxlIHRpbWVzIGlzIG9rKVxuICAgIC8vXG4gICAgcHJvY2Vzc0ZlYXR1cmVzIChnZW5vbWUsIGZlYXRzKSB7XG5cdGZlYXRzLnNvcnQoIChhLGIpID0+IHtcblx0ICAgIGlmIChhLmNociA8IGIuY2hyKVxuXHRcdHJldHVybiAtMTtcblx0ICAgIGVsc2UgaWYgKGEuY2hyID4gYi5jaHIpXG5cdFx0cmV0dXJuIDE7XG5cdCAgICBlbHNlXG5cdFx0cmV0dXJuIGEuc3RhcnQgLSBiLnN0YXJ0O1xuXHR9KTtcblx0dGhpcy5mU3RvcmUuc2V0KGdlbm9tZS5uYW1lLCBmZWF0cyk7XG5cdHJldHVybiBmZWF0cy5tYXAoZCA9PiB0aGlzLnByb2Nlc3NGZWF0dXJlKGdlbm9tZSwgZCkpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGVuc3VyZUZlYXR1cmVzQnlHZW5vbWUgKGdlbm9tZSkge1xuXHRpZiAodGhpcy5sb2FkZWRHZW5vbWVzLmhhcyhnZW5vbWUpKVxuXHQgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcblx0cmV0dXJuIHRoaXMuZlN0b3JlLmdldChnZW5vbWUubmFtZSkudGhlbihkYXRhID0+IHtcblx0ICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcblx0XHRjb25zb2xlLmxvZyhcIlJlcXVlc3Rpbmc6XCIsIGdlbm9tZS5uYW1lLCApO1xuXHRcdGxldCB1cmwgPSBgLi9kYXRhL2dlbm9tZWRhdGEvJHtnZW5vbWUubmFtZX0tZmVhdHVyZXMudHN2YDtcblx0XHRyZXR1cm4gZDN0c3YodXJsKS50aGVuKCBmZWF0cyA9PiB7XG5cdFx0ICAgIGZlYXRzID0gdGhpcy5wcm9jZXNzRmVhdHVyZXMoZ2Vub21lLCBmZWF0cyk7XG5cdFx0fSk7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRjb25zb2xlLmxvZyhcIkZvdW5kIGluIGNhY2hlOlwiLCBnZW5vbWUubmFtZSwgKTtcblx0XHRsZXQgZmVhdHMgPSB0aGlzLnByb2Nlc3NGZWF0dXJlcyhnZW5vbWUsIGRhdGEpO1xuXHRcdHJldHVybiB0cnVlO1xuXHQgICAgfVxuXHR9KS50aGVuKCAoKT0+IHtcblx0ICAgIHRoaXMubG9hZGVkR2Vub21lcy5hZGQoZ2Vub21lKTsgIFxuXHQgICAgdGhpcy5hcHAuc2hvd1N0YXR1cyhgTG9hZGVkOiAke2dlbm9tZS5uYW1lfWApO1xuXHQgICAgcmV0dXJuIHRydWU7IFxuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gYWxsIGV4b25zIGZvciB0aGUgZ2l2ZW4gc2V0IG9mIGdlbmUgaWRzLlxuICAgIC8vIEdlbmUgSURzIGFyZSBnZW5vbWUtc3BlY2lmaWMsIE5PVCBjYW5vbmljYWwuXG4gICAgLy9cbiAgICBlbnN1cmVFeG9uc0J5R2VuZUlkcyAoaWRzKSB7XG5cdC8vIE1hcCBpZHMgdG8gRmVhdHVyZSBvYmplY3RzLCBmaWx0ZXIgZm9yIHRob3NlIHdoZXJlIGV4b25zIGhhdmUgbm90IGJlZW4gcmV0cmlldmVkIHlldFxuXHQvLyBFeG9ucyBhY2N1bXVsYXRlIGluIHRoZWlyIGZlYXR1cmVzIC0gbm8gY2FjaGUgZXZpY3Rpb24gaW1wbGVtZW50ZWQgeWV0LiBGSVhNRS5cblx0Ly8gXG5cdGxldCBmZWF0cyA9IChpZHN8fFtdKS5tYXAoaSA9PiB0aGlzLmlkMmZlYXRbaV0pLmZpbHRlcihmID0+IHtcblx0ICAgIGlmICghIGYgfHwgZi5leG9ucyAhPT0gbnVsbClcblx0ICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAvLyBtYWtlIHN1cmUgd2Ugb25seSBjaGVjayBmb3IgdGhpcyBmZWF0dXJlIG9uY2Vcblx0ICAgIGYuZXhvbnMgPSBbXTtcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9KTtcblx0aWYgKGZlYXRzLmxlbmd0aCA9PT0gMClcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0cmV0dXJuIHRoaXMuYXV4RGF0YU1hbmFnZXIuZXhvbnNCeUdlbmVJZHMoZmVhdHMubWFwKGY9PmYuSUQpKS50aGVuKGV4b25zID0+IHtcblx0ICAgIGV4b25zLmZvckVhY2goIGUgPT4geyB0aGlzLnByb2Nlc3NFeG9uKGUpOyB9KTtcblx0fSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFsbCBleG9ucyBmb3IgZ2VuZXMgaW4gdGhlIHNwZWNpZmllZCBnZW5vbWVcbiAgICAvLyB0aGF0IG92ZXJsYXAgdGhlIHNwZWNpZmllZCByYW5nZS5cbiAgICAvL1xuICAgIGVuc3VyZUV4b25zQnlSYW5nZSAoZ2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQpIHtcblx0cmV0dXJuIHRoaXMuYXV4RGF0YU1hbmFnZXIuZXhvbnNCeVJhbmdlKGdlbm9tZSxjaHIsc3RhcnQsZW5kKS50aGVuKGV4b25zID0+IHtcblx0ICAgIGV4b25zLmZvckVhY2goIGUgPT4ge1xuXHQgICAgICAgIHRoaXMucHJvY2Vzc0V4b24oZSk7XG5cdCAgICB9KTtcblx0fSk7XG4gICAgfVxuICAgICovXG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsb2FkR2Vub21lcyAoZ2Vub21lcykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoZ2Vub21lcy5tYXAoZyA9PiB0aGlzLmVuc3VyZUZlYXR1cmVzQnlHZW5vbWUgKGcpKSkudGhlbigoKT0+dHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXNCeVJhbmdlIChnZW5vbWUsIHJhbmdlKSB7XG4gICAgICAgIGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdIDtcblx0aWYgKCFnYykgcmV0dXJuIFtdO1xuXHRsZXQgY0ZlYXRzID0gZ2NbcmFuZ2UuY2hyXTtcblx0aWYgKCFjRmVhdHMpIHJldHVybiBbXTtcblx0Ly8gRklYTUU6IHNob3VsZCBiZSBzbWFydGVyIHRoYW4gdGVzdGluZyBldmVyeSBmZWF0dXJlIVxuXHRsZXQgZmVhdHMgPSBjRmVhdHMuZmlsdGVyKGNmID0+IG92ZXJsYXBzKGNmLCByYW5nZSkpO1xuICAgICAgICByZXR1cm4gZmVhdHM7XHRcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGFsbCBjYWNoZWQgZmVhdHVyZXMgaGF2aW5nIHRoZSBnaXZlbiBjYW5vbmljYWwgaWQuXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZUJ5SWQgKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkMmZlYXRzW2lkXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGFsbCBjYWNoZWQgZmVhdHVyZXMgaGF2aW5nIHRoZSBnaXZlbiBjYW5vbmljYWwgaWQuXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkIChjaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2Fub25pY2FsMmZlYXRzW2NpZF0gfHwgW107XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIGxpc3Qgb2YgZmVhdHVyZXMgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gbGFiZWwsIHdoaWNoIGNhbiBiZSBhbiBpZCwgY2Fub25pY2FsIGlkLCBvciBzeW1ib2wuXG4gICAgLy8gSWYgZ2Vub21lIGlzIHNwZWNpZmllZCwgbGltaXQgcmVzdWx0cyB0byBmZWF0dXJlcyBmcm9tIHRoYXQgZ2Vub21lLlxuICAgIC8vIFxuICAgIGdldENhY2hlZEZlYXR1cmVzQnlMYWJlbCAobGFiZWwsIGdlbm9tZSkge1xuXHRsZXQgZiA9IHRoaXMuaWQyZmVhdFtsYWJlbF1cblx0bGV0IGZlYXRzID0gZiA/IFtmXSA6IHRoaXMuY2Fub25pY2FsMmZlYXRzW2xhYmVsXSB8fCB0aGlzLnN5bWJvbDJmZWF0c1tsYWJlbC50b0xvd2VyQ2FzZSgpXSB8fCBbXTtcblx0cmV0dXJuIGdlbm9tZSA/IGZlYXRzLmZpbHRlcihmPT4gZi5nZW5vbWUgPT09IGdlbm9tZSkgOiBmZWF0cztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIGZlYXR1cmVzIGluIFxuICAgIC8vIHRoZSBzcGVjaWZpZWQgcmFuZ2VzIG9mIHRoZSBzcGVjaWZpZWQgZ2Vub21lLlxuICAgIGdldEZlYXR1cmVzQnlSYW5nZSAoZ2Vub21lLCByYW5nZXMsIGdldEV4b25zKSB7XG5cdGxldCBmaWRzID0gW11cblx0bGV0IHAgPSB0aGlzLmVuc3VyZUZlYXR1cmVzQnlHZW5vbWUoZ2Vub21lKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJhbmdlcy5mb3JFYWNoKCByID0+IHtcblx0ICAgICAgICByLmZlYXR1cmVzID0gdGhpcy5nZXRDYWNoZWRGZWF0dXJlc0J5UmFuZ2UoZ2Vub21lLCByKSBcblx0XHRyLmdlbm9tZSA9IGdlbm9tZTtcblx0XHRmaWRzID0gZmlkcy5jb25jYXQoci5mZWF0dXJlcy5tYXAoZiA9PiBmLklEKSlcblx0ICAgIH0pO1xuXHQgICAgbGV0IHJlc3VsdHMgPSB7IGdlbm9tZSwgYmxvY2tzOnJhbmdlcyB9O1xuXHQgICAgcmV0dXJuIHJlc3VsdHM7XG5cdH0pO1xuXHRpZiAoZ2V0RXhvbnMpXG5cdCAgICBwID0gcC50aGVuKHJlc3VsdHMgPT4ge1xuXHQgICAgICAgIHJldHVybiB0aGlzLmVuc3VyZUV4b25zQnlHZW5lSWRzKGZpZHMpLnRoZW4oKCk9PnJlc3VsdHMpO1xuXHRcdH0pO1xuXHRyZXR1cm4gcDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBmZWF0dXJlcyBoYXZpbmcgdGhlIHNwZWNpZmllZCBpZHMgZnJvbSB0aGUgc3BlY2lmaWVkIGdlbm9tZS5cbiAgICBnZXRGZWF0dXJlc0J5SWQgKGdlbm9tZSwgaWRzLCBnZXRFeG9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnN1cmVGZWF0dXJlc0J5R2Vub21lKGdlbm9tZSkudGhlbiggKCkgPT4ge1xuXHQgICAgbGV0IGZlYXRzID0gW107XG5cdCAgICBsZXQgc2VlbiA9IG5ldyBTZXQoKTtcblx0ICAgIGxldCBhZGRmID0gKGYpID0+IHtcblx0XHRpZiAoZi5nZW5vbWUgIT09IGdlbm9tZSkgcmV0dXJuO1xuXHRcdGlmIChzZWVuLmhhcyhmLmlkKSkgcmV0dXJuO1xuXHRcdHNlZW4uYWRkKGYuaWQpO1xuXHRcdGZlYXRzLnB1c2goZik7XG5cdCAgICB9O1xuXHQgICAgbGV0IGFkZCA9IChmKSA9PiB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZikpIFxuXHRcdCAgICBmLmZvckVhY2goZmYgPT4gYWRkZihmZikpO1xuXHRcdGVsc2Vcblx0XHQgICAgYWRkZihmKTtcblx0ICAgIH07XG5cdCAgICBmb3IgKGxldCBpIG9mIGlkcyl7XG5cdFx0bGV0IGYgPSB0aGlzLmNhbm9uaWNhbDJmZWF0c1tpXSB8fCB0aGlzLmlkMmZlYXRbaV07XG5cdFx0ZiAmJiBhZGQoZik7XG5cdCAgICB9XG5cdCAgICBpZiAoZ2V0RXhvbnMpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5lbnN1cmVFeG9uc0J5R2VuZUlkcyhmZWF0cy5tYXAoZj0+Zi5JRCkpLnRoZW4oKCk9PmZlYXRzKTtcblx0ICAgIH1cblx0ICAgIGVsc2Vcblx0XHRyZXR1cm4gZmVhdHM7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhckNhY2hlZERhdGEgKCkge1xuXHRjb25zb2xlLmxvZyhcIkZlYXR1cmVNYW5hZ2VyOiBDYWNoZSBjbGVhcmVkLlwiKVxuICAgICAgICByZXR1cm4gdGhpcy5mU3RvcmUuY2xlYXIoKTtcbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIEZlYXR1cmUgTWFuYWdlclxuXG5leHBvcnQgeyBGZWF0dXJlTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIFN0b3JlIHtcclxuICAgIGNvbnN0cnVjdG9yKGRiTmFtZSA9ICdrZXl2YWwtc3RvcmUnLCBzdG9yZU5hbWUgPSAna2V5dmFsJykge1xyXG4gICAgICAgIHRoaXMuc3RvcmVOYW1lID0gc3RvcmVOYW1lO1xyXG4gICAgICAgIHRoaXMuX2RicCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb3BlbnJlcSA9IGluZGV4ZWREQi5vcGVuKGRiTmFtZSwgMSk7XHJcbiAgICAgICAgICAgIG9wZW5yZXEub25lcnJvciA9ICgpID0+IHJlamVjdChvcGVucmVxLmVycm9yKTtcclxuICAgICAgICAgICAgb3BlbnJlcS5vbnN1Y2Nlc3MgPSAoKSA9PiByZXNvbHZlKG9wZW5yZXEucmVzdWx0KTtcclxuICAgICAgICAgICAgLy8gRmlyc3QgdGltZSBzZXR1cDogY3JlYXRlIGFuIGVtcHR5IG9iamVjdCBzdG9yZVxyXG4gICAgICAgICAgICBvcGVucmVxLm9udXBncmFkZW5lZWRlZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIG9wZW5yZXEucmVzdWx0LmNyZWF0ZU9iamVjdFN0b3JlKHN0b3JlTmFtZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBfd2l0aElEQlN0b3JlKHR5cGUsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RicC50aGVuKGRiID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbih0aGlzLnN0b3JlTmFtZSwgdHlwZSk7XHJcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uY29tcGxldGUgPSAoKSA9PiByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uYWJvcnQgPSB0cmFuc2FjdGlvbi5vbmVycm9yID0gKCkgPT4gcmVqZWN0KHRyYW5zYWN0aW9uLmVycm9yKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sodHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodGhpcy5zdG9yZU5hbWUpKTtcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbn1cclxubGV0IHN0b3JlO1xyXG5mdW5jdGlvbiBnZXREZWZhdWx0U3RvcmUoKSB7XHJcbiAgICBpZiAoIXN0b3JlKVxyXG4gICAgICAgIHN0b3JlID0gbmV3IFN0b3JlKCk7XHJcbiAgICByZXR1cm4gc3RvcmU7XHJcbn1cclxuZnVuY3Rpb24gZ2V0KGtleSwgc3RvcmUgPSBnZXREZWZhdWx0U3RvcmUoKSkge1xyXG4gICAgbGV0IHJlcTtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkb25seScsIHN0b3JlID0+IHtcclxuICAgICAgICByZXEgPSBzdG9yZS5nZXQoa2V5KTtcclxuICAgIH0pLnRoZW4oKCkgPT4gcmVxLnJlc3VsdCk7XHJcbn1cclxuZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUsIHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkd3JpdGUnLCBzdG9yZSA9PiB7XHJcbiAgICAgICAgc3RvcmUucHV0KHZhbHVlLCBrZXkpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gZGVsKGtleSwgc3RvcmUgPSBnZXREZWZhdWx0U3RvcmUoKSkge1xyXG4gICAgcmV0dXJuIHN0b3JlLl93aXRoSURCU3RvcmUoJ3JlYWR3cml0ZScsIHN0b3JlID0+IHtcclxuICAgICAgICBzdG9yZS5kZWxldGUoa2V5KTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGNsZWFyKHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkd3JpdGUnLCBzdG9yZSA9PiB7XHJcbiAgICAgICAgc3RvcmUuY2xlYXIoKTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGtleXMoc3RvcmUgPSBnZXREZWZhdWx0U3RvcmUoKSkge1xyXG4gICAgY29uc3Qga2V5cyA9IFtdO1xyXG4gICAgcmV0dXJuIHN0b3JlLl93aXRoSURCU3RvcmUoJ3JlYWRvbmx5Jywgc3RvcmUgPT4ge1xyXG4gICAgICAgIC8vIFRoaXMgd291bGQgYmUgc3RvcmUuZ2V0QWxsS2V5cygpLCBidXQgaXQgaXNuJ3Qgc3VwcG9ydGVkIGJ5IEVkZ2Ugb3IgU2FmYXJpLlxyXG4gICAgICAgIC8vIEFuZCBvcGVuS2V5Q3Vyc29yIGlzbid0IHN1cHBvcnRlZCBieSBTYWZhcmkuXHJcbiAgICAgICAgKHN0b3JlLm9wZW5LZXlDdXJzb3IgfHwgc3RvcmUub3BlbkN1cnNvcikuY2FsbChzdG9yZSkub25zdWNjZXNzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBrZXlzLnB1c2godGhpcy5yZXN1bHQua2V5KTtcclxuICAgICAgICAgICAgdGhpcy5yZXN1bHQuY29udGludWUoKTtcclxuICAgICAgICB9O1xyXG4gICAgfSkudGhlbigoKSA9PiBrZXlzKTtcclxufVxuXG5leHBvcnQgeyBTdG9yZSwgZ2V0LCBzZXQsIGRlbCwgY2xlYXIsIGtleXMgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2lkYi1rZXl2YWwvZGlzdC9pZGIta2V5dmFsLm1qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBpbml0T3B0TGlzdCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgQXV4RGF0YU1hbmFnZXIgfSBmcm9tICcuL0F1eERhdGFNYW5hZ2VyJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBRdWVyeU1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMuY2ZnID0gY29uZmlnLlF1ZXJ5TWFuYWdlci5zZWFyY2hUeXBlcztcblx0dGhpcy5hdXhEYXRhTWFuYWdlciA9IG5ldyBBdXhEYXRhTWFuYWdlcigpO1xuXHR0aGlzLnNlbGVjdCA9IG51bGw7XHQvLyBteSA8c2VsZWN0PiBlbGVtZW50XG5cdHRoaXMudGVybSA9IG51bGw7XHQvLyBteSA8aW5wdXQ+IGVsZW1lbnRcblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuXHR0aGlzLnNlbGVjdCA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwic2VhcmNodHlwZVwiXScpO1xuXHR0aGlzLnRlcm0gICA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwic2VhcmNodGVybVwiXScpO1xuXHQvL1xuXHR0aGlzLnRlcm0uYXR0cihcInBsYWNlaG9sZGVyXCIsIHRoaXMuY2ZnWzBdLnBsYWNlaG9sZGVyKVxuXHRpbml0T3B0TGlzdCh0aGlzLnNlbGVjdFswXVswXSwgdGhpcy5jZmcsIGM9PmMubWV0aG9kLCBjPT5jLmxhYmVsKTtcblx0Ly8gV2hlbiB1c2VyIGNoYW5nZXMgdGhlIHF1ZXJ5IHR5cGUgKHNlbGVjdG9yKSwgY2hhbmdlIHRoZSBwbGFjZWhvbGRlciB0ZXh0LlxuXHR0aGlzLnNlbGVjdC5vbihcImNoYW5nZVwiLCAoKSA9PiB7XG5cdCAgICBsZXQgb3B0ID0gdGhpcy5zZWxlY3QucHJvcGVydHkoXCJzZWxlY3RlZE9wdGlvbnNcIilbMF07XG5cdCAgICB0aGlzLnRlcm0uYXR0cihcInBsYWNlaG9sZGVyXCIsIG9wdC5fX2RhdGFfXy5wbGFjZWhvbGRlcilcblx0ICAgIFxuXHR9KTtcblx0Ly8gV2hlbiB1c2VyIGVudGVycyBhIHNlYXJjaCB0ZXJtLCBydW4gYSBxdWVyeVxuXHR0aGlzLnRlcm0ub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xuXHQgICAgbGV0IHRlcm0gPSB0aGlzLnRlcm0ucHJvcGVydHkoXCJ2YWx1ZVwiKTtcblx0ICAgIHRoaXMudGVybS5wcm9wZXJ0eShcInZhbHVlXCIsXCJcIik7XG5cdCAgICBsZXQgc2VhcmNoVHlwZSAgPSB0aGlzLnNlbGVjdC5wcm9wZXJ0eShcInZhbHVlXCIpO1xuXHQgICAgbGV0IGxzdE5hbWUgPSB0ZXJtO1xuXHQgICAgZDMuc2VsZWN0KFwiI215bGlzdHNcIikuY2xhc3NlZChcImJ1c3lcIix0cnVlKTsgLy8gRklYTUUgLSByZWFjaG92ZXJcblx0ICAgIHRoaXMuYXV4RGF0YU1hbmFnZXJbc2VhcmNoVHlwZV0odGVybSlcdC8vIDwtIHJ1biB0aGUgcXVlcnlcblx0ICAgICAgLnRoZW4oZmVhdHMgPT4ge1xuXHRcdCAgLy8gRklYTUUgLSByZWFjaG92ZXIgLSB0aGlzIHdob2xlIGhhbmRsZXJcblx0XHQgIGxldCBsc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5jcmVhdGVMaXN0KGxzdE5hbWUsIGZlYXRzLm1hcChmID0+IGYucHJpbWFyeUlkZW50aWZpZXIpKVxuXHRcdCAgdGhpcy5hcHAubGlzdE1hbmFnZXIudXBkYXRlKGxzdCk7XG5cdFx0ICAvL1xuXHRcdCAgdGhpcy5hcHAuem9vbVZpZXcuaGlGZWF0cyA9IHt9O1xuXHRcdCAgZmVhdHMuZm9yRWFjaChmID0+IHRoaXMuYXBwLnpvb21WaWV3LmhpRmVhdHNbZi5jYW5vbmljYWxdID0gZi5jYW5vbmljYWwpO1xuXHRcdCAgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdFx0ICAvL1xuXHRcdCAgdGhpcy5hcHAuc2V0Q3VycmVudExpc3QobHN0LHRydWUpO1xuXHRcdCAgLy9cblx0XHQgIGQzLnNlbGVjdChcIiNteWxpc3RzXCIpLmNsYXNzZWQoXCJidXN5XCIsZmFsc2UpO1xuXHQgICAgICB9KTtcblx0fSlcbiAgICB9XG59XG5cbmV4cG9ydCB7IFF1ZXJ5TWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvUXVlcnlNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IGQzanNvbiwgZDN0ZXh0IH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXV4RGF0YU1hbmFnZXIgLSBrbm93cyBob3cgdG8gcXVlcnkgYW4gZXh0ZXJuYWwgc291cmNlIChpLmUuLCBNb3VzZU1pbmUpIGZvciBnZW5lc1xuLy8gYW5ub3RhdGVkIHRvIGRpZmZlcmVudCBvbnRvbG9naWVzIGFuZCBmb3IgZXhvbnMgYXNzb2NpYXRlZCB3aXRoIHNwZWNpZmljIGdlbmVzIG9yIHJlZ2lvbnMuXG5jbGFzcyBBdXhEYXRhTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuXHR0aGlzLmNmZyA9IGNvbmZpZy5BdXhEYXRhTWFuYWdlcjtcblx0aWYgKCF0aGlzLmNmZy5hbGxNaW5lc1t0aGlzLmNmZy5tb3VzZW1pbmVdKSBcblx0ICAgIHRocm93IFwiVW5rbm93biBtaW5lIG5hbWU6IFwiICsgdGhpcy5jZmcubW91c2VtaW5lO1xuXHR0aGlzLmJhc2VVcmwgPSB0aGlzLmNmZy5hbGxNaW5lc1t0aGlzLmNmZy5tb3VzZW1pbmVdO1xuXHRjb25zb2xlLmxvZyhcIk1vdXNlTWluZSB1cmw6XCIsIHRoaXMuYmFzZVVybCk7XG4gICAgICAgIHRoaXMucVVybCA9IHRoaXMuYmFzZVVybCArICcvc2VydmljZS9xdWVyeS9yZXN1bHRzPyc7XG5cdHRoaXMuclVybCA9IHRoaXMuYmFzZVVybCArICcvcG9ydGFsLmRvP2NsYXNzPVNlcXVlbmNlRmVhdHVyZSZleHRlcm5hbGlkcz0nXG5cdHRoaXMuZmFVcmwgPSB0aGlzLmJhc2VVcmwgKyAnL3NlcnZpY2UvcXVlcnkvcmVzdWx0cy9mYXN0YT8nO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRBdXhEYXRhIChxLCBmb3JtYXQpIHtcblx0Ly9jb25zb2xlLmxvZygnUXVlcnk6ICcgKyBxKTtcblx0Zm9ybWF0ID0gZm9ybWF0IHx8ICdqc29ub2JqZWN0cyc7XG5cdGxldCBxdWVyeSA9IGVuY29kZVVSSUNvbXBvbmVudChxKTtcblx0bGV0IHVybCA9IHRoaXMucVVybCArIGBmb3JtYXQ9JHtmb3JtYXR9JnF1ZXJ5PSR7cXVlcnl9YDtcblx0cmV0dXJuIGQzanNvbih1cmwpLnRoZW4oZGF0YSA9PiBkYXRhLnJlc3VsdHN8fFtdKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpc0lkZW50aWZpZXIgKHEpIHtcbiAgICAgICAgbGV0IHB0cyA9IHEuc3BsaXQoJzonKTtcbiAgICAgICAgaWYgKHB0cy5sZW5ndGggPT09IDIgJiYgcHRzWzFdLm1hdGNoKC9eWzAtOV0rJC8pKVxuXHQgICAgcmV0dXJuIHRydWU7XG5cdGlmIChxLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCgnci1tbXUtJykpXG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0cmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhZGRXaWxkY2FyZHMgKHEpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmlzSWRlbnRpZmllcihxKSB8fCBxLmluZGV4T2YoJyonKT49MCkgPyBxIDogYCoke3F9KmA7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGRvIGEgTE9PS1VQIHF1ZXJ5IGZvciBTZXF1ZW5jZUZlYXR1cmVzIGZyb20gTW91c2VNaW5lXG4gICAgZmVhdHVyZXNCeUxvb2t1cCAocXJ5U3RyaW5nKSB7XG5cdGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgICB2aWV3PVwiU2VxdWVuY2VGZWF0dXJlLnByaW1hcnlJZGVudGlmaWVyIFNlcXVlbmNlRmVhdHVyZS5zeW1ib2xcIiBcblx0ICAgIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEIgYW5kIENcIj5cblx0XHQ8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmVcIiBvcD1cIkxPT0tVUFwiIHZhbHVlPVwiJHtxcnlTdHJpbmd9XCIvPlxuXHRcdDxjb25zdHJhaW50IGNvZGU9XCJCXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vcmdhbmlzbS50YXhvbklkXCIgb3A9XCI9XCIgdmFsdWU9XCIxMDA5MFwiLz5cblx0XHQ8Y29uc3RyYWludCBjb2RlPVwiQ1wiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUuc2VxdWVuY2VPbnRvbG9neVRlcm0ubmFtZVwiIG9wPVwiIT1cIiB2YWx1ZT1cInRyYW5zZ2VuZVwiLz5cblx0ICAgIDwvcXVlcnk+YDtcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZmVhdHVyZXNCeU9udG9sb2d5VGVybSAocXJ5U3RyaW5nLCB0ZXJtVHlwZXMpIHtcblx0cXJ5U3RyaW5nID0gdGhpcy5hZGRXaWxkY2FyZHMocXJ5U3RyaW5nKTtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICB2aWV3PVwiU2VxdWVuY2VGZWF0dXJlLnByaW1hcnlJZGVudGlmaWVyIFNlcXVlbmNlRmVhdHVyZS5zeW1ib2xcIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCIGFuZCBDIGFuZCBEXCI+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJBXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vbnRvbG9neUFubm90YXRpb25zLm9udG9sb2d5VGVybS5wYXJlbnRzXCIgb3A9XCJMT09LVVBcIiB2YWx1ZT1cIiR7cXJ5U3RyaW5nfVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkJcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9yZ2FuaXNtLnRheG9uSWRcIiBvcD1cIj1cIiB2YWx1ZT1cIjEwMDkwXCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiQ1wiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUuc2VxdWVuY2VPbnRvbG9neVRlcm0ubmFtZVwiIG9wPVwiIT1cIiB2YWx1ZT1cInRyYW5zZ2VuZVwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkRcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLm9udG9sb2d5QW5ub3RhdGlvbnMub250b2xvZ3lUZXJtLm9udG9sb2d5Lm5hbWVcIiBvcD1cIk9ORSBPRlwiPlxuXHRcdCAgJHsgdGVybVR5cGVzLm1hcCh0dD0+ICc8dmFsdWU+Jyt0dCsnPC92YWx1ZT4nKS5qb2luKCcnKSB9XG5cdCAgICAgIDwvY29uc3RyYWludD5cblx0ICA8L3F1ZXJ5PmBcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZmVhdHVyZXNCeVBhdGh3YXlUZXJtIChxcnlTdHJpbmcpIHtcblx0cXJ5U3RyaW5nID0gdGhpcy5hZGRXaWxkY2FyZHMocXJ5U3RyaW5nKTtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG5hbWU9XCJcIiBtb2RlbD1cImdlbm9taWNcIiBcblx0ICB2aWV3PVwiR2VuZS5wcmltYXJ5SWRlbnRpZmllciBHZW5lLnN5bWJvbFwiIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEJcIj5cblx0ICAgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkdlbmUucGF0aHdheXNcIiBjb2RlPVwiQVwiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJHZW5lLm9yZ2FuaXNtLnRheG9uSWRcIiBjb2RlPVwiQlwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdCAgPC9xdWVyeT5gO1xuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmZWF0dXJlc0J5SWQgICAgICAgIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeUxvb2t1cChxcnlTdHJpbmcpOyB9XG4gICAgZmVhdHVyZXNCeUZ1bmN0aW9uICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlPbnRvbG9neVRlcm0ocXJ5U3RyaW5nLCBbXCJHZW5lIE9udG9sb2d5XCJdKTsgfVxuICAgIGZlYXR1cmVzQnlQaGVub3R5cGUgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5T250b2xvZ3lUZXJtKHFyeVN0cmluZywgW1wiTWFtbWFsaWFuIFBoZW5vdHlwZVwiLFwiRGlzZWFzZSBPbnRvbG9neVwiXSk7IH1cbiAgICBmZWF0dXJlc0J5UGF0aHdheSAgIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeVBhdGh3YXlUZXJtKHFyeVN0cmluZyk7IH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgYWxsIGV4b25zIG9mIGZlYXR1cmVzIG92ZXJsYXBwaW5nIGEgc3BlY2lmaWVkIHJhbmdlIGluIHRoZSBzcGVjaWZlZCBnZW5vbWUuXG4gICAgZXhvblZpZXcgKCkge1xuXHRyZXR1cm4gW1xuXHQgICAgJ0V4b24uZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXInLFxuXHQgICAgJ0V4b24uZ2VuZS5wcmltYXJ5SWRlbnRpZmllcicsXG5cdCAgICAnRXhvbi50cmFuc2NyaXB0cy5wcmltYXJ5SWRlbnRpZmllcicsXG5cdCAgICAnRXhvbi5wcmltYXJ5SWRlbnRpZmllcicsXG5cdCAgICAnRXhvbi5jaHJvbW9zb21lLnByaW1hcnlJZGVudGlmaWVyJyxcblx0ICAgICdFeG9uLmNocm9tb3NvbWVMb2NhdGlvbi5zdGFydCcsXG5cdCAgICAnRXhvbi5jaHJvbW9zb21lTG9jYXRpb24uZW5kJyxcblx0ICAgICdFeG9uLnN0cmFpbi5uYW1lJ1xuXHRdLmpvaW4oJyAnKTtcbiAgICB9XG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIGFsbCBleG9ucyBmcm9tIHRoZSBnaXZlbiBnZW5vbWUgd2hlcmUgdGhlIGV4b24ncyBnZW5lIG92ZXJsYXBzIHRoZSBnaXZlbiBjb29yZGluYXRlcy5cbiAgICBleG9uc0J5UmFuZ2VcdChnZW5vbWUsIGNociwgc3RhcnQsIGVuZCkge1xuICAgICAgICBsZXQgcSA9IGA8cXVlcnkgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIiR7dGhpcy5leG9uVmlldygpfVwiIGNvbnN0cmFpbnRMb2dpYz1cIkEgYW5kIEJcIj5cblx0ICAgIDxjb25zdHJhaW50IGNvZGU9XCJBXCIgcGF0aD1cIkV4b24uZ2VuZS5jaHJvbW9zb21lTG9jYXRpb25cIiBvcD1cIk9WRVJMQVBTXCI+XG5cdFx0PHZhbHVlPiR7Y2hyfToke3N0YXJ0fS4uJHtlbmR9PC92YWx1ZT5cblx0ICAgIDwvY29uc3RyYWludD5cblx0ICAgIDxjb25zdHJhaW50IGNvZGU9XCJCXCIgcGF0aD1cIkV4b24uc3RyYWluLm5hbWVcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7Z2Vub21lfVwiLz5cblx0ICAgIDwvcXVlcnk+YFxuXHRyZXR1cm4gdGhpcy5nZXRBdXhEYXRhKHEpO1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgYWxsIGV4b25zIG9mIGFsbCBnZW5vbG9ncyBvZiB0aGUgc3BlY2lmaWVkIGNhbm9uaWNhbCBnZW5lXG4gICAgZXhvbnNCeUNhbm9uaWNhbElkXHQoaWRlbnQpIHtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCIke3RoaXMuZXhvblZpZXcoKX1cIiA+XG5cdCAgICA8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJFeG9uLmdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiIC8+XG5cdCAgICA8L3F1ZXJ5PmBcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIGFsbCBleG9ucyBvZiB0aGUgc3BlY2lmaWVkIGdlbmUuXG4gICAgZXhvbnNCeUdlbmVJZFx0KGlkZW50KSB7XG4gICAgICAgIGxldCBxID0gYDxxdWVyeSBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiJHt0aGlzLmV4b25WaWV3KCl9XCIgPlxuXHQgICAgPGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiRXhvbi5nZW5lLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiIC8+XG5cdCAgICA8L3F1ZXJ5PmBcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIGFsbCBleG9ucyBvZiB0aGUgc3BlY2lmaWVkIGdlbmUuXG4gICAgZXhvbnNCeUdlbmVJZHNcdChpZGVudHMpIHtcblx0bGV0IHZhbHMgPSBpZGVudHMubWFwKGkgPT4gYDx2YWx1ZT4ke2l9PC92YWx1ZT5gKS5qb2luKCcnKTtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCIke3RoaXMuZXhvblZpZXcoKX1cIiA+XG5cdCAgICA8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJFeG9uLmdlbmUucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIk9ORSBPRlwiPiR7dmFsc308L2NvbnN0cmFpbnQ+XG5cdCAgICA8L3F1ZXJ5PmBcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ29uc3RydWN0cyBhIFVSTCBmb3IgbGlua2luZyB0byBhIE1vdXNlTWluZSByZXBvcnQgcGFnZSBieSBpZFxuICAgIGxpbmtUb1JlcG9ydFBhZ2UgKGlkZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJVcmwgKyBpZGVudDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ29uc3RydWN0cyBhIFVSTCB0byByZXRyaWV2ZSBtb3VzZSBzZXF1ZW5jZXMgb2YgdGhlIHNwZWNpZmllZCB0eXBlIGZvciB0aGUgc3BlY2lmaWVkIGZlYXR1cmUuXG4gICAgc2VxdWVuY2VzRm9yRmVhdHVyZSAoZiwgdHlwZSwgZ2Vub21lcykge1xuXHRsZXQgcTtcblx0bGV0IHVybDtcblx0bGV0IHZpZXc7XG5cdGxldCBpZGVudDtcbiAgICAgICAgLy9cblx0dHlwZSA9IHR5cGUgPyB0eXBlLnRvTG93ZXJDYXNlKCkgOiAnZ2Vub21pYyc7XG5cdC8vXG5cdGlmIChmLmNhbm9uaWNhbCkge1xuXHQgICAgaWRlbnQgPSBmLmNhbm9uaWNhbFxuXHQgICAgLy9cblx0ICAgIGxldCBncyA9ICcnXG5cdCAgICBsZXQgdmFscztcblx0ICAgIGlmIChnZW5vbWVzKSB7XG5cdFx0dmFscyA9IGdlbm9tZXMubWFwKChnKSA9PiBgPHZhbHVlPiR7Z308L3ZhbHVlPmApLmpvaW4oJycpO1xuXHQgICAgfVxuXHQgICAgc3dpdGNoICh0eXBlKSB7XG5cdCAgICBjYXNlICdnZW5vbWljJzpcblx0XHR2aWV3ID0gJ0dlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyJztcblx0XHRncyA9IGA8Y29uc3RyYWludCBwYXRoPVwiR2VuZS5zdHJhaW4ubmFtZVwiIG9wPVwiT05FIE9GXCI+JHt2YWxzfTwvY29uc3RyYWludD5gXG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cInNlcXVlbmNlc0J5Q2Fub25pY2FsSWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiR2VuZS5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiLz5cblx0XHQgICAgJHtnc308L3F1ZXJ5PmA7XG5cdFx0YnJlYWs7XG5cdCAgICBjYXNlICd0cmFuc2NyaXB0Jzpcblx0XHR2aWV3ID0gJ1RyYW5zY3JpcHQuZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXInO1xuXHRcdGdzID0gYDxjb25zdHJhaW50IHBhdGg9XCJUcmFuc2NyaXB0LnN0cmFpbi5uYW1lXCIgb3A9XCJPTkUgT0ZcIj4ke3ZhbHN9PC9jb25zdHJhaW50PmBcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwidHJhbnNjcmlwdFNlcXVlbmNlc0J5Q2Fub25pY2FsSWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiVHJhbnNjcmlwdC5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlRyYW5zY3JpcHQuZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgICAke2dzfTwvcXVlcnk+YDtcblx0ICAgICAgICBicmVhaztcblx0ICAgIGNhc2UgJ2V4b24nOlxuXHRcdHZpZXcgPSAnRXhvbi5nZW5lLmNhbm9uaWNhbC5wcmltYXJ5SWRlbnRpZmllcic7XG5cdFx0Z3MgPSBgPGNvbnN0cmFpbnQgcGF0aD1cIkV4b24uc3RyYWluLm5hbWVcIiBvcD1cIk9ORSBPRlwiPiR7dmFsc308L2NvbnN0cmFpbnQ+YFxuXHRcdHEgPSBgPHF1ZXJ5IG5hbWU9XCJleG9uU2VxdWVuY2VzQnlDYW5vbmljYWxJZFwiIG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCJFeG9uLnByaW1hcnlJZGVudGlmaWVyXCIgPlxuXHRcdCAgICA8Y29uc3RyYWludCBwYXRoPVwiRXhvbi5nZW5lLmNhbm9uaWNhbC5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIi8+XG5cdFx0ICAgICR7Z3N9PC9xdWVyeT5gO1xuXHQgICAgICAgIGJyZWFrO1xuXHQgICAgY2FzZSAnY2RzJzpcblx0XHR2aWV3ID0gJ0NEUy5nZW5lLmNhbm9uaWNhbC5wcmltYXJ5SWRlbnRpZmllcic7XG5cdFx0Z3MgPSBgPGNvbnN0cmFpbnQgcGF0aD1cIkNEUy5zdHJhaW4ubmFtZVwiIG9wPVwiT05FIE9GXCI+JHt2YWxzfTwvY29uc3RyYWludD5gXG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cImNkc1NlcXVlbmNlc0J5Q2Fub25pY2FsSWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiQ0RTLnByaW1hcnlJZGVudGlmaWVyXCIgPlxuXHRcdCAgICA8Y29uc3RyYWludCBwYXRoPVwiQ0RTLmdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiLz5cblx0XHQgICAgJHtnc308L3F1ZXJ5PmA7XG5cdCAgICAgICAgYnJlYWs7XG5cdCAgICB9XG5cdH1cblx0ZWxzZSB7XG5cdCAgICBpZGVudCA9IGYuSUQ7XG5cdCAgICB2aWV3ID0gJydcblx0ICAgIHN3aXRjaCAodHlwZSkge1xuXHQgICAgY2FzZSAnZ2Vub21pYyc6XG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cInNlcXVlbmNlc0J5SWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiR2VuZS5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkdlbmUucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgPC9xdWVyeT5gO1xuXHRcdGJyZWFrO1xuXHQgICAgY2FzZSAndHJhbnNjcmlwdCc6XG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cInRyYW5zY3JpcHRTZXF1ZW5jZXNCeUlkXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIlRyYW5zY3JpcHQucHJpbWFyeUlkZW50aWZpZXJcIiA+XG5cdFx0ICAgIDxjb25zdHJhaW50IHBhdGg9XCJUcmFuc2NyaXB0LmdlbmUucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgPC9xdWVyeT5gO1xuXHQgICAgICAgIGJyZWFrO1xuXHQgICAgY2FzZSAnZXhvbic6XG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cImV4b25TZXF1ZW5jZXNCeUlkXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIkV4b24ucHJpbWFyeUlkZW50aWZpZXJcIiA+XG5cdFx0ICAgIDxjb25zdHJhaW50IHBhdGg9XCJFeG9uLmdlbmUucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgPC9xdWVyeT5gO1xuXHQgICAgICAgIGJyZWFrO1xuXHQgICAgY2FzZSAnY2RzJzpcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwiY2RzU2VxdWVuY2VzQnlJZFwiIG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCJDRFMucHJpbWFyeUlkZW50aWZpZXJcIiA+XG5cdFx0ICAgIDxjb25zdHJhaW50IHBhdGg9XCJDRFMuZ2VuZS5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIi8+XG5cdFx0ICA8L3F1ZXJ5PmA7XG5cdCAgICAgICAgYnJlYWs7XG5cdCAgICB9XG5cdH1cblx0aWYgKCFxKSByZXR1cm4gbnVsbDtcblx0Y29uc29sZS5sb2cocSwgdmlldyk7XG5cdHVybCA9IHRoaXMuZmFVcmwgKyBgcXVlcnk9JHtlbmNvZGVVUklDb21wb25lbnQocSl9YDtcblx0aWYgKHZpZXcpXG4gICAgICAgICAgICB1cmwgKz0gYCZ2aWV3PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHZpZXcpfWA7XG5cdHJldHVybiB1cmw7XG4gICAgfVxufVxuXG5leHBvcnQgeyBBdXhEYXRhTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQXV4RGF0YU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IExpc3RGb3JtdWxhRXZhbHVhdG9yIH0gZnJvbSAnLi9MaXN0Rm9ybXVsYUV2YWx1YXRvcic7XG5pbXBvcnQgeyBLZXlTdG9yZSB9IGZyb20gJy4vS2V5U3RvcmUnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE1haW50YWlucyBuYW1lZCBsaXN0cyBvZiBJRHMuIExpc3RzIG1heSBiZSB0ZW1wb3JhcnksIGxhc3Rpbmcgb25seSBmb3IgdGhlIHNlc3Npb24sIG9yIHBlcm1hbmVudCxcbi8vIGxhc3RpbmcgdW50aWwgdGhlIHVzZXIgY2xlYXJzIHRoZSBicm93c2VyIGxvY2FsIHN0b3JhZ2UgYXJlYS5cbi8vXG4vLyBVc2VzIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSBhbmQgd2luZG93LmxvY2FsU3RvcmFnZSB0byBzYXZlIGxpc3RzXG4vLyB0ZW1wb3JhcmlseSBvciBwZXJtYW5lbnRseSwgcmVzcC4gIEZJWE1FOiBzaG91bGQgYmUgdXNpbmcgd2luZG93LmluZGV4ZWREQlxuLy9cbmNsYXNzIExpc3RNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLm5hbWUybGlzdCA9IG51bGw7XG5cdHRoaXMubGlzdFN0b3JlID0gbmV3IEtleVN0b3JlKCd1c2VyLWxpc3RzJyk7XG5cdHRoaXMuZm9ybXVsYUV2YWwgPSBuZXcgTGlzdEZvcm11bGFFdmFsdWF0b3IodGhpcyk7XG5cdHRoaXMucmVhZHkgPSB0aGlzLl9sb2FkKCkudGhlbiggKCk9PnRoaXMuaW5pdERvbSgpICk7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuXHQvLyBCdXR0b246IHNob3cvaGlkZSB3YXJuaW5nIG1lc3NhZ2Vcblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbi53YXJuaW5nJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IHcgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cIm1lc3NhZ2VcIl0nKTtcblx0XHR3LmNsYXNzZWQoJ3Nob3dpbmcnLCAhdy5jbGFzc2VkKCdzaG93aW5nJykpO1xuXHQgICAgfSk7XG5cdC8vIEJ1dHRvbjogY3JlYXRlIGxpc3QgZnJvbSBjdXJyZW50IHNlbGVjdGlvblxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJuZXdmcm9tc2VsZWN0aW9uXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgaWRzID0gbmV3IFNldChPYmplY3Qua2V5cyh0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzKSk7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdFx0bGV0IGxzdCA9IHRoaXMuYXBwLmdldEN1cnJlbnRMaXN0KCk7XG5cdFx0aWYgKGxzdClcblx0XHQgICAgaWRzID0gaWRzLnVuaW9uKGxzdC5pZHMpO1xuXHRcdGlmIChpZHMuc2l6ZSA9PT0gMCkge1xuXHRcdCAgICBhbGVydChcIk5vdGhpbmcgc2VsZWN0ZWQuXCIpO1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHRcdGxldCBuZXdsaXN0ID0gdGhpcy5jcmVhdGVMaXN0KFwic2VsZWN0aW9uXCIsIEFycmF5LmZyb20oaWRzKSk7XG5cdFx0dGhpcy51cGRhdGUobmV3bGlzdCk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IGNvbWJpbmUgbGlzdHM6IG9wZW4gbGlzdCBlZGl0b3Igd2l0aCBmb3JtdWxhIGVkaXRvciBvcGVuXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cImNvbWJpbmVcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlmICh0aGlzLmdldE5hbWVzKCkubGVuZ3RoID09PSAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTm8gbGlzdHMuXCIpO1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHRcdGxldCBsZSA9IHRoaXMuYXBwLmxpc3RFZGl0b3I7XG5cdFx0bGUub3BlbigpO1xuXHRcdGxlLm9wZW5Gb3JtdWxhRWRpdG9yKCk7XG5cdCAgICB9KTtcblx0Ly8gQnV0dG9uOiBkZWxldGUgYWxsIGxpc3RzIChnZXQgY29uZmlybWF0aW9uIGZpcnN0KS5cblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwicHVyZ2VcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGlmICh0aGlzLmdldE5hbWVzKCkubGVuZ3RoID09PSAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTm8gbGlzdHMuXCIpO1xuXHRcdCAgICByZXR1cm47XG5cdFx0fVxuXHQgICAgICAgIGlmICh3aW5kb3cuY29uZmlybShcIkRlbGV0ZSBhbGwgbGlzdHMuIEFyZSB5b3Ugc3VyZT9cIikpIHtcblx0XHQgICAgdGhpcy5wdXJnZSgpO1xuXHRcdCAgICB0aGlzLnVwZGF0ZSgpO1xuXHRcdH1cblx0ICAgIH0pO1xuICAgIH1cbiAgICBfbG9hZCAoKSB7XG5cdHJldHVybiB0aGlzLmxpc3RTdG9yZS5nZXQoXCJhbGxcIikudGhlbihhbGwgPT4ge1xuXHQgICAgdGhpcy5uYW1lMmxpc3QgPSBhbGwgfHwge307XG5cdH0pO1xuICAgIH1cbiAgICBfc2F2ZSAoKSB7XG5cdHJldHVybiB0aGlzLmxpc3RTdG9yZS5zZXQoXCJhbGxcIiwgdGhpcy5uYW1lMmxpc3QpXG4gICAgfVxuICAgIC8vXG4gICAgLy8gcmV0dXJucyB0aGUgbmFtZXMgb2YgYWxsIHRoZSBsaXN0cywgc29ydGVkXG4gICAgZ2V0TmFtZXMgKCkge1xuICAgICAgICBsZXQgbm1zID0gT2JqZWN0LmtleXModGhpcy5uYW1lMmxpc3QpO1xuXHRubXMuc29ydCgpO1xuXHRyZXR1cm4gbm1zO1xuICAgIH1cbiAgICAvLyByZXR1cm5zIHRydWUgaWZmIGEgbGlzdCBleGlzdHMgd2l0aCB0aGlzIG5hbWVcbiAgICBoYXMgKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUgaW4gdGhpcy5uYW1lMmxpc3Q7XG4gICAgfVxuICAgIC8vIElmIG5vIGxpc3Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBleGlzdHMsIHJldHVybiB0aGUgbmFtZS5cbiAgICAvLyBPdGhlcndpc2UsIHJldHVybiBhIG1vZGlmaWVkIHZlcnNpb24gb2YgbmFtZSB0aGF0IGlzIHVuaXF1ZS5cbiAgICAvLyBVbmlxdWUgbmFtZXMgYXJlIGNyZWF0ZWQgYnkgYXBwZW5kaW5nIGEgY291bnRlci5cbiAgICAvLyBFLmcuLCB1bmlxdWlmeShcImZvb1wiKSAtPiBcImZvby4xXCIgb3IgXCJmb28uMlwiIG9yIHdoYXRldmVyLlxuICAgIC8vXG4gICAgdW5pcXVpZnkgKG5hbWUpIHtcblx0aWYgKCF0aGlzLmhhcyhuYW1lKSkgXG5cdCAgICByZXR1cm4gbmFtZTtcblx0Zm9yIChsZXQgaSA9IDE7IDsgaSArPSAxKSB7XG5cdCAgICBsZXQgbm4gPSBgJHtuYW1lfS4ke2l9YDtcblx0ICAgIGlmICghdGhpcy5oYXMobm4pKVxuXHQgICAgICAgIHJldHVybiBubjtcblx0fVxuICAgIH1cbiAgICAvLyByZXR1cm5zIHRoZSBsaXN0IHdpdGggdGhpcyBuYW1lLCBvciBudWxsIGlmIG5vIHN1Y2ggbGlzdFxuICAgIGdldCAobmFtZSkge1xuICAgICAgICBsZXQgbHN0ID0gdGhpcy5uYW1lMmxpc3RbbmFtZV07XG5cdGlmICghbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuYW1lO1xuXHRyZXR1cm4gbHN0O1xuICAgIH1cbiAgICAvLyByZXR1cm5zIGFsbCB0aGUgbGlzdHMsIHNvcnRlZCBieSBuYW1lXG4gICAgZ2V0QWxsICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TmFtZXMoKS5tYXAobiA9PiB0aGlzLmdldChuKSlcbiAgICB9XG4gICAgLy8gXG4gICAgY3JlYXRlT3JVcGRhdGUgKG5hbWUsIGlkcykge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLnVwZGF0ZUxpc3QobmFtZSxudWxsLGlkcykgOiB0aGlzLmNyZWF0ZUxpc3QobmFtZSwgaWRzKTtcbiAgICB9XG4gICAgLy8gY3JlYXRlcyBhIG5ldyBsaXN0IHdpdGggdGhlIGdpdmVuIG5hbWUgYW5kIGlkcy5cbiAgICBjcmVhdGVMaXN0IChuYW1lLCBpZHMsIGZvcm11bGEpIHtcblx0aWYgKG5hbWUgIT09IFwiX1wiKVxuXHQgICAgbmFtZSA9IHRoaXMudW5pcXVpZnkobmFtZSk7XG5cdC8vXG5cdGxldCBkdCA9IG5ldyBEYXRlKCkgKyBcIlwiO1xuXHR0aGlzLm5hbWUybGlzdFtuYW1lXSA9IHtcblx0ICAgIG5hbWU6ICAgICBuYW1lLFxuXHQgICAgaWRzOiAgICAgIGlkcyxcblx0ICAgIGZvcm11bGE6ICBmb3JtdWxhIHx8IFwiXCIsXG5cdCAgICBjcmVhdGVkOiAgZHQsXG5cdCAgICBtb2RpZmllZDogZHRcblx0fTtcblx0dGhpcy5fc2F2ZSgpO1xuXHRyZXR1cm4gdGhpcy5uYW1lMmxpc3RbbmFtZV07XG4gICAgfVxuICAgIC8vIFByb3ZpZGUgYWNjZXNzIHRvIGV2YWx1YXRpb24gc2VydmljZVxuICAgIGV2YWxGb3JtdWxhIChleHByKSB7XG5cdHJldHVybiB0aGlzLmZvcm11bGFFdmFsLmV2YWwoZXhwcik7XG4gICAgfVxuICAgIC8vIFJlZnJlc2hlcyBhIGxpc3QgYW5kIHJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgcmVmcmVzaGVkIGxpc3QuXG4gICAgLy8gSWYgdGhlIGxpc3QgaWYgYSBQT0xPLCBwcm9taXNlIHJlc29sdmVzIGltbWVkaWF0ZWx5IHRvIHRoZSBsaXN0LlxuICAgIC8vIE90aGVyd2lzZSwgc3RhcnRzIGEgcmVldmFsdWF0aW9uIG9mIHRoZSBmb3JtdWxhIHRoYXQgcmVzb2x2ZXMgYWZ0ZXIgdGhlXG4gICAgLy8gbGlzdCdzIGlkcyBoYXZlIGJlZW4gdXBkYXRlZC5cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBlcnJvciwgdGhlIHJldHVybmVkIHByb21pc2UgcmVqZWN0cyB3aXRoIHRoZSBlcnJvci5cbiAgICByZWZyZXNoTGlzdCAobmFtZSkge1xuICAgICAgICBsZXQgbHN0ID0gdGhpcy5nZXQobmFtZSk7XG5cdGlmICghbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuYW1lO1xuXHRsc3QubW9kaWZpZWQgPSBcIlwiK25ldyBEYXRlKCk7XG5cdGlmICghbHN0LmZvcm11bGEpXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGxzdCk7XG5cdGVsc2Uge1xuXHQgICAgbGV0IHAgPSB0aGlzLmZvcm11YWxFdmFsLmV2YWwobHN0LmZvcm11bGEpLnRoZW4oIGlkcyA9PiB7XG5cdFx0ICAgIGxzdC5pZHMgPSBpZHM7XG5cdFx0ICAgIHJldHVybiBsc3Q7XG5cdFx0fSk7XG5cdCAgICByZXR1cm4gcDtcblx0fVxuICAgIH1cblxuICAgIC8vIHVwZGF0ZXMgdGhlIGlkcyBpbiB0aGUgZ2l2ZW4gbGlzdFxuICAgIHVwZGF0ZUxpc3QgKG5hbWUsIG5ld25hbWUsIG5ld2lkcywgbmV3Zm9ybXVsYSkge1xuXHRsZXQgbHN0ID0gdGhpcy5nZXQobmFtZSk7XG4gICAgICAgIGlmICghIGxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgbmFtZTtcblx0aWYgKG5ld25hbWUpIHtcblx0ICAgIGRlbGV0ZSB0aGlzLm5hbWUybGlzdFtsc3QubmFtZV07XG5cdCAgICBsc3QubmFtZSA9IHRoaXMudW5pcXVpZnkobmV3bmFtZSk7XG5cdCAgICB0aGlzLm5hbWUybGlzdFtsc3QubmFtZV0gPSBsc3Q7XG5cdH1cblx0aWYgKG5ld2lkcykgbHN0LmlkcyAgPSBuZXdpZHM7XG5cdGlmIChuZXdmb3JtdWxhIHx8IG5ld2Zvcm11bGE9PT1cIlwiKSBsc3QuZm9ybXVsYSA9IG5ld2Zvcm11bGE7XG5cdGxzdC5tb2RpZmllZCA9IG5ldyBEYXRlKCkgKyBcIlwiO1xuXHR0aGlzLl9zYXZlKCk7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIGRlbGV0ZXMgdGhlIHNwZWNpZmllZCBsaXN0XG4gICAgZGVsZXRlTGlzdCAobmFtZSkge1xuICAgICAgICBsZXQgbHN0ID0gdGhpcy5nZXQobmFtZSk7XG5cdGRlbGV0ZSB0aGlzLm5hbWUybGlzdFtuYW1lXTtcblx0dGhpcy5fc2F2ZSgpO1xuXHQvLyBGSVhNRTogdXNlIGV2ZW50cyEhXG5cdGlmIChsc3QgPT09IHRoaXMuYXBwLmdldEN1cnJlbnRMaXN0KCkpIHRoaXMuYXBwLnNldEN1cnJlbnRMaXN0KG51bGwpO1xuXHRpZiAobHN0ID09PSB0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QpIHRoaXMuYXBwLmxpc3RFZGl0b3IubGlzdCA9IG51bGw7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIGRlbGV0ZSBhbGwgbGlzdHNcbiAgICBwdXJnZSAoKSB7XG4gICAgICAgIHRoaXMubmFtZTJsaXN0ID0ge31cblx0dGhpcy5fc2F2ZSgpO1xuXHQvL1xuXHR0aGlzLmFwcC5zZXRDdXJyZW50TGlzdChudWxsKTtcblx0dGhpcy5hcHAubGlzdEVkaXRvci5saXN0ID0gbnVsbDsgLy8gRklYTUUgLSByZWFjaGFjcm9zc1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIHRydWUgaWZmIGV4cHIgaXMgdmFsaWQsIHdoaWNoIG1lYW5zIGl0IGlzIGJvdGggc3ludGFjdGljYWxseSBjb3JyZWN0IFxuICAgIC8vIGFuZCBhbGwgbWVudGlvbmVkIGxpc3RzIGV4aXN0LlxuICAgIGlzVmFsaWQgKGV4cHIpIHtcblx0cmV0dXJuIHRoaXMuZm9ybXVsYUV2YWwuaXNWYWxpZChleHByKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyB0aGUgXCJNeSBsaXN0c1wiIGJveCB3aXRoIHRoZSBjdXJyZW50bHkgYXZhaWxhYmxlIGxpc3RzLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICBuZXdsaXN0IChMaXN0KSBvcHRpb25hbC4gSWYgc3BlY2lmaWVkLCB3ZSBqdXN0IGNyZWF0ZWQgdGhhdCBsaXN0LCBhbmQgaXRzIG5hbWUgaXNcbiAgICAvLyAgIFx0YSBnZW5lcmF0ZWQgZGVmYXVsdC4gUGxhY2UgZm9jdXMgdGhlcmUgc28gdXNlciBjYW4gdHlwZSBuZXcgbmFtZS5cbiAgICB1cGRhdGUgKG5ld2xpc3QpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgbGlzdHMgPSB0aGlzLmdldEFsbCgpO1xuXHRsZXQgYnlOYW1lID0gKGEsYikgPT4ge1xuXHQgICAgbGV0IGFuID0gYS5uYW1lLnRvTG93ZXJDYXNlKCk7XG5cdCAgICBsZXQgYm4gPSBiLm5hbWUudG9Mb3dlckNhc2UoKTtcblx0ICAgIHJldHVybiAoYW4gPCBibiA/IC0xIDogYW4gPiBibiA/ICsxIDogMCk7XG5cdH07XG5cdGxldCBieURhdGUgPSAoYSxiKSA9PiAoKG5ldyBEYXRlKGIubW9kaWZpZWQpKS5nZXRUaW1lKCkgLSAobmV3IERhdGUoYS5tb2RpZmllZCkpLmdldFRpbWUoKSk7XG5cdGxpc3RzLnNvcnQoYnlOYW1lKTtcblx0bGV0IGl0ZW1zID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJsaXN0c1wiXScpLnNlbGVjdEFsbChcIi5saXN0SW5mb1wiKVxuXHQgICAgLmRhdGEobGlzdHMpO1xuXHRsZXQgbmV3aXRlbXMgPSBpdGVtcy5lbnRlcigpLmFwcGVuZChcImRpdlwiKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwibGlzdEluZm8gZmxleHJvd1wiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJpXCIpLmF0dHIoXCJjbGFzc1wiLFwibWF0ZXJpYWwtaWNvbnMgYnV0dG9uXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIixcImVkaXRcIilcblx0ICAgIC50ZXh0KFwibW9kZV9lZGl0XCIpXG5cdCAgICAuYXR0cihcInRpdGxlXCIsXCJFZGl0IHRoaXMgbGlzdC5cIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwic3BhblwiKS5hdHRyKFwibmFtZVwiLFwibmFtZVwiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJzcGFuXCIpLmF0dHIoXCJuYW1lXCIsXCJzaXplXCIpO1xuXHRuZXdpdGVtcy5hcHBlbmQoXCJzcGFuXCIpLmF0dHIoXCJuYW1lXCIsXCJkYXRlXCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcImlcIikuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29ucyBidXR0b25cIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLFwiZGVsZXRlXCIpXG5cdCAgICAudGV4dChcImhpZ2hsaWdodF9vZmZcIilcblx0ICAgIC5hdHRyKFwidGl0bGVcIixcIkRlbGV0ZSB0aGlzIGxpc3QuXCIpO1xuXG5cdGlmIChuZXdpdGVtc1swXVswXSkge1xuXHQgICAgbGV0IGxhc3QgPSBuZXdpdGVtc1swXVtuZXdpdGVtc1swXS5sZW5ndGgtMV07XG5cdCAgICBsYXN0LnNjcm9sbEludG9WaWV3KCk7XG5cdH1cblxuXHRpdGVtc1xuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGxzdD0+bHN0Lm5hbWUpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAobHN0KSB7XG5cdFx0aWYgKGQzLmV2ZW50LmFsdEtleSkge1xuXHRcdCAgICAvLyBhbHQtY2xpY2sgY29waWVzIHRoZSBsaXN0J3MgbmFtZSBpbnRvIHRoZSBmb3JtdWxhIGVkaXRvclxuXHRcdCAgICBsZXQgbGUgPSBzZWxmLmFwcC5saXN0RWRpdG9yOyAvLyBGSVhNRSByZWFjaG92ZXJcblx0XHQgICAgbGV0IHMgPSBsc3QubmFtZTtcblx0XHQgICAgbGV0IHJlID0gL1sgPSgpKyotXS87XG5cdFx0ICAgIGlmIChzLnNlYXJjaChyZSkgPj0gMClcblx0XHRcdHMgPSAnXCInICsgcyArICdcIic7XG5cdFx0ICAgIGlmICghbGUuaXNFZGl0aW5nRm9ybXVsYSkge1xuXHRcdCAgICAgICAgbGUub3BlbigpO1xuXHRcdFx0bGUub3BlbkZvcm11bGFFZGl0b3IoKTtcblx0XHQgICAgfVxuXHRcdCAgICAvL1xuXHRcdCAgICBsZS5hZGRUb0xpc3RFeHByKHMrJyAnKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZDMuZXZlbnQuc2hpZnRLZXkpIHtcblx0XHQgICAgLy8gc2hpZnQtY2xpY2sgZ29lcyB0byBuZXh0IGxpc3QgZWxlbWVudCBpZiBpdCdzIHRoZSBzYW1lIGxpc3QsXG5cdFx0ICAgIC8vIG9yIGVsc2Ugc2V0cyB0aGUgbGlzdCBhbmQgZ29lcyB0byB0aGUgZmlyc3QgZWxlbWVudC5cblx0XHQgICAgaWYgKHNlbGYuYXBwLmdldEN1cnJlbnRMaXN0KCkgIT09IGxzdClcblx0XHRcdHNlbGYuYXBwLnNldEN1cnJlbnRMaXN0KGxzdCwgdHJ1ZSk7XG5cdFx0ICAgIGVsc2Vcblx0XHRcdHNlbGYuYXBwLmdvVG9OZXh0TGlzdEVsZW1lbnQobHN0KTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIC8vIHBsYWluIGNsaWNrIHNldHMgdGhlIHNldCBpZiBpdCdzIGEgZGlmZmVyZW50IGxpc3QsXG5cdFx0ICAgIC8vIG9yIGVsc2UgdW5zZXRzIHRoZSBsaXN0LlxuXHRcdCAgICBpZiAoc2VsZi5hcHAuZ2V0Q3VycmVudExpc3QoKSAhPT0gbHN0KVxuXHRcdCAgICAgICAgc2VsZi5hcHAuc2V0Q3VycmVudExpc3QobHN0KTtcblx0XHQgICAgZWxzZVxuXHRcdCAgICAgICAgc2VsZi5hcHAuc2V0Q3VycmVudExpc3QobnVsbCk7XG5cdFx0fVxuXHQgICAgfSk7XG5cdGl0ZW1zLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZWRpdFwiXScpXG5cdCAgICAvLyBlZGl0OiBjbGljayBcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGxzdCkge1xuXHQgICAgICAgIHNlbGYuYXBwLmxpc3RFZGl0b3Iub3Blbihsc3QpO1xuXHQgICAgfSk7XG5cdGl0ZW1zLnNlbGVjdCgnc3BhbltuYW1lPVwibmFtZVwiXScpXG5cdCAgICAudGV4dChsc3QgPT4gbHN0Lm5hbWUpO1xuXHRpdGVtcy5zZWxlY3QoJ3NwYW5bbmFtZT1cImRhdGVcIl0nKS50ZXh0KGxzdCA9PiB7XG5cdCAgICBsZXQgbWQgPSBuZXcgRGF0ZShsc3QubW9kaWZpZWQpO1xuXHQgICAgbGV0IGQgPSBgJHttZC5nZXRGdWxsWWVhcigpfS0ke21kLmdldE1vbnRoKCkrMX0tJHttZC5nZXREYXRlKCl9IGAgXG5cdCAgICAgICAgICArIGA6JHttZC5nZXRIb3VycygpfS4ke21kLmdldE1pbnV0ZXMoKX0uJHttZC5nZXRTZWNvbmRzKCl9YDtcblx0ICAgIHJldHVybiBkO1xuXHR9KTtcblx0aXRlbXMuc2VsZWN0KCdzcGFuW25hbWU9XCJzaXplXCJdJykudGV4dChsc3QgPT4gbHN0Lmlkcy5sZW5ndGgpO1xuXHRpdGVtcy5zZWxlY3QoJy5idXR0b25bbmFtZT1cImRlbGV0ZVwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCBsc3QgPT4ge1xuXHQgICAgICAgIHRoaXMuZGVsZXRlTGlzdChsc3QubmFtZSk7XG5cdFx0dGhpcy51cGRhdGUoKTtcblxuXHRcdC8vIE5vdCBzdXJlIHdoeSB0aGlzIGlzIG5lY2Vzc2FyeSBoZXJlLiBCdXQgd2l0aG91dCBpdCwgdGhlIGxpc3QgaXRlbSBhZnRlciB0aGUgb25lIGJlaW5nXG5cdFx0Ly8gZGVsZXRlZCBoZXJlIHdpbGwgcmVjZWl2ZSBhIGNsaWNrIGV2ZW50LlxuXHRcdGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdC8vXG5cdCAgICB9KTtcblxuXHQvL1xuXHRpdGVtcy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGlmIChuZXdsaXN0KSB7XG5cdCAgICBsZXQgbHN0ZWx0ID0gXG5cdCAgICAgICAgZDMuc2VsZWN0KGAjbXlsaXN0cyBbbmFtZT1cImxpc3RzXCJdIFtuYW1lPVwiJHtuZXdsaXN0Lm5hbWV9XCJdYClbMF1bMF07XG4gICAgICAgICAgICBsc3RlbHQuc2Nyb2xsSW50b1ZpZXcoZmFsc2UpO1xuXHR9XG4gICAgfVxuXG59IC8vIGVuZCBjbGFzcyBMaXN0TWFuYWdlclxuXG5leHBvcnQgeyBMaXN0TWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdE1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IExpc3RGb3JtdWxhUGFyc2VyIH0gZnJvbSAnLi9MaXN0Rm9ybXVsYVBhcnNlcic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gS25vd3MgaG93IHRvIHBhcnNlIGFuZCBldmFsdWF0ZSBhIGxpc3QgZm9ybXVsYSAoYWthIGxpc3QgZXhwcmVzc2lvbikuXG5jbGFzcyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB7XG4gICAgY29uc3RydWN0b3IgKGxpc3RNYW5hZ2VyKSB7XG5cdHRoaXMubGlzdE1hbmFnZXIgPSBsaXN0TWFuYWdlcjtcbiAgICAgICAgdGhpcy5wYXJzZXIgPSBuZXcgTGlzdEZvcm11bGFQYXJzZXIoKTtcbiAgICB9XG4gICAgLy8gRXZhbHVhdGVzIHRoZSBleHByZXNzaW9uIGFuZCByZXR1cm5zIGEgUHJvbWlzZSBmb3IgdGhlIGxpc3Qgb2YgaWRzLlxuICAgIC8vIElmIHRoZXJlIGlzIGFuIGVycm9yLCB0aGUgcHJvbWlzZSByZWplY3RzIHdpdGggdGhlIGVycm9yIG1lc3NhZ2UuXG4gICAgZXZhbCAoZXhwcikge1xuXHQgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHQgICAgIHRyeSB7XG5cdFx0bGV0IGFzdCA9IHRoaXMucGFyc2VyLnBhcnNlKGV4cHIpO1xuXHRcdGxldCBsbSA9IHRoaXMubGlzdE1hbmFnZXI7XG5cdFx0bGV0IHJlYWNoID0gKG4pID0+IHtcblx0XHQgICAgaWYgKHR5cGVvZihuKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0bGV0IGxzdCA9IGxtLmdldChuKTtcblx0XHRcdGlmICghbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuO1xuXHRcdFx0cmV0dXJuIG5ldyBTZXQobHN0Lmlkcyk7XG5cdFx0ICAgIH1cblx0XHQgICAgZWxzZSB7XG5cdFx0XHRsZXQgbCA9IHJlYWNoKG4ubGVmdCk7XG5cdFx0XHRsZXQgciA9IHJlYWNoKG4ucmlnaHQpO1xuXHRcdFx0cmV0dXJuIGxbbi5vcF0ocik7XG5cdFx0ICAgIH1cblx0XHR9XG5cdFx0bGV0IGlkcyA9IHJlYWNoKGFzdCk7XG5cdFx0cmVzb2x2ZShBcnJheS5mcm9tKGlkcykpO1xuXHQgICAgfVxuXHQgICAgY2F0Y2ggKGUpIHtcblx0XHRyZWplY3QoZSk7XG5cdCAgICB9XG5cdCB9LmJpbmQodGhpcykpO1xuICAgIH1cbiAgICAvLyBDaGVja3MgdGhlIGN1cnJlbnQgZXhwcmVzc2lvbiBmb3Igc3ludGFjdGljIGFuZCBzZW1hbnRpYyB2YWxpZGl0eSBhbmQgc2V0cyB0aGUgXG4gICAgLy8gdmFsaWQvaW52YWxpZCBjbGFzcyBhY2NvcmRpbmdseS4gU2VtYW50aWMgdmFsaWRpdHkgc2ltcGx5IG1lYW5zIGFsbCBuYW1lcyBpbiB0aGVcbiAgICAvLyBleHByZXNzaW9uIGFyZSBib3VuZC5cbiAgICAvL1xuICAgIGlzVmFsaWQgIChleHByKSB7XG5cdHRyeSB7XG5cdCAgICAvLyBmaXJzdCBjaGVjayBzeW50YXhcblx0ICAgIGxldCBhc3QgPSB0aGlzLnBhcnNlci5wYXJzZShleHByKTtcblx0ICAgIGxldCBsbSAgPSB0aGlzLmxpc3RNYW5hZ2VyOyBcblx0ICAgIC8vIG5vdyBjaGVjayBsaXN0IG5hbWVzXG5cdCAgICAoZnVuY3Rpb24gcmVhY2gobikge1xuXHRcdGlmICh0eXBlb2YobikgPT09IFwic3RyaW5nXCIpIHtcblx0XHQgICAgbGV0IGxzdCA9IGxtLmdldChuKTtcblx0XHQgICAgaWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIHJlYWNoKG4ubGVmdCk7XG5cdFx0ICAgIHJlYWNoKG4ucmlnaHQpO1xuXHRcdH1cblx0ICAgIH0pKGFzdCk7XG5cblx0ICAgIC8vIFRodW1icyB1cCFcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9XG5cdGNhdGNoIChlKSB7XG5cdCAgICAvLyBzeW50YXggZXJyb3Igb3IgdW5rbm93biBsaXN0IG5hbWVcblx0ICAgIHJldHVybiBmYWxzZTtcblx0fVxuICAgIH1cbn1cblxuZXhwb3J0IHsgTGlzdEZvcm11bGFFdmFsdWF0b3IgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0xpc3RGb3JtdWxhRXZhbHVhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBzZXRDYXJldFBvc2l0aW9uLCBtb3ZlQ2FyZXRQb3NpdGlvbiwgZ2V0Q2FyZXRSYW5nZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfSBmcm9tICcuL0xpc3RGb3JtdWxhUGFyc2VyJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBMaXN0RWRpdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcblx0c3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLnBhcnNlciA9IG5ldyBMaXN0Rm9ybXVsYVBhcnNlcigpO1xuXHR0aGlzLmZvcm0gPSBudWxsO1xuXHR0aGlzLmluaXREb20oKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gZmFsc2U7XG5cdC8vXG5cdHRoaXMubGlzdCA9IG51bGw7XG4gICAgfVxuICAgIGluaXREb20gKCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdHRoaXMuZm9ybSA9IHRoaXMucm9vdC5zZWxlY3QoXCJmb3JtXCIpWzBdWzBdO1xuXHRpZiAoIXRoaXMuZm9ybSkgdGhyb3cgXCJDb3VsZCBub3QgaW5pdCBMaXN0RWRpdG9yLiBObyBmb3JtIGVsZW1lbnQuXCI7XG5cdGQzLnNlbGVjdCh0aGlzLmZvcm0pXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdCAgICAgICAgbGV0IHQgPSBkMy5ldmVudC50YXJnZXQ7XG5cdFx0aWYgKFwiYnV0dG9uXCIgPT09IHQudGFnTmFtZS50b0xvd2VyQ2FzZSgpKXtcblx0XHQgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQgICAgbGV0IGYgPSB0aGlzLmZvcm07XG5cdFx0ICAgIGxldCBzID0gZi5pZHMudmFsdWUucmVwbGFjZSgvWyx8XS9nLCAnICcpLnRyaW0oKTtcblx0XHQgICAgbGV0IGlkcyA9IHMgPyBzLnNwbGl0KC9cXHMrLykgOiBbXTtcblx0XHQgICAgLy8gc2F2ZSBsaXN0XG5cdFx0ICAgIGlmICh0Lm5hbWUgPT09IFwic2F2ZVwiKSB7XG5cdFx0XHRpZiAoIXRoaXMubGlzdCkgcmV0dXJuO1xuXHRcdFx0dGhpcy5saXN0ID0gdGhpcy5hcHAubGlzdE1hbmFnZXIudXBkYXRlTGlzdCh0aGlzLmxpc3QubmFtZSwgZi5uYW1lLnZhbHVlLCBpZHMsIGYuZm9ybXVsYS52YWx1ZSk7XG5cdFx0XHR0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGUodGhpcy5saXN0KTtcblx0XHQgICAgfVxuXHRcdCAgICAvLyBjcmVhdGUgbmV3IGxpc3Rcblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcIm5ld1wiKSB7XG5cdFx0XHRsZXQgbiA9IGYubmFtZS52YWx1ZS50cmltKCk7XG5cdFx0XHRpZiAoIW4pIHtcblx0XHRcdCAgIGFsZXJ0KFwiWW91ciBsaXN0IGhhcyBubyBuYW1lIGFuZCBpcyB2ZXJ5IHNhZC4gUGxlYXNlIGdpdmUgaXQgYSBuYW1lIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdFx0ICAgcmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChuLmluZGV4T2YoJ1wiJykgPj0gMCkge1xuXHRcdFx0ICAgYWxlcnQoXCJPaCBkZWFyLCB5b3VyIGxpc3QncyBuYW1lIGhhcyBhIGRvdWJsZSBxdW90ZSBjaGFyYWN0ZXIsIGFuZCBJJ20gYWZhcmFpZCB0aGF0J3Mgbm90IGFsbG93ZWQuIFBsZWFzZSByZW1vdmUgdGhlICdcXFwiJyBhbmQgdHJ5IGFnYWluLlwiKTtcblx0XHRcdCAgIHJldHVyblxuXHRcdFx0fVxuXHRcdCAgICAgICAgdGhpcy5saXN0ID0gdGhpcy5hcHAubGlzdE1hbmFnZXIuY3JlYXRlTGlzdChuLCBpZHMsIGYuZm9ybXVsYS52YWx1ZSk7XG5cdFx0XHR0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGUodGhpcy5saXN0KTtcblx0XHQgICAgfVxuXHRcdCAgICAvLyBjbGVhciBmb3JtXG5cdFx0ICAgIGVsc2UgaWYgKHQubmFtZSA9PT0gXCJjbGVhclwiKSB7XG5cdFx0ICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGZvcndhcmQgdG8gTUdJXG5cdFx0ICAgIGVsc2UgaWYgKHQubmFtZSA9PT0gXCJ0b01naVwiKSB7XG5cdFx0ICAgICAgICBsZXQgZnJtID0gZDMuc2VsZWN0KCcjbWdpYmF0Y2hmb3JtJylbMF1bMF07XG5cdFx0XHRmcm0uaWRzLnZhbHVlID0gaWRzLmpvaW4oXCIgXCIpO1xuXHRcdFx0ZnJtLnN1Ym1pdCgpXG5cdFx0ICAgIH1cblx0XHQgICAgLy8gZm9yd2FyZCB0byBNb3VzZU1pbmVcblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcInRvTW91c2VNaW5lXCIpIHtcblx0XHQgICAgICAgIGxldCBmcm0gPSBkMy5zZWxlY3QoJyNtb3VzZW1pbmVmb3JtJylbMF1bMF07XG5cdFx0XHRmcm0uZXh0ZXJuYWxpZHMudmFsdWUgPSBpZHMuam9pbihcIixcIik7XG5cdFx0XHRmcm0uc3VibWl0KClcblx0XHQgICAgfVxuXHRcdH1cblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbjogc2hvdy9oaWRlIGZvcm11bGEgZWRpdG9yXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiaWRzZWN0aW9uXCJdIC5idXR0b25bbmFtZT1cImVkaXRmb3JtdWxhXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlRm9ybXVsYUVkaXRvcigpKTtcblx0ICAgIFxuXHQvLyBJbnB1dCBib3g6IGZvcm11bGE6IHZhbGlkYXRlIG9uIGFueSBpbnB1dFxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gW25hbWU9XCJmb3JtdWxhXCJdJylcblx0ICAgIC5vbihcImlucHV0XCIsICgpID0+IHtcblx0ICAgICAgICB0aGlzLnZhbGlkYXRlRXhwcigpO1xuXHQgICAgfSk7XG5cblx0Ly8gRm9yd2FyZCAtPiBNR0kvTW91c2VNaW5lOiBkaXNhYmxlIGJ1dHRvbnMgaWYgbm8gaWRzXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiaWRzXCJdJylcblx0ICAgIC5vbihcImlucHV0XCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgZW1wdHkgPSB0aGlzLmZvcm0uaWRzLnZhbHVlLnRyaW0oKS5sZW5ndGggPT09IDA7XG5cdFx0dGhpcy5mb3JtLnRvTWdpLmRpc2FibGVkID0gdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkID0gZW1wdHk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b25zOiB0aGUgbGlzdCBvcGVyYXRvciBidXR0b25zICh1bmlvbiwgaW50ZXJzZWN0aW9uLCBldGMuKVxuXHR0aGlzLnJvb3Quc2VsZWN0QWxsKCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gLmJ1dHRvbi5saXN0b3AnKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdC8vIGFkZCBteSBzeW1ib2wgdG8gdGhlIGZvcm11bGFcblx0XHRsZXQgaW5lbHQgPSBzZWxmLmZvcm0uZm9ybXVsYTtcblx0XHRsZXQgb3AgPSBkMy5zZWxlY3QodGhpcykuYXR0cihcIm5hbWVcIik7XG5cdFx0c2VsZi5hZGRUb0xpc3RFeHByKG9wKTtcblx0XHRzZWxmLnZhbGlkYXRlRXhwcigpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiByZWZyZXNoIGJ1dHRvbiBmb3IgcnVubmluZyB0aGUgZm9ybXVsYVxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gLmJ1dHRvbltuYW1lPVwicmVmcmVzaFwiXScpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0bGV0IGVtZXNzYWdlPVwiSSdtIHRlcnJpYmx5IHNvcnJ5LCBidXQgdGhlcmUgYXBwZWFycyB0byBiZSBhIHByb2JsZW0gd2l0aCB5b3VyIGxpc3QgZXhwcmVzc2lvbjogXCI7XG5cdFx0bGV0IGZvcm11bGEgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZS50cmltKCk7XG5cdFx0aWYgKGZvcm11bGEubGVuZ3RoID09PSAwKVxuXHRcdCAgICByZXR1cm47XG5cdCAgICAgICAgdGhpcy5hcHAubGlzdE1hbmFnZXJcblx0XHQgICAgLmV2YWxGb3JtdWxhKGZvcm11bGEpXG5cdFx0ICAgIC50aGVuKGlkcyA9PiB7XG5cdFx0ICAgICAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gaWRzLmpvaW4oXCJcXG5cIik7XG5cdFx0ICAgICB9KVxuXHRcdCAgICAuY2F0Y2goZSA9PiBhbGVydChlbWVzc2FnZSArIGUpKTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbjogY2xvc2UgZm9ybXVsYSBlZGl0b3Jcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIC5idXR0b25bbmFtZT1cImNsb3NlXCJdJylcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsICgpID0+IHRoaXMuY2xvc2VGb3JtdWxhRWRpdG9yKCkgKTtcblx0XG5cdC8vIENsaWNraW5nIHRoZSBib3ggY29sbGFwc2UgYnV0dG9uIHNob3VsZCBjbGVhciB0aGUgZm9ybVxuXHR0aGlzLnJvb3Quc2VsZWN0KFwiLmJ1dHRvbi5jbG9zZVwiKVxuXHQgICAgLm9uKFwiY2xpY2suZXh0cmFcIiwgKCkgPT4ge1xuXHQgICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG5cdFx0dGhpcy5jbG9zZUZvcm11bGFFZGl0b3IoKTtcblx0ICAgIH0pO1xuICAgIH1cbiAgICBwYXJzZUlkcyAocykge1xuXHRyZXR1cm4gcy5yZXBsYWNlKC9bLHxdL2csICcgJykudHJpbSgpLnNwbGl0KC9cXHMrLyk7XG4gICAgfVxuICAgIGdldCBsaXN0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3Q7XG4gICAgfVxuICAgIHNldCBsaXN0IChsc3QpIHtcbiAgICAgICAgdGhpcy5fbGlzdCA9IGxzdDtcblx0dGhpcy5fc3luY0Rpc3BsYXkoKTtcbiAgICB9XG4gICAgX3N5bmNEaXNwbGF5ICgpIHtcblx0bGV0IGxzdCA9IHRoaXMuX2xpc3Q7XG5cdGlmICghbHN0KSB7XG5cdCAgICB0aGlzLmZvcm0ubmFtZS52YWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5mb3JtLmlkcy52YWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IGZhbHNlO1xuXHQgICAgdGhpcy5mb3JtLm1vZGlmaWVkLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZSA9ICcnO1xuXHQgICAgdGhpcy5mb3JtLnNhdmUuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5mb3JtLnRvTWdpLmRpc2FibGVkID0gdHJ1ZTtcblx0ICAgIHRoaXMuZm9ybS50b01vdXNlTWluZS5kaXNhYmxlZCA9IHRydWU7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICB0aGlzLmZvcm0ubmFtZS52YWx1ZSA9IGxzdC5uYW1lO1xuXHQgICAgdGhpcy5mb3JtLmlkcy52YWx1ZSA9IGxzdC5pZHMuam9pbignXFxuJyk7XG5cdCAgICB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZSA9IGxzdC5mb3JtdWxhIHx8IFwiXCI7XG5cdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gdGhpcy5mb3JtLmZvcm11bGEudmFsdWUudHJpbSgpLmxlbmd0aCA+IDA7XG5cdCAgICB0aGlzLmZvcm0ubW9kaWZpZWQudmFsdWUgPSBsc3QubW9kaWZpZWQ7XG5cdCAgICB0aGlzLmZvcm0uc2F2ZS5kaXNhYmxlZCA9IGZhbHNlO1xuXHQgICAgdGhpcy5mb3JtLnRvTWdpLmRpc2FibGVkIFxuXHQgICAgICA9IHRoaXMuZm9ybS50b01vdXNlTWluZS5kaXNhYmxlZCBcblx0ICAgICAgICA9ICh0aGlzLmZvcm0uaWRzLnZhbHVlLnRyaW0oKS5sZW5ndGggPT09IDApO1xuXHR9XG5cdHRoaXMudmFsaWRhdGVFeHByKCk7XG4gICAgfVxuICAgIGNsZWFyICgpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcbiAgICB9XG4gICAgb3BlbiAobHN0KSB7XG4gICAgICAgIHRoaXMubGlzdCA9IGxzdDtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIiwgZmFsc2UpO1xuICAgIH1cbiAgICBjbG9zZSAoKSB7XG4gICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG5cdHRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIsIHRydWUpO1xuICAgIH1cbiAgICBvcGVuRm9ybXVsYUVkaXRvciAoKSB7XG5cdHRoaXMucm9vdC5jbGFzc2VkKFwiZWRpdGluZ2Zvcm11bGFcIiwgdHJ1ZSk7XG5cdHRoaXMuaXNFZGl0aW5nRm9ybXVsYSA9IHRydWU7XG5cdGxldCBmID0gdGhpcy5mb3JtLmZvcm11bGEudmFsdWU7XG5cdHRoaXMuZm9ybS5mb3JtdWxhLmZvY3VzKCk7XG5cdHNldENhcmV0UG9zaXRpb24odGhpcy5mb3JtLmZvcm11bGEsIGYubGVuZ3RoKTtcbiAgICB9XG4gICAgY2xvc2VGb3JtdWxhRWRpdG9yICgpIHtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJlZGl0aW5nZm9ybXVsYVwiLCBmYWxzZSk7XG5cdHRoaXMuaXNFZGl0aW5nRm9ybXVsYSA9IGZhbHNlO1xuICAgIH1cbiAgICB0b2dnbGVGb3JtdWxhRWRpdG9yICgpIHtcblx0bGV0IHNob3dpbmcgPSB0aGlzLnJvb3QuY2xhc3NlZChcImVkaXRpbmdmb3JtdWxhXCIpO1xuXHRzaG93aW5nID8gdGhpcy5jbG9zZUZvcm11bGFFZGl0b3IoKSA6IHRoaXMub3BlbkZvcm11bGFFZGl0b3IoKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ2hlY2tzIHRoZSBjdXJyZW50IGV4cHJlc3Npb24gYW5kIHNldHMgdGhlIHZhbGlkL2ludmFsaWQgY2xhc3MuXG4gICAgdmFsaWRhdGVFeHByICAoKSB7XG5cdGxldCBpbnAgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gW25hbWU9XCJmb3JtdWxhXCJdJyk7XG5cdGxldCBleHByID0gaW5wWzBdWzBdLnZhbHVlLnRyaW0oKTtcblx0aWYgKCFleHByKSB7XG5cdCAgICBpbnAuY2xhc3NlZChcInZhbGlkXCIsZmFsc2UpLmNsYXNzZWQoXCJpbnZhbGlkXCIsZmFsc2UpO1xuIFx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSBmYWxzZTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIGxldCBpc1ZhbGlkID0gdGhpcy5hcHAubGlzdE1hbmFnZXIuaXNWYWxpZChleHByKTsgLy8gRklYTUUgLSByZWFjaG92ZXJcblx0ICAgIGlucC5jbGFzc2VkKFwidmFsaWRcIiwgaXNWYWxpZCkuY2xhc3NlZChcImludmFsaWRcIiwgIWlzVmFsaWQpO1xuIFx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSB0cnVlO1xuXHR9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGFkZFRvTGlzdEV4cHIgKHRleHQpIHtcblx0bGV0IGlucCA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKTtcblx0bGV0IGllbHQgPSBpbnBbMF1bMF07XG5cdGxldCB2ID0gaWVsdC52YWx1ZTtcblx0bGV0IHNwbGljZSA9IGZ1bmN0aW9uIChlLHQpe1xuXHQgICAgbGV0IHYgPSBlLnZhbHVlO1xuXHQgICAgbGV0IHIgPSBnZXRDYXJldFJhbmdlKGUpO1xuXHQgICAgZS52YWx1ZSA9IHYuc2xpY2UoMCxyWzBdKSArIHQgKyB2LnNsaWNlKHJbMV0pO1xuXHQgICAgc2V0Q2FyZXRQb3NpdGlvbihlLCByWzBdK3QubGVuZ3RoKTtcblx0ICAgIGUuZm9jdXMoKTtcblx0fVxuXHRsZXQgcmFuZ2UgPSBnZXRDYXJldFJhbmdlKGllbHQpO1xuXHRpZiAocmFuZ2VbMF0gPT09IHJhbmdlWzFdKSB7XG5cdCAgICAvLyBubyBjdXJyZW50IHNlbGVjdGlvblxuXHQgICAgc3BsaWNlKGllbHQsIHRleHQpO1xuXHQgICAgaWYgKHRleHQgPT09IFwiKClcIikgXG5cdFx0bW92ZUNhcmV0UG9zaXRpb24oaWVsdCwgLTEpO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgLy8gdGhlcmUgaXMgYSBjdXJyZW50IHNlbGVjdGlvblxuXHQgICAgaWYgKHRleHQgPT09IFwiKClcIilcblx0XHQvLyBzdXJyb3VuZCBjdXJyZW50IHNlbGVjdGlvbiB3aXRoIHBhcmVucywgdGhlbiBtb3ZlIGNhcmV0IGFmdGVyXG5cdFx0dGV4dCA9ICcoJyArIHYuc2xpY2UocmFuZ2VbMF0scmFuZ2VbMV0pICsgJyknO1xuXHQgICAgc3BsaWNlKGllbHQsIHRleHQpXG5cdH1cblx0dGhpcy52YWxpZGF0ZUV4cHIoKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBMaXN0RWRpdG9yXG5cbmV4cG9ydCB7IExpc3RFZGl0b3IgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0xpc3RFZGl0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEZhY2V0IH0gZnJvbSAnLi9GYWNldCc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgRmFjZXRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwKSB7XG5cdHRoaXMuYXBwID0gYXBwO1xuXHR0aGlzLmZhY2V0cyA9IFtdO1xuXHR0aGlzLm5hbWUyZmFjZXQgPSB7fVxuICAgIH1cbiAgICBhZGRGYWNldCAobmFtZSwgdmFsdWVGY24pIHtcblx0aWYgKHRoaXMubmFtZTJmYWNldFtuYW1lXSkgdGhyb3cgXCJEdXBsaWNhdGUgZmFjZXQgbmFtZS4gXCIgKyBuYW1lO1xuXHRsZXQgZmFjZXQgPSBuZXcgRmFjZXQobmFtZSwgdGhpcywgdmFsdWVGY24pO1xuICAgICAgICB0aGlzLmZhY2V0cy5wdXNoKCBmYWNldCApO1xuXHR0aGlzLm5hbWUyZmFjZXRbbmFtZV0gPSBmYWNldDtcblx0cmV0dXJuIGZhY2V0XG4gICAgfVxuICAgIHRlc3QgKGYpIHtcbiAgICAgICAgbGV0IHZhbHMgPSB0aGlzLmZhY2V0cy5tYXAoIGZhY2V0ID0+IGZhY2V0LnRlc3QoZikgKTtcblx0cmV0dXJuIHZhbHMucmVkdWNlKChhY2N1bSwgdmFsKSA9PiBhY2N1bSAmJiB2YWwsIHRydWUpO1xuICAgIH1cbiAgICBhcHBseUFsbCAoKSB7XG5cdGxldCBzaG93ID0gbnVsbDtcblx0bGV0IGhpZGUgPSBcIm5vbmVcIjtcblx0Ly8gRklYTUU6IG1ham9yIHJlYWNob3ZlclxuXHR0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcImcuc3RyaXBzXCIpLnNlbGVjdEFsbCgnLmZlYXR1cmUnKVxuXHQgICAgLnN0eWxlKFwiZGlzcGxheVwiLCBmID0+IHRoaXMudGVzdChmKSA/IHNob3cgOiBoaWRlKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBGYWNldE1hbmFnZXJcblxuZXhwb3J0IHsgRmFjZXRNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GYWNldE1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgRmFjZXQge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lLCBtYW5hZ2VyLCB2YWx1ZUZjbikge1xuXHR0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuXHR0aGlzLnZhbHVlcyA9IFtdO1xuXHR0aGlzLnZhbHVlRmNuID0gdmFsdWVGY247XG4gICAgfVxuICAgIHNldFZhbHVlcyAodmFsdWVzLCBxdWlldGx5KSB7XG4gICAgICAgIHRoaXMudmFsdWVzID0gdmFsdWVzO1xuXHRpZiAoISBxdWlldGx5KSB7XG5cdCAgICB0aGlzLm1hbmFnZXIuYXBwbHlBbGwoKTtcblx0ICAgIHRoaXMubWFuYWdlci5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH1cbiAgICB9XG4gICAgdGVzdCAoZikge1xuICAgICAgICByZXR1cm4gIXRoaXMudmFsdWVzIHx8IHRoaXMudmFsdWVzLmxlbmd0aCA9PT0gMCB8fCB0aGlzLnZhbHVlcy5pbmRleE9mKCB0aGlzLnZhbHVlRmNuKGYpICkgPj0gMDtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBGYWNldFxuXG5leHBvcnQgeyBGYWNldCB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmFjZXQuanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGQzdHN2IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBCbG9ja1RyYW5zbGF0b3IgfSBmcm9tICcuL0Jsb2NrVHJhbnNsYXRvcic7XG5pbXBvcnQgeyBLZXlTdG9yZSB9IGZyb20gJy4vS2V5U3RvcmUnO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEJsb2NrVHJhbnNsYXRvciBtYW5hZ2VyIGNsYXNzLiBGb3IgYW55IGdpdmVuIHBhaXIgb2YgZ2Vub21lcywgQSBhbmQgQiwgbG9hZHMgdGhlIHNpbmdsZSBibG9jayBmaWxlXG4vLyBmb3IgdHJhbnNsYXRpbmcgYmV0d2VlbiB0aGVtLCBhbmQgaW5kZXhlcyBpdCBcImZyb20gYm90aCBkaXJlY3Rpb25zXCI6XG4vLyBcdEEtPkItPiBbQUJfQmxvY2tGaWxlXSA8LUE8LUJcbi8vXG5jbGFzcyBCVE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG5cdHRoaXMucmNCbG9ja3MgPSB7fTtcblx0dGhpcy5ibG9ja1N0b3JlID0gbmV3IEtleVN0b3JlKCdzeW50ZW55LWJsb2NrcycpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlZ2lzdGVyQmxvY2tzIChhR2Vub21lLCBiR2Vub21lLCBibG9ja3MpIHtcblx0bGV0IGFuYW1lID0gYUdlbm9tZS5uYW1lO1xuXHRsZXQgYm5hbWUgPSBiR2Vub21lLm5hbWU7XG5cdGNvbnNvbGUubG9nKGBSZWdpc3RlcmluZyBibG9ja3M6ICR7YW5hbWV9IHZzICR7Ym5hbWV9YCwgYCNibG9ja3M9JHtibG9ja3MubGVuZ3RofWApO1xuXHRsZXQgYmxrRmlsZSA9IG5ldyBCbG9ja1RyYW5zbGF0b3IoYUdlbm9tZSxiR2Vub21lLGJsb2Nrcyk7XG5cdGlmKCAhIHRoaXMucmNCbG9ja3NbYW5hbWVdKSB0aGlzLnJjQmxvY2tzW2FuYW1lXSA9IHt9O1xuXHRpZiggISB0aGlzLnJjQmxvY2tzW2JuYW1lXSkgdGhpcy5yY0Jsb2Nrc1tibmFtZV0gPSB7fTtcblx0dGhpcy5yY0Jsb2Nrc1thbmFtZV1bYm5hbWVdID0gYmxrRmlsZTtcblx0dGhpcy5yY0Jsb2Nrc1tibmFtZV1bYW5hbWVdID0gYmxrRmlsZTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBMb2FkcyB0aGUgc3ludGVueSBibG9jayBmaWxlIGZvciBnZW5vbWVzIGFHZW5vbWUgYW5kIGJHZW5vbWUuXG4gICAgLy8gXG4gICAgZ2V0QmxvY2tGaWxlIChhR2Vub21lLCBiR2Vub21lKSB7XG5cdC8vIEJlIGEgbGl0dGxlIHNtYXJ0IGFib3V0IHRoZSBvcmRlciB3ZSB0cnkgdGhlIG5hbWVzLi4uXG5cdGlmIChiR2Vub21lLm5hbWUgPCBhR2Vub21lLm5hbWUpIHtcblx0ICAgIGxldCB0bXAgPSBhR2Vub21lOyBhR2Vub21lID0gYkdlbm9tZTsgYkdlbm9tZSA9IHRtcDtcblx0fVxuXHQvLyBGaXJzdCwgc2VlIGlmIHdlIGFscmVhZHkgaGF2ZSB0aGlzIHBhaXJcblx0bGV0IGFuYW1lID0gYUdlbm9tZS5uYW1lO1xuXHRsZXQgYm5hbWUgPSBiR2Vub21lLm5hbWU7XG5cdGxldCBiZiA9ICh0aGlzLnJjQmxvY2tzW2FuYW1lXSB8fCB7fSlbYm5hbWVdO1xuXHRpZiAoYmYpXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGJmKTtcblx0XG5cdC8vIFNlY29uZCwgdHJ5IGxvY2FsIGRpc2sgY2FjaGVcblx0bGV0IGtleSA9IGFuYW1lICsgJy0nICsgYm5hbWU7XG5cdHJldHVybiB0aGlzLmJsb2NrU3RvcmUuZ2V0KGtleSkudGhlbihkYXRhID0+IHtcblx0ICAgIGlmIChkYXRhKSB7XG5cdFx0Y29uc29sZS5sb2coXCJGb3VuZCBibG9ja3MgaW4gY2FjaGUuXCIpO1xuXHQgICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdGVyQmxvY2tzKGFHZW5vbWUsIGJHZW5vbWUsIGRhdGEpO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZiAodGhpcy5zZXJ2ZXJSZXF1ZXN0KSB7XG5cdCAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW4gb3V0c3RhbmRpbmcgcmVxdWVzdCwgd2FpdCB1bnRpbCBpdCdzIGRvbmUgYW5kIHRyeSBhZ2Fpbi5cblx0XHR0aGlzLnNlcnZlclJlcXVlc3QudGhlbigoKT0+dGhpcy5nZXRCbG9ja0ZpbGUoYUdlbm9tZSwgYkdlbm9tZSkpO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0Ly8gVGhpcmQsIGxvYWQgZnJvbSBzZXJ2ZXIuXG5cdFx0bGV0IGZuID0gYC4vZGF0YS9nZW5vbWVkYXRhL2Jsb2Nrcy50c3ZgXG5cdFx0Y29uc29sZS5sb2coXCJSZXF1ZXN0aW5nIGJsb2NrIGZpbGUgZnJvbTogXCIgKyBmbik7XG5cdFx0dGhpcy5zZXJ2ZXJSZXF1ZXN0ID0gZDN0c3YoZm4pLnRoZW4oYmxvY2tzID0+IHtcblx0XHQgICAgbGV0IHJicyA9IGJsb2Nrcy5yZWR1Y2UoIChhLGIpID0+IHtcblx0XHQgICAgbGV0IGsgPSBiLmFHZW5vbWUgKyAnLScgKyBiLmJHZW5vbWU7XG5cdFx0ICAgIGlmICghKGsgaW4gYSkpIGFba10gPSBbXTtcblx0XHQgICAgICAgIGFba10ucHVzaChiKTtcblx0XHRcdHJldHVybiBhO1xuXHRcdCAgICB9LCB7fSk7XG5cdFx0ICAgIGZvciAobGV0IG4gaW4gcmJzKSB7XG5cdFx0ICAgICAgICB0aGlzLmJsb2NrU3RvcmUuc2V0KG4sIHJic1tuXSk7XG5cdFx0ICAgIH1cblx0XHR9KTtcblx0XHRyZXR1cm4gdGhpcy5zZXJ2ZXJSZXF1ZXN0O1xuXHQgICAgfVxuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIHRoZSB0cmFuc2xhdG9yIGhhcyBsb2FkZWQgYWxsIHRoZSBkYXRhIG5lZWRlZFxuICAgIC8vIGZvciB0cmFuc2xhdGluZyBjb29yZGluYXRlcyBiZXR3ZWVuIHRoZSBjdXJyZW50IHJlZiBzdHJhaW4gYW5kIHRoZSBjdXJyZW50IGNvbXBhcmlzb24gc3RyYWlucy5cbiAgICAvL1xuICAgIHJlYWR5ICgpIHtcblx0bGV0IHByb21pc2VzID0gdGhpcy5hcHAuY0dlbm9tZXMubWFwKGNnID0+IHRoaXMuZ2V0QmxvY2tGaWxlKHRoaXMuYXBwLnJHZW5vbWUsIGNnKSk7XG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBzeW50ZW55IGJsb2NrIHRyYW5zbGF0b3IgdGhhdCBtYXBzIHRoZSBjdXJyZW50IHJlZiBnZW5vbWUgdG8gdGhlIHNwZWNpZmllZCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIGdldEJsb2NrcyAoZnJvbUdlbm9tZSwgdG9HZW5vbWUpIHtcbiAgICAgICAgbGV0IGJsa1RyYW5zID0gdGhpcy5yY0Jsb2Nrc1tmcm9tR2Vub21lLm5hbWVdW3RvR2Vub21lLm5hbWVdO1xuXHRyZXR1cm4gYmxrVHJhbnMuZ2V0QmxvY2tzKGZyb21HZW5vbWUpXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVHJhbnNsYXRlcyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSBzcGVjaWZpZWQgZnJvbUdlbm9tZSB0byB0aGUgc3BlY2lmaWVkIHRvR2Vub21lLlxuICAgIC8vIFJldHVybnMgYSBsaXN0IG9mIHplcm8gb3IgbW9yZSBjb29yZGluYXRlIHJhbmdlcyBpbiB0aGUgdG9HZW5vbWUuXG4gICAgLy9cbiAgICB0cmFuc2xhdGUgKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCwgdG9HZW5vbWUsIGludmVydGVkKSB7XG5cdC8vIGdldCB0aGUgcmlnaHQgYmxvY2sgZmlsZVxuXHRsZXQgYmxrVHJhbnMgPSB0aGlzLnJjQmxvY2tzW2Zyb21HZW5vbWUubmFtZV1bdG9HZW5vbWUubmFtZV07XG5cdGlmICghYmxrVHJhbnMpIHRocm93IFwiSW50ZXJuYWwgZXJyb3IuIE5vIGJsb2NrIGZpbGUgZm91bmQgaW4gaW5kZXguXCJcblx0Ly8gdHJhbnNsYXRlIVxuXHRsZXQgcmFuZ2VzID0gYmxrVHJhbnMudHJhbnNsYXRlKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCwgaW52ZXJ0ZWQpO1xuXHRyZXR1cm4gcmFuZ2VzO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhckNhY2hlZERhdGEgKCkge1xuXHRjb25zb2xlLmxvZyhcIkJUTWFuYWdlcjogQ2FjaGUgY2xlYXJlZC5cIilcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvY2tTdG9yZS5jbGVhcigpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEJUTWFuYWdlclxuXG5leHBvcnQgeyBCVE1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0JUTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTb21ldGhpbmcgdGhhdCBrbm93cyBob3cgdG8gdHJhbnNsYXRlIGNvb3JkaW5hdGVzIGJldHdlZW4gdHdvIGdlbm9tZXMuXG4vL1xuLy9cbmNsYXNzIEJsb2NrVHJhbnNsYXRvciB7XG4gICAgY29uc3RydWN0b3IoYUdlbm9tZSwgYkdlbm9tZSwgYmxvY2tzKXtcblx0dGhpcy5hR2Vub21lID0gYUdlbm9tZTtcblx0dGhpcy5iR2Vub21lID0gYkdlbm9tZTtcblx0dGhpcy5ibG9ja3MgPSBibG9ja3MubWFwKGIgPT4gdGhpcy5wcm9jZXNzQmxvY2soYikpXG5cdHRoaXMuY3VyclNvcnQgPSBcImFcIjsgLy8gZWl0aGVyICdhJyBvciAnYidcbiAgICB9XG4gICAgcHJvY2Vzc0Jsb2NrIChibGspIHsgXG4gICAgICAgIGJsay5hSW5kZXggPSBwYXJzZUludChibGsuYUluZGV4KTtcbiAgICAgICAgYmxrLmJJbmRleCA9IHBhcnNlSW50KGJsay5iSW5kZXgpO1xuICAgICAgICBibGsuYVN0YXJ0ID0gcGFyc2VJbnQoYmxrLmFTdGFydCk7XG4gICAgICAgIGJsay5iU3RhcnQgPSBwYXJzZUludChibGsuYlN0YXJ0KTtcbiAgICAgICAgYmxrLmFFbmQgICA9IHBhcnNlSW50KGJsay5hRW5kKTtcbiAgICAgICAgYmxrLmJFbmQgICA9IHBhcnNlSW50KGJsay5iRW5kKTtcbiAgICAgICAgYmxrLmFMZW5ndGggICA9IHBhcnNlSW50KGJsay5hTGVuZ3RoKTtcbiAgICAgICAgYmxrLmJMZW5ndGggICA9IHBhcnNlSW50KGJsay5iTGVuZ3RoKTtcbiAgICAgICAgYmxrLmJsb2NrQ291bnQgICA9IHBhcnNlSW50KGJsay5ibG9ja0NvdW50KTtcbiAgICAgICAgYmxrLmJsb2NrUmF0aW8gICA9IHBhcnNlRmxvYXQoYmxrLmJsb2NrUmF0aW8pO1xuXHRibGsuYWJNYXAgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHQgICAgLmRvbWFpbihbYmxrLmFTdGFydCxibGsuYUVuZF0pXG5cdCAgICAucmFuZ2UoIGJsay5ibG9ja09yaT09PVwiLVwiID8gW2Jsay5iRW5kLGJsay5iU3RhcnRdIDogW2Jsay5iU3RhcnQsYmxrLmJFbmRdKTtcblx0YmxrLmJhTWFwID0gYmxrLmFiTWFwLmludmVydFxuXHRyZXR1cm4gYmxrO1xuICAgIH1cbiAgICBzZXRTb3J0ICh3aGljaCkge1xuXHRpZiAod2hpY2ggIT09ICdhJyAmJiB3aGljaCAhPT0gJ2InKSB0aHJvdyBcIkJhZCBhcmd1bWVudDpcIiArIHdoaWNoO1xuXHRsZXQgc29ydENvbCA9IHdoaWNoICsgXCJJbmRleFwiO1xuXHRsZXQgY21wID0gKHgseSkgPT4geFtzb3J0Q29sXSAtIHlbc29ydENvbF07XG5cdHRoaXMuYmxvY2tzLnNvcnQoY21wKTtcblx0dGhpcy5jdXJyU29ydCA9IHdoaWNoO1xuICAgIH1cbiAgICBmbGlwU29ydCAoKSB7XG5cdHRoaXMuc2V0U29ydCh0aGlzLmN1cnJTb3J0ID09PSBcImFcIiA/IFwiYlwiIDogXCJhXCIpO1xuICAgIH1cbiAgICAvLyBHaXZlbiBhIGdlbm9tZSAoZWl0aGVyIHRoZSBhIG9yIGIgZ2Vub21lKSBhbmQgYSBjb29yZGluYXRlIHJhbmdlLFxuICAgIC8vIHJldHVybnMgdGhlIGVxdWl2YWxlbnQgY29vcmRpbmF0ZSByYW5nZShzKSBpbiB0aGUgb3RoZXIgZ2Vub21lXG4gICAgdHJhbnNsYXRlIChmcm9tR2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQsIGludmVydCkge1xuXHQvL1xuXHRlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHN0YXJ0IDogZW5kO1xuXHQvLyBmcm9tID0gXCJhXCIgb3IgXCJiXCIsIGRlcGVuZGluZyBvbiB3aGljaCBnZW5vbWUgaXMgZ2l2ZW4uXG4gICAgICAgIGxldCBmcm9tID0gKGZyb21HZW5vbWUgPT09IHRoaXMuYUdlbm9tZSA/IFwiYVwiIDogZnJvbUdlbm9tZSA9PT0gdGhpcy5iR2Vub21lID8gXCJiXCIgOiBudWxsKTtcblx0aWYgKCFmcm9tKSB0aHJvdyBcIkJhZCBhcmd1bWVudC4gR2Vub21lIG5laXRoZXIgQSBub3IgQi5cIjtcblx0Ly8gdG8gPSBcImJcIiBvciBcImFcIiwgb3Bwb3NpdGUgb2YgZnJvbVxuXHRsZXQgdG8gPSAoZnJvbSA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcblx0Ly8gbWFrZSBzdXJlIHRoZSBibG9ja3MgYXJlIHNvcnRlZCBieSB0aGUgZnJvbSBnZW5vbWVcblx0dGhpcy5zZXRTb3J0KGZyb20pO1xuXHQvL1xuXHRsZXQgZnJvbUMgPSBmcm9tK1wiQ2hyXCI7XG5cdGxldCBmcm9tUyA9IGZyb20rXCJTdGFydFwiO1xuXHRsZXQgZnJvbUUgPSBmcm9tK1wiRW5kXCI7XG5cdGxldCBmcm9tSSA9IGZyb20rXCJJbmRleFwiO1xuXHRsZXQgdG9DID0gdG8rXCJDaHJcIjtcblx0bGV0IHRvUyA9IHRvK1wiU3RhcnRcIjtcblx0bGV0IHRvRSA9IHRvK1wiRW5kXCI7XG5cdGxldCB0b0kgPSB0bytcIkluZGV4XCI7XG5cdGxldCBtYXBwZXIgPSBmcm9tK3RvK1wiTWFwXCI7XG5cdC8vIFxuXHRsZXQgYmxrcyA9IHRoaXMuYmxvY2tzXG5cdCAgICAvLyBGaXJzdCBmaWx0ZXIgZm9yIGJsb2NrcyB0aGF0IG92ZXJsYXAgdGhlIGdpdmVuIGNvb3JkaW5hdGUgcmFuZ2UgaW4gdGhlIGZyb20gZ2Vub21lXG5cdCAgICAuZmlsdGVyKGJsayA9PiBibGtbZnJvbUNdID09PSBjaHIgJiYgYmxrW2Zyb21TXSA8PSBlbmQgJiYgYmxrW2Zyb21FXSA+PSBzdGFydClcblx0ICAgIC8vIG1hcCBlYWNoIGJsb2NrLiBcblx0ICAgIC5tYXAoYmxrID0+IHtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgZnJvbSBzaWRlLlxuXHRcdGxldCBzID0gTWF0aC5tYXgoc3RhcnQsIGJsa1tmcm9tU10pO1xuXHRcdGxldCBlID0gTWF0aC5taW4oZW5kLCBibGtbZnJvbUVdKTtcblx0XHQvLyBjb29yZCByYW5nZSBvbiB0aGUgdG8gc2lkZS5cblx0XHRsZXQgczIgPSBNYXRoLmNlaWwoYmxrW21hcHBlcl0ocykpO1xuXHRcdGxldCBlMiA9IE1hdGguZmxvb3IoYmxrW21hcHBlcl0oZSkpO1xuXHQgICAgICAgIHJldHVybiBpbnZlcnQgPyB7XG5cdFx0ICAgIGNocjogICBibGtbZnJvbUNdLFxuXHRcdCAgICBzdGFydDogcyxcblx0XHQgICAgZW5kOiAgIGUsXG5cdFx0ICAgIG9yaTogICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGluZGV4OiBibGtbZnJvbUldLFxuXHRcdCAgICAvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZHMgZm9yIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0ICAgIGZDaHI6ICAgYmxrW3RvQ10sXG5cdFx0ICAgIGZTdGFydDogTWF0aC5taW4oczIsZTIpLFxuXHRcdCAgICBmRW5kOiAgIE1hdGgubWF4KHMyLGUyKSxcblx0XHQgICAgZkluZGV4OiBibGtbdG9JXSxcblx0XHQgICAgLy8gaW5jbHVkZSB0aGUgYmxvY2sgaWQgYW5kIGZ1bGwgYmxvY2sgY29vcmRzXG5cdFx0ICAgIGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdCAgICBibG9ja1N0YXJ0OiBibGtbZnJvbVNdLFxuXHRcdCAgICBibG9ja0VuZDogYmxrW2Zyb21FXVxuXHRcdH0gOiB7XG5cdFx0ICAgIGNocjogICBibGtbdG9DXSxcblx0XHQgICAgc3RhcnQ6IE1hdGgubWluKHMyLGUyKSxcblx0XHQgICAgZW5kOiAgIE1hdGgubWF4KHMyLGUyKSxcblx0XHQgICAgb3JpOiAgIGJsay5ibG9ja09yaSxcblx0XHQgICAgaW5kZXg6IGJsa1t0b0ldLFxuXHRcdCAgICAvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZHMgZm9yIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0ICAgIGZDaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgZlN0YXJ0OiBzLFxuXHRcdCAgICBmRW5kOiAgIGUsXG5cdFx0ICAgIGZJbmRleDogYmxrW2Zyb21JXSxcblx0XHQgICAgLy8gaW5jbHVkZSB0aGUgYmxvY2sgaWQgYW5kIGZ1bGwgYmxvY2sgY29vcmRzXG5cdFx0ICAgIGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdCAgICBibG9ja1N0YXJ0OiBibGtbdG9TXSxcblx0XHQgICAgYmxvY2tFbmQ6IGJsa1t0b0VdXG5cdFx0fTtcblx0ICAgIH0pO1xuXHRpZiAoIWludmVydCkge1xuXHQgICAgLy8gTG9vayBmb3IgMS1ibG9jayBnYXBzIGFuZCBmaWxsIHRoZW0gaW4uIFxuXHQgICAgYmxrcy5zb3J0KChhLGIpID0+IGEuaW5kZXggLSBiLmluZGV4KTtcblx0ICAgIGxldCBuYnMgPSBbXTtcblx0ICAgIGJsa3MuZm9yRWFjaCggKGIsIGkpID0+IHtcblx0XHRpZiAoaSA9PT0gMCkgcmV0dXJuO1xuXHRcdGlmIChibGtzW2ldLmluZGV4IC0gYmxrc1tpIC0gMV0uaW5kZXggPT09IDIpIHtcblx0XHQgICAgbGV0IGJsayA9IHRoaXMuYmxvY2tzLmZpbHRlciggYiA9PiBiW3RvSV0gPT09IGJsa3NbaV0uaW5kZXggLSAxIClbMF07XG5cdFx0ICAgIG5icy5wdXNoKHtcblx0XHRcdGNocjogICBibGtbdG9DXSxcblx0XHRcdHN0YXJ0OiBibGtbdG9TXSxcblx0XHRcdGVuZDogICBibGtbdG9FXSxcblx0XHRcdG9yaTogICBibGsuYmxvY2tPcmksXG5cdFx0XHRpbmRleDogYmxrW3RvSV0sXG5cdFx0XHQvLyBhbHNvIHJldHVybiB0aGUgZnJvbUdlbm9tZSBjb29yZHMgZm9yIHRoaXMgcGllY2Ugb2YgdGhlIHRyYW5zbGF0aW9uXG5cdFx0XHRmQ2hyOiAgIGJsa1tmcm9tQ10sXG5cdFx0XHRmU3RhcnQ6IGJsa1tmcm9tU10sXG5cdFx0XHRmRW5kOiAgIGJsa1tmcm9tRV0sXG5cdFx0XHRmSW5kZXg6IGJsa1tmcm9tSV0sXG5cdFx0XHQvLyBpbmNsdWRlIHRoZSBibG9jayBpZCBhbmQgZnVsbCBibG9jayBjb29yZHNcblx0XHRcdGJsb2NrSWQ6IGJsay5ibG9ja0lkLFxuXHRcdFx0YmxvY2tTdGFydDogYmxrW3RvU10sXG5cdFx0XHRibG9ja0VuZDogYmxrW3RvRV1cblx0XHQgICAgfSk7XG5cdFx0fVxuXHQgICAgfSk7XG5cdCAgICBibGtzID0gYmxrcy5jb25jYXQobmJzKTtcblx0fVxuXHRibGtzLnNvcnQoKGEsYikgPT4gYS5mSW5kZXggLSBiLmZJbmRleCk7XG5cdHJldHVybiBibGtzO1xuICAgIH1cbiAgICAvLyBHaXZlbiBhIGdlbm9tZSAoZWl0aGVyIHRoZSBhIG9yIGIgZ2Vub21lKVxuICAgIC8vIHJldHVybnMgdGhlIGJsb2NrcyBmb3IgdHJhbnNsYXRpbmcgdG8gdGhlIG90aGVyIChiIG9yIGEpIGdlbm9tZS5cbiAgICAvL1xuICAgIGdldEJsb2NrcyAoZnJvbUdlbm9tZSkge1xuXHQvLyBmcm9tID0gXCJhXCIgb3IgXCJiXCIsIGRlcGVuZGluZyBvbiB3aGljaCBnZW5vbWUgaXMgZ2l2ZW4uXG4gICAgICAgIGxldCBmcm9tID0gKGZyb21HZW5vbWUgPT09IHRoaXMuYUdlbm9tZSA/IFwiYVwiIDogZnJvbUdlbm9tZSA9PT0gdGhpcy5iR2Vub21lID8gXCJiXCIgOiBudWxsKTtcblx0aWYgKCFmcm9tKSB0aHJvdyBcIkJhZCBhcmd1bWVudC4gR2Vub21lIG5laXRoZXIgQSBub3IgQi5cIjtcblx0Ly8gdG8gPSBcImJcIiBvciBcImFcIiwgb3Bwb3NpdGUgb2YgZnJvbVxuXHRsZXQgdG8gPSAoZnJvbSA9PT0gXCJhXCIgPyBcImJcIiA6IFwiYVwiKTtcblx0Ly8gbWFrZSBzdXJlIHRoZSBibG9ja3MgYXJlIHNvcnRlZCBieSB0aGUgZnJvbSBnZW5vbWVcblx0dGhpcy5zZXRTb3J0KGZyb20pO1xuXHQvL1xuXHRsZXQgZnJvbUMgPSBmcm9tK1wiQ2hyXCI7XG5cdGxldCBmcm9tUyA9IGZyb20rXCJTdGFydFwiO1xuXHRsZXQgZnJvbUUgPSBmcm9tK1wiRW5kXCI7XG5cdGxldCBmcm9tSSA9IGZyb20rXCJJbmRleFwiO1xuXHRsZXQgdG9DID0gdG8rXCJDaHJcIjtcblx0bGV0IHRvUyA9IHRvK1wiU3RhcnRcIjtcblx0bGV0IHRvRSA9IHRvK1wiRW5kXCI7XG5cdGxldCB0b0kgPSB0bytcIkluZGV4XCI7XG5cdGxldCBtYXBwZXIgPSBmcm9tK3RvK1wiTWFwXCI7XG5cdC8vIFxuXHRsZXQgYmxrcyA9IHRoaXMuYmxvY2tzXG5cdCAgICAubWFwKGJsayA9PiB7XG5cdCAgICAgICAgcmV0dXJuIHtcblx0XHQgICAgYmxvY2tJZDogICBibGsuYmxvY2tJZCxcblx0XHQgICAgb3JpOiAgICAgICBibGsuYmxvY2tPcmksXG5cdFx0ICAgIGZyb21DaHI6ICAgYmxrW2Zyb21DXSxcblx0XHQgICAgZnJvbVN0YXJ0OiBibGtbZnJvbVNdLFxuXHRcdCAgICBmcm9tRW5kOiAgIGJsa1tmcm9tRV0sXG5cdFx0ICAgIGZyb21JbmRleDogYmxrW2Zyb21JXSxcblx0XHQgICAgdG9DaHI6ICAgICBibGtbdG9DXSxcblx0XHQgICAgdG9TdGFydDogICBibGtbdG9TXSxcblx0XHQgICAgdG9FbmQ6ICAgICBibGtbdG9FXSxcblx0XHQgICAgdG9JbmRleDogICBibGtbdG9JXVxuXHRcdH07XG5cdCAgICB9KVxuXHQvLyBcblx0cmV0dXJuIGJsa3M7XG4gICAgfVxufVxuXG5leHBvcnQgeyBCbG9ja1RyYW5zbGF0b3IgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0Jsb2NrVHJhbnNsYXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgU1ZHVmlldyB9IGZyb20gJy4vU1ZHVmlldyc7XG5pbXBvcnQgeyBjb29yZHNBZnRlclRyYW5zZm9ybSB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIEdlbm9tZVZpZXcgZXh0ZW5kcyBTVkdWaWV3IHtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQpO1xuXHR0aGlzLm9wZW5XaWR0aCA9IHRoaXMub3V0ZXJXaWR0aDtcblx0dGhpcy5vcGVuSGVpZ2h0PSB0aGlzLm91dGVySGVpZ2h0O1xuXHR0aGlzLnRvdGFsQ2hyV2lkdGggPSA0MDsgLy8gdG90YWwgd2lkdGggb2Ygb25lIGNocm9tb3NvbWUgKGJhY2tib25lK2Jsb2NrcytmZWF0cylcblx0dGhpcy5jd2lkdGggPSAyMDsgICAgICAgIC8vIGNocm9tb3NvbWUgd2lkdGhcblx0dGhpcy50aWNrTGVuZ3RoID0gMTA7XHQgLy8gZmVhdHVyZSB0aWNrIG1hcmsgbGVuZ3RoXG5cdHRoaXMuYnJ1c2hDaHIgPSBudWxsO1x0IC8vIHdoaWNoIGNociBoYXMgdGhlIGN1cnJlbnQgYnJ1c2hcblx0dGhpcy5id2lkdGggPSB0aGlzLmN3aWR0aC8yOyAgLy8gYmxvY2sgd2lkdGhcblx0dGhpcy5jdXJyQmxvY2tzID0gbnVsbDtcblx0dGhpcy5jdXJyVGlja3MgPSBudWxsO1xuXHR0aGlzLmdDaHJvbW9zb21lcyA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ2cnKS5hdHRyKFwibmFtZVwiLCBcImNocm9tb3NvbWVzXCIpO1xuXHR0aGlzLnRpdGxlICAgID0gdGhpcy5zdmdNYWluLmFwcGVuZCgndGV4dCcpLmF0dHIoXCJjbGFzc1wiLCBcInRpdGxlXCIpO1xuXHR0aGlzLnNjcm9sbEFtb3VudCA9IDA7XG5cdC8vXG5cdHRoaXMuaW5pdERvbSgpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmaXRUb1dpZHRoICh3KXtcbiAgICAgICAgc3VwZXIuZml0VG9XaWR0aCh3KTtcblx0dGhpcy5vcGVuV2lkdGggPSB0aGlzLm91dGVyV2lkdGg7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXREb20gKCkge1xuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uLmNsb3NlJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB0aGlzLnJlZHJhdygpKTtcblx0dGhpcy5zdmcub24oXCJ3aGVlbFwiLCAoKSA9PiB7XG5cdCAgICBpZiAoIXRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIpKSByZXR1cm47XG5cdCAgICB0aGlzLnNjcm9sbFdoZWVsKGQzLmV2ZW50LmRlbHRhWSlcblx0ICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH0pO1xuXHRsZXQgc2JzID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJzdmdjb250YWluZXJcIl0gPiBbbmFtZT1cInNjcm9sbGJ1dHRvbnNcIl0nKVxuXHRzYnMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJ1cFwiXScpLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zY3JvbGxDaHJvbW9zb21lc1VwKCkpO1xuXHRzYnMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJkblwiXScpLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zY3JvbGxDaHJvbW9zb21lc0Rvd24oKSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0QnJ1c2hDb29yZHMgKGNvb3Jkcykge1xuXHR0aGlzLmNsZWFyQnJ1c2hlcygpO1xuXHR0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3QoYC5jaHJvbW9zb21lW25hbWU9XCIke2Nvb3Jkcy5jaHJ9XCJdIGdbbmFtZT1cImJydXNoXCJdYClcblx0ICAuZWFjaChmdW5jdGlvbihjaHIpe1xuXHQgICAgY2hyLmJydXNoLmV4dGVudChbY29vcmRzLnN0YXJ0LGNvb3Jkcy5lbmRdKTtcblx0ICAgIGNoci5icnVzaChkMy5zZWxlY3QodGhpcykpO1xuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYnJ1c2hzdGFydCAoY2hyKXtcblx0dGhpcy5jbGVhckJydXNoZXMoY2hyLmJydXNoKTtcblx0dGhpcy5icnVzaENociA9IGNocjtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBicnVzaGVuZCAoKXtcblx0aWYoIXRoaXMuYnJ1c2hDaHIpIHJldHVybjtcblx0bGV0IGNjID0gdGhpcy5hcHAuY29vcmRzO1xuXHR2YXIgeHRudCA9IHRoaXMuYnJ1c2hDaHIuYnJ1c2guZXh0ZW50KCk7XG5cdGlmIChNYXRoLmFicyh4dG50WzBdIC0geHRudFsxXSkgPD0gMTApe1xuXHQgICAgLy8gdXNlciBjbGlja2VkXG5cdCAgICBsZXQgdyA9IGNjLmVuZCAtIGNjLnN0YXJ0ICsgMTtcblx0ICAgIHh0bnRbMF0gLT0gdy8yO1xuXHQgICAgeHRudFsxXSArPSB3LzI7XG5cdH1cblx0bGV0IGNvb3JkcyA9IHsgY2hyOnRoaXMuYnJ1c2hDaHIubmFtZSwgc3RhcnQ6TWF0aC5mbG9vcih4dG50WzBdKSwgZW5kOiBNYXRoLmZsb29yKHh0bnRbMV0pIH07XG5cdHRoaXMuYXBwLnNldENvbnRleHQoY29vcmRzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhckJydXNoZXMgKGV4Y2VwdCl7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbCgnW25hbWU9XCJicnVzaFwiXScpLmVhY2goZnVuY3Rpb24oY2hyKXtcblx0ICAgIGlmIChjaHIuYnJ1c2ggIT09IGV4Y2VwdCkge1xuXHRcdGNoci5icnVzaC5jbGVhcigpO1xuXHRcdGNoci5icnVzaChkMy5zZWxlY3QodGhpcykpO1xuXHQgICAgfVxuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRYIChjaHIpIHtcblx0bGV0IHggPSB0aGlzLmFwcC5yR2Vub21lLnhzY2FsZShjaHIpO1xuXHRpZiAoaXNOYU4oeCkpIHRocm93IFwieCBpcyBOYU5cIlxuXHRyZXR1cm4geDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0WSAocG9zKSB7XG5cdGxldCB5ID0gdGhpcy5hcHAuckdlbm9tZS55c2NhbGUocG9zKTtcblx0aWYgKGlzTmFOKHkpKSB0aHJvdyBcInkgaXMgTmFOXCJcblx0cmV0dXJuIHk7XG4gICAgfVxuICAgIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJlZHJhdyAoKSB7XG4gICAgICAgIHRoaXMuZHJhdyh0aGlzLmN1cnJUaWNrcywgdGhpcy5jdXJyQmxvY2tzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3ICh0aWNrRGF0YSwgYmxvY2tEYXRhKSB7XG5cdHRoaXMuZHJhd0Nocm9tb3NvbWVzKCk7XG5cdHRoaXMuZHJhd0Jsb2NrcyhibG9ja0RhdGEpO1xuXHR0aGlzLmRyYXdUaWNrcyh0aWNrRGF0YSk7XG5cdHRoaXMuZHJhd1RpdGxlKCk7XG5cdHRoaXMuc2V0QnJ1c2hDb29yZHModGhpcy5hcHAuY29vcmRzKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgY2hyb21vc29tZXMgb2YgdGhlIHJlZmVyZW5jZSBnZW5vbWUuXG4gICAgLy8gSW5jbHVkZXMgYmFja2JvbmVzLCBsYWJlbHMsIGFuZCBicnVzaGVzLlxuICAgIC8vIFRoZSBiYWNrYm9uZXMgYXJlIGRyYXduIGFzIHZlcnRpY2FsIGxpbmUgc2VtZW50cyxcbiAgICAvLyBkaXN0cmlidXRlZCBob3Jpem9udGFsbHkuIE9yZGVyaW5nIGlzIGRlZmluZWQgYnlcbiAgICAvLyB0aGUgbW9kZWwgKEdlbm9tZSBvYmplY3QpLlxuICAgIC8vIExhYmVscyBhcmUgZHJhd24gYWJvdmUgdGhlIGJhY2tib25lcy5cbiAgICAvL1xuICAgIC8vIE1vZGlmaWNhdGlvbjpcbiAgICAvLyBEcmF3cyB0aGUgc2NlbmUgaW4gb25lIG9mIHR3byBzdGF0ZXM6IG9wZW4gb3IgY2xvc2VkLlxuICAgIC8vIFRoZSBvcGVuIHN0YXRlIGlzIGFzIGRlc2NyaWJlZCAtIGFsbCBjaHJvbW9zb21lcyBzaG93bi5cbiAgICAvLyBJbiB0aGUgY2xvc2VkIHN0YXRlOiBcbiAgICAvLyAgICAgKiBvbmx5IG9uZSBjaHJvbW9zb21lIHNob3dzICh0aGUgY3VycmVudCBvbmUpXG4gICAgLy8gICAgICogZHJhd24gaG9yaXpvbnRhbGx5IGFuZCBwb3NpdGlvbmVkIGJlc2lkZSB0aGUgXCJHZW5vbWUgVmlld1wiIHRpdGxlXG4gICAgLy9cbiAgICBkcmF3Q2hyb21vc29tZXMgKCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0bGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTsgLy8gcmVmIGdlbm9tZVxuXHRsZXQgckNocnMgPSByZy5jaHJvbW9zb21lcztcblxuICAgICAgICAvLyBDaHJvbW9zb21lIGdyb3Vwc1xuXHRsZXQgY2hycyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpXG5cdCAgICAuZGF0YShyQ2hycywgYyA9PiBjLm5hbWUpO1xuXHRsZXQgbmV3Y2hycyA9IGNocnMuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsIFwiY2hyb21vc29tZVwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGMgPT4gYy5uYW1lKTtcblx0XG5cdG5ld2NocnMuYXBwZW5kKFwidGV4dFwiKS5hdHRyKFwibmFtZVwiLFwibGFiZWxcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwibGluZVwiKS5hdHRyKFwibmFtZVwiLFwiYmFja2JvbmVcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwic3luQmxvY2tzXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIixcInRpY2tzXCIpO1xuXHRuZXdjaHJzLmFwcGVuZChcImdcIikuYXR0cihcIm5hbWVcIixcImJydXNoXCIpO1xuXG5cblx0bGV0IGNsb3NlZCA9IHRoaXMucm9vdC5jbGFzc2VkKFwiY2xvc2VkXCIpO1xuXHQvLyBzZXQgZGlyZWN0aW9uIG9mIHRoZSByZXNpemUgY3Vyc29yLlxuXHRjaHJzLnNlbGVjdEFsbCgnZ1tuYW1lPVwiYnJ1c2hcIl0gZy5yZXNpemUnKS5zdHlsZSgnY3Vyc29yJywgY2xvc2VkID8gJ2V3LXJlc2l6ZScgOiAnbnMtcmVzaXplJylcblx0Ly9cblx0aWYgKGNsb3NlZCkge1xuXHQgICAgLy8gUmVzZXQgdGhlIFNWRyBzaXplIHRvIGJlIDEtY2hyb21vc29tZSB3aWRlLlxuXHQgICAgLy8gVHJhbnNsYXRlIHRoZSBjaHJvbW9zb21lcyBncm91cCBzbyB0aGF0IHRoZSBjdXJyZW50IGNocm9tb3NvbWUgYXBwZWFycyBpbiB0aGUgc3ZnIGFyZWEuXG5cdCAgICAvLyBUdXJuIGl0IDkwIGRlZy5cblxuXHQgICAgLy8gU2V0IHRoZSBoZWlnaHQgb2YgdGhlIFNWRyBhcmVhIHRvIDEgY2hyb21vc29tZSdzIHdpZHRoXG5cdCAgICB0aGlzLnNldEdlb20oeyBoZWlnaHQ6IHRoaXMudG90YWxDaHJXaWR0aCwgcm90YXRpb246IC05MCwgdHJhbnNsYXRpb246IFstdGhpcy50b3RhbENocldpZHRoLzIsMzBdIH0pO1xuXHQgICAgLy8gXG5cdCAgICBsZXQgZGVsdGEgPSAxMDtcblx0ICAgIHJnLnhzY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuXHRcdCAuZG9tYWluKHJDaHJzLm1hcChmdW5jdGlvbih4KXtyZXR1cm4geC5uYW1lO30pKVxuXHRcdCAvLyBpbiBjbG9zZWQgbW9kZSwgdGhlIGNocm9tb3NvbWVzIGhhdmUgZml4ZWQgc3BhY2luZ1xuXHRcdCAucmFuZ2VQb2ludHMoW2RlbHRhLCBkZWx0YSt0aGlzLnRvdGFsQ2hyV2lkdGgqKHJDaHJzLmxlbmd0aC0xKV0pO1xuXHQgICAgLy9cblx0ICAgIHJnLnlzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0IC5kb21haW4oWzEscmcubWF4bGVuXSlcblx0XHQgLnJhbmdlKFswLCB0aGlzLndpZHRoXSk7XG5cblx0ICAgIC8vIHRyYW5zbGF0ZSBlYWNoIGNocm9tb3NvbWUgaW50byBwb3NpdGlvblxuXHQgICAgY2hycy5hdHRyKFwidHJhbnNmb3JtXCIsIGMgPT4gYHRyYW5zbGF0ZSgke3JnLnhzY2FsZShjLm5hbWUpfSwgMClgKTtcbiAgICAgICAgICAgIC8vIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oLXJnLnhzY2FsZSh0aGlzLmFwcC5jb29yZHMuY2hyKSk7XG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgLy8gV2hlbiBvcGVuLCBkcmF3IGFsbCB0aGUgY2hyb21vc29tZXMuIEVhY2ggY2hyb20gaXMgYSB2ZXJ0aWNhbCBsaW5lLlxuXHQgICAgLy8gQ2hyb21zIGFyZSBkaXN0cmlidXRlZCBldmVubHkgYWNyb3NzIHRoZSBhdmFpbGFibGUgaG9yaXpvbnRhbCBzcGFjZS5cblx0ICAgIHRoaXMuc2V0R2VvbSh7IHdpZHRoOiB0aGlzLm9wZW5XaWR0aCwgaGVpZ2h0OiB0aGlzLm9wZW5IZWlnaHQsIHJvdGF0aW9uOiAwLCB0cmFuc2xhdGlvbjogWzAsMF0gfSk7XG5cdCAgICAvLyBcblx0ICAgIHJnLnhzY2FsZSA9IGQzLnNjYWxlLm9yZGluYWwoKVxuXHRcdCAuZG9tYWluKHJDaHJzLm1hcChmdW5jdGlvbih4KXtyZXR1cm4geC5uYW1lO30pKVxuXHRcdCAvLyBpbiBjbG9zZWQgbW9kZSwgdGhlIGNocm9tb3NvbWVzIHNwcmVhZCB0byBmaWxsIHRoZSBzcGFjZVxuXHRcdCAucmFuZ2VQb2ludHMoWzAsIHRoaXMub3BlbldpZHRoIC0gMzBdLCAwLjUpO1xuXHQgICAgcmcueXNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQgLmRvbWFpbihbMSxyZy5tYXhsZW5dKVxuXHRcdCAucmFuZ2UoWzAsIHRoaXMuaGVpZ2h0XSk7XG5cblx0ICAgIC8vIHRyYW5zbGF0ZSBlYWNoIGNocm9tb3NvbWUgaW50byBwb3NpdGlvblxuXHQgICAgY2hycy5hdHRyKFwidHJhbnNmb3JtXCIsIGMgPT4gYHRyYW5zbGF0ZSgke3JnLnhzY2FsZShjLm5hbWUpfSwgMClgKTtcbiAgICAgICAgICAgIC8vIHRyYW5zbGF0ZSB0aGUgY2hyb21vc29tZXMgZ3JvdXAuXG5cdCAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8oMCk7XG5cdH1cblxuXHRyQ2hycy5mb3JFYWNoKGNociA9PiB7XG5cdCAgICB2YXIgc2MgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdC5kb21haW4oWzEsY2hyLmxlbmd0aF0pXG5cdFx0LnJhbmdlKFswLCByZy55c2NhbGUoY2hyLmxlbmd0aCldKTtcblx0ICAgIGNoci5icnVzaCA9IGQzLnN2Zy5icnVzaCgpLnkoc2MpXG5cdCAgICAgICAub24oXCJicnVzaHN0YXJ0XCIsIGNociA9PiB0aGlzLmJydXNoc3RhcnQoY2hyKSlcblx0ICAgICAgIC5vbihcImJydXNoZW5kXCIsICgpID0+IHRoaXMuYnJ1c2hlbmQoKSk7XG5cdCAgfSwgdGhpcyk7XG5cblxuICAgICAgICBjaHJzLnNlbGVjdCgnW25hbWU9XCJsYWJlbFwiXScpXG5cdCAgICAudGV4dChjPT5jLm5hbWUpXG5cdCAgICAuYXR0cihcInhcIiwgMCkgXG5cdCAgICAuYXR0cihcInlcIiwgLTIpXG5cdCAgICA7XG5cblx0Y2hycy5zZWxlY3QoJ1tuYW1lPVwiYmFja2JvbmVcIl0nKVxuXHQgICAgLmF0dHIoXCJ4MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ5MVwiLCAwKVxuXHQgICAgLmF0dHIoXCJ4MlwiLCAwKVxuXHQgICAgLmF0dHIoXCJ5MlwiLCBjID0+IHJnLnlzY2FsZShjLmxlbmd0aCkpXG5cdCAgICA7XG5cdCAgIFxuXHRjaHJzLnNlbGVjdCgnW25hbWU9XCJicnVzaFwiXScpXG5cdCAgICAuZWFjaChmdW5jdGlvbihkKXtkMy5zZWxlY3QodGhpcykuY2FsbChkLmJydXNoKTt9KVxuXHQgICAgLnNlbGVjdEFsbCgncmVjdCcpXG5cdCAgICAgLmF0dHIoJ3dpZHRoJywxNilcblx0ICAgICAuYXR0cigneCcsIC04KVxuXHQgICAgO1xuXG5cdGNocnMuZXhpdCgpLnJlbW92ZSgpO1xuXHRcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTY3JvbGwgd2hlZWwgZXZlbnQgaGFuZGxlci5cbiAgICBzY3JvbGxXaGVlbCAoZHkpIHtcblx0Ly8gQWRkIGR5IHRvIHRvdGFsIHNjcm9sbCBhbW91bnQuIFRoZW4gdHJhbnNsYXRlIHRoZSBjaHJvbW9zb21lcyBncm91cC5cblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc0J5KGR5KTtcblx0Ly8gQWZ0ZXIgYSAyMDAgbXMgcGF1c2UgaW4gc2Nyb2xsaW5nLCBzbmFwIHRvIG5lYXJlc3QgY2hyb21vc29tZVxuXHR0aGlzLnRvdXQgJiYgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRvdXQpO1xuXHR0aGlzLnRvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKT0+dGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKSwgMjAwKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNUbyAoeCkge1xuICAgICAgICBpZiAoeCA9PT0gdW5kZWZpbmVkKSB4ID0gdGhpcy5zY3JvbGxBbW91bnQ7XG5cdHRoaXMuc2Nyb2xsQW1vdW50ID0gTWF0aC5tYXgoTWF0aC5taW4oeCwxNSksIC10aGlzLnRvdGFsQ2hyV2lkdGggKiAodGhpcy5hcHAuckdlbm9tZS5jaHJvbW9zb21lcy5sZW5ndGgtMSkpO1xuXHR0aGlzLmdDaHJvbW9zb21lcy5hdHRyKFwidHJhbnNmb3JtXCIsIGB0cmFuc2xhdGUoJHt0aGlzLnNjcm9sbEFtb3VudH0sMClgKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNCeSAoZHgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKHRoaXMuc2Nyb2xsQW1vdW50ICsgZHgpO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc1NuYXAgKCkge1xuXHRsZXQgaSA9IE1hdGgucm91bmQodGhpcy5zY3JvbGxBbW91bnQgLyB0aGlzLnRvdGFsQ2hyV2lkdGgpXG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbyhpKnRoaXMudG90YWxDaHJXaWR0aCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzVXAgKCkge1xuICAgICAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzQnkoLXRoaXMudG90YWxDaHJXaWR0aCk7XG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzRG93biAoKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNCeSh0aGlzLnRvdGFsQ2hyV2lkdGgpO1xuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpO1xuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkcmF3VGl0bGUgKCkge1xuXHRsZXQgcmVmZyA9IHRoaXMuYXBwLnJHZW5vbWUubGFiZWw7XG5cdGxldCBibG9ja2cgPSB0aGlzLmN1cnJCbG9ja3MgPyBcblx0ICAgIHRoaXMuY3VyckJsb2Nrcy5jb21wICE9PSB0aGlzLmFwcC5yR2Vub21lID9cblx0ICAgICAgICB0aGlzLmN1cnJCbG9ja3MuY29tcC5sYWJlbFxuXHRcdDpcblx0XHRudWxsXG5cdCAgICA6XG5cdCAgICBudWxsO1xuXHRsZXQgbHN0ID0gdGhpcy5hcHAuY3Vyckxpc3QgPyB0aGlzLmFwcC5jdXJyTGlzdC5uYW1lIDogbnVsbDtcblxuXHR0aGlzLnJvb3Quc2VsZWN0KFwibGFiZWwgc3Bhbi50aXRsZVwiKS50ZXh0KHJlZmcpO1xuXG5cdGxldCBsaW5lcyA9IFtdO1xuXHRibG9ja2cgJiYgbGluZXMucHVzaChgQmxvY2tzIHZzLiAke2Jsb2NrZ31gKTtcblx0bHN0ICYmIGxpbmVzLnB1c2goYEZlYXR1cmVzIGZyb20gbGlzdCBcIiR7bHN0fVwiYCk7XG5cdGxldCBzdWJ0ID0gbGluZXMuam9pbihcIiA6OiBcIik7XG5cdHRoaXMucm9vdC5zZWxlY3QoXCJsYWJlbCBzcGFuLnN1YnRpdGxlXCIpLnRleHQoKHN1YnQgPyBcIjo6IFwiIDogXCJcIikgKyBzdWJ0KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEcmF3cyB0aGUgb3V0bGluZXMgb2Ygc3ludGVueSBibG9ja3Mgb2YgdGhlIHJlZiBnZW5vbWUgdnMuXG4gICAgLy8gdGhlIGdpdmVuIGdlbm9tZS5cbiAgICAvLyBQYXNzaW5nIG51bGwgZXJhc2VzIGFsbCBzeW50ZW55IGJsb2Nrcy5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgIGRhdGEgPT0geyByZWY6R2Vub21lLCBjb21wOkdlbm9tZSwgYmxvY2tzOiBsaXN0IG9mIHN5bnRlbnkgYmxvY2tzIH1cbiAgICAvLyAgICBFYWNoIHNibG9jayA9PT0geyBibG9ja0lkOmludCwgb3JpOisvLSwgZnJvbUNociwgZnJvbVN0YXJ0LCBmcm9tRW5kLCB0b0NociwgdG9TdGFydCwgdG9FbmQgfVxuICAgIGRyYXdCbG9ja3MgKGRhdGEpIHtcblx0Ly9cbiAgICAgICAgbGV0IHNiZ3JwcyA9IHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbChcIi5jaHJvbW9zb21lXCIpLnNlbGVjdCgnW25hbWU9XCJzeW5CbG9ja3NcIl0nKTtcblx0aWYgKCFkYXRhIHx8ICFkYXRhLmJsb2NrcyB8fCBkYXRhLmJsb2Nrcy5sZW5ndGggPT09IDApIHtcblx0ICAgIHRoaXMuY3VyckJsb2NrcyA9IG51bGw7XG5cdCAgICBzYmdycHMuaHRtbCgnJyk7XG5cdCAgICB0aGlzLmRyYXdUaXRsZSgpO1xuXHQgICAgcmV0dXJuO1xuXHR9XG5cdHRoaXMuY3VyckJsb2NrcyA9IGRhdGE7XG5cdC8vIHJlb3JnYW5pemUgZGF0YSB0byByZWZsZWN0IFNWRyBzdHJ1Y3R1cmUgd2Ugd2FudCwgaWUsIGdyb3VwZWQgYnkgY2hyb21vc29tZVxuICAgICAgICBsZXQgZHggPSBkYXRhLmJsb2Nrcy5yZWR1Y2UoKGEsc2IpID0+IHtcblx0XHRpZiAoIWFbc2IuZnJvbUNocl0pIGFbc2IuZnJvbUNocl0gPSBbXTtcblx0XHRhW3NiLmZyb21DaHJdLnB1c2goc2IpO1xuXHRcdHJldHVybiBhO1xuXHQgICAgfSwge30pO1xuXHRzYmdycHMuZWFjaChmdW5jdGlvbihjKXtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5kYXR1bSh7Y2hyOiBjLm5hbWUsIGJsb2NrczogZHhbYy5uYW1lXSB8fCBbXSB9KTtcblx0fSk7XG5cblx0bGV0IGJ3aWR0aCA9IDEwO1xuICAgICAgICBsZXQgc2Jsb2NrcyA9IHNiZ3Jwcy5zZWxlY3RBbGwoJ3JlY3Quc2Jsb2NrJykuZGF0YShiPT5iLmJsb2Nrcyk7XG4gICAgICAgIGxldCBuZXdicyA9IHNibG9ja3MuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsJ3NibG9jaycpO1xuXHRzYmxvY2tzXG5cdCAgICAuYXR0cihcInhcIiwgLWJ3aWR0aC8yIClcblx0ICAgIC5hdHRyKFwieVwiLCBiID0+IHRoaXMuZ2V0WShiLmZyb21TdGFydCkpXG5cdCAgICAuYXR0cihcIndpZHRoXCIsIGJ3aWR0aClcblx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGIgPT4gTWF0aC5tYXgoMCx0aGlzLmdldFkoYi5mcm9tRW5kIC0gYi5mcm9tU3RhcnQgKyAxKSkpXG5cdCAgICAuY2xhc3NlZChcImludmVyc2lvblwiLCBiID0+IGIub3JpID09PSBcIi1cIilcblx0ICAgIC5jbGFzc2VkKFwidHJhbnNsb2NhdGlvblwiLCBiID0+IGIuZnJvbUNociAhPT0gYi50b0Nocilcblx0ICAgIDtcblxuICAgICAgICBzYmxvY2tzLmV4aXQoKS5yZW1vdmUoKTtcblxuXHR0aGlzLmRyYXdUaXRsZSgpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRyYXdUaWNrcyAoaWRzKSB7XG5cdHRoaXMuY3VyclRpY2tzID0gaWRzIHx8IFtdO1xuXHR0aGlzLmFwcC5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlc0J5SWQodGhpcy5hcHAuckdlbm9tZSwgdGhpcy5jdXJyVGlja3MpXG5cdCAgICAudGhlbiggZmVhdHMgPT4geyB0aGlzLl9kcmF3VGlja3MoZmVhdHMpOyB9KTtcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgX2RyYXdUaWNrcyAoZmVhdHVyZXMpIHtcblx0bGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTsgLy8gcmVmIGdlbm9tZVxuXHQvLyBmZWF0dXJlIHRpY2sgbWFya3Ncblx0aWYgKCFmZWF0dXJlcyB8fCBmZWF0dXJlcy5sZW5ndGggPT09IDApIHtcblx0ICAgIHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdEFsbCgnW25hbWU9XCJ0aWNrc1wiXScpLnNlbGVjdEFsbChcIi5mZWF0dXJlXCIpLnJlbW92ZSgpO1xuXHQgICAgcmV0dXJuO1xuXHR9XG5cblx0Ly9cblx0bGV0IHRHcnBzID0gdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKFwiLmNocm9tb3NvbWVcIikuc2VsZWN0KCdbbmFtZT1cInRpY2tzXCJdJyk7XG5cblx0Ly8gZ3JvdXAgZmVhdHVyZXMgYnkgY2hyb21vc29tZVxuICAgICAgICBsZXQgZml4ID0gZmVhdHVyZXMucmVkdWNlKChhLGYpID0+IHsgXG5cdCAgICBpZiAoISBhW2YuY2hyXSkgYVtmLmNocl0gPSBbXTtcblx0ICAgIGFbZi5jaHJdLnB1c2goZik7XG5cdCAgICByZXR1cm4gYTtcblx0fSwge30pXG5cdHRHcnBzLmVhY2goZnVuY3Rpb24oYykge1xuXHQgICAgZDMuc2VsZWN0KHRoaXMpLmRhdHVtKCB7IGNocjogYywgZmVhdHVyZXM6IGZpeFtjLm5hbWVdICB8fCBbXX0gKTtcblx0fSk7XG5cblx0Ly8gdGhlIHRpY2sgZWxlbWVudHNcbiAgICAgICAgbGV0IGZlYXRzID0gdEdycHMuc2VsZWN0QWxsKFwiLmZlYXR1cmVcIilcblx0ICAgIC5kYXRhKGQgPT4gZC5mZWF0dXJlcywgZCA9PiBkLklEKTtcblx0Ly9cblx0bGV0IHhBZGogPSBmID0+IChmLnN0cmFuZCA9PT0gXCIrXCIgPyB0aGlzLnRpY2tMZW5ndGggOiAtdGhpcy50aWNrTGVuZ3RoKTtcblx0Ly9cblx0bGV0IHNoYXBlID0gXCJjaXJjbGVcIjsgIC8vIFwiY2lyY2xlXCIgb3IgXCJsaW5lXCJcblx0Ly9cblx0bGV0IG5ld2ZzID0gZmVhdHMuZW50ZXIoKVxuXHQgICAgLmFwcGVuZChzaGFwZSlcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcImZlYXR1cmVcIilcblx0ICAgIC5vbignY2xpY2snLCAoZikgPT4ge1xuXHRcdGxldCBpID0gZi5jYW5vbmljYWx8fGYuSUQ7XG5cdCAgICAgICAgdGhpcy5hcHAuc2V0Q29udGV4dCh7bGFuZG1hcms6aSwgaGlnaGxpZ2h0OltpXX0pO1xuXHQgICAgfSkgO1xuXHRuZXdmcy5hcHBlbmQoXCJ0aXRsZVwiKVxuXHRcdC50ZXh0KGY9PmYuc3ltYm9sIHx8IGYuaWQpO1xuXHRpZiAoc2hhcGUgPT09IFwibGluZVwiKSB7XG5cdCAgICBmZWF0cy5hdHRyKFwieDFcIiwgZiA9PiB4QWRqKGYpICsgNSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ5MVwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0ICAgIGZlYXRzLmF0dHIoXCJ4MlwiLCBmID0+IHhBZGooZikgKyB0aGlzLnRpY2tMZW5ndGggKyA1KVxuXHQgICAgZmVhdHMuYXR0cihcInkyXCIsIGYgPT4gcmcueXNjYWxlKGYuc3RhcnQpKVxuXHR9XG5cdGVsc2Uge1xuXHQgICAgZmVhdHMuYXR0cihcImN4XCIsIGYgPT4geEFkaihmKSlcblx0ICAgIGZlYXRzLmF0dHIoXCJjeVwiLCBmID0+IHJnLnlzY2FsZShmLnN0YXJ0KSlcblx0ICAgIGZlYXRzLmF0dHIoXCJyXCIsICB0aGlzLnRpY2tMZW5ndGggLyAyKTtcblx0fVxuXHQvL1xuXHRmZWF0cy5leGl0KCkucmVtb3ZlKClcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBHZW5vbWVWaWV3XG5cbmV4cG9ydCB7IEdlbm9tZVZpZXcgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0dlbm9tZVZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcblxuY2xhc3MgRmVhdHVyZURldGFpbHMgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMuaW5pdERvbSAoKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbml0RG9tICgpIHtcblx0Ly9cblx0dGhpcy5yb290LnNlbGVjdCAoXCIuYnV0dG9uLmNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5leHRyYVwiLCAoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIHVwZGF0ZShmKSB7XG5cdC8vIGlmIGNhbGxlZCB3aXRoIG5vIGFyZ3MsIHVwZGF0ZSB1c2luZyB0aGUgcHJldmlvdXMgZmVhdHVyZVxuXHRmID0gZiB8fCB0aGlzLmxhc3RGZWF0dXJlO1xuXHRpZiAoIWYpIHtcblx0ICAgLy8gRklYTUU6IG1ham9yIHJlYWNob3ZlciBpbiB0aGlzIHNlY3Rpb25cblx0ICAgLy9cblx0ICAgLy8gZmFsbGJhY2suIHRha2UgdGhlIGZpcnN0IGhpZ2hsaWdodGVkLlxuXHQgICBsZXQgciA9IHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwicmVjdC5mZWF0dXJlLmhpZ2hsaWdodFwiKVswXVswXTtcblx0ICAgLy8gZmFsbGJhY2suIHRha2UgdGhlIGZpcnN0IGZlYXR1cmVcblx0ICAgaWYgKCFyKSByID0gdGhpcy5hcHAuem9vbVZpZXcuc3ZnTWFpbi5zZWxlY3QoXCJyZWN0LmZlYXR1cmVcIilbMF1bMF07XG5cdCAgIGlmIChyKSBmID0gci5fX2RhdGFfXztcblx0fVxuXHQvLyByZW1lbWJlclxuICAgICAgICBpZiAoIWYpIHRocm93IFwiQ2Fubm90IHVwZGF0ZSBmZWF0dXJlIGRldGFpbHMuIE5vIGZlYXR1cmUuXCI7XG5cdHRoaXMubGFzdEZlYXR1cmUgPSBmO1xuXG5cdC8vIGxpc3Qgb2YgZmVhdHVyZXMgdG8gc2hvdyBpbiBkZXRhaWxzIGFyZWEuXG5cdC8vIHRoZSBnaXZlbiBmZWF0dXJlIGFuZCBhbGwgZXF1aXZhbGVudHMgaW4gb3RoZXIgZ2Vub21lcy5cblx0bGV0IGZsaXN0ID0gW2ZdO1xuXHRpZiAoZi5jYW5vbmljYWwpIHtcblx0ICAgIC8vIEZJWE1FOiByZWFjaG92ZXJcblx0ICAgIGZsaXN0ID0gdGhpcy5hcHAuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkKGYuY2Fub25pY2FsKTtcblx0fVxuXHQvLyBHb3QgdGhlIGxpc3QuIE5vdyBvcmRlciBpdCB0aGUgc2FtZSBhcyB0aGUgZGlzcGxheWVkIGdlbm9tZXNcblx0Ly8gYnVpbGQgaW5kZXggb2YgZ2Vub21lIG5hbWUgLT4gZmVhdHVyZSBpbiBmbGlzdFxuXHRsZXQgaXggPSBmbGlzdC5yZWR1Y2UoKGFjYyxmKSA9PiB7IGFjY1tmLmdlbm9tZS5uYW1lXSA9IGY7IHJldHVybiBhY2M7IH0sIHt9KVxuXHRsZXQgZ2Vub21lT3JkZXIgPSAoW3RoaXMuYXBwLnJHZW5vbWVdLmNvbmNhdCh0aGlzLmFwcC5jR2Vub21lcykpO1xuXHRmbGlzdCA9IGdlbm9tZU9yZGVyLm1hcChnID0+IGl4W2cubmFtZV0gfHwgbnVsbCk7XG5cdC8vXG5cdGxldCBjb2xIZWFkZXJzID0gW1xuXHQgICAgLy8gY29sdW1ucyBoZWFkZXJzIGFuZCB0aGVpciAlIHdpZHRoc1xuXHQgICAgW1wiQ2Fub25pY2FsIGlkXCIgICAgICwxMF0sXG5cdCAgICBbXCJDYW5vbmljYWwgc3ltYm9sXCIgLDEwXSxcblx0ICAgIFtcIkdlbm9tZVwiICAgICAsOV0sXG5cdCAgICBbXCJJRFwiICAgICAsMTddLFxuXHQgICAgW1wiVHlwZVwiICAgICAgICwxMC41XSxcblx0ICAgIFtcIkJpb1R5cGVcIiAgICAsMTguNV0sXG5cdCAgICBbXCJDb29yZGluYXRlc1wiLDE4XSxcblx0ICAgIFtcIkxlbmd0aFwiICAgICAsN11cblx0XTtcblx0Ly8gSW4gdGhlIGNsb3NlZCBzdGF0ZSwgb25seSBzaG93IHRoZSBoZWFkZXIgYW5kIHRoZSByb3cgZm9yIHRoZSBwYXNzZWQgZmVhdHVyZVxuXHRpZiAodGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgZmxpc3QgPSBmbGlzdC5maWx0ZXIoIChmZiwgaSkgPT4gZmYgPT09IGYgKTtcblx0Ly8gRHJhdyB0aGUgdGFibGVcblx0bGV0IHQgPSB0aGlzLnJvb3Quc2VsZWN0KCd0YWJsZScpO1xuXHRsZXQgcm93cyA9IHQuc2VsZWN0QWxsKCd0cicpLmRhdGEoIFtjb2xIZWFkZXJzXS5jb25jYXQoZmxpc3QpICk7XG5cdHJvd3MuZW50ZXIoKS5hcHBlbmQoJ3RyJylcblx0ICAub24oXCJtb3VzZWVudGVyXCIsIChmLGkpID0+IGkgIT09IDAgJiYgdGhpcy5hcHAuem9vbVZpZXcuaGlnaGxpZ2h0KGYsIHRydWUpKVxuXHQgIC5vbihcIm1vdXNlbGVhdmVcIiwgKGYsaSkgPT4gaSAhPT0gMCAmJiB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoKSk7XG5cdCAgICAgIFxuXHRyb3dzLmV4aXQoKS5yZW1vdmUoKTtcblx0cm93cy5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIChmZiwgaSkgPT4gKGkgIT09IDAgJiYgZmYgPT09IGYpKTtcblx0Ly9cblx0Ly8gR2l2ZW4gYSBmZWF0dXJlLCByZXR1cm5zIGEgbGlzdCBvZiBzdHJpbmdzIGZvciBwb3B1bGF0aW5nIGEgdGFibGUgcm93LlxuXHQvLyBJZiBpPT09MCwgdGhlbiBmIGlzIG5vdCBhIGZlYXR1cmUsIGJ1dCBhIGxpc3QgY29sdW1ucyBuYW1lcyt3aWR0aHMuXG5cdC8vIFxuXHRsZXQgY2VsbERhdGEgPSBmdW5jdGlvbiAoZiwgaSkge1xuXHQgICAgaWYgKGkgPT09IDApIHtcblx0XHRyZXR1cm4gZjtcblx0ICAgIH1cblx0ICAgIGxldCBjZWxsRGF0YSA9IFsgXCIuXCIsIFwiLlwiLCBnZW5vbWVPcmRlcltpLTFdLmxhYmVsLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiwgXCIuXCIgXTtcblx0ICAgIC8vIGYgaXMgbnVsbCBpZiBpdCBkb2Vzbid0IGV4aXN0IGZvciBnZW5vbWUgaSBcblx0ICAgIGlmIChmKSB7XG5cdFx0bGV0IGxpbmsgPSBcIlwiO1xuXHRcdGxldCBjYW5vbmljYWwgPSBmLmNhbm9uaWNhbCB8fCBcIlwiO1xuXHRcdGlmIChjYW5vbmljYWwpIHtcblx0XHQgICAgbGV0IHVybCA9IGBodHRwOi8vd3d3LmluZm9ybWF0aWNzLmpheC5vcmcvYWNjZXNzaW9uLyR7Y2Fub25pY2FsfWA7XG5cdFx0ICAgIGxpbmsgPSBgPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7dXJsfVwiPiR7Y2Fub25pY2FsfTwvYT5gO1xuXHRcdH1cblx0XHRjZWxsRGF0YSA9IFtcblx0XHQgICAgbGluayB8fCBjYW5vbmljYWwsXG5cdFx0ICAgIGYuc3ltYm9sLFxuXHRcdCAgICBmLmdlbm9tZS5sYWJlbCxcblx0XHQgICAgZi5JRCxcblx0XHQgICAgZi50eXBlLFxuXHRcdCAgICBmLmJpb3R5cGUsXG5cdFx0ICAgIGAke2YuY2hyfToke2Yuc3RhcnR9Li4ke2YuZW5kfSAoJHtmLnN0cmFuZH0pYCxcblx0XHQgICAgYCR7Zi5lbmQgLSBmLnN0YXJ0ICsgMX0gYnBgXG5cdFx0XTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBjZWxsRGF0YTtcblx0fTtcblx0bGV0IGNlbGxzID0gcm93cy5zZWxlY3RBbGwoXCJ0ZFwiKVxuXHQgICAgLmRhdGEoKGYsaSkgPT4gY2VsbERhdGEoZixpKSk7XG5cdGNlbGxzLmVudGVyKCkuYXBwZW5kKFwidGRcIik7XG5cdGNlbGxzLmV4aXQoKS5yZW1vdmUoKTtcblx0Y2VsbHMuaHRtbCgoZCxpLGopID0+IHtcblx0ICAgIHJldHVybiBqID09PSAwID8gZFswXSA6IGRcblx0fSlcblx0LnN0eWxlKFwid2lkdGhcIiwgKGQsaSxqKSA9PiBqID09PSAwID8gYCR7ZFsxXX0lYCA6IG51bGwpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgRmVhdHVyZURldGFpbHMgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZlYXR1cmVEZXRhaWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IFNWR1ZpZXcgfSBmcm9tICcuL1NWR1ZpZXcnO1xuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gJy4vRmVhdHVyZSc7XG5pbXBvcnQgeyBwcmV0dHlQcmludEJhc2VzLCBjbGlwLCBwYXJzZUNvb3JkcywgZm9ybWF0Q29vcmRzLCBjb29yZHNBZnRlclRyYW5zZm9ybSwgcmVtb3ZlRHVwcyB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIFpvb21WaWV3IGV4dGVuZHMgU1ZHVmlldyB7XG4gICAgLy9cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQsIGluaXRpYWxDb29yZHMsIGluaXRpYWxIaSkge1xuICAgICAgc3VwZXIoYXBwLCBlbHQsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgLy9cbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIC8vXG4gICAgICB0aGlzLmRyYXdDb3VudCA9IDA7XG4gICAgICB0aGlzLmNmZyA9IGNvbmZpZy5ab29tVmlldztcbiAgICAgIHRoaXMuZG1vZGUgPSAnY29tcGFyaXNvbic7Ly8gZHJhd2luZyBtb2RlLiAnY29tcGFyaXNvbicgb3IgJ3JlZmVyZW5jZSdcbiAgICAgIC8vIEEgZmVhdHVyZSBtYXkgYmUgcmVuZGVyZWQgaW4gb25lIG9mIHR3byB3YXlzOiBhcyBhIHNpbXBsZSByZWN0LCBvciBhcyBhIGdyb3VwIGNvbnRhaW5pbmcgdGhlIFxuICAgICAgLy8gcmVjdCBhbmQgb3RoZXIgc3R1ZmYgbGlrZSB0ZXh0LCBhbiBheGlzIGxpbmUsIGV0Yy5cbiAgICAgIHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzID0gZmFsc2U7IC8vIGlmIHRydWUsIHNob3cgZXhvbiBzdHJ1Y3R1cmVcbiAgICAgIHRoaXMuY2xlYXJBbGwgPSBmYWxzZTsgLy8gaWYgdHJ1ZSwgcmVtb3ZlL3JlcmVuZGVyIGFsbCBleGlzdGluZyBmZWF0dXJlcyBvbiBuZXh0IGRyYXdcblxuICAgICAgLy9cbiAgICAgIC8vIElEcyBvZiBGZWF0dXJlcyB3ZSdyZSBoaWdobGlnaHRpbmcuIE1heSBiZSBmZWF0dXJlJ3MgSUQgIG9yIGNhbm9uaWNhbCBJRHIuL1xuICAgICAgLy8gaGlGZWF0cyBpcyBhbiBvYmogd2hvc2Uga2V5cyBhcmUgdGhlIElEc1xuICAgICAgdGhpcy5oaUZlYXRzID0gKGluaXRpYWxIaSB8fCBbXSkucmVkdWNlKCAoYSx2KSA9PiB7IGFbdl09djsgcmV0dXJuIGE7IH0sIHt9ICk7XG4gICAgICB0aGlzLmRyYWdnaW5nID0gbnVsbDtcbiAgICAgIHRoaXMuZHJhZ2dlciA9IHRoaXMuZ2V0RHJhZ2dlcigpO1xuICAgICAgLy9cblx0Ly8gQ29uZmlnIGZvciBtZW51IHVuZGVyIG1lbnUgYnV0dG9uXG5cdHRoaXMuY3h0TWVudUNmZyA9IFt7XG5cdCAgICBuYW1lOiAnbGlua1RvU25wcycsXG5cdCAgICBsYWJlbDogJ01HSSBTTlBzJywgXG5cdCAgICBpY29uOiAnb3Blbl9pbl9uZXcnLFxuXHQgICAgdG9vbHRpcDogJ1ZpZXcgU05QcyBhdCBNR0kgZm9yIHRoZSBjdXJyZW50IHN0cmFpbnMgaW4gdGhlIGN1cnJlbnQgcmVnaW9uLiAoU29tZSBzdHJhaW5zIG5vdCBhdmFpbGFibGUuKScsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naVNucFJlcG9ydCgpXG5cdH0se1xuXHQgICAgbmFtZTogJ2xpbmtUb1F0bCcsXG5cdCAgICBsYWJlbDogJ01HSSBRVExzJywgXG5cdCAgICBpY29uOiAgJ29wZW5faW5fbmV3Jyxcblx0ICAgIHRvb2x0aXA6ICdWaWV3IFFUTCBhdCBNR0kgdGhhdCBvdmVybGFwIHRoZSBjdXJyZW50IHJlZ2lvbi4nLFxuXHQgICAgaGFuZGxlcjogKCk9PiB0aGlzLmFwcC5saW5rVG9NZ2lRVExzKClcblx0fSx7XG5cdCAgICBuYW1lOiAnbGlua1RvSmJyb3dzZScsXG5cdCAgICBsYWJlbDogJ01HSSBKQnJvd3NlJywgXG5cdCAgICBpY29uOiAnb3Blbl9pbl9uZXcnLFxuXHQgICAgdG9vbHRpcDogJ09wZW4gTUdJIEpCcm93c2UgKEM1N0JMLzZKIEdSQ20zOCkgd2l0aCB0aGUgY3VycmVudCBjb29yZGluYXRlIHJhbmdlLicsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naUpCcm93c2UoKVxuXHR9LHtcblx0ICAgIG5hbWU6ICdjbGVhckNhY2hlJyxcblx0ICAgIGxhYmVsOiAnQ2xlYXIgY2FjaGUnLCBcblx0ICAgIGljb246ICdkZWxldGVfc3dlZXAnLFxuXHQgICAgdG9vbHRpcDogJ0RlbGV0ZSBjYWNoZWQgZmVhdHVyZXMuIERhdGEgd2lsbCBiZSByZWxvYWRlZCBmcm9tIHRoZSBzZXJ2ZXIgb24gbmV4dCB1c2UuJyxcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAuY2xlYXJDYWNoZWREYXRhKHRydWUpXG5cdH1dO1xuXG5cdC8vIGNvbmZpZyBmb3IgYSBmZWF0dXJlJ3MgY29udGV4dCBtZW51XG5cdHRoaXMuZmN4dE1lbnVDZmcgPSBbe1xuXHQgICAgbmFtZTogJ21lbnVUaXRsZScsXG5cdCAgICBsYWJlbDogKGQpID0+IGAke2Quc3ltYm9sIHx8IGQuSUR9YCwgXG5cdCAgICBjbHM6ICdtZW51VGl0bGUnXG5cdH0se1xuXHQgICAgbmFtZTogJ2xpbmVVcE9uRmVhdHVyZScsXG5cdCAgICBsYWJlbDogJ0FsaWduIG9uIHRoaXMgZmVhdHVyZS4nLFxuXHQgICAgaWNvbjogJ2Zvcm1hdF9hbGlnbl9jZW50ZXInLFxuXHQgICAgdG9vbHRpcDogJ0FsaWducyB0aGUgZGlzcGxheWVkIGdlbm9tZXMgYXJvdW5kIHRoaXMgZmVhdHVyZS4nLFxuXHQgICAgaGFuZGxlcjogKGYpID0+IHtcblx0XHRsZXQgaWRzID0gKG5ldyBTZXQoT2JqZWN0LmtleXModGhpcy5oaUZlYXRzKSkpLmFkZChmLmlkKTtcblx0ICAgICAgICB0aGlzLmFwcC5zZXRDb250ZXh0KHtsYW5kbWFyazpmLmlkLCBkZWx0YTowLCBoaWdobGlnaHQ6QXJyYXkuZnJvbShpZHMpfSlcblx0ICAgIH1cblx0fSx7XG5cdCAgICBuYW1lOiAndG9NR0knLFxuXHQgICAgbGFiZWw6ICdGZWF0dXJlQE1HSScsIFxuXHQgICAgaWNvbjogJ29wZW5faW5fbmV3Jyxcblx0ICAgIHRvb2x0aXA6ICdTZWUgZGV0YWlscyBmb3IgdGhpcyBmZWF0dXJlIGF0IE1HSS4nLFxuXHQgICAgaGFuZGxlcjogKGYpID0+IHsgd2luZG93Lm9wZW4oYGh0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9hY2Nlc3Npb24vJHtmLmlkfWAsICdfYmxhbmsnKSB9XG5cdH0se1xuXHQgICAgbmFtZTogJ3RvTW91c2VNaW5lJyxcblx0ICAgIGxhYmVsOiAnRmVhdHVyZUBNb3VzZU1pbmUnLCBcblx0ICAgIGljb246ICdvcGVuX2luX25ldycsXG5cdCAgICB0b29sdGlwOiAnU2VlIGRldGFpbHMgZm9yIHRoaXMgZmVhdHVyZSBhdCBNb3VzZU1pbmUuJyxcblx0ICAgIGhhbmRsZXI6IChmKSA9PiB0aGlzLmFwcC5saW5rVG9SZXBvcnRQYWdlKGYpXG5cdH0se1xuXHQgICAgbmFtZTogJ2dlbm9taWNTZXFEb3dubG9hZCcsXG5cdCAgICBsYWJlbDogJ0dlbm9taWMgc2VxdWVuY2VzJywgXG5cdCAgICBpY29uOiAnY2xvdWRfZG93bmxvYWQnLFxuXHQgICAgdG9vbHRpcDogJ0Rvd25sb2FkIGdlbm9taWMgc2VxdWVuY2VzIGZvciB0aGlzIGZlYXR1cmUgZnJvbSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMuJyxcblx0ICAgIGhhbmRsZXI6IChmKSA9PiB7IFxuXHRcdHRoaXMuYXBwLmRvd25sb2FkRmFzdGEoZiwgJ2dlbm9taWMnLCB0aGlzLmFwcC52R2Vub21lcy5tYXAodmc9PnZnLmxhYmVsKSk7XG5cdCAgICB9XG5cdH0se1xuXHQgICAgbmFtZTogJ3R4cFNlcURvd25sb2FkJyxcblx0ICAgIGxhYmVsOiAnVHJhbnNjcmlwdCBzZXF1ZW5jZXMnLCBcblx0ICAgIGljb246ICdjbG91ZF9kb3dubG9hZCcsXG5cdCAgICB0b29sdGlwOiAnRG93bmxvYWQgdHJhbnNjcmlwdCBzZXF1ZW5jZXMgb2YgdGhpcyBmZWF0dXJlIGZyb20gY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzLicsXG5cdCAgICBoYW5kbGVyOiAoZikgPT4geyBcblx0XHR0aGlzLmFwcC5kb3dubG9hZEZhc3RhKGYsICd0cmFuc2NyaXB0JywgdGhpcy5hcHAudkdlbm9tZXMubWFwKHZnPT52Zy5sYWJlbCkpO1xuXHQgICAgfVxuXHR9LHtcblx0ICAgIG5hbWU6ICdjZHNTZXFEb3dubG9hZCcsXG5cdCAgICBsYWJlbDogJ0NEUyBzZXF1ZW5jZXMnLCBcblx0ICAgIGljb246ICdjbG91ZF9kb3dubG9hZCcsXG5cdCAgICB0b29sdGlwOiAnRG93bmxvYWQgY29kaW5nIHNlcXVlbmNlcyBvZiB0aGlzIGZlYXR1cmUgZnJvbSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMuJyxcblx0ICAgIGRpc2FibGVyOiAoZikgPT4gZi5iaW90eXBlLmluZGV4T2YoJ3Byb3RlaW4nKSA9PT0gLTEsIC8vIGRpc2FibGUgaWYgZiBpcyBub3QgcHJvdGVpbiBjb2Rpbmdcblx0ICAgIGhhbmRsZXI6IChmKSA9PiB7IFxuXHRcdHRoaXMuYXBwLmRvd25sb2FkRmFzdGEoZiwgJ2NkcycsIHRoaXMuYXBwLnZHZW5vbWVzLm1hcCh2Zz0+dmcubGFiZWwpKTtcblx0ICAgIH1cblx0fSx7XG5cdCAgICBuYW1lOiAnZXhvblNlcURvd25sb2FkJyxcblx0ICAgIGxhYmVsOiAnRXhvbiBzZXF1ZW5jZXMnLCBcblx0ICAgIGljb246ICdjbG91ZF9kb3dubG9hZCcsXG5cdCAgICB0b29sdGlwOiAnRG93bmxvYWQgZXhvbiBzZXF1ZW5jZXMgb2YgdGhpcyBmZWF0dXJlIGZyb20gY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzLicsXG5cdCAgICBkaXNhYmxlcjogKGYpID0+IGYudHlwZS5pbmRleE9mKCdnZW5lJykgPT09IC0xLFxuXHQgICAgaGFuZGxlcjogKGYpID0+IHsgXG5cdFx0dGhpcy5hcHAuZG93bmxvYWRGYXN0YShmLCAnZXhvbicsIHRoaXMuYXBwLnZHZW5vbWVzLm1hcCh2Zz0+dmcubGFiZWwpKTtcblx0ICAgIH1cblx0fV07XG4gICAgICAvL1xuICAgICAgdGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIC8vXG4gICAgaW5pdERvbSAoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblx0bGV0IHIgPSB0aGlzLnJvb3Q7XG5cdGxldCBhID0gdGhpcy5hcHA7XG4gICAgICAgIC8vXG4gICAgICAgIHRoaXMuZmlkdWNpYWxzID0gdGhpcy5zdmcuaW5zZXJ0KCdnJywnOmZpcnN0LWNoaWxkJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCdmaWR1Y2lhbHMnKTtcbiAgICAgICAgdGhpcy5zdHJpcHNHcnAgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCdzdHJpcHMnKTtcbiAgICAgICAgdGhpcy5heGlzID0gdGhpcy5zdmdNYWluLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywnYXhpcycpO1xuICAgICAgICB0aGlzLmZsb2F0aW5nVGV4dCA9IHRoaXMuc3ZnTWFpbi5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgIC5hdHRyKCdjbGFzcycsJ2Zsb2F0aW5nVGV4dCcpO1xuICAgICAgICB0aGlzLmN4dE1lbnUgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImN4dE1lbnVcIl0nKTtcbiAgICAgICAgLy9cblx0Ly9cblx0ci5zZWxlY3QoJy5idXR0b24uY2xvc2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHRoaXMudXBkYXRlKCkpO1xuXG5cdC8vIHpvb20gY29udHJvbHNcblx0ci5zZWxlY3QoJyN6b29tT3V0Jykub24oJ2NsaWNrJyxcblx0ICAgICgpID0+IHsgYS56b29tKGEuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdCgnI3pvb21JbicpIC5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnpvb20oMS9hLmRlZmF1bHRab29tKSB9KTtcblx0ci5zZWxlY3QoJyN6b29tT3V0TW9yZScpLm9uKCdjbGljaycsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgyKmEuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdCgnI3pvb21Jbk1vcmUnKSAub24oJ2NsaWNrJyxcblx0ICAgICgpID0+IHsgYS56b29tKDEvKDIqYS5kZWZhdWx0Wm9vbSkpIH0pO1xuXG5cdC8vIHBhbiBjb250cm9sc1xuXHRyLnNlbGVjdCgnI3BhbkxlZnQnKSAub24oJ2NsaWNrJyxcblx0ICAgICgpID0+IHsgYS5wYW4oLWEuZGVmYXVsdFBhbikgfSk7XG5cdHIuc2VsZWN0KCcjcGFuUmlnaHQnKS5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnBhbigrYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoJyNwYW5MZWZ0TW9yZScpIC5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnBhbigtNSphLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdCgnI3BhblJpZ2h0TW9yZScpLm9uKCdjbGljaycsXG5cdCAgICAoKSA9PiB7IGEucGFuKCs1KmEuZGVmYXVsdFBhbikgfSk7XG5cblx0Ly9cblx0dGhpcy5yb290XG5cdCAgLm9uKCdjbGljaycsICgpID0+IHtcblx0ICAgICAgLy8gY2xpY2sgb24gYmFja2dyb3VuZCA9PiBoaWRlIGNvbnRleHQgbWVudVxuXHQgICAgICBsZXQgdGd0ID0gZDMuZXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAodGd0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2knICYmIHRndC5pbm5lckhUTUwgPT09ICdtZW51Jylcblx0XHQgIC8vIGV4Y2VwdGlvbjogdGhlIGNvbnRleHQgbWVudSBidXR0b24gaXRzZWxmXG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgIGVsc2Vcblx0XHQgIHRoaXMuaGlkZUNvbnRleHRNZW51KClcblx0ICB9KTtcblxuXHQvLyBGZWF0dXJlIG1vdXNlIGV2ZW50IGhhbmRsZXJzLlxuXHQvL1xuXHRsZXQgZkNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChmLCBldnQsIHByZXNlcnZlKSB7XG5cdCAgICBsZXQgaWQgPSBmLmlkO1xuXHQgICAgaWYgKGV2dC5jdHJsS2V5KSB7XG5cdCAgICAgICAgbGV0IGN4ID0gZDMuZXZlbnQuY2xpZW50WDtcblx0ICAgICAgICBsZXQgY3kgPSBkMy5ldmVudC5jbGllbnRZO1xuXHQgICAgICAgIGxldCBiYiA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiem9vbWNvbnRyb2xzXCJdID4gLm1lbnUgPiAuYnV0dG9uJykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHR0aGlzLnNob3dDb250ZXh0TWVudSh0aGlzLmZjeHRNZW51Q2ZnLCBmLCBjeC1iYi54LCBjeS1iYi55KTtcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYgKGV2dC5zaGlmdEtleSkge1xuXHRcdGlmICh0aGlzLmhpRmVhdHNbaWRdKVxuXHRcdCAgICBkZWxldGUgdGhpcy5oaUZlYXRzW2lkXVxuXHRcdGVsc2Vcblx0XHQgICAgdGhpcy5oaUZlYXRzW2lkXSA9IGlkO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0aWYgKCFwcmVzZXJ2ZSkgdGhpcy5oaUZlYXRzID0ge307XG5cdFx0dGhpcy5oaUZlYXRzW2lkXSA9IGlkO1xuXHQgICAgfVxuXHQgICAgLy8gRklYTUU6IHJlYWNob3ZlclxuXHQgICAgdGhpcy5hcHAuZmVhdHVyZURldGFpbHMudXBkYXRlKGYpO1xuXHR9LmJpbmQodGhpcyk7XG5cdC8vXG5cdGxldCBmTW91c2VPdmVySGFuZGxlciA9IGZ1bmN0aW9uKGYpIHtcblx0XHRpZiAoZDMuZXZlbnQuYWx0S2V5KSB7XG5cdFx0ICAgIC8vIElmIHVzZXIgaXMgaG9sZGluZyB0aGUgYWx0IGtleSwgc2VsZWN0IGV2ZXJ5dGhpbmcgdG91Y2hlZC5cblx0XHQgICAgZkNsaWNrSGFuZGxlcihmLCBkMy5ldmVudCwgdHJ1ZSk7XG5cdFx0ICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdFx0ICAgIC8vIERvbid0IHJlZ2lzdGVyIGNvbnRleHQgY2hhbmdlcyB1bnRpbCB1c2VyIGhhcyBwYXVzZWQgZm9yIGF0IGxlYXN0IDFzLlxuXHRcdCAgICBpZiAodGhpcy50aW1lb3V0KSB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cdFx0ICAgIHRoaXMudGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHRoaXMuYXBwLmNvbnRleHRDaGFuZ2VkKCk7IH0uYmluZCh0aGlzKSwgMTAwMCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICB0aGlzLmhpZ2hsaWdodChmKTtcblx0XHQgICAgaWYgKGQzLmV2ZW50LmN0cmxLZXkpXG5cdFx0ICAgICAgICB0aGlzLmFwcC5mZWF0dXJlRGV0YWlscy51cGRhdGUoZik7XG5cdFx0fVxuXHR9LmJpbmQodGhpcyk7XG5cdC8vXG5cdGxldCBmTW91c2VPdXRIYW5kbGVyID0gZnVuY3Rpb24oZikge1xuXHRcdHRoaXMuaGlnaGxpZ2h0KCk7IFxuXHR9LmJpbmQodGhpcyk7XG5cblx0Ly8gXG4gICAgICAgIHRoaXMuc3ZnXG5cdCAgLm9uKCdjbGljaycsICgpID0+IHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QodCk7XG5cdCAgICAgIGlmICh0aGlzLmRlYWxXaXRoVW53YW50ZWRDbGlja0V2ZW50KSB7XG5cdCAgICAgICAgICB0aGlzLmRlYWxXaXRoVW53YW50ZWRDbGlja0V2ZW50ID0gZmFsc2U7XG5cdFx0ICByZXR1cm47XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKHQudGFnTmFtZSA9PSAncmVjdCcgJiYgKHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmZWF0dXJlJykgfHwgdC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnZmVhdHVyZScpKSkge1xuXHRcdCAgLy8gdXNlciBjbGlja2VkIG9uIGEgZmVhdHVyZVxuXHRcdCAgZkNsaWNrSGFuZGxlcih0Ll9fZGF0YV9fLCBkMy5ldmVudCk7XG5cdFx0ICB0aGlzLmhpZ2hsaWdodCgpO1xuXHQgICAgICAgICAgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTtcblx0ICAgICAgfVxuXHQgICAgICBlbHNlIGlmICh0LnRhZ05hbWUgPT0gJ3JlY3QnICYmIHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdleG9uJykpIHtcblx0XHQgIC8vIHVzZXIgY2xpY2tlZCBvbiBhIGZlYXR1cmVcblx0XHQgIGZDbGlja0hhbmRsZXIodC5fX2RhdGFfXy5mZWF0dXJlLCBkMy5ldmVudCk7XG5cdFx0ICB0aGlzLmhpZ2hsaWdodCgpO1xuXHQgICAgICAgICAgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTtcblx0ICAgICAgfVxuXHQgICAgICBlbHNlIGlmICghZDMuZXZlbnQuc2hpZnRLZXkgJiYgXG5cdCAgICAgICAgICAodC50YWdOYW1lID09PSAnc3ZnJyBcblx0XHQgIHx8IHQudGFnTmFtZSA9PSAncmVjdCcgJiYgdC5jbGFzc0xpc3QuY29udGFpbnMoJ2Jsb2NrJylcblx0XHQgIHx8IHQudGFnTmFtZSA9PSAncmVjdCcgJiYgdC5jbGFzc0xpc3QuY29udGFpbnMoJ3VuZGVybGF5Jylcblx0XHQgICkpe1xuXHRcdCAgLy8gdXNlciBjbGlja2VkIG9uIGJhY2tncm91bmRcblx0XHQgIHRoaXMuaGlGZWF0cyA9IHt9O1xuXHRcdCAgdGhpcy5oaWdobGlnaHQoKTtcblx0XHQgIHRoaXMuYXBwLmNvbnRleHRDaGFuZ2VkKCk7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbignY29udGV4dG1lbnUnLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBmID0gZiA/IGYuZmVhdHVyZSB8fCBmIDogZjtcblx0ICAgICAgaWYgKGYgaW5zdGFuY2VvZiBGZWF0dXJlKSB7XG5cdFx0ICBmQ2xpY2tIYW5kbGVyKGYsIGQzLmV2ZW50KTtcblx0ICAgICAgfVxuXHQgICAgICBkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0ICB9KVxuXHQgIC5vbignbW91c2VvdmVyJywgKCkgPT4ge1xuXHQgICAgICBsZXQgdGd0ID0gZDMuc2VsZWN0KGQzLmV2ZW50LnRhcmdldCk7XG5cdCAgICAgIGxldCBmID0gdGd0LmRhdGEoKVswXTtcblx0ICAgICAgZiA9IGYgPyBmLmZlYXR1cmUgfHwgZiA6IGY7XG5cdCAgICAgIGlmIChmIGluc3RhbmNlb2YgRmVhdHVyZSkge1xuXHRcdCAgZk1vdXNlT3ZlckhhbmRsZXIoZik7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBmID0gZiA/IGYuZmVhdHVyZSB8fCBmIDogZjtcblx0ICAgICAgaWYgKGYgaW5zdGFuY2VvZiBGZWF0dXJlKSB7XG5cdFx0ICBmTW91c2VPdXRIYW5kbGVyKGYpO1xuXHQgICAgICB9XG5cdCAgfSlcblx0ICAub24oJ3doZWVsJywgZnVuY3Rpb24oZCkge1xuXHQgICAgbGV0IGUgPSBkMy5ldmVudDtcblx0ICAgIC8vIGxldCB0aGUgYnJvd3NlciBoYW5kbGVyIHZlcnRpY2FsIG1vdGlvblxuXHQgICAgaWYgKE1hdGguYWJzKGUuZGVsdGFYKSA8IE1hdGguYWJzKGUuZGVsdGFZKSlcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAvLyB3ZSBoYW5kbGUgaG9yaXpvbnRhbCBtb3Rpb24uXG5cdCAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgLy8gZmlsdGVyIG91dCB0aW55IG1vdGlvbnNcblx0ICAgIGlmIChNYXRoLmFicyhlLmRlbHRhWCkgPCBzZWxmLmNmZy53aGVlbFRocmVzaG9sZCkgXG5cdCAgICAgICAgcmV0dXJuO1xuXHQgICAgLy8gZ2V0IHRoZSB6b29tIHN0cmlwIHRhcmdldCwgaWYgaXQgZXhpc3RzLCBlbHNlIHRoZSByZWYgem9vbSBzdHJpcC5cblx0ICAgIGxldCB6ID0gZS50YXJnZXQuY2xvc2VzdCgnZy56b29tU3RyaXAnKSB8fCBkMy5zZWxlY3QoJ2cuem9vbVN0cmlwLnJlZmVyZW5jZScpWzBdWzBdO1xuXHQgICAgaWYgKCF6KSByZXR1cm47XG5cblx0ICAgIGxldCBkYiA9IGUuZGVsdGFYIC8gc2VsZi5wcGI7IC8vIGRlbHRhIGluIGJhc2VzIGZvciB0aGlzIGV2ZW50XG5cdCAgICBsZXQgemQgPSB6Ll9fZGF0YV9fO1xuXHQgICAgaWYgKGUuY3RybEtleSkge1xuXHRcdC8vIEN0cmwtd2hlZWwgc2ltcGx5IHNsaWRlcyB0aGUgc3RyaXAgaG9yaXpvbnRhbGx5ICh0ZW1wb3JhcnkpXG5cdFx0Ly8gRm9yIGNvbXBhcmlzb24gZ2Vub21lcywganVzdCB0cmFuc2xhdGUgdGhlIGJsb2NrcyBieSB0aGUgd2hlZWwgYW1vdW50LCBzbyB0aGUgdXNlciBjYW4gXG5cdFx0Ly8gc2VlIGV2ZXJ5dGhpbmcuXG5cdFx0emQuZGVsdGFCICs9IGRiO1xuXHQgICAgICAgIGQzLnNlbGVjdCh6KS5zZWxlY3QoJ2dbbmFtZT1cInNCbG9ja3NcIl0nKS5hdHRyKCd0cmFuc2Zvcm0nLGB0cmFuc2xhdGUoJHstemQuZGVsdGFCICogc2VsZi5wcGJ9LDApc2NhbGUoJHt6ZC54U2NhbGV9LDEpYCk7XG5cdFx0c2VsZi5kcmF3RmlkdWNpYWxzKCk7XG5cdFx0cmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICAvLyBOb3JtYWwgd2hlZWwgZXZlbnQgPSBwYW4gdGhlIHZpZXcuXG5cdCAgICAvL1xuXHQgICAgbGV0IGMgID0gc2VsZi5hcHAuY29vcmRzO1xuXHQgICAgLy8gTGltaXQgZGVsdGEgYnkgY2hyIGVuZHNcblx0ICAgIC8vIERlbHRhIGluIGJhc2VzOlxuXHQgICAgemQuZGVsdGFCID0gY2xpcCh6ZC5kZWx0YUIgKyBkYiwgLWMuc3RhcnQsIGMuY2hyb21vc29tZS5sZW5ndGggLSBjLmVuZClcblx0ICAgIC8vIHRyYW5zbGF0ZVxuXHQgICAgZDMuc2VsZWN0KHRoaXMpLnNlbGVjdEFsbCgnZy56b29tU3RyaXAgPiBnW25hbWU9XCJzQmxvY2tzXCJdJylcblx0XHQuYXR0cigndHJhbnNmb3JtJywgY3ogPT4gYHRyYW5zbGF0ZSgkey16ZC5kZWx0YUIgKiBzZWxmLnBwYn0sMClzY2FsZSgke2N6LnhTY2FsZX0sMSlgKTtcblx0ICAgIHNlbGYuZHJhd0ZpZHVjaWFscygpO1xuXHQgICAgLy8gV2FpdCB1bnRpbCB3aGVlbCBldmVudHMgaGF2ZSBzdG9wcGVkIGZvciBhIHdoaWxlLCB0aGVuIHNjcm9sbCB0aGUgdmlldy5cblx0ICAgIGlmIChzZWxmLnRpbWVvdXQpe1xuXHRcdGNvbnNvbGUubG9nKFwiQ2xlYXJlZCB0aW1lb3V0XCIsIHNlbGYudGltZW91dCk7XG5cdCAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpO1xuXHQgICAgfVxuXHQgICAgc2VsZi50aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdGNvbnNvbGUubG9nKFwiVGltZW91dCFcIiwgc2VsZi50aW1lb3V0KTtcblx0XHRzZWxmLnRpbWVvdXQgPSBudWxsO1xuXHRcdGxldCBjY3h0ID0gc2VsZi5hcHAuZ2V0Q29udGV4dCgpO1xuXHRcdGxldCBuY3h0O1xuXHRcdGlmIChjY3h0LmxhbmRtYXJrKSB7XG5cdFx0ICAgIG5jeHQgPSB7IGRlbHRhOiBjY3h0LmRlbHRhICsgemQuZGVsdGFCIH07XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICBuY3h0ID0geyBzdGFydDogY2N4dC5zdGFydCArIHpkLmRlbHRhQiwgZW5kOiBjY3h0LmVuZCArIHpkLmRlbHRhQiB9O1xuXHRcdH1cblx0XHRzZWxmLmFwcC5zZXRDb250ZXh0KG5jeHQpO1xuXHRcdHpkLmRlbHRhQiA9IDA7XG5cdCAgICB9LCBzZWxmLmNmZy53aGVlbENvbnRleHREZWxheSk7XG5cdCAgICBjb25zb2xlLmxvZyhcIlNldCB0aW1lb3V0XCIsIHNlbGYudGltZW91dCk7XG5cdH0pO1xuXG5cblx0Ly8gQnV0dG9uOiBEcm9wIGRvd24gbWVudSBpbiB6b29tIHZpZXdcblx0dGhpcy5yb290LnNlbGVjdCgnLm1lbnUgPiAuYnV0dG9uJylcblx0ICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHQgICAgICAvLyBzaG93IGNvbnRleHQgbWVudSBhdCBtb3VzZSBldmVudCBjb29yZGluYXRlc1xuXHQgICAgICBsZXQgY3ggPSBkMy5ldmVudC5jbGllbnRYO1xuXHQgICAgICBsZXQgY3kgPSBkMy5ldmVudC5jbGllbnRZO1xuXHQgICAgICBsZXQgYmIgPSBkMy5zZWxlY3QodGhpcylbMF1bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICBzZWxmLnNob3dDb250ZXh0TWVudShzZWxmLmN4dE1lbnVDZmcsIG51bGwsIGN4LWJiLmxlZnQsIGN5LWJiLnRvcCk7XG5cdCAgfSk7XG5cdC8vIHpvb20gY29vcmRpbmF0ZXMgYm94XG5cdHRoaXMucm9vdC5zZWxlY3QoJyN6b29tQ29vcmRzJylcblx0ICAgIC5jYWxsKHpjcyA9PiB6Y3NbMF1bMF0udmFsdWUgPSBmb3JtYXRDb29yZHModGhpcy5hcHAuY29vcmRzKSlcblx0ICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7IHRoaXMuc2VsZWN0KCk7IH0pXG5cdCAgICAub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHsgc2VsZi5hcHAuc2V0Q29vcmRpbmF0ZXModGhpcy52YWx1ZSk7IH0pO1xuXG5cdC8vIHpvb20gd2luZG93IHNpemUgYm94XG5cdHRoaXMucm9vdC5zZWxlY3QoJyN6b29tV1NpemUnKVxuXHQgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHsgdGhpcy5zZWxlY3QoKTsgfSlcblx0ICAgIC5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgbGV0IHdzID0gcGFyc2VJbnQodGhpcy52YWx1ZSk7XG5cdFx0bGV0IGMgPSBzZWxmLmFwcC5jb29yZHM7XG5cdFx0aWYgKGlzTmFOKHdzKSB8fCB3cyA8IDEwMCkge1xuXHRcdCAgICBhbGVydCgnSW52YWxpZCB3aW5kb3cgc2l6ZS4gUGxlYXNlIGVudGVyIGFuIGludGVnZXIgPj0gMTAwLicpO1xuXHRcdCAgICB0aGlzLnZhbHVlID0gTWF0aC5yb3VuZChjLmVuZCAtIGMuc3RhcnQgKyAxKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIGxldCBtaWQgPSAoYy5zdGFydCArIGMuZW5kKSAvIDI7XG5cdFx0ICAgIGxldCBuZXdzID0gTWF0aC5yb3VuZChtaWQgLSB3cy8yKTtcblx0XHQgICAgbGV0IG5ld2UgPSBuZXdzICsgd3MgLSAxO1xuXHRcdCAgICBzZWxmLmFwcC5zZXRDb250ZXh0KHtcblx0XHQgICAgICAgIGNocjogYy5jaHIsXG5cdFx0XHRzdGFydDogbmV3cyxcblx0XHRcdGVuZDogbmV3ZSxcblx0XHRcdGxlbmd0aDogbmV3ZS1uZXdzKzFcblx0XHQgICAgfSk7XG5cdFx0fVxuXHQgICAgfSk7XG5cdC8vIHpvb20gZHJhd2luZyBtb2RlIFxuXHR0aGlzLnJvb3Quc2VsZWN0QWxsKCdkaXZbbmFtZT1cInpvb21EbW9kZVwiXSAuYnV0dG9uJylcblx0ICAgIC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRpZiAoZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ2Rpc2FibGVkJykpXG5cdFx0ICAgIHJldHVybjtcblx0XHRsZXQgciA9IHNlbGYucm9vdDtcblx0XHRsZXQgaXNDID0gci5jbGFzc2VkKCdjb21wYXJpc29uJyk7XG5cdFx0ci5jbGFzc2VkKCdjb21wYXJpc29uJywgIWlzQyk7XG5cdFx0ci5jbGFzc2VkKCdyZWZlcmVuY2UnLCBpc0MpO1xuXHRcdHNlbGYuYXBwLnNldENvbnRleHQoe2Rtb2RlOiByLmNsYXNzZWQoJ2NvbXBhcmlzb24nKSA/ICdjb21wYXJpc29uJyA6ICdyZWZlcmVuY2UnfSk7XG5cdCAgICB9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0IGhpZ2hsaWdodGVkIChobHMpIHtcblx0aWYgKHR5cGVvZihobHMpID09PSAnc3RyaW5nJylcblx0ICAgIGhscyA9IFtobHNdO1xuXHQvL1xuXHR0aGlzLmhpRmVhdHMgPSB7fTtcbiAgICAgICAgZm9yKGxldCBoIG9mIGhscyl7XG5cdCAgICB0aGlzLmhpRmVhdHNbaF0gPSBoO1xuXHR9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBsYW5lR2FwICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2ZnLmxhbmVHYXA7XG4gICAgfVxuICAgIHNldCBsYW5lR2FwIChnKSB7XG4gICAgICAgIHRoaXMuY2ZnLmxhbmVHYXAgPSBnO1xuXHR0aGlzLmNmZy5sYW5lSGVpZ2h0ID0gdGhpcy5jZmcuZmVhdEhlaWdodCArIHRoaXMuY2ZnLmxhbmVHYXA7XG5cdHRoaXMuY2ZnLmJsb2NrSGVpZ2h0ID0gdGhpcy5jZmcubGFuZUhlaWdodCAqIHRoaXMuY2ZnLm1pbkxhbmVzICogMjtcblx0dGhpcy51cGRhdGUoKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgZmVhdEhlaWdodCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNmZy5mZWF0SGVpZ2h0O1xuICAgIH1cbiAgICBzZXQgZmVhdEhlaWdodCAoaCkge1xuICAgICAgICB0aGlzLmNmZy5mZWF0SGVpZ2h0ID0gaDtcblx0dGhpcy5jZmcubGFuZUhlaWdodCA9IHRoaXMuY2ZnLmZlYXRIZWlnaHQgKyB0aGlzLmNmZy5sYW5lR2FwO1xuXHR0aGlzLmNmZy5ibG9ja0hlaWdodCA9IHRoaXMuY2ZnLmxhbmVIZWlnaHQgKiB0aGlzLmNmZy5taW5MYW5lcyAqIDI7XG5cdHRoaXMudXBkYXRlKCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGhpZ2hsaWdodGVkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlGZWF0cyA/IE9iamVjdC5rZXlzKHRoaXMuaGlGZWF0cykgOiBbXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93RmxvYXRpbmdUZXh0ICh0ZXh0LCB4LCB5KSB7XG5cdGxldCBzciA9IHRoaXMuc3ZnLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0eCA9IHgtc3IueC0xMjtcblx0eSA9IHktc3IueTtcblx0bGV0IGFuY2hvciA9IHggPCA2MCA/ICdzdGFydCcgOiB0aGlzLndpZHRoLXggPCA2MCA/ICdlbmQnIDogJ21pZGRsZSc7XG5cdHRoaXMuZmxvYXRpbmdUZXh0XG5cdCAgICAudGV4dCh0ZXh0KVxuXHQgICAgLnN0eWxlKCd0ZXh0LWFuY2hvcicsYW5jaG9yKVxuXHQgICAgLmF0dHIoJ3gnLCB4KVxuXHQgICAgLmF0dHIoJ3knLCB5KVxuICAgIH1cbiAgICBoaWRlRmxvYXRpbmdUZXh0ICgpIHtcblx0dGhpcy5mbG9hdGluZ1RleHQudGV4dCgnJyk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXRDb250ZXh0TWVudSAoaXRlbXMsb2JqKSB7XG5cdHRoaXMuY3h0TWVudS5zZWxlY3RBbGwoJy5tZW51SXRlbScpLnJlbW92ZSgpOyAvLyBpbiBjYXNlIG9mIHJlLWluaXRcbiAgICAgICAgbGV0IG1pdGVtcyA9IHRoaXMuY3h0TWVudVxuXHQgIC5zZWxlY3RBbGwoJy5tZW51SXRlbScpXG5cdCAgLmRhdGEoaXRlbXMpO1xuXHRsZXQgbmV3cyA9IG1pdGVtcy5lbnRlcigpXG5cdCAgLmFwcGVuZCgnZGl2Jylcblx0ICAuYXR0cignY2xhc3MnLCAoZCkgPT4gYG1lbnVJdGVtIGZsZXhyb3cgJHtkLmNsc3x8Jyd9YClcblx0ICAuY2xhc3NlZCgnZGlzYWJsZWQnLCBkID0+IGQuZGlzYWJsZXIgPyBkLmRpc2FibGVyKG9iaikgOiBmYWxzZSlcblx0ICAuYXR0cignbmFtZScsIGQgPT4gZC5uYW1lIHx8IG51bGwgKVxuXHQgIC5hdHRyKCd0aXRsZScsIGQgPT4gZC50b29sdGlwIHx8IG51bGwgKTtcblxuXHRsZXQgaGFuZGxlciA9IGQgPT4ge1xuXHQgICAgICBpZiAoZC5kaXNhYmxlciAmJiBkLmRpc2FibGVyKG9iaikpXG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgIGQuaGFuZGxlciAmJiBkLmhhbmRsZXIob2JqKTtcblx0ICAgICAgdGhpcy5oaWRlQ29udGV4dE1lbnUoKTtcblx0ICAgICAgZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH07XG5cdG5ld3MuYXBwZW5kKCdsYWJlbCcpXG5cdCAgLnRleHQoZCA9PiB0eXBlb2YoZC5sYWJlbCkgPT09ICdmdW5jdGlvbicgPyBkLmxhYmVsKG9iaikgOiBkLmxhYmVsKVxuXHQgIC5vbignY2xpY2snLCBoYW5kbGVyKVxuXHQgIC5vbignY29udGV4dG1lbnUnLCBoYW5kbGVyKTtcblx0bmV3cy5hcHBlbmQoJ2knKVxuXHQgIC5hdHRyKCdjbGFzcycsICdtYXRlcmlhbC1pY29ucycpXG5cdCAgLnRleHQoIGQ9PmQuaWNvbiApO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93Q29udGV4dE1lbnUgKGNmZyxmLHgseSkge1xuICAgICAgICB0aGlzLmluaXRDb250ZXh0TWVudShjZmcsIGYpO1xuICAgICAgICB0aGlzLmN4dE1lbnVcblx0ICAgIC5jbGFzc2VkKCdzaG93aW5nJywgdHJ1ZSlcblx0ICAgIC5zdHlsZSgnbGVmdCcsIGAke3h9cHhgKVxuXHQgICAgLnN0eWxlKCd0b3AnLCBgJHt5fXB4YClcblx0ICAgIDtcblx0aWYgKGYpIHtcblx0ICAgIHRoaXMuY3h0TWVudS5vbignbW91c2VlbnRlcicsICgpPT50aGlzLmhpZ2hsaWdodChmKSk7XG5cdCAgICB0aGlzLmN4dE1lbnUub24oJ21vdXNlbGVhdmUnLCAoKT0+IHtcblx0ICAgICAgICB0aGlzLmhpZ2hsaWdodCgpO1xuXHRcdHRoaXMuaGlkZUNvbnRleHRNZW51KCk7XG5cdCAgICB9KTtcblx0fVxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWRlQ29udGV4dE1lbnUgKCkge1xuICAgICAgICB0aGlzLmN4dE1lbnUuY2xhc3NlZCgnc2hvd2luZycsIGZhbHNlKTtcblx0dGhpcy5jeHRNZW51Lm9uKCdtb3VzZWVudGVyJywgbnVsbCk7XG5cdHRoaXMuY3h0TWVudS5vbignbW91c2VsZWF2ZScsIG51bGwpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIGdzIChsaXN0IG9mIEdlbm9tZXMpXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vICAgICBGb3IgZWFjaCBHZW5vbWUsIHNldHMgZy56b29tWSBcbiAgICBzZXQgZ2Vub21lcyAoZ3MpIHtcbiAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5jZmcudG9wT2Zmc2V0O1xuICAgICAgIGdzLmZvckVhY2goIGcgPT4ge1xuICAgICAgICAgICBnLnpvb21ZID0gb2Zmc2V0O1xuXHQgICBvZmZzZXQgKz0gdGhpcy5jZmcubWluU3RyaXBIZWlnaHQgKyB0aGlzLmNmZy5zdHJpcEdhcDtcbiAgICAgICB9KTtcbiAgICAgICB0aGlzLl9nZW5vbWVzID0gZ3M7XG4gICAgfVxuICAgIGdldCBnZW5vbWVzICgpIHtcbiAgICAgICByZXR1cm4gdGhpcy5fZ2Vub21lcztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgbmFtZXMgb2YgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcyAoc3RyaXBlcykgaW4gdG9wLXRvLWJvdHRvbSBvcmRlci5cbiAgICAvL1xuICAgIGdldEdlbm9tZVlPcmRlciAoKSB7XG4gICAgICAgIGxldCBzdHJpcHMgPSB0aGlzLnN2Z01haW4uc2VsZWN0QWxsKCcuem9vbVN0cmlwJyk7XG4gICAgICAgIGxldCBzcyA9IHN0cmlwc1swXS5tYXAoZz0+IHtcblx0ICAgIGxldCBiYiA9IGcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICByZXR1cm4gW2JiLnksIGcuX19kYXRhX18uZ2Vub21lLm5hbWVdO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IG5zID0gc3Muc29ydCggKGEsYikgPT4gYVswXSAtIGJbMF0gKS5tYXAoIHggPT4geFsxXSApXG5cdHJldHVybiBucztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyB0aGUgdG9wLXRvLWJvdHRvbSBvcmRlciBvZiB0aGUgY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzIGFjY29yZGluZyB0byBcbiAgICAvLyB0aGUgZ2l2ZW4gbmFtZSBsaXN0IG9mIG5hbWVzLiBCZWNhdXNlIHdlIGNhbid0IGd1YXJhbnRlZSB0aGUgZ2l2ZW4gbmFtZXMgY29ycmVzcG9uZFxuICAgIC8vIHRvIGFjdHVhbCB6b29tIHN0cmlwcywgb3IgdGhhdCBhbGwgc3RyaXBzIGFyZSByZXByZXNlbnRlZCwgZXRjLlxuICAgIC8vIFRoZXJlZm9yZSwgdGhlIGxpc3QgaXMgcHJlcHJlY2Vzc2VkIGFzIGZvbGxvd3M6XG4gICAgLy8gICAgICogZHVwbGljYXRlIG5hbWVzLCBpZiB0aGV5IGV4aXN0LCBhcmUgcmVtb3ZlZFxuICAgIC8vICAgICAqIG5hbWVzIHRoYXQgZG8gbm90IGNvcnJlc3BvbmQgdG8gZXhpc3Rpbmcgem9vbVN0cmlwcyBhcmUgcmVtb3ZlZFxuICAgIC8vICAgICAqIG5hbWVzIG9mIGV4aXN0aW5nIHpvb20gc3RyaXBzIHRoYXQgZG9uJ3QgYXBwZWFyIGluIHRoZSBsaXN0IGFyZSBhZGRlZCB0byB0aGUgZW5kXG4gICAgLy8gVGhlIHJlc3VsdCBpcyBhIGxpc3Qgb2YgbmFtZXMgd2l0aCB0aGVzZSBwcm9wZXJ0aWVzOlxuICAgIC8vICAgICAqIHRoZXJlIGlzIGEgMToxIGNvcnJlc3BvbmRlbmNlIGJldHdlZW4gbmFtZXMgYW5kIGFjdHVhbCB6b29tIHN0cmlwc1xuICAgIC8vICAgICAqIHRoZSBuYW1lIG9yZGVyIGlzIGNvbnNpc3RlbnQgd2l0aCB0aGUgaW5wdXQgbGlzdFxuICAgIC8vIFRoaXMgaXMgdGhlIGxpc3QgdXNlZCB0byAocmUpb3JkZXIgdGhlIHpvb20gc3RyaXBzLlxuICAgIC8vXG4gICAgLy8gR2l2ZW4gdGhlIGxpc3Qgb3JkZXI6IFxuICAgIC8vICAgICAqIGEgWS1wb3NpdGlvbiBpcyBhc3NpZ25lZCB0byBlYWNoIGdlbm9tZVxuICAgIC8vICAgICAqIHpvb20gc3RyaXBzIHRoYXQgYXJlIE5PVCBDVVJSRU5UTFkgQkVJTkcgRFJBR0dFRCBhcmUgdHJhbnNsYXRlZCB0byB0aGVpciBuZXcgbG9jYXRpb25zXG4gICAgLy9cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBucyAobGlzdCBvZiBzdHJpbmdzKSBOYW1lcyBvZiB0aGUgZ2Vub21lcy5cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgICBub3RoaW5nXG4gICAgLy8gU2lkZSBlZmZlY3RzOlxuICAgIC8vICAgICBSZWNhbGN1bGF0ZXMgdGhlIFktY29vcmRpbmF0ZXMgZm9yIGVhY2ggc3RyaXAgYmFzZWQgb24gdGhlIGdpdmVuIG9yZGVyLCB0aGVuIHRyYW5zbGF0ZXNcbiAgICAvLyAgICAgZWFjaCBzdHJpcCB0byBpdHMgbmV3IHBvc2l0aW9uLlxuICAgIC8vXG4gICAgc2V0R2Vub21lWU9yZGVyIChucykge1xuXHR0aGlzLmdlbm9tZXMgPSByZW1vdmVEdXBzKG5zKS5tYXAobj0+IHRoaXMuYXBwLm5hbWUyZ2Vub21lW25dICkuZmlsdGVyKHg9PngpO1xuXHRsZXQgbyA9IHRoaXMuY2ZnLnRvcE9mZnNldDtcbiAgICAgICAgdGhpcy5nZW5vbWVzLmZvckVhY2goIChnLGkpID0+IHtcblx0ICAgIGxldCBzdHJpcCA9IGQzLnNlbGVjdChgI3pvb21WaWV3IC56b29tU3RyaXBbbmFtZT1cIiR7Zy5uYW1lfVwiXWApO1xuXHQgICAgaWYgKCFzdHJpcC5jbGFzc2VkKCdkcmFnZ2luZycpKVxuXHQgICAgICAgIHN0cmlwLmF0dHIoJ3RyYW5zZm9ybScsIGdkID0+IGB0cmFuc2xhdGUoMCwke28gKyBnZC56ZXJvT2Zmc2V0fSlgKTtcblx0ICAgIG8gKz0gc3RyaXAuZGF0YSgpWzBdLnN0cmlwSGVpZ2h0ICsgdGhpcy5jZmcuc3RyaXBHYXA7XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBkcmFnZ2VyIChkMy5iZWhhdmlvci5kcmFnKSB0byBiZSBhdHRhY2hlZCB0byBlYWNoIHpvb20gc3RyaXAuXG4gICAgLy8gQWxsb3dzIHN0cmlwcyB0byBiZSByZW9yZGVyZWQgYnkgZHJhZ2dpbmcuXG4gICAgZ2V0RHJhZ2dlciAoKSB7ICBcbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBkMy5iZWhhdmlvci5kcmFnKClcblx0ICAub3JpZ2luKGZ1bmN0aW9uKGQsaSl7XG5cdCAgICAgIHJldHVybiB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIH0pXG4gICAgICAgICAgLm9uKCdkcmFnc3RhcnQueicsIGZ1bmN0aW9uKGcpIHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC5zb3VyY2VFdmVudC50YXJnZXQ7XG5cdCAgICAgIGlmIChkMy5ldmVudC5zb3VyY2VFdmVudC5zaGlmdEtleSB8fCAhIGQzLnNlbGVjdCh0KS5jbGFzc2VkKCd6b29tU3RyaXBIYW5kbGUnKSl7XG5cdCAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgIH1cblx0ICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgIGxldCBzdHJpcCA9IHRoaXMuY2xvc2VzdCgnLnpvb21TdHJpcCcpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nID0gZDMuc2VsZWN0KHN0cmlwKS5jbGFzc2VkKCdkcmFnZ2luZycsIHRydWUpO1xuXHQgIH0pXG5cdCAgLm9uKCdkcmFnLnonLCBmdW5jdGlvbiAoZykge1xuXHQgICAgICBpZiAoIXNlbGYuZHJhZ2dpbmcpIHJldHVybjtcblx0ICAgICAgbGV0IG14ID0gZDMubW91c2Uoc2VsZi5zdmdNYWluWzBdWzBdKVswXTtcblx0ICAgICAgbGV0IG15ID0gZDMubW91c2Uoc2VsZi5zdmdNYWluWzBdWzBdKVsxXTtcblx0ICAgICAgc2VsZi5kcmFnZ2luZy5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bXl9KWApO1xuXHQgICAgICBzZWxmLnNldEdlbm9tZVlPcmRlcihzZWxmLmdldEdlbm9tZVlPcmRlcigpKTtcblx0ICAgICAgc2VsZi5kcmF3RmlkdWNpYWxzKCk7XG5cdCAgfSlcblx0ICAub24oJ2RyYWdlbmQueicsIGZ1bmN0aW9uIChnKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICAvL1xuXHQgICAgICBzZWxmLmRyYWdnaW5nLmNsYXNzZWQoJ2RyYWdnaW5nJywgZmFsc2UpO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nID0gbnVsbDtcblx0ICAgICAgc2VsZi5zZXRHZW5vbWVZT3JkZXIoc2VsZi5nZXRHZW5vbWVZT3JkZXIoKSk7XG5cdCAgICAgIHNlbGYuYXBwLnNldENvbnRleHQoeyBnZW5vbWVzOiBzZWxmLmdldEdlbm9tZVlPcmRlcigpIH0pO1xuXHQgICAgICB3aW5kb3cuc2V0VGltZW91dCggc2VsZi5kcmF3RmlkdWNpYWxzLmJpbmQoc2VsZiksIDUwICk7XG5cdCAgfSlcblx0ICA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJCcnVzaGVzICgpIHtcblx0dGhpcy5yb290LnNlbGVjdEFsbCgnZy5icnVzaCcpXG5cdCAgICAuZWFjaCggZnVuY3Rpb24gKGIpIHtcblx0ICAgICAgICBiLmJydXNoLmNsZWFyKCk7XG5cdFx0ZDMuc2VsZWN0KHRoaXMpLmNhbGwoYi5icnVzaCk7XG5cdCAgICB9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGJydXNoIGNvb3JkaW5hdGVzLCB0cmFuc2xhdGVkIChpZiBuZWVkZWQpIHRvIHJlZiBnZW5vbWUgY29vcmRpbmF0ZXMuXG4gICAgYmJHZXRSZWZDb29yZHMgKCkge1xuICAgICAgbGV0IHJnID0gdGhpcy5hcHAuckdlbm9tZTtcbiAgICAgIGxldCBibGsgPSB0aGlzLmJydXNoaW5nO1xuICAgICAgbGV0IGV4dCA9IGJsay5icnVzaC5leHRlbnQoKTtcbiAgICAgIGxldCByID0geyBjaHI6IGJsay5jaHIsIHN0YXJ0OiBleHRbMF0sIGVuZDogZXh0WzFdLCBibG9ja0lkOmJsay5ibG9ja0lkIH07XG4gICAgICBsZXQgdHIgPSB0aGlzLmFwcC50cmFuc2xhdG9yO1xuICAgICAgaWYoIGJsay5nZW5vbWUgIT09IHJnICkge1xuICAgICAgICAgLy8gdXNlciBpcyBicnVzaGluZyBhIGNvbXAgZ2Vub21lcyBzbyBmaXJzdCB0cmFuc2xhdGVcblx0IC8vIGNvb3JkaW5hdGVzIHRvIHJlZiBnZW5vbWVcblx0IGxldCBycyA9IHRoaXMuYXBwLnRyYW5zbGF0b3IudHJhbnNsYXRlKGJsay5nZW5vbWUsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgcmcpO1xuXHQgaWYgKHJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHQgciA9IHJzWzBdO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICAgci5ibG9ja0lkID0gcmcubmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBoYW5kbGVyIGZvciB0aGUgc3RhcnQgb2YgYSBicnVzaCBhY3Rpb24gYnkgdGhlIHVzZXIgb24gYSBibG9ja1xuICAgIGJiU3RhcnQgKGJsayxiRWx0KSB7XG4gICAgICB0aGlzLmJydXNoaW5nID0gYmxrO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBiYkJydXNoICgpIHtcbiAgICAgICAgbGV0IGV2ID0gZDMuZXZlbnQuc291cmNlRXZlbnQ7XG5cdGxldCB4dCA9IHRoaXMuYnJ1c2hpbmcuYnJ1c2guZXh0ZW50KCk7XG5cdGxldCBzID0gTWF0aC5yb3VuZCh4dFswXSk7XG5cdGxldCBlID0gTWF0aC5yb3VuZCh4dFsxXSk7XG5cdHRoaXMuc2hvd0Zsb2F0aW5nVGV4dChgJHt0aGlzLmJydXNoaW5nLmNocn06JHtzfS4uJHtlfWAsIGV2LmNsaWVudFgsIGV2LmNsaWVudFkpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBiYkVuZCAoKSB7XG4gICAgICBsZXQgc2UgPSBkMy5ldmVudC5zb3VyY2VFdmVudDtcbiAgICAgIGxldCB4dCA9IHRoaXMuYnJ1c2hpbmcuYnJ1c2guZXh0ZW50KCk7XG4gICAgICBsZXQgZyA9IHRoaXMuYnJ1c2hpbmcuZ2Vub21lLmxhYmVsO1xuICAgICAgLy9cbiAgICAgIHRoaXMuaGlkZUZsb2F0aW5nVGV4dCgpO1xuICAgICAgLy9cbiAgICAgIGlmIChzZS5jdHJsS2V5IHx8IHNlLmFsdEtleSB8fCBzZS5tZXRhS2V5KSB7XG5cdCAgdGhpcy5jbGVhckJydXNoZXMoKTtcblx0ICB0aGlzLmJydXNoaW5nID0gbnVsbDtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvL1xuICAgICAgaWYgKE1hdGguYWJzKHh0WzBdIC0geHRbMV0pIDw9IDEwKSB7XG5cdCAgLy8gVXNlciBjbGlja2VkLiBSZWNlbnRlciB2aWV3IG9uIHRoZSBjbGlja2VkIGNvb3JkaW5hdGUuIFxuXHQgIC8vIFdoaWNoZXZlciBnZW5vbWUgdGhlIHVzZXIgY2xpY2tlZCBpbiBiZWNvbWVzIHRoZSByZWZlcmVuY2UuXG5cdCAgLy8gVGhlIGNsaWNrZWQgY29vcmRpbmF0ZTpcblx0ICBsZXQgeG1pZCA9ICh4dFswXSArIHh0WzFdKS8yO1xuXHQgIC8vIHNpemUgb2Ygdmlld1xuXHQgIGxldCB3ID0gdGhpcy5hcHAuY29vcmRzLmVuZCAtIHRoaXMuYXBwLmNvb3Jkcy5zdGFydCArIDE7XG5cdCAgLy8gc3RhcnRpbmcgY29vcmRpbmF0ZSBpbiBjbGlja2VkIGdlbm9tZSBvZiBuZXcgdmlld1xuXHQgIGxldCBzID0gTWF0aC5yb3VuZCh4bWlkIC0gdy8yKTtcblx0ICAvL1xuXHQgIGxldCBuZXdDb250ZXh0ID0geyByZWY6ZywgY2hyOiB0aGlzLmJydXNoaW5nLmNociwgc3RhcnQ6IHMsIGVuZDogcyArIHcgLSAxIH07XG5cdCAgaWYgKHRoaXMuY21vZGUgPT09ICdsYW5kbWFyaycpIHtcblx0ICAgICAgbGV0IGxtZiA9IHRoaXMuY29udGV4dC5sYW5kbWFya0ZlYXRzLmZpbHRlcihmID0+IGYuZ2Vub21lID09PSB0aGlzLmJydXNoaW5nLmdlbm9tZSlbMF07XG5cdCAgICAgIGlmIChsbWYpIHtcblx0XHQgIGxldCBtID0gKHRoaXMuYnJ1c2hpbmcuZW5kICsgdGhpcy5icnVzaGluZy5zdGFydCkgLyAyO1xuXHRcdCAgbGV0IGR4ID0geG1pZCAtIG07XG5cdFx0ICBuZXdDb250ZXh0ID0geyByZWY6ZywgZGVsdGE6IHRoaXMuY29udGV4dC5kZWx0YStkeCB9O1xuXHQgICAgICB9XG5cdCAgfVxuXHQgIHRoaXMuYXBwLnNldENvbnRleHQobmV3Q29udGV4dCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcblx0ICAvLyBVc2VyIGRyYWdnZWQuIFpvb20gaW4gb3Igb3V0LlxuXHQgIHRoaXMuYXBwLnNldENvbnRleHQoeyByZWY6ZywgY2hyOiB0aGlzLmJydXNoaW5nLmNociwgc3RhcnQ6eHRbMF0sIGVuZDp4dFsxXSB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2xlYXJCcnVzaGVzKCk7XG4gICAgICB0aGlzLmJydXNoaW5nID0gbnVsbDtcbiAgICAgIHRoaXMuZGVhbFdpdGhVbndhbnRlZENsaWNrRXZlbnQgPSB0cnVlO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBoaWdobGlnaHRTdHJpcCAoZywgZWx0KSB7XG5cdGlmIChnID09PSB0aGlzLmN1cnJlbnRITEcpIHJldHVybjtcblx0dGhpcy5jdXJyZW50SExHID0gZztcblx0Ly9cblx0dGhpcy5zdmdNYWluLnNlbGVjdEFsbCgnLnpvb21TdHJpcCcpXG5cdCAgICAuY2xhc3NlZCgnaGlnaGxpZ2h0ZWQnLCBkID0+IGQuZ2Vub21lID09PSBnKTtcblx0dGhpcy5hcHAuc2hvd0Jsb2NrcyhnKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBCYXNlZCBvbiB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSwgc2V0cyB0aGUgc2hvd0ZlYXR1cmVEZXRhaWxzIGZsYWcgdG8gdHJ1ZSBvciBmYWxzZS5cbiAgICAvLyBBbHNvIHNldHMgdGhlIGNsZWFyQWxsIGZsYWcgdG8gdHJ1ZSBpZiB0aGUgc2hvd0ZlYXR1cmVEZXRhaWxzIGZsYWcgY2hhbmdlZCB2YWx1ZS5cbiAgICAvL1xuICAgIHNldFNob3dGZWF0dXJlRGV0YWlscyAoYykge1xuXHQvL1xuXHRsZXQgcHJldlNGRCA9IHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzO1xuXHR0aGlzLnNob3dGZWF0dXJlRGV0YWlscyA9IChjLmVuZCAtIGMuc3RhcnQgKyAxKSA8PSB0aGlzLmNmZy5mZWF0dXJlRGV0YWlsVGhyZXNob2xkO1xuXHR0aGlzLmNsZWFyQWxsID0gcHJldlNGRCAhPT0gdGhpcy5zaG93RmVhdHVyZURldGFpbHM7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXBkYXRlcyB0aGUgWm9vbVZpZXcgdG8gc2hvdyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBmcm9tIHRoZSByZWcgZ2Vub21lIGFuZCB0aGUgY29ycmVzcG9uZGluZ1xuICAgIC8vIHJhbmdlKHMpIGluIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy9cbiAgICB1cGRhdGVWaWFNYXBwZWRDb29yZGluYXRlcyAoY29vcmRzKSB7XG5cdGxldCBjID0gKGNvb3JkcyB8fCB0aGlzLmFwcC5jb29yZHMpO1xuXHRkMy5zZWxlY3QoJyN6b29tQ29vcmRzJylbMF1bMF0udmFsdWUgPSBmb3JtYXRDb29yZHMoYy5jaHIsIGMuc3RhcnQsIGMuZW5kKTtcblx0ZDMuc2VsZWN0KCcjem9vbVdTaXplJylbMF1bMF0udmFsdWUgPSBNYXRoLnJvdW5kKGMuZW5kIC0gYy5zdGFydCArIDEpXG5cdC8vXG4gICAgICAgIGxldCBtZ3YgPSB0aGlzLmFwcDtcblx0Ly8gSXNzdWUgcmVxdWVzdHMgZm9yIGZlYXR1cmVzLiBPbmUgcmVxdWVzdCBwZXIgZ2Vub21lLCBlYWNoIHJlcXVlc3Qgc3BlY2lmaWVzIG9uZSBvciBtb3JlXG5cdC8vIGNvb3JkaW5hdGUgcmFuZ2VzLlxuXHQvLyBXYWl0IGZvciBhbGwgdGhlIGRhdGEgdG8gYmVjb21lIGF2YWlsYWJsZSwgdGhlbiBkcmF3LlxuXHQvL1xuXHRsZXQgcHJvbWlzZXMgPSBbXTtcblxuXHQvL1xuXHR0aGlzLnNldFNob3dGZWF0dXJlRGV0YWlscyhjKTtcblxuXHQvLyBGaXJzdCByZXF1ZXN0IGlzIGZvciB0aGUgdGhlIHJlZmVyZW5jZSBnZW5vbWUuIEdldCBhbGwgdGhlIGZlYXR1cmVzIGluIHRoZSByYW5nZS5cblx0cHJvbWlzZXMucHVzaChtZ3YuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXNCeVJhbmdlKG1ndi5yR2Vub21lLCBbe1xuXHQgICAgLy8gTmVlZCB0byBzaW11bGF0ZSB0aGUgcmVzdWx0cyBmcm9tIGNhbGxpbmcgdGhlIHRyYW5zbGF0b3IuIFxuXHQgICAgLy8gXG5cdCAgICBjaHIgICAgOiBjLmNocixcblx0ICAgIHN0YXJ0ICA6IGMuc3RhcnQsXG5cdCAgICBlbmQgICAgOiBjLmVuZCxcblx0ICAgIGluZGV4ICA6IDAsXG5cdCAgICBmQ2hyICAgOiBjLmNocixcblx0ICAgIGZTdGFydCA6IGMuc3RhcnQsXG5cdCAgICBmRW5kICAgOiBjLmVuZCxcblx0ICAgIGZJbmRleCAgOiAwLFxuXHQgICAgb3JpICAgIDogJysnLFxuXHQgICAgYmxvY2tJZDogbWd2LnJHZW5vbWUubmFtZVxuXHR9XSwgdGhpcy5zaG93RmVhdHVyZURldGFpbHMpKTtcblx0aWYgKCEgdGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKSB7XG5cdCAgICAvLyBBZGQgYSByZXF1ZXN0IGZvciBlYWNoIGNvbXBhcmlzb24gZ2Vub21lLCB1c2luZyB0cmFuc2xhdGVkIGNvb3JkaW5hdGVzLiBcblx0ICAgIG1ndi5jR2Vub21lcy5mb3JFYWNoKGNHZW5vbWUgPT4ge1xuXHRcdGxldCByYW5nZXMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUoIG1ndi5yR2Vub21lLCBjLmNociwgYy5zdGFydCwgYy5lbmQsIGNHZW5vbWUgKTtcblx0XHRsZXQgcCA9IG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlc0J5UmFuZ2UoY0dlbm9tZSwgcmFuZ2VzLCB0aGlzLnNob3dGZWF0dXJlRGV0YWlscyk7XG5cdFx0cHJvbWlzZXMucHVzaChwKTtcblx0ICAgIH0pO1xuXHR9XG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICB9XG4gICAgLy8gVXBkYXRlcyB0aGUgWm9vbVZpZXcgdG8gc2hvdyB0aGUgcmVnaW9uIGFyb3VuZCBhIGxhbmRtYXJrIGluIGVhY2ggZ2Vub21lLlxuICAgIC8vXG4gICAgLy8gY29vcmRzID0ge1xuICAgIC8vICAgICBsYW5kbWFyayA6IGlkIG9mIGEgZmVhdHVyZSB0byB1c2UgYXMgYSByZWZlcmVuY2VcbiAgICAvLyAgICAgZmxhbmt8d2lkdGggOiBzcGVjaWZ5IG9uZSBvZiBmbGFuayBvciB3aWR0aC4gXG4gICAgLy8gICAgICAgICBmbGFuayA9IGFtb3VudCBvZiBmbGFua2luZyByZWdpb24gKGJwKSB0byBpbmNsdWRlIGF0IGJvdGggZW5kcyBvZiB0aGUgbGFuZG1hcmssIFxuICAgIC8vICAgICAgICAgc28gdGhlIHRvdGFsIHZpZXdpbmcgcmVnaW9uID0gZmxhbmsgKyBsZW5ndGgobGFuZG1hcmspICsgZmxhbmsuXG4gICAgLy8gICAgICAgICB3aWR0aCA9IHRvdGFsIHZpZXdpbmcgcmVnaW9uIHdpZHRoLiBJZiBib3RoIHdpZHRoIGFuZCBmbGFuayBhcmUgc3BlY2lmaWVkLCBmbGFuayBpcyBpZ25vcmVkLlxuICAgIC8vICAgICBkZWx0YSA6IGFtb3VudCB0byBzaGlmdCB0aGUgdmlldyBsZWZ0L3JpZ2h0XG4gICAgLy8gfVxuICAgIC8vIFxuICAgIC8vIFRoZSBsYW5kbWFyayBtdXN0IGV4aXN0IGluIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBnZW5vbWUuIFxuICAgIC8vXG4gICAgdXBkYXRlVmlhTGFuZG1hcmtDb29yZGluYXRlcyAoY29vcmRzKSB7XG5cdGxldCBjID0gY29vcmRzO1xuXHRsZXQgbWd2ID0gdGhpcy5hcHA7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblx0bGV0IHJmID0gY29vcmRzLmxhbmRtYXJrUmVmRmVhdDtcblx0bGV0IGZlYXRzID0gY29vcmRzLmxhbmRtYXJrRmVhdHM7XG5cdGlmICh0aGlzLnJvb3QuY2xhc3NlZCgnY2xvc2VkJykpXG5cdCAgICBmZWF0cyA9IGZlYXRzLmZpbHRlcihmID0+IGYuZ2Vub21lID09PSB0aGlzLmFwcC5yR2Vub21lKTtcblx0bGV0IGRlbHRhID0gY29vcmRzLmRlbHRhIHx8IDA7XG5cblx0Ly8gY29tcHV0ZSByYW5nZXMgYXJvdW5kIGxhbmRtYXJrIGluIGVhY2ggZ2Vub21lXG5cdGxldCByYW5nZXMgPSBmZWF0cy5tYXAoZiA9PiB7XG5cdCAgICBsZXQgZmxhbmsgPSBjLmxlbmd0aCA/IChjLmxlbmd0aCAtIGYubGVuZ3RoKSAvIDIgOiBjLmZsYW5rO1xuXHQgICAgbGV0IGNsZW5ndGggPSBmLmdlbm9tZS5nZXRDaHJvbW9zb21lKGYuY2hyKS5sZW5ndGg7XG5cdCAgICBsZXQgdyAgICAgPSBjLmxlbmd0aCA/IGMubGVuZ3RoIDogKGYubGVuZ3RoICsgMipmbGFuayk7XG5cdCAgICBsZXQgc2lnbiA9IGYuc3RyYW5kID09PSAnLScgPyAtMSA6IDE7XG5cdCAgICBsZXQgc3RhcnQgPSBjbGlwKE1hdGgucm91bmQoZGVsdGEgKyBmLnN0YXJ0IC0gZmxhbmspLCAxLCBjbGVuZ3RoKTtcblx0ICAgIGxldCBlbmQgICA9IGNsaXAoTWF0aC5yb3VuZChzdGFydCArIHcpLCBzdGFydCwgY2xlbmd0aClcblx0ICAgIGxldCBmZGVsdGEgPSBmLmxlbmd0aCAvIDI7XG5cdCAgICBsZXQgcmFuZ2UgPSB7XG5cdFx0Z2Vub21lOlx0ICAgIGYuZ2Vub21lLFxuXHRcdGNocjpcdCAgICBmLmNocixcblx0XHRjaHJvbW9zb21lOiBmLmdlbm9tZS5nZXRDaHJvbW9zb21lKGYuY2hyKSxcblx0XHRzdGFydDogICAgICBzdGFydCAtIHNpZ24gKiBmZGVsdGEsXG5cdFx0ZW5kOiAgICAgICAgZW5kICAgLSBzaWduICogZmRlbHRhXG5cdCAgICB9IDtcblx0ICAgIGlmIChmLmdlbm9tZSA9PT0gbWd2LnJHZW5vbWUpIHtcblx0XHRsZXQgYyA9IHRoaXMuYXBwLmNvb3JkcyA9IHJhbmdlO1xuXHRcdGQzLnNlbGVjdCgnI3pvb21Db29yZHMnKVswXVswXS52YWx1ZSA9IGZvcm1hdENvb3JkcyhjLmNociwgYy5zdGFydCwgYy5lbmQpO1xuXHRcdGQzLnNlbGVjdCgnI3pvb21XU2l6ZScpWzBdWzBdLnZhbHVlID0gTWF0aC5yb3VuZChjLmVuZCAtIGMuc3RhcnQgKyAxKVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIHJhbmdlO1xuXHR9KTtcblx0bGV0IHNlZW5HZW5vbWVzID0gbmV3IFNldCgpO1xuXHRsZXQgckNvb3Jkcztcblx0Ly8gR2V0IChwcm9taXNlcyBmb3IpIHRoZSBmZWF0dXJlcyBpbiBlYWNoIHJhbmdlLlxuXHRsZXQgcHJvbWlzZXMgPSByYW5nZXMubWFwKHIgPT4ge1xuICAgICAgICAgICAgbGV0IHJycztcblx0ICAgIHNlZW5HZW5vbWVzLmFkZChyLmdlbm9tZSk7XG5cdCAgICBpZiAoci5nZW5vbWUgPT09IG1ndi5yR2Vub21lKXtcblx0XHQvLyB0aGUgcmVmIGdlbm9tZSByYW5nZVxuXHRcdHJDb29yZHMgPSByO1xuXHRcdC8vXG5cdFx0dGhpcy5zZXRTaG93RmVhdHVyZURldGFpbHMocik7XG5cdFx0Ly9cblx0ICAgICAgICBycnMgPSBbe1xuXHRcdCAgICBjaHIgICAgOiByLmNocixcblx0XHQgICAgc3RhcnQgIDogci5zdGFydCxcblx0XHQgICAgZW5kICAgIDogci5lbmQsXG5cdFx0ICAgIGluZGV4ICA6IDAsXG5cdFx0ICAgIGZDaHIgICA6IHIuY2hyLFxuXHRcdCAgICBmU3RhcnQgOiByLnN0YXJ0LFxuXHRcdCAgICBmRW5kICAgOiByLmVuZCxcblx0XHQgICAgZkluZGV4ICA6IDAsXG5cdFx0ICAgIG9yaSAgICA6ICcrJyxcblx0XHQgICAgYmxvY2tJZDogbWd2LnJHZW5vbWUubmFtZVxuXHRcdH1dO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7IFxuXHRcdC8vIHR1cm4gdGhlIHNpbmdsZSByYW5nZSBpbnRvIGEgcmFuZ2UgZm9yIGVhY2ggb3ZlcmxhcHBpbmcgc3ludGVueSBibG9jayB3aXRoIHRoZSByZWYgZ2Vub21lXG5cdCAgICAgICAgcnJzID0gbWd2LnRyYW5zbGF0b3IudHJhbnNsYXRlKHIuZ2Vub21lLCByLmNociwgci5zdGFydCwgci5lbmQsIG1ndi5yR2Vub21lLCB0cnVlKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBtZ3YuZmVhdHVyZU1hbmFnZXIuZ2V0RmVhdHVyZXNCeVJhbmdlKHIuZ2Vub21lLCBycnMsIHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzKTtcblx0fSk7XG5cdC8vIEZvciBlYWNoIGdlbm9tZSB3aGVyZSB0aGUgbGFuZG1hcmsgZG9lcyBub3QgZXhpc3QsIGNvbXB1dGUgYSBtYXBwZWQgcmFuZ2UgKGFzIGluIG1hcHBlZCBjbW9kZSkuXG5cdGlmICghdGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpKVxuXHQgICAgbWd2LmNHZW5vbWVzLmZvckVhY2goZyA9PiB7XG5cdFx0aWYgKCEgc2Vlbkdlbm9tZXMuaGFzKGcpKSB7XG5cdFx0ICAgIGxldCBycnMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUobWd2LnJHZW5vbWUsIHJDb29yZHMuY2hyLCByQ29vcmRzLnN0YXJ0LCByQ29vcmRzLmVuZCwgZyk7XG5cdFx0ICAgIHByb21pc2VzLnB1c2goIG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlc0J5UmFuZ2UoZywgcnJzLCB0aGlzLnNob3dGZWF0dXJlRGV0YWlscykgKTtcblx0XHR9XG5cdCAgICB9KTtcblx0Ly8gV2hlbiBhbGwgdGhlIGRhdGEgaXMgcmVhZHksIGRyYXcuXG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgfVxuICAgIC8vXG4gICAgdXBkYXRlIChjb250ZXh0KSB7XG5cdHRoaXMuY29udGV4dCA9IGNvbnRleHQgfHwgdGhpcy5jb250ZXh0O1xuXHR0aGlzLmhpZ2hsaWdodGVkID0gdGhpcy5jb250ZXh0LmhpZ2hsaWdodDtcblx0dGhpcy5nZW5vbWVzID0gdGhpcy5jb250ZXh0Lmdlbm9tZXM7XG5cdHRoaXMuZG1vZGUgPSB0aGlzLmNvbnRleHQuZG1vZGU7XG5cdHRoaXMuY21vZGUgPSB0aGlzLmNvbnRleHQuY21vZGU7XG5cdHRoaXMuYXBwLnRyYW5zbGF0b3IucmVhZHkoKS50aGVuKCgpID0+IHtcblx0ICAgIGxldCBwO1xuXHQgICAgaWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKVxuXHRcdHAgPSB0aGlzLnVwZGF0ZVZpYU1hcHBlZENvb3JkaW5hdGVzKHRoaXMuYXBwLmNvb3Jkcyk7XG5cdCAgICBlbHNlXG5cdFx0cCA9IHRoaXMudXBkYXRlVmlhTGFuZG1hcmtDb29yZGluYXRlcyh0aGlzLmFwcC5sY29vcmRzKTtcblx0ICAgIHAudGhlbiggZGF0YSA9PiB7XG5cdFx0dGhpcy5kcmF3KHRoaXMubXVuZ2VEYXRhKGRhdGEpKTtcblx0ICAgIH0pO1xuXHR9KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIG1lcmdlU2Jsb2NrUnVucyAoZGF0YSkge1xuXHQvLyAtLS0tLVxuXHQvLyBSZWR1Y2VyIGZ1bmN0aW9uLiBXaWxsIGJlIGNhbGxlZCB3aXRoIHRoZXNlIGFyZ3M6XG5cdC8vICAgbmJsY2tzIChsaXN0KSBOZXcgYmxvY2tzLiAoY3VycmVudCBhY2N1bXVsYXRvciB2YWx1ZSlcblx0Ly8gICBcdEEgbGlzdCBvZiBsaXN0cyBvZiBzeW50ZW55IGJsb2Nrcy5cblx0Ly8gICBibGsgKHN5bnRlbnkgYmxvY2spIHRoZSBjdXJyZW50IHN5bnRlbnkgYmxvY2tcblx0Ly8gICBpIChpbnQpIFRoZSBpdGVyYXRpb24gY291bnQuXG5cdC8vIFJldHVybnM6XG5cdC8vICAgbGlzdCBvZiBsaXN0cyBvZiBibG9ja3Ncblx0bGV0IG1lcmdlciA9IChuYmxrcywgYiwgaSkgPT4ge1xuXHQgICAgbGV0IGluaXRCbGsgPSBmdW5jdGlvbiAoYmIpIHtcblx0XHRsZXQgbmIgPSBPYmplY3QuYXNzaWduKHt9LCBiYik7XG5cdFx0bmIuc3VwZXJCbG9jayA9IHRydWU7XG5cdFx0bmIuZmVhdHVyZXMgPSBiYi5mZWF0dXJlcy5jb25jYXQoKTtcblx0XHRuYi5zYmxvY2tzID0gW2JiXTtcblx0XHRuYi5vcmkgPSAnKydcblx0XHRyZXR1cm4gbmI7XG5cdCAgICB9O1xuXHQgICAgaWYgKGkgPT09IDApe1xuXHRcdG5ibGtzLnB1c2goaW5pdEJsayhiKSk7XG5cdFx0cmV0dXJuIG5ibGtzO1xuXHQgICAgfVxuXHQgICAgbGV0IGxhc3RCbGsgPSBuYmxrc1tuYmxrcy5sZW5ndGggLSAxXTtcblx0ICAgIGlmIChiLmNociAhPT0gbGFzdEJsay5jaHIgfHwgYi5pbmRleCAtIGxhc3RCbGsuaW5kZXggIT09IDEpIHtcblx0ICAgICAgICBuYmxrcy5wdXNoKGluaXRCbGsoYikpO1xuXHRcdHJldHVybiBuYmxrcztcblx0ICAgIH1cblx0ICAgIC8vIG1lcmdlXG5cdCAgICBsYXN0QmxrLmluZGV4ID0gYi5pbmRleDtcblx0ICAgIGxhc3RCbGsuZW5kID0gYi5lbmQ7XG5cdCAgICBsYXN0QmxrLmJsb2NrRW5kID0gYi5ibG9ja0VuZDtcblx0ICAgIGxhc3RCbGsuZmVhdHVyZXMgPSBsYXN0QmxrLmZlYXR1cmVzLmNvbmNhdChiLmZlYXR1cmVzKTtcblx0ICAgIGxldCBsYXN0U2IgPSBsYXN0QmxrLnNibG9ja3NbbGFzdEJsay5zYmxvY2tzLmxlbmd0aCAtIDFdO1xuXHQgICAgbGV0IGQgPSBiLnN0YXJ0IC0gbGFzdFNiLmVuZDtcblx0ICAgIGxhc3RTYi5lbmQgKz0gZC8yO1xuXHQgICAgYi5zdGFydCAtPSBkLzI7XG5cdCAgICBsYXN0QmxrLnNibG9ja3MucHVzaChiKTtcblx0ICAgIHJldHVybiBuYmxrcztcblx0fTtcblx0Ly8gLS0tLS1cbiAgICAgICAgZGF0YS5mb3JFYWNoKChnZGF0YSxpKSA9PiB7XG5cdCAgICBpZiAodGhpcy5kbW9kZSA9PT0gJ2NvbXBhcmlzb24nKSB7XG5cdFx0Z2RhdGEuYmxvY2tzLnNvcnQoIChhLGIpID0+IGEuaW5kZXggLSBiLmluZGV4ICk7XG5cdFx0Z2RhdGEuYmxvY2tzID0gZ2RhdGEuYmxvY2tzLnJlZHVjZShtZXJnZXIsW10pO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0Ly8gZmlyc3Qgc29ydCBieSByZWYgZ2Vub21lIG9yZGVyXG5cdFx0Z2RhdGEuYmxvY2tzLnNvcnQoIChhLGIpID0+IGEuZkluZGV4IC0gYi5mSW5kZXggKTtcblx0XHQvLyBTdWItZ3JvdXAgaW50byBydW5zIG9mIHNhbWUgY29tcCBnZW5vbWUgY2hyb21vc29tZS5cblx0XHRsZXQgdG1wID0gZ2RhdGEuYmxvY2tzLnJlZHVjZSgobmJzLCBiLCBpKSA9PiB7XG5cdFx0ICAgIGlmIChpID09PSAwIHx8IG5ic1tuYnMubGVuZ3RoIC0gMV1bMF0uY2hyICE9PSBiLmNocilcblx0XHRcdG5icy5wdXNoKFtiXSk7XG5cdFx0ICAgIGVsc2Vcblx0XHRcdG5ic1tuYnMubGVuZ3RoIC0gMV0ucHVzaChiKTtcblx0XHQgICAgcmV0dXJuIG5icztcblx0XHR9LCBbXSk7XG5cdFx0Ly8gU29ydCBlYWNoIHN1Ymdyb3VwIGludG8gY29tcGFyaXNvbiBnZW5vbWUgb3JkZXJcblx0XHR0bXAuZm9yRWFjaCggc3ViZ3JwID0+IHN1YmdycC5zb3J0KChhLGIpID0+IGEuaW5kZXggLSBiLmluZGV4KSApO1xuXHRcdC8vIEZsYXR0ZW4gdGhlIGxpc3Rcblx0XHR0bXAgPSB0bXAucmVkdWNlKChsc3QsIGN1cnIpID0+IGxzdC5jb25jYXQoY3VyciksIFtdKTtcblx0XHQvLyBOb3cgY3JlYXRlIHRoZSBzdXBlcmdyb3Vwcy5cblx0XHRnZGF0YS5ibG9ja3MgPSB0bXAucmVkdWNlKG1lcmdlcixbXSk7XG5cdCAgICB9XG5cdH0pO1xuXHRyZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvL1xuICAgIHVuaXFpZnlCbG9ja3MgKGJsb2Nrcykge1xuXHQvLyBoZWxwZXIgZnVuY3Rpb24uIFdoZW4gc2Jsb2NrIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIGdlbm9tZXMgaXMgY29uZnVzZWQsIHJlcXVlc3Rpbmcgb25lXG5cdC8vIHJlZ2lvbiBpbiBnZW5vbWUgQSBjYW4gZW5kIHVwIHJlcXVlc3RpbmcgdGhlIHNhbWUgcmVnaW9uIGluIGdlbm9tZSBCIG11bHRpcGxlIHRpbWVzLlxuXHQvLyBUaGlzIGZ1bmN0aW9uIGF2b2lkcyBkcmF3aW5nIHRoZSBzYW1lIHNibG9jayB0d2ljZS4gKE5COiBSZWFsbHkgbm90IHN1cmUgd2hlcmUgdGhpcyBcblx0Ly8gY2hlY2sgaXMgYmVzdCBkb25lLiBDb3VsZCBwdXNoIGl0IGZhcnRoZXIgdXBzdHJlYW0uKVxuXHRsZXQgc2VlbiA9IG5ldyBTZXQoKTtcblx0cmV0dXJuIGJsb2Nrcy5maWx0ZXIoIGIgPT4geyBcblx0ICAgIGlmIChzZWVuLmhhcyhiLmluZGV4KSkgcmV0dXJuIGZhbHNlO1xuXHQgICAgc2Vlbi5hZGQoYi5pbmRleCk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fSk7XG4gICAgfTtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBBcHBsaWVzIHNldmVyYWwgdHJhbnNmb3JtYXRpb24gc3RlcHMgb24gdGhlIGRhdGEgYXMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlciB0byBwcmVwYXJlIGZvciBkcmF3aW5nLlxuICAgIC8vIElucHV0IGRhdGEgaXMgc3RydWN0dXJlZCBhcyBmb2xsb3dzOlxuICAgIC8vICAgICBkYXRhID0gWyB6b29tU3RyaXBfZGF0YSBdXG4gICAgLy8gICAgIHpvb21TdHJpcF9kYXRhID0geyBnZW5vbWUgWyB6b29tQmxvY2tfZGF0YSBdIH1cbiAgICAvLyAgICAgem9vbUJsb2NrX2RhdGEgPSB7IHhzY2FsZSwgY2hyLCBzdGFydCwgZW5kLCBpbmRleCwgZkNociwgZlN0YXJ0LCBmRW5kLCBmSW5kZXgsIG9yaSwgWyBmZWF0dXJlX2RhdGEgXSB9XG4gICAgLy8gICAgIGZlYXR1cmVfZGF0YSA9IHsgSUQsIGNhbm9uaWNhbCwgc3ltYm9sLCBjaHIsIHN0YXJ0LCBlbmQsIHN0cmFuZCwgdHlwZSwgYmlvdHlwZSB9XG4gICAgLy9cbiAgICAvLyBBZ2FpbiwgaW4gRW5nbGlzaDpcbiAgICAvLyAgLSBkYXRhIGlzIGEgbGlzdCBvZiBpdGVtcywgb25lIHBlciBzdHJpcCB0byBiZSBkaXNwbGF5ZWQuIEl0ZW1bMF0gaXMgZGF0YSBmb3IgdGhlIHJlZiBnZW5vbWUuXG4gICAgLy8gICAgSXRlbXNbMStdIGFyZSBkYXRhIGZvciB0aGUgY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy8gIC0gZWFjaCBzdHJpcCBpdGVtIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGEgZ2Vub21lIGFuZCBhIGxpc3Qgb2YgYmxvY2tzLiBJdGVtWzBdIGFsd2F5cyBoYXMgXG4gICAgLy8gICAgYSBzaW5nbGUgYmxvY2suXG4gICAgLy8gIC0gZWFjaCBibG9jayBpcyBhbiBvYmplY3QgY29udGFpbmluZyBhIGNocm9tb3NvbWUsIHN0YXJ0LCBlbmQsIG9yaWVudGF0aW9uLCBldGMsIGFuZCBhIGxpc3Qgb2YgZmVhdHVyZXMuXG4gICAgLy8gIC0gZWFjaCBmZWF0dXJlIGhhcyBjaHIsc3RhcnQsZW5kLHN0cmFuZCx0eXBlLGJpb3R5cGUsSURcbiAgICAvL1xuICAgIC8vIEJlY2F1c2UgU0Jsb2NrcyBjYW4gYmUgdmVyeSBmcmFnbWVudGVkLCBvbmUgY29udGlndW91cyByZWdpb24gaW4gdGhlIHJlZiBnZW5vbWUgY2FuIHR1cm4gaW50byBcbiAgICAvLyBhIGJhemlsbGlvbiB0aW55IGJsb2NrcyBpbiB0aGUgY29tcGFyaXNvbi4gVGhlIHJlc3VsdGluZyByZW5kZXJpbmcgaXMgamFycmluZyBhbmQgdW51c2FibGUuXG4gICAgLy8gVGhlIGRyYXdpbmcgcm91dGluZSBtb2RpZmllcyB0aGUgZGF0YSBieSBtZXJnaW5nIHJ1bnMgb2YgY29uc2VjdXRpdmUgYmxvY2tzIGluIGVhY2ggY29tcCBnZW5vbWUuXG4gICAgLy8gVGhlIGRhdGEgY2hhbmdlIGlzIHRvIGluc2VydCBhIGdyb3VwaW5nIGxheWVyIG9uIHRvcCBvZiB0aGUgc2Jsb2Nrcywgc3BlY2lmaWNhbGx5LCBcbiAgICAvLyAgICAgem9vbVN0cmlwX2RhdGEgPSB7IGdlbm9tZSBbIHpvb21CbG9ja19kYXRhIF0gfVxuICAgIC8vIGJlY29tZXNcbiAgICAvLyAgICAgem9vbVN0cmlwX2RhdGEgPSB7IGdlbm9tZSBbIHpvb21TdXBlckJsb2NrX2RhdGEgXSB9XG4gICAgLy8gICAgIHpvb21TdXBlckJsb2NrX2RhdGEgPSB7IGNociBzdGFydCBlbmQgYmxvY2tzIFsgem9vbUJsb2NrX2RhdGEgXSB9XG4gICAgLy9cbiAgICBtdW5nZURhdGEgKGRhdGEpIHtcbiAgICAgICAgZGF0YS5mb3JFYWNoKGdEYXRhID0+IHtcblx0ICAgIGdEYXRhLmJsb2NrcyA9IHRoaXMudW5pcWlmeUJsb2NrcyhnRGF0YS5ibG9ja3MpXG5cdCAgICAvLyBFYWNoIHN0cmlwIGlzIGluZGVwZW5kZW50bHkgc2Nyb2xsYWJsZS4gSW5pdCBpdHMgb2Zmc2V0IChpbiBieXRlcykuXG5cdCAgICBnRGF0YS5kZWx0YUIgPSAwO1xuXHQgICAgLy8gRWFjaCBzdHJpcCBpcyBpbmRlcGVuZGVudGx5IHNjYWxhYmxlLiBJbml0IHNjYWxlLlxuXHQgICAgZ0RhdGEueFNjYWxlID0gMS4wO1xuXHR9KTtcblx0ZGF0YSA9IHRoaXMubWVyZ2VTYmxvY2tSdW5zKGRhdGEpO1xuXHQvLyBcblx0ZGF0YS5mb3JFYWNoKCBnRGF0YSA9PiB7XG5cdCAgLy8gbWluaW11bSBvZiAzIGxhbmVzIG9uIGVhY2ggc2lkZVxuXHQgIGdEYXRhLm1heExhbmVzUCA9IDM7XG5cdCAgZ0RhdGEubWF4TGFuZXNOID0gMztcblx0ICBnRGF0YS5ibG9ja3MuZm9yRWFjaCggc2I9PiB7XG5cdCAgICBzYi5mZWF0dXJlcy5mb3JFYWNoKGYgPT4ge1xuXHRcdGlmIChmLmxhbmUgPiAwKVxuXHRcdCAgICBnRGF0YS5tYXhMYW5lc1AgPSBNYXRoLm1heChnRGF0YS5tYXhMYW5lc1AsIGYubGFuZSlcblx0XHRlbHNlXG5cdFx0ICAgIGdEYXRhLm1heExhbmVzTiA9IE1hdGgubWF4KGdEYXRhLm1heExhbmVzTiwgLWYubGFuZSlcblx0ICAgIH0pO1xuXHQgIH0pO1xuXHQgIGlmIChnRGF0YS5ibG9ja3MubGVuZ3RoID4gMSlcblx0ICAgICAgZ0RhdGEuYmxvY2tzID0gZ0RhdGEuYmxvY2tzLmZpbHRlcihiPT5iLmZlYXR1cmVzLmxlbmd0aCA+IDApO1xuXHQgIGdEYXRhLnN0cmlwSGVpZ2h0ID0gMTUgKyB0aGlzLmNmZy5sYW5lSGVpZ2h0ICogKGdEYXRhLm1heExhbmVzUCArIGdEYXRhLm1heExhbmVzTik7XG5cdCAgZ0RhdGEuemVyb09mZnNldCA9IHRoaXMuY2ZnLmxhbmVIZWlnaHQgKiBnRGF0YS5tYXhMYW5lc1A7XG5cdH0pO1xuXHRyZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBPcmRlcnMgc2Jsb2NrcyBob3Jpem9udGFsbHkgd2l0aGluIGVhY2ggZ2Vub21lLiBUcmFuc2xhdGVzIHRoZW0gaW50byBwb3NpdGlvbi5cbiAgICAvL1xuICAgIGxheW91dFNCbG9ja3MgKHNibG9ja3MpIHtcblx0Ly8gU29ydCB0aGUgc2Jsb2NrcyBpbiBlYWNoIHN0cmlwIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBkcmF3aW5nIG1vZGUuXG5cdGxldCBjbXBGaWVsZCA9IHRoaXMuZG1vZGUgPT09ICdjb21wYXJpc29uJyA/ICdpbmRleCcgOiAnZkluZGV4Jztcblx0bGV0IGNtcEZ1bmMgPSAoYSxiKSA9PiBhLl9fZGF0YV9fW2NtcEZpZWxkXS1iLl9fZGF0YV9fW2NtcEZpZWxkXTtcblx0c2Jsb2Nrcy5mb3JFYWNoKCBzdHJpcCA9PiBzdHJpcC5zb3J0KCBjbXBGdW5jICkgKTtcblx0bGV0IHBzdGFydCA9IFtdOyAvLyBvZmZzZXQgKGluIHBpeGVscykgb2Ygc3RhcnQgcG9zaXRpb24gb2YgbmV4dCBibG9jaywgYnkgc3RyaXAgaW5kZXggKDA9PT1yZWYpXG5cdGxldCBic3RhcnQgPSBbXTsgLy8gYmxvY2sgc3RhcnQgcG9zIChpbiBicCkgYXNzb2Mgd2l0aCBwc3RhcnRcblx0bGV0IGNjaHIgPSBudWxsO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdGxldCBHQVAgID0gMTY7ICAgLy8gbGVuZ3RoIG9mIGdhcCBiZXR3ZWVuIGJsb2NrcyBvZiBkaWZmIGNocm9tcy5cblx0bGV0IGR4O1xuXHRsZXQgcGVuZDtcblx0c2Jsb2Nrcy5lYWNoKCBmdW5jdGlvbiAoYixpLGopIHsgLy8gYj1ibG9jaywgaT1pbmRleCB3aXRoaW4gc3RyaXAsIGo9c3RyaXAgaW5kZXhcblx0ICAgIGxldCBnZCA9IHRoaXMuX19kYXRhX18uZ2Vub21lO1xuXHQgICAgbGV0IGJsZW4gPSBzZWxmLnBwYiAqIChiLmVuZCAtIGIuc3RhcnQgKyAxKTsgLy8gdG90YWwgc2NyZWVuIHdpZHRoIG9mIHRoaXMgc2Jsb2NrXG5cdCAgICBiLmZsaXAgPSBiLm9yaSA9PT0gJy0nICYmIHNlbGYuZG1vZGUgPT09ICdyZWZlcmVuY2UnO1xuXHQgICAgYi54c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oW2Iuc3RhcnQsIGIuZW5kXSkucmFuZ2UoIGIuZmxpcCA/IFtibGVuLCAwXSA6IFswLCBibGVuXSApO1xuXHQgICAgLy9cblx0ICAgIGlmIChpPT09MCkge1xuXHRcdC8vIGZpcnN0IGJsb2NrIGluIGVhY2ggc3RyaXAgaW5pdHNcblx0XHRwc3RhcnRbal0gPSAwO1xuXHRcdGdkLnB3aWR0aCA9IGJsZW47XG5cdFx0YnN0YXJ0W2pdID0gYi5zdGFydDtcblx0XHRkeCA9IDA7XG5cdFx0Y2NociA9IGIuY2hyO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0Z2QucHdpZHRoICs9IGJsZW47XG5cdFx0ZHggPSBiLmNociA9PT0gY2NociA/IHBzdGFydFtqXSArIHNlbGYucHBiICogKGIuc3RhcnQgLSBic3RhcnRbal0pIDogSW5maW5pdHk7XG5cdFx0aWYgKGR4IDwgMCB8fCBkeCA+IHNlbGYuY2ZnLm1heFNCZ2FwKSB7XG5cdFx0ICAgIC8vIENoYW5nZWQgY2hyIG9yIGp1bXBlZCBhIGxhcmdlIGdhcFxuXHRcdCAgICBwc3RhcnRbal0gPSBwZW5kICsgR0FQO1xuXHRcdCAgICBic3RhcnRbal0gPSBiLnN0YXJ0O1xuXHRcdCAgICBnZC5wd2lkdGggKz0gR0FQO1xuXHRcdCAgICBkeCA9IHBzdGFydFtqXTtcblx0XHQgICAgY2NociA9IGIuY2hyO1xuXHRcdH1cblx0ICAgIH1cblx0ICAgIHBlbmQgPSBkeCArIGJsZW47XG5cdCAgICBkMy5zZWxlY3QodGhpcykuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke2R4fSwwKWApO1xuXHR9KTtcblx0dGhpcy5zcXVpc2goKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTY2FsZXMgZWFjaCB6b29tIHN0cmlwIGhvcml6b250YWxseSB0byBmaXQgdGhlIHdpZHRoLiBPbmx5IHNjYWxlcyBkb3duLlxuICAgIHNxdWlzaCAoKSB7XG4gICAgICAgIGxldCBzYnMgPSBkMy5zZWxlY3RBbGwoJy56b29tU3RyaXAgW25hbWU9XCJzQmxvY2tzXCJdJyk7XG5cdGxldCBzZWxmID0gdGhpcztcblx0c2JzLmVhY2goZnVuY3Rpb24gKHNiLGkpIHtcblx0ICAgIGlmIChzYi5nZW5vbWUucHdpZHRoID4gc2VsZi53aWR0aCkge1xuXHQgICAgICAgIGxldCBzID0gc2VsZi53aWR0aCAvIHNiLmdlbm9tZS5wd2lkdGg7XG5cdFx0c2IueFNjYWxlID0gcztcblx0XHRsZXQgdCA9IGQzLnNlbGVjdCh0aGlzKTtcblx0XHR0LmF0dHIoJ3RyYW5zZm9ybScsICgpPT4gYHRyYW5zbGF0ZSgkey1zYi5kZWx0YUIgKiBzZWxmLnBwYn0sMClzY2FsZSgke3NiLnhTY2FsZX0sMSlgKTtcblx0ICAgIH1cblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSB6b29tIHZpZXcgcGFuZWwgd2l0aCB0aGUgZ2l2ZW4gZGF0YS5cbiAgICAvL1xuICAgIGRyYXcgKGRhdGEpIHtcblx0Ly9cblx0dGhpcy5kcmF3Q291bnQgKz0gMTtcblx0Y29uc29sZS5sb2coJ0RyYXcnLCB0aGlzLmRyYXdDb3VudCwgbmV3IERhdGUoKSk7XG5cdC8vIFxuXHRsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIElzIFpvb21WaWV3IGN1cnJlbnRseSBjbG9zZWQ/XG5cdGxldCBjbG9zZWQgPSB0aGlzLnJvb3QuY2xhc3NlZCgnY2xvc2VkJyk7XG5cdC8vIFNob3cgcmVmIGdlbm9tZSBuYW1lXG5cdGQzLnNlbGVjdCgnI3pvb21WaWV3IC56b29tQ29vcmRzIGxhYmVsJylcblx0ICAgIC50ZXh0KHRoaXMuYXBwLnJHZW5vbWUubGFiZWwgKyAnIGNvb3JkcycpO1xuXHQvLyBTaG93IGxhbmRtYXJrIGxhYmVsLCBpZiBhcHBsaWNhYmxlXG5cdGxldCBsbXR4dCA9ICcnO1xuXHRpZiAodGhpcy5jbW9kZSA9PT0gJ2xhbmRtYXJrJykge1xuXHQgICAgbGV0IHJmID0gdGhpcy5hcHAubGNvb3Jkcy5sYW5kbWFya1JlZkZlYXQ7XG5cdCAgICBsZXQgZCA9IHRoaXMuYXBwLmxjb29yZHMuZGVsdGE7XG5cdCAgICBsZXQgZHR4dCA9IGQgPyBgICgke2QgPiAwID8gJysnIDogJyd9JHtwcmV0dHlQcmludEJhc2VzKGQpfSlgIDogJyc7XG5cdCAgICBsbXR4dCA9IGBBbGlnbmVkIG9uICR7cmYuc3ltYm9sIHx8IHJmLmlkfSR7ZHR4dH1gO1xuXHR9XG5cdC8vIGRpc2FibGUgdGhlIFIvQyBidXR0b24gaW4gbGFuZG1hcmsgbW9kZVxuXHR0aGlzLnJvb3Quc2VsZWN0QWxsKCdbbmFtZT1cInpvb21jb250cm9sc1wiXSBbbmFtZT1cInpvb21EbW9kZVwiXSAuYnV0dG9uJylcblx0ICAgIC5hdHRyKCdkaXNhYmxlZCcsIHRoaXMuY21vZGUgPT09ICdsYW5kbWFyaycgfHwgbnVsbCk7XG5cdC8vIGRpc3BsYXkgbGFuZG1hcmsgdGV4dFxuXHRkMy5zZWxlY3QoJyN6b29tVmlldyAuem9vbUNvb3JkcyBzcGFuJykudGV4dCggbG10eHQgKTtcblx0XG5cdC8vIHRoZSByZWZlcmVuY2UgZ2Vub21lIGJsb2NrIChhbHdheXMganVzdCAxIG9mIHRoZXNlKS5cblx0bGV0IHJEYXRhID0gZGF0YS5maWx0ZXIoZGQgPT4gZGQuZ2Vub21lID09PSB0aGlzLmFwcC5yR2Vub21lKVswXTtcblx0bGV0IHJCbG9jayA9IHJEYXRhLmJsb2Nrc1swXTtcblxuXHQvLyB4LXNjYWxlIGFuZCB4LWF4aXMgYmFzZWQgb24gdGhlIHJlZiBnZW5vbWUuXG5cdHRoaXMueHNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0ICAgIC5kb21haW4oW3JCbG9jay5zdGFydCxyQmxvY2suZW5kXSlcblx0ICAgIC5yYW5nZShbMCx0aGlzLndpZHRoXSk7XG5cdC8vXG5cdC8vIHBpeGVscyBwZXIgYmFzZVxuXHR0aGlzLnBwYiA9IHRoaXMud2lkdGggLyAodGhpcy5hcHAuY29vcmRzLmVuZCAtIHRoaXMuYXBwLmNvb3Jkcy5zdGFydCArIDEpO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIGRyYXcgdGhlIGNvb3JkaW5hdGUgYXhpc1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHR0aGlzLmF4aXNGdW5jID0gZDMuc3ZnLmF4aXMoKVxuXHQgICAgLnNjYWxlKHRoaXMueHNjYWxlKVxuXHQgICAgLm9yaWVudCgndG9wJylcblx0ICAgIC5vdXRlclRpY2tTaXplKDIpXG5cdCAgICAudGlja3MoNSlcblx0ICAgIC50aWNrU2l6ZSg1KVxuXHQgICAgO1xuXHR0aGlzLmF4aXMuY2FsbCh0aGlzLmF4aXNGdW5jKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyB6b29tIHN0cmlwcyAob25lIHBlciBnZW5vbWUpXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGxldCB6c3RyaXBzID0gdGhpcy5zdHJpcHNHcnBcblx0ICAgICAgICAuc2VsZWN0QWxsKCdnLnpvb21TdHJpcCcpXG5cdFx0LmRhdGEoZGF0YSwgZCA9PiBkLmdlbm9tZS5uYW1lKTtcblx0Ly8gQ3JlYXRlIHRoZSBncm91cFxuXHRsZXQgbmV3enMgPSB6c3RyaXBzLmVudGVyKClcblx0ICAgICAgICAuYXBwZW5kKCdnJylcblx0XHQuYXR0cignY2xhc3MnLCd6b29tU3RyaXAnKVxuXHRcdC5hdHRyKCduYW1lJywgZCA9PiBkLmdlbm9tZS5uYW1lKVxuXHRcdC5vbignY2xpY2snLCBmdW5jdGlvbiAoZykge1xuXHRcdCAgICBzZWxmLmhpZ2hsaWdodFN0cmlwKGcuZ2Vub21lLCB0aGlzKTtcblx0XHR9KVxuXHRcdC5jYWxsKHRoaXMuZHJhZ2dlcilcblx0XHQ7XG5cdC8vXG5cdC8vIFN0cmlwIGxhYmVsXG5cdG5ld3pzLmFwcGVuZCgndGV4dCcpXG5cdCAgICAuYXR0cignbmFtZScsICdnZW5vbWVMYWJlbCcpXG5cdCAgICAudGV4dCggZCA9PiBkLmdlbm9tZS5sYWJlbClcblx0ICAgIC5hdHRyKCd4JywgMClcblx0ICAgIC5hdHRyKCd5JywgdGhpcy5jZmcuYmxvY2tIZWlnaHQvMiArIDIwKVxuXHQgICAgLmF0dHIoJ2ZvbnQtZmFtaWx5Jywnc2Fucy1zZXJpZicpXG5cdCAgICAuYXR0cignZm9udC1zaXplJywgMTApXG5cdCAgICA7XG5cdC8vIFN0cmlwIHVuZGVybGF5XG5cdG5ld3pzLmFwcGVuZCgncmVjdCcpXG5cdCAgICAuYXR0cignY2xhc3MnLCd1bmRlcmxheScpXG5cdCAgICAuc3R5bGUoJ3dpZHRoJywnMTAwJScpXG5cdCAgICAuc3R5bGUoJ29wYWNpdHknLDApXG5cdCAgICA7XG5cdCAgICBcblx0Ly8gR3JvdXAgZm9yIHNCbG9ja3Ncblx0bmV3enMuYXBwZW5kKCdnJylcblx0ICAgIC5hdHRyKCduYW1lJywgJ3NCbG9ja3MnKTtcblx0Ly8gU3RyaXAgZW5kIGNhcFxuXHRuZXd6cy5hcHBlbmQoJ3JlY3QnKVxuXHQgICAgLmF0dHIoJ2NsYXNzJywgJ21hdGVyaWFsLWljb25zIHpvb21TdHJpcEVuZENhcCcpXG5cdCAgICAuYXR0cigneCcsIC0xNSlcblx0ICAgIC5hdHRyKCd5JywgLXRoaXMuY2ZnLmJsb2NrSGVpZ2h0IC8gMilcblx0ICAgIC5hdHRyKCd3aWR0aCcsIDE1KVxuXHQgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuY2ZnLmJsb2NrSGVpZ2h0ICsgMTApXG5cdCAgICA7XG5cdC8vIFN0cmlwIGRyYWctaGFuZGxlXG5cdG5ld3pzLmFwcGVuZCgndGV4dCcpXG5cdCAgICAuYXR0cignY2xhc3MnLCAnbWF0ZXJpYWwtaWNvbnMgem9vbVN0cmlwSGFuZGxlJylcblx0ICAgIC5zdHlsZSgnZm9udC1zaXplJywgJzE4cHgnKVxuXHQgICAgLmF0dHIoJ3gnLCAtMTUpXG5cdCAgICAuYXR0cigneScsIDkpXG5cdCAgICAudGV4dCgnZHJhZ19pbmRpY2F0b3InKVxuXHQgICAgLmFwcGVuZCgndGl0bGUnKVxuXHQgICAgICAgIC50ZXh0KCdEcmFnIHVwL2Rvd24gdG8gcmVvcmRlciB0aGUgZ2Vub21lcy4nKVxuXHQgICAgO1xuXHQvLyBVcGRhdGVzXG5cdHpzdHJpcHMuc2VsZWN0KCcuem9vbVN0cmlwRW5kQ2FwJylcblx0ICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmNmZy5ibG9ja0hlaWdodCArIDEwKVxuXHQgICAgLmF0dHIoJ3knLCAtdGhpcy5jZmcuYmxvY2tIZWlnaHQgLyAyKVxuXHQgICAgO1xuXHR6c3RyaXBzLnNlbGVjdCgnW25hbWU9XCJnZW5vbWVMYWJlbFwiXScpXG5cdCAgICAuYXR0cigneScsIHRoaXMuY2ZnLmJsb2NrSGVpZ2h0LzIgKyAyMClcblx0ICAgIDtcblx0enN0cmlwcy5zZWxlY3QoJy51bmRlcmxheScpXG5cdCAgICAuYXR0cigneScsIC10aGlzLmNmZy5ibG9ja0hlaWdodC8yKVxuXHQgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuY2ZnLmJsb2NrSGVpZ2h0KVxuXHQgICAgO1xuXHQgICAgXG5cdC8vIHRyYW5zbGF0ZSBzdHJpcHMgaW50byBwb3NpdGlvblxuXHRsZXQgb2Zmc2V0ID0gdGhpcy5jZmcudG9wT2Zmc2V0O1xuXHRsZXQgckhlaWdodCA9IDA7XG5cdHRoaXMuYXBwLnZHZW5vbWVzLmZvckVhY2goIHZnID0+IHtcblx0ICAgIGxldCBzID0gdGhpcy5zdHJpcHNHcnAuc2VsZWN0KGAuem9vbVN0cmlwW25hbWU9XCIke3ZnLm5hbWV9XCJdYCk7XG5cdCAgICBzLmNsYXNzZWQoJ3JlZmVyZW5jZScsIGQgPT4gZC5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpXG5cdCAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGQgPT4ge1xuXHRcdCAgICAvL3JldHVybiBgdHJhbnNsYXRlKDAsJHtjbG9zZWQgPyB0aGlzLmNmZy50b3BPZmZzZXQgOiBnLmdlbm9tZS56b29tWX0pYFxuXHRcdCAgICBpZiAoZC5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpXG5cdFx0ICAgICAgICBySGVpZ2h0ID0gZC5zdHJpcEhlaWdodCArIGQuemVyb09mZnNldDtcblx0XHQgICAgbGV0IG8gPSBvZmZzZXQgKyBkLnplcm9PZmZzZXQ7XG5cdFx0ICAgIGQuem9vbVkgPSBvZmZzZXQ7XG5cdFx0ICAgIG9mZnNldCArPSBkLnN0cmlwSGVpZ2h0ICsgdGhpcy5jZmcuc3RyaXBHYXA7XG5cdFx0ICAgIHJldHVybiBgdHJhbnNsYXRlKDAsJHtjbG9zZWQgPyB0aGlzLmNmZy50b3BPZmZzZXQrZC56ZXJvT2Zmc2V0IDogb30pYFxuXHRcdH0pO1xuXHR9KTtcblx0Ly8gcmVzZXQgdGhlIHN2ZyBzaXplIGJhc2VkIG9uIHN0cmlwIHdpZHRoc1xuXHR0aGlzLnN2Zy5hdHRyKCdoZWlnaHQnLCAoY2xvc2VkID8gckhlaWdodCA6IG9mZnNldCkgKyAxNSk7XG5cbiAgICAgICAgenN0cmlwcy5leGl0KClcblx0ICAgIC5vbignLmRyYWcnLCBudWxsKVxuXHQgICAgLnJlbW92ZSgpO1xuXHQvL1xuICAgICAgICB6c3RyaXBzLnNlbGVjdCgnZ1tuYW1lPVwic0Jsb2Nrc1wiXScpXG5cdCAgICAuYXR0cigndHJhbnNmb3JtJywgZyA9PiBgdHJhbnNsYXRlKCR7Zy5kZWx0YUIgKiB0aGlzLnBwYn0sMClgKVxuXHQgICAgO1xuXHQvLyAtLS0tIFN5bnRlbnkgc3VwZXIgYmxvY2tzIC0tLS1cbiAgICAgICAgbGV0IHNibG9ja3MgPSB6c3RyaXBzLnNlbGVjdCgnW25hbWU9XCJzQmxvY2tzXCJdJykuc2VsZWN0QWxsKCdnLnNCbG9jaycpXG5cdCAgICAuZGF0YShkPT5kLmJsb2NrcywgYiA9PiBiLmJsb2NrSWQpO1xuXHRsZXQgbmV3c2JzID0gc2Jsb2Nrcy5lbnRlcigpXG5cdCAgICAuYXBwZW5kKCdnJylcblx0ICAgIC5hdHRyKCdjbGFzcycsICdzQmxvY2snKVxuXHQgICAgLmF0dHIoJ25hbWUnLCBiPT5iLmluZGV4KVxuXHQgICAgO1xuXHRsZXQgbDAgPSBuZXdzYnMuYXBwZW5kKCdnJykuYXR0cignbmFtZScsICdsYXllcjAnKTtcblx0bGV0IGwxID0gbmV3c2JzLmFwcGVuZCgnZycpLmF0dHIoJ25hbWUnLCAnbGF5ZXIxJyk7XG5cblx0Ly9cblx0dGhpcy5sYXlvdXRTQmxvY2tzKHNibG9ja3MpO1xuXG5cdC8vIHJlY3RhbmdsZSBmb3IgZWFjaCBpbmRpdmlkdWFsIHN5bnRlbnkgYmxvY2tcblx0bGV0IHNicmVjdHMgPSBzYmxvY2tzLnNlbGVjdCgnZ1tuYW1lPVwibGF5ZXIwXCJdJykuc2VsZWN0QWxsKCdyZWN0LmJsb2NrJykuZGF0YShkPT4ge1xuXHQgICAgZC5zYmxvY2tzLmZvckVhY2goYj0+Yi54c2NhbGUgPSBkLnhzY2FsZSk7XG5cdCAgICByZXR1cm4gZC5zYmxvY2tzXG5cdCAgICB9LCBzYj0+c2IuaW5kZXgpO1xuICAgICAgICBzYnJlY3RzLmVudGVyKCkuYXBwZW5kKCdyZWN0JykuYXBwZW5kKCd0aXRsZScpO1xuXHRzYnJlY3RzLmV4aXQoKS5yZW1vdmUoKTtcblx0c2JyZWN0c1xuXHQgICAuYXR0cignY2xhc3MnLCBiID0+ICdibG9jayAnICsgXG5cdCAgICAgICAoYi5vcmk9PT0nKycgPyAncGx1cycgOiBiLm9yaT09PSctJyA/ICdtaW51cyc6ICdjb25mdXNlZCcpICsgXG5cdCAgICAgICAoYi5jaHIgIT09IGIuZkNociA/ICcgdHJhbnNsb2NhdGlvbicgOiAnJykpXG5cdCAgIC5hdHRyKCd4JywgICAgIGIgPT4gYi54c2NhbGUoYi5mbGlwID8gYi5lbmQgOiBiLnN0YXJ0KSlcblx0ICAgLmF0dHIoJ3knLCAgICAgYiA9PiAtdGhpcy5jZmcuYmxvY2tIZWlnaHQgLyAyKVxuXHQgICAuYXR0cignd2lkdGgnLCBiID0+IE1hdGgubWF4KDQsIE1hdGguYWJzKGIueHNjYWxlKGIuZW5kKS1iLnhzY2FsZShiLnN0YXJ0KSkpKVxuXHQgICAuYXR0cignaGVpZ2h0Jyx0aGlzLmNmZy5ibG9ja0hlaWdodCk7XG5cdCAgIDtcblx0c2JyZWN0cy5zZWxlY3QoJ3RpdGxlJylcblx0ICAgLnRleHQoIGIgPT4ge1xuXHQgICAgICAgbGV0IGFkamVjdGl2ZXMgPSBbXTtcblx0ICAgICAgIGIub3JpID09PSAnLScgJiYgYWRqZWN0aXZlcy5wdXNoKCdpbnZlcnRlZCcpO1xuXHQgICAgICAgYi5jaHIgIT09IGIuZkNociAmJiBhZGplY3RpdmVzLnB1c2goJ3RyYW5zbG9jYXRlZCcpO1xuXHQgICAgICAgcmV0dXJuIGFkamVjdGl2ZXMubGVuZ3RoID8gYWRqZWN0aXZlcy5qb2luKCcsICcpICsgJyBibG9jaycgOiAnJztcblx0ICAgfSk7XG5cblx0Ly8gdGhlIGF4aXMgbGluZVxuXHRsMC5hcHBlbmQoJ2xpbmUnKS5hdHRyKCdjbGFzcycsJ2F4aXMnKTtcblx0XG5cdHNibG9ja3Muc2VsZWN0KCdsaW5lLmF4aXMnKVxuXHQgICAgLmF0dHIoJ3gxJywgYiA9PiBiLnhzY2FsZShiLnN0YXJ0KSlcblx0ICAgIC5hdHRyKCd5MScsIDApXG5cdCAgICAuYXR0cigneDInLCBiID0+IGIueHNjYWxlKGIuZW5kKSlcblx0ICAgIC5hdHRyKCd5MicsIDApXG5cdCAgICA7XG5cdC8vIGxhYmVsXG5cdGwwLmFwcGVuZCgndGV4dCcpXG5cdCAgICAuYXR0cignY2xhc3MnLCdibG9ja0xhYmVsJykgO1xuXHQvLyBicnVzaFxuXHRsMC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsJ2JydXNoJyk7XG5cdC8vXG5cdHNibG9ja3MuZXhpdCgpLnJlbW92ZSgpO1xuXG5cdC8vIHN5bnRlbnkgYmxvY2sgbGFiZWxzXG5cdHNibG9ja3Muc2VsZWN0KCd0ZXh0LmJsb2NrTGFiZWwnKVxuXHQgICAgLnRleHQoIGIgPT4gYi5jaHIgKVxuXHQgICAgLmF0dHIoJ3gnLCBiID0+IChiLnhzY2FsZShiLnN0YXJ0KSArIGIueHNjYWxlKGIuZW5kKSkvMiApXG5cdCAgICAuYXR0cigneScsIHRoaXMuY2ZnLmJsb2NrSGVpZ2h0IC8gMiArIDEwKVxuXHQgICAgO1xuXG5cdC8vIGJydXNoXG5cdHNibG9ja3Muc2VsZWN0KCdnLmJydXNoJylcblx0ICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBiID0+IGB0cmFuc2xhdGUoMCwke3RoaXMuY2ZnLmJsb2NrSGVpZ2h0IC8gMn0pYClcblx0ICAgIC5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oYikge1xuXHQgICAgICAgIGxldCBjciA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0bGV0IHggPSBkMy5ldmVudC5jbGllbnRYIC0gY3IueDtcblx0XHRsZXQgYyA9IE1hdGgucm91bmQoYi54c2NhbGUuaW52ZXJ0KHgpKTtcblx0XHRzZWxmLnNob3dGbG9hdGluZ1RleHQoYCR7Yi5jaHJ9OiR7Y31gLCBkMy5ldmVudC5jbGllbnRYLCBkMy5ldmVudC5jbGllbnRZKTtcblx0ICAgIH0pXG5cdCAgICAub24oJ21vdXNlb3V0JywgYiA9PiB0aGlzLmhpZGVGbG9hdGluZ1RleHQoKSlcblx0ICAgIC5lYWNoKGZ1bmN0aW9uKGIpIHtcblx0XHRpZiAoIWIuYnJ1c2gpIHtcblx0XHQgICAgYi5icnVzaCA9IGQzLnN2Zy5icnVzaCgpXG5cdFx0XHQub24oJ2JydXNoc3RhcnQnLCBmdW5jdGlvbigpeyBzZWxmLmJiU3RhcnQoIGIsIHRoaXMgKTsgfSlcblx0XHRcdC5vbignYnJ1c2gnLCAgICAgIGZ1bmN0aW9uKCl7IHNlbGYuYmJCcnVzaCggYiwgdGhpcyApOyB9KVxuXHRcdFx0Lm9uKCdicnVzaGVuZCcsICAgZnVuY3Rpb24oKXsgc2VsZi5iYkVuZCggYiwgdGhpcyApOyB9KVxuXHRcdH1cblx0XHRiLmJydXNoLngoYi54c2NhbGUpLmNsZWFyKCk7XG5cdFx0ZDMuc2VsZWN0KHRoaXMpLmNhbGwoYi5icnVzaCk7XG5cdCAgICB9KVxuXHQgICAgLnNlbGVjdEFsbCgncmVjdCcpXG5cdFx0LmF0dHIoJ2hlaWdodCcsIDEwKTtcblxuXHR0aGlzLmRyYXdGZWF0dXJlcyhzYmxvY2tzKTtcblxuXHQvL1xuXHR0aGlzLmFwcC5mYWNldE1hbmFnZXIuYXBwbHlBbGwoKTtcblxuXHQvLyBXZSBuZWVkIHRvIGxldCB0aGUgdmlldyByZW5kZXIgYmVmb3JlIGRvaW5nIHRoZSBoaWdobGlnaHRpbmcsIHNpbmNlIGl0IGRlcGVuZHMgb25cblx0Ly8gdGhlIHBvc2l0aW9ucyBvZiByZWN0YW5nbGVzIGluIHRoZSBzY2VuZS5cblx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuXHQgICAgdGhpcy5oaWdobGlnaHQoKTtcblx0ICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcblx0XHR0aGlzLmhpZ2hsaWdodCgpO1xuXHQgICAgfSwgMTUwKTtcblx0fSwgMTUwKTtcbiAgICB9O1xuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIGZlYXR1cmVzIChyZWN0YW5nbGVzKSBmb3IgdGhlIHNwZWNpZmllZCBzeW50ZW55IGJsb2Nrcy5cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgICBzYmxvY2tzIChEMyBzZWxlY3Rpb24gb2YgZy5zYmxvY2sgbm9kZXMpIC0gbXVsdGlsZXZlbCBzZWxlY3Rpb24uXG4gICAgLy8gICAgICAgIEFycmF5IChjb3JyZXNwb25kaW5nIHRvIHN0cmlwcykgb2YgYXJyYXlzIG9mIHN5bnRlbnkgYmxvY2tzLlxuICAgIC8vICAgICBkZXRhaWxlZCAoYm9vbGVhbikgaWYgdHJ1ZSwgZHJhd3MgZWFjaCBmZWF0dXJlIGluIGZ1bGwgZGV0YWlsIChpZSxcbiAgICAvLyAgICAgICAgc2hvdyBleG9uIHN0cnVjdHVyZSBpZiBhdmFpbGFibGUpLiBPdGhlcndpc2UgKHRoZSBkZWZhdWx0KSwgZHJhd1xuICAgIC8vICAgICAgICBlYWNoIGZlYXR1cmUgYXMganVzdCBhIHJlY3RhbmdsZS5cbiAgICAvL1xuICAgIGRyYXdGZWF0dXJlcyAoc2Jsb2Nrcykge1xuXHQvLyBiZWZvcmUgZG9pbmcgYW55dGhpbmcgZWxzZS4uLlxuXHRpZiAodGhpcy5jbGVhckFsbClcblx0ICAgIHNibG9ja3Muc2VsZWN0QWxsKCcuZmVhdHVyZScpLnJlbW92ZSgpO1xuXHQvLyBvaywgbm93IHRoYXQncyB0YWtlbiBjYXJlIG9mLi4uXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblx0Ly9cblx0Ly8gbmV2ZXIgZHJhdyB0aGUgc2FtZSBmZWF0dXJlIHR3aWNlIGluIG9uZSByZW5kZXJpbmcgcGFzc1xuXHRsZXQgZHJhd24gPSBuZXcgU2V0KCk7XHQvLyBzZXQgb2YgSURzIG9mIGRyYXduIGZlYXR1cmVzXG5cdGxldCBmaWx0ZXJEcmF3biA9IGZ1bmN0aW9uIChmKSB7XG5cdCAgICAvLyByZXR1cm5zIHRydWUgaWYgd2UndmUgbm90IHNlZW4gdGhpcyBvbmUgYmVmb3JlLlxuXHQgICAgLy8gcmVnaXN0ZXJzIHRoYXQgd2UndmUgc2VlbiBpdC5cblx0ICAgIGxldCBmaWQgPSBmLklEO1xuXHQgICAgbGV0IHYgPSAhIGRyYXduLmhhcyhmaWQpO1xuXHQgICAgZHJhd24uYWRkKGZpZCk7XG5cdCAgICByZXR1cm4gdjtcblx0fTtcblx0Ly9cblx0bGV0IGZlYXRzID0gc2Jsb2Nrcy5zZWxlY3QoJ1tuYW1lPVwibGF5ZXIxXCJdJykuc2VsZWN0QWxsKCcuZmVhdHVyZScpXG5cdCAgICAuZGF0YShkPT5kLmZlYXR1cmVzLmZpbHRlcihmaWx0ZXJEcmF3biksIGQ9PmQuSUQpO1xuXHRmZWF0cy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGxldCBuZXdGZWF0cztcblx0aWYgKHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzKSB7XG5cdCAgICAvLyBkcmF3IGRldGFpbGVkIGZlYXR1cmVzXG5cdCAgICBuZXdGZWF0cyA9IGZlYXRzLmVudGVyKCkuYXBwZW5kKCdnJylcblx0XHQuYXR0cignY2xhc3MnLCBmID0+ICdmZWF0dXJlIGRldGFpbGVkICcgKyAoZi5zdHJhbmQ9PT0nLScgPyAnIG1pbnVzJyA6ICcgcGx1cycpKVxuXHRcdC5hdHRyKCduYW1lJywgZiA9PiBmLklEKVxuXHRcdDtcblx0ICAgIG5ld0ZlYXRzLmFwcGVuZCgncmVjdCcpXG5cdFx0LnN0eWxlKCdmaWxsJywgZiA9PiBzZWxmLmFwcC5jc2NhbGUoZi5nZXRNdW5nZWRUeXBlKCkpKVxuXHRcdDtcblx0ICAgIG5ld0ZlYXRzLmFwcGVuZCgnbGluZScpXG5cdCAgICAgICAgLmF0dHIoJ2NsYXNzJywnYXhpcycpXG5cdCAgICAgICAgO1xuXHQgICAgbmV3RmVhdHMuYXBwZW5kKCdnJylcblx0ICAgICAgICAuYXR0cignY2xhc3MnLCdleG9ucycpXG5cdFx0O1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgLy8gZHJhdyBzaW1wbGUgZmVhdHVyZXNcblx0ICAgIG5ld0ZlYXRzID0gZmVhdHMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuXHRcdC5hdHRyKCdjbGFzcycsIGYgPT4gJ2ZlYXR1cmUnICsgKGYuc3RyYW5kPT09Jy0nID8gJyBtaW51cycgOiAnIHBsdXMnKSlcblx0XHQuYXR0cignbmFtZScsIGYgPT4gZi5JRClcblx0XHQuc3R5bGUoJ2ZpbGwnLCBmID0+IHNlbGYuYXBwLmNzY2FsZShmLmdldE11bmdlZFR5cGUoKSkpXG5cdFx0O1xuXHR9XG5cdC8vIE5COiBpZiB5b3UgYXJlIGxvb2tpbmcgZm9yIGNsaWNrIGhhbmRsZXJzLCB0aGV5IGFyZSBhdCB0aGUgc3ZnIGxldmVsIChzZWUgaW5pdERvbSBhYm92ZSkuXG5cblx0Ly8gcmV0dXJucyB0aGUgc3ludGVueSBibG9jayBjb250YWluaW5nIHRoaXMgZmVhdHVyZVxuXHRsZXQgZkJsb2NrID0gZnVuY3Rpb24gKGZlYXRFbHQpIHtcblx0ICAgIGxldCBibGtFbHQgPSBmZWF0RWx0LmNsb3Nlc3QoJy5zQmxvY2snKTtcblx0ICAgIHJldHVybiBibGtFbHQuX19kYXRhX187XG5cdH1cblx0Ly8gUmV0dXJucyB0aGUgc2NlbmUgeCBjb29yZGluYXRlIGZvciB0aGUgZ2l2ZW4gZmVhdHVyZS5cblx0bGV0IGZ4ID0gZnVuY3Rpb24oZikge1xuXHQgICAgbGV0IGIgPSBmQmxvY2sodGhpcyk7XG5cdCAgICByZXR1cm4gYi54c2NhbGUoTWF0aC5tYXgoZi5zdGFydCxiLnN0YXJ0KSlcblx0fTtcblx0Ly8gUmV0dXJucyB0aGUgc2NlbmUgd2lkdGggZm9yIHRoZSBnaXZlbiBmZWF0dXJlLlxuXHRsZXQgZncgPSBmdW5jdGlvbiAoZikge1xuXHQgICAgbGV0IGIgPSBmQmxvY2sodGhpcyk7XG5cdCAgICBpZiAoZi5lbmQgPCBiLnN0YXJ0IHx8IGYuc3RhcnQgPiBiLmVuZCkgcmV0dXJuIDA7XG5cdCAgICByZXR1cm4gTWF0aC5hYnMoYi54c2NhbGUoTWF0aC5taW4oZi5lbmQsYi5lbmQpKSAtIGIueHNjYWxlKE1hdGgubWF4KGYuc3RhcnQsYi5zdGFydCkpKSArIDE7XG5cdH07XG5cdC8vIFJldHVybnMgdGhlIHNjZW5lIHkgY29vcmRpbmF0ZSAocHgpIGZvciB0aGUgZ2l2ZW4gZmVhdHVyZS5cblx0bGV0IGZ5ID0gZnVuY3Rpb24gKGYpIHtcblx0ICAgICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgICAgaWYgKGYuc3RyYW5kID09ICcrJyl7XG5cdFx0ICAgaWYgKGIuZmxpcCkgXG5cdFx0ICAgICAgIHJldHVybiBzZWxmLmNmZy5sYW5lSGVpZ2h0KmYubGFuZSAtIHNlbGYuY2ZnLmZlYXRIZWlnaHQ7IFxuXHRcdCAgIGVsc2UgXG5cdFx0ICAgICAgIHJldHVybiAtc2VsZi5jZmcubGFuZUhlaWdodCpmLmxhbmU7XG5cdCAgICAgICB9XG5cdCAgICAgICBlbHNlIHtcblx0XHQgICAvLyBmLmxhbmUgaXMgbmVnYXRpdmUgZm9yICctJyBzdHJhbmRcblx0XHQgICBpZiAoYi5mbGlwKSBcblx0XHQgICAgICAgcmV0dXJuIHNlbGYuY2ZnLmxhbmVIZWlnaHQqZi5sYW5lO1xuXHRcdCAgIGVsc2Vcblx0XHQgICAgICAgcmV0dXJuIC1zZWxmLmNmZy5sYW5lSGVpZ2h0KmYubGFuZSAtIHNlbGYuY2ZnLmZlYXRIZWlnaHQ7IFxuXHQgICAgICAgfVxuXHQgICB9O1xuXG5cdC8vIFNldCBwb3NpdGlvbiBhbmQgc2l6ZSBhdHRyaWJ1dGVzIG9mIHRoZSBvdmVyYWxsIGZlYXR1cmUgcmVjdC5cblx0KHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzID8gZmVhdHMuc2VsZWN0KCdyZWN0JykgOiBmZWF0cylcblx0ICAuYXR0cigneCcsIGZ4KVxuXHQgIC5hdHRyKCd5JywgZnkpXG5cdCAgLmF0dHIoJ3dpZHRoJywgZncpXG5cdCAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuY2ZnLmZlYXRIZWlnaHQpXG5cdCAgO1xuXG5cdC8vIGRyYXcgZGV0YWlsZWQgZmVhdHVyZVxuXHRpZiAodGhpcy5zaG93RmVhdHVyZURldGFpbHMpIHtcblx0ICAgIC8vIGRyYXcgYXhpcyBsaW5lXG5cdCAgICBmZWF0cy5zZWxlY3QoJ2xpbmUnKVxuXHQgICAgICAgIC5hdHRyKCd4MScsIGZ4KVxuXHRcdC5hdHRyKCd5MScsIGZ5KVxuXHRcdC5hdHRyKCd4MicsIGZ1bmN0aW9uIChmKSB7IHJldHVybiBmeC5iaW5kKHRoaXMpKGYpICsgZncuYmluZCh0aGlzKShmKSAtIDEgfSlcblx0XHQuYXR0cigneTInLCBmeSlcblx0XHQuYXR0cigndHJhbnNmb3JtJyxgdHJhbnNsYXRlKDAsJHt0aGlzLmNmZy5mZWF0SGVpZ2h0LzJ9KWApXG5cdFx0LmF0dHIoJ3N0cm9rZScsIGYgPT4gdGhpcy5hcHAuY3NjYWxlKGYuZ2V0TXVuZ2VkVHlwZSgpKSlcblx0XHQ7XG5cdCAgICAvLyBkcmF3IGV4b25zXG5cdCAgICBsZXQgZkRhdGEgPSBmZWF0cy5kYXRhKCk7XG5cdCAgICBsZXQgZ2VuZUlkcyA9IGZEYXRhLm1hcChmID0+IGYuSUQpO1xuXHQgICAgbGV0IGVncnBzID0gZmVhdHMuc2VsZWN0KCdnLmV4b25zJyk7XG5cdCAgICBsZXQgZXhvbnMgPSBlZ3Jwcy5zZWxlY3RBbGwoJy5leG9uJylcblx0XHQuZGF0YShmID0+IGYuZXhvbnMgfHwgW10sIGUgPT4gZS5JRClcblx0XHQ7XG5cdCAgICBleG9ucy5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG5cdFx0LmF0dHIoJ2NsYXNzJywnZXhvbicpXG5cdFx0LnN0eWxlKCdmaWxsJywgZSA9PiB0aGlzLmFwcC5jc2NhbGUoZS5mZWF0dXJlLmdldE11bmdlZFR5cGUoKSkpXG5cdFx0LmFwcGVuZCgndGl0bGUnKVxuXHRcdCAgICAudGV4dChlID0+ICdleG9uOiAnK2UuSUQpXG5cdFx0ICAgIDtcblx0ICAgIGV4b25zLmV4aXQoKS5yZW1vdmUoKTtcblx0ICAgIGV4b25zLmF0dHIoJ25hbWUnLCBlID0+IGUucHJpbWFyeUlkZW50aWZpZXIpXG5cdCAgICAgICAgLmF0dHIoJ3gnLCBmeClcblx0ICAgICAgICAuYXR0cigneScsIGZ1bmN0aW9uKGUpIHtyZXR1cm4gZnkuYmluZCh0aGlzKShlLmZlYXR1cmUpfSlcblx0ICAgICAgICAuYXR0cignd2lkdGgnLCBmdylcblx0ICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5jZmcuZmVhdEhlaWdodClcblx0XHQ7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIGZlYXR1cmUgaGlnaGxpZ2h0aW5nIGluIHRoZSBjdXJyZW50IHpvb20gdmlldy5cbiAgICAvLyBGZWF0dXJlcyB0byBiZSBoaWdobGlnaHRlZCBpbmNsdWRlIHRob3NlIGluIHRoZSBoaUZlYXRzIGxpc3QgcGx1cyB0aGUgZmVhdHVyZVxuICAgIC8vIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHJlY3RhbmdsZSBhcmd1bWVudCwgaWYgZ2l2ZW4uIChUaGUgbW91c2VvdmVyIGZlYXR1cmUuKVxuICAgIC8vXG4gICAgLy8gRHJhd3MgZmlkdWNpYWxzIGZvciBmZWF0dXJlcyBpbiB0aGlzIGxpc3QgdGhhdDpcbiAgICAvLyAxLiBvdmVybGFwIHRoZSBjdXJyZW50IHpvb21WaWV3IGNvb3JkIHJhbmdlXG4gICAgLy8gMi4gYXJlIG5vdCByZW5kZXJlZCBpbnZpc2libGUgYnkgY3VycmVudCBmYWNldCBzZXR0aW5nc1xuICAgIC8vXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBjdXJyZW50IChyZWN0IGVsZW1lbnQpIE9wdGlvbmFsLiBBZGQnbCByZWN0YW5nbGUgZWxlbWVudCwgZS5nLiwgdGhhdCB3YXMgbW91c2VkLW92ZXIuIEhpZ2hsaWdodGluZ1xuICAgIC8vICAgICAgICB3aWxsIGluY2x1ZGUgdGhlIGZlYXR1cmUgY29ycmVzcG9uZGluZyB0byB0aGlzIHJlY3QgYWxvbmcgd2l0aCB0aG9zZSBpbiB0aGUgaGlnaGxpZ2h0IGxpc3QuXG4gICAgLy8gICAgcHVsc2VDdXJyZW50IChib29sZWFuKSBJZiB0cnVlIGFuZCBjdXJyZW50IGlzIGdpdmVuLCBjYXVzZSBpdCB0byBwdWxzZSBicmllZmx5LlxuICAgIC8vXG4gICAgaGlnaGxpZ2h0IChjdXJyZW50LCBwdWxzZUN1cnJlbnQpIHtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHQvLyBjdXJyZW50IGZlYXR1cmVcblx0bGV0IGN1cnJGZWF0ID0gY3VycmVudCA/IChjdXJyZW50IGluc3RhbmNlb2YgRmVhdHVyZSA/IGN1cnJlbnQgOiBjdXJyZW50Ll9fZGF0YV9fKSA6IG51bGw7XG5cdC8vIGNyZWF0ZSBsb2NhbCBjb3B5IG9mIGhpRmVhdHMsIHdpdGggY3VycmVudCBmZWF0dXJlIGFkZGVkXG5cdGxldCBoaUZlYXRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5oaUZlYXRzLCB0aGlzLmFwcC5jdXJyTGlzdEluZGV4IHx8e30pO1xuXHRpZiAoY3VyckZlYXQpIHtcblx0ICAgIGhpRmVhdHNbY3VyckZlYXQuaWRdID0gY3VyckZlYXQuaWQ7XG5cdH1cblxuXHQvLyBGaWx0ZXIgYWxsIGZlYXR1cmVzIChyZWN0YW5nbGVzKSBpbiB0aGUgc2NlbmUgZm9yIHRob3NlIGJlaW5nIGhpZ2hsaWdodGVkLlxuXHQvLyBBbG9uZyB0aGUgd2F5LCBidWlsZCBpbmRleCBtYXBwaW5nIGZlYXR1cmUgaWQgdG8gaXRzICdzdGFjaycgb2YgZXF1aXZhbGVudCBmZWF0dXJlcyxcblx0Ly8gaS5lLiBhIGxpc3Qgb2YgaXRzIGdlbm9sb2dzIHNvcnRlZCBieSB5IGNvb3JkaW5hdGUuXG5cdC8vXG5cdHRoaXMuc3RhY2tzID0ge307IC8vIGZpZCAtPiBbIHJlY3RzIF0gXG5cdGxldCBkaCA9IHRoaXMuY2ZnLmJsb2NrSGVpZ2h0LzIgLSB0aGlzLmNmZy5mZWF0SGVpZ2h0O1xuICAgICAgICBsZXQgZmVhdHMgPSB0aGlzLnN2Z01haW4uc2VsZWN0QWxsKCcuZmVhdHVyZScpXG5cdCAgLy8gZmlsdGVyIHJlY3QuZmVhdHVyZXMgZm9yIHRob3NlIGluIHRoZSBoaWdobGlnaHQgbGlzdFxuXHQgIC5maWx0ZXIoZnVuY3Rpb24oZmYpe1xuXHQgICAgICAvLyBoaWdobGlnaHQgZmYgaWYgZWl0aGVyIGlkIGlzIGluIHRoZSBsaXN0IEFORCBpdCdzIG5vdCBiZWVuIGhpZGRlblxuXHQgICAgICBsZXQgbWdpID0gaGlGZWF0c1tmZi5jYW5vbmljYWxdO1xuXHQgICAgICBsZXQgbWdwID0gaGlGZWF0c1tmZi5JRF07XG5cdCAgICAgIGxldCBzaG93aW5nID0gZDMuc2VsZWN0KHRoaXMpLnN0eWxlKCdkaXNwbGF5JykgIT09ICdub25lJztcblx0ICAgICAgbGV0IGhsID0gc2hvd2luZyAmJiAobWdpIHx8IG1ncCk7XG5cdCAgICAgIGlmIChobCkge1xuXHRcdCAgLy8gZm9yIGVhY2ggaGlnaGxpZ2h0ZWQgZmVhdHVyZSwgYWRkIGl0cyByZWN0YW5nbGUgdG8gdGhlIGxpc3Rcblx0XHQgIGxldCBrID0gZmYuaWQ7XG5cdFx0ICBpZiAoIXNlbGYuc3RhY2tzW2tdKSBzZWxmLnN0YWNrc1trXSA9IFtdXG5cdFx0ICAvLyBpZiBzaG93aW5nIGZlYXR1cmUgZGV0YWlscywgLmZlYXR1cmUgaXMgYSBncm91cCB3aXRoIHRoZSByZWN0IGFzIHRoZSBmaXJzdCBjaGlsZC5cblx0XHQgIC8vIG90aGVyd2lzZSwgLmZlYXR1cmUgaXMgdGhlIHJlY3QgaXRzZWxmLlxuXHRcdCAgc2VsZi5zdGFja3Nba10ucHVzaCh0aGlzLnRhZ05hbWUgPT09ICdnJyA/IHRoaXMuY2hpbGROb2Rlc1swXSA6IHRoaXMpXG5cdCAgICAgIH1cblx0ICAgICAgLy8gXG5cdCAgICAgIGQzLnNlbGVjdCh0aGlzKVxuXHRcdCAgLmNsYXNzZWQoJ2hpZ2hsaWdodCcsIGhsKVxuXHRcdCAgLmNsYXNzZWQoJ2N1cnJlbnQnLCBobCAmJiBjdXJyRmVhdCAmJiB0aGlzLl9fZGF0YV9fLmlkID09PSBjdXJyRmVhdC5pZClcblx0XHQgIC5jbGFzc2VkKCdleHRyYScsIHB1bHNlQ3VycmVudCAmJiBmZiA9PT0gY3VyckZlYXQpXG5cdCAgICAgIHJldHVybiBobDtcblx0ICB9KVxuXHQgIDtcblxuXHR0aGlzLmRyYXdGaWR1Y2lhbHMoY3VyckZlYXQpO1xuXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgcG9seWdvbnMgdGhhdCBjb25uZWN0IGhpZ2hsaWdodGVkIGZlYXR1cmVzIGluIHRoZSB2aWV3XG4gICAgLy9cbiAgICBkcmF3RmlkdWNpYWxzIChjdXJyRmVhdCkge1xuXHQvLyBidWlsZCBkYXRhIGFycmF5IGZvciBkcmF3aW5nIGZpZHVjaWFscyBiZXR3ZWVuIGVxdWl2YWxlbnQgZmVhdHVyZXNcblx0bGV0IGRhdGEgPSBbXTtcblx0Zm9yIChsZXQgayBpbiB0aGlzLnN0YWNrcykge1xuXHQgICAgLy8gZm9yIGVhY2ggaGlnaGxpZ2h0ZWQgZmVhdHVyZSwgc29ydCB0aGUgcmVjdGFuZ2xlcyBpbiBpdHMgbGlzdCBieSBZLWNvb3JkaW5hdGVcblx0ICAgIGxldCByZWN0cyA9IHRoaXMuc3RhY2tzW2tdO1xuXHQgICAgcmVjdHMuc29ydCggKGEsYikgPT4gcGFyc2VGbG9hdChhLmdldEF0dHJpYnV0ZSgneScpKSAtIHBhcnNlRmxvYXQoYi5nZXRBdHRyaWJ1dGUoJ3knKSkgKTtcblx0ICAgIHJlY3RzLnNvcnQoIChhLGIpID0+IHtcblx0XHRyZXR1cm4gYS5fX2RhdGFfXy5nZW5vbWUuem9vbVkgLSBiLl9fZGF0YV9fLmdlbm9tZS56b29tWTtcblx0ICAgIH0pO1xuXHQgICAgLy8gV2FudCBhIHBvbHlnb24gYmV0d2VlbiBlYWNoIHN1Y2Nlc3NpdmUgcGFpciBvZiBpdGVtcy4gVGhlIGZvbGxvd2luZyBjcmVhdGVzIGEgbGlzdCBvZlxuXHQgICAgLy8gbiBwYWlycywgd2hlcmUgcmVjdFtpXSBpcyBwYWlyZWQgd2l0aCByZWN0W2krMV0uIFRoZSBsYXN0IHBhaXIgY29uc2lzdHMgb2YgdGhlIGxhc3Rcblx0ICAgIC8vIHJlY3RhbmdsZSBwYWlyZWQgd2l0aCB1bmRlZmluZWQuIChXZSB3YW50IHRoaXMuKVxuXHQgICAgbGV0IHBhaXJzID0gcmVjdHMubWFwKChyLCBpKSA9PiBbcixyZWN0c1tpKzFdXSk7XG5cdCAgICAvLyBBZGQgYSBjbGFzcyAoJ2N1cnJlbnQnKSBmb3IgdGhlIHBvbHlnb25zIGFzc29jaWF0ZWQgd2l0aCB0aGUgbW91c2VvdmVyIGZlYXR1cmUgc28gdGhleVxuXHQgICAgLy8gY2FuIGJlIGRpc3Rpbmd1aXNoZWQgZnJvbSBvdGhlcnMuXG5cdCAgICBkYXRhLnB1c2goeyBmaWQ6IGssIHJlY3RzOiBwYWlycywgY2xzOiAoY3VyckZlYXQgJiYgY3VyckZlYXQuaWQgPT09IGsgPyAnY3VycmVudCcgOiAnJykgfSk7XG5cdH1cblxuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdC8vXG5cdC8vIHB1dCBmaWR1Y2lhbCBtYXJrcyBpbiB0aGVpciBvd24gZ3JvdXAgXG5cdGxldCBmR3JwID0gdGhpcy5maWR1Y2lhbHMuY2xhc3NlZCgnaGlkZGVuJywgZmFsc2UpO1xuXG5cdC8vIEJpbmQgZmlyc3QgbGV2ZWwgZGF0YSB0byAnZmVhdHVyZU1hcmtzJyBncm91cHNcblx0bGV0IGZmR3JwcyA9IGZHcnAuc2VsZWN0QWxsKCdnLmZlYXR1cmVNYXJrcycpXG5cdCAgICAuZGF0YShkYXRhLCBkID0+IGQuZmlkKTtcblx0ZmZHcnBzLmVudGVyKCkuYXBwZW5kKCdnJylcblx0ICAgIC5hdHRyKCduYW1lJywgZCA9PiBkLmZpZCk7XG5cdGZmR3Jwcy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGZmR3Jwcy5hdHRyKCdjbGFzcycsIGQgPT4ge1xuICAgICAgICAgICAgbGV0IGNsYXNzZXMgPSBbJ2ZlYXR1cmVNYXJrcyddO1xuXHQgICAgZC5jbHMgJiYgY2xhc3Nlcy5wdXNoKGQuY2xzKTtcblx0ICAgIHRoaXMuYXBwLmN1cnJMaXN0SW5kZXhbZC5maWRdICYmIGNsYXNzZXMucHVzaCgnbGlzdEl0ZW0nKVxuXHQgICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuXHR9KTtcblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIERyYXcgdGhlIGNvbm5lY3RvciBwb2x5Z29ucy5cblx0Ly8gQmluZCBzZWNvbmQgbGV2ZWwgZGF0YSAocmVjdGFuZ2xlIHBhaXJzKSB0byBwb2x5Z29ucyBpbiB0aGUgZ3JvdXBcblx0bGV0IHBnb25zID0gZmZHcnBzLnNlbGVjdEFsbCgncG9seWdvbicpXG5cdCAgICAuZGF0YShkPT5kLnJlY3RzLmZpbHRlcihyID0+IHJbMF0gJiYgclsxXSkpO1xuXHRwZ29ucy5lbnRlcigpLmFwcGVuZCgncG9seWdvbicpXG5cdCAgICAuYXR0cignY2xhc3MnLCdmaWR1Y2lhbCcpXG5cdCAgICA7XG5cdC8vXG5cdHBnb25zLmF0dHIoJ3BvaW50cycsIHIgPT4ge1xuXHQgICAgdHJ5IHtcblx0ICAgIC8vIHBvbHlnb24gY29ubmVjdHMgYm90dG9tIGNvcm5lcnMgb2YgMXN0IHJlY3QgdG8gdG9wIGNvcm5lcnMgb2YgMm5kIHJlY3Rcblx0ICAgIGxldCBjMSA9IGNvb3Jkc0FmdGVyVHJhbnNmb3JtKHJbMF0pOyAvLyB0cmFuc2Zvcm0gY29vcmRzIGZvciAxc3QgcmVjdFxuXHQgICAgbGV0IGMyID0gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0oclsxXSk7ICAvLyB0cmFuc2Zvcm0gY29vcmRzIGZvciAybmQgcmVjdFxuXHQgICAgci50Y29vcmRzID0gW2MxLGMyXTtcblx0ICAgIC8vIGZvdXIgcG9seWdvbiBwb2ludHNcblx0ICAgIGxldCBzID0gYCR7YzEueH0sJHtjMS55K2MxLmhlaWdodH0gJHtjMi54fSwke2MyLnl9ICR7YzIueCtjMi53aWR0aH0sJHtjMi55fSAke2MxLngrYzEud2lkdGh9LCR7YzEueStjMS5oZWlnaHR9YFxuXHQgICAgcmV0dXJuIHM7XG5cdCAgICB9XG5cdCAgICBjYXRjaCAoZSkge1xuXHQgICAgICAgIGNvbnNvbGUubG9nKFwiQ2F1Z2h0IGVycm9yOlwiLCBlKTtcblx0XHRyZXR1cm4gJyc7XG5cdCAgICB9XG5cdH0pXG5cdC8vIG1vdXNpbmcgb3ZlciB0aGUgZmlkdWNpYWwgaGlnaGxpZ2h0cyAoYXMgaWYgdGhlIHVzZXIgaGFkIG1vdXNlZCBvdmVyIHRoZSBmZWF0dXJlIGl0c2VsZilcblx0Lm9uKCdtb3VzZW92ZXInLCAocCkgPT4ge1xuXHQgICAgdGhpcy5oaWdobGlnaHQocFswXSk7XG5cdH0pXG5cdC5vbignbW91c2VvdXQnLCAgKHApID0+IHtcblx0ICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXHQvL1xuXHRwZ29ucy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRHJhdyBmZWF0dXJlIGxhYmVscy4gRWFjaCBsYWJlbCBpcyBkcmF3biBvbmNlLCBhYm92ZSB0aGUgZmlyc3QgcmVjdGFuZ2xlIGluIGl0cyBsaXN0LlxuXHQvLyBUaGUgZXhjZXB0aW9uIGlzIHRoZSBjdXJyZW50IChtb3VzZW92ZXIpIGZlYXR1cmUsIHdoZXJlIHRoZSBsYWJlbCBpcyBkcmF3biBhYm92ZSB0aGF0IGZlYXR1cmUuXG5cdGxldCBsYWJlbHMgPSBmZkdycHMuc2VsZWN0QWxsKCd0ZXh0LmZlYXRMYWJlbCcpXG5cdCAgICAuZGF0YShkID0+IHtcblx0XHRsZXQgciA9IGQucmVjdHNbMF1bMF07XG5cdFx0aWYgKGN1cnJGZWF0ICYmIChkLmZpZCA9PT0gY3VyckZlYXQuSUQgfHwgZC5maWQgPT09IGN1cnJGZWF0LmNhbm9uaWNhbCkpe1xuXHRcdCAgICBsZXQgcjIgPSBkLnJlY3RzLm1hcCggcnIgPT5cblx0XHQgICAgICAgcnJbMF0uX19kYXRhX18gPT09IGN1cnJGZWF0ID8gcnJbMF0gOiByclsxXSYmcnJbMV0uX19kYXRhX18gPT09IGN1cnJGZWF0ID8gcnJbMV0gOiBudWxsXG5cdFx0ICAgICAgICkuZmlsdGVyKHg9PngpWzBdO1xuXHRcdCAgICByID0gcjIgPyByMiA6IHI7XG5cdFx0fVxuXHQgICAgICAgIHJldHVybiBbe1xuXHRcdCAgICBmaWQ6IGQuZmlkLFxuXHRcdCAgICByZWN0OiByLFxuXHRcdCAgICB0cmVjdDogY29vcmRzQWZ0ZXJUcmFuc2Zvcm0ocilcblx0XHR9XTtcblx0ICAgIH0pO1xuXG5cdC8vIERyYXcgdGhlIHRleHQuXG5cdGxhYmVscy5lbnRlcigpLmFwcGVuZCgndGV4dCcpLmF0dHIoJ2NsYXNzJywnZmVhdExhYmVsJyk7XG5cdGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XG5cdGxhYmVsc1xuXHQgIC5hdHRyKCd4JywgZCA9PiBkLnRyZWN0LnggKyBkLnRyZWN0LndpZHRoLzIgKVxuXHQgIC5hdHRyKCd5JywgZCA9PiBkLnJlY3QuX19kYXRhX18uZ2Vub21lLnpvb21ZKzE1KVxuXHQgIC50ZXh0KGQgPT4ge1xuXHQgICAgICAgbGV0IGYgPSBkLnJlY3QuX19kYXRhX187XG5cdCAgICAgICBsZXQgc3ltID0gZi5zeW1ib2wgfHwgZi5JRDtcblx0ICAgICAgIHJldHVybiBzeW07XG5cdCAgfSk7XG5cblx0Ly8gUHV0IGEgcmVjdGFuZ2xlIGJlaGluZCBlYWNoIGxhYmVsIGFzIGEgYmFja2dyb3VuZFxuXHRsZXQgbGJsQm94RGF0YSA9IGxhYmVscy5tYXAobGJsID0+IGxibFswXS5nZXRCQm94KCkpXG5cdGxldCBsYmxCb3hlcyA9IGZmR3Jwcy5zZWxlY3RBbGwoJ3JlY3QuZmVhdExhYmVsQm94Jylcblx0ICAgIC5kYXRhKChkLGkpID0+IFtsYmxCb3hEYXRhW2ldXSk7XG5cdGxibEJveGVzLmVudGVyKCkuaW5zZXJ0KCdyZWN0JywndGV4dCcpLmF0dHIoJ2NsYXNzJywnZmVhdExhYmVsQm94Jyk7XG5cdGxibEJveGVzLmV4aXQoKS5yZW1vdmUoKTtcblx0bGJsQm94ZXNcblx0ICAgIC5hdHRyKCd4JywgICAgICBiYiA9PiBiYi54LTIpXG5cdCAgICAuYXR0cigneScsICAgICAgYmIgPT4gYmIueS0xKVxuXHQgICAgLmF0dHIoJ3dpZHRoJywgIGJiID0+IGJiLndpZHRoKzQpXG5cdCAgICAuYXR0cignaGVpZ2h0JywgYmIgPT4gYmIuaGVpZ2h0KzIpXG5cdCAgICA7XG5cdFxuXHQvLyBpZiB0aGVyZSBpcyBhIGN1cnJGZWF0LCBtb3ZlIGl0cyBmaWR1Y2lhbHMgdG8gdGhlIGVuZCAoc28gdGhleSdyZSBvbiB0b3Agb2YgZXZlcnlvbmUgZWxzZSlcblx0aWYgKGN1cnJGZWF0KSB7XG5cdCAgICAvLyBnZXQgbGlzdCBvZiBncm91cCBlbGVtZW50cyBmcm9tIHRoZSBkMyBzZWxlY3Rpb25cblx0ICAgIGxldCBmZkxpc3QgPSBmZkdycHNbMF07XG5cdCAgICAvLyBmaW5kIHRoZSBvbmUgd2hvc2UgZmVhdHVyZSBpcyBjdXJyRmVhdFxuXHQgICAgbGV0IGkgPSAtMTtcblx0ICAgIGZmTGlzdC5mb3JFYWNoKCAoZyxqKSA9PiB7IGlmIChnLl9fZGF0YV9fLmZpZCA9PT0gY3VyckZlYXQuaWQpIGkgPSBqOyB9KTtcblx0ICAgIC8vIGlmIHdlIGZvdW5kIGl0IGFuZCBpdCdzIG5vdCBhbHJlYWR5IHRoZSBsYXN0LCBtb3ZlIGl0IHRvIHRoZVxuXHQgICAgLy8gbGFzdCBwb3NpdGlvbiBhbmQgcmVvcmRlciBpbiB0aGUgRE9NLlxuXHQgICAgaWYgKGkgPj0gMCkge1xuXHRcdGxldCBsYXN0aSA9IGZmTGlzdC5sZW5ndGggLSAxO1xuXHQgICAgICAgIGxldCB4ID0gZmZMaXN0W2ldO1xuXHRcdGZmTGlzdFtpXSA9IGZmTGlzdFtsYXN0aV07XG5cdFx0ZmZMaXN0W2xhc3RpXSA9IHg7XG5cdFx0ZmZHcnBzLm9yZGVyKCk7XG5cdCAgICB9XG5cdH1cblx0XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZGVGaWR1Y2lhbHMgKCkge1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0KCdnLmZpZHVjaWFscycpXG5cdCAgICAuY2xhc3NlZCgnaGlkZGVuJywgdHJ1ZSk7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgWm9vbVZpZXdcblxuZXhwb3J0IHsgWm9vbVZpZXcgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1pvb21WaWV3LmpzXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9